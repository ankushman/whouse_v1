"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1e1b4b", "#312e81", "#4338ca", "#6366f1", "#0f0e2a", "#1a1845", "#252463", "#818cf8"];
const FABS = ["Tata Semiconductor Osmanabad", "Micron Semiconductor Gujarat", "IGSS Chandigarh Semiconductor Hub", "Kaynes Semiconductor Mysore", "SPEL Technologies Noida Fab", "Dixon Technologies Noida EMS", "CG Power Indore SCD Module", "Syrma SGS Chennai RF Fab"];
const CATEGORIES = ["300mm Silicon Wafer Lot Shipment", "ASML EUV Lithography Tool Module", "Cleanroom HEPA Filter CR 100 Unit", "Ultra-Pure DI Water System UPW 18MΩ", "Process Gas N2 H2 Ar Bulk Delivery", "Ion Implanter High Voltage Module", "CMP Chemical Mechanical Polish Slurry", "ATE Automated Test Equipment Handler"];
const SHIPMENT_STATUSES = ["Fab Equipment Vendor Warehouse", "Specialized Transport Clean Room", "Fab Receiving Bay ISO Class 5", "Cleanroom Installation Alignment", "Qualification Wafer Run Test", "Production Qualified Yield Stable"];
const ZONES = ["West India Gujarat Mumbai Pune", "South India Chennai Bangalore Mysore", "North India Noida Delhi NCR", "Central India Indore Bhopal", "East India Kolkata Ranchi", "NE India Guwahati Siliguri", "Deccan Hyderabad Telangana"];
const MODES = ["ISO Class 1 Air Ride Truck 20T", "Vibration-Damped Lowboy Trailer", "Temperature-Controlled Van 12T", "Air Freight 747F Charter", "Rail Box Wagon Shock Absorber", "Self-Propelled Modular SPMT 60T"];
const TABS = ["Dashboard", "Fab Equipment Registry", "Semiconductor Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Fab Equipment Vendor Warehouse": "slate", "Specialized Transport Clean Room": "blue", "Fab Receiving Bay ISO Class 5": "amber", "Cleanroom Installation Alignment": "orange", "Qualification Wafer Run Test": "red", "Production Qualified Yield Stable": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyWafer = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], wafer300: ri(50000, 200000, 120000 + Math.sin(i * 0.5) * 30000), wafer200: ri(20000, 80000, 45000 + Math.cos(i * 0.6) * 12000), rf: ri(5000, 20000, 11000 + Math.sin(i * 0.7) * 4000), mem: ri(30000, 100000, 60000 + Math.cos(i * 0.8) * 15000) }));
const equipDist = [{ n: "Lithography", v: 28 }, { n: "Etch & Deposition", v: 22 }, { n: "CMP & Clean", v: 15 }, { n: "Implant & Diffusion", v: 12 }, { n: "Metrology", v: 10 }, { n: "ATE Test", v: 8 }, { n: "UPW Gas", v: 3 }, { n: "Cleanroom HVAC", v: 2 }];
const yieldTarget = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(88, 97, 92 + Math.sin(i * 0.4) * 2)).toFixed(1), target: 95 }));
const fabPerf = FABS.map(f => ({ n: f.split(" ").slice(0, 2).join(" "), v: +ri(75, 98, 86 + Math.random() * 8).toFixed(0) }));

interface FabRecord { id: string; equipNo: string; fab: string; zone: string; category: string; description: string; waferSize: number; weight: number; manufacturer: string; origin: string; fabBay: string; cleanroomClass: string; mode: string; shipDate: string; installDate: string; transitDays: number; contractValue: number; processNode: string; status: string; remarks: string; }

const records: FabRecord[] = [
  { id: "SCL-0001", equipNo: "TSMC/OSD/2025/07-EUV-A1", fab: "Tata Semiconductor Osmanabad", zone: "West India Gujarat Mumbai Pune", category: "ASML EUV Lithography Tool Module", description: "ASML TWINSCAN NXE:3600D EUV 13.5nm Lithography System", waferSize: 300, weight: 150000, manufacturer: "ASML Netherlands Veldhoven", origin: "ASML Veldhoven Factory NL", fabBay: "Bay 01 Litho Bay ISO Class 3", cleanroomClass: "ISO 3", mode: "ISO Class 1 Air Ride Truck 20T", shipDate: "2025-07-08", installDate: "2025-07-18", transitDays: 10, contractValue: 950000000, processNode: "5nm EUV", status: "Cleanroom Installation Alignment", remarks: "ASML NXE 3600D EUV Tata Osmanabad Bay 01 litho cleanroom installation" },
  { id: "SCL-0002", equipNo: "MCR/GJR/2025/07-WFR-B2", fab: "Micron Semiconductor Gujarat", zone: "West India Gujarat Mumbai Pune", category: "300mm Silicon Wafer Lot Shipment", description: "300mm Prime Silicon Wafer 50000 Wafer Lot Grade A", waferSize: 300, weight: 25000, manufacturer: "SUMCO Japan Saga", origin: "SUMCO Saga Factory Japan", fabBay: "Wafer Store Room WS-101", cleanroomClass: "ISO 5", mode: "Temperature-Controlled Van 12T", shipDate: "2025-07-09", installDate: "2025-07-11", transitDays: 2, contractValue: 350000000, processNode: "DRAM 1α", status: "Production Qualified Yield Stable", remarks: "SUMCO 300mm 50K wafer lot Micron Gujarat wafer store qualified stable" },
  { id: "SCL-0003", equipNo: "IGS/CHD/2025/07-IMP-C3", fab: "IGSS Chandigarh Semiconductor Hub", zone: "North India Noida Delhi NCR", category: "Ion Implanter High Voltage Module", description: "Axcelis Purion H High Current Ion Implanter 5MeV", waferSize: 300, weight: 8000, manufacturer: "Axcelis Technologies USA", origin: "Axcelis Beverly Factory MA", fabBay: "Bay 03 Implant Bay ISO Class 4", cleanroomClass: "ISO 4", mode: "Vibration-Damped Lowboy Trailer", shipDate: "2025-07-07", installDate: "2025-07-14", transitDays: 7, contractValue: 180000000, processNode: "28nm Logic", status: "Qualification Wafer Run Test", remarks: "Axcelis Purion H 5MeV IGSS Chandigarh implant qualification wafer run" },
  { id: "SCL-0004", equipNo: "KYS/MYS/2025/07-HEPA-D4", fab: "Kaynes Semiconductor Mysore", zone: "South India Chennai Bangalore Mysore", category: "Cleanroom HEPA Filter CR 100 Unit", description: "HEPA ULPA Filter Bank 200 Units CR-100 Cleanroom Ceiling", waferSize: 200, weight: 5000, manufacturer: "Camfil India Bangalore", origin: "Camfil Bangalore Factory", fabBay: "Cleanroom CR-100 Ceiling Grid", cleanroomClass: "ISO 5", mode: "Flatbed Trailer 20T", shipDate: "2025-07-10", installDate: "2025-07-12", transitDays: 2, contractValue: 45000000, processNode: "OSAT Assembly", status: "Fab Receiving Bay ISO Class 5", remarks: "Camfil HEPA ULPA 200 Kaynes Mysore CR-100 ceiling receiving QC" },
  { id: "SCL-0005", equipNo: "SPL/NOD/2025/07-UPW-E5", fab: "SPEL Technologies Noida Fab", zone: "North India Noida Delhi NCR", category: "Ultra-Pure DI Water System UPW 18MΩ", description: "UPW System 18.2 MΩ-cm 50 TPD with TOC < 10 ppb Polisher", waferSize: 200, weight: 12000, manufacturer: "Pure Water Group Netherlands", origin: "PWG Barneveld Factory NL", fabBay: "Utility Building UPW-01", cleanroomClass: "ISO 7", mode: "Self-Propelled Modular SPMT 60T", shipDate: "2025-07-06", installDate: "2025-07-15", transitDays: 9, contractValue: 95000000, processNode: "Power Discrete", status: "Specialized Transport Clean Room", remarks: "PWG UPW 18.2MΩ 50TPD SPEL Noida utility building specialized transport" },
  { id: "SCL-0006", equipNo: "DXN/NOD/2025/07-GAS-F6", fab: "Dixon Technologies Noida EMS", zone: "North India Noida Delhi NCR", category: "Process Gas N2 H2 Ar Bulk Delivery", description: "Bulk High Purity N2 H2 Ar Gas Pipeline 10 Cylinder Bank ISO Tank", waferSize: 200, weight: 3000, manufacturer: "Air Liquide India Bangalore", origin: "AL Bangalore Cryo Plant", fabBay: "Gas Cabinet Bay 05 ISO Class 5", cleanroomClass: "ISO 5", mode: "Temperature-Controlled Van 12T", shipDate: "2025-07-08", installDate: "2025-07-09", transitDays: 1, contractValue: 22000000, processNode: "SMT Assembly", status: "Production Qualified Yield Stable", remarks: "AL N2 H2 Ar 10 bank Dixon Noida gas cabinet production qualified" },
  { id: "SCL-0007", equipNo: "CGP/IND/2025/07-CMP-G7", fab: "CG Power Indore SCD Module", zone: "Central India Indore Bhopal", category: "CMP Chemical Mechanical Polish Slurry", description: "CMP Slurry Cabot Microcare 2000L Silica Tungsten Polish", waferSize: 200, weight: 2400, manufacturer: "Cabot Microelectronics USA", origin: "Cabot Aurora CO Factory", fabBay: "Chemical Room CR-201", cleanroomClass: "ISO 6", mode: "Temperature-Controlled Van 12T", shipDate: "2025-07-09", installDate: "2025-07-12", transitDays: 3, contractValue: 35000000, processNode: "Power Module", status: "Fab Receiving Bay ISO Class 5", remarks: "Cabot CMP slurry 2000L CG Power Indore chemical room receiving QC" },
  { id: "SCL-0008", equipNo: "SYR/CHN/2025/07-ATE-H8", fab: "Syrma SGS Chennai RF Fab", zone: "South India Chennai Bangalore Mysore", category: "ATE Automated Test Equipment Handler", description: "Advantest T2000GS SoC ATE with 1024 Pin Handler Prober", waferSize: 200, weight: 6500, manufacturer: "Advantest Japan Tokyo", origin: "Advantest R&D Center Gunma", fabBay: "Test Floor Bay 08 ISO Class 6", cleanroomClass: "ISO 6", mode: "Vibration-Damped Lowboy Trailer", shipDate: "2025-07-07", installDate: "2025-07-16", transitDays: 9, contractValue: 320000000, processNode: "RF GaN 5G", status: "Qualification Wafer Run Test", remarks: "Advantest T2000GS 1024ch Syrma Chennai RF test qualification run" },
  { id: "SCL-0009", equipNo: "TSMC/OSD/2025/07-WFR-I9", fab: "Tata Semiconductor Osmanabad", zone: "West India Gujarat Mumbai Pune", category: "300mm Silicon Wafer Lot Shipment", description: "300mm SOI Wafer 30000 Lot Silicon-on-Insulator FD-SOI", waferSize: 300, weight: 15000, manufacturer: "Soitec France Bernin", origin: "Soitec Bernin Factory FR", fabBay: "Wafer Store WS-102", cleanroomClass: "ISO 5", mode: "Air Freight 747F Charter", shipDate: "2025-07-10", installDate: "2025-07-11", transitDays: 1, contractValue: 280000000, processNode: "22FDX SOI", status: "Specialized Transport Clean Room", remarks: "Soitec SOI 30K wafer Tata Osmanabad air freight 747F charter transit" },
  { id: "SCL-0010", equipNo: "MCR/GJR/2025/07-LTH-J10", fab: "Micron Semiconductor Gujarat", zone: "West India Gujarat Mumbai Pune", category: "ASML EUV Lithography Tool Module", description: "ASML NXT:1980Di DUV 193nm ArF Immersion Lithography Scanner", waferSize: 300, weight: 95000, manufacturer: "ASML Netherlands Veldhoven", origin: "ASML Veldhoven Factory NL", fabBay: "Bay 02 DUV Litho ISO Class 3", cleanroomClass: "ISO 3", mode: "ISO Class 1 Air Ride Truck 20T", shipDate: "2025-07-08", installDate: "2025-07-19", transitDays: 11, contractValue: 720000000, processNode: "DRAM 1β EUV", status: "Cleanroom Installation Alignment", remarks: "ASML NXT 1980Di DUV Micron Gujarat Bay 02 litho installation" },
  { id: "SCL-0011", equipNo: "IGS/CHD/2025/07-ETCH-K11", fab: "IGSS Chandigarh Semiconductor Hub", zone: "North India Noida Delhi NCR", category: "Etch and Deposition System", description: "LAM Research Kiyo CX 300mm Plasma Etch Chamber", waferSize: 300, weight: 5500, manufacturer: "LAM Research USA Fremont", origin: "LAM Research Fremont CA", fabBay: "Bay 04 Etch Bay ISO Class 4", cleanroomClass: "ISO 4", mode: "Vibration-Damped Lowboy Trailer", shipDate: "2025-07-09", installDate: "2025-07-17", transitDays: 8, contractValue: 450000000, processNode: "14nm FinFET", status: "Fab Equipment Vendor Warehouse", remarks: "LAM Kiyo CX plasma etch IGSS Chandigarh Bay 04 vendor warehouse" },
  { id: "SCL-0012", equipNo: "KYS/MYS/2025/07-PROBE-L12", fab: "Kaynes Semiconductor Mysore", zone: "South India Chennai Bangalore Mysore", category: "ATE Automated Test Equipment Handler", description: "Tokyo Electron P12XL Wafer Prober 300mm Cryo Stage", waferSize: 300, weight: 4000, manufacturer: "Tokyo Electron Japan Tokyo", origin: "TE Tokyo Nirasaki Factory", fabBay: "Probe Lab PL-201", cleanroomClass: "ISO 5", mode: "Air Freight 747F Charter", shipDate: "2025-07-11", installDate: "2025-07-12", transitDays: 1, contractValue: 150000000, processNode: "IoT MCU 28nm", status: "Production Qualified Yield Stable", remarks: "TE P12XL prober Kaynes Mysore probe lab cryo stage qualified stable" },
  { id: "SCL-0013", equipNo: "SPL/NOD/2025/07-HVAC-M13", fab: "SPEL Technologies Noida Fab", zone: "North India Noida Delhi NCR", category: "Cleanroom HEPA Filter CR 100 Unit", description: "CR-100 Cleanroom HVAC System 50000 CFM Fan Filter Unit 120 Unit", waferSize: 200, weight: 18000, manufacturer: "AAF India Chennai", origin: "AAF Chennai Factory", fabBay: "CR-100 Ceiling and Wall Grid", cleanroomClass: "ISO 4", mode: "Self-Propelled Modular SPMT 60T", shipDate: "2025-07-07", installDate: "2025-07-14", transitDays: 7, contractValue: 62000000, processNode: "Analog Mixed Signal", status: "Specialized Transport Clean Room", remarks: "AAF CR-100 HVAC 50K CFM 120 unit SPEL Noida specialized transport" },
  { id: "SCL-0014", equipNo: "SYR/CHN/2025/07-UPW-N14", fab: "Syrma SGS Chennai RF Fab", zone: "South India Chennai Bangalore Mysore", category: "Ultra-Pure DI Water System UPW 18MΩ", description: "UPW Polish System 18.2 MΩ-cm 30 TPD with UV TOC Oxidizer", waferSize: 200, weight: 8000, manufacturer: "Membrane Solutions India Pune", origin: "MSI Pune Factory", fabBay: "Utility UPW-02", cleanroomClass: "ISO 7", mode: "Rail Box Wagon Shock Absorber", shipDate: "2025-07-10", installDate: "2025-07-15", transitDays: 5, contractValue: 55000000, processNode: "RF GaN HEMT", status: "Fab Receiving Bay ISO Class 5", remarks: "MSI UPW 18.2MΩ 30TPD Syrma Chennai utility receiving QC" },
];

const transitCount = records.filter(r => r.status === "Specialized Transport Clean Room").length;
const activeCount = records.filter(r => r.status === "Production Qualified Yield Stable" || r.status === "Qualification Wafer Run Test").length;
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

export default function SemiconductorFabLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const filterGroups = [
    { key: "fab", label: "Fab", options: FABS.map(f => ({ value: f, count: records.filter(rec => rec.fab === f).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "mode", label: "Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
    { key: "processNode", label: "Process Node", options: Array.from(new Set(records.map(r => r.processNode))).map(p => ({ value: p, count: records.filter(rec => rec.processNode === p).length })) },
  ];
  const filtered = records.filter(r => {
    if (search && !Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(String(r[key as keyof FabRecord]))) return false; }
    return true;
  });
  const toggleFilter = ((key: string, val: string) => setActiveFilters(p => { const np = {...p}; const arr = np[key] || []; np[key] = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]; return np; }));

  return (
    <div className="sfl-root p-6 space-y-6">
      <PageHeader title="Semiconductor Fab Logistics" description="India semiconductor fab equipment logistics covering lithography EUV DUV, wafer shipment, cleanroom HEPA, UPW system, ion implanter, CMP slurry, ATE handler and process gas delivery for Tata Micron IGSS Kaynes SPEL Syrma CG Power Dixon fabs" />
      <div className="sfl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`sfl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#1e1b4b] text-white" : "text-gray-600 hover:bg-[#1e1b4b]/10"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="sfl-dashboard space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[{ label: "Total Equipment", value: `${records.length} Units`, color: "bg-[#1e1b4b]" }, { label: "Active/Qualifying", value: `${activeCount}`, color: "bg-[#4338ca]" }, { label: "In Transit", value: `${transitCount}`, color: "bg-[#312e81]" }, { label: "Total Contract", value: formatINR(totalContract), color: "bg-[#0f0e2a]" }].map((kpi, i) => (
              <div key={i} className={`${kpi.color} text-white rounded-lg p-4`}><div className="text-xs opacity-80">{kpi.label}</div><div className="text-xl font-bold mt-1">{kpi.value}</div></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Wafer Shipment (wafers)</h3><BarChart data={monthlyWafer}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="wafer300" fill="#1e1b4b" name="300mm" /><Bar dataKey="wafer200" fill="#4338ca" name="200mm" /><Bar dataKey="rf" fill="#6366f1" name="RF GaN" /><Bar dataKey="mem" fill="#818cf8" name="Memory" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Equipment Type Distribution</h3><PieChart><Pie data={equipDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{equipDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Fab Yield % vs Target 95%</h3><LineChart data={yieldTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} domain={[85, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#4338ca" name="Actual Yield" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target 95%" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Fab Performance Score</h3><BarChart data={fabPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#312e81" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="sfl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Semiconductor", href: "#" }, { label: "Fab Equipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="sfl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Equip No,Fab,Zone,Category,Description,Wafer (mm),Weight (kg),Manufacturer,Origin,Fab Bay,Cleanroom,Mode,Ship Date,Install Date,Transit (d),Contract (\u20b9),Process Node,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "slate";
              return (<tr key={r.id} className={`border-b ${sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-500" : ""}`}>
                <td className="px-3 py-2 font-medium">{r.id}</td>
                <td className="px-3 py-2">{r.equipNo}</td>
                <td className="px-3 py-2">{r.fab}</td>
                <td className="px-3 py-2">{r.zone}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2">{r.description}</td>
                <td className="px-3 py-2 text-right">{r.waferSize}</td>
                <td className="px-3 py-2 text-right">{r.weight.toLocaleString()}</td>
                <td className="px-3 py-2">{r.manufacturer}</td>
                <td className="px-3 py-2">{r.origin}</td>
                <td className="px-3 py-2">{r.fabBay}</td>
                <td className="px-3 py-2">{r.cleanroomClass}</td>
                <td className="px-3 py-2">{r.mode}</td>
                <td className="px-3 py-2">{r.shipDate}</td>
                <td className="px-3 py-2">{r.installDate}</td>
                <td className="px-3 py-2 text-center">{r.transitDays}</td>
                <td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.processNode}</span></td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.status}</span></td>
                <td className="px-3 py-2">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="sfl-analytics space-y-4">
          <ModuleBreadcrumb items={[{ label: "Semiconductor", href: "#" }, { label: "Semiconductor Analytics", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Wafer Shipment (wafers)</h3><BarChart data={monthlyWafer}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="wafer300" fill="#1e1b4b" name="300mm" /><Bar dataKey="wafer200" fill="#4338ca" name="200mm" /><Bar dataKey="rf" fill="#6366f1" name="RF GaN" /><Bar dataKey="mem" fill="#818cf8" name="Memory" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Equipment Type Distribution</h3><PieChart><Pie data={equipDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{equipDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Fab Yield % vs Target 95%</h3><LineChart data={yieldTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} domain={[85, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#4338ca" name="Actual Yield" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target 95%" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Fab Performance Score</h3><BarChart data={fabPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#312e81" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="sfl-insights space-y-4">
          <ModuleBreadcrumb items={[{ label: "Semiconductor", href: "#" }, { label: "Insights", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#1e1b4b] mb-2">India Semiconductor Mission ₹76,000 Crore</h3><p className="text-xs text-gray-600">The India Semiconductor Mission (ISM) under MeitY allocated ₹76,000 crore for semiconductor manufacturing incentives. Tata Electronics Osmanabad and Micron Gujarat Sanand are the first two greenfield fab projects approved, targeting 28nm and advanced DRAM nodes respectively. The scheme offers 50% CAPEX subsidy for fabs, attracting global players and creating a domestic semiconductor ecosystem from design to packaging.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#1e1b4b] mb-2">ASML EUV-DUV Lithography Supply Chain</h3><p className="text-xs text-gray-600">ASML dominates advanced lithography with EUV (13.5nm) and DUV (193nm ArF immersion) systems. India fabs require secure supply chains for EUV pellicles, photoresist chemicals from JSR Tokyo Ohka, and mask blanks from AGC. Transit from Netherlands to India via air charter takes 2-3 days with specialized cleanroom packaging and vibration isolation for optical column integrity.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#1e1b4b] mb-2">OSAT Ecosystem Kaynes SPEL Syrma CG Power</h3><p className="text-xs text-gray-600">India OSAT (Outsourced Semiconductor Assembly and Test) players Kaynes, SPEL Technologies, Syrma SGS and CG Power are expanding 200mm and 300mm capacity for power discrete, RF GaN, IoT MCU and automotive chips. The OSAT segment requires specialized ATE equipment from Advantest and Teradyne, wafer probers from Tokyo Electron, and die attach wire bond packaging materials from Kulicke Soffa and ASM Pacific.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#1e1b4b] mb-2">Cleanroom UPW Gas Infrastructure Critical</h3><p className="text-xs text-gray-600">Semiconductor fabs demand ISO Class 3-5 cleanrooms with 50,000-100,000 CFM HEPA/ULPA filtration, 18.2 MΩ-cm ultra-pure water systems, and bulk high-purity N2 H2 Ar process gas delivery. Cleanroom HVAC, UPW and gas infrastructure account for 25-30% of total fab CAPEX. Indian suppliers Camfil and Air Liquide are expanding capacity to support the domestic fab buildout with localized cleanroom filtration and gas distribution systems.</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
