"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1a237e", "#283593", "#303f9f", "#3949ab", "#5c6bc0", "#0d1242", "#0d47a1", "#7986cb"];
const FACILITIES = ["HAL Bengaluru Complex", "ADA DRDO Hyderabad", "ISRO Thiruvananthapuram LPSC", "BEL Bengaluru Unit", "GE Aerospace Pune MRO", "Boeing Hyderabad MRO", "Airbus Toulouse India Spares Mumbai", "Safran Engineering Hyderabad"];
const CATEGORIES = ["Turbofan Engine Module", "Avionics LRUs", "Landing Gear Assembly", "Composite Airframe Panel", "Hydraulic Actuator", "APU Auxiliary Power Unit", "Flight Control Surface", "Safety Emergency Equipment"];
const SHIPMENT_STATUSES = ["Certified QA Released", "In Transit Air Cargo", "Customs Clearance Hold", "MRO Shop Teardown", "Shelf Life Monitoring", "Installed Certified Airworthy"];
const ZONES = ["South India Aerospace Belt", "West India MRO Hub", "North India Defence Corridor", "Central India Manufacturing", "East India Port Logistics", "Gulf Export Zone"];
const MODES = ["Air Cargo Freighter", "Dedicated Charter A300F", "Road Express Climate Ctrl", "Sea Cargo Container", "Hand Carry Diplomatic",("Multimodal Air Road")];
const TABS = ["Dashboard", "Parts Registry", "Aerospace Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Certified QA Released": "green", "In Transit Air Cargo": "blue", "Customs Clearance Hold": "red", "MRO Shop Teardown": "amber", "Shelf Life Monitoring": "slate", "Installed Certified Airworthy": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyShipments = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], engine: ri(3, 8, 5 + Math.sin(i * 0.5) * 1.5), avionics: ri(10, 25, 16 + Math.cos(i * 0.6) * 4), structure: ri(5, 12, 8 + Math.sin(i * 0.7) * 2), hydraulic: ri(4, 10, 6 + Math.cos(i * 0.8) * 2) }));
const categoryDist = [{ n: "Avionics LRU", v: 28 }, { n: "Engine Module", v: 18 }, { n: "Airframe Panel", v: 16 }, { n: "Landing Gear", v: 12 }, { n: "Hydraulic System", v: 10 }, { n: "Flight Control", v: 8 }, { n: "APU", v: 5 }, { n: "Safety Equipment", v: 3 }];
const reliabilityRate = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(96, 99.5, 98 + Math.sin(i * 0.4) * 0.8)).toFixed(1), target: 99.0 }));
const facilityPerf = FACILITIES.slice(0, 6).map(f => ({ n: f.split(" ").slice(0, 2).join(" "), v: +ri(88, 99, 95 + Math.random() * 3).toFixed(0) }));

interface PartRecord { id: string; partNumber: string; facility: string; zone: string; category: string; description: string; weight: number; unit: string; customer: string; aircraftType: string; mode: string; shipDate: string; etaDate: string; transitDays: number; valueLakhs: number; criticalFlag: string; status: string; remarks: string; }

const records: PartRecord[] = [
  { id: "APL-0001", partNumber: "PN-GE9X-84C-TURBOFAN", facility: "HAL Bengaluru Complex", zone: "South India Aerospace Belt", category: "Turbofan Engine Module", description: "GE9X-84C Turbofan Engine Module LH Side", weight: 5600, unit: "kg", customer: "Air India B777-300ER Fleet", aircraftType: "Boeing 777-300ER", mode: "Air Cargo Freighter", shipDate: "2025-07-08", etaDate: "2025-07-09", transitDays: 1, valueLakhs: 8500, criticalFlag: "AOG", status: "In Transit Air Cargo", remarks: "GE9X turbofan engine for Air India B777-300ER AOG engine change Bengaluru" },
  { id: "APL-0002", partNumber: "PN-HAL-LCA-TEJAS-FCS", facility: "ADA DRDO Hyderabad", zone: "South India Aerospace Belt", category: "Flight Control Surface", description: "LCA Tejas Mk1A Elevon Composite Panel", weight: 45, unit: "kg", customer: "IAF No.4 Squadron", aircraftType: "LCA Tejas Mk1A", mode: "Road Express Climate Ctrl", shipDate: "2025-07-10", etaDate: "2025-07-11", transitDays: 1, valueLakhs: 12, criticalFlag: "STD", status: "Certified QA Released", remarks: "LCA Tejas Mk1A composite elevon panel ADA Hyderabad to IAF Squadron 4" },
  { id: "APL-0003", partNumber: "PN-ISRO-VIKAS-LPE-2025", facility: "ISRO Thiruvananthapuram LPSC", zone: "South India Aerospace Belt", category: "Turbofan Engine Module", description: "Vikas L40 Engine for GSLV Mk3 Cryo Stage", weight: 850, unit: "kg", customer: "ISRO GSLV Mission D3", aircraftType: "GSLV Mk3 Rocket", mode: "Road Express Climate Ctrl", shipDate: "2025-07-09", etaDate: "2025-07-11", transitDays: 2, valueLakhs: 450, criticalFlag: "AOG", status: "In Transit Air Cargo", remarks: "Vikas L40 liquid engine LPSC to SHAR Sriharikota GSLV D3 integration" },
  { id: "APL-0004", partNumber: "PN-BEL-AESA-RDR-MKU", facility: "BEL Bengaluru Unit", zone: "South India Aerospace Belt", category: "Avionics LRUs", description: "AESA Radar LRU for Su-30MKI Upgrade", weight: 120, unit: "kg", customer: "HAL Su-30MKI Upgrade Line", aircraftType: "Su-30MKI", mode: "Road Express Climate Ctrl", shipDate: "2025-07-08", etaDate: "2025-07-09", transitDays: 1, valueLakhs: 28, criticalFlag: "STD", status: "Certified QA Released", remarks: "AESA fire-control radar LRU BEL to HAL Su-30MKI avionics upgrade programme" },
  { id: "APL-0005", partNumber: "PN-CFM56-7B27-HP-COMP", facility: "GE Aerospace Pune MRO", zone: "West India MRO Hub", category: "Turbofan Engine Module", description: "CFM56-7B27 HP Compressor Module", weight: 3200, unit: "kg", customer: "IndiGo A320neo Family", aircraftType: "A320neo", mode: "Dedicated Charter A300F", shipDate: "2025-07-07", etaDate: "2025-07-07", transitDays: 0, valueLakhs: 3200, criticalFlag: "AOG", status: "MRO Shop Teardown", remarks: "CFM56-7B27 HP compressor module teardown inspection GE Pune MRO shop" },
  { id: "APL-0006", partNumber: "PN-BOEING-787-LG-MLG", facility: "Boeing Hyderabad MRO", zone: "South India Aerospace Belt", category: "Landing Gear Assembly", description: "B787 Main Landing Gear Assembly", weight: 4500, unit: "kg", customer: "Air India Vistara B787", aircraftType: "Boeing 787-9", mode: "Air Cargo Freighter", shipDate: "2025-07-10", etaDate: "2025-07-10", transitDays: 0, valueLakhs: 1800, criticalFlag: "STD", status: "Customs Clearance Hold", remarks: "B787 main landing gear assembly import Boeing Hyderabad customs pending DGCA cert" },
  { id: "APL-0007", partNumber: "PN-AIRBUS-A320-SLAT-7A", facility: "Airbus Toulouse India Spares Mumbai", zone: "West India MRO Hub", category: "Composite Airframe Panel", description: "A320neo Slat Panel 7A Left Wing", weight: 18, unit: "kg", customer: "GoAir A320neo Fleet", aircraftType: "A320neo", mode: "Sea Cargo Container", shipDate: "2025-07-01", etaDate: "2025-07-12", transitDays: 11, valueLakhs: 8, criticalFlag: "STD", status: "Shelf Life Monitoring", remarks: "A320neo slat panel 7A Airbus Toulouse to Mumbai sea freight shelf life monitoring" },
  { id: "APL-0008", partNumber: "PN-SAFRAN-LEAP-1A-TURB", facility: "Safran Engineering Hyderabad", zone: "South India Aerospace Belt", category: "Turbofan Engine Module", description: "LEAP-1A LP Turbine Disc Module", weight: 180, unit: "kg", customer: "IndiGo A320neo P&W LEAP", aircraftType: "A320neo", mode: "Air Cargo Freighter", shipDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 560, criticalFlag: "AOG", status: "In Transit Air Cargo", remarks: "LEAP-1A LP turbine disc Safran Hyderabad to IndiGo AOG A320neo Mumbai" },
  { id: "APL-0009", partNumber: "PN-HAL-DHMRU-PT-ACT", facility: "HAL Bengaluru Complex", zone: "South India Aerospace Belt", category: "Hydraulic Actuator", description: "Dhruv ALH Main Rotor Hydraulic Actuator", weight: 28, unit: "kg", customer: "IAF Dhruv ALH MK-III", aircraftType: "Dhruv ALH MK-III", mode: "Road Express Climate Ctrl", shipDate: "2025-07-10", etaDate: "2025-07-11", transitDays: 1, valueLakhs: 35, criticalFlag: "STD", status: "Certified QA Released", remarks: "Main rotor hydraulic actuator HAL to IAF Dhruv fleet ALH MK-III replacement" },
  { id: "APL-0010", partNumber: "PN-HONEYWELL-A320-APU", facility: "GE Aerospace Pune MRO", zone: "West India MRO Hub", category: "APU Auxiliary Power Unit", description: "Honeywell 131-9B APU for A320 Family", weight: 180, unit: "kg", customer: "SpiceJet A320ceo Fleet", aircraftType: "A320ceo", mode: "Air Cargo Freighter", shipDate: "2025-07-08", etaDate: "2025-07-09", transitDays: 1, valueLakhs: 420, criticalFlag: "STD", status: "Installed Certified Airworthy", remarks: "Honeywell 131-9B APU overhauled installed SpiceJet A320ceo certified airworthy" },
  { id: "APL-0011", partNumber: "PN-ADA-AMCA-WING-SKIN", facility: "ADA DRDO Hyderabad", zone: "South India Aerospace Belt", category: "Composite Airframe Panel", description: "AMCA Mk1 Wing Skin CFRP Prototype Panel", weight: 65, unit: "kg", customer: "ADA AMCA Prototype P1", aircraftType: "AMCA Mk1 (Prototype)", mode: "Road Express Climate Ctrl", shipDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 85, criticalFlag: "STD", status: "Certified QA Released", remarks: "AMCA Mk1 wing skin CFRP composite panel ADA to prototype assembly facility" },
  { id: "APL-0012", partNumber: "PN-BOEING-737-MAX-FADEC", facility: "Boeing Hyderabad MRO", zone: "South India Aerospace Belt", category: "Avionics LRUs", description: "737 MAX FADEC Engine Control Computer", weight: 12, unit: "kg", customer: "Akasa Air 737 MAX 8", aircraftType: "Boeing 737 MAX 8", mode: "Hand Carry Diplomatic", shipDate: "2025-07-10", etaDate: "2025-07-10", transitDays: 0, valueLakhs: 65, criticalFlag: "AOG", status: "Customs Clearance Hold", remarks: "737 MAX FADEC unit hand-carry Seattle to Hyderabad Akasa AOG customs review" },
  { id: "APL-0013", partNumber: "PN-BEL-AWACS-RADAR-SU", facility: "BEL Bengaluru Unit", zone: "South India Aerospace Belt", category: "Avionics LRUs", description: "Netra AWACS Radar Suite LRU for Embraer", weight: 850, unit: "kg", customer: "IAF No.50 Sqdrn AWACS", aircraftType: "Embraer ERJ-145 AWACS", mode: "Road Express Climate Ctrl", shipDate: "2025-07-07", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 1200, criticalFlag: "AOG", status: "Installed Certified Airworthy", remarks: "Netra AWACS radar suite BEL to IAF 50 Sqn Embraer installed certified airworthy" },
  { id: "APL-0014", partNumber: "PN-SAFRAN-SCHEMPP-HIRTH", facility: "Safran Engineering Hyderabad", zone: "South India Aerospace Belt", category: "Landing Gear Assembly", description: "Safran Sagem Hirth Landing Gear for Rafale", weight: 2800, unit: "kg", customer: "IAF Rafale BS Squadron", aircraftType: "Dassault Rafale", mode: "Dedicated Charter A300F", shipDate: "2025-07-06", etaDate: "2025-07-12", transitDays: 6, valueLakhs: 4500, criticalFlag: "AOG", status: "Shelf Life Monitoring", remarks: "Rafale main landing gear module import France to India charter freight shelf monitoring" },
];

const transitCount = records.filter(rec => rec.status === "In Transit Air Cargo").length;
const mroCount = records.filter(rec => rec.status === "MRO Shop Teardown" || rec.status === "Customs Clearance Hold").length;
const certifiedCount = records.filter(rec => rec.status === "Certified QA Released" || rec.status === "Installed Certified Airworthy").length;
const totalValue = records.reduce((s, rec) => s + rec.valueLakhs, 0);

const kpis = [
  { l: "In Transit", v: transitCount, s: "air cargo" },
  { l: "MRO/Hold", v: mroCount, s: "shop/customs" },
  { l: "Certified", v: certifiedCount, s: "QA released" },
  { l: "Total Parts Value", v: `\u20b9${(totalValue / 100).toFixed(0)}Cr`, s: "all shipments" },
];

const INSIGHTS = [
  {
    t: "India Aerospace Manufacturing: \u20b91,50,000 Crore Industry, HAL BEL DRDO ISRO Ecosystem",
    c: "India\u2019s aerospace and defence manufacturing sector is valued at \u20b91,50,000 crore (USD 18 billion) in FY2024-25, growing at 12% CAGR. Key institutions: (1) HAL (Hindustan Aeronautics Limited, PSU, Bengaluru): India\u2019s largest aerospace manufacturer, revenue \u20b928,000 crore, produces Su-30MKI (under licence from Sukhoi), LCA Tejas Mk1A (indigenous 4th gen fighter), Dhruv Advanced Light Helicopter (ALH), Light Combat Helicopter (LCH Prachand), Dornier 228, HTT-40 trainer. HAL operates 10 manufacturing complexes across India (Bengaluru, Nashik, Koraput, Kanpur, Hyderabad). (2) ADA (Aeronautical Development Agency, DRDO): designer of LCA Tejas and future AMCA (Advanced Medium Combat Aircraft, 5th gen stealth fighter, prototype by 2028). (3) BEL (Bharat Electronics Limited, PSU, Bengaluru): avionics and radar systems, AESA radar, airborne early warning (Netra AWACS on Embraer ERJ-145), electronic warfare suites. Revenue: \u20b922,000 crore. (4) ISRO (Indian Space Research Organisation): LPSC (Liquid Propulsion Systems Centre, Thiruvananthapuram) manufactures Vikas and CE-20 cryogenic engines for GSLV, LVM3, Gaganyaan human spaceflight. Rocket engines are high-precision aerospace components requiring temperature-controlled logistics (-40 to +50 degrees Celsius, humidity-controlled, vibration-monitored packaging). (5) Private MRO: GE Aerospace Pune (CFM56/LEAP engine MRO, \u20b92,500 crore revenue), Boeing Hyderabad (787/777 component repair, \u20b91,800 crore), Airbus engineering centre Bengaluru, Safran Engineering Hyderabad (nacelles, engine components, \u20b91,200 crore), Pratt and Whitney Singapore/India MRO, and Bombardier service centre Delhi. India\u2019s MRO market: \u20b94,500 crore (FY25), growing 15% annually. India\u2019s commercial fleet: 800+ aircraft (IndiGo 350+, Air India 200+, SpiceJet 60+, Akasa 30+, Vistara 50+, GoFirst grounded). Parts logistics is mission-critical: AOG (Aircraft on Ground) parts must be delivered within 2-24 hours globally (AOG desk 24/7, dedicated charter freighters). India\u2019s defence aviation: 2,100+ combat aircraft (Su-30MKI: 260+, Mirage 2000: 50+, Rafale: 36, Tejas: 40+, Jaguar: 100+, MiG-29: 60+). Each aircraft requires 10,000+ unique spare parts tracked by serial number with FAA/EASA/ DGCA certification traceability.",
  },
  {
    t: "Aerospace Parts Classification: Engine, Avionics, Structure, Hydraulic, APU Logistics",
    c: "Aerospace parts are classified by ATA Chapter (Air Transport Association) with strict logistics requirements: (1) Turbofan Engine Modules: most critical and expensive parts. India\u2019s airline fleet engines: GE9X (B777, \u20b920 crore/engine), GE90 (B777, \u20b915 crore), CFM56-7B (A320ceo, \u20b98 crore), LEAP-1A/1B (A320neo/B737 MAX, \u20b912 crore), Trent 700 (A330, \u20b910 crore), Trent 1000 (B787, \u20b914 crore), PW1200G (A320neo, \u20b911 crore). Engine logistics: (a) Engine change: 2-8 hours (line maintenance), requiring engine transport stand, 10-20 person team, (b) Engine MRO cycle: 3,000-6,000 flight cycles (CFM56), overhauls take 60-90 days, (c) Transport: dedicated freighter (B747F, A300F) with shock/vibration monitoring, temperature control for hot sections, (d) India MRO capacity: GE Pune (300 engines/year), Air India Engineering (200/year), HAL engine division (150 military engines/year). (2) Avionics LRUs (Line Replaceable Units): electronic boxes with ATA chapters 22 (autopilot), 34 (navigation), 73 (fuel), 31 (instruments). Avionics require ESD (electrostatic discharge) packaging, temperature-controlled transport (-20 to +60 degrees Celsius), and DGCA/FAA Form 1 (release certificate). Major avionics OEMs in India: Honeywell (Hyderabad), Collins Aerospace (Bengaluru), Thales (Hyderabad), Rockwell Collins. India avionics market: \u20b98,000 crore (FY25). (3) Landing Gear Assembly: main landing gear (MLG) and nose landing gear (NLG). Weight: 500-5,000 kg per assembly. OEMs: Safran Landing Systems (France), Liebherr Aerospace (Germany), Messier-Bugatti-Dowty. Logistics: shock-monitored packaging, nitrogen-charged oleo struts, anti-corrosion treatment. MLG replacement: 4-8 hours (line), 2-3 days (base). India\u2019s landing gear MRO: AAI Slough (Mumbai), HAL Bengaluru. (4) Composite Airframe Panels: carbon fibre reinforced polymer (CFRP) panels for wing skins, fuselage sections, empennage. Weight: 10-200 kg per panel. Manufactured by autoclave process (120-180 degrees Celsius, 6 bar pressure). Logistics: moisture barrier packaging, UV protection, temperature logging (data logger in packaging). Suppliers: Airbus (Toulouse, shipped to Mumbai), BEL Composites (Bengaluru), Tata Advanced Composites (TAC, Bengaluru). (5) Hydraulic Actuators: flight control (aileron, elevator, rudder, flap) and landing gear actuators. Weight: 5-50 kg per actuator. Fluid: Skydrol LD-4 (phosphate ester, corrosive, requires special packaging). MRO: HAL Bengaluru, Safran Hyderabad. (6) APU (Auxiliary Power Unit): Honeywell 131-9B (A320), APS3200 (A350), RE220 (G650). Weight: 100-400 kg. Provides electrical power and bleed air for engine start. MRO cycle: 8,000-10,000 hours.",
  },
  {
    t: "AOG Emergency Logistics, DGCA Certification, and Temperature-Controlled Air Cargo",
    c: "AOG (Aircraft on Ground) is the most time-critical logistics event in aviation: every hour of AOG costs \u20b910-50 lakh in lost revenue (depending on aircraft type and route). India\u2019s AOG logistics ecosystem: (1) 24/7 AOG desks: operated by airlines (Air India, IndiGo), MROs (GE, Boeing, HAL), and OEMs (GE, CFM, Honeywell, Airbus). (2) Response time targets: domestic AOG: 2-6 hours delivery, international AOG: 12-48 hours (express courier + charter freighter). (3) Transportation modes: (a) Dedicated charter freighter: B747F (Hong Kong Express, Cathay Cargo), A300F (Blue Dart, DHL) for engines and large components. Cost: \u20b940-80 lakh per charter (Delhi to Mumbai: \u20b940 lakh). (b) Commercial air cargo: passenger belly hold or combi aircraft. Cost: \u20b9200-800/kg (express), \u20b950-200/kg (standard). Transit: domestic 2-4 hours, international 12-48 hours. (c) Hand-carry: AOG technician or courier carries critical part on passenger flight (small avionics LRU, $50,000-500,000 value). Diplomatic clearance for military parts. (d) Road express: climate-controlled trucks for domestic delivery (Bengaluru to Hyderabad: 8 hours, Mumbai to Delhi: 24 hours). Temperature range: 15-25 degrees Celsius (avionics, composites), -20 to +50 degrees Celsius (engine modules with heaters). DGCA (Directorate General of Civil Aviation) certification: all aeronautical parts imported/exported require: (a) Form 1 (CAA Release Certificate) or FAA 8130-3 (US), EASA Form 1 (EU), (b) DGCA import licence for civil parts, (c) Ministry of Defence/ DDP clearance for military parts, (d) Export Control (SCOMET list) for dual-use aerospace technology, (e) Customs duty: 18% IGST on most aircraft parts (some exemptions for defence aircraft under customs notification). Shelf life management: rubber seals (O-rings, gaskets): 5-10 years from manufacture date (must be tracked), hydraulic fluids: 2 years, lubricants: 5 years, batteries: 3 years, pyrotechnics (fire extinguishers, escape slides): 8-12 years. Parts with expired shelf life must be returned to OEM for recertification or scrapped. India\u2019s aerospace parts storage: HAL central stores (Bengaluru, 200,000+ line items), Air India stores (Delhi, 150,000+ items), IndiGo rotable pool (Delhi, 50,000+ items). RFID tracking implemented by IndiGo and Air India for high-value rotable parts (engines, APU, landing gear).",
  },
  {
    t: "Defence Aviation Logistics, ISRO Space Parts, and India\u2019s Aerospace Export Growth",
    c: "India\u2019s defence aviation logistics: (1) Su-30MKI fleet (260+ aircraft): Russia-origin, parts logistics via Rosoboronexport/ Irkut. Spares pipeline: 18-24 months lead time. India\u2019s indigenisation programme: 60% indigenisation target for Su-30MKI by 2027 (HAL Nashik manufacturing raw materials, forgings, castings locally). (2) LCA Tejas Mk1A (123 ordered, 40 delivered): indigenous content 60%+ (increasing to 75% for Mk2). Parts: ADA design, HAL manufacture, BEL avionics. Supply chain: 400+ Indian SME suppliers across Karnataka, Tamil Nadu, Maharashtra, Telangana. (3) Rafale (36 aircraft, Dassault France): 13-year maintenance contract with Dassault and Safran. Spares delivered from France (4-8 weeks lead time) with Indian buffer stock maintained at IAF Ambala and Hasimara bases. (4) Helicopters: Dhruv ALH (350+ delivered, 300 ordered), LCH Prachand (50 ordered), IMRH (Indian Multi-Role Helicopter, under development). HAL rotary wing production: 40 helicopters/year. (5) UAVs: DRDO Rustom-II, Tapas, Archer NG. Components: indigenous engines, composite airframes, electro-optical payloads from BEL/OAL. ISRO space parts logistics: (a) LPSC Thiruvananthapuram: Vikas engine (50 engines/year), CE-20 cryogenic engine (8-10/year), PS4 upper stage engine. Transport: shock-monitored, temperature-controlled road/rail from LPSC to SHAR Sriharikota (300 km, 8 hours by road). (b) Satellite components: ISAC Bengaluru (satellite assembly) receives solar panels from BEL (5-8 day transport), thrusters from LPSC, reaction wheels from ISRO. (c) Gaganyaan (India\u2019s human spaceflight, 2026-27): crew module, service module, escape system \u2014 highest reliability class (10 to the power -6 failure probability), requiring 100% inspection and traceability of every component. India\u2019s aerospace exports: (a) HAL: exports airframe components to Airbus (A320 doors, tailcones from Bengaluru to Toulouse), Boeing (B787 vertical fin), Sukhoi (Su-30MKI kits to Malaysia). Export revenue: \u20b94,500 crore (FY25). (b) BEL: avionics exports to Bangladesh, Myanmar, Sri Lanka, UAE (radars, EW suites). Export revenue: \u20b92,200 crore. (c) Tata Advanced Composites: CFRP panels for Boeing, Airbus, Pilatus. (d) Dynamatic Technologies: flap track fairings, close-out panels for Airbus A320neo (\u20b9800 crore). India\u2019s aerospace MRO export potential: \u20b915,000 crore by 2030 (currently \u20b94,500 crore), driven by India\u2019s cost advantage (40-50% lower MRO cost vs Europe), large pool of English-speaking engineers, and growing aircraft fleet.",
  },
];

export default function AerospacePartsLogisticsView() {
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
      if (!r.id.toLowerCase().includes(q) && !r.partNumber.toLowerCase().includes(q) && !r.facility.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.customer.toLowerCase().includes(q) && !r.aircraftType.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof PartRecord] as string));
  });

  return (
    <div className="apl-root p-6 space-y-6">
      <PageHeader title="Aerospace Parts Logistics" description="India aerospace and defence parts supply chain covering HAL LCA Tejas Dhruv, DRDO AMCA, ISRO GSLV engines, GE CFM56 LEAP turbofan MRO, Boeing Airbus landing gear avionics, AOG emergency logistics, DGCA certification and temperature-controlled air cargo" />
      <div className="apl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`apl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-indigo-700 text-white" : "text-gray-600 hover:bg-indigo-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="apl-dash space-y-6">
          <div className="apl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="apl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 apl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-indigo-700 apl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 apl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="apl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Parts Shipments (Units)</h3><BarChart data={monthlyShipments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="engine" fill="#1a237e" radius={[4,4,0,0]} name="Engine" /><Bar dataKey="avionics" fill="#283593" radius={[4,4,0,0]} name="Avionics" /><Bar dataKey="structure" fill="#303f9f" radius={[4,4,0,0]} name="Structure" /><Bar dataKey="hydraulic" fill="#3949ab" radius={[4,4,0,0]} name="Hydraulic" /></BarChart></div>
            <div className="apl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Parts Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="apl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Parts Reliability Rate (%) vs 99% Target</h3><LineChart data={reliabilityRate} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[95, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#1a237e" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="apl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Facility Performance Score</h3><BarChart data={facilityPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[85, 100]} /><Tooltip /><Bar dataKey="v" fill="#283593" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="apl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Aerospace Parts", href: "#" }, { label: "Parts Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="apl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Part Number,Facility,Zone,Category,Description,Weight,Customer,Aircraft,Mode,Ship Date,ETA,Transit (d),Value (\u20b9L),Critical,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Customs Clearance Hold" ? "apl-row-critical bg-red-50" : r.status === "MRO Shop Teardown" ? "apl-row-warning bg-amber-50" : r.status === "In Transit Air Cargo" || r.status === "Shelf Life Monitoring" ? "apl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-indigo-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="apl-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-700 text-white font-mono text-[10px]">{r.partNumber}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.facility}</td>
                <td className="px-3 py-2"><span className="apl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="apl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.weight >= 1000 ? `${(r.weight/1000).toFixed(1)}T` : `${r.weight}kg`}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.customer}</td>
                <td className="px-3 py-2 text-xs">{r.aircraftType}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 5 ? "text-red-600" : r.transitDays >= 2 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-indigo-700">{r.valueLakhs >= 100 ? `\u20b9${(r.valueLakhs/100).toFixed(0)}Cr` : `\u20b9${r.valueLakhs}L`}</td>
                <td className="px-3 py-2 text-center">{r.criticalFlag === "AOG" ? <span className="apl-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white font-bold">AOG</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`apl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="apl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="apl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Parts Volume by Zone</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(8, 30, 18 + Math.random() * 8).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#1a237e" radius={[4,4,0,0]} name="Units" /></BarChart></div>
            <div className="apl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Volume by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], engine: ri(2, 6, 3.5 + Math.sin(i*0.5)*1), avionics: ri(5, 15, 9 + Math.cos(i*0.6)*2.5), structure: ri(3, 8, 5 + Math.sin(i*0.7)*1.5) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="engine" stackId="1" stroke="#1a237e" fill="#7986cb" name="Engine" /><Area type="monotone" dataKey="avionics" stackId="1" stroke="#283593" fill="#5c6bc0" name="Avionics" /><Area type="monotone" dataKey="structure" stackId="1" stroke="#303f9f" fill="#9fa8da" name="Structure" /></AreaChart></div>
          </div>
          <div className="apl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Transport Mode</h3><BarChart data={[{n:"Charter A300F",v:0.5},{n:"Air Freighter",v:1},{n:"Road Express",v:1.5},{n:"Hand Carry",v:0.3},{n:"Sea Cargo",v:11},{n:"Multimodal",v:4}].map(d => ({...d, v: +ri(d.v*0.8, d.v*1.2, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#283593" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="apl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="apl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-indigo-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
