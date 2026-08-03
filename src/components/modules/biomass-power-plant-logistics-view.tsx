"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#14532d", "#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac", "#059669"];
const OPERATORS = ["Thermax Ltd Pune", "BHEL Bhopal", "Jindal Steel Power Raigarh", "Clariant India Mumbai", "Bihar Renewable Rajgir", "Clarke Energy Chennai", "GE Power India Bangalore", "W\u00e4rtsil\u00e4 India Pune"];
const CATEGORIES = ["25MW Bagasse Cogeneration Sugar Mill", "10MW Rice Husk Gasifier Power", "50MW Biomass Circulating Fluidized Bed", "5MW Biogas Anaerobic Digester", "15MW Wood Chip Steam Turbine", "20MW Agri Residue Pellet Boiler", "8MW poultry Litter Combustion", "30MW Municipal Organic MSW AD"];
const SHIPMENT_STATUSES = ["Boiler Pressure Parts Assembly", "Fuel Handling Conveyor System", "Steam Turbine Generator Installation", "Air Pollution Control ESP Baghouse", "Fuel Yard Storage Prep Active", "Grid Synchronization Power Export"];
const ZONES = ["UP Lakhimpur Pilibhit Sugar Belt", "Punjab Kapurthala Rice Mills", "Maharashtra Kolhapur Sangli Sugar", "Karnataka Bellary Raichur Rice", "Tamil Nadu Erode Cuddalore Sugar", "MP Sehore Rewa Agri Belt", "Rajasthan Kota Baran Kharif"];
const MODES = ["Flatbed Trailer 40T Boiler Drum", "Heavy Haul 60T Turbine", "Crane Truck 25T ESP Unit", "Rail Wagon Rice Husk Bulk", "Barge Coastal Biomass Pellet", "Multi-Axle 40T Conveyor Frame"];
const TABS = ["Dashboard", "Plant Registry", "Biomass Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = {
  "Boiler Pressure Parts Assembly": "slate",
  "Fuel Handling Conveyor System": "blue",
  "Steam Turbine Generator Installation": "amber",
  "Air Pollution Control ESP Baghouse": "orange",
  "Fuel Yard Storage Prep Active": "red",
  "Grid Synchronization Power Export": "green"
};

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyGen = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], bagasse: +(18 + Math.sin(i * 0.5) * 6).toFixed(1), rice_husk: +(10 + Math.cos(i * 0.6) * 4).toFixed(1), wood_chip: +(7 + Math.sin(i * 0.7) * 3).toFixed(1), biogas: +(4 + Math.cos(i * 0.8) * 2).toFixed(1) }));
const fuelDist = [{ n: "Bagasse", v: 30 }, { n: "Rice Husk", v: 25 }, { n: "Wood Chip", v: 15 }, { n: "Agri Pellet", v: 15 }, { n: "Biogas", v: 10 }, { n: "Other", v: 5 }];
const fuelCostPerMWh = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(3.8 + Math.sin(i * 0.4) * 1.2).toFixed(1), target: 4.5 }));
const stateCapacity = [
  { state: "UP", mw: 1200 },
  { state: "MH", mw: 950 },
  { state: "KA", mw: 680 },
  { state: "TN", mw: 580 },
  { state: "PB", mw: 450 },
  { state: "MP", mw: 380 },
  { state: "RJ", mw: 290 },
  { state: "BR", mw: 210 }
];

const INSIGHTS = [
  { t: "India\u2019s 10GW Biomass Power Target by 2030: MNRE Policy Framework", c: "India has set an ambitious target of achieving 10GW of biomass-based power generation capacity by 2030 under the National Bio-Energy Programme launched by the Ministry of New and Renewable Energy (MNRE). The current installed biomass power capacity stands at approximately 10.7GW including bagasse cogeneration, biomass gasifiers, waste-to-energy, and biogas plants. The policy framework provides central financial assistance of up to \u20b950 lakh per MW for biomass power projects and \u20b925 lakh per kW for biomass gasifier systems. The National Biomass Cookstove Programme and Sustainable Alternative Towards Affordable Transportation (SATAT) initiative for compressed biogas further strengthen the biomass ecosystem. State-level feed-in tariffs ranging from \u20b96.50 to \u20b98.50 per kWh provide revenue certainty for developers, while renewable purchase obligations (RPO) mandate discoms to source biomass power." },
  { t: "Sugar Mill Cogeneration: 4000MW Installed from Bagasse-Based Power", c: "India\u2019s sugar industry leads biomass power generation through bagasse-based cogeneration with approximately 4000MW of installed capacity across 500+ sugar mills. High-pressure cogeneration systems operating at 80-110 bar with extraction-condensing steam turbines achieve electrical efficiency of 25-35%, significantly higher than the traditional 22-28% of low-pressure boilers. Major sugar mill cogeneration clusters exist in Uttar Pradesh (Lakhimpur, Pilibhit, Saharanpur), Maharashtra (Kolhapur, Sangli, Solapur), Karnataka (Belgaum, Mandya), and Tamil Nadu (Erode, Cuddalore, Salem). During the crushing season (October-March), surplus power export to the grid ranges from 15-30MW per mill. Off-season operation using alternative biomass fuels like sugarcane trash, press mud, and rice husk is being promoted to improve plant utilization factors from the current 35-45% to 65-75%." },
  { t: "Rice Husk Gasifier Power: Rural Electrification Across Punjab Karnataka Tamil Nadu", c: "Rice husk gasifier-based power plants have emerged as a transformative technology for rural electrification in India\u2019s rice-producing states. India generates approximately 25 million tonnes of rice husk annually, with calorific value of 3000-3500 kCal/kg. Gasifier systems convert rice husk into producer gas (18-22% CO, 15-20% H2) which powers dual-fuel diesel engines or dedicated spark-ignition gas engines at 10-20kW to 1MW capacities. Punjab (Kapurthala, Ludhiana, Amritsar), Karnataka (Raichur, Bellary, Shimoga), and Tamil Nadu (Thanjavur, Cuddalore) host significant rice husk gasifier installations. The technology addresses both waste disposal and rural energy access challenges. MNRE provides \u20b91.5-2.0 crore per MW capital subsidy for rice husk gasifier projects, with typical payback periods of 4-6 years at \u20b95.50-7.00 per kWh tariff." },
  { t: "Biomass Pellet Fuel Supply Chain: Overcoming Collection Logistics Challenges", c: "The biomass pellet supply chain in India faces significant logistical challenges that impact plant operations and viability. Biomass fuel collection involves aggregating loose, low-density agricultural residues from dispersed farming locations across radii of 50-100km from power plants. Collection costs constitute 40-50% of total fuel cost, with transportation alone accounting for 25-30%. Key challenges include seasonal availability (post-harvest windows of 2-3 months per crop), storage deterioration (moisture absorption, spontaneous combustion), and competing demand from animal feed and paper industries. India\u2019s pellet production capacity has grown to approximately 7 million tonnes per annum, supported by the SAMARTH biomass pelletization scheme. Pelletizing biomass at 10-12% moisture increases bulk density from 100-200 kg/m3 (loose) to 600-650 kg/m3, reducing transportation costs by 3-4 times. Cold storage logistics, rail wagon availability, and last-mile delivery to remote plant sites remain critical bottlenecks requiring dedicated supply chain infrastructure investment." }
];

interface BiomassRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; capacityMW: number; fuelType: string; fuelTPD: number; efficiency: number; emissionStd: string; origin: string; plant: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; boilerType: string; status: string; remarks: string; }

const records: BiomassRecord[] = [
  { id: "BMP-0001", batchNo: "THX/LKP/2025/BG-0012", operator: "Thermax Ltd Pune", zone: "UP Lakhimpur Pilibhit Sugar Belt", category: "25MW Bagasse Cogeneration Sugar Mill", description: "25MW bagasse cogeneration high pressure boiler turbine island for Lakhimpur sugar mill surplus power export to UP grid", capacityMW: 25, fuelType: "Bagasse", fuelTPD: 1200, efficiency: 34, emissionStd: "CPCB Biomass 500mg/Nm3", origin: "Thermax Works Pune MH", plant: "Lakhimpur Sugar Cogen Plant", state: "Uttar Pradesh", mode: "Heavy Haul 60T Turbine", prodDate: "2025-02-10", shipDate: "2025-04-18", transitDays: 5, contractValue: 450000000, boilerType: "CFB 80bar 480C", status: "Grid Synchronization Power Export", remarks: "25MW bagasse cogen Thermax Pune Lakhimpur grid sync complete" },
  { id: "BMP-0002", batchNo: "BHL/KPT/2025/RH-0025", operator: "BHEL Bhopal", zone: "Punjab Kapurthala Rice Mills", category: "10MW Rice Husk Gasifier Power", description: "10MW rice husk gasifier power plant with gas cleaning system for Kapurthala rice mill cluster electrification", capacityMW: 10, fuelType: "Rice Husk", fuelTPD: 500, efficiency: 28, emissionStd: "MoEFCC New Source 150mg/Nm3", origin: "BHEL Bhopal Plant MP", plant: "Kapurthala Rice Husk Gasifier", state: "Punjab", mode: "Rail Wagon Rice Husk Bulk", prodDate: "2025-01-15", shipDate: "2025-03-22", transitDays: 4, contractValue: 120000000, boilerType: "Bubbling Bed 30bar 400C", status: "Steam Turbine Generator Installation", remarks: "10MW rice husk gasifier BHEL Bhopal Kapurthala turbine install" },
  { id: "BMP-0003", batchNo: "JSP/RAI/2025/CF-0038", operator: "Jindal Steel Power Raigarh", zone: "MP Sehore Rewa Agri Belt", category: "50MW Biomass Circulating Fluidized Bed", description: "50MW CFB biomass power plant with multi-fuel capability for Sehore agri residue and wood chip combustion", capacityMW: 50, fuelType: "Agri Residue Pellet", fuelTPD: 1500, efficiency: 38, emissionStd: "EU Industrial Emission 100mg/Nm3", origin: "Jindal Steel Works Raigarh", plant: "Sehore Biomass CFB Power Plant", state: "Madhya Pradesh", mode: "Multi-Axle 40T Conveyor Frame", prodDate: "2024-10-05", shipDate: "2025-01-20", transitDays: 6, contractValue: 600000000, boilerType: "CFB 80bar 480C", status: "Boiler Pressure Parts Assembly", remarks: "50MW CFB boiler Jindal Raigarh Sehore pressure parts assembly" },
  { id: "BMP-0004", batchNo: "CLI/MUM/2025/BG-0042", operator: "Clariant India Mumbai", zone: "Tamil Nadu Erode Cuddalore Sugar", category: "5MW Biogas Anaerobic Digester", description: "5MW biogas anaerobic digester plant processing press mud and sugarcane trash for Erode sugar co-operative power generation", capacityMW: 5, fuelType: "Press Mud", fuelTPD: 200, efficiency: 32, emissionStd: "CPCB Biomass 500mg/Nm3", origin: "VA TECH WABAG Chennai", plant: "Erode Biogas Digester Plant", state: "Tamil Nadu", mode: "Flatbed Trailer 40T Boiler Drum", prodDate: "2025-03-01", shipDate: "2025-04-15", transitDays: 3, contractValue: 75000000, boilerType: "Water Tube 60bar 450C", status: "Fuel Yard Storage Prep Active", remarks: "5MW biogas digester Clariant Mumbai Erode fuel yard prep" },
  { id: "BMP-0005", batchNo: "BRN/RGR/2025/WC-0055", operator: "Bihar Renewable Rajgir", zone: "Rajasthan Kota Baran Kharif", category: "15MW Wood Chip Steam Turbine", description: "15MW wood chip fired steam turbine power plant for Kota forest biomass utilization with fuel handling conveyor system", capacityMW: 15, fuelType: "Wood Chips", fuelTPD: 600, efficiency: 30, emissionStd: "MoEFCC New Source 150mg/Nm3", origin: "BHEL Trichy TN", plant: "Kota Wood Chip Power Plant", state: "Rajasthan", mode: "Crane Truck 25T ESP Unit", prodDate: "2025-02-20", shipDate: "2025-05-10", transitDays: 8, contractValue: 280000000, boilerType: "Stoker 40bar 440C", status: "Air Pollution Control ESP Baghouse", remarks: "15MW wood chip turbine Bihar Renewable Rajgir Kota ESP baghouse" },
  { id: "BMP-0006", batchNo: "CLE/CHN/2025/AP-0068", operator: "Clarke Energy Chennai", zone: "Maharashtra Kolhapur Sangli Sugar", category: "20MW Agri Residue Pellet Boiler", description: "20MW agri residue pellet boiler power plant for Sangli sugar belt using cotton stalk and soybean residue pellets", capacityMW: 20, fuelType: "Agri Residue Pellet", fuelTPD: 800, efficiency: 36, emissionStd: "EU Industrial Emission 100mg/Nm3", origin: "GE Power Bangalore KA", plant: "Sangli Agri Pellet Power Plant", state: "Maharashtra", mode: "Barge Coastal Biomass Pellet", prodDate: "2024-12-15", shipDate: "2025-03-25", transitDays: 10, contractValue: 380000000, boilerType: "CFB 80bar 480C", status: "Fuel Handling Conveyor System", remarks: "20MW agri pellet boiler Clarke Energy Chennai Sangli conveyor" },
  { id: "BMP-0007", batchNo: "GEP/BLR/2025/PL-0071", operator: "GE Power India Bangalore", zone: "Karnataka Bellary Raichur Rice", category: "8MW poultry Litter Combustion", description: "8MW poultry litter combustion power plant for Bellary poultry cluster with dedicated fuel yard storage preparation", capacityMW: 8, fuelType: "Poultry Litter", fuelTPD: 400, efficiency: 24, emissionStd: "CPCB Biomass 500mg/Nm3", origin: "Thermax Works Pune MH", plant: "Bellary Poultry Litter Power Plant", state: "Karnataka", mode: "Flatbed Trailer 40T Boiler Drum", prodDate: "2025-03-15", shipDate: "2025-05-28", transitDays: 7, contractValue: 135000000, boilerType: "Stoker 40bar 440C", status: "Fuel Yard Storage Prep Active", remarks: "8MW poultry litter combustion GE Power Bangalore Bellary yard" },
  { id: "BMP-0008", batchNo: "WRT/PUN/2025/MW-0084", operator: "W\u00e4rtsil\u00e4 India Pune", zone: "Punjab Kapurthala Rice Mills", category: "30MW Municipal Organic MSW AD", description: "30MW municipal organic MSW anaerobic digestion power plant for Kapurthala processing organic fraction of municipal solid waste", capacityMW: 30, fuelType: "Municipal Organic MSW", fuelTPD: 1000, efficiency: 26, emissionStd: "MoEFCC New Source 150mg/Nm3", origin: "W\u00e4rtsil\u00e4 Finland", plant: "Kapurthala MSW AD Power Plant", state: "Punjab", mode: "Heavy Haul 60T Turbine", prodDate: "2024-09-10", shipDate: "2025-02-15", transitDays: 45, contractValue: 520000000, boilerType: "Water Tube 60bar 450C", status: "Boiler Pressure Parts Assembly", remarks: "30MW MSW AD W\u00e4rtsil\u00e4 Finland Kapurthala pressure parts" },
  { id: "BMP-0009", batchNo: "THX/KOL/2025/BG-0097", operator: "Thermax Ltd Pune", zone: "Maharashtra Kolhapur Sangli Sugar", category: "25MW Bagasse Cogeneration Sugar Mill", description: "25MW bagasse cogeneration extraction condensing turbine for Kolhapur sugar mill surplus power export to MSEDCL grid", capacityMW: 25, fuelType: "Sugarcane Trash", fuelTPD: 1100, efficiency: 35, emissionStd: "CPCB Biomass 500mg/Nm3", origin: "Thermax Works Pune MH", plant: "Kolhapur Sugar Cogen Plant", state: "Maharashtra", mode: "Heavy Haul 60T Turbine", prodDate: "2025-01-20", shipDate: "2025-04-05", transitDays: 2, contractValue: 420000000, boilerType: "CFB 80bar 480C", status: "Grid Synchronization Power Export", remarks: "25MW bagasse cogen Thermax Pune Kolhapur grid export" },
  { id: "BMP-0010", batchNo: "BHL/BEL/2025/RH-0108", operator: "BHEL Bhopal", zone: "Karnataka Bellary Raichur Rice", category: "10MW Rice Husk Gasifier Power", description: "10MW rice husk gasifier with dual fuel engine for Raichur rice mill cluster with ESP emission control system", capacityMW: 10, fuelType: "Rice Husk", fuelTPD: 450, efficiency: 27, emissionStd: "MoEFCC New Source 150mg/Nm3", origin: "BHEL Bhopal Plant MP", plant: "Raichur Rice Husk Gasifier", state: "Karnataka", mode: "Rail Wagon Rice Husk Bulk", prodDate: "2025-04-01", shipDate: "2025-05-20", transitDays: 5, contractValue: 110000000, boilerType: "Bubbling Bed 30bar 400C", status: "Air Pollution Control ESP Baghouse", remarks: "10MW rice husk gasifier BHEL Bhopal Raichur ESP control" },
  { id: "BMP-0011", batchNo: "JSP/REW/2025/CF-0115", operator: "Jindal Steel Power Raigarh", zone: "MP Sehore Rewa Agri Belt", category: "50MW Biomass Circulating Fluidized Bed", description: "50MW CFB biomass power plant second unit for Rewa agri belt with multi-fuel feeding and conveyor system", capacityMW: 50, fuelType: "Wood Chips", fuelTPD: 1400, efficiency: 37, emissionStd: "EU Industrial Emission 100mg/Nm3", origin: "Jindal Steel Works Raigarh", plant: "Rewa Biomass CFB Power Plant", state: "Madhya Pradesh", mode: "Multi-Axle 40T Conveyor Frame", prodDate: "2024-11-20", shipDate: "2025-03-10", transitDays: 4, contractValue: 580000000, boilerType: "CFB 80bar 480C", status: "Fuel Handling Conveyor System", remarks: "50MW CFB unit-2 Jindal Rewa conveyor system active" },
  { id: "BMP-0012", batchNo: "CLI/ERD/2025/BG-0128", operator: "Clariant India Mumbai", zone: "Tamil Nadu Erode Cuddalore Sugar", category: "5MW Biogas Anaerobic Digester", description: "5MW biogas anaerobic digester for Cuddalore sugar co-operative processing sugarcane trash and press mud to biogas", capacityMW: 5, fuelType: "Press Mud", fuelTPD: 180, efficiency: 22, emissionStd: "CPCB Biomass 500mg/Nm3", origin: "VA TECH WABAG Chennai", plant: "Cuddalore Biogas Digester Plant", state: "Tamil Nadu", mode: "Flatbed Trailer 40T Boiler Drum", prodDate: "2025-03-25", shipDate: "2025-05-05", transitDays: 2, contractValue: 68000000, boilerType: "Water Tube 60bar 450C", status: "Steam Turbine Generator Installation", remarks: "5MW biogas digester Clariant Mumbai Cuddalore turbine install" },
  { id: "BMP-0013", batchNo: "CLE/CHN/2025/AP-0132", operator: "Clarke Energy Chennai", zone: "UP Lakhimpur Pilibhit Sugar Belt", category: "20MW Agri Residue Pellet Boiler", description: "20MW agri residue pellet boiler for Pilibhit sugar mill cluster using wheat straw and paddy straw pellet fuel", capacityMW: 20, fuelType: "Agri Residue Pellet", fuelTPD: 750, efficiency: 33, emissionStd: "MoEFCC New Source 150mg/Nm3", origin: "GE Power Bangalore KA", plant: "Pilibhit Agri Pellet Power Plant", state: "Uttar Pradesh", mode: "Rail Wagon Rice Husk Bulk", prodDate: "2025-02-05", shipDate: "2025-04-12", transitDays: 6, contractValue: 350000000, boilerType: "Stoker 40bar 440C", status: "Fuel Handling Conveyor System", remarks: "20MW agri pellet boiler Clarke Energy Chennai Pilibhit conveyor" },
  { id: "BMP-0014", batchNo: "GEP/BLR/2025/PL-0146", operator: "GE Power India Bangalore", zone: "Rajasthan Kota Baran Kharif", category: "15MW Wood Chip Steam Turbine", description: "15MW wood chip steam turbine plant for Baran kharif season biomass power generation with fuel yard and ESP system", capacityMW: 15, fuelType: "Wood Chips", fuelTPD: 550, efficiency: 29, emissionStd: "CPCB Biomass 500mg/Nm3", origin: "BHEL Trichy TN", plant: "Baran Wood Chip Power Plant", state: "Rajasthan", mode: "Crane Truck 25T ESP Unit", prodDate: "2025-04-10", shipDate: "2025-06-20", transitDays: 9, contractValue: 260000000, boilerType: "Stoker 40bar 440C", status: "Boiler Pressure Parts Assembly", remarks: "15MW wood chip turbine GE Power Bangalore Baran pressure parts" }
];

export default function BiomassPowerPlantLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalCapacityMW = records.reduce((s, r) => s + r.capacityMW, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => { const c = statusColor[r.status]; return c !== "green"; }).length;
  const exporting = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total Capacity (MW)", v: totalCapacityMW, s: "Across " + records.length + " biomass plant records" },
    { l: "Under Construction", v: underConstruction, s: "Assembly to fuel yard prep" },
    { l: "Exporting", v: exporting, s: "Grid sync power export" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "fuelType", label: "Fuel Type", options: ["Bagasse", "Rice Husk", "Wood Chips", "Agri Residue Pellet", "Poultry Litter", "Municipal Organic MSW", "Press Mud", "Sugarcane Trash"].map(t => ({ value: t, count: records.filter(r => r.fuelType === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.plant.toLowerCase().includes(q) && !r.fuelType.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof BiomassRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Capacity (MW)", "Fuel Type", "Fuel TPD", "Efficiency (%)", "Emission Std", "Origin", "Plant", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Boiler Type", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="bmp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Biomass Generation by Fuel Type (GWh)</h3><BarChart data={monthlyGen} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="bagasse" fill="#14532d" radius={[4,4,0,0]} name="Bagasse" /><Bar dataKey="rice_husk" fill="#15803d" radius={[4,4,0,0]} name="Rice Husk" /><Bar dataKey="wood_chip" fill="#16a34a" radius={[4,4,0,0]} name="Wood Chip" /><Bar dataKey="biogas" fill="#22c55e" radius={[4,4,0,0]} name="Biogas" /></BarChart></div>
        <div className="bmp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Biomass Fuel Distribution (%)</h3><PieChart width={400} height={220}><Pie data={fuelDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{fuelDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bmp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Fuel Cost Per MWh (\u20b9/MWh) vs Target \u20b94.5/MWh</h3><LineChart data={fuelCostPerMWh} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[2, 7]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#14532d" strokeWidth={2} name="Actual \u20b9/MWh" /><Line type="monotone" dataKey="target" stroke="#16a34a" strokeWidth={2} strokeDasharray="5 5" name="Target \u20b94.5" /></LineChart></div>
        <div className="bmp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Biomass Installed Capacity by State (MW)</h3><BarChart data={stateCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" /><YAxis /><Tooltip /><Legend /><Bar dataKey="mw" fill="#15803d" radius={[4,4,0,0]} name="Installed MW" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="bmp-root p-6 space-y-6">
      <PageHeader title="Biomass Power Plant Logistics" description="Indian biomass power plant construction logistics covering bagasse cogeneration sugar mill 25MW, rice husk gasifier power 10MW, biomass circulating fluidized bed 50MW, biogas anaerobic digester 5MW, wood chip steam turbine 15MW, agri residue pellet boiler 20MW, poultry litter combustion 8MW, municipal organic MSW AD 30MW with CPCB MoEFCC EU emission compliance and heavy haul transport across UP Punjab Maharashtra Karnataka Tamil Nadu MP Rajasthan" />
      <div className="bmp-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`bmp-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#14532d] text-white" : "text-gray-600 hover:bg-green-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="bmp-dashboard space-y-6">
          <div className="bmp-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="bmp-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 bmp-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#14532d] bmp-kpi-val">{k.v}</div><div className="text-xs text-gray-400 bmp-kpi-sub">{k.s}</div></div>))}
          </div>
          {renderCharts()}
        </div>
      )}

      {tab === 1 && (
        <div className="bmp-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Biomass Power", href: "#" }, { label: "Plant Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="bmp-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{COLS.map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "";
              const rowCls = sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-orange-500" : "";
              return (<tr key={r.id} className={`border-b hover:bg-green-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="bmp-badge inline-block px-2 py-0.5 rounded text-xs bg-[#14532d] text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.operator}</td>
                <td className="px-3 py-2"><span className="bmp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="bmp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.capacityMW}</td>
                <td className="px-3 py-2"><span className="bmp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.fuelType}</span></td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.fuelTPD.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.efficiency}%</td>
                <td className="px-3 py-2"><span className="bmp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.emissionStd}</span></td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.plant}</td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate || "\u2014"}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 30 ? "text-red-600" : r.transitDays >= 10 ? "text-amber-600" : r.transitDays > 0 ? "text-green-600" : "text-gray-400"}`}>{r.transitDays > 0 ? r.transitDays + "d" : "\u2014"}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#14532d]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2"><span className="bmp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.boilerType}</span></td>
                <td className="px-3 py-2"><span className={`bmp-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[sc]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="bmp-analytics space-y-6">
          {renderCharts()}
        </div>
      )}

      {tab === 3 && (
        <div className="bmp-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="bmp-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#14532d] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
