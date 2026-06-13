import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Landmark, ShieldAlert, LogOut, LayoutDashboard, Map, FileText, Bell } from 'lucide-react';
import { api } from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const json = await api.notifications.get();
      if (json.success) setNotifications(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleClearNotifications = async () => {
    try {
      const json = await api.notifications.clear();
      if (json.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
        <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
          <Landmark size={20} />
        </div>
        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">CivicPulse</span>
      </div>

      <div className="flex items-center gap-6 text-sm font-semibold text-slate-300">
        <Link to="/" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
          <ShieldAlert size={16}/> Home Feed
        </Link>
        <Link to="/map" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
          <Map size={16}/> Map Explorer
        </Link>

        {user ? (
          <>
            <Link to="/report" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5">
              <FileText size={16}/> Report Issue
            </Link>
            {user.role === 'Admin' && (
              <Link to="/admin" className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors border border-amber-500/30 px-3 py-1.5 rounded-xl bg-amber-500/5">
                <LayoutDashboard size={16}/> Dashboard
              </Link>
            )}

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-1.5 text-slate-400 hover:text-white transition-colors flex items-center">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] px-1 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl shadow-xl z-50 text-xs py-2">
                  <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-700">
                    <span className="font-extrabold text-white text-xs">Alert Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={handleClearNotifications} className="text-[10px] text-blue-400 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto mt-1 divide-y divide-slate-700/50">
                    {notifications.length === 0 ? (
                      <div className="text-slate-500 text-center py-6">No notifications yet.</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} className={`p-3 transition-colors text-left ${n.read ? 'opacity-60' : 'bg-slate-700/35 border-l-2 border-blue-500'}`}>
                          <div className="font-bold text-white mb-0.5">{n.title}</div>
                          <div className="text-slate-400 text-[11px] leading-snug">{n.message}</div>
                          <div className="text-[9px] text-slate-500 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-slate-800" />
            <Link to="/profile" className="text-slate-400 font-medium hover:text-white transition-colors">
              Hello, <span className="text-white font-semibold">{user.name}</span>
            </Link>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors">
              <LogOut size={16}/>
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl hover:bg-slate-700 hover:border-slate-600 transition-all text-white">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
