import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', mobile: user?.mobile || '', address: user?.address || '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Profile Management</h1>
        <p className="page-subtitle">Update your personal information</p>
      </div>

      {/* Avatar card */}
      <div className="card mb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-3xl font-bold text-white font-heading shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-white font-heading font-bold text-xl">{user?.name}</h2>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <span className="status-badge bg-primary-600/20 text-primary-300 border border-primary-500/30 mt-2">Student</span>
        </div>
      </div>

      <div className="card">
        <h3 className="text-white font-heading font-semibold mb-6">Edit Information</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field pl-11" required />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Email Address <span className="text-gray-600">(read-only)</span></label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" value={user?.email} className="input-field pl-11 opacity-50 cursor-not-allowed" disabled />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Mobile Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="input-field pl-11" />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Date of Birth <span className="text-gray-600">(read-only)</span></label>
            <div className="relative">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="date" value={user?.dob ? new Date(user.dob).toISOString().split('T')[0] : ''} className="input-field pl-11 opacity-50 cursor-not-allowed" disabled />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-3 text-gray-500" />
              <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={3} className="input-field pl-11 resize-none" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <div className="spinner w-5 h-5" /> : (<><Save size={18} /> Save Changes</>)}
          </button>
        </form>
      </div>
    </div>
  );
}
