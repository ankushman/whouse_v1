"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#292524", "#44403c", "#57534e", "#78716c", "#a8a29e", "#d6d3d1", "#1c1917", "#78716c"];
const DEVELOPERS = ["Larsen Toubro Mumbai HQ", "Afcons Infrastructure Mumbai", "Dilip Buildcon Indore", "Gammon India Mumbai", "Simplex Infrastructures Kolkata", "NCC Limited Hyderabad", "Shapoorji Pallonji Mumbai", "ITD Cementation Mumbai"];
const CATEGORIES = ["Cable-Stayed Bridge 500m Span", "Extradosed Bridge 200m Span", "Steel Truss Railway Bridge 300m", "Box Girder Viaduct 2km Elevated", "Arch Bridge 150m Concrete", "Bowstring Steel Bridge 250m", "Bailey Truss Military Bridge 60m", "Segmental Cantilever 300m River"];
const SHIPMENT_STATUSES = ["Foundation Pile Driving Active", "Pier Column Construction Ongoing", "Steel Girder Erection Transit", "Cable Stay Anchoring Tensioning", "Deck Slab Casting Wet Concrete", "Load Testing Inauguration Ready"];
const ZONES = ["Mumbai Trans Harbour Link", "Bihar Ganga Bridge Patna", "Assam Brahmaputra Bogibeel", "Gujarat Narmada Bridge Bharuch", "JK Chenab Bridge Anji Kotai", "Bengal Hooghly Setu Kolkata", "MP Narmada Golden Bridge"];
const MODES = ["Heavy Haul Trailer 100T Girder", "Barge Marine 5000T Segment", "Crane Barge River 300T", "Rail Wagon 80T Steel Truss", "Self-Launching Movable Scaffolding", "Twin Boom Gantry Crane 60T"];
const TABS = ["Dashboard", "Bridge Registry", "Bridge Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Foundation Pile Driving Active": "slate", "Pier Column Construction Ongoing": "blue", "Steel Girder Erection Transit": "amber", "Cable Stay Anchoring Tensioning": "orange", "Deck Slab Casting Wet Concrete": "red", "Load Testing Inauguration Ready": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyProgress = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], foundation: ri(2, 8, 5 + Math.sin(i * 0.5) * 3), pier: ri(1, 6, 3 + Math.cos(i * 0.6) * 2), girder: ri(1, 5, 3 + Math.sin(i * 0.7) * 2), deck: ri(1, 4, 2 + Math.cos(i * 0.8) * 1.5) }));

const bridgeTypeDist = [{ n: "Cable Stay", v: 25 }, { n: "Box Girder", v: 30 }, { n: "Steel Truss", v: 15 }, { n: "Arch", v: 10 }, { n: "Extradosed", v: 10 }, { n: "Bowstring", v: 10 }];

const costPerM = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(12, 18, 15 + Math.sin(i * 0.5) * 3)).toFixed(1), target: 15 }));

const developerPortfolio = [
  { n: "L&T Mumbai", length: 21580 }, { n: "Afcons Mumbai", length: 5240 }, { n: "Dilip Indore", length: 3200 }, { n: "Gammon Mumbai", length: 2800 },
  { n: "Simplex Kolkata", length: 1500 }, { n: "NCC Hyderabad", length: 4100 }, { n: "SP Mumbai", length: 2600 }, { n: "ITD Mumbai", length: 3600 },
];

function formatINR(value: number): string {
  if (value >= 10000000) return `\u20b9${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `\u20b9${(value / 100000).toFixed(0)}L`;
  if (value >= 1000) return `\u20b9${(value / 1000).toFixed(0)}K`;
  return `\u20b9${value}`;
}

interface BridgeRecord { id: string; batchNo: string; developer: string; zone: string; category: string; description: string; spanM: number; lengthM: number; widthM: number; deckType: string; foundationType: string; origin: string; site: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; riverCrossing: string; status: string; remarks: string; }

const records: BridgeRecord[] = [
  { id: "BRC-0001", batchNo: "BATCH-BRC/2025/07-0501", developer: "Larsen Toubro Mumbai HQ", zone: "Mumbai Trans Harbour Link", category: "Cable-Stayed Bridge 500m Span", description: "MTHL India longest sea bridge 21.58km cable-stayed connecting Sewri to Nhava Sheva across Thane Creek and Ulhas River estuary with 6-lane access-controlled expressway", spanM: 500, lengthM: 21580, widthM: 27, deckType: "Steel Orthotropic", foundationType: "Well Foundation 30m Deep", origin: "L&T Hazira Yard Gujarat", site: "Sewri Nhava Sheva", state: "Maharashtra", mode: "Barge Marine 5000T Segment", prodDate: "2024-11-15", shipDate: "2025-01-20", transitDays: 8, contractValue: 18000000000, riverCrossing: "Ulhas River MTHL", status: "Load Testing Inauguration Ready", remarks: "MTHL 21.58km India longest sea bridge cable-stayed 500m main span steel orthotropic deck 18000Cr" },
  { id: "BRC-0002", batchNo: "BATCH-BRC/2025/07-0502", developer: "Afcons Infrastructure Mumbai", zone: "Assam Brahmaputra Bogibeel", category: "Steel Truss Railway Bridge 300m", description: "Bogibeel rail-cum-road bridge 4.94km over Brahmaputra River near Dibrugarh Assam longest rail-cum-road bridge in India with double-wide Warren truss", spanM: 300, lengthM: 4940, widthM: 24, deckType: "Steel Truss Deck", foundationType: "Well Foundation 30m Deep", origin: "Afcons Yard Mumbai", site: "Bogibeel Dibrugarh", state: "Assam", mode: "Barge Marine 5000T Segment", prodDate: "2025-02-10", shipDate: "2025-04-15", transitDays: 18, contractValue: 5900000000, riverCrossing: "Brahmaputra Bogibeel", status: "Load Testing Inauguration Ready", remarks: "Bogibeel 4.94km rail-cum-road Brahmaputra longest steel truss bridge Assam 5900Cr" },
  { id: "BRC-0003", batchNo: "BATCH-BRC/2025/07-0503", developer: "Afcons Infrastructure Mumbai", zone: "JK Chenab Bridge Anji Kotai", category: "Arch Bridge 150m Concrete", description: "Chenab Bridge world highest rail bridge 359m above riverbed arch span 467m steel truss arch connecting Bakkal to Kauri in Reasi district J&K USBRL project", spanM: 150, lengthM: 1315, widthM: 18, deckType: "Steel Truss Deck", foundationType: "Caisson Pneumatic 40m", origin: "Afcons Workshop J&K", site: "Bakkal Kauri Reasi", state: "Jammu & Kashmir", mode: "Crane Barge River 300T", prodDate: "2025-01-05", shipDate: "2025-03-10", transitDays: 25, contractValue: 1480000000, riverCrossing: "Chenab River Anji", status: "Cable Stay Anchoring Tensioning", remarks: "Chenab Bridge world highest rail 359m 467m arch span USBRL 1480Cr J&K" },
  { id: "BRC-0004", batchNo: "BATCH-BRC/2025/07-0504", developer: "Gammon India Mumbai", zone: "Bihar Ganga Bridge Patna", category: "Extradosed Bridge 200m Span", description: "Patna Ganga extradosed bridge 5.63km with 200m main span prestressed concrete box girder connecting Kachchi Dargah to Bidupur across River Ganga Bihar", spanM: 200, lengthM: 5630, widthM: 24, deckType: "PreStressed Concrete Box", foundationType: "Pile Foundation 60m", origin: "Gammon Yard Patna", site: "Kachchi Dargah Bidupur", state: "Bihar", mode: "Crane Barge River 300T", prodDate: "2025-03-20", shipDate: "2025-06-05", transitDays: 10, contractValue: 3100000000, riverCrossing: "Ganga River Patna", status: "Pier Column Construction Ongoing", remarks: "Patna Ganga 5.63km extradosed 200m span pile foundation 60m Bihar 3100Cr" },
  { id: "BRC-0005", batchNo: "BATCH-BRC/2025/07-0505", developer: "Dilip Buildcon Indore", zone: "Gujarat Narmada Bridge Bharuch", category: "Box Girder Viaduct 2km Elevated", description: "Narmada Golden Bridge Bharuch 1.4km elevated box girder viaduct 6-lane replacing century-old rail-road bridge over Narmada River on NH-48", spanM: 120, lengthM: 1400, widthM: 24, deckType: "Composite Steel-Concrete", foundationType: "Open Foundation Rock", origin: "Dilip Buildcon Yard Indore", site: "Bharuch NH-48", state: "Gujarat", mode: "Heavy Haul Trailer 100T Girder", prodDate: "2025-04-10", shipDate: "2025-06-15", transitDays: 5, contractValue: 1200000000, riverCrossing: "Narmada River Bharuch", status: "Steel Girder Erection Transit", remarks: "Narmada Golden Bridge 1.4km box girder 6-lane NH-48 Bharuch 1200Cr" },
  { id: "BRC-0006", batchNo: "BATCH-BRC/2025/07-0506", developer: "Shapoorji Pallonji Mumbai", zone: "Bengal Hooghly Setu Kolkata", category: "Bowstring Steel Bridge 250m", description: "Hooghly Setu Kona Expressway bowstring steel arch bridge 2.2km with 250m main span over Hooghly River connecting Kona to Budge Budge Kolkata West Bengal", spanM: 250, lengthM: 2200, widthM: 22, deckType: "Steel Orthotropic", foundationType: "Well Foundation 30m Deep", origin: "SP Works Mumbai", site: "Kona Budge Budge", state: "West Bengal", mode: "Barge Marine 5000T Segment", prodDate: "2025-02-28", shipDate: "2025-05-12", transitDays: 12, contractValue: 2600000000, riverCrossing: "Hooghly River Kolkata", status: "Deck Slab Casting Wet Concrete", remarks: "Hooghly Setu 2.2km bowstring 250m steel arch Kona Expressway Kolkata 2600Cr" },
  { id: "BRC-0007", batchNo: "BATCH-BRC/2025/07-0507", developer: "NCC Limited Hyderabad", zone: "MP Narmada Golden Bridge", category: "Box Girder Viaduct 2km Elevated", description: "Narmada Bridge Mandla 2.7km elevated box girder viaduct across Narmada River near Mandla Madhya Pradesh 4-lane NH connectivity Jabalpur corridor", spanM: 100, lengthM: 2700, widthM: 20, deckType: "PreStressed Concrete Box", foundationType: "Pile Foundation 60m", origin: "NCC Yard Hyderabad", site: "Mandla Narmada", state: "Madhya Pradesh", mode: "Twin Boom Gantry Crane 60T", prodDate: "2025-05-10", shipDate: "2025-07-08", transitDays: 7, contractValue: 1800000000, riverCrossing: "Narmada River Bharuch", status: "Foundation Pile Driving Active", remarks: "Narmada Mandla 2.7km box girder 4-lane pile 60m MP 1800Cr" },
  { id: "BRC-0008", batchNo: "BATCH-BRC/2025/07-0508", developer: "Simplex Infrastructures Kolkata", zone: "JK Chenab Bridge Anji Kotai", category: "Bailey Truss Military Bridge 60m", description: "Anji Khad military Bailey truss bridge 60m for BRO strategic access connecting Reasi to Anji in J&K Chenab corridor with rapid deployment capability", spanM: 60, lengthM: 320, widthM: 12, deckType: "Steel Truss Deck", foundationType: "Open Foundation Rock", origin: "Simplex Yard Kolkata", site: "Anji Khad Reasi", state: "Jammu & Kashmir", mode: "Heavy Haul Trailer 100T Girder", prodDate: "2025-06-01", shipDate: "2025-07-10", transitDays: 20, contractValue: 200000000, riverCrossing: "Chenab River Anji", status: "Steel Girder Erection Transit", remarks: "Anji Khad Bailey truss 60m military BRO J&K rapid deployment 200Cr" },
  { id: "BRC-0009", batchNo: "BATCH-BRC/2025/07-0509", developer: "ITD Cementation Mumbai", zone: "Gujarat Narmada Bridge Bharuch", category: "Segmental Cantilever 300m River", description: "Narmada Bharuch segmental cantilever bridge 1.8km 300m main span across Narmada River with balanced cantilever construction for NH-48 6-lane expansion", spanM: 300, lengthM: 1800, widthM: 28, deckType: "Composite Steel-Concrete", foundationType: "Caisson Pneumatic 40m", origin: "ITD Yard Mumbai", site: "Bharuch Narmada", state: "Gujarat", mode: "Self-Launching Movable Scaffolding", prodDate: "2025-03-15", shipDate: "2025-06-01", transitDays: 6, contractValue: 2200000000, riverCrossing: "Narmada River Bharuch", status: "Cable Stay Anchoring Tensioning", remarks: "Narmada Bharuch 1.8km segmental cantilever 300m NH-48 expansion 2200Cr" },
  { id: "BRC-0010", batchNo: "BATCH-BRC/2025/07-0510", developer: "Larsen Toubro Mumbai HQ", zone: "Bihar Ganga Bridge Patna", category: "Cable-Stayed Bridge 500m Span", description: "Patna-Digha Ganga cable-stayed bridge 3.2km 500m main span steel orthotropic deck parallel to existing Mahatma Gandhi Setu 4-lane expressway Bihar", spanM: 500, lengthM: 3200, widthM: 36, deckType: "Steel Orthotropic", foundationType: "Well Foundation 30m Deep", origin: "L&T Hazira Yard Gujarat", site: "Patna Digha Ganga", state: "Bihar", mode: "Rail Wagon 80T Steel Truss", prodDate: "2025-04-25", shipDate: "2025-07-02", transitDays: 14, contractValue: 8200000000, riverCrossing: "Ganga River Patna", status: "Pier Column Construction Ongoing", remarks: "Patna-Digha 3.2km cable-stayed 500m Ganga L&T 8200Cr Bihar" },
  { id: "BRC-0011", batchNo: "BATCH-BRC/2025/07-0511", developer: "Dilip Buildcon Indore", zone: "Bengal Hooghly Setu Kolkata", category: "Steel Truss Railway Bridge 300m", description: "Hooghly rail bridge 1.6km steel truss railway bridge over Hooghly River near Naihati Kolkata Sealdah division Eastern Railway with 300m main truss span", spanM: 300, lengthM: 1600, widthM: 16, deckType: "Steel Truss Deck", foundationType: "Pile Foundation 60m", origin: "Dilip Buildcon Yard Indore", site: "Naihati Hooghly", state: "West Bengal", mode: "Rail Wagon 80T Steel Truss", prodDate: "2025-05-20", shipDate: "2025-07-05", transitDays: 8, contractValue: 2800000000, riverCrossing: "Hooghly River Kolkata", status: "Deck Slab Casting Wet Concrete", remarks: "Hooghly Naihati 1.6km steel truss railway 300m span 2800Cr Kolkata" },
  { id: "BRC-0012", batchNo: "BATCH-BRC/2025/07-0512", developer: "NCC Limited Hyderabad", zone: "Mumbai Trans Harbour Link", category: "Box Girder Viaduct 2km Elevated", description: "MTHL approach viaduct 2.1km elevated box girder connecting Nhava Sheva to Uran road network 4-lane composite steel-concrete viaduct MTHL project", spanM: 80, lengthM: 2100, widthM: 22, deckType: "Composite Steel-Concrete", foundationType: "Pile Foundation 60m", origin: "NCC Yard Hyderabad", site: "Nhava Sheva Uran", state: "Maharashtra", mode: "Heavy Haul Trailer 100T Girder", prodDate: "2025-04-05", shipDate: "2025-06-10", transitDays: 6, contractValue: 1900000000, riverCrossing: "Ulhas River MTHL", status: "Steel Girder Erection Transit", remarks: "MTHL approach viaduct 2.1km box girder Nhava Sheva Uran 1900Cr" },
  { id: "BRC-0013", batchNo: "BATCH-BRC/2025/07-0513", developer: "Gammon India Mumbai", zone: "Assam Brahmaputra Bogibeel", category: "Arch Bridge 150m Concrete", description: "Brahmaputra concrete arch bridge 1.2km 150m main span near Dhubri Assam for NH-127 connectivity between Assam and Meghalaya across Brahmaputra", spanM: 150, lengthM: 1200, widthM: 18, deckType: "RC Solid Slab", foundationType: "Spread Footing", origin: "Gammon Yard Guwahati", site: "Dhubri Brahmaputra", state: "Assam", mode: "Crane Barge River 300T", prodDate: "2025-06-08", shipDate: "2025-07-12", transitDays: 10, contractValue: 950000000, riverCrossing: "Brahmaputra Bogibeel", status: "Foundation Pile Driving Active", remarks: "Dhubri Brahmaputra 1.2km arch 150m NH-127 Assam 950Cr" },
  { id: "BRC-0014", batchNo: "BATCH-BRC/2025/07-0514", developer: "Shapoorji Pallonji Mumbai", zone: "MP Narmada Golden Bridge", category: "Extradosed Bridge 200m Span", description: "Narmada Jabalpur extradosed bridge 2.4km 200m main span connecting Jabalpur to Mandla across Narmada River 4-lane NH-45 with preStressed concrete box deck", spanM: 200, lengthM: 2400, widthM: 20, deckType: "PreStressed Concrete Box", foundationType: "Well Foundation 30m Deep", origin: "SP Works Mumbai", site: "Jabalpur Narmada", state: "Madhya Pradesh", mode: "Twin Boom Gantry Crane 60T", prodDate: "2025-05-18", shipDate: "2025-07-09", transitDays: 9, contractValue: 1600000000, riverCrossing: "Narmada River Bharuch", status: "Pier Column Construction Ongoing", remarks: "Jabalpur Narmada 2.4km extradosed 200m 4-lane NH-45 1600Cr MP" },
];

const totalLength = records.reduce((s, r) => s + r.lengthM, 0);
const underConstruction = records.filter(r => r.status !== "Load Testing Inauguration Ready").reduce((s, r) => s + r.lengthM, 0);
const readyLength = records.filter(r => r.status === "Load Testing Inauguration Ready").reduce((s, r) => s + r.lengthM, 0);
const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

const kpis = [
  { l: "Total Bridge Length", v: `${(totalLength / 1000).toFixed(1)} km`, s: "across all bridge projects" },
  { l: "Under Construction", v: `${(underConstruction / 1000).toFixed(1)} km`, s: "non-green statuses" },
  { l: "Ready", v: `${(readyLength / 1000).toFixed(1)} km`, s: "inauguration ready" },
  { l: "Total Contract", v: formatINR(totalContract), s: "all bridge projects" },
];

const INSIGHTS = [
  {
    t: "Mumbai Trans Harbour Link (MTHL): India's Longest Sea Bridge at 21.8km",
    c: "The Mumbai Trans Harbour Link (MTHL), also known as Atal Setu, is India's longest sea bridge at 21.8km (21,580 metres), connecting Sewri in Mumbai to Nhava Sheva in Navi Mumbai across Thane Creek and the Ulhas River estuary. Inaugurated in January 2024, this ₹18,000 crore engineering marvel features a 500-metre cable-stayed main span with steel orthotropic deck, constructed by L&T under the MMRDA. The 6-lane access-controlled expressway reduces travel time from 90 minutes to 20 minutes between Mumbai and Navi Mumbai. Key technical specifications: 27m deck width, well foundations 30m deep in marine conditions, 5000T marine barge segment transport, and 60+ piers in the sea. The bridge handles 70,000 vehicles daily and is designed for 100+ year service life with seismic Zone-III compliance. MTHL uses 70,000 tonnes of steel and 250,000 cubic metres of concrete. It is a critical component of the Mumbai-Ahmedabad High-Speed Rail corridor connectivity and the Navi Mumbai International Airport access network. The project employed over 3,000 engineers and 15,000 workers during peak construction. Lighting: 1,200 LED street lights, wind-solar hybrid power for toll plazas, and intelligent traffic management system (ITMS) with 350+ CCTV cameras and variable message signs (VMS).",
  },
  {
    t: "Bogibeel Bridge: India's Longest Rail-cum-Road Bridge at 4.94km over Brahmaputra",
    c: "The Bogibeel Bridge across the Brahmaputra River near Dibrugarh in Assam is India's longest rail-cum-road bridge at 4.94km. Inaugurated on December 25, 2018 by Prime Minister Narendra Modi, this ₹5,900 crore double-deck bridge carries a double broad-gauge railway line on the lower deck and a 3-lane road on the upper deck. Constructed by Afcons Infrastructure using 30m deep well foundations in the Brahmaputra's treacherous current, the bridge features a double-wide Warren truss superstructure with 300m spans. The bridge connects Dibrugarh district to the lower Assam region, reducing travel time from 6 hours by ferry to just 30 minutes by road. Technical highlights: 42 well foundations, each 30m deep in the Brahmaputra riverbed, 50,000 tonnes of structural steel, designed for seismic Zone-V (highest earthquake zone), and built to withstand flood-level water velocity of 5m/s. The bridge is part of the Bogibeel rail-cum-road project under the North East Frontier Railway and is a strategic infrastructure asset for India's Look East/Act East Policy, providing all-weather connectivity to Arunachal Pradesh and the rest of Northeast India. The construction faced massive challenges including monsoon flooding, unstable river morphology, and logistic difficulties in transporting 5000T segments via marine barges through the Brahmaputra.",
  },
  {
    t: "Chenab Bridge: World's Highest Rail Bridge at 359m in Jammu & Kashmir",
    c: "The Chenab Bridge in Jammu & Kashmir's Reasi district is the world's highest railway bridge, soaring 359 metres (1,178 feet) above the Chenab River bed. Part of the Udhampur-Srinagar-Baramulla Rail Link (USBRL) project, this ₹1,480 crore engineering masterpiece has a 467-metre main arch span, making it the longest cable-stayed arch bridge in the world for railway traffic. Constructed by Afcons Infrastructure and Konkan Railway Corporation, the bridge connects Bakkal to Kauri and is designed to withstand wind speeds of 266 km/h, seismic Zone-V earthquakes, and temperatures from -20°C to +50°C. Key technical specifications: 1,315m total length, 18m deck width, steel truss deck, pneumatic caisson foundations 40m deep, and 17,000 tonnes of steel. The bridge uses 250 km of welding and 26,000 cubic metres of concrete. For worker safety, 1,200 fall arrest systems and 1,000,000 man-hours of work were executed without a single fatality. The arch was erected using cable cranes and the stay-cable technique unique to Indian bridge construction. Chenab Bridge is 35 metres taller than the Eiffel Tower and forms the most challenging section of the 111km Katra-Banihal USBRL section. It enables year-round rail connectivity to the Kashmir Valley, replacing the current 12-hour road journey from Jammu to Srinagar with a 3.5-hour train ride.",
  },
  {
    t: "India 200,000 Bridges: NHAI Target for National Highway Network Expansion",
    c: "India has approximately 200,000 bridges on its National Highway network, with the National Highways Authority of India (NHAI) and Ministry of Road Transport and Highways (MoRTH) targeting the construction and rehabilitation of 50,000+ bridges by 2030 under the Bharatmala Pariyojana Phase-II and the Setu Bharatam programme. India's bridge infrastructure spans from Himalayan river crossings (Chenab 359m highest, Bogibeel 4.94km longest rail-cum-road) to coastal sea bridges (MTHL 21.58km longest sea bridge, Bandra-Worli Sea Link 5.6km). Major ongoing bridge projects include: Patna Ganga Bridge (5.63km, ₹3,100Cr), Patna-Digha cable-stayed (3.2km, ₹8,200Cr), Hooghly Setu Kona (2.2km, ₹2,600Cr), Narmada Golden Bridge (1.4km, ₹1,200Cr), and Dhubri Brahmaputra bridge (1.2km, ₹950Cr). The NHAI has classified bridges by importance: National (1,500+ bridges, 40% of total length), State (35,000+ bridges, 35%), and Rural/Municipal (163,000+ bridges, 25%). Technology trends: accelerated bridge construction (ABC) methods, self-launching gantry cranes, segmental cantilever construction, prefabricated pier caps, and BIM-based bridge management systems. India's bridge construction market is valued at ₹4,50,000 crore (USD 55 billion) annually, with top developers being L&T, Afcons, Gammon India, Dilip Buildcon, and Simplex Infrastructures. The Indian Roads Congress (IRC) has updated bridge design codes IRC:6-2024 for loads, IRC:78-2024 for foundations, and IRC:112-2024 for concrete, aligning with Eurocodes for international compatibility.",
  },
];

export default function BridgeConstructionLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "developer", label: "Developer", options: DEVELOPERS.map(d => ({ value: d, count: records.filter(rec => rec.developer === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "foundationType", label: "Foundation", options: ["Open Foundation Rock", "Well Foundation 30m Deep", "Pile Foundation 60m", "Caisson Pneumatic 40m", "Spread Footing"].map(f => ({ value: f, count: records.filter(rec => rec.foundationType === f).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.developer.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.state.toLowerCase().includes(q) && !r.zone.toLowerCase().includes(q) && !r.site.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof BridgeRecord] as string));
  });

  const cols = ["ID", "Batch No", "Developer", "Zone", "Category", "Description", "Span (m)", "Length (m)", "Width (m)", "Deck Type", "Foundation", "Origin", "Site", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (₹)", "River", "Status", "Remarks"];

  return (
    <div className="brc-root p-6 space-y-6">
      <PageHeader title="Bridge Construction Logistics" description="Indian bridge construction logistics covering Mumbai Trans Harbour Link 21.58km India longest sea bridge, Bogibeel 4.94km rail-cum-road Brahmaputra, Chenab Bridge world highest rail 359m, Patna Ganga extradosed, cable-stayed, steel truss, segmental cantilever, box girder viaduct construction" />
      <div className="brc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`brc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#292524] text-white" : "text-gray-600 hover:bg-stone-100"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="brc-dash space-y-6">
          <div className="brc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="brc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 brc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-[#292524] brc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 brc-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="brc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Construction Progress (Units)</h3><BarChart data={monthlyProgress} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="foundation" fill="#292524" radius={[4,4,0,0]} name="Foundation" /><Bar dataKey="pier" fill="#44403c" radius={[4,4,0,0]} name="Pier" /><Bar dataKey="girder" fill="#57534e" radius={[4,4,0,0]} name="Girder" /><Bar dataKey="deck" fill="#78716c" radius={[4,4,0,0]} name="Deck" /></BarChart></div>
            <div className="brc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Bridge Type Distribution</h3><PieChart width={400} height={220}><Pie data={bridgeTypeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{bridgeTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="brc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost per Metre (₹L/m) vs ₹15L/m Target</h3><LineChart data={costPerM} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[10, 20]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#292524" strokeWidth={2} name="Actual" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="brc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Developer Portfolio Bridge Length (m)</h3><BarChart data={developerPortfolio} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="length" fill="#44403c" radius={[4,4,0,0]} name="Length (m)" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="brc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Bridge Construction", href: "#" }, { label: "Bridge Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="brc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{cols.map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Foundation Pile Driving Active" ? "brc-row-muted bg-slate-50" : r.status === "Pier Column Construction Ongoing" ? "brc-row-info bg-blue-50" : r.status === "Steel Girder Erection Transit" ? "brc-row-warning bg-amber-50" : r.status === "Cable Stay Anchoring Tensioning" ? "brc-row-warning bg-orange-50" : r.status === "Deck Slab Casting Wet Concrete" ? "brc-row-danger bg-red-50" : r.status === "Load Testing Inauguration Ready" ? "brc-row-success bg-green-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-stone-100/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="brc-badge inline-block px-2 py-0.5 rounded text-xs bg-[#292524] text-white font-mono text-[10px]">{r.batchNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.developer}</td>
                <td className="px-3 py-2"><span className="brc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="brc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.spanM}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.lengthM}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.widthM}</td>
                <td className="px-3 py-2 text-xs">{r.deckType}</td>
                <td className="px-3 py-2 text-xs">{r.foundationType}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs">{r.site}</td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.prodDate}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays >= 15 ? "text-red-600" : r.transitDays >= 8 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-[#292524]">{formatINR(r.contractValue)}</td>
                <td className="px-3 py-2 text-xs">{r.riverCrossing}</td>
                <td className="px-3 py-2"><span className={`brc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="brc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="brc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Foundation & Pier Construction (Units)</h3><BarChart data={monthlyProgress} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="foundation" fill="#292524" radius={[4,4,0,0]} name="Foundation" /><Bar dataKey="pier" fill="#44403c" radius={[4,4,0,0]} name="Pier" /><Bar dataKey="girder" fill="#57534e" radius={[4,4,0,0]} name="Girder" /><Bar dataKey="deck" fill="#78716c" radius={[4,4,0,0]} name="Deck" /></BarChart></div>
            <div className="brc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Bridge Type Distribution (%)</h3><PieChart width={400} height={240}><Pie data={bridgeTypeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={85} label>{bridgeTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="brc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Cost per Metre Actual vs Target (₹L/m)</h3><LineChart data={costPerM} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[10, 20]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#292524" strokeWidth={2} name="Actual" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="brc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Developer Portfolio Bridge Length (m)</h3><BarChart data={developerPortfolio} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="length" fill="#44403c" radius={[4,4,0,0]} name="Length (m)" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="brc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="brc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-[#292524] mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}