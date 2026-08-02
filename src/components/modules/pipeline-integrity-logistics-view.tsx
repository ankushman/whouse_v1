"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0c4a6e", "#075985", "#0369a1", "#0284c7", "#0ea5e9", "#0a3d62", "#0e4d6e", "#38bdf8"];
const ORIGINS = ["GAIL Vijaipur MP Pipeline", "HPCL Mumbai Mangalore Line", "IOCL Vadodara Dabhol Pipeline", "ONGC Mumbai High URAN Trunk", "GSPL Kakinada Chennai Gas Line", "IGL Delhi NCR Gas Network", "PLL Dahej Uran Pipeline", "EIL Kochi Mangalore Refinery"];
const CATEGORIES = ["ERW Steel Pipe 24inch", "LSAW Welded 48inch", "SSAW Spiral Weld 36inch", "Coating 3LPE FBE Joint", "Smart Pig ILI Inspection", "SCADA Valve Actuator",("Compressor Station Module"), "Emergency Pipe Clamp"];
const SHIPMENT_STATUSES = ["Mill Dispatch Verified", "Transit Rail Flatbed", "Right-of-Way Cleared", "Trenching Laying Welding", "Hydro Test Pending NDT", "Commissioning Gas In"];
const ZONES = ["West India Gujarat Belt", "South India TN-Kerala Coast", "North India NCR Punjab", "East India Odisha Bengal", "Central India MP Chhattisgarh", "NE India Assam Tripura"];
const MODES = ["Rail Flatbed 60T", ("Pipe Spool Trailer"), "Barge Coastal Inland", "Heavy Haul Truck 40T", "Helicopter Sling Remote", "Multi-Modal Rail-Road"];
const TABS = ["Dashboard", "Shipment Registry", "Pipeline Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Mill Dispatch Verified": "green", "Transit Rail Flatbed": "blue", "Right-of-Way Cleared": "amber", "Trenching Laying Welding": "orange", "Hydro Test Pending NDT": "red", "Commissioning Gas In": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyPipe = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], gas: ri(8, 25, 15 + Math.sin(i * 0.5) * 5), crude: ri(5, 18, 10 + Math.cos(i * 0.6) * 4), product: ri(4, 12, 7 + Math.sin(i * 0.7) * 3), water: ri(2, 8, 5 + Math.cos(i * 0.8) * 2) }));
const categoryDist = [{ n: "ERW Steel Pipe", v: 28 }, { n: "LSAW Welded", v: 22 }, { n: "SSAW Spiral", v: 15 }, { n: "3LPE Coating", v: 14 }, { n: "Smart Pig ILI", v: 10 }, { n: "SCADA Valve", v: 6 }, { n: "Compressor", v: 3 }, { n: "Pipe Clamp", v: 2 }];
const integrityScore = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(94, 99.5, 97 + Math.sin(i * 0.4) * 1.5)).toFixed(1), target: 98 }));
const segmentPerf = ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(88, 98, 94 + Math.random() * 2.5).toFixed(0) }));

interface PipeRecord { id: string; consignmentNo: string; origin: string; zone: string; category: string; description: string; weight: number; diameter: string; operator: string; project: string; segment: string; mode: string; dispatchDate: string; etaDate: string; transitDays: number; valueLakhs: number; riskLevel: string; status: string; remarks: string; }

const records: PipeRecord[] = [
  { id: "PIL-0001", consignmentNo: "CON/GAIL/VJP/2025/07-8921", origin: "GAIL Vijaipur MP Pipeline", zone: "Central India MP Chhattisgarh", category: "ERW Steel Pipe 24inch", description: "SAIL ERW 24inch API 5L X70 12mm Wall Pipe", weight: 4500, diameter: "24inch/610mm", operator: "GAIL India Ltd", project: "Vijaipur Bhatinda Gas Pipeline", segment: "Vijaipur - Bhopal 180km KP0-KP180", mode: "Rail Flatbed 60T", dispatchDate: "2025-07-06", etaDate: "2025-07-10", transitDays: 4, valueLakhs: 285, riskLevel: "MED", status: "Trenching Laying Welding", remarks: "SAIL ERW 24inch X70 GAIL Vijaipur Bhatinda gas pipeline trenching KP0-180" },
  { id: "PIL-0002", consignmentNo: "CON/HPCL/BOM/2025/07-3456", origin: "HPCL Mumbai Mangalore Line", zone: "West India Gujarat Belt", category: "LSAW Welded 48inch", description: "Jindal SAW LSAW 48inch API 5L X80 15mm Wall", weight: 12000, diameter: "48inch/1219mm", operator: "HPCL Refineries Ltd", project: "Mangalore Chennai Petroleum Pipeline", segment: "Mangalore - Hassan 145km KP0-KP145", mode: "Heavy Haul Truck 40T", dispatchDate: "2025-07-08", etaDate: "2025-07-12", transitDays: 4, valueLakhs: 620, riskLevel: "HIGH", status: "Right-of-Way Cleared", remarks: "Jindal LSAW 48inch X80 HPCL Mangalore Chennai pipeline RoW cleared Hassan" },
  { id: "PIL-0003", consignmentNo: "CON/IOCL/VDH/2025/07-6789", origin: "IOCL Vadodara Dabhol Pipeline", zone: "West India Gujarat Belt", category: "Coating 3LPE FBE Joint", description: "3LPE Coating Field Joint 36inch FBE Primer", weight: 800, diameter: "36inch/914mm", operator: "Indian Oil Corp Ltd", project: "Vadodara Dabhol LPG Pipeline", segment: "Vadodara - Surat 160km KP0-KP160", mode: "Pipe Spool Trailer", dispatchDate: "2025-07-07", etaDate: "2025-07-09", transitDays: 2, valueLakhs: 45, riskLevel: "LOW", status: "Mill Dispatch Verified", remarks: "3LPE FBE field joint coating IOCL Vadodara Dabhol LPG pipeline coating" },
  { id: "PIL-0004", consignmentNo: "CON/ONGC/UMB/2025/07-1234", origin: "ONGC Mumbai High URAN Trunk", zone: "West India Gujarat Belt", category: "Smart Pig ILI Inspection", description: "ROSEN 24inch MFL ILI Smart Pig Tool", weight: 2500, diameter: "24inch/610mm", operator: "ONGC Videsh Ltd", project: "Uran Trombay Offshore Gas Trunk", segment: "Uran - Trombay 85km KP0-KP85", mode: "Barge Coastal Inland", dispatchDate: "2025-07-05", etaDate: "2025-07-08", transitDays: 3, valueLakhs: 180, riskLevel: "HIGH", status: "Hydro Test Pending NDT", remarks: "ROSEN MFL smart pig ILI inspection ONGC Uran Trombay offshore trunk hydro test" },
  { id: "PIL-0005", consignmentNo: "CON/GSPL/KKN/2025/07-5678", origin: "GSPL Kakinada Chennai Gas Line", zone: "East India Odisha Bengal", category: "SSAW Spiral Weld 36inch", description: "Welspun SSAW 36inch API 5L X65 14mm Spiral", weight: 7200, diameter: "36inch/914mm", operator: "GSPL Gujarat State Petronet", project: "Kakinada Chennai Gas Pipeline Phase-2", segment: "Vizag - Vijayawada 200km KP200-KP400", mode: "Multi-Modal Rail-Road", dispatchDate: "2025-07-09", etaDate: "2025-07-15", transitDays: 6, valueLakhs: 480, riskLevel: "MED", status: "Transit Rail Flatbed", remarks: "Welspun SSAW 36inch X65 GSPL Kakinada Chennai gas pipeline rail transit" },
  { id: "PIL-0006", consignmentNo: "CON/IGL/NCR/2025/07-9012", origin: "IGL Delhi NCR Gas Network", zone: "North India NCR Punjab", category: "SCADA Valve Actuator", description: "Rotork SCADA Electric Actuator 24inch", weight: 350, diameter: "24inch/610mm", operator: "Indraprastha Gas Ltd", project: "Delhi NCR CGD City Gas Network", segment: "Gurgaon - Faridabad 45km City Loop", mode: "Heavy Haul Truck 40T", dispatchDate: "2025-07-10", etaDate: "2025-07-11", transitDays: 1, valueLakhs: 85, riskLevel: "LOW", status: "Commissioning Gas In", remarks: "Rotork SCADA actuator IGL Delhi NCR CGD network city gas commissioning" },
  { id: "PIL-0007", consignmentNo: "CON/PLL/DAH/2025/07-2345", origin: "PLL Dahej Uran Pipeline", zone: "West India Gujarat Belt", category: "Compressor Station Module", description: "Siemens SGT-100 Gas Compressor Unit 15MW", weight: 85000, diameter: "N/A Station", operator: "Petronet LNG Ltd", project: "Dahej Uran LNG Receiving Pipeline", segment: "Dahej LNG Terminal Compressor Station", mode: "Heavy Haul Truck 40T", dispatchDate: "2025-07-06", etaDate: "2025-07-14", transitDays: 8, valueLakhs: 2200, riskLevel: "HIGH", status: "Trenching Laying Welding", remarks: "Siemens 15MW compressor Petronet Dahej Uran LNG pipeline station installation" },
  { id: "PIL-0008", consignmentNo: "CON/EIL/KCH/2025/07-7890", origin: "EIL Kochi Mangalore Refinery", zone: "South India TN-Kerala Coast", category: "Emergency Pipe Clamp", description: "Split Repair Sleeve 30inch 12mm Emergency Clamp", weight: 280, diameter: "30inch/762mm", operator: "BPCL Kochi Refinery", project: "Kochi Mangalore Refinery Product Line", segment: "Mangalore - Puttur 60km KP120-KP180", mode: "Helicopter Sling Remote", dispatchDate: "2025-07-11", etaDate: "2025-07-11", transitDays: 0.5, valueLakhs: 12, riskLevel: "HIGH", status: "Commissioning Gas In", remarks: "Emergency repair sleeve clamp BPCL Kochi Mangalore product line copter emergency" },
  { id: "PIL-0009", consignmentNo: "CON/GAIL/VJP/2025/07-4321", origin: "GAIL Vijaipur MP Pipeline", zone: "Central India MP Chhattisgarh", category: "ERW Steel Pipe 24inch", description: "Maharashtra Seamless ERW 24inch API 5L X70 10mm", weight: 3800, diameter: "24inch/610mm", operator: "GAIL India Ltd", project: "Vijaipur Bhatinda Gas Pipeline Phase-2", segment: "Bhopal - Bina 120km KP180-KP300", mode: "Rail Flatbed 60T", dispatchDate: "2025-07-10", etaDate: "2025-07-13", transitDays: 3, valueLakhs: 240, riskLevel: "MED", status: "Mill Dispatch Verified", remarks: "Maha Seamless ERW 24inch X70 GAIL Vijaipur Bhatinda phase-2 Bhopal Bina" },
  { id: "PIL-0010", consignmentNo: "CON/HPCL/BOM/2025/07-8765", origin: "HPCL Mumbai Mangalore Line", zone: "South India TN-Kerala Coast", category: "Coating 3LPE FBE Joint", description: "3LPE Coating 48inch Pipeline External 3-Layer PE", weight: 600, diameter: "48inch/1219mm", operator: "HPCL Refineries Ltd", project: "Mangalore Chennai Petroleum Pipeline", segment: "Hassan - Bangalore 180km KP145-KP325", mode: "Pipe Spool Trailer", dispatchDate: "2025-07-09", etaDate: "2025-07-12", transitDays: 3, valueLakhs: 55, riskLevel: "LOW", status: "Transit Rail Flatbed", remarks: "3LPE coating HPCL Mangalore Chennai 48inch pipeline Hassan Bangalore transit" },
  { id: "PIL-0011", consignmentNo: "CON/IOCL/VDH/2025/07-5432", origin: "IOCL Vadodara Dabhol Pipeline", zone: "West India Gujarat Belt", category: "SCADA Valve Actuator", description: "Emerson DeltaV SCADA Gate Valve 36inch", weight: 1200, diameter: "36inch/914mm", operator: "Indian Oil Corp Ltd", project: "Vadodara Dabhol LPG Pipeline", segment: "Surat - Dabhol 220km KP160-KP380", mode: "Heavy Haul Truck 40T", dispatchDate: "2025-07-08", etaDate: "2025-07-11", transitDays: 3, valueLakhs: 125, riskLevel: "MED", status: "Right-of-Way Cleared", remarks: "Emerson DeltaV SCADA gate valve IOCL Vadodara Dabhol LPG Surat Dabhol RoW" },
  { id: "PIL-0012", consignmentNo: "CON/ONGC/UMB/2025/07-1098", origin: "ONGC Mumbai High URAN Trunk", zone: "West India Gujarat Belt", category: "LSAW Welded 48inch", description: "ESAB LSAW 48inch Offshore Subsea 22mm WT", weight: 15000, diameter: "48inch/1219mm", operator: "ONGC Videsh Ltd", project: "Mumbai High South West Pipeline", segment: "MH SW - UMT 210km Offshore KP0-KP210", mode: "Barge Coastal Inland", dispatchDate: "2025-07-07", etaDate: "2025-07-16", transitDays: 9, valueLakhs: 950, riskLevel: "HIGH", status: "Hydro Test Pending NDT", remarks: "ESAB 48inch subsea LSAW ONGC Mumbai High offshore pipeline hydro test" },
  { id: "PIL-0013", consignmentNo: "CON/GSPL/KKN/2025/07-6543", origin: "GSPL Kakinada Chennai Gas Line", zone: "East India Odisha Bengal", category: "Smart Pig ILI Inspection", description: "BJ MFL+Caliper 36inch ILI Combo Pig", weight: 3200, diameter: "36inch/914mm", operator: "GSPL Gujarat State Petronet", project: "Kakinada Chennai Gas Pipeline Phase-1", segment: "Kakinada - Vizag 200km KP0-KP200", mode: "Pipe Spool Trailer", dispatchDate: "2025-07-11", etaDate: "2025-07-14", transitDays: 3, valueLakhs: 210, riskLevel: "MED", status: "Trenching Laying Welding", remarks: "BJ combo MFL caliper pig ILI GSPL Kakinada Vizag gas pipeline inspection" },
  { id: "PIL-0014", consignmentNo: "CON/IGL/NCR/2025/07-8765", origin: "IGL Delhi NCR Gas Network", zone: "North India NCR Punjab", category: "SSAW Spiral Weld 36inch", description: "Man Industries SSAW 12inch API 5L X52 CGD", weight: 1800, diameter: "12inch/324mm", operator: "Indraprastha Gas Ltd", project: "Delhi NCR CGD Phase-3 Expansion", segment: "Noida - Ghaziabad 25km Branch Line", mode: "Heavy Haul Truck 40T", dispatchDate: "2025-07-10", etaDate: "2025-07-11", transitDays: 1, valueLakhs: 95, riskLevel: "LOW", status: "Commissioning Gas In", remarks: "Man SSAW 12inch X52 IGL Delhi NCR CGD phase-3 Noida Ghaziabad commissioning" },
];

const transitCount = records.filter(rec => rec.status === "Transit Rail Flatbed").length;
const workCount = records.filter(rec => rec.status === "Trenching Laying Welding" || rec.status === "Hydro Test Pending NDT").length;
const liveCount = records.filter(rec => rec.status === "Mill Dispatch Verified" || rec.status === "Commissioning Gas In").length;
const totalValue = records.reduce((s, rec) => s + rec.valueLakhs, 0);

const kpis = [
  { l: "In Transit", v: transitCount, s: "rail/road active" },
  { l: "Welding/NDT", v: workCount, s: "construction" },
  { l: "Dispatched/Live", v: liveCount, s: "verified/gas-in" },
  { l: "Total Pipe Value", v: `\u20b9${(totalValue / 100).toFixed(1)}Cr`, s: "all segments" },
];

const INSIGHTS = [
  {
    t: "India Pipeline Network: 33,000+ km Gas/Oil/Product Lines, Rs 8,00,000 Crore Infrastructure",
    c: "India has the world\u2019s 6th largest pipeline network (33,000+ km operational, 15,000+ km under construction), valued at \u20b98,00,000 crore (USD 100 billion). Major operators: (1) GAIL India: 17,000+ km natural gas pipeline (HVJ: Hazira-Vijaipur-Jagdishpur 1,640km, Vijaipur-Bhatinda 1,100km, Dadri-Bawana-Nangal 610km, Kochi-Koottanad-Bangalore-Mangalore 1,050km, Dabhol-Bangalore 1,000km under construction). GAIL processes 215 MMSCMD (million standard cubic meters/day) gas. (2) IOCL (Indian Oil Corporation): 15,000+ km product/crude pipeline network. Major: Salaya-Mathura (1,452km crude), Paradip-Haldia (720km crude), Koyali-Surat 330km, Mundra-Delhi 1,050km crude). Product pipelines carry petrol/diesel/jet fuel/ATF. (3) HPCL: 4,000+ km product pipeline (Mumbai-Pune 250km, Visakhapatnam-Secunderabad 550km, Mangalore-Chennai 640km, Mundra-Panipat 1,130km). (4) ONGC: 5,000+ km offshore/onshore crude gas pipeline network. Mumbai High offshore: 2,500+ km subsea pipelines (12-48inch diameter). (5) Oil India Ltd (OIL): 3,000+ km in Northeast India (Assam, Arunachal, Tripura). (6) GSPL: 2,500+ km (Gujarat state gas grid: Mehsana-Bhatinda 1,610km). (7) CGD operators (IGL, MGL, GGL, TGL, AGTL): 25,000+ km city gas distribution network (20-300mm PE/alloy steel pipes). India\u2019s pipeline construction: (a) Average 4,000-6,000 km/year new pipeline laid (target 8,000 km/year by 2027 under National Gas Grid). (b) Steel consumption: 5-8 million tonnes/year for pipeline construction (API 5L X42-X80 grade). Major pipe mills: SAIL (Bhilai, Rourkela), Jindal SAW (Kandla, Mundra), Welspun (Anjar, Dahej), Maharashtra Seamless (Raigad), Man Industries (Ankleshwar, Mundra). India\u2019s annual pipe production: 6 million tonnes (50% exported). Pipeline right-of-way (RoW): 30m width for main transmission line (land acquisition under Petroleum Pipelines Act 1962, PNGRB regulations). Average cost: \u20b98-15 crore per km for 24inch gas pipeline (including pipe, coating, welding, RoW, valves, SCADA). India\u2019s pipeline safety: 15-25 incidents/year (corrosion, third-party damage, landslides). Fatalities: 5-10/year. Most incidents: corrosion (40%), third-party excavation (30%), natural hazard (15%), equipment failure (10%), human error (5%).",
  },
  {
    t: "Pipeline Integrity Management: Smart Pig ILI, Corrosion Monitoring, NDT Hydro Testing",
    c: "India\u2019s pipeline integrity management follows ASME B31.8 (gas) and ASME B31.4 (liquid) standards, regulated by PNGRB (Petroleum and Natural Gas Regulatory Board). Key integrity activities: (1) Smart Pig ILI (In-Line Inspection): MFL (Magnetic Flux Leakage) for internal/external corrosion detection, Caliper pig for geometry (dents, ovality), UT (Ultrasonic) for wall thickness mapping. Frequency: gas pipelines every 5-7 years, liquid pipelines every 3-5 years. Major ILI vendors in India: ROSEN (Germany, dominant 60% market), BJ Services (Halliburton), Pipetech (Oman), T.D. Williamson (USA). India runs 150+ ILI runs per year. Cost: \u20b920-50 lakh per run (24inch, 200km). GAIL runs 40+ ILI runs/year on its 17,000 km network. (2) Corrosion monitoring: (a) External corrosion: CP (cathodic protection) with impressed current system (ICCP) and sacrificial anodes (zinc/magnesium). India: 95% of buried pipelines have CP. Potential monitoring: -850mV minimum (Cu/CuSO4 reference). (b) Internal corrosion: inhibitor injection ( filming amine), batch treatment, corrosion coupons (weight loss), ER (electrical resistance) probes. (c) Coating: 3LPE (3-layer polyethylene) for onshore, FBE (fusion bonded epoxy) for high-temp sections, concrete weight coating for subsea. India coating plants: Jindal SAW (Kandla, Mundra), Welspun (Anjar), BSP (Bhilai). (3) NDT (Non-Destructive Testing): radiography (X-ray/gamma ray) for weld joint inspection (100% for class-1 pipelines, 10% spot for class-3). Ultrasonic testing (UT) for weld defects. Dye penetrant testing (DPT) for surface cracks. Magnetic particle testing (MPT) for fillet welds. India has 500+ NDT companies (TCS, L&T, Shapoorji, RITES). (4) Hydro testing: after pipeline construction, hydrostatic test at 1.25x MAOP (maximum allowable operating pressure) for 8-24 hours. Pressure: 75-100 bar for gas pipeline (24-48inch). Leak detection: drop in pressure >0.1 bar/hour = leak. India: 500+ hydro tests per year. (5) Pipeline leak detection: SCADA-based mass balance, real-time transient model (RTTM), acoustic monitoring (fiber optic DAS - distributed acoustic sensing). India: IOCL uses FiberSense DAS on 3,000 km (world\u2019s largest deployment). Response time: <5 minutes for detection, <30 minutes for isolation.",
  },
  {
    t: "Pipeline Construction: Trenching, Horizontal Directional Drilling, Welding, Valve Stations",
    c: "India\u2019s pipeline construction workflow: (1) Survey and RoW: route survey (aerial + ground), land acquisition (30m width, 5,000+ km under acquisition), environmental clearance (MoEFCC, 12-18 months), forest clearance (if crossing forest land, 6-12 months). (2) Trenching: (a) Open cut trenching: backhoe/excavator 1.5-3m depth (depth of cover: 1m minimum for cropland, 1.5m for road crossing, 3m for river crossing). India: 50,000+ km trenching completed. (b) HDD (Horizontal Directional Drilling): for river, road, railway crossings. Drill diameter: 600-1500mm, length: 200-1500m. India: 200+ HDD crossings per year (major: Ganga 1,100m HDD, Brahmaputra 1,400m HDD). HDD contractors: HDD India, NMC, TATA Projects, L&T. Cost: \u20b95-20 crore per HDD crossing. (c) Microtunneling: for urban/urban crossings (shallow depth, 100-500m). (d) Thrust boring: for highway/railway crossings (50-200m, 200-600mm diameter). (3) Pipe welding: (a) GTAW (root pass) + SMAW/GMAW (fill + cap) for carbon steel. (b) Automated welding (CRC-Evans, PWT, Serimer Dasa) for large-diameter (>36inch) long-distance pipelines. India: 30+ automated welding crews (GAIL, IOCL, HPCL). Welding rate: 80-120 joints/day for manual, 200-300 for automated. Weld inspection: 100% NDT (X-ray/UT). Joint failure rate: <0.1% (India industry average). (4) Valve stations: (a) Main line valve (MLV): every 15-30 km (isolation). Ball valve or gate valve (24-48inch). India: 1,000+ MLVs installed on major pipelines. (b) Block valve station (BVS): at river crossing, compressor/tank farm, city gate. (c) Check valve: prevent backflow at elevation changes. (d) Pressure regulating station: reduce pressure for CGD network. (5) Compressor/pump stations: (a) Gas compressor stations every 150-250 km on gas pipeline. Compressor types: centrifugal (Siemens, GE, Solar Turbines), reciprocating (Ariel, Cooper). India: 80+ compressor stations (GAIL: 35+, IOCL: 20+, ONGC: 15+). Power: 10-30 MW per station. (b) Pumping stations every 80-150 km on product/crude pipeline. Centrifugal pumps (Flowserve, KSB, Kirloskar). India: 60+ pumping stations. (6) SCADA/telecommunication: fiber optic cable laid alongside pipeline (24-96 core). RTU (Remote Terminal Unit) at each valve station. Data transmitted to control center (GAIL: Noida, IOCL: Mumbai, HPCL: Mumbai). India: 100% SCADA coverage on major pipelines.",
  },
  {
    t: "India Pipeline Future: National Gas Grid, Hydrogen Blend, Subsea Deepwater, Digital Twin",
    c: "India\u2019s pipeline infrastructure roadmap 2025-2030: (1) National Gas Grid (NGG): target 33,500 km gas pipeline by 2030 (from 22,000 km in 2024). New projects: (a) GAIL Jagdishpur-Haldia (2,050km under construction, \u20b912,000 crore), (b) GAIL Barmer-Gurugram (1,100km, \u20b96,000 crore), (c) GAIL Kakinada-Chennai (1,200km phase-2), (d) GAIL Dabhol-Bangalore (1,000km), (e) GSPL Mehsana-Bhatinda (1,610km completed), (f) IOCL Paradip-Haldia expansion (720km). Total capex: \u20b91,20,000 crore. (2) CGD expansion: PNGRB targets 280+ GA (Geographical Areas) covering 70% of India\u2019s population by 2030 (from 232 GA in 2024). New connections: 10 crore (100 million) households (from 3.5 crore in 2024). CGD pipeline: 50,000+ km by 2030 (from 25,000 km). CNG stations: 10,000+ (from 4,500). PNG (domestic) connections: 4 crore (from 1 crore). Major CGD operators: IGL (Delhi), MGL (Mumbai), GGL (Gujarat), TGL (Tripura), AGTL (Adani Total, 50+ GA, largest CGD operator). (3) Hydrogen blending: India targets 5% green hydrogen blend in natural gas pipelines by 2028, 15% by 2035. Challenges: hydrogen embrittlement of carbon steel (needs X52-X70 max, not X80), seal/elastomer compatibility. Pilot: IOCL Mathura refinery (3% H2 blend, 2024), GAIL Vijaipur (5% blend planned 2025). Pipeline modification for H2: \u20b92-5 crore per km (uprating pipe material, valves, compressors). (4) Subsea deepwater pipeline: ONGC KG-D6 (Krishna Godavari deepwater), OAL (ONGC Assam Lakwa). India\u2019s deepest: KG-D6 at 1,200m water depth (48inch, 700km). Future: ONGC deepwater blocks in Arabian Sea (1,500-3,000m depth). (5) Digital twin: IOCL deployed digital twin on Salaya-Mathura crude pipeline (1,452km) in 2024 \u2014 real-time pressure, temperature, flow, corrosion model overlay. GAIL planning digital twin for entire 17,000 km network by 2028. Technology: Aveva (UK), Bentley Systems, Siemens MindSphere. Cost: \u20b950-100 crore per major pipeline digital twin. (6) Pipeline safety: PNGRB mandating fiber optic DAS (Distributed Acoustic Sensing) on all new pipelines (>100km). India target: 15,000 km DAS-protected by 2030. Drone patrol: weekly aerial inspection of pipeline RoW ( trespasser detection, encroachment, leak spotting). India: 50,000+ drone patrol hours/year on pipelines (GAIL, IOCL, HPCL). India\u2019s pipeline integrity spend: \u20b915,000 crore/year (inspection + maintenance + rehabilitation).",
  },
];

export default function PipelineIntegrityLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "mode", label: "Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.consignmentNo.toLowerCase().includes(q) && !r.origin.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof PipeRecord] as string));
  });

  return (
    <div className="pil-root p-6 space-y-6">
      <PageHeader title="Pipeline Integrity Logistics" description="India pipeline integrity management covering GAIL IOCL HPCL ONGC GSPL IGL, gas crude product pipeline, ERW LSAW SSAW steel pipe, 3LPE FBE coating, smart pig ILI inspection, SCADA valve actuator, hydro test NDT, HDD trenching welding" />
      <div className="pil-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`pil-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-sky-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="pil-dash space-y-6">
          <div className="pil-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="pil-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 pil-kpi-label">{k.l}</div><div className="text-2xl font-bold text-sky-700 pil-kpi-val">{k.v}</div><div className="text-xs text-gray-400 pil-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="pil-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Pipe Shipments (km Equiv)</h3><BarChart data={monthlyPipe} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="gas" fill="#0c4a6e" radius={[4,4,0,0]} name="Gas" /><Bar dataKey="crude" fill="#075985" radius={[4,4,0,0]} name="Crude" /><Bar dataKey="product" fill="#0369a1" radius={[4,4,0,0]} name="Product" /><Bar dataKey="water" fill="#0ea5e9" radius={[4,4,0,0]} name="Water" /></BarChart></div>
            <div className="pil-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Pipe Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="pil-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Pipeline Integrity Score (%) vs 98% Target</h3><LineChart data={integrityScore} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[92, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0c4a6e" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="pil-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Segment Integrity by Zone (%)</h3><BarChart data={segmentPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[85, 100]} /><Tooltip /><Bar dataKey="v" fill="#075985" radius={[4,4,0,0]} name="Integrity %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="pil-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Pipeline Integrity", href: "#" }, { label: "Shipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="pil-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Consignment No,Origin,Zone,Category,Description,Weight (kg),Diameter,Operator,Project,Segment,Mode,Dispatch,ETA,Transit (d),Value (\u20b9L),Risk,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Hydro Test Pending NDT" ? "pil-row-critical bg-red-50 border-l-4 border-l-red-500" : r.status === "Trenching Laying Welding" ? "pil-row-warning bg-amber-50 border-l-4 border-l-amber-500" : r.status === "Transit Rail Flatbed" ? "pil-row-info bg-blue-50 border-l-4 border-l-blue-500" : "";
              return (<tr key={r.id} className={`border-b hover:bg-sky-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="pil-badge inline-block px-2 py-0.5 rounded text-xs bg-sky-700 text-white font-mono text-[10px]">{r.consignmentNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.origin}</td>
                <td className="px-3 py-2"><span className="pil-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="pil-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.weight >= 1000 ? `${(r.weight/1000).toFixed(1)}T` : `${r.weight}kg`}</td>
                <td className="px-3 py-2 text-xs">{r.diameter}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.operator}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.project}</td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.segment}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 7 ? "text-red-600" : r.transitDays >= 3 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-sky-700">{`\u20b9${r.valueLakhs}L`}</td>
                <td className="px-3 py-2 text-center">{r.riskLevel === "HIGH" ? <span className="pil-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">HIGH</span> : r.riskLevel === "MED" ? <span className="pil-badge inline-block px-2 py-0.5 rounded text-xs bg-amber-500 text-white">MED</span> : <span className="pil-badge inline-block px-2 py-0.5 rounded text-xs bg-green-600 text-white">LOW</span>}</td>
                <td className="px-3 py-2"><span className={`pil-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="pil-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="pil-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Pipe Volume by Zone</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(10, 35, 20 + Math.random() * 8).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0c4a6e" radius={[4,4,0,0]} name="Shipments" /></BarChart></div>
            <div className="pil-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Volume by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], erw: ri(6, 18, 10 + Math.sin(i*0.5)*3), lsaw: ri(4, 14, 8 + Math.cos(i*0.6)*3), ssaw: ri(2, 10, 5 + Math.sin(i*0.7)*2) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="erw" stackId="1" stroke="#0c4a6e" fill="#38bdf8" name="ERW" /><Area type="monotone" dataKey="lsaw" stackId="1" stroke="#075985" fill="#0ea5e9" name="LSAW" /><Area type="monotone" dataKey="ssaw" stackId="1" stroke="#0369a1" fill="#0284c7" name="SSAW" /></AreaChart></div>
          </div>
          <div className="pil-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Mode</h3><BarChart data={[{n:"Rail Flatbed",v:3.5},{n:"Pipe Trailer",v:2.5},{n:"Barge",v:5},{n:"Heavy Truck",v:3},{n:"Helicopter",v:0.5},{n:"Multi-Modal",v:5.5}].map(d => ({...d, v: +ri(d.v*0.7, d.v*1.3, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#075985" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="pil-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="pil-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-sky-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
