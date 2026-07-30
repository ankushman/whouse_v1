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
  Truck, MapPin, Clock, Package, Star, Fuel, IndianRupee, Users,
  Route, TrendingUp, ArrowUpRight, ArrowDownRight, Navigation, Phone,
  BarChart3, Target, Warehouse, PackageCheck, Timer, Zap, ShieldCheck,
  CalendarDays, AlertTriangle, CheckCircle2, XCircle, RefreshCw,
  Search, Eye, Weight, Boxes, Building2, Sun, Moon, ChevronRight,
  GitFork, ArrowLeftRight, Layers, Gauge, Radio, LayoutGrid,
  PackagePlus, PackageMinus, RotateCcw, ScanBarcode, Barcode,
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
const DOCK_STATUSES = ["Available", "Occupied", "Maintenance", "Reserved", "Blocked"] as const
const CROSSDOCK_TYPES = ["Pre-Distribution", " opportunistic", "Merge-in-Transit", "Deconsolidation", "Consolidation", "E-Commerce Sort"] as const
const OPERATION_STATUSES = ["Queued", "Receiving", "Sorting", "Staging", "Loading", "Completed", "Cancelled", "Delayed"] as const
const PRIORITY_LEVELS = ["Critical", "High", "Medium", "Low"] as const
const DOOR_ASSIGNMENTS = ["Door A1", "Door A2", "Door B1", "Door B2", "Door C1", "Door C2", "Door D1", "Door D2", "Door E1", "Door E2"] as const
const SKU_CATEGORIES = ["FMCG", "Electronics", "Apparel", "Pharma", "Auto Parts", "Food & Bev", "Home Decor", "Beauty", "Books", "Sports"] as const
const CARRIER_NAMES = ["Delhivery", "BlueDart", "DTDC", "Ecom Express", "XpressBees", "Shadowfax", "Spoton", "Rivigo", "BlackBuck", "TCI Express", "Gati", "Professional Couriers", "India Post", "Amazon Transport", "Flipkart Logistics"] as const
const INDIAN_HUBS = ["Mumbai BKC Hub", "Delhi NCR Gurgaon", "Bangalore Whitefield", "Chennai Ambattur", "Hyderabad Gachibowli", "Pune Chakan", "Kolkata Salt Lake", "Ahmedabad SG Highway"] as const
const DESTINATION_ZONES = ["Zone North", "Zone South", "Zone East", "Zone West", "Zone Central", "Zone Airport", "Zone Industrial", "Zone Residential"] as const
const THROUGHPUT_TIERS = ["High (>500/hr)", "Medium (200-500/hr)", "Low (<200/hr)"] as const
const LABOR_SHIFTS = ["Morning 6AM-2PM", "Evening 2PM-10PM", "Night 10PM-6AM"] as const

// ============================================================================
// Color Maps
// ============================================================================
const DOCK_STATUS_COLORS: Record<string, string> = {
  "Available": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Occupied": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Maintenance": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Reserved": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Blocked": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}
const TYPE_COLORS: Record<string, string> = {
  "Pre-Distribution": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  " opportunistic": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Merge-in-Transit": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Deconsolidation": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Consolidation": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "E-Commerce Sort": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}
const OP_STATUS_COLORS: Record<string, string> = {
  "Queued": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "Receiving": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 cdo-status-pulse-active",
  "Sorting": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 cdo-status-pulse-active",
  "Staging": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Loading": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 cdo-status-pulse-active",
  "Completed": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Cancelled": "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
  "Delayed": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 cdo-status-pulse-warning",
}
const PRIORITY_COLORS: Record<string, string> = {
  "Critical": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 cdo-status-pulse-failed",
  "High": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Medium": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Low": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
}
const THROUGHPUT_COLORS: Record<string, string> = {
  "High (>500/hr)": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Medium (200-500/hr)": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Low (<200/hr)": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}
const SHIFT_COLORS: Record<string, string> = {
  "Morning 6AM-2PM": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Evening 2PM-10PM": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Night 10PM-6AM": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
}
const CHART_COLORS = ["#6366f1", "#0891b2", "#ea580c", "#e11d48", "#059669", "#d97706", "#7c3aed", "#14b8a6"]

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const dockStats = DOCK_STATUSES
  const xdTypes = CROSSDOCK_TYPES
  const opStats = OPERATION_STATUSES
  const priorities = PRIORITY_LEVELS
  const doors = DOOR_ASSIGNMENTS
  const skuCats = SKU_CATEGORIES
  const carriers = CARRIER_NAMES
  const hubs = INDIAN_HUBS
  const zones = DESTINATION_ZONES
  const tiers = THROUGHPUT_TIERS
  const shifts = LABOR_SHIFTS

  const kpis = {
    totalOperations: 3456, activeDoors: 18, throughputRate: 425, avgDwellTime: "2.3 hrs",
    sortingAccuracy: 98.7, laborUtilization: 89.2, consolidationRate: 72.5, carrierSLA: 95.1,
  }

  const hourlyThroughput = Array.from({ length: 14 }, (_, i) => ({
    hour: `${ri(6, 21, i) % 24}:00`,
    Inbound: ri(30, 80, i * 7 + 1),
    Sorted: ri(25, 70, i * 7 + 2),
    Outbound: ri(20, 65, i * 7 + 3),
  }))

  const hubThroughput = hubs.map((h, i) => ({
    hub: h.split(" ").slice(0, 2).join(" "),
    Throughput: ri(200, 600, i * 11 + 100),
    SLA: ri(85, 99, i * 11 + 101),
  }))

  const typePie = xdTypes.map((t, i) => ({ name: t.trim(), value: ri(50, 300, i * 13 + 200) }))

  const dockDoors = Array.from({ length: 40 }, (_, i) => {
    const s = i * 17 + 500
    const status = pick(dockStats, s)
    const tier = pick(tiers, s + 1)
    const rate = tier.includes("High") ? ri(500, 800, s + 2) : tier.includes("Medium") ? ri(200, 500, s + 2) : ri(50, 200, s + 2)
    return {
      id: `DD-${String(2000 + i).slice(1)}`,
      door: pick(doors, s + 3),
      hub: pick(hubs, s + 4),
      status,
      type: pick(xdTypes, s + 5),
      throughput: rate,
      throughputTier: tier,
      carrier: pick(carriers, s + 6),
      zone: pick(zones, s + 7),
      dwellTime: `${(seededRandom(s + 8) * 3 + 0.5).toFixed(1)} hrs`,
      avgPkgWeight: `${(seededRandom(s + 9) * 15 + 1).toFixed(1)} kg`,
      packagesProcessed: ri(50, 800, s + 10),
      shift: pick(shifts, s + 11),
      lastOperation: `${ri(1, 28, s + 12)}/${ri(1, 12, s + 13)}/2025`,
    }
  })

  const operations = Array.from({ length: 70 }, (_, i) => {
    const s = i * 23 + 800
    return {
      id: `XDO-${String(7000 + i).slice(1)}`,
      type: pick(xdTypes, s + 1),
      status: pick(opStats, s + 2),
      priority: pick(priorities, s + 3),
      inboundCarrier: pick(carriers, s + 4),
      outboundCarrier: pick(carriers, s + 5),
      door: pick(doors, s + 6),
      hub: pick(hubs, s + 7),
      destination: pick(zones, s + 8),
      skuCategory: pick(skuCats, s + 9),
      packageCount: ri(5, 200, s + 10),
      totalWeight: `${(seededRandom(s + 11) * 50 + 5).toFixed(1)} kg`,
      value: formatINR(ri(20000, 2000000, s + 12)),
      dwellTime: `${(seededRandom(s + 13) * 4 + 0.5).toFixed(1)} hrs`,
      startTime: `${ri(1, 28, s + 14)}/${ri(1, 12, s + 15)}/2025`,
      targetSLA: `${ri(1, 4, s + 16)}h ${ri(0, 59, s + 17)}m`,
    }
  })

  const sortPlan = Array.from({ length: 55 }, (_, i) => {
    const s = i * 29 + 1200
    return {
      id: `SP-${String(9000 + i).slice(1)}`,
      destination: pick(zones, s + 1),
      carrier: pick(carriers, s + 2),
      outboundDoor: pick(doors, s + 3),
      scheduledTime: `${ri(6, 22, s + 4)}:${String(ri(0, 59, s + 5)).padStart(2, "0")}`,
      packageCount: ri(10, 150, s + 6),
      weight: `${(seededRandom(s + 7) * 40 + 2).toFixed(1)} kg`,
      skuCount: ri(5, 50, s + 8),
      priority: pick(priorities, s + 9),
      status: pick(opStats.filter(x => x === "Queued" || x === "Completed" || x === "Delayed"), s + 10),
      hub: pick(hubs, s + 11),
      sortAccuracy: ri(92, 100, s + 12),
      assignedStaff: ri(2, 8, s + 13),
    }
  })

  const analyticsKpis = {
    avgDwellTime: "2.3 hrs", throughputPeak: "625/hr", sortAccuracy: "98.7%",
    consolidationEfficiency: "72.5%", laborCost: formatINR(1250000), doorUtilization: "87.5%",
    carrierOnTime: "95.1%", volumeGrowth: "+18%",
  }
  const dailyTrend = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    Inbound: ri(200, 450, i * 31 + 2000),
    Outbound: ri(180, 420, i * 31 + 2001),
    CrossDocked: ri(150, 350, i * 31 + 2002),
  }))
  const doorUtilChart = doors.map((d, i) => ({
    door: d, Utilization: ri(50, 100, i * 37 + 2200),
  }))
  const carrierSLAChart = carriers.slice(0, 8).map((c, i) => ({
    carrier: c.split(" ")[0], SLA: ri(85, 99, i * 41 + 2400),
  }))
  const costTrend = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    Labor: ri(800000, 2000000, i * 47 + 2600),
    Equipment: ri(200000, 600000, i * 47 + 2601),
    Overhead: ri(100000, 400000, i * 47 + 2602),
  }))

  return {
    kpis, hourlyThroughput, hubThroughput, typePie, dockDoors, operations,
    sortPlan, analyticsKpis, dailyTrend, doorUtilChart, carrierSLAChart, costTrend,
  }
}

// ============================================================================
// Unique Visual Components
// ============================================================================
function DockStatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", DOCK_STATUS_COLORS[status] || "")}>{status}</span>
}

function TypeBadge({ type }: { type: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", TYPE_COLORS[type] || "")}>{type.trim()}</span>
}

function OpStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", OP_STATUS_COLORS[status] || "")}>
      {(status === "Receiving" || status === "Sorting" || status === "Loading") && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" /></span>}
      {status === "Delayed" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" /></span>}
      {status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", PRIORITY_COLORS[priority] || "")}>
      {priority === "Critical" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" /></span>}
      {priority}
    </span>
  )
}

function ThroughputTierBadge({ tier }: { tier: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", THROUGHPUT_COLORS[tier] || "")}>{tier}</span>
}

function ShiftBadge({ shift }: { shift: string }) {
  const icon = shift.includes("Morning") ? "🌅" : shift.includes("Evening") ? "🌆" : "🌙"
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", SHIFT_COLORS[shift] || "")}>{icon} {shift.split(" ")[0]}</span>
}

function ThroughputBar({ rate }: { rate: number }) {
  const pct = Math.min(100, rate / 8)
  const color = pct >= 62 ? "from-emerald-400 to-emerald-500" : pct >= 25 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"
  return (
    <div className="flex items-center gap-2">
      <div className="cdo-throughput-bar h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{rate}/hr</span>
    </div>
  )
}

function DwellTimeTile({ time }: { time: string }) {
  const num = parseFloat(time)
  const color = num <= 2 ? "text-emerald-600 dark:text-emerald-400" : num <= 4 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"
  return (
    <div className="cdo-tile-dwell flex items-center gap-1.5">
      <Timer className={cn("h-3.5 w-3.5", color)} />
      <span className={cn("text-xs font-semibold", color)}>{time}</span>
    </div>
  )
}

function PackageCountBadge({ count }: { count: number }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-900/40 dark:text-slate-300"><Package className="h-3 w-3" />{count}</span>
}

function WeightTile({ weight }: { weight: string }) {
  return <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400"><Weight className="h-3 w-3" />{weight}</span>
}

function ValueTile({ value }: { value: string }) {
  return <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300"><IndianRupee className="h-3 w-3" />{value}</span>
}

function HubBadge({ hub }: { hub: string }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"><Building2 className="h-3 w-3" />{hub.split(" ").slice(0, 2).join(" ")}</span>
}

function ZoneBadge({ zone }: { zone: string }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">{zone}</span>
}

function SLABar({ sla }: { sla: number }) {
  const color = sla >= 95 ? "from-emerald-400 to-emerald-500" : sla >= 85 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"
  return (
    <div className="flex items-center gap-2">
      <div className="cdo-sla-bar h-2.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r", color)} style={{ width: `${sla}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{sla}%</span>
    </div>
  )
}

function DoorUtilizationBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? "from-rose-400 to-rose-500" : pct >= 70 ? "from-amber-400 to-amber-500" : "from-emerald-400 to-emerald-500"
  return (
    <div className="flex items-center gap-2">
      <div className="cdo-door-util-bar h-2.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{pct}%</span>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export default function CrossDockOptimizationView() {
  const [activeTab, setActiveTab] = useState("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedDoor, setSelectedDoor] = useState<typeof data.dockDoors[0] | null>(null)
  const [selectedOp, setSelectedOp] = useState<typeof data.operations[0] | null>(null)
  const [selectedSort, setSelectedSort] = useState<typeof data.sortPlan[0] | null>(null)
  const { toast } = useToast()

  const data = useMemo(() => generateData(), [])

  const sortData = <T extends Record<string, unknown>>(arr: T[], col: string) => {
    if (!sortCol || sortCol !== col) return arr
    return [...arr].sort((a, b) => {
      const va = a[col], vb = b[col]
      if (typeof va === "number" && typeof vb === "number") return sortAsc ? va - vb : vb - va
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }
  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc)
    else { setSortCol(col); setSortAsc(true) }
  }
  const SortHeader = ({ col, children }: { col: string; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => handleSort(col)}>
      <div className={cn("flex items-center gap-1 transition-all", sortCol === col ? "font-bold text-indigo-700 dark:text-indigo-300 scale-105" : "hover:text-indigo-600")}>
        {children} {sortCol === col && (sortAsc ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
      </div>
    </TableHead>
  )

  // DoorOpen2 fallback icon (ScanBarcode used as placeholder)
  const DoorOpen2 = ScanBarcode

  const kpis = [
    { label: "Total Operations", value: data.kpis.totalOperations.toLocaleString(), icon: GitFork, color: "from-indigo-500 to-indigo-600", change: "+15%" },
    { label: "Active Doors", value: data.kpis.activeDoors.toString(), icon: DoorOpen2, color: "from-cyan-500 to-cyan-600", change: "+2" },
    { label: "Throughput Rate", value: `${data.kpis.throughputRate}/hr`, icon: Gauge, color: "from-emerald-500 to-emerald-600", change: "+8%" },
    { label: "Avg Dwell Time", value: data.kpis.avgDwellTime, icon: Timer, color: "from-amber-500 to-amber-600", change: "-0.3h" },
    { label: "Sort Accuracy", value: `${data.kpis.sortingAccuracy}%`, icon: Target, color: "from-blue-500 to-blue-600", change: "+0.4%" },
    { label: "Labor Util.", value: `${data.kpis.laborUtilization}%`, icon: Users, color: "from-violet-500 to-violet-600", change: "+3.1%" },
    { label: "Consolidation", value: `${data.kpis.consolidationRate}%`, icon: Layers, color: "from-teal-500 to-teal-600", change: "+5.2%" },
    { label: "Carrier SLA", value: `${data.kpis.carrierSLA}%`, icon: Truck, color: "from-orange-500 to-orange-600", change: "+1.8%" },
  ]

  const filteredDoors = sortData(data.dockDoors.filter(d =>
    !searchTerm || d.hub.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.door.toLowerCase().includes(searchTerm.toLowerCase())
  ), sortCol || "id")

  const filteredOps = sortData(data.operations, sortCol || "priority")

  return (
    <div className="cdo-container space-y-4">
      <PageHeader title="Cross-Dock Optimization" description="High-throughput cross-docking operations for rapid package sorting, consolidation & distribution across India" />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="cdo-tabs-list bg-gray-100 dark:bg-gray-800">
          {["Cross-Dock Dashboard", "Dock Door Management", "Operations Queue", "Sort Plan", "Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="cdo-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className="cdo-kpi-card relative overflow-hidden border-l-4" style={{ borderLeftColor: ["#6366f1","#0891b2","#059669","#d97706","#3b82f6","#7c3aed","#0d9488","#ea580c"][i] }}>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80" style={{ background: `linear-gradient(90deg, ${["#6366f1","#0891b2","#059669","#d97706","#3b82f6","#7c3aed","#0d9488","#ea580c"][i]}, ${["#818cf8","#06b6d4","#34d399","#f59e0b","#60a5fa","#a78bfa","#14b8a6","#f97316"][i]})` }} />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{k.label}</p>
                      <p className="cdo-kpi-value mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{k.value}</p>
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{k.change}</p>
                    </div>
                    <div className={cn("cdo-kpi-icon flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md", k.color)}><k.icon className="h-5 w-5" /></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="cdo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Hourly Throughput</CardTitle></CardHeader><CardContent><AreaChart data={data.hourlyThroughput}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="Inbound" stroke="#6366f1" fill="#6366f180" /><Area type="monotone" dataKey="Sorted" stroke="#0891b2" fill="#0891b280" /><Area type="monotone" dataKey="Outbound" stroke="#059669" fill="#05966980" /></AreaChart></CardContent></Card>
            <Card className="cdo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Hub Throughput & SLA</CardTitle></CardHeader><CardContent><BarChart data={data.hubThroughput}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hub" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="Throughput" fill="#6366f1" /><Bar dataKey="SLA" fill="#0891b2" /></BarChart></CardContent></Card>
            <Card className="cdo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Cross-Dock Type Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.typePie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{data.typePie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        {/* Tab 1: Dock Doors */}
        <TabsContent value="1" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search by hub, carrier or door..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); toast.info("Cleared", "Filters reset") }}>Clear</Button>
          </div>
          <Card className="cdo-table-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="id">ID</SortHeader>
                  <TableHead>Door</TableHead>
                  <TableHead>Hub</TableHead>
                  <SortHeader col="status">Status</SortHeader>
                  <TableHead>Type</TableHead>
                  <SortHeader col="throughput">Throughput</SortHeader>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Dwell Time</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredDoors.slice(0, 25).map((d, i) => (
                    <TableRow key={d.id} className={cn("cdo-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20")}>
                      <TableCell className="font-mono text-xs font-medium">{d.id}</TableCell>
                      <TableCell className="text-xs font-bold">{d.door}</TableCell>
                      <TableCell><HubBadge hub={d.hub} /></TableCell>
                      <TableCell><DockStatusBadge status={d.status} /></TableCell>
                      <TableCell><TypeBadge type={d.type} /></TableCell>
                      <TableCell><ThroughputBar rate={d.throughput} /></TableCell>
                      <TableCell className="text-xs max-w-[120px] truncate">{d.carrier}</TableCell>
                      <TableCell><ZoneBadge zone={d.zone} /></TableCell>
                      <TableCell><DwellTimeTile time={d.dwellTime} /></TableCell>
                      <TableCell><ShiftBadge shift={d.shift} /></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="cdo-action-btn" onClick={() => { setSelectedDoor(d); toast.info("Dock Door", `Viewing ${d.door}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Operations */}
        <TabsContent value="2" className="space-y-4">
          <Card className="cdo-table-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="id">ID</SortHeader>
                  <TableHead>Type</TableHead>
                  <SortHeader col="status">Status</SortHeader>
                  <SortHeader col="priority">Priority</SortHeader>
                  <TableHead>Inbound</TableHead>
                  <TableHead>Outbound</TableHead>
                  <TableHead>Door</TableHead>
                  <TableHead>Packages</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredOps.slice(0, 25).map((o, i) => (
                    <TableRow key={o.id} className={cn("cdo-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20")}>
                      <TableCell className="font-mono text-xs font-medium">{o.id}</TableCell>
                      <TableCell><TypeBadge type={o.type} /></TableCell>
                      <TableCell><OpStatusBadge status={o.status} /></TableCell>
                      <TableCell><PriorityBadge priority={o.priority} /></TableCell>
                      <TableCell className="text-xs max-w-[110px] truncate">{o.inboundCarrier}</TableCell>
                      <TableCell className="text-xs max-w-[110px] truncate">{o.outboundCarrier}</TableCell>
                      <TableCell className="text-xs">{o.door}</TableCell>
                      <TableCell><PackageCountBadge count={o.packageCount} /></TableCell>
                      <TableCell><WeightTile weight={o.totalWeight} /></TableCell>
                      <TableCell><ValueTile value={o.value} /></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="cdo-action-btn" onClick={() => { setSelectedOp(o); toast.info("Operation", `Viewing ${o.id}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Sort Plan */}
        <TabsContent value="3" className="space-y-4">
          <Card className="cdo-table-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="id">ID</SortHeader>
                  <TableHead>Destination</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Outbound Door</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <SortHeader col="packageCount">Packages</SortHeader>
                  <SortHeader col="sortAccuracy">Accuracy</SortHeader>
                  <SortHeader col="priority">Priority</SortHeader>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {data.sortPlan.slice(0, 25).map((sp, i) => (
                    <TableRow key={sp.id} className={cn("cdo-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20")}>
                      <TableCell className="font-mono text-xs font-medium">{sp.id}</TableCell>
                      <TableCell><ZoneBadge zone={sp.destination} /></TableCell>
                      <TableCell className="text-xs max-w-[120px] truncate">{sp.carrier}</TableCell>
                      <TableCell className="text-xs">{sp.outboundDoor}</TableCell>
                      <TableCell className="text-xs">{sp.scheduledTime}</TableCell>
                      <TableCell><PackageCountBadge count={sp.packageCount} /></TableCell>
                      <TableCell><SLABar sla={sp.sortAccuracy} /></TableCell>
                      <TableCell><PriorityBadge priority={sp.priority} /></TableCell>
                      <TableCell><OpStatusBadge status={sp.status} /></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="cdo-action-btn" onClick={() => { setSelectedSort(sp); toast.info("Sort Plan", `Viewing ${sp.id}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Analytics */}
        <TabsContent value="4" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Avg Dwell Time", value: data.analyticsKpis.avgDwellTime, icon: Timer, color: "from-indigo-500 to-indigo-600" },
              { label: "Peak Throughput", value: data.analyticsKpis.throughputPeak, icon: Gauge, color: "from-cyan-500 to-cyan-600" },
              { label: "Sort Accuracy", value: data.analyticsKpis.sortAccuracy, icon: Target, color: "from-emerald-500 to-emerald-600" },
              { label: "Consolidation", value: data.analyticsKpis.consolidationEfficiency, icon: Layers, color: "from-amber-500 to-amber-600" },
              { label: "Labor Cost", value: data.analyticsKpis.laborCost, icon: IndianRupee, color: "from-violet-500 to-violet-600" },
              { label: "Door Util.", value: data.analyticsKpis.doorUtilization, icon: Warehouse, color: "from-blue-500 to-blue-600" },
              { label: "Carrier On-Time", value: data.analyticsKpis.carrierOnTime, icon: Truck, color: "from-orange-500 to-orange-600" },
              { label: "Volume Growth", value: data.analyticsKpis.volumeGrowth, icon: TrendingUp, color: "from-teal-500 to-teal-600" },
            ].map((k, i) => (
              <Card key={i} className="cdo-analytics-card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("cdo-analytics-icon flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", k.color)}><k.icon className="h-4.5 w-4.5" /></div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{k.label}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{k.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cdo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Daily Volume Trend</CardTitle></CardHeader><CardContent><LineChart data={data.dailyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="Inbound" stroke="#6366f1" strokeWidth={2} /><Line type="monotone" dataKey="Outbound" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="CrossDocked" stroke="#0891b2" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="cdo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Door Utilization</CardTitle></CardHeader><CardContent><BarChart data={data.doorUtilChart} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="door" type="category" tick={{ fontSize: 10 }} width={65} /><Tooltip /><Bar dataKey="Utilization" fill="#6366f1" /></BarChart></CardContent></Card>
            <Card className="cdo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Carrier SLA Performance</CardTitle></CardHeader><CardContent><BarChart data={data.carrierSLAChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="carrier" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="SLA" fill="#0891b2" /></BarChart></CardContent></Card>
            <Card className="cdo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Cost Breakdown (6-Month)</CardTitle></CardHeader><CardContent><AreaChart data={data.costTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => formatINR(v)} /><Area type="monotone" dataKey="Labor" stackId="1" stroke="#6366f1" fill="#6366f180" /><Area type="monotone" dataKey="Equipment" stackId="1" stroke="#0891b2" fill="#0891b280" /><Area type="monotone" dataKey="Overhead" stackId="1" stroke="#d97706" fill="#d9770680" /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sheet: Dock Door */}
      <Sheet open={!!selectedDoor} onOpenChange={o => { if (!o) setSelectedDoor(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedDoor && (<>
            <SheetHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
              <SheetTitle className="text-white flex items-center gap-2"><Warehouse className="h-5 w-5" /> {selectedDoor.door}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-2">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Status</p><DockStatusBadge status={selectedDoor.status} /></div>
                <div><p className="text-xs text-gray-500">Type</p><TypeBadge type={selectedDoor.type} /></div>
                <div><p className="text-xs text-gray-500">Throughput</p><ThroughputBar rate={selectedDoor.throughput} /></div>
                <div><p className="text-xs text-gray-500">Tier</p><ThroughputTierBadge tier={selectedDoor.throughputTier} /></div>
              </div>
              <Separator />
              <div><p className="text-xs text-gray-500 mb-1">Hub</p><HubBadge hub={selectedDoor.hub} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Carrier</p><span className="text-sm">{selectedDoor.carrier}</span></div>
                <div><p className="text-xs text-gray-500">Zone</p><ZoneBadge zone={selectedDoor.zone} /></div>
              </div>
              <div className="flex items-center justify-between"><span className="text-xs text-gray-500">Dwell Time</span><DwellTimeTile time={selectedDoor.dwellTime} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Packages</p><span className="text-lg font-bold">{selectedDoor.packagesProcessed}</span></div>
                <div><p className="text-xs text-gray-500">Shift</p><ShiftBadge shift={selectedDoor.shift} /></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="cdo-action-btn flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success("Assigned", `${selectedDoor.door} assigned`)}>Assign</Button>
                <Button variant="outline" className="cdo-action-btn" onClick={() => toast.info("Maintenance", `Maintenance for ${selectedDoor.door}`)}>Maintenance</Button>
              </div>
            </div>
          </>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Operation */}
      <Sheet open={!!selectedOp} onOpenChange={o => { if (!o) setSelectedOp(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedOp && (<>
            <SheetHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
              <SheetTitle className="text-white flex items-center gap-2"><GitFork className="h-5 w-5" /> {selectedOp.id}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-2">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Status</p><OpStatusBadge status={selectedOp.status} /></div>
                <div><p className="text-xs text-gray-500">Priority</p><PriorityBadge priority={selectedOp.priority} /></div>
                <div><p className="text-xs text-gray-500">Type</p><TypeBadge type={selectedOp.type} /></div>
                <div><p className="text-xs text-gray-500">Door</p><span className="text-sm font-medium">{selectedOp.door}</span></div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Inbound:</span><span className="text-sm font-medium">{selectedOp.inboundCarrier}</span>
                <ArrowLeftRight className="h-3 w-3 text-gray-400 mx-1" />
                <span className="text-xs text-gray-500">Outbound:</span><span className="text-sm font-medium">{selectedOp.outboundCarrier}</span>
              </div>
              <HubBadge hub={selectedOp.hub} />
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Packages</p><PackageCountBadge count={selectedOp.packageCount} /></div>
                <div><p className="text-xs text-gray-500">Weight</p><WeightTile weight={selectedOp.totalWeight} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Value</p><ValueTile value={selectedOp.value} /></div>
                <div><p className="text-xs text-gray-500">Target SLA</p><span className="text-sm font-medium">{selectedOp.targetSLA}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="cdo-action-btn flex-1 bg-cyan-600 hover:bg-cyan-700" onClick={() => toast.success("Updated", `${selectedOp.id} updated`)}>Update Status</Button>
                <Button variant="outline" className="cdo-action-btn" onClick={() => toast.info("Reassigned", `${selectedOp.id} reassigned`)}>Reassign</Button>
              </div>
            </div>
          </>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Sort Plan */}
      <Sheet open={!!selectedSort} onOpenChange={o => { if (!o) setSelectedSort(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedSort && (<>
            <SheetHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
              <SheetTitle className="text-white flex items-center gap-2"><LayoutGrid className="h-5 w-5" /> {selectedSort.id}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-2">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Status</p><OpStatusBadge status={selectedSort.status} /></div>
                <div><p className="text-xs text-gray-500">Priority</p><PriorityBadge priority={selectedSort.priority} /></div>
                <div><p className="text-xs text-gray-500">Accuracy</p><SLABar sla={selectedSort.sortAccuracy} /></div>
                <div><p className="text-xs text-gray-500">Staff</p><span className="text-lg font-bold">{selectedSort.assignedStaff}</span></div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Destination</p><ZoneBadge zone={selectedSort.destination} /></div>
                <div><p className="text-xs text-gray-500">Carrier</p><span className="text-sm">{selectedSort.carrier}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Outbound Door</p><span className="text-sm">{selectedSort.outboundDoor}</span></div>
                <div><p className="text-xs text-gray-500">Scheduled</p><span className="text-sm">{selectedSort.scheduledTime}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Packages</p><PackageCountBadge count={selectedSort.packageCount} /></div>
                <div><p className="text-xs text-gray-500">SKUs</p><span className="text-sm">{selectedSort.skuCount}</span></div>
              </div>
              <HubBadge hub={selectedSort.hub} />
              <div className="flex gap-2 pt-2">
                <Button className="cdo-action-btn flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => toast.success("Executed", `Sort plan ${selectedSort.id} executed`)}>Execute</Button>
                <Button variant="outline" className="cdo-action-btn" onClick={() => toast.info("Rescheduled", `${selectedSort.id} rescheduled`)}>Reschedule</Button>
              </div>
            </div>
          </>)}
        </SheetContent>
      </Sheet>
    </div>
  )
}
