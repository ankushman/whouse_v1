"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  BrainCircuit, TrendingUp, Target, IndianRupee, Clock, Zap,
  AlertTriangle, ShieldCheck, BarChart3, Search, Eye, Filter,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, RefreshCw,
  Lightbulb, MapPin, Truck, Package, Star, Activity, Gauge,
  type LucideIcon,
} from "lucide-react"

// ============================================================================
// Helpers
// ============================================================================
function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  s = (s * 16807) % 2147483647
  return (s - 1) / 2147483646
}
const pick = <T,>(arr: readonly T[], seed: number) =>
  arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) =>
  Math.floor(seededRandom(seed) * (max - min + 1)) + min
const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr`
  : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L`
  : `₹${n.toLocaleString("en-IN")}`

// ============================================================================
// Enums
// ============================================================================
const SKU_CATEGORIES = ["FMCG", "Electronics", "Apparel", "Pharma", "Home Decor", "Beauty", "Auto Parts", "Food & Bev", "Sports", "Toys"] as const
const AI_REGIONS = ["North India", "South India", "East India", "West India", "Central India", "Metro", "Tier-1", "Tier-2"] as const
const TIME_HORIZONS = ["1 Week", "2 Weeks", "1 Month", "3 Months", "6 Months"] as const
const AI_MODELS = ["LSTM", "ARIMA", "Prophet", "XGBoost", "Transformer", "Ensemble"] as const
const FORECAST_STATUSES = ["Active", "Retraining", "Deprecated", "Evaluating", "Failed"] as const
const SOURCE_SYSTEMS = ["WMS", "TMS", "OMS", "IMS", "IoT Sensors", "ERP", "EDI", "Fleet GPS"] as const
const ANOMALY_TYPES = ["Demand Spike", "Inventory Discrepancy", "Route Deviation", "SLA Breach Risk", "Temperature Anomaly", "Equipment Failure", "Delay Pattern", "Cost Overrun"] as const
const ANOMALY_SEVERITIES = ["Critical", "High", "Medium", "Low"] as const
const ANOMALY_STATUSES = ["New", "Investigating", "Confirmed", "False Positive", "Resolved", "Escalated"] as const
const AI_RECOMMENDATIONS = ["Optimize Route", "Change Carrier", "Split Shipment", "Consolidate", "Direct Delivery", "Hub Bypass", "Mode Switch", "Reschedule"] as const
const TRANSPORT_MODES = ["Road", "Rail", "Air", "Multimodal", "Express"] as const
const ROUTE_STATUSES = ["Implemented", "Pending Review", "Rejected", "Expired", "Auto-Implemented"] as const
const ASSET_TYPES = ["Forklift", "Conveyor", "Robot", "ASRS", "Truck", "Chiller", "Compressor", "Generator"] as const
const PREDICTED_ISSUES = ["Battery Failure", "Motor Wear", "Sensor Drift", "Belt Fracture", "Hydraulic Leak", "Brake Wear", "Bearing Damage", "Circuit Board Failure"] as const
const WH_LOCATIONS = ["WH-MUM-01", "WH-MUM-02", "WH-DEL-01", "WH-DEL-02", "WH-BLR-01", "WH-BLR-02", "WH-CHN-01", "WH-HYD-01", "WH-PUN-01", "WH-KOL-01", "WH-AHD-01", "WH-JPR-01"] as const
const PRED_PRIORITIES = ["Critical", "High", "Medium", "Low"] as const
const MAINT_TYPES = ["Preventive", "Corrective", "Emergency", "Predictive"] as const
const PRED_STATUSES = ["Scheduled", "In Progress", "Completed", "Escalated", "Overdue", "Ignored"] as const

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow",
] as const

const PIE_COLORS = ["#7c3aed", "#0891b2", "#059669", "#ea580c", "#e11d48", "#d97706", "#3b82f6", "#6366f1"]

// ============================================================================
// Color Maps
// ============================================================================
const FORECAST_STATUS_COLORS: Record<string, string> = {
  "Active": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Retraining": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 lac-pulse-charge",
  "Deprecated": "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  "Evaluating": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Failed": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 lac-pulse-error",
}
const ANOMALY_TYPE_COLORS: Record<string, string> = {
  "Demand Spike": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Inventory Discrepancy": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Route Deviation": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "SLA Breach Risk": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Temperature Anomaly": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Equipment Failure": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Delay Pattern": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Cost Overrun": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
}
const SEVERITY_COLORS: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 lac-pulse-critical",
  "High": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Medium": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Low": "bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400",
}
const ANOMALY_STATUS_COLORS: Record<string, string> = {
  "New": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 lac-pulse-active",
  "Investigating": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 lac-pulse-active",
  "Confirmed": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "False Positive": "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  "Resolved": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Escalated": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 lac-pulse-error",
}
const RECOMMENDATION_COLORS: Record<string, string> = {
  "Optimize Route": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Change Carrier": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Split Shipment": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Consolidate": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Direct Delivery": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Hub Bypass": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Mode Switch": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Reschedule": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
}
const ROUTE_STATUS_COLORS: Record<string, string> = {
  "Implemented": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Pending Review": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Rejected": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Expired": "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  "Auto-Implemented": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
}
const PRED_PRIORITY_COLORS: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 lac-pulse-critical",
  "High": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Medium": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Low": "bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400",
}
const PRED_STATUS_COLORS: Record<string, string> = {
  "Scheduled": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "In Progress": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 lac-pulse-active",
  "Completed": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Escalated": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 lac-pulse-error",
  "Overdue": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 lac-pulse-warning",
  "Ignored": "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
}

// ============================================================================
// Data Generation
// ============================================================================
interface ForecastRecord { id: string; category: string; region: string; predicted: number; actual: number; variance: number; confidence: number; horizon: string; model: string; status: string; }
interface AnomalyRecord { id: string; source: string; type: string; severity: string; description: string; detectedAt: string; aiScore: number; status: string; resolution: string; }
interface RouteRecord { id: string; origin: string; destination: string; recommendation: string; mode: string; savings: number; timeSaved: number; co2Reduction: number; confidence: number; status: string; }
interface PredictionRecord { id: string; assetType: string; assetId: string; location: string; issue: string; probability: number; tte: number; priority: string; maintType: string; status: string; }

function generateData() {
  const forecasts: ForecastRecord[] = []
  for (let i = 0; i < 75; i++) {
    const s = i * 17 + 3
    const pred = ri(100, 5000, s)
    const varPct = ri(-25, 25, s + 1)
    forecasts.push({
      id: `FC-${String(i + 1001).padStart(4, "0")}`, category: pick(SKU_CATEGORIES, s + 2) as string,
      region: pick(AI_REGIONS, s + 3) as string, predicted: pred, actual: Math.round(pred * (1 + varPct / 100)),
      variance: varPct, confidence: ri(60, 99, s + 4), horizon: pick(TIME_HORIZONS, s + 5) as string,
      model: pick(AI_MODELS, s + 6) as string, status: pick(FORECAST_STATUSES, s + 7) as string,
    })
  }

  const anomalies: AnomalyRecord[] = []
  const anomalyDescs = ["Sudden 300% demand spike detected in NCR region", "Inventory count mismatch between WMS and physical count", "Vehicle deviated 15km from planned route", "SLA breach predicted for 12 shipments within 24hrs", "Cold room temperature exceeded threshold by 3°C", "Conveyor belt vibration pattern indicates impending failure", "Recurring delivery delays on Mumbai-Pune corridor", "Shipping cost exceeded budget by 40%"]
  const resolutions = ["Auto-alert sent to ops team", "Investigation assigned", "Route recalculated by AI", "Buffer stock allocated", "Temperature adjusted", "Maintenance scheduled", "Carrier changed", "Budget review initiated", "No action needed", "Escalated to manager"]
  for (let i = 0; i < 65; i++) {
    const s = i * 19 + 7
    anomalies.push({
      id: `ANM-${String(i + 2001).padStart(4, "0")}`, source: pick(SOURCE_SYSTEMS, s) as string,
      type: pick(ANOMALY_TYPES, s + 1) as string, severity: pick(ANOMALY_SEVERITIES, s + 2) as string,
      description: anomalyDescs[i % anomalyDescs.length],
      detectedAt: `${ri(1, 28, s + 3)}/${ri(1, 12, s + 4)}/2026 ${String(ri(0, 23, s + 5)).padStart(2, "0")}:${String(ri(0, 59, s + 6)).padStart(2, "0")}`,
      aiScore: ri(15, 98, s + 7), status: pick(ANOMALY_STATUSES, s + 8) as string,
      resolution: pick(resolutions, s + 9) as string,
    })
  }

  const routes: RouteRecord[] = []
  for (let i = 0; i < 60; i++) {
    const s = i * 23 + 11
    routes.push({
      id: `RTI-${String(i + 3001).padStart(4, "0")}`, origin: pick(INDIAN_CITIES, s) as string,
      destination: pick(INDIAN_CITIES, s + 1) as string, recommendation: pick(AI_RECOMMENDATIONS, s + 2) as string,
      mode: pick(TRANSPORT_MODES, s + 3) as string, savings: ri(500, 85000, s + 4),
      timeSaved: ri(1, 48, s + 5), co2Reduction: ri(5, 500, s + 6),
      confidence: ri(55, 99, s + 7), status: pick(ROUTE_STATUSES, s + 8) as string,
    })
  }

  const predictions: PredictionRecord[] = []
  for (let i = 0; i < 55; i++) {
    const s = i * 29 + 13
    predictions.push({
      id: `PRED-${String(i + 4001).padStart(4, "0")}`, assetType: pick(ASSET_TYPES, s) as string,
      assetId: `${pick(ASSET_TYPES, s + 1).toString().slice(0, 3).toUpperCase()}-${String(ri(1, 99, s + 2)).padStart(3, "0")}`,
      location: pick(WH_LOCATIONS, s + 3) as string, issue: pick(PREDICTED_ISSUES, s + 4) as string,
      probability: ri(15, 98, s + 5), tte: ri(1, 90, s + 6), priority: pick(PRED_PRIORITIES, s + 7) as string,
      maintType: pick(MAINT_TYPES, s + 8) as string, status: pick(PRED_STATUSES, s + 9) as string,
    })
  }

  // Chart data
  const dailyModelPerf = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`, "Demand Forecast": ri(80, 200, i * 3), "Route Optimization": ri(50, 150, i * 3 + 1),
    "Inventory": ri(60, 180, i * 3 + 2), "Pricing": ri(30, 120, i * 3 + 3),
  }))
  const predTypeDist = ["Demand Forecast", "Route Optimization", "Inventory Restock", "Pricing", "Delay Risk", "Fraud Detection", "Quality Prediction", "Capacity Planning"].map((n, i) => ({ name: n, value: ri(20, 100, i * 7) }))
  const modelAccuracy = AI_MODELS.map((m, i) => ({ name: m, accuracy: ri(78, 99, i * 11) }))
  const monthlyAccuracy = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    accuracy: ri(85, 99, i * 5),
  }))
  const modelPerfBar = AI_MODELS.map((m, i) => ({ name: m, accuracy: ri(80, 98, i * 9), predictions: ri(200, 900, i * 9 + 1) }))
  const anomalyTypeBar = ANOMALY_TYPES.map((t, i) => ({ name: t, count: ri(5, 40, i * 13) }))
  const roiTrend = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    "Labor Savings": ri(500000, 2000000, i * 3),
    "Fuel Savings": ri(200000, 800000, i * 3 + 1),
    "Inventory Savings": ri(300000, 1200000, i * 3 + 2),
    "Maintenance Savings": ri(100000, 600000, i * 3 + 3),
  }))

  return {
    forecasts, anomalies, routes, predictions,
    dailyModelPerf, predTypeDist, modelAccuracy, monthlyAccuracy,
    modelPerfBar, anomalyTypeBar, roiTrend,
  }
}

// ============================================================================
// Visual Components
// ============================================================================
function ForecastStatusBadge({ status }: { status: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", FORECAST_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge> }
function AnomalyTypeBadge({ type }: { type: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", ANOMALY_TYPE_COLORS[type] ?? "bg-gray-100 text-gray-700")}>{type}</Badge> }
function SeverityBadge({ severity }: { severity: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", SEVERITY_COLORS[severity] ?? "bg-gray-100 text-gray-700")}>{severity}</Badge> }
function AnomalyStatusBadge({ status }: { status: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", ANOMALY_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge> }
function AIScoreBar({ score }: { score: number }) {
  const color = score > 70 ? "bg-red-500" : score > 40 ? "bg-amber-500" : "bg-emerald-500"
  return <div className="flex items-center gap-2 w-24"><div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(score, 100)}%` }} /></div><span className="text-[10px] font-mono font-medium">{score}%</span></div>
}
function RegionBadge({ region }: { region: string }) { return <Badge className="text-[10px] px-1.5 py-0 font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{region}</Badge> }
function ConfidenceBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"
  return <div className="flex items-center gap-2 w-24"><div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(pct, 100)}%` }} /></div><span className="text-[10px] font-mono font-medium">{pct}%</span></div>
}
function VarianceTile({ pct }: { pct: number }) {
  const color = Math.abs(pct) <= 5 ? "text-emerald-600 dark:text-emerald-400" : Math.abs(pct) <= 15 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  return <span className={cn("text-xs font-mono font-semibold", color)}>{pct > 0 ? "+" : ""}{pct}%</span>
}
function RecommendationBadge({ rec }: { rec: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", RECOMMENDATION_COLORS[rec] ?? "bg-gray-100 text-gray-700")}>{rec}</Badge> }
function RouteStatusBadge({ status }: { status: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", ROUTE_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge> }
function SavingsTile({ value }: { value: number }) { return <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{formatINR(value)}</span> }
function CO2Tile({ value }: { value: number }) {
  const color = value > 200 ? "text-emerald-600 dark:text-emerald-400" : value > 100 ? "text-amber-600 dark:text-amber-400" : "text-orange-600 dark:text-orange-400"
  return <span className={cn("text-xs font-mono font-medium", color)}>{value} kg</span>
}
function ProbabilityBar({ pct }: { pct: number }) {
  const color = pct > 70 ? "bg-red-500" : pct > 40 ? "bg-amber-500" : "bg-emerald-500"
  return <div className="flex items-center gap-2 w-24"><div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(pct, 100)}%` }} /></div><span className="text-[10px] font-mono font-medium">{pct}%</span></div>
}
function TTEBadge({ days }: { days: number }) {
  const color = days <= 7 ? "text-red-600 dark:text-red-400" : days <= 21 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
  const pulseClass = days <= 7 ? "lac-tte-pulse" : ""
  return <span className={cn("text-xs font-mono font-medium", color, pulseClass)}>{days}d</span>
}
function PredPriorityBadge({ priority }: { priority: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", PRED_PRIORITY_COLORS[priority] ?? "bg-gray-100 text-gray-700")}>{priority}</Badge> }
function PredStatusBadge({ status }: { status: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", PRED_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge> }
function MaintTypeBadge({ type }: { type: string }) { return <Badge className="text-[10px] px-1.5 py-0 font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">{type}</Badge> }

function SortHeader({ label, field, sortField, sortDir, onSort }: { label: string; field: string; sortField: string; sortDir: "asc" | "desc"; onSort: (f: string) => void }) {
  return (
    <TableHead className="cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => onSort(field)}>
      <div className={cn("flex items-center gap-1 text-xs font-semibold uppercase tracking-wider", sortField === field ? "text-foreground" : "text-gray-500 dark:text-gray-400")}>
        {label}
        {sortField === field && <span className="text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </div>
    </TableHead>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export default function LogisticsAICommandView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null)

  const kpis = useMemo(() => [
    { label: "Active AI Models", value: "12", change: "+2", up: true, icon: BrainCircuit, color: "text-violet-600 dark:text-violet-400" },
    { label: "Predictions Today", value: "847", change: "+12%", up: true, icon: Target, color: "text-cyan-600 dark:text-cyan-400" },
    { label: "Accuracy Rate", value: "94.2%", change: "+0.8%", up: true, icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Cost Savings", value: "₹4.2 Cr", change: "+18%", up: true, icon: IndianRupee, color: "text-amber-600 dark:text-amber-400" },
    { label: "Anomalies Detected", value: "23", change: "-5", up: false, icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400" },
    { label: "Automations Running", value: "156", change: "+12", up: true, icon: Zap, color: "text-blue-600 dark:text-blue-400" },
    { label: "Avg Response Time", value: "0.3s", change: "-15%", up: false, icon: Clock, color: "text-rose-600 dark:text-rose-400" },
    { label: "Data Points (M)", value: "2.4M", change: "+340K", up: true, icon: Activity, color: "text-emerald-600 dark:text-emerald-400" },
  ], [])

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("desc") }
  }

  const sortFn = <T,>(items: T[], field: string): T[] => {
    if (!field) return items
    return [...items].sort((a, b) => {
      const aV = (a as unknown as Record<string, string | number>)[field] ?? ""
      const bV = (b as unknown as Record<string, string | number>)[field] ?? ""
      const cmp = aV < bV ? -1 : aV > bV ? 1 : 0
      return sortDir === "asc" ? cmp : -cmp
    })
  }

  const filteredForecasts = useMemo(() => {
    let f = data.forecasts
    if (searchQ) f = f.filter(r => r.category.toLowerCase().includes(searchQ.toLowerCase()) || r.id.toLowerCase().includes(searchQ.toLowerCase()) || r.region.toLowerCase().includes(searchQ.toLowerCase()))
    if (statusFilter !== "all") f = f.filter(r => r.status === statusFilter)
    return sortFn(f, sortField)
  }, [data.forecasts, searchQ, statusFilter, sortField, sortDir])

  const filteredAnomalies = useMemo(() => {
    let f = data.anomalies
    if (searchQ) f = f.filter(a => a.description.toLowerCase().includes(searchQ.toLowerCase()) || a.id.toLowerCase().includes(searchQ.toLowerCase()) || a.type.toLowerCase().includes(searchQ.toLowerCase()))
    if (statusFilter !== "all") f = f.filter(a => a.status === statusFilter)
    return sortFn(f, sortField)
  }, [data.anomalies, searchQ, statusFilter, sortField, sortDir])

  const filteredRoutes = useMemo(() => {
    let f = data.routes
    if (searchQ) f = f.filter(r => r.origin.toLowerCase().includes(searchQ.toLowerCase()) || r.destination.toLowerCase().includes(searchQ.toLowerCase()) || r.id.toLowerCase().includes(searchQ.toLowerCase()))
    if (statusFilter !== "all") f = f.filter(r => r.status === statusFilter)
    return sortFn(f, sortField)
  }, [data.routes, searchQ, statusFilter, sortField, sortDir])

  const filteredPredictions = useMemo(() => {
    let f = data.predictions
    if (searchQ) f = f.filter(p => p.assetType.toLowerCase().includes(searchQ.toLowerCase()) || p.id.toLowerCase().includes(searchQ.toLowerCase()) || p.issue.toLowerCase().includes(searchQ.toLowerCase()))
    if (statusFilter !== "all") f = f.filter(p => p.status === statusFilter)
    return sortFn(f, sortField)
  }, [data.predictions, searchQ, statusFilter, sortField, sortDir])

  const openAnomalyDetail = (a: AnomalyRecord) => { setSelectedAnomaly(a); setSheetOpen(true); toast.info("Anomaly Detail", `Viewing ${a.id}`) }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <PageHeader title="Logistics AI Command Center" description="AI-powered insights, anomaly detection, demand forecasting and predictive maintenance" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 h-auto flex-wrap gap-1">
          {["AI Overview", "Demand Forecasting", "Anomaly Detection", "Route Intelligence", "Predictive Maintenance", "AI Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-xs px-3 py-1.5">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpis.map((k, i) => { const Icon = k.icon; return (
              <Card key={i} className="hover-lift-sm lac-kpi-card border-l-4 border-l-violet-500 hover:shadow-lg transition-shadow">
                <CardContent className="inner-glow p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{k.label}</p>
                      <p className="text-lg font-bold mt-0.5">{k.value}</p>
                      <div className={cn("flex items-center text-[10px] mt-1 gap-0.5", k.up ? "text-emerald-600" : "text-red-600")}>
                        {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{k.change}
                      </div>
                    </div>
                    <Icon className={cn("w-5 h-5 opacity-50", k.color)} />
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover-lift-sm lac-chart-card col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm">AI Model Performance (14 Days)</CardTitle></CardHeader>
              <CardContent><AreaChart data={data.dailyModelPerf} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Demand Forecast" stackId="a" fill="#7c3aed" /><Area type="monotone" dataKey="Route Optimization" stackId="a" fill="#0891b2" /><Area type="monotone" dataKey="Inventory" stackId="a" fill="#059669" /><Area type="monotone" dataKey="Pricing" stackId="a" fill="#ea580c" /></AreaChart></CardContent>
            </Card>
            <Card className="hover-lift-sm lac-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Prediction Types</CardTitle></CardHeader>
              <CardContent><PieChart width={240} height={240}><Pie data={data.predTypeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>{data.predTypeDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
          </div>
          <Card className="hover-lift-sm lac-chart-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Model Accuracy Comparison</CardTitle></CardHeader>
            <CardContent><BarChart data={data.modelAccuracy} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} domain={[70, 100]} /><Tooltip /><Bar dataKey="accuracy" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></CardContent>
          </Card>
        </TabsContent>

        {/* Tab 1: Demand Forecasting */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <Input placeholder="Search by category, ID, region..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem>{FORECAST_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table>
              <TableHeader><TableRow>
                <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="Category" field="category" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Region</TableHead>
                <SortHeader label="Predicted" field="predicted" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="Actual" field="actual" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="Variance" field="variance" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Confidence</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Horizon</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Model</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredForecasts.map(f => (
                  <TableRow key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <TableCell className="text-xs font-mono">{f.id}</TableCell>
                    <TableCell className="text-xs">{f.category}</TableCell>
                    <TableCell><RegionBadge region={f.region} /></TableCell>
                    <TableCell className="text-xs font-mono">{f.predicted.toLocaleString()}</TableCell>
                    <TableCell className="text-xs font-mono">{f.actual.toLocaleString()}</TableCell>
                    <TableCell><VarianceTile pct={f.variance} /></TableCell>
                    <TableCell><ConfidenceBar pct={f.confidence} /></TableCell>
                    <TableCell className="text-xs">{f.horizon}</TableCell>
                    <TableCell><Badge className="text-[10px] px-1.5 py-0 font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{f.model}</Badge></TableCell>
                    <TableCell><ForecastStatusBadge status={f.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 2: Anomaly Detection */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <Input placeholder="Search by description, ID, type..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem>{ANOMALY_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table>
              <TableHeader><TableRow>
                <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Source</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Severity</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">AI Score</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredAnomalies.map(a => (
                  <TableRow key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <TableCell className="text-xs font-mono">{a.id}</TableCell>
                    <TableCell><Badge className="text-[10px] px-1.5 py-0 font-medium bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">{a.source}</Badge></TableCell>
                    <TableCell><AnomalyTypeBadge type={a.type} /></TableCell>
                    <TableCell><SeverityBadge severity={a.severity} /></TableCell>
                    <TableCell className="text-[10px] text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{a.description}</TableCell>
                    <TableCell><AIScoreBar score={a.aiScore} /></TableCell>
                    <TableCell><AnomalyStatusBadge status={a.status} /></TableCell>
                    <TableCell><Button variant="ghost" size="sm" className="press-scale h-7 text-[10px] lac-action-btn" onClick={() => openAnomalyDetail(a)}><Eye className="w-3 h-3 mr-1" />View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 3: Route Intelligence */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <Input placeholder="Search by origin, destination..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem>{ROUTE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table>
              <TableHeader><TableRow>
                <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Route</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Recommendation</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Mode</TableHead>
                <SortHeader label="Savings" field="savings" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="Time Saved" field="timeSaved" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="CO2" field="co2Reduction" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Confidence</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredRoutes.map(r => (
                  <TableRow key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <TableCell className="text-xs font-mono">{r.id}</TableCell>
                    <TableCell className="text-xs"><span className="font-medium">{r.origin}</span><span className="text-gray-400 mx-1">→</span><span className="font-medium">{r.destination}</span></TableCell>
                    <TableCell><RecommendationBadge rec={r.recommendation} /></TableCell>
                    <TableCell><Badge className="text-[10px] px-1.5 py-0 font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">{r.mode}</Badge></TableCell>
                    <TableCell><SavingsTile value={r.savings} /></TableCell>
                    <TableCell className="text-xs font-mono">{r.timeSaved}h</TableCell>
                    <TableCell><CO2Tile value={r.co2Reduction} /></TableCell>
                    <TableCell><ConfidenceBar pct={r.confidence} /></TableCell>
                    <TableCell><RouteStatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 4: Predictive Maintenance */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <Input placeholder="Search by asset, issue, location..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem>{PRED_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table>
              <TableHeader><TableRow>
                <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Asset</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Location</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Issue</TableHead>
                <SortHeader label="Probability" field="probability" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="TTE" field="tte" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Priority</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredPredictions.map(p => (
                  <TableRow key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <TableCell className="text-xs font-mono">{p.id}</TableCell>
                    <TableCell><div className="text-xs font-medium">{p.assetType}</div><div className="text-[10px] text-gray-500 font-mono">{p.assetId}</div></TableCell>
                    <TableCell><Badge className="text-[10px] px-1.5 py-0 font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{p.location}</Badge></TableCell>
                    <TableCell className="text-xs">{p.issue}</TableCell>
                    <TableCell><ProbabilityBar pct={p.probability} /></TableCell>
                    <TableCell><TTEBadge days={p.tte} /></TableCell>
                    <TableCell><PredPriorityBadge priority={p.priority} /></TableCell>
                    <TableCell><MaintTypeBadge type={p.maintType} /></TableCell>
                    <TableCell><PredStatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 5: Analytics */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Predictions (YTD)", value: "1,24,847", icon: Target, color: "text-violet-600 dark:text-violet-400" },
              { label: "Avg Accuracy", value: "94.2%", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Anomalies Detected", value: "3,421", icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400" },
              { label: "Total Savings", value: formatINR(42000000), icon: IndianRupee, color: "text-amber-600 dark:text-amber-400" },
              { label: "ROI", value: "340%", icon: BarChart3, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "False Positive Rate", value: "3.8%", icon: XCircle, color: "text-red-600 dark:text-red-400" },
              { label: "Models Retrained", value: "47", icon: RefreshCw, color: "text-cyan-600 dark:text-cyan-400" },
              { label: "Data Sources", value: "12", icon: Activity, color: "text-blue-600 dark:text-blue-400" },
            ].map((k, i) => { const Icon = k.icon; return (
              <Card key={i} className="hover-lift-sm lac-kpi-card border-l-4 border-l-emerald-500">
                <CardContent className="inner-glow p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{k.label}</p>
                      <p className="text-base font-bold mt-0.5">{k.value}</p>
                    </div>
                    <Icon className={cn("w-5 h-5 opacity-50", k.color)} />
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover-lift-sm lac-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Accuracy Trend</CardTitle></CardHeader>
              <CardContent><LineChart data={data.monthlyAccuracy} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} domain={[80, 100]} /><Tooltip /><Line type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={2} /></LineChart></CardContent>
            </Card>
            <Card className="hover-lift-sm lac-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Model Performance</CardTitle></CardHeader>
              <CardContent><BarChart data={data.modelPerfBar} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} domain={[70, 100]} /><Tooltip /><Bar dataKey="accuracy" fill="#0891b2" radius={[4, 4, 0, 0]} /></BarChart></CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover-lift-sm lac-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Anomaly Distribution by Type</CardTitle></CardHeader>
              <CardContent><BarChart data={data.anomalyTypeBar} layout="vertical" height={260}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={120} /><Tooltip /><Bar dataKey="count" fill="#e11d48" radius={[0, 4, 4, 0]} /></BarChart></CardContent>
            </Card>
            <Card className="hover-lift-sm lac-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">AI ROI Breakdown (6-Month)</CardTitle></CardHeader>
              <CardContent><AreaChart data={data.roiTrend} height={260}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Area type="monotone" dataKey="Labor Savings" stackId="a" fill="#7c3aed" /><Area type="monotone" dataKey="Fuel Savings" stackId="a" fill="#0891b2" /><Area type="monotone" dataKey="Inventory Savings" stackId="a" fill="#059669" /><Area type="monotone" dataKey="Maintenance Savings" stackId="a" fill="#d97706" /></AreaChart></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Anomaly Detail Sheet */}
      <Sheet open={!!(sheetOpen && selectedAnomaly)} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[420px] sm:w-[540px] overflow-y-auto">
          {selectedAnomaly && (
            <>
              <SheetHeader>
                <div className="h-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full -mx-6 -mt-6 mb-4" />
                <SheetTitle className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-violet-600" />
                  {selectedAnomaly.id}
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-2">
                  <AnomalyTypeBadge type={selectedAnomaly.type} />
                  <SeverityBadge severity={selectedAnomaly.severity} />
                  <AnomalyStatusBadge status={selectedAnomaly.status} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-xs"><span className="text-gray-500">Source: </span><Badge className="text-[10px] px-1.5 py-0 font-medium bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">{selectedAnomaly.source}</Badge></div>
                  <div className="text-xs"><span className="text-gray-500">Detected At: </span><span className="font-mono">{selectedAnomaly.detectedAt}</span></div>
                  <div className="text-xs"><span className="text-gray-500">AI Confidence Score: </span></div>
                  <AIScoreBar score={selectedAnomaly.aiScore} />
                </div>
                <Separator />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-xs leading-relaxed">{selectedAnomaly.description}</p>
                </div>
                <Separator />
                <div className="text-xs"><span className="text-gray-500">Resolution: </span><span>{selectedAnomaly.resolution}</span></div>
                <div className="flex gap-2">
                  <Button size="sm" className="press-scale text-xs flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => toast.success("Investigated", `Anomaly ${selectedAnomaly.id} marked as investigating`)}>Investigate</Button>
                  <Button size="sm" className="press-scale text-xs flex-1 bg-cyan-600 hover:bg-cyan-700" onClick={() => toast.success("Resolved", `Anomaly ${selectedAnomaly.id} resolved`)}>Mark Resolved</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
