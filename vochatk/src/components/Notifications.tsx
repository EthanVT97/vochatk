'use client'

import { FC, useState } from 'react'
import { Bell, X, Check } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: 'message' | 'alert' | 'success' | 'warning'
  read: boolean
}

const Notifications: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Message',
      message: 'You have a new message from John Doe',
      time: '2 min ago',
      type: 'message',
      read: false
    },
    {
      id: '2',
      title: 'System Update',
      message: 'System maintenance scheduled for tonight',
      time: '1 hour ago',
      type: 'warning',
      read: false
    },
    {
      id: '3',
      title: 'Task Completed',
      message: 'Backup process completed successfully',
      time: '2 hours ago',
      type: 'success',
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message': return 'bg-blue-500'
      case 'alert': return 'bg-red-500'
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs 
            rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1
            animate-pulse"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border 
          overflow-hidden z-50 animate-in fade-in slide-in-from-top-5"
        >
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors
                  ${notification.read ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationColor(notification.type)}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800">{notification.title}</h4>
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications 