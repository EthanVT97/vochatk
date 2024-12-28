'use client'

import { FC, useState, useEffect } from 'react'
import { 
  Search,
  Filter,
  Calendar,
  User,
  Bot,
  MessageSquare,
  Tag,
  Download,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  BarChart2,
  AlertTriangle,
  Zap,
  History,
  UserCheck,
  FileText,
  Loader2,
  CheckCircle2
} from 'lucide-react'

interface MessageRecord {
  id: string
  content: string
  sender: 'user' | 'bot' | 'agent'
  timestamp: string
  user: {
    name: string
    email: string
  }
  session: {
    id: string
    topic?: string
    tags: string[]
  }
  sentiment: 'positive' | 'neutral' | 'negative'
  feedback?: {
    rating: 'positive' | 'negative'
    comment?: string
  }
  category?: string
  responseTime?: number
}

interface MessageStats {
  totalMessages: number
  averageResponseTime: number
  successRate: number
  topCategories: Array<{ category: string, count: number }>
  userSatisfaction: number
  messageVolume: {
    hour: number
    count: number
  }[]
}

const ITEMS_PER_PAGE = 10

const MessagesPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [selectedSenders, setSelectedSenders] = useState<Array<'user' | 'bot' | 'agent'>>([])
  const [selectedSentiments, setSelectedSentiments] = useState<Array<'positive' | 'neutral' | 'negative'>>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortField, setSortField] = useState<'timestamp' | 'responseTime'>('timestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [responseTimeRange, setResponseTimeRange] = useState<{min: number, max: number}>({
    min: 0,
    max: 5
  })
  const [messageStats, setMessageStats] = useState({
    totalMessages: 0,
    averageResponseTime: 0,
    successRate: 0,
    topCategories: [] as Array<{ category: string, count: number }>,
    userSatisfaction: 0
  })
  const [selectedPriority, setSelectedPriority] = useState<Array<'high' | 'medium' | 'low'>>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [messageVolume, setMessageVolume] = useState<MessageStats['messageVolume']>([])
  const [isExporting, setIsExporting] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d' | 'custom'>('24h')

  const [messages, setMessages] = useState<MessageRecord[]>([
    {
      id: '1',
      content: 'How do I reset my password?',
      sender: 'user',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      session: {
        id: 'session-1',
        topic: 'Account Support',
        tags: ['password-reset', 'account']
      },
      sentiment: 'neutral',
      category: 'Account Management',
      responseTime: 1.2
    },
    {
      id: '2',
      content: 'I understand you need help with password reset. Please follow these steps...',
      sender: 'bot',
      timestamp: new Date(Date.now() - 3540000).toISOString(),
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      session: {
        id: 'session-1',
        topic: 'Account Support',
        tags: ['password-reset', 'account']
      },
      sentiment: 'positive',
      feedback: {
        rating: 'positive',
        comment: 'Clear instructions, thank you!'
      },
      category: 'Account Management',
      responseTime: 0.8
    }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const newMessage: MessageRecord = {
        id: Date.now().toString(),
        content: 'New simulated message...',
        sender: Math.random() > 0.5 ? 'user' : 'bot',
        timestamp: new Date().toISOString(),
        user: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        session: {
          id: 'session-1',
          topic: 'Support',
          tags: ['general']
        },
        sentiment: 'neutral',
        category: 'General Support',
        responseTime: Math.random() * 2
      }

      setMessages(prev => [newMessage, ...prev])
      
      setMessageStats(prev => ({
        totalMessages: prev.totalMessages + 1,
        averageResponseTime: (prev.averageResponseTime * prev.totalMessages + (newMessage.responseTime || 0)) / (prev.totalMessages + 1),
        successRate: Math.min(100, prev.successRate + (Math.random() * 2 - 1)),
        topCategories: prev.topCategories,
        userSatisfaction: Math.min(100, prev.userSatisfaction + (Math.random() * 2 - 1))
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours()
      setMessageVolume(prev => {
        const newVolume = [...prev]
        const hourIndex = newVolume.findIndex(v => v.hour === hour)
        if (hourIndex >= 0) {
          newVolume[hourIndex].count += Math.floor(Math.random() * 3)
        } else {
          newVolume.push({ hour, count: Math.floor(Math.random() * 10) })
        }
        return newVolume.slice(-24)
      })

      setMessageStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 3),
        averageResponseTime: (prev.averageResponseTime * prev.totalMessages + Math.random() * 2) / (prev.totalMessages + 1),
        successRate: Math.min(100, prev.successRate + (Math.random() * 2 - 1)),
        userSatisfaction: Math.min(100, prev.userSatisfaction + (Math.random() * 2 - 1))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log('Searching with:', { 
        searchQuery, 
        dateRange, 
        selectedSenders, 
        selectedSentiments, 
        selectedCategories,
        selectedTags,
        responseTimeRange
      })
    }, 1000)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    handleSearch()
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const data = messages.map(msg => ({
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp,
        user: msg.user,
        sentiment: msg.sentiment,
        category: msg.category,
        responseTime: msg.responseTime
      }))
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `message-records-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  const toggleSort = (field: 'timestamp' | 'responseTime') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col gap-4 p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden'>
      {/* Message Stats */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300'>Total Messages</h3>
            <div className='p-2.5 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300'>
              <MessageSquare className='w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300'>{messageStats.totalMessages}</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↑ 8%</span> vs last period
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-yellow-600 transition-colors duration-300'>Avg Response Time</h3>
            <div className='p-2.5 rounded-xl bg-yellow-50 group-hover:bg-yellow-100 transition-colors duration-300'>
              <Clock className='w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300'>{messageStats.averageResponseTime.toFixed(1)}s</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↓ 12%</span> vs last period
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors duration-300'>Success Rate</h3>
            <div className='p-2.5 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors duration-300'>
              <CheckCircle2 className='w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300'>{messageStats.successRate.toFixed(1)}%</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↑ 5%</span> vs last period
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-300'>User Satisfaction</h3>
            <div className='p-2.5 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300'>
              <ThumbsUp className='w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300'>{messageStats.userSatisfaction.toFixed(1)}%</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↑ 3%</span> vs last period
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all duration-300'>
        {/* Header */}
        <div className='p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10'>
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
              <History className='w-5 h-5 text-blue-500' />
              Message History
            </h2>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => handleSearch()}
                className='p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 hover:text-blue-600'
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-blue-500' : 'text-gray-500'}`} />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 hover:text-blue-600'
              >
                <Filter className='w-5 h-5 text-gray-500' />
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isExporting ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Download className='w-4 h-4' />
                )}
                Export
              </button>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search messages...'
                className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
            </div>
            <div className='flex gap-2'>
              <input
                type='date'
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className='px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
              <input
                type='date'
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className='px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
            </div>
          </div>

          {showFilters && (
            <div className='mt-4 p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-100 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Sender Type</label>
                <div className='flex flex-wrap gap-2'>
                  {['user', 'bot', 'agent'].map(sender => (
                    <button
                      key={sender}
                      onClick={() => setSelectedSenders(prev => 
                        prev.includes(sender as any)
                          ? prev.filter(s => s !== sender)
                          : [...prev, sender as any]
                      )}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        selectedSenders.includes(sender as any)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {sender}
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
                      onClick={() => setSelectedSentiments(prev =>
                        prev.includes(sentiment as any)
                          ? prev.filter(s => s !== sentiment)
                          : [...prev, sentiment as any]
                      )}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        selectedSentiments.includes(sentiment as any)
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
                <label className='block text-sm font-medium text-gray-700 mb-2'>Response Time Range</label>
                <div className='flex gap-2 items-center'>
                  <input
                    type='number'
                    value={responseTimeRange.min}
                    onChange={(e) => setResponseTimeRange(prev => ({
                      ...prev,
                      min: Number(e.target.value)
                    }))}
                    className='w-20 px-2 py-1.5 border border-gray-200 rounded-lg'
                    min={0}
                    step={0.5}
                  />
                  <span className='text-gray-500'>to</span>
                  <input
                    type='number'
                    value={responseTimeRange.max}
                    onChange={(e) => setResponseTimeRange(prev => ({
                      ...prev,
                      max: Number(e.target.value)
                    }))}
                    className='w-20 px-2 py-1.5 border border-gray-200 rounded-lg'
                    min={0}
                    step={0.5}
                  />
                  <span className='text-gray-500'>seconds</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages List */}
        <div className='flex-1 overflow-y-auto'>
          {messages.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full p-8 text-gray-500'>
              <div className='w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4'>
                <MessageSquare className='w-10 h-10 text-blue-500' />
              </div>
              <p className='text-lg font-medium mb-2'>No Messages Found</p>
              <p className='text-sm text-center max-w-md text-gray-400'>
                Try adjusting your search filters or selecting a different date range.
              </p>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {messages.map(message => (
                <div
                  key={message.id}
                  className='p-4 hover:bg-gray-50/50 transition-colors duration-200'
                >
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                      {message.sender === 'user' ? (
                        <User className='w-5 h-5 text-gray-600' />
                      ) : message.sender === 'bot' ? (
                        <Bot className='w-5 h-5 text-gray-600' />
                      ) : (
                        <UserCheck className='w-5 h-5 text-gray-600' />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium text-gray-900'>{message.user.name}</span>
                          <span className='text-xs text-gray-500'>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          {message.responseTime && (
                            <span className='text-xs text-gray-500 flex items-center gap-1'>
                              <Clock className='w-3 h-3' />
                              {message.responseTime.toFixed(1)}s
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            message.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                            message.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {message.sentiment}
                          </span>
                        </div>
                      </div>
                      <p className='text-gray-800 mb-2'>{message.content}</p>
                      <div className='flex flex-wrap gap-2'>
                        {message.session.tags.map(tag => (
                          <span
                            key={tag}
                            className='px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs'
                          >
                            {tag}
                          </span>
                        ))}
                        {message.category && (
                          <span className='px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs'>
                            {message.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className='p-4 border-t border-gray-100 bg-white sticky bottom-0'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-500'>
              Showing {Math.min(ITEMS_PER_PAGE, messages.length)} of {messages.length} messages
            </p>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <ChevronLeft className='w-5 h-5 text-gray-500' />
              </button>
              <span className='text-sm text-gray-600'>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <ChevronRight className='w-5 h-5 text-gray-500' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage 