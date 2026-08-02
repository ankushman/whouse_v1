"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#334155", "#475569", "#64748b", "#94a3b8", "#1e293b", "#0f172a", "#cbd5e1", "#e2e8f0"];
const DEPOTS = ["COD Delhi Central", "COD Mumbai Western", "COD Kolkata Eastern", "COD Chennai Southern", "COD Jaipur Desert", "COD Leh Northern", "COD Guwahati NE", "COD Port Blair A&N"];
const CATEGORIES = ["Ammunition", "Fuels & Lubricants", "Rations & Provisions", "Spare Parts", "Uniforms & Clothing", "Medical Supplies", "Signals & Comms", "Ordnance Stores"];
const SUPPLY_STATUSES = ["Dispatched", "In Transit", "Delivered to Unit", "Held at Depot", "Quality Inspection", "Emergency Priority"];
const COMMANDS = ["Northern Command", "Western Command", "Eastern Command", "Southern Command", "Central Command", "South Western", "Training Command", "Andaman Command"];
const TRANSPORT = ["Military Convoy", "Rail Military Wagon", "IL-76 Aircraft", "C-130 Hercules", "Naval Ship", "CH-47 Chinook Helo"];
const TABS = ["Dashboard", "Supply Registry", "Logistics Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Dispatched": "blue", "In Transit": "blue", "Delivered to Unit": "green", "Held at Depot": "slate", "Quality Inspection": "orange", "Emergency Priority": "red" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlySupply = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], ammo: ri(1200, 2800, 1800 + Math.sin(i * 0.5) * 400), fuel: ri(3500, 6000, 4500 + Math.cos(i * 0.6) * 800), ration: ri(2200, 3800, 2800 + Math.sin(i * 0.7) * 400), spares: ri(800, 1500, 1100 + Math.cos(i * 0.8) * 200) }));
const categoryDist = [{ n: "Ammunition", v: 18 }, { n: "Fuels & Lubricants", v: 28 }, { n: "Rations & Provisions", v: 20 }, { n: "Spare Parts", v: 12 }, { n: "Uniforms & Clothing", v: 6 }, { n: "Medical Supplies", v: 8 }, { n: "Signals & Comms", v: 5 }, { n: "Ordnance Stores", v: 3 }];
const fulfillmentTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(85, 99, 92 + Math.sin(i * 0.4) * 4)).toFixed(1), target: 95.0 }));
const depotPerf = DEPOTS.slice(0, 6).map(d => ({ n: d.replace("COD ", "").split(" ")[0], v: +ri(78, 98, 88 + Math.random() * 8).toFixed(0) }));

interface SupplyRecord { id: string; indentNo: string; depot: string; category: string; item: string; quantity: number; unit: string; unitConsignee: string; command: string; priority: string; transport: string; dispatchDate: string; eta: string; deliveredDate: string; transitDays: number; valueLakhs: number; classified: boolean; remarks: string; status: string; }

const records: SupplyRecord[] = [
  { id: "DSC-0001", indentNo: "IND/NC/2025/7845", depot: "COD Delhi Central", category: "Ammunition", item: "5.56mm INSAS Rifle Ammo", quantity: 500000, unit: "Rounds", unitConsignee: "2 Rajputana Rifles", command: "Northern Command", priority: "Normal", transport: "Military Convoy", dispatchDate: "2025-07-10", eta: "2025-07-12", deliveredDate: "", transitDays: 2, valueLakhs: 245, classified: true, remarks: "5.56mm ball ammo for Northern Command area of responsibility", status: "In Transit" },
  { id: "DSC-0002", indentNo: "IND/WC/2025/6234", depot: "COD Mumbai Western", category: "Fuels & Lubricants", item: "HFD Grade Aviation Fuel", quantity: 50000, unit: "Litres", unitConsignee: "SU-30MKI Squadron", command: "Western Command", priority: "Normal", transport: "Military Convoy", dispatchDate: "2025-07-08", eta: "2025-07-09", deliveredDate: "2025-07-09", transitDays: 1, valueLakhs: 420, classified: true, remarks: "High Flash Diesel for SU-30MKI fighter aircraft refueling", status: "Delivered to Unit" },
  { id: "DSC-0003", indentNo: "IND/EC/2025/9120", depot: "COD Kolkata Eastern", category: "Rations & Provisions", item: "Fresh Ration Vegetables", quantity: 25000, unit: "Kg", unitConsignee: "3 Gorkha Rifles", command: "Eastern Command", priority: "Emergency Priority", transport: "C-130 Hercules", dispatchDate: "2025-07-12", eta: "2025-07-12", deliveredDate: "", transitDays: 0, valueLakhs: 18, classified: false, remarks: "Emergency ration for forward area posts near LAC - air drop", status: "Dispatched" },
  { id: "DSC-0004", indentNo: "IND/SC/2025/4567", depot: "COD Chennai Southern", category: "Spare Parts", item: "T-90 Tank Track Assembly", quantity: 12, unit: "Sets", unitConsignee: "Armed Regt (T-90)", command: "Southern Command", priority: "Normal", transport: "Rail Military Wagon", dispatchDate: "2025-07-05", eta: "2025-07-07", deliveredDate: "2025-07-07", transitDays: 2, valueLakhs: 890, classified: true, remarks: "T-90 Bhishma tank track replacement sets for maintenance cycle", status: "Delivered to Unit" },
  { id: "DSC-0005", indentNo: "IND/JPR/2025/3345", depot: "COD Jaipur Desert", category: "Fuels & Lubricants", item: "BMTS Grade Diesel", quantity: 100000, unit: "Litres", unitConsignee: "Mechanised Inf Bde", command: "South Western", priority: "Normal", transport: "Military Convoy", dispatchDate: "2025-07-11", eta: "2025-07-13", deliveredDate: "", transitDays: 2, valueLakhs: 780, classified: true, remarks: "BS-VI diesel for mechanised brigade desert exercise Pinaka", status: "In Transit" },
  { id: "DSC-0006", indentNo: "IND/LH/2025/8901", depot: "COD Leh Northern", category: "Rations & Provisions", item: "High Altitude Ration Pack", quantity: 15000, unit: "Packs", unitConsignee: "ITBP Battalion", command: "Northern Command", priority: "Emergency Priority", transport: "CH-47 Chinook Helo", dispatchDate: "2025-07-12", eta: "2025-07-12", deliveredDate: "", transitDays: 0, valueLakhs: 85, classified: false, remarks: "Emergency HA ration for 14,500 ft posts - Chinook airlift", status: "Dispatched" },
  { id: "DSC-0007", indentNo: "IND/GHY/2025/5678", depot: "COD Guwahati NE", category: "Uniforms & Clothing", item: "Multi-Terrain Camo Set", quantity: 5000, unit: "Sets", unitConsignee: "Assam Regt Centre", command: "Eastern Command", priority: "Normal", transport: "Rail Military Wagon", dispatchDate: "2025-07-06", eta: "2025-07-08", deliveredDate: "2025-07-08", transitDays: 2, valueLakhs: 125, classified: false, remarks: "New digital camo uniform sets for Assam Regiment personnel", status: "Delivered to Unit" },
  { id: "DSC-0008", indentNo: "IND/PB/2025/7234", depot: "COD Delhi Central", category: "Signals & Comms", item: "Satcom Terminal Set", quantity: 24, unit: "Units", unitConsignee: "Corps of Signals", command: "Central Command", priority: "Normal", transport: "Military Convoy", dispatchDate: "2025-07-09", eta: "2025-07-10", deliveredDate: "2025-07-10", transitDays: 1, valueLakhs: 1560, classified: true, remarks: "Ka-band satcom terminals for Corps of Signals upgrade", status: "Delivered to Unit" },
  { id: "DSC-0009", indentNo: "IND/WC/2025/8456", depot: "COD Mumbai Western", category: "Medical Supplies", item: "Battle Casualty Kit", quantity: 2000, unit: "Kits", unitConsignee: "Field Ambulance", command: "Western Command", priority: "Normal", transport: "Military Convoy", dispatchDate: "2025-07-07", eta: "2025-07-08", deliveredDate: "", transitDays: 1, valueLakhs: 48, classified: false, remarks: "BCK for forward medical units - trauma and emergency surgery kits", status: "In Transit" },
  { id: "DSC-0010", indentNo: "IND/KOL/2025/1567", depot: "COD Kolkata Eastern", category: "Ordnance Stores", item: "155mm Bofors Shell HE", quantity: 2000, unit: "Rounds", unitConsignee: "Artillery Regt", command: "Eastern Command", priority: "Normal", transport: "Rail Military Wagon", dispatchDate: "2025-07-04", eta: "2025-07-06", deliveredDate: "2025-07-05", transitDays: 2, valueLakhs: 680, classified: true, remarks: "155mm HE shells for Bofors FH-77B howitzer regiment", status: "Delivered to Unit" },
  { id: "DSC-0011", indentNo: "IND/NC/2025/9876", depot: "COD Leh Northern", category: "Ammunition", item: "7.62mm MMG Belt", quantity: 100000, unit: "Rounds", unitConsignee: "Kumaon Regt", command: "Northern Command", priority: "Emergency Priority", transport: "IL-76 Aircraft", dispatchDate: "2025-07-11", eta: "2025-07-11", deliveredDate: "", transitDays: 0, valueLakhs: 185, classified: true, remarks: "Emergency ammo resupply for Kumaon Regt forward posts near Pangong", status: "Dispatched" },
  { id: "DSC-0012", indentNo: "IND/AN/2025/2345", depot: "COD Port Blair A&N", category: "Rations & Provisions", item: "Long Shelf Ration Carton", quantity: 8000, unit: "Cartons", unitConsignee: "Andaman Territorial Army", command: "Andaman Command", priority: "Normal", transport: "Naval Ship", dispatchDate: "2025-07-03", eta: "2025-07-05", deliveredDate: "2025-07-05", transitDays: 2, valueLakhs: 32, classified: false, remarks: "Long-shelf ration for island garrison - 12-month storage grade", status: "Delivered to Unit" },
  { id: "DSC-0013", indentNo: "IND/CHN/2025/6789", depot: "COD Chennai Southern", category: "Ammunition", item: "AK-203 7.62x39mm", quantity: 300000, unit: "Rounds", unitConsignee: "Madras Regt", command: "Southern Command", priority: "Normal", transport: "Rail Military Wagon", dispatchDate: "2025-07-10", eta: "2025-07-11", deliveredDate: "", transitDays: 1, valueLakhs: 156, classified: true, remarks: "AK-203 rifle ammo for newly equipped Madras Regt battalions", status: "In Transit" },
  { id: "DSC-0014", indentNo: "IND/DEL/2025/4321", depot: "COD Delhi Central", category: "Spare Parts", item: "Arjun Mk-1A Engine Module", quantity: 4, unit: "Units", unitConsignee: "Armed Corps Centre", command: "Central Command", priority: "Normal", transport: "Rail Military Wagon", dispatchDate: "2025-07-02", eta: "2025-07-04", deliveredDate: "", transitDays: 2, valueLakhs: 2400, classified: true, remarks: "Arjun MBT Mk-1A powerpack modules - held for quality inspection", status: "Quality Inspection" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Dispatched").length;
const holdCount = records.filter(r => r.status === "Held at Depot" || r.status === "Quality Inspection").length;
const deliveredCount = records.filter(r => r.status === "Delivered to Unit").length;
const totalValue = records.reduce((s, r) => s + r.valueLakhs, 0);

const kpis = [
  { l: "Dispatched / Transit", v: transitCount, s: "active consignments" },
  { l: "Held / Under QC", v: holdCount, s: "pending clearance" },
  { l: "Delivered to Unit", v: deliveredCount, s: "completed deliveries" },
  { l: "Total Supply Value", v: `\u20b9${totalValue}L`, s: "across all depots" },
];

const INSIGHTS = [
  {
    t: "Indian Military Logistics: 1.4 Million Troops and \u20b95.5 Lakh Crore Defence Budget",
    c: "India operates the world\u2019s second-largest standing military with 1.45 million active personnel (Indian Army: 1.25 million, Indian Navy: 65,000, Indian Air Force: 140,000) supported by 1.15 million reserve forces and 2.5 million paramilitary personnel, all supplied through a complex multi-tier logistics network under the Ministry of Defence\u2019s \u20b95.5 lakh crore (USD 66 billion) defence budget for FY2025. The Indian Army\u2019s logistics chain is managed by the Army Service Corps (ASC), Ordnance Corps, and Electrical and Mechanical Engineers (EME) through 13 Corps Logistics Units, 50+ Ordnance Depots (including 8 Central Ordnance Depots - CODs), and 200+ Field Ordnance Depots across 7 operational commands: (1) Northern Command (Udhampur, handling Ladakh and J&K logistics including 14,000 ft altitude supply), (2) Western Command (Chandigarh, Rajasthan desert logistics), (3) Eastern Command (Kolkata, Northeast and Sikkim/AR logistics), (4) Southern Command (Pune, peninsular India), (5) Central Command (Lucknow, heartland support), (6) South Western Command (Jaipur, Thar Desert operations), and (7) Andaman & Nicobar Command (Port Blair, island logistics). India\u2019s military logistics handles: (1) 18,000+ tonnes of rations monthly, (2) 15,000+ kilolitres of fuel monthly, (3) 500+ million rounds of ammunition annually, (4) 200,000+ spare parts and assemblies, and (5) 100,000+ uniform/clothing sets annually. The Army Ordnance Corps manages 35,000+ line items worth \u20b91,20,000 crore in inventory across 58 depots. Key strategic logistics corridors include: (1) Leh-Manali Highway (470 km, supply window April-November), (2) Srinagar-Leh Highway (434 km, Zoji La pass at 11,575 ft), (3) Sela Pass corridor (Tawang, 13,700 ft), and (4) North Sikkim corridor (Nathu La, 14,140 ft). India\u2019s defence logistics expenditure is approximately \u20b91,80,000 crore annually (32% of defence budget), covering procurement, storage, transportation, and maintenance across all three services.",
  },
  {
    t: "Multi-Modal Military Transport: Road Convoys, Airborne Airlift, and Naval Support",
    c: "India\u2019s military logistics operates one of the most diverse multi-modal transport networks globally, combining: (1) Road convoys (primary mode, 60% of supplies): Indian Army operates 80,000+ military vehicles including 40,000+ heavy trucks (Ashok Leyland Stallion, Tata LPTA 713, BEML Tatra), 4,000+ specialized fuel tankers, and 2,000+ refrigerated vehicles for perishable rations. The Border Roads Organisation (BRO) maintains 32,000 km of strategic roads including 2,200 km at altitudes above 12,000 ft. Road convoy operations include: 150+ daily supply convoys in Kashmir/Ladakh sector, 100+ daily convoys in Northeast, and 50+ daily in Rajasthan desert sector. (2) Rail military movement (25% of bulk supplies): Indian Railways operates dedicated military wagon fleet of 5,000+ wagons handling 200+ military specials per month. Key military rail corridors: Delhi-Jammu (for Northern Command), Delhi-Guwahati (for Eastern Command), and Delhi-Jaisalmer (for Western Command). A military rail rake carries 1,500-2,000 tonnes of supplies. (3) Airborne logistics (10% of urgent/emergency): Indian Air Force\u2019s C-17 Globemaster III fleet (11 aircraft, 77-tonne payload), IL-76 fleet (17 aircraft, 48-tonne payload), C-130J Hercules (12 aircraft, 20-tonne payload for tactical airlift), and Mi-17/CH-47 Chinook helicopters for last-mile delivery to forward posts. IAF conducts approximately 50,000 sorties annually for military logistics. (4) Naval logistics (5%): Indian Navy\u2019s fleet support ships and landing ships for island territories and coastal supply. The Tri-Services Integrated Defence Staff (IDS) coordinates joint logistics operations for major exercises and operational deployments. Emergency supply capability includes: (1) C-17 can deliver 77 tonnes to Leh within 4 hours from Delhi, (2) CH-47 Chinook can deliver 10 tonnes to 14,000 ft posts, and (3) Road convoys can deliver 500 tonnes per day to forward locations during fair weather. The Indian Army\u2019s logistics digitization program (Army Logistics Network - ALN) connects all depots, units, and commands for real-time inventory visibility and automated supply chain management.",
  },
  {
    t: "Ordnance Management: Ammunition, Explosives, and Classified Inventory Control",
    c: "India\u2019s ordnance supply chain manages 35,000+ weapon system line items across 58 ordnance depots under strict classified inventory controls governed by the Ordnance Factory Board (now defunct, replaced by 7 Defence Public Sector Undertakings - DPSUs) and private manufacturers under the Make in India defence production policy. Key ordnance categories include: (1) Ammunition: Small arms (5.56mm INSAS, 7.62mm AK-203/SNL, 9mm Pistol), artillery (155mm Bofors/K9 Vajra, 105mm Indian Field Gun), tank (125mm smoothbore for T-90), and air-delivered munitions, produced at 41 ordnance factories and 12 private licensed companies with annual production capacity of 500+ million rounds. (2) Explosives and pyrotechnics: RDX, HMX, TNT, and plastic explosives managed under stringent safety protocols (minimum 200m safety distance between ammunition bays, blast-resistant storage buildings, and 24-hour armed guard). (3) Vehicle spares: T-90 Bhishma, Arjun Mk-1A, BMP-2 Sarath, K9 Vajra SPH spares with coded inventory tracking. (4) Avionics and missile components: BrahMos, Astra, Akash, and Nirbhay missile subsystems stored in climate-controlled facilities. India\u2019s ammunition lifecycle management involves: (1) Production at OFB/DPSU factories and private licensees, (2) Quality inspection at proof ranges (CFE, Balasore), (3) Storage in ordnance depots with environmental monitoring (temperature 15-25\u00b0C, humidity below 60%), (4) Periodic surveillance testing every 5 years, and (5) Disposal of expired/condemned ammunition at designated demolition ranges. The Army\u2019s Ammunition Management System (AMS) tracks every lot from production to disposal with full lot traceability. Key challenges include: (1) Obsolescence management for legacy systems (30% of spares for phased-out equipment), (2) Shelf-life management for time-sensitive explosives (5-15 year shelf life), (3) Cold storage requirements for missile propellants (-20\u00b0C to 40\u00b0C), and (4) Safety classification for transport and storage (Class 1.1 to 1.6 UN hazard classification). India\u2019s DPSUs have initiated Industry 4.0 adoption for ordnance manufacturing with IoT-enabled tracking, AI-powered predictive maintenance, and blockchain-based lifecycle traceability covering 12 factories and 58 depots.",
  },
  {
    t: "Strategic Supply Chain: Border Logistics, High-Altitude Operations, and Forward Area Resupply",
    c: "India\u2019s strategic supply chain faces unique challenges due to diverse terrain: Himalayan high-altitude (northern/eastern borders), Thar Desert (western border), island territories (Andaman & Nicobar, Lakshadweep), and dense jungle terrain (Northeast Seven Sisters). High-altitude logistics (above 12,000 ft) requires: (1) Specialized cold-weather rations (6,500 kcal/day per soldier versus 3,800 kcal for plains), (2) Kerosene and heating fuel (winter demand 3x summer), (3) Cold-weather clothing and mountaineering equipment (multi-layer extreme cold weather system per soldier costing \u20b95,000), (4) Medical supplies including high-altitude sickness kits and portable hyperbaric chambers, and (5) Ammunition and explosives that function reliably at -30\u00b0C to -40\u00b0C. India\u2019s forward area logistics infrastructure includes: (1) Advanced Landing Grounds (ALGs): 12 operational in Ladakh, 8 in Northeast (Daulat Beg Oldi at 15,249 ft is the world\u2019s highest), (2) Helipads: 150+ tactical helipads for rotary-wing supply, (3) Road networks: 32,000 km strategic roads maintained by BRO with 20+ tunnels including Atal Tunnel (9.02 km under Rohtang Pass), and (4) Storage: 200+ forward ammunition and supply dumps with camouflaged storage. The Indian Army\u2019s Logistics Management Information System (LMIS) integrates with: (1) AFNET (Army Fiber Optic Network) for secure communications, (2) GIS-based terrain analysis for route optimization, (3) Weather forecasting integration (Snow and Avalanche Study Establishment - SASE) for Himalayan supply planning, and (4) Automated indent processing through the e-Chhawani platform connecting units to depots digitally. The Integrated Financial Logistics System (IFLS) handles procurement budgets of \u20b91,80,000 crore annually with electronic fund transfer and expenditure tracking. India\u2019s strategic petroleum reserve (SPR) of 5.33 MMT (Indian Strategic Petroleum Reserve Ltd - ISPRL) at Visakhapatnam, Mangalore, and Padur provides 10 days of national emergency fuel supply, with expansion plans to 15 days. Future logistics modernization includes: (1) Unmanned Aerial Systems (UAS) for last-mile delivery, (2) Autonomous ground vehicles for convoy operations in hostile terrain, (3) AI-powered demand forecasting reducing surplus inventory by 30%, and (4) Satellite-based asset tracking for all classified movements.",
  },
];

export default function DefenseSupplyCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: SUPPLY_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "command", label: "Command", options: COMMANDS.map(c => ({ value: c, count: records.filter(r => r.command === c).length })) },
    { key: "transport", label: "Transport", options: TRANSPORT.map(t => ({ value: t, count: records.filter(r => r.transport === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.indentNo.toLowerCase().includes(q) && !r.depot.toLowerCase().includes(q) && !r.item.toLowerCase().includes(q) && !r.unitConsignee.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof SupplyRecord] as string));
  });

  return (
    <div className="dsc-root p-6 space-y-6">
      <PageHeader title="Defense Supply Command" description="Indian military ordnance supply chain, ammunition fuel ration spare parts logistics, forward area resupply operations, high-altitude Himalayan supply, multi-modal transport air-drops rail-road convoys, and strategic depot inventory management" />
      <div className="dsc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`dsc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-slate-800 text-white" : "text-gray-600 hover:bg-slate-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="dsc-dash space-y-6">
          <div className="dsc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="dsc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 dsc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-slate-800 dsc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 dsc-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="dsc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Supply Dispatch by Category (KT)</h3><BarChart data={monthlySupply} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="ammo" fill="#334155" radius={[4,4,0,0]} name="Ammunition" /><Bar dataKey="fuel" fill="#475569" radius={[4,4,0,0]} name="Fuels" /><Bar dataKey="ration" fill="#64748b" radius={[4,4,0,0]} name="Rations" /><Bar dataKey="spares" fill="#94a3b8" radius={[4,4,0,0]} name="Spares" /></BarChart></div>
            <div className="dsc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Supply Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="dsc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Order Fulfillment Rate (%) vs 95% Target</h3><LineChart data={fulfillmentTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[80, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#334155" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="dsc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Depot Performance Score</h3><BarChart data={depotPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[70, 100]} /><Tooltip /><Bar dataKey="v" fill="#475569" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="dsc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Defense Supply", href: "#" }, { label: "Supply Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="dsc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Indent No,Depot,Category,Item,Qty,Unit,Consignee,Command,Priority,Transport,Dispatch,ETA,Transit,Value (\u20b9L),Classified,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Emergency Priority" ? "dsc-row-critical bg-red-50" : r.status === "Quality Inspection" || r.status === "Held at Depot" ? "dsc-row-warning bg-amber-50" : r.status === "In Transit" ? "dsc-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-slate-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="dsc-badge inline-block px-2 py-0.5 rounded text-xs bg-slate-800 text-white font-mono">{r.indentNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.depot.replace("COD ", "")}</td>
                <td className="px-3 py-2"><span className="dsc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.item}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.quantity.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{r.unit}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.unitConsignee}</td>
                <td className="px-3 py-2 text-xs">{r.command}</td>
                <td className="px-3 py-2"><span className={`dsc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${r.priority === "Emergency Priority" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{r.priority === "Emergency Priority" ? "EMRG" : "NORM"}</span></td>
                <td className="px-3 py-2 text-xs">{r.transport}</td>
                <td className="px-3 py-2 text-xs">{r.dispatchDate}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitDays > 2 ? "text-amber-600" : "text-green-600"}`}>{r.transitDays}d</span></td>
                <td className="px-3 py-2 text-xs font-semibold">{r.valueLakhs}</td>
                <td className="px-3 py-2 text-center">{r.classified ? <span className="dsc-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">CL</span> : <span className="text-green-600">UNCL</span>}</td>
                <td className="px-3 py-2"><span className={`dsc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="dsc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="dsc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Supply Volume by Depot</h3><BarChart data={DEPOTS.slice(0,6).map(d => ({ n: d.replace("COD ","").split(" ")[0], v: +ri(45, 180, 110 + Math.random() * 50).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#334155" radius={[4,4,0,0]} name="Consignments" /></BarChart></div>
            <div className="dsc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Supply by Command Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], northern: ri(180, 320, 240 + Math.sin(i*0.5)*35), western: ri(150, 280, 210 + Math.cos(i*0.6)*30), eastern: ri(120, 250, 180 + Math.sin(i*0.7)*25) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="northern" stackId="1" stroke="#334155" fill="#f1f5f9" name="Northern" /><Area type="monotone" dataKey="western" stackId="1" stroke="#475569" fill="#e2e8f0" name="Western" /><Area type="monotone" dataKey="eastern" stackId="1" stroke="#64748b" fill="#cbd5e1" name="Eastern" /></AreaChart></div>
          </div>
          <div className="dsc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Delivery Time by Transport Mode (Days)</h3><BarChart data={[{n:"Military Convoy",v:2.5},{n:"Rail Wagon",v:2},{n:"IL-76 Aircraft",v:0.5},{n:"C-130 Hercules",v:0.5},{n:"Naval Ship",v:3},{n:"CH-47 Chinook",v:0.3}].map(d => ({...d, v: +ri(d.v-0.2, d.v+0.5, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#475569" radius={[4,4,0,0]} name="Days" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="dsc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="dsc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-slate-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
