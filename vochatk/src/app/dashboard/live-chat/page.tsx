import { FC } from 'react'
import { MessageSquare, Users, Clock } from 'lucide-react'

interface Conversation {
  id: string
  user: string
  lastMessage: string
  timestamp: string
  status: 'active' | 'pending' | 'resolved'
  messages: number
}

const LiveChatPage: FC = () => {
  // This would normally come from an API
  const conversations: Conversation[] = [
    {
      id: '1',
      user: 'John Doe',
      lastMessage: 'I need help with my order #12345',
      timestamp: '2 mins ago',
      status: 'active',
      messages: 4,
    },
    {
      id: '2',
      user: 'Jane Smith',
      lastMessage: 'How do I reset my password?',
      timestamp: '5 mins ago',
      status: 'pending',
      messages: 2,
    },
    {
      id: '3',
      user: 'Mike Johnson',
      lastMessage: 'Thanks for your help!',
      timestamp: '15 mins ago',
      status: 'resolved',
      messages: 8,
    },
  ]

  const stats = [
    {
      label: 'Active Chats',
      value: '3',
      icon: MessageSquare,
      color: 'text-blue-600',
    },
    {
      label: 'Total Users',
      value: '128',
      icon: Users,
      color: 'text-green-600',
    },
    {
      label: 'Avg. Response Time',
      value: '2m',
      icon: Clock,
      color: 'text-purple-600',
    },
  ]

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Live Chat Management</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className='bg-white rounded-lg border p-4 flex items-center'
          >
            <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
              <stat.icon className='w-5 h-5' />
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-500'>{stat.label}</p>
              <p className='text-2xl font-semibold'>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white rounded-lg border'>
        <div className='p-4 border-b'>
          <h2 className='font-semibold'>Recent Conversations</h2>
        </div>
        <div className='divide-y'>
          {conversations.map((conversation) => (
            <div key={conversation.id} className='p-4 hover:bg-gray-50'>
              <div className='flex justify-between items-start mb-1'>
                <h3 className='font-medium'>{conversation.user}</h3>
                <span className='text-sm text-gray-500'>
                  {conversation.timestamp}
                </span>
              </div>
              <p className='text-sm text-gray-600 mb-2'>
                {conversation.lastMessage}
              </p>
              <div className='flex justify-between items-center'>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    conversation.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : conversation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {conversation.status.charAt(0).toUpperCase() +
                    conversation.status.slice(1)}
                </span>
                <span className='text-sm text-gray-500'>
                  {conversation.messages} messages
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LiveChatPage 