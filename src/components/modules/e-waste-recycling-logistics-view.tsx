"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#047857", "#065f46", "#a7f3d0", "#d1fae5"];
const FACILITIES = ["Attero Roorkee Plant", "E-Parisaraa Bengaluru", "Cerebra Green Chennai", "Enviro Serv Hyderabad", "Green Vortex Mumbai", "Karo Sambhav Delhi NCR", "Terra Virtue Pune", "Namo E-Waste Gujarat"];
const CATEGORIES = ["Mobile Phones", "Desktop/Laptop", "CRT/LCD Monitors", "PCB Boards", "Batteries (Li-ion)", "Home Appliances", "Networking Equipment", "EV Battery Packs"];
const COLLECTION_STATUSES = ["Collected", "In Transit", "Received at Facility", "Under Dismantling", "Quality Analysis", "Recycled / Recovered"];
const STATES = ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi NCR", "Telangana"];
const MODES = ["Closed Van Truck", "Open Flatbed", "Temperature-Controlled", "Specialized Hazmat", "Rail Container", "Courier Pickup"];
const TABS = ["Dashboard", "Collection Registry", "E-Waste Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Collected": "blue", "In Transit": "blue", "Received at Facility": "green", "Under Dismantling": "amber", "Quality Analysis": "amber", "Recycled / Recovered": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyCollection = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], mobile: ri(800, 1500, 1100 + Math.sin(i * 0.5) * 200), laptop: ri(300, 600, 420 + Math.cos(i * 0.6) * 80), monitor: ri(200, 400, 280 + Math.sin(i * 0.7) * 50), battery: ri(150, 350, 220 + Math.cos(i * 0.8) * 40) }));
const categoryDist = [{ n: "Mobile Phones", v: 25 }, { n: "Desktop/Laptop", v: 22 }, { n: "CRT/LCD Monitors", v: 15 }, { n: "Batteries (Li-ion)", v: 14 }, { n: "Home Appliances", v: 12 }, { n: "PCB Boards", v: 6 }, { n: "Networking Equipment", v: 4 }, { n: "EV Battery Packs", v: 2 }];
const recoveryTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(85, 96, 90 + Math.sin(i * 0.4) * 3)).toFixed(1), target: 90.0 }));
const facilityPerf = FACILITIES.slice(0, 6).map(f => ({ n: f.split(" ").slice(0, 2).join(" "), v: +ri(78, 97, 88 + Math.random() * 6).toFixed(0) }));

interface CollectionRecord { id: string; manifest: string; facility: string; state: string; category: string; item: string; weight: number; unit: string; generator: string; origin: string; destination: string; mode: string; collectDate: string; receiveDate: string; transitDays: number; recoverableValueLakhs: number; hazmatFlag: boolean; status: string; remarks: string; }

const records: CollectionRecord[] = [
  { id: "EWR-0001", manifest: "MNF-ATT/2025/4521", facility: "Attero Roorkee Plant", state: "Uttar Pradesh", category: "Mobile Phones", item: "Mixed Mobile Phones Lot-A (500 units)", weight: 125, unit: "kg", generator: "Samsung Trade-In Noida", origin: "Samsung Collection Hub", destination: "Attero Roorkee Main Gate", mode: "Closed Van Truck", collectDate: "2025-07-10", receiveDate: "", transitDays: 2, recoverableValueLakhs: 8.5, hazmatFlag: false, status: "In Transit", remarks: "Samsung trade-in program mixed mobile batch" },
  { id: "EWR-0002", manifest: "MNF-EPR/2025/3345", facility: "E-Parisaraa Bengaluru", state: "Karnataka", category: "Desktop/Laptop", item: "Corporate EOL Laptops HP/Dell Mixed", weight: 380, unit: "kg", generator: "Infosys Campus Bengaluru", origin: "Infosys Electronics City", destination: "E-Parisaraa Chandapura Plant", mode: "Closed Van Truck", collectDate: "2025-07-08", receiveDate: "2025-07-09", transitDays: 1, recoverableValueLakhs: 22, hazmatFlag: false, status: "Received at Facility", remarks: "Infosys campus e-waste quarterly pickup" },
  { id: "EWR-0003", manifest: "MNF-CBG/2025/5678", facility: "Cerebra Green Chennai", state: "Tamil Nadu", category: "Batteries (Li-ion)", item: "Li-ion Battery Scrap from EV 2W", weight: 420, unit: "kg", generator: "Ather Energy Service Center", origin: "Ather Chennai Warehouse", destination: "Cerebra Green Oragadam", mode: "Specialized Hazmat", collectDate: "2025-07-11", receiveDate: "", transitDays: 1, recoverableValueLakhs: 18, hazmatFlag: true, status: "In Transit", remarks: "Li-ion battery scrap Class-9 hazardous, ADR compliant transport" },
  { id: "EWR-0004", manifest: "MNF-ESV/2025/7890", facility: "Enviro Serv Hyderabad", state: "Telangana", category: "CRT/LCD Monitors", item: "CRT Monitors 15/17 inch Mixed", weight: 860, unit: "kg", generator: "TS Govt Office Pool Hyderabad", origin: "Secretariat E-Waste Cell", destination: "Enviro Serv Patancheru", mode: "Open Flatbed", collectDate: "2025-07-09", receiveDate: "2025-07-11", transitDays: 2, recoverableValueLakhs: 4.2, hazmatFlag: false, status: "Received at Facility", remarks: "TS government CRT monitor disposal lot - leaded glass content" },
  { id: "EWR-0005", manifest: "MNF-GVX/2025/1234", facility: "Green Vortex Mumbai", state: "Maharashtra", category: "Home Appliances", item: "Mixed Home Appliances (Washing/Microwave)", weight: 1200, unit: "kg", generator: "Bajaj Electronics Trade-In", origin: "Bajaj Collection Center Andheri", destination: "Green Vortex Navi Mumbai", mode: "Open Flatbed", collectDate: "2025-07-07", receiveDate: "2025-07-08", transitDays: 1, recoverableValueLakhs: 14, hazmatFlag: false, status: "Under Dismantling", remarks: "Bajaj trade-in appliances - compressor and motor recovery" },
  { id: "EWR-0006", manifest: "MNF-KSB/2025/2345", facility: "Karo Sambhav Delhi NCR", state: "Delhi NCR", category: "PCB Boards", item: "Bare PCB Scrap Mixed Grade-A", weight: 95, unit: "kg", generator: "Dell Manufacturing Chennai (ex-Delhi)", origin: "Dell R&D Center Noida", destination: "Karo Sambhav Gurugram", mode: "Courier Pickup", collectDate: "2025-07-12", receiveDate: "", transitDays: 1, recoverableValueLakhs: 12, hazmatFlag: false, status: "Collected", remarks: "Dell R&D PCB scrap - high copper content Grade-A recovery" },
  { id: "EWR-0007", manifest: "MNF-TVR/2025/6789", facility: "Terra Virtue Pune", state: "Maharashtra", category: "Networking Equipment", item: "EOL Switches/Routers Enterprise Grade", weight: 280, unit: "kg", generator: "TCS Data Center Pune", origin: "TCS Hinjewadi DC", destination: "Terra Virtue Chakan", mode: "Closed Van Truck", collectDate: "2025-07-06", receiveDate: "2025-07-07", transitDays: 1, recoverableValueLakhs: 16, hazmatFlag: false, status: "Received at Facility", remarks: "TCS data center network refresh - Cisco/Juniper EOL equipment" },
  { id: "EWR-0008", manifest: "MNF-NEA/2025/8901", facility: "Namo E-Waste Gujarat", state: "Uttar Pradesh", category: "EV Battery Packs", item: "Tata Nexon EV Battery Pack EOL", weight: 280, unit: "kg", generator: "Tata Motors Service Ahmedabad", origin: "Tata EV Service Center", destination: "Namo E-Waste Ahmedabad", mode: "Specialized Hazmat", collectDate: "2025-07-05", receiveDate: "", transitDays: 1, recoverableValueLakhs: 35, hazmatFlag: true, status: "Quality Analysis", remarks: "Tata Nexon 30kWh pack - cobalt/lithium recovery analysis pending, fire safety quarantine" },
  { id: "EWR-0009", manifest: "MNF-ATT/2025/3456", facility: "Attero Roorkee Plant", state: "Uttar Pradesh", category: "Desktop/Laptop", item: "Mixed Desktop Towers Corporate Bulk", weight: 720, unit: "kg", generator: "Wipro Noida Campus", origin: "Wipro Sector-62 Noida", destination: "Attero Roorkee Main Gate", mode: "Closed Van Truck", collectDate: "2025-07-11", receiveDate: "", transitDays: 2, recoverableValueLakhs: 28, hazmatFlag: false, status: "In Transit", remarks: "Wipro corporate desktop refresh bulk lot - HDD/RAM recovery" },
  { id: "EWR-0010", manifest: "MNF-EPR/2025/4567", facility: "E-Parisaraa Bengaluru", state: "Karnataka", category: "Mobile Phones", item: "Apple iPhone EOL Collection Lot-B", weight: 65, unit: "kg", generator: "Apple Authorized Reseller BLR", origin: "Apple Collection Point UB City", destination: "E-Parisaraa Chandapura Plant", mode: "Courier Pickup", collectDate: "2025-07-10", receiveDate: "2025-07-10", transitDays: 0, recoverableValueLakhs: 15, hazmatFlag: false, status: "Recycled / Recovered", remarks: "Apple iPhone EOL - gold/copper/palladium recovery completed" },
  { id: "EWR-0011", manifest: "MNF-CBG/2025/7890", facility: "Cerebra Green Chennai", state: "Tamil Nadu", category: "Home Appliances", item: "Split AC Compressor Scrap Mixed", weight: 550, unit: "kg", generator: "Voltas Trade-In Chennai", origin: "Voltas Collection Yard Guindy", destination: "Cerebra Green Oragadam", mode: "Open Flatbed", collectDate: "2025-07-09", receiveDate: "2025-07-10", transitDays: 1, recoverableValueLakhs: 8, hazmatFlag: false, status: "Received at Facility", remarks: "Voltas split AC compressor scrap - copper/aluminum recovery" },
  { id: "EWR-0012", manifest: "MNF-ESV/2025/1234", facility: "Enviro Serv Hyderabad", state: "Telangana", category: "Batteries (Li-ion)", item: "Power Bank Li-ion Cells Mixed 10000mAh", weight: 180, unit: "kg", generator: "Amazon India FTL Hyd Returns", origin: "Amazon FTL Warehouse Gachibowli", destination: "Enviro Serv Patancheru", mode: "Closed Van Truck", collectDate: "2025-07-12", receiveDate: "", transitDays: 1, recoverableValueLakhs: 6, hazmatFlag: true, status: "In Transit", remarks: "Amazon customer return power banks - Class-9 hazmat battery cells" },
  { id: "EWR-0013", manifest: "MNF-GVX/2025/5678", facility: "Green Vortex Mumbai", state: "Maharashtra", category: "CRT/LCD Monitors", item: "LED/LCD Panel 24/27 inch Mixed Lot", weight: 340, unit: "kg", generator: "Reliance Retail Trade-In Mumbai", origin: "Reliance Digital Juhu", destination: "Green Vortex Navi Mumbai", mode: "Closed Van Truck", collectDate: "2025-07-08", receiveDate: "", transitDays: 1, recoverableValueLakhs: 10, hazmatFlag: false, status: "Quality Analysis", remarks: "Reliance Digital LED panel returns - LCD panel liquid crystal recovery assessment" },
  { id: "EWR-0014", manifest: "MNF-KSB/2025/9012", facility: "Karo Sambhav Delhi NCR", state: "Delhi NCR", category: "Desktop/Laptop", item: "Server Racks EOL 42U Mixed", weight: 1500, unit: "kg", generator: "NIIT Data Center Noida", origin: "NIIT Sector-125 DC", destination: "Karo Sambhav Gurugram", mode: "Specialized Hazmat", collectDate: "2025-07-07", receiveDate: "2025-07-08", transitDays: 1, recoverableValueLakhs: 45, hazmatFlag: true, status: "Under Dismantling", remarks: "NIIT server rack EOL - heavy metals, fiber optic, PSU recovery under controlled zone" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Collected").length;
const analysisCount = records.filter(r => r.status === "Quality Analysis" || r.status === "Under Dismantling").length;
const recoveredCount = records.filter(r => r.status === "Recycled / Recovered").length;
const totalValue = records.reduce((s, r) => s + r.recoverableValueLakhs, 0);

const kpis = [
  { l: "In Transit / Collected", v: transitCount, s: "active shipments" },
  { l: "Analysis / Dismantling", v: analysisCount, s: "in processing" },
  { l: "Recycled / Recovered", v: recoveredCount, s: "completed" },
  { l: "Total Recoverable Value", v: `\u20b9${totalValue}L`, s: "across all facilities" },
];

const INSIGHTS = [
  {
    t: "India E-Waste Crisis: 52 Lakh MT Annual Generation, 3.2% Formal Recycling Rate, \u20b91.3 Lakh Crore Circular Economy",
    c: "India is the world\u2019s third-largest e-waste generator (52 lakh metric tonnes per year, 2024-25 estimate) after China and the United States, with e-waste growing at 15-18% CAGR (3x faster than global average of 5%). India\u2019s E-Waste Management Rules 2022 (GSR 317(E)) mandate Extended Producer Responsibility (EPR) for 87 categories of electrical and electronic equipment (EEE) covering: (1) Consumer electronics (mobile phones, laptops, TVs \u2014 45% of e-waste by weight), (2) IT/telecom equipment (servers, routers, switches \u2014 20%), (3) Industrial electronics (PLCs, drives, control systems \u2014 15%), (4) Lighting (LED/CFL \u2014 10%), and (5) Batteries (Li-ion, lead-acid \u2014 10%). India\u2019s formal e-waste recycling capacity is approximately 8 lakh MT per year (3.2% of generation), with the remaining 96.8% processed by the informal sector (kabadiwalas, backyard smelters, acid stripping units). The Central Pollution Control Board (CPCB) has authorized 450+ e-waste recyclers/dismantlers under E-Waste Management Rules, with key players: (1) Attero Recycling (Roorkee, 50,000 MT capacity, India\u2019s largest integrated recycler), (2) E-Parisaraa (Bengaluru, 20,000 MT, first authorized recycler in India), (3) Cerebra Integrated (Chennai, 15,000 MT, battery specialist), (4) Green Vortex (Mumbai, 10,000 MT), (5) Enviro Serv (Hyderabad, 8,000 MT), (6) Karo Sambhav (Delhi NCR, 5,000 MT), (7) Terra Virtue (Pune, 5,000 MT), and (8) Namo E-Waste (Gujarat, 5,000 MT). India\u2019s e-waste recycling market is valued at approximately \u20b91.3 lakh crore annually, including recovered metals (\u20b980,000 crore), recovered plastics (\u20b915,000 crore), recovered glass (\u20b98,000 crore), and refurbished/resale (\u20b925,000 crore). Key recovered materials: gold (2-3 grams per ton of PCB scrap), copper (10-15% by weight), aluminum (5-8%), rare earth elements (neodymium, dysprosium from magnets), palladium (from PCB connectors), and lithium/cobalt (from battery packs).",
  },
  {
    t: "E-Waste Collection Logistics: Reverse Supply Chain, EPR Compliance, and Producers\u2019 Role",
    c: "India\u2019s e-waste reverse supply chain operates through: (1) Producer-led collection: 250+ PROs (Producer Responsibility Organizations) authorized by CPCB, managing collection for brands including Samsung (15% market share), Xiaomi (12%), Realme (10%), Apple (8%), OnePlus (6%), Vivo (6%), Oppo (5%), and others. EPR targets under 2022 Rules: FY 2024-25 requires 70% collection of historical e-waste, rising to 100% by FY 2026-27. (2) Consumer drop-off: 50,000+ collection points at retail stores, mobile repair shops, and municipal e-waste bins. Major OEM collection networks: Samsung (1,200 collection points), Apple (300+ stores + trade-in), Dell (150+ centers), HP (120+ centers), and Amazon India (50+ FTL collection points). (3) Corporate/bulk collection: IT asset disposition (ITAD) from BFSI (banks, financial institutions), IT/ITeS (TCS, Infosys, Wipro generate 20,000+ MT annually), government offices (central + state: 15,000+ MT), and hospitals/healthcare (8,000+ MT of medical electronics). (4) Bulk consumer: appliance trade-in programs (Bajaj, Voltas, LG, Samsung) covering 10,000+ MT annually. E-waste logistics challenges: (a) Hazardous material handling: lead, mercury, cadmium, hexavalent chromium, brominated flame retardants (BFRs) requiring trained handlers and Class-9 dangerous goods transport compliance, (b) Collection cost: urban \u20b915-25/kg, semi-urban \u20b925-40/kg, rural \u20b950-80/kg, (c) Data security: corporate e-waste requires degaussing/NIST 800-88 data destruction certification before processing, (d) Fragmentation: 90% of e-waste flows through informal sector where material recovery rates are 30-50% vs formal sector 85-95%, and (e) Seasonal variation: 30-40% volume spike during Diwali/New Year replacement cycles. E-waste manifest tracking is mandated under CPCB Form-1 (collection) and Form-2 (processing), with electronic manifest via CPCB E-Waste portal for real-time tracking.",
  },
  {
    t: "E-Waste Recycling Processes: Dismantling, Shredding, Pyrometallurgy, Hydrometallurgy",
    c: "India\u2019s formal e-waste recycling follows a multi-stage process: (1) Collection and sorting at facility (manual sorting by category, removal of batteries and hazardous components, PCB extraction), (2) Dismantling (manual: 15-20 workers per line, disassembly of devices into components \u2014 screens, casings, PCBs, cables, speakers, motors, compressors), (3) Size reduction (shredding: industrial hammer mills, 2-stage shredding to 10mm particles), (4) Material recovery: (a) Pyrometallurgy: smelting at 1200\u00b0C in electric arc furnaces for copper/gold/palladium recovery from PCB scrap, (b) Hydrometallurgy: acid leaching (aqua regia, nitric acid) for precious metal extraction from shredded PCB powder, (c) Mechanical separation: eddy current separators for aluminum, magnetic separators for steel, air classifiers for plastics, density separators for copper from aluminum. India\u2019s formal recycling recovery rates: (a) Precious metals: gold 95%+, silver 92%+, palladium 90%+ (from PCB scrap), (b) Non-ferrous metals: copper 90%+, aluminum 88%+, (c) Plastics: 70-80% (sorted by polymer type: ABS, HIPS, PC/ABS), (d) Glass: 85%+ (CRT panel glass, LCD glass), (e) Battery materials: lithium 85%+, cobalt 88%+, nickel 82%+ (from EV battery packs via hydrometallurgical process). India\u2019s e-waste recycling technology is evolving: (1) Attero\u2019s integrated facility: India\u2019s first automated e-waste recycling line with robotic PCB extraction, automated shredding, and zero-liquid-discharge (ZLD) hydrometallurgy, (2) E-Parisaraa\u2019s CRT glass-to-glass recycling: converting CRT leaded glass into new CRT glass or lead silicate for construction, (3) Cerebra Green\u2019s battery recycling: lithium extraction from NMC/LFP cells via sulfate-based leaching process, (4) Green Vortex\u2019s LCD panel recycling: indium tin oxide (ITO) recovery from LCD screens (indium: \u20b915,000/kg, 99.9% recovery). Environmental compliance: CPCB-mandated emission monitoring (dioxins, furans from PCB incineration), effluent treatment plants (ETP with ZLD), and occupational health surveillance (blood lead levels, mercury exposure monitoring for workers).",
  },
  {
    t: "Circular Economy and Future: Urban Mining, Refurbishment, Battery Second Life, and Policy",
    c: "India\u2019s e-waste circular economy is projected to reach \u20b93.5 lakh crore by 2030, driven by: (1) Urban mining: extracting metals from e-waste is 10-50x more concentrated than natural ore mining (1 ton of mobile phone PCBs contains 150g gold vs 1-2g/ton in gold ore), with India\u2019s urban mining potential valued at \u20b920,000 crore in gold and \u20b915,000 crore in copper annually from e-waste alone, (2) Refurbished electronics market: \u20b945,000 crore (2025), led by companies like Xtracover, Cashify, Budli, and Overcart, with 60 lakh refurbished smartphones and 30 lakh refurbished laptops sold annually, (3) Battery second life: EV battery repurposing for energy storage (BESS) after 70-80% State of Health (SoH) threshold, with India\u2019s second-life battery market projected at \u20b95,000 crore by 2028, (4) CRT panel glass recycling: converting 5 lakh MT of CRT leaded glass annually into radiation shielding panels for medical X-ray rooms and lead silicate for construction, (5) Plastic-to-fuel: converting e-waste ABS/HIPS plastic into pyrolysis oil (300-400 liters per MT), and (6) Precious metal recovery: India currently imports \u20b91.8 lakh crore of gold, while e-waste contains recoverable gold worth \u20b918,000 crore annually. Policy developments: (a) E-Waste Management Rules 2022 with stricter EPR targets and carbon credit incentives for recyclers, (b) Battery Waste Management Rules 2022 covering EV batteries with collection targets and recycling efficiency standards, (c) Right to Repair framework (proposed) to enable easier component-level repair and extend product life, (d) Digital India e-waste tracking: QR code-based tracking from producer to recycler, and (e) Extended liability for producers: financial penalties up to \u20b95 crore for non-compliance. India\u2019s e-waste recycling sector faces key challenges: (1) Informal sector competition (96.8% of e-waste, lower operating costs due to non-compliance with safety/environment norms), (2) Low consumer awareness (only 25% of Indian consumers are aware of proper e-waste disposal), (3) Infrastructure gaps (only 450 authorized recyclers for 52 lakh MT annual generation), (4) Technology dependence on imported recycling equipment (85% from China/Europe), and (5) Skilled workforce shortage (estimated 2 lakh trained technicians needed vs 40,000 available).",
  },
];

export default function EWasteRecyclingLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: COLLECTION_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "state", label: "State", options: STATES.map(s => ({ value: s, count: records.filter(rec => rec.state === s).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.manifest.toLowerCase().includes(q) && !r.facility.toLowerCase().includes(q) && !r.item.toLowerCase().includes(q) && !r.generator.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof CollectionRecord] as string));
  });

  return (
    <div className="ewr-root p-6 space-y-6">
      <PageHeader title="E-Waste Recycling Logistics" description="India e-waste reverse supply chain covering 52 lakh MT annual generation, CPCB authorized recyclers, PRO collection networks, EPR compliance manifest tracking, precious metal urban mining, battery recycling, and circular economy operations across 450+ facilities" />
      <div className="ewr-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`ewr-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-emerald-700 text-white" : "text-gray-600 hover:bg-emerald-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="ewr-dash space-y-6">
          <div className="ewr-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="ewr-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 ewr-kpi-label">{k.l}</div><div className="text-2xl font-bold text-emerald-700 ewr-kpi-val">{k.v}</div><div className="text-xs text-gray-400 ewr-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ewr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly E-Waste Collection (kg)</h3><BarChart data={monthlyCollection} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="mobile" fill="#059669" radius={[4,4,0,0]} name="Mobile Phones" /><Bar dataKey="laptop" fill="#10b981" radius={[4,4,0,0]} name="Laptop/Desktop" /><Bar dataKey="monitor" fill="#34d399" radius={[4,4,0,0]} name="Monitors" /><Bar dataKey="battery" fill="#6ee7b7" radius={[4,4,0,0]} name="Batteries" /></BarChart></div>
            <div className="ewr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">E-Waste Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ewr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Material Recovery Rate (%) vs 90% Target</h3><LineChart data={recoveryTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[80, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="ewr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Facility Performance Score</h3><BarChart data={facilityPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[75, 100]} /><Tooltip /><Bar dataKey="v" fill="#10b981" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="ewr-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "E-Waste Recycling", href: "#" }, { label: "Collection Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="ewr-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Manifest,Facility,State,Category,Item,Weight (kg),Generator,Mode,Collect,Receive,Transit (d),Value (\u20b9L),Hazmat,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Quality Analysis" ? "ewr-row-critical bg-red-50" : r.status === "Under Dismantling" || r.status === "Collected" ? "ewr-row-warning bg-amber-50" : r.status === "In Transit" ? "ewr-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-emerald-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="ewr-badge inline-block px-2 py-0.5 rounded text-xs bg-emerald-700 text-white font-mono">{r.manifest}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.facility}</td>
                <td className="px-3 py-2"><span className="ewr-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.state}</span></td>
                <td className="px-3 py-2"><span className="ewr-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.item}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.weight}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.generator}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.collectDate}</td>
                <td className="px-3 py-2 text-xs">{r.receiveDate || <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 2 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-emerald-700">{r.recoverableValueLakhs}</td>
                <td className="px-3 py-2 text-center">{r.hazmatFlag ? <span className="ewr-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">HAZ</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`ewr-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="ewr-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="ewr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Collection Volume by State</h3><BarChart data={STATES.map(s => ({ n: s.split(" ")[0], v: +ri(20, 60, 38 + Math.random() * 15).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#059669" radius={[4,4,0,0]} name="Manifests" /></BarChart></div>
            <div className="ewr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Collection by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], mobile: ri(60, 120, 85 + Math.sin(i*0.5)*15), laptop: ri(30, 65, 45 + Math.cos(i*0.6)*10), battery: ri(15, 40, 25 + Math.sin(i*0.7)*8) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="mobile" stackId="1" stroke="#059669" fill="#d1fae5" name="Mobile" /><Area type="monotone" dataKey="laptop" stackId="1" stroke="#10b981" fill="#a7f3d0" name="Laptop" /><Area type="monotone" dataKey="battery" stackId="1" stroke="#34d399" fill="#ecfdf5" name="Battery" /></AreaChart></div>
          </div>
          <div className="ewr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Transport Mode</h3><BarChart data={[{n:"Closed Van",v:1.5},{n:"Open Flatbed",v:1.2},{n:"Temp Ctrl",v:1.8},{n:"Hazmat",v:2},{n:"Rail",v:3},{n:"Courier",v:0.8}].map(d => ({...d, v: +ri(d.v-0.2, d.v+0.4, d.v + Math.random()*0.2).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#10b981" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="ewr-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="ewr-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-emerald-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
