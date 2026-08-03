"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0c1e3a", "#1e3a5f", "#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8"];
const OPERATORS = ["Petronet LNG Dahej Gujarat", "Shell Energy Hazira Gujarat", "Gail Dabhol Maharashtra", "Indian Oil Ennore Tamil Nadu", "Gujarat State Petronet Mundra", "Adani Total Hazira Maharashtra", "PLL Kochi Kerala LNG", "Dhamra LNG Odisha Paradip"];
const CATEGORIES = ["QFlex 266K m3 LNG Carrier Berth", "FSRU 170K m3 Floating Storage", "LNG Receiving Regas Terminal 15MTPA", "Send-Out Gas Pipeline 48 inch 2000km", "Cryogenic Storage Tank 160K m3", "LNG Truck Loading Bay Iso Container", "LNG Satellite City Gate Station", "BOG Reliquefaction Compressor Unit"];
const SHIPMENT_STATUSES = ["Carrier Berthing LNG Offloading Active", "Regasification Vaporizer Process On", "Pipeline Transmission Metering QC", "Cryogenic Tank Storage Fill Active", "Truck Loading Dispatch Transit", "City Gate Distribution Delivered"];
const ZONES = ["Gujarat Dahej Hazira Mundra", "Maharashtra Dabhol Trombay", "Tamil Nadu Ennore Kattupalli", "Kerala Kochi Vizhinjam", "Odisha Dhamra Paradip", "West Bengal Haldia", "Andhra Pradesh Kakinada"];
const MODES = ["LNG Carrier QMax 266K m3", "LNG Shuttle Tanker 80K m3", "ISO Tank Container Truck 40T", "Cryogenic Pipeline 48 inch", "Barge Coastal LNG 5000T", "Rail LNG Wagon Specialized"];
const TABS = ["Dashboard", "Cargo Registry", "Terminal Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Carrier Berthing LNG Offloading Active": "slate", "Regasification Vaporizer Process On": "blue", "Pipeline Transmission Metering QC": "amber", "Cryogenic Tank Storage Fill Active": "orange", "Truck Loading Dispatch Transit": "red", "City Gate Distribution Delivered": "green" };

const GAS_STANDARDS = ["ISO 6976 LNG Spec", "EN 1160 LNG Quality", "NGC LNG Grade A", "BIS 16778 LNG"];

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

function formatINR(v: number): string {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)} L`;
  return `₹${(v / 1000).toFixed(1)} K`;
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyImport = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], qflex: ri(12, 28, 18 + Math.sin(i * 0.5) * 5), fsru: ri(6, 14, 9 + Math.cos(i * 0.6) * 3), pipeline: ri(20, 42, 30 + Math.sin(i * 0.7) * 6), truck: ri(2, 8, 4 + Math.cos(i * 0.8) * 2) }));
const termDist = [{ n: "Petronet LNG", v: 25 }, { n: "Shell Energy", v: 15 }, { n: "Gail Dabhol", v: 15 }, { n: "IOCL Ennore", v: 15 }, { n: "Adani Total", v: 10 }, { n: "GSPL Mundra", v: 10 }, { n: "PLL Kochi", v: 5 }, { n: "Dhamra LNG", v: 5 }];
const lngPrice = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], spot: +(ri(8.5, 18.5, 12.5 + Math.sin(i * 0.4) * 4)).toFixed(2), longterm: 10.50 }));
const sendOut = OPERATORS.slice(0, 6).map(o => ({ n: o.split(" ")[0], v: +ri(8, 32, 18 + Math.random() * 10).toFixed(1) }));

interface LngRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; capacityMTPA: number; storageVolume: number; carrierName: string; cargoVolume: number; origin: string; terminal: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; gasStandard: string; status: string; remarks: string; }

const records: LngRecord[] = [
  { id: "LNG-0001", batchNo: "LNG-DAH-2025-001", operator: "Petronet LNG Dahej Gujarat", zone: "Gujarat Dahej Hazira Mundra", category: "QFlex 266K m3 LNG Carrier Berth", description: "QFlex carrier Methane Princess berthing at Dahej for LNG offloading into 4x160K m3 cryogenic tanks", capacityMTPA: 15, storageVolume: 180000, carrierName: "Methane Princess QFlex", cargoVolume: 266000, origin: "Qatar Ras Laffan", terminal: "Petronet LNG Dahej", state: "Gujarat", mode: "LNG Carrier QMax 266K m3", prodDate: "2025-01-05", shipDate: "2025-01-08", transitDays: 8, contractValue: 8000000000, gasStandard: "ISO 6976 LNG Spec", status: "Carrier Berthing LNG Offloading Active", remarks: "QFlex arrival Dahej - 266K m3 cargo from Qatar North Field" },
  { id: "LNG-0002", batchNo: "LNG-HZI-2025-002", operator: "Shell Energy Hazira Gujarat", zone: "Gujarat Dahej Hazira Mundra", category: "FSRU 170K m3 Floating Storage", description: "FSRU Excellence receiving LNG cargo for regasification and send-out via 48 inch pipeline", capacityMTPA: 5, storageVolume: 170000, carrierName: "Al Nuaimi QMax", cargoVolume: 210000, origin: "Australia Gorgon", terminal: "Shell Energy Hazira", state: "Gujarat", mode: "LNG Carrier QMax 266K m3", prodDate: "2025-01-02", shipDate: "2025-01-12", transitDays: 14, contractValue: 6500000000, gasStandard: "EN 1160 LNG Quality", status: "Regasification Vaporizer Process On", remarks: "FSRU vaporizers active - 48 inch send-out pipeline to grid" },
  { id: "LNG-0003", batchNo: "LNG-DBL-2025-003", operator: "Gail Dabhol Maharashtra", zone: "Maharashtra Dabhol Trombay", category: "LNG Receiving Regas Terminal 15MTPA", description: "Regas terminal processing LNG cargo for western India gas grid via Dabhol-Bangalore pipeline", capacityMTPA: 5, storageVolume: 160000, carrierName: "LNG Meydan", cargoVolume: 155000, origin: "Oman Qalhat", terminal: "Gail Dabhol", state: "Maharashtra", mode: "LNG Shuttle Tanker 80K m3", prodDate: "2025-01-06", shipDate: "2025-01-11", transitDays: 6, contractValue: 4200000000, gasStandard: "NGC LNG Grade A", status: "Pipeline Transmission Metering QC", remarks: "Dabhol terminal - gas metering QC check for western grid" },
  { id: "LNG-0004", batchNo: "LNG-ENN-2025-004", operator: "Indian Oil Ennore Tamil Nadu", zone: "Tamil Nadu Ennore Kattupalli", category: "Send-Out Gas Pipeline 48 inch 2000km", description: "Ennore terminal gas send-out through 48 inch pipeline to Chennai and southern cities", capacityMTPA: 5, storageVolume: 180000, carrierName: "Pacific Sun", cargoVolume: 180000, origin: "Trinidad Atlantic LNG", terminal: "IOCL Ennore", state: "Tamil Nadu", mode: "Cryogenic Pipeline 48 inch", prodDate: "2024-12-28", shipDate: "2025-01-10", transitDays: 12, contractValue: 3800000000, gasStandard: "BIS 16778 LNG", status: "City Gate Distribution Delivered", remarks: "Ennore cargo delivered to Chennai CGD network successfully" },
  { id: "LNG-0005", batchNo: "LNG-MUN-2025-005", operator: "Gujarat State Petronet Mundra", zone: "Gujarat Dahej Hazira Mundra", category: "Cryogenic Storage Tank 160K m3", description: "LNG cargo filling cryogenic storage tanks at Mundra terminal for gas send-out", capacityMTPA: 5, storageVolume: 160000, carrierName: "LNG Jupiter", cargoVolume: 145000, origin: "USA Sabine Pass", terminal: "GSPL Mundra", state: "Gujarat", mode: "LNG Carrier QMax 266K m3", prodDate: "2025-01-01", shipDate: "2025-01-14", transitDays: 18, contractValue: 5100000000, gasStandard: "ISO 6976 LNG Spec", status: "Cryogenic Tank Storage Fill Active", remarks: "Mundra tank filling from US Sabine Pass LNG cargo" },
  { id: "LNG-0006", batchNo: "LNG-AHZ-2025-006", operator: "Adani Total Hazira Maharashtra", zone: "Maharashtra Dabhol Trombay", category: "LNG Truck Loading Bay Iso Container", description: "ISO container truck loading at Hazira for satellite city gas distribution network", capacityMTPA: 7, storageVolume: 65000, carrierName: "GasLog Sapphire", cargoVolume: 155000, origin: "Yemen Balhaf", terminal: "Adani Total Hazira", state: "Maharashtra", mode: "ISO Tank Container Truck 40T", prodDate: "2025-01-04", shipDate: "2025-01-09", transitDays: 9, contractValue: 2900000000, gasStandard: "EN 1160 LNG Quality", status: "Truck Loading Dispatch Transit", remarks: "ISO tank trucks loaded for Maharashtra city gas distribution" },
  { id: "LNG-0007", batchNo: "LNG-KCH-2025-007", operator: "PLL Kochi Kerala LNG", zone: "Kerala Kochi Vizhinjam", category: "LNG Satellite City Gate Station", description: "Kochi terminal city gate station receiving regasified LNG for Kerala CGD network", capacityMTPA: 5, storageVolume: 125000, carrierName: "LNG Lagos", cargoVolume: 120000, origin: "Qatar Ras Laffan", terminal: "PLL Kochi", state: "Kerala", mode: "Cryogenic Pipeline 48 inch", prodDate: "2025-01-03", shipDate: "2025-01-10", transitDays: 10, contractValue: 3500000000, gasStandard: "NGC LNG Grade A", status: "City Gate Distribution Delivered", remarks: "Kochi city gate - delivered to Kerala CGD distribution" },
  { id: "LNG-0008", batchNo: "LNG-DHA-2025-008", operator: "Dhamra LNG Odisha Paradip", zone: "Odisha Dhamra Paradip", category: "BOG Reliquefaction Compressor Unit", description: "BOG reliquefaction unit processing boil-off gas during cargo transfer at Dhamra", capacityMTPA: 5, storageVolume: 200000, carrierName: "Methane Spirit", cargoVolume: 195000, origin: "Mozambique Cabo Delgado", terminal: "Dhamra LNG", state: "Odisha", mode: "LNG Carrier QMax 266K m3", prodDate: "2024-12-30", shipDate: "2025-01-11", transitDays: 16, contractValue: 5500000000, gasStandard: "ISO 6976 LNG Spec", status: "Regasification Vaporizer Process On", remarks: "Dhamra BOG compressor active - Mozambique cargo regas" },
  { id: "LNG-0009", batchNo: "LNG-DAH-2025-009", operator: "Petronet LNG Dahej Gujarat", zone: "Gujarat Dahej Hazira Mundra", category: "LNG Receiving Regas Terminal 15MTPA", description: "Dahej terminal 17.5 MTPA processing QFlex cargo from Ras Laffan North Field expansion", capacityMTPA: 15, storageVolume: 180000, carrierName: "Al Gharrafa QFlex", cargoVolume: 266000, origin: "Qatar North Field", terminal: "Petronet LNG Dahej", state: "Gujarat", mode: "LNG Carrier QMax 266K m3", prodDate: "2025-01-07", shipDate: "2025-01-12", transitDays: 7, contractValue: 7500000000, gasStandard: "BIS 16778 LNG", status: "Carrier Berthing LNG Offloading Active", remarks: "Dahej 17.5 MTPA - QFlex Al Gharrafa berthing now" },
  { id: "LNG-0010", batchNo: "LNG-HZI-2025-010", operator: "Shell Energy Hazira Gujarat", zone: "Gujarat Dahej Hazira Mundra", category: "FSRU 170K m3 Floating Storage", description: "FSRU receiving LNG from barge coastal delivery for emergency storage at Hazira", capacityMTPA: 5, storageVolume: 170000, carrierName: "Coral Energy", cargoVolume: 85000, origin: "UAE Das Island", terminal: "Shell Energy Hazira", state: "Gujarat", mode: "Barge Coastal LNG 5000T", prodDate: "2025-01-06", shipDate: "2025-01-08", transitDays: 4, contractValue: 1800000000, gasStandard: "EN 1160 LNG Quality", status: "Cryogenic Tank Storage Fill Active", remarks: "Coastal barge LNG to FSRU Hazira - emergency fill" },
  { id: "LNG-0011", batchNo: "LNG-ENN-2025-011", operator: "Indian Oil Ennore Tamil Nadu", zone: "Tamil Nadu Ennore Kattupalli", category: "LNG Truck Loading Bay Iso Container", description: "Ennore terminal ISO tank loading for south India industrial and city gas supply", capacityMTPA: 5, storageVolume: 180000, carrierName: "LNG Vigo", cargoVolume: 165000, origin: "Australia Wheatstone", terminal: "IOCL Ennore", state: "Tamil Nadu", mode: "ISO Tank Container Truck 40T", prodDate: "2025-01-04", shipDate: "2025-01-13", transitDays: 15, contractValue: 4600000000, gasStandard: "NGC LNG Grade A", status: "Truck Loading Dispatch Transit", remarks: "ISO tank truck dispatch from Ennore to Tamil Nadu industries" },
  { id: "LNG-0012", batchNo: "LNG-AHZ-2025-012", operator: "Adani Total Hazira Maharashtra", zone: "Maharashtra Dabhol Trombay", category: "QFlex 266K m3 LNG Carrier Berth", description: "QFlex LNG carrier arriving at Hazira for regasification and pipeline send-out", capacityMTPA: 7, storageVolume: 65000, carrierName: "LNG Odyssey", cargoVolume: 250000, origin: "USA Freeport LNG", terminal: "Adani Total Hazira", state: "Maharashtra", mode: "LNG Carrier QMax 266K m3", prodDate: "2025-01-02", shipDate: "2025-01-14", transitDays: 20, contractValue: 5800000000, gasStandard: "ISO 6976 LNG Spec", status: "Pipeline Transmission Metering QC", remarks: "US Freeport cargo - pipeline QC metering Hazira" },
  { id: "LNG-0013", batchNo: "LNG-KCH-2025-013", operator: "PLL Kochi Kerala LNG", zone: "Kerala Kochi Vizhinjam", category: "Send-Out Gas Pipeline 48 inch 2000km", description: "Kochi terminal gas send-out through Kochi-Mangalore pipeline to Karnataka industries", capacityMTPA: 5, storageVolume: 125000, carrierName: "LNG Nyk Atlas", cargoVolume: 135000, origin: "Egypt Idku", terminal: "PLL Kochi", state: "Kerala", mode: "Cryogenic Pipeline 48 inch", prodDate: "2025-01-05", shipDate: "2025-01-12", transitDays: 11, contractValue: 3100000000, gasStandard: "BIS 16778 LNG", status: "City Gate Distribution Delivered", remarks: "Egypt LNG delivered to Kochi-Mangalore pipeline" },
  { id: "LNG-0014", batchNo: "LNG-DHA-2025-014", operator: "Dhamra LNG Odisha Paradip", zone: "Odisha Dhamra Paradip", category: "Cryogenic Storage Tank 160K m3", description: "Dhamra cryogenic tanks receiving LNG for eastern India steel and fertilizer industries", capacityMTPA: 5, storageVolume: 200000, carrierName: "Pan Americas", cargoVolume: 175000, origin: "USA Cameron LNG", terminal: "Dhamra LNG", state: "Odisha", mode: "Rail LNG Wagon Specialized", prodDate: "2024-12-29", shipDate: "2025-01-11", transitDays: 19, contractValue: 500000000, gasStandard: "NGC LNG Grade A", status: "City Gate Distribution Delivered", remarks: "US Cameron cargo - rail wagon dispatch to Odisha industries" },
];

const totalCapacity = records.reduce((s, r) => s + r.capacityMTPA, 0);
const inTransit = records.filter(r => statusColor[r.status] !== "green" && statusColor[r.status] !== "slate").length;
const delivered = records.filter(r => statusColor[r.status] === "green").length;
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

const kpis = [
  { l: "Total Capacity (MTPA)", v: totalCapacity, s: "aggregate terminal capacity" },
  { l: "In Transit", v: inTransit, s: "active shipments in progress" },
  { l: "Delivered", v: delivered, s: "cargo delivered to destination" },
  { l: "Total Contract", v: formatINR(totalContract), s: "combined contract value" },
];

const INSIGHTS = [
  {
    t: "India 70 MTPA LNG Import Target by 2030",
    c: "India has set an ambitious target of importing 70 Million Tonnes Per Annum (MTPA) of Liquefied Natural Gas (LNG) by 2030, up from approximately 32 MTPA in 2024. This target is driven by India\u2019s commitment to increase the share of natural gas in its primary energy mix from 6.7% to 15% by 2030 as part of its National Gas Grid and energy transition strategy. Key enablers include: (1) Expansion of existing terminals \u2014 Petronet LNG Dahej is being expanded from 17.5 MTPA to 22.5 MTPA, making it India\u2019s largest LNG terminal, (2) New terminal constructions at Jafrabad (Gujarat, 5 MTPA), Muria Island (Gujarat, 5 MTPA FSRU-based), Kakinada (Andhra Pradesh, 5 MTPA), and Tuticorin (Tamil Nadu, 5 MTPA), (3) FSRU-based emergency terminals at Muria and Jafrabad providing rapid-deployment LNG import capability within 12-18 months versus 4-5 years for greenfield terminals, and (4) The Government of India\u2019s National Gas Grid expansion connecting all states with pipeline infrastructure. India\u2019s LNG demand is projected to reach 70-80 MTPA by 2030, driven by city gas distribution (CGD) expansion covering 98% of India\u2019s population, fertilizer sector gasification, industrial fuel switching from coal/oil to gas, and LNG bunkering for maritime shipping. Major long-term LNG supply contracts include Qatar Energy (18 MTPA from North Field expansion), ExxonMobil (5 MTPA from Gorgon/Wheatstone), and ADNOC (1.5 MTPA from Ruwais). The total investment required for India\u2019s LNG infrastructure expansion (terminals, pipelines, FSRUs, storage) is estimated at ₹2,50,000 crore ($30 billion) through 2030.",
  },
  {
    t: "Dahej 17.5 MTPA \u2014 India\u2019s Largest LNG Import Terminal",
    c: "Petronet LNG Limited\u2019s Dahej terminal in Gujarat is India\u2019s largest and most efficient LNG import terminal with a current capacity of 17.5 MTPA, handling approximately 40% of India\u2019s total LNG imports. The terminal, commissioned in 2004, has been expanded in multiple phases from its initial 5 MTPA capacity. Key technical features include: (1) Four (4) cryogenic storage tanks each of 160,000 m3 capacity (total 640,000 m3), providing 12-14 days of storage buffer, (2) Six (6) high-pressure send-out vaporizers with combined regasification capacity of 1,200 MMSCMD, (3) Two (2) dedicated LNG carrier berths capable of handling QFlex (266,000 m3) and QMax (266,000 m3) class vessels, (4) BOG (Boil-Off Gas) reliquefaction unit with 10 tonnes/hour capacity minimizing LNG evaporation losses to 0.05%/day, (5) 48-inch diameter pipeline connection to the National Gas Grid (Dahej-Vijaipur 1,375 km pipeline), and (6) LNG truck loading bays for ISO container dispatch to non-pipeline connected areas. The terminal processes an average of 45-50 LNG cargo parcels per year, primarily from Qatar\u2019s North Field (75%), Australia\u2019s Gorgon (15%), and spot market purchases (10%). Dahej terminal achieved a record 17.8 MTPA throughput in FY2024 with 99.6% availability factor. The terminal\u2019s expansion to 22.5 MTPA (Phase-V) is under construction with commissioning expected by Q2 2027, involving addition of a fifth 180,000 m3 cryogenic tank, two additional vaporizer trains, and a third berthing jetty. Petronet LNG is also developing a new 5 MTPA terminal at Gangavaram, Andhra Pradesh, expected to be commissioned by 2028.",
  },
  {
    t: "FSRU Muria and Jafrabad \u2014 Emergency LNG Import Terminals",
    c: "India is deploying Floating Storage and Regasification Units (FSRUs) at Muria Island (Gujarat) and Jafrabad (Gujarat) as emergency and rapid-deployment LNG import terminals to meet peak demand surges and supply disruptions. FSRU-based terminals offer significant advantages: (1) Faster deployment \u2014 12-18 months from concept to first gas versus 4-5 years for land-based terminals, (2) Lower capital cost \u2014 ₹1,500-2,000 crore ($180-240 million) for 5 MTPA FSRU versus ₹4,000-6,000 crore ($480-720 million) for equivalent land-based terminal, (3) Flexibility \u2014 FSRU can be redeployed to different locations based on demand patterns, and (4) Modular scalability \u2014 additional FSRU vessels can be added to increase capacity. The Muria Island FSRU (5 MTPA) is being developed by Swan Energy with H-Energy and is expected to handle LNG carrier vessels up to QMax class (266,000 m3), with regasified LNG being sent through a 45 km subsea pipeline connecting to the National Gas Grid at Jafrabad. The Jafrabad FSRU terminal (5 MTPA) is a joint venture between Gujarat Maritime Board and Adani Total Gas, planned for commissioning by 2026. India\u2019s existing FSRU experience includes the Shell Energy Hazira FSRU (operational since 2005, 5 MTPA), which processes approximately 3-4 MTPA annually using the FSRU Excellence. The Government of India\u2019s FSRU policy framework, issued by the Ministry of Petroleum and Natural Gas in 2023, provides for single-window environmental and coastal regulation clearances for FSRU projects, recognizing them as strategic energy infrastructure with expedited approval timelines. India\u2019s FSRU fleet strategy targets 15-20 MTPA of FSRU-based import capacity by 2030, providing critical flexibility to manage seasonal demand variations (winter peak demand is 40-50% higher than summer), supply disruption contingencies, and new market development in eastern and southern India.",
  },
  {
    t: "LNG as Bridge Fuel \u2014 India\u2019s Energy Transition Strategy",
    c: "Liquefied Natural Gas (LNG) is positioned as a critical \u201cbridge fuel\u201d in India\u2019s energy transition strategy, serving as a cleaner alternative to coal and oil while renewable energy capacity scales up to meet India\u2019s 500 GW non-fossil fuel target by 2030. India\u2019s National Green Hydrogen Mission (launched January 2023) envisions green hydrogen replacing grey hydrogen (produced from natural gas) in fertilizers, refineries, and steel by 2040, but LNG provides the essential transition pathway: (1) Natural gas emits 50-60% less CO2 than coal and 25-30% less than oil per unit of energy, (2) India\u2019s fertilizer sector (Urea production) consumes 45 MMSCMD of natural gas, which will be met by LNG imports as domestic gas production plateaus at 80-90 MMSCMD, (3) City gas distribution (CGD) expansion replacing LPG for domestic cooking and diesel/CNG for transportation, targeting 100% district coverage by 2030, (4) Industrial fuel switching \u2014 ceramics, glass, and textile industries converting from coal/furnace oil to LNG, driven by pollution control board mandates and carbon pricing mechanisms, and (5) LNG bunkering for coastal and international shipping from Kandla, Mumbai, Kochi, Tuticorin, and Paradip ports. India\u2019s LNG import bill reached ₹1,80,000 crore ($22 billion) in FY2024, making it the 4th largest LNG importer globally after Japan, China, and South Korea. The Government of India is developing a domestic LNG trading hub at Dahej/Gujarat International Finance Tec-City (GIFT City) to establish LNG price discovery and enable hedging instruments for Indian buyers. The LNG bridge fuel strategy is complemented by investments in carbon capture, utilization, and storage (CCUS) at LNG terminals, bio-LNG blending (target: 5% bio-methane by 2030), and small-scale LNG distribution for remote areas via ISO container trucks and rail wagons.",
  },
];

export default function LngTerminalLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(o => ({ value: o, count: records.filter(r => r.operator === o).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "gasStandard", label: "Gas Std", options: GAS_STANDARDS.map(g => ({ value: g, count: records.filter(r => r.gasStandard === g).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function () { const n = { ...p }; n[k] = (p[k] || []).filter(x => x !== v); if (n[k].length === 0) delete n[k]; return n; })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.terminal.toLowerCase().includes(q) && !r.carrierName.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof LngRecord] as string));
  });

  const rowBg = (status: string) => {
    const c = statusColor[status];
    if (c === "red") return "lng-row-critical bg-red-50";
    if (c === "amber") return "lng-row-warning bg-amber-50";
    if (c === "blue") return "lng-row-info bg-blue-50";
    if (c === "green") return "lng-row-success bg-green-50";
    if (c === "orange") return "lng-row-orange bg-orange-50";
    return "";
  };

  return (
    <div className="lng-root p-6 space-y-6">
      <PageHeader title="LNG Terminal Logistics" description="India LNG terminal operations, regasification, cryogenic storage, carrier berthing, pipeline send-out, city gas distribution, and FSRU-based import logistics across Dahej, Hazira, Dabhol, Ennore, Kochi, Dhamra and Mundra terminals" />
      <div className="lng-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`lng-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#0c1e3a] text-white" : "text-gray-600 hover:bg-blue-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="lng-dash space-y-6">
          <div className="lng-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="lng-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 lng-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#1e40af] lng-kpi-val">{k.v}</div><div className="text-xs text-gray-400 lng-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="lng-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly LNG Import Volume (MTPA)</h3><AreaChart data={monthlyImport} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="qflex" stackId="1" stroke="#1e40af" fill="#dbeafe" name="QFlex Carrier" /><Area type="monotone" dataKey="fsru" stackId="1" stroke="#2563eb" fill="#bfdbfe" name="FSRU" /><Area type="monotone" dataKey="pipeline" stackId="1" stroke="#3b82f6" fill="#93c5fd" name="Pipeline" /><Area type="monotone" dataKey="truck" stackId="1" stroke="#60a5fa" fill="#eff6ff" name="Truck" /></AreaChart></div>
            <div className="lng-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Terminal Distribution Share (%)</h3><PieChart width={400} height={220}><Pie data={termDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{termDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="lng-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">LNG Spot Price vs Long-Term ($/MMBtu)</h3><LineChart data={lngPrice} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[5, 22]} /><Tooltip /><Legend /><Line type="monotone" dataKey="spot" stroke="#1e40af" strokeWidth={2} name="Spot Price" /><Line type="monotone" dataKey="longterm" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Long-Term $10.5" /></LineChart></div>
            <div className="lng-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Daily Gas Send-Out by Terminal (MMSCMD)</h3><BarChart data={sendOut} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#2563eb" radius={[4, 4, 0, 0]} name="MMSCMD" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="lng-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "LNG Terminal", href: "#" }, { label: "Cargo Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="lng-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">
              {"ID,Batch No,Operator,Zone,Category,Description,Capacity (MTPA),Storage (m3),Carrier,Cargo (m3),Origin,Terminal,State,Mode,Prod Date,Ship Date,Transit (d),Contract (₹),Gas Std,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}
            </tr></thead>
            <tbody>{filtered.map(r => (
              <tr key={r.id} className={`border-b hover:bg-blue-50/30 ${rowBg(r.status)}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="lng-badge inline-block px-2 py-0.5 rounded text-xs bg-[#0c1e3a] text-white font-mono">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.operator}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.zone}</td>
                <td className="px-3 py-2 text-xs max-w-36 truncate">{r.category}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-48 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.capacityMTPA}</td>
                <td className="px-3 py-2 text-xs text-right">{r.storageVolume.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.carrierName}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.cargoVolume.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.terminal}</td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="px-3 py-2 text-xs text-right"><span className={r.transitDays > 15 ? "text-red-600 font-semibold" : r.transitDays > 10 ? "text-amber-600" : "text-green-600"}>{r.transitDays}</span></td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2 text-xs"><span className="lng-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.gasStandard}</span></td>
                <td className="px-3 py-2"><span className={`lng-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-40 truncate">{r.remarks}</td>
              </tr>
            ))}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="lng-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="lng-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly LNG Import Volume (MTPA)</h3><AreaChart data={monthlyImport} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="qflex" stackId="1" stroke="#1e40af" fill="#dbeafe" name="QFlex Carrier" /><Area type="monotone" dataKey="fsru" stackId="1" stroke="#2563eb" fill="#bfdbfe" name="FSRU" /><Area type="monotone" dataKey="pipeline" stackId="1" stroke="#3b82f6" fill="#93c5fd" name="Pipeline" /><Area type="monotone" dataKey="truck" stackId="1" stroke="#60a5fa" fill="#eff6ff" name="Truck" /></AreaChart></div>
            <div className="lng-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Terminal Distribution Share (%)</h3><PieChart width={400} height={240}><Pie data={termDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={85} label>{termDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="lng-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">LNG Spot Price vs Long-Term ($/MMBtu)</h3><LineChart data={lngPrice} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[5, 22]} /><Tooltip /><Legend /><Line type="monotone" dataKey="spot" stroke="#1e40af" strokeWidth={2} name="Spot Price" /><Line type="monotone" dataKey="longterm" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Long-Term $10.5" /></LineChart></div>
            <div className="lng-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Daily Gas Send-Out by Terminal (MMSCMD)</h3><BarChart data={sendOut} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#2563eb" radius={[4, 4, 0, 0]} name="MMSCMD" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="lng-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="lng-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#0c1e3a] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
