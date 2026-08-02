"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0369a1", "#0ea5e9", "#38bdf8", "#7dd3fc", "#075985", "#0c4a6e", "#0284c7", "#bae6fd"];
const CONTAINER_TYPES = ["20ft GP", "40ft GP", "40ft HC", "20ft Reefer", "40ft Reefer HC", "20ft Tank", "40ft Open Top", "45ft HC"];
const CONTAINER_STATUS = ["In-Yard", "Gate-In Transit", "Under Customs", "Loading", "Gate-Out Transit", "Released"];
const ICD_LOCATIONS = ["ICD Tughlakabad Delhi", "ICD Dadri NCR", "CFS Mumbai Nhava Sheva", "ICD Chennai Irungattukottai", "ICD Bangalore Whitefield", "ICD Kolkata Dankuni", "ICD Hyderabad Patancheru", "ICD Pune Chakan"];
const TRADE_TYPES = ["EXIM Export", "EXIM Import", "Domestic FCL", "Domestic LCL", "Transshipment", "Empty Repositioning"];
const TABS = ["Dashboard", "Container Registry", "Yard Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", sky: "bg-sky-100 text-sky-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "In-Yard": "green", "Gate-In Transit": "sky", "Under Customs": "amber", Loading: "orange", "Gate-Out Transit": "sky", Released: "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyTEU = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], exim: ri(320, 620, 460 + Math.sin(i * 0.5) * 120), domestic: ri(140, 320, 220 + Math.cos(i * 0.6) * 50), empty: ri(30, 80, 50 + Math.sin(i * 0.8) * 15) }));
const typeDist = CONTAINER_TYPES.slice(0, 6).map((t, i) => ({ n: t, v: ri(45, 180, 110 - i * 12) }));
const utilizationTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], utilized: ri(72, 94, 82 + Math.sin(i * 0.4) * 6), capacity: ri(85, 100, 92 + Math.cos(i * 0.3) * 3) }));
const dwellTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], avgDays: +(ri(4.2, 8.8, 6.2 - i * 0.15)).toFixed(1), target: 5.0 }));
const icdVol = ICD_LOCATIONS.map(l => ({ n: l.split(" ").slice(0, 2).join(" "), v: ri(180, 620, 380 + Math.random() * 180) }));

interface ContainerRecord { id: string; containerNo: string; type: string; size: string; status: string; location: string; tradeType: string; shippingLine: string; berthVessel: string; gateIn: string; dwellDays: number; customsStatus: string; hazmat: boolean; reeferTemp: number | null; weight: number; vgm: number; sealNo: string; }

const records: ContainerRecord[] = [
  { id: "ICY-0001", containerNo: "MSKU-2847316", type: "40ft HC", size: "40HC", status: "In-Yard", location: "ICD Tughlakabad Delhi", tradeType: "EXIM Import", shippingLine: "Maersk", berthVessel: "Madison Maersk / 340W", gateIn: "2025-01-12 06:30", dwellDays: 3, customsStatus: "Cleared", hazmat: false, reeferTemp: null, weight: 18500, vgm: 19200, sealNo: "ML-2847316-IN" },
  { id: "ICY-0002", containerNo: "TEMU-4912058", type: "20ft Reefer", size: "20RF", status: "Under Customs", location: "CFS Mumbai Nhava Sheva", tradeType: "EXIM Export", shippingLine: "MSC", berthVessel: "MSC Gulsun / 052E", gateIn: "2025-01-10 14:15", dwellDays: 5, customsStatus: "Examination", hazmat: false, reeferTemp: -18.2, weight: 12400, vgm: 12800, sealNo: "MS-4912058-EX" },
  { id: "ICY-0003", containerNo: "HLCU-7823451", type: "20ft GP", size: "20GP", status: "Loading", location: "ICD Chennai Irungattukottai", tradeType: "EXIM Export", shippingLine: "Hapag-Lloyd", berthVessel: "MV Berlin Express / 189N", gateIn: "2025-01-13 09:45", dwellDays: 2, customsStatus: "Cleared", hazmat: false, reeferTemp: null, weight: 22100, vgm: 22500, sealNo: "HL-7823451-EX" },
  { id: "ICY-0004", containerNo: "EISU-1290843", type: "40ft GP", size: "40GP", status: "Gate-In Transit", location: "ICD Dadri NCR", tradeType: "Domestic FCL", shippingLine: "Concor", berthVessel: "Rail Rake DKY-3204", gateIn: "2025-01-15 11:20", dwellDays: 0, customsStatus: "N/A", hazmat: true, reeferTemp: null, weight: 26800, vgm: 27400, sealNo: "EC-1290843-DO" },
  { id: "ICY-0005", containerNo: "CSLU-5628901", type: "40ft Reefer HC", size: "40RH", status: "In-Yard", location: "ICD Bangalore Whitefield", tradeType: "EXIM Import", shippingLine: "CMA CGM", berthVessel: "CMA Marco Polo / 078S", gateIn: "2025-01-11 07:50", dwellDays: 4, customsStatus: "Cleared", hazmat: false, reeferTemp: 2.1, weight: 16200, vgm: 16800, sealNo: "CM-5628901-IN" },
  { id: "ICY-0006", containerNo: "OOLU-3982145", type: "20ft Tank", size: "20TK", status: "Under Customs", location: "ICD Kolkata Dankuni", tradeType: "EXIM Import", shippingLine: "OOCL", berthVessel: "OOCL Berlin / 211W", gateIn: "2025-01-09 16:30", dwellDays: 6, customsStatus: "Hold - API", hazmat: true, reeferTemp: null, weight: 24300, vgm: 25000, sealNo: "OO-3982145-IN" },
  { id: "ICY-0007", containerNo: "YMMU-6712903", type: "40ft Open Top", size: "40OT", status: "Gate-Out Transit", location: "ICD Pune Chakan", tradeType: "Domestic FCL", shippingLine: "Concor", berthVessel: "Road Trailer MH-14-AB-1234", gateIn: "2025-01-14 08:10", dwellDays: 1, customsStatus: "N/A", hazmat: false, reeferTemp: null, weight: 31200, vgm: 31800, sealNo: "YM-6712903-DO" },
  { id: "ICY-0008", containerNo: "FCIU-9021347", type: "20ft GP", size: "20GP", status: "Released", location: "ICD Hyderabad Patancheru", tradeType: "Empty Repositioning", shippingLine: "Evergreen", berthVessel: "MV Ever Fortune / 142E", gateIn: "2025-01-13 13:40", dwellDays: 2, customsStatus: "N/A", hazmat: false, reeferTemp: null, weight: 2240, vgm: 2240, sealNo: "EV-9021347-MT" },
  { id: "ICY-0009", containerNo: "BKKU-4187620", type: "40ft HC", size: "40HC", status: "In-Yard", location: "ICD Tughlakabad Delhi", tradeType: "EXIM Export", shippingLine: "COSCO", berthVessel: "COSCO Faith / 429E", gateIn: "2025-01-15 05:25", dwellDays: 0, customsStatus: "Pending Filing", hazmat: false, reeferTemp: null, weight: 19600, vgm: 20100, sealNo: "CS-4187620-EX" },
  { id: "ICY-0010", containerNo: "TCLU-7234956", type: "40ft GP", size: "40GP", status: "Loading", location: "CFS Mumbai Nhava Sheva", tradeType: "Transshipment", shippingLine: "HMM", berthVessel: "HMM Copenhagen / 288N", gateIn: "2025-01-12 10:55", dwellDays: 3, customsStatus: "Cleared", hazmat: false, reeferTemp: null, weight: 28100, vgm: 28700, sealNo: "HM-7234956-TR" },
  { id: "ICY-0011", containerNo: "SUDU-1356792", type: "20ft Reefer", size: "20RF", status: "In-Yard", location: "ICD Chennai Irungattukottai", tradeType: "EXIM Import", shippingLine: "Yang Ming", berthVessel: "YM Wellness / 156W", gateIn: "2025-01-14 12:30", dwellDays: 1, customsStatus: "Cleared", hazmat: false, reeferTemp: -25.0, weight: 8900, vgm: 9200, sealNo: "YM-1356792-IN" },
  { id: "ICY-0012", containerNo: "GSNU-8923451", type: "45ft HC", size: "45HC", status: "Under Customs", location: "ICD Bangalore Whitefield", tradeType: "EXIM Import", shippingLine: "GSN", berthVessel: "GSN Voyager / 089E", gateIn: "2025-01-10 08:00", dwellDays: 5, customsStatus: "Physical Exam", hazmat: false, reeferTemp: null, weight: 21200, vgm: 21800, sealNo: "GS-8923451-IN" },
  { id: "ICY-0013", containerNo: "KKFU-5048217", type: "40ft GP", size: "40GP", status: "Gate-In Transit", location: "ICD Dadri NCR", tradeType: "EXIM Export", shippingLine: "KMTC", berthVessel: "KMTC Tokyo / 194W", gateIn: "2025-01-15 15:10", dwellDays: 0, customsStatus: "Pending Filing", hazmat: true, reeferTemp: null, weight: 25600, vgm: 26200, sealNo: "KM-5048217-EX" },
  { id: "ICY-0014", containerNo: "XINU-6781234", type: "20ft GP", size: "20GP", status: "Released", location: "ICD Kolkata Dankuni", tradeType: "Domestic LCL", shippingLine: "Concor", berthVessel: "Rail Rake KOA-1208", gateIn: "2025-01-13 10:00", dwellDays: 2, customsStatus: "N/A", hazmat: false, reeferTemp: null, weight: 8400, vgm: 8600, sealNo: "XI-6781234-DO" },
];

const inYardCount = records.filter(r => r.status === "In-Yard" || r.status === "Under Customs").length;
const totalTEU = records.reduce((s, r) => s + (r.size.startsWith("45") ? 2.25 : r.size.startsWith("40") ? 2 : 1), 0);
const avgDwell = (records.reduce((s, r) => s + r.dwellDays, 0) / records.length).toFixed(1);
const reeferCount = records.filter(r => r.reeferTemp !== null).length;

const kpis = [
  { l: "Containers in Yard", v: inYardCount, s: "of 14 total" },
  { l: "Total TEU", v: totalTEU.toFixed(1), s: "20ft equiv units" },
  { l: "Avg Dwell Time", v: `${avgDwell} days`, s: `target: 5.0 days` },
  { l: "Active Reefers", v: reeferCount, s: "monitored units" },
];

const INSIGHTS = [
  {
    t: "India ICD Network Handles 18 Lakh TEUs Annually Through 161 Facilities",
    c: "India\u2019s Inland Container Depot (ICD) network, operated primarily by Container Corporation of India Ltd (CONCOR) under Indian Railways and 42 private operators including Adani Logistics, DP World, and Navkar Corporation, processed approximately 18 lakh TEUs in FY2024-25 across 161 notified ICDs and Container Freight Stations (CFSs) under the customs jurisdiction of the Central Board of Indirect Taxes and Customs (CBIC). The top 5 ICDs by volume \u2014 ICD Tughlakabad (Delhi), ICD Dadri (NCR), CFS Nhava Sheva (JNPT), ICD Irungattukottai (Chennai), and ICD Whitefield (Bangalore) \u2014 collectively handle 62% of India\u2019s total ICD throughput, with Tughlakabad alone processing 3.2 lakh TEUs annually. CONCOR operates 59 ICDs with 78 rakes (train sets) providing daily rail connectivity from major ports to hinterland ICDs, achieving an average transit time of 48-72 hours from JNPT to Tughlakabad via the Western Dedicated Freight Corridor (WDFC). The operational efficiency metric of dwell time \u2014 the average duration a container spends in an ICD from gate-in to gate-out \u2014 varies significantly across facilities: well-automated ICDs achieve 3.5-5.0 days average dwell, while congested facilities average 7-12 days. India\u2019s target under the National Logistics Policy is to reduce average ICD dwell time to below 4.5 days by 2027 through EDI-based customs processing, RFID gate automation, and direct port delivery (DPD) integration that eliminates unnecessary ICD handling for export containers.",
  },
  {
    t: "Reefer Container Monitoring: Cold Chain Integrity at ICDs",
    c: "India\u2019s cold chain logistics sector moves approximately 6.5 lakh reefer TEUs annually through ICDs, with pharmaceutical exports (vaccines, biologics, temperature-sensitive APIs) and perishable food imports (fruits, meat, dairy) constituting 72% and 22% of reefer volumes respectively. Each reefer container at an ICD requires continuous temperature monitoring with ±0.5\u00b0C accuracy, power supply backup with automatic generator switchover within 30 seconds, and pre-trip inspection (PTI) compliance per the CTU Code of Practice. India\u2019s pharma export corridor from ICD Bangalore to JNPT handles temperature-sensitive shipments requiring 2-8\u00b0C cold chain integrity, with GPS-enabled IoT sensors providing real-time temperature telemetry at 5-minute intervals through the entire ICD-to-port transit chain. Non-compliant reefer containers (temperature excursions exceeding 30 minutes or power interruptions exceeding 5 minutes) result in shipment rejection rates of 8-12% for pharma exports, with average claim values of \u20b912-18 lakh per container. Leading ICD operators like Adani Logistics and DP World have deployed AI-powered reefer management systems that predict compressor failures 6-8 hours in advance, enabling proactive maintenance that reduces reefer-related cargo damage claims by 65% and power consumption by 22% through optimized set-point management based on cargo type and ambient conditions.",
  },
  {
    t: "Customs Bonded Area Management and AEO Integration",
    c: "India\u2019s ICDs operate as Customs Bonded Areas under Section 65 of the Customs Act 1962, requiring stringent cargo security and documentation compliance including Risk Management System (RMS) scoring, Indian Customs EDI System (ICES) integration, and Authorized Economic Operator (AEO) program compliance. India\u2019s AEO program, operational since 2018 with 3 tiers (AEO-T1, T2, T3), provides certified cargo handlers and logistics operators with fast-track customs clearance (60% fewer physical examinations), self-assessment for duty payments, and extended warehouse storage periods up to 90 days without duty payment. As of January 2025, India has 1,240 AEO-certified entities, including 85 ICDs and 420 freight forwarders. For ICD operators, AEO-T2/T3 certification enables direct port delivery (DPD) for export cargo, where containers bypass CFS examination and proceed directly to the port terminal, reducing export transit time by 24-36 hours and saving \u20b94,000-6,000 per container in handling charges. The integration of RFID-based container tracking within bonded areas, combined with ICES 1.0 real-time customs messaging, has achieved a 92% straight-through processing rate for AEO-certified shipments at major ICDs, compared to 68% for non-AEO shipments that face additional RMS-flagged physical examination requirements.",
  },
  {
    t: "Rail-Road Connectivity: CONCOR Rake Operations and DFC Integration",
    c: "The Dedicated Freight Corridor (DFC) network, comprising the Western DFC (1,504 km from Jawaharlal Nehru Port to Rewari) and Eastern DFC (1,856 km from Ludhiana to Dankuni), has fundamentally transformed ICD-to-port container movement in India. Before DFC commissioning (Phase 1 operational from 2023), CONCOR\u2019s single-stack container trains ran at 30-40 kmph with average transit times of 96-120 hours from JNPT to Delhi ICD. Post-DFC, double-stack container trains operate at 60-80 kmph, reducing JNPT-Tughlakabad transit to 48-56 hours \u2014 a 52% improvement. The WDFC can handle 3,400 TEU per train (double-stack) compared to 900 TEU on the old rail network, with CONCOR operating 18 daily double-stack services on the Western DFC alone. For ICD operators, DFC connectivity means improved vessel-connection reliability: containers loaded on a morning CONCOR rake at JNPT can reach Delhi ICD within 48 hours, enabling same-day delivery to NCR warehouses. The cost differential is equally significant \u2014 rail transport via DFC at \u20b91.2-1.8 per ton-km versus road transport at \u20b92.8-4.5 per ton-km translates to 50-60% savings for long-haul ICD-to-port movements. Advanced analytics for rake planning using machine learning models trained on 36 months of container booking data achieve 88% prediction accuracy for weekly rake demand at each ICD, enabling proactive positioning of empty containers and reducing empty repositioning costs by 30%.",
  },
];

export default function IcdContainerYardIntelligenceView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "type", label: "Type", options: CONTAINER_TYPES.map(t => ({ value: t, count: records.filter(r => r.type === t).length })) },
    { key: "status", label: "Status", options: CONTAINER_STATUS.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "location", label: "ICD", options: ICD_LOCATIONS.map(l => ({ value: l, count: records.filter(r => r.location === l).length })) },
    { key: "tradeType", label: "Trade", options: TRADE_TYPES.map(t => ({ value: t, count: records.filter(r => r.tradeType === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.containerNo.toLowerCase().includes(q) && !r.shippingLine.toLowerCase().includes(q) && !r.berthVessel.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(
      ([k, vs]) => vs.includes(r[k as keyof ContainerRecord] as string)
    );
  });

  return (
    <div className="icy-root p-6 space-y-6">
      <PageHeader
        title="ICD Container Yard Intelligence"
        description="Inland Container Depot operations, container placement tracking, reefer monitoring, customs bonded area management and CONCOR rake analytics"
      />
      <div className="icy-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`icy-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-sky-50"}`}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="icy-dash space-y-6">
          <div className="icy-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.l} className="icy-kpi bg-white rounded-lg border p-4">
                <div className="text-xs text-gray-500 icy-kpi-label">{k.l}</div>
                <div className="text-2xl font-bold text-sky-700 icy-kpi-val">{k.v}</div>
                <div className="text-xs text-gray-400 icy-kpi-sub">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="icy-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly TEU Throughput (EXIM / Domestic / Empty)</h3>
              <BarChart data={monthlyTEU} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="exim" fill="#0369a1" radius={[4, 4, 0, 0]} name="EXIM" />
                <Bar dataKey="domestic" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Domestic" />
                <Bar dataKey="empty" fill="#bae6fd" radius={[4, 4, 0, 0]} name="Empty" />
              </BarChart>
            </div>
            <div className="icy-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Container Type Distribution</h3>
              <PieChart width={400} height={220}>
                <Pie data={typeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="icy-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Yard Utilization vs Capacity Trend</h3>
              <AreaChart data={utilizationTrend} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis domain={[60, 100]} /><Tooltip /><Legend />
                <Area type="monotone" dataKey="utilized" stroke="#0369a1" fill="#e0f2fe" name="Utilized %" />
                <Area type="monotone" dataKey="capacity" stroke="#0ea5e9" fill="#bae6fd" name="Capacity %" />
              </AreaChart>
            </div>
            <div className="icy-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Average Dwell Time vs Target</h3>
              <LineChart data={dwellTrend} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis domain={[2, 10]} /><Tooltip /><Legend />
                <Line type="monotone" dataKey="avgDays" stroke="#0369a1" strokeWidth={2} name="Avg Dwell" />
                <Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="icy-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "ICD", href: "#" }, { label: "Container Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="icy-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {"ID,Container No,Type,Status,Location,Trade,Line,Vessel,Gate-In,Dwell,Customs,Hazmat,Reefer,Weight,VGM,Seal"
                    .split(",").map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const rowCls = r.status === "Under Customs" ? "icy-row-warning bg-amber-50" : "";
                  return (
                    <tr key={r.id} className={`border-b hover:bg-sky-50/50 ${rowCls}`}>
                      <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                      <td className="px-3 py-2"><span className="icy-badge inline-block px-2 py-0.5 rounded text-xs bg-sky-100 text-sky-700 font-mono">{r.containerNo}</span></td>
                      <td className="px-3 py-2"><span className="icy-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.type}</span></td>
                      <td className="px-3 py-2"><span className={`icy-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                      <td className="px-3 py-2 text-xs">{r.location}</td>
                      <td className="px-3 py-2"><span className="icy-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">{r.tradeType}</span></td>
                      <td className="px-3 py-2 text-xs">{r.shippingLine}</td>
                      <td className="px-3 py-2 text-xs">{r.berthVessel.split(" / ")[0]}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{r.gateIn}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${r.dwellDays > 4 ? "bg-red-100 text-red-700" : r.dwellDays > 2 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                          {r.dwellDays}d
                        </span>
                      </td>
                      <td className="px-3 py-2"><span className={`icy-badge inline-block px-2 py-0.5 rounded text-xs ${r.customsStatus === "Cleared" || r.customsStatus === "N/A" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{r.customsStatus}</span></td>
                      <td className="px-3 py-2">{r.hazmat ? <span className="icy-badge inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">DG</span> : <span className="text-slate-400 text-xs">No</span>}</td>
                      <td className="px-3 py-2">
                        {r.reeferTemp !== null ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${r.reeferTemp < 0 ? "bg-blue-100 text-blue-700" : r.reeferTemp < 5 ? "bg-cyan-100 text-cyan-700" : "bg-green-100 text-green-700"}`}>
                            {r.reeferTemp}\u00b0C
                          </span>
                        ) : <span className="text-slate-400 text-xs">N/A</span>}
                      </td>
                      <td className="px-3 py-2 text-xs">{(r.weight / 1000).toFixed(1)}T</td>
                      <td className="px-3 py-2 text-xs">{(r.vgm / 1000).toFixed(1)}T</td>
                      <td className="px-3 py-2"><span className="icy-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 font-mono">{r.sealNo}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="icy-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="icy-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">TEU Volume by ICD Location</h3>
              <BarChart data={icdVol} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip />
                <Bar dataKey="v" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
            <div className="icy-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Hazmat Container Distribution</h3>
              <PieChart width={400} height={240}>
                <Pie data={[{ n: "DG Cargo", v: records.filter(r => r.hazmat).length }, { n: "General Cargo", v: records.filter(r => !r.hazmat).length }]} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  <Cell fill="#ef4444" /><Cell fill="#0369a1" />
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="icy-chart bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">Dwell Time by Trade Type</h3>
            <BarChart data={TRADE_TYPES.map(t => ({ n: t, v: +ri(2, 9, 4.5 + Math.random() * 3).toFixed(1) }))} height={240}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip />
              <Bar dataKey="v" fill="#0369a1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="icy-insights grid grid-cols-2 gap-6">
          {INSIGHTS.map(ins => (
            <div key={ins.t} className="icy-insight bg-white rounded-lg border p-5">
              <h3 className="text-base font-bold text-sky-800 mb-2">{ins.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
