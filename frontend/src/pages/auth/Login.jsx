import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('All fields required'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="orb w-80 h-80 bg-primary-600 top-0 right-0" />
      <div className="orb w-64 h-64 bg-accent-500 bottom-0 left-0" style={{ animationDelay: '3s' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">Student Login</h1>
            <p className="text-gray-400 text-sm mt-2">Sign in to your admissions portal</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com" className="input-field pl-11" required />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••" className="input-field pl-11 pr-12" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
              {loading ? <div className="spinner w-5 h-5" /> : 'Sign In'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">Sign Up</Link>
            </p>
            <Link to="/admin/login" className="text-gray-600 hover:text-gray-400 text-xs mt-3 block transition-colors">
              Admin Login →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
