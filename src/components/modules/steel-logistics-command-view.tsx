"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#15803d", "#16a34a", "#22c55e", "#4ade80", "#166534", "#14532d", "#86efac", "#bbf7d0"];
const MILLS = ["Tata Jamshedpur", "JSW Vijayanagar", "SAIL Rourkela", "SAIL Bokaro", "JSPL Raipur", "AM/NS Hazira", "Essar Paradip", "SAIL Durgapur"];
const PRODUCTS = ["HR Coils", "CR Coils", "TMT Bars", "Wire Rod", "Plates", "Pipes & Tubes", "Hot Rolled Sheets", "Galvanized Steel"];
const ORDER_STATUSES = ["Dispatched", "In Transit", "Delivered to Dealer", "At Stock Yard", "Quality Hold", "Returned"];
const MODES = ["Rail Rake", "Flatbed Trailer", "Conveyor", "Ship / Coastal", "Multi-Axle Trailer", "E-Rickshaw Last Mile"];
const ZONES = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone", "NE Zone"];
const TABS = ["Dashboard", "Dispatch Registry", "Steel Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Dispatched": "blue", "In Transit": "blue", "Delivered to Dealer": "green", "At Stock Yard": "slate", "Quality Hold": "red", "Returned": "orange" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyProduction = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], hr: ri(4200, 7800, 5800 + Math.sin(i * 0.5) * 1200), cr: ri(2200, 4500, 3200 + Math.cos(i * 0.6) * 700), tmt: ri(1800, 3800, 2600 + Math.sin(i * 0.7) * 600), wire: ri(600, 1400, 950 + Math.cos(i * 0.8) * 250) }));
const productDist = [{ n: "HR Coils", v: 28 }, { n: "TMT Bars", v: 22 }, { n: "CR Coils", v: 18 }, { n: "Plates", v: 10 }, { n: "Wire Rod", v: 8 }, { n: "Pipes", v: 6 }, { n: "HR Sheets", v: 5 }, { n: "Galvanized", v: 3 }];
const utilizationTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(72, 96, 84 + Math.sin(i * 0.4) * 8)).toFixed(1), target: 85.0 }));
const millPerf = MILLS.slice(0, 6).map(m => ({ n: m.split(" ").pop() || m, v: +ri(75, 98, 86 + Math.random() * 8).toFixed(0) }));

interface DispatchRecord { id: string; orderNo: string; mill: string; product: string; grade: string; quantity: number; unit: string; customer: string; destination: string; zone: string; mode: string; dispatchDate: string; eta: string; deliveryDate: string; transitDays: number; vehicleNo: string; status: string; invoiceValue: number; damageFlag: boolean; remarks: string; }

const records: DispatchRecord[] = [
  { id: "STC-0001", orderNo: "ORD-TATA/2025-0452", mill: "Tata Jamshedpur", product: "HR Coils", grade: "IS 2062 E250", quantity: 1200, unit: "MT", customer: "L&T Hyderabad Metro", destination: "Hyderabad Metro Yard", zone: "South Zone", mode: "Rail Rake", dispatchDate: "2025-01-10", eta: "2025-01-12", deliveryDate: "", transitDays: 3, vehicleNo: "RKN/2025/3245", status: "In Transit", invoiceValue: 72000000, damageFlag: false, remarks: "HR coils metro structural steel - 14mm gauge" },
  { id: "STC-0002", orderNo: "ORD-JSW/2025-0388", mill: "JSW Vijayanagar", product: "CR Coils", grade: "IS 513 D Grade", quantity: 800, unit: "MT", customer: "Maruti Suzuki Manesar", destination: "Maruti Plant Gate", zone: "North Zone", mode: "Flatbed Trailer", dispatchDate: "2025-01-08", eta: "2025-01-10", deliveryDate: "2025-01-10", transitDays: 2, vehicleNo: "KA-05-TR-1234", status: "Delivered to Dealer", invoiceValue: 56000000, damageFlag: false, remarks: "Auto-grade CR coils for Maruti body panels" },
  { id: "STC-0003", orderNo: "ORD-SAIL/2025-0510", mill: "SAIL Rourkela", product: "TMT Bars", grade: "Fe 500D TMT", quantity: 450, unit: "MT", customer: "Shapoorji Mumbai Tower", destination: "Lower Parel Site", zone: "West Zone", mode: "Multi-Axle Trailer", dispatchDate: "2025-01-14", eta: "2025-01-15", deliveryDate: "", transitDays: 1, vehicleNo: "OD-08-MA-5678", status: "In Transit", invoiceValue: 22500000, damageFlag: false, remarks: "Fe 500D TMT 16mm/20mm construction bars" },
  { id: "STC-0004", orderNo: "ORD-JSW/2025-0478", mill: "JSW Vijayanagar", product: "Plates", grade: "SA 516 Gr 70", quantity: 600, unit: "MT", customer: "Larsen Toubro Hazira", destination: "L&T Yard Hazira", zone: "West Zone", mode: "Flatbed Trailer", dispatchDate: "2025-01-12", eta: "2025-01-13", deliveryDate: "2025-01-13", transitDays: 1, vehicleNo: "KA-03-FT-9012", status: "Delivered to Dealer", invoiceValue: 42000000, damageFlag: false, remarks: "Boiler quality plates for L&T fabrication" },
  { id: "STC-0005", orderNo: "ORD-JSPL/2025-0295", mill: "JSPL Raipur", product: "Wire Rod", grade: "SAE 1008", quantity: 350, unit: "MT", customer: "Godawari Power Raipur", destination: "Wire Plant Raipur", zone: "Central Zone", mode: "Multi-Axle Trailer", dispatchDate: "2025-01-13", eta: "2025-01-13", deliveryDate: "2025-01-13", transitDays: 0, vehicleNo: "CG-04-MA-3456", status: "Delivered to Dealer", invoiceValue: 21000000, damageFlag: false, remarks: "Wire rod for fastener manufacturing" },
  { id: "STC-0006", orderNo: "ORD-AMNS/2025-0534", mill: "AM/NS Hazira", product: "Pipes & Tubes", grade: "API 5L X65", quantity: 500, unit: "MT", customer: "GAIL Pipeline Project", destination: "GAIL Pipe Yard UP", zone: "North Zone", mode: "Rail Rake", dispatchDate: "2025-01-15", eta: "2025-01-17", deliveryDate: "", transitDays: 3, vehicleNo: "RKN/2025/3278", status: "Dispatched", invoiceValue: 42500000, damageFlag: false, remarks: "API 5L X65 ERW pipes for gas pipeline" },
  { id: "STC-0007", orderNo: "ORD-SAIL/2025-0412", mill: "SAIL Bokaro", product: "HR Coils", grade: "IS 2062 E350", quantity: 950, unit: "MT", customer: "IRCON Rail Bhuj", destination: "Bhuj Rail Yard", zone: "West Zone", mode: "Rail Rake", dispatchDate: "2025-01-11", eta: "2025-01-13", deliveryDate: "2025-01-12", transitDays: 2, vehicleNo: "RKN/2025/3256", status: "Delivered to Dealer", invoiceValue: 57000000, damageFlag: false, remarks: "E350 grade rail coach structural steel" },
  { id: "STC-0008", orderNo: "ORD-ESSAR/2025-0468", mill: "Essar Paradip", product: "Hot Rolled Sheets", grade: "IS 2062 E250BR", quantity: 700, unit: "MT", customer: "Voltas Mumbai", destination: "Voltas Chembur", zone: "West Zone", mode: "Ship / Coastal", dispatchDate: "2025-01-09", eta: "2025-01-12", deliveryDate: "", transitDays: 4, vehicleNo: "MV Paradip Express", status: "In Transit", invoiceValue: 38500000, damageFlag: false, remarks: "HR sheets coastal Paradip to Mumbai port" },
  { id: "STC-0009", orderNo: "ORD-TATA/2025-0556", mill: "Tata Jamshedpur", product: "Galvanized Steel", grade: "SGCC Z275", quantity: 280, unit: "MT", customer: "Haier Appliance Pune", destination: "Haier Factory Chakan", zone: "West Zone", mode: "Flatbed Trailer", dispatchDate: "2025-01-15", eta: "2025-01-16", deliveryDate: "", transitDays: 2, vehicleNo: "JH-14-FT-7890", status: "Dispatched", invoiceValue: 22400000, damageFlag: false, remarks: "Galvanized coils for appliance manufacturing" },
  { id: "STC-0010", orderNo: "ORD-SAIL/2025-0405", mill: "SAIL Durgapur", product: "TMT Bars", grade: "Fe 550D TMT", quantity: 380, unit: "MT", customer: "NBCC Kolkata Housing", destination: "New Town Site", zone: "East Zone", mode: "Multi-Axle Trailer", dispatchDate: "2025-01-14", eta: "2025-01-14", deliveryDate: "", transitDays: 0, vehicleNo: "WB-22-MA-2345", status: "At Stock Yard", invoiceValue: 19000000, damageFlag: false, remarks: "Fe 550D TMT at Durgapur stock yard awaiting pickup" },
  { id: "STC-0011", orderNo: "ORD-JSW/2025-0528", mill: "JSW Vijayanagar", product: "CR Coils", grade: "IF Grade Auto", quantity: 420, unit: "MT", customer: "Hyundai Chennai", destination: "HMIL Sriperumbudur", zone: "South Zone", mode: "Flatbed Trailer", dispatchDate: "2025-01-13", eta: "2025-01-14", deliveryDate: "", transitDays: 1, vehicleNo: "KA-01-FT-5678", status: "In Transit", invoiceValue: 33600000, damageFlag: false, remarks: "IF grade CR coils for Hyundai i20 panels" },
  { id: "STC-0012", orderNo: "ORD-JSPL/2025-0498", mill: "JSPL Raipur", product: "Plates", grade: "ASTM A573 Gr 70", quantity: 550, unit: "MT", customer: "NTPC Talcher", destination: "NTPC Township", zone: "East Zone", mode: "Rail Rake", dispatchDate: "2025-01-07", eta: "2025-01-08", deliveryDate: "2025-01-08", transitDays: 1, vehicleNo: "RKN/2025/3288", status: "Delivered to Dealer", invoiceValue: 38500000, damageFlag: false, remarks: "Pressure vessel plates NTPC boiler" },
  { id: "STC-0013", orderNo: "ORD-TATA/2025-0315", mill: "Tata Jamshedpur", product: "HR Coils", grade: "IS 2062 E250", quantity: 680, unit: "MT", customer: "DLF Gurugram", destination: "DLF Site 88", zone: "North Zone", mode: "Rail Rake", dispatchDate: "2025-01-12", eta: "2025-01-13", deliveryDate: "", transitDays: 2, vehicleNo: "RKN/2025/3268", status: "Quality Hold", invoiceValue: 40800000, damageFlag: true, remarks: "HR coils edge damage detected - quality inspection pending" },
  { id: "STC-0014", orderNo: "ORD-AMNS/2025-0550", mill: "AM/NS Hazira", product: "HR Coils", grade: "JIS G 3131 SPHC", quantity: 520, unit: "MT", customer: "Toyota Kirloskar BLR", destination: "TKM Bidadi Plant", zone: "South Zone", mode: "Flatbed Trailer", dispatchDate: "2025-01-14", eta: "2025-01-15", deliveryDate: "2025-01-15", transitDays: 1, vehicleNo: "GJ-06-FT-8901", status: "Delivered to Dealer", invoiceValue: 36400000, damageFlag: false, remarks: "SPHC coils for Toyota Fortuner chassis" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Dispatched").length;
const holdCount = records.filter(r => r.status === "Quality Hold" || r.status === "At Stock Yard").length;
const deliveredCount = records.filter(r => r.status === "Delivered to Dealer").length;
const totalInvoiceValue = records.reduce((s, r) => s + r.invoiceValue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

const kpis = [
  { l: "Dispatched / Transit", v: transitCount, s: "active consignments" },
  { l: "Hold / At Yard", v: holdCount, s: "pending action" },
  { l: "Delivered", v: deliveredCount, s: "completed orders" },
  { l: "Total Invoice Value", v: fmtVal(totalInvoiceValue), s: "across all orders" },
];

const INSIGHTS = [
  {
    t: "India Steel Industry: 120 MT Production and \u20b915 Lakh Crore Revenue",
    c: "India is the world\u2019s second-largest crude steel producer with installed capacity of approximately 180 million tonnes per annum (MTPA) and crude steel production of 120 MT in FY2024, generating industry revenue of approximately \u20b915 lakh crore (USD 18 billion). India\u2019s per capita steel consumption is 86 kg (world average: 225 kg), with the National Steel Policy targeting 300 kg per capita by 2030 and 160 MT production capacity. India\u2019s steel production is dominated by: (1) Tata Steel (21 MT, integrated plants at Jamshedpur 10 MT, Kalinganagar 8 MT, and Sahibabad 3 MT), (2) JSW Steel (28 MT, Vijayanagar 16 MT, Dolvi 5 MT, Salem 2 MT, and acquired Sajjan Jindal plants), (3) SAIL (19 MT, Rourkela 5 MT, Bokaro 5 MT, Bhilai 4 MT, Durgapur 2.5 MT, RSP 2.5 MT), (4) JSPL (8.5 MT, Raipur integrated plant), (5) AM/NS India (9 MT, Hazira integrated), and (6) Essar Steel (now AMNS, 10 MT, Paradip). India\u2019s steel demand growth is driven by: infrastructure (35% of demand), construction (30%), automotive (12%), capital goods (8%), railways (5%), and defense (3%). The Government of India\u2019s Production-Linked Incentive (PLI) scheme for specialty steel allocates \u20b96,322 crore for 5 years, targeting 25 MT of specialty steel production. India\u2019s steel logistics involves moving approximately 95 MT of finished steel annually via rail (45%), road (48%), and coastal shipping (7%), costing approximately \u20b918,000 crore in logistics expenditure (12-15% of steel industry revenue). The Ministry of Steel\u2019s Steel Scrap Recycling Policy targets 80 MT of scrap-based steel production by 2030, reducing dependence on imported coking coal (Australia, 85% of India\u2019s 75 MT coking coal imports valued at \u20b978,000 crore).",
  },
  {
    t: "Steel Distribution Network: Rail Rakes, Trucking, and Stock Yard Management",
    c: "India\u2019s finished steel distribution is a complex multi-modal logistics chain handling 95 MT annually through: (1) Rail rake dispatches from integrated steel plants to stock yards (45% of long-haul movement, 2,500-3,500 MT per rake, cost \u20b92,800-3,500 per MT for 500 km), (2) Flatbed and multi-axle trailer trucking from stock yards to dealer networks and construction sites (48% of deliveries, 30-40 MT per multi-axle trailer, cost \u20b93,500-5,500 per MT for 200 km), (3) Coastal shipping for port-based mills to coastal markets (7%, 5,000-15,000 MT per ship, cost \u20b92,200-3,000 per MT for 800 km), and (4) Last-mile e-rickshaw delivery for retail hardware stores (emerging mode in Tier 2/3 cities). Major steel stock yards include: Tata Steel (42 yards across India), JSW Steel (35 yards), SAIL (28 yards under SAIL Trading), and regional distributors (2,500+ authorized stockists). The steel logistics chain includes: (1) Mill despatch with quality test certificate (mill test certificate per EN 10204 3.1), (2) Rail rake movement via Indian Railways (dedicated steel rakes: 180+ per day), (3) Stock yard receiving and inventory management (ERP-based with FIFO and LIFO tracking), (4) Secondary distribution to dealers (stockist-to-retailer delivery within 24-48 hours), (5) Customer delivery with unloading crane and handling equipment, and (6) Returns management for quality claims (average claim rate: 1.5-2% of dispatches). Steel logistics challenges include: (1) Seasonal demand variation (Q3 July-September monsoons reducing construction activity by 20-25%), (2) Weight restrictions during monsoon on road transport (10-15% reduced axle loads), (3) Rail wagon availability (steel plants compete with coal, cement, and grain for wagons), and (4) Last-mile delivery in congested urban areas (average unloading time: 4-6 hours per truck in metro cities). Companies with integrated logistics report 35% lower delivery costs through own fleet management and 45% better delivery reliability versus third-party logistics.",
  },
  {
    t: "Steel Quality Standards: BIS, ASTM, and Mill Test Certification",
    c: "India\u2019s finished steel quality is governed by the Bureau of Indian Standards (BIS) under IS 2062 (general structural steel), IS 1786 (TMT bars), IS 513 (CR sheets/coils), IS 1079 (HR sheets/coils), IS 1161 (pipes), and IS 4923 (hollow sections). Export-quality steel follows international standards: ASTM A36/A573 (plates), ASTM A615 (rebar), JIS G 3131/3141 (HR/CR coils), EN 10025 (structural steel), and API 5L (line pipes). Every steel dispatch includes: (1) Mill Test Certificate (MTC) per EN 10204 Type 3.1 with chemical composition (C, Mn, Si, S, P, Cr, Ni, Cu), mechanical properties (yield strength, tensile strength, elongation, impact toughness), and heat number traceability, (2) BIS certification mark (ISI) mandatory for domestic construction steel, (3) Third-party inspection certificates for government project supplies (L&T, Indian Railways, NHAI, NTPC require independent inspection), and (4) Grade stamping/color coding on each bundle for identification. The quality hold rate in steel logistics is 1.5-2.0% of dispatches, with primary causes: (1) Edge damage during handling (35% of holds), (2) Surface rust from moisture exposure during transit (30%), (3) Dimensional non-conformity (20%), and (4) Wrong grade dispatched (5%). Quality resolution time averages 72-96 hours, involving: laboratory retesting (48 hours), mill investigation (24 hours), and replacement dispatch (48 hours). India\u2019s BIS has implemented the Steel Quality Control Order 2024 mandating BIS certification for 28 steel product categories, with penalties up to \u20b950 lakh for non-compliance. The Indian Steel Association (ISA) is developing a blockchain-based steel traceability platform covering 12 plants and 200+ dealers, enabling end-to-end heat number tracking from blast furnace to construction site. Companies with digital quality management systems report: 40% faster claim resolution, 30% reduction in quality holds, and 25% improvement in customer satisfaction scores.",
  },
  {
    t: "Steel E-commerce and Digital Distribution Platforms",
    c: "India\u2019s steel distribution is being transformed by B2B e-commerce platforms enabling digital procurement, real-time pricing, and logistics tracking for finished steel. Key platforms include: (1) SteelMint (daily price discovery, 500+ dealers, 28,000+ transactions/month), (2) TradeIndia Steel (connecting mills to 15,000+ buyers), (3) Tata nexarc (Tata Steel\u2019s digital marketplace for construction steel, offering real-time inventory and doorstep delivery), (4) JSW One (JSW\u2019s integrated platform for steel procurement with financing and logistics), and (5) Mysteel/SMX (Chinese platforms with India operations for import/export steel trading). The digital steel distribution ecosystem covers: (1) Online price discovery with grade-level pricing (updated daily), (2) Digital order placement with mill/seller confirmation, (3) Real-time order tracking from mill to customer delivery, (4) Online invoice management and GST compliance, (5) Digital quality certificate access (mill test certificates, BIS certificates), and (6) Supply chain financing through NBFC partnerships (inventory financing, bill discounting). India\u2019s steel e-commerce penetration has grown from 2% in FY2020 to 12% in FY2024, with a target of 25% by FY2027. Key metrics: (1) Average order size: 50-200 MT (versus 500-1,000 MT offline), (2) Delivery time improvement: 30% faster through optimized logistics, (3) Price transparency: 8-12% lower procurement costs through competitive bidding, (4) Working capital improvement: 20-25% reduction through faster payment cycles. Steel companies report that digital distribution channels deliver: 35% higher customer acquisition rates, 40% lower customer acquisition costs, 25% higher repeat purchase rates, and 15% better margins versus traditional dealer channels. The Government of India\u2019s Open Network for Digital Commerce (ONDC) is expanding to include steel and metal products, connecting mills, stockists, dealers, and end-users on a unified platform. India\u2019s steel B2B e-commerce market is valued at \u20b915,000 crore in FY2024 and projected to reach \u20b945,000 crore by FY2028.",
  },
];

export default function SteelLogisticsCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: ORDER_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "product", label: "Product", options: PRODUCTS.map(p => ({ value: p, count: records.filter(r => r.product === p).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(r => r.mode === m).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.orderNo.toLowerCase().includes(q) && !r.mill.toLowerCase().includes(q) && !r.customer.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof DispatchRecord] as string));
  });

  return (
    <div className="stl-root p-6 space-y-6">
      <PageHeader title="Steel Logistics Command" description="India finished steel dispatch logistics, rail rake and trucking fleet management, mill-to-dealer distribution network, quality test certification, TMT/HR/CR/wire rod tracking, and stock yard management for 120 MT/year steel industry" />
      <div className="stl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`stl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-green-800 text-white" : "text-gray-600 hover:bg-green-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="stl-dash space-y-6">
          <div className="stl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="stl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 stl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-green-800 stl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 stl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="stl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Steel Production (KT)</h3><BarChart data={monthlyProduction} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="hr" fill="#15803d" radius={[4,4,0,0]} name="HR Coils" /><Bar dataKey="cr" fill="#16a34a" radius={[4,4,0,0]} name="CR Coils" /><Bar dataKey="tmt" fill="#22c55e" radius={[4,4,0,0]} name="TMT Bars" /><Bar dataKey="wire" fill="#4ade80" radius={[4,4,0,0]} name="Wire Rod" /></BarChart></div>
            <div className="stl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Product Mix Distribution</h3><PieChart width={400} height={220}><Pie data={productDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{productDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="stl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Mill Capacity Utilization (%) vs 85% Target</h3><LineChart data={utilizationTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[65, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#15803d" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="stl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Mill Dispatch Performance Score</h3><BarChart data={millPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[70, 100]} /><Tooltip /><Bar dataKey="v" fill="#16a34a" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="stl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Steel Logistics", href: "#" }, { label: "Dispatch Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="stl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Order No,Mill,Product,Customer,Dest,Zone,Mode,Qty (MT),Dispatch,ETA,Transit (d),Status,Invoice,Damage,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Quality Hold" ? "stl-row-critical bg-red-50" : r.status === "At Stock Yard" ? "stl-row-warning bg-amber-50" : r.status === "In Transit" ? "stl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-green-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="stl-badge inline-block px-2 py-0.5 rounded text-xs bg-green-800 text-white font-mono">{r.orderNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.mill}</td>
                <td className="px-3 py-2"><span className="stl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.product}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.customer}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.destination}</td>
                <td className="px-3 py-2 text-xs">{r.zone}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.quantity.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 3 ? "text-red-600" : r.transitDays > 1 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2"><span className={`stl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-green-800">{fmtVal(r.invoiceValue)}</td>
                <td className="px-3 py-2 text-center">{r.damageFlag ? <span className="text-red-600 font-bold">DMG</span> : <span className="text-green-600">OK</span>}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="stl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="stl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dispatch Volume by Mill</h3><BarChart data={MILLS.slice(0,6).map(m => ({ n: m.split(" ").pop() || m, v: +ri(120, 380, 240 + Math.random() * 100).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#15803d" radius={[4,4,0,0]} name="Dispatches" /></BarChart></div>
            <div className="stl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dispatch by Zone Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], west: ri(280, 520, 380 + Math.sin(i*0.5)*70), south: ri(220, 420, 310 + Math.cos(i*0.6)*55), north: ri(180, 360, 260 + Math.sin(i*0.7)*45) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="west" stackId="1" stroke="#15803d" fill="#dcfce7" name="West" /><Area type="monotone" dataKey="south" stackId="1" stroke="#16a34a" fill="#bbf7d0" name="South" /><Area type="monotone" dataKey="north" stackId="1" stroke="#22c55e" fill="#f0fdf4" name="North" /></AreaChart></div>
          </div>
          <div className="stl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Transport Mode</h3><BarChart data={[{n:"Rail Rake",v:2.5},{n:"Flatbed",v:1.5},{n:"Multi-Axle",v:1},{n:"Ship Coastal",v:4},{n:"Conveyor",v:0.5},{n:"E-Rickshaw",v:0}].map(d => ({...d, v: +ri(d.v-0.3, d.v+0.5, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#16a34a" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="stl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="stl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-green-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
