import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Shield,
  UserCheck,
  Camera,
  Activity,
  Plus,
  CheckCircle,
  FileSpreadsheet,
  Cpu,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ThreatBadge from '../components/common/ThreatBadge';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const IncidentDetailsPage = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState('resolved');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [resolving, setResolving] = useState(false);

  const { isOfficer, isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchIncident = async () => {
    try {
      const res = await api.get(`/incidents/${id}`);
      if (res.success) {
        setIncident(res.incident);
        setResolutionSummary(res.incident.resolutionSummary || '');
      }
    } catch (err) {
      console.error('Failed to load incident dossier:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await api.post(`/incidents/${id}/notes`, { note: newNote });
      if (res.success) {
        setNewNote('');
        fetchIncident();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit response note');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setResolving(true);
    try {
      const res = await api.put(`/incidents/${id}`, {
        status: resolutionStatus,
        resolutionSummary,
        note: `Status updated to ${resolutionStatus.toUpperCase()}: ${resolutionSummary}`,
      });
      if (res.success) {
        fetchIncident();
      }
    } catch (err) {
      alert(err.message || 'Failed to update incident');
    } finally {
      setResolving(false);
    }
  };

  if (loading) return <Loader message="Compiling Incident Dossier..." />;
  if (!incident) return <EmptyState title="Incident Not Found" description="The requested incident file could not be found." />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back Button & Header */}
      <div className="space-y-4">
        <Link
          to="/incidents"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Incident Log</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-forest-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                {incident.incidentId}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {incident.animal} Intrusion Dossier
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sector: {incident.location} ({incident.latitude?.toFixed(4)}°N, {incident.longitude?.toFixed(4)}°E)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThreatBadge level={incident.threatLevel} size="md" />
            <StatusBadge status={incident.status} size="md" />
          </div>
        </div>
      </div>

      {/* 2-Column Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Animal Photo & Sensor Telemetry */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden border border-forest-700/60 p-4 space-y-4">
            {incident.detection?.image ? (
              <img
                src={incident.detection.image}
                alt={incident.animal}
                className="w-full h-56 rounded-xl object-cover border border-forest-700 shadow-xl"
              />
            ) : (
              <div className="w-full h-56 rounded-xl bg-forest-900 flex items-center justify-center text-5xl">🐾</div>
            )}

            <div className="space-y-2 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-forest-800">
                <span className="text-slate-400">Species Classified:</span>
                <span className="font-bold text-white">{incident.animal}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-forest-800">
                <span className="text-slate-400">AI Confidence:</span>
                <span className="font-bold text-emerald-400 font-mono">{incident.detection?.confidence || 94}%</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-forest-800">
                <span className="text-slate-400">Distance to Settlement:</span>
                <span className="font-bold text-amber-400 font-mono">~{incident.detection?.distanceToVillageKm || 1.2} km</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-forest-800">
                <span className="text-slate-400">Lead Ranger:</span>
                <span className="font-semibold text-slate-200">{incident.assignedOfficer?.name || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Logged At:</span>
                <span className="font-mono text-slate-300">{new Date(incident.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Incident Resolution Updater */}
          {(isOfficer || isAdmin) && incident.status !== 'resolved' && (
            <div className="glass-card rounded-2xl p-5 border border-forest-700/60 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Update Incident Status</span>
              </h3>

              <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={resolutionStatus}
                    onChange={(e) => setResolutionStatus(e.target.value)}
                    className="w-full glass-input"
                  >
                    <option value="investigating" className="bg-obsidian-900">Investigating</option>
                    <option value="contained" className="bg-obsidian-900">Contained</option>
                    <option value="resolved" className="bg-obsidian-900">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Resolution Summary</label>
                  <textarea
                    value={resolutionSummary}
                    onChange={(e) => setResolutionSummary(e.target.value)}
                    placeholder="Describe how animal was guided away or contained..."
                    rows={3}
                    className="w-full glass-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resolving}
                  className="btn-primary w-full py-2 text-xs"
                >
                  {resolving ? 'Updating...' : 'Save Incident Status'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Col: Timeline & Field Ranger Response Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Timeline */}
          <div className="glass-card rounded-2xl p-6 border border-forest-700/60 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-forest-800">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Containment Action Timeline</span>
            </h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-forest-800">
              {incident.actionTimeline?.map((t, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-8">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-obsidian-950 shadow-md"></div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-100">{t.title}</span>
                      <span className="text-[10px] font-mono text-emerald-400/80">({t.user})</span>
                    </div>
                    {t.description && <p className="text-xs text-slate-400">{t.description}</p>}
                    <span className="text-[10px] font-mono text-slate-500 block">
                      {new Date(t.timestamp).toLocaleTimeString()} • {new Date(t.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field Response Notes */}
          <div className="glass-card rounded-2xl p-6 border border-forest-700/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-forest-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Ranger Field Response Notes ({incident.responseNotes?.length || 0})</span>
              </h3>
            </div>

            {/* Notes list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {incident.responseNotes?.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No field notes logged yet.</p>
              ) : (
                incident.responseNotes?.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-obsidian-900/80 border border-forest-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300">{note.officerName}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(note.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{note.note}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add note form */}
            {(isOfficer || isAdmin) && (
              <form onSubmit={handleAddNote} className="space-y-3 pt-3 border-t border-forest-800">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Append field ranger observation or containment progress note..."
                  rows={2}
                  className="w-full glass-input text-xs"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingNote || !newNote.trim()}
                    className="btn-secondary py-1.5 px-4 text-xs"
                  >
                    {submittingNote ? 'Saving...' : 'Post Field Note'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailsPage;
