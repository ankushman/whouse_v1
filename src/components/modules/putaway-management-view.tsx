"use client"

import { useState } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis,
} from "recharts"
import {
  PackagePlus, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, ArrowUpRight, ArrowDownRight, Eye, X, Package, Clock,
  Warehouse, Star, Timer, MapPin, User, ChevronRight, ArrowRight,
  PackageSearch, LayoutGrid, Zap, ShieldCheck, ThermometerSnowflake,
  IndianRupee, Target, Gauge, Boxes, Archive,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Seed-based data generation
// ─────────────────────────────────────────────────────────────────────────────
function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(133133)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"] as const
const STRATEGIES = ["Zone-Based", "Velocity-Based", "ABC-Classified", "Random Assignment", "Bulk Storage", "Cross-Dock Direct"] as const
const ZONES = ["Zone A (Picking)", "Zone B (Bulk)", "Zone C (Cold Storage)", "Zone D (High-Value)", "Zone E (Hazmat)", "Zone F (Returns)"] as const
const STATUSES = ["Pending", "Assigned", "In Progress", "Scanning", "Completed", "Exception"] as const
const PRIORITIES = ["Critical", "High", "Medium", "Low"] as const
const EQUIPMENT = ["Forklift FL-001", "Forklift FL-002", "Reach Truck RT-001", "Pallet Jack PJ-001", "Electric Pallet EP-001", "Cherry Picker CP-001"] as const

const PRODUCTS = [
  { sku: "F&B-1001", name: "Basmati Rice 25kg", cat: "Food", weight: 25.5, dims: "60x40x35", value: 2450 },
  { sku: "F&B-1002", name: "Turmeric Powder 500g", cat: "Food", weight: 0.6, dims: "20x15x10", value: 180 },
  { sku: "F&B-1003", name: "Organic Tea 1kg", cat: "Food", weight: 1.2, dims: "25x20x15", value: 1250 },
  { sku: "PHR-2001", name: "Paracetamol 500mg", cat: "Pharma", weight: 0.1, dims: "10x10x5", value: 350 },
  { sku: "PHR-2004", name: "ORS Sachets 100pc", cat: "Pharma", weight: 5.0, dims: "40x30x25", value: 780 },
  { sku: "PHR-2007", name: "Cough Syrup 200ml", cat: "Pharma", weight: 0.3, dims: "8x8x15", value: 290 },
  { sku: "ELC-3001", name: "LED Panel 2x2ft", cat: "Electronics", weight: 3.5, dims: "60x60x5", value: 3200 },
  { sku: "ELC-3005", name: "Power Bank 20000mAh", cat: "Electronics", weight: 0.4, dims: "15x7x2", value: 1800 },
  { sku: "ELC-3006", name: "WiFi Router Dual Band", cat: "Electronics", weight: 0.35, dims: "20x15x4", value: 2400 },
  { sku: "AUT-4002", name: "Brake Pad Set", cat: "Auto Parts", weight: 4.8, dims: "30x25x10", value: 4500 },
  { sku: "AUT-4003", name: "Engine Oil 5L", cat: "Auto Parts", weight: 5.2, dims: "25x20x20", value: 1650 },
  { sku: "TXT-6001", name: "Cotton Fabric Roll", cat: "Textile", weight: 12.0, dims: "120x30x30", value: 5800 },
  { sku: "TXT-6005", name: "Jute Bag Pack 100pc", cat: "Textile", weight: 35.0, dims: "80x60x40", value: 340 },
  { sku: "IND-5001", name: "Hex Bolt M12x40", cat: "Industrial", weight: 0.05, dims: "5x5x4", value: 85 },
  { sku: "IND-5006", name: "Electrical Cable 2.5mm", cat: "Industrial", weight: 2.8, dims: "100x10x10", value: 680 },
]

const OPERATORS = [
  { id: "OP-001", name: "Ramesh Kumar", warehouse: "Mumbai Hub", cert: "L2", zone: "Zone A" },
  { id: "OP-002", name: "Sunil Verma", warehouse: "Delhi NCR", cert: "L3", zone: "Zone B" },
  { id: "OP-003", name: "Priya Iyer", warehouse: "Chennai DC", cert: "L2", zone: "Zone C" },
  { id: "OP-004", name: "Anil Deshmukh", warehouse: "Pune West", cert: "L1", zone: "Zone A" },
  { id: "OP-005", name: "Deepak Sharma", warehouse: "Kolkata Hub", cert: "L3", zone: "Zone D" },
  { id: "OP-006", name: "Kavitha R.", warehouse: "Bangalore South", cert: "L2", zone: "Zone E" },
  { id: "OP-007", name: "Manoj Patel", warehouse: "Mumbai Hub", cert: "L1", zone: "Zone B" },
  { id: "OP-008", name: "Lakshmi Nair", warehouse: "Chennai DC", cert: "L3", zone: "Zone F" },
]

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
const MONTHS = ["Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26"]
const PIE_RADAR_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"]

// ─────────────────────────────────────────────────────────────────────────────
// Generate Mock Data
// ─────────────────────────────────────────────────────────────────────────────

// Putaway Tasks (120 records)
const putawayTasks: Array<{
  id: string; palletId: string; product: typeof PRODUCTS[0];
  qty: number; weight: number; strategy: string; priority: string;
  status: string; zone: string; bin: string; warehouse: string;
  operator: typeof OPERATORS[0] | null; equipment: string;
  createdAt: string; assignedAt: string | null; completedAt: string | null;
  duration: number | null;
}> = (() => {
  const result: typeof putawayTasks = []
  for (let i = 0; i < 120; i++) {
    const product = pick(PRODUCTS)
    const qty = Math.floor(rand() * 50) + 1
    const totalWeight = +(product.weight * qty).toFixed(1)
    const status = pick(STATUSES)
    const priority = status === "Exception" ? pick(["Critical", "High"]) : pick(PRIORITIES)
    const strategy = pick(STRATEGIES)
    const zone = pick(ZONES)
    const warehouse = pick(WAREHOUSES)
    const zoneLetter = zone.charAt(5)
    const binRow = String(Math.floor(rand() * 12) + 1).padStart(2, "0")
    const binBay = String(Math.floor(rand() * 6) + 1).padStart(2, "0")
    const binLevel = String(Math.floor(rand() * 4) + 1).padStart(2, "0")
    const operator = status !== "Pending" ? pick(OPERATORS) : null
    const equip = status !== "Pending" ? pick(EQUIPMENT) : "—"
    const day = String(Math.floor(rand() * 28) + 1).padStart(2, "0")
    const month = String(Math.floor(rand() * 6) + 7).padStart(2, "0")
    const createdAt = `2026-${month}-${day}`
    const isAssigned = status !== "Pending"
    const isCompleted = status === "Completed"
    const duration = isCompleted ? Math.floor(rand() * 120) + 15 : null
    result.push({
      id: `PUT-${String(i + 1).padStart(4, "0")}`,
      palletId: `PLT-${String(Math.floor(rand() * 9000) + 1000)}`,
      product, qty, weight: totalWeight,
      strategy, priority, status, zone,
      bin: `${zoneLetter}-${binRow}-${binBay}-${binLevel}`,
      warehouse, operator, equipment: equip,
      createdAt,
      assignedAt: isAssigned ? createdAt : null,
      completedAt: isCompleted ? createdAt : null,
      duration,
    })
  }
  return result
})()

// Monthly trend data
const monthlyTrend = MONTHS.map((m) => ({
  month: m,
  putaways: Math.floor(rand() * 80) + 180,
  accuracy: +(rand() * 5 + 93).toFixed(1),
}))

// Strategy distribution
const strategyDist = STRATEGIES.map((s) => ({
  strategy: s,
  count: putawayTasks.filter((t) => t.strategy === s).length,
}))

// Warehouse performance
const warehousePerf = WAREHOUSES.map((wh) => ({
  warehouse: wh,
  putaways: Math.floor(rand() * 60) + 30,
  avgTime: Math.floor(rand() * 30) + 30,
}))

// Priority distribution
const priorityDist = PRIORITIES.map((p) => ({
  priority: p,
  count: putawayTasks.filter((t) => t.priority === p).length,
}))

// Zone utilization
const zoneUtil = ZONES.map((z) => {
  const util = +(rand() * 40 + 50).toFixed(1)
  return { zone: z.split(" ")[0] + " " + z.split(" ")[1], utilization: util }
})

// Operator performance
const operatorPerf = OPERATORS.map((op) => ({
  ...op,
  completed: Math.floor(rand() * 50) + 15,
  avgTime: Math.floor(rand() * 20) + 25,
  accuracy: Math.floor(rand() * 6) + 93,
  rating: +(rand() * 1.5 + 3.5).toFixed(1),
}))

// Zone details
const zoneDetails = ZONES.map((z) => {
  const type = z.includes("Picking") ? "Picking" : z.includes("Bulk") ? "Bulk Storage" : z.includes("Cold") ? "Cold Storage" : z.includes("High-Value") ? "High-Value" : z.includes("Hazmat") ? "Hazmat" : "Returns"
  const capacity = Math.floor(rand() * 200) + 300
  const utilized = Math.floor(capacity * (rand() * 0.4 + 0.5))
  const currentItems = Math.floor(rand() * 150) + 50
  const temperature = z.includes("Cold") ? "-18°C to 4°C" : "—"
  const restrictions = z.includes("Hazmat") ? "MSDS Required, PPE Mandatory" : z.includes("High-Value") ? "Security Access Only" : z.includes("Cold") ? "Temp Monitor, Gown Required" : z.includes("Returns") ? "QC Check Required" : "Standard WH Safety"
  const assignedOps = OPERATORS.filter((o) => o.zone === z.split(" ")[0] + " " + z.split(" ")[1]).map((o) => o.name)
  return { zone: z, type, capacity, utilized: Math.floor(utilized / capacity * 100), available: capacity - utilized, currentItems, temperature, restrictions, assignedOps: assignedOps.length > 0 ? assignedOps : [pick(OPERATORS).name] }
})

// Radar chart data for zones
const zoneRadar = [
  { metric: "Utilization", "Zone A": 78, "Zone B": 65, "Zone C": 82 },
  { metric: "Throughput", "Zone A": 90, "Zone B": 72, "Zone C": 68 },
  { metric: "Compliance", "Zone A": 95, "Zone B": 88, "Zone C": 98 },
]

// Zone type distribution
const zoneTypeDist = [
  { type: "Picking", count: 1 },
  { type: "Bulk Storage", count: 1 },
  { type: "Cold Storage", count: 1 },
  { type: "High-Value", count: 1 },
  { type: "Hazmat", count: 1 },
  { type: "Returns", count: 1 },
]

// Bin optimization data
const binOccupancy = [
  { range: "0-25%", count: Math.floor(rand() * 200) + 300 },
  { range: "25-50%", count: Math.floor(rand() * 200) + 400 },
  { range: "50-75%", count: Math.floor(rand() * 200) + 500 },
  { range: "75-100%", count: Math.floor(rand() * 200) + 350 },
  { range: "Over 100%", count: Math.floor(rand() * 50) + 30 },
]

// Velocity vs Occupancy scatter data
const velocityOccupancy = (() => {
  const data: Array<{ velocity: number; occupancy: number; capacity: number; bin: string }> = []
  const zones = ["A", "B", "C", "D", "E", "F"]
  for (let i = 0; i < 40; i++) {
    const z = pick(zones)
    const velocity = Math.floor(rand() * 100) + 5
    const occupancy = Math.floor(rand() * 100) + 5
    const capacity = Math.floor(rand() * 50) + 10
    const row = String(Math.floor(rand() * 12) + 1).padStart(2, "0")
    const bay = String(Math.floor(rand() * 6) + 1).padStart(2, "0")
    const lvl = String(Math.floor(rand() * 4) + 1).padStart(2, "0")
    data.push({ velocity, occupancy, capacity, bin: `${z}-${row}-${bay}-${lvl}` })
  }
  return data
})()

// Optimization suggestions (40 rows)
const optSuggestions = (() => {
  const actions = ["Rebalance", "Consolidate", "Expand", "Relocate", "Merge"] as const
  const zones = ["A", "B", "C", "D", "E", "F"]
  const statuses = ["Pending", "In Progress", "Scheduled", "Completed"] as const
  const result: Array<{
    binId: string; zone: string; occupancy: number;
    action: string; savings: number; priority: string; status: string
  }> = []
  for (let i = 0; i < 40; i++) {
    const z = pick(zones)
    const row = String(Math.floor(rand() * 12) + 1).padStart(2, "0")
    const bay = String(Math.floor(rand() * 6) + 1).padStart(2, "0")
    const lvl = String(Math.floor(rand() * 4) + 1).padStart(2, "0")
    const occ = Math.floor(rand() * 60) + 40
    const action = pick(actions)
    const priority = occ > 85 ? "Critical" : occ > 70 ? "High" : occ > 55 ? "Medium" : "Low"
    result.push({
      binId: `${z}-${row}-${bay}-${lvl}`,
      zone: `Zone ${z}`,
      occupancy: occ,
      action,
      savings: Math.floor(rand() * 45) + 5,
      priority,
      status: pick(statuses),
    })
  }
  return result
})()

// Cost trend data
const costTrend = MONTHS.map((m) => ({
  month: m,
  labor: Math.floor(rand() * 8000) + 12000,
  equipment: Math.floor(rand() * 4000) + 6000,
  overhead: Math.floor(rand() * 3000) + 4000,
}))

// Strategy effectiveness radar data
const stratEffectiveness = STRATEGIES.map((s) => ({
  strategy: s,
  speed: Math.floor(rand() * 40) + 60,
  accuracy: Math.floor(rand() * 15) + 82,
  space: Math.floor(rand() * 30) + 65,
  cost: Math.floor(rand() * 35) + 55,
}))

// Improvement areas
const improvementAreas = [
  { area: "Dock-to-Stock Time", current: "2.1 hrs", target: "1.5 hrs", gap: "0.6 hrs", savings: 45000, priority: "High" },
  { area: "Zone A Congestion", current: "89% util", target: "75% util", gap: "14%", savings: 28000, priority: "Critical" },
  { area: "Cross-Dock Rate", current: "18%", target: "30%", gap: "12%", savings: 52000, priority: "High" },
  { area: "Picking Path Efficiency", current: "72%", target: "88%", gap: "16%", savings: 38000, priority: "Medium" },
  { area: "Cold Chain Compliance", current: "94%", target: "99%", gap: "5%", savings: 22000, priority: "High" },
  { area: "Bulk Storage Layout", current: "68% space", target: "82% space", gap: "14%", savings: 15000, priority: "Medium" },
  { area: "Operator Idle Time", current: "22 min/hr", target: "12 min/hr", gap: "10 min", savings: 35000, priority: "Medium" },
  { area: "Hazmat Handling", current: "91%", target: "100%", gap: "9%", savings: 18000, priority: "Critical" },
]

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cls = status === "Pending" ? "pa-status-pending"
    : status === "Assigned" ? "pa-status-assigned"
    : status === "In Progress" ? "pa-status-in-progress"
    : status === "Scanning" ? "pa-status-scanning"
    : status === "Completed" ? "pa-status-completed"
    : "pa-status-exception"
  return <span className={cls}>{status}</span>
}

function StrategyBadge({ strategy }: { strategy: string }) {
  const cls = strategy === "Zone-Based" ? "pa-strat-zone-based"
    : strategy === "Velocity-Based" ? "pa-strat-velocity-based"
    : strategy === "ABC-Classified" ? "pa-strat-abc-classified"
    : strategy === "Random Assignment" ? "pa-strat-random-assignment"
    : strategy === "Bulk Storage" ? "pa-strat-bulk-storage"
    : "pa-strat-cross-dock"
  return <span className={cls}>{strategy}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const cls = priority === "Critical" ? "pa-priority-critical"
    : priority === "High" ? "pa-priority-high"
    : priority === "Medium" ? "pa-priority-medium"
    : "pa-priority-low"
  return <span className={cls}>{priority}</span>
}

function ActionBadge({ action }: { action: string }) {
  const cls = action === "Rebalance" ? "pa-action-rebalance"
    : action === "Consolidate" ? "pa-action-consolidate"
    : action === "Expand" ? "pa-action-expand"
    : action === "Relocate" ? "pa-action-relocate"
    : "pa-action-merge"
  return <span className={cls}>{action}</span>
}

function CertBadge({ cert }: { cert: string }) {
  const cls = cert === "L1" ? "pa-cert-l1" : cert === "L2" ? "pa-cert-l2" : "pa-cert-l3"
  return <span className={cls}>{cert}</span>
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn("h-3.5 w-3.5", s <= Math.round(rating) ? "pa-star-filled" : "pa-star-empty")} />
      ))}
    </div>
  )
}

function MiniBar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="pa-mini-bar">
      <div className={cn("pa-mini-bar-fill", colorClass)} style={{ width: `${pct}%` }} />
    </div>
  )
}

function UtilBar({ value }: { value: number }) {
  const cls = value >= 85 ? "pa-util-over" : value >= 70 ? "pa-util-medium" : value >= 40 ? "pa-util-high" : "pa-util-low"
  return (
    <div className="pa-util-bar">
      <div className={cn("pa-util-bar-fill", cls)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

function ZoneTypeBadge({ type }: { type: string }) {
  const cls = type === "Picking" ? "pa-zone-picking"
    : type === "Bulk Storage" ? "pa-zone-bulk"
    : type === "Cold Storage" ? "pa-zone-cold"
    : type === "High-Value" ? "pa-zone-high-value"
    : type === "Hazmat" ? "pa-zone-hazmat"
    : "pa-zone-returns"
  return <span className={cls}>{type}</span>
}

function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="pa-drawer-overlay" onClick={onClose}>
      <div className="pa-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <button className="pa-drawer-close" onClick={onClose}><X className="h-4 w-4" /></button>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function PutawayManagementView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [queueSearch, setQueueSearch] = useState("")
  const [queueStatusFilter, setQueueStatusFilter] = useState("All")
  const [queuePriorityFilter, setQueuePriorityFilter] = useState("All")
  const [queueStrategyFilter, setQueueStrategyFilter] = useState("All")
  const [selectedTask, setSelectedTask] = useState<typeof putawayTasks[0] | null>(null)

  const filteredQueue = (() => {
    const q = queueSearch.toLowerCase()
    return putawayTasks.filter((t) => {
      const matchSearch = !q || t.id.toLowerCase().includes(q) || t.palletId.toLowerCase().includes(q)
        || t.product.sku.toLowerCase().includes(q) || t.product.name.toLowerCase().includes(q)
        || t.warehouse.toLowerCase().includes(q) || t.zone.toLowerCase().includes(q)
      const matchStatus = queueStatusFilter === "All" || t.status === queueStatusFilter
      const matchPriority = queuePriorityFilter === "All" || t.priority === queuePriorityFilter
      const matchStrategy = queueStrategyFilter === "All" || t.strategy === queueStrategyFilter
      return matchSearch && matchStatus && matchPriority && matchStrategy
    })
  })()

  const visibleQueue = filteredQueue.slice(0, 60)

  return (
    <div className="pa-container">
      {/* ─── Header ─── */}
      <div className="pa-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
            <PackagePlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Putaway Management</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Bin Optimization & Zone Assignment</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Today:</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">247 putaways</span>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="pa-tabs-wrapper mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="gap-1.5"><LayoutGrid className="h-3.5 w-3.5" />Dashboard</TabsTrigger>
            <TabsTrigger value="queue" className="gap-1.5"><PackageSearch className="h-3.5 w-3.5" />Putaway Queue</TabsTrigger>
            <TabsTrigger value="zones" className="gap-1.5"><MapPin className="h-3.5 w-3.5" />Zone Assignment</TabsTrigger>
            <TabsTrigger value="bins" className="gap-1.5"><Archive className="h-3.5 w-3.5" />Bin Optimization</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Analytics</TabsTrigger>
          </TabsList>

          {/* ═══════════════════ TAB 1: DASHBOARD ═══════════════════ */}
          {activeTab === "dashboard" && (
            <div className="mt-4 space-y-4">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { title: "Total Putaways", val: "247", icon: PackagePlus, cls: "pa-kpi-indigo" },
                  { title: "Pending Tasks", val: "38", icon: Clock, cls: "pa-kpi-amber" },
                  { title: "In Progress", val: "12", icon: Zap, cls: "pa-kpi-violet" },
                  { title: "Completed", val: "185", icon: CheckCircle2, cls: "pa-kpi-emerald" },
                  { title: "Avg Dock-to-Stock", val: "47 min", icon: Timer, cls: "pa-kpi-pink" },
                  { title: "Putaway Accuracy", val: "96.8%", icon: Target, cls: "pa-kpi-cyan" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("pa-kpi-card", kpi.cls)}>
                    <p className="text-xs opacity-80 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.val}</p>
                    <kpi.icon className="absolute top-3 right-3 h-5 w-5 opacity-40" />
                  </div>
                ))}
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Putaway Volume & Accuracy</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <ComposedChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[90, 100]} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar yAxisId="left" dataKey="putaways" fill="#6366f1" radius={[4, 4, 0, 0]} name="Putaways" />
                        <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} name="Accuracy %" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Putaway Strategy Distribution</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={strategyDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" nameKey="strategy" label={({ strategy, count }) => `${strategy.split(" ")[0]} (${count})`} labelLine={{ stroke: "#94a3b8" }}>
                          {strategyDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Warehouse Putaway Performance</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={warehousePerf} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="warehouse" type="category" width={110} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="putaways" fill="#6366f1" radius={[0, 4, 4, 0]} name="Putaways" />
                        <Bar dataKey="avgTime" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Avg Time (min)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Task Priority Distribution</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={priorityDist} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="count" nameKey="priority" label={({ priority, count }) => `${priority} (${count})`}>
                          {priorityDist.map((_, i) => <Cell key={i} fill={["#ef4444", "#f97316", "#eab308", "#94a3b8"][i]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Zone Utilization */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Zone Utilization</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={zoneUtil} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                      <YAxis dataKey="zone" type="category" width={90} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v: number) => `${v}%`} />
                      <Bar dataKey="utilization" radius={[0, 6, 6, 0]} name="Utilization %">
                        {zoneUtil.map((entry, i) => (
                          <Cell key={i} fill={entry.utilization >= 85 ? "#ef4444" : entry.utilization >= 70 ? "#f59e0b" : "#10b981"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Team Performance Table */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Putaway Team Performance</CardTitle></CardHeader>
                <CardContent>
                  <div className="pa-table-wrap">
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Operator</TableHead>
                          <TableHead className="text-xs">Cert</TableHead>
                          <TableHead className="text-xs">Warehouse</TableHead>
                          <TableHead className="text-xs text-right">Completed</TableHead>
                          <TableHead className="text-xs text-right">Avg Time</TableHead>
                          <TableHead className="text-xs">Accuracy</TableHead>
                          <TableHead className="text-xs">Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {operatorPerf.map((op) => (
                          <TableRow key={op.id}>
                            <TableCell className="text-xs font-medium">{op.name}</TableCell>
                            <TableCell><CertBadge cert={op.cert} /></TableCell>
                            <TableCell className="text-xs">{op.warehouse}</TableCell>
                            <TableCell className="text-xs text-right">{op.completed}</TableCell>
                            <TableCell className="text-xs text-right">{op.avgTime} min</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MiniBar value={op.accuracy} max={100} colorClass="pa-progress-fill-emerald" />
                                <span className="text-xs">{op.accuracy}%</span>
                              </div>
                            </TableCell>
                            <TableCell><StarRating rating={op.rating} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════════════════ TAB 2: PUTAWAY QUEUE ═══════════════════ */}
          {activeTab === "queue" && (
            <div className="mt-4 space-y-4">
              {/* Filter Bar */}
              <div className="pa-filter-bar">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input type="text" placeholder="Search task ID, pallet, SKU, product, warehouse..." className="w-full pl-8" value={queueSearch} onChange={(e) => setQueueSearch(e.target.value)} />
                </div>
                <select value={queueStatusFilter} onChange={(e) => setQueueStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={queuePriorityFilter} onChange={(e) => setQueuePriorityFilter(e.target.value)}>
                  <option value="All">All Priorities</option>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={queueStrategyFilter} onChange={(e) => setQueueStrategyFilter(e.target.value)}>
                  <option value="All">All Strategies</option>
                  {STRATEGIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Table */}
              <Card className="card-crud-lift shadow-sm">
                <CardContent className="glass-subtle p-0">
                  <div className="pa-table-wrap">
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Task ID</TableHead>
                          <TableHead className="text-xs">Pallet</TableHead>
                          <TableHead className="text-xs">SKU</TableHead>
                          <TableHead className="text-xs">Product</TableHead>
                          <TableHead className="text-xs text-right">Qty</TableHead>
                          <TableHead className="text-xs text-right">Weight</TableHead>
                          <TableHead className="text-xs">Strategy</TableHead>
                          <TableHead className="text-xs">Priority</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                          <TableHead className="text-xs">Zone</TableHead>
                          <TableHead className="text-xs">Target Bin</TableHead>
                          <TableHead className="text-xs">Warehouse</TableHead>
                          <TableHead className="text-xs">Assigned To</TableHead>
                          <TableHead className="text-xs">Equipment</TableHead>
                          <TableHead className="text-xs">Created</TableHead>
                          <TableHead className="text-xs">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleQueue.map((t) => (
                          <TableRow key={t.id} className={cn(
                            t.status === "In Progress" || t.status === "Scanning" ? "pa-row-in-progress" : "",
                            t.status === "Exception" ? "pa-row-exception" : "",
                            t.status === "Assigned" ? "pa-row-assigned" : "",
                          )}>
                            <TableCell className="text-xs font-mono font-semibold">{t.id}</TableCell>
                            <TableCell className="text-xs font-mono text-gray-500">{t.palletId}</TableCell>
                            <TableCell className="text-xs font-mono">{t.product.sku}</TableCell>
                            <TableCell className="text-xs max-w-[140px] truncate">{t.product.name}</TableCell>
                            <TableCell className="text-xs text-right">{t.qty}</TableCell>
                            <TableCell className="numeric-cell text-xs text-right">{t.weight} kg</TableCell>
                            <TableCell><StrategyBadge strategy={t.strategy} /></TableCell>
                            <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                            <TableCell><StatusBadge status={t.status} /></TableCell>
                            <TableCell className="text-xs">{t.zone.split(" ")[0] + " " + t.zone.split(" ")[1]}</TableCell>
                            <TableCell className="text-xs font-mono">{t.bin}</TableCell>
                            <TableCell className="text-xs">{t.warehouse}</TableCell>
                            <TableCell className="text-xs">{t.operator?.name || "—"}</TableCell>
                            <TableCell className="text-xs"><span className="pa-equip-badge">{t.equipment !== "—" ? t.equipment : "—"}</span></TableCell>
                            <TableCell className="text-xs">{t.createdAt}</TableCell>
                            <TableCell>
                              <button className="pa-action-btn" onClick={() => setSelectedTask(t)}>
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              <p className="text-xs text-gray-400">Showing {visibleQueue.length} of {filteredQueue.length} tasks</p>
            </div>
          )}

          {/* ═══════════════════ TAB 3: ZONE ASSIGNMENT ═══════════════════ */}
          {activeTab === "zones" && (
            <div className="mt-4 space-y-4">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Zones Configured", val: "6", icon: MapPin, cls: "pa-kpi-indigo" },
                  { title: "Active Zones", val: "6", icon: ShieldCheck, cls: "pa-kpi-emerald" },
                  { title: "Avg Utilization", val: "74.2%", icon: Gauge, cls: "pa-kpi-amber" },
                  { title: "Rebalance Alerts", val: "3", icon: AlertTriangle, cls: "pa-kpi-pink" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("pa-kpi-card", kpi.cls)}>
                    <p className="text-xs opacity-80 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.val}</p>
                    <kpi.icon className="absolute top-3 right-3 h-5 w-5 opacity-40" />
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Zone Utilization Radar</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={zoneRadar}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis tick={{ fontSize: 10 }} />
                        <Radar name="Zone A" dataKey="Zone A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                        <Radar name="Zone B" dataKey="Zone B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                        <Radar name="Zone C" dataKey="Zone C" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Zone Type Distribution</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={zoneTypeDist} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="count" nameKey="type" label={({ type }) => type}>
                          {zoneTypeDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Zone Detail Table */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Zone Details</CardTitle></CardHeader>
                <CardContent>
                  <div className="pa-table-wrap">
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Zone</TableHead>
                          <TableHead className="text-xs">Type</TableHead>
                          <TableHead className="text-xs text-right">Capacity (bins)</TableHead>
                          <TableHead className="text-xs">Utilized</TableHead>
                          <TableHead className="text-xs text-right">Available</TableHead>
                          <TableHead className="text-xs text-right">Current Items</TableHead>
                          <TableHead className="text-xs">Temperature</TableHead>
                          <TableHead className="text-xs">Restrictions</TableHead>
                          <TableHead className="text-xs">Operators</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {zoneDetails.map((zd) => (
                          <TableRow key={zd.zone}>
                            <TableCell className="text-xs font-semibold">{zd.zone}</TableCell>
                            <TableCell><ZoneTypeBadge type={zd.type} /></TableCell>
                            <TableCell className="text-xs text-right">{zd.capacity.toLocaleString("en-IN")}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <UtilBar value={zd.utilized} />
                                <span className="text-xs">{zd.utilized}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-right">{zd.available.toLocaleString("en-IN")}</TableCell>
                            <TableCell className="text-xs text-right">{zd.currentItems}</TableCell>
                            <TableCell className="text-xs">{zd.temperature !== "—" ? <span className="pa-temp-badge">{zd.temperature}</span> : "—"}</TableCell>
                            <TableCell className="text-xs max-w-[180px] truncate">{zd.restrictions}</TableCell>
                            <TableCell className="text-xs">{zd.assignedOps.join(", ")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════════════════ TAB 4: BIN OPTIMIZATION ═══════════════════ */}
          {activeTab === "bins" && (
            <div className="mt-4 space-y-4">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Total Bins", val: "2,400", icon: Boxes, cls: "pa-kpi-indigo" },
                  { title: "Optimized", val: "1,856", icon: CheckCircle2, cls: "pa-kpi-emerald" },
                  { title: "Defrag Score", val: "87.3%", icon: Target, cls: "pa-kpi-amber" },
                  { title: "Travel Saved", val: "1,240m", icon: TrendingUp, cls: "pa-kpi-cyan" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("pa-kpi-card", kpi.cls)}>
                    <p className="text-xs opacity-80 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.val}</p>
                    <kpi.icon className="absolute top-3 right-3 h-5 w-5 opacity-40" />
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Bin Occupancy Distribution</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={binOccupancy}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" name="Bins" radius={[6, 6, 0, 0]}>
                          {binOccupancy.map((_, i) => (
                            <Cell key={i} fill={i < 3 ? ["#6366f1", "#10b981", "#f59e0b"][i] : i === 3 ? "#ef4444" : "#dc2626"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Velocity vs Occupancy</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="velocity" name="Velocity" tick={{ fontSize: 11 }} label={{ value: "Velocity", position: "insideBottom", offset: -5, fontSize: 11 }} />
                        <YAxis dataKey="occupancy" name="Occupancy" tick={{ fontSize: 11 }} label={{ value: "Occupancy %", angle: -90, position: "insideLeft", fontSize: 11 }} />
                        <ZAxis dataKey="capacity" range={[40, 400]} />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: number) => v} labelFormatter={(label) => `Velocity: ${label}`} />
                        <Scatter data={velocityOccupancy} fill="#6366f1" fillOpacity={0.6} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Optimization Suggestions Table */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Optimization Suggestions</CardTitle></CardHeader>
                <CardContent>
                  <div className="pa-table-wrap">
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Bin ID</TableHead>
                          <TableHead className="text-xs">Zone</TableHead>
                          <TableHead className="text-xs">Occupancy</TableHead>
                          <TableHead className="text-xs">Action</TableHead>
                          <TableHead className="text-xs text-right">Savings (min)</TableHead>
                          <TableHead className="text-xs">Priority</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {optSuggestions.map((opt) => (
                          <TableRow key={opt.binId + opt.action}>
                            <TableCell className="text-xs font-mono">{opt.binId}</TableCell>
                            <TableCell className="text-xs">{opt.zone}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <UtilBar value={opt.occupancy} />
                                <span className="text-xs">{opt.occupancy}%</span>
                              </div>
                            </TableCell>
                            <TableCell><ActionBadge action={opt.action} /></TableCell>
                            <TableCell className="text-xs text-right">{opt.savings} min</TableCell>
                            <TableCell><PriorityBadge priority={opt.priority} /></TableCell>
                            <TableCell><StatusBadge status={opt.status} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════════════════ TAB 5: ANALYTICS ═══════════════════ */}
          {activeTab === "analytics" && (
            <div className="mt-4 space-y-4">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Dock-to-Stock Time", val: "2.1 hrs", icon: Timer, cls: "pa-kpi-indigo" },
                  { title: "Space Utilization", val: "74.2%", icon: Gauge, cls: "pa-kpi-emerald" },
                  { title: "Labor Efficiency", val: "14.2 tasks/hr", icon: Zap, cls: "pa-kpi-amber" },
                  { title: "Cost per Putaway", val: "₹42.50", icon: IndianRupee, cls: "pa-kpi-pink" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("pa-kpi-card", kpi.cls)}>
                    <p className="text-xs opacity-80 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.val}</p>
                    <kpi.icon className="absolute top-3 right-3 h-5 w-5 opacity-40" />
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Putaway Cost Trend</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={costTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Area type="monotone" dataKey="labor" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Labor" />
                        <Area type="monotone" dataKey="equipment" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Equipment" />
                        <Area type="monotone" dataKey="overhead" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Overhead" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Strategy Effectiveness</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={stratEffectiveness}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="strategy" tick={{ fontSize: 9 }} />
                        <PolarRadiusAxis tick={{ fontSize: 10 }} />
                        <Radar name="Speed" dataKey="speed" stroke={PIE_RADAR_COLORS[0]} fill={PIE_RADAR_COLORS[0]} fillOpacity={0.15} />
                        <Radar name="Accuracy" dataKey="accuracy" stroke={PIE_RADAR_COLORS[1]} fill={PIE_RADAR_COLORS[1]} fillOpacity={0.15} />
                        <Radar name="Space" dataKey="space" stroke={PIE_RADAR_COLORS[2]} fill={PIE_RADAR_COLORS[2]} fillOpacity={0.15} />
                        <Radar name="Cost" dataKey="cost" stroke={PIE_RADAR_COLORS[3]} fill={PIE_RADAR_COLORS[3]} fillOpacity={0.15} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Improvement Areas Table */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Improvement Areas</CardTitle></CardHeader>
                <CardContent>
                  <div className="pa-table-wrap">
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Area</TableHead>
                          <TableHead className="text-xs">Current</TableHead>
                          <TableHead className="text-xs">Target</TableHead>
                          <TableHead className="text-xs">Gap</TableHead>
                          <TableHead className="text-xs text-right">Potential Savings</TableHead>
                          <TableHead className="text-xs">Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {improvementAreas.map((area) => (
                          <TableRow key={area.area}>
                            <TableCell className="text-xs font-medium">{area.area}</TableCell>
                            <TableCell className="text-xs">{area.current}</TableCell>
                            <TableCell className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{area.target}</TableCell>
                            <TableCell className="text-xs text-red-500 dark:text-red-400">{area.gap}</TableCell>
                            <TableCell className="text-xs text-right font-semibold">₹{area.savings.toLocaleString("en-IN")}</TableCell>
                            <TableCell><PriorityBadge priority={area.priority} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Tabs>
      </div>

      {/* ─── Putaway Task Detail Drawer ─── */}
      <Drawer open={!!selectedTask} onClose={() => setSelectedTask(null)}>
        {selectedTask && (
          <div className="pa-drawer-content">
            {/* Status Banner */}
            <div className={cn(
              "pa-drawer-status",
              selectedTask.status === "Completed" ? "pa-drawer-done"
                : selectedTask.status === "In Progress" || selectedTask.status === "Scanning" ? "pa-drawer-active"
                : selectedTask.status === "Assigned" ? "pa-drawer-assigned"
                : selectedTask.status === "Exception" ? "pa-drawer-exception"
                : "pa-drawer-default"
            )}>
              {selectedTask.status === "Completed" ? <CheckCircle2 className="h-4 w-4" />
                : selectedTask.status === "Exception" ? <AlertTriangle className="h-4 w-4" />
                : selectedTask.status === "In Progress" || selectedTask.status === "Scanning" ? <Zap className="h-4 w-4" />
                : <Package className="h-4 w-4" />}
              <span className="text-sm font-medium">{selectedTask.status}</span>
            </div>

            <h3 className="pa-drawer-title">{selectedTask.id}</h3>
            <p className="pa-drawer-subtitle">Pallet {selectedTask.palletId} — {selectedTask.product.name}</p>

            {/* Item Flow: Dock → Staging → Bin */}
            <div className="pa-item-flow">
              <div className="pa-flow-dot pa-flow-dock">
                <PackagePlus className="h-4 w-4" />
                <span className="text-xs">Dock</span>
              </div>
              <div className="pa-flow-arrow"><ChevronRight className="h-3.5 w-3.5" /></div>
              <div className="pa-flow-dot pa-flow-staging">
                <Warehouse className="h-4 w-4" />
                <span className="text-xs">Staging</span>
              </div>
              <div className="pa-flow-arrow"><ArrowRight className="h-3.5 w-3.5" /></div>
              <div className="pa-flow-dot pa-flow-bin">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">{selectedTask.bin}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="pa-info-grid mt-3">
              <div className="pa-info-item"><span className="pa-info-label">Pallet ID</span><span className="pa-info-value font-mono">{selectedTask.palletId}</span></div>
              <div className="pa-info-item"><span className="pa-info-label">SKU</span><span className="pa-info-value font-mono">{selectedTask.product.sku}</span></div>
              <div className="pa-info-item"><span className="pa-info-label">Product</span><span className="pa-info-value">{selectedTask.product.name}</span></div>
              <div className="pa-info-item"><span className="pa-info-label">Category</span><span className="pa-info-value">{selectedTask.product.cat}</span></div>
              <div className="pa-info-item"><span className="pa-info-label">Quantity</span><span className="pa-info-value">{selectedTask.qty}</span></div>
              <div className="pa-info-item"><span className="pa-info-label">Weight</span><span className="pa-info-value">{selectedTask.weight} kg</span></div>
              <div className="pa-info-item"><span className="pa-info-label">Dimensions</span><span className="pa-info-value">{selectedTask.product.dims} cm</span></div>
              <div className="pa-info-item"><span className="pa-info-label">Value</span><span className="pa-info-value">₹{selectedTask.product.value.toLocaleString("en-IN")}</span></div>
            </div>

            {/* Assignment Box */}
            <div className="pa-assign-box mt-3">
              <h4 className="pa-section-heading">Assignment</h4>
              <div className="pa-info-grid">
                <div className="pa-info-item"><span className="pa-info-label">Zone</span><span className="pa-info-value">{selectedTask.zone}</span></div>
                <div className="pa-info-item"><span className="pa-info-label">Bin Location</span><span className="pa-info-value font-mono">{selectedTask.bin}</span></div>
                <div className="pa-info-item"><span className="pa-info-label">Operator</span><span className="pa-info-value">{selectedTask.operator?.name || "Unassigned"}</span></div>
                <div className="pa-info-item"><span className="pa-info-label">Equipment</span><span className="pa-info-value"><span className="pa-equip-badge">{selectedTask.equipment}</span></span></div>
              </div>
              <div className="mt-2">
                <span className="pa-info-label">Strategy</span>{" "}
                <StrategyBadge strategy={selectedTask.strategy} />
              </div>
            </div>

            {/* Compliance Checks */}
            <div className="pa-compliance-box mt-3">
              <h4>Compliance Checks</h4>
              <div className="space-y-1.5">
                {[
                  { label: "Zone Restriction", pass: true },
                  { label: "Weight Limit", pass: true },
                  { label: "Stack Height", pass: true },
                  { label: "Hazardous Material", pass: selectedTask.product.cat !== "Industrial" },
                ].map((check) => (
                  <div key={check.label} className="pa-compliance-check">
                    <CheckCircle2 className={cn("h-3.5 w-3.5", check.pass ? "text-emerald-500" : "text-red-500")} />
                    <span className={cn(check.pass ? "" : "text-red-500")}>{check.label} {check.pass ? "✓" : "✗"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Putaway Timeline */}
            <div className="pa-timeline mt-3">
              <h4 className="pa-section-heading">Putaway Timeline</h4>
              <div className="pa-timeline-track">
                {[
                  { step: "Received at Dock", date: selectedTask.createdAt },
                  { step: "Scanned & Labeled", date: selectedTask.assignedAt },
                  { step: "Strategy Applied", date: selectedTask.assignedAt },
                  { step: "Moved to Bin", date: selectedTask.completedAt },
                  { step: "Confirmed", date: selectedTask.status === "Completed" ? selectedTask.completedAt : null },
                ].map((item, i) => {
                  const isDone = !!item.date
                  const stepOrder = ["Pending", "Assigned", "In Progress", "Scanning", "Completed", "Exception"]
                  const currentIdx = stepOrder.indexOf(selectedTask.status)
                  const timelineMapping = [0, 1, 2, 2, 4, 4]
                  const currentTimelineStep = timelineMapping[currentIdx] ?? 0
                  const isCurrent = i === currentTimelineStep && selectedTask.status !== "Completed"
                  return (
                    <div key={item.step} className="pa-timeline-step">
                      <div className={cn(
                        "pa-timeline-dot",
                        isDone && "pa-dot-done",
                        isCurrent && "pa-dot-current",
                        selectedTask.status === "Exception" && i === 2 && "pa-dot-exception",
                      )} />
                      <span className={cn("pa-timeline-label", isDone && "pa-label-done", isCurrent && "pa-label-current", selectedTask.status === "Exception" && i === 2 && "pa-label-exception")}>{item.step}</span>
                      <span className="pa-timeline-date">{item.date || "—"}</span>
                      {i < 4 && <div className={cn("pa-timeline-connector", isDone && "pa-connector-done", isCurrent && "pa-connector-current")} />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pa-drawer-footer mt-3">
              <div className="pa-footer-item">
                <span className="pa-info-label">Created</span>
                <span className="pa-info-value">{selectedTask.createdAt}</span>
              </div>
              <div className="pa-footer-item">
                <span className="pa-info-label">Assigned</span>
                <span className="pa-info-value">{selectedTask.assignedAt || "—"}</span>
              </div>
              <div className="pa-footer-item">
                <span className="pa-info-label">Completed</span>
                <span className="pa-info-value">{selectedTask.completedAt || "—"}</span>
              </div>
              <div className="pa-footer-item">
                <span className="pa-info-label">Duration</span>
                <span className="pa-info-value">{selectedTask.duration ? `${selectedTask.duration} min` : "—"}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
