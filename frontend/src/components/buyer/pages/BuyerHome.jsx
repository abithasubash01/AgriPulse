import React, { useEffect } from 'react';
import {
  ListChecks,
  Users,
  SendHorizonal,
  ShoppingBag,
  PlusCircle,
  Search,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useBuyer, BUYER_VIEWS } from '../../../context/BuyerContext';
import { useAuth } from '../../../context/AuthContext';
import { StatCard } from '../shared/StatCard';
import { LoadingState, EmptyState } from '../shared/StateComponents';
import { QuantityProgress } from '../shared/QuantityProgress';

const STATUS_CONFIG = {
  Active: { color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30', icon: Zap },
  'Partially Matched': { color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', icon: AlertCircle },
  'Fully Matched': { color: 'text-[#00FF88]', bg: 'bg-emerald-500/15 border-emerald-500/30', icon: CheckCircle2 },
  Completed: { color: 'text-gray-400', bg: 'bg-gray-700/30 border-gray-600/30', icon: CheckCircle2 },
  Cancelled: { color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', icon: XCircle },
};

const RequirementRow = ({ req, onView }) => {
  const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.Active;
  const StatusIcon = cfg.icon;
  const pct = req.quantityKg > 0 ? Math.min(100, (req.matchedQtyKg / req.quantityKg) * 100) : 0;

  return (
    <div className="glass-panel glass-panel-hover rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="font-bold text-white text-sm">{req.crop}</h4>
          {req.variety && <span className="text-xs text-gray-500">· {req.variety}</span>}
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.color}`}>
            <StatusIcon className="w-3 h-3" />
            {req.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          <span>{req.quantityKg.toLocaleString('en-IN')} kg required</span>
          <span>₹{req.maxPricePerKg}/kg max</span>
          <span>{req.farmerCount} farmer{req.farmerCount !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />By {req.neededBy}</span>
        </div>
        <QuantityProgress
          requiredQtyKg={req.quantityKg}
          matchedQtyKg={req.matchedQtyKg}
          remainingQtyKg={Math.max(0, req.quantityKg - req.matchedQtyKg)}
          progressPct={pct}
          isFullyMatched={pct >= 100}
          compact
        />
      </div>
      <button
        onClick={() => onView(req)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-all whitespace-nowrap"
      >
        View <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const BuyerHome = () => {
  const { user } = useAuth();
  const {
    requirements,
    requests,
    orders,
    loading,
    navigate,
    loadRequirements,
    loadRequests,
    loadOrders,
    setActiveRequirement,
  } = useBuyer();

  useEffect(() => {
    loadRequirements();
    loadRequests();
    loadOrders();
  }, []);

  const activeReqs = requirements.filter((r) => r.status === 'Active').length;
  const matchingFarmers = requirements.reduce((s, r) => s + (r.farmerCount || 0), 0);
  const pendingReqs = requests.filter((r) => r.status === 'Pending').length;
  const activeOrders = orders.filter((o) => o.status === 'Active').length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;

  const recentRequirements = [...requirements].slice(0, 5);

  const handleViewRequirement = (req) => {
    setActiveRequirement(req);
    navigate(BUYER_VIEWS.MATCHING_FARMERS, { requirement: req });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="glass-panel glass-card-glow-green rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[#00FF88] text-sm font-bold font-mono tracking-wider mb-1">
            BUYER PORTAL
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-tech">
            Welcome back, {user?.name?.split(' ')[0] || 'Buyer'} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Find trusted farmers, match bulk quantities, and manage your crop sourcing — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              id="btn-create-requirement"
              onClick={() => navigate(BUYER_VIEWS.CREATE_REQUIREMENT)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-emerald-500 text-black text-sm font-extrabold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,255,136,0.35)]"
            >
              <PlusCircle className="w-4 h-4" />
              Create Requirement
            </button>
            <button
              id="btn-find-farmers"
              onClick={() => navigate(BUYER_VIEWS.FIND_FARMERS)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 text-sm font-bold hover:bg-cyan-500/25 transition-all"
            >
              <Search className="w-4 h-4" />
              Find Farmers
            </button>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-bl from-[#00FF88]/10 via-cyan-500/5 to-transparent rounded-full -translate-y-12 translate-x-12" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ListChecks}
          label="Active Requirements"
          value={loading.requirements ? '—' : activeReqs}
          sub="In sourcing"
          color="cyan"
          onClick={() => navigate(BUYER_VIEWS.MY_REQUIREMENTS)}
        />
        <StatCard
          icon={Users}
          label="Matching Farmers"
          value={loading.requirements ? '—' : matchingFarmers}
          sub="Across requirements"
          color="green"
          onClick={() => navigate(BUYER_VIEWS.FIND_FARMERS)}
        />
        <StatCard
          icon={SendHorizonal}
          label="Pending Requests"
          value={loading.requests ? '—' : pendingReqs}
          sub="Awaiting farmer reply"
          color="amber"
          onClick={() => navigate(BUYER_VIEWS.PURCHASE_REQUESTS)}
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={loading.orders ? '—' : `${activeOrders}A / ${completedOrders}C`}
          sub="Active / Completed"
          color="purple"
          onClick={() => navigate(BUYER_VIEWS.ORDERS)}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Search, label: 'Find Farmers', view: BUYER_VIEWS.FIND_FARMERS, color: 'text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10' },
          { icon: PlusCircle, label: 'New Requirement', view: BUYER_VIEWS.CREATE_REQUIREMENT, color: 'text-[#00FF88] border-[#00FF88]/30 hover:bg-[#00FF88]/10' },
          { icon: ListChecks, label: 'My Requirements', view: BUYER_VIEWS.MY_REQUIREMENTS, color: 'text-amber-400 border-amber-500/30 hover:bg-amber-500/10' },
          { icon: ShoppingBag, label: 'My Orders', view: BUYER_VIEWS.ORDERS, color: 'text-purple-400 border-purple-500/30 hover:bg-purple-500/10' },
        ].map(({ icon: Icon, label, view, color }) => (
          <button
            key={view}
            onClick={() => navigate(view)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border glass-panel text-sm font-semibold transition-all ${color}`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Recent Requirements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-white font-tech flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00FF88]" />
            Recent Requirements
          </h2>
          <button
            onClick={() => navigate(BUYER_VIEWS.MY_REQUIREMENTS)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {loading.requirements ? (
          <LoadingState message="Loading your requirements..." />
        ) : recentRequirements.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No requirements yet"
            message="Create your first bulk crop requirement to start matching with farmers."
            action={{ label: 'Create Requirement', onClick: () => navigate(BUYER_VIEWS.CREATE_REQUIREMENT) }}
          />
        ) : (
          <div className="space-y-3">
            {recentRequirements.map((req) => (
              <RequirementRow key={req.id} req={req} onView={handleViewRequirement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
