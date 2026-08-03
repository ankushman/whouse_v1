"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#14532d", "#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"];
const OPERATORS = ["NPCIL Mumbai", "L&T Construction Mumbai", "BHEL Bhopal", "GE Hitachi Nuclear Pune", "Toshiba JSW Power Chennai", "Rosatom State Corp Moscow", "Westinghouse Electric USA", "CNNC Beijing China"];
const CATEGORIES = ["PHWR 700MWe Indigenous", "VVER 1000MW Russian PWR", "EPR 1600MW French PWR", "AP1000 1150MW US PWR", "BWR 90MW Tarapur", "AHWR 300MW Advanced Heavy", "SMR 300MW Small Modular", "HTGR 250MW High Temp Gas"];
const SHIPMENT_STATUSES = ["Reactor Vessel Placement", "Steam Generator Installation", "Turbine Generator Erection", "Containment Dome Welding", "Fuel Loading Commissioning", "Grid Synchronization Active"];
const ZONES = ["Kudankulam Tamil Nadu", "Jaitapur Maharashtra", "Kovvada Andhra Pradesh", "Mithi Virdi Gujarat", "Tarapur Maharashtra", "Chutka Madhya Pradesh", "Gorakhpur Haryana", "Banswara Rajasthan"];
const MODES = ["Heavy Haul Modular Trailer", "Self-Propelled Modular Transport", "River Barge Coastal Route", "Specialized Rail Rake 40T", "Port Crane 600T Lift", "Multi-Axle Trailer 80T"];
const TABS = ["Dashboard", "Reactor Registry", "Nuclear Analytics", "Insights"];

const statusColor: Record<string, string> = { "Reactor Vessel Placement": "orange", "Steam Generator Installation": "orange", "Turbine Generator Erection": "blue", "Containment Dome Welding": "orange", "Fuel Loading Commissioning": "blue", "Grid Synchronization Active": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyProgress = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], phwr: +(35 + Math.sin(i * 0.5) * 10).toFixed(0), vver: +(25 + Math.cos(i * 0.6) * 8).toFixed(0), smr: +(10 + Math.sin(i * 0.4) * 5).toFixed(0), turbine: +(20 + Math.cos(i * 0.7) * 6).toFixed(0) }));
const reactorDist = [{ n: "PHWR 700", v: 38 }, { n: "VVER 1000", v: 22 }, { n: "EPR 1600", v: 12 }, { n: "AP1000", v: 10 }, { n: "BWR 90", v: 8 }, { n: "SMR 300", v: 6 }, { n: "AHWR", v: 4 }];
const capacityTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], existing: +(6780 + Math.sin(i * 0.3) * 50).toFixed(0), underCon: +(4200 + Math.cos(i * 0.4) * 200).toFixed(0), planned: +(8000 + Math.sin(i * 0.5) * 500).toFixed(0) }));
const zoneCapacity = [
  { zone: "TN", mw: 6000 },
  { zone: "MH", mw: 9900 },
  { zone: "AP", mw: 6000 },
  { zone: "GJ", mw: 6000 },
  { zone: "MP", mw: 1400 },
  { zone: "HR", mw: 2800 },
  { zone: "RJ", mw: 2800 },
  { zone: "UP", mw: 2000 }
];

const INSIGHTS = [
  { t: "India\u2019s Nuclear Power Program: 10,000MW by 2032 Under NPCIL", c: "India operates 24 nuclear power reactors with a total installed capacity of 7,480MW, generating approximately 47 billion units of electricity annually (3.2% of India\u2019s total power generation). The Nuclear Power Corporation of India Limited (NPCIL) operates 22 reactors with 6,780MWe capacity, while NPCIL\u2019s joint venture with NTPC (ANUPP) operates 2 reactors at 700MWe each. India\u2019s three-stage nuclear power program conceived by Dr. Homi Bhabha aims to utilize the country\u2019s vast thorium reserves (25% of global thorium deposits) to eventually achieve energy independence. Stage 1 uses natural uranium-fueled Pressurized Heavy Water Reactors (PHWR) to produce plutonium, Stage 2 uses Fast Breeder Reactors (FBR) to breed U-233 from thorium, and Stage 3 deploys Advanced Heavy Water Reactors (AHWR) using thorium-uranium fuel cycle. India has set a target of 22,480MWe nuclear capacity by 2031-32, requiring construction of 10 PHWR-700 units (7,000MWe), 2 VVER-1200 units (2,400MWe), and 6 EPR units (9,600MWe) at identified sites across Tamil Nadu, Maharashtra, Gujarat, Andhra Pradesh, Madhya Pradesh, Haryana, and Rajasthan." },
  { t: "PHWR 700MWe: India\u2019s Indigenous Pressurized Heavy Water Reactor Program", c: "The PHWR-700MWe is India\u2019s flagship indigenous nuclear reactor design developed by NPCIL\u2019s Nuclear Power Engineering Division (NPED) with support from Bhabha Atomic Research Centre (BARC) and indigenously manufactured by a consortium of L&T, BHEL, and Walchandnagar Industries. Each PHWR-700 unit costs approximately \u20b912,000 crore ($1.5 billion) with a construction timeline of 60-66 months from first pour to criticality. The reactor uses natural uranium dioxide fuel bundles (37 elements, 500mm active length) moderated and cooled by heavy water (D2O) produced at India\u2019s Heavy Water Board plants in Kota, Manuguru, Hazira, Baroda, Talcher, and Thoothukudi. PHWR-700\u2019s key components include a 6.3m diameter calandria vessel (SA516 Gr.70 steel, 140mm thickness), 380 horizontal pressure tubes (Zr-2.5%Nb, 124mm OD), 4 steam generators (6.5m diameter, 20m height, Inconel-600 tubes), and 4 primary coolant pumps (7.5MW each). India has achieved 90%+ domestic content for PHWR-700 through the \u2018Make in India\u2019 nuclear program, with critical forgings (reactor head, steam generator tubesheets) manufactured at L&T Hazira and BHEL Haridwar using 200T and 300T forging presses respectively." },
  { t: "VVER-1200 and EPR: Imported Reactor Technology for Jaitapur and Kudankulam", c: "India is deploying imported Generation III+ reactor technology to rapidly scale nuclear capacity, with Russian VVER-1200 (AES-2006) at Kudankulam (Tamil Nadu) and French EPR (European Pressurized Reactor) at Jaitapur (Maharashtra). Kudankulam Nuclear Power Plant (KKNPP) currently operates 2 VVER-1000 units (2x1000MWe) with Units 3 and 4 (2x1000MWe VVER) under construction and Units 5-6 (2x1200MWe VVER-1200) in advanced planning stage, totaling 6,400MWe at full buildout. The Jaitapur Nuclear Power Project (JNPP) is India\u2019s largest nuclear power plant under development as a joint venture between NPCIL and EDF (Electricite de France) for 6 EPR units (6x1650MWe = 9,900MWe) with estimated investment of \u20b91,00,000 crore ($12 billion). EPR technology features double containment (1.3m thick inner + 1.3m outer concrete walls), 4-train safety systems, core catcher for severe accident mitigation, and 60-year design life. Toshiba JSW Power Systems Chennai is supplying the turbine island for JNPP Units 1-2 under license from GE Hitachi Nuclear Energy, with Arabelle steam turbines rated at 1,650MWe per unit, the world\u2019s largest nuclear steam turbines." },
  { t: "Small Modular Reactors (SMR) and AHWR: India\u2019s Next-Generation Nuclear Technology", c: "India is developing Small Modular Reactors (SMRs) in the 150-300MWe range with BARC\u2019s 300MWe Pressurized Light Water Reactor (PLWR-SM) design and NPCIL\u2019s 220MWe PHWR compact variant. The 300MWe SMR design features factory-fabricated modular components transportable by road/rail, enabling 36-48 month construction timelines compared to 60-66 months for conventional reactors, with a target overnight cost of \u20b95.5 crore per MW (\u20b91,650 crore per unit). India\u2019s Advanced Heavy Water Reactor (AHWR-300) is a 300MWe vertical pressure tube type reactor using thorium-uranium-233/plutonium mixed oxide (MOX) fuel with passive safety features including gravity-driven emergency core cooling, natural circulation decay heat removal, and passive containment pressure suppression. BARC has successfully operated the Kamini 30kW experimental reactor using U-233 fuel, demonstrating the thorium fuel cycle. NPCIL has identified 5 potential SMR deployment sites in Gujarat, Rajasthan, Madhya Pradesh, and Karnataka for 2028-2035 commissioning, targeting India\u2019s remote and island territories (Andaman & Nicobar, Lakshadweep) where SMRs offer a practical alternative to diesel generators and submarine cable connections." }
];

interface NPCRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; reactorMW: number; unitNumber: number; constructionPct: number; fuelType: string; containmentType: string; origin: string; project: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; turbineMake: string; status: string; remarks: string; }

const records: NPCRecord[] = [
  { id: "NPC-0001", batchNo: "NPC/MUM/2025/PHW-0012", operator: "NPCIL Mumbai", zone: "Kudankulam Tamil Nadu", category: "PHWR 700MWe Indigenous", description: "PHWR-700MWe indigenous reactor Unit-5 at Kudankulam with natural uranium D2O moderated horizontal pressure tubes and 4 steam generators", reactorMW: 700, unitNumber: 5, constructionPct: 45, fuelType: "Natural UO2", containmentType: "Double Containment", origin: "L&T Hazira Shipyard GJ", project: "Kudankulam PHWR-700 Unit-5", state: "Tamil Nadu", mode: "Heavy Haul Modular Trailer", prodDate: "2025-01-10", shipDate: "2025-04-18", transitDays: 6, contractValue: 12000000000, turbineMake: "BHEL Hyderabad", status: "Containment Dome Welding", remarks: "PHWR-700 NPCIL Kudankulam dome welding" },
  { id: "NPC-0002", batchNo: "ROS/MOW/2025/VVR-0018", operator: "Rosatom State Corp Moscow", zone: "Kudankulam Tamil Nadu", category: "VVER 1000MW Russian PWR", description: "VVER-1000 PWR Unit-4 at Kudankulam with enriched UO2 fuel hexagonal FA assemblies and horizontal SG with 11,000 tubes Incoloy-800", reactorMW: 1000, unitNumber: 4, constructionPct: 72, fuelType: "Enriched UO2 4.4%", containmentType: "Double Containment VVER", origin: "Atomenergomash St Petersburg RU", project: "Kudankulam VVER Unit-4", state: "Tamil Nadu", mode: "River Barge Coastal Route", prodDate: "2024-11-05", shipDate: "2025-03-20", transitDays: 22, contractValue: 18000000000, turbineMake: "Power Machines LMZ RU", status: "Turbine Generator Erection", remarks: "VVER-1000 Rosatom Kudankulam TG erection" },
  { id: "NPC-0003", batchNo: "EDF/PAR/2025/EPR-0025", operator: "Westinghouse Electric USA", zone: "Jaitapur Maharashtra", category: "EPR 1600MW French PWR", description: "EPR-1600MW PWR Unit-1 at Jaitapur with enriched UO2 fuel AFA-3G assemblies triple-train safety and core catcher severe accident system", reactorMW: 1650, unitNumber: 1, constructionPct: 18, fuelType: "Enriched UO2 5.0%", containmentType: "Double Containment EPR", origin: "Framatome Le Creusot FR", project: "Jaitapur EPR Unit-1", state: "Maharashtra", mode: "Port Crane 600T Lift", prodDate: "2025-02-15", shipDate: "2025-06-10", transitDays: 18, contractValue: 35000000000, turbineMake: "GE Hitachi Arabelle FR", status: "Reactor Vessel Placement", remarks: "EPR-1650 Jaitapur RV placement active" },
  { id: "NPC-0004", batchNo: "GEH/PUN/2025/AP1-0032", operator: "GE Hitachi Nuclear Pune", zone: "Kovvada Andhra Pradesh", category: "AP1000 1150MW US PWR", description: "AP1000 1150MW PWR at Kovvada with passive safety systems gravity-driven core cooling canned motor reactor coolant pumps and modular construction", reactorMW: 1150, unitNumber: 1, constructionPct: 8, fuelType: "Enriched UO2 4.95%", containmentType: "Steel Containment Vessel", origin: "GE Hitachi Wilmington USA", project: "Kovvada AP1000 Unit-1", state: "Andhra Pradesh", mode: "Self-Propelled Modular Transport", prodDate: "2025-03-01", shipDate: "2025-07-15", transitDays: 30, contractValue: 22000000000, turbineMake: "GE Hitachi Nuclear USA", status: "Reactor Vessel Placement", remarks: "AP1000 GE Hitachi Kovvada RV placement" },
  { id: "NPC-0005", batchNo: "NPC/MUM/2025/BWR-0041", operator: "NPCIL Mumbai", zone: "Tarapur Maharashtra", category: "BWR 90MW Tarapur", description: "BWR-90MW Unit-1 and Unit-2 replacement steam generators at Tarapur with 196 BWR fuel assemblies and Mark-1 containment upgrade", reactorMW: 90, unitNumber: 1, constructionPct: 85, fuelType: "Enriched UO2 3.2%", containmentType: "Mark-1 BWR", origin: "GE Hitachi Pune Plant MH", project: "Tarapur BWR SG Replacement", state: "Maharashtra", mode: "Specialized Rail Rake 40T", prodDate: "2025-01-25", shipDate: "2025-04-05", transitDays: 1, contractValue: 850000000, turbineMake: "GE Hitachi India", status: "Fuel Loading Commissioning", remarks: "BWR-90 NPCIL Tarapur fuel loading" },
  { id: "NPC-0006", batchNo: "BAR/MUM/2025/AHW-0048", operator: "NPCIL Mumbai", zone: "Chutka Madhya Pradesh", category: "AHWR 300MW Advanced Heavy", description: "AHWR-300MW advanced heavy water reactor at Chutka using thorium-U233 MOX fuel passive gravity cooling and natural circulation decay heat removal", reactorMW: 300, unitNumber: 1, constructionPct: 5, fuelType: "ThO2-U233 MOX", containmentType: "Double Containment Passive", origin: "BARC Trombay Mumbai MH", project: "Chutka AHWR-300 Demo", state: "Madhya Pradesh", mode: "Heavy Haul Modular Trailer", prodDate: "2025-04-10", shipDate: "2025-08-20", transitDays: 4, contractValue: 4500000000, turbineMake: "BHEL Bhopal", status: "Reactor Vessel Placement", remarks: "AHWR-300 NPCIL Chutka RV placement" },
  { id: "NPC-0007", batchNo: "ROS/MOW/2025/VVR-0055", operator: "Rosatom State Corp Moscow", zone: "Kudankulam Tamil Nadu", category: "VVER 1000MW Russian PWR", description: "VVER-1200 AES-2006 Unit-5 at Kudankulam with 163 fuel assemblies upgraded passive safety core catcher and 60-year design life", reactorMW: 1200, unitNumber: 5, constructionPct: 12, fuelType: "Enriched UO2 4.8%", containmentType: "VVER-1200 Double", origin: "OKB Gidropress Podolsk RU", project: "Kudankulam VVER-1200 Unit-5", state: "Tamil Nadu", mode: "Port Crane 600T Lift", prodDate: "2025-02-20", shipDate: "2025-06-25", transitDays: 20, contractValue: 24000000000, turbineMake: "Power Machines LMZ RU", status: "Reactor Vessel Placement", remarks: "VVER-1200 Rosatom Kudankulam RV placement" },
  { id: "NPC-0008", batchNo: "TJS/CHN/2025/EPR-0062", operator: "Toshiba JSW Power Chennai", zone: "Jaitapur Maharashtra", category: "EPR 1600MW French PWR", description: "EPR-1600MW Unit-2 turbine island at Jaitapur with Arabelle 1650MWe steam turbine 6 LP + 1 HP modules and moisture separator reheater", reactorMW: 1650, unitNumber: 2, constructionPct: 10, fuelType: "Enriched UO2 5.0%", containmentType: "Double Containment EPR", origin: "Toshiba JSW Chennai Plant TN", project: "Jaitapur EPR Unit-2 TG Island", state: "Maharashtra", mode: "Multi-Axle Trailer 80T", prodDate: "2025-03-15", shipDate: "2025-07-10", transitDays: 3, contractValue: 15000000000, turbineMake: "Toshiba JSW Chennai", status: "Steam Generator Installation", remarks: "EPR Jaitapur U2 SG installation" },
  { id: "NPC-0009", batchNo: "NPC/MUM/2025/PHW-0075", operator: "NPCIL Mumbai", zone: "Gorakhpur Haryana", category: "PHWR 700MWe Indigenous", description: "PHWR-700MWe Unit-1 at Gorakhpur with 380 horizontal pressure tubes Zr-2.5Nb 4 SG Inconel-600 and 90% indigenous content from L&T BHEL", reactorMW: 700, unitNumber: 1, constructionPct: 55, fuelType: "Natural UO2", containmentType: "Double Containment", origin: "L&T Hazira Shipyard GJ", project: "Gorakhpur PHWR-700 Unit-1", state: "Haryana", mode: "Heavy Haul Modular Trailer", prodDate: "2024-12-01", shipDate: "2025-03-10", transitDays: 5, contractValue: 12000000000, turbineMake: "BHEL Hyderabad", status: "Turbine Generator Erection", remarks: "PHWR-700 NPCIL Gorakhpur TG erection" },
  { id: "NPC-0010", batchNo: "BHE/BPL/2025/PHW-0083", operator: "BHEL Bhopal", zone: "Mithi Virdi Gujarat", category: "PHWR 700MWe Indigenous", description: "PHWR-700MWe Unit-1 steam generators and calandria for Mithi Virdi with 4 SG units 6.5m diameter 20m height manufactured at BHEL Bhopal forging shop", reactorMW: 700, unitNumber: 1, constructionPct: 22, fuelType: "Natural UO2", containmentType: "Double Containment", origin: "BHEL Bhopal Plant MP", project: "Mithi Virdi PHWR-700 Unit-1", state: "Gujarat", mode: "Specialized Rail Rake 40T", prodDate: "2025-01-30", shipDate: "2025-05-15", transitDays: 4, contractValue: 8500000000, turbineMake: "BHEL Hyderabad", status: "Containment Dome Welding", remarks: "PHWR-700 BHEL Mithi Virdi dome welding" },
  { id: "NPC-0011", batchNo: "LNT/MUM/2025/SMR-0091", operator: "L&T Construction Mumbai", zone: "Banswara Rajasthan", category: "SMR 300MW Small Modular", description: "SMR-300MWe modular reactor Unit-1 at Banswara with factory-fabricated modules road-transportable passive safety and 36-month construction target", reactorMW: 300, unitNumber: 1, constructionPct: 3, fuelType: "Enriched UO2 4.2%", containmentType: "Single Containment Modular", origin: "L&T Hazira Modular Yard GJ", project: "Banswara SMR-300 Unit-1", state: "Rajasthan", mode: "Self-Propelled Modular Transport", prodDate: "2025-05-01", shipDate: "2025-08-25", transitDays: 3, contractValue: 5500000000, turbineMake: "L&T Modular MH", status: "Reactor Vessel Placement", remarks: "SMR-300 L&T Banswara RV placement" },
  { id: "NPC-0012", batchNo: "NPC/MUM/2025/PHW-0098", operator: "NPCIL Mumbai", zone: "Gorakhpur Haryana", category: "PHWR 700MWe Indigenous", description: "PHWR-700MWe Unit-2 at Gorakhpur with reactor coolant pumps 7.5MW each and D2O moderator system from Heavy Water Board Kota plant", reactorMW: 700, unitNumber: 2, constructionPct: 38, fuelType: "Natural UO2", containmentType: "Double Containment", origin: "L&T Hazira Shipyard GJ", project: "Gorakhpur PHWR-700 Unit-2", state: "Haryana", mode: "Heavy Haul Modular Trailer", prodDate: "2025-02-10", shipDate: "2025-05-28", transitDays: 5, contractValue: 12000000000, turbineMake: "BHEL Hyderabad", status: "Steam Generator Installation", remarks: "PHWR-700 NPCIL Gorakhpur U2 SG install" },
  { id: "NPC-0013", batchNo: "CNNC/BJG/2025/HTG-0105", operator: "CNNC Beijing China", zone: "Kovvada Andhra Pradesh", category: "HTGR 250MW High Temp Gas", description: "HTGR-250MW high temperature gas-cooled reactor at Kovvada with pebble-bed TRISO fuel helium coolant 750C outlet and 48% thermal efficiency", reactorMW: 250, unitNumber: 1, constructionPct: 2, fuelType: "TRISO Pebble UO2", containmentType: "Silica Concrete Containment", origin: "CNNC HTR-PM Shidao CN", project: "Kovvada HTGR-250 Demo", state: "Andhra Pradesh", mode: "Port Crane 600T Lift", prodDate: "2025-04-20", shipDate: "2025-08-10", transitDays: 25, contractValue: 6000000000, turbineMake: "CNNC HTR Design CN", status: "Reactor Vessel Placement", remarks: "HTGR-250 CNNC Kovvada RV placement" },
  { id: "NPC-0014", batchNo: "NPC/MUM/2025/PHW-0118", operator: "NPCIL Mumbai", zone: "Chutka Madhya Pradesh", category: "PHWR 700MWe Indigenous", description: "PHWR-700MWe Unit-1 at Chutka with calandria vessel 6.3m diameter SA516 Gr.70 140mm thick and 380 Zr-2.5Nb horizontal pressure tubes", reactorMW: 700, unitNumber: 1, constructionPct: 30, fuelType: "Natural UO2", containmentType: "Double Containment", origin: "Walchandnagar Industries MH", project: "Chutka PHWR-700 Unit-1", state: "Madhya Pradesh", mode: "Multi-Axle Trailer 80T", prodDate: "2025-03-25", shipDate: "2025-07-08", transitDays: 3, contractValue: 12000000000, turbineMake: "BHEL Bhopal", status: "Containment Dome Welding", remarks: "PHWR-700 NPCIL Chutka dome welding" }
];

export default function NuclearPowerPlantConstructionLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalMW = records.reduce((s, r) => s + r.reactorMW, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => r.constructionPct < 100 && r.status !== "Grid Synchronization Active").length;
  const commissioned = records.filter(r => r.status === "Grid Synchronization Active").length;

  const kpis = [
    { l: "Total Reactor MW", v: totalMW.toLocaleString("en-IN"), s: "Across " + records.length + " reactor records" },
    { l: "Under Construction", v: underConstruction, s: "Active construction" },
    { l: "Commissioned", v: commissioned, s: "Grid synchronized" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "turbineMake", label: "Turbine", options: ["BHEL Hyderabad", "Power Machines LMZ RU", "GE Hitachi Arabelle FR", "GE Hitachi Nuclear USA", "GE Hitachi India", "BHEL Bhopal", "Toshiba JSW Chennai", "L&T Modular MH", "CNNC HTR Design CN"].map(t => ({ value: t, count: records.filter(r => r.turbineMake === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q) && !r.fuelType.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof NPCRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "MW", "Unit", "Build %", "Fuel", "Containment", "Origin", "Project", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Turbine", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="npc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Construction Progress by Type (%)</h3><BarChart data={monthlyProgress} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="phwr" fill="#14532d" radius={[4,4,0,0]} name="PHWR" /><Bar dataKey="vver" fill="#166534" radius={[4,4,0,0]} name="VVER" /><Bar dataKey="smr" fill="#16a34a" radius={[4,4,0,0]} name="SMR" /><Bar dataKey="turbine" fill="#22c55e" radius={[4,4,0,0]} name="Turbine" /></BarChart></div>
        <div className="npc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Reactor Type Distribution (%)</h3><PieChart width={400} height={220}><Pie data={reactorDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{reactorDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="npc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Nuclear Capacity Trajectory (MW)</h3><AreaChart data={capacityTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="existing" fill="#bbf7d0" stroke="#14532d" strokeWidth={1} fillOpacity={0.6} name="Existing" /><Area type="monotone" dataKey="underCon" fill="#86efac" stroke="#166534" strokeWidth={1} fillOpacity={0.6} name="Under Construction" /><Area type="monotone" dataKey="planned" fill="#4ade80" stroke="#16a34a" strokeWidth={1} fillOpacity={0.6} name="Planned" /></AreaChart></div>
        <div className="npc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Nuclear Capacity by Zone (MW)</h3><BarChart data={zoneCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" /><YAxis /><Tooltip /><Legend /><Bar dataKey="mw" fill="#166534" radius={[4,4,0,0]} name="Installed MW" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="npc-root p-6 space-y-6">
      <PageHeader title="Nuclear Power Plant Construction Logistics" description="Indian nuclear power plant construction logistics covering PHWR-700MWe indigenous D2O natural uranium VVER-1000/1200 Russian PWR EPR-1600 French AP1000-1150MW US BWR-90MW Tarapur AHWR-300MW thorium SMR-300MW modular HTGR-250MW gas-cooled NPCIL L&T BHEL GE Hitachi Toshiba JSW Rosatom Westinghouse CNNC Kudankulam Jaitapur Kovvada Mithi Virdi Tarapur Chutka Gorakhpur Banswara 22480MW 2032 target three-stage thorium cycle" />
      <div className="npc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`npc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#14532d] text-white" : "text-gray-600 hover:bg-green-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Nuclear Power" }]} />
      {tab === 0 && (
        <div className="npc-dash space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <div key={i} className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">{k.l}</p><p className="text-2xl font-bold text-[#14532d]">{k.v}</p><p className="text-xs text-gray-400">{k.s}</p></div>)}
          </div>
          {renderCharts()}
          <div className="grid grid-cols-2 gap-6">
            {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-4"><h4 className="text-sm font-semibold mb-2 text-[#14532d]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="npc-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="npc-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{r.reactorMW}</td><td className="px-3 py-2 text-right">{r.unitNumber}</td><td className="px-3 py-2 text-right">{r.constructionPct}%</td><td className="px-3 py-2">{r.fuelType}</td><td className="px-3 py-2">{r.containmentType}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.project}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.turbineMake}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="npc-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="npc-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#14532d]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
