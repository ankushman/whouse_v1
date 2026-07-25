"use client"

import { useState, useMemo, useCallback } from "react"
import { inboundShipments, warehouses } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { DataTable, type Column, type BatchAction } from "@/components/shared/data-table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  PackageSearch,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Filter,
  Globe,
  Home,
  Download,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  "Vehicle Reported",
  "Dock Allocated",
  "Unloading",
  "Inspection",
  "Physical Count",
  "GRN",
  "Staging",
  "Put Away",
]

const statusVariant: Record<string, "green" | "amber" | "red" | "blue" | "gray"> = {
  "In Progress": "blue",
  "Completed": "green",
  "Delayed": "red",
  "Pending": "gray",
  "On Hold": "amber",
}

const EXPORT_COLUMNS = ["Invoice", "Supplier", "Type", "Warehouse", "Status", "SLA %"]

type InboundRow = (typeof inboundShipments)[number]

export function InboundView() {
  const [typeFilter, setTypeFilter] = useState("all")
  const [warehouseFilter, setWarehouseFilter] = useState("all")

  const filtered = useMemo(() => {
    return inboundShipments.filter((s) => {
      if (typeFilter !== "all" && s.type.toLowerCase() !== typeFilter) return false
      if (warehouseFilter !== "all" && !s.warehouse.includes(warehouseFilter)) return false
      return true
    })
  }, [typeFilter, warehouseFilter])

  const summary = useMemo(() => ({
    total: inboundShipments.length,
    inProgress: inboundShipments.filter((s) => s.status === "In Progress").length,
    completed: inboundShipments.filter((s) => s.status === "Completed").length,
    delayed: inboundShipments.filter((s) => s.status === "Delayed").length,
  }), [])

  const handleExportCSV = useCallback(() => {
    const data = filtered.map((s) => ({
      Invoice: s.invoice,
      Supplier: s.supplier,
      Type: s.type,
      Warehouse: s.warehouse,
      Status: s.status,
      "SLA %": `${s.slaProgress}%`,
    }))
    exportToCSV(data, "inbound-shipments", EXPORT_COLUMNS)
  }, [filtered])

  const columns: Column<InboundRow>[] = [
    {
      key: "invoice",
      header: "Invoice",
      sortable: true,
      className: "w-[120px]",
      render: (value) => (
        <span className="font-mono text-xs font-medium">{value as string}</span>
      ),
    },
    {
      key: "supplier",
      header: "Supplier",
      sortable: true,
      render: (value) => <span className="text-xs">{value as string}</span>,
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      className: "w-[100px]",
      render: (value) => (
        <Badge variant="outline" className="gap-1 text-[10px] rounded-full">
          {(value as string) === "Domestic" ? <Home className="h-2.5 w-2.5" /> : <Globe className="h-2.5 w-2.5" />}
          {value as string}
        </Badge>
      ),
    },
    {
      key: "warehouse",
      header: "Warehouse",
      sortable: true,
      className: "w-[90px] hidden lg:table-cell",
    },
    {
      key: "slaProgress",
      header: "SLA",
      sortable: true,
      className: "w-[100px]",
      render: (value) => {
        const pct = value as number
        const color = pct > 80 ? "text-emerald-600 dark:text-emerald-400" : pct > 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
        return (
          <div className="flex items-center gap-1.5">
            <Progress value={pct} className="h-1.5 w-12" />
            <span className={cn("text-[10px] font-medium tabular-nums", color)}>{pct}%</span>
          </div>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      className: "w-[110px]",
      render: (value) => (
        <StatusBadge status={value as string} variant={statusVariant[(value as string)] || "gray"} />
      ),
    },
  ]

  const batchActions: BatchAction<InboundRow>[] = [
    {
      label: "Export Selected",
      icon: Download,
      onClick: (rows) => {
        const data = rows.map((s) => ({
          Invoice: s.invoice,
          Supplier: s.supplier,
          Type: s.type,
          Warehouse: s.warehouse,
          Status: s.status,
          "SLA %": `${s.slaProgress}%`,
        }))
        exportToCSV(data, "inbound-selected", EXPORT_COLUMNS)
      },
    },
    {
      label: "View Details",
      icon: Eye,
      onClick: (rows) => {
        // Detail view — ready for API integration
      },
    },
  ]

  const expandableRowRender = useCallback((row: InboundRow) => {
    const currentStep = row.timeline.find((s) => s.status === "in-progress")
    const slaColor = row.slaProgress > 80 ? "text-emerald-600 dark:text-emerald-400" : row.slaProgress > 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipment Timeline</h4>
          <div className="space-y-2">
            {row.timeline.map((step) => (
              <div key={step.step} className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  step.status === "completed" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
                  step.status === "in-progress" && "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
                  step.status === "pending" && "bg-muted text-muted-foreground"
                )}>
                  {step.status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : step.status === "in-progress" ? <Clock className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{step.label}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    {step.duration && <span>{step.duration}</span>}
                    {step.user && <span className="flex items-center gap-1">{step.user}</span>}
                    <span>{step.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipment Details</h4>
            <div className="rounded-lg border bg-card p-3 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Invoice</span><span className="font-medium">{row.invoice}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Supplier</span><span className="font-medium">{row.supplier}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{row.type}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Warehouse</span><span className="font-medium">{row.warehouse}</span></div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Step</span>
                <span className="font-medium">{currentStep?.label || "—"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">SLA Progress</span>
                <span className={cn("font-medium tabular-nums", slaColor)}>{row.slaProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbound Operations"
        description="Track goods receipt and dock-to-stock operations"
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
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 stagger-children">
        {[
          { label: "Total Shipments", value: summary.total, icon: PackageSearch, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "In Progress", value: summary.inProgress, icon: Clock, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
          { label: "Completed", value: summary.completed, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
          { label: "Delayed", value: summary.delayed, icon: AlertCircle, color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" },
        ].map((item) => (
          <Card key={item.label} className="card-depth hover-scale-sm rounded-xl border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", item.color)}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold text-number">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar flex flex-wrap items-center gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="domestic">Domestic</SelectItem>
            <SelectItem value="imported">Imported</SelectItem>
          </SelectContent>
        </Select>
        <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
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

      {/* Inbound Pipeline DataTable with Expandable Timeline */}
      <DataTable<InboundRow>
        data={filtered}
        columns={columns}
        searchableColumns={["invoice", "supplier", "warehouse"]}
        searchPlaceholder="Search invoice, supplier, warehouse..."
        selectable
        batchActions={batchActions}
        expandableRowRender={expandableRowRender}
        getRowKey={(row) => row.id}
        showColumnToggle
        pageSize={8}
        showCount
      />
    </div>
  )
}
