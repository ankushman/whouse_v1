"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#78350f", "#92400e", "#a16207", "#ca8a04", "#eab308", "#facc15", "#fde047", "#fbbf24"];
const OPERATORS = ["Exicom Tele Systems Gurgaon", "HBL Power Systems Hyderabad", "Amararaja Batteries Tirupati", "Exide Industries Kolkata", "Tata AutoComp Pune", "ICL Energy Systems Delhi", "Lumisol Energy Chennai", "Green cellularenergy Delhi"];
const CATEGORIES = ["100Wh Module Telecom Backup", "500kWh Bank Grid Frequency", "2MWh Industrial Peak Shaving", "50kWh EV Fast Charge Buffer", "10kWh Solar Microgrid Buffer", "5MW Rail Traction Regen", "200kWh Data Center UPS", "1MWh Substation Load Leveling"];
const SHIPMENT_STATUSES = ["Cell Stacking Assembly Active", "Module Testing Characterization", "BMS Integration Calibration", "Thermal Management Install", "Grid Connection Commissioning", "Energy Storage Export Active"];
const ZONES = ["Delhi NCR Telecom Hub Gurgaon", "Hyderabad Pharma Hitech City", "Tirupati Amararaja Industrial", "Kolkata Exide Battery Park", "Pune Tata AutoComp Chakan", "Chennai Solar Microgrid Hub", "Bangalore Data Center Corridor", "Mumbai Substation Grid City"];
const MODES = ["Flatbed Trailer 20T Module Pack", "Heavy Haul 40T Rack System", "Crane Truck 15T BMS Cabinet", "Rail Wagon Cell Bank", "Express Courier Cell Module", "Multi-Axle 50T Container Rack"];
const TABS = ["Dashboard", "Storage Registry", "Analytics", "Insights"];

const statusColor: Record<string, string> = { "Cell Stacking Assembly Active": "orange", "Module Testing Characterization": "orange", "BMS Integration Calibration": "blue", "Thermal Management Install": "blue", "Grid Connection Commissioning": "blue", "Energy Storage Export Active": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyMWh = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], telecom: +(8 + Math.sin(i * 0.5) * 3).toFixed(1), grid: +(45 + Math.cos(i * 0.6) * 12).toFixed(1), industrial: +(30 + Math.sin(i * 0.4) * 8).toFixed(1), ev: +(12 + Math.cos(i * 0.7) * 5).toFixed(1) }));
const segmentDist = [{ n: "Telecom Backup", v: 25 }, { n: "Grid Frequency", v: 30 }, { n: "Industrial Peak", v: 20 }, { n: "EV Charging", v: 12 }, { n: "Data Center UPS", v: 8 }, { n: "Rail Regen", v: 5 }];
const cycleLife = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], edlc: +(500000 + Math.sin(i * 0.5) * 50000).toFixed(0), hybrid: +(150000 + Math.cos(i * 0.6) * 20000).toFixed(0), pseudocap: +(100000 + Math.sin(i * 0.4) * 15000).toFixed(0) }));
const stateCapacity = [
  { state: "DL", mwh: 120 },
  { state: "TG", mwh: 95 },
  { state: "AP", mwh: 80 },
  { state: "WB", mwh: 65 },
  { state: "MH", mwh: 55 },
  { state: "TN", mwh: 48 },
  { state: "KA", mwh: 42 },
  { state: "GJ", mwh: 35 }
];

const INSIGHTS = [
  { t: "India\u2019s Supercapacitor Market: \u20b93,200 Crore by 2027 with 28% CAGR", c: "India\u2019s supercapacitor energy storage market is projected to reach \u20b93,200 crore by 2027, growing at a compound annual growth rate of 28% from \u20b9850 crore in 2023. The market is driven by telecom tower power backup modernization (400,000+ towers transitioning from diesel to solar-supercapacitor hybrid), EV fast-charging infrastructure (3,000+ public charging stations requiring power buffers), grid frequency regulation (India Grid Code mandates 0.5% frequency response within 200 milliseconds), and data center UPS systems (350+ hyperscale data centers). The Ministry of Heavy Industries Production Linked Incentive (PLI) scheme ACC battery and supercapacitor manufacturing provides 18% capital subsidy for domestic cell production. Key Indian manufacturers Exicom, HBL Power, Amararaja Batteries, and Exide Industries are investing \u20b91,200 crore combined in supercapacitor module assembly facilities." },
  { t: "EDLC vs Hybrid Supercapacitors: Technology Selection for Indian Applications", c: "Electric Double Layer Capacitors (EDLCs) offer the highest power density at 10-15 Wh/kg with cycle life exceeding 500,000 charge-discharge cycles, making them ideal for telecom tower backup (100-500Wh modules) and rail traction regenerative braking (100kWh-5MWh banks). Hybrid supercapacitors combining battery electrode with capacitor electrode achieve 30-60 Wh/kg at 50,000-150,000 cycles, suited for solar microgrid smoothing (10-50kWh) and EV fast-charging buffers (50-500kWh). Pseudocapacitors using conducting polymer or metal oxide electrodes provide 80-120 Wh/kg but limited to 20,000-50,000 cycles, applicable for data center UPS (200kWh-2MWh). Indian Railways has deployed 200+ supercapacitor-based regenerative braking energy recovery systems at suburban stations in Mumbai, Delhi, and Chennai, recovering 15-20% of braking energy worth \u20b940 crore annually." },
  { t: "Supercapacitor Module Manufacturing: Cell Stacking and BMS Integration", c: "Supercapacitor module manufacturing in India involves precision cell stacking of 3000F or 5000F cylindrical or pouch cells into series-parallel configurations achieving operating voltages of 48V to 800V. Key manufacturing steps include cell sorting (capacitance matching within 2% tolerance), electrode stacking with precision alignment, laser welding of cell terminals, busbar assembly, and thermal interface material application. Battery Management Systems (BMS) for supercapacitor modules provide cell voltage balancing (\u00b15mV accuracy), overcurrent protection (2x rated current threshold), temperature monitoring (NTC thermistor arrays with 1\u00b0C resolution), and SOC estimation using Kalman filtering. Exicom\u2019s Gurgaon facility produces 500,000 modules per annum, while HBL Power Hyderabad manufactures 200,000 modules with integrated fire suppression systems. The average module assembly time is 45 minutes with automated laser welding reducing manual solder joints by 80%." },
  { t: "Thermal Management and Lifecycle: Supercapacitor Performance in Indian Climate", c: "India\u2019s extreme climate conditions (ambient temperatures 5-48\u00b0C, humidity 30-95%) pose significant challenges for supercapacitor performance and longevity. Elevated temperatures above 45\u00b0C accelerate electrolyte degradation, reducing EDLC cycle life from 500,000 to 150,000 cycles if unmanaged. Active liquid cooling systems using glycol-water mixtures maintain cell temperatures within 25-40\u00b0C operating range, while passive phase-change material (PCM) heat sinks using paraffin wax provide maintenance-free cooling for telecom tower modules. Thermal management adds 15-25% to module cost but doubles effective service life from 8-10 years to 15-20 years. Indian Institute of Science (IISc) Bangalore has developed graphene-enhanced supercapacitor electrodes achieving 25% higher capacitance at 60\u00b0C compared to commercial activated carbon electrodes. IoT-enabled remote monitoring systems track module health, predict degradation, and schedule preventive maintenance for distributed installations across India\u2019s telecom and grid infrastructure." }
];

interface SCRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; capacityWh: number; voltageV: number; cycleLife: number; powerDensity: number; technology: string; origin: string; plant: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; cellType: string; status: string; remarks: string; }

const records: SCRecord[] = [
  { id: "SCE-0001", batchNo: "EXC/GGN/2025/TC-0012", operator: "Exicom Tele Systems Gurgaon", zone: "Delhi NCR Telecom Hub Gurgaon", category: "100Wh Module Telecom Backup", description: "100Wh EDLC telecom tower backup module with 48V 100Ah supercapacitor pack and solar charge controller for 20000+ tower installations in UP Rajasthan", capacityWh: 100, voltageV: 48, cycleLife: 500000, powerDensity: 12, technology: "EDLC", origin: "Exicom Plant Gurgaon HR", plant: "Gurgaon Telecom Module Factory", state: "Haryana", mode: "Flatbed Trailer 20T Module Pack", prodDate: "2025-01-10", shipDate: "2025-03-18", transitDays: 3, contractValue: 45000000, cellType: "3000F Cylindrical EDLC", status: "Energy Storage Export Active", remarks: "100Wh telecom EDLC Exicom Gurgaon tower export" },
  { id: "SCE-0002", batchNo: "HBL/HYD/2025/GF-0025", operator: "HBL Power Systems Hyderabad", zone: "Hyderabad Pharma Hitech City", category: "500kWh Bank Grid Frequency", description: "500kWh hybrid supercapacitor bank for TS-TRANSCO grid frequency regulation with 800V power conversion system at 132kV substation", capacityWh: 500000, voltageV: 800, cycleLife: 150000, powerDensity: 8, technology: "Hybrid", origin: "HBL Power Hyderabad TG", plant: "Hyderabad Grid Storage Plant", state: "Telangana", mode: "Heavy Haul 40T Rack System", prodDate: "2025-02-15", shipDate: "2025-05-22", transitDays: 2, contractValue: 280000000, cellType: "5000F Pouch Hybrid", status: "Grid Connection Commissioning", remarks: "500kWh grid hybrid HBL Hyderabad frequency regulation" },
  { id: "SCE-0003", batchNo: "AMR/TPT/2025/IP-0038", operator: "Amararaja Batteries Tirupati", zone: "Tirupati Amararaja Industrial", category: "2MWh Industrial Peak Shaving", description: "2MWh supercapacitor bank for Tirupati industrial cluster peak shaving with active liquid cooling system reducing factory demand charges by 25%", capacityWh: 2000000, voltageV: 750, cycleLife: 100000, powerDensity: 6, technology: "Hybrid", origin: "Amararaja Works Tirupati AP", plant: "Tirupati Industrial Storage Plant", state: "Andhra Pradesh", mode: "Multi-Axle 50T Container Rack", prodDate: "2024-11-05", shipDate: "2025-03-20", transitDays: 1, contractValue: 680000000, cellType: "5000F Pouch Hybrid", status: "Thermal Management Install", remarks: "2MWh industrial hybrid Amararaja Tirupati cooling install" },
  { id: "SCE-0004", batchNo: "EXI/KOL/2025/EV-0042", operator: "Exide Industries Kolkata", zone: "Kolkata Exide Battery Park", category: "50kWh EV Fast Charge Buffer", description: "50kWh supercapacitor buffer for 150kW DC fast charging station with power smoothing and grid demand limitation at Kolkata EV charging hub", capacityWh: 50000, voltageV: 400, cycleLife: 200000, powerDensity: 15, technology: "EDLC", origin: "Exide Plant Kolkata WB", plant: "Kolkata EV Charge Buffer Plant", state: "West Bengal", mode: "Crane Truck 15T BMS Cabinet", prodDate: "2025-03-01", shipDate: "2025-06-15", transitDays: 4, contractValue: 85000000, cellType: "3000F Cylindrical EDLC", status: "BMS Integration Calibration", remarks: "50kWh EV charge EDLC Exide Kolkata BMS calibration" },
  { id: "SCE-0005", batchNo: "TAC/PUN/2025/SM-0055", operator: "Tata AutoComp Pune", zone: "Pune Tata AutoComp Chakan", category: "10kWh Solar Microgrid Buffer", description: "10kWh supercapacitor module for Chakan industrial area solar microgrid with MPPT integration and 48V bus for 50kW rooftop solar smoothing", capacityWh: 10000, voltageV: 48, cycleLife: 300000, powerDensity: 10, technology: "EDLC", origin: "Tata AutoComp Chakan MH", plant: "Pune Solar Microgrid Module", state: "Maharashtra", mode: "Flatbed Trailer 20T Module Pack", prodDate: "2025-02-20", shipDate: "2025-05-10", transitDays: 2, contractValue: 22000000, cellType: "3000F Cylindrical EDLC", status: "Energy Storage Export Active", remarks: "10kWh solar microgrid EDLC Tata Pune export active" },
  { id: "SCE-0006", batchNo: "ICL/DEL/2025/TR-0068", operator: "ICL Energy Systems Delhi", zone: "Chennai Solar Microgrid Hub", category: "5MW Rail Traction Regen", description: "5MW supercapacitor regenerative braking energy bank for Chennai MRTS suburban stations recovering 18% braking energy from EMU services", capacityWh: 5000000, voltageV: 750, cycleLife: 500000, powerDensity: 20, technology: "EDLC", origin: "ICL Energy Delhi HR", plant: "Chennai MRTS Regen Plant", state: "Tamil Nadu", mode: "Rail Wagon Cell Bank", prodDate: "2025-04-15", shipDate: "2025-07-25", transitDays: 6, contractValue: 1200000000, cellType: "5000F Cylindrical EDLC", status: "Cell Stacking Assembly Active", remarks: "5MW rail regen EDLC ICL Chennai cell stacking" },
  { id: "SCE-0007", batchNo: "LUM/CHN/2025/DC-0071", operator: "Lumisol Energy Chennai", zone: "Bangalore Data Center Corridor", category: "200kWh Data Center UPS", description: "200kWh supercapacitor UPS for Bangalore hyperscale data center with 15-second ride-through and seamless diesel generator handover for 10MW IT load", capacityWh: 200000, voltageV: 480, cycleLife: 200000, powerDensity: 18, technology: "Pseudocapacitor", origin: "Lumisol Chennai TN", plant: "Bangalore DC UPS Plant", state: "Karnataka", mode: "Heavy Haul 40T Rack System", prodDate: "2025-03-15", shipDate: "2025-05-28", transitDays: 3, contractValue: 180000000, cellType: "Graphene Pouch Pseudo", status: "Module Testing Characterization", remarks: "200kWh DC UPS pseudo Lumisol Bangalore testing" },
  { id: "SCE-0008", batchNo: "GCE/DEL/2025/SL-0084", operator: "Green cellularenergy Delhi", zone: "Mumbai Substation Grid City", category: "1MWh Substation Load Leveling", description: "1MWh hybrid supercapacitor bank for Tata Power Mumbai 33kV substation load leveling with 200ms response time and 1000 daily cycles at 80% DoD", capacityWh: 1000000, voltageV: 600, cycleLife: 150000, powerDensity: 12, technology: "Hybrid", origin: "Green cellularenergy Delhi HR", plant: "Mumbai Substation Storage Plant", state: "Maharashtra", mode: "Multi-Axle 50T Container Rack", prodDate: "2024-09-10", shipDate: "2025-02-15", transitDays: 5, contractValue: 420000000, cellType: "5000F Pouch Hybrid", status: "Thermal Management Install", remarks: "1MWh substation hybrid Green cellularenergy Mumbai thermal" },
  { id: "SCE-0009", batchNo: "EXC/GGN/2025/TC-0097", operator: "Exicom Tele Systems Gurgaon", zone: "Delhi NCR Telecom Hub Gurgaon", category: "100Wh Module Telecom Backup", description: "100Wh EDLC module batch-2 for Rajasthan Jio telecom towers with integrated solar MPPT controller and Li-ion hybrid backup for 5G sites", capacityWh: 100, voltageV: 48, cycleLife: 500000, powerDensity: 12, technology: "EDLC", origin: "Exicom Plant Gurgaon HR", plant: "Gurgaon 5G Tower Module Plant", state: "Haryana", mode: "Express Courier Cell Module", prodDate: "2025-01-20", shipDate: "2025-04-05", transitDays: 2, contractValue: 38000000, cellType: "3000F Cylindrical EDLC", status: "Energy Storage Export Active", remarks: "100Wh 5G tower EDLC Exicom Gurgaon export" },
  { id: "SCE-0010", batchNo: "HBL/HYD/2025/GF-0108", operator: "HBL Power Systems Hyderabad", zone: "Hyderabad Pharma Hitech City", category: "500kWh Bank Grid Frequency", description: "500kWh supercapacitor frequency regulation bank for AP-TRANSCO 220kV substation with V2G bidirectional inverter and remote SCADA monitoring", capacityWh: 500000, voltageV: 800, cycleLife: 150000, powerDensity: 8, technology: "Hybrid", origin: "HBL Power Hyderabad TG", plant: "Vizag Grid Storage Plant", state: "Andhra Pradesh", mode: "Rail Wagon Cell Bank", prodDate: "2025-04-01", shipDate: "2025-06-20", transitDays: 3, contractValue: 260000000, cellType: "5000F Pouch Hybrid", status: "BMS Integration Calibration", remarks: "500kWh grid hybrid HBL Vizag BMS calibration" },
  { id: "SCE-0011", batchNo: "AMR/TPT/2025/IP-0115", operator: "Amararaja Batteries Tirupati", zone: "Tirupati Amararaja Industrial", category: "2MWh Industrial Peak Shaving", description: "2MWh peak shaving unit-2 for Vishakhapatnam steel plant rolling mill with peak demand reduction of 8MW and payback period 4.5 years", capacityWh: 2000000, voltageV: 750, cycleLife: 100000, powerDensity: 6, technology: "Hybrid", origin: "Amararaja Works Tirupati AP", plant: "Vizag Steel Storage Plant", state: "Andhra Pradesh", mode: "Multi-Axle 50T Container Rack", prodDate: "2024-12-20", shipDate: "2025-04-10", transitDays: 2, contractValue: 720000000, cellType: "5000F Pouch Hybrid", status: "Grid Connection Commissioning", remarks: "2MWh peak shaving Amararaja Vizag steel grid connect" },
  { id: "SCE-0012", batchNo: "EXI/KOL/2025/EV-0128", operator: "Exide Industries Kolkata", zone: "Kolkata Exide Battery Park", category: "50kWh EV Fast Charge Buffer", description: "50kWh buffer for 350kW ultra-fast charging station at Delhi NCR with CCS-2 and CHAdeMO compatibility and 200kW peak shaving capability", capacityWh: 50000, voltageV: 400, cycleLife: 200000, powerDensity: 15, technology: "EDLC", origin: "Exide Plant Kolkata WB", plant: "Delhi Ultra-Fast Charge Plant", state: "Delhi", mode: "Crane Truck 15T BMS Cabinet", prodDate: "2025-03-25", shipDate: "2025-07-05", transitDays: 5, contractValue: 95000000, cellType: "3000F Cylindrical EDLC", status: "Module Testing Characterization", remarks: "50kWh ultra-fast EDLC Exide Delhi testing" },
  { id: "SCE-0013", batchNo: "TAC/PUN/2025/SM-0132", operator: "Tata AutoComp Pune", zone: "Pune Tata AutoComp Chakan", category: "10kWh Solar Microgrid Buffer", description: "10kWh buffer unit-2 for Ladakh solar microgrid with high-altitude -20C cold start capability and IP65 rated enclosure for extreme conditions", capacityWh: 10000, voltageV: 48, cycleLife: 300000, powerDensity: 10, technology: "EDLC", origin: "Tata AutoComp Chakan MH", plant: "Ladakh Solar Microgrid Plant", state: "Maharashtra", mode: "Flatbed Trailer 20T Module Pack", prodDate: "2025-02-05", shipDate: "2025-04-12", transitDays: 12, contractValue: 28000000, cellType: "3000F Cylindrical EDLC", status: "Thermal Management Install", remarks: "10kWh Ladakh solar EDLC Tata Pune thermal install" },
  { id: "SCE-0014", batchNo: "ICL/DEL/2025/TR-0146", operator: "ICL Energy Systems Delhi", zone: "Chennai Solar Microgrid Hub", category: "5MW Rail Traction Regen", description: "5MW regen braking bank unit-2 for Delhi Metro Phase-IV stations with 98% energy recovery efficiency and 15-year design life at 1000 cycles/day", capacityWh: 5000000, voltageV: 750, cycleLife: 500000, powerDensity: 20, technology: "EDLC", origin: "ICL Energy Delhi HR", plant: "Delhi Metro Regen Plant", state: "Delhi", mode: "Rail Wagon Cell Bank", prodDate: "2025-04-10", shipDate: "2025-06-20", transitDays: 1, contractValue: 1150000000, cellType: "5000F Cylindrical EDLC", status: "Cell Stacking Assembly Active", remarks: "5MW Metro regen EDLC ICL Delhi cell stacking" }
];

export default function SupercapacitorEnergyStorageLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalWh = records.reduce((s, r) => s + r.capacityWh, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => { const c = statusColor[r.status]; return c !== "green"; }).length;
  const exporting = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total Capacity (MWh)", v: (totalWh / 1000000).toFixed(1), s: "Across " + records.length + " storage records" },
    { l: "Under Construction", v: underConstruction, s: "Assembly to commissioning" },
    { l: "Exporting Energy", v: exporting, s: "Grid export active" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "technology", label: "Technology", options: ["EDLC", "Hybrid", "Pseudocapacitor"].map(t => ({ value: t, count: records.filter(r => r.technology === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.plant.toLowerCase().includes(q) && !r.technology.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof SCRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Capacity (Wh)", "Voltage (V)", "Cycle Life", "Power (W/kg)", "Technology", "Origin", "Plant", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Cell Type", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="sce-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Energy Output by Segment (MWh)</h3><BarChart data={monthlyMWh} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="telecom" fill="#78350f" radius={[4,4,0,0]} name="Telecom" /><Bar dataKey="grid" fill="#a16207" radius={[4,4,0,0]} name="Grid" /><Bar dataKey="industrial" fill="#ca8a04" radius={[4,4,0,0]} name="Industrial" /><Bar dataKey="ev" fill="#eab308" radius={[4,4,0,0]} name="EV Charge" /></BarChart></div>
        <div className="sce-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Market Segment Distribution (%)</h3><PieChart width={400} height={220}><Pie data={segmentDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{segmentDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="sce-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cycle Life by Technology (cycles)</h3><LineChart data={cycleLife} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[50000, 600000]} /><Tooltip /><Legend /><Line type="monotone" dataKey="edlc" stroke="#78350f" strokeWidth={2} name="EDLC" /><Line type="monotone" dataKey="hybrid" stroke="#a16207" strokeWidth={2} strokeDasharray="5 5" name="Hybrid" /><Line type="monotone" dataKey="pseudocap" stroke="#ca8a04" strokeWidth={2} strokeDasharray="2 2" name="Pseudocap" /></LineChart></div>
        <div className="sce-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Installed Storage Capacity by State (MWh)</h3><BarChart data={stateCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" /><YAxis /><Tooltip /><Legend /><Bar dataKey="mwh" fill="#a16207" radius={[4,4,0,0]} name="Installed MWh" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="sce-root p-6 space-y-6">
      <PageHeader title="Supercapacitor Energy Storage Logistics" description="Indian supercapacitor energy storage logistics covering EDLC 100Wh telecom backup 500kWh grid frequency 2MWh industrial peak shaving 50kWh EV fast charge 10kWh solar microgrid 5MW rail traction regen 200kWh data center UPS 1MWh substation load leveling with BMS thermal management cycle life cell stacking across Delhi Hyderabad Tirupati Kolkata Pune Chennai Bangalore Mumbai under PLI scheme" />
      <div className="sce-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`sce-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#78350f] text-white" : "text-gray-600 hover:bg-amber-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Supercapacitor Storage" }]} />
      {tab === 0 && (
        <div className="sce-dash space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <div key={i} className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">{k.l}</p><p className="text-2xl font-bold text-[#78350f]">{typeof k.v === 'number' ? k.v.toLocaleString('en-IN') : k.v}</p><p className="text-xs text-gray-400">{k.s}</p></div>)}
          </div>
          {renderCharts()}
          <div className="grid grid-cols-2 gap-6">
            {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-4"><h4 className="text-sm font-semibold mb-2 text-[#78350f]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="sce-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="sce-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{r.capacityWh.toLocaleString("en-IN")}</td><td className="px-3 py-2 text-right">{r.voltageV}</td><td className="px-3 py-2 text-right">{r.cycleLife.toLocaleString("en-IN")}</td><td className="px-3 py-2 text-right">{r.powerDensity}</td><td className="px-3 py-2">{r.technology}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.plant}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.cellType}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="sce-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="sce-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#78350f]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
