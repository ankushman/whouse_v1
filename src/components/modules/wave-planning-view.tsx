"use client"

import { useState, useMemo } from "react"
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
  Waves, Play, Pause, CheckCircle2, Clock, AlertTriangle, Zap,
  Search, Filter, TrendingUp, Target, Users, Package, Timer,
  BarChart3, ArrowUpRight, ArrowDownRight, Activity, Eye,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Seed-based deterministic data generation
// ─────────────────────────────────────────────────────────────────────────────
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const pickIdx = (arr: readonly unknown[]): number => Math.floor(rand() * arr.length)

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}

const rand = createRng(128128)

// ─────────────────────────────────────────────────────────────────────────────
// Constants & Config
// ─────────────────────────────────────────────────────────────────────────────
const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const WH_SHORT = ["MUM", "DEL", "CHE", "KOL", "BLR", "PUN"]

const WAVE_STRATEGIES = ["Batch", "Zone", "Discrete", "Cluster", "Multi-Order"] as const
const WAVE_PRIORITIES = ["Critical", "High", "Medium", "Low"] as const
const WAVE_STATUSES = ["Pending", "In Progress", "Picking", "Packing", "Completed", "Cancelled"] as const
const PICK_STATUSES = ["Pending", "Assigned", "In Progress", "Completed", "Short", "Skipped"] as const
const PACK_STATUSES = ["Queued", "Packing", "Verified", "Sealed", "Shipped"] as const

const INDIAN_PRODUCTS = [
  { sku: "F&B-1001", name: "Basmati Rice 25kg", category: "Food" },
  { sku: "F&B-1002", name: "Turmeric Powder 500g", category: "Food" },
  { sku: "F&B-1003", name: "Organic Tea 1kg", category: "Food" },
  { sku: "F&B-1004", name: "Coconut Oil 5L", category: "Food" },
  { sku: "F&B-1005", name: "Millet Flour 10kg", category: "Food" },
  { sku: "F&B-1006", name: "Ghee Tin 15kg", category: "Food" },
  { sku: "PHR-2001", name: "Paracetamol 500mg", category: "Pharma" },
  { sku: "PHR-2002", name: "Vitamin D3 Capsules", category: "Pharma" },
  { sku: "PHR-2003", name: "Cetirizine 10mg", category: "Pharma" },
  { sku: "PHR-2004", name: "ORS Sachets 100pc", category: "Pharma" },
  { sku: "PHR-2005", name: "Chyawanprash 500g", category: "Pharma" },
  { sku: "ELC-3001", name: "LED Panel 2x2ft", category: "Electronics" },
  { sku: "ELC-3002", name: "USB-C Cable 1m", category: "Electronics" },
  { sku: "ELC-3003", name: "Bluetooth Speaker", category: "Electronics" },
  { sku: "ELC-3004", name: "Smart Watch Band", category: "Electronics" },
  { sku: "ELC-3005", name: "Power Bank 20000mAh", category: "Electronics" },
  { sku: "AUT-4001", name: "Air Filter Assembly", category: "Auto Parts" },
  { sku: "AUT-4002", name: "Brake Pad Set", category: "Auto Parts" },
  { sku: "AUT-4003", name: "Engine Oil 5L", category: "Auto Parts" },
  { sku: "AUT-4004", name: "Wiper Blade Set", category: "Auto Parts" },
  { sku: "AUT-4005", name: "Radiator Coolant 4L", category: "Auto Parts" },
  { sku: "IND-5001", name: "Hex Bolt M12x40", category: "Industrial" },
  { sku: "IND-5002", name: "Ball Bearing 6205", category: "Industrial" },
  { sku: "IND-5003", name: "PVC Pipe 4in", category: "Industrial" },
  { sku: "IND-5004", name: "Welding Rod 2.5mm", category: "Industrial" },
  { sku: "IND-5005", name: "Wire Rope 10mm", category: "Industrial" },
  { sku: "TXT-6001", name: "Cotton Fabric Roll", category: "Textile" },
  { sku: "TXT-6002", name: "Silk Saree Set", category: "Textile" },
  { sku: "TXT-6003", name: "Polyester Yarn 5kg", category: "Textile" },
  { sku: "TXT-6004", name: "Denim Fabric 50m", category: "Textile" },
  { sku: "TXT-6005", name: "Jute Bag Pack 100pc", category: "Textile" },
]

const PICKERS = [
  { id: "PK-001", name: "Rajesh Kumar", zone: "A", rate: 42 },
  { id: "PK-002", name: "Amit Sharma", zone: "A", rate: 38 },
  { id: "PK-003", name: "Sunil Patel", zone: "B", rate: 45 },
  { id: "PK-004", name: "Priya Singh", zone: "B", rate: 41 },
  { id: "PK-005", name: "Vikram Das", zone: "C", rate: 35 },
  { id: "PK-006", name: "Deepak Yadav", zone: "C", rate: 33 },
  { id: "PK-007", name: "Kavita Joshi", zone: "D", rate: 39 },
  { id: "PK-008", name: "Manoj Gupta", zone: "D", rate: 37 },
  { id: "PK-009", name: "Suresh Reddy", zone: "E", rate: 44 },
  { id: "PK-010", name: "Anil Verma", zone: "E", rate: 40 },
  { id: "PK-011", name: "Ramesh Iyer", zone: "A", rate: 36 },
  { id: "PK-012", name: "Ashok Nair", zone: "B", rate: 43 },
]

const PACKERS = [
  { id: "PA-001", name: "Meena Kumari", station: "PS-01" },
  { id: "PA-002", name: "Lakshmi Devi", station: "PS-02" },
  { id: "PA-003", name: "Rani Mukherjee", station: "PS-03" },
  { id: "PA-004", name: "Sunita Sharma", station: "PS-04" },
  { id: "PA-005", name: "Geeta Devi", station: "PS-05" },
  { id: "PA-006", name: "Pooja Agarwal", station: "PS-06" },
]

const ZONES = ["Zone A - High Velocity", "Zone B - Medium", "Zone C - Bulk", "Zone D - Cold Storage", "Zone E - Hazmat", "Zone F - Returns"]
const ZONE_SHORT = ["A", "B", "C", "D", "E", "F"]

const CARRIER_NAMES = ["Delhivery", "BlueDart", "DTDC", "Ecom Express", "India Post", "Shadowfax", "XpressBees", "Gati"]

const COLORS = {
  amber: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800", fill: "#f59e0b" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800", fill: "#6366f1" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", fill: "#10b981" },
}

const PIE_COLORS = ["#f59e0b", "#6366f1", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#f43f5e", "#84cc16"]

// ─────────────────────────────────────────────────────────────────────────────
// Generate Mock Data
// ─────────────────────────────────────────────────────────────────────────────
const MONTHS = ["Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26"]

// Wave data
const waves: Array<{
  id: string; warehouse: string; whShort: string; zone: string;
  strategy: string; priority: string; status: string;
  orderCount: number; lineCount: number; pickCount: number; pickerCount: number;
  picker: typeof PICKERS[0]; packer: typeof PACKERS[0];
  completion: number; pickRate: number; accuracy: number;
  estimatedTime: number; actualTime: number | null;
  createdDate: string; createdTime: string; carrier: string;
}> = (() => {
  const result: typeof waves = []
  for (let i = 0; i < 80; i++) {
    const wh = pickIdx(WAREHOUSES)
    const status = pick(WAVE_STATUSES)
    const priority = pick(WAVE_PRIORITIES)
    const strategy = pick(WAVE_STRATEGIES)
    const orderCount = Math.floor(rand() * 120) + 10
    const lineCount = Math.floor(rand() * 400) + 20
    const pickCount = Math.floor(rand() * 600) + 30
    const pickerCount = Math.floor(rand() * 8) + 1
    const completion = status === "Completed" ? 100 : status === "Cancelled" ? 0 : status === "Pending" ? 0 : Math.floor(rand() * 85) + 10
    const pickRate = Math.floor(rand() * 30) + 25
    const accuracy = Math.floor(rand() * 8) + 92
    const hour = Math.floor(rand() * 12) + 6
    const min = pick([0, 15, 30, 45])
    const createdDate = new Date(2026, 6, Math.floor(rand() * 28) + 1, hour, min)
    result.push({
      id: `WV-${String(128000 + i).padStart(6, '0')}`,
      warehouse: WAREHOUSES[wh],
      whShort: WH_SHORT[wh],
      zone: pick(ZONES),
      strategy,
      priority,
      status,
      orderCount,
      lineCount,
      pickCount,
      pickerCount,
      picker: pick(PICKERS),
      packer: pick(PACKERS),
      completion,
      pickRate,
      accuracy,
      estimatedTime: Math.floor(rand() * 180) + 30,
      actualTime: status === "Completed" ? Math.floor(rand() * 200) + 25 : null,
      createdDate: createdDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      createdTime: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      carrier: pick(CARRIER_NAMES),
    })
  }
  return result
})()

// Pick list data
const pickLists: Array<{
  id: string; waveId: string; warehouse: string; zone: string; bin: string;
  sku: string; product: string; category: string; qty: number; pickedQty: number;
  status: string; picker: typeof PICKERS[0]; priority: string; travelDist: number;
  estTime: number; actualTime: number | null; batchNo: string; expiryDate: string; lotNo: string;
}> = (() => {
  const result: typeof pickLists = []
  for (let i = 0; i < 150; i++) {
    const wave = pick(waves)
    const product = pick(INDIAN_PRODUCTS)
    const status = pick(PICK_STATUSES)
    const qty = Math.floor(rand() * 100) + 1
    const bin = `BIN-${Math.floor(rand() * 6) + 1}${String(Math.floor(rand() * 12) + 1).padStart(2, '0')}${String(Math.floor(rand() * 5) + 1)}${String(Math.floor(rand() * 8) + 1).padStart(2, '0')}`
    const picker = pick(PICKERS)
    const travelDist = Math.floor(rand() * 500) + 50
    const priority = pick(WAVE_PRIORITIES)
    result.push({
      id: `PL-${String(128000 + i).padStart(6, '0')}`,
      waveId: wave.id,
      warehouse: wave.warehouse,
      zone: pick(ZONE_SHORT),
      bin,
      sku: product.sku,
      product: product.name,
      category: product.category,
      qty,
      pickedQty: status === "Completed" ? qty : status === "In Progress" ? Math.floor(rand() * qty) : 0,
      status,
      picker,
      priority,
      travelDist,
      estTime: Math.floor(rand() * 15) + 2,
      actualTime: status === "Completed" ? Math.floor(rand() * 18) + 1 : null,
      batchNo: `BATCH-${String(Math.floor(rand() * 9000) + 1000)}`,
      expiryDate: new Date(2026, Math.floor(rand() * 12), Math.floor(rand() * 28) + 1).toLocaleDateString('en-IN'),
      lotNo: `LOT-${String(Math.floor(rand() * 500) + 100).padStart(4, '0')}`,
    })
  }
  return result
})()

// Packing station data
const packingData: Array<{
  id: string; station: string; packer: typeof PACKERS[0]; warehouse: string;
  orderId: string; product: typeof INDIAN_PRODUCTS[0]; items: number; boxType: string;
  weight: number; weightKg: string; status: string; verified: boolean;
  sealNo: string | null; dimension: string; labelPrinted: boolean;
  carrier: string; awbNo: string | null; startTime: string; endTime: string | null;
}> = (() => {
  const result: typeof packingData = []
  for (let i = 0; i < 40; i++) {
    const wh = pickIdx(WAREHOUSES)
    const packer = pick(PACKERS)
    const product = pick(INDIAN_PRODUCTS)
    const status = pick(PACK_STATUSES)
    const items = Math.floor(rand() * 20) + 1
    const boxType = pick(["Small Box", "Medium Box", "Large Box", "Pallet", "Mailer", "Poly Bag", "Custom Crate"])
    const weight = Math.floor(rand() * 25000) + 500
    const verified = status === "Verified" || status === "Sealed" || status === "Shipped"
    result.push({
      id: `PK-${String(128000 + i).padStart(6, '0')}`,
      station: packer.station,
      packer,
      warehouse: WAREHOUSES[wh],
      orderId: `ORD-${String(Math.floor(rand() * 90000) + 10000)}`,
      product,
      items,
      boxType,
      weight,
      weightKg: (weight / 1000).toFixed(1),
      status,
      verified,
      sealNo: verified ? `SEL-${String(Math.floor(rand() * 90000) + 10000)}` : null,
      dimension: `${Math.floor(rand() * 60) + 10}x${Math.floor(rand() * 40) + 5}x${Math.floor(rand() * 30) + 5}`,
      labelPrinted: verified,
      carrier: pick(CARRIER_NAMES),
      awbNo: status === "Shipped" ? pick(["AWB-" + String(Math.floor(rand() * 999999999)).padStart(9, '0')]) : null,
      startTime: `${String(Math.floor(rand() * 4) + 6).padStart(2, '0')}:${String(pick([0, 15, 30, 45])).padStart(2, '0')}`,
      endTime: verified ? `${String(Math.floor(rand() * 4) + 10).padStart(2, '0')}:${String(pick([0, 15, 30, 45])).padStart(2, '0')}` : null,
    })
  }
  return result
})()

// Monthly trend data
const monthlyTrend = MONTHS.map((month, i) => ({
  month,
  wavesCreated: Math.floor(rand() * 60) + 80,
  wavesCompleted: Math.floor(rand() * 55) + 75,
  ordersFulfilled: Math.floor(rand() * 3000) + 2000,
  pickRate: Math.floor(rand() * 15) + 30,
  accuracy: Math.floor(rand() * 6) + 93,
  avgCycleTime: Math.floor(rand() * 30) + 40,
}))

// Zone distribution data
const zoneDistribution = ZONE_SHORT.map((zone, i) => ({
  zone: `Zone ${zone}`,
  waves: Math.floor(rand() * 40) + 10,
  picks: Math.floor(rand() * 200) + 50,
  utilization: Math.floor(rand() * 30) + 65,
  fillRate: Math.floor(rand() * 15) + 82,
}))

// Picker performance data
const pickerPerformance = PICKERS.map(p => {
  const totalPicks = Math.floor(rand() * 800) + 200
  const accuracy = Math.floor(rand() * 6) + 94
  const avgTime = Math.floor(rand() * 8) + 3
  const shortcuts = Math.floor(rand() * 5)
  return {
    ...p,
    totalPicks,
    accuracy,
    avgTime,
    shortcuts,
    productivity: Math.floor(totalPicks / 8),
    rating: accuracy >= 98 ? 5 : accuracy >= 96 ? 4 : accuracy >= 94 ? 3 : 2,
  }
})

// KPI calculations
const totalWaves = waves.length
const activeWaves = waves.filter(w => w.status === "In Progress" || w.status === "Picking").length
const completedWaves = waves.filter(w => w.status === "Completed").length
const pendingWaves = waves.filter(w => w.status === "Pending").length
const avgPickRate = Math.floor(waves.reduce((a, w) => a + w.pickRate, 0) / waves.length)
const avgAccuracy = Math.floor(waves.reduce((a, w) => a + w.accuracy, 0) / waves.length)

// Radar data for warehouse picking efficiency
const radarData = [
  { metric: "Pick Rate", value: avgPickRate, fullMark: 60 },
  { metric: "Accuracy", value: avgAccuracy, fullMark: 100 },
  { metric: "Utilization", value: 78, fullMark: 100 },
  { metric: "On-Time", value: 85, fullMark: 100 },
  { metric: "SLA Score", value: 91, fullMark: 100 },
  { metric: "Labor Eff.", value: 72, fullMark: 100 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function KpiCard({ title, value, subtitle, icon: Icon, colorClass, trend, trendValue }: {
  title: string; value: string; subtitle?: string;
  icon: React.ElementType; colorClass: string; trend?: "up" | "down"; trendValue?: string
}) {
  return (
    <Card className={cn("wave-kpi-card", colorClass)}>
      <CardContent className="inner-glow glass-subtle p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="wave-kpi-label">{title}</p>
            <p className="wave-kpi-value">{value}</p>
            {subtitle && <p className="wave-kpi-sub">{subtitle}</p>}
          </div>
          <div className="wave-kpi-icon">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" /> : <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />}
            <span className={cn("text-xs font-medium", trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StrategyBadge({ strategy }: { strategy: string }) {
  const cls: Record<string, string> = {
    Batch: "wave-badge-batch", Zone: "wave-badge-zone", Discrete: "wave-badge-discrete",
    Cluster: "wave-badge-cluster", "Multi-Order": "wave-badge-multi",
  }
  return <span className={cn("wave-badge", cls[strategy] || "")}>{strategy}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const cls: Record<string, string> = {
    Critical: "wave-badge-priority-critical", High: "wave-badge-priority-high",
    Medium: "wave-badge-priority-medium", Low: "wave-badge-priority-low",
  }
  return <span className={cn("wave-badge", cls[priority] || "")}>{priority}</span>
}

function WaveStatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Pending: "wave-badge-status-pending", "In Progress": "wave-badge-status-inprogress",
    Picking: "wave-badge-status-picking", Packing: "wave-badge-status-packing",
    Completed: "wave-badge-status-completed", Cancelled: "wave-badge-status-cancelled",
  }
  return <span className={cn("wave-badge", cls[status] || "")}>{status}</span>
}

function PickStatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Pending: "wave-badge-pick-pending", Assigned: "wave-badge-pick-assigned",
    "In Progress": "wave-badge-pick-inprogress", Completed: "wave-badge-pick-completed",
    Short: "wave-badge-pick-short", Skipped: "wave-badge-pick-skipped",
  }
  return <span className={cn("wave-badge", cls[status] || "")}>{status}</span>
}

function PackStatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Queued: "wave-badge-pack-queued", Packing: "wave-badge-pack-packing",
    Verified: "wave-badge-pack-verified", Sealed: "wave-badge-pack-sealed",
    Shipped: "wave-badge-pack-shipped",
  }
  return <span className={cn("wave-badge", cls[status] || "")}>{status}</span>
}

function CategoryBadge({ category }: { category: string }) {
  const cls: Record<string, string> = {
    Food: "wave-badge-cat-food", Pharma: "wave-badge-cat-pharma",
    Electronics: "wave-badge-cat-elec", "Auto Parts": "wave-badge-cat-auto",
    Industrial: "wave-badge-cat-ind", Textile: "wave-badge-cat-textile",
  }
  return <span className={cn("wave-badge", cls[category] || "")}>{category}</span>
}

// ─────────────────────────────────────────────────────────────────────────────
// Wave Detail Drawer
// ─────────────────────────────────────────────────────────────────────────────
function WaveDetailDrawer({ wave, onClose }: { wave: typeof waves[0]; onClose: () => void }) {
  const wavePicks = pickLists.filter(p => p.waveId === wave.id)
  return (
    <div className="wave-drawer-overlay" onClick={onClose}>
      <div className="wave-drawer" onClick={e => e.stopPropagation()}>
        <div className="wave-drawer-header">
          <div>
            <h3 className="wave-drawer-title">{wave.id}</h3>
            <p className="wave-drawer-subtitle">{wave.warehouse} &middot; {wave.strategy} Strategy</p>
          </div>
          <button className="wave-drawer-close" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <div className="wave-drawer-body">
          {/* Status Banner */}
          <div className={cn("wave-drawer-banner", wave.status === "Completed" ? "wave-drawer-banner-done" : wave.status === "Cancelled" ? "wave-drawer-banner-cancel" : "wave-drawer-banner-active")}>
            <div className="flex items-center gap-2">
              {wave.status === "Completed" ? <CheckCircle2 className="h-4 w-4" /> : wave.status === "Cancelled" ? <AlertTriangle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
              <span className="font-medium">{wave.status}</span>
            </div>
            <div className="mt-2">
              <div className="wave-drawer-progress-bar">
                <div className="wave-drawer-progress-fill" style={{ width: `${wave.completion}%` }} />
              </div>
              <span className="text-xs text-gray-500">{wave.completion}% complete</span>
            </div>
          </div>

          {/* Wave Details Grid */}
          <div className="wave-drawer-grid">
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Priority</span>
              <PriorityBadge priority={wave.priority} />
            </div>
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Zone</span>
              <span className="text-sm font-medium">{wave.zone}</span>
            </div>
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Orders</span>
              <span className="text-sm font-semibold">{wave.orderCount}</span>
            </div>
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Lines</span>
              <span className="text-sm font-semibold">{wave.lineCount}</span>
            </div>
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Total Picks</span>
              <span className="text-sm font-semibold">{wave.pickCount}</span>
            </div>
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Pickers</span>
              <span className="text-sm font-semibold">{wave.pickerCount}</span>
            </div>
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Pick Rate</span>
              <span className="text-sm font-semibold text-amber-600">{wave.pickRate} lines/hr</span>
            </div>
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Accuracy</span>
              <span className="text-sm font-semibold text-emerald-600">{wave.accuracy}%</span>
            </div>
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Est. Time</span>
              <span className="text-sm font-medium">{wave.estimatedTime} min</span>
            </div>
            {wave.actualTime && (
              <div className="wave-drawer-field">
                <span className="wave-drawer-label">Actual Time</span>
                <span className={cn("text-sm font-medium", wave.actualTime <= wave.estimatedTime ? "text-emerald-600" : "text-red-600")}>{wave.actualTime} min</span>
              </div>
            )}
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Carrier</span>
              <span className="text-sm font-medium">{wave.carrier}</span>
            </div>
            <div className="wave-drawer-field">
              <span className="wave-drawer-label">Picker Assigned</span>
              <span className="text-sm font-medium">{wave.picker.name}</span>
            </div>
          </div>

          {/* Performance Bars */}
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Completion</span>
                <span className="font-medium">{wave.completion}%</span>
              </div>
              <div className="wave-drawer-bar">
                <div className="wave-drawer-bar-fill wave-bar-amber" style={{ width: `${wave.completion}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Pick Accuracy</span>
                <span className="font-medium">{wave.accuracy}%</span>
              </div>
              <div className="wave-drawer-bar">
                <div className={cn("wave-drawer-bar-fill", wave.accuracy >= 96 ? "wave-bar-emerald" : wave.accuracy >= 90 ? "wave-bar-amber" : "wave-bar-red")} style={{ width: `${wave.accuracy}%` }} />
              </div>
            </div>
          </div>

          {/* Related Pick List */}
          <div className="mt-5">
            <h4 className="wave-drawer-section-title">Pick List Items ({wavePicks.length})</h4>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {wavePicks.slice(0, 10).map((p, idx) => (
                <div key={idx} className="wave-drawer-pick-row">
                  <div className="flex items-center gap-2">
                    <PickStatusBadge status={p.status} />
                    <span className="text-sm font-medium">{p.sku}</span>
                  </div>
                  <span className="text-xs text-gray-500">{p.product}</span>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">Qty: {p.pickedQty}/{p.qty}</span>
                    <span className="text-xs text-gray-400">{p.bin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Pick Detail Drawer
// ─────────────────────────────────────────────────────────────────────────────
function PickDetailDrawer({ pick, onClose }: { pick: typeof pickLists[0]; onClose: () => void }) {
  return (
    <div className="wave-drawer-overlay" onClick={onClose}>
      <div className="wave-drawer" onClick={e => e.stopPropagation()}>
        <div className="wave-drawer-header">
          <div>
            <h3 className="wave-drawer-title">{pick.id}</h3>
            <p className="wave-drawer-subtitle">Wave {pick.waveId}</p>
          </div>
          <button className="wave-drawer-close" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="wave-drawer-body">
          <div className={cn("wave-drawer-banner", pick.status === "Completed" ? "wave-drawer-banner-done" : pick.status === "Short" ? "wave-drawer-banner-cancel" : "wave-drawer-banner-active")}>
            <PickStatusBadge status={pick.status} />
          </div>
          <div className="wave-drawer-grid">
            <div className="wave-drawer-field"><span className="wave-drawer-label">SKU</span><span className="text-sm font-medium">{pick.sku}</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Product</span><span className="text-sm font-medium">{pick.product}</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Category</span><CategoryBadge category={pick.category} /></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Bin Location</span><span className="text-sm font-mono font-semibold">{pick.bin}</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Zone</span><span className="text-sm font-medium">Zone {pick.zone}</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Priority</span><PriorityBadge priority={pick.priority} /></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Qty</span><span className="text-sm font-semibold">{pick.pickedQty}/{pick.qty}</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Batch No</span><span className="text-sm font-mono">{pick.batchNo}</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Lot No</span><span className="text-sm font-mono">{pick.lotNo}</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Expiry</span><span className="text-sm">{pick.expiryDate}</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Picker</span><span className="text-sm">{pick.picker.name}</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Travel Dist</span><span className="text-sm">{pick.travelDist}m</span></div>
            <div className="wave-drawer-field"><span className="wave-drawer-label">Est. Time</span><span className="text-sm">{pick.estTime} min</span></div>
            {pick.actualTime && <div className="wave-drawer-field"><span className="wave-drawer-label">Actual Time</span><span className="text-sm">{pick.actualTime} min</span></div>}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Pick Progress</span>
              <span className="font-medium">{Math.floor((pick.pickedQty / pick.qty) * 100)}%</span>
            </div>
            <div className="wave-drawer-bar">
              <div className="wave-drawer-bar-fill wave-bar-amber" style={{ width: `${(pick.pickedQty / pick.qty) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function WavePlanningView() {
  const [activeTab, setActiveTab] = useState("overview")
  const [waveSearch, setWaveSearch] = useState("")
  const [waveStatusFilter, setWaveStatusFilter] = useState("all")
  const [waveStrategyFilter, setWaveStrategyFilter] = useState("all")
  const [pickSearch, setPickSearch] = useState("")
  const [pickStatusFilter, setPickStatusFilter] = useState("all")
  const [packSearch, setPackSearch] = useState("")
  const [selectedWave, setSelectedWave] = useState<typeof waves[0] | null>(null)
  const [selectedPick, setSelectedPick] = useState<typeof pickLists[0] | null>(null)
  const [perfSort, setPerfSort] = useState<"totalPicks" | "accuracy" | "avgTime">("totalPicks")

  // Filtered waves
  const filteredWaves = useMemo(() => {
    return waves.filter(w => {
      if (waveSearch && !w.id.toLowerCase().includes(waveSearch.toLowerCase()) && !w.warehouse.toLowerCase().includes(waveSearch.toLowerCase())) return false
      if (waveStatusFilter !== "all" && w.status !== waveStatusFilter) return false
      if (waveStrategyFilter !== "all" && w.strategy !== waveStrategyFilter) return false
      return true
    })
  }, [waveSearch, waveStatusFilter, waveStrategyFilter])

  // Filtered picks
  const filteredPicks = useMemo(() => {
    return pickLists.filter(p => {
      if (pickSearch && !p.id.toLowerCase().includes(pickSearch.toLowerCase()) && !p.sku.toLowerCase().includes(pickSearch.toLowerCase()) && !p.product.toLowerCase().includes(pickSearch.toLowerCase())) return false
      if (pickStatusFilter !== "all" && p.status !== pickStatusFilter) return false
      return true
    })
  }, [pickSearch, pickStatusFilter])

  // Filtered packing
  const filteredPacking = useMemo(() => {
    return packingData.filter(p => {
      if (packSearch && !p.id.toLowerCase().includes(packSearch.toLowerCase()) && !p.orderId.toLowerCase().includes(packSearch.toLowerCase())) return false
      return true
    })
  }, [packSearch])

  // Sorted picker performance
  const sortedPickers = useMemo(() => {
    return [...pickerPerformance].sort((a, b) => (b[perfSort] as number) - (a[perfSort] as number))
  }, [perfSort])

  // Wave strategy distribution
  const strategyData = WAVE_STRATEGIES.map(s => ({
    name: s,
    value: waves.filter(w => w.strategy === s).length,
  }))

  // Warehouse wave performance
  const warehouseWaveData = WAREHOUSES.map((wh, i) => ({
    name: WH_SHORT[i],
    waves: waves.filter(w => w.warehouse === wh).length,
    completed: waves.filter(w => w.warehouse === wh && w.status === "Completed").length,
    avgRate: Math.floor(waves.filter(w => w.warehouse === wh).reduce((a, w) => a + w.pickRate, 0) / Math.max(1, waves.filter(w => w.warehouse === wh).length)),
  }))

  return (
    <div className="wave-container">
      {/* Header */}
      <div className="wave-header">
        <div className="flex items-center gap-3">
          <div className="wave-header-icon">
            <Waves className="h-6 w-6" />
          </div>
          <div>
            <h1 className="wave-header-title">Wave Planning & Picking Management</h1>
            <p className="wave-header-subtitle">Optimize order fulfillment waves, pick lists, and picker productivity</p>
          </div>
        </div>
        <div className="wave-header-badges">
          <span className="wave-header-badge wave-hb-total">{totalWaves} Waves</span>
          <span className="wave-header-badge wave-hb-active">{activeWaves} Active</span>
          <span className="wave-header-badge wave-hb-completed">{completedWaves} Completed</span>
          <span className="wave-header-badge wave-hb-pending">{pendingWaves} Pending</span>
          <span className="wave-header-badge wave-hb-rate">{avgPickRate} lines/hr</span>
          <span className="wave-header-badge wave-hb-accuracy">{avgAccuracy}% Accuracy</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
        <TabsList className="wave-tabs-list">
          <TabsTrigger value="overview" className="wave-tab-trigger">
            <BarChart3 className="h-4 w-4 mr-1.5" /> Wave Dashboard
          </TabsTrigger>
          <TabsTrigger value="waves" className="wave-tab-trigger">
            <Waves className="h-4 w-4 mr-1.5" /> Wave Queue
          </TabsTrigger>
          <TabsTrigger value="picks" className="wave-tab-trigger">
            <Target className="h-4 w-4 mr-1.5" /> Pick Lists
          </TabsTrigger>
          <TabsTrigger value="packing" className="wave-tab-trigger">
            <Package className="h-4 w-4 mr-1.5" /> Packing Stations
          </TabsTrigger>
          <TabsTrigger value="performance" className="wave-tab-trigger">
            <TrendingUp className="h-4 w-4 mr-1.5" /> Picker Performance
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: WAVE DASHBOARD OVERVIEW */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="wave-tab-content">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <KpiCard title="Total Waves" value={String(totalWaves)} icon={Waves} colorClass="wave-kpi-amber" trend="up" trendValue="+12% vs last month" />
              <KpiCard title="Active Waves" value={String(activeWaves)} icon={Zap} colorClass="wave-kpi-indigo" trend="up" trendValue="+3 today" />
              <KpiCard title="Avg Pick Rate" value={`${avgPickRate}/hr`} icon={Target} colorClass="wave-kpi-emerald" trend="up" trendValue="+5% improvement" />
              <KpiCard title="Accuracy" value={`${avgAccuracy}%`} icon={CheckCircle2} colorClass="wave-kpi-amber" trend="up" trendValue="+1.2% vs target" />
              <KpiCard title="Pending Waves" value={String(pendingWaves)} icon={Clock} colorClass="wave-kpi-indigo" />
              <KpiCard title="Active Pickers" value={`${PICKERS.length}`} icon={Users} colorClass="wave-kpi-emerald" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Wave Strategy Distribution */}
              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Wave Strategy Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={strategyData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {strategyData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Warehouse Wave Performance */}
              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Warehouse Wave Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={warehouseWaveData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="waves" fill="#f59e0b" name="Total Waves" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pick Efficiency Radar */}
              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Picking Efficiency Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Current" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                      <Radar name="Target" dataKey="fullMark" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Monthly Wave & Fulfillment Trend */}
              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Monthly Wave & Fulfillment Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="wavesCreated" fill="#f59e0b" name="Waves Created" radius={[3, 3, 0, 0]} />
                      <Bar yAxisId="left" dataKey="wavesCompleted" fill="#10b981" name="Waves Completed" radius={[3, 3, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="pickRate" stroke="#6366f1" name="Pick Rate/hr" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Accuracy & Cycle Time Trend */}
              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Accuracy & Cycle Time Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" domain={[88, 100]} tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area yAxisId="left" type="monotone" dataKey="accuracy" fill="#10b981" stroke="#10b981" fillOpacity={0.2} name="Accuracy %" />
                      <Line yAxisId="right" type="monotone" dataKey="avgCycleTime" stroke="#f59e0b" strokeWidth={2} name="Cycle Time (min)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Zone Utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Zone Pick Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={zoneDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="zone" type="category" width={80} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="utilization" fill="#f59e0b" name="Utilization %" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="fillRate" fill="#6366f1" name="Fill Rate %" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Pickers Summary */}
              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Top Picker Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sortedPickers.slice(0, 5).map((p, idx) => (
                      <div key={p.id} className="wave-leaderboard-row">
                        <div className="flex items-center gap-3">
                          <span className={cn("wave-leaderboard-rank", idx === 0 ? "wave-rank-gold" : idx === 1 ? "wave-rank-silver" : idx === 2 ? "wave-rank-bronze" : "wave-rank-default")}>
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{p.name}</span>
                              <span className="text-xs text-gray-500">Zone {p.zone}</span>
                            </div>
                            <div className="flex gap-4 mt-1">
                              <span className="text-xs text-gray-400">{p.totalPicks} picks</span>
                              <span className="text-xs text-emerald-600 font-medium">{p.accuracy}% acc</span>
                              <span className="text-xs text-amber-600">{p.avgTime}s avg</span>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <span key={s} className={cn("wave-star", s < p.rating ? "wave-star-filled" : "wave-star-empty")}>&#9733;</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: WAVE QUEUE MANAGEMENT */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "waves" && (
          <div className="wave-tab-content">
            {/* Filters */}
            <div className="wave-filter-bar">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input className="wave-filter-input" placeholder="Search wave ID or warehouse..." value={waveSearch} onChange={e => setWaveSearch(e.target.value)} />
              </div>
              <select className="wave-filter-select" value={waveStatusFilter} onChange={e => setWaveStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {WAVE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="wave-filter-select" value={waveStrategyFilter} onChange={e => setWaveStrategyFilter(e.target.value)}>
                <option value="all">All Strategies</option>
                {WAVE_STRATEGIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Badge variant="outline" className="badge-interactive text-xs">{filteredWaves.length} waves</Badge>
            </div>

            {/* Wave Table */}
            <Card className="hover-lift-sm card-crud-lift wave-card">
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="wave-table-header">
                        <TableHead className="wave-th">Wave ID</TableHead>
                        <TableHead className="wave-th">Warehouse</TableHead>
                        <TableHead className="wave-th">Strategy</TableHead>
                        <TableHead className="wave-th">Priority</TableHead>
                        <TableHead className="wave-th">Status</TableHead>
                        <TableHead className="wave-th">Orders</TableHead>
                        <TableHead className="wave-th">Lines</TableHead>
                        <TableHead className="wave-th">Picks</TableHead>
                        <TableHead className="wave-th">Pick Rate</TableHead>
                        <TableHead className="wave-th">Accuracy</TableHead>
                        <TableHead className="wave-th">Completion</TableHead>
                        <TableHead className="wave-th">Picker</TableHead>
                        <TableHead className="wave-th">Carrier</TableHead>
                        <TableHead className="wave-th">Created</TableHead>
                        <TableHead className="wave-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWaves.slice(0, 50).map((wave, idx) => (
                        <TableRow key={wave.id} className={cn("wave-table-row", idx % 2 === 0 ? "" : "wave-table-row-alt")}>
                          <TableCell className="wave-td"><span className="font-mono font-medium text-sm">{wave.id}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{wave.warehouse}</span></TableCell>
                          <TableCell className="numeric-cell wave-td"><StrategyBadge strategy={wave.strategy} /></TableCell>
                          <TableCell className="wave-td"><PriorityBadge priority={wave.priority} /></TableCell>
                          <TableCell className="wave-td"><WaveStatusBadge status={wave.status} /></TableCell>
                          <TableCell className="wave-td"><span className="text-sm font-medium">{wave.orderCount}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-sm">{wave.lineCount}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-sm">{wave.pickCount}</span></TableCell>
                          <TableCell className="numeric-cell wave-td"><span className="text-sm font-medium text-amber-600">{wave.pickRate}/hr</span></TableCell>
                          <TableCell className="wave-td"><span className={cn("text-sm font-medium", wave.accuracy >= 96 ? "text-emerald-600" : "text-amber-600")}>{wave.accuracy}%</span></TableCell>
                          <TableCell className="wave-td">
                            <div className="flex items-center gap-2">
                              <div className="wave-mini-bar">
                                <div className="wave-mini-bar-fill wave-bar-amber" style={{ width: `${wave.completion}%` }} />
                              </div>
                              <span className="text-xs">{wave.completion}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{wave.picker.name}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{wave.carrier}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{wave.createdDate} {wave.createdTime}</span></TableCell>
                          <TableCell className="wave-td">
                            <Button variant="ghost" size="sm" className="press-scale h-7 w-7 p-0" onClick={() => setSelectedWave(wave)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: PICK LISTS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "picks" && (
          <div className="wave-tab-content">
            {/* Filters */}
            <div className="wave-filter-bar">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input className="wave-filter-input" placeholder="Search pick ID, SKU, or product..." value={pickSearch} onChange={e => setPickSearch(e.target.value)} />
              </div>
              <select className="wave-filter-select" value={pickStatusFilter} onChange={e => setPickStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {PICK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Badge variant="outline" className="badge-interactive text-xs">{filteredPicks.length} items</Badge>
            </div>

            {/* Pick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {[
                { label: "Total Picks", value: pickLists.length, cls: "wave-pick-stat-amber" },
                { label: "Completed", value: pickLists.filter(p => p.status === "Completed").length, cls: "wave-pick-stat-emerald" },
                { label: "In Progress", value: pickLists.filter(p => p.status === "In Progress").length, cls: "wave-pick-stat-indigo" },
                { label: "Short", value: pickLists.filter(p => p.status === "Short").length, cls: "wave-pick-stat-red" },
                { label: "Assigned", value: pickLists.filter(p => p.status === "Assigned").length, cls: "wave-pick-stat-cyan" },
              ].map(stat => (
                <div key={stat.label} className={cn("wave-pick-stat", stat.cls)}>
                  <span className="text-xs opacity-80">{stat.label}</span>
                  <span className="text-lg font-bold">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Pick Table */}
            <Card className="hover-lift-sm card-crud-lift wave-card">
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="wave-table-header">
                        <TableHead className="wave-th">Pick ID</TableHead>
                        <TableHead className="wave-th">Wave</TableHead>
                        <TableHead className="wave-th">SKU</TableHead>
                        <TableHead className="wave-th">Product</TableHead>
                        <TableHead className="wave-th">Category</TableHead>
                        <TableHead className="wave-th">Zone</TableHead>
                        <TableHead className="wave-th">Bin</TableHead>
                        <TableHead className="wave-th">Priority</TableHead>
                        <TableHead className="wave-th">Status</TableHead>
                        <TableHead className="wave-th">Qty</TableHead>
                        <TableHead className="wave-th">Picker</TableHead>
                        <TableHead className="wave-th">Travel</TableHead>
                        <TableHead className="wave-th">Batch</TableHead>
                        <TableHead className="wave-th">Lot</TableHead>
                        <TableHead className="wave-th">Expiry</TableHead>
                        <TableHead className="wave-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPicks.slice(0, 60).map((pick, idx) => (
                        <TableRow key={pick.id} className={cn("wave-table-row", idx % 2 === 0 ? "" : "wave-table-row-alt")}>
                          <TableCell className="wave-td"><span className="font-mono font-medium text-sm">{pick.id}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-mono">{pick.waveId}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-mono font-medium">{pick.sku}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{pick.product}</span></TableCell>
                          <TableCell className="wave-td"><CategoryBadge category={pick.category} /></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-medium">Zone {pick.zone}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-mono">{pick.bin}</span></TableCell>
                          <TableCell className="wave-td"><PriorityBadge priority={pick.priority} /></TableCell>
                          <TableCell className="wave-td"><PickStatusBadge status={pick.status} /></TableCell>
                          <TableCell className="wave-td">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{pick.pickedQty}/{pick.qty}</span>
                              <div className="wave-mini-bar w-16">
                                <div className={cn("wave-mini-bar-fill", pick.status === "Completed" ? "wave-bar-emerald" : pick.status === "Short" ? "wave-bar-red" : "wave-bar-amber")} style={{ width: `${(pick.pickedQty / pick.qty) * 100}%` }} />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{pick.picker.name}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{pick.travelDist}m</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-mono">{pick.batchNo}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-mono">{pick.lotNo}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{pick.expiryDate}</span></TableCell>
                          <TableCell className="wave-td">
                            <Button variant="ghost" size="sm" className="press-scale h-7 w-7 p-0" onClick={() => setSelectedPick(pick)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: PACKING STATIONS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "packing" && (
          <div className="wave-tab-content">
            {/* Packing KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { label: "Total Orders", value: packingData.length, icon: Package, cls: "wave-kpi-amber" },
                { label: "Queued", value: packingData.filter(p => p.status === "Queued").length, icon: Clock, cls: "wave-kpi-indigo" },
                { label: "Packing", value: packingData.filter(p => p.status === "Packing").length, icon: Activity, cls: "wave-kpi-emerald" },
                { label: "Verified", value: packingData.filter(p => p.status === "Verified").length, icon: CheckCircle2, cls: "wave-kpi-amber" },
                { label: "Sealed", value: packingData.filter(p => p.status === "Sealed").length, icon: Zap, cls: "wave-kpi-indigo" },
                { label: "Shipped", value: packingData.filter(p => p.status === "Shipped").length, icon: TrendingUp, cls: "wave-kpi-emerald" },
              ].map(kpi => (
                <KpiCard key={kpi.label} title={kpi.label} value={String(kpi.value)} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Packing Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={PACK_STATUSES.map(s => ({ name: s, value: packingData.filter(p => p.status === s).length }))}
                        cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}
                        dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {PACK_STATUSES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Box Type Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={["Small Box", "Medium Box", "Large Box", "Pallet", "Mailer", "Poly Bag", "Custom Crate"].map(bt => ({
                      type: bt, count: packingData.filter(p => p.boxType === bt).length
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={55} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59e0b" name="Count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Station Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={PACKERS.map(pk => ({
                      station: pk.station,
                      orders: packingData.filter(p => p.packer.id === pk.id).length,
                    }))} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="station" type="category" width={55} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#6366f1" name="Orders" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="wave-filter-bar mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input className="wave-filter-input" placeholder="Search packing ID or order ID..." value={packSearch} onChange={e => setPackSearch(e.target.value)} />
              </div>
              <Badge variant="outline" className="badge-interactive text-xs">{filteredPacking.length} records</Badge>
            </div>

            {/* Packing Table */}
            <Card className="hover-lift-sm card-crud-lift wave-card">
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="wave-table-header">
                        <TableHead className="wave-th">ID</TableHead>
                        <TableHead className="wave-th">Station</TableHead>
                        <TableHead className="wave-th">Packer</TableHead>
                        <TableHead className="wave-th">Order</TableHead>
                        <TableHead className="wave-th">Product</TableHead>
                        <TableHead className="wave-th">Items</TableHead>
                        <TableHead className="wave-th">Box Type</TableHead>
                        <TableHead className="wave-th">Weight</TableHead>
                        <TableHead className="wave-th">Dimension</TableHead>
                        <TableHead className="wave-th">Status</TableHead>
                        <TableHead className="wave-th">Carrier</TableHead>
                        <TableHead className="wave-th">Seal No</TableHead>
                        <TableHead className="wave-th">AWB</TableHead>
                        <TableHead className="wave-th">Label</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPacking.slice(0, 40).map((pack, idx) => (
                        <TableRow key={pack.id} className={cn("wave-table-row", idx % 2 === 0 ? "" : "wave-table-row-alt")}>
                          <TableCell className="wave-td"><span className="font-mono font-medium text-sm">{pack.id}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-medium">{pack.station}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{pack.packer.name}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-mono">{pack.orderId}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{pack.product.name}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-sm font-medium">{pack.items}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{pack.boxType}</span></TableCell>
                          <TableCell className="numeric-cell wave-td"><span className="text-xs">{pack.weightKg} kg</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{pack.dimension} cm</span></TableCell>
                          <TableCell className="wave-td"><PackStatusBadge status={pack.status} /></TableCell>
                          <TableCell className="wave-td"><span className="text-xs">{pack.carrier}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-mono">{pack.sealNo || "—"}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-mono">{pack.awbNo || "—"}</span></TableCell>
                          <TableCell className="wave-td">
                            {pack.labelPrinted
                              ? <Badge className="badge-interactive wave-badge-label-printed">Printed</Badge>
                              : <Badge className="badge-interactive wave-badge-label-pending">Pending</Badge>
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: PICKER PERFORMANCE */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "performance" && (
          <div className="wave-tab-content">
            {/* Performance KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {[
                { label: "Total Pickers", value: String(PICKERS.length), icon: Users, cls: "wave-kpi-amber" },
                { label: "Avg Accuracy", value: `${Math.floor(pickerPerformance.reduce((a, p) => a + p.accuracy, 0) / pickerPerformance.length)}%`, icon: Target, cls: "wave-kpi-emerald" },
                { label: "Avg Pick Rate", value: `${Math.floor(pickerPerformance.reduce((a, p) => a + p.avgTime, 0) / pickerPerformance.length)}s/item`, icon: Timer, cls: "wave-kpi-indigo" },
                { label: "Total Picks", value: pickerPerformance.reduce((a, p) => a + p.totalPicks, 0).toLocaleString(), icon: Package, cls: "wave-kpi-amber" },
                { label: "Shortcuts", value: String(pickerPerformance.reduce((a, p) => a + p.shortcuts, 0)), icon: AlertTriangle, cls: "wave-kpi-indigo" },
              ].map(kpi => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Picks per Picker</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sortedPickers}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" height={70} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="totalPicks" fill="#f59e0b" name="Total Picks" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm wave-card">
                <CardHeader className="pb-2">
                  <CardTitle className="wave-card-title">Accuracy vs Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="avgTime" name="Avg Time (s)" tick={{ fontSize: 10 }} label={{ value: 'Avg Time (s)', position: 'bottom', fontSize: 10 }} />
                      <YAxis dataKey="accuracy" name="Accuracy %" domain={[90, 100]} tick={{ fontSize: 10 }} label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                      <ZAxis dataKey="totalPicks" range={[60, 400]} name="Total Picks" />
                      <Tooltip content={({ payload }) => {
                        if (!payload || payload.length === 0) return null
                        const d = payload[0].payload
                        return (
                          <div className="bg-white dark:bg-gray-800 border rounded-lg p-2 shadow-lg text-xs">
                            <p className="font-medium">{d.name}</p>
                            <p>Accuracy: {d.accuracy}%</p>
                            <p>Avg Time: {d.avgTime}s</p>
                            <p>Total Picks: {d.totalPicks}</p>
                            <p>Zone: {d.zone}</p>
                          </div>
                        )
                      }} />
                      <Scatter data={pickerPerformance} fill="#6366f1">
                        {pickerPerformance.map((p, i) => <Cell key={i} fill={p.accuracy >= 98 ? "#10b981" : p.accuracy >= 96 ? "#f59e0b" : "#ef4444"} />)}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-500">Sort by:</span>
              {[
                { key: "totalPicks" as const, label: "Total Picks" },
                { key: "accuracy" as const, label: "Accuracy" },
                { key: "avgTime" as const, label: "Avg Time" },
              ].map(s => (
                <Button key={s.key} variant={perfSort === s.key ? "default" : "outline"} size="sm" className="press-scale h-8 text-xs" onClick={() => setPerfSort(s.key)}>
                  {s.label}
                </Button>
              ))}
            </div>

            {/* Picker Table */}
            <Card className="hover-lift-sm card-crud-lift wave-card">
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="wave-table-header">
                        <TableHead className="wave-th">Rank</TableHead>
                        <TableHead className="wave-th">Picker ID</TableHead>
                        <TableHead className="wave-th">Name</TableHead>
                        <TableHead className="wave-th">Zone</TableHead>
                        <TableHead className="wave-th">Total Picks</TableHead>
                        <TableHead className="wave-th">Accuracy</TableHead>
                        <TableHead className="wave-th">Avg Time</TableHead>
                        <TableHead className="wave-th">Productivity</TableHead>
                        <TableHead className="wave-th">Shortcuts</TableHead>
                        <TableHead className="wave-th">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPickers.map((picker, idx) => (
                        <TableRow key={picker.id} className={cn("wave-table-row", idx % 2 === 0 ? "" : "wave-table-row-alt")}>
                          <TableCell className="wave-td">
                            <span className={cn("wave-leaderboard-rank-sm", idx === 0 ? "wave-rank-gold" : idx === 1 ? "wave-rank-silver" : idx === 2 ? "wave-rank-bronze" : "wave-rank-default")}>
                              #{idx + 1}
                            </span>
                          </TableCell>
                          <TableCell className="wave-td"><span className="font-mono text-xs">{picker.id}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-sm font-medium">{picker.name}</span></TableCell>
                          <TableCell className="wave-td"><span className="text-xs font-medium">Zone {picker.zone}</span></TableCell>
                          <TableCell className="numeric-cell wave-td"><span className="text-sm font-semibold">{picker.totalPicks}</span></TableCell>
                          <TableCell className="wave-td">
                            <div className="flex items-center gap-2">
                              <div className="wave-mini-bar w-16">
                                <div className={cn("wave-mini-bar-fill", picker.accuracy >= 96 ? "wave-bar-emerald" : picker.accuracy >= 90 ? "wave-bar-amber" : "wave-bar-red")} style={{ width: `${picker.accuracy}%` }} />
                              </div>
                              <span className={cn("text-sm font-medium", picker.accuracy >= 96 ? "text-emerald-600" : "text-amber-600")}>{picker.accuracy}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="wave-td"><span className="text-sm">{picker.avgTime}s</span></TableCell>
                          <TableCell className="wave-td"><span className="text-sm font-medium text-amber-600">{picker.productivity}/hr</span></TableCell>
                          <TableCell className="wave-td">
                            <span className={cn("text-sm", picker.shortcuts === 0 ? "text-emerald-600" : picker.shortcuts <= 2 ? "text-amber-600" : "text-red-600")}>{picker.shortcuts}</span>
                          </TableCell>
                          <TableCell className="wave-td">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, s) => (
                                <span key={s} className={cn("wave-star", s < picker.rating ? "wave-star-filled" : "wave-star-empty")}>&#9733;</span>
                              ))}
                            </div>
                          </TableCell>
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

      {/* Drawers */}
      {selectedWave && <WaveDetailDrawer wave={selectedWave} onClose={() => setSelectedWave(null)} />}
      {selectedPick && <PickDetailDrawer pick={selectedPick} onClose={() => setSelectedPick(null)} />}
    </div>
  )
}
