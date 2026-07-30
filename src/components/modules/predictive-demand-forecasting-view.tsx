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
  ChartSpline,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  Target,
  Zap,
  Activity,
  Gauge,
  BarChart3,
  Brain,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  Package,
  Warehouse,
  Truck,
  Layers,
  AlertTriangle,
  Info,
  ChevronRight,
  ThermometerSun,
  Percent,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const PRODUCTS = [
  "Premium Basmati Rice 25kg", "Organic Turmeric Powder 500g", "Stainless Steel Utensil Set",
  "Cotton Bed Sheet Double", "LED Panel Light 36W", "Automotive Filter Kit",
  "Pharma Tablet Carton", "Frozen Paratha Pack 10pc", "Ceramic Floor Tile 2×2",
  "Hydraulic Pump Assembly", "Circuit Board PCB 4-Layer", "Textile Silk Fabric 5m",
  "Solar Panel Module 400W", "Battery Pack Li-Ion", "PVC Pipe 4-inch 3m",
  "Coconut Oil Cold Pressed 1L", "Industrial Bearing Set", "Brass Valve 1-inch",
  "Packaging Corrugated Box", "Wheat Flour Atta 10kg",
] as const

const CATEGORIES = [
  "FMCG", "Electronics", "Textiles", "Automotive", "Pharma",
  "Industrial", "Agriculture", "Building Materials", "Energy", "Packaging",
] as const

const WAREHOUSES = [
  "Mumbai DC", "Delhi NCR Hub", "Bengaluru WH", "Chennai Port",
  "Kolkata Distribution", "Hyderabad Fulfillment", "Pune Warehouse", "Ahmedabad Hub",
] as const

const REGIONS = [
  "North India", "South India", "East India", "West India", "Central India",
] as const

const SEASONS = ["Summer", "Monsoon", "Festival", "Winter", "Pre-Monsoon"] as const

const ALGORITHMS = [
  "ARIMA", "Prophet", "LSTM Neural Net", "XGBoost Ensemble",
  "SARIMA", "Exponential Smoothing", "Random Forest", "LightGBM",
] as const

const ACCURACY_METRICS = ["MAPE", "RMSE", "MAE", "R-Squared", "WAPE"] as const

const SCENARIOS = ["Base Case", "Best Case", "Worst Case", "Custom Growth"] as const

const COLORS = {
  teal: "#0d9488",
  indigo: "#6366f1",
  rose: "#e11d48",
  amber: "#f59e0b",
  emerald: "#059669",
  sky: "#0ea5e9",
  violet: "#8b5cf6",
  orange: "#f97316",
  pink: "#ec4899",
  lime: "#84cc16",
}

const ALGO_COLORS: Record<string, string> = {
  "ARIMA": "#6366f1",
  "Prophet": "#0d9488",
  "LSTM Neural Net": "#e11d48",
  "XGBoost Ensemble": "#f59e0b",
  "SARIMA": "#8b5cf6",
  "Exponential Smoothing": "#0ea5e9",
  "Random Forest": "#059669",
  "LightGBM": "#f97316",
}

const CONFIDENCE_COLORS = ["#22c55e", "#6366f1", "#f59e0b"]

// ─── Types ───────────────────────────────────────────────────────────────
interface DemandForecast {
  id: string
  product: string
  category: string
  warehouse: string
  region: string
  currentDemand: number
  forecastDemand: number
  forecastGrowth: number
  confidence: number
  algorithm: string
  seasonality: string
  forecastDate: string
  horizon: string
  mape: number
  status: string
  trend: string
  stockCoverDays: number
  safetyStock: number
  reorderPoint: number
}

interface SeasonalPattern {
  id: string
  product: string
  category: string
  warehouse: string
  season: string
  demandMultiplier: number
  historicalVolume: number
  forecastVolume: number
  variancePct: number
  peakMonth: string
  peakVolume: number
  trendStrength: number
  reliability: number
}

interface ScenarioModel {
  id: string
  product: string
  category: string
  scenario: string
  probability: number
  demandEstimate: number
  revenueImpact: number
  costImpact: number
  marginPct: number
  riskLevel: string
  keyDrivers: string
  confidence: number
  modelDate: string
}

interface AccuracyRecord {
  id: string
  algorithm: string
  product: string
  category: string
  mape: number
  rmse: number
  mae: number
  rSquared: number
  wape: number
  trainingPeriod: string
  testPeriod: string
  lastEvaluated: string
  active: boolean
  recommended: boolean
}

interface AlertRecord {
  id: string
  product: string
  warehouse: string
  alertType: string
  severity: string
  message: string
  currentDemand: number
  forecastDemand: number
  deviation: number
  triggeredDate: string
  status: string
  actionTaken: string
}

// ─── Data Generation ──────────────────────────────────────────────────────
function generateData() {
  const months = ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"]
  const horizons = ["7-Day", "14-Day", "30-Day", "60-Day", "90-Day", "6-Month"]
  const statuses = ["On Track", "Overdue", "Review Needed", "Revised"]
  const alertTypes = ["Demand Spike", "Demand Drop", "Seasonal Anomaly", "Stock Out Risk", "Overstock Warning"]
  const severities = ["Critical", "High", "Medium", "Low"]
  const driversList = [
    "Festival season demand surge", "Economic slowdown impact", "Supply chain disruption recovery",
    "New product launch cannibalization", "Regional market expansion", "Competitive pricing pressure",
    "Weather pattern shift", "Government policy change", "Raw material cost fluctuation",
    "Distribution channel diversification", "Consumer sentiment shift", "Export market growth",
  ]

  // ── Demand Forecasts — 90 records ──
  const demandForecasts: DemandForecast[] = Array.from({ length: 90 }, (_, i) => {
    const seed = i + 1001
    const s = seededRandom
    const product = PRODUCTS[Math.floor(s(seed) * PRODUCTS.length)]
    const category = CATEGORIES[Math.floor(s(seed + 1) * CATEGORIES.length)]
    const warehouse = WAREHOUSES[Math.floor(s(seed + 2) * WAREHOUSES.length)]
    const region = REGIONS[Math.floor(s(seed + 3) * REGIONS.length)]
    const algorithm = ALGORITHMS[Math.floor(s(seed + 4) * ALGORITHMS.length)]
    const season = SEASONS[Math.floor(s(seed + 5) * SEASONS.length)]
    const horizon = horizons[Math.floor(s(seed + 6) * horizons.length)]
    const currentDemand = Math.floor(s(seed + 7) * 4500) + 500
    const growthPcts = [-25, -15, -10, -5, 0, 5, 8, 10, 12, 15, 20, 25, 30, 40]
    const growth = growthPcts[Math.floor(s(seed + 8) * growthPcts.length)]
    const forecastDemand = Math.round(currentDemand * (1 + growth / 100))
    const confidence = Math.floor(s(seed + 9) * 35) + 65
    const mape = Math.floor(s(seed + 10) * 18) + 2
    const stockCover = Math.floor(s(seed + 11) * 45) + 5
    const safetyStock = Math.round(currentDemand * (0.05 + s(seed + 12) * 0.15))
    const reorderPoint = Math.round(forecastDemand * 0.6 + safetyStock)
    const status = statuses[Math.floor(s(seed + 13) * statuses.length)]
    const trendOptions = ["upward", "stable", "downward", "volatile"]
    const trend = trendOptions[Math.floor(s(seed + 14) * 4)]
    const day = Math.floor(s(seed + 15) * 28) + 1
    return {
      id: `DF-${String(i + 1).padStart(3, "0")}`,
      product, category, warehouse, region, currentDemand, forecastDemand,
      forecastGrowth: growth, confidence, algorithm, seasonality: season,
      forecastDate: `2025-${String(Math.floor(s(seed + 16) * 12) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      horizon, mape, status, trend, stockCoverDays: stockCover,
      safetyStock, reorderPoint,
    }
  })

  // ── Seasonal Patterns — 70 records ──
  const seasonalPatterns: SeasonalPattern[] = Array.from({ length: 70 }, (_, i) => {
    const seed = i + 2001
    const s = seededRandom
    const product = PRODUCTS[Math.floor(s(seed) * PRODUCTS.length)]
    const category = CATEGORIES[Math.floor(s(seed + 1) * CATEGORIES.length)]
    const warehouse = WAREHOUSES[Math.floor(s(seed + 2) * WAREHOUSES.length)]
    const season = SEASONS[Math.floor(s(seed + 3) * SEASONS.length)]
    const multPcts = [0.4, 0.6, 0.75, 0.85, 0.9, 1.0, 1.1, 1.2, 1.3, 1.5, 1.7, 2.0, 2.5]
    const demandMultiplier = multPcts[Math.floor(s(seed + 4) * multPcts.length)]
    const historicalVolume = Math.floor(s(seed + 5) * 8000) + 500
    const forecastVolume = Math.round(historicalVolume * demandMultiplier)
    const variance = Math.floor(s(seed + 6) * 40) - 20
    const peakIdx = Math.floor(s(seed + 7) * 12)
    const peakMonth = months[peakIdx]
    const peakVolume = Math.round(forecastVolume * (1.2 + s(seed + 8) * 0.6))
    return {
      id: `SP-${String(i + 1).padStart(3, "0")}`,
      product, category, warehouse, season, demandMultiplier,
      historicalVolume, forecastVolume, variancePct: variance,
      peakMonth, peakVolume,
      trendStrength: Math.round(s(seed + 9) * 100),
      reliability: Math.floor(s(seed + 10) * 30) + 70,
    }
  })

  // ── Scenario Models — 60 records ──
  const scenarioModels: ScenarioModel[] = Array.from({ length: 60 }, (_, i) => {
    const seed = i + 3001
    const s = seededRandom
    const product = PRODUCTS[Math.floor(s(seed) * PRODUCTS.length)]
    const category = CATEGORIES[Math.floor(s(seed + 1) * CATEGORIES.length)]
    const scenario = SCENARIOS[Math.floor(s(seed + 2) * SCENARIOS.length)]
    const probability = Math.floor(s(seed + 3) * 60) + 15
    const demandEstimate = Math.floor(s(seed + 4) * 8000) + 1000
    const revenueImpact = Math.floor((s(seed + 5) - 0.3) * 20000000)
    const costImpact = Math.floor(s(seed + 6) * 5000000)
    const marginPct = Math.floor(s(seed + 7) * 35) + 5
    const riskLevels = ["Low", "Medium", "High", "Very High"]
    const riskLevel = riskLevels[Math.floor(s(seed + 8) * 4)]
    const confidence = Math.floor(s(seed + 9) * 40) + 55
    const day = Math.floor(s(seed + 10) * 28) + 1
    return {
      id: `SM-${String(i + 1).padStart(3, "0")}`,
      product, category, scenario, probability, demandEstimate,
      revenueImpact, costImpact, marginPct, riskLevel,
      keyDrivers: driversList[i % driversList.length],
      confidence,
      modelDate: `2025-${String(Math.floor(s(seed + 11) * 12) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    }
  })

  // ── Accuracy Records — 50 records ──
  const accuracyRecords: AccuracyRecord[] = Array.from({ length: 50 }, (_, i) => {
    const seed = i + 4001
    const s = seededRandom
    const algorithm = ALGORITHMS[Math.floor(s(seed) * ALGORITHMS.length)]
    const product = PRODUCTS[Math.floor(s(seed + 1) * PRODUCTS.length)]
    const category = CATEGORIES[Math.floor(s(seed + 2) * CATEGORIES.length)]
    const mape = Math.floor(s(seed + 3) * 25) + 1
    const rmse = Math.floor(s(seed + 4) * 200) + 10
    const mae = Math.floor(s(seed + 5) * 150) + 5
    const rSquared = Math.floor(s(seed + 6) * 30) + 70
    const wape = Math.floor(s(seed + 7) * 20) + 2
    const day = Math.floor(s(seed + 8) * 28) + 1
    return {
      id: `AC-${String(i + 1).padStart(3, "0")}`,
      algorithm, product, category, mape, rmse, mae, rSquared, wape,
      trainingPeriod: `2024-01 to 2024-12`,
      testPeriod: `2025-01 to 2025-${String(Math.floor(s(seed + 9) * 6) + 1).padStart(2, "0")}`,
      lastEvaluated: `2025-${String(Math.floor(s(seed + 10) * 12) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      active: s(seed + 11) > 0.2,
      recommended: s(seed + 12) > 0.7,
    }
  })

  // ── Alerts — 45 records ──
  const alertRecords: AlertRecord[] = Array.from({ length: 45 }, (_, i) => {
    const seed = i + 5001
    const s = seededRandom
    const product = PRODUCTS[Math.floor(s(seed) * PRODUCTS.length)]
    const warehouse = WAREHOUSES[Math.floor(s(seed + 1) * WAREHOUSES.length)]
    const alertType = alertTypes[i % alertTypes.length]
    const severity = severities[Math.floor(s(seed + 2) * 4)]
    const currentDemand = Math.floor(s(seed + 3) * 4000) + 500
    const deviation = Math.floor((s(seed + 4) - 0.5) * 60)
    const forecastDemand = Math.round(currentDemand * (1 + deviation / 100))
    const day = Math.floor(s(seed + 5) * 28) + 1
    const statusOptions = ["New", "Acknowledged", "In Progress", "Resolved", "Escalated"]
    const status = statusOptions[Math.floor(s(seed + 6) * 5)]
    const actions = [
      "Auto-adjusted reorder point", "Safety stock increased", "Manual review scheduled",
      "Escalated to procurement", "Forecast recalibrated", "Buffer stock activated",
    ]
    return {
      id: `AL-${String(i + 1).padStart(3, "0")}`,
      product, warehouse, alertType, severity,
      message: `${alertType}: ${product} at ${warehouse} — deviation ${Math.abs(deviation)}% from forecast`,
      currentDemand, forecastDemand, deviation,
      triggeredDate: `2025-${String(Math.floor(s(seed + 7) * 12) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      status, actionTaken: actions[i % actions.length],
    }
  })

  // ── Monthly forecast vs actual chart data ──
  const monthlyPerformance = months.map((month, i) => {
    const seed = i + 6001
    const s = seededRandom
    const actual = Math.floor(s(seed) * 3000) + 2000
    const forecast = Math.round(actual * (0.85 + s(seed + 1) * 0.3))
    const upper = Math.round(forecast * 1.15)
    const lower = Math.round(forecast * 0.85)
    return { month, actual, forecast, upper, lower }
  })

  // ── Algorithm accuracy summary ──
  const algoAccuracy = ALGORITHMS.map((algo) => {
    const records = accuracyRecords.filter((r) => r.algorithm === algo)
    const count = records.length || 1
    return {
      algorithm: algo,
      avgMape: Math.round(records.reduce((a, r) => a + r.mape, 0) / count),
      avgRMSE: Math.round(records.reduce((a, r) => a + r.rmse, 0) / count),
      avgRSquared: Math.round(records.reduce((a, r) => a + r.rSquared, 0) / count),
      count: records.length,
    }
  })

  return {
    demandForecasts, seasonalPatterns, scenarioModels, accuracyRecords, alertRecords,
    monthlyPerformance, algoAccuracy, months, PRODUCTS, CATEGORIES, WAREHOUSES, REGIONS,
    SEASONS, ALGORITHMS, horizons, statuses, SCENARIOS, ACCURACY_METRICS, alertTypes, severities,
  }
}

// ─── Helper Components ─────────────────────────────────────────────────────
function FieldGrid({ fields }: { fields: { label: string; value: string }[] }) {
  return (
    <div className="pdf-drawer-field-grid">
      {fields.map((f, i) => (
        <div key={i} className="pdf-drawer-field">
          <span className="pdf-drawer-field-label">{f.label}</span>
          <span className="pdf-drawer-field-value">{f.value}</span>
        </div>
      ))}
    </div>
  )
}

function MetricsRow({ metrics }: { metrics: { label: string; value: string; sub: string; color: string }[] }) {
  return (
    <div className="pdf-drawer-metrics-row">
      {metrics.map((m, i) => (
        <div key={i} className="pdf-drawer-metric-card" style={{ borderLeftColor: m.color }}>
          <span className="pdf-drawer-metric-label">{m.label}</span>
          <span className="pdf-drawer-metric-value">{m.value}</span>
          <span className="pdf-drawer-metric-sub">{m.sub}</span>
        </div>
      ))}
    </div>
  )
}

function ConfidenceBand({ value, size = 80 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)
  const color = value >= 85 ? "#22c55e" : value >= 70 ? "#6366f1" : value >= 55 ? "#f59e0b" : "#f97316"
  return (
    <div className="pdf-confidence-ring-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <span className="pdf-confidence-ring-text" style={{ color }}>{value}%</span>
    </div>
  )
}

function TrendIndicator({ trend }: { trend: string }) {
  if (trend === "upward") return <span className="pdf-trend-indicator pdf-trend-up"><ArrowUpRight className="h-3 w-3" /> Upward</span>
  if (trend === "downward") return <span className="pdf-trend-indicator pdf-trend-down"><ArrowDownRight className="h-3 w-3" /> Downward</span>
  if (trend === "volatile") return <span className="pdf-trend-indicator pdf-trend-volatile"><Activity className="h-3 w-3" /> Volatile</span>
  return <span className="pdf-trend-indicator pdf-trend-stable">— Stable</span>
}

function formatINR(amount: number): string {
  if (Math.abs(amount) >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  return `₹${Math.abs(amount).toLocaleString("en-IN")}`
}

function sortBy(arr: any[], key: string, dir: "asc" | "desc"): any[] {
  return [...arr].sort((a, b) => {
    const va = a[key]
    const vb = b[key]
    if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va
    return dir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
  })
}

function SeverityDot({ severity }: { severity: string }) {
  const colors: Record<string, string> = { Critical: "#dc2626", High: "#f97316", Medium: "#f59e0b", Low: "#22c55e" }
  return <span className="pdf-severity-dot" style={{ backgroundColor: colors[severity] || "#94a3b8" }} />
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function PredictiveDemandForecastingView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterWarehouse, setFilterWarehouse] = useState("all")
  const [filterAlgorithm, setFilterAlgorithm] = useState("all")
  const [filterScenario, setFilterScenario] = useState("all")
  const [sortKey, setSortKey] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const toast = useToast()

  // ── Tab 0: Dashboard ──────────────────────────────────────────────────
  const dashboardKPIs = [
    { label: "Active Forecasts", value: data.demandForecasts.length, sub: `${data.demandForecasts.filter((f) => f.status === "On Track").length} on track`, color: COLORS.teal, icon: ChartSpline },
    { label: "Avg Accuracy (MAPE)", value: `${Math.round(data.accuracyRecords.reduce((a, r) => a + r.mape, 0) / data.accuracyRecords.length)}%`, sub: "Lower is better", color: COLORS.emerald, icon: Target },
    { label: "Forecast Confidence", value: `${Math.round(data.demandForecasts.reduce((a, f) => a + f.confidence, 0) / data.demandForecasts.length)}%`, sub: "Average across models", color: COLORS.indigo, icon: Gauge },
    { label: "Active Alerts", value: data.alertRecords.filter((a) => a.status === "New" || a.status === "Acknowledged").length, sub: `${data.alertRecords.filter((a) => a.severity === "Critical").length} critical`, color: COLORS.rose, icon: AlertTriangle },
    { label: "Scenario Models", value: data.scenarioModels.length, sub: `${data.SCENARIOS.length} scenarios`, color: COLORS.violet, icon: Brain },
    { label: "Algorithms Active", value: data.accuracyRecords.filter((a) => a.active).length, sub: `${ALGORITHMS.length} total models`, color: COLORS.sky, icon: Sparkles },
  ]

  // Forecast vs Actual with confidence bands
  const forecastBandData = data.monthlyPerformance

  // Algorithm comparison radar
  const algoRadar = ALGORITHMS.slice(0, 6).map((algo) => {
    const recs = data.accuracyRecords.filter((r) => r.algorithm === algo)
    const cnt = recs.length || 1
    return {
      algorithm: algo,
      accuracy: 100 - Math.round(recs.reduce((a, r) => a + r.mape, 0) / cnt),
      stability: Math.round(recs.reduce((a, r) => a + r.rSquared, 0) / cnt),
      speed: Math.round(90 - recs.reduce((a, r) => a + r.rmse / 2, 0) / cnt),
      reliability: Math.round(recs.reduce((a, r) => a + r.wape < 15 ? 100 : 50, 0) / cnt),
    }
  })

  // Category demand distribution
  const categoryDemand = CATEGORIES.map((cat) => ({
    category: cat,
    demand: data.demandForecasts.filter((f) => f.category === cat).reduce((a, f) => a + f.forecastDemand, 0),
    count: data.demandForecasts.filter((f) => f.category === cat).length,
  })).sort((a, b) => b.demand - a.demand)

  // Forecast growth distribution
  const growthBuckets = [
    { range: "> 20%", count: data.demandForecasts.filter((f) => f.forecastGrowth > 20).length, color: "#22c55e" },
    { range: "5-20%", count: data.demandForecasts.filter((f) => f.forecastGrowth >= 5 && f.forecastGrowth <= 20).length, color: "#6366f1" },
    { range: "-5 to 5%", count: data.demandForecasts.filter((f) => f.forecastGrowth > -5 && f.forecastGrowth < 5).length, color: "#f59e0b" },
    { range: "< -5%", count: data.demandForecasts.filter((f) => f.forecastGrowth <= -5).length, color: "#e11d48" },
  ]

  // Warehouse forecast accuracy
  const warehouseAccuracy = WAREHOUSES.map((wh) => {
    const recs = data.demandForecasts.filter((f) => f.warehouse === wh)
    const cnt = recs.length || 1
    return {
      warehouse: wh.split(" ")[0],
      accuracy: 100 - Math.round(recs.reduce((a, r) => a + r.mape, 0) / cnt),
      confidence: Math.round(recs.reduce((a, r) => a + r.confidence, 0) / cnt),
      forecastCount: recs.length,
    }
  })

  // Alert severity distribution
  const alertSeverityDist = data.severities.map((sev: string) => ({
    name: sev,
    value: data.alertRecords.filter((a) => a.severity === sev).length,
  }))

  // ── Tab 1: Forecasts ─────────────────────────────────────────────────
  const filteredForecasts = useMemo(() => {
    let items = data.demandForecasts
    if (searchTerm) items = items.filter((f) => f.product.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterCategory !== "all") items = items.filter((f) => f.category === filterCategory)
    if (filterWarehouse !== "all") items = items.filter((f) => f.warehouse === filterWarehouse)
    if (filterAlgorithm !== "all") items = items.filter((f) => f.algorithm === filterAlgorithm)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterCategory, filterWarehouse, filterAlgorithm, sortKey, sortDir])

  // ── Tab 2: Seasonal Analysis ──────────────────────────────────────────
  const filteredSeasonal = useMemo(() => {
    let items = data.seasonalPatterns
    if (searchTerm) items = items.filter((sp) => sp.product.toLowerCase().includes(searchTerm.toLowerCase()) || sp.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterCategory !== "all") items = items.filter((sp) => sp.category === filterCategory)
    if (filterWarehouse !== "all") items = items.filter((sp) => sp.warehouse === filterWarehouse)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterCategory, filterWarehouse, sortKey, sortDir])

  // ── Tab 3: Scenario Modeling ─────────────────────────────────────────
  const filteredScenarios = useMemo(() => {
    let items = data.scenarioModels
    if (searchTerm) items = items.filter((sm) => sm.product.toLowerCase().includes(searchTerm.toLowerCase()) || sm.keyDrivers.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterCategory !== "all") items = items.filter((sm) => sm.category === filterCategory)
    if (filterScenario !== "all") items = items.filter((sm) => sm.scenario === filterScenario)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterCategory, filterScenario, sortKey, sortDir])

  // ── Tab 4: Model Accuracy ────────────────────────────────────────────
  const filteredAccuracy = useMemo(() => {
    let items = data.accuracyRecords
    if (searchTerm) items = items.filter((ac) => ac.algorithm.toLowerCase().includes(searchTerm.toLowerCase()) || ac.product.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterAlgorithm !== "all") items = items.filter((ac) => ac.algorithm === filterAlgorithm)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterAlgorithm, sortKey, sortDir])

  // ── Tab 5: Alerts ────────────────────────────────────────────────────
  const filteredAlerts = useMemo(() => {
    let items = data.alertRecords
    if (searchTerm) items = items.filter((al) => al.product.toLowerCase().includes(searchTerm.toLowerCase()) || al.message.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterWarehouse !== "all") items = items.filter((al) => al.warehouse === filterWarehouse)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterWarehouse, sortKey, sortDir])

  // ─── Drawer Handlers ────────────────────────────────────────────────────
  const openDrawer = (type: string, item: any) => {
    setDrawerType(type)
    setDrawerData(item)
    setDrawerOpen(true)
  }

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <TableHead className="cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">{label}{sortKey === field && <span className="pdf-sort-indicator">{sortDir === "asc" ? "▲" : "▼"}</span>}</div>
    </TableHead>
  )

  // ─── Render ────────────────────────────────────────────────────────────
  const tabs = [
    // Tab 0 — Dashboard
    {
      title: "Forecast Dashboard",
      content: (
        <div className="pdf-tab-content">
          {/* KPI Grid */}
          <div className="pdf-kpi-grid">
            {dashboardKPIs.map((kpi, i) => (
              <div key={i} className={`pdf-kpi-card pdf-kpi-${i}`}>
                <div className="pdf-kpi-icon-wrap" style={{ backgroundColor: kpi.color + "18" }}>
                  <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
                </div>
                <div className="pdf-kpi-info">
                  <span className="pdf-kpi-label">{kpi.label}</span>
                  <span className="pdf-kpi-value">{kpi.value}</span>
                  <span className="pdf-kpi-sub">{kpi.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pdf-chart-grid">
            {/* Forecast vs Actual with Confidence Band */}
            <Card className="pdf-chart-card pdf-chart-full">
              <CardHeader className="pdf-chart-header">
                <CardTitle className="pdf-chart-title">Forecast vs Actual — 12 Month Trend with 95% Confidence Band</CardTitle>
                <CardDescription>Blue area = confidence band, solid line = forecast, dots = actual</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={forecastBandData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="upper" fill={COLORS.indigo + "15"} stroke="none" name="Upper Bound" />
                    <Area type="monotone" dataKey="lower" fill="transparent" stroke="none" name="Lower Bound" />
                    <Area type="monotone" dataKey="forecast" fill={COLORS.indigo + "30"} stroke={COLORS.indigo} name="Forecast" strokeWidth={2} />
                    <Line type="monotone" dataKey="actual" stroke={COLORS.rose} name="Actual" strokeWidth={2} dot={{ r: 4, fill: COLORS.rose }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Algorithm Comparison Radar */}
            <Card className="pdf-chart-card">
              <CardHeader className="pdf-chart-header">
                <CardTitle className="pdf-chart-title">Algorithm Performance Radar</CardTitle>
                <CardDescription>Multi-dimensional accuracy comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={algoRadar}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="algorithm" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar name="Accuracy" dataKey="accuracy" stroke={COLORS.indigo} fill={COLORS.indigo} fillOpacity={0.2} strokeWidth={2} />
                    <Radar name="Stability" dataKey="stability" stroke={COLORS.emerald} fill={COLORS.emerald} fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" />
                    <Radar name="Speed" dataKey="speed" stroke={COLORS.amber} fill={COLORS.amber} fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="2 2" />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Demand Bar */}
            <Card className="pdf-chart-card">
              <CardHeader className="pdf-chart-header">
                <CardTitle className="pdf-chart-title">Demand by Product Category</CardTitle>
                <CardDescription>Forecasted demand volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={categoryDemand}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="demand" name="Forecasted Demand" radius={[6, 6, 0, 0]} barSize={28}>
                      {[COLORS.teal, COLORS.indigo, COLORS.rose, COLORS.amber, COLORS.emerald, COLORS.sky, COLORS.violet, COLORS.orange, COLORS.pink, COLORS.lime].map((c, i) => (
                        <Cell key={i} fill={c} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Forecast Growth Distribution */}
            <Card className="pdf-chart-card">
              <CardHeader className="pdf-chart-header">
                <CardTitle className="pdf-chart-title">Growth Forecast Distribution</CardTitle>
                <CardDescription>Number of SKUs by growth range</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={growthBuckets} cx="50%" cy="50%" outerRadius={100} innerRadius={55} dataKey="count" nameKey="range" label={({ range, count }: any) => `${range}: ${count}`} labelLine={{ strokeWidth: 1 }}>
                      {growthBuckets.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Warehouse Forecast Accuracy */}
            <Card className="pdf-chart-card">
              <CardHeader className="pdf-chart-header">
                <CardTitle className="pdf-chart-title">Warehouse Forecast Accuracy</CardTitle>
                <CardDescription>Accuracy % and confidence by warehouse</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={warehouseAccuracy}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="warehouse" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[60, 100]} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="accuracy" fill={COLORS.indigo} name="Accuracy %" radius={[4, 4, 0, 0]} barSize={24} />
                    <Line yAxisId="right" type="monotone" dataKey="confidence" stroke={COLORS.amber} name="Confidence %" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alert Severity Pie */}
            <Card className="pdf-chart-card">
              <CardHeader className="pdf-chart-header">
                <CardTitle className="pdf-chart-title">Alert Severity Distribution</CardTitle>
                <CardDescription>Current active forecast alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={alertSeverityDist} cx="50%" cy="50%" outerRadius={100} innerRadius={55} dataKey="value" nameKey="name" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                      {[COLORS.rose, COLORS.orange, COLORS.amber, COLORS.emerald].map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },

    // Tab 1 — Demand Forecasts
    {
      title: "Demand Forecasts",
      content: (
        <div className="pdf-tab-content">
          <div className="pdf-toolbar">
            <div className="pdf-search-wrap">
              <Search className="h-4 w-4 pdf-search-icon" />
              <Input placeholder="Search by product, ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pdf-search-input" />
            </div>
            <div className="pdf-filter-row">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="pdf-select-trigger"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Categories</SelectItem>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                <SelectTrigger className="pdf-select-trigger"><SelectValue placeholder="Warehouse" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Warehouses</SelectItem>{WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={filterAlgorithm} onValueChange={setFilterAlgorithm}>
                <SelectTrigger className="pdf-select-trigger"><SelectValue placeholder="Algorithm" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Algorithms</SelectItem>{ALGORITHMS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredForecasts, "demand-forecasts")} className="btn-outline-animate pdf-export-btn">
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
            </div>
          </div>
          <div className="pdf-table-wrap">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" />
                  <SortHeader label="Product" field="product" />
                  <TableHead>Category</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <SortHeader label="Algorithm" field="algorithm" />
                  <SortHeader label="Growth" field="forecastGrowth" />
                  <SortHeader label="Confidence" field="confidence" />
                  <TableHead>Trend</TableHead>
                  <SortHeader label="Stock Cover" field="stockCoverDays" />
                  <TableHead className="pdf-action-col">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForecasts.map((f) => (
                  <TableRow key={f.id} className="pdf-table-row">
                    <TableCell className="font-mono text-xs">{f.id}</TableCell>
                    <TableCell className="font-medium text-sm max-w-[180px] truncate">{f.product}</TableCell>
                    <TableCell><Badge variant="outline" className="badge-interactive text-xs">{f.category}</Badge></TableCell>
                    <TableCell className="text-xs">{f.warehouse}</TableCell>
                    <TableCell><span className="pdf-algo-badge" style={{ backgroundColor: (ALGO_COLORS[f.algorithm] || "#6366f1") + "18", color: ALGO_COLORS[f.algorithm] || "#6366f1" }}>{f.algorithm}</span></TableCell>
                    <TableCell>
                      <span className={`pdf-growth-badge ${f.forecastGrowth > 0 ? "pdf-growth-pos" : f.forecastGrowth < 0 ? "pdf-growth-neg" : "pdf-growth-zero"}`}>
                        {f.forecastGrowth > 0 ? <ArrowUpRight className="h-3 w-3" /> : f.forecastGrowth < 0 ? <ArrowDownRight className="h-3 w-3" /> : null}
                        {f.forecastGrowth > 0 ? "+" : ""}{f.forecastGrowth}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="pdf-confidence-cell">
                        <div className="pdf-confidence-bar-bg">
                          <div className="pdf-confidence-bar-fill" style={{ width: `${f.confidence}%`, backgroundColor: f.confidence >= 85 ? "#22c55e" : f.confidence >= 70 ? "#6366f1" : "#f59e0b" }} />
                        </div>
                        <span className="pdf-confidence-val">{f.confidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell><TrendIndicator trend={f.trend} /></TableCell>
                    <TableCell>
                      <div className="pdf-stock-cover">
                        <span className={f.stockCoverDays < 15 ? "text-red-600 font-bold" : f.stockCoverDays < 30 ? "text-amber-600 font-semibold" : "text-emerald-600"}>{f.stockCoverDays}d</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="pdf-view-btn" onClick={() => openDrawer("forecast", f)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="pdf-table-footer">Showing {filteredForecasts.length} of {data.demandForecasts.length} forecasts</div>
        </div>
      ),
    },

    // Tab 2 — Seasonal Analysis
    {
      title: "Seasonal Analysis",
      content: (
        <div className="pdf-tab-content">
          <div className="pdf-toolbar">
            <div className="pdf-search-wrap">
              <Search className="h-4 w-4 pdf-search-icon" />
              <Input placeholder="Search by product, ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pdf-search-input" />
            </div>
            <div className="pdf-filter-row">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="pdf-select-trigger"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Categories</SelectItem>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                <SelectTrigger className="pdf-select-trigger"><SelectValue placeholder="Warehouse" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Warehouses</SelectItem>{WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredSeasonal, "seasonal-patterns")} className="btn-outline-animate pdf-export-btn">
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
            </div>
          </div>
          <div className="pdf-table-wrap">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" />
                  <SortHeader label="Product" field="product" />
                  <TableHead>Season</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <SortHeader label="Multiplier" field="demandMultiplier" />
                  <SortHeader label="Historical" field="historicalVolume" />
                  <SortHeader label="Forecast" field="forecastVolume" />
                  <TableHead>Variance</TableHead>
                  <TableHead>Peak Month</TableHead>
                  <TableHead className="pdf-action-col">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSeasonal.map((sp) => (
                  <TableRow key={sp.id} className="pdf-table-row">
                    <TableCell className="font-mono text-xs">{sp.id}</TableCell>
                    <TableCell className="font-medium text-sm max-w-[160px] truncate">{sp.product}</TableCell>
                    <TableCell>
                      <span className="pdf-season-badge">{sp.season}</span>
                    </TableCell>
                    <TableCell className="text-xs">{sp.warehouse}</TableCell>
                    <TableCell>
                      <div className="pdf-multiplier-display">
                        <span className={`pdf-multiplier-val ${sp.demandMultiplier >= 1.3 ? "text-rose-600" : sp.demandMultiplier >= 1.0 ? "text-amber-600" : "text-sky-600"}`}>
                          {sp.demandMultiplier.toFixed(1)}x
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{sp.historicalVolume.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold text-sm">{sp.forecastVolume.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`pdf-variance-badge ${sp.variancePct > 0 ? "pdf-var-up" : sp.variancePct < 0 ? "pdf-var-down" : "pdf-var-zero"}`}>
                        {sp.variancePct > 0 ? "+" : ""}{sp.variancePct}%
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{sp.peakMonth}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="pdf-view-btn" onClick={() => openDrawer("seasonal", sp)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="pdf-table-footer">Showing {filteredSeasonal.length} of {data.seasonalPatterns.length} patterns</div>
        </div>
      ),
    },

    // Tab 3 — Scenario Modeling
    {
      title: "Scenario Models",
      content: (
        <div className="pdf-tab-content">
          <div className="pdf-toolbar">
            <div className="pdf-search-wrap">
              <Search className="h-4 w-4 pdf-search-icon" />
              <Input placeholder="Search by product, driver..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pdf-search-input" />
            </div>
            <div className="pdf-filter-row">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="pdf-select-trigger"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Categories</SelectItem>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={filterScenario} onValueChange={setFilterScenario}>
                <SelectTrigger className="pdf-select-trigger"><SelectValue placeholder="Scenario" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Scenarios</SelectItem>{SCENARIOS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredScenarios, "scenario-models")} className="btn-outline-animate pdf-export-btn">
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
            </div>
          </div>
          <div className="pdf-table-wrap">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" />
                  <SortHeader label="Product" field="product" />
                  <TableHead>Scenario</TableHead>
                  <TableHead>Key Driver</TableHead>
                  <SortHeader label="Probability" field="probability" />
                  <SortHeader label="Demand Est." field="demandEstimate" />
                  <TableHead>Revenue Impact</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="pdf-action-col">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScenarios.map((sm) => (
                  <TableRow key={sm.id} className="pdf-table-row">
                    <TableCell className="font-mono text-xs">{sm.id}</TableCell>
                    <TableCell className="font-medium text-sm max-w-[160px] truncate">{sm.product}</TableCell>
                    <TableCell>
                      <span className={`pdf-scenario-badge ${sm.scenario === "Best Case" ? "pdf-sc-best" : sm.scenario === "Worst Case" ? "pdf-sc-worst" : sm.scenario === "Custom Growth" ? "pdf-sc-custom" : "pdf-sc-base"}`}>
                        {sm.scenario}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs max-w-[160px] truncate">{sm.keyDrivers}</TableCell>
                    <TableCell>
                      <div className="pdf-probability-cell">
                        <div className="pdf-probability-bar-bg">
                          <div className="pdf-probability-bar-fill" style={{ width: `${sm.probability}%`, backgroundColor: sm.probability >= 70 ? "#22c55e" : sm.probability >= 40 ? "#6366f1" : "#f59e0b" }} />
                        </div>
                        <span className="pdf-probability-val">{sm.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{sm.demandEstimate.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={sm.revenueImpact >= 0 ? "text-emerald-600 font-medium text-sm" : "text-rose-600 font-medium text-sm"}>
                        {formatINR(sm.revenueImpact)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{sm.marginPct}%</TableCell>
                    <TableCell>
                      <span className={`pdf-risk-badge ${sm.riskLevel === "Low" ? "pdf-risk-low" : sm.riskLevel === "High" ? "pdf-risk-high" : sm.riskLevel === "Very High" ? "pdf-risk-vhigh" : "pdf-risk-med"}`}>
                        {sm.riskLevel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="pdf-view-btn" onClick={() => openDrawer("scenario", sm)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="pdf-table-footer">Showing {filteredScenarios.length} of {data.scenarioModels.length} models</div>
        </div>
      ),
    },

    // Tab 4 — Model Accuracy
    {
      title: "Model Accuracy",
      content: (
        <div className="pdf-tab-content">
          <div className="pdf-toolbar">
            <div className="pdf-search-wrap">
              <Search className="h-4 w-4 pdf-search-icon" />
              <Input placeholder="Search by algorithm, product..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pdf-search-input" />
            </div>
            <div className="pdf-filter-row">
              <Select value={filterAlgorithm} onValueChange={setFilterAlgorithm}>
                <SelectTrigger className="pdf-select-trigger"><SelectValue placeholder="Algorithm" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Algorithms</SelectItem>{ALGORITHMS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredAccuracy, "model-accuracy")} className="btn-outline-animate pdf-export-btn">
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
            </div>
          </div>
          <div className="pdf-table-wrap">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" />
                  <TableHead>Algorithm</TableHead>
                  <TableHead>Product</TableHead>
                  <SortHeader label="MAPE" field="mape" />
                  <SortHeader label="RMSE" field="rmse" />
                  <SortHeader label="MAE" field="mae" />
                  <SortHeader label="R²" field="rSquared" />
                  <TableHead>Status</TableHead>
                  <TableHead>Recommended</TableHead>
                  <TableHead className="pdf-action-col">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccuracy.map((ac) => (
                  <TableRow key={ac.id} className="pdf-table-row">
                    <TableCell className="font-mono text-xs">{ac.id}</TableCell>
                    <TableCell>
                      <span className="pdf-algo-badge" style={{ backgroundColor: (ALGO_COLORS[ac.algorithm] || "#6366f1") + "18", color: ALGO_COLORS[ac.algorithm] || "#6366f1" }}>{ac.algorithm}</span>
                    </TableCell>
                    <TableCell className="text-sm max-w-[140px] truncate">{ac.product}</TableCell>
                    <TableCell>
                      <span className={`pdf-metric-val ${ac.mape <= 5 ? "pdf-metric-excellent" : ac.mape <= 10 ? "pdf-metric-good" : ac.mape <= 15 ? "pdf-metric-fair" : "pdf-metric-poor"}`}>
                        {ac.mape}%
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{ac.rmse}</TableCell>
                    <TableCell className="text-sm">{ac.mae}</TableCell>
                    <TableCell>
                      <div className="pdf-rsquared-cell">
                        <div className="pdf-rsquared-bar-bg">
                          <div className="pdf-rsquared-bar-fill" style={{ width: `${ac.rSquared}%`, backgroundColor: ac.rSquared >= 85 ? "#22c55e" : ac.rSquared >= 70 ? "#6366f1" : "#f59e0b" }} />
                        </div>
                        <span className="pdf-rsquared-val">{ac.rSquared}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ac.active ? (
                        <span className="pdf-status-active"><CheckCircle2 className="h-3 w-3" /> Active</span>
                      ) : (
                        <span className="pdf-status-inactive"><XCircle className="h-3 w-3" /> Inactive</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {ac.recommended ? (
                        <span className="pdf-recommended-badge"><Sparkles className="h-3 w-3" /> Recommended</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="pdf-view-btn" onClick={() => openDrawer("accuracy", ac)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="pdf-table-footer">Showing {filteredAccuracy.length} of {data.accuracyRecords.length} records</div>
        </div>
      ),
    },

    // Tab 5 — Alerts
    {
      title: "Forecast Alerts",
      content: (
        <div className="pdf-tab-content">
          <div className="pdf-toolbar">
            <div className="pdf-search-wrap">
              <Search className="h-4 w-4 pdf-search-icon" />
              <Input placeholder="Search by product, message..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pdf-search-input" />
            </div>
            <div className="pdf-filter-row">
              <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                <SelectTrigger className="pdf-select-trigger"><SelectValue placeholder="Warehouse" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Warehouses</SelectItem>{WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredAlerts, "forecast-alerts")} className="btn-outline-animate pdf-export-btn">
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
            </div>
          </div>

          {/* Alert cards */}
          <div className="pdf-alert-grid">
            {filteredAlerts.map((al) => (
              <Card key={al.id} className="pdf-alert-card" onClick={() => openDrawer("alert", al)}>
                <CardHeader className="pdf-alert-header">
                  <div className="pdf-alert-header-top">
                    <div className="flex items-center gap-2">
                      <SeverityDot severity={al.severity} />
                      <CardTitle className="pdf-alert-title">{al.alertType}</CardTitle>
                    </div>
                    <Badge variant="outline" className="badge-interactive pdf-alert-id-badge">{al.id}</Badge>
                  </div>
                  <CardDescription className="pdf-alert-message">{al.message}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pdf-alert-body">
                    <div className="pdf-alert-info-row">
                      <span className="pdf-alert-label">Product:</span>
                      <span className="pdf-alert-value">{al.product}</span>
                    </div>
                    <div className="pdf-alert-info-row">
                      <span className="pdf-alert-label">Warehouse:</span>
                      <span className="pdf-alert-value">{al.warehouse}</span>
                    </div>
                    <div className="pdf-alert-info-row">
                      <span className="pdf-alert-label">Deviation:</span>
                      <span className={`pdf-alert-value ${Math.abs(al.deviation) > 30 ? "text-rose-600 font-bold" : "text-amber-600"}`}>{al.deviation > 0 ? "+" : ""}{al.deviation}%</span>
                    </div>
                    <div className="pdf-alert-info-row">
                      <span className="pdf-alert-label">Current Demand:</span>
                      <span className="pdf-alert-value">{al.currentDemand.toLocaleString()}</span>
                    </div>
                    <div className="pdf-alert-info-row">
                      <span className="pdf-alert-label">Forecast:</span>
                      <span className="pdf-alert-value">{al.forecastDemand.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pdf-alert-footer">
                    <span className={`pdf-alert-status-badge ${al.status === "Resolved" ? "pdf-alert-done" : al.status === "Escalated" ? "pdf-alert-escalated" : al.status === "In Progress" ? "pdf-alert-progress" : "pdf-alert-new"}`}>
                      {al.status}
                    </span>
                    <span className="pdf-alert-action-text">{al.actionTaken}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="pdf-table-footer">Showing {filteredAlerts.length} of {data.alertRecords.length} alerts</div>
        </div>
      ),
    },
  ]

  // ─── Drawer Content ────────────────────────────────────────────────────
  const renderDrawer = () => {
    if (!drawerData) return null

    if (drawerType === "forecast") {
      const f = drawerData
      return (
        <>
          <SheetHeader className="pdf-drawer-header">
            <SheetTitle className="pdf-drawer-title">
              <ChartSpline className="h-5 w-5 text-teal-500" /> Forecast: {f.id}
            </SheetTitle>
            <SheetDescription>{f.product}</SheetDescription>
          </SheetHeader>
          <div className="pdf-drawer-body">
            <div className="pdf-drawer-visual-row">
              <ConfidenceBand value={f.confidence} />
              <div className="pdf-drawer-visual-info">
                <span className={`pdf-growth-badge-lg ${f.forecastGrowth > 0 ? "pdf-growth-pos" : f.forecastGrowth < 0 ? "pdf-growth-neg" : "pdf-growth-zero"}`}>
                  {f.forecastGrowth > 0 ? <ArrowUpRight className="h-4 w-4" /> : f.forecastGrowth < 0 ? <ArrowDownRight className="h-4 w-4" /> : null}
                  {f.forecastGrowth > 0 ? "+" : ""}{f.forecastGrowth}%
                </span>
                <TrendIndicator trend={f.trend} />
                <span className={`pdf-status-text ${f.status === "On Track" ? "text-emerald-500" : f.status === "Revised" ? "text-violet-500" : "text-amber-500"}`}>{f.status}</span>
              </div>
            </div>
            <MetricsRow metrics={[
              { label: "Current Demand", value: f.currentDemand.toLocaleString(), sub: "Current period", color: COLORS.teal },
              { label: "Forecasted Demand", value: f.forecastDemand.toLocaleString(), sub: `Growth: ${f.forecastGrowth}%`, color: COLORS.indigo },
              { label: "Stock Cover", value: `${f.stockCoverDays} days`, sub: `Safety: ${f.safetyStock.toLocaleString()}`, color: f.stockCoverDays < 15 ? COLORS.rose : COLORS.amber },
            ]} />
            <FieldGrid fields={[
              { label: "Product", value: f.product },
              { label: "Category", value: f.category },
              { label: "Warehouse", value: f.warehouse },
              { label: "Region", value: f.region },
              { label: "Algorithm", value: f.algorithm },
              { label: "Seasonality", value: f.seasonality },
              { label: "Horizon", value: f.horizon },
              { label: "MAPE", value: `${f.mape}%` },
              { label: "Reorder Point", value: f.reorderPoint.toLocaleString() },
              { label: "Forecast Date", value: f.forecastDate },
            ]} />
          </div>
          <SheetFooter className="pdf-drawer-footer">
            <Button size="sm" variant="outline"><RefreshCw className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Recalibrate</Button>
            <Button size="sm" variant="outline"><Brain className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Switch Algorithm</Button>
            <Button size="sm" className="pdf-drawer-primary-btn"><Zap className="h-3.5 w-3.5 mr-1" /> Run Scenario</Button>
          </SheetFooter>
        </>
      )
    }

    if (drawerType === "seasonal") {
      const sp = drawerData
      return (
        <>
          <SheetHeader className="pdf-drawer-header">
            <SheetTitle className="pdf-drawer-title">
              <ThermometerSun className="h-5 w-5 text-amber-500" /> Seasonal: {sp.id}
            </SheetTitle>
            <SheetDescription>{sp.product} — {sp.season}</SheetDescription>
          </SheetHeader>
          <div className="pdf-drawer-body">
            <div className="pdf-drawer-visual-row">
              <ConfidenceBand value={sp.reliability} />
              <div className="pdf-drawer-visual-info">
                <span className={`pdf-multiplier-display-lg ${sp.demandMultiplier >= 1.3 ? "text-rose-600" : sp.demandMultiplier >= 1.0 ? "text-amber-600" : "text-sky-600"}`}>
                  {sp.demandMultiplier.toFixed(1)}x multiplier
                </span>
                <span className="pdf-season-badge-lg">{sp.season}</span>
              </div>
            </div>
            <MetricsRow metrics={[
              { label: "Historical Volume", value: sp.historicalVolume.toLocaleString(), sub: "Past period", color: COLORS.sky },
              { label: "Forecast Volume", value: sp.forecastVolume.toLocaleString(), sub: `Peak: ${sp.peakMonth}`, color: COLORS.indigo },
              { label: "Trend Strength", value: `${sp.trendStrength}%`, sub: `Variance: ${sp.variancePct > 0 ? "+" : ""}${sp.variancePct}%`, color: COLORS.amber },
            ]} />
            <FieldGrid fields={[
              { label: "Product", value: sp.product },
              { label: "Category", value: sp.category },
              { label: "Warehouse", value: sp.warehouse },
              { label: "Season", value: sp.season },
              { label: "Demand Multiplier", value: `${sp.demandMultiplier.toFixed(1)}x` },
              { label: "Peak Month", value: sp.peakMonth },
              { label: "Peak Volume", value: sp.peakVolume.toLocaleString() },
              { label: "Reliability", value: `${sp.reliability}%` },
            ]} />
          </div>
          <SheetFooter className="pdf-drawer-footer">
            <Button size="sm" variant="outline"><RefreshCw className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Recalculate</Button>
            <Button size="sm" variant="outline"><Package className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Adjust Safety Stock</Button>
            <Button size="sm" className="pdf-drawer-primary-btn"><Target className="h-3.5 w-3.5 mr-1" /> Set Targets</Button>
          </SheetFooter>
        </>
      )
    }

    if (drawerType === "scenario") {
      const sm = drawerData
      return (
        <>
          <SheetHeader className="pdf-drawer-header">
            <SheetTitle className="pdf-drawer-title">
              <Brain className="h-5 w-5 text-violet-500" /> Scenario: {sm.id}
            </SheetTitle>
            <SheetDescription>{sm.product} — {sm.scenario}</SheetDescription>
          </SheetHeader>
          <div className="pdf-drawer-body">
            <div className="pdf-drawer-visual-row">
              <ConfidenceBand value={sm.confidence} />
              <div className="pdf-drawer-visual-info">
                <span className={`pdf-scenario-badge-lg ${sm.scenario === "Best Case" ? "pdf-sc-best" : sm.scenario === "Worst Case" ? "pdf-sc-worst" : "pdf-sc-base"}`}>
                  {sm.scenario}
                </span>
                <span className={`pdf-risk-badge ${sm.riskLevel === "Low" ? "pdf-risk-low" : sm.riskLevel === "High" ? "pdf-risk-high" : "pdf-risk-med"}`}>
                  {sm.riskLevel}
                </span>
              </div>
            </div>
            <div className="pdf-drawer-desc-box">
              <p><strong>Key Driver:</strong> {sm.keyDrivers}</p>
            </div>
            <MetricsRow metrics={[
              { label: "Demand Estimate", value: sm.demandEstimate.toLocaleString(), sub: `Probability: ${sm.probability}%`, color: COLORS.indigo },
              { label: "Revenue Impact", value: formatINR(sm.revenueImpact), sub: sm.revenueImpact >= 0 ? "Positive" : "Negative", color: sm.revenueImpact >= 0 ? COLORS.emerald : COLORS.rose },
              { label: "Margin", value: `${sm.marginPct}%`, sub: `Cost: ${formatINR(sm.costImpact)}`, color: COLORS.amber },
            ]} />
            <FieldGrid fields={[
              { label: "Product", value: sm.product },
              { label: "Category", value: sm.category },
              { label: "Scenario", value: sm.scenario },
              { label: "Probability", value: `${sm.probability}%` },
              { label: "Cost Impact", value: formatINR(sm.costImpact) },
              { label: "Risk Level", value: sm.riskLevel },
              { label: "Confidence", value: `${sm.confidence}%` },
              { label: "Model Date", value: sm.modelDate },
            ]} />
          </div>
          <SheetFooter className="pdf-drawer-footer">
            <Button size="sm" variant="outline"><RefreshCw className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Recalculate</Button>
            <Button size="sm" variant="outline"><Layers className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Compare Scenarios</Button>
            <Button size="sm" className="pdf-drawer-primary-btn"><Zap className="h-3.5 w-3.5 mr-1" /> Apply Plan</Button>
          </SheetFooter>
        </>
      )
    }

    if (drawerType === "accuracy") {
      const ac = drawerData
      return (
        <>
          <SheetHeader className="pdf-drawer-header">
            <SheetTitle className="pdf-drawer-title">
              <BarChart3 className="h-5 w-5 text-emerald-500" /> Model: {ac.id}
            </SheetTitle>
            <SheetDescription>{ac.algorithm} — {ac.product}</SheetDescription>
          </SheetHeader>
          <div className="pdf-drawer-body">
            <div className="pdf-drawer-visual-row">
              <ConfidenceBand value={ac.rSquared} />
              <div className="pdf-drawer-visual-info">
                <span className="pdf-algo-badge-lg" style={{ backgroundColor: (ALGO_COLORS[ac.algorithm] || "#6366f1") + "18", color: ALGO_COLORS[ac.algorithm] || "#6366f1" }}>{ac.algorithm}</span>
                {ac.recommended && <span className="pdf-recommended-badge-lg"><Sparkles className="h-3.5 w-3.5" /> Recommended</span>}
              </div>
            </div>
            {/* Accuracy metrics cards */}
            <div className="pdf-accuracy-metrics">
              {[
                { label: "MAPE", value: `${ac.mape}%`, quality: ac.mape <= 5 ? "excellent" : ac.mape <= 10 ? "good" : ac.mape <= 15 ? "fair" : "poor" },
                { label: "RMSE", value: ac.rmse, quality: ac.rmse <= 50 ? "excellent" : ac.rmse <= 100 ? "good" : "fair" },
                { label: "MAE", value: ac.mae, quality: ac.mae <= 40 ? "excellent" : ac.mae <= 80 ? "good" : "fair" },
                { label: "R-Squared", value: `${ac.rSquared}%`, quality: ac.rSquared >= 90 ? "excellent" : ac.rSquared >= 80 ? "good" : "fair" },
                { label: "WAPE", value: `${ac.wape}%`, quality: ac.wape <= 8 ? "excellent" : ac.wape <= 12 ? "good" : "fair" },
              ].map((m, i) => (
                <div key={i} className={`pdf-accuracy-item pdf-accuracy-${m.quality}`}>
                  <span className="pdf-accuracy-item-label">{m.label}</span>
                  <span className="pdf-accuracy-item-value">{m.value}</span>
                  <span className={`pdf-accuracy-quality-tag pdf-aq-${m.quality}`}>{m.quality}</span>
                </div>
              ))}
            </div>
            <FieldGrid fields={[
              { label: "Algorithm", value: ac.algorithm },
              { label: "Product", value: ac.product },
              { label: "Category", value: ac.category },
              { label: "Training Period", value: ac.trainingPeriod },
              { label: "Test Period", value: ac.testPeriod },
              { label: "Last Evaluated", value: ac.lastEvaluated },
              { label: "Status", value: ac.active ? "Active" : "Inactive" },
            ]} />
          </div>
          <SheetFooter className="pdf-drawer-footer">
            <Button size="sm" variant="outline"><RefreshCw className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Re-evaluate</Button>
            <Button size="sm" variant="outline"><BarChart3 className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Compare</Button>
            <Button size="sm" className="pdf-drawer-primary-btn"><Sparkles className="h-3.5 w-3.5 mr-1" /> Optimize</Button>
          </SheetFooter>
        </>
      )
    }

    if (drawerType === "alert") {
      const al = drawerData
      return (
        <>
          <SheetHeader className="pdf-drawer-header">
            <SheetTitle className="pdf-drawer-title">
              <AlertTriangle className="h-5 w-5 text-rose-500" /> Alert: {al.id}
            </SheetTitle>
            <SheetDescription>{al.alertType} — {al.severity}</SheetDescription>
          </SheetHeader>
          <div className="pdf-drawer-body">
            <div className="pdf-drawer-visual-row">
              <div className="pdf-alert-severity-visual">
                <SeverityDot severity={al.severity} />
                <span className={`pdf-risk-badge ${al.severity === "Critical" ? "pdf-risk-vhigh" : al.severity === "High" ? "pdf-risk-high" : al.severity === "Medium" ? "pdf-risk-med" : "pdf-risk-low"}`}>
                  {al.severity}
                </span>
              </div>
              <div className="pdf-drawer-visual-info">
                <span className={`pdf-alert-status-badge ${al.status === "Resolved" ? "pdf-alert-done" : al.status === "Escalated" ? "pdf-alert-escalated" : "pdf-alert-new"}`}>
                  {al.status}
                </span>
                <span className="pdf-alert-date-badge"><Clock className="h-3 w-3" /> {al.triggeredDate}</span>
              </div>
            </div>
            <div className="pdf-drawer-desc-box">
              <p>{al.message}</p>
              <p className="mt-1"><strong>Action Taken:</strong> {al.actionTaken}</p>
            </div>
            <MetricsRow metrics={[
              { label: "Deviation", value: `${al.deviation > 0 ? "+" : ""}${al.deviation}%`, sub: "From forecast", color: Math.abs(al.deviation) > 30 ? COLORS.rose : COLORS.amber },
              { label: "Current Demand", value: al.currentDemand.toLocaleString(), sub: "Actual", color: COLORS.sky },
              { label: "Forecasted", value: al.forecastDemand.toLocaleString(), sub: "Predicted", color: COLORS.indigo },
            ]} />
            <FieldGrid fields={[
              { label: "Product", value: al.product },
              { label: "Warehouse", value: al.warehouse },
              { label: "Alert Type", value: al.alertType },
              { label: "Severity", value: al.severity },
              { label: "Triggered", value: al.triggeredDate },
              { label: "Status", value: al.status },
              { label: "Action Taken", value: al.actionTaken },
            ]} />
          </div>
          <SheetFooter className="pdf-drawer-footer">
            <Button size="sm" variant="outline"><CheckCircle2 className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Resolve</Button>
            <Button size="sm" variant="outline"><RefreshCw className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Recalibrate</Button>
            <Button size="sm" className="pdf-drawer-primary-btn"><Zap className="h-3.5 w-3.5 mr-1" /> Escalate</Button>
          </SheetFooter>
        </>
      )
    }

    return null
  }

  return (
    <div className="pdf-container">
      <PageHeader
        title="Predictive Demand Forecasting"
        description="AI-powered demand prediction with seasonal analysis and scenario modeling"
      />
      {/* Tab Navigation */}
      <div className="pdf-tab-nav">
        {tabs.map((tab, i) => (
          <button key={i} className={`pdf-tab-btn ${activeTab === i ? "active" : ""}`} onClick={() => { setActiveTab(i); setSearchTerm(""); setFilterCategory("all"); setFilterWarehouse("all"); setFilterAlgorithm("all"); setFilterScenario("all") }}>
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pdf-tab-content-wrap">{tabs[activeTab].content}</div>

      {/* Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="pdf-drawer-panel" side="right">
          {renderDrawer()}
        </SheetContent>
      </Sheet>
    </div>
  )
}
