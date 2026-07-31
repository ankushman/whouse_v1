"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#b45309", "#d97706", "#f59e0b", "#fbbf24", "#fde68a", "#92400e", "#78350f", "#451a03"];
const PRODUCTS = ["Phulkari Bagh Shawl", "Phulkari Chope Wedding Dupatta", "Phulkari Tilpatra Scarf", "Phulkari Neelakshi stole", "Phulkari Sainchi Frock Panel", "Phulkari Chamba Rumal Border", "Phulkari Darshan Dwar Curtain", "Phulkari Suber Phulkari Frame"];
const ARTISANS = ["Amritsar Phulkari Cluster PB", "Patiala Handloom Guild PB", "Ludhiana Embroidery Society PB", "Jalandhar Craft Collective PB", "Bathinda Heritage Arts PB", "Firozpur Rural Phulkari PB", "Mohali Traditional Cluster PB", "Hoshiarpur Silk Society PB"];
const STATUSES = ["GI Punjab Phulkari Mark", "Thread Tension QC Check", "Punjab Khadi Certification", "Pattern Geometric Symmetry", "Silk Floss Colour Fastness", "Traditional Bagh Fidelity Audit"];

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}

interface ShipmentRecord {
  id: string;
  product: string;
  artisan: string;
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
  const ok = status.includes("QC") || status.includes("Certif");
  return <span style={{ background: ok ? "#16a34a22" : "#dc262622", color: ok ? "#16a34a" : "#dc2626", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 18000) * 100);
  return <div style={{ width: "100%", height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}><div className="phk-cost-bar" style={{ width: `${pct}%`, height: "100%", background: COLORS[0], borderRadius: 4 }} /></div>;
}

function HealthRing({ health }: { health: number }) {
  const r = 20, sw = 4, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, health) / 100);
  const col = health >= 80 ? "#16a34a" : health >= 50 ? "#d97706" : "#dc2626";
  return <svg width={52} height={52}><circle cx={26} cy={26} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={26} cy={26} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" className="phk-health-ring" transform="rotate(-90 26 26)" /><text x={26} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={col}>{health}%</text></svg>;
}

function KpiTile({ label, value, unit }: { label: string; value: number; unit: string }) {
  return <Card><CardContent className="phk-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: "#b45309" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function ValueTile({ label, value }: { label: string; value: string }) {
  return <Card><CardContent className="phk-value"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>{value}</div></CardContent></Card>;
}

function genRecords(offset: number): ShipmentRecord[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `PHK-${String(offset + i + 1).padStart(4, "0")}`,
    product: PRODUCTS[(offset + i) % PRODUCTS.length],
    artisan: ARTISANS[(offset + i) % ARTISANS.length],
    status: STATUSES[(offset + i) % STATUSES.length],
    cost: ri(2500, 18000, 5000 + ((offset + i) * 371) % 15500),
    revenue: ri(4000, 28000, 8000 + ((offset + i) * 523) % 24000),
    quantity: ri(5, 250, 20 + ((offset + i) * 13) % 231),
    health: ri(28, 100, 55 + ((offset + i) * 7) % 46),
    date: `2026-0${((offset + i) % 6) + 1}-${String(((offset + i) % 28) + 1).padStart(2, "0")}`,
  }));
}

const hand: ShipmentRecord[] = [
  { id: "PHK-0001", product: "Phulkari Bagh Shawl", artisan: "Amritsar Phulkari Cluster PB", status: "GI Punjab Phulkari Mark", cost: 12400, revenue: 22600, quantity: 85, health: 94, date: "2026-01-07" },
  { id: "PHK-0002", product: "Phulkari Chope Wedding Dupatta", artisan: "Patiala Handloom Guild PB", status: "Thread Tension QC Check", cost: 8900, revenue: 15200, quantity: 62, health: 88, date: "2026-01-14" },
  { id: "PHK-0003", product: "Phulkari Tilpatra Scarf", artisan: "Ludhiana Embroidery Society PB", status: "Punjab Khadi Certification", cost: 6700, revenue: 11800, quantity: 148, health: 72, date: "2026-02-03" },
  { id: "PHK-0004", product: "Phulkari Neelakshi stole", artisan: "Jalandhar Craft Collective PB", status: "Pattern Geometric Symmetry", cost: 15200, revenue: 26400, quantity: 38, health: 96, date: "2026-02-18" },
  { id: "PHK-0005", product: "Phulkari Sainchi Frock Panel", artisan: "Bathinda Heritage Arts PB", status: "Silk Floss Colour Fastness", cost: 9100, revenue: 17800, quantity: 94, health: 81, date: "2026-03-05" },
  { id: "PHK-0006", product: "Phulkari Chamba Rumal Border", artisan: "Firozpur Rural Phulkari PB", status: "Traditional Bagh Fidelity Audit", cost: 11400, revenue: 20100, quantity: 56, health: 90, date: "2026-03-19" },
  { id: "PHK-0007", product: "Phulkari Darshan Dwar Curtain", artisan: "Mohali Traditional Cluster PB", status: "GI Punjab Phulkari Mark", cost: 16800, revenue: 27500, quantity: 22, health: 97, date: "2026-04-02" },
  { id: "PHK-0008", product: "Phulkari Suber Phulkari Frame", artisan: "Hoshiarpur Silk Society PB", status: "Thread Tension QC Check", cost: 7300, revenue: 13900, quantity: 110, health: 76, date: "2026-04-15" },
  { id: "PHK-0009", product: "Phulkari Bagh Shawl", artisan: "Amritsar Phulkari Cluster PB", status: "Punjab Khadi Certification", cost: 13500, revenue: 24800, quantity: 48, health: 92, date: "2026-05-01" },
  { id: "PHK-0010", product: "Phulkari Chope Wedding Dupatta", artisan: "Patiala Handloom Guild PB", status: "Pattern Geometric Symmetry", cost: 5600, revenue: 10200, quantity: 175, health: 65, date: "2026-05-14" },
  { id: "PHK-0011", product: "Phulkari Tilpatra Scarf", artisan: "Ludhiana Embroidery Society PB", status: "Silk Floss Colour Fastness", cost: 14100, revenue: 23100, quantity: 33, health: 93, date: "2026-05-28" },
  { id: "PHK-0012", product: "Phulkari Neelakshi stole", artisan: "Jalandhar Craft Collective PB", status: "Traditional Bagh Fidelity Audit", cost: 10200, revenue: 18700, quantity: 71, health: 84, date: "2026-06-10" },
  { id: "PHK-0013", product: "Phulkari Sainchi Frock Panel", artisan: "Bathinda Heritage Arts PB", status: "GI Punjab Phulkari Mark", cost: 8200, revenue: 14600, quantity: 128, health: 78, date: "2026-06-22" },
  { id: "PHK-0014", product: "Phulkari Chamba Rumal Border", artisan: "Firozpur Rural Phulkari PB", status: "Thread Tension QC Check", cost: 15900, revenue: 25200, quantity: 41, health: 95, date: "2026-07-05" },
  { id: "PHK-0015", product: "Phulkari Darshan Dwar Curtain", artisan: "Mohali Traditional Cluster PB", status: "Punjab Khadi Certification", cost: 4800, revenue: 8900, quantity: 200, health: 58, date: "2026-07-18" },
  { id: "PHK-0016", product: "Phulkari Suber Phulkari Frame", artisan: "Hoshiarpur Silk Society PB", status: "Pattern Geometric Symmetry", cost: 11700, revenue: 21300, quantity: 67, health: 87, date: "2026-01-22" },
  { id: "PHK-0017", product: "Phulkari Bagh Shawl", artisan: "Amritsar Phulkari Cluster PB", status: "Silk Floss Colour Fastness", cost: 9800, revenue: 17400, quantity: 89, health: 80, date: "2026-02-09" },
  { id: "PHK-0018", product: "Phulkari Chope Wedding Dupatta", artisan: "Patiala Handloom Guild PB", status: "Traditional Bagh Fidelity Audit", cost: 14300, revenue: 24600, quantity: 35, health: 94, date: "2026-03-12" },
  { id: "PHK-0019", product: "Phulkari Tilpatra Scarf", artisan: "Ludhiana Embroidery Society PB", status: "GI Punjab Phulkari Mark", cost: 7600, revenue: 13100, quantity: 142, health: 73, date: "2026-04-22" },
  { id: "PHK-0020", product: "Phulkari Neelakshi stole", artisan: "Jalandhar Craft Collective PB", status: "Thread Tension QC Check", cost: 12900, revenue: 22100, quantity: 52, health: 91, date: "2026-05-08" },
];

const gen = [...genRecords(20), ...genRecords(40)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "product", label: "Product", options: PRODUCTS.map(p => ({ label: p, value: p, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "artisan", label: "Artisan", options: ARTISANS.map(a => ({ label: a, value: a, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "status", label: "Status", options: STATUSES.map(s => ({ label: s, value: s, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "Punjab GI Certification", desc: "Phulkari has received GI registration from Punjab government, ensuring authentic origin labelling and protecting traditional artisans from counterfeit reproductions across domestic and export markets." },
  { title: "Geometric Pattern Heritage", desc: "Traditional Phulkari motifs follow precise geometric principles passed down through generations. Each Bagh pattern requires minimum 200 stitches per square centimetre for certification compliance." },
  { title: "Wedding Dupatta Demand", desc: "Bridal Chope Phulkari dupattas command premium pricing of 18,000 to 28,000 INR. The wedding season accounts for 45% of annual revenue with peak months from October through February." },
  { title: "Punjab Khadi Revival", desc: "Government Khadi certification programme has increased raw material sourcing from Punjab cooperatives by 32%, providing sustainable income to over 4,200 rural Phulkari artisans." },
];

export default function PhulkariEmbroideryPunjabLogisticsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filteredShipments = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.artisan.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalShipments = allRecords.length;
  const filteredCount = filteredShipments.length;
  const totalRevenue = allRecords.reduce((s, r) => s + r.revenue, 0);
  const avgHealth = Math.round(allRecords.reduce((s, r) => s + r.health, 0) / allRecords.length);

  const pieData = PRODUCTS.map((p, i) => ({ name: p, value: Math.round(allRecords.filter(r => r.product === p).reduce((s, r) => s + r.revenue, 0)) }));

  return (
    <div className="phk-root">
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "/" }, { label: "Phulkari Embroidery Punjab" }]} />
      <PageHeader title="Phulkari Embroidery Punjab Logistics" description="Punjab Phulkari heritage embroidery supply chain management — artisan production tracking, GI certification monitoring, and traditional craft distribution analytics" />
      <Tabs defaultValue="dashboard">
        <TabsList className="phk-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="shipments">Shipments</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="phk-kpi-grid"><KpiTile label="Total Shipments" value={totalShipments} unit="" /><KpiTile label="Total Revenue" value={totalRevenue} unit=" INR" /><KpiTile label="Avg Health" value={avgHealth} unit="%" /><KpiTile label="Products" value={PRODUCTS.length} unit="" /></div>
          <div className="phk-chart-row"><Card><CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader><CardContent><AreaChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#b45309" fill="#b4530922" /></AreaChart></CardContent></Card></div>
          <div className="phk-chart-row"><Card><CardHeader><CardTitle>Cost Distribution</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="cost" fill="#d97706" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="shipments">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalShipments} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID, artisan, or product..." />
          <div className="phk-table-wrap"><table className="phk-table"><thead><tr><th>ID</th><th>Product</th><th>Artisan</th><th>Status</th><th>Cost</th><th>Revenue</th><th>Qty</th><th>Health</th></tr></thead><tbody>{filteredShipments.map(r => (<tr key={r.id}><td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td><td><ProductBadge product={r.product} /></td><td style={{ fontSize: 12 }}>{r.artisan}</td><td><StatusBadge status={r.status} /></td><td><CostBar cost={r.cost} /><span style={{ fontSize: 11, color: "#6b7280" }}>₹{r.cost.toLocaleString()}</span></td><td style={{ fontWeight: 600, fontSize: 12, color: "#16a34a" }}>₹{r.revenue.toLocaleString()}</td><td style={{ fontSize: 12, textAlign: "center" }}>{r.quantity}</td><td><HealthRing health={r.health} /></td></tr>))}</tbody></table></div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="phk-chart-row"><Card><CardHeader><CardTitle>Revenue by Product</CardTitle></CardHeader><CardContent><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={11}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="phk-chart-row"><Card><CardHeader><CardTitle>Health Trend</CardTitle></CardHeader><CardContent><LineChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="health" stroke="#92400e" strokeWidth={2} /></LineChart></CardContent></Card></div>
          <div className="phk-chart-row"><Card><CardHeader><CardTitle>Quantity vs Revenue</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="quantity" fill="#f59e0b" /><Bar dataKey="revenue" fill="#b45309" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="phk-insights-grid">{insights.map((ins, i) => <Card key={i} className="phk-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
































































































