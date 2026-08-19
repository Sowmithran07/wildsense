import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  CheckCircle,
  XCircle,
  FilePlus,
  MapPin,
  Clock,
  User,
  Shield,
  Search,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ThreatBadge from '../components/common/ThreatBadge';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const SightingsPage = () => {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [verifyAction, setVerifyAction] = useState('verified');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const { isOfficer, isAdmin } = useAuth();

  const fetchSightings = async () => {
    try {
      const res = await api.get('/sightings?limit=50');
      if (res.success) {
        setSightings(res.sightings);
      }
    } catch (err) {
      console.error('Failed to load sightings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSightings();
  }, []);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedSighting) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/sightings/${selectedSighting._id}/status`, {
        status: verifyAction,
        verificationNotes: notes || `Marked as ${verifyAction} by duty ranger squad.`,
      });
      if (res.success) {
        setVerifyModalOpen(false);
        setNotes('');
        fetchSightings();
      }
    } catch (err) {
      alert(err.message || 'Failed to update sighting status');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSightings = sightings.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (
      search &&
      !s.animal.toLowerCase().includes(search.toLowerCase()) &&
      !s.locationName.toLowerCase().includes(search.toLowerCase()) &&
      !s.reporterName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Community Wildlife Sightings
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <Eye className="w-3.5 h-3.5" />
              COMMUNITY CROWDSOURCING
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sightings reported by fringe village farmers and residents, verified by range officers
          </p>
        </div>

        <Link to="/report-sighting" className="btn-primary py-2 px-4 text-xs">
          <FilePlus className="w-4 h-4" />
          <span>Report Sighting</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-forest-700/60">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sightings by animal, location, reporter..."
            className="w-full glass-input pl-10 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input py-1.5 px-3 text-xs"
          >
            <option value="all" className="bg-obsidian-900">All Verification States</option>
            <option value="pending" className="bg-obsidian-900">🟡 Pending Review</option>
            <option value="verified" className="bg-obsidian-900">🟢 Verified</option>
            <option value="dismissed" className="bg-obsidian-900">⚪ Dismissed / Unconfirmed</option>
          </select>

          <span className="font-mono text-slate-400 text-xs pl-2">
            Showing <span className="text-white font-bold">{filteredSightings.length}</span> reports
          </span>
        </div>
      </div>

      {/* SIGHTINGS GRID */}
      {loading ? (
        <Loader message="Loading Community Wildlife Intel Feed..." />
      ) : filteredSightings.length === 0 ? (
        <EmptyState
          icon={Eye}
          title="No Sightings Recorded"
          description="There are currently no community reports matching your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSightings.map((s) => (
            <div
              key={s._id || s.sightingId}
              className="glass-card-hover rounded-2xl overflow-hidden border border-forest-700/60 flex flex-col justify-between"
            >
              {/* Image & Header */}
              <div className="relative h-44 w-full bg-obsidian-900 overflow-hidden">
                {s.image ? (
                  <img
                    src={s.image}
                    alt={s.animal}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🐾</div>
                )}
                <div className="absolute top-3 left-3">
                  <ThreatBadge level={s.threatEstimate} size="xs" />
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={s.status} size="xs" />
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg text-white">{s.animal}</h3>
                  <span className="text-[10px] font-mono text-slate-400">{s.sightingId}</span>
                </div>

                <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.locationName}</span>
                </p>

                <p className="text-xs text-slate-300 leading-relaxed bg-obsidian-900/60 p-3 rounded-xl border border-forest-850">
                  "{s.description}"
                </p>

                {/* Reporter & Verification info */}
                <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-forest-800 font-mono">
                  <div className="flex justify-between">
                    <span>Reported by:</span>
                    <span className="text-slate-200">{s.reporterName}</span>
                  </div>
                  {s.verifiedBy && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Verified by:</span>
                      <span>{s.verifiedBy.name || 'Forest Ranger'}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Time:</span>
                    <span>{new Date(s.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Verification Actions */}
                {(isOfficer || isAdmin) && s.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-forest-800">
                    <button
                      onClick={() => {
                        setSelectedSighting(s);
                        setVerifyAction('verified');
                        setVerifyModalOpen(true);
                      }}
                      className="btn-primary py-1.5 px-3 text-xs flex-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSighting(s);
                        setVerifyAction('dismissed');
                        setVerifyModalOpen(true);
                      }}
                      className="btn-outline py-1.5 px-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VERIFY / DISMISS MODAL */}
      {verifyModalOpen && selectedSighting && (
        <Modal
          isOpen={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          title={`${verifyAction === 'verified' ? 'Verify' : 'Dismiss'} Sighting: ${selectedSighting.animal}`}
        >
          <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold mb-1">Ranger Verification Comments</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Pugmarks confirmed along stream bank. Patrol dispatched."
                rows={3}
                className="w-full glass-input"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVerifyModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className={verifyAction === 'verified' ? 'btn-primary' : 'btn-danger'}
              >
                {actionLoading ? 'Saving...' : `Confirm ${verifyAction.toUpperCase()}`}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SightingsPage;
