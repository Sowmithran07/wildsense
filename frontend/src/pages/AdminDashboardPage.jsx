import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Flame,
  Activity,
  Cpu,
  CheckCircle2,
  MapPin,
  Camera,
  Play,
  ArrowRight,
  TrendingUp,
  Shield,
  Eye,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useSimulation } from '../context/SimulationContext';
import ThreatBadge from '../components/common/ThreatBadge';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';

const THREAT_PIE_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#10b981',
};

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, liveTelemetry } = useSocket();
  const { isSimulating, toggleSimulation, triggerManualIntrusion } = useSimulation();

  const fetchDashboardData = async () => {
    try {
      const [dashRes, trendRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/trends?timeframe=7days'),
      ]);
      if (dashRes.success) setStats(dashRes);
      if (trendRes.success) setTrends(trendRes);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return <Loader message="Aggregating Forest Intelligence & IoT Telemetry..." />;
  }

  const {
    activeAlerts = 0,
    criticalAlerts = 0,
    detectedToday = 0,
    activeSensors = 0,
    totalSensors = 10,
    resolvedIncidents = 0,
    sensorHealthPercentage = 95,
  } = stats?.stats || {};

  const recentAlerts = stats?.recentAlerts || [];
  const topDangerZones = stats?.topDangerZones || [];

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Simulation Trigger Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Command & Control Center
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE OPS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry and AI detection stream for Bandipur Wildlife Sanctuary Buffer
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => triggerManualIntrusion('Elephant')}
            className="btn-secondary py-2 px-3 text-xs"
            title="Inject test Elephant detection"
          >
            <span>🐘 Test Elephant Alert</span>
          </button>
          <button
            onClick={() => triggerManualIntrusion('Tiger')}
            className="btn-danger py-2 px-3 text-xs"
            title="Inject test Tiger detection"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>🐅 Test Tiger Alert</span>
          </button>
          <Link to="/map" className="btn-primary py-2 px-3 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Open GIS Map</span>
          </Link>
        </div>
      </div>

      {/* OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Active Alerts */}
        <div className="glass-card-hover rounded-2xl p-5 border border-forest-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Active Alerts
            </span>
            <div className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white font-mono">{activeAlerts}</span>
            <p className="text-xs text-red-400 mt-1 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {criticalAlerts} Critical Threat{criticalAlerts !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Card 2: Detected Today */}
        <div className="glass-card-hover rounded-2xl p-5 border border-forest-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Animals Today
            </span>
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white font-mono">{detectedToday}</span>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              AI Verified Incursions
            </p>
          </div>
        </div>

        {/* Card 3: Active Sensors */}
        <div className="glass-card-hover rounded-2xl p-5 border border-forest-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Sensor Fleet
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white font-mono">
              {activeSensors}/{totalSensors}
            </span>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              {sensorHealthPercentage}% Fleet Online
            </p>
          </div>
        </div>

        {/* Card 4: Resolved Incidents */}
        <div className="glass-card-hover rounded-2xl p-5 border border-forest-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Resolved Incidents
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white font-mono">{resolvedIncidents}</span>
            <p className="text-xs text-cyan-300 mt-1">Zero Conflict Casualties</p>
          </div>
        </div>

        {/* Card 5: High Risk Zones */}
        <div className="glass-card-hover rounded-2xl p-5 border border-forest-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              High Risk Sectors
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-amber-400 font-mono">
              {topDangerZones.length}
            </span>
            <p className="text-xs text-slate-300 mt-1">Buffer Zones Monitored</p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Intrusion Trend (Area Chart) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 sm:p-6 border border-forest-700/60 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-forest-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Wildlife Intrusion Frequency (Last 7 Days)</span>
              </h3>
              <p className="text-xs text-slate-400">Daily movement recorded across all sensor clusters</p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
              Details →
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends?.dailyIntrusions || []}>
                <defs>
                  <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="critColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c382f" />
                <XAxis dataKey="_id" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1c18',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total Detections"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#totalColor)"
                />
                <Area
                  type="monotone"
                  dataKey="critical"
                  name="Critical Threats"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#critColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Threat Level Distribution (Donut Chart) */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-forest-700/60 space-y-4 flex flex-col justify-between">
          <div className="pb-2 border-b border-forest-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Threat Level Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400">Proportional risk evaluation</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trends?.threatDistribution || []}
                  dataKey="count"
                  nameKey="threat"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {(trends?.threatDistribution || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={THREAT_PIE_COLORS[entry.threat] || '#10b981'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1c18',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-obsidian-900/60 border border-forest-800 text-[11px] text-slate-300 text-center font-mono">
            Calibrated against Human-Wildlife Conflict thresholds
          </div>
        </div>
      </div>

      {/* LOWER SECTION: ACTIVE ALERTS & SPECIES BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Alerts Stream */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 sm:p-6 border border-forest-700/60 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-forest-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <h3 className="text-base font-bold text-slate-100">Live Intrusion Alert Feed</h3>
            </div>
            <Link to="/alerts" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
              Manage All ({activeAlerts}) →
            </Link>
          </div>

          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No active alerts recorded.</p>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="p-4 rounded-xl bg-obsidian-900/80 border border-forest-800 hover:border-forest-600 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    {alert.detection?.image ? (
                      <img
                        src={alert.detection.image}
                        alt={alert.animal}
                        className="w-12 h-12 rounded-lg object-cover border border-forest-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-forest-850 flex items-center justify-center text-emerald-400 shrink-0">
                        🐾
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{alert.animal}</span>
                        <ThreatBadge level={alert.threatLevel} size="xs" />
                        <StatusBadge status={alert.status} size="xs" />
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{alert.location}</span>
                        <span className="text-slate-500">•</span>
                        <span className="font-mono text-emerald-400">~{alert.distanceToVillageKm} km</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </span>
                    <Link
                      to={`/incidents`}
                      className="btn-outline py-1 px-3 text-xs"
                    >
                      <span>Action</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Most Detected Wildlife Species Bar Chart */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-forest-700/60 space-y-4">
          <div className="pb-2 border-b border-forest-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Camera className="w-4 h-4 text-teal-400" />
              <span>Species Incursion Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">Most frequently detected wildlife</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.animalDistribution || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1c382f" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="animal" type="category" stroke="#64748b" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1c18',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
