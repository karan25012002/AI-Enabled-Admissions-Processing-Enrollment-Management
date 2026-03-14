import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle, Clock, XCircle, GraduationCap } from 'lucide-react';
import api from '../../api/axios';

const STEPS = [
  { key: 'pending', label: 'Application Submitted', desc: 'Your application has been received' },
  { key: 'under_review', label: 'Under Review', desc: 'Admin is reviewing your application' },
  { key: 'ai_analyzed', label: 'AI Analysis Complete', desc: 'Gemini AI has evaluated your profile' },
  { key: 'accepted', label: 'Admission Decision', desc: 'Final decision has been made' },
];

export default function TrackStatus() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my').then(r => setApplications(r.data.applications || [])).finally(() => setLoading(false));
  }, []);

  const getStepIndex = (app) => {
    if (app.status === 'accepted' || app.status === 'rejected') return 4;
    if (app.aiAnalyzed) return 3;
    if (app.status === 'under_review') return 2;
    return 1;
  };

  const statusColor = (s) => ({ accepted: 'text-green-400', rejected: 'text-red-400', waitlisted: 'text-purple-400', pending: 'text-yellow-400', under_review: 'text-blue-400' })[s] || 'text-gray-400';

  if (loading) return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Track Admission Status</h1>
        <p className="page-subtitle">Follow your application journey in real-time</p>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-16">
          <GraduationCap size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-white font-heading font-semibold text-lg">No applications yet</h3>
          <p className="text-gray-400 text-sm mt-2">Submit an application to track its status here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map(app => {
            const currentStep = getStepIndex(app);
            const isRejected = app.status === 'rejected';
            return (
              <div key={app._id} className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-heading font-semibold text-lg">{app.programId?.programName}</h3>
                    <p className="text-gray-500 text-xs mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm capitalize ${statusColor(app.status)}`}>{app.status.replace('_', ' ')}</p>
                    {app.aiScore !== null && app.aiScore !== undefined && (
                      <p className="text-gray-500 text-xs mt-1">AI Score: {app.aiScore}/100</p>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Connecting line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/10" />
                  <div className="space-y-6">
                    {STEPS.map((step, i) => {
                      const done = currentStep > i + 1 || (currentStep === i + 1 && i < 3);
                      const active = currentStep === i + 1;
                      const isFinalStep = i === 3;
                      const isFinalRejected = isFinalStep && isRejected;
                      return (
                        <div key={step.key} className="flex items-start gap-4 relative">
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${done && !isFinalRejected ? 'bg-green-500/20 border-2 border-green-500' : active && !isFinalRejected ? 'bg-primary-600/30 border-2 border-primary-500' : isFinalRejected ? 'bg-red-500/20 border-2 border-red-500' : 'bg-white/5 border-2 border-white/10'}`}>
                            {done && !isFinalRejected ? <CheckCircle size={14} className="text-green-400" /> :
                             active ? <Clock size={14} className="text-primary-400 animate-pulse" /> :
                             isFinalRejected ? <XCircle size={14} className="text-red-400" /> :
                             <Circle size={14} className="text-gray-600" />}
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <p className={`font-semibold text-sm ${done || active ? 'text-white' : 'text-gray-600'}`}>{step.label}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                            {isFinalStep && app.adminRemarks && (
                              <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/5">
                                <p className="text-gray-300 text-xs">Admin: {app.adminRemarks}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
