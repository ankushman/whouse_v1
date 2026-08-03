"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#134e4a", "#115e59", "#0f766e", "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4"];
const OPERATORS = ["L&T Hydrocarbon Eng Mumbai", "Afcons Infrastructure Mumbai", "Dilip Buildcon Indore", "Hindustan Construction Co Mumbai", "ITD Cementation Mumbai", "NCC Limited Hyderabad", "Shapoorji Pallonji Mumbai", "JK Infra Projects Varanasi"];
const CATEGORIES = ["Immersed Tube Tunnel 3.2km 4-Lane", "Bored Tunnel 10km Rail Metro", "Cut-and-Cover Tunnel 2.8km 6-Lane", "Subsea Utility Tunnel 5km HVDC", "Under-River Tunnel 1.5km Road", "Micro Tunnelling 800m Sewage", "Shield TBM Tunnel 6km Water Supply", "NATM Tunnel 4km Hydro Power"];
const SHIPMENT_STATUSES = ["TBM Assembly Launch Active", "Segment Casting Tunnel Liner", "Immersed Tube Placement", "Cut-and-Cover Excavation", "Waterproofing Membrane Install", "Tunnel Breakthrough Complete"];
const ZONES = ["Mumbai Trans-Harbour Link Thane", "Bangalore Metro Tunnels KR Puram", "Chennai Coastal Road Tunnel", "Delhi RRTS Underground Tunnel", "Kolkata East-West Metro Hooghly", "Mumbai Coastal Road Marine Drive", "Hyderabad Pharma City Tunnel", "Varanasi RRTS Underground Ganga"];
const MODES = ["Barge 5000T Tunnel Element", "Heavy Haul 100T TBM Shield", "Crane Barge 200T Segment", "Rail Wagon Concrete Segment", "Tugboat Tow Immersed Tube", "Multi-Axle 80T Cutterhead"];
const TABS = ["Dashboard", "Tunnel Registry", "Tunnel Analytics", "Insights"];

const statusColor: Record<string, string> = { "TBM Assembly Launch Active": "orange", "Segment Casting Tunnel Liner": "orange", "Immersed Tube Placement": "blue", "Cut-and-Cover Excavation": "blue", "Waterproofing Membrane Install": "blue", "Tunnel Breakthrough Complete": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyProgress = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], tbm: +(22 + Math.sin(i * 0.5) * 8).toFixed(1), immersed: +(15 + Math.cos(i * 0.6) * 6).toFixed(1), cutcover: +(18 + Math.sin(i * 0.4) * 7).toFixed(1), utility: +(8 + Math.cos(i * 0.7) * 3).toFixed(1) }));
const methodDist = [{ n: "Bored Tunnel (TBM)", v: 35 }, { n: "Immersed Tube", v: 20 }, { n: "Cut-and-Cover", v: 22 }, { n: "NATM Drill-Blast", v: 12 }, { n: "Shield Tunnel", v: 7 }, { n: "Micro Tunnelling", v: 4 }];
const costPerKm = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], immersed: +(2800 + Math.sin(i * 0.4) * 400).toFixed(0), bored: +(2200 + Math.cos(i * 0.5) * 350).toFixed(0), cutcover: +(1200 + Math.sin(i * 0.6) * 200).toFixed(0) }));
const tunnelLength = [
  { tunnel: "MTHL", km: 3.2 },
  { tunnel: "Blr Metro", km: 10.0 },
  { tunnel: "Chennai CR", km: 2.8 },
  { tunnel: "Delhi RRTS", km: 6.5 },
  { tunnel: "Kol EW Metro", km: 4.8 },
  { tunnel: "Mum CR Marine", km: 2.1 },
  { tunnel: "Hyd Pharma", km: 3.5 },
  { tunnel: "Varanasi RRTS", km: 4.2 }
];

const INSIGHTS = [
  { t: "India\u2019s Submarine and Underwater Tunnel Revolution: 10 Major Projects", c: "India has embarked on an ambitious underwater tunnel construction programme with 10 major submarine and under-river tunnel projects worth over \u20b91.5 lakh crore. The Mumbai Trans-Harbour Link (MTHL) features India\u2019s first immersed tube tunnel section (3.2km) connecting Sewri to Nhava Sheva under the Thane Creek at 25m depth. The Bangalore Metro Phase-III includes 10km of underground twin bored tunnels through granite and gneiss rock formations. Kolkata East-West Metro\u2019s 4.8km underwater section beneath the Hooghly River using Herrenknecht slurry TBM represents India\u2019s deepest river crossing tunnel at 32m below riverbed. These projects require specialized logistics for TBM transportation, immersed tube element casting, tunnel segment supply chains, and marine operations for underwater construction." },
  { t: "Immersed Tube Tunnel Construction: MTHL 3.2km Under Thane Creek", c: "The Mumbai Trans-Harbour Link\u2019s immersed tube tunnel section comprises 8 elements each weighing 28,000 tonnes, fabricated at a casting yard in Nhava Sheva and towed 4km to the installation site. Each element measures 60m x 45m x 12m (length x width x height) with internal 4-lane road carriageway, ventilation ducts, and emergency escape galleries. The immersion process uses 8 ballast tanks for controlled sinking to a prepared foundation trench on the Thane Creek seabed. GINA and OMEGA rubber gaskets provide watertight seals between elements. L&T and Daewoo E&C consortium executed the immersed tube installation using 4,500-tonne capacity crane barges and precise GPS positioning systems with tolerance of \u00b150mm. The project overcame significant challenges including tidal variations of 4m, high seismic zone requirements, and monsoon wave conditions during marine operations." },
  { t: "TBM Logistics: Herrenknecht Robbins CRCHI for Indian Tunnel Projects", c: "Tunnel Boring Machine logistics in India involves transporting massive 12-14m diameter shield TBMs weighing 1,200-2,500 tonnes from international manufacturers (Herrenknecht Germany, Robbins USA, CRCHI China, Kawasaki Japan) to project sites. The MTHL project used a 12.19m diameter Herrenknecht slurry TBM, while Kolkata East-West Metro deployed a 6.68m diameter Herrenknecht EPB shield. Bangalore Metro Phase-III requires 4 TBMs of 6.28m diameter for twin bore tunnels. TBM disassembly into 30-40 components (cutterhead, shield sections, erector, conveyor, drive motors) enables transport by multi-axle trailers from port to site. Assembly at launch shafts takes 3-4 months, with cutterhead restoration and segment ring commissioning consuming additional time. Average TBM advance rates in Indian geological conditions range from 8-15 metres per day in hard rock (granite, basalt) and 15-25 metres per day in soft ground (alluvium, clay)." },
  { t: "Subsea Utility Tunnels: HVDC Cable and Water Supply Crossings in India", c: "India\u2019s growing coastal infrastructure demands subsea utility tunnels for HVDC power transmission cables, water supply pipelines, and telecommunication fiber optic cables. The Gujarat HVDC submarine cable corridor (5km, 500kV) connects Mundra thermal power station to the Saurashtra peninsula, while the Chennai coastal utility tunnel houses 220kV power cables and desalination plant water mains. Subsea utility tunnels are typically 3-5m internal diameter, constructed using pipe-jacking, micro-tunnelling, or horizontal directional drilling (HDD) methods. The Kochi LNG submarine pipeline tunnel (2.8km under Vembanad Lake) demonstrates India\u2019s capability in shallow-water utility tunnel construction. Waterproofing requirements include 2-3 layer membrane systems (PVC/EVA liners, Bentonite clay, crystalline waterproofing) with leak detection systems monitoring water ingress at less than 0.5 litres per minute per kilometre of tunnel length." }
];

interface TunnelRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; tunnelLengthM: number; diameterM: number; depthBelowM: number; method: string; geology: string; origin: string; project: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; tbmMake: string; status: string; remarks: string; }

const records: TunnelRecord[] = [
  { id: "SMT-0001", batchNo: "LTH/MUM/2025/IT-0012", operator: "L&T Hydrocarbon Eng Mumbai", zone: "Mumbai Trans-Harbour Link Thane", category: "Immersed Tube Tunnel 3.2km 4-Lane", description: "3.2km immersed tube tunnel under Thane Creek 25m depth 8 elements 28000T each for MTHL Sewri to Nhava Sheva 4-lane connection", tunnelLengthM: 3200, diameterM: 45, depthBelowM: 25, method: "Immersed Tube", geology: "Marine Clay Sand", origin: "L&T Casting Yard Nhava Sheva", project: "MTHL Immersed Tube Section", state: "Maharashtra", mode: "Barge 5000T Tunnel Element", prodDate: "2025-01-10", shipDate: "2025-03-18", transitDays: 1, contractValue: 8200000000, tbmMake: "N/A Immersed Tube", status: "Tunnel Breakthrough Complete", remarks: "MTHL immersed tube L&T Thane Creek breakthrough complete" },
  { id: "SMT-0002", batchNo: "AFC/MUM/2025/BT-0025", operator: "Afcons Infrastructure Mumbai", zone: "Bangalore Metro Tunnels KR Puram", category: "Bored Tunnel 10km Rail Metro", description: "10km twin bore tunnel Bangalore Metro Phase-III KR Puram to Silk Board with 6.28m TBM through granite gneiss rock formation", tunnelLengthM: 10000, diameterM: 6.28, depthBelowM: 30, method: "Bored TBM", geology: "Granite Gneiss", origin: "Herrenknecht Schwanau DE", project: "Blr Metro Phase-III Tunnel", state: "Karnataka", mode: "Heavy Haul 100T TBM Shield", prodDate: "2025-02-15", shipDate: "2025-05-22", transitDays: 45, contractValue: 4500000000, tbmMake: "Herrenknecht S-386", status: "TBM Assembly Launch Active", remarks: "Bangalore Metro TBM Herrenknecht assembly active KR Puram" },
  { id: "SMT-0003", batchNo: "DBC/IDR/2025/CC-0038", operator: "Dilip Buildcon Indore", zone: "Chennai Coastal Road Tunnel", category: "Cut-and-Cover Tunnel 2.8km 6-Lane", description: "2.8km cut-and-cover tunnel Chennai Coastal Road from Napier Bridge to Lighthouse with 6-lane divided carriageway and ventilation shafts", tunnelLengthM: 2800, diameterM: 28, depthBelowM: 18, method: "Cut-and-Cover", geology: "Coastal Sand Clay", origin: "DBC Casting Yard Ennore TN", project: "Chennai Coastal Road Tunnel", state: "Tamil Nadu", mode: "Crane Barge 200T Segment", prodDate: "2024-11-05", shipDate: "2025-03-20", transitDays: 3, contractValue: 2800000000, tbmMake: "N/A Cut-and-Cover", status: "Cut-and-Cover Excavation", remarks: "Chennai CR cut-cover DBC excavation Napier Bridge active" },
  { id: "SMT-0004", batchNo: "HCC/MUM/2025/UT-0042", operator: "Hindustan Construction Co Mumbai", zone: "Delhi RRTS Underground Tunnel", category: "Subsea Utility Tunnel 5km HVDC", description: "5km subsea utility tunnel Delhi RRTS underground section for 25kV traction power cables and signaling systems with fire-rated compartments", tunnelLengthM: 5000, diameterM: 4.5, depthBelowM: 35, method: "Bored TBM", geology: "Alluvium Quartzite", origin: "Robbins Solon OH USA", project: "Delhi RRTS Utility Tunnel", state: "Delhi", mode: "Multi-Axle 80T Cutterhead", prodDate: "2025-03-01", shipDate: "2025-06-15", transitDays: 55, contractValue: 3200000000, tbmMake: "Robbins C-510", status: "Segment Casting Tunnel Liner", remarks: "Delhi RRTS utility Robbins TBM segment casting active" },
  { id: "SMT-0005", batchNo: "ITD/MUM/2025/UR-0055", operator: "ITD Cementation Mumbai", zone: "Kolkata East-West Metro Hooghly", category: "Under-River Tunnel 1.5km Road", description: "1.5km under-river tunnel beneath Hooghly River for Kolkata East-West Metro with 6.68m slurry TBM at 32m below riverbed", tunnelLengthM: 1500, diameterM: 6.68, depthBelowM: 32, method: "Bored TBM", geology: "Stiff Clay Silty Sand", origin: "Herrenknecht Schwanau DE", project: "Kolkata EW Metro Hooghly Tunnel", state: "West Bengal", mode: "Barge 5000T Tunnel Element", prodDate: "2025-02-20", shipDate: "2025-05-10", transitDays: 30, contractValue: 2200000000, tbmMake: "Herrenknecht S-394", status: "Waterproofing Membrane Install", remarks: "Kolkata EW Metro Herrenknecht Hooghly waterproofing" },
  { id: "SMT-0006", batchNo: "NCC/HYD/2025/MT-0068", operator: "NCC Limited Hyderabad", zone: "Mumbai Coastal Road Marine Drive", category: "Micro Tunnelling 800m Sewage", description: "800mm diameter micro tunnel for Mumbai Coastal Road sewage outfall improvement at Marine Drive with pipe-jacking through basalt rock", tunnelLengthM: 800, diameterM: 2.4, depthBelowM: 12, method: "Micro Tunnelling", geology: "Basalt Breccia", origin: "Akkerman Solon OH USA", project: "Mumbai CR Sewage Micro Tunnel", state: "Maharashtra", mode: "Rail Wagon Concrete Segment", prodDate: "2025-04-15", shipDate: "2025-07-25", transitDays: 20, contractValue: 450000000, tbmMake: "Akkerman AVN1200", status: "Tunnel Breakthrough Complete", remarks: "Mumbai CR micro tunnel NCC Marine Drive breakthrough" },
  { id: "SMT-0007", batchNo: "SHP/MUM/2025/ST-0071", operator: "Shapoorji Pallonji Mumbai", zone: "Hyderabad Pharma City Tunnel", category: "Shield TBM Tunnel 6km Water Supply", description: "6km shield TBM tunnel for Hyderabad Pharma City water supply main from Nagarjuna Sagar reservoir with 3.5m diameter steel-lined tunnel", tunnelLengthM: 6000, diameterM: 3.5, depthBelowM: 40, method: "Shield TBM", geology: "Granite Dolerite", origin: "CRCHI Changsha CN", project: "Hyderabad Pharma City Water Tunnel", state: "Telangana", mode: "Heavy Haul 100T TBM Shield", prodDate: "2025-03-15", shipDate: "2025-05-28", transitDays: 60, contractValue: 1800000000, tbmMake: "CRCHI TBM-6350", status: "TBM Assembly Launch Active", remarks: "Hyderabad Pharma City CRCHI TBM assembly launch active" },
  { id: "SMT-0008", batchNo: "JKI/VAR/2025/NM-0084", operator: "JK Infra Projects Varanasi", zone: "Varanasi RRTS Underground Ganga", category: "NATM Tunnel 4km Hydro Power", description: "4.2km NATM tunnel for Varanasi RRTS underground section beneath Ganga River with drill-blast excavation through Varanasi shale formation", tunnelLengthM: 4200, diameterM: 6.5, depthBelowM: 28, method: "NATM Drill-Blast", geology: "Shale Sandstone", origin: "Sandvik Sweden", project: "Varanasi RRTS Ganga Tunnel", state: "Uttar Pradesh", mode: "Multi-Axle 80T Cutterhead", prodDate: "2024-09-10", shipDate: "2025-02-15", transitDays: 25, contractValue: 2500000000, tbmMake: "N/A NATM Drill-Blast", status: "Segment Casting Tunnel Liner", remarks: "Varanasi RRTS NATM Ganga tunnel segment casting" },
  { id: "SMT-0009", batchNo: "LTH/MUM/2025/IT-0097", operator: "L&T Hydrocarbon Eng Mumbai", zone: "Mumbai Trans-Harbour Link Thane", category: "Immersed Tube Tunnel 3.2km 4-Lane", description: "MTHL immersed tube tunnel element 8 final placement and connection with OMEGA gasket sealing and ballast tank grouting completion", tunnelLengthM: 240, diameterM: 45, depthBelowM: 25, method: "Immersed Tube", geology: "Marine Clay Sand", origin: "L&T Casting Yard Nhava Sheva", project: "MTHL IT Element-8 Final", state: "Maharashtra", mode: "Tugboat Tow Immersed Tube", prodDate: "2025-01-20", shipDate: "2025-04-05", transitDays: 1, contractValue: 950000000, tbmMake: "N/A Immersed Tube", status: "Tunnel Breakthrough Complete", remarks: "MTHL Element-8 L&T final placement breakthrough" },
  { id: "SMT-0010", batchNo: "AFC/MUM/2025/BT-0108", operator: "Afcons Infrastructure Mumbai", zone: "Bangalore Metro Tunnels KR Puram", category: "Bored Tunnel 10km Rail Metro", description: "Bangalore Metro TBM-2 second bore tunnel KR Puram to Jayadeva with 6.28m Herrenknecht EPB through weathered granite transition zone", tunnelLengthM: 5000, diameterM: 6.28, depthBelowM: 28, method: "Bored TBM", geology: "Weathered Granite", origin: "Herrenknecht Schwanau DE", project: "Blr Metro Phase-III Tunnel-2", state: "Karnataka", mode: "Rail Wagon Concrete Segment", prodDate: "2025-04-01", shipDate: "2025-06-20", transitDays: 50, contractValue: 3800000000, tbmMake: "Herrenknecht S-387", status: "Segment Casting Tunnel Liner", remarks: "Bangalore Metro TBM-2 Herrenknecht segment casting" },
  { id: "SMT-0011", batchNo: "DBC/IDR/2025/CC-0115", operator: "Dilip Buildcon Indore", zone: "Chennai Coastal Road Tunnel", category: "Cut-and-Cover Tunnel 2.8km 6-Lane", description: "Chennai Coastal Road tunnel ventilation shaft construction with jet fan systems and emergency egress stairs at 500m intervals along tunnel alignment", tunnelLengthM: 280, diameterM: 15, depthBelowM: 18, method: "Cut-and-Cover", geology: "Coastal Sand Clay", origin: "FlaktGroup Hyderabad TG", project: "Chennai CR Ventilation Shaft-2", state: "Tamil Nadu", mode: "Crane Barge 200T Segment", prodDate: "2024-12-20", shipDate: "2025-04-10", transitDays: 3, contractValue: 320000000, tbmMake: "N/A Cut-and-Cover", status: "Waterproofing Membrane Install", remarks: "Chennai CR ventilation DBC shaft waterproofing active" },
  { id: "SMT-0012", batchNo: "HCC/MUM/2025/UT-0128", operator: "Hindustan Construction Co Mumbai", zone: "Delhi RRTS Underground Tunnel", category: "Subsea Utility Tunnel 5km HVDC", description: "Delhi RRTS underground station cut-and-cover boxes with diaphragm wall construction and base slab waterproofing for underground metro stations", tunnelLengthM: 350, diameterM: 22, depthBelowM: 22, method: "Cut-and-Cover", geology: "Alluvium Silty Clay", origin: "Bauer Speyer DE", project: "Delhi RRTS Station Box", state: "Delhi", mode: "Heavy Haul 100T TBM Shield", prodDate: "2025-03-25", shipDate: "2025-07-05", transitDays: 35, contractValue: 580000000, tbmMake: "N/A Diaphragm Wall", status: "Immersed Tube Placement", remarks: "Delhi RRTS station HCC diaphragm wall d-wall active" },
  { id: "SMT-0013", batchNo: "ITD/MUM/2025/UR-0132", operator: "ITD Cementation Mumbai", zone: "Kolkata East-West Metro Hooghly", category: "Under-River Tunnel 1.5km Road", description: "Kolkata EW Metro tunnel breakthrough chamber construction at Esplanade shaft with segment ring dismantling and TBM retrieval planning", tunnelLengthM: 180, diameterM: 6.68, depthBelowM: 32, method: "Bored TBM", geology: "Stiff Clay Silty Sand", origin: "Herrenknecht Schwanau DE", project: "Kolkata EW Breakthrough Chamber", state: "West Bengal", mode: "Barge 5000T Tunnel Element", prodDate: "2025-02-05", shipDate: "2025-04-12", transitDays: 2, contractValue: 420000000, tbmMake: "Herrenknecht S-394", status: "Immersed Tube Placement", remarks: "Kolkata EW breakthrough chamber ITD Esplanade active" },
  { id: "SMT-0014", batchNo: "NCC/HYD/2025/ST-0146", operator: "NCC Limited Hyderabad", zone: "Hyderabad Pharma City Tunnel", category: "Shield TBM Tunnel 6km Water Supply", description: "Hyderabad Pharma City water tunnel TBM breakthrough at receiving shaft with cutterhead inspection and seal replacement before retrieval", tunnelLengthM: 6000, diameterM: 3.5, depthBelowM: 40, method: "Shield TBM", geology: "Granite Dolerite", origin: "CRCHI Changsha CN", project: "Hyderabad Pharma City Breakthrough", state: "Telangana", mode: "Multi-Axle 80T Cutterhead", prodDate: "2025-04-10", shipDate: "2025-06-20", transitDays: 1, contractValue: 280000000, tbmMake: "CRCHI TBM-6350", status: "Tunnel Breakthrough Complete", remarks: "Hyderabad Pharma City CRCHI TBM breakthrough complete" }
];

export default function SubmarineTunnelLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalLengthM = records.reduce((s, r) => s + r.tunnelLengthM, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => { const c = statusColor[r.status]; return c !== "green"; }).length;
  const completed = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total Tunnel Length (m)", v: totalLengthM.toLocaleString("en-IN"), s: "Across " + records.length + " tunnel records" },
    { l: "Under Construction", v: underConstruction, s: "TBM assembly to waterproofing" },
    { l: "Breakthrough Done", v: completed, s: "Tunnel breakthrough complete" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "method", label: "Method", options: ["Immersed Tube", "Bored TBM", "Cut-and-Cover", "Micro Tunnelling", "Shield TBM", "NATM Drill-Blast"].map(t => ({ value: t, count: records.filter(r => r.method === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q) && !r.method.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof TunnelRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Length (m)", "Diameter (m)", "Depth (m)", "Method", "Geology", "Origin", "Project", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "TBM Make", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="smt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Tunnel Construction Progress by Method (%)</h3><BarChart data={monthlyProgress} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="tbm" fill="#134e4a" radius={[4,4,0,0]} name="TBM Bored" /><Bar dataKey="immersed" fill="#0f766e" radius={[4,4,0,0]} name="Immersed Tube" /><Bar dataKey="cutcover" fill="#0d9488" radius={[4,4,0,0]} name="Cut-Cover" /><Bar dataKey="utility" fill="#14b8a6" radius={[4,4,0,0]} name="Utility" /></BarChart></div>
        <div className="smt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Tunnel Construction Method Distribution (%)</h3><PieChart width={400} height={220}><Pie data={methodDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{methodDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="smt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Tunnel Cost Per Km (\u20b9Cr/km) by Method</h3><LineChart data={costPerKm} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[500, 3500]} /><Tooltip /><Legend /><Line type="monotone" dataKey="immersed" stroke="#134e4a" strokeWidth={2} name="Immersed" /><Line type="monotone" dataKey="bored" stroke="#0f766e" strokeWidth={2} strokeDasharray="5 5" name="Bored" /><Line type="monotone" dataKey="cutcover" stroke="#0d9488" strokeWidth={2} strokeDasharray="2 2" name="Cut-Cover" /></LineChart></div>
        <div className="smt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Major Tunnel Project Length (km)</h3><BarChart data={tunnelLength} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tunnel" /><YAxis /><Tooltip /><Legend /><Bar dataKey="km" fill="#0f766e" radius={[4,4,0,0]} name="Length km" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="smt-root p-6 space-y-6">
      <PageHeader title="Submarine Tunnel Logistics" description="Indian submarine and underwater tunnel logistics covering immersed tube 3.2km MTHL bored TBM 10km Bangalore Metro cut-and-cover 2.8km Chennai subsea utility 5km HVDC under-river 1.5km Hooghly micro tunnelling 800m sewage shield TBM 6km water supply NATM 4km hydro with Herrenknecht Robbins CRCHI slurry EPB shield TBM marine barge operations GINA OMEGA gaskets across Mumbai Bangalore Chennai Delhi Kolkata Hyderabad Varanasi" />
      <div className="smt-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`smt-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#134e4a] text-white" : "text-gray-600 hover:bg-teal-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Submarine Tunnel" }]} />
      {tab === 0 && (
        <div className="smt-dash space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <div key={i} className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">{k.l}</p><p className="text-2xl font-bold text-[#134e4a]">{typeof k.v === 'number' ? k.v.toLocaleString('en-IN') : k.v}</p><p className="text-xs text-gray-400">{k.s}</p></div>)}
          </div>
          {renderCharts()}
          <div className="grid grid-cols-2 gap-6">
            {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-4"><h4 className="text-sm font-semibold mb-2 text-[#134e4a]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="smt-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="smt-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{r.tunnelLengthM}</td><td className="px-3 py-2 text-right">{r.diameterM}</td><td className="px-3 py-2 text-right">{r.depthBelowM}</td><td className="px-3 py-2">{r.method}</td><td className="px-3 py-2">{r.geology}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.project}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.tbmMake}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="smt-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="smt-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#134e4a]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
