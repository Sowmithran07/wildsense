import React from 'react';
import { AlertTriangle, ShieldAlert, ShieldCheck, Flame } from 'lucide-react';
import { THREAT_COLORS } from '../../utils/constants';

export const ThreatBadge = ({ level = 'MEDIUM', showIcon = true, size = 'sm' }) => {
  const normalized = (level || 'MEDIUM').toUpperCase();
  const config = THREAT_COLORS[normalized] || THREAT_COLORS.MEDIUM;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5 font-bold',
    lg: 'text-base px-4 py-2 font-black',
  };

  const getIcon = () => {
    switch (normalized) {
      case 'CRITICAL':
        return <Flame className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5 animate-pulse text-red-400'} />;
      case 'HIGH':
        return <ShieldAlert className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5 text-orange-400'} />;
      case 'MEDIUM':
        return <AlertTriangle className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5 text-amber-400'} />;
      case 'LOW':
      default:
        return <ShieldCheck className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5 text-emerald-400'} />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border tracking-wider transition-all duration-200 ${
        config.bg
      } ${config.text} ${config.border} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      {showIcon && getIcon()}
      <span>{normalized}</span>
    </span>
  );
};

export default ThreatBadge;
