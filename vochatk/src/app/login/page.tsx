'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '../components/LoginForm';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Check if user is an agent
        const { data: agentData } = await supabase
          .from('agents')
          .select('*')
          .eq('email', email)
          .single();

        if (agentData) {
          // Update agent status to online
          await supabase
            .from('agents')
            .update({ status: 'online' })
            .eq('id', agentData.id);
        }

        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (show message to user)
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-gray-700 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-800 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Logo */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 text-3xl font-bold text-white flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-indigo-300 to-gray-100">
          18K Chat
        </span>
      </Link>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md px-4">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
} 