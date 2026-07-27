"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
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
} from "recharts"
import {
  Truck,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  Building2,
  User,
  ChevronRight,
  Eye,
  LogIn,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Gauge,
  ParkingCircle,
  Container,
  Navigation,
  ArrowRight,
  Timer,
  Snowflake,
  Flame,
  ShieldAlert,
  Cog,
  Zap,
  Phone,
  Download,
  Send,
  Printer,
  Calendar,
  FileText,
  History,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Wrench,
  Fuel,
  Camera,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Sparkles,
  Box,
  Weight,
  Ruler,
  Thermometer,
  Battery,
  Radio,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"

// ---------------------------------------------------------------------------
// Types — must match yard-management-view.tsx
// ---------------------------------------------------------------------------

export type YardZone =
  | "trailer-park"
  | "cold-storage"
  | "bonded"
  | "hazmat"
  | "empty-return"
  | "inspection-bay"

export type VehicleStatus =
  | "arriving"
  | "gate-in"
  | "parked"
  | "yard-move"
  | "awaiting-dock"
  | "dock-assigned"
  | "gate-out"
  | "detention"

export type VehicleType = "tractor" | "trailer" | "container-20ft" | "container-40ft" | "reefer"

export interface YardVehicleDetail {
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

interface YardDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: YardVehicleDetail | null
}

// ---------------------------------------------------------------------------
// Status config (mirrors yard-management-view)
// ---------------------------------------------------------------------------

const statusTheme: Record<VehicleStatus, {
  gradient: string
  border: string
  iconBg: string
  iconColor: string
  label: string
  barColor: string
  chipBg: string
  chipText: string
}> = {
  arriving: {
    gradient: "from-cyan-500/15 via-cyan-500/5 to-transparent",
    border: "border-cyan-500/40",
    iconBg: "bg-cyan-100 dark:bg-cyan-950/70",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    label: "Arriving (ETA)",
    barColor: "#06b6d4",
    chipBg: "bg-cyan-100 dark:bg-cyan-950",
    chipText: "text-cyan-700 dark:text-cyan-300",
  },
  "gate-in": {
    gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
    border: "border-blue-500/40",
    iconBg: "bg-blue-100 dark:bg-blue-950/70",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "Gate-In",
    barColor: "#3b82f6",
    chipBg: "bg-blue-100 dark:bg-blue-950",
    chipText: "text-blue-700 dark:text-blue-300",
  },
  parked: {
    gradient: "from-slate-500/15 via-slate-500/5 to-transparent",
    border: "border-slate-500/40",
    iconBg: "bg-slate-100 dark:bg-slate-900/70",
    iconColor: "text-slate-600 dark:text-slate-300",
    label: "Parked",
    barColor: "#64748b",
    chipBg: "bg-slate-100 dark:bg-slate-900",
    chipText: "text-slate-700 dark:text-slate-300",
  },
  "yard-move": {
    gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
    border: "border-violet-500/40",
    iconBg: "bg-violet-100 dark:bg-violet-950/70",
    iconColor: "text-violet-600 dark:text-violet-400",
    label: "Yard Move",
    barColor: "#8b5cf6",
    chipBg: "bg-violet-100 dark:bg-violet-950",
    chipText: "text-violet-700 dark:text-violet-300",
  },
  "awaiting-dock": {
    gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    border: "border-amber-500/40",
    iconBg: "bg-amber-100 dark:bg-amber-950/70",
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "Awaiting Dock",
    barColor: "#f59e0b",
    chipBg: "bg-amber-100 dark:bg-amber-950",
    chipText: "text-amber-700 dark:text-amber-300",
  },
  "dock-assigned": {
    gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
    border: "border-blue-500/40",
    iconBg: "bg-blue-100 dark:bg-blue-950/70",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "Dock Assigned",
    barColor: "#3b82f6",
    chipBg: "bg-blue-100 dark:bg-blue-950",
    chipText: "text-blue-700 dark:text-blue-300",
  },
  "gate-out": {
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/70",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "Gate-Out",
    barColor: "#10b981",
    chipBg: "bg-emerald-100 dark:bg-emerald-950",
    chipText: "text-emerald-700 dark:text-emerald-300",
  },
  detention: {
    gradient: "from-red-500/15 via-red-500/5 to-transparent",
    border: "border-red-500/40",
    iconBg: "bg-red-100 dark:bg-red-950/70",
    iconColor: "text-red-600 dark:text-red-400",
    label: "Detention Risk",
    barColor: "#ef4444",
    chipBg: "bg-red-100 dark:bg-red-950",
    chipText: "text-red-700 dark:text-red-300",
  },
}

const zoneInfo: Record<YardZone, { label: string; color: string; bg: string; icon: typeof Truck; pieColor: string; description: string }> = {
  "trailer-park": { label: "Trailer Park", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", icon: Truck, pieColor: "#3b82f6", description: "General trailer & container parking zone" },
  "cold-storage": { label: "Cold Storage Yard", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-100 dark:bg-cyan-950", icon: Snowflake, pieColor: "#06b6d4", description: "Reefer trailers with active cooling" },
  "bonded": { label: "Bonded Area", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", icon: ShieldAlert, pieColor: "#8b5cf6", description: "Customs-bonded import containers" },
  "hazmat": { label: "Hazmat Zone", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", icon: Flame, pieColor: "#ef4444", description: "Hazardous materials — segregated zone" },
  "empty-return": { label: "Empty Returns", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-900", icon: Container, pieColor: "#64748b", description: "Empty trailers awaiting return dispatch" },
  "inspection-bay": { label: "Inspection Bay", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950", icon: Cog, pieColor: "#f59e0b", description: "Pre-dock inspection & quarantine area" },
}

const vehicleTypeInfo: Record<VehicleType, { label: string; icon: typeof Truck; color: string }> = {
  tractor: { label: "Tractor Only", icon: Truck, color: "text-slate-600 dark:text-slate-300" },
  trailer: { label: "Trailer", icon: Container, color: "text-blue-600 dark:text-blue-300" },
  "container-20ft": { label: "20ft Container", icon: Container, color: "text-emerald-600 dark:text-emerald-300" },
  "container-40ft": { label: "40ft Container", icon: Container, color: "text-violet-600 dark:text-violet-300" },
  reefer: { label: "Reefer", icon: Snowflake, color: "text-cyan-600 dark:text-cyan-300" },
}

const priorityTheme = {
  high: { label: "HIGH", bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-300", ring: "ring-red-500/30" },
  normal: { label: "NORMAL", bg: "bg-slate-100 dark:bg-slate-900", text: "text-slate-700 dark:text-slate-300", ring: "ring-slate-500/30" },
  low: { label: "LOW", bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-500/30" },
} as const

// ---------------------------------------------------------------------------
// Deterministic helpers
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

const MIN = 60_000
const DAY = 86_400_000

// ---------------------------------------------------------------------------
// Mock data generators
// ---------------------------------------------------------------------------

interface TimelineEvent {
  id: string
  timestamp: string
  kind: "pre-arrival" | "gate-in" | "parked" | "yard-move" | "dock-assign" | "dock-in" | "dock-out" | "gate-out" | "detention-start"
  title: string
  detail: string
  actor: string
  completed: boolean
}

function getTimeline(v: YardVehicleDetail): TimelineEvent[] {
  const seed = hashStr(v.id + v.regNumber)
  const arrivedAt = Date.now() - v.waitMinutes * MIN
  const events: TimelineEvent[] = []

  if (v.status === "arriving") {
    events.push({
      id: "e1",
      timestamp: new Date(Date.now() + 15 * MIN).toISOString(),
      kind: "pre-arrival",
      title: "ETA at Gate",
      detail: `Vehicle ${v.regNumber} expected at ${v.warehouse} main gate in ~15 min.`,
      actor: "Yard Scheduler",
      completed: false,
    })
    return events
  }

  events.push({
    id: "e1",
    timestamp: new Date(arrivedAt).toISOString(),
    kind: "gate-in",
    title: "Gate-In",
    detail: `Vehicle entered through main gate. BOE: BOE${seed % 90000 + 10000}. Driver license verified.`,
    actor: "Gate Security",
    completed: true,
  })

  if (v.waitMinutes > 5 || ["parked", "yard-move", "awaiting-dock", "dock-assigned", "gate-out", "detention"].includes(v.status)) {
    events.push({
      id: "e2",
      timestamp: new Date(arrivedAt + 5 * MIN).toISOString(),
      kind: "parked",
      title: `Parked at Slot ${v.slot}`,
      detail: `Yard marshal assigned slot ${v.slot} in ${zoneInfo[v.zone].label}. RTLS tag attached.`,
      actor: "Yard Marshal",
      completed: true,
    })
  }

  if (v.status === "yard-move" || v.waitMinutes > 30) {
    events.push({
      id: "e3",
      timestamp: new Date(arrivedAt + Math.min(v.waitMinutes - 5, 25) * MIN).toISOString(),
      kind: "yard-move",
      title: "Yard Move",
      detail: `Repositioned from staging to ${v.slot} for dock access optimization.`,
      actor: "Yard Marshal",
      completed: v.status !== "yard-move",
    })
  }

  if (v.detentionMinutes > 0) {
    events.push({
      id: "e4",
      timestamp: new Date(arrivedAt + Math.max(60, v.waitMinutes - v.detentionMinutes) * MIN).toISOString(),
      kind: "detention-start",
      title: "Detention Risk Triggered",
      detail: `Vehicle exceeds ${v.detentionMinutes > 60 ? "60" : "30"}min free wait time. Demurrage charges may apply.`,
      actor: "Yard Mgmt System",
      completed: true,
    })
  }

  if (v.dockAssignment) {
    events.push({
      id: "e5",
      timestamp: new Date(arrivedAt + Math.max(20, v.waitMinutes - 15) * MIN).toISOString(),
      kind: "dock-assign",
      title: `Dock ${v.dockAssignment} Assigned`,
      detail: `Vehicle assigned to dock ${v.dockAssignment}. Move authorized. Driver notified via SMS.`,
      actor: "Dock Scheduler",
      completed: v.status === "dock-assigned" || v.status === "gate-out",
    })
  }

  if (v.status === "gate-out") {
    events.push({
      id: "e6",
      timestamp: new Date(arrivedAt + v.waitMinutes * MIN).toISOString(),
      kind: "gate-out",
      title: "Gate-Out",
      detail: `Vehicle released from yard. Exit time logged. Total yard dwell: ${v.waitMinutes} min.`,
      actor: "Gate Security",
      completed: true,
    })
  }

  return events
}

interface InspectionItem {
  id: string
  label: string
  status: "pass" | "fail" | "pending"
  detail?: string
}

function getInspection(v: YardVehicleDetail): InspectionItem[] {
  const seed = hashStr(v.id)
  const items: InspectionItem[] = [
    { id: "i1", label: "Vehicle Registration Verified", status: "pass" },
    { id: "i2", label: "Driver License & ID", status: "pass" },
    { id: "i3", label: "Cargo Manifest Matched", status: (seed & 1) === 1 ? "pass" : "pending", detail: "Manifest # verified against PO" },
    { id: "i4", label: "Seal Integrity Check", status: (seed & 2) === 2 ? "pass" : "fail", detail: (seed & 2) === 2 ? "Seal #4521 intact" : "Seal broken — physical inspection required" },
    { id: "i5", label: "BoE / Customs Clearance", status: v.zone === "bonded" ? "pending" : "pass", detail: v.zone === "bonded" ? "Awaiting customs officer sign-off" : "Not applicable" },
    { id: "i6", label: "Hazmat Placard Check", status: v.zone === "hazmat" ? "pass" : "pass", detail: v.zone === "hazmat" ? "Class 8 placard affixed correctly" : "Not applicable" },
    { id: "i7", label: "Reefer Temperature Log", status: v.type === "reefer" ? "pass" : "pass", detail: v.type === "reefer" ? `Set: ${-25 + (seed % 5)}°C · Actual: ${-25 + (seed % 5)}°C` : "Not applicable" },
    { id: "i8", label: "Weight Distribution OK", status: (seed & 4) === 4 ? "pass" : "pending" },
  ]
  return items
}

interface CargoItem {
  id: string
  sku: string
  description: string
  qty: number
  weight: string
  value: number
}

function getCargo(v: YardVehicleDetail): CargoItem[] {
  const seed = hashStr(v.id + v.shipmentRef)
  const categories = [
    { sku: "BRK-PAD-4521", desc: "Brake Pad Set — Front", baseValue: 1600 },
    { sku: "ENG-CYL-2231", desc: "Engine Cylinder Block", baseValue: 43000 },
    { sku: "SNS-PROX-1180", desc: "Proximity Sensor 12mm", baseValue: 300 },
    { sku: "WIR-HAR-5520", desc: "Wiring Harness 2.4m", baseValue: 600 },
    { sku: "FRG-CRANK-7791", desc: "Forged Crankshaft", baseValue: 31000 },
    { sku: "OIL-FILT-3301", desc: "Oil Filter Spin-on", baseValue: 150 },
    { sku: "LMP-HEAD-9920", desc: "LED Headlamp Assembly", baseValue: 5600 },
    { sku: "ECU-ENG-4400", desc: "Engine Control Unit", baseValue: 62000 },
  ]
  const count = 3 + (seed % 3)
  const items: CargoItem[] = []
  for (let i = 0; i < count; i++) {
    const c = categories[(seed + i * 3) % categories.length]
    const qty = 4 + ((seed >> (i % 8)) & 0x1f)
    items.push({
      id: `c${i + 1}`,
      sku: c.sku,
      description: c.desc,
      qty,
      weight: `${(qty * 0.4 + (seed % 3)).toFixed(1)} kg`,
      value: qty * c.baseValue,
    })
  }
  return items
}

interface TelemetryPoint {
  t: string
  speed: number
  fuel: number
  temp?: number
}

function getTelemetry(v: YardVehicleDetail): TelemetryPoint[] {
  const seed = hashStr(v.id)
  const points: TelemetryPoint[] = []
  const isReefer = v.type === "reefer"
  for (let i = 11; i >= 0; i--) {
    const t = new Date(Date.now() - i * 5 * MIN)
    const moving = v.status === "yard-move"
    points.push({
      t: t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      speed: moving ? 8 + (seed % 6) : 0,
      fuel: Math.max(20, 80 - i * 2 - (seed % 5)),
      temp: isReefer ? -25 + ((seed >> i) & 0x3) : undefined,
    })
  }
  return points
}

interface CommsLog {
  id: string
  time: string
  from: "driver" | "yard" | "system"
  author: string
  message: string
}

function getComms(v: YardVehicleDetail): CommsLog[] {
  const seed = hashStr(v.id)
  const startedAt = Date.now() - v.waitMinutes * MIN
  return [
    {
      id: "m1",
      time: new Date(startedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      from: "driver",
      author: v.driver,
      message: "Reached main gate. Where should I park?",
    },
    {
      id: "m2",
      time: new Date(startedAt + 2 * MIN).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      from: "yard",
      author: "Yard Marshal (Ramesh)",
      message: `Welcome. Please proceed to slot ${v.slot} in ${zoneInfo[v.zone].label}. RTLS tag will be attached on arrival.`,
    },
    {
      id: "m3",
      time: new Date(startedAt + 6 * MIN).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      from: "system",
      author: "AutoFlow YMS",
      message: `Slot ${v.slot} occupied. RTLS tag T-${seed % 9000 + 1000} active. Inspection queued.`,
    },
    {
      id: "m4",
      time: new Date(startedAt + Math.max(20, v.waitMinutes - 10) * MIN).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      from: "yard",
      author: "Dock Scheduler",
      message: v.dockAssignment
        ? `Dock ${v.dockAssignment} assigned. Move authorized when ready.`
        : "Awaiting dock availability. Will notify on assignment.",
    },
  ]
}

// ---------------------------------------------------------------------------
// Chart configs
// ---------------------------------------------------------------------------

const telemetryChartConfig = {
  speed: { label: "Speed (km/h)", color: "#3b82f6" },
  fuel: { label: "Fuel (%)", color: "#10b981" },
  temp: { label: "Temp (°C)", color: "#06b6d4" },
} satisfies ChartConfig

const cargoChartConfig = {
  value: { label: "Value (₹)", color: "#8b5cf6" },
} satisfies ChartConfig

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function YardDetailDrawer({ open, onOpenChange, vehicle }: YardDetailDrawerProps) {
  const toast = useToast()
  const [selectedTab, setSelectedTab] = React.useState<"overview" | "cargo" | "inspection" | "telemetry" | "comms" | "timeline">("overview")

  React.useEffect(() => {
    if (open) setSelectedTab("overview")
  }, [open, vehicle?.id])

  if (!vehicle) return null

  const theme = statusTheme[vehicle.status]
  const zone = zoneInfo[vehicle.zone]
  const vtype = vehicleTypeInfo[vehicle.type]
  const priority = priorityTheme[vehicle.priority]
  const ZoneIcon = zone.icon
  const VTypeIcon = vtype.icon
  const StatusIcon =
    vehicle.status === "arriving" ? Navigation :
    vehicle.status === "gate-in" ? LogIn :
    vehicle.status === "parked" ? ParkingCircle :
    vehicle.status === "yard-move" ? ArrowRight :
    vehicle.status === "awaiting-dock" ? Clock :
    vehicle.status === "dock-assigned" ? Truck :
    vehicle.status === "gate-out" ? LogOut :
    AlertTriangle

  const timeline = getTimeline(vehicle)
  const inspection = getInspection(vehicle)
  const cargo = getCargo(vehicle)
  const telemetry = getTelemetry(vehicle)
  const comms = getComms(vehicle)
  const totalCargoValue = cargo.reduce((s, c) => s + c.value, 0)
  const passCount = inspection.filter((i) => i.status === "pass").length
  const failCount = inspection.filter((i) => i.status === "fail").length
  const pendingCount = inspection.filter((i) => i.status === "pending").length

  const initials = vehicle.driver.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  const handleExport = () => {
    const rows = [{
      regNumber: vehicle.regNumber,
      type: vtype.label,
      driver: vehicle.driver,
      carrier: vehicle.carrier,
      zone: zone.label,
      slot: vehicle.slot,
      status: theme.label,
      waitMinutes: vehicle.waitMinutes,
      detentionMinutes: vehicle.detentionMinutes,
      dock: vehicle.dockAssignment ?? "—",
      warehouse: vehicle.warehouse,
      shipment: vehicle.shipmentRef,
      arrival: vehicle.arrivalTime,
      priority: vehicle.priority,
      cargoItems: cargo.length,
      cargoValue: totalCargoValue,
    }]
    exportToCSV(rows, `yard-vehicle-${vehicle.regNumber}`)
    toast.success("Export complete", `${vehicle.regNumber} detail exported to CSV.`)
  }

  const handleAssignDock = () => {
    const dock = `IN-${Math.floor(Math.random() * 9) + 1}`
    toast.success("Dock assigned", `${vehicle.regNumber} → ${dock}. Move authorized.`)
  }

  const handleYardMove = () => {
    const slot = `A-${Math.floor(Math.random() * 30) + 1}`
    toast.info("Yard move", `${vehicle.regNumber} → slot ${slot}. Driver notified.`)
  }

  const handleGateOut = () => {
    toast.success("Gate-out", `${vehicle.regNumber} released. Boom barrier opened.`)
  }

  const handleCallDriver = () => {
    toast.info("Calling driver", `Dialing ${vehicle.driver}...`)
  }

  const handlePrintPass = () => {
    toast.info("Printing gate pass", `Generating gate pass for ${vehicle.regNumber}.`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header strip */}
        <SheetHeader className={cn(
          "relative px-5 py-4 border-b yard-drawer-header",
          "bg-gradient-to-b",
          theme.gradient,
          theme.border
        )}>
          <div className="absolute inset-0 yard-drawer-sheen pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <div className={cn("rounded-xl p-2.5 border yard-icon-pulse", theme.border, theme.iconBg, theme.iconColor)}>
              <Truck className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <SheetTitle className="text-base font-semibold flex items-center gap-2">
                <span className="font-mono">{vehicle.regNumber}</span>
                <Badge variant="outline" className={cn("text-[10px] rounded-full", theme.chipText, theme.border)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {theme.label}
                </Badge>
                <Badge variant="outline" className={cn("text-[9px] rounded-full ring-1", priority.bg, priority.text, priority.ring)}>
                  {priority.label}
                </Badge>
              </SheetTitle>
              <SheetDescription className="text-xs flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-0.5">
                  <VTypeIcon className={cn("h-3 w-3", vtype.color)} /> {vtype.label}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-0.5">
                  <User className="h-3 w-3" /> {vehicle.driver}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-0.5">
                  <Building2 className="h-3 w-3" /> {vehicle.warehouse}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="font-mono">{vehicle.shipmentRef}</span>
              </SheetDescription>
            </div>
          </div>

          {/* Hero stat grid */}
          <div className="relative mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 yard-stat-enter">
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", theme.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Wait Time
              </p>
              <p className={cn("text-sm font-bold text-number", vehicle.waitMinutes > 90 ? "text-red-600 dark:text-red-400" : vehicle.waitMinutes > 60 ? "text-amber-600 dark:text-amber-400" : "")}>
                {vehicle.waitMinutes}min
              </p>
              <p className="text-[9px] text-muted-foreground">{vehicle.arrivalTime}</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", theme.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Detention
              </p>
              <p className={cn("text-sm font-bold text-number", vehicle.detentionMinutes > 60 ? "text-red-600 dark:text-red-400" : vehicle.detentionMinutes > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                {vehicle.detentionMinutes}min
              </p>
              <p className="text-[9px] text-muted-foreground">
                {vehicle.detentionMinutes > 60 ? "Demurrage risk" : vehicle.detentionMinutes > 0 ? "Watch" : "Clear"}
              </p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", theme.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <ZoneIcon className="h-3 w-3" /> Zone / Slot
              </p>
              <p className="text-sm font-bold text-number">{vehicle.slot}</p>
              <p className="text-[9px] text-muted-foreground truncate">{zone.label}</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", theme.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Truck className="h-3 w-3" /> Dock
              </p>
              <p className="text-sm font-bold text-number">{vehicle.dockAssignment ?? "—"}</p>
              <p className="text-[9px] text-muted-foreground">
                {vehicle.dockAssignment ? "Assigned" : "Awaiting"}
              </p>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="relative mt-3 flex gap-1 rounded-lg bg-muted/60 p-0.5 overflow-x-auto">
            {([
              { id: "overview", label: "Overview" },
              { id: "cargo", label: `Cargo (${cargo.length})` },
              { id: "inspection", label: `Inspect (${passCount}/${inspection.length})` },
              { id: "telemetry", label: "Telemetry" },
              { id: "comms", label: `Comms (${comms.length})` },
              { id: "timeline", label: `Timeline (${timeline.length})` },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTab(t.id)}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium transition-all yard-tab-switch",
                  selectedTab === t.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="p-4 space-y-3 yard-body-enter min-h-[400px]">
          {/* ── OVERVIEW TAB ─────────────────────────────────────────── */}
          {selectedTab === "overview" && (
            <>
              {/* Vehicle & driver info */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border bg-card p-3 yard-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Truck className="h-3 w-3" /> Vehicle
                  </p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Reg Number</p>
                      <p className="font-mono font-medium">{vehicle.regNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Type</p>
                      <p className="font-medium flex items-center gap-1">
                        <VTypeIcon className={cn("h-3 w-3", vtype.color)} /> {vtype.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Carrier</p>
                      <p className="font-medium">{vehicle.carrier}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Arrival</p>
                      <p className="font-medium text-number">{vehicle.arrivalTime}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-3 yard-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <User className="h-3 w-3" /> Driver
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{vehicle.driver}</p>
                      <p className="text-[10px] text-muted-foreground">{vehicle.carrier} · DL verified</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 w-full text-[10px] gap-1" onClick={handleCallDriver}>
                    <Phone className="h-3 w-3" /> Call Driver
                  </Button>
                </div>
              </div>

              {/* Zone & dock assignment */}
              <div className={cn("rounded-xl border p-3 yard-card-enter", zone.bg, zone.color)}>
                <div className="flex items-start gap-2">
                  <div className={cn("rounded-lg p-1.5 bg-background/60", zone.color)}>
                    <ZoneIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">Current Zone: {zone.label}</p>
                    <p className="text-[11px] mt-0.5 opacity-90">{zone.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px]">
                      <span className="bg-background/60 rounded px-1.5 py-0.5 font-mono">Slot {vehicle.slot}</span>
                      {vehicle.dockAssignment && (
                        <>
                          <ChevronRight className="h-3 w-3 opacity-50" />
                          <span className="bg-background/60 rounded px-1.5 py-0.5 font-mono">Dock {vehicle.dockAssignment}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cargo summary */}
              <div className="rounded-xl border bg-card p-3 yard-card-enter">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Box className="h-3 w-3" /> Cargo Summary
                  </p>
                  <Badge variant="outline" className="text-[9px]">{cargo.length} SKUs</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Total Units</p>
                    <p className="font-bold text-number">{cargo.reduce((s, c) => s + c.qty, 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Total Weight</p>
                    <p className="font-bold text-number">{cargo.reduce((s, c) => s + parseFloat(c.weight), 0).toFixed(1)} kg</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Declared Value</p>
                    <p className="font-bold text-number">₹{totalCargoValue.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <Separator className="my-2" />
                <p className="text-[10px] text-muted-foreground">
                  Manifest ref: <span className="font-mono">MNF-{vehicle.shipmentRef.split("-").pop()}</span>
                </p>
              </div>

              {/* KPI mini grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border bg-card p-2 yard-card-enter text-center">
                  <Gauge className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                  <p className="text-[10px] text-muted-foreground">Yard Dwell</p>
                  <p className="text-sm font-bold text-number">{vehicle.waitMinutes}m</p>
                </div>
                <div className="rounded-xl border bg-card p-2 yard-card-enter text-center">
                  <Activity className="h-4 w-4 mx-auto text-violet-500 mb-1" />
                  <p className="text-[10px] text-muted-foreground">Inspection</p>
                  <p className="text-sm font-bold text-number">{passCount}/{inspection.length}</p>
                </div>
                <div className="rounded-xl border bg-card p-2 yard-card-enter text-center">
                  <Timer className="h-4 w-4 mx-auto text-amber-500 mb-1" />
                  <p className="text-[10px] text-muted-foreground">Demurrage</p>
                  <p className={cn("text-sm font-bold text-number", vehicle.detentionMinutes > 60 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                    {vehicle.detentionMinutes > 60 ? "AT RISK" : "OK"}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── CARGO TAB ────────────────────────────────────────────── */}
          {selectedTab === "cargo" && (
            <>
              <div className="rounded-xl border bg-card p-3 yard-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Box className="h-3 w-3" /> Cargo Manifest ({cargo.length} SKUs)
                </p>
                <div className="space-y-1.5">
                  {cargo.map((c) => (
                    <div key={c.id} className="flex items-start justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors yard-row-in">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="rounded-md bg-primary/10 p-1.5 shrink-0">
                          <Box className="h-3 w-3 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-mono font-medium">{c.sku}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{c.description}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-0.5"><Weight className="h-2.5 w-2.5" /> {c.weight}</span>
                            <span className="flex items-center gap-0.5"><Ruler className="h-2.5 w-2.5" /> Std pallet</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-xs font-medium text-number">×{c.qty}</p>
                        <p className="text-[10px] text-muted-foreground text-number">₹{c.value.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cargo value by SKU bar */}
              <div className="rounded-xl border bg-card p-3 yard-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Cargo Value by SKU (₹)
                </p>
                <ChartContainer config={cargoChartConfig} className="aspect-[16/6] w-full">
                  <BarChart data={cargo.map((c) => ({ name: c.sku.split("-")[0], value: c.value, qty: c.qty }))} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={40} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#8b5cf6" />
                  </BarChart>
                </ChartContainer>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Total declared value</span>
                  <span className="font-bold text-number">₹{totalCargoValue.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </>
          )}

          {/* ── INSPECTION TAB ───────────────────────────────────────── */}
          {selectedTab === "inspection" && (
            <>
              <div className="rounded-xl border bg-card p-3 yard-card-enter">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Gate-In Inspection Checklist
                  </p>
                  <div className="flex gap-1">
                    <Badge className="text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{passCount} pass</Badge>
                    {failCount > 0 && <Badge className="text-[9px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">{failCount} fail</Badge>}
                    {pendingCount > 0 && <Badge className="text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">{pendingCount} pending</Badge>}
                  </div>
                </div>
                <div className="space-y-1">
                  {inspection.map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-2 rounded-md hover:bg-muted/40 transition-colors">
                      <div className="flex items-start gap-2 min-w-0">
                        {item.status === "pass" && <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />}
                        {item.status === "fail" && <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />}
                        {item.status === "pending" && <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />}
                        <div className="min-w-0">
                          <p className="text-xs">{item.label}</p>
                          {item.detail && <p className="text-[10px] text-muted-foreground">{item.detail}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Overall status</span>
                  <span className={cn(
                    "font-medium",
                    failCount > 0 ? "text-red-600 dark:text-red-400" : pendingCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                  )}>
                    {failCount > 0 ? "FAILED — manual review" : pendingCount > 0 ? "IN PROGRESS" : "PASSED"}
                  </span>
                </div>
              </div>

              {/* Photo evidence */}
              <div className="rounded-xl border bg-card p-3 yard-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Camera className="h-3 w-3" /> Gate-In Photos (6)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {["Vehicle Front", "Vehicle Rear", "Cargo Door", "Seal Close-up", "Driver ID", "Reg Plate"].map((label, i) => (
                    <div key={i} className="group relative aspect-video rounded-lg bg-muted/60 border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors cursor-pointer yard-photo-pop">
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
                        <ImageIcon className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary/60 transition-colors" />
                        <span className="text-[9px] text-center text-muted-foreground/80">{label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspector */}
              <div className="rounded-xl border bg-card p-3 yard-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Inspector
                </p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">QA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium">Ramesh Kumar</p>
                    <p className="text-[10px] text-muted-foreground">Gate Inspector · {vehicle.warehouse}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── TELEMETRY TAB ────────────────────────────────────────── */}
          {selectedTab === "telemetry" && (
            <>
              <div className="rounded-xl border bg-card p-3 yard-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Real-Time Telemetry (last 60 min)
                </p>
                <ChartContainer config={telemetryChartConfig} className="aspect-[16/6] w-full">
                  <AreaChart data={telemetry} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="yardSpeedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="yardFuelGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                    <XAxis dataKey="t" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={2} />
                    <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area dataKey="speed" type="monotone" stroke="#3b82f6" strokeWidth={1.5} fill="url(#yardSpeedGrad)" />
                    <Area dataKey="fuel" type="monotone" stroke="#10b981" strokeWidth={1.5} fill="url(#yardFuelGrad)" />
                  </AreaChart>
                </ChartContainer>
              </div>

              {/* Telemetry gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded-xl border bg-card p-3 yard-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Fuel className="h-3 w-3 text-emerald-500" /> Fuel
                  </p>
                  <p className="text-lg font-bold text-number">{telemetry[telemetry.length - 1]?.fuel}%</p>
                  <Progress value={telemetry[telemetry.length - 1]?.fuel ?? 0} className="h-1" />
                </div>
                <div className="rounded-xl border bg-card p-3 yard-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-blue-500" /> Speed
                  </p>
                  <p className="text-lg font-bold text-number">{telemetry[telemetry.length - 1]?.speed ?? 0}<span className="text-[10px] font-normal text-muted-foreground"> km/h</span></p>
                  <p className="text-[10px] text-muted-foreground">{(telemetry[telemetry.length - 1]?.speed ?? 0) > 0 ? "Moving" : "Stopped"}</p>
                </div>
                {vehicle.type === "reefer" && (
                  <div className="rounded-xl border bg-card p-3 yard-card-enter">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                      <Thermometer className="h-3 w-3 text-cyan-500" /> Reefer Temp
                    </p>
                    <p className="text-lg font-bold text-number">{telemetry[telemetry.length - 1]?.temp ?? -25}°C</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Within range</p>
                  </div>
                )}
                <div className="rounded-xl border bg-card p-3 yard-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Radio className="h-3 w-3 text-violet-500" /> RTLS Tag
                  </p>
                  <p className="text-sm font-bold text-number font-mono">T-{hashStr(vehicle.id) % 9000 + 1000}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Active
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-3 yard-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Battery className="h-3 w-3 text-amber-500" /> Battery
                  </p>
                  <p className="text-lg font-bold text-number">{85 + (hashStr(vehicle.id) % 10)}%</p>
                  <Progress value={85 + (hashStr(vehicle.id) % 10)} className="h-1" />
                </div>
              </div>

              {/* Reefer temp history if applicable */}
              {vehicle.type === "reefer" && (
                <div className="rounded-xl border bg-card p-3 yard-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Snowflake className="h-3 w-3 text-cyan-500" /> Reefer Temperature Log
                  </p>
                  <ChartContainer config={telemetryChartConfig} className="aspect-[16/5] w-full">
                    <AreaChart data={telemetry} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                      <XAxis dataKey="t" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={2} />
                      <YAxis domain={[-30, -20]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area dataKey="temp" type="monotone" stroke="#06b6d4" strokeWidth={1.5} fill="#06b6d4" fillOpacity={0.2} />
                    </AreaChart>
                  </ChartContainer>
                  <p className="text-[10px] text-muted-foreground mt-1">Set point: -25°C · Tolerance: ±2°C</p>
                </div>
              )}
            </>
          )}

          {/* ── COMMS TAB ────────────────────────────────────────────── */}
          {selectedTab === "comms" && (
            <>
              <div className="rounded-xl border bg-card p-3 yard-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Communications Log ({comms.length})
                </p>
                <div className="space-y-3">
                  {comms.map((m, i) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-2 yard-msg-in",
                        m.from === "yard" && "flex-row-reverse"
                      )}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className={cn(
                          "text-[9px]",
                          m.from === "driver" && "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
                          m.from === "yard" && "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
                          m.from === "system" && "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                        )}>
                          {m.from === "system" ? "YMS" : m.author.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "max-w-[78%] rounded-lg p-2",
                        m.from === "driver" && "bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50",
                        m.from === "yard" && "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50",
                        m.from === "system" && "bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50"
                      )}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-medium">{m.author}</span>
                          <span className="text-[9px] text-muted-foreground">{m.time}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{m.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick reply */}
              <div className="rounded-xl border bg-card p-3 yard-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Send message to driver</p>
                <div className="flex gap-2">
                  <input
                    placeholder="Type a message to driver..."
                    className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button size="sm" className="h-8 px-3 shrink-0">
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {["Proceed to dock", "Hold at slot", "Inspection done", "Documents ready"].map((q) => (
                    <button
                      key={q}
                      className="text-[10px] rounded-full border bg-muted/40 px-2 py-0.5 hover:bg-muted/60 transition-colors"
                      onClick={() => toast.info("Quick reply", `Sent: "${q}"`)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── TIMELINE TAB ─────────────────────────────────────────── */}
          {selectedTab === "timeline" && (
            <div className="rounded-xl border bg-card p-3 yard-card-enter">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1">
                <History className="h-3 w-3" /> Vehicle Yard Lifecycle
              </p>
              <ol className="relative border-l-2 border-muted ml-3 space-y-3">
                {timeline.map((e, i) => {
                  const dotColor =
                    e.kind === "gate-in" ? "bg-blue-500" :
                    e.kind === "parked" ? "bg-slate-500" :
                    e.kind === "yard-move" ? "bg-violet-500" :
                    e.kind === "dock-assign" ? "bg-amber-500" :
                    e.kind === "dock-in" ? "bg-blue-500" :
                    e.kind === "dock-out" ? "bg-cyan-500" :
                    e.kind === "gate-out" ? "bg-emerald-500" :
                    e.kind === "detention-start" ? "bg-red-500" :
                    "bg-cyan-500"
                  const EventIcon =
                    e.kind === "gate-in" ? LogIn :
                    e.kind === "parked" ? ParkingCircle :
                    e.kind === "yard-move" ? ArrowRight :
                    e.kind === "dock-assign" ? Truck :
                    e.kind === "gate-out" ? LogOut :
                    e.kind === "detention-start" ? AlertTriangle :
                    Sparkles
                  return (
                    <li
                      key={e.id}
                      className="ml-4 space-y-1 yard-timeline-in"
                      style={{ animationDelay: `${i * 70}ms` }}
                    >
                      <span className={cn(
                        "absolute -left-[9px] mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background text-white",
                        dotColor,
                        !e.completed && "opacity-50"
                      )}>
                        <EventIcon className="h-2 w-2" />
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          {e.title}
                          {!e.completed && <Clock className="h-2.5 w-2.5 text-amber-500 animate-pulse" />}
                        </p>
                        <p className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(e.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{e.detail}</p>
                      <p className="text-[10px] text-muted-foreground/70">— {e.actor}</p>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handlePrintPass}>
            <Printer className="h-3.5 w-3.5" />
            Pass
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleCallDriver}>
            <Phone className="h-3.5 w-3.5" />
            Call
          </Button>
          {vehicle.status === "awaiting-dock" && (
            <Button size="sm" className="flex-1 gap-1.5" onClick={handleAssignDock}>
              <Zap className="h-3.5 w-3.5" />
              Assign Dock
            </Button>
          )}
          {vehicle.status === "parked" && (
            <Button size="sm" className="flex-1 gap-1.5" onClick={handleYardMove}>
              <ArrowRight className="h-3.5 w-3.5" />
              Yard Move
            </Button>
          )}
          {vehicle.status === "dock-assigned" && (
            <Button size="sm" className="flex-1 gap-1.5" onClick={handleGateOut}>
              <LogOut className="h-3.5 w-3.5" />
              Release
            </Button>
          )}
          {vehicle.status === "parked" && vehicle.dockAssignment && (
            <Button size="sm" className="flex-1 gap-1.5" onClick={handleGateOut}>
              <LogOut className="h-3.5 w-3.5" />
              Gate-Out
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
