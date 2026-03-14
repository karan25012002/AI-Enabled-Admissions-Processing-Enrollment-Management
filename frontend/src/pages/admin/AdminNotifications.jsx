import React, { useEffect, useState } from 'react';
import { Bell, Send, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function AdminNotifications() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState('broadcast');

  useEffect(() => {
    api.get('/analytics/users').then(r => setUsers(r.data.users || [])).catch(() => {});
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) { toast.error('Title and message required'); return; }
    setSending(true);
    try {
      if (mode === 'broadcast') {
        await api.post('/notifications/broadcast', form);
        toast.success('Broadcast sent to all users!');
      } else {
        if (selectedUsers.length === 0) { toast.error('Select at least one user'); setSending(false); return; }
        await api.post('/notifications/send', { ...form, userIds: selectedUsers });
        toast.success(`Notification sent to ${selectedUsers.length} user(s)`);
      }
      setForm({ title: '', message: '', type: 'info' });
      setSelectedUsers([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const toggleUser = (id) => setSelectedUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="page-header">
        <h1 className="page-title">System Notifications</h1>
        <p className="page-subtitle">Send announcements and alerts to students</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode('broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === 'broadcast' ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
          <Megaphone size={16} /> Broadcast to All
        </button>
        <button onClick={() => setMode('individual')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === 'individual' ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
          <Send size={16} /> Send to Specific Users
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSend} className="space-y-5">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Notification Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. Application Deadline Reminder" className="input-field" required />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Message *</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
              rows={4} placeholder="Type your notification message here..." className="input-field resize-none" required />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field">
              {['info', 'success', 'warning', 'error', 'admission'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>

          {mode === 'individual' && (
            <div>
              <label className="text-gray-400 text-sm block mb-2">Select Recipients ({selectedUsers.length} selected)</label>
              <div className="max-h-48 overflow-y-auto space-y-2 scroll-custom pr-1">
                {users.map(u => (
                  <label key={u._id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedUsers.includes(u._id) ? 'bg-primary-600/20 border border-primary-500/30' : 'bg-white/5 border border-white/5 hover:bg-white/5'}`}>
                    <input type="checkbox" checked={selectedUsers.includes(u._id)} onChange={() => toggleUser(u._id)} className="w-4 h-4 accent-primary-500" />
                    <div>
                      <p className="text-white text-sm">{u.name}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
            {sending ? <div className="spinner w-5 h-5" /> : mode === 'broadcast' ? (<><Megaphone size={18} /> Broadcast to All Users</>) : (<><Send size={18} /> Send Notification</>)}
          </button>
        </form>
      </div>

      {mode === 'broadcast' && (
        <div className="mt-4 glass rounded-xl p-4 border border-yellow-500/20 text-yellow-400 text-sm flex items-start gap-2">
          ⚠️ Broadcast will send a notification to <strong>all {users.length} registered students</strong>.
        </div>
      )}
    </div>
  );
}
