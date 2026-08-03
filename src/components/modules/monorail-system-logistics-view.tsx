"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#5b21b6", "#6d28d9", "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#4f46e5", "#6366f1"];
const OPERATORS = ["L&T Monorail Mumbai", "DMRC Monorail Delhi", "Scomi Engineering Malaysia Partner", "Hitachi Rail STS Monorail", "Alstom Monorail Mumbai Line 2", "CRRC Changchun Monorail", "Bombardier Monorail Systems", "MVA Metro Vancouver Partner"];
const CATEGORIES = ["Monorail Beam Guideway 15km Elevated", "Straddle Beam 1.2m Precast Segment", "Monorail Train 4-Car 600 PAX", "Switch Beam Turnout 45 Degree", "Depot Workshop Stabling Facility", "PCS Traction Substation 750V DC", "Station Platform Screen Door PSD", " signalling CBTC Automatic Train Control"];
const SHIPMENT_STATUSES = ["Beam Segment Casting Yard QC", "Guideway Pier Column Erection", "Train Set Assembly Factory", "Track Beam Installation Active", "OCS Traction Power Testing", "Trial Run Revenue Service Active"];
const ZONES = ["Mumbai Chembur Wadala Jacob Circle", "Delhi Shastri Park Trinity Circle", "Hyderabad IT Corridor Raidurg", "Bangalore MG Road Whitefield", "Chennai Tambaram Velachery", "Kolkata Salt Lake Sector V", "Pune Hinjewadi Shivajinagar"];
const MODES = ["Heavy Haul Trailer 60T Beam", "Flatbed 40T Precast Segment", "Rail Flat Wagon 80T Train", "Crane Truck 25T Pier Column", "SPMT 16-Axle 500T Switch Beam", "Multi-Axle 40T Traction Sub"];
const TABS = ["Dashboard", "Train Registry", "Monorail Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Beam Segment Casting Yard QC": "slate", "Guideway Pier Column Erection": "amber", "Train Set Assembly Factory": "blue", "Track Beam Installation Active": "orange", "OCS Traction Power Testing": "red", "Trial Run Revenue Service Active": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyProgress = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], pier: ri(3, 10, 6 + Math.sin(i * 0.5) * 2), beam: ri(5, 14, 9 + Math.cos(i * 0.6) * 2.5), station: ri(1, 4, 2 + Math.sin(i * 0.7) * 1), depot: ri(0, 2, 1 + Math.cos(i * 0.8) * 0.5) }));

const typeDist = [{ n: "Straddle", v: 50 }, { n: "Suspended", v: 15 }, { n: "Hybrid", v: 20 }, { n: "Medium", v: 15 }];

const costPerKm = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(220, 310, 250 + Math.sin(i * 0.5) * 35)).toFixed(0), target: 250 }));

const oemShare = [
  { n: "L&T", v: 35 }, { n: "Scomi", v: 20 }, { n: "Hitachi Rail", v: 18 }, { n: "Alstom", v: 15 }, { n: "CRRC", v: 7 }, { n: "Bombardier", v: 5 }
];

function formatINR(value: number): string {
  if (value >= 10000000) return `\u20b9${(value / 10000000).toFixed(0)}Cr`;
  if (value >= 100000) return `\u20b9${(value / 100000).toFixed(0)}L`;
  if (value >= 1000) return `\u20b9${(value / 1000).toFixed(0)}K`;
  return `\u20b9${value}`;
}

interface MonorailRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; lengthKm: number; stations: number; trainType: string; beamType: string; capacity: number; origin: string; depot: string; city: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; powerSystem: string; status: string; remarks: string; }

const records: MonorailRecord[] = [
  { id: "MNR-0001", batchNo: "BATCH-MNR/2025/07-0401", operator: "L&T Monorail Mumbai", zone: "Mumbai Chembur Wadala Jacob Circle", category: "Monorail Beam Guideway 15km Elevated", description: "Mumbai Monorail Chembur-Wadala elevated guideway beam sections batch delivery", lengthKm: 20, stations: 18, trainType: "Straddle Type 4-Car", beamType: "RC Box Beam 1.2m", capacity: 600, origin: "L&T Casting Yard Powai Mumbai", depot: "Wadala Depot Mumbai", city: "Mumbai", mode: "Heavy Haul Trailer 60T Beam", prodDate: "2025-06-15", shipDate: "2025-07-02", transitDays: 3, contractValue: 5600000000, powerSystem: "750V DC Third Rail", status: "Trial Run Revenue Service Active", remarks: "India first monorail 20.3km Chembur-Wadala-Jacob Circle operational L&T Scomi consortium" },
  { id: "MNR-0002", batchNo: "BATCH-MNR/2025/07-0402", operator: "DMRC Monorail Delhi", zone: "Delhi Shastri Park Trinity Circle", category: "Straddle Beam 1.2m Precast Segment", description: "Delhi Monorail Phase-1 precast straddle beam segments Shastri Park corridor", lengthKm: 15, stations: 12, trainType: "Straddle Type 4-Car", beamType: "PC Precast Segment 1.5m", capacity: 580, origin: "DMRC Precast Yard Narela Delhi", depot: "Shastri Park Depot Delhi", city: "Delhi", mode: "Flatbed 40T Precast Segment", prodDate: "2025-05-20", shipDate: "2025-07-05", transitDays: 5, contractValue: 4200000000, powerSystem: "750V DC Third Rail", status: "Track Beam Installation Active", remarks: "Delhi monorail Phase-1 Shastri Park Trinity Circle 15km beam installation 60% complete" },
  { id: "MNR-0003", batchNo: "BATCH-MNR/2025/07-0403", operator: "Scomi Engineering Malaysia Partner", zone: "Hyderabad IT Corridor Raidurg", category: "Monorail Train 4-Car 600 PAX", description: "Scomi Sutra MRT train set 4-car assembly for Hyderabad IT corridor monorail", lengthKm: 25, stations: 20, trainType: "Suspended Type 3-Car", beamType: "Steel I-Beam 0.8m", capacity: 450, origin: "Scomi Factory Penang Malaysia", depot: "Raidurg Depot Hyderabad", city: "Hyderabad", mode: "Rail Flat Wagon 80T Train", prodDate: "2025-04-10", shipDate: "2025-07-08", transitDays: 12, contractValue: 3800000000, powerSystem: "1500V DC Overhead", status: "Train Set Assembly Factory", remarks: "Scomi Sutra 3-car suspended type monorail train set factory assembly Penang Malaysia" },
  { id: "MNR-0004", batchNo: "BATCH-MNR/2025/07-0404", operator: "Hitachi Rail STS Monorail", zone: "Bangalore MG Road Whitefield", category: "Switch Beam Turnout 45 Degree", description: "Hitachi Rail 45-degree switch beam turnout for Bangalore monorail junction system", lengthKm: 30, stations: 24, trainType: "Hybrid Straddle 6-Car", beamType: "Composite Steel-Concrete", capacity: 800, origin: "Hitachi Rail Factory Kasado Japan", depot: "Whitefield Depot Bangalore", city: "Bangalore", mode: "SPMT 16-Axle 500T Switch Beam", prodDate: "2025-03-25", shipDate: "2025-07-01", transitDays: 18, contractValue: 5100000000, powerSystem: "750V DC Side Rail", status: "Guideway Pier Column Erection", remarks: "Hitachi switch beam turnout 45-degree SPMT transport from Japan port to Bangalore Whitefield" },
  { id: "MNR-0005", batchNo: "BATCH-MNR/2025/07-0405", operator: "Alstom Monorail Mumbai Line 2", zone: "Mumbai Chembur Wadala Jacob Circle", category: "Depot Workshop Stabling Facility", description: "Alstom Monorail Mumbai Line-2 depot workshop stabling facility equipment delivery", lengthKm: 35, stations: 28, trainType: "Straddle Type 4-Car", beamType: "RC Box Beam 1.2m", capacity: 600, origin: "Alstom Factory Sri City AP", depot: "Chembur Depot Mumbai Line-2", city: "Mumbai", mode: "Multi-Axle 40T Traction Sub", prodDate: "2025-05-10", shipDate: "2025-07-06", transitDays: 4, contractValue: 6000000000, powerSystem: "750V DC Third Rail", status: "Track Beam Installation Active", remarks: "Alstom Mumbai Line-2 depot workshop equipment stabling facility 35km 28 stations" },
  { id: "MNR-0006", batchNo: "BATCH-MNR/2025/07-0406", operator: "CRRC Changchun Monorail", zone: "Chennai Tambaram Velachery", category: "PCS Traction Substation 750V DC", description: "CRRC Changchun 750V DC traction substation PCS power equipment Chennai monorail", lengthKm: 12, stations: 10, trainType: "Medium Capacity 2-Car", beamType: "Steel I-Beam 0.8m", capacity: 200, origin: "CRRC Factory Changchun China", depot: "Tambaram Depot Chennai", city: "Chennai", mode: "Crane Truck 25T Pier Column", prodDate: "2025-06-01", shipDate: "2025-07-09", transitDays: 15, contractValue: 1800000000, powerSystem: "750V DC Third Rail", status: "OCS Traction Power Testing", remarks: "CRRC Changchun traction substation 750V DC Chennai 12km medium capacity monorail" },
  { id: "MNR-0007", batchNo: "BATCH-MNR/2025/07-0407", operator: "Bombardier Monorail Systems", zone: "Kolkata Salt Lake Sector V", category: "Station Platform Screen Door PSD", description: "Bombardier PSD platform screen door systems for Kolkata Salt Lake monorail stations", lengthKm: 18, stations: 15, trainType: "Straddle Type 4-Car", beamType: "PC Precast Segment 1.5m", capacity: 600, origin: "Bombardier Factory Pune", depot: "Salt Lake Depot Kolkata", city: "Kolkata", mode: "Flatbed 40T Precast Segment", prodDate: "2025-05-15", shipDate: "2025-07-04", transitDays: 3, contractValue: 2400000000, powerSystem: "750V DC Third Rail", status: "Beam Segment Casting Yard QC", remarks: "Bombardier PSD systems 15 stations Kolkata Salt Lake monorail QC at casting yard" },
  { id: "MNR-0008", batchNo: "BATCH-MNR/2025/07-0408", operator: "MVA Metro Vancouver Partner", zone: "Pune Hinjewadi Shivajinagar", category: " signalling CBTC Automatic Train Control", description: "CBTC automatic train control signalling system Pune Hinjewadi monorail corridor", lengthKm: 22, stations: 16, trainType: "Hybrid Straddle 6-Car", beamType: "Composite Steel-Concrete", capacity: 750, origin: "MVA Tech Hub Vancouver BC", depot: "Hinjewadi Depot Pune", city: "Pune", mode: "Multi-Axle 40T Traction Sub", prodDate: "2025-04-20", shipDate: "2025-07-03", transitDays: 10, contractValue: 3200000000, powerSystem: "Supercap Energy Recovery", status: "Guideway Pier Column Erection", remarks: "MVA Vancouver CBTC signalling Pune Hinjewadi-Shivajinagar 22km monorail corridor" },
  { id: "MNR-0009", batchNo: "BATCH-MNR/2025/07-0409", operator: "L&T Monorail Mumbai", zone: "Mumbai Chembur Wadala Jacob Circle", category: "Monorail Train 4-Car 600 PAX", description: "Additional 4-car monorail train set for Mumbai Line-1 fleet expansion", lengthKm: 20, stations: 18, trainType: "Straddle Type 4-Car", beamType: "RC Box Beam 1.2m", capacity: 600, origin: "L&T Kanshbahal Works Odisha", depot: "Wadala Depot Mumbai", city: "Mumbai", mode: "Heavy Haul Trailer 60T Beam", prodDate: "2025-06-20", shipDate: "2025-07-07", transitDays: 6, contractValue: 450000000, powerSystem: "750V DC Third Rail", status: "Train Set Assembly Factory", remarks: "L&T fleet expansion additional 4-car train set Mumbai monorail Line-1 Wadala depot" },
  { id: "MNR-0010", batchNo: "BATCH-MNR/2025/07-0410", operator: "Hitachi Rail STS Monorail", zone: "Delhi Shastri Park Trinity Circle", category: "Monorail Beam Guideway 15km Elevated", description: "Delhi monorail elevated guideway extension beam sections Shastri Park terminal", lengthKm: 8, stations: 6, trainType: "Suspended Type 3-Car", beamType: "Steel I-Beam 0.8m", capacity: 450, origin: "Hitachi Rail Plant Chennai", depot: "Shastri Park Depot Delhi", city: "Delhi", mode: "Rail Flat Wagon 80T Train", prodDate: "2025-05-28", shipDate: "2025-07-06", transitDays: 2, contractValue: 1200000000, powerSystem: "1500V DC Overhead", status: "OCS Traction Power Testing", remarks: "Delhi monorail extension 8km elevated guideway Hitachi beam sections from Chennai" },
  { id: "MNR-0011", batchNo: "BATCH-MNR/2025/07-0411", operator: "Alstom Monorail Mumbai Line 2", zone: "Hyderabad IT Corridor Raidurg", category: "Switch Beam Turnout 45 Degree", description: "Hyderabad IT corridor monorail switch beam turnout for Hitec City junction", lengthKm: 25, stations: 20, trainType: "Hybrid Straddle 6-Car", beamType: "Composite Steel-Concrete", capacity: 800, origin: "Alstom Factory Savli Gujarat", depot: "Raidurg Depot Hyderabad", city: "Hyderabad", mode: "SPMT 16-Axle 500T Switch Beam", prodDate: "2025-06-05", shipDate: "2025-07-08", transitDays: 5, contractValue: 900000000, powerSystem: "750V DC Side Rail", status: "Track Beam Installation Active", remarks: "Alstom 45-degree switch beam SPMT transport Savli Gujarat to Hyderabad IT corridor" },
  { id: "MNR-0012", batchNo: "BATCH-MNR/2025/07-0412", operator: "CRRC Changchun Monorail", zone: "Bangalore MG Road Whitefield", category: "PCS Traction Substation 750V DC", description: "Bangalore monorail 750V DC traction substation Whitefield corridor power supply", lengthKm: 30, stations: 24, trainType: "Medium Capacity 2-Car", beamType: "PC Precast Segment 1.5m", capacity: 300, origin: "CRRC Factory Changchun China", depot: "Whitefield Depot Bangalore", city: "Bangalore", mode: "Crane Truck 25T Pier Column", prodDate: "2025-04-15", shipDate: "2025-07-10", transitDays: 20, contractValue: 2100000000, powerSystem: "750V DC Third Rail", status: "Beam Segment Casting Yard QC", remarks: "CRRC traction substation 750V DC Bangalore Whitefield 30km corridor from China" },
  { id: "MNR-0013", batchNo: "BATCH-MNR/2025/07-0413", operator: "Bombardier Monorail Systems", zone: "Chennai Tambaram Velachery", category: "Station Platform Screen Door PSD", description: "Chennai monorail PSD installation Tambaram Velachery corridor 10 elevated stations", lengthKm: 12, stations: 10, trainType: "Straddle Type 4-Car", beamType: "RC Box Beam 1.2m", capacity: 600, origin: "Bombardier Factory Gujarat", depot: "Tambaram Depot Chennai", city: "Chennai", mode: "Flatbed 40T Precast Segment", prodDate: "2025-06-10", shipDate: "2025-07-05", transitDays: 2, contractValue: 350000000, powerSystem: "750V DC Third Rail", status: "Trial Run Revenue Service Active", remarks: "Chennai Tambaram Velachery monorail PSD 10 stations trial run revenue service active" },
  { id: "MNR-0014", batchNo: "BATCH-MNR/2025/07-0414", operator: "MVA Metro Vancouver Partner", zone: "Kolkata Salt Lake Sector V", category: " signalling CBTC Automatic Train Control", description: "Kolkata Salt Lake monorail CBTC signalling upgrade Phase-2 automatic train control", lengthKm: 18, stations: 15, trainType: "Hybrid Straddle 6-Car", beamType: "Composite Steel-Concrete", capacity: 700, origin: "MVA Tech Hub Vancouver BC", depot: "Salt Lake Depot Kolkata", city: "Kolkata", mode: "Multi-Axle 40T Traction Sub", prodDate: "2025-05-05", shipDate: "2025-07-09", transitDays: 8, contractValue: 2800000000, powerSystem: "Supercap Energy Recovery", status: "Train Set Assembly Factory", remarks: "MVA CBTC signalling upgrade Kolkata Salt Lake Phase-2 automatic train control system" },
];

const totalNetwork = records.reduce((s, r) => s + r.lengthKm, 0);
const operationalKm = records.filter(r => r.status === "Trial Run Revenue Service Active").reduce((s, r) => s + r.lengthKm, 0);
const underConstructionKm = records.filter(r => r.status !== "Trial Run Revenue Service Active").reduce((s, r) => s + r.lengthKm, 0);
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

const kpis = [
  { l: "Total Network", v: `${totalNetwork} km`, s: "across all corridors" },
  { l: "Under Construction", v: `${underConstructionKm} km`, s: "slate+amber+blue+orange+red" },
  { l: "Operational", v: `${operationalKm} km`, s: "revenue service active" },
  { l: "Total Contract", v: formatINR(totalContract), s: "all monorail projects" },
];

const INSIGHTS = [
  {
    t: "Mumbai Monorail: India\u2019s First 20.3km Chembur-Wadala-Jacob Circle Operational Monorail",
    c: "India\u2019s first and only operational monorail is the Mumbai Monorail, connecting Chembur to Wadala and Jacob Circle (20.3 km, 18 stations). Built by L&T-Scomi consortium, it began operations in 2014 (Chembur-Wadala Phase-1) with full corridor completion in 2019. The monorail uses Scomi Sutra straddle-type technology with 4-car train sets carrying 600 passengers per train. The system runs on 750V DC third rail power, with guideway beams cast at L&T\u2019s Powai casting yard using 1.2m RC box beam sections. Operating challenges include low ridership (15,000-20,000/day vs projected 1.25 lakh), maintenance issues with Scomi rolling stock, and corridor limitations. Despite challenges, the Mumbai Monorail remains a technology demonstrator for urban transit in congested Indian cities. The Monorail India project proved that elevated straddle-beam monorails can navigate sharp 50m radius curves and 6% gradients impossible for conventional metro systems, making them ideal for dense old-city areas where land acquisition is difficult.",
  },
  {
    t: "PM GatiShakti National Monorail Target: 200km Monorail Network by 2030 Across 10+ Cities",
    c: "Under PM GatiShakti National Master Plan and the Metro Rail Policy 2017, India has set an ambitious target of 200+ km of monorail network across 10+ tier-1 and tier-2 cities by 2030. Cities under consideration: Delhi (Phase-2 25km), Bangalore (MG Road-Whitefield 30km), Hyderabad (IT Corridor 25km), Chennai (Tambaram-Velachery 12km), Kolkata (Salt Lake-Sector V 18km), Pune (Hinjewadi-Shivajinagar 22km), Ahmedabad (SG Highway 15km), Kochi (Waterfront 10km), Lucknow (Hazratganj-Gomti Nagar 12km), and Jaipur (Pink City 15km). Estimated total investment: \u20b960,000 crore (USD 7.2 billion). Funding model: 50% central (MOFTH), 30% state, 20% PPP/JICA/AIIB. Monorail cost advantage: \u20b9200-250 crore/km vs metro \u20b9400-600 crore/km, making monorail 50-60% cheaper for medium-capacity corridors (10,000-25,000 PHPDT peak hour). The NITI Aayog has recommended monorails as a Tier-2 city alternative to full metro systems, citing lower construction time (3-4 years vs 6-8 years), smaller footprint (2.5m beam vs 12m metro viaduct), and faster implementation.",
  },
  {
    t: "Monorail Advantages for India\u2019s Congested Cities: Sharp Curves, Steep Gradients, Minimal Land",
    c: "Monorails offer unique advantages for India\u2019s congested urban corridors that conventional metro systems cannot match: (1) Sharp curve negotiation: 50m radius curves (metro requires 150m+), enabling alignment through dense old-city areas without massive demolition. Mumbai\u2019s Jacob Circle section uses 55m radius curves. (2) Steep gradients: 6% grade capability (metro max 3-4%), critical for hill cities and river crossings. (3) Minimal land acquisition: 2.5m wide beam guideway (metro viaduct 10-12m wide), reducing land requirement by 75-80%. Average land acquisition for monorail: 0.5 hectare/km vs metro 2.5 hectares/km. (4) Visual impact: slender single-beam guideway is less visually intrusive, important for heritage zones (Jaipur, Lucknow, Kolkata). (5) Construction speed: precast beam erection 150-200m/day (metro viaduct: 30-40m/day). (6) Noise: rubber tires on beam produce 65-70 dB (metro steel wheel: 80-85 dB). (7) Capacity: modern 6-car straddle monorails carry 800 passengers (comparable to 4-car metro). Disadvantages: lower maximum speed (80 km/h vs 90-100 km/h), limited to medium capacity, and smaller global supply chain. Key monorail manufacturers for India: Scomi Engineering (Malaysia), Hitachi Rail STS (Japan), CRRC Changchun (China), Alstom (France/India), Bombardier (Canada/Germany).",
  },
  {
    t: "Alstom-L&T Partnership: 100km Monorail Expansion for Mumbai Line-2 and New Corridors",
    c: "Alstom Transport India and L&T Construction have formed a strategic partnership targeting 100km of new monorail corridors in India, starting with Mumbai Monorail Line-2 (35km, 28 stations, Chembur to Mira Road extension). The Alstom-L&T combine brings together L&T\u2019s Indian construction expertise (15,000+ engineers, 500+ infrastructure projects) with Alstom\u2019s global monorail technology (Innovia Monorail 300 platform, used in Las Vegas, Sao Paulo, Riyadh). Key terms: (1) Rolling stock: Alstom Innovia Monorail 300, 4-car and 6-car configurations, 600-800 PAX capacity, maximum speed 80 km/h. (2) Signalling: Alstom Urbalis 400 CBTC (90-second headway, ATO GoA2+ automation). (3) Power: 750V DC third rail with regenerative braking (15-20% energy savings). (4) Guideway: L&T-designed RC box beam 1.2m with precast segmental construction at 5 casting yards across Maharashtra. (5) PSD: Alstom-Nabtesco full-height platform screen doors at all 28 stations. (6) Depot: Wadala expanded depot with 200-train stabling capacity, C-1 to C-3 maintenance workshops. Contract value: \u20b96,000 crore for Mumbai Line-2. Timeline: 2025-2029 (48 months construction). Additional corridors under negotiation: Bangalore 30km (\u20b94,500 crore), Hyderabad 25km (\u20b93,800 crore), Pune 22km (\u20b93,200 crore). The partnership targets 100km operational by 2032.",
  },
];

export default function MonorailSystemLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(o => ({ value: o, count: records.filter(rec => rec.operator === o).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "trainType", label: "Train Type", options: ["Straddle Type 4-Car", "Suspended Type 3-Car", "Hybrid Straddle 6-Car", "Medium Capacity 2-Car"].map(t => ({ value: t, count: records.filter(rec => rec.trainType === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.city.toLowerCase().includes(q) && !r.zone.toLowerCase().includes(q) && !r.trainType.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof MonorailRecord] as string));
  });

  const cols = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Length (km)", "Stations", "Train Type", "Beam Type", "Capacity (PAX)", "Origin", "Depot", "City", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Power System", "Status", "Remarks"];

  return (
    <div className="mnr-root p-6 space-y-6">
      <PageHeader title="Monorail System Logistics" description="Indian monorail system logistics covering Mumbai Chembur-Wadala 20.3km first monorail, L&T Scomi Hitachi Alstom CRRC straddle beam guideway, 750V DC traction, CBTC signalling, depot stabling, PM GatiShakti 200km monorail target, elevated beam logistics and urban transit integration" />
      <div className="mnr-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`mnr-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#5b21b6] text-white" : "text-gray-600 hover:bg-violet-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="mnr-dash space-y-6">
          <div className="mnr-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="mnr-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 mnr-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#5b21b6] mnr-kpi-val">{k.v}</div><div className="text-xs text-gray-400 mnr-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="mnr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Construction Progress (Units)</h3><BarChart data={monthlyProgress} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="pier" fill="#5b21b6" radius={[4,4,0,0]} name="Pier" /><Bar dataKey="beam" fill="#7c3aed" radius={[4,4,0,0]} name="Beam" /><Bar dataKey="station" fill="#a78bfa" radius={[4,4,0,0]} name="Station" /><Bar dataKey="depot" fill="#c4b5fd" radius={[4,4,0,0]} name="Depot" /></BarChart></div>
            <div className="mnr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monorail Train Type Distribution</h3><PieChart width={400} height={220}><Pie data={typeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="mnr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost per km (\u20b9Cr) vs \u20b9250Cr Target</h3><LineChart data={costPerKm} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[200, 320]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#5b21b6" strokeWidth={2} name="Actual" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="mnr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">OEM Manufacturer Share (%)</h3><BarChart data={oemShare} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[0, 40]} /><Tooltip /><Bar dataKey="v" fill="#7c3aed" radius={[4,4,0,0]} name="Share %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="mnr-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Monorail System", href: "#" }, { label: "Train Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="mnr-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{cols.map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Beam Segment Casting Yard QC" ? "mnr-row-muted bg-slate-50" : r.status === "Guideway Pier Column Erection" ? "mnr-row-warning bg-amber-50" : r.status === "Train Set Assembly Factory" ? "mnr-row-info bg-blue-50" : r.status === "Track Beam Installation Active" ? "mnr-row-warning bg-orange-50" : r.status === "OCS Traction Power Testing" ? "mnr-row-danger bg-red-50" : r.status === "Trial Run Revenue Service Active" ? "mnr-row-success bg-green-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-violet-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="mnr-badge inline-block px-2 py-0.5 rounded text-xs bg-[#5b21b6] text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.operator}</td>
                <td className="px-3 py-2"><span className="mnr-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="mnr-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.lengthKm}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.stations}</td>
                <td className="px-3 py-2 text-xs">{r.trainType}</td>
                <td className="px-3 py-2 text-xs">{r.beamType}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.capacity}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.depot}</td>
                <td className="px-3 py-2 text-xs">{r.city}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 15 ? "text-red-600" : r.transitDays >= 5 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#5b21b6]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2 text-xs">{r.powerSystem}</td>
                <td className="px-3 py-2"><span className={`mnr-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="mnr-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="mnr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Pier & Beam Installation (Units)</h3><BarChart data={monthlyProgress} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="pier" fill="#5b21b6" radius={[4,4,0,0]} name="Pier" /><Bar dataKey="beam" fill="#7c3aed" radius={[4,4,0,0]} name="Beam" /><Bar dataKey="station" fill="#a78bfa" radius={[4,4,0,0]} name="Station" /><Bar dataKey="depot" fill="#c4b5fd" radius={[4,4,0,0]} name="Depot" /></BarChart></div>
            <div className="mnr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monorail Type Distribution (%)</h3><PieChart width={400} height={240}><Pie data={typeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={85} label>{typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="mnr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost per km Actual vs Target (\u20b9Cr)</h3><LineChart data={costPerKm} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[200, 320]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#5b21b6" strokeWidth={2} name="Actual" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="mnr-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">OEM Monorail Manufacturer Share</h3><BarChart data={oemShare} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[0, 40]} /><Tooltip /><Bar dataKey="v" fill="#7c3aed" radius={[4,4,0,0]} name="Share %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="mnr-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="mnr-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#5b21b6] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
