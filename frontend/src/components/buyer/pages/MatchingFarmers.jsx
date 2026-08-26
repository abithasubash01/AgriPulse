import React, { useState, useEffect } from 'react';
import { ArrowRight, UserPlus, Filter, X } from 'lucide-react';
import { useBuyer, BUYER_VIEWS } from '../../../context/BuyerContext';
import { getMatches } from '../../../services/buyerService';
import { EmptyState, LoadingState, ErrorState } from '../shared/StateComponents';
import { QuantityProgress } from '../shared/QuantityProgress';
import { MatchScore } from '../shared/MatchScore';

export const MatchingFarmers = () => {
  const { 
    activeRequirement, 
    navigate, 
    selectedFarmers, 
    toggleFarmerSelection,
    isFullyMatched
  } = useBuyer();
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeRequirement) {
      navigate(BUYER_VIEWS.HOME);
      return;
    }

    const loadMatches = async () => {
      setLoading(true);
      try {
        const filters = {
          crop: activeRequirement.crop,
          quantityKg: activeRequirement.quantityKg,
          maxPricePerKg: activeRequirement.maxPricePerKg,
          maxDistanceKm: activeRequirement.maxDistanceKm
        };
        const res = await getMatches(activeRequirement.id, filters);
        setMatches(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [activeRequirement]);

  const isSelected = (farmer) => selectedFarmers.some(s => s.farmer.id === farmer.id);

  if (!activeRequirement) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-tech">Matches for {activeRequirement.crop}</h1>
          <p className="text-sm text-gray-400 mt-1">
            Need {activeRequirement.quantityKg.toLocaleString('en-IN')} kg at max ₹{activeRequirement.maxPricePerKg}/kg
          </p>
        </div>
        <button
          onClick={() => navigate(BUYER_VIEWS.CREATE_REQUIREMENT)}
          className="self-start text-xs font-bold text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10"
        >
          Edit Requirement
        </button>
      </div>

      {loading ? (
        <LoadingState message="Finding best matches..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : matches.length === 0 ? (
        <EmptyState 
          title="No matches found"
          message="We couldn't find farmers matching this exact requirement. Try increasing the price or distance."
          action={{ label: 'Edit Requirement', onClick: () => navigate(BUYER_VIEWS.CREATE_REQUIREMENT) }}
        />
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Found {matches.length} matching farmers. Select multiple farmers to fulfill your bulk requirement.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {matches.map(farmer => {
              const cropListing = farmer.crops.find(c => c.cropName.toLowerCase() === activeRequirement.crop.toLowerCase());
              if (!cropListing) return null;
              const selected = isSelected(farmer);

              return (
                <div 
                  key={farmer.id}
                  className={`glass-panel rounded-xl p-4 flex gap-4 transition-all duration-300
                    ${selected ? 'bg-[#00FF88]/5 border-[#00FF88]/40 shadow-[0_0_15px_rgba(0,255,136,0.1)]' : 'hover:border-cyan-500/30'}`}
                >
                  {/* Left: Score & Select */}
                  <div className="flex flex-col items-center justify-center gap-3 pr-4 border-r border-gray-800">
                    <MatchScore score={farmer.matchScore} size="sm" />
                    <button
                      onClick={() => toggleFarmerSelection(farmer, cropListing)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        selected 
                          ? 'bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.5)]' 
                          : 'bg-gray-800 text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400'
                      }`}
                    >
                      {selected ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Right: Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{farmer.name}</h4>
                        <p className="text-xs text-gray-500">{farmer.location} • {farmer.distanceKm} km</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-emerald-400 font-tech">₹{cropListing.pricePerKg}/kg</p>
                        <p className="text-[10px] text-gray-500">{cropListing.qualityGrade}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/60 rounded-lg p-2.5 flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">Available Stock:</span>
                      <span className="text-sm font-bold text-[#00FF88] font-tech">{cropListing.availableQty.toLocaleString('en-IN')} kg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar for Selection */}
      {selectedFarmers.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 z-30 p-4 bg-gradient-to-t from-[#070A12] via-[#070A12]/95 to-transparent animate-slideUp">
          <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel glass-card-glow-green rounded-2xl p-4 shadow-[0_-5px_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#00FF88]/20 flex items-center justify-center text-[#00FF88] font-bold text-sm">
                  {selectedFarmers.length}
                </span>
                <span className="text-sm font-bold text-white">Farmers Selected</span>
              </div>
              
              <div className="h-8 w-px bg-gray-700 hidden sm:block"></div>
              
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="text-gray-400">
                  Required: <span className="text-white">{activeRequirement.quantityKg.toLocaleString('en-IN')} kg</span>
                </div>
                <div className={isFullyMatched ? 'text-[#00FF88]' : 'text-cyan-400'}>
                  Selected: <span>
                    {selectedFarmers.reduce((sum, s) => sum + s.contributedQtyKg, 0).toLocaleString('en-IN')} kg
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(BUYER_VIEWS.BULK_MATCHING)}
              className="px-6 py-2.5 rounded-xl bg-[#00FF88] text-black text-sm font-extrabold shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:brightness-110 flex items-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
