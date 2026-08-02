"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0369a1", "#0284c7", "#0ea5e9", "#38bdf8", "#075985", "#0c4a6e", "#7dd3fc", "#bae6fd"];
const TERMINALS = ["IWAI Varanasi Terminal", "IWAI Patna Terminal", "NW-1 Kolkata Terminal", "Brahmaputra Guwahati Jetty", "NW-2 Dhubri Terminal", "NW-4 Vijayawada Terminal", "NW-5 Mormugao Terminal", "Godavari Bhadrachalam Jetty"];
const CARGO_TYPES = ["Bulk Coal", "Fly Ash", "Food Grains", "Fertilizers", "Cement", "Steel Products", "Sand & Aggregate", "Project Cargo"];
const SHIP_STATUSES = ["Sailing", "Loading", "Unloading", "Berthed / Waiting", "Maintenance", "Delayed"];
const ROUTES = ["NW-1 Ganga", "NW-2 Brahmaputra", "NW-3 Barak", "NW-4 Krishna-Godavari", "NW-5 West Coast", "NW-16 Mandovi", "NW-97 Sundarbans", "NW-98 Brahmani"];
const VESSEL_TYPES = ["Barge (DB)", "Hopper Dredger", "Ro-Ro Ferry", "Push Tug + Barge", "Flat Bottom Cargo", "Survey Vessel", "Tank Barge", "Passenger Ferry"];
const TABS = ["Dashboard", "Voyage Registry", "Waterway Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Sailing": "blue", "Loading": "green", "Unloading": "green", "Berthed / Waiting": "slate", "Maintenance": "amber", "Delayed": "red" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyCargo = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], coal: ri(80, 180, 120 + Math.sin(i * 0.5) * 30), flyAsh: ri(50, 110, 75 + Math.cos(i * 0.6) * 18), grain: ri(40, 90, 62 + Math.sin(i * 0.7) * 14), fert: ri(30, 70, 48 + Math.cos(i * 0.8) * 12) }));
const cargoDist = [{ n: "Bulk Coal", v: 24 }, { n: "Fly Ash", v: 18 }, { n: "Food Grains", v: 16 }, { n: "Fertilizers", v: 14 }, { n: "Cement", v: 12 }, { n: "Steel Products", v: 8 }, { n: "Sand & Aggregate", v: 5 }, { n: "Project Cargo", v: 3 }];
const utilizationTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(52, 78, 64 + Math.sin(i * 0.4) * 8)).toFixed(1), target: 70.0 }));
const routePerf = ROUTES.slice(0, 6).map(r => ({ n: r.replace("NW-", "").replace(/\d+ /, ""), v: +ri(55, 88, 70 + Math.random() * 12).toFixed(0) }));

interface VoyageRecord { id: string; voyageNo: string; terminal: string; vessel: string; vesselType: string; cargo: string; quantity: number; unit: string; route: string; origin: string; destination: string; draft: number; eta: string; etd: string; transitHrs: number; status: string; cargoValue: number; remarks: string; }

const records: VoyageRecord[] = [
  { id: "RWL-0001", voyageNo: "VYG-2025/GW-0234", terminal: "IWAI Varanasi Terminal", vessel: "MV Ganga-Vikram", vesselType: "Push Tug + Barge", cargo: "Food Grains", quantity: 1200, unit: "MT", route: "NW-1 Ganga", origin: "Allahabad Haldia", destination: "Patna Terminal", draft: 2.1, eta: "2025-07-14", etd: "2025-07-10", transitHrs: 96, status: "Sailing", cargoValue: 4800000, remarks: "FCI wheat movement Allahabad to Patna - NW-1 Ganga waterway" },
  { id: "RWL-0002", voyageNo: "VYG-2025/GW-0235", terminal: "NW-1 Kolkata Terminal", vessel: "MV Ganga-Shakti", vesselType: "Flat Bottom Cargo", cargo: "Bulk Coal", quantity: 2500, unit: "MT", route: "NW-1 Ganga", origin: "Kolkata Port", destination: "Farakka NTPC", draft: 2.8, eta: "2025-07-12", etd: "2025-07-08", transitHrs: 72, status: "Unloading", cargoValue: 12500000, remarks: "Thermal coal for NTPC Farakka via Ganga waterway" },
  { id: "RWL-0003", voyageNo: "VYG-2025/BR-0089", terminal: "Brahmaputra Guwahati Jetty", vessel: "MV Brahmaputra-Setu", vesselType: "Push Tug + Barge", cargo: "Project Cargo", quantity: 350, unit: "MT", route: "NW-2 Brahmaputra", origin: "Dhubri Terminal", destination: "Guwahati ICDS", draft: 1.8, eta: "2025-07-11", etd: "2025-07-09", transitHrs: 48, status: "Delayed", cargoValue: 8750000, remarks: "Bridge construction material - delayed due to monsoon swelling" },
  { id: "RWL-0004", voyageNo: "VYG-2025/KG-0056", terminal: "NW-4 Vijayawada Terminal", vessel: "MV Krishna-Prabha", vesselType: "Barge (DB)", cargo: "Fertilizers", quantity: 800, unit: "MT", route: "NW-4 Krishna-Godavari", origin: "Kakinada Port", destination: "Vijayawada Depot", draft: 1.5, eta: "2025-07-13", etd: "2025-07-11", transitHrs: 36, status: "Loading", cargoValue: 3600000, remarks: "IFFCO urea movement for Kharif season distribution" },
  { id: "RWL-0005", voyageNo: "VYG-2025/GW-0236", terminal: "IWAI Patna Terminal", vessel: "MV Son-Pushpa", vesselType: "Flat Bottom Cargo", cargo: "Fly Ash", quantity: 1800, unit: "MT", route: "NW-1 Ganga", origin: "Barh NTPC", destination: "Patna Cement Works", draft: 2.3, eta: "2025-07-15", etd: "2025-07-12", transitHrs: 48, status: "Sailing", cargoValue: 900000, remarks: "Fly ash from NTPC Barh for cement blending plant" },
  { id: "RWL-0006", voyageNo: "VYG-2025/WC-0034", terminal: "NW-5 Mormugao Terminal", vessel: "MV Mandovi-Express", vesselType: "Ro-Ro Ferry", cargo: "Steel Products", quantity: 450, unit: "MT", route: "NW-5 West Coast", origin: "Mormugao Port", destination: "Panaji Depot", draft: 2.5, eta: "2025-07-12", etd: "2025-07-11", transitHrs: 12, status: "Unloading", cargoValue: 22500000, remarks: "TMT bars and HR coils coastal movement Goa" },
  { id: "RWL-0007", voyageNo: "VYG-2025/BR-0090", terminal: "NW-2 Dhubri Terminal", vessel: "MV Luit-Abhijit", vesselType: "Push Tug + Barge", cargo: "Sand & Aggregate", quantity: 5000, unit: "MT", route: "NW-2 Brahmaputra", origin: "Dhubri Mining", destination: "Guwahati NH Project", draft: 2.0, eta: "2025-07-14", etd: "2025-07-10", transitHrs: 72, status: "Sailing", cargoValue: 2500000, remarks: "River sand for NH-37 four-lane construction project" },
  { id: "RWL-0008", voyageNo: "VYG-2025/GW-0237", terminal: "IWAI Varanasi Terminal", vessel: "MV Varuna-Nidhi", vesselType: "Barge (DB)", cargo: "Cement", quantity: 600, unit: "MT", route: "NW-1 Ganga", origin: "Varanasi Terminal", destination: "Chandauli Works", draft: 1.6, eta: "2025-07-13", etd: "2025-07-12", transitHrs: 18, status: "Loading", cargoValue: 3000000, remarks: "Ambuja cement Varanasi to Chandauli - short haul" },
  { id: "RWL-0009", voyageNo: "VYG-2025/GB-0023", terminal: "Godavari Bhadrachalam Jetty", vessel: "MV Godavari-Krishna", vesselType: "Flat Bottom Cargo", cargo: "Food Grains", quantity: 900, unit: "MT", route: "NW-4 Krishna-Godavari", origin: "Rajahmundry FCI", destination: "Bhadrachalam Depot", draft: 1.4, eta: "2025-07-15", etd: "2025-07-13", transitHrs: 30, status: "Berthed / Waiting", cargoValue: 3600000, remarks: "FCI rice movement for tribal area PDS supply" },
  { id: "RWL-0010", voyageNo: "VYG-2025/GW-0238", terminal: "NW-1 Kolkata Terminal", vessel: "MV Hooghly-Gati", vesselType: "Push Tug + Barge", cargo: "Bulk Coal", quantity: 3200, unit: "MT", route: "NW-1 Ganga", origin: "Haldia Port", destination: "Panki NTPC Kanpur", draft: 3.0, eta: "2025-07-18", etd: "2025-07-11", transitHrs: 144, status: "Sailing", cargoValue: 16000000, remarks: "Imported thermal coal for NTPC Panki - long haul Ganga" },
  { id: "RWL-0011", voyageNo: "VYG-2025/BR-0091", terminal: "Brahmaputra Guwahati Jetty", vessel: "MV Dibru-Sneha", vesselType: "Barge (DB)", cargo: "Fertilizers", quantity: 650, unit: "MT", route: "NW-2 Brahmaputra", origin: "Guwahati IFFCO", destination: "Jorhat IFFCO", draft: 1.3, eta: "2025-07-14", etd: "2025-07-13", transitHrs: 18, status: "Maintenance", cargoValue: 2925000, remarks: "Barge dry docking for hull repair - cargo rescheduled" },
  { id: "RWL-0012", voyageNo: "VYG-2025/WC-0035", terminal: "NW-5 Mormugao Terminal", vessel: "MV Zuari-Tara", vesselType: "Flat Bottom Cargo", cargo: "Fly Ash", quantity: 1200, unit: "MT", route: "NW-5 West Coast", origin: "Tata Power Trombay", destination: "Mormugao Cement", draft: 2.4, eta: "2025-07-16", etd: "2025-07-12", transitHrs: 72, status: "Sailing", cargoValue: 600000, remarks: "Fly ash coastal transport Mumbai to Goa for cement" },
  { id: "RWL-0013", voyageNo: "VYG-2025/GW-0239", terminal: "IWAI Patna Terminal", vessel: "MV Gandak-Dhan", vesselType: "Push Tug + Barge", cargo: "Cement", quantity: 1000, unit: "MT", route: "NW-1 Ganga", origin: "Patna ACC Plant", destination: "Buxar Works", draft: 1.9, eta: "2025-07-14", etd: "2025-07-13", transitHrs: 20, status: "Unloading", cargoValue: 5000000, remarks: "ACC cement Patna to Buxar bridge construction project" },
  { id: "RWL-0014", voyageNo: "VYG-2025/KG-0057", terminal: "NW-4 Vijayawada Terminal", vessel: "MV Penna-Bhargavi", vesselType: "Ro-Ro Ferry", cargo: "Steel Products", quantity: 280, unit: "MT", route: "NW-4 Krishna-Godavari", origin: "Vizag Steel Plant", destination: "Vijayawada Yard", draft: 1.7, eta: "2025-07-15", etd: "2025-07-14", transitHrs: 24, status: "Loading", cargoValue: 14000000, remarks: "RINL Vizag steel Vijayawada - AP irrigation project material" },
];

const sailingCount = records.filter(r => r.status === "Sailing").length;
const portCount = records.filter(r => r.status === "Loading" || r.status === "Unloading" || r.status === "Berthed / Waiting").length;
const issueCount = records.filter(r => r.status === "Delayed" || r.status === "Maintenance").length;
const totalCargo = records.reduce((s, r) => s + r.quantity, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

const kpis = [
  { l: "Sailing", v: sailingCount, s: "active voyages" },
  { l: "At Port", v: portCount, s: "loading/unloading/berthed" },
  { l: "Delayed / Maintenance", v: issueCount, s: "needs attention" },
  { l: "Total Cargo Moved", v: `${(totalCargo / 1000).toFixed(1)}K MT`, s: "across all waterways" },
];

const INSIGHTS = [
  {
    t: "India Inland Waterways: 20,000 km Navigable Waterways and National Waterway Grid",
    c: "India has approximately 20,000 km of navigable inland waterways comprising rivers, canals, backwaters, and creeks, of which the Inland Waterways Authority of India (IWAI) under the Ministry of Ports, Shipping, and Waterways has declared 111 National Waterways (NWs) for development. Currently, 13 NWs are operational for cargo and passenger movement, with NW-1 (Ganga-Bhagirathi-Hooghly, 1,620 km from Haldia to Allahabad), NW-2 (Brahmaputra, 891 km from Dhubri to Sadiya), and NW-3 (West Coast Canal, 205 km from Kollam to Kottapuram) being the most commercially active. India\u2019s inland water transport (IWT) handles approximately 60-80 million tonnes (MT) of cargo annually (2024-25), compared to 1,100 MT by rail and 2,500 MT by road, representing only 2-3% of total freight movement. The National Waterway Act 2016 provides the regulatory framework, while the Jal Marg Vikas Project (JMVP) funded with a \u20b95,369 crore World Bank loan is developing NW-1 for year-round navigation with 2,000-tonne barge capacity, 3 multimodal terminals (Varanasi, Sahibganj, Haldia), and 8 Ro-Ro ferry services. India\u2019s IWT target under the Maritime India Vision 2030 is 200 MT cargo by 2030 (from the current 60-80 MT), requiring: (1) dredging and channel maintenance on 20,000 km, (2) construction of 30 new terminals, (3) acquisition of 500 modern barges (2,000-3,000 DWT each), and (4) integration with rail and road networks at 50 multimodal junctions. The cost advantage of IWT is significant: \u20b91.00 per tonne-km by waterway versus \u20b92.50 by rail and \u20b94.50 by road, representing a 60-75% logistics cost savings. Major cargo types on Indian waterways include: coal (40%), fly ash (20%), food grains and fertilizers (20%), construction materials (10%), and project cargo (5%). The Ganga waterway alone has the potential to handle 45-50 MT annually at full development.",
  },
  {
    t: "Vessel Fleet and Terminal Infrastructure: Barges, Tugs, and Multimodal Hubs",
    c: "India\u2019s inland waterway vessel fleet comprises approximately 800 powered vessels and 2,500 non-powered barges, with the majority being small (200-500 DWT) flat-bottom barges. IWAI\u2019s modernization program has introduced: (1) Push-tug and barge systems (2,000-3,000 DWT per convoy, 2 tugs pushing 4-6 barges), (2) Ro-Ro ferries (100-200 vehicles per trip), (3) Tank barges for liquid cargo (1,500-2,000 DWT), and (4) Hopper dredgers for channel maintenance. Key vessel operators include: (1) IWAI-owned fleet (50 vessels), (2) Inland Waterways Transport (IWAI subsidiary, 30 vessels), (3) Central Inland Water Transport Corporation (CIWTC, 40 vessels), (4) Shipping Corporation of India (SCI, waterway division), and (5) Private operators (200+ vessels). Terminal infrastructure includes: (1) Multimodal Terminals: Varanasi (Phase I operational, 1.5 MTPA), Sahibganj (under construction, 3.0 MTPA), and Haldia (upgraded, 5.0 MTPA), (2) Intermodal Terminals: Patna, Bhagalpur, Kolkata, Guwahati, and Vijayawada, (3) Ro-Ro terminals: 8 operational across NW-1, NW-2, and NW-4, and (4) Floating terminals for seasonal waterways. India\u2019s waterway terminal investment under JMVP and Sagarmala is \u20b94,000 crore, with an additional \u20b92,000 crore for vessel acquisition. The draft limitations on Indian waterways (1.5-3.0 meters versus 5-7 meters on European waterways like Rhine and Danube) restrict barge capacity to 500-2,000 DWT versus 5,000-9,000 DWT on European routes. India\u2019s waterway cargo per km cost is \u20b91.0 (versus \u20b90.30 in Europe and \u20b90.15 in China Yangtze), driven by: shallow drafts limiting vessel size, seasonal navigability (monsoon flooding and dry season), limited dredging infrastructure, and fragmented terminal ownership. Modernization targets include: 12-meter channel depth on NW-1 (enabling 3,000 DWT barges), 24/7 navigation with GPS-aided river information systems, and automated container handling at 5 major terminals by 2028.",
  },
  {
    t: "Ganga Waterway (NW-1): India\u2019s Longest Commercial Waterway Corridor",
    c: "National Waterway-1 (Ganga-Bhagirathi-Hooghly) is India\u2019s most commercially significant inland waterway, stretching 1,620 km from Haldia (Kolkata) to Allahabad (Prayagraj) through the states of West Bengal (220 km), Jharkhand (100 km), Bihar (620 km), and Uttar Pradesh (680 km). The Jal Marg Vikas Project (JMVP) Phase I with World Bank funding (\u20b95,369 crore) has achieved: (1) Channel development to 2.5-3.0 meter Least Available Depth (LAD) for 1,400 km, (2) 24-hour navigational aids (buoys, beacons, night navigation lights on 600 km), (3) 3 multimodal terminals: Varanasi (inaugurated 2018, 1.5 MTPA, rail-road-water connectivity), Sahibganj (under construction, 3.0 MTPA), and Haldia (upgraded, 5.0 MTPA), (4) 8 Ro-Ro ferry services (Varanasi-Ghazipur, Patna-Hajipur, etc.), and (5) River Information System (RIS) with AIS tracking and real-time depth monitoring. NW-1 cargo traffic has grown from 1.5 MT (2016-17) to 18 MT (2023-24), with a target of 45 MT by 2027. Major cargo flows on NW-1 include: (1) Coal from Haldia to NTPC power plants at Farakka, Panki, and Barh (45% of NW-1 cargo), (2) Fly ash from NTPC plants to cement factories (20%), (3) Food grains from FCI godowns to eastern UP and Bihar distribution (15%), (4) Construction materials (sand, aggregate, cement) for infrastructure projects along Ganga (10%), and (5) Project cargo for bridge, highway, and railway construction (5%). The seasonal challenges include: (1) Monsoon flooding (July-September): increased draft but navigation hazards from debris, (2) Dry season (April-June): reduced draft from 3.0m to 1.5m, limiting barge capacity by 50%, and (3) Winter fog (December-January): reduced visibility requiring 12-hour navigation windows. NW-1\u2019s Year-Round Navigation potential will be fully realized by 2027 with all-weather dredging maintaining 3.0m LAD throughout the year.",
  },
  {
    t: "Brahmaputra Waterway (NW-2): Northeast India\u2019s Critical Cargo Lifeline",
    c: "National Waterway-2 (Brahmaputra) stretches 891 km from Dhubri (Assam-Bangladesh border) to Sadiya (Arunachal Pradesh border), serving as the primary cargo lifeline for India\u2019s northeastern states where road and rail connectivity is limited by terrain, landslides, and the Siliguri Corridor bottleneck. NW-2 handles approximately 4-6 MT of cargo annually, with: (1) Sand and aggregate (40%, for NH and railway construction), (2) Project cargo (25%, bridge materials, oil pipeline equipment, hydro-power turbines), (3) Food grains and PDS supplies (15%, for remote tribal areas), (4) Fertilizers (10%, for tea gardens and agricultural areas), and (5) Petroleum products (10%, for upstream depots). Key terminals on NW-2 include: Dhubri (gateway terminal, customs, Bangladesh border trade), Guwahati (regional hub, 1.0 MTPA), Tezpur, Jorhat, and Dibrugarh (easternmost terminal). NW-2\u2019s unique challenges include: (1) Massive monsoon flooding with water levels rising 8-12 meters, washing away channel markers, (2) Shifting sandbars and braided channel morphology requiring constant hydrographic surveying, (3) Navigation window limited to 8 months (October-May, closed during peak monsoon June-September), (4) Shallow drafts (1.0-1.8 meters) limiting barge size to 300-500 DWT, and (5) Security concerns in Assam border areas requiring vessel escorts. The Brahmaputra Board and IWAI have initiated: (1) Channel stabilization with river training works (spurs, guide bunds), (2) GPS-based navigation with real-time depth updates, (3) 6 new floating terminals at Dibrugarh, Neamati, Tezpur, and Jogighopa, and (4) Ro-Ro services connecting Dhubri to Hatsingimari (reducing 6-hour road detour to 30-minute crossing). India\u2019s Act East Policy relies on NW-2 for connecting to Bangladesh (Protocol on Inland Water Transit and Trade, 8 routes, 2,000+ vessels per year), Myanmar (Kaladan project), and future connectivity to Southeast Asia via the India-Myanmar-Thailand Trilateral Highway. NW-2 cargo target is 15 MT by 2030 with year-round navigation through dredging and terminal expansion.",
  },
];

export default function RiverWaterwayLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Voyage Status", options: SHIP_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "cargo", label: "Cargo Type", options: CARGO_TYPES.map(c => ({ value: c, count: records.filter(r => r.cargo === c).length })) },
    { key: "route", label: "Route", options: ROUTES.map(route => ({ value: route, count: records.filter(rec => rec.route === route).length })) },
    { key: "vesselType", label: "Vessel Type", options: VESSEL_TYPES.map(v => ({ value: v, count: records.filter(r => r.vesselType === v).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.voyageNo.toLowerCase().includes(q) && !r.vessel.toLowerCase().includes(q) && !r.cargo.toLowerCase().includes(q) && !r.origin.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof VoyageRecord] as string));
  });

  return (
    <div className="rwl-root p-6 space-y-6">
      <PageHeader title="River Waterway Logistics" description="India inland waterways cargo operations, NW-1 Ganga NW-2 Brahmaputra barge fleet management, IWAI terminal handling, coal fly ash grain fertilizer transport, and Jal Marg Vikas Project multimodal connectivity" />
      <div className="rwl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`rwl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-sky-800 text-white" : "text-gray-600 hover:bg-sky-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="rwl-dash space-y-6">
          <div className="rwl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="rwl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 rwl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-sky-800 rwl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 rwl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="rwl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Cargo by Type (KT)</h3><BarChart data={monthlyCargo} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="coal" fill="#0369a1" radius={[4,4,0,0]} name="Coal" /><Bar dataKey="flyAsh" fill="#0284c7" radius={[4,4,0,0]} name="Fly Ash" /><Bar dataKey="grain" fill="#0ea5e9" radius={[4,4,0,0]} name="Grains" /><Bar dataKey="fert" fill="#38bdf8" radius={[4,4,0,0]} name="Fertilizers" /></BarChart></div>
            <div className="rwl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cargo Type Distribution</h3><PieChart width={400} height={220}><Pie data={cargoDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{cargoDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="rwl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Waterway Utilization (%) vs 70% Target</h3><LineChart data={utilizationTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[40, 90]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0369a1" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="rwl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Route Performance Score</h3><BarChart data={routePerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[50, 95]} /><Tooltip /><Bar dataKey="v" fill="#0284c7" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="rwl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "River Waterway", href: "#" }, { label: "Voyage Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="rwl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Voyage No,Terminal,Vessel,Vessel Type,Cargo,Qty (MT),Route,Origin,Destination,Draft (m),ETD,ETA,Transit (h),Status,Value,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Delayed" ? "rwl-row-critical bg-red-50" : r.status === "Maintenance" ? "rwl-row-warning bg-amber-50" : r.status === "Sailing" ? "rwl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-sky-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="rwl-badge inline-block px-2 py-0.5 rounded text-xs bg-sky-800 text-white font-mono">{r.voyageNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.terminal}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.vessel}</td>
                <td className="px-3 py-2 text-xs">{r.vesselType}</td>
                <td className="px-3 py-2"><span className="rwl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.cargo}</span></td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.quantity.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{r.route}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.destination}</td>
                <td className="px-3 py-2 text-xs">{r.draft}m</td>
                <td className="px-3 py-2 text-xs">{r.etd}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitHrs > 96 ? "text-red-600" : r.transitHrs > 48 ? "text-amber-600" : "text-green-600"}`}>{r.transitHrs}h</span></td>
                <td className="px-3 py-2"><span className={`rwl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-sky-800">{fmtVal(r.cargoValue)}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="rwl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="rwl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cargo Volume by Terminal</h3><BarChart data={TERMINALS.slice(0,6).map(t => ({ n: t.replace("IWAI ","").split(" ")[0].replace("NW-","NW"), v: +ri(8, 42, 22 + Math.random() * 14).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0369a1" radius={[4,4,0,0]} name="Cargo (KT)" /></BarChart></div>
            <div className="rwl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cargo by Route Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], nw1: ri(18, 38, 26 + Math.sin(i*0.5)*5), nw2: ri(4, 10, 6.5 + Math.cos(i*0.6)*1.5), nw4: ri(3, 8, 5 + Math.sin(i*0.7)*1.2) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="nw1" stackId="1" stroke="#0369a1" fill="#e0f2fe" name="NW-1 Ganga" /><Area type="monotone" dataKey="nw2" stackId="1" stroke="#0284c7" fill="#bae6fd" name="NW-2 Brahmaputra" /><Area type="monotone" dataKey="nw4" stackId="1" stroke="#0ea5e9" fill="#f0f9ff" name="NW-4 Krishna" /></AreaChart></div>
          </div>
          <div className="rwl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Hours by Vessel Type</h3><BarChart data={[{n:"Push Tug+Barge",v:72},{n:"Flat Bottom",v:60},{n:"Barge DB",v:48},{n:"Ro-Ro Ferry",v:18},{n:"Tank Barge",v:65},{n:"Survey Vessel",v:36}].map(d => ({...d, v: +ri(d.v-8, d.v+12, d.v + Math.random()*8).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0284c7" radius={[4,4,0,0]} name="Hours" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="rwl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="rwl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-sky-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
