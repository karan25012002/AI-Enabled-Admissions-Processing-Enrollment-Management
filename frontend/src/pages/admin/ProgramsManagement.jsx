import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const EMPTY_FORM = { programName: '', description: '', duration: '', seats: '', eligibilityCriteria: '', minGPA: '', minEntranceScore: '', category: 'Other', fees: '', applicationDeadline: '' };

export default function ProgramsManagement() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchPrograms = () => {
    api.get('/programs').then(r => setPrograms(r.data.programs || [])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchPrograms(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, applicationDeadline: p.applicationDeadline ? new Date(p.applicationDeadline).toISOString().split('T')[0] : '' });
    setEditing(p._id);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, seats: parseInt(form.seats), minGPA: parseFloat(form.minGPA || 0), minEntranceScore: parseFloat(form.minEntranceScore || 0), fees: parseFloat(form.fees || 0) };
      if (editing) {
        await api.put(`/programs/${editing}`, payload);
        toast.success('Program updated');
      } else {
        await api.post('/programs', payload);
        toast.success('Program created');
      }
      setShowModal(false);
      fetchPrograms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving program');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/programs/${id}`);
      toast.success('Program deleted');
      fetchPrograms();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Programs Management</h1>
          <p className="page-subtitle">{programs.length} programs configured</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Program
        </button>
      </div>

      {programs.length === 0 ? (
        <div className="card text-center py-16">
          <GraduationCap size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-white font-heading font-semibold text-lg">No Programs Yet</h3>
          <p className="text-gray-400 text-sm mt-2 mb-6">Add your first academic program.</p>
          <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2"><Plus size={18} /> Create Program</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {programs.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-500/20 flex items-center justify-center">
                  <GraduationCap size={22} className="text-accent-400" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg ${p.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-white font-heading font-bold text-lg mb-1">{p.programName}</h3>
              <p className="text-gray-500 text-xs mb-3">{p.category}</p>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-5">
                <div className="bg-white/5 rounded-lg p-2"><span className="text-gray-500">Duration</span><p className="text-gray-200 mt-0.5">{p.duration}</p></div>
                <div className="bg-white/5 rounded-lg p-2"><span className="text-gray-500">Seats</span><p className="text-gray-200 mt-0.5">{p.seats}</p></div>
                <div className="bg-white/5 rounded-lg p-2"><span className="text-gray-500">Min GPA</span><p className="text-gray-200 mt-0.5">{p.minGPA || 'None'}</p></div>
                <div className="bg-white/5 rounded-lg p-2"><span className="text-gray-500">Min Score</span><p className="text-gray-200 mt-0.5">{p.minEntranceScore || 'None'}</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 text-sm text-primary-400 border border-primary-500/30 hover:bg-primary-500/10 rounded-lg py-2 transition-all">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(p._id, p.programName)} className="flex-1 flex items-center justify-center gap-1.5 text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 rounded-lg py-2 transition-all">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-dark rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto scroll-custom shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-heading font-bold text-xl">{editing ? 'Edit Program' : 'Add New Program'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1"><X size={22} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-gray-400 text-sm block mb-2">Program Name *</label>
                    <input type="text" value={form.programName} onChange={e => setForm({...form, programName: e.target.value})} className="input-field" required placeholder="e.g. B.Tech Computer Science" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-sm block mb-2">Description *</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="input-field resize-none" required placeholder="Program description..." />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Duration *</label>
                    <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="input-field" required placeholder="e.g. 4 Years" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Total Seats *</label>
                    <input type="number" value={form.seats} onChange={e => setForm({...form, seats: e.target.value})} className="input-field" required min="1" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
                      {['Engineering','Management','Science','Arts','Commerce','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Fees (₹)</label>
                    <input type="number" value={form.fees} onChange={e => setForm({...form, fees: e.target.value})} className="input-field" min="0" placeholder="Annual fees" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Min GPA</label>
                    <input type="number" value={form.minGPA} step="0.1" min="0" max="10" onChange={e => setForm({...form, minGPA: e.target.value})} className="input-field" placeholder="Minimum GPA required" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Min Entrance Score</label>
                    <input type="number" value={form.minEntranceScore} min="0" max="100" onChange={e => setForm({...form, minEntranceScore: e.target.value})} className="input-field" placeholder="Minimum score required" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Application Deadline</label>
                    <input type="date" value={form.applicationDeadline} onChange={e => setForm({...form, applicationDeadline: e.target.value})} className="input-field" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-sm block mb-2">Eligibility Criteria</label>
                    <input type="text" value={form.eligibilityCriteria} onChange={e => setForm({...form, eligibilityCriteria: e.target.value})} className="input-field" placeholder="Additional eligibility requirements..." />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {saving ? <div className="spinner w-5 h-5" /> : (<><Save size={18} /> {editing ? 'Update' : 'Create'}</>)}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
