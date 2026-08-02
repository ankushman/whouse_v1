"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#c2410c", "#9a3412", "#fed7aa", "#ffedd5"];
const DEPOTS = ["IOC Faridabad Bottling", "BPL Gwalior Terminal", "HPCL Vizag Refinery", "BPCL Mumbai Mahul", "IOC Lucknow Plant", "BPL Indore Terminal", "HPCL Chennai Ennore", "BPCL Kochi Refinery"];
const CATEGORIES = ["Domestic 14.2kg", "Domestic 5kg", "Commercial 19kg", "Auto LPG", "Industrial Bulk", "Cylinder Recertification", "Valve & Regulator", "Pipeline Supply"];
const DELIVERY_STATUSES = ["Dispatched", "In Transit", "Delivered", "Under Verification", "Safety Hold", "Rescheduled"];
const ZONES = ["North India", "West India", "South India", "East India", "Central India", "Northeast"];
const MODES = ["LPG Bullet Truck", "Tanker Lorry", "Rail Tank Wagon", "Pipeline", "Cascade Truck", "Flatbed Trailer"];
const TABS = ["Dashboard", "Delivery Registry", "LPG Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Dispatched": "blue", "In Transit": "blue", "Delivered": "green", "Under Verification": "amber", "Safety Hold": "red", "Rescheduled": "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyDeliveries = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], domestic: ri(1200, 2200, 1650 + Math.sin(i * 0.5) * 250), commercial: ri(400, 800, 580 + Math.cos(i * 0.6) * 100), autolpg: ri(200, 450, 320 + Math.sin(i * 0.7) * 60), bulk: ri(80, 180, 120 + Math.cos(i * 0.8) * 30) }));
const categoryDist = [{ n: "Domestic 14.2kg", v: 42 }, { n: "Commercial 19kg", v: 18 }, { n: "Auto LPG", v: 14 }, { n: "Industrial Bulk", v: 10 }, { n: "Domestic 5kg", v: 7 }, { n: "Pipeline Supply", v: 5 }, { n: "Valve & Regulator", v: 3 }, { n: "Recertification", v: 1 }];
const safetyTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(97.5, 99.9, 98.6 + Math.sin(i * 0.4) * 0.5)).toFixed(1), target: 98.0 }));
const depotPerf = DEPOTS.slice(0, 6).map(d => ({ n: d.split(" ").slice(0, 2).join(" "), v: +ri(85, 98, 92 + Math.random() * 4).toFixed(0) }));

interface DeliveryRecord { id: string; consignment: string; depot: string; zone: string; category: string; item: string; quantity: number; unit: string; dealer: string; origin: string; destination: string; mode: string; dispatchDate: string; deliveryDate: string; transitDays: number; cylindersValueLakhs: number; safetyFlag: boolean; status: string; remarks: string; }

const records: DeliveryRecord[] = [
  { id: "LPG-0001", consignment: "CNS-IOC/2025/7821", depot: "IOC Faridabad Bottling", zone: "North India", category: "Domestic 14.2kg", item: "14.2kg Composite Cylinder Lot-A", quantity: 2400, unit: "Cylinders", dealer: "SuperGas Distributor Noida", origin: "Faridabad Plant", destination: "Noida Sector-18 Godown", mode: "LPG Bullet Truck", dispatchDate: "2025-07-10", deliveryDate: "", transitDays: 1, cylindersValueLakhs: 42, safetyFlag: true, status: "In Transit", remarks: "Composite cylinder lot for Gautam Buddh Nagar district" },
  { id: "LPG-0002", consignment: "CNS-BPL/2025/5432", depot: "BPL Gwalior Terminal", zone: "Central India", category: "Commercial 19kg", item: "19kg Steel Cylinder Filled LPG", quantity: 800, unit: "Cylinders", dealer: "BharatGas Commercial Bhopal", origin: "Gwalior Terminal", destination: "Bhopal Industrial Area", mode: "Tanker Lorry", dispatchDate: "2025-07-08", deliveryDate: "2025-07-09", transitDays: 1, cylindersValueLakhs: 28, safetyFlag: false, status: "Delivered", remarks: "Commercial 19kg for restaurant cluster Habibganj" },
  { id: "LPG-0003", consignment: "CNS-HPCL/2025/9087", depot: "HPCL Vizag Refinery", zone: "South India", category: "Auto LPG", item: "Auto LPG Dispenser Tank 5KL", quantity: 12, unit: "Tanks", dealer: "HPCL Fuel Station Vizag", origin: "Vizag Refinery", destination: "Visakhapatnam Port Area", mode: "Tanker Lorry", dispatchDate: "2025-07-11", deliveryDate: "", transitDays: 1, cylindersValueLakhs: 18, safetyFlag: true, status: "In Transit", remarks: "Auto LPG dispensing tanks for new fuel station setup" },
  { id: "LPG-0004", consignment: "CNS-BPCL/2025/3456", depot: "BPCL Mumbai Mahul", zone: "West India", category: "Pipeline Supply", item: "Pipeline LPG Transfer Batch Jul-3", quantity: 500, unit: "Tonnes", dealer: "BPCL Mumbai Distribution Hub", origin: "Mahul Refinery", destination: "BPCL Wadala Terminal", mode: "Pipeline", dispatchDate: "2025-07-09", deliveryDate: "2025-07-09", transitDays: 0, cylindersValueLakhs: 350, safetyFlag: false, status: "Delivered", remarks: "Pipeline batch transfer Mumbai refinery to Wadala terminal" },
  { id: "LPG-0005", consignment: "CNS-IOC/2025/6789", depot: "IOC Lucknow Plant", zone: "North India", category: "Domestic 14.2kg", item: "14.2kg Steel Cylinder Re-certified", quantity: 1800, unit: "Cylinders", dealer: "Indane Distributor Lucknow", origin: "IOC Lucknow", destination: "Lucknow Chowk Godown", mode: "LPG Bullet Truck", dispatchDate: "2025-07-07", deliveryDate: "2025-07-08", transitDays: 1, cylindersValueLakhs: 25, safetyFlag: false, status: "Delivered", remarks: "Re-certified steel cylinders for Lucknow urban circle" },
  { id: "LPG-0006", consignment: "CNS-BPL/2025/1234", depot: "BPL Indore Terminal", zone: "Central India", category: "Valve & Regulator", item: "LPG Valve Assembly Type-C + Regulator", quantity: 3200, unit: "Sets", dealer: "SuperGas Parts Indore", origin: "Indore Terminal", destination: "Indore Warehouse Phase-2", mode: "Flatbed Trailer", dispatchDate: "2025-07-12", deliveryDate: "", transitDays: 1, cylindersValueLakhs: 16, safetyFlag: false, status: "Dispatched", remarks: "Valve+regulator combo kits for Indore depot replenishment" },
  { id: "LPG-0007", consignment: "CNS-HPCL/2025/5678", depot: "HPCL Chennai Ennore", zone: "South India", category: "Industrial Bulk", item: "Bulk LPG ISO Tank 20T", quantity: 8, unit: "ISO Tanks", dealer: "HPCL Bulk Chennai Port", origin: "Ennore Terminal", destination: "Chennai Industrial Estate", mode: "Flatbed Trailer", dispatchDate: "2025-07-06", deliveryDate: "2025-07-08", transitDays: 2, cylindersValueLakhs: 96, safetyFlag: true, status: "Delivered", remarks: "ISO tank bulk LPG for Chennai pharma industrial cluster" },
  { id: "LPG-0008", consignment: "CNS-BPCL/2025/8901", depot: "BPCL Kochi Refinery", zone: "South India", category: "Cylinder Recertification", item: "Expired Cylinder Batch Recertification", quantity: 950, unit: "Cylinders", dealer: "BharatGas Ernakulam", origin: "Kochi Refinery", destination: "BPCL Ernakulam Depot", mode: "Cascade Truck", dispatchDate: "2025-07-05", deliveryDate: "", transitDays: 1, cylindersValueLakhs: 8, safetyFlag: true, status: "Safety Hold", remarks: "Safety hold: 15 cylinders failed hydrostatic test, quarantine pending re-inspection by CCOE" },
  { id: "LPG-0009", consignment: "CNS-IOC/2025/2345", depot: "IOC Faridabad Bottling", zone: "North India", category: "Domestic 5kg", item: "5kg Free Trade LPG Cylinder Ujjwala", quantity: 5000, unit: "Cylinders", dealer: "PMUY Distributor Aligarh", origin: "Faridabad Plant", destination: "Aligarh Rural Cluster", mode: "LPG Bullet Truck", dispatchDate: "2025-07-11", deliveryDate: "", transitDays: 2, cylindersValueLakhs: 35, safetyFlag: false, status: "In Transit", remarks: "PMUY 5kg cylinders for Aligarh rural PM Ujjwala beneficiaries" },
  { id: "LPG-0010", consignment: "CNS-BPL/2025/4567", depot: "BPL Gwalior Terminal", zone: "East India", category: "Commercial 19kg", item: "19kg LPG Filled for Hotel Industry", quantity: 600, unit: "Cylinders", dealer: "BharatGas Ranchi", origin: "Gwalior Terminal", destination: "Ranchi Hotel Zone", mode: "Rail Tank Wagon", dispatchDate: "2025-07-10", deliveryDate: "", transitDays: 3, cylindersValueLakhs: 22, safetyFlag: false, status: "Under Verification", remarks: "Rail wagon dispatch to Ranchi - awaiting BIS batch verification at siding" },
  { id: "LPG-0011", consignment: "CNS-HPCL/2025/6789", depot: "HPCL Vizag Refinery", zone: "South India", category: "Auto LPG", item: "Auto LPG Station Refill 8KL", quantity: 24, unit: "KL", dealer: "HPCL Auto LPG Hyderabad", origin: "Vizag Refinery", destination: "Hyderabad Auto LPG Hub", mode: "Tanker Lorry", dispatchDate: "2025-07-09", deliveryDate: "2025-07-10", transitDays: 1, cylindersValueLakhs: 14, safetyFlag: false, status: "Delivered", remarks: "Auto LPG bulk refill for Hyderabad twin-city dispensing network" },
  { id: "LPG-0012", consignment: "CNS-BPCL/2025/1122", depot: "BPCL Mumbai Mahul", zone: "West India", category: "Domestic 14.2kg", item: "14.2kg Composite Cylinder Eco-Pack", quantity: 3600, unit: "Cylinders", dealer: "BharatGas Pune Urban", origin: "Mumbai Mahul", destination: "Pune Wakad Godown", mode: "LPG Bullet Truck", dispatchDate: "2025-07-12", deliveryDate: "", transitDays: 1, cylindersValueLakhs: 58, safetyFlag: true, status: "In Transit", remarks: "Composite eco-cylinders for Pune urban expansion circle" },
  { id: "LPG-0013", consignment: "CNS-IOC/2025/7890", depot: "IOC Lucknow Plant", zone: "North India", category: "Industrial Bulk", item: "Bulk LPG Sphere Tank 15T", quantity: 6, unit: "Tanker Loads", dealer: "IOC Varanasi Industrial", origin: "IOC Lucknow", destination: "Varanasi Industrial Area", mode: "Tanker Lorry", dispatchDate: "2025-07-08", deliveryDate: "", transitDays: 2, cylindersValueLakhs: 72, safetyFlag: true, status: "Rescheduled", remarks: "Rescheduled: Varanasi depot receiving bay under maintenance, ETA Jul-14" },
  { id: "LPG-0014", consignment: "CNS-HPCL/2025/3344", depot: "HPCL Chennai Ennore", zone: "South India", category: "Domestic 14.2kg", item: "14.2kg Steel Cylinder Standard Fill", quantity: 2000, unit: "Cylinders", dealer: "HPCL Distributor Madurai", origin: "Ennore Terminal", destination: "Madurai Distribution Hub", mode: "Rail Tank Wagon", dispatchDate: "2025-07-11", deliveryDate: "2025-07-12", transitDays: 1, cylindersValueLakhs: 32, safetyFlag: false, status: "Delivered", remarks: "Standard 14.2kg steel fill for Madurai distribution circle" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Dispatched").length;
const holdCount = records.filter(r => r.status === "Safety Hold" || r.status === "Rescheduled").length;
const deliveredCount = records.filter(r => r.status === "Delivered").length;
const totalValue = records.reduce((s, r) => s + r.cylindersValueLakhs, 0);

const kpis = [
  { l: "In Transit / Dispatched", v: transitCount, s: "active deliveries" },
  { l: "Hold / Rescheduled", v: holdCount, s: "needs attention" },
  { l: "Delivered", v: deliveredCount, s: "completed" },
  { l: "Total Consignment Value", v: `\u20b9${totalValue}L`, s: "across all zones" },
];

const INSIGHTS = [
  {
    t: "India LPG Distribution: 12 Crore Households, 2.8 Lakh Distributors, \u20b980,000 Crore Market",
    c: "India is the world\u2019s second-largest LPG consumer (28 MMT annual, 2024-25) after the United States, with 12 crore (120 million) active LPG connections serving 95%+ of Indian households. The PAHAL (Direct Benefit Transfer for LPG) scheme covers 10.8 crore connections, saving the government \u20b945,000 crore annually by eliminating subsidies for non-target beneficiaries. PM Ujjwala Yojana (PMUY), launched in 2016, has provided 10.4 crore free LPG connections to Below Poverty Line (BPL) families, with 3.4 crore additional connections under Ujjwala 2.0 (2021). India\u2019s LPG distribution network comprises: (1) Three public sector oil marketing companies (OMCs) \u2014 Indian Oil Corporation (IOC/Indane, 6.2 crore connections), Bharat Petroleum Corporation (BPCL/BharatGas, 3.4 crore), and Hindustan Petroleum Corporation (HPCL/HP Gas, 2.4 crore), (2) 2.8 lakh LPG distributors (rural + urban), (3) 84 LPG bottling plants across India with a combined capacity of 42 lakh cylinders per day, (4) 15,000+ LPG bullet trucks (tanker lorries), 5,000+ rail tank wagons, and 800+ km of dedicated LPG pipeline, and (5) Annual LPG imports of 16 MMT (57% of consumption) via 6 import terminals at Kandla, Mangalore, Ennore, Kochi, Haldia, and Paradip. India\u2019s LPG demand is growing at 6-7% CAGR driven by: (a) Rural penetration (67% rural vs 98% urban), (b) Commercial/hotel/cafe segment growth (15% CAGR), (c) Auto LPG adoption for 3-wheelers and fleet vehicles (12% growth), and (d) Industrial applications in food processing, ceramics, and glass manufacturing. The total LPG distribution logistics market is valued at approximately \u20b980,000 crore annually, including transportation (\u20b925,000 crore), bottling operations (\u20b918,000 crore), distributor margins (\u20b912,000 crore), and safety/compliance (\u20b98,000 crore).",
  },
  {
    t: "LPG Safety and Compliance: PESO, CCOE, IS Standards, and Cylinder Lifecycle Management",
    c: "India\u2019s LPG distribution operates under stringent safety regulations enforced by: (1) Petroleum and Explosives Safety Organisation (PESO) under the Explosives Act 1884 and Petroleum Rules 2002, (2) Chief Controller of Explosives (CCOE) for cylinder testing, plant licensing, and storage approvals, (3) Bureau of Indian Standards (BIS) for cylinder manufacturing (IS 15317 for composite, IS 3196 for steel), valve standards (IS 8977), and regulator standards (IS 5781), and (4) Oil Industry Safety Directorate (OISD) for depot, terminal, and plant safety. Key compliance requirements include: (a) Cylinder requalification every 10 years (hydrostatic stretch test per IS 15317), with 2.4 crore cylinders due for re-testing by 2026, (b) Depot safety distance norms (Class A/B/C petroleum storage with specific setback distances from habitations), (c) Transport vehicle compliance \u2014 LPG bullet trucks must have: vapor recovery system, pressure relief valves (PRV set at 2.5 MPa), rear under-run protection, reflective hazard markings, GPS tracking with OMC command center integration, and spark-proof exhaust systems, (d) Dealer safety audit: annual PESO inspection, fire fighting equipment (dry chemical powder DCP extinguishers, water hose reels), ventilation compliance, and emergency isolation valves. India\u2019s LPG cylinder lifecycle: (1) Manufacturing (2,000+ lakh cylinders, 4 OEMs \u2014 Everest Composite, Navrang Steel, Satyam Auto, Indian Oil own plants), (2) Filling at 84 bottling plants (automated carousel filling machines, 280 cylinders/hour throughput), (3) Distribution via bullet trucks to 2.8 lakh distributors, (4) Usage period (average 3-5 refills per year per household), (5) Return and requalification (10-year cycle, 85% pass rate on hydrostatic test), and (6) Retirement and recycling (scrap after 3 requalification cycles or failure). Safety incidents: India records approximately 800 LPG-related fire incidents annually (declining 8% YoY due to safety awareness, composite cylinder adoption, and IoT-based leak detection).",
  },
  {
    t: "LPG Transportation Modes: Bullet Trucks, Rail Wagons, Pipelines, and Last-Mile Delivery",
    c: "India\u2019s LPG logistics operates across four primary transportation modes: (1) Road transport (75% of volume): 15,000+ LPG bullet trucks (capacities: 5 MT, 12 MT, 18 MT, 20 MT) with average transit of 200-500 km per trip, GPS-tracked and speed-governed (60 km/h highways, 40 km/h urban), (2) Rail tank wagons (12% of volume): 5,000+ wagons (90 MT per wagon) operated by CONCOR and Indian Railways, primarily for long-distance routes (500+ km) such as Kandla to Delhi, Paradip to Kolkata, Ennore to Hyderabad, with average transit of 2-4 days, (3) Pipeline transport (8% of volume): 800+ km of dedicated LPG pipelines including IOC Vadodara-Rajkot (280 km), IOC Koyali-Saliana (293 km), BPCL Mumbai-Pune (200 km), and HPCL Mangalore-Hassan (140 km), with 24/7 SCADA monitoring, automated block valve stations, and hourly pigging operations, (4) Coastal shipping and multi-modal (5% of volume): LPG ISO tank containers via ports at Kandla, Ennore, and Paradip for island territories (Andaman, Lakshadweep). Last-mile delivery is managed through: (a) Dealer-owned delivery trucks (3-wheelers with 12-15 cylinder capacity), (b) Home delivery services (double delivery model: deliver filled cylinder + collect empty), (c) Mobile LPG dispensing vans for rural areas, and (d) Digital booking via OMC apps (Indane/myHP, BharatGas, MyLPG). Average delivery time from bottling plant to end consumer: urban 2-3 days, semi-urban 4-7 days, rural 7-14 days. Key logistics challenges: (a) North-South imbalance (surplus in Gujarat/South, deficit in UP/Bihar/Northeast), (b) Monsoon disruptions to road transport (June-September), (c) Rural delivery cost averaging \u20b980-120 per cylinder vs urban \u20b930-50, and (d) Peak demand surges during festival season (Oct-Nov) requiring 30% buffer stock build-up.",
  },
  {
    t: "Auto LPG and Future Fuels: Electric LPG, Bio-LPG, and Decarbonization Path",
    c: "India\u2019s Auto LPG sector has 500+ dispensing stations across 200+ cities, serving 8 lakh+ vehicles (primarily 3-wheelers, autorickshaws, and fleet taxis). Auto LPG offers 40-50% cost savings vs petrol, with retail prices averaging \u20b965-70 per litre (vs \u20b9100-110 petrol). Key Auto LPG operators: (1) Indian Oil (AutoGas): 180+ stations, (2) HPCL (HP AutoGas): 150+ stations, (3) BPCL (SpeedGas): 120+ stations, (4) Private players (SuperGas, Aegis, Clean Energy): 50+ stations. India\u2019s Auto LPG consumption is approximately 2.5 lakh tonnes per year (growing 12% CAGR), driven by: (a) Delhi NCR auto LPG mandate for commercial vehicles, (b) State government incentives for clean fuel vehicles, (c) Lower emissions: 15% CO2, 80% NOx, 90% PM2.5 reduction vs petrol. Emerging LPG innovations in India: (1) Electric LPG delivery carts (IOCL pilot in Delhi, battery-powered 3-wheelers for last-mile delivery reducing emissions by 60%), (2) Composite cylinders (lighter by 50%, rust-proof, translucent for level checking \u2014 Everest Kevlar composite replacing steel in new allocations), (3) IoT-enabled smart regulators (leak detection, auto shut-off, usage monitoring \u2014 IOCL pilot with 50,000 units), (4) Bio-LPG (renewable LPG from waste-to-energy, pilot at IOC R&D center), (5) Drone-based pipeline inspection for LPG pipeline integrity (HPCL pilot on Mangalore-Hassan pipeline), and (6) Hydrogen-blended LPG (IOC R&D pilot: 5% hydrogen blend in LPG for reduced carbon intensity). India\u2019s LPG decarbonization targets: (a) Increase composite cylinder share from 15% to 40% by 2030, (b) 100% GPS tracking of all LPG transport vehicles by 2025, (c) Zero manual handling at bottling plants (automation target: 80% by 2028), and (d) Reduce LPG distribution carbon footprint by 30% by 2030.",
  },
];

export default function LpgDistributionLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: DELIVERY_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.consignment.toLowerCase().includes(q) && !r.depot.toLowerCase().includes(q) && !r.item.toLowerCase().includes(q) && !r.dealer.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof DeliveryRecord] as string));
  });

  return (
    <div className="lpg-root p-6 space-y-6">
      <PageHeader title="LPG Distribution Logistics" description="India LPG cylinder distribution network covering 12 crore households, OMC bottling plants, bullet truck transport, pipeline supply, auto LPG dispensing stations, cylinder re-certification, and PESO safety compliance across 2.8 lakh distributors" />
      <div className="lpg-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`lpg-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-orange-700 text-white" : "text-gray-600 hover:bg-orange-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="lpg-dash space-y-6">
          <div className="lpg-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="lpg-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 lpg-kpi-label">{k.l}</div><div className="text-2xl font-bold text-orange-700 lpg-kpi-val">{k.v}</div><div className="text-xs text-gray-400 lpg-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="lpg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly LPG Deliveries (Cylinders)</h3><BarChart data={monthlyDeliveries} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="domestic" fill="#ea580c" radius={[4,4,0,0]} name="Domestic 14.2kg" /><Bar dataKey="commercial" fill="#f97316" radius={[4,4,0,0]} name="Commercial 19kg" /><Bar dataKey="autolpg" fill="#fb923c" radius={[4,4,0,0]} name="Auto LPG" /><Bar dataKey="bulk" fill="#fdba74" radius={[4,4,0,0]} name="Industrial Bulk" /></BarChart></div>
            <div className="lpg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">LPG Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="lpg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Safety Compliance Rate (%) vs 98% Target</h3><LineChart data={safetyTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[96, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#ea580c" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="lpg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Depot Performance Score</h3><BarChart data={depotPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[80, 100]} /><Tooltip /><Bar dataKey="v" fill="#f97316" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="lpg-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "LPG Distribution", href: "#" }, { label: "Delivery Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="lpg-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Consignment,Depot,Zone,Category,Item,Qty,Unit,Dealer,Mode,Dispatch,Delivery,Transit (d),Value (\u20b9L),Safety,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Safety Hold" ? "lpg-row-critical bg-red-50" : r.status === "Under Verification" || r.status === "Rescheduled" ? "lpg-row-warning bg-amber-50" : r.status === "In Transit" ? "lpg-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-orange-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="lpg-badge inline-block px-2 py-0.5 rounded text-xs bg-orange-700 text-white font-mono">{r.consignment}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.depot}</td>
                <td className="px-3 py-2"><span className="lpg-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="lpg-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.item}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.quantity.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{r.unit}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.dealer}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.deliveryDate || <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 2 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-orange-700">{r.cylindersValueLakhs}</td>
                <td className="px-3 py-2 text-center">{r.safetyFlag ? <span className="lpg-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">SAFETY</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`lpg-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="lpg-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="lpg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Delivery Volume by Zone</h3><BarChart data={ZONES.slice(0,6).map(z => ({ n: z.split(" ")[0], v: +ri(18, 55, 35 + Math.random() * 15).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#ea580c" radius={[4,4,0,0]} name="Consignments" /></BarChart></div>
            <div className="lpg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Distribution by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], domestic: ri(400, 750, 550 + Math.sin(i*0.5)*80), commercial: ri(120, 280, 190 + Math.cos(i*0.6)*40), autolpg: ri(60, 160, 100 + Math.sin(i*0.7)*25) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="domestic" stackId="1" stroke="#ea580c" fill="#ffedd5" name="Domestic" /><Area type="monotone" dataKey="commercial" stackId="1" stroke="#f97316" fill="#fed7aa" name="Commercial" /><Area type="monotone" dataKey="autolpg" stackId="1" stroke="#fb923c" fill="#fff7ed" name="Auto LPG" /></AreaChart></div>
          </div>
          <div className="lpg-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Transport Mode</h3><BarChart data={[{n:"Bullet Truck",v:1.5},{n:"Tanker Lorry",v:1.2},{n:"Rail Wagon",v:3},{n:"Pipeline",v:0.2},{n:"Cascade",v:0.8},{n:"Flatbed",v:1.8}].map(d => ({...d, v: +ri(d.v-0.2, d.v+0.4, d.v + Math.random()*0.2).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#f97316" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="lpg-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="lpg-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-orange-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
