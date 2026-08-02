"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#be123c", "#e11d48", "#fb7185", "#fda4af", "#9f1239", "#881337", "#f43f5e", "#ffe4e6"];
const CARRIERS = ["TCI Express", "Delhivery", "Blue Dart", "VRL Logistics", "Gati", "Rivigo", "Shadowfax", "DTDC"];
const SHIPMENT_STATUS = ["In Transit", "At Hub", "Out for Delivery", "Delivered", "Exception", "Returned"];
const ROUTES = ["Delhi-Mumbai", "Mumbai-Chennai", "Bangalore-Kolkata", "Delhi-Bangalore", "Chennai-Hyderabad", "Pune-Delhi", "Kolkata-Guwahati", "Hyderabad-Mumbai"];
const TRANSIT_MODES = ["Road FTL", "Rail Express", "Air Cargo", "Surface Express", "Milk Run", "Multi-Modal"];
const TABS = ["Dashboard", "Shipment Registry", "Transit Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", rose: "bg-rose-100 text-rose-700", slate: "bg-slate-100 text-slate-600", teal: "bg-teal-100 text-teal-700" };
const statusColor: Record<string, string> = { "In Transit": "rose", "At Hub": "amber", "Out for Delivery": "teal", Delivered: "green", Exception: "red", Returned: "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyShipments = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], road: ri(320, 620, 460 + Math.sin(i * 0.5) * 120), rail: ri(40, 120, 75 + Math.cos(i * 0.6) * 25), air: ri(15, 55, 32 + Math.sin(i * 0.8) * 12) }));
const otifTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], otif: +(ri(82, 96, 88 + i * 0.4)).toFixed(1), target: 95.0 }));
const exceptionDist = [{ n: "Delay", v: 38 }, { n: "Damage", v: 18 }, { n: "Route Diversion", v: 15 }, { n: "Vehicle Breakdown", v: 12 }, { n: "Weather Hold", v: 10 }, { n: "Documentation", v: 7 }];
const carrierPerf = CARRIERS.slice(0, 6).map(c => ({ n: c, otif: +(ri(78, 98, 87 + Math.random() * 8)).toFixed(1) }));

interface ShipmentRecord { id: string; awbNo: string; poRef: string; carrier: string; route: string; transitMode: string; status: string; origin: string; destination: string; shipDate: string; etd: string; eta: string; actualDelivery: string; weight: number; packages: number; currentLocation: string; lastScan: string; milestones: number; milestonesComplete: number; podStatus: string; exception: string; delayHours: number; }

const records: ShipmentRecord[] = [
  { id: "STM-0001", awbNo: "TCI-2025-DM-0891", poRef: "PO-2025-4521", carrier: "TCI Express", route: "Delhi-Mumbai", transitMode: "Road FTL", status: "Delivered", origin: "Delhi NCR Hub", destination: "Mumbai Bhiwandi DC", shipDate: "2025-01-10", etd: "2025-01-11", eta: "2025-01-13", actualDelivery: "2025-01-13", weight: 4200, packages: 84, currentLocation: "Mumbai Bhiwandi DC", lastScan: "2025-01-13 14:30 POD Confirmed", milestones: 6, milestonesComplete: 6, podStatus: "Digital POD", exception: "\u2014", delayHours: 0 },
  { id: "STM-0002", awbNo: "DLV-2025-MC-0892", poRef: "PO-2025-4522", carrier: "Delhivery", route: "Mumbai-Chennai", transitMode: "Surface Express", status: "In Transit", origin: "Mumbai JNPT CFS", destination: "Chennai Oragadam DC", shipDate: "2025-01-12", etd: "2025-01-13", eta: "2025-01-16", actualDelivery: "", weight: 2800, packages: 56, currentLocation: "Pune Highway Checkpost", lastScan: "2025-01-14 18:45 In Transit Scan", milestones: 6, milestonesComplete: 3, podStatus: "Pending", exception: "None", delayHours: 0 },
  { id: "STM-0003", awbNo: "BDT-2025-BK-0893", poRef: "PO-2025-4523", carrier: "Blue Dart", route: "Bangalore-Kolkata", transitMode: "Air Cargo", status: "At Hub", origin: "Bangalore Kempegowda", destination: "Kolkata NSC Bose Airport", shipDate: "2025-01-13", etd: "2025-01-13", eta: "2025-01-14", actualDelivery: "", weight: 450, packages: 12, currentLocation: "Kolkata Airport Hub", lastScan: "2025-01-14 06:20 Arrived at Destination Hub", milestones: 5, milestonesComplete: 4, podStatus: "Pending", exception: "None", delayHours: 0 },
  { id: "STM-0004", awbNo: "VRL-2025-DB-0894", poRef: "PO-2025-4524", carrier: "VRL Logistics", route: "Delhi-Bangalore", transitMode: "Road FTL", status: "Exception", origin: "Delhi Tughlakabad ICD", destination: "Bangalore Whitefield DC", shipDate: "2025-01-11", etd: "2025-01-12", eta: "2025-01-15", actualDelivery: "", weight: 8500, packages: 170, currentLocation: "Hyderabad Outer Ring Road", lastScan: "2025-01-14 22:10 Vehicle Breakdown Reported", milestones: 6, milestonesComplete: 4, podStatus: "Pending", exception: "Vehicle Breakdown", delayHours: 18 },
  { id: "STM-0005", awbNo: "GAT-2025-CH-0895", poRef: "PO-2025-4525", carrier: "Gati", route: "Chennai-Hyderabad", transitMode: "Road FTL", status: "Out for Delivery", origin: "Chennai Oragadam DC", destination: "Hyderabad Pharma City WH", shipDate: "2025-01-13", etd: "2025-01-14", eta: "2025-01-15", actualDelivery: "", weight: 1200, packages: 24, currentLocation: "Hyderabad Gachibowli Area", lastScan: "2025-01-15 09:30 Out for Delivery", milestones: 6, milestonesComplete: 5, podStatus: "Pending", exception: "None", delayHours: 0 },
  { id: "STM-0006", awbNo: "RVG-2025-PD-0896", poRef: "PO-2025-4526", carrier: "Rivigo", route: "Pune-Delhi", transitMode: "Milk Run", status: "Delivered", origin: "Pune Chakan DC", destination: "Delhi NCR Hub", shipDate: "2025-01-11", etd: "2025-01-12", eta: "2025-01-14", actualDelivery: "2025-01-14", weight: 6200, packages: 124, currentLocation: "Delhi NCR Hub", lastScan: "2025-01-14 11:45 POD Confirmed", milestones: 6, milestonesComplete: 6, podStatus: "Digital POD", exception: "\u2014", delayHours: 0 },
  { id: "STM-0007", awbNo: "SFX-2025-AJ-0897", poRef: "PO-2025-4527", carrier: "Shadowfax", route: "Kolkata-Guwahati", transitMode: "Surface Express", status: "Exception", origin: "Kolkata Dankuni ICD", destination: "Guwahati Industrial Hub", shipDate: "2025-01-10", etd: "2025-01-11", eta: "2025-01-14", actualDelivery: "", weight: 3200, packages: 64, currentLocation: "Siliguri Corridor", lastScan: "2025-01-13 08:00 Weather Hold - Fog", milestones: 5, milestonesComplete: 3, podStatus: "Pending", exception: "Weather Hold", delayHours: 24 },
  { id: "STM-0008", awbNo: "DTDC-2025-HM-0898", poRef: "PO-2025-4528", carrier: "DTDC", route: "Hyderabad-Mumbai", transitMode: "Rail Express", status: "Delivered", origin: "Hyderabad ICD Patancheru", destination: "Mumbai JNPT", shipDate: "2025-01-12", etd: "2025-01-13", eta: "2025-01-14", actualDelivery: "2025-01-14", weight: 12000, packages: 240, currentLocation: "Mumbai JNPT", lastScan: "2025-01-14 16:20 POD Confirmed", milestones: 5, milestonesComplete: 5, podStatus: "Digital POD", exception: "\u2014", delayHours: 0 },
  { id: "STM-0009", awbNo: "TCI-2025-PD-0899", poRef: "PO-2025-4529", carrier: "TCI Express", route: "Pune-Delhi", transitMode: "Multi-Modal", status: "In Transit", origin: "Pune Chakan DC", destination: "Delhi Dadri ICD", shipDate: "2025-01-14", etd: "2025-01-15", eta: "2025-01-17", actualDelivery: "", weight: 9800, packages: 196, currentLocation: "Mumbai JNPT Transit", lastScan: "2025-01-15 07:30 Rail Rake Loaded WDFC", milestones: 7, milestonesComplete: 3, podStatus: "Pending", exception: "None", delayHours: 0 },
  { id: "STM-0010", awbNo: "DLV-2025-DB-0900", poRef: "PO-2025-4530", carrier: "Delhivery", route: "Delhi-Bangalore", transitMode: "Air Cargo", status: "Delivered", origin: "Delhi IGI Airport", destination: "Bangalore Kempegowda", shipDate: "2025-01-13", etd: "2025-01-13", eta: "2025-01-14", actualDelivery: "2025-01-14", weight: 680, packages: 8, currentLocation: "Bangalore DC", lastScan: "2025-01-14 10:15 POD Confirmed", milestones: 5, milestonesComplete: 5, podStatus: "e-POD Signed", exception: "\u2014", delayHours: 0 },
  { id: "STM-0011", awbNo: "BDT-2025-PD-0901", poRef: "PO-2025-4531", carrier: "Blue Dart", route: "Pune-Delhi", transitMode: "Air Cargo", status: "Returned", origin: "Pune Chakan DC", destination: "Delhi NCR Hub", shipDate: "2025-01-14", etd: "2025-01-14", eta: "2025-01-15", actualDelivery: "2025-01-16", weight: 350, packages: 5, currentLocation: "Pune Chakan DC", lastScan: "2025-01-16 12:00 Returned to Origin", milestones: 5, milestonesComplete: 5, podStatus: "RTO Confirmed", exception: "Consignee Refused", delayHours: 24 },
  { id: "STM-0012", awbNo: "VRL-2025-CH-0902", poRef: "PO-2025-4532", carrier: "VRL Logistics", route: "Chennai-Hyderabad", transitMode: "Road FTL", status: "In Transit", origin: "Chennai Ennore Port", destination: "Hyderabad Patancheru ICD", shipDate: "2025-01-15", etd: "2025-01-16", eta: "2025-01-17", actualDelivery: "", weight: 15600, packages: 312, currentLocation: "Vijayawada NH16", lastScan: "2025-01-15 20:30 Enroute Scan", milestones: 6, milestonesComplete: 2, podStatus: "Pending", exception: "None", delayHours: 0 },
  { id: "STM-0013", awbNo: "GAT-2025-DM-0903", poRef: "PO-2025-4533", carrier: "Gati", route: "Delhi-Mumbai", transitMode: "Road FTL", status: "At Hub", origin: "Delhi Tughlakabad ICD", destination: "Mumbai JNPT CFS", shipDate: "2025-01-15", etd: "2025-01-16", eta: "2025-01-18", actualDelivery: "", weight: 7200, packages: 144, currentLocation: "Indore Transhipment Hub", lastScan: "2025-01-16 06:15 Arrived at Hub", milestones: 6, milestonesComplete: 2, podStatus: "Pending", exception: "None", delayHours: 0 },
  { id: "STM-0014", awbNo: "RVG-2025-KG-0904", poRef: "PO-2025-4534", carrier: "Rivigo", route: "Kolkata-Guwahati", transitMode: "Road FTL", status: "Delivered", origin: "Kolkata Dankuni", destination: "Guwahati Industrial Area", shipDate: "2025-01-14", etd: "2025-01-15", eta: "2025-01-16", actualDelivery: "2025-01-16", weight: 5100, packages: 102, currentLocation: "Guwahati DC", lastScan: "2025-01-16 15:30 POD Confirmed", milestones: 5, milestonesComplete: 5, podStatus: "Digital POD", exception: "\u2014", delayHours: 0 },
];

const deliveredCount = records.filter(r => r.status === "Delivered").length;
const inTransitCount = records.filter(r => r.status === "In Transit" || r.status === "At Hub" || r.status === "Out for Delivery").length;
const exceptionCount = records.filter(r => r.status === "Exception").length;
const totalWeight = records.reduce((s, r) => s + r.weight, 0);

function fmtWt(n: number): string { return n >= 1000 ? `${(n / 1000).toFixed(1)}T` : `${n}kg`; }

const kpis = [
  { l: "In Transit", v: inTransitCount, s: "active shipments" },
  { l: "Delivered", v: deliveredCount, s: `of ${records.length} total` },
  { l: "Exceptions", v: exceptionCount, s: "need attention" },
  { l: "Total Weight", v: fmtWt(totalWeight), s: "across all shipments" },
];

const INSIGHTS = [
  {
    t: "India Shipment Tracking: 24 Lakh Daily Parcels Demand Real-Time Visibility",
    c: "India\u2019s express logistics and supply chain industry generates approximately 24 lakh parcel-level tracking events daily, processed through the unified logistics interface platform (ULIP) under the National Logistics Policy 2022, which integrates data from 37 logistics service providers, 12 state highway authorities, 6 port trusts, and Indian Railways\u2019 FOIS (Freight Operations Information System). The tracking ecosystem leverages a multi-layer architecture: GPS/telematics for road transport (covering 85% of India\u2019s 8.5 lakh registered freight vehicles), RFID at toll plazas and ICD gates, AIS 140 vessel tracking for coastal shipping, and bar-code/QR scan events at hub and last-mile touchpoints. For mid-sized logistics operators managing 2,000-5,000 daily shipments across 500+ pin codes, real-time milestone tracking achieves 92% shipment-level visibility within 2 hours of any status change, compared to 48-72 hour visibility lag in manual tracking systems. The key differentiator for Indian logistics tracking is last-mile delivery confirmation through e-POD (electronic Proof of Delivery) with GPS-tagged photo capture, OTP-based consignee verification (required for high-value shipments above \u20b925,000), and automated delivery exception handling that reroutes failed deliveries within 4 hours through the nearest available last-mile agent. India\u2019s postal code system (6-digit PIN) covers 1.54 lakh pin codes across 28 states and 8 UTs, with each pin code mapped to an average of 2.3 delivery agent zones enabling micro-level shipment tracking granularity.",
  },
  {
    t: "OTIF Performance: India Targets 95% On-Time In-Full by 2027",
    c: "On-Time In-Full (OTIF) delivery, the primary logistics KPI measuring the percentage of shipments delivered to the correct location with the correct quantity within the promised delivery window, stands at an industry average of 78-84% for Indian logistics operations, with significant variation by mode: air cargo achieves 92-96% OTIF, surface express (FTL/PTL) averages 80-88%, rail freight achieves 72-82%, and multi-modal combinations average 68-76%. The National Logistics Policy targets raising the pan-India OTIF average to 95% by 2027 through three key levers: (1) DFC network completion enabling 48-hour JNPT-Delhi transit versus the current 72-96 hours, reducing transit time variability by 40%; (2) ULIP-powered real-time exception detection that triggers proactive corrective action (alternative routing, backup vehicle dispatch) within 30 minutes of deviation detection, reducing exception-to-resolution time from 8-12 hours to 2-4 hours; and (3) predictive ETA engines using machine learning models trained on 36 months of historical GPS trace data, weather patterns, festival season demand spikes, and highway construction schedules, achieving 88% ETA prediction accuracy at the shipment level 48 hours before delivery. Companies deploying integrated OTIF dashboards with carrier scorecards, route-level analytics, and automated SLA breach alerts report 12-18% OTIF improvement within 6 months and 25-35% reduction in customer complaints related to delayed deliveries.",
  },
  {
    t: "Proof of Delivery: e-POD Transformation in Indian Logistics",
    c: "India\u2019s logistics sector is undergoing a rapid transition from paper-based Proof of Delivery (POD) to electronic POD (e-POD), driven by the Income Tax Act 1962 requirement for electronic documentation retention, GST e-invoicing mandates, and customer demand for real-time delivery confirmation. Traditional paper POD processes required physical document return through the logistics chain (agent to branch to hub to accounts), taking 7-15 days and resulting in 8-12% document loss rates that delayed invoicing and payment collection by 2-3 weeks. Modern e-POD systems capture delivery confirmation through a multi-point verification workflow: (1) GPS-tagged photo of delivered goods at the consignee location, (2) Digital consignee signature on the delivery agent\u2019s mobile app, (3) OTP-based confirmation sent to the consignee\u2019s registered mobile number, and (4) Quantity verification scan of each package barcode at delivery point. Leading Indian 3PL operators like DHL Supply Chain, TVS Supply Chain, and Delhivery process 95% of e-PODs within 30 minutes of delivery completion, with 99.2% POD capture rate and 0.3% dispute rate. The financial impact is significant: e-POD implementation reduces average payment collection time from 35 days to 12 days (a 65% improvement), decreases POD-related disputes by 80%, and enables automated GST e-invoice reconciliation that links delivery confirmation directly to invoice payment triggers. For a mid-sized logistics company processing 10,000 deliveries monthly, e-POD adoption unlocks approximately \u20b92.5 crore in improved working capital through faster payment realization.",
  },
  {
    t: "Multi-Modal Shipment Orchestration: Rail-Road-Air Integration",
    c: "Multi-modal shipment tracking in India involves orchestrating visibility across road (65% of freight), rail (28% on major corridors), air (5% for express/time-critical), and coastal waterway (2% on the east and west coast corridors) segments, each with distinct tracking systems and data formats. The Dedicated Freight Corridor (DFC) network, with the Western DFC (1,504 km JNPT-Rewari) and Eastern DFC (1,856 km Ludhiana-Dankuni) becoming operational, has created new multi-modal corridors where containers move seamlessly between rail (DFC express rakes at 60-80 kmph) and road (last-mile to ICD/warehouse) within a single shipment lifecycle. A typical multi-modal shipment from JNPT to Bangalore involves: (1) Port terminal gate-out scan (RFID), (2) Rail rake loading at JNPT ICD (barcode), (3) WDFC transit tracking (GPS on rake locomotive), (4) ICD Bangalore arrival (RFID gate), (5) Customs examination if flagged by RMS, (6) Road transport to destination warehouse (GPS on truck). Advanced multi-modal tracking platforms use a unified Shipment ID that links all transit events across modes, enabling a single pane of glass view for logistics managers. The Indian Railways FOIS system provides real-time wagon tracking for CONCOR rakes, while integration with NHAI FASTag data enables road transit monitoring through toll plaza crossings. Companies achieving end-to-end multi-modal visibility report 30% reduction in total transit time variability, 45% fewer mis-routing incidents, and 20% improvement in container utilization through proactive positioning based on predicted arrival times.",
  },
];

export default function ShipmentTrackingMilestoneView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "carrier", label: "Carrier", options: CARRIERS.map(c => ({ value: c, count: records.filter(r => r.carrier === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUS.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "route", label: "Route", options: ROUTES.map(rt => ({ value: rt, count: records.filter(r => r.route === rt).length })) },
    { key: "transitMode", label: "Mode", options: TRANSIT_MODES.map(t => ({ value: t, count: records.filter(r => r.transitMode === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.awbNo.toLowerCase().includes(q) && !r.poRef.toLowerCase().includes(q) && !r.carrier.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ShipmentRecord] as string));
  });

  return (
    <div className="stm-root p-6 space-y-6">
      <PageHeader title="Shipment Tracking & Milestone Command" description="Real-time shipment lifecycle tracking, milestone management, OTIF analytics, e-POD confirmation and multi-modal transit visibility" />
      <div className="stm-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`stm-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-rose-600 text-white" : "text-gray-600 hover:bg-rose-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="stm-dash space-y-6">
          <div className="stm-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="stm-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 stm-kpi-label">{k.l}</div><div className="text-2xl font-bold text-rose-700 stm-kpi-val">{k.v}</div><div className="text-xs text-gray-400 stm-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="stm-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Shipments by Mode</h3><BarChart data={monthlyShipments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="road" fill="#be123c" radius={[4,4,0,0]} name="Road" /><Bar dataKey="rail" fill="#fb7185" radius={[4,4,0,0]} name="Rail" /><Bar dataKey="air" fill="#fda4af" radius={[4,4,0,0]} name="Air" /></BarChart></div>
            <div className="stm-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Exception Type Distribution</h3><PieChart width={400} height={220}><Pie data={exceptionDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{exceptionDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="stm-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">OTIF Trend vs Target</h3><LineChart data={otifTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[75, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="otif" stroke="#be123c" strokeWidth={2} name="OTIF %" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="stm-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Carrier OTIF Scorecard</h3><BarChart data={carrierPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[70, 100]} /><Tooltip /><Bar dataKey="otif" fill="#e11d48" radius={[4,4,0,0]} name="OTIF %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="stm-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Shipment", href: "#" }, { label: "Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="stm-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,AWB No,PO Ref,Carrier,Route,Mode,Status,Origin,Dest,Ship,ETA,Delivery,Weight,Pkgs,Location,Last Scan,Milestones,POD,Exception,Delay"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Exception" ? "stm-row-critical bg-red-50" : r.status === "In Transit" ? "stm-row-info bg-rose-50" : "";
              const mpct = r.milestones > 0 ? Math.round((r.milestonesComplete / r.milestones) * 100) : 0;
              return (<tr key={r.id} className={`border-b hover:bg-rose-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="stm-badge inline-block px-2 py-0.5 rounded text-xs bg-rose-100 text-rose-700 font-mono">{r.awbNo}</span></td>
                <td className="px-3 py-2 text-xs font-mono">{r.poRef}</td>
                <td className="px-3 py-2 text-xs">{r.carrier}</td>
                <td className="px-3 py-2 text-xs">{r.route}</td>
                <td className="px-3 py-2"><span className="stm-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.transitMode}</span></td>
                <td className="px-3 py-2"><span className={`stm-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs">{r.origin.split(" ").slice(-2).join(" ")}</td>
                <td className="px-3 py-2 text-xs">{r.destination.split(" ").slice(-2).join(" ")}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.shipDate}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.eta}</td>
                <td className="px-3 py-2 text-xs">{r.actualDelivery || "\u2014"}</td>
                <td className="px-3 py-2 text-xs">{fmtWt(r.weight)}</td>
                <td className="px-3 py-2 text-xs">{r.packages}</td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.currentLocation}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-40 truncate">{r.lastScan}</td>
                <td className="px-3 py-2"><div className="flex items-center gap-1"><div className="w-14 h-1.5 bg-gray-200 rounded"><div className="stm-milebar h-1.5 rounded" style={{ width: `${mpct}%`, background: mpct === 100 ? "#22c55e" : "#e11d48" }} /></div><span className="text-xs">{r.milestonesComplete}/{r.milestones}</span></div></td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 rounded text-xs ${r.podStatus === "Digital POD" || r.podStatus === "e-POD Signed" ? "bg-green-100 text-green-700" : r.podStatus === "RTO Confirmed" ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-700"}`}>{r.podStatus}</span></td>
                <td className="px-3 py-2">{r.exception !== "\u2014" ? <span className="stm-badge inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">{r.exception}</span> : <span className="text-slate-400 text-xs">\u2014</span>}</td>
                <td className="px-3 py-2">{r.delayHours > 0 ? <span className="text-red-600 text-xs font-semibold">{r.delayHours}h</span> : <span className="text-green-600 text-xs">On Time</span>}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="stm-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="stm-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Transit Time by Route</h3><BarChart data={ROUTES.map(r => ({ n: r, v: +ri(18, 96, 48 + Math.random() * 30).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#be123c" radius={[4,4,0,0]} /></BarChart></div>
            <div className="stm-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Shipment Volume by Route</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], north: ri(120, 280, 190 + Math.sin(i*0.5)*50), south: ri(100, 240, 160 + Math.cos(i*0.6)*40), east: ri(40, 120, 75 + Math.sin(i*0.7)*25) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="north" stackId="1" stroke="#be123c" fill="#ffe4e6" name="North" /><Area type="monotone" dataKey="south" stackId="1" stroke="#e11d48" fill="#fda4af" name="South" /><Area type="monotone" dataKey="east" stackId="1" stroke="#fb7185" fill="#f43f5e" name="East" /></AreaChart></div>
          </div>
          <div className="stm-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Delay Hours Distribution by Carrier</h3><BarChart data={CARRIERS.slice(0,6).map(c => ({ n: c, v: +ri(2, 28, 10 + Math.random()*12).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#e11d48" radius={[4,4,0,0]} /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="stm-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="stm-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-rose-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
