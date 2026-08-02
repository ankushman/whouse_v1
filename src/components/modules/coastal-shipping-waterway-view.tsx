"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#0f766e", "#115e59", "#99f6e4", "#ccfbf1"];
const OPERATORS = ["Shreyas Shipping", "Samudera Shipping", "MAINI (Sanskriti)", "VMPL (Ocean Spark)", "Swan Shipping", "ABG Coast", "SCI Coastal", "Indian Coast Guard Logistics"];
const WATERWAYS = ["NW-1 Ganga", "NW-2 Brahmaputra", "NW-3 Kerala Backwaters", "NW-4 Kakinada-Puducherry", "NW-5 East Coast Canal", "NW-16 Mandovi-Zuari", "Coastal JNPT-Mundra", "Coastal Chennai-Colombo"];
const CARGO_TYPES = ["Bulk Coal", "Containers", "Liquid Cargo", "Project Cargo", "Agri Products", "Construction Material", " Vehicles", "Passengers"];
const VESSEL_STATUS = ["In Service", "At Berth", "Under Maintenance", "Dry Dock", "Delayed", "Scheduled"];
const TABS = ["Dashboard", "Voyage Registry", "Waterway Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", teal: "bg-teal-100 text-teal-700", slate: "bg-slate-100 text-slate-600", cyan: "bg-cyan-100 text-cyan-700" };
const statusColor: Record<string, string> = { "In Service": "green", "At Berth": "teal", "Under Maintenance": "amber", "Dry Dock": "slate", "Delayed": "red", "Scheduled": "cyan" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyTonnage = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], coastal: ri(1200, 2800, 1950 + Math.sin(i * 0.5) * 550), inland: ri(180, 520, 320 + Math.cos(i * 0.6) * 100), passengers: ri(45, 120, 78 + Math.sin(i * 0.7) * 25) }));
const modeDist = [{ n: "Coastal Container", v: 38 }, { n: "Bulk Dry", v: 28 }, { n: "Liquid Cargo", v: 15 }, { n: "Inland Water", v: 12 }, { n: "Project/Oversize", v: 4 }, { n: "Passenger", v: 3 }];
const utilizationTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(52, 82, 64 + Math.sin(i * 0.4) * 8)).toFixed(1), target: 75.0 }));
const waterwayVol = WATERWAYS.slice(0, 6).map(w => ({ n: w.split(" ").slice(0,2).join(" "), v: +ri(120, 680, 350 + Math.random() * 200).toFixed(0) }));

interface VoyageRecord { id: string; voyageNo: string; vesselName: string; operator: string; waterway: string; cargoType: string; origin: string; destination: string; etd: string; eta: string; ata: string; deadweight: number; loadedTonnage: number; utilization: number; containers: number; passengers: number; status: string; delayHours: number; pilotage: string; draft: number; remarks: string; }

const records: VoyageRecord[] = [
  { id: "CSW-0001", voyageNo: "V-2025-0451", vesselName: "MV Ocean Grace", operator: "Shreyas Shipping", waterway: "Coastal JNPT-Mundra", cargoType: "Containers", origin: "JNPT Mumbai", destination: "Mundra Port", etd: "2025-01-10", eta: "2025-01-14", ata: "2025-01-14", deadweight: 28000, loadedTonnage: 21500, utilization: 77, containers: 850, passengers: 0, status: "In Service", delayHours: 0, pilotage: "Gujarat Maritime Board", draft: 11.2, remarks: "850 TEU coastal container service" },
  { id: "CSW-0002", voyageNo: "V-2025-0452", vesselName: "MV Sanskriti", operator: "MAINI (Sanskriti)", waterway: "Coastal Chennai-Colombo", cargoType: "Containers", origin: "Chennai Port", destination: "Colombo", etd: "2025-01-12", eta: "2025-01-14", ata: "", deadweight: 18000, loadedTonnage: 12600, utilization: 70, containers: 520, passengers: 0, status: "In Service", delayHours: 0, pilotage: "Chennai Port Trust", draft: 9.8, remarks: "India-Sri Lanka coastal run" },
  { id: "CSW-0003", voyageNo: "V-2025-0453", vesselName: "MV Ocean Spark", operator: "VMPL (Ocean Spark)", waterway: "NW-1 Ganga", cargoType: "Bulk Coal", origin: "Haldia", destination: "Allahabad", etd: "2025-01-08", eta: "2025-01-18", ata: "", deadweight: 5000, loadedTonnage: 3200, utilization: 64, containers: 0, passengers: 0, status: "Delayed", delayHours: 36, pilotage: "Inland Waterways Authority", draft: 3.2, remarks: "Low water level delay - shoaling near Patna" },
  { id: "CSW-0004", voyageNo: "V-2025-0454", vesselName: "MV Coastal Pioneer", operator: "Swan Shipping", waterway: "Coastal JNPT-Mundra", cargoType: "Liquid Cargo", origin: "Mundra Port", destination: "JNPT Mumbai", etd: "2025-01-13", eta: "2025-01-17", ata: "", deadweight: 35000, loadedTonnage: 28000, utilization: 80, containers: 0, passengers: 0, status: "In Service", delayHours: 0, pilotage: "Mumbai Port Trust", draft: 12.4, remarks: "Crude oil coastal tanker" },
  { id: "CSW-0005", voyageNo: "V-2025-0455", vesselName: "MV River Star", operator: "Samudera Shipping", waterway: "NW-2 Brahmaputra", cargoType: "Agri Products", origin: "Dhubri", destination: "Guwahati", etd: "2025-01-11", eta: "2025-01-13", ata: "2025-01-13", deadweight: 2000, loadedTonnage: 1200, utilization: 60, containers: 0, passengers: 0, status: "At Berth", delayHours: 0, pilotage: "Brahmaputra River Authority", draft: 2.1, remarks: "Tea and rice transport" },
  { id: "CSW-0006", voyageNo: "V-2025-0456", vesselName: "MV Kerala Express", operator: "ABG Coast", waterway: "NW-3 Kerala Backwaters", cargoType: "Passengers", origin: "Kochi", destination: "Alappuzha", etd: "2025-01-14", eta: "2025-01-14", ata: "2025-01-14", deadweight: 800, loadedTonnage: 0, utilization: 85, containers: 0, passengers: 420, status: "In Service", delayHours: 0, pilotage: "Kerala State Water Transport", draft: 1.4, remarks: "Daily passenger ferry service" },
  { id: "CSW-0007", voyageNo: "V-2025-0457", vesselName: "MV Coastal Fortune", operator: "SCI Coastal", waterway: "Coastal Chennai-Colombo", cargoType: "Bulk Coal", origin: "Paradip Port", destination: "Chennai Port", etd: "2025-01-09", eta: "2025-01-13", ata: "2025-01-14", deadweight: 42000, loadedTonnage: 33600, utilization: 80, containers: 0, passengers: 0, status: "In Service", delayHours: 12, pilotage: "Paradip Port Trust", draft: 13.1, remarks: "Thermal coal for TNEB power plant" },
  { id: "CSW-0008", voyageNo: "V-2025-0458", vesselName: "MV Goa Cruiser", operator: "Shreyas Shipping", waterway: "NW-16 Mandovi-Zuari", cargoType: "Passengers", origin: "Panaji", destination: "Vasco", etd: "2025-01-15", eta: "2025-01-15", ata: "", deadweight: 600, loadedTonnage: 0, utilization: 72, containers: 0, passengers: 280, status: "Scheduled", delayHours: 0, pilotage: "Goa Maritime Board", draft: 1.2, remarks: "Tourist cruise ferry - Goa" },
  { id: "CSW-0009", voyageNo: "V-2025-0459", vesselName: "MV Delta Force", operator: "VMPL (Ocean Spark)", waterway: "NW-4 Kakinada-Puducherry", cargoType: "Construction Material", origin: "Kakinada", destination: "Chennai Ennore", etd: "2025-01-06", eta: "2025-01-12", ata: "2025-01-13", deadweight: 8000, loadedTonnage: 5200, utilization: 65, containers: 0, passengers: 0, status: "In Service", delayHours: 18, pilotage: "Inland Waterways Authority", draft: 4.8, remarks: "Cement and steel for Chennai metro" },
  { id: "CSW-0010", voyageNo: "V-2025-0460", vesselName: "MV Bengal Trader", operator: "Samudera Shipping", waterway: "NW-5 East Coast Canal", cargoType: "Agri Products", origin: "Kolkata", destination: "Visakhapatnam", etd: "2025-01-10", eta: "2025-01-16", ata: "", deadweight: 6000, loadedTonnage: 3600, utilization: 60, containers: 0, passengers: 0, status: "In Service", delayHours: 0, pilotage: "Kolkata Port Trust", draft: 4.2, remarks: "Rice and jute transport" },
  { id: "CSW-0011", voyageNo: "V-2025-0461", vesselName: "MV Arabian Pearl", operator: "ABG Coast", waterway: "Coastal JNPT-Mundra", cargoType: "Project Cargo", origin: "JNPT Mumbai", destination: "Kandla Port", etd: "2025-01-14", eta: "2025-01-16", ata: "", deadweight: 15000, loadedTonnage: 9000, utilization: 60, containers: 0, passengers: 0, status: "In Service", delayHours: 0, pilotage: "Kandla Port Trust", draft: 7.2, remarks: "Wind turbine blades - project cargo" },
  { id: "CSW-0012", voyageNo: "V-2025-0462", vesselName: "MV Coral Queen", operator: "Swan Shipping", waterway: "Coastal Chennai-Colombo", cargoType: "Vehicles", origin: "Chennai Port", destination: "Colombo", etd: "2025-01-07", eta: "2025-01-09", ata: "2025-01-10", deadweight: 22000, loadedTonnage: 14000, utilization: 64, containers: 0, passengers: 0, status: "In Service", delayHours: 12, pilotage: "Chennai Port Trust", draft: 8.6, remarks: "Export vehicles - Maruti Suzuki" },
  { id: "CSW-0013", voyageNo: "V-2025-0463", vesselName: "MV Ganga Voyager", operator: "SCI Coastal", waterway: "NW-1 Ganga", cargoType: "Bulk Coal", origin: "Kolkata", destination: "Varanasi", etd: "2025-01-04", eta: "2025-01-15", ata: "", deadweight: 3500, loadedTonnage: 2100, utilization: 60, containers: 0, passengers: 0, status: "Under Maintenance", delayHours: 0, pilotage: "Inland Waterways Authority", draft: 2.8, remarks: "Engine overhaul - propeller repair at Allahabad" },
  { id: "CSW-0014", voyageNo: "V-2025-0464", vesselName: "MV Konkan Star", operator: "Shreyas Shipping", waterway: "Coastal JNPT-Mundra", cargoType: "Containers", origin: "Mundra Port", destination: "JNPT Mumbai", etd: "2025-01-15", eta: "2025-01-19", ata: "", deadweight: 32000, loadedTonnage: 24000, utilization: 75, containers: 960, passengers: 0, status: "Scheduled", delayHours: 0, pilotage: "Mumbai Port Trust", draft: 11.8, remarks: "Return coastal container service" },
];

const inServiceCount = records.filter(r => r.status === "In Service").length;
const delayedCount = records.filter(r => r.status === "Delayed").length;
const totalTEU = records.reduce((s, r) => s + r.containers, 0);
const totalTonnage = records.reduce((s, r) => s + r.loadedTonnage, 0);

const kpis = [
  { l: "Vessels In Service", v: inServiceCount, s: "active voyages" },
  { l: "Delayed Voyages", v: delayedCount, s: "need attention" },
  { l: "Total TEU Moved", v: totalTEU.toLocaleString(), s: "containers" },
  { l: "Total Tonnage", v: `${(totalTonnage / 1000).toFixed(0)}K MT`, s: "cargo moved" },
];

const INSIGHTS = [
  {
    t: "India Coastal Shipping: 7,516 km Coastline with 12 Major Ports and RoRo Network",
    c: "India\u2019s coastal shipping network, operating along the country\u2019s 7,516 km mainland coastline across 9 coastal states and 4 union territories, handles approximately 1,200 million metric tonnes (MMT) of cargo annually through its 12 major ports (JNPT, Mumbai, Chennai, Kolkata-Haldia, Paradip, Visakhapatnam, Kandla, Cochin, New Mangalore, Mormugao, V.O. Chidambaranar, Ennore) and over 200 minor ports. The Indian government\u2019s Sagarmala Programme, launched in 2015 with a total investment outlay of \u20b94 lakh crore, aims to modernize India\u2019s port infrastructure and reduce logistics costs from 14% of GDP to 8% by leveraging coastal shipping as a cost-effective alternative to road and rail for bulk and containerized cargo. Coastal shipping in India moves approximately 85-95 million tonnes of domestic cargo annually (excluding international transshipment), with coal (32%), iron ore (18%), cement (15%), POL/petroleum products (14%), and containers (12%) being the primary cargo categories. The coastal container service between JNPT Mumbai and Mundra Port, operated by Shreyas Shipping and VMPL, handles approximately 1,500 TEU per voyage with 3-4 day transit time versus 2-3 days by road but at 40-50% lower per-TEU cost. India\u2019s RoRo (Roll-on/Roll-off) ferry services, launched under the Sagarmala initiative on the Mumbai-Goa and Chennai-Colombo corridors, carry 2,500-3,000 vehicles monthly, reducing road transport distance by 800-1,200 km per shipment. The coastal shipping subsidy scheme, providing \u20b91,500-2,500 per TEU and \u20b950-100 per tonne for non-containerized cargo on designated coastal routes, has increased coastal cargo volumes by 35% since FY2019. For logistics operators, coastal shipping offers 40-55% cost savings over road on long-haul corridors (JNPT-Mundra, Chennai-Kolkata) and 70% lower carbon emissions per tonne-km compared to road transport.",
  },
  {
    t: "National Waterways: 111 Routes Spanning 20,275 km with NW-1 Ganga as Flagship",
    c: "India\u2019s National Waterways network, declared under the National Waterways Act 2016, encompasses 111 waterways spanning 20,275 km across 24 states, though only 22 waterways are currently operational with commercial traffic. The flagship NW-1 (Ganga-Bhagirathi-Hooghly river system, 1,620 km from Haldia to Allahabad), operated by the Inland Waterways Authority of India (IWAI), handles approximately 8-10 MMT of cargo annually including coal, stone chips, food grains, cement, and fertilizers. The Jal Marg Vikas Project (JMVP), a World Bank-assisted initiative (\u20b95,369 crore), is developing NW-1 for navigation of 1,500-2,000 tonne capacity barges with planned multi-modal terminals at Haldia, Varanasi, Sahibganj, and Allahabad, targeting a capacity of 22-30 MMT by FY2027. NW-2 (Brahmaputra, 891 km from Dhubri to Sadiya in Assam) handles 2-3 MMT of cargo, primarily tea, timber, and petroleum products, with seasonal navigation challenges during monsoon floods (June-September). NW-3 (Kerala Backwaters, 205 km from Kollam to Kozhipcode) serves dual purpose as a tourist waterway (Kerala backwaters houseboat tourism generates \u20b9350 crore annually) and cargo corridor for coir products and spices. The economic advantage of inland waterways is significant: barge transport costs \u20b90.50-0.80 per tonne-km versus \u20b91.50-2.50 by road and \u20b91.00-1.20 by rail, with the lowest carbon footprint among all freight modes at 14g CO2 per tonne-km versus road at 94g. India\u2019s inland waterway cargo target is 200 MMT by 2030, requiring investment of \u20b925,000 crore in terminal infrastructure, dredging, and navigation aids, with current utilization at only 5% of the identified potential.",
  },
  {
    t: "Coastal Regulation & Cabotage: Foreign vs Domestic Vessel Operations",
    c: "India\u2019s cabotage regulations, administered by the Directorate General of Shipping under the Merchant Shipping Act 1958, restrict foreign-flagged vessels from operating on India\u2019s coastal routes for domestic cargo transportation, reserving this right for Indian-flagged vessels registered under the Indian Merchant Shipping Act. This cabotage protection is a significant policy factor in India\u2019s coastal shipping economics: India has approximately 750 Indian-flagged coastal vessels (compared to 3,400+ Chinese-flagged coastal vessels), with an average fleet age of 22 years, significantly older than the global average of 12 years. The cabotage relaxation notification of 2016 (subsequently modified in 2018) allows foreign-flagged vessels to carry EXIM containers between Indian ports on a case-by-case basis with DGS approval, primarily benefiting the transshipment trade at JNPT and Chennai. The Indian Register of Shipping (IRS), the country\u2019s classification society, classifies and certifies coastal vessels under IRS rules, which incorporate IMO SOLAS, MARPOL, and Load Line convention requirements adapted for Indian coastal conditions. Key regulatory compliance for coastal vessel operators includes: (1) Merchant Shipping (Standards of Training, Certification and Watchkeeping) Rules, (2) Indian Merchant Shipping (Life-Saving Appliances) Rules, (3) Marine Pollution (MARPOL) compliance through the Maritime State Pollution Control Board, (4) Port State Control inspections at each port of call, and (5) Annual survey and classification renewal by IRS. India\u2019s Sagarmala initiative has proposed easing cabotage further to attract foreign investment in coastal fleet modernization, with a target of 1,500 Indian-flagged coastal vessels by 2030, requiring approximately \u20b940,000 crore in fleet acquisition and modernization investment.",
  },
  {
    t: "Coastal Shipping & Waterway Integration with National Logistics Grid",
    c: "The integration of coastal shipping and inland waterways with India\u2019s National Logistics Grid\u2014comprising Dedicated Freight Corridors, National Highway network (1.46 lakh km NH), and Indian Railways freight network (68,000+ route km)\u2014is a key pillar of the National Logistics Policy 2022, targeting reduction of overall logistics cost from 14% to 8% of GDP. Multi-modal logistics parks (MMLPs) under development at 35 locations by NHAI, with 15 MMLPs prioritized for FY2025-27, include waterfront terminals connecting coastal shipping and inland waterway services with road and rail networks. Key integration points include: (1) JNPT-located MMLP connecting coastal container terminals with the Western DFC rail link to Northern India, (2) Paradip MMLP integrating coastal bulk terminals with the South Eastern Railway freight corridor, (3) Varanasi MMLP (NW-1 terminal) connecting Ganga barge services with NH and rail networks for UP-Bihar cargo distribution, and (4) Kochi MMLP integrating Kerala backwater services with NHAI and Southern Railway. The Unified Logistics Interface Platform (ULIP), launched under NLP 2022, provides a single-window data exchange platform connecting 37 logistics service providers, 12 state highway authorities, 6 port trusts, Indian Railways FOIS, and IWAI\u2019s river information services. For logistics operators, multi-modal routing algorithms that integrate coastal shipping for long-haul segments (JNPT-Mundra, Chennai-Kolkata, Paradip-Visakhapatnam), inland waterways for last-mile bulk delivery (Ganga corridor to UP/Bihar), and road/rail for final distribution can achieve 25-35% cost reduction and 40% carbon emission reduction compared to road-only logistics. Companies deploying integrated coastal-rail-road logistics management systems report 30% improvement in fleet utilization, 20% reduction in transit time variability, and 15% lower total logistics cost per tonne-km.",
  },
];

export default function CoastalShippingWaterwayView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: VESSEL_STATUS.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "operator", label: "Operator", options: OPERATORS.map(o => ({ value: o, count: records.filter(r => r.operator === o).length })) },
    { key: "waterway", label: "Waterway", options: WATERWAYS.map(w => ({ value: w, count: records.filter(r => r.waterway === w).length })) },
    { key: "cargoType", label: "Cargo", options: CARGO_TYPES.map(c => ({ value: c, count: records.filter(r => r.cargoType === c).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.voyageNo.toLowerCase().includes(q) && !r.vesselName.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.origin.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof VoyageRecord] as string));
  });

  return (
    <div className="csw-root p-6 space-y-6">
      <PageHeader title="Coastal Shipping & Inland Waterway" description="India coastal shipping fleet operations, National Waterways management, vessel voyage tracking, Sagarmala port integration, IWAI barge coordination and multi-modal logistics" />
      <div className="csw-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`csw-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-teal-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="csw-dash space-y-6">
          <div className="csw-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="csw-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 csw-kpi-label">{k.l}</div><div className="text-2xl font-bold text-teal-700 csw-kpi-val">{k.v}</div><div className="text-xs text-gray-400 csw-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="csw-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Cargo Tonnage (Coastal / Inland / Passenger K)</h3><BarChart data={monthlyTonnage} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="coastal" fill="#0d9488" radius={[4,4,0,0]} name="Coastal" /><Bar dataKey="inland" fill="#14b8a6" radius={[4,4,0,0]} name="Inland" /><Bar dataKey="passengers" fill="#2dd4bf" radius={[4,4,0,0]} name="Passenger K" /></BarChart></div>
            <div className="csw-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cargo Mode Distribution</h3><PieChart width={400} height={220}><Pie data={modeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{modeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="csw-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Fleet Utilization Trend (%) vs Target 75%</h3><LineChart data={utilizationTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[45, 90]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0d9488" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target 75%" /></LineChart></div>
            <div className="csw-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Volume by Waterway (000 MT)</h3><BarChart data={waterwayVol} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#14b8a6" radius={[4,4,0,0]} /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="csw-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Waterway", href: "#" }, { label: "Voyage Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="csw-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Voyage No,Vessel,Operator,Waterway,Cargo,Origin,Dest,ETD,ETA,ATA,DWT,Loaded,Util%,TEU,Pax,Status,Delay,Pilotage,Draft,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Delayed" ? "csw-row-critical bg-red-50" : r.status === "Under Maintenance" ? "csw-row-warning bg-amber-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-teal-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="csw-badge inline-block px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-700 font-mono">{r.voyageNo}</span></td>
                <td className="px-3 py-2 text-xs">{r.vesselName}</td>
                <td className="px-3 py-2 text-xs">{r.operator}</td>
                <td className="px-3 py-2 text-xs">{r.waterway}</td>
                <td className="px-3 py-2"><span className="csw-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.cargoType}</span></td>
                <td className="px-3 py-2 text-xs">{r.origin}</td>
                <td className="px-3 py-2 text-xs">{r.destination}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.etd}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2 text-xs">{r.ata || <span className="text-slate-400">\u2014</span>}</td>
                <td className="px-3 py-2 text-xs">{(r.deadweight/1000).toFixed(1)}K</td>
                <td className="px-3 py-2 text-xs">{(r.loadedTonnage/1000).toFixed(1)}K MT</td>
                <td className="px-3 py-2"><div className="flex items-center gap-1"><div className="w-12 h-1.5 bg-gray-200 rounded"><div className="csw-utilbar h-1.5 rounded" style={{ width: `${r.utilization}%`, background: r.utilization >= 75 ? "#0d9488" : r.utilization >= 60 ? "#f59e0b" : "#ef4444" }} /></div><span className="text-xs font-medium">{r.utilization}%</span></div></td>
                <td className="px-3 py-2 text-xs">{r.containers > 0 ? r.containers : "\u2014"}</td>
                <td className="px-3 py-2 text-xs">{r.passengers > 0 ? r.passengers : "\u2014"}</td>
                <td className="px-3 py-2"><span className={`csw-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2">{r.delayHours > 0 ? <span className="text-red-600 text-xs font-semibold">{r.delayHours}h</span> : <span className="text-green-600 text-xs">On Time</span>}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-28 truncate">{r.pilotage}</td>
                <td className="px-3 py-2 text-xs">{r.draft}m</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-36 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="csw-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="csw-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Voyages by Operator</h3><BarChart data={OPERATORS.slice(0,6).map(o => ({ n: o.split(" ")[0], v: +ri(12, 48, 28 + Math.random() * 14).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0d9488" radius={[4,4,0,0]} /></BarChart></div>
            <div className="csw-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cargo Volume by Route Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], westCoast: ri(42, 108, 72 + Math.sin(i*0.5)*18), eastCoast: ri(32, 85, 55 + Math.cos(i*0.6)*15), inland: ri(12, 48, 28 + Math.sin(i*0.7)*10) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="westCoast" stackId="1" stroke="#0d9488" fill="#ccfbf1" name="West Coast" /><Area type="monotone" dataKey="eastCoast" stackId="1" stroke="#14b8a6" fill="#99f6e4" name="East Coast" /><Area type="monotone" dataKey="inland" stackId="1" stroke="#2dd4bf" fill="#5eead4" name="Inland NW" /></AreaChart></div>
          </div>
          <div className="csw-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Delay Hours by Operator</h3><BarChart data={OPERATORS.slice(0,6).map(op => ({ n: op.split(" ")[0], v: +ri(0, 42, 12 + Math.random()*18).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#14b8a6" radius={[4,4,0,0]} /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="csw-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="csw-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-teal-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
