"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#6d28d9", "#5b21b6", "#4c1d95", "#3b0764"];
const CATEGORIES = ["Electronics", "Apparel", "FMCG", "Pharma", "Home & Living", "Sports", "Beauty", "Auto Parts"];
const REGIONS = ["North India", "South India", "West India", "East India", "Central India", "NE India"];
const MODELS = ["ARIMA-X", "LSTM Neural", "Prophet", "XGBoost", "Ensemble Blended", "Transformer"];
const SEASONS = ["Diwali Peak", "Holi Spring", "Monsoon Dip", "IPL Season", "Wedding Season", "Back to School", "Ramadan", "Christmas"];

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}

interface DemandRecord {
  id: string;
  category: string;
  region: string;
  model: string;
  season: string;
  actualDemand: number;
  predictedDemand: number;
  accuracy: number;
  bias: number;
  mape: number;
  leadDays: number;
  confidence: number;
  trend: string;
  revenue: number;
  stockoutRisk: number;
  overstockRisk: number;
}

function CategoryBadge({ category }: { category: string }) {
  const c = COLORS[CATEGORIES.indexOf(category) % COLORS.length];
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block", minWidth: 90, textAlign: "center" }}>{category}</span>;
}

function RegionBadge({ region }: { region: string }) {
  const colors = ["#dc2626", "#0891b2", "#d97706", "#16a34a", "#7c3aed", "#0d9488"];
  const i = REGIONS.indexOf(region) % colors.length;
  return <span style={{ background: `${colors[i]}22`, color: colors[i], padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{region}</span>;
}

function ModelBadge({ model }: { model: string }) {
  return <span style={{ background: "#f3f4f6", color: "#374151", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, border: "1px solid #e5e7eb" }}>{model}</span>;
}

function AccuracyRing({ accuracy }: { accuracy: number }) {
  const r = 20, sw = 4, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, accuracy) / 100);
  const col = accuracy >= 90 ? "#16a34a" : accuracy >= 75 ? "#d97706" : "#dc2626";
  return <svg width={52} height={52}><circle cx={26} cy={26} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={26} cy={26} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 26 26)" /><text x={26} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={col}>{accuracy}%</text></svg>;
}

function RiskBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = ri(0, 100, (value / max) * 100);
  const col = value >= max * 0.8 ? "#dc2626" : value >= max * 0.5 ? "#d97706" : "#16a34a";
  return <div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}><span style={{ color: "#6b7280" }}>{label}</span><span style={{ color: col, fontWeight: 600 }}>{value}%</span></div><div style={{ width: "100%", height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 3 }} /></div></div>;
}

function KpiTile({ label, value, unit, color }: { label: string; value: number; unit: string; color?: string }) {
  return <Card><CardContent className="dsa-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: color || "#7c3aed" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function TrendBadge({ trend }: { trend: string }) {
  const up = trend === "Rising";
  return <span style={{ color: up ? "#16a34a" : "#dc2626", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>{up ? "\u2191" : "\u2193"} {trend}</span>;
}

function genRecords(offset: number): DemandRecord[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `DSA-${String(offset + i + 1).padStart(4, "0")}`,
    category: CATEGORIES[(offset + i) % CATEGORIES.length],
    region: REGIONS[(offset + i) % REGIONS.length],
    model: MODELS[(offset + i) % MODELS.length],
    season: SEASONS[(offset + i) % SEASONS.length],
    actualDemand: ri(120, 9800, 800 + ((offset + i) * 437) % 9000),
    predictedDemand: ri(150, 9500, 900 + ((offset + i) * 391) % 8600),
    accuracy: ri(62, 99, 70 + ((offset + i) * 7) % 30),
    bias: ri(-18, 18, -15 + ((offset + i) * 3) % 30),
    mape: ri(2, 22, 3 + ((offset + i) * 5) % 19),
    leadDays: ri(3, 45, 5 + ((offset + i) * 7) % 40),
    confidence: ri(55, 98, 60 + ((offset + i) * 11) % 38),
    trend: (offset + i) % 3 === 0 ? "Rising" : (offset + i) % 3 === 1 ? "Falling" : "Stable",
    revenue: ri(240000, 4500000, 300000 + ((offset + i) * 197000) % 4200000),
    stockoutRisk: ri(2, 78, 5 + ((offset + i) * 13) % 73),
    overstockRisk: ri(3, 65, 4 + ((offset + i) * 9) % 61),
  }));
}

const hand: DemandRecord[] = [
  { id: "DSA-0001", category: "Electronics", region: "North India", model: "ARIMA-X", season: "Diwali Peak", actualDemand: 8450, predictedDemand: 8120, accuracy: 96, bias: 3.9, mape: 3.9, leadDays: 21, confidence: 94, trend: "Rising", revenue: 3840000, stockoutRisk: 12, overstockRisk: 8 },
  { id: "DSA-0002", category: "Apparel", region: "South India", model: "LSTM Neural", season: "Holi Spring", actualDemand: 3200, predictedDemand: 3050, accuracy: 95, bias: 4.7, mape: 4.7, leadDays: 14, confidence: 91, trend: "Rising", revenue: 1280000, stockoutRisk: 18, overstockRisk: 15 },
  { id: "DSA-0003", category: "FMCG", region: "West India", model: "Prophet", season: "Monsoon Dip", actualDemand: 5600, predictedDemand: 5480, accuracy: 98, bias: 2.1, mape: 2.1, leadDays: 7, confidence: 97, trend: "Falling", revenue: 840000, stockoutRisk: 5, overstockRisk: 32 },
  { id: "DSA-0004", category: "Pharma", region: "East India", model: "XGBoost", season: "IPL Season", actualDemand: 1200, predictedDemand: 1350, accuracy: 88, bias: -12.5, mape: 12.5, leadDays: 30, confidence: 82, trend: "Stable", revenue: 2400000, stockoutRisk: 42, overstockRisk: 6 },
  { id: "DSA-0005", category: "Home & Living", region: "Central India", model: "Ensemble Blended", season: "Wedding Season", actualDemand: 4100, predictedDemand: 3980, accuracy: 97, bias: 2.9, mape: 2.9, leadDays: 18, confidence: 95, trend: "Rising", revenue: 1640000, stockoutRisk: 8, overstockRisk: 12 },
  { id: "DSA-0006", category: "Sports", region: "NE India", model: "Transformer", season: "Back to School", actualDemand: 780, predictedDemand: 920, accuracy: 85, bias: -17.9, mape: 17.9, leadDays: 35, confidence: 72, trend: "Falling", revenue: 468000, stockoutRisk: 55, overstockRisk: 4 },
  { id: "DSA-0007", category: "Beauty", region: "North India", model: "LSTM Neural", season: "Ramadan", actualDemand: 2900, predictedDemand: 2820, accuracy: 97, bias: 2.8, mape: 2.8, leadDays: 10, confidence: 96, trend: "Rising", revenue: 1450000, stockoutRisk: 6, overstockRisk: 18 },
  { id: "DSA-0008", category: "Auto Parts", region: "West India", model: "XGBoost", season: "Christmas", actualDemand: 1800, predictedDemand: 1650, accuracy: 92, bias: 8.3, mape: 8.3, leadDays: 25, confidence: 88, trend: "Stable", revenue: 2160000, stockoutRisk: 22, overstockRisk: 14 },
  { id: "DSA-0009", category: "Electronics", region: "South India", model: "Transformer", season: "Diwali Peak", actualDemand: 9200, predictedDemand: 8900, accuracy: 97, bias: 3.3, mape: 3.3, leadDays: 28, confidence: 96, trend: "Rising", revenue: 4140000, stockoutRisk: 10, overstockRisk: 9 },
  { id: "DSA-0010", category: "FMCG", region: "East India", model: "ARIMA-X", season: "Monsoon Dip", actualDemand: 6800, predictedDemand: 6950, accuracy: 98, bias: -2.2, mape: 2.2, leadDays: 5, confidence: 98, trend: "Falling", revenue: 1020000, stockoutRisk: 3, overstockRisk: 28 },
];

const gen = [...genRecords(10), ...genRecords(30), ...genRecords(50)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "category", label: "Category", options: CATEGORIES.map(c => ({ label: c, value: c, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "region", label: "Region", options: REGIONS.map(r => ({ label: r, value: r, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "model", label: "AI Model", options: MODELS.map(m => ({ label: m, value: m, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "season", label: "Season", options: SEASONS.map(s => ({ label: s, value: s, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "AI Ensemble Accuracy Gains", desc: "The blended ensemble model combining ARIMA-X seasonal decomposition with LSTM sequence learning achieves 3-5% higher accuracy than any individual model. Backtesting across 18 months of historical data shows consistent improvement during demand volatility periods, particularly around festival seasons where traditional models underperform by 8-12 percentage points." },
  { title: "Regional Demand Pattern Divergence", desc: "North and South India exhibit opposing seasonal patterns for electronics and apparel categories. While North India demand surges during Diwali and wedding seasons, South India shows stronger monsoon and Pongal-driven demand cycles. The AI models automatically capture these regional variations through region-specific feature engineering pipelines." },
  { title: "Lead Time Optimization Impact", desc: "Reducing forecast lead time from 30 days to 14 days for FMCG categories improved prediction accuracy from 82% to 94%. However, shorter lead times for pharmaceutical products showed minimal improvement due to inherently stable demand patterns. The system recommends category-specific lead time strategies rather than one-size-fits-all approaches." },
  { title: "Stockout Risk Mitigation", desc: "Real-time stockout risk scoring identified 23 high-risk SKUs across 5 warehouses in Q2 2026, enabling proactive inventory rebalancing that prevented an estimated 4.2Cr in lost revenue. The prediction engine triggers automated alerts when stockout probability exceeds 40% and recommends cross-dock transfers from low-risk locations." },
];

export default function DemandSensingAiView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.category.toLowerCase().includes(searchQuery.toLowerCase()) && !r.region.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalRecords = allRecords.length;
  const filteredCount = filtered.length;
  const avgAccuracy = Math.round(allRecords.reduce((s, r) => s + r.accuracy, 0) / allRecords.length);
  const totalRevenue = allRecords.reduce((s, r) => s + r.revenue, 0);
  const avgConfidence = Math.round(allRecords.reduce((s, r) => s + r.confidence, 0) / allRecords.length);

  const modelPerfData = MODELS.map(m => {
    const recs = allRecords.filter(r => r.model === m);
    return { name: m, accuracy: Math.round(recs.reduce((s, r) => s + r.accuracy, 0) / recs.length), count: recs.length };
  });

  const categoryRevenueData = CATEGORIES.map(c => {
    const recs = allRecords.filter(r => r.category === c);
    return { name: c, revenue: Math.round(recs.reduce((s, r) => s + r.revenue, 0) / 100000), predicted: Math.round(recs.reduce((s, r) => s + r.predictedDemand, 0) / 100) };
  });

  const regionData = REGIONS.map(rg => {
    const recs = allRecords.filter(r => r.region === rg);
    return { name: rg, stockout: Math.round(recs.reduce((s, r) => s + r.stockoutRisk, 0) / recs.length), overstock: Math.round(recs.reduce((s, r) => s + r.overstockRisk, 0) / recs.length) };
  });

  return (
    <div className="dsa-root">
      <ModuleBreadcrumb items={[{ label: "AI & Analytics", href: "/" }, { label: "Demand Sensing AI" }]} />
      <PageHeader title="Demand Sensing AI" description="AI-powered demand forecasting engine with multi-model ensemble predictions, seasonal pattern recognition, and stockout risk mitigation across 8 product categories and 6 Indian regions" />
      <Tabs defaultValue="dashboard">
        <TabsList className="dsa-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="forecasts">Forecasts</TabsTrigger><TabsTrigger value="models">Model Arena</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="dsa-kpi-grid">
            <KpiTile label="Total Forecasts" value={totalRecords} unit="" />
            <KpiTile label="Avg Accuracy" value={avgAccuracy} unit="%" color="#16a34a" />
            <KpiTile label="Total Revenue" value={Math.round(totalRevenue / 100000)} unit="L" />
            <KpiTile label="Avg Confidence" value={avgConfidence} unit="%" color="#0891b2" />
          </div>
          <div className="dsa-chart-row">
            <Card><CardHeader><CardTitle>Model Accuracy Comparison</CardTitle></CardHeader><CardContent><BarChart data={modelPerfData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} domain={[60, 100]} /><Tooltip /><Bar dataKey="accuracy" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
          <div className="dsa-chart-row">
            <Card><CardHeader><CardTitle>Revenue by Category vs Predicted Demand</CardTitle></CardHeader><CardContent><AreaChart data={categoryRevenueData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="#7c3aed22" /><Area type="monotone" dataKey="predicted" stroke="#06b6d4" fill="#06b6d422" /></AreaChart></CardContent></Card>
          </div>
          <div className="dsa-chart-row">
            <Card><CardHeader><CardTitle>Stockout vs Overstock Risk by Region</CardTitle></CardHeader><CardContent><BarChart data={regionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="stockout" fill="#dc2626" radius={[4, 4, 0, 0]} /><Bar dataKey="overstock" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="forecasts">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalRecords} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID, category, or region..." />
          <div className="dsa-table-wrap">
            <table className="dsa-table">
              <thead><tr><th>ID</th><th>Category</th><th>Region</th><th>Model</th><th>Season</th><th>Actual</th><th>Predicted</th><th>Accuracy</th><th>MAPE</th><th>Trend</th><th>Risks</th></tr></thead>
              <tbody>{filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td>
                  <td><CategoryBadge category={r.category} /></td>
                  <td><RegionBadge region={r.region} /></td>
                  <td><ModelBadge model={r.model} /></td>
                  <td style={{ fontSize: 12 }}>{r.season}</td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>{r.actualDemand.toLocaleString()}</td>
                  <td style={{ fontSize: 12 }}>{r.predictedDemand.toLocaleString()}</td>
                  <td><AccuracyRing accuracy={r.accuracy} /></td>
                  <td style={{ fontSize: 12, color: r.mape > 10 ? "#dc2626" : r.mape > 5 ? "#d97706" : "#16a34a", fontWeight: 600 }}>{r.mape}%</td>
                  <td><TrendBadge trend={r.trend} /></td>
                  <td style={{ minWidth: 140 }}><RiskBar value={r.stockoutRisk} max={80} label="Stockout" /><RiskBar value={r.overstockRisk} max={70} label="Overstock" /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="models">
          <div className="dsa-model-grid">
            {modelPerfData.map((m, i) => (
              <Card key={i} className="dsa-model-card">
                <CardHeader><CardTitle style={{ fontSize: 15 }}>{m.name}</CardTitle></CardHeader>
                <CardContent>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 13, color: "#6b7280" }}>Avg Accuracy</span><span style={{ fontSize: 20, fontWeight: 800, color: m.accuracy >= 90 ? "#16a34a" : m.accuracy >= 75 ? "#d97706" : "#dc2626" }}>{m.accuracy}%</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 13, color: "#6b7280" }}>Forecasts</span><span style={{ fontSize: 15, fontWeight: 600 }}>{m.count}</span></div>
                  <div style={{ width: "100%", height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden", marginTop: 8 }}><div style={{ width: `${m.accuracy}%`, height: "100%", background: COLORS[i % COLORS.length], borderRadius: 3 }} /></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="dsa-chart-row">
            <Card><CardHeader><CardTitle>Accuracy Trend by Model</CardTitle></CardHeader><CardContent><LineChart data={MODELS.map((m, i) => ({ name: m, accuracy: modelPerfData[i].accuracy, confidence: allRecords.filter(r => r.model === m).reduce((s, r) => s + r.confidence, 0) / allRecords.filter(r => r.model === m).length }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} domain={[60, 100]} /><Tooltip /><Line type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={2} /><Line type="monotone" dataKey="confidence" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
          </div>
          <div className="dsa-chart-row">
            <Card><CardHeader><CardTitle>Forecast Count by Category</CardTitle></CardHeader><CardContent><PieChart><Pie data={CATEGORIES.map(c => ({ name: c, value: allRecords.filter(r => r.category === c).length }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label fontSize={10}>{CATEGORIES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="dsa-insights-grid">{insights.map((ins, i) => <Card key={i} className="dsa-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
