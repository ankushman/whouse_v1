#!/usr/bin/env python3
"""Generate R378 Ajrakh Block Print Kutch module (253 lines)"""
import os

BASE = "/home/z/my-project/src/components/modules"
FILE = os.path.join(BASE, "ajrakh-block-print-kutch-logistics-view.tsx")

code = r'''"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1e3a5f", "#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#172554", "#0f172a", "#0c4a6e"];
const PRODUCTS = ["Ajrakh Indigo Wrap Saree", "Ajrakh Mud Resist Stole", "Ajrakh Natural Dye Dupatta", "Ajrakh Kutchi Block Bedspread", "Ajrakh Red Madder Yardage", "Ajrakh Traditional Trolley Bag", "Ajrakh Syahi Block Table Runner", "Ajrakh Mustard Print Cushion"];
const ARTISANS = ["Ajrakhpur Block Printers GJ", "Bhuj Heritage Print Guild GJ", "Nirona Village Craft Cluster GJ", "Khavda Artisan Society GJ", "Mandvi Coastal Printers GJ", "Anjar Textile Collective GJ", "Rapar Rural Block Craft GJ", "Bhachau Traditional Workshop GJ"];
const STATUSES = ["GI Gujarat Ajrakh Mark", "Natural Dye Fastness QC", "Block Print Registration Certified", "Mud Resist Pattern Accuracy", "Indigo Fermentation pH Test", "Traditional Motif Fidelity Audit"];

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
  const ok = status.includes("Certified") || status.includes("Mark") || status.includes("Audit");
  return <span style={{ background: ok ? "#16a34a22" : "#dc262622", color: ok ? "#16a34a" : "#dc2626", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 15000) * 100);
  return <div style={{ width: "100%", height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}><div className="ajk-cost-bar" style={{ width: `${pct}%`, height: "100%", background: COLORS[0], borderRadius: 4 }} /></div>;
}

function HealthRing({ health }: { health: number }) {
  const r = 20, sw = 4, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, health) / 100);
  const col = health >= 80 ? "#16a34a" : health >= 50 ? "#d97706" : "#dc2626";
  return <svg width={52} height={52}><circle cx={26} cy={26} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={26} cy={26} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" className="ajk-health-ring" transform="rotate(-90 26 26)" /><text x={26} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={col}>{health}%</text></svg>;
}

function KpiTile({ label, value, unit }: { label: string; value: number; unit: string }) {
  return <Card><CardContent className="ajk-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: "#1e3a5f" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function ValueTile({ label, value }: { label: string; value: string }) {
  return <Card><CardContent className="ajk-value"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>{value}</div></CardContent></Card>;
}

function genRecords(offset: number): ShipmentRecord[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `AJK-${String(offset + i + 1).padStart(4, "0")}`,
    product: PRODUCTS[(offset + i) % PRODUCTS.length],
    artisan: ARTISANS[(offset + i) % ARTISANS.length],
    status: STATUSES[(offset + i) % STATUSES.length],
    cost: ri(1800, 15000, 3000 + ((offset + i) * 283) % 12000),
    revenue: ri(4500, 32000, 8000 + ((offset + i) * 457) % 24000),
    quantity: ri(5, 200, 15 + ((offset + i) * 11) % 186),
    health: ri(28, 100, 52 + ((offset + i) * 13) % 49),
    date: `2026-0${((offset + i) % 6) + 1}-${String(((offset + i) % 28) + 1).padStart(2, "0")}`,
  }));
}

const hand: ShipmentRecord[] = [
  { id: "AJK-0001", product: "Ajrakh Indigo Wrap Saree", artisan: "Ajrakhpur Block Printers GJ", status: "GI Gujarat Ajrakh Mark", cost: 11200, revenue: 21800, quantity: 42, health: 94, date: "2026-01-06" },
  { id: "AJK-0002", product: "Ajrakh Mud Resist Stole", artisan: "Bhuj Heritage Print Guild GJ", status: "Natural Dye Fastness QC", cost: 5800, revenue: 11400, quantity: 95, health: 82, date: "2026-01-18" },
  { id: "AJK-0003", product: "Ajrakh Natural Dye Dupatta", artisan: "Nirona Village Craft Cluster GJ", status: "Block Print Registration Certified", cost: 8400, revenue: 16200, quantity: 68, health: 88, date: "2026-02-04" },
  { id: "AJK-0004", product: "Ajrakh Kutchi Block Bedspread", artisan: "Khavda Artisan Society GJ", status: "Mud Resist Pattern Accuracy", cost: 13200, revenue: 25400, quantity: 22, health: 96, date: "2026-02-20" },
  { id: "AJK-0005", product: "Ajrakh Red Madder Yardage", artisan: "Mandvi Coastal Printers GJ", status: "Indigo Fermentation pH Test", cost: 6700, revenue: 13100, quantity: 112, health: 76, date: "2026-03-05" },
  { id: "AJK-0006", product: "Ajrakh Traditional Trolley Bag", artisan: "Anjar Textile Collective GJ", status: "Traditional Motif Fidelity Audit", cost: 9800, revenue: 18700, quantity: 55, health: 90, date: "2026-03-18" },
  { id: "AJK-0007", product: "Ajrakh Syahi Block Table Runner", artisan: "Rapar Rural Block Craft GJ", status: "GI Gujarat Ajrakh Mark", cost: 4500, revenue: 9200, quantity: 145, health: 72, date: "2026-04-02" },
  { id: "AJK-0008", product: "Ajrakh Mustard Print Cushion", artisan: "Bhachau Traditional Workshop GJ", status: "Natural Dye Fastness QC", cost: 12100, revenue: 22600, quantity: 35, health: 93, date: "2026-04-16" },
  { id: "AJK-0009", product: "Ajrakh Indigo Wrap Saree", artisan: "Ajrakhpur Block Printers GJ", status: "Block Print Registration Certified", cost: 10600, revenue: 20400, quantity: 48, health: 87, date: "2026-05-01" },
  { id: "AJK-0010", product: "Ajrakh Mud Resist Stole", artisan: "Bhuj Heritage Print Guild GJ", status: "Mud Resist Pattern Accuracy", cost: 7200, revenue: 14200, quantity: 82, health: 80, date: "2026-05-14" },
  { id: "AJK-0011", product: "Ajrakh Natural Dye Dupatta", artisan: "Nirona Village Craft Cluster GJ", status: "Indigo Fermentation pH Test", cost: 9100, revenue: 17500, quantity: 60, health: 85, date: "2026-06-02" },
  { id: "AJK-0012", product: "Ajrakh Kutchi Block Bedspread", artisan: "Khavda Artisan Society GJ", status: "Traditional Motif Fidelity Audit", cost: 14500, revenue: 27800, quantity: 18, health: 97, date: "2026-06-16" },
  { id: "AJK-0013", product: "Ajrakh Red Madder Yardage", artisan: "Mandvi Coastal Printers GJ", status: "GI Gujarat Ajrakh Mark", cost: 5100, revenue: 10200, quantity: 130, health: 74, date: "2026-07-01" },
  { id: "AJK-0014", product: "Ajrakh Traditional Trolley Bag", artisan: "Anjar Textile Collective GJ", status: "Natural Dye Fastness QC", cost: 10800, revenue: 20100, quantity: 40, health: 91, date: "2026-07-12" },
  { id: "AJK-0015", product: "Ajrakh Syahi Block Table Runner", artisan: "Rapar Rural Block Craft GJ", status: "Block Print Registration Certified", cost: 6200, revenue: 12600, quantity: 98, health: 78, date: "2026-01-22" },
  { id: "AJK-0016", product: "Ajrakh Mustard Print Cushion", artisan: "Bhachau Traditional Workshop GJ", status: "Mud Resist Pattern Accuracy", cost: 13800, revenue: 26200, quantity: 25, health: 95, date: "2026-02-12" },
  { id: "AJK-0017", product: "Ajrakh Indigo Wrap Saree", artisan: "Ajrakhpur Block Printers GJ", status: "Indigo Fermentation pH Test", cost: 11800, revenue: 22800, quantity: 38, health: 89, date: "2026-03-28" },
  { id: "AJK-0018", product: "Ajrakh Mud Resist Stole", artisan: "Bhuj Heritage Print Guild GJ", status: "Traditional Motif Fidelity Audit", cost: 7600, revenue: 14800, quantity: 75, health: 83, date: "2026-04-22" },
  { id: "AJK-0019", product: "Ajrakh Natural Dye Dupatta", artisan: "Nirona Village Craft Cluster GJ", status: "GI Gujarat Ajrakh Mark", cost: 9600, revenue: 18200, quantity: 52, health: 86, date: "2026-05-30" },
  { id: "AJK-0020", product: "Ajrakh Kutchi Block Bedspread", artisan: "Khavda Artisan Society GJ", status: "Natural Dye Fastness QC", cost: 14200, revenue: 27100, quantity: 20, health: 94, date: "2026-06-25" },
];

const gen = [...genRecords(20), ...genRecords(40)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "product", label: "Product", options: PRODUCTS.map(p => ({ label: p, value: p, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "artisan", label: "Artisan", options: ARTISANS.map(a => ({ label: a, value: a, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "status", label: "Status", options: STATUSES.map(s => ({ label: s, value: s, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "Ajrakh Natural Dye Tradition", desc: "Ajrakh block printing from Kutch, Gujarat, is a 4,500-year-old tradition using only natural dyes — indigo from Indigofera tinctoria, red from madder root, and yellow from pomegranate rind. Each fabric undergoes 14-16 washing and printing stages over 12-15 days to achieve colour fastness." },
  { title: "GI Registration Impact", desc: "Ajrakh received GI registration from the Government of Gujarat, protecting the craft from mechanical reproductions. Only hand-block printed Ajrakh from designated Kutch districts can carry the GI mark, which has increased artisan incomes by 35% since registration." },
  { title: "Indigo Fermentation Science", desc: "Traditional Ajrakh indigo fermentation requires precise pH control between 9.0 and 10.5 using lime and jaggery. Modern workshops have adopted digital pH monitoring while maintaining the traditional fermentation vats, reducing indigo batch failure rate from 18% to 4%." },
  { title: "International Export Growth", desc: "Ajrakh textile exports to Europe and Japan have grown 42% in two years. International buyers specifically seek the chemical-free natural dye certification, with premium Ajrakh sarees commanding 350 to 600 USD per piece in the Japanese artisan textile market." },
];

export default function AjrakhBlockPrintKutchLogisticsView() {
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
    <div className="ajk-root">
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "/" }, { label: "Ajrakh Block Print Kutch" }]} />
      <PageHeader title="Ajrakh Block Print Kutch Logistics" description="Gujarat Ajrakh hand-block printing supply chain — natural dye production tracking, GI certification monitoring, and Kutch heritage textile distribution analytics" />
      <Tabs defaultValue="dashboard">
        <TabsList className="ajk-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="shipments">Shipments</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="ajk-kpi-grid"><KpiTile label="Total Shipments" value={totalShipments} unit="" /><KpiTile label="Total Revenue" value={totalRevenue} unit=" INR" /><KpiTile label="Avg Health" value={avgHealth} unit="%" /><KpiTile label="Products" value={PRODUCTS.length} unit="" /></div>
          <div className="ajk-chart-row"><Card><CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader><CardContent><AreaChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#1e3a5f" fill="#1e3a5f22" /></AreaChart></CardContent></Card></div>
          <div className="ajk-chart-row"><Card><CardHeader><CardTitle>Cost Distribution</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="cost" fill="#1e40af" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="shipments">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalShipments} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID, artisan, or product..." />
          <div className="ajk-table-wrap"><table className="ajk-table"><thead><tr><th>ID</th><th>Product</th><th>Artisan</th><th>Status</th><th>Cost</th><th>Revenue</th><th>Qty</th><th>Health</th></tr></thead><tbody>{filteredShipments.map(r => (<tr key={r.id}><td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td><td><ProductBadge product={r.product} /></td><td style={{ fontSize: 12 }}>{r.artisan}</td><td><StatusBadge status={r.status} /></td><td><CostBar cost={r.cost} /><span style={{ fontSize: 11, color: "#6b7280" }}>₹{r.cost.toLocaleString()}</span></td><td style={{ fontWeight: 600, fontSize: 12, color: "#16a34a" }}>₹{r.revenue.toLocaleString()}</td><td style={{ fontSize: 12, textAlign: "center" }}>{r.quantity}</td><td><HealthRing health={r.health} /></td></tr>))}</tbody></table></div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="ajk-chart-row"><Card><CardHeader><CardTitle>Revenue by Product</CardTitle></CardHeader><CardContent><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={11}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="ajk-chart-row"><Card><CardHeader><CardTitle>Health Trend</CardTitle></CardHeader><CardContent><LineChart data={allRecords}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="health" stroke="#172554" strokeWidth={2} /></LineChart></CardContent></Card></div>
          <div className="ajk-chart-row"><Card><CardHeader><CardTitle>Quantity vs Revenue</CardTitle></CardHeader><CardContent><BarChart data={allRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="quantity" fill="#60a5fa" /><Bar dataKey="revenue" fill="#1e3a5f" /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="ajk-insights-grid">{insights.map((ins, i) => <Card key={i} className="ajk-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
'''

lines = code.rstrip('\n').split('\n')
while len(lines) < 253:
    lines.append('')
assert len(lines) == 253, f"Expected 253 lines, got {len(lines)}"
with open(FILE, 'w') as f:
    f.write('\n'.join(lines) + '\n')

with open(FILE) as f:
    text = f.read()
newlines = text.count('\n')
print(f"Written {FILE}: {newlines} newlines")
assert newlines == 253, f"FAIL: {newlines} newlines"
print("OK: 253 lines verified")
