import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  AlertTriangle,
  FileSpreadsheet,
  MapPin,
  Camera,
  Cpu,
  ShieldAlert,
  Eye,
  FilePlus,
  BarChart3,
  FileText,
  Users,
  Settings,
  X,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, isAdmin, isOfficer, isResident } = useAuth();

  const navItems = [
    {
      label: 'OVERVIEW',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'officer', 'resident'] },
        { to: '/live-monitoring', label: 'Live Monitoring', icon: Radio, roles: ['admin', 'officer'] },
        { to: '/map', label: 'Threat GIS Map', icon: MapPin, roles: ['admin', 'officer', 'resident'] },
      ],
    },
    {
      label: 'INTRUSION & AI',
      items: [
        { to: '/alerts', label: 'Active Alerts', icon: AlertTriangle, roles: ['admin', 'officer', 'resident'] },
        { to: '/detections', label: 'AI Detections', icon: Camera, roles: ['admin', 'officer'] },
        { to: '/incidents', label: 'Incident Dossiers', icon: FileSpreadsheet, roles: ['admin', 'officer'] },
      ],
    },
    {
      label: 'HARDWARE & SENSORS',
      items: [
        { to: '/sensors', label: 'Sensor Fleet', icon: Cpu, roles: ['admin', 'officer'] },
      ],
    },
    {
      label: 'COMMUNITY & RESIDENTS',
      items: [
        { to: '/resident-portal', label: 'Resident Safety Hub', icon: ShieldAlert, roles: ['resident', 'officer', 'admin'] },
        { to: '/report-sighting', label: 'Report Animal Sighting', icon: FilePlus, roles: ['resident', 'officer', 'admin'] },
        { to: '/sightings', label: 'Verified Sightings', icon: Eye, roles: ['admin', 'officer', 'resident'] },
      ],
    },
    {
      label: 'INTELLIGENCE & ADMIN',
      items: [
        { to: '/analytics', label: 'Analytics & Trends', icon: BarChart3, roles: ['admin', 'officer'] },
        { to: '/reports', label: 'Generate Reports', icon: FileText, roles: ['admin', 'officer'] },
        { to: '/users', label: 'Personnel & Rangers', icon: Users, roles: ['admin'] },
        { to: '/settings', label: 'System Settings', icon: Settings, roles: ['admin', 'officer', 'resident'] },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-md z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 glass-card border-r border-forest-800/80 bg-obsidian-950/95 lg:bg-obsidian-950/70 backdrop-blur-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation List */}
        <div className="p-4 space-y-6">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-forest-800">
            <span className="text-xs font-bold text-slate-400">NAVIGATION MENU</span>
            <button onClick={onCloseMobile} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {navItems.map((group, gIdx) => {
            // Filter items based on user role
            const visibleItems = group.items.filter(
              (item) => !item.roles || (user && item.roles.includes(user.role))
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1">
                <p className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
                  {group.label}
                </p>
                {visibleItems.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.to}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-500/10 font-bold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-forest-850/60'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 opacity-80 group-hover:opacity-100" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom User Role Badge */}
        <div className="p-4 border-t border-forest-800/80 bg-obsidian-900/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-forest-900/80 border border-forest-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              {user?.role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Authorized User'}</p>
              <p className="text-[10px] font-mono text-emerald-400 uppercase truncate">
                {user?.role || 'Guest'} • {user?.assignedZone || 'Buffer Zone'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
