import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function LoadingButton({
  onClick,
  loading,
  disabled,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button'
}: LoadingButtonProps): React.JSX.Element {
  const baseClasses = 'rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'cursor-wait' : disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        flex items-center justify-center gap-2
      `}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" color={variant === 'secondary' ? 'gray' : 'white'} />
          <span className="opacity-75">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
} 