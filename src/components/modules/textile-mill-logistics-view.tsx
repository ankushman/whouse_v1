"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#6d28d9", "#5b21b6", "#ddd6fe", "#ede9fe"];
const MILLS = ["Arvind Mills Ahmedabad", "Raymond Thane", "Welspun Anjar", "Trident Barnala", "Alok Industries Vapi", "Vardhman Ludhiana", "Gokaldas Exports Bengaluru", "KPR Mill Coimbatore"];
const CATEGORIES = ["Cotton Yarn", "Polyester Fabric", "Denim", "Technical Textiles", "Home Furnishing", "Apparel Garments", "Silk / Handloom", "Synthetic Blend"];
const CONSIGNMENT_STATUSES = ["Dispatched", "In Transit", "Received at Mill", "Under Processing", "Quality Inspection", "Shipped to Buyer"];
const CORRIDORS = ["Gujarat Cotton Belt", "Tamil Nadu Textile Hub", "Punjab Wool Zone", "Rajasthan Handloom", "Maharashtra Power Loom", "UP Varanasi Silk"];
const MODES = ["Container Truck 20ft", "Open Truck 10T", "Rail Freight Box", "Shared Container", "Express Courier", "Multimodal"];
const TABS = ["Dashboard", "Consignment Registry", "Textile Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Dispatched": "blue", "In Transit": "blue", "Received at Mill": "green", "Under Processing": "amber", "Quality Inspection": "amber", "Shipped to Buyer": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyShipments = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], cotton: ri(400, 750, 550 + Math.sin(i * 0.5) * 100), polyester: ri(250, 500, 360 + Math.cos(i * 0.6) * 60), denim: ri(150, 320, 220 + Math.sin(i * 0.7) * 40), technical: ri(60, 140, 95 + Math.cos(i * 0.8) * 20) }));
const categoryDist = [{ n: "Cotton Yarn", v: 30 }, { n: "Polyester Fabric", v: 22 }, { n: "Denim", v: 14 }, { n: "Apparel Garments", v: 12 }, { n: "Home Furnishing", v: 10 }, { n: "Technical Textiles", v: 6 }, { n: "Silk / Handloom", v: 4 }, { n: "Synthetic Blend", v: 2 }];
const qualityTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(92, 99, 96 + Math.sin(i * 0.4) * 2)).toFixed(1), target: 95.0 }));
const millPerf = MILLS.slice(0, 6).map(m => ({ n: m.split(" ").slice(0, 2).join(" "), v: +ri(82, 98, 90 + Math.random() * 5).toFixed(0) }));

interface ConsignmentRecord { id: string; poNumber: string; mill: string; corridor: string; category: string; item: string; weight: number; unit: string; buyer: string; origin: string; destination: string; mode: string; shipDate: string; etaDate: string; transitDays: number; valueLakhs: number; priorityFlag: boolean; status: string; remarks: string; }

const records: ConsignmentRecord[] = [
  { id: "TXL-0001", poNumber: "PO-ARV/2025/4521", mill: "Arvind Mills Ahmedabad", corridor: "Gujarat Cotton Belt", category: "Cotton Yarn", item: "Combed Cotton Yarn 40s Ne 500kg Bales", weight: 12000, unit: "kg", buyer: "Zara India Supply Chain", origin: "Arvind Naroda Plant", destination: "Zara Mumbai DC", mode: "Container Truck 20ft", shipDate: "2025-07-10", etaDate: "", transitDays: 2, valueLakhs: 48, priorityFlag: true, status: "In Transit", remarks: "Premium combed cotton yarn for Zara FW25 collection" },
  { id: "TXL-0002", poNumber: "PO-RAY/2025/3345", mill: "Raymond Thane", corridor: "Maharashtra Power Loom", category: "Apparel Garments", item: "Wool Blend Suit Fabric 120m Rolls", weight: 4500, unit: "kg", buyer: "Reliance Trends Mumbai", origin: "Raymond Thane Mill", destination: "Reliance Trends Hub", mode: "Container Truck 20ft", shipDate: "2025-07-08", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 72, priorityFlag: true, status: "Shipped to Buyer", remarks: "Premium wool blend suiting fabric for Raymond retail" },
  { id: "TXL-0003", poNumber: "PO-WEL/2025/9087", mill: "Welspun Anjar", corridor: "Gujarat Cotton Belt", category: "Home Furnishing", item: "300TC Bed Sheet Set King Size", weight: 8000, unit: "kg", buyer: "IKEA India Hyderabad", origin: "Welspun Anjar Factory", destination: "IKEA Hyderabad DC", mode: "Rail Freight Box", shipDate: "2025-07-11", etaDate: "", transitDays: 4, valueLakhs: 36, priorityFlag: false, status: "In Transit", remarks: "300 thread count cotton bed sheet sets for IKEA India" },
  { id: "TXL-0004", poNumber: "PO-TRI/2025/3456", mill: "Trident Barnala", corridor: "Punjab Wool Zone", category: "Home Furnishing", item: "Egyptian Cotton Bath Towel Lot-A", weight: 6200, unit: "kg", buyer: "Target USA (via Trident Export)", origin: "Trident Barnala Plant", destination: "Nhava Sheva Port Mumbai", mode: "Container Truck 20ft", shipDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 2, valueLakhs: 28, priorityFlag: true, status: "Received at Mill", remarks: "Export quality terry towels for Target USA FOB Mumbai" },
  { id: "TXL-0005", poNumber: "PO-ALO/2025/6789", mill: "Alok Industries Vapi", corridor: "Maharashtra Power Loom", category: "Polyester Fabric", item: "Polyester Viscose PV Fabric 60/40 Blend", weight: 15000, unit: "kg", buyer: "Max Fashion India", origin: "Alok Vapi Unit-2", destination: "Max Fashion Noida DC", mode: "Open Truck 10T", shipDate: "2025-07-07", etaDate: "2025-07-09", transitDays: 3, valueLakhs: 22, priorityFlag: false, status: "Under Processing", remarks: "PV blend fabric processing - dyeing and finishing in progress" },
  { id: "TXL-0006", poNumber: "PO-VAR/2025/1234", mill: "Vardhman Ludhiana", corridor: "Punjab Wool Zone", category: "Cotton Yarn", item: "Open End Yarn 30s Ne for Knitting", weight: 9000, unit: "kg", buyer: "Decathlon India Bangalore", origin: "Vardhman Ludhiana Spinning", destination: "Decathlon Bangalore Plant", mode: "Rail Freight Box", shipDate: "2025-07-12", etaDate: "", transitDays: 3, valueLakhs: 18, priorityFlag: false, status: "Dispatched", remarks: "Open end carded yarn for Decathlon sportswear knitting" },
  { id: "TXL-0007", poNumber: "PO-GOK/2025/5678", mill: "Gokaldas Exports Bengaluru", corridor: "Tamil Nadu Textile Hub", category: "Apparel Garments", item: "Men Polo T-Shirt 100% Cotton Batch", weight: 3500, unit: "kg", buyer: "H&M India Supply", origin: "Gokaldas Bengaluru Unit-3", destination: "H&M DC NCR", mode: "Express Courier", shipDate: "2025-07-06", etaDate: "2025-07-07", transitDays: 1, valueLakhs: 25, priorityFlag: true, status: "Quality Inspection", remarks: "H&M polo batch - AQL 2.5 inspection in progress at Gokaldas QC lab" },
  { id: "TXL-0008", poNumber: "PO-KPR/2025/8901", mill: "KPR Mill Coimbatore", corridor: "Tamil Nadu Textile Hub", category: "Denim", item: "Stretch Denim 12oz Indigo Wash Lot-C", weight: 11000, unit: "kg", buyer: "Levi's India Sourcing", origin: "KPR Coimbatore Denim Unit", destination: "Levi's Bangalore Processing", mode: "Container Truck 20ft", shipDate: "2025-07-05", etaDate: "", transitDays: 1, valueLakhs: 42, priorityFlag: true, status: "Quality Inspection", remarks: "Stretch denim 98/2 cotton/elastane - wash test and shade match QC pending" },
  { id: "TXL-0009", poNumber: "PO-ARV/2025/2345", mill: "Arvind Mills Ahmedabad", corridor: "Gujarat Cotton Belt", category: "Denim", item: "Raw Denim 14oz Selvedge 60m Rolls", weight: 7500, unit: "kg", buyer: "Uniqlo India Delhi", origin: "Arvind Denim Plant Ahmedabad", destination: "Uniqlo Noida Distribution", mode: "Container Truck 20ft", shipDate: "2025-07-11", etaDate: "", transitDays: 2, valueLakhs: 52, priorityFlag: true, status: "In Transit", remarks: "Selvedge raw denim for Uniqlo premium denim line AW25" },
  { id: "TXL-0010", poNumber: "PO-RAY/2025/4567", mill: "Raymond Thane", corridor: "Maharashtra Power Loom", category: "Technical Textiles", item: "Fire Retardant Fabric NOMEX Blend Roll", weight: 2800, unit: "kg", buyer: "Indian Railways IRFC", origin: "Raymond Thane Technical Unit", destination: "IRF Kolkata Workshop", mode: "Rail Freight Box", shipDate: "2025-07-10", etaDate: "2025-07-12", transitDays: 3, valueLakhs: 38, priorityFlag: true, status: "In Transit", remarks: "Fire retardant fabric for Indian Railways AC coach upholstery refurbishment" },
  { id: "TXL-0011", poNumber: "PO-WEL/2025/7890", mill: "Welspun Anjar", corridor: "Gujarat Cotton Belt", category: "Home Furnishing", item: "Bath Rug 500gsm Cotton Chenille Lot-B", weight: 5500, unit: "kg", buyer: "Walmart USA (via Welspun Export)", origin: "Welspun Anjar Factory", destination: "Mundra Port Gujarat", mode: "Container Truck 20ft", shipDate: "2025-07-09", etaDate: "2025-07-09", transitDays: 1, valueLakhs: 16, priorityFlag: false, status: "Shipped to Buyer", remarks: "Chenille bath rugs for Walmart USA export FOB Mundra" },
  { id: "TXL-0012", poNumber: "PO-TRI/2025/1122", mill: "Trident Barnala", corridor: "Punjab Wool Zone", category: "Silk / Handloom", item: "Pashmina Wool Shawl Handwoven Lot-A", weight: 800, unit: "kg", buyer: "Fabindia India HQ", origin: "Trident Handloom Cluster Amritsar", destination: "Fabindia Delhi Processing", mode: "Express Courier", shipDate: "2025-07-12", etaDate: "", transitDays: 1, valueLakhs: 56, priorityFlag: true, status: "Dispatched", remarks: "Handwoven Pashmina shawls from Amritsar cooperative weavers" },
  { id: "TXL-0013", poNumber: "PO-ALO/2025/3344", mill: "Alok Industries Vapi", corridor: "Maharashtra Power Loom", category: "Synthetic Blend", item: "Recycled Polyester Fabric rPET Blend", weight: 9500, unit: "kg", buyer: "Pantaloons India", origin: "Alok Vapi Recycling Unit", destination: "Pantaloons Mumbai DC", mode: "Open Truck 10T", shipDate: "2025-07-08", etaDate: "", transitDays: 1, valueLakhs: 14, priorityFlag: false, status: "Received at Mill", remarks: "rPET recycled polyester from PET bottle waste for sustainable fashion line" },
  { id: "TXL-0014", poNumber: "PO-VAR/2025/9012", mill: "Vardhman Ludhiana", corridor: "Punjab Wool Zone", category: "Cotton Yarn", item: "Merino Wool Yarn 2/60s Nm for Hosiery", weight: 4200, unit: "kg", buyer: "Jockey India Sourcing", origin: "Vardhman Ludhiana Worsted Unit", destination: "Jockey Kolkata Plant", mode: "Rail Freight Box", shipDate: "2025-07-07", etaDate: "2025-07-10", transitDays: 3, valueLakhs: 32, priorityFlag: false, status: "Under Processing", remarks: "Merino wool yarn for Jockey innerwear hosiery production" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Dispatched").length;
const processCount = records.filter(r => r.status === "Under Processing" || r.status === "Quality Inspection").length;
const shippedCount = records.filter(r => r.status === "Shipped to Buyer" || r.status === "Received at Mill").length;
const totalValue = records.reduce((s, r) => s + r.valueLakhs, 0);

const kpis = [
  { l: "In Transit / Dispatched", v: transitCount, s: "active consignments" },
  { l: "Processing / QC", v: processCount, s: "in production" },
  { l: "Shipped / Received", v: shippedCount, s: "completed" },
  { l: "Total Order Value", v: `\u20b9${totalValue}L`, s: "across all corridors" },
];

const INSIGHTS = [
  {
    t: "India Textile Industry: \u20b922 Lakh Crore Sector, 4.5 Crore Workers, World\u2019s 2nd Largest Textile Producer",
    c: "India is the world\u2019s second-largest textile and garment producer (after China), with a domestic market of \u20b922 lakh crore (USD 250 billion, 2024-25) and textile/garment exports of \u20b93.5 lakh crore (USD 42 billion). India\u2019s textile sector employs 4.5 crore workers (35 million in organized sector + 10 million in handloom/powerloom), making it the second-largest employer after agriculture. Key textile clusters: (1) Gujarat (Arvind, Welspun, Raymond \u2014 cotton, denim, home textiles), (2) Tamil Nadu (KPR Mill, Nandan Denim, Vardhman \u2014 cotton yarn, knitwear, denim), (3) Punjab (Vardhman, Trident, Oswal \u2014 wool, yarn, terry towels), (4) Maharashtra (Alok Industries, Vodafone/Raymond, Siyaram\u2019s \u2014 powerloom, polyester, suiting), (5) Rajasthan (Jaipur print, Jodhpur tie-dye, Bhilwara processed fabric), (6) Uttar Pradesh (Varanasi silk, Bhadohi carpets, Kanpur leather-textile), (7) Karnataka (Gokaldas Exports, Shahi Exports \u2014 readymade garments), and (8) West Bengal (Sericulture, jute textiles). India\u2019s textile supply chain covers: (a) Raw materials (cotton: 340 lakh bales/170 lakh bales exported, man-made fibers: 60 lakh MT, silk: 35,000 MT, jute: 80 lakh bales), (b) Spinning (4,500+ spinning mills, 55 crore spindles, 8 lakh rotors), (c) Weaving (2,500+ weaving mills + 6 lakh powerlooms + 28 lakh handlooms), (d) Processing (2,000+ dyeing/printing units, but only 40% with ZLD compliance), (e) Garmenting (15,000+ garment manufacturing units), and (f) Distribution (domestic retail: \u20b912 lakh crore, export: \u20b93.5 lakh crore). India\u2019s textile logistics value is approximately \u20b92.5 lakh crore annually (raw material transport: \u20b980,000 crore, inter-fabric movement: \u20b960,000 crore, finished goods distribution: \u20b91,10,000 crore, export logistics: \u20b91,00,000 crore). The Government of India\u2019s National Technical Textiles Mission targets \u20b940,000 crore technical textiles production by 2027.",
  },
  {
    t: "Textile Raw Materials and Fibre Logistics: Cotton, Polyester, Silk, and Technical Textiles",
    c: "India\u2019s textile raw material logistics involves: (1) Cotton: India\u2019s cotton belt spans Gujarat, Maharashtra, MP, Telangana, Karnataka, Rajasthan, and AP, producing 340 lakh bales (170 kg each) annually. Cotton logistics: farm-ginning (25,000+ ginneries, 60% marketable surplus), ginning-to-spinning (truck/container transport, average 200-500 km), and spinning-to-weaving (inter-mill yarn transport). Cotton pricing: Shankar-6 (Gujarat) benchmark at \u20b956,000-62,000 per candy (356 kg), with logistics cost adding 8-12% to final yarn price. Cotton storage: 850+ CCI (Cotton Corporation of India) procurement centers with covered godowns storing 80 lakh bales. (2) Man-made fibers (MMF): India produces 60 lakh MT annually (Reliance Industries: 40 lakh MT polyester fiber/filament, Vardhman: 8 lakh MT acrylic, Grasim: 4 lakh MT viscose). MMF logistics: pipeline transport from Reliance Jamnagar to Surat/Baroda (dedicated fiber slurry pipelines), containerized bale transport, and inter-factory filament movement. (3) Silk: India\u2019s silk production (35,000 MT, 70% mulberry) is centered in Karnataka (Mysore, Ramanagaram), Tamil Nadu, and West Bengal (Murshidabad). Silk logistics: cocoon transport (cold chain at 18-22\u00b0C), reeling units (3,000+), and fabric movement to Varanasi (Banarasi silk) and Kanchipuram (sarees). (4) Technical textiles: India\u2019s technical textiles market (\u20b91.6 lakh crore) covers: geotextiles, agrotech, medtech, buildtech, mobiletech (automotive), protech (defense), indutech, and smart textiles. Key logistics challenges: (a) Moisture sensitivity (cotton bales must be protected from rain, 5% moisture max), (b) Flame retardant storage for polyester (auto-ignition risk at high temperature), (c) Cold chain for silk (temperature fluctuations degrade luster), (d) Dust-free transport for dyed fabrics (dust particles cause shade variation in quality inspection), and (e) Hazmat compliance for dye chemicals (Azo dyes, formaldehyde-based resins requiring MSDS documentation). India\u2019s cotton logistics improvement: CCI e-Uparjan app for digital procurement, cotton bale RFID tracking pilot (Kapas to Kandla port), and railway cotton special freight tariff (20% concession on containerized cotton movement).",
  },
  {
    t: "Textile Processing and Quality Control: Dyeing, Printing, Finishing, and Compliance Standards",
    c: "India\u2019s textile processing chain: (1) Spinning: converting ginned cotton into yarn (ring spinning: 80%, rotor spinning: 15%, air-jet: 5%), with key parameters: yarn count (Ne 10s to 120s), twist per inch (TPI), evenness (U%), and strength (CSP). (2) Weaving: shuttleless looms (rapier, projectile, air-jet) at 1,800+ composite mills, 6 lakh powerlooms (mostly in Surat, Bhilwara, Tirupur), and 28 lakh handlooms (Varanasi, Kanchipuram, Pochampally Ikat). (3) Processing: (a) Desizing, scouring, bleaching (pre-treatment, 4-6 hour cycle), (b) Dyeing (reactive dyeing for cotton: 60-90 min at 60\u00b0C, disperse dyeing for polyester: 30-45 min at 130\u00b0C in HT machine), (c) Printing (rotary screen printing: 80% of printed fabric, flat bed: 15%, digital: 5% growing), (d) Finishing (calendering, sanforizing for shrinkage control, softener application, anti-microbial finish for medical textiles). Processing logistics challenges: (a) Water consumption: 50-150 liters per kg of fabric processed, with India\u2019s textile processing consuming 500 billion liters annually, (b) Effluent treatment: only 40% of 2,000+ processing units have ZLD (Zero Liquid Discharge) systems mandated by CPCB, (c) Chemical logistics: handling of dye chemicals (sodium hydrosulfite, caustic soda, hydrogen peroxide, disperse/reactive dyes) requiring hazmat transport and MSDS compliance, and (d) Turnaround time: fashion industry demands 30-45 day order-to-ship, requiring rapid inter-process logistics. Quality control standards: (1) AQL (Acceptable Quality Level): 2.5 for garments, 4.0 for fabrics, with 4-point inspection system (ASTM D5430), (2) Color fastness: ISO 105 (wash, light, rubbing, perspiration), (3) Dimensional stability: ISO 6330 (shrinkage less than 3% after 5 washes), (4) Fabric GSM: +/- 5% tolerance from specification, (5) Count per inch (CPI/WPI): +/- 2% tolerance, and (6) Restricted substance list (RSL) compliance: Oeko-Tex Standard 100, REACH (EU), CPSIA (US) for chemical testing. India\u2019s textile testing infrastructure: 50+ NABL-accredited labs (SITRA Coimbatore, MANTRA Surat, BTRA Mumbai, NIFT testing labs) providing 2-5 day turnaround for test results.",
  },
  {
    t: "Textile Export Logistics and Government Schemes: RoDTEP, PLI, and Textile Parks",
    c: "India\u2019s textile export logistics (\u20b93.5 lakh crore, 2024-25) serves buyers in: (1) USA (\u20b980,000 crore, cotton garments, home textiles), (2) EU (\u20b960,000 crore, technical textiles, silk), (3) UAE (\u20b930,000 crore, re-export hub for Africa), (4) Bangladesh (\u20b920,000 crore, cotton yarn for RMG), (5) UK (\u20b915,000 crore, premium garments), and (6) Southeast Asia (\u20b912,000 crore, fabrics and yarn). Export logistics: (a) FOB (Free on Board) shipments via 12 major ports (Mundra, Nhava Sheva, Chennai, Tuticorin, Kandla), (b) Containerized transport: 40% of textile exports via containers (20ft and 40ft), (c) Air cargo for high-value garments: 15% by value (Bengaluru, Delhi, Mumbai airports), (d) Documentation: Bill of Lading, Certificate of Origin (for preferential duty under FTA), Phytosanitary certificate for natural fiber products, and Export Inspection Agency (EIA) certification. Government of India textile promotion schemes: (1) PLI scheme for textiles (\u20b910,900 crore, 2021-2026): incentive of 3-5% on incremental turnover for MMF garments, technical textiles, and man-made fiber segment, (2) RoDTEP (Remission of Duties and Taxes on Exported Products): 0.5-2.5% duty credit for textile exporters, (3) PM MITRA (Mega Integrated Textile Region and Apparel) Parks: 7 textile parks (Tamil Nadu, Gujarat, UP, Karnataka, MP, Maharashtra, Telangana) with plug-and-play infrastructure, integrated logistics hub, and effluent treatment plants, (4) SAMARTH (Scheme for Capacity Building in Textile Sector): skilling 12 lakh workers by 2026, (5) Technology Upgradation Fund Scheme (TUFS): 12% capital subsidy for modern machinery (air-jet looms, automatic dyeing machines, RFID-enabled inventory systems). Key logistics improvements: (1) Textile-specific freight corridors (Dedicated Freight Corridor Western route connecting Gujarat textile belt to Nhava Sheva port, reducing transit from 5 days to 2 days), (2) Container freight stations (CFS) near textile clusters: 45 CFS in Gujarat, 30 in Tamil Nadu, 25 in Punjab, (3) Integrated cold chain for home textiles (Welspun, Trident have dedicated temperature-controlled warehousing at ports), and (4) Digital export documentation (ICEGATE, Indian Customs EDI system, reducing documentation time from 3 days to 6 hours). India\u2019s textile logistics sector needs: (a) Road infrastructure improvement in textile clusters (40% of textile freight moves on single-lane roads), (b) Multi-modal logistics parks near textile hubs (planned: 8 textile MMLPs), (c) Green logistics adoption (electric trucks for mill-to-port movement, solar-powered dyeing units), and (d) Blockchain-based traceability from farm to retail (pilot by Welspun with Walmart for organic cotton traceability).",
  },
];

export default function TextileMillLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: CONSIGNMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "corridor", label: "Corridor", options: CORRIDORS.map(c => ({ value: c, count: records.filter(rec => rec.corridor === c).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.poNumber.toLowerCase().includes(q) && !r.mill.toLowerCase().includes(q) && !r.item.toLowerCase().includes(q) && !r.buyer.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ConsignmentRecord] as string));
  });

  return (
    <div className="txl-root p-6 space-y-6">
      <PageHeader title="Textile Mill Logistics" description="India textile and garment supply chain covering cotton yarn, polyester fabric, denim, technical textiles, home furnishing, and apparel logistics across 4,500 spinning mills, 6 lakh powerlooms, and 15,000+ garment units with export to 100+ countries" />
      <div className="txl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`txl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-violet-700 text-white" : "text-gray-600 hover:bg-violet-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="txl-dash space-y-6">
          <div className="txl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="txl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 txl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-violet-700 txl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 txl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="txl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Textile Shipments (Tonnes)</h3><BarChart data={monthlyShipments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="cotton" fill="#7c3aed" radius={[4,4,0,0]} name="Cotton" /><Bar dataKey="polyester" fill="#8b5cf6" radius={[4,4,0,0]} name="Polyester" /><Bar dataKey="denim" fill="#a78bfa" radius={[4,4,0,0]} name="Denim" /><Bar dataKey="technical" fill="#c4b5fd" radius={[4,4,0,0]} name="Technical" /></BarChart></div>
            <div className="txl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Textile Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="txl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Quality Pass Rate (%) vs 95% Target</h3><LineChart data={qualityTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[88, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#7c3aed" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="txl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Mill Performance Score</h3><BarChart data={millPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[80, 100]} /><Tooltip /><Bar dataKey="v" fill="#8b5cf6" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="txl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Textile Mill", href: "#" }, { label: "Consignment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="txl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,PO Number,Mill,Corridor,Category,Item,Weight (kg),Buyer,Mode,Ship Date,ETA,Transit (d),Value (\u20b9L),Priority,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Quality Inspection" ? "txl-row-critical bg-red-50" : r.status === "Under Processing" || r.status === "Dispatched" ? "txl-row-warning bg-amber-50" : r.status === "In Transit" ? "txl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-violet-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="txl-badge inline-block px-2 py-0.5 rounded text-xs bg-violet-700 text-white font-mono">{r.poNumber}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.mill}</td>
                <td className="px-3 py-2"><span className="txl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.corridor}</span></td>
                <td className="px-3 py-2"><span className="txl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.item}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.weight.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.buyer}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate || <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 3 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-violet-700">{r.valueLakhs}</td>
                <td className="px-3 py-2 text-center">{r.priorityFlag ? <span className="txl-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">PRIO</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`txl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="txl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="txl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Shipment Volume by Corridor</h3><BarChart data={CORRIDORS.map(c => ({ n: c.split(" ")[0], v: +ri(15, 45, 28 + Math.random() * 12).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#7c3aed" radius={[4,4,0,0]} name="Consignments" /></BarChart></div>
            <div className="txl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Shipments by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], cotton: ri(100, 200, 140 + Math.sin(i*0.5)*25), polyester: ri(60, 130, 90 + Math.cos(i*0.6)*18), denim: ri(30, 80, 55 + Math.sin(i*0.7)*12) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="cotton" stackId="1" stroke="#7c3aed" fill="#ede9fe" name="Cotton" /><Area type="monotone" dataKey="polyester" stackId="1" stroke="#8b5cf6" fill="#ddd6fe" name="Polyester" /><Area type="monotone" dataKey="denim" stackId="1" stroke="#a78bfa" fill="#f5f3ff" name="Denim" /></AreaChart></div>
          </div>
          <div className="txl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Transport Mode</h3><BarChart data={[{n:"Container 20ft",v:2},{n:"Open Truck",v:2.5},{n:"Rail Freight",v:3.5},{n:"Shared Container",v:3},{n:"Express Courier",v:1},{n:"Multimodal",v:5}].map(d => ({...d, v: +ri(d.v-0.3, d.v+0.5, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#8b5cf6" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="txl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="txl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-violet-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
