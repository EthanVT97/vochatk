'use client'

import { FC, useState } from 'react'
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Shield, 
  Key 
} from 'lucide-react'
import Link from 'next/link'

interface UserData {
  name: string
  email: string
  role: string
  avatar?: string
}

const UserProfile: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  // This would normally come from your auth system
  const user: UserData = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    avatar: undefined // Add avatar URL if available
  }

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user.name[0]
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </button>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border 
          overflow-hidden z-50 animate-in fade-in slide-in-from-top-5"
        >
          {/* User Info */}
          <div className="p-4 border-b bg-gray-50">
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="mt-2 flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-600" />
              <span className="text-xs text-gray-600">{user.role}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link 
              href="/dashboard/profile"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>
            <Link 
              href="/dashboard/settings"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <Link 
              href="/dashboard/notifications"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
            >
              <Bell className="w-4 h-4" />
              Notification Preferences
            </Link>
            <Link 
              href="/dashboard/security"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
            >
              <Key className="w-4 h-4" />
              Security
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t p-2">
            <button 
              onClick={() => console.log('Logout')}
              className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-red-50 text-red-600 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile 