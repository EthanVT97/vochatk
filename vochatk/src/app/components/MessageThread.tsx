'use client';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Message {
  id: number;
  text: string;
  type: 'system' | 'user';
  timestamp: string;
  userName?: string;
  userId?: string;
  imageUrl?: string;
  reactions?: { [key: string]: string[] };
  isEdited?: boolean;
  parentId?: number;
  readBy?: string[];
}

interface ThreadProps {
  parentMessage: Message;
  replies: Message[];
  currentUser: {
    id: string;
    email: string;
  } | null;
  onClose: () => void;
}

export default function MessageThread({ parentMessage, replies, currentUser, onClose }: ThreadProps) {
  const [replyText, setReplyText] = useState('');

  const handleSendReply = async () => {
    if (!currentUser || !replyText.trim()) return;

    const newReply = {
      text: replyText,
      type: 'user' as const,
      timestamp: new Date().toISOString(),
      userName: currentUser.email,
      userId: currentUser.id,
      parentId: parentMessage.id,
      reactions: {},
      readBy: [currentUser.id]
    };

    const { error } = await supabase
      .from('messages')
      .insert([newReply]);

    if (!error) {
      setReplyText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Thread</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Parent Message */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {parentMessage.userName?.[0]?.toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">
                  {parentMessage.userName}
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  {parentMessage.imageUrl ? (
                    <Image
                      src={parentMessage.imageUrl}
                      alt="Shared image"
                      width={300}
                      height={200}
                      className="rounded-lg"
                    />
                  ) : (
                    <p className="text-sm">{parentMessage.text}</p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(parentMessage.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Replies */}
          {replies.map((reply) => (
            <div key={reply.id} className="pl-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                    {reply.userName?.[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">
                    {reply.userName}
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    {reply.imageUrl ? (
                      <Image
                        src={reply.imageUrl}
                        alt="Shared image"
                        width={300}
                        height={200}
                        className="rounded-lg"
                      />
                    ) : (
                      <p className="text-sm">{reply.text}</p>
                    )}
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span>{new Date(reply.timestamp).toLocaleString()}</span>
                      {reply.isEdited && <span>(edited)</span>}
                      {reply.readBy && (
                        <span className="ml-auto text-green-600">
                          ✓ {reply.readBy.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Input */}
        <div className="mt-4 border-t pt-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Reply to thread..."
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleSendReply}
              disabled={!currentUser}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 