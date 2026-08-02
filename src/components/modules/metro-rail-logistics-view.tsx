"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0e7490", "#0891b2", "#06b6d4", "#22d3ee", "#155e75", "#164e63", "#67e8f9", "#a5f3fc"];
const LINES = ["Delhi Yellow Line", "Mumbai Line 1", "Chennai Blue Line", "Kolkata North-South", "Bangalore Purple Line", "Noida Aqua Line", "Hyderabad Blue Line", "Kochi Metro Line"];
const CATEGORIES = ["Rolling Stock Parts", "Track Materials", "Signal Equipment", "Electrical Systems", "Passenger Amenities", "Safety Devices", "Platform Equipment", "Depot Spares"];
const WORK_STATUSES = ["Dispatched", "In Transit", "Installed / Commissioned", "Under Testing", "Quality Hold", "Pending Approval"];
const NETWORKS = ["Delhi Metro", "Mumbai Metro", "Chennai Metro", "Kolkata Metro", "Bangalore Metro", "Hyderabad Metro", "Noida Metro", "Kochi Metro"];
const MODES = ["Rail Freight", "Heavy Truck", "Flatbed Trailer", "Container Flat", "Courier Express", "Air Cargo"];
const TABS = ["Dashboard", "Parts Registry", "Metro Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Dispatched": "blue", "In Transit": "blue", "Installed / Commissioned": "green", "Under Testing": "amber", "Quality Hold": "red", "Pending Approval": "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyProcurement = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], rolling: ri(80, 160, 110 + Math.sin(i * 0.5) * 20), track: ri(40, 90, 60 + Math.cos(i * 0.6) * 12), signal: ri(25, 55, 38 + Math.sin(i * 0.7) * 8), electrical: ri(20, 45, 30 + Math.cos(i * 0.8) * 6) }));
const categoryDist = [{ n: "Rolling Stock Parts", v: 28 }, { n: "Track Materials", v: 18 }, { n: "Signal Equipment", v: 16 }, { n: "Electrical Systems", v: 14 }, { n: "Passenger Amenities", v: 10 }, { n: "Safety Devices", v: 6 }, { n: "Platform Equipment", v: 5 }, { n: "Depot Spares", v: 3 }];
const availabilityTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(92, 99.5, 96 + Math.sin(i * 0.4) * 1.5)).toFixed(1), target: 97.0 }));
const linePerf = LINES.slice(0, 6).map(l => ({ n: l.split(" ").slice(0, 2).join(" "), v: +ri(88, 99, 94 + Math.random() * 4).toFixed(0) }));

interface PartRecord { id: string; workOrder: string; line: string; network: string; category: string; item: string; quantity: number; unit: string; vendor: string; origin: string; destination: string; mode: string; dispatchDate: string; installDate: string; transitDays: number; valueLakhs: number; critical: boolean; status: string; remarks: string; }

const records: PartRecord[] = [
  { id: "MRL-0001", workOrder: "WO-DMRC/2025/4521", line: "Delhi Yellow Line", network: "Delhi Metro", category: "Rolling Stock Parts", item: "Bogie Wheel Set SKF-3225", quantity: 8, unit: "Sets", vendor: "BEML Bengaluru", origin: "BEML Factory", destination: "Mukundpur Depot", mode: "Heavy Truck", dispatchDate: "2025-07-10", installDate: "", transitDays: 3, valueLakhs: 96, critical: true, status: "In Transit", remarks: "Yellow Line bogie wheel replacement - 4-coach set" },
  { id: "MRL-0002", workOrder: "WO-MMRC/2025/3345", line: "Mumbai Line 1", network: "Mumbai Metro", category: "Electrical Systems", item: "Traction Motor 3-Phase 750V DC", quantity: 4, unit: "Units", vendor: "Alstom India", origin: "Alstom Sri City", destination: "Andheri Depot", mode: "Flatbed Trailer", dispatchDate: "2025-07-08", installDate: "2025-07-11", transitDays: 3, valueLakhs: 280, critical: true, status: "Installed / Commissioned", remarks: "Versova-Andheri-Ghatkopar line traction motor swap" },
  { id: "MRL-0003", workOrder: "WO-CMRL/2025/5678", line: "Chennai Blue Line", network: "Chennai Metro", category: "Signal Equipment", item: "CBTC Track Circuit Module", quantity: 24, unit: "Modules", vendor: "Bombardier India", origin: "Bombardier Pune", destination: "Koyambedu Depot", mode: "Courier Express", dispatchDate: "2025-07-11", installDate: "", transitDays: 2, valueLakhs: 45, critical: true, status: "In Transit", remarks: "CBTC signal upgrade - 12 track circuits per km" },
  { id: "MRL-0004", workOrder: "WO-KMRC/2025/7890", line: "Kolkata North-South", network: "Kolkata Metro", category: "Track Materials", item: "Rail Weld Rail Head 52kg", quantity: 120, unit: "Joints", vendor: "SAIL Bhilai", origin: "SAIL BSP Plant", destination: "Noapara Car Shed", mode: "Rail Freight", dispatchDate: "2025-07-09", installDate: "2025-07-12", transitDays: 3, valueLakhs: 36, critical: false, status: "Installed / Commissioned", remarks: "North-South corridor track renewal welded joints" },
  { id: "MRL-0005", workOrder: "WO-BMRCL/2025/4123", line: "Bangalore Purple Line", network: "Bangalore Metro", category: "Passenger Amenities", item: "Platform Screen Doors PSD Bi-parting", quantity: 16, unit: "Panels", vendor: "Nabco Japan (via KONE)", origin: "KONE Chennai Plant", destination: "Mysore Road Station", mode: "Container Flat", dispatchDate: "2025-07-07", installDate: "", transitDays: 1, valueLakhs: 128, critical: false, status: "Under Testing", remarks: "Purple Line PSD installation - Phase 2 stations" },
  { id: "MRL-0006", workOrder: "WO-NMRC/2025/2345", line: "Noida Aqua Line", network: "Noida Metro", category: "Safety Devices", item: "Fire Suppression System NOVEC 1230", quantity: 12, unit: "Units", vendor: "Minimax India", origin: "Minimax Pune", destination: "Sector-62 Depot", mode: "Courier Express", dispatchDate: "2025-07-12", installDate: "", transitDays: 2, valueLakhs: 54, critical: true, status: "Dispatched", remarks: "Aqua Line fire suppression system depot upgrade" },
  { id: "MRL-0007", workOrder: "WO-HMR/2025/6789", line: "Hyderabad Blue Line", network: "Hyderabad Metro", category: "Rolling Stock Parts", item: "Brake Pad Assembly Composite", quantity: 48, unit: "Sets", vendor: "L&T Hydraulics", origin: "L&T Hyderabad", destination: "Miyapur Depot", mode: "Heavy Truck", dispatchDate: "2025-07-06", installDate: "2025-07-07", transitDays: 1, valueLakhs: 24, critical: false, status: "Installed / Commissioned", remarks: "Blue Line brake pad quarterly replacement" },
  { id: "MRL-0008", workOrder: "WO-DMRC/2025/8901", line: "Delhi Yellow Line", network: "Delhi Metro", category: "Electrical Systems", item: "Third Rail Conductor Rail 80lb", quantity: 60, unit: "Lengths (6m)", vendor: "Tata Steel", origin: "Tata Steel Jamshedpur", destination: "Jahangirpuri Workshop", mode: "Rail Freight", dispatchDate: "2025-07-05", installDate: "2025-07-10", transitDays: 5, valueLakhs: 90, critical: true, status: "Installed / Commissioned", remarks: "Yellow Line third rail conductor replacement" },
  { id: "MRL-0009", workOrder: "WO-KMRL/2025/3456", line: "Kochi Metro Line", network: "Kochi Metro", category: "Platform Equipment", item: "TVM Fare Gate FLAP-420", quantity: 8, unit: "Units", vendor: "EMO Transronics", origin: "EMO Noida", destination: "Muttom Depot", mode: "Courier Express", dispatchDate: "2025-07-11", installDate: "", transitDays: 4, valueLakhs: 32, critical: false, status: "In Transit", remarks: "Kochi Metro fare gate addition - Aluva extension" },
  { id: "MRL-0010", workOrder: "WO-BMRCL/2025/5672", line: "Bangalore Purple Line", network: "Bangalore Metro", category: "Track Materials", item: "Ballastless Track Slab Formwork", quantity: 20, unit: "Sets", vendor: "Afcons Infrastructure", origin: "Afcons Yard", destination: "Cubbon Park Station", mode: "Heavy Truck", dispatchDate: "2025-07-10", installDate: "", transitDays: 1, valueLakhs: 18, critical: false, status: "Pending Approval", remarks: "Purple Line Phase 2 tunnel section track slab" },
  { id: "MRL-0011", workOrder: "WO-DMRC/2025/1234", line: "Delhi Yellow Line", network: "Delhi Metro", category: "Signal Equipment", item: "ATS Interlocking Relay Unit", quantity: 6, unit: "Units", vendor: "Siemens India", origin: "Siemens Goa", destination: "Shastri Park Control", mode: "Air Cargo", dispatchDate: "2025-07-09", installDate: "2025-07-10", transitDays: 1, valueLakhs: 72, critical: true, status: "Installed / Commissioned", remarks: "Yellow Line ATS upgrade interlocking relay" },
  { id: "MRL-0012", workOrder: "WO-MMRC/2025/8765", line: "Mumbai Line 1", network: "Mumbai Metro", category: "Depot Spares", item: "Wheel Lathe Tool Insert CNMG", quantity: 50, unit: "Pieces", vendor: "Sandvik India", origin: "Sandvik Pune", destination: "Versova Depot", mode: "Courier Express", dispatchDate: "2025-07-12", installDate: "", transitDays: 2, valueLakhs: 4.5, critical: false, status: "In Transit", remarks: "Mumbai Metro depot wheel lathe tool inserts" },
  { id: "MRL-0013", workOrder: "WO-HMR/2025/2468", line: "Hyderabad Blue Line", network: "Hyderabad Metro", category: "Passenger Amenities", item: "HVAC Compressor Scroll 5TR", quantity: 8, unit: "Units", vendor: "Daikin India", origin: "Daikin Neemrana", destination: "LBS Nagar Depot", mode: "Heavy Truck", dispatchDate: "2025-07-08", installDate: "", transitDays: 2, valueLakhs: 64, critical: true, status: "Quality Hold", remarks: "HVAC compressor failed QC - vibration out of spec, re-inspection pending" },
  { id: "MRL-0014", workOrder: "WO-CMRL/2025/9012", line: "Chennai Blue Line", network: "Chennai Metro", category: "Safety Devices", item: "Emergency Door Release Mechanism", quantity: 32, unit: "Units", vendor: "Schneider Electric", origin: "Schneider Chennai", destination: "Chennai Central Station", mode: "Flatbed Trailer", dispatchDate: "2025-07-11", installDate: "2025-07-12", transitDays: 1, valueLakhs: 16, critical: false, status: "Installed / Commissioned", remarks: "Chennai Metro emergency door release mechanism replacement" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Dispatched").length;
const holdCount = records.filter(r => r.status === "Quality Hold" || r.status === "Pending Approval").length;
const installedCount = records.filter(r => r.status === "Installed / Commissioned").length;
const totalValue = records.reduce((s, r) => s + r.valueLakhs, 0);

const kpis = [
  { l: "Dispatched / Transit", v: transitCount, s: "active consignments" },
  { l: "Hold / Pending", v: holdCount, s: "needs clearance" },
  { l: "Installed", v: installedCount, s: "commissioned" },
  { l: "Total Supply Value", v: `\u20b9${totalValue.toFixed(0)}L`, s: "across all networks" },
];

const INSIGHTS = [
  {
    t: "India Metro Network: 860+ km Operational and \u20b912 Lakh Crore Investment Pipeline",
    c: "India\u2019s metro rail network is the world\u2019s fourth-largest by route length, with 860+ km operational across 13 cities (2025), carrying approximately 8 million daily passengers. India\u2019s metro investment pipeline exceeds \u20b912 lakh crore (USD 145 billion), with 600+ km under construction in 28 cities under various phases. Key operational networks include: (1) Delhi Metro (DMRC): 392 km, 288 stations, 10 color-coded lines, 2.8 million daily ridership, \u20b91,10,000 crore Phase-IV under construction (103 km), (2) Mumbai Metro (MMRDA/MMRC): 44 km operational + 337 km under construction, Mumbai Metro Line 3 (33.5 km, Colaba-SEEPZ) being India\u2019s first fully underground metro at \u20b933,000 crore, (3) Bangalore Metro (Namma Metro): 73 km operational, Phase 2 (117 km, \u20b942,000 crore) 60% complete, (4) Chennai Metro (CMRL): 54 km operational, Phase 2 (119 km, \u20b963,000 crore) under construction, (5) Hyderabad Metro (L&T MRHL): 69 km, 3 corridors, India\u2019s largest PPP metro, 4.5 lakh daily ridership, (6) Kolkata Metro: 40 km, India\u2019s first metro (1984), underwater tunnel under Hooghly for East-West corridor, (7) Noida Metro (NMRC): 29 km Aqua Line, extension to Greater Noida under construction, (8) Kochi Metro (KMRL): 28 km, India\u2019s first water metro integration. India\u2019s metro logistics supply chain is complex due to: (1) Safety-critical spare parts requiring zero-defect certification (CE, AAR, RDSO approved), (2) Multi-vendor procurement from BEML, Alstom, Bombardier, Siemens, L&T, CAF, and Stadler, (3) Depot-level inventory management with min-max stock levels for 50,000+ line items, (4) Night-only maintenance windows (typically 11:30 PM to 5:30 AM), and (5) Regulatory compliance with RDSO (Research Designs & Standards Organisation) and CMRS (Commissioner of Metro Rail Safety). India\u2019s metro ridership has recovered to 95% of pre-COVID levels, with daily ridership growth of 8-10% per annum driven by urbanization (India\u2019s urban population: 480 million, projected 675 million by 2035).",
  },
  {
    t: "Metro Rolling Stock and Depot Logistics: 4,000+ Coaches and Night Maintenance Windows",
    c: "India\u2019s metro fleet comprises 4,000+ coaches across 13 networks, with an average fleet age of 6-8 years. Rolling stock procurement has shifted from imports (2002-2015) to Make in India with: (1) BEML Bengaluru (1,500+ coaches delivered for Delhi, Bangalore, Kochi, Noida), (2) Alstom India (Sri City plant, 800+ coaches for Mumbai, Chennai, Kochi), (3) Bombardier (now Alstom) Savli Gujarat plant (600+ coaches for Delhi, Mumbai), (4) L&T-Mitsubishi joint venture (Hyderabad 171 coaches, Nagpur 48 coaches), (5) CAF Spain (Mumbai Line 3, 288 coaches, imported), and (6) Titagarh Rail Systems (10th standard coaches for Kolkata, Jaipur). Depot logistics involves: (1) Heavy maintenance every 6 years or 600,000 km (complete bogie overhaul, traction motor inspection, HVAC system overhaul, 15-day cycle per train), (2) Light maintenance daily (brake pad inspection, door mechanism check, interior cleaning, 4-hour cycle), (3) Pre-revenue inspection every morning (2 hours, signal test, brake test, door test, pantograph inspection), and (4) Depot inventory management with automated warehouses ( Automated Storage and Retrieval Systems - AS/RS for small parts, vertical lift modules for medium parts, and overhead cranes for heavy assemblies). India\u2019s metro spare parts logistics is valued at approximately \u20b95,000 crore annually, with key categories: (1) Rolling stock parts (40%): bogies, wheels, traction motors, brake systems, couplers, suspension, (2) Signaling and telecom (20%): CBTC, ATS, interlocking, PA systems, CCTV, (3) Electrical (15%): traction substations, third rail, OHE, UPS, batteries, (4) Track (10%): rails, fastenings, ballastless track slabs, switches, and (5) Civil and station (15%): PSDs, escalators, elevators, fare gates, HVAC. Critical spare availability target is 98%+, with penalty clauses for stock-outs that cause service disruptions.",
  },
  {
    t: "Metro Signaling Technology: CBTC, Driverless Operations, and Communication Systems",
    c: "India\u2019s metro signaling has evolved from fixed-block systems (First Generation: Kolkata Metro 1984, Delhi Metro Phase-I) to Communication-Based Train Control (CBTC) with moving-block operations enabling 90-second headways. Key signaling technologies include: (1) Alstom Urbalis 400 (Delhi Yellow/Green/Violet Lines, Mumbai Line-3, Chennai Blue Line), (2) Bombardier Cityflo 650 (Delhi Magenta/Pink Lines, Bangalore Purple Line), (3) Siemens Trainguard MT (Hyderabad Blue Line), (4) Thales SelTrac (Kochi Metro, upcoming Noida extension), and (5) Nippon Signal (Kolkata East-West underwater section). India\u2019s first fully driverless (GoA4 - Grade of Automation 4) metro operations are on Delhi Magenta Line (Botanical Garden to Janakpuri West, 38 km) and Pink Line (38 km), with unattended train operations (UTO) reducing staffing by 60% per train. Signaling spare parts logistics requires: (1) 24/7 availability for safety-critical components (track circuits, balises, interlocking relays, vital processors), (2) Dedicated vendor service level agreements (SLAs) with 4-hour response time for safety items, (3) Redundant architecture with dual-track circuits and fail-safe relay systems, and (4) Periodic firmware updates managed through secure USB-based deployment. Communication systems include: (1) TETRA-based radio for train-driver-dispatcher communication (800 MHz band), (2) Passenger information display systems (PIDS) at platforms and inside trains, (3) Passenger announcement systems (PAS) in 2-3 languages, (4) CCTV surveillance with AI-powered crowd density monitoring (Delhi Metro: 12,000+ cameras, centralized security operations center), and (5) Emergency communication with direct hotline to fire services. Signaling upgrade projects worth \u20b98,000 crore are underway across 8 networks, targeting 90-second headways on all corridors by 2028.",
  },
  {
    t: "Metro Station Facilities and Passenger Experience: Escalators, Fare Systems, and Accessibility",
    c: "India\u2019s metro stations serve 8 million daily passengers with infrastructure requiring dedicated logistics for: (1) Escalators and elevators (15,000+ units across all networks): major suppliers KONE, Otis, Schindler, and thyssenkrupp with annual maintenance requiring 500,000+ spare parts (handrails, step chains, motor drives, controllers), (2) Automatic Fare Collection (AFC) systems: 40,000+ fare gates using contactless smart cards (NCMC - National Common Mobility Card based on RuPay, interoperable across 13 metro networks + 100+ transit buses) and QR-code-based mobile ticketing (DMRC, CMRL), with gate replacement parts including card readers, flap mechanisms, and thermal printers, (3) Platform Screen Doors (PSDs): 8,000+ panels across 600+ stations for enhanced passenger safety (Delhi, Bangalore, Mumbai Line-3, Chennai Phase-2), (4) HVAC systems: 200,000+ TR capacity across underground stations with chillers, air handling units, and exhaust systems, (5) Fire detection and suppression: multi-sensor detectors, fire alarms, NOVEC 1230 clean agent systems, and sprinkler systems in depots. India\u2019s metro accessibility is improving under the Sugamya Bharat (Accessible India) initiative: (1) Tactile paving at all stations, (2) Wheelchair lifts and ramps (95% stations compliant), (3) Braille signage on handrails and buttons, (4) Hearing loop systems at ticket counters, and (5) Dedicated staff for assistance. The NCMC card initiative has achieved 100 million card issuances, enabling seamless transfers between metro, bus, and suburban rail networks. India\u2019s metro station logistics is managed through: (1) Centralized procurement by metro corporations, (2) Vendor-managed inventory at depot level, (3) Night-only installation during maintenance windows, and (4) Real-time asset management through IoT sensors on critical equipment.",
  },
];

export default function MetroRailLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: WORK_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "network", label: "Network", options: NETWORKS.map(n => ({ value: n, count: records.filter(r => r.network === n).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(r => r.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.workOrder.toLowerCase().includes(q) && !r.line.toLowerCase().includes(q) && !r.item.toLowerCase().includes(q) && !r.vendor.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof PartRecord] as string));
  });

  return (
    <div className="mrl-root p-6 space-y-6">
      <PageHeader title="Metro Rail Logistics" description="India metro rail spare parts supply chain, rolling stock bogie traction motor logistics, CBTC signaling equipment procurement, depot night maintenance window operations, and station facility escalator fare gate management across 13 networks" />
      <div className="mrl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`mrl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-cyan-800 text-white" : "text-gray-600 hover:bg-cyan-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="mrl-dash space-y-6">
          <div className="mrl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="mrl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 mrl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-cyan-800 mrl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 mrl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Parts Procurement (Units)</h3><BarChart data={monthlyProcurement} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="rolling" fill="#0e7490" radius={[4,4,0,0]} name="Rolling Stock" /><Bar dataKey="track" fill="#0891b2" radius={[4,4,0,0]} name="Track" /><Bar dataKey="signal" fill="#06b6d4" radius={[4,4,0,0]} name="Signal" /><Bar dataKey="electrical" fill="#22d3ee" radius={[4,4,0,0]} name="Electrical" /></BarChart></div>
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Parts Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Critical Spares Availability (%) vs 97% Target</h3><LineChart data={availabilityTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[90, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0e7490" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Line Performance Score</h3><BarChart data={linePerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[85, 100]} /><Tooltip /><Bar dataKey="v" fill="#0891b2" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="mrl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Metro Rail", href: "#" }, { label: "Parts Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="mrl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Work Order,Line,Category,Item,Qty,Unit,Vendor,Mode,Dispatch,Install,Transit (d),Value (\u20b9L),Critical,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Quality Hold" ? "mrl-row-critical bg-red-50" : r.status === "Under Testing" || r.status === "Pending Approval" ? "mrl-row-warning bg-amber-50" : r.status === "In Transit" ? "mrl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-cyan-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="mrl-badge inline-block px-2 py-0.5 rounded text-xs bg-cyan-800 text-white font-mono">{r.workOrder}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.line}</td>
                <td className="px-3 py-2"><span className="mrl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.item}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.quantity}</td>
                <td className="px-3 py-2 text-xs">{r.unit}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.vendor}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.installDate || <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 3 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-cyan-800">{r.valueLakhs}</td>
                <td className="px-3 py-2 text-center">{r.critical ? <span className="mrl-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">CRIT</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`mrl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="mrl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Supply Volume by Network</h3><BarChart data={NETWORKS.slice(0,6).map(n => ({ n: n.split(" ")[0], v: +ri(12, 45, 28 + Math.random() * 12).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0e7490" radius={[4,4,0,0]} name="Work Orders" /></BarChart></div>
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Procurement by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], rolling: ri(18, 35, 25 + Math.sin(i*0.5)*4), track: ri(10, 22, 15 + Math.cos(i*0.6)*3), signal: ri(6, 15, 10 + Math.sin(i*0.7)*2.5) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="rolling" stackId="1" stroke="#0e7490" fill="#cffafe" name="Rolling Stock" /><Area type="monotone" dataKey="track" stackId="1" stroke="#0891b2" fill="#a5f3fc" name="Track" /><Area type="monotone" dataKey="signal" stackId="1" stroke="#06b6d4" fill="#ecfeff" name="Signal" /></AreaChart></div>
          </div>
          <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Transport Mode</h3><BarChart data={[{n:"Rail Freight",v:4},{n:"Heavy Truck",v:2},{n:"Flatbed",v:1.5},{n:"Container",v:3},{n:"Courier",v:2},{n:"Air Cargo",v:1}].map(d => ({...d, v: +ri(d.v-0.3, d.v+0.5, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0891b2" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="mrl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="mrl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-cyan-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
