"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1a472a", "#256d3f", "#2e8b57", "#3cb371", "#66cdaa", "#0d2818", "#145231", "#7ec8a0"];
const DEPOTS = ["DMRC Mukherjee Nagar Depot Delhi", "BMRCL Peenya Depot Bengaluru", "CMRL Koyambedu Depot Chennai", "MMRCL Powai Depot Mumbai", "KMRL Vatva Depot Ahmedabad", "HMRL Miyapur Depot Hyderabad", "JMRC Mansarovar Depot Jaipur", "LMRC Transport Nagar Lucknow"];
const CATEGORIES = ["Metro Coach Type-A", "Signalling CBTC Module", "Third Rail Conductor",("Tunnel Ventilation Fan"), "Escalator Step Chain", "PSD Platform Screen Door", "OHE Overhead Line", "Track Switch Point Machine"];
const TRANSIT_STATUSES = ["Workshop Under Overhaul", "In Transit Flatbed Trailer", "Depot Stabling Ready", "Installation In Progress", "Safety Certification Pending", "Commissioned Active Service"];
const ZONES = ["NCR Delhi Noida Ghaziabad", "Karnataka Bengaluru Mysuru", "Tamil Nadu Chennai Coimbatore", "Maharashtra Mumbai Pune", "Gujarat Ahmedabad Surat", "Telangana Hyderabad Secunderabad"];
const MODES = ["Flatbed Lowboy Trailer",("Road Multi-Axle SPMT"), "Metro Rail Special Train",("Crane Lifting 80T"), "Tunnel Locomotive Muck", "Heavy Crane Derrick"];
const TABS = ["Dashboard", "Component Registry", "Metro Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Workshop Under Overhaul": "amber", "In Transit Flatbed Trailer": "blue", "Depot Stabling Ready": "green", "Installation In Progress": "orange", "Safety Certification Pending": "slate", "Commissioned Active Service": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyMovements = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], coach: ri(3, 8, 5 + Math.sin(i * 0.5) * 1.5), signalling: ri(2, 6, 4 + Math.cos(i * 0.6) * 1), track: ri(4, 10, 7 + Math.sin(i * 0.7) * 2), mechanical: ri(5, 12, 8 + Math.cos(i * 0.8) * 2) }));
const categoryDist = [{ n: "Metro Coach", v: 25 }, { n: "Escalator/Lift", v: 18 }, { n: "PSD Screen Door", v: 15 }, { n: "Track Switch", v: 12 }, { n: "Signalling CBTC", v: 10 }, { n: "Third Rail", v: 8 }, { n: "Tunnel Ventilation", v: 7 }, { n: "OHE Line", v: 5 }];
const reliabilityRate = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(94, 99, 97 + Math.sin(i * 0.4) * 1.2)).toFixed(1), target: 98.0 }));
const depotPerf = DEPOTS.slice(0, 6).map(d => ({ n: d.split(" ").slice(0, 1).join(" "), v: +ri(85, 99, 93 + Math.random() * 4).toFixed(0) }));

interface ComponentRecord { id: string; tagNo: string; depot: string; zone: string; category: string; description: string; weight: number; unit: string; supplier: string; line: string; station: string; mode: string; dispatchDate: string; etaDate: string; transitDays: number; valueLakhs: number; priorityFlag: string; status: string; remarks: string; }

const records: ComponentRecord[] = [
  { id: "MRO-0001", tagNo: "TAG-DMRC/COACH/2025/07-0891", depot: "DMRC Mukherjee Nagar Depot Delhi", zone: "NCR Delhi Noida Ghaziabad", category: "Metro Coach Type-A", description: "Alstom Movia L4 Coach-3 Door Retrofit", weight: 35000, unit: "kg", supplier: "Alstom Transport India", line: "Magenta Line", station: "Botanical Garden Depot", mode: "Flatbed Lowboy Trailer", dispatchDate: "2025-07-08", etaDate: "2025-07-09", transitDays: 1, valueLakhs: 420, priorityFlag: "EXP", status: "In Transit Flatbed Trailer", remarks: "Movia L4 coach-3 from Alstom Savli Gujarat to DMRC Magenta Line depot via flatbed" },
  { id: "MRO-0002", tagNo: "TAG-BMRCL/CBTC/2025/07-1234", depot: "BMRCL Peenya Depot Bengaluru", zone: "Karnataka Bengaluru Mysuru", category: "Signalling CBTC Module", description: "Thales CBTC Wayside Equipment Cabinet", weight: 2800, unit: "kg", supplier: "Thales Transport Security", line: "Purple Line", station: "Peenya Industry Station", mode: "Road Multi-Axle SPMT", dispatchDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 85, priorityFlag: "STD", status: "Installation In Progress", remarks: "Thales CBTC wayside cabinet installation Peenya station Purple Line signalling upgrade" },
  { id: "MRO-0003", tagNo: "TAG-CMRL/3RD-2025/07-0567", depot: "CMRL Koyambedu Depot Chennai", zone: "Tamil Nadu Chennai Coimbatore", category: "Third Rail Conductor", description: "Third Rail Aluminum Contact Rail 12m Section", weight: 850, unit: "kg", supplier: "Alstom Transport India", line: "Blue Line Phase-1", station: "Chennai Airport Stretch", mode: "Metro Rail Special Train", dispatchDate: "2025-07-07", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 12, priorityFlag: "STD", status: "Depot Stabling Ready", remarks: "Third rail conductor 12m section CMRL Blue Line airport stretch stabled at depot" },
  { id: "MRO-0004", tagNo: "TAG-MMRCL/VENT/2025/07-0890", depot: "MMRCL Powai Depot Mumbai", zone: "Maharashtra Mumbai Pune", category: "Tunnel Ventilation Fan", description: "Jet Fan 30kW Tunnel Ventilation System", weight: 1800, unit: "kg", supplier: "FlaktGroup HVAC India", line: "Metro Line-3 Colaba-SEEPZ", station: "Powai Underground Shaft", mode: "Crane Lifting 80T", dispatchDate: "2025-07-10", etaDate: "2025-07-12", transitDays: 2, valueLakhs: 45, priorityFlag: "EXP", status: "In Transit Flatbed Trailer", remarks: "Jet fan 30kW ventilation Powai underground shaft MMRCL Line-3 via crane" },
  { id: "MRO-0005", tagNo: "TAG-KMRL/ESCO/2025/07-1122", depot: "KMRL Vatva Depot Ahmedabad", zone: "Gujarat Ahmedabad Surat", category: "Escalator Step Chain", description: "ThyssenKrupp Escalator Step Chain Assembly", weight: 4500, unit: "kg", supplier: "ThyssenKrupp Elevator India", line: "North-South Corridor", station: "SG Highway Station", mode: "Flatbed Lowboy Trailer", dispatchDate: "2025-07-08", etaDate: "2025-07-09", transitDays: 1, valueLakhs: 28, priorityFlag: "STD", status: "Workshop Under Overhaul", remarks: "TK escalator step chain assembly overhaul at KMRL SG Highway workshop" },
  { id: "MRO-0006", tagNo: "TAG-HMRL/PSD/2025/07-0345", depot: "HMRL Miyapur Depot Hyderabad", zone: "Telangana Hyderabad Secunderabad", category: "PSD Platform Screen Door", description: "Nabtesco Full Height PSD 6-Panel Set", weight: 6200, unit: "kg", supplier: "Nabtesco Japan via India", line: "Red Line Miyapur-LB Nagar", station: "Ameerpet Interchange", mode: "Road Multi-Axle SPMT", dispatchDate: "2025-07-09", etaDate: "2025-07-11", transitDays: 2, valueLakhs: 95, priorityFlag: "EXP", status: "Safety Certification Pending", remarks: "Nabtesco full-height PSD 6-panel Ameerpet interchange safety cert pending RDSO" },
  { id: "MRO-0007", tagNo: "TAG-DMRC/OHE/2025/07-0567", depot: "DMRC Mukherjee Nagar Depot Delhi", zone: "NCR Delhi Noida Ghaziabad", category: "OHE Overhead Line", description: "Cantilever Assembly OHE 25kV AC Section", weight: 3200, unit: "kg", supplier: "Bombay Electric Supply India", line: "Yellow Line Samaypur-Badhli", station: "Samaypur Badhli Terminus", mode: "Crane Lifting 80T", dispatchDate: "2025-07-07", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 18, priorityFlag: "STD", status: "Commissioned Active Service", remarks: "OHE cantilever 25kV AC Yellow Line extension Samaypur-Badhli commissioned" },
  { id: "MRO-0008", tagNo: "TAG-BMRCL/TRK/2025/07-0891", depot: "BMRCL Peenya Depot Bengaluru", zone: "Karnataka Bengaluru Mysuru", category: "Track Switch Point Machine", description: "Vossloh E-Switch Point Machine EM Drive", weight: 450, unit: "kg", supplier: "Vossloh AG Germany India", line: "Green Line Silk Institute-Nagawara", station: "Nagawara Junction", mode: "Road Multi-Axle SPMT", dispatchDate: "2025-07-10", etaDate: "2025-07-10", transitDays: 0, valueLakhs: 35, priorityFlag: "STD", status: "Depot Stabling Ready", remarks: "Vossloh E-Switch point machine Nagawara junction Green Line depot stabling" },
  { id: "MRO-0009", tagNo: "TAG-CMRL/COACH/2025/07-1234", depot: "CMRL Koyambedu Depot Chennai", zone: "Tamil Nadu Chennai Coimbatore", category: "Metro Coach Type-A", description: "Stadler Metro Train Set 4-Car Extension", weight: 140000, unit: "kg", supplier: "Stadler Rail AG Switzerland", line: "Blue Line Phase-2 Extension", station: "Wimco Nagar Depot", mode: "Road Multi-Axle SPMT", dispatchDate: "2025-07-06", etaDate: "2025-07-14", transitDays: 8, valueLakhs: 2800, priorityFlag: "EXP", status: "In Transit Flatbed Trailer", remarks: "Stadler 4-car train set Switzerland port to Chennai Wimco Nagar SPMT convoy" },
  { id: "MRO-0010", tagNo: "TAG-MMRCL/CBTC/2025/07-0678", depot: "MMRCL Powai Depot Mumbai", zone: "Maharashtra Mumbai Pune", category: "Signalling CBTC Module", description: "Alstom Urbalis 400 CBTC Central Server", weight: 1200, unit: "kg", supplier: "Alstom Transport India", line: "Metro Line-3 Colaba-SEEPZ", station: "Marol Naka Control Centre", mode: "Flatbed Lowboy Trailer", dispatchDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 120, priorityFlag: "EXP", status: "Installation In Progress", remarks: "Alstom Urbalis 400 central server installation Marol Naka OCC Line-3" },
  { id: "MRO-0011", tagNo: "TAG-KMRL/TRK/2025/07-0901", depot: "KMRL Vatva Depot Ahmedabad", zone: "Gujarat Ahmedabad Surat", category: "Third Rail Conductor", description: "Composite Insulator Rail Support Assembly", weight: 320, unit: "kg", supplier: "BEML Bengaluru Rail Products", line: "East-West Corridor", station: "Thaltej Curve Section", mode: "Metro Rail Special Train", dispatchDate: "2025-07-10", etaDate: "2025-07-11", transitDays: 1, valueLakhs: 8, priorityFlag: "STD", status: "Commissioned Active Service", remarks: "Composite insulator support KMRL E-W corridor Thaltej curve commissioned" },
  { id: "MRO-0012", tagNo: "TAG-HMRL/VENT/2025/07-0234", depot: "HMRL Miyapur Depot Hyderabad", zone: "Telangana Hyderabad Secunderabad", category: "Tunnel Ventilation Fan", description: "Axial Fan 45kW Station Ventilation Unit", weight: 2400, unit: "kg", supplier: "Howden India Fan Systems", line: "Blue Line Nagole-Raidurg", station: "Raidurg Underground Station", mode: "Crane Lifting 80T", dispatchDate: "2025-07-08", etaDate: "2025-07-09", transitDays: 1, valueLakhs: 32, priorityFlag: "STD", status: "Depot Stabling Ready", remarks: "Axial fan 45kW station ventilation Raidurg underground HMRL Blue Line" },
  { id: "MRO-0013", tagNo: "TAG-JMRC/PSD/2025/07-0456", depot: "JMRC Mansarovar Depot Jaipur", zone: "Rajasthan Jaipur", category: "PSD Platform Screen Door", description: "GOTI Half-Height PSD 8-Panel Gate", weight: 3800, unit: "kg", supplier: "GOTI Access Systems India", line: "Pink Line Mansarovar-Chandpole", station: "Mansarovar Terminus", mode: "Flatbed Lowboy Trailer", dispatchDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 42, priorityFlag: "STD", status: "Safety Certification Pending", remarks: "GOTI half-height PSD 8-panel Mansarovar station safety cert pending" },
  { id: "MRO-0014", tagNo: "TAG-LMRC/ESCO/2025/07-0789", depot: "LMRC Transport Nagar Lucknow", zone: "Uttar Pradesh Lucknow", category: "Escalator Step Chain", description: "KONE Escalator Gearbox Assembly", weight: 6500, unit: "kg", supplier: "KONE Elevator India", line: "Red Line Transport Nagar-Charbagh", station: "Hazaratganj Station", mode: "Crane Lifting 80T", dispatchDate: "2025-07-07", etaDate: "2025-07-09", transitDays: 2, valueLakhs: 22, priorityFlag: "STD", status: "Workshop Under Overhaul", remarks: "KONE escalator gearbox overhaul LMRC Hazaratganj workshop Transport Nagar depot" },
];

const transitCount = records.filter(rec => rec.status === "In Transit Flatbed Trailer").length;
const workCount = records.filter(rec => rec.status === "Workshop Under Overhaul" || rec.status === "Installation In Progress").length;
const readyCount = records.filter(rec => rec.status === "Depot Stabling Ready" || rec.status === "Commissioned Active Service").length;
const totalValue = records.reduce((s, rec) => s + rec.valueLakhs, 0);

const kpis = [
  { l: "In Transit", v: transitCount, s: "flatbed trailer" },
  { l: "Workshop/Install", v: workCount, s: "overhaul/install" },
  { l: "Ready/Active", v: readyCount, s: "stabled/service" },
  { l: "Total Component Value", v: `\u20b9${(totalValue / 100).toFixed(0)}Cr`, s: "all movements" },
];

const INSIGHTS = [
  {
    t: "India Metro Rail Network: 900+ km Operational, 13 Cities, DMRC BMRCL CMRL MMRCL Expansion",
    c: "India has the world\u2019s 4th largest metro rail network (900+ km operational, 2025), with 13 operational systems and 8 under construction. India\u2019s metro revolution started with Kolkata Metro (1984, first in India), followed by Delhi Metro (2002), and has expanded rapidly under the Modi government\u2019s Metro Rail Policy 2017. Current operational systems: (1) DMRC Delhi Metro: 393 km (largest in India, 12 lines, 285 stations), carrying 28 lakh passengers/day. Delhi Metro is India\u2019s only profitable metro (operating surplus since 2015). Phases: Phase-I (65 km, 2006), Phase-II (125 km, 2011), Phase-III/IV (203 km, ongoing). Rolling stock: 400+ train sets (Movia L4, Mitsubishi, BEML, Alstom). (2) BMRCL Namma Metro Bengaluru: 73 km (2 lines, 66 stations), carrying 6 lakh passengers/day. Phase-2 under construction (120 km). (3) CMRL Chennai Metro: 54 km (2 lines, 44 stations), carrying 4 lakh/day. Phase-2 (118 km) under construction. (4) MMRCL Mumbai Metro Line-3: 33.5 km (Colaba to SEEPZ, fully underground), under construction, cost \u20b933,600 crore. (5) Hyderabad Metro (HMRL/L&TMRHL): 69 km (3 lines, 57 stations), India\u2019s largest PPP metro. (6) KMRL Kochi Metro: 28 km (1 line), India\u2019s first water metro integrated with metro. (7) Jaipur Metro (JMRC): 12 km (Pink Line). (8) Lucknow Metro (LMRC): 23 km (Red Line). (9) Nagpur Metro (MahaMetro): 40 km (2 lines, India\u2019s widest metro stations). (10) Ahmedabad Metro (GMRC): 40 km (2 lines, 2022). Under construction: Noida Metro (Aqua Line), Pune Metro (PMRCL), Kanpur Metro, Agra Metro, Surat Metro, Bhopal Metro, Indore Metro. India\u2019s metro investment: \u20b910,00,000 crore (USD 120 billion) committed or spent across all projects. Funding: 50-60% central government (MOFTH), 20-30% state government, 10-20% multilateral loans (JICA, ADB, AIIB), and private participation via PPP. Metro logistics complexity: (a) Underground construction (TBMs: 150+ Tunnel Boring Machines used in India), (b) Elevated viaduct (span 30-40m, segmental construction), (c) At-grade and depot lines, (d) Integration with Indian Railways stations (New Delhi, CSMT Mumbai, Secunderabad), (e) Multi-modal integration with bus, auto, bicycle last-mile.",
  },
  {
    t: "Metro Rolling Stock, CBTC Signalling, and Depot Workshop Logistics",
    c: "India\u2019s metro rolling stock fleet: 1,200+ train sets across 13 cities. (1) DMRC: 400+ train sets (Movia L4 Alstom: 200 sets, Mitsubishi: 100 sets, BEML: 50 sets, CSR Qingdao: 50 sets). Coach dimensions: 22m x 3.2m, weight 35-40T per coach. Train sets: 4, 6, or 8 cars. Width gauge: standard gauge 1,435mm (DMRC, BMRCL, MMRCL) and broad gauge 1,676mm (Kolkata, LMRC Nagpur). (2) BMRCL: 60+ train sets (BEML, CSR Qingdao). (3) CMRL: 45+ sets (Alstom Movia, BEML). (4) HMRL: 60+ sets (Hyundai Rotem, CSR Qingdao). Depot logistics: each metro operates 1-3 depots (workshop + stabling + washing). DMRC has 12 depots. Depot facilities: (a) Workshop: C-1 (light overhaul every 60,000 km or 6 months), C-2 (heavy overhaul every 600,000 km or 6 years), C-3 (major overhaul/ lifecycle extension every 12 years). (b) Stabling: overnight train parking (100-200 trains per depot). (c) Washing: automatic train wash plant (3 minutes per train). (d) Wheel lathe: reprofiling wheel tread (every 80,000 km). (e) Pantograph measurement: contact strip wear monitoring. Signalling: India metros use CBTC (Communications-Based Train Control) for minimum headway (90-120 seconds). CBTC vendors: (a) Thales (DMRC Phase-III, CMRL, MMRCL), (b) Alstom Urbalis 400 (BMRCL Phase-2, HMRL), (c) Siemens Trainguard MT (DMRC Phase-II), (d) Hitachi (KMRL, JMRC). CBTC equipment logistics: wayside equipment cabinets (balises, LEU, axle counters) installed at 50-100m intervals along track. Each cabinet: 200-400 kg. Power supply: 25 kV AC overhead (DMRC Yellow/Violet), 750V DC third rail (DMRC Blue/Green, BMRCL, CMRL). Third rail logistics: aluminium conductor rail (12m sections, 850 kg each) installed by tunnel locomotive. OHE (Overhead Equipment): cantilever assembly, contact wire, catenary, insulators. Track: rail type 60R (60 kg/m), ballasted (at-grade) or slab track (underground/elevated). Point machines: Vossloh E-Switch or Alstom electrically operated. Escalators: 2,000+ metro escalators (ThyssenKrupp, KONE, Otis, Johnson Lifts). Escalator logistics: step chain replacement every 5 years, gear box overhaul at depot workshop. PSD (Platform Screen Doors): 1,500+ platforms equipped. Vendors: Nabtesco (Japan), GOTI (Italy/India), Kangni (China). PSD logistics: full-height (underground, 6-panel: 6.2T), half-height (elevated, 8-panel: 3.8T). Installation by crane at station platform level.",
  },
  {
    t: "Tunnel Boring Machine Logistics, Underground Construction, and Last-Mile Integration",
    c: "India\u2019s metro underground construction uses 150+ Tunnel Boring Machines (TBMs) since 2000. TBM logistics: (a) TBM delivery: Herrenknecht (Germany), Robbins (US), Kawasaki (Japan), Hitachi Zosen (Japan), CREC (China). TBM weight: 400-1,200 tonnes. Diameter: 5.8-6.7m (standard for metro). TBM transported from port (Mundra, Chennai) to site on 30-60 axle self-propelled modular transporters (SPMT), 3-5 km at 5 km/h. Road widening and bridge strengthening required for TBM convoys. (b) TBM assembly at launch shaft: disassembled into 5-10 modules (cutterhead, shield, erector, backup), each 50-150T, assembled underground using 50T gantry crane. Assembly time: 2-3 months. (c) Muck disposal: 3,000-5,000 TBM muck/day (per TBM). Muck transported via muck trains (underground electric locomotive, 10T wagons) to muck shaft, then truck to disposal site (30-50 km from city). Delhi Metro TBM muck: 50+ million cubic metres disposed for Phase-III (30 km underground). (d) Segmental lining: concrete segments (1.5m wide, 350mm thick, 5-6 segments per ring). Segments cast at casting yards near site (150,000+ segments per project). Underground station construction: cut-and-cover (shallow stations, 15-20m deep) and NATM/New Austrian Tunnelling Method (deep stations, 25-35m deep). Station excavation: 100,000-300,000 cubic metres per station, taking 18-24 months. Utilities diversion: water, sewer, gas, electricity, telecom relocated before station construction (6-12 months). India\u2019s TBM records: (a) Deepest metro station: Hauz Khas Delhi (34m), (b) Longest tunnel: MMRCL Line-3 (33.5 km continuous), (c) Fastest TBM: DMRC Magenta Line (25 m/day peak), (d) Most TBMs simultaneously: MMRCL Line-3 (17 TBMs at peak). Last-mile integration: (a) Feeder bus service: 200+ feeder bus routes at DMRC stations, (b) Bicycle sharing: 200+ cycle docking stations at DMRC, BMRCL, HMRL stations, (c) Auto-rickshaw stands: designated at every station, (d) Pedestrian subways and foot overbridges: 500+ built, (e) Park-and-ride: 50+ parking facilities at metro stations (total 40,000+ car capacity), and (f) Multi-modal hubs: Anand Vihar, Kashmiri Gate (Delhi), Silk Board (Bengaluru), CMBT (Chennai). Metro expansion plans: India target: 2,000 km metro by 2030 (from 900 km). Under construction: 700+ km across 8 cities.",
  },
  {
    t: "Metro Safety, Revenue Model, and India\u2019s Urban Transit Future",
    c: "India metro safety is governed by RDSO (Research Designs and Standards Organisation) and state-level Metro Rail Safety Commissioners: (1) Safety certification: all metro components (rolling stock, signalling, PSD, escalators) require RDSO approval before passenger service. Safety audit: annual third-party audit by RDSO-approved agencies. (2) Incident record: India metros have had 5-8 derailments (DMRC 2019 Yellow Line, BMRCL 2022), 10+ signalling failures, and 2-3 fire incidents in 20 years. Fatality record: 15-20 fatalities (mostly at construction sites, 2-3 passenger incidents). (3) Emergency response: DMRC has 12 fire stations at metro stations, emergency evacuation drills quarterly, CISF security at all stations (35,000+ CISF personnel for DMRC). (4) Platform gap management: PSD eliminates platform fall risk (99% of underground/elevated stations now have PSD). Revenue model: (a) Fare box revenue: 50-60% of operating cost (DMRC: \u20b912/km average fare, \u20b91,500 crore/year fare revenue). Fare structures: distance-based (DMRC), time-based (HMRL hybrid). (b) Non-fare revenue: 30-40% from advertising (DMRC: \u20b9400 crore/year), retail at stations (ATMs, food, convenience), parking fees, and property development (cross-subsidy model: air rights above stations sold to developers). (c) Operating cost: \u20b92,500 crore/year (DMRC), including electricity (\u20b91,200 crore, 15% of India\u2019s metro electricity cost), staff (25,000+ employees DMRC), and maintenance. India\u2019s metro challenges: (a) Financial: most state metros operate at 40-60% fare box recovery (target 80%). Only DMRC profitable. Total metro debt: \u20b91,50,000 crore (state governments). (b) Construction delays: average 3-5 year delay per line (land acquisition, utilities, forest/environment clearance). (c) Last-mile: feeder connectivity gap reduces ridership by 20-30%. (d) Capacity: peak hour overcrowding on DMRC Yellow/Blue (150% load factor during rush). India\u2019s urban transit future: (a) Metro expansion: 2,000 km by 2030, (b) Regional rail (RRTS): Delhi-Meerut (82 km, India\u2019s first RRTS), Delhi-Alwar, Delhi-Panipat under construction, (c) MetroLite/MetroNeo: smaller, lower-cost metro for tier-2 cities (20-40 km, cost \u20b91,500 crore vs \u20b94,000 crore for full metro), (d) Monorail: Mumbai Chembur-Wadala (20 km, operational but challenged), (e) Tram/light rail: Kolkata (oldest), proposed for other heritage cities, and (f) Hyperloop: Mumbai-Pune feasibility study (Virgin Hyperloop, 150 km in 25 minutes). Technology trends: driverless trains (UTO: Unattended Train Operation, DMRC Magenta Line India\u2019s first), 5G-based CBTC (HMRL pilot), digital twin (DMRC OCC modernization), and AI for crowd management.",
  },
];

export default function MetroRailOperationsLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: TRANSIT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "mode", label: "Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.tagNo.toLowerCase().includes(q) && !r.depot.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.supplier.toLowerCase().includes(q) && !r.line.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ComponentRecord] as string));
  });

  return (
    <div className="mrl-root p-6 space-y-6">
      <PageHeader title="Metro Rail Operations Logistics" description="India metro rail component supply chain covering DMRC BMRCL CMRL MMRCL HMRL KMRL, Alstom Movia coach, Thales CBTC signalling, third rail OHE, tunnel ventilation jet fan, escalator PSD, TBM logistics, depot overhaul, RDSO safety certification and urban transit integration" />
      <div className="mrl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`mrl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-green-700 text-white" : "text-gray-600 hover:bg-green-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="mrl-dash space-y-6">
          <div className="mrl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="mrl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 mrl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-green-700 mrl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 mrl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Component Movements (Units)</h3><BarChart data={monthlyMovements} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="coach" fill="#1a472a" radius={[4,4,0,0]} name="Coach" /><Bar dataKey="signalling" fill="#256d3f" radius={[4,4,0,0]} name="Signalling" /><Bar dataKey="track" fill="#2e8b57" radius={[4,4,0,0]} name="Track" /><Bar dataKey="mechanical" fill="#3cb371" radius={[4,4,0,0]} name="Mechanical" /></BarChart></div>
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Component Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">System Reliability Rate (%) vs 98% Target</h3><LineChart data={reliabilityRate} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[92, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#1a472a" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Depot Performance Score</h3><BarChart data={depotPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[83, 100]} /><Tooltip /><Bar dataKey="v" fill="#256d3f" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="mrl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Metro Rail Ops", href: "#" }, { label: "Component Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="mrl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Tag No,Depot,Zone,Category,Description,Weight,Supplier,Line,Station,Mode,Dispatch,ETA,Transit (d),Value (\u20b9L),Priority,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Workshop Under Overhaul" ? "mrl-row-warning bg-amber-50" : r.status === "Installation In Progress" ? "mrl-row-info bg-blue-50" : r.status === "Safety Certification Pending" ? "mrl-row-warning bg-amber-50" : r.status === "In Transit Flatbed Trailer" ? "mrl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-green-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="mrl-badge inline-block px-2 py-0.5 rounded text-xs bg-green-700 text-white font-mono text-[10px]">{r.tagNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.depot}</td>
                <td className="px-3 py-2"><span className="mrl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="mrl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.weight >= 1000 ? `${(r.weight/1000).toFixed(1)}T` : `${r.weight}kg`}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.supplier}</td>
                <td className="px-3 py-2 text-xs">{r.line}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.station}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 5 ? "text-red-600" : r.transitDays >= 2 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-green-700">{r.valueLakhs >= 100 ? `\u20b9${(r.valueLakhs/100).toFixed(0)}Cr` : `\u20b9${r.valueLakhs}L`}</td>
                <td className="px-3 py-2 text-center">{r.priorityFlag === "EXP" ? <span className="mrl-badge inline-block px-2 py-0.5 rounded text-xs bg-orange-500 text-white">EXP</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`mrl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="mrl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Component Volume by Zone</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(12, 30, 20 + Math.random() * 6).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#1a472a" radius={[4,4,0,0]} name="Units" /></BarChart></div>
            <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Volume by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], coach: ri(2, 5, 3 + Math.sin(i*0.5)*1), signalling: ri(1, 4, 2.5 + Math.cos(i*0.6)*0.8), track: ri(3, 7, 5 + Math.sin(i*0.7)*1) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="coach" stackId="1" stroke="#1a472a" fill="#7ec8a0" name="Coach" /><Area type="monotone" dataKey="signalling" stackId="1" stroke="#256d3f" fill="#66cdaa" name="Signalling" /><Area type="monotone" dataKey="track" stackId="1" stroke="#2e8b57" fill="#3cb371" name="Track" /></AreaChart></div>
          </div>
          <div className="mrl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Mode</h3><BarChart data={[{n:"Flatbed Lowboy",v:1.5},{n:"Multi-Axle SPMT",v:2},{n:"Metro Special",v:1},{n:"Crane 80T",v:2.5},{n:"Tunnel Loco",v:3},{n:"Heavy Derrick",v:4}].map(d => ({...d, v: +ri(d.v*0.7, d.v*1.3, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#256d3f" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="mrl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="mrl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-green-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
