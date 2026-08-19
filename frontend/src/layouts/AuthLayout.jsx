import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { TreePine, ShieldCheck, Radio } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-obsidian-950">
      {/* Background Animated Forest Glow Rings */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-64 h-64 rounded-full bg-forest-600/15 blur-2xl pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(52, 211, 153, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 211, 153, 0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-obsidian-950 shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <TreePine className="w-7 h-7" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
              WILD SENSE
            </span>
          </Link>
          <p className="text-xs text-slate-400">
            Intelligent Wildlife Intrusion Detection & Early Notification
          </p>
        </div>

        {/* Content Outlet */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-forest-700/60 shadow-2xl shadow-obsidian-950/90 backdrop-blur-2xl">
          <Outlet />
        </div>

        {/* Bottom helper */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Forest Department Secure Terminal</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
