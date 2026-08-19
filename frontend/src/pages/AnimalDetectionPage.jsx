import React, { useState, useEffect } from 'react';
import {
  Camera,
  Search,
  Filter,
  Plus,
  Radio,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Flame,
  Activity,
  Cpu,
} from 'lucide-react';
import { api } from '../services/api';
import { ANIMALS } from '../utils/constants';
import ThreatBadge from '../components/common/ThreatBadge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const AnimalDetectionPage = () => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animalFilter, setAnimalFilter] = useState('all');
  const [threatFilter, setThreatFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [ingestForm, setIngestForm] = useState({
    animal: 'Elephant',
    soundLevel: 75,
    distanceToVillageKm: 1.1,
  });
  const [ingesting, setIngesting] = useState(false);

  const fetchDetections = async () => {
    try {
      const res = await api.get('/detections?limit=60');
      if (res.success) {
        setDetections(res.detections);
      }
    } catch (err) {
      console.error('Failed to load detections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetections();
  }, []);

  const handleIngestSubmit = async (e) => {
    e.preventDefault();
    setIngesting(true);
    try {
      const res = await api.post('/detections', ingestForm);
      if (res.success) {
        setShowIngestModal(false);
        fetchDetections();
      }
    } catch (err) {
      alert(err.message || 'Failed to ingest detection');
    } finally {
      setIngesting(false);
    }
  };

  const filteredDetections = detections.filter((d) => {
    if (animalFilter !== 'all' && d.animal !== animalFilter) return false;
    if (threatFilter !== 'all' && d.threatLevel !== threatFilter) return false;
    if (
      search &&
      !d.animal.toLowerCase().includes(search.toLowerCase()) &&
      !d.locationName.toLowerCase().includes(search.toLowerCase()) &&
      !d.detectionId.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Animal Detection Archive
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              YOLOv8 ENSEMBLE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Computer vision frames captured by optical and thermal camera traps across perimeter sectors
          </p>
        </div>

        {/* Action Trigger */}
        <button
          onClick={() => setShowIngestModal(true)}
          className="btn-primary py-2 px-4 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate Camera Trap Frame</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-forest-700/60">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search species, location, detection ID..."
            className="w-full glass-input pl-10 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <select
            value={animalFilter}
            onChange={(e) => setAnimalFilter(e.target.value)}
            className="glass-input py-1.5 px-3 text-xs"
          >
            <option value="all" className="bg-obsidian-900">All Species</option>
            {ANIMALS.map((a) => (
              <option key={a} value={a} className="bg-obsidian-900">
                {a}
              </option>
            ))}
          </select>

          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="glass-input py-1.5 px-3 text-xs"
          >
            <option value="all" className="bg-obsidian-900">All Threat Levels</option>
            <option value="CRITICAL" className="bg-obsidian-900">🔴 Critical</option>
            <option value="HIGH" className="bg-obsidian-900">🟠 High</option>
            <option value="MEDIUM" className="bg-obsidian-900">🟡 Medium</option>
            <option value="LOW" className="bg-obsidian-900">🟢 Low</option>
          </select>

          <span className="font-mono text-slate-400 text-xs pl-2">
            Showing <span className="text-white font-bold">{filteredDetections.length}</span> records
          </span>
        </div>
      </div>

      {/* DETECTIONS GALLERY GRID */}
      {loading ? (
        <Loader message="Loading AI Wildlife Visual Stream..." />
      ) : filteredDetections.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="No Detections Found"
          description="No wildlife detections match the selected species and threat criteria."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDetections.map((item) => (
            <div
              key={item._id || item.detectionId}
              onClick={() => setSelectedDetection(item)}
              className="glass-card-hover rounded-2xl overflow-hidden border border-forest-700/60 flex flex-col justify-between group cursor-pointer"
            >
              {/* Image Container with Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-obsidian-900">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.animal}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🐾</div>
                )}

                <div className="absolute top-3 left-3">
                  <ThreatBadge level={item.threatLevel} size="xs" />
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-obsidian-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                  {item.confidence}% Confidence
                </div>

                <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-obsidian-950/75 backdrop-blur-md text-[11px] text-slate-200 flex items-center justify-between font-mono">
                  <span className="truncate">{item.sensorId}</span>
                  <span className="text-emerald-400">~{item.distanceToVillageKm}km</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {item.animal}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">{item.detectionId}</span>
                </div>

                <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.locationName}</span>
                </p>

                <div className="pt-2 border-t border-forest-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(item.detectedAt).toLocaleTimeString()}
                  </span>
                  <span className="text-slate-300">{new Date(item.detectedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedDetection && (
        <Modal
          isOpen={Boolean(selectedDetection)}
          onClose={() => setSelectedDetection(null)}
          title={`Wildlife Detection: ${selectedDetection.animal}`}
        >
          <div className="space-y-5">
            {selectedDetection.image && (
              <img
                src={selectedDetection.image}
                alt={selectedDetection.animal}
                className="w-full h-64 object-cover rounded-2xl border border-forest-700 shadow-xl"
              />
            )}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white">{selectedDetection.animal}</h3>
                <span className="text-xs font-mono text-slate-400">{selectedDetection.detectionId}</span>
              </div>
              <ThreatBadge level={selectedDetection.threatLevel} size="md" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-obsidian-900 border border-forest-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">AI Confidence</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">{selectedDetection.confidence}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Sensor Source</span>
                <span className="font-bold text-slate-200 font-mono">{selectedDetection.sensorId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Distance to Village</span>
                <span className="font-bold text-amber-400 font-mono">{selectedDetection.distanceToVillageKm} km</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Model Version</span>
                <span className="font-mono text-slate-300 truncate block">{selectedDetection.aiModelVersion}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Estimated Speed</span>
                <span className="font-bold text-slate-200 font-mono">{selectedDetection.movementSpeedKmH || 6.5} km/h</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Time Logged</span>
                <span className="font-mono text-slate-300">{new Date(selectedDetection.detectedAt).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-300">Geographic Location</span>
              <p className="text-xs text-slate-400">
                {selectedDetection.locationName} ({selectedDetection.latitude.toFixed(4)}°N, {selectedDetection.longitude.toFixed(4)}°E)
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* SIMULATE DETECTION MODAL */}
      {showIngestModal && (
        <Modal
          isOpen={showIngestModal}
          onClose={() => setShowIngestModal(false)}
          title="Simulate Camera Trap Ingestion"
        >
          <form onSubmit={handleIngestSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Species to Detect</label>
              <select
                value={ingestForm.animal}
                onChange={(e) => setIngestForm({ ...ingestForm, animal: e.target.value })}
                className="w-full glass-input"
              >
                {ANIMALS.map((a) => (
                  <option key={a} value={a} className="bg-obsidian-900">
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Sound Level (dB)</label>
                <input
                  type="number"
                  value={ingestForm.soundLevel}
                  onChange={(e) => setIngestForm({ ...ingestForm, soundLevel: Number(e.target.value) })}
                  className="w-full glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Distance to Village (km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={ingestForm.distanceToVillageKm}
                  onChange={(e) => setIngestForm({ ...ingestForm, distanceToVillageKm: Number(e.target.value) })}
                  className="w-full glass-input"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800 text-xs text-slate-400 leading-relaxed">
              This triggers the computer vision model pipeline, computes dynamic threat metrics, dispatches WebSocket alerts, and creates an incident record.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowIngestModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={ingesting}
                className="btn-primary"
              >
                {ingesting ? 'Processing AI...' : 'Ingest & Trigger Alert'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AnimalDetectionPage;
