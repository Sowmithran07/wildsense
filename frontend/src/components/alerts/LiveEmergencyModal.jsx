import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Flame,
  MapPin,
  Clock,
  Radio,
  CheckCircle,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import ThreatBadge from '../common/ThreatBadge';

export const LiveEmergencyModal = () => {
  const { activeEmergencyAlert, dismissEmergencyAlert, isAudioMuted, toggleMute } = useSocket();
  const navigate = useNavigate();

  if (!activeEmergencyAlert) return null;

  const {
    animal = 'Wildlife',
    threatLevel = 'HIGH',
    location = 'Perimeter Sector',
    distanceToVillageKm = 1.2,
    detection,
    alertId,
  } = activeEmergencyAlert;

  const handleViewLocation = () => {
    dismissEmergencyAlert();
    navigate('/map');
  };

  const handleAcknowledge = () => {
    dismissEmergencyAlert();
    navigate('/alerts');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Pulsing Backdrop */}
      <div
        className="fixed inset-0 bg-red-950/70 backdrop-blur-md animate-pulse-slow transition-opacity"
        onClick={dismissEmergencyAlert}
      />

      {/* Emergency Modal Card */}
      <div className="relative w-full max-w-lg glass-card-danger rounded-3xl p-6 sm:p-8 border-2 border-red-500/80 shadow-2xl shadow-red-950/90 z-10 my-8 overflow-hidden transform animate-bounce-subtle">
        {/* Top Radar Ring Animation */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-red-500/20 radar-ring pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-red-500/30 mb-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/30 border border-red-400/50 flex items-center justify-center text-red-300 shadow-lg shadow-red-500/40 animate-pulse">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">
                EMERGENCY PRIORITY BROADCAST
              </span>
              <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                WILDLIFE INTRUSION DETECTED
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 hover:text-white transition-colors"
              title={isAudioMuted ? 'Unmute Siren' : 'Mute Siren'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={dismissEmergencyAlert}
              className="p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="space-y-4">
          {/* Image & Animal details */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-obsidian-950/80 border border-red-500/30">
            {detection?.image ? (
              <img
                src={detection.image}
                alt={animal}
                className="w-20 h-20 rounded-xl object-cover border border-red-500/40 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="w-10 h-10" />
              </div>
            )}
            <div className="space-y-1.5 overflow-hidden">
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-black text-white">{animal}</h4>
                <ThreatBadge level={threatLevel} size="sm" />
              </div>
              <p className="text-xs text-red-300/90 font-mono">
                AI Confidence: <span className="font-bold text-white">{detection?.confidence || 94}%</span>
              </p>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate">{location}</span>
              </p>
            </div>
          </div>

          {/* Critical Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-obsidian-900/80 border border-red-500/25 text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Distance to Village
              </span>
              <span className="text-lg font-black text-red-400 font-mono">
                {distanceToVillageKm} km
              </span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-900/80 border border-red-500/25 text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Detection Time
              </span>
              <span className="text-sm font-bold text-slate-200 font-mono flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Action guidance */}
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-xs text-red-200/90 leading-relaxed">
            <span className="font-bold text-red-300">Immediate Protocol:</span> Strobe light & ultrasonic deterrence actuated. Nearby farming zones notified via SMS.
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleViewLocation}
              className="btn-secondary w-full border-red-500/40 text-red-300 hover:text-white hover:bg-red-950/60"
            >
              <MapPin className="w-4 h-4" />
              <span>View On GIS Map</span>
            </button>
            <button
              onClick={handleAcknowledge}
              className="btn-danger w-full justify-center"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Acknowledge Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveEmergencyModal;
