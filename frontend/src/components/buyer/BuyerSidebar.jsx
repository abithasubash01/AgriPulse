import React from 'react';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  ListChecks,
  SendHorizonal,
  ShoppingBag,
  Bell,
  UserCircle,
  MapPin,
  Sprout,
  X,
  ChevronRight,
} from 'lucide-react';
import { useBuyer, BUYER_VIEWS } from '../../context/BuyerContext';
import { useApp } from '../../context/AppContext';

const navItems = [
  { id: BUYER_VIEWS.HOME, label: 'Dashboard', icon: LayoutDashboard },
  { id: BUYER_VIEWS.FIND_FARMERS, label: 'Find Farmers', icon: Search },
  { id: BUYER_VIEWS.CREATE_REQUIREMENT, label: 'Create Requirement', icon: PlusCircle },
  { id: BUYER_VIEWS.MY_REQUIREMENTS, label: 'My Requirements', icon: ListChecks },
  { id: BUYER_VIEWS.PURCHASE_REQUESTS, label: 'Purchase Requests', icon: SendHorizonal },
  { id: BUYER_VIEWS.ORDERS, label: 'Orders', icon: ShoppingBag },
  { id: BUYER_VIEWS.NOTIFICATIONS, label: 'Notifications', icon: Bell, badge: true },
  { id: BUYER_VIEWS.PROFILE, label: 'My Profile', icon: UserCircle },
  { id: BUYER_VIEWS.MAP, label: 'Map View', icon: MapPin },
];

export const BuyerSidebar = () => {
  const { buyerView, navigate, sidebarOpen, setSidebarOpen, unreadCount } = useBuyer();
  const { setActiveTab } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 w-72 bg-[#070A12] border-r border-cyan-500/15
          flex flex-col transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-[#00FF88]">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#00FF88] via-cyan-400 to-emerald-400 font-tech">
                AgriPulse
              </span>
              <p className="text-[10px] text-cyan-400/70 font-mono tracking-widest uppercase">Buyer Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const isActive = buyerView === id;
            return (
              <button
                key={id}
                id={`buyer-nav-${id}`}
                onClick={() => navigate(id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 shadow-[0_0_12px_rgba(0,255,136,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00FF88]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span>{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {badge && unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#00FF88] text-black min-w-[18px] text-center shadow-[0_0_8px_rgba(0,255,136,0.5)]">
                      {unreadCount}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 text-[#00FF88]/60" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Back to Farmer View */}
        <div className="px-3 py-4 border-t border-gray-800/80">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-gray-800/60 transition-all"
          >
            <Sprout className="w-4 h-4" />
            <span>Switch to Farmer View</span>
          </button>
        </div>
      </aside>
    </>
  );
};
