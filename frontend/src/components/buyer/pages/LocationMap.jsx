import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useBuyer } from '../../../context/BuyerContext';

export const LocationMap = () => {
  const { navigate } = useBuyer();

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-tech">Map View</h1>
        <p className="text-sm text-gray-400 mt-1">Geographic view of farmers and your requirements.</p>
      </div>

      <div className="flex-1 glass-panel rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center border-dashed border-cyan-500/30">
        
        {/* Mock Map Background Grid */}
        <div className="absolute inset-0 cyber-grid-bg opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 rounded-2xl bg-gray-900/80 border border-gray-800 max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Map Integration Planned</h3>
          <p className="text-sm text-gray-400 mb-6">
            This module will display a live map (Google Maps / Leaflet) showing farmers in your radius based on active requirements.
          </p>
          
          <button 
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-sm font-bold hover:text-white transition-all cursor-not-allowed opacity-70"
            disabled
          >
            <Navigation className="w-4 h-4" /> Initialize Map Engine (Coming Soon)
          </button>
        </div>
        
        {/* TODO: 
            import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
            Implement live map clustering here.
        */}
      </div>
    </div>
  );
};
