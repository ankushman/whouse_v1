"use client"

import { useMemo, useState } from "react"
import { transportVehicles } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Truck,
  MapPin,
  Clock,
  Navigation,
  Fuel,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  PackageCheck,
  Timer,
  BarChart3,
  TrendingDown,
  Route,
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

  const delayedVehicles = transportVehicles.filter((v) => v.status === "delayed")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transportation"
        description="Monitor fleet, routes and delivery performance"
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Navigation className="h-3.5 w-3.5" /> Track All
          </Button>
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

      <Card className="rounded-xl border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Registration</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Driver</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Route</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Location</TableHead>
                  <TableHead className="text-xs">Deliveries</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((vehicle) => {
                  const deliveryPct = vehicle.deliveriesTotal > 0
                    ? Math.round((vehicle.deliveriesCompleted / vehicle.deliveriesTotal) * 100)
                    : 0
                  const TypeIcon = typeIcons[vehicle.type] || Truck

                  return (
                    <TableRow key={vehicle.id}>
                      <TableCell className="text-xs font-medium">{vehicle.registration}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1 text-[10px] rounded-full">
                          <TypeIcon className="h-2.5 w-2.5" />
                          {vehicle.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs hidden md:table-cell">{vehicle.driver}</TableCell>
                      <TableCell className="text-xs hidden lg:table-cell">{vehicle.route}</TableCell>
                      <TableCell>
                        <StatusBadge status={vehicle.status} variant={statusVariant[vehicle.status] || "gray"} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{vehicle.currentLocation}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={deliveryPct} className="h-1.5 w-16" />
                          <span className="text-[10px] text-muted-foreground">{vehicle.deliveriesCompleted}/{vehicle.deliveriesTotal}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{vehicle.eta}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
