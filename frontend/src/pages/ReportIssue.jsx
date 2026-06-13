import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ReportIssue = () => {
  const [form, setForm] = useState({ title: '', description: '', category: 'Pothole', location: '', latitude: 12.9716, longitude: 77.5946, image: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFetchCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setForm(prev => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
        () => setError('Location permissions denied.')
      );
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.issues.create(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 my-10 bg-white border rounded-2xl shadow-sm">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report a Public Issue</h2>
      <p className="text-xs text-slate-400 mb-6 mt-1">AI automatically scores severity. Duplicate location checks run on submit.</p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">{error}</div>}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Issue Title</label>
          <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Brief summary of the issue" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Description</label>
          <textarea rows="4" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Detailed description of the problem..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Pothole">Pothole</option>
              <option value="Garbage">Garbage</option>
              <option value="Water">Water Leakage</option>
              <option value="Light">Street Light</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Address / Location</label>
            <input type="text" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Ward 5, Main Street" />
          </div>
        </div>
        <div className="p-4 bg-slate-50 border rounded-xl flex items-center justify-between text-xs font-medium">
          <div>
            <div className="text-slate-400">Lat: <span className="font-mono text-slate-800 font-bold">{form.latitude}</span></div>
            <div className="text-slate-400">Lng: <span className="font-mono text-slate-800 font-bold">{form.longitude}</span></div>
          </div>
          <button type="button" onClick={handleFetchCoordinates} className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition">📍 Fetch Live GPS</button>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Image URL (optional)</label>
          <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Paste an image link for documentation" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition">
          {loading ? 'Running AI Analysis & Duplicate Check...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
