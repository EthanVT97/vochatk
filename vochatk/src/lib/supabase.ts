import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Types for our database tables
export interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'online' | 'offline';
  active_chats: number;
  total_chats: number;
  join_date: string;
  created_at: string;
}

export interface Chat {
  id: string;
  agent_id: string;
  user_id: string;
  status: 'active' | 'ended';
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  sender_type: 'agent' | 'user' | 'system';
  content: string;
  created_at: string;
}

export interface ChatInterface {
  id: string;
  name: string;
  description: string;
  welcome_message: string;
  response_messages: {
    id: string;
    message: string;
    order: number;
  }[];
  created_at: string;
  updated_at: string;
}

// Database helper functions
export const db = {
  agents: {
    async getAll() {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getOnline() {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('status', 'online')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async updateStatus(agentId: string, status: 'online' | 'offline') {
      const { data, error } = await supabase
        .from('agents')
        .update({ status })
        .eq('id', agentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async updateChats(agentId: string, activeChats: number) {
      const { data, error } = await supabase
        .from('agents')
        .update({ active_chats: activeChats })
        .eq('id', agentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  chats: {
    async create(agentId: string, userId: string) {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          agent_id: agentId,
          user_id: userId,
          status: 'active',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async end(chatId: string) {
      const { data, error } = await supabase
        .from('chats')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', chatId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async getActive() {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          agent:agents(name, email),
          messages(*)
        `)
        .eq('status', 'active')
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  },

  messages: {
    async create(chatId: string, senderId: string, content: string, senderType: 'agent' | 'user' | 'system') {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: senderId,
          sender_type: senderType,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async getByChatId(chatId: string) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    }
  },

  interfaces: {
    async getAll() {
      const { data, error } = await supabase
        .from('chat_interfaces')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async create(interface_: Omit<ChatInterface, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('chat_interfaces')
        .insert(interface_)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<ChatInterface>) {
      const { data, error } = await supabase
        .from('chat_interfaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
}; 