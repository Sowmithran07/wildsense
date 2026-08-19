import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  AlertTriangle,
  MapPin,
  Clock,
  PhoneCall,
  FilePlus,
  Radio,
  Eye,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ThreatBadge from '../components/common/ThreatBadge';
import Loader from '../components/common/Loader';

export const ResidentDashboardPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isConnected } = useSocket();

  const userLocation = user?.location?.name || 'Mangala Village';

  const fetchNearbyAlerts = async () => {
    try {
      const res = await api.get('/alerts?limit=15');
      if (res.success) {
        setAlerts(res.alerts);
      }
    } catch (err) {
      console.error('Failed to load resident alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyAlerts();
  }, []);

  const activeCriticalAlerts = alerts.filter(
    (a) => (a.threatLevel === 'CRITICAL' || a.threatLevel === 'HIGH') && a.status !== 'resolved'
  );

  const isHighDanger = activeCriticalAlerts.length > 0;
  const nearestAlert = activeCriticalAlerts[0] || alerts[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Resident Community Safety Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time proximity warnings and emergency guidelines for{' '}
            <span className="font-bold text-emerald-400">{userLocation}</span>
          </p>
        </div>

        <Link to="/report-sighting" className="btn-primary py-2.5 px-4 text-xs">
          <FilePlus className="w-4 h-4" />
          <span>Report Animal Sighting</span>
        </Link>
      </div>

      {/* DYNAMIC SAFETY STATUS BANNER */}
      {isHighDanger ? (
        <div className="glass-card-danger rounded-3xl p-6 sm:p-8 border-2 border-red-500/80 shadow-2xl relative overflow-hidden animate-pulse-slow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/30 border border-red-400/50 flex items-center justify-center text-red-300 shrink-0">
                <ShieldAlert className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                  HIGH ALERT PROXIMITY ADVISORY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  🚨 {nearestAlert?.animal || 'Wildlife'} Activity Detected Nearby
                </h2>
                <p className="text-xs sm:text-sm text-red-200/90 leading-relaxed">
                  Wildlife spotted near <span className="font-bold text-white">{nearestAlert?.location}</span> (~{nearestAlert?.distanceToVillageKm} km from village border). Forest squad deployed.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <Link to="/map" className="btn-secondary w-full sm:w-auto border-red-500/40 text-red-200 hover:text-white">
                View on Map
              </Link>
              <a
                href="tel:1800425555"
                className="btn-danger w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Ranger SOS: 1800-425</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-xl relative overflow-hidden bg-gradient-to-r from-emerald-950/40 to-obsidian-900/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  SAFE STATUS
                </span>
                <h2 className="text-2xl font-black text-white">
                  🟢 Sector Clear — No Immediate Threat
                </h2>
                <p className="text-xs text-slate-300">
                  No dangerous wildlife movement detected within immediate perimeter of {userLocation}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Sensors Active</span>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column: Nearby Active Alerts & Safety Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Nearby Recent Alerts */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 sm:p-6 border border-forest-700/60 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-forest-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">Recent Wildlife Activity in Sector</h3>
            </div>
            <Link to="/alerts" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
              All Alerts →
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading Sector Activity..." />
          ) : alerts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No recent intrusions logged.</p>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert._id}
                  className="p-4 rounded-xl bg-obsidian-900/80 border border-forest-800 hover:border-forest-700 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {alert.detection?.image ? (
                      <img
                        src={alert.detection.image}
                        alt={alert.animal}
                        className="w-12 h-12 rounded-lg object-cover border border-forest-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-forest-850 flex items-center justify-center text-xs">🐾</div>
                    )}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{alert.animal}</span>
                        <ThreatBadge level={alert.threatLevel} size="xs" />
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{alert.location}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">~{alert.distanceToVillageKm} km away</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Resident Safety Protocol Guide */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-forest-700/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-forest-800">
            <Info className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Emergency Safety Protocols</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800 space-y-1">
              <p className="font-bold text-amber-300">🐘 Elephant Intrusion:</p>
              <p className="text-slate-300 leading-relaxed">
                Stay indoors. Do not flash direct torch beams at eyes. Turn on exterior property lights and avoid single-file agricultural pathways.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800 space-y-1">
              <p className="font-bold text-red-300">🐅 Tiger / Leopard Sighting:</p>
              <p className="text-slate-300 leading-relaxed">
                Keep domestic animals and cattle securely locked inside sheds. Never bend or squat in high grasses. Travel in groups of 3+ making vocal sounds.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800 space-y-1">
              <p className="font-bold text-teal-300">🐗 Wild Boar Movement:</p>
              <p className="text-slate-300 leading-relaxed">
                Check perimeter fence solar buzzers. Do not approach cornered animals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboardPage;
