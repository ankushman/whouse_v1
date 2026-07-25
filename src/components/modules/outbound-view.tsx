"use client"

import { useState, useMemo, useCallback } from "react"
import { outboundShipments, warehouses } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { DataTable, type Column, type BatchAction } from "@/components/shared/data-table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Filter,
  CheckCircle2,
  Download,
  RefreshCw,
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

type OutboundRow = (typeof outboundShipments)[number]

export function OutboundView() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [warehouseFilter, setWarehouseFilter] = useState("all")

  const filtered = useMemo(() => {
    return outboundShipments.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false
      if (warehouseFilter !== "all" && !s.warehouse.includes(warehouseFilter)) return false
      return true
    })
  }, [statusFilter, warehouseFilter])

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
        : "\u2014",
    }))
    exportToCSV(data, "outbound-shipments", EXPORT_COLUMNS)
  }, [filtered])

  const columns: Column<OutboundRow>[] = useMemo(() => [
    {
      key: "invoice",
      header: "Invoice",
      sortable: true,
      render: (value) => (
        <span className="font-mono font-medium">{value as string}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
    },
    {
      key: "pickingType",
      header: "Pick Type",
      render: (value) => (
        <Badge variant="outline" className="rounded-full text-[10px]">{value as string}</Badge>
      ),
    },
    {
      key: "picker",
      header: "Picker",
    },
    {
      key: "packer",
      header: "Packer",
    },
    {
      key: "vehicle",
      header: "Vehicle",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (value) => (
        <StatusBadge status={value as string} variant={statusVariant[value as string] || "gray"} />
      ),
    },
    {
      key: "progress",
      header: "Progress",
      render: (_value, row) => {
        const currentIdx = stepIndexMap[row.status] ?? 0
        return (
          <div className="flex items-center gap-1">
            {OUTBOUND_STEPS.map((step, idx) => {
              const isDone = idx < currentIdx
              const isCurrent = idx === currentIdx
              const isDelivered = step === "Delivered" && row.status === "Delivered"
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
        )
      },
    },
    {
      key: "dispatchTime",
      header: "Dispatch",
      render: (value) => (
        <span className="text-muted-foreground">
          {value
            ? new Date(value as string).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
            : "\u2014"}
        </span>
      ),
    },
  ], [])

  const batchActions: BatchAction<OutboundRow>[] = useMemo(() => [
    {
      label: "Export Selected",
      icon: Download,
      onClick: (rows) => {
        const data = rows.map((s) => ({
          Invoice: s.invoice,
          Customer: s.customer,
          "Pick Type": s.pickingType,
          Picker: s.picker,
          Packer: s.packer,
          Vehicle: s.vehicle,
          Status: s.status,
          "Dispatch Time": s.dispatchTime
            ? new Date(s.dispatchTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
            : "\u2014",
        }))
        exportToCSV(data, "outbound-selected", EXPORT_COLUMNS)
      },
    },
    {
      label: "Update Status",
      icon: RefreshCw,
      onClick: (rows) => {
        // Batch update status — ready for API integration
      },
    },
  ], [])

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
          <Card key={item.label} className="card-depth rounded-xl border-border/60 shadow-sm">
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

      {/* Filters - only warehouse select, search handled by DataTable */}
      <div className="filter-bar flex flex-wrap items-center gap-3">
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
      </div>

      {/* Shipments DataTable */}
      <DataTable<OutboundRow>
        data={filtered}
        columns={columns}
        searchableColumns={["invoice", "customer"]}
        searchPlaceholder="Search shipments..."
        selectable
        batchActions={batchActions}
        pageSize={8}
        showCount
      />
    </div>
  )
}