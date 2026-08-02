"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#b45309", "#d97706", "#f59e0b", "#fbbf24", "#92400e", "#78350f", "#f59e0b", "#fef3c7"];
const ZONES = ["Zone A - High Velocity", "Zone B - Medium Velocity", "Zone C - Low Velocity", "Zone D - Bulk Storage", "Zone E - Returns Processing", "Zone F - Value Added Services"];
const LOCATION_TYPES = ["Rack Location", "Floor Location", "Mezzanine", "Cold Room", "Hazardous Area", "Staging Area"];
const CAPACITY_STATUS = ["Optimal", "Near Capacity", "Over Capacity", "Under Utilized", "Reserved", "Under Maintenance"];
const WAREHOUSES = ["Delhi NCR Hub", "Mumbai Bhiwandi", "Bangalore Nelamangala", "Chennai Oragadam", "Hyderabad Pharma City", "Kolkata Uluberia"];
const TABS = ["Dashboard", "Location Registry", "Utilization Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", orange: "bg-orange-100 text-orange-700", slate: "bg-slate-100 text-slate-600", teal: "bg-teal-100 text-teal-700" };
const statusColor: Record<string, string> = { Optimal: "green", "Near Capacity": "amber", "Over Capacity": "red", "Under Utilized": "slate", Reserved: "orange", "Under Maintenance": "amber" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyUtil = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], utilized: ri(68, 92, 78 + Math.sin(i * 0.5) * 8), reserved: ri(8, 18, 12 + Math.cos(i * 0.6) * 4), maintenance: ri(2, 8, 4 + Math.sin(i * 0.8) * 2) }));
const zoneUtil = ZONES.map(z => ({ n: z.split(" - ")[0], v: ri(55, 98, 75 + Math.random() * 18) }));
const cubeUtilTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], cubePct: +(ri(62, 88, 72 + Math.sin(i * 0.4) * 8)).toFixed(1), weightPct: +(ri(58, 82, 68 + Math.cos(i * 0.5) * 7)).toFixed(1) }));
const locTypeDist = LOCATION_TYPES.map((l, i) => ({ n: l, v: ri(120, 480, 280 - i * 25) }));
const whUtil = WAREHOUSES.map(w => ({ n: w.split(" ")[0], v: ri(62, 96, 78 + Math.random() * 14) }));

interface LocationRecord { id: string; locationId: string; warehouse: string; zone: string; aisle: string; rack: string; level: string; position: string; locationType: string; skuAssigned: string; capacityPct: number; cubeUtilPct: number; weightPct: number; status: string; lastPutaway: string; lastPick: string; turnoverRate: number; palletCapacity: number; palletsOccupied: number; }

const records: LocationRecord[] = [
  { id: "WSP-0001", locationId: "WH01-A-01-03-02", warehouse: "Delhi NCR Hub", zone: "Zone A - High Velocity", aisle: "A", rack: "01", level: "03", position: "02", locationType: "Rack Location", skuAssigned: "SKU-ENG-4521", capacityPct: 95, cubeUtilPct: 88, weightPct: 82, status: "Near Capacity", lastPutaway: "2025-01-15 08:30", lastPick: "2025-01-15 14:20", turnoverRate: 12.4, palletCapacity: 2, palletsOccupied: 2 },
  { id: "WSP-0002", locationId: "WH01-B-04-02-01", warehouse: "Delhi NCR Hub", zone: "Zone B - Medium Velocity", aisle: "B", rack: "04", level: "02", position: "01", locationType: "Rack Location", skuAssigned: "SKU-FMG-2847", capacityPct: 72, cubeUtilPct: 65, weightPct: 58, status: "Optimal", lastPutaway: "2025-01-15 09:15", lastPick: "2025-01-15 13:45", turnoverRate: 6.2, palletCapacity: 3, palletsOccupied: 2 },
  { id: "WSP-0003", locationId: "WH02-C-07-01-03", warehouse: "Mumbai Bhiwandi", zone: "Zone C - Low Velocity", aisle: "C", rack: "07", level: "01", position: "03", locationType: "Floor Location", skuAssigned: "SKU-TEL-6234", capacityPct: 35, cubeUtilPct: 28, weightPct: 22, status: "Under Utilized", lastPutaway: "2025-01-08 11:00", lastPick: "2025-01-12 16:30", turnoverRate: 1.8, palletCapacity: 4, palletsOccupied: 1 },
  { id: "WSP-0004", locationId: "WH03-D-02-04-01", warehouse: "Bangalore Nelamangala", zone: "Zone D - Bulk Storage", aisle: "D", rack: "02", level: "04", position: "01", locationType: "Rack Location", skuAssigned: "SKU-AUT-1290", capacityPct: 105, cubeUtilPct: 98, weightPct: 92, status: "Over Capacity", lastPutaway: "2025-01-14 07:20", lastPick: "2025-01-15 10:10", turnoverRate: 8.6, palletCapacity: 3, palletsOccupied: 4 },
  { id: "WSP-0005", locationId: "WH04-E-01-02-02", warehouse: "Chennai Oragadam", zone: "Zone E - Returns Processing", aisle: "E", rack: "01", level: "02", position: "02", locationType: "Mezzanine", skuAssigned: "SKU-ELE-7823", capacityPct: 80, cubeUtilPct: 72, weightPct: 68, status: "Optimal", lastPutaway: "2025-01-15 10:45", lastPick: "2025-01-15 15:00", turnoverRate: 4.8, palletCapacity: 2, palletsOccupied: 2 },
  { id: "WSP-0006", locationId: "WH05-F-03-01-01", warehouse: "Hyderabad Pharma City", zone: "Zone F - Value Added Services", aisle: "F", rack: "03", level: "01", position: "01", locationType: "Cold Room", skuAssigned: "SKU-PHA-0021", capacityPct: 65, cubeUtilPct: 58, weightPct: 52, status: "Reserved", lastPutaway: "2025-01-15 06:00", lastPick: "2025-01-15 12:30", turnoverRate: 9.2, palletCapacity: 2, palletsOccupied: 1 },
  { id: "WSP-0007", locationId: "WH06-A-06-03-02", warehouse: "Kolkata Uluberia", zone: "Zone A - High Velocity", aisle: "A", rack: "06", level: "03", position: "02", locationType: "Rack Location", skuAssigned: "SKU-FNB-3456", capacityPct: 92, cubeUtilPct: 85, weightPct: 78, status: "Near Capacity", lastPutaway: "2025-01-15 07:50", lastPick: "2025-01-15 14:55", turnoverRate: 14.1, palletCapacity: 2, palletsOccupied: 2 },
  { id: "WSP-0008", locationId: "WH01-D-08-02-01", warehouse: "Delhi NCR Hub", zone: "Zone D - Bulk Storage", aisle: "D", rack: "08", level: "02", position: "01", locationType: "Hazardous Area", skuAssigned: "SKU-CHM-9901", capacityPct: 48, cubeUtilPct: 42, weightPct: 38, status: "Optimal", lastPutaway: "2025-01-13 14:00", lastPick: "2025-01-15 09:20", turnoverRate: 2.4, palletCapacity: 3, palletsOccupied: 1 },
  { id: "WSP-0009", locationId: "WH02-A-02-04-02", warehouse: "Mumbai Bhiwandi", zone: "Zone A - High Velocity", aisle: "A", rack: "02", level: "04", position: "02", locationType: "Rack Location", skuAssigned: "SKU-FAS-5678", capacityPct: 88, cubeUtilPct: 82, weightPct: 75, status: "Optimal", lastPutaway: "2025-01-15 08:10", lastPick: "2025-01-15 15:30", turnoverRate: 11.8, palletCapacity: 2, palletsOccupied: 2 },
  { id: "WSP-0010", locationId: "WH03-B-05-01-03", warehouse: "Bangalore Nelamangala", zone: "Zone B - Medium Velocity", aisle: "B", rack: "05", level: "01", position: "03", locationType: "Staging Area", skuAssigned: "SKU-APP-3344", capacityPct: 110, cubeUtilPct: 100, weightPct: 95, status: "Over Capacity", lastPutaway: "2025-01-14 16:30", lastPick: "2025-01-15 08:45", turnoverRate: 7.4, palletCapacity: 4, palletsOccupied: 5 },
  { id: "WSP-0011", locationId: "WH04-A-03-02-01", warehouse: "Chennai Oragadam", zone: "Zone A - High Velocity", aisle: "A", rack: "03", level: "02", position: "01", locationType: "Rack Location", skuAssigned: "SKU-AUT-9012", capacityPct: 78, cubeUtilPct: 70, weightPct: 64, status: "Optimal", lastPutaway: "2025-01-15 09:30", lastPick: "2025-01-15 16:10", turnoverRate: 10.5, palletCapacity: 2, palletsOccupied: 2 },
  { id: "WSP-0012", locationId: "WH05-A-01-03-02", warehouse: "Hyderabad Pharma City", zone: "Zone A - High Velocity", aisle: "A", rack: "01", level: "03", position: "02", locationType: "Rack Location", skuAssigned: "SKU-PHA-4456", capacityPct: 42, cubeUtilPct: 35, weightPct: 30, status: "Under Utilized", lastPutaway: "2025-01-10 11:20", lastPick: "2025-01-14 13:00", turnoverRate: 3.2, palletCapacity: 2, palletsOccupied: 1 },
  { id: "WSP-0013", locationId: "WH06-B-04-02-01", warehouse: "Kolkata Uluberia", zone: "Zone B - Medium Velocity", aisle: "B", rack: "04", level: "02", position: "01", locationType: "Floor Location", skuAssigned: "SKU-TEX-7789", capacityPct: 68, cubeUtilPct: 60, weightPct: 55, status: "Optimal", lastPutaway: "2025-01-15 10:15", lastPick: "2025-01-15 14:40", turnoverRate: 5.6, palletCapacity: 4, palletsOccupied: 3 },
  { id: "WSP-0014", locationId: "WH01-C-03-01-02", warehouse: "Delhi NCR Hub", zone: "Zone C - Low Velocity", aisle: "C", rack: "03", level: "01", position: "02", locationType: "Rack Location", skuAssigned: "SKU-HHW-1100", capacityPct: 55, cubeUtilPct: 48, weightPct: 44, status: "Under Maintenance", lastPutaway: "2025-01-05 08:00", lastPick: "2025-01-08 16:20", turnoverRate: 0.8, palletCapacity: 3, palletsOccupied: 0 },
];

const optimalCount = records.filter(r => r.status === "Optimal").length;
const avgUtil = (records.reduce((s, r) => s + r.capacityPct, 0) / records.length).toFixed(1);
const overCapacityCount = records.filter(r => r.status === "Over Capacity").length;
const totalPallets = records.reduce((s, r) => s + r.palletCapacity, 0);
const occupiedPallets = records.reduce((s, r) => s + r.palletsOccupied, 0);

const kpis = [
  { l: "Optimal Locations", v: optimalCount, s: `of ${records.length} zones` },
  { l: "Avg Utilization", v: `${avgUtil}%`, s: "capacity occupied" },
  { l: "Over Capacity", v: overCapacityCount, s: "need reallocation" },
  { l: "Pallet Occupancy", v: `${occupiedPallets}/${totalPallets}`, s: "positions filled" },
];

const INSIGHTS = [
  {
    t: "India Warehouse Space Market: 340 Million Sq Ft and Growing",
    c: "India\u2019s warehousing and logistics park market reached approximately 340 million square feet of Grade A and B warehouse stock across 8 major logistics hubs as of Q4 2024, with an additional 42 million sq ft under construction expected to be delivered by mid-2025. The top 5 warehousing corridors \u2014 NCR Delhi (78M sq ft), Mumbai/Pune (65M sq ft), Bangalore (48M sq ft), Chennai (35M sq ft), and Hyderabad (28M sq ft) \u2014 account for 73% of total Grade A supply, driven by e-commerce fulfillment (32%), third-party logistics (28%), and manufacturing/automotive (22%). Average warehouse rents in India range from \u20b922-28 per sq ft/month in NCR to \u20b932-45 per sq ft/month in Mumbai, with Grade A facilities commanding 15-25% premium over Grade B. The vacancy rate across major hubs stands at 12-15%, with a notable trend toward higher-density racking systems achieving 85-92% vertical space utilization compared to traditional Indian warehouses at 55-65%. Modern Grade A warehouses in India typically feature 12-15 meter eave height, VNA (Very Narrow Aisle) racking with 1.6m aisle width, automated conveyors, and WMS-directed putaway/pick operations, enabling 2.5-3.2x storage density improvement over conventional facilities. The Warehouse Capacity Index (WCI) maintained by Knight Frank India tracks capacity utilization across 15 cities, with Delhi NCR and Mumbai consistently above 85% utilization indicating tightening supply.",
  },
  {
    t: "Slotting Optimization: ABC-XYZ Analysis for Indian Warehouses",
    c: "Slotting optimization in Indian warehouses combines ABC velocity analysis (by sales volume) with XYZ demand variability analysis (by forecast accuracy) to determine optimal SKU-to-location assignments that minimize pick travel distance and maximize cube utilization. A typical mid-sized Indian warehouse handling 15,000-25,000 active SKUs across 5,000-8,000 bin locations uses a 9-cell ABC-XYZ matrix: AX items (high volume, stable demand \u2014 15% of SKUs, 45% of picks) are slotted in golden zone (waist-to-shoulder height, nearest to shipping dock), BY items (medium volume, variable demand \u2014 25% of SKUs, 30% of picks) in secondary zones with moderate accessibility, and CZ items (low volume, erratic demand \u2014 35% of SKUs, 10% of picks) in upper/rack levels or bulk storage. The remaining 25% of SKUs fall into mixed categories requiring dynamic slotting adjustments. Advanced slotting engines use machine learning models trained on 12-18 months of order data to predict seasonal slotting reconfiguration needs, achieving 15-22% reduction in average pick travel distance per order line. Key India-specific considerations include handling diverse product dimensions (from small pharma blister packs to 12-foot auto parts), managing multi-temperature zones (ambient, cold chain, hazardous materials segregation per DGSD rules), and accommodating FIFO compliance for FSSAI-regulated food products and FEFO (First-Expiry-First-Out) for pharmaceutical SKUs with shelf-life constraints as short as 30 days.",
  },
  {
    t: "Cube Utilization: Maximizing Vertical and Horizontal Space",
    c: "Cube utilization \u2014 the ratio of actual product volume to available storage volume in a warehouse location \u2014 is a critical metric that directly impacts warehouse storage capacity and operating costs. India\u2019s warehouse industry average cube utilization stands at 62-68%, significantly below global best practices of 78-85%, representing a potential 15-25% capacity increase through optimized cube management. The three dimensions of cube utilization include: (1) Floor space utilization (sq ft occupied vs available), where Indian warehouses average 72% with best-in-class at 88%; (2) Vertical space utilization (cubic meters used vs total available height), where Indian facilities average only 48% due to legacy low-ceiling buildings (6-8 meter eave height) versus modern Grade A at 12-15 meters; and (3) Pallet position utilization (occupied vs total positions), where Indian warehouses average 75% but face imbalance issues with certain zones at 95%+ while others remain below 40%. Advanced cube optimization strategies include dynamic slotting algorithms that continuously reassign locations based on real-time inventory velocity, mixed-SKU pallet storage for slow-moving items to fill partial pallet positions, and cross-docking bypass for high-velocity items that never enter storage at all. Companies deploying WMS-integrated cube optimization report 18-28% improvement in effective storage capacity without physical warehouse expansion, with ROI payback periods of 8-14 months based on avoided lease costs at \u20b922-45 per sq ft in Tier-1 cities.",
  },
  {
    t: "Warehouse Expansion Strategy: Build vs Lease vs Shared",
    c: "India\u2019s warehousing market offers three primary capacity expansion strategies, each with distinct cost-benefit profiles: (1) Self-built warehouses on owned land, preferred by large operators like Reliance Retail (45M sq ft owned), DMart (18M sq ft), and Amazon India (32M sq ft network), providing long-term cost advantage at \u20b98-14 per sq ft/month operating cost but requiring 18-30 month build timelines and \u20b9800-1200 per sq ft capital investment; (2) Leased Grade A/B warehouses from developers like Blackstone-funded Horizon Industrial Parks, Embassy Industrial Parks, and ESR India, offering 3-5 year lease terms at \u20b922-45 per sq ft/month with built-in scalability through pre-commitment agreements; and (3) Shared/managed warehousing through operators like DHL Supply Chain, TVS Supply Chain, and Mahindra Logistics, providing multi-client facilities with variable cost structures at \u20b912-18 per sq ft/month plus handling charges. The emerging trend in India is toward built-to-suit (BTS) agreements where warehouse developers construct facilities to specific operator requirements, accounting for 28% of new supply in FY2024-25. For mid-sized logistics companies managing 50,000-200,000 sq ft, the optimal strategy typically involves a hybrid model: 40% owned/long-lease for base-load operations, 40% short-lease for seasonal surge capacity (Diwali, e-commerce sales), and 20% shared/overflow for demand spikes. IoT-enabled warehouse management systems with predictive capacity planning achieve 92% accuracy in forecasting 90-day space requirements, enabling proactive lease decisions 6 months ahead of need.",
  },
];

export default function WarehouseSpaceCapacityPlannerView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "warehouse", label: "Warehouse", options: WAREHOUSES.map(w => ({ value: w, count: records.filter(r => r.warehouse === w).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "locationType", label: "Type", options: LOCATION_TYPES.map(l => ({ value: l, count: records.filter(r => r.locationType === l).length })) },
    { key: "status", label: "Status", options: CAPACITY_STATUS.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.locationId.toLowerCase().includes(q) && !r.skuAssigned.toLowerCase().includes(q) && !r.warehouse.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(
      ([k, vs]) => vs.includes(r[k as keyof LocationRecord] as string)
    );
  });

  return (
    <div className="wsp-root p-6 space-y-6">
      <PageHeader
        title="Warehouse Space & Capacity Planner"
        description="Location utilization analytics, slotting optimization, cube utilization monitoring and warehouse expansion planning"
      />
      <div className="wsp-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`wsp-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-amber-600 text-white" : "text-gray-600 hover:bg-amber-50"}`}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="wsp-dash space-y-6">
          <div className="wsp-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.l} className="wsp-kpi bg-white rounded-lg border p-4">
                <div className="text-xs text-gray-500 wsp-kpi-label">{k.l}</div>
                <div className="text-2xl font-bold text-amber-700 wsp-kpi-val">{k.v}</div>
                <div className="text-xs text-gray-400 wsp-kpi-sub">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="wsp-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly Capacity Utilization Breakdown</h3>
              <BarChart data={monthlyUtil} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis domain={[0, 100]} /><Tooltip /><Legend />
                <Bar dataKey="utilized" fill="#b45309" radius={[4, 4, 0, 0]} name="Utilized %" />
                <Bar dataKey="reserved" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Reserved %" />
                <Bar dataKey="maintenance" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Maintenance %" />
              </BarChart>
            </div>
            <div className="wsp-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Zone Utilization Heatmap</h3>
              <BarChart data={zoneUtil} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" /><YAxis domain={[40, 100]} /><Tooltip />
                <Bar dataKey="v" fill="#d97706" radius={[4, 4, 0, 0]} name="Utilization %" />
              </BarChart>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="wsp-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Cube vs Weight Utilization Trend</h3>
              <LineChart data={cubeUtilTrend} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis domain={[50, 100]} /><Tooltip /><Legend />
                <Line type="monotone" dataKey="cubePct" stroke="#b45309" strokeWidth={2} name="Cube %" />
                <Line type="monotone" dataKey="weightPct" stroke="#f59e0b" strokeWidth={2} name="Weight %" />
              </LineChart>
            </div>
            <div className="wsp-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Location Type Distribution</h3>
              <PieChart width={400} height={220}>
                <Pie data={locTypeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {locTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="wsp-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Warehouse", href: "#" }, { label: "Location Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="wsp-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {"ID,Location ID,Warehouse,Zone,Aisle,Rack,LVL,Pos,Type,SKU,Cap %,Cube %,Wt %,Status,Last Put,Last Pick,Turnover,Pallets"
                    .split(",").map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const rowCls = r.status === "Over Capacity" ? "wsp-row-critical bg-red-50" : r.status === "Near Capacity" || r.status === "Under Maintenance" ? "wsp-row-warning bg-amber-50" : "";
                  return (
                    <tr key={r.id} className={`border-b hover:bg-amber-50/50 ${rowCls}`}>
                      <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                      <td className="px-3 py-2"><span className="wsp-badge inline-block px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700 font-mono">{r.locationId}</span></td>
                      <td className="px-3 py-2 text-xs">{r.warehouse}</td>
                      <td className="px-3 py-2"><span className="wsp-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">{r.zone.split(" - ")[0]}</span></td>
                      <td className="px-3 py-2 text-xs">{r.aisle}</td>
                      <td className="px-3 py-2 text-xs">{r.rack}</td>
                      <td className="px-3 py-2 text-xs">{r.level}</td>
                      <td className="px-3 py-2 text-xs">{r.position}</td>
                      <td className="px-3 py-2"><span className="wsp-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.locationType}</span></td>
                      <td className="px-3 py-2 text-xs font-mono">{r.skuAssigned}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${r.capacityPct > 100 ? "text-red-600" : r.capacityPct > 85 ? "text-amber-600" : r.capacityPct > 60 ? "text-green-600" : "text-slate-400"}`}>{r.capacityPct}%</span>
                          <div className="w-14 h-1.5 bg-gray-200 rounded">
                            <div className="wsp-capbar h-1.5 rounded" style={{ width: `${Math.min(100, r.capacityPct)}%`, background: r.capacityPct > 100 ? "#ef4444" : r.capacityPct > 85 ? "#f59e0b" : "#22c55e" }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs">{r.cubeUtilPct}%</td>
                      <td className="px-3 py-2 text-xs">{r.weightPct}%</td>
                      <td className="px-3 py-2"><span className={`wsp-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                      <td className="px-3 py-2 text-xs text-gray-500">{r.lastPutaway.split(" ")[1]}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{r.lastPick.split(" ")[1]}</td>
                      <td className="px-3 py-2 text-xs font-medium">{r.turnoverRate}x</td>
                      <td className="px-3 py-2 text-xs">{r.palletsOccupied}/{r.palletCapacity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="wsp-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="wsp-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Utilization by Warehouse</h3>
              <BarChart data={whUtil} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[50, 100]} /><Tooltip />
                <Bar dataKey="v" fill="#b45309" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
            <div className="wsp-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Turnover Rate Distribution</h3>
              <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], high: ri(8, 16, 12 + Math.sin(i * 0.5) * 3), medium: ri(3, 7, 5 + Math.cos(i * 0.6) * 1.5), low: ri(0.5, 3, 1.8 + Math.sin(i * 0.8) * 0.8) }))} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#b45309" fill="#fef3c7" name="High (8x+)" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#d97706" fill="#fbbf24" name="Medium (3-8x)" />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Low (&lt;3x)" />
              </AreaChart>
            </div>
          </div>
          <div className="wsp-chart bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">Warehouse Expansion Plan: Projected vs Actual Capacity</h3>
            <LineChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], projected: +(ri(75, 92, 82 + i * 0.5)).toFixed(1), actual: +(ri(68, 88, 75 + i * 0.8)).toFixed(1) }))} height={240}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" /><YAxis domain={[60, 100]} /><Tooltip /><Legend />
              <Line type="monotone" dataKey="projected" stroke="#b45309" strokeWidth={2} strokeDasharray="5 5" name="Projected %" />
              <Line type="monotone" dataKey="actual" stroke="#d97706" strokeWidth={2} name="Actual %" />
            </LineChart>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="wsp-insights grid grid-cols-2 gap-6">
          {INSIGHTS.map(ins => (
            <div key={ins.t} className="wsp-insight bg-white rounded-lg border p-5">
              <h3 className="text-base font-bold text-amber-800 mb-2">{ins.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
