import React from 'react';

export default function ChatLoading(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Chat Application</h1>
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="h-[calc(100vh-300px)] p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1">
                  <div className="w-32 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="w-64 h-16 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 