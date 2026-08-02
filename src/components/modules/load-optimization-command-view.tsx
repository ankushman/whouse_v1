"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#b91c1c", "#991b1b", "#7f1d1d", "#fef2f2"];
const WAREHOUSES = ["Mumbai Central MH", "Delhi Mega DC DL", "Bangalore Campus KA", "Chennai Terminal TN", "Kolkata Hub WB", "Hyderabad Park TS", "Pune West MH", "Jaipur North RJ"];
const LOAD_TYPES = ["FTL", "PTL", "LTL", "Parcel", "Bulk", "Oversized", "Hazmat", "Temperature Controlled"];
const OPT_STATUS = ["Optimized", "Pending Review", "Consolidated", "Split", "Rejected", "Manual Override"];
const VEHICLES = ["20ft Container", "32ft Trailer", "40ft Trailer", "Open Truck", "Reefer Van", "Flatbed", "Tanker", "Multi-Axle"];

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)); }

interface LoadRecord {
  id: string;
  warehouse: string;
  loadType: string;
  status: string;
  vehicle: string;
  originPin: string;
  destPin: string;
  weight: number;
  volume: number;
  capacityUsed: number;
  costPerKg: number;
  totalCost: number;
  savings: number;
  consolidationGain: number;
  deadhead: number;
  priority: string;
  eta: string;
}

function WarehouseBadge({ warehouse }: { warehouse: string }) {
  const c = COLORS[WAREHOUSES.indexOf(warehouse) % COLORS.length];
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block", minWidth: 90, textAlign: "center" }}>{warehouse.split(" ").slice(0, 2).join(" ")}</span>;
}

function LoadTypeBadge({ loadType }: { loadType: string }) {
  const colors: Record<string, string> = { "FTL": "#7c3aed", "PTL": "#0891b2", "LTL": "#d97706", "Parcel": "#16a34a", "Bulk": "#dc2626", "Oversized": "#b45309", "Hazmat": "#dc2626", "Temperature Controlled": "#2563eb" };
  const c = colors[loadType] || "#6b7280";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>{loadType}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { "Optimized": "#16a34a", "Pending Review": "#d97706", "Consolidated": "#0891b2", "Split": "#7c3aed", "Rejected": "#dc2626", "Manual Override": "#6b7280" };
  const c = colors[status] || "#6b7280";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

function CapacityBar({ used }: { used: number }) {
  const pct = ri(0, 100, used);
  const col = used >= 95 ? "#dc2626" : used >= 80 ? "#d97706" : used >= 50 ? "#0891b2" : "#16a34a";
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 70, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 3 }} /></div><span style={{ fontSize: 11, fontWeight: 600, color: col }}>{used}%</span></div>;
}

function SavingsBadge({ savings }: { savings: number }) {
  const positive = savings >= 0;
  return <span style={{ background: positive ? "#16a34a22" : "#dc262622", color: positive ? "#16a34a" : "#dc2626", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{positive ? "+" : ""}{savings}%</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = { "Critical": "#dc2626", "High": "#d97706", "Medium": "#0891b2", "Low": "#6b7280" };
  const c = colors[priority] || "#6b7280";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{priority}</span>;
}

function DeadheadRing({ deadhead }: { deadhead: number }) {
  const r = 18, sw = 3, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, deadhead) / 100);
  const col = deadhead <= 10 ? "#16a34a" : deadhead <= 25 ? "#d97706" : "#dc2626";
  return <svg width={44} height={44}><circle cx={22} cy={22} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={22} cy={22} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 22 22)" /><text x={22} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={col}>{deadhead}%</text></svg>;
}

function KpiTile({ label, value, unit, color }: { label: string; value: number; unit: string; color?: string }) {
  return <Card><CardContent className="loc-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: color || "#dc2626" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function genRecords(offset: number): LoadRecord[] {
  return Array.from({ length: 16 }, (_, i) => ({
    id: `LOC-${String(offset + i + 1).padStart(4, "0")}`,
    warehouse: WAREHOUSES[(offset + i) % WAREHOUSES.length],
    loadType: LOAD_TYPES[(offset + i) % LOAD_TYPES.length],
    status: OPT_STATUS[(offset + i) % OPT_STATUS.length],
    vehicle: VEHICLES[(offset + i) % VEHICLES.length],
    originPin: `PIN-${String(400000 + ((offset + i) * 1300) % 500000).padStart(6, "0")}`,
    destPin: `PIN-${String(100000 + ((offset + i) * 900) % 400000).padStart(6, "0")}`,
    weight: ri(200, 28000, 500 + ((offset + i) * 1700) % 27500),
    volume: ri(2, 65, 5 + ((offset + i) * 7) % 60),
    capacityUsed: ri(25, 100, 30 + ((offset + i) * 9) % 70),
    costPerKg: ri(1.2, 12.5, 1.5 + ((offset + i) * 1.1) % 11),
    totalCost: ri(3500, 85000, 5000 + ((offset + i) * 5200) % 80000),
    savings: ri(-15, 38, -10 + ((offset + i) * 8) % 48),
    consolidationGain: ri(0, 35, ((offset + i) * 5) % 35),
    deadhead: ri(3, 45, 5 + ((offset + i) * 7) % 40),
    priority: ["Critical", "High", "Medium", "Low"][(offset + i) % 4],
    eta: `2026-08-${String(((offset + i) % 28) + 1).padStart(2, "0")} ${String(((offset + i) % 12) + 8).padStart(2, "0")}:00`,
  }));
}

const hand: LoadRecord[] = [
  { id: "LOC-0001", warehouse: "Mumbai Central MH", loadType: "FTL", status: "Optimized", vehicle: "40ft Trailer", originPin: "PIN-400001", destPin: "PIN-110001", weight: 22000, volume: 55, capacityUsed: 92, costPerKg: 2.8, totalCost: 61600, savings: 28, consolidationGain: 22, deadhead: 8, priority: "Critical", eta: "2026-08-03 06:00" },
  { id: "LOC-0002", warehouse: "Delhi Mega DC DL", loadType: "PTL", status: "Consolidated", vehicle: "32ft Trailer", originPin: "PIN-110002", destPin: "PIN-560001", weight: 8500, volume: 32, capacityUsed: 78, costPerKg: 4.2, totalCost: 35700, savings: 18, consolidationGain: 15, deadhead: 12, priority: "High", eta: "2026-08-03 14:00" },
  { id: "LOC-0003", warehouse: "Bangalore Campus KA", loadType: "Temperature Controlled", status: "Optimized", vehicle: "Reefer Van", originPin: "PIN-560002", destPin: "PIN-600001", weight: 4200, volume: 18, capacityUsed: 85, costPerKg: 8.5, totalCost: 35700, savings: 12, consolidationGain: 8, deadhead: 5, priority: "Critical", eta: "2026-08-03 08:00" },
  { id: "LOC-0004", warehouse: "Chennai Terminal TN", loadType: "LTL", status: "Pending Review", vehicle: "Open Truck", originPin: "PIN-600002", destPin: "PIN-700001", weight: 3200, volume: 22, capacityUsed: 55, costPerKg: 5.1, totalCost: 16320, savings: -5, consolidationGain: 0, deadhead: 32, priority: "Medium", eta: "2026-08-04 10:00" },
  { id: "LOC-0005", warehouse: "Kolkata Hub WB", loadType: "Bulk", status: "Optimized", vehicle: "Flatbed", originPin: "PIN-700002", destPin: "PIN-500001", weight: 25000, volume: 60, capacityUsed: 96, costPerKg: 1.5, totalCost: 37500, savings: 35, consolidationGain: 30, deadhead: 4, priority: "High", eta: "2026-08-03 12:00" },
  { id: "LOC-0006", warehouse: "Hyderabad Park TS", loadType: "Hazmat", status: "Manual Override", vehicle: "Tanker", originPin: "PIN-500002", destPin: "PIN-380001", weight: 18000, volume: 42, capacityUsed: 88, costPerKg: 6.8, totalCost: 122400, savings: -2, consolidationGain: 5, deadhead: 15, priority: "Critical", eta: "2026-08-04 06:00" },
  { id: "LOC-0007", warehouse: "Pune West MH", loadType: "Parcel", status: "Split", vehicle: "20ft Container", originPin: "PIN-411001", destPin: "PIN-302001", weight: 1200, volume: 8, capacityUsed: 42, costPerKg: 9.2, totalCost: 11040, savings: 22, consolidationGain: 18, deadhead: 10, priority: "Low", eta: "2026-08-05 16:00" },
  { id: "LOC-0008", warehouse: "Jaipur North RJ", loadType: "Oversized", status: "Pending Review", vehicle: "Multi-Axle", originPin: "PIN-302001", destPin: "PIN-122001", weight: 28000, volume: 65, capacityUsed: 98, costPerKg: 3.1, totalCost: 86800, savings: -12, consolidationGain: 0, deadhead: 38, priority: "High", eta: "2026-08-04 18:00" },
  { id: "LOC-0009", warehouse: "Mumbai Central MH", loadType: "FTL", status: "Optimized", vehicle: "40ft Trailer", originPin: "PIN-400003", destPin: "PIN-682001", weight: 19500, volume: 48, capacityUsed: 86, costPerKg: 3.5, totalCost: 68250, savings: 25, consolidationGain: 20, deadhead: 6, priority: "Medium", eta: "2026-08-05 08:00" },
  { id: "LOC-0010", warehouse: "Delhi Mega DC DL", loadType: "PTL", status: "Consolidated", vehicle: "32ft Trailer", originPin: "PIN-110003", destPin: "PIN-226001", weight: 7800, volume: 28, capacityUsed: 72, costPerKg: 4.8, totalCost: 37440, savings: 15, consolidationGain: 12, deadhead: 14, priority: "Low", eta: "2026-08-06 10:00" },
];

const gen = [...genRecords(10), ...genRecords(26), ...genRecords(42)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "warehouse", label: "Warehouse", options: WAREHOUSES.map(w => ({ label: w.split(" ").slice(0, 2).join(" "), value: w, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "loadType", label: "Load Type", options: LOAD_TYPES.map(l => ({ label: l, value: l, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "status", label: "Status", options: OPT_STATUS.map(s => ({ label: s, value: s, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "priority", label: "Priority", options: ["Critical", "High", "Medium", "Low"].map(p => ({ label: p, value: p, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "FTL-PTL Consolidation Engine", desc: "The load consolidation algorithm identifies 15-20% of PTL shipments that can be merged into FTL loads, reducing per-kg transportation cost by 22-35%. In July 2026, the engine processed 2,400 consolidation opportunities, executing 1,680 merges that saved 4.2Cr in transportation costs. The system considers time windows, weight compatibility, and destination proximity to generate optimal consolidation pairs." },
  { title: "Deadhead Minimization Routing", desc: "Empty return trips (deadhead) account for 18% of total fleet distance, costing an estimated 6.8Cr monthly. The deadhead minimization algorithm matches available return capacity with nearby pickup opportunities, reducing deadhead from 28% to 12% on the Mumbai-Delhi-Nagpur triangle. Real-time repositioning alerts push drivers toward high-demand pickup zones within 50km radius of their delivery endpoint." },
  { title: "Multi-Stop Route Optimization", desc: "Parcels and LTL shipments with 3-8 delivery stops achieve 30% distance reduction through AI-sequenced routing. The algorithm considers delivery time windows, vehicle capacity constraints, road conditions, and driver hours-of-service regulations. Bangalore urban deliveries show the highest improvement at 38% distance reduction, while long-haul multi-stop routes average 25% improvement." },
  { title: "Oversized and Hazmat Load Planning", desc: "Specialized loads (oversized, hazmat, temperature-controlled) require custom vehicle assignments and route planning. The system maintains a dedicated vehicle pool with real-time availability tracking. Hazmat loads automatically trigger regulatory compliance checks including route restrictions, driver certification verification, and emergency response planning. Temperature-controlled loads integrate with cold chain monitoring for continuous quality assurance." },
];

export default function LoadOptimizationCommandView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.originPin.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalRecords = allRecords.length;
  const filteredCount = filtered.length;
  const avgSavings = Math.round(allRecords.reduce((s, r) => s + r.savings, 0) / allRecords.length);
  const totalCost = allRecords.reduce((s, r) => s + r.totalCost, 0);
  const avgCapacity = Math.round(allRecords.reduce((s, r) => s + r.capacityUsed, 0) / allRecords.length);
  const avgDeadhead = Math.round(allRecords.reduce((s, r) => s + r.deadhead, 0) / allRecords.length);

  const statusData = OPT_STATUS.map(s => ({ name: s, count: allRecords.filter(r => r.status === s).length }));
  const typeData = LOAD_TYPES.map(l => {
    const recs = allRecords.filter(r => r.loadType === l);
    return { name: l, avgCost: Math.round(recs.reduce((s, r) => s + r.totalCost, 0) / Math.max(recs.length, 1) / 1000), savings: Math.round(recs.reduce((s, r) => s + r.savings, 0) / Math.max(recs.length, 1)) };
  });
  const whData = WAREHOUSES.map(w => {
    const recs = allRecords.filter(r => r.warehouse === w);
    return { name: w.split(" ").slice(0, 2).join(" "), capacity: Math.round(recs.reduce((s, r) => s + r.capacityUsed, 0) / Math.max(recs.length, 1)), deadhead: Math.round(recs.reduce((s, r) => s + r.deadhead, 0) / Math.max(recs.length, 1)) };
  });

  return (
    <div className="loc-root">
      <ModuleBreadcrumb items={[{ label: "Operations", href: "/" }, { label: "Load Optimization Command" }]} />
      <PageHeader title="Load Optimization Command" description="AI-driven load consolidation, FTL-PTL optimization, deadhead minimization, and multi-stop route planning with real-time capacity analytics across 8 Indian warehouses" />
      <Tabs defaultValue="dashboard">
        <TabsList className="loc-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="loads">Loads</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="loc-kpi-grid">
            <KpiTile label="Total Loads" value={totalRecords} unit="" />
            <KpiTile label="Avg Savings" value={avgSavings} unit="%" color="#16a34a" />
            <KpiTile label="Total Cost" value={Math.round(totalCost / 100000)} unit="L" color="#d97706" />
            <KpiTile label="Avg Deadhead" value={avgDeadhead} unit="%" color="#dc2626" />
          </div>
          <div className="loc-chart-row"><Card><CardHeader><CardTitle>Optimization Status Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={110} label fontSize={10}>{OPT_STATUS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="loc-chart-row"><Card><CardHeader><CardTitle>Cost vs Savings by Load Type</CardTitle></CardHeader><CardContent><BarChart data={typeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={9} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="avgCost" fill="#dc2626" radius={[4, 4, 0, 0]} /><Bar dataKey="savings" fill="#16a34a" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
          <div className="loc-chart-row"><Card><CardHeader><CardTitle>Capacity Utilization vs Deadhead by Warehouse</CardTitle></CardHeader><CardContent><LineChart data={whData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="capacity" stroke="#dc2626" strokeWidth={2} /><Line type="monotone" dataKey="deadhead" stroke="#d97706" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="loads">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalRecords} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID or PIN code..." />
          <div className="loc-table-wrap">
            <table className="loc-table">
              <thead><tr><th>ID</th><th>WH</th><th>Type</th><th>Status</th><th>Vehicle</th><th>Route</th><th>Weight</th><th>Cap.</th><th>Cost/kg</th><th>Total</th><th>Savings</th><th>Deadhead</th><th>Priority</th></tr></thead>
              <tbody>{filtered.map(r => (
                <tr key={r.id} className={r.status === "Rejected" || r.priority === "Critical" && r.deadhead > 30 ? "loc-row-critical" : r.status === "Pending Review" ? "loc-row-warning" : ""}>
                  <td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td>
                  <td><WarehouseBadge warehouse={r.warehouse} /></td>
                  <td><LoadTypeBadge loadType={r.loadType} /></td>
                  <td><StatusBadge status={r.status} /></td>
                  <td style={{ fontSize: 11 }}>{r.vehicle}</td>
                  <td style={{ fontSize: 10, color: "#6b7280" }}>{r.originPin.replace("PIN-", "")} &#8594; {r.destPin.replace("PIN-", "")}</td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>{(r.weight / 1000).toFixed(1)}t</td>
                  <td><CapacityBar used={r.capacityUsed} /></td>
                  <td style={{ fontSize: 12 }}>\u20b9{r.costPerKg.toFixed(1)}</td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>\u20b9{(r.totalCost / 1000).toFixed(1)}K</td>
                  <td><SavingsBadge savings={r.savings} /></td>
                  <td><DeadheadRing deadhead={r.deadhead} /></td>
                  <td><PriorityBadge priority={r.priority} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="loc-chart-row"><Card><CardHeader><CardTitle>Load Type Volume</CardTitle></CardHeader><CardContent><BarChart data={LOAD_TYPES.map(l => ({ name: l, count: allRecords.filter(r => r.loadType === l).length }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={9} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
          <div className="loc-chart-row"><Card><CardHeader><CardTitle>Weight Distribution</CardTitle></CardHeader><CardContent><AreaChart data={allRecords.slice(0, 30).map(r => ({ name: r.id, weight: Math.round(r.weight / 1000), volume: r.volume }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={9} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="weight" stroke="#dc2626" fill="#dc262622" /><Area type="monotone" dataKey="volume" stroke="#0891b2" fill="#0891b222" /></AreaChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="loc-insights-grid">{insights.map((ins, i) => <Card key={i} className="loc-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
