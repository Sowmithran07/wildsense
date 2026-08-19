import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TreePine,
  Bell,
  Volume2,
  VolumeX,
  Play,
  Square,
  Radio,
  User,
  LogOut,
  Menu,
  X,
  Flame,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useSimulation } from '../../context/SimulationContext';
import ThreatBadge from './ThreatBadge';

export const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isConnected, notifications, unreadNotificationsCount, setUnreadNotificationsCount, isAudioMuted, toggleMute } = useSocket();
  const { isSimulating, toggleSimulation, loading: simLoading } = useSimulation();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadNotificationsCount(0);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-obsidian-950/80 backdrop-blur-xl border-b border-forest-800/80 shadow-lg shadow-obsidian-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-forest-850 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-obsidian-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                  WILD SENSE
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                Autonomous Wildlife Intrusion Defense
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Live Connection & Simulation Controls */}
        <div className="flex items-center gap-3">
          {/* Socket Connection Pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
              isConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
              }`}
            />
            <span>{isConnected ? 'IoT GATEWAY LIVE' : 'OFFLINE'}</span>
          </div>

          {/* Simulation Toggle Button */}
          <button
            onClick={() => toggleSimulation()}
            disabled={simLoading}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 ${
              isSimulating
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25 shadow-lg shadow-amber-500/10 animate-pulse'
                : 'bg-forest-850/90 text-slate-300 border-forest-700/60 hover:border-forest-500 hover:text-emerald-300'
            }`}
            title="Toggle background intrusion simulator"
          >
            {isSimulating ? (
              <>
                <Square className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>SIMULATION ACTIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span className="hidden sm:inline">SIMULATION MODE</span>
                <span className="sm:hidden">SIM</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Audio Mute, Notifications, Profile */}
        <div className="flex items-center gap-2">
          {/* Audio Mute Switch */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition-all ${
              isAudioMuted
                ? 'bg-forest-900 text-slate-500 border-forest-800'
                : 'bg-forest-850 text-emerald-400 border-forest-700/60 hover:border-emerald-500/50'
            }`}
            title={isAudioMuted ? 'Unmute Emergency Siren' : 'Mute Emergency Siren'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={handleOpenNotifications}
              className="relative p-2 rounded-xl bg-forest-850 text-slate-300 hover:text-white border border-forest-700/60 hover:border-emerald-500/50 transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl border border-forest-700/80 shadow-2xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-forest-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <h4 className="font-bold text-sm text-slate-100">Live Broadcast Feed</h4>
                  </div>
                  <span className="text-xs text-slate-400">{notifications.length} alerts</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No wildlife alerts received yet.
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n, i) => (
                      <div
                        key={n._id || i}
                        className="p-2.5 rounded-xl bg-obsidian-900/80 border border-forest-800/80 hover:border-forest-600 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                          {n.threatLevel && <ThreatBadge level={n.threatLevel} size="xs" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">{n.message}</p>
                        <span className="text-[9px] font-mono text-emerald-400/80 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 border-t border-forest-800 mt-3 text-center">
                  <Link
                    to="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    View All Intrusion Alerts →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Navigation */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 rounded-xl bg-forest-850 hover:bg-forest-800 border border-forest-700/60 hover:border-emerald-500/50 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/40">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-200 leading-none">{user?.name}</p>
                  <p className="text-[10px] font-mono text-emerald-400 uppercase leading-none mt-1">
                    {user?.role}
                  </p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl border border-forest-700/80 shadow-2xl p-2 z-50">
                  <div className="p-2 border-b border-forest-800 mb-1">
                    <p className="text-xs font-bold text-slate-100">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <span className="mt-1 inline-block text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {user?.role}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-forest-800/60 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Control Dashboard</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-forest-800/60 transition-colors"
                  >
                    <User className="w-4 h-4 text-teal-400" />
                    <span>Settings & Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-1 border-t border-forest-800 pt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary py-1.5 px-3 text-xs">
                Login
              </Link>
              <Link to="/register" className="btn-primary py-1.5 px-3 text-xs hidden sm:inline-flex">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
