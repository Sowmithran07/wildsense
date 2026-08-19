import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Volume2,
  Key,
  Shield,
  Save,
  CheckCircle2,
  Radio,
  Sliders,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { isAudioMuted, toggleMute } = useSocket();

  const [notificationPrefs, setNotificationPrefs] = useState({
    sms: true,
    email: true,
    push: true,
    soundSiren: !isAudioMuted,
  });

  const [alertRadiusKm, setAlertRadiusKm] = useState(3.5);
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const apiKey = 'ws_edge_live_9f83a0429188e7b10294c718a';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-forest-800">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            System & Notification Settings
          </h1>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Sliders className="w-3.5 h-3.5" />
            CONFIG
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure notification channels, emergency siren alerts, and IoT edge gateway integration keys
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-300 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>System configuration and notification preferences saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Notification Channels */}
        <div className="glass-card rounded-2xl p-6 border border-forest-700/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-forest-800">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Intrusion Alert Dispatch Channels</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-forest-800 cursor-pointer hover:border-forest-600 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-200">SMS Mobile Alerts</p>
                <p className="text-[11px] text-slate-400">Receive instant high-priority text alerts on detected intrusions</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.sms}
                onChange={(e) => setNotificationPrefs({ ...notificationPrefs, sms: e.target.checked })}
                className="rounded bg-obsidian-950 border-forest-700 text-emerald-500 w-4 h-4 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-forest-800 cursor-pointer hover:border-forest-600 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-200">Email Dossier Dispatch</p>
                <p className="text-[11px] text-slate-400">Receive AI camera snapshots and incident reports via email</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.email}
                onChange={(e) => setNotificationPrefs({ ...notificationPrefs, email: e.target.checked })}
                className="rounded bg-obsidian-950 border-forest-700 text-emerald-500 w-4 h-4 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-forest-800 cursor-pointer hover:border-forest-600 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-200">Audio Emergency Siren</p>
                <p className="text-[11px] text-slate-400">Play web audio synth alarm on CRITICAL and HIGH threat incursions</p>
              </div>
              <input
                type="checkbox"
                checked={!isAudioMuted}
                onChange={toggleMute}
                className="rounded bg-obsidian-950 border-forest-700 text-emerald-500 w-4 h-4 focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Spatial Alert Radius */}
        <div className="glass-card rounded-2xl p-6 border border-forest-700/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-forest-800">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Emergency Geofence Warning Radius</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Broadcast Radius Threshold:</span>
              <span className="font-bold text-emerald-400 font-mono">{alertRadiusKm} km from settlement</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={alertRadiusKm}
              onChange={(e) => setAlertRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <p className="text-[11px] text-slate-400">
              Any intrusion detected within this distance triggers immediate priority broadcasts to all residents in that village cluster.
            </p>
          </div>
        </div>

        {/* Section 3: IoT Edge Ingestion Gateway API */}
        <div className="glass-card rounded-2xl p-6 border border-forest-700/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-forest-800">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Edge Hardware Ingestion API Key</h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Use this token to authenticate physical IoT gateway nodes (ESP32, Raspberry Pi, LoRaWAN gateways) when sending telemetry to <code className="text-emerald-400 font-mono">POST /api/iot/sensor-data</code>.
          </p>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-obsidian-950 border border-forest-800">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="w-full bg-transparent text-xs font-mono text-emerald-300 outline-none select-all"
            />
            <button
              type="button"
              onClick={handleCopyKey}
              className="btn-secondary py-1 px-2.5 text-xs shrink-0"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button type="submit" className="btn-primary py-2.5 px-6 text-xs">
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
