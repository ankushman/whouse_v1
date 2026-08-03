"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#4a1942", "#6b21a8", "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#5b21b6"];
const OPERATORS = ["L&T IDPL Mumbai", "Afcons Infrastructure Mumbai", "Dilip Buildcon Indore", "Gammon India Mumbai", "Simplex Infra Kolkata", "NCC Limited Hyderabad", "SP Singla Constructions Delhi", "ITD Cementation Mumbai"];
const CATEGORIES = ["4-Lane Cloverleaf Interchange 120m", "6-Lane Rotary Interchange 200m", "8-Lane Spaghetti Junction 350m", "Grade Separator 3-Level 180m", "Flyover Viaduct 2.4km 6-Lane", "Trumpet Interchange 150m", "Diamond Interchange with BRTS", "Partial Cloverleaf Upgrade 500m"];
const SHIPMENT_STATUSES = ["Pier Foundation Casting", "Girder Erection Span", "Deck Slab Casting Active", "Asphalt Surfacing Wearing", "Signage Crash Barrier Install", "Traffic Diversion Open"];
const ZONES = ["Delhi NCR Dwarka Gurgaon", "Mumbai WEH Andheri Goregaon", "Bangalore Silk Board KR Puram", "Hyderabad LB Nagar Hitec City", "Chennai Anna Nagar Porur", "Kolkata Park Street Maa Flyover", "Pune Shivajinagar Wakad", "Ahmedabad SG Highway Vadodara"];
const MODES = ["Flatbed Trailer 40T Girder Segment", "Heavy Haul 80T Pier Cap Beam", "Crane Truck 35T Precast Panel", "Rail Wagon Steel Box Girder", "Barge Coastal Concrete Segment", "Multi-Axle 60T Crane Boom Section"];
const TABS = ["Dashboard", "Registry", "Interchange Analytics", "Insights"];

const statusColor: Record<string, string> = { "Pier Foundation Casting": "orange", "Girder Erection Span": "orange", "Deck Slab Casting Active": "blue", "Asphalt Surfacing Wearing": "blue", "Signage Crash Barrier Install": "blue", "Traffic Diversion Open": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyProgress = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], pier: +(15 + Math.sin(i * 0.5) * 8).toFixed(1), girder: +(22 + Math.cos(i * 0.6) * 10).toFixed(1), deck: +(18 + Math.sin(i * 0.4) * 7).toFixed(1), surfacing: +(10 + Math.cos(i * 0.7) * 5).toFixed(1) }));
const typeDist = [{ n: "Cloverleaf", v: 22 }, { n: "Rotary", v: 18 }, { n: "Spaghetti", v: 12 }, { n: "Grade Separator", v: 20 }, { n: "Flyover Viaduct", v: 18 }, { n: "Trumpet", v: 5 }, { n: "Diamond BRTS", v: 3 }, { n: "Partial Upgrade", v: 2 }];
const costPerLaneKm = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], delhi: +(85 + Math.sin(i * 0.4) * 15).toFixed(0), mumbai: +(120 + Math.cos(i * 0.5) * 20).toFixed(0), bangalore: +(95 + Math.sin(i * 0.6) * 12).toFixed(0) }));
const cityLength = [
  { city: "Delhi", km: 42 },
  { city: "Mumbai", km: 38 },
  { city: "Bangalore", km: 35 },
  { city: "Hyderabad", km: 28 },
  { city: "Chennai", km: 22 },
  { city: "Kolkata", km: 18 },
  { city: "Pune", km: 15 },
  { city: "Ahmedabad", km: 12 }
];

const INSIGHTS = [
  { t: "India\u2019s Urban Flyover Network: 3,500km of Elevated Roads and Interchanges", c: "India has constructed over 3,500km of urban flyovers, elevated corridors, and grade separators across its metropolitan cities in the past two decades. Delhi NCR leads with approximately 650km of elevated road infrastructure including the signature Signature Bridge (154m span), Yamuna elevated corridor, and 42 major flyovers. Mumbai\u2019s Western and Eastern Express Highways feature over 35 flyovers spanning 380km of elevated sections, while Bangalore\u2019s Silk Board flyover (2.4km six-lane elevated) and KR Puram cloverleaf interchange represent \u20b92,800 crore in infrastructure investment. The Ministry of Road Transport and Highways (MoRTH) has allocated \u20b91.5 lakh crore under Bharatmala Pariyojana Phase-II for urban interchange construction and flyover expansion across 100+ cities. Smart Cities Mission has further funded 200+ grade separator and interchange projects in tier-2 cities." },
  { t: "Cloverleaf vs Rotary Interchange: Traffic Engineering for Indian Urban Junctions", c: "Interchange design selection in India depends on traffic volume, land availability, and turning movement patterns. Cloverleaf interchanges (four ramp loops connecting all turning movements) require 120-200m diameter footprint and serve daily traffic volumes of 50,000-1,00,000 vehicles, making them ideal for Delhi NCR and Mumbai\u2019s high-volume junctions where land acquisition budgets exceed \u20b9500 crore per interchange. Rotary interchanges with signalized or unsignalized central islands handle 30,000-60,000 vehicles per day at lower construction costs (\u20b9200-350 crore) but cause weaving conflicts at higher volumes. Spaghetti junctions (multi-level free-flow interchanges with 3-4 stacked levels) like Bangalore\u2019s proposed Nice Road junction handle 1,00,000+ vehicles but cost \u20b9800-1,200 crore with 5-7 year construction timelines. India\u2019s IRC 92-2019 code governs interchange geometric design standards including turning radii (25-60m), gradient (3-5%), and lane width (3.5m)." },
  { t: "Segmental Box Girder Construction: Precast Launching for Long-Span Flyovers", c: "Segmental box girder construction has become the dominant technique for long-span urban flyovers in India due to minimal traffic disruption during construction. Indian flyover projects use both precast segmental construction (segments cast at casting yards, transported to site, joined by epoxy and post-tensioned) and cast-in-place segmental construction (balanced cantilever method). Precast segments typically measure 2.5-3.5m long, 12-25m wide, and weigh 40-80 tonnes, transported by multi-axle trailers from casting yards located 10-30km from site. Notable projects include Bangalore Metro\u2019s elevated viaduct (42km, 1,200+ segments), Mumbai Coastal Road (10.58km, 500+ segments), and Delhi-Meerut Expressway elevated section (14km). The span-by-span method using launching gantries is preferred for viaduct sections with typical spans of 35-45m, while the balanced cantilever method handles navigation spans of 60-120m over rivers and railway lines." },
  { t: "Flyover Maintenance and Lifecycle: Expansion Joints Bearing Replacement", c: "India\u2019s aging flyover infrastructure faces significant maintenance challenges with over 40% of flyovers in Delhi, Mumbai, and Bangalore requiring major rehabilitation or structural retrofitting within the first 15-20 years of service life. Common issues include expansion joint failure (Modular expansion joints have 10-15 year service life vs design life of 25 years), bearing deterioration (elastomeric pads cracking under overloading), pot bearing leakage, and concrete deck cracking from thermal cycling and de-icing salt exposure. The Indian Road Congress IRC SP-83-2018 provides guidelines for inspection and maintenance of bridges and flyovers including biennial structural health monitoring. Delhi PWD maintains over 65 flyovers with an annual maintenance budget of \u20b9200 crore, while BMC Mumbai allocates \u20b9150 crore annually for flyover repairs. Structural health monitoring systems using fiber optic sensors, accelerometers, and drone-based visual inspection are being adopted by NHAI for critical flyovers on national highway corridors." }
];

interface FlyoverRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; lengthM: number; lanes: number; spansCount: number; designSpeed: number; loadClass: string; origin: string; project: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; girderType: string; status: string; remarks: string; }

const records: FlyoverRecord[] = [
  { id: "FOI-0001", batchNo: "LNT/MUM/2025/CL-0012", operator: "L&T IDPL Mumbai", zone: "Mumbai WEH Andheri Goregaon", category: "4-Lane Cloverleaf Interchange 120m", description: "120m four-lane cloverleaf interchange at WEH Andheri-Goregaon junction with 8 ramp loops and 6 precast girder spans for MMRDA traffic decongestion", lengthM: 120, lanes: 4, spansCount: 6, designSpeed: 60, loadClass: "IRC 70R Standard", origin: "L&T Casting Yard Kalyan MH", project: "WEH Andheri-Goregaon Interchange", state: "Maharashtra", mode: "Flatbed Trailer 40T Girder Segment", prodDate: "2025-01-10", shipDate: "2025-03-18", transitDays: 2, contractValue: 380000000, girderType: "Precast I-Girder 35m", status: "Traffic Diversion Open", remarks: "120m cloverleaf L&T Andheri Goregaon traffic open" },
  { id: "FOI-0002", batchNo: "AFC/MUM/2025/RT-0025", operator: "Afcons Infrastructure Mumbai", zone: "Delhi NCR Dwarka Gurgaon", category: "6-Lane Rotary Interchange 200m", description: "200m six-lane rotary interchange at Dwarka underpass junction with central island 40m diameter and 4 approach spans for NHAI smart city corridor", lengthM: 200, lanes: 6, spansCount: 8, designSpeed: 50, loadClass: "IRC 70R Heavy", origin: "Afcons Yard Navi Mumbai MH", project: "Dwarka Rotary Interchange", state: "Delhi", mode: "Heavy Haul 80T Pier Cap Beam", prodDate: "2025-02-15", shipDate: "2025-05-22", transitDays: 5, contractValue: 520000000, girderType: "Box Girder Continuous 40m", status: "Deck Slab Casting Active", remarks: "200m rotary interchange Afcons Dwarka deck slab casting" },
  { id: "FOI-0003", batchNo: "DBC/IDR/2025/SP-0038", operator: "Dilip Buildcon Indore", zone: "Bangalore Silk Board KR Puram", category: "8-Lane Spaghetti Junction 350m", description: "350m eight-lane spaghetti junction at KR Puram signal-free corridor with 3-level flyover, underpass, and 6 directional ramp connections", lengthM: 350, lanes: 8, spansCount: 14, designSpeed: 60, loadClass: "IRC 70R Extra Heavy", origin: "DBC Casting Yard Indore MP", project: "KR Puram Spaghetti Junction", state: "Karnataka", mode: "Multi-Axle 60T Crane Boom Section", prodDate: "2024-11-05", shipDate: "2025-03-20", transitDays: 8, contractValue: 950000000, girderType: "Steel Box Girder 45m", status: "Girder Erection Span", remarks: "350m spaghetti junction DBC KR Puram girder erection" },
  { id: "FOI-0004", batchNo: "GAM/MUM/2025/GS-0042", operator: "Gammon India Mumbai", zone: "Hyderabad LB Nagar Hitec City", category: "Grade Separator 3-Level 180m", description: "180m three-level grade separator at LB Nagar junction with elevated U-turn, underpass subway, and ground-level signal-free flow for Hyderabad METRO", lengthM: 180, lanes: 6, spansCount: 10, designSpeed: 50, loadClass: "IRC 70R Standard", origin: "Gammon Casting Yard Pune MH", project: "LB Nagar Grade Separator", state: "Telangana", mode: "Crane Truck 35T Precast Panel", prodDate: "2025-03-01", shipDate: "2025-06-15", transitDays: 6, contractValue: 420000000, girderType: "Precast U-Girder 30m", status: "Asphalt Surfacing Wearing", remarks: "180m grade separator Gammon LB Nagar surfacing active" },
  { id: "FOI-0005", batchNo: "SIM/KOL/2025/FV-0055", operator: "Simplex Infra Kolkata", zone: "Chennai Anna Nagar Porur", category: "Flyover Viaduct 2.4km 6-Lane", description: "2.4km six-lane elevated flyover viaduct at Anna Nagar-Porur corridor with 45 precast spans and 3 interchange ramps for Chennai CMDA", lengthM: 2400, lanes: 6, spansCount: 45, designSpeed: 60, loadClass: "IRC 70R Heavy", origin: "Simplex Yard Chennai TN", project: "Anna Nagar Porur Flyover", state: "Tamil Nadu", mode: "Rail Wagon Steel Box Girder", prodDate: "2025-02-20", shipDate: "2025-05-10", transitDays: 1, contractValue: 1200000000, girderType: "Steel Composite 40m", status: "Pier Foundation Casting", remarks: "2.4km viaduct Simplex Anna Nagar pier foundation" },
  { id: "FOI-0006", batchNo: "NCC/HYD/2025/TR-0068", operator: "NCC Limited Hyderabad", zone: "Kolkata Park Street Maa Flyover", category: "Trumpet Interchange 150m", description: "150m trumpet interchange at Park Street-Maidan junction with single-loop ramp connecting eastbound and westbound carriageways for Kolkata KD", lengthM: 150, lanes: 4, spansCount: 7, designSpeed: 50, loadClass: "IRC 70R Standard", origin: "NCC Casting Yard Hyderabad TG", project: "Park Street Trumpet Interchange", state: "West Bengal", mode: "Flatbed Trailer 40T Girder Segment", prodDate: "2025-04-15", shipDate: "2025-07-25", transitDays: 10, contractValue: 290000000, girderType: "Precast I-Girder 35m", status: "Girder Erection Span", remarks: "150m trumpet interchange NCC Kolkata Park Street girder" },
  { id: "FOI-0007", batchNo: "SPS/DEL/2025/DB-0071", operator: "SP Singla Constructions Delhi", zone: "Pune Shivajinagar Wakad", category: "Diamond Interchange with BRTS", description: "200m diamond interchange with BRTS dedicated bus lanes at Shivajinagar-Wakad corridor with precast ramp girders and metro viaduct integration", lengthM: 200, lanes: 8, spansCount: 9, designSpeed: 60, loadClass: "IRC 70R Extra Heavy", origin: "SPS Casting Yard Delhi HR", project: "Shivajinagar Diamond BRTS Interchange", state: "Maharashtra", mode: "Barge Coastal Concrete Segment", prodDate: "2025-03-15", shipDate: "2025-05-28", transitDays: 7, contractValue: 480000000, girderType: "Precast Box 38m", status: "Deck Slab Casting Active", remarks: "200m diamond BRTS SPS Pune Shivajinagar deck casting" },
  { id: "FOI-0008", batchNo: "ITD/MUM/2025/PC-0084", operator: "ITD Cementation Mumbai", zone: "Ahmedabad SG Highway Vadodara", category: "Partial Cloverleaf Upgrade 500m", description: "500m partial cloverleaf upgrade of existing SG Highway interchange with 2 additional ramp loops, widening from 4 to 6 lanes, and new signal-free U-turn", lengthM: 500, lanes: 6, spansCount: 18, designSpeed: 60, loadClass: "IRC 70R Heavy", origin: "ITD Yard Vadodara GJ", project: "SG Highway Cloverleaf Upgrade", state: "Gujarat", mode: "Multi-Axle 60T Crane Boom Section", prodDate: "2024-09-10", shipDate: "2025-02-15", transitDays: 3, contractValue: 350000000, girderType: "Composite Steel-Concrete 42m", status: "Asphalt Surfacing Wearing", remarks: "500m cloverleaf upgrade ITD SG Highway surfacing active" },
  { id: "FOI-0009", batchNo: "LNT/MUM/2025/CL-0097", operator: "L&T IDPL Mumbai", zone: "Mumbai WEH Andheri Goregaon", category: "4-Lane Cloverleaf Interchange 120m", description: "120m four-lane cloverleaf interchange at WEH Goregaon-Vikhroli link road with 8 precast girder approach spans and crash barrier system", lengthM: 120, lanes: 4, spansCount: 8, designSpeed: 60, loadClass: "IRC 70R Standard", origin: "L&T Casting Yard Thane MH", project: "WEH Goregaon-Vikhroli Cloverleaf", state: "Maharashtra", mode: "Flatbed Trailer 40T Girder Segment", prodDate: "2025-01-20", shipDate: "2025-04-05", transitDays: 1, contractValue: 360000000, girderType: "Precast I-Girder 35m", status: "Traffic Diversion Open", remarks: "120m cloverleaf L&T Goregaon Vikhroli traffic open" },
  { id: "FOI-0010", batchNo: "AFC/MUM/2025/RT-0108", operator: "Afcons Infrastructure Mumbai", zone: "Delhi NCR Dwarka Gurgaon", category: "6-Lane Rotary Interchange 200m", description: "200m six-lane rotary interchange at Gurgaon Sector 29 junction with elevated U-turn loop and BRTS bus bay integration for NH-48 corridor", lengthM: 200, lanes: 6, spansCount: 9, designSpeed: 50, loadClass: "IRC 70R Heavy", origin: "Afcons Yard Faridabad HR", project: "Gurgaon Sec-29 Rotary Interchange", state: "Delhi", mode: "Heavy Haul 80T Pier Cap Beam", prodDate: "2025-04-01", shipDate: "2025-06-20", transitDays: 4, contractValue: 490000000, girderType: "Box Girder Continuous 40m", status: "Signage Crash Barrier Install", remarks: "200m rotary Afcons Gurgaon Sec-29 barrier install" },
  { id: "FOI-0011", batchNo: "DBC/IDR/2025/FV-0115", operator: "Dilip Buildcon Indore", zone: "Bangalore Silk Board KR Puram", category: "Flyover Viaduct 2.4km 6-Lane", description: "2.4km six-lane elevated viaduct extension at Silk Board-Hosur road corridor with 40 precast spans and 4 interchange ramp connections for BBMP", lengthM: 2400, lanes: 6, spansCount: 40, designSpeed: 60, loadClass: "IRC 70R Extra Heavy", origin: "DBC Casting Yard Tumkur KA", project: "Silk Board Hosur Flyover Viaduct", state: "Karnataka", mode: "Rail Wagon Steel Box Girder", prodDate: "2024-12-20", shipDate: "2025-04-10", transitDays: 5, contractValue: 1350000000, girderType: "Steel Composite 40m", status: "Girder Erection Span", remarks: "2.4km viaduct DBC Silk Board Hosur girder erection" },
  { id: "FOI-0012", batchNo: "GAM/MUM/2025/GS-0128", operator: "Gammon India Mumbai", zone: "Hyderabad LB Nagar Hitec City", category: "Grade Separator 3-Level 180m", description: "180m three-level grade separator at Hitec City junction with elevated flyover, metro viaduct, and underpass for Hyderabad HMDA Smart City project", lengthM: 180, lanes: 6, spansCount: 11, designSpeed: 50, loadClass: "IRC 70R Standard", origin: "Gammon Casting Yard Hyderabad TG", project: "Hitec City Grade Separator", state: "Telangana", mode: "Crane Truck 35T Precast Panel", prodDate: "2025-03-25", shipDate: "2025-07-05", transitDays: 1, contractValue: 410000000, girderType: "Precast U-Girder 30m", status: "Deck Slab Casting Active", remarks: "180m grade separator Gammon Hitec City deck casting" },
  { id: "FOI-0013", batchNo: "SIM/KOL/2025/TR-0132", operator: "Simplex Infra Kolkata", zone: "Chennai Anna Nagar Porur", category: "Trumpet Interchange 150m", description: "150m trumpet interchange at Porur-Kundrathur road junction with single-loop directional ramp and signal-free right turn for Chennai SRM", lengthM: 150, lanes: 4, spansCount: 6, designSpeed: 50, loadClass: "IRC 70R Standard", origin: "Simplex Yard Kolkata WB", project: "Porur Kundrathur Trumpet Interchange", state: "Tamil Nadu", mode: "Flatbed Trailer 40T Girder Segment", prodDate: "2025-02-05", shipDate: "2025-04-12", transitDays: 4, contractValue: 270000000, girderType: "Precast I-Girder 35m", status: "Pier Foundation Casting", remarks: "150m trumpet interchange Simplex Porur pier foundation" },
  { id: "FOI-0014", batchNo: "NCC/HYD/2025/DB-0146", operator: "NCC Limited Hyderabad", zone: "Kolkata Park Street Maa Flyover", category: "Diamond Interchange with BRTS", description: "200m diamond interchange with BRTS corridor at Maa Flyover-E M Bypass junction with precast deck slabs and noise barrier walls", lengthM: 200, lanes: 6, spansCount: 8, designSpeed: 50, loadClass: "IRC 70R Heavy", origin: "NCC Casting Yard Kolkata WB", project: "Maa Flyover Diamond BRTS", state: "West Bengal", mode: "Heavy Haul 80T Pier Cap Beam", prodDate: "2025-04-10", shipDate: "2025-06-20", transitDays: 1, contractValue: 320000000, girderType: "Box Girder Continuous 40m", status: "Asphalt Surfacing Wearing", remarks: "200m diamond BRTS NCC Kolkata Maa Flyover surfacing" }
];

export default function FlyoverInterchangeLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalLengthM = records.reduce((s, r) => s + r.lengthM, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => { const c = statusColor[r.status]; return c !== "green"; }).length;
  const openTraffic = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total Length (m)", v: totalLengthM.toLocaleString("en-IN"), s: "Across " + records.length + " interchange records" },
    { l: "Under Construction", v: underConstruction, s: "Foundation to surfacing" },
    { l: "Open to Traffic", v: openTraffic, s: "Traffic diversion operational" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "girderType", label: "Girder Type", options: ["Precast I-Girder 35m", "Box Girder Continuous 40m", "Steel Box Girder 45m", "Precast U-Girder 30m", "Steel Composite 40m", "Precast Box 38m", "Composite Steel-Concrete 42m"].map(t => ({ value: t, count: records.filter(r => r.girderType === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q) && !r.girderType.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof FlyoverRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Length (m)", "Lanes", "Spans", "Design Speed", "Load Class", "Origin", "Project", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Girder Type", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="foi-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Construction Progress by Activity (%)</h3><BarChart data={monthlyProgress} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="pier" fill="#4a1942" radius={[4,4,0,0]} name="Pier Found" /><Bar dataKey="girder" fill="#7c3aed" radius={[4,4,0,0]} name="Girder Erect" /><Bar dataKey="deck" fill="#6b21a8" radius={[4,4,0,0]} name="Deck Cast" /><Bar dataKey="surfacing" fill="#8b5cf6" radius={[4,4,0,0]} name="Surfacing" /></BarChart></div>
        <div className="foi-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Interchange Type Distribution (%)</h3><PieChart width={400} height={220}><Pie data={typeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="foi-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost Per Lane-Km (\u20b9Cr) by City</h3><LineChart data={costPerLaneKm} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[50, 150]} /><Tooltip /><Legend /><Line type="monotone" dataKey="delhi" stroke="#4a1942" strokeWidth={2} name="Delhi" /><Line type="monotone" dataKey="mumbai" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 5" name="Mumbai" /><Line type="monotone" dataKey="bangalore" stroke="#6b21a8" strokeWidth={2} strokeDasharray="2 2" name="Bangalore" /></LineChart></div>
        <div className="foi-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Flyover Network Length by City (km)</h3><BarChart data={cityLength} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" /><YAxis /><Tooltip /><Legend /><Bar dataKey="km" fill="#7c3aed" radius={[4,4,0,0]} name="Length km" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="foi-root p-6 space-y-6">
      <PageHeader title="Flyover Interchange Logistics" description="Indian urban flyover interchange logistics covering cloverleaf 120m rotary 200m spaghetti 350m grade separator 180m flyover viaduct 2.4km trumpet 150m diamond BRTS 200m partial cloverleaf upgrade 500m with precast box girder steel composite segmental construction, IRC 70R loading, expansion joints, crash barriers, bearing replacement across Delhi Mumbai Bangalore Hyderabad Chennai Kolkata Pune Ahmedabad" />
      <div className="foi-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`foi-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#4a1942] text-white" : "text-gray-600 hover:bg-purple-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Flyover Interchange" }]} />
      {tab === 0 && (
        <div className="foi-dash space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <div key={i} className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">{k.l}</p><p className="text-2xl font-bold text-[#4a1942]">{typeof k.v === 'number' ? k.v.toLocaleString('en-IN') : k.v}</p><p className="text-xs text-gray-400">{k.s}</p></div>)}
          </div>
          {renderCharts()}
          <div className="grid grid-cols-2 gap-6">
            {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-4"><h4 className="text-sm font-semibold mb-2 text-[#4a1942]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="foi-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="foi-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{r.lengthM}</td><td className="px-3 py-2 text-right">{r.lanes}</td><td className="px-3 py-2 text-right">{r.spansCount}</td><td className="px-3 py-2 text-right">{r.designSpeed} km/h</td><td className="px-3 py-2">{r.loadClass}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.project}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.girderType}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="foi-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="foi-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#4a1942]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
