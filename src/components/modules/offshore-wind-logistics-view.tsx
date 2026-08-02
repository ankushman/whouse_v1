"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0f172a", "#1e3a5f", "#2d5a87", "#3d7aae", "#081222", "#152c4a", "#20406e", "#5ba8d4"];
const DEVELOPERS = ["Vestas Wind Power India", "Siemens Gamesa India BLR", "GE Vernova Wind Hyderabad", "Adani Green Energy Mumbai", "NTPC Renewable Energy Delhi", "O2 Power Mytrah Wind", "Renew Power Acme Solar", "Orange Sren Wind Gujarat"];
const CATEGORIES = ["Offshore Wind Turbine 8MW Nacelle", "Monopile Foundation 60m 800T Steel", "Inter Array Cable 33kV Subsea", "Export Cable 220kV HVDC Subsea", "Offshore Substation Topside HV", "Offshore Substation Jacket 4-Leg", "SCADA RTU Wind Farm Control", "Installation Vessel Jack-Up Rig"];
const SHIPMENT_STATUSES = ["Turbine Factory Assembly Complete", "Heavy Load Port Departed Vessel", "Marine Transit Installation Route", "Jack-Up Rig Installation At Sea", "Cable Pull-In Termination Splice", "Commissioned Power Export Live"];
const ZONES = ["Gujarat Coast Pipavav Saurashtra", "Tamil Nadu Coast Cuddalore Palk", "Gujarat Gulf of Khambhat", "Maharashtra Coast Mumbai Digha", "Andhra Pradesh Coast Kakinada", "Odisha Coast Gopalpur Dhamra", "Lakshadweep Offshore Deep Sea"];
const MODES = ["Jack-Up Installation Vessel 5000T", "Heavy Lift Ship 7000T", "Cable Laying Vessel DP2", "Tug Barge Tow 4000T", "Supply Vessel Crew Transfer", "Barge Platform SPMT RoRo"];
const TABS = ["Dashboard", "Turbine Registry", "Wind Farm Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Turbine Factory Assembly Complete": "slate", "Heavy Load Port Departed Vessel": "blue", "Marine Transit Installation Route": "amber", "Jack-Up Rig Installation At Sea": "orange", "Cable Pull-In Termination Splice": "red", "Commissioned Power Export Live": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyInstall = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], turbine: ri(2, 12, 6 + Math.sin(i * 0.5) * 3), foundation: ri(3, 15, 8 + Math.cos(i * 0.6) * 3), cable: ri(5, 25, 14 + Math.sin(i * 0.7) * 5), substation: +(ri(0.2, 1.5, 0.7 + Math.cos(i * 0.8) * 0.3)).toFixed(1) }));
const turbineDist = [{ n: "8MW Class", v: 30 }, { n: "10MW Class", v: 25 }, { n: "12MW Class", v: 20 }, { n: "14MW Class", v: 15 }, { n: "15MW+ Class", v: 10 }];
const capacityTarget = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(400, 1200, 750 + Math.sin(i * 0.4) * 200)).toFixed(0), target: 1000 }));
const devPerf = DEVELOPERS.map(d => ({ n: d.split(" ").slice(0, 2).join(" "), v: +ri(65, 98, 82 + Math.random() * 10).toFixed(0) }));

interface WindRecord { id: string; woNo: string; developer: string; zone: string; category: string; description: string; capacity: number; weight: number; manufacturer: string; origin: string; windFarm: string; turbinePos: string; mode: string; shipDate: string; installDate: string; transitDays: number; contractValue: number; waterDepth: number; status: string; remarks: string; }

const records: WindRecord[] = [
  { id: "OWF-0001", woNo: "VST/GJC/2025/07-NCL-A1", developer: "Vestas Wind Power India", zone: "Gujarat Coast Pipavav Saurashtra", category: "Offshore Wind Turbine 8MW Nacelle", description: "Vestas V164-8.0 MW Offshore Nacelle Hub Generator Drivetrain", capacity: 8, weight: 350000, manufacturer: "Vestas India Chennai Plant", origin: "Vestas Chennai Manufacturing", windFarm: "Gujarat Pipavav OWF Phase 1", turbinePos: "T01 WTG Row A Position 1", mode: "Jack-Up Installation Vessel 5000T", shipDate: "2025-07-08", installDate: "2025-07-18", transitDays: 10, contractValue: 380000000, waterDepth: 25, status: "Jack-Up Rig Installation At Sea", remarks: "Vestas V164 8MW nacelle Gujarat Pipavav T01 jack-up rig sea installation" },
  { id: "OWF-0002", woNo: "SGE/BLR/2025/07-MNP-B2", developer: "Siemens Gamesa India BLR", zone: "Tamil Nadu Coast Cuddalore Palk", category: "Monopile Foundation 60m 800T Steel", description: "60m Monopile 4.5m Diameter 800T Steel S355 Offshore Foundation", capacity: 0, weight: 800000, manufacturer: "SWS Shipyard Mumbai", origin: "SWS Mumbai Dry Dock", windFarm: "Tamil Nadu Cuddalore OWF", turbinePos: "T05 Foundation Pile 5", mode: "Heavy Lift Ship 7000T", shipDate: "2025-07-09", installDate: "2025-07-20", transitDays: 11, contractValue: 280000000, waterDepth: 30, status: "Marine Transit Installation Route", remarks: "SGRE 60m monopile TN Cuddalore T05 heavy lift marine transit" },
  { id: "OWF-0003", woNo: "GEV/HYD/2025/07-CAB-C3", developer: "GE Vernova Wind Hyderabad", zone: "Gujarat Gulf of Khambhat", category: "Inter Array Cable 33kV Subsea", description: "33kV XLPE 3-Core Subsea Inter Array Cable 15km Section", capacity: 0, weight: 45000, manufacturer: "Prysmian Group Italy", origin: "Prysmian Pikkala Finland", windFarm: "Gujarat Khambhat OWF Phase 2", turbinePos: "Cable Section C5-C8", mode: "Cable Laying Vessel DP2", shipDate: "2025-07-07", installDate: "2025-07-14", transitDays: 7, contractValue: 120000000, waterDepth: 20, status: "Cable Pull-In Termination Splice", remarks: "Prysmian 33kV 15km inter-array Gujarat Khambhat C5-C8 cable splice" },
  { id: "OWF-0004", woNo: "ADN/MUM/2025/07-EXP-D4", developer: "Adani Green Energy Mumbai", zone: "Maharashtra Coast Mumbai Digha", category: "Export Cable 220kV HVDC Subsea", description: "220kV HVDC Subsea Export Cable 80km to Onshore Substation", capacity: 0, weight: 180000, manufacturer: "Nexans Norway Halden", origin: "Nexans Halden Factory NO", windFarm: "Maharashtra Mumbai OWF", turbinePos: "Export Cable Route M1-OS", mode: "Cable Laying Vessel DP2", shipDate: "2025-07-10", installDate: "2025-07-22", transitDays: 12, contractValue: 650000000, waterDepth: 35, status: "Marine Transit Installation Route", remarks: "Nexans 220kV HVDC 80km Adani Mumbai export cable marine transit" },
  { id: "OWF-0005", woNo: "NTP/DEL/2025/07-OPS-E5", developer: "NTPC Renewable Energy Delhi", zone: "Gujarat Coast Pipavav Saurashtra", category: "Offshore Substation Topside HV", description: "Offshore HV Substation Topside 220/33kV 500MVA with GIS Switchgear", capacity: 500, weight: 1200000, manufacturer: "Larsen Toubro Hazira", origin: "L&T Hazira Heavy Eng", windFarm: "Gujarat Pipavav OWF Phase 1", turbinePos: "OSS-01 Platform Topside", mode: "Heavy Lift Ship 7000T", shipDate: "2025-07-06", installDate: "2025-07-20", transitDays: 14, contractValue: 850000000, waterDepth: 25, status: "Turbine Factory Assembly Complete", remarks: "L&T OSS 500MVA topside NTPC Pipavav factory assembly complete" },
  { id: "OWF-0006", woNo: "O2P/MTR/2025/07-JKT-F6", developer: "O2 Power Mytrah Wind", zone: "Andhra Pradesh Coast Kakinada", category: "Offshore Substation Jacket 4-Leg", description: "4-Leg Jacket Foundation 50m Height 2000T for OSS Platform", capacity: 0, weight: 2000000, manufacturer: "Afcons Infrastructure Mumbai", origin: "Afcons Mumbai Yard", windFarm: "AP Kakinada OWF Phase 1", turbinePos: "OSS-02 Jacket Foundation", mode: "Tug Barge Tow 4000T", shipDate: "2025-07-08", installDate: "2025-07-18", transitDays: 10, contractValue: 420000000, waterDepth: 28, status: "Heavy Load Port Departed Vessel", remarks: "Afcons 4-leg jacket 2000T O2 Power Kakinada port departed vessel" },
  { id: "OWF-0007", woNo: "RPW/ACM/2025/07-SCD-G7", developer: "Renew Power Acme Solar", zone: "Odisha Coast Gopalpur Dhamra", category: "SCADA RTU Wind Farm Control", description: "SCADA RTU 200 Turbine Node + WMS Weather Monitoring System", capacity: 0, weight: 2500, manufacturer: "ABB India Bengaluru", origin: "ABB BLR Factory", windFarm: "Odisha Gopalpur OWF", turbinePos: "SCADA Room Onshore OS", mode: "Supply Vessel Crew Transfer", shipDate: "2025-07-09", installDate: "2025-07-11", transitDays: 2, contractValue: 85000000, waterDepth: 18, status: "Commissioned Power Export Live", remarks: "ABB SCADA 200 RTU Renew Power Gopalpur commissioned live" },
  { id: "OWF-0008", woNo: "ORS/GJC/2025/07-NCL-H8", developer: "Orange Sren Wind Gujarat", zone: "Gujarat Gulf of Khambhat", category: "Offshore Wind Turbine 8MW Nacelle", description: "SGRE SG 14-222 DD 14MW Direct Drive Offshore Nacelle Generator", capacity: 14, weight: 500000, manufacturer: "Siemens Gamesa Denmark", origin: "SGRE Brande Factory DK", windFarm: "Gujarat Khambhat OWF Phase 2", turbinePos: "T02 WTG Row B Position 2", mode: "Jack-Up Installation Vessel 5000T", shipDate: "2025-07-07", installDate: "2025-07-19", transitDays: 12, contractValue: 620000000, waterDepth: 22, status: "Heavy Load Port Departed Vessel", remarks: "SGRE 14MW DD nacelle Gujarat Khambhat T02 port departed vessel" },
  { id: "OWF-0009", woNo: "VST/GJC/2025/07-MNP-I9", developer: "Vestas Wind Power India", zone: "Gujarat Coast Pipavav Saurashtra", category: "Monopile Foundation 60m 800T Steel", description: "55m Monopile 5.0m Diameter 950T for 10MW+ Turbine Foundation", capacity: 0, weight: 950000, manufacturer: "Essar Steel Hazira", origin: "Essar Hazira Plate Mill", windFarm: "Gujarat Pipavav OWF Phase 1", turbinePos: "T08 Foundation Pile 8", mode: "Tug Barge Tow 4000T", shipDate: "2025-07-10", installDate: "2025-07-21", transitDays: 11, contractValue: 320000000, waterDepth: 27, status: "Marine Transit Installation Route", remarks: "Vestas monopile 5m 950T Pipavav T08 tug barge marine transit" },
  { id: "OWF-0010", woNo: "ADN/MUM/2025/07-NCL-J10", developer: "Adani Green Energy Mumbai", zone: "Maharashtra Coast Mumbai Digha", category: "Offshore Wind Turbine 8MW Nacelle", description: "GE Haliade-X 12MW Direct Drive Offshore Nacelle Permanent Magnet", capacity: 12, weight: 450000, manufacturer: "GE Vernova India Hyderabad", origin: "GE Hyderabad Factory", windFarm: "Maharashtra Mumbai OWF", turbinePos: "T03 WTG Row C Position 3", mode: "Jack-Up Installation Vessel 5000T", shipDate: "2025-07-11", installDate: "2025-07-20", transitDays: 9, contractValue: 520000000, waterDepth: 32, status: "Jack-Up Rig Installation At Sea", remarks: "GE Haliade-X 12MW Adani Mumbai T03 jack-up rig sea installation" },
  { id: "OWF-0011", woNo: "NTP/DEL/2025/07-CAB-K11", developer: "NTPC Renewable Energy Delhi", zone: "Tamil Nadu Coast Cuddalore Palk", category: "Inter Array Cable 33kV Subsea", description: "33kV XLPE Subsea Inter Array Cable 25km Multi-Section Bundle", capacity: 0, weight: 75000, manufacturer: "KEC International Mumbai", origin: "KEC Mumbai Cable Factory", windFarm: "Tamil Nadu Cuddalore OWF", turbinePos: "Cable Section A10-A15", mode: "Cable Laying Vessel DP2", shipDate: "2025-07-08", installDate: "2025-07-16", transitDays: 8, contractValue: 145000000, waterDepth: 22, status: "Cable Pull-In Termination Splice", remarks: "KEC 33kV 25km inter-array NTPC Cuddalore A10-A15 cable splice" },
  { id: "OWF-0012", woNo: "O2P/MTR/2025/07-OPS-L12", developer: "O2 Power Mytrah Wind", zone: "Andhra Pradesh Coast Kakinada", category: "Offshore Substation Topside HV", description: "Offshore HV Substation 132/33kV 300MVA Topside with Transformer", capacity: 300, weight: 900000, manufacturer: "BHEL Bhopal Heavy Eng", origin: "BHEL Bhopal Heavy Plate", windFarm: "AP Kakinada OWF Phase 1", turbinePos: "OSS-03 Platform Topside", mode: "Heavy Lift Ship 7000T", shipDate: "2025-07-09", installDate: "2025-07-21", transitDays: 12, contractValue: 680000000, waterDepth: 26, status: "Marine Transit Installation Route", remarks: "BHEL 300MVA topside O2 Power Kakinada OSS-03 marine transit" },
  { id: "OWF-0013", woNo: "RPW/ACM/2025/07-JKT-M13", developer: "Renew Power Acme Solar", zone: "Odisha Coast Gopalpur Dhamra", category: "Offshore Substation Jacket 4-Leg", description: "3-Leg Jacket 45m Height 1500T for Transition Piece Foundation", capacity: 0, weight: 1500000, manufacturer: "WEL Gujarat Hazira", origin: "WEL Hazira Yard", windFarm: "Odisha Gopalpur OWF", turbinePos: "OSS-04 Jacket Foundation", mode: "Tug Barge Tow 4000T", shipDate: "2025-07-07", installDate: "2025-07-17", transitDays: 10, contractValue: 350000000, waterDepth: 20, status: "Heavy Load Port Departed Vessel", remarks: "WEL 3-leg jacket 1500T Renew Gopalpur OSS-04 port departed vessel" },
  { id: "OWF-0014", woNo: "ORS/GJC/2025/07-SCD-N14", developer: "Orange Sren Wind Gujarat", zone: "Gujarat Gulf of Khambhat", category: "SCADA RTU Wind Farm Control", description: "Wind Farm Management System WMS 150 Turbine LiDAR Met Mast", capacity: 0, weight: 5000, manufacturer: "Bosch India Bangalore", origin: "Bosch BLR Factory", windFarm: "Gujarat Khambhat OWF Phase 2", turbinePos: "SCADA Control Room OS", mode: "Supply Vessel Crew Transfer", shipDate: "2025-07-10", installDate: "2025-07-12", transitDays: 2, contractValue: 95000000, waterDepth: 22, status: "Commissioned Power Export Live", remarks: "Bosch WMS 150 turbine LiDAR Orange Sren Khambhat commissioned live" },
];

const transitCount = records.filter(r => r.status === "Marine Transit Installation Route").length;
const liveCount = records.filter(r => r.status === "Commissioned Power Export Live").length;
const totalMW = records.reduce((s, r) => s + r.capacity, 0);
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

export default function OffshoreWindLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const filterGroups = [
    { key: "developer", label: "Developer", options: DEVELOPERS.map(d => ({ value: d, count: records.filter(rec => rec.developer === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "mode", label: "Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];
  const filtered = records.filter(r => {
    if (search && !Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(String(r[key as keyof WindRecord]))) return false; }
    return true;
  });
  const toggleFilter = ((key: string, val: string) => setActiveFilters(p => { const np = {...p}; const arr = np[key] || []; np[key] = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]; return np; }));

  return (
    <div className="owf-root p-6 space-y-6">
      <PageHeader title="Offshore Wind Turbine Logistics" description="India offshore wind turbine logistics covering Vestas Siemens Gamesa GE Vernova nacelle, monopile foundation, subsea inter-array export cable HVDC, offshore substation topside jacket, jack-up installation vessel, cable laying vessel and SCADA wind farm control systems" />
      <div className="owf-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`owf-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#0f172a] text-white" : "text-gray-600 hover:bg-[#0f172a]/10"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="owf-dashboard space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[{ label: "Total Capacity", value: `${totalMW} MW`, color: "bg-[#0f172a]" }, { label: "Commissioned Live", value: `${liveCount}`, color: "bg-[#2d5a87]" }, { label: "In Transit", value: `${transitCount}`, color: "bg-[#1e3a5f]" }, { label: "Total Contract", value: formatINR(totalContract), color: "bg-[#081222]" }].map((kpi, i) => (
              <div key={i} className={`${kpi.color} text-white rounded-lg p-4`}><div className="text-xs opacity-80">{kpi.label}</div><div className="text-xl font-bold mt-1">{kpi.value}</div></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Installation Progress</h3><BarChart data={monthlyInstall}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="turbine" fill="#0f172a" name="Turbines" /><Bar dataKey="foundation" fill="#2d5a87" name="Foundations" /><Bar dataKey="cable" fill="#3d7aae" name="Cable (km)" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Turbine Capacity Mix</h3><PieChart><Pie data={turbineDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{turbineDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Capacity Installed (MW) vs Target 1000 MW</h3><LineChart data={capacityTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0f172a" name="Actual MW" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target 1000MW" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Developer Performance Score</h3><BarChart data={devPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#1e3a5f" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="owf-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Offshore Wind", href: "#" }, { label: "Turbine Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="owf-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Work Order,Developer,Zone,Category,Description,Capacity (MW),Weight (kg),Manufacturer,Origin,Wind Farm,Turbine Pos,Mode,Ship Date,Install Date,Transit (d),Contract (\u20b9),Depth (m),Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "slate";
              return (<tr key={r.id} className={`border-b ${sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-500" : ""}`}>
                <td className="px-3 py-2 font-medium">{r.id}</td>
                <td className="px-3 py-2">{r.woNo}</td>
                <td className="px-3 py-2">{r.developer}</td>
                <td className="px-3 py-2">{r.zone}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2">{r.description}</td>
                <td className="px-3 py-2 text-right">{r.capacity || "-"}</td>
                <td className="px-3 py-2 text-right">{r.weight.toLocaleString()}</td>
                <td className="px-3 py-2">{r.manufacturer}</td>
                <td className="px-3 py-2">{r.origin}</td>
                <td className="px-3 py-2">{r.windFarm}</td>
                <td className="px-3 py-2">{r.turbinePos}</td>
                <td className="px-3 py-2">{r.mode}</td>
                <td className="px-3 py-2">{r.shipDate}</td>
                <td className="px-3 py-2">{r.installDate}</td>
                <td className="px-3 py-2 text-center">{r.transitDays}</td>
                <td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2 text-right">{r.waterDepth}</td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${SC[sc] || SC.slate}`}>{r.status}</span></td>
                <td className="px-3 py-2">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="owf-analytics space-y-4">
          <ModuleBreadcrumb items={[{ label: "Offshore Wind", href: "#" }, { label: "Wind Farm Analytics", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Installation Progress</h3><BarChart data={monthlyInstall}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Bar dataKey="turbine" fill="#0f172a" name="Turbines" /><Bar dataKey="foundation" fill="#2d5a87" name="Foundations" /><Bar dataKey="cable" fill="#3d7aae" name="Cable (km)" /></BarChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Turbine Capacity Mix</h3><PieChart><Pie data={turbineDist} cx="50%" cy="50%" outerRadius={80} dataKey="v" nameKey="n" label>{turbineDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Capacity Installed (MW) vs Target</h3><LineChart data={capacityTarget}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0f172a" name="Actual MW" /><Line type="monotone" dataKey="target" stroke="#ef4444" name="Target 1000MW" strokeDasharray="5 5" /></LineChart></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-gray-500 mb-2">Developer Performance Score</h3><BarChart data={devPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#1e3a5f" name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="owf-insights space-y-4">
          <ModuleBreadcrumb items={[{ label: "Offshore Wind", href: "#" }, { label: "Insights", href: "#" }]} />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#0f172a] mb-2">India 30 GW Offshore Wind Target by 2030</h3><p className="text-xs text-gray-600">India aims for 30 GW offshore wind capacity by 2030 under the National Offshore Wind Energy Policy. MNRE has identified zones in Gujarat (Gulf of Khambhat, Saurashtra coast) and Tamil Nadu (Cuddalore, Palk Bay) with 36 GW estimated potential. The first 1 GW commercial offshore wind auction by SECI is expected to unlock ₹60,000 crore in investment across turbine foundations, subsea cables and offshore substations.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#0f172a] mb-2">Jack-Up Vessel and Heavy Lift Availability</h3><p className="text-xs text-gray-600">Offshore wind installation requires specialized DP2 jack-up vessels with 5000T crane capacity for 8-15MW turbine nacelles and heavy lift ships for 7000T+ substation topsides. Global fleet is limited with 2-year booking queues. Indian ports Pipavav, Kandla, Mundra and Chennai need upgrades to handle 60m monopiles and 800T transition pieces. Afcons, L&T and SWS Shipyard are building domestic marine logistics capability.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#0f172a] mb-2">Subsea Cable HVDC Infrastructure Critical Path</h3><p className="text-xs text-gray-600">Offshore wind export cables use 220kV HVAC or HVDC technology for 50-200km distances to onshore substations. Cable manufacturers Prysmian, Nexans and KEC supply XLPE insulated subsea cables. Installation by DP2 cable laying vessels takes 2-5 km/day. Inter-array 33kV cables connect turbines within the wind farm. Cable pull-in and termination splicing is the critical path activity for farm commissioning and power export.</p></div>
            <div className="bg-white rounded-lg border p-4"><h3 className="text-sm font-medium text-[#0f172a] mb-2">Vestas Siemens Gamesa GE Vernova India Supply Chain</h3><p className="text-xs text-gray-600">India offshore wind relies on Vestas V164 8MW, SGRE SG 14-222 DD 14MW and GE Haliade-X 12MW turbines. Nacelles weighing 350-500T require specialized air-ride trailers and jack-up vessels for installation. Monopile foundations (60m, 800-950T) are fabricated at SWS Mumbai, Essar Hazira and Afcons yards. L&T Hazira builds offshore substation topsides while Indian OSP manufacturers supply blades, towers and generators.</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
