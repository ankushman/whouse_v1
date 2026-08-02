"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#581c87", "#6b21a8", "#7e22ce", "#9333ea", "#a855f7", "#7c3aed", "#8b5cf6", "#c084fc"];
const MANUFACTURERS = ["NPCIL Tarapur Maharashtra", "NPCIL Rawatbhata Rajasthan", "NPCIL Kalpakkam Tamil Nadu", "NPCIL Kakrapar Gujarat", "NPCIL Kudankulam TN", "BHAVINI Kalpakkam Prototype", "GE Hitachi ESBWR Maharashtra", "Westinghouse AP1000 Gujarat"];
const CATEGORIES = ["PWR PHWR 220MW Pressure Tubes", "PWR PHWR 700MW Calandria", "VVER 1000MW Reactor Vessel", "PFBR 500MW Fast Breeder", "ESBWR 1600MW Passive BWR", "AP1000 1200MW Passive PWR", "CANDU 6 Heavy Water Moderator", "Steam Generator Horizontal"];
const SHIPMENT_STATUSES = ["Heavy Component Forge Factory QC", "Special Rail Transport In Transit", "Port Customs Clearance Pending", "Site Foundation Prep Ready", "Reactor Installation Active", "Fuel Loading Commissioning Done"];
const ZONES = ["West India Mumbai Tarapur Gujarat", "South India Chennai Kalpakkam TN", "North India Delhi Rajasthan Rawatbhata", "East India Kolkata Durgapur", "Central India Indore Bhopal MP", "NE India Guwahati Silchar", "Telangana Hyderabad"];
const MODES = ["SPMT Self-Propelled Modular 1200T", "Heavy Haul Rail 300T Wagon", "Barge Coastal 5000T", "C-17 Globemaster III Airlift", "Multi-Axle Trailer 200T", "Crane Barge River 800T"];
const TABS = ["Dashboard", "Component Registry", "Nuclear Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = {
  "Heavy Component Forge Factory QC": "slate",
  "Special Rail Transport In Transit": "blue",
  "Port Customs Clearance Pending": "orange",
  "Site Foundation Prep Ready": "amber",
  "Reactor Installation Active": "red",
  "Fuel Loading Commissioning Done": "green"
};

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

function formatINR(v: number) {
  if (v >= 10000000) return "\u20b9" + (v / 10000000).toFixed(1) + " Cr";
  if (v >= 100000) return "\u20b9" + (v / 100000).toFixed(1) + " L";
  return "\u20b9" + (v / 1000).toFixed(1) + " K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyShipments = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], heavy: ri(2, 12, 6 + Math.sin(i * 0.5) * 3), reactor: ri(1, 5, 3 + Math.cos(i * 0.6) * 1.2), turbine: ri(1, 4, 2 + Math.sin(i * 0.7) * 1), pipe: ri(3, 15, 8 + Math.cos(i * 0.8) * 4) }));
const typeDist = [{ n: "PWR", v: 40 }, { n: "VVER", v: 20 }, { n: "PFBR", v: 15 }, { n: "ESBWR", v: 10 }, { n: "AP1000", v: 10 }, { n: "CANDU", v: 5 }];
const safetyTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +ri(88, 99, 94 + Math.sin(i * 0.4) * 3).toFixed(1), target: 95 }));
const forgeOrigin = ["Larsen Toubro Mumbai", "BHEL Hyderabad", "Doosan South Korea", "Mitsubishi Japan", "Westinghouse USA", "GE Hitachi Japan", "Rosatom Russia", "NPCIL Workshop"].map(n => ({ n: n.split(" ").slice(0, 2).join(" "), v: +ri(82, 98, 90 + Math.random() * 5).toFixed(0) }));

const INSIGHTS = [
  { t: "India\u2019s 3-Stage Nuclear Power Programme & 22,500 MW Target by 2032", c: "India\u2019s Department of Atomic Energy operates a three-stage nuclear programme: Stage 1 uses natural uranium in PHWRs to produce plutonium, Stage 2 employs fast breeder reactors (FBRs) using plutonium-uranium oxide to breed more fuel, and Stage 3 aims for thorium-based reactors leveraging India\u2019s vast monazite sand thorium reserves. NPCIL targets 22,500 MW installed nuclear capacity by 2032 from the current ~7,480 MW across 23 operational reactors, requiring accelerated component manufacturing, heavy forging logistics, and multi-modal transport coordination across 7 nuclear sites and 5 under-construction projects including Kudankulam Units 3-6, Rajasthan APPPs, and Gorakhpur Haryana Anu Vidyut Pariyojana (GHAVP)." },
  { t: "NPCIL PHWR Technology: Indigenous 700MW Design Standardization", c: "NPCIL\u2019s Pressurised Heavy Water Reactor (PHWR) programme represents India\u2019s crown jewel of indigenous nuclear technology. The 220MW PHWR design, operational since Tarapur TAPS-1 in 1969, has been scaled to the standardized 700MW IPHWR-700 design deployed at Kakrapar (Units 3-4), Rajasthan (Units 7-8), and planned at GHAVP Gorakhpur. Key heavy components include 700MW calandria vessels forged at Larsen & Toubro\u2019s Hazira facility, Zr-4 pressure tubes from Nuclear Fuel Complex Hyderabad, and horizontal steam generators from BHEL Hyderabad. The standardization drive reduces per-unit capital cost by 15-20% and compresses construction timelines from 7 years to 5.5 years." },
  { t: "Kudankulam VVER-1000: Indo-Russian Collaboration & Safety Upgrades", c: "The Kudankulam Nuclear Power Project (KNPP) in Tirunelveli district, Tamil Nadu, houses two operational VVER-1000 V-412 pressurized water reactors supplied by Rosatom\u2019s Atomstroyexport under the 1988 Indo-Soviet nuclear agreement. KKNPP-1 (1000 MW) and KKNPP-2 (1000 MW) achieved commercial operation in 2014 and 2017. Units 3-4 are under construction with enhanced VVER-1200 AES-2006 design featuring double containment, core catcher, passive heat removal systems, and aircraft crash resistance. The reactor pressure vessel (320-tonne), steam generators (340 tonnes each), and primary piping are shipped via coastal barge from St. Petersburg via Suez to Tuticorin port, then transported by SPMT to the Kudankulam site." },
  { t: "BHAVINI PFBR 500MW: Prototype Fast Breeder Reactor at Kalpakkam", c: "Bharatiya Nabhikiya Vidyut Nigam Limited (BHAVINI), a PSU under DAE, is constructing the 500 MWe Prototype Fast Breeder Reactor (PFBR) at Indira Gandhi Centre for Atomic Research (IGCAR), Kalpakkam, Tamil Nadu. The PFBR uses mixed oxide (MOX) fuel with plutonium-uranium oxide and liquid sodium as primary and secondary coolant. The reactor vessel is a 6.25m diameter, 12.5m tall cylindrical structure fabricated from SA-240 Type 304L stainless steel. Critical components include the sodium pump, intermediate heat exchanger, and safety-grade decay heat removal system. The project, originally sanctioned at \u20b95,677 crore, represents India\u2019s gateway to Stage 2 of the nuclear programme and is in advanced commissioning phase with first criticality expected soon." }
];

interface ComponentRecord { id: string; batchNo: string; manufacturer: string; zone: string; category: string; description: string; reactorType: string; weight: number; radiationClass: string; forgeCountry: string; origin: string; sitePlant: string; containment: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; nuclearGrade: string; status: string; remarks: string; }

const records: ComponentRecord[] = [
  { id: "NPP-0001", batchNo: "NPCIL/TAPS/2025/BT-0042", manufacturer: "NPCIL Tarapur Maharashtra", zone: "West India Mumbai Tarapur Gujarat", category: "PWR PHWR 220MW Pressure Tubes", description: "Zr-4 pressure tube assembly 6.3m length for TAPS-1 coolant channel replacement", reactorType: "PHWR-220", weight: 4200, radiationClass: "Class B Medium", forgeCountry: "Larsen Toubro Mumbai", origin: "L&T Hazira Works Surat Gujarat", sitePlant: "TAPS Tarapur Atomic Power Station", containment: "Double Containment", mode: "SPMT Self-Propelled Modular 1200T", prodDate: "2025-05-12", shipDate: "2025-06-20", transitDays: 8, contractValue: 185000000, nuclearGrade: "Zirconium Zr-4", status: "Heavy Component Forge Factory QC", remarks: "Zirconium Zr-4 pressure tube TAPS-1 channel replacement L&T Hazira QC" },
  { id: "NPP-0002", batchNo: "NPCIL/RAPS/2025/CL-0118", manufacturer: "NPCIL Rawatbhata Rajasthan", zone: "North India Delhi Rajasthan Rawatbhata", category: "PWR PHWR 700MW Calandria", description: "700MW IPHWR calandria end shield assembly with 392 lattice tube openings", reactorType: "IPHWR-700", weight: 285000, radiationClass: "Class A Low-Level", forgeCountry: "BHEL Hyderabad", origin: "BHEL Heavy Plates Vizag AP", sitePlant: "RAPS Rawatbhata Atomic Power Station", containment: "Double Containment", mode: "Heavy Haul Rail 300T Wagon", prodDate: "2025-04-18", shipDate: "2025-06-25", transitDays: 12, contractValue: 620000000, nuclearGrade: "SA-516 Gr.70", status: "Special Rail Transport In Transit", remarks: "Calandria end shield BHEL Vizag RAPS Unit-7 rail transit 300T" },
  { id: "NPP-0003", batchNo: "NPCIL/MAPS/2025/FB-0027", manufacturer: "NPCIL Kalpakkam Tamil Nadu", zone: "South India Chennai Kalpakkam TN", category: "PFBR 500MW Fast Breeder", description: "500MW PFBR primary sodium pump assembly with mechanical seal and electromagnetic drive", reactorType: "PFBR-500", weight: 38000, radiationClass: "Class C High-Level", forgeCountry: "NPCIL Workshop", origin: "IGCAR Kalpakkam Workshop TN", sitePlant: "PFBR Kalpakkam BHAVINI", containment: "Double Containment", mode: "Crane Barge River 800T", prodDate: "2025-02-10", shipDate: "2025-05-15", transitDays: 3, contractValue: 450000000, nuclearGrade: "Stainless 304L", status: "Reactor Installation Active", remarks: "Primary sodium pump PFBR Kalpakkam IGCAR active installation" },
  { id: "NPP-0004", batchNo: "NPCIL/KAPS/2025/VV-0053", manufacturer: "NPCIL Kakrapar Gujarat", zone: "West India Mumbai Tarapur Gujarat", category: "VVER 1000MW Reactor Vessel", description: "VVER-1000 reactor pressure vessel upper block with lid flange and control rod drive housing", reactorType: "VVER-1000", weight: 185000, radiationClass: "Class A Low-Level", forgeCountry: "Rosatom Russia", origin: "Izhorskiye Zavody St Petersburg Russia", sitePlant: "KAPS Kakrapar Atomic Power Station", containment: "Double Containment", mode: "Barge Coastal 5000T", prodDate: "2025-01-20", shipDate: "2025-05-30", transitDays: 45, contractValue: 1200000000, nuclearGrade: "Nuclear Grade SA-508 Gr.3", status: "Port Customs Clearance Pending", remarks: "RPV upper block Rosatom St Petersburg KAPS port customs" },
  { id: "NPP-0005", batchNo: "NPCIL/KKNPP/2025/SG-0071", manufacturer: "NPCIL Kudankulam TN", zone: "South India Chennai Kalpakkam TN", category: "VVER 1000MW Reactor Vessel", description: "Horizontal steam generator PGV-1000M for KKNPP Unit-3 VVER-1200 AES-2006", reactorType: "VVER-1200", weight: 340000, radiationClass: "Class B Medium", forgeCountry: "Rosatom Russia", origin: "ZiO Podolsk Moscow Russia", sitePlant: "KKNPP Kudankulam Nuclear Power Project", containment: "Mark III Containment", mode: "Barge Coastal 5000T", prodDate: "2024-08-15", shipDate: "2024-12-10", transitDays: 52, contractValue: 980000000, nuclearGrade: "Inconel 690", status: "Fuel Loading Commissioning Done", remarks: "Steam generator PGV-1000M KKNPP-3 Rosatom fuel loading done" },
  { id: "NPP-0006", batchNo: "BHAVINI/PFBR/2025/IHX-0014", manufacturer: "BHAVINI Kalpakkam Prototype", zone: "South India Chennai Kalpakkam TN", category: "PFBR 500MW Fast Breeder", description: "Intermediate heat exchanger shell assembly 16m tall for PFBR secondary sodium circuit", reactorType: "PFBR-500", weight: 52000, radiationClass: "Class C High-Level", forgeCountry: "Larsen Toubro Mumbai", origin: "L&T Powai Works Mumbai MH", sitePlant: "PFBR Kalpakkam BHAVINI", containment: "Double Containment", mode: "Multi-Axle Trailer 200T", prodDate: "2025-03-05", shipDate: "2025-06-10", transitDays: 4, contractValue: 310000000, nuclearGrade: "Stainless 304L", status: "Reactor Installation Active", remarks: "IHX shell assembly PFBR L&T Powai active installation Kalpakkam" },
  { id: "NPP-0007", batchNo: "GEH/ESBWR/2025/RV-0033", manufacturer: "GE Hitachi ESBWR Maharashtra", zone: "West India Mumbai Tarapur Gujarat", category: "ESBWR 1600MW Passive BWR", description: "ESBWR reactor pressure vessel lower head with passive safety injection nozzles", reactorType: "ESBWR-1600", weight: 750000, radiationClass: "Class A Low-Level", forgeCountry: "GE Hitachi Japan", origin: "Japan Steel Works Muroran Hokkaido", sitePlant: "Tarapur ESBWR Proposed Site", containment: "Steel Containment Vessel", mode: "Barge Coastal 5000T", prodDate: "2025-01-08", shipDate: "2025-07-01", transitDays: 60, contractValue: 850000000, nuclearGrade: "Nuclear Grade SA-508 Gr.3", status: "Site Foundation Prep Ready", remarks: "RPV lower head JSW Muroran ESBWR Tarapur foundation prep" },
  { id: "NPP-0008", batchNo: "WEC/AP1000/2025/RV-0045", manufacturer: "Westinghouse AP1000 Gujarat", zone: "West India Mumbai Tarapur Gujarat", category: "AP1000 1200MW Passive PWR", description: "AP1000 reactor vessel assembly with integral pressurizer and direct vessel injection lines", reactorType: "AP1000-1200", weight: 320000, radiationClass: "Class A Low-Level", forgeCountry: "Westinghouse USA", origin: "Doosan Heavy Industries Changwon Korea", sitePlant: "Mithi Virdi AP1000 Proposed Site Gujarat", containment: "Steel Containment Vessel", mode: "Barge Coastal 5000T", prodDate: "2025-02-22", shipDate: "", transitDays: 0, contractValue: 1050000000, nuclearGrade: "Nuclear Grade SA-508 Gr.3", status: "Heavy Component Forge Factory QC", remarks: "AP1000 RPV Doosan Changwon Westinghouse QC pending Mithi Virdi" },
  { id: "NPP-0009", batchNo: "NPCIL/TAPS/2025/HM-0059", manufacturer: "NPCIL Tarapur Maharashtra", zone: "West India Mumbai Tarapur Gujarat", category: "CANDU 6 Heavy Water Moderator", description: "Calandria tube assembly with heavy water moderator headers for TAPS-2 refurbishment", reactorType: "PHWR-220", weight: 85000, radiationClass: "Class B Medium", forgeCountry: "BHEL Hyderabad", origin: "BHEL Bhopal Plant Madhya Pradesh", sitePlant: "TAPS Tarapur Atomic Power Station", containment: "Double Containment", mode: "Heavy Haul Rail 300T Wagon", prodDate: "2025-04-25", shipDate: "2025-07-05", transitDays: 6, contractValue: 145000000, nuclearGrade: "SA-516 Gr.70", status: "Special Rail Transport In Transit", remarks: "Calandria tube BHEL Bhopal TAPS-2 refurbishment rail transit" },
  { id: "NPP-0010", batchNo: "NPCIL/MAPS/2025/SG-0088", manufacturer: "NPCIL Kalpakkam Tamil Nadu", zone: "South India Chennai Kalpakkam TN", category: "Steam Generator Horizontal", description: "Horizontal natural circulation steam generator 12.5m length for MAPS-2 replacement", reactorType: "PHWR-220", weight: 72000, radiationClass: "Class B Medium", forgeCountry: "Mitsubishi Japan", origin: "MHI Kobe Shipyard Hyogo Japan", sitePlant: "MAPS Madras Atomic Power Station", containment: "Double Containment", mode: "Barge Coastal 5000T", prodDate: "2025-03-18", shipDate: "2025-06-28", transitDays: 38, contractValue: 420000000, nuclearGrade: "Inconel 690", status: "Port Customs Clearance Pending", remarks: "Steam generator MHI Kobe MAPS-2 replacement Tuticorin customs" },
  { id: "NPP-0011", batchNo: "NPCIL/RAPS/2025/FE-0066", manufacturer: "NPCIL Rawatbhata Rajasthan", zone: "North India Delhi Rajasthan Rawatbhata", category: "PWR PHWR 700MW Calandria", description: "Fuel channel assembly with 37-element bundle and space relocation mechanism", reactorType: "IPHWR-700", weight: 12500, radiationClass: "Class C High-Level", forgeCountry: "NPCIL Workshop", origin: "NFC Hyderabad Nuclear Fuel Complex", sitePlant: "RAPS Rawatbhata Atomic Power Station", containment: "Double Containment", mode: "Multi-Axle Trailer 200T", prodDate: "2024-11-20", shipDate: "2025-02-15", transitDays: 10, contractValue: 78000000, nuclearGrade: "Zirconium Zr-4", status: "Fuel Loading Commissioning Done", remarks: "Fuel channel 37-bundle NFC Hyderabad RAPS fuel loading done" },
  { id: "NPP-0012", batchNo: "NPCIL/KKNPP/2025/PT-0072", manufacturer: "NPCIL Kudankulam TN", zone: "South India Chennai Kalpakkam TN", category: "PWR PHWR 220MW Pressure Tubes", description: "Primary coolant piping loop 900mm NB sch-80 for KKNPP Unit-4 VVER-1200", reactorType: "VVER-1200", weight: 95000, radiationClass: "Class A Low-Level", forgeCountry: "Doosan South Korea", origin: "Doosan Heavy Industries Changwon", sitePlant: "KKNPP Kudankulam Nuclear Power Project", containment: "Mark III Containment", mode: "Barge Coastal 5000T", prodDate: "2025-05-01", shipDate: "", transitDays: 0, contractValue: 560000000, nuclearGrade: "SA-182 F316", status: "Site Foundation Prep Ready", remarks: "Primary piping 900mm Doosan KKNPP-4 site foundation preparation" },
  { id: "NPP-0013", batchNo: "NPCIL/KAPS/2025/AP-0048", manufacturer: "NPCIL Kakrapar Gujarat", zone: "West India Mumbai Tarapur Gujarat", category: "AP1000 1200MW Passive PWR", description: "Passive containment cooling water storage tank 3000 cubic metre capacity", reactorType: "AP1000-1200", weight: 185000, radiationClass: "Class A Low-Level", forgeCountry: "Larsen Toubro Mumbai", origin: "L&T Kansbahal Works Odisha", sitePlant: "KAPS Kakrapar APPS Unit-5", containment: "Steel Containment Vessel", mode: "SPMT Self-Propelled Modular 1200T", prodDate: "2025-02-28", shipDate: "2025-06-15", transitDays: 14, contractValue: 230000000, nuclearGrade: "SA-516 Gr.70", status: "Reactor Installation Active", remarks: "PCCWST tank L&T Kansbahal KAPS-5 active installation" },
  { id: "NPP-0014", batchNo: "BHAVINI/PFBR/2025/CV-0019", manufacturer: "BHAVINI Kalpakkam Prototype", zone: "South India Chennai Kalpakkam TN", category: "Steam Generator Horizontal", description: "PFBR secondary sodium to water steam generator module with Inconel tubes", reactorType: "PFBR-500", weight: 48000, radiationClass: "Class B Medium", forgeCountry: "Mitsubishi Japan", origin: "Mitsubishi Heavy Industries Nagasaki", sitePlant: "PFBR Kalpakkam BHAVINI", containment: "Double Containment", mode: "Crane Barge River 800T", prodDate: "2025-04-08", shipDate: "", transitDays: 0, contractValue: 290000000, nuclearGrade: "Inconel 690", status: "Heavy Component Forge Factory QC", remarks: "SG module Inconel tubes MHI Nagasaki PFBR QC pending" }
];

export default function NuclearPowerPlantLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const inTransitCount = records.filter(r => statusColor[r.status] === "blue").length;
  const activeInstallCount = records.filter(r => statusColor[r.status] === "red").length;

  const kpis = [
    { l: "Total Components", v: records.length, s: "Across " + MANUFACTURERS.length + " manufacturers" },
    { l: "In Transit", v: inTransitCount, s: "Special rail transport" },
    { l: "Active Installation", v: activeInstallCount, s: "Reactor installation" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate value" }
  ];

  const filterGroups = [
    { key: "manufacturer", label: "Manufacturer", options: MANUFACTURERS.map(m => ({ value: m, count: records.filter(r => r.manufacturer === m).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "nuclearGrade", label: "Nuclear Grade", options: ["Nuclear Grade SA-508 Gr.3", "SA-516 Gr.70", "SA-182 F316", "Inconel 690", "Zirconium Zr-4", "Stainless 304L"].map(g => ({ value: g, count: records.filter(r => r.nuclearGrade === g).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.manufacturer.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.sitePlant.toLowerCase().includes(q) && !r.nuclearGrade.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ComponentRecord] as string));
  });

  const COLS = ["ID","Batch No","Manufacturer","Zone","Category","Description","Reactor Type","Weight (ton)","Radiation Class","Forge Country","Origin","Site Plant","Containment","Mode","Prod Date","Ship Date","Transit (d)","Contract (\u20b9)","Nuclear Grade","Status","Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="npp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Component Shipments</h3><BarChart data={monthlyShipments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="heavy" fill="#581c87" radius={[4,4,0,0]} name="Heavy" /><Bar dataKey="reactor" fill="#7e22ce" radius={[4,4,0,0]} name="Reactor" /><Bar dataKey="turbine" fill="#a855f7" radius={[4,4,0,0]} name="Turbine" /><Bar dataKey="pipe" fill="#c084fc" radius={[4,4,0,0]} name="Pipe" /></BarChart></div>
        <div className="npp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Reactor Type Distribution (%)</h3><PieChart width={400} height={220}><Pie data={typeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="npp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Nuclear Safety Index vs 95% Target</h3><LineChart data={safetyTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[85, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#581c87" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
        <div className="npp-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Forge Supplier Performance Score</h3><BarChart data={forgeOrigin} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[80, 100]} /><Tooltip /><Bar dataKey="v" fill="#7c3aed" radius={[4,4,0,0]} name="Score" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="npp-root p-6 space-y-6">
      <PageHeader title="Nuclear Power Plant Logistics" description="Indian nuclear power plant component logistics for NPCIL BHAVINI covering PHWR 220MW 700MW pressure tubes calandria, VVER-1000 reactor vessel, PFBR 500MW fast breeder, ESBWR 1600MW passive BWR, AP1000 1200MW passive PWR, CANDU 6 heavy water moderator, steam generators with AERB DAE safety compliance and multi-modal SPMT rail barge transport" />
      <div className="npp-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`npp-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#581c87] text-white" : "text-gray-600 hover:bg-purple-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="npp-dashboard space-y-6">
          <div className="npp-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="npp-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 npp-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#581c87] npp-kpi-val">{k.v}</div><div className="text-xs text-gray-400 npp-kpi-sub">{k.s}</div></div>))}
          </div>
          {renderCharts()}
        </div>
      )}

      {tab === 1 && (
        <div className="npp-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Nuclear", href: "#" }, { label: "Component Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="npp-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{COLS.map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const sc = statusColor[r.status] || "";
              const rowCls = sc === "red" ? "bg-red-50 border-l-4 border-l-red-500" : sc === "amber" ? "bg-amber-50 border-l-4 border-l-amber-500" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-500" : sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-orange-500" : "";
              return (<tr key={r.id} className={`border-b hover:bg-purple-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="npp-badge inline-block px-2 py-0.5 rounded text-xs bg-[#581c87] text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.manufacturer}</td>
                <td className="px-3 py-2"><span className="npp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="npp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.reactorType}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{(r.weight / 1000).toFixed(1)}</td>
                <td className="px-3 py-2"><span className={`npp-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${r.radiationClass === "Class C High-Level" ? "bg-red-100 text-red-700" : r.radiationClass === "Class B Medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{r.radiationClass}</span></td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.forgeCountry}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.sitePlant}</td>
                <td className="px-3 py-2"><span className="npp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.containment}</span></td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate || "—"}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 30 ? "text-red-600" : r.transitDays >= 10 ? "text-amber-600" : r.transitDays > 0 ? "text-green-600" : "text-gray-400"}`}>{r.transitDays > 0 ? r.transitDays + "d" : "—"}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#581c87]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2"><span className="npp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.nuclearGrade}</span></td>
                <td className="px-3 py-2"><span className={`npp-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[sc]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="npp-analytics space-y-6">
          {renderCharts()}
        </div>
      )}

      {tab === 3 && (
        <div className="npp-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="npp-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#581c87] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
