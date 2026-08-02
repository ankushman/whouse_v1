"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#3730a3", "#312e81", "#c7d2fe", "#e0e7ff"];
const FREIGHT_FORWARDERS = ["Kuehne+Nagel", "DHL Global Forwarding", "DB Schenker", "Expeditors", "CEVA Logistics", "Bollor\u00e9 Logistics", " Agility", "Hellmann Worldwide"];
const ORIGINS = ["JNPT Mumbai", "Chennai Port", "Kolkata Haldia", "Mundra Port", "Cochin Port", "V.O. Chidambaranar", "Kandla Port", "Paradip Port"];
const DESTINATIONS = ["Rotterdam", "Hamburg", "Felixstowe", "Shanghai", "Singapore", "Dubai Jebel Ali", "Colombo", "Busan"];
const SHIPMENT_TYPES = ["FCL", "LCL", "Air Freight", "Cross Trade", "Break Bulk", "Project Cargo"];
const INCOTERMS = ["FOB", "CIF", "CFR", "EXW", "DDP", "DAP"];
const TABS = ["Dashboard", "Shipment Registry", "Forwarder Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", indigo: "bg-indigo-100 text-indigo-700", slate: "bg-slate-100 text-slate-600", teal: "bg-teal-100 text-teal-700" };
const statusColor: Record<string, string> = { "Booked": "indigo", "In Transit": "teal", "At Port": "amber", "Customs Hold": "red", "Delivered": "green", "Cancelled": "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyShipments = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], fcl: ri(120, 280, 195 + Math.sin(i * 0.5) * 55), lcl: ri(40, 95, 62 + Math.cos(i * 0.6) * 18), air: ri(20, 55, 35 + Math.sin(i * 0.7) * 10) }));
const modeDist = [{ n: "FCL Ocean", v: 52 }, { n: "LCL Ocean", v: 22 }, { n: "Air Freight", v: 14 }, { n: "Cross Trade", v: 8 }, { n: "Break Bulk", v: 3 }, { n: "Project Cargo", v: 1 }];
const costTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(2800, 5200, 3800 + Math.sin(i * 0.4) * 800)).toFixed(0), budget: 4000 }));
const fwdPerf = FREIGHT_FORWARDERS.slice(0, 6).map(f => ({ n: f.split(" ")[0], score: +(ri(76, 98, 86 + Math.random() * 8)).toFixed(1) }));

interface ShipmentRecord { id: string; mblNo: string; hblNo: string; forwarder: string; origin: string; destination: string; shipmentType: string; incoterm: string; carrier: string; vessel: string; voyage: string; etd: string; eta: string; ata: string; containerCount: number; grossWeight: number; cargoValue: number; freightCost: number; status: string; customsStatus: string; doStatus: string; hazmat: string; remarks: string; }

const records: ShipmentRecord[] = [
  { id: "FFC-0001", mblNo: "MAEU-IN-20250105-01", hblNo: "MAEU-IN-20250105-H01", forwarder: "Kuehne+Nagel", origin: "JNPT Mumbai", destination: "Rotterdam", shipmentType: "FCL", incoterm: "FOB", carrier: "Maersk Line", vessel: "Maersk Elba", voyage: "325W", etd: "2025-01-05", eta: "2025-01-22", ata: "2025-01-23", containerCount: 4, grossWeight: 68000, cargoValue: 18500000, freightCost: 12400, status: "Delivered", customsStatus: "Released", doStatus: "Collected", hazmat: "No", remarks: "3x 40ft GP + 1x 40ft HC" },
  { id: "FFC-0002", mblNo: "CSLU-IN-20250108-01", hblNo: "CSLU-IN-20250108-H01", forwarder: "DHL Global Forwarding", origin: "Chennai Port", destination: "Singapore", shipmentType: "LCL", incoterm: "CIF", carrier: "COSCO", vessel: "CSCL Saturn", voyage: "089E", etd: "2025-01-08", eta: "2025-01-14", ata: "", containerCount: 0, grossWeight: 4200, cargoValue: 3200000, freightCost: 2800, status: "In Transit", customsStatus: "Filed", doStatus: "Pending", hazmat: "No", remarks: "LCL consolidation - 3 shippers" },
  { id: "FFC-0003", mblNo: "HLCU-IN-20250106-01", hblNo: "HLCU-IN-20250106-H01", forwarder: "DB Schenker", origin: "Mundra Port", destination: "Hamburg", shipmentType: "FCL", incoterm: "CFR", carrier: "Hapag-Lloyd", vessel: "HL Boston", voyage: "245E", etd: "2025-01-06", eta: "2025-01-25", ata: "", containerCount: 6, grossWeight: 96000, cargoValue: 42000000, freightCost: 18600, status: "At Port", customsStatus: "Exam Pending", doStatus: "Not Issued", hazmat: "Yes", remarks: "6x 20ft GP - Class 3 IMDG chemicals" },
  { id: "FFC-0004", mblNo: "0NLU-IN-20250110-01", hblNo: "0NLU-IN-20250110-H01", forwarder: "Expeditors", origin: "Kolkata Haldia", destination: "Shanghai", shipmentType: "FCL", incoterm: "FOB", carrier: "ONE", vessel: "ONE Harmony", voyage: "567W", etd: "2025-01-10", eta: "2025-01-28", ata: "", containerCount: 2, grossWeight: 34000, cargoValue: 8500000, freightCost: 7200, status: "In Transit", customsStatus: "Pre-filed", doStatus: "Not Issued", hazmat: "No", remarks: "2x 40ft HC - jute textiles" },
  { id: "FFC-0005", mblNo: "EKI-IN-20250112-01", hblNo: "EKI-IN-20250112-H01", forwarder: "CEVA Logistics", origin: "JNPT Mumbai", destination: "Dubai Jebel Ali", shipmentType: "Air Freight", incoterm: "DDP", carrier: "Emirates SkyCargo", vessel: "EK-731", voyage: "731/12JAN", etd: "2025-01-12", eta: "2025-01-13", ata: "2025-01-13", containerCount: 0, grossWeight: 1200, cargoValue: 12800000, freightCost: 4200, status: "Delivered", customsStatus: "Released", doStatus: "Collected", hazmat: "No", remarks: "Air cargo - pharma express" },
  { id: "FFC-0006", mblNo: "MSCU-IN-20250109-01", hblNo: "MSCU-IN-20250109-H01", forwarder: "Bollor\u00e9 Logistics", origin: "Cochin Port", destination: "Felixstowe", shipmentType: "FCL", incoterm: "CIF", carrier: "MSC", vessel: "MSC Fantasia", voyage: "108E", etd: "2025-01-09", eta: "2025-01-28", ata: "", containerCount: 3, grossWeight: 52000, cargoValue: 15600000, freightCost: 9800, status: "In Transit", customsStatus: "Filed", doStatus: "Not Issued", hazmat: "No", remarks: "3x 40ft GP - spices & coffee" },
  { id: "FFC-0007", mblNo: "TCLU-IN-20250114-01", hblNo: "TCLU-IN-20250114-H01", forwarder: "Agility", origin: "V.O. Chidambaranar", destination: "Colombo", shipmentType: "LCL", incoterm: "EXW", carrier: "X-Press Feeders", vessel: "XPF Condor", voyage: "412W", etd: "2025-01-14", eta: "2025-01-16", ata: "", containerCount: 0, grossWeight: 8400, cargoValue: 4600000, freightCost: 1850, status: "At Port", customsStatus: "Pending", doStatus: "Not Issued", hazmat: "No", remarks: "LCL - auto parts consolidation" },
  { id: "FFC-0008", mblNo: "SUDU-IN-20250107-01", hblNo: "SUDU-IN-20250107-H01", forwarder: "Hellmann Worldwide", origin: "Mundra Port", destination: "Busan", shipmentType: "Cross Trade", incoterm: "DAP", carrier: "HMM", vessel: "HMM Promise", voyage: "321W", etd: "2025-01-07", eta: "2025-01-24", ata: "", containerCount: 2, grossWeight: 28000, cargoValue: 9200000, freightCost: 5600, status: "In Transit", customsStatus: "Pre-filed", doStatus: "Not Issued", hazmat: "No", remarks: "Cross trade Vietnam-origin Korea-dest" },
  { id: "FFC-0009", mblNo: "MAEU-IN-20250115-01", hblNo: "MAEU-IN-20250115-H01", forwarder: "Kuehne+Nagel", origin: "JNPT Mumbai", destination: "Hamburg", shipmentType: "FCL", incoterm: "FOB", carrier: "Maersk Line", vessel: "Maersk Gujarat", voyage: "402W", etd: "2025-01-15", eta: "2025-02-02", ata: "", containerCount: 8, grossWeight: 128000, cargoValue: 62000000, freightCost: 24000, status: "Booked", customsStatus: "Pre-filed", doStatus: "Not Issued", hazmat: "No", remarks: "8x 40ft HC - engineering equipment" },
  { id: "FFC-0010", mblNo: "CSLU-IN-20250111-01", hblNo: "CSLU-IN-20250111-H01", forwarder: "DHL Global Forwarding", origin: "Chennai Port", destination: "Dubai Jebel Ali", shipmentType: "FCL", incoterm: "CIF", carrier: "COSCO", vessel: "Cosco Peace", voyage: "156W", etd: "2025-01-11", eta: "2025-01-20", ata: "2025-01-22", containerCount: 2, grossWeight: 36000, cargoValue: 14800000, freightCost: 5400, status: "Delivered", customsStatus: "Released", doStatus: "Collected", hazmat: "No", remarks: "2x 20ft GP - leather goods" },
  { id: "FFC-0011", mblNo: "EGIU-IN-20250113-01", hblNo: "EGIU-IN-20250113-H01", forwarder: "Expeditors", origin: "Kandla Port", destination: "Rotterdam", shipmentType: "Break Bulk", incoterm: "FOB", carrier: "BBC Chartering", vessel: "BBC Mississippi", voyage: "BM-2025-08", etd: "2025-01-13", eta: "2025-02-05", ata: "", containerCount: 0, grossWeight: 420000, cargoValue: 45000000, freightCost: 32000, status: "In Transit", customsStatus: "Filed", doStatus: "Not Issued", hazmat: "No", remarks: "Break bulk - steel coils project cargo" },
  { id: "FFC-0012", mblNo: "HLCU-IN-20250116-01", hblNo: "HLCU-IN-20250116-H01", forwarder: "DB Schenker", origin: "JNPT Mumbai", destination: "Singapore", shipmentType: "Air Freight", incoterm: "DDP", carrier: "Singapore Airlines Cargo", vessel: "SQ-421", voyage: "421/16JAN", etd: "2025-01-16", eta: "2025-01-17", ata: "", containerCount: 0, grossWeight: 2800, cargoValue: 35000000, freightCost: 6800, status: "Booked", customsStatus: "Pre-filed", doStatus: "Not Issued", hazmat: "Yes", remarks: "Air cargo - lithium batteries UN3481" },
  { id: "FFC-0013", mblNo: "MAEU-IN-20250104-01", hblNo: "MAEU-IN-20250104-H01", forwarder: "CEVA Logistics", origin: "Paradip Port", destination: "Shanghai", shipmentType: "FCL", incoterm: "CFR", carrier: "Maersk Line", vessel: "Maersk Sealand", voyage: "330W", etd: "2025-01-04", eta: "2025-01-22", ata: "2025-01-23", containerCount: 4, grossWeight: 72000, cargoValue: 22000000, freightCost: 11200, status: "Delivered", customsStatus: "Released", doStatus: "Collected", hazmat: "No", remarks: "4x 40ft GP - iron ore pellets" },
  { id: "FFC-0014", mblNo: "MSCU-IN-20250117-01", hblNo: "MSCU-IN-20250117-H01", forwarder: "Bollor\u00e9 Logistics", origin: "Chennai Port", destination: "Colombo", shipmentType: "LCL", incoterm: "EXW", carrier: "MSC", vessel: "MSC Sinfonia", voyage: "225E", etd: "2025-01-17", eta: "2025-01-19", ata: "", containerCount: 0, grossWeight: 5600, cargoValue: 2800000, freightCost: 1200, status: "Customs Hold", customsStatus: "Exam Required", doStatus: "Not Issued", hazmat: "No", remarks: "RMS flagged - exam pending" },
];

const bookedCount = records.filter(r => r.status === "Booked").length;
const inTransitCount = records.filter(r => r.status === "In Transit" || r.status === "At Port").length;
const holdCount = records.filter(r => r.status === "Customs Hold").length;
const totalTEU = records.reduce((s, r) => s + r.containerCount * 2, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(0)}L`;
  if (n >= 1000) return `\u20b9${(n / 1000).toFixed(0)}K`;
  return `\u20b9${n}`;
}

const kpis = [
  { l: "In Transit / At Port", v: inTransitCount, s: "active shipments" },
  { l: "Total TEU", v: totalTEU, s: "containers booked" },
  { l: "Customs Hold", v: holdCount, s: "need attention" },
  { l: "Total Cargo Value", v: fmtVal(records.reduce((s, r) => s + r.cargoValue, 0)), s: "across all shipments" },
];

const INSIGHTS = [
  {
    t: "India International Freight Forwarding: $18.5 Billion Market with 2,400+ Licensed CHA",
    c: "India\u2019s international freight forwarding market, valued at approximately $18.5 billion in FY2024, is served by over 2,400 licensed Custom House Agents (CHA) regulated under the Customs Brokers Licensing Regulations 2018 by CBIC. The market has grown at a 12-14% CAGR driven by India\u2019s merchandise export surge ($765 billion in FY2024, up from $412 billion in FY2020) and expanding import volumes across 12 major gateway ports. The top 10 global freight forwarders operating in India\u2014Kuehne+Nagel, DHL Global Forwarding, DB Schenker, Expeditors International, CEVA Logistics, Bollor\u00e9 Logistics, Agility, Hellmann Worldwide, DSV, and Geodis\u2014collectively control approximately 45% of India\u2019s international freight volumes, with the remaining 55% managed by domestic CHAs like Sical Logistics, Allcargo (AvvashyaCCI), and V. Pohumal & Sons. India\u2019s EXIM documentation ecosystem involves 16 mandatory documents per international shipment: Bill of Lading/Airway Bill, Commercial Invoice, Packing List, Certificate of Origin, Customs Declaration (Bill of Entry/Shipping Bill), Phytosanitary/FSSAI certificates (for agri/food), Insurance Certificate, Letter of Credit (for LC-backed shipments), ISPM-15 wood packaging compliance, and for hazardous cargo, IMDG Dangerous Goods Declaration. The digitization push through ICEGATE (Indian Customs EDI Gateway) and the upcoming NIL (National Import Logistics) platform aims to reduce average customs clearance time from 3.2 days to 1 day for Green Channel shipments and from 7.5 days to 3 days for Red Channel. For mid-sized exporters managing 50-200 monthly international shipments, a freight forwarding management system that integrates CHA coordination, DO (Delivery Order) tracking, vessel cut-off management, and multi-modal booking can reduce per-shipment documentation errors by 85% and cut total freight cycle time by 30%.",
  },
  {
    t: "Ocean Freight Rates & Route Optimization: JNPT-Rotterdam vs Chennai-Singapore",
    c: "Ocean freight rates for India\u2019s major export corridors exhibit significant volatility driven by vessel availability, port congestion, peak season surcharges (PSS), and fuel cost fluctuations (bunker adjustment factor). The JNPT Mumbai-Rotterdam corridor (via Suez Canal, 19-22 days transit) for 40ft FCL averaged $2,800-$4,500 in FY2024, with rates spiking to $6,800 during the Q4 2023 Red Sea crisis before normalizing by Q2 2024. The Chennai-Singapore corridor (7-9 days transit) averages $600-$1,200 per 40ft FCL, serving as India\u2019s highest-frequency short-sea trade lane with 8-12 weekly sailings from multiple carriers. India\u2019s air freight rates from Mumbai IGI Airport to Dubai ($2.80-$3.50/kg) and to Frankfurt ($4.20-$5.80/kg) remain 35-45% higher than pre-pandemic levels due to limited belly cargo capacity on passenger flights and strong pharma/electronics export demand. Key cost optimization strategies for Indian freight forwarders include: (1) Carrier contract negotiation leveraging annual volume commitments (10-15% rate reduction for 500+ TEU/year commitments), (2) Multi-port loading optimization that consolidates cargo from JNPT, Mundra, and Hazira to fill vessel slots efficiently, (3) LCL consolidation services that offer 40-60% cost savings for shipments under 15 CBM compared to FCL, and (4) Peak season advance booking (3-4 weeks before Chinese Golden Week, Diwali, and Christmas shipping cycles) to avoid PSS of $300-600 per container. India\u2019s freight forwarding margins typically range from 8-15% on ocean freight and 15-25% on air freight, with value-added services like customs brokerage (3-5% of cargo value), warehousing, and inland transport contributing incremental revenue. Companies deploying real-time rate benchmarking platforms report 12-18% reduction in total logistics cost per TEU.",
  },
  {
    t: "Customs Clearance & CHA Operations: ICEGATE Digital Transformation",
    c: "India\u2019s customs clearance process for international freight, administered through the ICEGATE platform (Indian Customs EDI Gateway, processing 12 lakh+ Bills of Entry monthly), has undergone significant digitization with the introduction of faceless assessment (2020), ACES 2.0 (Automation of Central Excise and Service Tax), and the Risk Management System (RMS) that channels consignments into Green (68% direct release), Yellow (22% document check), and Red (10% physical examination) pathways. For freight forwarders, the customs clearance workflow involves: (1) Pre-arrival Bill of Entry filing (BE type available 30 days before vessel arrival), (2) Document upload through ICEGATE (invoice, packing list, BL/AWB, certificate of origin), (3) RMS risk assessment, (4) Duty payment through electronic cash ledger (IGST + Customs Duty + Social Welfare Surcharge), (5) Out of Charge order from customs officer, and (6) DO collection from shipping line for container gate-out. The average customs clearance time at India\u2019s major ports: JNPT (2.1 days for Green, 5.8 days for Red), Chennai (1.8 days Green, 4.5 days Red), Mundra (1.5 days Green, 3.8 days Red), with significant variation during peak season (October-February) when Red Channel clearance can extend to 10-14 days due to examiner backlog. India\u2019s Authorized Economic Operator (AEO) program, with 2,800+ certified entities across T1/T2/T3 tiers, provides Green Channel facilitation, reduced examination rates (from 10% to 2%), and self-assessment privileges that can reduce average clearance time by 60%. The upcoming NIL (National Import Logistics) portal, integrating customs, port, and logistics stakeholders into a single window, is expected to reduce end-to-end EXIM logistics time by 40% and documentation costs by 30%.",
  },
  {
    t: "Delivery Order & Port Terminal Operations: Cut-Off Time Management",
    c: "Delivery Order (DO) management is a critical operational function for freight forwarders, involving the collection of the DO document from the shipping line (or their local agent) that authorizes the consignee or their CHA to take delivery of the container from the port terminal. In India, the DO process typically takes 1-3 business days after vessel arrival, with delays caused by: (1) Freight bill settlement with shipping line (must be cleared before DO issuance), (2) Original BL surrender or telex release confirmation, (3) Port trust documentation (cargo manifest reconciliation), and (4) Terminal operator gate-in slot booking. The average cost of a DO in India ranges from \u20b92,500-4,500 per container depending on the port and shipping line, with additional charges for amendments (\u20b9500-1,000), express processing (\u20b91,500-2,000), and weekend release (\u20b92,000-3,000). Key cut-off time management challenges for Indian freight forwarders include: (1) Vessel cut-off (document cut-off typically 3-5 days before ETD, cargo cut-off 1-2 days before ETD), (2) SI (Shipping Instructions) deadline (usually 4 days before ETD for accurate manifest filing), (3) Rail/road connection cut-off for ICD-bound containers (rake loading 48-72 hours before vessel arrival at transshipment port), and (4) Free time expiration at destination (typically 7 days for FCL, 5 days for LCL, after which demurrage/detention charges apply at \u20b91,500-4,000 per container per day). Forwarders with integrated cut-off management systems that provide automated alerts at SI deadline, document cut-off, and cargo cut-off milestones report 25% reduction in late documentation incidents and 40% fewer containers missing vessel sailings.",
  },
];

export default function FreightForwardingCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: Object.keys(statusColor).map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "forwarder", label: "Forwarder", options: FREIGHT_FORWARDERS.map(f => ({ value: f, count: records.filter(r => r.forwarder === f).length })) },
    { key: "shipmentType", label: "Type", options: SHIPMENT_TYPES.map(t => ({ value: t, count: records.filter(r => r.shipmentType === t).length })) },
    { key: "incoterm", label: "Incoterm", options: INCOTERMS.map(ic => ({ value: ic, count: records.filter(r => r.incoterm === ic).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.mblNo.toLowerCase().includes(q) && !r.hblNo.toLowerCase().includes(q) && !r.forwarder.toLowerCase().includes(q) && !r.carrier.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ShipmentRecord] as string));
  });

  return (
    <div className="ffc-root p-6 space-y-6">
      <PageHeader title="Freight Forwarding Command Center" description="International freight forwarding operations, CHA management, MBL/HBL tracking, customs clearance, DO management, vessel cut-off planning and multi-modal shipment orchestration" />
      <div className="ffc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`ffc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="ffc-dash space-y-6">
          <div className="ffc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="ffc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 ffc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-indigo-700 ffc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 ffc-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ffc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Shipments by Mode</h3><BarChart data={monthlyShipments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="fcl" fill="#4f46e5" radius={[4,4,0,0]} name="FCL" /><Bar dataKey="lcl" fill="#6366f1" radius={[4,4,0,0]} name="LCL" /><Bar dataKey="air" fill="#818cf8" radius={[4,4,0,0]} name="Air" /></BarChart></div>
            <div className="ffc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Shipment Mode Distribution</h3><PieChart width={400} height={220}><Pie data={modeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{modeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ffc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Freight Cost per TEU vs Budget</h3><LineChart data={costTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={2} name="Actual $" /><Line type="monotone" dataKey="budget" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Budget" /></LineChart></div>
            <div className="ffc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Forwarder Performance Scorecard</h3><BarChart data={fwdPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[70, 100]} /><Tooltip /><Bar dataKey="score" fill="#6366f1" radius={[4,4,0,0]} name="Score %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="ffc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Freight", href: "#" }, { label: "Shipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="ffc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,MBL No,HBL No,Forwarder,Origin,Dest,Type,Incoterm,Carrier,Vessel,ETD,ETA,ATA,Containers,Weight,Cargo Value,Freight,Status,Customs,DO,Hazmat,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Customs Hold" ? "ffc-row-critical bg-red-50" : r.status === "Booked" ? "ffc-row-info bg-indigo-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-indigo-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="ffc-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700 font-mono">{r.mblNo.slice(0,18)}</span></td>
                <td className="px-3 py-2 text-xs font-mono">{r.hblNo.slice(0,18)}</td>
                <td className="px-3 py-2 text-xs">{r.forwarder}</td>
                <td className="px-3 py-2 text-xs">{r.origin}</td>
                <td className="px-3 py-2 text-xs">{r.destination}</td>
                <td className="px-3 py-2"><span className="ffc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.shipmentType}</span></td>
                <td className="px-3 py-2"><span className="ffc-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-600">{r.incoterm}</span></td>
                <td className="px-3 py-2 text-xs">{r.carrier}</td>
                <td className="px-3 py-2 text-xs">{r.vessel}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.etd}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2 text-xs">{r.ata || <span className="text-slate-400">\u2014</span>}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.containerCount > 0 ? `${r.containerCount}x` : "\u2014"}</td>
                <td className="px-3 py-2 text-xs">{r.grossWeight > 0 ? `${(r.grossWeight/1000).toFixed(0)}T` : "\u2014"}</td>
                <td className="px-3 py-2 text-xs font-semibold">{fmtVal(r.cargoValue)}</td>
                <td className="px-3 py-2 text-xs">${r.freightCost.toLocaleString()}</td>
                <td className="px-3 py-2"><span className={`ffc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 rounded text-xs ${r.customsStatus === "Released" ? "bg-green-100 text-green-700" : r.customsStatus === "Exam Required" || r.customsStatus === "Exam Pending" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{r.customsStatus}</span></td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 rounded text-xs ${r.doStatus === "Collected" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{r.doStatus}</span></td>
                <td className="px-3 py-2">{r.hazmat === "Yes" ? <span className="ffc-badge inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">HAZMAT</span> : <span className="text-slate-400 text-xs">No</span>}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="ffc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="ffc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Freight Volume by Origin Port</h3><BarChart data={ORIGINS.slice(0,6).map(o => ({ n: o.split(" ")[0], v: +ri(18, 85, 48 + Math.random() * 28).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#4f46e5" radius={[4,4,0,0]} /></BarChart></div>
            <div className="ffc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Revenue by Trade Lane</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], europe: ri(42, 92, 64 + Math.sin(i*0.5)*14), asia: ri(32, 78, 52 + Math.cos(i*0.6)*12), middleEast: ri(18, 48, 32 + Math.sin(i*0.7)*8) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="europe" stackId="1" stroke="#4f46e5" fill="#e0e7ff" name="Europe" /><Area type="monotone" dataKey="asia" stackId="1" stroke="#6366f1" fill="#c7d2fe" name="Asia" /><Area type="monotone" dataKey="middleEast" stackId="1" stroke="#818cf8" fill="#a5b4fc" name="Middle East" /></AreaChart></div>
          </div>
          <div className="ffc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Transit Time by Route (Days)</h3><BarChart data={[{n:"JNPT-Rotterdam",v:19},{n:"JNPT-Hamburg",v:21},{n:"Chennai-Singapore",v:8},{n:"Mundra-Shanghai",v:14},{n:"Kolkata-Colombo",v:5},{n:"Cochin-Felixstowe",v:18}].map(d => ({...d, v: +ri(d.v-2, d.v+3, d.v + Math.random()*3).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#6366f1" radius={[4,4,0,0]} /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="ffc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="ffc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-indigo-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
