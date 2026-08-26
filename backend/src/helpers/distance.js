/**
 * Distance calculation using the Haversine formula.
 * Used for nearby mandi search and transportation cost estimation.
 */

const env = require('../config/env');

/**
 * Calculate the distance between two geographic points.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in kilometres
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Estimate transportation cost.
 * @param {number} distanceKm
 * @param {number} quantityQuintals
 * @returns {number} estimated cost in ₹
 */
function estimateTransportCost(distanceKm, quantityQuintals = 1) {
  const costPerKmPerQuintal = env.TRANSPORT_COST_PER_KM_PER_QUINTAL;
  return Math.round(distanceKm * quantityQuintals * costPerKmPerQuintal);
}

/**
 * Calculate net profit after transport.
 * @param {number} sellingPrice – per quintal
 * @param {number} quantity – in quintals
 * @param {number} transportCost
 * @returns {number} net profit in ₹
 */
function calculateNetProfit(sellingPrice, quantity, transportCost) {
  return Math.round(sellingPrice * quantity - transportCost);
}

module.exports = { haversineDistance, estimateTransportCost, calculateNetProfit };
