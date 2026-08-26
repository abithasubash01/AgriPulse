import React, { useEffect } from 'react';
import { ListChecks, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useBuyer, BUYER_VIEWS } from '../../../context/BuyerContext';
import { LoadingState, EmptyState } from '../shared/StateComponents';
import { QuantityProgress } from '../shared/QuantityProgress';

export const MyRequirements = () => {
  const { requirements, loading, loadRequirements, setActiveRequirement, navigate } = useBuyer();

  useEffect(() => {
    loadRequirements();
  }, []);

  const handleViewMatches = (req) => {
    setActiveRequirement(req);
    navigate(BUYER_VIEWS.MATCHING_FARMERS, { requirement: req });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-tech">My Requirements</h1>
        <p className="text-sm text-gray-400 mt-1">Track the fulfillment status of your bulk crop requirements.</p>
      </div>

      {loading.requirements ? (
        <LoadingState message="Loading your requirements..." />
      ) : requirements.length === 0 ? (
        <EmptyState 
          icon={ListChecks} 
          title="No active requirements" 
          message="You haven't posted any bulk requirements yet."
          action={{ label: 'Create Requirement', onClick: () => navigate(BUYER_VIEWS.CREATE_REQUIREMENT) }}
        />
      ) : (
        <div className="grid gap-4">
          {requirements.map((req) => {
            const isFullyMatched = req.matchedQtyKg >= req.quantityKg;
            const pct = req.quantityKg > 0 ? Math.min(100, (req.matchedQtyKg / req.quantityKg) * 100) : 0;
            
            return (
              <div key={req.id} className={`glass-panel rounded-2xl p-5 border-l-4 transition-all hover:translate-x-1 ${
                isFullyMatched ? 'border-l-[#00FF88]' : 'border-l-cyan-500'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  
                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{req.crop} {req.variety && <span className="text-sm font-normal text-gray-400">({req.variety})</span>}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isFullyMatched ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Needed by {req.neededBy}</span>
                      <span>Max ₹{req.maxPricePerKg}/kg</span>
                      <span>{req.location}</span>
                    </div>

                    <div className="w-full max-w-md pt-2">
                      <QuantityProgress 
                        requiredQtyKg={req.quantityKg}
                        matchedQtyKg={req.matchedQtyKg}
                        remainingQtyKg={Math.max(0, req.quantityKg - req.matchedQtyKg)}
                        progressPct={pct}
                        isFullyMatched={isFullyMatched}
                        compact
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <button
                      onClick={() => handleViewMatches(req)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        isFullyMatched
                          ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:text-white'
                          : 'bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] hover:bg-[#00FF88]/20'
                      }`}
                    >
                      {isFullyMatched ? 'View Matches' : 'Find Farmers'} <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
