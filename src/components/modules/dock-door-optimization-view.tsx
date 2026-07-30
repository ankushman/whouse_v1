"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer,
} from "recharts"
import {
  Search, Filter, Eye, AlertTriangle, CheckCircle2, XCircle, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Timer, MapPin, Wrench, CalendarDays, IndianRupee,
  Truck, ShieldAlert, Gauge, Activity, RotateCcw, Package, ChevronRight, Star,
  CreditCard, Clock, Warehouse, User, FileText, DollarSign, Receipt, BarChart3, Target,
  Building2, Navigation, Fuel, Layers, CircleDot, Settings, Zap, Ban, ArrowUpDown,
  Send, DoorOpen, Car, ThermometerSun, ClipboardList, Route, GaugeCircle,
  Pause, Play,
} from "lucide-react"

// ============================================================================
// Helpers
// ============================================================================
function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  s = (s * 16807) % 2147483647
  return (s - 1) / 2147483646
}
const pick = <T,>(arr: readonly T[], seed: number) => arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const formatINR = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : `₹${n.toLocaleString("en-IN")}`
const fmtMins = (m: number) => m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`

// ============================================================================
// Enums
// ============================================================================
const DOOR_TYPES = ["Loading Bay", "Unloading Bay", "Cross-Dock", "Outbound Staging", "Inbound Receiving", "QC Inspection", "Cold Storage", "Hazmat Bay"] as const
const DOOR_STATUSES = ["Available", "Occupied", "Reserved", "Blocked", "Under Maintenance", "Loading", "Unloading", "Cleaning"] as const
const ZONES = ["Zone A - Ground Floor", "Zone B - Ground Floor", "Zone C - First Floor", "Zone D - First Floor", "Zone E - Mezzanine", "Zone F - Exterior", "Zone G - Cold Storage", "Zone H - Covered Yard"] as const
const CARRIERS = ["Delhivery", "BlueDart", "DTDC", "Gati", "XpressBees", "Ecom Express", "Rivigo", "TCI Express", "SafeExpress", "Shadowfax", "VRL", "Allcargo", "Mahindra", "Amazon India", "Flipkart", "Reliance Retail"] as const
const APPOINTMENT_TYPES = ["Loading", "Unloading", "Cross-Dock Transfer", "QC Inspection", "Repacking", "Consolidation", "Deconsolidation"] as const
const APPOINT_STATUSES = ["Scheduled", "Checked In", "In Progress", "Completed", "Cancelled", "No-Show", "Delayed", "Early Arrival"] as const
const ALERT_TYPES = ["Door Blocked", "Long Wait", "Equipment Failure", "Schedule Conflict", "Carrier Delay", "Safety Violation", "Overcrowding", "Temperature Alert"] as const
const ALERT_SEVERITIES = ["Critical", "High", "Medium", "Low"] as const
const SHIFT_TIMES = ["06:00-14:00", "14:00-22:00", "22:00-06:00"] as const
const METRICS = ["Throughput", "Utilization Rate", "Avg Dwell Time", "Turnaround Time", "Carrier Satisfaction", "Door Availability"] as const
const OPT_RULES = ["Carrier Priority", "FIFO", "LIFO", "Zone Proximity", "Weight Based", "Volume Based", "Time Slot", "Dynamic Assignment"] as const
const RULE_STATUSES = ["Active", "Paused", "Draft", "Archived"] as const
const SIMULATION_TYPES = ["Day Peak", "Week Average", "Festival Season", "Flash Sale", "Month End", "Year Peak"] as const
const WEATHER_CONDS = ["Clear", "Rain", "Heavy Rain", "Heat Wave", "Fog", "Storm Warning"] as const
const EQUIPMENT_TYPES = ["Forklift", "Reach Stacker", "Pallet Jack", "Conveyor", "Shrink Wrap", "Dock Leveler", "Dock Lock", "Light Tower", "Scale", "RF Scanner"] as const

const STATUS_COLORS: Record<string, string> = {
  Available: "#059669", Occupied: "#3b82f6", Reserved: "#d97706", Blocked: "#dc2626",
  "Under Maintenance": "#ea580c", Loading: "#0d9488", Unloading: "#4f46e5", Cleaning: "#6b7280",
  Scheduled: "#3b82f6", "Checked In": "#0d9488", "In Progress": "#0891b2",
  Completed: "#059669", Cancelled: "#9ca3af", "No-Show": "#dc2626",
  Delayed: "#ea580c", "Early Arrival": "#7c3aed",
  Active: "#059669", Paused: "#d97706", Draft: "#6b7280", Archived: "#9ca3af",
  Critical: "#dc2626", High: "#ea580c", Medium: "#d97706", Low: "#3b82f6",
}
const TYPE_COLORS: Record<string, string> = {
  "Loading Bay": "#3b82f6", "Unloading Bay": "#8b5cf6", "Cross-Dock": "#0d9488",
  "Outbound Staging": "#059669", "Inbound Receiving": "#d97706", "QC Inspection": "#7c3aed",
  "Cold Storage": "#0891b2", "Hazmat Bay": "#dc2626",
}
const ZONE_COLORS: Record<string, string> = {
  "Zone A": "#3b82f6", "Zone B": "#8b5cf6", "Zone C": "#0d9488", "Zone D": "#059669",
  "Zone E": "#d97706", "Zone F": "#ea580c", "Zone G": "#0891b2", "Zone H": "#7c3aed",
}
const PIE_COLORS = ["#3b82f6", "#d97706", "#0d9488", "#dc2626", "#059669", "#4f46e5", "#0891b2", "#ea580c"]
const COL_LABELS: Record<string, string> = {
  id: "ID", doorId: "Door ID", doorName: "Door Name", type: "Type", status: "Status",
  zone: "Zone", carrier: "Carrier", appointmentType: "Type", startTime: "Start",
  endTime: "End", dwellMin: "Dwell", priority: "Priority", truckNo: "Truck",
  appointmentId: "Appt ID", alertType: "Alert", severity: "Severity",
  message: "Message", timestamp: "Time", door: "Door", ruleName: "Rule",
  ruleType: "Type", condition: "Condition", effectiveness: "Effect.",
  metric: "Metric", current: "Current", target: "Target", trend: "Trend",
  equipment: "Equipment", equipStatus: "Status", utilization: "Util.",
}

// ============================================================================
// generateData
// ============================================================================
function generateData() {
  const doors = Array.from({ length: 72 }, (_, i) => {
    const seed = i * 19 + 1
    const s = pick(DOOR_STATUSES, seed)
    return {
      id: `DD-${String(i + 1).padStart(3, "0")}`,
      doorId: `D${String(i + 1).padStart(2, "0")}`,
      doorName: `Door ${String(i + 1).padStart(2, "0")}`,
      type: pick(DOOR_TYPES, seed + 1) as string,
      status: s,
      zone: pick(ZONES, seed + 2) as string,
      carrier: s === "Occupied" || s === "Loading" || s === "Unloading" ? pick(CARRIERS, seed + 3) as string : "—",
      currentAppt: s === "Occupied" || s === "Loading" || s === "Unloading" ? `APT-${ri(1000, 9999, seed + 4)}` : "—",
      dwellMin: ri(5, 180, seed + 5),
      utilization: ri(40, 98, seed + 6),
      throughput: ri(8, 35, seed + 7),
      avgDwell: ri(15, 90, seed + 8),
      blockedReason: s === "Blocked" ? pick(["Truck stalled", "Equipment failure", "Spill cleanup", "Loading error", "Weather hold"], seed + 9) as string : "",
      lastActivity: `2025-07-29 ${String(ri(6, 18, seed + 10)).padStart(2, "0")}:${String(ri(0, 59, seed + 11)).padStart(2, "0")}`,
    }
  })

  const appointments = Array.from({ length: 60 }, (_, i) => {
    const seed = i * 23 + 100
    return {
      id: `APT-${String(i + 1000).padStart(4, "0")}`,
      status: pick(APPOINT_STATUSES, seed) as string,
      appointmentType: pick(APPOINTMENT_TYPES, seed + 1) as string,
      carrier: pick(CARRIERS, seed + 2) as string,
      doorId: `D${String(ri(1, 72, seed + 3)).padStart(2, "0")}`,
      startTime: `${String(ri(6, 18, seed + 4)).padStart(2, "0")}:${String(ri(0, 59, seed + 5)).padStart(2, "0")}`,
      endTime: `${String(ri(6, 22, seed + 6)).padStart(2, "0")}:${String(ri(0, 59, seed + 7)).padStart(2, "0")}`,
      dwellMin: ri(10, 180, seed + 8),
      priority: pick(["Critical", "High", "Normal", "Low"], seed + 9) as string,
      truckNo: pick(["MH", "KA", "TN", "DL", "GJ", "RJ", "UP", "WB", "TS", "AP"], seed + 10) as string + String(ri(10, 99, seed + 10)) + String.fromCharCode(65 + ri(0, 25, seed + 11)) + String(ri(1000, 9999, seed + 12)),
      containerNo: pick(["MSKU", "TCNU", "CMAU", "FCIU", "TEMU", "HLBU", "OOLU", "ONEU"], seed + 13) as string + String(ri(1000000, 9999999, seed + 14)),
      weight: ri(500, 25000, seed + 14),
      volume: ri(5, 120, seed + 15),
      date: `2025-07-29`,
    }
  })

  const alerts = Array.from({ length: 35 }, (_, i) => {
    const seed = i * 29 + 200
    return {
      id: `ALT-${String(i + 1).padStart(3, "0")}`,
      alertType: pick(ALERT_TYPES, seed) as string,
      severity: pick(ALERT_SEVERITIES, seed + 1) as string,
      message: pick([
        "Door D5 blocked for 25 min — truck stalled during unloading",
        "Zone A congestion: 6 trucks waiting, avg wait 42 min",
        "Forklift #3 in Zone B reported equipment failure",
        "Schedule conflict: APT-1050 and APT-1051 assigned same door",
        "Carrier Delhivery delayed by 2 hours — ETA now 16:30",
        "Safety violation: Unauthorized personnel in cold storage dock",
        "Dock 12-15 overcrowded with 4 simultaneous appointments",
        "Cold Storage Zone G temperature reading 8.2°C — above 7°C threshold",
        "Carrier XpressBees early arrival at Dock D8 — door not ready",
        "Rain alert: Exterior doors F1-F5 may experience delays",
      ], seed + 2) as string,
      door: pick(doors.slice(0, 30), seed + 3).doorName as string,
      timestamp: `2025-07-29 ${String(ri(6, 18, seed + 4)).padStart(2, "0")}:${String(ri(0, 59, seed + 5)).padStart(2, "0")}`,
      resolved: pick(["Resolved", "Escalated", "Pending", "Auto-Cleared"], seed + 6) as string,
    }
  })

  const rules = Array.from({ length: 12 }, (_, i) => {
    const seed = i * 37 + 300
    return {
      id: `RULE-${String(i + 1).padStart(3, "0")}`,
      ruleName: pick(["Priority Loading", "Zone Balance", "Dwell Limit 120min", "Carrier batching", "Cross-dock express", "Hazmat dedicated", "Cold chain priority", "QC sample route", "Evening shift balance", "Flash sale override", "Return processing", "Bulk consolidation"], seed) as string,
      ruleType: pick(OPT_RULES, seed + 1) as string,
      condition: pick(["dwell > 90min", "zone > 80% capacity", "carrier = VIP", "weight > 15T", "volume > 80CBM", "time slot < 30min", "temp > 5°C", "concurrent > 2", "reservation gap < 15min"], seed + 2) as string,
      status: pick(RULE_STATUSES, seed + 3) as string,
      effectiveness: ri(65, 98, seed + 4),
      priority: pick(["Critical", "High", "Normal"], seed + 5) as string,
    }
  })

  const metrics = METRICS.map((m, i) => ({
    metric: m,
    current: ri(55, 95, i * 41 + 400),
    target: ri(75, 98, i * 41 + 401),
    trend: pick(["Up", "Down", "Stable"], i * 41 + 402) as string,
  }))

  const dashboardKPIs = Array.from({ length: 8 }, (_, i) => {
    const seed = i * 17 + 500
    return { label: pick(["Active Doors", "Door Utilization", "Avg Dwell Time", "Today's Appointments", "Active Alerts", "Throughput/Door", "Carrier On-Time", "Wait Time Avg"], seed) as string, value: pick([72, "78.5%", "45 min", 48, 5, "28 trips", "89%", "22 min"], seed) as string, icon: [DoorOpen, Gauge, Timer, CalendarDays, AlertTriangle, Truck, CheckCircle2, Clock][i], color: PIE_COLORS[i] }
  }).map((k, i) => ({ ...k, id: i, label: ["Active Doors", "Door Utilization", "Avg Dwell Time", "Today's Appointments", "Active Alerts", "Throughput/Door", "Carrier On-Time", "Wait Time Avg"][i], value: [72, "78.5%", "45 min", 48, 5, "28", "89%", "22 min"][i] }))

  const zoneUtil = ZONES.map((z, i) => ({ zone: z.split(" ")[0] + " " + z.split(" ")[1].substring(0, 3), utilization: ri(55, 98, i * 19 + 600), doors: ri(6, 12, i * 19 + 601) }))
  const hourlyThroughput = Array.from({ length: 16 }, (_, i) => ({ hour: `${String(i + 6).padStart(2, "0")}:00`, inbound: ri(3, 12, i * 7 + 700), outbound: ri(3, 12, i * 7 + 701), crossDock: ri(0, 5, i * 7 + 702) }))
  const carrierPerf = CARRIERS.slice(0, 8).map((c, i) => ({ carrier: c, avgDwell: ri(15, 90, i * 23 + 800), onTime: ri(65, 98, i * 23 + 801), trips: ri(5, 25, i * 23 + 802) }))
  const simScenarios = SIMULATION_TYPES.map((t, i) => ({ scenario: t, throughput: ri(300, 800, i * 31 + 900), utilization: ri(60, 98, i * 31 + 901), avgWait: ri(10, 50, i * 31 + 902) }))
  const weatherImpact = WEATHER_CONDS.map((w, i) => ({ condition: w, impactPct: i === 0 ? 100 : ri(40, 90, i * 37 + 1000), delayMin: i === 0 ? 0 : ri(5, 45, i * 37 + 1001) }))
  const equipment = EQUIPMENT_TYPES.map((e, i) => ({ equipment: e, status: pick(["Online", "Offline", "Maintenance"], i * 41 + 1100) as string, utilization: ri(30, 95, i * 41 + 1101), lastService: `2025-${String(ri(1, 7, i * 41 + 1102)).padStart(2, "0")}-${String(ri(1, 28, i * 41 + 1103)).padStart(2, "0")}` }))

  return {
    DOOR_TYPES, DOOR_STATUSES, ZONES, CARRIERS, APPOINTMENT_TYPES, APPOINT_STATUSES,
    ALERT_TYPES, ALERT_SEVERITIES, SHIFT_TIMES, METRICS, OPT_RULES, RULE_STATUSES,
    SIMULATION_TYPES, WEATHER_CONDS, EQUIPMENT_TYPES,
    STATUS_COLORS, TYPE_COLORS, ZONE_COLORS, PIE_COLORS, COL_LABELS,
    doors, appointments, alerts, rules, metrics, dashboardKPIs,
    zoneUtil, hourlyThroughput, carrierPerf, simScenarios, weatherImpact, equipment,
  }
}

// ============================================================================
// Visual Components
// ============================================================================
function StatusBadge({ status, color }: { status: string; color: string }) {
  const isPulse = ["Blocked", "Delayed", "No-Show", "Critical", "High"].includes(status)
  return (
    <Badge variant="outline" className={cn("ddo-badge text-xs px-2 py-0.5 border", isPulse && "ddo-pulse-error")} style={{ borderColor: color, color }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: color }} />{status}
    </Badge>
  )
}
function DoorTypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] || "#475569"
  return <Badge className="badge-interactive ddo-type-badge text-xs px-2 py-0.5" style={{ background: c + "18", color: c, border: `1px solid ${c}30` }}>{type}</Badge>
}
function ZoneBadge({ zone }: { zone: string }) {
  const short = zone.split(" - ")[0]
  const c = ZONE_COLORS[short] || "#475569"
  return <Badge variant="outline" className="badge-interactive ddo-zone-badge text-xs px-2 py-0.5" style={{ borderColor: c + "60", color: c }}>{zone}</Badge>
}
function DwellBar({ mins, max = 120 }: { mins: number; max?: number }) {
  const pct = Math.min((mins / max) * 100, 100)
  const c = pct <= 50 ? "#059669" : pct <= 80 ? "#d97706" : "#dc2626"
  return (
    <div className="ddo-dwell-bar flex items-center gap-2">
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 w-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c}, ${c}cc)` }} />
      </div>
      <span className="text-xs font-mono tabular-nums w-12 text-right" style={{ color: c }}>{fmtMins(mins)}</span>
    </div>
  )
}
function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = { Critical: "#dc2626", High: "#ea580c", Normal: "#3b82f6", Low: "#6b7280" }
  const c = colors[priority] || "#475569"
  return <Badge className="badge-interactive ddo-priority-badge text-xs px-2 py-0.5" style={{ background: c + "18", color: c, border: `1px solid ${c}30` }}>{priority}</Badge>
}
function CarrierBadge({ carrier }: { carrier: string }) {
  return <Badge className="badge-interactive ddo-carrier-badge text-xs px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">{carrier}</Badge>
}
function ApptTypeBadge({ type }: { type: string }) {
  return <Badge variant="outline" className="badge-interactive ddo-appt-type text-xs px-2 py-0.5 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400">{type}</Badge>
}
function TruckBadge({ truck }: { truck: string }) {
  return <Badge variant="outline" className="badge-interactive ddo-truck-badge text-xs px-2 py-0.5 border-slate-300 dark:border-slate-600 font-mono">{truck}</Badge>
}
function AlertSeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = { Critical: "#dc2626", High: "#ea580c", Medium: "#d97706", Low: "#3b82f6" }
  const c = colors[severity] || "#475569"
  return <Badge className="badge-interactive ddo-severity-badge text-xs px-2 py-0.5" style={{ background: c + "18", color: c, border: `1px solid ${c}30` }}>{severity}</Badge>
}
function EquipmentBadge({ equip }: { equip: string }) {
  return <Badge variant="outline" className="badge-interactive ddo-equip-badge text-xs px-2 py-0.5 border-slate-300 dark:border-slate-600">{equip}</Badge>
}
function RuleEffectBar({ pct }: { pct: number }) {
  const c = pct >= 90 ? "#059669" : pct >= 75 ? "#0d9488" : pct >= 60 ? "#d97706" : "#dc2626"
  return (
    <div className="ddo-rule-bar flex items-center gap-2">
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 w-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c}, ${c}cc)` }} />
      </div>
      <span className="text-xs font-mono tabular-nums w-10 text-right" style={{ color: c }}>{pct}%</span>
    </div>
  )
}
function TrendIndicator({ trend }: { trend: string }) {
  const isUp = trend === "Up"
  return <span className={cn("ddo-trend inline-flex items-center text-xs font-semibold", isUp ? "text-emerald-600" : "text-rose-600")}>{isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}{trend}</span>
}
function WeatherBadge({ weather }: { weather: string }) {
  const icons: Record<string, string> = { Clear: "☀️", Rain: "🌧️", "Heavy Rain": "⛈️", "Heat Wave": "🌡️", Fog: "🌫️", "Storm Warning": "⛈️" }
  return <Badge variant="outline" className="badge-interactive ddo-weather text-xs px-2 py-0.5 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400">{icons[weather] || "🌤️"} {weather}</Badge>
}

// ============================================================================
// Main Component
// ============================================================================
export default function DockDoorOptimizationView() {
  const [activeTab, setActiveTab] = useState("0")
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<string | null>(null)
  const [drawerRecord, setDrawerRecord] = useState<Record<string, unknown> | null>(null)
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])

  const genericSort = <T extends Record<string, unknown>>(arr: T[], col: string, asc: boolean): T[] =>
    [...arr].sort((a, b) => {
      const va = a[col], vb = b[col]
      if (typeof va === "number" && typeof vb === "number") return asc ? va - vb : vb - va
      return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc); else { setSortCol(col); setSortAsc(true) }
  }

  const SortHeader = ({ col, label }: { col: string; label: string }) => (
    <TableHead className={cn("ddo-sort-header cursor-pointer select-none text-xs", sortCol === col && "active")} onClick={() => handleSort(col)}>
      {label} {sortCol === col && <ArrowUpDown className="w-3 h-3 inline ml-1" />}
    </TableHead>
  )

  // Filtered data
  const filteredDoors = useMemo(() => {
    let f = data.doors
    if (search) f = f.filter(d => d.doorId.toLowerCase().includes(search.toLowerCase()) || d.carrier.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") f = f.filter(d => d.status === filterStatus)
    return sortCol ? genericSort(f as unknown as Record<string, unknown>[], sortCol, sortAsc) : f
  }, [search, filterStatus, sortCol, sortAsc, data.doors])

  const filteredAppts = useMemo(() => {
    let f = data.appointments
    if (search) f = f.filter(a => a.id.toLowerCase().includes(search.toLowerCase()) || a.carrier.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") f = f.filter(a => a.status === filterStatus)
    return sortCol ? genericSort(f as unknown as Record<string, unknown>[], sortCol, sortAsc) : f
  }, [search, filterStatus, sortCol, sortAsc, data.appointments])

  const filteredAlerts = useMemo(() => {
    let f = data.alerts
    if (search) f = f.filter(a => a.message.toLowerCase().includes(search.toLowerCase()) || a.alertType.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") f = f.filter(a => a.severity === filterStatus)
    return sortCol ? genericSort(f as unknown as Record<string, unknown>[], sortCol, sortAsc) : f
  }, [search, filterStatus, sortCol, sortAsc, data.alerts])

  return (
    <div className="space-y-6 ddo-root">
      <PageHeader title="Dock Door Optimization" description="Intelligent dock door scheduling, appointment management, and real-time throughput optimization across warehouse zones" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          {["Door Dashboard", "Door Registry", "Appointments", "Alerts & Events", "Scheduling Rules", "Analytics & Simulation"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className={cn(activeTab === String(i) && "ddo-tab-active")}>{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ddo-shimmer">
            {data.dashboardKPIs.map((kpi, i) => (
              <Card key={i} className={cn("ddo-kpi ddo-kpi-anim")} style={{ borderLeftColor: kpi.color }}>
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs text-muted-foreground">{kpi.label}</p><p className="text-xl font-bold tabular-nums mt-1">{kpi.value}</p></div>
                    <kpi.icon className="w-8 h-8 opacity-20" style={{ color: kpi.color }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="ddo-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Hourly Throughput (16h)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><AreaChart data={data.hourlyThroughput}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} /><Area type="monotone" dataKey="inbound" stackId="1" stroke="#3b82f6" fill="#3b82f640" /><Area type="monotone" dataKey="outbound" stackId="1" stroke="#059669" fill="#05966940" /><Area type="monotone" dataKey="crossDock" stackId="1" stroke="#d97706" fill="#d9770640" /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card className="ddo-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Zone Utilization</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.zoneUtil}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="utilization" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="ddo-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Carrier On-Time Performance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.carrierPerf} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis dataKey="carrier" type="category" tick={{ fontSize: 10 }} width={85} /><Tooltip /><Bar dataKey="onTime" fill="#059669" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>

        {/* Tab 1: Door Registry */}
        <TabsContent value="1">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search door, carrier..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger><SelectContent>{["all", ...data.DOOR_STATUSES].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card><CardContent className="glass-subtle p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow>{["doorId", "doorName", "type", "status", "zone", "carrier", "dwellMin", "utilization", "throughput", "lastActivity"].map(col => <SortHeader key={col} col={col} label={data.COL_LABELS[col] || col} />)}<TableHead className="text-xs">Actions</TableHead></TableRow></TableHeader><TableBody className="ddo-table ddo-table-tab1">{filteredDoors.slice(0, 35).map((d, i) => (<TableRow key={i} className="cursor-pointer" onClick={() => { setDrawerRecord(d as unknown as Record<string, unknown>); setDrawerType("door"); setDrawerOpen(true); }}><TableCell className="text-xs font-mono font-bold">{d.doorId}</TableCell><TableCell className="text-xs">{d.doorName}</TableCell><TableCell><DoorTypeBadge type={d.type} /></TableCell><TableCell><StatusBadge status={d.status} color={data.STATUS_COLORS[d.status] || "#475569"} /></TableCell><TableCell><ZoneBadge zone={d.zone} /></TableCell><TableCell className="text-xs">{d.carrier}</TableCell><TableCell><DwellBar mins={d.dwellMin} /></TableCell><TableCell className="text-xs tabular-nums">{d.utilization}%</TableCell><TableCell className="text-xs tabular-nums">{d.throughput}</TableCell><TableCell className="text-xs text-muted-foreground">{d.lastActivity}</TableCell><TableCell><Button size="sm" variant="ghost" className="ddo-action-btn" onClick={e => { e.stopPropagation(); toast.info("Door", `Door ${d.doorId} details`) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* Tab 2: Appointments */}
        <TabsContent value="2">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search appointment, carrier..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger><SelectContent>{["all", ...data.APPOINT_STATUSES].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card><CardContent className="numeric-cell glass-subtle p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow>{["id", "appointmentType", "status", "carrier", "doorId", "startTime", "dwellMin", "priority", "truckNo", "weight"].map(col => <SortHeader key={col} col={col} label={data.COL_LABELS[col] || col} />)}<TableHead className="text-xs">Actions</TableHead></TableRow></TableHeader><TableBody className="ddo-table ddo-table-tab2">{filteredAppts.slice(0, 35).map((a, i) => (<TableRow key={i} className="cursor-pointer" onClick={() => { setDrawerRecord(a as unknown as Record<string, unknown>); setDrawerType("appt"); setDrawerOpen(true); }}><TableCell className="text-xs font-mono">{a.id}</TableCell><TableCell><ApptTypeBadge type={a.appointmentType} /></TableCell><TableCell><StatusBadge status={a.status} color={data.STATUS_COLORS[a.status] || "#475569"} /></TableCell><TableCell><CarrierBadge carrier={a.carrier} /></TableCell><TableCell className="text-xs font-mono">{a.doorId}</TableCell><TableCell className="text-xs">{a.startTime}</TableCell><TableCell><DwellBar mins={a.dwellMin} /></TableCell><TableCell><PriorityBadge priority={a.priority} /></TableCell><TableCell><TruckBadge truck={a.truckNo} /></TableCell><TableCell className="text-xs tabular-nums">{a.weight.toLocaleString("en-IN")} kg</TableCell><TableCell><Button size="sm" variant="ghost" className="ddo-action-btn" onClick={e => { e.stopPropagation(); toast.info("Appointment", `${a.id} details`) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* Tab 3: Alerts & Events */}
        <TabsContent value="3">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search alert, message..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter severity" /></SelectTrigger><SelectContent>{["all", ...data.ALERT_SEVERITIES].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Severities" : s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {["Critical", "High", "Medium", "Low"].map((sev, i) => {
              const count = data.alerts.filter(a => a.severity === sev).length
              const c = ["#dc2626", "#ea580c", "#d97706", "#3b82f6"][i]
              return <Card key={i} className="glass-subtle ddo-alert-summary cursor-pointer" style={{ borderLeftColor: c }} onClick={() => setFilterStatus(sev)}><CardContent className="p-3"><p className="text-xs text-muted-foreground">{sev}</p><p className="text-2xl font-bold" style={{ color: c }}>{count}</p></CardContent></Card>
            })}
          </div>
          <Card><CardContent className="glass-subtle p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow>{["id", "alertType", "severity", "door", "timestamp", "resolved", "message"].map(col => <SortHeader key={col} col={col} label={data.COL_LABELS[col] || col} />)}<TableHead className="text-xs">Actions</TableHead></TableRow></TableHeader><TableBody className="ddo-table ddo-table-tab3">{filteredAlerts.slice(0, 25).map((a, i) => (<TableRow key={i} className="cursor-pointer" onClick={() => { setDrawerRecord(a as unknown as Record<string, unknown>); setDrawerType("alert"); setDrawerOpen(true); }}><TableCell className="text-xs font-mono">{a.id}</TableCell><TableCell className="text-xs">{a.alertType}</TableCell><TableCell><AlertSeverityBadge severity={a.severity} /></TableCell><TableCell className="text-xs">{a.door}</TableCell><TableCell className="text-xs text-muted-foreground">{a.timestamp}</TableCell><TableCell className={cn("text-xs", a.resolved === "Resolved" && "text-emerald-600", a.resolved === "Escalated" && "text-orange-600")}>{a.resolved}</TableCell><TableCell className="text-xs max-w-[250px] truncate">{a.message}</TableCell><TableCell><Button size="sm" variant="ghost" className="ddo-action-btn" onClick={e => { e.stopPropagation(); toast.info("Alert", `${a.id} details`) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* Tab 4: Scheduling Rules */}
        <TabsContent value="4">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {data.rules.map((r, i) => (
              <Card key={i} className={cn("ddo-rule-card", r.status === "Active" && "border-l-2 border-emerald-500")}>
                <CardContent className="glass-subtle p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="badge-interactive flex items-center gap-2"><Badge className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5">{r.id}</Badge><StatusBadge status={r.status} color={data.STATUS_COLORS[r.status] || "#475569"} /></div>
                    <PriorityBadge priority={r.priority} />
                  </div>
                  <p className="text-sm font-semibold">{r.ruleName}</p>
                  <div className="badge-interactive flex items-center gap-2 text-xs"><span className="text-muted-foreground">Type:</span><Badge variant="outline" className="px-2 py-0.5 border-slate-300 dark:border-slate-600">{r.ruleType}</Badge></div>
                  <div className="text-xs text-muted-foreground">Condition: <span className="font-medium text-foreground">{r.condition}</span></div>
                  <RuleEffectBar pct={r.effectiveness} />
                  <div className="flex gap-2">
                    {r.status === "Active" ? (
                      <Button size="sm" variant="outline" className="btn-outline-animate ddo-action-btn" onClick={() => toast.info("Paused", `Rule ${r.id} paused`)}><Pause className="w-3.5 h-3.5 mr-1" />Pause</Button>
                    ) : r.status === "Paused" ? (
                      <Button size="sm" className="ddo-action-btn flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success("Activated", `Rule ${r.id} activated`)}><Play className="w-3.5 h-3.5 mr-1" />Activate</Button>
                    ) : null}
                    {r.status !== "Archived" && <Button size="sm" variant="outline" className="btn-outline-animate ddo-action-btn" onClick={() => toast.info("Editing", `Rule ${r.id} edit mode`)}><Settings className="w-3.5 h-3.5" /></Button>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: Analytics & Simulation */}
        <TabsContent value="5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ddo-shimmer">
            {data.metrics.map((m, i) => (
              <Card key={i} className="ddo-metric-card" style={{ borderLeftColor: PIE_COLORS[i % PIE_COLORS.length] }}>
                <CardContent className="glass-subtle p-4">
                  <p className="text-xs text-muted-foreground">{m.metric}</p>
                  <p className="text-lg font-bold tabular-nums mt-1">{m.current}%</p>
                  <div className="flex items-center justify-between mt-1"><div className="text-xs text-muted-foreground">Target: {m.target}%</div><TrendIndicator trend={m.trend} /></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="ddo-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Simulation Scenarios</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.simScenarios}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="scenario" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="throughput" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="ddo-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Weather Impact</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.weatherImpact} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 100]} /><YAxis dataKey="condition" type="category" tick={{ fontSize: 10 }} width={90} /><Tooltip /><Bar dataKey="impactPct" fill="#d97706" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="glass-subtle ddo-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Equipment Status</CardTitle></CardHeader><CardContent className="space-y-2">{data.equipment.map((e, i) => (<div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/50"><EquipmentBadge equip={e.equipment} /><div className="flex-1"><div className="flex items-center justify-between"><span className="text-xs font-medium">{e.equipment}</span><span className={cn("text-xs tabular-nums", e.status === "Online" && "text-emerald-600", e.status === "Offline" && "text-red-600")}>{e.status}</span></div><Progress value={e.utilization} className="h-1.5 mt-1" /><span className="text-xs text-muted-foreground">{e.utilization}%</span></div></div>))}</CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Drawer */}
      <Sheet open={!!(drawerOpen && drawerType)} onOpenChange={setDrawerOpen}>
        <SheetContent className="ddo-drawer w-[420px] sm:w-[500px] overflow-y-auto">
          <>
            {drawerType === "door" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; doorId: string; doorName: string; type: string; status: string; zone: string; carrier: string; currentAppt: string; dwellMin: number; utilization: number; throughput: number; blockedReason: string; lastActivity: string }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><SheetTitle className="text-base">{rec.doorName} — {rec.type}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><DoorTypeBadge type={rec.type} /><StatusBadge status={rec.status} color={data.STATUS_COLORS[rec.status] || "#475569"} /><ZoneBadge zone={rec.zone} /><CarrierBadge carrier={rec.carrier} /></div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Door ID</span><div className="font-mono font-semibold">{rec.doorId}</div></div>
                    <div><span className="text-muted-foreground">Status</span><div><StatusBadge status={rec.status} color={data.STATUS_COLORS[rec.status] || "#475569"} /></div></div>
                    <div><span className="text-muted-foreground">Current Appt</span><div className="font-mono">{rec.currentAppt}</div></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Dwell Time</span><div className="mt-1"><DwellBar mins={rec.dwellMin} /></div></div>
                    <div><span className="text-muted-foreground">Utilization</span><div className="font-medium tabular-nums">{rec.utilization}%</div></div>
                    <div><span className="text-muted-foreground">Throughput</span><div className="font-medium tabular-nums">{rec.throughput} trips</div></div>
                    {rec.blockedReason && <div className="col-span-2"><span className="text-red-500 font-medium">Blocked:</span><div className="text-red-600">{rec.blockedReason}</div></div>}
                    <div><span className="text-muted-foreground">Last Activity</span><div className="font-medium">{rec.lastActivity}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="ddo-action-btn flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => { toast.success("Assigned", `Door ${rec.doorId} assigned`); setDrawerOpen(false) }}><Truck className="w-3.5 h-3.5 mr-1" />Assign</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddo-action-btn flex-1" onClick={() => { toast.info("Maintenance", `Door ${rec.doorId} maintenance`); setDrawerOpen(false) }}><Wrench className="w-3.5 h-3.5 mr-1" />Maintenance</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddo-action-btn" onClick={() => { toast.success("Released", `Door ${rec.doorId} released`); setDrawerOpen(false) }}><CheckCircle2 className="w-3.5 h-3.5" />Release</Button>
                  </div>
                </div>
              </>)
            })()}

            {drawerType === "appt" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; status: string; appointmentType: string; carrier: string; doorId: string; startTime: string; dwellMin: number; priority: string; truckNo: string; containerNo: string; weight: number; volume: number; endTime: string; date: string }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white"><SheetTitle className="text-base">{rec.id} — {rec.appointmentType}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><StatusBadge status={rec.status} color={data.STATUS_COLORS[rec.status] || "#475569"} /><ApptTypeBadge type={rec.appointmentType} /><CarrierBadge carrier={rec.carrier} /><PriorityBadge priority={rec.priority} /></div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Appointment ID</span><div className="font-mono font-semibold">{rec.id}</div></div>
                    <div><span className="text-muted-foreground">Door</span><div className="font-mono">{rec.doorId}</div></div>
                    <div><span className="text-muted-foreground">Time</span><div className="font-medium">{rec.startTime} → {rec.endTime}</div></div>
                    <div><span className="text-muted-foreground">Dwell</span><div className="mt-1"><DwellBar mins={rec.dwellMin} /></div></div>
                    <div><span className="text-muted-foreground">Truck</span><div className="font-mono">{rec.truckNo}</div></div>
                    <div><span className="text-muted-foreground">Container</span><div className="font-mono">{rec.containerNo}</div></div>
                    <div><span className="text-muted-foreground">Weight</span><div className="font-medium tabular-nums">{rec.weight.toLocaleString("en-IN")} kg</div></div>
                    <div><span className="text-muted-foreground">Volume</span><div className="font-medium tabular-nums">{rec.volume} CBM</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="ddo-action-btn flex-1 bg-teal-600 hover:bg-teal-700" onClick={() => { toast.success("Started", `Appt ${rec.id} started`); setDrawerOpen(false) }}><Play className="w-3.5 h-3.5 mr-1" />Start</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddo-action-btn flex-1" onClick={() => { toast.info("Redirected", `Appt ${rec.id} redirected`); setDrawerOpen(false) }}><Navigation className="w-3.5 h-3.5 mr-1" />Redirect</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddo-action-btn" onClick={() => { toast.warning("Cancelled", `Appt ${rec.id} cancelled`); setDrawerOpen(false) }}><XCircle className="w-3.5 h-3.5" />Cancel</Button>
                  </div>
                </div>
              </>)
            })()}

            {drawerType === "alert" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; alertType: string; severity: string; message: string; door: string; timestamp: string; resolved: string }
              return (<>
                <SheetHeader className={cn("px-4 py-4 rounded-t-xl text-white", rec.severity === "Critical" ? "bg-gradient-to-r from-red-600 to-rose-600" : rec.severity === "High" ? "bg-gradient-to-r from-orange-500 to-amber-500" : rec.severity === "Medium" ? "bg-gradient-to-r from-amber-500 to-yellow-500" : "bg-gradient-to-r from-blue-500 to-sky-500")}><SheetTitle className="text-base">{rec.alertType} — {rec.severity}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="badge-interactive flex items-center gap-2 flex-wrap"><AlertSeverityBadge severity={rec.severity} /><Badge variant="outline" className={cn("text-xs", rec.resolved === "Resolved" && "border-emerald-300 text-emerald-700")}>{rec.resolved}</Badge></div>
                  <p className="text-sm">{rec.message}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Alert ID</span><div className="font-mono font-semibold">{rec.id}</div></div>
                    <div><span className="text-muted-foreground">Door</span><div className="font-medium">{rec.door}</div></div>
                    <div><span className="text-muted-foreground">Timestamp</span><div className="font-medium">{rec.timestamp}</div></div>
                    <div><span className="text-muted-foreground">Type</span><div className="font-medium">{rec.alertType}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className={cn("ddo-action-btn flex-1", rec.resolved !== "Resolved" && "bg-emerald-600 hover:bg-emerald-700")} onClick={() => { toast.success("Resolved", `Alert ${rec.id} resolved`); setDrawerOpen(false) }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Resolve</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddo-action-btn flex-1" onClick={() => { toast.warning("Escalated", `Alert ${rec.id} escalated`); setDrawerOpen(false) }}><ArrowUpRight className="w-3.5 h-3.5 mr-1" />Escalate</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddo-action-btn" onClick={() => { toast.info("Ignored", `Alert ${rec.id} ignored`); setDrawerOpen(false) }}><Ban className="w-3.5 h-3.5" />Ignore</Button>
                  </div>
                </div>
              </>)
            })()}
          </>
        </SheetContent>
      </Sheet>
    </div>
  )
}
