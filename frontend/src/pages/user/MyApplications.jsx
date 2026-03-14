import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, TrendingUp, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/applications/my').then(r => setApplications(r.data.applications || [])).finally(() => setLoading(false));
  }, []);

  const statusClass = (s) => ({ pending: 'status-pending', under_review: 'status-under-review', accepted: 'status-accepted', rejected: 'status-rejected', waitlisted: 'status-waitlisted' })[s] || 'status-pending';
  const eligibilityClass = (e) => ({ eligible: 'status-eligible', not_eligible: 'status-not-eligible', pending: 'status-pending' })[e] || 'status-pending';

  if (loading) return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">Track and manage all your admission applications</p>
        </div>
        <Link to="/dashboard/apply" className="btn-primary text-sm py-2 px-4">+ New Application</Link>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-white font-heading font-semibold text-lg">No Applications Yet</h3>
          <p className="text-gray-400 text-sm mt-2 mb-6">Start your admission journey by submitting an application.</p>
          <Link to="/dashboard/apply" className="btn-primary inline-block">Apply Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, i) => (
            <motion.div key={app._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} className="card">
              <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpanded(expanded === app._id ? null : app._id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold">{app.programId?.programName}</h3>
                    <span className={statusClass(app.status)}>{app.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-gray-400">GPA: <span className="text-gray-200">{app.gpa}</span></span>
                    <span className="text-gray-400">Score: <span className="text-gray-200">{app.entranceScore}</span></span>
                    {app.aiScore !== null && app.aiScore !== undefined && (
                      <span className="text-gray-400">AI Score: <span className="text-primary-300 font-semibold">{app.aiScore}/100</span></span>
                    )}
                    <span className={eligibilityClass(app.eligibilityResult)}>{app.eligibilityResult?.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="ml-4 text-gray-500">{expanded === app._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
              </div>

              {expanded === app._id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="mt-5 pt-5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* AI Score card */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2"><Brain size={16} className="text-primary-400" /><span className="text-gray-400 text-xs">AI Score</span></div>
                    {app.aiScore !== null && app.aiScore !== undefined ? (
                      <>
                        <p className="text-3xl font-bold text-white">{app.aiScore}<span className="text-gray-500 text-sm">/100</span></p>
                        <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                          <div style={{ width: `${app.aiScore}%` }} className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                        </div>
                      </>
                    ) : <p className="text-gray-500 text-sm mt-1">Analyzing...</p>}
                  </div>
                  {/* Fraud Risk */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-yellow-400" /><span className="text-gray-400 text-xs">Fraud Risk</span></div>
                    {app.fraudRiskLevel !== 'pending' ? (
                      <span className={{ low: 'status-accepted', medium: 'status-pending', high: 'status-rejected' }[app.fraudRiskLevel] || 'status-pending'}>
                        {app.fraudRiskLevel} Risk
                      </span>
                    ) : <p className="text-gray-500 text-sm">Analyzing...</p>}
                  </div>
                  {/* Yield */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2"><TrendingUp size={16} className="text-accent-400" /><span className="text-gray-400 text-xs">Yield Prediction</span></div>
                    {app.yieldPrediction !== null && app.yieldPrediction !== undefined ? (
                      <>
                        <p className="text-3xl font-bold text-white">{app.yieldPrediction}<span className="text-gray-500 text-sm">%</span></p>
                        <p className="text-gray-500 text-xs mt-1">likely to accept</p>
                      </>
                    ) : <p className="text-gray-500 text-sm">Analyzing...</p>}
                  </div>
                  {/* Eligibility reason */}
                  {app.eligibilityReason && (
                    <div className="sm:col-span-3 bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-gray-400 text-xs mb-1">AI Eligibility Reason</p>
                      <p className="text-gray-200 text-sm">{app.eligibilityReason}</p>
                    </div>
                  )}
                  {app.adminRemarks && (
                    <div className="sm:col-span-3 bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/20">
                      <p className="text-yellow-400 text-xs mb-1">Admin Remarks</p>
                      <p className="text-gray-200 text-sm">{app.adminRemarks}</p>
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
