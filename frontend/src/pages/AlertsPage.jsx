import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Flame,
  CheckCircle,
  Clock,
  MapPin,
  UserCheck,
  UserPlus,
  Shield,
  Search,
  Filter,
  CheckCheck,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ThreatBadge from '../components/common/ThreatBadge';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [threatFilter, setThreatFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const { isOfficer, isAdmin } = useAuth();
  const { liveIncidents } = useSocket();

  const fetchAlertsAndOfficers = async () => {
    try {
      const [alertRes, officerRes] = await Promise.all([
        api.get('/alerts?limit=100'),
        api.get('/auth/officers'),
      ]);
      if (alertRes.success) setAlerts(alertRes.alerts);
      if (officerRes.success) {
        setOfficers(officerRes.officers);
        if (officerRes.officers.length > 0) setSelectedOfficerId(officerRes.officers[0]._id);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsAndOfficers();
  }, []);

  const handleAcknowledge = async (alertId) => {
    try {
      const res = await api.put(`/alerts/${alertId}/status`, {
        status: 'acknowledged',
        actionNotes: 'Alert acknowledged by duty officer.',
      });
      if (res.success) {
        fetchAlertsAndOfficers();
      }
    } catch (err) {
      alert(err.message || 'Failed to acknowledge alert');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlert || !selectedOfficerId) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/alerts/${selectedAlert._id}/assign`, {
        officerId: selectedOfficerId,
        notes: actionNotes,
      });
      if (res.success) {
        setAssignModalOpen(false);
        setActionNotes('');
        fetchAlertsAndOfficers();
      }
    } catch (err) {
      alert(err.message || 'Failed to assign officer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlert) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/alerts/${selectedAlert._id}/status`, {
        status: 'resolved',
        actionNotes: actionNotes || 'Wildlife successfully contained and guided away.',
      });
      if (res.success) {
        setResolveModalOpen(false);
        setActionNotes('');
        fetchAlertsAndOfficers();
      }
    } catch (err) {
      alert(err.message || 'Failed to mark alert as resolved');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (threatFilter !== 'all' && a.threatLevel !== threatFilter) return false;
    if (
      search &&
      !a.animal.toLowerCase().includes(search.toLowerCase()) &&
      !a.location.toLowerCase().includes(search.toLowerCase()) &&
      !a.alertId.toLowerCase().includes(search.toLowerCase())
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
              Intrusion Alerts Command
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-red-500/15 text-red-400 border border-red-500/30">
              <Flame className="w-3.5 h-3.5" />
              DISPATCH MATRIX
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time hazard notifications, ranger assignment workflows, and containment logging
          </p>
        </div>

        <Link to="/map" className="btn-primary py-2 px-4 text-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span>View Alerts on GIS Map</span>
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
            placeholder="Search alerts by animal, location, ID..."
            className="w-full glass-input pl-10 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input py-1.5 px-3 text-xs"
          >
            <option value="all" className="bg-obsidian-900">All Alert Statuses</option>
            <option value="new" className="bg-obsidian-900">🔴 New / Unacknowledged</option>
            <option value="acknowledged" className="bg-obsidian-900">🟡 Acknowledged</option>
            <option value="in_progress" className="bg-obsidian-900">🔵 In Progress</option>
            <option value="resolved" className="bg-obsidian-900">🟢 Resolved</option>
          </select>

          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="glass-input py-1.5 px-3 text-xs"
          >
            <option value="all" className="bg-obsidian-900">All Threat Levels</option>
            <option value="CRITICAL" className="bg-obsidian-900">Critical Threats</option>
            <option value="HIGH" className="bg-obsidian-900">High Threats</option>
            <option value="MEDIUM" className="bg-obsidian-900">Medium Threats</option>
            <option value="LOW" className="bg-obsidian-900">Low Threats</option>
          </select>

          <span className="font-mono text-slate-400 text-xs pl-2">
            Showing <span className="text-white font-bold">{filteredAlerts.length}</span> alerts
          </span>
        </div>
      </div>

      {/* ALERTS CARDS GRID */}
      {loading ? (
        <Loader message="Synchronizing Live Alert Queues..." />
      ) : filteredAlerts.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No Alerts Found"
          description="There are currently no intrusion alerts matching the selected status or threat level."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlerts.map((alert) => (
            <div
              key={alert._id || alert.alertId}
              className={`glass-card-hover rounded-2xl p-5 border flex flex-col justify-between space-y-4 relative overflow-hidden group ${
                alert.threatLevel === 'CRITICAL' && alert.status === 'new'
                  ? 'border-red-500/70 shadow-lg shadow-red-500/10'
                  : 'border-forest-700/60'
              }`}
            >
              {/* Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-forest-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{alert.alertId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThreatBadge level={alert.threatLevel} size="xs" />
                  <StatusBadge status={alert.status} size="xs" />
                </div>
              </div>

              {/* Animal & Location */}
              <div className="flex items-center gap-4">
                {alert.detection?.image ? (
                  <img
                    src={alert.detection.image}
                    alt={alert.animal}
                    className="w-16 h-16 rounded-xl object-cover border border-forest-700 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-forest-850 flex items-center justify-center text-2xl shrink-0">
                    🐾
                  </div>
                )}

                <div className="space-y-1 overflow-hidden">
                  <h3 className="font-black text-lg text-white group-hover:text-emerald-300 transition-colors">
                    {alert.animal}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{alert.location}</span>
                  </p>
                  <p className="text-[11px] font-mono text-emerald-400">
                    Distance: ~{alert.distanceToVillageKm} km to settlement
                  </p>
                </div>
              </div>

              {/* Assigned Ranger Info */}
              <div className="p-3 rounded-xl bg-obsidian-900/80 border border-forest-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                    Assigned Ranger:
                  </span>
                  <span className="font-semibold text-slate-200">
                    {alert.assignedOfficer?.name || 'Unassigned'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-forest-850 font-mono">
                  <span>Detected:</span>
                  <span>{new Date(alert.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-forest-800">
                {alert.status === 'new' && (isOfficer || isAdmin) && (
                  <button
                    onClick={() => handleAcknowledge(alert._id)}
                    className="btn-secondary py-1.5 px-3 text-xs flex-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Acknowledge</span>
                  </button>
                )}

                {(isOfficer || isAdmin) && alert.status !== 'resolved' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setAssignModalOpen(true);
                      }}
                      className="btn-outline py-1.5 px-2.5 text-xs"
                      title="Assign Officer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Assign</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setResolveModalOpen(true);
                      }}
                      className="btn-primary py-1.5 px-3 text-xs"
                      title="Mark as resolved"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  </>
                )}

                <Link
                  to="/incidents"
                  className="btn-outline py-1.5 px-2.5 text-xs text-slate-400 hover:text-white"
                  title="View Incident Dossier"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ASSIGN OFFICER MODAL */}
      {assignModalOpen && selectedAlert && (
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title={`Assign Ranger to Alert: ${selectedAlert.alertId}`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Select Available Forest Officer / Ranger
              </label>
              <select
                value={selectedOfficerId}
                onChange={(e) => setSelectedOfficerId(e.target.value)}
                className="w-full glass-input"
              >
                {officers.map((off) => (
                  <option key={off._id} value={off._id} className="bg-obsidian-900">
                    {off.name} ({off.badgeNumber || off.role}) - {off.assignedZone || 'Buffer Zone'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Dispatch Instructions / Response Notes
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="e.g. Deploy vehicle sirens along Mangala tractor road to divert elephant herd."
                rows={3}
                className="w-full glass-input"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="btn-primary"
              >
                {actionLoading ? 'Assigning...' : 'Dispatch Ranger'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MARK RESOLVED MODAL */}
      {resolveModalOpen && selectedAlert && (
        <Modal
          isOpen={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          title={`Resolve Incident: ${selectedAlert.animal} at ${selectedAlert.location}`}
        >
          <form onSubmit={handleResolveSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Resolution & Containment Summary
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="e.g. Ultrasonic acoustic strobe activated. Animal safely returned to core reserve with zero damages."
                rows={4}
                required
                className="w-full glass-input"
              />
            </div>

            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
              Marking this resolved will update the linked incident timeline and log the resolution time for departmental audit metrics.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResolveModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="btn-primary"
              >
                {actionLoading ? 'Saving...' : 'Confirm Resolution'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AlertsPage;
