'use client'

import { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  MessageSquare,
  Clock,
  UserPlus,
  MessagesSquare,
  BellRing,
  BarChart2,
  TrendingUp,
  Activity
} from 'lucide-react'
import { supabase, db, type Agent as AgentType } from '@/lib/supabase'

const DashboardPage: FC = () => {
  const router = useRouter()
  const [agents, setAgents] = useState<AgentType[]>([])
  const [stats, setStats] = useState({
    totalAgents: 0,
    onlineAgents: 0,
    totalChats: 0,
    activeChats: 0,
    responseRate: '0%',
    avgResponseTime: '0s',
    customerSatisfaction: '0/5',
    totalCustomers: '0'
  })

  useEffect(() => {
    // Initial data fetch
    fetchData()

    // Set up real-time subscriptions
    const agentsSubscription = supabase
      .channel('agents-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'agents' 
      }, () => {
        fetchData()
      })
      .subscribe()

    const chatsSubscription = supabase
      .channel('chats-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats'
      }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(agentsSubscription)
      supabase.removeChannel(chatsSubscription)
    }
  }, [])

  const fetchData = async () => {
    try {
      // Fetch agents
      const agents = await db.agents.getAll()
      setAgents(agents)

      // Fetch active chats
      const activeChats = await db.chats.getActive()

      // Calculate stats
      const onlineAgents = agents.filter(a => a.status === 'online').length
      const totalChats = agents.reduce((sum, a) => sum + a.total_chats, 0)
      const activeChatsCount = activeChats.length

      // Update stats
      setStats({
        totalAgents: agents.length,
        onlineAgents,
        totalChats,
        activeChats: activeChatsCount,
        responseRate: '98%', // This would come from analytics
        avgResponseTime: '2m 30s', // This would come from analytics
        customerSatisfaction: '4.8/5', // This would come from analytics
        totalCustomers: '1,234' // This would come from analytics
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleConnectAgent = async (agentId: string) => {
    try {
      // Update agent status to online
      await db.agents.updateStatus(agentId, 'online')
      router.push('/dashboard/chatpage')
    } catch (error) {
      console.error('Error connecting to agent:', error)
    }
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Dashboard Overview</h1>
        <p className='text-gray-600'>Monitor your customer service performance</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Total Agents Card */}
        <div className='rounded-xl shadow-sm overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold opacity-90'>Total Agents</h3>
              <Users className='w-6 h-6 opacity-80 group-hover:scale-110 transition-transform duration-300' />
            </div>
            <div className='flex items-end justify-between'>
              <p className='text-3xl font-bold group-hover:translate-x-1 transition-transform duration-300'>{stats.totalAgents}</p>
              <span className='text-sm bg-white/20 px-2 py-1 rounded-full group-hover:bg-white/30 transition-colors duration-300'>
                {stats.onlineAgents} online
              </span>
            </div>
          </div>
          <div className='px-6 py-3 bg-black/10 group-hover:bg-black/20 transition-colors duration-300'>
            <div className='text-sm'>
              <span className='text-white/80'>Active today: {stats.onlineAgents}</span>
            </div>
          </div>
        </div>

        {/* Active Chats Card */}
        <div className='rounded-xl shadow-sm overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold opacity-90'>Active Chats</h3>
              <MessageSquare className='w-6 h-6 opacity-80 group-hover:scale-110 transition-transform duration-300' />
            </div>
            <div className='flex items-end justify-between'>
              <p className='text-3xl font-bold group-hover:translate-x-1 transition-transform duration-300'>{stats.activeChats}</p>
              <span className='text-sm bg-white/20 px-2 py-1 rounded-full group-hover:bg-white/30 transition-colors duration-300'>
                Live now
              </span>
            </div>
          </div>
          <div className='px-6 py-3 bg-black/10 group-hover:bg-black/20 transition-colors duration-300'>
            <div className='text-sm'>
              <span className='text-white/80'>Total today: {stats.totalChats}</span>
            </div>
          </div>
        </div>

        {/* Response Rate Card */}
        <div className='rounded-xl shadow-sm overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold opacity-90'>Response Rate</h3>
              <Activity className='w-6 h-6 opacity-80 group-hover:scale-110 transition-transform duration-300' />
            </div>
            <div className='flex items-end justify-between'>
              <p className='text-3xl font-bold group-hover:translate-x-1 transition-transform duration-300'>{stats.responseRate}</p>
              <span className='text-sm bg-white/20 px-2 py-1 rounded-full group-hover:bg-white/30 transition-colors duration-300'>
                Excellent
              </span>
            </div>
          </div>
          <div className='px-6 py-3 bg-black/10 group-hover:bg-black/20 transition-colors duration-300'>
            <div className='text-sm'>
              <span className='text-white/80'>Avg. response time: {stats.avgResponseTime}</span>
            </div>
          </div>
        </div>

        {/* Customer Satisfaction Card */}
        <div className='rounded-xl shadow-sm overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 text-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold opacity-90'>Customer Satisfaction</h3>
              <TrendingUp className='w-6 h-6 opacity-80 group-hover:scale-110 transition-transform duration-300' />
            </div>
            <div className='flex items-end justify-between'>
              <p className='text-3xl font-bold group-hover:translate-x-1 transition-transform duration-300'>{stats.customerSatisfaction}</p>
              <span className='text-sm bg-white/20 px-2 py-1 rounded-full group-hover:bg-white/30 transition-colors duration-300'>
                +0.3 this week
              </span>
            </div>
          </div>
          <div className='px-6 py-3 bg-black/10 group-hover:bg-black/20 transition-colors duration-300'>
            <div className='text-sm'>
              <span className='text-white/80'>Total customers: {stats.totalCustomers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Agents Section */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300'>
        <div className='p-6 border-b border-gray-200 bg-gray-50'>
          <h2 className='text-xl font-semibold text-gray-800'>Service Agents</h2>
        </div>
        <div className='divide-y divide-gray-200'>
          {agents.map((agent) => (
            <div key={agent.id} className='p-6 hover:bg-gray-50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform duration-300'>
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 group-hover:translate-x-1 transition-transform duration-300'>{agent.name}</h3>
                    <p className='text-sm text-gray-500'>{agent.role}</p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <p className='text-sm font-medium text-gray-600'>{agent.active_chats} active chats</p>
                    <p className='text-sm text-gray-500'>{agent.total_chats} total chats</p>
                  </div>
                  <button
                    onClick={() => handleConnectAgent(agent.id)}
                    className='px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-md transition-all duration-300 flex items-center gap-2'
                  >
                    <MessageSquare className='w-4 h-4' />
                    Connect
                  </button>
                </div>
              </div>
              <div className='grid grid-cols-3 gap-4 text-sm'>
                <div className='bg-gray-50 rounded-lg p-3 group-hover:bg-gray-100 transition-colors duration-300'>
                  <p className='text-gray-500 mb-1'>Department</p>
                  <p className='font-medium text-gray-800'>{agent.department}</p>
                </div>
                <div className='bg-gray-50 rounded-lg p-3 group-hover:bg-gray-100 transition-colors duration-300'>
                  <p className='text-gray-500 mb-1'>Status</p>
                  <p className={`font-medium ${
                    agent.status === 'online' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </p>
                </div>
                <div className='bg-gray-50 rounded-lg p-3 group-hover:bg-gray-100 transition-colors duration-300'>
                  <p className='text-gray-500 mb-1'>Join Date</p>
                  <p className='font-medium text-gray-800'>{agent.join_date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 