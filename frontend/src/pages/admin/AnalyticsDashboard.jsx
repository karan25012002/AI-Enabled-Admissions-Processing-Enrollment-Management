import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import api from '../../api/axios';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/analytics/programs'),
      api.get('/analytics/trend'),
    ]).then(([s, p, t]) => {
      setStats(s.data.stats);
      setPrograms(p.data.data || []);
      setTrend(t.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;

  const statusPie = [
    { name: 'Accepted', value: stats?.applicationsByStatus?.accepted || 0 },
    { name: 'Rejected', value: stats?.applicationsByStatus?.rejected || 0 },
    { name: 'Pending', value: stats?.applicationsByStatus?.pending || 0 },
    { name: 'In Review', value: stats?.applicationsByStatus?.underReview || 0 },
  ].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
      <div className="glass-dark rounded-xl border border-white/10 p-3 text-xs">
        <p className="text-white font-semibold mb-1">{label}</p>
        {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
      </div>
    );
    return null;
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="page-title">Analytics Dashboard</h1>
        <p className="page-subtitle">Comprehensive admission statistics and insights</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats?.totalUsers || 0, color: 'text-primary-400' },
          { label: 'Applications', value: stats?.totalApplications || 0, color: 'text-blue-400' },
          { label: 'Acceptance Rate', value: `${stats?.acceptanceRate || 0}%`, color: 'text-green-400' },
          { label: 'Active Programs', value: stats?.totalPrograms || 0, color: 'text-accent-400' },
        ].map((m, i) => (
          <div key={i} className="card text-center">
            <p className={`text-4xl font-heading font-bold ${m.color}`}>{m.value}</p>
            <p className="text-gray-400 text-sm mt-2">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Pie */}
        <div className="card">
          <h3 className="text-white font-heading font-semibold mb-5">Application Status Distribution</h3>
          {statusPie.length === 0 ? <div className="h-48 flex items-center justify-center text-gray-600">No data yet</div> : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="card">
          <h3 className="text-white font-heading font-semibold mb-5">Monthly Applications Trend</h3>
          {trend.length === 0 ? <div className="h-56 flex items-center justify-center text-gray-600">No data yet</div> : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} name="Applications" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Program-wise bar chart */}
      {programs.length > 0 && (
        <div className="card">
          <h3 className="text-white font-heading font-semibold mb-5">Applications by Program</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programs} barGap={4}>
                <XAxis dataKey="programName" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => v.length > 12 ? `${v.slice(0, 12)}...` : v} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
                <Bar dataKey="totalApplications" name="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="accepted" name="Accepted" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgAiScore" name="Avg AI Score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
