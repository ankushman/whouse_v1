"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#064e3b", "#065f46", "#047857", "#059669", "#10b981", "#34d399", "#6ee7b7", "#0d9488"];
const OPERATORS = ["Ropeway Infra India Mumbai", "Damodar Ropeways Kolkata", "Usha Breco Ltd Chandigarh", "NPCIL Ropeway Nuclear Site", "Girnar Ropeway Gujarat", "Tarpee Ropeway Mumbai", "BSNL Ropeway Telecom", "KEC Ropeways Nagpur"];
const CATEGORIES = ["Mono Cable Tramway 2-Cabin 30 PAX", "Bicable Gondola 8-Passenger", "3S Tricable Telemix 24 PAX", "Funicular Inclined Lift 100 PAX", "Material Ropeway 5T Haulage", "Jigback Back-and-Forth 40 PAX", " detachable Gondola 10-PAX", "Pulsed Movement Chairlift 4-PAX"];
const SHIPMENT_STATUSES = ["Steel Wire Rope Spooling Factory", "Tower Foundation Anchoring Active", "Cable Tensioning Stringing In Progress", "Cabin Hanger Drive Unit Assembly", "Electrical Control Commissioning", "Trial Run Passenger Service Active"];
const ZONES = ["Himachal Rohtang Solang Manali", "Uttarakhand Auli Rishikesh", "J&K Gulmarg Patnitop", "Gujarat Girnar Somnath", "Sikkim Gangtok Pelling", "West Bengal Darjeeling", "Tamil Nadu Ooty Kodaikanal"];
const MODES = ["Heavy Haul Trailer 40T Tower", "Helicopter Sling 5T Mountain", "Mule Pack Train Remote", "Cableway Material Hoist 2T", "Crane Truck 25T Drive Unit", "Rail Flat Wagon 60T Rope Spool"];
const TABS = ["Dashboard", "Cabin Registry", "Ropeway Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Steel Wire Rope Spooling Factory": "slate", "Tower Foundation Anchoring Active": "amber", "Cable Tensioning Stringing In Progress": "blue", "Cabin Hanger Drive Unit Assembly": "orange", "Electrical Control Commissioning": "red", "Trial Run Passenger Service Active": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyInstall = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], gondola: ri(2, 8, 5 + Math.sin(i * 0.5) * 2), tramway: ri(1, 5, 3 + Math.cos(i * 0.6) * 1.5), funicular: ri(1, 4, 2 + Math.sin(i * 0.7) * 1), material: ri(1, 6, 3 + Math.cos(i * 0.8) * 2) }));

const typeDist = [{ n: "Gondola", v: 30 }, { n: "Tramway", v: 20 }, { n: "Funicular", v: 15 }, { n: "Material", v: 20 }, { n: "Chairlift", v: 10 }, { n: "Jigback", v: 5 }];

const costPerM = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(10, 14, 12 + Math.sin(i * 0.5) * 2)).toFixed(1), target: 10 }));

const stateCapacity = [
  { n: "Himachal", length: 8200 }, { n: "Uttarakhand", length: 5400 }, { n: "J&K", length: 6800 }, { n: "Gujarat", length: 3100 },
  { n: "Sikkim", length: 4200 }, { n: "W.Bengal", length: 2900 }, { n: "T.Nadu", length: 2600 }, { n: "Maharashtra", length: 1800 },
];

function formatINR(value: number): string {
  if (value >= 10000000) return `\u20b9${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `\u20b9${(value / 100000).toFixed(0)}L`;
  if (value >= 1000) return `\u20b9${(value / 1000).toFixed(0)}K`;
  return `\u20b9${value}`;
}

interface RopewayRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; lengthM: number; capacityPAX: number; speedMPS: number; ropeDia: number; towerCount: number; origin: string; site: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; driveType: string; status: string; remarks: string; }

const records: RopewayRecord[] = [
  { id: "CRP-0001", batchNo: "BATCH-CRP/2025/07-0501", operator: "Ropeway Infra India Mumbai", zone: "Himachal Rohtang Solang Manali", category: "3S Tricable Telemix 24 PAX", description: "Rohtang Pass 3S tricable telemix ropeway 2400m Solang Valley tourist circuit", lengthM: 2400, capacityPAX: 24, speedMPS: 8, ropeDia: 54, towerCount: 18, origin: "Ropeway Infra Factory Mumbai", site: "Solang Valley", state: "Himachal Pradesh", mode: "Helicopter Sling 5T Mountain", prodDate: "2025-05-10", shipDate: "2025-07-02", transitDays: 14, contractValue: 850000000, driveType: "Electric DC 500kW", status: "Cable Tensioning Stringing In Progress", remarks: "Rohtang Pass 3S telemix 2400m highest altitude cable car Solang Valley tourist circuit" },
  { id: "CRP-0002", batchNo: "BATCH-CRP/2025/07-0502", operator: "Damodar Ropeways Kolkata", zone: "West Bengal Darjeeling", category: "Bicable Gondola 8-Passenger", description: "Darjeeling bicable gondola 1800m Tiger Hill tourist ropeway replacement", lengthM: 1800, capacityPAX: 8, speedMPS: 5, ropeDia: 42, towerCount: 12, origin: "Damodar Works Kolkata", site: "Tiger Hill", state: "West Bengal", mode: "Heavy Haul Trailer 40T Tower", prodDate: "2025-04-20", shipDate: "2025-07-01", transitDays: 4, contractValue: 320000000, driveType: "AC VFD 750kW", status: "Trial Run Passenger Service Active", remarks: "Darjeeling Tiger Hill bicable gondola 1800m replacement heritage toy train area" },
  { id: "CRP-0003", batchNo: "BATCH-CRP/2025/07-0503", operator: "Usha Breco Ltd Chandigarh", zone: "Himachal Rohtang Solang Manali", category: "Mono Cable Tramway 2-Cabin 30 PAX", description: "Manali Rohtang mono cable reversible tramway 3200m 2-cabin 30 PAX", lengthM: 3200, capacityPAX: 30, speedMPS: 6, ropeDia: 48, towerCount: 22, origin: "Breco Factory Chandigarh", site: "Rohtang Pass", state: "Himachal Pradesh", mode: "Mule Pack Train Remote", prodDate: "2025-06-05", shipDate: "2025-07-08", transitDays: 22, contractValue: 680000000, driveType: "Hydraulic 300kW", status: "Tower Foundation Anchoring Active", remarks: "Rohtang mono cable tramway 3200m high altitude logistics mule pack transport" },
  { id: "CRP-0004", batchNo: "BATCH-CRP/2025/07-0504", operator: "NPCIL Ropeway Nuclear Site", zone: "Uttarakhand Auli Rishikesh", category: "Material Ropeway 5T Haulage", description: "NPCIL material ropeway 4500m 5T haulage for nuclear site construction", lengthM: 4500, capacityPAX: 0, speedMPS: 3, ropeDia: 64, towerCount: 35, origin: "NPCIL Central Workshop", site: "Auli Nuclear Site", state: "Uttarakhand", mode: "Cableway Material Hoist 2T", prodDate: "2025-03-15", shipDate: "2025-07-05", transitDays: 8, contractValue: 1200000000, driveType: "Diesel Backup 200kW", status: "Steel Wire Rope Spooling Factory", remarks: "NPCIL 4500m material ropeway 64mm rope 35 towers nuclear site construction" },
  { id: "CRP-0005", batchNo: "BATCH-CRP/2025/07-0505", operator: "Girnar Ropeway Gujarat", zone: "Gujarat Girnar Somnath", category: "Funicular Inclined Lift 100 PAX", description: "Girnar Hill funicular inclined lift 1100m 100 PAX pilgrim transport", lengthM: 1100, capacityPAX: 100, speedMPS: 4, ropeDia: 40, towerCount: 8, origin: "Girnar Ropeway Works", site: "Girnar Hill Junagadh", state: "Gujarat", mode: "Crane Truck 25T Drive Unit", prodDate: "2025-05-25", shipDate: "2025-07-03", transitDays: 3, contractValue: 450000000, driveType: "Electric DC 500kW", status: "Trial Run Passenger Service Active", remarks: "Girnar Hill funicular 1100m 100 PAX Junagadh pilgrim ropeway operational" },
  { id: "CRP-0006", batchNo: "BATCH-CRP/2025/07-0506", operator: "Tarpee Ropeway Mumbai", zone: "J&K Gulmarg Patnitop", category: " detachable Gondola 10-PAX", description: "Gulmarg detachable gondola 2800m Phase-2 extension world highest cable car", lengthM: 2800, capacityPAX: 10, speedMPS: 6, ropeDia: 46, towerCount: 16, origin: "Tarpee Works Mumbai", site: "Gulmarg Phase-2", state: "Jammu & Kashmir", mode: "Helicopter Sling 5T Mountain", prodDate: "2025-04-10", shipDate: "2025-07-06", transitDays: 18, contractValue: 950000000, driveType: "AC VFD 750kW", status: "Cabin Hanger Drive Unit Assembly", remarks: "Gulmarg Phase-2 detachable gondola 2800m 3979m world highest cable car" },
  { id: "CRP-0007", batchNo: "BATCH-CRP/2025/07-0507", operator: "BSNL Ropeway Telecom", zone: "Sikkim Gangtok Pelling", category: "Material Ropeway 5T Haulage", description: "Sikkim telecom material ropeway 3800m 5T BSNL tower equipment haulage", lengthM: 3800, capacityPAX: 0, speedMPS: 3, ropeDia: 58, towerCount: 28, origin: "BSNL Telecom Stores Kolkata", site: "Gangtok Pelling Corridor", state: "Sikkim", mode: "Cableway Material Hoist 2T", prodDate: "2025-06-12", shipDate: "2025-07-09", transitDays: 12, contractValue: 280000000, driveType: "Diesel Backup 200kW", status: "Tower Foundation Anchoring Active", remarks: "BSNL Sikkim 3800m material ropeway telecom tower equipment mountain haulage" },
  { id: "CRP-0008", batchNo: "BATCH-CRP/2025/07-0508", operator: "KEC Ropeways Nagpur", zone: "Tamil Nadu Ooty Kodaikanal", category: "Pulsed Movement Chairlift 4-PAX", description: "Ooty pulsed movement chairlift 1500m 4-PAX Nilgiri tourist circuit", lengthM: 1500, capacityPAX: 4, speedMPS: 2, ropeDia: 36, towerCount: 10, origin: "KEC Works Nagpur", site: "Ooty Coonoor", state: "Tamil Nadu", mode: "Heavy Haul Trailer 40T Tower", prodDate: "2025-05-30", shipDate: "2025-07-04", transitDays: 5, contractValue: 180000000, driveType: "Electric DC 500kW", status: "Electrical Control Commissioning", remarks: "Ooty Nilgiri chairlift 1500m 4-PAX pulsed movement tourist circuit" },
  { id: "CRP-0009", batchNo: "BATCH-CRP/2025/07-0509", operator: "Ropeway Infra India Mumbai", zone: "Uttarakhand Auli Rishikesh", category: "Jigback Back-and-Forth 40 PAX", description: "Kedarnath jigback ropeway 2500m 40 PAX pilgrim transport system", lengthM: 2500, capacityPAX: 40, speedMPS: 7, ropeDia: 52, towerCount: 15, origin: "Ropeway Infra Factory Mumbai", site: "Kedarnath", state: "Uttarakhand", mode: "Mule Pack Train Remote", prodDate: "2025-04-28", shipDate: "2025-07-07", transitDays: 20, contractValue: 1100000000, driveType: "AC VFD 750kW", status: "Steel Wire Rope Spooling Factory", remarks: "Kedarnath 2.5km jigback 40 PAX pilgrim ropeway Char Dham connectivity" },
  { id: "CRP-0010", batchNo: "BATCH-CRP/2025/07-0510", operator: "Damodar Ropeways Kolkata", zone: "J&K Gulmarg Patnitop", category: "3S Tricable Telemix 24 PAX", description: "Patnitop 3S tricable telemix 2000m 24 PAX tourist ropeway J&K", lengthM: 2000, capacityPAX: 24, speedMPS: 8, ropeDia: 50, towerCount: 14, origin: "Damodar Works Kolkata", site: "Patnitop", state: "Jammu & Kashmir", mode: "Rail Flat Wagon 60T Rope Spool", prodDate: "2025-06-18", shipDate: "2025-07-10", transitDays: 6, contractValue: 520000000, driveType: "Hydraulic 300kW", status: "Cable Tensioning Stringing In Progress", remarks: "Patnitop 3S telemix 2000m 24 PAX J&K tourist ropeway cable tensioning" },
  { id: "CRP-0011", batchNo: "BATCH-CRP/2025/07-0511", operator: "Girnar Ropeway Gujarat", zone: "Gujarat Girnar Somnath", category: "Mono Cable Tramway 2-Cabin 30 PAX", description: "Somnath Temple mono cable tramway 800m 30 PAX coastal pilgrim ropeway", lengthM: 800, capacityPAX: 30, speedMPS: 5, ropeDia: 38, towerCount: 6, origin: "Girnar Ropeway Works", site: "Somnath Temple", state: "Gujarat", mode: "Crane Truck 25T Drive Unit", prodDate: "2025-06-22", shipDate: "2025-07-05", transitDays: 3, contractValue: 95000000, driveType: "Electric DC 500kW", status: "Trial Run Passenger Service Active", remarks: "Somnath Temple 800m mono cable tramway 30 PAX coastal pilgrim ropeway" },
  { id: "CRP-0012", batchNo: "BATCH-CRP/2025/07-0512", operator: "Tarpee Ropeway Mumbai", zone: "Sikkim Gangtok Pelling", category: "Bicable Gondola 8-Passenger", description: "Gangtok Pelling bicable gondola 3600m 8-PAX Sikkim tourist corridor", lengthM: 3600, capacityPAX: 8, speedMPS: 5, ropeDia: 44, towerCount: 24, origin: "Tarpee Works Mumbai", site: "Gangtok Pelling", state: "Sikkim", mode: "Helicopter Sling 5T Mountain", prodDate: "2025-05-15", shipDate: "2025-07-08", transitDays: 16, contractValue: 720000000, driveType: "AC VFD 750kW", status: "Electrical Control Commissioning", remarks: "Sikkim Gangtok Pelling 3600m bicable gondola tourist corridor" },
  { id: "CRP-0013", batchNo: "BATCH-CRP/2025/07-0513", operator: "Usha Breco Ltd Chandigarh", zone: "Himachal Rohtang Solang Manali", category: "Funicular Inclined Lift 100 PAX", description: "Manali Mall Road funicular inclined lift 500m 100 PAX tourist lift", lengthM: 500, capacityPAX: 100, speedMPS: 4, ropeDia: 32, towerCount: 5, origin: "Breco Factory Chandigarh", site: "Manali Mall Road", state: "Himachal Pradesh", mode: "Heavy Haul Trailer 40T Tower", prodDate: "2025-06-28", shipDate: "2025-07-09", transitDays: 4, contractValue: 75000000, driveType: "Hydraulic 300kW", status: "Trial Run Passenger Service Active", remarks: "Manali Mall Road 500m funicular 100 PAX tourist inclined lift operational" },
  { id: "CRP-0014", batchNo: "BATCH-CRP/2025/07-0514", operator: "KEC Ropeways Nagpur", zone: "Tamil Nadu Ooty Kodaikanal", category: " detachable Gondola 10-PAX", description: "Kodaikanal detachable gondola 1800m 10-PAX lake tourist circuit", lengthM: 1800, capacityPAX: 10, speedMPS: 6, ropeDia: 40, towerCount: 12, origin: "KEC Works Nagpur", site: "Kodaikanal Lake", state: "Tamil Nadu", mode: "Rail Flat Wagon 60T Rope Spool", prodDate: "2025-05-08", shipDate: "2025-07-02", transitDays: 5, contractValue: 30000000, driveType: "Electric DC 500kW", status: "Cabin Hanger Drive Unit Assembly", remarks: "Kodaikanal Lake 1800m detachable gondola 10-PAX tourist circuit assembly" },
];

const totalNetwork = records.reduce((s, r) => s + r.lengthM, 0);
const operationalM = records.filter(r => r.status === "Trial Run Passenger Service Active").reduce((s, r) => s + r.lengthM, 0);
const underConstructionM = records.filter(r => r.status !== "Trial Run Passenger Service Active").reduce((s, r) => s + r.lengthM, 0);
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

const kpis = [
  { l: "Total Network", v: `${(totalNetwork / 1000).toFixed(1)} km`, s: "across all ropeway corridors" },
  { l: "Under Construction", v: `${(underConstructionM / 1000).toFixed(1)} km`, s: "non-green statuses" },
  { l: "Operational", v: `${(operationalM / 1000).toFixed(1)} km`, s: "passenger service active" },
  { l: "Total Contract", v: formatINR(totalContract), s: "all ropeway projects" },
];

const INSIGHTS = [
  {
    t: "India 300 Ropeways Target: PM GatiShakti National Ropeway Development Programme",
    c: "India has set an ambitious target of building 300 ropeways across Himalayan and hill states under the PM GatiShakti National Ropeway Development Programme. The Ministry of Road Transport and Highways (MoRTH) has identified 260+ ropeway projects across 13 states and UTs including Himachal Pradesh (52 projects), Uttarakhand (45 projects), Jammu & Kashmir (38 projects), Sikkim (28 projects), West Bengal (22 projects for Darjeeling-Siliguri corridor), Arunachal Pradesh (18 projects), Manipur (12 projects), Mizoram (10 projects), Nagaland (8 projects), Meghalaya (8 projects), Tripura (6 projects), and Tamil Nadu (13 projects for Nilgiri and Kodaikanal). Total estimated investment: \u20b950,000 crore (USD 6 billion). The programme aims to provide last-mile connectivity to remote hill areas, boost tourism (projected 15 crore additional tourist visits/year), reduce road construction costs in mountainous terrain by 60-70%, and cut travel time by 80% for hill communities. Implementation timeline: Phase-1 (2023-2027) 100 ropeways, Phase-2 (2027-2030) 200 ropeways. Key technology: 3S tricable, bicable gondola, jigback, funicular, and mono-cable tramway systems. The Ropeway Act 2024 provides the regulatory framework with single-window clearance through the National Ropeway Authority of India (NRAI). Funding: 40% central (MoRTH), 30% state, 30% PPP/private/concession model with viability gap funding (VGF) up to 40% of project cost.",
  },
  {
    t: "Kedarnath 2.5km Pilgrim Ropeway: Char Dham Connectivity Revolution",
    c: "The Kedarnath ropeway project is a landmark 2.5km jigback ropeway connecting Gaurikund to Kedarnath temple at 3,583m altitude in Uttarakhand's Rudraprayag district. This \u20b91,100 crore project will transport 40 passengers per trip (2 cabins x 20 PAX) at 7 m/s speed, reducing the current 16km 6-hour trek to a 10-minute cable car ride. The project is being executed by Ropeway Infra India Ltd under the Char Dham Highway Project umbrella. Technical specifications: 52mm locked coil steel wire rope, 15 towers (steel lattice type with rock anchoring), AC VFD 750kW drive system, and capacity of 800 PAX/hour each way. Environmental benefits: eliminates 16km of pilgrim foot traffic on the fragile Himalayan ecology, reduces mule dung pollution on the trek route, and enables year-round access (currently closed 6 months due to snow). The ropeway will have climate-controlled cabins with oxygen supply at high altitude. Annual projected pilgrim capacity: 15 lakh (vs current 10 lakh on foot). Challenges: extreme weather conditions (-20\u00b0C winter, 5m snowfall), seismic Zone-V, and limited construction season (April-November). The project includes a 200-person emergency evacuation system and backup diesel generator for power failures. Completion target: 2027. Similar ropeways planned for Badrinath (3.2km), Gangotri (2.8km), and Yamunotri (1.8km) completing the Char Dham ropeway network.",
  },
  {
    t: "Northeast India Connectivity: 50 Ropeway Plan for 8 States",
    c: "The North Eastern Council (NEC) and Ministry of DoNER have approved a comprehensive 50-ropeway plan for 8 northeastern states to transform regional connectivity. The \u20b98,500 crore programme targets: Arunachal Pradesh (10 ropeways including Tawang Monastery 3.5km, Ziro Valley 2.2km, and Bomdila 1.8km), Manipur (8 ropeways including Loktak Lake 2.4km, Kangla Fort 1.2km, and Shirui Lily Peak 2.8km), Mizoram (7 ropeways for Aizawl city connectivity and Hmuifang tourist circuit), Nagaland (6 ropeways including Kohima War Cemetery 1.5km and Dzukou Valley 3.2km), Meghalaya (6 ropeways for Cherrapunji 2.0km, Nohkalikai Falls 1.2km, and Shillong city), Tripura (5 ropeways including Neermahal 1.8km and Ujjayanta Palace 0.8km), Sikkim (4 ropeways supplementing existing Gangtok-Rumtek 3.2km), and Assam (4 ropeways for Kaziranga 2.5km and Kamakhya Temple 1.5km). Technology mix: 60% bicable gondola (8-PAX, most versatile for NE terrain), 20% 3S tricable (high-capacity corridors), 10% jigback (pilgrim/tourist point-to-point), and 10% material ropeways (construction and supply chain). Unique challenges: extreme rainfall (2,500-12,000mm/year), landslide-prone terrain, seismic Zone-V, and limited road access requiring helicopter sling logistics for tower construction. The programme includes cross-border ropeway feasibility studies for Moreh (India-Myanmar) and Dawki (India-Bangladesh) international connectivity.",
  },
  {
    t: "Gulmarg Gondola: World's Highest Cable Car at 3,979m in Jammu & Kashmir",
    c: "The Gulmarg Gondola in Jammu & Kashmir is one of the world's highest cable cars, reaching an elevation of 3,979m (13,050 feet) at Phase-2 Apharwat Peak. This iconic bicable gondola system spans 5.0km across two phases: Phase-1 (Gulmarg to Kongdoori, 2.5km, 1,560m to 3,080m) and Phase-2 (Kongdoori to Apharwat Peak, 2.5km, 3,080m to 3,979m). Operated by the J&K Cable Car Corporation in partnership with French manufacturer POMA, the system features: 8-PASS cabins, 5 m/s operating speed, 46mm steel wire rope diameter, 36 total towers across both phases, and capacity of 600 PAX/hour. The Gulmarg Gondola is India's premier ski resort infrastructure, enabling access to 1,200 hectares of ski terrain and attracting 5 lakh tourists annually including 50,000 foreign visitors. Winter operations: temperatures drop to -25\u00b0C with 8m snowfall, requiring heated cabins, anti-icing rope systems, and avalanche monitoring equipment. The Phase-3 extension project (Apharwat Peak to Alpather Lake, 2.8km additional) is under construction at \u20b9950 crore by Tarpee Ropeways Mumbai, using detachable 10-PAX gondola technology with helicopter sling logistics for tower installation at extreme altitude. The Gulmarg Gondola has been recognized by the Guinness World Records as one of the highest cable car systems globally and serves as a technology demonstrator for India's high-altitude ropeway ambitions across the Himalayas.",
  },
];

export default function CableCarRopewayLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(o => ({ value: o, count: records.filter(rec => rec.operator === o).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "driveType", label: "Drive Type", options: ["Electric DC 500kW", "Hydraulic 300kW", "AC VFD 750kW", "Diesel Backup 200kW"].map(d => ({ value: d, count: records.filter(rec => rec.driveType === d).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.state.toLowerCase().includes(q) && !r.zone.toLowerCase().includes(q) && !r.site.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof RopewayRecord] as string));
  });

  const cols = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Length (m)", "Capacity (PAX)", "Speed (m/s)", "Rope Dia (mm)", "Towers", "Origin", "Site", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Drive Type", "Status", "Remarks"];

  return (
    <div className="crp-root p-6 space-y-6">
      <PageHeader title="Cable Car Ropeway Logistics" description="Indian cable car ropeway logistics covering Rohtang Pass 3S telemix, Gulmarg Gondola world highest 3979m, Kedarnath 2.5km pilgrim ropeway, Girnar funicular, Darjeeling bicable gondola, steel wire rope spooling, tower anchoring, cable tensioning stringing, cabin drive unit assembly, PM GatiShakti 300 ropeways target" />
      <div className="crp-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`crp-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#064e3b] text-white" : "text-gray-600 hover:bg-emerald-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="crp-dash space-y-6">
          <div className="crp-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="crp-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 crp-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#064e3b] crp-kpi-val">{k.v}</div><div className="text-xs text-gray-400 crp-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="crp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Ropeway Installation (Units)</h3><BarChart data={monthlyInstall} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="gondola" fill="#064e3b" radius={[4,4,0,0]} name="Gondola" /><Bar dataKey="tramway" fill="#065f46" radius={[4,4,0,0]} name="Tramway" /><Bar dataKey="funicular" fill="#047857" radius={[4,4,0,0]} name="Funicular" /><Bar dataKey="material" fill="#059669" radius={[4,4,0,0]} name="Material" /></BarChart></div>
            <div className="crp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Ropeway Type Distribution</h3><PieChart width={400} height={220}><Pie data={typeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="crp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost per Metre (\u20b9L/m) vs \u20b910L/m Target</h3><LineChart data={costPerM} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[8, 16]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#064e3b" strokeWidth={2} name="Actual" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="crp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Ropeway Length by State (m)</h3><BarChart data={stateCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="length" fill="#047857" radius={[4,4,0,0]} name="Length (m)" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="crp-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Cable Car Ropeway", href: "#" }, { label: "Cabin Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="crp-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{cols.map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Steel Wire Rope Spooling Factory" ? "crp-row-muted bg-slate-50" : r.status === "Tower Foundation Anchoring Active" ? "crp-row-warning bg-amber-50" : r.status === "Cable Tensioning Stringing In Progress" ? "crp-row-info bg-blue-50" : r.status === "Cabin Hanger Drive Unit Assembly" ? "crp-row-warning bg-orange-50" : r.status === "Electrical Control Commissioning" ? "crp-row-danger bg-red-50" : r.status === "Trial Run Passenger Service Active" ? "crp-row-success bg-green-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-emerald-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="crp-badge inline-block px-2 py-0.5 rounded text-xs bg-[#064e3b] text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.operator}</td>
                <td className="px-3 py-2"><span className="crp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="crp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.lengthM}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.capacityPAX}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.speedMPS}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.ropeDia}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.towerCount}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs">{r.site}</td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 15 ? "text-red-600" : r.transitDays >= 5 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#064e3b]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2 text-xs">{r.driveType}</td>
                <td className="px-3 py-2"><span className={`crp-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="crp-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="crp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Gondola & Tramway Installation (Units)</h3><BarChart data={monthlyInstall} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="gondola" fill="#064e3b" radius={[4,4,0,0]} name="Gondola" /><Bar dataKey="tramway" fill="#065f46" radius={[4,4,0,0]} name="Tramway" /><Bar dataKey="funicular" fill="#047857" radius={[4,4,0,0]} name="Funicular" /><Bar dataKey="material" fill="#059669" radius={[4,4,0,0]} name="Material" /></BarChart></div>
            <div className="crp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Ropeway Type Distribution (%)</h3><PieChart width={400} height={240}><Pie data={typeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={85} label>{typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="crp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost per Metre Actual vs Target (\u20b9L/m)</h3><LineChart data={costPerM} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[8, 16]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#064e3b" strokeWidth={2} name="Actual" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="crp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">State-wise Ropeway Network Length (m)</h3><BarChart data={stateCapacity} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="length" fill="#047857" radius={[4,4,0,0]} name="Length (m)" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="crp-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="crp-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#064e3b] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}