'use client';

import { useState, useEffect, useRef } from 'react';

// SVG Icons
const ChatboxIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 512 512" fill="currentColor">
    <path d="M144 464a16 16 0 01-16-16v-64h-24a72.08 72.08 0 01-72-72V120a72.08 72.08 0 0172-72h304a72.08 72.08 0 0172 72v192a72.08 72.08 0 01-72 72H245.74l-91.49 76.29A16.05 16.05 0 01144 464z"/>
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor">
    <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"/>
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor">
    <path d="M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z"/>
  </svg>
);

const RobotIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 448 512" fill="currentColor">
    <path d="M320 0c17.7 0 32 14.3 32 32V96H96V32c0-17.7 14.3-32 32-32H320zM80 160c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32v224c0 17.7-14.3 32-32 32H112c-17.7 0-32-14.3-32-32V160zM40 416c-13.3 0-24 10.7-24 24s10.7 24 24 24H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H40zM208 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm80 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"/>
  </svg>
);

const LoadingDotsIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 animate-bounce ${className}`} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zm0 1a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z" opacity="0.25"/>
  </svg>
);

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hello! How can I help you today?", 
      isBot: true, 
      timestamp: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { 
      text: inputText, 
      isBot: false, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate bot response (replace this with your actual LiveChatBot logic)
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        text: "I'm your AI assistant. I'm here to help!", 
        isBot: true,
        timestamp: new Date()
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        >
          <ChatboxIcon />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-[380px] h-[560px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <RobotIcon />
              <div>
                <h3 className="font-semibold">Chat Support</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-blue-600 rounded-full p-2 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className="flex flex-col max-w-[80%] gap-1">
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      msg.isBot
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-gray-500 px-2">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl px-4 py-2 shadow-sm flex items-center gap-1">
                  <LoadingDotsIcon />
                  <LoadingDotsIcon className="[animation-delay:0.2s]" />
                  <LoadingDotsIcon className="[animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 bg-gray-50"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}