"use client"

import { useState, useMemo } from "react"
import { warehouses } from "@/data/mock-data"
import { HealthScoreRing } from "@/components/shared/health-score-ring"
import { StatusBadge } from "@/components/shared/status-badge"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  MapPin,
  Package,
  AlertTriangle,
  Users,
  ChevronRight,
  Gauge,
  Activity,
  LayoutGrid,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────────────

interface WarehouseMapViewProps {
  onWarehouseClick: (warehouseId: string) => void
}

// ── Constants ───────────────────────────────────────────────────────────────

// Approximate SVG coordinates for each warehouse on the India map
// Mapping: x = (lon - 67) / 31 * 100, y = (38 - lat) / 31 * 120
const WAREHOUSE_MAP_COORDS: Record<
  string,
  { x: number; y: number; labelX: number; labelY: number; labelAnchor: "start" | "end" }
> = {
  "WH-GUR-003": { x: 32.3, y: 36.8, labelX: 35, labelY: 35, labelAnchor: "start" },       // Gurugram
  "WH-SAN-005": { x: 18.1, y: 60.8, labelX: 15, labelY: 59, labelAnchor: "end" },          // Sanand
  "WH-PUN-002": { x: 22.3, y: 75.5, labelX: 19, labelY: 74, labelAnchor: "end" },          // Pune
  "WH-CHN-001": { x: 42.9, y: 96.4, labelX: 45.5, labelY: 95, labelAnchor: "start" },      // Chennai
  "WH-HOS-006": { x: 34.8, y: 97.9, labelX: 31, labelY: 96, labelAnchor: "end" },          // Hosur
  "WH-KOL-004": { x: 69.0, y: 59.6, labelX: 72, labelY: 58, labelAnchor: "start" },          // Kolkata
}

// Simplified India outline polygon (SVG viewBox 0 0 100 120)
// Traced clockwise from Kashmir (northwest)
const INDIA_OUTLINE =
  "28,8 35,14 37,20 38,25 35,28 42,32 48,36 55,42 63,46 72,46 80,40 86,34 88,40 84,48 78,54 74,62 64,62 58,66 50,76 44,86 38,95 35,100 30,108 26,114 22,112 18,102 14,92 10,82 8,72 6,64 4,56 2,46 2,36 6,28 14,20 22,14"

// Network connection lines between warehouses (forming a logistics network)
const NETWORK_CONNECTIONS: [string, string][] = [
  ["WH-GUR-003", "WH-SAN-005"], // North → West
  ["WH-GUR-003", "WH-KOL-004"], // North → East
  ["WH-SAN-005", "WH-PUN-002"], // West corridor
  ["WH-PUN-002", "WH-HOS-006"], // South corridor
  ["WH-HOS-006", "WH-CHN-001"], // South cluster
  ["WH-CHN-001", "WH-KOL-004"], // East corridor
]

// Status color mapping
const statusDotColors: Record<string, string> = {
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
}

const statusTextColors: Record<string, string> = {
  green: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  red: "text-red-600 dark:text-red-400",
}

const statusBgColors: Record<string, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
}

const statusProgressTrack: Record<string, string> = {
  green: "bg-emerald-100 dark:bg-emerald-900/40",
  amber: "bg-orange-100 dark:bg-orange-900/40",
  red: "bg-red-100 dark:bg-red-900/40",
}

const statusProgressFill: Record<string, string> = {
  green: "bg-emerald-500",
  amber: "bg-orange-500",
  red: "bg-red-500",
}

type WarehouseStatus = "green" | "amber" | "red"

// ── Stat Pill ─────────────────────────────────────────────────────────────────

interface StatPillProps {
  icon: React.ReactNode
  label: string
  value: number
  color: string
  sublabel?: string
}

function StatPill({ icon, label, value, color, sublabel }: StatPillProps) {
  return (
    <Card className="card-depth py-0 gap-0">
      <CardContent className="flex items-center gap-3 py-3 px-4">
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", color)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-lg font-bold tabular-nums leading-tight text-foreground">{value}</p>
          {sublabel && (
            <p className="text-[10px] text-muted-foreground">{sublabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Legend Item ─────────────────────────────────────────────────────────────

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn("size-2.5 rounded-full", color)} />
      <span className="font-medium">{label}</span>
    </div>
  )
}

// ── Mini Card ─────────────────────────────────────────────────────────────────

interface MiniCardProps {
  warehouse: (typeof warehouses)[number]
  onClick: () => void
}

function MiniCard({ warehouse, onClick }: MiniCardProps) {
  const status = warehouse.status as WarehouseStatus
  const capacityPercent = warehouse.capacityUsed

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-xl border-border/60 py-0 gap-0 transition-all duration-200",
        "hover:border-primary/30 hover:shadow-md hover:shadow-primary/[0.04]",
        "active:scale-[0.99]"
      )}
    >
      <CardContent className="flex items-center gap-3 p-3">
        {/* Health Score Ring */}
        <HealthScoreRing score={warehouse.healthScore} status={status} size={44} />

        {/* Info */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground leading-tight">
                {warehouse.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                <MapPin className="size-2.5 shrink-0" />
                <span className="truncate">
                  {warehouse.city}, {warehouse.state}
                </span>
              </div>
            </div>
          </div>

          {/* Capacity bar */}
          <div className="flex items-center gap-2">
            <div className={cn("h-1.5 flex-1 overflow-hidden rounded-full", statusProgressTrack[status])}>
              <div
                className={cn("h-full rounded-full transition-all duration-500", statusProgressFill[status])}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
            <span className={cn("text-[10px] font-semibold tabular-nums shrink-0", statusTextColors[status])}>
              {capacityPercent}%
            </span>
          </div>

          {/* Metrics row */}
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Package className="size-2.5" />
              {warehouse.todayOrders}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-2.5" />
              {warehouse.managerName.split(" ")[0]}
            </span>
            {warehouse.alerts > 0 && (
              <span className={cn("flex items-center gap-1 font-medium", statusTextColors[status])}>
                <AlertTriangle className="size-2.5" />
                {warehouse.alerts}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </CardContent>
    </Card>
  )
}

// ── Hover Info Card ────────────────────────────────────────────────────────────

interface HoverInfoCardProps {
  warehouse: (typeof warehouses)[number]
}

function HoverInfoCard({ warehouse }: HoverInfoCardProps) {
  const status = warehouse.status as WarehouseStatus

  return (
    <div className="absolute bottom-4 right-4 z-10 rounded-xl border border-border/80 bg-background/95 p-3 shadow-lg backdrop-blur-sm max-w-[200px]">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full status-dot-pulse", statusBgColors[status])} />
          <p className="truncate text-xs font-semibold text-foreground">{warehouse.name}</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="size-2.5 shrink-0" />
          <span>{warehouse.city}, {warehouse.state}</span>
        </div>
        <Separator className="opacity-50" />
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs font-bold tabular-nums text-foreground">{warehouse.healthScore}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Health</p>
          </div>
          <div>
            <p className="text-xs font-bold tabular-nums text-foreground">{warehouse.capacityUsed}%</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Capacity</p>
          </div>
          <div>
            <p className="text-xs font-bold tabular-nums text-foreground">{warehouse.todayOrders}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Orders</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function WarehouseMapView({ onWarehouseClick }: WarehouseMapViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const stats = useMemo(() => {
    const greenCount = warehouses.filter((w) => w.status === "green").length
    const amberCount = warehouses.filter((w) => w.status === "amber").length
    const redCount = warehouses.filter((w) => w.status === "red").length
    return { total: warehouses.length, greenCount, amberCount, redCount }
  }, [])

  const hoveredWarehouse = useMemo(
    () => warehouses.find((w) => w.id === hoveredId) ?? null,
    [hoveredId]
  )

  const getCoords = (id: string) => WAREHOUSE_MAP_COORDS[id]

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Warehouse Network"
        description="Geographic view of all warehouses across India"
      />

      {/* ── Stats Summary ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        <StatPill
          icon={<Building2 className="size-4 text-foreground" />}
          label="Total Warehouses"
          value={stats.total}
          color="bg-muted/80"
        />
        <StatPill
          icon={<Activity className="size-4 text-emerald-600 dark:text-emerald-400" />}
          label="Active"
          value={stats.greenCount}
          color="bg-emerald-50 dark:bg-emerald-950/70"
          sublabel="Healthy"
        />
        <StatPill
          icon={<AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />}
          label="Warning"
          value={stats.amberCount}
          color="bg-amber-50 dark:bg-amber-950/70"
          sublabel="Needs attention"
        />
        <StatPill
          icon={<AlertTriangle className="size-4 text-red-600 dark:text-red-400" />}
          label="Critical"
          value={stats.redCount}
          color="bg-red-50 dark:bg-red-950/70"
          sublabel="Immediate action"
        />
      </div>

      {/* ── Main Layout: Map + Mini Cards ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        {/* ── Map Card ── */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-4 md:p-6">
            {/* Map title */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Gauge className="size-4 text-muted-foreground" />
                India Network Map
              </h3>
              <StatusBadge
                status={stats.greenCount + stats.amberCount === stats.total ? "All Monitored" : "Issues Detected"}
                variant={stats.redCount > 0 ? "red" : "green"}
              />
            </div>

            {/* SVG Map */}
            <div className="relative w-full" style={{ aspectRatio: "100 / 120" }}>
              <svg
                viewBox="0 0 100 120"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Map of India showing warehouse locations"
              >
                {/* Background glow for the map */}
                <defs>
                  <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
                  </filter>
                  <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
                  </filter>
                </defs>

                {/* India outline */}
                <g className="text-muted/25 dark:text-muted/10">
                  <polygon
                    points={INDIA_OUTLINE}
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.4"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Network connection lines (dotted) */}
                {NETWORK_CONNECTIONS.map(([id1, id2]) => {
                  const c1 = getCoords(id1)
                  const c2 = getCoords(id2)
                  if (!c1 || !c2) return null
                  return (
                    <line
                      key={`${id1}-${id2}`}
                      x1={c1.x}
                      y1={c1.y}
                      x2={c2.x}
                      y2={c2.y}
                      stroke="currentColor"
                      className="text-muted/30 dark:text-muted/20"
                      strokeWidth="0.3"
                      strokeDasharray="1 1"
                    />
                  )
                })}

                {/* Warehouse markers */}
                {warehouses.map((warehouse) => {
                  const coords = getCoords(warehouse.id)
                  if (!coords) return null
                  const isHovered = hoveredId === warehouse.id
                  const dotColor = statusDotColors[warehouse.status] ?? "#10B981"

                  return (
                    <g
                      key={warehouse.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredId(warehouse.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => onWarehouseClick(warehouse.id)}
                    >
                      {/* Pulse ring (animated glow) */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isHovered ? 3.5 : 2.5}
                        fill={dotColor}
                        opacity="0.2"
                        filter="url(#pulseGlow)"
                        className="animate-pulse"
                      />

                      {/* Outer ring */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isHovered ? 2.8 : 2}
                        fill="none"
                        stroke={dotColor}
                        strokeWidth="0.3"
                        opacity={isHovered ? 0.6 : 0.3}
                      />

                      {/* Main dot */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isHovered ? 1.8 : 1.2}
                        fill={dotColor}
                        className="transition-all duration-200"
                      />

                      {/* Label */}
                      <text
                        x={coords.labelX}
                        y={coords.labelY}
                        textAnchor={coords.labelAnchor}
                        className="pointer-events-none select-none"
                        style={{
                          fontSize: isHovered ? "3.2px" : "2.6px",
                          fontWeight: isHovered ? 700 : 600,
                          fill: isHovered ? dotColor : "var(--label-color, oklch(0.3 0.02 260))",
                          transition: "font-size 0.2s, font-weight 0.2s, fill 0.2s",
                        }}
                      >
                        {warehouse.city}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Hover Info Card (overlays the map) */}
              {hoveredWarehouse && (
                <div className="absolute bottom-2 right-2 z-10 sm:bottom-4 sm:right-4">
                  <HoverInfoCard warehouse={hoveredWarehouse} />
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-border/40">
              <LegendItem color="bg-emerald-500" label="Healthy" />
              <LegendItem color="bg-amber-500" label="Warning" />
              <LegendItem color="bg-red-500" label="Critical" />
              <div className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  <span className="w-4 border-t border-dashed border-muted-foreground/40" />
                  <span>Logistics Route</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Mini Cards Sidebar ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Warehouse Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 stagger-children">
            {warehouses.map((warehouse) => (
              <MiniCard
                key={warehouse.id}
                warehouse={warehouse}
                onClick={() => onWarehouseClick(warehouse.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
