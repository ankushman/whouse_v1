"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#1e3a5f", "#bfdbfe", "#dbeafe"];
const OEMS = ["Maruti Suzuki", "Hyundai India", "Tata Motors", "Mahindra & Mahindra", "Toyota Kirloskar", "Honda Cars", "Kia India", "MG Motor"];
const PLANTS = ["Maruti Suzuki Gurgaon", "Hyundai Sriperumbudur", "Tata Motors Sanand", "Mahindra Nashik", "Toyota Bidadi", "Honda Greater Noida", "Kia Anantapur", "MG Halol"];
const DEALER_ZONES = ["North Zone", "South Zone", "West Zone", "East Zone", "Central Zone", "NE Zone"];
const VEHICLE_TYPES = ["Hatchback", "Sedan", "SUV", "MUV/MPV", "EV", "Commercial", "Premium Luxury"];
const TRANSIT_MODES = ["Car Carrier Truck", "Rail Rake", "RoRo Ship", "Flatbed Trailer", "Multi-Modal"];
const TABS = ["Dashboard", "Vehicle Registry", "Logistics Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "At Plant Yard": "blue", "In Transit": "amber", "At RDC": "green", "Delivered to Dealer": "green", "Transit Delay": "red", "Customs Hold": "red" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyDespatches = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], truck: ri(1800, 3800, 2650 + Math.sin(i * 0.5) * 750), rail: ri(400, 900, 620 + Math.cos(i * 0.6) * 180), roro: ri(100, 350, 210 + Math.sin(i * 0.7) * 70) }));
const modeDist = [{ n: "Car Carrier", v: 58 }, { n: "Rail Rake", v: 22 }, { n: "RoRo Ship", v: 12 }, { n: "Flatbed", v: 6 }, { n: "Multi-Modal", v: 2 }];
const transitTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(4.2, 8.5, 5.8 + Math.sin(i * 0.4) * 1.2)).toFixed(1), target: 5.0 }));
const oemPerf = OEMS.slice(0, 6).map(o => ({ n: o.split(" ")[0], v: +ri(82, 97, 88 + Math.random() * 7).toFixed(0) }));

interface VehicleRecord { id: string; vinNo: string; oem: string; plant: string; dealerZone: string; vehicleType: string; model: string; color: string; transitMode: string; dispatchDate: string; eta: string; deliveryDate: string; transitDays: number; status: string; carrier: string; yardLocation: string; dealerName: string; damages: string; pdiStatus: string; invoiceValue: number; remarks: string; }

const records: VehicleRecord[] = [
  { id: "ALC-0001", vinNo: "MABHM11AAJM100001", oem: "Maruti Suzuki", plant: "Maruti Suzuki Gurgaon", dealerZone: "North Zone", vehicleType: "Hatchback", model: "Swift LXi", color: "Silk Silver", transitMode: "Car Carrier Truck", dispatchDate: "2025-01-10", eta: "2025-01-14", deliveryDate: "2025-01-14", transitDays: 4, status: "Delivered to Dealer", carrier: "Gati Auto Logistics", yardLocation: "Delhi Dealer Yard", dealerName: "Prestige Maruti Delhi", damages: "None", pdiStatus: "Completed", invoiceValue: 645000, remarks: "Standard dispatch" },
  { id: "ALC-0002", vinNo: "MALHE52CCKM200002", oem: "Hyundai India", plant: "Hyundai Sriperumbudur", dealerZone: "South Zone", vehicleType: "SUV", model: "Creta SX", color: "Titan Grey", transitMode: "Rail Rake", dispatchDate: "2025-01-12", eta: "2025-01-18", deliveryDate: "", transitDays: 3, status: "In Transit", carrier: "Indian Railways AFC", yardLocation: "Chennai Rail Head", dealerName: "Hyundai TVS Chennai", damages: "None", pdiStatus: "Pending", invoiceValue: 1485000, remarks: "Rail rake to Bangalore - ETA 18-Jan" },
  { id: "ALC-0003", vinNo: "MATMT38DDKN300003", oem: "Tata Motors", plant: "Tata Motors Sanand", dealerZone: "West Zone", vehicleType: "EV", model: "Nexon EV Max LR", color: "Inturi Teal Blue", transitMode: "Car Carrier Truck", dispatchDate: "2025-01-08", eta: "2025-01-16", deliveryDate: "", transitDays: 5, status: "Transit Delay", carrier: "BLR Auto Transport", yardLocation: "Mumbai-Nashik Highway", dealerName: "Tata Landmark Pune", damages: "Minor Scratch Door", pdiStatus: "Pending", invoiceValue: 1895000, remarks: "Truck breakdown - 12hr delay, minor door scratch" },
  { id: "ALC-0004", vinNo: "MAMMM45FFNM400004", oem: "Mahindra & Mahindra", plant: "Mahindra Nashik", dealerZone: "Central Zone", vehicleType: "SUV", model: "XUV700 AX7", color: "Napoli Black", transitMode: "Flatbed Trailer", dispatchDate: "2025-01-14", eta: "2025-01-18", deliveryDate: "", transitDays: 1, status: "At Plant Yard", carrier: "Mahindra Own Fleet", yardLocation: "Nashik Plant Yard", dealerName: "Mahindra Bhopal", damages: "None", pdiStatus: "Not Started", invoiceValue: 2156000, remarks: "Awaiting carrier allocation" },
  { id: "ALC-0005", vinNo: "MATKM67GGJN500005", oem: "Toyota Kirloskar", plant: "Toyota Bidadi", dealerZone: "South Zone", vehicleType: "Sedan", model: "Camry Hybrid", color: "Phantom Grey", transitMode: "RoRo Ship", dispatchDate: "2025-01-06", eta: "2025-01-15", deliveryDate: "2025-01-16", transitDays: 9, status: "Delivered to Dealer", carrier: "SAMKARG RoRo", yardLocation: "Kochi Dealer Yard", dealerName: "Toyota Cochin", damages: "None", pdiStatus: "Completed", invoiceValue: 4250000, remarks: "Coastal RoRo Mumbai-Cochin" },
  { id: "ALC-0006", vinNo: "MAHCM78HHML600006", oem: "Honda Cars", plant: "Honda Greater Noida", dealerZone: "East Zone", vehicleType: "Sedan", model: "City ZX CVT", color: "Platinum White", transitMode: "Car Carrier Truck", dispatchDate: "2025-01-13", eta: "2025-01-19", deliveryDate: "", transitDays: 3, status: "In Transit", carrier: "Honda Direct Fleet", yardLocation: "Kanpur Checkpost", dealerName: "Honda WB Kolkata", damages: "None", pdiStatus: "Not Started", invoiceValue: 1325000, remarks: "Transit via Agra-NH2 corridor" },
  { id: "ALC-0007", vinNo: "MAKCM89IIAN700007", oem: "Kia India", plant: "Kia Anantapur", dealerZone: "North Zone", vehicleType: "MUV/MPV", model: "Carens Luxury", color: "Imperial Blue", transitMode: "Multi-Modal", dispatchDate: "2025-01-11", eta: "2025-01-20", deliveryDate: "", transitDays: 4, status: "In Transit", carrier: "Kia Logistics Partner", yardLocation: "Hyderabad ICD", dealerName: "Kia Delhi West", damages: "None", pdiStatus: "Not Started", invoiceValue: 1826000, remarks: "Road + Rail: Plant-Vijayawada rail-Delhi" },
  { id: "ALC-0008", vinNo: "MAMGM10JJNH800008", oem: "MG Motor", plant: "MG Halol", dealerZone: "South Zone", vehicleType: "SUV", model: "Hector Sharp Pro", color: "Starry Black", transitMode: "Car Carrier Truck", dispatchDate: "2025-01-15", eta: "2025-01-21", deliveryDate: "", transitDays: 0, status: "At Plant Yard", carrier: "MG Direct Fleet", yardLocation: "Halol Plant Yard", dealerName: "MG Kochi", damages: "None", pdiStatus: "Not Started", invoiceValue: 1956000, remarks: "Booking confirmed - dispatch pending" },
  { id: "ALC-0009", vinNo: "MABHM22KKHN900009", oem: "Maruti Suzuki", plant: "Maruti Suzuki Gurgaon", dealerZone: "NE Zone", vehicleType: "Premium Luxury", model: "Baleno RS Delta", color: "Sport Red", transitMode: "Rail Rake", dispatchDate: "2025-01-09", eta: "2025-01-16", deliveryDate: "", transitDays: 4, status: "At RDC", carrier: "CONCOR Auto", yardLocation: "Guwahati RDC", dealerName: "NEXA Guwahati", damages: "None", pdiStatus: "Pending", invoiceValue: 682000, remarks: "Arrived Guwahati RDC - dealer pickup pending" },
  { id: "ALC-0010", vinNo: "MALHE44LLNL100010", oem: "Hyundai India", plant: "Hyundai Sriperumbudur", dealerZone: "West Zone", vehicleType: "SUV", model: "Venue SX Tech", color: "Denim Blue", transitMode: "Car Carrier Truck", dispatchDate: "2025-01-07", eta: "2025-01-12", deliveryDate: "2025-01-12", transitDays: 5, status: "Delivered to Dealer", carrier: "Allcargo Auto", yardLocation: "Mumbai Dealer Yard", dealerName: "Hyundai Sahyadri Mumbai", damages: "None", pdiStatus: "Completed", invoiceValue: 1188000, remarks: "Mumbai delivery complete" },
  { id: "ALC-0011", vinNo: "MATMT55MMTN110011", oem: "Tata Motors", plant: "Tata Motors Sanand", dealerZone: "North Zone", vehicleType: "SUV", model: "Harrier XZ+", color: "Coral Red", transitMode: "Car Carrier Truck", dispatchDate: "2025-01-16", eta: "2025-01-22", deliveryDate: "", transitDays: 2, status: "In Transit", carrier: "Tata Fleet Services", yardLocation: "Udaipur NH", dealerName: "Tata Jaipur", damages: "None", pdiStatus: "Not Started", invoiceValue: 2068000, remarks: "En route Jaipur via NH48" },
  { id: "ALC-0012", vinNo: "MAMMM66NNON120012", oem: "Mahindra & Mahindra", plant: "Mahindra Nashik", dealerZone: "South Zone", vehicleType: "EV", model: "XUV400 EL Pro", color: "Black", transitMode: "RoRo Ship", dispatchDate: "2025-01-05", eta: "2025-01-14", deliveryDate: "2025-01-15", transitDays: 9, status: "Delivered to Dealer", carrier: "SAMKARG RoRo", yardLocation: "Chennai Dealer Yard", dealerName: "Mahindra Chennai", damages: "None", pdiStatus: "Completed", invoiceValue: 1725000, remarks: "RoRo Mumbai-Chennai delivery" },
  { id: "ALC-0013", vinNo: "MATKM77OOPM130013", oem: "Kia India", plant: "Kia Anantapur", dealerZone: "East Zone", vehicleType: "SUV", model: "Seltos GT Line", color: "Gravity Grey", transitMode: "Multi-Modal", dispatchDate: "2025-01-14", eta: "2025-01-23", deliveryDate: "", transitDays: 1, status: "At Plant Yard", carrier: "Kia Logistics Partner", yardLocation: "Anantapur Plant Yard", dealerName: "Kia Bhubaneswar", damages: "None", pdiStatus: "Not Started", invoiceValue: 1756000, remarks: "Pending rail rake to Kolkata" },
  { id: "ALC-0014", vinNo: "MABHM88PPSN140014", oem: "Maruti Suzuki", plant: "Maruti Suzuki Gurgaon", dealerZone: "West Zone", vehicleType: "Commercial", model: "Super Carry ZXI", color: "White", transitMode: "Flatbed Trailer", dispatchDate: "2025-01-13", eta: "2025-01-18", deliveryDate: "", transitDays: 3, status: "In Transit", carrier: "Gati Auto Logistics", yardLocation: "Indore Bypass", dealerName: "Maruti Ahmedabad", damages: "None", pdiStatus: "Not Started", invoiceValue: 628000, remarks: "Commercial vehicle - flatbed delivery" },
];

const inTransitCount = records.filter(r => r.status === "In Transit" || r.status === "Transit Delay").length;
const atYardCount = records.filter(r => r.status === "At Plant Yard" || r.status === "At RDC").length;
const deliveredCount = records.filter(r => r.status === "Delivered to Dealer").length;
const totalInvoiceValue = records.reduce((s, r) => s + r.invoiceValue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

const kpis = [
  { l: "In Transit", v: inTransitCount, s: "vehicles on road/rail" },
  { l: "At Yard / RDC", v: atYardCount, s: "awaiting dispatch" },
  { l: "Delivered to Dealer", v: deliveredCount, s: "this batch" },
  { l: "Total Invoice Value", v: fmtVal(totalInvoiceValue), s: "across all vehicles" },
];

const INSIGHTS = [
  {
    t: "India Automotive Logistics: 4.2 Million Vehicles Dispatched Annually",
    c: "India\u2019s automotive logistics industry, handling approximately 4.2 million passenger vehicles and 1.1 million commercial vehicles dispatched annually from 32 OEM manufacturing plants to over 28,000 dealerships across India, operates through a multi-modal finished vehicle logistics (FVL) network. The Indian FVL market, valued at \u20b912,000 crore in FY2024, has grown at 10-14% CAGR driven by India\u2019s emergence as the world\u2019s 3rd largest automobile market (5.1 million vehicles sold in FY2024, surpassing Japan). The logistics mode split for passenger vehicle dispatch in India is: road (car carrier trucks at 62%), rail (Indian Railways AFC rakes at 22%), coastal RoRo (SAMKARG ships at 12%), and multi-modal (4%). Key car carrier operators include Gati Auto Logistics (1,200+ car carriers), BLR Auto Transport (800+ carriers), Allcargo Automotive (600+ carriers), and OEM-owned fleets (Maruti Suzuki operates 400+ dedicated carriers). The average transit time for vehicle delivery from plant to dealership is 4-7 days by road and 6-10 days by rail, with significant variation by corridor: Delhi-Mumbai (3-4 days road, 5-7 days rail), Chennai-Kolkata (5-6 days road, 8-10 days rail), and Pune-Delhi (4-5 days road, 7-8 days rail). Vehicle damage during transit averages 0.8-1.2% of dispatched units, costing OEMs approximately \u20b9350-500 crore annually in damage repair claims and customer dissatisfaction. India\u2019s upcoming Dedicated Freight Corridor network is expected to reduce average transit time by 30% and enable same-day plant-to-dealer delivery for 60% of dealerships within 500 km of manufacturing plants.",
  },
  {
    t: "Rail Rake Vehicle Transport: Indian Railways AFC & CONCOR Auto Hub",
    c: "Indian Railways\u2019 Auto Freight Corridor (AFC) and CONCOR\u2019s automotive logistics division jointly operate approximately 280-350 rail rakes annually for vehicle transportation, with each rake carrying 250-300 passenger vehicles (equivalent to 8-10 car carrier trucks) on specialized flat wagons (NMG/NHCG type). The rail vehicle transport network in India covers major plant-to-dealer corridors including: Gurgaon-Bangalore (Western DFC, reducing transit from 5 days to 2.5 days), Sriperumbudur-Delhi (600 km, 3 days), Sanand-Mumbai (DFC, 1.5 days), and Bidadi-Kolkata (Eastern DFC, 4 days). The rail mode offers 40-55% cost savings over road transport for distances exceeding 500 km, with per-vehicle rail freight costing \u20b94,500-7,000 compared to \u20b910,000-14,000 by car carrier truck. However, rail logistics requires 24-48 hours of loading/unloading time at both ends, dedicated auto terminals at plant and destination, and a minimum batch size of 150-200 vehicles per rake to achieve optimal loading efficiency. The Dedicated Freight Corridor Corporation of India (DFCCIL) is developing 12 new auto logistics terminals along the Western and Eastern DFC routes, with automated wagon loading systems that can load 300 vehicles in 4 hours (versus 8-10 hours manual loading). OEMs with dedicated rail agreements with Indian Railways report 35-45% reduction in long-haul logistics costs, 50% lower damage rates (0.4% vs 0.8% by road), and 60% lower carbon emissions per vehicle-km compared to road transport. Companies deploying integrated road-rail planning systems report 25% improvement in overall fleet utilization and 30% reduction in dealer pipeline inventory.",
  },
  {
    t: "Coastal RoRo Vehicle Shipping: SAMKARG Mumbai-Chennai-Kolkata Corridor",
    c: "India\u2019s coastal Roll-on/Roll-off (RoRo) vehicle shipping service, operated by SAMKARG (Shipping Corporation of India - Samudra Carriers) on the Mumbai-Chennai-Kolkata-Paradip corridor, carries approximately 120,000-150,000 vehicles annually, providing a cost-effective alternative to road transport for the 1,200-2,000 km coastal route segments. The RoRo service uses two specialized vehicle carriers (MV Samudra Sarita and MV Samudra Seema) with capacity of 1,500 vehicles each, operating on a 10-14 day voyage cycle covering Mumbai-Chennai (3 days, 1,200 km), Chennai-Kolkata (4 days, 1,350 km), and Kolkata-Paradip (1 day, 500 km) segments. The per-vehicle RoRo freight cost ranges from \u20b93,500-5,500 (60-65% lower than road transport), with transit time of 3-5 days for coastal segments versus 3-4 days by road (comparable time but significantly lower cost). Key OEM users of the RoRo service include Maruti Suzuki (35% of RoRo volumes), Hyundai India (25%), Tata Motors (20%), and Mahindra (12%). The Indian Ministry of Shipping has proposed expanding the RoRo network to 8 additional ports including Cochin, Mangalore, Visakhapatnam, and Kandla by FY2027, targeting 500,000 annual vehicle throughput. The Sagarmala programme has allocated \u20b92,500 crore for RoRo terminal development at 12 major ports, including dedicated RoRo berths, vehicle staging areas, and customs facilitation for export-bound vehicles. For OEMs with manufacturing plants within 100 km of gateway ports (JNPT, Chennai, Paradip, Mundra), coastal RoRo provides a significant logistics cost advantage for dealerships in port-adjacent coastal states, with per-vehicle savings of \u20b94,000-6,000 compared to road transport for the same route.",
  },
  {
    t: "PDI & Dealer Inventory: Vehicle Inspection and Pre-Delivery Preparation",
    c: "Pre-Delivery Inspection (PDI) at the dealership is the final quality checkpoint in India\u2019s automotive supply chain, involving 47-point vehicle inspection (Maruti Suzuki), 52-point (Hyundai), or 38-point (Tata Motors) covering exterior body panel gaps, paint quality, engine compartment, electrical systems, tyre condition, fluid levels, interior fitment, and test drive functionality. The PDI process, typically requiring 60-90 minutes per vehicle, is performed by trained dealership technicians and includes: (1) Exterior walk-around for dents, scratches, paint defects (touch-up required for 8-12% of delivered vehicles), (2) Engine start and idle quality check, (3) Electrical system verification (infotainment, AC, power windows, central locking), (4) Tyre condition and pressure check, (5) Interior cleaning and protective film removal, (6) Test drive (0.5-1 km) for drivability assessment, and (7) Document preparation (registration certificate, insurance, warranty card, invoice, key handover kit). The dealer pipeline inventory, defined as vehicles at dealership yards awaiting customer delivery, averages 15-25 days for high-demand models (Maruti Swift, Hyundai Creta, Tata Nexon) and 30-45 days for slower-moving variants, costing OEMs approximately \u20b92,500-4,000 per vehicle per month in inventory carrying cost and dealer floor plan interest. India\u2019s leading OEMs deploy digital PDI management systems that track inspection status, damage documentation (photo/video evidence captured at plant dispatch, transit, and delivery), and customer delivery scheduling in real-time. Companies with integrated plant-to-dealer tracking systems report 40% reduction in transit damage claims, 25% faster PDI completion time, and 15% improvement in customer delivery satisfaction scores (measured through JD Power India CSI survey).",
  },
];

export default function AutomotiveLogisticsCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: Object.keys(statusColor).map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "oem", label: "OEM", options: OEMS.map(o => ({ value: o, count: records.filter(r => r.oem === o).length })) },
    { key: "vehicleType", label: "Type", options: VEHICLE_TYPES.map(v => ({ value: v, count: records.filter(r => r.vehicleType === v).length })) },
    { key: "transitMode", label: "Mode", options: TRANSIT_MODES.map(t => ({ value: t, count: records.filter(r => r.transitMode === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.vinNo.toLowerCase().includes(q) && !r.oem.toLowerCase().includes(q) && !r.model.toLowerCase().includes(q) && !r.dealerName.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof VehicleRecord] as string));
  });

  return (
    <div className="alc-root p-6 space-y-6">
      <PageHeader title="Automotive Logistics Command" description="Finished vehicle logistics (FVL), plant-to-dealer dispatch, car carrier fleet management, rail rake scheduling, coastal RoRo shipping, vehicle damage tracking and PDI coordination" />
      <div className="alc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`alc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="alc-dash space-y-6">
          <div className="alc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="alc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 alc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-blue-700 alc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 alc-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="alc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Vehicle Despatches by Mode</h3><BarChart data={monthlyDespatches} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="truck" fill="#2563eb" radius={[4,4,0,0]} name="Car Carrier" /><Bar dataKey="rail" fill="#3b82f6" radius={[4,4,0,0]} name="Rail Rake" /><Bar dataKey="roro" fill="#60a5fa" radius={[4,4,0,0]} name="RoRo" /></BarChart></div>
            <div className="alc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Transit Mode Distribution</h3><PieChart width={400} height={220}><Pie data={modeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{modeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="alc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days vs Target 5d</h3><LineChart data={transitTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[3, 10]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} name="Actual Days" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target 5d" /></LineChart></div>
            <div className="alc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">OEM Dispatch Performance</h3><BarChart data={oemPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[75, 100]} /><Tooltip /><Bar dataKey="v" fill="#3b82f6" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="alc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Auto", href: "#" }, { label: "Vehicle Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="alc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,VIN No,OEM,Plant,Zone,Type,Model,Color,Mode,Dispatch,ETA,Delivery,Days,Status,Carrier,Yard,Dealer,Damages,PDI,Value,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Transit Delay" ? "alc-row-critical bg-red-50" : r.status === "At Plant Yard" ? "alc-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-blue-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="alc-badge inline-block px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 font-mono">{r.vinNo.slice(-6)}</span></td>
                <td className="px-3 py-2 text-xs">{r.oem}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.plant}</td>
                <td className="px-3 py-2 text-xs">{r.dealerZone}</td>
                <td className="px-3 py-2"><span className="alc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.vehicleType}</span></td>
                <td className="px-3 py-2 text-xs font-semibold">{r.model}</td>
                <td className="px-3 py-2 text-xs">{r.color}</td>
                <td className="px-3 py-2"><span className="alc-badge inline-block px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-600">{r.transitMode}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2 text-xs">{r.deliveryDate || <span className="text-slate-400">\u2014</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 7 ? "text-red-600" : r.transitDays > 4 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2"><span className={`alc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs">{r.carrier}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.yardLocation}</td>
                <td className="px-3 py-2 text-xs">{r.dealerName}</td>
                <td className="px-3 py-2">{r.damages !== "None" ? <span className="alc-badge inline-block px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">{r.damages}</span> : <span className="text-green-600 text-xs">Clean</span>}</td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 rounded text-xs ${r.pdiStatus === "Completed" ? "bg-green-100 text-green-700" : r.pdiStatus === "Pending" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{r.pdiStatus}</span></td>
                <td className="px-3 py-2 text-xs font-semibold">{fmtVal(r.invoiceValue)}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="alc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="alc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dispatch Volume by OEM</h3><BarChart data={OEMS.slice(0,6).map(o => ({ n: o.split(" ")[0], v: +ri(42, 180, 95 + Math.random() * 60).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#2563eb" radius={[4,4,0,0]} /></BarChart></div>
            <div className="alc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Volume by Dealer Zone</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], north: ri(85, 210, 140 + Math.sin(i*0.5)*30), south: ri(65, 170, 112 + Math.cos(i*0.6)*25), west: ri(55, 145, 95 + Math.sin(i*0.7)*22) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="north" stackId="1" stroke="#2563eb" fill="#dbeafe" name="North" /><Area type="monotone" dataKey="south" stackId="1" stroke="#3b82f6" fill="#bfdbfe" name="South" /><Area type="monotone" dataKey="west" stackId="1" stroke="#60a5fa" fill="#93c5fd" name="West" /></AreaChart></div>
          </div>
          <div className="alc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Route</h3><BarChart data={[{n:"Gurgaon-Mumbai",v:4},{n:"Chennai-Delhi",v:6},{n:"Sanand-Bangalore",v:5},{n:"Nashik-Kolkata",v:8},{n:"Bidadi-Kochi",v:4},{n:"Halol-Chennai",v:6}].map(d => ({...d, v: +ri(d.v-1, d.v+2, d.v + Math.random()*2).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#3b82f6" radius={[4,4,0,0]} /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="alc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="alc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-blue-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
