'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'dots' | 'pulse' | 'bounce';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'white';
  text?: string;
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'circle',
  color = 'blue',
  text
}: LoadingSpinnerProps): React.JSX.Element {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'circle':
        return (
          <div 
            className={`
              animate-spin rounded-full border-2 border-t-transparent
              ${sizeClasses[size]} ${colorClasses[color]}
            `}
          />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`
                  rounded-full ${sizeClasses[size]} ${colorClasses[color]}
                  animate-[bounce_1s_ease-in-out_infinite]
                `}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div 
            className={`
              animate-pulse rounded-full
              ${sizeClasses[size]} ${colorClasses[color]}
              bg-current opacity-75
            `}
          />
        );
      
      case 'bounce':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`
                  ${sizeClasses[size]} ${colorClasses[color]}
                  animate-[bounce_1s_cubic-bezier(.8,0,1,1)_infinite]
                `}
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  width: '25%',
                  backgroundColor: 'currentColor'
                }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderSpinner()}
      {text && (
        <p className={`mt-2 text-sm text-${color === 'white' ? 'white' : 'gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );
} 