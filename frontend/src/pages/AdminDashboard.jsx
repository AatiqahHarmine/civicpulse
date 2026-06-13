import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selected, setSelected] = useState([]);

  const loadData = async () => {
    try {
      const mJson = await api.analytics.getKPIs();
      if (mJson.success) {
        setMetrics(mJson.kpis);
        setCategoryData(mJson.categories || []);
      }

      const iJson = await api.issues.getAll();
      if (iJson.success) setIssues(iJson.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const fireBulkStatus = async (status) => {
    if (selected.length === 0) return;
    try {
      const res = await api.issues.bulkUpdate(selected, status);
      if (res.ok) { setSelected([]); loadData(); }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Municipal Command Dashboard</h1>
        <p className="text-slate-500 text-sm">Manage all issues, perform bulk actions, and monitor KPIs.</p>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 border rounded-xl shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">Total Issues</span>
            <span className="text-3xl font-black text-slate-900">{metrics.total}</span>
          </div>
          <div className="bg-white p-5 border rounded-xl shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">Pending</span>
            <span className="text-3xl font-black text-amber-600">{metrics.pending}</span>
          </div>
          <div className="bg-white p-5 border rounded-xl shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">In Progress</span>
            <span className="text-3xl font-black text-blue-600">{metrics.inProgress}</span>
          </div>
          <div className="bg-white p-5 border rounded-xl shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">Resolved</span>
            <span className="text-3xl font-black text-emerald-600">{metrics.resolved}</span>
          </div>
        </div>
      )}

      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white p-6 border rounded-xl shadow-sm h-[320px] flex flex-col justify-between">
            <h3 className="font-extrabold text-slate-800 text-sm mb-3">Issue Categories Distribution</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.map(c => ({ name: c._id, value: c.count }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconSize={10} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 border rounded-xl shadow-sm h-[320px] flex flex-col justify-between">
            <h3 className="font-extrabold text-slate-800 text-sm mb-3">Resolution Progress by Status</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Pending', count: metrics.pending },
                  { name: 'In Progress', count: metrics.inProgress },
                  { name: 'Resolved', count: metrics.resolved },
                ]}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center flex-wrap gap-2 text-xs font-bold">
          <span className="text-slate-500">{selected.length} issue(s) selected</span>
          <div className="flex gap-2">
            <button onClick={() => fireBulkStatus('In Progress')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition">Mark In-Progress</button>
            <button onClick={() => fireBulkStatus('Resolved')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition">Mark Resolved</button>
            <button onClick={() => fireBulkStatus('Rejected')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition">Reject</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 border-b text-slate-700 text-xs font-bold uppercase">
                <th className="p-4 w-10"></th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Reported By</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {issues.map(item => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 text-center"><input type="checkbox" checked={selected.includes(item._id)} onChange={() => toggleSelect(item._id)} /></td>
                  <td className="p-4 font-bold text-slate-900">
                    <Link to={`/issue/${item._id}`} className="text-blue-600 hover:underline">
                      {item.title}
                    </Link>
                  </td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4 font-semibold">{item.severity}</td>
                  <td className="p-4 text-slate-500">{item.reportedBy?.name || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
