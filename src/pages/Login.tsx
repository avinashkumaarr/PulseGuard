import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Mail, Lock, LogIn, ChevronRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.log("Login popup was closed.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100 text-center relative overflow-hidden group">
        {/* Background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />

        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 mx-auto mb-6 transform group-hover:rotate-6 transition-transform duration-500">
          <LogIn className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight">PulseGuard</h2>
        <p className="text-slate-500 mt-2 font-medium px-4 text-sm">
          Sign in to access your health metrics.
        </p>

        {error && (
          <div className="mt-6 p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="mt-8 space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Email Address</label>
            <div className="relative group/field">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/field:text-blue-600 transition-colors" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-200 outline-none transition-all text-sm font-bold placeholder:font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Password</label>
            <div className="relative group/field">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/field:text-blue-600 transition-colors" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-200 outline-none transition-all text-sm font-bold placeholder:font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-300 hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
          >
            {loading ? 'Processing...' : 'Sign In'}
            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4 text-slate-300">
          <div className="h-px flex-grow bg-slate-100" />
          <span className="text-[10px] font-black uppercase tracking-widest">OR</span>
          <div className="h-px flex-grow bg-slate-100" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-8 w-full bg-white border border-slate-100 text-slate-700 font-bold py-3.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google Account
        </button>

        <div className="mt-10 flex flex-col items-center justify-center gap-6">
          <p className="text-sm font-medium text-slate-500">
            Don't have an account? <Link to="/signup" className="text-blue-600 font-black hover:underline">Create One</Link>
          </p>
          
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PulseGuard Cloud Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
