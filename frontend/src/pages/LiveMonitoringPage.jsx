import React, { useState, useEffect } from 'react';
import {
  Radio,
  Battery,
  Wifi,
  Thermometer,
  Cpu,
  RefreshCw,
  Play,
  Square,
  AlertTriangle,
  Sun,
  Shield,
  Activity,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useSimulation } from '../context/SimulationContext';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const LiveMonitoringPage = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { liveTelemetry } = useSocket();
  const { isSimulating, toggleSimulation, triggerManualIntrusion } = useSimulation();

  const fetchSensors = async () => {
    try {
      const res = await api.get('/sensors');
      if (res.success) {
        setSensors(res.sensors);
      }
    } catch (err) {
      console.error('Failed to fetch sensors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  // Update sensor on live WebSocket telemetry
  useEffect(() => {
    if (liveTelemetry) {
      setSensors((prev) =>
        prev.map((s) => (s.sensorId === liveTelemetry.sensorId ? { ...s, ...liveTelemetry } : s))
      );
    }
  }, [liveTelemetry]);

  const filteredSensors = sensors.filter((s) => {
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    return true;
  });

  const getBatteryColor = (level) => {
    if (level > 60) return 'text-emerald-400';
    if (level > 25) return 'text-amber-400';
    return 'text-red-400 animate-pulse';
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Live Sensor Telemetry Grid
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              REAL-TIME MESH
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Distributed PIR, acoustic triangulation, and thermal imaging nodes along reserve boundary
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleSimulation()}
            className={`btn-secondary py-2 px-3.5 text-xs ${
              isSimulating ? 'border-amber-500 text-amber-300' : ''
            }`}
          >
            {isSimulating ? <Square className="w-3.5 h-3.5 fill-amber-400" /> : <Play className="w-3.5 h-3.5 fill-emerald-400" />}
            <span>{isSimulating ? 'Pause Simulation' : 'Run Simulation'}</span>
          </button>
          <button
            onClick={() => {
              setLoading(true);
              fetchSensors();
            }}
            className="btn-outline py-2 px-3 text-xs"
            title="Refresh sensor data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-forest-700/60">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Filter Nodes:
          </span>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="glass-input py-1.5 px-3 text-xs"
          >
            <option value="all" className="bg-obsidian-900">All Sensor Types</option>
            <option value="PIR Motion Sensor" className="bg-obsidian-900">PIR Motion</option>
            <option value="Thermal Camera" className="bg-obsidian-900">Thermal Camera</option>
            <option value="Optical Camera" className="bg-obsidian-900">Optical Camera</option>
            <option value="Acoustic Sensor" className="bg-obsidian-900">Acoustic Sensor</option>
            <option value="Seismic Sensor" className="bg-obsidian-900">Seismic Footstep Array</option>
            <option value="GPS Module" className="bg-obsidian-900">GPS Gateway</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass-input py-1.5 px-3 text-xs"
          >
            <option value="all" className="bg-obsidian-900">All Operational Statuses</option>
            <option value="active" className="bg-obsidian-900">🟢 Active</option>
            <option value="warning" className="bg-obsidian-900">🟡 Warning</option>
            <option value="offline" className="bg-obsidian-900">🔴 Offline</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <span className="font-bold text-white">{filteredSensors.length}</span> of{' '}
          <span className="font-bold text-white">{sensors.length}</span> nodes
        </div>
      </div>

      {/* SENSOR GRID */}
      {loading ? (
        <Loader message="Querying Distributed Hardware Nodes..." />
      ) : filteredSensors.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="No Sensor Nodes Found"
          description="No sensors match your active type and status filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSensors.map((sensor) => (
            <div
              key={sensor._id || sensor.sensorId}
              className="glass-card-hover rounded-2xl p-5 border border-forest-700/60 flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              {/* Top Header: ID & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-forest-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold border border-forest-700">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                      {sensor.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">{sensor.sensorId}</span>
                  </div>
                </div>
                <StatusBadge status={sensor.status} size="xs" />
              </div>

              {/* Location & Type info */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center justify-between">
                  <span className="text-slate-400">Sensor Model:</span>
                  <span className="font-semibold text-emerald-300">{sensor.type}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-400">Location Sector:</span>
                  <span className="font-medium text-slate-200 truncate max-w-[180px]">{sensor.locationName}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    {sensor.latitude.toFixed(4)}°N, {sensor.longitude.toFixed(4)}°E
                  </span>
                </p>
              </div>

              {/* Hardware Telemetry Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-obsidian-900/80 border border-forest-800/80 text-center text-xs font-mono">
                {/* Battery Gauge */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-slate-400">
                    <Battery className={`w-3.5 h-3.5 ${getBatteryColor(sensor.batteryLevel)}`} />
                    <span className="text-[10px]">POWER</span>
                  </div>
                  <span className={`font-bold ${getBatteryColor(sensor.batteryLevel)}`}>
                    {sensor.batteryLevel}%
                  </span>
                </div>

                {/* Signal Strength */}
                <div className="space-y-1 border-x border-forest-800">
                  <div className="flex items-center justify-center gap-1 text-slate-400">
                    <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px]">SIGNAL</span>
                  </div>
                  <span className="font-bold text-cyan-300">{sensor.signalStrength}%</span>
                </div>

                {/* Temperature */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-slate-400">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px]">TEMP</span>
                  </div>
                  <span className="font-bold text-amber-300">{sensor.temperature || 26.5}°C</span>
                </div>
              </div>

              {/* Footer status */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-forest-800/60 font-mono">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{sensor.solarCharging ? 'Solar Charging' : 'Battery Only'}</span>
                </div>
                <span>Active: {new Date(sensor.lastActive || Date.now()).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMonitoringPage;
