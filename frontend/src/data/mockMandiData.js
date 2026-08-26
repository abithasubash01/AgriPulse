// High Quality Indian Mandi Price & Commodity Mock Dataset

export const COMMODITIES_LIST = [
  { id: "onion", name: "Onion (प्याज़)", defaultUnit: "Quintal", icon: "🌰", category: "Vegetable" },
  { id: "wheat", name: "Wheat (गेहूँ)", defaultUnit: "Quintal", icon: "🌾", category: "Grain" },
  { id: "rice", name: "Paddy Rice (धान)", defaultUnit: "Quintal", icon: "🍚", category: "Grain" },
  { id: "potato", name: "Potato (आलू)", defaultUnit: "Quintal", icon: "🥔", category: "Vegetable" },
  { id: "tomato", name: "Tomato (टमाटर)", defaultUnit: "Quintal", icon: "🍅", category: "Vegetable" },
  { id: "cotton", name: "Cotton (कपास)", defaultUnit: "Quintal", icon: "☁️", category: "Commercial" },
  { id: "mustard", name: "Mustard (सरसों)", defaultUnit: "Quintal", icon: "🌼", category: "Oilseed" },
  { id: "chilli", name: "Red Chilli (लाल मिर्च)", defaultUnit: "Quintal", icon: "🌶️", category: "Spices" },
];

export const STATES_DISTRICTS = {
  "Maharashtra": ["Nashik", "Pune", "Mumbai", "Ahmednagar", "Solapur", "Nagpur"],
  "Punjab": ["Ludhiana", "Fazilka", "Amritsar", "Jalandhar", "Patiala"],
  "Delhi": ["Delhi"],
  "Haryana": ["Karnal", "Ambala", "Hisar", "Sirsa"],
  "Rajasthan": ["Jaipur", "Kota", "Bikaner", "Sri Ganganagar"],
  "Andhra Pradesh": ["Guntur", "Kurnool", "Vijayawada"],
  "Madhya Pradesh": ["Indore", "Ujjain", "Bhopal", "Neemuch"],
  "Uttar Pradesh": ["Agra", "Kanpur", "Varanasi", "Mathura"],
  "Karnataka": ["Kolar", "Bengaluru Rural", "Belagavi", "Hubballi"],
  "Gujarat": ["Rajkot", "Surat", "Ahmedabad", "Junagadh"],
};

export const INITIAL_MANDI_PRICES = [
  { id: "m1", state: "Maharashtra", district: "Nashik", market: "Lasalgaon APMC", commodity: "Onion", variety: "Red Onion", min_price: 1850, max_price: 2450, modal_price: 2200, arrival_date: "2026-08-03", distance_km: 18, trend: "up" },
  { id: "m2", state: "Maharashtra", district: "Mumbai", market: "Vashi APMC", commodity: "Onion", variety: "Red Onion", min_price: 2150, max_price: 2850, modal_price: 2550, arrival_date: "2026-08-03", distance_km: 185, trend: "up" },
  { id: "m3", state: "Maharashtra", district: "Pune", market: "Pune Gultekdi", commodity: "Onion", variety: "White Onion", min_price: 1950, max_price: 2600, modal_price: 2350, arrival_date: "2026-08-03", distance_km: 140, trend: "down" },
  { id: "m4", state: "Delhi", district: "Delhi", market: "Azadpur Mandi", commodity: "Onion", variety: "Medium Grade", min_price: 2200, max_price: 2950, modal_price: 2680, arrival_date: "2026-08-03", distance_km: 1150, trend: "up" },
  { id: "m5", state: "Punjab", district: "Fazilka", market: "Abohar Grain Market", commodity: "Wheat", variety: "Sharbati Gold", min_price: 2275, max_price: 2580, modal_price: 2450, arrival_date: "2026-08-03", distance_km: 45, trend: "stable" },
  { id: "m6", state: "Punjab", district: "Ludhiana", market: "Khanna Mandi", commodity: "Wheat", variety: "Kalyan Sona", min_price: 2320, max_price: 2620, modal_price: 2490, arrival_date: "2026-08-03", distance_km: 110, trend: "up" },
  { id: "m7", state: "Haryana", district: "Karnal", market: "Karnal Rice Hub", commodity: "Paddy Rice", variety: "Basmati 1121", min_price: 3850, max_price: 4680, modal_price: 4380, arrival_date: "2026-08-03", distance_km: 78, trend: "up" },
  { id: "m8", state: "Andhra Pradesh", district: "Guntur", market: "Guntur Yard", commodity: "Red Chilli", variety: "Teja Super", min_price: 14800, max_price: 19800, modal_price: 17400, arrival_date: "2026-08-03", distance_km: 320, trend: "up" },
  { id: "m9", state: "Rajasthan", district: "Jaipur", market: "Surajpole Mandi", commodity: "Mustard", variety: "Desi Yellow", min_price: 5150, max_price: 5880, modal_price: 5550, arrival_date: "2026-08-03", distance_km: 210, trend: "down" },
  { id: "m10", state: "Madhya Pradesh", district: "Indore", market: "Indore Malwa Mandi", commodity: "Soyabean", variety: "Yellow Seed", min_price: 4250, max_price: 4920, modal_price: 4680, arrival_date: "2026-08-03", distance_km: 260, trend: "up" },
  { id: "m11", state: "Uttar Pradesh", district: "Agra", market: "Agra Central Mandi", commodity: "Potato", variety: "Jyoti Kufri", min_price: 1220, max_price: 1680, modal_price: 1480, arrival_date: "2026-08-03", distance_km: 310, trend: "stable" },
  { id: "m12", state: "Karnataka", district: "Kolar", market: "Kolar APMC", commodity: "Tomato", variety: "Hybrid Red", min_price: 1450, max_price: 2250, modal_price: 1880, arrival_date: "2026-08-03", distance_km: 430, trend: "up" },
  { id: "m13", state: "Gujarat", district: "Rajkot", market: "Rajkot Yard", commodity: "Cotton", variety: "Shankar-6 Premium", min_price: 6850, max_price: 7800, modal_price: 7450, arrival_date: "2026-08-03", distance_km: 520, trend: "up" },
];

export const HISTORICAL_PRICE_TRENDS = {
  "Onion": {
    "7d": [
      { date: "Jul 28", price: 2050, min: 1750, max: 2250 },
      { date: "Jul 29", price: 2080, min: 1780, max: 2300 },
      { date: "Jul 30", price: 2120, min: 1800, max: 2350 },
      { date: "Jul 31", price: 2150, min: 1820, max: 2380 },
      { date: "Aug 01", price: 2180, min: 1830, max: 2400 },
      { date: "Aug 02", price: 2200, min: 1850, max: 2420 },
      { date: "Aug 03", price: 2250, min: 1880, max: 2480 },
    ],
    "30d": [
      { date: "Week 1", price: 1900 },
      { date: "Week 2", price: 2020 },
      { date: "Week 3", price: 2150 },
      { date: "Week 4", price: 2250 },
    ],
    "90d": [
      { date: "May", price: 1650 },
      { date: "Jun", price: 1850 },
      { date: "Jul", price: 2100 },
      { date: "Aug", price: 2250 },
    ]
  },
  "Wheat": {
    "7d": [
      { date: "Jul 28", price: 2380, min: 2200, max: 2500 },
      { date: "Jul 29", price: 2400, min: 2210, max: 2510 },
      { date: "Jul 30", price: 2410, min: 2220, max: 2520 },
      { date: "Jul 31", price: 2430, min: 2240, max: 2540 },
      { date: "Aug 01", price: 2440, min: 2250, max: 2550 },
      { date: "Aug 02", price: 2450, min: 2260, max: 2560 },
      { date: "Aug 03", price: 2480, min: 2280, max: 2600 },
    ]
  }
};

export const INITIAL_FARMER_LISTINGS = [
  {
    id: "lst-101",
    farmerName: "Ramesh Farmer",
    phone: "9876543210",
    commodity: "Onion",
    variety: "Lasalgaon Red Grade A",
    quantity: 150, // Quintals
    askingPrice: 2350, // ₹/Quintal
    qualityGrade: "Grade A Super",
    location: "Nashik, Maharashtra",
    distanceKm: 18,
    status: "Active", // Active, Sold, Expired
    postedDate: "2026-08-02",
    photos: ["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80"],
    notes: "Freshly harvested organic Nashik red onions. Crisp quality, zero moisture damage.",
    rating: 4.9,
    dealsCompleted: 24
  },
  {
    id: "lst-102",
    farmerName: "Gurpreet Singh",
    phone: "9812345678",
    commodity: "Wheat",
    variety: "Sharbati Golden",
    quantity: 300,
    askingPrice: 2500,
    qualityGrade: "Grade A",
    location: "Abohar, Punjab",
    distanceKm: 45,
    status: "Active",
    postedDate: "2026-08-01",
    photos: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80"],
    notes: "Sun-dried premium Sharbati grain wheat. High protein content for rotis.",
    rating: 4.8,
    dealsCompleted: 31
  },
  {
    id: "lst-103",
    farmerName: "Venkatesh Rao",
    phone: "9988776655",
    commodity: "Red Chilli",
    variety: "Teja Spicy",
    quantity: 80,
    askingPrice: 17500,
    qualityGrade: "Export Quality",
    location: "Guntur, Andhra Pradesh",
    distanceKm: 320,
    status: "Active",
    postedDate: "2026-08-03",
    photos: ["https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&auto=format&fit=crop&q=80"],
    notes: "Fiery red Guntur Teja chillies. Deep red color index and high pungency.",
    rating: 5.0,
    dealsCompleted: 19
  }
];

export const GOVT_SCHEMES = [
  {
    id: "sch-1",
    name: "PM-Kisan Samman Nidhi",
    benefit: "₹6,000 / year direct cash transfer in 3 installments",
    eligibility: "Small & marginal farmer landholders across India",
    link: "https://pmkisan.gov.in",
    tag: "Direct Cash"
  },
  {
    id: "sch-2",
    name: "Kisan Credit Card (KCC)",
    benefit: "Low-interest loans @ 4% per annum up to ₹3 Lakhs",
    eligibility: "Farmers, tenant farmers, self-help groups",
    link: "https://myscheme.gov.in",
    tag: "Credit Loan"
  },
  {
    id: "sch-3",
    name: "e-NAM (National Agriculture Market)",
    benefit: "Pan-India electronic trading portal for farm produce",
    eligibility: "Registered farmers at e-NAM mandi yards",
    link: "https://enam.gov.in",
    tag: "Marketplace"
  },
  {
    id: "sch-4",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    benefit: "Crop insurance against flood, drought & pest destruction",
    eligibility: "All farmers growing notified crops in notified areas",
    link: "https://pmfby.gov.in",
    tag: "Insurance"
  }
];

export const CROP_DISEASE_PRESETS = [
  {
    id: "dis-1",
    crop: "Paddy Rice",
    diseaseName: "Rice Blast (Magnaporthe oryzae)",
    severity: "High (Action Required)",
    confidence: "96.4%",
    symptoms: "Spindle-shaped lesions with grayish centers on leaves and neck rot.",
    treatment: "Spray Tricyclazole 75% WP @ 0.6g/L of water. Maintain proper nitrogen fertilization balance.",
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "dis-2",
    crop: "Tomato",
    diseaseName: "Early Blight (Alternaria solani)",
    severity: "Medium",
    confidence: "94.1%",
    symptoms: "Concentric target-like rings on lower leaves, turning yellow and falling off.",
    treatment: "Apply Mancozeb 75% WP @ 2g/L or Copper Oxychloride @ 3g/L every 10 days.",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "dis-3",
    crop: "Wheat",
    diseaseName: "Yellow Rust (Puccinia striiformis)",
    severity: "Severe",
    confidence: "98.2%",
    symptoms: "Yellow pustules arranged in linear stripes on leaf blades.",
    treatment: "Foliar spray of Propiconazole 25% EC @ 1ml/L at first appearance of stripes.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80"
  }
];
