"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#4338ca", "#4f46e5", "#6366f1", "#818cf8", "#3730a3", "#312e81", "#a5b4fc", "#c7d2fe"];
const MINES = ["NMDC Bailadila", "Coal India Jharia", "Hindalco Bauxite Odisha", "Vedanta Zawar Zinc", "NMDC Donimalai Iron", "HCL Mosaboni Copper", "Sesa Goa Iron Ore", "Rajasthan State Lignite"];
const MINERALS = ["Iron Ore", "Coal", "Bauxite", "Limestone", "Copper Ore", "Zinc Ore", "Manganese", "Lignite"];
const SHIPMENT_STATUSES = ["Loaded at Pit", "In Transit", "At Railway Siding", "Delivered to Plant", "Quality Sample Pending", "Rejected by Plant"];
const MODES = ["Dumper Truck", "Conveyor Belt", "Rail Rake", "Ship / Barge", "Slurry Pipeline", "Aerial Ropeway"];
const DESTINATIONS = ["SAIL Rourkela", "Tata Jamshedpur", "JSW Vijayanagar", "NTPC Barh", "Hindalco Renukoot", "Vedanta Jharsuguda", "ACC Wadi", "UltraTech Adityapur"];
const TABS = ["Dashboard", "Ore Shipment Registry", "Mining Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700", indigo: "bg-indigo-100 text-indigo-700" };
const statusColor: Record<string, string> = { "Loaded at Pit": "indigo", "In Transit": "blue", "At Railway Siding": "slate", "Delivered to Plant": "green", "Quality Sample Pending": "amber", "Rejected by Plant": "red" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyOutput = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], ironOre: ri(220, 380, 295 + Math.sin(i * 0.5) * 50), coal: ri(420, 680, 545 + Math.cos(i * 0.6) * 80), bauxite: ri(80, 160, 118 + Math.sin(i * 0.7) * 25), limestone: ri(120, 220, 168 + Math.cos(i * 0.8) * 30) }));
const mineralDist = [{ n: "Coal", v: 38 }, { n: "Iron Ore", v: 22 }, { n: "Limestone", v: 15 }, { n: "Bauxite", v: 10 }, { n: "Copper", v: 5 }, { n: "Zinc", v: 4 }, { n: "Manganese", v: 3 }, { n: "Lignite", v: 3 }];
const productionTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(78, 98, 88 + Math.sin(i * 0.4) * 6)).toFixed(1), target: 90.0 }));
const minePerf = MINES.slice(0, 6).map(m => ({ n: m.split(" ").pop() || m, v: +ri(68, 96, 82 + Math.random() * 10).toFixed(0) }));

interface ShipmentRecord { id: string; consignmentNo: string; mine: string; mineral: string; grade: string; quantity: number; unit: string; fePercent: number; destination: string; mode: string; loadDate: string; eta: string; deliveryDate: string; transitHours: number; vehicleNo: string; operator: string; status: string; sampleResult: string; invoiceValue: number; demurrage: number; remarks: string; }

const records: ShipmentRecord[] = [
  { id: "MLC-0001", consignmentNo: "CNM/NMDC/2025/042", mine: "NMDC Bailadila", mineral: "Iron Ore", grade: "Fe 64% Lumps", quantity: 8500, unit: "MT", fePercent: 64.2, destination: "SAIL Rourkela", mode: "Rail Rake", loadDate: "2025-01-10", eta: "2025-01-12", deliveryDate: "", transitHours: 48, vehicleNo: "RKN/2025/2245", operator: "SECL Rake Crew", status: "In Transit", sampleResult: "Pending", invoiceValue: 6800000, demurrage: 0, remarks: "Fe 64% lumps from Bailadila Deposit 14 - SAIL Rourkela BF" },
  { id: "MLC-0002", consignmentNo: "CIL/JHD/2025/1088", mine: "Coal India Jharia", mineral: "Coal", grade: "Grade C Coal", quantity: 4200, unit: "MT", fePercent: 0, destination: "NTPC Barh", mode: "Rail Rake", loadDate: "2025-01-08", eta: "2025-01-09", deliveryDate: "2025-01-09", transitHours: 24, vehicleNo: "RKN/2025/2201", operator: "ECoR Rake Crew", status: "Delivered to Plant", sampleResult: "Grade C - Ash 32%", invoiceValue: 2520000, demurrage: 0, remarks: "Thermal coal Jharia - NTPC Barh Stage II power plant" },
  { id: "MLC-0003", consignmentNo: "HND/ODS/2025/0345", mine: "Hindalco Bauxite Odisha", mineral: "Bauxite", grade: "Al2O3 46%", quantity: 2800, unit: "MT", fePercent: 0, destination: "Hindalco Renukoot", mode: "Dumper Truck", loadDate: "2025-01-14", eta: "2025-01-15", deliveryDate: "", transitHours: 18, vehicleNo: "OD-12-TR-4521", operator: "Hindalco Fleet", status: "In Transit", sampleResult: "Pending", invoiceValue: 3360000, demurrage: 0, remarks: "Bauxite from Panchpatmali mine - Hindalco alumina refinery" },
  { id: "MLC-0004", consignmentNo: "VDN/ZWR/2025/0198", mine: "Vedanta Zawar Zinc", mineral: "Zinc Ore", grade: "Zn 8.5%", quantity: 1800, unit: "MT", fePercent: 0, destination: "Vedanta Jharsuguda", mode: "Dumper Truck", loadDate: "2025-01-12", eta: "2025-01-13", deliveryDate: "2025-01-13", transitHours: 14, vehicleNo: "RJ-22-TR-7834", operator: "Vedanta Fleet", status: "Delivered to Plant", sampleResult: "Zn 8.5% - Pb 1.2%", invoiceValue: 2520000, demurrage: 0, remarks: "Zinc ore Zawar mines - Vedanta smelter feed" },
  { id: "MLC-0005", consignmentNo: "NMDC/DNM/2025/056", mine: "NMDC Donimalai Iron", mineral: "Iron Ore", grade: "Fe 66% Fines", quantity: 12000, unit: "MT", fePercent: 66.1, destination: "JSW Vijayanagar", mode: "Rail Rake", loadDate: "2025-01-13", eta: "2025-01-15", deliveryDate: "", transitHours: 52, vehicleNo: "RKN/2025/2278", operator: "SWR Rake Crew", status: "In Transit", sampleResult: "Pending", invoiceValue: 8400000, demurrage: 0, remarks: "Fe 66% fines Donimalai - JSW Ballari pellet plant" },
  { id: "MLC-0006", consignmentNo: "HCL/MSB/2025/022", mine: "HCL Mosaboni Copper", mineral: "Copper Ore", grade: "Cu 1.8%", quantity: 3200, unit: "MT", fePercent: 0, destination: "Vedanta Jharsuguda", mode: "Rail Rake", loadDate: "2025-01-11", eta: "2025-01-13", deliveryDate: "2025-01-13", transitHours: 48, vehicleNo: "RKN/2025/2256", operator: "SER Rake Crew", status: "Delivered to Plant", sampleResult: "Cu 1.82% - Mo 0.05%", invoiceValue: 4160000, demurrage: 0, remarks: "Chalcopyrite ore Mosaboni - Vedanta copper smelter" },
  { id: "MLC-0007", consignmentNo: "SGA/GOA/2025/189", mine: "Sesa Goa Iron Ore", mineral: "Iron Ore", grade: "Fe 58% Lumps", quantity: 6500, unit: "MT", fePercent: 58.4, destination: "Tata Jamshedpur", mode: "Ship / Barge", loadDate: "2025-01-07", eta: "2025-01-10", deliveryDate: "", transitHours: 72, vehicleNo: "MV Goa Pioneer", operator: "Sesa Shipping", status: "At Railway Siding", sampleResult: "Pending", invoiceValue: 3900000, demurrage: 24000, remarks: "Fe 58% lumps via Mormugao-Haldia barge - demurrage at port" },
  { id: "MLC-0008", consignmentNo: "RSM/LGN/2025/078", mine: "Rajasthan State Lignite", mineral: "Lignite", grade: "GCV 3200", quantity: 4500, unit: "MT", fePercent: 0, destination: "NTPC Barh", mode: "Rail Rake", loadDate: "2025-01-15", eta: "2025-01-17", deliveryDate: "", transitHours: 48, vehicleNo: "RKN/2025/2298", operator: "NWR Rake Crew", status: "Loaded at Pit", sampleResult: "Pending", invoiceValue: 1575000, demurrage: 0, remarks: "Lignite from Barsingsar mine - NTPC Barh thermal plant" },
  { id: "MLC-0009", consignmentNo: "CIL/JHD/2025/1095", mine: "Coal India Jharia", mineral: "Coal", grade: "Grade A Coal", quantity: 3800, unit: "MT", fePercent: 0, destination: "JSW Vijayanagar", mode: "Conveyor Belt", loadDate: "2025-01-14", eta: "2025-01-14", deliveryDate: "2025-01-14", transitHours: 4, vehicleNo: "Conv-12A-JHD", operator: "CIL Plant Ops", status: "Delivered to Plant", sampleResult: "Grade A - Ash 18%", invoiceValue: 3040000, demurrage: 0, remarks: "Washed coal Grade A via overland conveyor to rail siding" },
  { id: "MLC-0010", consignmentNo: "NMDC/BLL/2025/048", mine: "NMDC Bailadila", mineral: "Iron Ore", grade: "Fe 65% Fines", quantity: 15000, unit: "MT", fePercent: 65.1, destination: "Tata Jamshedpur", mode: "Rail Rake", loadDate: "2025-01-09", eta: "2025-01-11", deliveryDate: "", transitHours: 48, vehicleNo: "RKN/2025/2234", operator: "SECR Rake Crew", status: "Quality Sample Pending", sampleResult: "Awaiting Lab", invoiceValue: 10500000, demurrage: 0, remarks: "Fe 65% fines Bailadila - Tata Jamshedpur steel plant - sample pending" },
  { id: "MLC-0011", consignmentNo: "HND/ODS/2025/352", mine: "Hindalco Bauxite Odisha", mineral: "Bauxite", grade: "Al2O3 44%", quantity: 3200, unit: "MT", fePercent: 0, destination: "Hindalco Renukoot", mode: "Conveyor Belt", loadDate: "2025-01-15", eta: "2025-01-15", deliveryDate: "", transitHours: 2, vehicleNo: "Conv-BX-PLR", operator: "Hindalco Plant", status: "Loaded at Pit", sampleResult: "Pending", invoiceValue: 3520000, demurrage: 0, remarks: "Bauxite conveyor from Panchpatmali pit to crushing plant" },
  { id: "MLC-0012", consignmentNo: "SGA/GOA/2025/195", mine: "Sesa Goa Iron Ore", mineral: "Iron Ore", grade: "Fe 62% Lumps", quantity: 5800, unit: "MT", fePercent: 62.3, destination: "SAIL Rourkela", mode: "Ship / Barge", loadDate: "2025-01-10", eta: "2025-01-13", deliveryDate: "2025-01-13", transitHours: 72, vehicleNo: "MV Goa Fortune", operator: "Sesa Shipping", status: "Delivered to Plant", sampleResult: "Fe 62.3% - Si 3.8%", invoiceValue: 4060000, demurrage: 0, remarks: "Fe 62% lumps from Goa mines via Haldia port to Rourkela" },
  { id: "MLC-0013", consignmentNo: "CIL/JHD/2025/1102", mine: "Coal India Jharia", mineral: "Coal", grade: "Grade D Coal", quantity: 5100, unit: "MT", fePercent: 0, destination: "ACC Wadi", mode: "Rail Rake", loadDate: "2025-01-13", eta: "2025-01-14", deliveryDate: "", transitHours: 18, vehicleNo: "RKN/2025/2268", operator: "ECR Rake Crew", status: "Rejected by Plant", sampleResult: "Ash 42% - REJECTED", invoiceValue: 2040000, demurrage: 18000, remarks: "Grade D coal high ash content - rejected by ACC Wadi quality lab" },
  { id: "MLC-0014", consignmentNo: "VDN/ZWR/2025/205", mine: "Vedanta Zawar Zinc", mineral: "Zinc Ore", grade: "Zn 7.2%", quantity: 2200, unit: "MT", fePercent: 0, destination: "Vedanta Jharsuguda", mode: "Dumper Truck", loadDate: "2025-01-15", eta: "2025-01-16", deliveryDate: "", transitHours: 16, vehicleNo: "RJ-22-TR-8120", operator: "Vedanta Fleet", status: "In Transit", sampleResult: "Pending", invoiceValue: 2640000, demurrage: 0, remarks: "Zn 7.2% ore lower grade - blend with stockpile ore" },
];

const pitLoadedCount = records.filter(r => r.status === "Loaded at Pit" || r.status === "Quality Sample Pending").length;
const transitCount = records.filter(r => r.status === "In Transit" || r.status === "At Railway Siding").length;
const deliveredCount = records.filter(r => r.status === "Delivered to Plant").length;
const rejectedCount = records.filter(r => r.status === "Rejected by Plant").length;
const totalInvoiceValue = records.reduce((s, r) => s + r.invoiceValue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

const kpis = [
  { l: "Loaded / Sampling", v: pitLoadedCount, s: "at mine pit" },
  { l: "In Transit / Siding", v: transitCount, s: "en route" },
  { l: "Delivered to Plant", v: deliveredCount, s: "completed" },
  { l: "Total Shipment Value", v: fmtVal(totalInvoiceValue), s: "across all ore" },
];

const INSIGHTS = [
  {
    t: "India Mining Sector: \u20b93.2 Lakh Crore Output and 1,600+ Mines",
    c: "India is among the world\u2019s top 5 mineral producing nations, with a mining industry valued at approximately \u20b93.2 lakh crore (USD 38 billion) in FY2024. The Indian Bureau of Mines (IBM) reports over 1,600 operational mines across 27 states, producing 95+ minerals including coal (904 MT in FY2024, India is the 2nd largest coal producer globally), iron ore (265 MT), bauxite (25.5 MT), limestone (450 MT), manganese ore (4.2 MT), copper ore (3.8 MT), and zinc-lead ore (8.5 MT). India\u2019s mining sector is dominated by government-owned entities: Coal India Limited (CIL, 82% of coal production, 8 operational subsidiaries), NMDC (India\u2019s largest iron ore producer, 42 MT/year), Hindustan Copper Limited (HCL), and state-owned lignite corporations in Rajasthan, Gujarat, and Tamil Nadu. Private sector mining is growing rapidly with Vedanta Resources (zinc, copper, iron ore, bauxite), JSW Steel (iron ore), Hindalco Industries (bauxite), and Adani Enterprises (coal, sand, limestone). The MMDR Act 2015 (amended 2021 and 2023) governs mineral concessions through auction-based allocation, with 100% FDI allowed under the automatic route for mining and exploration. Key policy initiatives include: (1) National Mineral Policy 2019 targeting 100% mineral exploration coverage by 2030, (2) Mines and Minerals (Development and Regulation) Amendment Act 2023 removing legacy liabilities, (3) PM Khanij Kshetra Kalyan Yojana (PMKKKY) allocating 60% of mining royalties for tribal area development, and (4) Mineral Security Plan identifying 30 critical minerals (lithium, cobalt, nickel, rare earths) for domestic exploration. India\u2019s mining logistics moves approximately 1,800 MT of raw minerals annually via rail (55%), road (35%), conveyor (5%), and shipping/barge (5%), with an estimated logistics cost of \u20b954,000 crore (17% of mining sector value).",
  },
  {
    t: "NMDC and Iron Ore Mining: Bailadila to Donimalai Logistics",
    c: "NMDC (National Mineral Development Corporation), India\u2019s largest iron ore producer, operates mines in Chhattisgarh (Bailadila Deposit 5, 11, and 14 with 70 MT/year capacity), Karnataka (Donimalai, 28 MT/year), and the proposed Kumaraswamy expansion in Bellary district. NMDC produced 42 million tonnes of iron ore in FY2024, with Fe content grades ranging from 58% (low-grade fines) to 66% (high-grade lumps), and revenue of \u20b922,000 crore. The logistics chain from NMDC mines to steel plants involves: (1) Mining at pit face using hydraulic excavators (capacity 10-15 cum per pass), (2) Primary crushing at pit-head crushers (reducing ore from 1200 mm to 200 mm), (3) Screening and grading into lumps (+10 mm, Fe 64-66%), fines (-10 mm, Fe 58-62%), and calibrated ore (Fe 64%+ for direct reduction plants), (4) Loading onto railway wagons at mine sidings (each rake: 58 BCN wagons, 4,200-5,000 MT capacity), (5) Rail transport via South East Central Railway (SECR) and South Western Railway (SWR) to steel plants (average distance: 300-800 km), and (6) Unloading at plant railway sidings with wagon tipplers or bottom discharge. NMDC\u2019s key logistics corridors include: (1) Bailadila to Visakhapatnam Steel (RINL) via Kirandul-Kothavalasa railway (single line, 180 km), (2) Donimalai to JSW Vijayanagar/Bellary (220 km), (3) Bailadila to SAIL Rourkela (450 km via Raipur), and (4) Bailadila to SAIL Bhilai (180 km). The average rail rake transit time from Bailadila to steel plants is 36-72 hours, with key bottlenecks at Kirandul junction and Raipur marshalling yard. NMDC deploys 45+ railway sidings, 8 crushing and screening plants, and 12 mechanized loading stations. The NMDC-Odisha mining operations at Koida and Gandhamardhan (pending allocation) are expected to add 15 MT/year capacity, with new railway connectivity under the Odisha Mining Corporation joint venture. NMDC\u2019s logistics cost averages \u20b9850-1,200 per tonne for iron ore transport by rail, contributing 12-15% to delivered cost at steel plants.",
  },
  {
    t: "Coal India Logistics: From Mine to Power Plant via Rail and Conveyor",
    c: "Coal India Limited (CIL), the world\u2019s largest coal producer, produced 904 million tonnes of coal in FY2024 across 348+ mines in 8 states, supplying 78% of India\u2019s thermal coal needs. CIL\u2019s coal logistics chain moves 700+ million tonnes annually through a multi-modal network: (1) Coal extraction using continuous miners (underground) and open-pit blasting with hydraulic shovels and dumpers (surface), (2) Coal despatch from mine sidings via rail rakes (65% of CIL dispatches, average rake: 5,000 MT, 180+ daily rakes on Indian Railways), road trucks (30%, 30-40 MT per 6-axle dumper), and conveyor/ropeway systems (5% for captive power plants), (3) Rail logistics managed through CIL\u2019s dedicated rail coordination cells at each subsidiary, with Indian Railways committing 320+ rakes per day to CIL during peak season (Oct-Mar), (4) Coal quality management through automated sampling systems at 85+ loading points (as per IS 436 standards, testing for moisture, ash, volatile matter, and GCV), and (5) First-mile connectivity projects (48 coal carrying railway lines totaling 2,800+ km under construction to eliminate road transport). Key CIL subsidiaries and their logistics: MCL (Mahanadi Coalfields, 195 MT, serving NTPC Talcher and Paradip via Paradip port), SECL (South Eastern Coalfields, 175 MT, serving power plants in MP, Chhattisgarh, Maharashtra), CCL (Central Coalfields, 165 MT, serving NTPC and DVC power plants in Jharkhand and UP), NCL (Northern Coalfields, 140 MT, serving NTPC Singrauli and Rihand), ECL (Eastern Coalfields, 55 MT, serving West Bengal power plants). CIL\u2019s coal dispatch logistics costs approximately \u20b960,000 crore annually (8-10% of coal cost), with initiatives to reduce costs through: (1) Pipeliner trains (long-haul unit trains without intermediate marshalling), (2) Rapid loading systems (4,000 MT/hour automated wagon loading), (3) GPS tracking of coal rakes (real-time ETAs to power plants), and (4) Coal India\u2019s e-auction platform (SAMDAS) enabling digital freight tendering. The average coal rake transit time from mine to power plant is 36-48 hours, with an average turnaround time of 7-10 days. CIL targets 1,000 MT production by FY2026 and 1,200 MT by FY2028, requiring significant logistics capacity expansion including 500+ new rakes per day on Indian Railways.",
  },
  {
    t: "Mining Technology: Automated Haulage, Drone Surveys, and Green Mining",
    c: "India\u2019s mining industry is undergoing rapid technology adoption across exploration, extraction, and logistics: (1) Automated mine haulage systems with 320-tonne autonomous dumpers deployed at NMDC Bailadila and Coal India NCL Singrauli (reducing per-tonne haulage cost by 25%), (2) Drone-based mine surveying with LiDAR and photogrammetry for volumetric estimation, blast planning, and slope stability monitoring (deployed at 60+ mines under the Ministry of Mines Digital Mine initiative), (3) IoT-based real-time tracking of mineral shipments from pit to plant using GPS, RFID, and satellite communication for remote mine locations, (4) Automated ore grade analysis using portable XRF (X-ray Fluorescence) analyzers providing real-time Fe, Al, Si, and P content within 60 seconds, reducing sampling-to-dispatch time from 24 hours to 2 hours, (5) Mine management information systems (MMIS) integrating mine planning, fleet management, quality control, and dispatch scheduling across 150+ mechanized mines, and (6) Environmental monitoring with IoT dust sensors, water quality probes, and noise monitors at mine boundaries meeting CPCB (Central Pollution Control Board) standards. Green mining initiatives include: (1) Mine reclamation and afforestation covering 32,000 hectares of abandoned mines (target: 50,000 hectares by 2030 under the Mine Closure Guidelines 2023), (2) Solar-powered mine operations (NMDC Bailadila 50 MW solar, Coal India 2 GW solar target by 2030), (3) Coal bed methane (CBM) extraction at Raniganj and Jharia coalfields (estimated 1,000 BCM reserves), (4) Sand stowing and backfilling technology for underground mines reducing surface subsidence, and (5) Electrification of mine haulage roads (trolley-assist electric dumpers reducing diesel consumption by 40%). India\u2019s mining companies adopting these technologies report: 30% improvement in dispatch reliability, 25% reduction in per-tonne logistics cost, 45% faster quality assessment, and 35% improvement in mine safety metrics (fatal accident rate reduced from 0.45 per million man-hours to 0.28). The Ministry of Mines has launched the National Mineral Exploration Trust (NMET) with \u20b94,000 crore funding for deep-seated mineral exploration using advanced geophysical surveys, airborne magnetic surveys, and AI-driven mineral prospectivity mapping.",
  },
];

export default function MiningLogisticsCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "mineral", label: "Mineral", options: MINERALS.map(m => ({ value: m, count: records.filter(r => r.mineral === m).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(r => r.mode === m).length })) },
    { key: "destination", label: "Destination", options: DESTINATIONS.map(d => ({ value: d, count: records.filter(r => r.destination === d).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.consignmentNo.toLowerCase().includes(q) && !r.mine.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q) && !r.mineral.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ShipmentRecord] as string));
  });

  return (
    <div className="mlc-root p-6 space-y-6">
      <PageHeader title="Mining Logistics Command" description="India mining operations logistics, ore/mineral dispatch from pit to plant, iron ore/coal/bauxite/copper/zinc shipment tracking, rail rake and dumper truck fleet management, quality sampling, and multi-modal transport for \u20b93.2 lakh crore mining sector" />
      <div className="mlc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`mlc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-indigo-700 text-white" : "text-gray-600 hover:bg-indigo-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="mlc-dash space-y-6">
          <div className="mlc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="mlc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 mlc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-indigo-700 mlc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 mlc-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="mlc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Mineral Output (Lakh T)</h3><BarChart data={monthlyOutput} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="ironOre" fill="#4338ca" radius={[4,4,0,0]} name="Iron Ore" /><Bar dataKey="coal" fill="#4f46e5" radius={[4,4,0,0]} name="Coal" /><Bar dataKey="bauxite" fill="#6366f1" radius={[4,4,0,0]} name="Bauxite" /><Bar dataKey="limestone" fill="#818cf8" radius={[4,4,0,0]} name="Limestone" /></BarChart></div>
            <div className="mlc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Mineral Production Distribution</h3><PieChart width={400} height={220}><Pie data={mineralDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{mineralDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="mlc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Mine Production Rate vs 90% Target (%)</h3><LineChart data={productionTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[70, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#4338ca" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="mlc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Mine Performance Score</h3><BarChart data={minePerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[60, 100]} /><Tooltip /><Bar dataKey="v" fill="#4f46e5" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="mlc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Mining Logistics", href: "#" }, { label: "Ore Shipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="mlc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Consignment,Mine,Mineral,Grade,Qty (MT),Fe %,Dest,Mode,Load Date,ETA,Transit (h),Status,Sample,Invoice,Demurrage,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Rejected by Plant" ? "mlc-row-critical bg-red-50" : r.status === "Quality Sample Pending" ? "mlc-row-warning bg-amber-50" : r.status === "In Transit" ? "mlc-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-indigo-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="mlc-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-700 text-white font-mono">{r.consignmentNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.mine}</td>
                <td className="px-3 py-2"><span className="mlc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.mineral}</span></td>
                <td className="px-3 py-2 text-xs font-mono">{r.grade}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.quantity.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{r.fePercent > 0 ? <span className="font-mono font-semibold text-indigo-600">{r.fePercent}%</span> : <span className="text-gray-400">\u2014</span>}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.destination}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.loadDate}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitHours > 48 ? "text-red-600" : r.transitHours > 18 ? "text-amber-600" : "text-green-600"}`}>{r.transitHours}h</span></td>
                <td className="px-3 py-2"><span className={`mlc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.sampleResult}</td>
                <td className="px-3 py-2 text-xs font-semibold text-indigo-700">{fmtVal(r.invoiceValue)}</td>
                <td className="px-3 py-2 text-xs"><span className={r.demurrage > 0 ? "text-red-600 font-semibold" : "text-gray-400"}>{r.demurrage > 0 ? fmtVal(r.demurrage) : "\u2014"}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="mlc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="mlc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Shipment Volume by Mine</h3><BarChart data={MINES.slice(0,6).map(m => ({ n: m.split(" ").pop() || m, v: +ri(45, 180, 105 + Math.random() * 50).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#4338ca" radius={[4,4,0,0]} name="Shipments" /></BarChart></div>
            <div className="mlc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Output by Mineral Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], iron: ri(180, 350, 260 + Math.sin(i*0.5)*50), coal: ri(350, 620, 480 + Math.cos(i*0.6)*80), bauxite: ri(60, 140, 95 + Math.sin(i*0.7)*25) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="iron" stackId="1" stroke="#4338ca" fill="#e0e7ff" name="Iron Ore" /><Area type="monotone" dataKey="coal" stackId="1" stroke="#4f46e5" fill="#c7d2fe" name="Coal" /><Area type="monotone" dataKey="bauxite" stackId="1" stroke="#6366f1" fill="#eef2ff" name="Bauxite" /></AreaChart></div>
          </div>
          <div className="mlc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Hours by Transport Mode</h3><BarChart data={[{n:"Rail Rake",v:42},{n:"Dumper Truck",v:16},{n:"Conveyor",v:3},{n:"Ship/Barge",v:72},{n:"Slurry Pipe",v:8},{n:"Aerial Rope",v:12}].map(d => ({...d, v: +ri(d.v-5, d.v+8, d.v + Math.random()*5).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#4f46e5" radius={[4,4,0,0]} name="Hours" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="mlc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="mlc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-indigo-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
