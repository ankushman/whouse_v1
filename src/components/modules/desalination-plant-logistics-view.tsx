"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#164e63", "#155e75", "#0e7490", "#0891b2", "#06b6d4", "#22d3ee", "#67e8f9", "#0284c7"];
const DEVELOPERS = ["VA Tech Wabag Chennai", "Nikkai Water Chennai", "IDE Technologies Israel Partner", "Doosan South Korea JV", "Veolia Water India Mumbai", "SUEZ NGE India Delhi", "Hitachi Plant India Partner", "Bhabha Atomic BARC Trombay"];
const CATEGORIES = ["100 MLD SWRO Reverse Osmosis Plant", "200 MLD Multi-Stage Flash MSF", "50 MLD MED-TVC Thermal Desal", "300 MLD Hybrid SWRO + MSF", "10 MLD Solar Desalination Pilot", "150 MLD Beach Well Intake SWRO", "500 MLD Mega SWRO Nuclear Powered", "25 MLD Containerized Desal Unit"];
const SHIPMENT_STATUSES = ["Membrane SWRO Spiral Wound Assembly", "High Pressure Pump Installation Active", "Intake Pipeline Subsea Laying", "Energy Recovery Device ERD Setup", "Product Water Quality Testing QC", "Grid Connected Distribution Active"];
const ZONES = ["Chennai Minjur Nemmeli", "Mumbai Bhandup Desal", "Gujarat Jamnagar Reliance", "Tamil Nadu Tuticorin", "Rajasthan Jodhpur Brackish", "Kerala Kochi Vypeen", "Karnataka Mangalore"];
const MODES = ["Heavy Haul Trailer 60T Pump", "Barge Marine 3000T SWRO Rack", "Flatbed 40T Membrane Skid", "Subsea Pipe Lay Vessel", "Crane Truck 25T Intake Screen", "Multi-Axle 80T ERD Unit"];
const TABS = ["Dashboard", "Plant Registry", "Desal Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = {
  "Membrane SWRO Spiral Wound Assembly": "slate",
  "High Pressure Pump Installation Active": "blue",
  "Intake Pipeline Subsea Laying": "amber",
  "Energy Recovery Device ERD Setup": "orange",
  "Product Water Quality Testing QC": "red",
  "Grid Connected Distribution Active": "green"
};

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyOutput = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], swro: ri(120, 450, 280 + Math.sin(i * 0.5) * 80), msf: ri(40, 200, 110 + Math.cos(i * 0.6) * 40), med: ri(20, 100, 55 + Math.sin(i * 0.7) * 25), solar: ri(2, 30, 12 + Math.cos(i * 0.8) * 8) }));
const techDist = [{ n: "SWRO", v: 40 }, { n: "MSF", v: 20 }, { n: "MED-TVC", v: 15 }, { n: "Hybrid", v: 10 }, { n: "Solar", v: 8 }, { n: "ED", v: 7 }];
const energyPerKL = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +ri(2.8, 6.5, 4.2 + Math.sin(i * 0.45) * 1.2).toFixed(1), target: 3.5 }));
const stateCapacity = [
  { n: "Tamil Nadu", v: 500 }, { n: "Maharashtra", v: 300 }, { n: "Gujarat", v: 350 }, { n: "Rajasthan", v: 120 }, { n: "Kerala", v: 150 }, { n: "Karnataka", v: 100 }, { n: "Delhi", v: 80 }
];

const INSIGHTS = [
  { t: "Jal Jeevan Mission: India\u2019s \u20b918,000 Crore Push for Desalination", c: "India\u2019s Jal Jeevan Mission (JJM) aims to provide functional household tap connections to every rural household by 2024, with a total outlay exceeding \u20b918,000 crore. Coastal states like Tamil Nadu, Gujarat, Maharashtra, and Kerala are increasingly integrating seawater desalination into their water supply strategies. The Ministry of Jal Shakti has identified desalination as a critical supplement to traditional freshwater sources for 13 coastal states and union territories. With India\u2019s 7,516 km coastline and growing water stress affecting 600 million citizens, large-scale SWRO plants (100-500 MLD) are being planned at Minjur, Nemmeli, Jamnagar, and Bhandup to augment municipal supply, backed by PPP models involving VA Tech Wabag, IDE Technologies, and Veolia Water." },
  { t: "Chennai Minjur 100 MLD SWRO: India\u2019s First Large-Scale Seawater Desalination Plant", c: "The Minjur Desalination Plant in Chennai, Tamil Nadu, commissioned in 2010 by VA Tech Wabag under a BOOT (Build-Own-Operate-Transfer) contract with CMWSSB (Chennai Metropolitan Water Supply and Sewerage Board), was India\u2019s first large-scale seawater reverse osmosis plant with 100 MLD capacity. The plant uses 8,000 spiral-wound polyamide SWRO membranes operating at 55-65 bar feed pressure, producing water with <300 mg/L TDS from Bay of Bengal seawater at 35,000 ppm TDS. Energy recovery devices (ERD) by Energy Recovery Inc. reduce specific energy consumption to 3.8 kWh/m\u00b3. The plant supplies water to Chennai\u2019s northern suburbs and serves as the blueprint for India\u2019s subsequent desalination investments including the 150 MLD Nemmeli plant." },
  { t: "BARC Kalpakkam Nuclear Desalination: Dual-Purpose SWRO + MSF Demonstration", c: "Bhabha Atomic Research Centre (BARC) at Kalpakkam, Tamil Nadu, operates India\u2019s only nuclear-powered desalination facility, demonstrating both SWRO (reverse osmosis at 1,800 m\u00b3/day) and MSF (multi-stage flash at 4,500 m\u00b3/day) technologies co-located with the Madras Atomic Power Station (MAPS). The MSF plant utilizes low-pressure steam from the nuclear reactor\u2019s secondary loop, achieving a gain output ratio (GOR) of 8-10, while the SWRO plant operates on grid power with energy recovery. This dual-technology approach validates nuclear-desalination coupling for India\u2019s planned 500 MLD mega SWRO nuclear-powered plants, leveraging NPCIL\u2019s existing reactor infrastructure at Kudankulam, Kalpakkam, and proposed coastal sites." },
  { t: "Solar Desalination in Rajasthan: Brackish Water Treatment for Arid Zones", c: "Rajasthan, India\u2019s most water-stressed state with 21 of 33 districts classified as over-exploited for groundwater, is deploying solar PV-powered desalination for brackish water treatment in Jodhpur, Barmer, and Jaisalmer districts. The Central Salt and Marine Chemicals Research Institute (CSMCRI) Bhavnagar has developed solar-powered electrodialysis (ED) and reverse osmosis systems for 10-25 MLD capacity plants treating brackish groundwater at 3,000-8,000 ppm TDS. These plants achieve 75-85% recovery rates with specific energy consumption of 0.8-1.5 kWh/m\u00b3 from solar PV, compared to 3-4 kWh/m\u00b3 for grid-powered SWRO. The Rajasthan government has allocated \u20b92,400 crore under its State Water Policy 2025 for solar-desalination hybrid installations targeting 500 MLD cumulative capacity by 2030." }
];

interface DesalRecord { id: string; batchNo: string; developer: string; zone: string; category: string; description: string; capacityMLD: number; technology: string; recoveryRate: number; tdsOutput: number; feedWater: string; origin: string; plant: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; energyKWh: number; status: string; remarks: string; }

const records: DesalRecord[] = [
  { id: "DSP-0001", batchNo: "WABAG/MINJ/2025/SW-0042", developer: "VA Tech Wabag Chennai", zone: "Chennai Minjur Nemmeli", category: "100 MLD SWRO Reverse Osmosis Plant", description: "SWRO spiral wound polyamide membrane bank 8000 elements for Minjur 100 MLD expansion phase-2", capacityMLD: 100, technology: "SWRO Reverse Osmosis", recoveryRate: 45, tdsOutput: 280, feedWater: "Seawater 35000 ppm", origin: "Hydranautics Oceanside CA USA", plant: "Minjur Desal Plant Chennai", state: "Tamil Nadu", mode: "Barge Marine 3000T SWRO Rack", prodDate: "2025-04-12", shipDate: "2025-06-20", transitDays: 35, contractValue: 850000000, energyKWh: 3.8, status: "Membrane SWRO Spiral Wound Assembly", remarks: "Hydranautics SWRO membranes Minjur phase-2 assembly in progress" },
  { id: "DSP-0002", batchNo: "NIKKAI/CHN/2025/MSF-0118", developer: "Nikkai Water Chennai", zone: "Chennai Minjur Nemmeli", category: "200 MLD Multi-Stage Flash MSF", description: "MSF flash chamber cross-tube brine heater 24-stage for Nemmeli 200 MLD thermal desal unit", capacityMLD: 200, technology: "MSF Multi-Stage Flash", recoveryRate: 33, tdsOutput: 120, feedWater: "Seawater 35000 ppm", origin: "Doosan Heavy Industries Changwon", plant: "Nemmeli Desal Plant Chennai", state: "Tamil Nadu", mode: "Heavy Haul Trailer 60T Pump", prodDate: "2025-03-18", shipDate: "2025-07-05", transitDays: 18, contractValue: 2200000000, energyKWh: 10.5, status: "High Pressure Pump Installation Active", remarks: "Doosan MSF 24-stage chamber Nemmeli HP pump installation" },
  { id: "DSP-0003", batchNo: "IDE/TUT/2025/MED-0027", developer: "IDE Technologies Israel Partner", zone: "Tamil Nadu Tuticorin", category: "50 MLD MED-TVC Thermal Desal", description: "MED-TVC vertical tube evaporator with thermal vapour compressor for Tuticorin 50 MLD plant", capacityMLD: 50, technology: "MED-TVC Multi-Effect", recoveryRate: 38, tdsOutput: 150, feedWater: "Seawater 35000 ppm", origin: "IDE Technologies Tel Aviv Israel", plant: "Tuticorin MED Plant TN", state: "Tamil Nadu", mode: "Flatbed 40T Membrane Skid", prodDate: "2025-02-10", shipDate: "2025-05-15", transitDays: 25, contractValue: 420000000, energyKWh: 8.2, status: "Intake Pipeline Subsea Laying", remarks: "IDE MED-TVC evaporator Tuticorin subsea intake pipeline laying" },
  { id: "DSP-0004", batchNo: "DOOSAN/JMN/2025/HY-0053", developer: "Doosan South Korea JV", zone: "Gujarat Jamnagar Reliance", category: "300 MLD Hybrid SWRO + MSF", description: "Hybrid SWRO+MSF dual-process rack with common intake for Jamnagar Reliance 300 MLD mega plant", capacityMLD: 300, technology: "Hybrid SWRO+MSF", recoveryRate: 42, tdsOutput: 200, feedWater: "Seawater 35000 ppm", origin: "Doosan Enpure Seoul South Korea", plant: "Jamnagar Reliance Desal Plant", state: "Gujarat", mode: "Barge Marine 3000T SWRO Rack", prodDate: "2025-01-20", shipDate: "2025-06-30", transitDays: 42, contractValue: 4500000000, energyKWh: 6.8, status: "Energy Recovery Device ERD Setup", remarks: "Doosan hybrid SWRO+MSF Jamnagar ERD setup active" },
  { id: "DSP-0005", batchNo: "VEOLIA/BND/2025/BW-0071", developer: "Veolia Water India Mumbai", zone: "Mumbai Bhandup Desal", category: "150 MLD Beach Well Intake SWRO", description: "Beach well intake filter gallery and SWRO pressure vessel battery for Bhandup 150 MLD Mumbai plant", capacityMLD: 150, technology: "SWRO Reverse Osmosis", recoveryRate: 48, tdsOutput: 250, feedWater: "Beach Well 30000 ppm", origin: "Veolia Water Technologies Paris France", plant: "Bhandup Desal Plant Mumbai", state: "Maharashtra", mode: "Crane Truck 25T Intake Screen", prodDate: "2024-10-15", shipDate: "2025-01-20", transitDays: 28, contractValue: 1800000000, energyKWh: 3.5, status: "Grid Connected Distribution Active", remarks: "Veolia beach well SWRO Bhandup Mumbai grid distribution active" },
  { id: "DSP-0006", batchNo: "SUEZ/DEL/2025/SW-0014", developer: "SUEZ NGE India Delhi", zone: "Gujarat Jamnagar Reliance", category: "100 MLD SWRO Reverse Osmosis Plant", description: "SWRO high-recovery membrane array with two-pass configuration for Jamnagar industrial 100 MLD", capacityMLD: 100, technology: "SWRO Reverse Osmosis", recoveryRate: 52, tdsOutput: 180, feedWater: "Seawater 35000 ppm", origin: "SUEZ Water Technologies Zurich", plant: "Jamnagar Industrial Desal", state: "Gujarat", mode: "Flatbed 40T Membrane Skid", prodDate: "2025-03-05", shipDate: "2025-06-10", transitDays: 20, contractValue: 920000000, energyKWh: 4.0, status: "High Pressure Pump Installation Active", remarks: "SUEZ two-pass SWRO Jamnagar industrial HP pump install" },
  { id: "DSP-0007", batchNo: "HITACHI/MNG/2025/CT-0033", developer: "Hitachi Plant India Partner", zone: "Karnataka Mangalore", category: "25 MLD Containerized Desal Unit", description: "Containerized SWRO desalination unit 25 MLD in modular 40ft containers for Mangalore coastal deployment", capacityMLD: 25, technology: "SWRO Reverse Osmosis", recoveryRate: 40, tdsOutput: 300, feedWater: "Estuarine 20000 ppm", origin: "Hitachi Mitsubishi Heavy Industries Tokyo", plant: "Mangalore Containerized Desal", state: "Karnataka", mode: "Heavy Haul Trailer 60T Pump", prodDate: "2025-02-22", shipDate: "2025-05-28", transitDays: 30, contractValue: 180000000, energyKWh: 4.5, status: "Membrane SWRO Spiral Wound Assembly", remarks: "Hitachi containerized 25 MLD SWRO Mangalore membrane assembly" },
  { id: "DSP-0008", batchNo: "BARC/KLP/2025/NP-0045", developer: "Bhabha Atomic BARC Trombay", zone: "Tamil Nadu Tuticorin", category: "500 MLD Mega SWRO Nuclear Powered", description: "500 MLD mega SWRO plant coupled with MAPS nuclear reactor low-pressure steam for Kalpakkam", capacityMLD: 500, technology: "SWRO Reverse Osmosis", recoveryRate: 50, tdsOutput: 100, feedWater: "Seawater 35000 ppm", origin: "NPCIL/BARC Kalpakkam Indigenous", plant: "Kalpakkam Nuclear Desal Plant", state: "Tamil Nadu", mode: "Multi-Axle 80T ERD Unit", prodDate: "2025-01-08", shipDate: "2025-04-15", transitDays: 5, contractValue: 6000000000, energyKWh: 2.8, status: "Grid Connected Distribution Active", remarks: "BARC 500 MLD nuclear SWRO Kalpakkam grid connected active" },
  { id: "DSP-0009", batchNo: "WABAG/KCH/2025/BW-0059", developer: "VA Tech Wabag Chennai", zone: "Kerala Kochi Vypeen", category: "150 MLD Beach Well Intake SWRO", description: "Beach well intake radial collector wells with SWRO system for Kochi Vypeen 150 MLD plant", capacityMLD: 150, technology: "SWRO Reverse Osmosis", recoveryRate: 46, tdsOutput: 220, feedWater: "Beach Well 30000 ppm", origin: "Wabag Technologies Vienna Austria", plant: "Kochi Vypeen Desal Plant", state: "Kerala", mode: "Subsea Pipe Lay Vessel", prodDate: "2025-04-25", shipDate: "2025-07-20", transitDays: 22, contractValue: 1650000000, energyKWh: 3.6, status: "Intake Pipeline Subsea Laying", remarks: "Wabag beach well Kochi Vypeen subsea collector pipe laying" },
  { id: "DSP-0010", batchNo: "NIKKAI/BND/2025/SL-0088", developer: "Nikkai Water Chennai", zone: "Rajasthan Jodhpur Brackish", category: "10 MLD Solar Desalination Pilot", description: "Solar PV powered ED electrodialysis pilot plant 10 MLD for Jodhpur brackish water treatment", capacityMLD: 10, technology: "Solar PV Desalination", recoveryRate: 75, tdsOutput: 450, feedWater: "Brackish 5000 ppm", origin: "CSMCRI Bhavnagar Gujarat", plant: "Jodhpur Solar Desal Pilot", state: "Rajasthan", mode: "Flatbed 40T Membrane Skid", prodDate: "2025-03-18", shipDate: "2025-05-10", transitDays: 12, contractValue: 80000000, energyKWh: 1.2, status: "Product Water Quality Testing QC", remarks: "Nikkai solar ED Jodhpur pilot QC testing in progress" },
  { id: "DSP-0011", batchNo: "IDE/MUM/2025/SW-0066", developer: "IDE Technologies Israel Partner", zone: "Mumbai Bhandup Desal", category: "200 MLD Multi-Stage Flash MSF", description: "MSF brine recirculation pump set and flash evaporator modules for Bhandup 200 MLD MSF expansion", capacityMLD: 200, technology: "MSF Multi-Stage Flash", recoveryRate: 30, tdsOutput: 140, feedWater: "Seawater 35000 ppm", origin: "IDE Technologies Haifa Israel", plant: "Bhandup MSF Expansion Mumbai", state: "Maharashtra", mode: "Heavy Haul Trailer 60T Pump", prodDate: "2024-11-20", shipDate: "2025-03-15", transitDays: 16, contractValue: 2800000000, energyKWh: 11.0, status: "High Pressure Pump Installation Active", remarks: "IDE MSF brine recirculation Bhandup HP pump installation" },
  { id: "DSP-0012", batchNo: "DOOSAN/KCH/2025/HY-0072", developer: "Doosan South Korea JV", zone: "Kerala Kochi Vypeen", category: "300 MLD Hybrid SWRO + MSF", description: "Hybrid SWRO+MSF plant module with ERD and MSF brine heater for Kochi Vypeen 300 MLD mega", capacityMLD: 300, technology: "Hybrid SWRO+MSF", recoveryRate: 44, tdsOutput: 190, feedWater: "Seawater 35000 ppm", origin: "Doosan Heavy Changwon Korea", plant: "Kochi Vypeen Mega Desal", state: "Kerala", mode: "Barge Marine 3000T SWRO Rack", prodDate: "2025-05-01", shipDate: "", transitDays: 0, contractValue: 5200000000, energyKWh: 6.2, status: "Membrane SWRO Spiral Wound Assembly", remarks: "Doosan hybrid Kochi Vypeen 300 MLD membrane assembly QC" },
  { id: "DSP-0013", batchNo: "VEOLIA/JDR/2025/SW-0048", developer: "Veolia Water India Mumbai", zone: "Rajasthan Jodhpur Brackish", category: "25 MLD Containerized Desal Unit", description: "Containerized ED electrodialysis stack 25 MLD with solar hybrid power for Jodhpur brackish zone", capacityMLD: 25, technology: "ED Electrodialysis", recoveryRate: 80, tdsOutput: 500, feedWater: "Brackish 5000 ppm", origin: "Veolia STI Degrémont Bangalore", plant: "Jodhpur ED Containerized Unit", state: "Rajasthan", mode: "Heavy Haul Trailer 60T Pump", prodDate: "2025-02-28", shipDate: "2025-05-20", transitDays: 10, contractValue: 95000000, energyKWh: 1.5, status: "Product Water Quality Testing QC", remarks: "Veolia ED containerized Jodhpur water quality QC testing" },
  { id: "DSP-0014", batchNo: "SUEZ/TUT/2025/MED-0019", developer: "SUEZ NGE India Delhi", zone: "Tamil Nadu Tuticorin", category: "50 MLD MED-TVC Thermal Desal", description: "MED-TVC thermal vapour compressor and falling film evaporator for Tuticorin 50 MLD expansion", capacityMLD: 50, technology: "MED-TVC Multi-Effect", recoveryRate: 35, tdsOutput: 160, feedWater: "Estuarine 20000 ppm", origin: "SUEZ IDE Technologies JV", plant: "Tuticorin MED Expansion TN", state: "Tamil Nadu", mode: "Crane Truck 25T Intake Screen", prodDate: "2025-04-08", shipDate: "", transitDays: 0, contractValue: 380000000, energyKWh: 7.8, status: "Energy Recovery Device ERD Setup", remarks: "SUEZ MED-TVC Tuticorin ERD setup and commissioning" }
];

export default function DesalinationPlantLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalCapacity = records.reduce((s, r) => s + r.capacityMLD, 0);
  const underConstruction = records.filter(r => statusColor[r.status] !== "green").length;
  const operational = records.filter(r => statusColor[r.status] === "green").length;
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

  const kpis = [
    { l: "Total Capacity (MLD)", v: totalCapacity.toLocaleString(), s: "Across " + ZONES.length + " zones" },
    { l: "Under Construction", v: underConstruction, s: "Non-operational plants" },
    { l: "Operational", v: operational, s: "Grid connected active" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate value" }
  ];

  const filterGroups = [
    { key: "developer", label: "Developer", options: DEVELOPERS.map(d => ({ value: d, count: records.filter(r => r.developer === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "technology", label: "Technology", options: ["SWRO Reverse Osmosis", "MSF Multi-Stage Flash", "MED-TVC Multi-Effect", "Hybrid SWRO+MSF", "Solar PV Desalination", "ED Electrodialysis"].map(t => ({ value: t, count: records.filter(r => r.technology === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.developer.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.plant.toLowerCase().includes(q) && !r.technology.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof DesalRecord] as string));
  });

  const COLS = ["ID","Batch No","Developer","Zone","Category","Description","Capacity (MLD)","Technology","Recovery (%)","TDS Out (mg/L)","Feed Water","Origin","Plant","State","Mode","Prod Date","Ship Date","Transit (d)","Contract (\u20b9)","Energy (kWh/m3)","Status","Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="dsp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Desal Output (MLD)</h3><AreaChart data={monthlyOutput} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="swro" stackId="1" stroke="#164e63" fill="#164e63" name="SWRO" /><Area type="monotone" dataKey="msf" stackId="1" stroke="#0891b2" fill="#0891b2" name="MSF" /><Area type="monotone" dataKey="med" stackId="1" stroke="#06b6d4" fill="#06b6d4" name="MED" /><Area type="monotone" dataKey="solar" stackId="1" stroke="#67e8f9" fill="#67e8f9" name="Solar" /></AreaChart></div>
        <div className="dsp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Desalination Technology Distribution (%)</h3><PieChart width={400} height={220}><Pie data={techDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="dsp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Energy Consumption (kWh/kL) vs 3.5 Target</h3><LineChart data={energyPerKL} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[2, 7]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#164e63" strokeWidth={2} name="Actual kWh/kL" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target 3.5" /></LineChart></div>
        <div className="dsp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">State-Wise Desalination Capacity (MLD)</h3><BarChart data={stateCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0e7490" radius={[4,4,0,0]} name="Capacity MLD" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="dsp-root p-6 space-y-6">
      <PageHeader title="Desalination Plant Logistics" description="Indian desalination plant logistics for SWRO reverse osmosis MSF multi-stage flash MED-TVC thermal desalination hybrid nuclear powered solar PV electrodialysis covering Minjur Nemmeli Chennai Bhandup Mumbai Jamnagar Gujarat Tuticorin Jodhpur Rajasthan Kochi Mangalore with VA Tech Wabag IDE Technologies Doosan Veolia SUEZ BARC developers" />
      <div className="dsp-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`dsp-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#164e63] text-white" : "text-gray-600 hover:bg-cyan-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="dsp-dashboard space-y-6">
          <div className="dsp-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="dsp-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 dsp-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#164e63] dsp-kpi-val">{k.v}</div><div className="text-xs text-gray-400 dsp-kpi-sub">{k.s}</div></div>))}
          </div>
          {renderCharts()}
        </div>
      )}

      {tab === 1 && (
        <div className="dsp-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Desalination", href: "#" }, { label: "Plant Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="dsp-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{COLS.map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "";
              const rowCls = sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-orange-500" : "";
              return (<tr key={r.id} className={`border-b hover:bg-cyan-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="dsp-badge inline-block px-2 py-0.5 rounded text-xs bg-[#164e63] text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.developer}</td>
                <td className="px-3 py-2"><span className="dsp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="dsp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.capacityMLD}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.technology}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.recoveryRate}%</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.tdsOutput}</td>
                <td className="px-3 py-2"><span className="dsp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.feedWater}</span></td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.plant}</td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate || "\u2014"}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 30 ? "text-red-600" : r.transitDays >= 10 ? "text-amber-600" : r.transitDays > 0 ? "text-green-600" : "text-gray-400"}`}>{r.transitDays > 0 ? r.transitDays + "d" : "\u2014"}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#164e63]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.energyKWh}</td>
                <td className="px-3 py-2"><span className={`dsp-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[sc]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="dsp-analytics space-y-6">
          {renderCharts()}
        </div>
      )}

      {tab === 3 && (
        <div className="dsp-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="dsp-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#164e63] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
