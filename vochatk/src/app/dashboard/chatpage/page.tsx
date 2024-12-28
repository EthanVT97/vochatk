'use client'

import { FC, useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, User, Bot, ArrowLeft, UserCircle2, Clock, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase, db } from '@/lib/supabase'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: string
  senderName?: string
}

interface Agent {
  id: string
  name: string
  status: 'online' | 'busy' | 'away'
  avatar?: string
}

const ChatPage: FC = () => {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [chatId, setChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat and subscribe to messages
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get available agent
        const agents = await db.agents.getOnline()
        if (agents && agents.length > 0) {
          const selectedAgent = agents[0]
          setAgent({
            id: selectedAgent.id,
            name: selectedAgent.name,
            status: selectedAgent.status,
          })

          // Create new chat
          const chat = await db.chats.create(selectedAgent.id, 'user-' + Date.now())
          setChatId(chat.id)

          // Subscribe to messages
          const subscription = supabase
            .channel(`chat:${chat.id}`)
            .on('postgres_changes', {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `chat_id=eq.${chat.id}`,
            }, payload => {
              const newMessage = payload.new as any
              setMessages(prev => [...prev, {
                id: newMessage.id,
                content: newMessage.content,
                sender: newMessage.sender_type === 'agent' ? 'agent' : 'user',
                timestamp: newMessage.created_at,
                senderName: newMessage.sender_type === 'agent' ? selectedAgent.name : undefined
              }])
            })
            .subscribe()

          // Add welcome message
          await db.messages.create(
            chat.id,
            selectedAgent.id,
            `Welcome! I'm ${selectedAgent.name}, your customer service representative. How can I assist you today?`,
            'agent'
          )

          setIsConnecting(false)
          return () => {
            subscription.unsubscribe()
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
        setIsConnecting(false)
      }
    }

    initializeChat()
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isConnecting || !chatId) return

    try {
      // Send message
      await db.messages.create(
        chatId,
        'user-' + Date.now(),
        newMessage,
        'user'
      )

      setNewMessage('')
      setIsTyping(true)

      // Simulate agent typing
      setTimeout(async () => {
        if (agent) {
          await db.messages.create(
            chatId,
            agent.id,
            'I understand your request. Let me help you with that. What specific details can you provide?',
            'agent'
          )
        }
        setIsTyping(false)
      }, 2000)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleBack = () => {
    router.push('/dashboard')
  }

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-gray-50 to-gray-100/50'>
      {/* Chat Header */}
      <div className='bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3'>
        <button
          onClick={handleBack}
          className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
        >
          <ArrowLeft className='w-5 h-5 text-gray-600' />
        </button>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
            <UserCircle2 className='w-5 h-5 text-green-600' />
          </div>
          <div>
            <h2 className='font-medium text-gray-800'>
              {agent?.name || 'Customer Service'}
            </h2>
            <p className='text-sm text-gray-500 flex items-center gap-1'>
              {isConnecting ? (
                <>
                  <Clock className='w-3 h-3 animate-spin' />
                  Connecting...
                </>
              ) : (
                'Online'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'agent' && (
              <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                <UserCircle2 className='w-4 h-4 text-green-600' />
              </div>
            )}
            
            <div className={`max-w-[70%] ${
              message.sender === 'user' ? 'ml-auto' : 'mr-auto'
            }`}>
              {message.senderName && (
                <p className='text-xs text-gray-500 mb-1 px-2'>{message.senderName}</p>
              )}
              <div className={`rounded-2xl px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-green-500 text-white rounded-tl-none'
              }`}>
                <p className='text-sm whitespace-pre-wrap'>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-green-100'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {message.sender === 'user' && (
              <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0'>
                <User className='w-4 h-4 text-white' />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className='flex items-start gap-3'>
            <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
              <UserCircle2 className='w-4 h-4 text-green-600' />
            </div>
            <div className='bg-gray-100 rounded-2xl px-4 py-2 rounded-tl-none'>
              <div className='flex gap-1'>
                <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></span>
                <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></span>
                <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className='p-4 bg-white border-t border-gray-200'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isConnecting ? 'Connecting to agent...' : 'Type your message...'}
            disabled={isConnecting}
            className='flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500'
          />
          <button
            type='submit'
            disabled={!newMessage.trim() || isConnecting}
            className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
          >
            <Send className='w-4 h-4' />
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatPage 