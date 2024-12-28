import React from 'react';

export default function ProfileLoading(): React.JSX.Element {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse"></div>
          </div>

          {/* Email field */}
          <div>
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Display Name field */}
          <div>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Bio field */}
          <div>
            <div className="h-4 w-12 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-24 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 