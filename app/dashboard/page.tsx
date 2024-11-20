'use client'
import { useAuth } from '../contexts/AuthContext';
import FileManager from '../components/FileManager';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server side
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">Welcome, {user?.username}</span>
                <button
                  onClick={logout}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-6">
          <FileManager />
        </main>
      </div>
    </ProtectedRoute>
  );
}