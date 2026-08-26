import React from 'react';
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain, 
  MapPin, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WeatherWidget = () => {
  const { user } = useAuth();

  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-3">
        <div>
          <h3 className="text-xl font-bold text-white font-tech flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-amber-400" />
            Weather & Crop Harvest Advisory
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time micro-climate forecast for <span className="text-cyan-300 font-semibold">{user?.location || "Nashik, Maharashtra"}</span>
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-[#00FF88] border border-emerald-500/40">
          Optimal Harvest Windows ☀️
        </span>
      </div>

      {/* Main Weather Metrics Stack */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Temperature */}
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Temperature</span>
            <p className="text-xl font-extrabold text-white font-tech">31°C</p>
          </div>
        </div>

        {/* Rain Probability */}
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Rain Chance</span>
            <p className="text-xl font-extrabold text-cyan-300 font-tech">12%</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-[#00FF88]">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Humidity</span>
            <p className="text-xl font-extrabold text-white font-tech">64%</p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Wind Speed</span>
            <p className="text-xl font-extrabold text-white font-tech">14 km/h</p>
          </div>
        </div>

      </div>

      {/* Actionable Farmers Advisory */}
      <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
        <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#00FF88]" /> Daily Agri Action Tip
        </h4>
        <p className="text-xs text-gray-200">
          Clear sunny conditions expected for the next 48 hours. Excellent window for harvesting and sun-drying **Onion, Paddy & Wheat**. Transport trucks can move on dry mandi roads.
        </p>
      </div>

    </div>
  );
};
