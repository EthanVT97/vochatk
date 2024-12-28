import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface MessageActionLoadingProps {
  action: 'edit' | 'delete' | 'react' | 'reply';
  position?: 'overlay' | 'inline';
}

export default function MessageActionLoading({
  action,
  position = 'overlay'
}: MessageActionLoadingProps): React.JSX.Element {
  const actionText = {
    edit: 'Editing message...',
    delete: 'Deleting message...',
    react: 'Adding reaction...',
    reply: 'Sending reply...'
  };

  if (position === 'overlay') {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
        <LoadingSpinner size="sm" text={actionText[action]} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <LoadingSpinner size="sm" />
      <span>{actionText[action]}</span>
    </div>
  );
} 