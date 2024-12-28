'use client'

import { FC, useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

// Simple SVG icons as components
const UserIcon = () => (
  <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
)

const BotIcon = () => (
  <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z"/>
  </svg>
)

const SendIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
)

const LoadingIcon = () => (
  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
)

const ChatPage: FC = () => {
  const { id } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatInterface, setChatInterface] = useState<ChatInterface | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch chat interface details
  useEffect(() => {
    const fetchChatInterface = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('chat_interfaces')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setChatInterface(data)
      } catch (err) {
        console.error('Error fetching chat interface:', err)
        setError('Failed to load chat interface')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchChatInterface()
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

    try {
      setIsLoading(true)
      const messageId = Date.now().toString()
      const newMsg: Message = {
        id: messageId,
        content: newMessage,
        sender: 'user',
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, newMsg])
      setNewMessage('')

      // Send message to Supabase
      const { error } = await supabase
        .from('messages')
        .insert([{
          chat_id: id,
          content: newMessage,
          sender_type: 'user'
        }])

      if (error) throw error

    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold">
          {chatInterface?.name || 'Chat'}
        </h1>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[70%] ${
                message.sender === 'user'
                  ? 'flex-row-reverse space-x-reverse'
                  : 'flex-row'
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="flex-shrink-0">
                {message.sender === 'user' ? <UserIcon /> : <BotIcon />}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white shadow-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? <LoadingIcon /> : <SendIcon />}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatPage