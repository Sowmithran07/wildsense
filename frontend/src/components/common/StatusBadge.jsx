import React from 'react';
import { CheckCircle2, Clock, Activity, AlertOctagon, CheckCheck, XCircle } from 'lucide-react';

export const StatusBadge = ({ status = 'active', size = 'sm' }) => {
  const norm = String(status || 'active').toLowerCase();

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  const getStyle = () => {
    switch (norm) {
      case 'active':
      case 'online':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          label: 'Active',
          icon: <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />,
        };
      case 'warning':
      case 'weak':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
          label: 'Warning',
          icon: <AlertOctagon className="w-3 h-3 text-amber-400" />,
        };
      case 'offline':
      case 'maintenance':
      case 'inactive':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
          label: norm === 'maintenance' ? 'Maintenance' : 'Offline',
          icon: <XCircle className="w-3 h-3 text-rose-400" />,
        };
      case 'new':
      case 'open':
      case 'pending':
        return {
          bg: 'bg-red-500/15 text-red-300 border-red-500/30',
          dot: 'bg-red-400 animate-ping',
          label: norm.toUpperCase(),
          icon: <Clock className="w-3 h-3 text-red-400" />,
        };
      case 'in_progress':
      case 'investigating':
      case 'acknowledged':
        return {
          bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400',
          label: norm === 'in_progress' ? 'In Progress' : norm.charAt(0).toUpperCase() + norm.slice(1),
          icon: <Activity className="w-3 h-3 text-indigo-400 animate-spin" />,
        };
      case 'resolved':
      case 'contained':
      case 'verified':
        return {
          bg: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
          dot: 'bg-teal-400',
          label: norm === 'resolved' ? 'Resolved' : norm.charAt(0).toUpperCase() + norm.slice(1),
          icon: <CheckCheck className="w-3 h-3 text-teal-400" />,
        };
      default:
        return {
          bg: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
          dot: 'bg-slate-400',
          label: status,
          icon: <CheckCircle2 className="w-3 h-3 text-slate-400" />,
        };
    }
  };

  const style = getStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${style.bg} ${
        sizeClasses[size] || sizeClasses.sm
      }`}
    >
      {style.icon}
      <span>{style.label}</span>
    </span>
  );
};

export default StatusBadge;
