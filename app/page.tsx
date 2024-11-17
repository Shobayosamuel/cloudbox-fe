'use client'
import React from 'react';
import { ArrowRight, Cloud, Lock, Share2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: <Cloud className="h-8 w-8 text-blue-500" />,
    title: 'Secure Cloud Storage',
    description: 'Store your files securely in the cloud with enterprise-grade encryption.'
  },
  {
    icon: <Share2 className="h-8 w-8 text-blue-500" />,
    title: 'Easy File Sharing',
    description: 'Share files with customizable links and expiration dates.'
  },
  {
    icon: <Lock className="h-8 w-8 text-blue-500" />,
    title: 'Private & Secure',
    description: 'Your data is encrypted and protected with advanced security measures.'
  },
  {
    icon: <Upload className="h-8 w-8 text-blue-500" />,
    title: 'Fast Uploads',
    description: 'Upload files quickly with our optimized cloud infrastructure.'
  }
];

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Cloud className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CloudBox</span>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => router.push('/auth/login')} className="text-gray-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </button>
              <button onClick={() => router.push('/register')} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Secure Cloud Storage</span>
                <span className="block text-blue-600">for Everyone</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Store, share, and access your files from anywhere. CloudBox provides secure cloud storage with easy file sharing capabilities.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Everything you need to manage your files
              </h2>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                  <div key={index} className="pt-6">
                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                      <div className="-mt-6">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-md shadow-lg">
                          {feature.icon}
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="mt-5 text-base text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <button className="text-gray-400 hover:text-gray-500">
              About
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              Privacy
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              Terms
            </button>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              © {new Date().getFullYear()} CloudBox. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}