import React, { useState } from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Truck, 
  ShoppingBag, 
  Bell, 
  ScanLine, 
  Globe, 
  User, 
  LogOut, 
  Volume2, 
  Menu, 
  X,
  CloudSun,
  ShieldCheck,
  Zap,
  ShoppingCart
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const { activeTab, setActiveTab, dataSource, alerts, setIsVoiceOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Sprout },
    { id: 'explorer', label: t('mandiExplorer'), icon: TrendingUp },
    { id: 'comparison', label: t('comparisonView'), icon: Truck },
    { id: 'marketplace', label: t('marketplace'), icon: ShoppingBag },
    { id: 'alerts', label: t('priceAlerts'), icon: Bell, badge: alerts.length },
    { id: 'health', label: t('cropHealth'), icon: ScanLine },
    { id: 'schemes', label: t('schemes'), icon: ShieldCheck },
    { id: 'buyer', label: 'Buyer Portal', icon: ShoppingCart },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'mr', label: 'मराठी' },
    { code: 'te', label: 'తెలుగు' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 bg-[#0B0F19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              <Sprout className="w-8 h-8 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00FF88] rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#00FF88] via-cyan-400 to-emerald-400 font-tech">
                  AgriPulse
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" /> v2.4 SaaS
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-cyan-500/15 text-[#00FF88] border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00FF88]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Live Data Source Indicator */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-gray-900/80 border border-gray-800 text-[11px]">
              <div className={`w-2 h-2 rounded-full ${dataSource === 'api' ? 'bg-[#00FF88] animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-gray-400">Data:</span>
              <span className={`font-semibold ${dataSource === 'api' ? 'text-[#00FF88]' : 'text-amber-400'}`}>
                {dataSource === 'api' ? 'Agmarknet API' : 'Mock Live'}
              </span>
            </div>

            {/* Accessibility Audio Voice Trigger */}
            <button
              onClick={() => setIsVoiceOpen(true)}
              title={t('speakAudio')}
              className="p-2 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-500/30 hover:bg-purple-900/50 hover:text-white transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-cyan-400 absolute left-2.5 pointer-events-none" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-gray-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none shadow-inner"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-gray-900 text-white">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Farmer Auth Profile / Login */}
            {user?.isLoggedIn ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-gray-800">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-200">{user.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+91 {user.phone}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/50 hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-emerald-500 text-black text-xs font-extrabold tracking-wide hover:brightness-110 shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all flex items-center space-x-1.5"
              >
                <User className="w-4 h-4" />
                <span>{t('login')}</span>
              </button>
            )}

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white bg-gray-900 border border-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-t border-cyan-500/20 bg-[#0B0F19]/95 backdrop-blur-2xl space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-[#00FF88] border border-cyan-500/40'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-black">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
