"use client"

import { useState, useMemo } from "react"
import { inboundShipments, warehouses } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PackageSearch,
  Truck,
  Clock,
  User,
  CheckCircle2,
  Circle,
  AlertCircle,
  Filter,
  Download,
  ChevronRight,
  ChevronDown,
  Globe,
  Home,
  Search,
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

export function InboundView() {
  const [typeFilter, setTypeFilter] = useState("all")
  const [warehouseFilter, setWarehouseFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return inboundShipments.filter((s) => {
      if (typeFilter !== "all" && s.type.toLowerCase() !== typeFilter) return false
      if (warehouseFilter !== "all" && !s.warehouse.includes(warehouseFilter)) return false
      if (searchQuery && !s.invoice.toLowerCase().includes(searchQuery.toLowerCase()) && !s.supplier.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [typeFilter, warehouseFilter, searchQuery])

  const summary = useMemo(() => ({
    total: inboundShipments.length,
    inProgress: inboundShipments.filter((s) => s.status === "In Progress").length,
    completed: inboundShipments.filter((s) => s.status === "Completed").length,
    delayed: inboundShipments.filter((s) => s.status === "Delayed").length,
  }), [])

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
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
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
          <Card key={item.label} className="rounded-xl border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", item.color)}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search invoice or supplier..."
            className="h-8 w-[220px] pl-8 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
        <div className="ml-auto text-xs text-muted-foreground">
          {filtered.length} shipment{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Inbound Pipeline */}
      <Card className="rounded-xl border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Inbound Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="text-xs">Invoice</TableHead>
                  <TableHead className="text-xs">Supplier</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Warehouse</TableHead>
                  <TableHead className="text-xs min-w-[300px]">Process Progress</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Duration</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">User</TableHead>
                  <TableHead className="text-xs">SLA</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((shipment) => {
                  const isExpanded = expandedRow === shipment.id
                  const currentStep = shipment.timeline.find((s) => s.status === "in-progress")
                  const slaColor = shipment.slaProgress > 80 ? "text-emerald-600 dark:text-emerald-400" : shipment.slaProgress > 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"

                  return (
                    <>
                      <TableRow
                        key={shipment.id}
                        className="cursor-pointer"
                        onClick={() => setExpandedRow(isExpanded ? null : shipment.id)}
                      >
                        <TableCell className="p-2">
                          <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                        </TableCell>
                        <TableCell className="text-xs font-medium">{shipment.invoice}</TableCell>
                        <TableCell className="text-xs">{shipment.supplier}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1 text-[10px] rounded-full">
                            {shipment.type === "Domestic" ? <Home className="h-2.5 w-2.5" /> : <Globe className="h-2.5 w-2.5" />}
                            {shipment.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs hidden lg:table-cell">{shipment.warehouse}</TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1">
                            {STEPS.map((step, idx) => {
                              const stepData = shipment.timeline.find((s) => s.label === step)
                              const isDone = stepData?.status === "completed"
                              const isCurrent = stepData?.status === "in-progress"
                              return (
                                <div key={step} className="flex items-center" title={step}>
                                  <div className={cn(
                                    "flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-medium transition-colors",
                                    isDone && "bg-emerald-500 text-white",
                                    isCurrent && "bg-blue-600 text-white ring-2 ring-blue-200 dark:ring-blue-800",
                                    !isDone && !isCurrent && "bg-muted text-muted-foreground"
                                  )}>
                                    {isDone ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                                  </div>
                                  {idx < STEPS.length - 1 && (
                                    <div className={cn("h-0.5 w-3 md:w-6", isDone ? "bg-emerald-500" : "bg-muted")} />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs hidden md:table-cell">{currentStep?.duration || "—"}</TableCell>
                        <TableCell className="text-xs hidden md:table-cell">{currentStep?.user || "—"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Progress value={shipment.slaProgress} className="h-1.5 w-12" />
                            <span className={cn("text-[10px] font-medium", slaColor)}>{shipment.slaProgress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={shipment.status} variant={statusVariant[shipment.status] || "gray"} />
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow key={`${shipment.id}-detail`} className="bg-muted/30">
                          <TableCell colSpan={10} className="p-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipment Timeline</h4>
                                <div className="space-y-2">
                                  {shipment.timeline.map((step) => (
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
                                          {step.user && <span>• {step.user}</span>}
                                          <span>• {step.timestamp}</span>
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
                                    <div className="flex justify-between"><span className="text-muted-foreground">Invoice</span><span className="font-medium">{shipment.invoice}</span></div>
                                    <Separator />
                                    <div className="flex justify-between"><span className="text-muted-foreground">Supplier</span><span className="font-medium">{shipment.supplier}</span></div>
                                    <Separator />
                                    <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{shipment.type}</span></div>
                                    <Separator />
                                    <div className="flex justify-between"><span className="text-muted-foreground">Warehouse</span><span className="font-medium">{shipment.warehouse}</span></div>
                                    <Separator />
                                    <div className="flex justify-between"><span className="text-muted-foreground">SLA Progress</span><span className={cn("font-medium", slaColor)}>{shipment.slaProgress}%</span></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
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
