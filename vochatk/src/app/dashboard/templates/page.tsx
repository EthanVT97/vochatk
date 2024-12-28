'use client'

import { FC, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Link as LinkIcon, 
  Copy, 
  Trash2, 
  Edit, 
  Eye,
  Bot,
  MessageSquare,
  Settings,
  X,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  BarChart,
  Activity,
  AlertCircle
} from 'lucide-react'
import yaml from 'js-yaml'

interface Template {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  messages: number
  chatLink?: string
  welcomeMessage: string
  initialPrompt: string
  settings: {
    responseTime: number
    maxResponseLength: number
    responseStyle: string
    language: string
    customResponses: {
      greetings: string[]
      farewells: string[]
      fallback: string
      keywords: Array<{
        trigger: string
        response: string
      }>
      suggestions: string[]
    }
    behavior: {
      useEmojis: boolean
      useMarkdown: boolean
      autoSuggest: boolean
      typingIndicator: boolean
      responseDelay: {
        min: number
        max: number
      }
    }
    appearance: {
      primaryColor: string
      fontFamily: string
      darkMode: boolean
      avatarUrl?: string
      customCSS?: string
    }
    allowAttachments: boolean
    requireAuth: boolean
    rateLimit: {
      enabled: boolean
      maxRequests: number
      timeWindow: number
    }
    unknownConversation: {
      notifyAdmin: boolean
      autoTransferToAgent: boolean
      waitTime: number
      customMessage: string
    }
    agentHandoff: {
      enabled: boolean
      transferMessage: string
      queuePosition: boolean
      estimatedWaitTime: boolean
    }
  }
  analytics: {
    totalChats: number
    avgResponseTime: number
    satisfactionRate: number
    lastUsed: string
  }
}

// Utility functions
const convertToYaml = (data: any) => yaml.dump(data)

const parseYaml = (content: string) => yaml.load(content)

const validateTemplateStructure = (template: any): template is Template => {
  return (
    template &&
    typeof template.name === 'string' &&
    typeof template.description === 'string' &&
    typeof template.category === 'string' &&
    Array.isArray(template.tags) &&
    typeof template.welcomeMessage === 'string' &&
    typeof template.initialPrompt === 'string' &&
    typeof template.settings === 'object' &&
    typeof template.analytics === 'object'
  )
}

// Add utility functions
const formatWaitTime = (timestamp: string) => {
  const waitTime = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(waitTime / 60000)
  const seconds = Math.floor((waitTime % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

const TemplatesPage: FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [previewMessages, setPreviewMessages] = useState<Array<{role: string, content: string}>>([])

  const [newTemplate, setNewTemplate] = useState<{
    name: string
    description: string
    category: string
    tags: string[]
    welcomeMessage: string
    initialPrompt: string
    settings: {
      responseTime: number
      maxResponseLength: number
      responseStyle: string
      language: string
      customResponses: {
        greetings: string[]
        farewells: string[]
        fallback: string
        keywords: Array<{ trigger: string, response: string }>
        suggestions: string[]
      }
      behavior: {
        useEmojis: boolean
        useMarkdown: boolean
        autoSuggest: boolean
        typingIndicator: boolean
        responseDelay: {
          min: number
          max: number
        }
      }
      appearance: {
        primaryColor: string
        fontFamily: string
        darkMode: boolean
      }
      allowAttachments: boolean
      requireAuth: boolean
      rateLimit: {
        enabled: boolean
        maxRequests: number
        timeWindow: number
      }
      unknownConversation: {
        notifyAdmin: boolean
        autoTransferToAgent: boolean
        waitTime: number
        customMessage: string
      }
      agentHandoff: {
        enabled: boolean
        transferMessage: string
        queuePosition: boolean
        estimatedWaitTime: boolean
      }
    }
    analytics: {
      totalChats: number
      avgResponseTime: number
      satisfactionRate: number
      lastUsed: string
    }
  }>({
    name: '',
    description: '',
    category: 'Support',
    tags: [],
    welcomeMessage: '',
    initialPrompt: '',
    settings: {
      responseTime: 2,
      maxResponseLength: 500,
      responseStyle: 'Professional',
      language: 'English',
      customResponses: {
        greetings: ['Hello!', 'Hi there!', 'Welcome!'],
        farewells: ['Goodbye!', 'Thank you for chatting!', 'Have a great day!'],
        fallback: 'I apologize, but I didn\'t quite understand that. Could you please rephrase?',
        keywords: [] as Array<{ trigger: string, response: string }>,
        suggestions: ['How can I help you?', 'Would you like to know more?', 'Do you have any questions?']
      },
      behavior: {
        useEmojis: false,
        useMarkdown: true,
        autoSuggest: true,
        typingIndicator: true,
        responseDelay: {
          min: 1,
          max: 3
        }
      },
      appearance: {
        primaryColor: '#3B82F6',
        fontFamily: 'Inter',
        darkMode: false
      },
      allowAttachments: true,
      requireAuth: false,
      rateLimit: {
        enabled: false,
        maxRequests: 50,
        timeWindow: 3600
      },
      unknownConversation: {
        notifyAdmin: true,
        autoTransferToAgent: true,
        waitTime: 30,
        customMessage: 'I\'ll connect you with a human agent who can better assist you.'
      },
      agentHandoff: {
        enabled: true,
        transferMessage: 'Connecting you with an agent...',
        queuePosition: true,
        estimatedWaitTime: true
      }
    },
    analytics: {
      totalChats: 0,
      avgResponseTime: 0,
      satisfactionRate: 0,
      lastUsed: new Date().toISOString()
    }
  })

  const [availableTags, setAvailableTags] = useState([
    'FAQ', 'Billing', 'Technical', 'Product', 'General',
    'Onboarding', 'Support', 'Sales', 'Feedback', 'Custom'
  ])

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop')
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<'json' | 'yaml'>('json')

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Customer Support',
      description: 'Template for handling customer inquiries and support requests',
      category: 'Support',
      tags: ['Support', 'Customer Service'],
      messages: 15,
      chatLink: 'https://vochat.ai/chat/cs-template-1',
      welcomeMessage: 'Welcome to customer support! How can I help you today?',
      initialPrompt: 'Handle customer inquiries professionally and efficiently.',
      settings: {
        responseTime: 2,
        maxResponseLength: 500,
        responseStyle: 'Professional',
        language: 'English',
        customResponses: {
          greetings: ['Hello!', 'Welcome to our support!', 'How may I assist you today?'],
          farewells: ['Thank you for contacting us!', 'Have a great day!', 'Let us know if you need anything else!'],
          fallback: 'I apologize for any confusion. Could you please provide more details?',
          keywords: [] as Array<{ trigger: string, response: string }>,
          suggestions: ['How can I help you?', 'Would you like to know more?', 'Do you have any questions?']
        },
        behavior: {
          useEmojis: false,
          useMarkdown: true,
          autoSuggest: true,
          typingIndicator: true,
          responseDelay: {
            min: 1,
            max: 3
          }
        },
        appearance: {
          primaryColor: '#3B82F6',
          fontFamily: 'Inter',
          darkMode: false
        },
        allowAttachments: true,
        requireAuth: true,
        rateLimit: {
          enabled: true,
          maxRequests: 50,
          timeWindow: 3600
        },
        unknownConversation: {
          notifyAdmin: true,
          autoTransferToAgent: true,
          waitTime: 30,
          customMessage: 'I\'ll connect you with a human agent who can better assist you.'
        },
        agentHandoff: {
          enabled: true,
          transferMessage: 'Connecting you with an agent...',
          queuePosition: true,
          estimatedWaitTime: true
        }
      },
      analytics: {
        totalChats: 150,
        avgResponseTime: 2.3,
        satisfactionRate: 95,
        lastUsed: new Date().toISOString()
      }
    }
  ])

  const [activeUsers, setActiveUsers] = useState<Array<{
    id: string
    name: string
    email: string
    status: 'chatting' | 'waiting' | 'needs_help' | 'transferring' | 'idle' | 'returning'
    lastMessage: string
    waitingSince?: string
    assignedAgent?: {
      id: string
      name: string
      status: 'active' | 'busy' | 'away'
    }
    conversation: {
      id: string
      startTime: string
      topic?: string
      messageCount: number
      lastActivity: string
      sentiment: 'positive' | 'neutral' | 'negative'
      priority: 'low' | 'medium' | 'high'
      tags: string[]
    }
    customFields?: Record<string, string>
  }>>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'needs_help',
      lastMessage: "I'm not sure this answers my question...",
      waitingSince: new Date(Date.now() - 120000).toISOString(),
      conversation: {
        id: 'conv-1',
        startTime: new Date(Date.now() - 300000).toISOString(),
        topic: 'Technical Support',
        messageCount: 8,
        lastActivity: new Date(Date.now() - 60000).toISOString(),
        sentiment: 'neutral',
        priority: 'high',
        tags: ['urgent', 'technical']
      }
    }
  ])

  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'unknown_conversation' | 'user_waiting' | 'needs_help' | 'agent_handoff' | 'feedback_received' | 'high_volume' | 'conversation_ended' | 'system_alert'
    priority: 'low' | 'medium' | 'high'
    userId: string
    message: string
    timestamp: string
    metadata?: {
      waitTime?: number
      queuePosition?: number
      agentId?: string
      feedbackScore?: number
      conversationId?: string
      alertType?: string
    }
  }>>([])

  const handleNotificationDismiss = (id: string) => {
    setNotifications((prev: Array<{
      id: string
      type: 'unknown_conversation' | 'user_waiting' | 'needs_help' | 'agent_handoff' | 'feedback_received' | 'high_volume' | 'conversation_ended' | 'system_alert'
      priority: 'low' | 'medium' | 'high'
      userId: string
      message: string
      timestamp: string
      metadata?: {
        waitTime?: number
        queuePosition?: number
        agentId?: string
        feedbackScore?: number
        conversationId?: string
        alertType?: string
      }
    }>) => prev.filter(n => n.id !== id))
  }

  const handleJoinChat = (userId: string) => {
    // Implement chat joining logic
    console.log('Joining chat with user:', userId)
  }

  const handleTransferChat = (userId: string) => {
    // Implement chat transfer logic
    console.log('Transferring chat with user:', userId)
  }

  const handleAcceptHandoff = (conversationId?: string) => {
    if (!conversationId) return
    // Implement handoff acceptance logic
    console.log('Accepting handoff for conversation:', conversationId)
  }

  const handleViewDetails = (userId: string) => {
    // Implement user details view logic
    console.log('Viewing details for user:', userId)
  }

  const handleCreateTemplate = () => {
    const newId = (templates.length + 1).toString()
    const timestamp = Date.now()
    const uniqueId = `${newTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`
    
    const template: Template = {
      id: newId,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      tags: newTemplate.tags,
      messages: 0,
      chatLink: `https://vochat.ai/chat/${uniqueId}`,
      welcomeMessage: newTemplate.welcomeMessage,
      initialPrompt: newTemplate.initialPrompt,
      settings: newTemplate.settings,
      analytics: newTemplate.analytics
    }

    setTemplates([...templates, template])
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditTemplate = () => {
    if (!selectedTemplate) return
    
    const updatedTemplates = templates.map(t => 
      t.id === selectedTemplate.id ? selectedTemplate : t
    )
    
    setTemplates(updatedTemplates)
    setIsCreateModalOpen(false)
    setIsEditing(false)
    setSelectedTemplate(null)
  }

  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return
    
    const updatedTemplates = templates.filter(t => t.id !== selectedTemplate.id)
    setTemplates(updatedTemplates)
    setIsDeleteModalOpen(false)
    setSelectedTemplate(null)
  }

  const startEdit = (template: Template) => {
    setSelectedTemplate(template)
    setNewTemplate({
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags,
      welcomeMessage: template.welcomeMessage,
      initialPrompt: template.initialPrompt,
      settings: { ...template.settings },
      analytics: { ...template.analytics }
    })
    setIsEditing(true)
    setIsCreateModalOpen(true)
  }

  const previewTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setPreviewMessages([
      { role: 'system', content: template.initialPrompt },
      { role: 'assistant', content: template.welcomeMessage },
    ])
    setIsPreviewModalOpen(true)
  }

  const resetForm = () => {
    setNewTemplate({
      name: '',
      description: '',
      category: 'Support',
      tags: [],
      welcomeMessage: '',
      initialPrompt: '',
      settings: {
        responseTime: 2,
        maxResponseLength: 500,
        responseStyle: 'Professional',
        language: 'English',
        customResponses: {
          greetings: ['Hello!', 'Hi there!', 'Welcome!'],
          farewells: ['Goodbye!', 'Thank you for chatting!', 'Have a great day!'],
          fallback: 'I apologize, but I didn\'t quite understand that. Could you please rephrase?',
          keywords: [] as Array<{ trigger: string, response: string }>,
          suggestions: ['How can I help you?', 'Would you like to know more?', 'Do you have any questions?']
        },
        behavior: {
          useEmojis: false,
          useMarkdown: true,
          autoSuggest: true,
          typingIndicator: true,
          responseDelay: {
            min: 1,
            max: 3
          }
        },
        appearance: {
          primaryColor: '#3B82F6',
          fontFamily: 'Inter',
          darkMode: false
        },
        allowAttachments: true,
        requireAuth: false,
        rateLimit: {
          enabled: false,
          maxRequests: 50,
          timeWindow: 3600
        },
        unknownConversation: {
          notifyAdmin: true,
          autoTransferToAgent: true,
          waitTime: 30,
          customMessage: 'I\'ll connect you with a human agent who can better assist you.'
        },
        agentHandoff: {
          enabled: true,
          transferMessage: 'Connecting you with an agent...',
          queuePosition: true,
          estimatedWaitTime: true
        }
      },
      analytics: {
        totalChats: 0,
        avgResponseTime: 0,
        satisfactionRate: 0,
        lastUsed: new Date().toISOString()
      }
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Add toast notification here
  }

  const handleExportTemplate = (template: Template) => {
    const exportData = exportFormat === 'json' 
      ? JSON.stringify(template, null, 2)
      : convertToYaml(template)

    const blob = new Blob([exportData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `template-${template.name.toLowerCase().replace(/\s+/g, '-')}.${exportFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const imported = file.name.endsWith('.yaml') 
          ? parseYaml(content)
          : JSON.parse(content)

        if (validateTemplateStructure(imported)) {
          setTemplates([...templates, { ...imported, id: Date.now().toString() }])
        }
      } catch (error) {
        console.error('Failed to import template:', error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Chat Templates</h1>
        <Button onClick={() => {
          resetForm()
          setIsEditing(false)
          setIsCreateModalOpen(true)
        }}>
          <Plus className='w-4 h-4 mr-2' />
          Create Template
        </Button>
      </div>

      <div className='flex items-center gap-2 mb-4'>
        <Button
          variant='outline'
          onClick={() => setIsExportModalOpen(true)}
        >
          Export Template
        </Button>
        <label className='cursor-pointer'>
          <input
            type='file'
            accept='.json,.yaml'
            className='hidden'
            onChange={handleImportTemplate}
          />
          <span className='inline-flex'>
            <Button variant='outline'>
              Import Template
            </Button>
          </span>
        </label>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {templates.map((template) => (
          <div
            key={template.id}
            className='border rounded-lg p-4 transition-all duration-300
              hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)] hover:-translate-y-1 
              hover:border-blue-300/50 bg-white relative group'
          >
            {/* Template Actions */}
            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Button 
                variant='ghost' 
                size='sm'
                onClick={() => previewTemplate(template)}
                className='mr-1'
              >
                <Eye className='w-4 h-4' />
              </Button>
              <Button 
                variant='ghost' 
                size='sm'
                onClick={() => startEdit(template)}
                className='mr-1'
              >
                <Edit className='w-4 h-4' />
              </Button>
              <Button 
                variant='ghost' 
                size='sm'
                onClick={() => {
                  setSelectedTemplate(template)
                  setIsDeleteModalOpen(true)
                }}
                className='text-red-500 hover:text-red-700'
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>

            <h3 className='text-lg font-semibold mb-2'>{template.name}</h3>
            <p className='text-gray-600 text-sm mb-4'>{template.description}</p>
            
            <div className='flex justify-between items-center mb-3'>
              <span className='text-sm text-gray-500'>
                {template.messages} messages
              </span>
              <span className='px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600'>
                {template.category}
              </span>
            </div>

            {/* Settings Preview */}
            <div className='text-xs text-gray-500 mb-3'>
              <div className='flex items-center gap-1 mb-1'>
                <Bot className='w-3 h-3' />
                Response Time: {template.settings.responseTime}s
              </div>
              <div className='flex items-center gap-1'>
                <Settings className='w-3 h-3' />
                {template.settings.language}, {template.settings.responseStyle}
              </div>
            </div>

            {template.chatLink && (
              <div className='flex items-center gap-2 mt-4 p-2 bg-blue-50 rounded-md'>
                <LinkIcon className='w-4 h-4 text-blue-500' />
                <input
                  type='text'
                  value={template.chatLink}
                  readOnly
                  className='text-sm text-blue-600 bg-transparent flex-1 outline-none'
                />
                <Button 
                  variant='ghost' 
                  size='sm'
                  onClick={() => copyToClipboard(template.chatLink!)}
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
            )}

            <div className='flex items-center gap-2 mt-2'>
              {template.tags.map(tag => (
                <span 
                  key={tag}
                  className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className='flex items-center gap-4 mb-4'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Preview Mode:</span>
                <select
                  value={previewMode}
                  onChange={(e) => setPreviewMode(e.target.value as 'desktop' | 'mobile' | 'tablet')}
                  className='px-2 py-1 border rounded-md text-sm'
                >
                  <option value='desktop'>Desktop</option>
                  <option value='mobile'>Mobile</option>
                  <option value='tablet'>Tablet</option>
                </select>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Theme:</span>
                <button
                  onClick={() => setPreviewTheme(theme => theme === 'light' ? 'dark' : 'light')}
                  className='p-1 border rounded-md'
                >
                  {previewTheme === 'light' ? '🌞' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Template Modal */}
      {isCreateModalOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>
                {isEditing ? 'Edit Template' : 'Create Chat Template'}
              </h2>
              <Button 
                variant='ghost' 
                size='sm'
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X className='w-4 h-4' />
              </Button>
            </div>
            
            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Template Name
                  </label>
                  <input
                    type='text'
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    className='w-full px-3 py-2 border rounded-md'
                    placeholder='e.g., Customer Support'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    className='w-full px-3 py-2 border rounded-md'
                    rows={3}
                    placeholder='Describe the purpose of this template'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Category
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                    className='w-full px-3 py-2 border rounded-md'
                  >
                    <option value='Support'>Support</option>
                    <option value='Sales'>Sales</option>
                    <option value='Onboarding'>Onboarding</option>
                    <option value='Technical'>Technical</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Welcome Message
                  </label>
                  <textarea
                    value={newTemplate.welcomeMessage}
                    onChange={(e) => setNewTemplate({...newTemplate, welcomeMessage: e.target.value})}
                    className='w-full px-3 py-2 border rounded-md'
                    rows={2}
                    placeholder='Welcome message for users'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Initial AI Prompt
                  </label>
                  <textarea
                    value={newTemplate.initialPrompt}
                    onChange={(e) => setNewTemplate({...newTemplate, initialPrompt: e.target.value})}
                    className='w-full px-3 py-2 border rounded-md'
                    rows={3}
                    placeholder='Initial instructions for the AI'
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='font-medium text-gray-900'>Response Settings</h3>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Response Time (seconds)
                  </label>
                  <input
                    type='number'
                    min='1'
                    max='10'
                    value={newTemplate.settings.responseTime}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      settings: { ...newTemplate.settings, responseTime: parseInt(e.target.value) }
                    })}
                    className='w-full px-3 py-2 border rounded-md'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Max Response Length
                  </label>
                  <input
                    type='number'
                    min='100'
                    max='2000'
                    step='100'
                    value={newTemplate.settings.maxResponseLength}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      settings: { ...newTemplate.settings, maxResponseLength: parseInt(e.target.value) }
                    })}
                    className='w-full px-3 py-2 border rounded-md'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Response Style
                  </label>
                  <select
                    value={newTemplate.settings.responseStyle}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      settings: { ...newTemplate.settings, responseStyle: e.target.value }
                    })}
                    className='w-full px-3 py-2 border rounded-md'
                  >
                    <option value='Professional'>Professional</option>
                    <option value='Casual'>Casual</option>
                    <option value='Friendly'>Friendly</option>
                    <option value='Technical'>Technical</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Language
                  </label>
                  <select
                    value={newTemplate.settings.language}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      settings: { ...newTemplate.settings, language: e.target.value }
                    })}
                    className='w-full px-3 py-2 border rounded-md'
                  >
                    <option value='English'>English</option>
                    <option value='Spanish'>Spanish</option>
                    <option value='French'>French</option>
                    <option value='German'>German</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Custom Greetings
                  </label>
                  <textarea
                    value={newTemplate.settings.customResponses.greetings.join('\n')}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      settings: { 
                        ...newTemplate.settings, 
                        customResponses: {
                          ...newTemplate.settings.customResponses,
                          greetings: e.target.value.split('\n').filter(line => line.trim())
                        }
                      }
                    })}
                    className='w-full px-3 py-2 border rounded-md'
                    rows={3}
                    placeholder='Enter one greeting per line'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Custom Farewells
                  </label>
                  <textarea
                    value={newTemplate.settings.customResponses.farewells.join('\n')}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      settings: { 
                        ...newTemplate.settings, 
                        customResponses: {
                          ...newTemplate.settings.customResponses,
                          farewells: e.target.value.split('\n').filter(line => line.trim())
                        }
                      }
                    })}
                    className='w-full px-3 py-2 border rounded-md'
                    rows={3}
                    placeholder='Enter one farewell message per line'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Fallback Response
                  </label>
                  <textarea
                    value={newTemplate.settings.customResponses.fallback}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      settings: { 
                        ...newTemplate.settings, 
                        customResponses: {
                          ...newTemplate.settings.customResponses,
                          fallback: e.target.value
                        }
                      }
                    })}
                    className='w-full px-3 py-2 border rounded-md'
                    rows={2}
                    placeholder='Message to show when the bot cannot understand the user'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={newTemplate.settings.allowAttachments}
                      onChange={(e) => setNewTemplate({
                        ...newTemplate,
                        settings: { ...newTemplate.settings, allowAttachments: e.target.checked }
                      })}
                      className='rounded border-gray-300'
                    />
                    <span className='text-sm text-gray-700'>Allow Attachments</span>
                  </label>

                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={newTemplate.settings.requireAuth}
                      onChange={(e) => setNewTemplate({
                        ...newTemplate,
                        settings: { ...newTemplate.settings, requireAuth: e.target.checked }
                      })}
                      className='rounded border-gray-300'
                    />
                    <span className='text-sm text-gray-700'>Require Authentication</span>
                  </label>
                </div>
              </div>
            </div>

            <div className='mt-6 flex justify-end gap-3'>
              <Button 
                variant='outline'
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={isEditing ? handleEditTemplate : handleCreateTemplate}>
                {isEditing ? 'Save Changes' : 'Create Template'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedTemplate && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Preview: {selectedTemplate.name}</h2>
              <Button 
                variant='ghost' 
                size='sm'
                onClick={() => setIsPreviewModalOpen(false)}
              >
                <X className='w-4 h-4' />
              </Button>
            </div>

            <div className='bg-gray-50 rounded-lg p-4 mb-4'>
              <h3 className='font-medium text-gray-900 mb-2'>Chat Settings</h3>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p><span className='font-medium'>Response Time:</span> {selectedTemplate.settings.responseTime}s</p>
                  <p><span className='font-medium'>Language:</span> {selectedTemplate.settings.language}</p>
                  <p><span className='font-medium'>Style:</span> {selectedTemplate.settings.responseStyle}</p>
                </div>
                <div>
                  <p><span className='font-medium'>Max Length:</span> {selectedTemplate.settings.maxResponseLength}</p>
                  <p><span className='font-medium'>Greetings:</span> {selectedTemplate.settings.customResponses.greetings.length}</p>
                  <p>
                    <span className='font-medium'>Features:</span>{' '}
                    {selectedTemplate.settings.allowAttachments ? 'Attachments, ' : ''}
                    {selectedTemplate.settings.requireAuth ? 'Auth Required' : 'Public Access'}
                  </p>
                </div>
              </div>
            </div>

            <div className='border rounded-lg h-96 overflow-y-auto mb-4'>
              <div className='p-4 space-y-4'>
                {previewMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'assistant' 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Type a test message...'
                className='flex-1 px-3 py-2 border rounded-md'
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setPreviewMessages([
                      ...previewMessages,
                      { role: 'user', content: e.currentTarget.value },
                      { role: 'assistant', content: 'This is a simulated response. In the actual chat, the AI would respond based on the template settings.' }
                    ])
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button>Send</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedTemplate && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Delete Template</h2>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete "{selectedTemplate.name}"? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <Button 
                variant='outline'
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteTemplate}
                className='bg-red-500 hover:bg-red-600 text-white'
              >
                Delete Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && selectedTemplate && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Export Template</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'json' | 'yaml')}
                  className='w-full px-3 py-2 border rounded-md'
                >
                  <option value='json'>JSON</option>
                  <option value='yaml'>YAML</option>
                </select>
              </div>
            </div>
            <div className='mt-6 flex justify-end gap-3'>
              <Button 
                variant='outline'
                onClick={() => setIsExportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                handleExportTemplate(selectedTemplate)
                setIsExportModalOpen(false)
              }}>
                Export
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add notification panel */}
      <div className='fixed top-4 right-4 w-80 space-y-2 z-50'>
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-lg p-4 border-l-4 animate-slide-in ${
              notification.priority === 'high' ? 'border-red-500' :
              notification.priority === 'medium' ? 'border-yellow-500' :
              'border-blue-500'
            }`}
          >
            <div className='flex justify-between items-start'>
              <div>
                <h4 className='font-medium text-gray-900'>
                  {notification.type === 'unknown_conversation' ? 'Unknown Topic' :
                   notification.type === 'user_waiting' ? 'User Waiting' :
                   notification.type === 'needs_help' ? 'Needs Help' :
                   notification.type === 'agent_handoff' ? 'Agent Handoff' :
                   notification.type === 'feedback_received' ? 'Feedback Received' :
                   notification.type === 'high_volume' ? 'High Volume Alert' :
                   notification.type === 'conversation_ended' ? 'Conversation Ended' :
                   'System Alert'}
                </h4>
                <p className='text-sm text-gray-600'>{notification.message}</p>
                {notification.metadata && (
                  <div className='mt-1 text-xs text-gray-500'>
                    {notification.metadata.waitTime && (
                      <p>Wait Time: {notification.metadata.waitTime}s</p>
                    )}
                    {notification.metadata.queuePosition && (
                      <p>Queue Position: #{notification.metadata.queuePosition}</p>
                    )}
                    {notification.metadata.feedbackScore && (
                      <p>Feedback Score: {notification.metadata.feedbackScore}/5</p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleNotificationDismiss(notification.id)}
                className='text-gray-400 hover:text-gray-500'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
            <div className='mt-2 flex gap-2'>
              <Button
                size='sm'
                onClick={() => handleJoinChat(notification.userId)}
              >
                Join Chat
              </Button>
              {notification.type === 'unknown_conversation' && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleTransferChat(notification.userId)}
                >
                  Transfer
                </Button>
              )}
              {notification.type === 'agent_handoff' && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleAcceptHandoff(notification.metadata?.conversationId)}
                >
                  Accept
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add active users panel with adjusted layout */}
      <div className='fixed right-4 top-20 w-72'>
        {/* Enhanced Active Users Panel */}
        <div className='bg-white rounded-lg shadow-lg p-4 border border-gray-200'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='font-medium text-gray-900 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-green-500'></div>
              Active Users ({activeUsers.length})
            </h3>
            <select className='text-xs border rounded px-2 py-1 bg-white'>
              <option value='all'>All Users</option>
              <option value='waiting'>Waiting</option>
              <option value='chatting'>Chatting</option>
              <option value='needs_help'>Needs Help</option>
            </select>
          </div>

          <div className='space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto'>
            {activeUsers.map(user => (
              <div
                key={user.id}
                className={`p-3 rounded-lg transition-all duration-200 hover:shadow-md ${
                  user.status === 'needs_help' 
                    ? 'bg-red-50 border border-red-100'
                    : user.status === 'waiting'
                    ? 'bg-yellow-50 border border-yellow-100'
                    : user.status === 'transferring'
                    ? 'bg-purple-50 border border-purple-100'
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium text-sm truncate'>{user.name}</p>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        user.conversation.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                        user.conversation.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.conversation.sentiment}
                      </span>
                    </div>
                    <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <Button
                      size='sm'
                      variant={user.status === 'needs_help' ? 'default' : 'outline'}
                      className='px-2 py-1 h-7'
                      onClick={() => handleJoinChat(user.id)}
                    >
                      Join
                    </Button>
                  </div>
                </div>

                <div className='mt-2 space-y-1'>
                  <p className='text-xs text-gray-600 line-clamp-2 italic'>
                    "{user.lastMessage}"
                  </p>
                  <div className='flex items-center justify-between text-xs text-gray-500'>
                    <div className='flex items-center gap-2'>
                      <MessageSquare className='w-3 h-3' />
                      <span>{user.conversation.messageCount}</span>
                    </div>
                    {user.waitingSince && (
                      <div className='flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        <span>{formatWaitTime(user.waitingSince)}</span>
                      </div>
                    )}
                  </div>
                  {user.conversation.topic && (
                    <div className='flex items-center gap-1 text-xs text-gray-600'>
                      <span className='font-medium'>Topic:</span>
                      <span>{user.conversation.topic}</span>
                    </div>
                  )}
                  {user.assignedAgent && (
                    <div className='flex items-center gap-1 text-xs text-gray-600'>
                      <span className='font-medium'>Agent:</span>
                      <span>{user.assignedAgent.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        user.assignedAgent.status === 'active' ? 'bg-green-100 text-green-700' :
                        user.assignedAgent.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.assignedAgent.status}
                      </span>
                    </div>
                  )}
                  {user.conversation.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {user.conversation.tags.map(tag => (
                        <span 
                          key={tag}
                          className='px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className='flex justify-end mt-1'>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-6 text-xs'
                      onClick={() => handleViewDetails(user.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplatesPage 