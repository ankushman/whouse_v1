"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e", "#38bdf8", "#7dd3fc", "#bae6fd"];
const PRODUCTS = ["Container Expat Cargo", "Bulk Commodity Shipment", "Perishable Cross-Trade", "Hazardous Material Pack", "Document Courier Pack", "Oversized Equipment Move", "Pharmaceutical Temperature", "E-Commerce Parcel Batch"];
const WAREHOUSES = ["Nhava Sheva Gateway MH", "Tughlakabad ICD Delhi DL", "Chennai Auto Hub Terminal TN", "Kolkata Land Port WB", "Mundra Special Economic GJ", "Kandla Free Zone Gujarat GJ", "Cochin Maritime Terminal KL", "Visakhapatnam Port AP"];
const STATUSES = ["Customs Clearance Verified", "Port Authority Certified", "Container Inspection QC", "Dangerous Goods Compliance", "Phytosanitary Clearance Done", "Freight Audit Reconciled"];

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}

interface ShipmentRecord {
  id: string;
  product: string;
  port: string;
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
  const ok = status.includes("Verified") || status.includes("Certif") || status.includes("Done");
  return <span style={{ background: ok ? "#16a34a22" : "#dc262622", color: ok ? "#16a34a" : "#dc2626", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 35000) * 100);
  return <div style={{ width: "100%", height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}><div className="cbl-cost-bar" style={{ width: `${pct}%`, height: "100%", background: COLORS[0], borderRadius: 4 }} /></div>;
}

function HealthRing({ health }: { health: number }) {
  const r = 20, sw = 4, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, health) / 100);
  const col = health >= 80 ? "#16a34a" : health >= 50 ? "#d97706" : "#dc2626";
  return <svg width={52} height={52}><circle cx={26} cy={26} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={26} cy={26} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" className="cbl-health-ring" transform="rotate(-90 26 26)" /><text x={26} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={col}>{health}%</text></svg>;
}

function KpiTile({ label, value, unit }: { label: string; value: number; unit: string }) {
  return <Card><CardContent className="cbl-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: "#0ea5e9" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function ValueTile({ label, value }: { label: string; value: string }) {
  return <Card><CardContent className="cbl-value"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>{value}</div></CardContent></Card>;
}

function genRecords(offset: number): ShipmentRecord[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `XBD-${String(offset + i + 1).padStart(4, "0")}`,
    product: PRODUCTS[(offset + i) % PRODUCTS.length],
    port: WAREHOUSES[(offset + i) % WAREHOUSES.length],
    status: STATUSES[(offset + i) % STATUSES.length],
    cost: ri(5000, 35000, 8000 + ((offset + i) * 437) % 27000),
    revenue: ri(8000, 52000, 15000 + ((offset + i) * 671) % 37000),
    quantity: ri(2, 180, 10 + ((offset + i) * 17) % 169),
    health: ri(22, 100, 50 + ((offset + i) * 11) % 51),
    date: `2026-0${((offset + i) % 6) + 1}-${String(((offset + i) % 28) + 1).padStart(2, "0")}`,
  }));
}

const hand: ShipmentRecord[] = [
  { id: "XBD-0001", product: "Container Expat Cargo", port: "Nhava Sheva Gateway MH", status: "Customs Clearance Verified", cost: 22400, revenue: 41600, quantity: 45, health: 92, date: "2026-01-04" },
  { id: "XBD-0002", product: "Bulk Commodity Shipment", port: "Tughlakabad ICD Delhi DL", status: "Port Authority Certified", cost: 15800, revenue: 29300, quantity: 120, health: 85, date: "2026-01-11" },
  { id: "XBD-0003", product: "Perishable Cross-Trade", port: "Chennai Auto Hub Terminal TN", status: "Container Inspection QC", cost: 28700, revenue: 48200, quantity: 18, health: 78, date: "2026-02-01" },
  { id: "XBD-0004", product: "Hazardous Material Pack", port: "Kolkata Land Port WB", status: "Dangerous Goods Compliance", cost: 31200, revenue: 50100, quantity: 8, health: 96, date: "2026-02-15" },
  { id: "XBD-0005", product: "Document Courier Pack", port: "Mundra Special Economic GJ", status: "Phytosanitary Clearance Done", cost: 6400, revenue: 12800, quantity: 200, health: 71, date: "2026-03-02" },
  { id: "XBD-0006", product: "Oversized Equipment Move", port: "Kandla Free Zone Gujarat GJ", status: "Freight Audit Reconciled", cost: 27500, revenue: 46800, quantity: 3, health: 94, date: "2026-03-18" },
  { id: "XBD-0007", product: "Pharmaceutical Temperature", port: "Cochin Maritime Terminal KL", status: "Customs Clearance Verified", cost: 19800, revenue: 35400, quantity: 62, health: 88, date: "2026-04-05" },
  { id: "XBD-0008", product: "E-Commerce Parcel Batch", port: "Visakhapatnam Port AP", status: "Port Authority Certified", cost: 8900, revenue: 17600, quantity: 150, health: 74, date: "2026-04-20" },
  { id: "XBD-0009", product: "Container Expat Cargo", port: "Nhava Sheva Gateway MH", status: "Container Inspection QC", cost: 24100, revenue: 43900, quantity: 38, health: 91, date: "2026-05-03" },
  { id: "XBD-0010", product: "Bulk Commodity Shipment", port: "Tughlakabad ICD Delhi DL", status: "Dangerous Goods Compliance", cost: 13500, revenue: 25700, quantity: 95, health: 82, date: "2026-05-16" },
  { id: "XBD-0011", product: "Perishable Cross-Trade", port: "Chennai Auto Hub Terminal TN", status: "Phytosanitary Clearance Done", cost: 30200, revenue: 49800, quantity: 14, health: 97, date: "2026-06-01" },
  { id: "XBD-0012", product: "Hazardous Material Pack", port: "Kolkata Land Port WB", status: "Freight Audit Reconciled", cost: 17800, revenue: 32100, quantity: 72, health: 79, date: "2026-06-14" },
  { id: "XBD-0013", product: "Document Courier Pack", port: "Mundra Special Economic GJ", status: "Customs Clearance Verified", cost: 5100, revenue: 10200, quantity: 175, health: 68, date: "2026-06-28" },
  { id: "XBD-0014", product: "Oversized Equipment Move", port: "Kandla Free Zone Gujarat GJ", status: "Port Authority Certified", cost: 26300, revenue: 44500, quantity: 5, health: 93, date: "2026-01-18" },
  { id: "XBD-0015", product: "Pharmaceutical Temperature", port: "Cochin Maritime Terminal KL", status: "Container Inspection QC", cost: 22100, revenue: 39800, quantity: 55, health: 86, date: "2026-02-10" },
  { id: "XBD-0016", product: "E-Commerce Parcel Batch", port: "Visakhapatnam Port AP", status: "Dangerous Goods Compliance", cost: 9600, revenue: 18900, quantity: 130, health: 75, date: "2026-03-08" },
  { id: "XBD-0017", product: "Container Expat Cargo", port: "Nhava Sheva Gateway MH", status: "Phytosanitary Clearance Done", cost: 25600, revenue: 47100, quantity: 28, health: 90, date: "2026-04-12" },
  { id: "XBD-0018", product: "Bulk Commodity Shipment", port: "Tughlakabad ICD Delhi DL", status: "Freight Audit Reconciled", cost: 14200, revenue: 26800, quantity: 108, health: 83, date: "2026-05-22" },
  { id: "XBD-0019", product: "Perishable Cross-Trade", port: "Chennai Auto Hub Terminal TN", status: "Customs Clearance Verified", cost: 29400, revenue: 48900, quantity: 16, health: 95, date: "2026-06-08" },
  { id: "XBD-0020", product: "Hazardous Material Pack", port: "Kolkata Land Port WB", status: "Port Authority Certified", cost: 33000, revenue: 51500, quantity: 6, health: 98, date: "2026-07-02" },
];

const gen = [...genRecords(20), ...genRecords(40)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "product", label: "Cargo Type", options: PRODUCTS.map(p => ({ label: p, value: p, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "port", label: "Port", options: WAREHOUSES.map(w => ({ label: w, value: w, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "status", label: "Status", options: STATUSES.map(s => ({ label: s, value: s, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "Customs Digital Processing", desc: "Indian Customs has implemented AI-powered document processing at major ports, reducing average clearance time from 48 hours to 12 hours for standard container shipments through the ICEGATE platform integration." },
  { title: "Transit Trade Growth", desc: "India's transit trade volume has increased 28% year-over-year, with Nhava Sheva and Mundra handling 65% of total cross-border container throughput. Special Economic Zones contribute 40% of export value." },
  { title: "Pharmaceutical Cold Chain", desc: "Temperature-sensitive pharmaceutical exports require continuous monitoring between 2 and 8 degrees Celsius throughout cross-border transit, with IoT sensor compliance now mandatory at all major ports." },
  { title: "Dangerous Goods Protocol", desc: "New IMDG Code amendments require enhanced labelling and emergency response documentation for all Class 3, 6, and 9 dangerous goods shipments. Non-compliance penalties increased to 500,000 INR per violation." },
];

export default function CrossBorderLogisticsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filteredShipments = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.port.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalShipments = allRecords.length;
  const filteredCount = filteredShipments.length;
  const totalRevenue = allRecords.reduce((s, r) => s + r.revenue, 0);
  const avgHealth = Math.round(allRecords.reduce((s, r) => s + r.health, 0) / allRecords.length);

  const pieData = PRODUCTS.map((p, i) => ({ name: p, value: Math.round(allRecords.filter(r => r.product === p).reduce((s, r) => s + r.revenue, 0)) }));

  return (
    <div className="cbl-root">
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "/" }, { label: "Cross-Border Hub" }]} />
      <PageHeader title="Cross-Border Logistics Hub" description="International trade gateway operations — customs clearance management, multi-port cargo tracking, and cross-border freight compliance monitoring" />
      <Tabs defaultValue="dashboard">
        <TabsList className="cbl-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="shipments">Shipments</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="cbl-kpi-grid"><KpiTile label="Total Shipments" value={totalShipments} unit="" /><KpiTile label="Total Revenue" value={totalRevenue} unit=" INR" /><KpiTile label="Avg Health" value={avgHealth} unit="%" /><KpiTile label="Products" value={PRODUCTS.length} unit="" /></div>
          <div className="cbl-chart-row"><Card><CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader><CardContent><AreaChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="#0ea5e922" /></AreaChart></CardContent></Card></div>
          <div className="cbl-chart-row"><Card><CardHeader><CardTitle>Cost Distribution</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="cost" fill="#0284c7" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="shipments">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalShipments} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID, port, or cargo..." />
          <div className="cbl-table-wrap"><table className="cbl-table"><thead><tr><th>ID</th><th>Cargo</th><th>Port</th><th>Status</th><th>Cost</th><th>Revenue</th><th>Qty</th><th>Health</th></tr></thead><tbody>{filteredShipments.map(r => (<tr key={r.id}><td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td><td><ProductBadge product={r.product} /></td><td style={{ fontSize: 12 }}>{r.port}</td><td><StatusBadge status={r.status} /></td><td><CostBar cost={r.cost} /><span style={{ fontSize: 11, color: "#6b7280" }}>₹{r.cost.toLocaleString()}</span></td><td style={{ fontWeight: 600, fontSize: 12, color: "#16a34a" }}>₹{r.revenue.toLocaleString()}</td><td style={{ fontSize: 12, textAlign: "center" }}>{r.quantity}</td><td><HealthRing health={r.health} /></td></tr>))}</tbody></table></div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="cbl-chart-row"><Card><CardHeader><CardTitle>Revenue by Cargo Type</CardTitle></CardHeader><CardContent><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={11}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="cbl-chart-row"><Card><CardHeader><CardTitle>Health Trend</CardTitle></CardHeader><CardContent><LineChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="health" stroke="#0369a1" strokeWidth={2} /></LineChart></CardContent></Card></div>
          <div className="cbl-chart-row"><Card><CardHeader><CardTitle>Quantity vs Revenue</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="quantity" fill="#38bdf8" /><Bar dataKey="revenue" fill="#0ea5e9" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="cbl-insights-grid">{insights.map((ins, i) => <Card key={i} className="cbl-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
































































































