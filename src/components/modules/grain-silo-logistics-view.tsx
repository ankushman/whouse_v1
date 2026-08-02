"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#b45309", "#d97706", "#f59e0b", "#fbbf24", "#92400e", "#78350f", "#fcd34d", "#fde68a"];
const SILOS = ["FCI Kandla Mega Silo", "FCI Chennai Silo", "FCI Kolkata Silo", "FCI Navi Mumbai Silo", "FCI Indore Silo", "FCI Raipur Silo", "FCI Lucknow Silo", "FCI Guwahati Silo"];
const COMMODITIES = ["Wheat", "Rice (PDS)", "Pulses (Tur)", "Coarse Grains", "Maize", "Barley", "Jowar", "Bajra"];
const STOCK_STATUSES = ["Adequate Stock", "Below Norm", "Critical Stock", "Under QC Hold", "Movement in Transit", "Procurement Pending"];
const STATES = ["Gujarat", "Tamil Nadu", "West Bengal", "Maharashtra", "Madhya Pradesh", "Chhattisgarh", "Uttar Pradesh", "Assam"];
const MODES = ["Rail Rake", "Bulk Truck", "Conveyor Belt", "Inland Waterway", "Multi-Axle Trailer", "Port Feeder Vessel"];
const TABS = ["Dashboard", "Stock Registry", "Silo Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Adequate Stock": "green", "Below Norm": "amber", "Critical Stock": "red", "Under QC Hold": "orange", "Movement in Transit": "blue", "Procurement Pending": "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyProcurement = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], wheat: ri(4200, 7800, 5800 + Math.sin(i * 0.5) * 1200), rice: ri(3200, 5500, 4200 + Math.cos(i * 0.6) * 800), pulses: ri(400, 900, 620 + Math.sin(i * 0.7) * 180), coarse: ri(600, 1200, 850 + Math.cos(i * 0.8) * 200) }));
const commodityDist = [{ n: "Wheat", v: 32 }, { n: "Rice (PDS)", v: 28 }, { n: "Pulses (Tur)", v: 12 }, { n: "Coarse Grains", v: 10 }, { n: "Maize", v: 8 }, { n: "Barley", v: 4 }, { n: "Jowar", v: 4 }, { n: "Bajra", v: 2 }];
const utilizationTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(68, 96, 82 + Math.sin(i * 0.4) * 10)).toFixed(1), target: 80.0 }));
const siloPerf = SILOS.slice(0, 6).map(s => ({ n: s.replace("FCI ", "").split(" ")[0], v: +ri(72, 98, 85 + Math.random() * 10).toFixed(0) }));

interface StockRecord { id: string; allotmentNo: string; silo: string; commodity: string; variety: string; quantity: number; unit: string; bufferNorm: number; currentStock: number; fillPct: number; state: string; mspRate: number; procurementDate: string; expiryDate: string; moisture: number; status: string; transportMode: string; lastInspection: string; fumigationDate: string; remarks: string; }

const records: StockRecord[] = [
  { id: "GSL-0001", allotmentNo: "FCI-KDL/2025-1245", silo: "FCI Kandla Mega Silo", commodity: "Wheat", variety: "HD-3226 Sharbati", quantity: 25000, unit: "MT", bufferNorm: 20000, currentStock: 28500, fillPct: 93, state: "Gujarat", mspRate: 2275, procurementDate: "2025-03-15", expiryDate: "2026-03-15", moisture: 11.2, status: "Adequate Stock", transportMode: "Port Feeder Vessel", lastInspection: "2025-06-20", fumigationDate: "2025-05-10", remarks: "Kandla mega silo 50K MT capacity - wheat buffer stock for western India" },
  { id: "GSL-0002", allotmentNo: "FCI-CHN/2025-0834", silo: "FCI Chennai Silo", commodity: "Rice (PDS)", variety: "Sona Masuri PDS", quantity: 18000, unit: "MT", bufferNorm: 22000, currentStock: 15800, fillPct: 65, state: "Tamil Nadu", mspRate: 2320, procurementDate: "2025-02-28", expiryDate: "2026-02-28", moisture: 12.8, status: "Below Norm", transportMode: "Inland Waterway", lastInspection: "2025-06-15", fumigationDate: "2025-04-22", remarks: "Chennai silo rice stock below buffer norm - fresh procurement pending from AP" },
  { id: "GSL-0003", allotmentNo: "FCI-KOL/2025-1567", silo: "FCI Kolkata Silo", commodity: "Pulses (Tur)", variety: "Tur (Arhar) PDS", quantity: 5000, unit: "MT", bufferNorm: 8000, currentStock: 3200, fillPct: 38, state: "West Bengal", mspRate: 7550, procurementDate: "2025-01-20", expiryDate: "2026-01-20", moisture: 10.5, status: "Critical Stock", transportMode: "Rail Rake", lastInspection: "2025-06-25", fumigationDate: "2025-05-30", remarks: "Kolkata tur dal critically low - emergency procurement from Maharashtra" },
  { id: "GSL-0004", allotmentNo: "FCI-NVM/2025-0923", silo: "FCI Navi Mumbai Silo", commodity: "Wheat", variety: "Lok-1 HD-3086", quantity: 22000, unit: "MT", bufferNorm: 18000, currentStock: 24500, fillPct: 88, state: "Maharashtra", mspRate: 2275, procurementDate: "2025-04-05", expiryDate: "2026-04-05", moisture: 11.8, status: "Adequate Stock", transportMode: "Bulk Truck", lastInspection: "2025-06-18", fumigationDate: "2025-05-15", remarks: "Navi Mumbai silo adequate - supplementary stock for Mumbai PDS network" },
  { id: "GSL-0005", allotmentNo: "FCI-IND/2025-0412", silo: "FCI Indore Silo", commodity: "Wheat", variety: "HI-8758 Malwa", quantity: 15000, unit: "MT", bufferNorm: 16000, currentStock: 13200, fillPct: 72, state: "Madhya Pradesh", mspRate: 2275, procurementDate: "2025-03-20", expiryDate: "2026-03-20", moisture: 13.2, status: "Below Norm", transportMode: "Conveyor Belt", lastInspection: "2025-06-22", fumigationDate: "2025-04-28", remarks: "Indore silo moisture elevated - quality hold pending lab retest" },
  { id: "GSL-0006", allotmentNo: "FCI-RPR/2025-0756", silo: "FCI Raipur Silo", commodity: "Rice (PDS)", variety: "Chhattisgari PDS", quantity: 12000, unit: "MT", bufferNorm: 10000, currentStock: 11800, fillPct: 85, state: "Chhattisgarh", mspRate: 2320, procurementDate: "2025-04-12", expiryDate: "2026-04-12", moisture: 12.1, status: "Adequate Stock", transportMode: "Multi-Axle Trailer", lastInspection: "2025-06-28", fumigationDate: "2025-06-01", remarks: "Raipur silo healthy stock - rice procurement from Dhamtari belt" },
  { id: "GSL-0007", allotmentNo: "FCI-LKO/2025-1189", silo: "FCI Lucknow Silo", commodity: "Wheat", variety: "PBW-343 Karna", quantity: 28000, unit: "MT", bufferNorm: 25000, currentStock: 30200, fillPct: 96, state: "Uttar Pradesh", mspRate: 2275, procurementDate: "2025-03-28", expiryDate: "2026-03-28", moisture: 10.8, status: "Adequate Stock", transportMode: "Rail Rake", lastInspection: "2025-07-01", fumigationDate: "2025-05-20", remarks: "Lucknow mega silo at near-full capacity - rabi harvest bumper procurement" },
  { id: "GSL-0008", allotmentNo: "FCI-GHY/2025-0345", silo: "FCI Guwahati Silo", commodity: "Rice (PDS)", variety: "Joha Rice PDS", quantity: 8000, unit: "MT", bufferNorm: 12000, currentStock: 5600, fillPct: 42, state: "Assam", mspRate: 2320, procurementDate: "2025-02-15", expiryDate: "2026-02-15", moisture: 14.1, status: "Critical Stock", transportMode: "Inland Waterway", lastInspection: "2025-06-30", fumigationDate: "2025-05-05", remarks: "Guwahati silo critically low - Brahmaputra flooding disrupted supply chain" },
  { id: "GSL-0009", allotmentNo: "FCI-KDL/2025-1478", silo: "FCI Kandla Mega Silo", commodity: "Maize", variety: "Hybrid Maize Feed", quantity: 6000, unit: "MT", bufferNorm: 5000, currentStock: 7200, fillPct: 78, state: "Gujarat", mspRate: 2090, procurementDate: "2025-04-20", expiryDate: "2026-04-20", moisture: 11.5, status: "Adequate Stock", transportMode: "Bulk Truck", lastInspection: "2025-06-25", fumigationDate: "2025-05-28", remarks: "Kandla maize feed stock for poultry corridor Gujarat-Rajasthan" },
  { id: "GSL-0010", allotmentNo: "FCI-CHN/2025-1601", silo: "FCI Chennai Silo", commodity: "Coarse Grains", variety: "Ragi PDS Grade", quantity: 3500, unit: "MT", bufferNorm: 4000, currentStock: 2800, fillPct: 55, state: "Tamil Nadu", mspRate: 3627, procurementDate: "2025-03-10", expiryDate: "2026-03-10", moisture: 12.4, status: "Below Norm", transportMode: "Rail Rake", lastInspection: "2025-06-20", fumigationDate: "2025-04-15", remarks: "Chennai ragi stock below norm - procurement from Karnataka delayed" },
  { id: "GSL-0011", allotmentNo: "FCI-KOL/2025-1890", silo: "FCI Kolkata Silo", commodity: "Wheat", variety: "DBW-187 Haryana", quantity: 20000, unit: "MT", bufferNorm: 18000, currentStock: 19500, fillPct: 82, state: "West Bengal", mspRate: 2275, procurementDate: "2025-04-08", expiryDate: "2026-04-08", moisture: 10.9, status: "Movement in Transit", transportMode: "Rail Rake", lastInspection: "2025-07-02", fumigationDate: "2025-06-05", remarks: "Kolkata wheat transit from Punjab via Howrah - rake expected Jul 5" },
  { id: "GSL-0012", allotmentNo: "FCI-IND/2025-0823", silo: "FCI Indore Silo", commodity: "Pulses (Tur)", variety: "Tur Kanpur Grade", quantity: 4000, unit: "MT", bufferNorm: 5000, currentStock: 2200, fillPct: 35, state: "Madhya Pradesh", mspRate: 7550, procurementDate: "2025-02-20", expiryDate: "2026-02-20", moisture: 10.2, status: "Under QC Hold", transportMode: "Multi-Axle Trailer", lastInspection: "2025-06-28", fumigationDate: "2025-05-18", remarks: "Indore tur dal - QC hold due to weevil infestation detected in bin 3" },
  { id: "GSL-0013", allotmentNo: "FCI-LKO/2025-1567", silo: "FCI Lucknow Silo", commodity: "Rice (PDS)", variety: "Basmati PDS Blend", quantity: 14000, unit: "MT", bufferNorm: 15000, currentStock: 12800, fillPct: 76, state: "Uttar Pradesh", mspRate: 2320, procurementDate: "2025-04-01", expiryDate: "2026-04-01", moisture: 11.6, status: "Procurement Pending", transportMode: "Rail Rake", lastInspection: "2025-06-22", fumigationDate: "2025-05-25", remarks: "Lucknow rice - kharif procurement pending from UP eastern districts" },
  { id: "GSL-0014", allotmentNo: "FCI-RPR/2025-1234", silo: "FCI Raipur Silo", commodity: "Wheat", variety: "HD-2967 Delhi", quantity: 10000, unit: "MT", bufferNorm: 8000, currentStock: 8500, fillPct: 70, state: "Chhattisgarh", mspRate: 2275, procurementDate: "2025-03-25", expiryDate: "2026-03-25", moisture: 12.5, status: "Movement in Transit", transportMode: "Conveyor Belt", lastInspection: "2025-06-30", fumigationDate: "2025-06-10", remarks: "Raipur wheat movement to Jagdalpur depot - Bastar tribal PDS supply" },
];

const adequateCount = records.filter(r => r.status === "Adequate Stock").length;
const criticalCount = records.filter(r => r.status === "Critical Stock" || r.status === "Under QC Hold").length;
const transitCount = records.filter(r => r.status === "Movement in Transit").length;
const totalStock = records.reduce((s, r) => s + r.currentStock, 0);

function fmtQty(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K MT`;
  return `${n} MT`;
}

const kpis = [
  { l: "Adequate Stock", v: adequateCount, s: "silos above buffer norm" },
  { l: "Critical / QC Hold", v: criticalCount, s: "immediate attention needed" },
  { l: "In Transit", v: transitCount, s: "active movements" },
  { l: "Total Stock Held", v: fmtQty(totalStock), s: "across all FCI silos" },
];

const INSIGHTS = [
  {
    t: "India Food Corporation: 750 LMT Buffer Stock and \u20b94.5 Lakh Crore Food Subsidy",
    c: "The Food Corporation of India (FCI) manages the world\u2019s largest public food distribution system, procuring 750-800 lakh metric tonnes (LMT) of food grains annually through Minimum Support Price (MSP) operations covering wheat (\u20b92,275/quintal), rice (\u20b92,320/quintal), and pulses (\u20b97,550/quintal for tur). FCI operates 1,900+ storage depots including 37 modern bulk silos with a total storage capacity of 800+ LMT. India\u2019s food subsidy budget is approximately \u20b94.5 lakh crore (USD 54 billion), making it the world\u2019s largest food security program covering 800+ million beneficiaries under the National Food Security Act (NFSA) 2013, which provides 5 kg of food grains per person per month at highly subsidized rates: wheat at \u20b92/kg and rice at \u20b93/kg through 500,000+ Fair Price Shops. FCI\u2019s procurement operations span: (1) Rabi season (April-June): wheat from Punjab (210 LMT), Haryana (120 LMT), UP (100 LMT), MP (80 LMT), and Rajasthan (40 LMT), (2) Kharif season (October-December): rice from Andhra Pradesh (140 LMT), Telangana (80 LMT), Punjab (130 LMT), Chhattisgarh (100 LMT), Odisha (70 LMT), and (3) Pulses procurement under PM-AASHA scheme from Maharashtra, Karnataka, and MP (25 LMT). India\u2019s food grain logistics involves moving 600+ LMT annually via rail (55%), road (35%), and waterway (10%), with approximately 2,500 rail rakes and 150,000 truck movements per month during peak procurement season. The PM Garib Kalyan Ann Yojana (PM-GKAY) provides free food grains to 800 million people, with FCI distributing approximately 50 LMT per month through state governments and UT administrations. The government has allocated \u20b91,600 crore under PM PRANAM for modernizing FCI storage infrastructure with 700 new silos by 2027.",
  },
  {
    t: "Modern Silo Infrastructure: Bulk Handling, Aeration, and Fumigation Technology",
    c: "India\u2019s grain storage modernization is centered on FCI\u2019s bulk silo project covering 37 operational silos with 25+ MT capacity each, using German (Siemens/Buhler) and Indian (Agropack/Sethi) technology for automated bulk handling. Key silo locations include: (1) Kandla Mega Silo (50 MT, Gujarat), (2) Chennai Silo (25 MT, Tamil Nadu), (3) Kolkata Silo (25 MT, West Bengal), (4) Navi Mumbai Silo (25 MT, Maharashtra), (5) Indore Silo (25 MT, MP), and (6) Lucknow Mega Silo (50 MT, UP). Modern silo features include: (1) Automated conveying systems with bucket elevators and belt conveyors (500-1,000 MT/hour), (2) Temperature monitoring with 200+ sensors per silo for early spoilage detection, (3) Aeration systems for moisture control and grain cooling (maintaining 10-12% moisture and below 25\u00b0C), (4) Fumigation chambers for pest control (aluminum phosphide and methyl bromide treatment), (5) Automated level sensors for real-time fill percentage tracking, and (6) Dust extraction systems for worker safety and grain quality. India\u2019s covered and plinth (CAP) storage still covers 60% of FCI\u2019s total storage, while modern silos handle 25% and conventional warehouses cover 15%. The CAP to silo conversion program targets 100% modern storage by 2030. Storage losses in modern silos are 0.5-1.0% (versus 4-5% in CAP storage), saving approximately \u20b95,000 crore annually in food grain preservation. The Silo India project (Adani Agri Logistics) operates 20 silo complexes with rail-connected bulk handling, reducing turnaround time from 72 hours to 8 hours per rake. The government\u2019s Agricultural Infrastructure Fund (AIF) has sanctioned \u20b91,600 crore for warehouse and silo development, targeting 700 new silos by 2027 with an additional 200 LMT storage capacity.",
  },
  {
    t: "PDS Distribution Network: 500,000 Fair Price Shops and NFSA Logistics",
    c: "India\u2019s Public Distribution System (PDS) operates through 500,000+ Fair Price Shops (FPS) managed by state governments, cooperatives, and authorized dealers, distributing approximately 50 LMT of food grains monthly to 800 million beneficiaries. The PDS supply chain involves: (1) FCI godown/silo to district depot via rail rake or truck convoy (100-500 MT per trip, transit time 24-72 hours), (2) District depot to block-level FPS via secondary transport (5-50 MT per trip, transit time 4-24 hours), (3) FPS to beneficiary distribution (5 kg per person per month, biometric Aadhaar authentication). State-wise PDS logistics performance varies significantly: (1) Tamil Nadu (universal PDS, 36,000 FPS, 4 LMT/month distribution, 98% offtake), (2) Andhra Pradesh (31,000 FPS, 3.2 LMT/month), (3) Uttar Pradesh (80,000 FPS, 7.5 LMT/month, largest state), (4) Bihar (35,000 FPS, 3 LMT/month, improving after e-PDS rollout), and (5) Rajasthan (33,000 FPS, 2.8 LMT/month, Annapurna scheme). The government has implemented: (1) One Nation One Ration Card (ONORC) enabling portability across 36 states/UTs with 50+ million portable transactions monthly, (2) e-PDS with Aadhaar-based biometric authentication at FPS, (3) End-to-end computerization covering FCI, state warehousing, and FPS, and (4) Automated Supply Chain Management (ASCM) with GPS-tracked vehicles and SMS alerts. Key challenges include: (1) Leakages estimated at 15-20% (reduced from 40% a decade ago), (2) Last-mile connectivity to tribal and remote areas, (3) Diversification to include millets and nutri-cereals under POSHAN Abhiyaan, and (4) Climate-resilient storage in flood-prone and cyclone-affected regions. States with digital PDS report 30% lower leakage, 45% faster grievance resolution, and 25% higher beneficiary satisfaction.",
  },
  {
    t: "Grain Quality Control: FSSAI Standards, Moisture Management, and Pest Prevention",
    c: "India\u2019s grain quality is regulated by the Food Safety and Standards Authority of India (FSSAI) under the Food Safety and Standards (Food Products Standards and Food Additives) Regulations 2011, with specific standards for: (1) Wheat: moisture content below 14%, protein content above 10%, insect damage below 1%, foreign matter below 0.5%, (2) Rice: moisture below 14%, husk content below 1%, damaged grains below 3%, (3) Pulses: moisture below 12%, shriveled grains below 3%, insect-damaged below 1%. FCI\u2019s quality control involves: (1) Pre-procurement testing at mandi level (500+ testing labs across India), (2) Receiving inspection at silo entry (moisture, foreign matter, insect infestation), (3) Periodic monitoring during storage (monthly temperature and moisture checks, quarterly quality surveys), (4) Pre-dispatch testing before PDS allocation (FSSAI compliance verification), and (5) Feedback loop from FPS-level quality complaints. Storage pest management uses: (1) Preventive fumigation (aluminum phosphide, 3 tablets/MT, 7-day exposure), (2) Temperature-controlled aeration to suppress insect activity (below 20\u00b0C), (3) Modified atmosphere storage with nitrogen blanketing for high-value seeds, and (4) Integrated Pest Management (IPM) with pheromone traps and biological control. India\u2019s grain storage losses are estimated at 10-12% post-harvest (4-5% at farm level, 3-4% during storage, 2-3% during transport), costing approximately \u20b91,50,000 crore annually. The government\u2019s Kisan Credit Card (KCC) scheme has been extended to cover post-harvest storage and warehousing, enabling farmers to store produce in accredited warehouses and pledge warehouse receipts for loans, benefiting 75+ million farmer families. The National Initiative on Climate Resilient Agriculture (NICRA) has developed climate-smart storage protocols for flood-prone, cyclone-vulnerable, and drought-affected regions.",
  },
];

export default function GrainSiloLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Stock Status", options: STOCK_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "commodity", label: "Commodity", options: COMMODITIES.map(c => ({ value: c, count: records.filter(r => r.commodity === c).length })) },
    { key: "silo", label: "Silo Location", options: SILOS.map(s => ({ value: s, count: records.filter(r => r.silo === s).length })) },
    { key: "state", label: "State", options: STATES.map(s => ({ value: s, count: records.filter(r => r.state === s).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.allotmentNo.toLowerCase().includes(q) && !r.silo.toLowerCase().includes(q) && !r.commodity.toLowerCase().includes(q) && !r.variety.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof StockRecord] as string));
  });

  return (
    <div className="gsl-root p-6 space-y-6">
      <PageHeader title="Grain Silo Logistics" description="India FCI grain storage operations, MSP procurement buffer stock management, PDS supply chain logistics, silo inventory monitoring, wheat rice pulses coarse grains quality control, and food security distribution network" />
      <div className="gsl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`gsl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-amber-800 text-white" : "text-gray-600 hover:bg-amber-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="gsl-dash space-y-6">
          <div className="gsl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="gsl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 gsl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-amber-800 gsl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 gsl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="gsl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Procurement by Commodity (KT)</h3><BarChart data={monthlyProcurement} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="wheat" fill="#b45309" radius={[4,4,0,0]} name="Wheat" /><Bar dataKey="rice" fill="#d97706" radius={[4,4,0,0]} name="Rice" /><Bar dataKey="pulses" fill="#f59e0b" radius={[4,4,0,0]} name="Pulses" /><Bar dataKey="coarse" fill="#fbbf24" radius={[4,4,0,0]} name="Coarse Grains" /></BarChart></div>
            <div className="gsl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Commodity Distribution</h3><PieChart width={400} height={220}><Pie data={commodityDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{commodityDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="gsl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Silo Capacity Utilization (%) vs 80% Target</h3><LineChart data={utilizationTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[60, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#b45309" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="gsl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Silo Performance Score</h3><BarChart data={siloPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[70, 100]} /><Tooltip /><Bar dataKey="v" fill="#d97706" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="gsl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Grain Silo Logistics", href: "#" }, { label: "Stock Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="gsl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Allotment No,Silo,Commodity,Variety,Stock (MT),Fill %,State,MSP (\u20b9),Procured,Expiry,Moisture %,Status,Mode,Inspection,Fumigation,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Critical Stock" || r.status === "Under QC Hold" ? "gsl-row-critical bg-red-50" : r.status === "Below Norm" ? "gsl-row-warning bg-amber-50" : r.status === "Movement in Transit" ? "gsl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-amber-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="gsl-badge inline-block px-2 py-0.5 rounded text-xs bg-amber-800 text-white font-mono">{r.allotmentNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.silo.replace("FCI ", "")}</td>
                <td className="px-3 py-2"><span className="gsl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.commodity}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.variety}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.currentStock.toLocaleString()}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.fillPct >= 90 ? "text-red-600" : r.fillPct >= 70 ? "text-amber-600" : "text-green-600"}`}>{r.fillPct}%</span></td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.mspRate.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{r.procurementDate}</td>
                <td className="px-3 py-2 text-xs">{r.expiryDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.moisture > 13 ? "text-red-600" : r.moisture > 12 ? "text-amber-600" : "text-green-600"}`}>{r.moisture}%</span></td>
                <td className="px-3 py-2"><span className={`gsl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs">{r.transportMode}</td>
                <td className="px-3 py-2 text-xs">{r.lastInspection}</td>
                <td className="px-3 py-2 text-xs">{r.fumigationDate}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="gsl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="gsl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Stock Volume by Silo</h3><BarChart data={SILOS.slice(0,6).map(s => ({ n: s.replace("FCI ","").split(" ")[0], v: +ri(8, 35, 20 + Math.random() * 12).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#b45309" radius={[4,4,0,0]} name="Stock (KT)" /></BarChart></div>
            <div className="gsl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Procurement by State Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], gujarat: ri(18, 35, 25 + Math.sin(i*0.5)*5), tamilNadu: ri(12, 25, 18 + Math.cos(i*0.6)*4), westBengal: ri(15, 28, 20 + Math.sin(i*0.7)*4) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="gujarat" stackId="1" stroke="#b45309" fill="#fef3c7" name="Gujarat" /><Area type="monotone" dataKey="tamilNadu" stackId="1" stroke="#d97706" fill="#fde68a" name="Tamil Nadu" /><Area type="monotone" dataKey="westBengal" stackId="1" stroke="#f59e0b" fill="#fffbeb" name="West Bengal" /></AreaChart></div>
          </div>
          <div className="gsl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Moisture Content by Commodity (%)</h3><BarChart data={[{n:"Wheat",v:11.2},{n:"Rice",v:12.5},{n:"Pulses",v:10.8},{n:"Coarse",v:11.8},{n:"Maize",v:12.0},{n:"Barley",v:11.5}].map(d => ({...d, v: +ri(d.v-0.8, d.v+1.2, d.v + Math.random()*0.8).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[9, 15]} /><Tooltip /><Bar dataKey="v" fill="#d97706" radius={[4,4,0,0]} name="Moisture %" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="gsl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="gsl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-amber-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
