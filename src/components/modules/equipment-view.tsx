"use client"

import { useMemo, useState, useCallback } from "react"
import { equipmentData } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Search,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Helpers ──────────────────────────────────────────────────────────────────

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

// ── Component ────────────────────────────────────────────────────────────────

export function EquipmentView() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEquipment = useMemo(() => {
    if (!searchQuery) return equipmentData
    const q = searchQuery.toLowerCase()
    return equipmentData.filter((e) => e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q))
  }, [searchQuery])

  const handleExportCSV = useCallback(() => {
    const data = filteredEquipment.map((e) => ({
      ID: e.id,
      Name: e.name,
      Type: e.type,
      Status: e.status,
      Warehouse: e.warehouse,
      "Utilization (%)": e.utilization,
      "Battery (%)": e.batteryLevel,
      "Last Maintenance": e.lastMaintenance,
    }))
    exportToCSV(data, "equipment-data", ["ID", "Name", "Type", "Status", "Warehouse", "Utilization (%)", "Battery (%)", "Last Maintenance"])
  }, [filteredEquipment])

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
        name: e.name.length > 12 ? e.name.slice(0, 12) + "…" : e.name,
        hours: e.hoursUsed,
      })),
    []
  )

  const chartConfig = {
    hours: { label: "Hours Used", color: "var(--chart-1)" },
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment"
        description="Manage forklifts and material handling equipment"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            <ExportButton onExportCSV={handleExportCSV} />
          </>
        }
      />

      {/* Search + Count */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name or type..."
            className="h-8 w-[220px] pl-8 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {filteredEquipment.length} equipment item{filteredEquipment.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 stagger-children">
        <Card className="py-0 gap-0">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/80">
              <Cog className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Equipment
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight">
                {stats.total}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 gap-0">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60">
              <Activity className="size-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Active
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight text-emerald-600">
                {stats.active}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 gap-0">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/60">
              <Wrench className="size-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                In Maintenance
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight text-red-600">
                {stats.maintenance}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 gap-0">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60">
              <Zap className="size-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Charging
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight text-blue-600">
                {stats.charging}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 gap-0 col-span-2 lg:col-span-1">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/80">
              <Battery className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Avg Battery
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight">
                {stats.avgBattery}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Grid */}
      <Card className="rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            Equipment Fleet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[480px]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {equipmentData.map((eq) => (
                <div
                  key={eq.id}
                  className="card-depth data-card rounded-lg border p-4 space-y-3"
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
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {eq.type}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-normal">
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
                      <span className={cn("font-semibold tabular-nums", batteryLabel(eq.batteryLevel))}>
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
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Utilization Chart */}
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Equipment Utilization
          </CardTitle>
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
    </div>
  )
}
