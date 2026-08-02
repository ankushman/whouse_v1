"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#92400e", "#b45309", "#d97706", "#f59e0b", "#78350f", "#451a03", "#fbbf24", "#fde68a"];
const PLANTS = ["UltraTech Adityapur", "ACC Wadi Plant", "Ambuja Ropar Punjab", "Shree Cement Beawar", "Dalmia Rajgangpur", "Ramco Chennai", "India Cements Sankari", "JK Cement Nimbahera"];
const PRODUCTS = ["OPC 53 Grade", "OPC 43 Grade", "PPC (Fly Ash)", "PSC (Slag)", "White Cement", "Ready Mix Concrete", "Bulk Cement", "Clinker"];
const ORDER_STATUSES = ["Dispatched", "In Transit", "Delivered", "Pending Loading", "Quality Hold", "Returned"];
const MODES = ["Rail Rake", "Truck (Bulk)", "Truck (Bagged)", "Ship / Coastal", "Conveyor", "Pipeline"];
const STATES = ["Rajasthan", "Madhya Pradesh", "Chhattisgarh", "Tamil Nadu", "Andhra Pradesh", "Punjab", "Karnataka", "Odisha"];
const TABS = ["Dashboard", "Dispatch Registry", "Logistics Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Dispatched": "blue", "In Transit": "blue", "Delivered": "green", "Pending Loading": "slate", "Quality Hold": "red", "Returned": "orange" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyDespatches = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], opc: ri(2800, 5200, 3800 + Math.sin(i * 0.5) * 800), ppc: ri(2200, 4500, 3200 + Math.cos(i * 0.6) * 700), psc: ri(800, 1800, 1200 + Math.sin(i * 0.7) * 300), rmc: ri(400, 900, 620 + Math.cos(i * 0.8) * 150) }));
const productDist = [{ n: "OPC 53", v: 32 }, { n: "PPC", v: 28 }, { n: "OPC 43", v: 15 }, { n: "PSC", v: 10 }, { n: "RMC", v: 7 }, { n: "White Cement", v: 3 }, { n: "Bulk Cement", v: 3 }, { n: "Clinker", v: 2 }];
const utilTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(68, 92, 78 + Math.sin(i * 0.4) * 8)).toFixed(1), target: 82.0 }));
const plantPerf = PLANTS.slice(0, 6).map(p => ({ n: p.split(" ")[0], v: +ri(72, 96, 84 + Math.random() * 8).toFixed(0) }));

interface DispatchRecord { id: string; orderNo: string; plant: string; product: string; grade: string; quantity: number; unit: string; customer: string; destination: string; state: string; mode: string; dispatchDate: string; eta: string; deliveryDate: string; transitDays: number; vehicleNo: string; driver: string; status: string; invoiceValue: number; bagCondition: string; remarks: string; }

const records: DispatchRecord[] = [
  { id: "CLC-0001", orderNo: "ORD-UT-2025-0452", plant: "UltraTech Adityapur", product: "OPC 53 Grade", grade: "53 Grade OPC", quantity: 52000, unit: "bags", customer: "L&T Hyderabad Metro", destination: "Hyderabad Metro Site", state: "Andhra Pradesh", mode: "Rail Rake", dispatchDate: "2025-01-10", eta: "2025-01-12", deliveryDate: "", transitDays: 3, vehicleNo: "RKN/2025/1842", driver: "Rail Crew IR", status: "In Transit", invoiceValue: 15600000, bagCondition: "Good", remarks: "OPC 53 rail rake to L&T metro project - 2,600 MT" },
  { id: "CLC-0002", orderNo: "ORD-ACC-2025-0388", plant: "ACC Wadi Plant", product: "PPC (Fly Ash)", grade: "PPC 43 Grade", quantity: 38000, unit: "bags", customer: "Prestige Constructions", destination: "Prestige Shantiniketan BLR", state: "Karnataka", mode: "Truck (Bulk)", dispatchDate: "2025-01-08", eta: "2025-01-09", deliveryDate: "2025-01-09", transitDays: 1, vehicleNo: "KA-05-AB-1234", driver: "Ravi Kumar", status: "Delivered", invoiceValue: 9500000, bagCondition: "Good", remarks: "PPC bulk cement for Prestige Bengaluru project" },
  { id: "CLC-0003", orderNo: "ORD-AMB-2025-0510", plant: "Ambuja Ropar Punjab", product: "OPC 53 Grade", grade: "53 Grade OPC", quantity: 42000, unit: "bags", customer: "NHAI Delhi-Amritsar", destination: "NH-44 Widening Site", state: "Punjab", mode: "Truck (Bagged)", dispatchDate: "2025-01-14", eta: "2025-01-15", deliveryDate: "", transitDays: 1, vehicleNo: "PB-11-CD-5678", driver: "Harpreet Singh", status: "In Transit", invoiceValue: 12600000, bagCondition: "Good", remarks: "OPC 53 for NHAI highway widening - 840 MT bagged" },
  { id: "CLC-0004", orderNo: "ORD-SRC-2025-0478", plant: "Shree Cement Beawar", product: "PSC (Slag)", grade: "PSC 53 Grade", quantity: 28000, unit: "bags", customer: "DMRC Phase IV", destination: "DMRC Mukherjee Nagar", state: "Rajasthan", mode: "Rail Rake", dispatchDate: "2025-01-12", eta: "2025-01-13", deliveryDate: "2025-01-13", transitDays: 1, vehicleNo: "RKN/2025/1905", driver: "Rail Crew NWR", status: "Delivered", invoiceValue: 8400000, bagCondition: "Good", remarks: "PSC slag cement for DMRC tunnel lining - 1,400 MT" },
  { id: "CLC-0005", orderNo: "ORD-DAL-2025-0295", plant: "Dalmia Rajgangpur", product: "OPC 43 Grade", grade: "43 Grade OPC", quantity: 35000, unit: "bags", customer: "Tata Steel Kalinganagar", destination: "Tata Steel Township", state: "Odisha", mode: "Truck (Bulk)", dispatchDate: "2025-01-13", eta: "2025-01-14", deliveryDate: "", transitDays: 2, vehicleNo: "OD-08-EF-9012", driver: "Dilip Sahoo", status: "In Transit", invoiceValue: 8750000, bagCondition: "Good", remarks: "OPC 43 for Tata Steel township construction" },
  { id: "CLC-0006", orderNo: "ORD-RMC-2025-0534", plant: "Ramco Chennai", product: "Ready Mix Concrete", grade: "M35 RMC", quantity: 4500, unit: "cum", customer: "India Builders Chennai", destination: "Guindy IT Park Site", state: "Tamil Nadu", mode: "Truck (Bulk)", dispatchDate: "2025-01-15", eta: "2025-01-15", deliveryDate: "", transitDays: 0, vehicleNo: "TN-04-GH-3456", driver: "Karthik Raja", status: "Dispatched", invoiceValue: 5400000, bagCondition: "N/A (Liquid)", remarks: "RMC M35 transit mixer batch - 45 trips 100 cum each" },
  { id: "CLC-0007", orderNo: "ORD-ICL-2025-0412", plant: "India Cements Sankari", product: "OPC 53 Grade", grade: "53 Grade OPC", quantity: 24000, unit: "bags", customer: "IRD Thoothukudi Port", destination: "Port Expansion Site", state: "Tamil Nadu", mode: "Ship / Coastal", dispatchDate: "2025-01-11", eta: "2025-01-14", deliveryDate: "2025-01-14", transitDays: 3, vehicleNo: "MV Coromandel", driver: "Ship Crew", status: "Delivered", invoiceValue: 7200000, bagCondition: "Good", remarks: "OPC 53 coastal shipment to Tuticorin port - 1,200 MT" },
  { id: "CLC-0008", orderNo: "ORD-JKC-2025-0468", plant: "JK Cement Nimbahera", product: "White Cement", grade: "White PPC", quantity: 8000, unit: "bags", customer: "Aparna Interiors Hyd", destination: "Aparna Cyber Pearl", state: "Andhra Pradesh", mode: "Truck (Bagged)", dispatchDate: "2025-01-14", eta: "2025-01-15", deliveryDate: "", transitDays: 2, vehicleNo: "RJ-14-IJ-7890", driver: "Mohan Lal", status: "In Transit", invoiceValue: 6400000, bagCondition: "Good", remarks: "White PPC for Aparna mall flooring - 200 MT" },
  { id: "CLC-0009", orderNo: "ORD-UT-2025-0556", plant: "UltraTech Adityapur", product: "PPC (Fly Ash)", grade: "PPC 43 Grade", quantity: 48000, unit: "bags", customer: "DLF Gurgaon Phase V", destination: "DLF Cyber City", state: "Rajasthan", mode: "Rail Rake", dispatchDate: "2025-01-15", eta: "2025-01-17", deliveryDate: "", transitDays: 3, vehicleNo: "RKN/2025/1920", driver: "Rail Crew CR", status: "Dispatched", invoiceValue: 12000000, bagCondition: "Good", remarks: "PPC rail rake for DLF Gurgaon - 2,400 MT" },
  { id: "CLC-0010", orderNo: "ORD-ACC-2025-0405", plant: "ACC Wadi Plant", product: "Bulk Cement", grade: "Bulk OPC 53", quantity: 125000, unit: "bags", customer: "Afcons Mumbai Trans", destination: "Mumbai Trans Harbor", state: "Karnataka", mode: "Ship / Coastal", dispatchDate: "2025-01-09", eta: "2025-01-13", deliveryDate: "", transitDays: 4, vehicleNo: "MV V.O. Chidambaranar", driver: "Ship Crew", status: "In Transit", invoiceValue: 31250000, bagCondition: "N/A (Bulk)", remarks: "Bulk cement coastal for Mumbai Trans Harbor Link - 6,250 MT" },
  { id: "CLC-0011", orderNo: "ORD-AMB-2025-0528", plant: "Ambuja Ropar Punjab", product: "OPC 53 Grade", grade: "53 Grade OPC", quantity: 18000, unit: "bags", customer: "HPCL Bathinda Refinery", destination: "Refinery Expansion", state: "Punjab", mode: "Truck (Bulk)", dispatchDate: "2025-01-13", eta: "2025-01-13", deliveryDate: "", transitDays: 0, vehicleNo: "PB-10-KL-2345", driver: "Gurpreet Kaur", status: "Pending Loading", invoiceValue: 5400000, bagCondition: "Good", remarks: "OPC 53 for HPCL refinery - loading pending at plant silo" },
  { id: "CLC-0012", orderNo: "ORD-SRC-2025-0498", plant: "Shree Cement Beawar", product: "Clinker", grade: "Clinker 42.5", quantity: 85000, unit: "bags", customer: "Grasim RMC Bhiwadi", destination: "Grasim Grinding Unit", state: "Rajasthan", mode: "Rail Rake", dispatchDate: "2025-01-07", eta: "2025-01-08", deliveryDate: "2025-01-08", transitDays: 1, vehicleNo: "RKN/2025/1888", driver: "Rail Crew NWR", status: "Delivered", invoiceValue: 12750000, bagCondition: "N/A (Bulk)", remarks: "Clinker rake for Grasim grinding unit - 4,250 MT" },
  { id: "CLC-0013", orderNo: "ORD-DAL-2025-0315", plant: "Dalmia Rajgangpur", product: "PPC (Fly Ash)", grade: "PPC 43 Grade", quantity: 32000, unit: "bags", customer: "NTPC Talcher", destination: "NTPC Township", state: "Odisha", mode: "Truck (Bagged)", dispatchDate: "2025-01-12", eta: "2025-01-13", deliveryDate: "", transitDays: 1, vehicleNo: "OD-08-MN-5678", driver: "Suresh Nayak", status: "Quality Hold", invoiceValue: 8000000, bagCondition: "Damaged", remarks: "PPC bags moisture damage - quality hold for inspection" },
  { id: "CLC-0014", orderNo: "ORD-RMC-2025-0550", plant: "Ramco Chennai", product: "OPC 43 Grade", grade: "43 Grade OPC", quantity: 22000, unit: "bags", customer: "IRCF Chennai Port", destination: "Chennai Port Trust", state: "Tamil Nadu", mode: "Truck (Bulk)", dispatchDate: "2025-01-14", eta: "2025-01-14", deliveryDate: "2025-01-14", transitDays: 0, vehicleNo: "TN-04-OP-8901", driver: "Senthil Kumar", status: "Delivered", invoiceValue: 5500000, bagCondition: "Good", remarks: "OPC 43 for Chennai Port warehouse - local delivery" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Dispatched").length;
const holdCount = records.filter(r => r.status === "Quality Hold" || r.status === "Pending Loading").length;
const deliveredCount = records.filter(r => r.status === "Delivered").length;
const totalInvoiceValue = records.reduce((s, r) => s + r.invoiceValue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

const kpis = [
  { l: "Dispatched / Transit", v: transitCount, s: "active consignments" },
  { l: "Hold / Pending", v: holdCount, s: "requires action" },
  { l: "Delivered", v: deliveredCount, s: "completed orders" },
  { l: "Total Invoice Value", v: fmtVal(totalInvoiceValue), s: "across all dispatches" },
];

const INSIGHTS = [
  {
    t: "India Cement Industry: 580 MT Capacity and \u20b93.5 Lakh Crore Market",
    c: "India is the world\u2019s second-largest cement producer with an installed capacity of approximately 580 million tonnes per annum (MTPA) as of FY2024, producing 380 million tonnes of cement annually. The Indian cement market is valued at approximately \u20b93.5 lakh crore (USD 42 billion), with demand growing at 6-8% CAGR driven by infrastructure spending (NIP \u20b9111 lakh crore), housing construction (PM Awas Yojana 2.0 targeting 3 crore houses), and commercial real estate. India\u2019s top cement producers by installed capacity are: UltraTech Cement (142 MTPA, 24% market share, part of Aditya Birla Group), Holcim India (ACC + Ambuja, 72 MTPA, 12%), Shree Cement (55 MTPA, 9.5%), Dalmia Cement (48 MTPA, 8.3%), Ramco Cements (24 MTPA, 4.1%), JK Cement (19 MTPA, 3.3%), India Cements (16 MTPA, 2.8%), and Birla Corporation (20 MTPA, 3.4%). The industry uses 5 transport modes for cement distribution: rail (32% of dispatches, preferred for long-haul &gt;300 km), road truck (48%, last-mile and short-haul), coastal shipping (5%, emerging mode), and conveyor/pipeline (3%, captive power plant and captive cement plants). The average cement dispatch lead is 250-400 km, with the average delivery turnaround time of 2-4 days for domestic orders. The Indian government\u2019s Bureau of Energy Efficiency (BEE) has mandated the Perform, Achieve and Trade (PAT) scheme for cement plants, requiring 4.5% energy intensity reduction over 3 years, driving adoption of waste heat recovery systems (WHRS), solar power, and alternative fuels (AFR) including municipal solid waste and biomass. The Ready-Mix Concrete (RMC) segment is growing at 15-18% CAGR, with 1,200+ RMC plants operating across 250+ cities in India.",
  },
  {
    t: "Cement Logistics: Rail Rake, Bulk Trucking, and Coastal Distribution",
    c: "India\u2019s cement logistics is a complex multi-modal supply chain handling approximately 380 million tonnes of cement and clinker annually, costing approximately \u20b945,000 crore in logistics expenditure (12-14% of cement industry revenue). The logistics chain from clinker production at integrated plants to cement dispatch involves: (1) Clinker production at integrated plants (limestone mining, kiln firing, clinker grinding), (2) Cement grinding at split grinding units (SGUs) located near consumption centers, (3) Bulk cement dispatch via rail rakes (50-60 wagons, 2,500-3,000 MT per rake, rail logistics cost \u20b91,200-1,500 per tonne for 500 km haul), (4) Bagged cement dispatch via road trucks (25-30 MT per truck, road logistics cost \u20b92,500-3,500 per tonne for 200 km haul), (5) Ready-Mix Concrete dispatch via transit mixers (6-8 cum per mixer, 30-minute delivery window, cost \u20b96,500-8,000 per cubic meter including material and delivery), and (6) Coastal shipping for port-based plants (ship capacity 5,000-15,000 MT, cost \u20b9800-1,200 per tonne for 800 km). Rail rake logistics is the most cost-effective mode for long-haul cement dispatch, saving 35-40% over road transport for distances exceeding 300 km. Indian Railways operates dedicated cement freight corridors from Rajasthan/Gujarat plants to North India, and from South Indian plants to East India. The average rail rake turnaround time for cement is 8-12 days (target: 7 days), with key bottlenecks at plant sidings and destination railway yards. The Bulk Cement Terminal (BCT) concept, promoted by CONCOR and private operators, allows cement unloading from rail to bulk silos, reducing bag handling costs by 60% and delivery time by 40%. Coastal shipping is emerging as a viable mode with Indian players like Vedanta, JSW, and Dalmia operating 12+ cement clinker terminals on the western and eastern coasts.",
  },
  {
    t: "Cement Quality Standards: BIS, ISI Mark, and Green Rating",
    c: "India\u2019s cement quality is regulated by the Bureau of Indian Standards (BIS) under IS 269:2023 (OPC), IS 1489:2023 (PPC/PSC), IS 8041:2023 (Sulphate Resisting Cement), and IS 12269:2023 (53 Grade OPC). Every bag of cement sold in India must carry the ISI certification mark, with quality parameters including: (1) Compressive strength at 3, 7, and 28 days (53 Grade: minimum 53 MPa at 28 days, 43 Grade: 43 MPa), (2) Fineness (Blaine surface area 225-350 m2/kg), (3) Initial and final setting time (30-600 minutes), (4) Soundness (Le Chatelier expansion maximum 10 mm), (5) Chloride content (maximum 0.10%), and (6) Alkali content (maximum 0.60% Na2O equivalent). The Quality Council of India (QCI) and National Accreditation Board for Testing and Calibration Laboratories (NABL) accredit cement testing laboratories, with each plant maintaining an in-house lab testing 50+ parameters per batch. The Green Rating for Integrated Habitat Assessment (GRIHA) and Indian Green Building Council (IGBC) certification systems give preference to: (1) PPC over OPC (higher fly ash/slag utilization), (2) blended cements (PPC minimum 25% fly ash, PSC minimum 70% slag), (3) low-carbon cement (LC3 technology reducing CO2 by 30%), and (4) certified green plants. India\u2019s cement industry emits approximately 350 kg CO2 per tonne of cement (world average: 630 kg/t), with leading companies like Dalmia targeting carbon-negative operations by 2040. Quality hold events in cement logistics occur primarily due to: moisture ingress (65% of quality holds), bag damage during transit (20%), and temperature exposure during summer months (15%), with average quality hold resolution time of 48-72 hours.",
  },
  {
    t: "Digital Cement Dispatch: ERP Integration, E-way Bill, and Fleet Management",
    c: "India\u2019s cement dispatch operations have been digitized through integration of ERP systems (SAP S/4HANA, Oracle ERP), government e-way bill systems, and IoT-enabled fleet management platforms. The typical digital dispatch workflow: (1) Customer order creation in ERP with product, quantity, delivery address, and delivery date, (2) Production scheduling and plant inventory allocation (silos hold 5,000-15,000 MT per plant), (3) Load-out scheduling with fleet optimization (rail rake placement, truck dispatch sequence, RMC transit mixer allocation), (4) E-way bill generation under GST (valid for 1 day per 100 km, up to 15 days maximum for cement), (5) Weighbridge integration (automated weighing with RFID-based truck identification, tolerance \u00b120 kg), (6) Quality certificate generation (mill test certificate with BIS parameters), (7) GPS-based vehicle tracking (real-time ETA updates to customer), and (8) Digital proof of delivery (ePOD with photo, GPS coordinates, and digital signature). Leading Indian cement companies report: (1) 85-92% order-to-delivery digital adoption, (2) 40% reduction in dispatch cycle time through ERP automation, (3) 25% improvement in fleet utilization through IoT tracking, (4) 60% reduction in delivery disputes through ePOD, and (5) 35% reduction in e-way bill compliance issues through automated GST integration. The Cement Manufacturers Association (CMA) is piloting a blockchain-based cement traceability platform covering 15 plants and 500+ dealers, enabling end-to-end lot tracking from raw material to customer delivery. Fleet management companies serving the cement industry (L logistical, Rivigo, BlackBuck, Moovo) deploy 50,000+ GPS-connected trucks for cement transport, providing predictive maintenance alerts, driver behavior scoring, and fuel analytics reducing per-km cost by 8-12%.",
  },
];

export default function CementLogisticsCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: ORDER_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "product", label: "Product", options: PRODUCTS.map(p => ({ value: p, count: records.filter(r => r.product === p).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(r => r.mode === m).length })) },
    { key: "state", label: "State", options: STATES.map(s => ({ value: s, count: records.filter(r => r.state === s).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.orderNo.toLowerCase().includes(q) && !r.customer.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q) && !r.plant.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof DispatchRecord] as string));
  });

  return (
    <div className="cmt-root p-6 space-y-6">
      <PageHeader title="Cement Logistics Command" description="India cement dispatch operations, integrated plant-to-customer logistics, rail rake and trucking fleet management, quality control tracking, and multi-modal distribution for 580 MTPA cement industry covering OPC/PPC/PSC/RMC" />
      <div className="cmt-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`cmt-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-amber-800 text-white" : "text-gray-600 hover:bg-amber-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="cmt-dash space-y-6">
          <div className="cmt-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="cmt-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 cmt-kpi-label">{k.l}</div><div className="text-2xl font-bold text-amber-800 cmt-kpi-val">{k.v}</div><div className="text-xs text-gray-400 cmt-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Cement Dispatches (KT)</h3><BarChart data={monthlyDespatches} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="opc" fill="#92400e" radius={[4,4,0,0]} name="OPC" /><Bar dataKey="ppc" fill="#b45309" radius={[4,4,0,0]} name="PPC" /><Bar dataKey="psc" fill="#d97706" radius={[4,4,0,0]} name="PSC" /><Bar dataKey="rmc" fill="#f59e0b" radius={[4,4,0,0]} name="RMC" /></BarChart></div>
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Product Mix Distribution</h3><PieChart width={400} height={220}><Pie data={productDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{productDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Plant Capacity Utilization (%) vs 82% Target</h3><LineChart data={utilTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[60, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#92400e" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Plant Dispatch Performance Score</h3><BarChart data={plantPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[60, 100]} /><Tooltip /><Bar dataKey="v" fill="#b45309" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="cmt-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Cement Logistics", href: "#" }, { label: "Dispatch Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="cmt-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Order No,Plant,Product,Customer,Destination,State,Mode,Qty,Dispatch,ETA,Delivery,Transit (d),Status,Invoice,Condition,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Quality Hold" ? "cmt-row-critical bg-red-50" : r.status === "Pending Loading" ? "cmt-row-warning bg-amber-50" : r.status === "In Transit" ? "cmt-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-amber-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="cmt-badge inline-block px-2 py-0.5 rounded text-xs bg-amber-800 text-white font-mono">{r.orderNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.plant}</td>
                <td className="px-3 py-2"><span className="cmt-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.product}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.customer}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.destination}</td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.quantity.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2 text-xs">{r.deliveryDate || <span className="text-amber-300">\u2014</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 3 ? "text-red-600" : r.transitDays > 1 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2"><span className={`cmt-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-amber-700">{fmtVal(r.invoiceValue)}</td>
                <td className="px-3 py-2 text-xs"><span className={r.bagCondition === "Good" ? "text-green-600" : r.bagCondition === "Damaged" ? "text-red-600" : "text-gray-500"}>{r.bagCondition}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="cmt-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dispatch Volume by Plant</h3><BarChart data={PLANTS.slice(0,6).map(p => ({ n: p.split(" ")[0], v: +ri(180, 450, 280 + Math.random() * 120).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#92400e" radius={[4,4,0,0]} name="Dispatches" /></BarChart></div>
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dispatch by State Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], south: ri(320, 580, 440 + Math.sin(i*0.5)*80), north: ri(280, 520, 380 + Math.cos(i*0.6)*70), east: ri(200, 380, 280 + Math.sin(i*0.7)*50) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="south" stackId="1" stroke="#92400e" fill="#fef3c7" name="South" /><Area type="monotone" dataKey="north" stackId="1" stroke="#b45309" fill="#fde68a" name="North" /><Area type="monotone" dataKey="east" stackId="1" stroke="#d97706" fill="#fef9c3" name="East" /></AreaChart></div>
          </div>
          <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Transport Mode</h3><BarChart data={[{n:"Rail Rake",v:2},{n:"Truck Bulk",v:1.5},{n:"Truck Bagged",v:1},{n:"Ship Coastal",v:4},{n:"RMC Mixer",v:0},{n:"Conveyor",v:0.5}].map(d => ({...d, v: +ri(d.v-0.3, d.v+0.5, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#b45309" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="cmt-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="cmt-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-amber-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
