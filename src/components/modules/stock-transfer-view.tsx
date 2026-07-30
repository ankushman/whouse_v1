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
} from "recharts"
import {
  ArrowLeftRight, Package, Truck, Warehouse, MapPin, Clock, CheckCircle2,
  AlertTriangle, Zap, Search, TrendingUp, ArrowUpRight, ArrowDownRight,
  BarChart3, Activity, Eye, X, Route, Box, Timer, IndianRupee,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Seed-based deterministic data generation
// ─────────────────────────────────────────────────────────────────────────────
function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}

const rand = createRng(129129)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"] as const
const WH_SHORT = ["MUM", "DEL", "CHE", "KOL", "BLR", "PUN"] as const
const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F"] as const
const TRANSFER_TYPES = ["Inter-Warehouse", "Zone Transfer", "Bin Relocation", "Return to Supplier", "Cross-Dock Transfer"] as const
const TRANSFER_STATUSES = ["Requested", "Pending Approval", "Approved", "In Transit", "Received", "Completed", "Cancelled", "Rejected"] as const
const TRANSFER_PRIORITIES = ["Critical", "High", "Medium", "Low"] as const
const TRANSPORT_MODES = ["Own Fleet", "3PL - Delhivery", "3PL - BlueDart", "3PL - DTDC", "Rail Freight", "Air Cargo", "Road Transport"] as const
const REASONS = ["Stock Rebalancing", "Demand Surge", "Safety Stock", "Expiry Management", "Customer Request", "Damaged Goods", "Quality Hold", "Promotional Stock", "New Product Distribution", "Consolidation"] as const

const PRODUCTS = [
  { sku: "F&B-1001", name: "Basmati Rice 25kg", cat: "Food" },
  { sku: "F&B-1002", name: "Turmeric Powder 500g", cat: "Food" },
  { sku: "F&B-1003", name: "Organic Tea 1kg", cat: "Food" },
  { sku: "F&B-1006", name: "Ghee Tin 15kg", cat: "Food" },
  { sku: "PHR-2001", name: "Paracetamol 500mg", cat: "Pharma" },
  { sku: "PHR-2004", name: "ORS Sachets 100pc", cat: "Pharma" },
  { sku: "PHR-2005", name: "Chyawanprash 500g", cat: "Pharma" },
  { sku: "ELC-3001", name: "LED Panel 2x2ft", cat: "Electronics" },
  { sku: "ELC-3005", name: "Power Bank 20000mAh", cat: "Electronics" },
  { sku: "AUT-4002", name: "Brake Pad Set", cat: "Auto Parts" },
  { sku: "AUT-4003", name: "Engine Oil 5L", cat: "Auto Parts" },
  { sku: "IND-5001", name: "Hex Bolt M12x40", cat: "Industrial" },
  { sku: "IND-5003", name: "PVC Pipe 4in", cat: "Industrial" },
  { sku: "TXT-6001", name: "Cotton Fabric Roll", cat: "Textile" },
  { sku: "TXT-6005", name: "Jute Bag Pack 100pc", cat: "Textile" },
  { sku: "F&B-1010", name: "Mustard Oil 5L", cat: "Food" },
  { sku: "F&B-1011", name: "Jaggery Blocks 10kg", cat: "Food" },
  { sku: "PHR-2007", name: "Cough Syrup 200ml", cat: "Pharma" },
  { sku: "ELC-3006", name: "WiFi Router Dual Band", cat: "Electronics" },
  { sku: "IND-5006", name: "Electrical Cable 2.5mm", cat: "Industrial" },
]

const APPROVERS = [
  { id: "AP-01", name: "Vikram Mehta", role: "Regional Manager" },
  { id: "AP-02", name: "Priya Sharma", role: "Warehouse Manager" },
  { id: "AP-03", name: "Rajesh Gupta", role: "Ops Director" },
  { id: "AP-04", name: "Anita Desai", role: "Supply Chain Head" },
]

const PIE_COLORS = ["#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16"]

// ─────────────────────────────────────────────────────────────────────────────
// Generate Mock Data
// ─────────────────────────────────────────────────────────────────────────────
const MONTHS = ["Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26"]

// Transfer data
const transfers: Array<{
  id: string; type: string; priority: string; status: string;
  originWH: string; originZone: string; destWH: string; destZone: string;
  sku: string; product: string; category: string; qty: number; unit: string;
  reason: string; transportMode: string; approver: typeof APPROVERS[0];
  cost: number; estDays: number; actualDays: number | null;
  createdDate: string; completionDate: string | null;
  vehicleNo: string | null; trackingId: string | null;
  weightKg: string; volumeM3: string;
}> = (() => {
  const result: typeof transfers = []
  for (let i = 0; i < 100; i++) {
    const type = pick(TRANSFER_TYPES)
    const status = pick(TRANSFER_STATUSES)
    const priority = pick(TRANSFER_PRIORITIES)
    const product = pick(PRODUCTS)
    const qty = Math.floor(rand() * 500) + 10
    const wh1 = Math.floor(rand() * WAREHOUSES.length)
    let wh2 = (wh1 + 1 + Math.floor(rand() * (WAREHOUSES.length - 1))) % WAREHOUSES.length
    const zone1 = Math.floor(rand() * ZONES.length)
    const zone2 = Math.floor(rand() * ZONES.length)
    const estDays = Math.floor(rand() * 7) + 1
    const isComplete = status === "Completed" || status === "Received"
    const day = Math.floor(rand() * 28) + 1
    const month = Math.floor(rand() * 6)
    const weightKg = ((qty * (Math.floor(rand() * 25) + 1)) / 10).toFixed(1)
    const volumeM3 = ((qty * (Math.floor(rand() * 3) + 1)) / 100).toFixed(2)
    result.push({
      id: `TRF-${String(129000 + i).padStart(6, '0')}`,
      type,
      priority,
      status,
      originWH: WAREHOUSES[wh1],
      originZone: ZONES[zone1],
      destWH: type === "Inter-Warehouse" || type === "Cross-Dock Transfer" ? WAREHOUSES[wh2] : WAREHOUSES[wh1],
      destZone: type === "Bin Relocation" ? ZONES[zone1] : ZONES[zone2],
      sku: product.sku,
      product: product.name,
      category: product.cat,
      qty,
      unit: pick(["pcs", "kg", "boxes", "cartons", "pallets"]),
      reason: pick(REASONS),
      transportMode: type === "Inter-Warehouse" ? pick(TRANSPORT_MODES) : "Internal",
      approver: pick(APPROVERS),
      cost: Math.floor(rand() * 50000) + 1000,
      estDays,
      actualDays: isComplete ? Math.floor(rand() * estDays) + estDays - Math.floor(rand() * 3) : null,
      createdDate: new Date(2026, month, day).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      completionDate: isComplete ? new Date(2026, month, day + estDays).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : null,
      vehicleNo: type === "Inter-Warehouse" && status !== "Requested" ? `VH-${String(Math.floor(rand() * 9000) + 1000)}` : null,
      trackingId: type === "Inter-Warehouse" && status !== "Requested" ? `TRK${String(Math.floor(rand() * 99999999)).padStart(8, '0')}` : null,
      weightKg,
      volumeM3,
    })
  }
  return result
})()

// Movement history data
const movementHistory: Array<{
  date: string; interWH: number; zoneTransfer: number; binReloc: number; returnToSupplier: number; crossDock: number; totalQty: number;
}> = MONTHS.map(month => ({
  date: month,
  interWH: Math.floor(rand() * 40) + 20,
  zoneTransfer: Math.floor(rand() * 60) + 30,
  binReloc: Math.floor(rand() * 80) + 50,
  returnToSupplier: Math.floor(rand() * 10) + 2,
  crossDock: Math.floor(rand() * 15) + 5,
  totalQty: Math.floor(rand() * 8000) + 3000,
}))

// Route analysis data
const routeAnalysis = WAREHOUSES.map((wh, i) => {
  const outgoing = transfers.filter(t => t.originWH === wh).length
  const incoming = transfers.filter(t => t.destWH === wh).length
  return {
    warehouse: WH_SHORT[i],
    name: wh,
    outgoing,
    incoming,
    total: outgoing + incoming,
    avgCost: Math.floor(transfers.filter(t => t.originWH === wh).reduce((a, t) => a + t.cost, 0) / Math.max(1, outgoing)),
    avgDays: (transfers.filter(t => t.originWH === wh && t.actualDays).reduce((a, t) => a + (t.actualDays || 0), 0) / Math.max(1, transfers.filter(t => t.originWH === wh && t.actualDays).length)).toFixed(1),
  }
})

// Reason analysis
const reasonAnalysis = REASONS.map(r => ({
  reason: r.length > 15 ? r.substring(0, 15) + "..." : r,
  fullReason: r,
  count: transfers.filter(t => t.reason === r).length,
}))

// Warehouse pair data
const whPairs = (() => {
  const pairs: Array<{ from: string; to: string; transfers: number; volume: number }> = []
  for (let i = 0; i < WAREHOUSES.length; i++) {
    for (let j = 0; j < WAREHOUSES.length; j++) {
      if (i !== j) {
        const count = transfers.filter(t => t.originWH === WAREHOUSES[i] && t.destWH === WAREHOUSES[j]).length
        if (count > 0) {
          pairs.push({
            from: WH_SHORT[i],
            to: WH_SHORT[j],
            transfers: count,
            volume: transfers.filter(t => t.originWH === WAREHOUSES[i] && t.destWH === WAREHOUSES[j]).reduce((a, t) => a + t.qty, 0),
          })
        }
      }
    }
  }
  return pairs
})()

// Cost savings data
const costSavings = MONTHS.map(month => ({
  month,
  transportCost: Math.floor(rand() * 200000) + 100000,
  handlingCost: Math.floor(rand() * 50000) + 20000,
  savingsOptimized: Math.floor(rand() * 15000) + 5000,
  savingsConsolidation: Math.floor(rand() * 10000) + 3000,
  savingsRoute: Math.floor(rand() * 8000) + 2000,
}))

// SLA compliance data
const slaData = WAREHOUSES.map((wh, i) => ({
  warehouse: WH_SHORT[i],
  onTime: Math.floor(rand() * 15) + 82,
  withinSLA: Math.floor(rand() * 10) + 88,
  delayed: Math.floor(rand() * 10) + 2,
  avgDelay: (Math.floor(rand() * 30) + 5) / 10,
}))

// KPI calculations
const totalTransfers = transfers.length
const activeTransfers = transfers.filter(t => t.status === "In Transit" || t.status === "Approved" || t.status === "Pending Approval").length
const completedTransfers = transfers.filter(t => t.status === "Completed" || t.status === "Received").length
const totalVolume = transfers.reduce((a, t) => a + t.qty, 0)
const avgTransitDays = (transfers.filter(t => t.actualDays).reduce((a, t) => a + (t.actualDays || 0), 0) / Math.max(1, transfers.filter(t => t.actualDays).length)).toFixed(1)
const totalCost = transfers.reduce((a, t) => a + t.cost, 0)
const pendingApproval = transfers.filter(t => t.status === "Pending Approval").length
const rejectedTransfers = transfers.filter(t => t.status === "Rejected").length

// Radar data
const radarData = [
  { metric: "On-Time %", value: 89, fullMark: 100 },
  { metric: "SLA Score", value: 92, fullMark: 100 },
  { metric: "Cost Eff.", value: 78, fullMark: 100 },
  { metric: "Utilization", value: 71, fullMark: 100 },
  { metric: "Approval Speed", value: 85, fullMark: 100 },
  { metric: "Damage-Free", value: 96, fullMark: 100 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function KpiCard({ title, value, subtitle, icon: Icon, colorClass, trend, trendValue }: {
  title: string; value: string; subtitle?: string;
  icon: React.ElementType; colorClass: string; trend?: "up" | "down"; trendValue?: string
}) {
  return (
    <Card className={cn("stf-kpi-card", colorClass)}>
      <CardContent className="inner-glow glass-subtle p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="stf-kpi-label">{title}</p>
            <p className="stf-kpi-value">{value}</p>
            {subtitle && <p className="stf-kpi-sub">{subtitle}</p>}
          </div>
          <div className="stf-kpi-icon"><Icon className="h-5 w-5" /></div>
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

function TypeBadge({ type }: { type: string }) {
  const cls: Record<string, string> = {
    "Inter-Warehouse": "stf-badge-type-iw", "Zone Transfer": "stf-badge-type-zt",
    "Bin Relocation": "stf-badge-type-br", "Return to Supplier": "stf-badge-type-rts",
    "Cross-Dock Transfer": "stf-badge-type-cd",
  }
  return <span className={cn("stf-badge", cls[type] || "")}>{type}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const cls: Record<string, string> = {
    Critical: "stf-badge-priority-critical", High: "stf-badge-priority-high",
    Medium: "stf-badge-priority-medium", Low: "stf-badge-priority-low",
  }
  return <span className={cn("stf-badge", cls[priority] || "")}>{priority}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Requested: "stf-badge-status-requested", "Pending Approval": "stf-badge-status-pending",
    Approved: "stf-badge-status-approved", "In Transit": "stf-badge-status-transit",
    Received: "stf-badge-status-received", Completed: "stf-badge-status-completed",
    Cancelled: "stf-badge-status-cancelled", Rejected: "stf-badge-status-rejected",
  }
  return <span className={cn("stf-badge", cls[status] || "")}>{status}</span>
}

function CategoryBadge({ category }: { category: string }) {
  const cls: Record<string, string> = {
    Food: "stf-badge-cat-food", Pharma: "stf-badge-cat-pharma",
    Electronics: "stf-badge-cat-elec", "Auto Parts": "stf-badge-cat-auto",
    Industrial: "stf-badge-cat-ind", Textile: "stf-badge-cat-textile",
  }
  return <span className={cn("stf-badge", cls[category] || "")}>{category}</span>
}

// ─────────────────────────────────────────────────────────────────────────────
// Transfer Detail Drawer
// ─────────────────────────────────────────────────────────────────────────────
function TransferDetailDrawer({ transfer, onClose }: { transfer: typeof transfers[0]; onClose: () => void }) {
  return (
    <div className="stf-drawer-overlay" onClick={onClose}>
      <div className="stf-drawer" onClick={e => e.stopPropagation()}>
        <div className="stf-drawer-header">
          <div>
            <h3 className="stf-drawer-title">{transfer.id}</h3>
            <p className="stf-drawer-subtitle">{transfer.type} &middot; {transfer.reason}</p>
          </div>
          <button className="stf-drawer-close" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="stf-drawer-body">
          {/* Status Banner */}
          <div className={cn(
            "stf-drawer-banner",
            transfer.status === "Completed" || transfer.status === "Received" ? "stf-drawer-banner-done" :
            transfer.status === "Rejected" || transfer.status === "Cancelled" ? "stf-drawer-banner-cancel" : "stf-drawer-banner-active"
          )}>
            <div className="flex items-center gap-2">
              {transfer.status === "Completed" || transfer.status === "Received" ? <CheckCircle2 className="h-4 w-4" /> :
               transfer.status === "In Transit" ? <Truck className="h-4 w-4" /> :
               transfer.status === "Pending Approval" ? <Clock className="h-4 w-4" /> :
               <Activity className="h-4 w-4" />}
              <StatusBadge status={transfer.status} />
            </div>
          </div>

          {/* Route Flow */}
          <div className="stf-route-flow">
            <div className="stf-route-point">
              <div className="stf-route-dot stf-route-dot-origin" />
              <div>
                <p className="stf-route-label">Origin</p>
                <p className="text-sm font-semibold">{transfer.originWH}</p>
                <p className="text-xs text-gray-500">{transfer.originZone}</p>
              </div>
            </div>
            <div className="stf-route-line">
              <div className="stf-route-arrow">
                <ArrowLeftRight className="h-3.5 w-3.5 text-cyan-500" />
              </div>
              <span className="text-xs text-gray-400">{transfer.transportMode}</span>
            </div>
            <div className="stf-route-point">
              <div className="stf-route-dot stf-route-dot-dest" />
              <div>
                <p className="stf-route-label">Destination</p>
                <p className="text-sm font-semibold">{transfer.destWH}</p>
                <p className="text-xs text-gray-500">{transfer.destZone}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="stf-drawer-grid">
            <div className="stf-drawer-field"><span className="stf-drawer-label">Product</span><span className="text-sm font-medium">{transfer.product}</span></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">SKU</span><span className="text-sm font-mono">{transfer.sku}</span></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Category</span><CategoryBadge category={transfer.category} /></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Priority</span><PriorityBadge priority={transfer.priority} /></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Quantity</span><span className="text-sm font-bold">{transfer.qty} {transfer.unit}</span></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Weight</span><span className="text-sm">{transfer.weightKg} kg</span></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Volume</span><span className="text-sm">{transfer.volumeM3} m3</span></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Transport</span><span className="text-sm">{transfer.transportMode}</span></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Approver</span><span className="text-sm">{transfer.approver.name}</span></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Role</span><span className="text-xs">{transfer.approver.role}</span></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Cost</span><span className="text-sm font-semibold text-cyan-600">&₹{transfer.cost.toLocaleString('en-IN')}</span></div>
            <div className="stf-drawer-field"><span className="stf-drawer-label">Est. Days</span><span className="text-sm">{transfer.estDays}</span></div>
            {transfer.actualDays && (
              <div className="stf-drawer-field"><span className="stf-drawer-label">Actual Days</span><span className={cn("text-sm font-medium", transfer.actualDays <= transfer.estDays ? "text-emerald-600" : "text-red-600")}>{transfer.actualDays}</span></div>
            )}
            {transfer.vehicleNo && (
              <div className="stf-drawer-field"><span className="stf-drawer-label">Vehicle</span><span className="text-sm font-mono">{transfer.vehicleNo}</span></div>
            )}
            {transfer.trackingId && (
              <div className="stf-drawer-field"><span className="stf-drawer-label">Tracking</span><span className="text-sm font-mono">{transfer.trackingId}</span></div>
            )}
            <div className="stf-drawer-field"><span className="stf-drawer-label">Created</span><span className="text-sm">{transfer.createdDate}</span></div>
            {transfer.completionDate && (
              <div className="stf-drawer-field"><span className="stf-drawer-label">Completed</span><span className="text-sm">{transfer.completionDate}</span></div>
            )}
          </div>

          {/* Transit Timeline */}
          <div className="mt-5">
            <h4 className="stf-drawer-section-title">Transit Timeline</h4>
            <div className="stf-timeline">
              <div className="stf-timeline-step stf-timeline-done">
                <div className="stf-timeline-dot" /><span>Requested</span><span className="text-xs text-gray-400">{transfer.createdDate}</span>
              </div>
              <div className={cn("stf-timeline-step", transfer.status !== "Requested" ? "stf-timeline-done" : "")}>
                <div className="stf-timeline-dot" /><span>Approved</span>
              </div>
              <div className={cn("stf-timeline-step", ["In Transit", "Received", "Completed"].includes(transfer.status) ? "stf-timeline-done" : "")}>
                <div className="stf-timeline-dot" /><span>Dispatched</span>
              </div>
              <div className={cn("stf-timeline-step", ["Received", "Completed"].includes(transfer.status) ? "stf-timeline-done" : "")}>
                <div className="stf-timeline-dot" /><span>In Transit</span>
                {transfer.vehicleNo && <span className="text-xs text-gray-400">{transfer.vehicleNo}</span>}
              </div>
              <div className={cn("stf-timeline-step", transfer.status === "Completed" ? "stf-timeline-done" : "")}>
                <div className="stf-timeline-dot" /><span>Delivered</span>
                {transfer.completionDate && <span className="text-xs text-gray-400">{transfer.completionDate}</span>}
              </div>
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
export default function StockTransferView() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedTransfer, setSelectedTransfer] = useState<typeof transfers[0] | null>(null)
  const [costView, setCostView] = useState<"monthly" | "byWH">("monthly")

  const filteredTransfers = useMemo(() => {
    return transfers.filter(t => {
      if (searchQuery && !t.id.toLowerCase().includes(searchQuery.toLowerCase()) && !t.product.toLowerCase().includes(searchQuery.toLowerCase()) && !t.sku.toLowerCase().includes(searchQuery.toLowerCase()) && !t.originWH.toLowerCase().includes(searchQuery.toLowerCase()) && !t.destWH.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (typeFilter !== "all" && t.type !== typeFilter) return false
      return true
    })
  }, [searchQuery, statusFilter, typeFilter])

  const typeDistribution = TRANSFER_TYPES.map(t => ({
    name: t, value: transfers.filter(tr => tr.type === t).length,
  }))

  const reasonData = reasonAnalysis.filter(r => r.count > 0).sort((a, b) => b.count - a.count).slice(0, 8)

  return (
    <div className="stf-container">
      {/* Header */}
      <div className="stf-header">
        <div className="flex items-center gap-3">
          <div className="stf-header-icon">
            <ArrowLeftRight className="h-6 w-6" />
          </div>
          <div>
            <h1 className="stf-header-title">Stock Transfer & Inter-Warehouse Movement</h1>
            <p className="stf-header-subtitle">Manage inventory movements, transfers, approvals, and logistics across all warehouses</p>
          </div>
        </div>
        <div className="stf-header-badges">
          <span className="stf-header-badge stf-hb-total">{totalTransfers} Transfers</span>
          <span className="stf-header-badge stf-hb-active">{activeTransfers} Active</span>
          <span className="stf-header-badge stf-hb-completed">{completedTransfers} Completed</span>
          <span className="stf-header-badge stf-hb-pending">{pendingApproval} Pending Approval</span>
          <span className="stf-header-badge stf-hb-volume">{totalVolume.toLocaleString()} Total Qty</span>
          <span className="stf-header-badge stf-hb-cost">&₹{(totalCost / 100000).toFixed(1)}L Cost</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
        <TabsList className="stf-tabs-list">
          <TabsTrigger value="overview" className="stf-tab-trigger"><BarChart3 className="h-4 w-4 mr-1.5" /> Transfer Dashboard</TabsTrigger>
          <TabsTrigger value="transfers" className="stf-tab-trigger"><Package className="h-4 w-4 mr-1.5" /> Transfer Queue</TabsTrigger>
          <TabsTrigger value="routes" className="stf-tab-trigger"><Route className="h-4 w-4 mr-1.5" /> Route Analysis</TabsTrigger>
          <TabsTrigger value="cost" className="stf-tab-trigger"><IndianRupee className="h-4 w-4 mr-1.5" /> Cost & Savings</TabsTrigger>
          <TabsTrigger value="sla" className="stf-tab-trigger"><Timer className="h-4 w-4 mr-1.5" /> SLA & Compliance</TabsTrigger>
        </TabsList>

        {/* ═══ TAB 1: TRANSFER DASHBOARD OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <div className="stf-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <KpiCard title="Total Transfers" value={String(totalTransfers)} icon={ArrowLeftRight} colorClass="stf-kpi-cyan" trend="up" trendValue="+18% vs last month" />
              <KpiCard title="Active" value={String(activeTransfers)} icon={Truck} colorClass="stf-kpi-amber" />
              <KpiCard title="Completed" value={String(completedTransfers)} icon={CheckCircle2} colorClass="stf-kpi-emerald" trend="up" trendValue="+22%" />
              <KpiCard title="Avg Transit" value={`${avgTransitDays} days`} icon={Clock} colorClass="stf-kpi-amber" />
              <KpiCard title="Pending Approval" value={String(pendingApproval)} icon={AlertTriangle} colorClass="stf-kpi-cyan" />
              <KpiCard title="Rejected" value={String(rejectedTransfers)} icon={X} colorClass="stf-kpi-emerald" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <Card className="hover-lift-sm stf-card">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Transfer Type Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {typeDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm stf-card">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Monthly Transfer Volume</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={movementHistory}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area yAxisId="left" type="monotone" dataKey="interWH" stackId="1" fill="#06b6d4" stroke="#06b6d4" fillOpacity={0.4} name="Inter-WH" />
                      <Area yAxisId="left" type="monotone" dataKey="zoneTransfer" stackId="1" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.4} name="Zone" />
                      <Area yAxisId="left" type="monotone" dataKey="binReloc" stackId="1" fill="#10b981" stroke="#10b981" fillOpacity={0.4} name="Bin" />
                      <Line yAxisId="right" type="monotone" dataKey="totalQty" stroke="#ef4444" strokeWidth={2} name="Total Qty" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm stf-card">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Transfer Efficiency Radar</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Current" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                      <Radar name="Target" dataKey="fullMark" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="hover-lift-sm stf-card">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Transfer Reasons Analysis</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={reasonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="reason" type="category" width={100} tick={{ fontSize: 9 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#06b6d4" name="Transfers" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm stf-card">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Top Transfer Routes</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {whPairs.sort((a, b) => b.transfers - a.transfers).slice(0, 8).map((pair, idx) => (
                      <div key={`${pair.from}-${pair.to}`} className="stf-route-row">
                        <div className="flex items-center gap-3 w-full">
                          <span className={cn("stf-route-rank", idx < 3 ? "stf-rank-cyan" : "stf-rank-default")}>{idx + 1}</span>
                          <div className="flex items-center gap-2 flex-1">
                            <span className="stf-route-wh">{pair.from}</span>
                            <ArrowLeftRight className="h-3.5 w-3.5 text-cyan-500 flex-shrink-0" />
                            <span className="stf-route-wh">{pair.to}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold">{pair.transfers}</span>
                            <span className="text-xs text-gray-400 ml-1">({pair.volume} qty)</span>
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

        {/* ═══ TAB 2: TRANSFER QUEUE ═══ */}
        {activeTab === "transfers" && (
          <div className="stf-tab-content">
            <div className="stf-filter-bar">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input className="stf-filter-input" placeholder="Search transfer ID, product, SKU, warehouse..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <select className="stf-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {TRANSFER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="stf-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                {TRANSFER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <Badge variant="outline" className="badge-interactive text-xs">{filteredTransfers.length} transfers</Badge>
            </div>

            <Card className="hover-lift-sm card-crud-lift stf-card">
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="stf-table-header">
                        <TableHead className="stf-th">Transfer ID</TableHead>
                        <TableHead className="stf-th">Type</TableHead>
                        <TableHead className="stf-th">Priority</TableHead>
                        <TableHead className="stf-th">Status</TableHead>
                        <TableHead className="stf-th">Origin</TableHead>
                        <TableHead className="stf-th">Destination</TableHead>
                        <TableHead className="stf-th">SKU / Product</TableHead>
                        <TableHead className="stf-th">Qty</TableHead>
                        <TableHead className="stf-th">Reason</TableHead>
                        <TableHead className="stf-th">Transport</TableHead>
                        <TableHead className="stf-th">Cost &₹</TableHead>
                        <TableHead className="stf-th">Est Days</TableHead>
                        <TableHead className="stf-th">Approver</TableHead>
                        <TableHead className="stf-th">Created</TableHead>
                        <TableHead className="stf-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransfers.slice(0, 60).map((t, idx) => (
                        <TableRow key={t.id} className={cn("stf-table-row", idx % 2 === 0 ? "" : "stf-table-row-alt")}>
                          <TableCell className="stf-td"><span className="font-mono font-medium text-sm">{t.id}</span></TableCell>
                          <TableCell className="stf-td"><TypeBadge type={t.type} /></TableCell>
                          <TableCell className="stf-td"><PriorityBadge priority={t.priority} /></TableCell>
                          <TableCell className="stf-td"><StatusBadge status={t.status} /></TableCell>
                          <TableCell className="stf-td">
                            <span className="text-xs font-medium">{t.originWH}</span>
                            <span className="text-xs text-gray-400 block">{t.originZone}</span>
                          </TableCell>
                          <TableCell className="stf-td">
                            <span className="text-xs font-medium">{t.destWH}</span>
                            <span className="text-xs text-gray-400 block">{t.destZone}</span>
                          </TableCell>
                          <TableCell className="stf-td">
                            <span className="text-xs font-mono">{t.sku}</span>
                            <span className="text-xs block max-w-28 truncate">{t.product}</span>
                          </TableCell>
                          <TableCell className="stf-td"><span className="text-sm font-semibold">{t.qty}</span><span className="text-xs text-gray-400 ml-0.5">{t.unit}</span></TableCell>
                          <TableCell className="stf-td"><span className="text-xs">{t.reason.length > 18 ? t.reason.substring(0, 18) + "..." : t.reason}</span></TableCell>
                          <TableCell className="stf-td"><span className="text-xs">{t.transportMode.length > 12 ? t.transportMode.substring(0, 12) + "..." : t.transportMode}</span></TableCell>
                          <TableCell className="numeric-cell stf-td"><span className="text-sm font-medium text-cyan-600">{t.cost.toLocaleString('en-IN')}</span></TableCell>
                          <TableCell className="stf-td">
                            <span className="text-sm">{t.estDays}d</span>
                            {t.actualDays && <span className={cn("text-xs ml-1", t.actualDays <= t.estDays ? "text-emerald-600" : "text-red-600")}>({t.actualDays}d)</span>}
                          </TableCell>
                          <TableCell className="stf-td"><span className="text-xs">{t.approver.name.split(' ')[0]}</span></TableCell>
                          <TableCell className="stf-td"><span className="text-xs">{t.createdDate}</span></TableCell>
                          <TableCell className="stf-td">
                            <Button variant="ghost" size="sm" className="press-scale h-7 w-7 p-0" onClick={() => setSelectedTransfer(t)}>
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

        {/* ═══ TAB 3: ROUTE ANALYSIS ═══ */}
        {activeTab === "routes" && (
          <div className="stf-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Active Routes", value: String(whPairs.length), icon: Route, cls: "stf-kpi-cyan" },
                { label: "Total Movements", value: String(transfers.length), icon: ArrowLeftRight, cls: "stf-kpi-amber" },
                { label: "Avg Cost/Transfer", value: `₹${Math.floor(totalCost / Math.max(1, totalTransfers)).toLocaleString('en-IN')}`, icon: IndianRupee, cls: "stf-kpi-emerald" },
                { label: "Avg Transit Days", value: `${avgTransitDays}`, icon: Timer, cls: "stf-kpi-cyan" },
              ].map(kpi => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="hover-lift-sm stf-card">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Warehouse Flow (Out vs In)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={routeAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="outgoing" fill="#06b6d4" name="Outgoing" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="incoming" fill="#f59e0b" name="Incoming" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm stf-card">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Cost per Warehouse Route</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={routeAnalysis} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="warehouse" type="category" width={55} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="avgCost" fill="#10b981" name="Avg Cost ₹" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Route Table */}
            <Card className="hover-lift-sm stf-card">
              <CardHeader className="pb-2"><CardTitle className="stf-card-title">Warehouse Transfer Summary</CardTitle></CardHeader>
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="stf-table-header">
                        <TableHead className="stf-th">Warehouse</TableHead>
                        <TableHead className="stf-th">Outgoing</TableHead>
                        <TableHead className="stf-th">Incoming</TableHead>
                        <TableHead className="stf-th">Total</TableHead>
                        <TableHead className="stf-th">Avg Cost/Transfer</TableHead>
                        <TableHead className="stf-th">Avg Transit Days</TableHead>
                        <TableHead className="stf-th">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {routeAnalysis.sort((a, b) => b.total - a.total).map((r, idx) => (
                        <TableRow key={r.warehouse} className={cn("stf-table-row", idx % 2 === 0 ? "" : "stf-table-row-alt")}>
                          <TableCell className="stf-td"><span className="text-sm font-medium">{r.name}</span></TableCell>
                          <TableCell className="stf-td"><span className="text-sm text-cyan-600 font-semibold">{r.outgoing}</span></TableCell>
                          <TableCell className="stf-td"><span className="text-sm text-amber-600 font-semibold">{r.incoming}</span></TableCell>
                          <TableCell className="numeric-cell stf-td"><span className="text-sm font-bold">{r.total}</span></TableCell>
                          <TableCell className="numeric-cell stf-td"><span className="text-sm">₹{r.avgCost.toLocaleString('en-IN')}</span></TableCell>
                          <TableCell className="stf-td"><span className="text-sm">{r.avgDays}d</span></TableCell>
                          <TableCell className="stf-td">
                            <span className={cn("text-sm font-medium", r.incoming - r.outgoing > 0 ? "text-emerald-600" : r.incoming - r.outgoing < 0 ? "text-red-600" : "text-gray-500")}>
                              {r.incoming - r.outgoing > 0 ? "+" : ""}{r.incoming - r.outgoing}
                            </span>
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

        {/* ═══ TAB 4: COST & SAVINGS ═══ */}
        {activeTab === "cost" && (
          <div className="stf-tab-content">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-gray-500">View:</span>
              <Button variant={costView === "monthly" ? "default" : "outline"} size="sm" className="press-scale h-8 text-xs" onClick={() => setCostView("monthly")}>Monthly Trend</Button>
              <Button variant={costView === "byWH" ? "default" : "outline"} size="sm" className="press-scale h-8 text-xs" onClick={() => setCostView("byWH")}>By Warehouse</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Transport Cost", value: `₹${(costSavings.reduce((a, c) => a + c.transportCost, 0) / 100000).toFixed(1)}L`, icon: Truck, cls: "stf-kpi-cyan" },
                { label: "Handling Cost", value: `₹${(costSavings.reduce((a, c) => a + c.handlingCost, 0) / 100000).toFixed(1)}L`, icon: Package, cls: "stf-kpi-amber" },
                { label: "Total Savings", value: `₹${((costSavings.reduce((a, c) => a + c.savingsOptimized + c.savingsConsolidation + c.savingsRoute, 0)) / 100000).toFixed(1)}L`, icon: TrendingUp, cls: "stf-kpi-emerald" },
                { label: "Savings Rate", value: `${((costSavings.reduce((a, c) => a + c.savingsOptimized + c.savingsConsolidation + c.savingsRoute, 0) / costSavings.reduce((a, c) => a + c.transportCost, 0)) * 100).toFixed(1)}%`, icon: Zap, cls: "stf-kpi-cyan" },
              ].map(kpi => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            {costView === "monthly" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <Card className="hover-lift-sm stf-card">
                  <CardHeader className="pb-2"><CardTitle className="stf-card-title">Cost Breakdown Trend</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={costSavings}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" dataKey="transportCost" fill="#06b6d4" stroke="#06b6d4" fillOpacity={0.2} name="Transport Cost" />
                        <Bar dataKey="handlingCost" fill="#f59e0b" name="Handling Cost" radius={[3, 3, 0, 0]} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="hover-lift-sm stf-card">
                  <CardHeader className="pb-2"><CardTitle className="stf-card-title">Savings Breakdown</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={costSavings}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" dataKey="savingsOptimized" stackId="1" fill="#10b981" stroke="#10b981" fillOpacity={0.4} name="Route Optimized" />
                        <Area type="monotone" dataKey="savingsConsolidation" stackId="1" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.4} name="Consolidation" />
                        <Area type="monotone" dataKey="savingsRoute" stackId="1" fill="#06b6d4" stroke="#06b6d4" fillOpacity={0.4} name="Route Savings" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="hover-lift-sm stf-card mb-6">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Cost by Warehouse</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={routeAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="avgCost" fill="#06b6d4" name="Avg Cost/Transfer ₹" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Transport mode distribution */}
            <Card className="hover-lift-sm stf-card">
              <CardHeader className="pb-2"><CardTitle className="stf-card-title">Transport Mode Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={TRANSPORT_MODES.map(m => ({ name: m, value: transfers.filter(t => t.transportMode === m).length })).filter(d => d.value > 0)}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}
                      dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {TRANSPORT_MODES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══ TAB 5: SLA & COMPLIANCE ═══ */}
        {activeTab === "sla" && (
          <div className="stf-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "On-Time Rate", value: `${Math.floor(slaData.reduce((a, s) => a + s.onTime, 0) / slaData.length)}%`, icon: Timer, cls: "stf-kpi-cyan" },
                { label: "Within SLA", value: `${Math.floor(slaData.reduce((a, s) => a + s.withinSLA, 0) / slaData.length)}%`, icon: CheckCircle2, cls: "stf-kpi-emerald" },
                { label: "Avg Delay", value: `${(slaData.reduce((a, s) => a + s.avgDelay, 0) / slaData.length).toFixed(1)} days`, icon: AlertTriangle, cls: "stf-kpi-amber" },
                { label: "Delayed Rate", value: `${Math.floor(slaData.reduce((a, s) => a + s.delayed, 0) / slaData.length)}%`, icon: Activity, cls: "stf-kpi-cyan" },
              ].map(kpi => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="hover-lift-sm stf-card">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Warehouse SLA Performance</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={slaData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="onTime" fill="#06b6d4" name="On-Time %" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="withinSLA" fill="#10b981" name="Within SLA %" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} name="Delayed %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm stf-card">
                <CardHeader className="pb-2"><CardTitle className="stf-card-title">Approval Workflow Analytics</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={TRANSFER_STATUSES.map(s => ({ name: s, value: transfers.filter(t => t.status === s).length })).filter(d => d.value > 0)}
                        cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}
                        dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {TRANSFER_STATUSES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* SLA Detail Table */}
            <Card className="hover-lift-sm stf-card">
              <CardHeader className="pb-2"><CardTitle className="stf-card-title">Warehouse SLA Detail</CardTitle></CardHeader>
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="stf-table-header">
                        <TableHead className="stf-th">Warehouse</TableHead>
                        <TableHead className="stf-th">On-Time %</TableHead>
                        <TableHead className="stf-th">Within SLA %</TableHead>
                        <TableHead className="stf-th">Delayed %</TableHead>
                        <TableHead className="stf-th">Avg Delay (days)</TableHead>
                        <TableHead className="stf-th">SLA Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slaData.map((s, idx) => (
                        <TableRow key={s.warehouse} className={cn("stf-table-row", idx % 2 === 0 ? "" : "stf-table-row-alt")}>
                          <TableCell className="stf-td"><span className="text-sm font-medium">{WAREHOUSES[idx]}</span></TableCell>
                          <TableCell className="stf-td">
                            <div className="flex items-center gap-2">
                              <div className="stf-mini-bar"><div className={cn("stf-mini-bar-fill", s.onTime >= 90 ? "stf-bar-emerald" : s.onTime >= 80 ? "stf-bar-amber" : "stf-bar-red")} style={{ width: `${s.onTime}%` }} /></div>
                              <span className={cn("text-sm font-semibold", s.onTime >= 90 ? "text-emerald-600" : "text-amber-600")}>{s.onTime}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="stf-td"><span className={cn("text-sm font-medium", s.withinSLA >= 90 ? "text-emerald-600" : "text-amber-600")}>{s.withinSLA}%</span></TableCell>
                          <TableCell className="stf-td"><span className={cn("text-sm", s.delayed <= 5 ? "text-emerald-600" : "text-red-600")}>{s.delayed}%</span></TableCell>
                          <TableCell className="stf-td"><span className={cn("text-sm font-medium", s.avgDelay <= 2 ? "text-emerald-600" : s.avgDelay <= 3 ? "text-amber-600" : "text-red-600")}>{s.avgDelay}</span></TableCell>
                          <TableCell className="stf-td">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, star) => (
                                <span key={star} className={cn("stf-star", star < (s.onTime >= 95 ? 5 : s.onTime >= 90 ? 4 : s.onTime >= 85 ? 3 : s.onTime >= 80 ? 2 : 1) ? "stf-star-filled" : "stf-star-empty")}>&#9733;</span>
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
      {selectedTransfer && <TransferDetailDrawer transfer={selectedTransfer} onClose={() => setSelectedTransfer(null)} />}
    </div>
  )
}
