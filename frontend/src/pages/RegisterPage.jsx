import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'resident',
    locationName: 'Mangala Village - Farm Sector 3',
    badgeNumber: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required registration fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        location: {
          name: formData.locationName,
          latitude: 11.6548 + (Math.random() - 0.5) * 0.02,
          longitude: 76.6178 + (Math.random() - 0.5) * 0.02,
        },
        assignedZone: formData.locationName,
        badgeNumber: formData.badgeNumber,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-white">Create System Account</h2>
        <p className="text-xs text-slate-400">
          Register to receive wildlife intrusion alerts & safety notifications
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Switcher */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-300">Account Type / Role</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'resident' })}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                formData.role === 'resident'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                  : 'bg-forest-900/60 text-slate-400 border-forest-800 hover:border-forest-600'
              }`}
            >
              🏡 Resident
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'officer' })}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                formData.role === 'officer'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-md shadow-teal-500/10'
                  : 'bg-forest-900/60 text-slate-400 border-forest-800 hover:border-forest-600'
              }`}
            >
              🌲 Forest Officer
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-300">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Patel"
              required
              className="w-full glass-input pl-10"
            />
          </div>
        </div>

        {/* Email & Phone in 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
                className="w-full glass-input pl-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Phone Number (SMS)</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 94480 00000"
                required
                className="w-full glass-input pl-10"
              />
            </div>
          </div>
        </div>

        {/* Village Location */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-300">Location / Village Sector</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              className="w-full glass-input pl-10 appearance-none cursor-pointer"
            >
              <option value="Mangala Village - Farm Sector 3" className="bg-obsidian-900">Mangala Village - Farm Sector 3</option>
              <option value="Gundlupet Fringe - Hamlet 2" className="bg-obsidian-900">Gundlupet Fringe - Hamlet 2</option>
              <option value="Hangala Village - West Fields" className="bg-obsidian-900">Hangala Village - West Fields</option>
              <option value="Bandipur Gate Settlement" className="bg-obsidian-900">Bandipur Gate Settlement</option>
              <option value="Moyar Gorge Checkpost Corridor" className="bg-obsidian-900">Moyar Gorge Checkpost Corridor</option>
            </select>
          </div>
        </div>

        {/* Officer Badge Number (if officer selected) */}
        {formData.role === 'officer' && (
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Forest Ranger Badge #</label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="badgeNumber"
                value={formData.badgeNumber}
                onChange={handleChange}
                placeholder="e.g. FD-RFO-501"
                className="w-full glass-input pl-10"
              />
            </div>
          </div>
        )}

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full glass-input pl-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full glass-input pl-10"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-sm mt-4"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-obsidian-950 border-t-transparent animate-spin" />
              Creating Account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Complete Registration
            </span>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="pt-4 border-t border-forest-800 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300">
          Sign in to Terminal
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
