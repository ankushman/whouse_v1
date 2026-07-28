"use client"

import { useState, useMemo, Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts"
import {
  BarChart3, TrendingUp, TrendingDown, Target, Zap, ArrowUpRight,
  ArrowDownRight, Activity, Globe, Warehouse, Users, Package,
  Truck, IndianRupee, Clock, AlertTriangle, CheckCircle2, Info,
  Filter, Search, Eye, X, ChevronRight, Brain, Layers,
  PieChart as PieIcon, LineChart as LineIcon, Award, Sparkles,
  Database, CalendarRange, MapPin, Settings, Download, RefreshCw,
  ArrowLeftRight, Megaphone, Star, ShieldCheck, FileText
} from "lucide-react"

// ──────────────────────────────────────────────────────
// Seed-based mock data generation
// ──────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rng = seededRandom(147147)

function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

// ──────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────
const WAREHOUSES = [
  "Mumbai Central", "Delhi NCR Hub", "Chennai Port", "Bangalore South",
  "Hyderabad East", "Kolkata Warehouse", "Pune West", "Ahmedabad North"
] as const

const METRICS = [
  "Throughput", "Order Accuracy", "On-Time Shipment", "Labor Productivity",
  "Space Utilization", "Inventory Turnover", "Cost Per Unit", "Customer Satisfaction",
  "Safety Score", "Energy Efficiency", "Equipment Uptime", "Dock Utilization"
] as const

const KPI_DIMENSIONS = ["Revenue", "Cost", "Efficiency", "Quality", "Safety", "Sustainability"] as const

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const

// ──────────────────────────────────────────────────────
// Mock Data Generation
// ──────────────────────────────────────────────────────

// Monthly throughput data
const monthlyThroughput = MONTHS.map((m, i) => ({
  month: m,
  inbound: randInt(8000, 15000),
  outbound: randInt(7000, 14000),
  returns: randInt(500, 2000),
  throughputScore: randFloat(80, 98),
}))

// Revenue & Cost
const monthlyFinance = MONTHS.map(m => ({
  month: m,
  revenue: randInt(150, 350),
  cost: randInt(100, 250),
  profit: randInt(30, 120),
  margin: randFloat(12, 28),
}))

// Warehouse comparison scores
const warehouseScores = WAREHOUSES.map(wh => ({
  name: wh.split(" ")[0],
  throughput: randInt(75, 99),
  accuracy: randInt(85, 99),
  onTime: randInt(70, 98),
  labor: randInt(65, 95),
  space: randInt(60, 95),
  safety: randInt(80, 100),
  overall: randFloat(72, 96),
}))

// Top metrics ranking
const metricRankings = METRICS.map((m, i) => ({
  rank: i + 1,
  metric: m,
  current: randFloat(70, 98),
  target: randFloat(85, 99),
  previous: randFloat(68, 95),
  trend: pick(["up" as const, "up" as const, "down" as const, "flat" as const]),
  status: rng() > 0.7 ? "on_track" as const : rng() > 0.3 ? "warning" as const : "off_track" as const,
}))

// Radar chart data for warehouse comparison
const radarData = [
  { metric: "Throughput", Mumbai: 92, Delhi: 88, Chennai: 85, Bangalore: 95 },
  { metric: "Accuracy", Mumbai: 96, Delhi: 94, Chennai: 92, Bangalore: 97 },
  { metric: "On-Time", Mumbai: 89, Delhi: 91, Chennai: 83, Bangalore: 93 },
  { metric: "Labor", Mumbai: 85, Delhi: 82, Chennai: 78, Bangalore: 88 },
  { metric: "Space", Mumbai: 72, Delhi: 88, Chennai: 80, Bangalore: 76 },
  { metric: "Safety", Mumbai: 94, Delhi: 96, Chennai: 91, Bangalore: 98 },
]

// Dimension scores
const dimensionScores = KPI_DIMENSIONS.map(d => ({
  dimension: d,
  score: randFloat(60, 95),
  target: randFloat(80, 99),
  weight: randFloat(10, 25),
  trend: randFloat(-5, 8),
}))

// Heatmap: warehouse vs day-of-week performance
const heatmapData = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map(day => {
    const entry: Record<string, string | number> = { day }
    WAREHOUSES.slice(0, 6).forEach(wh => {
      entry[wh.split(" ")[0]] = randInt(55, 98)
    })
    return entry
  })
})()

// Cost breakdown
const costBreakdown = [
  { category: "Labor", amount: randInt(200, 400), pct: randFloat(25, 40) },
  { category: "Equipment", amount: randInt(80, 150), pct: randFloat(10, 18) },
  { category: "Utilities", amount: randInt(40, 80), pct: randFloat(5, 12) },
  { category: "Logistics", amount: randInt(150, 300), pct: randFloat(20, 30) },
  { category: "Inventory", amount: randInt(100, 200), pct: randFloat(12, 22) },
  { category: "Technology", amount: randInt(50, 100), pct: randFloat(6, 12) },
  { category: "Safety & Compliance", amount: randInt(20, 50), pct: randFloat(3, 8) },
]

// Insights
const insights = [
  { type: "positive", icon: TrendingUp, title: "Bangalore South leads in throughput (+12% MoM)", desc: "Automation upgrade in Zone B showing strong results. Recommend replicating in Chennai." },
  { type: "negative", icon: AlertTriangle, title: "Kolkata warehouse space utilization below target (58%)", desc: "Seasonal dip expected in Q3. Consider cross-docking excess inventory to Pune." },
  { type: "neutral", icon: Brain, title: "Labor productivity stable across all warehouses", desc: "Average 87.3 units/hour. Hyderabad shows 5% improvement after shift optimization." },
  { type: "positive", icon: CheckCircle2, title: "On-time shipment rate reaches 94.2% — best this quarter", desc: "Route optimization and fleet management improvements contributing to gains." },
  { type: "negative", icon: IndianRupee, title: "Cost per unit increased 3.2% due to fuel price hike", desc: "Diesel prices up ₹8.4/litre in July. Consider CNG fleet expansion in Delhi NCR." },
  { type: "neutral", icon: Activity, title: "Safety incidents down 15% compared to same period last year", desc: "Zero major incidents. 2 minor near-misses reported in Mumbai loading bay." },
]

// Comparison data: current vs previous quarter
const quarterlyComparison = [
  { metric: "Total Throughput", current: randInt(80000, 120000), previous: randInt(75000, 115000) },
  { metric: "Avg Order Value (₹)", current: randInt(5000, 15000), previous: randInt(4500, 14000) },
  { metric: "Order Accuracy (%)", current: randFloat(96, 99.5), previous: randFloat(95, 99) },
  { metric: "Avg Ship Time (hrs)", current: randFloat(18, 36), previous: randFloat(20, 40) },
  { metric: "Return Rate (%)", current: randFloat(2, 6), previous: randFloat(3, 7) },
  { metric: "Inventory Turns", current: randFloat(8, 14), previous: randFloat(7, 13) },
]

// Category performance
const categoryPerformance = WAREHOUSES.map(wh => ({
  name: wh.split(" ")[0],
  aGrade: randInt(30, 80),
  bGrade: randInt(20, 50),
  cGrade: randInt(5, 25),
  dGrade: randInt(0, 10),
}))

// ──────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────
function fmtNum(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

function fmtINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`
}

function getHeatClass(v: number): string {
  return v >= 85 ? "wabi-heatmap-low" : v >= 70 ? "wabi-heatmap-mid" : "wabi-heatmap-high"
}

// ──────────────────────────────────────────────────────
// Color constants for PieChart
// ──────────────────────────────────────────────────────
const COST_COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#ec4899"]
const DIM_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#06b6d4", "#8b5cf6"]
const GRADE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#f43f5e"]
const RADAR_COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b"]

// ──────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────
export default function WarehouseBIView() {
  const [activeTab, setActiveTab] = useState(0)
  const [dimFilter, setDimFilter] = useState("All")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedWH, setSelectedWH] = useState<typeof warehouseScores[0] | null>(null)

  const tabs = ["Executive Dashboard", "Warehouse Comparison", "KPI Deep Dive", "Cost Analytics", "Strategic Insights"]

  // ── KPI calculations ────────────────────────────────
  const totalThroughput = monthlyThroughput.reduce((s, m) => s + m.outbound, 0)
  const avgAccuracy = randFloat(96.2, 98.8)
  const onTimeRate = randFloat(90, 96)
  const costPerUnit = randInt(120, 280)
  const avgUtilization = randFloat(70, 88)
  const safetyIndex = randFloat(88, 97)

  // ── Filtered data ──────────────────────────────────
  const filteredMetrics = useMemo(() => {
    if (dimFilter === "All") return metricRankings
    return metricRankings.filter(m => {
      if (["Revenue", "Cost"].includes(dimFilter)) return m.metric === "Cost Per Unit" || m.metric === "Throughput"
      if (dimFilter === "Efficiency") return ["Labor Productivity", "Space Utilization", "Equipment Uptime", "Dock Utilization"].includes(m.metric)
      if (dimFilter === "Quality") return m.metric === "Order Accuracy" || m.metric === "Customer Satisfaction"
      if (dimFilter === "Safety") return m.metric === "Safety Score"
      if (dimFilter === "Sustainability") return m.metric === "Energy Efficiency"
      return true
    })
  }, [dimFilter])

  // ── Drawer ──────────────────────────────────────────
  const openDrawer = (wh: typeof warehouseScores[0]) => {
    setSelectedWH(wh)
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
    setSelectedWH(null)
  }

  // ══════════════════════════════════════════════════
  // TAB 0: Executive Dashboard
  // ══════════════════════════════════════════════════
  function renderExecutiveDashboard() {
    return (
      <Fragment>
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total Throughput", value: fmtNum(totalThroughput), sub: "units/month", icon: Package, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400", trend: "+8.3%", up: true },
            { label: "Order Accuracy", value: `${avgAccuracy}%`, sub: "across all WH", icon: Target, color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400", trend: "+0.4%", up: true },
            { label: "On-Time Rate", value: `${onTimeRate}%`, sub: "shipment SLA", icon: Truck, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", trend: "+2.1%", up: true },
            { label: "Cost Per Unit", value: fmtINR(costPerUnit), sub: "avg handling", icon: IndianRupee, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", trend: "-3.2%", up: false },
            { label: "Space Utilization", value: `${avgUtilization}%`, sub: "avg capacity", icon: Warehouse, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", trend: "+5.6%", up: true },
            { label: "Safety Index", value: `${safetyIndex}`, sub: "EHS score", icon: ShieldCheck, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", trend: "+1.2", up: true },
          ].map((kpi, idx) => (
            <div key={idx} className="wabi-kpi-card">
              <div className="flex items-start justify-between">
                <div className="wabi-kpi-label">{kpi.label}</div>
                <div className={`wabi-kpi-icon ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 wabi-kpi-value">{String(kpi.value)}</div>
              <div className="mt-0.5 wabi-kpi-label">{kpi.sub}</div>
              <div className={`mt-1 wabi-kpi-trend ${kpi.up ? "wabi-kpi-trend-up" : "wabi-kpi-trend-down"}`}>
                {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.trend} vs last quarter
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Monthly Throughput */}
          <Card className="border-indigo-100 dark:border-indigo-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Activity className="h-4 w-4 text-indigo-500" />
                Monthly Throughput Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={monthlyThroughput}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => fmtNum(Number(v))} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [fmtNum(v), ""]} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="inbound" fill="#6366f1" radius={[2, 2, 0, 0]} name="Inbound" />
                  <Bar dataKey="outbound" fill="#10b981" radius={[2, 2, 0, 0]} name="Outbound" />
                  <Bar dataKey="returns" fill="#f43f5e" radius={[2, 2, 0, 0]} name="Returns" />
                  <Line dataKey="throughputScore" stroke="#f59e0b" strokeWidth={2} dot={false} name="Score %" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue vs Cost */}
          <Card className="border-indigo-100 dark:border-indigo-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <IndianRupee className="h-4 w-4 text-teal-500" />
                Revenue vs Cost (₹ Lakhs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={monthlyFinance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`₹${v}L`]} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[2, 2, 0, 0]} name="Revenue" />
                  <Bar dataKey="cost" fill="#f43f5e" radius={[2, 2, 0, 0]} name="Cost" />
                  <Line dataKey="margin" stroke="#6366f1" strokeWidth={2} dot={false} name="Margin %" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Dimension Scores */}
          <Card className="border-indigo-100 dark:border-indigo-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-amber-500" />
                KPI Dimension Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dimensionScores.map((d, idx) => {
                  const dc = [...DIM_COLORS]
                  return (
                    <div key={d.dimension} className="wabi-comparison-bar">
                      <span className="wabi-comparison-label">{d.dimension}</span>
                      <div className="wabi-comparison-track">
                        <div
                          className="wabi-comparison-fill"
                          style={{ width: `${Math.min(d.score, 100)}%`, backgroundColor: dc[idx] || "#6366f1" }}
                        />
                      </div>
                      <span className="wabi-comparison-value">{d.score.toFixed(0)}</span>
                      <span className={`text-[10px] font-medium ${d.trend >= 0 ? "text-teal-600 dark:text-teal-400" : "text-red-600 dark:text-red-400"}`}>
                        {d.trend >= 0 ? "+" : ""}{d.trend.toFixed(1)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Heatmap + Quarterly Comparison */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Performance Heatmap */}
          <Card className="border-indigo-100 dark:border-indigo-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CalendarRange className="h-4 w-4 text-purple-500" />
                Warehouse Performance Heatmap (by Day)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left font-semibold text-gray-500 dark:text-gray-400">Day</th>
                      {WAREHOUSES.slice(0, 6).map(wh => (
                        <th key={wh} className="px-1 py-1 text-center font-semibold text-gray-500 dark:text-gray-400">{wh.split(" ")[0]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row, idx) => (
                      <tr key={String(idx)}>
                        <td className="px-2 py-1 font-medium text-gray-700 dark:text-gray-300">{String(row.day)}</td>
                        {WAREHOUSES.slice(0, 6).map(wh => {
                          const v = Number(row[wh.split(" ")[0]])
                          return (
                            <td key={wh} className="px-1 py-1 text-center">
                              <div className={`mx-auto ${getHeatClass(v)}`} style={{ width: 36, height: 36 }}>
                                {String(v)}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex items-center justify-center gap-4 text-[10px]">
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-teal-200" /> ≥85 Excellent</div>
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-amber-200" /> 70-84 Good</div>
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-red-200" /> &lt;70 Needs Attention</div>
              </div>
            </CardContent>
          </Card>

          {/* Quarterly Comparison */}
          <Card className="border-indigo-100 dark:border-indigo-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                Quarter-over-Quarter Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quarterlyComparison.map(qc => {
                  const change = ((Number(qc.current) - Number(qc.previous)) / Number(qc.previous)) * 100
                  const isInverse = qc.metric.includes("Ship Time") || qc.metric.includes("Return")
                  const positive = isInverse ? change < 0 : change > 0
                  return (
                    <div key={qc.metric}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{qc.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{String(qc.previous)}</span>
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{String(qc.current)}</span>
                          <span className={`text-[10px] font-semibold ${positive ? "text-teal-600 dark:text-teal-400" : "text-red-600 dark:text-red-400"}`}>
                            {positive ? "+" : ""}{change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="wabi-progress-track">
                        <div
                          className={`wabi-progress-fill ${positive ? "wabi-progress-teal" : "wabi-progress-red"}`}
                          style={{ width: `${Math.min(Math.abs(change) * 3 + 40, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="border-indigo-100 dark:border-indigo-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Brain className="h-4 w-4 text-indigo-500" />
              Strategic Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {insights.map((ins, idx) => (
                <div key={idx} className={`wabi-insight-card wabi-insight-card-${ins.type}`}>
                  <div className="flex items-start gap-2">
                    <ins.icon className={`h-4 w-4 shrink-0 mt-0.5 ${ins.type === "positive" ? "text-teal-600 dark:text-teal-400" : ins.type === "negative" ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`} />
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{ins.title}</div>
                      <div className="mt-1 text-[10px] text-gray-600 dark:text-gray-400">{ins.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 1: Warehouse Comparison
  // ══════════════════════════════════════════════════
  function renderWarehouseComparison() {
    return (
      <Fragment>
        {/* Warehouse Score Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          {warehouseScores.sort((a, b) => b.overall - a.overall).map((wh, idx) => (
            <div key={wh.name} className="wabi-score-card cursor-pointer" onClick={() => openDrawer(wh)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${idx === 0 ? "bg-gradient-to-br from-amber-400 to-yellow-500" : idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400" : idx === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700" : "bg-gradient-to-br from-indigo-400 to-indigo-600"}`}>
                    {String(idx + 1)}
                  </span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{wh.name}</span>
                </div>
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </div>
              <div className={`wabi-score-circle mx-auto ${wh.overall >= 90 ? "wabi-score-circle-excellent" : wh.overall >= 80 ? "wabi-score-circle-good" : wh.overall >= 70 ? "wabi-score-circle-average" : "wabi-score-circle-poor"}`}>
                <div className="text-center">
                  <div className="wabi-score-value">{wh.overall.toFixed(0)}</div>
                  <div className="wabi-score-label">Score</div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1 text-[10px]">
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Throughput</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{String(wh.throughput)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Accuracy</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{String(wh.accuracy)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">On-Time</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{String(wh.onTime)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Multi-metric comparison */}
          <Card className="border-indigo-100 dark:border-indigo-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Multi-Metric Warehouse Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={warehouseScores}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="throughput" fill="#6366f1" radius={[2, 2, 0, 0]} name="Throughput" />
                  <Bar dataKey="accuracy" fill="#10b981" radius={[2, 2, 0, 0]} name="Accuracy" />
                  <Bar dataKey="onTime" fill="#f59e0b" radius={[2, 2, 0, 0]} name="On-Time" />
                  <Bar dataKey="labor" fill="#06b6d4" radius={[2, 2, 0, 0]} name="Labor" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar chart - top 4 warehouses */}
          <Card className="border-indigo-100 dark:border-indigo-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Layers className="h-4 w-4 text-teal-500" />
                Radar Comparison (Top 4 Warehouses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 8 }} />
                  <Radar name="Mumbai" dataKey="Mumbai" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Delhi" dataKey="Delhi" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Chennai" dataKey="Chennai" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Bangalore" dataKey="Bangalore" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Grade Distribution */}
        <Card className="border-indigo-100 dark:border-indigo-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Award className="h-4 w-4 text-amber-500" />
              Warehouse Performance Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="aGrade" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="A (90+)" />
                <Bar dataKey="bGrade" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="B (80-89)" />
                <Bar dataKey="cGrade" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="C (70-79)" />
                <Bar dataKey="dGrade" stackId="a" fill="#f43f5e" radius={[2, 2, 0, 0]} name="D (&lt;70)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 2: KPI Deep Dive
  // ══════════════════════════════════════════════════
  function renderKPIDeepDive() {
    return (
      <Fragment>
        {/* Dimension Filter */}
        <div className="flex flex-wrap gap-2">
          {(["All", ...KPI_DIMENSIONS] as Array<string>).map(d => (
            <button
              key={d}
              className={`wabi-dim-pill ${dimFilter === d ? "wabi-dim-pill-active" : "border-gray-200 dark:border-gray-700"}`}
              onClick={() => setDimFilter(d)}
            >
              {d === "All" ? <Database className="h-3 w-3" /> :
               d === "Revenue" ? <IndianRupee className="h-3 w-3" /> :
               d === "Cost" ? <ArrowDownRight className="h-3 w-3" /> :
               d === "Efficiency" ? <Zap className="h-3 w-3" /> :
               d === "Quality" ? <Target className="h-3 w-3" /> :
               d === "Safety" ? <ShieldCheck className="h-3 w-3" /> :
               <Globe className="h-3 w-3" />}
              {d}
            </button>
          ))}
        </div>

        {/* KPI Ranking Table */}
        <div className="wabi-table-wrap">
          <table className="wabi-table">
            <thead className="wabi-table-head">
              <tr>
                <th>#</th>
                <th>Metric</th>
                <th>Current</th>
                <th>Target</th>
                <th>Previous</th>
                <th>Gap to Target</th>
                <th>Trend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map(m => {
                const gap = m.target - m.current
                return (
                  <tr key={m.metric} className="wabi-table-row">
                    <td className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{String(m.rank)}</td>
                    <td className="text-xs font-medium">{m.metric}</td>
                    <td className="text-xs font-bold text-gray-900 dark:text-gray-100">{m.current.toFixed(1)}</td>
                    <td className="text-xs text-gray-600 dark:text-gray-400">{m.target.toFixed(1)}</td>
                    <td className="text-xs text-gray-600 dark:text-gray-400">{m.previous.toFixed(1)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <div className="wabi-progress-track">
                            <div
                              className={`wabi-progress-fill ${gap <= 0 ? "wabi-progress-teal" : gap <= 5 ? "wabi-progress-amber" : "wabi-progress-red"}`}
                              style={{ width: `${Math.min(((m.current / m.target) * 100), 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-[10px] font-semibold ${gap <= 0 ? "text-teal-600 dark:text-teal-400" : gap <= 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                          {gap > 0 ? `-${gap.toFixed(1)}` : "Met"}
                        </span>
                      </div>
                    </td>
                    <td>
                      {m.trend === "up" && <ArrowUpRight className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
                      {m.trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />}
                      {m.trend === "flat" && <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td>
                      <span className={`wabi-metric-badge ${
                        m.status === "on_track" ? "wabi-badge-positive" :
                        m.status === "warning" ? "wabi-badge-warning" : "wabi-badge-negative"
                      }`}>
                        {m.status === "on_track" ? "On Track" : m.status === "warning" ? "Warning" : "Off Track"}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Dimension Weights PieChart */}
        <Card className="border-indigo-100 dark:border-indigo-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <PieIcon className="h-4 w-4 text-purple-500" />
              KPI Dimension Weights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={dimensionScores} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="weight" nameKey="dimension" label={({ dimension, percent }) => `${dimension} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {dimensionScores.map((_, idx) => {
                    const dc = [...DIM_COLORS]
                    return <Cell key={String(idx)} fill={dc[idx] || "#6366f1"} />
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Metric trend line chart */}
        <Card className="border-indigo-100 dark:border-indigo-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <LineIcon className="h-4 w-4 text-blue-500" />
              Key Metric Trends (12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyThroughput}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[70, 100]} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="throughputScore" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Throughput Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 3: Cost Analytics
  // ══════════════════════════════════════════════════
  function renderCostAnalytics() {
    const totalCost = costBreakdown.reduce((s, c) => s + c.amount, 0)

    return (
      <Fragment>
        {/* Cost Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Monthly Cost", value: fmtINR(totalCost), icon: IndianRupee, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
            { label: "Cost Per Unit", value: fmtINR(costPerUnit), icon: Package, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
            { label: "Labor Share", value: `${((costBreakdown[0].amount / totalCost) * 100).toFixed(0)}%`, icon: Users, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
            { label: "Margin Improvement", value: "+2.4%", icon: TrendingUp, color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
          ].map((kpi, idx) => (
            <div key={idx} className="wabi-kpi-card">
              <div className="flex items-start justify-between">
                <div className="wabi-kpi-label">{kpi.label}</div>
                <div className={`wabi-kpi-icon ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 wabi-kpi-value">{String(kpi.value)}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Cost Breakdown PieChart */}
          <Card className="border-indigo-100 dark:border-indigo-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <PieIcon className="h-4 w-4 text-indigo-500" />
                Cost Breakdown by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={costBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="amount" nameKey="category" label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {costBreakdown.map((_, idx) => {
                      const cc = [...COST_COLORS]
                      return <Cell key={String(idx)} fill={cc[idx] || "#6366f1"} />
                    })}
                  </Pie>
                  <Tooltip formatter={(v: number) => [fmtINR(v), "Amount"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Revenue, Cost, Profit */}
          <Card className="border-indigo-100 dark:border-indigo-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4 text-teal-500" />
                Monthly Revenue & Profit Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={monthlyFinance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`₹${v}L`]} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="profit" fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2} name="Profit" />
                  <Bar dataKey="cost" fill="#f43f5e" fillOpacity={0.6} radius={[2, 2, 0, 0]} name="Cost" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Cost Category Table */}
        <Card className="border-indigo-100 dark:border-indigo-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-amber-500" />
              Cost Category Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="wabi-table-wrap">
              <table className="wabi-table">
                <thead className="wabi-table-head">
                  <tr>
                    <th>Category</th>
                    <th>Amount (₹)</th>
                    <th>% of Total</th>
                    <th>Budget Var</th>
                    <th>YoY Change</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {costBreakdown.map((c, idx) => {
                    const budgetVar = randFloat(-8, 12)
                    const yoyChange = randFloat(-5, 15)
                    return (
                      <tr key={c.category} className="wabi-table-row">
                        <td className="text-xs font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COST_COLORS[idx] || "#6366f1" }} />
                            {c.category}
                          </div>
                        </td>
                        <td className="text-xs font-bold text-gray-900 dark:text-gray-100">{fmtINR(c.amount * 1000)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16">
                              <div className="wabi-progress-track">
                                <div className="wabi-progress-fill wabi-progress-indigo" style={{ width: `${c.pct}%` }} />
                              </div>
                            </div>
                            <span className="text-xs">{c.pct.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`wabi-metric-badge ${budgetVar <= 0 ? "wabi-badge-positive" : "wabi-badge-negative"}`}>
                            {budgetVar > 0 ? "+" : ""}{budgetVar.toFixed(1)}%
                          </span>
                        </td>
                        <td>
                          <span className={`wabi-metric-badge ${yoyChange <= 5 ? "wabi-badge-neutral" : "wabi-badge-warning"}`}>
                            {yoyChange > 0 ? "+" : ""}{yoyChange.toFixed(1)}%
                          </span>
                        </td>
                        <td>
                          <div className="wabi-progress-track" style={{ width: 60 }}>
                            <div
                              className={`wabi-progress-fill ${budgetVar <= 0 ? "wabi-progress-teal" : "wabi-progress-red"}`}
                              style={{ width: `${Math.min(Math.abs(budgetVar) * 5 + 20, 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 4: Strategic Insights
  // ══════════════════════════════════════════════════
  function renderStrategicInsights() {
    return (
      <Fragment>
        {/* Insights Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((ins, idx) => (
            <div key={idx} className={`wabi-insight-card wabi-insight-card-${ins.type}`}>
              <div className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  ins.type === "positive" ? "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" :
                  ins.type === "negative" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                  "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                }`}>
                  <ins.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{ins.title}</div>
                  <div className="mt-1 text-[10px] leading-relaxed text-gray-600 dark:text-gray-400">{ins.desc}</div>
                  <div className="mt-2">
                    <Badge variant="outline" className={`text-[9px] ${
                      ins.type === "positive" ? "border-teal-300 text-teal-700 dark:border-teal-800 dark:text-teal-400" :
                      ins.type === "negative" ? "border-red-300 text-red-700 dark:border-red-800 dark:text-red-400" :
                      "border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                    }`}>
                      {ins.type === "positive" ? "Opportunity" : ins.type === "negative" ? "Risk" : "Observation"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Trend */}
        <Card className="border-indigo-100 dark:border-indigo-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Activity className="h-4 w-4 text-indigo-500" />
              Overall Performance Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MONTHS.map((m, i) => ({
                month: m,
                score: randFloat(78, 92),
                target: 85,
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[70, 100]} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Area type="monotone" dataKey="score" fill="#6366f1" fillOpacity={0.15} stroke="#6366f1" strokeWidth={2} name="Overall Score" />
                <Line type="monotone" dataKey="target" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-indigo-100 dark:border-indigo-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Megaphone className="h-4 w-4 text-amber-500" />
              BI Alerts & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { type: "critical", title: "Kolkata warehouse below safety threshold", desc: "Safety score dropped to 82 — immediate EHS audit recommended" },
                { type: "warning", title: "Labor cost trending 5% above budget in Delhi NCR", desc: "Overtime hours increased 18% due to peak season. Consider temp staffing." },
                { type: "info", title: "Bangalore warehouse achieving 95+ across all metrics", desc: "Best-performing warehouse. Use as benchmark for replication program." },
                { type: "warning", title: "Equipment downtime up 12% at Chennai Port", desc: "3 forklifts overdue for scheduled maintenance. Prioritize service." },
                { type: "critical", title: "Inventory turnover ratio below 8 at Ahmedabad North", desc: "Dead stock accumulation detected. Recommend clearance sale or redistribution." },
              ].map((alert, idx) => (
                <div key={idx} className={`wabi-alert wabi-alert-${alert.type}`}>
                  <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${alert.type === "critical" ? "text-red-500" : alert.type === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{alert.title}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">{alert.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 gap-1">
            <Download className="h-3.5 w-3.5" /> Export Report
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <Settings className="h-3.5 w-3.5" /> Configure KPIs
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <FileText className="h-3.5 w-3.5" /> Schedule Report
          </Button>
        </div>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // DRAWER: Warehouse Detail
  // ══════════════════════════════════════════════════
  function renderDrawer() {
    if (!selectedWH) return null
    const wh = selectedWH

    return (
      <div className="wabi-drawer-overlay" onClick={closeDrawer}>
        <div className="wabi-drawer-panel" onClick={e => e.stopPropagation()}>
          <div className="wabi-drawer-header-gradient bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5" />
                  <span className="text-lg font-bold">{wh.name}</span>
                </div>
                <div className="mt-1 text-sm opacity-90">Warehouse Performance Report</div>
                <div className="mt-1 text-xs opacity-75">July 2026 | All Metrics</div>
              </div>
              <button onClick={closeDrawer} className="rounded-lg bg-white/20 p-1.5 transition-colors hover:bg-white/30">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{wh.overall.toFixed(0)}</div>
                <div className="text-[10px] opacity-75">Overall Score</div>
              </div>
              <div className={`wabi-score-circle ${wh.overall >= 90 ? "wabi-score-circle-excellent" : wh.overall >= 80 ? "wabi-score-circle-good" : "wabi-score-circle-average"}`} style={{ width: 80, height: 80, borderColor: "rgba(255,255,255,0.5)" }}>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{wh.overall.toFixed(1)}</div>
                  <div className="text-[9px] text-white/70">Composite</div>
                </div>
              </div>
            </div>
          </div>

          <div className="wabi-drawer-body">
            {/* Metrics Grid */}
            <div className="wabi-drawer-section">
              <div className="wabi-drawer-section-title">Performance Metrics</div>
              <div className="wabi-drawer-field-grid">
                {[
                  { label: "Throughput", value: String(wh.throughput) },
                  { label: "Accuracy", value: String(wh.accuracy) },
                  { label: "On-Time Rate", value: String(wh.onTime) },
                  { label: "Labor Productivity", value: String(wh.labor) },
                  { label: "Space Utilization", value: String(wh.space) },
                  { label: "Safety Score", value: String(wh.safety) },
                ].map((f, idx) => (
                  <div key={idx} className="wabi-drawer-field">
                    <div className="wabi-drawer-field-label">{f.label}</div>
                    <div className="flex items-center gap-2">
                      <div className="wabi-drawer-field-value">{f.value}</div>
                      <span className={`wabi-metric-badge ${
                        Number(f.value) >= 90 ? "wabi-badge-positive" :
                        Number(f.value) >= 75 ? "wabi-badge-neutral" : "wabi-badge-negative"
                      }`}>
                        {Number(f.value) >= 90 ? "Excellent" : Number(f.value) >= 75 ? "Good" : "Needs Work"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric Bars */}
            <div className="wabi-drawer-section">
              <div className="wabi-drawer-section-title">Score Breakdown</div>
              <div className="space-y-3">
                {(["Throughput", "Accuracy", "On-Time", "Labor", "Space", "Safety"] as const).map((metric, idx) => {
                  const val = [wh.throughput, wh.accuracy, wh.onTime, wh.labor, wh.space, wh.safety][idx]
                  return (
                    <div key={metric}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{metric}</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{String(val)}</span>
                      </div>
                      <div className="wabi-progress-track">
                        <div
                          className={`wabi-progress-fill ${val >= 90 ? "wabi-progress-teal" : val >= 75 ? "wabi-progress-blue" : val >= 60 ? "wabi-progress-amber" : "wabi-progress-red"}`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Grade */}
            <div className="wabi-drawer-section">
              <div className="wabi-drawer-section-title">Performance Grade</div>
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white ${
                  wh.overall >= 90 ? "bg-gradient-to-br from-emerald-400 to-teal-500" :
                  wh.overall >= 80 ? "bg-gradient-to-br from-blue-400 to-indigo-500" :
                  wh.overall >= 70 ? "bg-gradient-to-br from-amber-400 to-yellow-500" :
                  "bg-gradient-to-br from-red-400 to-rose-500"
                }`}>
                  {wh.overall >= 90 ? "A" : wh.overall >= 80 ? "B" : wh.overall >= 70 ? "C" : "D"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {wh.overall >= 90 ? "Excellent Performance" : wh.overall >= 80 ? "Good Performance" : wh.overall >= 70 ? "Average Performance" : "Below Target"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {wh.overall >= 90 ? "Top quartile — benchmark candidate" :
                     wh.overall >= 80 ? "Above average — maintain trajectory" :
                     wh.overall >= 70 ? "Near target — focus on weak areas" :
                     "Needs improvement — action plan required"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="wabi-drawer-section">
              <div className="wabi-drawer-section-title">Quick Actions</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 gap-1">
                  <BarChart3 className="h-3.5 w-3.5" /> Full Report
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <RefreshCw className="h-3.5 w-3.5" /> Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════════
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">Warehouse Analytics & BI</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Unified business intelligence dashboard with cross-warehouse analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            8 Warehouses
          </Badge>
          <Badge variant="outline">
            {MONTHS[6]} 2026
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all duration-150 ${
              activeTab === idx
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-50"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="wabi-tab-content">
        {activeTab === 0 && renderExecutiveDashboard()}
        {activeTab === 1 && renderWarehouseComparison()}
        {activeTab === 2 && renderKPIDeepDive()}
        {activeTab === 3 && renderCostAnalytics()}
        {activeTab === 4 && renderStrategicInsights()}
      </div>

      {/* Drawer */}
      {drawerOpen && renderDrawer()}
    </div>
  )
}
