'use client'

import { FC, useState } from 'react'
import { Plus, Edit2, Trash2, Users, MessageSquare, Settings, Search, MoreVertical, X, Bot, Clock, Globe, Shield, Link, Copy, Check, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ResponseMessage {
  id: string
  message: string
  order: number
}

interface ChatInterface {
  id: string
  name: string
  status: 'active' | 'inactive'
  agents: number
  totalChats: number
  createdAt: string
  lastModified: string
  description?: string
  welcomeMessage?: string
  responseMessage?: string
  language?: string
  operatingHours?: {
    start: string
    end: string
  }
  maxChatsPerAgent?: number
  autoAssignment?: boolean
  botEnabled?: boolean
  responseMessages?: ResponseMessage[]
}

const AdminDashboard: FC = () => {
  const router = useRouter()
  const [chatInterfaces, setChatInterfaces] = useState<ChatInterface[]>([
    {
      id: '1',
      name: 'Customer Support',
      status: 'active',
      agents: 5,
      totalChats: 150,
      createdAt: '2024-01-15',
      lastModified: '2024-01-20',
      description: 'Main customer support interface',
      welcomeMessage: 'Welcome to our customer support! How can we help you today?',
      language: 'English',
      operatingHours: {
        start: '09:00',
        end: '17:00'
      },
      maxChatsPerAgent: 3,
      autoAssignment: true,
      botEnabled: true
    }
  ])
  const [isCreating, setIsCreating] = useState(false)
  const [newInterface, setNewInterface] = useState({
    name: '',
    description: '',
    welcomeMessage: '',
    responseMessages: [] as ResponseMessage[],
    language: 'English',
    agents: 0,
    operatingHours: {
      start: '09:00',
      end: '17:00'
    },
    maxChatsPerAgent: 3,
    autoAssignment: true,
    botEnabled: true
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [newInterfaceId, setNewInterfaceId] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedInterface, setSelectedInterface] = useState<ChatInterface | null>(null)

  const handleCreateInterface = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newInterface.name) return

    const interfaceId = Date.now().toString()
    const newChatInterface: ChatInterface = {
      id: interfaceId,
      name: newInterface.name,
      status: 'active',
      agents: newInterface.agents,
      totalChats: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      description: newInterface.description,
      welcomeMessage: newInterface.welcomeMessage,
      responseMessages: newInterface.responseMessages,
      language: newInterface.language,
      operatingHours: newInterface.operatingHours,
      maxChatsPerAgent: newInterface.maxChatsPerAgent,
      autoAssignment: newInterface.autoAssignment,
      botEnabled: newInterface.botEnabled
    }

    setChatInterfaces(prev => [...prev, newChatInterface])
    setIsCreating(false)
    setNewInterfaceId(interfaceId)
    setShowSuccessModal(true)
    setNewInterface({
      name: '',
      description: '',
      welcomeMessage: '',
      responseMessages: [],
      language: 'English',
      agents: 0,
      operatingHours: {
        start: '09:00',
        end: '17:00'
      },
      maxChatsPerAgent: 3,
      autoAssignment: true,
      botEnabled: true
    })
    setCurrentStep(1)
  }

  const handleDeleteInterface = (id: string) => {
    setChatInterfaces(prev => prev.filter(item => item.id !== id))
  }

  const handleCopyLink = (interfaceId: string) => {
    const link = `${window.location.origin}/chat/${interfaceId}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEditInterface = (interface_: ChatInterface) => {
    setSelectedInterface(interface_)
    setNewInterface({
      name: interface_.name,
      description: interface_.description || '',
      welcomeMessage: interface_.welcomeMessage || '',
      responseMessages: interface_.responseMessages || [],
      language: interface_.language || 'English',
      agents: interface_.agents,
      operatingHours: interface_.operatingHours || {
        start: '09:00',
        end: '17:00'
      },
      maxChatsPerAgent: interface_.maxChatsPerAgent || 3,
      autoAssignment: interface_.autoAssignment || true,
      botEnabled: interface_.botEnabled || true
    })
    setIsEditing(true)
    setCurrentStep(1)
  }

  const handleUpdateInterface = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newInterface.name || !selectedInterface) return

    const updatedInterface: ChatInterface = {
      ...selectedInterface,
      name: newInterface.name,
      description: newInterface.description,
      welcomeMessage: newInterface.welcomeMessage,
      responseMessages: newInterface.responseMessages,
      language: newInterface.language,
      agents: newInterface.agents,
      operatingHours: newInterface.operatingHours,
      maxChatsPerAgent: newInterface.maxChatsPerAgent,
      autoAssignment: newInterface.autoAssignment,
      botEnabled: newInterface.botEnabled,
      lastModified: new Date().toISOString().split('T')[0]
    }

    setChatInterfaces(prev => 
      prev.map(item => 
        item.id === selectedInterface.id ? updatedInterface : item
      )
    )
    setIsEditing(false)
    setSelectedInterface(null)
    setNewInterface({
      name: '',
      description: '',
      welcomeMessage: '',
      responseMessages: [],
      language: 'English',
      agents: 0,
      operatingHours: {
        start: '09:00',
        end: '17:00'
      },
      maxChatsPerAgent: 3,
      autoAssignment: true,
      botEnabled: true
    })
    setCurrentStep(1)
  }

  const handleAddResponseMessage = () => {
    setNewInterface(prev => ({
      ...prev,
      responseMessages: [
        ...prev.responseMessages,
        {
          id: Date.now().toString(),
          message: '',
          order: prev.responseMessages.length + 1
        }
      ]
    }))
  }

  const handleRemoveResponseMessage = (id: string) => {
    setNewInterface(prev => ({
      ...prev,
      responseMessages: prev.responseMessages
        .filter(msg => msg.id !== id)
        .map((msg, index) => ({ ...msg, order: index + 1 }))
    }))
  }

  const handleResponseMessageChange = (id: string, value: string) => {
    setNewInterface(prev => ({
      ...prev,
      responseMessages: prev.responseMessages.map(msg =>
        msg.id === id ? { ...msg, message: value } : msg
      )
    }))
  }

  const filteredInterfaces = chatInterfaces.filter(
    item => item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderCreateStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Interface Name</label>
                <input
                  type='text'
                  value={newInterface.name}
                  onChange={(e) => setNewInterface(prev => ({ ...prev, name: e.target.value }))}
                  placeholder='e.g., Customer Support'
                  className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Language</label>
                <select
                  value={newInterface.language}
                  onChange={(e) => setNewInterface(prev => ({ ...prev, language: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm'
                >
                  <option value='English'>English</option>
                  <option value='Myanmar'>Myanmar (မြန်မာ)</option>
                  <option value='Thai'>Thai (ไทย)</option>
                  <option value='Spanish'>Spanish</option>
                  <option value='French'>French</option>
                  <option value='German'>German</option>
                  <option value='Chinese'>Chinese</option>
                  <option value='Japanese'>Japanese</option>
                </select>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
              <textarea
                value={newInterface.description}
                onChange={(e) => setNewInterface(prev => ({ ...prev, description: e.target.value }))}
                placeholder='Describe the purpose of this chat interface'
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm h-16'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Welcome Message</label>
              <textarea
                value={newInterface.welcomeMessage}
                onChange={(e) => setNewInterface(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                placeholder='Enter the initial welcome message'
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm h-16'
              />
            </div>
            <div>
              <div className='flex items-center justify-between mb-2'>
                <label className='block text-sm font-medium text-gray-700'>Response Messages</label>
                <button
                  type='button'
                  onClick={handleAddResponseMessage}
                  className='flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors duration-200'
                >
                  <PlusCircle className='w-4 h-4' />
                  Add Response
                </button>
              </div>
              <div className='border border-gray-200 rounded-lg'>
                <div className='max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 sticky top-0 z-10'>
                      <tr>
                        <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 w-12 bg-gray-50'>#</th>
                        <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50'>Message</th>
                        <th className='px-3 py-2 w-10 bg-gray-50'></th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {newInterface.responseMessages.map((msg) => (
                        <tr key={msg.id} className='hover:bg-gray-50'>
                          <td className='px-3 py-2 text-xs text-gray-500 align-top'>
                            {msg.order}
                          </td>
                          <td className='px-3 py-2'>
                            <textarea
                              value={msg.message}
                              onChange={(e) => handleResponseMessageChange(msg.id, e.target.value)}
                              placeholder='Enter response message'
                              className='w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-blue-500 text-sm resize-none'
                              rows={1}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                              }}
                            />
                          </td>
                          <td className='px-3 py-2 align-top'>
                            <button
                              type='button'
                              onClick={() => handleRemoveResponseMessage(msg.id)}
                              className='text-red-500 hover:text-red-600 transition-colors duration-200'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {newInterface.responseMessages.length === 0 && (
                        <tr>
                          <td colSpan={3} className='px-3 py-3 text-center text-sm text-gray-500'>
                            No responses added
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='flex items-center justify-between mt-1'>
                <p className='text-xs text-gray-500'>
                  Messages will be sent in sequence when users interact
                </p>
                <p className='text-xs text-gray-500'>
                  {newInterface.responseMessages.length} response{newInterface.responseMessages.length !== 1 ? 's' : ''} added
                </p>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Number of Agents</label>
                <input
                  type='number'
                  value={newInterface.agents}
                  onChange={(e) => setNewInterface(prev => ({ ...prev, agents: parseInt(e.target.value) || 0 }))}
                  min='1'
                  className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Max Chats per Agent</label>
                <input
                  type='number'
                  value={newInterface.maxChatsPerAgent}
                  onChange={(e) => setNewInterface(prev => ({ ...prev, maxChatsPerAgent: parseInt(e.target.value) || 1 }))}
                  min='1'
                  max='10'
                  className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Operating Hours</label>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs text-gray-500 mb-1'>Start Time</label>
                  <input
                    type='time'
                    value={newInterface.operatingHours.start}
                    onChange={(e) => setNewInterface(prev => ({
                      ...prev,
                      operatingHours: { ...prev.operatingHours, start: e.target.value }
                    }))}
                    className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-xs text-gray-500 mb-1'>End Time</label>
                  <input
                    type='time'
                    value={newInterface.operatingHours.end}
                    onChange={(e) => setNewInterface(prev => ({
                      ...prev,
                      operatingHours: { ...prev.operatingHours, end: e.target.value }
                    }))}
                    className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm'
                  />
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='autoAssignment'
                  checked={newInterface.autoAssignment}
                  onChange={(e) => setNewInterface(prev => ({ ...prev, autoAssignment: e.target.checked }))}
                  className='w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500'
                />
                <label htmlFor='autoAssignment' className='ml-2 text-sm text-gray-700'>Enable Auto Assignment</label>
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='botEnabled'
                  checked={newInterface.botEnabled}
                  onChange={(e) => setNewInterface(prev => ({ ...prev, botEnabled: e.target.checked }))}
                  className='w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500'
                />
                <label htmlFor='botEnabled' className='ml-2 text-sm text-gray-700'>Enable AI Bot</label>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Chat Interface Management</h1>
        <button
          onClick={() => setIsCreating(true)}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2'
        >
          <Plus className='w-5 h-5' />
          Create New Interface
        </button>
      </div>

      {/* Search and Filters */}
      <div className='mb-6 flex gap-4'>
        <div className='flex-1 relative'>
          <Search className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
          <input
            type='text'
            placeholder='Search interfaces...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200'
          />
        </div>
      </div>

      {/* Create/Edit Interface Form */}
      {(isCreating || isEditing) && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-2xl'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-800'>
                {isEditing ? 'Edit Chat Interface' : 'Create New Chat Interface'}
              </h2>
              <button
                onClick={() => {
                  if (isEditing) {
                    setIsEditing(false)
                    setSelectedInterface(null)
                  } else {
                    setIsCreating(false)
                  }
                  setCurrentStep(1)
                }}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Progress Steps */}
            <div className='flex items-center justify-between mb-8'>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className='flex items-center'
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === currentStep
                        ? 'bg-blue-500 text-white'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-24 h-1 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={isEditing ? handleUpdateInterface : handleCreateInterface} className='space-y-6'>
              {renderCreateStep()}
              
              <div className='flex justify-between'>
                <button
                  type='button'
                  onClick={() => currentStep > 1 && setCurrentStep(prev => prev - 1)}
                  className={`px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 ${
                    currentStep === 1 ? 'invisible' : ''
                  }`}
                >
                  Back
                </button>
                {currentStep < 3 ? (
                  <button
                    type='button'
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200'
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type='submit'
                    className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200'
                  >
                    {isEditing ? 'Update Interface' : 'Create Interface'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-800'>Interface Created Successfully</h2>
              <button
                onClick={() => setShowSuccessModal(false)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <p className='text-sm text-gray-600 mb-2'>Share this link with your customers:</p>
                <div className='flex items-center gap-2 p-3 bg-gray-50 rounded-lg'>
                  <Link className='w-5 h-5 text-blue-500 flex-shrink-0' />
                  <span className='text-sm text-gray-800 truncate flex-1'>
                    {`${window.location.origin}/chat/${newInterfaceId}`}
                  </span>
                  <button
                    onClick={() => handleCopyLink(newInterfaceId)}
                    className='p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200'
                  >
                    {copied ? (
                      <Check className='w-5 h-5 text-green-500' />
                    ) : (
                      <Copy className='w-5 h-5 text-gray-500' />
                    )}
                  </button>
                </div>
              </div>
              <div className='flex justify-end'>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200'
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interface List */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
        <div className='grid grid-cols-7 gap-4 p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl'>
          <div className='font-medium text-gray-600'>Name</div>
          <div className='font-medium text-gray-600'>Status</div>
          <div className='font-medium text-gray-600'>Agents</div>
          <div className='font-medium text-gray-600'>Total Chats</div>
          <div className='font-medium text-gray-600'>Created</div>
          <div className='font-medium text-gray-600'>Last Modified</div>
          <div className='font-medium text-gray-600'>Actions</div>
        </div>
        <div className='divide-y divide-gray-200'>
          {filteredInterfaces.map(item => (
            <div key={item.id} className='grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-50 transition-colors duration-200'>
              <div className='font-medium text-gray-800'>{item.name}</div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className='text-gray-600 flex items-center gap-1'>
                <Users className='w-4 h-4' />
                {item.agents}
              </div>
              <div className='text-gray-600 flex items-center gap-1'>
                <MessageSquare className='w-4 h-4' />
                {item.totalChats}
              </div>
              <div className='text-gray-600'>{item.createdAt}</div>
              <div className='text-gray-600'>{item.lastModified}</div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handleEditInterface(item)}
                  className='p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                >
                  <Edit2 className='w-4 h-4 text-blue-500' />
                </button>
                <button
                  onClick={() => handleDeleteInterface(item.id)}
                  className='p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                >
                  <Trash2 className='w-4 h-4 text-red-500' />
                </button>
                <button
                  onClick={() => window.open(`/chat/${item.id}`, '_blank')}
                  className='p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                >
                  <MessageSquare className='w-4 h-4 text-gray-500' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 