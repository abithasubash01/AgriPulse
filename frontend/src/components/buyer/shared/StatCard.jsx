import React from 'react';

/**
 * StatCard — used on dashboard home for key metrics.
 * Props: icon (Lucide component), label, value, sub, color ('green'|'cyan'|'amber'|'purple')
 */
export const StatCard = ({ icon: Icon, label, value, sub, color = 'green', onClick }) => {
  const colorMap = {
    green: {
      glow: 'glass-card-glow-green',
      iconBg: 'bg-emerald-500/20 border-emerald-500/40 text-[#00FF88]',
      value: 'text-white',
      border: 'hover:border-emerald-500/50',
    },
    cyan: {
      glow: 'glass-card-glow-cyan',
      iconBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
      value: 'text-cyan-300',
      border: 'hover:border-cyan-500/50',
    },
    amber: {
      glow: 'glass-card-glow-amber',
      iconBg: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
      value: 'text-amber-300',
      border: 'hover:border-amber-500/50',
    },
    purple: {
      glow: 'glass-card-glow-purple',
      iconBg: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
      value: 'text-purple-300',
      border: 'hover:border-purple-500/50',
    },
  };
  const c = colorMap[color] || colorMap.green;

  return (
    <div
      onClick={onClick}
      className={`glass-panel ${c.glow} p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 ${c.border} ${onClick ? 'cursor-pointer glass-panel-hover' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
          <h3 className={`text-3xl font-extrabold font-tech mt-2 tracking-tight ${c.value}`}>
            {value}
          </h3>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl border ${c.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {/* Subtle corner glow */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-2xl bg-current" />
    </div>
  );
};
