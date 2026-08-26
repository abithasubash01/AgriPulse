import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  IndianRupee,
  Package,
  Star,
  ShieldCheck,
  Eye,
  UserPlus,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
} from 'lucide-react';
import { useBuyer, BUYER_VIEWS } from '../../../context/BuyerContext';
import { browseListings } from '../../../services/buyerService';
import { CROP_LIST } from '../../../data/mockBuyerData';
import { STATES_DISTRICTS } from '../../../data/mockMandiData';
import { MatchScore } from '../shared/MatchScore';
import { LoadingState, EmptyState, ErrorState } from '../shared/StateComponents';

const FarmerCard = ({ farmer, filters, onView, onSelect, isSelected }) => {
  const cropListing = farmer.crops.find(
    (c) => c.cropName.toLowerCase() === (filters.crop || '').toLowerCase(),
  ) || farmer.crops[0];

  return (
    <div
      className={`glass-panel rounded-2xl p-5 space-y-4 transition-all duration-300 glass-panel-hover
        ${isSelected
          ? 'border-[#00FF88]/60 shadow-[0_0_20px_rgba(0,255,136,0.2)] bg-[#00FF88]/5'
          : 'hover:border-cyan-500/40'
        }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-cyan-500/30 flex items-center justify-center text-[#00FF88] font-extrabold text-lg font-tech flex-shrink-0">
            {farmer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white text-sm">{farmer.name}</h3>
              {farmer.verified && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[#00FF88]">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  {farmer.verificationBadge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {farmer.location}
              </span>
              <span className="text-cyan-400 font-semibold">{farmer.distanceKm} km away</span>
            </div>
          </div>
        </div>
        <MatchScore score={farmer.matchScore || 0} size="md" />
      </div>

      {/* Crop info */}
      {cropListing && (
        <div className="bg-gray-900/60 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#00FF88]">{cropListing.cropName}</span>
            <span className="text-xs text-gray-500">{cropListing.variety}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Available</p>
              <p className="text-sm font-extrabold text-white font-tech">{cropListing.availableQty.toLocaleString('en-IN')} kg</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Price</p>
              <p className="text-sm font-extrabold text-emerald-400 font-tech">₹{cropListing.pricePerKg}/kg</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Grade</p>
              <p className="text-xs font-bold text-gray-300">{cropListing.qualityGrade}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rating + availability */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="font-bold text-white">{farmer.rating}</span>
          <span className="text-gray-600">· {farmer.dealsCompleted} deals</span>
        </span>
        <span className={`font-semibold ${farmer.availability === 'Available' ? 'text-[#00FF88]' : 'text-amber-400'}`}>
          {farmer.availability}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          id={`btn-view-farmer-${farmer.id}`}
          onClick={() => onView(farmer)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-600 transition-all"
        >
          <Eye className="w-3.5 h-3.5" /> View Profile
        </button>
        <button
          id={`btn-select-farmer-${farmer.id}`}
          onClick={() => onSelect(farmer, cropListing)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all
            ${isSelected
              ? 'bg-[#00FF88]/20 border border-[#00FF88]/50 text-[#00FF88]'
              : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          {isSelected ? 'Selected ✓' : 'Select'}
        </button>
      </div>
    </div>
  );
};

export const FindFarmers = () => {
  const { searchFilters, setSearchFilters, selectedFarmers, toggleFarmerSelection, navigate, setActiveFarmer } = useBuyer();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [localFilters, setLocalFilters] = useState(searchFilters);

  const states = Object.keys(STATES_DISTRICTS);

  const doSearch = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await browseListings(filters);
      setFarmers(res.farmers || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch(searchFilters);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchFilters(localFilters);
    doSearch(localFilters);
  };

  const handleReset = () => {
    const blank = { crop: '', quantityKg: '', maxPricePerKg: '', location: '', maxDistanceKm: 50, neededBy: '' };
    setLocalFilters(blank);
    setSearchFilters(blank);
    doSearch(blank);
  };

  const handleViewFarmer = (farmer) => {
    setActiveFarmer(farmer);
    navigate(BUYER_VIEWS.FARMER_DETAILS, { farmer });
  };

  const isSelected = (f) => selectedFarmers.some((s) => s.farmer.id === f.id);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-white font-tech">Find Farmers</h1>
        <button
          onClick={() => setFiltersOpen((p) => !p)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-xs text-gray-300 hover:text-white transition-all"
        >
          <Filter className="w-4 h-4" />
          Filters
          {filtersOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Filter form */}
      {filtersOpen && (
        <form onSubmit={handleSearch} className="glass-panel rounded-2xl p-5 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Crop */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Crop *</label>
              <select
                value={localFilters.crop}
                onChange={(e) => setLocalFilters((p) => ({ ...p, crop: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="">All Crops</option>
                {CROP_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Required Quantity (kg)</label>
              <div className="relative">
                <Package className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  value={localFilters.quantityKg}
                  onChange={(e) => setLocalFilters((p) => ({ ...p, quantityKg: e.target.value }))}
                  placeholder="e.g. 2000"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Max Price (₹/kg)</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  value={localFilters.maxPricePerKg}
                  onChange={(e) => setLocalFilters((p) => ({ ...p, maxPricePerKg: e.target.value }))}
                  placeholder="e.g. 30"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={localFilters.location}
                  onChange={(e) => setLocalFilters((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Nashik, Maharashtra"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Max Distance */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Max Distance: <span className="text-cyan-400">{localFilters.maxDistanceKm} km</span>
              </label>
              <input
                type="range"
                min="10" max="200" step="10"
                value={localFilters.maxDistanceKm}
                onChange={(e) => setLocalFilters((p) => ({ ...p, maxDistanceKm: Number(e.target.value) }))}
                className="w-full accent-[#00FF88]"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>10 km</span><span>200 km</span>
              </div>
            </div>

            {/* Needed By */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Needed By</label>
              <input
                type="date"
                value={localFilters.neededBy}
                onChange={(e) => setLocalFilters((p) => ({ ...p, neededBy: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              id="btn-search-farmers"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-emerald-500 text-black text-sm font-extrabold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]"
            >
              <Search className="w-4 h-4" /> Search Farmers
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-sm font-bold hover:text-white transition-all"
            >
              <X className="w-4 h-4" /> Reset
            </button>
          </div>
        </form>
      )}

      {/* Results */}
      <div>
        {loading ? (
          <LoadingState message="Searching farmers..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => doSearch(searchFilters)} />
        ) : farmers.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No farmers found"
            message="No farmers found matching your filters — try increasing max distance or adjusting your max price."
            action={{ label: 'Reset Filters', onClick: handleReset }}
          />
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-4">
              {farmers.length} farmer{farmers.length !== 1 ? 's' : ''} found
              {searchFilters.crop ? ` for ${searchFilters.crop}` : ''}
              {selectedFarmers.length > 0 && (
                <span className="ml-3 text-cyan-400 font-bold">{selectedFarmers.length} selected</span>
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {farmers.map((farmer) => (
                <FarmerCard
                  key={farmer.id}
                  farmer={farmer}
                  filters={localFilters}
                  onView={handleViewFarmer}
                  onSelect={toggleFarmerSelection}
                  isSelected={isSelected(farmer)}
                />
              ))}
            </div>

            {/* Sticky selection CTA */}
            {selectedFarmers.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 animate-slideUp">
                <div className="glass-panel glass-card-glow-green rounded-2xl px-6 py-3 flex items-center gap-5 shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                  <span className="text-sm font-bold text-white">
                    <span className="text-[#00FF88] font-extrabold">{selectedFarmers.length}</span> farmers selected
                  </span>
                  <button
                    onClick={() => navigate(BUYER_VIEWS.BULK_MATCHING)}
                    className="px-4 py-2 rounded-xl bg-[#00FF88] text-black text-xs font-extrabold hover:brightness-110 transition-all"
                  >
                    View Matching →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
