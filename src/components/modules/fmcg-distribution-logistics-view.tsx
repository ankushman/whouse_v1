"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#991b1b", "#7f1d1d", "#fecaca", "#fee2e2"];
const DC_NAMES = ["HUL Sonepat DC NCR", "ITC Bengaluru Whitefield", "Nestle Moga Punjab", "Britannia Mumbai BKC", "Marico Kolkata Andul", "Dabur Sahibabad NCR", "Godrej Mumbai Vikhroli", "P&G Baddi HP"];
const CATEGORIES = ["Personal Care", "Home Care", "Packaged Foods", "Beverages", "Health & Wellness", "Baby Care", "Dairy & Frozen", "Confectionery"];
const ORDER_STATUSES = ["Picked", "Dispatched", "In Transit", "Delivered at Hub", "Last-Mile Delivery", "Delivered to Retail"];
const ZONES = ["North India", "South India", "West India", "East India", "Central India", "Pan-India"];
const MODES = [" refrigerated Truck", "Dry Container 20ft", "Multi-Temp Reefer", "Open Truck 10T", "Rail Container", "Shared 3PL Fleet"];
const TABS = ["Dashboard", "Order Registry", "FMCG Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Picked": "blue", "Dispatched": "blue", "In Transit": "blue", "Delivered at Hub": "green", "Last-Mile Delivery": "amber", "Delivered to Retail": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyOrders = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], personal: ri(1200, 2200, 1650 + Math.sin(i * 0.5) * 250), home: ri(600, 1100, 820 + Math.cos(i * 0.6) * 130), food: ri(900, 1600, 1200 + Math.sin(i * 0.7) * 180), beverage: ri(400, 800, 580 + Math.cos(i * 0.8) * 100) }));
const categoryDist = [{ n: "Personal Care", v: 28 }, { n: "Packaged Foods", v: 22 }, { n: "Home Care", v: 16 }, { n: "Beverages", v: 14 }, { n: "Health & Wellness", v: 10 }, { n: "Confectionery", v: 6 }, { n: "Baby Care", v: 3 }, { n: "Dairy & Frozen", v: 1 }];
const fillRateTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(94, 99.5, 97 + Math.sin(i * 0.4) * 1.5)).toFixed(1), target: 96.0 }));
const dcPerf = DC_NAMES.slice(0, 6).map(d => ({ n: d.split(" ").slice(1, 3).join(" "), v: +ri(88, 99, 94 + Math.random() * 4).toFixed(0) }));

interface OrderRecord { id: string; soNumber: string; dc: string; zone: string; category: string; sku: string; cases: number; units: string; retailer: string; origin: string; destination: string; mode: string; pickDate: string; etaDate: string; transitDays: number; valueLakhs: number; priorityFlag: boolean; status: string; remarks: string; }

const records: OrderRecord[] = [
  { id: "FMG-0001", soNumber: "SO-HUL/2025/7821", dc: "HUL Sonepat DC NCR", zone: "North India", category: "Personal Care", sku: "Dove Body Wash 400ml Case-24", cases: 480, units: "Cases", retailer: "DMart Noida Sector-18", origin: "HUL Sonepat Plant", destination: "DMart Noida Store", mode: "Dry Container 20ft", pickDate: "2025-07-10", etaDate: "", transitDays: 1, valueLakhs: 14.4, priorityFlag: true, status: "In Transit", remarks: "Dove body wash replenishment for DMart Noida weekend stock" },
  { id: "FMG-0002", soNumber: "SO-ITC/2025/5432", dc: "ITC Bengaluru Whitefield", zone: "South India", category: "Packaged Foods", sku: "Aashirvaad Atta 5kg Case-10", cases: 600, units: "Cases", retailer: "BigBasket Bengaluru", origin: "ITC Whitefield DC", destination: "BigBasket FC BLR", mode: "Refrigerated Truck", pickDate: "2025-07-08", etaDate: "2025-07-08", transitDays: 0, valueLakhs: 9, priorityFlag: false, status: "Delivered to Retail", remarks: "Aashirvaad atta same-day delivery for BigBasket customer orders" },
  { id: "FMG-0003", soNumber: "SO-NSL/2025/9087", dc: "Nestle Moga Punjab", zone: "North India", category: "Packaged Foods", sku: "Maggi Noodles Masala Case-48", cases: 1200, units: "Cases", retailer: "Reliance Retail Ludhiana", origin: "Nestle Moga Factory", destination: "Reliance Smart Ludhiana", mode: "Open Truck 10T", pickDate: "2025-07-11", etaDate: "", transitDays: 1, valueLakhs: 7.2, priorityFlag: true, status: "Dispatched", remarks: "Maggi noodles emergency replenishment Ludhiana cluster" },
  { id: "FMG-0004", soNumber: "SO-BRT/2025/3456", dc: "Britannia Mumbai BKC", zone: "West India", category: "Confectionery", sku: "Tiger Glucose Biscuit Case-60", cases: 800, units: "Cases", retailer: "Spencer's Mumbai Andheri", origin: "Britannia BKC DC", destination: "Spencer's Andheri Store", mode: "Shared 3PL Fleet", pickDate: "2025-07-09", etaDate: "2025-07-09", transitDays: 0, valueLakhs: 4.8, priorityFlag: false, status: "Delivered at Hub", remarks: "Tiger biscuit delivery to Spencer's Andheri store" },
  { id: "FMG-0005", soNumber: "SO-MRC/2025/6789", dc: "Marico Kolkata Andul", zone: "East India", category: "Personal Care", sku: "Parachute Coconut Oil 500ml Case-24", cases: 360, units: "Cases", retailer: "More Supermarket Kolkata", origin: "Marico Andul Plant", destination: "More Kankurgachi Store", mode: "Refrigerated Truck", pickDate: "2025-07-07", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 5.4, priorityFlag: false, status: "Last-Mile Delivery", remarks: "Parachute oil last-mile van delivery from Kolkata hub" },
  { id: "FMG-0006", soNumber: "SO-DBR/2025/1234", dc: "Dabur Sahibabad NCR", zone: "North India", category: "Health & Wellness", sku: "Chyawanprash 1kg Case-12", cases: 240, units: "Cases", retailer: "Apollo Pharmacy NCR", origin: "Dabur Sahibabad Plant", destination: "Apollo Warehouse Noida", mode: "Dry Container 20ft", pickDate: "2025-07-12", etaDate: "", transitDays: 1, valueLakhs: 8.6, priorityFlag: true, status: "Picked", remarks: "Chyawanprash seasonal immunity boost stock-up Apollo chain" },
  { id: "FMG-0007", soNumber: "SO-GDJ/2025/5678", dc: "Godrej Mumbai Vikhroli", zone: "West India", category: "Home Care", sku: "Hit Cockroach Spray 200ml Case-48", cases: 500, units: "Cases", retailer: "D-Mart Thane", origin: "Godrej Vikhroli Plant", destination: "DMart Thane Store", mode: "Shared 3PL Fleet", pickDate: "2025-07-06", etaDate: "2025-07-07", transitDays: 1, valueLakhs: 3.5, priorityFlag: false, status: "Delivered to Retail", remarks: "Godrej Hit spray monsoon season stock build-up" },
  { id: "FMG-0008", soNumber: "SO-PG/2025/8901", dc: "P&G Baddi HP", zone: "North India", category: "Personal Care", sku: "Head & Shoulders 340ml Case-24", cases: 720, units: "Cases", retailer: "Metro Cash & Carry Chandigarh", origin: "P&G Baddi Plant", destination: "Metro CC Chandigarh", mode: "Dry Container 20ft", pickDate: "2025-07-05", etaDate: "", transitDays: 2, valueLakhs: 10.8, priorityFlag: true, status: "In Transit", remarks: "P&G H&S shampoo B2B wholesale Metro Cash & Carry" },
  { id: "FMG-0009", soNumber: "SO-HUL/2025/2345", dc: "HUL Sonepat DC NCR", zone: "Pan-India", category: "Home Care", sku: "Surf Excel Matic 2kg Case-12", cases: 400, units: "Cases", retailer: "Jiomart Pan-India FC", origin: "HUL Sonepat Plant", destination: "Jiomart FC NCR", mode: "Multi-Temp Reefer", pickDate: "2025-07-11", etaDate: "", transitDays: 1, valueLakhs: 6, priorityFlag: false, status: "Dispatched", remarks: "Surf Excel liquid detergent multi-temp reefer shipment" },
  { id: "FMG-0010", soNumber: "SO-ITC/2025/4567", dc: "ITC Bengaluru Whitefield", zone: "South India", category: "Beverages", sku: "Sunfeast Momos Magic Case-48", cases: 960, units: "Cases", retailer: "Vijetha Supermarket Hyderabad", origin: "ITC Whitefield DC", destination: "Vijetha Jubilee Hills", mode: "Rail Container", pickDate: "2025-07-10", etaDate: "", transitDays: 2, valueLakhs: 4.8, priorityFlag: false, status: "In Transit", remarks: "Sunfeast snacks Bangalore to Hyderabad rail container" },
  { id: "FMG-0011", soNumber: "SO-NSL/2025/7890", dc: "Nestle Moga Punjab", zone: "Central India", category: "Beverages", sku: "Nescafe Classic 200g Case-48", cases: 350, units: "Cases", retailer: "Haldiram's Bhopal", origin: "Nestle Moga Factory", destination: "Haldiram's Bhopal Outlet", mode: "Open Truck 10T", pickDate: "2025-07-09", etaDate: "2025-07-11", transitDays: 3, valueLakhs: 7, priorityFlag: true, status: "Last-Mile Delivery", remarks: "Nescafe coffee institutional supply Haldiram's restaurant chain" },
  { id: "FMG-0012", soNumber: "SO-BRT/2025/1122", dc: "Britannia Mumbai BKC", zone: "West India", category: "Packaged Foods", sku: "Marie Gold Biscuit Case-60", cases: 1100, units: "Cases", retailer: "BigBasket Pune DC", origin: "Britannia BKC DC", destination: "BigBasket FC Pune", mode: "Refrigerated Truck", pickDate: "2025-07-12", etaDate: "", transitDays: 1, valueLakhs: 5.5, priorityFlag: false, status: "Picked", remarks: "Marie Gold biscuit daily replenishment BigBasket Pune" },
  { id: "FMG-0013", soNumber: "SO-MRC/2025/3344", dc: "Marico Kolkata Andul", zone: "East India", category: "Personal Care", sku: "Set Wet Deo 150ml Case-48", cases: 280, units: "Cases", retailer: "Medplus Pharmacy Kolkata", origin: "Marico Andul Plant", destination: "Medplus Chowringhee", mode: "Shared 3PL Fleet", pickDate: "2025-07-08", etaDate: "2025-07-09", transitDays: 1, valueLakhs: 4.2, priorityFlag: false, status: "Delivered to Retail", remarks: "Set Wet deodorant male grooming segment Medplus" },
  { id: "FMG-0014", soNumber: "SO-DBR/2025/9012", dc: "Dabur Sahibabad NCR", zone: "North India", category: "Health & Wellness", sku: "Dabur Honey 500g Case-12", cases: 300, units: "Cases", retailer: "Amazon India FTL NCR", origin: "Dabur Sahibabad Plant", destination: "Amazon FTL NCR Hub", mode: "Dry Container 20ft", pickDate: "2025-07-07", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 9, priorityFlag: true, status: "Delivered at Hub", remarks: "Dabur Honey Amazon FTL fulfillment stock-up" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Dispatched" || r.status === "Picked").length;
const lastMile = records.filter(r => r.status === "Last-Mile Delivery").length;
const deliveredCount = records.filter(r => r.status === "Delivered to Retail" || r.status === "Delivered at Hub").length;
const totalValue = records.reduce((s, r) => s + r.valueLakhs, 0);

const kpis = [
  { l: "In Pipeline", v: transitCount, s: "picked + transit + dispatched" },
  { l: "Last-Mile", v: lastMile, s: "out for delivery" },
  { l: "Delivered", v: deliveredCount, s: "at hub or retail" },
  { l: "Total Order Value", v: `\u20b9${totalValue}L`, s: "across all zones" },
];

const INSIGHTS = [
  {
    t: "India FMCG Distribution: \u20b925 Lakh Crore Market, 12 Lakh Retail Outlets, Modern Trade + General Trade + E-Commerce",
    c: "India\u2019s FMCG (Fast Moving Consumer Goods) market is valued at \u20b925 lakh crore (USD 300 billion, 2024-25), growing at 8-10% CAGR, making it the world\u2019s fourth-largest FMCG market. India\u2019s FMCG distribution network is the most complex in the world, serving 12 lakh+ retail outlets through three channels: (1) General Trade (GT): 90% of outlets (kirana stores, paan shops, hardware stores), contributing 55% of FMCG revenue (\u20b914 lakh crore), with 40 lakh+ distributors and sub-stockists covering every pincode in India, average outlet served: 150-200 SKUs, order frequency: weekly, order size: \u20b95,000-15,000, (2) Modern Trade (MT): organized retail chains (DMart, Reliance Retail, Spencer\u2019s, More, Metro Cash & Carry \u2014 15,000+ stores), contributing 25% of revenue (\u20b96.25 lakh crore), with direct factory-to-DC supply chain, average store: 5,000+ SKUs, daily replenishment, (3) E-Commerce / Q-Commerce (Blinkit, Zepto, BigBasket, Amazon FTL, Swiggy Instamart, Jiomart \u2014 growing at 35% CAGR), contributing 20% of revenue (\u20b95 lakh crore), with dark store hubs (2000+ SKUs), 10-30 minute delivery promise. India\u2019s FMCG supply chain covers: (a) 850+ manufacturing plants (HUL: 25 factories, ITC: 40+, Nestle: 9, Britannia: 14, Dabur: 8, Marico: 6), (b) 3,500+ primary distribution centers (DCs), (c) 40 lakh+ distributor and sub-stockist network, (d) 12 lakh+ retail touchpoints, and (e) 50+ third-party logistics (3PL) providers (TCI, Allcargo, Mahindra Logistics, Delhivery, Ekart, BlueDart). Key FMCG companies by distribution network: (1) HUL: widest reach, 8 million retail outlets, 2,000+ redistribution stockists, (2) ITC: 6 million outlets, 40+ factories, integrated tobacco-food-personal care supply chain, (3) Nestle India: 4.5 million outlets, 9 factories, Maggi distribution to every kirana in India, (4) Britannia: 5 million outlets, strong rural penetration (55% revenue from rural), (5) Dabur: 5 million outlets, Ayurvedic/natural products positioning, strong pharmacy channel (1.2 lakh chemists), (6) Marico: 4 million outlets, strong in coconut oil and value-added hair oils (Parachute, Nihar), (7) Godrej Consumer Products: 3 million outlets, strong in home insecticides (Hit, GoodKnight), and (8) P&G India: 4 million outlets, premium personal care (Vicks, Gillette, Ariel, Tide). FMCG logistics cost structure: transportation 45%, warehousing 25%, inventory carrying 15%, last-mile delivery 10%, returns processing 5%. Total FMCG logistics spend: approximately \u20b94.5 lakh crore annually.",
  },
  {
    t: "FMCG Distribution Models: Direct-to-Retail, Distributor-led, 3PL, and Cross-Dock Hub",
    c: "India\u2019s FMCG distribution operates through multiple models optimized for different channels: (1) Direct-to-Retail (DTR) model: FMCG company owns DCs, delivers directly to modern trade and large-format retailers, eliminating distributor margin (3-5%). HUL, Nestle, and Britannia operate DTR for top 500 retail chains (DMart, Reliance, BigBasket, Metro). DTR enables: daily replenishment, planogram compliance, promotional execution tracking, and shelf visibility. Logistics cost: 6-8% of sales vs 10-12% through distributors. (2) Distributor-led model: FMCG company sells to redistributing stockist (RS), who manages secondary and tertiary distribution. India has 40 lakh+ distributors organized in a 3-tier hierarchy: (a) Super Stockist (covering 500-1000 outlets, 50-200 km radius, investment \u20b950-200 lakh), (b) Stockist/Distributor (covering 100-300 outlets, 20-50 km radius, investment \u20b910-50 lakh), and (c) Retailer (serving end consumer). Distributor margins: GT 8-12% (depending on brand and category), MT 3-5%, rural premium 2-3% extra. (3) Third-party logistics (3PL) model: 50+ 3PL providers handle FMCG warehousing and transportation. Key 3PL players: (a) TCI Supply Chain (warehousing: 15 million sq ft, fleet: 10,000+ trucks), (b) Allcargo Logistics (container freight, multimodal transport), (c) Mahindra Logistics (warehousing + transportation, strong in FMCG vertical), (d) Delhivery/Ekart (e-commerce fulfillment, last-mile), and (e) BlueDart (express delivery for high-value FMCG). 3PL advantages: asset-light, scalable, technology-enabled (WMS, TMS, IoT). (4) Cross-dock hub model: Time-sensitive FMCG (dairy, bakery, fresh) uses cross-docking where goods arrive at hub and are immediately sorted and dispatched (0-4 hour dwell time). Amul, Mother Dairy, and Britannia use this model for short-shelf-life products. India\u2019s FMCG warehousing: 3,500+ DCs totaling 800 million sq ft (majority Grade-C sheds, shifting to Grade-A with automation). Warehouse management systems (WMS): SAP EWM, Oracle WMS Cloud, and Indian solutions (Shipway, Unicommerce, EasyEcom). Put-away optimization: FIFO (first-in-first-out) for perishable, FEFO (first-expired-first-out) for short-shelf-life, and LIFO for non-perishable bulk. India\u2019s FMCG distribution challenges: (a) Demand volatility (festival spikes: Diwali, Holi \u2014 30-50% volume surge), (b) SKU proliferation (average FMCG company: 5,000+ active SKUs), (c) Rural logistics cost premium (20-30% higher than urban), (d) Trade loading and secondary sales distortion (distributors pushing stock for scheme benefits), and (e) Counterfeit products (5-8% of FMCG market in grey market).",
  },
  {
    t: "FMCG Route Optimization and Last-Mile Delivery: Salesman-Carry, Van Selling, and Pre-Sold",
    c: "India\u2019s FMCG last-mile delivery operates through three primary models: (1) Salesman-Carry (SMC): Salesman visits retailer on foot/bicycle with a carry bag of 20-50 SKUs, takes order, delivery follows next day. Coverage: 15-25 outlets per day per salesman, 8-10 km radius. Used by: HUL, Dabur, Marico for high-frequency kirana stores. (2) Van Selling: Salesman travels in a loaded van (100-200 SKUs, 500-1000 cases), takes order and delivers same-day. Coverage: 10-15 outlets per day per van, 30-50 km radius. Used by: ITC, Britannia, Nestle for medium-frequency outlets. (3) Pre-Sold / Prescribe: Order taken by sales representative (visited previous day via handheld), delivery by separate delivery van next day. Coverage: 30-40 deliveries per day per van. Used by: all FMCG companies for maximum delivery efficiency. India\u2019s FMCG route optimization: (a) Route planning software ( Salesforce, BeatRoute, FieldAssist, Bizom) for primary and secondary route optimization, (b) Beat planning: 250-300 working days/year, 4-6 beats per month per retailer, (c) Coverage optimization: territory management for balanced workload across salesforce (average territory: 200-300 outlets per salesman), and (d) Dynamic routing: real-time traffic integration (Google Maps API) for delivery vans. Last-mile delivery technology: (a) Electronic Proof of Delivery (ePOD): 95%+ adoption in organized FMCG (digital signatures, photo confirmation, GPS timestamp), (b) Handheld terminals: 1.5 lakh+ devices deployed across FMCG salesforce (real-time order capture, inventory check, scheme execution), (c) Digital payment: UPI integration for cash-on-delivery (reducing cash handling by 60%), (d) Temperature monitoring for cold-chain FMCG (ice cream, dairy, frozen: IoT sensors in reefer vans), and (e) Reverse logistics: 5-8% return rate in FMCG (expiry damage, wrong delivery, consumer returns), managed via return pickup routes. India\u2019s FMCG delivery cost: urban \u20b92-4 per case, semi-urban \u20b95-8 per case, rural \u20b98-15 per case. The FMCG sector is rapidly adopting quick commerce integration: Blinkit, Zepto, and Swiggy Instamart now carry 2,000+ FMCG SKUs with 10-30 minute delivery, creating a new distribution channel that requires hyperlocal dark store inventory management and micro-fulfillment logistics. FMCG companies are investing in direct dark store supply (bypassing traditional distributors) for Q-commerce: HUL has partnered with 2,000+ Blinkit dark stores, Nestle supplies 1,500+ Zepto hubs directly.",
  },
  {
    t: "FMCG Demand Forecasting and Inventory Management: S&OP, AI/ML, and Trade Promotion Planning",
    c: "India\u2019s FMCG demand planning faces unique challenges due to: (a) Festival-driven demand spikes (Diwali: +40% for confectionery and gift sets, Holi: +30% for beverages, Ramadan: +25% for food products), (b) Weather sensitivity (summer: +35% beverages and ice cream, monsoon: +20% home care and insecticides), (c) Regional taste preferences (North India: paneer/curd heavy, South India: rice-based snacks, East India: mustard oil preference), and (d) Rural income seasonality (rabi harvest March-April: +25% rural FMCG demand, kharif harvest Oct-Nov: +20%). FMCG companies use: (1) Sales & Operations Planning (S&OP): monthly consensus forecasting involving sales, marketing, supply chain, and finance teams. HUL\u2019s S&OP process covers 28 days rolling forecast at SKU-distributor level. (2) AI/ML demand sensing: Nestle India uses ML models with 15% MAPE improvement over traditional forecasting, incorporating: POS data (from retail partners), weather data (IMD forecasts), social media sentiment analysis, and competitor pricing intelligence. (3) Trade promotion management: India\u2019s FMCG trade spend is 18-22% of revenue (\u20b95 lakh crore annually), covering: (a) Schemes for distributors (volume discounts, free goods \u2014 buy 3 get 1, seasonal bonuses), (b) Retailer incentives (display margins, scheme POP materials), (c) Consumer promotions (discounts, combos, free samples), and (d) Seasonal trade loading (Diwali gift packs, Holi color packs). Trade promotion ROI tracking: FMCG companies use TPx (Trade Promotion Excellence) platforms to measure promotion lift vs baseline. Inventory management: (a) Safety stock: 3-7 days for high-velocity SKUs (top 20% contributing 80% revenue), 15-30 days for slow-moving SKUs, (b) ABC-XYZ classification: A-items (high value, stable demand), B-items (medium value, variable demand), C-items (low value, unpredictable demand), (c) Service level target: 97-99% fill rate for A-items, 90-95% for B-items, 85% for C-items, and (d) Days of inventory (DOI): FMCG average 18-22 days, target reduction to 12-15 days through better demand sensing. India\u2019s FMCG technology stack: (1) ERP: SAP S/4HANA (HUL, Britannia), Oracle ERP (Nestle, Dabur), Microsoft Dynamics (Marico, Godrej), (2) WMS: Manhattan Associates, SAP EWM, HighJump, (3) TMS: Oracle TMS, Blue Yonder (formerly JDA), (4) Demand planning: Anaplan, o9 Solutions, Blue Yonder, (5) Sales force automation: Salesforce, Bizom, FieldAssist, and (6) Retailer integration: Galleria (shelf space management), Nielsen (market share tracking), IMS Health (pharma-FMCG overlap). FMCG industry trends: (a) Rural premiumization (rural consumers upgrading from loose to branded products), (b) Health and wellness wave (millet-based snacks, sugar-free beverages, Ayurvedic personal care: 25% CAGR), (c) Sustainable packaging (recyclable materials, refill pouches: HUL\u2019s Love Beauty and Planet, ITC\u2019s WOW packaging), and (d) Direct-to-consumer (D2C) FMCG brands (Mamaearth, Boat, Sugar: \u20b912,000 crore market, 30% CAGR).",
  },
];

export default function FmcgDistributionLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: ORDER_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.soNumber.toLowerCase().includes(q) && !r.dc.toLowerCase().includes(q) && !r.sku.toLowerCase().includes(q) && !r.retailer.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof OrderRecord] as string));
  });

  return (
    <div className="fmcg-root p-6 space-y-6">
      <PageHeader title="FMCG Distribution Logistics" description="India FMCG supply chain covering Rs 25 lakh crore market, 12 lakh retail outlets, modern trade and general trade distribution, 3PL warehousing, route optimization, S&OP demand planning, and last-mile delivery across 3,500+ distribution centers" />
      <div className="fmcg-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`fmcg-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-red-700 text-white" : "text-gray-600 hover:bg-red-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="fmcg-dash space-y-6">
          <div className="fmcg-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="fmcg-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 fmcg-kpi-label">{k.l}</div><div className="text-2xl font-bold text-red-700 fmcg-kpi-val">{k.v}</div><div className="text-xs text-gray-400 fmcg-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="fmcg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Orders (Cases)</h3><BarChart data={monthlyOrders} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="personal" fill="#dc2626" radius={[4,4,0,0]} name="Personal Care" /><Bar dataKey="home" fill="#ef4444" radius={[4,4,0,0]} name="Home Care" /><Bar dataKey="food" fill="#f87171" radius={[4,4,0,0]} name="Packaged Foods" /><Bar dataKey="beverage" fill="#fca5a5" radius={[4,4,0,0]} name="Beverages" /></BarChart></div>
            <div className="fmcg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">FMCG Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="fmcg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Order Fill Rate (%) vs 96% Target</h3><LineChart data={fillRateTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[90, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#dc2626" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="fmcg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Distribution Center Performance</h3><BarChart data={dcPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[85, 100]} /><Tooltip /><Bar dataKey="v" fill="#ef4444" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="fmcg-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "FMCG Distribution", href: "#" }, { label: "Order Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="fmcg-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,SO Number,DC,Zone,Category,SKU,Cases,Units,Retailer,Mode,Pick Date,ETA,Transit (d),Value (\u20b9L),Priority,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Last-Mile Delivery" ? "fmcg-row-critical bg-red-50" : r.status === "Picked" || r.status === "Dispatched" ? "fmcg-row-warning bg-amber-50" : r.status === "In Transit" ? "fmcg-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-red-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="fmcg-badge inline-block px-2 py-0.5 rounded text-xs bg-red-700 text-white font-mono">{r.soNumber}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.dc}</td>
                <td className="px-3 py-2"><span className="fmcg-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="fmcg-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.sku}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.cases}</td>
                <td className="px-3 py-2 text-xs">{r.units}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.retailer}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.pickDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate || <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 2 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-red-700">{r.valueLakhs}</td>
                <td className="px-3 py-2 text-center">{r.priorityFlag ? <span className="fmcg-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">PRIO</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`fmcg-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="fmcg-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="fmcg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Order Volume by Zone</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ")[0], v: +ri(15, 45, 28 + Math.random() * 12).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#dc2626" radius={[4,4,0,0]} name="Orders" /></BarChart></div>
            <div className="fmcg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Distribution by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], personal: ri(80, 160, 110 + Math.sin(i*0.5)*20), home: ri(40, 90, 60 + Math.cos(i*0.6)*12), food: ri(60, 130, 90 + Math.sin(i*0.7)*15) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="personal" stackId="1" stroke="#dc2626" fill="#fee2e2" name="Personal Care" /><Area type="monotone" dataKey="home" stackId="1" stroke="#ef4444" fill="#fecaca" name="Home Care" /><Area type="monotone" dataKey="food" stackId="1" stroke="#f87171" fill="#fff1f2" name="Packaged Food" /></AreaChart></div>
          </div>
          <div className="fmcg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Transport Mode</h3><BarChart data={[{n:"Dry Container",v:1.5},{n:"Refrigerated",v:1},{n:"Multi-Temp Reefer",v:1.2},{n:"Open Truck",v:2},{n:"Rail Container",v:3},{n:"Shared 3PL",v:1.8}].map(d => ({...d, v: +ri(d.v-0.3, d.v+0.5, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#ef4444" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="fmcg-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="fmcg-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-red-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
