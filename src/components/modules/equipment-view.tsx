"use client"

import { useMemo, useState, useCallback } from "react"
import { equipmentData } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { DataTable, type Column, type BatchAction } from "@/components/shared/data-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Wrench,
  Zap,
  Battery,
  Cog,
  Activity,
  Clock,
  AlertTriangle,
  Filter,
  Download,
  LayoutGrid,
  List,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EquipmentDetailDrawer, type EquipmentDetailRow } from "@/components/shared/equipment-detail-drawer"
import { useToast } from "@/hooks/use-toast-helper"

const statusVariantMap: Record<string, "green" | "amber" | "red" | "blue" | "gray"> = {
  active: "green",
  maintenance: "red",
  idle: "gray",
  charging: "blue",
}

function batteryColor(level: number) {
  if (level > 60) return "bg-emerald-500"
  if (level >= 20) return "bg-amber-500"
  return "bg-red-500"
}

function batteryLabel(level: number) {
  if (level > 60) return "text-emerald-600"
  if (level >= 20) return "text-amber-600"
  return "text-red-600"
}

type EquipmentRow = (typeof equipmentData)[number]

const EXPORT_COLUMNS = ["ID", "Name", "Type", "Status", "Warehouse", "Utilization %", "Battery %", "Hours Used", "Next Maintenance"]

export function EquipmentView() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detailItem, setDetailItem] = useState<EquipmentDetailRow | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const toast = useToast()

  const openDetail = useCallback((item: EquipmentDetailRow) => {
    setDetailItem(item)
    setDetailOpen(true)
  }, [])

  const handleScheduleMaintenance = useCallback((item: EquipmentDetailRow) => {
    toast.success(
      "Maintenance scheduled",
      `${item.name} — service scheduled for ${new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
    )
    setDetailOpen(false)
  }, [toast])

  const handleRefresh = useCallback((item: EquipmentDetailRow) => {
    toast.info("Refreshing equipment data", `Fetching latest telemetry for ${item.name}...`)
  }, [toast])

  const filteredEquipment = useMemo(() => {
    if (statusFilter === "all") return equipmentData
    return equipmentData.filter((e) => e.status === statusFilter)
  }, [statusFilter])

  const handleExportCSV = useCallback(() => {
    const data = equipmentData.map((e) => {
      // Utilization = hours_used / (hours_used + downtime) — derived metric
      const utilization = e.hoursUsed + e.downtime > 0
        ? Math.round((e.hoursUsed / (e.hoursUsed + e.downtime)) * 100)
        : 0
      return {
        ID: e.id,
        Name: e.name,
        Type: e.type,
        Status: e.status,
        Warehouse: e.warehouse,
        "Utilization (%)": utilization,
        "Battery (%)": e.batteryLevel,
        "Hours Used": e.hoursUsed,
        "Next Maintenance": new Date(e.nextMaintenance).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      }
    })
    exportToCSV(data, "equipment-data", EXPORT_COLUMNS)
  }, [])

  const stats = useMemo(() => {
    const total = equipmentData.length
    const active = equipmentData.filter((e) => e.status === "active").length
    const maintenance = equipmentData.filter((e) => e.status === "maintenance").length
    const charging = equipmentData.filter((e) => e.status === "charging").length
    const avgBattery = Math.round(
      equipmentData.reduce((s, e) => s + e.batteryLevel, 0) / total
    )
    return { total, active, maintenance, charging, avgBattery }
  }, [])

  const chartData = useMemo(
    () =>
      equipmentData.map((e) => ({
        name: e.name.length > 12 ? e.name.slice(0, 12) + "..." : e.name,
        hours: e.hoursUsed,
      })),
    []
  )

  const chartConfig = {
    hours: { label: "Hours Used", color: "var(--chart-1)" },
  }

  const columns: Column<EquipmentRow>[] = [
    {
      key: "name",
      header: "Equipment",
      sortable: true,
      className: "w-[160px]",
      render: (value, row) => (
        <div className="min-w-0">
          <p className="truncate text-xs font-medium">{value as string}</p>
          <p className="text-[10px] text-muted-foreground">{row.warehouse}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      className: "w-[90px]",
      render: (value) => (
        <Badge variant="secondary" className="badge-interactive text-[10px] font-normal">{value as string}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      className: "w-[100px]",
      render: (value) => (
        <StatusBadge status={value as string} variant={statusVariantMap[(value as string)] || "gray"} />
      ),
    },
    {
      key: "hoursUsed",
      header: "Utilization",
      sortable: true,
      className: "w-[120px]",
      render: (_value, row) => {
        // Derived utilization: hoursUsed / (hoursUsed + downtime)
        const pct = row.hoursUsed + row.downtime > 0
          ? Math.round((row.hoursUsed / (row.hoursUsed + row.downtime)) * 100)
          : 0
        const color = pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600"
        return (
          <div className="flex items-center gap-2">
            <Progress value={pct} className="h-1.5 w-14" />
            <span className={cn("text-[10px] font-semibold tabular-nums", color)}>{pct}%</span>
          </div>
        )
      },
    },
    {
      key: "batteryLevel",
      header: "Battery",
      sortable: true,
      className: "w-[110px]",
      render: (value) => {
        const level = value as number
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-full max-w-[48px] rounded-full bg-muted overflow-hidden">
              <div className={cn("h-full rounded-full transition-all", batteryColor(level))} style={{ width: `${level}%` }} />
            </div>
            <span className={cn("text-[10px] font-semibold tabular-nums", batteryLabel(level))}>{level}%</span>
          </div>
        )
      },
    },
    {
      key: "hoursUsed",
      header: "Hours",
      sortable: true,
      className: "w-[70px]",
      render: (value) => (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="tabular-nums">{value as number}h</span>
        </div>
      ),
    },
    {
      key: "nextMaintenance",
      header: "Next Maint.",
      sortable: true,
      className: "w-[100px] hidden lg:table-cell",
      render: (value) => (
        <span className="text-xs tabular-nums">
          {new Date(value as string).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
      ),
    },
  ]

  const batchActions: BatchAction<EquipmentRow>[] = [
    {
      label: "Export Selected",
      icon: Download,
      onClick: (rows) => {
        const data = rows.map((e) => {
          const utilization = e.hoursUsed + e.downtime > 0
            ? Math.round((e.hoursUsed / (e.hoursUsed + e.downtime)) * 100)
            : 0
          return {
            ID: e.id,
            Name: e.name,
            Type: e.type,
            Status: e.status,
            Warehouse: e.warehouse,
            "Utilization (%)": utilization,
            "Battery (%)": e.batteryLevel,
            "Hours Used": e.hoursUsed,
            "Next Maintenance": new Date(e.nextMaintenance).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          }
        })
        exportToCSV(data, "equipment-selected", EXPORT_COLUMNS)
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment"
        description="Manage forklifts and material handling equipment"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className={cn("gap-1.5", viewMode === "grid" && "bg-accent")}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("gap-1.5", viewMode === "table" && "bg-accent")}
              onClick={() => setViewMode("table")}
              aria-label="Table view"
              aria-pressed={viewMode === "table"}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="press-scale btn-outline-animate gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            <ExportButton onExportCSV={handleExportCSV} />
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 stagger-children">
        {[
          { label: "Total Equipment", value: stats.total, icon: Cog, color: "bg-muted/80 text-muted-foreground", textColor: "" },
          { label: "Active", value: stats.active, icon: Activity, color: "bg-emerald-50 dark:bg-emerald-950/60", textColor: "text-emerald-600" },
          { label: "In Maintenance", value: stats.maintenance, icon: Wrench, color: "bg-red-50 dark:bg-red-950/60", textColor: "text-red-600" },
          { label: "Charging", value: stats.charging, icon: Zap, color: "bg-blue-50 dark:bg-blue-950/60", textColor: "text-blue-600" },
          { label: "Avg Battery", value: `${stats.avgBattery}%`, icon: Battery, color: "bg-muted/80 text-muted-foreground", textColor: "" },
        ].map((item) => (
          <Card key={item.label} className="hover-lift-sm card-depth py-0 gap-0 hover-scale-sm">
            <CardContent className="inner-glow glass-subtle flex items-center gap-4 py-4">
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", item.color)}>
                <item.icon className={cn("size-5", item.textColor || "text-muted-foreground")} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className={cn("mt-0.5 text-xl font-bold tabular-nums text-number leading-tight", item.textColor)}>
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {["all", "active", "maintenance", "charging", "idle"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            className="h-7 text-[10px] capitalize"
            onClick={() => setStatusFilter(status)}
          >
            {status === "all" ? "All" : status}
            <Badge variant="secondary" className="badge-interactive ml-1 h-4 px-1 text-[9px] tabular-nums">
              {status === "all"
                ? equipmentData.length
                : equipmentData.filter((e) => e.status === status).length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Equipment Grid or Table View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEquipment.map((eq) => (
            <div
              key={eq.id}
              className="card-depth data-card rounded-lg border p-4 space-y-3 hover-scale-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
              onClick={() => openDetail(eq as unknown as EquipmentDetailRow)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(eq as unknown as EquipmentDetailRow) } }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{eq.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {eq.warehouse}
                  </p>
                </div>
                <StatusBadge
                  status={eq.status}
                  variant={statusVariantMap[eq.status]}
                />
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="badge-interactive text-[10px] font-normal">
                  {eq.type}
                </Badge>
                <Badge variant="outline" className="badge-interactive text-[10px] font-normal">
                  <Clock className="size-3 mr-1" />
                  {eq.hoursUsed}h used
                </Badge>
              </div>

              {/* Battery */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Battery className={cn("size-3.5", batteryLabel(eq.batteryLevel))} />
                    Battery
                  </span>
                  <span className={cn("font-semibold tabular-nums text-number", batteryLabel(eq.batteryLevel))}>
                    {eq.batteryLevel}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", batteryColor(eq.batteryLevel))}
                    style={{ width: `${eq.batteryLevel}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                <span>Next maintenance</span>
                <span className="font-medium text-foreground">
                  {new Date(eq.nextMaintenance).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable<EquipmentRow>
          data={filteredEquipment}
          columns={columns}
          searchableColumns={["name", "type", "warehouse", "status"]}
          searchPlaceholder="Search equipment..."
          selectable
          batchActions={batchActions}
          showColumnToggle
          pageSize={10}
          showCount
          onRowClick={(row) => openDetail(row as unknown as EquipmentDetailRow)}
        />
      )}

      {/* Utilization Chart */}
      <Card className="hover-lift-sm rounded-xl card-shine">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Equipment Utilization
          </CardTitle>
          <CardDescription className="text-xs">Hours used per equipment unit</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 24, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(v) => `${v}h`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="hours"
                fill="var(--color-hours)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Equipment Detail Drawer */}
      <EquipmentDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        item={detailItem}
        onScheduleMaintenance={handleScheduleMaintenance}
        onRefresh={handleRefresh}
      />
    </div>
  )
}
