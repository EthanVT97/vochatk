import { useState } from 'react';
import { BsPersonFill, BsLockFill, BsGoogle, BsFacebook, BsGithub } from 'react-icons/bs';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/95 p-8 rounded-2xl w-full max-w-md relative transform transition-all animate-fade-in shadow-2xl border border-gray-800">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Sign in to continue to 18K Chat</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-400 transition-colors">
              <BsPersonFill size={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
              required
            />
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-400 transition-colors">
              <BsLockFill size={20} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-400 hover:text-gray-300 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 bg-gray-700 transition-colors" />
            <span className="ml-2 transition-colors">Remember me</span>
          </label>
          <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="neon-button animated w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="neon-button-content">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </span>
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-400 bg-gray-900">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button className="flex items-center justify-center p-3 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-all hover:scale-105">
          <BsGoogle size={20} />
        </button>
        <button className="flex items-center justify-center p-3 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-all hover:scale-105">
          <BsFacebook size={20} />
        </button>
        <button className="flex items-center justify-center p-3 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-all hover:scale-105">
          <BsGithub size={20} />
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
} 