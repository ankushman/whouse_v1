"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1e3a5f", "#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#1d4ed8"];
const OPERATORS = ["Adani Green Energy Ahmedabad", "NTPC Renewable NOIDA", "Vestas Wind India Chennai", "Siemens Gamesa Mumbai", "GE Vernova Pune", "Orient Green Power Chennai", "ReNew Power Gurugram", "Mytrah Energy Hyderabad"];
const CATEGORIES = ["2MW Monopile Fixed 30m Depth", "5MW Jacket Foundation 50m", "10MW Semi-Sub Floating 100m", "3MW Tripod Foundation 40m", "8MW Monopile XXL 35m", "15MW Floating Spar 200m", "4MW Suction Caisson 25m", "6MW Jacket Upgraded 45m"];
const SHIPMENT_STATUSES = ["Monopile Driving Installation", "Transition Piece Bolting", "Nacelle Lift Assembly", "Blade Installation Connection", "Subsea Cable Lay Active", "Turbine Commissioning Export"];
const ZONES = ["Gujarat Pipavav Porbandar Coast", "Tamil Nadu Cuddalore Nagapattinam", "Maharashtra Dhanu Vengurla Coast", "Gujarat Okha Dwarka Offshore", "Andhra Pradesh Kalingapatnam", "Kerala Vizhinjam Kochi", "West Bengal Digha Sagar Island", "Karnataka Udupi Malpe Coast"];
const MODES = ["Heavy Lift Jack-Up 5000T Monopile", "Barge 8000T Transition Piece", "Crane Vessel 3000T Nacelle", "Tugboat Blade Transport", "Cable Layer Vessel 5000T", "Supply Vessel Crew Equipment"];
const TABS = ["Dashboard", "Turbine Registry", "Wind Analytics", "Insights"];

const statusColor: Record<string, string> = { "Monopile Driving Installation": "orange", "Transition Piece Bolting": "orange", "Nacelle Lift Assembly": "blue", "Blade Installation Connection": "blue", "Subsea Cable Lay Active": "blue", "Turbine Commissioning Export": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyInstall = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], monopile: +(3 + Math.sin(i * 0.5) * 2).toFixed(0), jacket: +(2 + Math.cos(i * 0.6) * 1.5).toFixed(0), floating: +(1 + Math.sin(i * 0.4) * 0.8).toFixed(1), cable: +(15 + Math.cos(i * 0.7) * 8).toFixed(0) }));
const foundationDist = [{ n: "Monopile", v: 45 }, { n: "Jacket", v: 20 }, { n: "Floating Semi-Sub", v: 15 }, { n: "Tripod", v: 8 }, { n: "Suction Caisson", v: 7 }, { n: "Floating Spar", v: 5 }];
const lcoeTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], fixed: +(5.2 + Math.sin(i * 0.4) * 0.8).toFixed(1), floating: +(7.5 + Math.cos(i * 0.5) * 1.2).toFixed(1), hybrid: +(6.0 + Math.sin(i * 0.6) * 0.6).toFixed(1) }));
const zoneCapacity = [
  { zone: "GJ", mw: 3000 },
  { zone: "TN", mw: 2000 },
  { zone: "MH", mw: 1500 },
  { zone: "AP", mw: 800 },
  { zone: "KL", mw: 500 },
  { zone: "WB", mw: 300 },
  { zone: "KA", mw: 200 },
  { zone: "OD", mw: 400 }
];

const INSIGHTS = [
  { t: "India\u2019s 30GW Offshore Wind Target by 2030: MNRE Offshore Wind Policy", c: "India has set an ambitious target of 30GW offshore wind energy capacity by 2030 under the National Offshore Wind Energy Policy notified by MNRE in October 2015. The first offshore wind block auction in 2024 allocated 4GW off the coast of Gujarat (2GW) and Tamil Nadu (2GW) to Adani Green, NTPC Renewable, and ReNew Power at discovered tariff levels of \u20b94.50-5.20 per kWh. The Ministry of New and Renewable Energy (MNRE) provides viability gap funding (VGF) of up to 40% of project cost for the first 1GW, along with 100% FDI under automatic route for offshore wind projects. The National Institute of Wind Energy (NIWE) has identified 7,000MW potential off Gujarat coast and 1,000MW off Tamil Nadu coast at depths of 20-50m suitable for fixed-bottom foundations. India\u2019s exclusive economic zone (EEZ) of 2.37 million sq km holds estimated offshore wind potential of 127GW, with 36GW at depths less than 50m and 91GW at transitional depths of 50-200m." },
  { t: "Monopile Foundation Logistics: 5000T Jack-Up Vessels for Indian Offshore Wind", c: "Monopile foundations dominate India\u2019s offshore wind installations with 45% market share due to proven technology and cost effectiveness at 20-40m water depths. Monopiles for Indian offshore wind turbines range from 5m to 9m diameter, 60-90m length, and weigh 800-1,500 tonnes per unit. Installation requires specialized heavy-lift jack-up vessels with 3,000-5,000T crane capacity and 60m+ leg length for seabed penetration. Global jack-up fleet operators including Seaway 7, Van Oord, DEME, and Boskalis are mobilizing vessels for Indian projects. Monopile manufacturing in India is being established at L&T Kattupalli Shipyard (Chennai), Cochin Shipyard, and Bhavani Shipyard (Kerala) with annual capacity of 100+ monopiles. Transportation from fabrication yard to installation site uses flat-top barges with dynamic positioning in 4-12 day towing operations depending on distance and weather windows." },
  { t: "Floating Offshore Wind: Semi-Submersible and Spar Platforms for Deep Water India", c: "Floating offshore wind technology is critical for India\u2019s deep-water wind potential beyond 50m depth, where 91GW of the estimated 127GW offshore wind resource is located. Semi-submersible platforms with 3-4 columns (25-35m draft, 8,000-15,000T displacement) support 10-15MW wind turbines moored by catenary or taut-leg chain-polyester mooring systems. Spar platforms (single cylindrical hull, 80-120m length, 12,000-20,000T displacement) offer superior stability for 15-20MW turbines but require deeper harbors for assembly. India\u2019s first floating wind demonstration project (20MW, 4x5MW turbines) is planned off the coast of Kanyakumari, Tamil Nadu at 100m water depth by NIWE with support from Equinor and Shell. Floating wind LCOE currently ranges from \u20b97.00-9.00 per kWh, expected to decrease to \u20b95.50-6.50 by 2030 with technology maturation and serial production." },
  { t: "Subsea Cable and Array Cable Installation: HVDC Export for Indian Offshore Wind", c: "Subsea cable systems are the critical offshore-to-onshore power transmission link for India\u2019s offshore wind farms, comprising array cables (33kV inter-turbine, 200-500km total per farm) and export cables (220kV AC or 500kV HVDC, 50-200km to shore). HVDC (High Voltage Direct Current) transmission becomes economically favorable for distances exceeding 80km from shore, with converter stations at both ends costing \u20b92,000-3,500 crore per pair. Major cable manufacturers Nexans Norway, Prysmian Italy, and Sumitomo Japan are supplying 3-core XLPE insulated submarine cables with cross-section of 800-1200mm2 for Indian projects. Cable installation vessels (CIVs) with carousels capable of carrying 5,000-8,000T of cable are deployed for simultaneous lay-and-bury operations. Cable burial depth targets of 1.5-2.0m below seabed using ploughing, jetting, or cutting tools protect against anchor drag and fishing gear damage. Cable route surveys using multibeam echosounders, side-scan sonar, and borehole geotechnical investigations are mandatory pre-installation requirements." }
];

interface OWRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; turbineMW: number; waterDepthM: number; foundationT: number; rotorDiamM: number; hubHeightM: number; origin: string; project: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; turbineMake: string; status: string; remarks: string; }

const records: OWRecord[] = [
  { id: "OWI-0001", batchNo: "AGE/AHD/2025/MP-0012", operator: "Adani Green Energy Ahmedabad", zone: "Gujarat Pipavav Porbandar Coast", category: "2MW Monopile Fixed 30m Depth", description: "2MW monopile fixed foundation offshore wind turbine at Pipavav with 30m water depth 6.5m diameter monopile and 33kV array cable connection", turbineMW: 2, waterDepthM: 30, foundationT: 850, rotorDiamM: 120, hubHeightM: 90, origin: "Adani Hazira Shipyard GJ", project: "Pipavav OWF Phase-I 200MW", state: "Gujarat", mode: "Heavy Lift Jack-Up 5000T Monopile", prodDate: "2025-01-10", shipDate: "2025-03-18", transitDays: 5, contractValue: 1200000000, turbineMake: "Vestas V150-2.0", status: "Turbine Commissioning Export", remarks: "2MW monopile Adani Pipavav turbine commission" },
  { id: "OWI-0002", batchNo: "NTP/NOI/2025/JK-0025", operator: "NTPC Renewable NOIDA", zone: "Tamil Nadu Cuddalore Nagapattinam", category: "5MW Jacket Foundation 50m", description: "5MW jacket foundation offshore wind turbine at Cuddalore with 50m depth 4-leg jacket 1200T and 66kV inter-array cable export system", turbineMW: 5, waterDepthM: 50, foundationT: 1200, rotorDiamM: 154, hubHeightM: 105, origin: "L&T Kattupalli Shipyard TN", project: "Cuddalore OWF 500MW", state: "Tamil Nadu", mode: "Barge 8000T Transition Piece", prodDate: "2025-02-15", shipDate: "2025-05-22", transitDays: 3, contractValue: 2800000000, turbineMake: "Siemens SG 5.0-154", status: "Monopile Driving Installation", remarks: "5MW jacket NTPC Cuddalore pile driving active" },
  { id: "OWI-0003", batchNo: "VWT/CHN/2025/FS-0038", operator: "Vestas Wind India Chennai", zone: "Maharashtra Dhanu Vengurla Coast", category: "10MW Semi-Sub Floating 100m", description: "10MW semi-submersible floating wind platform at Vengurla deep water 100m with 3-column semi-sub 12000T and dynamic mooring system", turbineMW: 10, waterDepthM: 100, foundationT: 12000, rotorDiamM: 175, hubHeightM: 130, origin: "Vestas Blade Factory Chennai TN", project: "Vengurla Floating OWF 300MW", state: "Maharashtra", mode: "Crane Vessel 3000T Nacelle", prodDate: "2024-11-05", shipDate: "2025-03-20", transitDays: 8, contractValue: 6500000000, turbineMake: "Vestas V236-10.0", status: "Nacelle Lift Assembly", remarks: "10MW semi-sub Vestas Vengurla nacelle lift" },
  { id: "OWI-0004", batchNo: "SGM/MUM/2025/TP-0042", operator: "Siemens Gamesa Mumbai", zone: "Gujarat Okha Dwarka Offshore", category: "3MW Tripod Foundation 40m", description: "3MW tripod foundation offshore wind turbine at Okha with 40m depth 3-leg tripod 950T and 33kV array cable to onshore substation", turbineMW: 3, waterDepthM: 40, foundationT: 950, rotorDiamM: 132, hubHeightM: 100, origin: "SGRE Navi Mumbai Plant MH", project: "Okha OWF Phase-II 150MW", state: "Gujarat", mode: "Tugboat Blade Transport", prodDate: "2025-03-01", shipDate: "2025-06-15", transitDays: 4, contractValue: 1800000000, turbineMake: "SG 3.4-132", status: "Blade Installation Connection", remarks: "3MW tripod Siemens Okha blade installation" },
  { id: "OWI-0005", batchNo: "GEV/PUN/2025/MX-0055", operator: "GE Vernova Pune", zone: "Andhra Pradesh Kalingapatnam", category: "8MW Monopile XXL 35m", description: "8MW XXL monopile offshore wind turbine at Kalingapatnam with 35m depth 8.5m diameter 1500T monopile and 66kV export cable to shore", turbineMW: 8, waterDepthM: 35, foundationT: 1500, rotorDiamM: 160, hubHeightM: 110, origin: "GE Vernova Pune Plant MH", project: "Kalingapatnam OWF 400MW", state: "Andhra Pradesh", mode: "Heavy Lift Jack-Up 5000T Monopile", prodDate: "2025-02-20", shipDate: "2025-05-10", transitDays: 6, contractValue: 3200000000, turbineMake: "GE Haliade-X 8.0-160", status: "Transition Piece Bolting", remarks: "8MW XXL monopile GE Kalingapatnam TP bolting" },
  { id: "OWI-0006", batchNo: "OGP/CHN/2025/SP-0068", operator: "Orient Green Power Chennai", zone: "Kerala Vizhinjam Kochi", category: "15MW Floating Spar 200m", description: "15MW spar floating platform at Vizhinjam deep water 200m with single-cylinder spar 18000T and catenary mooring chain-polyester system", turbineMW: 15, waterDepthM: 200, foundationT: 18000, rotorDiamM: 230, hubHeightM: 150, origin: "Cochin Shipyard KL", project: "Vizhinjam Floating OWF 600MW", state: "Kerala", mode: "Cable Layer Vessel 5000T", prodDate: "2025-04-15", shipDate: "2025-07-25", transitDays: 10, contractValue: 9800000000, turbineMake: "GE Haliade-X 15.0-230", status: "Subsea Cable Lay Active", remarks: "15MW spar floating OGP Vizhinjam cable lay" },
  { id: "OWI-0007", batchNo: "RNP/GUR/2025/SC-0071", operator: "ReNew Power Gurugram", zone: "West Bengal Digha Sagar Island", category: "4MW Suction Caisson 25m", description: "4MW suction caisson foundation offshore wind turbine at Digha with 25m depth bucket foundation 700T and 33kV cable to Sagar Island substation", turbineMW: 4, waterDepthM: 25, foundationT: 700, rotorDiamM: 140, hubHeightM: 95, origin: "Bhavani Shipyard KL", project: "Digha OWF 100MW", state: "West Bengal", mode: "Supply Vessel Crew Equipment", prodDate: "2025-03-15", shipDate: "2025-05-28", transitDays: 7, contractValue: 850000000, turbineMake: "SG 4.5-140", status: "Turbine Commissioning Export", remarks: "4MW suction caisson ReNew Digha commission" },
  { id: "OWI-0008", batchNo: "MTE/HYD/2025/JU-0084", operator: "Mytrah Energy Hyderabad", zone: "Karnataka Udupi Malpe Coast", category: "6MW Jacket Upgraded 45m", description: "6MW upgraded jacket foundation at Udupi Malpe with 45m depth 4-leg braced jacket 1100T and 66kV array cable to Mangalore onshore grid", turbineMW: 6, waterDepthM: 45, foundationT: 1100, rotorDiamM: 152, hubHeightM: 108, origin: "L&T Hazira Shipyard GJ", project: "Udupi OWF Phase-I 200MW", state: "Karnataka", mode: "Barge 8000T Transition Piece", prodDate: "2024-09-10", shipDate: "2025-02-15", transitDays: 4, contractValue: 1500000000, turbineMake: "Vestas V164-6.0", status: "Subsea Cable Lay Active", remarks: "6MW jacket Mytrah Udupi cable lay active" },
  { id: "OWI-0009", batchNo: "AGE/AHD/2025/MP-0097", operator: "Adani Green Energy Ahmedabad", zone: "Gujarat Pipavav Porbandar Coast", category: "2MW Monopile Fixed 30m Depth", description: "2MW monopile turbine batch-2 at Porbandar with 30m depth 6.5m monopile 850T and 33kV array to Porbandar onshore substation connection", turbineMW: 2, waterDepthM: 30, foundationT: 850, rotorDiamM: 120, hubHeightM: 90, origin: "Adani Hazira Shipyard GJ", project: "Porbandar OWF 150MW", state: "Gujarat", mode: "Heavy Lift Jack-Up 5000T Monopile", prodDate: "2025-01-20", shipDate: "2025-04-05", transitDays: 2, contractValue: 1100000000, turbineMake: "Vestas V150-2.0", status: "Turbine Commissioning Export", remarks: "2MW monopile Adani Porbandar commission" },
  { id: "OWI-0010", batchNo: "NTP/NOI/2025/JK-0108", operator: "NTPC Renewable NOIDA", zone: "Tamil Nadu Cuddalore Nagapattinam", category: "5MW Jacket Foundation 50m", description: "5MW jacket turbine unit-2 at Nagapattinam with 50m depth jacket 1200T and HVDC export cable link to Puducherry onshore converter station", turbineMW: 5, waterDepthM: 50, foundationT: 1200, rotorDiamM: 154, hubHeightM: 105, origin: "L&T Kattupalli Shipyard TN", project: "Nagapattinam OWF 300MW", state: "Tamil Nadu", mode: "Crane Vessel 3000T Nacelle", prodDate: "2025-04-01", shipDate: "2025-06-20", transitDays: 2, contractValue: 2500000000, turbineMake: "Siemens SG 5.0-154", status: "Blade Installation Connection", remarks: "5MW jacket NTPC Nagapattinam blade install" },
  { id: "OWI-0011", batchNo: "VWT/CHN/2025/FS-0115", operator: "Vestas Wind India Chennai", zone: "Maharashtra Dhanu Vengurla Coast", category: "10MW Semi-Sub Floating 100m", description: "10MW semi-sub unit-2 at Dhanu deep water 100m with 3-column semi-sub 12000T and fiber optic data cable integration for SCADA monitoring", turbineMW: 10, waterDepthM: 100, foundationT: 12000, rotorDiamM: 175, hubHeightM: 130, origin: "Vestas Blade Factory Chennai TN", project: "Dhanu Floating OWF 200MW", state: "Maharashtra", mode: "Heavy Lift Jack-Up 5000T Monopile", prodDate: "2024-12-20", shipDate: "2025-04-10", transitDays: 6, contractValue: 6200000000, turbineMake: "Vestas V236-10.0", status: "Nacelle Lift Assembly", remarks: "10MW semi-sub Vestas Dhanu nacelle lift" },
  { id: "OWI-0012", batchNo: "SGM/MUM/2025/TP-0128", operator: "Siemens Gamesa Mumbai", zone: "Gujarat Okha Dwarka Offshore", category: "3MW Tripod Foundation 40m", description: "3MW tripod unit-2 at Dwarka with 40m depth tripod 950T and 33kV cable to Okha onshore substation with environmental monitoring system", turbineMW: 3, waterDepthM: 40, foundationT: 950, rotorDiamM: 132, hubHeightM: 100, origin: "SGRE Navi Mumbai Plant MH", project: "Dwarka OWF 100MW", state: "Gujarat", mode: "Tugboat Blade Transport", prodDate: "2025-03-25", shipDate: "2025-07-05", transitDays: 3, contractValue: 1600000000, turbineMake: "SG 3.4-132", status: "Subsea Cable Lay Active", remarks: "3MW tripod Siemens Dwarka cable lay active" },
  { id: "OWI-0013", batchNo: "GEV/PUN/2025/MX-0132", operator: "GE Vernova Pune", zone: "Andhra Pradesh Kalingapatnam", category: "8MW Monopile XXL 35m", description: "8MW XXL monopile unit-2 at Kalingapatnam with 35m depth 8.5m diameter 1500T monopile and 66kV export cable with fiber optic backup", turbineMW: 8, waterDepthM: 35, foundationT: 1500, rotorDiamM: 160, hubHeightM: 110, origin: "GE Vernova Pune Plant MH", project: "Kalingapatnam Phase-II 300MW", state: "Andhra Pradesh", mode: "Cable Layer Vessel 5000T", prodDate: "2025-02-05", shipDate: "2025-04-12", transitDays: 5, contractValue: 3000000000, turbineMake: "GE Haliade-X 8.0-160", status: "Transition Piece Bolting", remarks: "8MW XXL monopile GE Kalingapatnam TP bolting" },
  { id: "OWI-0014", batchNo: "OGP/CHN/2025/SP-0146", operator: "Orient Green Power Chennai", zone: "Kerala Vizhinjam Kochi", category: "15MW Floating Spar 200m", description: "15MW spar unit-2 at Kochi deep water 200m with spar 18000T and taut-leg mooring system for enhanced stability in Indian Ocean monsoon conditions", turbineMW: 15, waterDepthM: 200, foundationT: 18000, rotorDiamM: 230, hubHeightM: 150, origin: "Cochin Shipyard KL", project: "Kochi Floating OWF 450MW", state: "Kerala", mode: "Supply Vessel Crew Equipment", prodDate: "2025-04-10", shipDate: "2025-06-20", transitDays: 1, contractValue: 9500000000, turbineMake: "GE Haliade-X 15.0-230", status: "Monopile Driving Installation", remarks: "15MW spar OGP Kochi monopile drive active" }
];

export default function OffshoreWindInstallationLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalMW = records.reduce((s, r) => s + r.turbineMW, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const underConstruction = records.filter(r => { const c = statusColor[r.status]; return c !== "green"; }).length;
  const commissioned = records.filter(r => statusColor[r.status] === "green").length;

  const kpis = [
    { l: "Total Turbine MW", v: totalMW, s: "Across " + records.length + " turbine records" },
    { l: "Under Construction", v: underConstruction, s: "Pile driving to cable lay" },
    { l: "Commissioned", v: commissioned, s: "Turbine export active" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "turbineMake", label: "Turbine", options: ["Vestas V150-2.0", "Siemens SG 5.0-154", "Vestas V236-10.0", "SG 3.4-132", "GE Haliade-X 8.0-160", "GE Haliade-X 15.0-230", "SG 4.5-140", "Vestas V164-6.0"].map(t => ({ value: t, count: records.filter(r => r.turbineMake === t).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q) && !r.turbineMake.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof OWRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "MW", "Depth (m)", "Found. (T)", "Rotor (m)", "Hub (m)", "Origin", "Project", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Turbine", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="owi-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Turbine Installations by Foundation Type</h3><BarChart data={monthlyInstall} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="monopile" fill="#1e3a5f" radius={[4,4,0,0]} name="Monopile" /><Bar dataKey="jacket" fill="#1e40af" radius={[4,4,0,0]} name="Jacket" /><Bar dataKey="floating" fill="#3b82f6" radius={[4,4,0,0]} name="Floating" /><Bar dataKey="cable" fill="#60a5fa" radius={[4,4,0,0]} name="Cable (km)" /></BarChart></div>
        <div className="owi-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Foundation Type Distribution (%)</h3><PieChart width={400} height={220}><Pie data={foundationDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{foundationDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="owi-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">LCOE Trend by Technology (\u20b9/kWh)</h3><LineChart data={lcoeTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[3, 10]} /><Tooltip /><Legend /><Line type="monotone" dataKey="fixed" stroke="#1e3a5f" strokeWidth={2} name="Fixed Bottom" /><Line type="monotone" dataKey="floating" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Floating" /><Line type="monotone" dataKey="hybrid" stroke="#60a5fa" strokeWidth={2} strokeDasharray="2 2" name="Hybrid" /></LineChart></div>
        <div className="owi-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Offshore Wind Capacity by Zone (MW)</h3><BarChart data={zoneCapacity} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" /><YAxis /><Tooltip /><Legend /><Bar dataKey="mw" fill="#1e40af" radius={[4,4,0,0]} name="Installed MW" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="owi-root p-6 space-y-6">
      <PageHeader title="Offshore Wind Installation Logistics" description="Indian offshore wind installation logistics covering monopile fixed 2MW jacket 5MW semi-sub floating 10MW tripod 3MW XXL monopile 8MW floating spar 15MW suction caisson 4MW jacket upgraded 6MW with 30-200m water depth HVDC subsea cable 500kV jack-up vessel 5000T nacelle blade transport L&T Kattupalli Cochin Bhavani shipyard across Gujarat Tamil Nadu Maharashtra AP Kerala Karnataka West Bengal 30GW 2030 MNRE target" />
      <div className="owi-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`owi-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#1e3a5f] text-white" : "text-gray-600 hover:bg-blue-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Offshore Wind" }]} />
      {tab === 0 && (
        <div className="owi-dash space-y-6">
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
        <div className="owi-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="owi-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{r.turbineMW}</td><td className="px-3 py-2 text-right">{r.waterDepthM}</td><td className="px-3 py-2 text-right">{r.foundationT.toLocaleString("en-IN")}</td><td className="px-3 py-2 text-right">{r.rotorDiamM}</td><td className="px-3 py-2 text-right">{r.hubHeightM}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.project}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.turbineMake}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="owi-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="owi-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#1e3a5f]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
