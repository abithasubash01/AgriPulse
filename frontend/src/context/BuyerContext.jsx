import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getRequirements,
  getMatches,
  getRequests,
  getOrders,
  getNotifications,
  createRequirement as apiCreateRequirement,
  sendRequests as apiSendRequests,
} from '../services/buyerService';

// ─── Context ─────────────────────────────────────────────────

const BuyerContext = createContext();

// ─── Views ───────────────────────────────────────────────────

export const BUYER_VIEWS = {
  HOME: 'home',
  FIND_FARMERS: 'find-farmers',
  CREATE_REQUIREMENT: 'create-requirement',
  MATCHING_FARMERS: 'matching-farmers',
  BULK_MATCHING: 'bulk-matching',
  FARMER_DETAILS: 'farmer-details',
  MY_REQUIREMENTS: 'my-requirements',
  PURCHASE_REQUESTS: 'purchase-requests',
  ORDERS: 'orders',
  NOTIFICATIONS: 'notifications',
  PROFILE: 'profile',
  MAP: 'map',
};

// ─── Provider ────────────────────────────────────────────────

export const BuyerProvider = ({ children }) => {
  // Sub-page routing
  const [buyerView, setBuyerView] = useState(BUYER_VIEWS.HOME);
  const [viewHistory, setViewHistory] = useState([]);

  // Active requirement being worked on
  const [activeRequirement, setActiveRequirement] = useState(null);

  // Active farmer being viewed
  const [activeFarmer, setActiveFarmer] = useState(null);

  // Multi-select: farmers selected for bulk matching
  // Array of { farmer, cropListing, contributedQtyKg }
  const [selectedFarmers, setSelectedFarmers] = useState([]);

  // Search / filter state (persisted across find-farmers nav)
  const [searchFilters, setSearchFilters] = useState({
    crop: '',
    quantityKg: '',
    maxPricePerKg: '',
    location: '',
    maxDistanceKm: 50,
    neededBy: '',
  });

  // Data states
  const [requirements, setRequirements] = useState([]);
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [farmers, setFarmers] = useState([]);

  // Loading / error states
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  // Sidebar open state (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ─── Navigation ────────────────────────────────────────────

  const navigate = useCallback((view, params = {}) => {
    setViewHistory((prev) => [...prev, buyerView]);
    setBuyerView(view);
    if (params.requirement) setActiveRequirement(params.requirement);
    if (params.farmer) setActiveFarmer(params.farmer);
    setSidebarOpen(false);
  }, [buyerView]);

  const goBack = useCallback(() => {
    const prev = viewHistory[viewHistory.length - 1];
    if (prev) {
      setBuyerView(prev);
      setViewHistory((h) => h.slice(0, -1));
    } else {
      setBuyerView(BUYER_VIEWS.HOME);
    }
  }, [viewHistory]);

  // ─── Multi-Select (Bulk Matching) ───────────────────────────

  const toggleFarmerSelection = useCallback((farmer, cropListing) => {
    setSelectedFarmers((prev) => {
      const exists = prev.find((s) => s.farmer.id === farmer.id);
      if (exists) {
        return prev.filter((s) => s.farmer.id !== farmer.id);
      }
      return [
        ...prev,
        {
          farmer,
          cropListing,
          contributedQtyKg: Math.min(
            cropListing.availableQty,
            activeRequirement?.quantityKg || cropListing.availableQty,
          ),
        },
      ];
    });
  }, [activeRequirement]);

  const updateContributedQty = useCallback((farmerId, qty) => {
    setSelectedFarmers((prev) =>
      prev.map((s) =>
        s.farmer.id === farmerId ? { ...s, contributedQtyKg: Number(qty) } : s,
      ),
    );
  }, []);

  const clearSelectedFarmers = useCallback(() => {
    setSelectedFarmers([]);
  }, []);

  // Derived quantity stats
  const matchedQtyKg = selectedFarmers.reduce(
    (sum, s) => sum + (s.contributedQtyKg || 0),
    0,
  );
  const requiredQtyKg = activeRequirement?.quantityKg || 0;
  const remainingQtyKg = Math.max(0, requiredQtyKg - matchedQtyKg);
  const progressPct =
    requiredQtyKg > 0 ? Math.min(100, (matchedQtyKg / requiredQtyKg) * 100) : 0;
  const isFullyMatched = requiredQtyKg > 0 && remainingQtyKg === 0;

  // ─── Data Loaders ───────────────────────────────────────────

  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));
  const setErr = (key, val) => setErrors((p) => ({ ...p, [key]: val }));

  const loadRequirements = useCallback(async () => {
    setLoad('requirements', true);
    setErr('requirements', null);
    try {
      const res = await getRequirements();
      setRequirements(res.data || []);
    } catch (e) {
      setErr('requirements', e.message);
    } finally {
      setLoad('requirements', false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    setLoad('requests', true);
    setErr('requests', null);
    try {
      const res = await getRequests();
      setRequests(res.data || []);
    } catch (e) {
      setErr('requests', e.message);
    } finally {
      setLoad('requests', false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoad('orders', true);
    setErr('orders', null);
    try {
      const res = await getOrders();
      setOrders(res.data || []);
    } catch (e) {
      setErr('orders', e.message);
    } finally {
      setLoad('orders', false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoad('notifications', true);
    setErr('notifications', null);
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (e) {
      setErr('notifications', e.message);
    } finally {
      setLoad('notifications', false);
    }
  }, []);

  // ─── Actions ────────────────────────────────────────────────

  const createRequirement = useCallback(async (payload) => {
    const res = await apiCreateRequirement(payload);
    const newReq = res.data;
    setRequirements((prev) => [newReq, ...prev]);
    return newReq;
  }, []);

  const cancelRequirement = useCallback((id) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Cancelled' } : r)),
    );
  }, []);

  const sendBulkRequests = useCallback(async () => {
    if (!activeRequirement || selectedFarmers.length === 0) return;
    const payload = selectedFarmers.map((s) => ({
      farmerId: s.farmer.id,
      listingId: s.cropListing.id,
      crop: s.cropListing.cropName,
      quantityKg: s.contributedQtyKg,
      pricePerKg: s.cropListing.pricePerKg,
      requirementId: activeRequirement.id,
    }));
    const results = await apiSendRequests(payload);
    setRequests((prev) => [...results, ...prev]);

    // Update requirement's matched qty and status
    const newMatchedQty = (activeRequirement.matchedQtyKg || 0) + matchedQtyKg;
    const newStatus =
      newMatchedQty >= activeRequirement.quantityKg
        ? 'Fully Matched'
        : newMatchedQty > 0
        ? 'Partially Matched'
        : 'Active';

    setRequirements((prev) =>
      prev.map((r) =>
        r.id === activeRequirement.id
          ? {
              ...r,
              matchedQtyKg: newMatchedQty,
              farmerCount: (r.farmerCount || 0) + selectedFarmers.length,
              status: newStatus,
            }
          : r,
      ),
    );

    clearSelectedFarmers();
    return results;
  }, [activeRequirement, selectedFarmers, matchedQtyKg, clearSelectedFarmers]);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ─── Context Value ──────────────────────────────────────────

  return (
    <BuyerContext.Provider
      value={{
        // Navigation
        buyerView,
        navigate,
        goBack,
        viewHistory,
        sidebarOpen,
        setSidebarOpen,

        // Active items
        activeRequirement,
        setActiveRequirement,
        activeFarmer,
        setActiveFarmer,

        // Multi-select / bulk matching
        selectedFarmers,
        toggleFarmerSelection,
        updateContributedQty,
        clearSelectedFarmers,
        matchedQtyKg,
        requiredQtyKg,
        remainingQtyKg,
        progressPct,
        isFullyMatched,

        // Filters
        searchFilters,
        setSearchFilters,

        // Data
        requirements,
        setRequirements,
        requests,
        setRequests,
        orders,
        setOrders,
        notifications,
        setNotifications,
        farmers,
        setFarmers,

        // Loading & errors
        loading,
        errors,

        // Loaders
        loadRequirements,
        loadRequests,
        loadOrders,
        loadNotifications,

        // Actions
        createRequirement,
        cancelRequirement,
        sendBulkRequests,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
      }}
    >
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyer = () => useContext(BuyerContext);
