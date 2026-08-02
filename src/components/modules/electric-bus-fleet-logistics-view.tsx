"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#065f46", "#064e3b", "#047857", "#059669", "#10b981", "#34d399", "#0d9488", "#14b8a6"];

const MANUFACTURERS = [
  "Tata Motors EV Dharwad",
  "Olectra BYD Hyderabad",
  "Ashok Leyland EV Chennai",
  "Switch Mobility UK TN",
  "JBM Auto Greater Noida",
  "PMI Electro Mobility Chennai",
  "Eicher Skyline Bus Pithampur",
  "AZUL Mobility Pune",
];

const CATEGORIES = [
  "12M Low Floor City Bus 60kWh",
  "9M Midi Transit Bus 40kWh",
  "12M AC Electric Bus 120kWh",
  "Double Decker E-Bus 200kWh",
  " articulated 18M E-Bus 250kWh",
  "Mini Electric Bus 25kWh",
  "Electric School Bus 35kWh",
  "Battery Swap E-Bus 50kWh",
];

const SHIPMENT_STATUSES = [
  "Bus Chassis Frame Assembly",
  "Battery Pack Integration Active",
  "Painting Body Build QC",
  "Dealer Depot Delivery Transit",
  "State Transport Depot Delivered",
  "Route Deployment Active Running",
];

const ZONES = [
  "North India Delhi NCR UP",
  "South India Chennai Bangalore TN",
  "West India Mumbai Pune Gujarat",
  "East India Kolkata Bhubaneswar",
  "Central India Bhopal Indore MP",
  "NE India Guwahati Shillong",
  "Telangana Hyderabad",
];

const MODES = [
  "Flatbed Car Carrier 40T",
  "Multi-Axle Trailer 60T",
  "Self-Drive Single 15T",
  "Rail Wagon Rake 5 Bus",
  "RoRo Ferry Coastal",
  "Drive-On Delivery 12T",
];

const TABS = ["Dashboard", "Fleet Registry", "Fleet Analytics", "Insights"];

const SC: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  slate: "bg-slate-100 text-slate-600",
  orange: "bg-orange-100 text-orange-700",
};

const statusColor: Record<string, string> = {
  "Bus Chassis Frame Assembly": "slate",
  "Battery Pack Integration Active": "red",
  "Painting Body Build QC": "amber",
  "Dealer Depot Delivery Transit": "blue",
  "State Transport Depot Delivered": "green",
  "Route Deployment Active Running": "green",
};

function ri(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value));
}

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

interface BusRecord {
  id: string;
  batchNo: string;
  manufacturer: string;
  zone: string;
  category: string;
  description: string;
  seatingCapacity: number;
  range: number;
  batteryCapacity: number;
  chargingTime: string;
  motorPower: string;
  origin: string;
  depot: string;
  city: string;
  mode: string;
  prodDate: string;
  shipDate: string;
  transitDays: number;
  contractValue: number;
  chargingStandard: string;
  status: string;
  remarks: string;
}

const records: BusRecord[] = [
  {
    id: "EBF-0001",
    batchNo: "TATA/DL/2025/BAT-001",
    manufacturer: "Tata Motors EV Dharwad",
    zone: "North India Delhi NCR UP",
    category: "12M Low Floor City Bus 60kWh",
    description: "Tata Starbus EV 12M low floor for DTC Delhi city routes with regenerative braking and FAME II subsidy",
    seatingCapacity: 40,
    range: 180,
    batteryCapacity: 60,
    chargingTime: "3h DC CCS2",
    motorPower: "150kW Rear Axle",
    origin: "Tata Motors EV Plant Dharwad Karnataka",
    depot: "DTC Millennium Depot Dwarka",
    city: "Delhi",
    mode: "Flatbed Car Carrier 40T",
    prodDate: "2025-06-15",
    shipDate: "2025-06-22",
    transitDays: 7,
    contractValue: 185000000,
    chargingStandard: "CCS2 DC Fast",
    status: "Route Deployment Active Running",
    remarks: "50 buses deployed on Dwarka-Sector 21 corridor under DTC cluster scheme",
  },
  {
    id: "EBF-0002",
    batchNo: "OLEC/HYD/2025/BAT-002",
    manufacturer: "Olectra BYD Hyderabad",
    zone: "Telangana Hyderabad",
    category: "12M AC Electric Bus 120kWh",
    description: "Olectra BYD K9 12M AC electric bus for TSRTC Hyderabad metro feeder routes with 120kWh LFP pack",
    seatingCapacity: 38,
    range: 280,
    batteryCapacity: 120,
    chargingTime: "4h Fast Charge",
    motorPower: "200kW Dual Motor",
    origin: "Olectra BYD Factory Hyderabad Telangana",
    depot: "TSRTC Miyapur Bus Depot",
    city: "Hyderabad",
    mode: "Self-Drive Single 15T",
    prodDate: "2025-06-20",
    shipDate: "2025-06-22",
    transitDays: 2,
    contractValue: 225000000,
    chargingStandard: "GB/T DC",
    status: "State Transport Depot Delivered",
    remarks: "30 AC buses delivered to Miyapur depot awaiting route allocation by TSRTC",
  },
  {
    id: "EBF-0003",
    batchNo: "ASHOK/CHE/2025/BAT-003",
    manufacturer: "Ashok Leyland EV Chennai",
    zone: "South India Chennai Bangalore TN",
    category: "9M Midi Transit Bus 40kWh",
    description: "Ashok Leyland Circuit 9M midi bus for Chennai MTC suburban feeder with 40kWh LFP battery pack",
    seatingCapacity: 32,
    range: 140,
    batteryCapacity: 40,
    chargingTime: "2h Fast DC",
    motorPower: "120kW Single",
    origin: "Ashok Leyland EV Plant Hosur TN",
    depot: "MTC Pallavaram Depot Chennai",
    city: "Chennai",
    mode: "Drive-On Delivery 12T",
    prodDate: "2025-07-01",
    shipDate: "2025-07-04",
    transitDays: 3,
    contractValue: 95000000,
    chargingStandard: "CCS2 DC Fast",
    status: "Dealer Depot Delivery Transit",
    remarks: "25 midi buses in transit from Hosur to Pallavaram via NH44",
  },
  {
    id: "EBF-0004",
    batchNo: "SWITCH/MUM/2025/BAT-004",
    manufacturer: "Switch Mobility UK TN",
    zone: "West India Mumbai Pune Gujarat",
    category: "Double Decker E-Bus 200kWh",
    description: "Switch Mobility EiV 22 double decker electric bus for BEST Mumbai with 200kWh NMC battery and 80 passenger capacity",
    seatingCapacity: 80,
    range: 250,
    batteryCapacity: 200,
    chargingTime: "6h Slow AC",
    motorPower: "250kW Rear",
    origin: "Switch Mobility TN Plant Chennai",
    depot: "BEST Colaba Bus Depot Mumbai",
    city: "Mumbai",
    mode: "Multi-Axle Trailer 60T",
    prodDate: "2025-06-10",
    shipDate: "2025-06-18",
    transitDays: 8,
    contractValue: 280000000,
    chargingStandard: "Pantograph Overhead",
    status: "Route Deployment Active Running",
    remarks: "10 double deckers running on Nariman Point-Borivali route with 99.2% uptime",
  },
  {
    id: "EBF-0005",
    batchNo: "JBM/NOIDA/2025/BAT-005",
    manufacturer: "JBM Auto Greater Noida",
    zone: "North India Delhi NCR UP",
    category: "Battery Swap E-Bus 50kWh",
    description: "JBM Ecolife 12M battery swap electric bus for UP State Road Transport with automated swap station integration",
    seatingCapacity: 42,
    range: 200,
    batteryCapacity: 50,
    chargingTime: "Swap 5min",
    motorPower: "150kW Rear Axle",
    origin: "JBM Auto Plant Greater Noida UP",
    depot: "UPSRTC Lucknow Alambagh Depot",
    city: "Lucknow",
    mode: "Self-Drive Single 15T",
    prodDate: "2025-07-05",
    shipDate: "2025-07-08",
    transitDays: 3,
    contractValue: 155000000,
    chargingStandard: "Battery Swap Station",
    status: "Painting Body Build QC",
    remarks: "20 battery swap buses under painting and QC at Greater Noida plant",
  },
  {
    id: "EBF-0006",
    batchNo: "PMI/CHE/2025/BAT-006",
    manufacturer: "PMI Electro Mobility Chennai",
    zone: "South India Chennai Bangalore TN",
    category: "Mini Electric Bus 25kWh",
    description: "PMI Electro 8M mini electric bus for Bangalore BMTC feeder routes narrow lanes with 25kWh compact battery",
    seatingCapacity: 30,
    range: 100,
    batteryCapacity: 25,
    chargingTime: "1.5h Ultra Fast",
    motorPower: "100kW Front Axle",
    origin: "PMI Electro Factory Chennai TN",
    depot: "BMTC Shantinagar Bus Depot",
    city: "Bangalore",
    mode: "Flatbed Car Carrier 40T",
    prodDate: "2025-07-08",
    shipDate: "2025-07-12",
    transitDays: 4,
    contractValue: 62000000,
    chargingStandard: "CCS2 DC Fast",
    status: "Battery Pack Integration Active",
    remarks: "15 mini buses with battery pack integration in progress at Chennai plant",
  },
  {
    id: "EBF-0007",
    batchNo: "EICHER/PIT/2025/BAT-007",
    manufacturer: "Eicher Skyline Bus Pithampur",
    zone: "Central India Bhopal Indore MP",
    category: "Electric School Bus 35kWh",
    description: "Eicher Skyline 9M electric school bus for Delhi NCR private schools with child safety compliance and 35kWh LFP pack",
    seatingCapacity: 45,
    range: 120,
    batteryCapacity: 35,
    chargingTime: "3h DC CCS2",
    motorPower: "120kW Single",
    origin: "VE Commercial Vehicles Pithampur MP",
    depot: "Eicher Regional Depot Indore",
    city: "Indore",
    mode: "Drive-On Delivery 12T",
    prodDate: "2025-06-25",
    shipDate: "2025-06-28",
    transitDays: 3,
    contractValue: 78000000,
    chargingStandard: "CCS2 DC Fast",
    status: "Bus Chassis Frame Assembly",
    remarks: "12 school bus chassis frames under assembly at Pithampur VECV plant",
  },
  {
    id: "EBF-0008",
    batchNo: "AZUL/PUN/2025/BAT-008",
    manufacturer: "AZUL Mobility Pune",
    zone: "West India Mumbai Pune Gujarat",
    category: " articulated 18M E-Bus 250kWh",
    description: "AZUL Mobility 18M articulated electric bus for PMPML Pune BRT corridor with 250kWh dual pack and 85 passenger capacity",
    seatingCapacity: 85,
    range: 350,
    batteryCapacity: 250,
    chargingTime: "6h Slow AC",
    motorPower: "250kW Rear",
    origin: "AZUL Mobility Plant Pune Maharashtra",
    depot: "PMPML Swargate Bus Depot Pune",
    city: "Pune",
    mode: "Multi-Axle Trailer 60T",
    prodDate: "2025-05-20",
    shipDate: "2025-05-28",
    transitDays: 8,
    contractValue: 265000000,
    chargingStandard: "Pantograph Overhead",
    status: "Route Deployment Active Running",
    remarks: "5 articulated buses on Katraj-Hadapsar BRT corridor Pune highest capacity e-bus",
  },
  {
    id: "EBF-0009",
    batchNo: "TATA/KOL/2025/BAT-009",
    manufacturer: "Tata Motors EV Dharwad",
    zone: "East India Kolkata Bhubaneswar",
    category: "12M Low Floor City Bus 60kWh",
    description: "Tata Starbus EV 12M low floor for WBTC Kolkata city routes with 60kWh battery and air suspension",
    seatingCapacity: 40,
    range: 175,
    batteryCapacity: 60,
    chargingTime: "3h DC CCS2",
    motorPower: "150kW Rear Axle",
    origin: "Tata Motors EV Plant Dharwad Karnataka",
    depot: "WBTC Belgharia Depot Kolkata",
    city: "Kolkata",
    mode: "Rail Wagon Rake 5 Bus",
    prodDate: "2025-06-05",
    shipDate: "2025-06-14",
    transitDays: 9,
    contractValue: 172000000,
    chargingStandard: "CCS2 DC Fast",
    status: "Dealer Depot Delivery Transit",
    remarks: "40 buses via rail rake from Dharwad to Kolkata Howrah freight terminal",
  },
  {
    id: "EBF-0010",
    batchNo: "OLEC/GUW/2025/BAT-010",
    manufacturer: "Olectra BYD Hyderabad",
    zone: "NE India Guwahati Shillong",
    category: "9M Midi Transit Bus 40kWh",
    description: "Olectra BYD K7 midi electric bus for ASTC Assam hill routes with 40kWh battery and gradeability for NE terrain",
    seatingCapacity: 35,
    range: 130,
    batteryCapacity: 40,
    chargingTime: "4h Fast Charge",
    motorPower: "180kW Mid-Mount",
    origin: "Olectra BYD Factory Hyderabad Telangana",
    depot: "ASTC Paltan Bazar Depot Guwahati",
    city: "Guwahati",
    mode: "Flatbed Car Carrier 40T",
    prodDate: "2025-07-02",
    shipDate: "2025-07-10",
    transitDays: 8,
    contractValue: 110000000,
    chargingStandard: "GB/T DC",
    status: "State Transport Depot Delivered",
    remarks: "20 midi buses delivered to ASTC Guwahati for Kamrup district routes",
  },
  {
    id: "EBF-0011",
    batchNo: "ASHOK/AHM/2025/BAT-011",
    manufacturer: "Ashok Leyland EV Chennai",
    zone: "West India Mumbai Pune Gujarat",
    category: "12M AC Electric Bus 120kWh",
    description: "Ashok Leyland Switch EiV 12 AC electric bus for AMTS Ahmedabad with 120kWh battery and Gujarat summer cooling",
    seatingCapacity: 38,
    range: 260,
    batteryCapacity: 120,
    chargingTime: "3h DC CCS2",
    motorPower: "200kW Dual Motor",
    origin: "Ashok Leyland EV Plant Hosur TN",
    depot: "AMTS Naroda Bus Depot Ahmedabad",
    city: "Ahmedabad",
    mode: "RoRo Ferry Coastal",
    prodDate: "2025-06-18",
    shipDate: "2025-06-25",
    transitDays: 7,
    contractValue: 210000000,
    chargingStandard: "CCS2 DC Fast",
    status: "Route Deployment Active Running",
    remarks: "25 AC buses running on SG Highway BRTS Ahmedabad with 45C cooling tested",
  },
  {
    id: "EBF-0012",
    batchNo: "SWITCH/BBS/2025/BAT-012",
    manufacturer: "Switch Mobility UK TN",
    zone: "East India Kolkata Bhubaneswar",
    category: "Electric School Bus 35kWh",
    description: "Switch Mobility EiV 12 electric school bus for Bhubaneswar smart city school routes with 35kWh safe LFP chemistry",
    seatingCapacity: 45,
    range: 110,
    batteryCapacity: 35,
    chargingTime: "2h Fast DC",
    motorPower: "120kW Single",
    origin: "Switch Mobility TN Plant Chennai",
    depot: "Bhubaneswar Smart City Bus Depot",
    city: "Bhubaneswar",
    mode: "Drive-On Delivery 12T",
    prodDate: "2025-07-03",
    shipDate: "2025-07-08",
    transitDays: 5,
    contractValue: 68000000,
    chargingStandard: "Type 2 AC",
    status: "Painting Body Build QC",
    remarks: "10 school buses under painting and body QC at Switch Chennai plant",
  },
  {
    id: "EBF-0013",
    batchNo: "JBM/BHOP/2025/BAT-013",
    manufacturer: "JBM Auto Greater Noida",
    zone: "Central India Bhopal Indore MP",
    category: "Battery Swap E-Bus 50kWh",
    description: "JBM Ecolife battery swap bus for Bhopal city bus service with MP first automated swap station network",
    seatingCapacity: 40,
    range: 190,
    batteryCapacity: 50,
    chargingTime: "Swap 5min",
    motorPower: "180kW Mid-Mount",
    origin: "JBM Auto Plant Greater Noida UP",
    depot: "Bhopal City Bus Depot MP Nagar",
    city: "Bhopal",
    mode: "Self-Drive Single 15T",
    prodDate: "2025-06-28",
    shipDate: "2025-07-02",
    transitDays: 4,
    contractValue: 145000000,
    chargingStandard: "Battery Swap Station",
    status: "Dealer Depot Delivery Transit",
    remarks: "15 swap buses en route Noida to Bhopal via NH44 with swap station cargo",
  },
  {
    id: "EBF-0014",
    batchNo: "PMI/SHIL/2025/BAT-014",
    manufacturer: "PMI Electro Mobility Chennai",
    zone: "NE India Guwahati Shillong",
    category: "Mini Electric Bus 25kWh",
    description: "PMI Electro 8M mini electric bus for Shillong steep gradient routes with 25kWh pack and regenerative braking",
    seatingCapacity: 30,
    range: 105,
    batteryCapacity: 25,
    chargingTime: "1.5h Ultra Fast",
    motorPower: "100kW Front Axle",
    origin: "PMI Electro Factory Chennai TN",
    depot: "Meghalaya Transport Shillong Depot",
    city: "Shillong",
    mode: "Flatbed Car Carrier 40T",
    prodDate: "2025-07-06",
    shipDate: "2025-07-15",
    transitDays: 9,
    contractValue: 55000000,
    chargingStandard: "CHAdeMO",
    status: "Battery Pack Integration Active",
    remarks: "8 mini buses in battery integration phase for Meghalaya challenging terrain deployment",
  },
];

const inProduction = records.filter(
  (r) =>
    r.status === "Bus Chassis Frame Assembly" ||
    r.status === "Battery Pack Integration Active" ||
    r.status === "Painting Body Build QC"
).length;
const deployed = records.filter(
  (r) =>
    r.status === "State Transport Depot Delivered" ||
    r.status === "Route Deployment Active Running"
).length;
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyDeploy = Array.from({ length: 12 }, (_, i) => ({
  m: MO[i],
  city: ri(8, 35, 18 + Math.sin(i * 0.5) * 10),
  intercity: ri(3, 15, 7 + Math.cos(i * 0.6) * 4),
  airport: ri(1, 8, 4 + Math.sin(i * 0.7) * 2),
  school: ri(2, 12, 5 + Math.cos(i * 0.8) * 3),
}));

const busTypeDist = [
  { n: "City 12M", v: 40 },
  { n: "Midi 9M", v: 15 },
  { n: "AC Premium 12M", v: 15 },
  { n: "Double Decker", v: 10 },
  { n: "Articulated 18M", v: 8 },
  { n: "Mini 8M", v: 7 },
  { n: "School 9M", v: 5 },
];

const rangePerCost = [
  { model: "Tata Starbus", range: 180, costKm: 2.8 },
  { model: "Olectra K9", range: 280, costKm: 3.1 },
  { model: "Ashok Circuit", range: 140, costKm: 2.5 },
  { model: "Switch DD", range: 250, costKm: 3.8 },
  { model: "JBM Swap", range: 200, costKm: 2.2 },
  { model: "PMI Mini", range: 100, costKm: 2.0 },
  { model: "Eicher School", range: 120, costKm: 2.3 },
  { model: "AZUL Artic", range: 350, costKm: 4.1 },
];

const oemMarket = MANUFACTURERS.map((m) => ({
  n: m.split(" ").slice(0, 2).join(" "),
  v: ri(50, 350, Math.round(180 + Math.random() * 100)),
}));

export default function ElectricBusFleetLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const filterGroups = [
    { key: "manufacturer", label: "Manufacturer", options: MANUFACTURERS.map((d) => ({ value: d, count: records.filter((rec) => rec.manufacturer === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map((c) => ({ value: c, count: records.filter((rec) => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map((s) => ({ value: s, count: records.filter((rec) => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map((z) => ({ value: z, count: records.filter((rec) => rec.zone === z).length })) },
    { key: "chargingStandard", label: "Charge Standard", options: ["CCS2 DC Fast", "GB/T DC", "CHAdeMO", "Type 2 AC", "Battery Swap Station", "Pantograph Overhead"].map((e) => ({ value: e, count: records.filter((rec) => rec.chargingStandard === e).length })) },
  ];
  const filtered = records.filter((r) => {
    if (search && !Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    for (const [key, vals] of Object.entries(activeFilters)) {
      if (vals.length > 0 && !vals.includes(String(r[key as keyof BusRecord]))) return false;
    }
    return true;
  });
  const toggleFilter = ((key: string, val: string) => setActiveFilters((p) => { const np = { ...p }; const arr = np[key] || []; np[key] = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]; return np; }));

  return (
    <div className="ebf-root p-6 space-y-6">
      <PageHeader title="Electric Bus Fleet Logistics" description="Indian electric bus fleet manufacturing, battery integration, delivery transit, depot deployment and route operations tracking across state transport undertakings under FAME II and PM E-Bus Sewa scheme with OEM-wise logistics visibility for Tata Motors, Olectra BYD, Ashok Leyland, JBM Auto, Switch Mobility, PMI Electro, Eicher and AZUL Mobility" />
      <ModuleBreadcrumb items={[{ label: "Automotive" }, { label: "E-Bus Fleet" }]} />
      <div className="ebf-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`ebf-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#065f46] text-white" : "text-gray-600 hover:bg-[#065f46]/10"}`}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="ebf-dashboard space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Fleet Size", value: `${records.length}`, color: "bg-[#065f46]" },
              { label: "In Production", value: `${inProduction}`, color: "bg-[#047857]" },
              { label: "Deployed Running", value: `${deployed}`, color: "bg-[#059669]" },
              { label: "Total Contract", value: formatINR(totalContract), color: "bg-[#064e3b]" },
            ].map((kpi, i) => (
              <div key={i} className={`${kpi.color} text-white rounded-lg p-4`}>
                <div className="text-xs opacity-80">{kpi.label}</div>
                <div className="text-xl font-bold mt-1">{kpi.value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly E-Bus Deployment by Segment</h3>
              <BarChart data={monthlyDeploy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="city" fill="#065f46" name="City" />
                <Bar dataKey="intercity" fill="#047857" name="Intercity" />
                <Bar dataKey="airport" fill="#10b981" name="Airport" />
                <Bar dataKey="school" fill="#34d399" name="School" />
              </BarChart>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">E-Bus Type Distribution</h3>
              <PieChart>
                <Pie data={busTypeDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>
                  {busTypeDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Range vs Cost per km by Bus Model</h3>
              <AreaChart data={rangePerCost}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" fontSize={10} angle={-20} textAnchor="end" height={50} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="range" fill="#065f46" stroke="#065f46" name="Range (km)" />
                <Area type="monotone" dataKey="costKm" fill="#10b981" stroke="#10b981" name="Cost/km (₹)" />
              </AreaChart>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">OEM Market Share (Buses Ordered)</h3>
              <BarChart data={oemMarket}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="v" fill="#047857" name="Buses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="ebf-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "E-Bus Fleet" }, { label: "Fleet Registry" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="ebf-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {"ID,Batch No,Manufacturer,Zone,Category,Description,Seats,Range (km),Battery (kWh),Charge Time,Motor Power,Origin,Depot,City,Mode,Prod Date,Ship Date,Transit (d),Contract (₹),Charge Standard,Status,Remarks"
                    .split(",")
                    .map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const sc = statusColor[r.status] || "slate";
                  return (
                    <tr
                      key={r.id}
                      className={`border-b ${sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-500" : ""}`}
                    >
                      <td className="px-3 py-2 font-medium">{r.id}</td>
                      <td className="px-3 py-2">{r.batchNo}</td>
                      <td className="px-3 py-2">{r.manufacturer}</td>
                      <td className="px-3 py-2">{r.zone}</td>
                      <td className="px-3 py-2">{r.category}</td>
                      <td className="px-3 py-2">{r.description}</td>
                      <td className="px-3 py-2 text-right">{r.seatingCapacity}</td>
                      <td className="px-3 py-2 text-right">{r.range}</td>
                      <td className="px-3 py-2 text-right">{r.batteryCapacity}</td>
                      <td className="px-3 py-2">{r.chargingTime}</td>
                      <td className="px-3 py-2">{r.motorPower}</td>
                      <td className="px-3 py-2">{r.origin}</td>
                      <td className="px-3 py-2">{r.depot}</td>
                      <td className="px-3 py-2">{r.city}</td>
                      <td className="px-3 py-2">{r.mode}</td>
                      <td className="px-3 py-2">{r.prodDate}</td>
                      <td className="px-3 py-2">{r.shipDate}</td>
                      <td className="px-3 py-2 text-center">{r.transitDays}</td>
                      <td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td>
                      <td className="px-3 py-2">{r.chargingStandard}</td>
                      <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.status}</span></td>
                      <td className="px-3 py-2">{r.remarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="ebf-analytics space-y-4">
          <ModuleBreadcrumb items={[{ label: "E-Bus Fleet" }, { label: "Fleet Analytics" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly E-Bus Deployment by Segment</h3>
              <BarChart data={monthlyDeploy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="city" fill="#065f46" name="City" />
                <Bar dataKey="intercity" fill="#047857" name="Intercity" />
                <Bar dataKey="airport" fill="#10b981" name="Airport" />
                <Bar dataKey="school" fill="#34d399" name="School" />
              </BarChart>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">E-Bus Type Distribution</h3>
              <PieChart>
                <Pie data={busTypeDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>
                  {busTypeDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Range vs Cost per km by Bus Model</h3>
              <AreaChart data={rangePerCost}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" fontSize={10} angle={-20} textAnchor="end" height={50} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="range" fill="#065f46" stroke="#065f46" name="Range (km)" />
                <Area type="monotone" dataKey="costKm" fill="#10b981" stroke="#10b981" name="Cost/km (₹)" />
              </AreaChart>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">OEM Market Share (Buses Ordered)</h3>
              <BarChart data={oemMarket}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="v" fill="#047857" name="Buses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="ebf-insights space-y-4">
          <ModuleBreadcrumb items={[{ label: "E-Bus Fleet" }, { label: "Insights" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-[#065f46] mb-2">FAME II and PM E-Bus Sewa Scheme</h3>
              <p className="text-xs text-gray-600">India's FAME II scheme with ₹10,000 crore outlay has accelerated electric bus adoption across state transport undertakings (STUs) with subsidy support of up to ₹55 lakh per bus for 12M low floor models. The PM E-Bus Sewa scheme supplements this with 10,000 e-buses planned across 169 cities through PPP model where central government bears operational cost subsidy for 10 years. Together these schemes target transforming 30% of city bus fleets to electric by 2030, reducing urban CO2 emissions by 3.5 million tonnes annually and cutting STU diesel expenditure by ₹12,000 crore per year across all participating cities.</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-[#065f46] mb-2">Tata Motors Leading 8000+ E-Bus Orders</h3>
              <p className="text-xs text-gray-600">Tata Motors has secured over 8,000 electric bus orders across state transport undertakings including DTC Delhi (1,500 buses), WBTC Kolkata (1,200 buses), UPSRTC Lucknow (800 buses), and BMTC Bangalore (600 buses). The Tata Starbus EV platform built at the Dharwad Karnataka manufacturing facility uses indigenously developed 60kWh LFP battery packs with CCS2 fast charging. Tata Motors has achieved 97% localisation on chassis and frame assembly with battery cell localisation targeted at 50% by FY2027 through Tata AutoComp and Tata Chemicals battery cell JV.</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-[#065f46] mb-2">Olectra BYD K9 Fleet and 99.5% Uptime Record</h3>
              <p className="text-xs text-gray-600">Olectra BYD has deployed over 600 K9 electric buses across Hyderabad, Surat, Pune and Mumbai achieving a remarkable 99.5% operational uptime record across its fleet. The BYD K9 platform uses proprietary 120kWh lithium iron phosphate (LFP) Blade Battery technology with GB/T DC charging standard. Olectra BYD's Hyderabad factory has capacity of 2,000 buses per year making it India's largest dedicated e-bus manufacturing facility. Their fleet has completed over 120 million cumulative electric kilometres saving approximately 48,000 tonnes of CO2 emissions versus equivalent diesel bus operations.</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-sm font-medium text-[#065f46] mb-2">Battery Swap Technology Revolutionizing Depot Charging</h3>
              <p className="text-xs text-gray-600">Battery swap technology is transforming electric bus depot charging infrastructure by reducing bus downtime from 3-4 hours to under 5 minutes per swap. JBM Auto and NTPC Vidyut Vyapar Nigam have partnered to deploy automated battery swap stations at 50 key depots across UP, MP and Maharashtra. Each swap station handles 200+ swaps daily with robotic battery handling, thermal management and automated health diagnostics. The battery-as-a-service model eliminates upfront battery cost from bus procurement reducing capital expenditure by 35% and enabling STUs to pay per-km energy cost of ₹2.2/km versus ₹3.5/km for fixed battery DC fast charging infrastructure.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
