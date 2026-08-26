import React, { useState, useEffect } from 'react';
import { User, Mail, Smartphone, MapPin, Briefcase, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { BUSINESS_TYPES } from '../../../data/mockBuyerData';
import { getProfile, updateProfile } from '../../../services/buyerService';
import { useApp } from '../../../context/AppContext';

export const BuyerProfile = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: '',
    businessName: '',
    businessType: 'Retail Chain',
    location: user?.location || '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const p = await getProfile();
      if (p?.data) {
        setFormData(prev => ({ ...prev, ...p.data }));
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProfile(formData);
      if (updated?.data) {
        setUser(prev => ({ ...prev, ...updated.data }));
      }
      showToast('Profile updated successfully!');
    } catch (error) {
      showToast(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-tech">My Profile</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your business details and contact info.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00FF88]/20 to-cyan-500/20 border border-[#00FF88]/30 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-[#00FF88]" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-[#00FF88] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative">
              <Smartphone className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                name="phone"
                disabled
                value={formData.phone}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Phone is tied to your auth account.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email (Optional)</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-[#00FF88] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Name</label>
            <div className="relative">
              <Briefcase className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. FreshMart Ltd"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-[#00FF88] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Type</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-[#00FF88] outline-none"
            >
              {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Base Location</label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Pune, Maharashtra"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:border-[#00FF88] outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00FF88] text-black text-sm font-extrabold shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:brightness-110 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
