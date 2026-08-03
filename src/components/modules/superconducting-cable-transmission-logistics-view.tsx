"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#7c2d12", "#9a3412", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa"];
const OPERATORS = ["Sterlite Technologies Aurangabad", "KEI Industries New Delhi", "Finolex Cables Pune", "Havells India Noida", "Polycab India Mumbai", "RR Kabel Bangalore", "TEC International Jalandhar", "LS Cable India Chennai"];
const CATEGORIES = ["HTS 275kV DC Cable 2000MW", "HTS 400kV AC Cable 1200MVA", "MgB2 66kV Distribution 300MW", "BSCCO 132kV AC Cable 200MVA", "REBCO 500kV HVDC 3000MW", "HTS Cryogenic Link 33kV 150MW", "Superconducting Transformer 220kV", "Cryocooled Fault Current Limiter"];
const SHIPMENT_STATUSES = ["Cable Drum Loading Dispatch", "Cryogenic Spool Transit Active", "Trenching Installation Progress", "Jointing Splicing Phase", "Cooling Commissioning Phase", "Operational Grid Sync Active"];
const ZONES = ["Gujarat Mundra Kandla Corridor", "Maharashtra Mumbai Pune Nagpur", "Tamil Nadu Chennai Coimbatore", "Rajasthan Jodhpur Barmer Jaisalmer", "Karnataka Bangalore Mangalore", "Madhya Pradesh Bhopal Indore", "Uttar Pradesh Lucknow Kanpur", "West Bengal Kolkata Durgapur"];
const MODES = ["Heavy Haul Trailer 40T Drum", "Cryogenic ISO Tank Container", "Flat Rack Vessel Overseas", "Express Rail Rake Special", "Multi-Axle Trailer 60T", "Specialized Cable Tray Truck"];
const TABS = ["Dashboard", "Cable Registry", "Transmission Analytics", "Insights"];

const statusColor: Record<string, string> = { "Cable Drum Loading Dispatch": "orange", "Cryogenic Spool Transit Active": "blue", "Trenching Installation Progress": "orange", "Jointing Splicing Phase": "blue", "Cooling Commissioning Phase": "orange", "Operational Grid Sync Active": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyCable = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], hts: +(12 + Math.sin(i * 0.5) * 5).toFixed(0), mgb2: +(8 + Math.cos(i * 0.6) * 3).toFixed(0), rebco: +(4 + Math.sin(i * 0.4) * 2).toFixed(0), bscco: +(6 + Math.cos(i * 0.7) * 2).toFixed(0) }));
const techDist = [{ n: "HTS Tape", v: 38 }, { n: "MgB2 Wire", v: 22 }, { n: "REBCO CC", v: 18 }, { n: "BSCCO", v: 12 }, { n: "Cryo Link", v: 10 }];
const lossTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], sc: +(0.05 + Math.sin(i * 0.3) * 0.02).toFixed(3), conv: +(6.5 + Math.cos(i * 0.4) * 1.5).toFixed(1), xlpe: +(8.2 + Math.sin(i * 0.5) * 1.2).toFixed(1) }));
const zoneCapacity = [
  { zone: "GJ", mw: 4500 },
  { zone: "MH", mw: 3200 },
  { zone: "TN", mw: 2800 },
  { zone: "RJ", mw: 2200 },
  { zone: "KA", mw: 1800 },
  { zone: "MP", mw: 1200 },
  { zone: "UP", mw: 1500 },
  { zone: "WB", mw: 1000 }
];

const INSIGHTS = [
  { t: "India\u2019s Superconducting Cable Transmission: PGCB 275kV HTS Project", c: "India is advancing superconducting cable technology for high-capacity power transmission with the first commercial HTS (High Temperature Superconducting) cable project at 275kV DC connecting Mundra-Kandla industrial corridor in Gujarat, developed by Sterlite Technologies in collaboration with Sumitomo Electric Japan and LS Cable Korea. The project uses second-generation (2G) HTS REBCO (Rare-Earth Barium Copper Oxide) coated conductor tapes with critical current density exceeding 300A/mm2 at 77K liquid nitrogen temperature, enabling power transfer of 2000MW per cable circuit with 99.5% transmission efficiency compared to 92-94% for conventional XLPE cables. The Ministry of Power\u2019s National Transmission Asset Management Centre (NTAMC) has identified 12 high-density corridors where superconducting cables can replace existing 400kV overhead lines, reducing right-of-way requirements by 80% and eliminating electromagnetic interference in urban areas. The total investment for India\u2019s HTS cable program is estimated at \u20b945,000 crore over the next decade, with PLI (Production-Linked Incentive) scheme allocation of \u20b96,800 crore for domestic HTS tape manufacturing." },
  { t: "MgB2 and BSCCO Superconductors for Indian Distribution Networks", c: "Magnesium Diboride (MgB2) superconducting wire at 66kV distribution level and BSCCO (Bismuth Strontium Calcium Copper Oxide) at 132kV are being deployed in India\u2019s metropolitan distribution networks by KEI Industries and Polycab India. MgB2 operates at 20-30K using cryocoolers (Gifford-McMahon or pulse tube) with zero liquid helium consumption, achieving current density of 500A/mm2, which is 10x higher than copper conductors of equivalent cross-section. A 300MW MgB2 distribution cable system costs \u20b9180 crore per km including cryogenic infrastructure, compared to \u20b912 crore for conventional XLPE cable, but the lifetime cost advantage becomes positive at load factors above 65% due to zero resistive losses saving \u20b98-12 crore per year per km in transmission losses. BSCCO first-generation HTS tapes at 132kV are manufactured by TEC International Jalandhar under technology transfer from American Superconductor (AMSC), with India\u2019s first 200MVA BSCCO cable installation in Bangalore\u2019s Peenya Industrial Area connecting the 220kV substation to the electronics manufacturing cluster." },
  { t: "Cryogenic Infrastructure and Cooling Systems for Indian SC Cable Projects", c: "Cryogenic cooling infrastructure is the backbone of superconducting cable systems, requiring continuous liquid nitrogen (LN2) circulation at 65-77K for HTS cables or liquid helium (LHe) at 4.2K for LTS (Low Temperature Superconducting) applications. India\u2019s cryogenic infrastructure for power cables is being developed by Inox India (cryogenic storage tanks), Linde India (LN2 supply and re-liquefaction), and Air Products India (helium recovery and purification systems). A typical 10km HTS cable system requires 2,500 litres of LN2 per hour in circulation, with 3 cryogenic pumping stations at 3.3km intervals and 2LN2 sub-coolers maintaining temperature within +/-0.5K tolerance. Cable termination joints use Cryoflex cryogenic flexible connectors with vacuum-insulated demountable joints rated for 275kV DC 3000A continuous. Havells India Noida is manufacturing cryogenic cable jointing kits under license from Nexans France, with India\u2019s first domestically produced cryogenic joint installed at the Gujarat Energy Transmission Corporation (GETCO) 275kV HTS demonstration project near Vadodara." },
  { t: "Superconducting Fault Current Limiters and Transformers for Indian Grid Resilience", c: "Superconducting fault current limiters (SFCLs) and superconducting transformers represent the next wave of grid resilience technology being adopted by India\u2019s state electricity boards and the Power Grid Corporation of India (PGCIL). SFCLs use HTS elements that transition from superconducting to resistive state within milliseconds during fault conditions, limiting prospective fault currents from 63kA to below 25kA, protecting substation equipment and reducing required breaker ratings. RR Kabel Bangalore in collaboration with Siemens Energy Germany has installed India\u2019s first 220kV SFCL at the Kudgi Ultra Mega Power Plant (UMPP) switchyard in Karnataka, rated for 40kA prospective current limitation with response time under 2ms. Superconducting transformers at 220kV 500MVA being developed by BHEL Bhopal and Crompton Greaves use HTS windings with 50% reduction in core weight, 70% reduction in no-load losses, and elimination of transformer oil fire risk. The total addressable market for superconducting grid equipment in India is estimated at \u20b915,000 crore by 2030, driven by India\u2019s 500GW renewable energy target requiring massive grid strengthening and fault current management at solar and wind injection points." }
];

interface SCTRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; voltageKV: number; capacityMW: number; cableLengthKm: number; conductorType: string; coolingType: string; origin: string; project: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; jointingMake: string; status: string; remarks: string; }

const records: SCTRecord[] = [
  { id: "SCT-0001", batchNo: "STL/AUR/2025/HTS-0012", operator: "Sterlite Technologies Aurangabad", zone: "Gujarat Mundra Kandla Corridor", category: "HTS 275kV DC Cable 2000MW", description: "275kV DC HTS cable for Mundra-Kandla industrial corridor with 2000MW capacity REBCO coated conductor LN2 cooled at 77K and 10km route length", voltageKV: 275, capacityMW: 2000, cableLengthKm: 10, conductorType: "REBCO 2G CC", coolingType: "LN2 77K Circulation", origin: "Sterlite Aurangabad Plant MH", project: "Mundra-Kandla HTS Link Phase-I", state: "Gujarat", mode: "Heavy Haul Trailer 40T Drum", prodDate: "2025-01-15", shipDate: "2025-04-20", transitDays: 4, contractValue: 8500000000, jointingMake: "Nexans Cryoflex FR", status: "Operational Grid Sync Active", remarks: "275kV HTS Sterlite Mundra operational sync" },
  { id: "SCT-0002", batchNo: "KEI/NDL/2025/MGB-0018", operator: "KEI Industries New Delhi", zone: "Maharashtra Mumbai Pune Nagpur", category: "MgB2 66kV Distribution 300MW", description: "66kV MgB2 superconducting distribution cable for Mumbai-Peenya corridor with 300MW capacity cryocooled at 25K and 5km urban route", voltageKV: 66, capacityMW: 300, cableLengthKm: 5, conductorType: "MgB2 Wire", coolingType: "Cryocooler 25K GM", origin: "KEI Noida Plant UP", project: "Mumbai MgB2 Distribution Phase-I", state: "Maharashtra", mode: "Cryogenic ISO Tank Container", prodDate: "2025-02-10", shipDate: "2025-05-25", transitDays: 3, contractValue: 1800000000, jointingMake: "Havells Cryo-Joint IN", status: "Cooling Commissioning Phase", remarks: "66kV MgB2 KEI Mumbai cooling commission" },
  { id: "SCT-0003", batchNo: "FCB/PUN/2025/BCS-0025", operator: "Finolex Cables Pune", zone: "Tamil Nadu Chennai Coimbatore", category: "BSCCO 132kV AC Cable 200MVA", description: "132kV BSCCO superconducting AC cable for Chennai electronics corridor with 200MVA capacity first-gen HTS tape LN2 cooled and 8km industrial route", voltageKV: 132, capacityMW: 200, cableLengthKm: 8, conductorType: "BSCCO 2223 Tape", coolingType: "LN2 77K Bath", origin: "Finolex Pune Plant MH", project: "Chennai BSCCO 132kV Industrial Link", state: "Tamil Nadu", mode: "Flat Rack Vessel Overseas", prodDate: "2025-03-05", shipDate: "2025-06-18", transitDays: 7, contractValue: 2500000000, jointingMake: "TEC Demountable IN", status: "Jointing Splicing Phase", remarks: "132kV BSCCO Finolex Chennai splicing active" },
  { id: "SCT-0004", batchNo: "HVL/NOD/2025/RBC-0032", operator: "Havells India Noida", zone: "Rajasthan Jodhpur Barmer Jaisalmer", category: "REBCO 500kV HVDC 3000MW", description: "500kV HVDC REBCO superconducting cable for Jodhpur-Barmer solar corridor with 3000MW capacity 2G CC cryocooled at 30K and 15km desert route", voltageKV: 500, capacityMW: 3000, cableLengthKm: 15, conductorType: "REBCO 2G CC Multi-Layer", coolingType: "Cryocooler 30K PT", origin: "Havells Noida Plant UP", project: "Jodhpur-Barmer REBCO HVDC Link", state: "Rajasthan", mode: "Multi-Axle Trailer 60T", prodDate: "2025-01-25", shipDate: "2025-04-10", transitDays: 5, contractValue: 15000000000, jointingMake: "Nexans VDI Joint DE", status: "Trenching Installation Progress", remarks: "500kV REBCO Havells Jodhpur trenching" },
  { id: "SCT-0005", batchNo: "PLB/MUM/2025/CRY-0041", operator: "Polycab India Mumbai", zone: "Karnataka Bangalore Mangalore", category: "HTS Cryogenic Link 33kV 150MW", description: "33kV HTS cryogenic link cable for Bangalore Peenya industrial cluster with 150MW capacity compact cryogenic flexible conductor and 3km route", voltageKV: 33, capacityMW: 150, cableLengthKm: 3, conductorType: "HTS YBCO Flex", coolingType: "LN2 77K Closed Loop", origin: "Polycab Mumbai Plant MH", project: "Bangalore Peenya Cryo Link", state: "Karnataka", mode: "Express Rail Rake Special", prodDate: "2025-04-10", shipDate: "2025-06-25", transitDays: 2, contractValue: 680000000, jointingMake: "RR Kabel SFCL Kit IN", status: "Cable Drum Loading Dispatch", remarks: "33kV Cryo Link Polycab Bangalore dispatch" },
  { id: "SCT-0006", batchNo: "RRK/BLR/2025/TRF-0048", operator: "RR Kabel Bangalore", zone: "Madhya Pradesh Bhopal Indore", category: "Superconducting Transformer 220kV", description: "220kV 500MVA superconducting power transformer for Bhopal substation with HTS windings 50% core weight reduction and zero oil fire risk", voltageKV: 220, capacityMW: 500, cableLengthKm: 0.5, conductorType: "HTS BSCCO Pancake", coolingType: "LN2 77K Submerged", origin: "RR Kabel Bangalore Plant KA", project: "Bhopal 220kV SC Transformer", state: "Madhya Pradesh", mode: "Heavy Haul Trailer 40T Drum", prodDate: "2025-02-20", shipDate: "2025-05-08", transitDays: 4, contractValue: 2200000000, jointingMake: "BHEL Custom Bushing IN", status: "Cooling Commissioning Phase", remarks: "220kV SC Transformer RR Kabel Bhopal cooling" },
  { id: "SCT-0007", batchNo: "TEC/JLN/2025/FCL-0055", operator: "TEC International Jalandhar", zone: "Uttar Pradesh Lucknow Kanpur", category: "Cryocooled Fault Current Limiter", description: "220kV 40kA SFCL for Lucknow grid substation using HTS element 2ms response time current limitation from 63kA to 25kA with automatic recovery", voltageKV: 220, capacityMW: 400, cableLengthKm: 0.2, conductorType: "YBCO Bifilar", coolingType: "LN2 77K Sub-Cooled", origin: "TEC Jalandhar Plant PB", project: "Lucknow 220kV SFCL Installation", state: "Uttar Pradesh", mode: "Specialized Cable Tray Truck", prodDate: "2025-03-15", shipDate: "2025-06-02", transitDays: 3, contractValue: 950000000, jointingMake: "Siemens Type-Tested DE", status: "Jointing Splicing Phase", remarks: "220kV SFCL TEC Lucknow jointing phase" },
  { id: "SCT-0008", batchNo: "LSC/CHN/2025/HTS-0062", operator: "LS Cable India Chennai", zone: "West Bengal Kolkata Durgapur", category: "HTS 400kV AC Cable 1200MVA", description: "400kV AC HTS cable for Kolkata-Durgapur industrial corridor with 1200MVA capacity REBCO 2G tape LN2 cooled and 12km high-density route", voltageKV: 400, capacityMW: 1200, cableLengthKm: 12, conductorType: "REBCO 2G CC Tape", coolingType: "LN2 77K Forced Flow", origin: "LS Cable Chennai Plant TN", project: "Kolkata-Durgapur 400kV HTS AC Link", state: "West Bengal", mode: "Heavy Haul Trailer 40T Drum", prodDate: "2025-04-01", shipDate: "2025-07-10", transitDays: 6, contractValue: 5800000000, jointingMake: "LS Cable VD Joint KR", status: "Trenching Installation Progress", remarks: "400kV HTS LS Cable Kolkata trenching" },
  { id: "SCT-0009", batchNo: "STL/AUR/2025/HTS-0075", operator: "Sterlite Technologies Aurangabad", zone: "Gujarat Mundra Kandla Corridor", category: "HTS 275kV DC Cable 2000MW", description: "275kV DC HTS cable phase-2 for Kandla-Ahmedabad corridor with 2000MW capacity REBCO CC LN2 cooled and 12km route with intermediate cryo station", voltageKV: 275, capacityMW: 2000, cableLengthKm: 12, conductorType: "REBCO 2G CC Multi-Layer", coolingType: "LN2 77K 3-Station", origin: "Sterlite Aurangabad Plant MH", project: "Kandla-Ahmedabad HTS Phase-II", state: "Gujarat", mode: "Heavy Haul Trailer 40T Drum", prodDate: "2025-02-05", shipDate: "2025-05-15", transitDays: 3, contractValue: 9200000000, jointingMake: "Sumitomo SC Joint JP", status: "Cryogenic Spool Transit Active", remarks: "275kV HTS Sterlite Kandla cryo transit" },
  { id: "SCT-0010", batchNo: "KEI/NDL/2025/MGB-0083", operator: "KEI Industries New Delhi", zone: "Maharashtra Mumbai Pune Nagpur", category: "MgB2 66kV Distribution 300MW", description: "66kV MgB2 cable for Pune-Hinjewadi IT corridor with 300MW capacity cryocooled 25K and 4km route with 2 cryo pump stations", voltageKV: 66, capacityMW: 300, cableLengthKm: 4, conductorType: "MgB2 Ex situ Wire", coolingType: "Cryocooler 25K 2-Station", origin: "KEI Noida Plant UP", project: "Pune Hinjewadi MgB2 Phase-I", state: "Maharashtra", mode: "Cryogenic ISO Tank Container", prodDate: "2025-03-20", shipDate: "2025-06-28", transitDays: 2, contractValue: 1500000000, jointingMake: "Havells Cryo-Joint IN", status: "Cooling Commissioning Phase", remarks: "66kV MgB2 KEI Pune cooling commission" },
  { id: "SCT-0011", batchNo: "FCB/PUN/2025/BCS-0091", operator: "Finolex Cables Pune", zone: "Tamil Nadu Chennai Coimbatore", category: "BSCCO 132kV AC Cable 200MVA", description: "132kV BSCCO cable for Coimbatore textile industrial cluster with 200MVA capacity 1G HTS tape LN2 cooled 6km route along Avinashi Road", voltageKV: 132, capacityMW: 200, cableLengthKm: 6, conductorType: "BSCCO 2223 Multifil", coolingType: "LN2 77K Bath Recirc", origin: "Finolex Pune Plant MH", project: "Coimbatore 132kV BSCCO Link", state: "Tamil Nadu", mode: "Express Rail Rake Special", prodDate: "2025-04-15", shipDate: "2025-07-20", transitDays: 2, contractValue: 2100000000, jointingMake: "TEC Demountable IN", status: "Cable Drum Loading Dispatch", remarks: "132kV BSCCO Finolex Coimbatore dispatch" },
  { id: "SCT-0012", batchNo: "HVL/NOD/2025/RBC-0098", operator: "Havells India Noida", zone: "Rajasthan Jodhpur Barmer Jaisalmer", category: "REBCO 500kV HVDC 3000MW", description: "500kV HVDC REBCO cable phase-2 for Barmer-Jaisalmer solar corridor with 3000MW capacity 2G CC 30K cryocooled 18km desert route", voltageKV: 500, capacityMW: 3000, cableLengthKm: 18, conductorType: "REBCO 2G CC Stacked", coolingType: "Cryocooler 30K 4-Station", origin: "Havells Noida Plant UP", project: "Barmer-Jaisalmer HVDC Phase-II", state: "Rajasthan", mode: "Multi-Axle Trailer 60T", prodDate: "2025-01-30", shipDate: "2025-04-18", transitDays: 6, contractValue: 16500000000, jointingMake: "Nexans VDI Joint DE", status: "Trenching Installation Progress", remarks: "500kV REBCO Havells Barmer trenching" },
  { id: "SCT-0013", batchNo: "PLB/MUM/2025/CRY-0105", operator: "Polycab India Mumbai", zone: "Karnataka Bangalore Mangalore", category: "HTS Cryogenic Link 33kV 150MW", description: "33kV cryogenic link for Mangalore refinery corridor with 150MW capacity compact flexible HTS conductor LN2 loop cooled and 4km route", voltageKV: 33, capacityMW: 150, cableLengthKm: 4, conductorType: "HTS YBCO Flex", coolingType: "LN2 77K Closed Loop", origin: "Polycab Mumbai Plant MH", project: "Mangalore Refinery Cryo Link", state: "Karnataka", mode: "Specialized Cable Tray Truck", prodDate: "2025-05-01", shipDate: "2025-07-15", transitDays: 1, contractValue: 750000000, jointingMake: "RR Kabel SFCL Kit IN", status: "Cryogenic Spool Transit Active", remarks: "33kV Cryo Link Polycab Mangalore transit" },
  { id: "SCT-0014", batchNo: "LSC/CHN/2025/HTS-0118", operator: "LS Cable India Chennai", zone: "West Bengal Kolkata Durgapur", category: "HTS 400kV AC Cable 1200MVA", description: "400kV AC HTS cable for Durgapur-Asansol steel corridor with 1200MVA capacity REBCO 2G tape LN2 forced flow and 10km heavy industrial route", voltageKV: 400, capacityMW: 1200, cableLengthKm: 10, conductorType: "REBCO 2G CC Tape", coolingType: "LN2 77K Forced Flow", origin: "LS Cable Chennai Plant TN", project: "Durgapur-Asansol 400kV HTS Link", state: "West Bengal", mode: "Heavy Haul Trailer 40T Drum", prodDate: "2025-03-10", shipDate: "2025-06-12", transitDays: 5, contractValue: 5200000000, jointingMake: "LS Cable VD Joint KR", status: "Operational Grid Sync Active", remarks: "400kV HTS LS Cable Durgapur operational" }
];

export default function SuperconductingCableTransmissionLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalMW = records.reduce((s, r) => s + r.capacityMW, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => { const c = statusColor[r.status]; return c !== "green"; }).length;
  const operational = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total Capacity MW", v: totalMW, s: "Across " + records.length + " cable records" },
    { l: "Under Construction", v: underConstruction, s: "Trenching to commissioning" },
    { l: "Operational", v: operational, s: "Grid synchronized active" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "jointingMake", label: "Jointing", options: ["Nexans Cryoflex FR", "Havells Cryo-Joint IN", "TEC Demountable IN", "Nexans VDI Joint DE", "RR Kabel SFCL Kit IN", "BHEL Custom Bushing IN", "Siemens Type-Tested DE", "LS Cable VD Joint KR"].map(j => ({ value: j, count: records.filter(r => r.jointingMake === j).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q) && !r.conductorType.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof SCTRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "kV", "MW", "Length (km)", "Conductor", "Cooling", "Origin", "Project", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Jointing", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="sct-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Cable Installations by Type</h3><BarChart data={monthlyCable} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="hts" fill="#7c2d12" radius={[4,4,0,0]} name="HTS" /><Bar dataKey="mgb2" fill="#c2410c" radius={[4,4,0,0]} name="MgB2" /><Bar dataKey="rebco" fill="#ea580c" radius={[4,4,0,0]} name="REBCO" /><Bar dataKey="bscco" fill="#fb923c" radius={[4,4,0,0]} name="BSCCO" /></BarChart></div>
        <div className="sct-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Conductor Technology Distribution (%)</h3><PieChart width={400} height={220}><Pie data={techDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="sct-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Transmission Loss Comparison (%/100km)</h3><LineChart data={lossTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="sc" stroke="#7c2d12" strokeWidth={2} name="SC Cable (x100)" /><Line type="monotone" dataKey="conv" stroke="#c2410c" strokeWidth={2} name="Conv. XLPE" /><Line type="monotone" dataKey="xlpe" stroke="#ea580c" strokeWidth={2} strokeDasharray="5 5" name="OH Line" /></LineChart></div>
        <div className="sct-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">SC Cable Capacity by Zone (MW)</h3><BarChart data={zoneCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" /><YAxis /><Tooltip /><Legend /><Bar dataKey="mw" fill="#c2410c" radius={[4,4,0,0]} name="SC Capacity MW" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="sct-root p-6 space-y-6">
      <PageHeader title="Superconducting Cable Transmission Logistics" description="Indian superconducting cable transmission logistics covering HTS 275kV DC REBCO 2G CC 2000MW MgB2 66kV cryocooled 300MW BSCCO 132kV 200MVA REBCO 500kV HVDC 3000MW cryogenic link 33kV 150MW superconducting transformer 220kV 500MVA fault current limiter 40kA LN2 77K liquid nitrogen Sterlite KEI Finolex Havells Polycab RR Kabel TEC LS Cable across Gujarat Maharashtra Tamil Nadu Rajasthan Karnataka MP UP West Bengal PLI scheme" />
      <div className="sct-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`sct-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#7c2d12] text-white" : "text-gray-600 hover:bg-orange-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Superconducting Cable" }]} />
      {tab === 0 && (
        <div className="sct-dash space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <div key={i} className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">{k.l}</p><p className="text-2xl font-bold text-[#7c2d12]">{typeof k.v === 'number' ? k.v.toLocaleString('en-IN') : k.v}</p><p className="text-xs text-gray-400">{k.s}</p></div>)}
          </div>
          {renderCharts()}
          <div className="grid grid-cols-2 gap-6">
            {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-4"><h4 className="text-sm font-semibold mb-2 text-[#7c2d12]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="sct-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="sct-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{r.voltageKV}</td><td className="px-3 py-2 text-right">{r.capacityMW.toLocaleString("en-IN")}</td><td className="px-3 py-2 text-right">{r.cableLengthKm}</td><td className="px-3 py-2">{r.conductorType}</td><td className="px-3 py-2">{r.coolingType}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.project}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.jointingMake}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="sct-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="sct-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#7c2d12]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
