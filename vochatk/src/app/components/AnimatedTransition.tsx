'use client';

import React from 'react';

interface AnimatedTransitionProps {
  show: boolean;
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'rotate';
  duration?: 'fast' | 'normal' | 'slow';
  className?: string;
}

export default function AnimatedTransition({
  show,
  children,
  type = 'fade',
  duration = 'normal',
  className = ''
}: AnimatedTransitionProps): JSX.Element {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!mounted && !show) {
    return <></>;
  }

  const durationClasses = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500'
  };

  const transitionClasses = {
    fade: `transition-opacity ${durationClasses[duration]} ${show ? 'opacity-100' : 'opacity-0'}`,
    slide: `transition-all ${durationClasses[duration]} ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`,
    scale: `transition-all ${durationClasses[duration]} ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`,
    rotate: `transition-all ${durationClasses[duration]} ${show ? 'rotate-0 opacity-100' : 'rotate-12 opacity-0'}`
  };

  return (
    <div className={`${transitionClasses[type]} ${className}`}>
      {children}
    </div>
  );
} 