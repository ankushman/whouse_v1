"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#be123c", "#e11d48", "#f43f5e", "#fb7185", "#9f1239", "#881337", "#fda4af", "#ffe4e6"];
const PIPELINES = ["IOCL Salaya-Mathura", "HPCL Mumbai-Bangalore", "BPCL Koyali-Vijaypur", "GAIL Hazira-Vijaipur", "IOCL Paradeep-Haldia", "Gas Authority Dadri-Bawana", "ONGC Mumbai-Uran", "Petronet Dahej-Vijaipur"];
const PRODUCTS = ["Crude Oil", "Natural Gas", "Diesel (HSD)", "Petrol (MS)", "ATF (Aviation Turbine)", "LPG", "Petrochemicals", "Naphtha"];
const BATCH_STATUSES = ["Pumping Active", "Scheduled", "Delivered at Terminal", "Under Maintenance", "Pressure Anomaly", "Shut Down"];
const COMPANIES = ["IOCL", "HPCL", "BPCL", "GAIL", "ONGC", "Petronet LNG", "Adani Gas", "GSPC"];
const TABS = ["Dashboard", "Batch Registry", "Pipeline Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700", rose: "bg-rose-100 text-rose-700" };
const statusColor: Record<string, string> = { "Pumping Active": "rose", "Scheduled": "blue", "Delivered at Terminal": "green", "Under Maintenance": "slate", "Pressure Anomaly": "red", "Shut Down": "orange" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyThroughput = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], crude: ri(180, 320, 245 + Math.sin(i * 0.5) * 45), gas: ri(120, 220, 168 + Math.cos(i * 0.6) * 32), refined: ri(280, 480, 375 + Math.sin(i * 0.7) * 60), lpg: ri(40, 80, 58 + Math.cos(i * 0.8) * 12) }));
const productDist = [{ n: "Crude Oil", v: 28 }, { n: "Natural Gas", v: 22 }, { n: "Diesel (HSD)", v: 20 }, { n: "Petrol (MS)", v: 12 }, { n: "LPG", v: 8 }, { n: "ATF", v: 5 }, { n: "Naphtha", v: 3 }, { n: "Petrochemicals", v: 2 }];
const capacityUtil = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(72, 96, 84 + Math.sin(i * 0.4) * 8)).toFixed(1), target: 88.0 }));
const pipelinePerf = PIPELINES.slice(0, 6).map(p => ({ n: p.split(" ")[1] || p.split(" ")[0], v: +ri(78, 99, 88 + Math.random() * 8).toFixed(0) }));

interface BatchRecord { id: string; batchNo: string; pipeline: string; product: string; company: string; origin: string; destination: string; volume: number; unit: string; pressure: number; temperature: number; flowRate: number; startDate: string; eta: string; completionDate: string; durationHours: number; status: string; stationStops: number; pigRun: boolean; lastScada: string; remarks: string; }

const records: BatchRecord[] = [
  { id: "PPC-0001", batchNo: "BCH-SLY-MTH-2025-0142", pipeline: "IOCL Salaya-Mathura", product: "Crude Oil", company: "IOCL", origin: "Salaya Terminal", destination: "Mathura Refinery", volume: 85000, unit: "KL", pressure: 65, temperature: 42, flowRate: 2200, startDate: "2025-01-10", eta: "2025-01-12", completionDate: "", durationHours: 48, status: "Pumping Active", stationStops: 4, pigRun: false, lastScada: "2025-01-11 08:30 IST", remarks: "Crude batch Salaya to Mathura - 850 KL/hr" },
  { id: "PPC-0002", batchNo: "BCH-MUM-BLR-2025-0088", pipeline: "HPCL Mumbai-Bangalore", product: "Diesel (HSD)", company: "HPCL", origin: "Mumbai Refinery", destination: "Bangalore Terminal", volume: 42000, unit: "KL", pressure: 48, temperature: 38, flowRate: 1800, startDate: "2025-01-08", eta: "2025-01-10", completionDate: "2025-01-10", durationHours: 56, status: "Delivered at Terminal", stationStops: 6, pigRun: true, lastScada: "2025-01-10 18:00 IST", remarks: "HSD batch complete - pigging done at Bangalore" },
  { id: "PPC-0003", batchNo: "BCH-KOY-VJP-2025-0045", pipeline: "BPCL Koyali-Vijaypur", product: "Petrol (MS)", company: "BPCL", origin: "Koyali Refinery", destination: "Vijaypur Terminal", volume: 28000, unit: "KL", pressure: 52, temperature: 35, flowRate: 1500, startDate: "2025-01-14", eta: "2025-01-15", completionDate: "", durationHours: 30, status: "Pumping Active", stationStops: 3, pigRun: false, lastScada: "2025-01-14 22:15 IST", remarks: "MS batch Koyali to Vijaypur - Gujarat marketing" },
  { id: "PPC-0004", batchNo: "BCH-HZV-VJP-2025-0033", pipeline: "GAIL Hazira-Vijaipur", product: "Natural Gas", company: "GAIL", origin: "Hazira LNG Terminal", destination: "Vijaipur Gas Hub", volume: 3200000, unit: "SCM", pressure: 72, temperature: 28, flowRate: 48000, startDate: "2025-01-12", eta: "2025-01-12", completionDate: "2025-01-12", durationHours: 24, status: "Delivered at Terminal", stationStops: 8, pigRun: false, lastScada: "2025-01-12 16:00 IST", remarks: "Gas batch continuous flow - Hazira to Vijaipur 48\" pipeline" },
  { id: "PPC-0005", batchNo: "BCH-PRD-HLD-2025-0056", pipeline: "IOCL Paradeep-Haldia", product: "Crude Oil", company: "IOCL", origin: "Paradeep Port", destination: "Haldia Refinery", volume: 62000, unit: "KL", pressure: 58, temperature: 44, flowRate: 2000, startDate: "2025-01-13", eta: "2025-01-14", completionDate: "", durationHours: 36, status: "Scheduled", stationStops: 3, pigRun: false, lastScada: "Scheduled 2025-01-13 06:00", remarks: "Crude paradeep coastal refinery - scheduled start" },
  { id: "PPC-0006", batchNo: "BCH-DAD-BAW-2025-0022", pipeline: "Gas Authority Dadri-Bawana", product: "Natural Gas", company: "GAIL", origin: "Dadri CGD Hub", destination: "Bawana IGL", volume: 850000, unit: "SCM", pressure: 38, temperature: 22, flowRate: 12000, startDate: "2025-01-15", eta: "2025-01-15", completionDate: "", durationHours: 18, status: "Pumping Active", stationStops: 2, pigRun: false, lastScada: "2025-01-15 10:00 IST", remarks: "City gas Dadri to Bawana NCR distribution" },
  { id: "PPC-0007", batchNo: "BCH-OMU-URN-2025-0018", pipeline: "ONGC Mumbai-Uran", product: "Crude Oil", company: "ONGC", origin: "Mumbai High", destination: "Uran Processing", volume: 45000, unit: "KL", pressure: 70, temperature: 48, flowRate: 2800, startDate: "2025-01-11", eta: "2025-01-11", completionDate: "2025-01-11", durationHours: 12, status: "Delivered at Terminal", stationStops: 2, pigRun: true, lastScada: "2025-01-11 20:00 IST", remarks: "Offshore crude Mumbai High to Uran - pig complete" },
  { id: "PPC-0008", batchNo: "BCH-DHJ-VJP-2025-0125", pipeline: "Petronet Dahej-Vijaipur", product: "Natural Gas", company: "Petronet LNG", origin: "Dahej LNG Terminal", destination: "Vijaipur Hub", volume: 5200000, unit: "SCM", pressure: 82, temperature: 25, flowRate: 62000, startDate: "2025-01-07", eta: "2025-01-09", completionDate: "2025-01-09", durationHours: 60, status: "Delivered at Terminal", stationStops: 10, pigRun: false, lastScada: "2025-01-09 12:00 IST", remarks: "LNG regasified Dahej to Vijaipur - 48\" trunk" },
  { id: "PPC-0009", batchNo: "BCH-SLY-MTH-2025-0145", pipeline: "IOCL Salaya-Mathura", product: "ATF (Aviation Turbine)", company: "IOCL", origin: "Kandla ATF Depot", destination: "Delhi IGI Airport", volume: 12000, unit: "KL", pressure: 55, temperature: 32, flowRate: 800, startDate: "2025-01-14", eta: "2025-01-16", completionDate: "", durationHours: 42, status: "Pumping Active", stationStops: 5, pigRun: false, lastScada: "2025-01-15 06:00 IST", remarks: "Aviation turbine fuel - Delhi airport supply" },
  { id: "PPC-0010", batchNo: "BCH-MUM-BLR-2025-0092", pipeline: "HPCL Mumbai-Bangalore", product: "LPG", company: "HPCL", origin: "Mumbai LPG Import", destination: "Bangalore LPG Bottling", volume: 8500, unit: "MT", pressure: 22, temperature: 18, flowRate: 350, startDate: "2025-01-09", eta: "2025-01-13", completionDate: "", durationHours: 72, status: "Under Maintenance", stationStops: 0, pigRun: false, lastScada: "2025-01-10 14:00 IST", remarks: "LPG pipeline - valve maintenance at Pune section" },
  { id: "PPC-0011", batchNo: "BCH-KOY-VJP-2025-0048", pipeline: "BPCL Koyali-Vijaypur", product: "Naphtha", company: "BPCL", origin: "Koyali Refinery", destination: "Gujarat Petrochem", volume: 18000, unit: "KL", pressure: 50, temperature: 36, flowRate: 1200, startDate: "2025-01-15", eta: "2025-01-16", completionDate: "", durationHours: 24, status: "Scheduled", stationStops: 2, pigRun: false, lastScada: "Scheduled 2025-01-15 18:00", remarks: "Naphtha feedstock for Gujarat petrochem complex" },
  { id: "PPC-0012", batchNo: "BCH-HZV-VJP-2025-0038", pipeline: "GAIL Hazira-Vijaipur", product: "Petrochemicals", company: "GAIL", origin: "Hazira Petrochem", destination: "Vijaipur IPCL", volume: 5500, unit: "MT", pressure: 42, temperature: 30, flowRate: 280, startDate: "2025-01-13", eta: "2025-01-14", completionDate: "", durationHours: 28, status: "Pressure Anomaly", stationStops: 1, pigRun: false, lastScada: "2025-01-13 22:45 IST", remarks: "Ethylene pipeline - pressure drop at Ratlam station" },
  { id: "PPC-0013", batchNo: "BCH-PRD-HLD-2025-0058", pipeline: "IOCL Paradeep-Haldia", product: "Diesel (HSD)", company: "IOCL", origin: "Paradeep Refinery", destination: "Kolkata Depot", volume: 35000, unit: "KL", pressure: 54, temperature: 40, flowRate: 1600, startDate: "2025-01-11", eta: "2025-01-12", completionDate: "2025-01-12", durationHours: 32, status: "Delivered at Terminal", stationStops: 4, pigRun: true, lastScada: "2025-01-12 14:00 IST", remarks: "HSD Paradeep refinery to Kolkata marketing depot" },
  { id: "PPC-0014", batchNo: "BCH-DHJ-VJP-2025-0128", pipeline: "Petronet Dahej-Vijaipur", product: "LPG", company: "Petronet LNG", origin: "Dahej LNG", destination: "Jaipur LPG Hub", volume: 6200, unit: "MT", pressure: 28, temperature: 20, flowRate: 420, startDate: "2025-01-15", eta: "2025-01-17", completionDate: "", durationHours: 48, status: "Shut Down", stationStops: 0, pigRun: false, lastScada: "2025-01-15 04:00 IST", remarks: "LPG batch - emergency shutdown leak detection Kota" },
];

const pumpingCount = records.filter(r => r.status === "Pumping Active").length;
const deliveredCount = records.filter(r => r.status === "Delivered at Terminal").length;
const alertCount = records.filter(r => r.status === "Pressure Anomaly" || r.status === "Shut Down" || r.status === "Under Maintenance").length;
const scheduledCount = records.filter(r => r.status === "Scheduled").length;

const kpis = [
  { l: "Pumping Active", v: pumpingCount, s: "live batches in pipeline" },
  { l: "Delivered", v: deliveredCount, s: "completed this period" },
  { l: "Alerts / Shutdowns", v: alertCount, s: "requires attention" },
  { l: "Scheduled", v: scheduledCount, s: "upcoming batches" },
];

const INSIGHTS = [
  {
    t: "India Petroleum Pipeline Network: 33,000+ km and \u20b912 Lakh Crore Throughput",
    c: "India operates one of the world\u2019s largest petroleum product pipeline networks, spanning approximately 33,000+ km across crude oil, natural gas, and refined product pipelines. The network is managed by multiple operators: (1) Indian Oil Corporation (IOCL) with 15,000+ km of crude and product pipelines including the 1,440 km Salaya-Mathura crude pipeline, 1,250 km Koyali-Vijaypur product pipeline, and 1,690 km Paradeep-Haldia crude pipeline, (2) GAIL (Gas Authority of India) operating 17,500+ km of natural gas trunk pipelines including the 2,780 km Hazira-Vijaipur pipeline (India\u2019s first HBJ pipeline commissioned in 1987), 1,850 km Dadri-Bawana pipeline, and the 2,655 km Dabhol-Bangalore gas pipeline, (3) HPCL with 4,200+ km of product pipelines (Mumbai-Bangalore 1,020 km, Vishakhapatnam-Secunderabad 680 km), (4) BPCL with 3,800+ km including Koyali-Vijaypur and Mundra-Delhi product pipelines, (5) ONGC operating 5,800+ km of offshore and onshore crude gathering pipelines from Mumbai High, Bassian, and Heera offshore fields, and (6) Petronet LNG operating the 1,375 km Dahej-Vijaipur natural gas pipeline from India\u2019s largest LNG import terminal at Dahej. India\u2019s pipeline network handles approximately 350 MMT of crude oil (65% of refinery throughput, balance by coastal shipping and rail), 175 MMSCMD of natural gas, and 85 MMT of refined products annually. The Petroleum and Natural Gas Regulatory Board (PNGRB) regulates pipeline tariffs, access codes, and capacity allocation. India\u2019s pipeline logistics cost is \u20b980-150 per tonne per 100 km for crude/product pipelines and \u20b912-25 per SCM per 100 km for natural gas pipelines, representing 30-40% lower cost compared to rail and 50-60% lower than road transport for equivalent volumes. The Government of India\u2019s National Gas Grid expansion plan targets 35,000 km of natural gas pipelines by 2030 (current: 22,000 km operational), connecting all state capitals and major industrial centers.",
  },
  {
    t: "SCADA and Pipeline Safety: Real-Time Monitoring and Leak Detection",
    c: "India\u2019s petroleum pipeline network is monitored through SCADA (Supervisory Control and Data Acquisition) systems providing real-time visibility into pressure, temperature, flow rate, and valve positions across 100% of trunk pipeline operations. Major pipeline operators deploy: (1) IOCL Pipeline SCADA system monitoring 350+ stations with 15-minute data refresh cycle, (2) GAIL\u2019s National SCADA System (NSS) covering 17,500 km with 5-minute data sampling, (3) Integrated leak detection systems (LDS) using mass balance, pressure wave analysis, and acoustic monitoring with 3-5 minute leak detection time for losses exceeding 0.5% of throughput, (4) Fiber optic Distributed Temperature Sensing (DTS) along 2,500+ km of critical pipeline sections providing 1-meter spatial resolution for leak detection, and (5) Satellite-based pipeline integrity monitoring (InSAR technology) detecting ground movement within 5 mm accuracy along pipeline right-of-way. Pipeline safety is governed by the Oil and Gas Pipelines Act 2019 and OISD (Oil Industry Safety Directorate) standards: (1) Class I (high consequence) areas require double-walled pipelines or emergency isolation valves every 15 km, (2) Maximum allowable operating pressure (MAOP) with safety factor of 0.72 on specified minimum yield strength (SMYS), (3) Hydrostatic testing at 1.25x MAOP before commissioning, (4) Smart pigging (in-line inspection) every 5 years for corrosion mapping and geometry assessment, and (5) Cathodic protection monitoring with 95% coverage target. India\u2019s pipeline safety record shows: (1) 0.8 incidents per 1,000 km per year (among the best globally), (2) Average spill volume 45 KL per incident (versus 150 KL global average), (3) 95% of incidents detected within 30 minutes via SCADA, and (4) 99.2% emergency shutdown valve reliability. GAIL\u2019s pipeline system achieved ISO 55001 Asset Management certification and PNGRB\u2019s annual safety audit confirms 96.5% compliance across all operators. Drone-based aerial patrol is deployed along 5,000+ km of right-of-way in sensitive areas (river crossings, national parks, urban proximity) with weekly inspection frequency.",
  },
  {
    t: "Product Pipeline Batching and Scheduling: Sequence Optimization",
    c: "India\u2019s multi-product pipeline operators employ sophisticated batching and scheduling systems to maximize pipeline utilization while maintaining product quality at interface zones between different products. Key batching operations: (1) IOCL operates 15 multi-product pipelines handling 8-12 different products (MS, HSD, SKO, ATF, LPG, Naphtha, Crude) in sequence with interface detection using density meters and UV fluorescence tracers, (2) HPCL\u2019s Mumbai-Bangalore pipeline carries 6 products in weekly batch cycles with 0.3-0.5% interface mixing volume between adjacent products, (3) BPCL\u2019s Koyali-Vijaypur pipeline uses on-line densitometers for interface detection, triggering receipt terminal switching within 60 seconds of interface arrival, and (4) GAIL\u2019s natural gas trunk pipelines use quality tracking (calorific value, Wobbe index) for managing gas from multiple sources (LNG regasified, domestic gas fields, CBM) in the same pipeline. Pipeline batch scheduling optimization uses linear programming models minimizing: (1) Interface volume (reduced by 40% through optimized sequencing: Naphtha-SKO-MS-HSD order), (2) Pumping energy cost (optimized flow rates based on electricity tariff structure), (3) Transit time matching customer delivery windows, and (4) Pipeline downtime for pigging operations. Smart pigging operations (internal pipeline inspection pigs) are scheduled every 5 years for MFL (Magnetic Flux Leakage) corrosion detection and caliper geometry surveys, with each pig run generating 500,000+ data points for pipeline integrity assessment. IOCL\u2019s advanced pipeline scheduling system (APSS) processes 2,500+ batch requests per month, optimizing across 15 pipelines with 98.5% on-time delivery performance. India\u2019s product pipeline throughput efficiency averages 82-88% utilization, with peaks during rabi crop season (October-March) when diesel and fertilizer feedstock demand increases 20-25%.",
  },
  {
    t: "CGD Network and Last-Mile Gas Distribution: PNG and CNG Expansion",
    c: "India\u2019s City Gas Distribution (CGD) network, the last-mile extension of the natural gas pipeline grid, has expanded rapidly under the PNGRB CGD bidding rounds (10 rounds covering 298 geographical areas covering 98% of India\u2019s population). The CGD network comprises: (1) 1,50,000+ km of steel and MDPE (Medium Density Polyethylene) distribution pipelines, (2) 1,200+ CNG stations dispensing natural gas to vehicles (auto-rickshaws, buses, trucks), (3) 95+ lakh (9.5 million) domestic PNG (Piped Natural Gas) connections for household cooking, (4) 45,000+ commercial/industrial PNG connections for restaurants, hotels, hospitals, and industries, and (5) 75+ City Gas Licensee companies including GAIL Gas, IGL (Indraprastha Gas), MGL (Mahanagar Gas), Adani Total Gas, Torrent Gas, and Gujarat Gas. India\u2019s CGD network consumes approximately 35-40 MMSCMD of natural gas (22% of total gas consumption), with CGD demand growing at 15-18% CAGR. The Government of India\u2019s target is 100% CGD coverage of all districts by 2030, requiring an additional 80,000 km of distribution pipelines and 50 million domestic PNG connections. Key CGD metrics: (1) Household PNG penetration: 12% nationally (target: 50% by 2030 in covered GAs), (2) CNG station density: 1 station per 8-10 km in major cities, (3) Average domestic PNG consumption: 0.35 SCM per household per day (replacing 1 LPG cylinder per month), (4) Commercial PNG savings: 30-40% cost reduction versus LPG for restaurants, and (5) CNG vehicle savings: 40-50% fuel cost reduction versus petrol, 25-30% versus diesel. CGD pipeline safety is regulated under OISD-193 standards requiring: monthly leakage surveys, annual pressure testing, and 5-yearly pipeline replacement for MDPE networks. India\u2019s CGD sector has attracted \u20b978,000 crore in private investment over the past 5 years, with major players committing \u20b91,20,000 crore for network expansion through FY2028. The CGD expansion is expected to displace 8 crore (80 million) LPG cylinders annually by 2030, reducing India\u2019s LPG import bill by \u20b925,000 crore and CO2 emissions by 15 million tonnes per year.",
  },
];

export default function PetroleumPipelineCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: BATCH_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "product", label: "Product", options: PRODUCTS.map(p => ({ value: p, count: records.filter(r => r.product === p).length })) },
    { key: "company", label: "Company", options: COMPANIES.map(c => ({ value: c, count: records.filter(r => r.company === c).length })) },
    { key: "pipeline", label: "Pipeline", options: PIPELINES.map(p => ({ value: p, count: records.filter(r => r.pipeline === p).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.pipeline.toLowerCase().includes(q) && !r.origin.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof BatchRecord] as string));
  });

  return (
    <div className="ppc-root p-6 space-y-6">
      <PageHeader title="Petroleum Pipeline Command" description="India petroleum and natural gas pipeline network operations, crude oil/product batching, SCADA monitoring, GAIL/IOCL/HPCL/BPCL pipeline dispatch, CGD city gas distribution, leak detection, and integrity management across 33,000+ km network" />
      <div className="ppc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`ppc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-rose-700 text-white" : "text-gray-600 hover:bg-rose-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="ppc-dash space-y-6">
          <div className="ppc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="ppc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 ppc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-rose-700 ppc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 ppc-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ppc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Pipeline Throughput (Lakh KL/SCM)</h3><BarChart data={monthlyThroughput} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="crude" fill="#be123c" radius={[4,4,0,0]} name="Crude Oil" /><Bar dataKey="gas" fill="#e11d48" radius={[4,4,0,0]} name="Natural Gas" /><Bar dataKey="refined" fill="#f43f5e" radius={[4,4,0,0]} name="Refined" /><Bar dataKey="lpg" fill="#fb7185" radius={[4,4,0,0]} name="LPG" /></BarChart></div>
            <div className="ppc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Product Transport Distribution</h3><PieChart width={400} height={220}><Pie data={productDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{productDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ppc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Pipeline Capacity Utilization (%) vs 88% Target</h3><LineChart data={capacityUtil} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[65, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#be123c" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="ppc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Pipeline Availability Score (%)</h3><BarChart data={pipelinePerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[70, 100]} /><Tooltip /><Bar dataKey="v" fill="#e11d48" radius={[4,4,0,0]} name="Availability %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="ppc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Pipeline Command", href: "#" }, { label: "Batch Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="ppc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Batch No,Pipeline,Product,Company,Origin,Dest,Volume,Pressure,Temp,Flow Rate,Start,ETA,Duration (h),Status,Pig,Last SCADA,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Pressure Anomaly" || r.status === "Shut Down" ? "ppc-row-critical bg-red-50" : r.status === "Under Maintenance" ? "ppc-row-warning bg-amber-50" : r.status === "Pumping Active" ? "ppc-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-rose-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="ppc-badge inline-block px-2 py-0.5 rounded text-xs bg-rose-700 text-white font-mono">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.pipeline}</td>
                <td className="px-3 py-2"><span className="ppc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.product}</span></td>
                <td className="px-3 py-2 text-xs font-semibold">{r.company}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.destination}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.volume.toLocaleString()} {r.unit}</td>
                <td className="px-3 py-2 text-xs font-mono"><span className={r.pressure > 70 ? "text-red-600 font-semibold" : "text-green-600"}>{r.pressure} bar</span></td>
                <td className="px-3 py-2 text-xs font-mono">{r.temperature}\u00b0C</td>
                <td className="px-3 py-2 text-xs text-right">{r.flowRate.toLocaleString()}/hr</td>
                <td className="px-3 py-2 text-xs">{r.startDate}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.durationHours > 48 ? "text-red-600" : r.durationHours > 24 ? "text-amber-600" : "text-green-600"}`}>{r.durationHours}h</span></td>
                <td className="px-3 py-2"><span className={`ppc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-center">{r.pigRun ? <span className="text-green-600 font-bold">Pig</span> : <span className="text-gray-400">\u2014</span>}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-28 truncate">{r.lastScada}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="ppc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="ppc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Batch Volume by Company</h3><BarChart data={COMPANIES.slice(0,6).map(c => ({ n: c, v: +ri(28, 145, 72 + Math.random() * 50).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#be123c" radius={[4,4,0,0]} name="Batches" /></BarChart></div>
            <div className="ppc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Throughput by Pipeline Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], crude: ri(180, 350, 260 + Math.sin(i*0.5)*55), gas: ri(120, 240, 175 + Math.cos(i*0.6)*40), refined: ri(250, 440, 340 + Math.sin(i*0.7)*55) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="crude" stackId="1" stroke="#be123c" fill="#ffe4e6" name="Crude" /><Area type="monotone" dataKey="gas" stackId="1" stroke="#e11d48" fill="#fecdd3" name="Gas" /><Area type="monotone" dataKey="refined" stackId="1" stroke="#f43f5e" fill="#fff1f2" name="Refined" /></AreaChart></div>
          </div>
          <div className="ppc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Batch Duration by Product Type (hours)</h3><BarChart data={[{n:"Crude Oil",v:42},{n:"Natural Gas",v:36},{n:"Diesel",v:38},{n:"Petrol",v:28},{n:"ATF",v:32},{n:"LPG",v:60},{n:"Petrochem",v:26},{n:"Naphtha",v:24}].map(d => ({...d, v: +ri(d.v-5, d.v+8, d.v + Math.random()*5).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#e11d48" radius={[4,4,0,0]} name="Hours" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="ppc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="ppc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-rose-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
