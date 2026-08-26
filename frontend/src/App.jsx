import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { CyberBackground } from './components/CyberBackground';
import { Header } from './components/Header';
import { FarmerDashboard } from './components/FarmerDashboard';
import { MandiExplorer } from './components/MandiExplorer';
import { MandiComparison } from './components/MandiComparison';
import { Marketplace } from './components/Marketplace';
import { AlertsManager } from './components/AlertsManager';
import { WeatherWidget } from './components/WeatherWidget';
import { AIDiseaseScanner } from './components/AIDiseaseScanner';
import { GovtSchemes } from './components/GovtSchemes';
import { AuthModal } from './components/AuthModal';
import { VoiceAssistant } from './components/VoiceAssistant';
import { BuyerDashboardRoot } from './components/buyer/BuyerDashboardRoot';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const MainContent = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="relative z-10 min-h-screen flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Weather Widget Bar (Always visible on Dashboard and Mandi pages) */}
          {(activeTab === 'dashboard' || activeTab === 'explorer') && (
            <WeatherWidget />
          )}

          {/* Active Tab Router */}
          {activeTab === 'dashboard' && <FarmerDashboard />}
          {activeTab === 'explorer' && <MandiExplorer />}
          {activeTab === 'comparison' && <MandiComparison />}
          {activeTab === 'marketplace' && <Marketplace />}
          {activeTab === 'alerts' && <AlertsManager />}
          {activeTab === 'health' && <AIDiseaseScanner />}
          {activeTab === 'schemes' && <GovtSchemes />}
          {activeTab === 'buyer' && <BuyerDashboardRoot />}

        </main>
      </div>

      {/* Futuristic Cyber Footer */}
      <footer className="glass-panel border-t border-cyan-500/20 py-6 mt-12 bg-[#0B0F19]/90 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#00FF88] font-tech text-base">AgriPulse</span>
            <span>&copy; 2026 Pan-India Mandi SaaS Platform</span>
          </div>
          <p className="text-gray-500">
            Powered by Agmarknet & Open Government Data (`data.gov.in`) | Built for Indian Farmers & Traders
          </p>
        </div>
      </footer>

      {/* Floating Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel glass-card-glow-green px-5 py-3 rounded-2xl border border-emerald-500/50 text-[#00FF88] text-xs font-extrabold shadow-[0_0_20px_rgba(0,255,136,0.4)] animate-bounce flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AuthModal />
      <VoiceAssistant />

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <div className="relative min-h-screen bg-[#0B0F19] text-gray-100 selection:bg-cyan-500 selection:text-black">
            <CyberBackground />
            <MainContent />
          </div>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
