import React from 'react';
import { CheckCircle2, Target } from 'lucide-react';

/**
 * QuantityProgress — core UI element for bulk matching
 * Shows: Required / Selected (Matched) / Remaining + animated progress bar
 */
export const QuantityProgress = ({
  requiredQtyKg = 0,
  matchedQtyKg = 0,
  remainingQtyKg = 0,
  progressPct = 0,
  isFullyMatched = false,
  compact = false,
}) => {
  const fmtKg = (n) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}T` : `${n.toLocaleString('en-IN')} kg`;

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">{fmtKg(matchedQtyKg)} matched</span>
          <span className={isFullyMatched ? 'text-[#00FF88] font-bold' : 'text-gray-400'}>
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isFullyMatched ? 'bg-[#00FF88]' : 'bg-gradient-to-r from-cyan-500 to-[#00FF88]'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-panel rounded-2xl p-5 space-y-4 ${
        isFullyMatched
          ? 'glass-card-glow-green border-[#00FF88]/40 shadow-[0_0_25px_rgba(0,255,136,0.2)]'
          : 'glass-card-glow-cyan'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isFullyMatched ? (
            <CheckCircle2 className="w-5 h-5 text-[#00FF88] animate-pulse" />
          ) : (
            <Target className="w-5 h-5 text-cyan-400" />
          )}
          <span className="text-sm font-bold text-white font-tech">
            {isFullyMatched ? 'Requirement Fully Matched! 🎉' : 'Quantity Matching Progress'}
          </span>
        </div>
        <span
          className={`text-xl font-extrabold font-tech ${isFullyMatched ? 'text-[#00FF88]' : 'text-cyan-300'}`}
        >
          {Math.round(progressPct)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-800/80 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isFullyMatched
              ? 'bg-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.5)]'
              : 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-[#00FF88]'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-900/60 rounded-xl p-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Required</p>
          <p className="text-base font-extrabold text-white font-tech">{fmtKg(requiredQtyKg)}</p>
        </div>
        <div className={`rounded-xl p-3 ${isFullyMatched ? 'bg-[#00FF88]/10' : 'bg-cyan-500/10'}`}>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Selected</p>
          <p className={`text-base font-extrabold font-tech ${isFullyMatched ? 'text-[#00FF88]' : 'text-cyan-300'}`}>
            {fmtKg(matchedQtyKg)}
          </p>
        </div>
        <div
          className={`rounded-xl p-3 ${
            remainingQtyKg === 0 ? 'bg-[#00FF88]/10' : 'bg-amber-500/10'
          }`}
        >
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Remaining</p>
          <p
            className={`text-base font-extrabold font-tech ${
              remainingQtyKg === 0 ? 'text-[#00FF88]' : 'text-amber-400'
            }`}
          >
            {remainingQtyKg === 0 ? '0 kg ✓' : fmtKg(remainingQtyKg)}
          </p>
        </div>
      </div>
    </div>
  );
};
