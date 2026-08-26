import React, { createContext, useContext, useState, useEffect } from "react";

import {
  INITIAL_FARMER_LISTINGS,
  INITIAL_MANDI_PRICES,
} from "../data/mockMandiData";

const AppContext = createContext();

const API_URL = "http://localhost:5000/api";

// ============================================================
// GET STORED LOGIN TOKEN
// ============================================================

const getStoredToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("agripulse_user"));
    return user?.accessToken || null;
  } catch (error) {
    console.error("Error reading stored user:", error);
    return null;
  }
};

// ============================================================
// APP PROVIDER
// ============================================================

export const AppProvider = ({ children }) => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [listings, setListings] = useState(INITIAL_FARMER_LISTINGS);

  const [mandiPrices, setMandiPrices] = useState(INITIAL_MANDI_PRICES || []);

  const [dataSource, setDataSource] = useState("mock");

  // Mandi pagination state
  const [mandiPage, setMandiPage] = useState(1);
  const [mandiTotalPages, setMandiTotalPages] = useState(1);
  const [mandiTotal, setMandiTotal] = useState(0);
  const [mandiLoading, setMandiLoading] = useState(false);

  // Mandi server-side search and filters
  const [mandiSearch, setMandiSearch] = useState("");
  const [mandiState, setMandiState] = useState("");
  const [mandiDistrict, setMandiDistrict] = useState("");
  const [mandiCommodity, setMandiCommodity] = useState("");

  const [alerts, setAlerts] = useState([
    {
      id: "alt-1",
      commodity: "Onion",
      mandi: "Vashi APMC",
      targetPrice: 2500,
      currentPrice: 2550,
      status: "Triggered 🟢",
      date: "Today, 10:30 AM",
    },
    {
      id: "alt-2",
      commodity: "Wheat",
      mandi: "Abohar",
      targetPrice: 2600,
      currentPrice: 2450,
      status: "Watching ⏳",
      date: "Yesterday",
    },
  ]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [toastMessage, setToastMessage] = useState(null);

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // ==========================================================
  // SHOW TOAST
  // ==========================================================

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // ==========================================================
  // LOAD LIVE MANDI PRICES
  // ==========================================================

  useEffect(() => {
    const loadMandiPrices = async () => {
      try {
        setMandiLoading(true);

        console.log(`📡 Fetching live mandi prices (page ${mandiPage}, search "${mandiSearch}")...`);

        let queryUrl = `${API_URL}/mandi/live?page=${mandiPage}&limit=10`;
        if (mandiSearch) queryUrl += `&search=${encodeURIComponent(mandiSearch)}`;
        if (mandiState) queryUrl += `&state=${encodeURIComponent(mandiState)}`;
        if (mandiDistrict) queryUrl += `&district=${encodeURIComponent(mandiDistrict)}`;
        if (mandiCommodity) queryUrl += `&commodity=${encodeURIComponent(mandiCommodity)}`;

        const response = await fetch(queryUrl);

        const data = await response.json();

        console.log("📡 Mandi API response:", data);

        // Check HTTP status
        if (!response.ok) {
          throw new Error(
            data?.message || `Mandi API returned ${response.status}`,
          );
        }

        // Check whether API returned records
        if (data?.data && Array.isArray(data.data)) {
          if (data.data.length === 0 && !mandiSearch && !mandiState && !mandiDistrict && !mandiCommodity) {
            console.warn("⚠️ Mandi API returned 0 records and no filters active. Using mock data.");
            setMandiPrices(INITIAL_MANDI_PRICES || []);
            setDataSource("mock");
            setMandiTotal(INITIAL_MANDI_PRICES?.length || 0);
            setMandiTotalPages(1);
          } else {
            const normalized = data.data.map((r, index) => ({
              id: r.id || `api-${index}`,

              // Location
              state: r.state ?? "Maharashtra",
              district: r.district ?? "Nashik",
              market: r.market ?? "Mandi Yard",

              // Commodity
              commodity: r.commodity ?? "Onion",
              variety: r.variety ?? "Local",

              // Prices
              // Supports both camelCase and snake_case
              min_price: Number(r.minPrice ?? r.min_price ?? 0),

              max_price: Number(r.maxPrice ?? r.max_price ?? 0),

              modal_price: Number(r.modalPrice ?? r.modal_price ?? 0),

              // Date
              arrival_date: r.arrivalDate ?? r.arrival_date ?? "",

              // Distance
              distance_km: Number(r.distanceKm ?? r.distance_km ?? 0),

              // Coordinates
              latitude: r.latitude ?? null,
              longitude: r.longitude ?? null,

              // Trend
              trend: r.trend ?? "up",
            }));

            console.log("✅ Normalized mandi records:", normalized.length);

            setMandiPrices(normalized);

            setDataSource("api");

            // Store pagination metadata from the API response
            if (data.pagination) {
              setMandiTotal(data.pagination.total || 0);
              setMandiTotalPages(data.pagination.totalPages || 1);
            } else {
              setMandiTotal(normalized.length);
              setMandiTotalPages(1);
            }

            console.log(
              `✅ Live mandi data loaded: ${normalized.length} records (page ${mandiPage})`,
            );
          }
        } else {
          console.warn("⚠️ Mandi API returned 0 records.");

          // Keep mock data
          setMandiPrices(INITIAL_MANDI_PRICES || []);

          setDataSource("mock");
        }
      } catch (error) {
        console.error("❌ Mandi API error:", error);

        console.log("⚠️ Backend unavailable. Using mock mandi data.");

        // Fallback to mock data
        setMandiPrices(INITIAL_MANDI_PRICES || []);

        setDataSource("mock");
      } finally {
        setMandiLoading(false);
      }
    };

    loadMandiPrices();
  }, [mandiPage, mandiSearch, mandiState, mandiDistrict, mandiCommodity]);

  // ==========================================================
  // LOAD LISTINGS
  // ==========================================================

  useEffect(() => {
    const loadListings = async () => {
      const token = getStoredToken();

      // --------------------------------------------------------
      // No login → localStorage
      // --------------------------------------------------------

      if (!token) {
        const saved = localStorage.getItem("agripulse_listings");

        if (saved) {
          try {
            setListings(JSON.parse(saved));
          } catch (error) {
            console.error("Error loading saved listings:", error);
          }
        }

        return;
      }

      // --------------------------------------------------------
      // Logged in → backend
      // --------------------------------------------------------

      try {
        const response = await fetch(`${API_URL}/marketplace/listings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("📦 Listings API response:", data);

        if (response.ok && data?.data?.listings?.length > 0) {
          const formattedListings = data.data.listings.map((listing) => ({
            id: listing.id,

            commodity: listing.cropName || "",

            variety: listing.variety || "",

            quantity: listing.quantity || 0,

            askingPrice: listing.expectedPrice || 0,

            qualityGrade: listing.qualityGrade || "",

            location: `${listing.district || ""}, ${listing.state || ""}`,

            notes: listing.description || "",

            photos: listing.images || [],

            farmerName: listing.farmer?.name || "Farmer",

            phone: listing.farmer?.phone || "",

            status:
              listing.availabilityStatus === "available" ? "Active" : "Sold",

            postedDate: listing.createdAt?.split("T")[0] || "",

            rating: 5.0,

            dealsCompleted: 0,
          }));

          setListings(formattedListings);
        } else {
          // Backend has no listings
          // Use localStorage
          const saved = localStorage.getItem("agripulse_listings");

          if (saved) {
            try {
              setListings(JSON.parse(saved));
            } catch (error) {
              console.error("Error reading local listings:", error);
            }
          }
        }
      } catch (error) {
        console.error("❌ Listings API error:", error);

        // Fallback to localStorage
        const saved = localStorage.getItem("agripulse_listings");

        if (saved) {
          try {
            setListings(JSON.parse(saved));
          } catch (error) {
            console.error("Error reading local listings:", error);
          }
        }
      }
    };

    loadListings();
  }, []);

  // ==========================================================
  // LOAD ALERTS
  // ==========================================================

  useEffect(() => {
    const loadAlerts = async () => {
      const token = getStoredToken();

      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/notifications/alerts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("🔔 Alerts API response:", data);

        if (response.ok && Array.isArray(data?.data) && data.data.length > 0) {
          const formattedAlerts = data.data.map((alert) => ({
            id: alert.id,

            commodity: alert.commodity,

            mandi: alert.market || "Any Market",

            targetPrice: alert.targetPrice,

            currentPrice: 0,

            status: alert.isTriggered ? "Triggered 🟢" : "Watching ⏳",

            date: alert.createdAt?.split("T")[0] || "Recently",
          }));

          setAlerts(formattedAlerts);
        }
      } catch (error) {
        console.error("❌ Alerts API error:", error);
      }
    };

    loadAlerts();
  }, []);

  // ==========================================================
  // SAVE LISTINGS TO LOCAL STORAGE
  // ==========================================================

  useEffect(() => {
    try {
      localStorage.setItem("agripulse_listings", JSON.stringify(listings));
    } catch (error) {
      console.error("Error saving listings:", error);
    }
  }, [listings]);

  // ==========================================================
  // ADD NEW FARMER LISTING
  // ==========================================================

  const addListing = async (newListing) => {
    const listingWithId = {
      ...newListing,

      id: `lst-${Date.now()}`,

      status: "Active",

      postedDate: new Date().toISOString().split("T")[0],

      rating: 5.0,

      dealsCompleted: 0,
    };

    // Update UI immediately
    setListings((previous) => [listingWithId, ...previous]);

    showToast("✨ Produce listing published successfully!");

    // Save to backend if logged in
    const token = getStoredToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/marketplace/listings`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          cropName: newListing.commodity,

          commodity: newListing.commodity,

          variety: newListing.variety,

          quantity: Number(newListing.quantity),

          expectedPrice: Number(newListing.askingPrice),

          qualityGrade: newListing.qualityGrade,

          description: newListing.notes,

          images: newListing.photos || [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save listing");
      }

      console.log("✅ Listing saved to backend:", data);
    } catch (error) {
      console.warn("⚠️ Could not save listing to backend:", error.message);
    }
  };

  // ==========================================================
  // UPDATE LISTING STATUS
  // ==========================================================

  const updateListingStatus = (id, newStatus) => {
    setListings((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      ),
    );

    showToast(`Status updated to ${newStatus}`);
  };

  // ==========================================================
  // ADD PRICE ALERT
  // ==========================================================

  const addAlert = async (alertData) => {
    const alertItem = {
      ...alertData,

      id: `alt-${Date.now()}`,

      status: "Watching ⏳",

      date: "Just now",
    };

    // Update UI immediately
    setAlerts((previous) => [alertItem, ...previous]);

    showToast("🔔 Target price alert activated!");

    // Save to backend
    const token = getStoredToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notifications/alerts`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          commodity: alertData.commodity,

          targetPrice: Number(alertData.targetPrice),

          market:
            alertData.mandi !== "Any Market" ? alertData.mandi : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save alert");
      }

      console.log("✅ Alert saved:", data);
    } catch (error) {
      console.warn("⚠️ Could not save alert to backend:", error.message);
    }
  };

  // ==========================================================
  // CONTEXT PROVIDER
  // ==========================================================

  return (
    <AppContext.Provider
      value={{
        // Listings
        listings,
        addListing,
        updateListingStatus,

        // Mandi
        mandiPrices,
        dataSource,
        mandiPage,
        setMandiPage,
        mandiTotalPages,
        mandiTotal,
        mandiLoading,
        mandiSearch,
        setMandiSearch,
        mandiState,
        setMandiState,
        mandiDistrict,
        setMandiDistrict,
        mandiCommodity,
        setMandiCommodity,

        // Alerts
        alerts,
        addAlert,

        // Navigation
        activeTab,
        setActiveTab,

        // Toast
        showToast,
        toastMessage,

        // Voice
        isVoiceOpen,
        setIsVoiceOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ============================================================
// CUSTOM HOOK
// ============================================================

export const useApp = () => useContext(AppContext);
