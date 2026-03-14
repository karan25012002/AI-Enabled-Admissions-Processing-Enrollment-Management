import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, XCircle, Clock, Trash2, Folder, FileBadge, ArrowDownCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function UploadDocuments() {
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selApp, setSelApp] = useState('');
  const [selType, setSelType] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const docTypes = [
    { value: '10th_marksheet', label: '10th Marksheet' },
    { value: '12th_marksheet', label: '12th Marksheet' },
    { value: 'graduation_certificate', label: 'Graduation Certificate' },
    { value: 'entrance_scorecard', label: 'Entrance Scorecard' },
    { value: 'id_proof', label: 'ID Proof' },
    { value: 'photo', label: 'Passport Photo' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    Promise.all([api.get('/applications/my'), api.get('/documents/my')])
      .then(([a, d]) => { setApplications(a.data.applications || []); setDocuments(d.data.documents || []); })
      .finally(() => setLoading(false));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'], 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (files, rejected) => {
      if (rejected.length > 0) { toast.error('File too large or invalid type. Max 5MB, JPG/PNG/PDF only.'); return; }
      setFile(files[0]);
    },
  });

  const handleUpload = async () => {
    if (!selApp) { toast.error('Select an application'); return; }
    if (!selType) { toast.error('Select document type'); return; }
    if (!file) { toast.error('Select a file'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('document', file);
      fd.append('documentType', selType);
      fd.append('applicationId', selApp);
      await api.post('/documents/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Document uploaded successfully!');
      setFile(null); setSelType('');
      const d = await api.get('/documents/my');
      setDocuments(d.data.documents || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const verifyIcon = (s) => ({ verified: <CheckCircle size={16} className="text-green-400" />, rejected: <XCircle size={16} className="text-red-400" />, pending: <Clock size={16} className="text-yellow-400" /> })[s];
  const verifyClass = (s) => ({ verified: 'status-accepted', rejected: 'status-rejected', pending: 'status-pending' })[s];

  if (loading) return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="page-header">
        <h1 className="page-title">Upload Documents</h1>
        <p className="page-subtitle">Upload required certificates and documents for your application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload section */}
        <div className="card space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center border border-primary-500/20">
              <Upload size={20} className="text-primary-400" />
            </div>
            <div>
              <h2 className="text-white font-heading font-semibold text-lg">Upload New Document</h2>
              <p className="text-gray-400 text-xs mt-0.5">Securely attach mandatory files</p>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">Select Application <span className="text-red-400">*</span></label>
            <div className="relative">
              <Folder size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <select value={selApp} onChange={e => setSelApp(e.target.value)} className="input-field pl-11 appearance-none bg-white/5 text-white">
                <option value="" className="bg-gray-900 text-gray-400">--- Choose Application ---</option>
                {applications.map(a => <option key={a._id} value={a._id} className="bg-gray-900 text-white">{a.programId?.programName}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">Document Type <span className="text-red-400">*</span></label>
            <div className="relative">
              <FileBadge size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <select value={selType} onChange={e => setSelType(e.target.value)} className="input-field pl-11 appearance-none bg-white/5 text-white">
                <option value="" className="bg-gray-900 text-gray-400">--- Select Type ---</option>
                {docTypes.map(t => <option key={t.value} value={t.value} className="bg-gray-900 text-white">{t.label}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">Upload File <span className="text-red-400">*</span></label>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group ${isDragActive ? 'border-primary-500 bg-primary-500/10 scale-[1.02]' : 'border-white/10 hover:border-primary-500/50 hover:bg-white/5'}`}>
              <input {...getInputProps()} />
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-primary-500/20 text-primary-400' : 'bg-gray-800 text-gray-400 group-hover:bg-primary-500/20 group-hover:text-primary-400'}`}>
                {file ? <FileText size={28} /> : <ArrowDownCircle size={28} />}
              </div>
              {file ? (
                <div className="animate-fade-in">
                  <p className="text-primary-300 text-sm font-semibold">{file.name}</p>
                  <p className="text-gray-500 text-xs mt-1 font-medium">{(file.size / 1024).toFixed(1)} KB • Ready to upload</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-200 text-sm font-medium">{isDragActive ? 'Drop file to attach!' : 'Click or drag file to this area to upload'}</p>
                  <p className="text-gray-500 text-xs mt-2">Maximum file size: 5MB</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase bg-gray-800 px-2 py-1 rounded">JPG</span>
                    <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase bg-gray-800 px-2 py-1 rounded">PNG</span>
                    <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase bg-gray-800 px-2 py-1 rounded">PDF</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button onClick={handleUpload} disabled={uploading || !file || !selApp || !selType}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {uploading ? <div className="spinner w-5 h-5" /> : (<><Upload size={18} /> Upload Document</>)}
          </button>
        </div>

        {/* Uploaded docs */}
        <div className="card relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
              <FileBadge size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-heading font-semibold text-lg">My Documents</h2>
              <p className="text-gray-400 text-xs mt-0.5">{documents.length} files attached across applications</p>
            </div>
          </div>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto scroll-custom pr-1">
              {documents.map(doc => (
                <div key={doc._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 transition-colors hover:bg-white/10">
                  <div className="flex items-center gap-3 min-w-0">
                    {verifyIcon(doc.verificationStatus)}
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{doc.originalName}</p>
                      <p className="text-gray-500 text-xs">{doc.documentType.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <span className={`${verifyClass(doc.verificationStatus)} ml-2 shrink-0`}>{doc.verificationStatus}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
