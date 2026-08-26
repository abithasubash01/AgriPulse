import React from 'react';
import { ArrowLeft, MapPin, ShieldCheck, Star, Calendar, ArrowRight } from 'lucide-react';
import { useBuyer, BUYER_VIEWS } from '../../../context/BuyerContext';

export const FarmerDetails = () => {
  const { activeFarmer, goBack, navigate } = useBuyer();

  if (!activeFarmer) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No farmer selected.</p>
        <button onClick={() => navigate(BUYER_VIEWS.HOME)} className="text-cyan-400">Go to Home</button>
      </div>
    );
  }

  const f = activeFarmer;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={goBack} className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-extrabold text-white font-tech">Farmer Profile</h1>
      </div>

      {/* Main Card */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
          
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-4xl font-extrabold text-[#00FF88] font-tech">{f.name.charAt(0)}</span>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{f.name}</h2>
              {f.verified && (
                <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[#00FF88]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {f.verificationBadge}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {f.location} ({f.distanceKm} km away)</span>
              <span className="flex items-center gap-1 text-white">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 
                {f.rating} <span className="text-gray-500">({f.dealsCompleted} deals)</span>
              </span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Member since {f.memberSince}</span>
            </div>

            <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-gray-800/60 border border-gray-700">
              <span className="text-xs font-bold text-gray-400">Status: </span>
              <span className={`text-xs font-bold ${f.availability === 'Available' ? 'text-[#00FF88]' : 'text-amber-400'}`}>
                {f.availability}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">Note: Phone number is hidden until a purchase request is accepted.</p>
          </div>
        </div>
        
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Crops List */}
      <div>
        <h3 className="text-lg font-bold text-white font-tech mb-4">Listed Crops ({f.crops.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {f.crops.map((crop) => (
            <div key={crop.id} className="glass-panel rounded-xl p-5 border-cyan-500/20 hover:border-cyan-500/40 transition-colors space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-[#00FF88]">{crop.cropName}</h4>
                  <p className="text-sm text-gray-400">{crop.variety}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-white font-tech">₹{crop.pricePerKg}/kg</p>
                  <p className="text-[10px] text-gray-500">{crop.qualityGrade}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 bg-gray-900/60 rounded-xl p-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Available Qty</p>
                  <p className="text-sm font-bold text-white">{crop.availableQty.toLocaleString('en-IN')} kg</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Harvest Date</p>
                  <p className="text-sm font-bold text-white">{crop.harvestDate}</p>
                </div>
              </div>
              
              {crop.notes && (
                <p className="text-xs text-gray-400 bg-gray-900/30 p-2 rounded-lg border border-gray-800">
                  <span className="font-bold text-gray-500">Notes:</span> {crop.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
