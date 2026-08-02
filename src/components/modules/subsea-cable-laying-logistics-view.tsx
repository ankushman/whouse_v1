"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";
import { Waves } from "lucide-react";

const COLORS = ["#0c2d48", "#14506b", "#1c7393", "#2496bb", "#082035", "#0a3a5a", "#105070", "#3bb8e0"];
const OPERATORS = ["Tata Communications Mumbai", "Reliance Jio Subsea Network", "BSNL National Subsea Cable", "Airtel Bharti Undersea Cable", "STTelemedia Chennai Bay", "Sea-Me-We 6 Consortium India", "I2C Subsea Mumbai Gateway", "GTPL Saurashtra Cable Landing"];
const CATEGORIES = ["Subsea Fiber Optic Cable 96-Core", "Repeater Amplifier Housing Unit", "Branching Unit BU SPU", "Cable Landing Station CLS Equipment", "Power Feed Equipment PFE 15kV DC", "Submarine Plow Burial Tool SPT", "ROV Submarine Inspection System", "Marine Survey Sonar Equipment"];
const STATUSES = ["Factory Manufactured Cable Plant", "Loaded Cable Ship Departed Port", "Marine Route Survey Completed", "Subsea Cable Laying Buried 1500m", "Landing Station Splice Tested", "System End-to-End Ready Live"];
const ZONES = ["West Coast Mumbai Goa Kochi", "East Coast Chennai Visakhapatnam", "South India Tuticorin Kochi", "Andaman Nicobar Island", "Lakshadweep Minicoy Atoll", "Gujarat Veraval Dwarka Port", "Sri Lanka Colombo Gateway"];
const MODES = ["Cable Ship Turntable 6000T", "Barge Platform 2000T", "Supply Vessel 500T", "ROV Support Vessel", "Heavy Lift Ship 4000T", "Helicopter Airlift Sling"];
const TABS = ["Dashboard", "Cable Registry", "Laying Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", cyan: "bg-cyan-100 text-cyan-700" };
const statusColor: Record<string, string> = { "Factory Manufactured Cable Plant": "green", "Loaded Cable Ship Departed Port": "blue", "Marine Route Survey Completed": "amber", "Subsea Cable Laying Buried 1500m": "red", "Landing Station Splice Tested": "amber", "System End-to-End Ready Live": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

function formatINR(n: number) {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(2)}L`;
  return `\u20b9${(n / 1000).toFixed(1)}K`;
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyLay = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], westCoast: ri(120, 380, 240 + Math.sin(i * 0.5) * 80), eastCoast: ri(80, 280, 170 + Math.cos(i * 0.6) * 60), island: ri(30, 120, 65 + Math.sin(i * 0.7) * 25) }));
const cableDist = [{ n: "96-Core Deep Water", v: 32 }, { n: "48-Core Shallow", v: 24 }, { n: "24-Core Island Link", v: 18 }, { n: "8-Core Branching", v: 12 }, { n: "Repeater Housing", v: 8 }, { n: "BU SPU Module", v: 6 }];
const depthProfile = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], target: 85, actual: +(ri(72, 95, 83 + Math.sin(i * 0.4) * 6)).toFixed(1) }));
const operatorPerf = OPERATORS.map(o => ({ n: o.split(" ").slice(0, 2).join(" "), v: +ri(60, 98, 82 + Math.random() * 10).toFixed(0) }));

interface SubseaRecord { id: string; cableNo: string; operator: string; zone: string; category: string; description: string; cableLength: number; weight: number; manufacturer: string; origin: string; landingStation: string; segment: string; mode: string; loadDate: string; layDate: string; transitDays: number; contractValue: number; depth: number; status: string; remarks: string; }

const records: SubseaRecord[] = [
  { id: "SCL-0001", cableNo: "SMW5-WC-2024-001", operator: "Tata Communications Mumbai", zone: "West Coast Mumbai Goa Kochi", category: "Subsea Fiber Optic Cable 96-Core", description: "SMW5 Main trunk Mumbai to Kochi deep water segment", cableLength: 850, weight: 42500, manufacturer: "SubCom", origin: "Mumbai Digha CLS", landingStation: "Mumbai Digha Landing Station", segment: "SMW5 Segment 3A West", mode: "Cable Ship Turntable 6000T", loadDate: "2025-01-08", layDate: "2025-01-22", transitDays: 14, contractValue: 950000000, depth: 3500, status: "Subsea Cable Laying Buried 1500m", remarks: "Deep water burial at 3500m using SPT plow" },
  { id: "SCL-0002", cableNo: "SMW6-EC-2024-012", operator: "Reliance Jio Subsea Network", zone: "East Coast Chennai Visakhapatnam", category: "Subsea Fiber Optic Cable 96-Core", description: "SMW6 Chennai to Visakhapatnam trunk cable", cableLength: 620, weight: 31000, manufacturer: "NEC", origin: "Chennai CLS Ennore", landingStation: "Chennai Ennore Landing Station", segment: "SMW6 Segment 5B East", mode: "Cable Ship Turntable 6000T", loadDate: "2025-01-12", layDate: "2025-01-24", transitDays: 12, contractValue: 780000000, depth: 2800, status: "Landing Station Splice Tested", remarks: "Splice testing completed at Chennai CLS" },
  { id: "SCL-0003", cableNo: "IMEW-SI-2024-008", operator: "BSNL National Subsea Cable", zone: "South India Tuticorin Kochi", category: "Subsea Fiber Optic Cable 96-Core", description: "I-ME-WE Tuticorin to Kochi branch cable deployment", cableLength: 340, weight: 17000, manufacturer: "Prysmian", origin: "Tuticorin CLS", landingStation: "Tuticorin Cable Landing Station", segment: "I-ME-WE Branch IN-4", mode: "Barge Platform 2000T", loadDate: "2025-01-05", layDate: "2025-01-15", transitDays: 10, contractValue: 420000000, depth: 1200, status: "Marine Route Survey Completed", remarks: "Bathymetric survey done for 340km route" },
  { id: "SCL-0004", cableNo: "BBG-AN-2024-003", operator: "Airtel Bharti Undersea Cable", zone: "Andaman Nicobar Island", category: "Subsea Fiber Optic Cable 96-Core", description: "Bay of Bengal Gateway Port Blair branch segment", cableLength: 1250, weight: 62500, manufacturer: "HMN Tech", origin: "Chennai CLS Ennore", landingStation: "Port Blair Havelock CLS", segment: "BBG Branch AN-2", mode: "Cable Ship Turntable 6000T", loadDate: "2025-01-18", layDate: "", transitDays: 0, contractValue: 870000000, depth: 4000, status: "Loaded Cable Ship Departed Port", remarks: "CS Reliance departed Chennai for Port Blair" },
  { id: "SCL-0005", cableNo: "RPL-LK-2024-015", operator: "STTelemedia Chennai Bay", zone: "Lakshadweep Minicoy Atoll", category: "Subsea Fiber Optic Cable 96-Core", description: "Chennai to Lakshadweep Minicoy submarine link cable", cableLength: 480, weight: 24000, manufacturer: "SubCom", origin: "Chennai CLS Ennore", landingStation: "Minicoy Atoll CLS", segment: "Lakshadweep Link LK-1", mode: "Cable Ship Turntable 6000T", loadDate: "2025-01-10", layDate: "2025-01-25", transitDays: 15, contractValue: 620000000, depth: 2200, status: "Subsea Cable Laying Buried 1500m", remarks: "Cable buried at 2200m depth Minicoy approach" },
  { id: "SCL-0006", cableNo: "REP-SMW5-2024-009", operator: "Sea-Me-We 6 Consortium India", zone: "West Coast Mumbai Goa Kochi", category: "Repeater Amplifier Housing Unit", description: "SMW6 repeater housing unit for deep water amplification", cableLength: 0, weight: 8500, manufacturer: "NEC", origin: "Mumbai Digha CLS", landingStation: "Mumbai Digha Landing Station", segment: "SMW6 Repeater R-42", mode: "Heavy Lift Ship 4000T", loadDate: "2025-01-14", layDate: "2025-01-20", transitDays: 6, contractValue: 180000000, depth: 3500, status: "System End-to-End Ready Live", remarks: "Repeater R-42 commissioned and live on SMW6" },
  { id: "SCL-0007", cableNo: "BU-SMW5-2024-011", operator: "Tata Communications Mumbai", zone: "Gujarat Veraval Dwarka Port", category: "Branching Unit BU SPU", description: "SMW5 branching unit for Gujarat spur cable", cableLength: 0, weight: 12500, manufacturer: "SubCom", origin: "Mumbai Digha CLS", landingStation: "Veraval Cable Landing Station", segment: "SMW5 BU-GJ-03", mode: "Heavy Lift Ship 4000T", loadDate: "2025-01-20", layDate: "2025-01-28", transitDays: 8, contractValue: 240000000, depth: 800, status: "Landing Station Splice Tested", remarks: "BU spliced at Veraval CLS awaiting integration" },
  { id: "SCL-0008", cableNo: "PFE-SMW6-2024-007", operator: "I2C Subsea Mumbai Gateway", zone: "West Coast Mumbai Goa Kochi", category: "Power Feed Equipment PFE 15kV DC", description: "SMW6 CLS power feed equipment 15kV DC system", cableLength: 0, weight: 15000, manufacturer: "Nokia", origin: "Mumbai Digha CLS", landingStation: "Mumbai Digha Landing Station", segment: "SMW6 PFE-Digha-01", mode: "Supply Vessel 500T", loadDate: "2025-01-06", layDate: "2025-01-09", transitDays: 3, contractValue: 95000000, depth: 0, status: "Factory Manufactured Cable Plant", remarks: "PFE 15kV DC unit manufactured by Nokia Greece" },
  { id: "SCL-0009", cableNo: "ROV-SMW5-2024-014", operator: "GTPL Saurashtra Cable Landing", zone: "Gujarat Veraval Dwarka Port", category: "ROV Submarine Inspection System", description: "ROV inspection system for Gujarat cable landing zone", cableLength: 0, weight: 5200, manufacturer: "Prysmian", origin: "Veraval CLS", landingStation: "Dwarka Port CLS", segment: "GTPL ROV Inspection GJ-01", mode: "ROV Support Vessel", loadDate: "2025-01-22", layDate: "2025-02-01", transitDays: 10, contractValue: 150000000, depth: 200, status: "Marine Route Survey Completed", remarks: "ROV survey completed Dwarka to Veraval corridor" },
  { id: "SCL-0010", cableNo: "SPT-BBG-2024-018", operator: "Reliance Jio Subsea Network", zone: "East Coast Chennai Visakhapatnam", category: "Submarine Plow Burial Tool SPT", description: "Submarine plow tool for BBG Vizag shallow burial", cableLength: 0, weight: 250000, manufacturer: "HMN Tech", origin: "Visakhapatnam Port", landingStation: "Visakhapatnam CLS", segment: "BBG SPT-VZG-02", mode: "Barge Platform 2000T", loadDate: "2025-01-16", layDate: "2025-01-26", transitDays: 10, contractValue: 280000000, depth: 150, status: "Loaded Cable Ship Departed Port", remarks: "SPT loaded on barge at Vizag for shallow burial" },
  { id: "SCL-0011", cableNo: "SON-SMW6-2024-020", operator: "Sea-Me-We 6 Consortium India", zone: "Sri Lanka Colombo Gateway", category: "Marine Survey Sonar Equipment", description: "Multibeam sonar survey system for Colombo gateway route", cableLength: 0, weight: 7500, manufacturer: "SubCom", origin: "Tuticorin CLS", landingStation: "Colombo South CLS", segment: "SMW6 Sonar Survey LK-05", mode: "ROV Support Vessel", loadDate: "2025-01-25", layDate: "", transitDays: 0, contractValue: 120000000, depth: 3200, status: "Factory Manufactured Cable Plant", remarks: "Kongsberg EM2040 sonar system delivered to Tuticorin" },
  { id: "SCL-0012", cableNo: "CLS-IMEW-2024-022", operator: "BSNL National Subsea Cable", zone: "South India Tuticorin Kochi", category: "Cable Landing Station CLS Equipment", description: "I-ME-WE Kochi CLS terminal equipment and OTDR testing", cableLength: 0, weight: 18000, manufacturer: "Nokia", origin: "Kochi CLS Fort Kochi", landingStation: "Kochi Fort CLS", segment: "I-ME-WE CLS-Kochi-03", mode: "Supply Vessel 500T", loadDate: "2025-01-28", layDate: "2025-02-05", transitDays: 8, contractValue: 210000000, depth: 50, status: "System End-to-End Ready Live", remarks: "Kochi CLS fully commissioned with Nokia OTDR" },
  { id: "SCL-0013", cableNo: "SMW5-GJ-2024-025", operator: "Airtel Bharti Undersea Cable", zone: "Gujarat Veraval Dwarka Port", category: "Subsea Fiber Optic Cable 96-Core", description: "SMW5 Gujarat spur cable Veraval to Dwarka shallow water", cableLength: 280, weight: 14000, manufacturer: "Prysmian", origin: "Veraval CLS", landingStation: "Dwarka Port CLS", segment: "SMW5 Spur GJ-01", mode: "Barge Platform 2000T", loadDate: "2025-02-01", layDate: "2025-02-08", transitDays: 7, contractValue: 350000000, depth: 120, status: "Subsea Cable Laying Buried 1500m", remarks: "Shallow water cable laid and buried at 120m" },
  { id: "SCL-0014", cableNo: "HEL-AN-2024-028", operator: "STTelemedia Chennai Bay", zone: "Andaman Nicobar Island", category: "Subsea Fiber Optic Cable 96-Core", description: "Emergency helicopter airlift of repair cable for Port Blair", cableLength: 5, weight: 250, manufacturer: "NEC", origin: "Chennai CLS Ennore", landingStation: "Port Blair Havelock CLS", segment: "AN Emergency Repair R-01", mode: "Helicopter Airlift Sling", loadDate: "2025-02-03", layDate: "2025-02-03", transitDays: 1, contractValue: 50000000, depth: 50, status: "System End-to-End Ready Live", remarks: "Emergency cable repair via Mi-17 helicopter sling" },
];

const totalCableKm = records.reduce((s, r) => s + r.cableLength, 0);
const activeCable = records.filter(r => r.status === "Subsea Cable Laying Buried 1500m" || r.status === "System End-to-End Ready Live").length;
const transitCount = records.filter(r => r.status === "Loaded Cable Ship Departed Port").length;
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

const kpis = [
  { l: "Total Cable (km)", v: totalCableKm.toLocaleString(), s: "subsea fiber laid" },
  { l: "Active Cables", v: activeCable, s: "laying or live" },
  { l: "Ships in Transit", v: transitCount, s: "departed port" },
  { l: "Total Contract Value", v: formatINR(totalContract), s: "across all segments" },
];

const INSIGHTS = [
  {
    t: "India Digital Infrastructure: 15 Subsea Cable Landing Stations and 1.2 Tbps Capacity Expansion",
    c: "India\u2019s subsea cable infrastructure, anchored by 15 operational cable landing stations (CLS) across Mumbai Digha, Chennai Ennore, Kochi Fort, Tuticorin, Cochin, Visakhapatnam, and Port Blair, provides the country with over 15 terabits per second (Tbps) of international bandwidth capacity. The Department of Telecommunications (DoT) and Telecom Regulatory Authority of India (TRAI) have authorized 8 international submarine cable systems landing in India including SMW3 (Sea-Me-We 3), SMW4, SMW5, I-ME-WE (India-Middle East-Western Europe), Bay of Bengal Gateway (BBG), TIC (Tata Indicom Cable), Falcon, and the upcoming SMW6. India\u2019s international internet bandwidth consumption has grown from 2.4 Tbps in FY2019 to an estimated 14.8 Tbps in FY2025, driven by 850 million smartphone users, 820 million active internet subscribers, and the Digital India initiative. Tata Communications, operating through VSNL (Videsh Sanchar Nigam Limited), manages the largest share of India\u2019s subsea cable capacity through its ownership stakes in SMW3, SMW4, SMW5, TIC, and the Tata Global Network, while Reliance Jio\u2019s Bay of Bengal Gateway and dedicated I-ME-WE capacity serve its 450 million wireless subscriber base. BSNL, as the government-owned telecom operator, holds landing rights for I-ME-WE at Chennai and Tuticorin CLS, while Airtel Bharti operates capacity on SMW5 and BBG for its 380 million subscriber network. The National Broadband Mission 2022 targets 50 Gbps bandwidth per citizen by 2025, requiring an estimated 30 Tbps of additional subsea capacity, driving \u20b945,000 crore in new cable system investments through FY2030. For logistics operators managing subsea cable deployment, India\u2019s cable laying season (October to May, avoiding monsoon June-September) creates a 7-8 month operational window for marine operations, with cable ship day-rates of USD 75,000-120,000 and typical deployment timelines of 12-18 months from contract award to system ready-for-service (RFS)."
  },
  {
    t: "Subsea Cable Security: Undersea Protection Zones and Indian Navy Maritime Domain Awareness",
    c: "India\u2019s subsea cable security framework, governed by the Indian Telegraph Act 1885 (Section 4), the Cable Act 1885, and the Information Technology Act 2000, establishes 500-meter prohibited zones around all operational cable landing stations and designated cable protection zones (CPZ) along submarine cable routes. The Indian Navy, Coast Guard, and National Maritime Domain Awareness (NMDA) center jointly monitor submarine cable infrastructure through a network of seabed acoustic sensors, autonomous underwater vehicles (AUVs), and satellite-based maritime surveillance covering India\u2019s 2.3 million sq km Exclusive Economic Zone (EEZ). The 2023 Red Sea cable cutting incidents (Houthi attacks severing 3 cables: Seacom, TGN, and EIG) and the 2022 Tonga volcanic eruption that severed the Southern Cross Cable have heightened India\u2019s focus on cable resilience and redundancy. India\u2019s submarine cable repair response time averages 14-21 days for shallow water faults (depth < 200m) using domestic repair vessels and 45-60 days for deep water faults (depth > 1000m) requiring international cable repair ship mobilization from Singapore, Dubai, or Colombo repair stations. The National Critical Information Infrastructure Protection Centre (NCIIPC), under the National Technical Research Organisation (NTRO), classifies submarine cable landing stations as Critical Information Infrastructure (CII), mandating ISO 27001 certification, 24/7 security operations center (SOC) monitoring, and annual penetration testing of CLS network management systems. For subsea cable logistics operators, cable protection zone compliance adds 8-12% to deployment costs through required route deviation, additional seabed surveys, and enhanced burial depth requirements (1.5m minimum in fishing zones, 3m in shipping lanes), while insurance premiums for cable laying operations in Indian waters range from 2.5-4.5% of contract value depending on depth zone and operational risk classification."
  },
  {
    t: "Bandwidth Demand Surge: 5G, Cloud Hyperscale, and India\u2019s 850M Smartphone Subscribers",
    c: "India\u2019s bandwidth demand trajectory, driven by 5G deployment across 750,000+ base stations (targeting 1 million by FY2027), cloud hyperscale data center expansion (AWS Mumbai, Azure Pune, Google Cloud Mumbai, Oracle Hyderabad), and 850 million smartphone users consuming an average of 24 GB/month data, is projected to require 40 Tbps of international subsea bandwidth by FY2028, up from 14.8 Tbps in FY2025. Reliance Jio\u2019s 5G network, covering 92% of India\u2019s urban areas and 65% of rural areas, requires 3-5x more backhaul bandwidth than 4G, with each 5G macro cell consuming 2-4 Gbps of backhaul capacity versus 150-300 Mbps for 4G. This bandwidth multiplier effect is the primary demand driver for new subsea cable systems: SMW6 (consortium-led, 130 Tbps design capacity, India landing expected Q2 2026), the India-Asia-Express (IAE) cable (Google-led, 18 Tbps, Mumbai-Singapore-Japan, landing Q4 2026), and the Reliance Jio-led Bay of Bengal Gateway Phase 2 (BBG-2, 24 Tbps, Chennai-Singapore-Australia). India\u2019s data center industry, valued at \u20b935,000 crore in FY2024 and projected to reach \u20b985,000 crore by FY2028 (CAGR 25%), creates massive domestic bandwidth demand between CLS and inland data centers through terrestrial fiber backhaul networks operated by Tata Communications, Sify Technologies, and RailTel Corporation. The cost per Mbps per month of international bandwidth in India has declined from USD 12 in 2018 to USD 3.50 in 2024, with further reduction to USD 1.50-2.00 projected by 2028 as new cable systems enter service, making India one of the most cost-effective international bandwidth markets in Asia-Pacific. For subsea cable logistics providers, the bandwidth demand surge translates to a pipeline of \u20b925,000 crore in new cable laying contracts through FY2030, with 12-15 major deployment projects in various stages from route survey to system commissioning across India\u2019s western, eastern, and southern coastal zones."
  },
  {
    t: "5G/6G Backhaul and Subsea Cable Integration: India\u2019s Telecom Infrastructure Roadmap 2030",
    c: "India\u2019s 5G backhaul architecture, designed by the Telecom Engineering Centre (TEC) under DoT, integrates subsea cable landing stations with a national fiber backbone of 2.5 million route km of optical fiber cable (OFC), connecting 750,000 5G base stations through a hierarchical backhaul network of core, aggregation, and access layers. The subsea-to-cell backhaul chain begins at CLS terminals (Mumbai Digha, Chennai Ennore, Kochi, Tuticorin), where 96-core and 48-core submarine cables are terminated on submarine line terminal equipment (SLTE) from manufacturers Alcatel Submarine Networks (Nokia), SubCom, NEC, and HMN Tech, then routed through metro DWDM (Dense Wavelength Division Multiplexing) rings to tier-1 data centers and network nodes, and finally distributed through regional fiber networks to cell tower fiber points of presence (PoP). India\u2019s 6G research roadmap, outlined in the Bharat 6G Vision Document 2023 by the Technology Innovation Group on 6G (TIG-6G), envisions terabit-per-second backhaul requirements by 2030-2035, potentially requiring next-generation subsea cable systems with 200+ Tbps capacity per fiber pair using space-division multiplexing (SDM) and C+L band amplification. The Department of Telecommunications has allocated \u20b94,500 crore for 5G backhaul fiber deployment under the Universal Service Obligation Fund (USOF) scheme, targeting 100% fiber connectivity to all 5G base stations by FY2027. For subsea cable laying logistics operators, the 5G/6G backhaul integration creates specialized deployment requirements: (1) ultra-low-latency routes with < 5ms CLS-to-data-center transit time, (2) redundant diverse path protection with minimum 50 km geographic separation between primary and protection fiber routes, (3) enhanced cable landing station capacity with multi-system termination capability (4-8 cable systems per CLS), and (4) power feed equipment (PFE) with 15kV DC capability supporting cable spans of 120-150 km between repeaters. The convergence of 5G backhaul demand and subsea cable deployment is expected to generate 3,500-4,000 new skilled jobs in marine engineering, cable termination, and fiber optic splicing across India\u2019s cable landing stations by FY2028."
  },
];

export default function SubseaCableLayingLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "operator", label: "Operator", options: OPERATORS.map(o => ({ value: o, count: records.filter(r => r.operator === o).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
  ];

  const toggleFilter = ((key: string, val: string) => setActiveFilters(p => { const np = {...p}; const arr = np[key] || []; np[key] = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]; return np; }));

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.cableNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.zone.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.landingStation.toLowerCase().includes(q) && !r.segment.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof SubseaRecord] as string));
  });

  return (
    <div className="scl-root p-6 space-y-6">
      <PageHeader title="Subsea Cable Laying Logistics" description="India undersea fiber optic cable laying, landing station equipment, repeater deployment, marine survey and subsea burial logistics" />
      <div className="scl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`scl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#0c2d48] text-white" : "text-gray-600 hover:bg-[#0c2d48]/10"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="scl-dash space-y-6">
          <div className="scl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="scl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 scl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#0c2d48] scl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 scl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="scl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Cable Laying (km) by Coast</h3><BarChart data={monthlyLay} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="westCoast" fill="#0c2d48" radius={[4,4,0,0]} name="West Coast" /><Bar dataKey="eastCoast" fill="#14506b" radius={[4,4,0,0]} name="East Coast" /><Bar dataKey="island" fill="#1c7393" radius={[4,4,0,0]} name="Island" /></BarChart></div>
            <div className="scl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cable Type Distribution by Fiber Count</h3><PieChart width={400} height={220}><Pie data={cableDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{cableDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="scl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Burial Depth Achievement (%) vs 85% Target</h3><LineChart data={depthProfile} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[65, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0c2d48" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#3bb8e0" strokeWidth={2} strokeDasharray="5 5" name="Target 85%" /></LineChart></div>
            <div className="scl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Operator Performance Score (%)</h3><BarChart data={operatorPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[50, 100]} /><Tooltip /><Bar dataKey="v" fill="#14506b" radius={[4,4,0,0]} name="Score %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="scl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Subsea Cable", href: "#" }, { label: "Cable Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="scl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Cable Ref,Operator,Zone,Category,Description,Cable (km),Weight (kg),Manufacturer,Origin,Landing Station,Segment,Mode,Load Date,Lay Date,Transit (d),Contract (\u20b9),Depth (m),Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Subsea Cable Laying Buried 1500m" ? "scl-row-critical bg-red-50 border-l-4 border-l-red-500" : r.status === "Marine Route Survey Completed" ? "scl-row-warning bg-amber-50 border-l-4 border-l-amber-500" : r.status === "Loaded Cable Ship Departed Port" ? "scl-row-info bg-blue-50 border-l-4 border-l-blue-500" : r.status === "Landing Station Splice Tested" ? "scl-row-warning bg-amber-50 border-l-4 border-l-amber-500" : "";
              return (<tr key={r.id} className={`border-b hover:bg-[#0c2d48]/5 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="scl-badge inline-block px-2 py-0.5 rounded text-xs bg-[#0c2d48] text-white font-mono text-[10px]">{r.cableNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.operator}</td>
                <td className="px-3 py-2"><span className="scl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.category}</td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.cableLength > 0 ? `${r.cableLength} km` : "\u2014"}</td>
                <td className="px-3 py-2 text-xs text-right">{r.weight >= 1000 ? `${(r.weight / 1000).toFixed(1)}T` : `${r.weight} kg`}</td>
                <td className="px-3 py-2 text-xs max-w-20 truncate">{r.manufacturer}</td>
                <td className="px-3 py-2 text-xs max-w-20 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.landingStation}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.segment}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.loadDate}</td>
                <td className="px-3 py-2 text-xs">{r.layDate || <span className="text-slate-400">\u2014</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 10 ? "text-red-600" : r.transitDays > 5 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays > 0 ? `${r.transitDays}d` : "\u2014"}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#0c2d48]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2 text-xs text-right">{r.depth > 0 ? `${r.depth}m` : "\u2014"}</td>
                <td className="px-3 py-2"><span className={`scl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="scl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="scl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cable Laying Volume by Zone (km)</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ").slice(0, 2).join(" "), v: +ri(40, 320, 160 + Math.random() * 100).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0c2d48" radius={[4,4,0,0]} name="km" /></BarChart></div>
            <div className="scl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Deployment Activity by Category</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], cable: ri(80, 280, 170 + Math.sin(i * 0.5) * 50), equipment: ri(20, 80, 45 + Math.cos(i * 0.6) * 18), survey: ri(10, 50, 28 + Math.sin(i * 0.7) * 12) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="cable" stackId="1" stroke="#0c2d48" fill="#082035" name="Cable" /><Area type="monotone" dataKey="equipment" stackId="1" stroke="#14506b" fill="#0a3a5a" name="Equipment" /><Area type="monotone" dataKey="survey" stackId="1" stroke="#1c7393" fill="#105070" name="Survey" /></AreaChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="scl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Contract Value by Operator (\u20b9 Cr)</h3><BarChart data={OPERATORS.map(o => ({ n: o.split(" ").slice(0, 2).join(" "), v: +(ri(50, 950, 400 + Math.random() * 350) / 100).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#14506b" radius={[4,4,0,0]} name="\u20b9 Cr" /></BarChart></div>
            <div className="scl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Depth Profile Distribution (m)</h3><BarChart data={[{ n: "0-200m", v: 18 }, { n: "200-500m", v: 14 }, { n: "500-1000m", v: 10 }, { n: "1000-2000m", v: 12 }, { n: "2000-3000m", v: 8 }, { n: "3000-4000m", v: 6 }]} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#1c7393" radius={[4,4,0,0]} name="Segments" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="scl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="scl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#0c2d48] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}