import React, { useState } from 'react';
import { 
  Bell, 
  PlusCircle, 
  CheckCircle2, 
  Smartphone, 
  Send, 
  Sparkles, 
  AlertTriangle,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { COMMODITIES_LIST, INITIAL_MANDI_PRICES } from '../data/mockMandiData';

export const AlertsManager = () => {
  const { t } = useLanguage();
  const { alerts, addAlert, showToast } = useApp();

  const [commodity, setCommodity] = useState('Onion');
  const [mandi, setMandi] = useState('Lasalgaon APMC');
  const [targetPrice, setTargetPrice] = useState(2500);
  const [smsPreview, setSmsPreview] = useState(null);

  const handleCreateAlert = (e) => {
    e.preventDefault();
    addAlert({
      commodity,
      mandi,
      targetPrice: Number(targetPrice),
      currentPrice: 2200,
    });
  };

  const triggerTestSMS = (alertItem) => {
    const message = `🔔 AgriPulse Alert: ${alertItem.commodity} at ${alertItem.mandi} has crossed your target price! Current Price: ₹${alertItem.targetPrice + 50}/Qtl. Sell now for maximum profit!`;
    setSmsPreview(message);
    showToast("📱 SMS Alert Dispatch Triggered!");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Create Alert Form */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-tech flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#00FF88]" />
            Smart Price Alerts & SMS Notifications
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Get instant in-app & SMS alerts as soon as mandi prices reach your target profit threshold.
          </p>
        </div>

        <form onSubmit={handleCreateAlert} className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          
          {/* Commodity Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">{t('cropName')}</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {COMMODITIES_LIST.map(c => (
                <option key={c.id} value={c.name.split(' ')[0]}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Mandi Yard */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Target Mandi Yard</label>
            <select
              value={mandi}
              onChange={(e) => setMandi(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {INITIAL_MANDI_PRICES.map(m => (
                <option key={m.id} value={m.market}>{m.market} ({m.state})</option>
              ))}
            </select>
          </div>

          {/* Target Price */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Target Price (₹/Quintal)</label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Create Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Activate Price Watch</span>
            </button>
          </div>

        </form>
      </div>

      {/* Active Price Alert Watches */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <h3 className="text-lg font-bold text-white font-tech flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" /> Active Price Watches ({alerts.length})
          </h3>
          <span className="text-xs text-gray-400">Automatic Mandi Polling Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((a) => (
            <div 
              key={a.id}
              className="glass-panel p-5 rounded-2xl border border-gray-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    {a.commodity}
                  </span>
                  <h4 className="text-base font-extrabold text-white font-tech mt-1">{a.mandi}</h4>
                  <p className="text-xs text-gray-400">Target Threshold: <span className="text-[#00FF88] font-bold">₹{a.targetPrice} / Qtl</span></p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  a.status.includes('Triggered')
                    ? 'bg-emerald-500/20 text-[#00FF88] border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {a.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Created: {a.date}</span>
                
                <button
                  onClick={() => triggerTestSMS(a)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-950/60 text-purple-300 border border-purple-500/40 hover:bg-purple-900 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Test Dispatch SMS</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated SMS Preview Banner */}
      {smsPreview && (
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/40 bg-purple-950/30 text-purple-200 animate-fadeIn flex items-start space-x-3">
          <Smartphone className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-300">Simulated SMS Push Payload</h4>
            <p className="text-sm font-mono mt-1 text-white">{smsPreview}</p>
          </div>
          <button onClick={() => setSmsPreview(null)} className="text-xs text-purple-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

    </div>
  );
};
