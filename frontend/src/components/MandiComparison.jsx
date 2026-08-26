import React, { useEffect, useState } from "react";
import { Truck, MapPin, Sparkles, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { COMMODITIES_LIST } from "../data/mockMandiData";

export const MandiComparison = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [selectedCrop, setSelectedCrop] = useState("Onion");
  const [quantity, setQuantity] = useState(100);

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * TEMPORARY FARM LOCATION
   *
   * This matches the location you tested in Swagger:
   * Idukki / Kattappana
   *
   * Later we can replace this with the farmer's actual
   * latitude and longitude from the user's profile/GPS.
   */
  const latitude = 9.9189;
  const longitude = 77.1025;

  useEffect(() => {
    fetchRecommendation();
  }, [selectedCrop, quantity]);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError("");

      const url =
        `http://localhost:5000/api/mandi/recommendation` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&commodity=${encodeURIComponent(selectedCrop)}` +
        `&quantity=${quantity}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch recommendation");
      }

      const result = await response.json();

      console.log("✅ Recommendation API:", result);

      if (result.success && result.data) {
        setRecommendation(result.data);
      } else {
        throw new Error("Invalid recommendation response");
      }
    } catch (err) {
      console.error("Recommendation API error:", err);
      setError("Unable to load mandi recommendation.");
      setRecommendation(null);
    } finally {
      setLoading(false);
    }
  };

  const bestMandi = recommendation?.bestMarket;
  const analysis = recommendation?.analysis || [];

  /*
   * Find nearest mandi from backend response
   */
  const nearestMandi =
    analysis.length > 0
      ? [...analysis].sort((a, b) => a.distanceKm - b.distanceKm)[0]
      : null;

  const profitDifference =
    bestMandi && nearestMandi
      ? bestMandi.netProfit - nearestMandi.netProfit
      : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white font-tech flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#00FF88]" />
            {t("comparisonView")}
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            Compare mandi prices, distance, transport cost and actual net
            profit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Crop */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              {t("cropName")}
            </label>

            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {COMMODITIES_LIST.map((c) => (
                <option key={c.id} value={c.name.split(" ")[0]}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Quantity (Quintals)
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Your Farm Location
            </label>

            <div className="w-full px-3 py-2.5 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" />

              <span>{user?.location || "Idukki, Kerala"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-panel rounded-2xl p-6 text-center">
          <p className="text-cyan-300 text-sm">Finding the best mandi...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="glass-panel rounded-2xl p-6 border border-red-500/30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Recommendation */}
      {bestMandi && !loading && (
        <div className="glass-panel glass-card-glow-green p-6 rounded-3xl border border-emerald-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.2)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#00FF88] text-black uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  AI Smart Recommendation
                </span>

                <span className="text-xs text-gray-400 font-mono">
                  Backend Freight Engine
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-white font-tech leading-tight">
                Selling at{" "}
                <span className="text-[#00FF88] underline">
                  {bestMandi.market}
                </span>{" "}
                gives the best return.
              </h3>

              <p className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#00FF88]" />

                {recommendation.recommendation}
              </p>

              {profitDifference > 0 &&
                bestMandi.market !== nearestMandi?.market && (
                  <p className="text-xs text-emerald-300 font-semibold">
                    You earn{" "}
                    <span className="font-extrabold text-white">
                      ₹{profitDifference.toLocaleString("en-IN")}
                    </span>{" "}
                    more than the nearest mandi.
                  </p>
                )}
            </div>

            {/* Total Net */}
            <div className="p-4 rounded-2xl bg-gray-900/90 border border-emerald-500/40 text-center min-w-[200px]">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Total Net Earnings
              </span>

              <p className="text-3xl font-extrabold text-[#00FF88] font-tech mt-1">
                ₹{bestMandi.netProfit.toLocaleString("en-IN")}
              </p>

              <span className="text-[10px] text-emerald-400">
                After transport cost
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mandi Cards */}
      {!loading && analysis.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analysis.map((mandi, idx) => {
            const isWinner =
              mandi.market === bestMandi?.market &&
              mandi.netProfit === bestMandi?.netProfit;

            /*
             * Backend gives total transport cost.
             * Calculate transport per quintal only for display.
             */
            const transportPerQuintal =
              quantity > 0 ? Math.round(mandi.transportCost / quantity) : 0;

            const grossSales = mandi.modalPrice * quantity;

            return (
              <div
                key={`${mandi.market}-${mandi.modalPrice}-${idx}`}
                className={`glass-panel rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative ${
                  isWinner
                    ? "border-[#00FF88] bg-gradient-to-b from-emerald-950/40 via-gray-900/90 to-[#0B0F19] shadow-[0_0_25px_rgba(0,255,136,0.25)]"
                    : "border-gray-800 bg-gray-900/50 hover:border-cyan-500/40"
                }`}
              >
                {/* Winner Badge */}
                {isWinner && (
                  <div className="absolute -top-3.5 left-6 bg-[#00FF88] text-black font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,255,136,0.5)] flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    #1 Highest Net Profit
                  </div>
                )}

                <div className="space-y-4">
                  {/* Mandi Title */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                        {mandi.state}
                      </span>

                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {mandi.distanceKm} km
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-white font-tech mt-2">
                      {mandi.market}
                    </h3>

                    <p className="text-xs text-gray-400">{mandi.district}</p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2.5 pt-2 border-t border-gray-800">
                    {/* Modal Price */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Gross Modal Price:</span>

                      <span className="font-mono font-bold text-white">
                        ₹{mandi.modalPrice.toLocaleString("en-IN")} / Qtl
                      </span>
                    </div>

                    {/* Transport */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        Transport Cost:
                      </span>

                      <span className="font-mono font-bold text-amber-400">
                        - ₹{mandi.transportCost.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Net Profit */}
                    <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-300">
                        Net Profit:
                      </span>

                      <span
                        className={`text-base font-extrabold font-mono ${
                          isWinner ? "text-[#00FF88]" : "text-cyan-300"
                        }`}
                      >
                        ₹{mandi.netProfit.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-800 space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Gross Sales ({quantity} Qtl):</span>

                    <span>₹{grossSales.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Transport / Qtl:</span>

                    <span className="text-amber-400">
                      ₹{transportPerQuintal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-gray-800">
                    <span>Take-Home Net Profit:</span>

                    <span className="text-[#00FF88] font-mono">
                      ₹{mandi.netProfit.toLocaleString("en-IN")}
                    </span>
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
