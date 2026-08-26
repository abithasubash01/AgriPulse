import React, { useState } from 'react';
import { Package, MapPin, IndianRupee, Calendar, ClipboardList } from 'lucide-react';
import { useBuyer, BUYER_VIEWS } from '../../../context/BuyerContext';
import { CROP_LIST, QUALITY_GRADES } from '../../../data/mockBuyerData';

export const CreateRequirement = () => {
  const { createRequirement, navigate, loadRequirements } = useBuyer();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    crop: '',
    variety: '',
    quantityKg: '',
    maxPricePerKg: '',
    location: '',
    maxDistanceKm: '50',
    neededBy: '',
    qualityGrade: 'Any',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        quantityKg: Number(formData.quantityKg),
        maxPricePerKg: Number(formData.maxPricePerKg),
        maxDistanceKm: Number(formData.maxDistanceKm)
      };
      const newReq = await createRequirement(payload);
      await loadRequirements(); // Refresh list
      // Redirect to matching farmers view for this new requirement
      navigate(BUYER_VIEWS.MATCHING_FARMERS, { requirement: newReq });
    } catch (error) {
      console.error("Failed to create requirement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-tech">Create Bulk Requirement</h1>
        <p className="text-sm text-gray-400 mt-1">
          Specify what you need, and we'll instantly match you with farmers who can fulfill your quantity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-6">
        
        {/* Row 1: Crop & Variety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Crop *</label>
            <select
              name="crop"
              required
              value={formData.crop}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00FF88] transition-colors"
            >
              <option value="">Select Crop</option>
              {CROP_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Variety (Optional)</label>
            <input
              type="text"
              name="variety"
              value={formData.variety}
              onChange={handleChange}
              placeholder="e.g. Red Onion, Sharbati"
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00FF88] transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Quantity & Max Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Quantity (kg) *</label>
            <div className="relative">
              <Package className="w-5 h-5 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="number"
                name="quantityKg"
                required
                min="1"
                value={formData.quantityKg}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00FF88] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Max Price (₹/kg) *</label>
            <div className="relative">
              <IndianRupee className="w-5 h-5 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="number"
                name="maxPricePerKg"
                required
                min="1"
                value={formData.maxPricePerKg}
                onChange={handleChange}
                placeholder="e.g. 25"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00FF88] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Location & Distance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery/Pickup Location *</label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Nashik, Maharashtra"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00FF88] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Max Distance: <span className="text-[#00FF88]">{formData.maxDistanceKm} km</span>
            </label>
            <div className="px-1 py-3">
              <input
                type="range"
                name="maxDistanceKm"
                min="10" max="500" step="10"
                value={formData.maxDistanceKm}
                onChange={handleChange}
                className="w-full accent-[#00FF88]"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                <span>10 km</span>
                <span>500 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Date & Quality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Needed By Date *</label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="date"
                name="neededBy"
                required
                value={formData.neededBy}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00FF88] transition-colors [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quality Grade</label>
            <select
              name="qualityGrade"
              value={formData.qualityGrade}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00FF88] transition-colors"
            >
              {QUALITY_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Additional Notes</label>
          <div className="relative">
            <ClipboardList className="w-5 h-5 text-gray-500 absolute left-3.5 top-3" />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific requirements (e.g. organic certification required, packaging type)"
              rows={3}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00FF88] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(BUYER_VIEWS.HOME)}
            className="px-6 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-[#00FF88] text-black text-sm font-extrabold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,255,136,0.4)] disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Creating...' : 'Find Matching Farmers →'}
          </button>
        </div>

      </form>
    </div>
  );
};
