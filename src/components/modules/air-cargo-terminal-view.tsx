"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#475569", "#64748b", "#94a3b8", "#cbd5e1", "#334155", "#1e293b", "#e2e8f0", "#f1f5f9"];
const TERMINALS = ["DEL T3 Cargo", "BOM Air India Cargo", "MAA Chennai Cargo", "HYD Shamshabad Cargo", "BLR Kempegowda Cargo", "CCU NSCBI Kolkata", "COK Cochin Cargo", "GOI Dabolim Cargo"];
const AIRLINES = ["Air India Cargo", "SpiceJet Freight", "IndiGo Cargo", "BlueDart Aviation", "Vistara Cargo", "Emirates SkyCargo", "Qatar Cargo", "Lufthansa Cargo"];
const CARGO_TYPES = ["General Cargo", "Perishable", "DG/Hazmat", "Pharma", "Live Animals", "Valuables", "E-commerce", "Oversized"];
const AWB_STATUSES = ["Booked", "Arrived", "Under Customs", "Released", "Delivered", "Held"];
const TABS = ["Dashboard", "AWB Registry", "Terminal Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Booked": "slate", "Arrived": "blue", "Under Customs": "amber", "Released": "green", "Delivered": "green", "Held": "red" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyTonnage = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], domestic: ri(8500, 18000, 12500 + Math.sin(i * 0.5) * 3500), international: ri(4200, 9500, 6800 + Math.cos(i * 0.6) * 1500), express: ri(1800, 4200, 2800 + Math.sin(i * 0.7) * 800) }));
const cargoTypeDist = [{ n: "General", v: 35 }, { n: "Perishable", v: 18 }, { n: "E-com", v: 15 }, { n: "Pharma", v: 12 }, { n: "DG/Hazmat", v: 8 }, { n: "Valuables", v: 6 }, { n: "Live Animals", v: 3 }, { n: "Oversized", v: 3 }];
const throughputTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(18, 38, 26.5 + Math.sin(i * 0.4) * 5.5)).toFixed(1), target: 28.0 }));
const terminalPerf = TERMINALS.slice(0, 6).map(t => ({ n: t.split(" ")[0], v: +ri(78, 96, 86 + Math.random() * 8).toFixed(0) }));

interface AWBRecord { id: string; awbNo: string; airline: string; origin: string; dest: string; terminal: string; cargoType: string; pieces: number; weight: number; volumeWeight: number; declaredValue: number; bookingDate: string; flightNo: string; eta: string; ata: string; deliveryDate: string; status: string; customsStatus: string; storageDays: number; handlingAgent: string; shipper: string; consignee: string; remarks: string; }

const records: AWBRecord[] = [
  { id: "ACT-0001", awbNo: "125-12345678", airline: "Air India Cargo", origin: "DEL", dest: "LHR", terminal: "DEL T3 Cargo", cargoType: "General Cargo", pieces: 24, weight: 1850, volumeWeight: 2100, declaredValue: 4250000, bookingDate: "2025-01-10", flightNo: "AI-111", eta: "2025-01-11", ata: "2025-01-11", deliveryDate: "", status: "Under Customs", customsStatus: "Examination Pending", storageDays: 3, handlingAgent: "AI SATS", shipper: "Tata Exports Ltd", consignee: "London Trade Corp", remarks: "Textile consignment - customs exam" },
  { id: "ACT-0002", awbNo: "738-87654321", airline: "SpiceJet Freight", origin: "BOM", dest: "DXB", terminal: "BOM Air India Cargo", cargoType: "Perishable", pieces: 12, weight: 620, volumeWeight: 780, declaredValue: 1850000, bookingDate: "2025-01-12", flightNo: "SG-44", eta: "2025-01-12", ata: "2025-01-12", deliveryDate: "2025-01-12", status: "Delivered", customsStatus: "Cleared", storageDays: 0, handlingAgent: "BlueDart BOM", shipper: "Alphonso Farms Ratnagiri", consignee: "Dubai Fresh Fruits LLC", remarks: "Mango shipment - cold chain maintained" },
  { id: "ACT-0003", awbNo: "096-11223344", airline: "BlueDart Aviation", origin: "BLR", dest: "DEL", terminal: "BLR Kempegowda Cargo", cargoType: "E-commerce", pieces: 185, weight: 420, volumeWeight: 650, declaredValue: 890000, bookingDate: "2025-01-14", flightNo: "BD-202", eta: "2025-01-14", ata: "2025-01-14", deliveryDate: "", status: "Arrived", customsStatus: "Awaiting Filing", storageDays: 1, handlingAgent: "BlueDart BLR", shipper: "Amazon FC Bengaluru", consignee: "Amazon FC Delhi", remarks: "Express e-commerce parcel" },
  { id: "ACT-0004", awbNo: "176-55667788", airline: "Emirates SkyCargo", origin: "HYD", dest: "JFK", terminal: "HYD Shamshabad Cargo", cargoType: "Pharma", pieces: 8, weight: 340, volumeWeight: 410, declaredValue: 12500000, bookingDate: "2025-01-08", flightNo: "EK-524", eta: "2025-01-09", ata: "", deliveryDate: "", status: "Booked", customsStatus: "Pre-cleared", storageDays: 0, handlingAgent: "Menlo HYD", shipper: "Dr Reddys Labs", consignee: "Pharma Corp New York", remarks: "Temperature-controlled 2-8\u00b0C" },
  { id: "ACT-0005", awbNo: "582-99887766", airline: "Qatar Cargo", origin: "MAA", dest: "DOH", terminal: "MAA Chennai Cargo", cargoType: "DG/Hazmat", pieces: 6, weight: 1850, volumeWeight: 1400, declaredValue: 3200000, bookingDate: "2025-01-13", flightNo: "QR-528", eta: "2025-01-14", ata: "", deliveryDate: "", status: "Held", customsStatus: "DG Clearance Pending", storageDays: 2, handlingAgent: "AI SATS MAA", shipper: "Chem India Pvt Ltd", consignee: "Doha Chemical Industries", remarks: "Class 3 UN1263 - ADR documentation pending" },
  { id: "ACT-0006", awbNo: "820-44332211", airline: "IndiGo Cargo", origin: "DEL", dest: "CCU", terminal: "DEL T3 Cargo", cargoType: "General Cargo", pieces: 32, weight: 2100, volumeWeight: 2500, declaredValue: 5600000, bookingDate: "2025-01-15", flightNo: "6E-512", eta: "2025-01-15", ata: "2025-01-15", deliveryDate: "", status: "Arrived", customsStatus: "Filed", storageDays: 0, handlingAgent: "Celebi DEL", shipper: "Rajesh Exports Mumbai", consignee: "Kolkata Jewellers Assoc", remarks: "Gold jewellery - high value secured" },
  { id: "ACT-0007", awbNo: "065-66554433", airline: "Lufthansa Cargo", origin: "BOM", dest: "FRA", terminal: "BOM Air India Cargo", cargoType: "Oversized", pieces: 2, weight: 8500, volumeWeight: 12000, declaredValue: 18500000, bookingDate: "2025-01-11", flightNo: "LH-764", eta: "2025-01-12", ata: "2025-01-12", deliveryDate: "2025-01-13", status: "Delivered", customsStatus: "Cleared", storageDays: 1, handlingAgent: "AI SATS BOM", shipper: "Bharat Heavy Electricals", consignee: "Siemens AG Munich", remarks: "Turbine rotor - special handling" },
  { id: "ACT-0008", awbNo: "456-11229988", airline: "Vistara Cargo", origin: "DEL", dest: "SIN", terminal: "DEL T3 Cargo", cargoType: "Perishable", pieces: 48, weight: 920, volumeWeight: 1100, declaredValue: 2800000, bookingDate: "2025-01-14", flightNo: "UK-551", eta: "2025-01-15", ata: "", deliveryDate: "", status: "Booked", customsStatus: "Not Filed", storageDays: 0, handlingAgent: "AI SATS DEL", shipper: "KIET Agro Noida", consignee: "Singapore Cold Storage", remarks: "Frozen peas - cold chain required" },
  { id: "ACT-0009", awbNo: "512-33445566", airline: "Air India Cargo", origin: "CCU", dest: "BKK", terminal: "CCU NSCBI Kolkata", cargoType: "Live Animals", pieces: 1, weight: 85, volumeWeight: 120, declaredValue: 450000, bookingDate: "2025-01-09", flightNo: "AI-223", eta: "2025-01-10", ata: "2025-01-10", deliveryDate: "2025-01-10", status: "Delivered", customsStatus: "Cleared", storageDays: 0, handlingAgent: "BlueDart CCU", shipper: "Kolkata Zoo Authority", consignee: "Bangkok Safari World", remarks: "Royal Bengal Tiger cub - CITES permit" },
  { id: "ACT-0010", awbNo: "847-77665544", airline: "BlueDart Aviation", origin: "HYD", dest: "DEL", terminal: "HYD Shamshabad Cargo", cargoType: "E-commerce", pieces: 320, weight: 680, volumeWeight: 920, declaredValue: 1250000, bookingDate: "2025-01-16", flightNo: "BD-305", eta: "2025-01-16", ata: "", deliveryDate: "", status: "Booked", customsStatus: "Not Filed", storageDays: 0, handlingAgent: "BlueDart HYD", shipper: "Flipkart FC Hyderabad", consignee: "Flipkart FC Gurgaon", remarks: "Express parcel batch" },
  { id: "ACT-0011", awbNo: "259-88776655", airline: "Emirates SkyCargo", origin: "COK", dest: "DXB", terminal: "COK Cochin Cargo", cargoType: "Perishable", pieces: 20, weight: 1100, volumeWeight: 1350, declaredValue: 3200000, bookingDate: "2025-01-07", flightNo: "EK-530", eta: "2025-01-08", ata: "2025-01-08", deliveryDate: "2025-01-08", status: "Delivered", customsStatus: "Cleared", storageDays: 0, handlingAgent: "AI SATS COK", shipper: "Spices Board Kochi", consignee: "Al Mulla Spice Dubai", remarks: "Kerala cardamom + pepper shipment" },
  { id: "ACT-0012", awbNo: "603-22110099", airline: "SpiceJet Freight", origin: "DEL", dest: "HKG", terminal: "DEL T3 Cargo", cargoType: "Valuables", pieces: 4, weight: 28, volumeWeight: 35, declaredValue: 28000000, bookingDate: "2025-01-13", flightNo: "SG-88", eta: "2025-01-14", ata: "2025-01-14", deliveryDate: "", status: "Under Customs", customsStatus: "Valuation Check", storageDays: 2, handlingAgent: "Celebi DEL", shipper: "Gitanjali Gems Mumbai", consignee: "HK Jewellery Trading Ltd", remarks: "Diamond shipment - CISF escorted" },
  { id: "ACT-0013", awbNo: "180-55443322", airline: "Qatar Cargo", origin: "BLR", dest: "CDG", terminal: "BLR Kempegowda Cargo", cargoType: "Pharma", pieces: 15, weight: 280, volumeWeight: 350, declaredValue: 8500000, bookingDate: "2025-01-12", flightNo: "QR-556", eta: "2025-01-13", ata: "", deliveryDate: "", status: "Booked", customsStatus: "Pre-cleared", storageDays: 0, handlingAgent: "Menlo BLR", shipper: "Biocon Ltd", consignee: "Paris Pharma Distributors", remarks: "Biologics 2-8\u00b0C - GDP compliant" },
  { id: "ACT-0014", awbNo: "999-99001122", airline: "IndiGo Cargo", origin: "MAA", dest: "DEL", terminal: "MAA Chennai Cargo", cargoType: "General Cargo", pieces: 56, weight: 3200, volumeWeight: 4100, declaredValue: 7200000, bookingDate: "2025-01-15", flightNo: "6E-281", eta: "2025-01-15", ata: "2025-01-15", deliveryDate: "", status: "Released", customsStatus: "Cleared", storageDays: 1, handlingAgent: "AI SATS MAA", shipper: "TVS Group Chennai", consignee: "Delhi Industrial Supply", remarks: "Auto components - priority delivery" },
];

const bookedCount = records.filter(r => r.status === "Booked" || r.status === "Arrived").length;
const customsCount = records.filter(r => r.status === "Under Customs" || r.status === "Held").length;
const deliveredCount = records.filter(r => r.status === "Delivered" || r.status === "Released").length;
const totalCargoValue = records.reduce((s, r) => s + r.declaredValue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

function fmtWt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}T`;
  return `${n}K`;
}

const kpis = [
  { l: "Inbound / Booked", v: bookedCount, s: "shipments in pipeline" },
  { l: "Customs / Held", v: customsCount, s: "pending clearance" },
  { l: "Released / Delivered", v: deliveredCount, s: "completed this batch" },
  { l: "Total Cargo Value", v: fmtVal(totalCargoValue), s: "across all AWBs" },
];

const INSIGHTS = [
  {
    t: "India Air Cargo: 3.6 MMT Throughput at AAI and Private Terminals",
    c: "India\u2019s air cargo industry handled approximately 3.6 million metric tonnes (MMT) of cargo in FY2024 across 37 operational cargo terminals managed by the Airports Authority of India (AAI), joint venture operators (AI SATS, Celebi, Menzies), and private terminal operators (BLR Kempegowda, DIAL T3 Delhi). The Indian air cargo market, valued at approximately \u20b915,800 crore in FY2024, has grown at 8-12% CAGR driven by e-commerce express parcels (28% growth YoY), pharmaceutical exports (\u20b954,000 crore in FY2024, India is the world\u2019s 3rd largest pharma exporter), and perishable agricultural exports (grapes, mangoes, pomegranates, and spices). India\u2019s top air cargo airports by volume are: Delhi-IGI (920,000 MT, 26% share), Mumbai-CSIA (680,000 MT, 19%), Chennai-MAA (420,000 MT, 12%), Bengaluru-BLR (380,000 MT, 11%), Hyderabad-HYD (320,000 MT, 9%), Kolkata-CCU (210,000 MT, 6%), and Cochin-COK (180,000 MT, 5%). The domestic air cargo segment accounts for 58% of total throughput (2.1 MMT), while international cargo accounts for 42% (1.5 MMT), with key trade lanes being India-Gulf (35%), India-Europe (25%), India-North America (18%), and intra-Asia (15%). The Government of India\u2019s National Logistics Policy and the NCAER Logistics Cost Index target reducing India\u2019s logistics cost from 14% to 8% of GDP by 2030, with air cargo modernization as a key pillar through the development of 35 new cargo terminals under the UDAN Regional Connectivity Scheme and the expansion of existing AAI terminals with automated cargo handling systems, X-ray screening integrated with Customs ICEGATE, and temperature-controlled pharma zones.",
  },
  {
    t: "Customs & ICEGATE: Air Cargo Clearance and Digital Transformation",
    c: "Indian Customs air cargo clearance operates through the ICEGATE (Indian Customs EDI Gateway) platform, which processes approximately 12,000-15,000 air cargo bills of entry per day across major cargo terminals, with an average clearance time of 4-8 hours for general cargo, 2-4 hours for express/e-commerce parcels, and 12-24 hours for pharma and perishable consignments requiring lab testing. The Customs clearance workflow involves: (1) Airway Bill (AWB) filing by the handling agent, (2) Import General Manifest (IGM) submission by the airline, (3) Bill of Entry (BE) filing by the CHA (Custom House Agent), (4) Risk Management System (RMS) assessment \u2014 65% of shipments are cleared on \u201cGo\u201d (no examination), 25% face \u201cNon-Intrusive Inspection\u201d (X-ray scanning), and 10% require \u201cPhysical Examination\u201d at the cargo terminal, (5) Duty assessment and payment (IGST @ 18% on most goods, plus applicable customs duty), and (6) \u201cLet Export Order\u201d (LEO) / \u201cOut of Charge\u201d (OOC) release. India\u2019s Customs has implemented the Indian Customs Single Window (ICSW) for integrated regulatory clearance, connecting 38 regulatory agencies (FSSAI for food, CDSCO for pharma, DGFT for trade policy, PQIS for plant quarantine, AQCS for animal quarantine) into a single digital platform. The average dwell time (time from arrival to release) at major Indian air cargo terminals is: Delhi T3 (18-24 hours), Mumbai CSIA (24-36 hours), Chennai MAA (20-28 hours), and Bengaluru BLR (14-20 hours). Key air cargo stakeholders report that automated Customs processing through ICEGATE has reduced documentation processing time by 60% (from 4-6 hours to 1.5-2 hours), reduced physical document handling by 85%, and improved first-attempt clearance rates from 55% to 78% over the past 5 years.",
  },
  {
    t: "Express E-commerce Air Cargo: 28% Growth and Last-Mile Integration",
    c: "India\u2019s express air cargo and e-commerce parcel segment has experienced explosive growth at 28% year-over-year in FY2024, handling approximately 1.1 million tonnes of express parcels through air cargo terminals, with major contributors being Amazon (180,000 MT through air), Flipkart (120,000 MT), BlueDart-DHL (95,000 MT), Delhivery (65,000 MT), and DTDC Express (45,000 MT). The e-commerce air cargo ecosystem operates through dedicated express processing zones at major airports (Delhi T3 Express Hub, Mumbai Express Center, Bengaluru E-com Hub), with average processing time of 2-4 hours from flight arrival to sortation center release (versus 12-24 hours for general cargo). Express air cargo carriers operating in India include BlueDart Aviation (7 Boeing 757-200F freighters, 600+ daily flights), SpiceJet Freight (12 Boeing 737-800BCF converted freighters, 350+ daily flights), IndiGo Cargo (belly cargo on 350+ daily flights), and QuikJet Cargo (4 Boeing 737-800BCF, dedicated overnight express network). The unit economics of express air cargo in India are: \u20b945-80 per kg for domestic express (within 500 km), \u20b980-150 per kg for long-haul domestic (1000+ km), and \u20b9150-350 per kg for international express. India\u2019s D2C e-commerce boom (120 million daily orders in FY2024) has created demand for dedicated midnight-to-midnight air cargo sorting hubs at Delhi, Mumbai, Bengaluru, and Hyderabad, with fully automated sorting systems handling 15,000-25,000 parcels per hour. Companies deploying integrated air-ground logistics report 40% improvement in same-day delivery rates (from 15% to 25% of orders), 35% reduction in express parcel unit costs, and 50% improvement in next-morning delivery reliability for Tier 1 city pairs.",
  },
  {
    t: "Pharma Cold Chain Air Cargo: GDP Compliance and Temperature Integrity",
    c: "India\u2019s pharmaceutical air cargo segment, handling approximately 180,000 MT of temperature-sensitive pharmaceutical products annually (\u20b954,000 crore export value), operates under stringent GDP (Good Distribution Practice) requirements mandated by the EU GDP guidelines, WHO PQ (Prequalification) standards, and India\u2019s CDSCO (Central Drugs Standard Control Organisation) regulations. The pharma cold chain air cargo infrastructure at major Indian airports includes: Delhi T3 Pharma Zone (2,500 sqm temperature-controlled area with 2-8\u00b0C and 15-25\u00b0C zones, GDP-compliant storage for 48 hours), Mumbai Pharma Hub (1,800 sqm, GDP-certified by MCC Mumbai), Bengaluru BLR Pharma Terminal (2,200 sqm with dedicated -20\u00b0C freezer section for biologics), and Hyderabad HYD Life Sciences Cargo (1,500 sqm connected to Genome Valley pharma cluster). India is the world\u2019s largest supplier of generic medicines (20% of global supply by volume) and vaccines (60% of WHO-prequalified vaccines), making temperature-controlled air cargo a critical logistics segment. Key pharma products shipped by air include: vaccines and biologics (2-8\u00b0C, 35% of pharma air cargo), API (Active Pharmaceutical Ingredients, 15-25\u00b0C, 25%), finished dosage forms (15-25\u00b0C, 20%), clinical trial materials (-20\u00b0C to -80\u00b0C, 10%), and OTC products (ambient, 10%). Temperature excursion incidents during air cargo transit average 1.2-2.5% of pharma shipments, with each excursion event costing \u20b92-15 lakh per shipment in product loss and regulatory reporting. India\u2019s leading pharma logistics providers (Kool_Ex, Snowman, Tiger Logistics) deploy IoT-enabled temperature loggers on 100% of pharma air cargo shipments, providing real-time temperature monitoring with GPS location tracking and automated alert escalation for deviations exceeding \u00b12\u00b0C from set-point. Companies with GDP-compliant air cargo operations report 98.5% temperature compliance rates, 45% reduction in cold chain excursion incidents, and 60% faster Customs clearance through pharma-specific green channels at ICEGATE.",
  },
];

export default function AirCargoTerminalView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: AWB_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "airline", label: "Airline", options: AIRLINES.map(a => ({ value: a, count: records.filter(r => r.airline === a).length })) },
    { key: "cargoType", label: "Cargo Type", options: CARGO_TYPES.map(c => ({ value: c, count: records.filter(r => r.cargoType === c).length })) },
    { key: "terminal", label: "Terminal", options: TERMINALS.map(t => ({ value: t, count: records.filter(r => r.terminal === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.awbNo.toLowerCase().includes(q) && !r.airline.toLowerCase().includes(q) && !r.shipper.toLowerCase().includes(q) && !r.consignee.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof AWBRecord] as string));
  });

  return (
    <div className="act-root p-6 space-y-6">
      <PageHeader title="Air Cargo Terminal" description="Air freight terminal operations, AWB management, cargo handling, customs clearance, cold chain pharma logistics, express e-commerce parcel processing, and DG/hazmat compliance at major Indian airports" />
      <div className="act-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`act-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-slate-700 text-white" : "text-gray-600 hover:bg-slate-100"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="act-dash space-y-6">
          <div className="act-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="act-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 act-kpi-label">{k.l}</div><div className="text-2xl font-bold text-slate-700 act-kpi-val">{k.v}</div><div className="text-xs text-gray-400 act-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="act-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Cargo Tonnage by Mode</h3><BarChart data={monthlyTonnage} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="domestic" fill="#475569" radius={[4,4,0,0]} name="Domestic" /><Bar dataKey="international" fill="#64748b" radius={[4,4,0,0]} name="International" /><Bar dataKey="express" fill="#94a3b8" radius={[4,4,0,0]} name="Express" /></BarChart></div>
            <div className="act-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cargo Type Distribution</h3><PieChart width={400} height={220}><Pie data={cargoTypeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{cargoTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="act-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Terminal Throughput vs 28K MT Target</h3><LineChart data={throughputTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[15, 40]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#475569" strokeWidth={2} name="Actual (K MT)" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="act-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Terminal Performance Score</h3><BarChart data={terminalPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[70, 100]} /><Tooltip /><Bar dataKey="v" fill="#64748b" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="act-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Air Cargo", href: "#" }, { label: "AWB Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="act-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,AWB No,Airline,Origin,Dest,Terminal,Type,Pieces,Weight (kg),Vol Wt,Value,Flight,ETA,ATA,Status,Customs,Storage,Agent,Shipper,Consignee,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Held" ? "act-row-critical bg-red-50" : r.status === "Under Customs" ? "act-row-warning bg-amber-50" : r.status === "Arrived" ? "act-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-slate-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="act-badge inline-block px-2 py-0.5 rounded text-xs bg-slate-700 text-white font-mono">{r.awbNo}</span></td>
                <td className="px-3 py-2 text-xs">{r.airline}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.origin}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.dest}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.terminal}</td>
                <td className="px-3 py-2"><span className="act-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.cargoType}</span></td>
                <td className="px-3 py-2 text-xs">{r.pieces}</td>
                <td className="px-3 py-2 text-xs">{fmtWt(r.weight)}</td>
                <td className="px-3 py-2 text-xs">{fmtWt(r.volumeWeight)}</td>
                <td className="px-3 py-2 text-xs font-semibold">{fmtVal(r.declaredValue)}</td>
                <td className="px-3 py-2 text-xs">{r.flightNo}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.eta}</td>
                <td className="px-3 py-2 text-xs">{r.ata || <span className="text-slate-400">\u2014</span>}</td>
                <td className="px-3 py-2"><span className={`act-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.customsStatus}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.storageDays > 3 ? "text-red-600" : r.storageDays > 1 ? "text-amber-600" : "text-green-600"}`}>{r.storageDays}d</span></td>
                <td className="px-3 py-2 text-xs">{r.handlingAgent}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.shipper}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.consignee}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="act-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="act-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Shipment Volume by Airline</h3><BarChart data={AIRLINES.slice(0,6).map(a => ({ n: a.split(" ")[0], v: +ri(28, 145, 72 + Math.random() * 50).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#475569" radius={[4,4,0,0]} /></BarChart></div>
            <div className="act-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cargo Volume by Trade Lane</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], gulf: ri(4200, 9500, 6500 + Math.sin(i*0.5)*1200), europe: ri(2800, 6500, 4400 + Math.cos(i*0.6)*900), americas: ri(1800, 4200, 2900 + Math.sin(i*0.7)*600) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="gulf" stackId="1" stroke="#475569" fill="#cbd5e1" name="Gulf" /><Area type="monotone" dataKey="europe" stackId="1" stroke="#64748b" fill="#94a3b8" name="Europe" /><Area type="monotone" dataKey="americas" stackId="1" stroke="#334155" fill="#e2e8f0" name="Americas" /></AreaChart></div>
          </div>
          <div className="act-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Clearance Hours by Terminal</h3><BarChart data={[{n:"DEL T3",v:18},{n:"BOM CSIA",v:24},{n:"MAA Chennai",v:20},{n:"BLR Kempe",v:14},{n:"HYD Shamsh",v:16},{n:"CCU NSCBI",v:22}].map(d => ({...d, v: +ri(d.v-3, d.v+4, d.v + Math.random()*3).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#64748b" radius={[4,4,0,0]} /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="act-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="act-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-slate-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
