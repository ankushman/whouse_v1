"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0c4a6e", "#075985", "#0369a1", "#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"];
const OPERATORS = ["Adani Ports APSEZ Mumbai", "DP World Mumbai Nhava Sheva", "JSW Infrastructure Jaigarh", "Chennai Port Trust Ennore", "V O Chidambaranar Tuticorin", "Visakhapatnam Port Trust", "Syama Prasad Mookerjee Kolkata", "Paradip Port Authority Odisha"];
const CATEGORIES = ["Jawaharlal Nehru Pt 5.0M TEU", "Mundra Port 3.5M TEU", "Chennai Container Terminal 1.5M TEU", "V O Chidambaranar 1.2M TEU", "Visakhapatnam BTC 0.8M TEU", "Kolkata Haldia Dock 0.6M TEU", "L&T Kattupalli 1.8M TEU", "Krishnapatnam Port 1.0M TEU"];
const SHIPMENT_STATUSES = ["Container Yard Stacking Active", "Crane Rail Gantry Unloading", "Customs Clearance Processing", "Reefer Plug-in Monitoring", "Gate-In Gate-Out Truck", "Vessel Berth Departure"];
const ZONES = ["JNPT Nhava Sheva Navi Mumbai", "Mundra Port Kutch Gujarat", "Chennai Ennore Kamarajar TN", "Tuticorin V O Chidambaranar TN", "Visakhapatnam Gangavaram AP", "Kolkata Haldia Diamond Harbour", "Paradip Dhamra Gopalpur Odisha", "Krishnapatnam Nellore AP"];
const MODES = ["Ship 8000TEU Post-Panamax", "Rail Container 80 wagons", "Trailer TIP 40T Container", "Barge Feeder 500TEU Coastal", "Reach Stacker RTG Crane", "Straddle Carrier 50T"];
const TABS = ["Dashboard", "Terminal Registry", "Container Analytics", "Insights"];

const statusColor: Record<string, string> = { "Container Yard Stacking Active": "blue", "Crane Rail Gantry Unloading": "orange", "Customs Clearance Processing": "blue", "Reefer Plug-in Monitoring": "blue", "Gate-In Gate-Out Truck": "blue", "Vessel Berth Departure": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyTeu = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], jnpt: +(420 + Math.sin(i * 0.5) * 80).toFixed(0), mundra: +(290 + Math.cos(i * 0.6) * 60).toFixed(0), chennai: +(125 + Math.sin(i * 0.4) * 30).toFixed(0), others: +(180 + Math.cos(i * 0.7) * 40).toFixed(0) }));
const cargoType = [{ n: "Manufactured Goods", v: 35 }, { n: "Machinery Equipment", v: 22 }, { n: "Chemicals Petrochem", v: 15 }, { n: "Agri Food Products", v: 12 }, { n: "Textiles Garments", v: 10 }, { n: "Ores Minerals", v: 6 }];
const dwellDays = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], export_box: +(4.2 + Math.sin(i * 0.5) * 1.5).toFixed(1), import_box: +(6.8 + Math.cos(i * 0.4) * 2.0).toFixed(1), reefer: +(2.1 + Math.sin(i * 0.6) * 0.8).toFixed(1) }));
const portTeu = [
  { port: "JNPT", teu: 5200 },
  { port: "Mundra", teu: 3500 },
  { port: "Chennai", teu: 1500 },
  { port: "Kattupalli", teu: 1800 },
  { port: "VOC", teu: 1200 },
  { port: "Vizag", teu: 800 },
  { port: "Kolkata", teu: 600 },
  { port: "Krishnapatnam", teu: 1000 }
];

const INSIGHTS = [
  { t: "India\u2019s Container Port Traffic: 20M TEU Milestone and Sagarmala Vision", c: "India\u2019s major container ports handled over 20 million TEU (twenty-foot equivalent units) in FY2024-25, with JNPT (Nhava Sheva) contributing 5.2M TEU as the country\u2019s largest container gateway. The Sagarmala Programme launched by the Ministry of Ports, Shipping, and Waterways with an outlay of \u20b93.5 lakh crore aims to modernize India\u2019s port infrastructure, reduce logistics costs from 14% to 8% of GDP, and develop 2,000+ new port-led industrial clusters. Key projects include JNPT Fourth Container Terminal (4CT) expansion to 2.4M TEU capacity, Mundra Port Phase-IV expansion, and V O Chidambaranar Inner Harbour container terminal upgrading. India\u2019s container traffic has grown at a CAGR of 8.5% over the past decade, driven by merchandise export growth and increased manufacturing under Make in India initiatives." },
  { t: "JNPT Jawaharlal Nehru Port: India\u2019s Container Gateway Handling 5.2M TEU", c: "Jawaharlal Nehru Port Trust (JNPT) at Nhava Sheva, Navi Mumbai operates four container terminals (GTI, NSIGT, BMCT, 4CT) with a combined capacity exceeding 6.5M TEU. The port handles 50% of India\u2019s total containerized trade, connecting to over 180 shipping lines and 80+ direct calling ports globally. GTI (Gateway Terminals India, operated by APM Terminals) is the largest terminal with 2.1M TEU capacity, followed by NSIGT (Nhava Sheva International Gateway Terminal, operated by PSA) with 1.5M TEU. The port\u2019s average turnaround time has improved from 4.5 days to 2.8 days through automated gate systems, RFID-based container tracking, and Vessel Traffic Management Systems. The upcoming Fourth Terminal (4CT) by PSA International will add 2.4M TEU capacity with deep draft berths capable of handling 18,000 TEU mega container vessels." },
  { t: "Automated Container Terminals: RTG RMQC AGV Systems in Indian Ports", c: "Indian container terminals are progressively adopting automation technologies to increase throughput and reduce dwell times. Rail-Mounted Quay Cranes (RMQC) with 65-tonne single-lift capacity operate at 35 moves per hour at JNPT GTI and Mundra Port. Rail-Mounted Gantry (RMG) cranes stack containers 6-high in yards with automated positioning systems achieving 98% accuracy. Automated Guided Vehicles (AGVs) for horizontal container transport between quay and yard are being piloted at Adani\u2019s Mundra and V O Chidambaranar ports. The Container Corporation of India (CONCOR) operates 70+ inland container depots (ICDs) connected by 8,000+ weekly rail container movements. Terminal Operating Systems (TOS) like Navis N4 and TOS Plus manage real-time container tracking, yard planning, and vessel scheduling with EDI (Electronic Data Interchange) integration for customs documentation." },
  { t: "Reefer Cold Chain Logistics: Temperature-Sensitive Container Trade", c: "Reefer (refrigerated) container traffic at Indian ports has grown 15% annually, driven by pharmaceutical exports (\u20b92.4 lakh crore), seafood (\u20b960,000 crore), and perishable agricultural products. JNPT handles approximately 300,000 reefer TEUs annually with 2,500+ reefer plug points across its four terminals. Temperature-controlled logistics requirements include continuous monitoring at -25\u00b0C to +25\u00b0C depending on cargo type (frozen fish at -18\u00b0C, bananas at +13\u00b0C, pharmaceuticals at +2 to +8\u00b0C). Cold chain dwell times at Indian ports average 2.1 days for exports and 4.5 days for imports, significantly lower than general cargo. Dedicated reefer monitoring systems with IoT sensors, remote temperature logging, and automated alert systems are being deployed at Chennai, Mundra, and V O Chidambaranar ports to ensure pharmaceutical cold chain integrity per WHO GDP (Good Distribution Practice) standards." }
];

interface PortRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; annualTEU: number; berthLength: number; draftMeters: number; craneCount: number; storageTEU: number; origin: string; terminal: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; containerType: string; status: string; remarks: string; }

const records: PortRecord[] = [
  { id: "PCT-0001", batchNo: "APZ/MUM/2025/JN-0012", operator: "Adani Ports APSEZ Mumbai", zone: "JNPT Nhava Sheva Navi Mumbai", category: "Jawaharlal Nehru Pt 5.0M TEU", description: "JNPT 4CT fourth container terminal with 2.4M TEU capacity deep draft 16m berth RMQC automation for mega container vessels 18000TEU", annualTEU: 2400000, berthLength: 680, draftMeters: 16, craneCount: 8, storageTEU: 18000, origin: "PSA International Singapore", terminal: "JNPT 4CT Nhava Sheva", state: "Maharashtra", mode: "Ship 8000TEU Post-Panamax", prodDate: "2025-01-10", shipDate: "2025-03-18", transitDays: 6, contractValue: 4800000000, containerType: "40ft High Cube", status: "Vessel Berth Departure", remarks: "JNPT 4CT Adani APSEZ 2.4M TEU berth operational" },
  { id: "PCT-0002", batchNo: "ADP/KUC/2025/MP-0025", operator: "Adani Ports APSEZ Mumbai", zone: "Mundra Port Kutch Gujarat", category: "Mundra Port 3.5M TEU", description: "Mundra Phase-IV container terminal expansion with 1.2M TEU additional capacity automated RMG yard and coastal feeder connectivity", annualTEU: 1200000, berthLength: 760, draftMeters: 17, craneCount: 10, storageTEU: 22000, origin: "Adani Logistics Ahmedabad GJ", terminal: "Mundra Phase-IV CT", state: "Gujarat", mode: "Rail Container 80 wagons", prodDate: "2025-02-15", shipDate: "2025-05-22", transitDays: 4, contractValue: 3200000000, containerType: "40ft Standard", status: "Container Yard Stacking Active", remarks: "Mundra Phase-IV Adani expansion yard stacking active" },
  { id: "PCT-0003", batchNo: "DPW/MUM/2025/CH-0038", operator: "DP World Mumbai Nhava Sheva", zone: "Chennai Ennore Kamarajar TN", category: "Chennai Container Terminal 1.5M TEU", description: "Chennai CT3 expansion with 500K TEU additional capacity deepening berth to 15m draft for 14000TEU mainline vessel calls", annualTEU: 500000, berthLength: 450, draftMeters: 15, craneCount: 6, storageTEU: 12000, origin: "DP World HQ Dubai UAE", terminal: "Chennai CT3 Ennore", state: "Tamil Nadu", mode: "Trailer TIP 40T Container", prodDate: "2024-11-05", shipDate: "2025-03-20", transitDays: 3, contractValue: 1800000000, containerType: "20ft Standard", status: "Crane Rail Gantry Unloading", remarks: "Chennai CT3 DP World gantry crane installation" },
  { id: "PCT-0004", batchNo: "JPT/TUT/2025/VO-0042", operator: "JSW Infrastructure Jaigarh", zone: "Tuticorin V O Chidambaranar TN", category: "V O Chidambaranar 1.2M TEU", description: "V O Chidambaranar inner harbour container terminal upgrade with reefer monitoring system and pharma cold chain logistics hub", annualTEU: 400000, berthLength: 380, draftMeters: 14.5, craneCount: 5, storageTEU: 8000, origin: "JSW Dolvi Works MH", terminal: "VOC Inner Harbour CT", state: "Tamil Nadu", mode: "Barge Feeder 500TEU Coastal", prodDate: "2025-03-01", shipDate: "2025-06-15", transitDays: 2, contractValue: 950000000, containerType: "40ft Reefer", status: "Reefer Plug-in Monitoring", remarks: "VOC reefer terminal JSW Infrastructure pharma cold chain" },
  { id: "PCT-0005", batchNo: "CPT/VIZ/2025/VZ-0055", operator: "Chennai Port Trust Ennore", zone: "Visakhapatnam Gangavaram AP", category: "Visakhapatnam BTC 0.8M TEU", description: "Visakhapatnam BTC berthing terminal container handling with iron ore export containers and coastal feeder to JNPT Kolkata", annualTEU: 300000, berthLength: 320, draftMeters: 14, craneCount: 4, storageTEU: 6500, origin: "Visakhapatnam Port Trust AP", terminal: "Vizag BTC Outer Harbour", state: "Andhra Pradesh", mode: "Reach Stacker RTG Crane", prodDate: "2025-02-20", shipDate: "2025-05-10", transitDays: 5, contractValue: 680000000, containerType: "20ft Open Top", status: "Customs Clearance Processing", remarks: "Vizag BTC Chennai Port Trust customs clearance active" },
  { id: "PCT-0006", batchNo: "VOC/TUT/2025/KO-0068", operator: "V O Chidambaranar Tuticorin", zone: "Kolkata Haldia Diamond Harbour", category: "Kolkata Haldia Dock 0.6M TEU", description: "Kolkata Haldia dock complex container terminal with shallow draft restrictions 12.5m feeder vessel only and ICD rail connectivity to NE India", annualTEU: 200000, berthLength: 280, draftMeters: 12.5, craneCount: 3, storageTEU: 4500, origin: "Syama Prasad Mookerjee Port", terminal: "Haldia Dock CT", state: "West Bengal", mode: "Straddle Carrier 50T", prodDate: "2025-04-15", shipDate: "2025-07-25", transitDays: 3, contractValue: 420000000, containerType: "40ft High Cube", status: "Gate-In Gate-Out Truck", remarks: "Kolkata Haldia feeder straddle carrier gate active" },
  { id: "PCT-0007", batchNo: "VPT/VIZ/2025/PD-0071", operator: "Visakhapatnam Port Trust", zone: "Paradip Dhamra Gopalpur Odisha", category: "L&T Kattupalli 1.8M TEU", description: "L&T Kattupalli container terminal with 1.8M TEU capacity auto gate and direct mainline vessel services to Europe Mediterranean", annualTEU: 600000, berthLength: 600, draftMeters: 16.5, craneCount: 7, storageTEU: 15000, origin: "L&T Shipbuilding Chennai TN", terminal: "Kattupalli CT North", state: "Tamil Nadu", mode: "Ship 8000TEU Post-Panamax", prodDate: "2025-03-15", shipDate: "2025-05-28", transitDays: 1, contractValue: 2100000000, containerType: "20ft Standard", status: "Container Yard Stacking Active", remarks: "L&T Kattupalli CT yard stacking mainline Europe service" },
  { id: "PCT-0008", batchNo: "SPM/KOL/2025/KN-0084", operator: "Syama Prasad Mookerjee Kolkata", zone: "Krishnapatnam Nellore AP", category: "Krishnapatnam Port 1.0M TEU", description: "Krishnapatnam container terminal with 1M TEU capacity deep draft 18m and hinterland rail connectivity to Hyderabad Bangalore", annualTEU: 350000, berthLength: 500, draftMeters: 18, craneCount: 6, storageTEU: 10000, origin: "Krishnapatnam Port Ltd AP", terminal: "Krishnapatnam CT Phase-II", state: "Andhra Pradesh", mode: "Rail Container 80 wagons", prodDate: "2024-09-10", shipDate: "2025-02-15", transitDays: 7, contractValue: 1500000000, containerType: "40ft Flat Rack", status: "Crane Rail Gantry Unloading", remarks: "Krishnapatnam Phase-II SPM Kolkata crane gantry active" },
  { id: "PCT-0009", batchNo: "APZ/MUM/2025/JN-0097", operator: "Adani Ports APSEZ Mumbai", zone: "JNPT Nhava Sheva Navi Mumbai", category: "Jawaharlal Nehru Pt 5.0M TEU", description: "JNPT GTI terminal expansion with additional 4 RMQC cranes and automated yard stacking to increase throughput from 2.1M to 2.5M TEU", annualTEU: 400000, berthLength: 350, draftMeters: 15.5, craneCount: 4, storageTEU: 9000, origin: "APM Terminals Hague NL", terminal: "JNPT GTI Expansion", state: "Maharashtra", mode: "Reach Stacker RTG Crane", prodDate: "2025-01-20", shipDate: "2025-04-05", transitDays: 2, contractValue: 1200000000, containerType: "20ft Standard", status: "Vessel Berth Departure", remarks: "JNPT GTI expansion RMQC crane operational" },
  { id: "PCT-0010", batchNo: "ADP/KUC/2025/MP-0108", operator: "Adani Ports APSEZ Mumbai", zone: "Mundra Port Kutch Gujarat", category: "Mundra Port 3.5M TEU", description: "Mundra coastal feeder terminal for 500TEU barge services connecting to JNPT Chennai and VO Chidambaranar ports with daily sailings", annualTEU: 250000, berthLength: 300, draftMeters: 13, craneCount: 3, storageTEU: 5500, origin: "Adani Logistics Mundra GJ", terminal: "Mundra Feeder Terminal", state: "Gujarat", mode: "Barge Feeder 500TEU Coastal", prodDate: "2025-04-01", shipDate: "2025-06-20", transitDays: 3, contractValue: 350000000, containerType: "40ft Standard", status: "Gate-In Gate-Out Truck", remarks: "Mundra feeder barge terminal gate operations active" },
  { id: "PCT-0011", batchNo: "DPW/MUM/2025/CH-0115", operator: "DP World Mumbai Nhava Sheva", zone: "Chennai Ennore Kamarajar TN", category: "Chennai Container Terminal 1.5M TEU", description: "Chennai auto gate system upgrade with OCR container recognition and RFID truck tracking reducing gate turnaround from 45 to 20 minutes", annualTEU: 150000, berthLength: 200, draftMeters: 14.5, craneCount: 2, storageTEU: 4000, origin: "DP World Chennai TN", terminal: "Chennai Auto Gate Phase-II", state: "Tamil Nadu", mode: "Trailer TIP 40T Container", prodDate: "2024-12-20", shipDate: "2025-04-10", transitDays: 1, contractValue: 180000000, containerType: "40ft High Cube", status: "Customs Clearance Processing", remarks: "Chennai auto gate DP World OCR RFID upgrade customs" },
  { id: "PCT-0012", batchNo: "JPT/TUT/2025/VO-0128", operator: "JSW Infrastructure Jaigarh", zone: "Tuticorin V O Chidambaranar TN", category: "V O Chidambaranar 1.2M TEU", description: "VOC coal-to-container terminal conversion with new container yard 5000TEU and 2 post-Panamax cranes for east coast mainline services", annualTEU: 180000, berthLength: 250, draftMeters: 14, craneCount: 2, storageTEU: 5000, origin: "JSW Jaigarh Port MH", terminal: "VOC Coal-to-Container CT", state: "Tamil Nadu", mode: "Ship 8000TEU Post-Panamax", prodDate: "2025-03-25", shipDate: "2025-07-05", transitDays: 4, contractValue: 750000000, containerType: "20ft Standard", status: "Crane Rail Gantry Unloading", remarks: "VOC coal-container JSW conversion crane installation" },
  { id: "PCT-0013", batchNo: "CPT/VIZ/2025/VZ-0132", operator: "Chennai Port Trust Ennore", zone: "Visakhapatnam Gangavaram AP", category: "Visakhapatnam BTC 0.8M TEU", description: "Visakhapatnam BTC hinterland rail connectivity with CONCOR ICD Vishakhapatnam weekly block trains to Delhi and Kolkata NH corridors", annualTEU: 120000, berthLength: 180, draftMeters: 13.5, craneCount: 2, storageTEU: 3500, origin: "CONCOR New Delhi HR", terminal: "Vizag CONCOR ICD Rail Link", state: "Andhra Pradesh", mode: "Rail Container 80 wagons", prodDate: "2025-02-05", shipDate: "2025-04-12", transitDays: 5, contractValue: 280000000, containerType: "40ft Standard", status: "Reefer Plug-in Monitoring", remarks: "Vizag CONCOR rail ICD reefer monitoring active" },
  { id: "PCT-0014", batchNo: "VOC/TUT/2025/KO-0146", operator: "V O Chidambaranar Tuticorin", zone: "Kolkata Haldia Diamond Harbour", category: "Kolkata Haldia Dock 0.6M TEU", description: "Kolkata Haldia container terminal dredging to 14m draft and 2 additional mobile harbour cranes for increased throughput capacity", annualTEU: 80000, berthLength: 150, draftMeters: 14, craneCount: 2, storageTEU: 3000, origin: "Kolkata Port Trust WB", terminal: "Haldia Dredging Upgrade", state: "West Bengal", mode: "Reach Stacker RTG Crane", prodDate: "2025-04-10", shipDate: "2025-06-20", transitDays: 2, contractValue: 320000000, containerType: "20ft Open Top", status: "Container Yard Stacking Active", remarks: "Kolkata Haldia dredging mobile crane yard upgrade" }
];

export default function PortContainerTerminalLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalTEU = records.reduce((s, r) => s + r.annualTEU, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => { const c = statusColor[r.status]; return c !== "green"; }).length;
  const operational = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total TEU Capacity", v: (totalTEU / 1000000).toFixed(1) + "M", s: "Across " + records.length + " terminal records" },
    { l: "Under Construction", v: underConstruction, s: "Crane to stacking active" },
    { l: "Fully Operational", v: operational, s: "Vessel berth departure" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "containerType", label: "Container Type", options: ["20ft Standard", "40ft Standard", "40ft High Cube", "40ft Reefer", "20ft Open Top", "40ft Flat Rack"].map(t => ({ value: t, count: records.filter(r => r.containerType === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.terminal.toLowerCase().includes(q) && !r.containerType.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof PortRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Annual TEU", "Berth (m)", "Draft (m)", "Cranes", "Storage TEU", "Origin", "Terminal", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Container", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="pct-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Container Throughput by Port (000 TEU)</h3><BarChart data={monthlyTeu} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="jnpt" fill="#0c4a6e" radius={[4,4,0,0]} name="JNPT" /><Bar dataKey="mundra" fill="#0369a1" radius={[4,4,0,0]} name="Mundra" /><Bar dataKey="chennai" fill="#0284c7" radius={[4,4,0,0]} name="Chennai" /><Bar dataKey="others" fill="#0ea5e9" radius={[4,4,0,0]} name="Others" /></BarChart></div>
        <div className="pct-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Container Cargo Type Distribution (%)</h3><PieChart width={400} height={220}><Pie data={cargoType} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{cargoType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="pct-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Average Container Dwell Days by Type</h3><LineChart data={dwellDays} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[0, 10]} /><Tooltip /><Legend /><Line type="monotone" dataKey="export_box" stroke="#0c4a6e" strokeWidth={2} name="Export Box" /><Line type="monotone" dataKey="import_box" stroke="#0369a1" strokeWidth={2} strokeDasharray="5 5" name="Import Box" /><Line type="monotone" dataKey="reefer" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="2 2" name="Reefer" /></LineChart></div>
        <div className="pct-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Annual TEU Capacity by Port (000 TEU)</h3><BarChart data={portTeu} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="port" /><YAxis /><Tooltip /><Legend /><Bar dataKey="teu" fill="#0369a1" radius={[4,4,0,0]} name="TEU Capacity" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="pct-root p-6 space-y-6">
      <PageHeader title="Port Container Terminal Logistics" description="Indian port container terminal logistics covering JNPT Nhava Sheva 5M TEU Mundra 3.5M TEU Chennai 1.5M VO Chidambaranar 1.2M Visakhapatnam 0.8M Kolkata Haldia 0.6M L&T Kattupalli 1.8M Krishnapatnam 1.0M with RMQC RMG AGV automation reefer cold chain TOS CONCOR ICD Sagarmala Programme across Maharashtra Gujarat Tamil Nadu Andhra Pradesh West Bengal Odisha" />
      <div className="pct-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`pct-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#0c4a6e] text-white" : "text-gray-600 hover:bg-sky-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Port Container Terminal" }]} />
      {tab === 0 && (
        <div className="pct-dash space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <div key={i} className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">{k.l}</p><p className="text-2xl font-bold text-[#0c4a6e]">{k.v}</p><p className="text-xs text-gray-400">{k.s}</p></div>)}
          </div>
          {renderCharts()}
          <div className="grid grid-cols-2 gap-6">
            {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-4"><h4 className="text-sm font-semibold mb-2 text-[#0c4a6e]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="pct-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="pct-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{(r.annualTEU/1000).toFixed(0)}K</td><td className="px-3 py-2 text-right">{r.berthLength}</td><td className="px-3 py-2 text-right">{r.draftMeters}</td><td className="px-3 py-2 text-right">{r.craneCount}</td><td className="px-3 py-2 text-right">{r.storageTEU.toLocaleString("en-IN")}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.terminal}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.containerType}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="pct-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="pct-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#0c4a6e]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
