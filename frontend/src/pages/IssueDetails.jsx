import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [assignee, setAssignee] = useState('');
  const [remarks, setRemarks] = useState('');
  const [statusVal, setStatusVal] = useState('Pending');
  const [updating, setUpdating] = useState(false);

  const loadProfile = async () => {
    try {
      const iJson = await api.issues.getById(id);
      if (iJson.success) setIssue(iJson.data);

      const cJson = await api.comments.getByIssueId(id);
      if (cJson.success) setComments(cJson.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadProfile(); }, [id]);

  useEffect(() => {
    if (issue) {
      setAssignee(issue.assignedTo || '');
      setRemarks(issue.adminRemarks || '');
      setStatusVal(issue.status || 'Pending');
    }
  }, [issue]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await api.issues.delete(id);
        navigate('/');
      } catch (err) {
        console.error(err);
        alert(err.message || 'Failed to delete issue.');
      }
    }
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.issues.update(id, {
        assignedTo: assignee,
        adminRemarks: remarks,
        status: statusVal
      });
      if (res.success) {
        setIssue(res.data);
        alert('Issue updated successfully!');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update issue.');
    } finally {
      setUpdating(false);
    }
  };

  const postReaction = async (type) => {
    try {
      const json = await api.issues.react(id, type);
      if (json.success) setIssue(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const json = await api.comments.create(id, newComment);
      if (json.success) {
        setComments([...comments, json.data]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!issue) return <div className="p-8 text-center text-slate-500">Loading issue details...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          {issue.image && <img src={issue.image} alt="" className="w-full max-h-[400px] object-cover" />}
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-bold bg-slate-100 px-2 py-0.5 rounded uppercase">{issue.category}</span>
              <span className="text-[11px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded uppercase">AI Score: {issue.severityScore}/10</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${issue.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{issue.status}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${issue.severity === 'Critical' ? 'bg-red-100 text-red-800' : issue.severity === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'}`}>{issue.severity}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">{issue.title}</h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">{issue.description}</p>
            <div className="text-xs text-slate-400 font-medium">📍 {issue.location}</div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="font-extrabold text-slate-900 mb-4 text-base">Community Comments</h3>
          <form onSubmit={handleComment} className="flex gap-2 mb-4">
            <input type="text" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} className="flex-1 px-4 py-2 border rounded-xl bg-slate-50 outline-none text-sm focus:ring-2 focus:ring-blue-500" />
            <button className="bg-slate-900 text-white text-xs font-bold px-4 rounded-xl hover:bg-slate-800 transition">Post</button>
          </form>
          <div className="space-y-2">
            {comments.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No comments yet. Be the first!</p>}
            {comments.map(c => (
              <div key={c._id} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                <span className="font-black text-slate-800 block mb-0.5">{c.user?.name || 'Anonymous'}</span>
                <span className="text-slate-600 font-medium">{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white border rounded-2xl p-5 shadow-sm text-center">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">React to this Issue</h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button onClick={() => postReaction('upvote')} className="p-3 border rounded-xl bg-slate-50 hover:bg-blue-50 transition">👍 Upvote ({issue.upvotes})</button>
            <button onClick={() => postReaction('urgent')} className="p-3 border rounded-xl bg-slate-50 hover:bg-red-50 transition">🚨 Urgent ({issue.reactions?.urgent || 0})</button>
            <button onClick={() => postReaction('support')} className="p-3 border rounded-xl bg-slate-50 hover:bg-emerald-50 transition">🤝 Support ({issue.reactions?.support || 0})</button>
            <button onClick={() => postReaction('agree')} className="p-3 border rounded-xl bg-slate-50 hover:bg-purple-50 transition">🎯 Agree ({issue.reactions?.agree || 0})</button>
          </div>
          {issue.isPetition && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold">
              🔥 This issue is now an active Community Petition!
            </div>
          )}
        </div>

        {user?.role === 'Admin' ? (
          <form onSubmit={handleAdminUpdate} className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 text-xs font-medium text-slate-600">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Admin Control Panel</h4>
            
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Assign Issue To</label>
              <input
                type="text"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs font-semibold"
                placeholder="e.g. Department, Worker Name"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status</label>
              <select
                value={statusVal}
                onChange={e => setStatusVal(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs font-semibold"
              >
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Admin Remarks</label>
              <textarea
                rows="3"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs font-semibold"
                placeholder="Add instructions or updates..."
              />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Reported By</span>
              <span className="text-slate-900 font-bold">{issue.reportedBy?.name || 'Unknown'} ({issue.reportedBy?.email || '—'})</span>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition"
            >
              {updating ? 'Saving Changes...' : '💾 Save Assignment & Info'}
            </button>
          </form>
        ) : (
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-2 text-xs font-medium text-slate-600">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Admin Info</h4>
            <div>Assigned To: <span className="text-slate-900 font-bold">{issue.assignedTo || 'Unassigned'}</span></div>
            <div>Remarks: <span className="text-slate-900 block mt-1 bg-slate-50 p-2 rounded border">{issue.adminRemarks || 'No remarks yet.'}</span></div>
            <div>Reported by: <span className="text-slate-900 font-bold">{issue.reportedBy?.name || 'Unknown'}</span></div>
          </div>
        )}

        {user && (user.role === 'Admin' || user._id === issue.reportedBy?._id) && (
          <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-500">Danger Zone</h4>
            <button onClick={handleDelete} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
              🗑️ Delete Issue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueDetails;
