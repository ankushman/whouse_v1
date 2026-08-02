"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0369a1", "#0284c7", "#0ea5e9", "#38bdf8", "#075985", "#0c4a6e", "#7dd3fc", "#bae6fd"];
const CHILLING_CENTERS = ["Amul Anand GCMMF", "Mother Dairy Delhi", "Nandini KMF Bengaluru", "Sudha GCMMF Kolkata", "Aavin Chennai Dairy", "Gokul Kolhapur", "Verka Ludhiana", "Heritage Hyderabad"];
const CATEGORIES = ["Fresh Milk", "Curd / Yogurt", "Butter / Ghee", "Cheese / Paneer", "Ice Cream", "Flavored Milk", "Cream / Whey", "UHT Packets"];
const SHIPMENT_STATUSES = ["Milked", "In Cold Transit", "Received at Plant", "Pasteurizing", "Quality Lab Test", "Packaged / Dispatched"];
const ROUTES = ["Gujarat Milk Route", "Rajasthan Circuit", "MP Bundelkhand", "Maharashtra Western", "Karnataka Southern", "Tamil Nadu Coastal"];
const MODES = ["Insulated Milk Tanker", "Bulk Chiller Truck", "Reefer Container", "Cold Van 2T", "Rail Milk Wagon", "Auto Milk Can"];
const TABS = ["Dashboard", "Shipment Registry", "Dairy Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Milked": "blue", "In Cold Transit": "blue", "Received at Plant": "green", "Pasteurizing": "amber", "Quality Lab Test": "amber", "Packaged / Dispatched": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyIntake = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], fresh: ri(1800, 3200, 2400 + Math.sin(i * 0.5) * 400), curd: ri(600, 1100, 800 + Math.cos(i * 0.6) * 150), butter: ri(300, 550, 400 + Math.sin(i * 0.7) * 60), cheese: ri(150, 300, 210 + Math.cos(i * 0.8) * 40) }));
const categoryDist = [{ n: "Fresh Milk", v: 45 }, { n: "Curd / Yogurt", v: 16 }, { n: "Butter / Ghee", v: 12 }, { n: "Cheese / Paneer", v: 10 }, { n: "Ice Cream", v: 7 }, { n: "Flavored Milk", v: 5 }, { n: "Cream / Whey", v: 3 }, { n: "UHT Packets", v: 2 }];
const coldChainTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(96, 99.8, 98.2 + Math.sin(i * 0.4) * 0.8)).toFixed(1), target: 97.5 }));
const centerPerf = CHILLING_CENTERS.slice(0, 6).map(c => ({ n: c.split(" ").slice(0, 2).join(" "), v: +ri(88, 99, 94 + Math.random() * 4).toFixed(0) }));

interface ShipmentRecord { id: string; batchId: string; center: string; route: string; category: string; item: string; volume: number; unit: string; farmer: string; origin: string; destination: string; mode: string; milkDate: string; receiveDate: string; transitHrs: number; fatSnf: string; valueLakhs: number; coldFlag: boolean; status: string; remarks: string; }

const records: ShipmentRecord[] = [
  { id: "DFL-0001", batchId: "BTH-AMUL/2025/7821", center: "Amul Anand GCMMF", route: "Gujarat Milk Route", category: "Fresh Milk", item: "Cow Milk Bulk 4000L", volume: 4000, unit: "Litres", farmer: "GCMMF Anand Cooperative", origin: "Kheda Village DC", destination: "Amul Processing Plant", mode: "Insulated Milk Tanker", milkDate: "2025-07-10", receiveDate: "", transitHrs: 3, fatSnf: "4.0% / 8.5%", valueLakhs: 14.4, coldFlag: true, status: "In Cold Transit", remarks: "Morning milking collection Kheda district cooperative society" },
  { id: "DFL-0002", batchId: "BTH-MDF/2025/5432", center: "Mother Dairy Delhi", route: "Rajasthan Circuit", category: "Fresh Milk", item: "Buffalo Milk Bulk 6000L", volume: 6000, unit: "Litres", farmer: "Rajasthan Dairy Federation", origin: "Alwar DC Center", destination: "Mother Dairy Delhi Plant", mode: "Bulk Chiller Truck", milkDate: "2025-07-08", receiveDate: "2025-07-09", transitHrs: 8, fatSnf: "6.5% / 9.2%", valueLakhs: 32.4, coldFlag: true, status: "Packaged / Dispatched", remarks: "Buffalo milk from Alwar cooperative - polypack processed" },
  { id: "DFL-0003", batchId: "BTH-NAN/2025/9087", center: "Nandini KMF Bengaluru", route: "Karnataka Southern", category: "Curd / Yogurt", item: "Mishti Doi Set Curd 200 Cup", volume: 12000, unit: "Cups", farmer: "KMF Mandya Union", origin: "Mandya Chilling Center", destination: "KMF Bengaluru Dairy", mode: "Cold Van 2T", milkDate: "2025-07-11", receiveDate: "", transitHrs: 4, fatSnf: "3.5% / 8.2%", valueLakhs: 6, coldFlag: true, status: "In Cold Transit", remarks: "Mishti Doi set curd cups for Bengaluru retail distribution" },
  { id: "DFL-0004", batchId: "BTH-SUD/2025/3456", center: "Sudha GCMMF Kolkata", route: "MP Bundelkhand", category: "Cheese / Paneer", item: "Paneer Block 200g Lot-A", volume: 5000, unit: "Blocks", farmer: "GCMMF Bhopal Affiliate", origin: "Bhopal Processing Unit", destination: "Sudha Kolkata Warehouse", mode: "Reefer Container", milkDate: "2025-07-09", receiveDate: "2025-07-11", transitHrs: 28, fatSnf: "4.5% / 8.8%", valueLakhs: 12.5, coldFlag: true, status: "Received at Plant", remarks: "Paneer blocks refrigerated transport Bhopal to Kolkata 1400km" },
  { id: "DFL-0005", batchId: "BTH-AVN/2025/6789", center: "Aavin Chennai Dairy", route: "Tamil Nadu Coastal", category: "Butter / Ghee", item: "White Butter 500g Lot-A", volume: 8000, unit: "Packets", farmer: "Tamil Nadu Cooperative", origin: "Erode Dairy Unit", destination: "Aavin Chennai Pack House", mode: "Cold Van 2T", milkDate: "2025-07-07", receiveDate: "2025-07-08", transitHrs: 10, fatSnf: "4.2% / 8.6%", valueLakhs: 16, coldFlag: false, status: "Pasteurizing", remarks: "Butter churn lot from Erode cooperative - pasteurization in progress" },
  { id: "DFL-0006", batchId: "BTH-GOK/2025/1234", center: "Gokul Kolhapur", route: "Maharashtra Western", category: "Fresh Milk", item: "Cow Milk Bulk 3000L", volume: 3000, unit: "Litres", farmer: "Gokul Kolhapur Union", origin: "Ichalkaranji Village DC", destination: "Gokul Processing Kolhapur", mode: "Insulated Milk Tanker", milkDate: "2025-07-12", receiveDate: "", transitHrs: 2, fatSnf: "3.8% / 8.3%", valueLakhs: 10.2, coldFlag: true, status: "Milked", remarks: "Evening milking collection Ichalkaranji cooperative society" },
  { id: "DFL-0007", batchId: "BTH-VRK/2025/5678", center: "Verka Ludhiana", route: "Rajasthan Circuit", category: "Ice Cream", item: "Kulfi Matka 150ml Batch-3", volume: 20000, unit: "Units", farmer: "Verka Milk Union", origin: "Verka Ludhiana Plant", destination: "Punjab Distribution Hub", mode: "Reefer Container", milkDate: "2025-07-06", receiveDate: "2025-07-07", transitHrs: 6, fatSnf: "4.0% / 8.5%", valueLakhs: 8, coldFlag: true, status: "Quality Lab Test", remarks: "Kulfi matka batch - lab testing for fat content, coliform, and E.coli count" },
  { id: "DFL-0008", batchId: "BTH-HRT/2025/8901", center: "Heritage Hyderabad", route: "Karnataka Southern", category: "UHT Packets", item: "UHT Toned Milk 500ml Lot-B", volume: 24000, unit: "Packets", farmer: "Heritage Foods Own Farm", origin: "Heritage Medak Farm", destination: "Heritage UHT Plant", mode: "Insulated Milk Tanker", milkDate: "2025-07-05", receiveDate: "", transitHrs: 3, fatSnf: "3.0% / 8.5%", valueLakhs: 12, coldFlag: true, status: "Quality Lab Test", remarks: "UHT processing batch - microbiological test pending at Heritage lab" },
  { id: "DFL-0009", batchId: "BTH-AMUL/2025/2345", center: "Amul Anand GCMMF", route: "Gujarat Milk Route", category: "Flavored Milk", item: "Amul Kool Strawberry 200ml", volume: 15000, unit: "Bottles", farmer: "GCMMF Anand Cooperative", origin: "Amul Anand Plant", destination: "GCMMF Regional Depot", mode: "Cold Van 2T", milkDate: "2025-07-11", receiveDate: "", transitHrs: 5, fatSnf: "2.5% / 7.8%", valueLakhs: 7.5, coldFlag: true, status: "In Cold Transit", remarks: "Amul Kool flavored milk - cold chain maintained 2-4\u00b0C" },
  { id: "DFL-0010", batchId: "BTH-MDF/2025/4567", center: "Mother Dairy Delhi", route: "MP Bundelkhand", category: "Cream / Whey", item: "Fresh Cream 200ml Lot-A", volume: 8000, unit: "Packets", farmer: "MP Sahakari Dugdh", origin: "Sagar MP Dairy", destination: "Mother Dairy Delhi", mode: "Bulk Chiller Truck", milkDate: "2025-07-10", receiveDate: "2025-07-11", transitHrs: 14, fatSnf: "6.0% / 9.0%", valueLakhs: 4.8, coldFlag: true, status: "Received at Plant", remarks: "Fresh cream from Sagar cooperative - cold chain verified at intake" },
  { id: "DFL-0011", batchId: "BTH-NAN/2025/7890", center: "Nandini KMF Bengaluru", route: "Karnataka Southern", category: "Fresh Milk", item: "Buffalo Milk Bulk 5000L", volume: 5000, unit: "Litres", farmer: "KMF Hassan Union", origin: "Hassan Village DC", destination: "KMF Bengaluru Dairy", mode: "Insulated Milk Tanker", milkDate: "2025-07-09", receiveDate: "2025-07-09", transitHrs: 4, fatSnf: "6.2% / 9.1%", valueLakhs: 27.5, coldFlag: true, status: "Packaged / Dispatched", remarks: "Hassan buffalo milk - Nandini full cream sachet processing complete" },
  { id: "DFL-0012", batchId: "BTH-SUD/2025/1122", center: "Sudha GCMMF Kolkata", route: "Maharashtra Western", category: "Curd / Yogurt", item: "Dahi Cup 400g Set Lot-C", volume: 6000, unit: "Cups", farmer: "Kolhapur Dairy Union", origin: "Kolhapur Chilling Unit", destination: "Sudha Kolkata Warehouse", mode: "Reefer Container", milkDate: "2025-07-12", receiveDate: "", transitHrs: 24, fatSnf: "3.5% / 8.2%", valueLakhs: 3.6, coldFlag: true, status: "In Cold Transit", remarks: "Set dahi cups long-haul cold chain Kolhapur to Kolkata" },
  { id: "DFL-0013", batchId: "BTH-GOK/2025/3344", center: "Gokul Kolhapur", route: "Maharashtra Western", category: "Butter / Ghee", item: "Pure Ghee 500ml Tin Lot-A", volume: 4000, unit: "Tins", farmer: "Gokul Kolhapur Union", origin: "Gokul Processing Plant", destination: "Gokul Depot Mumbai", mode: "Cold Van 2T", milkDate: "2025-07-08", receiveDate: "", transitHrs: 6, fatSnf: "4.8% / 8.8%", valueLakhs: 18, coldFlag: false, status: "Pasteurizing", remarks: "Ghee clarification process in progress - no cold chain needed" },
  { id: "DFL-0014", batchId: "BTH-VRK/2025/9012", center: "Verka Ludhiana", route: "Rajasthan Circuit", category: "Fresh Milk", item: "Toned Milk 500ml Pouch", volume: 40000, unit: "Pouches", farmer: "Verka Milk Union", origin: "Verka Ludhiana Plant", destination: "Chandigarh Distribution", mode: "Cold Van 2T", milkDate: "2025-07-07", receiveDate: "2025-07-08", transitHrs: 2, fatSnf: "3.0% / 8.5%", valueLakhs: 10, coldFlag: true, status: "Packaged / Dispatched", remarks: "Toned milk pouches for Chandigarh morning delivery cycle" },
];

const transitCount = records.filter(r => r.status === "In Cold Transit" || r.status === "Milked").length;
const processCount = records.filter(r => r.status === "Pasteurizing" || r.status === "Quality Lab Test").length;
const dispatchedCount = records.filter(r => r.status === "Packaged / Dispatched" || r.status === "Received at Plant").length;
const totalValue = records.reduce((s, r) => s + r.valueLakhs, 0);

const kpis = [
  { l: "In Cold Transit / Milked", v: transitCount, s: "active cold chain" },
  { l: "Processing / Lab Test", v: processCount, s: "in progress" },
  { l: "Dispatched / Received", v: dispatchedCount, s: "completed" },
  { l: "Total Batch Value", v: `\u20b9${totalValue.toFixed(0)}L`, s: "across all routes" },
];

const INSIGHTS = [
  {
    t: "India Dairy Industry: 230 MMT Annual Milk Production, 8.5 Crore Farmer Households, \u20b916 Lakh Crore Sector",
    c: "India is the world\u2019s largest milk producer (230 MMT annual, 2024-25), contributing 24% of global milk output, with 8.5 crore farmer households engaged in dairying across 2 lakh+ village-level dairy cooperatives. India\u2019s dairy sector is valued at approximately \u20b916 lakh crore (USD 190 billion), making it the largest agricultural commodity by value. Key dairy cooperative federations include: (1) GCMMF/Amul (Gujarat, 25 million liters/day, 3.6 million farmer members, 18 district unions, brands: Amul, Sagar, Nandini-partner), (2) Mother Dairy (Delhi NCR, 5 million liters/day, 1.2 million farmers), (3) Karnataka Milk Federation/KMF/Nandini (Karnataka, 8 million liters/day, 2.4 million farmers), (4) Sudha/GCMMF Bihar & Jharkhand (3 million liters/day), (5) Verka/Milkfed Punjab (4 million liters/day), (6) Aavin/Tamil Nadu Cooperative (3.5 million liters/day), (7) Heritage Foods (Andhra/Telangana, 2 million liters/day, corporate model), and (8) Hatsun Agro Product (Tamil Nadu, 1.5 million liters/day, private). India\u2019s dairy logistics chain covers: (a) Village-level collection (2 lakh+ dairy cooperative societies, morning+evening milking), (b) Route collection via insulated tankers (15,000+ milk tankers, 2000-10000 liter capacity), (c) Chilling centers (5,000+ bulk milk coolers at village level, chilling milk from 37\u00b0C to 4\u00b0C within 3 hours), (d) Processing plants (850+ dairy plants with pasteurization, homogenization, standardization, product conversion), and (e) Distribution (cold chain to 50 lakh+ retail outlets, home delivery, and institutional buyers). India\u2019s per capita milk availability is 472 grams/day (2024-25), above the WHO recommended 285g/day. Milk breeds: crossbred (45% of production), indigenous (40%), and buffalo (15% contribute 55% of total milk fat). Buffalo milk commands premium pricing (\u20b960-70/liter vs cow milk \u20b945-55/liter) due to higher fat (6-7% vs 3-4%) and SNF (9-10% vs 8-8.5%).",
  },
  {
    t: "Cold Chain Infrastructure: Bulk Milk Coolers, Insulated Tankers, and Temperature Compliance",
    c: "India\u2019s dairy cold chain logistics is critical due to milk\u2019s perishable nature (shelf life: raw milk 4-6 hours at ambient, 48-72 hours at 4\u00b0C). Cold chain infrastructure includes: (1) Bulk Milk Coolers (BMCs): 5,000+ units at village-level dairy cooperative societies, capacity 500-5000 liters, chilling milk from 37\u00b0C to 4\u00b0C within 2-3 hours using refrigeration compressors (30-50 HP), (2) Insulated Milk Tankers: 15,000+ road tankers (stainless steel SS 304, insulated with polyurethane foam, capacity 2000-10000 liters), maintaining milk at 2-4\u00b0C during transit (average 50-300 km routes), (3) Reefer containers for long-distance product transport (paneer, cheese, ice cream), maintaining -18\u00b0C to 4\u00b0C depending on product, (4) Cold storage at processing plants: silo tanks (50,000-200,000 liter capacity) with automated CIP (Clean-in-Place) systems, maintaining 4\u00b0C for up to 72 hours, and (5) Retail cold chain: visicoolers and deep freezers at 25 lakh+ retail outlets. Temperature monitoring: (a) Digital temperature loggers in all insulated tankers (IoT-enabled, real-time alerts if temperature exceeds 6\u00b0C), (b) FSSAI mandates maximum 8\u00b0C for milk transport, (c) Amul and Mother Dairy have deployed GPS+temperature monitoring on 8,000+ tankers, and (d) Cold chain compliance rate: 97-98% across major cooperatives (target: 99%+). Key cold chain challenges: (1) Rural electrification (30% of village BMCs face 4-8 hour power cuts, requiring diesel generator backup), (2) Last-mile delivery (ice cream and fresh curd require sub-4\u00b0C even during last-mile), (3) Road conditions (milk tankers on rural roads face 20-30% higher transit time vs highways), (4) Seasonal peak (winter: milk surplus 15-20%, requiring emergency powder conversion; summer: milk deficit 10-15%), and (5) Ambient temperature variability (45\u00b0C summer in Rajasthan vs 10\u00b0C winter in Punjab). India\u2019s dairy cold chain investment is approximately \u20b98,000 crore, with an additional \u20b95,000 crore needed for capacity expansion.",
  },
  {
    t: "Milk Processing and Value Addition: Amul Model, White Revolution, and Product Diversification",
    c: "India\u2019s milk processing covers: (1) Pasteurization (HTST: High Temperature Short Time 72\u00b0C/15 sec, or LTLT: 63\u00b0C/30 min) for liquid milk, (2) Homogenization (2000 psi pressure to break fat globules for uniform texture), (3) Standardization (adjusting fat/SNF ratios: toned milk 3% fat/8.5% SNF, full cream 6% fat/9% SNF, double toned 1.5% fat), (4) UHT processing (Ultra High Temperature 135-150\u00b0C for 2-5 seconds, 6-month shelf life at ambient), and (5) Product conversion: (a) Butter (cream separation at 40\u00b0C, churning at 10\u00b0C, 15% yield from milk), (b) Ghee (clarified butter, 99.5% fat, 4.5% yield from milk), (c) Paneer (acid coagulation at 80\u00b0C, 18% yield), (d) Cheese (enzyme coagulation, 6-12 month aging for cheddar/gouda), (e) Yogurt/Dahi (Lactobacillus culture at 42\u00b0C, 4-hour set), (f) Ice cream (mix preparation at 65\u00b0C, homogenization, aging 4\u00b0C for 4 hours, hardening at -30\u00b0C), and (g) Whey protein (byproduct from paneer/cheese, spray-dried to powder). The Amul Model (Anand Pattern): (a) Three-tier cooperative structure: village dairy cooperative society (primary), district milk union (secondary), state dairy federation (tertiary), (b) Farmer-owned and controlled (voting rights: one member one vote), (c) Profit sharing: 70-80% of consumer rupee goes to farmer, (d) GCMMF handles marketing/branding, state federation handles processing, (e) This model inspired India\u2019s White Revolution (Operation Flood, 1970-1996, Dr. Verghese Kurien), making India self-sufficient in milk from a deficit position. India\u2019s dairy export: \u20b94,000 crore annually (skimmed milk powder to Southeast Asia, ghee to Middle East, casein to US/EU). Product diversification trends: (1) Premium dairy (A2 milk, organic ghee, probiotic yogurt: 25% CAGR), (2) Plant-based alternatives (oat milk, almond milk, soy yogurt: 40% CAGR, \u20b91,500 crore market), (3) Dairy ingredients (whey protein, lactose powder: 18% CAGR), and (4) Ready-to-eat dairy desserts (custard, kheer, shrikhand: 30% CAGR).",
  },
  {
    t: "Dairy Logistics Technology: IoT Monitoring, Blockchain Traceability, and Automation",
    c: "India\u2019s dairy logistics is rapidly adopting technology: (1) IoT temperature monitoring: 8,000+ milk tankers with GPS+temperature sensors (Amul, Mother Dairy, Heritage), providing real-time cold chain visibility to control rooms, with automated alerts if temperature exceeds 6\u00b0C threshold or deviation from planned route, (2) Blockchain traceability: Amul pilot (2024) for organic milk from farm to retail, enabling consumers to scan QR codes and view: farmer details, milking timestamp, chilling center logs, processing batch, lab test results, and retail delivery chain \u2014 building trust for premium organic/A2 milk segments, (3) Automated milk collection: 2,000+ village-level AMCUs (Automatic Milk Collection Units) with: electronic milk analyzers (fat%, SNF%, CLR, added water detection), electronic weighing scales (accuracy 10g), RFID-based farmer identification (smart cards), and digital payment integration (DBT via Aadhaar-linked bank accounts), (4) Dairy ERP systems: SAP/Oracle implementations at Amul, Mother Dairy, and Heritage for: production planning, cold chain scheduling, demand forecasting (ML-based 7-day forecast with 92% accuracy), inventory management (FIFO for perishable products), and distribution route optimization, (5) Milk route optimization: Amul uses AI-based route planning for 15,000+ daily tanker trips across Gujarat, optimizing for: minimum transit time, maximum chilling center utilization, fuel efficiency (8-10% reduction), and milk freshness (reducing average farm-to-plant time from 6 hours to 4 hours), (6) Quality testing automation: FTIR (Fourier Transform Infrared) spectroscopy for rapid milk composition analysis (< 2 minutes vs 30 minutes for traditional Gerber method), electronic somatic cell count (SCC) for mastitis detection, and automated antibiotic residue testing (lateral flow immunoassay), and (7) Emerging: drone-based herd monitoring for large dairy farms (Amul pilot with 50 farms), AI-powered cow health prediction (body condition scoring, heat detection, mastitis risk scoring), and lab-grown dairy proteins (precision fermentation for lactose-free milk proteins, India pilot by IIT Delhi). India\u2019s dairy digitization investment: \u20b92,000 crore (2023-2028), with major initiatives: National Digital Livestock Mission (NDLM), e-Gopala app for farmer advisory, and NDDB\u2019s dairy analytics platform.",
  },
];

export default function DairyFarmLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "route", label: "Route", options: ROUTES.map(r => ({ value: r, count: records.filter(rec => rec.route === r).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchId.toLowerCase().includes(q) && !r.center.toLowerCase().includes(q) && !r.item.toLowerCase().includes(q) && !r.farmer.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ShipmentRecord] as string));
  });

  return (
    <div className="dfl-root p-6 space-y-6">
      <PageHeader title="Dairy Farm Logistics" description="India dairy supply chain covering 230 MMT annual milk production, village cooperative collection, bulk milk coolers, insulated tanker cold chain, pasteurization processing, Amul model cooperatives, and FSSAI temperature compliance across 850+ dairy plants" />
      <div className="dfl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`dfl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-sky-800 text-white" : "text-gray-600 hover:bg-sky-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="dfl-dash space-y-6">
          <div className="dfl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="dfl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 dfl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-sky-800 dfl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 dfl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="dfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Milk Intake (1000 Litres)</h3><BarChart data={monthlyIntake} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="fresh" fill="#0369a1" radius={[4,4,0,0]} name="Fresh Milk" /><Bar dataKey="curd" fill="#0284c7" radius={[4,4,0,0]} name="Curd" /><Bar dataKey="butter" fill="#0ea5e9" radius={[4,4,0,0]} name="Butter/Ghee" /><Bar dataKey="cheese" fill="#38bdf8" radius={[4,4,0,0]} name="Cheese/Paneer" /></BarChart></div>
            <div className="dfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dairy Product Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="dfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cold Chain Compliance (%) vs 97.5% Target</h3><LineChart data={coldChainTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[94, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0369a1" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="dfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Chilling Center Performance Score</h3><BarChart data={centerPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[85, 100]} /><Tooltip /><Bar dataKey="v" fill="#0284c7" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="dfl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Dairy Farm", href: "#" }, { label: "Shipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="dfl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Batch ID,Center,Route,Category,Item,Volume,Unit,Farmer,Mode,Milk Date,Receive,Transit (h),Fat/SNF,Value (\u20b9L),Cold,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Quality Lab Test" ? "dfl-row-critical bg-red-50" : r.status === "Pasteurizing" || r.status === "Milked" ? "dfl-row-warning bg-amber-50" : r.status === "In Cold Transit" ? "dfl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-sky-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="dfl-badge inline-block px-2 py-0.5 rounded text-xs bg-sky-800 text-white font-mono">{r.batchId}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.center}</td>
                <td className="px-3 py-2"><span className="dfl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.route}</span></td>
                <td className="px-3 py-2"><span className="dfl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.item}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.volume.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{r.unit}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.farmer}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.milkDate}</td>
                <td className="px-3 py-2 text-xs">{r.receiveDate || <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitHrs > 12 ? "text-amber-600" : "text-green-600"}`}>{r.transitHrs}h</span></td>
                <td className="px-3 py-2 text-xs font-mono text-sky-700">{r.fatSnf}</td>
                <td className="px-3 py-2 text-xs font-semibold text-sky-800">{r.valueLakhs}</td>
                <td className="px-3 py-2 text-center">{r.coldFlag ? <span className="dfl-badge inline-block px-2 py-0.5 rounded text-xs bg-sky-700 text-white">2-4\u00b0C</span> : <span className="text-gray-400">AMBIENT</span>}</td>
                <td className="px-3 py-2"><span className={`dfl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="dfl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="dfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Intake Volume by Route</h3><BarChart data={ROUTES.map(r => ({ n: r.split(" ")[0], v: +ri(20, 55, 35 + Math.random() * 15).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0369a1" radius={[4,4,0,0]} name="Batches" /></BarChart></div>
            <div className="dfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Intake by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], fresh: ri(500, 900, 680 + Math.sin(i*0.5)*100), curd: ri(150, 320, 220 + Math.cos(i*0.6)*40), butter: ri(80, 180, 120 + Math.sin(i*0.7)*20) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="fresh" stackId="1" stroke="#0369a1" fill="#e0f2fe" name="Fresh Milk" /><Area type="monotone" dataKey="curd" stackId="1" stroke="#0284c7" fill="#bae6fd" name="Curd" /><Area type="monotone" dataKey="butter" stackId="1" stroke="#0ea5e9" fill="#f0f9ff" name="Butter/Ghee" /></AreaChart></div>
          </div>
          <div className="dfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Hours by Transport Mode</h3><BarChart data={[{n:"Insulated Tanker",v:3},{n:"Chiller Truck",v:8},{n:"Reefer Container",v:18},{n:"Cold Van 2T",v:4},{n:"Rail Wagon",v:24},{n:"Auto Milk Can",v:1.5}].map(d => ({...d, v: +ri(d.v-1, d.v+2, d.v + Math.random()).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0284c7" radius={[4,4,0,0]} name="Hours" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="dfl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="dfl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-sky-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
