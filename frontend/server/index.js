import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory cache for Agmarknet Mandi Data
let cachedMandiData = null;
let lastCacheTime = null;
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 Hours

// High-fidelity fallback mock dataset for Indian Mandis across states
const mockMandiRecords = [
  { state: "Maharashtra", district: "Nashik", market: "Lasalgaon", commodity: "Onion", variety: "Red Onion", min_price: "1800", max_price: "2450", modal_price: "2200", arrival_date: "03/08/2026", distance_km: 18 },
  { state: "Maharashtra", district: "Mumbai", market: "Vashi (APMC)", commodity: "Onion", variety: "Red Onion", min_price: "2100", max_price: "2800", modal_price: "2500", arrival_date: "03/08/2026", distance_km: 185 },
  { state: "Maharashtra", district: "Pune", market: "Pune (Gultekdi)", commodity: "Onion", variety: "White Onion", min_price: "1950", max_price: "2600", modal_price: "2350", arrival_date: "03/08/2026", distance_km: 140 },
  { state: "Delhi", district: "Delhi", market: "Azadpur", commodity: "Onion", variety: "Medium", min_price: "2200", max_price: "2900", modal_price: "2650", arrival_date: "03/08/2026", distance_km: 1150 },
  { state: "Punjab", district: "Fazilka", market: "Abohar", commodity: "Wheat", variety: "Sharbati", min_price: "2275", max_price: "2550", modal_price: "2420", arrival_date: "03/08/2026", distance_km: 45 },
  { state: "Punjab", district: "Ludhiana", market: "Khanna", commodity: "Wheat", variety: "Kalyan", min_price: "2300", max_price: "2600", modal_price: "2480", arrival_date: "03/08/2026", distance_km: 110 },
  { state: "Haryana", district: "Karnal", market: "Karnal", commodity: "Paddy (Rice)", variety: "Basmati 1121", min_price: "3800", max_price: "4650", modal_price: "4350", arrival_date: "03/08/2026", distance_km: 78 },
  { state: "Andhra Pradesh", district: "Guntur", market: "Guntur Yard", commodity: "Red Chilli", variety: "Teja", min_price: "14500", max_price: "19800", modal_price: "17200", arrival_date: "03/08/2026", distance_km: 320 },
  { state: "Rajasthan", district: "Jaipur", market: "Jaipur (Surajpole)", commodity: "Mustard", variety: "Desi", min_price: "5100", max_price: "5850", modal_price: "5500", arrival_date: "03/08/2026", distance_km: 210 },
  { state: "Madhya Pradesh", district: "Indore", market: "Indore (Malwa)", commodity: "Soyabean", variety: "Yellow", min_price: "4200", max_price: "4900", modal_price: "4650", arrival_date: "03/08/2026", distance_km: 260 },
  { state: "Uttar Pradesh", district: "Agra", market: "Agra", commodity: "Potato", variety: "Jyoti", min_price: "1200", max_price: "1650", modal_price: "1450", arrival_date: "03/08/2026", distance_km: 310 },
  { state: "Karnataka", district: "Kolar", market: "Kolar Mandi", commodity: "Tomato", variety: "Hybrid", min_price: "1400", max_price: "2200", modal_price: "1850", arrival_date: "03/08/2026", distance_km: 430 },
  { state: "Gujarat", district: "Rajkot", market: "Rajkot", commodity: "Cotton", variety: "Shankar-6", min_price: "6800", max_price: "7750", modal_price: "7400", arrival_date: "03/08/2026", distance_km: 520 },
];

// 1. Mandi Price Explorer API Endpoint
app.get('/api/mandi-prices', async (req, res) => {
  const apiKey = process.env.DATA_GOV_API_KEY;
  const now = Date.now();

  // Return cache if fresh
  if (cachedMandiData && lastCacheTime && (now - lastCacheTime < CACHE_DURATION)) {
    return res.json({ source: "cache", records: cachedMandiData });
  }

  if (apiKey && apiKey !== "YOUR_DATA_GOV_API_KEY_HERE") {
    try {
      const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=100`;
      const response = await axios.get(apiUrl, { timeout: 4000 });
      if (response.data && response.data.records) {
        cachedMandiData = response.data.records;
        lastCacheTime = now;
        return res.json({ source: "api", records: response.data.records });
      }
    } catch (err) {
      console.warn("Agmarknet API fetch failed or timed out. Falling back to mock dataset.", err.message);
    }
  }

  // Fallback to mock dataset
  cachedMandiData = mockMandiRecords;
  lastCacheTime = now;
  return res.json({ source: "mock", records: mockMandiRecords });
});

// 2. Simulated OTP Auth Endpoint
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: "Invalid phone number" });
  }
  return res.json({ success: true, message: `OTP sent to +91 ${phone}`, mockOtp: "123456" });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (otp === "123456" || otp === "999999" || otp.length === 6) {
    return res.json({
      success: true,
      token: "agripulse-jwt-token-" + Date.now(),
      user: {
        id: "usr-" + Math.floor(1000 + Math.random() * 9000),
        phone: phone,
        name: "Ramesh Farmer",
        location: "Nashik, Maharashtra",
        state: "Maharashtra",
        district: "Nashik",
        verified: true,
      }
    });
  }
  return res.status(400).json({ error: "Incorrect OTP code. Try 123456" });
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`⚡ AgriPulse Express API Server running on port ${PORT}`);
});
