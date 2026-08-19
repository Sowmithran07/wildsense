import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Shield, CheckCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing demo credentials
  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@wildsense.org');
      setPassword('password123');
    } else if (role === 'officer') {
      setEmail('officer@wildsense.org');
      setPassword('password123');
    } else if (role === 'resident') {
      setEmail('resident@wildsense.org');
      setPassword('password123');
    }
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-white">System Access Terminal</h2>
        <p className="text-xs text-slate-400">
          Sign in to the WILD SENSE monitoring console
        </p>
      </div>

      {/* Quick Demo Credentials Switcher */}
      <div className="p-3 rounded-2xl bg-forest-900/90 border border-emerald-500/20 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block text-center">
          ⚡ 1-Click Demo Login
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('admin')}
            className="px-2.5 py-1.5 rounded-xl bg-forest-850 hover:bg-forest-750 text-[11px] font-bold text-slate-200 border border-forest-700 hover:border-emerald-400 transition-all text-center"
          >
            🛡️ Admin
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('officer')}
            className="px-2.5 py-1.5 rounded-xl bg-forest-850 hover:bg-forest-750 text-[11px] font-bold text-slate-200 border border-forest-700 hover:border-emerald-400 transition-all text-center"
          >
            🌲 Officer
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('resident')}
            className="px-2.5 py-1.5 rounded-xl bg-forest-850 hover:bg-forest-750 text-[11px] font-bold text-slate-200 border border-forest-700 hover:border-emerald-400 transition-all text-center"
          >
            🏡 Resident
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@wildsense.org"
              required
              className="w-full glass-input pl-10"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full glass-input pl-10"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-sm mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-obsidian-950 border-t-transparent animate-spin" />
              Authenticating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In to System
            </span>
          )}
        </button>
      </form>

      {/* Footer Register Link */}
      <div className="pt-4 border-t border-forest-800 text-center text-xs text-slate-400">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300">
          Register as Resident / Officer
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
