import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BuyerProvider, useBuyer, BUYER_VIEWS } from '../../context/BuyerContext';
import { BuyerLayout } from './BuyerLayout';

// Pages
import { BuyerHome } from './pages/BuyerHome';
import { FindFarmers } from './pages/FindFarmers';
import { CreateRequirement } from './pages/CreateRequirement';
import { MatchingFarmers } from './pages/MatchingFarmers';
import { BulkMatching } from './pages/BulkMatching';
import { FarmerDetails } from './pages/FarmerDetails';
import { MyRequirements } from './pages/MyRequirements';
import { PurchaseRequests } from './pages/PurchaseRequests';
import { Orders } from './pages/Orders';
import { Notifications } from './pages/Notifications';
import { BuyerProfile } from './pages/BuyerProfile';
import { LocationMap } from './pages/LocationMap';

const BuyerRouter = () => {
  const { buyerView } = useBuyer();
  const { user, setIsAuthModalOpen } = useAuth();

  // Auth Guard
  if (!user?.isLoggedIn) {
    return (
      <div className="h-screen bg-[#070A12] flex flex-col items-center justify-center p-4">
        <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-[0_0_40px_rgba(0,255,136,0.15)]">
          <div className="w-16 h-16 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 mx-auto flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-xl font-extrabold text-white font-tech">Buyer Access Required</h2>
          <p className="text-sm text-gray-400">
            Please log in with your phone number to access the bulk sourcing and matching platform.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full mt-4 py-3 rounded-xl bg-[#00FF88] text-black text-sm font-extrabold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]"
          >
            Login / Register
          </button>
        </div>
      </div>
    );
  }

  // Sub-routing
  const renderView = () => {
    switch (buyerView) {
      case BUYER_VIEWS.HOME: return <BuyerHome />;
      case BUYER_VIEWS.FIND_FARMERS: return <FindFarmers />;
      case BUYER_VIEWS.CREATE_REQUIREMENT: return <CreateRequirement />;
      case BUYER_VIEWS.MATCHING_FARMERS: return <MatchingFarmers />;
      case BUYER_VIEWS.BULK_MATCHING: return <BulkMatching />;
      case BUYER_VIEWS.FARMER_DETAILS: return <FarmerDetails />;
      case BUYER_VIEWS.MY_REQUIREMENTS: return <MyRequirements />;
      case BUYER_VIEWS.PURCHASE_REQUESTS: return <PurchaseRequests />;
      case BUYER_VIEWS.ORDERS: return <Orders />;
      case BUYER_VIEWS.NOTIFICATIONS: return <Notifications />;
      case BUYER_VIEWS.PROFILE: return <BuyerProfile />;
      case BUYER_VIEWS.MAP: return <LocationMap />;
      default: return <BuyerHome />;
    }
  };

  return (
    <BuyerLayout>
      {renderView()}
    </BuyerLayout>
  );
};

export const BuyerDashboardRoot = () => {
  return (
    <BuyerProvider>
      <BuyerRouter />
    </BuyerProvider>
  );
};
