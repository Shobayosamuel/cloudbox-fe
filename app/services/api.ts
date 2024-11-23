// services/api.ts
import axios, { AxiosInstance } from 'axios';
import { log } from 'console';
console.log(process.env.NEXT_PUBLIC_API_URL)
class ApiService {
  public api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 30000, // 30 second timeout
      withCredentials: true, // Important for CORS with credentials
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error('Api request error', error);
        if (error.response?.status === 401) {
          // Try to refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('refreshToken', response.data.refreshToken);

              // Retry original request
              const config = error.config;
              config.headers.Authorization = `Bearer ${response.data.token}`;
              return this.api(config);
            } catch (refreshError) {
              // Refresh token failed, redirect to login
              localStorage.clear();
              window.location.href = '/auth/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }


  // Auth endpoints
  async login(username: string, password: string) {
    const response = await this.api.post('/auth/login', { username, password });
    this.setTokens(response.data.tokens);
    return response.data;
  }

  async register(username: string, email: string, password: string) {
    return await this.api.post('/auth/register', { username, email, password });
  }

  async refreshToken(refreshToken: string) {
    return await this.api.post('/auth/refresh', null, {
      headers: { 'Refresh-Token': refreshToken }
    });
  }

  // File endpoints
  async uploadFile(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    return await this.api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded * 100) / progressEvent.total;
          onProgress(progress);
        }
      }
    });
  }

  async listFiles() {
    return await this.api.get('/files');
  }

  async downloadFile(fileId: number) {
    return await this.api.get(`/files/${fileId}/download`);
  }

  async deleteFile(fileId: number) {
    return await this.api.delete(`/files/${fileId}`);
  }

  // Share endpoints
  async createShareLink(fileId: number, expiresIn: number) {
    return await this.api.post('/shares', { file_id: fileId, expires_in: expiresIn });
  }

  async listShares() {
    return await this.api.get('/shares');
  }

  async revokeShare(shareToken: string) {
    return await this.api.delete(`/shares/${shareToken}`);
  }

  private setTokens(tokens: { token: string; refreshToken: string }) {
    localStorage.setItem('token', tokens.token);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
}

export const apiService = new ApiService();