import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FilePlus,
  Camera,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { api } from '../services/api';
import { ANIMALS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export const ReportSightingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    animal: 'Elephant',
    description: '',
    locationName: user?.location?.name || 'Mangala Village - Farm Sector 3',
    threatEstimate: 'HIGH',
    reporterName: user?.name || '',
    reporterPhone: user?.phone || '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.locationName) {
      setError('Please provide sighting description and location details.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/sightings', {
        animal: formData.animal,
        description: formData.description,
        locationName: formData.locationName,
        threatEstimate: formData.threatEstimate,
        reporterName: formData.reporterName,
        reporterPhone: formData.reporterPhone,
        image: formData.imageUrl,
      });

      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/resident-portal"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Resident Safety Hub</span>
        </Link>

        <div className="pb-4 border-b border-forest-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Report Wildlife Sighting</h1>
              <p className="text-xs text-slate-400">
                Submit community sightings to help forest rangers verify and deploy preventive measures
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {submitted ? (
        <div className="glass-card rounded-3xl p-8 text-center space-y-5 border border-emerald-500/40">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-2xl font-black text-white">Report Submitted Successfully!</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Your sighting for <span className="font-bold text-emerald-400">{formData.animal}</span> near {formData.locationName} has been routed to the Range Forest Squad for verification.
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Link to="/sightings" className="btn-primary py-2.5 px-5 text-xs">
              View Verified Sightings Feed
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  ...formData,
                  description: '',
                  imageUrl: '',
                });
              }}
              className="btn-secondary py-2.5 px-5 text-xs"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-forest-700/60 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Animal Selection */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Wildlife Species Seen</label>
              <select
                name="animal"
                value={formData.animal}
                onChange={handleChange}
                className="w-full glass-input"
              >
                {ANIMALS.map((a) => (
                  <option key={a} value={a} className="bg-obsidian-900">
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Threat */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Estimated Hazard Level</label>
              <select
                name="threatEstimate"
                value={formData.threatEstimate}
                onChange={handleChange}
                className="w-full glass-input"
              >
                <option value="CRITICAL" className="bg-obsidian-900">Critical (Immediate danger)</option>
                <option value="HIGH" className="bg-obsidian-900">High (Near crops / homes)</option>
                <option value="MEDIUM" className="bg-obsidian-900">Medium (Buffer zone track)</option>
                <option value="LOW" className="bg-obsidian-900">Low (Distanced in forest)</option>
              </select>
            </div>
          </div>

          {/* Location Landmark */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Location / Nearby Landmark</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                placeholder="e.g. Mangala School dirt track near water tank"
                required
                className="w-full glass-input pl-10 text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Detailed Description of Movement</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Heard trumpeting and saw herd of 3 elephants crossing irrigation ditch towards western teak grove."
              rows={3}
              required
              className="w-full glass-input text-xs"
            />
          </div>

          {/* Photo URL (Optional) */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Photo URL (Optional)</label>
            <div className="relative">
              <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/wildlife-photo.jpg"
                className="w-full glass-input pl-10 text-xs"
              />
            </div>
          </div>

          {/* Reporter info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-forest-800">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Reporter Name</label>
              <input
                type="text"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full glass-input text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Contact Phone Number</label>
              <input
                type="tel"
                name="reporterPhone"
                value={formData.reporterPhone}
                onChange={handleChange}
                placeholder="+91 94480 00000"
                className="w-full glass-input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm mt-4"
          >
            {loading ? 'Submitting Sighting Report...' : 'Submit Report for Ranger Review'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReportSightingPage;
