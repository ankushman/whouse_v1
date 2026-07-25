"use client"

import { useState, useMemo } from "react"
import { warehouses } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────────────

interface WarehouseMapViewProps {
  onWarehouseClick?: (warehouseId: string) => void
}

type WarehouseStatus = "green" | "amber" | "red"

// ── Constants ───────────────────────────────────────────────────────────────

// Approximate geographic positions of each warehouse on the Indian map
// Positioned as percentage of container (x%, y%) based on real-world lat/lng
const WAREHOUSE_POSITIONS: Record<
  string,
  { x: number; y: number; anchor: "left" | "right" | "center" }
> = {
  "WH-GUR-003": { x: 48, y: 22, anchor: "left" }, // Gurugram (near Delhi) - north
  "WH-KOL-004": { x: 72, y: 48, anchor: "right" }, // Kolkata - east
  "WH-SAN-005": { x: 15, y: 44, anchor: "left" },  // Sanand - west (Gujarat)
  "WH-PUN-002": { x: 20, y: 64, anchor: "left" },  // Pune - west-south
  "WH-HOS-006": { x: 42, y: 82, anchor: "center" }, // Hosur - south-central
  "WH-CHN-001": { x: 56, y: 80, anchor: "left" },  // Chennai - south-east coast
}

// Connection lines between warehouses for logistics routes
const ROUTE_CONNECTIONS: Array<{
  from: string
  to: string
  distance: string
  time: string
  status: "active" | "delayed" | "planned"
}> = [
  { from: "WH-GUR-003", to: "WH-SAN-005", distance: "912 km", time: "14h 30m", status: "active" },
  { from: "WH-GUR-003", to: "WH-KOL-004", distance: "1,462 km", time: "22h 15m", status: "active" },
  { from: "WH-SAN-005", to: "WH-PUN-002", distance: "524 km", time: "8h 45m", status: "active" },
  { from: "WH-PUN-002", to: "WH-HOS-006", distance: "845 km", time: "13h 20m", status: "delayed" },
  { from: "WH-HOS-006", to: "WH-CHN-001", distance: "247 km", time: "4h 10m", status: "active" },
  { from: "WH-CHN-001", to: "WH-KOL-004", distance: "1,668 km", time: "26h 00m", status: "planned" },
  { from: "WH-GUR-003", to: "WH-PUN-002", distance: "1,418 km", time: "21h 30m", status: "active" },
]

// Mock active routes for the table below the map
const ACTIVE_ROUTES = [
  { id: "RT-4001", from: "Gurugram Hub", to: "Sanand Facility", distance: "912 km", estTime: "14h 30m", status: "In Transit" as const },
  { id: "RT-4002", from: "Sanand Facility", to: "Pune Warehouse", distance: "524 km", estTime: "8h 45m", status: "In Transit" as const },
  { id: "RT-4003", from: "Pune Warehouse", to: "Hosur Support", distance: "845 km", estTime: "13h 20m", status: "Delayed" as const },
  { id: "RT-4004", from: "Chennai Hub", to: "Kolkata Depot", distance: "1,668 km", estTime: "26h 00m", status: "Planned" as const },
  { id: "RT-4005", from: "Gurugram Hub", to: "Kolkata Depot", distance: "1,462 km", estTime: "22h 15m", status: "In Transit" as const },
]

// Status color mapping
const statusDotColors: Record<string, string> = {
  green: "oklch(0.65 0.2 145)",
  amber: "oklch(0.75 0.18 85)",
  red: "oklch(0.6 0.22 25)",
}

const statusBgClass: Record<string, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
}

const statusBadgeClass: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  red: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
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
      <Card
        onClick={onClick}
        className={cn(
          "card-depth hover-lift-sm cursor-pointer py-0 gap-0 transition-all duration-200 min-w-[160px] max-w-[190px]",
          "hover-glow-blue",
          isSelected && "ring-2 ring-primary/50 shadow-md"
        )}
      >
        <CardContent className="p-3">
          {/* Header: status dot + name */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "shrink-0 size-2.5 rounded-full pulse-ring",
                statusBgClass[status]
              )}
            />
            <p className="text-xs font-semibold text-foreground truncate leading-tight">
              {warehouse.name}
            </p>
          </div>

          {/* City */}
          <div className="flex items-center gap-1 mb-2 text-[10px] text-muted-foreground">
            <MapPin className="size-2.5 shrink-0" />
            <span className="truncate">
              {warehouse.city}, {warehouse.state}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-muted/50 px-2 py-1.5">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Occupancy</p>
              <p className={cn("text-xs font-bold text-number", statusBadgeClass[status].split(" ")[1])}>
                {warehouse.capacityUsed}%
              </p>
            </div>
            <div className="rounded-md bg-muted/50 px-2 py-1.5">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Shipments</p>
              <p className="text-xs font-bold text-number text-foreground">
                {warehouse.todayOrders}
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

  const handleNodeClick = (warehouseId: string) => {
    setSelectedId(warehouseId)
    onWarehouseClick?.(warehouseId)
  }

  // Compute center coordinates for SVG lines (based on position percentages)
  const getCenter = (id: string) => {
    const pos = WAREHOUSE_POSITIONS[id]
    if (!pos) return null
    return { cx: pos.x, cy: pos.y }
  }

  const connectionLines = useMemo(() => {
    return ROUTE_CONNECTIONS.map((route, idx) => {
      const c1 = getCenter(route.from)
      const c2 = getCenter(route.to)
      if (!c1 || !c2) return null
      const strokeColor =
        route.status === "active"
          ? "oklch(0.65 0.15 250 / 0.25)"
          : route.status === "delayed"
          ? "oklch(0.6 0.18 25 / 0.3)"
          : "oklch(0.7 0.02 260 / 0.2)"
      return (
        <line
          key={`route-${idx}`}
          x1={`${c1.cx}%`}
          y1={`${c1.cy}%`}
          x2={`${c2.cx}%`}
          y2={`${c2.cy}%`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="transition-opacity duration-300"
        />
      )
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Warehouse Network"
        description="Geographic overview of warehouse locations and logistics routes"
      />

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <Card className="card-depth py-0 gap-0 shadow-card">
          <CardContent className="flex items-center gap-3 py-3 px-4">
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
          <CardContent className="flex items-center gap-3 py-3 px-4">
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
          <CardContent className="flex items-center gap-3 py-3 px-4">
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
          <CardContent className="flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70">
              <TrendingUp className="size-4 text-blue-600 dark:text-blue-400" />
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
        <CardContent className="p-0">
          {/* Map title bar */}
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-3 md:px-6">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">India Warehouse Network</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Healthy</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="size-2 rounded-full bg-amber-500" />
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="size-2 rounded-full bg-red-500" />
                <span>Critical</span>
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
            className="relative w-full overflow-hidden card-grid-pattern"
            style={{ minHeight: "480px", background: "oklch(0.18 0.01 260 / 0.95)" }}
          >
            {/* Dark mode overlay for light theme compatibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-muted/10 to-transparent pointer-events-none" />

            {/* SVG connection lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {connectionLines}
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
          </div>
        </CardContent>
      </Card>

      {/* ── Route Information Panel ── */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-3 md:px-6">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Active Routes</h3>
            </div>
            <Badge variant="outline" className="text-[10px] font-medium">
              {ACTIVE_ROUTES.length} routes
            </Badge>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <Table className="table-row-hover table-header-sticky-glass">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Route ID</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead />
                  <TableHead>Destination</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead className="text-right">Est. Time</TableHead>
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
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "badge-status-dot inline-flex border",
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
    </div>
  )
}
