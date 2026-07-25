"use client"

import { useState, useMemo } from "react"
import { Building2, BarChart3, Table2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DataTable, type Column } from "@/components/shared/data-table"
import { HealthScoreRing } from "@/components/shared/health-score-ring"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WarehouseKPI {
  id: string
  code: string
  name: string
  location: string
  throughput: number
  accuracy: number
  slaCompliance: number
  utilization: number
  costPerOrder: number
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const warehouseData: WarehouseKPI[] = [
  {
    id: "wh-mum-001",
    code: "WH-MUM-001",
    name: "Mumbai Hub",
    location: "Mumbai, Maharashtra",
    throughput: 847,
    accuracy: 97.8,
    slaCompliance: 94.2,
    utilization: 87,
    costPerOrder: 245,
  },
  {
    id: "wh-del-002",
    code: "WH-DEL-002",
    name: "Delhi NCR",
    location: "New Delhi, Delhi",
    throughput: 723,
    accuracy: 96.5,
    slaCompliance: 91.8,
    utilization: 82,
    costPerOrder: 268,
  },
  {
    id: "wh-chn-003",
    code: "WH-CHN-003",
    name: "Chennai",
    location: "Chennai, Tamil Nadu",
    throughput: 612,
    accuracy: 98.1,
    slaCompliance: 95.6,
    utilization: 78,
    costPerOrder: 231,
  },
  {
    id: "wh-kol-004",
    code: "WH-KOL-004",
    name: "Kolkata",
    location: "Kolkata, West Bengal",
    throughput: 489,
    accuracy: 95.2,
    slaCompliance: 88.4,
    utilization: 71,
    costPerOrder: 289,
  },
  {
    id: "wh-hyd-005",
    code: "WH-HYD-005",
    name: "Hyderabad",
    location: "Hyderabad, Telangana",
    throughput: 556,
    accuracy: 96.9,
    slaCompliance: 93.1,
    utilization: 76,
    costPerOrder: 257,
  },
  {
    id: "wh-blr-006",
    code: "WH-BLR-006",
    name: "Bangalore",
    location: "Bangalore, Karnataka",
    throughput: 678,
    accuracy: 97.4,
    slaCompliance: 92.7,
    utilization: 84,
    costPerOrder: 242,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Compute a 0-100 health score from the five KPIs. */
function computeHealthScore(wh: WarehouseKPI): number {
  const maxThroughput = Math.max(...warehouseData.map((w) => w.throughput))
  const minCost = Math.min(...warehouseData.map((w) => w.costPerOrder))

  const normThroughput = (wh.throughput / maxThroughput) * 100
  const normAccuracy = wh.accuracy
  const normSLA = wh.slaCompliance
  const normUtil = wh.utilization
  const normCost = (minCost / wh.costPerOrder) * 100

  const score =
    normThroughput * 0.15 +
    normAccuracy * 0.30 +
    normSLA * 0.25 +
    normUtil * 0.15 +
    normCost * 0.15

  return Math.round(Math.min(100, Math.max(0, score)))
}

function healthStatus(score: number): "green" | "amber" | "red" {
  if (score >= 90) return "green"
  if (score >= 75) return "amber"
  return "red"
}

/** Find the warehouse with the best health score. */
function getBestPerformerId(): string {
  let best = warehouseData[0]
  for (const wh of warehouseData) {
    if (computeHealthScore(wh) > computeHealthScore(best)) best = wh
  }
  return best.id
}

// ---------------------------------------------------------------------------
// Chart config
// ---------------------------------------------------------------------------

const kpiChartConfig = {
  throughput: { label: "Throughput", color: "#2563EB" },
  accuracy: { label: "Accuracy %", color: "#10B981" },
  slaCompliance: { label: "SLA Compliance %", color: "#F59E0B" },
  utilization: { label: "Utilization %", color: "#8B5CF6" },
  costPerOrder: { label: "Cost Efficiency", color: "#EF4444" },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type ViewMode = "table" | "chart"

export function WarehouseKPIComparison() {
  const [view, setView] = useState<ViewMode>("table")

  const bestId = useMemo(() => getBestPerformerId(), [])

  // Augment data with health score
  const enrichedData = useMemo(
    () =>
      warehouseData.map((wh) => ({
        ...wh,
        healthScore: computeHealthScore(wh),
      })),
    []
  )

  // Normalised chart data (0-100 scale for comparison)
  const chartData = useMemo(() => {
    const maxThroughput = Math.max(...warehouseData.map((w) => w.throughput))
    const minCost = Math.min(...warehouseData.map((w) => w.costPerOrder))

    return warehouseData.map((wh) => ({
      name: wh.name,
      throughput: Math.round((wh.throughput / maxThroughput) * 100),
      accuracy: Math.round(wh.accuracy),
      slaCompliance: Math.round(wh.slaCompliance),
      utilization: Math.round(wh.utilization),
      costPerOrder: Math.round((minCost / wh.costPerOrder) * 100),
    }))
  }, [])

  // DataTable columns
  const columns: Column<(typeof enrichedData)[number]>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Warehouse",
        sortable: true,
        className: "font-medium",
        render: (_val, row) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-medium leading-tight">{row.name}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{row.code}</span>
            </div>
          </div>
        ),
      },
      {
        key: "location",
        header: "Location",
        sortable: true,
        render: (_val, row) => (
          <span className="text-xs text-muted-foreground">{row.location}</span>
        ),
      },
      {
        key: "throughput",
        header: "Throughput",
        sortable: true,
        className: "text-right",
        headerClassName: "text-right",
        render: (val) => (
          <span className="text-number text-xs font-medium">{Number(val).toLocaleString("en-IN")}</span>
        ),
      },
      {
        key: "accuracy",
        header: "Accuracy",
        sortable: true,
        className: "text-right",
        headerClassName: "text-right",
        render: (val) => (
          <span className="text-number text-xs font-medium">{val}%</span>
        ),
      },
      {
        key: "slaCompliance",
        header: "SLA Compliance",
        sortable: true,
        className: "text-right",
        headerClassName: "text-right",
        render: (val) => (
          <span className="text-number text-xs font-medium">{val}%</span>
        ),
      },
      {
        key: "utilization",
        header: "Utilization",
        sortable: true,
        className: "text-right",
        headerClassName: "text-right",
        render: (val) => (
          <span className="text-number text-xs font-medium">{val}%</span>
        ),
      },
      {
        key: "costPerOrder",
        header: "Cost/Order",
        sortable: true,
        className: "text-right",
        headerClassName: "text-right",
        render: (val) => (
          <span className="text-number text-xs font-medium">\u20b9{Number(val).toLocaleString("en-IN")}</span>
        ),
      },
      {
        key: "healthScore",
        header: "Health",
        sortable: true,
        className: "text-center",
        headerClassName: "text-center",
        render: (val) => {
          const score = Number(val)
          return (
            <div className="flex justify-center">
              <HealthScoreRing
                score={score}
                size={40}
                strokeWidth={3}
                status={healthStatus(score)}
              />
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <Card className="card-depth chart-card card-accent-purple">
      {/* ---- Header ---- */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <CardTitle className="text-sm font-semibold">
              Warehouse Performance Comparison
            </CardTitle>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
              6 Warehouses
            </Badge>
          </div>

          {/* Toggle bar */}
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => {
              if (v) setView(v as ViewMode)
            }}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <ToggleGroupItem value="table" aria-label="Table view" className="gap-1.5 text-xs px-3">
              <Table2 className="h-3.5 w-3.5" />
              Table
            </ToggleGroupItem>
            <ToggleGroupItem value="chart" aria-label="Chart view" className="gap-1.5 text-xs px-3">
              <BarChart3 className="h-3.5 w-3.5" />
              Chart
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>

      {/* ---- Body ---- */}
      <CardContent>
        {view === "table" ? (
          <div className="[&_tr]:transition-colors [&_tr:hover]:bg-muted/30">
            <DataTable
              data={enrichedData}
              columns={columns}
              pageSize={6}
              searchableColumns={["name", "location", "code"]}
              searchPlaceholder="Search warehouses..."
              showCount={false}
              showColumnToggle={false}
              className="[&_td]:py-2 [&_th]:py-2"
            />
            {/* Highlight best performer with emerald glow */}
            <style>{`
              tr[data-row-id="${bestId}"] {
                background: rgba(16, 185, 129, 0.04);
                transition: box-shadow 0.3s ease;
              }
              tr[data-row-id="${bestId}"]:hover {
                background: rgba(16, 185, 129, 0.08);
                box-shadow: 0 0 20px oklch(0.7 0.2 160 / 0.15), 0 4px 12px oklch(0 0 0 / 0.08);
              }
              :root.dark tr[data-row-id="${bestId}"]:hover {
                box-shadow: 0 0 24px oklch(0.6 0.18 160 / 0.25), 0 4px 16px oklch(0 0 0 / 0.3);
              }
            `}</style>
          </div>
        ) : (
          <Card className="card-depth chart-card">
            <CardContent className="pt-4 pb-2">
              <ChartContainer config={kpiChartConfig} className="h-[320px] w-full">
                <BarChart data={chartData} barGap={2} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="throughput"
                    fill="var(--color-throughput)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="accuracy"
                    fill="var(--color-accuracy)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="slaCompliance"
                    fill="var(--color-slaCompliance)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="utilization"
                    fill="var(--color-utilization)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="costPerOrder"
                    fill="var(--color-costPerOrder)"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
