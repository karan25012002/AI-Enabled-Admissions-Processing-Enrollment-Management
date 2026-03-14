import React, { useEffect, useState } from 'react';
import { Search, Users, Eye, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

export default function AllApplicants() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);
  const [userApps, setUserApps] = useState({});

  useEffect(() => {
    api.get('/analytics/users').then(r => setUsers(r.data.users || [])).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.mobile?.includes(search)
  );

  const loadUserApps = async (userId) => {
    if (userApps[userId]) return;
    try {
      const res = await api.get(`/applications?search=${userId}`);
      const apps = (res.data.applications || []).filter(a => a.userId?._id === userId || a.userId === userId);
      setUserApps(prev => ({ ...prev, [userId]: apps }));
    } catch { setUserApps(prev => ({ ...prev, [userId]: [] })); }
  };

  const toggleExpand = async (userId) => {
    if (expandedUser === userId) { setExpandedUser(null); return; }
    setExpandedUser(userId);
    await loadUserApps(userId);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">All Applicants</h1>
          <p className="page-subtitle">{users.length} registered students</p>
        </div>
      </div>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Search by name, email, or mobile..." value={search}
          onChange={e => setSearch(e.target.value)} className="input-field pl-12" />
      </div>
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Users size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u, i) => (
            <motion.div key={u._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(u._id)}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{u.name}</p>
                    <p className="text-gray-400 text-xs">{u.email} • {u.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-xs">{u.applicationCount || 0} application(s)</span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${expandedUser === u._id ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {expandedUser === u._id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 pt-5 border-t border-white/5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
                    <div><span className="text-gray-500">DOB</span><p className="text-gray-200 mt-0.5">{u.dob ? new Date(u.dob).toLocaleDateString() : '-'}</p></div>
                    <div><span className="text-gray-500">Address</span><p className="text-gray-200 mt-0.5 line-clamp-2">{u.address || '-'}</p></div>
                    <div><span className="text-gray-500">Joined</span><p className="text-gray-200 mt-0.5">{new Date(u.createdAt).toLocaleDateString()}</p></div>
                    <div><span className="text-gray-500">Status</span><span className={`mt-0.5 ${u.isActive ? 'text-green-400' : 'text-red-400'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></div>
                  </div>
                  {userApps[u._id] === undefined ? (
                    <div className="spinner w-5 h-5 mx-auto" />
                  ) : userApps[u._id].length === 0 ? (
                    <p className="text-gray-600 text-xs">No applications found</p>
                  ) : (
                    <div className="space-y-2">
                      {userApps[u._id].map(app => (
                        <div key={app._id} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5 text-xs">
                          <span className="text-gray-200">{app.programId?.programName}</span>
                          <div className="flex items-center gap-3">
                            {app.aiScore !== null && <span className="text-primary-300">AI: {app.aiScore}/100</span>}
                            <span className={{ pending: 'status-pending', under_review: 'status-under-review', accepted: 'status-accepted', rejected: 'status-rejected' }[app.status] || 'status-pending'}>{app.status?.replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
