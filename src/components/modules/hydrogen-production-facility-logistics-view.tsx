"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1e3a5f", "#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#1d4ed8"];
const OPERATORS = ["Indian Oil Corp R&D Faridabad", "NTPC Green Energy Delhi", "Reliance Jamnagar Gujarat", "Adani Total Kandla Gujarat", "L&T Heavy Engineering Hazira", "BHEL Hyderabad Telangana", "Thermax Pune Maharashtra", "GAIL Green Hydrogen Delhi"];
const CATEGORIES = ["5MW Green Electrolyser PEM Stack", "10MW Alkaline Electrolyser Plant", "50MW SMR Blue Hydrogen Reforming", "2MW Biomass Gasifier H2 Plant", "20MW AES Wind-Solar Hybrid H2", "100TPD Bio-Methane Reforming", "5MW PEM Rail Varda Corridor", "15MW Offshore Wind Electrolyser"];
const SHIPMENT_STATUSES = ["Electrolyser Stack Assembly", "Compressor Storage Tank Install", "Pipeline Connection Commissioning", "Feedstock Supply Active", "Safety Valve Testing Active", "Green H2 Production Export"];
const ZONES = ["Gujarat Jamnagar Kandla Green H2 Hub", "Odisha Paradip Gopalpur Cluster", "Rajasthan Jodhpur Jaisalmer Solar H2", "Tamil Nadu Chennai Cuddalore Port", "Karnataka Bangalore Mangalore", "Maharashtra Mumbai Navi Mumbai", "UP Mathura Refinery H2 Hub", "Assam Numaligarh Refinery"];
const MODES = ["Flatbed Trailer 40T Electrolyser", "Heavy Haul 80T Compressor Bank", "Crane Truck 30T Storage Tank", "Rail Wagon Tube Trailer H2", "Barge Coastal Desalination Unit", "Multi-Axle 60T SMR Reformer"];
const TABS = ["Dashboard", "Facility Registry", "Hydrogen Analytics", "Insights"];

const statusColor: Record<string, string> = { "Electrolyser Stack Assembly": "orange", "Compressor Storage Tank Install": "orange", "Pipeline Connection Commissioning": "blue", "Feedstock Supply Active": "blue", "Safety Valve Testing Active": "blue", "Green H2 Production Export": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyProd = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], pem: +(12 + Math.sin(i * 0.5) * 5).toFixed(1), alkaline: +(18 + Math.cos(i * 0.6) * 7).toFixed(1), smr: +(30 + Math.sin(i * 0.4) * 8).toFixed(1), biomass: +(5 + Math.cos(i * 0.7) * 2).toFixed(1) }));
const techDist = [{ n: "PEM Electrolysis", v: 25 }, { n: "Alkaline Electrolysis", v: 30 }, { n: "SMR (Blue)", v: 28 }, { n: "Biomass Gasifier", v: 8 }, { n: "AWE Wind-Solar", v: 6 }, { n: "Bio-Methane Reforming", v: 3 }];
const costPerKg = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], green: +(320 + Math.sin(i * 0.4) * 60).toFixed(0), blue: +(180 + Math.cos(i * 0.5) * 30).toFixed(0), grey: +(90 + Math.sin(i * 0.6) * 15).toFixed(0) }));
const stateCapacity = [
  { state: "GJ", mw: 850 },
  { state: "OD", mw: 620 },
  { state: "RJ", mw: 480 },
  { state: "TN", mw: 390 },
  { state: "KA", mw: 310 },
  { state: "MH", mw: 280 },
  { state: "UP", mw: 220 },
  { state: "AS", mw: 150 }
];

const INSIGHTS = [
  { t: "India\u2019s National Green Hydrogen Mission: 5MT Production Target by 2030", c: "India launched the National Green Hydrogen Mission in January 2023 with an outlay of \u20b919,744 crore ($2.3 billion) aiming to produce 5 million tonnes of green hydrogen annually by 2030. The mission provides \u20b94,440 crore under SIGHT (Strategic Interventions for Green Hydrogen Transition) for electrolyser manufacturing incentives of up to \u20b94.50 per kWh and production-linked incentives for green hydrogen at \u20b92.50 per kg for 3 years. The policy framework mandates blending 5% green hydrogen with natural gas for city gas networks and fertilizer production by 2028, scaling to 15% by 2035. NTPC, Reliance Industries, Adani Green, Indian Oil, and GAIL have collectively announced over $15 billion in green hydrogen investments across Gujarat, Odisha, Rajasthan, and Tamil Nadu." },
  { t: "PEM vs Alkaline Electrolysers: India\u2019s Technology Choice for Green H2", c: "India\u2019s green hydrogen strategy centers on two competing electrolyser technologies. Proton Exchange Membrane (PEM) electrolysers from manufacturers like IOCL-Phinergy, Reliance-ION, and L&T offer faster ramp-up times (seconds vs minutes), higher current density (1-2A/cm2), and better compatibility with variable renewable energy, but cost 2-3 times more than alkaline systems at $1,100-1,500/kW. Alkaline electrolysers from BHEL, ThyssenKrupp, and John Cockerill offer lower capital costs ($500-800/kW) and proven long-term durability (80,000+ hours), but require steadier DC power input. India\u2019s SIGHT incentive scheme covers both technologies, with bids received for 3,000MW electrolyser capacity in the first tranche. The domestic electrolyser manufacturing ecosystem is being built through technology transfer partnerships with European and Chinese OEMs." },
  { t: "Blue Hydrogen SMR with CCS: Reliance Adani IOC Refinery Decarbonization", c: "Blue hydrogen produced through Steam Methane Reforming (SMR) with Carbon Capture and Storage (CCS) represents India\u2019s bridge strategy toward a hydrogen economy. Indian refineries at Jamnagar (Reliance), Vadodara (IOC), Koyali (IOC), and Bathinda (HPCL-Mittal) collectively consume over 2 million tonnes per annum (MTPA) of grey hydrogen for hydrocracking and desulfurization processes. Converting 30% of this capacity to blue hydrogen with 90% carbon capture would abate approximately 6 million tonnes of CO2 annually. The installed cost for SMR with CCS ranges from $1.0-1.5/kg H2, significantly cheaper than current green hydrogen costs of $3.2-5.0/kg. IOC\u2019s research center at Faridabad and Reliance\u2019s Jamnagar complex are piloting amine-based and membrane-based CCS technologies with capture rates exceeding 85%." },
  { t: "Hydrogen Transport and Storage: India\u2019s Pipeline and Tube Trailer Logistics", c: "Hydrogen transport logistics in India face unique challenges due to the low volumetric energy density of hydrogen (0.09 kg/m3 at atmospheric pressure). Current hydrogen movement relies on compressed gas tube trailers (200-250 bar, 300-500 kg per trailer) for distances under 300km and cryogenic liquid tankers for longer distances. India\u2019s first dedicated hydrogen pipeline corridor is planned from Gujarat\u2019s Jamnagar refinery cluster to Kandla port (180km, 24-inch), with potential extension to the Delhi-Mumbai Industrial Corridor. GAIL is repurposing 200km of existing natural gas pipeline for hydrogen blending up to 15% concentration. Underground salt cavern hydrogen storage at Kandla and underground lined rock caverns in Rajasthan are being evaluated for seasonal storage capacity of 10,000+ tonnes." }
];

interface H2Record { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; capacityMW: number; h2Type: string; prodTPD: number; efficiency: number; purityStd: string; origin: string; plant: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; electrolyserType: string; status: string; remarks: string; }

const records: H2Record[] = [
  { id: "HPF-0001", batchNo: "IOC/FBD/2025/PEM-0012", operator: "Indian Oil Corp R&D Faridabad", zone: "UP Mathura Refinery H2 Hub", category: "5MW Green Electrolyser PEM Stack", description: "5MW PEM electrolyser stack assembly for Mathura refinery green hydrogen blending pilot with 99.999% purity output", capacityMW: 5, h2Type: "Green", prodTPD: 2.4, efficiency: 65, purityStd: "ISO 14687 Grade D", origin: "IOC R&D Faridabad HR", plant: "Mathura Refinery H2 Pilot", state: "Uttar Pradesh", mode: "Flatbed Trailer 40T Electrolyser", prodDate: "2025-01-10", shipDate: "2025-03-18", transitDays: 3, contractValue: 125000000, electrolyserType: "PEM 5MW Stack", status: "Green H2 Production Export", remarks: "5MW PEM electrolyser IOC Faridabad Mathura green H2 export" },
  { id: "HPF-0002", batchNo: "NTP/DEL/2025/AWE-0025", operator: "NTPC Green Energy Delhi", zone: "Gujarat Jamnagar Kandla Green H2 Hub", category: "10MW Alkaline Electrolyser Plant", description: "10MW alkaline electrolyser plant for Kandla green hydrogen hub with 80 bar compressor and tube trailer loading facility", capacityMW: 10, h2Type: "Green", prodTPD: 4.8, efficiency: 60, purityStd: "ISO 14687 Grade D", origin: "BHEL Hyderabad TG", plant: "Kandla Green H2 Hub Plant", state: "Gujarat", mode: "Heavy Haul 80T Compressor Bank", prodDate: "2025-02-15", shipDate: "2025-05-22", transitDays: 8, contractValue: 240000000, electrolyserType: "Alkaline 10MW AWE", status: "Electrolyser Stack Assembly", remarks: "10MW alkaline electrolyser NTPC Delhi Kandla stack assembly" },
  { id: "HPF-0003", batchNo: "REL/JMN/2025/SMR-0038", operator: "Reliance Jamnagar Gujarat", zone: "Gujarat Jamnagar Kandla Green H2 Hub", category: "50MW SMR Blue Hydrogen Reforming", description: "50MW SMR blue hydrogen reformer with amine-based CCS 90% capture rate for Jamnagar refinery hydrocracker feedstock replacement", capacityMW: 50, h2Type: "Blue", prodTPD: 720, efficiency: 78, purityStd: "ISO 14687 Grade D", origin: "L&T Heavy Eng Hazira", plant: "Jamnagar Refinery Blue H2", state: "Gujarat", mode: "Multi-Axle 60T SMR Reformer", prodDate: "2024-11-05", shipDate: "2025-03-20", transitDays: 2, contractValue: 1800000000, electrolyserType: "SMR 50MW + CCS", status: "Compressor Storage Tank Install", remarks: "50MW SMR blue H2 Reliance Jamnagar CCS compressor install" },
  { id: "HPF-0004", batchNo: "ADI/KND/2025/AWE-0042", operator: "Adani Total Kandla Gujarat", zone: "Odisha Paradip Gopalpur Cluster", category: "20MW AES Wind-Solar Hybrid H2", description: "20MW alkaline electrolyser powered by 150MW wind-solar hybrid for Gopalpur green hydrogen production and steel reduction pilot", capacityMW: 20, h2Type: "Green", prodTPD: 9.6, efficiency: 62, purityStd: "ISO 14687 Grade D", origin: "Thermax Pune MH", plant: "Gopalpur Wind-Solar H2 Plant", state: "Odisha", mode: "Crane Truck 30T Storage Tank", prodDate: "2025-03-01", shipDate: "2025-06-15", transitDays: 12, contractValue: 450000000, electrolyserType: "AWE 20MW Hybrid", status: "Pipeline Connection Commissioning", remarks: "20MW AES electrolyser Adani Kandla Gopalpur pipeline commission" },
  { id: "HPF-0005", batchNo: "LNH/HZR/2025/PEM-0055", operator: "L&T Heavy Engineering Hazira", zone: "Rajasthan Jodhpur Jaisalmer Solar H2", category: "5MW PEM Rail Varda Corridor", description: "5MW PEM electrolyser system for Jaisalmer solar park green hydrogen production along Dedicated Freight Corridor rail hydrogen transport", capacityMW: 5, h2Type: "Green", prodTPD: 2.4, efficiency: 67, purityStd: "ISO 14687 Grade D", origin: "L&T Hazira Works GJ", plant: "Jaisalmer Solar H2 Plant", state: "Rajasthan", mode: "Rail Wagon Tube Trailer H2", prodDate: "2025-02-20", shipDate: "2025-05-10", transitDays: 10, contractValue: 115000000, electrolyserType: "PEM 5MW Rail", status: "Safety Valve Testing Active", remarks: "5MW PEM rail electrolyser L&T Hazira Jaisalmer safety testing" },
  { id: "HPF-0006", batchNo: "BHE/HYD/2025/SMR-0068", operator: "BHEL Hyderabad Telangana", zone: "Tamil Nadu Chennai Cuddalore Port", category: "100TPD Bio-Methane Reforming", description: "100TPD bio-methane reforming unit for Chennai port green hydrogen bunker fuel supply and container terminal operations", capacityMW: 8, h2Type: "Green", prodTPD: 100, efficiency: 55, purityStd: "ISO 14687 Grade D", origin: "BHEL Hyderabad Plant TG", plant: "Chennai Port Bio-Methane H2", state: "Tamil Nadu", mode: "Barge Coastal Desalination Unit", prodDate: "2025-04-15", shipDate: "2025-07-25", transitDays: 15, contractValue: 210000000, electrolyserType: "Bio-Methane Reformer", status: "Feedstock Supply Active", remarks: "100TPD bio-methane BHEL Hyderabad Chennai feedstock active" },
  { id: "HPF-0007", batchNo: "THX/PUN/2025/BMG-0071", operator: "Thermax Pune Maharashtra", zone: "Karnataka Bangalore Mangalore", category: "2MW Biomass Gasifier H2 Plant", description: "2MW biomass gasifier hydrogen plant for Mangalore port green hydrogen fuel cell vehicle refueling station", capacityMW: 2, h2Type: "Green", prodTPD: 0.96, efficiency: 48, purityStd: "ISO 14687 Grade D", origin: "Thermax Works Pune MH", plant: "Mangalore Port Biomass H2", state: "Karnataka", mode: "Flatbed Trailer 40T Electrolyser", prodDate: "2025-03-15", shipDate: "2025-05-28", transitDays: 6, contractValue: 65000000, electrolyserType: "Biomass Gasifier 2MW", status: "Electrolyser Stack Assembly", remarks: "2MW biomass gasifier Thermax Pune Mangalore stack assembly" },
  { id: "HPF-0008", batchNo: "GAI/DEL/2025/PEM-0084", operator: "GAIL Green Hydrogen Delhi", zone: "Maharashtra Mumbai Navi Mumbai", category: "15MW Offshore Wind Electrolyser", description: "15MW offshore wind powered PEM electrolyser for Mumbai trans-harbour green hydrogen pipeline injection at 15% blend ratio", capacityMW: 15, h2Type: "Green", prodTPD: 7.2, efficiency: 64, purityStd: "ISO 14687 Grade D", origin: "Reliance Jamnagar GJ", plant: "Mumbai Offshore Wind H2", state: "Maharashtra", mode: "Multi-Axle 60T SMR Reformer", prodDate: "2024-09-10", shipDate: "2025-02-15", transitDays: 4, contractValue: 520000000, electrolyserType: "PEM 15MW Offshore", status: "Compressor Storage Tank Install", remarks: "15MW offshore PEM GAIL Delhi Mumbai compressor install" },
  { id: "HPF-0009", batchNo: "IOC/FBD/2025/AWE-0097", operator: "Indian Oil Corp R&D Faridabad", zone: "UP Mathura Refinery H2 Hub", category: "10MW Alkaline Electrolyser Plant", description: "10MW alkaline electrolyser second unit for Mathura refinery expanded green hydrogen blending at 10% ratio with natural gas feed", capacityMW: 10, h2Type: "Green", prodTPD: 4.8, efficiency: 61, purityStd: "ISO 14687 Grade D", origin: "BHEL Hyderabad TG", plant: "Mathura Refinery H2 Unit-2", state: "Uttar Pradesh", mode: "Heavy Haul 80T Compressor Bank", prodDate: "2025-01-20", shipDate: "2025-04-05", transitDays: 2, contractValue: 230000000, electrolyserType: "Alkaline 10MW AWE", status: "Pipeline Connection Commissioning", remarks: "10MW alkaline AWE IOC Faridabad Mathura pipeline commission" },
  { id: "HPF-0010", batchNo: "NTP/DEL/2025/PEM-0108", operator: "NTPC Green Energy Delhi", zone: "Gujarat Jamnagar Kandla Green H2 Hub", category: "5MW Green Electrolyser PEM Stack", description: "5MW PEM electrolyser stack for Kandla green hydrogen hub dedicated steel industry supply with 450 bar tube trailer loading", capacityMW: 5, h2Type: "Green", prodTPD: 2.4, efficiency: 66, purityStd: "ISO 14687 Grade D", origin: "IOC R&D Faridabad HR", plant: "Kandla Steel H2 Supply", state: "Gujarat", mode: "Crane Truck 30T Storage Tank", prodDate: "2025-04-01", shipDate: "2025-06-20", transitDays: 3, contractValue: 120000000, electrolyserType: "PEM 5MW Stack", status: "Safety Valve Testing Active", remarks: "5MW PEM electrolyser NTPC Delhi Kandla steel supply testing" },
  { id: "HPF-0011", batchNo: "REL/JMN/2025/AWE-0115", operator: "Reliance Jamnagar Gujarat", zone: "Odisha Paradip Gopalpur Cluster", category: "20MW AES Wind-Solar Hybrid H2", description: "20MW alkaline electrolyser second phase for Paradip petrochemical green hydrogen supply with CCS-ready ammonia synthesis unit", capacityMW: 20, h2Type: "Green", prodTPD: 9.6, efficiency: 63, purityStd: "ISO 14687 Grade D", origin: "L&T Heavy Eng Hazira", plant: "Paradip AES H2 Plant", state: "Odisha", mode: "Multi-Axle 60T SMR Reformer", prodDate: "2024-12-20", shipDate: "2025-04-10", transitDays: 14, contractValue: 440000000, electrolyserType: "AWE 20MW Hybrid", status: "Feedstock Supply Active", remarks: "20MW AES electrolyser Reliance Jamnagar Paradip feedstock" },
  { id: "HPF-0012", batchNo: "ADI/KND/2025/SMR-0128", operator: "Adani Total Kandla Gujarat", zone: "Assam Numaligarh Refinery", category: "50MW SMR Blue Hydrogen Reforming", description: "50MW SMR blue hydrogen reformer for Numaligarh refinery with pre-combustion CCS for hydrocracking unit hydrogen supply upgrade", capacityMW: 50, h2Type: "Blue", prodTPD: 720, efficiency: 76, purityStd: "ISO 14687 Grade D", origin: "Thermax Pune MH", plant: "Numaligarh Refinery Blue H2", state: "Assam", mode: "Barge Coastal Desalination Unit", prodDate: "2025-03-25", shipDate: "2025-07-05", transitDays: 18, contractValue: 1650000000, electrolyserType: "SMR 50MW + CCS", status: "Electrolyser Stack Assembly", remarks: "50MW SMR blue H2 Adani Kandla Numaligarh stack assembly" },
  { id: "HPF-0013", batchNo: "LNH/HZR/2025/PEM-0132", operator: "L&T Heavy Engineering Hazira", zone: "Rajasthan Jodhpur Jaisalmer Solar H2", category: "5MW PEM Rail Varda Corridor", description: "5MW PEM electrolyser second unit for Jodhpur solar farm green hydrogen production with salt cavern storage buffer system", capacityMW: 5, h2Type: "Green", prodTPD: 2.4, efficiency: 68, purityStd: "ISO 14687 Grade D", origin: "L&T Hazira Works GJ", plant: "Jodhpur Solar PEM H2 Unit-2", state: "Rajasthan", mode: "Rail Wagon Tube Trailer H2", prodDate: "2025-02-05", shipDate: "2025-04-12", transitDays: 8, contractValue: 108000000, electrolyserType: "PEM 5MW Rail", status: "Green H2 Production Export", remarks: "5MW PEM rail electrolyser L&T Hazira Jodhpur green H2 export" },
  { id: "HPF-0014", batchNo: "BHE/HYD/2025/BMG-0146", operator: "BHEL Hyderabad Telangana", zone: "Tamil Nadu Chennai Cuddalore Port", category: "2MW Biomass Gasifier H2 Plant", description: "2MW biomass gasifier hydrogen plant for Cuddalore port bunker fuel green hydrogen supply with desalination unit integration", capacityMW: 2, h2Type: "Green", prodTPD: 0.96, efficiency: 46, purityStd: "ISO 14687 Grade D", origin: "BHEL Hyderabad Plant TG", plant: "Cuddalore Port Biomass H2", state: "Tamil Nadu", mode: "Barge Coastal Desalination Unit", prodDate: "2025-04-10", shipDate: "2025-06-20", transitDays: 4, contractValue: 62000000, electrolyserType: "Biomass Gasifier 2MW", status: "Feedstock Supply Active", remarks: "2MW biomass gasifier BHEL Hyderabad Cuddalore feedstock active" }
];

export default function HydrogenProductionFacilityLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalCapacityMW = records.reduce((s, r) => s + r.capacityMW, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => { const c = statusColor[r.status]; return c !== "green"; }).length;
  const exporting = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total Capacity (MW)", v: totalCapacityMW, s: "Across " + records.length + " H2 facility records" },
    { l: "Under Construction", v: underConstruction, s: "Assembly to feedstock supply" },
    { l: "Exporting H2", v: exporting, s: "Green H2 production export" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "h2Type", label: "H2 Type", options: ["Green", "Blue"].map(t => ({ value: t, count: records.filter(r => r.h2Type === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.plant.toLowerCase().includes(q) && !r.h2Type.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof H2Record] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Capacity (MW)", "H2 Type", "Prod TPD", "Efficiency (%)", "Purity Std", "Origin", "Plant", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Electrolyser", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="hpf-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly H2 Production by Technology (TPD)</h3><BarChart data={monthlyProd} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="pem" fill="#1e3a5f" radius={[4,4,0,0]} name="PEM" /><Bar dataKey="alkaline" fill="#2563eb" radius={[4,4,0,0]} name="Alkaline" /><Bar dataKey="smr" fill="#1e40af" radius={[4,4,0,0]} name="SMR Blue" /><Bar dataKey="biomass" fill="#3b82f6" radius={[4,4,0,0]} name="Biomass" /></BarChart></div>
        <div className="hpf-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Hydrogen Technology Distribution (%)</h3><PieChart width={400} height={220}><Pie data={techDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="hpf-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">H2 Production Cost (\u20b9/kg) Green vs Blue vs Grey</h3><LineChart data={costPerKg} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[50, 400]} /><Tooltip /><Legend /><Line type="monotone" dataKey="green" stroke="#1e3a5f" strokeWidth={2} name="Green \u20b9/kg" /><Line type="monotone" dataKey="blue" stroke="#2563eb" strokeWidth={2} strokeDasharray="5 5" name="Blue \u20b9/kg" /><Line type="monotone" dataKey="grey" stroke="#93c5fd" strokeWidth={2} strokeDasharray="2 2" name="Grey \u20b9/kg" /></LineChart></div>
        <div className="hpf-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">H2 Installed Electrolyser Capacity by State (MW)</h3><BarChart data={stateCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" /><YAxis /><Tooltip /><Legend /><Bar dataKey="mw" fill="#2563eb" radius={[4,4,0,0]} name="Installed MW" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="hpf-root p-6 space-y-6">
      <PageHeader title="Hydrogen Production Facility Logistics" description="Indian hydrogen production facility logistics covering green electrolyser PEM 5MW alkaline 10MW SMR blue hydrogen 50MW reforming, biomass gasifier H2 2MW, AES wind-solar hybrid 20MW, bio-methane reforming 100TPD with ISO 14687 purity, CCS carbon capture, tube trailer transport, salt cavern storage across Gujarat Odisha Rajasthan Tamil Nadu Karnataka Maharashtra UP Assam under National Green Hydrogen Mission" />
      <div className="hpf-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`hpf-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#1e3a5f] text-white" : "text-gray-600 hover:bg-blue-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Hydrogen Production" }]} />
      {tab === 0 && (
        <div className="hpf-dash space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <div key={i} className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">{k.l}</p><p className="text-2xl font-bold text-[#1e3a5f]">{typeof k.v === 'number' ? k.v.toLocaleString('en-IN') : k.v}</p><p className="text-xs text-gray-400">{k.s}</p></div>)}
          </div>
          {renderCharts()}
          <div className="grid grid-cols-2 gap-6">
            {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-4"><h4 className="text-sm font-semibold mb-2 text-[#1e3a5f]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="hpf-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="hpf-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{r.capacityMW}</td><td className="px-3 py-2">{r.h2Type}</td><td className="px-3 py-2 text-right">{r.prodTPD}</td><td className="px-3 py-2 text-right">{r.efficiency}%</td><td className="px-3 py-2">{r.purityStd}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.plant}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.electrolyserType}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="hpf-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="hpf-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#1e3a5f]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
