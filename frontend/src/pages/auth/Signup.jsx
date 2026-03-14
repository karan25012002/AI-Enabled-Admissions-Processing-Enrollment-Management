import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, Mail, Lock, User, Phone, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', dob: '', address: '', password: '', confirmPassword: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, dob, address, password, confirmPassword } = form;
    if (!name || !email || !mobile || !dob || !address || !password || !confirmPassword) {
      toast.error('All fields are required'); return;
    }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!/^[0-9]{10}$/.test(mobile)) { toast.error('Mobile must be 10 digits'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.user, res.data.token);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: <User size={16} /> },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: <Mail size={16} /> },
    { name: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '10-digit mobile', icon: <Phone size={16} /> },
    { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', icon: <Calendar size={16} /> },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Your full address', icon: <MapPin size={16} /> },
  ];

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-10">
      <div className="orb w-80 h-80 bg-primary-600 top-0 left-0 opacity-10" />
      <div className="orb w-64 h-64 bg-accent-500 bottom-0 right-0 opacity-10" style={{ animationDelay: '3s' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-2">Join the AI Admissions Platform</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.name}>
                <label className="text-gray-400 text-sm font-medium mb-2 block">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{f.icon}</span>
                  <input type={f.type} name={f.name} value={form[f.name]}
                    onChange={handleChange} placeholder={f.placeholder}
                    className="input-field pl-11" required />
                </div>
              </div>
            ))}
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min 6 characters" className="input-field pl-11 pr-12" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} placeholder="Repeat password" className="input-field pl-11" required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
              {loading ? <div className="spinner w-5 h-5" /> : 'Create Account'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
