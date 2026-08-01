"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#a78bfa", "#c4b5fd", "#4c1d95", "#2e1065"];
const PRODUCTS = ["Refrigerator Locker Large", "Grocery Pickup Medium", "Parcel Drop Standard", "Pharmacy Cold Storage", "E-Commerce Mini Locker", "Last-Mile Hub Locker", "Restaurant Meal Pickup", "Dry Cleaning Collection"];
const WAREHOUSES = ["Mumbai Central Hub MH", "Delhi Connaught Place DL", "Bangalore Koramangala KA", "Hyderabad Banjara Hills TS", "Chennai T Nagar TN", "Pune Hinjewadi MH", "Kolkata Salt Lake WB", "Jaipur MI Road RJ"];
const STATUSES = ["Locker Unit Operational", "Temperature Sensor Calibrated", "Lock Mechanism QC Certified", "Compartments Availability Optimal", "QR Code Scan Test Verified", "Last-Mile Integration Test"];

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}

interface ShipmentRecord {
  id: string;
  product: string;
  warehouse: string;
  status: string;
  cost: number;
  revenue: number;
  quantity: number;
  health: number;
  date: string;
}

function ProductBadge({ product }: { product: string }) {
  const c = COLORS[PRODUCTS.indexOf(product) % COLORS.length];
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block", minWidth: 100, textAlign: "center" }}>{product}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const ok = status.includes("Operational") || status.includes("Certified") || status.includes("Verified");
  return <span style={{ background: ok ? "#16a34a22" : "#dc262622", color: ok ? "#16a34a" : "#dc2626", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 20000) * 100);
  return <div style={{ width: "100%", height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}><div className="slf-cost-bar" style={{ width: `${pct}%`, height: "100%", background: COLORS[0], borderRadius: 4 }} /></div>;
}

function HealthRing({ health }: { health: number }) {
  const r = 20, sw = 4, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, health) / 100);
  const col = health >= 80 ? "#16a34a" : health >= 50 ? "#d97706" : "#dc2626";
  return <svg width={52} height={52}><circle cx={26} cy={26} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={26} cy={26} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" className="slf-health-ring" transform="rotate(-90 26 26)" /><text x={26} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={col}>{health}%</text></svg>;
}

function KpiTile({ label, value, unit }: { label: string; value: number; unit: string }) {
  return <Card><CardContent className="slf-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: "#8b5cf6" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function ValueTile({ label, value }: { label: string; value: string }) {
  return <Card><CardContent className="slf-value"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>{value}</div></CardContent></Card>;
}

function genRecords(offset: number): ShipmentRecord[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `SLF-${String(offset + i + 1).padStart(4, "0")}`,
    product: PRODUCTS[(offset + i) % PRODUCTS.length],
    warehouse: WAREHOUSES[(offset + i) % WAREHOUSES.length],
    status: STATUSES[(offset + i) % STATUSES.length],
    cost: ri(3000, 20000, 5000 + ((offset + i) * 389) % 15000),
    revenue: ri(6000, 35000, 10000 + ((offset + i) * 541) % 25000),
    quantity: ri(4, 200, 12 + ((offset + i) * 15) % 189),
    health: ri(26, 100, 48 + ((offset + i) * 11) % 53),
    date: `2026-0${((offset + i) % 6) + 1}-${String(((offset + i) % 28) + 1).padStart(2, "0")}`,
  }));
}

const hand: ShipmentRecord[] = [
  { id: "SLF-0001", product: "Refrigerator Locker Large", warehouse: "Mumbai Central Hub MH", status: "Locker Unit Operational", cost: 16800, revenue: 30200, quantity: 32, health: 95, date: "2026-01-04" },
  { id: "SLF-0002", product: "Grocery Pickup Medium", warehouse: "Delhi Connaught Place DL", status: "Temperature Sensor Calibrated", cost: 9200, revenue: 17800, quantity: 78, health: 85, date: "2026-01-16" },
  { id: "SLF-0003", product: "Parcel Drop Standard", warehouse: "Bangalore Koramangala KA", status: "Lock Mechanism QC Certified", cost: 12400, revenue: 23600, quantity: 45, health: 90, date: "2026-02-03" },
  { id: "SLF-0004", product: "Pharmacy Cold Storage", warehouse: "Hyderabad Banjara Hills TS", status: "Compartments Availability Optimal", cost: 18200, revenue: 32800, quantity: 18, health: 97, date: "2026-02-18" },
  { id: "SLF-0005", product: "E-Commerce Mini Locker", warehouse: "Chennai T Nagar TN", status: "QR Code Scan Test Verified", cost: 7500, revenue: 15100, quantity: 95, health: 78, date: "2026-03-05" },
  { id: "SLF-0006", product: "Last-Mile Hub Locker", warehouse: "Pune Hinjewadi MH", status: "Last-Mile Integration Test", cost: 14100, revenue: 26400, quantity: 38, health: 92, date: "2026-03-20" },
  { id: "SLF-0007", product: "Restaurant Meal Pickup", warehouse: "Kolkata Salt Lake WB", status: "Locker Unit Operational", cost: 5800, revenue: 11800, quantity: 120, health: 73, date: "2026-04-04" },
  { id: "SLF-0008", product: "Dry Cleaning Collection", warehouse: "Jaipur MI Road RJ", status: "Temperature Sensor Calibrated", cost: 11400, revenue: 21800, quantity: 52, health: 86, date: "2026-04-18" },
  { id: "SLF-0009", product: "Refrigerator Locker Large", warehouse: "Mumbai Central Hub MH", status: "Lock Mechanism QC Certified", cost: 15600, revenue: 28900, quantity: 28, health: 93, date: "2026-05-02" },
  { id: "SLF-0010", product: "Grocery Pickup Medium", warehouse: "Delhi Connaught Place DL", status: "Compartments Availability Optimal", cost: 8800, revenue: 17200, quantity: 82, health: 81, date: "2026-05-15" },
  { id: "SLF-0011", product: "Parcel Drop Standard", warehouse: "Bangalore Koramangala KA", status: "QR Code Scan Test Verified", cost: 13200, revenue: 25200, quantity: 40, health: 89, date: "2026-06-01" },
  { id: "SLF-0012", product: "Pharmacy Cold Storage", warehouse: "Hyderabad Banjara Hills TS", status: "Last-Mile Integration Test", cost: 19600, revenue: 34500, quantity: 15, health: 98, date: "2026-06-14" },
  { id: "SLF-0013", product: "E-Commerce Mini Locker", warehouse: "Chennai T Nagar TN", status: "Locker Unit Operational", cost: 6200, revenue: 12600, quantity: 108, health: 76, date: "2026-07-01" },
  { id: "SLF-0014", product: "Last-Mile Hub Locker", warehouse: "Pune Hinjewadi MH", status: "Temperature Sensor Calibrated", cost: 14800, revenue: 27600, quantity: 35, health: 91, date: "2026-07-12" },
  { id: "SLF-0015", product: "Restaurant Meal Pickup", warehouse: "Kolkata Salt Lake WB", status: "Lock Mechanism QC Certified", cost: 8100, revenue: 15800, quantity: 88, health: 80, date: "2026-01-22" },
  { id: "SLF-0016", product: "Dry Cleaning Collection", warehouse: "Jaipur MI Road RJ", status: "Compartments Availability Optimal", cost: 11800, revenue: 22400, quantity: 48, health: 87, date: "2026-02-10" },
  { id: "SLF-0017", product: "Refrigerator Locker Large", warehouse: "Mumbai Central Hub MH", status: "QR Code Scan Test Verified", cost: 17200, revenue: 31500, quantity: 25, health: 94, date: "2026-03-12" },
  { id: "SLF-0018", product: "Grocery Pickup Medium", warehouse: "Delhi Connaught Place DL", status: "Last-Mile Integration Test", cost: 9600, revenue: 18400, quantity: 70, health: 83, date: "2026-04-08" },
  { id: "SLF-0019", product: "Parcel Drop Standard", warehouse: "Bangalore Koramangala KA", status: "Locker Unit Operational", cost: 12800, revenue: 24600, quantity: 42, health: 88, date: "2026-05-22" },
  { id: "SLF-0020", product: "Pharmacy Cold Storage", warehouse: "Hyderabad Banjara Hills TS", status: "Temperature Sensor Calibrated", cost: 20100, revenue: 35800, quantity: 12, health: 99, date: "2026-06-20" },
];

const gen = [...genRecords(20), ...genRecords(40)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "product", label: "Locker Type", options: PRODUCTS.map(p => ({ label: p, value: p, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "warehouse", label: "Hub", options: WAREHOUSES.map(w => ({ label: w, value: w, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "status", label: "Status", options: STATUSES.map(s => ({ label: s, value: s, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "IoT Locker Fleet Management", desc: "Smart locker fleets across India now deploy over 15,000 IoT-enabled units with real-time occupancy monitoring, temperature sensing for Refrigerator units, and automated maintenance alerts. Fleet utilisation averages 78% during peak hours across metropolitan hubs." },
  { title: "Refrigerator Locker Expansion", desc: "Temperature-controlled Refrigerator locker demand has surged 52% since 2025, driven by pharmaceutical last-mile delivery and grocery cold chain requirements. Each Refrigerator Locker unit maintains 2 to 8 degrees Celsius with continuous IoT monitoring and automated defrost cycles." },
  { title: "QR Code Access Revolution", desc: "QR code-based access has replaced 94% of traditional key-based locker systems, reducing average retrieval time from 45 seconds to 8 seconds. The system integrates with major e-commerce platforms for automated pickup notifications and OTP-free secure access." },
  { title: "Last-Mile Integration Hub", desc: "Smart lockers serve as micro-fulfilment hubs for last-mile delivery, reducing failed delivery attempts by 68%. Each hub processes 150 to 400 parcels daily with automated sorting into compartment sizes, real-time inventory tracking, and same-day return processing capabilities." },
];

export default function SmartLockerFleetView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filteredShipments = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.warehouse.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalShipments = allRecords.length;
  const filteredCount = filteredShipments.length;
  const totalRevenue = allRecords.reduce((s, r) => s + r.revenue, 0);
  const avgHealth = Math.round(allRecords.reduce((s, r) => s + r.health, 0) / allRecords.length);

  const pieData = PRODUCTS.map((p, i) => ({ name: p, value: Math.round(allRecords.filter(r => r.product === p).reduce((s, r) => s + r.revenue, 0)) }));

  return (
    <div className="slf-root">
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "/" }, { label: "Smart Locker Fleet" }]} />
      <PageHeader title="Smart Locker Fleet Management" description="IoT-enabled smart locker fleet operations — compartment utilisation tracking, temperature monitoring, and last-mile delivery hub analytics" />
      <Tabs defaultValue="dashboard">
        <TabsList className="slf-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="shipments">Shipments</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="slf-kpi-grid"><KpiTile label="Total Lockers" value={totalShipments} unit="" /><KpiTile label="Total Revenue" value={totalRevenue} unit=" INR" /><KpiTile label="Avg Health" value={avgHealth} unit="%" /><KpiTile label="Hubs" value={WAREHOUSES.length} unit="" /></div>
          <div className="slf-chart-row"><Card><CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader><CardContent><AreaChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf622" /></AreaChart></CardContent></Card></div>
          <div className="slf-chart-row"><Card><CardHeader><CardTitle>Cost Distribution</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="cost" fill="#7c3aed" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="shipments">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalShipments} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID, hub, or locker type..." />
          <div className="slf-table-wrap"><table className="slf-table"><thead><tr><th>ID</th><th>Locker Type</th><th>Hub</th><th>Status</th><th>Cost</th><th>Revenue</th><th>Qty</th><th>Health</th></tr></thead><tbody>{filteredShipments.map(r => (<tr key={r.id}><td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td><td><ProductBadge product={r.product} /></td><td style={{ fontSize: 12 }}>{r.warehouse}</td><td><StatusBadge status={r.status} /></td><td><CostBar cost={r.cost} /><span style={{ fontSize: 11, color: "#6b7280" }}>₹{r.cost.toLocaleString()}</span></td><td style={{ fontWeight: 600, fontSize: 12, color: "#16a34a" }}>₹{r.revenue.toLocaleString()}</td><td style={{ fontSize: 12, textAlign: "center" }}>{r.quantity}</td><td><HealthRing health={r.health} /></td></tr>))}</tbody></table></div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="slf-chart-row"><Card><CardHeader><CardTitle>Revenue by Locker Type</CardTitle></CardHeader><CardContent><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={11}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="slf-chart-row"><Card><CardHeader><CardTitle>Health Trend</CardTitle></CardHeader><CardContent><LineChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="health" stroke="#5b21b6" strokeWidth={2} /></LineChart></CardContent></Card></div>
          <div className="slf-chart-row"><Card><CardHeader><CardTitle>Quantity vs Revenue</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="quantity" fill="#a78bfa" /><Bar dataKey="revenue" fill="#8b5cf6" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="slf-insights-grid">{insights.map((ins, i) => <Card key={i} className="slf-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
































































































