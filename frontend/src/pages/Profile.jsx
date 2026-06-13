import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const json = await api.profile.get();
        if (json.success) setProfile(json.profile);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 my-10 space-y-6">
      <div className="bg-white border rounded-2xl p-8 shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-black mx-auto mb-4">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-black text-slate-900">{profile.name}</h1>
        <p className="text-slate-400 text-sm mt-1">{profile.email}</p>
        <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{profile.role}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-5 shadow-sm text-center">
          <div className="text-2xl font-black text-slate-900">{profile.metrics.totalReports}</div>
          <div className="text-xs font-bold text-slate-400 uppercase mt-1">Total Reports</div>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm text-center">
          <div className="text-2xl font-black text-emerald-600">{profile.metrics.resolved}</div>
          <div className="text-xs font-bold text-slate-400 uppercase mt-1">Resolved</div>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm text-center">
          <div className="text-2xl font-black text-amber-600">{profile.metrics.pending}</div>
          <div className="text-xs font-bold text-slate-400 uppercase mt-1">Pending</div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Badges Earned</h3>
        <div className="flex flex-wrap gap-2">
          {profile.badges.map((badge, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-full">🏅 {badge}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
