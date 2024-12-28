import { FC } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  MessageSquare, 
  Settings, 
  LayoutTemplate,
  Bot
} from 'lucide-react'

const DashboardNav: FC = () => {
  const pathname = usePathname()

  const routes = [
    {
      label: 'User Management',
      icon: Users,
      href: '/dashboard/users',
      active: pathname === '/dashboard/users',
    },
    {
      label: 'Chat Templates',
      icon: LayoutTemplate,
      href: '/dashboard/templates',
      active: pathname === '/dashboard/templates',
    },
    {
      label: 'Live ChatBot',
      icon: Bot,
      href: '/dashboard/live-chat',
      active: pathname === '/dashboard/live-chat',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/settings',
      active: pathname === '/dashboard/settings',
    },
  ]

  return (
    <nav className='flex flex-col gap-2'>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={`flex items-center gap-2 p-3 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all ${
            route.active ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
          }`}
        >
          <route.icon className='w-4 h-4' />
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

export default DashboardNav 