import React from 'react';
import { Radio } from 'lucide-react';

export const Loader = ({ message = 'Synchronizing IoT Telemetry...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-4">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute w-16 h-16 rounded-full border-2 border-emerald-500/20 animate-ping"></div>
        <div className="absolute w-12 h-12 rounded-full border-2 border-emerald-400/40 border-t-emerald-400 animate-spin"></div>
        <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
      </div>
      <p className="text-sm font-medium text-emerald-300/80 animate-pulse tracking-wide font-mono">
        {message}
      </p>
    </div>
  );
};

export default Loader;
