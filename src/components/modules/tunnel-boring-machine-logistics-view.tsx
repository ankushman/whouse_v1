"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#0f172a", "#6366f1"];

const DEVELOPERS = [
  "Larsen Toubro Mumbai HQ",
  "Afcons Infrastructure Mumbai",
  "Dilip Buildcon Indore MP",
  "JK Infrastructure Delhi",
  "Gulfar Al Hamra JV Mumbai",
  "Shapoorji Pallonji Mumbai",
  "ITD Cementation Mumbai",
  "NCC Limited Hyderabad",
];

const CATEGORIES = [
  "TBM 6.3m EPB Metro Tunnel",
  "TBM 12.5m Slurry Road Tunnel",
  "TBM 8.5m Hard Rock Hydro",
  "TBM 5.8m Shield Railway",
  "NATM Drill Blast Tunnel",
  "TBM 14.5m Mixed Ground Highway",
  "Micro TBM 2.5m Utility Tunnel",
  "TBM 15m Four Lane Expressway",
];

const SHIPMENT_STATUSES = [
  "TBM Cutterhead Assembly Factory",
  "TBM Segment Transport Transit",
  "Boring Advance Ring Installation",
  "Backup System Muck Conveyor",
  "TBM Breakthrough Receiving Shaft",
  "Tunnel Lining Waterproofing Done",
];

const ZONES = [
  "Mumbai Coastal Road Metro",
  "Delhi RRTS NCRTC Corridor",
  "Chennai Metro Phase 2",
  "Bangalore Metro Purple Line",
  "Hyderabad Metro Extension",
  "Kolkata East-West Metro",
  "Pune Metro Line 3",
];

const MODES = [
  "SPMT 16-Axle 500T TBM",
  "Heavy Haul Rail 200T",
  "Barge Coastal 3000T",
  "Multi-Axle Trailer 80T",
  "Crane Barge River 600T",
  "Modular Trailer 120T",
];

const TABS = ["Dashboard", "TBM Registry", "Tunnel Analytics", "Insights"];

const SC: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  slate: "bg-slate-100 text-slate-600",
  orange: "bg-orange-100 text-orange-700",
};

const statusColor: Record<string, string> = {
  "TBM Cutterhead Assembly Factory": "slate",
  "TBM Segment Transport Transit": "blue",
  "Boring Advance Ring Installation": "amber",
  "Backup System Muck Conveyor": "orange",
  "TBM Breakthrough Receiving Shaft": "red",
  "Tunnel Lining Waterproofing Done": "green",
};

interface TBMRecord {
  id: string;
  batchNo: string;
  developer: string;
  zone: string;
  category: string;
  description: string;
  diameter: number;
  length: number;
  geology: string;
  tbmMake: string;
  cutterDiscs: number;
  origin: string;
  site: string;
  city: string;
  mode: string;
  prodDate: string;
  shipDate: string;
  transitDays: number;
  contractValue: number;
  segmentType: string;
  status: string;
  remarks: string;
}

function formatINR(v: number): string {
  if (v >= 1e7) return `\u20b9${(v / 1e7).toFixed(0)} Cr`;
  if (v >= 1e5) return `\u20b9${(v / 1e5).toFixed(0)} L`;
  return `\u20b9${(v / 1e3).toFixed(0)} K`;
}

const records: TBMRecord[] = [
  {
    id: "TBM-0001", batchNo: "BT-MCR/2025/001", developer: "Larsen Toubro Mumbai HQ", zone: "Mumbai Coastal Road Metro",
    category: "TBM 12.5m Slurry Road Tunnel", description: "Mumbai Coastal Road twin tunnel Package-3 Worli-Sewri 10.58km",
    diameter: 12.5, length: 10.58, geology: "Basalt Hard Rock", tbmMake: "Herrenknecht Germany", cutterDiscs: 52,
    origin: "Herrenknecht Factory Schwanau", site: "Worli Launch Shaft", city: "Mumbai", mode: "SPMT 16-Axle 500T TBM",
    prodDate: "2024-03-15", shipDate: "2024-08-22", transitDays: 45, contractValue: 12000000000,
    segmentType: "Steel Fiber Segment 1.8m", status: "Boring Advance Ring Installation",
    remarks: "Twin TBM operation, ring 4872 of 5880 installed, 82.8% complete",
  },
  {
    id: "TBM-0002", batchNo: "BT-DRRTS/2025/002", developer: "Afcons Infrastructure Mumbai", zone: "Delhi RRTS NCRTC Corridor",
    category: "TBM 6.3m EPB Metro Tunnel", description: "Delhi-Gurgaon RRTS underground section 5.2km Sahibabad-Duhai",
    diameter: 6.3, length: 5.2, geology: "Soft Alluvium", tbmMake: "CRCHI China", cutterDiscs: 36,
    origin: "CRCHI Changsha Plant", site: "Sahibabad Launch Shaft", city: "Ghaziabad", mode: "Heavy Haul Rail 200T",
    prodDate: "2024-01-10", shipDate: "2024-06-18", transitDays: 38, contractValue: 4200000000,
    segmentType: "RC Precast 1.5m", status: "Tunnel Lining Waterproofing Done",
    remarks: "Breakthrough achieved March 2025, waterproofing and finishing in progress",
  },
  {
    id: "TBM-0003", batchNo: "BT-CMRL2/2025/003", developer: "Dilip Buildcon Indore MP", zone: "Chennai Metro Phase 2",
    category: "TBM 6.3m EPB Metro Tunnel", description: "Chennai Metro Phase 2 Corridor-3 Madhavaram-Sholinganallur 9.1km",
    diameter: 6.3, length: 9.1, geology: "Mixed Ground", tbmMake: "Robbins USA", cutterDiscs: 38,
    origin: "Robbins Kent Washington", site: "Madhavaram Yard", city: "Chennai", mode: "Barge Coastal 3000T",
    prodDate: "2024-05-20", shipDate: "2024-12-10", transitDays: 55, contractValue: 5600000000,
    segmentType: "RC Precast 1.5m", status: "Boring Advance Ring Installation",
    remarks: "EPB mode operating in marine clay, 63% advance, avg 11.2 m/day",
  },
  {
    id: "TBM-0004", batchNo: "BT-BMRC/2025/004", developer: "JK Infrastructure Delhi", zone: "Bangalore Metro Purple Line",
    category: "TBM 5.8m Shield Railway", description: "Namma Metro Phase 2 KR Puram-Silk Board 3.8km twin bore",
    diameter: 5.8, length: 3.8, geology: "Granite Gneiss", tbmMake: "Kawasaki Japan", cutterDiscs: 32,
    origin: "Kawasaki Kobe Works", site: "KR Puram Shaft", city: "Bangalore", mode: "Multi-Axle Trailer 80T",
    prodDate: "2024-07-05", shipDate: "2025-01-20", transitDays: 42, contractValue: 2800000000,
    segmentType: "Precast Concrete 1.2m", status: "TBM Segment Transport Transit",
    remarks: "Cutterhead and shield delivered, segment casting yard supply chain active",
  },
  {
    id: "TBM-0005", batchNo: "BT-HMR/2025/005", developer: "Gulfar Al Hamra JV Mumbai", zone: "Hyderabad Metro Extension",
    category: "TBM 6.3m EPB Metro Tunnel", description: "Hyderabad Metro Phase 2 Nagole-LB Nagar extension 4.5km underground",
    diameter: 6.3, length: 4.5, geology: "Laterite Weathered", tbmMake: "Hitachi Zosen Japan", cutterDiscs: 34,
    origin: "Hitachi Zosen Osaka", site: "Nagole Shaft", city: "Hyderabad", mode: "Crane Barge River 600T",
    prodDate: "2024-09-12", shipDate: "2025-03-28", transitDays: 48, contractValue: 3200000000,
    segmentType: "RC Precast 1.5m", status: "TBM Cutterhead Assembly Factory",
    remarks: "Factory acceptance test scheduled, expected dispatch Q2 2025",
  },
  {
    id: "TBM-0006", batchNo: "BT-KMRC/2025/006", developer: "Shapoorji Pallonji Mumbai", zone: "Kolkata East-West Metro",
    category: "TBM 6.3m EPB Metro Tunnel", description: "Kolkata East-West Metro underwater Hooghly crossing 520m river section",
    diameter: 6.3, length: 14.67, geology: "Soft Alluvium", tbmMake: "Herrenknecht Germany", cutterDiscs: 40,
    origin: "Herrenknecht Factory Schwanau", site: "Howrah Maidan Shaft", city: "Kolkata", mode: "SPMT 16-Axle 500T TBM",
    prodDate: "2023-04-20", shipDate: "2023-11-15", transitDays: 50, contractValue: 8900000000,
    segmentType: "Steel Fiber Segment 1.8m", status: "TBM Breakthrough Receiving Shaft",
    remarks: "Breakthrough at Esplanade shaft, India first underwater metro tunnel complete",
  },
  {
    id: "TBM-0007", batchNo: "BT-PMR3/2025/007", developer: "ITD Cementation Mumbai", zone: "Pune Metro Line 3",
    category: "TBM 6.3m EPB Metro Tunnel", description: "Pune Metro Line 3 Hinjewadi-Shivajinagar 11.8km fully underground",
    diameter: 6.3, length: 11.8, geology: "Basalt Hard Rock", tbmMake: "Terratec Australia", cutterDiscs: 42,
    origin: "Terratec Brisbane", site: "Hinjewadi Launch", city: "Pune", mode: "Modular Trailer 120T",
    prodDate: "2024-02-08", shipDate: "2024-09-15", transitDays: 40, contractValue: 6800000000,
    segmentType: "RC Precast 1.5m", status: "Backup System Muck Conveyor",
    remarks: "Muck conveyor system commissioning, conveyor belt alignment in progress",
  },
  {
    id: "TBM-0008", batchNo: "BT-MCRW/2025/008", developer: "NCC Limited Hyderabad", zone: "Mumbai Coastal Road Metro",
    category: "TBM 15m Four Lane Expressway", description: "Mumbai Trans Harbour Link approach tunnel 3.2km four lane bored",
    diameter: 15, length: 3.2, geology: "Mixed Ground", tbmMake: "Herrenknecht Germany", cutterDiscs: 60,
    origin: "Herrenknecht Factory Schwanau", site: "Sewri Launch Shaft", city: "Mumbai", mode: "SPMT 16-Axle 500T TBM",
    prodDate: "2023-08-10", shipDate: "2024-04-20", transitDays: 52, contractValue: 11000000000,
    segmentType: "Cast Iron Bolted 2.0m", status: "Tunnel Lining Waterproofing Done",
    remarks: "India largest TBM diameter tunnel complete, waterproofing certified",
  },
  {
    id: "TBM-0009", batchNo: "BT-DRTS/2025/009", developer: "Larsen Toubro Mumbai HQ", zone: "Delhi RRTS NCRTC Corridor",
    category: "TBM 8.5m Hard Rock Hydro", description: "Delhi Meerut RRTS underground section Duhai to New Ashok Nagar 12km",
    diameter: 8.5, length: 12, geology: "Sandstone Shale", tbmMake: "Robbins USA", cutterDiscs: 44,
    origin: "Robbins Kent Washington", site: "Duhai Portal", city: "Delhi", mode: "Heavy Haul Rail 200T",
    prodDate: "2024-06-22", shipDate: "2025-01-08", transitDays: 44, contractValue: 7500000000,
    segmentType: "Steel Fiber Segment 1.8m", status: "Boring Advance Ring Installation",
    remarks: "Hard rock TBM, disc cutter consumption high at 28 discs/km, 47% complete",
  },
  {
    id: "TBM-0010", batchNo: "BT-CHN/2025/010", developer: "Afcons Infrastructure Mumbai", zone: "Chennai Metro Phase 2",
    category: "Micro TBM 2.5m Utility Tunnel", description: "Chennai storm water drain micro tunneling 4.2km Anna Nagar corridor",
    diameter: 2.5, length: 4.2, geology: "Laterite Weathered", tbmMake: "CRCHI China", cutterDiscs: 17,
    origin: "CRCHI Changsha Plant", site: "Anna Nagar Shaft", city: "Chennai", mode: "Multi-Axle Trailer 80T",
    prodDate: "2024-11-05", shipDate: "2025-04-18", transitDays: 35, contractValue: 800000000,
    segmentType: "Precast Concrete 1.2m", status: "TBM Segment Transport Transit",
    remarks: "Micro TBM components in transit via Chennai port, jacking shaft ready",
  },
  {
    id: "TBM-0011", batchNo: "BT-BLR/2025/011", developer: "Dilip Buildcon Indore MP", zone: "Bangalore Metro Purple Line",
    category: "TBM 14.5m Mixed Ground Highway", description: "Bangalore Silk Board to KR Puram tunnel 6.8km road tunnel decongestion",
    diameter: 14.5, length: 6.8, geology: "Granite Gneiss", tbmMake: "Herrenknecht Germany", cutterDiscs: 58,
    origin: "Herrenknecht Factory Schwanau", site: "Silk Board Shaft", city: "Bangalore", mode: "SPMT 16-Axle 500T TBM",
    prodDate: "2025-01-18", shipDate: "2025-06-25", transitDays: 48, contractValue: 10500000000,
    segmentType: "Cast Iron Bolted 2.0m", status: "TBM Cutterhead Assembly Factory",
    remarks: "Factory assembly of 14.5m mixed ground TBM, FAT pending",
  },
  {
    id: "TBM-0012", batchNo: "BT-HYD/2025/012", developer: "JK Infrastructure Delhi", zone: "Hyderabad Metro Extension",
    category: "NATM Drill Blast Tunnel", description: "Hyderabad Metro Phase 2 MGBS-Chandrayangutta 3.4km NATM section",
    diameter: 6.3, length: 3.4, geology: "Granite Gneiss", tbmMake: "Robbins USA", cutterDiscs: 0,
    origin: "N/A - NATM Method", site: "MGBS Portal", city: "Hyderabad", mode: "Multi-Axle Trailer 80T",
    prodDate: "2024-08-14", shipDate: "2024-08-14", transitDays: 0, contractValue: 1500000000,
    segmentType: "Steel Fiber Segment 1.8m", status: "Boring Advance Ring Installation",
    remarks: "NATM drill-blast in hard granite, 2.1m advance per round, 71% complete",
  },
  {
    id: "TBM-0013", batchNo: "BT-KOL/2025/013", developer: "Gulfar Al Hamra JV Mumbai", zone: "Kolkata East-West Metro",
    category: "TBM 5.8m Shield Railway", description: "Kolkata East-West Sector-V to Salt Lake 5.6km elevated-cum-underground",
    diameter: 5.8, length: 5.6, geology: "Soft Alluvium", tbmMake: "Kawasaki Japan", cutterDiscs: 30,
    origin: "Kawasaki Kobe Works", site: "Salt Lake Shaft", city: "Kolkata", mode: "Crane Barge River 600T",
    prodDate: "2024-04-30", shipDate: "2024-12-05", transitDays: 46, contractValue: 3400000000,
    segmentType: "RC Precast 1.5m", status: "Backup System Muck Conveyor",
    remarks: "Muck removal via river barge, conveyor system 60% installed",
  },
  {
    id: "TBM-0014", batchNo: "BT-PUN/2025/014", developer: "Shapoorji Pallonji Mumbai", zone: "Pune Metro Line 3",
    category: "TBM 8.5m Hard Rock Hydro", description: "Pune Metro underground section Civil Court to Swargate 4.8km basalt",
    diameter: 8.5, length: 4.8, geology: "Basalt Hard Rock", tbmMake: "Terratec Australia", cutterDiscs: 46,
    origin: "Terratec Brisbane", site: "Civil Court Shaft", city: "Pune", mode: "Modular Trailer 120T",
    prodDate: "2024-06-10", shipDate: "2024-11-22", transitDays: 38, contractValue: 4100000000,
    segmentType: "Steel Fiber Segment 1.8m", status: "TBM Breakthrough Receiving Shaft",
    remarks: "Breakthrough at Swargate shaft, TBM retrieval and decommissioning started",
  },
];

const totalLength = records.reduce((s, r) => s + r.length, 0);
const activeBoring = records.filter(r => r.status === "Boring Advance Ring Installation" || r.status === "Backup System Muck Conveyor").length;
const completedCount = records.filter(r => r.status === "Tunnel Lining Waterproofing Done").length;
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

const kpis = [
  { l: "Total Tunnel Length", v: `${totalLength.toFixed(1)} km`, s: "across all TBM projects" },
  { l: "Active Boring", v: activeBoring, s: "machines in operation" },
  { l: "Completed", v: completedCount, s: "tunnels waterproofed" },
  { l: "Total Contract Value", v: formatINR(totalContract), s: "aggregated project value" },
];

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyAdvance = Array.from({ length: 12 }, (_, i) => ({
  m: MO[i],
  metro: +(85 + Math.sin(i * 0.5) * 18 + Math.random() * 8).toFixed(0),
  road: +(55 + Math.cos(i * 0.6) * 14 + Math.random() * 6).toFixed(0),
  railway: +(30 + Math.sin(i * 0.7) * 8 + Math.random() * 4).toFixed(0),
  hydro: +(18 + Math.cos(i * 0.8) * 5 + Math.random() * 3).toFixed(0),
}));

const tbmTypeDist = [
  { n: "EPB", v: 30 }, { n: "Slurry", v: 25 }, { n: "Hard Rock", v: 20 },
  { n: "NATM", v: 12 }, { n: "Shield", v: 8 }, { n: "Micro", v: 5 },
];

const advanceRate = Array.from({ length: 12 }, (_, i) => ({
  m: MO[i],
  actual: +(9 + Math.sin(i * 0.4) * 2.5 + Math.random() * 2).toFixed(1),
  target: 12,
}));

const oemShare = [
  { n: "Herrenknecht", v: 4 }, { n: "Robbins", v: 2 }, { n: "CRCHI", v: 2 },
  { n: "Kawasaki", v: 2 }, { n: "Hitachi Zosen", v: 1 }, { n: "Terratec", v: 2 },
];

const INSIGHTS = [
  {
    t: "Mumbai Coastal Road: 10.58km Twin Tunnel Using India Largest Slurry TBMs",
    c: "The Mumbai Coastal Road Project (MCRP) features India's most ambitious urban tunnel: a 10.58km twin-tube tunnel from Worli to Sewri, bored by two Herrenknecht 12.5m slurry TBMs (Mavala and Navi Mumbai). Each TBM weighs over 2,200 tonnes and operates in highly variable geology transitioning from basalt hard rock to breccia and shale. The project valued at over \u20b912,000 crore uses 1.8m wide steel fiber-reinforced concrete segments manufactured at an on-site casting yard producing 18 rings/day. The slurry TBM is essential due to the high groundwater table and mixed-face conditions. Key logistics challenges include: (1) SPMT 16-axle transport of cutterhead (120T) and main bearing through Mumbai's congested roads at night, (2) Segment supply chain delivering 30+ segments per day from the Worli casting yard, (3) Muck disposal via conveyor to barge loading at Sewri, handling 3,500 m\u00b3/day of excavated material, (4) Cutter disc replacement logistics with 52 discs per cutterhead, each disc weighing 350kg requiring crane access and replacement every 2-3 km of advance. The twin tunnel approach allows parallel boring with 25m pillar separation. Breakthrough is targeted for 2026 with waterproofing and systems installation completing by 2027.",
  },
  {
    t: "Delhi RRTS NCRTC: 63km Semi-High-Speed Corridor with 12km Underground TBM Section",
    c: "The National Capital Region Transport Corporation (NCRTC) is building India's first Regional Rapid Transit System (RRTS) on the Delhi-Ghaziabad-Meerut corridor spanning 63km with design speed of 180km/h. Of the total corridor, 12km uses TBM-bored underground tunnels in densely populated urban sections. The \u20b930,000 crore project deploys CRCHI 6.3m EPB TBMs for soft alluvium and Robbins 8.5m hard rock TBMs for the sandstone-shale transition zones. The 180km/h design speed requires tunnel cross-section larger than standard metro (8.5m vs 6.3m) for aerodynamic pressure relief. Cutter disc consumption in the Delhi ridge quartzite zone reaches 35 discs/km, requiring just-in-time logistics for disc inventory. NCRTC plans 8 RRTS corridors totaling 800km across NCR by 2035, making it the world's largest regional rapid transit program and creating sustained demand for TBM logistics services spanning Herrenknecht and Robbins machine supply, segment casting yard operations, muck conveyor installation, and cutter disc replacement chains.",
  },
  {
    t: "India 2,000km Metro Tunnel Target by 2030: TBM Demand and Supply Chain Scale-Up",
    c: "India has set an ambitious target of 2,000km of metro tunnel construction by 2030, requiring approximately 80-100 active TBMs simultaneously operating across the country. Current active TBM fleet stands at approximately 35-40 machines across 15 cities, with major tunneling programs in Mumbai (12 TBMs for Metro Line 3 and Coastal Road), Delhi (8 TBMs for RRTS and Metro Phase-IV), Chennai (6 TBMs for Phase 2), Bangalore (5 TBMs for Phase 2), Kolkata (4 TBMs for East-West), Hyderabad (3 TBMs for Phase 2), and Pune (3 TBMs for Line 3). The TBM supply chain ecosystem in India is maturing with: (1) Local segment casting yards in Mumbai, Delhi, Chennai, and Bangalore producing 20-25 rings/day each, (2) Herrenknecht India service center in Mumbai providing cutter disc refurbishment, (3) CRCHI establishing assembly facility in India for 6m class EPB TBMs, (4) Growing pool of 500+ trained TBM operators and tunnel engineers, (5) Specialized heavy transport companies (SMC, TML, Escorts) for SPMT and modular trailer operations. Key logistics bottlenecks remain: (1) Port congestion for imported TBM components (Nhava Sheva, Chennai, Mundra), (2) Night-only heavy transport permits in urban areas, (3) Limited cutter disc manufacturing in India with 60% imported from Germany and Japan, (4) Segment mold lead time of 6-8 months from European suppliers. The estimated TBM logistics market in India is \u20b95,000-7,000 crore annually.",
  },
  {
    t: "TBM Cutter Disc Replacement Logistics: 17-Inch Disc Supply Chain Critical Path",
    c: "Cutter disc replacement is the single most critical logistics activity in TBM tunneling, directly determining advance rate and machine utilization. A typical 6.3m EPB TBM carries 36-40 cutter discs (17-inch), each weighing 250-350kg with tungsten carbide inserts. In hard rock (basalt, granite, gneiss), disc life is 150-250m of advance, meaning a 10km tunnel requires 40-67 complete disc changes or 1,440-2,680 individual disc replacements. For large-diameter machines (12-15m), the cutterhead carries 52-60 discs with even higher consumption. The cutter disc supply chain involves: (1) Primary manufacturers: Herrenknecht (Germany), Robbins (USA), China Railway Construction Heavy Industry (CRCHI, China), with disc costs of \u20b91.5-3 lakh per disc, (2) Refurbishment centers: Herrenknecht India Mumbai and Larsen Toubro in-house facilities, extending disc life by 40-60% at 40% of new disc cost, (3) Emergency inventory: sites maintain 10-15% buffer stock of discs, (4) Transport logistics: each disc requires forklift handling from surface to cutterhead via tunnel locomotive, with replacement taking 8-12 hours for a full cutterhead change. Disc consumption monitoring via TBM data acquisition systems (torque, thrust, penetration rate) enables predictive replacement scheduling. In India, the total annual cutter disc spend across all TBM projects is estimated at \u20b9200-300 crore, with import dependency of 60% creating supply chain vulnerability during monsoon shipping delays. Local disc manufacturing by Zenith Birla and Bharat Forge is nascent but growing, targeting 30% domestic production by 2027.",
  },
];

export default function TunnelBoringMachineLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "developer", label: "Developer", options: DEVELOPERS.map(d => ({ value: d, count: records.filter(r => r.developer === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "tbmMake", label: "TBM Make", options: [...new Set(records.map(r => r.tbmMake))].map(t => ({ value: t, count: records.filter(r => r.tbmMake === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function () { const n = { ...p }; n[k] = (p[k] || []).filter(x => x !== v); if (n[k].length === 0) delete n[k]; return n; })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.developer.toLowerCase().includes(q) && !r.zone.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.city.toLowerCase().includes(q) && !r.tbmMake.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof TBMRecord] as string));
  });

  return (
    <div className="tbm-root p-6 space-y-6">
      <PageHeader title="TBM Tunnel Boring Machine Logistics" description="Indian tunnel boring machine logistics covering metro, road, highway, railway, and hydro tunnel projects with EPB slurry hard rock shield and micro TBM transport, segment supply chain, cutter disc replacement, and muck conveyor operations across Mumbai Delhi Chennai Bangalore Hyderabad Kolkata Pune" />

      <div className="tbm-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`tbm-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#1e293b] text-white" : "text-gray-600 hover:bg-slate-100"}`}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="tbm-dash space-y-6">
          <div className="tbm-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.l} className="tbm-kpi bg-white rounded-lg border p-4">
                <div className="text-xs text-gray-500 tbm-kpi-label">{k.l}</div>
                <div className="text-2xl font-bold text-[#1e293b] tbm-kpi-val">{k.v}</div>
                <div className="text-xs text-gray-400 tbm-kpi-sub">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="tbm-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly Tunnel Advance (m)</h3>
              <BarChart data={monthlyAdvance} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="metro" fill="#1e293b" radius={[4, 4, 0, 0]} name="Metro" />
                <Bar dataKey="road" fill="#334155" radius={[4, 4, 0, 0]} name="Road" />
                <Bar dataKey="railway" fill="#475569" radius={[4, 4, 0, 0]} name="Railway" />
                <Bar dataKey="hydro" fill="#6366f1" radius={[4, 4, 0, 0]} name="Hydro" />
              </BarChart>
            </div>
            <div className="tbm-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">TBM Type Distribution</h3>
              <PieChart width={400} height={220}>
                <Pie data={tbmTypeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {tbmTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="tbm-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Advance Rate (m/day) vs 12m Target</h3>
              <LineChart data={advanceRate} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" />
                <YAxis domain={[6, 14]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#1e293b" strokeWidth={2} name="Actual m/day" />
                <Line type="monotone" dataKey="target" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="Target 12m" />
              </LineChart>
            </div>
            <div className="tbm-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">TBM OEM Usage Share</h3>
              <BarChart data={oemShare} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="v" fill="#334155" radius={[4, 4, 0, 0]} name="TBMs" />
              </BarChart>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="tbm-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "TBM Logistics", href: "#" }, { label: "TBM Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="tbm-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {["ID", "Batch No", "Developer", "Zone", "Category", "Description", "Diameter (m)", "Length (km)", "Geology", "TBM Make", "Cutter Discs", "Origin", "Site", "City", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Segment Type", "Status", "Remarks"]
                    .map(h => <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const rowCls = r.status === "TBM Breakthrough Receiving Shaft" ? "tbm-row-critical bg-red-50"
                    : r.status === "Boring Advance Ring Installation" ? "tbm-row-warning bg-amber-50"
                    : r.status === "TBM Segment Transport Transit" ? "tbm-row-info bg-blue-50"
                    : r.status === "Tunnel Lining Waterproofing Done" ? "tbm-row-done bg-green-50"
                    : r.status === "Backup System Muck Conveyor" ? "tbm-row-orange bg-orange-50"
                    : "";
                  return (
                    <tr key={r.id} className={`border-b hover:bg-slate-50 ${rowCls}`}>
                      <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                      <td className="px-3 py-2"><span className="tbm-badge inline-block px-2 py-0.5 rounded text-xs bg-[#1e293b] text-white font-mono">{r.batchNo}</span></td>
                      <td className="px-3 py-2 text-xs max-w-28 truncate">{r.developer}</td>
                      <td className="px-3 py-2 text-xs max-w-28 truncate">{r.zone}</td>
                      <td className="px-3 py-2"><span className="tbm-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                      <td className="px-3 py-2 text-xs max-w-36 truncate">{r.description}</td>
                      <td className="px-3 py-2 text-xs text-right font-semibold">{r.diameter}</td>
                      <td className="px-3 py-2 text-xs text-right font-semibold">{r.length}</td>
                      <td className="px-3 py-2 text-xs">{r.geology}</td>
                      <td className="px-3 py-2 text-xs">{r.tbmMake}</td>
                      <td className="px-3 py-2 text-xs text-right">{r.cutterDiscs || "-"}</td>
                      <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                      <td className="px-3 py-2 text-xs max-w-24 truncate">{r.site}</td>
                      <td className="px-3 py-2 text-xs">{r.city}</td>
                      <td className="px-3 py-2 text-xs max-w-24 truncate">{r.mode}</td>
                      <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                      <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                      <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 45 ? "text-red-600" : r.transitDays > 0 ? "text-green-600" : "text-gray-400"}`}>{r.transitDays || "-"}</span></td>
                      <td className="px-3 py-2 text-xs font-semibold text-[#1e293b]">{formatINR(r.contractValue)}</td>
                      <td className="px-3 py-2 text-xs">{r.segmentType}</td>
                      <td className="px-3 py-2"><span className={`tbm-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                      <td className="px-3 py-2 text-xs text-gray-500 max-w-36 truncate">{r.remarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="tbm-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="tbm-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly Advance by Project Type (m)</h3>
              <BarChart data={monthlyAdvance} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="metro" fill="#1e293b" radius={[4, 4, 0, 0]} name="Metro" />
                <Bar dataKey="road" fill="#334155" radius={[4, 4, 0, 0]} name="Road" />
                <Bar dataKey="railway" fill="#475569" radius={[4, 4, 0, 0]} name="Railway" />
                <Bar dataKey="hydro" fill="#6366f1" radius={[4, 4, 0, 0]} name="Hydro" />
              </BarChart>
            </div>
            <div className="tbm-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">TBM Type Share Across Fleet</h3>
              <PieChart width={400} height={240}>
                <Pie data={tbmTypeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={90} label>
                  {tbmTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="tbm-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Daily Advance Rate Trend (m/day)</h3>
              <LineChart data={advanceRate} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" />
                <YAxis domain={[6, 14]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#1e293b" strokeWidth={2} name="Actual m/day" />
                <Line type="monotone" dataKey="target" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="Target 12m" />
              </LineChart>
            </div>
            <div className="tbm-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">OEM TBM Manufacturer Deployment</h3>
              <BarChart data={oemShare} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="v" fill="#475569" radius={[4, 4, 0, 0]} name="TBMs Deployed" />
              </BarChart>
            </div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="tbm-insights grid grid-cols-2 gap-6">
          {INSIGHTS.map(ins => (
            <div key={ins.t} className="tbm-insight bg-white rounded-lg border p-5">
              <h3 className="text-base font-bold text-[#1e293b] mb-2">{ins.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
