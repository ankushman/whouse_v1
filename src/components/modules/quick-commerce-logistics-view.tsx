"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#991b1b", "#7f1d1d", "#fecaca", "#fee2e2"];
const DARK_STORES = ["Blinkit Koramangala", "Zepto HSR Layout", "BigBasket Indiranagar", "Swiggy Instamart GK2", "Dunzo Kammanahalli", "Tata Now MG Road", "Jiomart Whitefield", "Amazon Fresh JP Nagar"];
const CATEGORIES = ["Fresh Fruits & Vegetables", "Dairy & Eggs", "Snacks & Beverages", "Personal Care", "Household Supplies", "Baby Care", "Pet Care", "Pharmacy OTC"];
const ORDER_STATUSES = ["Picked", "Packing", "Out for Delivery", "Delivered", "Cancelled", "Refunded"];
const ZONES = ["South Bengaluru", "East Bengaluru", "West Bengaluru", "Central Bengaluru", "North Bengaluru", "Suburban"];
const RIDER_TYPES = ["Two-Wheeler", "Bicycle", "Walking Courier", "E-Van (Last Mile)", "Auto Rickshaw"];
const TABS = ["Dashboard", "Order Registry", "Q-Commerce Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Picked": "blue", "Packing": "amber", "Out for Delivery": "blue", "Delivered": "green", "Cancelled": "red", "Refunded": "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyOrders = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], fresh: ri(4200, 7800, 5800 + Math.sin(i * 0.5) * 1000), dairy: ri(2800, 5200, 3800 + Math.cos(i * 0.6) * 700), snacks: ri(2200, 4200, 3000 + Math.sin(i * 0.7) * 600), personal: ri(1500, 3000, 2100 + Math.cos(i * 0.8) * 400) }));
const categoryDist = [{ n: "Fresh Fruits & Veg", v: 28 }, { n: "Dairy & Eggs", v: 22 }, { n: "Snacks & Bev", v: 18 }, { n: "Personal Care", v: 10 }, { n: "Household", v: 10 }, { n: "Baby Care", v: 6 }, { n: "Pet Care", v: 3 }, { n: "Pharmacy OTC", v: 3 }];
const deliveryTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(8, 15, 11 + Math.sin(i * 0.4) * 1.5)).toFixed(1), target: 10.0 }));
const storePerf = DARK_STORES.slice(0, 6).map(s => ({ n: s.split(" ")[0], v: +ri(78, 98, 88 + Math.random() * 8).toFixed(0) }));

interface OrderRecord { id: string; orderNo: string; store: string; customer: string; zone: string; category: string; item: string; quantity: number; value: number; riderType: string; orderTime: string; deliverTime: string; promisedMin: number; actualMin: number; onTime: boolean; status: string; remarks: string; }

const records: OrderRecord[] = [
  { id: "QCL-0001", orderNo: "BLK/2025/78234501", store: "Blinkit Koramangala", customer: "Rahul Sharma", zone: "South Bengaluru", category: "Fresh Fruits & Vegetables", item: "Banana Robusta 1 Dozen + Onion 2 KG", quantity: 3, value: 180, riderType: "Two-Wheeler", orderTime: "2025-07-12 14:22", deliverTime: "2025-07-12 14:30", promisedMin: 10, actualMin: 8, onTime: true, status: "Delivered", remarks: "Fruits and vegetables combo order - delivered 2 min early" },
  { id: "QCL-0002", orderNo: "ZPT/2025/91345678", store: "Zepto HSR Layout", customer: "Priya Iyer", zone: "South Bengaluru", category: "Dairy & Eggs", item: "Amul Toned Milk 1L + Curd 400g + Paneer 200g", quantity: 3, value: 165, riderType: "Two-Wheeler", orderTime: "2025-07-12 15:05", deliverTime: "2025-07-12 15:15", promisedMin: 10, actualMin: 10, onTime: true, status: "Delivered", remarks: "Dairy essentials - delivered on time at 10 min" },
  { id: "QCL-0003", orderNo: "BBK/2025/64512890", store: "BigBasket Indiranagar", customer: "Arjun Mehta", zone: "East Bengaluru", category: "Snacks & Beverages", item: "Lays Classic 3-pack + Coke 750ml + Maggi 4-pack", quantity: 8, value: 420, riderType: "E-Van (Last Mile)", orderTime: "2025-07-12 12:30", deliverTime: "", promisedMin: 15, actualMin: 0, onTime: false, status: "Packing", remarks: "Party snacks bulk order - packing in progress" },
  { id: "QCL-0004", orderNo: "SGI/2025/82345612", store: "Swiggy Instamart GK2", customer: "Neha Gupta", zone: "Central Bengaluru", category: "Personal Care", item: "Dove Shampoo 340ml + Sensodyne 150g + Gillette Mach3", quantity: 3, value: 680, riderType: "Two-Wheeler", orderTime: "2025-07-12 16:10", deliverTime: "2025-07-12 16:22", promisedMin: 10, actualMin: 12, onTime: false, status: "Delivered", remarks: "Personal care combo - 2 min late due to rain" },
  { id: "QCL-0005", orderNo: "DNZ/2025/45129876", store: "Dunzo Kammanahalli", customer: "Karthik Raman", zone: "East Bengaluru", category: "Household Supplies", item: "Surf Excel Matic 2KG + Harpic 1L + Colin 500ml", quantity: 3, value: 520, riderType: "Two-Wheeler", orderTime: "2025-07-12 13:45", deliverTime: "", promisedMin: 10, actualMin: 0, onTime: false, status: "Cancelled", remarks: "Customer cancelled - changed mind on brand" },
  { id: "QCL-0006", orderNo: "TTN/2025/78234590", store: "Tata Now MG Road", customer: "Divya Krishnan", zone: "Central Bengaluru", category: "Pharmacy OTC", item: "Dolo 650mg x 10 + Crocin Advance x 6 + Volini Spray", quantity: 3, value: 285, riderType: "Walking Courier", orderTime: "2025-07-12 10:15", deliverTime: "2025-07-12 10:22", promisedMin: 10, actualMin: 7, onTime: true, status: "Delivered", remarks: "Pharmacy OTC order - walking courier nearby store" },
  { id: "QCL-0007", orderNo: "JMF/2025/34567812", store: "Jiomart Whitefield", customer: "Suresh Nair", zone: "East Bengaluru", category: "Fresh Fruits & Vegetables", item: "Tomato 2KG + Capsicum 500g + Carrot 1KG", quantity: 3, value: 230, riderType: "Two-Wheeler", orderTime: "2025-07-12 11:30", deliverTime: "2025-07-12 11:41", promisedMin: 10, actualMin: 11, onTime: false, status: "Delivered", remarks: "Fresh produce - 1 min late due to store restocking" },
  { id: "QCL-0008", orderNo: "AMF/2025/92345678", store: "Amazon Fresh JP Nagar", customer: "Anita Desai", zone: "South Bengaluru", category: "Baby Care", item: "Huggies Wonder Pants L-3 x 40 + Johnson Baby Oil 200ml", quantity: 2, value: 890, riderType: "Auto Rickshaw", orderTime: "2025-07-12 09:20", deliverTime: "2025-07-12 09:28", promisedMin: 15, actualMin: 8, onTime: true, status: "Delivered", remarks: "Baby essentials - auto for bulky diaper pack" },
  { id: "QCL-0009", orderNo: "BLK/2025/56781234", store: "Blinkit Koramangala", customer: "Vikram Singh", zone: "South Bengaluru", category: "Pet Care", item: "Royal Canin Adult Dog 3KG + Pedigree 1.2KG", quantity: 2, value: 1450, riderType: "Two-Wheeler", orderTime: "2025-07-12 14:55", deliverTime: "", promisedMin: 10, actualMin: 0, onTime: false, status: "Out for Delivery", remarks: "Pet food heavy items - rider assigned" },
  { id: "QCL-0010", orderNo: "ZPT/2025/67890123", store: "Zepto HSR Layout", customer: "Meera Joshi", zone: "South Bengaluru", category: "Dairy & Eggs", item: "Amul Cheese Slices 10-pack + Eggs Farm Fresh 12", quantity: 2, value: 275, riderType: "Bicycle", orderTime: "2025-07-12 08:10", deliverTime: "2025-07-12 08:19", promisedMin: 10, actualMin: 9, onTime: true, status: "Delivered", remarks: "Morning dairy - bicycle delivery within 1 km" },
  { id: "QCL-0011", orderNo: "BBK/2025/89012345", store: "BigBasket Indiranagar", customer: "Rajesh Kumar", zone: "East Bengaluru", category: "Snacks & Beverages", item: "Red Bull 250ml x 6 + Haldiram Aloo Bhujia 400g x 2", quantity: 8, value: 720, riderType: "Two-Wheeler", orderTime: "2025-07-12 16:30", deliverTime: "", promisedMin: 15, actualMin: 0, onTime: false, status: "Picked", remarks: "Weekend party snacks - items being picked from aisles" },
  { id: "QCL-0012", orderNo: "SGI/2025/90123456", store: "Swiggy Instamart GK2", customer: "Pooja Agarwal", zone: "Central Bengaluru", category: "Household Supplies", item: "Vim Dishwash Gel 750ml + Scotch Brite 3-pack", quantity: 4, value: 320, riderType: "Walking Courier", orderTime: "2025-07-12 10:40", deliverTime: "2025-07-12 10:48", promisedMin: 10, actualMin: 8, onTime: true, status: "Delivered", remarks: "Kitchen essentials - walking courier nearby" },
  { id: "QCL-0013", orderNo: "BLK/2025/12345678", store: "Blinkit Koramangala", customer: "Arun Patel", zone: "South Bengaluru", category: "Personal Care", item: "Nivea Body Lotion 400ml + Colgate MaxFresh 150g x 2", quantity: 3, value: 450, riderType: "Two-Wheeler", orderTime: "2025-07-12 13:10", deliverTime: "2025-07-12 13:20", promisedMin: 10, actualMin: 10, onTime: true, status: "Delivered", remarks: "Personal care bundle - delivered exactly at 10 min" },
  { id: "QCL-0014", orderNo: "JMF/2025/23456789", store: "Jiomart Whitefield", customer: "Sunitha Rao", zone: "East Bengaluru", category: "Fresh Fruits & Vegetables", item: "Apple Shimla 1KG + Grapes Green 500g + Watermelon 3KG", quantity: 3, value: 380, riderType: "Two-Wheeler", orderTime: "2025-07-12 15:30", deliverTime: "", promisedMin: 15, actualMin: 0, onTime: false, status: "Refunded", remarks: "Watermelon out of stock - partial refund processed" },
];

const activeCount = records.filter(r => r.status === "Picked" || r.status === "Packing" || r.status === "Out for Delivery").length;
const deliveredCount = records.filter(r => r.status === "Delivered").length;
const issueCount = records.filter(r => r.status === "Cancelled" || r.status === "Refunded").length;
const totalValue = records.reduce((s, r) => s + r.value, 0);
const onTimeRate = records.filter(r => r.onTime && r.status === "Delivered").length / Math.max(1, records.filter(r => r.status === "Delivered").length) * 100;

const kpis = [
  { l: "Active Orders", v: activeCount, s: "being processed" },
  { l: "Delivered", v: deliveredCount, s: "completed orders" },
  { l: "Cancelled / Refund", v: issueCount, s: "problem orders" },
  { l: "On-Time Rate", v: `${onTimeRate.toFixed(0)}%`, s: "across deliveries" },
];

const INSIGHTS = [
  {
    t: "India Quick Commerce: \u20b960,000 Crore Market and 10-Minute Delivery Revolution",
    c: "India\u2019s quick commerce (q-commerce) market is valued at approximately \u20b960,000 crore (USD 7.2 billion) in FY2025, growing at 45-55% CAGR, making it the world\u2019s fastest-growing instant delivery market. The segment handles 1.5-2.0 million daily orders across 40+ cities, with an average delivery time of 10-12 minutes for groceries and essentials. India\u2019s q-commerce is dominated by: (1) Blinkit (Zomato subsidiary, 1,000+ dark stores in 130+ cities, 7-10 min delivery, 40% market share, targeting 2,000 stores by FY2026), (2) Zepto (700+ dark stores in 8 metro cities, 10-min delivery promise, 25% market share, valued at \u20b96,700 crore / USD 800 million), (3) Swiggy Instamart (600+ dark stores, 15-min delivery, 15% market share, leveraging Swiggy\u2019s 2 million daily food orders), (4) BigBasket (Tata Group, transitioning from 2-hour to 30-min delivery via bbnow stores, 200+ dark stores), (5) Dunzo (Pickle Energy acquisition, dark store network downsized), (6) Tata Now (Tata Neu integration, 100+ dark stores in 10 cities), and (7) Amazon Fresh (30-min delivery via Fresh/Pantry stores in 8 cities). India\u2019s q-commerce works through dark stores (compact warehouses of 2,000-4,000 sq ft stocking 5,000-6,000 SKUs in high-demand categories) located in residential areas within 2-3 km delivery radius of target customers. Each dark store handles 200-300 orders per day with 15-25 riders operating in shifts. The average order value (AOV) is \u20b9450-600, with contribution margins improving from -15% in 2022 to 0-5% in 2025 as scale efficiencies and advertising revenue mature. India\u2019s q-commerce penetration in grocery is projected to reach 12-15% by FY2027 from 4% in FY2023. The government\u2019s ONDC (Open Network for Digital Commerce) is integrating q-commerce players enabling cross-platform delivery, while the Consumer Protection (E-commerce) Rules 2020 mandate clear display of delivery timelines, return policies, and grievance redressal for instant delivery apps.",
  },
  {
    t: "Dark Store Operations: Micro-Fulfillment, Hyperlocal Inventory, and Rider Fleet",
    c: "India\u2019s quick commerce dark stores are micro-fulfillment centers designed for ultra-fast order processing with: (1) Store layout optimized for 60-second pick paths (top 500 SKUs at eye level, fast-movers near dispatch area, cold items in walk-in coolers), (2) Technology stack: cloud-based POS (Point of Sale), real-time inventory management (perpetual inventory with 99.5% accuracy), AI-powered demand forecasting (predicting hourly demand spikes for 6,000 SKUs), and dynamic routing for riders (Google Maps API with real-time traffic), (3) Order processing pipeline: order received (0-30 sec) \u2192 picking (60-120 sec for 5-8 items) \u2192 quality check (15-30 sec) \u2192 packing (15-30 sec) \u2192 rider assignment (5-10 sec) \u2192 delivery (5-8 min for 2 km), (4) Temperature management: walk-in coolers at 2-4\u00b0C (dairy, meat, beverages), ambient zone at 20-25\u00b0C (dry groceries, snacks), and frozen section at -18\u00b0C (ice cream, frozen foods), and (5) Waste management: 8-12% shrinkage for perishables (fruits, vegetables, dairy), managed through daily markdown algorithms and food bank donations. Rider fleet management involves: (1) Delivery partners (gig workers on platform, earning \u20b925,000-40,000/month with 60-80 deliveries/day), (2) Rider onboarding: background verification, vehicle inspection, training on food safety and handling, (3) Rider technology: rider app with navigation, order details, customer contact, proof of delivery (OTP + photo), and earnings dashboard, (4) Peak management: surge pricing for morning (8-10 AM) and evening (6-9 PM) demand peaks, with rider density 3-4 per dark store in normal hours and 6-8 during peak, and (5) Rider retention: 60-65% monthly retention rate, with incentives for high-delivery-count riders and performance bonuses for on-time delivery above 95%. Each dark store generates \u20b98-15 lakh daily GMV (Gross Merchandise Value) with 200-300 orders, contributing \u20b92-4 crore monthly GMV at the store level. India\u2019s dark store economics have improved dramatically: store-level EBITDA breakeven achieved in 18-24 months (down from 36-48 months in 2022), driven by higher order density (400+ orders/day in mature stores), advertising revenue (5-8% of order value), and private label margins (20-30% higher than branded products).",
  },
  {
    t: "Supply Chain and Category Management: Fresh Produce Sourcing and Private Labels",
    c: "India\u2019s quick commerce supply chain for groceries operates through a hybrid model combining: (1) Direct farm sourcing (20-30% of fresh produce): Blinkit and Zepto source directly from farmers via aggregation platforms (Ninjacart, WayCool, DeHaat) for fruits, vegetables, and staples, reducing intermediaries and ensuring 24-hour farm-to-store freshness, (2) Distribution center (DC) supply (50-60%): branded FMCG products supplied through traditional distribution networks from HUL, ITC, Nestle, P&G, and Britannia regional distribution centers, with daily replenishment cycles for high-velocity SKUs, (3) Cross-docking (10-15%): temperature-sensitive products (dairy, meat) cross-docked from cold chain facilities (Snowman, LT Foods) for same-day store delivery, and (4) Private label sourcing (15-20%): q-commerce companies launching own brands with 20-30% margin advantage (Blinkit Select, Zepto Brand, Swiggy Instamart Best). Key categories and their supply chain characteristics include: (1) Fresh Fruits & Vegetables (28% of orders): highest perishability (2-5 day shelf life), highest shrinkage (12-15%), sourced from mandis/farms, sorted and graded in-store, demand highly variable by season and weather, (2) Dairy & Eggs (22%): daily replenishment required, cold chain from farm to store (2-4\u00b0C), short shelf life (5-7 days for milk, 21 days for eggs), (3) Snacks & Beverages (18%): stable shelf life (3-12 months), high margin, impulse-driven purchases, heavy during weekend and festive periods, (4) Personal Care (10%): FMCG-style supply chain, monthly replenishment, lower perishability, higher AOV per order. India\u2019s q-commerce inventory management uses ABC-XYZ classification: A-items (top 500 SKUs, 70% of revenue) with real-time stock tracking and 99% availability targets, B-items (500-2,000 SKUs, 20% of revenue) with daily replenishment, and C-items (2,000-6,000 SKUs, 10% of revenue) with weekly replenishment and safety stock of 3-5 days. Private label penetration has reached 15-20% of q-commerce GMV, with Blinkit\u2019s private label portfolio (cooking oil, rice, atta, pulses) generating \u20b9200 crore monthly GMV at 30% gross margin versus 18% for branded products.",
  },
  {
    t: "Quick Commerce Expansion: Tier 2/3 Cities and Technology-Driven Hyperlocal Delivery",
    c: "India\u2019s quick commerce expansion beyond metro cities is the next growth frontier, with players targeting Tier 2/3 cities (Jaipur, Lucknow, Chandigarh, Indore, Kochi, Coimbatore, Nagpur) where grocery e-commerce penetration is only 3-5% versus 15-20% in Tier 1 metros. The Tier 2/3 expansion strategy involves: (1) Lower dark store setup cost (\u20b915-20 lakh versus \u20b925-30 lakh in metros due to lower real estate costs), (2) Higher per-order delivery viability (\u20b950-70 delivery fee versus \u20b925-40 in metros due to longer distances), (3) SKU optimization for local demand patterns (regional brands, local staples, language-specific packaging), and (4) Rider fleet hiring from local workforce with lower wage expectations (\u20b918,000-28,000/month). India\u2019s q-commerce technology stack includes: (1) AI-powered demand forecasting: predicting demand at 15-minute granularity for 6,000 SKUs per store using historical order patterns, weather data, local events, and social media trends, (2) Dynamic pricing: surge pricing during peak demand (8-10 AM, 6-9 PM) and rain events (30-50% order spike during monsoon), (3) Route optimization: real-time traffic integration with Google Maps, Uber Movement, and local traffic sensors, (4) Computer vision: automated quality checking of fresh produce at receiving docks using AI cameras detecting ripeness, size, and defects, (5) Voice commerce: Alexa/Google Assistant integration enabling voice-based ordering for repeat customers, and (6) Drone delivery trials: Zomato (Blinkit) and Swiggy conducting drone delivery trials in Bengaluru and Hyderabad for 1-2 kg parcels within 5 km, targeting 3-minute delivery for emergency items. India\u2019s regulatory landscape for q-commerce includes: (1) FSSAI license mandatory for all food handling dark stores, (2) State-specific labor laws for gig worker welfare (Kerala Gig Workers Welfare Fund), (3) Municipal licensing for dark store operations (fire safety, waste disposal), and (4) impending Drone Rules 2.0 (Beyond Visual Line of Sight - BVLOS operations for commercial deliveries). India\u2019s q-commerce market is projected to reach \u20b91,50,000 crore by FY2028 with 5,000+ dark stores across 200+ cities, handling 5 million daily orders.",
  },
];

export default function QuickCommerceLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: ORDER_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "store", label: "Store", options: DARK_STORES.map(s => ({ value: s, count: records.filter(r => r.store === s).length })) },
    { key: "riderType", label: "Rider Type", options: RIDER_TYPES.map(ri => ({ value: ri, count: records.filter(r => r.riderType === ri).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.orderNo.toLowerCase().includes(q) && !r.store.toLowerCase().includes(q) && !r.customer.toLowerCase().includes(q) && !r.item.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof OrderRecord] as string));
  });

  return (
    <div className="qcl-root p-6 space-y-6">
      <PageHeader title="Quick Commerce Logistics" description="India 10-minute delivery dark store operations, Blinkit Zepto Swiggy Instamart order fulfillment, rider fleet management, fresh produce dairy grocery hyperlocal delivery, and q-commerce warehouse automation" />
      <div className="qcl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`qcl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-red-700 text-white" : "text-gray-600 hover:bg-red-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="qcl-dash space-y-6">
          <div className="qcl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="qcl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 qcl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-red-700 qcl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 qcl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="qcl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Orders by Category (K)</h3><BarChart data={monthlyOrders} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="fresh" fill="#dc2626" radius={[4,4,0,0]} name="Fresh" /><Bar dataKey="dairy" fill="#ef4444" radius={[4,4,0,0]} name="Dairy" /><Bar dataKey="snacks" fill="#f87171" radius={[4,4,0,0]} name="Snacks" /><Bar dataKey="personal" fill="#fca5a5" radius={[4,4,0,0]} name="Personal" /></BarChart></div>
            <div className="qcl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="qcl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Delivery Time (min) vs 10-min Target</h3><LineChart data={deliveryTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[5, 18]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#dc2626" strokeWidth={2} name="Actual Min" /><Line type="monotone" dataKey="target" stroke="#16a34a" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="qcl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dark Store Performance Score</h3><BarChart data={storePerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[75, 100]} /><Tooltip /><Bar dataKey="v" fill="#ef4444" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="qcl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Quick Commerce", href: "#" }, { label: "Order Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="qcl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Order No,Store,Customer,Category,Item,Qty,Rider,Order Time,Delivered,Promise (m),Actual (m),On-Time,Value (\u20b9),Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Cancelled" || r.status === "Refunded" ? "qcl-row-critical bg-red-50" : r.status === "Packing" ? "qcl-row-warning bg-amber-50" : r.status === "Out for Delivery" ? "qcl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-red-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="qcl-badge inline-block px-2 py-0.5 rounded text-xs bg-red-700 text-white font-mono">{r.orderNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.store.split(" ").slice(0,1).pop()}</td>
                <td className="px-3 py-2 text-xs">{r.customer}</td>
                <td className="px-3 py-2"><span className="qcl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-36 truncate">{r.item}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.quantity}</td>
                <td className="px-3 py-2 text-xs">{r.riderType}</td>
                <td className="px-3 py-2 text-xs">{r.orderTime}</td>
                <td className="px-3 py-2 text-xs">{r.deliverTime || <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2 text-xs">{r.promisedMin}</td>
                <td className="px-3 py-2"><span className={`text-xs font-bold ${r.actualMin === 0 ? "text-gray-400" : r.actualMin <= r.promisedMin ? "text-green-600" : "text-red-600"}`}>{r.actualMin === 0 ? "-" : `${r.actualMin}m`}</span></td>
                <td className="px-3 py-2 text-center">{r.deliverTime ? (r.onTime ? <span className="text-green-600 font-bold">ON</span> : <span className="text-red-600 font-bold">LATE</span>) : <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2 text-xs font-semibold text-red-700">{r.value}</td>
                <td className="px-3 py-2"><span className={`qcl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="qcl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="qcl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Orders by Store</h3><BarChart data={DARK_STORES.slice(0,6).map(s => ({ n: s.split(" ")[0], v: +ri(22, 48, 34 + Math.random() * 10).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#dc2626" radius={[4,4,0,0]} name="Orders/Day" /></BarChart></div>
            <div className="qcl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Orders by Zone Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], south: ri(22, 38, 28 + Math.sin(i*0.5)*4), east: ri(18, 32, 24 + Math.cos(i*0.6)*3.5), central: ri(14, 26, 18 + Math.sin(i*0.7)*3) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="south" stackId="1" stroke="#dc2626" fill="#fee2e2" name="South" /><Area type="monotone" dataKey="east" stackId="1" stroke="#ef4444" fill="#fecaca" name="East" /><Area type="monotone" dataKey="central" stackId="1" stroke="#f87171" fill="#fff1f2" name="Central" /></AreaChart></div>
          </div>
          <div className="qcl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Delivery Time by Rider Type (min)</h3><BarChart data={[{n:"Two-Wheeler",v:9},{n:"Bicycle",v:12},{n:"Walking",v:8},{n:"E-Van",v:14},{n:"Auto Rickshaw",v:10}].map(d => ({...d, v: +ri(d.v-2, d.v+3, d.v + Math.random()*2).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[5, 18]} /><Tooltip /><Bar dataKey="v" fill="#ef4444" radius={[4,4,0,0]} name="Minutes" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="qcl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="qcl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-red-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
