"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0891b2", "#06b6d4", "#22d3ee", "#67e8f9", "#0e7490", "#155e75", "#a5f3fc", "#cffafe"];
const WAREHOUSES = ["Snowman Chennai Hub", "Kool_Ex Mumbai", "TCPL Delhi NCR", "ColdStar Bengaluru", "DHL Life Sciences HYD", "RVRL Kolkata", "Fluxsense Pune", "Speck Systems BLR"];
const PRODUCTS = ["Vaccines (2-8\u00b0C)", "Biologics (-20\u00b0C)", "Insulin (2-8\u00b0C)", "API (15-25\u00b0C)", "Clinical Trial Samples", "Blood Products", "OTC Pharma", "Diagnostics Kits"];
const SHIPMENT_STATUSES = ["In Cold Room", "In Transit", "Delivered", "Temperature Alert", "Customs Hold", "QA Rejected"];
const CARRIERS = ["BlueDart Cold Chain", "Kool_Ex Express", "Snowman Logistics", "DHL Life Sciences", "TCPL Temperature", "Delhivery Cold", "FedEx Pharma", "Gati Cold"];
const TABS = ["Dashboard", "Shipment Registry", "Temperature Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700", cyan: "bg-cyan-100 text-cyan-700" };
const statusColor: Record<string, string> = { "In Cold Room": "cyan", "In Transit": "blue", "Delivered": "green", "Temperature Alert": "red", "Customs Hold": "amber", "QA Rejected": "red" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyShipments = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], vaccines: ri(120, 280, 195 + Math.sin(i * 0.5) * 45), biologics: ri(45, 95, 68 + Math.cos(i * 0.6) * 18), insulin: ri(60, 130, 92 + Math.sin(i * 0.7) * 22), api: ri(80, 160, 118 + Math.cos(i * 0.8) * 25) }));
const productDist = [{ n: "Vaccines", v: 28 }, { n: "Biologics", v: 15 }, { n: "Insulin", v: 14 }, { n: "API", v: 18 }, { n: "Blood Products", v: 8 }, { n: "Clinical Trial", v: 6 }, { n: "OTC Pharma", v: 7 }, { n: "Diagnostics", v: 4 }];
const complianceTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], compliance: +(ri(96.5, 99.8, 98.2 + Math.sin(i * 0.4) * 0.8)).toFixed(1), target: 98.5 }));
const carrierPerf = CARRIERS.slice(0, 6).map(c => ({ n: c.split(" ")[0], v: +ri(94, 99.5, 97 + Math.random() * 1.5).toFixed(1) }));

interface ShipmentRecord { id: string; batchNo: string; product: string; warehouse: string; carrier: string; origin: string; destination: string; temperature: string; setpoint: string; qty: number; unit: string; shipDate: string; eta: string; deliveryDate: string; transitHours: number; deviationCount: number; maxDeviation: number; status: string; customsStatus: string; gdpCompliant: boolean; iotDevice: string; lastReading: string; lastTemp: number; remarks: string; }

const records: ShipmentRecord[] = [
  { id: "PCC-0001", batchNo: "VAX-COV-2025-B042", product: "Vaccines (2-8\u00b0C)", warehouse: "Snowman Chennai Hub", carrier: "BlueDart Cold Chain", origin: "Bharat Biotech Hyd", destination: "MOFW Delhi", temperature: "2-8\u00b0C", setpoint: "5\u00b0C", qty: 48000, unit: "doses", shipDate: "2025-01-10", eta: "2025-01-11", deliveryDate: "2025-01-11", transitHours: 18, deviationCount: 0, maxDeviation: 0, status: "Delivered", customsStatus: "N/A (Domestic)", gdpCompliant: true, iotDevice: "TBL-10042", lastReading: "2025-01-11 08:30", lastTemp: 5.2, remarks: "COVID booster batch - GDP compliant domestic air cargo" },
  { id: "PCC-0002", batchNo: "BIO-BFN-2025-L108", product: "Biologics (-20\u00b0C)", warehouse: "Kool_Ex Mumbai", carrier: "Kool_Ex Express", origin: "Biocon Bengaluru", destination: "FRA Frankfurt", temperature: "-20 to -15\u00b0C", setpoint: "-18\u00b0C", qty: 2400, unit: "vials", shipDate: "2025-01-08", eta: "2025-01-10", deliveryDate: "", transitHours: 48, deviationCount: 0, maxDeviation: 0, status: "In Transit", customsStatus: "Cleared EU", gdpCompliant: true, iotDevice: "CKX-22045", lastReading: "2025-01-09 22:15", lastTemp: -18.1, remarks: "Monoclonal antibody shipment - GDP EU Annex 6 compliant" },
  { id: "PCC-0003", batchNo: "INS-LIL-2025-S078", product: "Insulin (2-8\u00b0C)", warehouse: "TCPL Delhi NCR", carrier: "TCPL Temperature", origin: "Biocon Bengaluru", destination: "Medplus Distributors", temperature: "2-8\u00b0C", setpoint: "4\u00b0C", qty: 15000, unit: "pens", shipDate: "2025-01-14", eta: "2025-01-15", deliveryDate: "", transitHours: 24, deviationCount: 0, maxDeviation: 0, status: "In Cold Room", customsStatus: "N/A (Domestic)", gdpCompliant: true, iotDevice: "TPL-32018", lastReading: "2025-01-14 16:00", lastTemp: 4.3, remarks: "Insulin pen cold storage at TCPL NCR hub awaiting dispatch" },
  { id: "PCC-0004", batchNo: "API-DRR-2025-A045", product: "API (15-25\u00b0C)", warehouse: "DHL Life Sciences HYD", carrier: "DHL Life Sciences", origin: "Dr Reddys HYD", destination: "Tokyo Pharma JP", temperature: "15-25\u00b0C", setpoint: "20\u00b0C", qty: 850, unit: "kg", shipDate: "2025-01-12", eta: "2025-01-14", deliveryDate: "", transitHours: 60, deviationCount: 0, maxDeviation: 0, status: "In Transit", customsStatus: "Filed Japan", gdpCompliant: true, iotDevice: "DHL-44078", lastReading: "2025-01-13 10:45", lastTemp: 20.5, remarks: "API shipment - Japan MHLW import license filed" },
  { id: "PCC-0005", batchNo: "VAX-MMR-2025-C033", product: "Vaccines (2-8\u00b0C)", warehouse: "ColdStar Bengaluru", carrier: "Snowman Logistics", origin: "SII Pune", destination: "UNICEF Nairobi", temperature: "2-8\u00b0C", setpoint: "5\u00b0C", qty: 120000, unit: "doses", shipDate: "2025-01-07", eta: "2025-01-09", deliveryDate: "", transitHours: 72, deviationCount: 1, maxDeviation: 1.8, status: "Temperature Alert", customsStatus: "Pre-cleared KE", gdpCompliant: false, iotDevice: "SNW-55012", lastReading: "2025-01-08 14:20", lastTemp: 7.2, remarks: "MMR vaccine UNICEF supply - TEMP ALERT 7.2\u00b0C at Nairobi warehouse" },
  { id: "PCC-0006", batchNo: "BLD-RBC-2025-B022", product: "Blood Products", warehouse: "RVRL Kolkata", carrier: "Delhivery Cold", origin: "Kolkata Blood Bank", destination: "AIIMS Delhi", temperature: "1-6\u00b0C", setpoint: "4\u00b0C", qty: 120, unit: "units", shipDate: "2025-01-15", eta: "2025-01-15", deliveryDate: "2025-01-15", transitHours: 14, deviationCount: 0, maxDeviation: 0, status: "Delivered", customsStatus: "N/A (Domestic)", gdpCompliant: true, iotDevice: "DLV-66034", lastReading: "2025-01-15 18:00", lastTemp: 3.8, remarks: "Red blood cell units - emergency air transport Kolkata to Delhi" },
  { id: "PCC-0007", batchNo: "CTX-SUN-2025-T018", product: "Clinical Trial Samples", warehouse: "Fluxsense Pune", carrier: "FedEx Pharma", origin: "Sun Pharma Mumbai", destination: "Mayo Clinic USA", temperature: "-70 to -60\u00b0C", setpoint: "-65\u00b0C", qty: 480, unit: "samples", shipDate: "2025-01-11", eta: "2025-01-13", deliveryDate: "", transitHours: 72, deviationCount: 0, maxDeviation: 0, status: "Customs Hold", customsStatus: "US FDA Exam", gdpCompliant: true, iotDevice: "FDX-77091", lastReading: "2025-01-12 06:30", lastTemp: -64.8, remarks: "Clinical trial biospecimens - FDA import examination pending" },
  { id: "PCC-0008", batchNo: "OTC-CRP-2025-O056", product: "OTC Pharma", warehouse: "Speck Systems BLR", carrier: "Gati Cold", origin: "Cipla Bengaluru", destination: "Apollo Pharmacy PAN", temperature: "15-30\u00b0C", setpoint: "25\u00b0C", qty: 25000, unit: "packs", shipDate: "2025-01-14", eta: "2025-01-15", deliveryDate: "2025-01-15", transitHours: 18, deviationCount: 0, maxDeviation: 0, status: "Delivered", customsStatus: "N/A (Domestic)", gdpCompliant: true, iotDevice: "GAT-88023", lastReading: "2025-01-15 12:00", lastTemp: 24.1, remarks: "OTC cold/cough syrup distribution - ambient controlled" },
  { id: "PCC-0009", batchNo: "DGK-RAPID-2025-D012", product: "Diagnostics Kits", warehouse: "TCPL Delhi NCR", carrier: "BlueDart Cold Chain", origin: "Mylab Pune", destination: "Ministry Health Addis", temperature: "2-30\u00b0C", setpoint: "22\u00b0C", qty: 85000, unit: "kits", shipDate: "2025-01-09", eta: "2025-01-12", deliveryDate: "", transitHours: 84, deviationCount: 0, maxDeviation: 0, status: "In Transit", customsStatus: "Filed Ethiopia", gdpCompliant: true, iotDevice: "TBL-99045", lastReading: "2025-01-11 08:00", lastTemp: 22.4, remarks: "Rapid diagnostic kits Ethiopia MOH supply - WHO prequalified" },
  { id: "PCC-0010", batchNo: "VAX-HBV-2025-B067", product: "Vaccines (2-8\u00b0C)", warehouse: "Snowman Chennai Hub", carrier: "Snowman Logistics", origin: "Biological E Hyd", destination: "GAVI Dhaka", temperature: "2-8\u00b0C", setpoint: "5\u00b0C", qty: 200000, unit: "doses", shipDate: "2025-01-13", eta: "2025-01-15", deliveryDate: "", transitHours: 48, deviationCount: 2, maxDeviation: 2.4, status: "Temperature Alert", customsStatus: "Pre-cleared BD", gdpCompliant: false, iotDevice: "SNW-11056", lastReading: "2025-01-14 20:10", lastTemp: 8.1, remarks: "Hepatitis B vaccine GAVI - TEMP ALERT 8.1\u00b0C during Kolkata layover" },
  { id: "PCC-0011", batchNo: "BIO-TRZ-2025-L145", product: "Biologics (-20\u00b0C)", warehouse: "Kool_Ex Mumbai", carrier: "Kool_Ex Express", origin: "Zydus Ahmedabad", destination: "Novartis Basel", temperature: "-25 to -15\u00b0C", setpoint: "-20\u00b0C", qty: 1800, unit: "vials", shipDate: "2025-01-10", eta: "2025-01-12", deliveryDate: "2025-01-12", transitHours: 54, deviationCount: 0, maxDeviation: 0, status: "Delivered", customsStatus: "Cleared Swiss", gdpCompliant: true, iotDevice: "CKX-22078", lastReading: "2025-01-12 14:00", lastTemp: -19.5, remarks: "Biosimilar trastuzumab shipment - Swissmedic import cleared" },
  { id: "PCC-0012", batchNo: "API-ACE-2025-A089", product: "API (15-25\u00b0C)", warehouse: "DHL Life Sciences HYD", carrier: "DHL Life Sciences", origin: "Aurobindo Hyd", destination: "Teva Pharma Israel", temperature: "15-25\u00b0C", setpoint: "20\u00b0C", qty: 1200, unit: "kg", shipDate: "2025-01-15", eta: "2025-01-17", deliveryDate: "", transitHours: 66, deviationCount: 0, maxDeviation: 0, status: "In Transit", customsStatus: "Filed Israel", gdpCompliant: true, iotDevice: "DHL-44102", lastReading: "2025-01-16 04:00", lastTemp: 20.8, remarks: "API acetaminophen shipment - Israeli MOH pre-approved" },
  { id: "PCC-0013", batchNo: "VAX-FLU-2025-B098", product: "Vaccines (2-8\u00b0C)", warehouse: "ColdStar Bengaluru", carrier: "BlueDart Cold Chain", origin: "HLL BioThiru", destination: "NHM Kerala", temperature: "2-8\u00b0C", setpoint: "5\u00b0C", qty: 65000, unit: "doses", shipDate: "2025-01-14", eta: "2025-01-14", deliveryDate: "", transitHours: 8, deviationCount: 0, maxDeviation: 0, status: "In Cold Room", customsStatus: "N/A (Domestic)", gdpCompliant: true, iotDevice: "TBL-10067", lastReading: "2025-01-14 15:00", lastTemp: 4.8, remarks: "Flu vaccine NHM Kerala allocation - cold room staging BLR hub" },
  { id: "PCC-0014", batchNo: "INS-NOV-2025-S102", product: "Insulin (2-8\u00b0C)", warehouse: "TCPL Delhi NCR", carrier: "FedEx Pharma", origin: "Novo Nordisk BLR", destination: "Walgreens UK", temperature: "2-8\u00b0C", setpoint: "4\u00b0C", qty: 28000, unit: "pens", shipDate: "2025-01-12", eta: "2025-01-14", deliveryDate: "", transitHours: 54, deviationCount: 0, maxDeviation: 0, status: "In Transit", customsStatus: "Filed UK MHRA", gdpCompliant: true, iotDevice: "FDX-77112", lastReading: "2025-01-13 18:30", lastTemp: 4.1, remarks: "Insulin pens UK supply - MHRA GDP warehouse release pending" },
];

const coldRoomCount = records.filter(r => r.status === "In Cold Room" || r.status === "Customs Hold").length;
const transitCount = records.filter(r => r.status === "In Transit").length;
const alertCount = records.filter(r => r.status === "Temperature Alert" || r.status === "QA Rejected").length;
const deliveredCount = records.filter(r => r.status === "Delivered").length;

const kpis = [
  { l: "In Cold Room / Hold", v: coldRoomCount, s: "staged or pending" },
  { l: "In Transit", v: transitCount, s: "active shipments" },
  { l: "Temp Alert / Rejected", v: alertCount, s: "requires attention" },
  { l: "Delivered", v: deliveredCount, s: "completed shipments" },
];

const INSIGHTS = [
  {
    t: "India Pharma Cold Chain: \u20b954,000 Crore Export Ecosystem",
    c: "India\u2019s pharmaceutical cold chain logistics market is valued at approximately \u20b954,000 crore (USD 6.5 billion) in FY2024, making it the world\u2019s third-largest pharmaceutical cold chain ecosystem after the United States and Germany. India is the largest supplier of generic medicines globally (20% of global volume), the world\u2019s largest vaccine manufacturer (60% of WHO-prequalified vaccines produced by Serum Institute of India, Bharat Biotech, and Biological E), and a major exporter of biologics and biosimilars. The pharma cold chain handles approximately 280,000+ temperature-controlled shipments annually across domestic and international routes, with temperature requirements spanning ambient (15-25\u00b0C for APIs), refrigerated (2-8\u00b0C for vaccines, insulin, blood products), cold (-20\u00b0C for biologics), and ultra-cold (-70\u00b0C for mRNA vaccines and clinical trial materials). India\u2019s pharma cold chain infrastructure includes: 1,200+ temperature-controlled warehouses (cold rooms, freezer rooms, and blast freezers), 85+ GDP-certified cold chain logistics providers (Kool_Ex, Snowman Logistics, TCPL, DHL Life Sciences, BlueDart Temperature Control), and 350+ refrigerated vehicles operating on domestic routes. The cold chain covers the entire pharmaceutical supply chain from API manufacturing (Hyderabad, Ahmedabad, Mumbai) through formulation and packaging (Bengaluru, Pune, Sikkim) to distribution centers and last-mile delivery to hospitals, pharmacies, and vaccination centers. India\u2019s vaccine cold chain for the Universal Immunization Programme (UIP) covers 27 million children and 30 million pregnant women annually through 27,000+ cold chain points across 785+ districts, managed by the National Cold Chain and Vaccine Management Resource Centre (NCCVMRC).",
  },
  {
    t: "GDP Compliance and CDSCO Regulatory Framework for Cold Chain",
    c: "India\u2019s pharmaceutical cold chain operates under the Goods Distribution Practice (GDP) guidelines mandated by the Central Drugs Standard Control Organisation (CDSCO), India\u2019s national regulatory authority under the Ministry of Health and Family Welfare. The GDP compliance framework in India is aligned with WHO TRS 961 Annex 9 (Good Distribution Practices) and EU GDP Guidelines (2013/C 343/01), requiring pharmaceutical companies and cold chain logistics providers to maintain: (1) validated temperature-controlled storage and transport systems (qualifications: IQ/OQ/PQ protocols), (2) temperature monitoring at every stage of the supply chain using calibrated IoT sensors and data loggers (accuracy \u00b10.5\u00b0C, recording interval every 5 minutes), (3) deviation management protocols with documented CAPA (Corrective and Preventive Action) for temperature excursions exceeding \u00b12\u00b0C from set-point, (4) documented standard operating procedures (SOPs) for receiving, storage, picking, packing, and shipping of temperature-sensitive products, (5) validated packaging systems (qualified insulated shipper boxes with gel packs, dry ice, or phase change materials), (6) personnel training on GDP requirements and cold chain handling, and (7) traceability systems with full lot-level tracking from manufacturer to patient. CDSCO\u2019s Schedule M and Schedule U of the Drugs and Cosmetics Act mandate temperature monitoring records for all pharmaceutical distribution. The average GDP compliance audit cycle is 12 months for major logistics providers, with CDSCO inspections covering storage facility qualification, temperature mapping, equipment calibration records, deviation investigation reports, and training documentation. India\u2019s GDP compliance rate among Tier 1 cold chain providers is 96.8% (FY2024), with key gaps in Tier 2/3 regional distributors where compliance drops to 72%. The Ministry has introduced a digital GDP portal for online submission of temperature monitoring data, deviation reports, and compliance certificates.",
  },
  {
    t: "IoT-Enabled Cold Chain Monitoring and Temperature Excursion Management",
    c: "India\u2019s pharma cold chain has rapidly adopted IoT-enabled temperature monitoring systems, with approximately 85% of domestic shipments and 98% of international export shipments monitored by real-time IoT devices in FY2024. The leading IoT cold chain monitoring platforms deployed in India include: (1) Controlant (Iceland-India) with 15,000+ data loggers in India providing real-time GPS and temperature tracking, (2) Temptime (US-India) USB-style indicators used by UNICEF and WHO for vaccine shipments, (3)Berlinger (Switzerland) electronic monitoring devices for clinical trial materials, (4) Tive (US) cellular-connected trackers for international pharma logistics, and (5) indigenous Indian solutions by Senzo, Raptus, and CryogenX providing low-cost GSM-connected loggers at \u20b9850-1,200 per device per shipment. These IoT devices provide: real-time temperature readings (sampling every 5 minutes), GPS location tracking with geofencing alerts, humidity monitoring (for sensitive biologics), shock/vibration detection (for fragile vaccine vials), light exposure monitoring (for photosensitive products), and automated SMS/email alerts for temperature deviations. The average temperature excursion rate in India\u2019s pharma cold chain is 1.8-2.5% of total shipments, with each excursion costing \u20b92-15 lakh in product loss, regulatory reporting requirements (to CDSCO/NPPA), and potential patient safety risks. Companies deploying comprehensive IoT monitoring report: 45% reduction in cold chain excursion incidents, 60% faster deviation investigation (from 72 hours to 28 hours average), 35% reduction in insurance claims, and 25% improvement in customer confidence scores. The Government of India\u2019s Digital Health Mission includes a National Cold Chain Management System (NCCMS) integrating IoT data from all UIP vaccine storage points for centralized monitoring of vaccine potency and cold chain integrity.",
  },
  {
    t: "Vaccine Cold Chain and Ultra-Cold mRNA Logistics: UNICEF, GAVI, COVAX",
    c: "India\u2019s role as the global vaccine manufacturing hub requires sophisticated cold chain logistics capabilities spanning 2-8\u00b0C (conventional vaccines), -20\u00b0C (some IPV and MMR vaccines), and -70\u00b0C (mRNA COVID-19 vaccines during the pandemic peak). During the COVID-19 pandemic, India deployed an unprecedented vaccine cold chain operation: 2.2 billion doses of COVID-19 vaccines distributed across 785+ districts through 27,000+ cold chain points, using a combination of conventional ice-lined refrigerators (ILRs), cold boxes, vaccine carriers, and specialized ultra-cold storage at 85+ locations (Thermo Fisher ultra-low freezers, -80\u00b0C). India\u2019s vaccine export cold chain, primarily through UNICEF Supply Division and GAVI Alliance, ships approximately 150-200 million vaccine doses annually to 150+ countries, requiring: (1) pre-shipment temperature mapping of cold rooms (2-8\u00b0C maintained for 48 hours before packing), (2) validated insulated shipper boxes with conditioned gel packs or PCM packs, (3) continuous temperature monitoring using Temptime or Controlant loggers throughout the 5-15 day international transit, (4) destination country customs clearance with GDP documentation, and (5) last-mile distribution from national vaccine stores to state/district cold chain points. Key Indian vaccine cold chain data points: (1) Serum Institute of India (SII) ships 1.5 billion+ doses annually using 12+ dedicated cold chain lanes, (2) Bharat Biotech maintains 4 cold chain hubs with GDP-certified storage for 50 million doses, (3) Biological E operates 8 cold rooms at its Hyderabad facility with 100 million dose staging capacity. The COVAX initiative during 2021-2023 used India\u2019s cold chain infrastructure to distribute 660 million doses to 102 countries, with India operating as both a manufacturing hub and a regional distribution hub. Post-pandemic, India\u2019s vaccine cold chain is being upgraded with: solar-powered cold rooms for off-grid health centers (1,200 units deployed), IoT-based national vaccine tracking system (e-VIN covering 100% of UIP sessions), and last-mile drone delivery trials for vaccine supply to remote hill and island areas (200+ successful drone flights in Northeast India, Andaman Islands, and Lakshadweep).",
  },
];

export default function PharmaColdChainView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "product", label: "Product Type", options: PRODUCTS.map(p => ({ value: p, count: records.filter(r => r.product === p).length })) },
    { key: "carrier", label: "Carrier", options: CARRIERS.map(c => ({ value: c, count: records.filter(r => r.carrier === c).length })) },
    { key: "warehouse", label: "Warehouse", options: WAREHOUSES.map(w => ({ value: w, count: records.filter(r => r.warehouse === w).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.product.toLowerCase().includes(q) && !r.origin.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ShipmentRecord] as string));
  });

  return (
    <div className="pcc-root p-6 space-y-6">
      <PageHeader title="Pharma Cold Chain" description="Pharmaceutical temperature-controlled logistics, GDP-compliant cold chain operations, IoT-enabled temperature monitoring, vaccine distribution, biologics transport, and regulatory compliance for India\u2019s \u20b954,000 crore pharma logistics ecosystem" />
      <div className="pcc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`pcc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-cyan-700 text-white" : "text-gray-600 hover:bg-cyan-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="pcc-dash space-y-6">
          <div className="pcc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="pcc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 pcc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-cyan-700 pcc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 pcc-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="pcc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Shipments by Product</h3><BarChart data={monthlyShipments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="vaccines" fill="#0891b2" radius={[4,4,0,0]} name="Vaccines" /><Bar dataKey="biologics" fill="#06b6d4" radius={[4,4,0,0]} name="Biologics" /><Bar dataKey="insulin" fill="#22d3ee" radius={[4,4,0,0]} name="Insulin" /><Bar dataKey="api" fill="#67e8f9" radius={[4,4,0,0]} name="API" /></BarChart></div>
            <div className="pcc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Product Type Distribution</h3><PieChart width={400} height={220}><Pie data={productDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{productDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="pcc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">GDP Compliance Rate (%) vs 98.5% Target</h3><LineChart data={complianceTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[95, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="compliance" stroke="#0891b2" strokeWidth={2} name="Compliance %" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="pcc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Carrier Temperature Compliance (%)</h3><BarChart data={carrierPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[92, 100]} /><Tooltip /><Bar dataKey="v" fill="#06b6d4" radius={[4,4,0,0]} name="Compliance %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="pcc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Pharma Cold Chain", href: "#" }, { label: "Shipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="pcc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Batch No,Product,Warehouse,Carrier,Origin,Dest,Temp,Qty,Ship Date,ETA,Transit (h),Status,Deviation,GDP,Device,Last Temp,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Temperature Alert" || r.status === "QA Rejected" ? "pcc-row-critical bg-red-50" : r.status === "Customs Hold" ? "pcc-row-warning bg-amber-50" : r.status === "In Transit" ? "pcc-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-cyan-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="pcc-badge inline-block px-2 py-0.5 rounded text-xs bg-cyan-700 text-white font-mono">{r.batchNo}</span></td>
                <td className="px-3 py-2"><span className="pcc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.product}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.warehouse}</td>
                <td className="px-3 py-2 text-xs">{r.carrier}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.destination}</td>
                <td className="px-3 py-2 text-xs font-mono">{r.temperature}</td>
                <td className="px-3 py-2 text-xs text-right">{r.qty.toLocaleString()} {r.unit}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitHours > 60 ? "text-red-600" : r.transitHours > 24 ? "text-amber-600" : "text-green-600"}`}>{r.transitHours}h</span></td>
                <td className="px-3 py-2"><span className={`pcc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-center"><span className={`text-xs font-semibold ${r.deviationCount > 0 ? "text-red-600" : "text-green-600"}`}>{r.deviationCount}</span></td>
                <td className="px-3 py-2 text-center">{r.gdpCompliant ? <span className="pcc-badge inline-block px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 font-semibold">GDP</span> : <span className="pcc-badge inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-semibold">Non-GDP</span>}</td>
                <td className="px-3 py-2 text-xs font-mono">{r.iotDevice}</td>
                <td className="px-3 py-2"><span className={`text-xs font-bold font-mono ${r.lastTemp > 8 ? "text-red-600" : r.lastTemp < -25 ? "text-blue-600" : "text-green-600"}`}>{r.lastTemp}\u00b0C</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="pcc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="pcc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Shipment Volume by Carrier</h3><BarChart data={CARRIERS.slice(0,6).map(c => ({ n: c.split(" ")[0], v: +ri(28, 135, 72 + Math.random() * 45).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0891b2" radius={[4,4,0,0]} name="Shipments" /></BarChart></div>
            <div className="pcc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Temperature Profile by Warehouse</h3><AreaChart data={WAREHOUSES.slice(0,6).map(w => ({ n: w.split(" ")[0], v: +ri(96, 99.8, 98 + Math.random() * 1.5).toFixed(1) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[94, 100]} /><Tooltip /><Area type="monotone" dataKey="v" stroke="#0891b2" fill="#cffafe" name="Compliance %" /></AreaChart></div>
          </div>
          <div className="pcc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Hours by Destination Region</h3><BarChart data={[{n:"Domestic",v:18},{n:"Gulf",v:42},{n:"SE Asia",v:48},{n:"Europe",v:54},{n:"Africa",v:72},{n:"Americas",v:78}].map(d => ({...d, v: +ri(d.v-6, d.v+8, d.v + Math.random()*6).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#06b6d4" radius={[4,4,0,0]} name="Hours" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="pcc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="pcc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-cyan-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
