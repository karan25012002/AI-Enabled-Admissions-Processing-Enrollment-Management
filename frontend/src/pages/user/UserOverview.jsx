import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, Bell, ArrowRight, Brain } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function UserOverview() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/applications/my'),
      api.get('/notifications'),
    ]).then(([appRes, notifRes]) => {
      setApplications(appRes.data.applications || []);
      setNotifications(notifRes.data.notifications?.slice(0, 3) || []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: <FileText size={22} />, color: 'from-primary-600 to-primary-800' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'pending').length, icon: <Clock size={22} />, color: 'from-yellow-600 to-yellow-800' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, icon: <CheckCircle size={22} />, color: 'from-green-600 to-green-800' },
    { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, icon: <XCircle size={22} />, color: 'from-red-600 to-red-800' },
  ];

  const statusClass = (s) => ({ pending: 'status-pending', under_review: 'status-under-review', accepted: 'status-accepted', rejected: 'status-rejected', waitlisted: 'status-waitlisted' })[s] || 'status-pending';

  if (loading) return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Here's an overview of your admission journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} className="card">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4`}>
              {s.icon}
            </div>
            <p className="text-3xl font-heading font-bold text-white">{s.value}</p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-heading font-semibold">Recent Applications</h2>
            <Link to="/dashboard/applications" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">No applications yet</p>
              <Link to="/dashboard/apply" className="btn-primary mt-4 inline-block text-sm py-2 px-4">Apply Now</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 4).map(app => (
                <div key={app._id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{app.programId?.programName}</p>
                    <p className="text-gray-500 text-xs">AI Score: {app.aiScore ? `${app.aiScore}/100` : 'Analyzing...'}</p>
                  </div>
                  <span className={statusClass(app.status)}>{app.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications + AI Info */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-heading font-semibold flex items-center gap-2">
                <Bell size={18} className="text-primary-400" /> Recent Notifications
              </h2>
              <Link to="/dashboard/notifications" className="text-primary-400 hover:text-primary-300 text-sm">View all</Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No notifications yet</p>
            ) : (
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n._id} className={`p-3 rounded-xl border ${n.isRead ? 'bg-white/5 border-white/5' : 'bg-primary-600/10 border-primary-500/20'}`}>
                    <p className="text-white text-sm font-medium">{n.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* AI Info card */}
          <div className="glass rounded-2xl p-5 border border-primary-500/20 bg-gradient-to-br from-primary-900/20 to-primary-800/10">
            <div className="flex items-center gap-3 mb-3">
              <Brain size={22} className="text-primary-400" />
              <h3 className="text-white font-semibold text-sm">AI Analysis</h3>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Our Gemini AI automatically evaluates eligibility, assigns a candidate score, detects anomalies, and predicts your admission yield after submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
