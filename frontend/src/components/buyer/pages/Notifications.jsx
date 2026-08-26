import React, { useEffect } from 'react';
import { Bell, Check, Info, CheckCircle2, TrendingDown, Target, ShoppingBag } from 'lucide-react';
import { useBuyer } from '../../../context/BuyerContext';
import { LoadingState, EmptyState } from '../shared/StateComponents';

const ICON_MAP = {
  request_accepted: { icon: CheckCircle2, color: 'text-[#00FF88]', bg: 'bg-emerald-500/20' },
  requirement_matched: { icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  request_rejected: { icon: Info, color: 'text-red-400', bg: 'bg-red-500/20' },
  price_alert: { icon: TrendingDown, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  order_update: { icon: ShoppingBag, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  new_match: { icon: Bell, color: 'text-blue-400', bg: 'bg-blue-500/20' },
};

export const Notifications = () => {
  const { notifications, loading, loadNotifications, markNotificationRead, markAllNotificationsRead } = useBuyer();

  useEffect(() => {
    loadNotifications();
  }, []);

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-tech">Notifications</h1>
          <p className="text-sm text-gray-400 mt-1">Alerts, matches, and order updates.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-400 hover:bg-cyan-500/10 transition-all border border-transparent hover:border-cyan-500/30"
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {loading.notifications ? (
        <LoadingState message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="All caught up" message="You have no notifications right now." />
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => {
            const cfg = ICON_MAP[notif.type] || { icon: Bell, color: 'text-gray-400', bg: 'bg-gray-800' };
            const Icon = cfg.icon;

            return (
              <div 
                key={notif.id} 
                onClick={() => !notif.read && markNotificationRead(notif.id)}
                className={`glass-panel rounded-xl p-4 flex gap-4 transition-all duration-300 ${
                  !notif.read 
                    ? 'border-l-4 border-l-[#00FF88] bg-[#00FF88]/5 cursor-pointer' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className={`text-sm font-bold ${!notif.read ? 'text-white' : 'text-gray-300'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">{formatTime(notif.createdAt)}</span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${!notif.read ? 'text-gray-300' : 'text-gray-500'}`}>
                    {notif.message}
                  </p>
                </div>

                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-[#00FF88] self-center flex-shrink-0 shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
