"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#78716c", "#a8a29e", "#d6d3d1", "#e7e5e4", "#57534e", "#44403c", "#f5f5f4", "#fafaf9"];
const PLANTS = ["UltraTech Kotputli Rajasthan", "Ambuja Raipur Chhattisgarh", "ACC Wadi Karnataka", "Shree Cement Beawar", "Dalmia Bengal Cuttack", "Ramco Chennai TN", "JK Cement Nimbahera", "India Cements Sankari TN"];
const CATEGORIES = ["OPC 53 Grade", "OPC 43 Grade", "PPC Blend", "PSC Blast Furnace", "White Cement", "Ready-Mix Concrete", "Bulk Clinker", "Cement Additives"];
const DISPATCH_STATUSES = ["Produced", "In Silo Storage", "Dispatched", "In Transit", "Delivered at Site", "Consumed / Used"];
const ROUTES = ["Rajasthan NCR Corridor", "South India Circuit", "East India Route", "West Maharashtra Belt", "Central MP Route", "North Punjab Corridor"];
const MODES = ["Cement Bulker 50T", "RMC Transit Mixer", "Rail Cement Wagon", "Bulk Carrier 20T", "Container Flat", "River Barge"];
const TABS = ["Dashboard", "Dispatch Registry", "Cement Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Produced": "blue", "In Silo Storage": "blue", "Dispatched": "blue", "In Transit": "blue", "Delivered at Site": "green", "Consumed / Used": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyDispatch = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], opc: ri(1200, 2200, 1650 + Math.sin(i * 0.5) * 250), ppc: ri(800, 1500, 1100 + Math.cos(i * 0.6) * 180), rmc: ri(300, 600, 420 + Math.sin(i * 0.7) * 70), clinker: ri(200, 450, 320 + Math.cos(i * 0.8) * 50) }));
const categoryDist = [{ n: "OPC 53 Grade", v: 28 }, { n: "PPC Blend", v: 24 }, { n: "OPC 43 Grade", v: 18 }, { n: "Ready-Mix Concrete", v: 12 }, { n: "PSC Blast Furnace", v: 8 }, { n: "Bulk Clinker", v: 6 }, { n: "White Cement", v: 3 }, { n: "Cement Additives", v: 1 }];
const clinkerFactorTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(62, 70, 66 + Math.sin(i * 0.4) * 2)).toFixed(1), target: 65.0 }));
const plantPerf = PLANTS.slice(0, 6).map(p => ({ n: p.split(" ").slice(0, 2).join(" "), v: +ri(80, 97, 89 + Math.random() * 5).toFixed(0) }));

interface DispatchRecord { id: string; challan: string; plant: string; route: string; category: string; item: string; weight: number; unit: string; customer: string; origin: string; destination: string; mode: string; prodDate: string; etaDate: string; transitDays: number; valueLakhs: number; urgentFlag: boolean; status: string; remarks: string; }

const records: DispatchRecord[] = [
  { id: "CMT-0001", challan: "CHL-UTK/2025/7821", plant: "UltraTech Kotputli Rajasthan", route: "Rajasthan NCR Corridor", category: "OPC 53 Grade", item: "UltraTech OPC 53 Bag 50kg Truckload", weight: 25000, unit: "kg", customer: "L&T Construction Jaipur", origin: "UltraTech Kotputli Plant", destination: "L&T Jaipur Site", mode: "Cement Bulker 50T", prodDate: "2025-07-10", etaDate: "", transitDays: 1, valueLakhs: 9, urgentFlag: true, status: "In Transit", remarks: "OPC 53 for Jaipur metro pillar casting high-strength grade" },
  { id: "CMT-0002", challan: "CHL-AMB/2025/5432", plant: "Ambuja Raipur Chhattisgarh", route: "East India Route", category: "PPC Blend", item: "Ambuja PPC Bag 50kg Rail Wagon", weight: 50000, unit: "kg", customer: "State PWD Raipur", origin: "Ambuja Raipur Plant", destination: "PWD Raipur Godown", mode: "Rail Cement Wagon", prodDate: "2025-07-08", etaDate: "2025-07-10", transitDays: 2, valueLakhs: 16, urgentFlag: false, status: "Delivered at Site", remarks: "PPC blend rail wagon for state PWD rural road construction" },
  { id: "CMT-0003", challan: "CHL-ACC/2025/9087", plant: "ACC Wadi Karnataka", route: "South India Circuit", category: "Ready-Mix Concrete", item: "ACC RMC M25 Grade 6 cum Mixer", weight: 14400, unit: "kg", customer: "Prestige Shantiniketan BLR", origin: "ACC RMC Plant BLR", destination: "Prestige Site Whitefield", mode: "RMC Transit Mixer", prodDate: "2025-07-11", etaDate: "", transitDays: 0, valueLakhs: 4.5, urgentFlag: true, status: "In Transit", remarks: "RMC M25 for Prestige Shantiniketan tower 42 slab pour" },
  { id: "CMT-0004", challan: "CHL-SHC/2025/3456", plant: "Shree Cement Beawar", route: "Rajasthan NCR Corridor", category: "OPC 43 Grade", item: "Shree Cement OPC 43 Bag 50kg", weight: 30000, unit: "kg", customer: "DLF Gurgaon", origin: "Shree Cement Beawar", destination: "DLF Phase-5 Site", mode: "Cement Bulker 50T", prodDate: "2025-07-09", etaDate: "", transitDays: 2, valueLakhs: 10, urgentFlag: false, status: "Dispatched", remarks: "OPC 43 for DLF residential project Gurgaon Phase-5" },
  { id: "CMT-0005", challan: "CHL-DLM/2025/6789", plant: "Dalmia Bengal Cuttack", route: "East India Route", category: "PSC Blast Furnace", item: "Dalmia PSC Bag 50kg Coastal", weight: 35000, unit: "kg", customer: "NHAI Paradip Port Road", origin: "Dalmia Cuttack Plant", destination: "NHAI Paradip Site", mode: "Bulk Carrier 20T", prodDate: "2025-07-07", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 11, urgentFlag: true, status: "Delivered at Site", remarks: "PSC blast furnace slag cement for coastal NHAI road - sulfate resistant" },
  { id: "CMT-0006", challan: "CHL-RMC/2025/1234", plant: "Ramco Chennai TN", route: "South India Circuit", category: "White Cement", item: "Ramco White Cement 25kg Bag", weight: 5000, unit: "kg", customer: "Asian Paints Chennai", origin: "Ramco Chennai Plant", destination: "Asian Paints Factory", mode: "Bulk Carrier 20T", prodDate: "2025-07-12", etaDate: "", transitDays: 1, valueLakhs: 8, urgentFlag: false, status: "Produced", remarks: "Ramco white cement for Asian Paints putty and tile adhesive mfg" },
  { id: "CMT-0007", challan: "CHL-JKC/2025/5678", plant: "JK Cement Nimbahera", route: "Central MP Route", category: "PPC Blend", item: "JK Cement PPC 50kg Bag Bulk", weight: 45000, unit: "kg", customer: "Tata Projects Bhopal", origin: "JK Cement Nimbahera", destination: "Tata Bhopal Highway", mode: "Cement Bulker 50T", prodDate: "2025-07-06", etaDate: "2025-07-07", transitDays: 2, valueLakhs: 14, urgentFlag: true, status: "In Transit", remarks: "PPC blend for Tata Projects Bhopal Indore expressway" },
  { id: "CMT-0008", challan: "CHL-ICL/2025/8901", plant: "India Cements Sankari TN", route: "South India Circuit", category: "Bulk Clinker", item: "Clinker Bulk 300T Rail", weight: 300000, unit: "kg", customer: "ICL Grinding Unit Kochi", origin: "India Cements Sankari", destination: "ICL Kochi Grinding", mode: "Rail Cement Wagon", prodDate: "2025-07-05", etaDate: "", transitDays: 3, valueLakhs: 42, urgentFlag: false, status: "In Silo Storage", remarks: "Clinker bulk rail transport Sankari to Kochi grinding unit 300T" },
  { id: "CMT-0009", challan: "CHL-UTK/2025/2345", plant: "UltraTech Kotputli Rajasthan", route: "Rajasthan NCR Corridor", category: "Cement Additives", item: "MasterGlenium Sky 8234 200L Drum", weight: 4000, unit: "kg", customer: "Afcons Infrastructure Delhi", origin: "UltraTech Admix Plant", destination: "Afcons Delhi Metro", mode: "Bulk Carrier 20T", prodDate: "2025-07-11", etaDate: "", transitDays: 1, valueLakhs: 12, urgentFlag: true, status: "Dispatched", remarks: "High-range water reducer admixture for Delhi Metro underground tunnel" },
  { id: "CMT-0010", challan: "CHL-AMB/2025/4567", plant: "Ambuja Raipur Chhattisgarh", route: "East India Route", category: "OPC 53 Grade", item: "Ambuja OPC 53 Bag 50kg Road", weight: 40000, unit: "kg", customer: "NTPC Sipat Plant", origin: "Ambuja Raipur Plant", destination: "NTPC Sipat Township", mode: "Cement Bulker 50T", prodDate: "2025-07-10", etaDate: "", transitDays: 1, valueLakhs: 14, urgentFlag: true, status: "In Transit", remarks: "OPC 53 grade for NTPC Sipat power plant boiler foundation" },
  { id: "CMT-0011", challan: "CHL-ACC/2025/7890", plant: "ACC Wadi Karnataka", route: "South India Circuit", category: "Ready-Mix Concrete", item: "ACC RMC M40 Grade 6 cum", weight: 15600, unit: "kg", customer: "Nirma University Ahmedabad", origin: "ACC Wadi Satellite RMC", destination: "Nirma Campus Site", mode: "RMC Transit Mixer", prodDate: "2025-07-09", etaDate: "2025-07-09", transitDays: 0, valueLakhs: 6.5, urgentFlag: false, status: "Consumed / Used", remarks: "M40 high-strength RMC for Nirma University auditorium column" },
  { id: "CMT-0012", challan: "CHL-SHC/2025/1122", plant: "Shree Cement Beawar", route: "West Maharashtra Belt", category: "PPC Blend", item: "Shree PPC Bag 50kg Container", weight: 25000, unit: "kg", customer: "Godrej Properties Pune", origin: "Shree Cement Beawar", destination: "Godrej Riverdale Pune", mode: "Container Flat", prodDate: "2025-07-12", etaDate: "", transitDays: 3, valueLakhs: 8, urgentFlag: false, status: "In Silo Storage", remarks: "PPC blend container flat for Godrej Pune residential project" },
  { id: "CMT-0013", challan: "CHL-DLM/2025/3344", plant: "Dalmia Bengal Cuttack", route: "East India Route", category: "OPC 43 Grade", item: "Dalmia OPC 43 Bag 50kg Barge", weight: 60000, unit: "kg", customer: "PWD Odisha Bhubaneswar", origin: "Dalmia Cuttack Plant", destination: "PWD Bhubaneswar Yard", mode: "River Barge", prodDate: "2025-07-08", etaDate: "2025-07-10", transitDays: 3, valueLakhs: 19, urgentFlag: false, status: "Delivered at Site", remarks: "OPC 43 for Odisha PWD smart city Bhubaneswar road project" },
  { id: "CMT-0014", challan: "CHL-RMC/2025/9012", plant: "Ramco Chennai TN", route: "South India Circuit", category: "PPC Blend", item: "Ramco PPC 50kg Bag Truckload", weight: 30000, unit: "kg", customer: "L&T ECC Chennai Metro", origin: "Ramco Chennai Plant", destination: "Chennai Metro Phase-2", mode: "Cement Bulker 50T", prodDate: "2025-07-07", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 10, urgentFlag: true, status: "Consumed / Used", remarks: "PPC blend for Chennai Metro Phase-2 underground station structure" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Dispatched").length;
const storageCount = records.filter(r => r.status === "In Silo Storage" || r.status === "Produced").length;
const deliveredCount = records.filter(r => r.status === "Delivered at Site" || r.status === "Consumed / Used").length;
const totalValue = records.reduce((s, r) => s + r.valueLakhs, 0);

const kpis = [
  { l: "In Transit / Dispatched", v: transitCount, s: "active shipments" },
  { l: "In Storage / Produced", v: storageCount, s: "in silo" },
  { l: "Delivered / Used", v: deliveredCount, s: "at site" },
  { l: "Total Dispatch Value", v: `\u20b9${totalValue}L`, s: "across all routes" },
];

const INSIGHTS = [
  {
    t: "India Cement Industry: 580 MT Capacity, \u20b98 Lakh Crore Market, World\u2019s 2nd Largest Producer",
    c: "India is the world\u2019s second-largest cement producer (580 MT installed capacity, 420 MT production in FY 2024-25), after China (2,500 MT), with a domestic market of \u20b98 lakh crore (USD 95 billion). India\u2019s cement consumption per capita is 320 kg (global average: 500 kg, China: 1,600 kg), with significant growth potential driven by infrastructure (PM Gati Shakti, National Infrastructure Pipeline: \u20b9111 lakh crore), housing (Pradhan Mantri Awas Yojana: 3 crore houses target), and urbanization (India\u2019s urban population: 480 million, projected 675 million by 2035). India\u2019s cement industry structure: (1) Top 5 players control 50%+ market: UltraTech (Aditya Birla, 150 MT capacity, 22% market share), Ambuja Cements (Adani Group, 80 MT, 14% \u2014 merged with ACC in 2024 to create 100+ MT entity), Shree Cement (55 MT, 10%), Dalmia Bharat (50 MT, 9%), and JSW Cement (45 MT, 8%), (2) Mid-size players: Ramco Cements (25 MT), JK Cement (20 MT), India Cements (16 MT), Birla Corporation (15 MT), (3) Regional players: 40+ companies with 5-15 MT each, and (4) Mini cement plants: 300+ units (less than 5 MT each, total 20 MT). India\u2019s cement logistics covers: (a) 210+ integrated cement plants (grinding + clinkerization), (b) 100+ grinding units (only grinding clinker to cement), (c) 50,000+ cement dealers and retailers, (d) 50,000+ cement bulkers and trucks, (e) 2,000+ RMC (Ready-Mix Concrete) batching plants, and (f) 5,000+ silos at plants and distribution hubs. Cement logistics cost: 25-35% of ex-factory price (vs 10-15% for most FMCG), due to: (1) Low value-to-weight ratio (\u20b94-6 per kg, vs \u20b950-200 per kg for FMCG), (2) Distance sensitivity (optimal radius: 250-300 km by road, beyond which rail becomes economical), and (3) Product perishability (cement shelf life: 90 days in dry storage, 3 hours after mixing with water in RMC). India\u2019s cement distribution: road transport (65%), rail (20%), and dealer stockist (15%). The shift to bulk cement (from bags to bulk silos) is accelerating: 35% of cement is now transported in bulk (vs 20% in 2015), driven by large infrastructure projects.",
  },
  {
    t: "Cement Production Process: Limestone Mining, Clinkerization, Grinding, and Blending",
    c: "India\u2019s cement production involves: (1) Raw material extraction: limestone (65% of clinker by weight), clay/shale (20%), bauxite (3%), iron ore (2%), gypsum (5% added during grinding), and fly ash/slag (PPC/PSC supplementary materials). India has 30,000+ million tonnes of limestone reserves, sufficient for 100+ years. (2) Clinkerization: raw materials are ground to fine powder (raw meal), fed into a rotary kiln at 1,450\u00b0C, producing clinker nodules (3-25mm diameter). The kiln process takes 45-60 minutes. Clinker production is energy-intensive (3.5-4.0 GJ per tonne of clinker), consuming: coal (60% of energy, 350-400 kg coal per tonne clinker), pet coke (25%), and alternative fuels (waste tires, biomass: 5% and growing). India\u2019s clinker factor (clinker/cement ratio) averages 66% (vs 95% in developed countries), with 34% supplementary material (fly ash, slag, calcined clay) in blended cements. (3) Grinding: clinker + gypsum (5%) + supplementary materials are ground in ball mills or vertical roller mills (VRMs) to produce cement. India\u2019s grinding capacity exceeds clinker capacity by 20% (excess grinding met by imported clinker and domestic surplus). (4) Blending: India\u2019s most popular cement types: (a) OPC 53 Grade (28%): high early strength for structural concrete, (b) OPC 43 Grade (18%): general purpose construction, (c) PPC (Portland Pozzolana Cement, 24%): fly ash blended, higher workability, lower heat of hydration, most popular for housing, (d) PSC (Portland Slag Cement, 8%): blast furnace slag blended, superior chemical resistance for marine/coastal construction, (e) White Cement (3%): limestone with low iron oxide, for architectural finishes, (f) RMC (Ready-Mix Concrete, 12%): factory-mixed concrete delivered in transit mixers, ensuring consistent quality. India\u2019s cement quality standards: IS 269 (OPC 33), IS 8112 (OPC 43), IS 12269 (OPC 53), IS 1489 (PPC), IS 455 (PSC), IS 8041 (RMC). BIS certification (ISI mark) is mandatory for cement sold in India. Quality control at plant level: (a) Chemical analysis (X-ray fluorescence every 2 hours for raw meal composition), (b) Physical testing: compressive strength at 3/7/28 days, setting time (Vicat apparatus), soundness (Le Chatelier), fineness (Blaine apparatus: 300-400 m2/kg for OPC), and (c) Online process control: gamma-ray densitometers, kiln shell scanners, and automated lab systems. India\u2019s cement energy consumption: 3.0-3.5 GJ per tonne cement (vs 2.8 GJ global best practice). Target: 2.8 GJ by 2030 through: waste heat recovery (WHR) power generation (installed: 1,500 MW), VRM adoption (90% new plants), and alternative fuels (target: 25% thermal substitution rate by 2030).",
  },
  {
    t: "Cement Transportation and Distribution: Bulkers, Rail Wagons, and RMC Mixers",
    c: "India\u2019s cement logistics operates through four primary modes: (1) Road transport (65% of volume): 50,000+ cement bulkers (payload 25-30 MT per trip, 3-4 trips per day), operating within 250-300 km radius of cement plants. Bulker logistics: (a) Loading: pneumatic loading from plant silo (15-20 minutes per bulker), (b) Transit: 4-8 hours average for 200 km delivery, (c) Unloading: pneumatic offloading to dealer silo or site silo (20-30 minutes), (d) Return trip: empty backhaul (often carrying fly ash or slag to cement plant \u2014 improving utilization to 70%). Cement bulker economics: \u20b93-5 per km per MT, \u20b98,000-12,000 per trip revenue. Major bulker fleet operators: Shree Cement (5,000+ own bulkers), UltraTech (4,000+), Ambuja/ACC (6,000+ combined), and third-party fleet operators. (2) Rail transport (20%): Indian Railways carries 80+ MT cement annually in 8,000+ cement wagons (box-N, BCN type, 40-60 MT per wagon). Rail is economical for 400+ km distances (40% cheaper than road for long-haul). Major rail users: ACC (40% by rail), UltraTech (30% by rail), and Shree Cement (25% by rail). Rail logistics challenges: (a) Wagon availability (Indian Railways priority: coal > cement), (b) Loading/unloading infrastructure (sidings at plants: 150+ sidings), (c) Last-mile connectivity (rail to road transfer at destination requires silo infrastructure), and (d) Transit time variability (2-5 days depending on route congestion). (3) RMC Transit Mixers (12%): 2,000+ batching plants operate 15,000+ transit mixers (6-7 cum capacity, 20 MT payload). RMC logistics: (a) Order received by plant, (b) Batching: aggregate, sand, cement, water, admixture mixed in 2-3 minutes, (c) Transit mixer delivery to site: 45-90 minute maximum (after which concrete begins setting), (d) On-site slump test, air content, temperature check, (e) Pour and compact, (f) Transit mixer return (washout at site or plant). RMC tracking: GPS on every mixer, real-time ETA, automated dispatch from batching software (command alkon, Lotus, or SAP integrated). (4) Coastal shipping and river barge (3%): Ambuja and ACC operate coastal cement terminals at Mangalore, Kandla, and Paradip. River barge cement transport on Ganga (Allahabad-Varanasi section) pilot by Inland Waterways Authority. Cement distribution to retail: (a) Cement bags (50 kg) sold through 50,000+ dealers (average inventory: 200-500 bags, turnover: 15-20 days), (b) Institutional/bulk: direct plant-to-site for large projects (housing towers, highways, metro, dams), and (c) RMC: B2B delivery by transit mixer from batching plant to construction site. Seasonal demand: peak season (Oct-May, dry weather: +30-40% vs monsoon), monsoon trough (June-Sept: construction slowdown, 20-30% demand drop). India\u2019s cement demand segmentation: housing 65%, infrastructure 20%, commercial 10%, industrial 5%.",
  },
  {
    t: "Cement Industry Technology: Automation, WHR Power, Carbon Capture, and Green Cement",
    c: "India\u2019s cement industry is transforming through: (1) Process automation: Distributed Control Systems (DCS) in 90%+ plants (ABB Ability, Siemens Cemat, Honeywell), automated quality labs (robotic sample preparation, online XRF analysis), and AI-based kiln optimization (predictive control for stable kiln operation, reducing fuel consumption by 2-3%). (2) Waste Heat Recovery (WHR): 150+ WHR power plants installed across India\u2019s cement industry, generating 1,500 MW (5% of sector\u2019s electricity need), capturing heat from kiln exhaust (320-400\u00b0C) and clinker cooler exhaust (250-350\u00b0C). Payback period: 3-4 years. (3) Alternative fuels and raw materials (AFR): India\u2019s target: 25% thermal substitution rate by 2030 (current: 5%). Approved alternative fuels: waste tires, biomass (rice husk, bagasse), municipal solid waste (MSW), plastic waste, and industrial waste (solvent, paint sludge). UltraTech and ACC lead AFR adoption (8-10% TSR each). (4) Grinding technology: Vertical Roller Mills (VRMs) replacing ball mills (30% less energy, 50% less noise), roller presses in finish grinding mode (combined with ball mill: 15% energy savings), and HPGR (High Pressure Grinding Rolls) for pre-grinding. (5) Green cement innovations: (a) Limestone Calcined Clay Cement (LC3): 40% clinker replacement using calcined clay and limestone, 30-40% lower CO2 than OPC. India pilot: IIT Madras + Dalmia Bharat (1 MT LC3 plant). (b) Geopolymer cement: fly ash + slag + alkaline activator, zero clinker. Pilot: IIT Hyderabad + Ramco Cements. (c) Carbon capture: ACC/Adani Group pilot post-combustion CO2 capture (500 tonnes CO2/year), CO2 utilization for concrete curing. (d) Belite-rich cements: lower kiln temperature, 10% less energy. India\u2019s cement CO2 emissions: 600-650 kg CO2 per tonne of cement (global average: 630 kg, best practice: 500 kg). India\u2019s cement sector emits 300 MT CO2 annually (8% of India\u2019s total CO2). Decarbonization targets: 45% reduction by 2030 (vs 2005 baseline) per India\u2019s NDC. (6) Digital logistics: (a) GPS tracking of 50,000+ cement bulkers (real-time ETA, route deviation alerts, fuel monitoring), (b) Dealer management systems (DMS): automated order placement, stock monitoring, scheme tracking (HUL/SAP model adapted by UltraTech, Ambuja), (c) Digital payments: UPI for dealer payments, reducing cash cycle from 7 days to same-day, (d) AI demand forecasting: ACC uses ML-based monthly demand prediction at dealer level (15% MAPE improvement), and (e) Silo IoT: level sensors in 5,000+ dealer silos, enabling automated replenishment triggers. India\u2019s cement industry CAPEX: \u20b915,000 crore per year (2023-2028), focused on: capacity expansion (+50 MT), WHR power (+500 MW), grinding units (+30 MT), and greenfield plants in Northeast India.",
  },
];

export default function CementBlendLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: DISPATCH_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "route", label: "Route", options: ROUTES.map(r => ({ value: r, count: records.filter(rec => rec.route === r).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.challan.toLowerCase().includes(q) && !r.plant.toLowerCase().includes(q) && !r.item.toLowerCase().includes(q) && !r.customer.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof DispatchRecord] as string));
  });

  return (
    <div className="cmt-root p-6 space-y-6">
      <PageHeader title="Cement Blend Logistics" description="India cement industry supply chain covering 580 MT capacity, clinkerization, OPC/PPC/PSC blending, bulk cement transport, RMC transit mixers, rail wagon logistics, WHR power, and green cement LC3 innovation across 210+ plants" />
      <div className="cmt-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`cmt-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-stone-700 text-white" : "text-gray-600 hover:bg-stone-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="cmt-dash space-y-6">
          <div className="cmt-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="cmt-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 cmt-kpi-label">{k.l}</div><div className="text-2xl font-bold text-stone-700 cmt-kpi-val">{k.v}</div><div className="text-xs text-gray-400 cmt-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Cement Dispatch (MT)</h3><BarChart data={monthlyDispatch} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="opc" fill="#78716c" radius={[4,4,0,0]} name="OPC" /><Bar dataKey="ppc" fill="#a8a29e" radius={[4,4,0,0]} name="PPC" /><Bar dataKey="rmc" fill="#d6d3d1" radius={[4,4,0,0]} name="RMC" /><Bar dataKey="clinker" fill="#e7e5e4" radius={[4,4,0,0]} name="Clinker" /></BarChart></div>
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cement Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Clinker Factor (%) vs 65% Target</h3><LineChart data={clinkerFactorTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[58, 75]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#78716c" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Plant Performance Score</h3><BarChart data={plantPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[78, 100]} /><Tooltip /><Bar dataKey="v" fill="#a8a29e" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="cmt-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Cement Blend", href: "#" }, { label: "Dispatch Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="cmt-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Challan,Plant,Route,Category,Item,Weight (kg),Customer,Mode,Prod Date,ETA,Transit (d),Value (\u20b9L),Urgent,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Produced" || r.status === "In Silo Storage" ? "cmt-row-warning bg-amber-50" : r.status === "In Transit" || r.status === "Dispatched" ? "cmt-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-stone-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="cmt-badge inline-block px-2 py-0.5 rounded text-xs bg-stone-700 text-white font-mono">{r.challan}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.plant}</td>
                <td className="px-3 py-2"><span className="cmt-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.route}</span></td>
                <td className="px-3 py-2"><span className="cmt-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.item}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{(r.weight/1000).toFixed(0)}T</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.customer}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate || <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 2 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-stone-700">{r.valueLakhs}</td>
                <td className="px-3 py-2 text-center">{r.urgentFlag ? <span className="cmt-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">URG</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`cmt-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="cmt-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dispatch Volume by Route</h3><BarChart data={ROUTES.map(r => ({ n: r.split(" ")[0], v: +ri(15, 40, 26 + Math.random() * 10).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#78716c" radius={[4,4,0,0]} name="Consignments" /></BarChart></div>
            <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Dispatch by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], opc: ri(100, 200, 140 + Math.sin(i*0.5)*25), ppc: ri(80, 170, 120 + Math.cos(i*0.6)*20), rmc: ri(20, 55, 35 + Math.sin(i*0.7)*10) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="opc" stackId="1" stroke="#78716c" fill="#f5f5f4" name="OPC" /><Area type="monotone" dataKey="ppc" stackId="1" stroke="#a8a29e" fill="#e7e5e4" name="PPC" /><Area type="monotone" dataKey="rmc" stackId="1" stroke="#d6d3d1" fill="#fafaf9" name="RMC" /></AreaChart></div>
          </div>
          <div className="cmt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Transport Mode</h3><BarChart data={[{n:"Bulker 50T",v:1},{n:"RMC Mixer",v:0},{n:"Rail Wagon",v:3},{n:"Bulk Carrier",v:1.5},{n:"Container",v:2.5},{n:"River Barge",v:3}].map(d => ({...d, v: +ri(d.v-0.2, d.v+0.5, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#a8a29e" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="cmt-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="cmt-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-stone-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
