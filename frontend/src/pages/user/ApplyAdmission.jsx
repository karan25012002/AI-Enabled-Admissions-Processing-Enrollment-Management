import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ChevronRight, ChevronLeft, Send, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ApplyAdmission() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    programId: '',
    email: '',
    whatsappNumber: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gpa: '',
    entranceScore: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    previousInstitution: '',
    statement: '',
  });

  useEffect(() => {
    api.get('/programs').then(r => setPrograms(r.data.programs || [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const nextStep = () => {
    if (step === 1 && !form.programId) { toast.error('Please select a program'); return; }
    if (step === 2) {
      if (!form.email || !form.whatsappNumber || !form.fatherName || !form.motherName || !form.dob || !form.gender || !form.address || !form.city || !form.state || !form.pincode) {
        toast.error('Please fill all mandatory personal details'); return;
      }
    }
    if (step === 3) {
      if (!form.gpa || !form.entranceScore) { toast.error('GPA and Entrance Score are required'); return; }
      if (form.gpa < 0 || form.gpa > 10) { toast.error('GPA must be between 0 and 10'); return; }
      if (form.entranceScore < 0 || form.entranceScore > 100) { toast.error('Entrance score must be between 0 and 100'); return; }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/applications', { ...form, gpa: parseFloat(form.gpa), entranceScore: parseFloat(form.entranceScore), tenthPercentage: parseFloat(form.tenthPercentage || 0), twelfthPercentage: parseFloat(form.twelfthPercentage || 0) });
      toast.success('Application submitted! AI analysis will begin shortly.');
      navigate('/dashboard/applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Select Program', 'Personal Details', 'Academic Info', 'Statement'];
  const selectedProgram = programs.find(p => p._id === form.programId);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Apply for Admission</h1>
        <p className="page-subtitle">Complete the application form to apply to your desired program.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-2 ${i + 1 === step ? 'text-white' : i + 1 < step ? 'text-accent-400' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i + 1 === step ? 'border-primary-500 bg-primary-600/30 text-primary-300' : i + 1 < step ? 'border-accent-500 bg-accent-500/20 text-accent-400' : 'border-white/10 bg-white/5'}`}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i + 1 < step ? 'bg-accent-500' : 'bg-white/10'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="card">
        {/* Step 1: Select Program */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-white font-heading font-semibold text-lg mb-5">Select Program</h2>
            {programs.length === 0 ? (
              <div className="text-center py-10">
                <GraduationCap size={40} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500">No programs available currently. Please check back later.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {programs.map(p => (
                  <button key={p._id} onClick={() => setForm({ ...form, programId: p._id })}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${form.programId === p._id ? 'border-primary-500 bg-primary-600/20' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">{p.programName}</p>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{p.description}</p>
                        <div className="flex gap-3 mt-2">
                          <span className="text-xs text-gray-500">Duration: {p.duration}</span>
                          <span className="text-xs text-gray-500">Seats: {p.seats}</span>
                        </div>
                      </div>
                      <Award size={18} className={form.programId === p._id ? 'text-primary-400' : 'text-gray-600'} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-white font-heading font-semibold text-lg mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" className="input-field py-2.5" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">WhatsApp Number *</label>
                <input type="text" name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} placeholder="+1 234 567 8900" className="input-field py-2.5" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Father's Name *</label>
                <input type="text" name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Full Name" className="input-field py-2.5" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Mother's Name *</label>
                <input type="text" name="motherName" value={form.motherName} onChange={handleChange} placeholder="Full Name" className="input-field py-2.5" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Date of Birth *</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-field py-2.5" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="input-field py-2.5" required>
                  <option value="" className="bg-gray-900">Select Gender</option>
                  <option value="Male" className="bg-gray-900">Male</option>
                  <option value="Female" className="bg-gray-900">Female</option>
                  <option value="Other" className="bg-gray-900">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-gray-400 text-sm block mb-1">Address *</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, Apt 4B" className="input-field py-2.5" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">City *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City Name" className="input-field py-2.5" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">State/Province *</label>
                <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="State Name" className="input-field py-2.5" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Pincode/ZIP *</label>
                <input type="text" name="pincode" value={form.pincode} onChange={handleChange} placeholder="E.g. 10001" className="input-field py-2.5" required />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Academic Info */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-white font-heading font-semibold text-lg mb-5">Academic Information</h2>
            {selectedProgram && (
              <div className="p-3 bg-primary-600/10 border border-primary-500/20 rounded-xl text-xs text-primary-300 mb-4">
                Applying for: <strong>{selectedProgram.programName}</strong>
                {selectedProgram.minGPA > 0 && ` • Min GPA: ${selectedProgram.minGPA}`}
                {selectedProgram.minEntranceScore > 0 && ` • Min Score: ${selectedProgram.minEntranceScore}`}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">GPA (out of 10) *</label>
                <input type="number" name="gpa" step="0.01" min="0" max="10" value={form.gpa} onChange={handleChange} placeholder="e.g. 8.5" className="input-field" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Entrance Score (0-100) *</label>
                <input type="number" name="entranceScore" step="0.1" min="0" max="100" value={form.entranceScore} onChange={handleChange} placeholder="e.g. 78" className="input-field" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">10th Percentage</label>
                <input type="number" name="tenthPercentage" step="0.1" min="0" max="100" value={form.tenthPercentage} onChange={handleChange} placeholder="e.g. 88" className="input-field" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">12th Percentage</label>
                <input type="number" name="twelfthPercentage" step="0.1" min="0" max="100" value={form.twelfthPercentage} onChange={handleChange} placeholder="e.g. 82" className="input-field" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Previous Institution</label>
              <input type="text" name="previousInstitution" value={form.previousInstitution} onChange={handleChange} placeholder="Name of your last school/college" className="input-field" />
            </div>
          </div>
        )}

        {/* Step 4: Statement */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-white font-heading font-semibold text-lg mb-5">Personal Statement & Review</h2>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Personal Statement (Optional)</label>
              <textarea name="statement" value={form.statement} onChange={handleChange} rows={5}
                placeholder="Tell us about yourself, your goals, and why you'd like to join this program..."
                className="input-field resize-none" />
              <p className="text-gray-600 text-xs mt-1">AI will analyze your statement as part of candidate scoring.</p>
            </div>
            <div className="glass rounded-xl p-4 border border-white/5 space-y-2 text-sm">
              <p className="text-gray-300 font-semibold mb-3">Application Summary</p>
              <div className="flex justify-between"><span className="text-gray-500">Program:</span><span className="text-white text-right">{selectedProgram?.programName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Applicant Name:</span><span className="text-white text-right">{form.fatherName ? form.email : 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">GPA:</span><span className="text-white text-right">{form.gpa}/10</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Entrance Score:</span><span className="text-white text-right">{form.entranceScore}/100</span></div>
              {form.tenthPercentage && <div className="flex justify-between"><span className="text-gray-500">10th:</span><span className="text-white text-right">{form.tenthPercentage}%</span></div>}
              {form.twelfthPercentage && <div className="flex justify-between"><span className="text-gray-500">12th:</span><span className="text-white text-right">{form.twelfthPercentage}%</span></div>}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex items-center gap-2">
              <ChevronLeft size={18} /> Back
            </button>
          ) : <div />}
          {step < 4 ? (
            <button onClick={nextStep} disabled={programs.length === 0 && step === 1} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-accent flex items-center gap-2">
              {loading ? <div className="spinner w-5 h-5" /> : (<><Send size={18} /> Submit Application</>)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
