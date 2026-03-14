import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, FileText, Star, Bell, Shield, Zap, 
  ChevronRight, Menu, X, GraduationCap, Award,
  BarChart3, Users, ArrowRight, MessageCircle, CheckCircle2
} from 'lucide-react';
import api from '../../api/axios';
import Chatbot from '../../components/Chatbot';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    api.get('/programs').then(r => setPrograms(r.data.programs || [])).catch(() => {});
  }, []);

  const features = [
    { icon: <Brain size={28} />, title: 'AI Application Screening', desc: 'Automated eligibility analysis powered by Google Gemini AI' },
    { icon: <FileText size={28} />, title: 'Online Application Submission', desc: 'Seamless multi-step digital application form with validation' },
    { icon: <Star size={28} />, title: 'Smart Candidate Ranking', desc: 'AI-driven scoring ranks candidates objectively and accurately' },
    { icon: <Bell size={28} />, title: 'Automated Notifications', desc: 'Real-time alerts for every stage of your admission journey' },
    { icon: <Shield size={28} />, title: 'Fraud Detection', desc: 'AI detects inconsistencies and protects admission integrity' },
    { icon: <Zap size={28} />, title: 'Secure Document Upload', desc: 'End-to-end encrypted document verification system' },
  ];

  const process = [
    { step: '01', title: 'Register Account', desc: 'Create your profile', icon: <Users size={20} /> },
    { step: '02', title: 'Fill Application', desc: 'Complete all sections', icon: <FileText size={20} /> },
    { step: '03', title: 'Upload Documents', desc: 'Submit certificates', icon: <Shield size={20} /> },
    { step: '04', title: 'AI Evaluation', desc: 'Automated analysis', icon: <Brain size={20} /> },
    { step: '05', title: 'Admission Decision', desc: 'Get your result', icon: <CheckCircle2 size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0f0e17]">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg shadow-black/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="font-heading font-bold text-white text-lg hidden sm:block">AI Admissions</span>
            </div>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {['Home', 'About', 'Programs', 'Process'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
                  {item}
                </a>
              ))}
              <a href="#contact" className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">Contact</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-dark border-t border-white/10 px-4 pt-2 pb-4">
              {['Home', 'About', 'Programs', 'Process', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-gray-300 hover:text-white text-sm font-medium">{item}</a>
              ))}
              <div className="flex gap-3 mt-3">
                <Link to="/login" className="flex-1 text-center btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/signup" className="flex-1 text-center btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg">
        <div className="orb w-96 h-96 bg-primary-600 top-1/4 -left-24 animation-delay-0" />
        <div className="orb w-72 h-72 bg-accent-500 bottom-1/4 -right-16 animation-delay-2000" style={{ animationDelay: '2s' }} />
        <div className="orb w-64 h-64 bg-purple-600 top-3/4 left-1/3 animation-delay-4000" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/30 text-primary-300 text-sm font-medium">
                <Brain size={14} />
                Powered by Google Gemini AI
              </span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6 text-shadow">
              AI-Enabled{' '}
              <span className="gradient-text">Admissions Processing</span>{' '}
              & Enrollment Management
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Smart admission platform that automates application review, eligibility screening, and student enrollment using Artificial Intelligence.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-base py-3.5 px-8">
                Apply Now <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary inline-flex items-center gap-2 text-base py-3.5 px-8">
                Login to Dashboard
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
              {[['AI-Powered', 'Screening'], ['Real-time', 'Notifications'], ['Secure', 'Document Upload']].map(([a, b]) => (
                <div key={a} className="glass rounded-2xl p-4">
                  <div className="text-primary-400 font-bold text-base font-heading">{a}</div>
                  <div className="text-gray-500 text-xs mt-1">{b}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-3 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
              Why Choose Our <span className="gradient-text">AI System?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Our platform combines cutting-edge AI technology with intuitive design to create the most efficient admissions workflow.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card group cursor-default hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-500/20 flex items-center justify-center text-primary-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-white font-heading font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
              Available <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">Explore our diverse academic programs designed to shape future leaders.</p>
          </motion.div>
          {programs.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 text-lg">No programs added yet.</p>
              <p className="text-gray-600 text-sm mt-2">Admin will add programs soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((prog, i) => (
                <motion.div key={prog._id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card group hover:-translate-y-2 transition-all duration-300 gradient-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-500/20 flex items-center justify-center">
                      <Award size={22} className="text-accent-400" />
                    </div>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">{prog.duration}</span>
                  </div>
                  <h3 className="text-white font-heading font-bold text-lg mb-2">{prog.programName}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">{prog.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{prog.seats} seats available</span>
                    <Link to="/signup"
                      className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-semibold transition-colors">
                      Apply Now <ChevronRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Admission Process */}
      <section id="process" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
              Simple <span className="gradient-text">Admission Process</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">From registration to decision — our AI streamlines every step.</p>
          </motion.div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-700 via-primary-500 to-accent-500 mx-32" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {process.map((p, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="text-center relative">
                  <div className="relative z-10 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 border border-primary-500/50 flex flex-col items-center justify-center mb-4 shadow-lg shadow-primary-900/50">
                    <div className="text-white/70 mb-1">{p.icon}</div>
                    <span className="text-white font-mono font-bold text-xs">{p.step}</span>
                  </div>
                  <h3 className="text-white font-heading font-semibold text-base mb-1">{p.title}</h3>
                  <p className="text-gray-500 text-xs">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mt-12">
            <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-base py-3.5 px-8">
              Start Your Application <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">Have questions about admissions? Our AI assistant is available 24/7 to help you.</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card">
              <h3 className="text-white font-heading font-semibold text-xl mb-6">Admissions Office</h3>
              {[
                { label: 'Email', value: 'aishae33@gmail.com' },
                { label: 'System', value: 'AI-Enabled Admissions Portal' },
                { label: 'Support', value: '24/7 AI Chatbot Available' },
                { label: 'Admin', value: 'Login via Admin Panel' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
                    <p className="text-gray-200 text-sm">{value}</p>
                  </div>
                </div>
              ))}
              <Link to="/admin/login" className="mt-4 inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-semibold transition-colors">
                Admin Login <ChevronRight size={16} />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card">
              <h3 className="text-white font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                <MessageCircle size={20} className="text-primary-400" />
                AI Chatbot
              </h3>
              <p className="text-gray-400 text-sm mb-6">Ask our Gemini-powered assistant anything about admissions, programs, or the application process.</p>
              <button onClick={() => setChatOpen(true)}
                className="btn-primary w-full flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                Chat with AI Assistant
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-heading font-bold text-white">AI Admissions System</span>
          </div>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} AI-Enabled Admissions Processing & Enrollment Management System. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <Link to="/signup" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Apply Now</Link>
            <Link to="/login" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Student Login</Link>
            <Link to="/admin/login" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      
      {/* Floating chat button */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-900/50 flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 z-40">
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
