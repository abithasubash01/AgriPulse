// ============================================================
// BUYER API SERVICE
// All buyer-facing API calls go through this module.
// Each function tries the real backend endpoint first.
// On failure or when mock data is sufficient, it falls back
// to the local mock data — clearly labeled in console logs.
//
// TO SWAP IN REAL BACKEND: Implement the missing endpoints
// listed in the implementation plan and remove mock fallbacks.
// ============================================================

import {
  MOCK_FARMERS,
  MOCK_REQUIREMENTS,
  MOCK_REQUESTS,
  MOCK_ORDERS,
  MOCK_NOTIFICATIONS,
} from '../data/mockBuyerData';

const API_URL = 'http://localhost:5000/api';

// ─── Helper ────────────────────────────────────────────────

const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('agripulse_user'));
    return user?.accessToken || null;
  } catch {
    return null;
  }
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// ─── Match Score (Frontend Filter Score — NOT AI) ───────────
// Labeled clearly as a demonstration filter score:
// 40% price fit + 30% distance fit + 30% quantity fit
export const computeMatchScore = (farmer, filters) => {
  const { crop, maxPricePerKg, maxDistanceKm, quantityKg } = filters;
  const cropListing = farmer.crops.find(
    (c) => c.cropName.toLowerCase() === crop?.toLowerCase(),
  );
  if (!cropListing) return 0;

  const priceFit =
    maxPricePerKg > 0
      ? Math.max(0, 1 - (cropListing.pricePerKg / maxPricePerKg - 0.7))
      : 1;
  const distanceFit =
    maxDistanceKm > 0
      ? Math.max(0, 1 - farmer.distanceKm / maxDistanceKm)
      : 1;
  const qtyFit =
    quantityKg > 0
      ? Math.min(1, cropListing.availableQty / quantityKg)
      : 1;

  const raw = priceFit * 40 + distanceFit * 30 + qtyFit * 30;
  return Math.round(Math.min(100, Math.max(0, raw)));
};

// ─── Browse Listings / Find Farmers ─────────────────────────
// Maps to: GET /buyer/listings
// Falls back to mock data filtered locally if endpoint fails.
export const browseListings = async (filters = {}) => {
  const { crop, maxPricePerKg, maxDistanceKm, quantityKg, state, district } =
    filters;

  // Try real endpoint (uses existing buyer.routes.js)
  try {
    const params = new URLSearchParams();
    if (crop) params.set('commodity', crop);
    if (maxPricePerKg) params.set('maxPrice', maxPricePerKg);
    if (state) params.set('state', state);
    if (district) params.set('district', district);

    const res = await fetch(`${API_URL}/buyer/listings?${params}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('listings endpoint not ready');
    const data = await res.json();
    if (data?.data?.listings?.length > 0) {
      return { source: 'api', farmers: data.data.listings };
    }
    throw new Error('empty listings');
  } catch (err) {
    console.warn('[buyerService] browseListings falling back to mock:', err.message);
  }

  // Mock fallback — filter locally
  let results = MOCK_FARMERS.map((farmer) => ({
    ...farmer,
    matchScore: computeMatchScore(farmer, filters),
  }));

  if (crop) {
    results = results.filter((f) =>
      f.crops.some((c) => c.cropName.toLowerCase() === crop.toLowerCase()),
    );
  }
  if (maxPricePerKg > 0) {
    results = results.filter((f) =>
      f.crops.some(
        (c) =>
          c.cropName.toLowerCase() === (crop || '').toLowerCase() &&
          c.pricePerKg <= maxPricePerKg,
      ),
    );
  }
  if (maxDistanceKm > 0) {
    results = results.filter((f) => f.distanceKm <= maxDistanceKm);
  }
  if (quantityKg > 0) {
    results = results.filter((f) =>
      f.crops.some((c) => c.availableQty > 0),
    );
  }

  results.sort((a, b) => b.matchScore - a.matchScore);
  return { source: 'mock', farmers: results };
};

// ─── Requirements ────────────────────────────────────────────
// Maps to: POST /buyer/requirements [NOT YET BUILT]
export const createRequirement = async (payload) => {
  try {
    const res = await fetch(`${API_URL}/buyer/requirements`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('requirements endpoint not ready');
    return await res.json();
  } catch (err) {
    console.warn('[buyerService] createRequirement using mock store:', err.message);
    // Return mock-created requirement (caller saves to BuyerContext)
    return {
      source: 'mock',
      data: {
        id: `req-${Date.now()}`,
        ...payload,
        status: 'Active',
        matchedQtyKg: 0,
        farmerCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      },
    };
  }
};

// Maps to: GET /buyer/requirements [NOT YET BUILT]
export const getRequirements = async () => {
  try {
    const res = await fetch(`${API_URL}/buyer/requirements`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('requirements endpoint not ready');
    return await res.json();
  } catch (err) {
    console.warn('[buyerService] getRequirements using mock:', err.message);
    return { source: 'mock', data: MOCK_REQUIREMENTS };
  }
};

// Maps to: GET /buyer/requirements/:id/matches [NOT YET BUILT]
export const getMatches = async (requirementId, filters = {}) => {
  try {
    const res = await fetch(
      `${API_URL}/buyer/requirements/${requirementId}/matches`,
      { headers: authHeaders() },
    );
    if (!res.ok) throw new Error('matches endpoint not ready');
    return await res.json();
  } catch (err) {
    console.warn('[buyerService] getMatches using mock:', err.message);
    const scored = MOCK_FARMERS.map((f) => ({
      ...f,
      matchScore: computeMatchScore(f, filters),
    })).filter((f) => f.matchScore > 0 || !filters.crop);
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return { source: 'mock', data: scored };
  }
};

// ─── Purchase Requests ───────────────────────────────────────
// Maps to: POST /buyer/requests [NOT YET BUILT] (uses /buyer/enquiries as approximation)
export const sendRequests = async (requests) => {
  const results = [];
  for (const req of requests) {
    try {
      // Try the enquiries endpoint as best available approximation
      const res = await fetch(`${API_URL}/buyer/enquiries`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          listingId: req.listingId || req.farmerId,
          message: `Bulk purchase request: ${req.quantityKg} kg of ${req.crop} at ₹${req.pricePerKg}/kg`,
        }),
      });
      if (!res.ok) throw new Error('enquiries endpoint failed');
      results.push({ ...req, status: 'Pending', source: 'api' });
    } catch (err) {
      console.warn('[buyerService] sendRequests using mock store:', err.message);
      results.push({
        id: `preq-${Date.now()}-${req.farmerId}`,
        ...req,
        status: 'Pending',
        sentAt: new Date().toISOString().split('T')[0],
        source: 'mock',
      });
    }
  }
  return results;
};

// Maps to: GET /buyer/requests [NOT YET BUILT]
export const getRequests = async () => {
  try {
    const res = await fetch(`${API_URL}/buyer/requests`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('requests endpoint not ready');
    return await res.json();
  } catch (err) {
    console.warn('[buyerService] getRequests using mock:', err.message);
    return { source: 'mock', data: MOCK_REQUESTS };
  }
};

// ─── Orders ─────────────────────────────────────────────────
// Maps to: GET /marketplace/transactions (role=buyer) [EXISTS]
export const getOrders = async () => {
  try {
    const res = await fetch(`${API_URL}/marketplace/transactions?role=buyer`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('transactions endpoint failed');
    const data = await res.json();
    if (data?.data?.length > 0) return { source: 'api', data: data.data };
    throw new Error('empty');
  } catch (err) {
    console.warn('[buyerService] getOrders using mock:', err.message);
    return { source: 'mock', data: MOCK_ORDERS };
  }
};

// ─── Notifications ───────────────────────────────────────────
// Maps to: GET /notifications/alerts [EXISTS]
export const getNotifications = async () => {
  try {
    const res = await fetch(`${API_URL}/notifications/alerts`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('notifications endpoint failed');
    const data = await res.json();
    if (data?.data?.length > 0) return { source: 'api', data: data.data };
    throw new Error('empty');
  } catch (err) {
    console.warn('[buyerService] getNotifications using mock:', err.message);
    return { source: 'mock', data: MOCK_NOTIFICATIONS };
  }
};

// ─── Profile ────────────────────────────────────────────────
// Maps to: GET /auth/profile + PUT /auth/profile [EXISTS]
export const getProfile = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('profile endpoint failed');
    return await res.json();
  } catch (err) {
    console.warn('[buyerService] getProfile failed:', err.message);
    return null;
  }
};

export const updateProfile = async (payload) => {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Profile update failed');
  }
  return await res.json();
};

// ─── Bookmarks ───────────────────────────────────────────────
// Maps to: POST /buyer/bookmarks/:id [EXISTS]
export const addBookmark = async (listingId) => {
  const res = await fetch(`${API_URL}/buyer/bookmarks/${listingId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Bookmark failed');
  return await res.json();
};
