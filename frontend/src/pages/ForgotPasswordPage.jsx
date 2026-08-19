import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { api } from '../services/api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenResult, setTokenResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.success) {
        setTokenResult(res.resetToken);
      }
    } catch (err) {
      setError(err.message || 'Failed to dispatch password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-white">Reset Password</h2>
        <p className="text-xs text-slate-400">
          Enter your registered email address to receive reset instructions
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {tokenResult ? (
        <div className="space-y-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Reset Token Generated</span>
          </div>
          <p className="text-xs text-slate-300">
            For demonstration and rapid verification, your secure reset token is:
          </p>
          <div className="p-2.5 rounded-xl bg-obsidian-950 font-mono text-xs text-emerald-300 select-all break-all border border-emerald-500/20">
            {tokenResult}
          </div>
          <button
            onClick={() => navigate(`/reset-password?token=${tokenResult}`)}
            className="btn-primary w-full py-2.5 text-xs"
          >
            <KeyRound className="w-4 h-4" />
            <span>Proceed to Set New Password</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Registered Email</label>
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm mt-2"
          >
            {loading ? 'Sending Instructions...' : 'Send Password Reset Link'}
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-forest-800 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
