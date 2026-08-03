"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#312e81", "#3730a3", "#4338ca", "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#4338ca"];

const OPERATORS = [
  "DJI Enterprise India Bengaluru",
  "SkyDrive Japan India Partner",
  "Garuda Aerospace Chennai",
  "Zomato Hyper Delivery Labs",
  "Swiggy Instamart Drone Hub",
  "Dronitech Mumbai",
  "Quidich Innovation Labs Mumbai",
  "TCS Drone Solutions Chennai",
];

const CATEGORIES = [
  "VTOL Fixed Wing 10kg 50km Range",
  "Multirotor Hexacopter 5kg 15km",
  "Heavy Lift Octocopter 25kg 8km",
  "Delivery Quadcopter 2kg 10km",
  "Agricultural Spray Drone 20L",
  "Mapping Survey LiDAR Drone",
  "Medical Supply Emergency Drone",
  "Inspection Rotary Wing UAV",
];

const SHIPMENT_STATUSES = [
  "Drone Assembly FC QA Calibration",
  "Battery Pack Charging Station",
  "Flight Plan ATC Clearance Pending",
  "Sortation Hub Loading Active",
  "Autonomous Flight En Route Transit",
  "Delivery Drop POD Collected Confirmed",
];

const ZONES = [
  "Delhi NCR Gurugram Noida",
  "Bengaluru Urban Whitefield",
  "Mumbai Thane Navi Mumbai",
  "Hyderabad Gachibowli HITEC",
  "Chennai OMR Velachery",
  "Kolkata Salt Lake New Town",
  "Pune Hinjewadi Kharadi",
];

const MODES = [
  "Ground Van Mobile Hub",
  "Rooftop VTOL Pad Launch",
  "Drone Nest Autonomous Dock",
  "Last-Mile Delivery E-Bike",
  "Hospital Helipad Emergency",
  "Warehouse Drone Tower",
];

const DRONE_TYPES = ["VTOL Fixed Wing", "Multirotor Hexacopter", "Heavy Lift Octocopter", "Quadcopter Delivery", "Agricultural Spray", "LiDAR Survey"];

const TABS = ["Dashboard", "Flight Registry", "Delivery Analytics", "Insights"];

const SC: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  slate: "bg-slate-100 text-slate-600",
  orange: "bg-orange-100 text-orange-700",
};

const statusColor: Record<string, string> = {
  "Drone Assembly FC QA Calibration": "slate",
  "Battery Pack Charging Station": "blue",
  "Flight Plan ATC Clearance Pending": "orange",
  "Sortation Hub Loading Active": "amber",
  "Autonomous Flight En Route Transit": "red",
  "Delivery Drop POD Collected Confirmed": "green",
};

interface DroneRecord {
  id: string; batchNo: string; operator: string; zone: string; category: string; description: string;
  payloadKg: number; rangeKm: number; flightTime: number; batteryCapacity: number; droneType: string;
  origin: string; hub: string; city: string; mode: string; prodDate: string; shipDate: string;
  transitDays: number; contractValue: number; clearanceLevel: string; status: string; remarks: string;
}

const records: DroneRecord[] = [
  { id: "DRN-0001", batchNo: "DJI/VTOL/2025/BN-041", operator: "DJI Enterprise India Bengaluru", zone: "Bengaluru Urban Whitefield", category: "VTOL Fixed Wing 10kg 50km Range", description: "DJI Matrice 350 RTK VTOL long-range payload delivery to Whitefield tech park hub", payloadKg: 10, rangeKm: 45, flightTime: 42, batteryCapacity: 18000, droneType: "VTOL Fixed Wing", origin: "DJI Manufacturing Shenzhen", hub: "BLR-WF Drone Hub Alpha", city: "Bengaluru", mode: "Rooftop VTOL Pad Launch", prodDate: "2025-06-15", shipDate: "2025-07-02", transitDays: 3, contractValue: 45000000, clearanceLevel: "VLL 400ft BVLOS", status: "Autonomous Flight En Route Transit", remarks: "DJI Matrice 350 RTK VTOL Whitefield tech park Bengaluru BVLOS delivery flight" },
  { id: "DRN-0002", batchNo: "SKY/MR/2025/BN-108", operator: "SkyDrive Japan India Partner", zone: "Delhi NCR Gurugram Noida", category: "Multirotor Hexacopter 5kg 15km", description: "SkyDrive SD-03 hexacopter mid-mile parcel sortation Gurugram sector 62 logistics park", payloadKg: 5, rangeKm: 12, flightTime: 25, batteryCapacity: 12000, droneType: "Multirotor Hexacopter", origin: "SkyDrive Tokyo HQ", hub: "DEL-GGN Sortation Hub", city: "Gurugram", mode: "Ground Van Mobile Hub", prodDate: "2025-05-20", shipDate: "2025-06-28", transitDays: 5, contractValue: 32000000, clearanceLevel: "VLOS 120ft", status: "Sortation Hub Loading Active", remarks: "SkyDrive SD-03 hexacopter Gurugram sector 62 logistics park sortation loading" },
  { id: "DRN-0003", batchNo: "GRD/HL/2025/BN-077", operator: "Garuda Aerospace Chennai", zone: "Chennai OMR Velachery", category: "Heavy Lift Octocopter 25kg 8km", description: "Garuda Vajra octocopter heavy-lift industrial component delivery OMR industrial zone", payloadKg: 25, rangeKm: 7, flightTime: 35, batteryCapacity: 20000, droneType: "Heavy Lift Octocopter", origin: "Garuda Aerospace Chennai Factory", hub: "MAA-OMR Industrial Hub", city: "Chennai", mode: "Warehouse Drone Tower", prodDate: "2025-06-01", shipDate: "2025-07-05", transitDays: 1, contractValue: 180000000, clearanceLevel: "600ft SOTP", status: "Drone Assembly FC QA Calibration", remarks: "Garuda Vajra octocopter heavy-lift OMR industrial zone Chennai assembly QA" },
  { id: "DRN-0004", batchNo: "ZOM/QC/2025/BN-215", operator: "Zomato Hyper Delivery Labs", zone: "Mumbai Thane Navi Mumbai", category: "Delivery Quadcopter 2kg 10km", description: "Zomato Hyper quadcopter food delivery Navi Mumbai Kharghar residential complex", payloadKg: 2, rangeKm: 8, flightTime: 15, batteryCapacity: 5000, droneType: "Quadcopter Delivery", origin: "Zomato R&D Bengaluru", hub: "BOM-NM Dark Store Hub", city: "Navi Mumbai", mode: "Last-Mile Delivery E-Bike", prodDate: "2025-07-01", shipDate: "2025-07-08", transitDays: 2, contractValue: 8500000, clearanceLevel: "200ft Urban Class G", status: "Delivery Drop POD Collected Confirmed", remarks: "Zomato Hyper quadcopter food delivery Kharghar Navi Mumbai delivered confirmed" },
  { id: "DRN-0005", batchNo: "SWG/QC/2025/BN-312", operator: "Swiggy Instamart Drone Hub", zone: "Hyderabad Gachibowli HITEC", category: "Delivery Quadcopter 2kg 10km", description: "Swiggy Instamart quick-commerce drone grocery delivery HITEC City high-rise towers", payloadKg: 2, rangeKm: 10, flightTime: 18, batteryCapacity: 6500, droneType: "Quadcopter Delivery", origin: "Swiggy Design Studio Bengaluru", hub: "HYD-GAC Instamart Hub", city: "Hyderabad", mode: "Rooftop VTOL Pad Launch", prodDate: "2025-06-18", shipDate: "2025-07-06", transitDays: 4, contractValue: 12000000, clearanceLevel: "200ft Urban Class G", status: "Battery Pack Charging Station", remarks: "Swiggy Instamart quadcopter grocery delivery HITEC City charging station" },
  { id: "DRN-0006", batchNo: "DNT/AG/2025/BN-089", operator: "Dronitech Mumbai", zone: "Pune Hinjewadi Kharadi", category: "Agricultural Spray Drone 20L", description: "Dronitech AgriSpray-20 agricultural spraying drone sugarcane farm Hinjewadi belt", payloadKg: 20, rangeKm: 5, flightTime: 30, batteryCapacity: 16000, droneType: "Agricultural Spray", origin: "Dronitech Mumbai Assembly", hub: "PNQ-HJW Agri Center", city: "Pune", mode: "Ground Van Mobile Hub", prodDate: "2025-05-10", shipDate: "2025-06-15", transitDays: 2, contractValue: 28000000, clearanceLevel: "VLOS 120ft", status: "Flight Plan ATC Clearance Pending", remarks: "Dronitech AgriSpray-20 sugarcane spraying Hinjewadi ATC clearance pending" },
  { id: "DRN-0007", batchNo: "QDC/LD/2025/BN-044", operator: "Quidich Innovation Labs Mumbai", zone: "Mumbai Thane Navi Mumbai", category: "Mapping Survey LiDAR Drone", description: "Quidich SkyMap LiDAR survey drone topographic mapping Thane creek coastal zone", payloadKg: 8, rangeKm: 15, flightTime: 45, batteryCapacity: 15000, droneType: "LiDAR Survey", origin: "Quidich Innovation Mumbai", hub: "BOM-THN Survey Base", city: "Thane", mode: "Drone Nest Autonomous Dock", prodDate: "2025-06-22", shipDate: "2025-07-04", transitDays: 3, contractValue: 55000000, clearanceLevel: "VLL 400ft BVLOS", status: "Autonomous Flight En Route Transit", remarks: "Quidich SkyMap LiDAR survey Thane creek topographic mapping BVLOS flight" },
  { id: "DRN-0008", batchNo: "TCS/MR/2025/BN-156", operator: "TCS Drone Solutions Chennai", zone: "Kolkata Salt Lake New Town", category: "Inspection Rotary Wing UAV", description: "TCS InfraInspect rotary wing UAV bridge inspection Howrah bridge structural monitoring", payloadKg: 6, rangeKm: 12, flightTime: 38, batteryCapacity: 10000, droneType: "Multirotor Hexacopter", origin: "TCS Innovation Lab Chennai", hub: "CCU-SLNT Inspection HQ", city: "Kolkata", mode: "Ground Van Mobile Hub", prodDate: "2025-05-28", shipDate: "2025-07-01", transitDays: 6, contractValue: 42000000, clearanceLevel: "VLOS 120ft", status: "Drone Assembly FC QA Calibration", remarks: "TCS InfraInspect rotary wing Howrah bridge structural monitoring assembly QA" },
  { id: "DRN-0009", batchNo: "GRD/VT/2025/BN-091", operator: "Garuda Aerospace Chennai", zone: "Chennai OMR Velachery", category: "Medical Supply Emergency Drone", description: "Garuda MedSwift emergency blood unit delivery Chennai OMR Velachery hospital zone", payloadKg: 4, rangeKm: 25, flightTime: 22, batteryCapacity: 14000, droneType: "VTOL Fixed Wing", origin: "Garuda Aerospace Chennai Factory", hub: "MAA-VMC Medical Hub", city: "Chennai", mode: "Hospital Helipad Emergency", prodDate: "2025-06-10", shipDate: "2025-07-03", transitDays: 1, contractValue: 35000000, clearanceLevel: "VLL 400ft BVLOS", status: "Delivery Drop POD Collected Confirmed", remarks: "Garuda MedSwift blood unit Velachery hospital Chennai emergency delivered confirmed" },
  { id: "DRN-0010", batchNo: "ZOM/QC/2025/BN-220", operator: "Zomato Hyper Delivery Labs", zone: "Bengaluru Urban Whitefield", category: "Delivery Quadcopter 2kg 10km", description: "Zomato Hyper quadcopter 10-min food delivery Whitefield ITPL tech corridor lunch rush", payloadKg: 2, rangeKm: 6, flightTime: 15, batteryCapacity: 5500, droneType: "Quadcopter Delivery", origin: "Zomato R&D Bengaluru", hub: "BLR-WF Food Hub Beta", city: "Bengaluru", mode: "Rooftop VTOL Pad Launch", prodDate: "2025-07-05", shipDate: "2025-07-09", transitDays: 1, contractValue: 5000000, clearanceLevel: "Micro Drone 50ft", status: "Autonomous Flight En Route Transit", remarks: "Zomato Hyper quadcopter Whitefield ITPL 10-min food delivery en route flight" },
  { id: "DRN-0011", batchNo: "SKY/HL/2025/BN-112", operator: "SkyDrive Japan India Partner", zone: "Hyderabad Gachibowli HITEC", category: "Heavy Lift Octocopter 25kg 8km", description: "SkyDrive SD-10 heavy lift octocopter e-commerce warehouse HITEC City bulk parcel", payloadKg: 22, rangeKm: 8, flightTime: 40, batteryCapacity: 19000, droneType: "Heavy Lift Octocopter", origin: "SkyDrive Nagoya Factory", hub: "HYD-GAC Warehouse Tower", city: "Hyderabad", mode: "Warehouse Drone Tower", prodDate: "2025-05-15", shipDate: "2025-06-25", transitDays: 5, contractValue: 95000000, clearanceLevel: "600ft SOTP", status: "Sortation Hub Loading Active", remarks: "SkyDrive SD-10 heavy lift HITEC City e-commerce warehouse bulk parcel loading" },
  { id: "DRN-0012", batchNo: "DNT/LD/2025/BN-095", operator: "Dronitech Mumbai", zone: "Pune Hinjewadi Kharadi", category: "Mapping Survey LiDAR Drone", description: "Dronitech LIDAR-Pro survey drone highway mapping Pune-Mumbai expressway corridor", payloadKg: 7, rangeKm: 20, flightTime: 50, batteryCapacity: 17000, droneType: "LiDAR Survey", origin: "Dronitech R&D Pune", hub: "PNQ-KHR Survey Station", city: "Pune", mode: "Drone Nest Autonomous Dock", prodDate: "2025-06-08", shipDate: "2025-07-07", transitDays: 2, contractValue: 68000000, clearanceLevel: "VLL 400ft BVLOS", status: "Flight Plan ATC Clearance Pending", remarks: "Dronitech LIDAR-Pro highway survey Pune-Mumbai expressway ATC clearance pending" },
  { id: "DRN-0013", batchNo: "QDC/AG/2025/BN-051", operator: "Quidich Innovation Labs Mumbai", zone: "Mumbai Thane Navi Mumbai", category: "Agricultural Spray Drone 20L", description: "Quidich AgriWing spray drone paddy field pesticide application Thane rural belt", payloadKg: 18, rangeKm: 6, flightTime: 28, batteryCapacity: 14000, droneType: "Agricultural Spray", origin: "Quidich Innovation Mumbai", hub: "BOM-NM Agri Depot", city: "Navi Mumbai", mode: "Ground Van Mobile Hub", prodDate: "2025-05-25", shipDate: "2025-07-02", transitDays: 2, contractValue: 22000000, clearanceLevel: "VLOS 120ft", status: "Battery Pack Charging Station", remarks: "Quidich AgriWing paddy field pesticide spray Thane rural belt charging station" },
  { id: "DRN-0014", batchNo: "TCS/VT/2025/BN-163", operator: "TCS Drone Solutions Chennai", zone: "Kolkata Salt Lake New Town", category: "Medical Supply Emergency Drone", description: "TCS MediFlight VTOL vaccine cold-chain delivery Kolkata Salt Lake PHC network", payloadKg: 3, rangeKm: 30, flightTime: 55, batteryCapacity: 18000, droneType: "VTOL Fixed Wing", origin: "TCS Drone Factory Chennai", hub: "CCU-SLNT Medical Depot", city: "Kolkata", mode: "Hospital Helipad Emergency", prodDate: "2025-06-12", shipDate: "2025-07-08", transitDays: 4, contractValue: 75000000, clearanceLevel: "VLL 400ft BVLOS", status: "Delivery Drop POD Collected Confirmed", remarks: "TCS MediFlight VTOL vaccine cold-chain Kolkata Salt Lake PHC delivered confirmed" },
];

function formatINR(v: number): string {
  if (v >= 10000000) return `\u20b9${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `\u20b9${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `\u20b9${(v / 1000).toFixed(1)}K`;
  return `\u20b9${v}`;
}

const totalFleet = records.length;
const inFlight = records.filter(r => r.status === "Autonomous Flight En Route Transit").length;
const delivered = records.filter(r => r.status === "Delivery Drop POD Collected Confirmed").length;
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

const kpis = [
  { l: "Total Fleet", v: String(totalFleet), s: "registered drones", color: "text-indigo-800" },
  { l: "In Flight", v: String(inFlight), s: "en route transit", color: "text-red-600" },
  { l: "Delivered", v: String(delivered), s: "POD collected confirmed", color: "text-green-600" },
  { l: "Total Contract", v: formatINR(totalContract), s: "fleet contract value", color: "text-indigo-800" },
];

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dailyFlights = MO.map((m, i) => ({
  m,
  food: Math.floor(30 + Math.sin(i * 0.5) * 12),
  medical: Math.floor(15 + Math.cos(i * 0.6) * 6),
  ecommerce: Math.floor(45 + Math.sin(i * 0.4) * 15),
  agriculture: Math.floor(10 + Math.cos(i * 0.7) * 4),
}));

const typeDist = [
  { name: "VTOL Fixed Wing", value: 25 },
  { name: "Multirotor Hexacopter", value: 30 },
  { name: "Heavy Lift Octocopter", value: 10 },
  { name: "Quadcopter Delivery", value: 20 },
  { name: "Agricultural Spray", value: 10 },
  { name: "LiDAR Survey", value: 5 },
];

const deliveryTime = MO.map((m, i) => ({
  m,
  avg: +(12 + Math.sin(i * 0.45) * 5 + Math.random() * 3).toFixed(1),
  target: 15,
}));

const operatorFleet = OPERATORS.map(o => ({
  n: o.split(" ").slice(0, 2).join(" "),
  fleet: Math.floor(3 + Math.random() * 8),
}));

const INSIGHTS = [
  {
    t: "India BVLOS Drone Rules 2024: DGCA Beyond Visual Line of Sight Regulatory Framework",
    c: "India's DGCA released Drone Rules 2024 enabling BVLOS operations. Key provisions: BVLOS permits require RPAS certification from DGCA-approved QCI agencies. Conditional BVLOS up to 400ft VLL in green zones for food, medical, e-commerce delivery. SOTP clearance for 600ft in controlled airspace for heavy-lift and survey. Urban Class G (200ft) for micro drones <2kg via NPNT/Digital Sky. Medical emergency BVLOS exemptions with 15-min fast-track ATC approval. Insurance: \u20b925L per drone, \u20b95Cr for heavy-lift. RPL requires 40hrs training. 120+ BVLOS permits issued by July 2025. India drone market: \u20b98,000Cr (2024) projected \u20b950,000Cr by 2030, driven by PLI scheme 20% subsidy on local manufacturing. Key operators: DJI Enterprise, Garuda Aerospace, SkyDrive Japan-India JV, Zomato, Swiggy drone delivery.",
  },
  {
    t: "Zomato & Swiggy 10-Minute Drone Food Delivery: Quick Commerce Revolution",
    c: "Zomato Hyper Delivery Labs and Swiggy Instamart Drone Hub pioneering sub-10-min food delivery via autonomous drones. Zomato Hyper: 200+ DJI-modified quadcopters (2kg, 10km, 15min flight), 5,000+ daily flights across Bengaluru, Navi Mumbai, Hyderabad, Delhi NCR. Avg 8.5min vs 22min by rider. Cost \u20b918/delivery vs \u20b945/rider. 97.2% success. Swiggy: 150+ proprietary quadcopters, integrated quick-commerce grocery. Technology: NPNT Digital Sky 2.0, LiDAR obstacle avoidance, 5G connectivity, AI route optimization. Both hold DGCA BVLOS Category-2 permits. Zomato drone revenue \u20b9120Cr FY2025 (projected \u20b9500Cr FY2027). Combined addressable market: \u20b915,000Cr by 2028. Challenge: last 100m high-rise balcony delivery accounts for 40% failures.",
  },
  {
    t: "Garuda Aerospace: Agricultural Drone Mapping & Spraying Transforming Indian Farming",
    c: "Garuda Aerospace (Chennai, Startup India Seed Fund backed) operates India's largest agricultural drone fleet for spraying and mapping. Fleet: 500+ drones across Maharashtra, Karnataka, Tamil Nadu, Punjab. Vajra heavy-lift octocopter (25kg, 8km) for industrial; AgriSpray series (20L tank) for pesticide/herbicide application. Key metrics: 30 acres/hour spraying (vs 2 acres/hour manual), 90% chemical reduction via precision spraying, \u20b9350/acre cost (vs \u20b9800 manual). LiDAR mapping: centimeter-level topographic data for crop health analysis, soil moisture mapping, yield prediction. Partnerships: IARI (Indian Agricultural Research Institute) for crop science, NABARD for farmer financing, state agriculture departments. DGCA VLOS and BVLOS permits. \u20b9200Cr revenue FY2025. Export to Sri Lanka, Bangladesh, Nepal. India agricultural drone market: \u20b93,500Cr (2024) projected \u20b912,000Cr by 2030.",
  },
  {
    t: "Medical Drone Blood & Vaccine Delivery: AIIMS, PHC Network Emergency Supply Chain",
    c: "India's medical drone delivery network expanding rapidly for blood units, vaccines, and emergency medicines. TCS MediFlight VTOL (3kg, 30km, 55min) operating Kolkata Salt Lake PHC network for vaccine cold-chain delivery. Garuda MedSwift (4kg, 25km, 22min) delivering blood units to Chennai OMR Velachery hospitals. Key deployments: AIIMS Delhi pilot (2024) delivering blood from Rajiv Gandhi Blood Bank to trauma center in 8 minutes (vs 45min by road ambulance). AIIMS Jodhpur: drone delivery of anti-venom to rural PHCs in 12 minutes. Karnataka PHC network: 8 rural PHCs served from district hospital hub, 94% on-time delivery, avg 18min vs 2.5hrs road. Cold-chain compliance: vaccines maintained 2-8\u00b0C via insulated payload bay with temperature logger. 15-min medical BVLOS emergency exemption from DGCA. Impact: 340+ emergency deliveries completed (2024-25), estimated 50+ lives saved. India medical drone market: \u20b91,200Cr (2024) projected \u20b95,000Cr by 2030.",
  },
];

export default function DroneDeliveryLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(o => ({ value: o, count: records.filter(r => r.operator === o).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "droneType", label: "Drone Type", options: DRONE_TYPES.map(d => ({ value: d, count: records.filter(r => r.droneType === d).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.zone.toLowerCase().includes(q) && !r.city.toLowerCase().includes(q) && !r.droneType.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof DroneRecord] as string));
  });

  const columns = ["ID","Batch No","Operator","Zone","Category","Description","Payload (kg)","Range (km)","Flight (min)","Battery (mAh)","Drone Type","Origin","Hub","City","Mode","Prod Date","Ship Date","Transit (d)","Contract (\u20b9)","Clearance","Status","Remarks"];

  return (
    <div className="drn-root p-6 space-y-6">
      <PageHeader title="Drone Delivery Logistics" description="Indian drone delivery fleet management covering DJI Enterprise, Garuda Aerospace, Zomato Swiggy food drones, BVLOS logistics, agricultural spraying, medical emergency supply across Delhi NCR Bengaluru Mumbai Hyderabad Chennai Kolkata Pune zones" />
      <ModuleBreadcrumb items={[{ label: "Drone Logistics" }]} />
      <div className="drn-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`drn-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#312e81] text-white" : "text-gray-600 hover:bg-indigo-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="drn-dash space-y-6">
          <div className="drn-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="drn-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 drn-kpi-label">{k.l}</div><div className={`text-2xl font-bold drn-kpi-val ${k.color}`}>{k.v}</div><div className="text-xs text-gray-400 drn-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="drn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Daily Flights by Category</h3><BarChart data={dailyFlights} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="food" fill="#312e81" radius={[4,4,0,0]} name="Food" /><Bar dataKey="medical" fill="#4f46e5" radius={[4,4,0,0]} name="Medical" /><Bar dataKey="ecommerce" fill="#6366f1" radius={[4,4,0,0]} name="E-Commerce" /><Bar dataKey="agriculture" fill="#818cf8" radius={[4,4,0,0]} name="Agriculture" /></BarChart></div>
            <div className="drn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Drone Type Distribution (%)</h3><PieChart width={400} height={220}><Pie data={typeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={35} paddingAngle={2} label>{typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="drn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Delivery Time (min) vs 15min Target</h3><LineChart data={deliveryTime} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[5, 25]} /><Tooltip /><Legend /><Line type="monotone" dataKey="avg" stroke="#312e81" strokeWidth={2} name="Avg Delivery (min)" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target 15min" /></LineChart></div>
            <div className="drn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Operator Fleet Size</h3><BarChart data={operatorFleet} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="fleet" fill="#4338ca" radius={[4,4,0,0]} name="Fleet Size" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="drn-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Drone Logistics" }, { label: "Flight Registry" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="drn-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{columns.map(h => (<th key={h} className="drn-th px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Autonomous Flight En Route Transit" ? "drn-row-critical bg-red-50 border-l-4 border-l-red-500" : r.status === "Sortation Hub Loading Active" ? "drn-row-warning bg-amber-50 border-l-4 border-l-amber-500" : r.status === "Flight Plan ATC Clearance Pending" ? "drn-row-orange bg-orange-50 border-l-4 border-l-orange-500" : r.status === "Battery Pack Charging Station" ? "drn-row-info bg-blue-50 border-l-4 border-l-blue-500" : r.status === "Delivery Drop POD Collected Confirmed" ? "drn-row-success bg-green-50 border-l-4 border-l-green-500" : "";
              return (<tr key={r.id} className={`drn-table-row border-b hover:bg-indigo-50/30 ${rowCls}`}>
                <td className="drn-td px-3 py-2 font-mono font-medium text-indigo-800">{r.id}</td>
                <td className="drn-td px-3 py-2"><span className="drn-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-800 text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="drn-td px-3 py-2 text-xs max-w-28 truncate">{r.operator}</td>
                <td className="drn-td px-3 py-2"><span className="drn-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700">{r.zone}</span></td>
                <td className="drn-td px-3 py-2"><span className="drn-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="drn-td px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="drn-td px-3 py-2 text-xs text-right font-semibold">{r.payloadKg}</td>
                <td className="drn-td px-3 py-2 text-xs text-right">{r.rangeKm}</td>
                <td className="drn-td px-3 py-2 text-xs text-right">{r.flightTime}</td>
                <td className="drn-td px-3 py-2 text-xs text-right">{r.batteryCapacity.toLocaleString()}</td>
                <td className="drn-td px-3 py-2"><span className="drn-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700 font-medium">{r.droneType}</span></td>
                <td className="drn-td px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="drn-td px-3 py-2 text-xs max-w-24 truncate">{r.hub}</td>
                <td className="drn-td px-3 py-2 text-xs font-medium">{r.city}</td>
                <td className="drn-td px-3 py-2 text-xs">{r.mode}</td>
                <td className="drn-td px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="drn-td px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="drn-td px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 4 ? "text-red-600" : r.transitDays >= 2 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="drn-td px-3 py-2 text-xs font-semibold text-indigo-800">{formatINR(r.contractValue)}</td>
                <td className="drn-td px-3 py-2"><span className="drn-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.clearanceLevel}</span></td>
                <td className="drn-td px-3 py-2"><span className={`drn-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="drn-td px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="drn-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="drn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Daily Flights by Category (Monthly)</h3><BarChart data={dailyFlights} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="food" fill="#312e81" radius={[4,4,0,0]} name="Food" /><Bar dataKey="medical" fill="#4f46e5" radius={[4,4,0,0]} name="Medical" /><Bar dataKey="ecommerce" fill="#6366f1" radius={[4,4,0,0]} name="E-Commerce" /><Bar dataKey="agriculture" fill="#818cf8" radius={[4,4,0,0]} name="Agriculture" /></BarChart></div>
            <div className="drn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Drone Type Distribution (%)</h3><PieChart width={400} height={240}><Pie data={typeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={35} paddingAngle={2} label>{typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="drn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Delivery Time (min) vs 15min Target</h3><LineChart data={deliveryTime} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[5, 25]} /><Tooltip /><Legend /><Line type="monotone" dataKey="avg" stroke="#312e81" strokeWidth={2} name="Avg Delivery (min)" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target 15min" /></LineChart></div>
            <div className="drn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Operator Fleet Size (Drones)</h3><BarChart data={operatorFleet} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="fleet" fill="#4338ca" radius={[4,4,0,0]} name="Fleet Size" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="drn-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="drn-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-indigo-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
