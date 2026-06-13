import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { api } from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.auth.register(form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white border border-slate-200/80 p-8 rounded-2xl shadow-xl shadow-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400 mt-2">Join CivicPulse and start reporting issues.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="Your full name" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="name@domain.com" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="Create a strong password" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Citizen">Citizen</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2">
            {loading ? 'Creating Account...' : <><UserPlus size={18}/> Create Account</>}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-bold">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
