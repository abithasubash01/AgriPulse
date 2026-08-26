import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  BarChart3,
  Sparkles,
  ArrowUpDown,
  Zap,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useLanguage } from "../context/LanguageContext";
import { useApp } from "../context/AppContext";
import {
  COMMODITIES_LIST,
  STATES_DISTRICTS,
  HISTORICAL_PRICE_TRENDS,
} from "../data/mockMandiData";

export const MandiExplorer = () => {
  const { t } = useLanguage();
  const {
    mandiPrices,
    setActiveTab,
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
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState(
    mandiCommodity || "",
  );
  const [selectedState, setSelectedState] = useState(mandiState || "");
  const [selectedDistrict, setSelectedDistrict] = useState(mandiDistrict || "");
  const [trendRange, setTrendRange] = useState("7d"); // '7d', '30d', '90d'
  const [sortField, setSortField] = useState("modal_price");
  const [sortOrder, setSortOrder] = useState("desc");

  // Synchronize local search with global mandiSearch term (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== mandiSearch) {
        setMandiSearch(searchTerm);
        setMandiPage(1);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, mandiSearch, setMandiSearch, setMandiPage]);

  // Client-side filtering is replaced by server-side query filtering
  const filteredPrices = mandiPrices;

  // Sort prices
  const sortedPrices = [...filteredPrices].sort((a, b) => {
    let aVal = a[sortField] ?? "";
    let bVal = b[sortField] ?? "";
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  // Compute metric stats
  const modalPrices = sortedPrices.map((p) => Number(p.modal_price));
  const highestPrice = modalPrices.length > 0 ? Math.max(...modalPrices) : 0;
  const lowestPrice = modalPrices.length > 0 ? Math.min(...modalPrices) : 0;
  const avgPrice =
    modalPrices.length > 0
      ? Math.round(modalPrices.reduce((a, b) => a + b, 0) / modalPrices.length)
      : 0;

  // Chart data setup
  const chartData =
    HISTORICAL_PRICE_TRENDS[selectedCommodity]?.[trendRange] ||
    HISTORICAL_PRICE_TRENDS["Onion"]["7d"];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Search & Filter Header Control */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white font-tech flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#00FF88]" />
              {t("mandiExplorer")}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Live mandi prices from Agmarknet & pan-India markets updated
              daily.
            </p>
          </div>

          {/* Quick Commodity Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {COMMODITIES_LIST.map((c) => {
              const cName = c.name.split(" ")[0];
              const isSelected =
                selectedCommodity.toLowerCase() === cName.toLowerCase();
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    const nextCommodity = isSelected ? "" : cName;
                    setSelectedCommodity(nextCommodity);
                    setMandiCommodity(nextCommodity);
                    setSearchTerm("");
                    setMandiSearch("");
                    setMandiPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-[0_0_12px_rgba(0,255,136,0.4)]"
                      : "bg-gray-900/80 text-gray-300 border border-gray-800 hover:border-cyan-500/40"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{cName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs & Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mandi name or district..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-900/90 border border-cyan-500/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* State Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3 pointer-events-none" />
            <select
              value={selectedState}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedState(value);
                setSelectedDistrict("");
                setMandiState(value);
                setMandiDistrict("");
                setMandiPage(1);
              }}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-900/90 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
            >
              <option value="">
                All States ({Object.keys(STATES_DISTRICTS).length})
              </option>
              {Object.keys(STATES_DISTRICTS).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3 pointer-events-none" />
            <select
              value={selectedDistrict}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDistrict(value);
                setMandiDistrict(value);
                setMandiPage(1);
              }}
              disabled={!selectedState}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-900/90 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="">All Districts</option>
              {selectedState &&
                STATES_DISTRICTS[selectedState]?.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>

          {/* Compare Button */}
          <button
            onClick={() => setActiveTab("comparison")}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 border border-cyan-500/30 transition-all"
          >
            ⚖️ Compare Markets
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 glass-card-glow-green">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Highest Mandi Price
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#00FF88] font-tech">
              ₹{highestPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              ₹/Quintal
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 glass-card-glow-cyan">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            National Average Modal Price
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-cyan-300 font-tech">
              ₹{avgPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold text-cyan-400">
              ₹/Quintal
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 glass-card-glow-amber">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Lowest Mandi Price
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-300 font-tech">
              ₹{lowestPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold text-amber-400">
              ₹/Quintal
            </span>
          </div>
        </div>
      </div>

      {/* Historical Recharts Line Graph */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-3">
          <div>
            <h3 className="text-lg font-bold text-white font-tech flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Price Trend Analytics:{" "}
              <span className="text-[#00FF88]">{selectedCommodity}</span>
            </h3>
            <p className="text-xs text-gray-400">
              Track historical rate shifts across major mandis to select your
              optimal selling date.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
            {["7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setTrendRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                  trendRange === r
                    ? "bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 mt-6 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fontSize: 11 }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0F19",
                  borderColor: "#06B6D4",
                  borderRadius: "12px",
                  color: "#fff",
                  boxShadow: "0 0 15px rgba(6,182,212,0.3)",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#00FF88"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#00FF88",
                  stroke: "#0B0F19",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: "#00FF88",
                  boxShadow: "0 0 10px #00FF88",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Mandi Data Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/20">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-tech flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00FF88]" />
            Live Mandi Price Records ({sortedPrices.length} Markets Found)
          </h3>
          <span className="text-xs text-gray-400">Click headers to sort</span>
        </div>

        <div className="overflow-x-auto relative">
          {/* Loading overlay for page transitions */}
          {mandiLoading && (
            <div className="absolute inset-0 bg-[#0B0F19]/70 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          )}
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider font-tech border-b border-gray-800">
              <tr>
                <th
                  className="py-3.5 px-4 font-bold cursor-pointer"
                  onClick={() => handleSort("market")}
                >
                  <div className="flex items-center gap-1">
                    Mandi / Market <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 font-bold cursor-pointer"
                  onClick={() => handleSort("state")}
                >
                  <div className="flex items-center gap-1">
                    State & District <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-bold">Commodity & Variety</th>
                <th
                  className="py-3.5 px-4 font-bold cursor-pointer text-right"
                  onClick={() => handleSort("min_price")}
                >
                  <div className="flex items-center justify-end gap-1">
                    {t("minPrice")} <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 font-bold cursor-pointer text-right"
                  onClick={() => handleSort("max_price")}
                >
                  <div className="flex items-center justify-end gap-1">
                    {t("maxPrice")} <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 font-bold cursor-pointer text-right"
                  onClick={() => handleSort("modal_price")}
                >
                  <div className="flex items-center justify-end gap-1 text-[#00FF88]">
                    {t("modalPrice")} <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-bold text-center">
                  Distance & Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {sortedPrices.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-800/40 transition-colors group"
                >
                  {/* Mandi Name */}
                  <td className="py-4 px-4 font-extrabold text-white">
                    <div className="flex items-center space-x-2">
                      <span className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-cyan-400">
                        🏛️
                      </span>
                      <div>
                        <p className="text-sm font-tech">{row.market}</p>
                        <span className="text-[10px] text-gray-500 font-normal">
                          Arrival: {row.arrival_date}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* State & District */}
                  <td className="py-4 px-4 text-gray-300">
                    <p className="font-semibold text-white">{row.district}</p>
                    <span className="text-[10px] text-gray-400">
                      {row.state}
                    </span>
                  </td>

                  {/* Commodity & Variety */}
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {row.commodity}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {row.variety}
                    </p>
                  </td>

                  {/* Min Price */}
                  <td className="py-4 px-4 text-right text-gray-300 font-mono">
                    ₹{row.min_price}
                  </td>

                  {/* Max Price */}
                  <td className="py-4 px-4 text-right text-gray-300 font-mono">
                    ₹{row.max_price}
                  </td>

                  {/* Modal Price (Highlighted) */}
                  <td className="py-4 px-4 text-right font-extrabold text-sm text-[#00FF88] font-mono">
                    <div className="flex items-center justify-end space-x-1">
                      {row.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-[#00FF88]" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span>₹{row.modal_price}</span>
                    </div>
                  </td>

                  {/* Distance & Transport Calc Button */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400" />{" "}
                        {row.distance_km ? `${row.distance_km} km` : "—"}
                      </span>
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "selectedMandi",
                            JSON.stringify({
                              market: row.market,
                              district: row.district,
                              state: row.state,
                              commodity: row.commodity,
                              variety: row.variety,
                              modalPrice: Number(row.modal_price),
                              distanceKm: Number(row.distance_km || 0),
                            }),
                          );
                          setActiveTab("comparison");
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 border border-cyan-500/30 transition-all"
                      >
                        Calculate Net ₹
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {mandiTotalPages > 1 && (
          <div className="p-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setMandiPage((prev) => Math.max(prev - 1, 1))}
              disabled={mandiPage <= 1 || mandiLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border disabled:opacity-40 disabled:cursor-not-allowed bg-gray-900/80 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 disabled:hover:bg-gray-900/80 disabled:hover:border-cyan-500/30"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-tech font-bold text-white">
                Page <span className="text-[#00FF88]">{mandiPage}</span> of{" "}
                <span className="text-cyan-300">{mandiTotalPages}</span>
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">
                {mandiTotal.toLocaleString("en-IN")} records
              </span>
            </div>

            <button
              onClick={() =>
                setMandiPage((prev) => Math.min(prev + 1, mandiTotalPages))
              }
              disabled={mandiPage >= mandiTotalPages || mandiLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border disabled:opacity-40 disabled:cursor-not-allowed bg-gray-900/80 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 disabled:hover:bg-gray-900/80 disabled:hover:border-cyan-500/30"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
