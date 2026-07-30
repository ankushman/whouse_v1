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
  Send, Container, PlayCircle, SquareTerminal, GaugeCircle, Route, ThermometerSun,
  ClipboardList, Move, Anchor, Radio, Ruler, Loader2, PauseCircle, ArrowRight,
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

// ============================================================================
// Enums
// ============================================================================
const SPOT_TYPES = ["Container Spot", "Chassis Move", "Trailer Swap", "Reefer Connect", "Empty Reposition", "Export Staging", "Import Devanning", "Cross-Dock Transfer"] as const
const SPOT_STATUSES = ["Pending", "Assigned", "In Transit", "Completed", "Cancelled", "Delayed", "Blocked", "Emergency"] as const
const YARD_ZONES = ["Zone A - North Yard", "Zone B - South Yard", "Zone C - East Yard", "Zone D - West Yard", "Zone E - Reefer Yard", "Zone F - Hazmat Yard", "Zone G - Overflow", "Zone H - Rail Siding"] as const
const TRAILER_TYPES = ["Flatbed", "Chassis 20ft", "Chassis 40ft", "Chassis 45ft", "Tanker", "Reefer", "Open Top", "Curtain Sider", "Skeleton", "Dropside"] as const
const TRAILER_STATUSES = ["Available", "Loaded", "Unloading", "Maintenance", "Inspection", "Reserved", "In Transit", "Damaged"] as const
const EQUIP_TYPES = ["Yard Truck", "Terminal Tractor", "Reach Stacker", "Top Loader", "RTG Crane", "Straddle Carrier", "Empty Handler", "Lift Truck", "Side Loader", "Tow Tractor"] as const
const EQUIP_STATUSES = ["Online", "Working", "Idle", "Maintenance", "Fueling", "Charging", "Offline", "Breakdown"] as const
const TASK_TYPES = ["Spot Move", "Shunt Operation", "Container Inspect", "Equipment Maintenance", "Emergency Response", "Gate Check-In", "Weighbridge", "Cleaning"] as const
const TASK_STATUSES = ["Pending", "In Progress", "Completed", "Failed", "Cancelled", "Escalated", "On Hold", "Reassigned"] as const
const PRIORITIES = ["Critical", "High", "Medium", "Low", "Routine"] as const
const DRIVERS = ["Rajesh Kumar", "Sunil Patel", "Amit Singh", "Suresh Yadav", "Vijay Sharma", "Manoj Gupta", "Pradeep Joshi", "Ramesh Verma", "Anil Mehta", "Deepak Tiwari", "Sanjay Mishra", "Harish Chauhan", "Kiran Reddy", "Naveen Rao", "Ganesh Patil"] as const
const PORTS = ["JNPT Mumbai", "Mundra Gujarat", "Chennai TN", "Hazira Gujarat", "Kolkata", "Cochin", "Ennore", "Kandla"] as const
const COMPANIES = ["Container Corp", "Adani Ports", "DP World", "APM Terminals", "PSA Intl", "JM Baxi", "DHL Supply", "BlueDart", "TCI Express", "Allcargo", "VRL Logistics", "Mahindra Logistics"] as const
const MAINT_TYPES = ["Engine Service", "Tire Change", "Brake Repair", "Hydraulic Check", "Electrical", "Battery Replace", "Oil Change", "Filter Replace", "Alignment", "Annual Inspection"] as const

const STATUS_COLORS: Record<string, string> = {
  Pending: "#d97706", Assigned: "#3b82f6", "In Transit": "#0891b2", Completed: "#059669",
  Cancelled: "#9ca3af", Delayed: "#ea580c", Blocked: "#dc2626", Emergency: "#dc2626",
  Available: "#059669", Loaded: "#3b82f6", Unloading: "#8b5cf6", Maintenance: "#d97706",
  Inspection: "#4f46e5", Reserved: "#0891b2", Damaged: "#dc2626",
  Online: "#059669", Working: "#0d9488", Idle: "#d97706", Fueling: "#3b82f6",
  Charging: "#4f46e5", Offline: "#6b7280", Breakdown: "#dc2626",
  "In Progress": "#0891b2", Failed: "#dc2626", Escalated: "#ea580c",
  "On Hold": "#d97706", Reassigned: "#4f46e5",
  Critical: "#dc2626", High: "#ea580c", Medium: "#d97706", Low: "#3b82f6", Routine: "#6b7280",
}
const ZONE_COLORS: Record<string, string> = {
  "Zone A": "#3b82f6", "Zone B": "#8b5cf6", "Zone C": "#0d9488", "Zone D": "#059669",
  "Zone E": "#0891b2", "Zone F": "#dc2626", "Zone G": "#d97706", "Zone H": "#4f46e5",
}
const PIE_COLORS = ["#3b82f6", "#d97706", "#0d9488", "#dc2626", "#059669", "#4f46e5", "#0891b2", "#ea580c"]
const COL_LABELS: Record<string, string> = {
  id: "ID", spotId: "Spot ID", containerNo: "Container", fromLoc: "From", toLoc: "To",
  tractor: "Tractor", driver: "Driver", status: "Status", priority: "Priority",
  distance: "Dist", time: "Time", type: "Type", duration: "Duration",
  trailerId: "Trailer", trailerType: "Type", capacity: "Cap", location: "Location",
  currentLoad: "Load", lastMove: "Last Move", maintDue: "Maint Due",
  equipId: "Equip ID", equipType: "Type", utilization: "Util%", fuelLevel: "Fuel",
  operator: "Operator", hoursSinceMaint: "Hours Maint", taskId: "Task ID",
  taskType: "Type", assignedTo: "Assigned", scheduledTime: "Scheduled", completedTime: "Completed",
  gpsLat: "GPS Lat", gpsLng: "GPS Lng", port: "Port", company: "Company",
}
const TRUCK_PLATES = ["MH", "KA", "TN", "DL", "GJ", "RJ", "UP", "WB", "TS", "AP"]

// ============================================================================
// generateData
// ============================================================================
function generateData() {
  const zones = Array.from({ length: 8 }, (_, i) => ({ zone: YARD_ZONES[i], color: ZONE_COLORS[`Zone ${String.fromCharCode(65 + i)}`] || "#475569" }))

  const spots = Array.from({ length: 60 }, (_, i) => {
    const seed = i * 17 + 1
    return {
      id: `SPT-${String(i + 1).padStart(4, "0")}`,
      spotType: pick(SPOT_TYPES, seed) as string,
      containerNo: pick(["MSKU", "TCNU", "CMAU", "FCIU", "TEMU", "HLBU", "OOLU", "ONEU"], seed + 1) as string + String(ri(1000000, 9999999, seed + 2)),
      fromLoc: pick(YARD_ZONES, seed + 3) as string,
      toLoc: pick(YARD_ZONES, seed + 4) as string,
      tractor: `YT-${String(ri(1, 25, seed + 5)).padStart(3, "0")}`,
      driver: pick(DRIVERS, seed + 6) as string,
      status: pick(SPOT_STATUSES, seed + 7) as string,
      priority: pick(PRIORITIES, seed + 8) as string,
      distance: ri(50, 800, seed + 9),
      time: `${String(ri(6, 22, seed + 10)).padStart(2, "0")}:${String(ri(0, 59, seed + 11)).padStart(2, "0")}`,
      duration: ri(5, 120, seed + 12),
      port: pick(PORTS, seed + 13) as string,
    }
  })

  const trailers = Array.from({ length: 55 }, (_, i) => {
    const seed = i * 23 + 100
    return {
      id: `TRL-${String(i + 1).padStart(4, "0")}`,
      trailerType: pick(TRAILER_TYPES, seed) as string,
      capacity: pick(["20ft", "40ft", "45ft", "30T", "25T", "15T"], seed + 1) as string,
      status: pick(TRAILER_STATUSES, seed + 2) as string,
      location: pick(YARD_ZONES, seed + 3) as string,
      currentLoad: ri(0, 100, seed + 4),
      driver: pick(DRIVERS, seed + 5) as string,
      lastMove: `2025-07-${String(ri(1, 29, seed + 6)).padStart(2, "0")}`,
      maintDue: `2025-${String(ri(8, 12, seed + 7)).padStart(2, "0")}-${String(ri(1, 28, seed + 8)).padStart(2, "0")}`,
      gpsLat: (ri(8, 28, seed + 9) + seededRandom(seed + 10) * 0.99).toFixed(4),
      gpsLng: (ri(68, 88, seed + 11) + seededRandom(seed + 12) * 0.99).toFixed(4),
      company: pick(COMPANIES, seed + 13) as string,
    }
  })

  const equipment = Array.from({ length: 50 }, (_, i) => {
    const seed = i * 29 + 200
    return {
      id: `EQ-${String(i + 1).padStart(4, "0")}`,
      equipType: pick(EQUIP_TYPES, seed) as string,
      status: pick(EQUIP_STATUSES, seed + 1) as string,
      utilization: ri(10, 98, seed + 2),
      fuelLevel: ri(5, 100, seed + 3),
      operator: pick(DRIVERS, seed + 4) as string,
      hoursSinceMaint: ri(0, 500, seed + 5),
      location: pick(YARD_ZONES, seed + 6) as string,
      port: pick(PORTS, seed + 7) as string,
      company: pick(COMPANIES, seed + 8) as string,
    }
  })

  const tasks = Array.from({ length: 45 }, (_, i) => {
    const seed = i * 31 + 300
    return {
      id: `TSK-${String(i + 1).padStart(4, "0")}`,
      taskType: pick(TASK_TYPES, seed) as string,
      priority: pick(PRIORITIES, seed + 1) as string,
      status: pick(TASK_STATUSES, seed + 2) as string,
      assignedTo: pick(DRIVERS, seed + 3) as string,
      scheduledTime: `2025-07-29 ${String(ri(6, 22, seed + 4)).padStart(2, "0")}:${String(ri(0, 59, seed + 5)).padStart(2, "0")}`,
      completedTime: pick(["", "", "", `2025-07-29 ${String(ri(6, 22, seed + 6)).padStart(2, "0")}:${String(ri(0, 59, seed + 7)).padStart(2, "0")}`], seed + 8) as string,
      location: pick(YARD_ZONES, seed + 9) as string,
      duration: ri(5, 240, seed + 10),
    }
  })

  const kpis = [
    { label: "Total Trucks", value: 50, change: ri(-5, 12, 1), icon: "Truck" },
    { label: "Active Moves", value: 34, change: ri(-8, 15, 2), icon: "Move" },
    { label: "Yard Utilization", value: `${ri(60, 92, 3)}%`, change: ri(-3, 8, 4), icon: "Gauge" },
    { label: "Today's Spots", value: 87, change: ri(-5, 20, 5), icon: "Target" },
    { label: "Equipment Online", value: 42, change: ri(-2, 5, 6), icon: "Radio" },
    { label: "Pending Tasks", value: 12, change: ri(-10, 3, 7), icon: "ClipboardList" },
    { label: "Avg Turnaround", value: `${ri(25, 65, 8)}m`, change: ri(-12, 5, 9), icon: "Timer" },
    { label: "Yard Revenue", value: formatINR(ri(800000, 2500000, 10)), change: ri(-3, 18, 11), icon: "IndianRupee" },
  ]

  const weeklyTrend = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    spots: ri(60, 120, i * 7 + 50),
    moves: ri(40, 95, i * 7 + 51),
    tasks: ri(20, 60, i * 7 + 52),
  }))

  const zoneUtil = zones.map((z, i) => ({ zone: z.zone.split(" - ")[1] || z.zone, utilization: ri(45, 95, i * 11 + 70), capacity: ri(80, 150, i * 11 + 71) }))

  const typeDist = Array.from({ length: 8 }, (_, i) => ({ type: SPOT_TYPES[i], count: ri(15, 60, i * 13 + 90) }))

  const analyticsKpis = [
    { label: "Daily Spots Rate", value: `${ri(85, 98, 1)}%`, trend: ri(-2, 5, 2) },
    { label: "Fleet Utilization", value: `${ri(65, 92, 3)}%`, trend: ri(-3, 8, 4) },
    { label: "Equipment Uptime", value: `${ri(88, 99, 5)}%`, trend: ri(-1, 4, 6) },
    { label: "Avg Spot Time", value: `${ri(20, 45, 7)}m`, trend: ri(-10, 3, 8) },
    { label: "Fuel Efficiency", value: `${ri(6, 12, 9)} km/L`, trend: ri(-2, 5, 10) },
    { label: "Maintenance Backlog", value: String(ri(2, 8, 11)), trend: ri(-5, 2, 12) },
    { label: "Safety Score", value: `${ri(90, 99, 13)}/100`, trend: ri(-1, 3, 14) },
    { label: "Cost per Spot", value: formatINR(ri(800, 2500, 15)), trend: ri(-5, 8, 16) },
  ]

  const dailyOps = Array.from({ length: 14 }, (_, i) => ({
    date: `Jul ${i + 16}`,
    operations: ri(60, 140, i * 7 + 200),
    spots: ri(40, 100, i * 7 + 201),
    inspections: ri(10, 40, i * 7 + 202),
  }))

  const equipUtil = Array.from({ length: 8 }, (_, i) => ({
    type: EQUIP_TYPES[i],
    avgUtil: ri(40, 95, i * 11 + 250),
    available: ri(3, 12, i * 11 + 251),
    total: ri(5, 15, i * 11 + 252),
  }))

  const spotTime = Array.from({ length: 6 }, (_, i) => ({
    range: ["<15m", "15-30m", "30-60m", "60-90m", "90-120m", ">120m"][i],
    count: ri(20, 80, i * 13 + 300),
  }))

  const costAnalysis = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    labor: ri(200000, 500000, i * 7 + 350),
    fuel: ri(100000, 300000, i * 7 + 351),
    maintenance: ri(50000, 200000, i * 7 + 352),
  }))

  return {
    enums: { SPOT_TYPES, SPOT_STATUSES, YARD_ZONES, TRAILER_TYPES, TRAILER_STATUSES, EQUIP_TYPES, EQUIP_STATUSES, TASK_TYPES, TASK_STATUSES, PRIORITIES, DRIVERS, PORTS, COMPANIES, MAINT_TYPES },
    kpis, weeklyTrend, zoneUtil, typeDist, analyticsKpis, dailyOps, equipUtil, spotTime, costAnalysis,
    spots, trailers, equipment, tasks, zones,
  }
}

// ============================================================================
// Helper Components
// ============================================================================
function SpotStatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || "#475569"
  return <Badge className={cn("yt-status-badge text-[10px] font-mono", status === "In Transit" && "yt-pulse-cyan", status === "Delayed" && "yt-pulse-orange", status === "Blocked" && "yt-pulse-red", status === "Emergency" && "yt-pulse-red")} style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}40` }}>{status}</Badge>
}

function TrailerTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = { Flatbed: "#3b82f6", "Chassis 20ft": "#059669", "Chassis 40ft": "#0d9488", "Chassis 45ft": "#4f46e5", Tanker: "#d97706", Reefer: "#0891b2", "Open Top": "#ea580c", "Curtain Sider": "#7c3aed", Skeleton: "#6b7280", Dropside: "#92400e" }
  const c = colors[type] || "#475569"
  return <Badge className="badge-interactive yt-trailer-badge text-[10px] font-mono" style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}40` }}>{type}</Badge>
}

function EquipmentTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = { "Yard Truck": "#3b82f6", "Terminal Tractor": "#ea580c", "Reach Stacker": "#059669", "Top Loader": "#4f46e5", "RTG Crane": "#d97706", "Straddle Carrier": "#0891b2", "Empty Handler": "#7c3aed", "Lift Truck": "#0d9488", "Side Loader": "#92400e", "Tow Tractor": "#6b7280" }
  const c = colors[type] || "#475569"
  return <Badge className="badge-interactive yt-equip-badge text-[10px] font-mono" style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}40` }}>{type}</Badge>
}

function FuelLevelBar({ level }: { level: number }) {
  const color = level >= 60 ? "#059669" : level >= 30 ? "#d97706" : "#dc2626"
  return <div className="yt-fuel-bar"><div className="yt-fuel-bar-fill" style={{ width: `${level}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}><span className="yt-fuel-bar-text">{level}%</span></div></div>
}

function UtilizationRing({ pct }: { pct: number }) {
  const color = pct >= 80 ? "#059669" : pct >= 50 ? "#d97706" : "#dc2626"
  return <div className="flex items-center gap-2"><div className="yt-util-ring" style={{ background: `conic-gradient(${color} ${pct * 3.6}deg, #e2e8f0 0deg)` }}><div className="yt-util-ring-inner"><span className="text-[10px] font-bold" style={{ color }}>{pct}%</span></div></div></div>
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = { Critical: "#dc2626", High: "#ea580c", Medium: "#d97706", Low: "#3b82f6", Routine: "#6b7280" }
  const c = colors[priority] || "#475569"
  return <Badge className="badge-interactive yt-priority-badge text-[10px]" style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}40` }}>{priority}</Badge>
}

function LocationTile({ location }: { location: string }) {
  const zoneKey = location.split(" - ")[0]
  const c = ZONE_COLORS[zoneKey] || "#475569"
  return <div className="yt-location-tile" style={{ borderLeftColor: c }}><MapPin className="w-3 h-3 text-muted-foreground" /><span className="text-xs font-medium truncate">{location}</span></div>
}

function ContainerNumberBadge({ no }: { no: string }) {
  return <Badge className="badge-interactive yt-container-badge font-mono text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-2">{no}</Badge>
}

function DriverInfoTile({ name, license, phone }: { name: string; license: string; phone: string }) {
  return <div className="yt-driver-tile"><User className="w-3 h-3 text-muted-foreground" /><div><div className="text-xs font-medium">{name}</div><div className="text-[10px] text-muted-foreground">{license}</div><div className="text-[10px] text-muted-foreground">{phone}</div></div></div>
}

function MoveDistanceTile({ meters }: { meters: number }) {
  return <div className="yt-distance-tile"><Route className="w-3 h-3 text-muted-foreground" /><span className="text-xs tabular-nums">{meters}m</span></div>
}

function GpsCoordsTile({ lat, lng }: { lat: string; lng: string }) {
  return <div className="yt-gps-tile"><Navigation className="w-3 h-3 text-muted-foreground" /><span className="text-[10px] font-mono">{lat}°N, {lng}°E</span></div>
}

function TaskTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = { "Spot Move": "#3b82f6", "Shunt Operation": "#0d9488", "Container Inspect": "#4f46e5", "Equipment Maintenance": "#d97706", "Emergency Response": "#dc2626", "Gate Check-In": "#059669", Weighbridge: "#7c3aed", Cleaning: "#6b7280" }
  const c = colors[type] || "#475569"
  return <Badge className="badge-interactive yt-task-badge text-[10px]" style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}40` }}>{type}</Badge>
}

function MaintenanceDueIndicator({ date }: { date: string }) {
  const now = new Date("2025-07-29")
  const due = new Date(date)
  const days = Math.max(0, Math.floor((due.getTime() - now.getTime()) / 86400000))
  const color = days <= 3 ? "#dc2626" : days <= 7 ? "#d97706" : "#059669"
  return <Badge className="badge-interactive yt-maint-indicator text-[10px]" style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}40` }}>{days <= 3 ? `⚠ ${days}d` : `${days}d`}</Badge>
}

function SpotRouteTile({ from, to, dist }: { from: string; to: string; dist: number }) {
  return <div className="yt-route-tile"><div className="yt-route-from">{from.split(" - ")[1]}</div><ArrowRight className="w-3 h-3 text-muted-foreground" /><div className="yt-route-to">{to.split(" - ")[1]}</div><div className="yt-route-dist">{dist}m</div></div>
}

function TurnaroundTimer({ mins }: { mins: number }) {
  const color = mins <= 30 ? "#059669" : mins <= 60 ? "#d97706" : "#dc2626"
  return <div className="yt-turnaround" style={{ color }}>{mins}m</div>
}

function YardZoneBadge({ zone }: { zone: string }) {
  const zoneKey = zone.split(" - ")[0]
  const c = ZONE_COLORS[zoneKey] || "#475569"
  return <Badge className="badge-interactive yt-zone-badge text-[10px]" style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}40` }}>{zone.split(" - ")[0]}</Badge>
}

function OperatorBadge({ name }: { name: string }) {
  return <div className="yt-operator-badge"><User className="w-3 h-3" /><span className="text-xs">{name}</span></div>
}

function CostTile({ amount }: { amount: number }) {
  return <div className="yt-cost-tile"><IndianRupee className="w-3 h-3 text-muted-foreground" /><span className="text-xs font-medium tabular-nums">{formatINR(amount)}</span></div>
}

function LoadIndicator({ pct, weight }: { pct: number; weight: number }) {
  const color = pct >= 80 ? "#dc2626" : pct >= 50 ? "#d97706" : "#059669"
  return <div className="yt-load-indicator"><Progress value={pct} className="h-1.5" style={{ "--progress-color": color } as React.CSSProperties} /><span className="text-[10px] tabular-nums" style={{ color }}>{pct}% ({weight.toLocaleString("en-IN")} kg)</span></div>
}

function SortHeader({ label, field, sort, onSort }: { label: string; field: string; sort: string; onSort: (f: string) => void }) {
  return <TableHead><button className="yt-sort-header" onClick={() => onSort(field)}>{label}<ArrowUpDown className={cn("w-3 h-3 ml-1", sort === field && "text-foreground opacity-100")} /></button></TableHead>
}

function TrendIndicator({ trend }: { trend: number }) {
  return <div className={cn("flex items-center text-xs", trend >= 0 ? "text-emerald-600" : "text-red-500")}>{trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}<span className="tabular-nums ml-1">{trend >= 0 ? "+" : ""}{trend}%</span></div>
}

function EquipStatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || "#475569"
  return <Badge className={cn("yt-equip-status text-[10px]", status === "Breakdown" && "yt-pulse-red", status === "Working" && "yt-pulse-cyan")} style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}40` }}>{status}</Badge>
}

// ============================================================================
// Main Component
// ============================================================================
export default function YardTruckingView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState<string>("0")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("id")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<string>("")
  const [drawerRecord, setDrawerRecord] = useState<unknown>(null)

  const handleSort = (f: string) => setSort(f === sort ? `${f}_desc` : f)
  const sortFn = (a: Record<string, unknown>, b: Record<string, unknown>, f: string) => {
    const desc = f.endsWith("_desc")
    const field = desc ? f.slice(0, -5) : f
    const aVal = String(a[field] ?? "")
    const bVal = String(b[field] ?? "")
    return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
  }

  const filteredSpots = useMemo(() => {
    let arr = [...data.spots]
    if (search) arr = arr.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    if (statusFilter !== "all") arr = arr.filter(r => r.status === statusFilter)
    return arr.sort((a, b) => sortFn(a as Record<string, unknown>, b as Record<string, unknown>, sort))
  }, [data, search, sort, statusFilter])

  const filteredTrailers = useMemo(() => {
    let arr = [...data.trailers]
    if (search) arr = arr.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    if (statusFilter !== "all") arr = arr.filter(r => r.status === statusFilter)
    return arr.sort((a, b) => sortFn(a as Record<string, unknown>, b as Record<string, unknown>, sort))
  }, [data, search, sort, statusFilter])

  const filteredEquipment = useMemo(() => {
    let arr = [...data.equipment]
    if (search) arr = arr.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    if (statusFilter !== "all") arr = arr.filter(r => r.status === statusFilter)
    return arr.sort((a, b) => sortFn(a as Record<string, unknown>, b as Record<string, unknown>, sort))
  }, [data, search, sort, statusFilter])

  const filteredTasks = useMemo(() => {
    let arr = [...data.tasks]
    if (search) arr = arr.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    if (statusFilter !== "all") arr = arr.filter(r => r.status === statusFilter)
    return arr.sort((a, b) => sortFn(a as Record<string, unknown>, b as Record<string, unknown>, sort))
  }, [data, search, sort, statusFilter])

  return (
    <div className="space-y-4">
      <PageHeader title="Yard Trucking Enhancement" description="Yard operations management — spotting, shunting, trailer management & equipment tracking" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="yt-tab-list">
          {["Yard Dashboard", "Spotting Operations", "Shunting & Trailers", "Yard Equipment", "Task Management", "Yard Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="yt-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 yt-shimmer">
            {data.kpis.map((k, i) => (
              <Card key={i} className="hover-lift-sm yt-kpi-card" style={{ borderLeftColor: PIE_COLORS[i % PIE_COLORS.length] }}>
                <CardContent className="inner-glow glass-subtle p-4">
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className="text-lg font-bold tabular-nums mt-1">{k.value}</p>
                  <div className="flex items-center justify-between mt-1"><TrendIndicator trend={k.change} /></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover-lift-sm yt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Weekly Operations Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><AreaChart data={data.weeklyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="spots" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" /><Area type="monotone" dataKey="moves" fill="#0d9488" fillOpacity={0.3} stroke="#0d9488" /><Legend /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm yt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Zone Utilization</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.zoneUtil}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="utilization" fill="#4f46e5" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm yt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Spot Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={data.typeDist} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} label={({ type, percent }) => `${type.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{data.typeDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>

        {/* Tab 1: Spotting Operations */}
        <TabsContent value="1">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search spots..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{data.enums.SPOT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-lg border overflow-hidden"><Table><TableHeader><TableRow><TableHead className="yt-table-row">#</TableHead><SortHeader label={COL_LABELS.id} field="id" sort={sort} onSort={handleSort} /><SortHeader label={COL_LABELS.spotType} field="spotType" sort={sort} onSort={handleSort} /><TableHead className="yt-table-row">{COL_LABELS.containerNo}</TableHead><TableHead className="yt-table-row">Route</TableHead><TableHead className="yt-table-row">{COL_LABELS.driver}</TableHead><SortHeader label={COL_LABELS.status} field="status" sort={sort} onSort={handleSort} /><SortHeader label={COL_LABELS.priority} field="priority" sort={sort} onSort={handleSort} /><TableHead className="yt-table-row">{COL_LABELS.distance}</TableHead><TableHead className="yt-table-row">Action</TableHead></TableRow></TableHeader><TableBody>{filteredSpots.slice(0, 30).map((r, i) => (
            <TableRow key={r.id} className="yt-table-row-hover">
              <TableCell className="text-xs tabular-nums">{i + 1}</TableCell>
              <TableCell><Badge variant="outline" className="badge-interactive text-[10px] font-mono">{r.id}</Badge></TableCell>
              <TableCell><Badge className="badge-interactive yt-spot-type-badge text-[10px]">{r.spotType}</Badge></TableCell>
              <TableCell><ContainerNumberBadge no={r.containerNo} /></TableCell>
              <TableCell><SpotRouteTile from={r.fromLoc} to={r.toLoc} dist={r.distance} /></TableCell>
              <TableCell><div className="text-xs">{r.driver}</div></TableCell>
              <TableCell><SpotStatusBadge status={r.status} /></TableCell>
              <TableCell><PriorityBadge priority={r.priority} /></TableCell>
              <TableCell><MoveDistanceTile meters={r.distance} /></TableCell>
              <TableCell><Button size="sm" variant="ghost" className="press-scale yt-action-btn" onClick={() => { setDrawerRecord(r); setDrawerType("spot"); setDrawerOpen(true) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell>
            </TableRow>
          ))}</TableBody></Table></div>
        </TabsContent>

        {/* Tab 2: Shunting & Trailers */}
        <TabsContent value="2">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search trailers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{data.enums.TRAILER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-lg border overflow-hidden"><Table><TableHeader><TableRow><TableHead className="yt-table-row">#</TableHead><SortHeader label={COL_LABELS.trailerId} field="id" sort={sort} onSort={handleSort} /><SortHeader label={COL_LABELS.trailerType} field="trailerType" sort={sort} onSort={handleSort} /><SortHeader label={COL_LABELS.capacity} field="capacity" sort={sort} onSort={handleSort} /><SortHeader label={COL_LABELS.status} field="status" sort={sort} onSort={handleSort} /><TableHead className="yt-table-row">{COL_LABELS.location}</TableHead><TableHead className="yt-table-row">{COL_LABELS.currentLoad}</TableHead><TableHead className="yt-table-row">{COL_LABELS.driver}</TableHead><TableHead className="yt-table-row">{COL_LABELS.maintDue}</TableHead><TableHead className="yt-table-row">GPS</TableHead><TableHead className="yt-table-row">Action</TableHead></TableRow></TableHeader><TableBody>{filteredTrailers.slice(0, 30).map((r, i) => (
            <TableRow key={r.id} className="yt-table-row-hover">
              <TableCell className="text-xs tabular-nums">{i + 1}</TableCell>
              <TableCell><Badge variant="outline" className="badge-interactive text-[10px] font-mono">{r.id}</Badge></TableCell>
              <TableCell><TrailerTypeBadge type={r.trailerType} /></TableCell>
              <TableCell className="text-xs">{r.capacity}</TableCell>
              <TableCell><SpotStatusBadge status={r.status} /></TableCell>
              <TableCell><LocationTile location={r.location} /></TableCell>
              <TableCell><LoadIndicator pct={r.currentLoad} weight={ri(500, 25000, i * 17)} /></TableCell>
              <TableCell><div className="text-xs">{r.driver}</div></TableCell>
              <TableCell><MaintenanceDueIndicator date={r.maintDue} /></TableCell>
              <TableCell><GpsCoordsTile lat={r.gpsLat} lng={r.gpsLng} /></TableCell>
              <TableCell><Button size="sm" variant="ghost" className="press-scale yt-action-btn" onClick={() => { setDrawerRecord(r); setDrawerType("trailer"); setDrawerOpen(true) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell>
            </TableRow>
          ))}</TableBody></Table></div>
        </TabsContent>

        {/* Tab 3: Yard Equipment */}
        <TabsContent value="3">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{data.enums.EQUIP_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.slice(0, 24).map((r, i) => (
              <Card key={r.id} className="hover-lift-sm yt-equip-card">
                <CardContent className="inner-glow glass-subtle p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="badge-interactive flex items-center gap-2"><Badge className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2">{r.id}</Badge><EquipmentTypeBadge type={r.equipType} /></div>
                    <EquipStatusBadge status={r.status} />
                  </div>
                  <div className="flex items-center gap-3">
                    <UtilizationRing pct={r.utilization} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Fuel</span><FuelLevelBar level={r.fuelLevel} /></div>
                      <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Maint Hours</span><span className="tabular-nums">{r.hoursSinceMaint}h</span></div>
                    </div>
                  </div>
                  <OperatorBadge name={r.operator} />
                  <LocationTile location={r.location} />
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>Port: {r.port}</span><span>·</span><span>{r.company}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="press-scale yt-action-btn flex-1 bg-teal-600 hover:bg-teal-700" onClick={() => toast.info("Deploying", `Equipment ${r.id} deploying`)}><PlayCircle className="w-3.5 h-3.5 mr-1" />Deploy</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn" onClick={() => toast.info("Servicing", `Equipment ${r.id} service scheduled`)}><Wrench className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn" onClick={() => { setDrawerRecord(r); setDrawerType("equip"); setDrawerOpen(true) }}><Eye className="w-3.5 h-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Task Management */}
        <TabsContent value="4">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{data.enums.TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-lg border overflow-hidden"><Table><TableHeader><TableRow><TableHead className="yt-table-row">#</TableHead><SortHeader label={COL_LABELS.taskId} field="id" sort={sort} onSort={handleSort} /><SortHeader label={COL_LABELS.taskType} field="taskType" sort={sort} onSort={handleSort} /><SortHeader label={COL_LABELS.priority} field="priority" sort={sort} onSort={handleSort} /><SortHeader label={COL_LABELS.status} field="status" sort={sort} onSort={handleSort} /><TableHead className="yt-table-row">{COL_LABELS.assignedTo}</TableHead><TableHead className="yt-table-row">{COL_LABELS.scheduledTime}</TableHead><TableHead className="yt-table-row">{COL_LABELS.duration}</TableHead><TableHead className="yt-table-row">{COL_LABELS.location}</TableHead><TableHead className="yt-table-row">Action</TableHead></TableRow></TableHeader><TableBody>{filteredTasks.slice(0, 30).map((r, i) => (
            <TableRow key={r.id} className="yt-table-row-hover">
              <TableCell className="text-xs tabular-nums">{i + 1}</TableCell>
              <TableCell><Badge variant="outline" className="badge-interactive text-[10px] font-mono">{r.id}</Badge></TableCell>
              <TableCell><TaskTypeBadge type={r.taskType} /></TableCell>
              <TableCell><PriorityBadge priority={r.priority} /></TableCell>
              <TableCell><SpotStatusBadge status={r.status} /></TableCell>
              <TableCell><div className="text-xs">{r.assignedTo}</div></TableCell>
              <TableCell className="text-xs tabular-nums">{r.scheduledTime}</TableCell>
              <TableCell><TurnaroundTimer mins={r.duration} /></TableCell>
              <TableCell><LocationTile location={r.location} /></TableCell>
              <TableCell><Button size="sm" variant="ghost" className="press-scale yt-action-btn" onClick={() => { setDrawerRecord(r); setDrawerType("task"); setDrawerOpen(true) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell>
            </TableRow>
          ))}</TableBody></Table></div>
        </TabsContent>

        {/* Tab 5: Analytics */}
        <TabsContent value="5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 yt-shimmer">
            {data.analyticsKpis.map((k, i) => (
              <Card key={i} className="hover-lift-sm yt-analytics-card" style={{ borderLeftColor: PIE_COLORS[i % PIE_COLORS.length] }}>
                <CardContent className="inner-glow glass-subtle p-4">
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className="text-lg font-bold tabular-nums mt-1">{k.value}</p>
                  <TrendIndicator trend={k.trend} />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover-lift-sm yt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Daily Operations (14-Day)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={data.dailyOps}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="operations" stroke="#3b82f6" strokeWidth={2} /><Line type="monotone" dataKey="spots" stroke="#0d9488" strokeWidth={2} /><Legend /></LineChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm yt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Equipment Utilization by Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.equipUtil}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="type" tick={{ fontSize: 8 }} angle={-20} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 10 }} domain={[0, 100]} /><Tooltip /><Bar dataKey="avgUtil" fill="#4f46e5" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm yt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Spot Time Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.spotTime}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm yt-chart-card md:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost Analysis (6-Month)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><AreaChart data={data.costAnalysis}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Area type="monotone" dataKey="labor" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" /><Area type="monotone" dataKey="fuel" fill="#d97706" fillOpacity={0.3} stroke="#d97706" /><Area type="monotone" dataKey="maintenance" fill="#059669" fillOpacity={0.3} stroke="#059669" /><Legend /></AreaChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Drawer */}
      <Sheet open={!!(drawerOpen && drawerType)} onOpenChange={setDrawerOpen}>
        <SheetContent className="yt-drawer w-[420px] sm:w-[500px] overflow-y-auto">
          <>
            {drawerType === "spot" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; spotType: string; containerNo: string; fromLoc: string; toLoc: string; tractor: string; driver: string; status: string; priority: string; distance: number; duration: number; time: string; port: string }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl text-white bg-gradient-to-r from-slate-600 to-gray-700"><SheetTitle className="text-base">{rec.spotType} — {rec.id}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><SpotStatusBadge status={rec.status} /><PriorityBadge priority={rec.priority} /></div>
                  <ContainerNumberBadge no={rec.containerNo} />
                  <SpotRouteTile from={rec.fromLoc} to={rec.toLoc} dist={rec.distance} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Tractor</span><div className="font-mono">{rec.tractor}</div></div>
                    <div><span className="text-muted-foreground">Driver</span><div className="font-medium">{rec.driver}</div></div>
                    <div><span className="text-muted-foreground">Duration</span><div className="tabular-nums"><TurnaroundTimer mins={rec.duration} /></div></div>
                    <div><span className="text-muted-foreground">Port</span><div className="font-medium">{rec.port}</div></div>
                    <div><span className="text-muted-foreground">Time</span><div className="tabular-nums">{rec.time}</div></div>
                    <div><span className="text-muted-foreground">Distance</span><div className="tabular-nums">{rec.distance}m</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn flex-1" onClick={() => { toast.info("Reassigned", `Spot ${rec.id} reassigned`); setDrawerOpen(false) }}><ArrowUpDown className="w-3.5 h-3.5 mr-1" />Reassign</Button>
                    <Button size="sm" className="press-scale yt-action-btn flex-1 bg-slate-700 hover:bg-slate-800 text-white" onClick={() => { toast.success("Tracking", `Spot ${rec.id} tracking`); setDrawerOpen(false) }}><Navigation className="w-3.5 h-3.5 mr-1" />Track</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn" onClick={() => { toast.warning("Cancelled", `Spot ${rec.id} cancelled`); setDrawerOpen(false) }}><XCircle className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </>)
            })()}

            {drawerType === "trailer" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; trailerType: string; capacity: string; status: string; location: string; currentLoad: number; driver: string; lastMove: string; maintDue: string; gpsLat: string; gpsLng: string; company: string }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600"><SheetTitle className="text-base">{rec.trailerType} — {rec.id}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><TrailerTypeBadge type={rec.trailerType} /><SpotStatusBadge status={rec.status} /><MaintenanceDueIndicator date={rec.maintDue} /></div>
                  <LocationTile location={rec.location} />
                  <LoadIndicator pct={rec.currentLoad} weight={ri(500, 25000, 42)} />
                  <GpsCoordsTile lat={rec.gpsLat} lng={rec.gpsLng} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Capacity</span><div className="font-medium">{rec.capacity}</div></div>
                    <div><span className="text-muted-foreground">Driver</span><div className="font-medium">{rec.driver}</div></div>
                    <div><span className="text-muted-foreground">Last Move</span><div className="tabular-nums">{rec.lastMove}</div></div>
                    <div><span className="text-muted-foreground">Company</span><div className="font-medium">{rec.company}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="press-scale yt-action-btn flex-1 bg-teal-600 hover:bg-teal-700" onClick={() => { toast.success("Dispatched", `Trailer ${rec.id} dispatched`); setDrawerOpen(false) }}><Send className="w-3.5 h-3.5 mr-1" />Dispatch</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn flex-1" onClick={() => { toast.info("Inspecting", `Trailer ${rec.id} inspection`); setDrawerOpen(false) }}><Eye className="w-3.5 h-3.5 mr-1" />Inspect</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn" onClick={() => { toast.warning("Maintenance", `Trailer ${rec.id} maintenance`); setDrawerOpen(false) }}><Wrench className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </>)
            })()}

            {drawerType === "equip" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; equipType: string; status: string; utilization: number; fuelLevel: number; operator: string; hoursSinceMaint: number; location: string; port: string; company: string }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl text-white bg-gradient-to-r from-amber-500 to-orange-500"><SheetTitle className="text-base">{rec.equipType} — {rec.id}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><EquipmentTypeBadge type={rec.equipType} /><EquipStatusBadge status={rec.status} /></div>
                  <div className="flex items-center gap-4">
                    <UtilizationRing pct={rec.utilization} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Fuel Level</span><FuelLevelBar level={rec.fuelLevel} /></div>
                      <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Hours Since Maint</span><span className="tabular-nums font-medium">{rec.hoursSinceMaint}h</span></div>
                    </div>
                  </div>
                  <OperatorBadge name={rec.operator} />
                  <LocationTile location={rec.location} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Port</span><div className="font-medium">{rec.port}</div></div>
                    <div><span className="text-muted-foreground">Company</span><div className="font-medium">{rec.company}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="press-scale yt-action-btn flex-1 bg-amber-600 hover:bg-amber-700 text-white" onClick={() => { toast.success("Deployed", `Equipment ${rec.id} deployed`); setDrawerOpen(false) }}><PlayCircle className="w-3.5 h-3.5 mr-1" />Deploy</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn flex-1" onClick={() => { toast.info("Servicing", `Equipment ${rec.id} service`); setDrawerOpen(false) }}><Wrench className="w-3.5 h-3.5 mr-1" />Service</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn" onClick={() => { toast.warning("Retired", `Equipment ${rec.id} retired`); setDrawerOpen(false) }}><XCircle className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </>)
            })()}

            {drawerType === "task" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; taskType: string; priority: string; status: string; assignedTo: string; scheduledTime: string; completedTime: string; location: string; duration: number }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600"><SheetTitle className="text-base">{rec.taskType} — {rec.id}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><TaskTypeBadge type={rec.taskType} /><PriorityBadge priority={rec.priority} /><SpotStatusBadge status={rec.status} /></div>
                  <LocationTile location={rec.location} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Assigned To</span><div className="font-medium">{rec.assignedTo}</div></div>
                    <div><span className="text-muted-foreground">Duration</span><div className="tabular-nums"><TurnaroundTimer mins={rec.duration} /></div></div>
                    <div><span className="text-muted-foreground">Scheduled</span><div className="tabular-nums">{rec.scheduledTime}</div></div>
                    <div><span className="text-muted-foreground">Completed</span><div className="tabular-nums">{rec.completedTime || "—"}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="press-scale yt-action-btn flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => { toast.success("Completed", `Task ${rec.id} completed`); setDrawerOpen(false) }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Complete</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn flex-1" onClick={() => { toast.warning("Escalated", `Task ${rec.id} escalated`); setDrawerOpen(false) }}><ArrowUpRight className="w-3.5 h-3.5 mr-1" />Escalate</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate yt-action-btn" onClick={() => { toast.info("Reassigned", `Task ${rec.id} reassigned`); setDrawerOpen(false) }}><ArrowUpDown className="w-3.5 h-3.5" /></Button>
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
