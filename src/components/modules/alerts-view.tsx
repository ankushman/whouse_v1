"use client"

import { useState, useMemo, useCallback } from "react"
import { alerts } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { AlertsDetailDrawer, type AlertDetail } from "@/components/shared/alerts-detail-drawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Bell,
  CheckCircle2,
  Clock,
  Shield,
  TrendingDown,
  Package,
  Truck,
  Wrench,
  BarChart3,
  ChevronRight,
} from "lucide-react"
import { useToastHelper } from "@/hooks"
import { cn } from "@/lib/utils"

const severityConfig = {
  critical: { icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/50", border: "border-l-red-500", badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  warning: { icon: AlertCircle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-l-amber-500", badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  info: { icon: Info, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50", border: "border-l-blue-500", badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
}

const typeIcons: Record<string, typeof Bell> = {
  sla: Shield,
  productivity: TrendingDown,
  inventory: Package,
  dispatch: Truck,
  equipment: Wrench,
  capacity: BarChart3,
}

export function AlertsView() {
  const [severityFilter, setSeverityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set())
  const [drawerAlert, setDrawerAlert] = useState<AlertDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toast = useToastHelper()

  const openDrawer = useCallback((alert: typeof alerts[number]) => {
    setDrawerAlert(alert as AlertDetail)
    setDrawerOpen(true)
  }, [])

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== "all" && a.severity !== severityFilter) return false
      if (typeFilter !== "all" && a.type !== typeFilter) return false
      return true
    })
  }, [severityFilter, typeFilter])

  const summary = useMemo(() => ({
    critical: alerts.filter((a) => a.severity === "critical" && !acknowledgedAlerts.has(a.id)).length,
    warning: alerts.filter((a) => a.severity === "warning" && !acknowledgedAlerts.has(a.id)).length,
    info: alerts.filter((a) => a.severity === "info" && !acknowledgedAlerts.has(a.id)).length,
    acknowledged: acknowledgedAlerts.size,
  }), [acknowledgedAlerts])

  const acknowledge = (id: string) => {
    setAcknowledgedAlerts((prev) => new Set(prev).add(id))
    const foundAlert = alerts.find((a) => a.id === id)
    if (foundAlert) {
      toast.success("Alert acknowledged", `${foundAlert.title} at ${foundAlert.warehouse}`, {
        duration: 3000,
      })
    }
  }

  const handleExportCSV = useCallback(() => {
    const data = alerts.map((a) => ({
      ID: a.id,
      Type: a.type,
      Severity: a.severity,
      Title: a.title,
      Warehouse: a.warehouse,
      Timestamp: a.timestamp,
      Acknowledged: acknowledgedAlerts.has(a.id) ? "Yes" : "No",
    }))
    exportToCSV(data, "alerts-data", ["ID", "Type", "Severity", "Title", "Warehouse", "Timestamp", "Acknowledged"])
  }, [acknowledgedAlerts])

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alert Center"
        description="Monitor and manage operational alerts"
        actions={
          <ExportButton onExportCSV={handleExportCSV} />
        }
      />

      {/* Summary */}
      <div className="mobile-scroll-hint -mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-x-visible md:px-0">
        <div className="grid w-min min-w-full grid-cols-2 gap-3 md:w-full md:min-w-0 md:grid-cols-4 stagger-children">
        {[
          { label: "Critical", value: summary.critical, icon: AlertTriangle, color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400", glow: "" },
          { label: "Warnings", value: summary.warning, icon: AlertCircle, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400", glow: "hover-glow-amber" },
          { label: "Info", value: summary.info, icon: Info, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400", glow: "hover-glow-blue" },
          { label: "Acknowledged", value: summary.acknowledged, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400", glow: "" },
        ].map((item) => (
          <Card key={item.label} className={cn("w-40 shrink-0 md:w-auto md:shrink card-depth rounded-xl border-border/60 shadow-sm hover-scale-sm", item.glow)}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", item.color)}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold text-number">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar flex flex-wrap items-center gap-3">
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sla">SLA</SelectItem>
            <SelectItem value="productivity">Productivity</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="dispatch">Dispatch</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="capacity">Capacity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        {filtered.map((alert) => {
          const config = severityConfig[alert.severity]
          const SevIcon = config.icon
          const TypeIcon = typeIcons[alert.type] || Bell
          const isAcknowledged = acknowledgedAlerts.has(alert.id)

          return (
            <Card
              key={alert.id}
              role="button"
              tabIndex={0}
              onClick={() => openDrawer(alert)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDrawer(alert) } }}
              className={cn(
                "rounded-xl border shadow-sm transition-all hover:bg-muted/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                config.border,
                isAcknowledged && "opacity-60"
              )}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                  <SevIcon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <Badge className={cn("badge-dot text-[9px] rounded-full px-2 py-0.5", config.badge, alert.severity === "critical" && "badge-glow-critical", alert.severity === "warning" && "badge-glow-warning")}>{alert.severity}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{alert.message}</p>
                      <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><TypeIcon className="h-3 w-3" />{alert.type}</span>
                        <span>{alert.warehouse}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTimestamp(alert.timestamp)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {!isAcknowledged && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px] gap-1"
                      onClick={() => acknowledge(alert.id)}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Acknowledge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="mt-3 text-sm font-medium">All clear!</p>
            <p className="text-xs text-muted-foreground">No alerts matching your filters.</p>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AlertsDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        alert={drawerAlert}
        onAcknowledge={(a) => {
          setAcknowledgedAlerts((prev) => new Set(prev).add(a.id))
        }}
        onEscalate={(a) => {
          toast.warning("Escalated", `${a.title} escalated to regional ops`, { duration: 3000 })
        }}
        onResolve={(a) => {
          setAcknowledgedAlerts((prev) => new Set(prev).add(a.id))
          toast.success("Resolved", `${a.title} marked as resolved`, { duration: 3000 })
        }}
      />
    </div>
  )
}
