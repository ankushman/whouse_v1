"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1e3a5f", "#264e73", "#2e6389", "#3b82a8", "#0c2340", "#1a3550", "#234b68", "#5ba3c9"];
const TERMINALS = ["JNPT Mumbai Nhava Sheva", "Chennai Container Terminal", "Kandla Port Trust Gujarat", "Vizag VCTPL Visakhapatnam", "Mundra Adani Port Gujarat", "Paradip Port Odisha", "Kolkata Haldia Dock", "Cochin Willingdon Island"];
const CATEGORIES = ["TEU 40ft Container Import", "TEU 20ft Container Export", ("Break Bulk Steel Coil"), "Bulk Grain Wheat Rice", "Liquid Chemical IBC Tank", "Oversize Project Cargo", "Reefer Cold Storage", "RoRo Car Vehicle"];
const SHIPMENT_STATUSES = ["Vessel Arrived Pilot Boarded", "Berthed Crane Operations", "Container Discharged Unloaded", "Customs BOE Cleared", "Gate Out Truck Loaded", "ICD Rail Dispatched"];
const ZONES = ["West India Mumbai Gujarat", "South India Chennai Cochin", "East India Kolkata Vizag", "North India Delhi ICD", "Central India Nagpur ICD", "NE India Assam Corridor"];
const MODES = ["Gantry Crane STS QC", ("Reach Stacker"), "Straddle Carrier SC", "RTG Rail Mounted Gantry", "Tractor Trailer 40T", "Rail Flat Wagon"];
const TABS = ["Dashboard", "Cargo Registry", "Terminal Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Vessel Arrived Pilot Boarded": "blue", "Berthed Crane Operations": "amber", "Container Discharged Unloaded": "orange", "Customs BOE Cleared": "slate", "Gate Out Truck Loaded": "green", "ICD Rail Dispatched": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyTEU = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], import40: ri(8, 25, 15 + Math.sin(i * 0.5) * 5), export40: ri(6, 20, 12 + Math.cos(i * 0.6) * 4), import20: ri(5, 15, 8 + Math.sin(i * 0.7) * 3), bulk: ri(3, 10, 5 + Math.cos(i * 0.8) * 2) }));
const categoryDist = [{ n: "40ft Import", v: 32 }, { n: "40ft Export", v: 25 }, { n: "20ft Import", v: 18 }, { n: "Break Bulk", v: 10 }, { n: "Bulk Grain", v: 7 }, { n: "Liquid Chemical", v: 4 }, { n: "Reefer", v: 2.5 }, { n: "RoRo Vehicle", v: 1.5 }];
const berthUtil = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(72, 92, 82 + Math.sin(i * 0.4) * 5)).toFixed(1), target: 85 }));
const termPerf = TERMINALS.map(t => ({ n: t.split(" ").slice(0, 2).join(" "), v: +ri(70, 95, 85 + Math.random() * 5).toFixed(0) }));

interface CargoRecord { id: string; billNo: string; terminal: string; zone: string; category: string; description: string; weight: number; teu: string; vessel: string; shipping: string; destination: string; mode: string; arrivalDate: string; dischargeDate: string; dwellDays: number; valueLakhs: number; cargoType: string; status: string; remarks: string; }

const records: CargoRecord[] = [
  { id: "PTO-0001", billNo: "B/L-JNP/2025/07-89123", terminal: "JNPT Mumbai Nhava Sheva", zone: "West India Mumbai Gujarat", category: "TEU 40ft Container Import", description: "Maersk 40ft HC Container Electronics", weight: 18000, teu: "1x40ft HC", vessel: "Maersk Elba MV-2845", shipping: "Maersk Line India", destination: "Delhi ICD Patparganj", mode: "Tractor Trailer 40T", arrivalDate: "2025-07-08", dischargeDate: "2025-07-10", dwellDays: 3, valueLakhs: 450, cargoType: "FCL", status: "Customs BOE Cleared", remarks: "Maersk Elba JNPT 40ft electronics Delhi ICD customs cleared BOE" },
  { id: "PTO-0002", billNo: "B/L-CHN/2025/07-56789", terminal: "Chennai Container Terminal", zone: "South India Chennai Cochin", category: "TEU 20ft Container Export", description: "Hapag 20ft GP Container Textiles", weight: 22000, teu: "1x20ft GP", vessel: "Hapag Express MV-1123", shipping: "Hapag-Lloyd India", destination: "Hamburg Germany", mode: "Gantry Crane STS QC", arrivalDate: "2025-07-07", dischargeDate: "2025-07-08", dwellDays: 2, valueLakhs: 280, cargoType: "FCL", status: "Gate Out Truck Loaded", remarks: "Hapag 20ft textiles export Chennai Hamburg Germany gate out loaded" },
  { id: "PTO-0003", billNo: "B/L-KDL/2025/07-34567", terminal: "Kandla Port Trust Gujarat", zone: "West India Mumbai Gujarat", category: "Break Bulk Steel Coil", description: "SAIL Hot Rolled Steel Coil 15MT", weight: 15000, teu: "Break Bulk", vessel: "MV Starlight Bulk", shipping: "Scindia Steam Bombay", destination: "Ahmedabad Steel Depot", mode: "Reach Stacker", arrivalDate: "2025-07-09", dischargeDate: "2025-07-12", dwellDays: 4, valueLakhs: 85, cargoType: "BB", status: "Container Discharged Unloaded", remarks: "SAIL HR coil Kandla break bulk Ahmedabad steel depot discharge" },
  { id: "PTO-0004", billNo: "B/L-VZG/2025/07-90123", terminal: "Vizag VCTPL Visakhapatnam", zone: "East India Kolkata Vizag", category: "Bulk Grain Wheat Rice", description: "FCI Rice 5000MT Bulk Carrier", weight: 5000000, teu: "Bulk 5000MT", vessel: "MV Jagadamba Rice", shipping: "Shipping Corp India", destination: "Kolkata FCI Warehouse", mode: "Gantry Crane STS QC", arrivalDate: "2025-07-06", dischargeDate: "2025-07-11", dwellDays: 6, valueLakhs: 1500, cargoType: "Bulk", status: "Berthed Crane Operations", remarks: "FCI rice 5000MT Vizag bulk carrier Kolkata FCI berthing crane ops" },
  { id: "PTO-0005", billNo: "B/L-MUN/2025/07-23456", terminal: "Mundra Adani Port Gujarat", zone: "West India Mumbai Gujarat", category: "Liquid Chemical IBC Tank", description: "Reliance IBC 1000L Methanol Tank ISO", weight: 1200, teu: "1x20ft Tank", vessel: "MV Chemical Pioneer", shipping: "Adani Logistics", destination: "Vadodara Reliance Refinery", mode: "Straddle Carrier SC", arrivalDate: "2025-07-10", dischargeDate: "2025-07-11", dwellDays: 2, valueLakhs: 45, cargoType: "HazChem", status: "Vessel Arrived Pilot Boarded", remarks: "Reliance methanol IBC tank Mundra Vadodara refinery pilot boarded" },
  { id: "PTO-0006", billNo: "B/L-PRD/2025/07-78901", terminal: "Paradip Port Odisha", zone: "East India Kolkata Vizag", category: "Oversize Project Cargo", description: "L&T Wind Turbine Nacelle 80T ODC", weight: 80000, teu: "Oversize 80T", vessel: "MV Heavy Lift Fortune", shipping: "Samsara Heavy Lift", destination: "Onshore Wind Farm Odisha", mode: "Gantry Crane STS QC", arrivalDate: "2025-07-05", dischargeDate: "2025-07-09", dwellDays: 5, valueLakhs: 320, cargoType: "ODC", status: "Berthed Crane Operations", remarks: "L&T nacelle 80T Paradip oversize wind turbine project cargo berthing" },
  { id: "PTO-0007", billNo: "B/L-KOL/2025/07-67890", terminal: "Kolkata Haldia Dock", zone: "East India Kolkata Vizag", category: "Reefer Cold Storage", description: "Cold Ex Mango Pulp -18C 40ft Reefer", weight: 20000, teu: "1x40ft Reefer", vessel: "MV Cold Star Pacific", shipping: "Ocean Network Express", destination: "Haldia Cold Storage Warehouse", mode: "RTG Rail Mounted Gantry", arrivalDate: "2025-07-11", dischargeDate: "2025-07-12", dwellDays: 2, valueLakhs: 120, cargoType: "Reefer", status: "ICD Rail Dispatched", remarks: "Cold Ex mango pulp -18C reefer Kolkata Haldia cold storage dispatched" },
  { id: "PTO-0008", billNo: "B/L-CCH/2025/07-43210", terminal: "Cochin Willingdon Island", zone: "South India Chennai Cochin", category: "RoRo Car Vehicle", description: "Toyota Fortuner Cars 6-unit RoRo", weight: 18000, teu: "RoRo 6 cars", vessel: "MV Höegh Autocarrier", shipping: "Höegh Autoliners", destination: "Cochin Toyota Dealership", mode: "Gantry Crane STS QC", arrivalDate: "2025-07-10", dischargeDate: "2025-07-11", dwellDays: 1, valueLakhs: 180, cargoType: "RoRo", status: "Gate Out Truck Loaded", remarks: "Toyota Fortuner 6-unit RoRo Cochin dealership gate out vehicle" },
  { id: "PTO-0009", billNo: "B/L-JNP/2025/07-10987", terminal: "JNPT Mumbai Nhava Sheva", zone: "West India Mumbai Gujarat", category: "TEU 40ft Container Import", description: "CMA CGM 40ft Container Machinery Auto Parts", weight: 16000, teu: "1x40ft GP", vessel: "CMA CGM Marco Polo", shipping: "CMA CGM India", destination: "Pune ICD Chakan", mode: "Tractor Trailer 40T", arrivalDate: "2025-07-09", dischargeDate: "2025-07-10", dwellDays: 2, valueLakhs: 520, cargoType: "FCL", status: "Customs BOE Cleared", remarks: "CMA CGM 40ft machinery auto parts JNPT Pune ICD customs BOE" },
  { id: "PTO-0010", billNo: "B/L-CHN/2025/07-87654", terminal: "Chennai Container Terminal", zone: "South India Chennai Cochin", category: "TEU 20ft Container Export", description: "MSC 20ft Leather Garments Chennai", weight: 14000, teu: "1x20ft GP", vessel: "MSC Sindh MV-4521", shipping: "MSC India", destination: "Rotterdam Netherlands", mode: "Gantry Crane STS QC", arrivalDate: "2025-07-08", dischargeDate: "2025-07-09", dwellDays: 1, valueLakhs: 95, cargoType: "FCL", status: "Gate Out Truck Loaded", remarks: "MSC 20ft leather garments Chennai export Rotterdam gate out" },
  { id: "PTO-0011", billNo: "B/L-MUN/2025/07-54321", terminal: "Mundra Adani Port Gujarat", zone: "West India Mumbai Gujarat", category: "TEU 40ft Container Import", description: "Evergreen 40ft HC Container Consumer Goods", weight: 21000, teu: "1x40ft HC", vessel: "Evergreen Ever Urge MV-7890", shipping: "Evergreen Marine India", destination: "Nagpur ICD Butibori", mode: "Rail Flat Wagon", arrivalDate: "2025-07-10", dischargeDate: "2025-07-13", dwellDays: 4, valueLakhs: 380, cargoType: "FCL", status: "Container Discharged Unloaded", remarks: "Evergreen 40ft HC consumer goods Mundra Nagpur ICD rail discharge" },
  { id: "PTO-0012", billNo: "B/L-VZG/2025/07-65432", terminal: "Vizag VCTPL Visakhapatnam", zone: "East India Kolkata Vizag", category: "Break Bulk Steel Coil", description: "Tata Steel CRCA Coil 12MT Export", weight: 12000, teu: "Break Bulk", vessel: "MV Steel Horizon", shipping: "Shreyas Shipping", destination: "Singapore Steel Mills", mode: "Reach Stacker", arrivalDate: "2025-07-11", dischargeDate: "2025-07-12", dwellDays: 1, valueLakhs: 72, cargoType: "BB", status: "Gate Out Truck Loaded", remarks: "Tata CRCA coil 12MT Vizag break bulk export Singapore loaded" },
  { id: "PTO-0013", billNo: "B/L-PRD/2025/07-21098", terminal: "Paradip Port Odisha", zone: "East India Kolkata Vizag", category: "Bulk Grain Wheat Rice", description: "FCI Wheat 3000MT Break Bulk Stevedoring", weight: 3000000, teu: "Bulk 3000MT", vessel: "MV Food Grain Express", shipping: "Food Corp India Shipping", destination: "Varanasi FCI Depot Rail", mode: "RTG Rail Mounted Gantry", arrivalDate: "2025-07-07", dischargeDate: "2025-07-10", dwellDays: 4, valueLakhs: 900, cargoType: "Bulk", status: "ICD Rail Dispatched", remarks: "FCI wheat 3000MT Paradip Varanasi FCI rail dispatch stevedoring" },
  { id: "PTO-0014", billNo: "B/L-KDL/2025/07-98765", terminal: "Kandla Port Trust Gujarat", zone: "West India Mumbai Gujarat", category: "Liquid Chemical IBC Tank", description: "Gujarat Alkali Caustic Soda 25MT ISO Tank", weight: 25000, teu: "1x20ft Tank", vessel: "MV Chemroad Voyager", shipping: "Chemroad Shipping Japan", destination: "Surat Chemical Industrial Area", mode: "Straddle Carrier SC", arrivalDate: "2025-07-12", dischargeDate: "2025-07-13", dwellDays: 2, valueLakhs: 32, cargoType: "HazChem", status: "Vessel Arrived Pilot Boarded", remarks: "Gujarat Alkali caustic soda ISO tank Kandla Surat chemical pilot boarded" },
];

const transitCount = records.filter(rec => rec.status === "Container Discharged Unloaded" || rec.status === "Berthed Crane Operations").length;
const workCount = records.filter(rec => rec.status === "Customs BOE Cleared" || rec.status === "Vessel Arrived Pilot Boarded").length;
const liveCount = records.filter(rec => rec.status === "Gate Out Truck Loaded" || rec.status === "ICD Rail Dispatched").length;
const totalValue = records.reduce((s, rec) => s + rec.valueLakhs, 0);

const kpis = [
  { l: "Berth/Crane Ops", v: transitCount, s: "discharge active" },
  { l: "Customs/Vessel", v: workCount, s: "clearance/pilot" },
  { l: "Gate/Rail Out", v: liveCount, s: "dispatched" },
  { l: "Total Cargo Value", v: `\u20b9${(totalValue / 100).toFixed(1)}Cr`, s: "all terminals" },
];

const INSIGHTS = [
  {
    t: "India Port Infrastructure: 12 Major Ports, 212 Minor Ports, 1,600+ MT Annual Throughput",
    c: "India has the world\u2019s 16th largest port network handling 1,600+ million tonnes (MT) of cargo annually (2023-24). Major ports (under Ministry of Ports, Shipping and Waterways): 12 government-owned (JNPT Mumbai, Chennai, Kolkata/Haldia, Visakhapatnam, Paradip, Kandla, Cochin, Mumbai Port, New Mangalore, Tuticorin, Ennore Kamarajar, V.O. Chidambaranar). Minor ports: 200+ (state government + private, including Adani Mundra, Adani Hazira, DP World Cochin, APM Terminals Mumbai, PSA Chennai). India\u2019s top container ports: (1) JNPT (Nhava Sheva): India\u2019s largest container port, 5.6 million TEU/year (2024), 4 container terminals (JNPT CT, NSICT/GTCDPL, APM Maersk, DP World Bharat Mumbai). Cranes: 35+ STS (shore-to-ship) gantry cranes, 80+ RTG (rubber-tired gantry), 150+ reach stackers, 500+ tractor-trailers. (2) Chennai Port (Chennai Container Terminal + CCTPL): 1.8 million TEU/year, 3 terminals, deepest draft in India (16.5m). (3) Mundra Port (Adani Ports): 1.6 million TEU/year, India\u2019s largest private port, 3 container terminals, coal terminal 60 MT, LNG terminal 5 MMT. (4) Visakhapatnam (VCTPL): 0.8 million TEU/year, growing 15%+ CAGR. India\u2019s total container throughput: 12-14 million TEU/year (2024), growing 8-10% CAGR. India\u2019s port equipment: STS cranes (Panamax to Post-Panamax), QC (quay crane) 40-65T capacity, RTG 40T, RMG (rail-mounted gantry), reach stacker 45T, straddle carrier 40T, empty container handler 10T, forklifts 3-16T. Major terminal operators: DP World (3 terminals), APM Terminals (2 terminals), PSA International (2 terminals), Adani Ports (5 terminals), COSCO (1 terminal). India\u2019s vessel traffic: 20,000+ vessel calls/year at major ports. Turnaround time: 2.5-4 days at major ports (vs 1-2 days at Singapore, Shanghai). India\u2019s port connectivity: Dedicated Freight Corridors (Western DFC 1,504km to JNPT/Mundra, Eastern DFC 1,856km to Kolkata/Haldia) + 8,000+ km rail siding to ports + 5,000+ km port-connected highways. India\u2019s port capex: \u20b93,00,000 crore under Sagarmala Project (2020-2035): new ports, deepening drafts, LNG terminals, cruise terminals, transshipment hub (Vizhinjam Kerala, Great Nicobar Andaman).",
  },
  {
    t: "Port Terminal Operations: STS Cranes, RTG, Reach Stacker, Customs BOE, Container Logistics",
    c: "India\u2019s port terminal operations workflow: (1) Vessel arrival: pilot boards vessel 2-5 nautical miles from port (pilotage by port trust). Vessel berthed at container terminal (berth allocation by terminal operator). Average berthing wait: 12-48 hours at major Indian ports (vs 4-8 hours at Singapore/Dubai). (2) Container discharge: STS (Ship-to-Shore) gantry cranes unload containers from vessel cells. Cycle time: 90-120 seconds per container (2-min moves). Rate: 25-35 moves/hour/crane. JNPT: 6-8 cranes per vessel, discharge 2,000-4,000 TEU/day. Equipment: STS cranes (Liebhhar, ZPMC China, Konecranes Finland), QC (quay crane), rail-mounted gantry (RMG) for rail loading. (3) Yard operations: unloaded containers placed in yard blocks by RTG (rubber-tired gantry) or RMG. Yard density: 8-10 high stack (1-over-5 to 1-over-8). India average: 5-6 high (limited by crane height). Grounding: import containers grounded (placed on chassis or yard), export containers delivered to yard before vessel arrival (CY cut-off: 24-48 hours before ETA). (4) Customs clearance: BOE (Bill of Entry) filed by customs broker electronically through ICEGATE (Indian Customs EDI Gateway). ICEGATE processes 15+ million BOE entries/year. Assessment: self-assessment (most cargo), physical examination for select consignments (X-ray scanning + manual: 5-10% of imports). Dwell time: 3-7 days average at major ports (vs 1-2 days at Singapore). India government target: 48-hour dwell time by 2027 (Sagarmala initiative). (5) Gate-out: container loaded on tractor-trailer (40T capacity) or rail flat wagon (2x20ft or 1x40ft per wagon). India: 60% containers move by road (truck), 40% by rail (ICD movement). Rail: CONCOR (Container Corporation of India) operates 70+ ICDs (Inland Container Depots) connected to ports by rail. Major ICDs: Tughlakabad Delhi, Patparganj Delhi, Nagpur Butibori, Pune Chakan, Ahmedabad, Ludhiana, Kolkata. (6) Empty container management: India has 2-3 million TEU empty container moves/year (repositioning imbalance: import-heavy ports like JNPT have surplus empties, export-heavy like Chennai need empties). Cost: \u20b93,000-5,000 per empty move. India\u2019s reefer operations: 500,000+ TEU reefer containers/year (pharma, food, chemicals). Reefer plugs: 8,000+ at major ports. Temperature monitoring: -25\u00b0C to +25\u00b0C. Power backup: 100% diesel generator at port (grid unreliable). India\u2019s liquid cargo: Kandla, Mundra, Chennai handle 40+ MT of liquid chemicals/year (IBCs, ISO tanks, flexitanks). Specialized terminals: IOC, BPCL, HPCL own liquid jetties.",
  },
  {
    t: "India Port Connectivity: DFC Rail, EXIM Trade Corridors, Coastal Shipping, Inland Waterways",
    c: "India\u2019s port logistics connectivity: (1) Dedicated Freight Corridors (DFC): (a) Western DFC (1,504km): JNPT/Mundra to Dadri (Delhi NCR). Double-stack container trains (3.5m height), 1,500T per train, 150 km/h. Capacity: 35% of India\u2019s container rail traffic. JNPT-Dadri: 48-hour transit (vs 5-7 days by road). (b) Eastern DFC (1,856km): Kolkata/Haldia to Ludhiana. Coal, steel, container. Operational 2024. India\u2019s container rail: 6-7 million TEU/year (CONCOR 4+ million, private operators 2-3 million). Rail share of port container: 40% (target 50% by 2027). (2) Port road connectivity: (a) NHAI port-connectivity highways: 5,000+ km of 4-6 lane highways connecting ports to hinterland. Examples: JNPT to Mumbai-Pune Expressway, Mundra to NH8, Chennai to NH5 (Golden Quadrilateral). (b) Last-mile connectivity: port trust roads (often congested, 2-4 lane). Mumbai port area: 6-8 km of port roads with 15,000+ truck movements/day. (c) Truck fleet: India has 8 million+ trucks (Tata, Ashok Leyland, Eicher, BharatBenz). Container trucks: 500,000+ (40T trailers). (3) Coastal shipping (Indian Coastal Conference): India\u2019s 7,500km coastline enables coastal movement of containers and bulk. Ministry aims for 10% of domestic cargo by coastal shipping (from 5% today). Vessels: 60+ coastal container ships (500-2,000 TEU). Major coastal routes: Kandla-Mundra-Mumbai, Chennai-Vizag-Kolkata, Cochin-Mangalore. Cost: 40-60% cheaper than road per tonne-km. India coastal cargo: 150 MT/year (coal, cement, steel, containers). (4) Inland waterways: India declared 111 National Waterways (NW). Major: NW-1 Ganga (Haldia to Varanasi, 1,620km, operational), NW-2 Brahmaputra (891km), NW-3 Kerala backwaters (205km). Barges: 500-3,000T capacity. Cost: 30-50% cheaper than rail. India inland water cargo: 30 MT/year (target 200 MT by 2047). (5) EXIM trade corridors: (a) Trans-Pacific: India to USA/Canada (JNPT, Mundra, Chennai to Los Angeles, Long Beach, Vancouver). Transit: 20-25 days. (b) Asia-Europe: India to Rotterdam, Hamburg, Felixstowe via Suez Canal. Transit: 16-20 days. (c) Middle East: India to Jebel Ali, Dammam, Jeddah. Transit: 5-7 days. India\u2019s top trade partners: China (15% of trade), USA (12%), UAE (10%), Saudi Arabia (6%), Iraq (5%). India\u2019s total EXIM trade: USD 1,200 billion (2024). Containerization: 70% of India\u2019s trade by value moves in containers.",
  },
  {
    t: "Future of India Ports: Vizhinjam Transshipment, Smart Port Automation, Green Shipping, Sagarmala",
    c: "India\u2019s port infrastructure vision 2025-2035: (1) Vizhinjam Transshipment Port (Kerala): India\u2019s first major transshipment hub (operational 2024, phase-1 1.4 million TEU, phase-2 3.2 million TEU by 2028). 18m draft (deepest in India), natural deep water, can handle 24,000 TEU mega vessels (current largest: MSC Irina 24,462 TEU). Benefits: India saves \u20b92,000 crore/year in transshipment fees (currently 75% of India\u2019s transshipment goes through Colombo, Singapore, Port Klang). Vizhinjam operator: Adani Ports (30-year concession). (2) Great Nicobar Island Port (Andaman): strategic transshipment + naval base (proposed, \u20b940,000 crore, 2025-2045). 20m draft, 15 million TEU capacity (competing with Singapore). (3) Smart port automation: (a) TOC (Terminal Operating System): Navis N4 (used at JNPT, Mundra, Chennai), COSMOS (legacy at some terminals). Integration with customs ICEGATE, port community system, RFID-based truck appointment. (b) Automated equipment: ASC (Automated Stacking Cranes) at JNPT Terminal 4 (pilot), AGV (Automated Guided Vehicles) at Mundra Terminal 3. India target: 3-4 fully automated terminals by 2030. (c) OCR container recognition: camera-based container ID reading at gate (99% accuracy, replacing manual check). India: 20+ gates with OCR (JNPT, Mundra, Chennai). (d) Blockchain: pilot at JNPT for trade documentation (B/L, customs BOE, certificate of origin on blockchain). (4) Green shipping: (a) IMO 2030 target: 40% CO2 reduction. India ports: onshore power supply (OPS) for vessels at berth (JNPT, Mundra pilot \u2014 \u20b950 crore project). Vessels switch off diesel engines, connect to grid power. (b) LNG bunkering: Kandla, Mumbai, Chennai developing LNG bunkering facilities (for LNG-fueled vessels). (c) Shore power: 15 ports implementing OPS by 2030. (d) Port waste management: MARPOL convention \u2014 ship-generated waste reception facilities at all major ports. India: \u20b9500 crore spent on port waste management (2020-2025). (5) Sagarmala Project: \u20b93,00,000 crore (2020-2035). Components: (a) Port modernization (new berths, deeper drafts, container terminals): \u20b91,00,000 crore. (b) Port connectivity (rail, road, inland waterways): \u20b980,000 crore. (c) Port-led industrialization (SEZs, coastal economic zones): \u20b970,000 crore. (d) Coastal community development (fisheries, tourism, skill development): \u20b920,000 crore. (e) Inland waterways: \u20b930,000 crore. India\u2019s port capacity target: 3,500 MT/year by 2035 (from 1,600 MT in 2024). Container throughput target: 25 million TEU by 2030 (from 12-14 million in 2024). Employment: Sagarmala to create 40 lakh (4 million) direct + indirect jobs.",
  },
];

export default function PortTerminalOperationsLogisticsView() {
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
      if (!r.id.toLowerCase().includes(q) && !r.billNo.toLowerCase().includes(q) && !r.terminal.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.vessel.toLowerCase().includes(q) && !r.shipping.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof CargoRecord] as string));
  });

  return (
    <div className="pto-root p-6 space-y-6">
      <PageHeader title="Port Terminal Operations Logistics" description="India major port terminal operations covering JNPT Chennai Mundra Kandla Vizag Paradip Kolkata Cochin, TEU container import export, break bulk, liquid chemical, reefer cold, RoRo vehicle, STS gantry crane, RTG, reach stacker, customs BOE, CONCOR ICD rail" />
      <div className="pto-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`pto-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-slate-800 text-white" : "text-gray-600 hover:bg-slate-100"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="pto-dash space-y-6">
          <div className="pto-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="pto-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 pto-kpi-label">{k.l}</div><div className="text-2xl font-bold text-slate-800 pto-kpi-val">{k.v}</div><div className="text-xs text-gray-400 pto-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="pto-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly TEU Volume (000s)</h3><BarChart data={monthlyTEU} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="import40" fill="#1e3a5f" radius={[4,4,0,0]} name="40ft Import" /><Bar dataKey="export40" fill="#264e73" radius={[4,4,0,0]} name="40ft Export" /><Bar dataKey="import20" fill="#2e6389" radius={[4,4,0,0]} name="20ft Import" /><Bar dataKey="bulk" fill="#3b82a8" radius={[4,4,0,0]} name="Bulk" /></BarChart></div>
            <div className="pto-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cargo Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="pto-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Berth Utilization Rate (%) vs 85% Target</h3><LineChart data={berthUtil} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[65, 95]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#1e3a5f" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="pto-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Terminal Throughput Performance (000s TEU)</h3><BarChart data={termPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[60, 100]} /><Tooltip /><Bar dataKey="v" fill="#264e73" radius={[4,4,0,0]} name="TEU 000s" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="pto-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Port Terminal", href: "#" }, { label: "Cargo Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="pto-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Bill of Lading,Terminal,Zone,Category,Description,Weight (kg),TEU,Vessel,Shipping,Destination,Mode,Arrival,Discharge,Dwell (d),Value (\u20b9L),Cargo Type,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Berthed Crane Operations" ? "pto-row-warning bg-amber-50 border-l-4 border-l-amber-500" : r.status === "Container Discharged Unloaded" ? "pto-row-info bg-blue-50 border-l-4 border-l-blue-500" : r.status === "Vessel Arrived Pilot Boarded" ? "pto-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-slate-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="pto-badge inline-block px-2 py-0.5 rounded text-xs bg-slate-800 text-white font-mono text-[10px]">{r.billNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.terminal}</td>
                <td className="px-3 py-2"><span className="pto-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="pto-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.weight >= 1000000 ? `${(r.weight/1000000).toFixed(1)}KT` : r.weight >= 1000 ? `${(r.weight/1000).toFixed(1)}T` : `${r.weight}kg`}</td>
                <td className="px-3 py-2 text-xs">{r.teu}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.vessel}</td>
                <td className="px-3 py-2 text-xs max-w-20 truncate">{r.shipping}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.destination}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.arrivalDate}</td>
                <td className="px-3 py-2 text-xs">{r.dischargeDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.dwellDays >= 5 ? "text-red-600" : r.dwellDays >= 3 ? "text-amber-600" : "text-green-600"}`}>{r.dwellDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-slate-800">{`\u20b9${r.valueLakhs}L`}</td>
                <td className="px-3 py-2 text-center">{r.cargoType === "HazChem" ? <span className="pto-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">HAZ</span> : r.cargoType === "Reefer" ? <span className="pto-badge inline-block px-2 py-0.5 rounded text-xs bg-blue-600 text-white">REF</span> : r.cargoType === "ODC" ? <span className="pto-badge inline-block px-2 py-0.5 rounded text-xs bg-orange-500 text-white">ODC</span> : <span className="text-gray-400">{r.cargoType}</span>}</td>
                <td className="px-3 py-2"><span className={`pto-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="pto-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="pto-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cargo Volume by Zone</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(15, 50, 30 + Math.random() * 10).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#1e3a5f" radius={[4,4,0,0]} name="000s TEU" /></BarChart></div>
            <div className="pto-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Volume by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], imp40: ri(10, 30, 18 + Math.sin(i*0.5)*5), exp40: ri(8, 25, 14 + Math.cos(i*0.6)*4), bulk: ri(3, 12, 6 + Math.sin(i*0.7)*3) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="imp40" stackId="1" stroke="#1e3a5f" fill="#5ba3c9" name="40ft Import" /><Area type="monotone" dataKey="exp40" stackId="1" stroke="#264e73" fill="#3b82a8" name="40ft Export" /><Area type="monotone" dataKey="bulk" stackId="1" stroke="#2e6389" fill="#2e6389" name="Bulk" /></AreaChart></div>
          </div>
          <div className="pto-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Dwell Days by Terminal</h3><BarChart data={TERMINALS.map(t => ({ n: t.split(" ").slice(0, 2).join(" "), v: +ri(1.5, 6, 3 + Math.random() * 1.5).toFixed(1) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#264e73" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="pto-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="pto-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-slate-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
