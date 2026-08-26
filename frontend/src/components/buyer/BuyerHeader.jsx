import React from 'react';
import { Menu, Bell, ChevronLeft, User } from 'lucide-react';
import { useBuyer, BUYER_VIEWS } from '../../context/BuyerContext';
import { useAuth } from '../../context/AuthContext';

const BREADCRUMB_LABELS = {
  [BUYER_VIEWS.HOME]: 'Dashboard',
  [BUYER_VIEWS.FIND_FARMERS]: 'Find Farmers',
  [BUYER_VIEWS.CREATE_REQUIREMENT]: 'Create Requirement',
  [BUYER_VIEWS.MATCHING_FARMERS]: 'Matching Farmers',
  [BUYER_VIEWS.BULK_MATCHING]: 'Bulk Matching',
  [BUYER_VIEWS.FARMER_DETAILS]: 'Farmer Profile',
  [BUYER_VIEWS.MY_REQUIREMENTS]: 'My Requirements',
  [BUYER_VIEWS.PURCHASE_REQUESTS]: 'Purchase Requests',
  [BUYER_VIEWS.ORDERS]: 'Orders',
  [BUYER_VIEWS.NOTIFICATIONS]: 'Notifications',
  [BUYER_VIEWS.PROFILE]: 'My Profile',
  [BUYER_VIEWS.MAP]: 'Map View',
};

export const BuyerHeader = () => {
  const { buyerView, goBack, viewHistory, setSidebarOpen, navigate, unreadCount } = useBuyer();
  const { user } = useAuth();
  const canGoBack = viewHistory.length > 0 && buyerView !== BUYER_VIEWS.HOME;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 h-16 border-b border-cyan-500/15 bg-[#070A12]/90 backdrop-blur-xl">
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          id="buyer-sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {canGoBack && (
          <button
            onClick={goBack}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 text-xs font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Buyer Portal</span>
          <span className="text-gray-700">/</span>
          <span className="font-bold text-white font-tech">
            {BREADCRUMB_LABELS[buyerView] || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          id="buyer-notif-bell"
          onClick={() => navigate(BUYER_VIEWS.NOTIFICATIONS)}
          className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-extrabold bg-[#00FF88] text-black rounded-full shadow-[0_0_8px_rgba(0,255,136,0.6)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <button
          onClick={() => navigate(BUYER_VIEWS.PROFILE)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800/60 border border-gray-700 hover:border-cyan-500/40 transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="hidden sm:block text-xs font-bold text-gray-300 max-w-[100px] truncate">
            {user?.name || 'Buyer'}
          </span>
        </button>
      </div>
    </header>
  );
};
