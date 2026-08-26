import React from 'react';
import { BarChart2 } from 'lucide-react';

/**
 * MatchScore — displays a filter-computed match score (NOT AI).
 * Clearly labeled as a demonstration filter score.
 */
export const MatchScore = ({ score = 0, size = 'md' }) => {
  const color =
    score >= 80 ? 'text-[#00FF88]' : score >= 60 ? 'text-cyan-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';
  const bg =
    score >= 80 ? 'bg-emerald-500/15 border-emerald-500/40' : score >= 60 ? 'bg-cyan-500/15 border-cyan-500/40' : score >= 40 ? 'bg-amber-500/15 border-amber-500/40' : 'bg-red-500/15 border-red-500/40';
  const label =
    score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Low';

  if (size === 'sm') {
    return (
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border ${bg}`}>
        <BarChart2 className={`w-3 h-3 ${color}`} />
        <span className={`text-[10px] font-extrabold font-mono ${color}`}>{score}%</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border ${bg}`} title="Filter score — based on price, distance, and quantity fit. Not AI.">
      <div className="flex items-center gap-1">
        <BarChart2 className={`w-4 h-4 ${color}`} />
        <span className={`text-lg font-extrabold font-tech ${color}`}>{score}</span>
      </div>
      <span className={`text-[9px] uppercase tracking-wider font-bold ${color}`}>{label}</span>
      <span className="text-[9px] text-gray-600 font-mono">Filter Score</span>
    </div>
  );
};
