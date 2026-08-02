"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0f4c75", "#1b6ca8", "#3282b8", "#5fa8d3", "#89c2d9", "#062c43", "#0a3d62", "#bbe1fa"];
const DEPOTS = ["CONCOR Tughlakabad ICD Delhi", "CONCOR Dadri ICD NCR", "DFCCIL JNPT Mumbai Port", "CONCOR ChennaiWhitefield ICD", "CONCOR Visakhapatnam ICD", "DFCCIL Paradip Port Odisha", "CONCOR Kolkata Santragachi", "DFCCIL Mundra Kutch Port"];
const CATEGORIES = ["Coal Rake 58W", "Iron Ore Wagon", "Container ISO", "Food Grain BoxN", "Cement FlyAsh Open", "Petroleum Tank Wagon", "Automobile BCACBM", "Steel Coil Flat"];
const CONSIGNMENT_STATUSES = ["Loaded at Origin", "In Transit Main Line", "Rake Formation Yard", "Terminal Detention", "Customs Examination", "Delivered Consignee"];
const ZONES = ["Northern Railway Delhi", "Western Railway Mumbai", "Eastern Railway Howrah", "South Central SC Secunderabad", "South Western SW Bengaluru", "North Central NCR Prayagraj"];
const MODES = ["Broad Gauge Parcel", "Rake 58 Wagon Full", "Double Stack Container",("Single Stack Container"), "Flat Wagon Oversize",("Tank Wagon Petroleum")];
const TABS = ["Dashboard", "Consignment Registry", "Freight Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Loaded at Origin": "blue", "In Transit Main Line": "blue", "Rake Formation Yard": "amber", "Terminal Detention": "red", "Customs Examination": "orange", "Delivered Consignee": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyTonnage = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], coal: ri(40, 80, 58 + Math.sin(i * 0.5) * 10), container: ri(25, 55, 38 + Math.cos(i * 0.6) * 8), grain: ri(15, 35, 22 + Math.sin(i * 0.7) * 5), steel: ri(10, 25, 16 + Math.cos(i * 0.8) * 4) }));
const categoryDist = [{ n: "Coal Thermal", v: 32 }, { n: "Container ISO", v: 22 }, { n: "Food Grain FCI", v: 15 }, { n: "Iron Ore Steel", v: 12 }, { n: "Cement Mineral", v: 9 }, { n: "Petroleum POL", v: 5 }, { n: "Automobile Auto", v: 3 }, { n: "Other Miscellaneous", v: 2 }];
const punctualityRate = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(72, 92, 84 + Math.sin(i * 0.4) * 5)).toFixed(1), target: 90.0 }));
const depotPerf = DEPOTS.slice(0, 6).map(d => ({ n: d.split(" ").slice(0, 2).join(" "), v: +ri(70, 96, 84 + Math.random() * 8).toFixed(0) }));

interface ConsignmentRecord { id: string; rrNumber: string; depot: string; zone: string; category: string; commodity: string; weight: number; unit: string; consignor: string; consignee: string; mode: string; originStation: string; destStation: string; dispatchDate: string; etaDate: string; transitDays: number; valueLakhs: number; priorityFlag: string; status: string; remarks: string; }

const records: ConsignmentRecord[] = [
  { id: "RFL-0001", rrNumber: "RR-2025/07/NR/08912", depot: "CONCOR Tughlakabad ICD Delhi", zone: "Northern Railway Delhi", category: "Coal Rake 58W", commodity: "Thermal Coal 58-Wagon Rake 3,480T", weight: 3480000, unit: "kg", consignor: "CIL Mahanadi Coalfields", consignee: "NTPC Talcher TPS Odisha", mode: "Rake 58 Wagon Full", originStation: "Talcher Junction", destStation: "NTPC Talcher Siding", dispatchDate: "2025-07-08", etaDate: "2025-07-08", transitDays: 0, valueLakhs: 175, priorityFlag: "STD", status: "Loaded at Origin", remarks: "58-wagon coal rake Talcher to NTPC Talcher TPS 3,480T thermal coal ECoR" },
  { id: "RFL-0002", rrNumber: "RR-2025/07/WR/13456", depot: "DFCCIL JNPT Mumbai Port", zone: "Western Railway Mumbai", category: "Container ISO", commodity: "ISO Container 20-TEU Import Electronics", weight: 260000, unit: "kg", consignor: "Maersk Line JNPT", consignee: "Delhi ICD Tughlakabad", mode: "Double Stack Container", originStation: "JNPT Port", destStation: "Tughlakabad ICD Delhi", dispatchDate: "2025-07-09", etaDate: "2025-07-11", transitDays: 2, valueLakhs: 89, priorityFlag: "STD", status: "In Transit Main Line", remarks: "20-TEU import containers electronics JNPT to Delhi ICD double stack WR" },
  { id: "RFL-0003", rrNumber: "RR-2025/07/ER/09876", depot: "CONCOR Kolkata Santragachi", zone: "Eastern Railway Howrah", category: "Food Grain BoxN", commodity: "FCI Rice 40-Wagon BoxN 2,400T", weight: 2400000, unit: "kg", consignor: "FCI Kolkata Regional", consignee: "FCI Guwahati Regional Depot", mode: "Rake 58 Wagon Full", originStation: "Kolkata Goods Shed", destStation: "Guwahati Goods Yard", dispatchDate: "2025-07-10", etaDate: "2025-07-14", transitDays: 4, valueLakhs: 72, priorityFlag: "STD", status: "In Transit Main Line", remarks: "FCI rice 40-wagon rake 2,400T Kolkata to Guwahati ER-NFR corridor" },
  { id: "RFL-0004", rrNumber: "RR-2025/07/SW/05678", depot: "CONCOR Visakhapatnam ICD", zone: "South Central SC Secunderabad", category: "Iron Ore Wagon", commodity: "Iron Ore Fines 52-Wagon Rake 3,120T", weight: 3120000, unit: "kg", consignor: "NMDC Bailadila", consignee: "Visakhapatnam Steel Plant", mode: "Rake 58 Wagon Full", originStation: "Bailadila Junction", destStation: "VSP Steel Plant Siding", dispatchDate: "2025-07-07", etaDate: "2025-07-10", transitDays: 3, valueLakhs: 156, priorityFlag: "STD", status: "Delivered Consignee", remarks: "Iron ore fines 52-wagon Bailadila to VSP steel plant 3,120T delivered" },
  { id: "RFL-0005", rrNumber: "RR-2025/07/NCR/11234", depot: "CONCOR Dadri ICD NCR", zone: "North Central NCR Prayagraj", category: "Automobile BCACBM", commodity: "Maruti Suzuki Cars 18-Flat Wagons", weight: 540000, unit: "kg", consignor: "Maruti Suzuki Gurgaon", consignee: "Maruti Depot Bangalore", mode: "Single Stack Container", originStation: "Gurgaon Plant Siding", destStation: "Whitefield ICD Bengaluru", dispatchDate: "2025-07-09", etaDate: "2025-07-12", transitDays: 3, valueLakhs: 320, priorityFlag: "EXP", status: "In Transit Main Line", remarks: "Maruti Alto 18-flat wagons 540 cars Gurgaon to Bengaluru NCR-SWR" },
  { id: "RFL-0006", rrNumber: "RR-2025/07/SC/04567", depot: "CONCOR ChennaiWhitefield ICD", zone: "South Central SC Secunderabad", category: "Container ISO", commodity: "Export Leather 30-TEU Mundra Bound", weight: 380000, unit: "kg", consignor: "Tata Leather Chennai", consignee: "DP World Mundra Port", mode: "Double Stack Container", originStation: "Chennai Port", destStation: "Mundra Port", dispatchDate: "2025-07-10", etaDate: "2025-07-12", transitDays: 2, valueLakhs: 48, priorityFlag: "STD", status: "Rake Formation Yard", remarks: "Export leather containers Chennai to Mundra port 30-TEU rake formation" },
  { id: "RFL-0007", rrNumber: "RR-2025/07/ER/07890", depot: "DFCCIL Paradip Port Odisha", zone: "Eastern Railway Howrah", category: "Coal Rake 58W", commodity: "Import Coal 58-Wagon Rake 3,480T", weight: 3480000, unit: "kg", consignor: "Adani Paradip Port", consignee: "TPS Barh NTPC Bihar", mode: "Rake 58 Wagon Full", originStation: "Paradip Port Yard", destStation: "Barh NTPC Siding", dispatchDate: "2025-07-06", etaDate: "2025-07-08", transitDays: 2, valueLakhs: 185, priorityFlag: "STD", status: "Delivered Consignee", remarks: "Import thermal coal Paradip to NTPC Barh 58-wagon rake 3,480T delivered" },
  { id: "RFL-0008", rrNumber: "RR-2025/07/NR/12345", depot: "CONCOR Tughlakabad ICD Delhi", zone: "Northern Railway Delhi", category: "Petroleum Tank Wagon", commodity: "Motor Spirit MS 22-Tank Wagon Rake", weight: 1100000, unit: "kg", consignor: "IOCL Panipat Refinery", consignee: "IOCL Jalandhar Depot", mode: "Tank Wagon Petroleum", originStation: "Panipat Refinery Siding", destStation: "Jalandhar IOC Depot", dispatchDate: "2025-07-10", etaDate: "2025-07-11", transitDays: 1, valueLakhs: 95, priorityFlag: "STD", status: "In Transit Main Line", remarks: "Motor spirit 22-tank wagon rake Panipat to Jalandhar NR" },
  { id: "RFL-0009", rrNumber: "RR-2025/07/SWR/06789", depot: "CONCOR ChennaiWhitefield ICD", zone: "South Western SW Bengaluru", category: "Steel Coil Flat", commodity: "JSW HR Coils 24-Flat Wagon 1,440T", weight: 1440000, unit: "kg", consignor: "JSW Steel Vijayanagar", consignee: "Tata Steel Processing Kalyani WB", mode: "Flat Wagon Oversize", originStation: "JSW Vijayanagar Siding", destStation: "Kalyani WB Goods", dispatchDate: "2025-07-08", etaDate: "2025-07-11", transitDays: 3, valueLakhs: 210, priorityFlag: "EXP", status: "In Transit Main Line", remarks: "JSW hot-rolled coils 24-flat wagons 1,440T Vijayanagar to Kalyani WB" },
  { id: "RFL-0010", rrNumber: "RR-2025/07/ECR/03456", depot: "CONCOR Dadri ICD NCR", zone: "North Central NCR Prayagraj", category: "Cement FlyAsh Open", commodity: "Ultratech Cement 40-BoxN 2,000T", weight: 2000000, unit: "kg", consignor: "Ultratech Aditya Cement", consignee: "L&T Metro Delhi Site", mode: "Rake 58 Wagon Full", originStation: "Aditya Cement Works", destStation: "Delhi Metro Goods Yard", dispatchDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 40, priorityFlag: "STD", status: "Loaded at Origin", remarks: "Ultratech cement 40-wagon rake 2,000T for L&T metro Delhi construction" },
  { id: "RFL-0011", rrNumber: "RR-2025/07/WR/08901", depot: "DFCCIL JNPT Mumbai Port", zone: "Western Railway Mumbai", category: "Container ISO", commodity: "Pharma Export 15-TEU Cold Chain", weight: 180000, unit: "kg", consignor: "Dr Reddys Hyderabad", consignee: "Rotterdam Port EU", mode: "Single Stack Container", originStation: "Hyderabad ICD", destStation: "JNPT Port", dispatchDate: "2025-07-10", etaDate: "2025-07-11", transitDays: 1, valueLakhs: 450, priorityFlag: "EXP", status: "Customs Examination", remarks: "Pharma cold chain 15-TEU Hyderabad to JNPT export Rotterdam customs hold" },
  { id: "RFL-0012", rrNumber: "RR-2025/07/ER/05678", depot: "CONCOR Kolkata Santragachi", zone: "Eastern Railway Howrah", category: "Food Grain BoxN", commodity: "FCI Wheat 36-Wagon BoxN 2,160T", weight: 2160000, unit: "kg", consignor: "FCI Punjab Ludhiana", consignee: "FCI Bhubaneswar Regional", mode: "Rake 58 Wagon Full", originStation: "Ludhiana FCI Shed", destStation: "Bhubaneswar FCI Depot", dispatchDate: "2025-07-07", etaDate: "2025-07-12", transitDays: 5, valueLakhs: 65, priorityFlag: "STD", status: "Terminal Detention", remarks: "FCI wheat 36-wagon Ludhiana to Bhubaneswar delayed Khurda yard congestion" },
  { id: "RFL-0013", rrNumber: "RR-2025/07/NCR/09012", depot: "DFCCIL Mundra Kutch Port", zone: "Western Railway Mumbai", category: "Iron Ore Wagon", commodity: "Kudremukh Iron Ore 48-Wagon 2,880T", weight: 2880000, unit: "kg", consignor: "KIOCL Kudremukh", consignee: "Mundra Port Pellet Plant", mode: "Rake 58 Wagon Full", originStation: "Kudremukh Mine Siding", destStation: "Mundra Port Yard", dispatchDate: "2025-07-08", etaDate: "2025-07-11", transitDays: 3, valueLakhs: 144, priorityFlag: "STD", status: "In Transit Main Line", remarks: "Iron ore concentrate 48-wagon Kudremukh to Mundra pellet plant 2,880T" },
  { id: "RFL-0014", rrNumber: "RR-2025/07/SC/02345", depot: "CONCOR Visakhapatnam ICD", zone: "South Central SC Secunderabad", category: "Automobile BCACBM", commodity: "Hyundai Cars 20-Flat Wagons 400 Cars", weight: 600000, unit: "kg", consignor: "Hyundai Sriperumbudur", consignee: "Hyundai Depot Nagpur", mode: "Flat Wagon Oversize", originStation: "Sriperumbudur Plant", destStation: "Nagpur ICD", dispatchDate: "2025-07-10", etaDate: "2025-07-12", transitDays: 2, valueLakhs: 280, priorityFlag: "EXP", status: "Rake Formation Yard", remarks: "Hyundai Verna/i20 20-flat wagons 400 cars Chennai to Nagpur rake formation" },
];

const transitCount = records.filter(rec => rec.status === "In Transit Main Line" || rec.status === "Loaded at Origin").length;
const detentionCount = records.filter(rec => rec.status === "Terminal Detention" || rec.status === "Customs Examination" || rec.status === "Rake Formation Yard").length;
const deliveredCount = records.filter(rec => rec.status === "Delivered Consignee").length;
const totalValue = records.reduce((s, rec) => s + rec.valueLakhs, 0);

const kpis = [
  { l: "In Transit", v: transitCount, s: "main line/origin" },
  { l: "Yard/Detention", v: detentionCount, s: "holding" },
  { l: "Delivered", v: deliveredCount, s: "consignee" },
  { l: "Total Freight Value", v: `\u20b9${(totalValue / 100).toFixed(0)}Cr`, s: "all consignments" },
];

const INSIGHTS = [
  {
    t: "Indian Railways Freight: 1,500 MT Daily Loading, 68% Revenue Share, Golden Quadrilateral Network",
    c: "Indian Railways (IR) is the world\u2019s 4th largest railway network (68,000+ km route, 13,000+ trains/day) and Asia\u2019s 2nd largest freight carrier. FY2024-25 freight loading: 1,500 million tonnes (MT), revenue: \u20b91,00,000+ crore (\u20b91 lakh crore), contributing 68% of IR\u2019s total revenue. IR operates 7,500+ freight locomotives (WAG-7, WAG-9, WAG-12 12,000 HP), 300,000+ freight wagons (BOXN, BCN, BOY, tank wagons), and 55+ freight corridors. Key freight segments: (1) Coal: 600+ MT/year (40% of freight), powering 210+ GW thermal power plants (NTPC, Adani Power, Tata Power). (2) Iron ore and steel: 200+ MT (15%), serving SAIL, Tata Steel, JSW, NMDC. (3) Container/exim: 180+ MT (12%), handled by CONCOR (Container Corporation of India, PSU) and private terminals. (4) Food grains (FCI): 120+ MT (8%), government PDS procurement and distribution. (5) Cement and minerals: 100+ MT (7%). (6) Petroleum POL: 80+ MT (5%), IOC/BPCL/HPCL tank wagon rakes. (7) Automobiles: 25+ MT (2%), Maruti Suzuki, Hyundai, Tata Motors finished vehicle logistics. Major freight corridors: (a) Golden Quadrilateral (Delhi-Mumbai-Chennai-Kolkata-Delhi): 6,000+ km, 55% of freight revenue, (b) Dedicated Freight Corridors (DFCCIL): Western DFC (1,506 km JNPT to Dadri) and Eastern DFC (1,875 km Ludhiana to Dankuni), both operational, doubling freight capacity on these routes, (c) North-South and East-West corridors under Bharat Gati Shakti National Master Plan. Major freight terminals: (1) CONCOR ICDs: Tughlakabad (Delhi, largest), Dadri (NCR), Chennai Whitefield, Bangalore Whitefield, Visakhapatnam, Nagpur, Ludhiana, (2) Port-connected rail terminals: JNPT Mumbai, Mundra Kutch, Paradip Odisha, Chennai, Kolkata Haldia, (3) Private freight terminals: Adani Logistics, DP World, Gateway Distriparks (APM Terminals). IR freight modernization: (a) WAG-12 locomotives (Alstom 12,000 HP, 120 km/h freight speed, 6,000+ ordered), (b) Double-stack container trains on WDFC (standard gauge, 15% lower logistics cost), (c) Station redevelopment for freight (100+ stations), (d) Automated freight operation management system (FOIS: Freight Operations Information System), and (e) Private freight train operators (PSFTOs): DFCCIL, IRCTC, ArcelorMittal, DP World approved.",
  },
  {
    t: "Wagon Types, Rake Operations, and CONCOR Container Logistics Across India",
    c: "Indian Railways operates diverse wagon types for different freight categories: (1) BOXN/BBOXN (Covered Goods Wagon): used for food grains (FCI), cement, fertilizers, sugar, and general merchandise. Capacity: 60-80 tonnes per wagon. A typical BOXN rake: 58 wagons, 3,480T (coal), 40 wagons, 2,400T (grain). India has 200,000+ BOXN wagons. (2) BCN/BCAC (Flat Wagon): for steel coils, plates, automobiles (Maruti Suzuki, Hyundai finished vehicles loaded on NMG/NMGS wagons with special car carriers). Capacity: 60-80T per wagon. (3) BOY/BOST (Open Wagon): for coal, iron ore, limestone, and other bulk minerals unloaded by wagon tipplers at power plants and steel mills. Capacity: 60-80T. (4) Tank Wagons (BTPN/BTCN): for petroleum products (motor spirit, HSD, ATF, LPG, naphtha, bitumen). IOC/BPCL/HPCL operate 22-tank wagon rakes for POL distribution from refineries to depots. Capacity: 50-60T per wagon. (5) Container Wagons (ICF-type, Well-type): CONCOR operates 15,000+ ISO container flats (20ft and 40ft). Double-stack container trains (Western DFC): 280 TEU per train (standard gauge, 40ft well wagons). Single-stack (broad gauge): 90 TEU per train. (6) Oversize/Heavy: specialized flat wagons (SRT/SRE) for transformer, turbine blade, heavy machinery transport. Rake formation: a rake is a group of wagons coupled together with a locomotive. Formation time: 4-8 hours at a marshalling yard (Tughlakabad, Mughalsarai, Vizag, Santragachi). Rake length: 600-800 meters (58 wagons). IR operates 8,000+ freight rakes daily. Rake turnaround time: 5-7 days (including loading, transit, unloading, empty return). CONCOR operations: (a) 72 ICDs/CFSs across India, (b) 12,000+ container lifts per day, (c) 300+ scheduled container trains per week, (d) Key routes: JNPT-Delhi (4 trains/day), Chennai-Delhi (2 trains/day), Kolkata-Delhi (2 trains/day), (e) International: Bangladesh (Chittagong), Nepal (Birgunj), Myanmar (Kalay). CONCOR revenue: \u20b98,500 crore FY25, handling 7.5 million TEU. Cold chain: CONCOR and private operators (Snowman, Coldstar) operate reefer container services for pharma, perishables (temperature-controlled -25 to +25 degrees Celsius). Multimodal: road-rail transfer at ICDs, port-rail at JNPT/Mundra.",
  },
  {
    t: "Dedicated Freight Corridors, WAG-12 Locomotives, and Freight Speed Modernization",
    c: "Dedicated Freight Corridor Corporation of India (DFCCIL) is building India\u2019s freight rail backbone: (1) Western DFC (1,506 km): JNPT Mumbai to Dadri (Delhi NCR), via Vadodara, Ahmedabad, Rewari. Operational 2024. Standard gauge (1,435mm), double-stack container, 100 km/h freight speed. Capacity: 1,500+ MT/day (vs 400 MT on existing IR broad gauge). 15% reduction in Delhi-Mumbai logistics cost (\u20b95,000/TEU vs \u20b96,000 by road). (2) Eastern DFC (1,875 km): Ludhiana (Punjab) to Dankuni (Kolkata), via Khurja, Prayagraj, Mughalsarai. Operational 2024. Double-stack container, 100 km/h. Dedicated for coal traffic from Jharkhand/Chhattisgarh to power plants in Punjab/Haryana. (3) East Coast DFC (planned): Kharagpur to Vijayawada (800+ km), serving Paradip, Vizag, Gangavaram ports. (4) North-South DFC (planned): Delhi to Chennai via Hyderabad (2,500+ km). WAG-12 locomotive: (a) Alstom-built (Madhepura factory, Bihar), 12,000 HP (most powerful in India), 120 km/h max speed, (b) 6,000+ units ordered (\u20b935,000 crore), 2,000+ delivered, (c) Three-phase AC, IGBT traction, regenerative braking (15% energy savings), (d) Pulls 6,000-tonne freight trains (vs 4,500T by WAG-9), (e) Reduces transit time by 20-30% on key routes. Freight operations modernization: (a) FOIS (Freight Operations Information System): real-time tracking of all freight rakes (rake position, ETA, consignment details), (b) TTC (Terminal Tracking System): ICD/port terminal management, (c) E-Drafting: online freight booking, eliminating paperwork, (d) RFID wagon tracking: pilot on WDFC for real-time wagon-level position, and (e) ATP (Automatic Train Protection): KAVACH system on freight corridors (auto-braking if signal passed at danger). IR Freight targets: 3,000 MT loading by 2030 (doubling from 1,500 MT), modal share target: 45% of freight by rail (from 27% currently), reducing logistics cost from 14% of GDP to 8%. Bharat Gati Shakti: PM Gati Shakti National Master Plan integrates rail, road, port, airport, waterway logistics planning using GIS-based platform. Challenges: (a) Terminal detention: average 72 hours at terminals (vs 24-hour target), (b) Wagon availability: shortage during peak season (Oct-Mar), (c) Last-mile connectivity: many ICDs lack good road connectivity, and (d) Cross-border: Bangladesh/ Nepal transit requires gauge conversion and customs delays.",
  },
  {
    t: "Freight Revenue Model, FCI Food Distribution, and POL Tank Wagon Network",
    c: "Indian Railways freight revenue model: (1) Freight rate structure: classified into 300+ commodity classes (Class 100-300), distance-based tariffs, surcharges for container, priority, and oversize. Average freight rate: \u20b91.5 per tonne-km (vs \u20b92.5 by road, making rail 40% cheaper). (2) Revenue: \u20b91,00,000+ crore (FY25), of which coal contributes \u20b935,000 crore (35%), container \u20b920,000 crore (20%), food grains \u20b915,000 crore (15%), and others \u20b930,000 crore (30%). (3) Cross-subsidy: IR uses freight revenue surplus to subsidize passenger services (passenger fares cover only 57% of operating cost). The freight-to-passenger cross-subsidy is \u20b935,000-50,000 crore/year. FCI (Food Corporation of India) food grain logistics: (a) India\u2019s PDS (Public Distribution System) distributes 60+ MT of rice and wheat annually to 800 million beneficiaries, (b) FCI operates 2,000+ storage godowns and 500+ procurement centers, (c) Rail is primary mode for long-distance grain movement (Punjab to eastern/southern states: 1,500-2,500 km), (d) 40-wagon BOXN rake carries 2,400T of grain, with 8-12 rakes daily during peak procurement season (April-June), (e) Challenges: leakages (estimated 5-8% transit loss), pest infestation during long detention, and shortage of covered wagons during rabi/kharif procurement. POL (Petroleum, Oil, Lubricants) tank wagon network: (a) India consumes 280 MT of petroleum products annually (FY25), (b) IOCL, BPCL, HPCL operate 12,000+ tank wagons (50-60T each), (c) Tank wagon rakes: 22 wagons per rake, 1,100-1,320T per rake, (d) Routes: refinery to depot (IOCL Panipat to Jalandhar: 350 km, 1 day; BPCL Mumbai to Nagpur: 750 km, 2 days), (e) ATF (Aviation Turbine Fuel): dedicated tank wagon rakes from refineries to airport hydrant depots (Delhi T2, Mumbai CSIA, Bengaluru BLR, Hyderabad HYD), (f) LPG: 22-wagon LPG tank wagon rakes from fractionation plants to bottling plants (IOCL Gujarat to Kolkata: 2,000 km, 3 days). Automobile logistics: (a) Indian auto industry produced 28 million vehicles in FY25 (4th largest globally), (b) Rail carries 2.5+ million finished vehicles annually (9% of production), (c) Maruti Suzuki: largest rail shipper (1.2M cars/year via 15+ auto rakes/week), (d) BCACBM/NMG wagons: 30-40 cars per flat wagon, 18-24 wagons per rake = 540-960 cars per rake, (e) Transit time: Gurgaon to Bangalore: 3 days by rail (vs 5 days by road), (f) Cost savings: 30-40% vs road car carriers. IR\u2019s freight future: (a) 3,000 MT by 2030, (b) 45% modal share, (c) Private freight operators running 500+ trains/day, (d) Artificial Intelligence for demand forecasting and rake planning, and (e) LNG-powered locomotives for green freight (GAIL LNG corridor pilot).",
  },
];

export default function RailwayFreightLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: CONSIGNMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "mode", label: "Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.rrNumber.toLowerCase().includes(q) && !r.depot.toLowerCase().includes(q) && !r.commodity.toLowerCase().includes(q) && !r.consignor.toLowerCase().includes(q) && !r.consignee.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ConsignmentRecord] as string));
  });

  return (
    <div className="rfl-root p-6 space-y-6">
      <PageHeader title="Railway Freight Logistics" description="Indian Railways freight logistics covering CONCOR container, FCI food grain rakes, coal iron ore wagon movement, WAG-12 locomotive, DFCCIL Western and Eastern Dedicated Freight Corridors, automobile logistics and POL tank wagon network" />
      <div className="rfl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`rfl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-blue-700 text-white" : "text-gray-600 hover:bg-blue-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="rfl-dash space-y-6">
          <div className="rfl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="rfl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 rfl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-blue-700 rfl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 rfl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="rfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Freight Tonnage (000T)</h3><BarChart data={monthlyTonnage} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="coal" fill="#0f4c75" radius={[4,4,0,0]} name="Coal" /><Bar dataKey="container" fill="#1b6ca8" radius={[4,4,0,0]} name="Container" /><Bar dataKey="grain" fill="#3282b8" radius={[4,4,0,0]} name="Food Grain" /><Bar dataKey="steel" fill="#5fa8d3" radius={[4,4,0,0]} name="Steel" /></BarChart></div>
            <div className="rfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Freight Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="rfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Freight Punctuality Rate (%) vs 90% Target</h3><LineChart data={punctualityRate} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[70, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0f4c75" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="rfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Depot Performance Score</h3><BarChart data={depotPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[70, 100]} /><Tooltip /><Bar dataKey="v" fill="#1b6ca8" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="rfl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Railway Freight", href: "#" }, { label: "Consignment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="rfl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,RR Number,Depot,Zone,Category,Commodity,Weight,Consignor,Consignee,Mode,Origin,Dispatch Date,ETA,Transit (d),Value (\u20b9L),Priority,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Terminal Detention" ? "rfl-row-critical bg-red-50" : r.status === "Customs Examination" ? "rfl-row-warning bg-amber-50" : r.status === "In Transit Main Line" || r.status === "Loaded at Origin" ? "rfl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-blue-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="rfl-badge inline-block px-2 py-0.5 rounded text-xs bg-blue-700 text-white font-mono text-[10px]">{r.rrNumber}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.depot}</td>
                <td className="px-3 py-2"><span className="rfl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="rfl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.commodity}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.weight >= 1000000 ? `${(r.weight/1000000).toFixed(1)}KT` : r.weight >= 1000 ? `${(r.weight/1000).toFixed(0)}T` : `${r.weight}kg`}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.consignor}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.consignee}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.originStation}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 5 ? "text-red-600" : r.transitDays >= 3 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-blue-700">{r.valueLakhs >= 100 ? `\u20b9${(r.valueLakhs/100).toFixed(1)}Cr` : `\u20b9${r.valueLakhs}L`}</td>
                <td className="px-3 py-2 text-center">{r.priorityFlag === "EXP" ? <span className="rfl-badge inline-block px-2 py-0.5 rounded text-xs bg-orange-500 text-white">EXP</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`rfl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="rfl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="rfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Freight Volume by Zone</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(80, 220, 150 + Math.random() * 40).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0f4c75" radius={[4,4,0,0]} name="000T" /></BarChart></div>
            <div className="rfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Volume by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], coal: ri(20, 50, 35 + Math.sin(i*0.5)*8), container: ri(15, 35, 22 + Math.cos(i*0.6)*6), grain: ri(8, 22, 12 + Math.sin(i*0.7)*4) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="coal" stackId="1" stroke="#0f4c75" fill="#bbe1fa" name="Coal" /><Area type="monotone" dataKey="container" stackId="1" stroke="#1b6ca8" fill="#89c2d9" name="Container" /><Area type="monotone" dataKey="grain" stackId="1" stroke="#3282b8" fill="#5fa8d3" name="Grain" /></AreaChart></div>
          </div>
          <div className="rfl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Mode</h3><BarChart data={[{n:"Rake 58W",v:2},{n:"Double Stack",v:3},{n:"Single Stack",v:2.5},{n:"Flat Wagon",v:3.5},{n:"Tank Wagon",v:1.5},{n:"BG Parcel",v:4}].map(d => ({...d, v: +ri(d.v-0.2, d.v+0.8, d.v + Math.random()*0.4).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#1b6ca8" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="rfl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="rfl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-blue-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
