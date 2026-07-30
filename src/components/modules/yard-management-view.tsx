"use client"

import { useState, useMemo, useCallback } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Truck,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Building2,
  User,
  ChevronRight,
  Eye,
  Plus,
  LogIn,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Gauge,
  ParkingCircle,
  Container,
  Warehouse,
  Navigation,
  ArrowRight,
  Timer,
  Snowflake,
  Flame,
  ShieldAlert,
  Cog,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { YardDetailDrawer, type YardVehicleDetail } from "@/components/shared/yard-detail-drawer"
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
  Legend,
  Tooltip,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ============================================================================
// Types
// ============================================================================

type YardZone =
  | "trailer-park"
  | "cold-storage"
  | "bonded"
  | "hazmat"
  | "empty-return"
  | "inspection-bay"

type VehicleStatus =
  | "arriving"
  | "gate-in"
  | "parked"
  | "yard-move"
  | "awaiting-dock"
  | "dock-assigned"
  | "gate-out"
  | "detention"

type VehicleType = "tractor" | "trailer" | "container-20ft" | "container-40ft" | "reefer"

interface YardVehicle {
  id: string
  regNumber: string
  type: VehicleType
  driver: string
  carrier: string
  zone: YardZone
  slot: string
  status: VehicleStatus
  waitMinutes: number
  detentionMinutes: number
  dockAssignment?: string
  warehouse: string
  shipmentRef: string
  arrivalTime: string
  priority: "high" | "normal" | "low"
}

// ============================================================================
// Mock data — 18 yard vehicles across 6 warehouses, 6 zones, 8 statuses
// ============================================================================

const yardVehicles: YardVehicle[] = [
  { id: "1", regNumber: "TN-01-AB-1234", type: "container-40ft", driver: "Ravi Kumar", carrier: "BlueDart", zone: "trailer-park", slot: "A-12", status: "parked", waitMinutes: 45, detentionMinutes: 0, dockAssignment: "IN-03", warehouse: "Chennai Hub", shipmentRef: "SHP-2024-8821", arrivalTime: "08:15", priority: "normal" },
  { id: "2", regNumber: "MH-12-CD-5678", type: "trailer", driver: "Suresh Patel", carrier: "VRL Logistics", zone: "trailer-park", slot: "A-15", status: "awaiting-dock", waitMinutes: 92, detentionMinutes: 22, dockAssignment: "IN-05", warehouse: "Chennai Hub", shipmentRef: "SHP-2024-8835", arrivalTime: "07:42", priority: "high" },
  { id: "3", regNumber: "KA-05-EF-9012", type: "reefer", driver: "Anil Reddy", carrier: "SnowMan", zone: "cold-storage", slot: "CS-04", status: "dock-assigned", waitMinutes: 38, detentionMinutes: 0, dockAssignment: "IN-08", warehouse: "Bangalore Tech", shipmentRef: "SHP-2024-8842", arrivalTime: "09:30", priority: "high" },
  { id: "4", regNumber: "DL-10-GH-3456", type: "container-20ft", driver: "Mohit Sharma", carrier: "DHL", zone: "bonded", slot: "BD-02", status: "parked", waitMinutes: 65, detentionMinutes: 5, warehouse: "Gurugram Hub", shipmentRef: "SHP-2024-8849", arrivalTime: "07:55", priority: "normal" },
  { id: "5", regNumber: "GJ-01-IJ-7890", type: "tractor", driver: "Imran Khan", carrier: "Transport Corp", zone: "trailer-park", slot: "A-22", status: "yard-move", waitMinutes: 12, detentionMinutes: 0, warehouse: "Pune DC", shipmentRef: "SHP-2024-8856", arrivalTime: "10:05", priority: "normal" },
  { id: "6", regNumber: "RJ-14-KL-2345", type: "trailer", driver: "Pradeep Singh", carrier: "TCI Supply", zone: "trailer-park", slot: "A-08", status: "detention", waitMinutes: 215, detentionMinutes: 95, warehouse: "Gurugram Hub", shipmentRef: "SHP-2024-8863", arrivalTime: "05:20", priority: "high" },
  { id: "7", regNumber: "WB-20-MN-6789", type: "container-40ft", driver: "Sourav Das", carrier: "Maersk", zone: "bonded", slot: "BD-05", status: "parked", waitMinutes: 78, detentionMinutes: 18, warehouse: "Kolkata East", shipmentRef: "SHP-2024-8870", arrivalTime: "08:48", priority: "normal" },
  { id: "8", regNumber: "TG-09-OP-0123", type: "container-20ft", driver: "Venkat Rao", carrier: "Allcargo", zone: "inspection-bay", slot: "IB-01", status: "awaiting-dock", waitMinutes: 54, detentionMinutes: 0, dockAssignment: "IN-02", warehouse: "Pune DC", shipmentRef: "SHP-2024-8877", arrivalTime: "09:18", priority: "high" },
  { id: "9", regNumber: "KL-07-QR-4567", type: "reefer", driver: "Joseph Mathew", carrier: "Coldex", zone: "cold-storage", slot: "CS-07", status: "gate-in", waitMinutes: 8, detentionMinutes: 0, warehouse: "Chennai Hub", shipmentRef: "SHP-2024-8884", arrivalTime: "10:32", priority: "normal" },
  { id: "10", regNumber: "UP-16-ST-8901", type: "tractor", driver: "Manoj Verma", carrier: "BlueDart", zone: "trailer-park", slot: "A-18", status: "arriving", waitMinutes: 0, detentionMinutes: 0, warehouse: "Noida North", shipmentRef: "SHP-2024-8891", arrivalTime: "10:45 (ETA)", priority: "normal" },
  { id: "11", regNumber: "HR-26-UV-2345", type: "trailer", driver: "Vikram Singh", carrier: "Safexpress", zone: "hazmat", slot: "HZ-03", status: "parked", waitMinutes: 110, detentionMinutes: 35, warehouse: "Gurugram Hub", shipmentRef: "SHP-2024-8898", arrivalTime: "06:35", priority: "high" },
  { id: "12", regNumber: "PB-08-WX-6789", type: "container-40ft", driver: "Harpreet Kaur", carrier: "DHL", zone: "trailer-park", slot: "A-25", status: "gate-out", waitMinutes: 0, detentionMinutes: 0, warehouse: "Chennai Hub", shipmentRef: "SHP-2024-8905", arrivalTime: "06:15 (departed)", priority: "low" },
  { id: "13", regNumber: "BR-01-YZ-0123", type: "trailer", driver: "Amit Ranjan", carrier: "VRL Logistics", zone: "trailer-park", slot: "A-30", status: "parked", waitMinutes: 35, detentionMinutes: 0, warehouse: "Kolkata East", shipmentRef: "SHP-2024-8912", arrivalTime: "09:55", priority: "normal" },
  { id: "14", regNumber: "OR-02-AB-4567", type: "container-20ft", driver: "Sushant Mohanty", carrier: "Transport Corp", zone: "empty-return", slot: "ER-04", status: "parked", waitMinutes: 22, detentionMinutes: 0, warehouse: "Kolkata East", shipmentRef: "EMTY-2024-3301", arrivalTime: "10:08", priority: "low" },
  { id: "15", regNumber: "TN-22-CD-8901", type: "reefer", driver: "Karthik Raja", carrier: "SnowMan", zone: "cold-storage", slot: "CS-02", status: "dock-assigned", waitMinutes: 28, detentionMinutes: 0, dockAssignment: "IN-01", warehouse: "Chennai Hub", shipmentRef: "SHP-2024-8919", arrivalTime: "08:55", priority: "high" },
  { id: "16", regNumber: "AP-07-EF-2345", type: "container-40ft", driver: "Lakshmi Prasad", carrier: "Maersk", zone: "bonded", slot: "BD-08", status: "detention", waitMinutes: 195, detentionMinutes: 75, warehouse: "Bangalore Tech", shipmentRef: "SHP-2024-8926", arrivalTime: "06:48", priority: "high" },
  { id: "17", regNumber: "GA-03-GH-6789", type: "trailer", driver: "Pedro Fernandes", carrier: "TCI Supply", zone: "trailer-park", slot: "A-11", status: "yard-move", waitMinutes: 5, detentionMinutes: 0, warehouse: "Pune DC", shipmentRef: "SHP-2024-8933", arrivalTime: "10:18", priority: "normal" },
  { id: "18", regNumber: "CH-01-IJ-0123", type: "tractor", driver: "Gurpreet Brar", carrier: "Safexpress", zone: "inspection-bay", slot: "IB-02", status: "awaiting-dock", waitMinutes: 67, detentionMinutes: 12, dockAssignment: "IN-04", warehouse: "Pune DC", shipmentRef: "SHP-2024-8940", arrivalTime: "08:30", priority: "normal" },
]

// ============================================================================
// Status & zone configs
// ============================================================================

const statusConfig: Record<VehicleStatus, { label: string; color: string; bg: string; border: string; icon: typeof Clock }> = {
  arriving: { label: "Arriving (ETA)", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-100 dark:bg-cyan-950", border: "border-cyan-300 dark:border-cyan-700", icon: Navigation },
  "gate-in": { label: "Gate-In", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", border: "border-blue-300 dark:border-blue-700", icon: LogIn },
  parked: { label: "Parked", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-900", border: "border-slate-300 dark:border-slate-700", icon: ParkingCircle },
  "yard-move": { label: "Yard Move", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", border: "border-violet-300 dark:border-violet-700", icon: ArrowRight },
  "awaiting-dock": { label: "Awaiting Dock", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950", border: "border-amber-300 dark:border-amber-700", icon: Clock },
  "dock-assigned": { label: "Dock Assigned", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", border: "border-blue-300 dark:border-blue-700", icon: Truck },
  "gate-out": { label: "Gate-Out", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950", border: "border-emerald-300 dark:border-emerald-700", icon: LogOut },
  detention: { label: "Detention Risk", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", border: "border-red-300 dark:border-red-700", icon: AlertTriangle },
}

const zoneConfig: Record<YardZone, { label: string; color: string; bg: string; icon: typeof Truck; pieColor: string; description: string }> = {
  "trailer-park": { label: "Trailer Park", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", icon: Truck, pieColor: "#3b82f6", description: "General trailer & container parking (Slots A-01 to A-30)" },
  "cold-storage": { label: "Cold Storage Yard", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-100 dark:bg-cyan-950", icon: Snowflake, pieColor: "#06b6d4", description: "Reefer trailers with active cooling (Slots CS-01 to CS-10)" },
  "bonded": { label: "Bonded Area", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", icon: ShieldAlert, pieColor: "#8b5cf6", description: "Customs-bonded import containers (Slots BD-01 to BD-08)" },
  "hazmat": { label: "Hazmat Zone", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", icon: Flame, pieColor: "#ef4444", description: "Hazardous materials — segregated zone (Slots HZ-01 to HZ-05)" },
  "empty-return": { label: "Empty Returns", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-900", icon: Container, pieColor: "#64748b", description: "Empty trailers awaiting return dispatch (Slots ER-01 to ER-06)" },
  "inspection-bay": { label: "Inspection Bay", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950", icon: Cog, pieColor: "#f59e0b", description: "Pre-dock inspection & quarantine area (Slots IB-01 to IB-03)" },
}

const vehicleTypeConfig: Record<VehicleType, { label: string; icon: typeof Truck; color: string }> = {
  tractor: { label: "Tractor Only", icon: Truck, color: "text-slate-600 dark:text-slate-300" },
  trailer: { label: "Trailer", icon: Container, color: "text-blue-600 dark:text-blue-300" },
  "container-20ft": { label: "20ft Container", icon: Container, color: "text-emerald-600 dark:text-emerald-300" },
  "container-40ft": { label: "40ft Container", icon: Container, color: "text-violet-600 dark:text-violet-300" },
  reefer: { label: "Reefer", icon: Snowflake, color: "text-cyan-600 dark:text-cyan-300" },
}

const priorityTheme = {
  high: { label: "HIGH", bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-300", pulse: "yard-priority-pulse" },
  normal: { label: "NORMAL", bg: "bg-slate-100 dark:bg-slate-900", text: "text-slate-700 dark:text-slate-300", pulse: "" },
  low: { label: "LOW", bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300", pulse: "" },
} as const

// ============================================================================
// Mock data: 24h gate activity trend
// ============================================================================

const gateActivity24h = Array.from({ length: 24 }, (_, h) => {
  const isPeak = h >= 8 && h <= 11
  const isPeak2 = h >= 17 && h <= 20
  const isNight = h < 6 || h > 22
  const base = isPeak ? 8 : isPeak2 ? 7 : isNight ? 1 : 4
  const variance = (h * 7 + 3) % 4
  return {
    hour: `${String(h).padStart(2, "0")}:00`,
    gateIn: Math.max(0, base + variance - 1),
    gateOut: Math.max(0, base + variance - 2 + (isPeak2 ? 1 : 0)),
  }
})

// ============================================================================
// Component
// ============================================================================

const gateChartConfig = {
  gateIn: { label: "Gate-In", color: "#3b82f6" },
  gateOut: { label: "Gate-Out", color: "#10b981" },
} satisfies ChartConfig

const zoneChartConfig = {
  count: { label: "Vehicles", color: "#3b82f6" },
} satisfies ChartConfig

export function YardManagementView() {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [zoneFilter, setZoneFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [selectedTab, setSelectedTab] = useState("all")
  const [assignDockFor, setAssignDockFor] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailVehicle, setDetailVehicle] = useState<YardVehicleDetail | null>(null)

  const openDetail = (v: typeof yardVehicles[0]) => {
    setDetailVehicle({
      id: v.id,
      regNumber: v.regNumber,
      type: v.type,
      driver: v.driver,
      carrier: v.carrier,
      zone: v.zone,
      slot: v.slot,
      status: v.status,
      waitMinutes: v.waitMinutes,
      detentionMinutes: v.detentionMinutes,
      dockAssignment: v.dockAssignment,
      warehouse: v.warehouse,
      shipmentRef: v.shipmentRef,
      arrivalTime: v.arrivalTime,
      priority: v.priority,
    })
    setDetailOpen(true)
  }

  const filteredVehicles = useMemo(() => {
    return yardVehicles.filter((v) => {
      const matchSearch =
        v.regNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.driver.toLowerCase().includes(search.toLowerCase()) ||
        v.shipmentRef.toLowerCase().includes(search.toLowerCase()) ||
        v.carrier.toLowerCase().includes(search.toLowerCase())
      const matchZone = zoneFilter === "all" || v.zone === zoneFilter
      const matchStatus = statusFilter === "all" || v.status === statusFilter
      const matchWarehouse = warehouseFilter === "all" || v.warehouse === warehouseFilter
      const matchTab =
        selectedTab === "all" ||
        (selectedTab === "arriving" && ["arriving", "gate-in"].includes(v.status)) ||
        (selectedTab === "parked" && ["parked", "yard-move"].includes(v.status)) ||
        (selectedTab === "awaiting" && ["awaiting-dock", "dock-assigned"].includes(v.status)) ||
        (selectedTab === "detention" && v.detentionMinutes > 0)
      return matchSearch && matchZone && matchStatus && matchWarehouse && matchTab
    })
  }, [search, zoneFilter, statusFilter, warehouseFilter, selectedTab])

  // KPI metrics
  const totalInYard = yardVehicles.filter((v) => !["gate-out"].includes(v.status)).length
  const avgWaitTime = Math.round(
    yardVehicles.filter((v) => !["gate-out"].includes(v.status)).reduce((s, v) => s + v.waitMinutes, 0) /
    Math.max(1, yardVehicles.filter((v) => !["gate-out"].includes(v.status)).length)
  )
  const detentionRisk = yardVehicles.filter((v) => v.detentionMinutes > 60).length
  const gateIn24h = gateActivity24h.reduce((s, p) => s + p.gateIn, 0)
  const gateOut24h = gateActivity24h.reduce((s, p) => s + p.gateOut, 0)
  const yardUtilization = Math.round((totalInYard / 60) * 100) // 60 total slots

  // Zone distribution
  const zoneDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    yardVehicles.filter((v) => !["gate-out"].includes(v.status)).forEach((v) => {
      counts[v.zone] = (counts[v.zone] || 0) + 1
    })
    return Object.entries(counts).map(([key, count]) => ({
      name: zoneConfig[key as YardZone].label,
      value: count,
      key,
      color: zoneConfig[key as YardZone].pieColor,
    }))
  }, [])

  // Wait time by zone (bar chart)
  const waitByZone = useMemo(() => {
    const sums: Record<string, { total: number; count: number }> = {}
    yardVehicles.filter((v) => !["gate-out"].includes(v.status)).forEach((v) => {
      if (!sums[v.zone]) sums[v.zone] = { total: 0, count: 0 }
      sums[v.zone].total += v.waitMinutes
      sums[v.zone].count += 1
    })
    return Object.entries(sums).map(([key, v]) => ({
      name: zoneConfig[key as YardZone].label.split(" ")[0],
      avgWait: v.count > 0 ? Math.round(v.total / v.count) : 0,
      vehicles: v.count,
      color: zoneConfig[key as YardZone].pieColor,
    }))
  }, [])

  const warehouses = Array.from(new Set(yardVehicles.map((v) => v.warehouse)))

  const handleExport = () => {
    const rows = filteredVehicles.map((v) => ({
      RegNumber: v.regNumber,
      Type: vehicleTypeConfig[v.type].label,
      Driver: v.driver,
      Carrier: v.carrier,
      Zone: zoneConfig[v.zone].label,
      Slot: v.slot,
      Status: statusConfig[v.status].label,
      WaitMinutes: v.waitMinutes,
      DetentionMinutes: v.detentionMinutes,
      Dock: v.dockAssignment ?? "—",
      Warehouse: v.warehouse,
      Shipment: v.shipmentRef,
      Arrival: v.arrivalTime,
      Priority: v.priority,
    }))
    exportToCSV(rows, "yard-management")
    toast.success("Export complete", `${rows.length} yard vehicles exported to CSV.`)
  }

  const handleRefresh = () => {
    toast.info("Refreshing yard", "Syncing vehicle positions from yard RTLS...")
  }

  const handleAssignDock = (reg: string) => {
    setAssignDockFor(reg)
    setTimeout(() => {
      toast.success("Dock assigned", `${reg} → IN-${Math.floor(Math.random() * 9) + 1}. Move authorized.`)
      setAssignDockFor(null)
    }, 800)
  }

  const handleYardMove = (reg: string, slot: string) => {
    toast.info("Yard move", `${reg} → slot ${slot}. Driver notified.`)
  }

  const handleGateOut = (reg: string) => {
    toast.success("Gate-out", `${reg} released. Boom barrier opened.`)
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <PageHeader
        title="Yard Management"
        description="Real-time trailer/container tracking, gate control, slot management, and detention monitoring"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 yard-kpi-enter">
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Trucks in Yard
              </p>
              <Activity className="h-3 w-3 text-blue-500" />
            </div>
            <p className="text-xl font-bold text-number">{totalInYard}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="h-2.5 w-2.5" /> +3 vs last hour
            </p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Avg Wait Time
              </p>
              <Timer className="h-3 w-3 text-amber-500" />
            </div>
            <p className="text-xl font-bold text-number">{avgWaitTime}min</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
              <TrendingDown className="h-2.5 w-2.5" /> -8min vs avg
            </p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Detention Risk
              </p>
              {detentionRisk > 0 ? <AlertTriangle className="h-3 w-3 text-red-500 yard-priority-pulse" /> : <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
            </div>
            <p className={cn("text-xl font-bold text-number", detentionRisk > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>{detentionRisk}</p>
            <p className="text-[10px] text-muted-foreground">{detentionRisk > 0 ? ">60min detention" : "No risk"}</p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <LogIn className="h-3 w-3" />
                Gate-In (24h)
              </p>
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-number">{gateIn24h}</p>
            <p className="text-[10px] text-muted-foreground">check-ins today</p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <LogOut className="h-3 w-3" />
                Gate-Out (24h)
              </p>
              <TrendingDown className="h-3 w-3 text-blue-500" />
            </div>
            <p className="text-xl font-bold text-number">{gateOut24h}</p>
            <p className="text-[10px] text-muted-foreground">releases today</p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Gauge className="h-3 w-3" />
                Yard Utilization
              </p>
              <ParkingCircle className="h-3 w-3 text-violet-500" />
            </div>
            <p className={cn("text-xl font-bold text-number", yardUtilization > 80 ? "text-red-600 dark:text-red-400" : yardUtilization > 60 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>{yardUtilization}%</p>
            <Progress value={yardUtilization} className="h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Top row charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gate activity 24h */}
        <Card className="hover-lift-sm lg:col-span-2 rounded-xl border-border/60 shadow-sm yard-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              24-Hour Gate Activity
            </CardTitle>
            <CardDescription className="text-xs">
              Gate-in vs gate-out per hour · Total: {gateIn24h} in / {gateOut24h} out
            </CardDescription>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle pt-0">
            <ChartContainer config={gateChartConfig} className="aspect-[16/6] w-full">
              <AreaChart data={gateActivity24h} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="yardInGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="yardOutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={20} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="gateIn" type="monotone" stroke="#3b82f6" strokeWidth={1.5} fill="url(#yardInGrad)" />
                <Area dataKey="gateOut" type="monotone" stroke="#10b981" strokeWidth={1.5} fill="url(#yardOutGrad)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Zone distribution pie */}
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm yard-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ParkingCircle className="h-4 w-4 text-violet-500" />
              Yard Zone Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              {totalInYard} active vehicles across {zoneDistribution.length} zones
            </CardDescription>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle pt-0">
            <ChartContainer config={zoneChartConfig} className="aspect-square w-full max-w-[200px] mx-auto">
              <PieChart>
                <Pie
                  data={zoneDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={36}
                  outerRadius={64}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {zoneDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
              {zoneDistribution.map((z) => (
                <div key={z.key} className="flex items-center gap-1 text-[10px]">
                  <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: z.color }} />
                  <span className="text-muted-foreground truncate">{z.name}</span>
                  <span className="font-medium ml-auto">{z.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yard map visualization */}
      <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm yard-map-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            Live Yard Map · Chennai Hub
            <Badge variant="outline" className="badge-interactive text-[9px] ml-2">RTLS Live</Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Real-time slot occupancy · 30 trailer park slots + 10 cold storage + 8 bonded + 5 hazmat + 6 empty + 3 inspection
          </CardDescription>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-2">
          {/* Trailer Park slots (A-01 to A-30) */}
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1">
                <Truck className="h-3 w-3 text-blue-500" /> Trailer Park (Slots A-01 to A-30)
              </p>
              <div className="grid grid-cols-10 sm:grid-cols-15 gap-1">
                {Array.from({ length: 30 }, (_, i) => {
                  const slotNum = i + 1
                  const slotLabel = `A-${String(slotNum).padStart(2, "0")}`
                  const vehicle = yardVehicles.find((v) => v.slot === slotLabel)
                  const isOccupied = !!vehicle
                  const isDetention = vehicle?.status === "detention"
                  const isAwaiting = vehicle?.status === "awaiting-dock"
                  const isHigh = vehicle?.priority === "high"
                  return (
                    <div
                      key={slotLabel}
                      className={cn(
                        "aspect-square rounded-md border text-[8px] font-mono flex items-center justify-center cursor-pointer transition-all yard-slot-pop",
                        !isOccupied && "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900",
                        isOccupied && !isDetention && !isAwaiting && !isHigh && "bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300",
                        isAwaiting && "bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300",
                        isDetention && "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 yard-detention-pulse",
                        isHigh && !isDetention && "ring-2 ring-red-500/40"
                      )}
                      title={isOccupied ? `${vehicle?.regNumber} · ${vehicle?.driver} · ${statusConfig[vehicle!.status].label}` : `${slotLabel} — Empty`}
                    >
                      {slotNum}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Other zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(["cold-storage", "bonded", "hazmat"] as YardZone[]).map((zoneKey) => {
                const z = zoneConfig[zoneKey]
                const slotsCount = zoneKey === "cold-storage" ? 10 : zoneKey === "bonded" ? 8 : 5
                const occupied = yardVehicles.filter((v) => v.zone === zoneKey && v.status !== "gate-out")
                return (
                  <div key={zoneKey}>
                    <p className={cn("text-[10px] uppercase tracking-wide mb-1.5 flex items-center gap-1", z.color)}>
                      <z.icon className="h-3 w-3" /> {z.label} ({occupied.length}/{slotsCount})
                    </p>
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: slotsCount }, (_, i) => {
                        const slotNum = i + 1
                        const prefix = zoneKey === "cold-storage" ? "CS" : zoneKey === "bonded" ? "BD" : "HZ"
                        const slotLabel = `${prefix}-${String(slotNum).padStart(2, "0")}`
                        const vehicle = yardVehicles.find((v) => v.slot === slotLabel)
                        const isOccupied = !!vehicle
                        return (
                          <div
                            key={slotLabel}
                            className={cn(
                              "aspect-square rounded-md border text-[8px] font-mono flex items-center justify-center transition-all yard-slot-pop",
                              !isOccupied && "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400",
                              isOccupied && cn(z.bg, z.color, "border-current/30")
                            )}
                            title={isOccupied ? `${vehicle?.regNumber} · ${vehicle?.driver}` : `${slotLabel} — Empty`}
                          >
                            {slotNum}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avg wait by zone bar */}
      <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm yard-chart-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Average Wait Time by Zone
          </CardTitle>
          <CardDescription className="text-xs">
            Identifies zones with bottlenecks — Hazmat & Bonded typically have higher wait times due to compliance checks
          </CardDescription>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-0">
          <ChartContainer config={zoneChartConfig} className="aspect-[16/5] w-full">
            <BarChart data={waitByZone} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="avgWait" radius={[4, 4, 0, 0]}>
                {waitByZone.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Active yard vehicles table */}
      <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <Container className="h-4 w-4 text-blue-500" />
                Active Yard Vehicles
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {filteredVehicles.length} of {yardVehicles.length} vehicles · Live tracking with RTLS
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-7 gap-1.5 text-xs" onClick={handleRefresh}>
                <RefreshCw className="h-3 w-3" /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-7 gap-1.5 text-xs" onClick={handleExport}>
                <Download className="h-3 w-3" /> Export
              </Button>
              <Button size="sm" className="press-scale h-7 gap-1.5 text-xs" onClick={() => toast.info("Gate-in", "Opening boom barrier & camera capture...")}>
                <Plus className="h-3 w-3" /> Gate-In
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
            <div className="relative col-span-2 md:col-span-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search reg / driver / shipment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-7 text-xs"
              />
            </div>
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="h-8 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {(Object.keys(zoneConfig) as YardZone[]).map((z) => (
                  <SelectItem key={z} value={z}>{zoneConfig[z].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(Object.keys(statusConfig) as VehicleStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{statusConfig[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="h-8 text-xs">
                <Building2 className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {warehouses.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-5 h-8">
              <TabsTrigger value="all" className="text-[10px]">All ({yardVehicles.length})</TabsTrigger>
              <TabsTrigger value="arriving" className="text-[10px]">Arriving ({yardVehicles.filter((v) => ["arriving", "gate-in"].includes(v.status)).length})</TabsTrigger>
              <TabsTrigger value="parked" className="text-[10px]">Parked ({yardVehicles.filter((v) => ["parked", "yard-move"].includes(v.status)).length})</TabsTrigger>
              <TabsTrigger value="awaiting" className="text-[10px]">Awaiting Dock ({yardVehicles.filter((v) => ["awaiting-dock", "dock-assigned"].includes(v.status)).length})</TabsTrigger>
              <TabsTrigger value="detention" className="text-[10px]">Detention ({yardVehicles.filter((v) => v.detentionMinutes > 0).length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-0">
          <div className="rounded-lg border overflow-hidden">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Vehicle</TableHead>
                  <TableHead className="text-xs">Driver</TableHead>
                  <TableHead className="text-xs">Zone / Slot</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Wait</TableHead>
                  <TableHead className="text-xs text-right">Detention</TableHead>
                  <TableHead className="text-xs">Dock</TableHead>
                  <TableHead className="text-xs">Warehouse</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((v, idx) => {
                  const StatusIcon = statusConfig[v.status].icon
                  const ZoneIcon = zoneConfig[v.zone].icon
                  const VTypeIcon = vehicleTypeConfig[v.type].icon
                  const priority = priorityTheme[v.priority]
                  return (
                    <TableRow
                      key={v.id}
                      className="cursor-pointer hover:bg-accent/40 transition-colors yard-row-in"
                      style={{ animationDelay: `${idx * 40}ms` }}
                      onClick={() => openDetail(v)}
                    >
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <VTypeIcon className={cn("h-3 w-3", vehicleTypeConfig[v.type].color)} />
                            <span className="text-xs font-mono font-semibold">{v.regNumber}</span>
                            {v.priority === "high" && (
                              <span className={cn("text-[9px] px-1 rounded-sm font-medium", priority.bg, priority.text, priority.pulse)}>
                                {priority.label}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground">{vehicleTypeConfig[v.type].label} · {v.carrier}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">{v.driver}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{v.shipmentRef}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <ZoneIcon className={cn("h-3 w-3", zoneConfig[v.zone].color)} />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-medium">{zoneConfig[v.zone].label}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">Slot {v.slot}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium", statusConfig[v.status].bg, statusConfig[v.status].color, statusConfig[v.status].border)}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {statusConfig[v.status].label}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn("text-xs font-medium text-number", v.waitMinutes > 90 ? "text-red-600 dark:text-red-400" : v.waitMinutes > 60 ? "text-amber-600 dark:text-amber-400" : "")}>
                          {v.waitMinutes}min
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {v.detentionMinutes > 0 ? (
                          <span className={cn("text-xs font-medium text-number yard-detention-flash", v.detentionMinutes > 60 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400")}>
                            {v.detentionMinutes}min
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {v.dockAssignment ? (
                          <Badge variant="outline" className="badge-interactive text-[10px] font-mono">{v.dockAssignment}</Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <Building2 className="h-2.5 w-2.5 text-muted-foreground" />
                          {v.warehouse}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {v.status === "awaiting-dock" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] gap-1"
                              disabled={assignDockFor === v.regNumber}
                              onClick={(e) => { e.stopPropagation(); handleAssignDock(v.regNumber) }}
                            >
                              {assignDockFor === v.regNumber ? (
                                <>
                                  <RefreshCw className="h-3 w-3 animate-spin" /> Assigning...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-3 w-3" /> Assign Dock
                                </>
                              )}
                            </Button>
                          )}
                          {v.status === "parked" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] gap-1"
                              onClick={(e) => { e.stopPropagation(); handleYardMove(v.regNumber, `A-${Math.floor(Math.random() * 30) + 1}`) }}
                            >
                              <ArrowRight className="h-3 w-3" /> Move
                            </Button>
                          )}
                          {v.status === "dock-assigned" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] gap-1"
                              onClick={(e) => { e.stopPropagation(); toast.success("Dock move authorized", `${v.regNumber} → ${v.dockAssignment}. Driver notified.`) }}
                            >
                              <Truck className="h-3 w-3" /> To Dock
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); openDetail(v) }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-xs text-muted-foreground">
                      No yard vehicles match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Universal detail drawer — drill-down from vehicle rows */}
      <YardDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        vehicle={detailVehicle}
      />
    </div>
  )
}
