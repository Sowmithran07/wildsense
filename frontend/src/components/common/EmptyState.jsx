import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = ShieldCheck,
  title = 'No Records Found',
  description = 'No activity matching your current criteria has been logged in this sector.',
  action = null,
}) => {
  return (
    <div className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-forest-800/80 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
