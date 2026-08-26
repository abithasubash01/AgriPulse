import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Award, 
  X,
  Send,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { COMMODITIES_LIST } from '../data/mockMandiData';

export const Marketplace = () => {
  const { t } = useLanguage();
  const { listings, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [contactModalData, setContactModalData] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Filter listings
  const filteredListings = listings.filter(item => {
    const matchCrop = selectedCrop ? item.commodity.toLowerCase().includes(selectedCrop.toLowerCase()) : true;
    const matchSearch = searchTerm 
      ? item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchCrop && matchSearch;
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, { sender: 'me', text: chatMessage, time: 'Just now' }]);
    const currentMessage = chatMessage;
    setChatMessage('');

    try {
      const u = JSON.parse(localStorage.getItem('agripulse_user'));
      if (u && u.accessToken && contactModalData?.id) {
        await fetch('http://localhost:5000/api/buyer/enquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${u.accessToken}`
          },
          body: JSON.stringify({
            listingId: contactModalData.id,
            message: currentMessage
          })
        });
      }
    } catch (err) {
      console.warn("Failed to send enquiry to backend:", err);
    }

    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        sender: 'farmer', 
        text: `Namaste! I have received your offer for ${contactModalData.commodity}. I will call you back shortly.`,
        time: 'Just now' 
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Filter Controls */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white font-tech flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#00FF88]" />
              {t('marketplace')} Feed
            </h2>
            <p className="text-xs text-gray-400">
              Direct farmer produce feed. Buy directly from verified farmers without middlemen margins.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            {filteredListings.length} Active Listings
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search crop, farmer name or region..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-900/90 border border-cyan-500/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Crop Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3 pointer-events-none" />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-900/90 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
            >
              <option value="">All Crop Categories</option>
              {COMMODITIES_LIST.map(c => (
                <option key={c.id} value={c.name.split(' ')[0]}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center text-xs text-gray-400 space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
            <span>100% Phone Verified Farmers & Mandi Traders</span>
          </div>

        </div>
      </div>

      {/* Produce Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div 
            key={item.id}
            className="glass-panel rounded-3xl overflow-hidden border border-gray-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Image Header */}
            <div className="relative h-48 w-full bg-gray-900">
              <img 
                src={item.photos?.[0] || "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600"} 
                alt={item.commodity} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-black/20 to-transparent" />
              
              {/* Quality Grade Tag */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-black/70 text-[#00FF88] border border-emerald-500/40 backdrop-blur-md">
                  {item.qualityGrade}
                </span>
              </div>

              {/* Asking Price Badge */}
              <div className="absolute bottom-3 right-3">
                <span className="px-3 py-1 rounded-xl text-sm font-extrabold bg-[#00FF88] text-black shadow-[0_0_12px_rgba(0,255,136,0.5)] font-mono">
                  ₹{item.askingPrice} <span className="text-[10px]">/Qtl</span>
                </span>
              </div>
            </div>

            {/* Seller & Produce Info Body */}
            <div className="p-5 space-y-3">
              
              {/* Farmer Info Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-[#00FF88] border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                    {item.farmerName[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      {item.farmerName} <UserCheck className="w-3 h-3 text-cyan-400" />
                    </h4>
                    <div className="flex items-center text-[10px] text-amber-400 gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.rating || '4.9'} ({item.dealsCompleted || 12} deals)</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> {item.location}
                </span>
              </div>

              {/* Crop Specs */}
              <div>
                <h3 className="text-xl font-extrabold text-white font-tech">
                  {item.commodity} ({item.variety})
                </h3>
                <p className="text-xs text-gray-300 font-semibold mt-1">
                  Available Quantity: <span className="text-[#00FF88] font-mono">{item.quantity} Quintals</span>
                </p>
                {item.notes && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

            </div>

            {/* Action Buttons Footer */}
            <div className="p-4 bg-gray-900/80 border-t border-gray-800 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  showToast(`Verified Phone: +91 ${item.phone}`);
                }}
                className="py-2 rounded-xl text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Show Phone</span>
              </button>

              <button
                onClick={() => setContactModalData(item)}
                className="py-2 rounded-xl text-xs font-extrabold bg-[#00FF88] text-black shadow-[0_0_12px_rgba(0,255,136,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Inquire Deal</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Inquire Deal Drawer Modal */}
      {contactModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-cyan-500/30 p-6 space-y-4 bg-[#0B0F19]/95 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#00FF88]" />
                <h3 className="text-lg font-bold text-white font-tech">Contact {contactModalData.farmerName}</h3>
              </div>
              <button 
                onClick={() => setContactModalData(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{contactModalData.commodity} - {contactModalData.variety}</p>
                <p className="text-xs text-gray-400">{contactModalData.quantity} Quintals @ ₹{contactModalData.askingPrice}/Qtl</p>
              </div>
              <a 
                href={`tel:+91${contactModalData.phone}`}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-[#00FF88] border border-emerald-500/40 text-xs font-bold flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> Call Now
              </a>
            </div>

            {/* Direct Message Simulation Box */}
            <div className="h-44 bg-gray-950 p-3 rounded-2xl border border-gray-800 overflow-y-auto space-y-2 text-xs">
              <div className="bg-gray-900 p-2.5 rounded-xl text-gray-300 border border-gray-800">
                👋 Hello! You are inquiring about {contactModalData.commodity} from {contactModalData.location}.
              </div>
              {chatHistory.map((c, i) => (
                <div 
                  key={i} 
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    c.sender === 'me' 
                      ? 'ml-auto bg-cyan-950 text-cyan-200 border border-cyan-500/30' 
                      : 'bg-emerald-950 text-emerald-200 border border-emerald-500/30'
                  }`}
                >
                  {c.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your price offer or inquiry..."
                className="flex-1 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00FF88] text-black text-xs font-bold hover:brightness-110 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
