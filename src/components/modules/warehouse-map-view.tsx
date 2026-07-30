"use client"

import { useState, useMemo, useCallback } from "react"
import { warehouses } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { WarehouseMapDetailDrawer } from "@/components/shared/warehouse-map-detail-drawer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Building2,
  MapPin,
  Truck,
  Navigation,
  ArrowRight,
  Clock,
  Gauge,
  Package,
  TrendingUp,
  X,
  Activity,
  Warehouse,
  Users,
  ThermometerSun,
  AlertTriangle,
  CheckCircle2,
  Box,
  Timer,
  Eye,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────────────

interface WarehouseMapViewProps {
  onWarehouseClick?: (warehouseId: string) => void
}

type WarehouseStatus = "green" | "amber" | "red"

// ── Constants ───────────────────────────────────────────────────────────────

// Approximate geographic positions of each warehouse on the Indian map
const WAREHOUSE_POSITIONS: Record<
  string,
  { x: number; y: number; anchor: "left" | "right" | "center" }
> = {
  "WH-GUR-003": { x: 48, y: 22, anchor: "left" },   // Gurugram (near Delhi)
  "WH-KOL-004": { x: 72, y: 48, anchor: "right" },  // Kolkata
  "WH-SAN-005": { x: 15, y: 44, anchor: "left" },   // Sanand (Gujarat)
  "WH-PUN-002": { x: 20, y: 64, anchor: "left" },   // Pune
  "WH-HOS-006": { x: 42, y: 82, anchor: "center" }, // Hosur
  "WH-CHN-001": { x: 56, y: 80, anchor: "left" },   // Chennai
}

// Region clusters
const REGION_LABELS = [
  { label: "NORTH", x: 50, y: 12, color: "text-blue-400/60" },
  { label: "WEST", x: 10, y: 52, color: "text-purple-400/60" },
  { label: "EAST", x: 78, y: 40, color: "text-amber-400/60" },
  { label: "SOUTH", x: 48, y: 92, color: "text-emerald-400/60" },
]

// Connection lines between warehouses for logistics routes
const ROUTE_CONNECTIONS: Array<{
  from: string
  to: string
  distance: string
  time: string
  status: "active" | "delayed" | "planned"
  vehicles: number
}> = [
  { from: "WH-GUR-003", to: "WH-SAN-005", distance: "912 km", time: "14h 30m", status: "active", vehicles: 4 },
  { from: "WH-GUR-003", to: "WH-KOL-004", distance: "1,462 km", time: "22h 15m", status: "active", vehicles: 3 },
  { from: "WH-SAN-005", to: "WH-PUN-002", distance: "524 km", time: "8h 45m", status: "active", vehicles: 5 },
  { from: "WH-PUN-002", to: "WH-HOS-006", distance: "845 km", time: "13h 20m", status: "delayed", vehicles: 2 },
  { from: "WH-HOS-006", to: "WH-CHN-001", distance: "247 km", time: "4h 10m", status: "active", vehicles: 6 },
  { from: "WH-CHN-001", to: "WH-KOL-004", distance: "1,668 km", time: "26h 00m", status: "planned", vehicles: 0 },
  { from: "WH-GUR-003", to: "WH-PUN-002", distance: "1,418 km", time: "21h 30m", status: "active", vehicles: 3 },
]

const ACTIVE_ROUTES = [
  { id: "RT-4001", from: "Gurugram Hub", to: "Sanand Facility", distance: "912 km", estTime: "14h 30m", status: "In Transit" as const, progress: 72 },
  { id: "RT-4002", from: "Sanand Facility", to: "Pune Warehouse", distance: "524 km", estTime: "8h 45m", status: "In Transit" as const, progress: 45 },
  { id: "RT-4003", from: "Pune Warehouse", to: "Hosur Support", distance: "845 km", estTime: "13h 20m", status: "Delayed" as const, progress: 31 },
  { id: "RT-4004", from: "Chennai Hub", to: "Kolkata Depot", distance: "1,668 km", estTime: "26h 00m", status: "Planned" as const, progress: 0 },
  { id: "RT-4005", from: "Gurugram Hub", to: "Kolkata Depot", distance: "1,462 km", estTime: "22h 15m", status: "In Transit" as const, progress: 58 },
  { id: "RT-4006", from: "Gurugram Hub", to: "Pune Warehouse", distance: "1,418 km", estTime: "21h 30m", status: "In Transit" as const, progress: 88 },
  { id: "RT-4007", from: "Hosur Support", to: "Chennai Hub", distance: "247 km", estTime: "4h 10m", status: "In Transit" as const, progress: 95 },
]

// Warehouse detailed metrics
const WAREHOUSE_DETAILS: Record<string, {
  zones: number
  docks: number
  equipment: number
  staff: number
  tempZones: number
  avgProcessingTime: string
  pendingOrders: number
  slaCompliance: number
}> = {
  "WH-GUR-003": { zones: 48, docks: 12, equipment: 18, staff: 245, tempZones: 4, avgProcessingTime: "2.4h", pendingOrders: 38, slaCompliance: 96.2 },
  "WH-CHN-001": { zones: 36, docks: 8, equipment: 14, staff: 180, tempZones: 3, avgProcessingTime: "2.1h", pendingOrders: 24, slaCompliance: 97.8 },
  "WH-PUN-002": { zones: 30, docks: 6, equipment: 10, staff: 145, tempZones: 2, avgProcessingTime: "2.8h", pendingOrders: 19, slaCompliance: 94.5 },
  "WH-KOL-004": { zones: 28, docks: 6, equipment: 9, staff: 130, tempZones: 2, avgProcessingTime: "3.1h", pendingOrders: 42, slaCompliance: 91.8 },
  "WH-SAN-005": { zones: 24, docks: 5, equipment: 8, staff: 110, tempZones: 1, avgProcessingTime: "2.6h", pendingOrders: 15, slaCompliance: 95.4 },
  "WH-HOS-006": { zones: 20, docks: 4, equipment: 7, staff: 95, tempZones: 1, avgProcessingTime: "2.2h", pendingOrders: 11, slaCompliance: 98.1 },
}

// Status mapping
const statusBgClass: Record<string, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
}

const statusBadgeClass: Record<string, string> = {
  green: "text-emerald-700 dark:text-emerald-300",
  amber: "text-amber-700 dark:text-amber-300",
  red: "text-red-700 dark:text-red-300",
}

const routeStatusClass: Record<string, string> = {
  "In Transit": "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Delayed: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
  Planned: "bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400 border-gray-200 dark:border-gray-700",
}

const routeStatusBadge: Record<string, string> = {
  "In Transit": "info",
  Delayed: "critical",
  Planned: "warning",
}

// ── India SVG outline path (simplified) ────────────────────────────────────

// Simplified India outline SVG path
const INDIA_OUTLINE_PATH = "M38,8 L42,6 L48,5 L52,7 L56,5 L60,7 L64,8 L68,10 L72,12 L76,15 L78,18 L80,22 L78,25 L76,28 L74,30 L72,33 L74,36 L72,40 L68,44 L65,48 L62,52 L58,55 L55,58 L52,62 L50,65 L48,68 L50,72 L48,76 L46,80 L44,84 L42,88 L40,90 L38,92 L36,90 L34,86 L32,82 L30,78 L28,74 L26,70 L24,66 L22,62 L20,58 L18,54 L16,50 L18,46 L20,42 L22,38 L24,34 L26,30 L28,26 L30,22 L32,18 L34,14 L36,10 Z"

// ── Animated Route Line Component ──────────────────────────────────────────

function AnimatedRouteLine({ route, idx }: { route: typeof ROUTE_CONNECTIONS[number]; idx: number }) {
  const c1x = WAREHOUSE_POSITIONS[route.from]?.x
  const c1y = WAREHOUSE_POSITIONS[route.from]?.y
  const c2x = WAREHOUSE_POSITIONS[route.to]?.x
  const c2y = WAREHOUSE_POSITIONS[route.to]?.y
  if (c1x == null || c1y == null || c2x == null || c2y == null) return null

  const midX = (c1x + c2x) / 2
  const midY = (c1y + c2y) / 2

  // Add a slight curve control point for visual appeal
  const perpX = -(c2y - c1y) * 0.12
  const perpY = (c2x - c1x) * 0.12
  const ctrlX = midX + perpX
  const ctrlY = midY + perpY

  const strokeColor =
    route.status === "active"
      ? "oklch(0.6 0.15 250 / 0.35)"
      : route.status === "delayed"
      ? "oklch(0.6 0.18 25 / 0.4)"
      : "oklch(0.7 0.02 260 / 0.25)"

  const pathD = `M ${c1x}% ${c1y}% Q ${ctrlX}% ${ctrlY}% ${c2x}% ${c2y}%`

  return (
    <g key={`route-${idx}`}>
      {/* Route path */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="8 5"
        className="route-line-animated"
      />
      {/* Distance label at midpoint */}
      <text
        x={`${midX + perpX * 0.4}%`}
        y={`${midY + perpY * 0.4}%`}
        className="fill-muted-foreground/60 pointer-events-none"
        fontSize="8"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {route.distance}
      </text>
      {/* Moving particle for active routes */}
      {route.status === "active" && (
        <>
          <circle r="2.5" className="route-particle-animated-1">
            <animateMotion dur="6s" repeatCount="indefinite" path={pathD} />
          </circle>
          <circle r="2" className="route-particle-animated-2">
            <animateMotion dur="6s" repeatCount="indefinite" path={pathD} begin="3s" />
          </circle>
        </>
      )}
      {/* Delayed route particle (slower, red) */}
      {route.status === "delayed" && (
        <circle r="2.5" className="route-particle-animated-delayed">
          <animateMotion dur="10s" repeatCount="indefinite" path={pathD} />
        </circle>
      )}
    </g>
  )
}

// ── Warehouse Detail Panel ──────────────────────────────────────────────────

function WarehouseDetailPanel({
  warehouse,
  onClose,
  onExpand,
}: {
  warehouse: (typeof warehouses)[number]
  onClose: () => void
  onExpand?: (w: (typeof warehouses)[number]) => void
}) {
  const details = WAREHOUSE_DETAILS[warehouse.id]
  const status = warehouse.status as WarehouseStatus

  if (!details) return null

  return (
    <Card className="absolute right-4 top-4 z-20 w-[280px] shadow-xl border-border/60 animate-slide-in-right-micro">
      <CardContent className="glass-subtle p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("shrink-0 size-2.5 rounded-full pulse-ring", statusBgClass[status])} />
            <p className="text-xs font-bold text-foreground">{warehouse.name}</p>
          </div>
          <button
            onClick={onClose}
            className="size-5 rounded flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="size-3 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="size-2.5 shrink-0" />
          <span>{warehouse.city}, {warehouse.state}</span>
        </div>

        <div className="h-px bg-border/50" />

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 gap-2">
          <MetricItem icon={<Box className="size-3" />} label="Zones" value={String(details.zones)} />
          <MetricItem icon={<Truck className="size-3" />} label="Docks" value={String(details.docks)} />
          <MetricItem icon={<Activity className="size-3" />} label="Equipment" value={String(details.equipment)} />
          <MetricItem icon={<Users className="size-3" />} label="Staff" value={String(details.staff)} />
          <MetricItem icon={<ThermometerSun className="size-3" />} label="Temp Zones" value={String(details.tempZones)} />
          <MetricItem icon={<Timer className="size-3" />} label="Avg Process" value={details.avgProcessingTime} />
        </div>

        <div className="h-px bg-border/50" />

        {/* Performance row */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">SLA Compliance</span>
          <span className={cn(
            "text-xs font-bold",
            details.slaCompliance >= 95 ? "text-emerald-600 dark:text-emerald-400" :
            details.slaCompliance >= 92 ? "text-amber-600 dark:text-amber-400" :
            "text-red-600 dark:text-red-400"
          )}>
            {details.slaCompliance}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Pending Orders</span>
          <span className="text-xs font-bold text-number">{details.pendingOrders}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Capacity Used</span>
          <span className={cn("text-xs font-bold text-number", statusBadgeClass[status])}>
            {warehouse.capacityUsed}%
          </span>
        </div>

        {/* Status summary */}
        <div className={cn(
          "rounded-lg p-2 text-center text-[10px] font-medium",
          status === "green" && "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
          status === "amber" && "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
          status === "red" && "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
        )}>
          <div className="flex items-center justify-center gap-1">
            {status === "green" && <CheckCircle2 className="size-3" />}
            {status === "amber" && <AlertTriangle className="size-3" />}
            {status === "red" && <AlertTriangle className="size-3" />}
            {status === "green" ? "All Systems Operational" : status === "amber" ? "Performance Warning" : "Critical Attention Required"}
          </div>
        </div>

        {/* Expand to detail drawer */}
        {onExpand && (
          <button
            onClick={() => onExpand(warehouse)}
            className="w-full text-[10px] font-medium text-primary hover:text-primary/80 flex items-center justify-center gap-1 py-1.5 rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <Eye className="size-3" />
            View Full Details
            <ChevronRight className="size-3" />
          </button>
        )}
      </CardContent>
    </Card>
  )
}

function MetricItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-2 py-1.5 flex items-center gap-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-[8px] uppercase tracking-wider text-muted-foreground leading-tight">{label}</p>
        <p className="text-xs font-bold text-number text-foreground leading-tight">{value}</p>
      </div>
    </div>
  )
}

// ── Warehouse Node Card ─────────────────────────────────────────────────────

interface WarehouseNodeProps {
  warehouse: (typeof warehouses)[number]
  position: { x: number; y: number; anchor: "left" | "right" | "center" }
  isSelected: boolean
  onClick: () => void
}

function WarehouseNode({ warehouse, position, isSelected, onClick }: WarehouseNodeProps) {
  const status = warehouse.status as WarehouseStatus

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(${
          position.anchor === "right"
            ? "-100%"
            : position.anchor === "center"
            ? "-50%"
            : "0"
        }, -50%)`,
      }}
    >
      {/* Pulsing ring behind node for emphasis */}
      <div className={cn(
        "absolute -inset-2 rounded-full opacity-30 animate-ping-slow",
        statusBgClass[status]
      )} style={{ animationDuration: "3s" }} />

      <Card
        onClick={onClick}
        className={cn(
          "card-depth hover-lift cursor-pointer py-0 gap-0 transition-all duration-300 min-w-[155px] max-w-[185px]",
          "hover-glow-blue",
          isSelected && "ring-2 ring-primary/60 shadow-lg scale-[1.03]"
        )}
      >
        <CardContent className="glass-subtle p-2.5">
          {/* Header: status dot + name */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className={cn(
                "shrink-0 size-2 rounded-full pulse-ring",
                statusBgClass[status]
              )}
            />
            <p className="text-[11px] font-bold text-foreground truncate leading-tight">
              {warehouse.name}
            </p>
          </div>

          {/* City */}
          <div className="flex items-center gap-1 mb-2 text-[9px] text-muted-foreground">
            <MapPin className="size-2 shrink-0" />
            <span className="truncate">
              {warehouse.city}, {warehouse.state}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="rounded bg-muted/50 px-1.5 py-1">
              <p className="text-[7px] uppercase tracking-wider text-muted-foreground">Occ</p>
              <p className={cn("text-[10px] font-bold text-number", statusBadgeClass[status])}>
                {warehouse.capacityUsed}%
              </p>
            </div>
            <div className="rounded bg-muted/50 px-1.5 py-1">
              <p className="text-[7px] uppercase tracking-wider text-muted-foreground">Orders</p>
              <p className="text-[10px] font-bold text-number text-foreground">
                {warehouse.todayOrders}
              </p>
            </div>
            <div className="rounded bg-muted/50 px-1.5 py-1">
              <p className="text-[7px] uppercase tracking-wider text-muted-foreground">Accuracy</p>
              <p className="text-[10px] font-bold text-number text-emerald-600 dark:text-emerald-400">
                {warehouse.inventoryAccuracy ?? warehouse.accuracy ?? 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function WarehouseMapView({ onWarehouseClick }: WarehouseMapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawerWh, setDrawerWh] = useState<(typeof warehouses)[number] | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleNodeClick = useCallback((warehouseId: string) => {
    setSelectedId((prev) => prev === warehouseId ? null : warehouseId)
    onWarehouseClick?.(warehouseId)
  }, [onWarehouseClick])

  const handleClosePanel = useCallback(() => {
    setSelectedId(null)
  }, [])

  const handleExpand = useCallback((w: (typeof warehouses)[number]) => {
    setDrawerWh(w)
    setDrawerOpen(true)
  }, [])

  const selectedWarehouse = useMemo(
    () => warehouses.find((w) => w.id === selectedId),
    [selectedId]
  )

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Warehouse Network"
        description="Geographic overview of warehouse locations and logistics routes"
      />

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 stagger-children glass-card rounded-xl p-3">
        <Card className="card-depth py-0 gap-0 shadow-card">
          <CardContent className="glass-subtle flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/80">
              <Building2 className="size-4 text-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Warehouses
              </p>
              <p className="text-lg font-bold text-number leading-tight text-foreground">6</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth py-0 gap-0 shadow-card">
          <CardContent className="glass-subtle flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/70">
              <Navigation className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Active Routes
              </p>
              <p className="text-lg font-bold text-number leading-tight text-foreground">24</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth py-0 gap-0 shadow-card">
          <CardContent className="glass-subtle flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/70">
              <Gauge className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Avg Distance
              </p>
              <p className="text-lg font-bold text-number leading-tight text-foreground">580<span className="text-xs font-normal text-muted-foreground ml-1">km</span></p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth py-0 gap-0 shadow-card">
          <CardContent className="glass-subtle flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70">
              <Truck className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                In-Transit
              </p>
              <p className="text-lg font-bold text-number leading-tight text-foreground">23</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth py-0 gap-0 shadow-card">
          <CardContent className="glass-subtle flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/70">
              <TrendingUp className="size-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Fleet Utilization
              </p>
              <p className="text-lg font-bold text-number leading-tight text-foreground">87<span className="text-xs font-normal text-muted-foreground ml-0.5">%</span></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Map Container ── */}
      <Card className="overflow-hidden">
        <CardContent className="glass-subtle p-0">
          {/* Map title bar */}
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-3 md:px-6">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">India Warehouse Network</h3>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Healthy</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="size-2 rounded-full bg-amber-500" />
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="size-2 rounded-full bg-red-500" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="size-2 rounded-full bg-blue-400 animate-pulse" />
                <span>In Transit</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <svg width="20" height="2" className="inline-block">
                  <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeDasharray="3 2" strokeWidth="1.5" />
                </svg>
                <span>Route</span>
              </div>
            </div>
          </div>

          {/* Map area */}
          <div
            className="relative w-full overflow-hidden"
            style={{ minHeight: "540px", background: "oklch(0.15 0.01 260 / 0.97)" }}
          >
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px"
            }} />

            {/* India outline SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              aria-hidden="true"
              viewBox="0 0 100 100"
            >
              <path
                d={INDIA_OUTLINE_PATH}
                fill="oklch(0.22 0.015 260 / 0.3)"
                stroke="oklch(0.5 0.08 260 / 0.2)"
                strokeWidth="0.4"
                strokeDasharray="2 1"
              />
              {/* Region labels */}
              {REGION_LABELS.map((r) => (
                <text
                  key={r.label}
                  x={r.x}
                  y={r.y}
                  className={r.color}
                  fontSize="3.5"
                  textAnchor="middle"
                  fontWeight="bold"
                  letterSpacing="2"
                  opacity="0.5"
                >
                  {r.label}
                </text>
              ))}
              {/* Animated route lines */}
              {ROUTE_CONNECTIONS.map((route, idx) => (
                <AnimatedRouteLine key={idx} route={route} idx={idx} />
              ))}
            </svg>

            {/* Warehouse nodes */}
            {warehouses.map((warehouse) => {
              const position = WAREHOUSE_POSITIONS[warehouse.id]
              if (!position) return null
              return (
                <WarehouseNode
                  key={warehouse.id}
                  warehouse={warehouse}
                  position={position}
                  isSelected={selectedId === warehouse.id}
                  onClick={() => handleNodeClick(warehouse.id)}
                />
              )
            })}

            {/* Detail panel */}
            {selectedWarehouse && (
              <WarehouseDetailPanel
                warehouse={selectedWarehouse}
                onClose={handleClosePanel}
                onExpand={handleExpand}
              />
            )}

            {/* Map legend - bottom left */}
            <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-black/40 backdrop-blur-sm px-3 py-2 text-[9px] text-white/70 space-y-1">
              <p className="font-semibold text-white/90 text-[10px]">Network Summary</p>
              <p>6 Warehouses across 4 regions</p>
              <p>7 Inter-warehouse routes</p>
              <p>23 vehicles in transit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Fleet Tracker + Route Table ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Routes Table */}
        <Card className="overflow-hidden lg:col-span-2">
          <CardContent className="glass-subtle p-0">
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3 md:px-6">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Active Routes</h3>
              </div>
              <Badge variant="outline" className="badge-interactive text-[10px] font-medium">
                {ACTIVE_ROUTES.length} routes
              </Badge>
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-glass">
              <Table className="table-hover-highlight table-row-hover table-header-sticky-glass">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Route ID</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead />
                    <TableHead>Destination</TableHead>
                    <TableHead className="text-right">Distance</TableHead>
                    <TableHead className="text-right">ETA</TableHead>
                    <TableHead className="text-center w-[100px]">Progress</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ACTIVE_ROUTES.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>
                        <span className="text-xs font-mono text-muted-foreground">{route.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3 text-muted-foreground shrink-0" />
                          <span className="text-xs font-medium text-foreground">{route.from}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ArrowRight className="size-3.5 text-muted-foreground/50" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3 text-muted-foreground shrink-0" />
                          <span className="text-xs font-medium text-foreground">{route.to}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-number text-foreground">{route.distance}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="size-3 text-muted-foreground shrink-0" />
                          <span className="text-xs text-number text-foreground">{route.estTime}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                route.status === "Delayed" ? "bg-red-500" :
                                route.progress > 80 ? "bg-emerald-500" :
                                route.progress > 40 ? "bg-blue-500" : "bg-amber-500"
                              )}
                              style={{ width: `${route.progress}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-muted-foreground w-7 text-right">{route.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "badge-status-dot inline-flex border text-[9px]",
                            routeStatusClass[route.status],
                            routeStatusBadge[route.status]
                          )}
                        >
                          {route.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Overview Panel */}
        <Card className="card-depth shadow-card overflow-hidden">
          <CardContent className="glass-subtle p-0">
            <div className="flex items-center gap-2 border-b border-border/40 px-4 py-3">
              <Navigation className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Fleet Overview</h3>
            </div>
            <CardContent className="glass-subtle p-4 space-y-4">
              {/* Vehicle status breakdown */}
              {[
                { label: "In Transit", count: 23, total: 30, color: "bg-blue-500" },
                { label: "Loading", count: 4, total: 30, color: "bg-amber-500" },
                { label: "Idle", count: 2, total: 30, color: "bg-gray-400" },
                { label: "Maintenance", count: 1, total: 30, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-bold text-number">{item.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", item.color)}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="h-px bg-border/50" />

              {/* Quick fleet stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Avg Speed", value: "62 km/h", icon: <Gauge className="size-3" /> },
                  { label: "On-Time Rate", value: "94.2%", icon: <CheckCircle2 className="size-3" /> },
                  { label: "Fuel Efficiency", value: "8.2 km/L", icon: <Activity className="size-3" /> },
                  { label: "Total Distance", value: "14.2k km", icon: <Navigation className="size-3" /> },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-md bg-muted/30 px-2.5 py-2 flex items-center gap-2">
                    <span className="text-muted-foreground">{stat.icon}</span>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                      <p className="text-xs font-bold text-number">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CardContent>
        </Card>
      </div>

      <WarehouseMapDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        warehouse={drawerWh}
      />
    </div>
  )
}
