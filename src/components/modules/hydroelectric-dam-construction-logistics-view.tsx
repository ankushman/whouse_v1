"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#134e4a", "#115e59", "#0f766e", "#0d9488", "#14b8a6", "#2dd4bf", "#2a9d8f", "#059669"];
const DEVELOPERS = ["NHPC Faridabad HQ", "NTPC Hydro Noida", "SJVN Shimla Himachal", "THDC Rishikesh Uttarakhand", "NEEPCO Shillong Meghalaya", "NHDC Bhopal MP", "JKPDC Srinagar Kashmir", "Andhra Pradesh Genco Hyderabad"];
const CATEGORIES = ["3000MW Concrete Gravity Dam", "1500MW Earthfill Rockfill Embankment", "800MW Arch Dam Thin Concrete", "500MW Run-of-River Barrage", "1200MW Underground Pumped Storage", "200MW Small Hydro Canal Drop", "2500MW Concrete Face Rockfill CFRD", "600MW Diversion Tunnel Surge Shaft"];
const SHIPMENT_STATUSES = ["Dam Foundation Excavation Active", "Turbine Generator Transport Transit", "Penstock Steel Liner Installation", "Spillway Gate Hoist Assembly", "Powerhouse Equipment Commissioning", "Reservoir Filling Grid Sync Done"];
const ZONES = ["Himachal Satluj Beas Sutlej", "Uttarakhand Alaknanda Bhagirathi", "JK Indus Chenab Jhelum", "Arunachal Siang Subansiri Dibang", "MP Narmada Sardar Sarovar", "Assam Brahmaputra Tributary", "Sikkim Teesta Rangeet"];
const MODES = ["Heavy Haul Trailer 120T Turbine", "Cable Crane 30T Dam Site", "Helicopter Sling 10T Remote", "Rail Flat Wagon 80T Penstock", "Barge 5000T Gate Hoist", "Multi-Axle 100T Generator"];
const TABS = ["Dashboard", "Equipment Registry", "Hydro Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = {
  "Dam Foundation Excavation Active": "slate",
  "Turbine Generator Transport Transit": "blue",
  "Penstock Steel Liner Installation": "amber",
  "Spillway Gate Hoist Assembly": "orange",
  "Powerhouse Equipment Commissioning": "red",
  "Reservoir Filling Grid Sync Done": "green"
};

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyProgress = [
  { m: "Jan", excavation: 45, concrete: 30, turbine: 8, penstock: 12 },
  { m: "Feb", excavation: 52, concrete: 35, turbine: 10, penstock: 15 },
  { m: "Mar", excavation: 48, concrete: 42, turbine: 12, penstock: 18 },
  { m: "Apr", excavation: 60, concrete: 48, turbine: 14, penstock: 20 },
  { m: "May", excavation: 55, concrete: 55, turbine: 18, penstock: 22 },
  { m: "Jun", excavation: 42, concrete: 50, turbine: 20, penstock: 25 },
  { m: "Jul", excavation: 35, concrete: 45, turbine: 16, penstock: 20 },
  { m: "Aug", excavation: 38, concrete: 52, turbine: 22, penstock: 28 },
  { m: "Sep", excavation: 50, concrete: 58, turbine: 24, penstock: 30 },
  { m: "Oct", excavation: 58, concrete: 62, turbine: 26, penstock: 32 },
  { m: "Nov", excavation: 65, concrete: 68, turbine: 28, penstock: 35 },
  { m: "Dec", excavation: 70, concrete: 72, turbine: 30, penstock: 38 }
];

const damTypeDist = [
  { n: "Concrete Gravity", v: 30 },
  { n: "Run-of-River", v: 25 },
  { n: "Pumped Storage", v: 15 },
  { n: "Earthfill", v: 15 },
  { n: "Arch Dam", v: 8 },
  { n: "CFRD", v: 7 }
];

const costPerMW = [
  { m: "Jan", actual: 9.2, target: 8 },
  { m: "Feb", actual: 8.8, target: 8 },
  { m: "Mar", actual: 8.5, target: 8 },
  { m: "Apr", actual: 9.0, target: 8 },
  { m: "May", actual: 8.3, target: 8 },
  { m: "Jun", actual: 7.8, target: 8 },
  { m: "Jul", actual: 8.6, target: 8 },
  { m: "Aug", actual: 8.1, target: 8 },
  { m: "Sep", actual: 7.9, target: 8 },
  { m: "Oct", actual: 8.4, target: 8 },
  { m: "Nov", actual: 7.6, target: 8 },
  { m: "Dec", actual: 7.5, target: 8 }
];

const basinCapacity = [
  { n: "Brahmaputra", v: 11200 },
  { n: "Satluj", v: 4800 },
  { n: "Narmada", v: 3200 },
  { n: "Ganga", v: 2800 },
  { n: "Indus", v: 2100 },
  { n: "Godavari", v: 950 }
];

const INSIGHTS = [
  { t: "India's 50 GW Hydroelectric Potential & Current 47 GW Installed Base", c: "India possesses an estimated 50 GW of hydroelectric potential, of which approximately 47 GW has been installed across 200+ hydroelectric projects as of 2025. The country's hydro portfolio ranges from massive multi-purpose storage dams like Bhakra (1325 MW) on the Sutlej and Tehri (2400 MW) on the Bhagirathi, to small canal-drop schemes under 25 MW. The National Hydroelectric Power Corporation (NHPC), Satluj Jal Vidyut Nigam (SJVN), Tehri Hydro Development Corporation (THDC), and NEEPCO are the primary central PSUs driving hydro development. With India's commitment to 500 GW non-fossil capacity by 2030, hydroelectric power is gaining renewed focus as a clean, dispatchable baseload source complementing solar and wind intermittency." },
  { t: "Tehri Dam 2400 MW: India's Tallest at 260.5m on Bhagirathi River", c: "The Tehri Dam in Uttarakhand, operated by THDC India Limited, is India's tallest dam at 260.5 metres and a flagship project generating 2400 MW (1000 MW Tehri + 1000 MW Koteshwar + 400 MW Tehri Pumped Storage). Located on the Bhagirathi River, a tributary of the Ganga, Tehri is a rock and earth-fill embankment dam that required massive logistics coordination for construction materials including 22 million cubic metres of earthwork, 5.8 million cubic metres of concrete, and turbine-generator sets from BHEL and Andritz. The project involved complex penstock steel liner installation across mountainous terrain, with penstock diameters of 4.9 metres and lengths exceeding 600 metres. The dam's reservoir has a gross storage capacity of 3.54 billion cubic metres, making it critical for both power generation and downstream irrigation." },
  { t: "Brahmaputra Basin: 50 GW Untapped Potential in Northeast India", c: "The Brahmaputra River basin, primarily flowing through Arunachal Pradesh and Assam, holds India's largest untapped hydroelectric potential estimated at over 50,000 MW across the Siang, Subansiri, Lohit, and Dibang sub-basins. NEEPCO and NHPC are developing several mega-projects including the 2880 MW Dibang Multipurpose Project (CFRD, 288m height), 2000 MW Lower Subansiri (under construction after decades of delay), and 3000 MW Etalin on the Dibang River. The terrain presents extraordinary logistics challenges: helicopter sling operations for remote dam sites, barge transport for heavy gate hoists along Brahmaputra tributaries, and multi-axle trailer movements through narrow Himalayan valleys. Environmental clearances, forest diversion, and downstream impact assessments remain critical regulatory hurdles for NE hydro development." },
  { t: "Pumped Storage: 103 GW Potential and India's Energy Storage Strategy", c: "India has identified 103 GW of pumped storage hydro potential across 63 sites, with only 4.7 GW currently operational. Pumped storage hydro (PSH) is increasingly recognized as the most mature and cost-effective grid-scale energy storage solution to balance India's expanding solar and wind capacity. Key projects include THDC's 1000 MW Tehri PSP, NHPC's 810 MW Khab Pumped Storage on the Sutlej in Himachal Pradesh, and NTPC's 1500 MW Pinnapuram PSP in Andhra Pradesh. These projects use reversible pump-turbines (typically 250 MW per unit) that pump water uphill during low-demand hours and generate during peak demand. The logistics involve transporting 250 MW reversible pump-turbine units weighing over 300 tonnes via multi-axle trailers and cable cranes to underground powerhouse caverns at depths of 300-500 metres below surface." }
];

interface DamRecord { id: string; batchNo: string; developer: string; zone: string; category: string; description: string; capacityMW: number; damHeight: number; damType: string; turbineType: string; penstockDia: number; origin: string; site: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; riverBasin: string; status: string; remarks: string; }

const records: DamRecord[] = [
  { id: "HDC-0001", batchNo: "NHPC/TEHRI/2025/TG-0042", developer: "THDC Rishikesh Uttarakhand", zone: "Uttarakhand Alaknanda Bhagirathi", category: "3000MW Concrete Gravity Dam", description: "Tehri Dam Stage-2 Francis turbine 250MW vertical shaft assembly with guide bearings", capacityMW: 2400, damHeight: 261, damType: "Concrete Gravity", turbineType: "Francis 250MW Vertical", penstockDia: 4.9, origin: "BHEL Bhopal Plant MP", site: "Tehri Dam Bhagirathi River", state: "Uttarakhand", mode: "Heavy Haul Trailer 120T Turbine", prodDate: "2025-03-15", shipDate: "2025-06-20", transitDays: 8, contractValue: 1850000000, riverBasin: "Ganga Basin", status: "Turbine Generator Transport Transit", remarks: "Francis 250MW vertical turbine BHEL Bhopal Tehri transit via Rishikesh" },
  { id: "HDC-0002", batchNo: "SJVN/NATHPA/2025/PL-0118", developer: "SJVN Shimla Himachal", zone: "Himachal Satluj Beas Sutlej", category: "1500MW Earthfill Rockfill Embankment", description: "Nathpa Jhakri Stage-2 penstock steel liner 5.2m dia 800m length for Satluj diversion", capacityMW: 1500, damHeight: 67.5, damType: "Earthfill Rockfill", turbineType: "Francis 250MW Vertical", penstockDia: 5.2, origin: "SAIL Bhilai Steel Plant", site: "Nathpa Jhakri Satluj River", state: "Himachal Pradesh", mode: "Rail Flat Wagon 80T Penstock", prodDate: "2025-04-18", shipDate: "2025-06-25", transitDays: 12, contractValue: 920000000, riverBasin: "Satluj Basin", status: "Penstock Steel Liner Installation", remarks: "Penstock steel liner SAIL Bhilai Nathpa Jhakri rail transit 12d" },
  { id: "HDC-0003", batchNo: "NEEPCO/SIANG/2025/AF-0027", developer: "NEEPCO Shillong Meghalaya", zone: "Arunachal Siang Subansiri Dibang", category: "800MW Arch Dam Thin Concrete", description: "Upper Siang Arch Dam thin concrete shell formwork 180m height curved double curvature", capacityMW: 800, damHeight: 180, damType: "Arch Dam", turbineType: "Pelton 150MW Horizontal", penstockDia: 3.5, origin: "L&T Kansbahal Works Odisha", site: "Upper Siang Project Tuting", state: "Arunachal Pradesh", mode: "Helicopter Sling 10T Remote", prodDate: "2025-02-10", shipDate: "2025-05-15", transitDays: 18, contractValue: 25000000000, riverBasin: "Brahmaputra Basin", status: "Dam Foundation Excavation Active", remarks: "Arch dam formwork L&T Kansbahal Upper Siang helicopter delivery" },
  { id: "HDC-0004", batchNo: "NHPC/SUBANSIRI/2025/BG-0053", developer: "NHPC Faridabad HQ", zone: "Arunachal Siang Subansiri Dibang", category: "500MW Run-of-River Barrage", description: "Lower Subansiri barrage radial gate 15m x 12m with hydraulic hoist and stop logs", capacityMW: 2000, damHeight: 116, damType: "Run-of-River", turbineType: "Francis 250MW Vertical", penstockDia: 6.0, origin: "HEC Ranchi Heavy Engg", site: "Lower Subansiri Gerukamukh", state: "Assam", mode: "Barge 5000T Gate Hoist", prodDate: "2025-01-20", shipDate: "2025-05-30", transitDays: 35, contractValue: 4200000000, riverBasin: "Brahmaputra Basin", status: "Spillway Gate Hoist Assembly", remarks: "Barrage radial gate HEC Ranchi Subansiri barge Brahmaputra" },
  { id: "HDC-0005", batchNo: "NTPC/PINNAPURAM/2025/PS-0071", developer: "NTPC Hydro Noida", zone: "MP Narmada Sardar Sarovar", category: "1200MW Underground Pumped Storage", description: "Pinnapuram PSP reversible pump-turbine 250MW unit with motor-generator assembly", capacityMW: 1500, damHeight: 95, damType: "Pumped Storage", turbineType: "Reversible Pump-Turbine 250MW", penstockDia: 5.8, origin: "Andritz Austria Works", site: "Pinnapuram Kurnool AP", state: "Andhra Pradesh", mode: "Multi-Axle 100T Generator", prodDate: "2024-08-15", shipDate: "2024-12-10", transitDays: 52, contractValue: 8900000000, riverBasin: "Godavari Basin", status: "Reservoir Filling Grid Sync Done", remarks: "Reversible 250MW pump-turbine Andritz Pinnapuram grid sync done" },
  { id: "HDC-0006", batchNo: "NHDC/OMKARESHWAR/2025/EX-0014", developer: "NHDC Bhopal MP", zone: "MP Narmada Sardar Sarovar", category: "2500MW Concrete Face Rockfill CFRD", description: "Sardar Sarovar CFRD concrete face slab 85m height with plinth and perimetric joint", capacityMW: 1450, damHeight: 163, damType: "CFRD", turbineType: "Francis 250MW Vertical", penstockDia: 7.2, origin: "UltraTech Cement Works", site: "Sardar Sarovar Narmada", state: "Gujarat", mode: "Cable Crane 30T Dam Site", prodDate: "2025-03-05", shipDate: "2025-06-10", transitDays: 4, contractValue: 1600000000, riverBasin: "Narmada Basin", status: "Powerhouse Equipment Commissioning", remarks: "CFD concrete face slab UltraTech Sardar Sarovar commissioning" },
  { id: "HDC-0007", batchNo: "JKPDC/CHENAB/2025/DT-0033", developer: "JKPDC Srinagar Kashmir", zone: "JK Indus Chenab Jhelum", category: "600MW Diversion Tunnel Surge Shaft", description: "Baglihar Dam Stage-3 diversion tunnel 12m dia with surge shaft 85m deep", capacityMW: 900, damHeight: 144, damType: "Concrete Gravity", turbineType: "Francis 250MW Vertical", penstockDia: 4.5, origin: "HCC Infrastructure Mumbai", site: "Baglihar Chenab River", state: "Jammu & Kashmir", mode: "Heavy Haul Trailer 120T Turbine", prodDate: "2025-01-08", shipDate: "2025-07-01", transitDays: 15, contractValue: 3200000000, riverBasin: "Indus Basin", status: "Dam Foundation Excavation Active", remarks: "Diversion tunnel HCC Mumbai Baglihar Chenab excavation active" },
  { id: "HDC-0008", batchNo: "APGENCO/SRISSILAM/2025/PN-0045", developer: "Andhra Pradesh Genco Hyderabad", zone: "MP Narmada Sardar Sarovar", category: "3000MW Concrete Gravity Dam", description: "Srisailam Dam left bank powerhouse Francis turbine refurbishment 150MW unit", capacityMW: 1670, damHeight: 270, damType: "Concrete Gravity", turbineType: "Francis 250MW Vertical", penstockDia: 5.5, origin: "BHEL Hyderabad Plant", site: "Srisailam Dam Krishna River", state: "Andhra Pradesh", mode: "Multi-Axle 100T Generator", prodDate: "2025-02-22", shipDate: "", transitDays: 0, contractValue: 750000000, riverBasin: "Godavari Basin", status: "Dam Foundation Excavation Active", remarks: "Francis turbine refurbishment BHEL Hyderabad Srisailam QC" },
  { id: "HDC-0009", batchNo: "NHPC/DIBANG/2025/CF-0059", developer: "NHPC Faridabad HQ", zone: "Arunachal Siang Subansiri Dibang", category: "2500MW Concrete Face Rockfill CFRD", description: "Dibang Multipurpose CFRD 288m height concrete face rockfill dam core material", capacityMW: 2880, damHeight: 288, damType: "CFRD", turbineType: "Pelton 150MW Horizontal", penstockDia: 4.0, origin: "Gammon India Mumbai", site: "Dibang Project Lower Dibang Valley", state: "Arunachal Pradesh", mode: "Helicopter Sling 10T Remote", prodDate: "2025-04-25", shipDate: "2025-07-05", transitDays: 22, contractValue: 25000000000, riverBasin: "Brahmaputra Basin", status: "Penstock Steel Liner Installation", remarks: "CFRD core material Gammon Dibang 288m penstock liner install" },
  { id: "HDC-0010", batchNo: "THDC/KOTESHWAR/2025/SH-0088", developer: "THDC Rishikesh Uttarakhand", zone: "Uttarakhand Alaknanda Bhagirathi", category: "500MW Run-of-River Barrage", description: "Koteshwar Dam spillway crest gate 12m x 10m with electric wire rope hoist mechanism", capacityMW: 400, damHeight: 97, damType: "Run-of-River", turbineType: "Francis 250MW Vertical", penstockDia: 4.8, origin: "Ellenbarrie Industrial Bombay", site: "Koteshwar Bhagirathi River", state: "Uttarakhand", mode: "Barge 5000T Gate Hoist", prodDate: "2025-03-18", shipDate: "2025-06-28", transitDays: 6, contractValue: 580000000, riverBasin: "Ganga Basin", status: "Spillway Gate Hoist Assembly", remarks: "Spillway gate Ellenbarrie Koteshwar Bhagirathi assembly" },
  { id: "HDC-0011", batchNo: "SJVN/RAMPUR/2025/KB-0066", developer: "SJVN Shimla Himachal", zone: "Himachal Satluj Beas Sutlej", category: "1200MW Underground Pumped Storage", description: "Rampur PSP reversible pump-turbine 250MW underground powerhouse cavern excavation", capacityMW: 930, damHeight: 38, damType: "Pumped Storage", turbineType: "Reversible Pump-Turbine 250MW", penstockDia: 6.2, origin: "Voith Hydro Germany", site: "Rampur Satluj River", state: "Himachal Pradesh", mode: "Multi-Axle 100T Generator", prodDate: "2024-11-20", shipDate: "2025-02-15", transitDays: 48, contractValue: 6800000000, riverBasin: "Satluj Basin", status: "Reservoir Filling Grid Sync Done", remarks: "PSP reversible turbine Voith Rampur reservoir filling grid sync" },
  { id: "HDC-0012", batchNo: "NEEPCO/KAMENG/2025/AR-0072", developer: "NEEPCO Shillong Meghalaya", zone: "Sikkim Teesta Rangeet", category: "800MW Arch Dam Thin Concrete", description: "Kameng Dam arch thrust block 60m height double curvature concrete placement", capacityMW: 600, damHeight: 60, damType: "Arch Dam", turbineType: "Francis 250MW Vertical", penstockDia: 3.8, origin: "Jaypee Cement Bulandshahr", site: "Kameng Project West Kameng", state: "Arunachal Pradesh", mode: "Cable Crane 30T Dam Site", prodDate: "2025-05-01", shipDate: "", transitDays: 0, contractValue: 4100000000, riverBasin: "Brahmaputra Basin", status: "Dam Foundation Excavation Active", remarks: "Arch thrust block Jaypee Cement Kameng foundation excavation" },
  { id: "HDC-0013", batchNo: "NHPC/CHAMERA/2025/SM-0048", developer: "NHPC Faridabad HQ", zone: "Himachal Satluj Beas Sutlej", category: "200MW Small Hydro Canal Drop", description: "Chamera III small hydro Kaplan 50MW bulb turbine with trash rack and head regulator", capacityMW: 231, damHeight: 30, damType: "Run-of-River", turbineType: "Kaplan 50MW Bulb", penstockDia: 8.5, origin: "Alstom India Vadodara", site: "Chamera III Ravi River", state: "Himachal Pradesh", mode: "Rail Flat Wagon 80T Penstock", prodDate: "2025-02-28", shipDate: "2025-06-15", transitDays: 10, contractValue: 500000000, riverBasin: "Satluj Basin", status: "Turbine Generator Transport Transit", remarks: "Kaplan 50MW bulb turbine Alstom Vadodara Chamera III transit" },
  { id: "HDC-0014", batchNo: "NHDC/GANDHISAGAR/2025/EF-0019", developer: "NHDC Bhopal MP", zone: "MP Narmada Sardar Sarovar", category: "1500MW Earthfill Rockfill Embankment", description: "Gandhisagar Dam earthfill embankment reinforcement roller-compacted concrete 45m height", capacityMW: 1150, damHeight: 45, damType: "Earthfill Rockfill", turbineType: "Kaplan 50MW Bulb", penstockDia: 10.0, origin: "ACC Cement Kymore", site: "Gandhisagar Chambal River", state: "Madhya Pradesh", mode: "Cable Crane 30T Dam Site", prodDate: "2025-04-08", shipDate: "", transitDays: 0, contractValue: 620000000, riverBasin: "Narmada Basin", status: "Powerhouse Equipment Commissioning", remarks: "RCC embankment ACC Kymore Gandhisagar powerhouse commissioning" }
];

export default function HydroelectricDamConstructionLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalCapacity = records.reduce((s, r) => s + r.capacityMW, 0);
  const underConstruction = records.filter(r => statusColor[r.status] !== "green").length;
  const operational = records.filter(r => statusColor[r.status] === "green").length;
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

  const kpis = [
    { l: "Total Capacity (MW)", v: totalCapacity.toLocaleString(), s: "Across " + records.length + " dam projects" },
    { l: "Under Construction", v: underConstruction, s: "Non-operational active sites" },
    { l: "Operational", v: operational, s: "Grid sync completed" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "developer", label: "Developer", options: DEVELOPERS.map(d => ({ value: d, count: records.filter(r => r.developer === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "damType", label: "Dam Type", options: ["Concrete Gravity", "Earthfill Rockfill", "Arch Dam", "Run-of-River", "Pumped Storage", "CFRD"].map(t => ({ value: t, count: records.filter(r => r.damType === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.developer.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.site.toLowerCase().includes(q) && !r.riverBasin.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof DamRecord] as string));
  });

  const COLS = ["ID","Batch No","Developer","Zone","Category","Description","Capacity (MW)","Height (m)","Dam Type","Turbine","Penstock (m)","Origin","Site","State","Mode","Prod Date","Ship Date","Transit (d)","Contract (\u20b9)","River Basin","Status","Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="hdc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Construction Progress</h3><BarChart data={monthlyProgress} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="excavation" fill="#134e4a" radius={[4,4,0,0]} name="Excavation" /><Bar dataKey="concrete" fill="#0d9488" radius={[4,4,0,0]} name="Concrete" /><Bar dataKey="turbine" fill="#2dd4bf" radius={[4,4,0,0]} name="Turbine" /><Bar dataKey="penstock" fill="#2a9d8f" radius={[4,4,0,0]} name="Penstock" /></BarChart></div>
        <div className="hdc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dam Type Distribution (%)</h3><PieChart width={400} height={220}><Pie data={damTypeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{damTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="hdc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost Per MW Actual vs Target \u20b98Cr/MW</h3><LineChart data={costPerMW} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[6, 11]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#134e4a" strokeWidth={2} name="Actual \u20b9Cr/MW" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target \u20b98Cr" /></LineChart></div>
        <div className="hdc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">River Basin Installed Capacity (MW)</h3><BarChart data={basinCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0f766e" radius={[4,4,0,0]} name="Capacity MW" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="hdc-root p-6 space-y-6">
      <PageHeader title="Hydroelectric Dam Construction Logistics" description="Indian hydroelectric dam construction logistics for NHPC SJVN THDC NEEPCO covering concrete gravity earthfill arch run-of-river pumped storage CFRD dams with Francis Pelton Kaplan reversible pump-turbine penstock steel liner spillway gate hoist turbine generator transport across Satluj Brahmaputra Narmada Ganga Indus Godavari river basins" />
      <div className="hdc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`hdc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#134e4a] text-white" : "text-gray-600 hover:bg-teal-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="hdc-dashboard space-y-6">
          <div className="hdc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="hdc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 hdc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#134e4a] hdc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 hdc-kpi-sub">{k.s}</div></div>))}
          </div>
          {renderCharts()}
        </div>
      )}

      {tab === 1 && (
        <div className="hdc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Hydro", href: "#" }, { label: "Equipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="hdc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{COLS.map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "";
              const rowCls = sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-500" : "";
              return (<tr key={r.id} className={`border-b hover:bg-teal-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="hdc-badge inline-block px-2 py-0.5 rounded text-xs bg-[#134e4a] text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.developer}</td>
                <td className="px-3 py-2"><span className="hdc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="hdc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.capacityMW.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.damHeight}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.damType}</td>
                <td className="px-3 py-2"><span className="hdc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.turbineType}</span></td>
                <td className="px-3 py-2 text-xs font-semibold">{r.penstockDia}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.site}</td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate || "—"}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 30 ? "text-red-600" : r.transitDays >= 10 ? "text-amber-600" : r.transitDays > 0 ? "text-green-600" : "text-gray-400"}`}>{r.transitDays > 0 ? r.transitDays + "d" : "—"}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#134e4a]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2"><span className="hdc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.riverBasin}</span></td>
                <td className="px-3 py-2"><span className={`hdc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[sc]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="hdc-analytics space-y-6">
          {renderCharts()}
        </div>
      )}

      {tab === 3 && (
        <div className="hdc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="hdc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#134e4a] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
