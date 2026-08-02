"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#92400e", "#a16207", "#b45309", "#d97706", "#f59e0b", "#fbbf24", "#eab308", "#ca8a04"];
const DEVELOPERS = ["Adani Green Energy Mumbai", "Reliance Power Jamnagar", "Tata Power Solar Delhi", "NTPC Renewable Noida", "Azure Power Gurugram", "ReNew Power Noida", "Greenko Energy Hyderabad", "Vikram Solar Kolkata"];
const CATEGORIES = ["500MW Mono PERC Tracker Mount", "250MW Bifacial Dual Glass Fixed", "1GW HJT Heterojunction Floating", "100MW Agrivoltaic Elevated", "300MW Thin Film CdTe Utility", "50MW Rooftop C&I Distributed", "150MW CPV Concentrator Pilot", "Solar Inverter 5MW String PCS"];
const SHIPMENT_STATUSES = ["Pile Foundation Driving Active", "Tracker Structure Assembly Transit", "Panel Mounting Wiring In Progress", "Inverter PCS Commissioning QC", "Grid Connectivity Testing Active", "Commercial Operation COD Achieved"];
const ZONES = ["Rajasthan Bhadla Jaisalmer Jodhpur", "Gujarat Kutch Patan Banaskantha", "Tamil Nadu Ramanathapuram Tuticorin", "Karnataka Pavagada Tumkur", "Madhya Pradesh Neemuch Mandsaur", "Andhra Pradesh Kurnool Anantapur", "Telangana Mahabubnagar"];
const MODES = ["Flatbed Trailer 40T Panel Stack", "Lowboy Trailer 80T Transformer", "Crane Truck 25T Pile Driver", "Rail Flat Wagon Panel Bulk", "River Barge 2000T Inverter", "Multi-Axle 60T Tracker Frame"];
const TABS = ["Dashboard", "Equipment Registry", "Construction Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = {
  "Pile Foundation Driving Active": "slate",
  "Tracker Structure Assembly Transit": "blue",
  "Panel Mounting Wiring In Progress": "amber",
  "Inverter PCS Commissioning QC": "orange",
  "Grid Connectivity Testing Active": "red",
  "Commercial Operation COD Achieved": "green",
};

const rowHighlight: Record<string, string> = {
  slate: "bg-slate-50 border-l-4 border-l-slate-400",
  blue: "bg-blue-50 border-l-4 border-l-blue-500",
  amber: "bg-amber-50 border-l-4 border-l-amber-500",
  orange: "bg-orange-50 border-l-4 border-l-orange-500",
  red: "bg-red-50 border-l-4 border-l-red-500",
  green: "bg-green-50 border-l-4 border-l-green-500",
};

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

function formatINR(num: number): string {
  const str = Math.abs(num).toFixed(0);
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== "") { lastThree = "," + lastThree; }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return "\u20b9" + (num < 0 ? "-" : "") + formatted;
}

function formatINRCr(num: number): string {
  const cr = num / 10000000;
  if (cr >= 100) return `\u20b9${cr.toFixed(0).replace(/\B(?=(\d{2})+(?!\d))/g, ",")} Cr`;
  if (cr >= 1) return `\u20b9${cr.toFixed(2).replace(/\B(?=(\d{2})+(?!\d))/g, ",")} Cr`;
  const l = num / 100000;
  return `\u20b9${l.toFixed(1).replace(/\B(?=(\d{2})+(?!\d))/g, ",")} L`;
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyInstall = Array.from({ length: 12 }, (_, i) => ({
  m: MO[i],
  utility: ri(80, 350, 200 + Math.sin(i * 0.5) * 80),
  rooftop: ri(10, 60, 30 + Math.cos(i * 0.6) * 15),
  floating: ri(5, 40, 20 + Math.sin(i * 0.7) * 10),
  agri: ri(2, 25, 10 + Math.cos(i * 0.8) * 5),
}));

const techDist = [
  { n: "Mono PERC", v: 35 },
  { n: "Bifacial", v: 25 },
  { n: "HJT", v: 15 },
  { n: "Thin Film", v: 10 },
  { n: "TOPCon", v: 10 },
  { n: "CPV", v: 5 },
];

const costPerMW = Array.from({ length: 12 }, (_, i) => ({
  m: MO[i],
  actual: +(ri(3.0, 4.2, 3.5 + Math.sin(i * 0.4) * 0.5)).toFixed(2),
  target: 3.5,
}));

const developerCapacity = DEVELOPERS.map(d => ({
  n: d.split(" ").slice(0, 2).join(" "),
  v: +ri(500, 8000, 3000 + Math.random() * 3000).toFixed(0),
}));

interface SolarRecord {
  id: string; batchNo: string; developer: string; zone: string; category: string; description: string;
  capacityMW: number; panelType: string; trackerType: string; inverterBrand: string; landArea: number;
  origin: string; site: string; state: string; mode: string; prodDate: string; shipDate: string;
  transitDays: number; contractValue: number; mountingType: string; status: string; remarks: string;
}

const records: SolarRecord[] = [
  { id: "SFC-0001", batchNo: "BAT-AG/BHD/2025/04-001", developer: "Adani Green Energy Mumbai", zone: "Rajasthan Bhadla Jaisalmer Jodhpur", category: "500MW Mono PERC Tracker Mount", description: "500MW Mono PERC 540W Single Axis Tracker Solar Park Bhadla Phase-IV", capacityMW: 500, panelType: "Mono PERC 540W", trackerType: "Single Axis NEXTracker", inverterBrand: "SMA Sunny Central 5MW", landArea: 2500, origin: "Adani Solar Mundra Factory Gujarat", site: "Bhadla Solar Park Phase-IV Jaisalmer", state: "Rajasthan", mode: "Flatbed Trailer 40T Panel Stack", prodDate: "2025-04-10", shipDate: "2025-04-15", transitDays: 3, contractValue: 4250000000, mountingType: "Single Axis Tracker", status: "Panel Mounting Wiring In Progress", remarks: "Adani 500MW Bhadla Phase-IV Mono PERC tracker mount panel wiring active" },
  { id: "SFC-0002", batchNo: "BAT-RP/JMN/2025/03-002", developer: "Reliance Power Jamnagar", zone: "Gujarat Kutch Patan Banaskantha", category: "250MW Bifacial Dual Glass Fixed", description: "250MW Bifacial 585W Dual Glass Fixed Tilt Solar Farm Kutch", capacityMW: 250, panelType: "Bifacial 585W", trackerType: "Fixed Tilt Structure", inverterBrand: "Huawei SUN2000 215KTL", landArea: 1200, origin: "Reliance Dhirubhai Ambani Solar Jamnagar", site: "Kutch Solar Park Patan District", state: "Gujarat", mode: "Multi-Axle 60T Tracker Frame", prodDate: "2025-03-22", shipDate: "2025-03-25", transitDays: 2, contractValue: 2100000000, mountingType: "Ground Mount Fixed", status: "Tracker Structure Assembly Transit", remarks: "Reliance 250MW Kutch bifacial dual glass fixed tilt structure assembly transit" },
  { id: "SFC-0003", batchNo: "BAT-TP/RMN/2025/05-003", developer: "Tata Power Solar Delhi", zone: "Tamil Nadu Ramanathapuram Tuticorin", category: "1GW HJT Heterojunction Floating", description: "1GW HJT 600W Heterojunction Floating Solar on Ramanathapuram Reservoir", capacityMW: 1000, panelType: "HJT 600W", trackerType: "Floating Pontoon HDPE", inverterBrand: "TMEIC SC1000", landArea: 4500, origin: "Tata Power Solar Bangalore Plant", site: "Ramanathapuram Reservoir Floating SPV", state: "Tamil Nadu", mode: "River Barge 2000T Inverter", prodDate: "2025-05-05", shipDate: "2025-05-12", transitDays: 5, contractValue: 5500000000, mountingType: "Floating SPV", status: "Pile Foundation Driving Active", remarks: "Tata 1GW Ramanathapuram floating HJT pontoon foundation driving active" },
  { id: "SFC-0004", batchNo: "BAT-NP/NNC/2025/02-004", developer: "NTPC Renewable Noida", zone: "Madhya Pradesh Neemuch Mandsaur", category: "100MW Agrivoltaic Elevated", description: "100MW Agrivoltaic Elevated 4M HJT 600W Dual Use Farming Solar", capacityMW: 100, panelType: "HJT 600W", trackerType: "Agrivoltaic Elevated 4M", inverterBrand: "Power Electronics FREIA 5000", landArea: 800, origin: "NTPC SPRINGEL Noida Warehouse", site: "Neemuch Agrivoltaic Pilot Farm", state: "Madhya Pradesh", mode: "Crane Truck 25T Pile Driver", prodDate: "2025-02-18", shipDate: "2025-02-21", transitDays: 2, contractValue: 950000000, mountingType: "Agrivoltaic Elevated", status: "Commercial Operation COD Achieved", remarks: "NTPC 100MW Neemuch agrivoltaic elevated HJT dual use farming COD achieved" },
  { id: "SFC-0005", batchNo: "BAT-AP/PVG/2025/04-005", developer: "Azure Power Gurugram", zone: "Karnataka Pavagada Tumkur", category: "300MW Thin Film CdTe Utility", description: "300MW Thin Film CdTe 420W Utility Scale Ground Mount Pavagada", capacityMW: 300, panelType: "Thin Film CdTe 420W", trackerType: "Fixed Tilt Structure", inverterBrand: "Ingeteam INGECON", landArea: 1800, origin: "First Solar Malaysia Factory Import", site: "Pavagada Solar Park Tumkur Phase-III", state: "Karnataka", mode: "Rail Flat Wagon Panel Bulk", prodDate: "2025-04-01", shipDate: "2025-04-08", transitDays: 4, contractValue: 1800000000, mountingType: "Ground Mount Fixed", status: "Inverter PCS Commissioning QC", remarks: "Azure 300MW Pavagada thin film CdTe utility inverter PCS commissioning QC" },
  { id: "SFC-0006", batchNo: "BAT-RW/GRG/2025/01-006", developer: "ReNew Power Noida", zone: "Andhra Pradesh Kurnool Anantapur", category: "50MW Rooftop C&I Distributed", description: "50MW Rooftop C&I Distributed TOPCon 610W Industrial Solar Kurnool", capacityMW: 50, panelType: "TOPCon 610W", trackerType: "Fixed Tilt Structure", inverterBrand: "Huawei SUN2000 215KTL", landArea: 200, origin: "ReNew Power Solar Factory Greater Noida", site: "Kurnool Industrial Zone C&I Rooftop", state: "Andhra Pradesh", mode: "Flatbed Trailer 40T Panel Stack", prodDate: "2025-01-15", shipDate: "2025-01-17", transitDays: 1, contractValue: 450000000, mountingType: "Rooftop Ballasted", status: "Grid Connectivity Testing Active", remarks: "ReNew 50MW Kurnool C&I rooftop TOPCon grid connectivity testing active" },
  { id: "SFC-0007", batchNo: "BAT-GK/HYD/2025/06-007", developer: "Greenko Energy Hyderabad", zone: "Telangana Mahabubnagar", category: "150MW CPV Concentrator Pilot", description: "150MW CPV Concentrator Pilot Mono PERC 540W High Efficiency Mahabubnagar", capacityMW: 150, panelType: "Mono PERC 540W", trackerType: "Dual Axis Arctech", inverterBrand: "SMA Sunny Central 5MW", landArea: 900, origin: "Greenko Integrated Solar Factory Hyderabad", site: "Mahabubnagar CPV Concentrator Pilot Plant", state: "Telangana", mode: "Crane Truck 25T Pile Driver", prodDate: "2025-06-02", shipDate: "2025-06-04", transitDays: 1, contractValue: 1350000000, mountingType: "Ground Mount Fixed", status: "Pile Foundation Driving Active", remarks: "Greenko 150MW Mahabubnagar CPV concentrator pilot Mono PERC pile driving" },
  { id: "SFC-0008", batchNo: "BAT-VS/KOL/2025/03-008", developer: "Vikram Solar Kolkata", zone: "Rajasthan Bhadla Jaisalmer Jodhpur", category: "500MW Mono PERC Tracker Mount", description: "500MW Mono PERC 540W NEXTracker Jaisalmer Solar Park Phase-II", capacityMW: 500, panelType: "Mono PERC 540W", trackerType: "Single Axis NEXTracker", inverterBrand: "TMEIC SC1000", landArea: 2800, origin: "Vikram Solar Falta SEZ Kolkata", site: "Jaisalmer Solar Park Phase-II Bhadla", state: "Rajasthan", mode: "Rail Flat Wagon Panel Bulk", prodDate: "2025-03-10", shipDate: "2025-03-16", transitDays: 4, contractValue: 4200000000, mountingType: "Single Axis Tracker", status: "Commercial Operation COD Achieved", remarks: "Vikram 500MW Jaisalmer Mono PERC NEXTracker Phase-II COD achieved operational" },
  { id: "SFC-0009", batchNo: "BAT-AG/BHD/2025/05-009", developer: "Adani Green Energy Mumbai", zone: "Gujarat Kutch Patan Banaskantha", category: "250MW Bifacial Dual Glass Fixed", description: "250MW Bifacial 585W Dual Glass Ground Mount Kutch Solar Extension", capacityMW: 250, panelType: "Bifacial 585W", trackerType: "Fixed Tilt Structure", inverterBrand: "Power Electronics FREIA 5000", landArea: 1400, origin: "Adani Solar Mundra Factory Gujarat", site: "Kutch Solar Extension Banaskantha", state: "Gujarat", mode: "Lowboy Trailer 80T Transformer", prodDate: "2025-05-12", shipDate: "2025-05-14", transitDays: 1, contractValue: 2200000000, mountingType: "Ground Mount Fixed", status: "Grid Connectivity Testing Active", remarks: "Adani 250MW Kutch bifacial dual glass grid connectivity testing active" },
  { id: "SFC-0010", batchNo: "BAT-RP/JMN/2025/04-010", developer: "Reliance Power Jamnagar", zone: "Karnataka Pavagada Tumkur", category: "300MW Thin Film CdTe Utility", description: "300MW Thin Film CdTe 420W Fixed Tilt Pavagada Expansion Block-II", capacityMW: 300, panelType: "Thin Film CdTe 420W", trackerType: "Fixed Tilt Structure", inverterBrand: "Ingeteam INGECON", landArea: 2000, origin: "First Solar Vietnam Factory Import", site: "Pavagada Solar Park Expansion Tumkur", state: "Karnataka", mode: "River Barge 2000T Inverter", prodDate: "2025-04-18", shipDate: "2025-04-24", transitDays: 3, contractValue: 1950000000, mountingType: "Ground Mount Fixed", status: "Tracker Structure Assembly Transit", remarks: "Reliance 300MW Pavagada thin film CdTe tracker structure assembly transit" },
  { id: "SFC-0011", batchNo: "BAT-TP/RMN/2025/06-011", developer: "Tata Power Solar Delhi", zone: "Tamil Nadu Ramanathapuram Tuticorin", category: "Solar Inverter 5MW String PCS", description: "Solar Inverter 5MW String PCS Huawei SUN2000 Batch Tuticorin Plant", capacityMW: 75, panelType: "TOPCon 610W", trackerType: "Single Axis NEXTracker", inverterBrand: "Huawei SUN2000 215KTL", landArea: 500, origin: "Tata Power Electronics Pune Factory", site: "Tuticorin Solar Plant Inverter Yard", state: "Tamil Nadu", mode: "Lowboy Trailer 80T Transformer", prodDate: "2025-06-10", shipDate: "2025-06-12", transitDays: 1, contractValue: 680000000, mountingType: "Single Axis Tracker", status: "Inverter PCS Commissioning QC", remarks: "Tata 75MW Tuticorin inverter PCS Huawei SUN2000 commissioning QC active" },
  { id: "SFC-0012", batchNo: "BAT-NP/NNC/2025/05-012", developer: "NTPC Renewable Noida", zone: "Madhya Pradesh Neemuch Mandsaur", category: "100MW Agrivoltaic Elevated", description: "100MW Agrivoltaic Elevated 4M Bifacial 585W Mandsaur Farm Phase-II", capacityMW: 100, panelType: "Bifacial 585W", trackerType: "Agrivoltaic Elevated 4M", inverterBrand: "SMA Sunny Central 5MW", landArea: 750, origin: "NTPC SPRINGEL Noida Warehouse", site: "Mandsaur Agrivoltaic Phase-II Farm", state: "Madhya Pradesh", mode: "Multi-Axle 60T Tracker Frame", prodDate: "2025-05-20", shipDate: "2025-05-23", transitDays: 2, contractValue: 920000000, mountingType: "Agrivoltaic Elevated", status: "Panel Mounting Wiring In Progress", remarks: "NTPC 100MW Mandsaur agrivoltaic bifacial elevated panel wiring in progress" },
  { id: "SFC-0013", batchNo: "BAT-AP/GRG/2025/04-013", developer: "Azure Power Gurugram", zone: "Andhra Pradesh Kurnool Anantapur", category: "500MW Mono PERC Tracker Mount", description: "500MW Mono PERC 540W Single Axis NEXTracker Anantapur Ultra Mega", capacityMW: 500, panelType: "Mono PERC 540W", trackerType: "Single Axis NEXTracker", inverterBrand: "TMEIC SC1000", landArea: 3000, origin: "Azure Power Module Factory Gurugram", site: "Anantapur Ultra Mega Solar Park", state: "Andhra Pradesh", mode: "Rail Flat Wagon Panel Bulk", prodDate: "2025-04-05", shipDate: "2025-04-11", transitDays: 4, contractValue: 4100000000, mountingType: "Single Axis Tracker", status: "Tracker Structure Assembly Transit", remarks: "Azure 500MW Anantapur Mono PERC NEXTracker ultra mega assembly transit" },
  { id: "SFC-0014", batchNo: "BAT-RW/HYD/2025/05-014", developer: "ReNew Power Noida", zone: "Telangana Mahabubnagar", category: "150MW CPV Concentrator Pilot", description: "150MW CPV Concentrator Pilot HJT 600W Dual Axis Mahabubnagar Phase-II", capacityMW: 150, panelType: "HJT 600W", trackerType: "Dual Axis Arctech", inverterBrand: "Power Electronics FREIA 5000", landArea: 950, origin: "ReNew Power Manufacturing Noida", site: "Mahabubnagar CPV Pilot Phase-II", state: "Telangana", mode: "Flatbed Trailer 40T Panel Stack", prodDate: "2025-05-08", shipDate: "2025-05-11", transitDays: 2, contractValue: 1280000000, mountingType: "Ground Mount Fixed", status: "Grid Connectivity Testing Active", remarks: "ReNew 150MW Mahabubnagar CPV HJT dual axis grid connectivity testing active" },
];

const totalCapacity = records.reduce((s, r) => s + r.capacityMW, 0);
const underConstruction = records.filter(r => ["Pile Foundation Driving Active", "Tracker Structure Assembly Transit", "Panel Mounting Wiring In Progress", "Inverter PCS Commissioning QC", "Grid Connectivity Testing Active"].includes(r.status)).length;
const codOperational = records.filter(r => r.status === "Commercial Operation COD Achieved").length;
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

const kpis = [
  { l: "Total Capacity (MW)", v: totalCapacity.toLocaleString("en-IN"), s: "across all batches" },
  { l: "Under Construction", v: underConstruction, s: "active sites" },
  { l: "COD Operational", v: codOperational, s: "commissioned" },
  { l: "Total Contract Value", v: formatINRCr(totalContract), s: "cumulative" },
];

const INSIGHTS = [
  {
    t: "India 280 GW Solar Target by 2030: Current 85 GW Installed, 195 GW Gap",
    c: "India has set an ambitious target of 280 GW solar power capacity by 2030 under the National Solar Mission, part of the broader 500 GW renewable energy goal (including 140 GW wind). As of 2024, India has installed approximately 85 GW of solar capacity, making it the world's 4th largest solar power producer. The country needs to add nearly 195 GW in the next 6 years, requiring 32-33 GW annual additions (vs current 15-18 GW/year). Key policy drivers: (a) PM Surya Ghar Muft Bijli Yojana: rooftop solar subsidy for 1 crore households, (b) Production Linked Incentive (PLI) for solar manufacturing: \u20b924,000 crore allocation for 40 GW polysilicon-to-module manufacturing, (c) Solar Park scheme: 50 solar parks with aggregate 40 GW capacity, (d) ISTS (Inter-State Transmission System) waiver for solar/wind projects. India's top solar states: Rajasthan (18 GW), Gujarat (15 GW), Karnataka (10 GW), Tamil Nadu (8 GW), Maharashtra (7 GW), Madhya Pradesh (6 GW), Andhra Pradesh (5 GW), Telangana (5 GW). Major solar developers driving the pipeline: Adani Green Energy (largest, 10+ GW operational), Reliance Power (ambitious 10 GW plan), Tata Power Solar (legacy player, 5+ GW), NTPC Renewable (government utility, 8 GW target), Azure Power (2 GW), ReNew Power (7 GW), Greenko Energy (5 GW), Vikram Solar (manufacturing + EPC). The construction logistics challenge is enormous: each GW requires approximately 2,500 acres of land, 1.8-2.0 million panels, 200 inverters, 50,000 tonnes of structural steel, and 2,000 km of DC cabling. Transportation of panels from factories (Gujarat, Tamil Nadu, Karnataka) to solar parks (Rajasthan, MP, AP) involves 500-1500 km logistics chains using flatbed trailers, rail wagons, and multi-axle vehicles.",
  },
  {
    t: "Bhadla Solar Park Rajasthan: World's Largest at 2,245 MW, Setting Global Benchmarks",
    c: "Bhadla Solar Park in Jaisalmer district, Rajasthan is the world's largest solar park with a total installed capacity of 2,245 MW spread across 14,000 acres (57 km\u00b2) of arid desert land. Developed by Rajasthan Solar Park Development Corporation Limited (RSPDCL) under the Ministry of New and Renewable Energy (MNRE) solar park scheme. The park was developed in 4 phases: Phase-I (260 MW), Phase-II (680 MW), Phase-III (500 MW), and Phase-IV (805 MW). Key developers: (a) Adani Green Energy: 850 MW, (b) SB Energy/ReNew: 600 MW, (c) Azure Power: 200 MW, (d) Hero Future Energies: 150 MW, (e) Vikram Solar: 150 MW. Bhadla achieved the world's lowest solar tariff at \u20b92.44/kWh in 2020 (Adani bid), making it a global benchmark. The park features: single-axis NEXTracker and Arctech Solar tracker systems (15-25% generation boost), Mono PERC and Bifacial panel technology, SMA and TMEIC central inverters, 400 kV/220 kV pooling substations. Construction logistics: panel delivery from Adani Solar Mundra (400 km), Tata Solar Bangalore (1,500 km), Vikram Solar Kolkata (1,200 km) via flatbed trailers and rail wagons on Jodhpur-Jaisalmer line. Foundation: rammed earth piles to 3-4 meter depth. Bhadla generates approximately 5,500 million units annually, powering 3 million households, avoiding 4.5 million tonnes CO2 per year. Rajasthan is planning additional solar parks at Jodhpur, Barmer, and Bikaner targeting 30 GW total by 2028.",
  },
  {
    t: "Floating Solar on Reservoirs: Kerala, Rihand Dam, and India's 2 GW Potential",
    c: "India has an estimated 2 GW potential for floating solar photovoltaic (FSPV) installations on reservoirs, lakes, and water bodies. NTPC has been the pioneer, commissioning India's largest floating solar plant at Rihand Dam (Uttar Pradesh) with 150 MW capacity on a 1,500-acre reservoir. Kerala leads in floating solar innovation with projects on Vembanad Lake backwaters and Idukki reservoir. Key advantages: (a) No land acquisition needed (India's biggest challenge for ground-mount solar), (b) 5-10% higher efficiency due to water cooling effect, (c) Reduced water evaporation from reservoirs (10-15% reduction), (d) Reduced algae growth. India's floating solar pipeline: NTPC Rihand Dam 150 MW operational + 350 MW Phase-II, NTPC Kayamkulam 92 MW operational, NHPC Omkareshwar 100 MW under construction. Construction logistics for floating solar are unique: HDPE pontoons shipped via river barges, marine-grade anchoring systems, underwater cabling with marine cable plows, onshore inverter stations with subaquatic HVDC connection. HJT 600W panels are preferred for floating due to higher efficiency and better temperature coefficient. Floating solar cost: \u20b95.5-7.0 Cr/MW vs \u20b93.5-4.5 Cr/MW for ground-mount, but avoided land cost and water conservation justify the premium. India's total reservoir surface area is approximately 18,000 sq km, with potential for 10-15 GW of floating solar. SECI has issued multiple tenders for floating solar, targeting 10 GW by 2030.",
  },
  {
    t: "Agrivoltaics: Combining Farming with Solar Power Generation for Dual Income",
    c: "Agrivoltaics (agri-PV or agricultural photovoltaics) is the co-location of solar panels with agriculture on the same land, enabling farmers to earn dual income from both crop cultivation and solar power generation. India has over 140 million hectares of agricultural land, with an estimated 10-15 GW agrivoltaic potential on 2-3 million hectares (2% of farmland). MNRE has launched a pilot programme for agrivoltaics with \u20b950 crore allocation, targeting 100 MW pilot projects across 10 states. NTPC has commissioned India's first large-scale agrivoltaic project at Neemuch, Madhya Pradesh (100 MW) using elevated 4-meter structures allowing tractors to pass underneath. Key design parameters: (a) Panel height: 3.5-4.0 meters (vs 0.5-1.0m for ground-mount), (b) Row spacing: 8-10 meters (vs 4-5m for conventional), (c) Panel transparency: semi-transparent panels (emerging tech) allowing partial sunlight for crops, (d) Mounting: elevated steel structures with reinforced foundations for agricultural vehicle loads. Crops suited for agrivoltaics: shade-tolerant vegetables (tomato, capsicum, leafy greens), pulses (moong, urad), spices (turmeric, ginger), medicinal plants (ashwagandha, tulsi), and floriculture (roses, marigold). Studies show 15-20% crop yield reduction under panels (due to shade) but 60-70% additional income from solar power sales, netting farmers 40-50% higher total income per acre. Advantages for construction logistics: (a) Land already owned by farmers (no land acquisition), (b) Existing road access to farmland, (c) Smaller individual projects (1-10 MW) spread across many sites, (d) Reduced environmental opposition. Challenges: (a) Higher structural steel cost (elevated structures: 30-40% more steel), (b) Cable routing under farmland, (c) Irrigation system coordination, (d) Crop damage risk during construction. India's leading agrivoltaic states: Madhya Pradesh (NTPC Neemuch), Maharashtra (pilot in Nashik), Rajasthan (pilot in Jodhpur), Karnataka (ICAR-Bengaluru research farm). Global leaders: Japan (Chiba Prefecture, 200+ MW), France (10% of new solar is agrivoltaic), Germany (550 MW installed), China (largest agrivoltaic base at 1.2 GW in Ningxia). India targets 5 GW agrivoltaic by 2030 under the National Agrivoltaic Mission (proposed).",
  },
];

export default function SolarFarmConstructionLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "developer", label: "Developer", options: DEVELOPERS.map(d => ({ value: d, count: records.filter(r => r.developer === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "mountingType", label: "Mounting", options: [...new Set(records.map(r => r.mountingType))].map(m => ({ value: m, count: records.filter(r => r.mountingType === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.developer.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.origin.toLowerCase().includes(q) && !r.site.toLowerCase().includes(q) && !r.state.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof SolarRecord] as string));
  });

  const renderDashboardCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="sfc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Installation by Type (MW)</h3><BarChart data={monthlyInstall} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="utility" fill="#92400e" radius={[4,4,0,0]} name="Utility" /><Bar dataKey="rooftop" fill="#d97706" radius={[4,4,0,0]} name="Rooftop" /><Bar dataKey="floating" fill="#f59e0b" radius={[4,4,0,0]} name="Floating" /><Bar dataKey="agri" fill="#fbbf24" radius={[4,4,0,0]} name="Agrivoltaic" /></BarChart></div>
        <div className="sfc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Technology Distribution (%)</h3><PieChart width={400} height={220}><Pie data={techDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="sfc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost per MW (Cr) vs Target \u20b93.5Cr/MW</h3><LineChart data={costPerMW} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[2.5, 4.5]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#92400e" strokeWidth={2} name="Actual Cost/MW (Cr)" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target \u20b93.5Cr/MW" /></LineChart></div>
        <div className="sfc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Developer Pipeline Capacity (MW)</h3><BarChart data={developerCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#b45309" radius={[4,4,0,0]} name="Capacity MW" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="sfc-root p-6 space-y-6">
      <PageHeader title="Solar Farm Construction Logistics" description="Indian solar farm construction logistics covering Adani Reliance Tata NTPC Azure ReNew Greenko Vikram developers, Mono PERC Bifacial HJT Thin Film TOPCon panels, NEXTracker Arctech floating agrivoltaic mounting, SMA Huawei TMEIC Power Electronics inverters, Rajasthan Bhadla Gujarat Kutch Tamil Nadu Karnataka Pavagada zones" />
      <div className="sfc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`sfc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#92400e] text-white" : "text-gray-600 hover:bg-amber-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="sfc-dash space-y-6">
          <div className="sfc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="sfc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 sfc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#92400e] sfc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 sfc-kpi-sub">{k.s}</div></div>))}
          </div>
          {renderDashboardCharts()}
        </div>
      )}

      {tab === 1 && (
        <div className="sfc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Solar Construction", href: "#" }, { label: "Equipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="sfc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Batch No,Developer,Zone,Category,Description,Capacity (MW),Panel Type,Tracker,Inverter,Area (ac),Origin,Site,State,Mode,Prod Date,Ship Date,Transit (d),Contract (\u20b9),Mounting,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "slate";
              const rowCls = rowHighlight[sc] || "";
              return (<tr key={r.id} className={`border-b hover:bg-amber-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="sfc-badge inline-block px-2 py-0.5 rounded text-xs bg-[#92400e] text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.developer}</td>
                <td className="px-3 py-2"><span className="sfc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="sfc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.capacityMW}</td>
                <td className="px-3 py-2 text-xs">{r.panelType}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.trackerType}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.inverterBrand}</td>
                <td className="px-3 py-2 text-xs text-right">{r.landArea.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.site}</td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 4 ? "text-red-600" : r.transitDays >= 2 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#92400e]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2"><span className="sfc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.mountingType}</span></td>
                <td className="px-3 py-2"><span className={`sfc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[sc]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="sfc-analytics space-y-6">
          <ModuleBreadcrumb items={[{ label: "Solar Construction", href: "#" }, { label: "Construction Analytics", href: "#" }]} />
          {renderDashboardCharts()}
        </div>
      )}

      {tab === 3 && (
        <div className="sfc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="sfc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#92400e] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
