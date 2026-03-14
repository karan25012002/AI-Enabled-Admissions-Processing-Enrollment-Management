import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, GraduationCap, FileCheck, Brain,
  AlertTriangle, CheckSquare, BarChart3, Bell, LogOut, Shield, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
  { to: '/admin/applicants', icon: <Users size={20} />, label: 'All Applicants' },
  { to: '/admin/programs', icon: <GraduationCap size={20} />, label: 'Programs' },
  { to: '/admin/documents', icon: <FileCheck size={20} />, label: 'Document Verification' },
  { to: '/admin/ai-screening', icon: <Brain size={20} />, label: 'AI Screening' },
  { to: '/admin/fraud', icon: <AlertTriangle size={20} />, label: 'Fraud Detection' },
  { to: '/admin/decisions', icon: <CheckSquare size={20} />, label: 'Admission Decisions' },
  { to: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
  { to: '/admin/notifications', icon: <Bell size={20} />, label: 'Notifications' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Admin logged out');
    navigate('/');
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-primary-700 flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-heading font-bold text-sm">Admin Panel</p>
          <p className="text-gray-500 text-xs">Control Center</p>
        </div>
      </div>
      <div className="glass rounded-xl p-3 mb-6 flex items-center gap-3 border border-purple-500/20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-primary-700 flex items-center justify-center font-bold text-white text-sm shrink-0">A</div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold">Administrator</p>
          <p className="text-gray-500 text-xs truncate">{user?.email}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <button onClick={handleLogout} className="sidebar-link text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-4">
        <LogOut size={20} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0e17] flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col glass-dark border-r border-white/5 h-screen sticky top-0">
        <Sidebar />
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-72 glass-dark border-r border-white/10 z-50 lg:hidden">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={22} /></button>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <main className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden glass-dark border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white p-1"><Menu size={22} /></button>
            <span className="text-white font-heading font-semibold text-sm">Admin Panel</span>
          </div>
          <Shield size={20} className="text-purple-400" />
        </div>
        <div className="flex-1 overflow-y-auto scroll-custom p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
