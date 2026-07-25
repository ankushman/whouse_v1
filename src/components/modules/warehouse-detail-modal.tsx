"use client"

import { useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  Activity,
  Building2,
  MapPin,
  Users,
  Package,
  Truck,
  Target,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Gauge,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Warehouse } from "@/data/mock-data"

// ── Props ──────────────────────────────────────────────────────────────────

interface WarehouseDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: Warehouse | null
}

// ── Status Helpers ──────────────────────────────────────────────────────────

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  green: { bg: "bg-emerald-100 dark:bg-emerald-950/50", text: "text-emerald-700 dark:text-emerald-300", label: "Healthy" },
  amber: { bg: "bg-amber-100 dark:bg-amber-950/50", text: "text-amber-700 dark:text-amber-300", label: "Warning" },
  red: { bg: "bg-red-100 dark:bg-red-950/50", text: "text-red-700 dark:text-red-300", label: "Critical" },
}

// ── Mock Data Generator ─────────────────────────────────────────────────────

function generateThroughputData(warehouse: Warehouse) {
  const baseInbound = Math.round(warehouse.todayOrders * 0.6)
  const baseOutbound = Math.round(warehouse.todayOrders * 0.4)
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    inbound: baseInbound + Math.floor(Math.random() * 30 - 15),
    outbound: baseOutbound + Math.floor(Math.random() * 20 - 10),
  }))
}

function generateRecentShipments(warehouse: Warehouse) {
  const types = ["Inbound", "Outbound"]
  const statuses = ["Delivered", "In Transit", "Processing", "Pending"]
  const suppliers = ["Bosch India", "Motherson Sumi", "Bharat Forge", "Uno Minda", "Mando India"]
  const destinations = ["Mahindra - Chennai", "Tata - Pune", "Maruti - Gurugram", "Hyundai - Chennai", "Kia - Pune"]

  return Array.from({ length: 5 }, (_, i) => {
    const isInbound = i % 2 === 0
    return {
      id: isInbound ? `IN-2024-${String(800 + i).padStart(4, "0")}` : `OB-2024-${String(300 + i).padStart(4, "0")}`,
      type: isInbound ? "Inbound" : "Outbound",
      description: isInbound
        ? `From ${suppliers[i % suppliers.length]}`
        : `To ${destinations[i % destinations.length]}`,
      status: statuses[i % statuses.length],
      time: `${(i + 1) * 45}m ago`,
    }
  })
}

const throughputChartConfig = {
  inbound: { label: "Inbound", color: "#2563EB" },
  outbound: { label: "Outbound", color: "#10B981" },
}

// ── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <Card className="card-depth rounded-xl border-border/60 shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", color)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-lg font-bold tabular-nums text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Shipment Status Badge ───────────────────────────────────────────────────

const shipmentStatusStyles: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "In Transit": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

// ── Main Component ───────────────────────────────────────────────────────────

export function WarehouseDetailModal({ open, onOpenChange, warehouse }: WarehouseDetailModalProps) {
  const throughputData = useMemo(() => warehouse ? generateThroughputData(warehouse) : [], [warehouse])
  const recentShipments = useMemo(() => warehouse ? generateRecentShipments(warehouse) : [], [warehouse])

  if (!warehouse) return null

  const status = statusStyles[warehouse.status] || statusStyles.green

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0">
        {/* ── Header ── */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm shadow-blue-500/25">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground">{warehouse.name}</DialogTitle>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {warehouse.city}, {warehouse.state}
                  </span>
                  <Badge className={cn("text-[10px] rounded-full px-2", status.bg, status.text)}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] font-semibold bg-muted">{warehouse.managerAvatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium text-foreground">{warehouse.managerName}</p>
              <p className="text-[10px] text-muted-foreground">Warehouse Manager</p>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-2 gap-3 p-6 pb-4">
          <StatCard
            icon={<Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
            label="Total Orders"
            value={warehouse.todayOrders}
            color="bg-blue-50 dark:bg-blue-950/50"
          />
          <StatCard
            icon={<ClipboardList className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
            label="Pending Tasks"
            value={warehouse.pendingTasks}
            color="bg-amber-50 dark:bg-amber-950/50"
          />
          <StatCard
            icon={<Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
            label="Accuracy"
            value={`${warehouse.inventoryAccuracy}%`}
            color="bg-emerald-50 dark:bg-emerald-950/50"
          />
          <StatCard
            icon={<Gauge className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
            label="Health Score"
            value={warehouse.healthScore}
            color="bg-purple-50 dark:bg-purple-950/50"
          />
        </div>

        {/* ── Capacity Bar ── */}
        <div className="px-6 pb-4">
          <Card className="card-depth rounded-xl border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-muted-foreground">Capacity Usage</span>
                <span className={cn(
                  "font-bold tabular-nums",
                  warehouse.capacityUsed > 90 ? "text-red-600 dark:text-red-400" :
                  warehouse.capacityUsed > 80 ? "text-amber-600 dark:text-amber-400" :
                  "text-emerald-600 dark:text-emerald-400"
                )}>
                  {warehouse.capacityUsed}% ({Math.round(warehouse.capacity * warehouse.capacityUsed / 100)} / {warehouse.capacity.toLocaleString("en-IN")})
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    warehouse.capacityUsed > 90 ? "bg-red-500" :
                    warehouse.capacityUsed > 80 ? "bg-amber-500" :
                    "bg-emerald-500"
                  )}
                  style={{ width: `${warehouse.capacityUsed}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── 7-Day Throughput Chart ── */}
        <div className="px-6 pb-4">
          <Card className="rounded-xl border-border/60 shadow-sm card-accent-blue">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">7-Day Throughput</CardTitle>
              <CardDescription className="text-xs">Daily inbound and outbound volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={throughputChartConfig} className="h-[200px] w-full">
                <AreaChart data={throughputData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <defs>
                    <linearGradient id="modalInboundGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="modalOutboundGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="inbound" stroke="var(--color-inbound)" fill="url(#modalInboundGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="outbound" stroke="var(--color-outbound)" fill="url(#modalOutboundGrad)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* ── Equipment Section ── */}
        <div className="px-6 pb-4">
          <Card className="card-depth rounded-xl border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Equipment Status</CardTitle>
              <CardDescription className="text-xs">Forklift fleet overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Active: <span className="font-semibold text-foreground">{warehouse.forkliftActive}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="text-xs text-muted-foreground">Idle: <span className="font-semibold text-foreground">{warehouse.forkliftCount - warehouse.forkliftActive}</span></span>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline" className="text-[10px]">
                    <Wrench className="mr-1 h-3 w-3" />
                    {warehouse.forkliftCount} Total
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Today's Activity ── */}
        <div className="px-6 pb-4">
          <Card className="rounded-xl border-border/60 shadow-sm card-accent-green">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-sm font-semibold">Today's Activity</CardTitle>
              </div>
              <CardDescription className="text-xs">Recent warehouse operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { text: `Inbound shipment INV-${847 + Math.round(warehouse.capacityUsed / 10)} received`, time: "32 min ago", dot: "bg-emerald-500" },
                { text: "Dock D3 allocated for unloading", time: "1h ago", dot: "bg-blue-500" },
                { text: "Inventory cycle count completed", time: "2h ago", dot: "bg-emerald-400" },
                { text: "Equipment FL-005 maintenance scheduled", time: "3h ago", dot: "bg-amber-500" },
                { text: `Outbound shipment SH-${912 + Math.round(warehouse.todayOrders / 50)} dispatched`, time: "4h ago", dot: "bg-emerald-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full">
                    <div className={cn("h-2 w-2 rounded-full status-dot-pulse", item.dot)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Recent Shipments ── */}
        <div className="px-6 pb-6">
          <Card className="card-depth rounded-xl border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Recent Shipments</CardTitle>
              <CardDescription className="text-xs">Latest inbound and outbound activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentShipments.map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between rounded-lg border border-border/40 p-3 transition-colors hover:bg-muted/40">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      shipment.type === "Inbound"
                        ? "bg-blue-50 dark:bg-blue-950/50"
                        : "bg-emerald-50 dark:bg-emerald-950/50"
                    )}>
                      {shipment.type === "Inbound"
                        ? <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        : <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      }
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{shipment.id}</p>
                      <p className="text-[10px] text-muted-foreground">{shipment.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={cn("text-[9px] rounded-full px-2", shipmentStatusStyles[shipment.status])}>
                      {shipment.status}
                    </Badge>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {shipment.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
