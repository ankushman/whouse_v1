"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar,
} from "recharts";
import {
  Medal, TrendingUp, TrendingDown, Minus, Crown, Star, ArrowUpRight,
  ArrowDownRight, Trophy, Target, Zap, Users, Shield, DollarSign,
  Package, Clock, AlertTriangle, CheckCircle2, ChevronRight, BarChart3,
  Activity, Award, Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface WarehouseData {
  id: string;
  name: string;
  city: string;
  size: number;
  region: string;
  scores: ScoreBreakdown;
  operational: OperationalMetrics;
  financial: FinancialMetrics;
  trend: TrendData[];
}

interface ScoreBreakdown {
  overall: number;
  operations: number;
  quality: number;
  cost: number;
  safety: number;
  people: number;
}

interface OperationalMetrics {
  throughputOrders: number;
  throughputUnits: number;
  orderAccuracy: number;
  onTimeShipment: number;
  dockUtilization: number;
  inventoryTurnover: number;
  warehouseUtilization: number;
  oee: number;
}

interface FinancialMetrics {
  costPerOrder: number;
  costPerUnit: number;
  revenue: number;
  laborCostPct: number;
  energyCostPerSqft: number;
  roi: number;
}

interface TrendData {
  week: string;
  score: number;
  throughput: number;
  slaCompliance: number;
  costEfficiency: number;
  safetyScore: number;
}

// ============================================================================
// Seeded Data Generation
// ============================================================================
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateWarehouseData(): WarehouseData[] {
  const rand = seededRandom(113113);
  const warehouses = [
    { id: "WH-MUM-01", name: "Mumbai", city: "Mumbai", size: 45000, region: "West" },
    { id: "WH-DEL-02", name: "Delhi NCR", city: "New Delhi", size: 52000, region: "North" },
    { id: "WH-BLR-03", name: "Bangalore", city: "Bangalore", size: 38000, region: "South" },
    { id: "WH-MAS-04", name: "Chennai", city: "Chennai", size: 32000, region: "South" },
    { id: "WH-CCU-05", name: "Kolkata", city: "Kolkata", size: 28000, region: "East" },
    { id: "WH-HYD-06", name: "Hyderabad", city: "Hyderabad", size: 35000, region: "South" },
  ];

  const baseScores = [92, 87, 85, 78, 72, 83];

  return warehouses.map((wh, i) => {
    const base = baseScores[i];
    const jitter = () => (rand() - 0.5) * 10;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    const ops = clamp(base + jitter() + 2, 50, 99);
    const qual = clamp(base + jitter() - 1, 50, 99);
    const cost = clamp(base + jitter() - 3, 50, 99);
    const safe = clamp(base + jitter(), 50, 99);
    const ppl = clamp(base + jitter() + 1, 50, 99);

    const overall = Math.round(ops * 0.3 + qual * 0.2 + cost * 0.2 + safe * 0.15 + ppl * 0.15);

    const baseThroughput = [7200, 6500, 5800, 4200, 3200, 5500][i];
    const throughputOrders = Math.round(baseThroughput + (rand() - 0.5) * 1000);
    const throughputUnits = throughputOrders * Math.round(8 + rand() * 12);

    const operational = {
      throughputOrders,
      throughputUnits,
      orderAccuracy: clamp(96 + rand() * 3.5, 96, 99.8),
      onTimeShipment: clamp(82 + rand() * 15, 82, 97),
      dockUtilization: clamp(60 + rand() * 35, 60, 95),
      inventoryTurnover: clamp(4 + rand() * 8, 4, 12),
      warehouseUtilization: clamp(55 + rand() * 40, 55, 95),
      oee: clamp(60 + rand() * 25, 60, 85),
    };

    const financial = {
      costPerOrder: Math.round(45 + (100 - base) * 1.5 + rand() * 20),
      costPerUnit: Math.round(3 + (100 - base) * 0.15 + rand() * 3),
      revenue: Math.round((base * 12 + rand() * 80) * 10) / 10,
      laborCostPct: Math.round((30 + (100 - base) * 0.3 + rand() * 10) * 10) / 10,
      energyCostPerSqft: Math.round((18 + (100 - base) * 0.15 + rand() * 8) * 10) / 10,
      roi: Math.round((8 + (base - 70) * 0.4 + rand() * 5) * 10) / 10,
    };

    const trend: TrendData[] = [];
    let prevScore = overall - 5 + (rand() - 0.5) * 10;
    for (let w = 1; w <= 12; w++) {
      const weekScore = clamp(prevScore + (rand() - 0.4) * 4, 50, 99);
      prevScore = weekScore;
      trend.push({
        week: `W${w}`,
        score: Math.round(weekScore),
        throughput: Math.round(baseThroughput * (0.85 + rand() * 0.3)),
        slaCompliance: clamp(85 + rand() * 13, 85, 98),
        costEfficiency: clamp(60 + rand() * 30, 60, 95),
        safetyScore: clamp(70 + rand() * 25, 70, 98),
      });
    }

    return {
      id: wh.id,
      name: wh.name,
      city: wh.city,
      size: wh.size,
      region: wh.region,
      scores: { overall, operations: Math.round(ops), quality: Math.round(qual), cost: Math.round(cost), safety: Math.round(safe), people: Math.round(ppl) },
      operational,
      financial,
      trend,
    };
  });
}

// ============================================================================
// Constants
// ============================================================================
const COLORS = ["#8b5cf6", "#6366f1", "#a855f7", "#c084fc", "#d946ef", "#f0abfc"];
const COLORS_ALPHA = ["#8b5cf620", "#6366f120", "#a855f720", "#c084fc20", "#d946ef20", "#f0abfc20"];
const VIOLET_GRADIENT = "linear-gradient(135deg, #7c3aed, #6366f1, #d946ef)";
const KPI_CATEGORIES = [
  { key: "all", label: "All KPIs" },
  { key: "operations", label: "Operations" },
  { key: "financial", label: "Financial" },
  { key: "quality", label: "Quality" },
  { key: "safety", label: "Safety" },
  { key: "people", label: "People" },
];

const PERIODS = ["This Month", "Last Month", "This Quarter", "This Year", "Last Year"];

// ============================================================================
// Helper Components
// ============================================================================
function ScoreRing({ score, size = 80, strokeWidth = 6 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "#22c55e" : score >= 70 ? "#eab308" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" className="text-muted/30" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="wps-score-ring-anim" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  if (Math.abs(diff) < 0.5) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  if (diff > 0) return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />;
  return <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />;
}

function ConditionalBadge({ value, target, suffix = "%" }: { value: number; target: number; suffix?: string }) {
  const pct = ((value - target) / target) * 100;
  let variant: "success" | "warning" | "destructive" | "outline" | "secondary" | "default" = "success";
  if (pct < -5) variant = "destructive";
  else if (pct < 0) variant = "warning";
  return (
    <Badge variant={variant} className="badge-interactive text-xs font-mono">
      {suffix === "%" ? `${value.toFixed(1)}${suffix}` : `${value}${suffix}`}
    </Badge>
  );
}

function FormatNumber(n: number): string {
  if (n >= 1000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return n.toLocaleString("en-IN");
}

// ============================================================================
// Main Component
// ============================================================================
export function WarehousePerformanceScorecardView() {
  const data = useMemo(() => generateWarehouseData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [kpiCategory, setKpiCategory] = useState("all");
  const [trendWarehouses, setTrendWarehouses] = useState<string[]>([data[0].id, data[1].id]);
  const [trendKpi, setTrendKpi] = useState("score");

  const ranked = useMemo(() =>
    [...data].sort((a, b) => b.scores.overall - a.scores.overall),
    [data]
  );

  const tabs = [
    "Performance Overview",
    "KPI Benchmarking",
    "Trend Analysis",
    "Warehouse Deep Dive",
    "Operational Metrics",
    "Financial Metrics",
    "Rankings & Leaderboard",
  ];

  // Benchmarking data
  const benchmarkData = useMemo(() => {
    const kpis = [
      { name: "Throughput", key: "throughputOrders", unit: "orders/day" },
      { name: "Order Accuracy", key: "orderAccuracy", unit: "%" },
      { name: "On-Time Shipment", key: "onTimeShipment", unit: "%" },
      { name: "Dock Utilization", key: "dockUtilization", unit: "%" },
      { name: "OEE", key: "oee", unit: "%" },
    ];
    return kpis.map((kpi) => {
      const entry: Record<string, string | number> = { name: kpi.name };
      data.forEach((wh) => {
        entry[wh.name] = (wh.operational as unknown as Record<string, number>)[kpi.key] ?? (wh.financial as unknown as Record<string, number>)[kpi.key] ?? 0;
      });
      return entry;
    });
  }, [data]);

  // Radar data
  const radarData = useMemo(() => {
    return ["Operations", "Quality", "Cost", "Safety", "People"].map((cat) => {
      const key = cat.toLowerCase() as keyof ScoreBreakdown;
      const entry: Record<string, string | number> = { category: cat };
      data.forEach((wh) => { entry[wh.name] = wh.scores[key]; });
      return entry;
    });
  }, [data]);

  // Trend data for selected warehouses
  const trendChartData = useMemo(() => {
    return data[0].trend.map((t, wi) => ({
      week: t.week,
      ...data.reduce((acc, wh) => {
        if (trendWarehouses.includes(wh.id)) {
          acc[wh.name] = Number(wh.trend[wi]?.[trendKpi as keyof TrendData] ?? 0);
        }
        return acc;
      }, {} as Record<string, number>),
    }));
  }, [data, trendWarehouses, trendKpi]);

  const toggleTrendWarehouse = useCallback((id: string) => {
    setTrendWarehouses((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }, []);

  return (
    <div className="h-full flex flex-col wps-container">
      {/* Header */}
      <div className="wps-header px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="wps-header-icon">
            <Medal className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Warehouse Performance Scorecard</h1>
            <p className="text-xs text-white/70">Cross-warehouse KPI benchmarking & performance comparison</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="wps-period-select"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div className="wps-header-badge">
            <Activity className="h-3 w-3" />
            <span>6 Warehouses</span>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="wps-tab-bar px-6 shrink-0">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(i); if (tab === "Warehouse Deep Dive" && !selectedWarehouse) setSelectedWarehouse(data[0].id); }}
              className={`wps-tab ${activeTab === i ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Tab 0: Performance Overview */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 wps-summary-grid">
              <div className="wps-summary-card wps-summary-card-violet">
                <div className="text-xs text-white/70 font-medium">Average Score</div>
                <div className="text-2xl font-bold text-white">{Math.round(data.reduce((s, w) => s + w.scores.overall, 0) / data.length)}</div>
                <div className="text-xs text-white/60">out of 100</div>
              </div>
              <div className="wps-summary-card wps-summary-card-indigo">
                <div className="text-xs text-white/70 font-medium">Best Performer</div>
                <div className="text-2xl font-bold text-white">{ranked[0]?.name}</div>
                <div className="flex items-center gap-1 text-xs text-emerald-300"><ArrowUpRight className="h-3 w-3" /> Score {ranked[0]?.scores.overall}</div>
              </div>
              <div className="wps-summary-card wps-summary-card-fuchsia">
                <div className="text-xs text-white/70 font-medium">Most Improved</div>
                <div className="text-2xl font-bold text-white">{data[2]?.name}</div>
                <div className="flex items-center gap-1 text-xs text-emerald-300"><TrendingUp className="h-3 w-3" /> +4.2 vs LP</div>
              </div>
              <div className="wps-summary-card wps-summary-card-purple">
                <div className="text-xs text-white/70 font-medium">Needs Attention</div>
                <div className="text-2xl font-bold text-white">{ranked[ranked.length - 1]?.name}</div>
                <div className="flex items-center gap-1 text-xs text-amber-300"><AlertTriangle className="h-3 w-3" /> Score {ranked[ranked.length - 1]?.scores.overall}</div>
              </div>
            </div>

            {/* Warehouse Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {ranked.map((wh, idx) => {
                const prevScore = wh.scores.overall - (wh.trend[0]?.score ? wh.scores.overall - wh.trend[0].score : 0);
                return (
                  <div
                    key={wh.id}
                    className="wps-wh-card"
                    onClick={() => { setSelectedWarehouse(wh.id); setActiveTab(3); }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="wps-wh-rank wps-wh-rank-{idx < 3 ? 'top' : 'normal'}">
                          {idx === 0 && <Crown className="h-3 w-3 text-yellow-300" />}
                          <span>#{idx + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{wh.name}</h3>
                          <p className="text-xs text-muted-foreground">{wh.city} · {wh.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendIndicator current={wh.scores.overall} previous={prevScore} />
                        <span className={`text-xs font-mono ${wh.scores.overall >= (prevScore || 0) ? "text-emerald-500" : "text-red-500"}`}>
                          {wh.scores.overall >= (prevScore || 0) ? "+" : ""}{Math.round(wh.scores.overall - (prevScore || 0))}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <ScoreRing score={wh.scores.overall} size={72} strokeWidth={5} />
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        {[
                          { label: "Throughput", value: `${(wh.operational.throughputOrders / 1000).toFixed(1)}K` },
                          { label: "SLA", value: `${wh.operational.onTimeShipment.toFixed(0)}%` },
                          { label: "Cost Eff.", value: `${wh.scores.cost}` },
                          { label: "Safety", value: `${wh.scores.safety}` },
                        ].map((m) => (
                          <div key={m.label} className="wps-wh-mini-kpi">
                            <span className="text-[10px] text-muted-foreground">{m.label}</span>
                            <span className="text-xs font-semibold">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <span className="text-[10px] text-primary flex items-center gap-0.5">
                        Deep Dive <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 1: KPI Benchmarking */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="flex gap-2">
              {KPI_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setKpiCategory(cat.key)}
                  className={`wps-kpi-cat-btn ${kpiCategory === cat.key ? "active" : ""}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="wps-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-violet-500" />
                    KPI Comparison by Warehouse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={benchmarkData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {data.map((wh, i) => (
                        <Bar key={wh.id} dataKey={wh.name} fill={COLORS[i]} radius={[2, 2, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="wps-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-fuchsia-500" />
                    Radar: Normalized Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      {data.map((wh, i) => (
                        <Radar key={wh.id} name={wh.name} dataKey={wh.name} stroke={COLORS[i]} fill={COLORS_ALPHA[i]} strokeWidth={2} />
                      ))}
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Best in Class */}
            <Card className="wps-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Best-in-Class by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {(["operations", "quality", "cost", "safety", "people"] as const).map((cat) => {
                    const leader = [...data].sort((a, b) => b.scores[cat] - a.scores[cat])[0];
                    return (
                      <div key={cat} className="wps-bic-card text-center">
                        <Trophy className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                        <div className="text-xs text-muted-foreground capitalize">{cat}</div>
                        <div className="text-sm font-bold">{leader?.name}</div>
                        <div className="text-xs font-mono text-violet-500">{leader?.scores[cat]}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Trend Analysis */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="text-sm font-medium">Warehouses:</div>
              <div className="flex flex-wrap gap-2">
                {data.map((wh, i) => (
                  <button
                    key={wh.id}
                    onClick={() => toggleTrendWarehouse(wh.id)}
                    className={`wps-wh-toggle ${trendWarehouses.includes(wh.id) ? "active" : ""}`}
                    style={trendWarehouses.includes(wh.id) ? { borderColor: COLORS[i], backgroundColor: COLORS_ALPHA[i] } : {}}
                  >
                    {wh.name}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                {[
                  { key: "score", label: "Score" },
                  { key: "throughput", label: "Throughput" },
                  { key: "slaCompliance", label: "SLA %" },
                  { key: "costEfficiency", label: "Cost Eff." },
                  { key: "safetyScore", label: "Safety" },
                ].map((k) => (
                  <button
                    key={k.key}
                    onClick={() => setTrendKpi(k.key)}
                    className={`wps-kpi-cat-btn ${trendKpi === k.key ? "active" : ""}`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Period Change Cards */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {data.filter((w) => trendWarehouses.includes(w.id)).map((wh) => {
                const last = wh.trend[wh.trend.length - 1]?.[trendKpi as keyof TrendData] ?? 0;
                const prev = wh.trend[wh.trend.length - 2]?.[trendKpi as keyof TrendData] ?? 0;
                const change = Number(last) - Number(prev);
                return (
                  <div key={wh.id} className="wps-change-card">
                    <div className="text-xs text-muted-foreground">{wh.name}</div>
                    <div className="text-lg font-bold">{typeof last === "number" ? last.toLocaleString() : last}</div>
                    <div className={`text-xs flex items-center gap-0.5 ${change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {typeof change === "number" ? change.toFixed(1) : change}
                    </div>
                  </div>
                );
              })}
            </div>

            <Card className="wps-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-violet-500" />
                  {trendKpi === "score" ? "Overall Score" : trendKpi === "throughput" ? "Throughput (orders/day)" : trendKpi} — 12 Week Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trendChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {data.filter((w) => trendWarehouses.includes(w.id)).map((wh, i) => {
                      const idx = data.indexOf(wh);
                      return (
                        <Line key={wh.id} type="monotone" dataKey={wh.name} stroke={COLORS[idx]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Warehouse Deep Dive */}
        {activeTab === 3 && (
          <div className="space-y-6">
            {/* Warehouse Selector */}
            <div className="flex gap-2">
              {data.map((wh) => (
                <button
                  key={wh.id}
                  onClick={() => setSelectedWarehouse(wh.id)}
                  className={`wps-wh-tab ${selectedWarehouse === wh.id ? "active" : ""}`}
                >
                  {wh.name}
                </button>
              ))}
            </div>

            {(() => {
              const wh = data.find((w) => w.id === selectedWarehouse) ?? data[0];
              const rank = ranked.findIndex((r) => r.id === wh.id) + 1;
              const scoreEntries = [
                { key: "Operations", value: wh.scores.operations, weight: "30%", color: "#8b5cf6" },
                { key: "Quality", value: wh.scores.quality, weight: "20%", color: "#6366f1" },
                { key: "Cost", value: wh.scores.cost, weight: "20%", color: "#a855f7" },
                { key: "Safety", value: wh.scores.safety, weight: "15%", color: "#d946ef" },
                { key: "People", value: wh.scores.people, weight: "15%", color: "#f0abfc" },
              ];

              const metrics = [
                { name: "Throughput", actual: wh.operational.throughputOrders, target: 6000, unit: "orders/day", higher: true },
                { name: "Order Accuracy", actual: wh.operational.orderAccuracy, target: 98, unit: "%", higher: true },
                { name: "On-Time Shipment", actual: wh.operational.onTimeShipment, target: 92, unit: "%", higher: true },
                { name: "OEE", actual: wh.operational.oee, target: 80, unit: "%", higher: true },
                { name: "Cost/Order", actual: wh.financial.costPerOrder, target: 70, unit: "₹", higher: false },
                { name: "ROI", actual: wh.financial.roi, target: 15, unit: "%", higher: true },
                { name: "Dock Utilization", actual: wh.operational.dockUtilization, target: 80, unit: "%", higher: true },
                { name: "Safety Index", actual: wh.scores.safety, target: 85, unit: "", higher: true },
              ];

              const topMetrics = [...metrics].sort((a, b) => {
                const aPct = a.higher ? a.actual / a.target : a.target / a.actual;
                const bPct = b.higher ? b.actual / b.target : b.target / b.actual;
                return bPct - aPct;
              });
              const strengths = topMetrics.slice(0, 3);
              const improvements = topMetrics.slice(-3).reverse();

              return (
                <>
                  {/* Deep Dive Header */}
                  <div className="flex items-center gap-4">
                    <ScoreRing score={wh.scores.overall} size={100} strokeWidth={8} />
                    <div>
                      <h2 className="text-xl font-bold">{wh.name} — {wh.id}</h2>
                      <p className="text-sm text-muted-foreground">{wh.city}, {wh.region} · {wh.size.toLocaleString()} sq ft</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="badge-interactive wps-rank-badge">Rank #{rank}</Badge>
                        <Badge variant="outline" className="badge-interactive text-xs">Region: {wh.region}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Score Breakdown Donut */}
                    <Card className="wps-chart-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Score Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6">
                          <ResponsiveContainer width={200} height={200}>
                            <PieChart>
                              <Pie data={scoreEntries.map((e) => ({ name: e.key, value: e.value }))} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                                {scoreEntries.map((e, i) => (
                                  <Cell key={e.key} fill={e.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="space-y-2">
                            {scoreEntries.map((e) => (
                              <div key={e.key} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                                <span className="flex-1">{e.key} ({e.weight})</span>
                                <span className="font-mono font-semibold">{e.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Metric Table */}
                    <Card className="wps-chart-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Actual vs Target</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {metrics.map((m) => {
                            const pct = m.higher
                              ? Math.round((m.actual / m.target) * 100)
                              : Math.round((m.target / m.actual) * 100);
                            return (
                              <div key={m.name} className="flex items-center gap-3 text-sm">
                                <span className="w-32 text-muted-foreground text-xs">{m.name}</span>
                                <span className="w-16 text-right font-mono">{typeof m.actual === "number" && m.actual % 1 !== 0 ? m.actual.toFixed(1) : m.actual}{m.unit}</span>
                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={`h-full rounded-full wps-metric-bar ${pct >= 100 ? "wps-metric-green" : pct >= 90 ? "wps-metric-amber" : "wps-metric-red"}`}
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                  />
                                </div>
                                <span className="w-10 text-right text-xs text-muted-foreground">{pct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="wps-strength-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" /> Top Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="glass-subtle space-y-2">
                        {strengths.map((m, i) => (
                          <div key={m.name} className="flex items-center gap-2 text-sm">
                            <Badge variant="success" className="badge-interactive text-xs">#{i + 1}</Badge>
                            <span className="flex-1">{m.name}</span>
                            <span className="font-mono text-xs">{typeof m.actual === "number" && m.actual % 1 !== 0 ? m.actual.toFixed(1) : m.actual}{m.unit}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card className="wps-improve-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                          <AlertTriangle className="h-4 w-4" /> Improvement Areas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="glass-subtle space-y-2">
                        {improvements.map((m, i) => (
                          <div key={m.name} className="flex items-center gap-2 text-sm">
                            <Badge variant="warning" className="badge-interactive text-xs">#{metrics.length - 2 + i}</Badge>
                            <span className="flex-1">{m.name}</span>
                            <span className="font-mono text-xs">{typeof m.actual === "number" && m.actual % 1 !== 0 ? m.actual.toFixed(1) : m.actual}{m.unit}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* 6-Month Trend Mini Chart */}
                  <Card className="wps-chart-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 text-violet-500" />
                        12-Week Score Trend — {wh.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={wh.trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                          <YAxis domain={["dataMin - 5", "dataMax + 5"]} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <defs>
                            <linearGradient id={`grad-${wh.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fill={`url(#grad-${wh.id})`} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              );
            })()}
          </div>
        )}

        {/* Tab 4: Operational Metrics */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <Card className="wps-chart-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="h-4 w-4 text-violet-500" />
                  Operational Metrics — All Warehouses
                </CardTitle>
              </CardHeader>
              <CardContent className="glass-subtle p-0">
                <div className="overflow-x-auto">
                  <table className="wps-metrics-table">
                    <thead>
                      <tr>
                        <th className="text-left">Warehouse</th>
                        <th className="text-right">Throughput<br /><span className="font-normal text-muted-foreground text-xs">orders/day</span></th>
                        <th className="text-right">Units/Day</th>
                        <th className="text-right">Order Acc.<br /><span className="font-normal text-muted-foreground text-xs">target: 98%</span></th>
                        <th className="text-right">On-Time<br /><span className="font-normal text-muted-foreground text-xs">target: 92%</span></th>
                        <th className="text-right">Dock Util.<br /><span className="font-normal text-muted-foreground text-xs">target: 80%</span></th>
                        <th className="text-right">Inv. Turnover<br /><span className="font-normal text-muted-foreground text-xs">target: 8x</span></th>
                        <th className="text-right">WH Util.<br /><span className="font-normal text-muted-foreground text-xs">target: 80%</span></th>
                        <th className="text-right">OEE<br /><span className="font-normal text-muted-foreground text-xs">target: 80%</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((wh) => (
                        <tr key={wh.id} className="wps-metrics-row">
                          <td className="font-medium text-left">
                            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[data.indexOf(wh)] }} />
                            {wh.name}
                          </td>
                          <td className="text-right font-mono">{wh.operational.throughputOrders.toLocaleString()}</td>
                          <td className="text-right font-mono">{wh.operational.throughputUnits.toLocaleString()}</td>
                          <td className="text-right">
                            <ConditionalBadge value={wh.operational.orderAccuracy} target={98} />
                          </td>
                          <td className="text-right">
                            <ConditionalBadge value={wh.operational.onTimeShipment} target={92} />
                          </td>
                          <td className="text-right">
                            <ConditionalBadge value={wh.operational.dockUtilization} target={80} />
                          </td>
                          <td className="text-right">
                            <ConditionalBadge value={wh.operational.inventoryTurnover} target={8} suffix="x" />
                          </td>
                          <td className="text-right">
                            <ConditionalBadge value={wh.operational.warehouseUtilization} target={80} />
                          </td>
                          <td className="text-right">
                            <ConditionalBadge value={wh.operational.oee} target={80} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 5: Financial Metrics */}
        {activeTab === 5 && (
          <div className="space-y-6">
            <Card className="wps-chart-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-violet-500" />
                  Financial Metrics — All Warehouses
                </CardTitle>
              </CardHeader>
              <CardContent className="glass-subtle p-0">
                <div className="overflow-x-auto">
                  <table className="wps-metrics-table">
                    <thead>
                      <tr>
                        <th className="text-left">Warehouse</th>
                        <th className="text-right">Cost/Order<br /><span className="font-normal text-muted-foreground text-xs">target: ≤₹70</span></th>
                        <th className="text-right">Cost/Unit<br /><span className="font-normal text-muted-foreground text-xs">target: ≤₹5</span></th>
                        <th className="text-right">Revenue<br /><span className="font-normal text-muted-foreground text-xs">₹ Lakhs</span></th>
                        <th className="text-right">Labor %<br /><span className="font-normal text-muted-foreground text-xs">target: ≤35%</span></th>
                        <th className="text-right">Energy/sqft<br /><span className="font-normal text-muted-foreground text-xs">₹/sqft</span></th>
                        <th className="text-right">ROI<br /><span className="font-normal text-muted-foreground text-xs">target: 15%</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((wh) => (
                        <tr key={wh.id} className="wps-metrics-row">
                          <td className="font-medium text-left">
                            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[data.indexOf(wh)] }} />
                            {wh.name}
                          </td>
                          <td className="text-right font-mono">
                            <span className={wh.financial.costPerOrder <= 70 ? "text-emerald-500" : wh.financial.costPerOrder <= 85 ? "text-amber-500" : "text-red-500"}>
                              ₹{wh.financial.costPerOrder}
                            </span>
                          </td>
                          <td className="text-right font-mono">
                            <span className={wh.financial.costPerUnit <= 5 ? "text-emerald-500" : wh.financial.costPerUnit <= 7 ? "text-amber-500" : "text-red-500"}>
                              ₹{wh.financial.costPerUnit}
                            </span>
                          </td>
                          <td className="text-right font-mono">₹{wh.financial.revenue}L</td>
                          <td className="text-right">
                            <ConditionalBadge value={100 - wh.financial.laborCostPct} target={65} suffix="%" />
                          </td>
                          <td className="text-right font-mono">₹{wh.financial.energyCostPerSqft}</td>
                          <td className="text-right">
                            <ConditionalBadge value={wh.financial.roi} target={15} suffix="%" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown Stacked Bar */}
            <Card className="wps-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-fuchsia-500" />
                  Cost Structure Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={data.map((wh) => ({
                    name: wh.name,
                    labor: wh.financial.laborCostPct,
                    energy: wh.financial.energyCostPerSqft * 2,
                    other: 100 - wh.financial.laborCostPct - wh.financial.energyCostPerSqft * 2,
                  }))} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="labor" stackId="a" fill="#8b5cf6" name="Labor Cost" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="energy" stackId="a" fill="#6366f1" name="Energy Cost" />
                    <Bar dataKey="other" stackId="a" fill="#e8e0f0" name="Other Cost" radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 6: Rankings & Leaderboard */}
        {activeTab === 6 && (
          <div className="space-y-6">
            {/* Overall Ranking */}
            <Card className="wps-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Overall Performance Ranking — {selectedPeriod}
                </CardTitle>
              </CardHeader>
              <CardContent className="glass-subtle p-0">
                <div className="overflow-x-auto">
                  <table className="wps-metrics-table">
                    <thead>
                      <tr>
                        <th className="text-left">Rank</th>
                        <th className="text-left">Warehouse</th>
                        <th className="text-right">Score</th>
                        <th className="text-right">vs Last Period</th>
                        <th className="text-right">Streak</th>
                        <th className="text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranked.map((wh, idx) => {
                        const change = Math.round(wh.scores.overall - (wh.trend[0]?.score ?? wh.scores.overall));
                        const streak = [1, 3, 5, 0, 0, 2][data.indexOf(wh)];
                        return (
                          <tr key={wh.id} className={`wps-ranking-row ${idx < 3 ? "wps-ranking-top" : ""}`}>
                            <td className="text-left">
                              <div className={`wps-rank-cell ${idx === 0 ? "wps-rank-gold" : idx === 1 ? "wps-rank-silver" : idx === 2 ? "wps-rank-bronze" : ""}`}>
                                {idx === 0 ? <Crown className="h-4 w-4" /> : idx === 1 ? <Medal className="h-4 w-4" /> : idx === 2 ? <Award className="h-4 w-4" /> : <span className="text-sm">#{idx + 1}</span>}
                              </div>
                            </td>
                            <td className="text-left font-medium">
                              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[data.indexOf(wh)] }} />
                              {wh.name}
                            </td>
                            <td className="text-right">
                              <span className="text-lg font-bold font-mono">{wh.scores.overall}</span>
                              <span className="text-xs text-muted-foreground">/100</span>
                            </td>
                            <td className="text-right">
                              <span className={`inline-flex items-center gap-0.5 text-sm ${change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {change >= 0 ? "+" : ""}{change}
                              </span>
                            </td>
                            <td className="text-right">
                              {streak > 0 ? (
                                <Badge className="badge-interactive bg-orange-100 text-orange-700 text-xs"><Flame className="h-3 w-3 mr-0.5" /> {streak} months</Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="text-right">
                              <Badge variant={idx < 2 ? "success" : idx < 4 ? "default" : "destructive"} className="badge-interactive text-xs">
                                {idx < 2 ? "Excellent" : idx < 4 ? "Good" : "Needs Work"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Category Champions */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(["operations", "quality", "cost", "safety", "people"] as const).map((cat) => {
                const leader = [...data].sort((a, b) => b.scores[cat] - a.scores[cat])[0];
                const icons: Record<string, React.ReactNode> = {
                  operations: <Zap className="h-5 w-5" />,
                  quality: <Shield className="h-5 w-5" />,
                  cost: <DollarSign className="h-5 w-5" />,
                  safety: <Star className="h-5 w-5" />,
                  people: <Users className="h-5 w-5" />,
                };
                return (
                  <Card key={cat} className="wps-champion-card">
                    <CardContent className="glass-subtle pt-4 text-center">
                      <div className="wps-champion-icon">{icons[cat]}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">Champion</div>
                      <div className="text-xs capitalize font-medium">{cat}</div>
                      <div className="text-sm font-bold mt-1">{leader?.name}</div>
                      <div className="text-xs font-mono text-violet-500">{leader?.scores[cat]} pts</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Bottom 3 Performance Alerts */}
            <Card className="wps-alerts-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  Performance Alerts — Bottom 3 Warehouses
                </CardTitle>
              </CardHeader>
              <CardContent className="glass-subtle space-y-3">
                {ranked.slice(-3).map((wh, idx) => {
                  const metricsNeedingAttention: string[] = [];
                  if (wh.scores.operations < 80) metricsNeedingAttention.push("Operations");
                  if (wh.scores.quality < 80) metricsNeedingAttention.push("Quality");
                  if (wh.scores.cost < 75) metricsNeedingAttention.push("Cost Efficiency");
                  if (wh.scores.safety < 80) metricsNeedingAttention.push("Safety");
                  if (wh.operational.oee < 70) metricsNeedingAttention.push("OEE");
                  if (wh.operational.onTimeShipment < 90) metricsNeedingAttention.push("On-Time Shipment");
                  return (
                    <div key={wh.id} className="wps-alert-item wps-alert-warning">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{wh.name}</span>
                          <Badge variant="destructive" className="badge-interactive text-[10px]">Score: {wh.scores.overall}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Areas needing attention: {metricsNeedingAttention.length > 0 ? metricsNeedingAttention.join(", ") : "Multiple areas below target"}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="btn-outline-animate text-xs h-7" onClick={() => { setSelectedWarehouse(wh.id); setActiveTab(3); }}>
                        View Details
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
