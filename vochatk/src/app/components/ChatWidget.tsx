'use client';

import { useState, useEffect, useRef } from 'react';
import { IoMdChatboxes } from 'react-icons/io';
import { IoClose, IoSend } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

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
          <IoMdChatboxes className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-[380px] h-[560px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Chat Support</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-blue-600 rounded-full p-2 transition-colors"
            >
              <IoClose className="w-5 h-5" />
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
                  <BsThreeDots className="w-4 h-4 animate-bounce" />
                  <BsThreeDots className="w-4 h-4 animate-bounce [animation-delay:0.2s]" />
                  <BsThreeDots className="w-4 h-4 animate-bounce [animation-delay:0.4s]" />
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
                <IoSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 