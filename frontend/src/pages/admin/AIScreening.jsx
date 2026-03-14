import React, { useEffect, useState } from 'react';
import { Brain, RefreshCw, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function AIScreening() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [analyzing, setAnalyzing] = useState('');

  const fetchData = () => {
    setLoading(true);
    api.get('/ai/screening').then(r => setApplications(r.data.applications || [])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const reanalyze = async (appId) => {
    setAnalyzing(appId);
    try {
      await api.post(`/ai/analyze/${appId}`);
      toast.success('AI analysis refreshed');
      fetchData();
    } catch { toast.error('Analysis failed'); }
    finally { setAnalyzing(''); }
  };

  const filtered = applications.filter(a =>
    a.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.programId?.programName?.toLowerCase().includes(search.toLowerCase())
  );

  const scoreColor = (score) => score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">AI Screening Results</h1>
        <p className="page-subtitle">{applications.length} applications analyzed by Gemini AI</p>
      </div>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input placeholder="Search applicants..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-12" />
      </div>
      {loading ? <div className="flex justify-center py-16"><div className="spinner w-8 h-8" /></div> :
        filtered.length === 0 ? (
          <div className="card text-center py-16">
            <Brain size={48} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-500 text-sm">No AI screening data available yet</p>
            <p className="text-gray-600 text-xs mt-2">Data appears after applications are submitted and analyzed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-gray-400 text-xs font-semibold uppercase tracking-wide">Applicant</th>
                      <th className="text-left p-4 text-gray-400 text-xs font-semibold uppercase tracking-wide">Program</th>
                      <th className="text-center p-4 text-gray-400 text-xs font-semibold uppercase tracking-wide">GPA</th>
                      <th className="text-center p-4 text-gray-400 text-xs font-semibold uppercase tracking-wide">E-Score</th>
                      <th className="text-center p-4 text-gray-400 text-xs font-semibold uppercase tracking-wide">AI Score</th>
                      <th className="text-center p-4 text-gray-400 text-xs font-semibold uppercase tracking-wide">Eligibility</th>
                      <th className="text-center p-4 text-gray-400 text-xs font-semibold uppercase tracking-wide">Yield</th>
                      <th className="text-center p-4 text-gray-400 text-xs font-semibold uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(app => (
                      <tr key={app._id} className="table-row">
                        <td className="p-4">
                          <p className="text-white text-sm font-medium">{app.userId?.name}</p>
                          <p className="text-gray-500 text-xs">{app.userId?.email}</p>
                        </td>
                        <td className="p-4 text-gray-300 text-sm">{app.programId?.programName}</td>
                        <td className="p-4 text-center text-gray-200 text-sm">{app.gpa}</td>
                        <td className="p-4 text-center text-gray-200 text-sm">{app.entranceScore}</td>
                        <td className="p-4 text-center">
                          <span className={`font-bold text-lg ${scoreColor(app.aiScore)}`}>{app.aiScore || '—'}</span>
                          {app.aiScore && <div className="w-full bg-white/10 rounded-full h-1 mt-1 max-w-16 mx-auto"><div style={{ width: `${app.aiScore}%` }} className="h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" /></div>}
                        </td>
                        <td className="p-4 text-center">
                          <span className={{ eligible: 'status-eligible', not_eligible: 'status-not-eligible', pending: 'status-pending' }[app.eligibilityResult] || 'status-pending'}>
                            {app.eligibilityResult?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-accent-400 font-semibold text-sm">{app.yieldPrediction !== null && app.yieldPrediction !== undefined ? `${app.yieldPrediction}%` : '—'}</span>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => reanalyze(app._id)} disabled={analyzing === app._id}
                            className="text-xs text-primary-400 border border-primary-500/30 hover:bg-primary-500/10 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 mx-auto">
                            {analyzing === app._id ? <div className="spinner w-3 h-3" /> : <RefreshCw size={12} />} Reanalyze
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
