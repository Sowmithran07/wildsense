import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM,
  FOREST_BOUNDARY_COORDS,
  VILLAGE_ZONES,
  THREAT_COLORS,
} from '../../utils/constants';
import ThreatBadge from '../common/ThreatBadge';
import StatusBadge from '../common/StatusBadge';
import { Layers, Eye, Shield, Radio, Flame, Cpu, MapPin } from 'lucide-react';

// Custom SVG Leaflet Icons
const createAnimalMarkerIcon = (threatLevel = 'MEDIUM', animal = 'Animal') => {
  const color = THREAT_COLORS[threatLevel]?.hex || '#f59e0b';
  const html = `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 rounded-full" style="background-color: ${color}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white font-bold text-xs" style="background-color: ${color}; color: #000;">
        🐾
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-animal-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const createSensorMarkerIcon = (status = 'active') => {
  const isOk = status === 'active';
  const color = isOk ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444';
  const html = `
    <div class="relative flex items-center justify-center">
      <div class="w-6 h-6 rounded-lg flex items-center justify-center shadow-md border border-white/80" style="background-color: #0f1c18; border-color: ${color}; color: ${color};">
        📡
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-sensor-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Component to dynamically re-center
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  if (center) map.setView(center, zoom);
  return null;
};

export const WildlifeMap = ({
  sensors = [],
  detections = [],
  height = 'h-[600px]',
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_ZOOM,
}) => {
  const [showSensors, setShowSensors] = useState(true);
  const [showDetections, setShowDetections] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showVillages, setShowVillages] = useState(true);

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden glass-card border border-forest-700/60 shadow-2xl`}>
      {/* Map Layer Filter Controls */}
      <div className="absolute top-4 right-4 z-[1000] glass-card rounded-2xl p-3 border border-forest-700/80 shadow-2xl space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-200 pb-1.5 border-b border-forest-800">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>GIS Map Layers</span>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showDetections}
              onChange={(e) => setShowDetections(e.target.checked)}
              className="rounded bg-obsidian-900 border-forest-700 text-emerald-500 focus:ring-0"
            />
            <span className="flex items-center gap-1.5">🐾 Animal Detections</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showSensors}
              onChange={(e) => setShowSensors(e.target.checked)}
              className="rounded bg-obsidian-900 border-forest-700 text-emerald-500 focus:ring-0"
            />
            <span className="flex items-center gap-1.5">📡 IoT Sensor Nodes</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showBoundaries}
              onChange={(e) => setShowBoundaries(e.target.checked)}
              className="rounded bg-obsidian-900 border-forest-700 text-emerald-500 focus:ring-0"
            />
            <span className="flex items-center gap-1.5">🌲 Reserve Perimeter</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showVillages}
              onChange={(e) => setShowVillages(e.target.checked)}
              className="rounded bg-obsidian-900 border-forest-700 text-emerald-500 focus:ring-0"
            />
            <span className="flex items-center gap-1.5">🏡 Village Buffers</span>
          </label>
        </div>
      </div>

      {/* Main Map */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeView center={center} zoom={zoom} />

        {/* Dark Matter CartoDB Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Forest Reserve Boundary Polygon */}
        {showBoundaries && (
          <Polygon
            positions={FOREST_BOUNDARY_COORDS}
            pathOptions={{
              color: '#10b981',
              fillColor: '#059669',
              fillOpacity: 0.12,
              weight: 2.5,
              dashArray: '6, 6',
            }}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <p className="font-bold text-emerald-400">Bandipur Tiger Reserve Core Boundary</p>
                <p className="text-slate-300">Protected Wildlife Conservation Sanctuary</p>
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Village Safe Buffer Zones */}
        {showVillages &&
          VILLAGE_ZONES.map((v, idx) => (
            <Circle
              key={idx}
              center={v.coords}
              radius={v.radiusMeters}
              pathOptions={{
                color: '#38bdf8',
                fillColor: '#0284c7',
                fillOpacity: 0.1,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-sky-400">{v.name}</p>
                  <p className="text-slate-300">Human Habitat Buffer Zone</p>
                  <p className="text-slate-400">Est. Population: {v.population}</p>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Sensor Markers */}
        {showSensors &&
          sensors.map((s) => (
            <Marker
              key={s._id || s.sensorId}
              position={[s.latitude, s.longitude]}
              icon={createSensorMarkerIcon(s.status)}
            >
              <Popup>
                <div className="text-xs space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between pb-1 border-b border-forest-800">
                    <span className="font-bold text-slate-100">{s.name}</span>
                    <StatusBadge status={s.status} size="xs" />
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <p><span className="text-slate-400">ID:</span> {s.sensorId}</p>
                    <p><span className="text-slate-400">Type:</span> {s.type}</p>
                    <p><span className="text-slate-400">Battery:</span> {s.batteryLevel}%</p>
                    <p><span className="text-slate-400">Signal:</span> {s.signalStrength}% ({s.connectivity})</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Animal Detection Markers */}
        {showDetections &&
          detections.map((d) => (
            <Marker
              key={d._id || d.detectionId}
              position={[d.latitude, d.longitude]}
              icon={createAnimalMarkerIcon(d.threatLevel, d.animal)}
            >
              <Popup>
                <div className="text-xs space-y-2 min-w-[220px]">
                  {d.image && (
                    <img
                      src={d.image}
                      alt={d.animal}
                      className="w-full h-24 rounded-lg object-cover border border-forest-700 mb-1"
                    />
                  )}
                  <div className="flex items-center justify-between pb-1 border-b border-forest-800">
                    <span className="font-bold text-base text-slate-100">{d.animal}</span>
                    <ThreatBadge level={d.threatLevel} size="xs" />
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <p><span className="text-slate-400">AI Confidence:</span> {d.confidence}%</p>
                    <p><span className="text-slate-400">Location:</span> {d.locationName}</p>
                    <p><span className="text-slate-400">Sensor:</span> {d.sensorId}</p>
                    <p><span className="text-slate-400">Time:</span> {new Date(d.detectedAt || d.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default WildlifeMap;
