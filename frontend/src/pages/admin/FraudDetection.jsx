import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

export default function FraudDetection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/ai/fraud-report').then(r => setData(r.data.applications || [])).finally(() => setLoading(false));
  }, []);

  const filtered = data
    .filter(a => filter === 'all' || a.fraudRiskLevel === filter)
    .filter(a =>
      a.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.userId?.email?.toLowerCase().includes(search.toLowerCase())
    );

  const riskColor = { low: 'status-accepted', medium: 'status-pending', high: 'status-rejected', pending: 'status-pending' };
  const riskBg = { low: 'bg-green-500/5 border-green-500/10', medium: 'bg-yellow-500/5 border-yellow-500/15', high: 'bg-red-500/10 border-red-500/20', pending: 'bg-white/5 border-white/5' };

  const counts = { high: filtered.filter(a => a.fraudRiskLevel === 'high').length, medium: filtered.filter(a => a.fraudRiskLevel === 'medium').length, low: filtered.filter(a => a.fraudRiskLevel === 'low').length };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Fraud Detection Report</h1>
        <p className="page-subtitle">AI-powered anomaly and fraud risk analysis</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'High Risk', count: counts.high, color: 'from-red-600 to-red-800 ', icon: <AlertTriangle size={20} /> },
          { label: 'Medium Risk', count: counts.medium, color: 'from-yellow-600 to-yellow-800', icon: <AlertTriangle size={20} /> },
          { label: 'Low Risk', count: counts.low, color: 'from-green-600 to-green-800', icon: <Shield size={20} /> },
        ].map(c => (
          <div key={c.label} className="card">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-3`}>{c.icon}</div>
            <p className="text-2xl font-heading font-bold text-white">{c.count}</p>
            <p className="text-gray-400 text-sm">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input placeholder="Search applicants..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-12" />
        </div>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-16"><div className="spinner w-8 h-8" /></div> :
        filtered.length === 0 ? (
          <div className="card text-center py-16">
            <Shield size={48} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-500">No fraud reports available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app, i) => (
              <motion.div key={app._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-2xl p-5 border ${riskBg[app.fraudRiskLevel] || 'bg-white/5 border-white/5'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${app.fraudRiskLevel === 'high' ? 'bg-red-500/20' : app.fraudRiskLevel === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                      {app.fraudRiskLevel === 'low' ? <Shield size={20} className="text-green-400" /> : <AlertTriangle size={20} className={app.fraudRiskLevel === 'high' ? 'text-red-400' : 'text-yellow-400'} />}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{app.userId?.name}</p>
                      <p className="text-gray-400 text-xs">{app.userId?.email}</p>
                      <p className="text-gray-500 text-xs mt-1">{app.programId?.programName} • GPA: {app.gpa} • Score: {app.entranceScore}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={riskColor[app.fraudRiskLevel] || 'status-pending'}>{app.fraudRiskLevel} risk</span>
                    {app.fraudRiskScore !== null && app.fraudRiskScore !== undefined && (
                      <p className="text-gray-500 text-xs mt-1">Risk Score: {app.fraudRiskScore}/100</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
    </div>
  );
}
