import React, { useState, useEffect } from 'react';
import { MapPin, Radio, Layers, RefreshCw, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import { api } from '../services/api';
import WildlifeMap from '../components/map/WildlifeMap';
import Loader from '../components/common/Loader';

export const MapPage = () => {
  const [sensors, setSensors] = useState([]);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMapData = async () => {
    try {
      const [sensorRes, detRes] = await Promise.all([
        api.get('/sensors'),
        api.get('/detections?limit=40'),
      ]);
      if (sensorRes.success) setSensors(sensorRes.sensors);
      if (detRes.success) setDetections(detRes.detections);
    } catch (err) {
      console.error('Failed to load map data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Interactive GIS Threat Map
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              LIVE TELEMETRY GIS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time geospatial visualization of animal incursions, buffer zones, and distributed sensor nodes
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            fetchMapData();
          }}
          className="btn-outline py-2 px-3.5 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh GPS Feeds</span>
        </button>
      </div>

      {/* Map Stats Pill */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl glass-card text-center border border-forest-700/60">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Monitored Sensors</span>
          <span className="text-xl font-black text-emerald-400 font-mono">{sensors.length}</span>
        </div>
        <div className="p-3 rounded-2xl glass-card text-center border border-forest-700/60">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Detections</span>
          <span className="text-xl font-black text-cyan-400 font-mono">{detections.length}</span>
        </div>
        <div className="p-3 rounded-2xl glass-card text-center border border-forest-700/60">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Critical Sectors</span>
          <span className="text-xl font-black text-red-400 font-mono">
            {detections.filter((d) => d.threatLevel === 'CRITICAL').length}
          </span>
        </div>
        <div className="p-3 rounded-2xl glass-card text-center border border-forest-700/60">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Protected Villages</span>
          <span className="text-xl font-black text-amber-400 font-mono">4 Sectors</span>
        </div>
      </div>

      {/* Interactive Map Component */}
      {loading ? (
        <Loader message="Rendering GIS Spatial Coordinates..." />
      ) : (
        <WildlifeMap
          sensors={sensors}
          detections={detections}
          height="h-[680px]"
        />
      )}
    </div>
  );
};

export default MapPage;
