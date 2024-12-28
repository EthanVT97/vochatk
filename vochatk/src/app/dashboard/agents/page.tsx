'use client'

import { FC, useState, useEffect } from 'react'
import { 
  MessageSquare, 
  User, 
  Clock, 
  Bot,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MessageCircle,
  Bell,
  BarChart2,
  Users as UsersIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChatInterface {
  id: string
  name: string
  description: string
  welcomeMessage: string
  responseMessages: {
    id: string
    message: string
    order: number
  }[]
}

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  department: string
  role: string
  status: 'online' | 'offline'
  joinDate: string
  assignedInterfaces: ChatInterface[]
  activeChats: number
  totalChats: number
  incomingMessages: IncomingMessage[]
}

interface DirectChatModalProps {
  agent: Agent
  onClose: () => void
}

interface IncomingMessage {
  id: string
  interfaceId: string
  interfaceName: string
  userId: string
  userName: string
  message: string
  timestamp: string
  isHandled: boolean
}

const DirectChatModal: FC<DirectChatModalProps> = ({ agent, onClose }) => {
  const router = useRouter()
  
  const handleStartChat = (chatInterface: ChatInterface) => {
    router.push(`/dashboard/chatpage?agent=${agent.id}&interface=${chatInterface.id}`)
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl p-6 w-full max-w-md'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Start Direct Chat</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
          >
            <XCircle className='w-5 h-5 text-gray-500' />
          </button>
        </div>
        
        <div className='mb-4'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
              <User className='w-5 h-5 text-gray-600' />
            </div>
            <div>
              <h3 className='font-medium text-gray-800'>{agent.name}</h3>
              <p className='text-sm text-gray-500'>{agent.role}</p>
            </div>
          </div>
        </div>

        <div className='space-y-3'>
          <h3 className='text-sm font-medium text-gray-600'>Select Chat Interface</h3>
          {agent.assignedInterfaces.map((chatInterface) => (
            <button
              key={chatInterface.id}
              onClick={() => handleStartChat(chatInterface)}
              className='w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left'
            >
              <div className='flex items-center justify-between mb-1'>
                <div className='flex items-center gap-2'>
                  <Bot className='w-5 h-5 text-blue-500' />
                  <span className='font-medium text-gray-800'>{chatInterface.name}</span>
                </div>
                <MessageCircle className='w-5 h-5 text-gray-400' />
              </div>
              <p className='text-sm text-gray-600'>{chatInterface.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const AgentsPage: FC = () => {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 234 567 8900',
      department: 'Customer Support',
      role: 'Senior Agent',
      status: 'online',
      joinDate: '2024-01-15',
      assignedInterfaces: [
        {
          id: '1',
          name: 'Customer Support',
          description: 'Main customer support interface for handling general inquiries',
          welcomeMessage: 'Welcome to our customer support! How can we help you today?',
          responseMessages: [
            {
              id: '1',
              message: 'Thank you for contacting us. How may I assist you today?',
              order: 1
            },
            {
              id: '2',
              message: 'I understand your concern. Let me help you with that.',
              order: 2
            }
          ]
        }
      ],
      activeChats: 2,
      totalChats: 150,
      incomingMessages: [
        {
          id: '1',
          interfaceId: '1',
          interfaceName: 'Customer Support',
          userId: 'user1',
          userName: 'Alice Brown',
          message: 'Hi, I need help with my recent order',
          timestamp: new Date().toISOString(),
          isHandled: false
        },
        {
          id: '2',
          interfaceId: '1',
          interfaceName: 'Customer Support',
          userId: 'user2',
          userName: 'Bob Wilson',
          message: 'Is there anyone available to help?',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          isHandled: false
        }
      ]
    }
  ])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showInterfaceDetails, setShowInterfaceDetails] = useState(false)
  const [selectedInterface, setSelectedInterface] = useState<ChatInterface | null>(null)
  const [showDirectChatModal, setShowDirectChatModal] = useState(false)

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowInterfaceDetails(false)
  }

  const handleInterfaceClick = (chatInterface: ChatInterface) => {
    setSelectedInterface(chatInterface)
    setShowInterfaceDetails(true)
  }

  const handleStartDirectChat = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowDirectChatModal(true)
  }

  const handleRespondToMessage = (agent: Agent, message: IncomingMessage) => {
    router.push(`/dashboard/chatpage?agent=${agent.id}&interface=${message.interfaceId}&user=${message.userId}`)
  }

  const getTotalStats = () => {
    return agents.reduce((acc, agent) => ({
      totalAgents: acc.totalAgents + 1,
      onlineAgents: acc.onlineAgents + (agent.status === 'online' ? 1 : 0),
      totalActiveChats: acc.totalActiveChats + agent.activeChats,
      totalChats: acc.totalChats + agent.totalChats,
      pendingMessages: acc.pendingMessages + agent.incomingMessages.filter(m => !m.isHandled).length
    }), {
      totalAgents: 0,
      onlineAgents: 0,
      totalActiveChats: 0,
      totalChats: 0,
      pendingMessages: 0
    })
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Statistics Overview */}
      <div className='mb-6 grid grid-cols-5 gap-4'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-medium text-gray-600'>Total Agents</h3>
            <UsersIcon className='w-5 h-5 text-blue-500' />
          </div>
          <div className='flex items-end justify-between'>
            <p className='text-2xl font-semibold text-gray-800'>{getTotalStats().totalAgents}</p>
            <span className='text-xs text-gray-500'>
              {getTotalStats().onlineAgents} online
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-medium text-gray-600'>Active Chats</h3>
            <MessageSquare className='w-5 h-5 text-green-500' />
          </div>
          <div className='flex items-end justify-between'>
            <p className='text-2xl font-semibold text-gray-800'>{getTotalStats().totalActiveChats}</p>
            <span className='text-xs text-gray-500'>
              {(getTotalStats().totalActiveChats / getTotalStats().totalAgents).toFixed(1)} per agent
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-medium text-gray-600'>Total Chats</h3>
            <BarChart2 className='w-5 h-5 text-purple-500' />
          </div>
          <div className='flex items-end justify-between'>
            <p className='text-2xl font-semibold text-gray-800'>{getTotalStats().totalChats}</p>
            <span className='text-xs text-gray-500'>
              lifetime
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-medium text-gray-600'>Pending Messages</h3>
            <Bell className='w-5 h-5 text-orange-500' />
          </div>
          <div className='flex items-end justify-between'>
            <p className='text-2xl font-semibold text-gray-800'>{getTotalStats().pendingMessages}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getTotalStats().pendingMessages > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {getTotalStats().pendingMessages > 0 ? 'needs attention' : 'all clear'}
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-medium text-gray-600'>Response Rate</h3>
            <Clock className='w-5 h-5 text-cyan-500' />
          </div>
          <div className='flex items-end justify-between'>
            <p className='text-2xl font-semibold text-gray-800'>98%</p>
            <span className='text-xs text-green-600'>
              +2.5%
            </span>
          </div>
        </div>
      </div>

      <div className='flex gap-6 h-[calc(100vh-220px)]'>
        {/* Agents List */}
        <div className='w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='p-4 border-b border-gray-200 bg-gray-50'>
            <h2 className='text-lg font-semibold text-gray-800'>Agents</h2>
          </div>
          <div className='divide-y divide-gray-200 overflow-y-auto max-h-full'>
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                  selectedAgent?.id === agent.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className='flex items-center justify-between mb-2'>
                  <div 
                    className='flex items-center gap-3 cursor-pointer'
                    onClick={() => handleAgentClick(agent)}
                  >
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                      <User className='w-5 h-5 text-gray-600' />
                    </div>
                    <div>
                      <h3 className='font-medium text-gray-800'>{agent.name}</h3>
                      <p className='text-sm text-gray-500'>{agent.role}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.status}
                    </span>
                    {agent.status === 'online' && (
                      <button
                        onClick={() => handleStartDirectChat(agent)}
                        className='p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200'
                        title='Start Direct Chat'
                      >
                        <MessageCircle className='w-5 h-5 text-blue-500' />
                      </button>
                    )}
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
                  <div className='flex items-center gap-1'>
                    <MessageSquare className='w-4 h-4' />
                    {agent.activeChats} active
                  </div>
                  <div className='flex items-center gap-1'>
                    <Clock className='w-4 h-4' />
                    {agent.totalChats} total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Details */}
        {selectedAgent && (
          <div className='flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
            {!showInterfaceDetails ? (
              <>
                <div className='p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between'>
                  <h2 className='text-lg font-semibold text-gray-800'>Agent Profile</h2>
                  <div className='flex items-center gap-2'>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedAgent.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedAgent.status}
                    </span>
                    {selectedAgent.status === 'online' && (
                      <button
                        onClick={() => handleStartDirectChat(selectedAgent)}
                        className='px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1 text-sm'
                      >
                        <MessageCircle className='w-4 h-4' />
                        Start Chat
                      </button>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-3 h-[calc(100%-65px)]'>
                  {/* Left Column - Personal Info */}
                  <div className='border-r border-gray-200 p-6'>
                    <div className='flex items-center gap-4 mb-6'>
                      <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center'>
                        <User className='w-10 h-10 text-gray-600' />
                      </div>
                      <div>
                        <h3 className='text-xl font-semibold text-gray-800'>{selectedAgent.name}</h3>
                        <p className='text-gray-600'>{selectedAgent.role}</p>
                        <p className='text-sm text-gray-500'>{selectedAgent.department}</p>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div className='p-4 bg-gray-50 rounded-lg'>
                        <div className='flex items-center gap-2 mb-1'>
                          <Mail className='w-4 h-4 text-gray-500' />
                          <span className='text-sm font-medium text-gray-600'>Email</span>
                        </div>
                        <p className='text-gray-800'>{selectedAgent.email}</p>
                      </div>

                      <div className='p-4 bg-gray-50 rounded-lg'>
                        <div className='flex items-center gap-2 mb-1'>
                          <Phone className='w-4 h-4 text-gray-500' />
                          <span className='text-sm font-medium text-gray-600'>Phone</span>
                        </div>
                        <p className='text-gray-800'>{selectedAgent.phone}</p>
                      </div>

                      <div className='p-4 bg-gray-50 rounded-lg'>
                        <div className='flex items-center gap-2 mb-1'>
                          <Calendar className='w-4 h-4 text-gray-500' />
                          <span className='text-sm font-medium text-gray-600'>Join Date</span>
                        </div>
                        <p className='text-gray-800'>{selectedAgent.joinDate}</p>
                      </div>
                    </div>

                    <div className='mt-6 grid grid-cols-2 gap-3'>
                      <div className='p-4 bg-blue-50 rounded-lg'>
                        <p className='text-sm text-gray-600 mb-1'>Active Chats</p>
                        <p className='text-2xl font-semibold text-gray-800'>{selectedAgent.activeChats}</p>
                      </div>
                      <div className='p-4 bg-green-50 rounded-lg'>
                        <p className='text-sm text-gray-600 mb-1'>Total Chats</p>
                        <p className='text-2xl font-semibold text-gray-800'>{selectedAgent.totalChats}</p>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column - Incoming Messages */}
                  <div className='border-r border-gray-200 p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h4 className='text-sm font-medium text-gray-600'>Incoming Messages</h4>
                      {selectedAgent.incomingMessages.filter(m => !m.isHandled).length > 0 && (
                        <span className='px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full'>
                          {selectedAgent.incomingMessages.filter(m => !m.isHandled).length} new
                        </span>
                      )}
                    </div>
                    <div className='space-y-3 h-[calc(100%-40px)] overflow-y-auto'>
                      {selectedAgent.incomingMessages.length > 0 ? (
                        selectedAgent.incomingMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-4 border rounded-lg ${
                              message.isHandled ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
                            }`}
                          >
                            <div className='flex items-center justify-between mb-2'>
                              <div className='flex items-center gap-2'>
                                <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                                  <User className='w-4 h-4 text-gray-600' />
                                </div>
                                <div>
                                  <h5 className='font-medium text-gray-800'>{message.userName}</h5>
                                  <p className='text-xs text-gray-500'>{message.interfaceName}</p>
                                </div>
                              </div>
                              <div className='flex items-center gap-2'>
                                <span className='text-xs text-gray-500'>
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                                {!message.isHandled && (
                                  <Bell className='w-4 h-4 text-blue-500' />
                                )}
                              </div>
                            </div>
                            <p className='text-sm text-gray-600 mb-2'>{message.message}</p>
                            <div className='flex justify-end'>
                              <button
                                onClick={() => handleRespondToMessage(selectedAgent, message)}
                                className='px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200'
                              >
                                Respond
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='text-center py-4 text-sm text-gray-500'>
                          No incoming messages
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Assigned Interfaces */}
                  <div className='p-6'>
                    <h4 className='text-sm font-medium text-gray-600 mb-4'>Assigned Chat Interfaces</h4>
                    <div className='space-y-3 h-[calc(100%-40px)] overflow-y-auto'>
                      {selectedAgent.assignedInterfaces.map((chatInterface) => (
                        <div
                          key={chatInterface.id}
                          onClick={() => handleInterfaceClick(chatInterface)}
                          className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200'
                        >
                          <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center gap-2'>
                              <Bot className='w-5 h-5 text-blue-500' />
                              <h5 className='font-medium text-gray-800'>{chatInterface.name}</h5>
                            </div>
                            <ChevronRight className='w-5 h-5 text-gray-400' />
                          </div>
                          <p className='text-sm text-gray-600 line-clamp-2'>{chatInterface.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='p-4 border-b border-gray-200 bg-gray-50'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold text-gray-800'>Interface Details</h2>
                    <button
                      onClick={() => setShowInterfaceDetails(false)}
                      className='text-sm text-blue-500 hover:text-blue-600'
                    >
                      Back to Agent Details
                    </button>
                  </div>
                </div>
                <div className='p-6'>
                  {selectedInterface && (
                    <>
                      <div className='mb-6'>
                        <div className='flex items-center gap-3 mb-4'>
                          <Bot className='w-8 h-8 text-blue-500' />
                          <div>
                            <h3 className='text-xl font-semibold text-gray-800'>{selectedInterface.name}</h3>
                            <p className='text-gray-600'>{selectedInterface.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className='space-y-6'>
                        <div>
                          <h4 className='text-sm font-medium text-gray-600 mb-2'>Welcome Message</h4>
                          <div className='p-4 bg-gray-50 rounded-lg'>
                            <p className='text-gray-800'>{selectedInterface.welcomeMessage}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className='text-sm font-medium text-gray-600 mb-2'>Response Messages</h4>
                          <div className='space-y-3'>
                            {selectedInterface.responseMessages.map((msg) => (
                              <div key={msg.id} className='p-4 border border-gray-200 rounded-lg'>
                                <div className='flex items-center justify-between mb-2'>
                                  <span className='text-sm font-medium text-gray-600'>Response {msg.order}</span>
                                </div>
                                <p className='text-gray-800'>{msg.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Direct Chat Modal */}
      {showDirectChatModal && selectedAgent && (
        <DirectChatModal
          agent={selectedAgent}
          onClose={() => setShowDirectChatModal(false)}
        />
      )}
    </div>
  )
}

export default AgentsPage 