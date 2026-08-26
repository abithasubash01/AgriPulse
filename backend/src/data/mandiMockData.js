/**
 * Mock data fallback when Agmarknet API is unavailable.
 */

module.exports = [
  {
    state: 'Maharashtra',
    district: 'Nashik',
    market: 'Lasalgaon',
    commodity: 'Onion',
    variety: 'Red',
    arrivalDate: new Date().toISOString().split('T')[0],
    minPrice: 1500,
    maxPrice: 2200,
    modalPrice: 1800,
    latitude: 20.1437,
    longitude: 74.2274,
  },
  {
    state: 'Maharashtra',
    district: 'Pune',
    market: 'Pune (Moshi)',
    commodity: 'Onion',
    variety: 'Local',
    arrivalDate: new Date().toISOString().split('T')[0],
    minPrice: 1600,
    maxPrice: 2300,
    modalPrice: 2000,
    latitude: 18.6657,
    longitude: 73.8406,
  },
  {
    state: 'Tamil Nadu',
    district: 'Salem',
    market: 'Salem',
    commodity: 'Tomato',
    variety: 'Local',
    arrivalDate: new Date().toISOString().split('T')[0],
    minPrice: 1200,
    maxPrice: 1800,
    modalPrice: 1500,
    latitude: 11.6643,
    longitude: 78.1460,
  },
];
