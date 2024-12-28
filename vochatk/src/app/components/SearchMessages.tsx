'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  id: number;
  text: string;
  userName?: string;
  timestamp: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

interface SearchMessagesProps {
  onMessageClick: (messageId: number) => void;
  onClose: () => void;
}

export default function SearchMessages({ onMessageClick, onClose }: SearchMessagesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`text.ilike.%${searchQuery}%, file_name.ilike.%${searchQuery}%`)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (data) {
        setResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Search Messages</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search messages..."
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                onMessageClick(result.id);
                onClose();
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {result.userName}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(result.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {result.fileName ? `File: ${result.fileName}` : result.text}
              </p>
              {(result.imageUrl || result.fileUrl) && (
                <div className="text-xs text-blue-600 mt-1">
                  {result.imageUrl ? '🖼️ Image' : '📎 File'} attached
                </div>
              )}
            </button>
          ))}
          {results.length === 0 && searchQuery && !isSearching && (
            <div className="text-center text-gray-500 py-8">
              No messages found
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 