'use client';

import React from 'react';
import AnimatedTransition from './AnimatedTransition';
import LoadingSpinner from './LoadingSpinner';

interface UploadProgressProps {
  progress: number;
  fileName: string;
  fileSize?: string;
  status?: 'uploading' | 'processing' | 'complete' | 'error';
  onCancel?: () => void;
  onRetry?: () => void;
}

export default function UploadProgress({
  progress,
  fileName,
  fileSize,
  status = 'uploading',
  onCancel,
  onRetry
}: UploadProgressProps): React.JSX.Element {
  const getStatusColor = () => {
    switch (status) {
      case 'complete': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return '✓';
      case 'error':
        return '✕';
      case 'processing':
        return <LoadingSpinner size="sm" variant="circle" color="blue" />;
      default:
        return null;
    }
  };

  return (
    <AnimatedTransition
      show={true}
      type="slide"
      className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 mr-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 truncate">
              {fileName}
            </span>
            {fileSize && (
              <span className="text-xs text-gray-500">
                ({fileSize})
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {status === 'uploading' && `Uploading... ${progress}%`}
            {status === 'processing' && 'Processing...'}
            {status === 'complete' && 'Upload complete'}
            {status === 'error' && 'Upload failed'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === 'error' && onRetry && (
            <button
              onClick={onRetry}
              className="text-blue-500 hover:text-blue-700"
            >
              ↺
            </button>
          )}
          {onCancel && status !== 'complete' && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-[progress_2s_linear_infinite]" />
        </div>
      </div>

      <AnimatedTransition
        show={status !== 'uploading'}
        type="fade"
        className="mt-2 flex justify-end"
      >
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center text-white text-sm
          ${status === 'complete' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-blue-500'}
        `}>
          {getStatusIcon()}
        </div>
      </AnimatedTransition>
    </AnimatedTransition>
  );
} 