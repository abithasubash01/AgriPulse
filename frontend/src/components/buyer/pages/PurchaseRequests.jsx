import React, { useEffect } from 'react';
import { SendHorizonal, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';
import { useBuyer } from '../../../context/BuyerContext';
import { LoadingState, EmptyState } from '../shared/StateComponents';

const STATUS_ICONS = {
  Pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  Accepted: { icon: CheckCircle2, color: 'text-[#00FF88]', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  Rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
};

export const PurchaseRequests = () => {
  const { requests, loading, loadRequests } = useBuyer();

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-tech">Purchase Requests</h1>
        <p className="text-sm text-gray-400 mt-1">Status of bulk requests sent to farmers.</p>
      </div>

      {loading.requests ? (
        <LoadingState message="Loading requests..." />
      ) : requests.length === 0 ? (
        <EmptyState 
          icon={SendHorizonal} 
          title="No requests sent" 
          message="When you select farmers and match quantities, your sent requests will appear here." 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map(req => {
            const cfg = STATUS_ICONS[req.status] || STATUS_ICONS.Pending;
            const Icon = cfg.icon;

            return (
              <div key={req.id} className="glass-panel rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{req.farmerName}</h3>
                    <p className="text-xs text-gray-500">{req.farmerLocation}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${cfg.bg} ${cfg.color}`}>
                    <Icon className="w-3 h-3" /> {req.status}
                  </span>
                </div>

                <div className="bg-gray-900/60 rounded-xl p-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Crop</p>
                    <p className="text-sm font-bold text-white">{req.crop}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Qty</p>
                    <p className="text-sm font-bold text-cyan-300 font-tech">{req.requestedQtyKg.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Price/kg</p>
                    <p className="text-sm font-bold text-[#00FF88] font-tech">₹{req.pricePerKg}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-gray-800 pt-3 mt-1">
                  <div className="text-gray-400">
                    Sent: {req.sentAt}
                    {req.respondedAt && <span className="ml-2">· Replied: {req.respondedAt}</span>}
                  </div>
                  <div className="font-bold">
                    Total: <span className="text-white font-tech text-sm">₹{req.totalValue.toLocaleString('en-IN')}</span>
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
