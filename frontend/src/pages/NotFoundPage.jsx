import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-forest-800/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-2xl">
        <TreePine className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
          404 ERROR — OUT OF BOUNDS
        </span>
        <h1 className="text-4xl font-black text-white">Sector Coordinate Not Found</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          The requested surveillance feed or monitoring sector does not exist or has been relocated.
        </p>
      </div>

      <Link to="/" className="btn-primary py-2.5 px-6 text-xs">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Base Terminal</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
