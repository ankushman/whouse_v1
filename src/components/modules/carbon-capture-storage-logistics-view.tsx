"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1c1917", "#44403c", "#78716c", "#a8a29e", "#0c0a09", "#292524", "#3f3f46", "#d6d3d1"];
const OPERATORS = ["NTPC Vindhyachal CCUS Plant", "Tata Steel Jamshedpur CCUS", "Dalmia Cement CCUS Tamil Nadu", "Reliance Jamnagar Carbon Capture", "Adani Mundra CCU Green Ammonia", "JSW Vijayanagar Steel CCUS", "UltraTech Cement CCUS Gujarat", "IOCL Panipat CO2 Capture Refinery"];
const CATEGORIES = ["Post-Combustion Amine Scrubber Unit", "Pre-Combustion Syngas Shift Reactor", "Oxy-Fuel Combustion ASU Oxygen", "Membrane CO2 Separation Module", "Calcium Looping Carbonation Reactor", "Direct Air Capture DAC Fan Filter", "CO2 Compression 150 Bar Unit", "CO2 Transport Pipeline API 5L"];
const SHIPMENT_STATUSES = ["Capture Module Factory Manufactured", "Heavy Transport Specialized Trailer", "Site Receiving Foundation Ready", "Installation Commissioning Start", "Capture Rate Qualification Test", "Carbon Stored Pipeline Injected"];
const ZONES = ["North India Delhi NCR Panipat", "West India Mumbai Gujarat Jamnagar", "East India Jamshedpur Dhanbad", "South India Chennai Tamil Nadu", "Central India MP Chhattisgarh Vindy", "Rajasthan Jaisalmer Barmer Basin", "NE India Assam Coal Belt"];
const MODES = ["Specialized Heavy Trailer 80T", "ODC Open Top Container 40T", "Rail Wagon Special Consignment", "Barge Coastal Shipping", "Self-Propelled Modular SPMT 100T", "Flatbed Trailer 30T"];
const TABS = ["Dashboard", "Capture Equipment Registry", "CCUS Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Capture Module Factory Manufactured": "slate", "Heavy Transport Specialized Trailer": "blue", "Site Receiving Foundation Ready": "amber", "Installation Commissioning Start": "orange", "Capture Rate Qualification Test": "red", "Carbon Stored Pipeline Injected": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyCapture = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], postComb: ri(50, 200, 120 + Math.sin(i * 0.5) * 40), preComb: ri(20, 80, 45 + Math.cos(i * 0.6) * 15), oxyFuel: ri(10, 50, 25 + Math.sin(i * 0.7) * 10), dac: ri(1, 10, 4 + Math.cos(i * 0.8) * 2) }));
const techDist = [{ n: "Post-Combustion", v: 40 }, { n: "Pre-Combustion", v: 20 }, { n: "Oxy-Fuel", v: 15 }, { n: "Membrane", v: 10 }, { n: "Calcium Looping", v: 8 }, { n: "Direct Air Capture", v: 7 }];
const storageTarget = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(1.5, 4.0, 2.8 + Math.sin(i * 0.4) * 0.5)).toFixed(1), target: 3.5 }));
const opPerf = OPERATORS.map(o => ({ n: o.split(" ").slice(0, 2).join(" "), v: +ri(65, 98, 80 + Math.random() * 10).toFixed(0) }));

interface CCUSRecord { id: string; projectNo: string; operator: string; zone: string; category: string; description: string; captureRate: number; weight: number; manufacturer: string; origin: string; plantSite: string; storageType: string; mode: string; shipDate: string; installDate: string; transitDays: number; contractValue: number; co2Source: string; status: string; remarks: string; }

const records: CCUSRecord[] = [
  { id: "CCS-0001", projectNo: "NTPC/VIN/2025/07-PCS-A1", operator: "NTPC Vindhyachal CCUS Plant", zone: "Central India MP Chhattisgarh Vindy", category: "Post-Combustion Amine Scrubber Unit", description: "Post-Combustion MEA Amine Scrubber 500 kt CO2/year Captured", captureRate: 500, weight: 35000, manufacturer: "Fluor Corporation USA", origin: "Fluor Greenville SC Factory", plantSite: "NTPC Vindhyachal STPS", storageType: "Deep Saline Aquifer", mode: "Specialized Heavy Trailer 80T", shipDate: "2025-07-08", installDate: "2025-07-18", transitDays: 10, contractValue: 450000000, co2Source: "Coal Power Plant Flue Gas", status: "Installation Commissioning Start", remarks: "MEA scrubber 500 kt/yr NTPC Vindhyachal installation commissioning" },
  { id: "CCS-0002", projectNo: "TST/JSD/2025/07-PCS-B2", operator: "Tata Steel Jamshedpur CCUS", zone: "East India Jamshedpur Dhanbad", category: "Pre-Combustion Syngas Shift Reactor", description: "Pre-Combustion WGS Reactor 200 kt CO2/year Blast Furnace Gas", captureRate: 200, weight: 22000, manufacturer: "Linde Engineering Germany", origin: "Linde Engineering Pullach", plantSite: "Tata Steel Jamshedpur Works BF", storageType: "Enhanced Oil Recovery", mode: "ODC Open Top Container 40T", shipDate: "2025-07-09", installDate: "2025-07-16", transitDays: 7, contractValue: 320000000, co2Source: "Blast Furnace Syngas", status: "Heavy Transport Specialized Trailer", remarks: "WGS pre-combustion 200 kt Tata Steel BF transport specialized" },
  { id: "CCS-0003", projectNo: "DCM/TN/2025/07-CL-C3", operator: "Dalmia Cement CCUS Tamil Nadu", zone: "South India Chennai Tamil Nadu", category: "Calcium Looping Carbonation Reactor", description: "Calcium Looping CFB Carbonator 100 kt CO2/year Cement Kiln", captureRate: 100, weight: 18000, manufacturer: "LafargeHolcim Switzerland", origin: "LafargeHolcim Research Lyon", plantSite: "Dalmia Cements Ariyalur Plant", storageType: "Mineral Carbonation", mode: "Barge Coastal Shipping", shipDate: "2025-07-07", installDate: "2025-07-15", transitDays: 8, contractValue: 180000000, co2Source: "Cement Kiln Flue Gas", status: "Capture Rate Qualification Test", remarks: "Calcium looping 100 kt Dalmia Ariyalur capture rate test" },
  { id: "CCS-0004", projectNo: "REL/JMN/2025/07-MEM-D4", operator: "Reliance Jamnagar Carbon Capture", zone: "West India Mumbai Gujarat Jamnagar", category: "Membrane CO2 Separation Module", description: "Polymeric Membrane CO2 Separator 150 kt/year Refinery FCC", captureRate: 150, weight: 8000, manufacturer: "Air Liquide France Paris", origin: "Air Liquide Paris Campus", plantSite: "Reliance Jamnagar Refinery FCC", storageType: "Green Ammonia Urea", mode: "Air Cargo 747F Charter", shipDate: "2025-07-10", installDate: "2025-07-11", transitDays: 1, contractValue: 250000000, co2Source: "Refinery FCC Off-Gas", status: "Carbon Stored Pipeline Injected", remarks: "Membrane 150 kt Reliance Jamnagar FCC carbon stored injected" },
  { id: "CCS-0005", projectNo: "ADN/MUN/2025/07-PCS-E5", operator: "Adani Mundra CCU Green Ammonia", zone: "West India Mumbai Gujarat Jamnagar", category: "CO2 Compression 150 Bar Unit", description: "Multi-Stage CO2 Compressor 150 Bar 300 kt/year for Urea Synthesis", captureRate: 300, weight: 25000, manufacturer: "Siemens Energy Germany", origin: "Siemens Energy Berlin", plantSite: "Adani Mundra Port Fertilizer", storageType: "Green Ammonia Urea", mode: "Specialized Heavy Trailer 80T", shipDate: "2025-07-06", installDate: "2025-07-17", transitDays: 11, contractValue: 380000000, co2Source: "Ammonia Plant Process Gas", status: "Site Receiving Foundation Ready", remarks: "150 bar compressor 300 kt Adani Mundra foundation ready receiving" },
  { id: "CCS-0006", projectNo: "JSW/VJN/2025/07-PCS-F6", operator: "JSW Vijayanagar Steel CCUS", zone: "South India Chennai Tamil Nadu", category: "Post-Combustion Amine Scrubber Unit", description: "AMP Amine Scrubber 250 kt CO2/year Steel BF Sinter Plant", captureRate: 250, weight: 28000, manufacturer: "Mitsubishi Heavy Industries Japan", origin: "MHI Hiroshima Machinery", plantSite: "JSW Vijayanagar Works BF", storageType: "Deep Saline Aquifer", mode: "Self-Propelled Modular SPMT 100T", shipDate: "2025-07-08", installDate: "2025-07-19", transitDays: 11, contractValue: 420000000, co2Source: "Steel BF Sinter Flue Gas", status: "Heavy Transport Specialized Trailer", remarks: "AMP amine scrubber 250 kt JSW Vijayanagar SPMT transport" },
  { id: "CCS-0007", projectNo: "UTK/GJR/2025/07-DAC-G7", operator: "UltraTech Cement CCUS Gujarat", zone: "West India Mumbai Gujarat Jamnagar", category: "Direct Air Capture DAC Fan Filter", description: "DAC Solid Sorbent 10 kt CO2/year Direct Air Capture Pilot", captureRate: 10, weight: 5000, manufacturer: "Carbon Engineering Canada", origin: "CE Squamish BC Plant", plantSite: "UltraTech Cement Gujarat Plant", storageType: "Mineral Carbonation", mode: "Flatbed Trailer 30T", shipDate: "2025-07-09", installDate: "2025-07-14", transitDays: 5, contractValue: 95000000, co2Source: "Ambient Air Direct Capture", status: "Capture Rate Qualification Test", remarks: "DAC solid sorbent 10 kt pilot UltraTech Gujarat capture test" },
  { id: "CCS-0008", projectNo: "IOCL/PNP/2025/07-OXY-H8", operator: "IOCL Panipat CO2 Capture Refinery", zone: "North India Delhi NCR Panipat", category: "Oxy-Fuel Combustion ASU Oxygen", description: "Air Separation Unit ASU 500 TPD O2 for Oxy-Fuel 180 kt CO2/yr", captureRate: 180, weight: 45000, manufacturer: "Air Products USA Allentown", origin: "Air Products Allentown Factory", plantSite: "IOCL Panipat Refinery FCC", storageType: "Enhanced Oil Recovery", mode: "Self-Propelled Modular SPMT 100T", shipDate: "2025-07-07", installDate: "2025-07-20", transitDays: 13, contractValue: 520000000, co2Source: "Refinery Oxy-Fuel Flue Gas", status: "Capture Module Factory Manufactured", remarks: "ASU 500 TPD O2 IOCL Panipat oxy-fuel factory manufactured" },
  { id: "CCS-0009", projectNo: "NTPC/VIN/2025/07-CMP-I9", operator: "NTPC Vindhyachal CCUS Plant", zone: "Central India MP Chhattisgarh Vindy", category: "CO2 Transport Pipeline API 5L", description: "API 5L X65 12-inch CO2 Pipeline 80km to Storage Site", captureRate: 0, weight: 60000, manufacturer: "Jindal Saw Mumbai", origin: "Jindal Saw Kandla Pipe Mill", plantSite: "Vindhyachal to Saline Aquifer Route", storageType: "Deep Saline Aquifer", mode: "Rail Wagon Special Consignment", shipDate: "2025-07-10", installDate: "2025-07-17", transitDays: 7, contractValue: 280000000, co2Source: "Pipeline Transport", status: "Installation Commissioning Start", remarks: "API 5L X65 80km CO2 pipeline NTPC Vindhyachal installation" },
  { id: "CCS-0010", projectNo: "TST/JSD/2025/07-DAC-J10", operator: "Tata Steel Jamshedpur CCUS", zone: "East India Jamshedpur Dhanbad", category: "Direct Air Capture DAC Fan Filter", description: "DAC Liquid Solvent KOH 5 kt CO2/year R&D Pilot", captureRate: 5, weight: 3500, manufacturer: "Climeworks Switzerland Zurich", origin: "Climeworks Hinwil Plant", plantSite: "Tata Steel Jamshedpur R&D Center", storageType: "Mineral Carbonation", mode: "Air Cargo 747F Charter", shipDate: "2025-07-11", installDate: "2025-07-12", transitDays: 1, contractValue: 68000000, co2Source: "Ambient Air DAC", status: "Carbon Stored Pipeline Injected", remarks: "DAC KOH 5 kt pilot Tata Steel R&D carbon stored injected" },
  { id: "CCS-0011", projectNo: "DCM/TN/2025/07-MEM-K11", operator: "Dalmia Cement CCUS Tamil Nadu", zone: "South India Chennai Tamil Nadu", category: "Membrane CO2 Separation Module", description: "Ceramic Membrane 50 kt CO2/year High Temp Cement Preheater", captureRate: 50, weight: 6000, manufacturer: "BASF Germany Ludwigshafen", origin: "BASF Ludwigshafen Factory", plantSite: "Dalmia Cements Dalmiapuram Plant", storageType: "Green Concrete Curing", mode: "Barge Coastal Shipping", shipDate: "2025-07-08", installDate: "2025-07-15", transitDays: 7, contractValue: 120000000, co2Source: "Cement Preheater Gas", status: "Site Receiving Foundation Ready", remarks: "Ceramic membrane 50 kt Dalmia Dalmiapuram receiving foundation" },
  { id: "CCS-0012", projectNo: "REL/JMN/2025/07-CL-L12", operator: "Reliance Jamnagar Carbon Capture", zone: "West India Mumbai Gujarat Jamnagar", category: "Calcium Looping Carbonation Reactor", description: "Calcium Looping Carbonator 120 kt CO2/year Petrochemical FCC", captureRate: 120, weight: 20000, manufacturer: "ThyssenKrupp Germany", origin: "TK Uhde Dortmund Factory", plantSite: "Reliance Jamnagar Petrochemical", storageType: "Green Ammonia Urea", mode: "Specialized Heavy Trailer 80T", shipDate: "2025-07-09", installDate: "2025-07-18", transitDays: 9, contractValue: 210000000, co2Source: "Petrochemical FCC Off-Gas", status: "Heavy Transport Specialized Trailer", remarks: "Calcium looping 120 kt Reliance petrochemical specialized transport" },
  { id: "CCS-0013", projectNo: "ADN/MUN/2025/07-PCS-M13", operator: "Adani Mundra CCU Green Ammonia", zone: "West India Mumbai Gujarat Jamnagar", category: "Post-Combustion Amine Scrubber Unit", description: "MEA Scrubber 400 kt CO2/year Natural Gas Reforming H2 Plant", captureRate: 400, weight: 30000, manufacturer: "Shell Cansolv Canada", origin: "Shell Cansolv Ottawa Factory", plantSite: "Adani Mundra Green H2 Plant", storageType: "Green Ammonia Synthesis", mode: "ODC Open Top Container 40T", shipDate: "2025-07-07", installDate: "2025-07-19", transitDays: 12, contractValue: 480000000, co2Source: "SMR Flue Gas H2 Plant", status: "Capture Rate Qualification Test", remarks: "MEA 400 kt Adani green H2 SMR capture rate qualification" },
  { id: "CCS-0014", projectNo: "JSW/VJN/2025/07-CMP-N14", operator: "JSW Vijayanagar Steel CCUS", zone: "South India Chennai Tamil Nadu", category: "CO2 Transport Pipeline API 5L", description: "API 5L X70 16-inch CO2 Pipeline 50km to EOR Site", captureRate: 0, weight: 40000, manufacturer: "Welspun Corp Mumbai", origin: "Welspun Anjar Pipe Mill", plantSite: "JSW Vijayanagar to EOR Basin", storageType: "Enhanced Oil Recovery", mode: "Rail Wagon Special Consignment", shipDate: "2025-07-10", installDate: "2025-07-16", transitDays: 6, contractValue: 180000000, co2Source: "Pipeline Transport", status: "Installation Commissioning Start", remarks: "API 5L X70 50km CO2 pipeline JSW Vijayanagar installation" },
];

const transitCount = records.filter(r => r.status === "Heavy Transport Specialized Trailer").length;
const liveCount = records.filter(r => r.status === "Carbon Stored Pipeline Injected").length;
const totalCapture = records.reduce((s, r) => s + r.captureRate, 0);
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

export default function CarbonCaptureStorageLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(o => ({ value: o, count: records.filter(rec => rec.operator === o).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "storageType", label: "Storage", options: Array.from(new Set(records.map(r => r.storageType))).map(s => ({ value: s, count: records.filter(rec => rec.storageType === s).length })) },
  ];
  const filtered = records.filter(r => {
    if (search && !Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(String(r[key as keyof CCUSRecord]))) return false; }
    return true;
  });
  const toggleFilter = ((key: string, val: string) => setActiveFilters(p => { const np = {...p}; const arr = np[key] || []; np[key] = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]; return np; }));

  return (
    <div className="ccs-root p-6 space-y-6">
      <PageHeader title="Carbon Capture Storage Logistics" description="India CCUS carbon capture utilization and storage logistics covering post-combustion amine scrubber, pre-combustion syngas shift, oxy-fuel ASU, membrane CO2 separation, calcium looping, direct air capture DAC, CO2 compression 150 bar, pipeline transport for NTPC Tata Steel Dalmia Reliance Adani JSW UltraTech IOCL power steel cement refinery" />
      <div className="ccs-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`ccs-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#1c1917] text-white" : "text-gray-600 hover:bg-[#1c1917]/10"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="ccs-dashboard space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[{ label: "Total Capture Capacity", value: `${totalCapture.toLocaleString()} kt/yr`, color: "bg-[#1c1917]" }, { label: "Carbon Stored", value: `${liveCount} Sites`, color: "bg-[#44403c]" }, { label: "In Transit", value: `${transitCount}`, color: "bg-[#292524]" }, { label: "Total Contract", value: formatINR(totalContract), color: "bg-[#0c0a09]" }].map((kpi, i) => (
              <div key={i} className={`${kpi.color} text-white rounded-lg p-4`}><div className="text-xs opacity-80">{kpi.label}</div><div className="text-xl font-bold mt-1">{kpi.value}</div></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly CO2 Capture (kt CO2)</h3><BarChart data={monthlyCapture}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="postComb" fill="#1c1917" name="Post-Comb" /><Bar dataKey="preComb" fill="#44403c" name="Pre-Comb" /><Bar dataKey="oxyFuel" fill="#78716c" name="Oxy-Fuel" /><Bar dataKey="dac" fill="#a8a29e" name="DAC" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">CCUS Technology Distribution</h3><PieChart><Pie data={techDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">CO2 Stored (MT) vs Target 3.5 MT/yr</h3><LineChart data={storageTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} domain={[1, 5]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#1c1917" name="Stored MT" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target 3.5 MT" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Operator CCUS Performance</h3><BarChart data={opPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#292524" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="ccs-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "CCUS", href: "#" }, { label: "Capture Equipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="ccs-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Project No,Operator,Zone,Category,Description,Capture (kt/yr),Weight (kg),Manufacturer,Origin,Plant Site,Storage Type,Mode,Ship Date,Install Date,Transit (d),Contract (\u20b9),CO2 Source,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "slate";
              return (<tr key={r.id} className={`border-b ${sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-500" : ""}`}>
                <td className="px-3 py-2 font-medium">{r.id}</td>
                <td className="px-3 py-2">{r.projectNo}</td>
                <td className="px-3 py-2">{r.operator}</td>
                <td className="px-3 py-2">{r.zone}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2">{r.description}</td>
                <td className="px-3 py-2 text-right">{r.captureRate || "-"}</td>
                <td className="px-3 py-2 text-right">{r.weight.toLocaleString()}</td>
                <td className="px-3 py-2">{r.manufacturer}</td>
                <td className="px-3 py-2">{r.origin}</td>
                <td className="px-3 py-2">{r.plantSite}</td>
                <td className="px-3 py-2">{r.storageType}</td>
                <td className="px-3 py-2">{r.mode}</td>
                <td className="px-3 py-2">{r.shipDate}</td>
                <td className="px-3 py-2">{r.installDate}</td>
                <td className="px-3 py-2 text-center">{r.transitDays}</td>
                <td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.co2Source}</span></td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.status}</span></td>
                <td className="px-3 py-2">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="ccs-analytics space-y-4">
          <ModuleBreadcrumb items={[{ label: "CCUS", href: "#" }, { label: "CCUS Analytics", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly CO2 Capture (kt CO2)</h3><BarChart data={monthlyCapture}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="postComb" fill="#1c1917" name="Post-Comb" /><Bar dataKey="preComb" fill="#44403c" name="Pre-Comb" /><Bar dataKey="oxyFuel" fill="#78716c" name="Oxy-Fuel" /><Bar dataKey="dac" fill="#a8a29e" name="DAC" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">CCUS Technology Distribution</h3><PieChart><Pie data={techDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">CO2 Stored (MT) vs Target</h3><LineChart data={storageTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} domain={[1, 5]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#1c1917" name="Stored MT" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target 3.5 MT" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Operator CCUS Performance</h3><BarChart data={opPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#292524" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="ccs-insights space-y-4">
          <ModuleBreadcrumb items={[{ label: "CCUS", href: "#" }, { label: "Insights", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#1c1917] mb-2">India CCUS Mission Net Zero 2070 Target</h3><p className="text-xs text-gray-600">India committed to net zero by 2070 at COP26 Glasgow. NTPC, Tata Steel, Dalmia Cement and Reliance are leading CCUS deployment with post-combustion amine scrubbers, pre-combustion WGS reactors and membrane separation modules. India coal-fired power plants emit 1.8 Gt CO2/year, steel and cement add 800 Mt. CCUS can capture 35-40% of industrial CO2, targeting 750 Mt CO2/year capture capacity by 2050 under the National CCUS Mission.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#1c1917] mb-2">CO2 Storage in Deccan Basalt and Saline Aquifers</h3><p className="text-xs text-gray-600">India has 500+ Gt CO2 storage potential in Deccan Basalt formations (Maharashtra MP Gujarat), deep saline aquifers in Rajasthan-Gujarat basins, and depleted oil gas fields in Assam Mumbai Offshore. ONGC is mapping storage sites. CO2 pipeline infrastructure from capture plants to injection sites requires 80-200 km API 5L X65 X70 steel pipelines at 100-150 bar, similar to natural gas pipeline logistics.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#1c1917] mb-2">Direct Air Capture DAC Growing from Pilot Scale</h3><p className="text-xs text-gray-600">UltraTech Cement and Tata Steel are piloting Direct Air Capture from Climeworks and Carbon Engineering, capturing CO2 directly from ambient air using solid sorbent (DAC-1) and liquid solvent (DAC-2) technology. DAC cost at $400-600/ton CO2 is falling toward $200-300 target by 2030. India R&D at IIT Bombay and CSIR-NCL is developing low-cost amine-functionalized silica sorbents for high temperature high humidity Indian climate conditions.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#1c1917] mb-2">Carbon Utilization Green Concrete Ammonia Methanol</h3><p className="text-xs text-gray-600">Captured CO2 is utilized in green concrete curing (Dalmia UltraTech), green ammonia synthesis (Adani Reliance IOCL), methanol production (NTPC), enhanced oil recovery (ONGC OIL India), and mineral carbonation building blocks. India CCUS policy incentivizes utilization over storage via carbon credits under PAT scheme. Green ammonia from captured CO2 and green H2 is India pathway to $2/kg ammonia export competing with grey ammonia from Gadwar-Kandla-Mundra.</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
