import React from 'react';
import { TreePine, ShieldCheck, Radio, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-forest-800/80 bg-obsidian-950/80 backdrop-blur-md mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: System info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TreePine className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                WILD SENSE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wireless IoT wildlife intrusion detection, edge AI computer vision, and real-time community early warning platform.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FOREST CORRIDOR SHIELD ACTIVE</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Monitoring</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Admin Dashboard</Link></li>
              <li><Link to="/live-monitoring" className="hover:text-emerald-400 transition-colors">Live Sensor Grid</Link></li>
              <li><Link to="/alerts" className="hover:text-emerald-400 transition-colors">Active Alerts Center</Link></li>
              <li><Link to="/map" className="hover:text-emerald-400 transition-colors">Interactive GIS Threat Map</Link></li>
            </ul>
          </div>

          {/* Col 3: Community */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Community Portal</h4>
            <ul className="space-y-2">
              <li><Link to="/resident-portal" className="hover:text-emerald-400 transition-colors">Resident Safety Status</Link></li>
              <li><Link to="/report-sighting" className="hover:text-emerald-400 transition-colors">Report Wildlife Sighting</Link></li>
              <li><Link to="/sightings" className="hover:text-emerald-400 transition-colors">Verified Sightings Feed</Link></li>
              <li><Link to="/analytics" className="hover:text-emerald-400 transition-colors">Threat Analytics</Link></li>
            </ul>
          </div>

          {/* Col 4: Hardware Specs */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Edge Hardware Architecture</h4>
            <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800 space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Sensors:</span>
                <span className="text-emerald-300">PIR / Acoustic / Thermal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telemetry:</span>
                <span className="text-emerald-300">LoRaWAN + GSM / Wi-Fi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Model:</span>
                <span className="text-emerald-300">WildVision YOLOv8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Power:</span>
                <span className="text-emerald-300">Solar + LiFePO4</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-forest-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 WILD SENSE. All rights reserved. Designed for Wildlife Conservation & Community Safety.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Govt. of Forest & Environment Department Integration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
