import React, { useEffect, useState } from 'react';
import { CheckSquare, Search, Filter, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function AdmissionDecisions() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [remarksModal, setRemarksModal] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [saving, setSaving] = useState('');

  const fetchApps = () => {
    setLoading(true);
    const q = statusFilter ? `?status=${statusFilter}` : '';
    api.get(`/applications${q}`).then(r => setApplications(r.data.applications || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, [statusFilter]);

  const promptDecision = (app, action) => {
    setPendingAction({ app, action });
    setRemarks('');
    setRemarksModal(true);
  };

  const handleDecision = async () => {
    if (!pendingAction) return;
    setSaving(pendingAction.app._id);
    try {
      await api.put(`/applications/${pendingAction.app._id}/status`, {
        status: pendingAction.action,
        adminRemarks: remarks,
      });
      toast.success(`Application ${pendingAction.action}`);
      setRemarksModal(false);
      fetchApps();
    } catch { toast.error('Failed to update status'); }
    finally { setSaving(''); setPendingAction(null); }
  };

  const filtered = applications.filter(a =>
    a.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.programId?.programName?.toLowerCase().includes(search.toLowerCase())
  );

  const statusClass = (s) => ({ pending: 'status-pending', under_review: 'status-under-review', accepted: 'status-accepted', rejected: 'status-rejected', waitlisted: 'status-waitlisted' })[s] || 'status-pending';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Admission Decisions</h1>
        <p className="page-subtitle">Review and decide on applicant admission status</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input placeholder="Search applicants..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-12" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'pending', 'under_review', 'accepted', 'rejected', 'waitlisted'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {s ? s.replace('_', ' ') : 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-16"><div className="spinner w-8 h-8" /></div> :
        filtered.length === 0 ? (
          <div className="card text-center py-16">
            <CheckSquare size={48} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app, i) => (
              <motion.div key={app._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold text-sm">{app.userId?.name}</p>
                      <span className={statusClass(app.status)}>{app.status?.replace('_', ' ')}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{app.userId?.email}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {app.programId?.programName} • GPA: {app.gpa} • Score: {app.entranceScore}
                      {app.aiScore !== null && app.aiScore !== undefined && ` • AI: ${app.aiScore}/100`}
                    </p>
                    {app.adminRemarks && <p className="text-gray-500 text-xs mt-1 italic">"{app.adminRemarks}"</p>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => promptDecision(app, 'under_review')} disabled={saving === app._id}
                      className="px-3 py-1.5 rounded-lg text-xs text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 transition-all">Review</button>
                    <button onClick={() => promptDecision(app, 'accepted')} disabled={saving === app._id}
                      className="px-3 py-1.5 rounded-lg text-xs text-green-400 border border-green-500/30 hover:bg-green-500/10 transition-all flex items-center gap-1">
                      <Check size={12} /> Accept
                    </button>
                    <button onClick={() => promptDecision(app, 'waitlisted')} disabled={saving === app._id}
                      className="px-3 py-1.5 rounded-lg text-xs text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 transition-all">Waitlist</button>
                    <button onClick={() => promptDecision(app, 'rejected')} disabled={saving === app._id}
                      className="px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all flex items-center gap-1">
                      <X size={12} /> Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      {/* Remarks modal */}
      {remarksModal && pendingAction && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="glass-dark rounded-2xl p-6 w-full max-w-md border border-white/10">
            <h3 className="text-white font-heading font-semibold mb-2 capitalize">{pendingAction.action.replace('_', ' ')} Application</h3>
            <p className="text-gray-400 text-sm mb-4">{pendingAction.app.userId?.name} – {pendingAction.app.programId?.programName}</p>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3}
              placeholder="Admin remarks for the applicant (optional)..." className="input-field resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setRemarksModal(false); setPendingAction(null); }} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={handleDecision} disabled={saving}
                className={`flex-1 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${pendingAction.action === 'accepted' ? 'bg-green-600 hover:bg-green-500' : pendingAction.action === 'rejected' ? 'bg-red-600 hover:bg-red-500' : 'bg-primary-600 hover:bg-primary-500'}`}>
                {saving ? <div className="spinner w-4 h-4" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
