"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Truck, MapPin, Clock, Package, Star, Fuel, IndianRupee, Users,
  Route, TrendingUp, ArrowUpRight, ArrowDownRight, Navigation, Phone,
  BarChart3, Target, Warehouse, PackageCheck, Timer, Zap, ShieldCheck,
  CalendarDays, AlertTriangle, CheckCircle2, XCircle, RefreshCw,
  Search, Eye, Weight, Boxes, Building2, Sun, Moon, ChevronRight,
  Thermometer, Snowflake, Droplets, Wind, AlertOctagon, ThermometerSnowflake,
  Gauge, Radio, Satellite, type LucideIcon,
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
const pick = <T,>(arr: readonly T[], seed: number) =>
  arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) =>
  Math.floor(seededRandom(seed) * (max - min + 1)) + min
const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr`
  : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L`
  : `₹${n.toLocaleString("en-IN")}`

// ============================================================================
// Enums
// ============================================================================
const CONSIGNMENT_STATUSES = ["Packed", "In Cold Room", "Loading", "In Transit", "At Hub", "Unloading", "Last Mile", "Delivered", "Temperature Alert", "Rejected"] as const
const PRODUCT_CATEGORIES = ["Dairy", "Frozen Food", "Fresh Produce", "Meat & Seafood", "Pharmaceuticals", "Beverages", "Confectionery", "Floral", "Chemical Reagents", "Ice Cream"] as const
const TEMPERATURE_ZONES = ["Deep Freeze (-25°C)", "Frozen (-18°C)", "Chill (2-8°C)", "Cool (8-15°C)", "Ambient Controlled"] as const
const VEHICLE_TYPES = ["Reefer Truck", "Cold Van", "Reefer Container", "Insulated Box", "Ice Pack Shipment", "Temperature-Controlled Ambulance"] as const
const ALERT_CATEGORIES = ["Temperature Breach", "Door Open", "Humidity Alert", "Power Failure", "Sensor Malfunction", "Delay Risk", "Chain of Custody", "Expiry Warning"] as const
const COMPLIANCE_TYPES = ["FSSAI", "WHO GDP", "EU GDP", "FDA 21 CFR", "ISO 22000", "HACCP", "GDP", "Schedule M"] as const
const COLD_ROOM_TYPES = ["Blast Freezer", "Cold Storage", "Chill Room", "Ripening Room", "Pre-Cool Chamber", "IQF Tunnel"] as const
const SENSOR_TYPES = ["IoT Temperature", "Humidity Sensor", "GPS Tracker", "Door Sensor", "Shock Sensor", "Light Sensor"] as const
const INDIAN_CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Cochin", "Vizag"] as const
const CUSTOMER_NAMES = [
  "Amul Dairy", "Mother Dairy", "Hatsun Agro", "Heritage Foods", "Parag Milk",
  "MilkMantra", "Pradeshik Co-op", "Kwality Dairy", "Dynamix Dairy", "Creamline",
  "Godrej Agrovet", "Venkateshwara Hatcheries", "Suguna Foods", "FreshToHome",
  "Licious", "ZappFresh", "Meatigo", "Ebro Foods", "McCain Foods", "Nomad Foods",
  "ITC Foods", "Britannia", "Nestle India", "Hindustan Unilever", "PepsiCo",
  "Coca-Cola India", "Red Bull India", "Bisleri", "Danone India", "Abbott India",
  "Cipla", "Sun Pharma", "Dr. Reddys", "Lupin", "Aurobindo Pharma",
  "Biocon", "Zydus Lifesciences", "Divis Labs", "GlaxoSmithKline", "Sanofi India",
  "Mankind Pharma", "Alkem Labs", "Macleods Pharma", "Torrent Pharma", "Cadila Healthcare",
  "BigBasket", "Blinkit", "Zepto", "Dunzo", "Spencer Retail", "More Retail",
  "DMart", "Reliance Fresh", "Nature Basket", "Nandus", "ZopNow", "Licious Cold",
] as const

// ============================================================================
// Color Maps
// ============================================================================
const STATUS_COLORS: Record<string, string> = {
  "Packed": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "In Cold Room": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Loading": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "In Transit": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 cce-status-pulse-active",
  "At Hub": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Unloading": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Last Mile": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 cce-status-pulse-active",
  "Delivered": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Temperature Alert": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 cce-status-pulse-failed",
  "Rejected": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
}
const ZONE_COLORS: Record<string, string> = {
  "Deep Freeze (-25°C)": "bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  "Frozen (-18°C)": "bg-cyan-200 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200",
  "Chill (2-8°C)": "bg-teal-200 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200",
  "Cool (8-15°C)": "bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  "Ambient Controlled": "bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
}
const VEHICLE_COLORS: Record<string, string> = {
  "Reefer Truck": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Cold Van": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Reefer Container": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Insulated Box": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Ice Pack Shipment": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Temperature-Controlled Ambulance": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}
const ALERT_COLORS: Record<string, string> = {
  "Temperature Breach": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 cce-status-pulse-failed",
  "Door Open": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Humidity Alert": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Power Failure": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 cce-status-pulse-failed",
  "Sensor Malfunction": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Delay Risk": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Chain of Custody": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Expiry Warning": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
}
const COMPLIANCE_COLORS: Record<string, string> = {
  "FSSAI": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "WHO GDP": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "EU GDP": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "FDA 21 CFR": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "ISO 22000": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "HACCP": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "GDP": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Schedule M": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
}
const ROOM_COLORS: Record<string, string> = {
  "Blast Freezer": "bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  "Cold Storage": "bg-cyan-200 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200",
  "Chill Room": "bg-teal-200 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200",
  "Ripening Room": "bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  "Pre-Cool Chamber": "bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  "IQF Tunnel": "bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200",
}
const CHART_COLORS = ["#0891b2", "#7c3aed", "#ea580c", "#e11d48", "#059669", "#d97706", "#6366f1", "#14b8a6"]

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const statuses = CONSIGNMENT_STATUSES
  const categories = PRODUCT_CATEGORIES
  const zones = TEMPERATURE_ZONES
  const vehicles = VEHICLE_TYPES
  const alertCats = ALERT_CATEGORIES
  const compliances = COMPLIANCE_TYPES
  const rooms = COLD_ROOM_TYPES
  const sensors = SENSOR_TYPES
  const cities = INDIAN_CITIES
  const customers = CUSTOMER_NAMES

  const kpis = {
    totalConsignments: 1845, activeShipments: 634, tempAlerts: 12, avgTemp: 4.2,
    coldRoomsActive: 18, complianceRate: 97.8, fleetUtilization: 86.4, shelfLifeUtil: 78.5,
  }

  const dailyVolume = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    Shipped: ri(60, 140, i * 7 + 1),
    Delivered: ri(50, 120, i * 7 + 2),
    Alerts: ri(1, 8, i * 7 + 3),
    Rejected: ri(0, 5, i * 7 + 4),
  }))

  const zoneUtilization = zones.map((z, i) => ({
    zone: z.split(" ")[0] + (z.includes("-") ? ` ${z.match(/-?\d+°C/)?.[0] || ""}` : ""),
    Utilization: ri(60, 98, i * 11 + 100),
    Capacity: ri(200, 800, i * 11 + 101),
  }))

  const categoryPie = categories.map((c, i) => ({
    name: c, value: ri(30, 250, i * 13 + 200),
  }))

  const consignments = Array.from({ length: 75 }, (_, i) => {
    const s = i * 19 + 500
    const zone = pick(zones, s + 1)
    const tempRange = zone.includes("Deep") ? [-30, -20] : zone.includes("Frozen") ? [-22, -14] : zone.includes("Chill") ? [1, 8] : zone.includes("Cool") ? [8, 15] : [15, 25]
    const currentTemp = +(seededRandom(s + 15) * (tempRange[1] - tempRange[0]) + tempRange[0]).toFixed(1)
    const isAlert = zone.includes("Chill") && (currentTemp > 8 || currentTemp < 2) || zone.includes("Frozen") && currentTemp > -14
    return {
      id: `CCE-${String(5000 + i).slice(1)}`,
      customer: pick(customers, s + 2),
      category: pick(categories, s + 3),
      status: isAlert ? "Temperature Alert" as const : pick(statuses.filter(x => x !== "Temperature Alert"), s + 4),
      zone,
      vehicle: pick(vehicles, s + 5),
      currentTemp,
      targetTemp: +(seededRandom(s + 16) * (tempRange[1] - tempRange[0]) + tempRange[0]).toFixed(1),
      humidity: `${ri(30, 95, s + 7)}%`,
      weight: `${(seededRandom(s + 8) * 15 + 1).toFixed(1)} MT`,
      origin: pick(cities, s + 9),
      destination: pick(cities, s + 10),
      eta: `${ri(1, 28, s + 11)}/${ri(1, 12, s + 12)}/2025`,
      expiryDate: `${ri(1, 28, s + 13)}/${ri(1, 12, s + 14)}/2025`,
      value: formatINR(ri(50000, 5000000, s + 17)),
      sensors: ri(1, 6, s + 18),
      shelfLifeRemaining: `${ri(1, 30, s + 19)} days`,
    }
  })

  const coldRooms = Array.from({ length: 50 }, (_, i) => {
    const s = i * 23 + 800
    const room = pick(rooms, s)
    const zone = room === "Blast Freezer" ? "Deep Freeze (-25°C)" as const : room === "Cold Storage" ? "Frozen (-18°C)" as const : room === "Chill Room" ? "Chill (2-8°C)" as const : room === "Ripening Room" ? "Cool (8-15°C)" as const : room === "Pre-Cool Chamber" ? "Chill (2-8°C)" as const : "Frozen (-18°C)" as const
    const tempRange = zone.includes("Deep") ? [-30, -20] : zone.includes("Frozen") ? [-22, -14] : [1, 8]
    return {
      id: `CR-${String(3000 + i).slice(1)}`,
      name: `${room} ${pick(["A", "B", "C", "D"], s + 1)}${ri(1, 12, s + 2)}`,
      type: room,
      zone,
      capacity: ri(200, 1000, s + 3),
      occupancy: ri(30, 95, s + 4),
      currentTemp: +(seededRandom(s + 5) * (tempRange[1] - tempRange[0]) + tempRange[0]).toFixed(1),
      targetTemp: +(seededRandom(s + 6) * (tempRange[1] - tempRange[0]) + tempRange[0]).toFixed(1),
      humidity: `${ri(40, 90, s + 7)}%`,
      location: pick(cities, s + 8),
      powerStatus: seededRandom(s + 9) > 0.1 ? "Normal" : "Backup Generator",
      doorStatus: seededRandom(s + 10) > 0.85 ? "Open" : "Sealed",
      defrostCycle: `${ri(4, 8, s + 11)}/${ri(1, 12, s + 12)}/2025`,
      alarmCount: ri(0, 5, s + 13),
    }
  })

  const alerts = Array.from({ length: 60 }, (_, i) => {
    const s = i * 29 + 1200
    const cat = pick(alertCats, s + 1)
    const severity = cat === "Temperature Breach" || cat === "Power Failure" ? "Critical" : cat === "Door Open" || cat === "Sensor Malfunction" ? "High" : cat === "Humidity Alert" || cat === "Delay Risk" ? "Medium" : "Low"
    return {
      id: `ALR-${String(4000 + i).slice(1)}`,
      category: cat,
      severity,
      consignment: `CCE-${String(5000 + ri(0, 74, s + 2)).slice(1)}`,
      location: pick(cities, s + 3),
      room: pick(rooms, s + 4),
      description: `${cat} detected — ${pick(["Zone A3", "Reefer TR-405", "Cold Room B7", "Chill Van V-12", "Container CNTR-891"], s + 5)}`,
      temperature: `${(seededRandom(s + 6) * 35 - 15).toFixed(1)}°C`,
      acknowledged: seededRandom(s + 7) > 0.4,
      resolved: seededRandom(s + 8) > 0.7,
      createdAt: `${ri(1, 28, s + 9)}/${ri(1, 12, s + 10)}/2025`,
    }
  })

  const complianceRecords = Array.from({ length: 55 }, (_, i) => {
    const s = i * 37 + 1600
    const comp = pick(compliances, s)
    const status = seededRandom(s + 1) > 0.15 ? "Compliant" : seededRandom(s + 1) > 0.05 ? "Pending Review" : "Non-Compliant"
    return {
      id: `CMP-${String(6000 + i).slice(1)}`,
      type: comp,
      customer: pick(customers, s + 2),
      status,
      lastAudit: `${ri(1, 28, s + 3)}/${ri(1, 12, s + 4)}/2025`,
      nextAudit: `${ri(1, 28, s + 5)}/${ri(1, 12, s + 6)}/2025`,
      score: status === "Compliant" ? ri(90, 100, s + 7) : status === "Pending Review" ? ri(70, 89, s + 7) : ri(40, 69, s + 7),
      auditor: pick(["FSSAI Inspector", "WHO GDP Auditor", "Internal QA", "FDA Auditor", "ISO Auditor"], s + 8),
      city: pick(cities, s + 9),
      findings: status === "Non-Compliant" ? ri(1, 5, s + 10) : 0,
    }
  })

  const analyticsKpis = {
    avgTempVariance: "0.3°C", onTimeDelivery: "93.7%", rejectionRate: "0.8%",
    energyCostPerMT: "₹2,450", avgShelfLife: "18 days", sensorUptime: "99.2%",
    fleetUtilization: "86.4%", complianceScore: "97.8%",
  }
  const tempTrend = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    "Deep Freeze": +(seededRandom(i * 41 + 2200) * 5 - 27.5).toFixed(1),
    "Chill": +(seededRandom(i * 41 + 2201) * 6 + 2).toFixed(1),
    "Cool": +(seededRandom(i * 41 + 2202) * 7 + 8).toFixed(1),
  }))
  const roomUtilization = rooms.map((r, i) => ({
    room: r, Utilization: ri(50, 98, i * 43 + 2400),
  }))
  const alertTrend = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    Breaches: ri(5, 30, i * 47 + 2600),
    Resolved: ri(3, 28, i * 47 + 2601),
  }))
  const energyCost = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    "Deep Freeze": ri(800000, 2000000, i * 53 + 2800),
    "Chill": ri(300000, 800000, i * 53 + 2801),
    "Cool": ri(100000, 400000, i * 53 + 2802),
  }))

  return {
    kpis, dailyVolume, zoneUtilization, categoryPie, consignments, coldRooms,
    alerts, complianceRecords, analyticsKpis, tempTrend, roomUtilization,
    alertTrend, energyCost,
  }
}

// ============================================================================
// Unique Visual Components
// ============================================================================
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>
      {(status === "In Transit" || status === "Last Mile") && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" /></span>}
      {(status === "Temperature Alert" || status === "Rejected") && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" /></span>}
      {status}
    </span>
  )
}

function ZoneBadge({ zone }: { zone: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", ZONE_COLORS[zone] || "")}><Snowflake className="h-3 w-3" /> {zone}</span>
}

function VehicleBadge({ type }: { type: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", VEHICLE_COLORS[type] || "")}>{type}</span>
}

function CategoryBadge({ cat }: { cat: string }) {
  return <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">{cat}</span>
}

function AlertCategoryBadge({ cat }: { cat: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold", ALERT_COLORS[cat] || "")}>
      {(cat === "Temperature Breach" || cat === "Power Failure") && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" /></span>}
      {cat}
    </span>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = { Critical: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", Low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" }
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", colors[severity] || "")}>{severity}</span>
}

function ComplianceTypeBadge({ type }: { type: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", COMPLIANCE_COLORS[type] || "")}>{type}</span>
}

function ComplianceStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { Compliant: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", "Pending Review": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "Non-Compliant": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" }
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", colors[status] || "")}>{status}</span>
}

function RoomTypeBadge({ type }: { type: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", ROOM_COLORS[type] || "")}>{type}</span>
}

function TempTile({ current, target, label }: { current: number; target: number; label?: string }) {
  const diff = Math.abs(current - target)
  const isOk = diff <= 2
  const color = isOk ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
  return (
    <div className="cce-tile-temp flex items-center gap-1.5">
      <Thermometer className={cn("h-3.5 w-3.5", color)} />
      <span className={cn("text-xs font-bold", color)}>{current}°C</span>
      {label && <span className="text-xs text-gray-400">/ {target}°C</span>}
      {!isOk && <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" /></span>}
    </div>
  )
}

function HumidityTile({ humidity }: { humidity: string }) {
  return (
    <div className="cce-tile-humidity flex items-center gap-1.5">
      <Droplets className="h-3.5 w-3.5 text-blue-500" />
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{humidity}</span>
    </div>
  )
}

function OccupancyBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? "from-rose-400 to-rose-500" : pct >= 70 ? "from-amber-400 to-amber-500" : "from-emerald-400 to-emerald-500"
  return (
    <div className="flex items-center gap-2">
      <div className="cce-occupancy-bar h-2.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{pct}%</span>
    </div>
  )
}

function PowerStatusBadge({ status }: { status: string }) {
  const color = status === "Normal" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", color)}>⚡ {status}</span>
}

function DoorStatusBadge({ status }: { status: string }) {
  const color = status === "Sealed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 cce-status-pulse-warning"
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", color)}>{status}</span>
}

function SensorCountBadge({ count }: { count: number }) {
  return <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-900/40 dark:text-slate-300"><Satellite className="h-3 w-3 mr-1" />{count} sensors</span>
}

function ShelfLifeTile({ days }: { days: string }) {
  const num = parseInt(days)
  const color = num <= 7 ? "text-rose-600 dark:text-rose-400" : num <= 14 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
  return (
    <div className="cce-tile-shelf flex items-center gap-1">
      <Clock className={cn("h-3.5 w-3.5", color)} />
      <span className={cn("text-xs font-semibold", color)}>{days}</span>
    </div>
  )
}

function ComplianceScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "from-emerald-400 to-emerald-500" : score >= 70 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"
  return (
    <div className="flex items-center gap-2">
      <div className="cce-compliance-bar h-2.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r", color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{score}</span>
    </div>
  )
}

function RouteTile({ origin, destination }: { origin: string; destination: string }) {
  return (
    <div className="cce-tile-route flex items-center gap-2 text-xs">
      <span className="font-medium">{origin}</span>
      <ChevronRight className="h-3 w-3 text-gray-400" />
      <span className="font-medium">{destination}</span>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export default function ColdChainEnhancementView() {
  const [activeTab, setActiveTab] = useState("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedConsignment, setSelectedConsignment] = useState<typeof data.consignments[0] | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<typeof data.coldRooms[0] | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<typeof data.alerts[0] | null>(null)
  const [selectedCompliance, setSelectedCompliance] = useState<typeof data.complianceRecords[0] | null>(null)
  const { toast } = useToast()

  const data = useMemo(() => generateData(), [])

  const sortData = <T extends Record<string, unknown>>(arr: T[], col: string) => {
    if (!sortCol || sortCol !== col) return arr
    return [...arr].sort((a, b) => {
      const va = a[col], vb = b[col]
      if (typeof va === "number" && typeof vb === "number") return sortAsc ? va - vb : vb - va
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }
  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc)
    else { setSortCol(col); setSortAsc(true) }
  }
  const SortHeader = ({ col, children }: { col: string; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => handleSort(col)}>
      <div className={cn("flex items-center gap-1 transition-all", sortCol === col ? "font-bold text-cyan-700 dark:text-cyan-300 scale-105" : "hover:text-cyan-600")}>
        {children} {sortCol === col && (sortAsc ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
      </div>
    </TableHead>
  )

  const kpis = [
    { label: "Total Consignments", value: data.kpis.totalConsignments.toLocaleString(), icon: Package, color: "from-cyan-500 to-cyan-600", change: "+10%" },
    { label: "Active Shipments", value: data.kpis.activeShipments.toLocaleString(), icon: Truck, color: "from-blue-500 to-blue-600", change: "+5%" },
    { label: "Temperature Alerts", value: data.kpis.tempAlerts.toString(), icon: ThermometerSnowflake, color: "from-rose-500 to-rose-600", change: "-25%" },
    { label: "Avg Temperature", value: `${data.kpis.avgTemp}°C`, icon: Thermometer, color: "from-teal-500 to-teal-600", change: "-0.1°" },
    { label: "Cold Rooms Active", value: data.kpis.coldRoomsActive.toString(), icon: Warehouse, color: "from-indigo-500 to-indigo-600", change: "+2" },
    { label: "Compliance Rate", value: `${data.kpis.complianceRate}%`, icon: ShieldCheck, color: "from-emerald-500 to-emerald-600", change: "+0.5%" },
    { label: "Fleet Utilization", value: `${data.kpis.fleetUtilization}%`, icon: Gauge, color: "from-amber-500 to-amber-600", change: "+3.2%" },
    { label: "Shelf Life Util.", value: `${data.kpis.shelfLifeUtil}%`, icon: Timer, color: "from-violet-500 to-violet-600", change: "+1.8%" },
  ]

  const filteredConsignments = sortData(data.consignments.filter(c =>
    !searchTerm || c.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  ), sortCol || "id")

  return (
    <div className="cce-container space-y-4">
      <PageHeader title="Cold Chain Enhancement" description="End-to-end temperature-controlled logistics for perishables, pharma & frozen goods across India" />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="cce-tabs-list bg-gray-100 dark:bg-gray-800">
          {["Cold Chain Dashboard", "Consignment Tracker", "Cold Room Monitor", "Alerts & Incidents", "Compliance & Audits", "Cold Chain Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="cce-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className="cce-kpi-card relative overflow-hidden border-l-4" style={{ borderLeftColor: ["#0891b2","#3b82f6","#e11d48","#0d9488","#6366f1","#059669","#d97706","#7c3aed"][i] }}>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80" style={{ background: `linear-gradient(90deg, ${["#0891b2","#3b82f6","#e11d48","#0d9488","#6366f1","#059669","#d97706","#7c3aed"][i]}, ${["#06b6d4","#60a5fa","#f43f5e","#14b8a6","#818cf8","#34d399","#f59e0b","#a78bfa"][i]})` }} />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{k.label}</p>
                      <p className="cce-kpi-value mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{k.value}</p>
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{k.change}</p>
                    </div>
                    <div className={cn("cce-kpi-icon flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md", k.color)}><k.icon className="h-5 w-5" /></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="cce-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Daily Cold Chain Volume</CardTitle></CardHeader><CardContent><AreaChart data={data.dailyVolume}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="Shipped" stackId="1" stroke="#0891b2" fill="#0891b280" /><Area type="monotone" dataKey="Delivered" stackId="1" stroke="#059669" fill="#05966980" /><Area type="monotone" dataKey="Alerts" stackId="1" stroke="#e11d48" fill="#e11d4880" /></AreaChart></CardContent></Card>
            <Card className="cce-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Product Category Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.categoryPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{data.categoryPie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="cce-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Zone Utilization (%)</CardTitle></CardHeader><CardContent><BarChart data={data.zoneUtilization}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="Utilization" fill="#0891b2" /></BarChart></CardContent></Card>
          </div>
        </TabsContent>

        {/* Tab 1: Consignments */}
        <TabsContent value="1" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search by customer, ID or category..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); toast.info("Cleared", "Filters reset") }}>Clear</Button>
          </div>
          <Card className="cce-table-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="id">ID</SortHeader>
                  <TableHead>Customer</TableHead>
                  <TableHead>Category</TableHead>
                  <SortHeader col="status">Status</SortHeader>
                  <TableHead>Zone</TableHead>
                  <SortHeader col="currentTemp">Temp</SortHeader>
                  <TableHead>Humidity</TableHead>
                  <TableHead>Shelf Life</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Sensors</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredConsignments.slice(0, 25).map((c, i) => (
                    <TableRow key={c.id} className={cn("cce-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20")}>
                      <TableCell className="font-mono text-xs font-medium">{c.id}</TableCell>
                      <TableCell className="text-xs font-medium max-w-[130px] truncate">{c.customer}</TableCell>
                      <TableCell><CategoryBadge cat={c.category} /></TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell><ZoneBadge zone={c.zone} /></TableCell>
                      <TableCell><TempTile current={c.currentTemp} target={c.targetTemp} /></TableCell>
                      <TableCell><HumidityTile humidity={c.humidity} /></TableCell>
                      <TableCell><ShelfLifeTile days={c.shelfLifeRemaining} /></TableCell>
                      <TableCell><RouteTile origin={c.origin} destination={c.destination} /></TableCell>
                      <TableCell><SensorCountBadge count={c.sensors} /></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="cce-action-btn" onClick={() => { setSelectedConsignment(c); toast.info("Consignment", `Viewing ${c.id}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Cold Rooms */}
        <TabsContent value="2" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.coldRooms.slice(0, 30).map(r => (
              <Card key={r.id} className="cce-room-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="h-1 bg-gradient-to-r" style={{ background: r.type === "Blast Freezer" ? "linear-gradient(90deg,#3b82f6,#06b6d4)" : r.type === "Cold Storage" ? "linear-gradient(90deg,#0891b2,#14b8a6)" : r.type === "Chill Room" ? "linear-gradient(90deg,#0d9488,#059669)" : "linear-gradient(90deg,#d97706,#f59e0b)" }} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.id} · {r.location}</p>
                    </div>
                    <RoomTypeBadge type={r.type} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <ZoneBadge zone={r.zone} />
                    <PowerStatusBadge status={r.powerStatus} />
                    <DoorStatusBadge status={r.doorStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Occupancy</span>
                    <OccupancyBar pct={r.occupancy} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <TempTile current={r.currentTemp} target={r.targetTemp} label={undefined} />
                    <HumidityTile humidity={r.humidity} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Capacity: {r.capacity} MT</span>
                    <span className="text-gray-500">Alarms: {r.alarmCount}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="cce-action-btn flex-1 text-xs" onClick={() => { setSelectedRoom(r); toast.info("Cold Room", `Viewing ${r.name}`) }}>Details</Button>
                    <Button size="sm" className="cce-action-btn flex-1 bg-cyan-600 text-xs hover:bg-cyan-700" onClick={() => toast.success("Defrost", `Defrost cycle initiated for ${r.name}`)}>Defrost</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Alerts */}
        <TabsContent value="3" className="space-y-4">
          <Card className="cce-table-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <TableHead>Severity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Consignment</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Temp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {data.alerts.slice(0, 25).map((a, i) => (
                    <TableRow key={a.id} className={cn("cce-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20")}>
                      <TableCell><SeverityBadge severity={a.severity} /></TableCell>
                      <TableCell><AlertCategoryBadge cat={a.category} /></TableCell>
                      <TableCell className="font-mono text-xs">{a.consignment}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{a.description}</TableCell>
                      <TableCell className="text-xs">{a.location}</TableCell>
                      <TableCell><TempTile current={parseFloat(a.temperature)} target={4} /></TableCell>
                      <TableCell>
                        {a.resolved ? <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><CheckCircle2 className="h-3 w-3" /> Resolved</span>
                        : a.acknowledged ? <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"><Eye className="h-3 w-3" /> Acknowledged</span>
                        : <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-900/40 dark:text-gray-300"><AlertTriangle className="h-3 w-3" /> Pending</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" className="cce-action-btn" onClick={() => { setSelectedAlert(a); toast.info("Alert", `Viewing ${a.id}`) }}><Eye className="h-4 w-4" /></Button>
                          {!a.resolved && <Button size="sm" variant="ghost" className="cce-action-btn text-emerald-600" onClick={() => toast.success("Resolved", `Alert ${a.id} resolved`)}><CheckCircle2 className="h-4 w-4" /></Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Compliance */}
        <TabsContent value="4" className="space-y-4">
          <Card className="cce-table-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <SortHeader col="status">Status</SortHeader>
                  <SortHeader col="score">Score</SortHeader>
                  <TableHead>City</TableHead>
                  <TableHead>Auditor</TableHead>
                  <TableHead>Last Audit</TableHead>
                  <TableHead>Findings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {data.complianceRecords.slice(0, 25).map((c, i) => (
                    <TableRow key={c.id} className={cn("cce-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20")}>
                      <TableCell className="font-mono text-xs">{c.id}</TableCell>
                      <TableCell><ComplianceTypeBadge type={c.type} /></TableCell>
                      <TableCell className="text-xs max-w-[130px] truncate">{c.customer}</TableCell>
                      <TableCell><ComplianceStatusBadge status={c.status} /></TableCell>
                      <TableCell><ComplianceScoreBar score={c.score} /></TableCell>
                      <TableCell className="text-xs">{c.city}</TableCell>
                      <TableCell className="text-xs">{c.auditor}</TableCell>
                      <TableCell className="text-xs">{c.lastAudit}</TableCell>
                      <TableCell className="text-xs">{c.findings > 0 ? <span className="text-rose-600 font-semibold">{c.findings}</span> : <span className="text-emerald-600">0</span>}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="cce-action-btn" onClick={() => { setSelectedCompliance(c); toast.info("Compliance", `Viewing ${c.id}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Analytics */}
        <TabsContent value="5" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Avg Temp Variance", value: data.analyticsKpis.avgTempVariance, icon: Thermometer, color: "from-cyan-500 to-cyan-600" },
              { label: "On-Time Delivery", value: data.analyticsKpis.onTimeDelivery, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
              { label: "Rejection Rate", value: data.analyticsKpis.rejectionRate, icon: XCircle, color: "from-rose-500 to-rose-600" },
              { label: "Energy Cost/MT", value: data.analyticsKpis.energyCostPerMT, icon: Zap, color: "from-amber-500 to-amber-600" },
              { label: "Avg Shelf Life", value: data.analyticsKpis.avgShelfLife, icon: Timer, color: "from-violet-500 to-violet-600" },
              { label: "Sensor Uptime", value: data.analyticsKpis.sensorUptime, icon: Satellite, color: "from-blue-500 to-blue-600" },
              { label: "Fleet Util.", value: data.analyticsKpis.fleetUtilization, icon: Gauge, color: "from-indigo-500 to-indigo-600" },
              { label: "Compliance Score", value: data.analyticsKpis.complianceScore, icon: ShieldCheck, color: "from-teal-500 to-teal-600" },
            ].map((k, i) => (
              <Card key={i} className="cce-analytics-card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("cce-analytics-icon flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", k.color)}><k.icon className="h-4.5 w-4.5" /></div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{k.label}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{k.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cce-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Temperature Trend (14-Day)</CardTitle></CardHeader><CardContent><LineChart data={data.tempTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="Deep Freeze" stroke="#3b82f6" strokeWidth={2} /><Line type="monotone" dataKey="Chill" stroke="#0d9488" strokeWidth={2} /><Line type="monotone" dataKey="Cool" stroke="#d97706" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="cce-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Room Type Utilization</CardTitle></CardHeader><CardContent><BarChart data={data.roomUtilization} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="room" type="category" tick={{ fontSize: 10 }} width={90} /><Tooltip /><Bar dataKey="Utilization" fill="#0891b2" /></BarChart></CardContent></Card>
            <Card className="cce-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Alert Trend</CardTitle></CardHeader><CardContent><BarChart data={data.alertTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="Breaches" fill="#e11d48" /><Bar dataKey="Resolved" fill="#059669" /></BarChart></CardContent></Card>
            <Card className="cce-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Energy Cost (6-Month)</CardTitle></CardHeader><CardContent><AreaChart data={data.energyCost}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => formatINR(v)} /><Area type="monotone" dataKey="Deep Freeze" stackId="1" stroke="#3b82f6" fill="#3b82f680" /><Area type="monotone" dataKey="Chill" stackId="1" stroke="#0891b2" fill="#0891b280" /><Area type="monotone" dataKey="Cool" stackId="1" stroke="#d97706" fill="#d9770680" /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sheet: Consignment */}
      <Sheet open={!!selectedConsignment} onOpenChange={o => { if (!o) setSelectedConsignment(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedConsignment && (<>
            <SheetHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
              <SheetTitle className="text-white flex items-center gap-2"><ThermometerSnowflake className="h-5 w-5" /> {selectedConsignment.id}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-2">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Status</p><StatusBadge status={selectedConsignment.status} /></div>
                <div><p className="text-xs text-gray-500">Category</p><CategoryBadge cat={selectedConsignment.category} /></div>
                <div><p className="text-xs text-gray-500">Zone</p><ZoneBadge zone={selectedConsignment.zone} /></div>
                <div><p className="text-xs text-gray-500">Vehicle</p><VehicleBadge type={selectedConsignment.vehicle} /></div>
              </div>
              <Separator />
              <div><p className="text-xs text-gray-500 mb-1">Customer</p><p className="text-sm font-semibold">{selectedConsignment.customer}</p></div>
              <div className="flex items-center gap-4">
                <TempTile current={selectedConsignment.currentTemp} target={selectedConsignment.targetTemp} label={undefined} />
                <HumidityTile humidity={selectedConsignment.humidity} />
                <ShelfLifeTile days={selectedConsignment.shelfLifeRemaining} />
              </div>
              <RouteTile origin={selectedConsignment.origin} destination={selectedConsignment.destination} />
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Weight</p><span className="text-sm">{selectedConsignment.weight}</span></div>
                <div><p className="text-xs text-gray-500">Value</p><span className="text-sm font-bold text-emerald-600">{selectedConsignment.value}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="cce-action-btn flex-1 bg-cyan-600 hover:bg-cyan-700" onClick={() => toast.success("Updated", `${selectedConsignment.id} updated`)}>Update Status</Button>
                <Button variant="outline" className="cce-action-btn" onClick={() => toast.info("Tracking", `Temperature log for ${selectedConsignment.id}`)}>Temp Log</Button>
              </div>
            </div>
          </>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Cold Room */}
      <Sheet open={!!selectedRoom} onOpenChange={o => { if (!o) setSelectedRoom(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedRoom && (<>
            <SheetHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
              <SheetTitle className="text-white flex items-center gap-2"><Warehouse className="h-5 w-5" /> {selectedRoom.name}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-2">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Type</p><RoomTypeBadge type={selectedRoom.type} /></div>
                <div><p className="text-xs text-gray-500">Location</p><span className="text-sm">{selectedRoom.location}</span></div>
                <div><p className="text-xs text-gray-500">Power</p><PowerStatusBadge status={selectedRoom.powerStatus} /></div>
                <div><p className="text-xs text-gray-500">Door</p><DoorStatusBadge status={selectedRoom.doorStatus} /></div>
              </div>
              <Separator />
              <div className="flex items-center justify-between"><span className="text-xs text-gray-500">Occupancy</span><OccupancyBar pct={selectedRoom.occupancy} /></div>
              <div className="flex items-center justify-between"><span className="text-xs text-gray-500">Temperature</span><TempTile current={selectedRoom.currentTemp} target={selectedRoom.targetTemp} label={undefined} /></div>
              <div className="flex items-center justify-between"><span className="text-xs text-gray-500">Humidity</span><HumidityTile humidity={selectedRoom.humidity} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Capacity</p><span className="text-lg font-bold">{selectedRoom.capacity} MT</span></div>
                <div><p className="text-xs text-gray-500">Alarms</p><span className="text-lg font-bold">{selectedRoom.alarmCount}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="cce-action-btn flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success("Defrost", `Defrost started for ${selectedRoom.name}`)}>Start Defrost</Button>
                <Button variant="outline" className="cce-action-btn" onClick={() => toast.info("History", `Alarm history for ${selectedRoom.name}`)}>Alarm History</Button>
              </div>
            </div>
          </>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Alert */}
      <Sheet open={!!selectedAlert} onOpenChange={o => { if (!o) setSelectedAlert(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedAlert && (<>
            <SheetHeader className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
              <SheetTitle className="text-white flex items-center gap-2"><AlertOctagon className="h-5 w-5" /> Alert {selectedAlert.id}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-2">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Severity</p><SeverityBadge severity={selectedAlert.severity} /></div>
                <div><p className="text-xs text-gray-500">Category</p><AlertCategoryBadge cat={selectedAlert.category} /></div>
              </div>
              <Separator />
              <div><p className="text-xs text-gray-500 mb-1">Description</p><p className="text-sm">{selectedAlert.description}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Location</p><span className="text-sm">{selectedAlert.location}</span></div>
                <div><p className="text-xs text-gray-500">Room</p><span className="text-sm">{selectedAlert.room}</span></div>
              </div>
              <div><p className="text-xs text-gray-500">Temperature</p><TempTile current={parseFloat(selectedAlert.temperature)} target={4} /></div>
              <div className="flex gap-2 pt-2">
                {!selectedAlert.resolved ? (
                  <><Button className="cce-action-btn flex-1 bg-rose-600 hover:bg-rose-700" onClick={() => toast.success("Resolved", `Alert ${selectedAlert.id} resolved`)}>Resolve</Button>
                  <Button variant="outline" className="cce-action-btn" onClick={() => toast.info("Escalated", `Alert ${selectedAlert.id} escalated`)}>Escalate</Button></>
                ) : <Button variant="outline" className="cce-action-btn flex-1" onClick={() => toast.info("Reopened", `Alert ${selectedAlert.id} reopened`)}>Reopen</Button>}
              </div>
            </div>
          </>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Compliance */}
      <Sheet open={!!selectedCompliance} onOpenChange={o => { if (!o) setSelectedCompliance(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedCompliance && (<>
            <SheetHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
              <SheetTitle className="text-white flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> {selectedCompliance.id}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-2">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Type</p><ComplianceTypeBadge type={selectedCompliance.type} /></div>
                <div><p className="text-xs text-gray-500">Status</p><ComplianceStatusBadge status={selectedCompliance.status} /></div>
                <div><p className="text-xs text-gray-500">Score</p><ComplianceScoreBar score={selectedCompliance.score} /></div>
                <div><p className="text-xs text-gray-500">Findings</p><span className="text-lg font-bold">{selectedCompliance.findings}</span></div>
              </div>
              <Separator />
              <div><p className="text-xs text-gray-500">Customer</p><p className="text-sm font-semibold">{selectedCompliance.customer}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Auditor</p><span className="text-sm">{selectedCompliance.auditor}</span></div>
                <div><p className="text-xs text-gray-500">City</p><span className="text-sm">{selectedCompliance.city}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Last Audit</p><span className="text-sm">{selectedCompliance.lastAudit}</span></div>
                <div><p className="text-xs text-gray-500">Next Audit</p><span className="text-sm">{selectedCompliance.nextAudit}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="cce-action-btn flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success("Audit", `New audit scheduled for ${selectedCompliance.id}`)}>Schedule Audit</Button>
                <Button variant="outline" className="cce-action-btn" onClick={() => toast.info("Report", `Generating compliance report`)}>Generate Report</Button>
              </div>
            </div>
          </>)}
        </SheetContent>
      </Sheet>
    </div>
  )
}
