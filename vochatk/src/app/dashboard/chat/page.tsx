'use client'

import { FC, useState, useEffect } from 'react'
import { 
  Send,
  User,
  Bot,
  Clock,
  Tag,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  X,
  MoreHorizontal,
  UserCog,
  AlertCircle,
  Paperclip,
  Smile,
  Filter,
  Search,
  MoreVertical,
  BarChart2,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  ArrowUpDown,
  Zap
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot' | 'agent'
  timestamp: string
  status?: 'sending' | 'sent' | 'error'
  feedback?: 'positive' | 'negative'
}

interface ChatSession {
  id: string
  user: {
    name: string
    email: string
  }
  status: 'active' | 'waiting' | 'closed'
  startTime: string
  topic?: string
  tags: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
}

interface QuickResponse {
  id: string
  text: string
  category: string
}

interface SessionFilter {
  status: ('active' | 'waiting' | 'closed')[]
  sentiment: ('positive' | 'neutral' | 'negative')[]
  tags: string[]
  priority: ('high' | 'medium' | 'low')[]
  responseTime: { min: number; max: number }
}

interface SessionStats {
  messagesCount: number
  averageResponseTime: number
  resolvedIssues: number
}

const ChatPage: FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([
    {
      id: '1',
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      status: 'active',
      startTime: new Date().toISOString(),
      topic: 'Technical Support',
      tags: ['urgent', 'product-issue'],
      sentiment: 'neutral'
    },
    {
      id: '2',
      user: {
        name: 'Alice Smith',
        email: 'alice@example.com'
      },
      status: 'waiting',
      startTime: new Date(Date.now() - 300000).toISOString(),
      topic: 'Billing Question',
      tags: ['billing', 'subscription'],
      sentiment: 'negative'
    }
  ])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [showUserInfo, setShowUserInfo] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [quickResponses] = useState<QuickResponse[]>([
    { id: '1', text: 'Hi, how can I help you today?', category: 'Greeting' },
    { id: '2', text: 'I understand your concern. Let me help you with that.', category: 'Acknowledgment' },
    { id: '3', text: 'Could you please provide more details?', category: 'Information Request' },
    { id: '4', text: 'Is there anything else I can help you with?', category: 'Follow-up' }
  ])
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>({
    status: [],
    sentiment: [],
    tags: [],
    priority: [],
    responseTime: { min: 0, max: 5 }
  })
  const [sessionSearchQuery, setSessionSearchQuery] = useState('')
  const [showSessionFilters, setShowSessionFilters] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sessionMetrics, setSessionMetrics] = useState({
    activeChats: 0,
    avgWaitTime: 0,
    resolvedChats: 0,
    satisfaction: 0
  })
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    messagesCount: 0,
    averageResponseTime: 0,
    resolvedIssues: 0
  })

  useEffect(() => {
    // Simulate loading initial messages
    if (selectedSession) {
      setMessages([
        {
          id: '1',
          content: 'Hello, how can I help you today?',
          sender: 'bot',
          timestamp: new Date(Date.now() - 60000).toISOString()
        },
        {
          id: '2',
          content: 'I need help with my account settings',
          sender: 'user',
          timestamp: new Date(Date.now() - 45000).toISOString()
        },
        {
          id: '3',
          content: 'I understand you need help with account settings. Could you please specify which settings you\'re trying to modify?',
          sender: 'bot',
          timestamp: new Date(Date.now() - 30000).toISOString()
        }
      ])
    }
  }, [selectedSession])

  useEffect(() => {
    const interval = setInterval(() => {
      // Update session metrics
      setSessionMetrics(prev => ({
        activeChats: Math.max(0, prev.activeChats + (Math.random() > 0.7 ? 1 : -1)),
        avgWaitTime: Math.max(0, prev.avgWaitTime + (Math.random() * 0.5 - 0.25)),
        resolvedChats: prev.resolvedChats + (Math.random() > 0.8 ? 1 : 0),
        satisfaction: Math.min(100, Math.max(0, prev.satisfaction + (Math.random() * 2 - 1)))
      }))

      // Simulate session updates
      if (Math.random() > 0.8) {
        const newSession: ChatSession = {
          id: Date.now().toString(),
          user: {
            name: `User ${Math.floor(Math.random() * 1000)}`,
            email: `user${Math.floor(Math.random() * 1000)}@example.com`
          },
          status: Math.random() > 0.5 ? 'active' : 'waiting',
          startTime: new Date().toISOString(),
          topic: 'New Support Request',
          tags: ['new', 'unassigned'],
          sentiment: 'neutral'
        }
        setActiveSessions(prev => [newSession, ...prev])
      }

      // Update existing sessions
      setActiveSessions(prev => 
        prev.map(session => ({
          ...session,
          status: Math.random() > 0.9 ? 
            (session.status === 'active' ? 'waiting' : 'active') : 
            session.status,
          sentiment: Math.random() > 0.9 ?
            (['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative') :
            session.sentiment
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedSession) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      status: 'sending'
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      )

      // Add bot response after a delay
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now().toString(),
          content: "Thank you for your message. I understand your concern and I will help you with that.",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          status: 'sent'
        }
        setMessages(prev => [...prev, botResponse])
        setIsTyping(false)
      }, 1500)
    }, 1000)
  }

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId)
  }

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    } catch (error) {
      return ''
    }
  }

  const getSessionById = (id: string) => {
    return activeSessions.find(session => session.id === id)
  }

  const handleQuickResponse = (response: QuickResponse) => {
    if (!selectedSession) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: response.text,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      status: 'sending'
    }

    setMessages(prev => [...prev, newMessage])
    setIsTyping(true)

    // Simulate message sending and bot response
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      )

      // Add bot response after a delay
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now().toString(),
          content: "I appreciate your quick response. Let me help you further with your request.",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          status: 'sent'
        }
        setMessages(prev => [...prev, botResponse])
        setIsTyping(false)
      }, 1500)
    }, 1000)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const filteredSessions = activeSessions.filter(session => {
    if (sessionFilter.status.length && !sessionFilter.status.includes(session.status)) return false
    if (sessionFilter.sentiment.length && !sessionFilter.sentiment.includes(session.sentiment)) return false
    if (sessionFilter.tags.length && !session.tags.some(tag => sessionFilter.tags.includes(tag))) return false
    return true
  })

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col gap-4 p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden'>
      {/* Session Metrics */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300'>Active Chats</h3>
            <div className='p-2.5 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300'>
              <MessageSquare className='w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300'>{sessionMetrics.activeChats}</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↑ 12%</span> vs last period
          </p>
        </div>
        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-yellow-600 transition-colors duration-300'>Avg Wait Time</h3>
            <div className='p-2.5 rounded-xl bg-yellow-50 group-hover:bg-yellow-100 transition-colors duration-300'>
              <Clock className='w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300'>{sessionMetrics.avgWaitTime.toFixed(1)}m</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↓ 5%</span> vs last period
          </p>
        </div>
        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors duration-300'>Resolved Chats</h3>
            <div className='p-2.5 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors duration-300'>
              <CheckCircle2 className='w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300'>{sessionMetrics.resolvedChats}</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↑ 8%</span> vs last period
          </p>
        </div>
        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-300'>Satisfaction</h3>
            <div className='p-2.5 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300'>
              <Star className='w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300'>{sessionMetrics.satisfaction.toFixed(1)}%</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↑ 3%</span> vs last period
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className='flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden'>
        {/* Active Sessions Sidebar */}
        <div className='w-full lg:w-[380px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all duration-300'>
          <div className='p-4 border-b border-gray-100 bg-white sticky top-0 z-10'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <MessageSquare className='w-5 h-5 text-blue-500' />
                Active Sessions
              </h2>
              <div className='flex items-center gap-2'>
                <button
                  onClick={handleRefresh}
                  className='p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 hover:text-blue-600'
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-blue-500' : 'text-gray-500'}`} />
                </button>
                <button
                  onClick={() => setShowSessionFilters(!showSessionFilters)}
                  className='p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 hover:text-blue-600'
                >
                  <Filter className='w-5 h-5 text-gray-500' />
                </button>
              </div>
            </div>

            <div className='relative mb-4'>
              <Search className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
              <input
                type='text'
                value={sessionSearchQuery}
                onChange={(e) => setSessionSearchQuery(e.target.value)}
                placeholder='Search sessions...'
                className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
            </div>

            {showSessionFilters && (
              <div className='space-y-4 p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-100'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
                  <div className='flex flex-wrap gap-2'>
                    {['active', 'waiting', 'closed'].map(status => (
                      <button
                        key={status}
                        onClick={() => setSessionFilter(prev => ({
                          ...prev,
                          status: prev.status.includes(status as any) 
                            ? prev.status.filter(s => s !== status)
                            : [...prev.status, status as any]
                        }))}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                          sessionFilter.status.includes(status as any)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Sentiment</label>
                  <div className='flex flex-wrap gap-2'>
                    {['positive', 'neutral', 'negative'].map(sentiment => (
                      <button
                        key={sentiment}
                        onClick={() => setSessionFilter(prev => ({
                          ...prev,
                          sentiment: prev.sentiment.includes(sentiment as any)
                            ? prev.sentiment.filter(s => s !== sentiment)
                            : [...prev.sentiment, sentiment as any]
                        }))}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                          sessionFilter.sentiment.includes(sentiment as any)
                            ? sentiment === 'positive' ? 'bg-green-500 text-white' :
                              sentiment === 'negative' ? 'bg-red-500 text-white' :
                              'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {sentiment}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Response Time</label>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='number'
                      value={sessionFilter.responseTime.min}
                      onChange={(e) => setSessionFilter(prev => ({
                        ...prev,
                        responseTime: { ...prev.responseTime, min: Number(e.target.value) }
                      }))}
                      className='w-20 px-2 py-1.5 border border-gray-200 rounded-lg'
                      min={0}
                      step={0.5}
                    />
                    <span className='text-gray-500'>to</span>
                    <input
                      type='number'
                      value={sessionFilter.responseTime.max}
                      onChange={(e) => setSessionFilter(prev => ({
                        ...prev,
                        responseTime: { ...prev.responseTime, max: Number(e.target.value) }
                      }))}
                      className='w-20 px-2 py-1.5 border border-gray-200 rounded-lg'
                      min={0}
                      step={0.5}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='flex-1 overflow-y-auto'>
            {filteredSessions.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full p-6 text-gray-500'>
                <AlertCircle className='w-10 h-10 mb-3 text-gray-400' />
                <p className='text-sm text-center'>No sessions found</p>
              </div>
            ) : (
              filteredSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => handleSessionSelect(session.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50/50 transition-all duration-200 group ${
                    selectedSession === session.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className='flex items-start gap-3 mb-3'>
                    <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                      <User className='w-5 h-5 text-gray-600' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className='font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate'>
                          {session.user.name}
                        </span>
                        <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                          session.status === 'active' ? 'bg-green-100 text-green-700 group-hover:bg-green-200' :
                          session.status === 'waiting' ? 'bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200' :
                          'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <p className='text-sm text-gray-500 truncate group-hover:text-gray-600 transition-colors duration-200'>
                        {session.user.email}
                      </p>
                      <div className='flex items-center gap-2 mt-2 text-xs text-gray-500'>
                        <span className='group-hover:text-gray-600 transition-colors duration-200'>
                          {formatTime(session.startTime)}
                        </span>
                        <span className='w-1 h-1 rounded-full bg-gray-300'></span>
                        <span className={`transition-colors duration-200 ${
                          session.sentiment === 'positive' ? 'text-green-500 group-hover:text-green-600' :
                          session.sentiment === 'negative' ? 'text-red-500 group-hover:text-red-600' :
                          'text-gray-500 group-hover:text-gray-600'
                        }`}>
                          {session.sentiment}
                        </span>
                      </div>
                    </div>
                  </div>
                  {session.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1.5 mt-2'>
                      {session.tags.map(tag => (
                        <span
                          key={tag}
                          className='px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-200'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className='flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all duration-300'>
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <div className='px-4 sm:px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10'>
                <div className='flex justify-between items-start'>
                  <div className='flex-1 min-w-0 flex items-start gap-4'>
                    <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                      <User className='w-6 h-6 text-blue-600' />
                    </div>
                    <div className='min-w-0'>
                      <h2 className='text-lg font-semibold text-gray-800 truncate'>
                        {getSessionById(selectedSession)?.user.name}
                      </h2>
                      <div className='flex items-center gap-3 text-sm text-gray-500'>
                        <span className='truncate'>{getSessionById(selectedSession)?.topic || 'No topic set'}</span>
                        <span className='w-1.5 h-1.5 rounded-full bg-gray-300'></span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          getSessionById(selectedSession)?.status === 'active' ? 'bg-green-100 text-green-700' :
                          getSessionById(selectedSession)?.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {getSessionById(selectedSession)?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 ml-4'>
                    <div className='hidden sm:flex flex-col items-end'>
                      <div className='text-sm text-gray-500'>
                        <span className='font-medium'>{sessionStats.messagesCount}</span> messages
                      </div>
                      <div className='text-xs text-gray-400'>
                        <span className='font-medium'>{sessionStats.averageResponseTime.toFixed(1)}s</span> avg response
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUserInfo(!showUserInfo)}
                      className='p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200'
                    >
                      <UserCog className='w-5 h-5 text-gray-500' />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Container */}
              <div className='flex-1 flex min-h-0 bg-gradient-to-b from-gray-50/50 to-white relative'>
                <div className={`flex-1 flex flex-col ${showUserInfo ? 'lg:mr-[340px]' : ''}`}>
                  {/* Messages */}
                  <div className='flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 scroll-smooth'>
                    {messages.length === 0 ? (
                      <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                        <div className='w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4'>
                          <MessageSquare className='w-10 h-10 text-blue-500' />
                        </div>
                        <p className='text-lg font-medium mb-2'>Start a Conversation</p>
                        <p className='text-sm text-center max-w-md text-gray-400'>
                          Begin by sending a message or choosing a quick response below.
                        </p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                          <div className={`max-w-[85%] sm:max-w-[75%] group ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : message.sender === 'bot'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-green-500 text-white'
                          } rounded-2xl px-4 sm:px-5 py-3 shadow-sm hover:shadow-md transition-all duration-200`}>
                            <div className='flex items-center gap-2 mb-2'>
                              <div className='p-1.5 rounded-full bg-white/10'>
                                {message.sender === 'user' ? (
                                  <User className='w-4 h-4' />
                                ) : message.sender === 'bot' ? (
                                  <Bot className='w-4 h-4' />
                                ) : (
                                  <MessageSquare className='w-4 h-4' />
                                )}
                              </div>
                              <span className='text-xs opacity-75'>
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <div className='relative'>
                              <p className='text-[15px] leading-relaxed whitespace-pre-wrap break-words'>
                                {message.content}
                              </p>
                              {message.status === 'sending' && (
                                <div className='flex items-center gap-1.5 mt-2 text-xs opacity-75'>
                                  <Loader2 className='w-3 h-3 animate-spin' />
                                  Sending...
                                </div>
                              )}
                              {message.status === 'sent' && (
                                <div className='flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                  <button className='p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200'>
                                    <ThumbsUp className='w-3 h-3' />
                                  </button>
                                  <button className='p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200'>
                                    <ThumbsDown className='w-3 h-3' />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {isTyping && (
                      <div className='flex items-center gap-2 text-gray-500 text-sm animate-fade-in'>
                        <div className='flex items-center gap-1.5 bg-gray-100 rounded-full px-5 py-2.5'>
                          <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                          <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100'></div>
                          <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200'></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Responses */}
                  <div className='px-4 py-3 border-t border-gray-100 bg-white/80 backdrop-blur-sm'>
                    <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                      {quickResponses.map(response => (
                        <button
                          key={response.id}
                          onClick={() => handleQuickResponse(response)}
                          className='px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center gap-2 flex-shrink-0'
                        >
                          <Zap className='w-3.5 h-3.5' />
                          {response.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className='px-4 py-3 border-t border-gray-100 bg-white sticky bottom-0'>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                      }}
                      className='flex gap-2'
                    >
                      <button 
                        type="button"
                        className='p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors duration-200 hover:text-blue-600'
                      >
                        <Paperclip className='w-5 h-5' />
                      </button>
                      <input
                        type='text'
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder='Type your message...'
                        className='flex-1 px-4 py-2.5 text-[15px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                      />
                      <button 
                        type="button"
                        className='p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors duration-200 hover:text-blue-600'
                      >
                        <Smile className='w-5 h-5' />
                      </button>
                      <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className='px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                      >
                        <Send className='w-5 h-5' />
                      </button>
                    </form>
                  </div>
                </div>

                {/* User Info Sidebar */}
                {showUserInfo && (
                  <div className='hidden lg:block absolute right-0 top-0 bottom-0 w-[340px] border-l border-gray-100 bg-white overflow-y-auto animate-slide-in-right'>
                    <div className='p-4 border-b border-gray-100 sticky top-0 bg-white'>
                      <div className='flex justify-between items-center'>
                        <h3 className='font-medium text-gray-800'>User Information</h3>
                        <button
                          onClick={() => setShowUserInfo(false)}
                          className='p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200'
                        >
                          <X className='w-5 h-5 text-gray-500' />
                        </button>
                      </div>
                    </div>
                    <div className='p-6 space-y-6'>
                      {/* User Info Section */}
                      <div className='space-y-4'>
                        <div className='flex items-center gap-4'>
                          <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center'>
                            <User className='w-8 h-8 text-blue-600' />
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>{getSessionById(selectedSession)?.user.name}</h4>
                            <p className='text-sm text-gray-500'>{getSessionById(selectedSession)?.user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className='space-y-3'>
                        <h4 className='font-medium text-gray-800'>Session Details</h4>
                        <div className='grid grid-cols-2 gap-3'>
                          <div className='p-3 bg-gray-50 rounded-xl'>
                            <p className='text-sm text-gray-500 mb-1'>Status</p>
                            <p className='font-medium text-gray-900 capitalize'>{getSessionById(selectedSession)?.status}</p>
                          </div>
                          <div className='p-3 bg-gray-50 rounded-xl'>
                            <p className='text-sm text-gray-500 mb-1'>Started</p>
                            <p className='font-medium text-gray-900'>{formatTime(getSessionById(selectedSession)?.startTime || '')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className='space-y-3'>
                        <h4 className='font-medium text-gray-800'>Tags</h4>
                        <div className='flex flex-wrap gap-2'>
                          {getSessionById(selectedSession)?.tags.map(tag => (
                            <span
                              key={tag}
                              className='px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors duration-200'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Analytics */}
                      <div className='space-y-3'>
                        <h4 className='font-medium text-gray-800'>Analytics</h4>
                        <div className='space-y-3'>
                          <div className='p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200'>
                            <p className='text-sm text-blue-600 mb-1'>Response Time</p>
                            <p className='text-xl font-semibold text-blue-700'>
                              {sessionStats.averageResponseTime.toFixed(1)}s
                            </p>
                          </div>
                          <div className='p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200'>
                            <p className='text-sm text-green-600 mb-1'>Messages</p>
                            <p className='text-xl font-semibold text-green-700'>
                              {sessionStats.messagesCount}
                            </p>
                          </div>
                          <div className='p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200'>
                            <p className='text-sm text-purple-600 mb-1'>Resolved Issues</p>
                            <p className='text-xl font-semibold text-purple-700'>
                              {sessionStats.resolvedIssues}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile User Info Modal */}
                {showUserInfo && (
                  <div className='lg:hidden fixed inset-0 bg-black/50 z-50'>
                    <div className='absolute right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white overflow-y-auto animate-slide-in-right'>
                      <div className='p-4 border-b border-gray-100 sticky top-0 bg-white'>
                        <div className='flex justify-between items-center'>
                          <h3 className='font-medium text-gray-800'>User Information</h3>
                          <button
                            onClick={() => setShowUserInfo(false)}
                            className='p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200'
                          >
                            <X className='w-5 h-5 text-gray-500' />
                          </button>
                        </div>
                      </div>
                      <div className='p-6 space-y-6'>
                        {/* ... same content as desktop sidebar ... */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='flex-1 flex flex-col items-center justify-center text-gray-500 p-8 bg-gradient-to-b from-gray-50/50 to-white'>
              <div className='w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4'>
                <MessageSquare className='w-12 h-12 text-blue-500' />
              </div>
              <p className='text-xl font-medium mb-2'>No Chat Selected</p>
              <p className='text-sm text-center max-w-md text-gray-400'>
                Select a chat session from the sidebar to start messaging or view conversation details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage 