"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#c2410c", "#9a3412", "#7c2d12", "#431407"];
const CATEGORIES = ["Electronics", "Apparel", "FMCG", "Pharma", "Home & Living", "Beauty", "Footwear", "Accessories"];
const REASONS = ["Defective", "Wrong Size", "Color Mismatch", "Damaged Transit", "Wrong Item", "Quality Issue", "Not as Described", "Changed Mind"];
const CHANNELS = ["D2C Website", "Marketplace", "Retail Store", "Social Commerce", "Catalogue"];
const STATUSES = ["Return Received", "Inspecting", "Refund Initiated", "Resale Ready", "Disposed", "Vendor Return"];

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}

interface ReturnRecord {
  id: string;
  category: string;
  reason: string;
  channel: string;
  status: string;
  orderId: string;
  returnRate: number;
  predictedReturn: number;
  predictionAccuracy: number;
  refundAmount: number;
  resaleValue: number;
  processingDays: number;
  customerSat: number;
  repeatReturn: boolean;
  ageDays: number;
  warehouse: string;
}

function CategoryBadge({ category }: { category: string }) {
  const c = COLORS[CATEGORIES.indexOf(category) % COLORS.length];
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block", minWidth: 90, textAlign: "center" }}>{category}</span>;
}

function ReasonBadge({ reason }: { reason: string }) {
  const isDefective = reason === "Defective" || reason === "Damaged Transit";
  return <span style={{ background: isDefective ? "#dc262622" : "#f9731622", color: isDefective ? "#dc2626" : "#ea580c", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{reason}</span>;
}

function ChannelBadge({ channel }: { channel: string }) {
  const colors = ["#7c3aed", "#0891b2", "#16a34a", "#d97706", "#dc2626"];
  const i = CHANNELS.indexOf(channel) % colors.length;
  return <span style={{ background: `${colors[i]}22`, color: colors[i], padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{channel}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { "Return Received": "#3b82f6", "Inspecting": "#d97706", "Refund Initiated": "#8b5cf6", "Resale Ready": "#16a34a", "Disposed": "#6b7280", "Vendor Return": "#ea580c" };
  const c = colors[status] || "#6b7280";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

function RefundBar({ amount, max }: { amount: number; max: number }) {
  const pct = ri(0, 100, (amount / max) * 100);
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 80, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: "#ea580c", borderRadius: 3 }} /></div><span style={{ fontSize: 11, color: "#6b7280" }}>\u20b9{(amount / 1000).toFixed(1)}K</span></div>;
}

function SatRing({ sat }: { sat: number }) {
  const r = 18, sw = 3, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, sat) / 100);
  const col = sat >= 80 ? "#16a34a" : sat >= 60 ? "#d97706" : "#dc2626";
  return <svg width={44} height={44}><circle cx={22} cy={22} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={22} cy={22} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 22 22)" /><text x={22} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={col}>{sat}</text></svg>;
}

function KpiTile({ label, value, unit, color }: { label: string; value: number; unit: string; color?: string }) {
  return <Card><CardContent className="rpe-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: color || "#ea580c" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function RepeatBadge({ repeat }: { repeat: boolean }) {
  return <span style={{ background: repeat ? "#dc262622" : "#16a34a22", color: repeat ? "#dc2626" : "#16a34a", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{repeat ? "Repeat" : "First"}</span>;
}

const WAREHOUSES = ["Mumbai Central MH", "Delhi NCR Hub DL", "Bangalore South KA", "Chennai Coastal TN", "Kolkata East WB", "Hyderabad Deccan TS", "Pune West MH", "Jaipur North RJ"];

function genRecords(offset: number): ReturnRecord[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `RPE-${String(offset + i + 1).padStart(4, "0")}`,
    category: CATEGORIES[(offset + i) % CATEGORIES.length],
    reason: REASONS[(offset + i) % REASONS.length],
    channel: CHANNELS[(offset + i) % CHANNELS.length],
    status: STATUSES[(offset + i) % STATUSES.length],
    orderId: `ORD-2026-${String((offset + i) * 7 % 900 + 100).padStart(4, "0")}`,
    returnRate: ri(2, 18, 3 + ((offset + i) * 5) % 15),
    predictedReturn: ri(1, 20, 2 + ((offset + i) * 7) % 18),
    predictionAccuracy: ri(58, 97, 62 + ((offset + i) * 11) % 35),
    refundAmount: ri(350, 28000, 500 + ((offset + i) * 1400) % 27500),
    resaleValue: ri(100, 18000, 150 + ((offset + i) * 900) % 17850),
    processingDays: ri(1, 14, 2 + ((offset + i) * 3) % 12),
    customerSat: ri(25, 95, 35 + ((offset + i) * 13) % 60),
    repeatReturn: (offset + i) % 5 === 0,
    ageDays: ri(2, 30, 3 + ((offset + i) * 7) % 27),
    warehouse: WAREHOUSES[(offset + i) % WAREHOUSES.length],
  }));
}

const hand: ReturnRecord[] = [
  { id: "RPE-0001", category: "Electronics", reason: "Defective", channel: "D2C Website", status: "Inspecting", orderId: "ORD-2026-0147", returnRate: 8.2, predictedReturn: 7.5, predictionAccuracy: 91, refundAmount: 18500, resaleValue: 8200, processingDays: 5, customerSat: 72, repeatReturn: false, ageDays: 7, warehouse: "Mumbai Central MH" },
  { id: "RPE-0002", category: "Apparel", reason: "Wrong Size", channel: "Marketplace", status: "Refund Initiated", orderId: "ORD-2026-0298", returnRate: 15.4, predictedReturn: 14.8, predictionAccuracy: 96, refundAmount: 2400, resaleValue: 1800, processingDays: 3, customerSat: 85, repeatReturn: true, ageDays: 4, warehouse: "Delhi NCR Hub DL" },
  { id: "RPE-0003", category: "FMCG", reason: "Damaged Transit", channel: "D2C Website", status: "Return Received", orderId: "ORD-2026-0456", returnRate: 3.1, predictedReturn: 3.8, predictionAccuracy: 88, refundAmount: 850, resaleValue: 0, processingDays: 2, customerSat: 68, repeatReturn: false, ageDays: 5, warehouse: "Bangalore South KA" },
  { id: "RPE-0004", category: "Beauty", reason: "Color Mismatch", channel: "Social Commerce", status: "Disposed", orderId: "ORD-2026-0612", returnRate: 12.6, predictedReturn: 11.2, predictionAccuracy: 89, refundAmount: 3200, resaleValue: 0, processingDays: 8, customerSat: 55, repeatReturn: true, ageDays: 12, warehouse: "Chennai Coastal TN" },
  { id: "RPE-0005", category: "Home & Living", reason: "Not as Described", channel: "Catalogue", status: "Vendor Return", orderId: "ORD-2026-0789", returnRate: 6.8, predictedReturn: 7.2, predictionAccuracy: 94, refundAmount: 8500, resaleValue: 6200, processingDays: 10, customerSat: 78, repeatReturn: false, ageDays: 18, warehouse: "Kolkata East WB" },
  { id: "RPE-0006", category: "Footwear", reason: "Wrong Size", channel: "Marketplace", status: "Resale Ready", orderId: "ORD-2026-0834", returnRate: 16.2, predictedReturn: 15.5, predictionAccuracy: 96, refundAmount: 4500, resaleValue: 3200, processingDays: 4, customerSat: 88, repeatReturn: false, ageDays: 6, warehouse: "Hyderabad Deccan TS" },
  { id: "RPE-0007", category: "Accessories", reason: "Quality Issue", channel: "Retail Store", status: "Inspecting", orderId: "ORD-2026-0921", returnRate: 5.4, predictedReturn: 6.1, predictionAccuracy: 87, refundAmount: 6800, resaleValue: 4100, processingDays: 6, customerSat: 62, repeatReturn: true, ageDays: 14, warehouse: "Pune West MH" },
  { id: "RPE-0008", category: "Electronics", reason: "Changed Mind", channel: "D2C Website", status: "Refund Initiated", orderId: "ORD-2026-1056", returnRate: 4.2, predictedReturn: 4.0, predictionAccuracy: 95, refundAmount: 22000, resaleValue: 18500, processingDays: 3, customerSat: 92, repeatReturn: false, ageDays: 3, warehouse: "Jaipur North RJ" },
  { id: "RPE-0009", category: "Apparel", reason: "Wrong Item", channel: "Social Commerce", status: "Return Received", orderId: "ORD-2026-1178", returnRate: 7.8, predictedReturn: 8.5, predictionAccuracy: 92, refundAmount: 1800, resaleValue: 1200, processingDays: 2, customerSat: 70, repeatReturn: false, ageDays: 5, warehouse: "Mumbai Central MH" },
  { id: "RPE-0010", category: "Pharma", reason: "Defective", channel: "Retail Store", status: "Disposed", orderId: "ORD-2026-1290", returnRate: 1.2, predictedReturn: 1.5, predictionAccuracy: 80, refundAmount: 4200, resaleValue: 0, processingDays: 12, customerSat: 42, repeatReturn: true, ageDays: 25, warehouse: "Delhi NCR Hub DL" },
];

const gen = [...genRecords(10), ...genRecords(30), ...genRecords(50)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "category", label: "Category", options: CATEGORIES.map(c => ({ label: c, value: c, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "reason", label: "Reason", options: REASONS.map(r => ({ label: r, value: r, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "channel", label: "Channel", options: CHANNELS.map(c => ({ label: c, value: c, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "status", label: "Status", options: STATUSES.map(s => ({ label: s, value: s, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "Apparel Return Rate Hotspots", desc: "Apparel and footwear categories consistently show the highest return rates at 15-18%, driven primarily by size and fit issues. The prediction model achieves 96% accuracy on size-related returns by analyzing purchase history, brand size charts, and customer measurement profiles. Implementing AI-powered size recommendation widgets on product pages reduced size-related returns by 23% in pilot testing." },
  { title: "Reverse Logistics Cost Optimization", desc: "Average return processing cost of Rs 280 per unit includes inspection, repackaging, quality grading, and restocking labor. The system identifies high-resale-value items for priority processing, reducing average processing time from 8 days to 3.4 days for items with resale potential above 60%. This prioritization saves an estimated 1.8Cr monthly in expedited handling costs." },
  { title: "Repeat Returner Behavioral Patterns", desc: "Analysis of 12,000 return transactions identified 847 customers with 3 or more returns in 6 months, accounting for 22% of all return volume despite representing only 3.2% of the customer base. These patterns correlate strongly with specific product categories and purchase channels, enabling proactive intervention through personalized fit guides and enhanced product imagery." },
  { title: "Vendor Return Quality Escalation", desc: "Pharmaceutical and beauty product returns flagged as vendor-quality defects trigger automated batch investigation workflows. In Q2 2026, 15 vendor batches were flagged with defect rates exceeding 5%, resulting in 4 vendor scorecard downgrades and 2 supply contract reviews. The system prevents defective batches from reaching customers by enabling pre-shipment quality sampling based on return prediction signals." },
];

export default function ReturnsPredictionEngineView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) && !r.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalRecords = allRecords.length;
  const filteredCount = filtered.length;
  const totalRefund = allRecords.reduce((s, r) => s + r.refundAmount, 0);
  const avgAccuracy = Math.round(allRecords.reduce((s, r) => s + r.predictionAccuracy, 0) / allRecords.length);
  const avgProcessing = (allRecords.reduce((s, r) => s + r.processingDays, 0) / allRecords.length).toFixed(1);
  const repeatCount = allRecords.filter(r => r.repeatReturn).length;

  const reasonData = REASONS.map(reason => ({ name: reason, count: allRecords.filter(r => r.reason === reason).length, refund: Math.round(allRecords.filter(r => r.reason === reason).reduce((s, r) => s + r.refundAmount, 0) / 1000) }));

  const channelData = CHANNELS.map(ch => ({ name: ch, returns: allRecords.filter(r => r.channel === ch).length, rate: Math.round(allRecords.filter(r => r.channel === ch).reduce((s, r) => s + r.returnRate, 0) / allRecords.filter(r => r.channel === ch).length * 10) / 10 }));

  const statusData = STATUSES.map(st => ({ name: st, count: allRecords.filter(r => r.status === st).length }));

  return (
    <div className="rpe-root">
      <ModuleBreadcrumb items={[{ label: "Reverse Logistics", href: "/" }, { label: "Returns Prediction Engine" }]} />
      <PageHeader title="Returns Prediction Engine" description="ML-powered return prediction and reverse logistics optimization with category-specific risk scoring, vendor quality tracking, and customer behavior analytics across 8 product categories" />
      <Tabs defaultValue="dashboard">
        <TabsList className="rpe-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="returns">Returns</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="rpe-kpi-grid">
            <KpiTile label="Total Returns" value={totalRecords} unit="" />
            <KpiTile label="Total Refund" value={Math.round(totalRefund / 100000)} unit="L" color="#dc2626" />
            <KpiTile label="Pred. Accuracy" value={avgAccuracy} unit="%" color="#16a34a" />
            <KpiTile label="Avg Processing" value={parseFloat(avgProcessing)} unit=" days" color="#d97706" />
          </div>
          <div className="rpe-chart-row">
            <Card><CardHeader><CardTitle>Return Reasons Distribution</CardTitle></CardHeader><CardContent><BarChart data={reasonData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="count" fill="#ea580c" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
          <div className="rpe-chart-row">
            <Card><CardHeader><CardTitle>Return Rate by Channel</CardTitle></CardHeader><CardContent><LineChart data={channelData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="rate" stroke="#ea580c" strokeWidth={2} /><Line type="monotone" dataKey="returns" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
          </div>
          <div className="rpe-chart-row">
            <Card><CardHeader><CardTitle>Return Status Breakdown</CardTitle></CardHeader><CardContent><PieChart><Pie data={statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={11}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="returns">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalRecords} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID, order, or category..." />
          <div className="rpe-table-wrap">
            <table className="rpe-table">
              <thead><tr><th>ID</th><th>Order</th><th>Category</th><th>Reason</th><th>Channel</th><th>Status</th><th>Return %</th><th>Pred. %</th><th>Acc.</th><th>Refund</th><th>Resale</th><th>Sat.</th><th>Repeat</th><th>Days</th></tr></thead>
              <tbody>{filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td>
                  <td style={{ fontSize: 11, color: "#6b7280" }}>{r.orderId}</td>
                  <td><CategoryBadge category={r.category} /></td>
                  <td><ReasonBadge reason={r.reason} /></td>
                  <td><ChannelBadge channel={r.channel} /></td>
                  <td><StatusBadge status={r.status} /></td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>{r.returnRate}%</td>
                  <td style={{ fontSize: 12 }}>{r.predictedReturn}%</td>
                  <td style={{ fontSize: 12, fontWeight: 600, color: r.predictionAccuracy >= 90 ? "#16a34a" : r.predictionAccuracy >= 75 ? "#d97706" : "#dc2626" }}>{r.predictionAccuracy}%</td>
                  <td><RefundBar amount={r.refundAmount} max={30000} /></td>
                  <td style={{ fontSize: 11, color: "#16a34a" }}>\u20b9{(r.resaleValue / 1000).toFixed(1)}K</td>
                  <td><SatRing sat={r.customerSat} /></td>
                  <td><RepeatBadge repeat={r.repeatReturn} /></td>
                  <td style={{ fontSize: 12, textAlign: "center", color: r.processingDays > 7 ? "#dc2626" : "#16a34a" }}>{r.processingDays}d</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="rpe-chart-row">
            <Card><CardHeader><CardTitle>Refund Amount by Reason</CardTitle></CardHeader><CardContent><BarChart data={reasonData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="refund" fill="#f97316" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
          <div className="rpe-chart-row">
            <Card><CardHeader><CardTitle>Repeat vs First-Time Returners Trend</CardTitle></CardHeader><CardContent><AreaChart data={WAREHOUSES.map(w => ({ name: w.split(" ").slice(0, 2).join(" "), repeat: allRecords.filter(r => r.warehouse === w && r.repeatReturn).length, first: allRecords.filter(r => r.warehouse === w && !r.repeatReturn).length }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="repeat" stroke="#dc2626" fill="#dc262622" /><Area type="monotone" dataKey="first" stroke="#16a34a" fill="#16a34a22" /></AreaChart></CardContent></Card>
          </div>
          <div className="rpe-chart-row">
            <Card><CardHeader><CardTitle>Category-wise Return Rate vs Prediction Accuracy</CardTitle></CardHeader><CardContent><LineChart data={CATEGORIES.map(c => { const recs = allRecords.filter(r => r.category === c); return { name: c, rate: Math.round(recs.reduce((s, r) => s + r.returnRate, 0) / recs.length * 10) / 10, accuracy: Math.round(recs.reduce((s, r) => s + r.predictionAccuracy, 0) / recs.length) } })}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="rate" stroke="#ea580c" strokeWidth={2} /><Line type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="rpe-insights-grid">{insights.map((ins, i) => <Card key={i} className="rpe-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
