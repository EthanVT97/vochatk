'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import EmojiPicker from 'emoji-picker-react';
import UserProfile from '../components/UserProfile';
import MessageThread from '../components/MessageThread';
import type { RealtimeChannel } from '@supabase/supabase-js';
import SearchMessages from '../components/SearchMessages';
import LoadingButton from '../components/LoadingButton';
import LoadingOverlay from '../components/LoadingOverlay';
import UploadProgress from '../components/UploadProgress';
import AnimatedTransition from '../components/AnimatedTransition';

interface Message {
  id: number;
  text: string;
  type: 'system' | 'user';
  timestamp: string;
  userName?: string;
  userId?: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  reactions?: { [key: string]: string[] };
  isEdited?: boolean;
  parentId?: number;
  readBy?: string[];
  replyCount?: number;
}

interface User {
  id: string;
  email: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
}

interface TypingUser {
  id: string;
  email: string;
  timestamp: number;
}

interface UploadState {
  progress: number;
  fileName: string;
  fileSize: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

interface UploadProgress {
  loaded: number;
  total: number;
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Message | null>(null);
  const [threadReplies, setThreadReplies] = useState<Message[]>([]);
  const [userProfiles, setUserProfiles] = useState<{[key: string]: User}>({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchHighlightedMessage, setSearchHighlightedMessage] = useState<number | null>(null);
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messageActionStates, setMessageActionStates] = useState<{[key: number]: string}>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Check authentication status
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            avatar_url: session.user.user_metadata.avatar_url,
            display_name: session.user.user_metadata.display_name
          };
          setUser(userData);
          await loadUserProfile(session.user.id);
        }

        // Load messages and user profiles
        await Promise.all([
          loadInitialMessages(),
          loadUserProfiles()
        ]);

        // Set up real-time subscription
        const channel = supabase
          .channel('room1')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'messages',
          }, handleRealtimeMessage)
          .on('presence', { event: 'sync' }, () => {
            if (!channel) return;
            const state = channel.presenceState<TypingUser>();
            const typing = Object.values(state).flat();
            setTypingUsers(typing.filter(t => t.id !== user?.id));
          })
          .subscribe();

        channelRef.current = channel;
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const handleRealtimeMessage = (payload: any) => {
    if (!user) return;

    if (payload.eventType === 'INSERT') {
      const newMessage = payload.new as Message;
      setMessages(prev => [...prev, newMessage]);
      markMessageAsRead(newMessage.id);
    } else if (payload.eventType === 'DELETE') {
      setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
    } else if (payload.eventType === 'UPDATE') {
      setMessages(prev => prev.map(msg => 
        msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
      ));
    }
  };

  const loadInitialMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) throw error;
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    setIsLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (data) {
        setUserProfiles(prev => ({
          ...prev,
          [userId]: {
            ...data,
            id: userId
          }
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadUserProfiles = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*');

    if (data) {
      const profiles = data.reduce((acc, profile) => ({
        ...acc,
        [profile.user_id]: {
          ...profile,
          id: profile.user_id
        }
      }), {});
      setUserProfiles(profiles);
    }
  };

  const markMessageAsRead = async (messageId: number) => {
    if (!user) return;

    const { data: message } = await supabase
      .from('messages')
      .select('readBy')
      .eq('id', messageId)
      .single();

    if (message) {
      const readBy = message.readBy || [];
      if (!readBy.includes(user.id)) {
        await supabase
          .from('messages')
          .update({
            readBy: [...readBy, user.id]
          })
          .eq('id', messageId);
      }
    }
  };

  const loadThreadReplies = async (parentId: number) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('parentId', parentId)
      .order('timestamp', { ascending: true });

    if (data) {
      setThreadReplies(data);
    }
  };

  const handleOpenThread = async (message: Message) => {
    setSelectedThread(message);
    await loadThreadReplies(message.id);
  };

  const handleSendMessage = async () => {
    if (!user) {
      alert('Please sign in to send messages');
      return;
    }

    if (message.trim()) {
      const newMessage = {
        text: message,
        type: 'user' as const,
        timestamp: new Date().toISOString(),
        userName: userProfiles[user.id]?.display_name || user.email,
        userId: user.id,
        reactions: {},
        readBy: [user.id]
      };

      const { error } = await supabase
        .from('messages')
        .insert([newMessage]);

      if (!error) {
        setMessage('');
      }
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleEditMessage = async (messageId: number) => {
    if (!editText.trim()) return;

    const { error } = await supabase
      .from('messages')
      .update({ 
        text: editText,
        isEdited: true
      })
      .eq('id', messageId);

    if (!error) {
      setEditingMessageId(null);
      setEditText('');
    }
  };

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setEditText(message.text);
  };

  const handleTyping = () => {
    if (!user || !channelRef.current) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    channelRef.current.track({
      id: user.id,
      email: user.email,
      timestamp: Date.now()
    });

    // Clear typing indicator after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      channelRef.current?.untrack();
    }, 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setUploadState({
      progress: 0,
      fileName: file.name,
      fileSize,
      status: 'uploading'
    });

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const isImage = file.type.startsWith('image/');
    const bucketName = isImage ? 'chat-images' : 'chat-files';

    try {
      // Create upload options with progress tracking
      const options = {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      };

      // Create a progress handler
      const handleProgress = (progress: { totalBytes: number; loadedBytes: number }) => {
        const percentage = Math.round((progress.loadedBytes / progress.totalBytes) * 100);
        setUploadState(prev => prev ? { ...prev, progress: percentage } : null);
      };

      // Start the upload with progress tracking
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, options);

      if (uploadError) throw uploadError;

      setUploadState(prev => prev ? { ...prev, status: 'processing' } : null);

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const newMessage = {
        text: isImage ? 'Shared an image' : `Shared a file: ${file.name}`,
        type: 'user' as const,
        timestamp: new Date().toISOString(),
        userName: userProfiles[user.id]?.display_name || user.email,
        userId: user.id,
        ...(isImage ? { imageUrl: publicUrl } : { fileUrl: publicUrl, fileName: file.name, fileType: file.type }),
        reactions: {},
        readBy: [user.id]
      };

      await supabase.from('messages').insert([newMessage]);
      setUploadState(prev => prev ? { ...prev, status: 'complete' } : null);
      
      // Clear upload state after 2 seconds
      setTimeout(() => setUploadState(null), 2000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadState(prev => prev ? { ...prev, status: 'error' } : null);
    }
  };

  const handleReaction = async (messageId: number, emoji: string) => {
    const targetMessage = messages.find(m => m.id === messageId);
    if (!targetMessage || !user) return;

    const reactions = targetMessage.reactions ?? {};
    const userReactions = reactions[emoji] ?? [];

    const updatedReactions = { ...reactions };
    if (userReactions.includes(user.id)) {
      updatedReactions[emoji] = userReactions.filter(id => id !== user.id);
      if (updatedReactions[emoji].length === 0) {
        delete updatedReactions[emoji];
      }
    } else {
      updatedReactions[emoji] = [...userReactions, user.id];
    }

    const { error } = await supabase
      .from('messages')
      .update({ reactions: updatedReactions })
      .eq('id', messageId);

    if (!error) {
      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, reactions: updatedReactions } : m
      ));
    }
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/chat'
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSearchMessageClick = (messageId: number) => {
    setSearchHighlightedMessage(messageId);
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Remove highlight after 2 seconds
      setTimeout(() => setSearchHighlightedMessage(null), 2000);
    }
  };

  const handleAvatarUrl = (url: string | undefined): string => {
    if (!url) return '';
    return url;
  };

  const getReplyCount = (msg: Message): number => {
    return msg.replyCount || 0;
  };

  const handleMessageAction = async (messageId: number, action: string) => {
    setMessageActionStates(prev => ({ ...prev, [messageId]: action }));
    try {
      switch (action) {
        case 'delete':
          await handleDeleteMessage(messageId);
          break;
        case 'edit':
          await handleEditMessage(messageId);
          break;
        // ... other actions
      }
    } finally {
      setMessageActionStates(prev => {
        const newState = { ...prev };
        delete newState[messageId];
        return newState;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Chat Application</h1>
            <button
              onClick={() => setShowSearch(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-2"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {userProfiles[user.id]?.avatar_url ? (
                      <Image
                        src={handleAvatarUrl(userProfiles[user.id].avatar_url)}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      user.email[0].toUpperCase()
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {userProfiles[user.id]?.display_name || user.email}
                  </span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg relative">
          <LoadingOverlay
            show={isLoadingMessages}
            text="Loading messages..."
            variant="container"
            spinnerVariant="dots"
          />

          <div className="h-[calc(100vh-300px)] overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <AnimatedTransition
                key={msg.id}
                show={true}
                type="slide"
                duration="fast"
              >
                <div className="relative">
                  {messageActionStates[msg.id] && (
                    <LoadingOverlay
                      show={true}
                      text={`${messageActionStates[msg.id]}...`}
                      variant="minimal"
                      spinnerVariant="pulse"
                    />
                  )}
                  <div
                    id={`message-${msg.id}`}
                    className={`flex items-start gap-3 ${
                      msg.userId === user?.id ? 'flex-row-reverse' : ''
                    } ${searchHighlightedMessage === msg.id ? 'bg-yellow-100 -mx-4 px-4 py-2 rounded-lg transition-colors duration-500' : ''}`}
                  >
                    <button
                      onClick={() => loadUserProfile(msg.userId!)}
                      className="flex-shrink-0"
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold ${
                        msg.type === 'system' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {msg.userId && userProfiles[msg.userId]?.avatar_url && (
                          <Image
                            src={handleAvatarUrl(userProfiles[msg.userId].avatar_url)}
                            alt="Avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        )}
                      </div>
                    </button>

                    <div className={`flex-1 ${
                      msg.userId === user?.id ? 'text-right' : ''
                    }`}>
                      <div className="text-sm text-gray-500 mb-1">
                        {userProfiles[msg.userId!]?.display_name || msg.userName}
                      </div>
                      <div className={`relative group inline-block max-w-[80%] ${
                        msg.userId === user?.id ? 'ml-auto' : ''
                      }`}>
                        <div className={`p-3 rounded-lg ${
                          msg.type === 'system'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-green-50 text-green-800'
                        }`}>
                          {editingMessageId === msg.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 rounded border-gray-300 text-sm"
                                autoFocus
                              />
                              <button
                                onClick={() => handleEditMessage(msg.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              {msg.imageUrl ? (
                                <Image
                                  src={msg.imageUrl}
                                  alt="Shared image"
                                  width={300}
                                  height={200}
                                  className="rounded-lg"
                                />
                              ) : msg.fileUrl ? (
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                  <span className="text-2xl">📎</span>
                                  <div className="flex-1 overflow-hidden">
                                    <a
                                      href={msg.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-sm truncate block"
                                    >
                                      {msg.fileName}
                                    </a>
                                    <span className="text-xs text-gray-500">
                                      {msg.fileType}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm">{msg.text}</p>
                              )}
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                {msg.isEdited && <span>(edited)</span>}
                                {getReplyCount(msg) > 0 && (
                                  <button
                                    onClick={() => handleOpenThread(msg)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    {getReplyCount(msg)} {getReplyCount(msg) === 1 ? 'reply' : 'replies'}
                                  </button>
                                )}
                                {msg.readBy && (
                                  <span className="ml-auto text-green-600">
                                    ✓ {msg.readBy.length}
                                  </span>
                                )}
                              </div>
                              {msg.reactions && Object.entries(msg.reactions).map(([emoji, users]) => (
                                <span key={emoji} className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs mr-1">
                                  {emoji} {users.length}
                                </span>
                              ))}
                            </>
                          )}
                        </div>
                        <div className="absolute -right-16 top-0 hidden group-hover:flex gap-2">
                          {msg.userId === user?.id && !editingMessageId && (
                            <>
                              <button
                                onClick={() => startEditing(msg)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleMessageAction(msg.id, 'delete')}
                                className="text-red-500 hover:text-red-700"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleOpenThread(msg)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            💬
                          </button>
                        </div>
                        <div className="absolute -bottom-6 left-0 hidden group-hover:flex gap-1">
                          <button
                            onClick={() => setShowEmojiPicker(msg.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            😊
                          </button>
                          {showEmojiPicker === msg.id && (
                            <div className="absolute bottom-8 left-0 z-10">
                              <EmojiPicker
                                onEmojiClick={(emojiData) => {
                                  handleReaction(msg.id, emojiData.emoji);
                                  setShowEmojiPicker(null);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedTransition>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {typingUsers.length > 0 && (
            <div className="px-6 py-2 text-sm text-gray-500">
              {typingUsers.map(user => userProfiles[user.id]?.display_name || user.email).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}

          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <LoadingButton
                onClick={() => fileInputRef.current?.click()}
                loading={isUploading}
                variant="secondary"
                size="md"
              >
                📎
              </LoadingButton>
              <LoadingButton
                onClick={handleSendMessage}
                loading={false}
                disabled={!user}
                variant="primary"
                size="md"
              >
                Send
              </LoadingButton>
            </div>
          </div>
        </div>
      </main>

      {uploadState && (
        <UploadProgress
          progress={uploadState.progress}
          fileName={uploadState.fileName}
          fileSize={uploadState.fileSize}
          status={uploadState.status}
          onCancel={() => setUploadState(null)}
          onRetry={uploadState.status === 'error' ? () => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          } : undefined}
        />
      )}

      {showProfile && user && (
        <>
          {isLoadingProfile ? (
            <LoadingOverlay
              show={true}
              text="Loading profile..."
              variant="fullscreen"
              spinnerVariant="bounce"
            />
          ) : (
            <UserProfile
              user={userProfiles[user.id] || user}
              onClose={() => setShowProfile(false)}
            />
          )}
        </>
      )}

      {selectedThread && (
        <MessageThread
          parentMessage={selectedThread}
          replies={threadReplies}
          currentUser={user}
          onClose={() => setSelectedThread(null)}
        />
      )}

      {showSearch && (
        <SearchMessages
          onMessageClick={handleSearchMessageClick}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
} 