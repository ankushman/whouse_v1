"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { Clock, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

// ---- Mock Data ----

const slaCategoryData = [
  { category: "Inbound Processing", sla: 98 },
  { category: "Outbound Dispatch", sla: 95 },
  { category: "Cross-dock Transfer", sla: 92 },
  { category: "Returns Processing", sla: 88 },
  { category: "Same-day Delivery", sla: 94 },
]

const atRiskShipments = [
  { invoice: "INV-2024-3847", type: "Inbound" as const, slaDeadline: "2h left", progress: 65 },
  { invoice: "INV-2024-3901", type: "Outbound" as const, slaDeadline: "45m left", progress: 82 },
  { invoice: "INV-2024-3765", type: "Inbound" as const, slaDeadline: "Overdue 30m", progress: 100 },
  { invoice: "INV-2024-3922", type: "Outbound" as const, slaDeadline: "1h 20m left", progress: 74 },
  { invoice: "INV-2024-3899", type: "Inbound" as const, slaDeadline: "Overdue 15m", progress: 100 },
]

const slaCategoryChartConfig = {
  sla: { label: "SLA %", color: "#10B981" },
}

// ---- Helpers ----

function getSLABarColor(sla: number): string {
  if (sla >= 95) return "#10B981"
  if (sla >= 90) return "#F59E0B"
  return "#EF4444"
}

function getProgressColor(progress: number): string {
  if (progress < 70) return "bg-emerald-500"
  if (progress <= 90) return "bg-amber-500"
  return "bg-red-500"
}

function getProgressTrackColor(progress: number): string {
  if (progress < 70) return "bg-emerald-500/20"
  if (progress <= 90) return "bg-amber-500/20"
  return "bg-red-500/20"
}

// ---- Circular Progress Ring ----

function CircularProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
}: {
  value: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const center = size / 2

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-emerald-500/20"
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-emerald-500 transition-all duration-1000 ease-out"
      />
    </svg>
  )
}

// ---- Main Component ----

export function SLAMonitoringPanel() {
  return (
    <Card className="card-depth chart-card card-accent-amber card-hover-glow rounded-xl border border-t-2 border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/70">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                SLA Monitoring
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Real-time service level tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="status-dot-pulse h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Live
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* SLA Overview Stats */}
        <div className="grid grid-cols-3 gap-3">
          {/* Overall SLA Achievement */}
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 transition-smooth">
            <div className="relative">
              <CircularProgressRing value={96.8} size={44} strokeWidth={3.5} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                96.8%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">
                Overall SLA
              </p>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span className="text-xs font-semibold">On Track</span>
              </div>
            </div>
          </div>

          {/* At Risk Shipments */}
          <div className="flex items-center gap-3 rounded-lg border border-amber-200/60 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-950/30 p-3 transition-smooth">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/60">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">
                At Risk
              </p>
              <Badge className="badge-bounce badge-soft mt-0.5 h-5 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/60 dark:text-amber-300">
                12 shipments
              </Badge>
            </div>
          </div>

          {/* Breached Today */}
          <div className="flex items-center gap-3 rounded-lg border border-red-200/60 bg-red-50/50 dark:border-red-800/40 dark:bg-red-950/30 p-3 transition-smooth">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/60">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">
                Breached Today
              </p>
              <Badge className="badge-bounce badge-soft mt-0.5 h-5 bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/60 dark:text-red-300">
                3 breaches
              </Badge>
            </div>
          </div>
        </div>

        {/* SLA by Category Chart */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            SLA by Category
          </h3>
          <ChartContainer
            config={slaCategoryChartConfig}
            className="h-[160px] w-full"
          >
            <BarChart
              data={slaCategoryData}
              layout="vertical"
              margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={[80, 100]}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 10 }}
                width={120}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="sla" radius={[0, 4, 4, 0]} barSize={18}>
                {slaCategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getSLABarColor(entry.sla)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {/* At-Risk Shipments Table */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            At-Risk Shipments
          </h3>
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_80px_100px_1fr] items-center gap-2 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <span>Invoice</span>
              <span>Type</span>
              <span>Deadline</span>
              <span>SLA Progress</span>
            </div>

            {/* Table Rows */}
            {atRiskShipments.map((shipment) => (
              <div
                key={shipment.invoice}
                className="grid grid-cols-[1fr_80px_100px_1fr] items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-2 py-2.5 transition-smooth hover:bg-muted/40"
              >
                <span className="text-xs font-mono font-medium">
                  {shipment.invoice}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "badge-soft h-5 justify-center text-[10px] font-medium border-0",
                    shipment.type === "Inbound"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      : "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                  )}
                >
                  {shipment.type}
                </Badge>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    shipment.slaDeadline.startsWith("Overdue")
                      ? "text-red-600 dark:text-red-400"
                      : "text-amber-600 dark:text-amber-400"
                  )}
                >
                  {shipment.slaDeadline}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      getProgressTrackColor(shipment.progress)
                    )}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        getProgressColor(shipment.progress)
                      )}
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "w-8 text-right text-[10px] font-semibold tabular-nums",
                      shipment.progress < 70
                        ? "text-emerald-600 dark:text-emerald-400"
                        : shipment.progress <= 90
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {shipment.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
