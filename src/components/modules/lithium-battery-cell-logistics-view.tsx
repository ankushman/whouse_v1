"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#78350f", "#92400e", "#a16207", "#ca8a04", "#5c2d07", "#713f12", "#854d0e", "#eab308"];
const MANUFACTURERS = ["Tata AutoComp EV Battery Pune", "Exicom Energy Systems Gurgaon", "Amara Raja Advanced Chennai", "Ola Electric Cell Factory TN", "Mahindra ELVA Battery Pune", "Reliance NEW Age Battery Jamnagar", "Ather Energy Cell Bengaluru", "Lucid Motors India Partner Hyderabad"];
const CATEGORIES = ["Li-Ion NMC 811 Prismatic Cell 50Ah", "Li-Ion LFP Cylindrical Cell 280Ah", "Li-Ion NMC 622 Pouch Cell 100Ah", "Solid-State Sulfide Electrolyte Cell", "Sodium-Ion Prismatic Cell 120Ah", "Li-Ion NCA 21700 Cylindrical 5Ah", "Battery Management System BMS Master", "Thermal Management Cooling Plate"];
const SHIPMENT_STATUSES = ["Cell Materials Cathode Anode Ready", "Dry Room Assembly Line Production", "Formation Cycling Aging Chamber", "Quality QC X-Ray CT Inspection", "Pack Assembly Module Integration", "Shipped OEM Vehicle Plant Delivered"];
const ZONES = ["West India Pune Mumbai Gujarat", "South India Chennai Bangalore TN", "North India Gurgaon Delhi NCR", "East India Kolkata Ranchi", "Central India Indore Bhopal", "NE India Guwahati", "Telangana Hyderabad"];
const MODES = ["Temperature-Controlled Van 12T", "Dry Room Seal Container 20ft", "Flatbed Trailer 20T", "Air Freight 747F Charter", "Rail Box Wagon", "Mini Truck 3.5T"];
const TABS = ["Dashboard", "Cell Registry", "Battery Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Cell Materials Cathode Anode Ready": "slate", "Dry Room Assembly Line Production": "blue", "Formation Cycling Aging Chamber": "orange", "Quality QC X-Ray CT Inspection": "red", "Pack Assembly Module Integration": "amber", "Shipped OEM Vehicle Plant Delivered": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyCell = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], nmc: ri(2000, 8000, 4500 + Math.sin(i * 0.5) * 1500), lfp: ri(3000, 12000, 7000 + Math.cos(i * 0.6) * 2500), solidState: ri(100, 500, 250 + Math.sin(i * 0.7) * 80), sodiumIon: ri(500, 2000, 1100 + Math.cos(i * 0.8) * 400) }));
const chemDist = [{ n: "NMC 811", v: 30 }, { n: "LFP", v: 35 }, { n: "NMC 622", v: 15 }, { n: "Solid State", v: 5 }, { n: "Na-Ion", v: 10 }, { n: "NCA 21700", v: 5 }];
const costTarget = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(95, 135, 115 + Math.sin(i * 0.4) * 10)).toFixed(0), target: 100 }));
const mfgPerf = MANUFACTURERS.map(m => ({ n: m.split(" ").slice(0, 2).join(" "), v: +ri(72, 98, 85 + Math.random() * 8).toFixed(0) }));

interface CellRecord { id: string; batchNo: string; manufacturer: string; zone: string; category: string; description: string; cellCapacity: number; weight: number; cathodeSupplier: string; anodeSupplier: string; origin: string; cellPlant: string; dryRoomClass: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; chemistry: string; status: string; remarks: string; }

const records: CellRecord[] = [
  { id: "LBC-0001", batchNo: "TAC/PUN/2025/07-NMC-A1", manufacturer: "Tata AutoComp EV Battery Pune", zone: "West India Pune Mumbai Gujarat", category: "Li-Ion NMC 811 Prismatic Cell 50Ah", description: "NMC 811 Prismatic 50Ah 3.7V EV Cell Grade A Premium", cellCapacity: 50, weight: 1200, cathodeSupplier: "Umicore Belgium Olen", anodeSupplier: "BTR New Material China Shenzhen", origin: "Tata AutoComp Chakan Plant", cellPlant: "Tata AutoComp Chakan Dry Room", dryRoomClass: "ISO Class 5", mode: "Temperature-Controlled Van 12T", prodDate: "2025-07-06", shipDate: "2025-07-10", transitDays: 4, contractValue: 85000000, chemistry: "NMC 811", status: "Shipped OEM Vehicle Plant Delivered", remarks: "NMC 811 50Ah Grade A Tata Chakan shipped Tata Motors Pune plant" },
  { id: "LBC-0002", batchNo: "EXI/GUR/2025/07-LFP-B2", manufacturer: "Exicom Energy Systems Gurgaon", zone: "North India Gurgaon Delhi NCR", category: "Li-Ion LFP Cylindrical Cell 280Ah", description: "LFP 280Ah Cylindrical 3.2V Energy Storage Grade B", cellCapacity: 280, weight: 5500, cathodeSupplier: "CATL China Fujian", anodeSupplier: "Shanshan China Ningbo", origin: "Exicom Gurgaon Plant", cellPlant: "Exicom Gurgaon Cell Line 2", dryRoomClass: "ISO Class 6", mode: "Dry Room Seal Container 20ft", prodDate: "2025-07-08", shipDate: "2025-07-12", transitDays: 4, contractValue: 120000000, chemistry: "LFP", status: "Dry Room Assembly Line Production", remarks: "LFP 280Ah Cylindrical Exicom Gurgaon dry room assembly line" },
  { id: "LBC-0003", batchNo: "AMR/CHN/2025/07-NMC-C3", manufacturer: "Amara Raja Advanced Chennai", zone: "South India Chennai Bangalore TN", category: "Li-Ion NMC 622 Pouch Cell 100Ah", description: "NMC 622 Pouch 100Ah 3.65V EV Powertrain Module", cellCapacity: 100, weight: 2100, cathodeSupplier: "EcoPro South Korea", anodeSupplier: "Posco S. Korea Seoul", origin: "Amara Raja Tirupati Plant", cellPlant: "Amara Raja Tirupati Cell Line 1", dryRoomClass: "ISO Class 5", mode: "Temperature-Controlled Van 12T", prodDate: "2025-07-07", shipDate: "2025-07-11", transitDays: 4, contractValue: 150000000, chemistry: "NMC 622", status: "Formation Cycling Aging Chamber", remarks: "NMC 622 100Ah pouch Amara Raja Tirupati formation cycling aging" },
  { id: "LBC-0004", batchNo: "OLA/TN/2025/07-SS-D4", manufacturer: "Ola Electric Cell Factory TN", zone: "South India Chennai Bangalore TN", category: "Solid-State Sulfide Electrolyte Cell", description: "Solid-State Sulfide Electrolyte 20Ah 3.8V Prototype Cell", cellCapacity: 20, weight: 450, cathodeSupplier: "QuantumScape USA", anodeSupplier: "Toyota Solid State JP", origin: "Ola Futurefactory Krishnagiri", cellPlant: "Ola Krishnagiri Solid State Lab", dryRoomClass: "ISO Class 3", mode: "Air Freight 747F Charter", prodDate: "2025-07-09", shipDate: "2025-07-10", transitDays: 1, contractValue: 45000000, chemistry: "Solid State", status: "Quality QC X-Ray CT Inspection", remarks: "Solid-state sulfide 20Ah Ola Krishnagiri QC X-Ray CT inspection" },
  { id: "LBC-0005", batchNo: "MAH/PUN/2025/07-LFP-E5", manufacturer: "Mahindra ELVA Battery Pune", zone: "West India Pune Mumbai Gujarat", category: "Li-Ion LFP Cylindrical Cell 280Ah", description: "LFP 280Ah Cylindrical 3.2V Mahindra XUV400 Battery Pack", cellCapacity: 280, weight: 5500, cathodeSupplier: "CALB China Luoyang", anodeSupplier: "BTR New Material China", origin: "Mahindra ELVA Chakan Plant", cellPlant: "Mahindra ELVA Chakan Dry Room", dryRoomClass: "ISO Class 5", mode: "Flatbed Trailer 20T", prodDate: "2025-07-06", shipDate: "2025-07-11", transitDays: 5, contractValue: 180000000, chemistry: "LFP", status: "Pack Assembly Module Integration", remarks: "LFP 280Ah Mahindra XUV400 pack assembly module integration" },
  { id: "LBC-0006", batchNo: "REL/JMN/2025/07-NAI-F6", manufacturer: "Reliance NEW Age Battery Jamnagar", zone: "West India Pune Mumbai Gujarat", category: "Sodium-Ion Prismatic Cell 120Ah", description: "Sodium-Ion Prismatic 120Ah 3.1V Faradion Licensed Grid Storage", cellCapacity: 120, weight: 2800, cathodeSupplier: "Faradion UK Oxford", anodeSupplier: "Hard Carbon India Local", origin: "Reliance Dhirubhai Ambani Green Giga", cellPlant: "Reliance Jamnagar Na-Ion Cell Line", dryRoomClass: "ISO Class 6", mode: "Dry Room Seal Container 20ft", prodDate: "2025-07-08", shipDate: "2025-07-13", transitDays: 5, contractValue: 95000000, chemistry: "Na-Ion", status: "Cell Materials Cathode Anode Ready", remarks: "Na-Ion 120Ah Faradion licensed Reliance Jamnagar materials ready" },
  { id: "LBC-0007", batchNo: "ATH/BLR/2025/07-NCA-G7", manufacturer: "Ather Energy Cell Bengaluru", zone: "Telangana Hyderabad", category: "Li-Ion NCA 21700 Cylindrical 5Ah", description: "NCA 21700 Cylindrical 5Ah 3.6V Ather 450X Gen3 Scooter", cellCapacity: 5, weight: 70, cathodeSupplier: "Sumitomo Japan Osaka", anodeSupplier: "Hitachi Chemical Japan", origin: "Ather Cell Hosur Plant", cellPlant: "Ather Hosur Cell Line 3", dryRoomClass: "ISO Class 5", mode: "Mini Truck 3.5T", prodDate: "2025-07-07", shipDate: "2025-07-09", transitDays: 2, contractValue: 28000000, chemistry: "NCA 21700", status: "Shipped OEM Vehicle Plant Delivered", remarks: "NCA 21700 5Ah Ather 450X Gen3 shipped Hosur delivered" },
  { id: "LBC-0008", batchNo: "LUC/HYD/2025/07-NMC-H8", manufacturer: "Lucid Motors India Partner Hyderabad", zone: "Telangana Hyderabad", category: "Li-Ion NMC 811 Prismatic Cell 50Ah", description: "NMC 811 Prismatic 50Ah 3.7V Premium Grade A Luxury EV", cellCapacity: 50, weight: 1200, cathodeSupplier: "BASF Germany Ludwigshafen", anodeSupplier: "SGL Carbon Germany", origin: "Lucid Partner Hyderabad Assembly", cellPlant: "Hyderabad Cell Assembly Dry Room", dryRoomClass: "ISO Class 5", mode: "Air Freight 747F Charter", prodDate: "2025-07-10", shipDate: "2025-07-11", transitDays: 1, contractValue: 65000000, chemistry: "NMC 811", status: "Quality QC X-Ray CT Inspection", remarks: "NMC 811 50Ah Grade A Lucid Hyderabad QC X-Ray inspection" },
  { id: "LBC-0009", batchNo: "TAC/PUN/2025/07-BMS-I9", manufacturer: "Tata AutoComp EV Battery Pune", zone: "West India Pune Mumbai Gujarat", category: "Battery Management System BMS Master", description: "BMS Master Controller 96S 400A with CAN FD Automotive Grade", cellCapacity: 0, weight: 15, cathodeSupplier: "NXP Netherlands", anodeSupplier: "Infineon Germany", origin: "Tata AutoComp Chakan Plant", cellPlant: "Tata AutoComp Electronics Line", dryRoomClass: "ISO Class 7", mode: "Mini Truck 3.5T", prodDate: "2025-07-08", shipDate: "2025-07-10", transitDays: 2, contractValue: 32000000, chemistry: "NMC 811", status: "Pack Assembly Module Integration", remarks: "BMS 96S 400A CAN FD Tata Chakan pack assembly integration" },
  { id: "LBC-0010", batchNo: "EXI/GUR/2025/07-COOL-J10", manufacturer: "Exicom Energy Systems Gurgaon", zone: "North India Gurgaon Delhi NCR", category: "Thermal Management Cooling Plate", description: "Liquid Cold Plate Aluminum 50 Unit Battery Pack TMS Cooling", cellCapacity: 0, weight: 3500, cathodeSupplier: "Dana Thermal India", anodeSupplier: "Bohn Aluminum India", origin: "Exicom Gurgaon Plant", cellPlant: "Exicom Thermal Assembly Line", dryRoomClass: "ISO Class 7", mode: "Flatbed Trailer 20T", prodDate: "2025-07-09", shipDate: "2025-07-12", transitDays: 3, contractValue: 18000000, chemistry: "LFP", status: "Dry Room Assembly Line Production", remarks: "Cold plate 50 unit TMS Exicom Gurgaon dry room assembly" },
  { id: "LBC-0011", batchNo: "AMR/CHN/2025/07-LFP-K11", manufacturer: "Amara Raja Advanced Chennai", zone: "South India Chennai Bangalore TN", category: "Li-Ion LFP Cylindrical Cell 280Ah", description: "LFP 280Ah Cylindrical 3.2V Amara Raja Grid Storage BESS", cellCapacity: 280, weight: 5500, cathodeSupplier: "CALB China Luoyang", anodeSupplier: "Shanshan China Ningbo", origin: "Amara Raja Tirupati Plant", cellPlant: "Amara Raja Tirupati Cell Line 2", dryRoomClass: "ISO Class 5", mode: "Rail Box Wagon", prodDate: "2025-07-06", shipDate: "2025-07-12", transitDays: 6, contractValue: 200000000, chemistry: "LFP", status: "Formation Cycling Aging Chamber", remarks: "LFP 280Ah Amara Raja BESS grid storage formation aging" },
  { id: "LBC-0012", batchNo: "MAH/PUN/2025/07-NAI-L12", manufacturer: "Mahindra ELVA Battery Pune", zone: "West India Pune Mumbai Gujarat", category: "Sodium-Ion Prismatic Cell 120Ah", description: "Sodium-Ion Prismatic 120Ah 3.1V Mahindra Treo Plus 3W", cellCapacity: 120, weight: 2800, cathodeSupplier: "Tiamat France", anodeSupplier: "Hard Carbon Local India", origin: "Mahindra ELVA Chakan Plant", cellPlant: "Mahindra ELVA Na-Ion Lab", dryRoomClass: "ISO Class 6", mode: "Temperature-Controlled Van 12T", prodDate: "2025-07-10", shipDate: "2025-07-14", transitDays: 4, contractValue: 55000000, chemistry: "Na-Ion", status: "Cell Materials Cathode Anode Ready", remarks: "Na-Ion 120Ah Mahindra Treo Plus 3W materials cathode anode ready" },
  { id: "LBC-0013", batchNo: "OLA/TN/2025/07-NMC-M13", manufacturer: "Ola Electric Cell Factory TN", zone: "South India Chennai Bangalore TN", category: "Li-Ion NMC 811 Prismatic Cell 50Ah", description: "NMC 811 Prismatic 50Ah 3.7V Ola S1 Pro Gen2 Pack", cellCapacity: 50, weight: 1200, cathodeSupplier: "EcoPro South Korea", anodeSupplier: "BTR New Material China", origin: "Ola Futurefactory Krishnagiri", cellPlant: "Ola Krishnagiri Cell Line 1", dryRoomClass: "ISO Class 5", mode: "Mini Truck 3.5T", prodDate: "2025-07-07", shipDate: "2025-07-09", transitDays: 2, contractValue: 72000000, chemistry: "NMC 811", status: "Shipped OEM Vehicle Plant Delivered", remarks: "NMC 811 50Ah Ola S1 Pro Gen2 shipped Krishnagiri delivered" },
  { id: "LBC-0014", batchNo: "REL/JMN/2025/07-SS-N14", manufacturer: "Reliance NEW Age Battery Jamnagar", zone: "West India Pune Mumbai Gujarat", category: "Solid-State Sulfide Electrolyte Cell", description: "Solid-State Sulfide Electrolyte 40Ah 3.8V R&D Pilot Cell", cellCapacity: 40, weight: 900, cathodeSupplier: "Samsung SDI Korea", anodeSupplier: "Toyota Solid State JP", origin: "Reliance Dhirubhai Ambani Green Giga", cellPlant: "Reliance Jamnagar Solid State Pilot", dryRoomClass: "ISO Class 3", mode: "Air Freight 747F Charter", prodDate: "2025-07-08", shipDate: "2025-07-09", transitDays: 1, contractValue: 85000000, chemistry: "Solid State", status: "Quality QC X-Ray CT Inspection", remarks: "Solid-state sulfide 40Ah Reliance pilot QC X-Ray CT inspection" },
];

const transitCount = records.filter(r => r.status === "Shipped OEM Vehicle Plant Delivered").length;
const productionCount = records.filter(r => r.status === "Dry Room Assembly Line Production" || r.status === "Formation Cycling Aging Chamber").length;
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
const totalCapacity = records.reduce((s, r) => s + r.cellCapacity, 0);

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

export default function LithiumBatteryCellLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const filterGroups = [
    { key: "manufacturer", label: "Manufacturer", options: MANUFACTURERS.map(m => ({ value: m, count: records.filter(rec => rec.manufacturer === m).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "chemistry", label: "Chemistry", options: Array.from(new Set(records.map(r => r.chemistry))).map(c => ({ value: c, count: records.filter(rec => rec.chemistry === c).length })) },
  ];
  const filtered = records.filter(r => {
    if (search && !Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(String(r[key as keyof CellRecord]))) return false; }
    return true;
  });
  const toggleFilter = ((key: string, val: string) => setActiveFilters(p => { const np = {...p}; const arr = np[key] || []; np[key] = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]; return np; }));

  return (
    <div className="lbc-root p-6 space-y-6">
      <PageHeader title="Lithium Battery Cell Logistics" description="India lithium-ion battery cell manufacturing logistics covering NMC 811 LFP NMC 622 solid-state sodium-ion cell production, cathode anode material supply, dry room assembly, formation cycling aging, BMS master controller, thermal management cooling plate for Tata Ola Mahindra Ather Reliance Amara Raja Exicom EV and grid storage" />
      <div className="lbc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`lbc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#78350f] text-white" : "text-gray-600 hover:bg-[#78350f]/10"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="lbc-dashboard space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[{ label: "Total Cell Capacity", value: `${totalCapacity.toLocaleString()} Ah`, color: "bg-[#78350f]" }, { label: "In Production", value: `${productionCount}`, color: "bg-[#a16207]" }, { label: "Shipped Delivered", value: `${transitCount}`, color: "bg-[#92400e]" }, { label: "Total Contract", value: formatINR(totalContract), color: "bg-[#5c2d07]" }].map((kpi, i) => (
              <div key={i} className={`${kpi.color} text-white rounded-lg p-4`}><div className="text-xs opacity-80">{kpi.label}</div><div className="text-xl font-bold mt-1">{kpi.value}</div></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Cell Production (cells)</h3><BarChart data={monthlyCell}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="nmc" fill="#78350f" name="NMC" /><Bar dataKey="lfp" fill="#a16207" name="LFP" /><Bar dataKey="solidState" fill="#ca8a04" name="Solid State" /><Bar dataKey="sodiumIon" fill="#eab308" name="Na-Ion" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Cell Chemistry Distribution</h3><PieChart><Pie data={chemDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{chemDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Cell Cost ($/kWh) vs Target $100/kWh</h3><LineChart data={costTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} domain={[80, 140]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#78350f" name="Actual Cost" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target $100" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Manufacturer Yield Score</h3><BarChart data={mfgPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#92400e" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="lbc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Li-Ion Cell", href: "#" }, { label: "Cell Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="lbc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Batch No,Manufacturer,Zone,Category,Description,Capacity (Ah),Weight (kg),Cathode Supplier,Anode Supplier,Origin,Cell Plant,Dry Room,Mode,Prod Date,Ship Date,Transit (d),Contract (\u20b9),Chemistry,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "slate";
              return (<tr key={r.id} className={`border-b ${sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-500" : ""}`}>
                <td className="px-3 py-2 font-medium">{r.id}</td>
                <td className="px-3 py-2">{r.batchNo}</td>
                <td className="px-3 py-2">{r.manufacturer}</td>
                <td className="px-3 py-2">{r.zone}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2">{r.description}</td>
                <td className="px-3 py-2 text-right">{r.cellCapacity || "-"}</td>
                <td className="px-3 py-2 text-right">{r.weight.toLocaleString()}</td>
                <td className="px-3 py-2">{r.cathodeSupplier}</td>
                <td className="px-3 py-2">{r.anodeSupplier}</td>
                <td className="px-3 py-2">{r.origin}</td>
                <td className="px-3 py-2">{r.cellPlant}</td>
                <td className="px-3 py-2">{r.dryRoomClass}</td>
                <td className="px-3 py-2">{r.mode}</td>
                <td className="px-3 py-2">{r.prodDate}</td>
                <td className="px-3 py-2">{r.shipDate}</td>
                <td className="px-3 py-2 text-center">{r.transitDays}</td>
                <td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.chemistry}</span></td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.status}</span></td>
                <td className="px-3 py-2">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="lbc-analytics space-y-4">
          <ModuleBreadcrumb items={[{ label: "Li-Ion Cell", href: "#" }, { label: "Battery Analytics", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Cell Production (cells)</h3><BarChart data={monthlyCell}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="nmc" fill="#78350f" name="NMC" /><Bar dataKey="lfp" fill="#a16207" name="LFP" /><Bar dataKey="solidState" fill="#ca8a04" name="Solid State" /><Bar dataKey="sodiumIon" fill="#eab308" name="Na-Ion" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Cell Chemistry Distribution</h3><PieChart><Pie data={chemDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{chemDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Cell Cost ($/kWh) vs Target</h3><LineChart data={costTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} domain={[80, 140]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#78350f" name="Actual" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target $100" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Manufacturer Yield Score</h3><BarChart data={mfgPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#92400e" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="lbc-insights space-y-4">
          <ModuleBreadcrumb items={[{ label: "Li-Ion Cell", href: "#" }, { label: "Insights", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#78350f] mb-2">PLI Scheme ₹18,100 Crore ACC Battery</h3><p className="text-xs text-gray-600">India PLI Advanced Chemistry Cell (ACC) scheme allocated ₹18,100 crore for 50 GWh battery cell manufacturing capacity. Reliance, Ola, Rajesh Exports, Hyundai and Amara Raja won bids. Tata AutoComp and Exicom are expanding LFP and NMC cell production. The scheme targets $100/kWh cell cost and 60% domestic value addition by 2028, creating 1.5 lakh direct jobs across cathode anode separator electrolyte supply chain.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#78350f] mb-2">Cathode Anode Supply Chain Critical Dependency</h3><p className="text-xs text-gray-600">India imports 90%+ of battery cathode (NMC LFP) and anode (graphite silicon) materials from China (BTR Shanshan CALB CATL), Korea (EcoPro Sumitomo LG Chem) and Japan (Hitachi Posco). Umicore Belgium supplies NMC precursors. Government is pushing for domestic cathode production via Khanij Bidesh India Ltd (KBIL) for lithium cobalt nickel sourcing from Australia Chile Congo to reduce China dependency.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#78350f] mb-2">Solid-State Battery R&D Race India</h3><p className="text-xs text-gray-600">Ola Electric and Reliance NEW Age are investing in solid-state battery R&D with sulfide electrolyte technology licensed from QuantumScape and Toyota. Solid-state promises 400+ Wh/kg energy density, 15-minute fast charging and improved safety. India targets pilot production by 2027 with 40Ah cells, scaling to 100Ah by 2030 for premium EV and aviation applications.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#78350f] mb-2">Sodium-Ion Grid Storage Low Cost Alternative</h3><p className="text-xs text-gray-600">Sodium-ion batteries using Faradion and Tiamat technology offer 50-70% cost reduction vs LFP for grid storage, eliminating lithium cobalt dependency. Reliance Jamnagar and Mahindra are piloting 120Ah Na-Ion prismatic cells for BESS and 3W EV. India has abundant sodium (salt) reserves. Na-Ion cells use hard carbon anode from local biomass and sodium cathode, enabling 100% domestic material sourcing by 2028.</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
