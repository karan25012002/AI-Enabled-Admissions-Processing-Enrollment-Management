import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Bot, User } from 'lucide-react';
import api from '../api/axios';

export default function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! 👋 I\'m your AI admissions assistant powered by Google Gemini. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const history = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`);
      const res = await api.post('/ai/chat', { message: userMsg, history });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I\'m having a technical issue. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const quickQuestions = [
    'How do I apply?',
    'What documents are needed?',
    'How long does review take?',
    'Can I track my application?',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] glass-dark rounded-3xl shadow-2xl shadow-black/50 border border-primary-500/20 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary-600/20 to-primary-800/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI Admissions Assistant</p>
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Powered by Gemini
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
              <X size={18} />
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-custom">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary-600' : 'bg-gradient-to-br from-primary-500 to-primary-700'}`}>
                  {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                </div>
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary-600/30 text-white rounded-tr-sm' : 'bg-white/10 text-gray-200 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-white/10 px-3.5 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {/* Quick questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {quickQuestions.map(q => (
                <button key={q} onClick={() => { setInput(q); }} className="text-xs text-primary-300 border border-primary-500/30 px-2.5 py-1 rounded-lg hover:bg-primary-500/20 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}
          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Type your question..." className="input-field py-2.5 flex-1 text-sm" />
              <button onClick={sendMessage} disabled={!input.trim() || loading}
                className="btn-primary py-2.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                <Send size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
