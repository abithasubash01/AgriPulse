import React, { useState } from 'react';
import { 
  PlusCircle, 
  IndianRupee, 
  Package, 
  CheckCircle2, 
  MapPin, 
  Tag, 
  Sparkles, 
  Trash2, 
  Check, 
  X, 
  Award, 
  Image as ImageIcon,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { COMMODITIES_LIST } from '../data/mockMandiData';

export const FarmerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { listings, addListing, updateListingStatus, setActiveTab } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    commodity: "Onion",
    variety: "Lasalgaon Red Grade A",
    quantity: 100,
    askingPrice: 2400,
    qualityGrade: "Grade A Super",
    location: user?.location || "Nashik, Maharashtra",
    notes: "Organic top harvest. Dried and cured.",
    photos: ["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80"]
  });

  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'Active');
  const totalRevenue = activeListings.reduce((sum, l) => sum + (Number(l.quantity) * Number(l.askingPrice)), 0);

  const handleSubmitListing = (e) => {
    e.preventDefault();
    addListing({
      ...formData,
      farmerName: user?.name || "Ramesh Farmer",
      phone: user?.phone || "9876543210",
    });
    
    // Trigger festive cyber confetti
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner / Cyber Metric Cards */}
      <div className="grid grid-[#0B0F19] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Projected Revenue */}
        <div className="glass-panel glass-card-glow-green p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projected Revenue</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-[#00FF88] border border-emerald-500/40">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-white font-tech tracking-tight">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Across {activeListings.length} active crops
            </p>
          </div>
        </div>

        {/* My Active Listings */}
        <div className="glass-panel glass-card-glow-cyan p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Produce</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-white font-tech tracking-tight">
              {activeListings.length} <span className="text-sm font-normal text-gray-400">Listings</span>
            </h3>
            <p className="text-xs text-cyan-300 font-semibold mt-1">
              Ready for Trader & Mandi Buyers
            </p>
          </div>
        </div>

        {/* Primary Farm Location */}
        <div className="glass-panel glass-card-glow-amber p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Farmer Farm Hub</span>
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-white font-tech truncate">
              {user?.location || "Nashik, Maharashtra"}
            </h3>
            <p className="text-xs text-amber-300 font-semibold mt-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Verified Agribot Member
            </p>
          </div>
        </div>

        {/* Quick Action: Add Produce */}
        <div 
          onClick={() => setIsAddModalOpen(true)}
          className="glass-panel p-5 rounded-2xl relative overflow-hidden cursor-pointer hover:border-[#00FF88] transition-all bg-gradient-to-br from-emerald-950/40 via-gray-900 to-cyan-950/40 flex flex-col justify-between group shadow-[0_0_20px_rgba(0,255,136,0.15)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#00FF88] uppercase tracking-wider">Quick Action</span>
            <Sparkles className="w-5 h-5 text-[#00FF88] group-hover:rotate-12 transition-transform" />
          </div>
          <div className="mt-4 flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#00FF88] text-black font-extrabold shadow-[0_0_15px_rgba(0,255,136,0.5)]">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-extrabold text-white block">Post New Produce</span>
              <span className="text-[11px] text-gray-400">Publish to Pan-India Marketplace</span>
            </div>
          </div>
        </div>

      </div>

      {/* Produce Listings Table Section */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-gray-800 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-tech flex items-center gap-2">
              <Package className="w-6 h-6 text-[#00FF88]" />
              {t('myListings')}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Manage your published farm crops, edit status, or calculate net mandi profit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('comparison')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all"
            >
              🚀 Calculate Net Profit
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('addListing')}</span>
            </button>
          </div>
        </div>

        {/* Listings Grid Cards */}
        {listings.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-semibold">No active produce listings yet.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-[#00FF88] text-black"
            >
              Add First Produce Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div 
                key={item.id} 
                className="glass-panel rounded-2xl overflow-hidden border border-gray-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Crop Card Image Header */}
                <div className="relative h-44 w-full bg-gray-900">
                  <img 
                    src={item.photos?.[0] || "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600"} 
                    alt={item.commodity} 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-md border ${
                      item.status === 'Active' 
                        ? 'bg-emerald-500/20 text-[#00FF88] border-emerald-500/40 shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                        : 'bg-gray-800/80 text-gray-400 border-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {item.qualityGrade}
                      </span>
                      <h3 className="text-xl font-extrabold text-white font-tech mt-1">
                        {item.commodity} ({item.variety})
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Quantity</span>
                      <p className="text-base font-extrabold text-white">{item.quantity} Quintals</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Asking Price</span>
                      <p className="text-base font-extrabold text-[#00FF88]">₹{item.askingPrice} <span className="text-[10px] text-gray-400">/Qtl</span></p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="flex items-center text-gray-400 gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.location}</span>
                    </div>
                    {item.notes && (
                      <p className="text-gray-400 italic text-[11px] line-clamp-2">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Footer Button */}
                <div className="p-4 bg-gray-900/80 border-t border-gray-800/80 flex items-center justify-between">
                  <button
                    onClick={() => updateListingStatus(item.id, item.status === 'Active' ? 'Sold' : 'Active')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      item.status === 'Active'
                        ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30 hover:bg-amber-900'
                        : 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.status === 'Active' ? t('soldStatus') : 'Re-Activate'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('comparison')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1"
                  >
                    Compare Mandis &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Produce Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-cyan-500/30 p-6 space-y-5 bg-[#0B0F19]/95 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,255,136,0.2)]">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-6 h-6 text-[#00FF88]" />
                <h3 className="text-xl font-extrabold text-white font-tech">Post New Produce Listing</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitListing} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Crop Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">{t('cropName')}</label>
                  <select
                    value={formData.commodity}
                    onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {COMMODITIES_LIST.map(c => (
                      <option key={c.id} value={c.name.split(' ')[0]}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variety */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">{t('variety')}</label>
                  <input
                    type="text"
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g. Red Onion / Sharbati"
                    required
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">{t('quantity')}</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Asking Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">{t('askingPrice')}</label>
                  <input
                    type="number"
                    value={formData.askingPrice}
                    onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

              </div>

              {/* Quality Grade & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">{t('qualityGrade')}</label>
                  <select
                    value={formData.qualityGrade}
                    onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Grade A Super">Grade A Super (Top Quality)</option>
                    <option value="Grade A">Grade A Standard</option>
                    <option value="Grade B">Grade B Medium</option>
                    <option value="Export Quality">Export Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">{t('location')}</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Produce Photo URL
                </label>
                <input
                  type="text"
                  value={formData.photos[0]}
                  onChange={(e) => setFormData({ ...formData, photos: [e.target.value] })}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Notes / Moisture Specs</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:brightness-110"
                >
                  Publish Listing 🚀
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
