import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/admin-login', form);
      login(res.data.user, res.data.token);
      toast.success('Welcome, Administrator!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="orb w-80 h-80 bg-purple-700 top-0 right-0 opacity-15" />
      <div className="orb w-64 h-64 bg-primary-700 bottom-0 left-0 opacity-15" style={{ animationDelay: '2s' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/50 border border-purple-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-900/40">
              <Shield size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-2">Restricted access — authorized personnel only</p>
            <div className="mt-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-400">
              ⚠️ This panel is for system administrators only
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@example.com" className="input-field pl-11" required />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Admin Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input-field pl-11 pr-12" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-primary-700 hover:from-purple-500 hover:to-primary-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
              {loading ? <div className="spinner w-5 h-5" /> : (<><Shield size={18} /> Admin Sign In</>)}
            </button>
          </form>
          <div className="text-center mt-6">
            <Link to="/login" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              ← Student Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
