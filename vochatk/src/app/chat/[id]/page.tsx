'use client'

import { FC, useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { IoSend } from 'react-icons/io5'
import { FaUser, FaRobot } from 'react-icons/fa'
import { BiLoaderAlt } from 'react-icons/bi'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: string
}

interface ChatInterface {
  id: string
  name: string
  welcomeMessage?: string
  language?: string
  botEnabled?: boolean
}

const ChatPage: FC = () => {
  const { id } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatInterface, setChatInterface] = useState<ChatInterface | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulate fetching chat interface details
  useEffect(() => {
    // In a real app, fetch from your API
    const mockInterface: ChatInterface = {
      id: id as string,
      name: 'Customer Support',
      welcomeMessage: 'Welcome to our customer support! How can we help you today?',
      language: 'English',
      botEnabled: true
    }
    setChatInterface(mockInterface)

    // Add welcome message
    if (mockInterface.welcomeMessage) {
      setMessages([
        {
          id: Date.now().toString(),
          content: mockInterface.welcomeMessage,
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      ])
    }
  }, [id])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsLoading(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. An agent will be with you shortly.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  if (!chatInterface) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <BiLoaderAlt className='w-8 h-8 text-blue-500 animate-spin' />
      </div>
    )
  }

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-4 py-4'>
        <div className='max-w-4xl mx-auto flex items-center justify-between'>
          <h1 className='text-xl font-semibold text-gray-800'>{chatInterface.name}</h1>
          <span className='px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full'>
            Online
          </span>
        </div>
      </header>

      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto p-4'>
        <div className='max-w-4xl mx-auto space-y-4'>
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {message.sender === 'user' ? (
                  <FaUser className='w-5 h-5 text-blue-600' />
                ) : (
                  <FaRobot className='w-5 h-5 text-gray-600' />
                )}
              </div>
              <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : ''}`}>
                <div className={`px-4 py-2 rounded-lg max-w-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className='text-sm'>{message.content}</p>
                </div>
                <span className='text-xs text-gray-500 mt-1'>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='flex items-center gap-2 text-gray-500'>
              <BiLoaderAlt className='w-4 h-4 animate-spin' />
              <span className='text-sm'>Agent is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className='bg-white border-t border-gray-200 px-4 py-4'>
        <div className='max-w-4xl mx-auto'>
          <form onSubmit={handleSendMessage} className='flex items-center gap-4'>
            <input
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Type your message...'
              className='flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500'
            />
            <button
              type='submit'
              disabled={!newMessage.trim() || isLoading}
              className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
            >
              <IoSend className='w-4 h-4' />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPage