'use client'
import { useState, useEffect } from 'react';
import { Upload, File, Share2, Trash2, Download, X } from 'lucide-react';
import { apiService } from '../services/api';
import ShareDialog from './ShareDialog';

interface FileItem {
  id: string;
  fileName: string;
  fileSize: number;
}

const FileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await apiService.listFiles();
      setFiles(response.data);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await apiService.uploadFile(file, (progress) => {
          setUploadProgress(progress);
        });
        loadFiles(); // Refresh file list after upload
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
    setUploadProgress(null);
  };

  const handleDownload = async (fileId: string) => {
    try {
      const response = await apiService.downloadFile(Number(fileId));
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', files.find(f => f.id === fileId)?.fileName || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await apiService.deleteFile(Number(fileId));
        setFiles(files.filter(f => f.id !== fileId));
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
  };

  const handleShare = (file: FileItem) => {
    setSelectedFile(file);
    setShareDialogOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">Drag and drop files here, or</p>
            <label className="mt-4">
              <span className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                Browse Files
              </span>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    handleFiles(e.target.files);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {uploadProgress !== null && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Files</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium truncate" title={file.fileName}>
                        {file.fileName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Share"
                      onClick={() => handleShare(file)}
                    >
                      <Share2 className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Download"
                      onClick={() => handleDownload(file.id)}
                    >
                      <Download className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Delete"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedFile && (
        <ShareDialog
          isOpen={shareDialogOpen}
          onClose={() => {
            setShareDialogOpen(false);
            setSelectedFile(null);
          }}
          fileId={selectedFile.id}
          fileName={selectedFile.fileName}
        />
      )}
    </>
  );
};

export default FileManager;