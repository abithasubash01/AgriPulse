import React from 'react';
import { SearchX, AlertTriangle, Wifi } from 'lucide-react';

export const EmptyState = ({ icon: Icon = SearchX, title, message, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
    <div className="p-5 rounded-full bg-gray-800/50 border border-gray-700 mb-5">
      <Icon className="w-10 h-10 text-gray-500" />
    </div>
    <h3 className="text-lg font-bold text-gray-300 font-tech">{title}</h3>
    <p className="text-sm text-gray-500 mt-2 max-w-xs">{message}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-emerald-500 text-black text-xs font-extrabold tracking-wide hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]"
      >
        {action.label}
      </button>
    )}
  </div>
);

export const LoadingState = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
    <div className="relative w-12 h-12 mb-5">
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
      <div className="absolute inset-0 rounded-full border-t-2 border-[#00FF88] animate-spin" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
    <div className="p-5 rounded-full bg-red-900/20 border border-red-500/30 mb-5">
      <AlertTriangle className="w-10 h-10 text-red-400" />
    </div>
    <h3 className="text-lg font-bold text-red-300 font-tech">Something went wrong</h3>
    <p className="text-sm text-gray-500 mt-2 max-w-xs">{message || 'Could not load data. Please try again.'}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-6 px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-all"
      >
        Try Again
      </button>
    )}
  </div>
);
