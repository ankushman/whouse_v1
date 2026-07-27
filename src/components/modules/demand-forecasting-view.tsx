"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Clock,
  Activity,
  Hash,
  Percent,
  IndianRupee,
  Plus,
  Calculator,
  Layers,
  Calendar,
  Factory,
  Wrench,
  Boxes,
  ShoppingCart,
  ChevronRight,
  CircleCheck,
  CircleDot,
  CircleSlash,
  Target,
  Gauge,
  ArrowRightCircle,
  Zap,
  Timer,
  ListChecks,
  FileBarChart,
  Crosshair,
  ArrowDown,
  ArrowUp,
  Minus,
  Sparkles,
  Bell,
  Scale,
  Wallet,
  PiggyBank,
  Receipt,
  BookOpen,
  Lightbulb,
  FileWarning,
  ClipboardList,
  Star,
  BarChart3,
  Settings as SettingsIcon,
  Landmark,
  History,
  ArrowLeftRight,
  PackageCheck,
  PackageX,
  Archive,
  Hourglass,
  Truck,
  Handshake,
  Layers3,
  BookMarked,
  Brain,
  LineChart as LineChartIcon,
  ScatterChart as ScatterChartIcon,
  Waves,
  Sigma,
  Database,
  Cpu,
  GitBranch,
  TrendingDown as TrendingDownIcon,
  AlertCircle,
  ChevronsRight,
  Wifi,
  Pause,
  Play,
  RefreshCcwDot,
  Workflow,
  ShieldCheck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

type ForecastMethod = "moving-average" | "exponential-smoothing" | "linear-regression" | "seasonal-decomposition" | "arima" | "ml-ensemble"
type ForecastStatus = "approved" | "auto-generated" | "under-review" | "rejected" | "draft" | "archived"
type Seasonality = "none" | "weak" | "moderate" | "strong"
type Trend = "up" | "down" | "flat" | "volatile"
type ConfidenceLevel = "high" | "medium" | "low"

interface HistoricalPoint {
  period: string
  actual?: number
  forecast?: number
  isFuture?: boolean
}

interface MethodResult {
  method: ForecastMethod
  label: string
  forecast: number
  mape: number
  rmse: number
  bias: number
  weight: number
  color: string
  isPrimary: boolean
}

interface FeatureImportance {
  feature: string
  importance: number
  description: string
}

interface AccuracyMetric {
  metric: string
  value: number
  unit: string
  description: string
  benchmark: number
  status: "good" | "warning" | "bad"
}

interface DriverFactor {
  driver: string
  impact: number
  direction: "positive" | "negative" | "neutral"
  description: string
}

interface ScenarioResult {
  scenario: "pessimistic" | "base" | "optimistic"
  forecast: number
  probability: number
  assumptions: string[]
}

interface ModelRun {
  runId: string
  runDate: string
  triggeredBy: string
  durationMs: number
  dataPoints: number
  status: "completed" | "failed" | "running"
  notes: string
}

interface DemandForecastItem {
  id: string
  partNo: string
  description: string
  category: string
  warehouse: string
  abcClass: "A" | "B" | "C"
  status: ForecastStatus
  primaryMethod: ForecastMethod
  historyPoints: number
  forecastHorizon: number
  lastActual: number
  forecastNext: number
  forecast3Month: number
  forecast12Month: number
  forecastChangePct: number
  confidence: ConfidenceLevel
  mape: number
  rmse: number
  bias: number
  seasonality: Seasonality
  trend: Trend
  safetyStockRec: number
  reorderPointRec: number
  lastRunDate: string
  nextRunDate: string
  dataSource: string
  planner: string
  linkedMrpRef: string
}

interface DrawerProps {
  item: DemandForecastItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ──────────────────────────────────────────────────────────
// FORMATTERS
// ──────────────────────────────────────────────────────────

const fmtNum = (n: number): string => n.toLocaleString("en-IN")
const fmtPct = (n: number): string => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`
const fmtINR = (n: number): string => {
  if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n.toFixed(0)}`
}

// ──────────────────────────────────────────────────────────
// STATUS / METHOD / SEASONALITY / TREND CONFIG
// ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ForecastStatus, {
  label: string
  color: string
  bg: string
  border: string
  pieColor: string
  icon: typeof CheckCircle2
}> = {
  approved: { label: "Approved", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-900", pieColor: "#10b981", icon: CheckCircle2 },
  "auto-generated": { label: "Auto-Generated", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-900", pieColor: "#3b82f6", icon: Sparkles },
  "under-review": { label: "Under Review", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-900", pieColor: "#f59e0b", icon: Eye },
  rejected: { label: "Rejected", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-200 dark:border-rose-900", pieColor: "#f43f5e", icon: XCircle },
  draft: { label: "Draft", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-50 dark:bg-cyan-950/40", border: "border-cyan-200 dark:border-cyan-900", pieColor: "#06b6d4", icon: FileBarChart },
  archived: { label: "Archived", color: "text-zinc-500 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-900", border: "border-zinc-200 dark:border-zinc-800", pieColor: "#71717a", icon: Archive },
}

const METHOD_CONFIG: Record<ForecastMethod, {
  label: string
  short: string
  color: string
  bg: string
  pieColor: string
  icon: typeof Brain
  description: string
}> = {
  "moving-average": { label: "Moving Average (3-month)", short: "MA-3", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950/50", pieColor: "#3b82f6", icon: LineChartIcon, description: "Simple unweighted mean of last N periods — best for stable demand with no trend or seasonality" },
  "exponential-smoothing": { label: "Exponential Smoothing (Holt-Winters)", short: "ETS", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50", pieColor: "#10b981", icon: Waves, description: "Weighted average with exponential decay — handles trend + seasonality via Holt-Winters triple smoothing" },
  "linear-regression": { label: "Linear Regression (OLS)", short: "OLS", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950/50", pieColor: "#f59e0b", icon: TrendingUp, description: "Ordinary Least Squares fit on time index — captures linear trend, ignores seasonality" },
  "seasonal-decomposition": { label: "Seasonal Decomposition (STL)", short: "STL", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-100 dark:bg-purple-950/50", pieColor: "#a855f7", icon: Sigma, description: "Decomposes into trend + seasonal + residual components — best for seasonal patterns with stable trend" },
  arima: { label: "ARIMA (Auto-Regressive Integrated Moving Average)", short: "ARIMA", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-100 dark:bg-rose-950/50", pieColor: "#f43f5e", icon: Sigma, description: "(p,d,q) auto-tuned Box-Jenkins method — handles non-stationary series via differencing" },
  "ml-ensemble": { label: "ML Ensemble (XGBoost + LSTM + Prophet)", short: "ML-Ens", color: "text-indigo-700 dark:text-indigo-300", bg: "bg-indigo-100 dark:bg-indigo-950/50", pieColor: "#6366f1", icon: Brain, description: "Stacked ensemble of XGBoost + LSTM neural network + Facebook Prophet — captures non-linear patterns and external regressors" },
}

const SEASONALITY_CONFIG: Record<Seasonality, { label: string; color: string; bg: string }> = {
  none: { label: "None", color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-900" },
  weak: { label: "Weak", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/40" },
  moderate: { label: "Moderate", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/40" },
  strong: { label: "Strong", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-950/40" },
}

const TREND_CONFIG: Record<Trend, { label: string; color: string; icon: typeof TrendingUp }> = {
  up: { label: "Upward", color: "text-emerald-700 dark:text-emerald-300", icon: TrendingUp },
  down: { label: "Downward", color: "text-rose-700 dark:text-rose-300", icon: TrendingDown },
  flat: { label: "Flat", color: "text-blue-700 dark:text-blue-300", icon: Minus },
  volatile: { label: "Volatile", color: "text-amber-700 dark:text-amber-300", icon: Activity },
}

const CONFIDENCE_CONFIG: Record<ConfidenceLevel, { label: string; color: string; bg: string; percent: number }> = {
  high: { label: "High Confidence", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50", percent: 92 },
  medium: { label: "Medium Confidence", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950/50", percent: 68 },
  low: { label: "Low Confidence", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-100 dark:bg-rose-950/50", percent: 38 },
}

const ABC_CONFIG: Record<"A" | "B" | "C", { label: string; color: string; bg: string }> = {
  A: { label: "A Class", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50" },
  B: { label: "B Class", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950/50" },
  C: { label: "C Class", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950/50" },
}

// ──────────────────────────────────────────────────────────
// HASH-SEEDED DETERMINISTIC MOCK DATA GENERATORS
// ──────────────────────────────────────────────────────────

const seedStr = (s: string): number => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const rng = (seed: number) => {
  let s = seed
  return () => {
    s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d)
    s = Math.imul(s ^ (s >>> 12), 0x297a2d39)
    return ((s ^= s >>> 15) >>> 0) / 4294967296
  }
}

const pick = <T,>(arr: T[], r: () => number): T => arr[Math.floor(r() * arr.length)]

const today = new Date("2026-07-26")
const dayMs = 24 * 60 * 60 * 1000
const fmtDate = (d: Date) => d.toISOString().split("T")[0]
const daysAgo = (n: number) => fmtDate(new Date(today.getTime() - n * dayMs))
const daysAhead = (n: number) => fmtDate(new Date(today.getTime() + n * dayMs))

// ──────────────────────────────────────────────────────────
// HISTORICAL DEMAND (24 months) + FORECAST (12 months)
// ──────────────────────────────────────────────────────────

const generateHistory = (item: DemandForecastItem): HistoricalPoint[] => {
  const seed = seedStr(item.id + "-history")
  const r = rng(seed)
  const points: HistoricalPoint[] = []
  const months = [
    "Aug-24", "Sep-24", "Oct-24", "Nov-24", "Dec-24",
    "Jan-25", "Feb-25", "Mar-25", "Apr-25", "May-25", "Jun-25", "Jul-25",
    "Aug-25", "Sep-25", "Oct-25", "Nov-25", "Dec-25",
    "Jan-26", "Feb-26", "Mar-26", "Apr-26", "May-26", "Jun-26", "Jul-26",
    "Aug-26", "Sep-26", "Oct-26", "Nov-26", "Dec-26",
    "Jan-27", "Feb-27", "Mar-27", "Apr-27", "May-27", "Jun-27", "Jul-27",
  ]
  const isStrongSeasonal = item.seasonality === "strong" || item.seasonality === "moderate"
  const trendSlope = item.trend === "up" ? 0.012 : item.trend === "down" ? -0.012 : item.trend === "volatile" ? 0 : 0.003
  const base = item.lastActual
  let currentValue = base * 0.75
  months.forEach((month, idx) => {
    const isFuture = idx >= 24
    const trendComponent = currentValue * trendSlope
    const seasonalComponent = isStrongSeasonal ? Math.sin((idx / 12) * Math.PI * 2) * (base * 0.18) : 0
    const noise = (r() - 0.5) * (item.trend === "volatile" ? base * 0.25 : base * 0.08)
    const actual: number | undefined = isFuture ? undefined : Math.max(0, Math.round(currentValue + trendComponent + seasonalComponent + noise))
    const forecast: number | undefined = isFuture ? Math.round(currentValue + trendComponent + seasonalComponent) : undefined
    points.push({ period: month, actual, forecast, isFuture })
    currentValue = (actual ?? forecast ?? currentValue) * 1.0
  })
  return points
}

// ──────────────────────────────────────────────────────────
// METHOD COMPARISON (6 methods ranked by MAPE)
// ──────────────────────────────────────────────────────────

const generateMethodResults = (item: DemandForecastItem): MethodResult[] => {
  const seed = seedStr(item.id + "-methods")
  const r = rng(seed)
  const methods: ForecastMethod[] = ["moving-average", "exponential-smoothing", "linear-regression", "seasonal-decomposition", "arima", "ml-ensemble"]
  return methods.map((method) => {
    const cfg = METHOD_CONFIG[method]
    const isPrimary = method === item.primaryMethod
    const baseMape = method === "ml-ensemble" ? 4.5 : method === "arima" ? 6.2 : method === "seasonal-decomposition" ? 7.8 : method === "exponential-smoothing" ? 9.1 : method === "linear-regression" ? 11.3 : 12.5
    const mape = baseMape + (r() - 0.5) * 3
    const rmse = mape * item.lastActual / 100 * (0.8 + r() * 0.4)
    const bias = (r() - 0.5) * 6
    const forecast = Math.round(item.forecastNext * (1 + (r() - 0.5) * 0.08))
    const weight = isPrimary ? 0.45 + r() * 0.15 : 0.05 + r() * 0.2
    return {
      method,
      label: cfg.label,
      forecast,
      mape: Number(mape.toFixed(2)),
      rmse: Math.round(rmse),
      bias: Number(bias.toFixed(2)),
      weight: Number(weight.toFixed(2)),
      color: cfg.pieColor,
      isPrimary,
    }
  }).sort((a, b) => a.mape - b.mape)
}

// ──────────────────────────────────────────────────────────
// FEATURE IMPORTANCE (ML model drivers)
// ──────────────────────────────────────────────────────────

const generateFeatures = (item: DemandForecastItem): FeatureImportance[] => {
  const seed = seedStr(item.id + "-features")
  const r = rng(seed)
  const features = [
    { feature: "Historical Lag-1 Demand", description: "Previous month actual demand" },
    { feature: "Historical Lag-12 Demand", description: "Same month previous year (seasonal memory)" },
    { feature: "Production Schedule Forward", description: "Upstream WO schedule for next 30 days" },
    { feature: "Marketing Promo Calendar", description: "Planned promotions / discount events" },
    { feature: "Festival/Holiday Indicator", description: "Diwali, Navratri, year-end effects" },
    { feature: "Supplier Lead Time Trend", description: "Lead-time variation signal from Procurement" },
    { feature: "Customer Order Pipeline", description: "Open SO pipeline weighted by probability" },
    { feature: "Economic Index (IIP-Auto)", description: "Index of Industrial Production — Automotive" },
    { feature: "Weather/Rainfall Anomaly", description: "Monsoon impact on logistics demand" },
    { feature: "Competitor Stockout Signal", description: "Web-scraped competitor availability" },
  ]
  return features.map((f) => ({
    ...f,
    importance: Number((0.05 + r() * 0.25).toFixed(3)),
  })).sort((a, b) => b.importance - a.importance).slice(0, 8)
}

// ──────────────────────────────────────────────────────────
// ACCURACY METRICS (MAPE / RMSE / MASE / Bias / WAPE / R²)
// ──────────────────────────────────────────────────────────

const generateAccuracy = (item: DemandForecastItem): AccuracyMetric[] => {
  return [
    { metric: "MAPE", value: item.mape, unit: "%", description: "Mean Absolute Percentage Error — average % deviation", benchmark: 10, status: item.mape < 10 ? "good" : item.mape < 15 ? "warning" : "bad" },
    { metric: "RMSE", value: item.rmse, unit: "units", description: "Root Mean Square Error — penalizes large errors", benchmark: item.lastActual * 0.12, status: item.rmse < item.lastActual * 0.12 ? "good" : item.rmse < item.lastActual * 0.18 ? "warning" : "bad" },
    { metric: "MASE", value: Number((0.6 + (item.mape / 20)).toFixed(2)), unit: "ratio", description: "Mean Absolute Scaled Error — vs naïve forecast (<1 = better than naïve)", benchmark: 1, status: "good" },
    { metric: "Bias", value: item.bias, unit: "%", description: "Forecast Bias — systematic over(+)/under(-) estimation", benchmark: 5, status: Math.abs(item.bias) < 5 ? "good" : Math.abs(item.bias) < 10 ? "warning" : "bad" },
    { metric: "WAPE", value: Number((item.mape * 0.85).toFixed(2)), unit: "%", description: "Weighted Absolute Percentage Error — volume-weighted", benchmark: 8, status: "good" },
    { metric: "R²", value: Number((0.85 + (10 - item.mape) * 0.01).toFixed(3)), unit: "", description: "Coefficient of Determination — variance explained (0-1)", benchmark: 0.8, status: "good" },
    { metric: "Tracking Signal", value: Number(Number((item.bias / 3 + (item.bias > 0 ? 0.5 : -0.5))).toFixed(2)), unit: "", description: "Cumulative bias / MAD — should be within ±4", benchmark: 4, status: "good" },
  ]
}

// ──────────────────────────────────────────────────────────
// DRIVER FACTORS (qualitative drivers of demand)
// ──────────────────────────────────────────────────────────

const generateDrivers = (item: DemandForecastItem): DriverFactor[] => {
  const seed = seedStr(item.id + "-drivers")
  const r = rng(seed)
  const drivers = [
    { driver: "New Model Launch", direction: "positive" as const, description: "OEM announced new EV platform Q3-2026" },
    { driver: "Festival Demand Surge", direction: "positive" as const, description: "Diwali + Navratri seasonal uplift expected" },
    { driver: "Competitor Recall", direction: "positive" as const, description: "Major competitor issued product recall — share gain expected" },
    { driver: "Supply Constraint", direction: "negative" as const, description: "Semiconductor shortage may limit OEM production" },
    { driver: "Raw Material Price Hike", direction: "negative" as const, description: "Steel +8% Q-o-Q may suppress aftermarket demand" },
    { driver: "Government EV Subsidy", direction: "positive" as const, description: "FAME-II extension boosts EV component demand" },
    { driver: "Currency Depreciation", direction: "negative" as const, description: "INR -3% vs USD increases imported material cost" },
    { driver: "Aftermarket Growth", direction: "positive" as const, description: "Vehicle parc growth driving replacement demand" },
  ]
  return drivers.slice(0, 5 + Math.floor(r() * 3)).map((d) => ({
    ...d,
    impact: Number(((r() - 0.3) * 35).toFixed(1)),
  })).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
}

// ──────────────────────────────────────────────────────────
// SCENARIO ANALYSIS (Pessimistic / Base / Optimistic)
// ──────────────────────────────────────────────────────────

const generateScenarios = (item: DemandForecastItem): ScenarioResult[] => {
  const base = item.forecast12Month
  return [
    {
      scenario: "pessimistic",
      forecast: Math.round(base * 0.82),
      probability: 18,
      assumptions: [
        "Semiconductor shortage persists into H2-2027",
        "Festival demand +5% only (vs historical +15%)",
        "Competitor price war erodes 8% market share",
        "Aftermarket growth slows to 2% (vs 6% baseline)",
      ],
    },
    {
      scenario: "base",
      forecast: base,
      probability: 64,
      assumptions: [
        "Stable macroeconomic conditions (IIP-Auto +6%)",
        "Normal festival demand (+15% Q4)",
        "Stable competitor landscape",
        "Aftermarket growth at trend (6%)",
      ],
    },
    {
      scenario: "optimistic",
      forecast: Math.round(base * 1.18),
      probability: 18,
      assumptions: [
        "New OEM contract signed (Tier-1 supplier win)",
        "Festival demand +25% (post-COVID revenge spending)",
        "Competitor exits market segment",
        "EV subsidy extension triggers demand spike",
      ],
    },
  ]
}

// ──────────────────────────────────────────────────────────
// MODEL RUN HISTORY (last 6 training runs)
// ──────────────────────────────────────────────────────────

const generateModelRuns = (item: DemandForecastItem): ModelRun[] => {
  const seed = seedStr(item.id + "-runs")
  const r = rng(seed)
  const triggers = ["Scheduled retrain (weekly)", "MAPE threshold breach", "Manual retrain by planner", "New data ingestion", "Hyperparameter tuning", "Feature drift detected"]
  const statuses: ModelRun["status"][] = ["completed", "completed", "completed", "completed", "completed", r() > 0.7 ? "failed" : "completed"]
  return Array.from({ length: 6 }, (_, i) => {
    const ageDays = i * 7 + Math.floor(r() * 3)
    return {
      runId: `RUN-${item.partNo.substring(0, 6)}-${String(i + 1).padStart(3, "0")}`,
      runDate: daysAgo(ageDays),
      triggeredBy: pick(triggers, r),
      durationMs: 8000 + Math.floor(r() * 45000),
      dataPoints: 24 + Math.floor(r() * 8),
      status: statuses[i],
      notes: statuses[i] === "failed" ? "Failed — OOM during XGBoost fit, retried with smaller subsample" : `MAPE improved from ${(item.mape + 1 + r() * 2).toFixed(2)}% to ${item.mape}%`,
    }
  })
}

// ──────────────────────────────────────────────────────────
// 16 MOCK DEMAND FORECAST ITEMS
// ──────────────────────────────────────────────────────────

const DF_ITEMS: DemandForecastItem[] = [
  {
    id: "DF-2026-8001",
    partNo: "BRK-PAD-001",
    description: "Brake Pad Assembly — Passenger Car",
    category: "Brake System",
    warehouse: "Chennai Hub",
    abcClass: "A",
    status: "approved",
    primaryMethod: "ml-ensemble",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 4820,
    forecastNext: 5180,
    forecast3Month: 15650,
    forecast12Month: 64200,
    forecastChangePct: 7.47,
    confidence: "high",
    mape: 6.8,
    rmse: 385,
    bias: 1.4,
    seasonality: "moderate",
    trend: "up",
    safetyStockRec: 1240,
    reorderPointRec: 3180,
    lastRunDate: daysAgo(2),
    nextRunDate: daysAhead(5),
    dataSource: "ERP Sales History + Market Signals",
    planner: "Rajesh Kumar",
    linkedMrpRef: "MRP-2026-5001",
  },
  {
    id: "DF-2026-8002",
    partNo: "WHL-RIM-002",
    description: "Wheel Rim 17-inch Alloy",
    category: "Wheel & Tire",
    warehouse: "Chennai Hub",
    abcClass: "A",
    status: "approved",
    primaryMethod: "seasonal-decomposition",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 1280,
    forecastNext: 1410,
    forecast3Month: 4280,
    forecast12Month: 16850,
    forecastChangePct: 10.16,
    confidence: "high",
    mape: 7.2,
    rmse: 95,
    bias: -2.1,
    seasonality: "strong",
    trend: "up",
    safetyStockRec: 340,
    reorderPointRec: 880,
    lastRunDate: daysAgo(3),
    nextRunDate: daysAhead(4),
    dataSource: "ERP Sales History",
    planner: "Rajesh Kumar",
    linkedMrpRef: "MRP-2026-5002",
  },
  {
    id: "DF-2026-8003",
    partNo: "ENG-BLK-003",
    description: "Engine Block Cast Iron 1.5L",
    category: "Engine Block",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "approved",
    primaryMethod: "arima",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 88,
    forecastNext: 84,
    forecast3Month: 252,
    forecast12Month: 1020,
    forecastChangePct: -4.55,
    confidence: "medium",
    mape: 11.5,
    rmse: 12,
    bias: 3.2,
    seasonality: "weak",
    trend: "down",
    safetyStockRec: 22,
    reorderPointRec: 65,
    lastRunDate: daysAgo(1),
    nextRunDate: daysAhead(6),
    dataSource: "ERP Sales History + OEM Production Plan",
    planner: "Sunita Reddy",
    linkedMrpRef: "MRP-2026-5003",
  },
  {
    id: "DF-2026-8004",
    partNo: "CAL-SEAL-004",
    description: "Caliper Hydraulic Seal Kit",
    category: "Hydraulic Seal",
    warehouse: "Chennai Hub",
    abcClass: "B",
    status: "under-review",
    primaryMethod: "exponential-smoothing",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 3200,
    forecastNext: 2880,
    forecast3Month: 8650,
    forecast12Month: 34800,
    forecastChangePct: -10.00,
    confidence: "medium",
    mape: 14.2,
    rmse: 480,
    bias: -4.8,
    seasonality: "weak",
    trend: "down",
    safetyStockRec: 920,
    reorderPointRec: 2350,
    lastRunDate: daysAgo(4),
    nextRunDate: daysAhead(3),
    dataSource: "ERP Sales History",
    planner: "Rajesh Kumar",
    linkedMrpRef: "MRP-2026-5004",
  },
  {
    id: "DF-2026-8005",
    partNo: "SHK-ABS-005",
    description: "Shock Absorber Gas-Filled Rear",
    category: "Suspension",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "approved",
    primaryMethod: "ml-ensemble",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 980,
    forecastNext: 1090,
    forecast3Month: 3280,
    forecast12Month: 13100,
    forecastChangePct: 11.22,
    confidence: "high",
    mape: 5.9,
    rmse: 68,
    bias: 0.8,
    seasonality: "moderate",
    trend: "up",
    safetyStockRec: 270,
    reorderPointRec: 720,
    lastRunDate: daysAgo(2),
    nextRunDate: daysAhead(5),
    dataSource: "ERP Sales History + Vehicle Parc Data",
    planner: "Sunita Reddy",
    linkedMrpRef: "MRP-2026-5005",
  },
  {
    id: "DF-2026-8006",
    partNo: "BAT-LION-006",
    description: "Li-Ion Battery Pack 72V/50Ah",
    category: "EV Battery",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "auto-generated",
    primaryMethod: "ml-ensemble",
    historyPoints: 18,
    forecastHorizon: 12,
    lastActual: 240,
    forecastNext: 312,
    forecast3Month: 945,
    forecast12Month: 4180,
    forecastChangePct: 30.00,
    confidence: "medium",
    mape: 12.8,
    rmse: 32,
    bias: 5.4,
    seasonality: "moderate",
    trend: "up",
    safetyStockRec: 78,
    reorderPointRec: 220,
    lastRunDate: daysAgo(0),
    nextRunDate: daysAhead(7),
    dataSource: "ERP Sales History + EV Adoption Curve",
    planner: "Sunita Reddy",
    linkedMrpRef: "MRP-2026-5006",
  },
  {
    id: "DF-2026-8007",
    partNo: "TRE-BEAD-007",
    description: "Tire Bead Wire 0.96mm",
    category: "Tire Assembly",
    warehouse: "Chennai Hub",
    abcClass: "B",
    status: "approved",
    primaryMethod: "moving-average",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 5400,
    forecastNext: 5320,
    forecast3Month: 16050,
    forecast12Month: 64200,
    forecastChangePct: -1.48,
    confidence: "high",
    mape: 8.4,
    rmse: 460,
    bias: 0.3,
    seasonality: "none",
    trend: "flat",
    safetyStockRec: 1350,
    reorderPointRec: 3450,
    lastRunDate: daysAgo(5),
    nextRunDate: daysAhead(2),
    dataSource: "ERP Sales History",
    planner: "Rajesh Kumar",
    linkedMrpRef: "MRP-2026-5007",
  },
  {
    id: "DF-2026-8008",
    partNo: "WRH-HRN-008",
    description: "Wiring Harness Assembly",
    category: "Electrical Harness",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "approved",
    primaryMethod: "seasonal-decomposition",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 720,
    forecastNext: 815,
    forecast3Month: 2460,
    forecast12Month: 9840,
    forecastChangePct: 13.19,
    confidence: "high",
    mape: 6.5,
    rmse: 52,
    bias: 1.2,
    seasonality: "strong",
    trend: "up",
    safetyStockRec: 205,
    reorderPointRec: 540,
    lastRunDate: daysAgo(3),
    nextRunDate: daysAhead(4),
    dataSource: "ERP Sales History + OEM Production Plan",
    planner: "Sunita Reddy",
    linkedMrpRef: "MRP-2026-5008",
  },
  {
    id: "DF-2026-8009",
    partNo: "ENG-BLT-009",
    description: "Engine Bolt M10x40 Grade 10.9",
    category: "Fastener",
    warehouse: "Chennai Hub",
    abcClass: "C",
    status: "auto-generated",
    primaryMethod: "moving-average",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 18500,
    forecastNext: 18200,
    forecast3Month: 54750,
    forecast12Month: 219000,
    forecastChangePct: -1.62,
    confidence: "high",
    mape: 9.2,
    rmse: 1700,
    bias: -0.8,
    seasonality: "none",
    trend: "flat",
    safetyStockRec: 4600,
    reorderPointRec: 11800,
    lastRunDate: daysAgo(1),
    nextRunDate: daysAhead(6),
    dataSource: "ERP Sales History",
    planner: "Rajesh Kumar",
    linkedMrpRef: "MRP-2026-5009",
  },
  {
    id: "DF-2026-8010",
    partNo: "ENG-OIL-010",
    description: "Engine Oil 5W-30 Synthetic 1L",
    category: "Lubricant",
    warehouse: "Chennai Hub",
    abcClass: "B",
    status: "approved",
    primaryMethod: "exponential-smoothing",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 2400,
    forecastNext: 2880,
    forecast3Month: 8640,
    forecast12Month: 34560,
    forecastChangePct: 20.00,
    confidence: "high",
    mape: 7.8,
    rmse: 195,
    bias: 2.5,
    seasonality: "strong",
    trend: "up",
    safetyStockRec: 720,
    reorderPointRec: 1850,
    lastRunDate: daysAgo(2),
    nextRunDate: daysAhead(5),
    dataSource: "ERP Sales History + Festival Calendar",
    planner: "Rajesh Kumar",
    linkedMrpRef: "MRP-2026-5010",
  },
  {
    id: "DF-2026-8011",
    partNo: "WSD-GLS-011",
    description: "Windshield Toughened Glass",
    category: "Glass",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "approved",
    primaryMethod: "linear-regression",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 420,
    forecastNext: 448,
    forecast3Month: 1350,
    forecast12Month: 5400,
    forecastChangePct: 6.67,
    confidence: "medium",
    mape: 10.5,
    rmse: 48,
    bias: 1.8,
    seasonality: "weak",
    trend: "up",
    safetyStockRec: 112,
    reorderPointRec: 295,
    lastRunDate: daysAgo(4),
    nextRunDate: daysAhead(3),
    dataSource: "ERP Sales History",
    planner: "Sunita Reddy",
    linkedMrpRef: "MRP-2026-5011",
  },
  {
    id: "DF-2026-8012",
    partNo: "RAD-CAP-012",
    description: "Radiator Cap 1.1 Bar",
    category: "Cooling System",
    warehouse: "Chennai Hub",
    abcClass: "C",
    status: "rejected",
    primaryMethod: "moving-average",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 820,
    forecastNext: 380,
    forecast3Month: 1140,
    forecast12Month: 4560,
    forecastChangePct: -53.66,
    confidence: "low",
    mape: 28.5,
    rmse: 245,
    bias: -12.4,
    seasonality: "none",
    trend: "down",
    safetyStockRec: 95,
    reorderPointRec: 240,
    lastRunDate: daysAgo(8),
    nextRunDate: daysAhead(-1),
    dataSource: "ERP Sales History (Discontinued SKU)",
    planner: "Rajesh Kumar",
    linkedMrpRef: "MRP-2026-5012",
  },
  {
    id: "DF-2026-8013",
    partNo: "AIR-FLT-013",
    description: "Air Filter Element Passenger",
    category: "Filter",
    warehouse: "Chennai Hub",
    abcClass: "B",
    status: "under-review",
    primaryMethod: "seasonal-decomposition",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 1650,
    forecastNext: 1980,
    forecast3Month: 5950,
    forecast12Month: 23800,
    forecastChangePct: 20.00,
    confidence: "medium",
    mape: 13.4,
    rmse: 245,
    bias: 4.2,
    seasonality: "strong",
    trend: "up",
    safetyStockRec: 495,
    reorderPointRec: 1280,
    lastRunDate: daysAgo(3),
    nextRunDate: daysAhead(4),
    dataSource: "ERP Sales History + Service Schedule",
    planner: "Rajesh Kumar",
    linkedMrpRef: "MRP-2026-5013",
  },
  {
    id: "DF-2026-8014",
    partNo: "SPK-PLG-014",
    description: "Spark Plug Iridium Tip",
    category: "Ignition",
    warehouse: "Pune Plant",
    abcClass: "B",
    status: "approved",
    primaryMethod: "exponential-smoothing",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 3200,
    forecastNext: 3360,
    forecast3Month: 10080,
    forecast12Month: 40320,
    forecastChangePct: 5.00,
    confidence: "high",
    mape: 8.9,
    rmse: 295,
    bias: -1.5,
    seasonality: "moderate",
    trend: "up",
    safetyStockRec: 840,
    reorderPointRec: 2150,
    lastRunDate: daysAgo(2),
    nextRunDate: daysAhead(5),
    dataSource: "ERP Sales History",
    planner: "Sunita Reddy",
    linkedMrpRef: "MRP-2026-5014",
  },
  {
    id: "DF-2026-8015",
    partNo: "CLU-FAI-015",
    description: "Clutch First Article Assembly",
    category: "Clutch Assembly",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "draft",
    primaryMethod: "ml-ensemble",
    historyPoints: 12,
    forecastHorizon: 12,
    lastActual: 180,
    forecastNext: 220,
    forecast3Month: 660,
    forecast12Month: 2640,
    forecastChangePct: 22.22,
    confidence: "low",
    mape: 18.2,
    rmse: 38,
    bias: 6.8,
    seasonality: "weak",
    trend: "up",
    safetyStockRec: 55,
    reorderPointRec: 145,
    lastRunDate: daysAgo(0),
    nextRunDate: daysAhead(7),
    dataSource: "ERP Sales History (Limited Data)",
    planner: "Sunita Reddy",
    linkedMrpRef: "MRP-2026-5015",
  },
  {
    id: "DF-2026-8016",
    partNo: "HLM-SHL-016",
    description: "Safety Helmet Shell ISI Marked",
    category: "Safety Gear",
    warehouse: "Chennai Hub",
    abcClass: "C",
    status: "archived",
    primaryMethod: "moving-average",
    historyPoints: 24,
    forecastHorizon: 12,
    lastActual: 950,
    forecastNext: 760,
    forecast3Month: 2280,
    forecast12Month: 9120,
    forecastChangePct: -20.00,
    confidence: "medium",
    mape: 15.6,
    rmse: 152,
    bias: -3.5,
    seasonality: "weak",
    trend: "down",
    safetyStockRec: 190,
    reorderPointRec: 485,
    lastRunDate: daysAgo(15),
    nextRunDate: daysAhead(-8),
    dataSource: "ERP Sales History (Discontinued SKU)",
    planner: "Rajesh Kumar",
    linkedMrpRef: "MRP-2026-5016",
  },
]

// ──────────────────────────────────────────────────────────
// DETAIL DRAWER (6 sub-tabs)
// ──────────────────────────────────────────────────────────

function DemandForecastDetailDrawer({ item, open, onOpenChange }: DrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "methods" | "features" | "accuracy" | "scenarios" | "runs">("overview")
  const history = useMemo(() => generateHistory(item), [item])
  const methods = useMemo(() => generateMethodResults(item), [item])
  const features = useMemo(() => generateFeatures(item), [item])
  const accuracy = useMemo(() => generateAccuracy(item), [item])
  const drivers = useMemo(() => generateDrivers(item), [item])
  const scenarios = useMemo(() => generateScenarios(item), [item])
  const runs = useMemo(() => generateModelRuns(item), [item])

  const status = STATUS_CONFIG[item.status]
  const method = METHOD_CONFIG[item.primaryMethod]
  const trend = TREND_CONFIG[item.trend]
  const seasonality = SEASONALITY_CONFIG[item.seasonality]
  const confidence = CONFIDENCE_CONFIG[item.confidence]
  const abc = ABC_CONFIG[item.abcClass]

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Eye },
    { id: "methods" as const, label: "Method Compare", icon: Sigma },
    { id: "features" as const, label: "ML Features", icon: Brain },
    { id: "accuracy" as const, label: "Accuracy", icon: Target },
    { id: "scenarios" as const, label: "Scenarios", icon: GitBranch },
    { id: "runs" as const, label: "Model Runs", icon: Cpu },
  ]

  const statusColor = (s: AccuracyMetric["status"]) =>
    s === "good" ? "text-emerald-700 dark:text-emerald-300" : s === "warning" ? "text-amber-700 dark:text-amber-300" : "text-rose-700 dark:text-rose-300"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="df-drawer-sheen w-full sm:max-w-[1100px] overflow-y-auto p-0 bg-white dark:bg-zinc-950"
      >
        <SheetHeader className="df-drawer-header sticky top-0 z-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-fuchsia-950/40 border-b border-indigo-200/60 dark:border-indigo-900/60 px-6 pt-5 pb-4 backdrop-blur-sm shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", status.color, status.bg, status.border)}>
              <status.icon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", method.color, method.bg)}>
              <method.icon className="h-3 w-3 mr-1" />
              {method.short}
            </Badge>
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", confidence.color, confidence.bg)}>
              <Gauge className="h-3 w-3 mr-1" />
              {confidence.label}
            </Badge>
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", trend.color)}>
              <trend.icon className="h-3 w-3 mr-1" />
              {trend.label}
            </Badge>
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", seasonality.color, seasonality.bg)}>
              <Waves className="h-3 w-3 mr-1" />
              {seasonality.label}
            </Badge>
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", abc.color, abc.bg)}>
              ABC-{item.abcClass}
            </Badge>
          </div>
          <SheetTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Avatar className="h-9 w-9 rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white text-xs">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white">
                {item.partNo.substring(0, 3)}
              </AvatarFallback>
            </Avatar>
            {item.description}
          </SheetTitle>
          <SheetDescription className="text-xs text-zinc-600 dark:text-zinc-400 flex flex-wrap items-center gap-2 mt-1">
            <span className="font-mono font-semibold text-indigo-700 dark:text-indigo-300">{item.id}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>Part: <span className="font-mono">{item.partNo}</span></span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>Planner: <span className="font-semibold">{item.planner}</span></span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>Linked: <span className="font-mono text-blue-700 dark:text-blue-300">{item.linkedMrpRef}</span></span>
          </SheetDescription>

          <div className="df-stat-enter mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
              <CardContent className="p-3">
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Last Actual</div>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{fmtNum(item.lastActual)}</div>
                <div className="text-[10px] text-zinc-500">{item.historyPoints} months history</div>
              </CardContent>
            </Card>
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
              <CardContent className="p-3">
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Next Period Forecast</div>
                <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{fmtNum(item.forecastNext)}</div>
                <div className={cn("text-[10px] font-semibold", item.forecastChangePct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                  {fmtPct(item.forecastChangePct)} vs last actual
                </div>
              </CardContent>
            </Card>
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
              <CardContent className="p-3">
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">12-Month Forecast</div>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{fmtNum(item.forecast12Month)}</div>
                <div className="text-[10px] text-zinc-500">{item.forecastHorizon} months horizon</div>
              </CardContent>
            </Card>
            <Card className={cn("border backdrop-blur", item.mape < 10 ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/80 dark:bg-emerald-950/40" : item.mape < 15 ? "border-amber-200 dark:border-amber-900 bg-amber-50/80 dark:bg-amber-950/40" : "border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40")}>
              <CardContent className="p-3">
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">MAPE</div>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{item.mape.toFixed(2)}%</div>
                <div className="text-[10px] text-zinc-500">RMSE: {fmtNum(item.rmse)} · Bias: {item.bias.toFixed(2)}%</div>
              </CardContent>
            </Card>
          </div>
        </SheetHeader>

        {/* Sub-tab strip */}
        <div className="sticky top-[200px] z-10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-6 py-2 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "df-tab-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900",
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="df-body-enter px-6 py-5">
          {/* ─── Overview tab ─── */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <Card className="df-chart-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <LineChartIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Historical Demand + Forecast (36 months)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    24 months actual demand + 12 months forecast (highlighted region) — last actual: <span className="font-mono font-semibold">{item.lastActual}</span> units
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dfForecastBand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                      <XAxis dataKey="period" tick={{ fontSize: 9 }} stroke="currentColor" className="text-zinc-500" angle={-30} textAnchor="end" height={70} interval={1} />
                      <YAxis tick={{ fontSize: 10 }} stroke="currentColor" className="text-zinc-500" />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8 }}
                        formatter={(v: number, n: string) => n === "actual" || n === "forecast" ? `${fmtNum(v)} units` : v}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#6366f1" fill="url(#dfForecastBand)" strokeWidth={2} strokeDasharray="5 5" connectNulls />
                      <Line type="monotone" dataKey="actual" name="Actual" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: "#10b981" }} connectNulls />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">3-Month Forecast</span>
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtNum(item.forecast3Month)}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Q3-2026 cumulative</div>
                  </CardContent>
                </Card>
                <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Safety Stock Rec.</span>
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{fmtNum(item.safetyStockRec)}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{((item.safetyStockRec / item.forecastNext) * 100).toFixed(0)}% of next forecast</div>
                  </CardContent>
                </Card>
                <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Reorder Point</span>
                      <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{fmtNum(item.reorderPointRec)}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Triggers MRP run</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    Forecast Metadata & Run Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Data Source</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50 text-[11px]">{item.dataSource}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">History Points</div>
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{item.historyPoints} months</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Forecast Horizon</div>
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{item.forecastHorizon} months</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Planner</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">{item.planner}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Last Run</div>
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{item.lastRunDate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Next Scheduled Run</div>
                      <div className={cn("font-mono font-semibold", item.nextRunDate < daysAgo(0) ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300")}>{item.nextRunDate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Warehouse</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">{item.warehouse}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Category</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">{item.category}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    Demand Drivers (Top Factors)
                  </CardTitle>
                  <CardDescription className="text-xs">Qualitative factors influencing forecast — positive (green) drivers increase demand, negative (red) decrease</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {drivers.map((d, i) => (
                      <div key={i} className="df-row-in flex items-center gap-3 p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <div className={cn("h-8 w-8 rounded-md flex items-center justify-center", d.direction === "positive" ? "bg-emerald-100 dark:bg-emerald-950/50" : d.direction === "negative" ? "bg-rose-100 dark:bg-rose-950/50" : "bg-zinc-100 dark:bg-zinc-900")}>
                          {d.direction === "positive" ? <ArrowUp className="h-4 w-4 text-emerald-600" /> : d.direction === "negative" ? <ArrowDown className="h-4 w-4 text-rose-600" /> : <Minus className="h-4 w-4 text-zinc-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">{d.driver}</div>
                          <div className="text-[10px] text-zinc-500 truncate">{d.description}</div>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] font-mono font-bold", d.direction === "positive" ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900" : d.direction === "negative" ? "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900" : "border-zinc-300 bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400")}>
                          {d.impact > 0 ? "+" : ""}{d.impact}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── Method Compare tab ─── */}
          {activeTab === "methods" && (
            <div className="space-y-4">
              <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sigma className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Forecast Method Comparison
                  </CardTitle>
                  <CardDescription className="text-xs">6 forecasting methods ranked by MAPE (lower is better) — primary method highlighted</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                        <TableHead className="text-[10px] uppercase">Method</TableHead>
                        <TableHead className="text-[10px] uppercase">Forecast</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">MAPE</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">RMSE</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Bias</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Weight</TableHead>
                        <TableHead className="text-[10px] uppercase">Primary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {methods.map((m, idx) => {
                        const cfg = METHOD_CONFIG[m.method]
                        return (
                          <TableRow key={m.method} className={cn("df-row-in", m.isPrimary && "bg-indigo-50/40 dark:bg-indigo-950/20")}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <cfg.icon className={cn("h-4 w-4", cfg.color)} />
                                <div>
                                  <div className="text-xs font-semibold">{cfg.label}</div>
                                  <div className="text-[10px] text-zinc-500 max-w-[280px] truncate">{cfg.description}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-[11px] font-semibold">{fmtNum(m.forecast)}</TableCell>
                            <TableCell className={cn("text-right font-mono text-[11px] font-bold", m.mape < 10 ? "text-emerald-700 dark:text-emerald-300" : m.mape < 15 ? "text-amber-700 dark:text-amber-300" : "text-rose-700 dark:text-rose-300")}>{m.mape.toFixed(2)}%</TableCell>
                            <TableCell className="text-right font-mono text-[11px]">{fmtNum(m.rmse)}</TableCell>
                            <TableCell className={cn("text-right font-mono text-[11px]", Math.abs(m.bias) < 5 ? "text-emerald-700 dark:text-emerald-300" : Math.abs(m.bias) < 10 ? "text-amber-700 dark:text-amber-300" : "text-rose-700 dark:text-rose-300")}>{m.bias > 0 ? "+" : ""}{m.bias.toFixed(2)}%</TableCell>
                            <TableCell className="text-right font-mono text-[11px]">{(m.weight * 100).toFixed(0)}%</TableCell>
                            <TableCell>
                              {m.isPrimary ? (
                                <Badge variant="outline" className="text-[10px] border-indigo-300 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Primary
                                </Badge>
                              ) : (
                                <span className="text-[10px] text-zinc-400">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="df-chart-enter border border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      MAPE by Method (lower = better)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={methods} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10 }} unit="%" stroke="currentColor" className="text-zinc-500" />
                        <YAxis type="category" dataKey="method" tick={{ fontSize: 10 }} width={90} tickFormatter={(v) => METHOD_CONFIG[v as ForecastMethod].short} stroke="currentColor" className="text-zinc-500" />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => `${v.toFixed(2)}%`} />
                        <Bar dataKey="mape" name="MAPE" radius={[0, 6, 6, 0]}>
                          {methods.map((m) => (
                            <Cell key={m.method} fill={m.mape < 10 ? "#10b981" : m.mape < 15 ? "#f59e0b" : "#f43f5e"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="df-chart-enter border border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Ensemble Weight Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={methods}
                          dataKey="weight"
                          nameKey="method"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          label={(entry) => `${METHOD_CONFIG[entry.method as ForecastMethod].short}: ${(entry.weight * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {methods.map((m) => (
                            <Cell key={m.method} fill={m.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ─── ML Features tab ─── */}
          {activeTab === "features" && (
            <div className="space-y-4">
              <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    ML Feature Importance (XGBoost + LSTM Ensemble)
                  </CardTitle>
                  <CardDescription className="text-xs">Top features ranked by SHAP value — measures contribution to forecast output. Higher importance = more influence on prediction</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={features} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10 }} stroke="currentColor" className="text-zinc-500" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <YAxis type="category" dataKey="feature" tick={{ fontSize: 10 }} width={180} stroke="currentColor" className="text-zinc-500" />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8 }}
                        formatter={(v: number) => `${(v * 100).toFixed(1)}%`}
                      />
                      <Bar dataKey="importance" name="Importance" radius={[0, 6, 6, 0]}>
                        {features.map((_, i) => (
                          <Cell key={i} fill={`hsl(${240 + i * 12}, 70%, 55%)`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    Feature Details & Data Lineage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                        <TableHead className="text-[10px] uppercase">Feature</TableHead>
                        <TableHead className="text-[10px] uppercase">Description</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Importance</TableHead>
                        <TableHead className="text-[10px] uppercase">Contribution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {features.map((f, i) => (
                        <TableRow key={f.feature} className="df-row-in">
                          <TableCell className="text-[11px] font-semibold">{f.feature}</TableCell>
                          <TableCell className="text-[10px] text-zinc-500">{f.description}</TableCell>
                          <TableCell className="text-right font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-300">{(f.importance * 100).toFixed(1)}%</TableCell>
                          <TableCell>
                            <div className="w-[120px]">
                              <Progress value={f.importance * 100 / features[0].importance} className="h-2" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── Accuracy tab ─── */}
          {activeTab === "accuracy" && (
            <div className="space-y-4">
              <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Forecast Accuracy Metrics
                  </CardTitle>
                  <CardDescription className="text-xs">7 accuracy metrics vs industry benchmarks — backtested on last 12 months of holdout data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                        <TableHead className="text-[10px] uppercase">Metric</TableHead>
                        <TableHead className="text-[10px] uppercase">Description</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Value</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Benchmark</TableHead>
                        <TableHead className="text-[10px] uppercase">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accuracy.map((a) => (
                        <TableRow key={a.metric} className="df-row-in">
                          <TableCell className="font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-300">{a.metric}</TableCell>
                          <TableCell className="text-[10px] text-zinc-500">{a.description}</TableCell>
                          <TableCell className={cn("text-right font-mono text-[11px] font-bold", statusColor(a.status))}>
                            {a.value}{a.unit && <span className="text-[10px] font-normal ml-0.5">{a.unit}</span>}
                          </TableCell>
                          <TableCell className="text-right font-mono text-[10px] text-zinc-500">{a.benchmark}{a.unit === "%" ? "%" : ""}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[10px]",
                              a.status === "good" && "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
                              a.status === "warning" && "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
                              a.status === "bad" && "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
                            )}>
                              {a.status === "good" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : a.status === "warning" ? <AlertTriangle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                              {a.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="df-chart-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Actual vs Forecast — Holdout Period (last 12 months)
                  </CardTitle>
                  <CardDescription className="text-xs">Scatter plot of predicted vs actual — points on diagonal line = perfect forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <ScatterChart margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                      <XAxis type="number" dataKey="actual" name="Actual" tick={{ fontSize: 10 }} stroke="currentColor" className="text-zinc-500" label={{ value: "Actual Demand", position: "insideBottom", offset: -5, fontSize: 10 }} />
                      <YAxis type="number" dataKey="forecast" name="Forecast" tick={{ fontSize: 10 }} stroke="currentColor" className="text-zinc-500" label={{ value: "Forecast", angle: -90, position: "insideLeft", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8 }}
                        formatter={(v: number, n: string) => [fmtNum(v), n === "actual" ? "Actual" : "Forecast"]}
                      />
                      <Scatter
                        name="Predictions"
                        data={history.filter((h) => h.actual !== undefined && h.forecast !== undefined).map((h) => ({ actual: h.actual, forecast: h.forecast }))}
                        fill="#6366f1"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── Scenarios tab ─── */}
          {activeTab === "scenarios" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {scenarios.map((s) => {
                  const cfg = s.scenario === "pessimistic" ? { color: "rose", bg: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200 dark:border-rose-900", text: "text-rose-700 dark:text-rose-300", icon: TrendingDown } : s.scenario === "base" ? { color: "blue", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-900", text: "text-blue-700 dark:text-blue-300", icon: Target } : { color: "emerald", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-900", text: "text-emerald-700 dark:text-emerald-300", icon: TrendingUp }
                  return (
                    <Card key={s.scenario} className={cn("df-card-enter border", cfg.border, cfg.bg)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider", cfg.text)}>{s.scenario}</span>
                          <cfg.icon className={cn("h-4 w-4", cfg.text)} />
                        </div>
                        <div className={cn("text-2xl font-bold", cfg.text)}>{fmtNum(s.forecast)}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">12-month units · {s.probability}% probability</div>
                        <Progress value={s.probability} className="h-1.5 mt-2" />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Scenario Assumptions
                  </CardTitle>
                  <CardDescription className="text-xs">Key assumptions driving each scenario — used for sensitivity analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scenarios.map((s) => (
                      <div key={s.scenario} className="df-row-in p-3 rounded-md border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-bold capitalize",
                              s.scenario === "pessimistic" && "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
                              s.scenario === "base" && "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
                              s.scenario === "optimistic" && "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
                            )}>
                              {s.scenario}
                            </Badge>
                            <span className="text-xs font-bold">{fmtNum(s.forecast)} units</span>
                            <span className="text-[10px] text-zinc-500">· {s.probability}% probability</span>
                          </div>
                        </div>
                        <ul className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1 list-disc pl-4">
                          {s.assumptions.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── Model Runs tab ─── */}
          {activeTab === "runs" && (
            <Card className="df-card-enter border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Model Run History (last 6 training runs)
                </CardTitle>
                <CardDescription className="text-xs">Each run retrains the ML ensemble on the latest demand history — automated retraining schedule + manual triggers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                      <TableHead className="text-[10px] uppercase">Run ID</TableHead>
                      <TableHead className="text-[10px] uppercase">Run Date</TableHead>
                      <TableHead className="text-[10px] uppercase">Trigger</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Duration</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Data Points</TableHead>
                      <TableHead className="text-[10px] uppercase">Status</TableHead>
                      <TableHead className="text-[10px] uppercase">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runs.map((r) => (
                      <TableRow key={r.runId} className={cn("df-row-in", r.status === "failed" && "bg-rose-50/40 dark:bg-rose-950/20")}>
                        <TableCell className="font-mono text-[10px]">{r.runId}</TableCell>
                        <TableCell className="font-mono text-[10px]">{r.runDate}</TableCell>
                        <TableCell className="text-[10px]">{r.triggeredBy}</TableCell>
                        <TableCell className="text-right font-mono text-[10px]">{(r.durationMs / 1000).toFixed(1)}s</TableCell>
                        <TableCell className="text-right font-mono text-[10px]">{r.dataPoints}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[10px]",
                            r.status === "completed" && "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
                            r.status === "failed" && "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
                            r.status === "running" && "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
                          )}>
                            {r.status === "completed" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : r.status === "failed" ? <XCircle className="h-3 w-3 mr-1" /> : <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] text-zinc-500 max-w-[260px] truncate">{r.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <SheetFooter className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 bg-zinc-50 dark:bg-zinc-950/80 flex flex-row items-center justify-between gap-2 sticky bottom-0">
          <Button variant="outline" size="sm" onClick={() => {
            exportToCSV(
              [{ id: item.id, part_no: item.partNo, description: item.description, method: item.primaryMethod, last_actual: item.lastActual, forecast_next: item.forecastNext, forecast_12m: item.forecast12Month, mape: item.mape, rmse: item.rmse, bias: item.bias, status: item.status, planner: item.planner }].map((r) => ({ ...r })),
              `demand-forecast-${item.id}.csv`,
            )
          }}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <div className="flex items-center gap-2">
            {item.status === "draft" && (
              <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={() => {}}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Submit for Review
              </Button>
            )}
            {item.status === "auto-generated" && (
              <Button size="sm" variant="default" className="bg-amber-600 hover:bg-amber-700" onClick={() => {}}>
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Review & Approve
              </Button>
            )}
            {item.status === "under-review" && (
              <>
                <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {}}>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Approve Forecast
                </Button>
                <Button size="sm" variant="destructive" onClick={() => {}}>
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Reject
                </Button>
              </>
            )}
            {item.status === "approved" && (
              <Button size="sm" variant="default" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => {}}>
                <RefreshCcwDot className="h-3.5 w-3.5 mr-1.5" />
                Trigger Manual Retrain
              </Button>
            )}
            {item.status === "rejected" && (
              <Button size="sm" variant="outline" onClick={() => {}}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Reopen for Re-analysis
              </Button>
            )}
            {item.status === "archived" && (
              <Button size="sm" variant="outline" onClick={() => {}}>
                <Archive className="h-3.5 w-3.5 mr-1.5" />
                Unarchive
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
              <XCircle className="h-3.5 w-3.5 mr-1.5" />
              Close
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ──────────────────────────────────────────────────────────
// MAIN VIEW
// ──────────────────────────────────────────────────────────

export function DemandForecastingView() {
  const { toast } = useToast()
  const [activeStatus, setActiveStatus] = useState<ForecastStatus | "all">("all")
  const [methodFilter, setMethodFilter] = useState<ForecastMethod | "all">("all")
  const [abcFilter, setAbcFilter] = useState<"A" | "B" | "C" | "all">("all")
  const [search, setSearch] = useState("")
  const [selectedItem, setSelectedItem] = useState<DemandForecastItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = useMemo(() => {
    return DF_ITEMS.filter((item) => {
      if (activeStatus !== "all" && item.status !== activeStatus) return false
      if (methodFilter !== "all" && item.primaryMethod !== methodFilter) return false
      if (abcFilter !== "all" && item.abcClass !== abcFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !item.id.toLowerCase().includes(q) &&
          !item.partNo.toLowerCase().includes(q) &&
          !item.description.toLowerCase().includes(q) &&
          !item.category.toLowerCase().includes(q) &&
          !item.warehouse.toLowerCase().includes(q) &&
          !item.planner.toLowerCase().includes(q) &&
          !item.linkedMrpRef.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [activeStatus, methodFilter, abcFilter, search])

  // Aggregate KPIs
  const totalForecast12M = DF_ITEMS.reduce((s, i) => s + i.forecast12Month, 0)
  const totalForecastNext = DF_ITEMS.reduce((s, i) => s + i.forecastNext, 0)
  const totalLastActual = DF_ITEMS.reduce((s, i) => s + i.lastActual, 0)
  const avgMape = DF_ITEMS.reduce((s, i) => s + i.mape, 0) / DF_ITEMS.length
  const avgConfidence = DF_ITEMS.reduce((s, i) => s + CONFIDENCE_CONFIG[i.confidence].percent, 0) / DF_ITEMS.length
  const highAccuracyCount = DF_ITEMS.filter((i) => i.mape < 10).length
  const approvedCount = DF_ITEMS.filter((i) => i.status === "approved").length
  const pendingReviewCount = DF_ITEMS.filter((i) => i.status === "under-review" || i.status === "auto-generated" || i.status === "draft").length
  const rejectedCount = DF_ITEMS.filter((i) => i.status === "rejected").length
  const mlEnsembleCount = DF_ITEMS.filter((i) => i.primaryMethod === "ml-ensemble").length
  void mlEnsembleCount
  const forecastChangePctAvg = ((totalForecastNext - totalLastActual) / totalLastActual) * 100
  void forecastChangePctAvg

  // Status distribution
  const statusDistribution = useMemo(() => {
    const map = new Map<ForecastStatus, number>()
    DF_ITEMS.forEach((i) => map.set(i.status, (map.get(i.status) || 0) + 1))
    return Array.from(map.entries()).map(([status, count]) => ({ status, count }))
  }, [])

  // Method distribution (by count)
  const methodDistribution = useMemo(() => {
    const map = new Map<ForecastMethod, number>()
    DF_ITEMS.forEach((i) => map.set(i.primaryMethod, (map.get(i.primaryMethod) || 0) + 1))
    return Array.from(map.entries()).map(([method, count]) => ({ method, count }))
  }, [])

  // Average MAPE by method
  const mapeByMethod = useMemo(() => {
    const map = new Map<ForecastMethod, { total: number; count: number }>()
    DF_ITEMS.forEach((i) => {
      const existing = map.get(i.primaryMethod) || { total: 0, count: 0 }
      map.set(i.primaryMethod, { total: existing.total + i.mape, count: existing.count + 1 })
    })
    return Array.from(map.entries()).map(([method, v]) => ({
      method,
      mape: v.total / v.count,
      short: METHOD_CONFIG[method].short,
      color: METHOD_CONFIG[method].pieColor,
    })).sort((a, b) => a.mape - b.mape)
  }, [])

  // Top 10 by 12-month forecast volume
  const top10ByForecast = useMemo(() => {
    return [...DF_ITEMS].sort((a, b) => b.forecast12Month - a.forecast12Month).slice(0, 10)
  }, [])

  // Aggregate historical+forecast trend (sum across all items)
  const aggregateTrend = useMemo(() => {
    const allHistory = DF_ITEMS.map((it) => generateHistory(it))
    const months = allHistory[0].map((h) => h.period)
    return months.map((month, idx) => {
      const items = allHistory.map((h) => h[idx]).filter((h) => h)
      return {
        period: month,
        actual: items.reduce((s, h) => s + (h.actual ?? 0), 0),
        forecast: items.reduce((s, h) => s + (h.forecast ?? 0), 0),
      }
    })
  }, [])

  const statusTabs: { id: ForecastStatus | "all"; label: string; count: number }[] = [
    { id: "all", label: "All", count: DF_ITEMS.length },
    ...Object.entries(STATUS_CONFIG).map(([id, cfg]) => ({
      id: id as ForecastStatus,
      label: cfg.label,
      count: DF_ITEMS.filter((i) => i.status === id).length,
    })),
  ]

  const handleRowClick = (item: DemandForecastItem) => {
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  const handleExport = () => {
    exportToCSV(
      filtered.map((i) => ({
        id: i.id,
        part_no: i.partNo,
        description: i.description,
        category: i.category,
        warehouse: i.warehouse,
        abc_class: i.abcClass,
        status: i.status,
        primary_method: i.primaryMethod,
        history_points: i.historyPoints,
        forecast_horizon: i.forecastHorizon,
        last_actual: i.lastActual,
        forecast_next: i.forecastNext,
        forecast_3m: i.forecast3Month,
        forecast_12m: i.forecast12Month,
        forecast_change_pct: i.forecastChangePct,
        confidence: i.confidence,
        mape: i.mape,
        rmse: i.rmse,
        bias: i.bias,
        seasonality: i.seasonality,
        trend: i.trend,
        safety_stock_rec: i.safetyStockRec,
        reorder_point_rec: i.reorderPointRec,
        last_run: i.lastRunDate,
        next_run: i.nextRunDate,
        data_source: i.dataSource,
        planner: i.planner,
        linked_mrp_ref: i.linkedMrpRef,
      })),
      "demand-forecast-export.csv",
    )
    toast.success("Export Complete", `${filtered.length} records exported to CSV`)
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <PageHeader
        title="Demand Forecasting"
        description="Statistical + ML demand forecasting — 6 methods (MA, ETS, OLS, STL, ARIMA, ML Ensemble) on top of MRP demand history — auto-retrain + accuracy benchmarks"
      />

      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold">ML Ensemble Active</span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span>Auto-retrain: <span className="font-mono font-semibold">Weekly</span></span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span>Last global run: <span className="font-mono font-semibold">{daysAgo(0)}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Refreshed", "Latest forecast runs synced from ML pipeline")}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.info("Bulk Retrain Started", "Triggered retraining of all 16 SKUs — estimated completion in 4 minutes")}>
            <Cpu className="h-3.5 w-3.5 mr-1.5" />
            Bulk Retrain
          </Button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="df-kpi-enter grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="df-kpi-enter relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">12-Mo Forecast</span>
              <LineChartIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtNum(totalForecast12M)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">across {DF_ITEMS.length} SKUs</div>
          </CardContent>
        </Card>
        <Card className="df-kpi-enter relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Avg MAPE</span>
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{avgMape.toFixed(2)}%</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{highAccuracyCount} SKUs under 10% (high accuracy)</div>
          </CardContent>
        </Card>
        <Card className="df-kpi-enter relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Avg Confidence</span>
              <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{avgConfidence.toFixed(0)}%</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">across all SKUs</div>
          </CardContent>
        </Card>
        <Card className="df-kpi-enter relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Approved</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{approvedCount}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">of {DF_ITEMS.length} forecasts</div>
          </CardContent>
        </Card>
        <Card className={cn("df-kpi-enter relative overflow-hidden border", pendingReviewCount > 0 ? "border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30" : "border-zinc-200 dark:border-zinc-800")}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
          {pendingReviewCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          )}
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Pending Review</span>
              <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{pendingReviewCount}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">awaiting planner approval</div>
          </CardContent>
        </Card>
        <Card className={cn("df-kpi-enter relative overflow-hidden border", rejectedCount > 0 ? "border-rose-200 dark:border-rose-900 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" : "border-zinc-200 dark:border-zinc-800")}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Rejected</span>
              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{rejectedCount}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">need re-forecast</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="df-chart-enter lg:col-span-2 border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Aggregate Demand History + Forecast (36 months)
            </CardTitle>
            <CardDescription className="text-xs">
              Total demand across all {DF_ITEMS.length} SKUs — 24 months actual + 12 months forecast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={aggregateTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="agDfForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                <XAxis dataKey="period" tick={{ fontSize: 9 }} stroke="currentColor" className="text-zinc-500" angle={-30} textAnchor="end" height={70} interval={1} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtNum(v)} stroke="currentColor" className="text-zinc-500" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtNum(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#6366f1" fill="url(#agDfForecast)" strokeWidth={2} strokeDasharray="5 5" connectNulls />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: "#10b981" }} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="df-chart-enter border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Gauge className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Forecast Status Distribution
            </CardTitle>
            <CardDescription className="text-xs">Forecasts by approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  label={(entry) => `${STATUS_CONFIG[entry.status as ForecastStatus].label}: ${entry.count}`}
                  labelLine={false}
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_CONFIG[entry.status].pieColor} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="df-chart-enter border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Primary Method Distribution
            </CardTitle>
            <CardDescription className="text-xs">Forecast method used per SKU</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={methodDistribution}
                  dataKey="count"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  label={(entry) => `${METHOD_CONFIG[entry.method as ForecastMethod].short}: ${entry.count}`}
                  labelLine={false}
                >
                  {methodDistribution.map((entry) => (
                    <Cell key={entry.method} fill={METHOD_CONFIG[entry.method].pieColor} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="df-chart-enter lg:col-span-2 border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Average MAPE by Forecast Method
            </CardTitle>
            <CardDescription className="text-xs">Lower MAPE = higher accuracy — ML Ensemble typically wins</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mapeByMethod} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} unit="%" stroke="currentColor" className="text-zinc-500" />
                <YAxis type="category" dataKey="short" tick={{ fontSize: 11 }} width={70} stroke="currentColor" className="text-zinc-500" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => `${v.toFixed(2)}%`} />
                <Bar dataKey="mape" name="Avg MAPE" radius={[0, 6, 6, 0]}>
                  {mapeByMethod.map((m) => (
                    <Cell key={m.method} fill={m.mape < 10 ? "#10b981" : m.mape < 15 ? "#f59e0b" : "#f43f5e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 3 */}
      <Card className="df-chart-enter border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Top 10 SKUs by 12-Month Forecast Volume
          </CardTitle>
          <CardDescription className="text-xs">Highest forecast demand SKUs — focus of capacity planning</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top10ByForecast.map((i) => ({ name: i.partNo, forecast: i.forecast12Month, actual: i.lastActual * 12, status: i.status, method: i.primaryMethod }))} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => fmtNum(v)} stroke="currentColor" className="text-zinc-500" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} stroke="currentColor" className="text-zinc-500" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtNum(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="actual" name="Last 12M Actual" fill="#10b981" radius={[0, 4, 4, 0]} />
              <Bar dataKey="forecast" name="Next 12M Forecast" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatus(tab.id)}
            className={cn(
              "df-tab-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
              activeStatus === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800",
            )}
          >
            {tab.label}
            <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1.5">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="df-search-focus relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by ID, part no, description, planner, MRP ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as ForecastMethod | "all")}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Forecast Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="moving-average">Moving Average</SelectItem>
            <SelectItem value="exponential-smoothing">Exp. Smoothing</SelectItem>
            <SelectItem value="linear-regression">Linear Regression</SelectItem>
            <SelectItem value="seasonal-decomposition">STL</SelectItem>
            <SelectItem value="arima">ARIMA</SelectItem>
            <SelectItem value="ml-ensemble">ML Ensemble</SelectItem>
          </SelectContent>
        </Select>
        <Select value={abcFilter} onValueChange={(v) => setAbcFilter(v as "A" | "B" | "C" | "all")}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="ABC Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ABC</SelectItem>
            <SelectItem value="A">A Class</SelectItem>
            <SelectItem value="B">B Class</SelectItem>
            <SelectItem value="C">C Class</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-xs text-zinc-500 ml-auto">
          Showing <span className="font-semibold text-zinc-700 dark:text-zinc-300">{filtered.length}</span> of {DF_ITEMS.length} forecasts
        </div>
      </div>

      {/* Master table */}
      <Card className="df-table-card border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                <TableHead className="text-[10px] uppercase">Part / Description</TableHead>
                <TableHead className="text-[10px] uppercase">Status</TableHead>
                <TableHead className="text-[10px] uppercase">Method</TableHead>
                <TableHead className="text-[10px] uppercase">Conf.</TableHead>
                <TableHead className="text-[10px] uppercase">Trend</TableHead>
                <TableHead className="text-[10px] uppercase">Seas.</TableHead>
                <TableHead className="text-[10px] uppercase text-right">Last Actual</TableHead>
                <TableHead className="text-[10px] uppercase text-right">Next Fcst</TableHead>
                <TableHead className="text-[10px] uppercase text-right">Change</TableHead>
                <TableHead className="text-[10px] uppercase text-right">12-Mo Fcst</TableHead>
                <TableHead className="text-[10px] uppercase text-right">MAPE</TableHead>
                <TableHead className="text-[10px] uppercase text-right">SS Rec</TableHead>
                <TableHead className="text-[10px] uppercase">Planner</TableHead>
                <TableHead className="text-[10px] uppercase"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const cfg = STATUS_CONFIG[item.status]
                const mCfg = METHOD_CONFIG[item.primaryMethod]
                const confCfg = CONFIDENCE_CONFIG[item.confidence]
                const tCfg = TREND_CONFIG[item.trend]
                const sCfg = SEASONALITY_CONFIG[item.seasonality]
                return (
                  <TableRow
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className={cn(
                      "df-row-in cursor-pointer group",
                      item.status === "rejected" && "df-row-critical",
                      (item.status === "under-review" || item.status === "draft") && "df-row-warn",
                      item.status === "approved" && "df-row-favorable",
                    )}
                  >
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white text-[10px]">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white">
                            {item.partNo.substring(0, 3)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">{item.description}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{item.id} · {item.partNo}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] border", cfg.color, cfg.bg, cfg.border)}>
                        <cfg.icon className="h-3 w-3 mr-1" />
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] border", mCfg.color, mCfg.bg)}>
                        {mCfg.short}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] border", confCfg.color, confCfg.bg)}>
                        {item.confidence === "high" ? "H" : item.confidence === "medium" ? "M" : "L"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <tCfg.icon className={cn("h-3.5 w-3.5", tCfg.color)} />
                    </TableCell>
                    <TableCell>
                      <span className={cn("text-[10px] font-semibold", sCfg.color)}>{item.seasonality === "none" ? "—" : item.seasonality.charAt(0).toUpperCase()}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px]">{fmtNum(item.lastActual)}</TableCell>
                    <TableCell className="text-right font-mono text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">{fmtNum(item.forecastNext)}</TableCell>
                    <TableCell className={cn("text-right font-mono text-[11px] font-semibold", item.forecastChangePct >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>
                      {fmtPct(item.forecastChangePct)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px]">{fmtNum(item.forecast12Month)}</TableCell>
                    <TableCell className={cn("text-right font-mono text-[11px] font-bold", item.mape < 10 ? "text-emerald-700 dark:text-emerald-300" : item.mape < 15 ? "text-amber-700 dark:text-amber-300" : "text-rose-700 dark:text-rose-300")}>{item.mape.toFixed(2)}%</TableCell>
                    <TableCell className="text-right font-mono text-[11px] text-emerald-700 dark:text-emerald-300">{fmtNum(item.safetyStockRec)}</TableCell>
                    <TableCell>
                      <div className="text-[10px]">{item.planner}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{item.linkedMrpRef}</div>
                    </TableCell>
                    <TableCell>
                      <Eye className="h-3.5 w-3.5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-12 text-zinc-500 text-xs">
                    No demand forecasts match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Drawer */}
      {selectedItem && (
        <DemandForecastDetailDrawer
          item={selectedItem}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}
    </div>
  )
}


