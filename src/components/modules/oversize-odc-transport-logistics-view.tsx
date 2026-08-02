"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#4a3728", "#6b4f3a", "#8b6f5c", "#a3846d", "#c9a882", "#3d2e1f", "#5c4433", "#d4b896"];
const ORIGINS = ["BHEL Hyderabad Works", "L&T Hazira Shipyard", "SAIL Bhilai Steel Plant", "Alstom Bengaluru Factory", "GE Energy Vadodara", "Siemens Mundra Port", "DLW Varanasi Workshop", "BGR Energy Chennai"];
const CATEGORIES = ["Power Transformer 200MVA", "Wind Turbine Blade 65M", "Bridge Girder I-Section", "Tunnel Boring Machine Shield", "Nuclear Pressure Vessel", "Steam Turbine Rotor 120T", "Crane Boom Section 40M", "Hydro Generator Stator"];
const SHIPMENT_STATUSES = ["Permit Approved NHAI", "Loading at Origin Port", "Convoy En Route Highway", " axle Load Check RTO", "Bridge Bypass Rerouted", "Delivered Site Unloaded"];
const ZONES = ["South India Industrial Belt", "West India Coastal Zone", "East India Steel Corridor", "North India Power Hub", "Central India Mining Belt", "NE India Hydro Corridor"];
const MODES = ["Multi-Axle Trailer 40T", ("Hydraulic Modular Trailer"), "Self-Propelled SPMT 300T", "Flatbed Lowbed 60T", "Barge Coastal Inland", "Rail Heavy Haul WAG-12"];
const TABS = ["Dashboard", "Shipment Registry", "ODC Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Permit Approved NHAI": "green", "Loading at Origin Port": "amber", "Convoy En Route Highway": "blue", " axle Load Check RTO": "orange", "Bridge Bypass Rerouted": "red", "Delivered Site Unloaded": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyODC = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], transformer: ri(3, 12, 7 + Math.sin(i * 0.5) * 3), wind: ri(2, 8, 5 + Math.cos(i * 0.6) * 2), girder: ri(1, 6, 3 + Math.sin(i * 0.7) * 2), heavy: ri(1, 4, 2 + Math.cos(i * 0.8) * 1) }));
const categoryDist = [{ n: "Power Transformer", v: 28 }, { n: "Wind Turbine Blade", v: 22 }, { n: "Bridge Girder", v: 18 }, { n: "TBM Shield", v: 12 }, { n: "Nuclear Vessel", v: 8 }, { n: "Turbine Rotor", v: 6 }, { n: "Crane Boom", v: 4 }, { n: "Hydro Stator", v: 2 }];
const permitCompliance = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(92, 100, 96 + Math.sin(i * 0.4) * 2.5)).toFixed(1), target: 95 }));
const regionPerf = ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(85, 98, 92 + Math.random() * 3).toFixed(0) }));

interface ODCRecord { id: string; permitNo: string; origin: string; zone: string; category: string; description: string; weight: number; length: number; consignee: string; project: string; route: string; mode: string; dispatchDate: string; etaDate: string; transitDays: number; valueLakhs: number; escortType: string; status: string; remarks: string; }

const records: ODCRecord[] = [
  { id: "ODC-0001", permitNo: "NHAI/ODC/2025/HYD-4521", origin: "BHEL Hyderabad Works", zone: "South India Industrial Belt", category: "Power Transformer 200MVA", description: "BHEL 200MVA 400/220kV Power Transformer", weight: 185000, length: 12.5, consignee: "TSGENCO Hyderabad", project: "Kothagudem TPS Unit-7", route: "Hyderabad - Suryapet - Khammam - Kothagudem NH65", mode: "Multi-Axle Trailer 40T", dispatchDate: "2025-07-06", etaDate: "2025-07-10", transitDays: 4, valueLakhs: 850, escortType: "FULL", status: "Convoy En Route Highway", remarks: "BHEL 200MVA transformer Hyderabad to Kothagudem thermal power station unit-7" },
  { id: "ODC-0002", permitNo: "NHAI/ODC/2025/HZS-7832", origin: "L&T Hazira Shipyard", zone: "West India Coastal Zone", category: "Wind Turbine Blade 65M", description: "Suzlon S128 65M Wind Turbine Blade", weight: 14000, length: 65, consignee: "Suzlon Energy Bhuj", project: "Gujarat Wind Farm Phase-3", route: "Hazira - Bharuch - Ahmedabad - Rajkot - Bhuj NH8", mode: "Flatbed Lowbed 60T", dispatchDate: "2025-07-08", etaDate: "2025-07-12", transitDays: 4, valueLakhs: 120, escortType: "PILOT", status: "Loading at Origin Port", remarks: "Suzlon S128 65m blade Hazira shipyard to Bhuj wind farm Gujarat phase-3" },
  { id: "ODC-0003", permitNo: "NHAI/ODC/2025/BIL-2190", origin: "SAIL Bhilai Steel Plant", zone: "East India Steel Corridor", category: "Bridge Girder I-Section", description: "SAIL Steel I-Girder 45M Span for Railway Overbridge", weight: 62000, length: 45, consignee: "IRCON International", project: "Howrah ROB Widening", route: "Bhilai - Raipur - Sambalpur - Cuttack - Bhubaneswar - Howrah NH6", mode: "Multi-Axle Trailer 40T", dispatchDate: "2025-07-05", etaDate: "2025-07-12", transitDays: 7, valueLakhs: 340, escortType: "FULL", status: "Convoy En Route Highway", remarks: "SAIL steel I-girder 45m span Bhilai to Howrah ROB widening IRCON project" },
  { id: "ODC-0004", permitNo: "NHAI/ODC/2025/BLR-5567", origin: "Alstom Bengaluru Factory", zone: "South India Industrial Belt", category: "Tunnel Boring Machine Shield", description: "Alstom Earth Pressure Balance TBM Shield 6.28m Dia", weight: 320000, length: 9.8, consignee: "L&T Metro Bhopal", project: "Bhopal Metro Line-2 Tunnelling", route: "Bengaluru - Pune - Mumbai - Indore - Bhopal NH48/NH52", mode: "Self-Propelled SPMT 300T", dispatchDate: "2025-07-04", etaDate: "2025-07-14", transitDays: 10, valueLakhs: 4500, escortType: "FULL", status: "Bridge Bypass Rerouted", remarks: "Alstom EPB TBM 6.28m shield Bengaluru to Bhopal metro line-2 tunnel boring" },
  { id: "ODC-0005", permitNo: "NHAI/ODC/2025/VDH-9012", origin: "GE Energy Vadodara", zone: "West India Coastal Zone", category: "Steam Turbine Rotor 120T", description: "GE 120T HP Steam Turbine Rotor Forged", weight: 120000, length: 8.5, consignee: "NTPC Barh Bihar", project: "Barh STPP Stage-II Unit-3", route: "Vadodara - Ahmedabad - Delhi - Agra - Kanpur - Barh NH8/NH2", mode: "Hydraulic Modular Trailer", dispatchDate: "2025-07-07", etaDate: "2025-07-13", transitDays: 6, valueLakhs: 2200, escortType: "FULL", status: "Permit Approved NHAI", remarks: "GE 120T HP rotor Vadodara forge to NTPC Barh STPP stage-II unit-3 Bihar" },
  { id: "ODC-0006", permitNo: "NHAI/ODC/2025/MND-3345", origin: "Siemens Mundra Port", zone: "West India Coastal Zone", category: "Power Transformer 200MVA", description: "Siemens 315MVA 765/400kV Autotransformer", weight: 210000, length: 14.2, consignee: "PGCIL Wardha", project: "Wardha PSR 765kV Substation", route: "Mundra - Ahmedabad - Udaipur - Indore - Nagpur - Wardha NH8", mode: "Self-Propelled SPMT 300T", dispatchDate: "2025-07-09", etaDate: "2025-07-14", transitDays: 5, valueLakhs: 1800, escortType: "FULL", status: "Loading at Origin Port", remarks: "Siemens 315MVA 765/400kV autotransformer Mundra port to PGCIL Wardha" },
  { id: "ODC-0007", permitNo: "NHAI/ODC/2025/VAR-6678", origin: "DLW Varanasi Workshop", zone: "North India Power Hub", category: "Crane Boom Section 40M", description: "DLW 40M Lattice Boom Section for EOT Crane", weight: 28000, length: 40, consignee: "SAIL Rourkela", project: "Rourkela Steel Plant Blast Furnace-3", route: "Varanasi - Lucknow - Kanpur - Jhansi - Bhopal - Nagpur - Rourkela NH7", mode: "Rail Heavy Haul WAG-12", dispatchDate: "2025-07-08", etaDate: "2025-07-13", transitDays: 5, valueLakhs: 180, escortType: "PILOT", status: "Convoy En Route Highway", remarks: "DLW 40m lattice boom section Varanasi to SAIL Rourkela blast furnace crane" },
  { id: "ODC-0008", permitNo: "NHAI/ODC/2025/CHN-1122", origin: "BGR Energy Chennai", zone: "South India Industrial Belt", category: "Hydro Generator Stator", description: "BGR 250MW Hydro Generator Stator Frame", weight: 95000, length: 7.2, consignee: "NHPC Teesta-V Sikkim", project: "Teesta-V HE Project 1200MW", route: "Chennai - Kolkata - Siliguri - Gangtok NH16/NH31", mode: "Flatbed Lowbed 60T", dispatchDate: "2025-07-06", etaDate: "2025-07-15", transitDays: 9, valueLakhs: 950, escortType: "FULL", status: " axle Load Check RTO", remarks: "BGR 250MW hydro stator frame Chennai to NHPC Teesta-V Sikkim mountainous" },
  { id: "ODC-0009", permitNo: "NHAI/ODC/2025/HYD-8890", origin: "BHEL Hyderabad Works", zone: "South India Industrial Belt", category: "Nuclear Pressure Vessel", description: "NPCIL Pressurizer Vessel 60T SS316LN", weight: 60000, length: 5.5, consignee: "NPCIL Gujarat Site", project: "PHWR-700 Kakrapar Unit-4", route: "Hyderabad - Pune - Mumbai - Vapi - Surat - Kakrapar NH65", mode: "Self-Propelled SPMT 300T", dispatchDate: "2025-07-07", etaDate: "2025-07-11", transitDays: 4, valueLakhs: 3200, escortType: "FULL", status: "Convoy En Route Highway", remarks: "NPCIL pressurizer vessel 60T SS316LN Hyderabad to Kakrapar nuclear plant" },
  { id: "ODC-0010", permitNo: "NHAI/ODC/2025/HZS-4456", origin: "L&T Hazira Shipyard", zone: "West India Coastal Zone", category: "Wind Turbine Blade 65M", description: "Vestas V150 62M Wind Blade Carbon Hybrid", weight: 18500, length: 62, consignee: "Renew Power Jaisalmer", project: "Jaisalmer Wind Park 600MW", route: "Hazira - Ahmedabad - Jodhpur - Jaisalmer NH14", mode: "Flatbed Lowbed 60T", dispatchDate: "2025-07-10", etaDate: "2025-07-14", transitDays: 4, valueLakhs: 95, escortType: "PILOT", status: "Permit Approved NHAI", remarks: "Vestas V150 62m carbon blade Hazira to Jaisalmer wind park 600MW Rajasthan" },
  { id: "ODC-0011", permitNo: "NHAI/ODC/2025/BIL-7789", origin: "SAIL Bhilai Steel Plant", zone: "East India Steel Corridor", category: "Bridge Girder I-Section", description: "SAIL Box Girder 50M for Expressway Viaduct", weight: 78000, length: 50, consignee: "NHAI Lucknow-Agra Expressway", project: "Bundelkhand Expressway Package-4", route: "Bhilai - Raipur - Jabalpur - Jhansi - Orai - Kanpur NH44", mode: "Hydraulic Modular Trailer", dispatchDate: "2025-07-09", etaDate: "2025-07-16", transitDays: 7, valueLakhs: 420, escortType: "FULL", status: "Bridge Bypass Rerouted", remarks: "SAIL box girder 50m Bhilai to Bundelkhand expressway NHAI viaduct" },
  { id: "ODC-0012", permitNo: "NHAI/ODC/2025/BLR-2234", origin: "Alstom Bengaluru Factory", zone: "South India Industrial Belt", category: "Tunnel Boring Machine Shield", description: " Herrenknecht Slurry TBM Cutterhead 6.7m", weight: 145000, length: 6.7, consignee: "Afcons Mumbai Coastal Rd", project: "Mumbai Coastal Road Tunnel-2", route: "Bengaluru - Hubli - Belagavi - Pune - Mumbai NH48", mode: "Self-Propelled SPMT 300T", dispatchDate: "2025-07-08", etaDate: "2025-07-12", transitDays: 4, valueLakhs: 2800, escortType: "FULL", status: "Delivered Site Unloaded", remarks: "Herrenknecht slurry TBM cutterhead 6.7m Bengaluru to Mumbai coastal road" },
  { id: "ODC-0013", permitNo: "NHAI/ODC/2025/VDH-5567", origin: "GE Energy Vadodara", zone: "West India Coastal Zone", category: "Steam Turbine Rotor 120T", description: "GE 80T IP Steam Turbine Rotor 800MW", weight: 80000, length: 7.8, consignee: "Adani Mundra UMPP", project: "Mundra UMPP Unit-4", route: "Vadodara - Bharuch - Surat - Ankleshwar - Mundra NH8", mode: "Hydraulic Modular Trailer", dispatchDate: "2025-07-10", etaDate: "2025-07-12", transitDays: 2, valueLakhs: 1600, escortType: "FULL", status: "Convoy En Route Highway", remarks: "GE 80T IP rotor Vadodara to Adani Mundra UMPP unit-4 steam turbine" },
  { id: "ODC-0014", permitNo: "NHAI/ODC/2025/CHN-9901", origin: "BGR Energy Chennai", zone: "South India Industrial Belt", category: "Power Transformer 200MVA", description: "BGR 160MVA 220/132kV Generator Transformer", weight: 165000, length: 11.8, consignee: "TNEB North Chennai TPS", project: "NC TPS Stage-III Unit-5", route: "Chennai Ennore Port - Minjur - Thiruvottiyur 30km local", mode: "Multi-Axle Trailer 40T", dispatchDate: "2025-07-11", etaDate: "2025-07-12", transitDays: 1, valueLakhs: 680, escortType: "PILOT", status: "Permit Approved NHAI", remarks: "BGR 160MVA gen transformer Chennai port to TNEB North Chennai TPS stage-III" },
];

const transitCount = records.filter(rec => rec.status === "Convoy En Route Highway").length;
const workCount = records.filter(rec => rec.status === "Loading at Origin Port" || rec.status === " axle Load Check RTO").length;
const liveCount = records.filter(rec => rec.status === "Permit Approved NHAI" || rec.status === "Delivered Site Unloaded").length;
const totalValue = records.reduce((s, rec) => s + rec.valueLakhs, 0);

const kpis = [
  { l: "En Route Convoy", v: transitCount, s: "highway active" },
  { l: "Loading/Checks", v: workCount, s: "port/rto pending" },
  { l: "Permit/Delivered", v: liveCount, s: "cleared/ready" },
  { l: "Total ODC Value", v: `\u20b9${(totalValue / 100).toFixed(1)}Cr`, s: "all shipments" },
];

const INSIGHTS = [
  {
    t: "India ODC Transport: NHAI Permit Regime, Axle Load Norms, Rs 50,000 Crore Annual Market",
    c: "India\u2019s oversize/over-dimensional cargo (ODC) logistics market is valued at \u20b950,000 crore annually (USD 6 billion), driven by infrastructure mega-projects: power plants, metro rail, highways, nuclear energy, and wind/solar farms. NHAI (National Highways Authority of India) governs ODC movement on national highways under the Motor Vehicles Act 1988 and Central Motor Vehicles Rules 1989. Permit categories: (a) Single trip permit (valid 7 days for one consignment), (b) Route-specific permit (for repeated movement on fixed corridor like BHEL to power plant), (c) Temporary permit for abnormal load exceeding 49m length or 80T weight. NHAI fees: \u20b9500-5000 per trip depending on dimensions and distance. Axle load limits: Indian roads designed for 10.2T per axle (single) and 20.3T per tandem axle. ODC transporters must apply axle-by-axle load analysis certified by RDSO (Research Designs and Standards Organisation). Penalties for overload: \u20b920,000 per axle plus confiscation risk. Major ODC corridors: (1) BHEL Hyderabad to Telangana/Andhra/Karnataka power plants (200+ transformers/year), (2) L&T/SLK Hazira to Gujarat/Rajasthan wind farms (500+ blades/year), (3) SAIL Bhilai/Rourkela/Tata Jamshedpur to infrastructure sites (1000+ girders/year), (4) Mundra/Kandla port to north India power projects (300+ transformers/year), (5) Bengaluru/Pune factories to metro/rail projects (100+ TBM components/year). India\u2019s top ODC transporters: (1) TCI Seaways (convoys + coastal barge), (2) Samsara (heavy haul division), (3) Agarwal Packers, (4) Patel Roadways ODC wing, (5) Blue Star Heavy Haul, and (6) Gati ODC logistics. Fleet: India has 2,500+ multi-axle trailers (20-60T capacity), 150+ hydraulic modular trailers (SPMT: 100-500T per unit, linkable to 1000T+), and 50+ self-propelled transporters for nuclear/reactor components.",
  },
  {
    t: "ODC Equipment Categories: Transformers, Wind Blades, Bridge Girders, TBM, Nuclear Components",
    c: "India\u2019s major ODC cargo categories and logistics complexity: (1) Power Transformers (40-320T, 8-16m length): manufactured by BHEL (Bhopal/Hyderabad/Haridwar/Jhansi, 200+ units/year), Siemens (Vadodara, 80 units), Crompton Greaves (Ahmedabad/Mandi Gobindgarh, 60 units), GE Energy (Vadodara, 40 units), and Toshiba JSW (Karnataka, 30 units). transported on SPMT or 20+ axle trailers. Challenges: center of gravity management, shock/vibration isolation (silica gel mounting, air springs), no tilting beyond 3 degrees. Insurance: 0.5-2% of cargo value (USD 50-300M for 320T transformer = \u20b94-24 crore premium). (2) Wind Turbine Blades (12-75m length, 8-22T): Vestas, Suzlon, Siemens Gamesa, GE Renewable (blade factories: Bengaluru, Vadodara, Nellore, Coimbatore). transported on 60T flatbed lowbed with blade tip support cradle. Challenge: overhang clearance (blade extends 15-20m beyond trailer), requires pilot vehicles front and rear, night-only transport on some state highways. India installed 15,000+ wind turbine blades in FY2024 (15GW new wind capacity). (3) Bridge Girders (30-60m, 50-120T): SAIL, Tata Steel, JSW Steel I-sections and box girders for railway overbridges, metro viaducts, expressways. IRCON, L&T, Afcons are major consumers. Transported on hydraulic modular trailer (HMT). Challenge: road geometry (minimum turning radius 25m for 60T girder), overhead clearance (power lines need to be de-energized and raised, \u20b95,000-50,000 per line per shift), bridge weight restrictions (many Indian bridges rated for 24T, ODC requires structural assessment by state PWD). (4) TBM Components (shield: 100-400T, 6-12m diameter): Herrenknecht (Germany), Robbins (USA), Hitachi Zosen (Japan) TBMs imported via Mumbai/Kolkata/Chennai ports, moved to metro/construction sites. Example: Mumbai Coastal Road 3 TBMs (6.7m slurry), Delhi Metro Phase-IV (6 TBMs), Chennai Metro (4 TBMs). (5) Nuclear Components (40-800T): NPCIL pressurizer, steam generators, reactor vessel (Rajasthan/Rawatbhata/Kudankulam). transported on special SPMT with radiation shielding. escorted by NDRF/NSG. Permit: Ministry of Home Affairs approval + AERB (Atomic Energy Regulatory Board) clearance. India nuclear ODC: 10-15 major consignments/year.",
  },
  {
    t: "Escort Vehicles, NHAI Route Survey, Bridge Analysis and India ODC Safety Protocols",
    c: "India\u2019s ODC safety and escort protocols: (1) Escort vehicles: (a) Pilot vehicle (front): LED display board showing ODC dimensions, amber beacon, siren. Required for all ODC exceeding 3.5m width or 18m length on NH. (b) Chase vehicle (rear): high-visibility amber beacon, reflective signage. Required for night movement. (c) Full escort: pilot + rear + 2 lateral escort bikes (for width >4.5m). Cost: \u20b915,000-50,000 per day depending on convoy size and route. (d) Police escort: mandatory for nuclear/radiological ODC, at extra cost (\u20b91,00,000+ per consignment). (e) BRO (Border Roads Organisation) escort: required for NE India, Ladakh, and strategic highway ODC. (2) Route survey: before every ODC movement, a route survey is mandatory. Survey team visits: (a) All bridges on route: load rating check (many Indian bridges built for 24-40T axle load, ODC requires 50-100T+). If bridge is inadequate: temporary Bailey bridge bypass, bridge strengthening ( CFRP wrapping, steel plate bonding), or route rerouting. (b) Overhead obstructions: power lines (110kV-400kV), telecom cables, flyovers, gantries. Power lines must be raised by state electricity board (typically 1-3m raise, takes 5-15 days to coordinate, \u20b95,000-50,000 per location). India average: 15-25 overhead obstructions per 500km ODC route. (c) Road geometry: horizontal curves (minimum radius), vertical curves, gradient (maximum 5% for loaded SPMT, 8% for empty), lane width (minimum 3.75m for ODC, some state highways only 3m), and road surface condition. (d) Intersections and roundabouts: turning circle analysis for articulated trailer+ODC. (3) Timing restrictions: (a) Many states allow ODC movement only during 10pm-6am on national highways. (b) No movement during peak traffic hours (8-10am, 5-8pm). (c) Monsoon restrictions: no ODC on vulnerable sections during June-September in Western Ghats, Himalayan passes (Rohtang, Nathu La), and flood-prone Bihar/Assam corridors. (d) Festival restrictions: no ODC during Diwali, Holi, Kumbh Mela, Eid (state-dependent, 2-5 days). Average ODC speed: 15-25 km/h for loaded convoy (vs 60-80 km/h for normal truck). India\u2019s longest ODC route: Mundra to Guwahati (2,800km, 12-18 days transit). Cost: \u20b92-5 lakh per day for full SPMT convoy with escorts. India\u2019s heaviest single ODC: NPCIL reactor vessel head (650T, shipped from L&T Hazira to Kakrapar on 72-axle SPMT in 2018, 5-day convoy at 10 km/h average).",
  },
  {
    t: "Future of India ODC: Smart Logistics, Coastal Barge, Rail Modal Shift and Infrastructure Boom",
    c: "India\u2019s ODC logistics is undergoing transformation driven by \u20b9111 lakh crore National Infrastructure Pipeline (NIP), \u20b910 lakh crore per year capex on roads/railways/power/ports/airports. Key trends: (1) Coastal/inland waterway ODC: India\u2019s 7,500km coastline enables barge transport for heavy cargo. Major ODC ports: Mundra (Gujarat), Kandla, Hazira, Ennore (Chennai), Haldia (Kolkata), Nhava Sheva (JNPT Mumbai). Inland waterways: NW-1 (Ganga: Haldia to Varanasi, 1,620km), NW-2 (Brahmaputra), NW-3 (Kerala backwaters), NW-4 (Godavari-Krishna), NW-5 (Mahanadi-Brahmani). Barge capacity: 500-5,000T (much cheaper than road for >100T cargo). India transported 200+ ODC consignments by barge in FY2024 (30% growth). (2) Rail heavy haul: Indian Railways WAG-12 (12,000 HP) locomotive can haul 6,000T on dedicated freight corridors (DFC: Western DFC 1,504km, Eastern DFC 1,856km). ODC rail transport: limited by loading gauge (3.66m width, 4.27m height on Broad Gauge). Special ODC wagons: well wagon (lowered center for tall cargo), Schnabel wagon (2-part articulating for transformers). India moves 50-80 transformers/year by rail (vs 400+ by road). (3) Digital transformation: (a) IoT GPS tracking on SPMT/ODC convoy (real-time location, speed, vibration, tilt angle monitoring). (b) NHAI FASTag-based toll exemption for ODC (automatic toll bypass, earlier required manual verification). (c) Digital permit: NHAI Parivahan portal for online ODC permit application (3-day processing vs 15-day manual earlier). (d) Drone route survey: pre-ODC drone survey for bridge/overhead/power line mapping (1 day vs 5-day manual survey). (e) Digital twin: L&T uses digital twin for TBM logistics planning (3D city model + route simulation). (4) India\u2019s ODC mega-projects driving demand: (a) Nuclear: 10 PHWR-700 reactors under construction (NPCIL \u20b95,00,000 crore investment, 2025-2035). Each requires 15-20 ODC consignments (reactor vessel, steam generators, pressurizer). (b) Hydro: 12,000MW new hydro capacity by 2030 (NHPC, SJVN, THDC) requiring generator stator/rotor ODC to Himalayan sites (most challenging: Sikkim, Arunachal, Himachal). (c) Metro: 1,000+ km metro under construction across 20 cities (LMRC, DMRC, BMRCL, CMRL, KMRL, HMRL, JMRC, etc.) requiring TBM shield segments and precast viaduct girders. (d) High-speed rail: Mumbai-Ahmedabad (508km, \u20b91.08 lakh crore) Japanese Shinkansen technology, requires special ODC for 25m track slab segments and OHE mast assemblies. India\u2019s ODC market growth: 12-15% CAGR, projected \u20b91,20,000 crore by 2030 from \u20b950,000 crore today.",
  },
];

export default function OversizeOdcTransportLogisticsView() {
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
      if (!r.id.toLowerCase().includes(q) && !r.permitNo.toLowerCase().includes(q) && !r.origin.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.consignee.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ODCRecord] as string));
  });

  return (
    <div className="odc-root p-6 space-y-6">
      <PageHeader title="Oversize ODC Transport Logistics" description="India oversize over-dimensional cargo transport covering NHAI permits, multi-axle trailers, SPMT hydraulic modular transport, power transformer wind blade bridge girder TBM nuclear vessel heavy haul with escort convoy and route survey" />
      <div className="odc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`odc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-amber-800 text-white" : "text-gray-600 hover:bg-amber-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="odc-dash space-y-6">
          <div className="odc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="odc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 odc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-amber-800 odc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 odc-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="odc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly ODC Shipments (Units)</h3><BarChart data={monthlyODC} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="transformer" fill="#4a3728" radius={[4,4,0,0]} name="Transformer" /><Bar dataKey="wind" fill="#6b4f3a" radius={[4,4,0,0]} name="Wind Blade" /><Bar dataKey="girder" fill="#8b6f5c" radius={[4,4,0,0]} name="Girder" /><Bar dataKey="heavy" fill="#a3846d" radius={[4,4,0,0]} name="Heavy" /></BarChart></div>
            <div className="odc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">ODC Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="odc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Permit Compliance Rate (%) vs 95% Target</h3><LineChart data={permitCompliance} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[88, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#4a3728" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="odc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Region OTC Delivery Performance (%)</h3><BarChart data={regionPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[80, 100]} /><Tooltip /><Bar dataKey="v" fill="#6b4f3a" radius={[4,4,0,0]} name="On-Time %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="odc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "ODC Transport", href: "#" }, { label: "Shipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="odc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Permit No,Origin,Zone,Category,Description,Weight (T),Length (m),Consignee,Project,Route,Mode,Dispatch,ETA,Transit (d),Value (\u20b9L),Escort,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Convoy En Route Highway" ? "odc-row-info bg-blue-50" : r.status === "Bridge Bypass Rerouted" ? "odc-row-critical bg-red-50 border-l-4 border-l-red-500" : r.status === "Loading at Origin Port" || r.status === " axle Load Check RTO" ? "odc-row-warning bg-amber-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-amber-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="odc-badge inline-block px-2 py-0.5 rounded text-xs bg-amber-800 text-white font-mono text-[10px]">{r.permitNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.origin}</td>
                <td className="px-3 py-2"><span className="odc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="odc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{(r.weight/1000).toFixed(0)}T</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.length}m</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.consignee}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.project}</td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.route}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 7 ? "text-red-600" : r.transitDays >= 4 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-amber-800">{`\u20b9${r.valueLakhs}L`}</td>
                <td className="px-3 py-2 text-center">{r.escortType === "FULL" ? <span className="odc-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">FULL</span> : <span className="odc-badge inline-block px-2 py-0.5 rounded text-xs bg-blue-600 text-white">PILOT</span>}</td>
                <td className="px-3 py-2"><span className={`odc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="odc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="odc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">ODC Volume by Zone</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(8, 30, 18 + Math.random() * 6).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#4a3728" radius={[4,4,0,0]} name="Shipments" /></BarChart></div>
            <div className="odc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Volume by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], transformer: ri(5, 15, 8 + Math.sin(i*0.5)*3), wind: ri(4, 12, 7 + Math.cos(i*0.6)*2), girder: ri(2, 8, 4 + Math.sin(i*0.7)*2) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="transformer" stackId="1" stroke="#4a3728" fill="#d4b896" name="Transformer" /><Area type="monotone" dataKey="wind" stackId="1" stroke="#6b4f3a" fill="#c9a882" name="Wind Blade" /><Area type="monotone" dataKey="girder" stackId="1" stroke="#8b6f5c" fill="#a3846d" name="Girder" /></AreaChart></div>
          </div>
          <div className="odc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Mode</h3><BarChart data={[{n:"Multi-Axle",v:4},{n:"Hydraulic HMT",v:5.5},{n:"SPMT",v:5},{n:"Flatbed Lowbed",v:3.5},{n:"Barge",v:6},{n:"Rail WAG-12",v:4}].map(d => ({...d, v: +ri(d.v*0.7, d.v*1.3, d.v + Math.random()*0.5).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#6b4f3a" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="odc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="odc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-amber-900 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
