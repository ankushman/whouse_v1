"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#6d28d9", "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#5b21b6", "#4c1d95", "#2e1065"];
const PRODUCTS = ["Tarakasi Jali Pendant Set", "Tarakasi Kundan Earrings", "Tarakasi Filigree Anklet", "Tarakasi Silver Nose Ring", "Tarakasi Temple Idol Frame", "Tarakasi Floral Hair Pin Set", "Tarakasi Peacock Brooch", "Tarakasi Bridal Matha Patti"];
const ARTISANS = ["Cuttack Tarakasi Guild OR", "Bhubaneswar Silver Society OR", "Puri Filigree Cluster OR", "Sambalpur Artisan Collective OR", "Balasore Silver Workshop OR", "Ganjam Heritage Craft OR", "Koraput Tribal Silver OR", "Rourkela Metal Art OR"];
const STATUSES = ["GI Odisha Tarakasi Mark", "Silver Purity Assay Test", "Filigree Wire Gauge QC Check", "Solder Joint Integrity Test", "Design Fidelity Certification", "BIS Hallmark Compliance Audit"];

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
  const ok = status.includes("Certif") || status.includes("Mark") || status.includes("BIS");
  return <span style={{ background: ok ? "#16a34a22" : "#dc262622", color: ok ? "#16a34a" : "#dc2626", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 22000) * 100);
  return <div style={{ width: "100%", height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}><div className="tkf-cost-bar" style={{ width: `${pct}%`, height: "100%", background: COLORS[0], borderRadius: 4 }} /></div>;
}

function HealthRing({ health }: { health: number }) {
  const r = 20, sw = 4, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, health) / 100);
  const col = health >= 80 ? "#16a34a" : health >= 50 ? "#d97706" : "#dc2626";
  return <svg width={52} height={52}><circle cx={26} cy={26} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={26} cy={26} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" className="tkf-health-ring" transform="rotate(-90 26 26)" /><text x={26} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={col}>{health}%</text></svg>;
}

function KpiTile({ label, value, unit }: { label: string; value: number; unit: string }) {
  return <Card><CardContent className="tkf-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: "#6d28d9" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function ValueTile({ label, value }: { label: string; value: string }) {
  return <Card><CardContent className="tkf-value"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>{value}</div></CardContent></Card>;
}

function genRecords(offset: number): ShipmentRecord[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `TKF-${String(offset + i + 1).padStart(4, "0")}`,
    product: PRODUCTS[(offset + i) % PRODUCTS.length],
    artisan: ARTISANS[(offset + i) % ARTISANS.length],
    status: STATUSES[(offset + i) % STATUSES.length],
    cost: ri(2000, 22000, 4000 + ((offset + i) * 311) % 18000),
    revenue: ri(5000, 38000, 9000 + ((offset + i) * 499) % 29000),
    quantity: ri(3, 120, 8 + ((offset + i) * 11) % 113),
    health: ri(25, 100, 50 + ((offset + i) * 13) % 51),
    date: `2026-0${((offset + i) % 6) + 1}-${String(((offset + i) % 28) + 1).padStart(2, "0")}`,
  }));
}

const hand: ShipmentRecord[] = [
  { id: "TKF-0001", product: "Tarakasi Jali Pendant Set", artisan: "Cuttack Tarakasi Guild OR", status: "GI Odisha Tarakasi Mark", cost: 14800, revenue: 27600, quantity: 35, health: 95, date: "2026-01-05" },
  { id: "TKF-0002", product: "Tarakasi Kundan Earrings", artisan: "Bhubaneswar Silver Society OR", status: "Silver Purity Assay Test", cost: 8200, revenue: 15400, quantity: 78, health: 88, date: "2026-01-12" },
  { id: "TKF-0003", product: "Tarakasi Filigree Anklet", artisan: "Puri Filigree Cluster OR", status: "Filigree Wire Gauge QC Check", cost: 11300, revenue: 20800, quantity: 52, health: 82, date: "2026-02-01" },
  { id: "TKF-0004", product: "Tarakasi Silver Nose Ring", artisan: "Sambalpur Artisan Collective OR", status: "Solder Joint Integrity Test", cost: 5600, revenue: 11200, quantity: 95, health: 76, date: "2026-02-14" },
  { id: "TKF-0005", product: "Tarakasi Temple Idol Frame", artisan: "Balasore Silver Workshop OR", status: "Design Fidelity Certification", cost: 19500, revenue: 34200, quantity: 12, health: 97, date: "2026-03-02" },
  { id: "TKF-0006", product: "Tarakasi Floral Hair Pin Set", artisan: "Ganjam Heritage Craft OR", status: "BIS Hallmark Compliance Audit", cost: 6800, revenue: 13100, quantity: 88, health: 84, date: "2026-03-16" },
  { id: "TKF-0007", product: "Tarakasi Peacock Brooch", artisan: "Koraput Tribal Silver OR", status: "GI Odisha Tarakasi Mark", cost: 17200, revenue: 29800, quantity: 22, health: 93, date: "2026-04-03" },
  { id: "TKF-0008", product: "Tarakasi Bridal Matha Patti", artisan: "Rourkela Metal Art OR", status: "Silver Purity Assay Test", cost: 20400, revenue: 36400, quantity: 8, health: 98, date: "2026-04-18" },
  { id: "TKF-0009", product: "Tarakasi Jali Pendant Set", artisan: "Cuttack Tarakasi Guild OR", status: "Filigree Wire Gauge QC Check", cost: 12600, revenue: 23100, quantity: 42, health: 87, date: "2026-05-04" },
  { id: "TKF-0010", product: "Tarakasi Kundan Earrings", artisan: "Bhubaneswar Silver Society OR", status: "Solder Joint Integrity Test", cost: 7900, revenue: 14700, quantity: 82, health: 79, date: "2026-05-18" },
  { id: "TKF-0011", product: "Tarakasi Filigree Anklet", artisan: "Puri Filigree Cluster OR", status: "Design Fidelity Certification", cost: 16100, revenue: 28500, quantity: 28, health: 91, date: "2026-06-01" },
  { id: "TKF-0012", product: "Tarakasi Silver Nose Ring", artisan: "Sambalpur Artisan Collective OR", status: "BIS Hallmark Compliance Audit", cost: 4900, revenue: 9800, quantity: 105, health: 72, date: "2026-06-15" },
  { id: "TKF-0013", product: "Tarakasi Temple Idol Frame", artisan: "Balasore Silver Workshop OR", status: "GI Odisha Tarakasi Mark", cost: 18800, revenue: 33200, quantity: 15, health: 96, date: "2026-07-02" },
  { id: "TKF-0014", product: "Tarakasi Floral Hair Pin Set", artisan: "Ganjam Heritage Craft OR", status: "Silver Purity Assay Test", cost: 9400, revenue: 17600, quantity: 65, health: 85, date: "2026-07-15" },
  { id: "TKF-0015", product: "Tarakasi Peacock Brooch", artisan: "Koraput Tribal Silver OR", status: "Filigree Wire Gauge QC Check", cost: 13800, revenue: 25100, quantity: 32, health: 89, date: "2026-01-20" },
  { id: "TKF-0016", product: "Tarakasi Bridal Matha Patti", artisan: "Rourkela Metal Art OR", status: "Solder Joint Integrity Test", cost: 21000, revenue: 37200, quantity: 6, health: 99, date: "2026-02-08" },
  { id: "TKF-0017", product: "Tarakasi Jali Pendant Set", artisan: "Cuttack Tarakasi Guild OR", status: "Design Fidelity Certification", cost: 11500, revenue: 21200, quantity: 48, health: 83, date: "2026-03-22" },
  { id: "TKF-0018", product: "Tarakasi Kundan Earrings", artisan: "Bhubaneswar Silver Society OR", status: "BIS Hallmark Compliance Audit", cost: 8700, revenue: 16300, quantity: 72, health: 80, date: "2026-04-10" },
  { id: "TKF-0019", product: "Tarakasi Filigree Anklet", artisan: "Puri Filigree Cluster OR", status: "GI Odisha Tarakasi Mark", cost: 15600, revenue: 27800, quantity: 25, health: 92, date: "2026-05-26" },
  { id: "TKF-0020", product: "Tarakasi Silver Nose Ring", artisan: "Sambalpur Artisan Collective OR", status: "Silver Purity Assay Test", cost: 6200, revenue: 12400, quantity: 90, health: 77, date: "2026-06-20" },
];

const gen = [...genRecords(20), ...genRecords(40)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "product", label: "Product", options: PRODUCTS.map(p => ({ label: p, value: p, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "artisan", label: "Artisan", options: ARTISANS.map(a => ({ label: a, value: a, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "status", label: "Status", options: STATUSES.map(s => ({ label: s, value: s, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "Cuttack Filigree Heritage", desc: "Tarakasi silver filigree from Cuttack, Odisha, is a 500-year-old artisanal tradition. Each piece requires hand-twisting 92.5% sterling silver wires into intricate lace-like patterns, with master artisans completing complex Jali work at 15-20 pieces per month." },
  { title: "BIS Hallmark Mandate", desc: "Government of India mandates BIS hallmarking for all silver jewellery above 20 grams. Tarakasi artisans now require certified assay testing at government-approved centres, adding 3-5 business days to production cycles for compliance verification." },
  { title: "Export Market Expansion", desc: "Tarakasi filigree exports have grown 34% year-over-year, with primary markets in the United States, United Kingdom, and Middle East. Bridal Matha Patti and Jali Pendant Sets command premium international pricing of 400 to 800 USD per set." },
  { title: "Apprentice Training Pipeline", desc: "Odisha State Handicrafts Department has established 12 new Tarakasi training centres, enrolling over 800 apprentices. The programme aims to address the critical shortage of skilled filigree artisans, with only 2,400 active master craftsmen remaining statewide." },
];

export default function TarakasiSilverFiligreeOdishaLogisticsView() {
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
    <div className="tkf-root">
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "/" }, { label: "Tarakasi Silver Filigree Odisha" }]} />
      <PageHeader title="Tarakasi Silver Filigree Odisha Logistics" description="Odisha Tarakasi silver filigree craft supply chain — artisan production tracking, BIS hallmark certification monitoring, and heritage jewellery distribution analytics" />
      <Tabs defaultValue="dashboard">
        <TabsList className="tkf-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="shipments">Shipments</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="tkf-kpi-grid"><KpiTile label="Total Shipments" value={totalShipments} unit="" /><KpiTile label="Total Revenue" value={totalRevenue} unit=" INR" /><KpiTile label="Avg Health" value={avgHealth} unit="%" /><KpiTile label="Products" value={PRODUCTS.length} unit="" /></div>
          <div className="tkf-chart-row"><Card><CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader><CardContent><AreaChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#6d28d9" fill="#6d28d922" /></AreaChart></CardContent></Card></div>
          <div className="tkf-chart-row"><Card><CardHeader><CardTitle>Cost Distribution</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="cost" fill="#7c3aed" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="shipments">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalShipments} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID, artisan, or product..." />
          <div className="tkf-table-wrap"><table className="tkf-table"><thead><tr><th>ID</th><th>Product</th><th>Artisan</th><th>Status</th><th>Cost</th><th>Revenue</th><th>Qty</th><th>Health</th></tr></thead><tbody>{filteredShipments.map(r => (<tr key={r.id}><td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td><td><ProductBadge product={r.product} /></td><td style={{ fontSize: 12 }}>{r.artisan}</td><td><StatusBadge status={r.status} /></td><td><CostBar cost={r.cost} /><span style={{ fontSize: 11, color: "#6b7280" }}>₹{r.cost.toLocaleString()}</span></td><td style={{ fontWeight: 600, fontSize: 12, color: "#16a34a" }}>₹{r.revenue.toLocaleString()}</td><td style={{ fontSize: 12, textAlign: "center" }}>{r.quantity}</td><td><HealthRing health={r.health} /></td></tr>))}</tbody></table></div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="tkf-chart-row"><Card><CardHeader><CardTitle>Revenue by Product</CardTitle></CardHeader><CardContent><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={11}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="tkf-chart-row"><Card><CardHeader><CardTitle>Health Trend</CardTitle></CardHeader><CardContent><LineChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="health" stroke="#5b21b6" strokeWidth={2} /></LineChart></CardContent></Card></div>
          <div className="tkf-chart-row"><Card><CardHeader><CardTitle>Quantity vs Revenue</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="quantity" fill="#a78bfa" /><Bar dataKey="revenue" fill="#6d28d9" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="tkf-insights-grid">{insights.map((ins, i) => <Card key={i} className="tkf-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
































































































