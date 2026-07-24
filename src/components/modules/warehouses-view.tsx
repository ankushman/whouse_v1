"use client"

import { useMemo } from "react"
import { warehouses } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  Users,
  Package,
  AlertTriangle,
  Gauge,
  Truck,
  ChevronRight,
  ClipboardList,
  Target,
  Plus,
} from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/app-store"
import { HealthScoreRing } from "@/components/shared/health-score-ring"
import { WarehouseDetailModal } from "@/components/modules/warehouse-detail-modal"
import { WarehouseMapView } from "@/components/modules/warehouse-map-view"

// ── Helpers ──────────────────────────────────────────────────────────────────

const statusColorMap = {
  green: {
    ring: "ring-emerald-200 dark:ring-emerald-800/60",
    bg: "bg-emerald-50 dark:bg-emerald-950/70",
    text: "text-emerald-700 dark:text-emerald-300",
    progress: "bg-emerald-500",
    progressTrack: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  amber: {
    ring: "ring-orange-200 dark:ring-orange-800/60",
    bg: "bg-orange-50 dark:bg-orange-950/70",
    text: "text-orange-700 dark:text-orange-300",
    progress: "bg-orange-500",
    progressTrack: "bg-orange-100 dark:bg-orange-900/40",
  },
  red: {
    ring: "ring-red-200 dark:ring-red-800/60",
    bg: "bg-red-50 dark:bg-red-950/70",
    text: "text-red-700 dark:text-red-300",
    progress: "bg-red-500",
    progressTrack: "bg-red-100 dark:bg-red-900/40",
  },
} as const

type WarehouseStatus = keyof typeof statusColorMap

// ── Summary Stat Card ────────────────────────────────────────────────────────

interface SummaryStatProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sublabel?: string
}

function SummaryStat({ icon, label, value, sublabel }: SummaryStatProps) {
  return (
    <Card className="py-0 gap-0">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/80">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight text-foreground">
            {value}
          </p>
          {sublabel && (
            <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Metric Item ──────────────────────────────────────────────────────────────

interface MetricItemProps {
  icon: React.ReactNode
  label: string
  value: string | number
}

function MetricItem({ icon, label, value }: MetricItemProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex size-8 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
      <span className="text-sm font-semibold tabular-nums leading-none text-foreground">
        {value}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground leading-none">
        {label}
      </span>
    </div>
  )
}

// ── Health Score Badge ───────────────────────────────────────────────────────

interface HealthBadgeProps {
  score: number
  status: WarehouseStatus
}

function HealthBadge({ score, status }: HealthBadgeProps) {
  return <HealthScoreRing score={score} status={status} size={52} showLabel />
}

// ── Warehouse Card ───────────────────────────────────────────────────────────

interface WarehouseCardProps {
  warehouse: (typeof warehouses)[number]
  onClick: () => void
}

function WarehouseCard({ warehouse, onClick }: WarehouseCardProps) {
  const status = warehouse.status as WarehouseStatus
  const colors = statusColorMap[status]
  const capacityPercent = warehouse.capacityUsed

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer rounded-xl border-border/60 py-0 gap-0 transition-all duration-200",
        "hover:border-primary/30 hover:shadow-md hover:shadow-primary/[0.04]",
        "active:scale-[0.99]"
      )}
    >
      <CardContent className="p-5 flex flex-col gap-4">
        {/* ── Header Row ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 shrink-0 text-muted-foreground" />
              <h3 className="truncate text-sm font-semibold text-foreground leading-tight">
                {warehouse.name}
              </h3>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">
                {warehouse.city}, {warehouse.state}
              </span>
            </div>
          </div>
          <HealthScoreRing score={warehouse.healthScore} status={status} size={52} showLabel />
        </div>

        <Separator className="opacity-60" />

        {/* ── Manager ── */}
        <div className="flex items-center gap-2.5">
          <Avatar className="size-7">
            <AvatarFallback className="text-[10px] font-semibold bg-muted">
              {warehouse.managerAvatar}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex items-center gap-1.5">
            <Users className="size-3 shrink-0 text-muted-foreground" />
            <span className="truncate text-xs font-medium text-foreground">
              {warehouse.managerName}
            </span>
          </div>
        </div>

        {/* ── Key Metrics ── */}
        <div className="grid grid-cols-4 gap-2 py-1">
          <MetricItem
            icon={<Package className="size-3.5" />}
            label="Orders"
            value={warehouse.todayOrders}
          />
          <MetricItem
            icon={<ClipboardList className="size-3.5" />}
            label="Pending"
            value={warehouse.pendingTasks}
          />
          <MetricItem
            icon={<Target className="size-3.5" />}
            label="Accuracy"
            value={`${warehouse.inventoryAccuracy}%`}
          />
          <MetricItem
            icon={<Truck className="size-3.5" />}
            label="Forklifts"
            value={`${warehouse.forkliftActive}/${warehouse.forkliftCount}`}
          />
        </div>

        {/* ── Capacity Bar ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Capacity</span>
            <span className={cn("font-semibold tabular-nums", colors.text)}>
              {capacityPercent}%
            </span>
          </div>
          <div className={cn("h-2 w-full overflow-hidden rounded-full", colors.progressTrack)}>
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                colors.progress
              )}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        {/* ── Footer: Alert Count + Navigate hint ── */}
        <div className="flex items-center justify-between pt-1">
          {warehouse.alerts > 0 ? (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium",
                status === "red"
                  ? "text-red-600 dark:text-red-400"
                  : status === "amber"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-amber-600 dark:text-amber-400"
              )}
            >
              <AlertTriangle className="size-3.5" />
              <span>
                {warehouse.alerts} {warehouse.alerts === 1 ? "Alert" : "Alerts"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Gauge className="size-3.5" />
              <span>All clear</span>
            </div>
          )}
          <div className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            <span>View</span>
            <ChevronRight className="size-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

export function WarehousesView() {
  const setActiveView = useAppStore((s) => s.setActiveView)
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<(typeof warehouses)[number] | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [showMap, setShowMap] = React.useState(false)

  const summary = useMemo(() => {
    const totalCapacity = warehouses.reduce((acc, w) => acc + w.capacity, 0)
    const avgOccupancy =
      warehouses.reduce((acc, w) => acc + w.capacityUsed, 0) / warehouses.length
    const avgHealth =
      warehouses.reduce((acc, w) => acc + w.healthScore, 0) / warehouses.length
    return {
      totalWarehouses: warehouses.length,
      totalCapacity,
      avgOccupancy: Math.round(avgOccupancy * 10) / 10,
      avgHealth: Math.round(avgHealth * 10) / 10,
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Warehouses"
        description={showMap ? "Geographic view of all warehouses across India" : "Monitor performance across all 6 warehouses in India"}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={showMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              <MapPin className="size-4" />
              <span className="hidden sm:inline">{showMap ? "Card View" : "Map View"}</span>
            </Button>
            <Button disabled size="sm">
              <Plus className="size-4" />
              Add Warehouse
            </Button>
          </div>
        }
      />

      {showMap ? (
        <WarehouseMapView
          onWarehouseClick={(warehouseId) => {
            const wh = warehouses.find((w) => w.id === warehouseId)
            if (wh) {
              setSelectedWarehouse(wh)
              setModalOpen(true)
              setShowMap(false)
            }
          }}
        />
      ) : (
        <>
          {/* ── Summary Row ── */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 stagger-children">
            <SummaryStat
              icon={<Building2 className="size-5 text-foreground" />}
              label="Warehouses"
              value={summary.totalWarehouses}
              sublabel="Across India"
            />
            <SummaryStat
              icon={<Package className="size-5 text-foreground" />}
              label="Total Capacity"
              value={summary.totalCapacity.toLocaleString("en-IN")}
              sublabel="Pallet positions"
            />
            <SummaryStat
              icon={<Gauge className="size-5 text-foreground" />}
              label="Avg. Occupancy"
              value={`${summary.avgOccupancy}%`}
              sublabel={
                summary.avgOccupancy > 85
                  ? "Running high"
                  : summary.avgOccupancy > 70
                    ? "Optimal range"
                    : "Below target"
              }
            />
            <SummaryStat
              icon={<Gauge className="size-5 text-foreground" />}
              label="Avg. Health Score"
              value={summary.avgHealth}
              sublabel={
                summary.avgHealth >= 85
                  ? "Good standing"
                  : summary.avgHealth >= 70
                    ? "Needs attention"
                    : "Below threshold"
              }
            />
          </div>

          {/* ── Warehouse Grid ── */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
            {warehouses.map((warehouse) => (
              <WarehouseCard
                key={warehouse.id}
                warehouse={warehouse}
                onClick={() => {
                  setSelectedWarehouse(warehouse)
                  setModalOpen(true)
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Warehouse Detail Modal ── */}
      <WarehouseDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        warehouse={selectedWarehouse}
      />
    </div>
  )
}
