'use client'

import { FC } from 'react'
import {
  BarChart2,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Filter,
  Calendar,
  ChevronDown,
  ArrowUpDown,
  Zap,
  Activity
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface AnalyticsData {
  activeUsers: number
  messageCount: number
  averageResponseTime: number
  userSatisfaction: number
  messageVolume: Array<{
    hour: number
    count: number
  }>
  responseTimeDistribution: Array<{
    range: string
    count: number
  }>
  topCategories: Array<{
    category: string
    count: number
  }>
  userActivity: Array<{
    hour: number
    count: number
  }>
  sentimentDistribution: {
    positive: number
    neutral: number
    negative: number
  }
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    activeUsers: 0,
    messageCount: 0,
    averageResponseTime: 0,
    userSatisfaction: 0,
    messageVolume: [],
    responseTimeDistribution: [
      { range: '0-15s', count: 0 },
      { range: '15-30s', count: 0 },
      { range: '30-60s', count: 0 },
      { range: '60s+', count: 0 }
    ],
    topCategories: [],
    userActivity: [],
    sentimentDistribution: {
      positive: 0,
      neutral: 0,
      negative: 0
    }
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        activeUsers: Math.max(0, prev.activeUsers + (Math.random() > 0.5 ? 1 : -1)),
        messageCount: prev.messageCount + Math.floor(Math.random() * 3),
        averageResponseTime: Math.max(0, prev.averageResponseTime + (Math.random() * 0.4 - 0.2)),
        userSatisfaction: Math.min(100, Math.max(0, prev.userSatisfaction + (Math.random() * 2 - 1))),
        messageVolume: [
          ...prev.messageVolume.slice(1),
          {
            hour: new Date().getHours(),
            count: Math.max(0, prev.messageVolume[prev.messageVolume.length - 1]?.count + Math.floor(Math.random() * 5 - 2) || Math.floor(Math.random() * 10))
          }
        ],
        responseTimeDistribution: prev.responseTimeDistribution.map(item => ({
          ...item,
          count: Math.max(0, item.count + Math.floor(Math.random() * 3 - 1))
        })),
        sentimentDistribution: {
          positive: Math.max(0, prev.sentimentDistribution.positive + Math.floor(Math.random() * 3 - 1)),
          neutral: Math.max(0, prev.sentimentDistribution.neutral + Math.floor(Math.random() * 3 - 1)),
          negative: Math.max(0, prev.sentimentDistribution.negative + Math.floor(Math.random() * 3 - 1))
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col gap-4 p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
          <Activity className='w-5 h-5 text-blue-500' />
          Real-Time Analytics
        </h2>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1'>
            {(['1h', '24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
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
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300'>Active Users</h3>
            <div className='p-2.5 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300'>
              <Users className='w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300'>{analyticsData.activeUsers}</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↑ 12%</span> vs last period
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-yellow-600 transition-colors duration-300'>Messages</h3>
            <div className='p-2.5 rounded-xl bg-yellow-50 group-hover:bg-yellow-100 transition-colors duration-300'>
              <MessageSquare className='w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300'>{analyticsData.messageCount}</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↑ 8%</span> vs last period
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors duration-300'>Avg Response</h3>
            <div className='p-2.5 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors duration-300'>
              <Clock className='w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300'>{analyticsData.averageResponseTime.toFixed(1)}s</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↓ 15%</span> vs last period
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-300'>Satisfaction</h3>
            <div className='p-2.5 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300'>
              <ThumbsUp className='w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform duration-300' />
            </div>
          </div>
          <p className='text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300'>{analyticsData.userSatisfaction.toFixed(1)}%</p>
          <p className='text-sm text-gray-500 mt-1'>
            <span className='text-green-500'>↑ 5%</span> vs last period
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0'>
        {/* Message Volume */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all duration-300'>
          <div className='p-4 border-b border-gray-100'>
            <h3 className='font-medium text-gray-800 flex items-center gap-2'>
              <BarChart2 className='w-5 h-5 text-blue-500' />
              Message Volume
            </h3>
          </div>
          <div className='flex-1 p-4'>
            <div className='h-full flex items-end justify-between gap-1'>
              {analyticsData.messageVolume.map((data, index) => (
                <div
                  key={index}
                  className='flex-1 bg-blue-100 hover:bg-blue-200 transition-colors duration-200 rounded-t-lg relative group'
                  style={{ 
                    height: `${data.count ? (data.count / Math.max(...analyticsData.messageVolume.map(d => d.count))) * 100 : 0}%`,
                    minHeight: '4px'
                  }}
                >
                  <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap'>
                    {data.count} messages at {data.hour}:00
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response Time Distribution */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all duration-300'>
          <div className='p-4 border-b border-gray-100'>
            <h3 className='font-medium text-gray-800 flex items-center gap-2'>
              <Clock className='w-5 h-5 text-yellow-500' />
              Response Time Distribution
            </h3>
          </div>
          <div className='flex-1 p-4'>
            <div className='h-full flex items-end justify-between gap-2'>
              {analyticsData.responseTimeDistribution.map((data, index) => (
                <div key={index} className='flex-1 flex flex-col items-center gap-2'>
                  <div
                    className='w-full bg-yellow-100 hover:bg-yellow-200 transition-colors duration-200 rounded-t-lg relative group'
                    style={{ 
                      height: `${data.count ? (data.count / Math.max(...analyticsData.responseTimeDistribution.map(d => d.count))) * 100 : 0}%`,
                      minHeight: '4px'
                    }}
                  >
                    <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      {data.count} messages
                    </div>
                  </div>
                  <span className='text-xs text-gray-500'>{data.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all duration-300'>
          <div className='p-4 border-b border-gray-100'>
            <h3 className='font-medium text-gray-800 flex items-center gap-2'>
              <ThumbsUp className='w-5 h-5 text-green-500' />
              Sentiment Distribution
            </h3>
          </div>
          <div className='flex-1 p-4'>
            <div className='h-full flex items-end justify-between gap-4'>
              {Object.entries(analyticsData.sentimentDistribution).map(([sentiment, count], index) => (
                <div key={sentiment} className='flex-1 flex flex-col items-center gap-2'>
                  <div
                    className={`w-full transition-colors duration-200 rounded-t-lg relative group ${
                      sentiment === 'positive' ? 'bg-green-100 hover:bg-green-200' :
                      sentiment === 'negative' ? 'bg-red-100 hover:bg-red-200' :
                      'bg-blue-100 hover:bg-blue-200'
                    }`}
                    style={{ 
                      height: `${count ? (count / Math.max(...Object.values(analyticsData.sentimentDistribution))) * 100 : 0}%`,
                      minHeight: '4px'
                    }}
                  >
                    <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      {count} messages
                    </div>
                  </div>
                  <span className='text-xs text-gray-500 capitalize'>{sentiment}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all duration-300'>
          <div className='p-4 border-b border-gray-100'>
            <h3 className='font-medium text-gray-800 flex items-center gap-2'>
              <Activity className='w-5 h-5 text-purple-500' />
              Real-time Activity
            </h3>
          </div>
          <div className='flex-1 p-4 overflow-y-auto'>
            <div className='space-y-4'>
              {[...Array(5)].map((_, index) => (
                <div key={index} className='flex items-center gap-3 animate-fade-in'>
                  <div className='w-2 h-2 rounded-full bg-green-500'></div>
                  <div className='flex-1'>
                    <p className='text-sm text-gray-800'>New user session started</p>
                    <p className='text-xs text-gray-500'>Just now</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 