'use client'

import { FC, useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { FaUser, FaRobot, FaPaperPlane, FaSpinner } from 'react-icons/fa'
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
                {message.sender === 'user' ? (
                  <FaUser className="w-6 h-6 text-gray-500" />
                ) : (
                  <FaRobot className="w-6 h-6 text-gray-500" />
                )}
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
            {isLoading ? (
              <FaSpinner className="w-5 h-5 animate-spin" />
            ) : (
              <FaPaperPlane className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatPage