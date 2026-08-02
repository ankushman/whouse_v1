"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#b45309", "#d97706", "#f59e0b", "#fbbf24", "#92400e", "#78350f", "#fcd34d", "#fde68a"];
const SHIPPING_LINES = ["Maersk", "MSC", "CMA CGM", "Hapag-Lloyd", "COSCO", "Evergreen", "ONE", "HMM"];
const DEPOT_LOCATIONS = ["Tughlakabad ICD Delhi", "Patancheru ICD Hyderabad", "Dadri ICD NCR", "Bangalore ICD Whitefield", "Chennai ICD Attipattu", "Kolkata ICD Dankuni", "Agra ICD", "Nagpur ICD"];
const CONTAINER_TYPES = ["20ft GP", "40ft GP", "20ft HC", "40ft HC", "20ft RF", "40ft RF", "20ft OT", "40ft FR"];
const CONTAINER_STATUS = ["Available", "Occupied", "Under Customs", "Maintenance", "Gate In Transit", "Gate Out"];
const TRADE_TYPES = ["Export", "Import", "Domestic", "Transhipment", "Coastal", "Empty Reposition"];
const TABS = ["Dashboard", "Container Registry", "Depot Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", orange: "bg-orange-100 text-orange-700", slate: "bg-slate-100 text-slate-600", teal: "bg-teal-100 text-teal-700" };
const statusColor: Record<string, string> = { "Available": "green", "Occupied": "orange", "Under Customs": "amber", "Maintenance": "slate", "Gate In Transit": "teal", "Gate Out": "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyTeu = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], export: ri(180, 420, 290 + Math.sin(i * 0.5) * 90), import: ri(220, 480, 340 + Math.cos(i * 0.6) * 80), domestic: ri(60, 160, 100 + Math.sin(i * 0.7) * 30) }));
const typeDist = [{ n: "20ft GP", v: 35 }, { n: "40ft GP", v: 28 }, { n: "20ft HC", v: 12 }, { n: "40ft HC", v: 15 }, { n: "20ft RF", v: 5 }, { n: "40ft RF", v: 3 }, { n: "20ft OT", v: 1 }, { n: "40ft FR", v: 1 }];
const dwellTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(5.2, 11.8, 7.8 + Math.sin(i * 0.4) * 1.8)).toFixed(1), target: 7.0 }));
const depotUtil = DEPOT_LOCATIONS.slice(0, 6).map(d => ({ n: d.split(" ").slice(-2).join(" "), util: +(ri(62, 96, 78 + Math.random() * 12)).toFixed(0) }));

interface ContainerRecord { id: string; containerNo: string; containerType: string; status: string; depot: string; tradeType: string; shippingLine: string; vesselName: string; voyageNo: string; blNo: string; size: string; weight: number; commodity: string; hazmat: string; reeferTemp: string; gateInDate: string; gateOutDate: string; dwellDays: number; customsStatus: string; sealNo: string; vgmWeight: number; dmgFlag: string; remarks: string; }

const records: ContainerRecord[] = [
  { id: "ICD-0001", containerNo: "MSKU-7243851", containerType: "40ft GP", status: "Occupied", depot: "Tughlakabad ICD Delhi", tradeType: "Import", shippingLine: "Maersk", vesselName: "Maersk Elba", voyageNo: "325W", blNo: "MAEU-DEL-20250112", size: "40ft", weight: 18500, commodity: "Auto Parts", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-12", gateOutDate: "", dwellDays: 6, customsStatus: "Assessed", sealNo: "ML-2847193", vgmWeight: 19200, dmgFlag: "Clean", remarks: "Awaiting CFS clearance" },
  { id: "ICD-0002", containerNo: "MSCU-9182345", containerType: "20ft HC", status: "Under Customs", depot: "Chennai ICD Attipattu", tradeType: "Export", shippingLine: "MSC", vesselName: "MSC Fantasia", voyageNo: "108E", blNo: "MSC-CHN-20250110", size: "20ft", weight: 22400, commodity: "Textiles", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-10", gateOutDate: "", dwellDays: 8, customsStatus: "Examination Pending", sealNo: "MC-4482917", vgmWeight: 23100, dmgFlag: "Clean", remarks: "Physical exam scheduled 18-Jan" },
  { id: "ICD-0003", containerNo: "CMAU-4567891", containerType: "40ft RF", status: "Occupied", depot: "Bangalore ICD Whitefield", tradeType: "Import", shippingLine: "CMA CGM", vesselName: "CMA Marco Polo", voyageNo: "447W", blNo: "CMA-BLR-20250108", size: "40ft", weight: 14200, commodity: "Pharma", hazmat: "No", reeferTemp: "-18\u00b0C", gateInDate: "2025-01-08", gateOutDate: "", dwellDays: 10, customsStatus: "Released", sealNo: "CG-9910382", vgmWeight: 15000, dmgFlag: "Clean", remarks: "Cold chain intact - temp stable" },
  { id: "ICD-0004", containerNo: "HLXU-3345612", containerType: "20ft GP", status: "Available", depot: "Dadri ICD NCR", tradeType: "Domestic", shippingLine: "Hapag-Lloyd", vesselName: "\u2014", voyageNo: "\u2014", blNo: "\u2014", size: "20ft", weight: 0, commodity: "Empty", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-06", gateOutDate: "2025-01-13", dwellDays: 7, customsStatus: "N/A", sealNo: "HL-2233845", vgmWeight: 0, dmgFlag: "Clean", remarks: "Available for stuffing" },
  { id: "ICD-0005", containerNo: "CSLU-7789023", containerType: "40ft GP", status: "Gate In Transit", depot: "Kolkata ICD Dankuni", tradeType: "Import", shippingLine: "COSCO", vesselName: "Cosco Glory", voyageNo: "089W", blNo: "COS-KOL-20250114", size: "40ft", weight: 26800, commodity: "Machinery", hazmat: "Yes", reeferTemp: "\u2014", gateInDate: "2025-01-14", gateOutDate: "", dwellDays: 2, customsStatus: "Pending Filing", sealNo: "CS-5547281", vgmWeight: 27500, dmgFlag: "Minor Dent", remarks: "Class 9 IMDG - lithium batteries" },
  { id: "ICD-0006", containerNo: "EGLU-1234567", containerType: "20ft GP", status: "Maintenance", depot: "Patancheru ICD Hyderabad", tradeType: "Export", shippingLine: "Evergreen", vesselName: "Evergreen Hero", voyageNo: "213E", blNo: "EGL-HYD-20250105", size: "20ft", weight: 0, commodity: "\u2014", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-05", gateOutDate: "", dwellDays: 13, customsStatus: "N/A", sealNo: "EG-8873129", vgmWeight: 0, dmgFlag: "Door Repair", remarks: "Door hinge replacement in progress" },
  { id: "ICD-0007", containerNo: "ONLU-8901234", containerType: "40ft HC", status: "Occupied", depot: "Tughlakabad ICD Delhi", tradeType: "Transhipment", shippingLine: "ONE", vesselName: "ONE Harmony", voyageNo: "567W", blNo: "ONE-DEL-20250111", size: "40ft", weight: 31200, commodity: "Steel Coils", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-11", gateOutDate: "", dwellDays: 7, customsStatus: "Bonded", sealNo: "ON-6612940", vgmWeight: 32000, dmgFlag: "Clean", remarks: "Awaiting rail rake to Kolkata" },
  { id: "ICD-0008", containerNo: "HMMU-5678901", containerType: "20ft RF", status: "Under Customs", depot: "Chennai ICD Attipattu", tradeType: "Import", shippingLine: "HMM", vesselName: "HMM Promise", voyageNo: "321W", blNo: "HMM-CHN-20250113", size: "20ft", weight: 8400, commodity: "Fresh Produce", hazmat: "No", reeferTemp: "+2\u00b0C", gateInDate: "2025-01-13", gateOutDate: "", dwellDays: 3, customsStatus: "RMS Flagged", sealNo: "HM-4451208", vgmWeight: 9200, dmgFlag: "Clean", remarks: "RMS risk assessment - select scan" },
  { id: "ICD-0009", containerNo: "MSKU-2345678", containerType: "40ft GP", status: "Available", depot: "Agra ICD", tradeType: "Empty Reposition", shippingLine: "Maersk", vesselName: "\u2014", voyageNo: "\u2014", blNo: "\u2014", size: "40ft", weight: 3800, commodity: "Empty", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-09", gateOutDate: "", dwellDays: 9, customsStatus: "N/A", sealNo: "ML-1178234", vgmWeight: 3800, dmgFlag: "Clean", remarks: "Awaiting rail to JNPT for export" },
  { id: "ICD-0010", containerNo: "MSCU-3456789", containerType: "20ft OT", status: "Occupied", depot: "Nagpur ICD", tradeType: "Domestic", shippingLine: "MSC", vesselName: "\u2014", voyageNo: "\u2014", blNo: "\u2014", size: "20ft", weight: 28500, commodity: "Steel Beams", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-12", gateOutDate: "", dwellDays: 6, customsStatus: "N/A", sealNo: "MC-3382017", vgmWeight: 29200, dmgFlag: "Clean", remarks: "Domestic rail from JNPT to Nagpur MIHAN" },
  { id: "ICD-0011", containerNo: "CMAU-6789012", containerType: "40ft FR", status: "Gate Out", depot: "Tughlakabad ICD Delhi", tradeType: "Import", shippingLine: "CMA CGM", vesselName: "CMA Viking", voyageNo: "188W", blNo: "CMA-DEL-20250104", size: "40ft", weight: 35000, commodity: "Oversized Equipment", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-04", gateOutDate: "2025-01-14", dwellDays: 10, customsStatus: "Released", sealNo: "CG-7723945", vgmWeight: 36000, dmgFlag: "Clean", remarks: "ODC movement - escort required" },
  { id: "ICD-0012", containerNo: "HLXU-9012345", containerType: "20ft GP", status: "Under Customs", depot: "Kolkata ICD Dankuni", tradeType: "Export", shippingLine: "Hapag-Lloyd", vesselName: "HL Boston", voyageNo: "245E", blNo: "HLX-KOL-20250115", size: "20ft", weight: 19600, commodity: "Jute Products", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-15", gateOutDate: "", dwellDays: 1, customsStatus: "Pending Filing", sealNo: "HL-9945213", vgmWeight: 20100, dmgFlag: "Clean", remarks: "Export stuffing in progress" },
  { id: "ICD-0013", containerNo: "CSLU-4567890", containerType: "40ft HC", status: "Occupied", depot: "Patancheru ICD Hyderabad", tradeType: "Import", shippingLine: "COSCO", vesselName: "Cosco Peace", voyageNo: "156W", blNo: "COS-HYD-20250109", size: "40ft", weight: 24800, commodity: "Electronics", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-09", gateOutDate: "", dwellDays: 9, customsStatus: "Released", sealNo: "CS-2293871", vgmWeight: 25500, dmgFlag: "Clean", remarks: "Awaiting consignee pickup - truck booking pending" },
  { id: "ICD-0014", containerNo: "ONLU-7890123", containerType: "20ft GP", status: "Available", depot: "Bangalore ICD Whitefield", tradeType: "Coastal", shippingLine: "ONE", vesselName: "\u2014", voyageNo: "\u2014", blNo: "\u2014", size: "20ft", weight: 0, commodity: "Empty", hazmat: "No", reeferTemp: "\u2014", gateInDate: "2025-01-11", gateOutDate: "", dwellDays: 7, customsStatus: "N/A", sealNo: "ON-8821346", vgmWeight: 0, dmgFlag: "Clean", remarks: "Coastal vessel discharge - ready for local" },
];

const availableCount = records.filter(r => r.status === "Available").length;
const occupiedCount = records.filter(r => r.status === "Occupied").length;
const customsCount = records.filter(r => r.status === "Under Customs").length;
const totalTeu = records.reduce((s, r) => s + (r.size.startsWith("40") ? 2 : 1), 0);

const kpis = [
  { l: "Available Units", v: availableCount, s: "ready for stuffing" },
  { l: "Occupied", v: occupiedCount, s: "with cargo" },
  { l: "Under Customs", v: customsCount, s: "awaiting clearance" },
  { l: "Total TEU", v: totalTeu, s: "across all depots" },
];

const INSIGHTS = [
  {
    t: "India ICD Network: 161 Facilities Processing 6.2 Million TEU Annually",
    c: "India\u2019s Inland Container Depot (ICD) network, regulated under the Customs Act 1962 and operated under the supervision of the Central Board of Indirect Taxes and Customs (CBIC), comprises 161 notified ICDs and Container Freight Stations (CFS) spread across 28 states, processing approximately 6.2 million TEU (Twenty-foot Equivalent Units) annually. The major ICDs\u2014Tughlakabad (Delhi NCR, 1.2M TEU), Patancheru (Hyderabad, 0.6M TEU), Bangalore Whitefield (0.5M TEU), Chennai Attipattu (0.45M TEU), and Dadri (0.4M TEU)\u2014account for 52% of total ICD throughput, with CONCOR (Container Corporation of India Ltd, a Navratna PSU under Indian Railways) operating 60% of these facilities. The ICD ecosystem serves as the critical hinterland logistics backbone connecting India\u2019s major gateway ports (JNPT Mumbai, Chennai, Kolkata Haldia, Mundra, V.O. Chidambaranar) to inland manufacturing and consumption centers through rail-linked container transport. The Dedicated Freight Corridor (DFC) network, with the Western DFC (JNPT to Rewari, 1,504 km) and Eastern DFC (Ludhiana to Dankuni, 1,856 km) now substantially operational, has reduced ICD-to-port transit time by 40% (from 72 hours to 42 hours for Delhi-JNPT corridor) and increased container rail share from 28% to 38% of total ICD traffic. For logistics operators managing 500+ monthly container movements across ICDs, optimized depot selection and dwell time management can reduce per-container handling costs by \u20b94,500-8,000 and improve total turnaround time from 14 days to 8 days.",
  },
  {
    t: "ICD Container Dwell Time: India Averages 7.2 Days vs Global Best of 3 Days",
    c: "Container dwell time\u2014the duration from gate-in to gate-out at an ICD\u2014is a critical efficiency metric that directly impacts logistics costs, inventory carrying costs, and container repositioning speed. India\u2019s average ICD dwell time of 7.2 days significantly exceeds the global best practice of 3 days (Singapore, Rotterdam), with the breakdown being: customs examination and clearance (1.8 days average, 2.5 days for RMS-flagged containers), CFS/warehouse operations (1.5 days), transport arrangement and truck booking (1.2 days), documentation and billing (0.8 days), and weekend/holiday delays (1.9 days). The primary drivers of extended dwell time include: customs physical examination backlog (particularly for RMS-risk-scored containers requiring 100% scanner check), shortage of bonded warehouse space at peak season (October-March export cycle), inadequate rail rake availability for ICD-to-port movement (CONCOR rake allocation delays of 24-48 hours), and last-mile truck availability constraints during festival seasons. Leading ICD operators like DP World (Cochin ICD) and Adani Logistics (Mundra ICD) have achieved sub-4-day dwell times through investments in automated gate systems (OCR-based container number recognition reducing gate processing from 15 minutes to 2 minutes), pre-arrival customs filing through ICEGATE integration, and dedicated rail siding connections enabling daily rake dispatch. For importers, each day of excess dwell time adds approximately \u20b92,800 per 40ft container in demurrage, storage, and inventory carrying costs, making dwell time optimization a high-priority cost reduction lever for Indian logistics operations managing 200+ annual container imports.",
  },
  {
    t: "Customs Bonded ICD Operations: AEO and RMS Risk Management System",
    c: "India\u2019s ICDs operate under a customs bonded warehouse framework administered by CBIC through the Indian Customs EDI System (ICES), with each ICD authorized as a public bonded warehouse under Section 57 of the Customs Act 1962. The customs clearance workflow at ICDs involves multiple stages: (1) Bill of Entry filing through ICEGATE (electronic filing mandatory since 2011), (2) Risk Management System (RMS) assessment that assigns a risk score based on importer compliance history, commodity risk profile, country of origin, and duty amount, categorizing consignments into three channels: Green Channel (facilitation, no examination, 68% of Bills of Entry), Yellow Channel (document verification, 22%), and Red Channel (physical examination, 10%); (3) Customs assessment and duty determination; (4) Duty payment through ICEGATE-linked electronic cash ledger; and (5) Out of Charge order enabling container gate-out. The Authorized Economic Operator (AEO) program, introduced in India in 2016 aligned with WTO SAFE Framework standards, provides certified operators with Green Channel facilitation, reduced examination rates (from 10% to 2%), priority processing at checkposts, and self-assessment privileges. As of FY2025, India has 2,800+ AEO-certified entities across T1 (certified), T2 (validated), and T3 (security) tiers. ICDs serving AEO-certified importers report 60% faster clearance times and 80% lower examination rates compared to non-AEO traffic. The integration of faceless assessment (launched in 2020) has further reduced examination bias and improved clearance consistency, with the average Bill of Entry processing time declining from 4.2 days to 1.8 days for AEO-certified importers at major ICDs.",
  },
  {
    t: "ICD Rail Connectivity: CONCOR Rake Operations and DFC Integration",
    c: "Rail connectivity is the backbone of India\u2019s ICD network, with approximately 38% of ICD container traffic moving by rail (compared to 28% five years ago), driven by Dedicated Freight Corridor (DFC) infrastructure and CONCOR\u2019s expanded rake fleet of 320+ locomotives and 12,000+ container wagons. CONCOR, India\u2019s largest container rail operator, operates scheduled Block Rake services on 45+ rail routes connecting major ICDs to gateway ports, with a standard rake capacity of 90 TEU (45 containers of 20ft or 22 containers of 40ft). The Western Dedicated Freight Corridor (WDFC), operational on the JNPT-Vadodara-Rewari corridor (1,504 km), enables double-stack container trains running at 60-80 kmph, reducing JNPT-Delhi ICD transit from 72 hours to 42 hours\u2014a 42% improvement. The Eastern DFC (Ludhiana-Dankuni, 1,856 km) connects Kolkata\u2019s Dankuni ICD to Northern India\u2019s industrial belt, with full commissioning expected to increase Kolkata ICD throughput by 35%. Private terminal operators like Adani Logistics (Mundra ICD, India\u2019s largest private ICD at 0.8M TEU), DP World (Cochin ICD), and Hero Enterprise (Singrauli ICD) are investing in dedicated rail sidings, automated container handling equipment (RMG cranes, reach stackers), and ERP-integrated yard management systems that optimize rail rake planning through predictive demand algorithms. For logistics operators, leveraging rail-linked ICDs with daily rake services can reduce per-container transport costs by 40-55% compared to road-only movement on the Delhi-Mumbai, Delhi-Chennai, and Mumbai-Bangalore corridors, while also reducing carbon emissions per TEU-km by 70% compared to road transport.",
  },
];

export default function InlandContainerDepotCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: CONTAINER_STATUS.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "depot", label: "Depot", options: DEPOT_LOCATIONS.map(d => ({ value: d, count: records.filter(r => r.depot === d).length })) },
    { key: "containerType", label: "Type", options: CONTAINER_TYPES.map(t => ({ value: t, count: records.filter(r => r.containerType === t).length })) },
    { key: "tradeType", label: "Trade", options: TRADE_TYPES.map(t => ({ value: t, count: records.filter(r => r.tradeType === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.containerNo.toLowerCase().includes(q) && !r.shippingLine.toLowerCase().includes(q) && !r.vesselName.toLowerCase().includes(q) && !r.commodity.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ContainerRecord] as string));
  });

  return (
    <div className="icd-root p-6 space-y-6">
      <PageHeader title="Inland Container Depot Command" description="ICD/CFS container lifecycle management, dwell time optimization, customs bonded operations, rail rake planning, CONCOR integration and TEU analytics" />
      <div className="icd-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`icd-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-amber-600 text-white" : "text-gray-600 hover:bg-amber-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="icd-dash space-y-6">
          <div className="icd-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="icd-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 icd-kpi-label">{k.l}</div><div className="text-2xl font-bold text-amber-700 icd-kpi-val">{k.v}</div><div className="text-xs text-gray-400 icd-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="icd-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly TEU by Trade Type</h3><BarChart data={monthlyTeu} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="export" fill="#b45309" radius={[4,4,0,0]} name="Export" /><Bar dataKey="import" fill="#d97706" radius={[4,4,0,0]} name="Import" /><Bar dataKey="domestic" fill="#f59e0b" radius={[4,4,0,0]} name="Domestic" /></BarChart></div>
            <div className="icd-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Container Type Distribution</h3><PieChart width={400} height={220}><Pie data={typeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="icd-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Dwell Time Trend (Days) vs Target</h3><LineChart data={dwellTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[4, 13]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#b45309" strokeWidth={2} name="Actual Days" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target 7d" /></LineChart></div>
            <div className="icd-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Depot Utilization (%)</h3><BarChart data={depotUtil} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[50, 100]} /><Tooltip /><Bar dataKey="util" fill="#d97706" radius={[4,4,0,0]} name="Util %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="icd-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "ICD", href: "#" }, { label: "Container Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="icd-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Container No,Type,Status,Depot,Trade,Line,Vessel,BL No,Weight,Commodity,Hazmat,Temp,Gate In,Gate Out,Dwell,Customs,Seal,VGM,Damage,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Under Customs" ? "icd-row-warning bg-amber-50" : r.status === "Maintenance" ? "icd-row-info bg-orange-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-amber-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="icd-badge inline-block px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700 font-mono">{r.containerNo}</span></td>
                <td className="px-3 py-2"><span className="icd-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.containerType}</span></td>
                <td className="px-3 py-2"><span className={`icd-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.depot}</td>
                <td className="px-3 py-2 text-xs">{r.tradeType}</td>
                <td className="px-3 py-2 text-xs">{r.shippingLine}</td>
                <td className="px-3 py-2 text-xs">{r.vesselName}</td>
                <td className="px-3 py-2 text-xs font-mono max-w-28 truncate">{r.blNo}</td>
                <td className="px-3 py-2 text-xs">{r.weight > 0 ? `${(r.weight/1000).toFixed(1)}T` : "\u2014"}</td>
                <td className="px-3 py-2 text-xs">{r.commodity}</td>
                <td className="px-3 py-2">{r.hazmat === "Yes" ? <span className="icd-badge inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">HAZMAT</span> : <span className="text-slate-400 text-xs">No</span>}</td>
                <td className="px-3 py-2 text-xs">{r.reeferTemp !== "\u2014" ? <span className="icd-badge inline-block px-2 py-0.5 rounded text-xs bg-sky-100 text-sky-700">{r.reeferTemp}</span> : <span className="text-slate-400 text-xs">\u2014</span>}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.gateInDate}</td>
                <td className="px-3 py-2 text-xs">{r.gateOutDate || <span className="text-slate-400">In Progress</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.dwellDays > 10 ? "text-red-600" : r.dwellDays > 7 ? "text-amber-600" : "text-green-600"}`}>{r.dwellDays}d</span></td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 rounded text-xs ${r.customsStatus === "Released" || r.customsStatus === "N/A" ? "bg-green-100 text-green-700" : r.customsStatus === "RMS Flagged" || r.customsStatus === "Examination Pending" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{r.customsStatus}</span></td>
                <td className="px-3 py-2 text-xs font-mono">{r.sealNo}</td>
                <td className="px-3 py-2 text-xs">{r.vgmWeight > 0 ? `${(r.vgmWeight/1000).toFixed(1)}T` : "\u2014"}</td>
                <td className="px-3 py-2">{r.dmgFlag !== "Clean" ? <span className="icd-badge inline-block px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">{r.dmgFlag}</span> : <span className="text-green-600 text-xs">Clean</span>}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-36 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="icd-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="icd-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">TEU Volume by Shipping Line</h3><BarChart data={SHIPPING_LINES.slice(0,6).map(s => ({ n: s, v: +ri(42, 180, 95 + Math.random() * 60).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#b45309" radius={[4,4,0,0]} /></BarChart></div>
            <div className="icd-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Trade Type Volume by Depot</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], tughlakabad: ri(60, 140, 95 + Math.sin(i*0.5)*25), bangalore: ri(40, 110, 72 + Math.cos(i*0.6)*22), chennai: ri(35, 95, 62 + Math.sin(i*0.7)*18) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="tughlakabad" stackId="1" stroke="#b45309" fill="#fde68a" name="Tughlakabad" /><Area type="monotone" dataKey="bangalore" stackId="1" stroke="#d97706" fill="#fcd34d" name="Bangalore" /><Area type="monotone" dataKey="chennai" stackId="1" stroke="#f59e0b" fill="#fbbf24" name="Chennai" /></AreaChart></div>
          </div>
          <div className="icd-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dwell Time by Depot (Days)</h3><BarChart data={DEPOT_LOCATIONS.slice(0,6).map(d => ({ n: d.split(" ").slice(-2).join(" "), v: +ri(4, 14, 7.5 + Math.random() * 4).toFixed(1) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#d97706" radius={[4,4,0,0]} /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="icd-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="icd-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-amber-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
