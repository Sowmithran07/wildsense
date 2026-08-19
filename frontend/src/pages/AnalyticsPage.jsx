import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  MapPin,
  Camera,
  Calendar,
  Flame,
  Shield,
  Layers,
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
import Loader from '../components/common/Loader';

const PIE_COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444', '#06b6d4', '#8b5cf6'];

export const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('7days');
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/trends?timeframe=${timeframe}`);
      if (res.success) {
        setTrends(res);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [timeframe]);

  return (
    <div className="space-y-8">
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Wildlife Spatial & Temporal Analytics
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <BarChart3 className="w-3.5 h-3.5" />
              INTELLIGENCE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical intrusion patterns, peak nocturnal incursion hours, and species corridor hotspots
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-forest-900 border border-forest-800 text-xs font-semibold">
          <button
            onClick={() => setTimeframe('today')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'today'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe('7days')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === '7days'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('30days')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === '30days'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {loading && !trends ? (
        <Loader message="Aggregating Corridor Intelligence Metrics..." />
      ) : (
        <div className="space-y-6">
          {/* Chart Row 1: Daily Intrusions & Hourly Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Trend */}
            <div className="glass-card rounded-2xl p-6 border border-forest-700/60 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-forest-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Intrusion Frequency Timeline</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">{timeframe.toUpperCase()}</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends?.dailyIntrusions || []}>
                    <defs>
                      <linearGradient id="anmColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c382f" />
                    <XAxis dataKey="_id" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f1c18',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Total Detections"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#anmColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hourly Nocturnal Activity */}
            <div className="glass-card rounded-2xl p-6 border border-forest-700/60 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-forest-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Peak Incursion Hours (24h Distribution)</span>
                </h3>
                <span className="text-[11px] font-mono text-amber-400">Peak: 20:00 - 04:00</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends?.hourlyActivity || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c382f" />
                    <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f1c18',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart Row 2: Location Hotspots & Species Incursions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Hotspots */}
            <div className="glass-card rounded-2xl p-6 border border-forest-700/60 space-y-4">
              <div className="pb-2 border-b border-forest-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Corridor Hotspots by Sector</span>
                </h3>
                <p className="text-xs text-slate-400">Areas with highest recorded wildlife crossings</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends?.locationDistribution || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c382f" />
                    <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="location" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f1c18',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#06b6d4" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Species Pie Chart */}
            <div className="glass-card rounded-2xl p-6 border border-forest-700/60 space-y-4">
              <div className="pb-2 border-b border-forest-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-teal-400" />
                  <span>Wildlife Species Breakdown</span>
                </h3>
                <p className="text-xs text-slate-400">Proportional classification of animals</p>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trends?.animalDistribution || []}
                      dataKey="count"
                      nameKey="animal"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {(trends?.animalDistribution || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
