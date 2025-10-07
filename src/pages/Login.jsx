import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { login } from '../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const user = login(email, password);
    if (user) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-6">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-[#B3B3B3] hover:text-[#FFC96C] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[#F2F2F2] text-xl font-bold tracking-tight">DHStx</span>
      </Link>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <div className="panel-system p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-[4px] bg-[#202020] flex items-center justify-center">
              <LogIn className="w-6 h-6 text-[#FFC96C]" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-[#F2F2F2] text-center mb-2 uppercase tracking-tight">
            ACCOUNT LOGIN
          </h1>
          <p className="text-[#B3B3B3] text-center mb-8">
            Access your organization's admin portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                Username
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-900 rounded-[2px] p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="btn-system w-full flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#202020]">
            <p className="text-[#B3B3B3] text-xs text-center mono">
              Demo Credentials: admin / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
