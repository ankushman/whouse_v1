"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#b91c1c", "#dc2626", "#ef4444", "#f87171", "#991b1b", "#7f1d1d", "#fca5a5", "#fecaca"];
const TERMINALS = ["CONCOR Dadri ICD", "CONCOR Tughlakabad", "CONCOR Whitefield BLR", "CONCOR Navlakha Indore", "DFCCIL Khurja", "IRFC Santragachi", "CRCL Ludhiana Freight", "Adani Kandla Port"];
const COMMODITIES = ["Coal", "Iron Ore", "Cement", "Fertilizer", "Foodgrains", "Petroleum", "Steel Coils", "Container (TEU)"];
const RAKE_STATUSES = ["Loaded Transit", "At Origin Yard", "At Destination", "Unloading", "Maintenance Hold", "Empty Return"];
const ZONES = ["Northern Railway", "Southern Railway", "Central Railway", "Western Railway", "Eastern Railway", "South Central", "South Eastern", "North Eastern"];
const TABS = ["Dashboard", "Rake Registry", "Freight Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Loaded Transit": "blue", "At Origin Yard": "slate", "At Destination": "green", "Unloading": "amber", "Maintenance Hold": "red", "Empty Return": "orange" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyFreight = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], coal: ri(42, 68, 55 + Math.sin(i * 0.5) * 8), ironOre: ri(18, 32, 25 + Math.cos(i * 0.6) * 4), cement: ri(12, 22, 17 + Math.sin(i * 0.7) * 3), containers: ri(8, 16, 12 + Math.cos(i * 0.8) * 2) }));
const commodityDist = [{ n: "Coal", v: 32 }, { n: "Iron Ore", v: 18 }, { n: "Cement", v: 12 }, { n: "Foodgrains", v: 14 }, { n: "Fertilizer", v: 10 }, { n: "Petroleum", v: 8 }, { n: "Steel", v: 4 }, { n: "Containers", v: 2 }];
const revenueTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +ri(4800, 7200, 5800 + Math.sin(i * 0.4) * 800).toFixed(0), target: 6200 }));
const zonePerf = ZONES.slice(0, 6).map(z => ({ n: z.split(" ")[0], v: +ri(72, 96, 84 + Math.random() * 8).toFixed(0) }));

interface RakeRecord { id: string; rakeNo: string; commodity: string; origin: string; destination: string; zone: string; terminal: string; wagons: number; tonnage: number; length: number; consignor: string; consignee: string; departDate: string; eta: string; ata: string; transitHours: number; status: string; detentions: number; freightRate: number; totalRevenue: number; remarks: string; }

const records: RakeRecord[] = [
  { id: "RFT-0001", rakeNo: "RKN/2025/0842", commodity: "Coal", origin: "Talcher Coalfield", destination: "NTPC Barh", zone: "Eastern Railway", terminal: "CONCR Dadri ICD", wagons: 58, tonnage: 4180, length: 780, consignor: "MCL Talcher", consignee: "NTPC Barh", departDate: "2025-01-10", eta: "2025-01-12", ata: "", transitHours: 48, status: "Loaded Transit", detentions: 0, freightRate: 1850, totalRevenue: 7733000, remarks: "Thermal coal rake for NTPC Barh supercritical plant" },
  { id: "RFT-0002", rakeNo: "RKN/2025/0915", commodity: "Iron Ore", origin: "Kiriburu Mines", destination: "Tata Steel Jamshedpur", zone: "South Eastern", terminal: "CONCOR Tughlakabad", wagons: 42, tonnage: 2940, length: 560, consignor: "SAIL Kiriburu", consignee: "Tata Steel Ltd", departDate: "2025-01-08", eta: "2025-01-09", ata: "2025-01-09", transitHours: 22, status: "At Destination", detentions: 1, freightRate: 2200, totalRevenue: 6468000, remarks: "Iron ore rake - delivered ahead of schedule" },
  { id: "RFT-0003", rakeNo: "RKN/2025/1023", commodity: "Cement", origin: "ACC Wadi Plant", destination: "Delhi ICF Khurja", zone: "Central Railway", terminal: "DFCCIL Khurja", wagons: 40, tonnage: 2400, length: 520, consignor: "ACC Ltd Wadi", consignee: "ICF Delhi Depot", departDate: "2025-01-14", eta: "2025-01-16", ata: "", transitHours: 36, status: "Loaded Transit", detentions: 0, freightRate: 1650, totalRevenue: 3960000, remarks: "Bulk cement rake for Delhi NCR construction demand" },
  { id: "RFT-0004", rakeNo: "RKN/2025/1078", commodity: "Foodgrains", origin: "FCI Karnal Silo", destination: "FCI Chennai Depot", zone: "Northern Railway", terminal: "CONCOR Whitefield BLR", wagons: 44, tonnage: 2640, length: 600, consignor: "FCI Punjab Region", consignee: "FCI Tamil Nadu", departDate: "2025-01-12", eta: "2025-01-15", ata: "2025-01-15", transitHours: 62, status: "At Destination", detentions: 2, freightRate: 1420, totalRevenue: 3748800, remarks: "Wheat rake PDS allocation - slight detention at Nagpur" },
  { id: "RFT-0005", rakeNo: "RKN/2025/1145", commodity: "Petroleum", origin: "IOCL Paradip", destination: "BPCL Mumbai", zone: "Eastern Railway", terminal: "Adani Kandla Port", wagons: 36, tonnage: 2160, length: 480, consignor: "IOCL Paradip Refinery", consignee: "BPCL Mahul", departDate: "2025-01-13", eta: "2025-01-14", ata: "", transitHours: 28, status: "Loaded Transit", detentions: 0, freightRate: 2800, totalRevenue: 6048000, remarks: "Petroleum product tanker rake - Class A inflammable" },
  { id: "RFT-0006", rakeNo: "RKN/2025/1201", commodity: "Fertilizer", origin: "IFFCO Kandla", destination: "IFFCO Phulpur UP", zone: "Western Railway", terminal: "CONCOR Navlakha Indore", wagons: 50, tonnage: 3000, length: 680, consignor: "IFFCO Kandla Unit", consignee: "IFFCO Phulpur", departDate: "2025-01-11", eta: "2025-01-13", ata: "", transitHours: 42, status: "At Origin Yard", detentions: 0, freightRate: 1580, totalRevenue: 4740000, remarks: "Urea rake for Rabi season dispatch" },
  { id: "RFT-0007", rakeNo: "RKN/2025/1267", commodity: "Steel Coils", origin: "JSW Vijayanagar", destination: "Maruti Suzuki Manesar", zone: "South Central", terminal: "CRCL Ludhiana Freight", wagons: 32, tonnage: 1920, length: 440, consignor: "JSW Steel Ltd", consignee: "Maruti Suzuki India", departDate: "2025-01-15", eta: "2025-01-17", ata: "", transitHours: 52, status: "Loaded Transit", detentions: 0, freightRate: 2100, totalRevenue: 4032000, remarks: "HR steel coils for auto body panels" },
  { id: "RFT-0008", rakeNo: "RKN/2025/1330", commodity: "Coal", origin: "Korba Coalfield", destination: "Adani Mundra Power", zone: "South Eastern", terminal: "IRFC Santragachi", wagons: 58, tonnage: 4180, length: 780, consignor: "SECL Korba", consignee: "Adani Power Mundra", departDate: "2025-01-09", eta: "2025-01-12", ata: "", transitHours: 68, status: "Loaded Transit", detentions: 0, freightRate: 1950, totalRevenue: 8151000, remarks: "Thermal coal long-haul Korba to Mundra - 1200 km" },
  { id: "RFT-0009", rakeNo: "RKN/2025/1388", commodity: "Container (TEU)", origin: "JNPT Mumbai", destination: "CONCOR Tughlakabad ICD", zone: "Central Railway", terminal: "CONCOR Tughlakabad", wagons: 20, tonnage: 1200, length: 600, consignor: "Maersk Line India", consignee: "Various ICD Importers", departDate: "2025-01-14", eta: "2025-01-14", ata: "2025-01-14", transitHours: 6, status: "Unloading", detentions: 1, freightRate: 3200, totalRevenue: 3840000, remarks: "Container double-stack - import laden TEUs ex-JNPT" },
  { id: "RFT-0010", rakeNo: "RKN/2025/1442", commodity: "Cement", origin: "UltraTech Kotputli", destination: "RDC Jaipur", zone: "Northern Railway", terminal: "DFCCIL Khurja", wagons: 40, tonnage: 2400, length: 520, consignor: "UltraTech Cement", consignee: "Jaipur Regional Depot", departDate: "2025-01-13", eta: "2025-01-13", ata: "2025-01-14", transitHours: 18, status: "At Destination", detentions: 3, freightRate: 1550, totalRevenue: 3720000, remarks: "Cement rake - detention at Jaipur yard due to congestion" },
  { id: "RFT-0011", rakeNo: "RKN/2025/1510", commodity: "Foodgrains", origin: "FCI Bhopal", destination: "FCI Patna", zone: "Central Railway", terminal: "CONCOR Navlakha Indore", wagons: 44, tonnage: 2640, length: 600, consignor: "FCI MP Region", consignee: "FCI Bihar Region", departDate: "2025-01-15", eta: "2025-01-16", ata: "", transitHours: 30, status: "Loaded Transit", detentions: 0, freightRate: 1380, totalRevenue: 3643200, remarks: "Rice rake PDS allocation for Bihar" },
  { id: "RFT-0012", rakeNo: "RKN/2025/1588", commodity: "Iron Ore", origin: "Donimalai Mines", destination: "KIOCL Mangalore", zone: "South Western", terminal: "CONCOR Whitefield BLR", wagons: 42, tonnage: 2940, length: 560, consignor: "NMDC Donimalai", consignee: "KIOCL Pellet Plant", departDate: "2025-01-07", eta: "2025-01-09", ata: "2025-01-10", transitHours: 56, status: "At Destination", detentions: 2, freightRate: 2050, totalRevenue: 6027000, remarks: "Iron ore for pelletization - delayed at Hassan junction" },
  { id: "RFT-0013", rakeNo: "RKN/2025/1642", commodity: "Petroleum", origin: "HPCL Mumbai", destination: "IOCL Kanpur", zone: "Western Railway", terminal: "CRCL Ludhiana Freight", wagons: 36, tonnage: 2160, length: 480, consignor: "HPCL Mumbai Refinery", consignee: "IOCL Kanpur Depot", departDate: "2025-01-16", eta: "2025-01-17", ata: "", transitHours: 24, status: "At Origin Yard", detentions: 0, freightRate: 2650, totalRevenue: 5724000, remarks: "MS/HSD petroleum rake for UP market supply" },
  { id: "RFT-0014", rakeNo: "RKN/2025/1710", commodity: "Fertilizer", origin: "NFL Bathinda", destination: "IFFCO Naya Nangal", zone: "Northern Railway", terminal: "CRCL Ludhiana Freight", wagons: 50, tonnage: 3000, length: 680, consignor: "NFL Bathinda", consignee: "IFFCO Naya Nangal", departDate: "2025-01-11", eta: "2025-01-12", ata: "", transitHours: 16, status: "Maintenance Hold", detentions: 0, freightRate: 1480, totalRevenue: 4440000, remarks: "DAP fertilizer rake - wagon axle defect hold at Ludhiana" },
];

const transitCount = records.filter(r => r.status === "Loaded Transit" || r.status === "At Origin Yard").length;
const holdCount = records.filter(r => r.status === "Maintenance Hold" || r.status === "Unloading").length;
const deliveredCount = records.filter(r => r.status === "At Destination").length;
const totalRevenue = records.reduce((s, r) => s + r.totalRevenue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

function fmtTon(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}KT`;
  return `${n}T`;
}

const kpis = [
  { l: "Rakes In Transit", v: transitCount, s: "loaded or at yard" },
  { l: "Hold / Unloading", v: holdCount, s: "pending action" },
  { l: "Delivered", v: deliveredCount, s: "at destination" },
  { l: "Total Freight Revenue", v: fmtVal(totalRevenue), s: "across all rakes" },
];

const INSIGHTS = [
  {
    t: "Indian Railways Freight: 1,518 MT Loading Target and Revenue Growth",
    c: "Indian Railways is the backbone of India\u2019s freight logistics, handling approximately 1,518 million tonnes (MT) of freight loading in FY2024-25, generating freight revenue of approximately \u20b91,82,000 crore (USD 22 billion). The Railway Board has set an ambitious freight loading target of 1,600 MT for FY2025-26, requiring 5.4% growth driven by coal (780 MT, 52% share), iron ore (195 MT), cement (168 MT), foodgrains (155 MT), fertilizer (145 MT), and petroleum products (105 MT). Indian Railways operates a fleet of over 3,20,000 freight wagons across 67,956 route kilometers, with 12,000+ freight trains running daily. The freight modal share has increased from 27% in FY2019 to 33% in FY2024, driven by the National Rail Plan 2030 which targets 45% modal share for rail freight. Key policy initiatives include: (1) PM Gati Shakti National Master Plan for multi-modal coordination, (2) Dedicated Freight Corridor Corporation of India (DFCCIL) with 3,306 km of Western and Eastern DFCs operational, (3) private freight terminal (PFT) policy allowing private investment in freight handling, (4) automobile carrier train (ACT) services for finished vehicle logistics, and (5) Kisan Rail services for perishable agricultural produce transport. The average freight lead (distance) is 680 km, with average wagon turnaround time of 5.2 days (target: 4.5 days by 2027). Freight speed has improved from 22 kmph in FY2020 to 28 kmph in FY2024 due to DFC operations and timetable rationalization.",
  },
  {
    t: "CONCOR and Container Rail: ICD Network and Double-Stack Operations",
    c: "Container Corporation of India (CONCOR), a Navratna PSU under Indian Railways, is India\u2019s largest container rail operator, handling approximately 3.8 million TEUs (Twenty-foot Equivalent Units) annually across a network of 82+ Inland Container Depots (ICDs) and Container Freight Stations (CFSs). CONCOR operates over 280 scheduled rail services per week connecting major ports (JNPT Mumbai, Mundra Kandla, Chennai, Krishnapatnam, V.O. Chidambaranar Tuticorin) to hinterland ICDs at Tughlakabad Delhi, Dadri NCR, Whitefield Bengaluru, Navlakha Indore, Santragachi Kolkata, and Ludhiana Punjab. The double-stack container train operations on the Western DFC (JNPT to Dadri, 1,504 km) have reduced transit time from 60 hours to 28 hours, a 53% improvement, while increasing per-train capacity from 90 TEUs to 210 TEUs (2+1 double-stack configuration). CONCOR\u2019s key business segments include: (1) EXIM container rail (55% of revenue), (2) domestic container rail (30%), and (3) warehousing and CFS operations (15%). The average rail-shipper cost per TEU for JNPT-Delhi corridor is \u20b928,000-35,000 via rail versus \u20b942,000-55,000 via road, providing 35-40% cost savings for hinterland container movement. CONCOR has deployed GPS-enabled tracking on 100% of its trains, providing real-time ETAs to freight forwarders and shipping lines. The company is expanding its refrigerated container (reefer) capacity to meet growing pharma and perishable demand, with 450 reefer plugs at major ICDs. Private terminal operators like Adani Logistics (8 ICDs), DP World (5 terminals), and Gateway Distriparks (4 terminals) are adding 15,000+ TEU annual capacity, creating competitive rail logistics pricing.",
  },
  {
    t: "DFCCIL Dedicated Freight Corridors: Speed and Capacity Revolution",
    c: "The Dedicated Freight Corridor Corporation of India (DFCCIL) has transformed Indian rail freight with 3,306 km of operational dedicated freight corridors: (1) Western DFC (1,504 km, Jawaharlal Nehru Port Trust Mumbai to Dadri UP) and (2) Eastern DFC (1,802 km, Ludhiana Punjab to Dankuni West Bengal). These corridors feature 2x25 kV AC electrification, 100+ kmph design speed (operational 75 kmph), axle load of 32.5 tonnes (versus 22.9 tonnes on Indian Railways network), and Automated Train Protection (ATP) with European Train Control System Level 2 (ETCS L2). The DFCs have reduced freight transit times by 40-60% on key corridors: Mumbai-Delhi from 60 hours to 28 hours, Ludhania-Kolkata from 48 hours to 22 hours. Each DFC train can carry 13,000 tonnes of freight (double-stack container) versus 3,500 tonnes on conventional Indian Railways, a 3.7x capacity increase. DFCCIL has achieved a peak performance of 220 freight trains per day (130 Western + 90 Eastern), handling approximately 180 MT of freight annually. The Government of India has approved Phase 2 extensions: (1) East Coast DFC (Kharagpur to Vishakapatnam, 800 km), (2) North-South DFC (Delhi to Chennai via Itarsi, 2,300 km), and (3) East-West DFC (Kolkata to Mumbai, 1,100 km). These extensions will add 4,200 km to the DFC network, increasing total freight capacity to 550 MT by 2030. DFCCIL\u2019s revenue model includes: (1) user charges (per-wagon-km rates), (2) terminal handling charges at freight stations, (3) locomotive hire charges for private operators, and (4) siding and last-mile connectivity charges. The DFC network has decongested the Indian Railways main line network, releasing capacity for 60 additional passenger trains per day on the Mumbai-Delhi corridor alone.",
  },
  {
    t: "Freight Modernization: Wagon Technology, Digitization and Green Logistics",
    c: "Indian Railways is modernizing its freight operations through advanced wagon technology, digital platforms, and green logistics initiatives. The wagon fleet is being upgraded with: (1) BOXNHL high-speed wagons (90 kmph, 80-tonne payload) for coal and iron ore, (2) BCACBM covered hopper wagons for foodgrains and fertilizer (weatherproof, gravity discharge), (3) BLC flat wagons for container double-stack operations, and (4) BIT tank wagons for petroleum and chemical transport. The total wagon procurement target is 30,000 wagons per year under the National Rail Plan 2030. Digitization initiatives include: (1) FOIS (Freight Operations Information System) processing 12,000+ freight bills daily, (2) Rail Madad freight grievance portal with 72-hour resolution SLA, (3) UTS-based freight booking and tracking app for consignors, (4) RFID-based wagon tracking at 2,500+ railway stations, and (5) VIKRAM (Virtual Integrated KRANI for Automated Monitoring) AI-based anomaly detection for wagon maintenance. Green logistics initiatives include: (1) 100% electrification target for all Broad Gauge routes by December 2024 (achieved 95%+), (2) hydrogen fuel cell locomotive trials on the Northern Railway, (3) solar-powered freight terminals at 25 locations, (4) WAG-12B 12,000 HP electric locomotives (500 deployed, total order: 1,800) replacing diesel locomotives, reducing carbon emissions by 3.5 million tonnes per year. Indian Railways freight emissions intensity has improved from 45 gCO2/tonne-km in FY2020 to 32 gCO2/tonne-km in FY2024, targeting 22 gCO2/tonne-km by 2030. The integration of IoT sensors on critical wagons for condition-based monitoring (CBM) has reduced wagon breakdown incidents by 45% in the past 3 years.",
  },
];

export default function RailwayFreightTerminalView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: RAKE_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "commodity", label: "Commodity", options: COMMODITIES.map(c => ({ value: c, count: records.filter(r => r.commodity === c).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "terminal", label: "Terminal", options: TERMINALS.map(t => ({ value: t, count: records.filter(r => r.terminal === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.rakeNo.toLowerCase().includes(q) && !r.commodity.toLowerCase().includes(q) && !r.consignor.toLowerCase().includes(q) && !r.consignee.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof RakeRecord] as string));
  });

  return (
    <div className="rft-root p-6 space-y-6">
      <PageHeader title="Railway Freight Terminal" description="Indian Railways freight rake operations, CONCOR container logistics, DFCCIL dedicated freight corridors, commodity-wise loading analytics, terminal management, and freight revenue tracking across 8 zonal railways" />
      <div className="rft-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`rft-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-red-800 text-white" : "text-gray-600 hover:bg-red-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="rft-dash space-y-6">
          <div className="rft-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="rft-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 rft-kpi-label">{k.l}</div><div className="text-2xl font-bold text-red-800 rft-kpi-val">{k.v}</div><div className="text-xs text-gray-400 rft-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="rft-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Freight Loading (MT)</h3><BarChart data={monthlyFreight} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="coal" fill="#b91c1c" radius={[4,4,0,0]} name="Coal" /><Bar dataKey="ironOre" fill="#dc2626" radius={[4,4,0,0]} name="Iron Ore" /><Bar dataKey="cement" fill="#ef4444" radius={[4,4,0,0]} name="Cement" /><Bar dataKey="containers" fill="#f87171" radius={[4,4,0,0]} name="Containers" /></BarChart></div>
            <div className="rft-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Commodity Loading Distribution</h3><PieChart width={400} height={220}><Pie data={commodityDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{commodityDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="rft-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Freight Revenue vs Target (\u20b9Cr/month)</h3><LineChart data={revenueTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[4000, 8000]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#b91c1c" strokeWidth={2} name="Actual (\u20b9Cr)" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="rft-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Zone Loading Performance (%)</h3><BarChart data={zonePerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[60, 100]} /><Tooltip /><Bar dataKey="v" fill="#dc2626" radius={[4,4,0,0]} name="Punctuality %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="rft-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Railway Freight", href: "#" }, { label: "Rake Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="rft-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Rake No,Commodity,Origin,Destination,Zone,Terminal,Wagons,Tonnage (T),Consignor,Consignee,Depart,ETA,ATA,Transit (h),Status,Detentions,Rate/T,Revenue,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Maintenance Hold" ? "rft-row-critical bg-red-50" : r.status === "Unloading" ? "rft-row-warning bg-amber-50" : r.status === "Loaded Transit" ? "rft-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-red-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="rft-badge inline-block px-2 py-0.5 rounded text-xs bg-red-800 text-white font-mono">{r.rakeNo}</span></td>
                <td className="px-3 py-2"><span className="rft-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.commodity}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.destination}</td>
                <td className="px-3 py-2 text-xs">{r.zone}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.terminal}</td>
                <td className="px-3 py-2 text-xs text-center">{r.wagons}</td>
                <td className="px-3 py-2 text-xs font-semibold">{fmtTon(r.tonnage)}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.consignor}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.consignee}</td>
                <td className="px-3 py-2 text-xs">{r.departDate}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2 text-xs">{r.ata || <span className="text-red-300">\u2014</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitHours > 48 ? "text-red-600" : r.transitHours > 24 ? "text-amber-600" : "text-green-600"}`}>{r.transitHours}h</span></td>
                <td className="px-3 py-2"><span className={`rft-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-center"><span className={r.detentions > 1 ? "text-red-600 font-semibold" : "text-gray-500"}>{r.detentions}</span></td>
                <td className="px-3 py-2 text-xs font-semibold">{fmtVal(r.freightRate)}</td>
                <td className="px-3 py-2 text-xs font-semibold text-red-700">{fmtVal(r.totalRevenue)}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="rft-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="rft-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Loading Volume by Commodity</h3><BarChart data={COMMODITIES.slice(0,6).map(c => ({ n: c.split(" ")[0], v: +ri(120, 480, 280 + Math.random() * 140).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#b91c1c" radius={[4,4,0,0]} name="Rakes" /></BarChart></div>
            <div className="rft-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Loading by Zone Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], northern: ri(320, 580, 440 + Math.sin(i*0.5)*80), southern: ri(180, 340, 250 + Math.cos(i*0.6)*50), eastern: ri(220, 420, 310 + Math.sin(i*0.7)*60) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="northern" stackId="1" stroke="#b91c1c" fill="#fecaca" name="Northern" /><Area type="monotone" dataKey="southern" stackId="1" stroke="#dc2626" fill="#fca5a5" name="Southern" /><Area type="monotone" dataKey="eastern" stackId="1" stroke="#ef4444" fill="#fee2e2" name="Eastern" /></AreaChart></div>
          </div>
          <div className="rft-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Hours by Route</h3><BarChart data={[{n:"DEL-BOM",v:18},{n:"DEL-MAA",v:32},{n:"BOM-HYD",v:14},{n:"CAL-DEL",v:28},{n:"BOM-SBC",v:22},{n:"NDL-HWH",v:24}].map(d => ({...d, v: +ri(d.v-4, d.v+6, d.v + Math.random()*5).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#dc2626" radius={[4,4,0,0]} name="Hours" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="rft-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="rft-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-red-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
