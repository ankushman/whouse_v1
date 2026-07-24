"use client"

import { useMemo, useState, useCallback } from "react"
import { transportVehicles } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/shared/data-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Truck,
  MapPin,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  PackageCheck,
  Timer,
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusVariant: Record<string, "green" | "amber" | "red" | "blue" | "gray"> = {
  "in-transit": "blue",
  available: "green",
  maintenance: "amber",
  delayed: "red",
}

const typeIcons: Record<string, typeof Truck> = {
  Truck: Truck,
  Container: PackageCheck,
  Flatbed: Truck,
}

export function TransportationView() {
  const [view, setView] = useState("all")

  const filtered = useMemo(() => {
    if (view === "all") return transportVehicles
    return transportVehicles.filter((v) => v.status === view)
  }, [view])

  const summary = useMemo(() => ({
    total: transportVehicles.length,
    inTransit: transportVehicles.filter((v) => v.status === "in-transit").length,
    available: transportVehicles.filter((v) => v.status === "available").length,
    maintenance: transportVehicles.filter((v) => v.status === "maintenance").length,
    delayed: transportVehicles.filter((v) => v.status === "delayed").length,
  }), [])

  const totalDeliveries = transportVehicles.reduce((a, v) => a + v.deliveriesTotal, 0)
  const completedDeliveries = transportVehicles.reduce((a, v) => a + v.deliveriesCompleted, 0)
  const otif = totalDeliveries > 0 ? ((completedDeliveries / totalDeliveries) * 100).toFixed(1) : "0"

  const handleExportCSV = useCallback(() => {
    const data = transportVehicles.map((v) => ({
      ID: v.id,
      Name: v.name,
      Type: v.type,
      "Reg No.": v.regNo,
      Status: v.status,
      Driver: v.driver,
      Route: v.route,
      "OTIF (%)": v.deliveriesTotal > 0 ? ((v.deliveriesCompleted / v.deliveriesTotal) * 100).toFixed(1) : "0",
    }))
    exportToCSV(data, "transport-fleet")
  }, [])

  const delayedVehicles = transportVehicles.filter((v) => v.status === "delayed")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transportation"
        description="Monitor fleet, routes and delivery performance"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Navigation className="h-3.5 w-3.5" /> Track All
            </Button>
            <ExportButton onExportCSV={handleExportCSV} />
          </>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 stagger-children">
        {[
          { label: "Total Vehicles", value: summary.total, icon: Truck, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "In Transit", value: summary.inTransit, icon: MapPin, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Available", value: summary.available, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
          { label: "Delayed", value: summary.delayed, icon: AlertTriangle, color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" },
          { label: "In Maintenance", value: summary.maintenance, icon: Wrench, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
          { label: "OTIF Rate", value: `${otif}%`, icon: Timer, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
        ].map((item) => (
          <Card key={item.label} className="rounded-xl border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", item.color)}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delayed Deliveries Alert */}
      {delayedVehicles.length > 0 && (
        <Card className="rounded-xl border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300">Delayed Deliveries</CardTitle>
              <Badge variant="destructive" className="text-[10px]">{delayedVehicles.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {delayedVehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg border border-red-200 bg-white p-3 dark:border-red-900 dark:bg-card">
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-xs font-medium">{v.registration}</p>
                      <p className="text-[10px] text-muted-foreground">{v.route} • {v.driver}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400">ETA: {v.eta}</p>
                    <p className="text-[10px] text-muted-foreground">{v.currentLocation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fleet Table */}
      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="all" className="text-xs">All ({summary.total})</TabsTrigger>
          <TabsTrigger value="in-transit" className="text-xs">In Transit ({summary.inTransit})</TabsTrigger>
          <TabsTrigger value="available" className="text-xs">Available ({summary.available})</TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs">Maintenance ({summary.maintenance})</TabsTrigger>
          <TabsTrigger value="delayed" className="text-xs">Delayed ({summary.delayed})</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable
        data={filtered as any[]}
        columns={[
          { key: "registration", header: "Registration", sortable: true, className: "text-xs font-medium" },
          { key: "type", header: "Type", sortable: true, render: (val: string) => {
            const TypeIcon = typeIcons[val] || Truck
            return <Badge variant="outline" className="gap-1 text-[10px] rounded-full"><TypeIcon className="h-2.5 w-2.5" />{val}</Badge>
          }},
          { key: "driver", header: "Driver", sortable: true },
          { key: "route", header: "Route", sortable: true },
          { key: "status", header: "Status", sortable: true, render: (val: string) => <StatusBadge status={val} variant={(statusVariant[val] || "gray") as any} /> },
          { key: "currentLocation", header: "Location" },
          { key: "deliveries", header: "Deliveries", render: (_: any, row: any) => {
            const pct = row.deliveriesTotal > 0 ? Math.round((row.deliveriesCompleted / row.deliveriesTotal) * 100) : 0
            return <div className="flex items-center gap-2"><Progress value={pct} className="h-1.5 w-16" /><span className="text-[10px] text-muted-foreground">{row.deliveriesCompleted}/{row.deliveriesTotal}</span></div>
          }},
          { key: "eta", header: "ETA" },
        ] as Column<any>[]}
        pageSize={8}
      />
    </div>
  )
}
