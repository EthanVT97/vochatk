'use client'

import { FC, ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Bot,
  BarChart3
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

interface ChatMessage {
  id: string
  interfaceId: string
  interfaceName: string
  message: string
  sender: string
  timestamp: string
  isRead: boolean
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      interfaceId: '1',
      interfaceName: 'Customer Support',
      message: 'Hello, I need help with my order',
      sender: 'John Doe',
      timestamp: '2024-01-22 10:30',
      isRead: false
    },
    {
      id: '2',
      interfaceId: '1',
      interfaceName: 'Customer Support',
      message: 'When will my order arrive?',
      sender: 'Jane Smith',
      timestamp: '2024-01-22 10:45',
      isRead: true
    }
  ])

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard'
    },
    {
      label: 'Messages',
      icon: MessageSquare,
      href: '/dashboard/messages'
    },
    {
      label: 'Agents',
      icon: Users,
      href: '/dashboard/agents'
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      href: '/dashboard/analytics'
    },
    {
      label: 'Chat Interfaces',
      icon: Bot,
      href: '/dashboard/admin'
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/settings'
    }
  ]

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}>
        {/* Sidebar Header */}
        <div className='h-16 border-b border-gray-200 flex items-center justify-between px-4'>
          {!isCollapsed && <h1 className='text-xl font-bold text-gray-800'>LiveChatBot</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
          >
            {isCollapsed ? (
              <ChevronRight className='w-5 h-5 text-gray-500' />
            ) : (
              <ChevronLeft className='w-5 h-5 text-gray-500' />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 py-4 overflow-y-auto'>
          <div className='space-y-1 px-3'>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className='w-5 h-5 flex-shrink-0' />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Recent Messages */}
        {!isCollapsed && (
          <div className='border-t border-gray-200 p-4'>
            <h2 className='text-sm font-medium text-gray-600 mb-3'>Recent Messages</h2>
            <div className='space-y-3 max-h-64 overflow-y-auto'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.isRead ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs font-medium text-gray-600'>
                      {message.interfaceName}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className='text-sm text-gray-800 line-clamp-2'>
                    <span className='font-medium'>{message.sender}:</span> {message.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout 