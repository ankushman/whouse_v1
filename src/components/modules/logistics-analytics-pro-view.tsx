"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  ChartSpline, Search, Eye, ArrowUpDown, TrendingUp, TrendingDown,
  Clock, IndianRupee, Star, AlertTriangle, CheckCircle, Activity,
  BarChart3, Target, Zap, ArrowRightLeft, Package, Truck, Globe,
  Calendar, DollarSign, Percent, BrainCircuit, Radar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000
  return x - Math.floor(x)
}
function ri(min: number, max: number, seed: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min
}

const METRIC_TYPES = ["Throughput", "Utilization", "Cost Per Unit", "Order Accuracy", "On-Time Delivery", "Inventory Turnover", "Dock-to-Stock", "Pick Rate"] as const
const METRIC_EMOJI = ["📦", "🏗️", "💰", "🎯", "⏱️", "🔄", "🚚", " Auswahl"] as const
const FORECAST_MODELS = ["ARIMA", "Exponential Smoothing", "Linear Regression", "Prophet", "LSTM Neural Net", "Moving Average", "Holt-Winters", "Ensemble"] as const
const KPI_NAMES = ["Revenue Growth", "Operational Efficiency", "Cost Reduction", "Customer Satisfaction", "Fulfillment Rate", "Return Rate", "SLA Compliance", "Net Promoter Score"] as const
const ALERT_TYPES = ["Anomaly Detected", "Trend Breach", "Target Miss", "Threshold Alert", "Seasonal Spike", "Data Quality Issue", "Forecast Drift", "Capacity Warning"] as const
const ALERT_SEVERITIES = ["Critical", "High", "Medium", "Low", "Info"] as const
const DATA_SOURCES = ["WMS", "TMS", "ERP", "OMS", "CRM", "IoT Sensors", "GPS Telemetry", "Market Data"] as const
const SEGMENTS = ["Electronics", "FMCG", "Pharma", "Textiles", "Auto Parts", "Food & Bev", "Industrial", "E-commerce"] as const
const REGIONS = ["North India", "South India", "West India", "East India", "Central India", "Pan India"] as const
const COLORS = ["#3b82f6", "#059669", "#d97706", "#e11d48", "#7c3aed", "#0891b2", "#6366f1", "#f97316"]

function fmtINR(n: number): string {
  const sign = n < 0 ? "-" : ""
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${sign}${(abs / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `₹${sign}${(abs / 1e5).toFixed(2)} L`
  return `₹${sign}${abs.toLocaleString("en-IN")}`
}

/* ═══════════ 16 Unique Visual Components ═══════════ */

function MetricTypeBadge({ type }: { type: string }) {
  const idx = METRIC_TYPES.indexOf(type as typeof METRIC_TYPES[number])
  const emojis = ["📦", "🏗️", "💰", "🎯", "⏱️", "🔄", "🚚", "📋"]
  return (
    <Badge variant="outline" className="lap-type-badge gap-1 text-[10px] px-2 py-0.5 font-medium">
      {idx >= 0 ? emojis[idx] : "📊"} {type}
    </Badge>
  )
}

function TrendIndicator({ value }: { value: number }) {
  const up = value >= 0
  const color = value > 5 ? "text-emerald-600 dark:text-emerald-400" : value > 0 ? "text-emerald-500 dark:text-emerald-300" : value > -5 ? "text-red-500 dark:text-red-300" : "text-red-600 dark:text-red-400"
  return (
    <span className={`lap-trend inline-flex items-center gap-0.5 text-[11px] font-bold ${color}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}{value.toFixed(1)}%
    </span>
  )
}

function ModelBadge({ model }: { model: string }) {
  const colorMap: Record<string, string> = {
    "LSTM Neural Net": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    Prophet: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Linear Regression": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    ARIMA: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Ensemble: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
    "Exponential Smoothing": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
    "Moving Average": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    "Holt-Winters": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  }
  return (
    <Badge variant="outline" className={`lap-model-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[model] || "bg-gray-100 text-gray-700"}`}>
      <BrainCircuit className="h-3 w-3" /> {model}
    </Badge>
  )
}

function AccuracyBar({ pct }: { pct: number }) {
  const color = pct > 90 ? "bg-emerald-500" : pct > 75 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="lap-accuracy-bar flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{pct.toFixed(1)}%</span>
    </div>
  )
}

function KPIStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    "On Track": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "At Risk": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Off Track": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Improving: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Stable: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  }
  return <Badge variant="outline" className={`lap-kpi-status gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>{status}</Badge>
}

function AlertTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    "Anomaly Detected": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Trend Breach": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    "Target Miss": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Threshold Alert": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    "Seasonal Spike": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Data Quality Issue": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    "Forecast Drift": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
    "Capacity Warning": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  }
  return <Badge variant="outline" className={`lap-alert-type gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}>{type}</Badge>
}

function AlertSeverityBadge({ severity }: { severity: string }) {
  const pulse = severity === "Critical" || severity === "High"
  const glow = severity === "Critical"
  const colorMap: Record<string, string> = { Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400", Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", Low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", Info: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" }
  return <Badge variant="outline" className={`lap-severity-badge gap-1 text-[10px] px-2 py-0.5 font-bold ${pulse ? (glow ? "lap-pulse-critical-glow" : "lap-pulse-warning") : ""} ${colorMap[severity] || "bg-gray-100"}`}><AlertTriangle className="h-3 w-3" /> {severity}</Badge>
}

function SourceBadge({ source }: { source: string }) {
  return <Badge variant="outline" className="lap-source-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">{source}</Badge>
}

function ConfidenceTile({ pct }: { pct: number }) {
  const color = pct > 85 ? "text-emerald-600 dark:text-emerald-400" : pct > 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  return <span className={`lap-confidence inline-flex items-center gap-1 text-[11px] font-bold ${color}`}><Target className="h-3 w-3" /> {pct.toFixed(0)}%</span>
}

function SegmentBadge({ segment }: { segment: string }) {
  const colorMap: Record<string, string> = { Electronics: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", FMCG: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", Pharma: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400", Textiles: "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400", "Auto Parts": "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", "Food & Bev": "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", Industrial: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400", "E-commerce": "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" }
  return <Badge variant="outline" className={`lap-segment-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[segment] || "bg-gray-100 text-gray-700"}`}>{segment}</Badge>
}

function RegionBadge({ region }: { region: string }) {
  return <Badge variant="outline" className="lap-region-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"><Globe className="h-3 w-3" /> {region}</Badge>
}

function ValueTile({ amount }: { amount: number }) {
  return <span className="lap-value-tile inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><IndianRupee className="h-3 w-3" /> {fmtINR(amount)}</span>
}

function PercentTile({ pct }: { pct: number }) {
  const color = pct > 90 ? "text-emerald-600 dark:text-emerald-400" : pct > 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  return <span className={`lap-percent-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-bold ${color} dark:bg-gray-800`}><Percent className="h-3 w-3" /> {pct.toFixed(1)}%</span>
}

function TimeframeBadge({ tf }: { tf: string }) {
  return <Badge variant="outline" className="lap-timeframe-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"><Calendar className="h-3 w-3" /> {tf}</Badge>
}

function MapeTile({ value }: { value: number }) {
  const color = value < 5 ? "text-emerald-600 dark:text-emerald-400" : value < 15 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  return <span className={`lap-mape-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-bold ${color} dark:bg-gray-800`}>MAPE: {value.toFixed(1)}</span>
}

/* ═══════════ Data Generation ═══════════ */

function generateData() {
  const metrics = Array.from({ length: 75 }, (_, i) => {
    const s = i * 7 + 1
    const current = ri(40, 98, s)
    const prev = current + ri(-15, 10, s + 1)
    const trend = ((current - prev) / Math.max(prev, 1)) * 100
    return { id: `MTR-${String(i + 1001).padStart(4, "0")}`, type: METRIC_TYPES[i % 8], current, previous: prev, trend, target: ri(80, 99, s + 2), unit: ["units/hr", "%", "₹", "%", "%", "x", "hrs", "units/hr"][i % 8], warehouse: [`WH-Mumbai`, `WH-Delhi`, `WH-BLR`, `WH-Chennai`][i % 4], period: `W${ri(1, 52, s + 3)}`, region: REGIONS[i % 6] }
  })
  const forecasts = Array.from({ length: 70 }, (_, i) => {
    const s = i * 6 + 200
    return { id: `FC-${String(i + 2001).padStart(4, "0")}`, model: FORECAST_MODELS[i % 8], accuracy: ri(60, 99, s), mape: ri(1, 25, s + 1), metric: METRIC_TYPES[i % 8], horizon: [`7 days`, `14 days`, `30 days`, `90 days`][i % 4], confidence: ri(50, 99, s + 2), lastUpdated: `2026-07-${String(ri(1, 28, s + 3)).padStart(2, "0")}`, dataSource: DATA_SOURCES[i % 8] }
  })
  const alerts = Array.from({ length: 55 }, (_, i) => {
    const s = i * 5 + 400
    return { id: `ALT-${String(i + 3001).padStart(4, "0")}`, type: ALERT_TYPES[i % 8], severity: ALERT_SEVERITIES[i % 5], metric: METRIC_TYPES[i % 8], warehouse: [`WH-Mumbai`, `WH-Delhi`, `WH-BLR`, `WH-Chennai`, `All Warehouses`][i % 5], value: ri(10, 100, s + 1), threshold: ri(50, 95, s + 2), timestamp: `2026-07-${String(ri(1, 29, s + 3)).padStart(2, "0")} ${String(ri(0, 23, s + 4)).padStart(2, "0")}:${String(ri(0, 59, s + 5)).padStart(2, "0")}`, status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Acknowledged" : "Resolved" }
  })
  const segments = Array.from({ length: 65 }, (_, i) => {
    const s = i * 5 + 600
    return { id: `SEG-${String(i + 4001).padStart(4, "0")}`, segment: SEGMENTS[i % 8], region: REGIONS[i % 6], revenue: ri(1000000, 50000000, s), growth: ri(-10, 40, s + 1), margin: ri(5, 35, s + 2), volume: ri(500, 50000, s + 3), avgCost: ri(50, 500, s + 4), efficiency: ri(55, 98, s) }
  })
  return { METRIC_TYPES, FORECAST_MODELS, KPI_NAMES, ALERT_TYPES, ALERT_SEVERITIES, DATA_SOURCES, SEGMENTS, REGIONS, metrics, forecasts, alerts, segments }
}

function filterData<T,>(data: T[], q: string): T[] {
  if (!q) return data
  const lower = q.toLowerCase()
  return data.filter(item => Object.values(item as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(lower)))
}
function sortedData<T,>(data: T[], field: string, dir: "asc" | "desc"): T[] {
  return [...data].sort((a, b) => {
    const av = (a as unknown as Record<string, string | number>)[field]
    const bv = (b as unknown as Record<string, string | number>)[field]
    if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av
    return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  })
}

/* ═══════════ Main Component ═══════════ */

export default function LogisticsAnalyticsProView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<typeof data.metrics[0] | null>(null)
  const { toast } = useToast()

  const handleSort = (f: string) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(f); setSortDir("asc") }
  }

  const kpis = [
    { label: "Avg Efficiency", value: `${Math.round(data.metrics.reduce((s, m) => s + m.current, 0) / data.metrics.length)}%`, icon: Activity, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Forecast Accuracy", value: `${Math.round(data.forecasts.reduce((s, f) => s + f.accuracy, 0) / data.forecasts.length)}%`, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Active Alerts", value: data.alerts.filter(x => x.status === "Active").length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
    { label: "Total Revenue", value: fmtINR(data.segments.reduce((s, x) => s + x.revenue, 0)), icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Models Active", value: data.forecasts.length, icon: BrainCircuit, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { label: "Data Sources", value: DATA_SOURCES.length, icon: Zap, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    { label: "Segments", value: data.segments.length, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Avg Growth", value: `${(data.segments.reduce((s, x) => s + x.growth, 0) / data.segments.length).toFixed(1)}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  ]

  const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Actual: ri(60, 100, i + 10), Predicted: ri(55, 95, i + 50), Upper: ri(70, 100, i + 90), Lower: ri(40, 75, i + 130) }))
  const modelPie = FORECAST_MODELS.map((m, i) => ({ name: m, value: ri(5, 25, i + 200) }))
  const segBar = SEGMENTS.map((s, i) => ({ segment: s, Growth: ri(-5, 35, i + 250) }))
  const filteredMetrics = sortedData(filterData(data.metrics, searchQ), sortField, sortDir)

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button variant="ghost" size="sm" className="lap-sort-header h-8 px-2 text-[10px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleSort(field)}>
      <span className="flex items-center gap-1">{children}<ArrowUpDown className="h-3 w-3" /></span>
    </Button>
  )

  return (
    <div className="lap-root space-y-4 p-4">
      <PageHeader title="Logistics Analytics Pro" description="Advanced analytics, predictive forecasting, anomaly detection, and segment performance insights" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="lap-tabs space-y-4">
        <TabsList className="lap-tabs-list h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
          {["Analytics Dashboard", "Performance Metrics", "Forecast Models", "Alert Console", "Segment Analysis", "Predictive Insights"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="lap-tab-trigger text-xs font-medium px-3">{t}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="0" className="lap-tab-content space-y-4">
          <div className="lap-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className={`lap-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lap-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lap-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Actual vs Predicted</CardTitle></CardHeader><CardContent><LineChart data={monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="Actual" stroke="#3b82f6" strokeWidth={2} /><Line type="monotone" dataKey="Predicted" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 5" /><Line type="monotone" dataKey="Upper" stroke="#059669" strokeWidth={1} strokeDasharray="2 4" /><Line type="monotone" dataKey="Lower" stroke="#e11d48" strokeWidth={1} strokeDasharray="2 4" /></LineChart></CardContent></Card>
            <Card className="lap-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Model Usage Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={modelPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{modelPie.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="lap-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Segment Growth</CardTitle></CardHeader><CardContent><BarChart data={segBar}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="segment" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 10 }} unit="%" /><Tooltip /><Bar dataKey="Growth" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="1" className="lap-tab-content space-y-4">
          <div className="flex gap-2 items-center"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search metrics..." className="pl-9 h-9 text-sm" /></div><Badge variant="outline" className="text-xs">{filteredMetrics.length} metrics</Badge></div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="lap-metric-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Type</th><th className="p-2 text-left"><SortHeader field="current">Current</SortHeader></th><th className="p-2 text-left">Trend</th><th className="p-2 text-left"><SortHeader field="target">Target</SortHeader></th><th className="p-2 text-left">Status</th><th className="p-2 text-left">WH</th><th className="p-2 text-left">Region</th><th className="p-2 text-center">Action</th></tr></thead>
              <tbody>{filteredMetrics.map((m) => (
                <tr key={m.id} className="lap-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-2 font-mono font-semibold">{m.id}</td>
                  <td className="p-2"><MetricTypeBadge type={m.type} /></td>
                  <td className="p-2 text-[11px] font-bold">{m.current} {m.unit}</td>
                  <td className="p-2"><TrendIndicator value={m.trend} /></td>
                  <td className="p-2 text-[10px] font-medium text-gray-600 dark:text-gray-400">{m.target} {m.unit}</td>
                  <td className="p-2"><KPIStatusBadge status={m.current >= m.target ? "On Track" : m.current >= m.target * 0.8 ? "At Risk" : "Off Track"} /></td>
                  <td className="p-2 text-[10px]">{m.warehouse}</td>
                  <td className="p-2"><RegionBadge region={m.region} /></td>
                  <td className="p-2 text-center"><Button variant="ghost" size="sm" className="lap-view-btn h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30" onClick={() => { setSelectedMetric(m); setSheetOpen(true); toast.success("Viewing Metric", `${m.id} details`) }}><Eye className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="2" className="lap-tab-content space-y-4">
          <div className="lap-forecast-grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.forecasts.map((fc) => (
              <Card key={fc.id} className="lap-forecast-card group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden border-l-4 border-l-violet-500">
                <div className="lap-forecast-header p-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
                  <div className="flex items-center justify-between"><ModelBadge model={fc.model} /><TimeframeBadge tf={fc.horizon} /></div>
                  <p className="text-lg font-bold mt-1">{fc.id}</p>
                </div>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Accuracy</span><AccuracyBar pct={fc.accuracy} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">MAPE</span><MapeTile value={fc.mape} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Metric</span><MetricTypeBadge type={fc.metric} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Source</span><SourceBadge source={fc.dataSource} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Confidence</span><ConfidenceTile pct={fc.confidence} /></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="3" className="lap-tab-content space-y-4">
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="lap-alert-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Severity</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Metric</th><th className="p-2 text-left">Warehouse</th><th className="p-2 text-left">Value vs Threshold</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Status</th></tr></thead>
              <tbody>{data.alerts.map((a) => (
                <tr key={a.id} className="lap-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-2 font-mono font-semibold">{a.id}</td>
                  <td className="p-2"><AlertSeverityBadge severity={a.severity} /></td>
                  <td className="p-2"><AlertTypeBadge type={a.type} /></td>
                  <td className="p-2"><MetricTypeBadge type={a.metric} /></td>
                  <td className="p-2 text-[10px]">{a.warehouse}</td>
                  <td className="p-2"><span className="text-[10px] font-semibold">{a.value} / {a.threshold}</span></td>
                  <td className="p-2 text-[10px]">{a.timestamp}</td>
                  <td className="p-2"><Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${a.status === "Active" ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400" : a.status === "Acknowledged" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>{a.status}</Badge></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="4" className="lap-tab-content space-y-4">
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="lap-segment-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Segment</th><th className="p-2 text-left">Region</th><th className="p-2 text-left"><SortHeader field="revenue">Revenue</SortHeader></th><th className="p-2 text-left"><SortHeader field="growth">Growth</SortHeader></th><th className="p-2 text-left">Margin</th><th className="p-2 text-left">Volume</th><th className="p-2 text-left">Avg Cost</th><th className="p-2 text-left">Efficiency</th></tr></thead>
              <tbody>{data.segments.map((seg) => (
                <tr key={seg.id} className="lap-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-2 font-mono font-semibold">{seg.id}</td>
                  <td className="p-2"><SegmentBadge segment={seg.segment} /></td>
                  <td className="p-2"><RegionBadge region={seg.region} /></td>
                  <td className="p-2"><ValueTile amount={seg.revenue} /></td>
                  <td className="p-2"><TrendIndicator value={seg.growth} /></td>
                  <td className="p-2"><PercentTile pct={seg.margin} /></td>
                  <td className="p-2 text-[10px] font-bold">{seg.volume.toLocaleString()}</td>
                  <td className="p-2"><ValueTile amount={seg.avgCost} /></td>
                  <td className="p-2"><AccuracyBar pct={seg.efficiency} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="5" className="lap-tab-content space-y-4">
          <div className="lap-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="lap-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Efficiency Forecast (6 months)</CardTitle></CardHeader><CardContent><AreaChart data={Array.from({ length: 6 }, (_, i) => ({ month: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"][i], Optimistic: ri(80, 98, i + 300), Base: ri(70, 90, i + 350), Pessimistic: ri(55, 80, i + 400) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} domain={[50, 100]} /><Tooltip /><Area type="monotone" dataKey="Optimistic" stackId="a" fill="#059669" /><Area type="monotone" dataKey="Base" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Pessimistic" stackId="a" fill="#e11d48" /></AreaChart></CardContent></Card>
            <Card className="lap-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Revenue vs Cost Trend</CardTitle></CardHeader><CardContent><LineChart data={Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Revenue: ri(500, 2000, i + 500), Cost: ri(300, 1200, i + 550) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} unit="L" /><Tooltip /><Line type="monotone" dataKey="Revenue" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="Cost" stroke="#e11d48" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="lap-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Regional Performance</CardTitle></CardHeader><CardContent><BarChart data={REGIONS.map((r, i) => ({ region: r, Efficiency: ri(60, 95, i + 600), Growth: ri(5, 30, i + 650) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="region" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="Efficiency" fill="#3b82f6" radius={[4, 4, 0, 0]} /><Bar dataKey="Growth" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="lap-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Alert Severity Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={ALERT_SEVERITIES.map((s, i) => ({ name: s, value: ri(2, 20, i + 700) }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{ALERT_SEVERITIES.map((_, i) => <Cell key={i} fill={["#e11d48", "#f97316", "#d97706", "#3b82f6", "#6b7280"][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!(sheetOpen && selectedMetric)} onOpenChange={o => { setSheetOpen(o); if (!o) setSelectedMetric(null) }}>
        <SheetContent className="lap-sheet w-full sm:w-[540px]">
          {selectedMetric && (<>
            <div className="lap-sheet-header bg-gradient-to-r from-blue-600 via-violet-500 to-indigo-500 p-6 mx-6 mt-6 rounded-xl text-white">
              <SheetHeader><SheetTitle className="text-white">Metric Detail</SheetTitle></SheetHeader>
              <p className="text-sm opacity-80 mt-1">{selectedMetric.id} | {selectedMetric.type}</p>
            </div>
            <ScrollArea className="mt-4 px-6"><div className="space-y-3 pb-6">
              <div className="lap-detail-grid grid grid-cols-2 gap-3">
                {[{ label: "Current", child: <span className="text-lg font-bold">{selectedMetric.current} {selectedMetric.unit}</span> }, { label: "Previous", child: <span className="text-[11px] font-semibold">{selectedMetric.previous} {selectedMetric.unit}</span> }, { label: "Trend", child: <TrendIndicator value={selectedMetric.trend} /> }, { label: "Target", child: <span className="text-[11px] font-semibold">{selectedMetric.target} {selectedMetric.unit}</span> }, { label: "Status", child: <KPIStatusBadge status={selectedMetric.current >= selectedMetric.target ? "On Track" : "At Risk"} /> }, { label: "Period", child: <span className="text-[11px] font-semibold">{selectedMetric.period}</span> }, { label: "Warehouse", child: <span className="text-[11px] font-semibold">{selectedMetric.warehouse}</span> }, { label: "Region", child: <RegionBadge region={selectedMetric.region} /> }].map((item, i) => (
                  <div key={i} className="lap-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">{item.label}</p>{item.child}</div>
                ))}
              </div>
            </div></ScrollArea>
          </>)}
        </SheetContent>
      </Sheet>
    </div>
  )
}
