"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";
import { LeafyGreen } from "lucide-react";

const COLORS = ["#064e3b", "#0d7356", "#159971", "#1dbf8c", "#043626", "#075f45", "#0a7657", "#34d399"];
const DEVELOPERS = ["NTPC Green Hydrogen Dadri", "Reliance Jamnagar Green H2", "Adani Total Kandla GH2", "IOCL Panipat Bio-Hydrogen", "Indian Oil H2 Buses Delhi", "Tata Steel Jamshedpur H2-DRI", "JSW Steel Vijayanagar H2", "L&T Hydrogen Electrolyzer"];
const CATEGORIES = ["Alkaline Electrolyzer 5MW Stack", "PEM Electrolyzer 2MW Module", "Solid Oxide Electrolyzer SOEC", "Hydrogen Storage Tank 350 Bar", "Fuel Cell Stack 200kW PEMFC", "H2 Compressor 500 Bar Recip", "Pipeline Seamless Steel API 5L", "Green Ammonia Synthesis Reactor"];
const SHIPMENT_STATUSES = ["Electrolyzer Factory Dispatched", "Transport Rail Road Specialized", "Project Site Receiving QC", "Electrolyzer Installation Grid", "Commissioning H2 Production Test", "Green Hydrogen Producing Live"];
const ZONES = ["North India Delhi NCR Panipat", "West India Mumbai Jamnagar Kandla", "East India Jamshedpur Dhanbad", "South India Chennai Mangalore", "Central India Bhopal Nagpur", "NE India Assam Tripura", "Rajasthan Jaisalmer Barmer Solar"];
const MODES = ["Specialized Heavy Trailer 80T", "Flatbed Trailer 30T", "Rail Wagon Special Consignment", "ODC Open Top Container", "Self-Propelled Modular Transporter", "Barge Coastal Shipping"];
const TABS = ["Dashboard", "Electrolyzer Registry", "H2 Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Electrolyzer Factory Dispatched": "blue", "Transport Rail Road Specialized": "amber", "Project Site Receiving QC": "blue", "Electrolyzer Installation Grid": "orange", "Commissioning H2 Production Test": "red", "Green Hydrogen Producing Live": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyProd = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], alkaline: ri(200, 800, 450 + Math.sin(i * 0.5) * 150), pem: ri(100, 400, 220 + Math.cos(i * 0.6) * 60), soec: ri(20, 100, 50 + Math.sin(i * 0.7) * 20), ammonia: ri(50, 200, 110 + Math.cos(i * 0.8) * 40) }));
const techDist = [{ n: "Alkaline", v: 45 }, { n: "PEM", v: 30 }, { n: "SOEC", v: 15 }, { n: "AEM", v: 7 }, { n: "Solid State", v: 3 }];
const costTarget = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(3.5, 5.5, 4.5 + Math.sin(i * 0.4) * 0.5)).toFixed(1), target: 4 }));
const developerPerf = DEVELOPERS.map(d => ({ n: d.split(" ").slice(0, 2).join(" "), v: +ri(60, 95, 78 + Math.random() * 10).toFixed(0) }));

interface HydrogenRecord { id: string; projectNo: string; developer: string; zone: string; category: string; description: string; capacity: number; weight: number; manufacturer: string; origin: string; projectSite: string; segment: string; mode: string; shipDate: string; installDate: string; transitDays: number; contractValue: number; electrolyzerType: string; status: string; remarks: string; }

const records: HydrogenRecord[] = [
  { id: "GHY-0001", projectNo: "NTPC/DAD/2025/07-ALK-A1", developer: "NTPC Green Hydrogen Dadri", zone: "North India Delhi NCR Panipat", category: "Alkaline Electrolyzer 5MW Stack", description: "5MW Alkaline Electrolyzer Green H2 Production Plant Dadri UP", capacity: 5, weight: 25000, manufacturer: "L&T Hydrogen Electrolyzer Hazira", origin: "L&T Hazira Factory Gujarat", projectSite: "NTPC Dadri Thermal Plant", segment: "North India Grid", mode: "Specialized Heavy Trailer 80T", shipDate: "2025-07-08", installDate: "2025-07-13", transitDays: 5, contractValue: 180000000, electrolyzerType: "Alkaline", status: "Commissioning H2 Production Test", remarks: "L&T 5MW alkaline electrolyzer NTPC Dadri green H2 commissioning" },
  { id: "GHY-0002", projectNo: "REL/JMN/2025/07-PEM-B2", developer: "Reliance Jamnagar Green H2", zone: "West India Mumbai Jamnagar Kandla", category: "PEM Electrolyzer 2MW Module", description: "PEM Electrolyzer 10MW Module Dhirubhai Ambani Green Energy Giga Complex", capacity: 10, weight: 18000, manufacturer: "ThyssenKrupp Nucera Germany", origin: "TK Nucera Dortmund Factory", projectSite: "Jamnagar Green Energy Giga Complex", segment: "Refinery Decarbonization", mode: "ODC Open Top Container", shipDate: "2025-07-09", installDate: "2025-07-15", transitDays: 6, contractValue: 450000000, electrolyzerType: "PEM", status: "Transport Rail Road Specialized", remarks: "TK Nucera 10MW PEM Reliance Jamnagar refinery decarbonization transit" },
  { id: "GHY-0003", projectNo: "ADN/KDL/2025/07-SOEC-C3", developer: "Adani Total Kandla GH2", zone: "West India Mumbai Jamnagar Kandla", category: "Solid Oxide Electrolyzer SOEC", description: "SOEC 3MW High Temp Electrolyzer Adani TotalEnergies Kandla Port", capacity: 3, weight: 35000, manufacturer: "Bloom Energy USA", origin: "Bloom Energy San Jose Factory", projectSite: "Adani Total Kandla GH2 Complex", segment: "Port Green Ammonia", mode: "Barge Coastal Shipping", shipDate: "2025-07-07", installDate: "2025-07-14", transitDays: 7, contractValue: 350000000, electrolyzerType: "SOEC", status: "Project Site Receiving QC", remarks: "Bloom SOEC 3MW Adani Total Kandla port green ammonia receiving QC" },
  { id: "GHY-0004", projectNo: "IOCL/PNP/2025/07-STOR-D4", developer: "IOCL Panipat Bio-Hydrogen", zone: "North India Delhi NCR Panipat", category: "Hydrogen Storage Tank 350 Bar", description: "Type IV Composite H2 Storage Tank 350 Bar 10 Units for Bio-H2 Refinery", capacity: 2, weight: 8000, manufacturer: "Hexagon Purus Norway", origin: "Hexagon Purus Ålesund Norway", projectSite: "IOCL Panipat Refinery", segment: "Bio-Hydrogen Refinery", mode: "Rail Wagon Special Consignment", shipDate: "2025-07-06", installDate: "2025-07-11", transitDays: 5, contractValue: 120000000, electrolyzerType: "Alkaline", status: "Electrolyzer Factory Dispatched", remarks: "Hexagon 350 bar 10-tank IOCL Panipat bio-H2 storage factory dispatched" },
  { id: "GHY-0005", projectNo: "IOCL/DEL/2025/07-FC-E5", developer: "Indian Oil H2 Buses Delhi", zone: "North India Delhi NCR Panipat", category: "Fuel Cell Stack 200kW PEMFC", description: "200kW PEMFC Fuel Cell Stack 50 Buses Delhi NCR Hydrogen Mobility", capacity: 10, weight: 5000, manufacturer: "Bharat Heavy Electricals BHEL Hyderabad", origin: "BHEL Hyderabad FC Division", projectSite: "IOCL H2 Bus Depot Delhi Dwarka", segment: "Delhi H2 Mobility", mode: "Flatbed Trailer 30T", shipDate: "2025-07-08", installDate: "2025-07-10", transitDays: 2, contractValue: 250000000, electrolyzerType: "PEM", status: "Electrolyzer Installation Grid", remarks: "BHEL 200kW PEMFC 50 bus IOCL Delhi Dwarka grid installation" },
  { id: "GHY-0006", projectNo: "TATA/JSD/2025/07-ALK-F6", developer: "Tata Steel Jamshedpur H2-DRI", zone: "East India Jamshedpur Dhanbad", category: "Alkaline Electrolyzer 5MW Stack", description: "20MW Alkaline Electrolyzer for Direct Reduced Iron DRI Green Steel", capacity: 20, weight: 65000, manufacturer: "John Cockerill Belgium", origin: "JC Seraing Factory Belgium", projectSite: "Tata Steel Jamshedpur Works", segment: "Green Steel H2-DRI", mode: "Specialized Heavy Trailer 80T", shipDate: "2025-07-10", installDate: "2025-07-16", transitDays: 6, contractValue: 680000000, electrolyzerType: "Alkaline", status: "Green Hydrogen Producing Live", remarks: "JC 20MW alkaline Tata Steel Jamshedpur H2-DRI green steel producing" },
  { id: "GHY-0007", projectNo: "JSW/VJN/2025/07-PEM-G7", developer: "JSW Steel Vijayanagar H2", zone: "South India Chennai Mangalore", category: "PEM Electrolyzer 2MW Module", description: "15MW PEM Electrolyzer JSW Vijayanagar Blast Furnace H2 Injection", capacity: 15, weight: 28000, manufacturer: "ITM Power UK", origin: "ITM Power Sheffield Factory", projectSite: "JSW Steel Vijayanagar Works", segment: "BF H2 Injection Steel", mode: "ODC Open Top Container", shipDate: "2025-07-09", installDate: "2025-07-15", transitDays: 6, contractValue: 520000000, electrolyzerType: "PEM", status: "Transport Rail Road Specialized", remarks: "ITM 15MW PEM JSW Vijayanagar BF H2 injection transit ODC" },
  { id: "GHY-0008", projectNo: "L&T/HZR/2025/07-SOEC-H8", developer: "L&T Hydrogen Electrolyzer", zone: "West India Mumbai Jamnagar Kandla", category: "Solid Oxide Electrolyzer SOEC", description: "50MW SOEC Electrolyzer Manufacturing Line L&T Hazira Green H2", capacity: 50, weight: 80000, manufacturer: "Siemens Energy Germany", origin: "Siemens Berlin Factory", projectSite: "L&T Smart World Hazira Campus", segment: "Electrolyzer Manufacturing", mode: "Barge Coastal Shipping", shipDate: "2025-07-11", installDate: "2025-07-18", transitDays: 7, contractValue: 1200000000, electrolyzerType: "SOEC", status: "Electrolyzer Factory Dispatched", remarks: "Siemens 50MW SOEC L&T Hazira electrolyzer manufacturing factory dispatched" },
  { id: "GHY-0009", projectNo: "NTPC/DAD/2025/07-CMP-I9", developer: "NTPC Green Hydrogen Dadri", zone: "North India Delhi NCR Panipat", category: "H2 Compressor 500 Bar Recip", description: "500 Bar Reciprocating H2 Compressor with Aftercooler for H2 Refueling", capacity: 5, weight: 12000, manufacturer: "BHEL Bhopal", origin: "BHEL Bhopal Heavy Eng", projectSite: "NTPC Dadri H2 Refueling Station", segment: "H2 Mobility Refueling", mode: "Specialized Heavy Trailer 80T", shipDate: "2025-07-07", installDate: "2025-07-11", transitDays: 4, contractValue: 95000000, electrolyzerType: "Alkaline", status: "Green Hydrogen Producing Live", remarks: "BHEL 500 bar compressor NTPC Dadri H2 refueling producing live" },
  { id: "GHY-0010", projectNo: "ADN/KDL/2025/07-PIPE-J10", developer: "Adani Total Kandla GH2", zone: "West India Mumbai Jamnagar Kandla", category: "Pipeline Seamless Steel API 5L", description: "API 5L X42 12-inch H2 Pipeline 50km Kandla Port to Green Ammonia", capacity: 8, weight: 45000, manufacturer: "Jindal Saw Limited Mumbai", origin: "Jindal Saw Kandla Pipe Mill", projectSite: "Kandla Port to Mundra GH2 Pipeline", segment: "H2 Pipeline Transport", mode: "Rail Wagon Special Consignment", shipDate: "2025-07-08", installDate: "2025-07-14", transitDays: 6, contractValue: 280000000, electrolyzerType: "PEM", status: "Transport Rail Road Specialized", remarks: "Jindal API 5L 12-inch 50km Adani Kandla H2 pipeline transit rail" },
  { id: "GHY-0011", projectNo: "REL/JMN/2025/07-AMM-K11", developer: "Reliance Jamnagar Green H2", zone: "West India Mumbai Jamnagar Kandla", category: "Green Ammonia Synthesis Reactor", description: "Green Ammonia Haber-Bosch Reactor 500 TPD Reliance Jamnagar Export", capacity: 25, weight: 55000, manufacturer: "ThyssenKrupp Uhde Germany", origin: "TK Uhde Dortmund Factory", projectSite: "Reliance Jamnagar Green Ammonia Plant", segment: "Green Ammonia Export", mode: "Specialized Heavy Trailer 80T", shipDate: "2025-07-10", installDate: "2025-07-17", transitDays: 7, contractValue: 850000000, electrolyzerType: "Alkaline", status: "Project Site Receiving QC", remarks: "TK Uhde 500 TPD ammonia Reliance Jamnagar export receiving QC" },
  { id: "GHY-0012", projectNo: "IOCL/PNP/2025/07-ALK-L12", developer: "IOCL Panipat Bio-Hydrogen", zone: "North India Delhi NCR Panipat", category: "Alkaline Electrolyzer 5MW Stack", description: "10MW Alkaline Electrolyzer for Bio-Hydrogen Lignocellulosic Feedstock", capacity: 10, weight: 32000, manufacturer: "Nel Hydrogen Norway", origin: "Nel Hydrogen Notodden Factory", projectSite: "IOCL Panipat Bio-H2 Plant", segment: "Bio-Hydrogen Production", mode: "Barge Coastal Shipping", shipDate: "2025-07-06", installDate: "2025-07-12", transitDays: 6, contractValue: 420000000, electrolyzerType: "Alkaline", status: "Electrolyzer Installation Grid", remarks: "Nel 10MW alkaline IOCL Panipat bio-H2 lignocellulosic installation" },
  { id: "GHY-0013", projectNo: "TATA/JSD/2025/07-STOR-M13", developer: "Tata Steel Jamshedpur H2-DRI", zone: "East India Jamshedpur Dhanbad", category: "Hydrogen Storage Tank 350 Bar", description: "Underground H2 Storage Cavern 2000 Tonnes Lined Rock Cavern LRC", capacity: 30, weight: 25000, manufacturer: "Linde Engineering Germany", origin: "Linde Engineering Pullach", projectSite: "Tata Steel Jamshedpur LRC Site", segment: "Bulk H2 Storage Cavern", mode: "Specialized Heavy Trailer 80T", shipDate: "2025-07-09", installDate: "2025-07-15", transitDays: 6, contractValue: 550000000, electrolyzerType: "Alkaline", status: "Commissioning H2 Production Test", remarks: "Linde 2000T LRC Tata Steel Jamshedpur bulk H2 cavern commissioning" },
  { id: "GHY-0014", projectNo: "JSW/VJN/2025/07-FC-N14", developer: "JSW Steel Vijayanagar H2", zone: "South India Chennai Mangalore", category: "Fuel Cell Stack 200kW PEMFC", description: "400kW PEMFC Backup Power System for Vijayanagar Steel Rolling Mill", capacity: 2, weight: 3500, manufacturer: "Bharat Heavy Electricals BHEL Hyderabad", origin: "BHEL Hyderabad FC Division", projectSite: "JSW Vijayanagar Hot Strip Mill", segment: "Mill Backup Power FC", mode: "Flatbed Trailer 30T", shipDate: "2025-07-11", installDate: "2025-07-12", transitDays: 1, contractValue: 85000000, electrolyzerType: "PEM", status: "Green Hydrogen Producing Live", remarks: "BHEL 400kW PEMFC JSW Vijayanagar mill backup producing live" },
];

const transitCount = records.filter(r => r.status === "Transport Rail Road Specialized").length;
const activeCount = records.filter(r => r.status === "Green Hydrogen Producing Live" || r.status === "Commissioning H2 Production Test").length;
const totalCapacity = records.reduce((s, r) => s + r.capacity, 0);
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

export default function GreenHydrogenEnergyLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const filterGroups = [
    { key: "developer", label: "Developer", options: DEVELOPERS.map(d => ({ value: d, count: records.filter(rec => rec.developer === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "mode", label: "Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
    { key: "electrolyzerType", label: "Electrolyzer", options: ["Alkaline", "PEM", "SOEC", "AEM"].map(e => ({ value: e, count: records.filter(rec => rec.electrolyzerType === e).length })) },
  ];
  const filtered = records.filter(r => {
    if (search && !Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(String(r[key as keyof HydrogenRecord]))) return false; }
    return true;
  });
  const toggleFilter = ((key: string, val: string) => setActiveFilters(p => { const np = {...p}; const arr = np[key] || []; np[key] = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]; return np; }));

  return (
    <div className="ghy-root p-6 space-y-6">
      <PageHeader title="Green Hydrogen Energy Logistics" description="India green hydrogen electrolyzer, fuel cell, storage tank, pipeline, compressor, ammonia synthesis plant and renewable energy integration logistics" />
      <div className="ghy-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`ghy-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#064e3b] text-white" : "text-gray-600 hover:bg-[#064e3b]/10"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="ghy-dashboard space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[{ label: "Total Capacity", value: `${totalCapacity} MW`, color: "bg-[#064e3b]" }, { label: "Active Projects", value: `${activeCount}`, color: "bg-[#159971]" }, { label: "In Transit", value: `${transitCount}`, color: "bg-[#0d7356]" }, { label: "Total Contract", value: formatINR(totalContract), color: "bg-[#043626]" }].map((kpi, i) => (
              <div key={i} className={`${kpi.color} text-white rounded-lg p-4`}><div className="text-xs opacity-80">{kpi.label}</div><div className="text-xl font-bold mt-1">{kpi.value}</div></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly H2 Production (tonnes)</h3><BarChart data={monthlyProd}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="alkaline" fill="#064e3b" name="Alkaline" /><Bar dataKey="pem" fill="#159971" name="PEM" /><Bar dataKey="soec" fill="#1dbf8c" name="SOEC" /><Bar dataKey="ammonia" fill="#34d399" name="Ammonia" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Electrolyzer Technology Mix</h3><PieChart><Pie data={techDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Green H2 Cost ($/kg) vs Target $4/kg</h3><LineChart data={costTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} domain={[3, 6]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#064e3b" name="Actual Cost" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target $4/kg" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Developer Performance Score</h3><BarChart data={developerPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#0d7356" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="ghy-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Green H2", href: "#" }, { label: "Electrolyzer Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="ghy-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Project No,Developer,Zone,Category,Description,Capacity (MW),Weight (kg),Manufacturer,Origin,Project Site,Segment,Mode,Ship Date,Install Date,Transit (d),Contract (\u20b9),Electrolyzer,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "slate";
              return (<tr key={r.id} className={`border-b ${sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-500" : ""}`}>
                <td className="px-3 py-2 font-medium">{r.id}</td>
                <td className="px-3 py-2">{r.projectNo}</td>
                <td className="px-3 py-2">{r.developer}</td>
                <td className="px-3 py-2">{r.zone}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2">{r.description}</td>
                <td className="px-3 py-2 text-right">{r.capacity}</td>
                <td className="px-3 py-2 text-right">{r.weight.toLocaleString()}</td>
                <td className="px-3 py-2">{r.manufacturer}</td>
                <td className="px-3 py-2">{r.origin}</td>
                <td className="px-3 py-2">{r.projectSite}</td>
                <td className="px-3 py-2">{r.segment}</td>
                <td className="px-3 py-2">{r.mode}</td>
                <td className="px-3 py-2">{r.shipDate}</td>
                <td className="px-3 py-2">{r.installDate}</td>
                <td className="px-3 py-2 text-center">{r.transitDays}</td>
                <td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.electrolyzerType}</span></td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.status}</span></td>
                <td className="px-3 py-2">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="ghy-analytics space-y-4">
          <ModuleBreadcrumb items={[{ label: "Green H2", href: "#" }, { label: "H2 Analytics", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly H2 Production (tonnes)</h3><BarChart data={monthlyProd}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="alkaline" fill="#064e3b" name="Alkaline" /><Bar dataKey="pem" fill="#159971" name="PEM" /><Bar dataKey="soec" fill="#1dbf8c" name="SOEC" /><Bar dataKey="ammonia" fill="#34d399" name="Ammonia" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Electrolyzer Technology Mix</h3><PieChart><Pie data={techDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Green H2 Cost ($/kg) vs Target</h3><LineChart data={costTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} domain={[3, 6]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#064e3b" name="Actual" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target $4/kg" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Developer Performance Score</h3><BarChart data={developerPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#0d7356" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="ghy-insights space-y-4">
          <ModuleBreadcrumb items={[{ label: "Green H2", href: "#" }, { label: "Insights", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#064e3b] mb-2">National Green Hydrogen Mission 2023</h3><p className="text-xs text-gray-600">India targets 5 million tonnes per annum green hydrogen production by 2030, with ₹19,744 crore budget allocation. The mission aims to reduce fossil fuel import dependency by ₹1 lakh crore and create 600,000+ green jobs across the hydrogen value chain from electrolyzer manufacturing to end-use applications in steel, refineries, fertilizers and long-haul transport.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#064e3b] mb-2">SIGHT Subsidy ₹17,490 Crore</h3><p className="text-xs text-gray-600">The Strategic Interventions for Green Hydrogen Transition (SIGHT) programme provides ₹17,490 crore production-linked incentives. Electrolyzer manufacturing PLI offers ₹4,440 crore to boost domestic capacity from current 1.5 GW/yr to 15 GW/yr by 2030, targeting 80% localisation in electrolyzer stack components including membranes, catalysts and bipolar plates.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#064e3b] mb-2">Electrolyzer Manufacturing Push</h3><p className="text-xs text-gray-600">L&T, Reliance, IOCL, Adani Total and JSW are setting up gigawatt-scale electrolyzer factories. L&T Hazira is building India largest 2 GW/yr alkaline electrolyzer line. Reliance Dhirubhai Ambani Green Energy Giga Complex at Jamnagar targets 5 GW electrolyzer capacity. John Cockerill and ThyssenKrupp Nucera have signed JV agreements for technology transfer and localisation.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#064e3b] mb-2">Green Ammonia Export via Kandla Mundra</h3><p className="text-xs text-gray-600">India aims to export 2-3 million tonnes of green ammonia annually by 2030 through Kandla, Mundra and Vizag ports. Adani Total, Acme Solar and ReNew Power are building integrated green ammonia plants. The EU Carbon Border Adjustment Mechanism (CBAM) creates export opportunities as European fertilizer and chemical industries seek low-carbon hydrogen and ammonia feedstock alternatives.</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
