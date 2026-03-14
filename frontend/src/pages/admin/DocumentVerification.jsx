import React, { useEffect, useState } from 'react';
import { FileCheck, CheckCircle, XCircle, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function DocumentVerification() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [rejectionModal, setRejectionModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [saving, setSaving] = useState('');

  const fetchDocs = (status) => {
    setLoading(true);
    api.get(`/documents/all${status ? `?verificationStatus=${status}` : ''}`)
      .then(r => setDocs(r.data.documents || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(filter); }, [filter]);

  const handleVerify = async (docId, status, reason = '') => {
    setSaving(docId);
    try {
      await api.put(`/documents/${docId}/verify`, { verificationStatus: status, rejectionReason: reason });
      toast.success(`Document ${status}`);
      fetchDocs(filter);
      setRejectionModal(null);
      setRejectionReason('');
    } catch (err) {
      toast.error('Failed to update document status');
    } finally {
      setSaving('');
    }
  };

  const docTypeLabel = (t) => t?.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) || 'Unknown';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Document Verification</h1>
        <p className="page-subtitle">Review and verify applicant documents</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['pending', 'verified', 'rejected', ''].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><div className="spinner w-8 h-8" /></div> :
        docs.length === 0 ? (
          <div className="card text-center py-16">
            <FileCheck size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-500">No documents found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((doc, i) => (
              <motion.div key={doc._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <FileCheck size={20} className="text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm">{docTypeLabel(doc.documentType)}</p>
                    <p className="text-gray-400 text-xs">{doc.userId?.name} • {doc.userId?.email}</p>
                    <p className="text-gray-600 text-xs mt-0.5 truncate">{doc.originalName} • {doc.fileSize ? `${(doc.fileSize/1024).toFixed(1)} KB` : ''}</p>
                    <p className="text-gray-600 text-xs">Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={`http://localhost:5000${doc.fileURL}`} target="_blank" rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs text-gray-300 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1">
                    <Download size={12} /> View
                  </a>
                  {doc.verificationStatus === 'pending' && (
                    <>
                      <button onClick={() => handleVerify(doc._id, 'verified')} disabled={saving === doc._id}
                        className="px-3 py-1.5 rounded-lg text-xs text-green-400 border border-green-500/30 hover:bg-green-500/10 transition-all flex items-center gap-1">
                        {saving === doc._id ? <div className="spinner w-3 h-3" /> : <CheckCircle size={12} />} Verify
                      </button>
                      <button onClick={() => setRejectionModal(doc._id)} disabled={saving === doc._id}
                        className="px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all flex items-center gap-1">
                        <XCircle size={12} /> Reject
                      </button>
                    </>
                  )}
                  {doc.verificationStatus !== 'pending' && (
                    <span className={{ verified: 'status-accepted', rejected: 'status-rejected' }[doc.verificationStatus] || 'status-pending'}>
                      {doc.verificationStatus}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      {/* Rejection reason modal */}
      {rejectionModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="glass-dark rounded-2xl p-6 w-full max-w-md border border-white/10">
            <h3 className="text-white font-heading font-semibold mb-4">Rejection Reason</h3>
            <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={4}
              placeholder="Specify the reason for rejection..." className="input-field resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectionModal(null); setRejectionReason(''); }} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={() => handleVerify(rejectionModal, 'rejected', rejectionReason)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">
                Reject Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
