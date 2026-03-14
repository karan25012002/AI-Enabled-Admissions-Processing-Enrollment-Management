import React, { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    api.get('/notifications').then(r => setNotifications(r.data.notifications || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await api.put('/notifications/read', {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const markRead = async (id) => {
    await api.put('/notifications/read', { ids: [id] });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const typeIcon = (t) => {
    const map = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️', application: '📋', document: '📄', admission: '🎓' };
    return map[t] || 'ℹ️';
  };

  const typeBg = (t, read) => {
    if (read) return 'bg-white/5 border-white/5';
    const map = { success: 'bg-green-500/8 border-green-500/20', error: 'bg-red-500/8 border-red-500/20', warning: 'bg-yellow-500/8 border-yellow-500/20', admission: 'bg-accent-500/8 border-accent-500/20' };
    return map[t] || 'bg-primary-600/8 border-primary-500/20';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            Notifications
            {unreadCount > 0 && <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </h1>
          <p className="page-subtitle">Stay updated on your admission progress</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-16">
          <Bell size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-white font-heading font-semibold text-lg">No Notifications</h3>
          <p className="text-gray-400 text-sm mt-2">You'll be notified about your application status here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div key={n._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl p-4 border transition-all cursor-pointer ${typeBg(n.type, n.isRead)}`}
              onClick={() => !n.isRead && markRead(n._id)}>
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{typeIcon(n.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold text-sm ${n.isRead ? 'text-gray-300' : 'text-white'}`}>{n.title}</p>
                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />}
                  </div>
                  <p className={`text-sm mt-1 ${n.isRead ? 'text-gray-500' : 'text-gray-300'}`}>{n.message}</p>
                  <p className="text-gray-600 text-xs mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
