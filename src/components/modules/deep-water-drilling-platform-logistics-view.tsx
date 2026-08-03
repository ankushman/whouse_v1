"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1e3a5f", "#1e40af", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];
const OPERATORS = ["ONGC Mumbai High", "Oil India Jorhat", "GAIL Deepwater Kolkata", "Reliance Industries Jamnagar", "Aban Offshore Chennai", "Essar Oil Vadodara", "Shriram EPC Mumbai", "Dolphin Drilling Navi Mumbai"];
const CATEGORIES = ["Semi-Sub Drilling Rig 500m", "Jack-Up Drilling Rig 150m", "Drillship DP3 3000m", "Tender-Assisted Rig 200m", "FPSO Production 1500m", "Compliant Tower Platform 400m", "SPAR Production Platform 1000m", "Tension Leg Platform 600m"];
const SHIPMENT_STATUSES = ["Rig Mobilization Transit", "Well Spud Drilling Active", "Casing Running Cementing", "Logging Completion Phase", "Well Testing Flowback", "Rig Move Demobilization"];
const ZONES = ["Krishna Godavari Basin AP", "Mumbai Offshore Basin MH", "Assam Arakan Fold Belt", "Cambay Basin Gujarat", "Rajasthan Thar Desert", "Cauvery Basin TN Palk Bay", "Kutch Offshore Saurashtra", "Andaman Nicobar Deepwater"];
const MODES = ["Heavy Lift Vessel 8000T", "Platform Supply Vessel 3000T", "Anchor Handling Tug AHT", "Multipurpose Support Vessel", "Diving Support Vessel DSV", "Helicopter Crew Change"];
const TABS = ["Dashboard", "Platform Registry", "Drilling Analytics", "Insights"];

const statusColor: Record<string, string> = { "Rig Mobilization Transit": "blue", "Well Spud Drilling Active": "orange", "Casing Running Cementing": "orange", "Logging Completion Phase": "blue", "Well Testing Flowback": "orange", "Rig Move Demobilization": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyWells = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], semiSub: +(4 + Math.sin(i * 0.5) * 2).toFixed(0), jackUp: +(6 + Math.cos(i * 0.6) * 3).toFixed(0), drillship: +(2 + Math.sin(i * 0.4) * 1).toFixed(0), fpso: +(1 + Math.cos(i * 0.7) * 0.5).toFixed(1) }));
const rigTypeDist = [{ n: "Semi-Sub", v: 28 }, { n: "Jack-Up", v: 32 }, { n: "Drillship", v: 18 }, { n: "Tender Assist", v: 10 }, { n: "FPSO", v: 8 }, { n: "SPAR/TLP", v: 4 }];
const depthTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], shallow: +(150 + Math.sin(i * 0.3) * 30).toFixed(0), mid: +(800 + Math.cos(i * 0.4) * 200).toFixed(0), deep: +(2500 + Math.sin(i * 0.5) * 500).toFixed(0), ultra: +(3500 + Math.cos(i * 0.6) * 400).toFixed(0) }));
const zoneProduction = [
  { zone: "KG", bopd: 85000 },
  { zone: "MH", bopd: 120000 },
  { zone: "AS", bopd: 15000 },
  { zone: "GJ", bopd: 45000 },
  { zone: "RJ", bopd: 200000 },
  { zone: "TN", bopd: 8000 },
  { zone: "KT", bopd: 25000 },
  { zone: "AN", bopd: 5000 }
];

const INSIGHTS = [
  { t: "India\u2019s Deepwater E&P: KG-D6 Block and NELP Licensing Rounds", c: "India\u2019s deepwater exploration and production is anchored by the Krishna Godavari (KG) basin D6 block operated by Reliance Industries in partnership with BP, producing 85,000 barrels per day from 22 subsea wells at water depths of 500-1200m. The Dhirubhai-1 to Dhirubhai-45 deepwater wells represent India\u2019s largest offshore gas development with 2.7TCF of proven reserves connected via 350km of subsea flowlines and risers to the onshore gas processing plant at Gadimoga, Andhra Pradesh. The Ministry of Petroleum and Natural Gas (MoPNG) has conducted 10 rounds of the New Exploration Licensing Policy (NELP) and transitioned to the Open Acreage Licensing Policy (OALP) in 2019, offering 1.5 million sq km of sedimentary basins for bidding. ONGC\u2019s deepwater campaign in the Mumbai Offshore Basin targets Mesozoic reservoirs at 2500-3500m water depth with the Sagar Samrat drillship upgraded to DP3 dynamic positioning for operations in 3000m water depth. India\u2019s total deepwater drilling expenditure is estimated at \u20b968,000 crore during 2024-2030, with 45 planned deepwater wells across KG, Mumbai, Cauvery, and Andaman offshore basins." },
  { t: "Semi-Submersible and Jack-Up Rig Fleet for Indian Offshore Drilling", c: "India\u2019s offshore drilling fleet comprises 12 active semi-submersible rigs and 18 jack-up rigs operated by ONGC (7 semi-subs, 12 jack-ups), Aban Offshore (3 semi-subs, 4 jack-ups), and Shriram EPC (2 jack-ups). Semi-submersible drilling rigs for Indian deepwater operations include Aban Iceberg (400m water depth rating, 15,000 psi BOP, 6,000m drill depth), Sagar Kiran (500m, 20,000 psi, 7,500m), and ONGC\u2019s newly acquired Sagar Nidhi (600m, 25,000 psi, 9,000m). Jack-up rigs operating in Indian shallow waters include Sagar Bhushan (150m, 350ft leg length, 10,000psi), Sagar Vijay (120m, 300ft legs), and Aban Lloyd (91m, 300ft). Rig day rates for Indian offshore operations range from \u20b91.5-3.0 crore per day for jack-ups and \u20b94.0-8.0 crore for semi-subs, with deepwater drillships commanding \u20b910-15 crore per day. The average well duration in Indian deepwater is 45-90 days for exploration wells and 30-60 days for development wells, with mobilization/demobilization adding 10-20 days per well campaign." },
  { t: "FPSO and Floating Production Systems for Indian Deepwater Fields", c: "Floating Production Storage and Offloading (FPSO) vessels are the primary production systems for India\u2019s deepwater fields, with Reliance Industries operating FPSO Dhirubhai-1 (150,000 bbl storage, 85,000 bopd processing, 200m water depth) in KG-D6 block and ONGC planning FPSO Mumbai Deep (250,000 bbl storage, 120,000 bopd, 800m depth) for the western offshore basin. FPSO conversion and newbuild costs for Indian projects range from \u20b98,000-15,000 crore per vessel, with hull fabrication at L&T Kattupalli Shipyard and topside module integration at Cochin Shipyard. Compliant tower platforms for moderate water depths (300-600m) are being installed by Essar Oil at the Ratna Saurashtra field, consisting of a 60m diameter base template, 550m tall slender tower with 3-level topside deck. Tension Leg Platforms (TLPs) for deepwater production at 600-1200m are under engineering study by ONGC for the KG-DWN-98/2 block, with a proposed 8,000T hull, 12 tendons of 800m length, and 60,000 bopd processing capacity at an estimated cost of \u20b912,000 crore." },
  { t: "Deepwater Drilling Technology: MWD LWD MPD Managed Pressure in Indian Fields", c: "India\u2019s deepwater drilling operations employ advanced Measurement While Drilling (MWD), Logging While Drilling (LWD), and Managed Pressure Drilling (MPD) technologies provided by Schlumberger, Halliburton, and Baker Hughes. MWD tools transmit real-time wellbore trajectory data (inclination, azimuth, tool face) via mud pulse telemetry at 3-12 bits per second through 3000m of drillstring, while LWD provides formation evaluation (gamma ray, resistivity, density, neutron porosity) at the bit for geosteering in thin reservoir sections. MPD systems using rotary control devices (RCD) and automated choke manifolds maintain constant bottomhole pressure within +/-50 psi tolerance, critical for drilling narrow pore-pressure-fracture-gradient windows in KG basin overpressured shales. India\u2019s deepest well, ONGC DSDP-1 in the Andaman deepwater, reached 7,500m measured depth (5,400m true vertical depth) at 3,500m water depth, setting Indian records for both water depth and total well depth. Well completion in Indian deepwater uses 7-inch premium VAM TOP connection tubing with intelligent completion systems (ICVs, ICDs) for multi-zone reservoir management, with subsea christmas trees rated to 10,000 psi and 150\u00b0C for high-pressure high-temperature (HPHT) wells in the Mumbai offshore Mesozoic targets." }
];

interface DWPRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; waterDepthM: number; drillDepthM: number; wellCount: number; platformT: number; dayRateCr: number; origin: string; project: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; rigName: string; status: string; remarks: string; }

const records: DWPRecord[] = [
  { id: "DWP-0001", batchNo: "ONG/MUM/2025/SS-0012", operator: "ONGC Mumbai High", zone: "Mumbai Offshore Basin MH", category: "Semi-Sub Drilling Rig 500m", description: "Semi-sub drilling rig Sagar Kiran for Mumbai High deepwater exploration at 500m water depth 7500m drill depth 20000psi BOP with MWD LWD and MPD systems", waterDepthM: 500, drillDepthM: 7500, wellCount: 6, platformT: 25000, dayRateCr: 6.5, origin: "ONGC Mumbai Base MH", project: "Mumbai Deepwater Expl-2025", state: "Maharashtra", mode: "Heavy Lift Vessel 8000T", prodDate: "2025-01-10", shipDate: "2025-03-25", transitDays: 5, contractValue: 4500000000, rigName: "Sagar Kiran", status: "Well Spud Drilling Active", remarks: "Semi-sub ONGC Mumbai drilling well spud" },
  { id: "DWP-0002", batchNo: "OIL/JRH/2025/JU-0018", operator: "Oil India Jorhat", zone: "Assam Arakan Fold Belt", category: "Jack-Up Drilling Rig 150m", description: "Jack-up drilling rig Sagar Bhushan for Assam shallow offshore at 150m water depth 5000m drill depth 10000psi BOP with conventional mud logging", waterDepthM: 150, drillDepthM: 5000, wellCount: 8, platformT: 12000, dayRateCr: 2.8, origin: "OIL Jorhat Base AS", project: "Assam Shelf Dev-2025", state: "Assam", mode: "Platform Supply Vessel 3000T", prodDate: "2025-02-15", shipDate: "2025-05-10", transitDays: 8, contractValue: 1800000000, rigName: "Sagar Bhushan", status: "Casing Running Cementing", remarks: "Jack-up OIL Assam casing running" },
  { id: "DWP-0003", batchNo: "REL/JMN/2025/DS-0025", operator: "Reliance Industries Jamnagar", zone: "Krishna Godavari Basin AP", category: "Drillship DP3 3000m", description: "DP3 drillship Dhirubhai Deepwater-1 for KG-D6 block at 1200m water depth 9000m drill depth 25000psi BOP with advanced MPD and geosteering LWD", waterDepthM: 1200, drillDepthM: 9000, wellCount: 4, platformT: 55000, dayRateCr: 12.0, origin: "Reliance Jamnagar Yard GJ", project: "KG-D6 Phase-III Deep", state: "Andhra Pradesh", mode: "Anchor Handling Tug AHT", prodDate: "2025-01-25", shipDate: "2025-04-15", transitDays: 3, contractValue: 8500000000, rigName: "Dhirubhai Deepwater-1", status: "Well Spud Drilling Active", remarks: "Drillship Reliance KG-D6 spud active" },
  { id: "DWP-0004", batchNo: "GAI/KOL/2025/FPS-0032", operator: "GAIL Deepwater Kolkata", zone: "Cambay Basin Gujarat", category: "FPSO Production 1500m", description: "FPSO Sagar Shakti for Cambay deepwater production at 800m water depth 150000bbl storage 120000bopd processing with 12 subsea trees and 200km flowline", waterDepthM: 800, drillDepthM: 0, wellCount: 12, platformT: 85000, dayRateCr: 0, origin: "L&T Kattupalli Shipyard TN", project: "Cambay Deep FPSO-2025", state: "Gujarat", mode: "Heavy Lift Vessel 8000T", prodDate: "2024-12-01", shipDate: "2025-03-20", transitDays: 7, contractValue: 15000000000, rigName: "Sagar Shakti FPSO", status: "Well Testing Flowback", remarks: "FPSO GAIL Cambay testing flowback" },
  { id: "DWP-0005", batchNo: "ABN/CHN/2025/TA-0041", operator: "Aban Offshore Chennai", zone: "Cauvery Basin TN Palk Bay", category: "Tender-Assisted Rig 200m", description: "Tender-assisted drilling rig Aban Pride for Cauvery basin at 200m water depth 6000m drill depth 15000psi BOP with MWD and logging suite", waterDepthM: 200, drillDepthM: 6000, wellCount: 5, platformT: 18000, dayRateCr: 4.2, origin: "Aban Chennai Base TN", project: "Cauvery Palk Bay Expl-2025", state: "Tamil Nadu", mode: "Multipurpose Support Vessel", prodDate: "2025-03-05", shipDate: "2025-06-18", transitDays: 2, contractValue: 2800000000, rigName: "Aban Pride", status: "Logging Completion Phase", remarks: "Tender Assist Aban Cauvery logging" },
  { id: "DWP-0006", batchNo: "ESS/VDR/2025/CT-0048", operator: "Essar Oil Vadodara", zone: "Kutch Offshore Saurashtra", category: "Compliant Tower Platform 400m", description: "Compliant tower platform Ratna-Saurashtra at 350m water depth 60m base diameter 550m tower 3-level topside with 12 tendons and 50000bopd processing", waterDepthM: 350, drillDepthM: 4500, wellCount: 16, platformT: 42000, dayRateCr: 0, origin: "Essar Vadodara Yard GJ", project: "Ratna Saurashtra CT-2025", state: "Gujarat", mode: "Heavy Lift Vessel 8000T", prodDate: "2025-02-10", shipDate: "2025-05-22", transitDays: 4, contractValue: 12000000000, rigName: "Ratna CT Platform", status: "Rig Mobilization Transit", remarks: "Compliant Tower Essar Kutch mobilizing" },
  { id: "DWP-0007", batchNo: "SRE/MUM/2025/SP-0055", operator: "Shriram EPC Mumbai", zone: "Andaman Nicobar Deepwater", category: "SPAR Production Platform 1000m", description: "SPAR production platform for Andaman deepwater at 1000m water depth single cylinder hull 20000T 12 tendons 800m length with 60000bopd topside processing", waterDepthM: 1000, drillDepthM: 0, wellCount: 8, platformT: 20000, dayRateCr: 0, origin: "Cochin Shipyard KL", project: "Andaman SPAR Deep-2025", state: "Andaman", mode: "Heavy Lift Vessel 8000T", prodDate: "2025-01-20", shipDate: "2025-05-05", transitDays: 12, contractValue: 14000000000, rigName: "Andaman Deep SPAR", status: "Rig Mobilization Transit", remarks: "SPAR Shriram Andaman mobilizing transit" },
  { id: "DWP-0008", batchNo: "DOL/NVM/2025/TL-0062", operator: "Dolphin Drilling Navi Mumbai", zone: "Mumbai Offshore Basin MH", category: "Tension Leg Platform 600m", description: "TLP for Mumbai deepwater Mesozoic target at 600m water depth 8000T hull 12 tendons 700m length with 65000bopd processing and HPHT completion rated 150C 10000psi", waterDepthM: 600, drillDepthM: 7000, wellCount: 10, platformT: 8000, dayRateCr: 0, origin: "Dolphin Navi Mumbai MH", project: "Mumbai Mesozoic TLP-2025", state: "Maharashtra", mode: "Diving Support Vessel DSV", prodDate: "2025-03-20", shipDate: "2025-07-08", transitDays: 3, contractValue: 11500000000, rigName: "Mumbai Deep TLP", status: "Well Spud Drilling Active", remarks: "TLP Dolphin Mumbai drilling spud active" },
  { id: "DWP-0009", batchNo: "ONG/MUM/2025/SS-0075", operator: "ONGC Mumbai High", zone: "Krishna Godavari Basin AP", category: "Semi-Sub Drilling Rig 500m", description: "Semi-sub Sagar Nidhi for KG basin exploration at 600m water depth 9000m drill depth 25000psi BOP with MPD RCD and advanced LWD rotary steerable", waterDepthM: 600, drillDepthM: 9000, wellCount: 3, platformT: 28000, dayRateCr: 7.5, origin: "ONGC Mumbai Base MH", project: "KG-DWN-98/2 Deep Expl", state: "Andhra Pradesh", mode: "Heavy Lift Vessel 8000T", prodDate: "2025-02-25", shipDate: "2025-05-18", transitDays: 4, contractValue: 5200000000, rigName: "Sagar Nidhi", status: "Casing Running Cementing", remarks: "Semi-sub ONGC KG casing cementing" },
  { id: "DWP-0010", batchNo: "OIL/JRH/2025/JU-0083", operator: "Oil India Jorhat", zone: "Rajasthan Thar Desert", category: "Jack-Up Drilling Rig 150m", description: "Jack-up rig Sagar Vijay for Rajasthan desert deep drilling at 100m depth 5500m drill 10000psi with underbalanced drilling and nitrogen kick detection", waterDepthM: 100, drillDepthM: 5500, wellCount: 10, platformT: 10000, dayRateCr: 2.5, origin: "OIL Jorhat Base AS", project: "Rajasthan Barmer Deep-2025", state: "Rajasthan", mode: "Platform Supply Vessel 3000T", prodDate: "2025-04-01", shipDate: "2025-06-15", transitDays: 6, contractValue: 1600000000, rigName: "Sagar Vijay", status: "Rig Move Demobilization", remarks: "Jack-up OIL Rajasthan demobilization" },
  { id: "DWP-0011", batchNo: "REL/JMN/2025/DS-0091", operator: "Reliance Industries Jamnagar", zone: "Krishna Godavari Basin AP", category: "Drillship DP3 3000m", description: "Drillship Dhirubhai Explorer-2 for KG-D6 phase-IV at 1500m water depth 10000m drill depth 25000psi with MPD automated choke and 4D seismic while drilling", waterDepthM: 1500, drillDepthM: 10000, wellCount: 3, platformT: 62000, dayRateCr: 14.0, origin: "Reliance Jamnagar Yard GJ", project: "KG-D6 Phase-IV Ultra-Deep", state: "Andhra Pradesh", mode: "Anchor Handling Tug AHT", prodDate: "2025-03-10", shipDate: "2025-06-25", transitDays: 3, contractValue: 9200000000, rigName: "Dhirubhai Explorer-2", status: "Well Spud Drilling Active", remarks: "Drillship Reliance KG ultra-deep spud" },
  { id: "DWP-0012", batchNo: "GAI/KOL/2025/FPS-0098", operator: "GAIL Deepwater Kolkata", zone: "Mumbai Offshore Basin MH", category: "FPSO Production 1500m", description: "FPSO Sagar Urja for Mumbai deepwater at 1000m water depth 250000bbl storage 150000bopd processing with 18 subsea trees and 350km flowline network", waterDepthM: 1000, drillDepthM: 0, wellCount: 18, platformT: 95000, dayRateCr: 0, origin: "L&T Kattupalli Shipyard TN", project: "Mumbai Deep FPSO-II", state: "Maharashtra", mode: "Heavy Lift Vessel 8000T", prodDate: "2024-10-15", shipDate: "2025-02-20", transitDays: 8, contractValue: 18000000000, rigName: "Sagar Urja FPSO", status: "Well Testing Flowback", remarks: "FPSO GAIL Mumbai testing flowback" },
  { id: "DWP-0013", batchNo: "ABN/CHN/2025/TA-0105", operator: "Aban Offshore Chennai", zone: "Kutch Offshore Saurashtra", category: "Tender-Assisted Rig 200m", description: "Tender-assisted rig Aban Legend for Kutch offshore development at 180m water depth 5500m drill depth 15000psi with mud logging and MWD package", waterDepthM: 180, drillDepthM: 5500, wellCount: 6, platformT: 16000, dayRateCr: 3.8, origin: "Aban Chennai Base TN", project: "Kutch Saurashtra Dev-2025", state: "Gujarat", mode: "Multipurpose Support Vessel", prodDate: "2025-05-01", shipDate: "2025-07-15", transitDays: 3, contractValue: 2200000000, rigName: "Aban Legend", status: "Logging Completion Phase", remarks: "Tender Assist Aban Kutch logging phase" },
  { id: "DWP-0014", batchNo: "DOL/NVM/2025/TL-0118", operator: "Dolphin Drilling Navi Mumbai", zone: "Andaman Nicobar Deepwater", category: "Tension Leg Platform 600m", description: "TLP-2 for Andaman deepwater Phase-II at 800m water depth 9000T hull 14 tendons 750m length with 45000bopd processing HPHT rated 200C 15000psi", waterDepthM: 800, drillDepthM: 6000, wellCount: 6, platformT: 9000, dayRateCr: 0, origin: "Dolphin Navi Mumbai MH", project: "Andaman TLP-II Deep", state: "Andaman", mode: "Helicopter Crew Change", prodDate: "2025-04-15", shipDate: "2025-07-28", transitDays: 14, contractValue: 13500000000, rigName: "Andaman TLP-2", status: "Rig Mobilization Transit", remarks: "TLP-2 Dolphin Andaman mobilizing" }
];

export default function DeepWaterDrillingPlatformLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalWells = records.reduce((s, r) => s + r.wellCount, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const activeRigs = records.filter(r => { const c = statusColor[r.status]; return c !== "green"; }).length;
  const completed = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total Wells", v: totalWells, s: "Across " + records.length + " platform records" },
    { l: "Active Operations", v: activeRigs, s: "Drilling to testing" },
    { l: "Demobilized", v: completed, s: "Campaign complete" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "rigName", label: "Rig", options: ["Sagar Kiran", "Sagar Bhushan", "Dhirubhai Deepwater-1", "Sagar Shakti FPSO", "Aban Pride", "Ratna CT Platform", "Andaman Deep SPAR", "Mumbai Deep TLP", "Sagar Nidhi", "Sagar Vijay", "Dhirubhai Explorer-2", "Sagar Urja FPSO", "Aban Legend", "Andaman TLP-2"].map(r => ({ value: r, count: records.filter(rec => rec.rigName === r).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q) && !r.rigName.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof DWPRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Depth (m)", "Drill (m)", "Wells", "Platform (T)", "Day Rate (\u20b9Cr)", "Origin", "Project", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Rig", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="dwp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Wells Drilled by Rig Type</h3><BarChart data={monthlyWells} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="semiSub" fill="#1e3a5f" radius={[4,4,0,0]} name="Semi-Sub" /><Bar dataKey="jackUp" fill="#1e40af" radius={[4,4,0,0]} name="Jack-Up" /><Bar dataKey="drillship" fill="#2563eb" radius={[4,4,0,0]} name="Drillship" /><Bar dataKey="fpso" fill="#60a5fa" radius={[4,4,0,0]} name="FPSO" /></BarChart></div>
        <div className="dwp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Platform Type Distribution (%)</h3><PieChart width={400} height={220}><Pie data={rigTypeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{rigTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="dwp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Drilling Depth Trend by Category (m)</h3><AreaChart data={depthTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="shallow" fill="#bfdbfe" stroke="#1e3a5f" strokeWidth={1} fillOpacity={0.6} name="Shallow (<200m)" /><Area type="monotone" dataKey="mid" fill="#93c5fd" stroke="#1e40af" strokeWidth={1} fillOpacity={0.6} name="Mid (200-800m)" /><Area type="monotone" dataKey="deep" fill="#60a5fa" stroke="#2563eb" strokeWidth={1} fillOpacity={0.6} name="Deep (800-2500m)" /><Area type="monotone" dataKey="ultra" fill="#3b82f6" stroke="#3b82f6" strokeWidth={1} fillOpacity={0.6} name="Ultra (>2500m)" /></AreaChart></div>
        <div className="dwp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Oil Production by Basin (BOPD)</h3><BarChart data={zoneProduction} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" /><YAxis /><Tooltip /><Legend /><Bar dataKey="bopd" fill="#1e40af" radius={[4,4,0,0]} name="BOPD" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="dwp-root p-6 space-y-6">
      <PageHeader title="Deep Water Drilling Platform Logistics" description="Indian deep water drilling platform logistics covering semi-submersible 500m jack-up 150m DP3 drillship 3000m tender-assisted 200m FPSO 1500m compliant tower 400m SPAR 1000m tension leg platform 600m MWD LWD MPD managed pressure drilling ONGC Oil India Reliance Aban Essar Shriram Dolphin across KG Mumbai Assam Cambay Rajasthan Cauvery Kutch Andaman deepwater" />
      <div className="dwp-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`dwp-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#1e3a5f] text-white" : "text-gray-600 hover:bg-blue-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Deep Water Drilling" }]} />
      {tab === 0 && (
        <div className="dwp-dash space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <div key={i} className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">{k.l}</p><p className="text-2xl font-bold text-[#1e3a5f]">{typeof k.v === 'number' ? k.v.toLocaleString('en-IN') : k.v}</p><p className="text-xs text-gray-400">{k.s}</p></div>)}
          </div>
          {renderCharts()}
          <div className="grid grid-cols-2 gap-6">
            {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-4"><h4 className="text-sm font-semibold mb-2 text-[#1e3a5f]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="dwp-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="dwp-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{r.waterDepthM}</td><td className="px-3 py-2 text-right">{r.drillDepthM.toLocaleString("en-IN")}</td><td className="px-3 py-2 text-right">{r.wellCount}</td><td className="px-3 py-2 text-right">{r.platformT.toLocaleString("en-IN")}</td><td className="px-3 py-2 text-right">{r.dayRateCr > 0 ? r.dayRateCr.toFixed(1) : "N/A"}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.project}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.rigName}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="dwp-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="dwp-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#1e3a5f]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
