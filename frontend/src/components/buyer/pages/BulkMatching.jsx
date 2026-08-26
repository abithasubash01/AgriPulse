import React, { useState } from 'react';
import { ArrowLeft, Send, X, AlertTriangle } from 'lucide-react';
import { useBuyer, BUYER_VIEWS } from '../../../context/BuyerContext';
import { QuantityProgress } from '../shared/QuantityProgress';

export const BulkMatching = () => {
  const { 
    activeRequirement, 
    selectedFarmers, 
    updateContributedQty, 
    toggleFarmerSelection,
    sendBulkRequests,
    navigate,
    goBack,
    requiredQtyKg,
    matchedQtyKg,
    remainingQtyKg,
    progressPct,
    isFullyMatched
  } = useBuyer();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!activeRequirement || selectedFarmers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No farmers selected.</p>
        <button onClick={goBack} className="text-cyan-400">Go back</button>
      </div>
    );
  }

  const handleSendRequests = async () => {
    setIsSubmitting(true);
    try {
      await sendBulkRequests();
      setShowConfirm(false);
      navigate(BUYER_VIEWS.MY_REQUIREMENTS);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={goBack} className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white font-tech">Review Bulk Match</h1>
          <p className="text-sm text-gray-400 mt-1">Adjust quantities from each farmer before sending requests.</p>
        </div>
      </div>

      {/* Main Progress Tracker */}
      <QuantityProgress 
        requiredQtyKg={requiredQtyKg}
        matchedQtyKg={matchedQtyKg}
        remainingQtyKg={remainingQtyKg}
        progressPct={progressPct}
        isFullyMatched={isFullyMatched}
      />

      {/* Selected Farmers List */}
      <div className="space-y-4 mt-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Selected Farmers ({selectedFarmers.length})</h3>
        
        {selectedFarmers.map(selection => {
          const { farmer, cropListing, contributedQtyKg } = selection;
          return (
            <div key={farmer.id} className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm">{farmer.name}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>{farmer.location}</span>
                  <span className="text-[#00FF88]">₹{cropListing.pricePerKg}/kg</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-gray-900/50 p-2 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Quantity (kg)</span>
                  <input 
                    type="number"
                    min="1"
                    max={cropListing.availableQty}
                    value={contributedQtyKg || ''}
                    onChange={(e) => updateContributedQty(farmer.id, e.target.value)}
                    className="w-24 bg-transparent border-b border-cyan-500/50 text-[#00FF88] font-bold font-tech text-lg focus:outline-none focus:border-[#00FF88] text-center"
                  />
                  <span className="text-[10px] text-gray-600 text-center mt-1">Max: {cropListing.availableQty} kg</span>
                </div>
                
                <div className="flex flex-col text-right px-2 border-l border-gray-700">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total</span>
                  <span className="text-sm font-bold text-white font-tech">₹{(contributedQtyKg * cropListing.pricePerKg).toLocaleString('en-IN')}</span>
                </div>

                <button 
                  onClick={() => toggleFarmerSelection(farmer, cropListing)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning if over-matched */}
      {matchedQtyKg > requiredQtyKg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>You have selected more quantity than your requirement ({matchedQtyKg.toLocaleString()} kg &gt; {requiredQtyKg.toLocaleString()} kg). You can still proceed if intended.</p>
        </div>
      )}

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-72 p-4 bg-[#070A12]/95 backdrop-blur-xl border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase">Estimated Total Cost</p>
            <p className="text-xl font-extrabold text-white font-tech">
              ₹{selectedFarmers.reduce((sum, s) => sum + (s.contributedQtyKg * s.cropListing.pricePerKg), 0).toLocaleString('en-IN')}
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={matchedQtyKg === 0}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00FF88] to-emerald-500 text-black text-sm font-extrabold shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Send Requests
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-6 shadow-[0_0_40px_rgba(0,255,136,0.2)]">
            <h3 className="text-lg font-bold text-white mb-2">Confirm Requests</h3>
            <p className="text-sm text-gray-400 mb-6">
              You are about to send purchase requests to <strong className="text-white">{selectedFarmers.length} farmers</strong> for a total of <strong className="text-[#00FF88]">{matchedQtyKg.toLocaleString('en-IN')} kg</strong>.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendRequests}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#00FF88] text-black font-extrabold text-sm flex items-center justify-center"
              >
                {isSubmitting ? 'Sending...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
