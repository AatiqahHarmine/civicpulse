import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const HomeFeed = () => {
  const [issues, setIssues] = useState([]);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const navigate = useNavigate();

  const loadIssues = async () => {
    try {
      const json = await api.issues.getAll({ category, status, search, sort });
      if (json.success) setIssues(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadIssues(); }, [category, status, search, sort]);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Public Issue Feed</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time crowdsourced civic infrastructure tracking.</p>
        </div>
        <div className="w-full md:w-auto flex flex-wrap gap-2.5">
          <input type="text" placeholder="Search issues..." value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 border rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-60 shadow-sm" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 border rounded-xl text-sm bg-white outline-none shadow-sm">
            <option value="">All Categories</option>
            <option value="Pothole">Potholes</option>
            <option value="Garbage">Garbage</option>
            <option value="Water">Water Leakage</option>
            <option value="Light">Street Lights</option>
            <option value="Other">Other</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 border rounded-xl text-sm bg-white outline-none shadow-sm">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="px-3 py-2 border rounded-xl text-sm bg-white outline-none shadow-sm">
            <option value="createdAt">Newest</option>
            <option value="upvotes">Top Upvoted</option>
            <option value="severity">Highest Severity</option>
          </select>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-medium">No issues found. Be the first to report one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map(item => (
            <div key={item._id} onClick={() => navigate(`/issue/${item._id}`)} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between">
              <div>
                {item.image ? (
                  <img src={item.image} alt="" className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400 font-medium text-xs">No Image Provided</div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded">{item.category}</span>
                    <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded ${item.severity === 'Critical' || item.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>{item.severity}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                  <div className="text-[11px] text-slate-400 truncate">📍 {item.location}</div>
                </div>
              </div>
              <div className="border-t px-5 py-3.5 bg-slate-50 flex justify-between items-center text-xs font-bold">
                <span className={`px-2 py-0.5 rounded-full ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{item.status}</span>
                <span className="text-slate-500">👍 {item.upvotes} Upvotes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeFeed;
