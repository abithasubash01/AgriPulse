import React, { useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { useBuyer } from '../../../context/BuyerContext';
import { LoadingState, EmptyState } from '../shared/StateComponents';

const STATUS_ICONS = {
  Active: { icon: Truck, color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30' },
  Completed: { icon: CheckCircle2, color: 'text-[#00FF88]', bg: 'bg-emerald-500/15 border-emerald-500/30' },
};

export const Orders = () => {
  const { orders, loading, loadOrders } = useBuyer();

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-tech">My Orders</h1>
        <p className="text-sm text-gray-400 mt-1">Manage active deliveries and completed purchases.</p>
      </div>

      {loading.orders ? (
        <LoadingState message="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState 
          icon={ShoppingBag} 
          title="No orders yet" 
          message="Once a farmer accepts your purchase request, the active order will appear here." 
        />
      ) : (
        <div className="grid gap-4">
          {orders.map(order => {
            const cfg = STATUS_ICONS[order.status] || STATUS_ICONS.Active;
            const Icon = cfg.icon;

            return (
              <div key={order.id} className="glass-panel rounded-xl p-5 border-l-4 border-l-cyan-500">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-base">
                        {order.crop} <span className="text-gray-400 font-normal">({order.variety})</span>
                      </h3>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-900/40 p-3 rounded-xl border border-gray-800">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Quantity</p>
                        <p className="text-sm font-bold text-white font-tech">{order.quantityKg.toLocaleString()} kg</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Price</p>
                        <p className="text-sm font-bold text-white font-tech">₹{order.pricePerKg}/kg</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Total Value</p>
                        <p className="text-sm font-bold text-[#00FF88] font-tech">₹{order.totalValue.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Order ID</p>
                        <p className="text-xs font-mono text-cyan-400">{order.id.split('-')[1]}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Farmer: {order.farmerName} ({order.farmerLocation})</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Expected: {order.expectedDelivery}</span>
                    </div>

                    {order.notes && (
                      <p className="text-xs text-gray-500 bg-gray-900/60 p-2 rounded border border-gray-800 mt-2">
                        {order.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <button className="w-full px-4 py-2 rounded-xl border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition-all">
                      View Details
                    </button>
                    {order.status === 'Active' && (
                      <button className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:text-white transition-all">
                        Contact Farmer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
