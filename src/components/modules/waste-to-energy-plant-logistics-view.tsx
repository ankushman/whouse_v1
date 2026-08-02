"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#7c2d12", "#9a3412", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#dc2626", "#b91c1c"];
const DEVELOPERS = ["NEpra Green Delhi Narela", "Ramky Enviro Engineers Hyderabad", "Ecotech Waste Mumbai", "Abellon CleanEnergy Ahmedabad", "GreenZest Energy Bangalore", "Ecoman Enviro Solutions Pune", "MGS Waste Power Chennai", "Jindal SAW Waste Energy Raigarh"];
const CATEGORIES = ["14MW Mass Burn Incineration Grate", "8MW RDF Refuse Derived Fuel Boiler", "25MW Gasification Plasma Arc", "5MW Biomethanation Organic Wet", "12MW Pyrolysis Tire Plastic", "10MW Anaerobic Digester MSW", "20MW Circulating Fluidized Bed", "3MW Small Scale Biogas CHP"];
const SHIPMENT_STATUSES = ["Boiler Turbine Foundation Pouring", "Reactor Vessel Installation Active", "Feeder Conveyor System Assembly", "Pollution Control SCR Bag Filter", "Grid Synchronization Testing", "Waste Feed Commissioning Active"];
const ZONES = ["Delhi NCR Narela Ghazipur Okhla", "Mumbai Maharashtra Deonar", "Hyderabad TS Jawaharnagar", "Bangalore KA Mandur", "Pune Maharashtra Uruli Devachi", "Chennai TN Kodungaiyur", "Ahmedabad GJ Pirana"];
const MODES = ["Heavy Haul Trailer 80T Boiler", "Flatbed 40T Conveyor Sections", "Crane Truck 25T Reactor Vessel", "Rail Wagon RDF Pellet Bulk", "Container Ship Scrubber Unit", "Multi-Axle 60T Turbine Generator"];
const TABS = ["Dashboard", "Plant Registry", "WTE Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = {
  "Boiler Turbine Foundation Pouring": "slate",
  "Reactor Vessel Installation Active": "red",
  "Feeder Conveyor System Assembly": "amber",
  "Pollution Control SCR Bag Filter": "orange",
  "Grid Synchronization Testing": "blue",
  "Waste Feed Commissioning Active": "green"
};

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyGen = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], incineration: +(12 + Math.sin(i * 0.5) * 4).toFixed(1), rdf: +(8 + Math.cos(i * 0.6) * 3).toFixed(1), gasification: +(6 + Math.sin(i * 0.7) * 2).toFixed(1), biomethanation: +(4 + Math.cos(i * 0.8) * 1.5).toFixed(1) }));
const techDist = [{ n: "Mass Burn", v: 25 }, { n: "RDF", v: 20 }, { n: "Gasification", v: 20 }, { n: "Pyrolysis", v: 15 }, { n: "Biomethanation", v: 12 }, { n: "Fluidized Bed", v: 8 }];
const costPerTPD = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(6.5 + Math.sin(i * 0.4) * 1.5).toFixed(1), target: 8.0 }));
const emissionTrend = [
  { plant: "NEpra Narela", sox: 42, nox: 65, particulate: 28 },
  { plant: "Ramky Hyd", sox: 38, nox: 58, particulate: 22 },
  { plant: "Ecotech Mum", sox: 55, nox: 72, particulate: 35 },
  { plant: "Abellon Ahd", sox: 30, nox: 48, particulate: 18 },
  { plant: "GreenZest Blr", sox: 45, nox: 60, particulate: 25 },
  { plant: "Ecoman Pune", sox: 36, nox: 55, particulate: 20 },
  { plant: "MGS Chennai", sox: 48, nox: 68, particulate: 30 },
  { plant: "Jindal Raigarh", sox: 52, nox: 75, particulate: 32 }
];

const INSIGHTS = [
  { t: "India\u2019s 62 Million Tonne MSW Challenge & 100MW WTE Target by 2025", c: "India generates approximately 62 million tonnes of municipal solid waste (MSW) annually, growing at 5% per year with urbanization. Only 20% of this waste is scientifically processed, while over 50% ends up in open landfills causing groundwater contamination, methane emissions, and fire hazards. The Ministry of New and Renewable Energy (MNRE) and Swachh Bharat Mission have set an ambitious target of 100MW waste-to-energy capacity by 2025 through municipal solid waste processing. The Solid Waste Management Rules 2016 mandate all cities above 1 million population to set up WTE facilities. Current installed WTE capacity stands at approximately 180MW across operational and under-construction plants, with significant ramp-up planned through PPP models, municipal bonds, and central financial assistance schemes." },
  { t: "Delhi NCR WTE Corridor: Timarpur Okhla Narela Processing 7000 TPD", c: "The Delhi National Capital Region hosts India\u2019s most concentrated WTE infrastructure with three major plants. The Okhla WTE plant (16MW) processes 2000 TPD of MSW using mass burn incineration technology, supplying power to the Delhi grid. The Timarpur-Okhla facility was India\u2019s first large-scale WTE plant. The upcoming Narela WTE plant (14MW) under NEpra Green will process 2500 TPD, while the Ghazipur cluster aims for an additional 2500 TPD processing capacity. Together, these three plants target processing 7000 TPD of Delhi\u2019s daily 11000 TPD waste generation, significantly reducing the city\u2019s landfill dependency at Ghazipur, Okhla, and Bhalswa dumpsites which have become environmental hazards with recurring fire incidents." },
  { t: "Biomethanation for Organic Wet Waste: 50% MSW to Biogas Electricity", c: "Approximately 50% of India\u2019s municipal solid waste is organic wet waste comprising food waste, vegetable market refuse, slaughterhouse waste, and biodegradable kitchen waste. Biomethanation technology through anaerobic digestion converts this organic fraction into biogas (methane 55-65%) which is then used in gas engines for electricity generation. Plants like Abellon CleanEnergy Ahmedabad (5MW) and MGS Waste Power Chennai (10MW) demonstrate this pathway processing 500-1000 TPD of organic waste. The residual digestate serves as high-quality organic fertilizer, closing the waste-to-resource loop. Government subsidies under the National Bioenergy Programme provide 30-40% capital cost assistance for biomethanation projects, making them financially viable with 8-10 year payback periods." },
  { t: "Plasma Gasification: Zero Landfill with 99.9% Waste Destruction Efficiency", c: "Plasma gasification represents the most advanced WTE technology achieving 99.9% waste destruction efficiency with near-zero landfill requirement. The technology uses electrically generated plasma arcs at temperatures exceeding 5000\u00b0C to dissociate organic waste into synthesis gas (syngas) composed primarily of carbon monoxide and hydrogen, while inorganic materials vitrify into non-leachable slag. The 25MW Gasification Plasma Arc facility category represents India\u2019s adoption of this cutting-edge technology for handling mixed MSW including plastics, biomedical waste, and industrial hazardous waste. Syngas can power gas turbines or be converted to liquid fuels. The vitrified slag finds use in construction aggregates and road building, achieving true zero-waste-to-landfill status aligned with India\u2019s Circular Economy principles." }
];

interface WTERecord { id: string; batchNo: string; developer: string; zone: string; category: string; description: string; capacityMW: number; technology: string; wasteType: string; wasteTPD: number; emissionStandard: string; origin: string; plant: string; city: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; gridType: string; status: string; remarks: string; }

const records: WTERecord[] = [
  { id: "WTE-0001", batchNo: "NEP/NRL/2025/BF-0021", developer: "NEpra Green Delhi Narela", zone: "Delhi NCR Narela Ghazipur Okhla", category: "14MW Mass Burn Incineration Grate", description: "Mass burn incineration grate boiler assembly 14MW for Narela WTE plant processing 2500 TPD MSW", capacityMW: 14, technology: "Mass Burn Incineration", wasteType: "MSW Mixed Municipal", wasteTPD: 2500, emissionStandard: "CPCB Norms 50mg/Nm3", origin: "Thermax Ltd Pune MH", plant: "Narela WTE Plant", city: "Delhi", mode: "Heavy Haul Trailer 80T Boiler", prodDate: "2025-03-10", shipDate: "2025-05-18", transitDays: 6, contractValue: 520000000, gridType: "State Grid Connected", status: "Boiler Turbine Foundation Pouring", remarks: "14MW mass burn grate boiler Thermax Pune Narela foundation work" },
  { id: "WTE-0002", batchNo: "RE/JNH/2025/RD-0035", developer: "Ramky Enviro Engineers Hyderabad", zone: "Hyderabad TS Jawaharnagar", category: "8MW RDF Refuse Derived Fuel Boiler", description: "RDF fluff pellet boiler 8MW for Jawaharnagar WTE processing 1200 TPD refuse derived fuel", capacityMW: 8, technology: "RDF Boiler", wasteType: "RDF Fluff Pellet", wasteTPD: 1200, emissionStandard: "MoEFCC 30mg/Nm3", origin: "BHEL Bhopal Plant MP", plant: "Jawaharnagar WTE Facility", city: "Hyderabad", mode: "Rail Wagon RDF Pellet Bulk", prodDate: "2025-02-15", shipDate: "2025-04-22", transitDays: 4, contractValue: 185000000, gridType: "State Grid Connected", status: "Reactor Vessel Installation Active", remarks: "8MW RDF boiler BHEL Bhopal Jawaharnagar reactor vessel installation" },
  { id: "WTE-0003", batchNo: "ECT/DNR/2025/GP-0048", developer: "Ecotech Waste Mumbai", zone: "Mumbai Maharashtra Deonar", category: "25MW Gasification Plasma Arc", description: "Plasma arc gasification reactor 25MW for Deonar WTE processing 2000 TPD mixed MSW to syngas", capacityMW: 25, technology: "Gasification Plasma", wasteType: "MSW Mixed Municipal", wasteTPD: 2000, emissionStandard: "EU Industrial Emission", origin: "Hitachi Zosen Japan", plant: "Deonar Plasma Gasification Plant", city: "Mumbai", mode: "Container Ship Scrubber Unit", prodDate: "2024-10-05", shipDate: "2025-01-20", transitDays: 55, contractValue: 800000000, gridType: "Open Access Merchant", status: "Reactor Vessel Installation Active", remarks: "25MW plasma reactor Hitachi Zosen Deonar vessel installation active" },
  { id: "WTE-0004", batchNo: "ABL/PIR/2025/BM-0012", developer: "Abellon CleanEnergy Ahmedabad", zone: "Ahmedabad GJ Pirana", category: "5MW Biomethanation Organic Wet", description: "Anaerobic digester biomethanation 5MW for Pirana processing 500 TPD organic wet MSW to biogas", capacityMW: 5, technology: "Biomethanation AD", wasteType: "Organic Wet MSW", wasteTPD: 500, emissionStandard: "CPCB Norms 50mg/Nm3", origin: "VA TECH WABAG Chennai", plant: "Pirana Biogas Plant", city: "Ahmedabad", mode: "Crane Truck 25T Reactor Vessel", prodDate: "2025-01-20", shipDate: "2025-03-15", transitDays: 3, contractValue: 95000000, gridType: "Captive Power Plant", status: "Feeder Conveyor System Assembly", remarks: "5MW biomethanation digester WABAG Pirana feeder assembly" },
  { id: "WTE-0005", batchNo: "GZE/MAN/2025/PY-0028", developer: "GreenZest Energy Bangalore", zone: "Bangalore KA Mandur", category: "12MW Pyrolysis Tire Plastic", description: "Pyrolysis reactor system 12MW for Mandur processing 800 TPD tire rubber plastic waste to oil", capacityMW: 12, technology: "Pyrolysis", wasteType: "Tire Rubber", wasteTPD: 800, emissionStandard: "US EPA 40CFR60", origin: "Beston Machinery China", plant: "Mandur Pyrolysis WTE Plant", city: "Bangalore", mode: "Container Ship Scrubber Unit", prodDate: "2025-04-01", shipDate: "2025-06-10", transitDays: 42, contractValue: 340000000, gridType: "Open Access Merchant", status: "Pollution Control SCR Bag Filter", remarks: "12MW pyrolysis reactor Beston China Mandur SCR bag filter" },
  { id: "WTE-0006", batchNo: "ECM/URU/2025/AD-0039", developer: "Ecoman Enviro Solutions Pune", zone: "Pune Maharashtra Uruli Devachi", category: "10MW Anaerobic Digester MSW", description: "Anaerobic digester 10MW for Uruli Devachi processing 1000 TPD MSW organic fraction biogas", capacityMW: 10, technology: "Biomethanation AD", wasteType: "Organic Wet MSW", wasteTPD: 1000, emissionStandard: "MoEFCC 30mg/Nm3", origin: "Praj Industries Pune MH", plant: "Uruli Devachi Biogas Plant", city: "Pune", mode: "Flatbed 40T Conveyor Sections", prodDate: "2025-02-28", shipDate: "2025-04-05", transitDays: 2, contractValue: 220000000, gridType: "State Grid Connected", status: "Grid Synchronization Testing", remarks: "10MW anaerobic digester Praj Pune Uruli Devachi grid sync" },
  { id: "WTE-0007", batchNo: "MGS/KOD/2025/FB-0044", developer: "MGS Waste Power Chennai", zone: "Chennai TN Kodungaiyur", category: "20MW Circulating Fluidized Bed", description: "Circulating fluidized bed boiler 20MW for Kodungaiyur processing 1800 TPD MSW agricultural residue", capacityMW: 20, technology: "Fluidized Bed", wasteType: "Agricultural Residue", wasteTPD: 1800, emissionStandard: "EU Industrial Emission", origin: "BHEL Hyderabad TS", plant: "Kodungaiyur CFB WTE Plant", city: "Chennai", mode: "Multi-Axle 60T Turbine Generator", prodDate: "2024-12-10", shipDate: "2025-03-20", transitDays: 5, contractValue: 680000000, gridType: "State Grid Connected", status: "Boiler Turbine Foundation Pouring", remarks: "20MW CFB boiler BHEL Hyderabad Kodungaiyur foundation pouring" },
  { id: "WTE-0008", batchNo: "JSW/RAI/2025/MB-0016", developer: "Jindal SAW Waste Energy Raigarh", zone: "Mumbai Maharashtra Deonar", category: "3MW Small Scale Biogas CHP", description: "Small scale biogas CHP 3MW for Raigarh processing 300 TPD organic wet waste combined heat power", capacityMW: 3, technology: "Biomethanation AD", wasteType: "Organic Wet MSW", wasteTPD: 300, emissionStandard: "CPCB Norms 50mg/Nm3", origin: "Clarke Energy UK", plant: "Raigarh Biogas CHP Station", city: "Raigarh", mode: "Crane Truck 25T Reactor Vessel", prodDate: "2025-05-05", shipDate: "2025-06-25", transitDays: 8, contractValue: 72000000, gridType: "Captive Power Plant", status: "Feeder Conveyor System Assembly", remarks: "3MW biogas CHP Clarke Energy UK Raigarh feeder assembly" },
  { id: "WTE-0009", batchNo: "NEP/GHA/2025/MB-0031", developer: "NEpra Green Delhi Narela", zone: "Delhi NCR Narela Ghazipur Okhla", category: "14MW Mass Burn Incineration Grate", description: "Secondary combustion chamber and economizer 14MW for Ghazipur WTE expansion 2000 TPD capacity", capacityMW: 14, technology: "Mass Burn Incineration", wasteType: "MSW Mixed Municipal", wasteTPD: 2000, emissionStandard: "CPCB Norms 50mg/Nm3", origin: "Thermax Ltd Pune MH", plant: "Ghazipur WTE Expansion", city: "Delhi", mode: "Heavy Haul Trailer 80T Boiler", prodDate: "2025-03-25", shipDate: "2025-06-01", transitDays: 5, contractValue: 480000000, gridType: "State Grid Connected", status: "Pollution Control SCR Bag Filter", remarks: "14MW economizer Thermax Ghazipur SCR bag filter installation" },
  { id: "WTE-0010", batchNo: "RE/HYD/2025/GP-0042", developer: "Ramky Enviro Engineers Hyderabad", zone: "Hyderabad TS Jawaharnagar", category: "25MW Gasification Plasma Arc", description: "Plasma torch and gasification reactor vessel 25MW for Hyderabad waste processing 1500 TPD", capacityMW: 25, technology: "Gasification Plasma", wasteType: "Plastic Film", wasteTPD: 1500, emissionStandard: "EU Industrial Emission", origin: "Westinghouse Plasma USA", plant: "Hyderabad Plasma Gasification", city: "Hyderabad", mode: "Container Ship Scrubber Unit", prodDate: "2024-09-15", shipDate: "2025-01-10", transitDays: 48, contractValue: 750000000, gridType: "Open Access Merchant", status: "Grid Synchronization Testing", remarks: "25MW plasma torch Westinghouse USA Hyderabad grid sync testing" },
  { id: "WTE-0011", batchNo: "ECT/MUM/2025/RD-0055", developer: "Ecotech Waste Mumbai", zone: "Mumbai Maharashtra Deonar", category: "8MW RDF Refuse Derived Fuel Boiler", description: "RDF pellet processing line and boiler 8MW for Deonar municipal waste 1000 TPD fluff pellet", capacityMW: 8, technology: "RDF Boiler", wasteType: "RDF Fluff Pellet", wasteTPD: 1000, emissionStandard: "MoEFCC 30mg/Nm3", origin: "BHEL Trichy TN", plant: "Deonar RDF Boiler Plant", city: "Mumbai", mode: "Rail Wagon RDF Pellet Bulk", prodDate: "2025-04-12", shipDate: "2025-05-28", transitDays: 3, contractValue: 160000000, gridType: "State Grid Connected", status: "Waste Feed Commissioning Active", remarks: "8MW RDF boiler BHEL Trichy Deonar waste feed commissioning" },
  { id: "WTE-0012", batchNo: "GZE/BLR/2025/FB-0033", developer: "GreenZest Energy Bangalore", zone: "Bangalore KA Mandur", category: "20MW Circulating Fluidized Bed", description: "CFB boiler turbine island 20MW for Mandur processing 1500 TPD MSW and agricultural residue mix", capacityMW: 20, technology: "Fluidized Bed", wasteType: "Agricultural Residue", wasteTPD: 1500, emissionStandard: "US EPA 40CFR60", origin: "BHEL Hyderabad TS", plant: "Mandur CFB WTE Expansion", city: "Bangalore", mode: "Multi-Axle 60T Turbine Generator", prodDate: "2025-01-08", shipDate: "2025-04-15", transitDays: 7, contractValue: 620000000, gridType: "State Grid Connected", status: "Reactor Vessel Installation Active", remarks: "20MW CFB turbine BHEL Hyderabad Mandur reactor installation" },
  { id: "WTE-0013", batchNo: "ABL/AHD/2025/PY-0019", developer: "Abellon CleanEnergy Ahmedabad", zone: "Ahmedabad GJ Pirana", category: "12MW Pyrolysis Tire Plastic", description: "Pyrolysis tire recycling system 12MW for Pirana processing 600 TPD tire rubber waste to fuel oil", capacityMW: 12, technology: "Pyrolysis", wasteType: "Tire Rubber", wasteTPD: 600, emissionStandard: "CPCB Norms 50mg/Nm3", origin: "Beston Machinery China", plant: "Pirana Pyrolysis Plant", city: "Ahmedabad", mode: "Container Ship Scrubber Unit", prodDate: "2025-03-15", shipDate: "2025-05-20", transitDays: 40, contractValue: 290000000, gridType: "Captive Power Plant", status: "Waste Feed Commissioning Active", remarks: "12MW pyrolysis tire Beston China Pirana waste feed active" },
  { id: "WTE-0014", batchNo: "ECM/PUN/2025/AD-0047", developer: "Ecoman Enviro Solutions Pune", zone: "Pune Maharashtra Uruli Devachi", category: "5MW Biomethanation Organic Wet", description: "Biomethanation digester upgrade 5MW for Uruli Devachi processing 400 TPD organic wet MSW biogas", capacityMW: 5, technology: "Biomethanation AD", wasteType: "Organic Wet MSW", wasteTPD: 400, emissionStandard: "MoEFCC 30mg/Nm3", origin: "Praj Industries Pune MH", plant: "Uruli Devachi Biogas Phase-2", city: "Pune", mode: "Flatbed 40T Conveyor Sections", prodDate: "2025-04-20", shipDate: "2025-06-05", transitDays: 2, contractValue: 85000000, gridType: "Captive Power Plant", status: "Grid Synchronization Testing", remarks: "5MW biomethanation upgrade Praj Pune Uruli Devachi grid sync" }
];

export default function WasteToEnergyPlantLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalCapacityMW = records.reduce((s, r) => s + r.capacityMW, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => { const c = statusColor[r.status]; return c === "slate" || c === "red" || c === "amber" || c === "orange" || c === "blue"; }).length;
  const commissioningActive = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total WTE Capacity (MW)", v: totalCapacityMW, s: "Across " + records.length + " WTE plant records" },
    { l: "Under Construction", v: underConstruction, s: "Foundation to grid sync" },
    { l: "Commissioning Active", v: commissioningActive, s: "Waste feed active" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "developer", label: "Developer", options: DEVELOPERS.map(d => ({ value: d, count: records.filter(r => r.developer === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "technology", label: "Technology", options: ["Mass Burn Incineration", "RDF Boiler", "Gasification Plasma", "Biomethanation AD", "Pyrolysis", "Fluidized Bed"].map(t => ({ value: t, count: records.filter(r => r.technology === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.developer.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.plant.toLowerCase().includes(q) && !r.technology.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof WTERecord] as string));
  });

  const COLS = ["ID", "Batch No", "Developer", "Zone", "Category", "Description", "Capacity (MW)", "Technology", "Waste Type", "Waste TPD", "Emission Std", "Origin", "Plant", "City", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Grid Type", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="wte-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Energy Generation by Technology (GWh)</h3><AreaChart data={monthlyGen} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="incineration" stackId="1" stroke="#7c2d12" fill="#7c2d12" fillOpacity={0.6} name="Incineration" /><Area type="monotone" dataKey="rdf" stackId="1" stroke="#ea580c" fill="#ea580c" fillOpacity={0.6} name="RDF" /><Area type="monotone" dataKey="gasification" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} name="Gasification" /><Area type="monotone" dataKey="biomethanation" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} name="Biomethanation" /></AreaChart></div>
        <div className="wte-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Technology Distribution (%)</h3><PieChart width={400} height={220}><Pie data={techDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="wte-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost Per TPD (\u20b9 Lakh) vs Target \u20b98L/TPD</h3><LineChart data={costPerTPD} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[4, 10]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#7c2d12" strokeWidth={2} name="Actual" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target \u20b98L" /></LineChart></div>
        <div className="wte-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Emission Levels by Plant (mg/Nm3)</h3><BarChart data={emissionTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="plant" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Legend /><Bar dataKey="sox" fill="#7c2d12" radius={[4,4,0,0]} name="SOx" /><Bar dataKey="nox" fill="#ea580c" radius={[4,4,0,0]} name="NOx" /><Bar dataKey="particulate" fill="#dc2626" radius={[4,4,0,0]} name="Particulate" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="wte-root p-6 space-y-6">
      <PageHeader title="Waste-to-Energy Plant Logistics" description="Indian waste-to-energy plant construction logistics covering mass burn incineration grate 14MW, RDF refuse derived fuel boiler 8MW, gasification plasma arc 25MW, biomethanation anaerobic digester 5MW, pyrolysis tire plastic 12MW, circulating fluidized bed 20MW with CPCB MoEFCC emission compliance and heavy haul transport across Delhi NCR Mumbai Hyderabad Bangalore Chennai Pune Ahmedabad" />
      <div className="wte-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`wte-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#7c2d12] text-white" : "text-gray-600 hover:bg-orange-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="wte-dashboard space-y-6">
          <div className="wte-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="wte-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 wte-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#7c2d12] wte-kpi-val">{k.v}</div><div className="text-xs text-gray-400 wte-kpi-sub">{k.s}</div></div>))}
          </div>
          {renderCharts()}
        </div>
      )}

      {tab === 1 && (
        <div className="wte-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Waste-to-Energy", href: "#" }, { label: "Plant Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="wte-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{COLS.map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "";
              const rowCls = sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-orange-500" : "";
              return (<tr key={r.id} className={`border-b hover:bg-orange-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="wte-badge inline-block px-2 py-0.5 rounded text-xs bg-[#7c2d12] text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.developer}</td>
                <td className="px-3 py-2"><span className="wte-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="wte-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.capacityMW}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.technology}</td>
                <td className="px-3 py-2"><span className="wte-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.wasteType}</span></td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.wasteTPD.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2"><span className="wte-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.emissionStandard}</span></td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.plant}</td>
                <td className="px-3 py-2 text-xs">{r.city}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate || "\u2014"}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 30 ? "text-red-600" : r.transitDays >= 10 ? "text-amber-600" : r.transitDays > 0 ? "text-green-600" : "text-gray-400"}`}>{r.transitDays > 0 ? r.transitDays + "d" : "\u2014"}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#7c2d12]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2"><span className="wte-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.gridType}</span></td>
                <td className="px-3 py-2"><span className={`wte-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[sc]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="wte-analytics space-y-6">
          {renderCharts()}
        </div>
      )}

      {tab === 3 && (
        <div className="wte-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="wte-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#7c2d12] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
