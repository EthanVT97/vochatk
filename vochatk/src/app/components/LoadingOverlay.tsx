'use client';

import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import AnimatedTransition from './AnimatedTransition';

interface LoadingOverlayProps {
  show: boolean;
  text?: string;
  variant?: 'fullscreen' | 'container' | 'minimal';
  spinnerVariant?: 'circle' | 'dots' | 'pulse' | 'bounce';
  blur?: boolean;
}

export default function LoadingOverlay({
  show,
  text,
  variant = 'container',
  spinnerVariant = 'circle',
  blur = true
}: LoadingOverlayProps): React.JSX.Element {
  const baseClasses = 'flex items-center justify-center';
  const variantClasses = {
    fullscreen: 'fixed inset-0 bg-black/50 z-50',
    container: 'absolute inset-0 bg-white/75 z-10',
    minimal: 'absolute inset-0 bg-transparent z-10'
  };
  const blurClasses = blur ? 'backdrop-blur-sm' : '';

  return (
    <AnimatedTransition
      show={show}
      type="fade"
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${blurClasses}
      `}
    >
      <div className="flex flex-col items-center">
        <LoadingSpinner
          variant={spinnerVariant}
          size={variant === 'minimal' ? 'sm' : 'lg'}
          color={variant === 'fullscreen' ? 'white' : 'blue'}
        />
        {text && (
          <AnimatedTransition
            show={true}
            type="slide"
            className="mt-4 text-sm font-medium text-gray-600"
          >
            {text}
          </AnimatedTransition>
        )}
      </div>
    </AnimatedTransition>
  );
} 