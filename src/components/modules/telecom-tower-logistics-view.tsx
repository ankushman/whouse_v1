"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#312e81", "#3730a3", "#4338ca", "#4f46e5", "#6366f1", "#1e1b4b", "#272275", "#818cf8"];
const SITES = ["Jio Tower Ranchi Sector-5", "Airtel Tower Nagpur Sadar", "Vi Tower Indore MG Road", "BSNL Tower Patna Kankarbagh", "Jio Tower Coimbatore Peelamedu", "Airtel Tower Jaipur Mansarovar", "Vi Tower Bhubaneswar Unit-3", "BSNL Tower Guwahati Paltan Bazaar"];
const CATEGORIES = ["4G LTE Base Station", "5G NR Radio Unit", "Fiber Backhaul OPGW", ("Tower Structural Steel"), "Diesel Genset 15KVA", "BBU Baseband Unit", "Microwave Link 6GHz", "Tower Lighting Aviation"];
const SHIPMENT_STATUSES = ["Warehouse Validated", "In Transit Road Haul", "Site Foundation Ready", "Installation Climbing Crew", "RF Commissioning Pending", "Site Live Active"];
const ZONES = ["East India Tier-2 Belt", "Central India Pharma Belt", "West India Desert Zone", "North India Bihar Bengal", "South India Textile Belt", "NE India Assam Corridor"];
const MODES = ["Flatbed 10T Truck",("Tower Erection Crane"), "Mini Truck 3.5T", "Self-Climbing Derrick", "Site Jeep 4WD", "Helicopter Sling Remote"];
const TABS = ["Dashboard", "Equipment Registry", "Telecom Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Warehouse Validated": "green", "In Transit Road Haul": "blue", "Site Foundation Ready": "amber", "Installation Climbing Crew": "orange", "RF Commissioning Pending": "slate", "Site Live Active": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyDeployments = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], fourG: ri(20, 50, 35 + Math.sin(i * 0.5) * 8), fiveG: ri(10, 30, 18 + Math.cos(i * 0.6) * 5), fiber: ri(5, 15, 10 + Math.sin(i * 0.7) * 3), power: ri(8, 20, 14 + Math.cos(i * 0.8) * 4) }));
const categoryDist = [{ n: "4G LTE BTS", v: 30 }, { n: "5G NR Radio", v: 25 }, { n: "Fiber Backhaul", v: 15 }, { n: "Tower Steel", v: 12 }, { n: "Diesel Genset", v: 8 }, { n: "BBU Baseband", v: 6 }, { n: "Microwave Link", v: 3 }, { n: "Aviation Light", v: 1 }];
const uptimeRate = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(98, 99.8, 99.2 + Math.sin(i * 0.4) * 0.4)).toFixed(1), target: 99.5 }));
const regionPerf = ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(95, 99.5, 98 + Math.random() * 1).toFixed(0) }));

interface EquipmentRecord { id: string; ticketNo: string; site: string; zone: string; category: string; description: string; weight: number; unit: string; vendor: string; operator: string; towerType: string; mode: string; dispatchDate: string; etaDate: string; transitDays: number; valueLakhs: number; urgencyFlag: string; status: string; remarks: string; }

const records: EquipmentRecord[] = [
  { id: "TTL-0001", ticketNo: "TKT-JIO/RNC/2025/07-0891", site: "Jio Tower Ranchi Sector-5", zone: "East India Tier-2 Belt", category: "5G NR Radio Unit", description: "Samsung 5G NR 64T64R Radio Unit 3.5GHz", weight: 28, unit: "kg", vendor: "Samsung Networks India", operator: "Reliance Jio", towerType: "Ground-Based 40M", mode: "Flatbed 10T Truck", dispatchDate: "2025-07-08", etaDate: "2025-07-10", transitDays: 2, valueLakhs: 18, urgencyFlag: "EXP", status: "In Transit Road Haul", remarks: "Samsung 5G NR 64T64R 3.5GHz radio Ranchi Sector-5 ground tower Jio deployment" },
  { id: "TTL-0002", ticketNo: "TKT-AIR/NGP/2025/07-1234", site: "Airtel Tower Nagpur Sadar", zone: "Central India Pharma Belt", category: "4G LTE Base Station", description: "Ericsson Radio 2205 FDD LTE 1800MHz 4x4 MIMO", weight: 15, unit: "kg", vendor: "Ericsson India", operator: "Bharti Airtel", towerType: "Rooftop 25M", mode: "Mini Truck 3.5T", dispatchDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 8, urgencyFlag: "STD", status: "Warehouse Validated", remarks: "Ericsson 2205 LTE 1800MHz radio Nagpur rooftop tower Airtel 4G expansion" },
  { id: "TTL-0003", ticketNo: "TKT-VI/IDR/2025/07-0567", site: "Vi Tower Indore MG Road", zone: "Central India Pharma Belt", category: "Fiber Backhaul OPGW", description: "OPGW Fiber Cable 24-Core 2km Drum", weight: 1200, unit: "kg", vendor: "Sterlite Technologies", operator: "Vi (Vodafone Idea)", towerType: "Ground-Based 50M", mode: "Flatbed 10T Truck", dispatchDate: "2025-07-07", etaDate: "2025-07-09", transitDays: 2, valueLakhs: 12, urgencyFlag: "STD", status: "Site Foundation Ready", remarks: "OPGW 24-core 2km fiber drum Indore MG Road tower fiber backhaul Vi" },
  { id: "TTL-0004", ticketNo: "TKT-BSNL/PAT/2025/07-0890", site: "BSNL Tower Patna Kankarbagh", zone: "North India Bihar Bengal", category: "Tower Structural Steel", description: "Galvanized Steel Angular Sections 40M Tower Kit", weight: 18000, unit: "kg", vendor: "Skipper Steel Jindal", operator: "BSNL", towerType: "Ground-Based 40M", mode: "Flatbed 10T Truck", dispatchDate: "2025-07-10", etaDate: "2025-07-12", transitDays: 2, valueLakhs: 25, urgencyFlag: "EXP", status: "In Transit Road Haul", remarks: "Galvanized 40M tower kit Patna Kankarbagh BSNL new site erection" },
  { id: "TTL-0005", ticketNo: "TKT-JIO/CBE/2025/07-1122", site: "Jio Tower Coimbatore Peelamedu", zone: "South India Textile Belt", category: "Diesel Genset 15KVA", description: "Cummins 15KVA Silent Diesel Genset for BTS", weight: 850, unit: "kg", vendor: "Cummins India", operator: "Reliance Jio", towerType: "Ground-Based 35M", mode: "Flatbed 10T Truck", dispatchDate: "2025-07-08", etaDate: "2025-07-10", transitDays: 2, valueLakhs: 4.5, urgencyFlag: "STD", status: "Installation Climbing Crew", remarks: "Cummins 15KVA silent DG Coimbatore Peelamedu Jio tower power backup installation" },
  { id: "TTL-0006", ticketNo: "TKT-AIR/JAI/2025/07-0345", site: "Airtel Tower Jaipur Mansarovar", zone: "West India Desert Zone", category: "BBU Baseband Unit", description: "Huawei BBU5900 5G Baseband Processing Unit", weight: 12, unit: "kg", vendor: "Huawei India", operator: "Bharti Airtel", towerType: "Rooftop 30M", mode: "Mini Truck 3.5T", dispatchDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 6, urgencyFlag: "EXP", status: "RF Commissioning Pending", remarks: "Huawei BBU5900 5G baseband Jaipur Mansarovar rooftop Airtel RF commissioning" },
  { id: "TTL-0007", ticketNo: "TKT-VI/BHU/2025/07-0567", site: "Vi Tower Bhubaneswar Unit-3", zone: "East India Tier-2 Belt", category: "Microwave Link 6GHz", description: "Ceragon IP-20 6GHz Microwave 200Mbps Backhaul", weight: 35, unit: "kg", vendor: "Ceragon Networks India", operator: "Vi (Vodafone Idea)", towerType: "Rooftop 20M", mode: "Mini Truck 3.5T", dispatchDate: "2025-07-07", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 9, urgencyFlag: "STD", status: "Site Live Active", remarks: "Ceragon 6GHz microwave Bhubaneswar Vi rooftop tower backhaul link active" },
  { id: "TTL-0008", ticketNo: "TKT-BSNL/GHY/2025/07-0891", site: "BSNL Tower Guwahati Paltan Bazaar", zone: "NE India Assam Corridor", category: "Tower Lighting Aviation", description: "Aviation Warning Light Solar LED System", weight: 25, unit: "kg", vendor: "Dialight UK via India", operator: "BSNL", towerType: "Ground-Based 45M", mode: "Site Jeep 4WD", dispatchDate: "2025-07-10", etaDate: "2025-07-12", transitDays: 2, valueLakhs: 2.5, urgencyFlag: "STD", status: "Installation Climbing Crew", remarks: "Aviation solar LED light system Guwahati Paltan Bazaar BSNL tower installation" },
  { id: "TTL-0009", ticketNo: "TKT-JIO/RNC/2025/07-1234", site: "Jio Tower Ranchi Sector-5", zone: "East India Tier-2 Belt", category: "5G NR Radio Unit", description: "Samsung 5G mmWave 5G NR Unit 26GHz", weight: 18, unit: "kg", vendor: "Samsung Networks India", operator: "Reliance Jio", towerType: "Rooftop 30M", mode: "Mini Truck 3.5T", dispatchDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 22, urgencyFlag: "EXP", status: "Warehouse Validated", remarks: "Samsung 5G mmWave 26GHz radio Ranchi rooftop Jio indoor stadium coverage" },
  { id: "TTL-0010", ticketNo: "TKT-AIR/NGP/2025/07-0678", site: "Airtel Tower Nagpur Sadar", zone: "Central India Pharma Belt", category: "4G LTE Base Station", description: "Nokia AirScale 10 BTS Macro LTE 900MHz", weight: 22, unit: "kg", vendor: "Nokia India", operator: "Bharti Airtel", towerType: "Ground-Based 35M", mode: "Flatbed 10T Truck", dispatchDate: "2025-07-08", etaDate: "2025-07-10", transitDays: 2, valueLakhs: 10, urgencyFlag: "STD", status: "Site Foundation Ready", remarks: "Nokia AirScale 10 LTE 900MHz Nagpur ground tower Airtel capacity expansion" },
  { id: "TTL-0011", ticketNo: "TKT-VI/IDR/2025/07-0901", site: "Vi Tower Indore MG Road", zone: "Central India Pharma Belt", category: "Tower Structural Steel", description: "Monopole 25M Single-Section Galvanized", weight: 5500, unit: "kg", vendor: "Emmsons Tower Tech", operator: "Vi (Vodafone Idea)", towerType: "Rooftop 25M", mode: "Tower Erection Crane", dispatchDate: "2025-07-07", etaDate: "2025-07-08", transitDays: 1, valueLakhs: 8, urgencyFlag: "STD", status: "Site Live Active", remarks: "Monopole 25M galvanized Indore MG Road Vi rooftop tower commissioned live" },
  { id: "TTL-0012", ticketNo: "TKT-BSNL/PAT/2025/07-0234", site: "BSNL Tower Patna Kankarbagh", zone: "North India Bihar Bengal", category: "BBU Baseband Unit", description: "ZTE BBU3900 4G Baseband Unit FDD-TDD", weight: 10, unit: "kg", vendor: "ZTE India", operator: "BSNL", towerType: "Ground-Based 40M", mode: "Mini Truck 3.5T", dispatchDate: "2025-07-09", etaDate: "2025-07-10", transitDays: 1, valueLakhs: 4, urgencyFlag: "STD", status: "RF Commissioning Pending", remarks: "ZTE BBU3900 4G baseband Patna BSNL tower RF commissioning ZTE team" },
  { id: "TTL-0013", ticketNo: "TKT-JIO/CBE/2025/07-0456", site: "Jio Tower Coimbatore Peelamedu", zone: "South India Textile Belt", category: "Fiber Backhaul OPGW", description: "Single Mode Fiber SMF-28 96-Core 5km Drum", weight: 2800, unit: "kg", vendor: "Corning India via STL", operator: "Reliance Jio", towerType: "Ground-Based 35M", mode: "Flatbed 10T Truck", dispatchDate: "2025-07-06", etaDate: "2025-07-09", transitDays: 3, valueLakhs: 15, urgencyFlag: "STD", status: "In Transit Road Haul", remarks: "SMF-28 96-core 5km fiber Coimbatore Peelamedu Jio tower fiber backhaul long-haul" },
  { id: "TTL-0014", ticketNo: "TKT-AIR/JAI/2025/07-0789", site: "Airtel Tower Jaipur Mansarovar", zone: "West India Desert Zone", category: "Diesel Genset 15KVA", description: "Ashok Leyland 25KVA Soundproof DG Set", weight: 1200, unit: "kg", vendor: "Ashok Leyland Projects", operator: "Bharti Airtel", towerType: "Ground-Based 40M", mode: "Flatbed 10T Truck", dispatchDate: "2025-07-10", etaDate: "2025-07-11", transitDays: 1, valueLakhs: 6.5, urgencyFlag: "STD", status: "Warehouse Validated", remarks: "AL 25KVA soundproof DG Jaipur Mansarovar Airtel ground tower power" },
];

const transitCount = records.filter(rec => rec.status === "In Transit Road Haul").length;
const workCount = records.filter(rec => rec.status === "Installation Climbing Crew" || rec.status === "RF Commissioning Pending").length;
const liveCount = records.filter(rec => rec.status === "Site Live Active" || rec.status === "Warehouse Validated").length;
const totalValue = records.reduce((s, rec) => s + rec.valueLakhs, 0);

const kpis = [
  { l: "In Transit", v: transitCount, s: "road haul" },
  { l: "Installation/RF", v: workCount, s: "climbing/comm" },
  { l: "Live/Validated", v: liveCount, s: "active/ready" },
  { l: "Total Equipment Value", v: `\u20b9${(totalValue / 100).toFixed(1)}Cr`, s: "all equipment" },
];

const INSIGHTS = [
  {
    t: "India Telecom Tower Infrastructure: 700,000+ Towers, Jio Airtel Vi BSNL, \u20b97,00,000 Crore Annual Capex",
    c: "India has the world\u2019s 2nd largest telecom network (1.2 billion wireless subscribers, 1,200+ billion minutes/month) supported by 700,000+ telecom towers. Annual infrastructure capex: \u20b97,00,000 crore (USD 85 billion). Major tower companies: (1) Indus Towers (Bharti Infratel + Indus merger): India\u2019s largest tower company, 185,000+ towers (10T+ revenue). Operations: all 22 telecom circles, 85% tenancy ratio (average 2.5 tenants per tower). (2) Jio Platforms subsidiary: Reliance Jio owns 100,000+ towers (ground-based, rooftop, pole-mounted). Jio installed 100,000+ towers in 18 months (2016-2017) for 4G launch. (3) Vi (Vodafone Idea): 80,000+ towers (sharing with Indus and ATC). (4) ATC India (American Tower Corporation): 10,000+ towers in India (acquired from Reliance Infratel). (5) BSNL: 100,000+ towers (government-owned, mostly ground-based 40-50M lattice towers). (6) New entrant: Tata Play Fiber is building 50,000+ fiber towers. Tower types in India: (a) Ground-based lattice towers: 30-60M height, galvanized angular steel (L-angle, IS 2062 Grade). Load: 150-400 kg antenna + 50 kg microwave + 30 kg aviation light + wind/ice loads. Foundation: 15-25T concrete (4-8 piles, 6-12m depth). Cost: \u20b925-50 lakh per tower (including foundation, erection, fencing). (b) Rooftop towers: 15-35M monopole on building rooftop. Used in dense urban areas (Mumbai, Delhi, Bengaluru, Chennai). Cost: \u20b98-15 lakh (lower than ground due to no foundation). (c) Camouflage towers: disguised as palm trees, lamp posts, chimney (for residential areas and heritage zones). Cost: \u20b920-40 lakh. (d) Pole-mounted sites: 6-12M street poles for small cells (5G densification). Cost: \u20b92-5 lakh. India\u2019s 5G rollout: (a) Jio: 350,000+ 5G sites (700 MHz + 3.5 GHz + 26 GHz), covering 1,000+ cities (2024). (b) Airtel: 200,000+ 5G sites (3.5 GHz), covering 800+ cities. (c) Vi: 10,000+ 5G sites (limited rollout due to financial stress). (d) BSNL: 4G/5G indigenous stack (TCS-C-DOT) under deployment. 5G equipment: Ericsson (Airtel), Samsung (Jio), Nokia (Airtel), ZTE (limited due to security). India\u2019s 5G infrastructure investment: \u20b93,00,000 crore (USD 36 billion) by 2026.",
  },
  {
    t: "Telecom Equipment Logistics: BTS Radio, BBU, Fiber Backhaul, Microwave Link, DG Set Supply Chain",
    c: "India\u2019s telecom equipment logistics involves multiple equipment categories delivered to 700,000+ tower sites nationwide: (1) BTS/RRH (Base Transceiver Station / Remote Radio Head): the active radio unit mounted on tower. 4G: Ericsson Radio 2205, Nokia AirScale 10, Huawei BTS3900, ZTE BS8800. Weight: 10-25 kg per unit. Power: 200-800W. 5G: Samsung 5G NR 64T64R (28 kg, 800W), Massive MIMO (64T64R = 64 transmitters, 64 receivers). India\u2019s BTS deployment: 2,500,000+ BTS units (4G + 5G + 2G/3G remaining). Logistics: OEM warehouse to regional hub (air/road), then mini-truck to site. Handling: ESD-sensitive, needs climate-controlled warehouse (15-30 degrees Celsius, 40-60% humidity). (2) BBU (Baseband Unit): processes digital signals, located in equipment room at tower base. Weight: 8-15 kg. Ericsson BBU6630, Huawei BBU5900, Nokia Flexi. 5G BBU handles 100 Gbps throughput. (3) Fiber backhaul: backbone connectivity from BTS to core network. India has 3,500,000+ fiber km (FTTH + tower fiber). OPGW (Optical Ground Wire): fiber embedded in overhead ground wire on tower. Cable: 12-96 core single-mode fiber (SMF-28). Drum weight: 500-3,000 kg per 2-5 km drum. Fiber laying: trenching (urban), aerial (rural), and directional boring (highway crossings). (4) Microwave link: for sites without fiber (20% of India towers). Frequency: 6-38 GHz. Capacity: 200 Mbps to 2 Gbps. Vendors: Ceragon (IP-20), NEC (Pasolink), Huawei (RTN). Weight: 20-40 kg per radio + antenna. (5) DG set: diesel generator backup for tower power (India: 30% of towers have no grid, 40% unreliable grid). DG capacity: 5-25 KVA. Vendors: Cummins, Ashok Leyland, Mahindra, Kirloskar. Weight: 500-2,000 kg. Fuel logistics: diesel delivered to 200,000+ sites monthly (15,000+ KL diesel/month for telecom DG sets, \u20b91200 crore/year). India\u2019s DG set pollution: telecom DG sets emit 3.5 million tonnes CO2/year. Transition to solar: 100,000+ sites converted to solar+hybrid (solar panel + battery + DG backup). Logistics for equipment delivery: (a) Warehouse: OEM/indus regional warehouse (15-30 in India, each 10,000 sq ft climate-controlled), (b) Regional to district: flatbed 10T truck (50-100 sites per truck route), (c) District to site: mini truck 3.5T (10-20 sites per day), (d) Erection crew: 3-5 persons per tower site (climbing crew with safety harness, RF tools), (e) Installation: 4-8 hours per BTS, 2-3 days for tower erection, (f) RF commissioning: 1-2 days (drive test, optimization, neighbor list, handover tuning).",
  },
  {
    t: "Tower Sharing, Spectrum Allocation, and India\u2019s 5G vs 4G Rollout Logistics",
    c: "India\u2019s tower sharing model is among the most efficient globally: (1) Indus Towers model: single tower hosts 2-3 operators (Jio + Airtel + Vi sharing same infrastructure). Tenancy ratio: 2.5 average (target 3.0). Benefits: 30-40% capex reduction, 20-25% opex reduction per operator, faster rollout (shared tower already exists, operator only installs radio+antenna). (2) Active infrastructure sharing: Jio and Vi sharing spectrum in some circles (MVNO model not yet permitted in India). (3) Fiber sharing: Indus, Jio, and Airtel share fiber ducts in urban areas (common in Bengaluru, Mumbai, Delhi). Spectrum allocation (India\u2019s most complex logistics exercise): (a) TRAI (Telecom Regulatory Authority of India) recommends, DoT (Department of Telecom) auctions. (b) Spectrum bands: 700 MHz (Jio, Airtel, Vi, BSNL), 800 MHz, 900 MHz, 1800 MHz, 2100 MHz (3G/BWA), 2300 MHz, 2500 MHz (4G TD-LTE), 3300-3600 MHz (5G mid-band), 26 GHz (5G mmWave). (c) Auction value: 5G auction 2022: \u20b91,50,000 crore (USD 19 billion) for 72 GHz spectrum. Jio: \u20b988,000 crore, Airtel: \u20b943,000 crore, Vi: \u20b918,000 crore. (d) Spectrum logistics: frequency coordination with DoT, SACFA (Spectrum Coordination Committee), and defence band sharing. Interference management: guard bands, power control, filters. India\u2019s 5G rollout logistics: (a) Phase-1 (2022-2024): 8,000+ cities/towns, Jio 350,000 sites, Airtel 200,000 sites. (b) Phase-2 (2024-2026): 500 districts, rural 5G, BSNL indigenous 4G/5G stack (TCS-C-DOT network). (c) Equipment: Samsung (Jio exclusive 5G vendor), Ericsson (Airtel primary), Nokia (Airtel secondary), ZTE (BSNL 4G). (d) Tower densification: 5G mid-band (3.5 GHz) has shorter range than 4G (700/900 MHz), requiring 2-3x more sites per km2. India needs 1,000,000+ towers for full 5G coverage (from 700,000+ current). (e) Small cells: street pole-mounted 5G NR units for dense urban areas. Target: 500,000 small cells by 2028. India\u2019s telecom logistics challenges: (a) Right-of-way (RoW): municipal permissions for tower erection, fiber trenching, DG set installation. Average delay: 3-6 months per city. (b) Power availability: 30% of tower sites off-grid (northeast, Jharkhand, Chhattisgarh, rural areas). (c) Security: tower sites vandalized in rural areas (diesel theft, battery theft, cable theft). Indus Tower loses \u20b9500 crore/year to vandalism. (d) Environmental: bird strikes on guyed towers, noise from DG sets (civic complaints in residential areas), and visual impact (aesthetic concerns in heritage cities). India\u2019s 6G preparation: ISRO satellite-integrated 6G pilot planned 2028, indigenous 6G testbed by IIT Madras.",
  },
  {
    t: "Telecom Tower Safety, Maintenance Cycle, and Digital Transformation",
    c: "India\u2019s telecom tower safety and maintenance: (1) Structural safety: towers designed per IS 800 (steel structures), IS 875 (wind loads), with 50-year design life. Inspection: (a) Annual structural audit by third-party (mounting bolts, welds, foundation, guy wires, anti-climbing devices), (b) Post-event inspection after cyclone (east coast), earthquake (NE India), or flood (Bihar, Assam). (c) Tower load audit: when adding new operator equipment, load calculation by structural engineer (many Indian towers overloaded beyond design capacity due to 5G massive MIMO weight: 28 kg per radio unit x 3-4 per site). (2) Safety compliance: (a) DoT guidelines for tower safety (mandatory annual audit report to DoT), (b) TRAI QoS standards: minimum 99.5% tower uptime, <2% call drop rate, (c) Aviation safety: red warning light (solar LED) mandatory above 60M height, obstacle marking, NOTAM filing for new towers near airports. (3) Power infrastructure: (a) Grid power: 70% of sites grid-connected, (b) DG set: 60% of sites have diesel backup (diesel 15-25 KVA, 12-24 hours runtime per tank), (c) Battery bank: 80% of sites have VRLA/lead-acid batteries (48V DC, 200-600 AH), (d) Solar: 15% of sites solar-powered (growing rapidly), (e) Hybrid controller: solar+grid+DG auto-switching with priority logic. Battery logistics: VRLA batteries replaced every 3-5 years (sulfation in hot Indian climate reduces life). India replaces 5 million+ telecom batteries/year. Lead-acid battery recycling: 95% recycling rate (India\u2019s battery recycling industry: \u20b95,000 crore). Maintenance cycle: (a) Preventive: quarterly site visit (DG oil change, battery water top-up, panel cleaning, visual inspection), (b) Predictive: battery impedance monitoring (monthly), tower inclination monitoring (quarterly), temperature monitoring (continuous), (c) Corrective: fault rectification within 4 hours (SLA: 99.5% uptime, <1 hour mean time to repair in urban, <4 hours in rural). Digital transformation: (a) Drone inspection: tower structural inspection by drone with HD camera + thermal imaging (replacing manual climbing, 10x faster, safer), (b) IoT sensors: tower tilt sensor, wind speed sensor, fuel level sensor, battery health sensor, door open sensor (tamper detection), (c) AI-based NOC: Airtel Network Operations Centre uses AI to predict tower faults 24 hours in advance (reducing downtime by 30%), (d) Digital twin: Indus Towers pilot for 1,000 towers (3D model with real-time data overlay), and (e) Blockchain: battery lifecycle tracking (from manufacturer to installation to recycling). India\u2019s telecom tower workforce: 200,000+ technicians (erection crew, fibre splicers, RF engineers, DG mechanics). Average salary: \u20b915,000-25,000/month. Safety: helmet, harness, gloves mandatory. Fatalities: 15-20 per year (tower fall, electrocution, road accident during transport). India\u2019s tower target: 1,000,000+ towers by 2030 (from 700,000+), driven by 5G densification, rural broadband (BharatNet), and smart city infrastructure.",
  },
];

export default function TelecomTowerLogisticsView() {
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
      if (!r.id.toLowerCase().includes(q) && !r.ticketNo.toLowerCase().includes(q) && !r.site.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.vendor.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof EquipmentRecord] as string));
  });

  return (
    <div className="ttl-root p-6 space-y-6">
      <PageHeader title="Telecom Tower Logistics" description="India telecom tower equipment supply chain covering Jio Airtel Vi BSNL, 4G LTE BTS 5G NR massive MIMO radio, fiber backhaul OPGW, tower structural steel, diesel genset, BBU baseband, microwave link, Indus Towers ATC BSNL site logistics and RF commissioning" />
      <div className="ttl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`ttl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-indigo-700 text-white" : "text-gray-600 hover:bg-indigo-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="ttl-dash space-y-6">
          <div className="ttl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="ttl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 ttl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-indigo-700 ttl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 ttl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ttl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Equipment Deployments (Units)</h3><BarChart data={monthlyDeployments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="fourG" fill="#312e81" radius={[4,4,0,0]} name="4G BTS" /><Bar dataKey="fiveG" fill="#3730a3" radius={[4,4,0,0]} name="5G NR" /><Bar dataKey="fiber" fill="#4338ca" radius={[4,4,0,0]} name="Fiber" /><Bar dataKey="power" fill="#4f46e5" radius={[4,4,0,0]} name="Power" /></BarChart></div>
            <div className="ttl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Equipment Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ttl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Network Uptime Rate (%) vs 99.5% Target</h3><LineChart data={uptimeRate} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[97, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#312e81" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="ttl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Region Uptime Performance</h3><BarChart data={regionPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[94, 100]} /><Tooltip /><Bar dataKey="v" fill="#3730a3" radius={[4,4,0,0]} name="Uptime %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="ttl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Telecom Tower", href: "#" }, { label: "Equipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="ttl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Ticket No,Site,Zone,Category,Description,Weight,Vendor,Operator,Tower,Mode,Dispatch,ETA,Transit (d),Value (\u20b9L),Urgency,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Installation Climbing Crew" ? "ttl-row-warning bg-amber-50" : r.status === "In Transit Road Haul" || r.status === "RF Commissioning Pending" ? "ttl-row-info bg-blue-50" : r.status === "Site Foundation Ready" ? "ttl-row-warning bg-amber-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-indigo-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="ttl-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-700 text-white font-mono text-[10px]">{r.ticketNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.site}</td>
                <td className="px-3 py-2"><span className="ttl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="ttl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.weight >= 1000 ? `${(r.weight/1000).toFixed(1)}T` : r.weight >= 100 ? `${r.weight}kg` : `${r.weight}kg`}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.vendor}</td>
                <td className="px-3 py-2 text-xs">{r.operator}</td>
                <td className="px-3 py-2 text-xs">{r.towerType}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 3 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-indigo-700">{`\u20b9${r.valueLakhs}L`}</td>
                <td className="px-3 py-2 text-center">{r.urgencyFlag === "EXP" ? <span className="ttl-badge inline-block px-2 py-0.5 rounded text-xs bg-orange-500 text-white">EXP</span> : <span className="text-gray-400">STD</span>}</td>
                <td className="px-3 py-2"><span className={`ttl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="ttl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="ttl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Equipment Volume by Zone</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(15, 40, 25 + Math.random() * 10).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#312e81" radius={[4,4,0,0]} name="Units" /></BarChart></div>
            <div className="ttl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Volume by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], fourG: ri(12, 30, 20 + Math.sin(i*0.5)*5), fiveG: ri(6, 18, 10 + Math.cos(i*0.6)*3), fiber: ri(3, 10, 6 + Math.sin(i*0.7)*2) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="fourG" stackId="1" stroke="#312e81" fill="#818cf8" name="4G BTS" /><Area type="monotone" dataKey="fiveG" stackId="1" stroke="#3730a3" fill="#6366f1" name="5G NR" /><Area type="monotone" dataKey="fiber" stackId="1" stroke="#4338ca" fill="#4f46e5" name="Fiber" /></AreaChart></div>
          </div>
          <div className="ttl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Days by Mode</h3><BarChart data={[{n:"Flatbed 10T",v:1.5},{n:"Mini Truck",v:1},{n:"Tower Crane",v:1},{n:"Self-Climb",v:3},{n:"Site Jeep 4WD",v:2},{n:"Helicopter",v:0.5}].map(d => ({...d, v: +ri(d.v*0.7, d.v*1.3, d.v + Math.random()*0.2).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#3730a3" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="ttl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="ttl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-indigo-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
