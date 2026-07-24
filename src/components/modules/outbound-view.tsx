"use client"

import { useState, useMemo, useCallback } from "react"
import { outboundShipments, warehouses } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Truck,
  Clock,
  CheckCircle2,
  Filter,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

const OUTBOUND_STEPS = ["Pending", "Picking", "Packing", "Ready", "Dispatched", "Delivered"]

const statusVariant: Record<string, "green" | "amber" | "red" | "blue" | "gray"> = {
  Pending: "gray",
  Picking: "blue",
  Packing: "amber",
  Ready: "blue",
  Dispatched: "blue",
  Delivered: "green",
}

const textColorMap: Record<string, string> = {
  Total: "text-blue-600 dark:text-blue-400",
  Pending: "text-slate-600 dark:text-slate-400",
  Picking: "text-blue-600 dark:text-blue-400",
  Packing: "text-amber-600 dark:text-amber-400",
  Ready: "text-blue-600 dark:text-blue-400",
  Dispatched: "text-indigo-600 dark:text-indigo-400",
  Delivered: "text-emerald-600 dark:text-emerald-400",
}

const stepIndexMap: Record<string, number> = {
  Pending: 0, Picking: 1, Packing: 2, Ready: 3, Dispatched: 4, Delivered: 5,
}

const EXPORT_COLUMNS = ["Invoice", "Customer", "Pick Type", "Picker", "Packer", "Vehicle", "Status", "Dispatch Time"]

export function OutboundView() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [warehouseFilter, setWarehouseFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    return outboundShipments.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false
      if (warehouseFilter !== "all" && !s.warehouse.includes(warehouseFilter)) return false
      if (searchQuery && !s.invoice.toLowerCase().includes(searchQuery.toLowerCase()) && !s.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [statusFilter, warehouseFilter, searchQuery])

  const summary = useMemo(() => ({
    total: outboundShipments.length,
    pending: outboundShipments.filter((s) => s.status === "Pending").length,
    picking: outboundShipments.filter((s) => s.status === "Picking").length,
    packing: outboundShipments.filter((s) => s.status === "Packing").length,
    ready: outboundShipments.filter((s) => s.status === "Ready").length,
    dispatched: outboundShipments.filter((s) => s.status === "Dispatched").length,
    delivered: outboundShipments.filter((s) => s.status === "Delivered").length,
  }), [])

  const handleExportCSV = useCallback(() => {
    const data = filtered.map((s) => ({
      Invoice: s.invoice,
      Customer: s.customer,
      "Pick Type": s.pickingType,
      Picker: s.picker,
      Packer: s.packer,
      Vehicle: s.vehicle,
      Status: s.status,
      "Dispatch Time": s.dispatchTime
        ? new Date(s.dispatchTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
        : "—",
    }))
    exportToCSV(data, "outbound-shipments", EXPORT_COLUMNS)
  }, [filtered])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outbound Operations"
        description="Manage dispatch operations and delivery tracking"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            <ExportButton onExportCSV={handleExportCSV} />
          </>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-7 stagger-children">
        {[
          { label: "Total", value: summary.total, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Pending", value: summary.pending, color: "bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400" },
          { label: "Picking", value: summary.picking, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Packing", value: summary.packing, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
          { label: "Ready", value: summary.ready, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Dispatched", value: summary.dispatched, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400" },
          { label: "Delivered", value: summary.delivered, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
        ].map((item) => (
          <Card key={item.label} className="rounded-xl border-border/60 shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className={cn("mt-1 text-xl font-bold", textColorMap[item.label])}>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all" className="text-xs h-7 px-3">All ({summary.total})</TabsTrigger>
          {OUTBOUND_STEPS.map((step) => {
            const count = outboundShipments.filter((s) => s.status === step).length
            return (
              <TabsTrigger key={step} value={step} className="text-xs h-7 px-3">
                {step} ({count})
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search invoice or customer..."
            className="h-8 w-[220px] pl-8 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
          <SelectTrigger className="w-[200px] h-8 text-xs">
            <SelectValue placeholder="Warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses.map((wh) => (
              <SelectItem key={wh.id} value={wh.city}>{wh.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-muted-foreground">
          {filtered.length} shipment{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Shipments Table */}
      <Card className="rounded-xl border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Invoice</TableHead>
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Pick Type</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Picker</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Packer</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Vehicle</TableHead>
                  <TableHead className="text-xs min-w-[250px]">Progress</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Dispatch</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((shipment) => {
                  const currentIdx = stepIndexMap[shipment.status] ?? 0
                  return (
                    <TableRow key={shipment.id}>
                      <TableCell className="text-xs font-medium">{shipment.invoice}</TableCell>
                      <TableCell className="text-xs">{shipment.customer}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="text-[10px] rounded-full">{shipment.pickingType}</Badge>
                      </TableCell>
                      <TableCell className="text-xs hidden md:table-cell">{shipment.picker}</TableCell>
                      <TableCell className="text-xs hidden md:table-cell">{shipment.packer}</TableCell>
                      <TableCell className="text-xs hidden lg:table-cell">{shipment.vehicle}</TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          {OUTBOUND_STEPS.map((step, idx) => {
                            const isDone = idx < currentIdx
                            const isCurrent = idx === currentIdx
                            const isDelivered = step === "Delivered" && shipment.status === "Delivered"
                            return (
                              <div key={step} className="flex items-center" title={step}>
                                <div className={cn(
                                  "flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-medium",
                                  (isDone || isDelivered) && "bg-emerald-500 text-white",
                                  isCurrent && !isDelivered && "bg-blue-600 text-white ring-2 ring-blue-200 dark:ring-blue-800",
                                  !isDone && !isCurrent && "bg-muted text-muted-foreground"
                                )}>
                                  {(isDone || isDelivered) ? <CheckCircle2 className="h-2.5 w-2.5" /> : idx + 1}
                                </div>
                                {idx < OUTBOUND_STEPS.length - 1 && (
                                  <div className={cn("h-0.5 w-2 md:w-4", idx < currentIdx ? "bg-emerald-500" : "bg-muted")} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                        {shipment.dispatchTime ? new Date(shipment.dispatchTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={shipment.status} variant={statusVariant[shipment.status] || "gray"} />
                      </TableCell>
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
