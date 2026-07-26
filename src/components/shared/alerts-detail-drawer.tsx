"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Bell,
  Shield,
  TrendingDown,
  Package,
  Truck,
  Wrench,
  BarChart3,
  ChevronRight,
  Clock,
  Building2,
  User,
  MapPin,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  Flag,
  FileText,
  History,
  Users,
  Boxes,
  RefreshCw,
  Share2,
  ArrowUpCircle,
  ArrowRight,
  Flame,
  Target,
  Eye,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AlertSeverity = "critical" | "warning" | "info"
export type AlertType = "sla" | "productivity" | "inventory" | "dispatch" | "equipment" | "capacity"

export interface AlertDetail {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  warehouse: string
  timestamp: string
  acknowledged: boolean
}

export interface AlertsDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alert: AlertDetail | null
  onAcknowledge?: (alert: AlertDetail) => void
  onEscalate?: (alert: AlertDetail) => void
  onResolve?: (alert: AlertDetail) => void
}

// ---------------------------------------------------------------------------
// Severity / Type configs
// ---------------------------------------------------------------------------

const severityConfig: Record<
  AlertSeverity,
  {
    icon: typeof AlertTriangle
    gradient: string
    border: string
    iconBg: string
    iconColor: string
    label: string
    ring: string
    glow: string
  }
> = {
  critical: {
    icon: AlertTriangle,
    gradient: "from-red-500 via-red-600 to-rose-700",
    border: "border-red-500/40",
    iconBg: "bg-red-100 dark:bg-red-950/70",
    iconColor: "text-red-600 dark:text-red-400",
    label: "Critical",
    ring: "ring-red-500/30",
    glow: "shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]",
  },
  warning: {
    icon: AlertCircle,
    gradient: "from-amber-400 via-amber-500 to-orange-600",
    border: "border-amber-500/40",
    iconBg: "bg-amber-100 dark:bg-amber-950/70",
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "Warning",
    ring: "ring-amber-500/30",
    glow: "shadow-[0_0_25px_-5px_rgba(245,158,11,0.4)]",
  },
  info: {
    icon: Info,
    gradient: "from-blue-400 via-blue-500 to-indigo-600",
    border: "border-blue-500/40",
    iconBg: "bg-blue-100 dark:bg-blue-950/70",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "Info",
    ring: "ring-blue-500/30",
    glow: "shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]",
  },
}

const typeConfig: Record<
  AlertType,
  { icon: typeof Bell; label: string; color: string }
> = {
  sla: { icon: Shield, label: "SLA", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  productivity: { icon: TrendingDown, label: "Productivity", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  inventory: { icon: Package, label: "Inventory", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  dispatch: { icon: Truck, label: "Dispatch", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
  equipment: { icon: Wrench, label: "Equipment", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  capacity: { icon: BarChart3, label: "Capacity", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
}

// ---------------------------------------------------------------------------
// Deterministic per-alert mock data generators
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length]
}

interface TimelineEvent {
  id: string
  timestamp: string
  label: string
  actor: string
  type: "trigger" | "investigation" | "action" | "update" | "resolved" | "escalated"
  detail: string
}

interface AffectedEntity {
  id: string
  type: "warehouse" | "shipment" | "vehicle" | "employee" | "sku" | "customer"
  label: string
  meta: string
  severity: "high" | "medium" | "low"
}

interface ImpactMetric {
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "flat"
  severity: "good" | "warning" | "critical" | "low"
}

interface RunbookStep {
  step: number
  action: string
  owner: string
  eta: string
  done: boolean
}

interface SimilarAlert {
  id: string
  title: string
  warehouse: string
  age: string
  severity: AlertSeverity
  resolved: boolean
}

function generateTimeline(alert: AlertDetail): TimelineEvent[] {
  const seed = hashStr(alert.id)
  const baseTime = new Date(alert.timestamp).getTime()
  const minutesAfter = (m: number) => new Date(baseTime + m * 60000).toISOString()

  const triggers: Record<AlertType, string> = {
    sla: "SLA timer crossed 75% threshold",
    productivity: "Productivity dropped below 85% threshold",
    inventory: "Cycle count variance exceeded 2% tolerance",
    dispatch: "Vehicle GPS ping missed expected checkpoint",
    equipment: "Equipment telemetry reported fault code",
    capacity: "Warehouse utilization crossed 90% threshold",
  }

  const investigators = [
    "Anil Kumar (Ops Lead)",
    "Priya Sharma (Shift Manager)",
    "Rajesh Verma (Senior Supervisor)",
    "Sneha Reddy (Operations Analyst)",
  ]

  const actionsByType: Record<AlertType, string[]> = {
    sla: [
      "Contacted customer success team for SLA buffer extension",
      "Reallocated pickers from secondary shift to accelerate dispatch",
      "Upgraded shipment priority in TMS queue",
    ],
    productivity: [
      "Reviewed night shift roster for staffing gaps",
      "Checked equipment availability — 1 forklift offline",
      "Initiated break reschedule to reduce idle time",
    ],
    inventory: [
      "Triggered emergency cycle count for SKU family",
      "Locked inventory adjustments pending audit",
      "Notified finance team of variance impact",
    ],
    dispatch: [
      "Contacted driver — confirmed roadblock near Jaipur bypass",
      "Rerouted via NH-21, ETA revised +4 hours",
      "Notified 5 affected customers of revised delivery window",
    ],
    equipment: [
      "Filed maintenance ticket with Crown service center",
      "Rerouted material flow to backup forklift EQ-012",
      "Updated dock capacity plan to reflect reduced throughput",
    ],
    capacity: [
      "Activated diversion plan — Kolkata warehouse flagged as overflow target",
      "Paused non-urgent inbound for next 24 hours",
      "Coordinated with transport team for trailer pre-positioning",
    ],
  }

  const events: TimelineEvent[] = [
    {
      id: "evt-1",
      timestamp: alert.timestamp,
      label: "Alert triggered",
      actor: "System",
      type: "trigger",
      detail: triggers[alert.type],
    },
    {
      id: "evt-2",
      timestamp: minutesAfter(2 + (seed % 5)),
      label: "Investigation started",
      actor: pick(investigators, seed, 0),
      type: "investigation",
      detail: "Initial review of affected systems and stakeholders",
    },
    {
      id: "evt-3",
      timestamp: minutesAfter(8 + (seed % 7)),
      label: "Root cause analysis",
      actor: pick(investigators, seed, 1),
      type: "update",
      detail: pick(actionsByType[alert.type], seed, 0),
    },
    {
      id: "evt-4",
      timestamp: minutesAfter(15 + (seed % 10)),
      label: "Action taken",
      actor: pick(investigators, seed, 2),
      type: "action",
      detail: pick(actionsByType[alert.type], seed, 1),
    },
    {
      id: "evt-5",
      timestamp: minutesAfter(30 + (seed % 20)),
      label: "Stakeholders notified",
      actor: pick(investigators, seed, 3),
      type: "update",
      detail: "Customer success + warehouse ops + transport teams notified via #ops-alerts channel",
    },
    {
      id: "evt-6",
      timestamp: minutesAfter(60 + (seed % 30)),
      label: alert.severity === "critical" ? "Escalated to regional ops" : "Follow-up scheduled",
      actor: "Operations Dashboard",
      type: alert.severity === "critical" ? "escalated" : "update",
      detail: alert.severity === "critical"
        ? "Auto-escalated after 60min unresolved critical alert"
        : "Scheduled recheck in 30 minutes",
    },
  ]

  return events
}

function generateAffectedEntities(alert: AlertDetail): AffectedEntity[] {
  const seed = hashStr(alert.id)
  const entities: AffectedEntity[] = []

  // Always include the warehouse
  entities.push({
    id: `wh-${alert.id}`,
    type: "warehouse",
    label: alert.warehouse,
    meta: "Primary location",
    severity: "high",
  })

  if (alert.type === "dispatch" || alert.type === "sla") {
    const vehicles = ["TN-04-AB-1234", "MH-12-CD-5678", "HR-26-GH-9012", "KA-05-EF-3456"]
    const drivers = ["Ramesh Kumar", "Vikram Singh", "Arun Murugan"]
    entities.push({
      id: `veh-${alert.id}`,
      type: "vehicle",
      label: pick(vehicles, seed, 0),
      meta: `Driver: ${pick(drivers, seed, 1)}`,
      severity: "high",
    })
    entities.push({
      id: `shp-${alert.id}`,
      type: "shipment",
      label: `SHP-${1000 + (seed % 9000)}`,
      meta: `${2 + (seed % 5)} stops · ${50 + (seed % 200)} units`,
      severity: "medium",
    })
  }

  if (alert.type === "inventory" || alert.type === "capacity") {
    const skus = ["SKU-BP-4421", "SKU-FG-2208", "SKU-CL-7755", "SKU-BR-1190"]
    entities.push({
      id: `sku-${alert.id}`,
      type: "sku",
      label: pick(skus, seed, 0),
      meta: `Variance: ${20 + (seed % 80)} units`,
      severity: "medium",
    })
  }

  if (alert.type === "equipment") {
    const eq = ["EQ-008 (Crown RC 5500)", "EQ-012 (Toyota BT)", "EQ-019 (Hyster 5500)"]
    entities.push({
      id: `eqp-${alert.id}`,
      type: "vehicle",
      label: pick(eq, seed, 0),
      meta: "Under maintenance",
      severity: "high",
    })
  }

  if (alert.type === "sla" || alert.severity === "critical") {
    const customers = ["Maruti Suzuki", "Hyundai Motors", "Tata Motors", "Bajaj Auto"]
    entities.push({
      id: `cus-${alert.id}`,
      type: "customer",
      label: pick(customers, seed, 0),
      meta: "SLA: 24h delivery window",
      severity: "high",
    })
  }

  // Always add an owner
  const owners = ["Anil Kumar", "Priya Sharma", "Rajesh Verma", "Sneha Reddy"]
  entities.push({
    id: `own-${alert.id}`,
    type: "employee",
    label: pick(owners, seed, 2),
    meta: "Operations Lead",
    severity: "low",
  })

  return entities
}

function generateImpactMetrics(alert: AlertDetail): ImpactMetric[] {
  const seed = hashStr(alert.id)
  const baseMetrics: Record<AlertType, ImpactMetric[]> = {
    sla: [
      { label: "SLA Risk Score", value: `${65 + (seed % 30)}`, delta: "+18", trend: "up", severity: "critical" },
      { label: "Customer Impact", value: `${1 + (seed % 4)} orders`, delta: "+2", trend: "up", severity: "warning" },
      { label: "Delay (hours)", value: `${3 + (seed % 6)}h`, delta: "+1.5h", trend: "up", severity: "warning" },
      { label: "Penalty Exposure", value: `₹${(20 + (seed % 80)).toLocaleString("en-IN")}`, delta: "₹+12k", trend: "up", severity: "critical" },
    ],
    productivity: [
      { label: "Productivity", value: `${72 + (seed % 12)}.4%`, delta: "-7.6%", trend: "down", severity: "critical" },
      { label: "Active Pickers", value: `${8 + (seed % 6)}`, delta: "-3", trend: "down", severity: "warning" },
      { label: "Pick Rate", value: `${42 + (seed % 20)}/hr`, delta: "-9", trend: "down", severity: "warning" },
      { label: "Overtime Hours", value: `${2 + (seed % 5)}h`, delta: "+1.2h", trend: "up", severity: "warning" },
    ],
    inventory: [
      { label: "Variance Units", value: `+${20 + (seed % 80)}`, delta: "+8", trend: "up", severity: "warning" },
      { label: "Variance Value", value: `₹${(5 + (seed % 25)).toLocaleString("en-IN")}k`, delta: "+₹3k", trend: "up", severity: "warning" },
      { label: "Last Audit", value: `${8 + (seed % 12)} days`, delta: "+2d", trend: "up", severity: "warning" },
      { label: "SKU Affected", value: `${1 + (seed % 4)}`, delta: "0", trend: "flat", severity: "low" },
    ],
    dispatch: [
      { label: "Delay (hours)", value: `${2 + (seed % 6)}h`, delta: "+4h", trend: "up", severity: "critical" },
      { label: "Affected Deliveries", value: `${3 + (seed % 8)}`, delta: "+2", trend: "up", severity: "warning" },
      { label: "Distance Reroute", value: `+${15 + (seed % 40)} km`, delta: "+12 km", trend: "up", severity: "warning" },
      { label: "Customer Notified", value: `${3 + (seed % 8)}/${5 + (seed % 5)}`, delta: "+3", trend: "up", severity: "good" },
    ],
    equipment: [
      { label: "Downtime (hours)", value: `${18 + (seed % 60)}h`, delta: "+2h", trend: "up", severity: "critical" },
      { label: "Throughput Impact", value: `-${15 + (seed % 25)}%`, delta: "-5%", trend: "down", severity: "warning" },
      { label: "Repair ETA", value: `${2 + (seed % 8)}h`, delta: "0", trend: "flat", severity: "warning" },
      { label: "Backup Assigned", value: "EQ-012", delta: "Active", trend: "up", severity: "good" },
    ],
    capacity: [
      { label: "Utilization", value: `${88 + (seed % 8)}%`, delta: "+4%", trend: "up", severity: "critical" },
      { label: "Days to Overflow", value: `${3 + (seed % 7)}d`, delta: "-1d", trend: "down", severity: "warning" },
      { label: "Diversion Active", value: `${1 + (seed % 3)} lanes`, delta: "+1", trend: "up", severity: "good" },
      { label: "Inbound Paused", value: `${5 + (seed % 10)} ASN`, delta: "+3", trend: "up", severity: "warning" },
    ],
  }
  return baseMetrics[alert.type] || baseMetrics.capacity
}

function generateRunbook(alert: AlertDetail): RunbookStep[] {
  const seed = hashStr(alert.id)
  const runbooksByType: Record<AlertType, RunbookStep[]> = {
    sla: [
      { step: 1, action: "Acknowledge alert & assign owner", owner: "Ops Lead", eta: "2 min", done: true },
      { step: 2, action: "Contact customer success for buffer extension", owner: "CS Manager", eta: "10 min", done: true },
      { step: 3, action: "Reallocate staff to accelerate pick/pack", owner: "Shift Manager", eta: "15 min", done: false },
      { step: 4, action: "Upgrade shipment priority in TMS", owner: "Dispatch Lead", eta: "5 min", done: false },
      { step: 5, action: "Confirm dispatch with revised ETA", owner: "Ops Lead", eta: "30 min", done: false },
      { step: 6, action: "Post-incident review (within 24h)", owner: "Ops Lead", eta: "24 hr", done: false },
    ],
    productivity: [
      { step: 1, action: "Review night shift roster for staffing gaps", owner: "Shift Manager", eta: "5 min", done: true },
      { step: 2, action: "Check equipment availability for shift", owner: "Maintenance Lead", eta: "10 min", done: true },
      { step: 3, action: "Reschedule breaks to reduce idle time", owner: "Shift Manager", eta: "15 min", done: false },
      { step: 4, action: "Provide coaching to underperforming pickers", owner: "Team Lead", eta: "1 hr", done: false },
      { step: 5, action: "Verify productivity returns to threshold", owner: "Ops Analyst", eta: "2 hr", done: false },
    ],
    inventory: [
      { step: 1, action: "Lock SKU family for inventory adjustments", owner: "Inventory Manager", eta: "5 min", done: true },
      { step: 2, action: "Trigger emergency cycle count", owner: "Cycle Count Team", eta: "30 min", done: true },
      { step: 3, action: "Reconcile physical vs system count", owner: "Inventory Manager", eta: "1 hr", done: false },
      { step: 4, action: "Notify finance of variance impact", owner: "Ops Lead", eta: "15 min", done: false },
      { step: 5, action: "Update system count post-reconciliation", owner: "Inventory Manager", eta: "2 hr", done: false },
    ],
    dispatch: [
      { step: 1, action: "Contact driver to confirm status", owner: "Dispatch Lead", eta: "5 min", done: true },
      { step: 2, action: "Identify alternative route via TMS", owner: "Route Planner", eta: "10 min", done: true },
      { step: 3, action: "Notify affected customers of revised ETA", owner: "CS Manager", eta: "15 min", done: false },
      { step: 4, action: "Monitor GPS pings for next 30 min", owner: "Dispatch Lead", eta: "30 min", done: false },
      { step: 5, action: "Document incident in transport log", owner: "Ops Lead", eta: "1 hr", done: false },
    ],
    equipment: [
      { step: 1, action: "Confirm equipment is tagged out of service", owner: "Maintenance Lead", eta: "5 min", done: true },
      { step: 2, action: "File service ticket with vendor", owner: "Maintenance Lead", eta: "15 min", done: true },
      { step: 3, action: "Activate backup equipment", owner: "Shift Manager", eta: "10 min", done: false },
      { step: 4, action: "Update dock capacity plan", owner: "Ops Analyst", eta: "20 min", done: false },
      { step: 5, action: "Track repair progress until restored", owner: "Maintenance Lead", eta: "Daily", done: false },
    ],
    capacity: [
      { step: 1, action: "Activate diversion plan to overflow warehouse", owner: "Ops Lead", eta: "10 min", done: true },
      { step: 2, action: "Pause non-urgent inbound for 24 hours", owner: "Inbound Manager", eta: "5 min", done: true },
      { step: 3, action: "Pre-position trailers for surge capacity", owner: "Transport Lead", eta: "1 hr", done: false },
      { step: 4, action: "Review daily capacity every 4 hours", owner: "Ops Analyst", eta: "Recurring", done: false },
      { step: 5, action: "Stand down diversion when utilization < 80%", owner: "Ops Lead", eta: "TBD", done: false },
    ],
  }
  const steps = runbooksByType[alert.type] || runbooksByType.capacity
  // Adjust done-state based on seed for variety
  return steps.map((s, i) => ({
    ...s,
    done: i < 2 + (seed % 2),
  }))
}

function generateHistoricalTrend(alert: AlertDetail): Array<{ time: string; value: number }> {
  const seed = hashStr(alert.id)
  const now = new Date()
  const points: Array<{ time: string; value: number }> = []
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000)
    const baseValue =
      alert.type === "capacity" ? 75 + (seed % 15) :
      alert.type === "productivity" ? 82 + (seed % 8) :
      alert.type === "sla" ? 35 + (seed % 30) :
      alert.type === "inventory" ? 5 + (seed % 25) :
      alert.type === "dispatch" ? 10 + (seed % 35) :
      40 + (seed % 20)
    const trend = i <= 4 ? (5 - i) * (alert.severity === "critical" ? 4 : 2) : -2
    const noise = ((seed >> i) & 7) - 3
    points.push({
      time: t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      value: Math.max(0, Math.min(100, baseValue + trend + noise)),
    })
  }
  return points
}

function generateSimilarAlerts(alert: AlertDetail): SimilarAlert[] {
  const seed = hashStr(alert.id)
  const all: SimilarAlert[] = [
    { id: `ALT-${100 + (seed % 50)}`, title: "Chennai Warehouse at 87% Capacity", warehouse: "Chennai", age: "3d ago", severity: "warning", resolved: true },
    { id: `ALT-${200 + (seed % 50)}`, title: "Forklift EQ-012 Maintenance Overdue", warehouse: "Hosur", age: "5d ago", severity: "warning", resolved: true },
    { id: `ALT-${300 + (seed % 50)}`, title: "SLA Risk - Hyundai Order #HM-2025-0231", warehouse: "Gurugram", age: "1w ago", severity: "critical", resolved: true },
    { id: `ALT-${400 + (seed % 50)}`, title: "Stock Variance - SKU-FG-2208", warehouse: "Pune", age: "1w ago", severity: "info", resolved: true },
    { id: `ALT-${500 + (seed % 50)}`, title: "Vehicle TN-04-CD-9012 Late to Pune", warehouse: "Pune", age: "2w ago", severity: "warning", resolved: true },
  ]
  return all.slice(0, 3 + (seed % 3))
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function entityIcon(type: AffectedEntity["type"]) {
  switch (type) {
    case "warehouse": return Building2
    case "shipment": return Package
    case "vehicle": return Truck
    case "employee": return User
    case "sku": return Boxes
    case "customer": return Users
  }
}

function entitySeverityColor(sev: AffectedEntity["severity"]) {
  switch (sev) {
    case "high": return "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 ring-red-500/20"
    case "medium": return "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 ring-amber-500/20"
    case "low": return "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 ring-blue-500/20"
  }
}

function impactSeverityColor(s: ImpactMetric["severity"]) {
  switch (s) {
    case "critical": return "text-red-600 dark:text-red-400"
    case "warning": return "text-amber-600 dark:text-amber-400"
    case "good": return "text-emerald-600 dark:text-emerald-400"
    case "low": return "text-blue-600 dark:text-blue-400"
  }
}

function timelineEventColor(t: TimelineEvent["type"]) {
  switch (t) {
    case "trigger": return "bg-red-500"
    case "investigation": return "bg-blue-500"
    case "action": return "bg-emerald-500"
    case "update": return "bg-slate-400 dark:bg-slate-500"
    case "resolved": return "bg-emerald-500"
    case "escalated": return "bg-orange-500"
  }
}

function formatRelativeTime(ts: string): string {
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return "just now"
  const min = Math.floor(diffMs / 60000)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

function formatAbsoluteTime(ts: string): string {
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AlertsDetailDrawer({
  open,
  onOpenChange,
  alert,
  onAcknowledge,
  onEscalate,
  onResolve,
}: AlertsDetailDrawerProps) {
  const toast = useToast()

  // Generate deterministic mock data — placed BEFORE early return to satisfy Rules of Hooks
  const timeline = React.useMemo(() => (alert ? generateTimeline(alert) : []), [alert])
  const entities = React.useMemo(() => (alert ? generateAffectedEntities(alert) : []), [alert])
  const impactMetrics = React.useMemo(() => (alert ? generateImpactMetrics(alert) : []), [alert])
  const runbook = React.useMemo(() => (alert ? generateRunbook(alert) : []), [alert])
  const trendData = React.useMemo(() => (alert ? generateHistoricalTrend(alert) : []), [alert])
  const similarAlerts = React.useMemo(() => (alert ? generateSimilarAlerts(alert) : []), [alert])

  if (!alert) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl" />
      </Sheet>
    )
  }

  const sevCfg = severityConfig[alert.severity]
  const typeCfg = typeConfig[alert.type]
  const SevIcon = sevCfg.icon
  const TypeIcon = typeCfg.icon

  const completedSteps = runbook.filter((s) => s.done).length
  const totalSteps = runbook.length
  const runbookPct = Math.round((completedSteps / totalSteps) * 100)

  const handleAcknowledge = () => {
    toast.success("Alert acknowledged", `${alert.title} marked as acknowledged`, { duration: 3500 })
    onAcknowledge?.(alert)
  }

  const handleEscalate = () => {
    toast.warning("Alert escalated", `Escalated to regional ops: ${alert.title}`, { duration: 3500 })
    onEscalate?.(alert)
  }

  const handleResolve = () => {
    toast.success("Alert resolved", `Marked as resolved: ${alert.title}`, { duration: 3500 })
    onResolve?.(alert)
    onOpenChange(false)
  }

  const handleShare = () => {
    toast.info("Alert shared", "Link copied to clipboard", { duration: 2500 })
  }

  const handleExportTimeline = () => {
    const data = timeline.map((e) => ({
      Time: formatAbsoluteTime(e.timestamp),
      Event: e.label,
      Actor: e.actor,
      Type: e.type,
      Detail: e.detail,
    }))
    exportToCSV(data, `alert-${alert.id}-timeline`, ["Time", "Event", "Actor", "Type", "Detail"])
    toast.success("Timeline exported", `${timeline.length} events written to CSV`, { duration: 2500 })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-2xl overflow-y-auto p-0 border-l-2",
          sevCfg.border,
        )}
      >
        {/* ── Header Strip ─────────────────────────────────────────────── */}
        <div className={cn(
          "relative bg-gradient-to-br text-white overflow-hidden",
          sevCfg.gradient,
        )}>
          {/* Sheen animation */}
          <div className="alert-drawer-header absolute inset-0 pointer-events-none" />
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-20"
               style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "16px 16px" }} />

          <SheetHeader className="relative p-5 pb-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={cn(
                  "alert-icon-pulse flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-2 backdrop-blur-sm",
                  "bg-white/20",
                )}>
                  <SevIcon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-base font-semibold text-white leading-tight">
                    {alert.title}
                  </SheetTitle>
                  <SheetDescription className="text-white/80 text-xs mt-1">
                    <span className="font-mono">{alert.id}</span>
                    <span className="mx-1.5">·</span>
                    <span className="inline-flex items-center gap-1">
                      <TypeIcon className="h-3 w-3" /> {typeCfg.label}
                    </span>
                    <span className="mx-1.5">·</span>
                    <span>{formatRelativeTime(alert.timestamp)}</span>
                  </SheetDescription>
                </div>
              </div>
              <Badge className={cn(
                "shrink-0 bg-white/20 text-white border-white/30 backdrop-blur-sm",
                alert.severity === "critical" && "badge-glow-critical",
              )}>
                {sevCfg.label}
              </Badge>
            </div>

            {/* Hero metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="alert-stat-enter rounded-lg bg-white/15 backdrop-blur-sm p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/70">Status</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {alert.acknowledged ? "Acknowledged" : "Active"}
                </p>
              </div>
              <div className="alert-stat-enter rounded-lg bg-white/15 backdrop-blur-sm p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/70">Owner</p>
                <p className="text-sm font-semibold text-white mt-0.5 truncate">
                  {entities.find((e) => e.type === "employee")?.label || "Unassigned"}
                </p>
              </div>
              <div className="alert-stat-enter rounded-lg bg-white/15 backdrop-blur-sm p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/70">Runbook</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {completedSteps}/{totalSteps} <span className="text-white/70 text-[10px]">({runbookPct}%)</span>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {!alert.acknowledged && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-[11px] gap-1.5 bg-white/90 hover:bg-white text-slate-900"
                  onClick={handleAcknowledge}
                >
                  <CheckCircle2 className="h-3 w-3" /> Acknowledge
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                className="h-7 text-[11px] gap-1.5 bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={handleEscalate}
              >
                <ArrowUpCircle className="h-3 w-3" /> Escalate
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-7 text-[11px] gap-1.5 bg-emerald-500/90 hover:bg-emerald-500 text-white border-emerald-400"
                onClick={handleResolve}
              >
                <CheckCircle2 className="h-3 w-3" /> Resolve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] gap-1.5 text-white hover:bg-white/20"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3" /> Share
              </Button>
            </div>
          </SheetHeader>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="alert-drawer-body-enter space-y-5 p-5">
          {/* Alert summary */}
          <section className="alert-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              <FileText className="h-3.5 w-3.5" /> Description
            </h3>
            <p className="text-sm text-foreground leading-relaxed">{alert.message}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {alert.warehouse}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatAbsoluteTime(alert.timestamp)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Activity className="h-3 w-3" /> {formatRelativeTime(alert.timestamp)}
              </span>
            </div>
          </section>

          {/* Impact metrics */}
          <section className="alert-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Flame className="h-3.5 w-3.5" /> Impact Analysis
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {impactMetrics.map((m) => (
                <div key={m.label} className="alert-metric-enter rounded-lg border border-border/40 bg-muted/30 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                  <p className={cn("text-lg font-bold tabular-nums mt-0.5", impactSeverityColor(m.severity))}>
                    {m.value}
                  </p>
                  <p className={cn(
                    "text-[10px] flex items-center gap-0.5",
                    m.trend === "up" && m.severity === "critical" ? "text-red-500" :
                    m.trend === "up" && m.severity === "warning" ? "text-amber-500" :
                    m.trend === "up" ? "text-emerald-500" :
                    m.trend === "down" ? "text-emerald-500" : "text-muted-foreground"
                  )}>
                    {m.trend === "up" ? <ArrowUpCircle className="h-2.5 w-2.5" /> :
                     m.trend === "down" ? <ArrowUpCircle className="h-2.5 w-2.5 rotate-180" /> :
                     <Activity className="h-2.5 w-2.5" />}
                    {m.delta}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Historical trend */}
          <section className="alert-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <TrendingDown className="h-3.5 w-3.5" /> 12-Hour Trend
            </h3>
            <ChartContainer
              config={{ value: { label: "Metric", color: sevCfg.iconColor } }}
              className="h-[140px] w-full"
            >
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="alertTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity={0.4} className={sevCfg.iconColor} />
                    <stop offset="100%" stopColor="currentColor" stopOpacity={0} className={sevCfg.iconColor} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} className="text-muted-foreground" interval={2} />
                <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="currentColor"
                  strokeWidth={2}
                  className={sevCfg.iconColor}
                  fill="url(#alertTrendFill)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ChartContainer>
          </section>

          {/* Affected entities */}
          <section className="alert-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Boxes className="h-3.5 w-3.5" /> Affected Entities ({entities.length})
            </h3>
            <div className="space-y-2">
              {entities.map((entity) => {
                const Icon = entityIcon(entity.type)
                return (
                  <div
                    key={entity.id}
                    className={cn(
                      "alert-entity-row flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 p-2.5 transition-smooth hover:bg-muted/60 hover:border-border/80",
                    )}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1",
                      entitySeverityColor(entity.severity),
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">{entity.label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{entity.meta}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase">
                      {entity.type}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Investigation timeline */}
          <section className="alert-card-enter rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <History className="h-3.5 w-3.5" /> Investigation Timeline
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] gap-1"
                onClick={handleExportTimeline}
              >
                <Download className="h-3 w-3" /> Export
              </Button>
            </div>
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
              <div className="space-y-3">
                {timeline.map((evt) => (
                  <div key={evt.id} className="alert-timeline-enter relative">
                    {/* Dot */}
                    <div className={cn(
                      "absolute -left-4 top-1 h-3 w-3 rounded-full ring-2 ring-background",
                      timelineEventColor(evt.type),
                      evt.type === "escalated" && "alert-timeline-active",
                    )} />
                    <div className="ml-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-xs font-medium text-foreground">{evt.label}</p>
                        <p className="text-[10px] text-muted-foreground shrink-0">
                          {formatAbsoluteTime(evt.timestamp)}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{evt.detail}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                        <User className="h-2.5 w-2.5" /> {evt.actor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Runbook */}
          <section className="alert-card-enter rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Target className="h-3.5 w-3.5" /> Response Runbook
              </h3>
              <Badge variant="outline" className="text-[10px]">
                {completedSteps}/{totalSteps} done
              </Badge>
            </div>
            <Progress value={runbookPct} className="h-1.5 mb-3" />
            <div className="space-y-2">
              {runbook.map((step) => (
                <div
                  key={step.step}
                  className={cn(
                    "alert-runbook-row flex items-center gap-3 rounded-lg border p-2.5 transition-smooth",
                    step.done
                      ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "border-border/40 bg-muted/30 hover:bg-muted/60",
                  )}
                >
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    step.done
                      ? "bg-emerald-500 text-white"
                      : "bg-muted-foreground/20 text-muted-foreground",
                  )}>
                    {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.step}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-xs",
                      step.done ? "text-foreground line-through opacity-70" : "text-foreground font-medium",
                    )}>
                      {step.action}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-2.5 w-2.5" /> {step.owner}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {step.eta}
                      </span>
                    </div>
                  </div>
                  {!step.done && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] gap-1 shrink-0"
                      onClick={() => toast.info("Step marked complete", `Step ${step.step}: ${step.action}`, { duration: 2000 })}
                    >
                      <CheckCircle2 className="h-3 w-3" /> Done
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Similar alerts */}
          <section className="alert-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <History className="h-3.5 w-3.5" /> Similar Past Alerts
            </h3>
            <div className="space-y-2">
              {similarAlerts.map((sim) => {
                const simSev = severityConfig[sim.severity]
                const SimIcon = simSev.icon
                return (
                  <div
                    key={sim.id}
                    className="alert-similar-row flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 p-2.5 transition-smooth hover:bg-muted/60 hover:border-border/80"
                  >
                    <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", simSev.iconBg)}>
                      <SimIcon className={cn("h-3.5 w-3.5", simSev.iconColor)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">{sim.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        <span className="font-mono">{sim.id}</span> · {sim.warehouse} · {sim.age}
                      </p>
                    </div>
                    {sim.resolved ? (
                      <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> Resolved
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                        <Loader2 className="h-2.5 w-2.5 mr-0.5" /> Open
                      </Badge>
                    )}
                    <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  </div>
                )
              })}
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={handleExportTimeline}
            >
              <Download className="h-3.5 w-3.5" /> Export Full Report
            </Button>
            <Button
              size="sm"
              className="text-xs gap-1.5"
              onClick={handleResolve}
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
