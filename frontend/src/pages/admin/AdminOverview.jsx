import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, GraduationCap, CheckCircle, XCircle, Clock, AlertTriangle, FileCheck } from 'lucide-react';
import api from '../../api/axios';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard').then(r => setStats(r.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;

  const cards = [
    { label: 'Total Students', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: 'from-primary-600 to-primary-800', sub: 'Registered users' },
    { label: 'Total Applications', value: stats?.totalApplications || 0, icon: <FileText size={24} />, color: 'from-blue-600 to-blue-800', sub: `${stats?.acceptanceRate || 0}% acceptance rate` },
    { label: 'Programs', value: stats?.totalPrograms || 0, icon: <GraduationCap size={24} />, color: 'from-accent-500 to-accent-600', sub: 'Active programs' },
    { label: 'Accepted', value: stats?.applicationsByStatus?.accepted || 0, icon: <CheckCircle size={24} />, color: 'from-green-600 to-green-800', sub: `${stats?.applicationsByStatus?.pending || 0} pending` },
    { label: 'Under Review', value: stats?.applicationsByStatus?.underReview || 0, icon: <Clock size={24} />, color: 'from-yellow-600 to-yellow-800', sub: `${stats?.applicationsByStatus?.rejected || 0} rejected` },
    { label: 'Fraud Flagged', value: (stats?.fraud?.high || 0) + (stats?.fraud?.medium || 0), icon: <AlertTriangle size={24} />, color: 'from-red-600 to-red-800', sub: `${stats?.fraud?.high || 0} high risk` },
    { label: 'Documents', value: stats?.documents?.total || 0, icon: <FileCheck size={24} />, color: 'from-purple-600 to-purple-800', sub: `${stats?.documents?.pending || 0} pending review` },
    { label: 'Verified Docs', value: stats?.documents?.verified || 0, icon: <CheckCircle size={24} />, color: 'from-teal-600 to-teal-800', sub: 'Approved documents' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Admin Dashboard <span className="gradient-text">Overview</span></h1>
        <p className="text-gray-400 mt-1 text-sm">Complete control panel for admissions management</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-4`}>{c.icon}</div>
            <p className="text-3xl font-heading font-bold text-white">{c.value}</p>
            <p className="text-white/80 text-sm font-medium mt-1">{c.label}</p>
            <p className="text-gray-500 text-xs mt-0.5">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick info */}
      <div className="glass rounded-2xl p-6 border border-primary-500/20">
        <h3 className="text-white font-heading font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'AI Analysis', status: 'Operational', color: 'text-green-400' },
            { label: 'Gemini Chatbot', status: 'Active', color: 'text-green-400' },
            { label: 'MongoDB', status: 'Connected', color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-400 text-sm">{s.label}</span>
              <span className={`text-xs font-semibold ml-auto ${s.color}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
