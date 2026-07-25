"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { warehouses } from "@/data/mock-data"
import { HealthScoreRing } from "@/components/shared/health-score-ring"
import { cn } from "@/lib/utils"
import {
  Warehouse,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ThermometerSun,
  BarChart3,
} from "lucide-react"

// ---- Types ----

interface WarehouseHealth {
  id: string
  name: string
  city: string
  healthScore: number
  occupancy: number
  inboundQueue: number
  outboundQueue: number
  dockUtilization: number
  equipmentAlerts: number
  slaBreachRisk: number
  pendingGRN: number
  avgProcessingTime: number
  status: "healthy" | "warning" | "critical"
}

// ---- Mock Data ----

const warehouseHealthData: WarehouseHealth[] = [
  {
    id: "1",
    name: "Mumbai Central Hub",
    city: "Mumbai",
    healthScore: 94,
    occupancy: 78,
    inboundQueue: 12,
    outboundQueue: 8,
    dockUtilization: 82,
    equipmentAlerts: 1,
    slaBreachRisk: 2,
    pendingGRN: 8,
    avgProcessingTime: 2.8,
    status: "healthy",
  },
  {
    id: "2",
    name: "Delhi NCR Warehouse",
    city: "Delhi NCR",
    healthScore: 71,
    occupancy: 92,
    inboundQueue: 24,
    outboundQueue: 15,
    dockUtilization: 95,
    equipmentAlerts: 4,
    slaBreachRisk: 18,
    pendingGRN: 24,
    avgProcessingTime: 4.1,
    status: "warning",
  },
  {
    id: "3",
    name: "Chennai Distribution Center",
    city: "Chennai",
    healthScore: 88,
    occupancy: 71,
    inboundQueue: 9,
    outboundQueue: 6,
    dockUtilization: 74,
    equipmentAlerts: 2,
    slaBreachRisk: 5,
    pendingGRN: 5,
    avgProcessingTime: 3.0,
    status: "healthy",
  },
  {
    id: "4",
    name: "Bangalore South Facility",
    city: "Bangalore",
    healthScore: 96,
    occupancy: 65,
    inboundQueue: 6,
    outboundQueue: 4,
    dockUtilization: 68,
    equipmentAlerts: 0,
    slaBreachRisk: 1,
    pendingGRN: 3,
    avgProcessingTime: 2.2,
    status: "healthy",
  },
  {
    id: "5",
    name: "Pune Warehouse",
    city: "Pune",
    healthScore: 82,
    occupancy: 85,
    inboundQueue: 14,
    outboundQueue: 10,
    dockUtilization: 80,
    equipmentAlerts: 2,
    slaBreachRisk: 8,
    pendingGRN: 12,
    avgProcessingTime: 3.4,
    status: "healthy",
  },
  {
    id: "6",
    name: "Kolkata Logistics Hub",
    city: "Kolkata",
    healthScore: 45,
    occupancy: 96,
    inboundQueue: 32,
    outboundQueue: 22,
    dockUtilization: 100,
    equipmentAlerts: 7,
    slaBreachRisk: 35,
    pendingGRN: 32,
    avgProcessingTime: 5.8,
    status: "critical",
  },
]

const statusConfig = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    textClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-200 dark:border-emerald-800/60",
    dotClass: "bg-emerald-500",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    bgClass: "bg-amber-50 dark:bg-amber-950/40",
    textClass: "text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-200 dark:border-amber-800/60",
    dotClass: "bg-amber-500",
  },
  critical: {
    label: "Critical",
    icon: XCircle,
    bgClass: "bg-red-50 dark:bg-red-950/40",
    textClass: "text-red-600 dark:text-red-400",
    borderClass: "border-red-200 dark:border-red-800/60",
    dotClass: "bg-red-500",
  },
}

function getTrendIcon(value: number, threshold: number) {
  if (value < threshold * 0.5) return <TrendingUp className="h-3 w-3 text-emerald-500" />
  if (value < threshold) return <Minus className="h-3 w-3 text-amber-500" />
  return <TrendingDown className="h-3 w-3 text-red-500" />
}

// ---- Component ----

export function WarehouseHealthMonitor() {
  const healthyCount = warehouseHealthData.filter((w) => w.status === "healthy").length
  const warningCount = warehouseHealthData.filter((w) => w.status === "warning").length
  const criticalCount = warehouseHealthData.filter((w) => w.status === "critical").length
  const avgHealth = Math.round(warehouseHealthData.reduce((s, w) => s + w.healthScore, 0) / warehouseHealthData.length)

  return (
    <Card className="card-depth chart-card card-accent-blue rounded-xl border border-t-2 border-border/60 depth-shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Warehouse Health Monitor</CardTitle>
              <p className="text-xs text-muted-foreground">Real-time operational health across all facilities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">{healthyCount} OK</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="flex h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">{warningCount} Warn</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="flex h-2 w-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">{criticalCount} Crit</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Average Health Score */}
        <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Network Average</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={avgHealth} className="h-2 w-24" />
            <span className={cn(
              "text-sm font-bold tabular-nums",
              avgHealth >= 80 ? "text-emerald-600 dark:text-emerald-400" :
              avgHealth >= 60 ? "text-amber-600 dark:text-amber-400" :
              "text-red-600 dark:text-red-400"
            )}>
              {avgHealth}%
            </span>
          </div>
        </div>

        {/* Warehouse Health Cards */}
        <div className="space-y-2">
          {warehouseHealthData.map((wh, index) => {
            const config = statusConfig[wh.status]
            const StatusIcon = config.icon

            return (
              <div
                key={wh.id}
                className={cn(
                  "rounded-lg border p-3 transition-all duration-300 hover:shadow-sm data-row-enter",
                  config.borderClass,
                  config.bgClass
                )}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Header Row */}
                <div className="flex items-center gap-3">
                  <HealthScoreRing score={wh.healthScore} size={48} strokeWidth={4} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold truncate">{wh.name}</h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "tag-chip text-[9px] gap-0.5 px-1.5 py-0 rounded-full",
                          config.bgClass,
                          config.textClass,
                          config.borderClass
                        )}
                      >
                        <StatusIcon className="h-2.5 w-2.5" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{wh.city}</p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="mt-3 grid grid-cols-4 gap-x-4 gap-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Warehouse className="h-2.5 w-2.5" />
                            Occupancy
                          </span>
                          <div className="flex items-center gap-0.5">
                            {getTrendIcon(wh.occupancy, 100)}
                            <span className="font-semibold tabular-nums">{wh.occupancy}%</span>
                          </div>
                        </div>
                        <Progress value={wh.occupancy} className="h-1" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      Current warehouse capacity utilization
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Activity className="h-2.5 w-2.5" />
                            Docks
                          </span>
                          <div className="flex items-center gap-0.5">
                            {getTrendIcon(wh.dockUtilization, 100)}
                            <span className="font-semibold tabular-nums">{wh.dockUtilization}%</span>
                          </div>
                        </div>
                        <Progress value={wh.dockUtilization} className="h-1" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      Dock utilization percentage
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <ThermometerSun className="h-2.5 w-2.5" />
                            SLA Risk
                          </span>
                          <span className={cn(
                            "font-semibold tabular-nums",
                            wh.slaBreachRisk < 5 ? "text-emerald-600" :
                            wh.slaBreachRisk < 15 ? "text-amber-600" : "text-red-600"
                          )}>
                            {wh.slaBreachRisk}%
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      Percentage of shipments at risk of SLA breach
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            Avg Time
                          </span>
                          <span className="font-semibold tabular-nums">{wh.avgProcessingTime}h</span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      Average dock-to-stock processing time in hours
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Bottom Stats */}
                <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border/30 pt-2">
                  <span className="flex items-center gap-1">
                    Inbound: <span className="font-semibold text-foreground tabular-nums">{wh.inboundQueue}</span>
                  </span>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-1">
                    Outbound: <span className="font-semibold text-foreground tabular-nums">{wh.outboundQueue}</span>
                  </span>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-1">
                    Pending GRN: <span className="font-semibold text-foreground tabular-nums">{wh.pendingGRN}</span>
                  </span>
                  {wh.equipmentAlerts > 0 && (
                    <>
                      <span className="text-border">|</span>
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                        Equipment Alerts: <span className="font-semibold tabular-nums">{wh.equipmentAlerts}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
