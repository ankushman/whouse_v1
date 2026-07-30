"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Truck, Fuel, Wrench, Users, MapPin, Gauge, Star, Search,
  Eye, ArrowUpDown, TrendingUp, Clock, IndianRupee, Route,
  Shield, Thermometer, BarChart3, Activity, AlertTriangle,
  Package, Navigation, Calendar, DollarSign, Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { KPICard } from "@/components/shared/kpi-card"

/* ═══════════════════════════════════════════════════════════════════
   Seed-based deterministic random helpers
   ═══════════════════════════════════════════════════════════════════ */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000
  return x - Math.floor(x)
}
function ri(min: number, max: number, seed: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min
}

/* ═══════════════════════════════════════════════════════════════════
   Enums (as const)
   ═══════════════════════════════════════════════════════════════════ */
const VEHICLE_TYPES = ["Heavy Truck", "Medium Truck", "Light Commercial", "Trailer", "Tanker", "Refrigerated", "Flatbed", "Pickup"] as const
const VEHICLE_EMOJI = ["🚛", "🚚", "🚐", "🚛", "🚚", "❄️", "🏗️", "🛻"] as const
const VEHICLE_STATUSES = ["Active", "Idle", "Maintenance", "Breakdown", "On Trip", "Refueling", "Inspection", "Decommissioned"] as const
const FUEL_TYPES = ["Diesel", "Petrol", "CNG", "Electric", "Hybrid", "LPG"] as const
const DRIVER_STATUSES = ["On Trip", "Available", "Rest", "Off Duty", "Training", "Suspended"] as const
const TRIP_STATUSES = ["Scheduled", "In Transit", "Loading", "Unloading", "Delayed", "Completed", "Cancelled", "Diverted"] as const
const MAINT_TYPES = ["Scheduled Service", "Tire Change", "Engine Repair", "Brake Service", "Battery Replace", "AC Repair", "Body Work", "Emission Test"] as const
const INDIAN_DRIVERS = ["Suresh Yadav", "Ravi Kumar", "Anil Sharma", "Mohan Singh", "Raju Patel", "Sunil Verma", "Dinesh Gupta", "Arun Das", "Bhola Nath", "Gopal Rai", "Kamlesh Meena", "Pappu Kumar", "Manoj Tiwari", "Ashok Prajapati", "Vijay Singh", "Ramesh Oraon", "Prakash Jha", "Brijesh Yadav", "Naresh Sah", "Dilip Mahato"] as const
const INDIAN_ROUTES = ["Mumbai→Delhi", "Delhi→Jaipur", "Bangalore→Chennai", "Hyderabad→Pune", "Kolkata→Guwahati", "Chennai→Bangalore", "Ahmedabad→Mumbai", "Pune→Goa", "Delhi→Chandigarh", "Nagpur→Hyderabad", "Indore→Bhopal", "Lucknow→Varanasi"] as const
const INDIAN_CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Nagpur", "Indore"] as const
const STATES = ["MH", "DL", "KA", "TN", "TS", "RJ", "WB", "GJ", "UP", "MP", "HR", "AP"] as const
const COLORS = ["#059669", "#3b82f6", "#ea580c", "#7c3aed", "#e11d48", "#d97706", "#0891b2", "#6366f1"]

/* ═══════════════════════════════════════════════════════════════════
   INR formatting (Lakh / Crore)
   ═══════════════════════════════════════════════════════════════════ */
function fmtINR(n: number): string {
  const sign = n < 0 ? "-" : ""
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${sign}${(abs / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `₹${sign}${(abs / 1e5).toFixed(2)} L`
  return `₹${sign}${abs.toLocaleString("en-IN")}`
}

/* ═══════════════════════════════════════════════════════════════════
   16+ Unique Visual Components
   ═══════════════════════════════════════════════════════════════════ */
function VehicleTypeBadge({ type }: { type: string }) {
  const idx = VEHICLE_TYPES.indexOf(type as typeof VEHICLE_TYPES[number])
  return (
    <Badge variant="outline" className="badge-interactive fmp-vtype-badge gap-1 text-[10px] px-2 py-0.5 font-medium">
      {idx >= 0 ? VEHICLE_EMOJI[idx] : "🚛"} {type}
    </Badge>
  )
}

function VehicleStatusBadge({ status }: { status: string }) {
  const pulse = ["On Trip", "Refueling", "Breakdown"].includes(status)
  const colorMap: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Idle: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    Maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Breakdown: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "On Trip": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Refueling: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    Inspection: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Decommissioned: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
  }
  return (
    <Badge className={`fmp-vstatus-badge ${colorMap[status] || "bg-gray-100"} text-[10px] font-semibold px-2 py-0.5 ${pulse ? "animate-pulse" : ""}`}>
      {status}
    </Badge>
  )
}

function FuelTypeBadge({ fuel }: { fuel: string }) {
  const colors: Record<string, string> = {
    Diesel: "bg-yellow-100 text-yellow-800", Petrol: "bg-red-50 text-red-700",
    CNG: "bg-green-100 text-green-700", Electric: "bg-sky-100 text-sky-700",
    Hybrid: "bg-teal-100 text-teal-700", LPG: "bg-purple-100 text-purple-700",
  }
  return (
    <Badge variant="outline" className={`fmp-fuel-badge ${colors[fuel] || "bg-gray-100"} text-[10px] px-2 py-0.5`}>
      {fuel}
    </Badge>
  )
}

function DriverStatusBadge({ status }: { status: string }) {
  const pulse = ["On Trip"].includes(status)
  const colorMap: Record<string, string> = {
    "On Trip": "bg-blue-100 text-blue-700", Available: "bg-emerald-100 text-emerald-700",
    Rest: "bg-gray-100 text-gray-600", "Off Duty": "bg-slate-100 text-slate-600",
    Training: "bg-violet-100 text-violet-700", Suspended: "bg-red-100 text-red-700",
  }
  return (
    <Badge className={`fmp-dstatus-badge ${colorMap[status] || "bg-gray-100"} text-[10px] font-semibold px-2 py-0.5 ${pulse ? "animate-pulse" : ""}`}>
      {status}
    </Badge>
  )
}

function TripStatusBadge({ status }: { status: string }) {
  const pulse = ["In Transit", "Loading", "Unloading"].includes(status)
  const amber = ["Delayed", "Diverted"].includes(status)
  const colorMap: Record<string, string> = {
    Scheduled: "bg-sky-100 text-sky-700", "In Transit": "bg-blue-100 text-blue-700",
    Loading: "bg-violet-100 text-violet-700", Unloading: "bg-orange-100 text-orange-700",
    Delayed: "bg-amber-100 text-amber-700", Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700", Diverted: "bg-amber-100 text-amber-700",
  }
  return (
    <Badge className={`fmp-tstatus-badge ${colorMap[status] || "bg-gray-100"} text-[10px] font-semibold px-2 py-0.5 ${pulse ? "animate-pulse" : ""} ${amber ? "border border-amber-300" : ""}`}>
      {status}
    </Badge>
  )
}

function RatingBar({ rating }: { rating: number }) {
  return (
    <div className="fmp-rating flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3 w-3 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

function MileageTile({ value }: { value: number }) {
  return (
    <span className={`fmp-mileage font-mono text-xs font-semibold ${value > 10 ? "text-emerald-600" : value > 5 ? "text-amber-600" : "text-red-600"}`}>
      {value} km/l
    </span>
  )
}

function OdometerTile({ value }: { value: number }) {
  return <span className="fmp-odo font-mono text-xs text-muted-foreground">{(value / 1000).toFixed(1)}k km</span>
}

function CapacityTile({ value }: { value: number }) {
  return <span className="fmp-cap font-mono text-xs font-semibold text-blue-600">{value} tons</span>
}

function LoadTile({ value, max }: { value: number; max: number }) {
  return (
    <div className="fmp-load flex items-center gap-1.5">
      <Progress value={(value / max) * 100} className="h-1.5 w-16" />
      <span className="text-xs font-mono text-muted-foreground">{value}/{max}t</span>
    </div>
  )
}

function ETATile({ eta }: { eta: string }) {
  return (
    <span className="fmp-eta text-xs text-muted-foreground flex items-center gap-1">
      <Clock className="h-3 w-3" />{eta}
    </span>
  )
}

function RevenueTile({ value }: { value: number }) {
  return <span className="fmp-rev text-xs font-semibold text-emerald-600">{fmtINR(value)}</span>
}

function CostTile({ value }: { value: number }) {
  return <span className="fmp-cost text-xs font-semibold text-orange-600">{fmtINR(value)}</span>
}

function RouteBadge({ route }: { route: string }) {
  return (
    <Badge variant="outline" className="badge-interactive fmp-route text-[10px] gap-1 px-2 py-0.5">
      <Navigation className="h-3 w-3" />{route}
    </Badge>
  )
}

function ExpiredBadge({ date, label }: { date: string; label?: string }) {
  const expired = new Date(date) < new Date()
  return (
    <span className={`fmp-expired text-[10px] ${expired ? "text-red-600 animate-pulse font-semibold" : "text-muted-foreground"}`}>
      {label ? `${label}: ` : ""}{date}
    </span>
  )
}

function FuelEfficiencyBar({ value }: { value: number }) {
  const pct = Math.min((value / 15) * 100, 100)
  const color = value > 10 ? "bg-emerald-500" : value > 6 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="fmp-feff flex items-center gap-2 w-full">
      <div className="h-2 rounded-full bg-gray-200 flex-1 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{value} km/l</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Generate Mock Data
   ═══════════════════════════════════════════════════════════════════ */
const vehicles = Array.from({ length: 75 }, (_, i) => {
  const ti = ri(0, 7, i * 17)
  const st = i % 8 === 0 ? "Maintenance" : i % 7 === 0 ? "Breakdown" : i % 6 === 0 ? "Idle"
    : i % 5 === 0 ? "On Trip" : i % 11 === 0 ? "Decommissioned"
    : i % 13 === 0 ? "Refueling" : i % 17 === 0 ? "Inspection" : "Active"
  const state = STATES[ri(0, STATES.length - 1, i * 31)]
  const reg = `${state}-${String(ri(1, 99, i * 41)).padStart(2, "0")}-${String.fromCharCode(65 + ri(0, 25, i * 51))}${String.fromCharCode(65 + ri(0, 25, i * 61))}-${String(ri(1000, 9999, i * 71))}`
  return {
    id: `VH-${String(i + 1).padStart(3, "0")}`, regNo: reg, type: VEHICLE_TYPES[ti],
    status: st, fuelType: FUEL_TYPES[ri(0, 5, i * 23)], mileage: ri(3, 14, i * 37),
    capacity: ri(2, 25, i * 43),
    lastService: `2025-${String(ri(1, 12, i * 53)).padStart(2, "0")}-${String(ri(1, 28, i * 59)).padStart(2, "0")}`,
    location: INDIAN_CITIES[ri(0, 11, i * 67)], odometer: ri(10000, 350000, i * 73),
    insuranceExpiry: `2026-${String(ri(1, 12, i * 79)).padStart(2, "0")}-${String(ri(1, 28, i * 83)).padStart(2, "0")}`,
  }
})

const drivers = Array.from({ length: 70 }, (_, i) => {
  const st = i % 5 === 0 ? "On Trip" : i % 7 === 0 ? "Rest" : i % 9 === 0 ? "Off Duty"
    : i % 11 === 0 ? "Training" : i % 13 === 0 ? "Suspended" : "Available"
  return {
    id: `DRV-${String(i + 1).padStart(3, "0")}`, name: INDIAN_DRIVERS[i % INDIAN_DRIVERS.length],
    phone: `+91 ${ri(70000, 99999, i * 97)} ${ri(10000, 99999, i * 101)}`,
    license: `DL-${String(ri(1, 12, i * 103)).padStart(2, "0")}-${ri(2018, 2024, i * 107)}${String(ri(10000, 99999, i * 109))}`,
    status: st, vehicle: vehicles[i % 75].id, totalTrips: ri(50, 2000, i * 113),
    totalKm: ri(50000, 500000, i * 119), rating: +(ri(30, 50, i * 127) / 10).toFixed(1),
    earnings: ri(200000, 2500000, i * 131),
    licenseExpiry: `2027-${String(ri(1, 12, i * 137)).padStart(2, "0")}-${String(ri(1, 28, i * 139)).padStart(2, "0")}`,
    experience: ri(1, 20, i * 149),
  }
})

const trips = Array.from({ length: 65 }, (_, i) => {
  const st = i % 8 === 0 ? "Completed" : i % 7 === 0 ? "Delayed" : i % 6 === 0 ? "In Transit"
    : i % 5 === 0 ? "Loading" : i % 4 === 0 ? "Scheduled"
    : i % 9 === 0 ? "Cancelled" : i % 10 === 0 ? "Diverted" : "Unloading"
  return {
    id: `TRP-${String(i + 1).padStart(3, "0")}`, route: INDIAN_ROUTES[ri(0, 11, i * 151)],
    vehicle: vehicles[ri(0, 74, i * 157)].id, driver: drivers[ri(0, 69, i * 163)].id,
    status: st, distance: ri(200, 1800, i * 167),
    eta: `${ri(4, 48, i * 173)}h ${ri(0, 59, i * 179)}m`, fuelUsed: ri(40, 500, i * 181),
    load: ri(2, 25, i * 191), revenue: ri(25000, 350000, i * 193),
    departure: `2025-07-${String(ri(1, 28, i * 197)).padStart(2, "0")} ${String(ri(0, 23, i * 199)).padStart(2, "0")}:${String(ri(0, 59, i * 211)).padStart(2, "0")}`,
  }
})

const fuelMaintRecords = Array.from({ length: 55 }, (_, i) => {
  const isFuel = i % 2 === 0
  return {
    id: `FM-${String(i + 1).padStart(3, "0")}`, type: isFuel ? "Fuel" : "Maintenance",
    vehicleReg: vehicles[ri(0, 74, i * 223)].regNo,
    cost: isFuel ? ri(5000, 50000, i * 227) : ri(3000, 80000, i * 229),
    date: `2025-${String(ri(1, 12, i * 233)).padStart(2, "0")}-${String(ri(1, 28, i * 239)).padStart(2, "0")}`,
    odometer: ri(15000, 300000, i * 241),
    details: isFuel ? `Filled ${ri(20, 200, i * 251)}L ${FUEL_TYPES[ri(0, 5, i * 257)]}` : MAINT_TYPES[ri(0, 7, i * 263)],
    nextDue: `2025-${String(ri(8, 12, i * 269)).padStart(2, "0")}-${String(ri(1, 28, i * 271)).padStart(2, "0")}`,
    vendor: ["Indian Oil", "HPCL", "BPCL", "Reliance Petrol", "Tata Motors SVC", "Ashok Leyland SVC", "Mahindra SVC", "Eicher SVC"][ri(0, 7, i * 277)],
    serviceCenter: `${INDIAN_CITIES[ri(0, 11, i * 281)]} Service Center`,
  }
})

/* ═══════════════════════════════════════════════════════════════════
   Chart Data
   ═══════════════════════════════════════════════════════════════════ */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const monthlyTrips = MONTHS.map((month, i) => ({ month, Completed: ri(40, 90, i * 300), Delayed: ri(5, 20, i * 310), Cancelled: ri(2, 10, i * 320) }))
const vehicleTypeDist = VEHICLE_TYPES.map((name, i) => ({ name, value: ri(5, 20, i * 330), emoji: VEHICLE_EMOJI[i] }))
const fuelByType = FUEL_TYPES.map((fuel, i) => ({ fuel, consumption: ri(2000, 15000, i * 340) }))
const monthlyCosts = MONTHS.map((month, i) => ({ month, Operational: ri(800000, 1500000, i * 350), Maintenance: ri(200000, 600000, i * 360) }))
const utilByType = VEHICLE_TYPES.map((type, i) => ({ type, utilization: ri(50, 98, i * 370) }))
const topRoutes = INDIAN_ROUTES.slice(0, 8).map((route, i) => ({ route, revenue: ri(500000, 4000000, i * 380) }))
  .sort((a, b) => (b as unknown as Record<string, number>).revenue - (a as unknown as Record<string, number>).revenue)
const costBreakdown = MONTHS.slice(0, 6).map((month, i) => ({
  month, Fuel: ri(300000, 800000, i * 390), Maintenance: ri(100000, 400000, i * 400),
  Insurance: ri(50000, 150000, i * 410), Depreciation: ri(80000, 200000, i * 420),
}))

/* ═══════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════ */
export function FleetManagementProView() {
  const [activeTab, setActiveTab] = useState("0")
  const { toast } = useToast()
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState("asc")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQ, setSearchQ] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<typeof drivers[0] | null>(null)
  const [selectedTrip, setSelectedTrip] = useState<typeof trips[0] | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<typeof fuelMaintRecords[0] | null>(null)

  /* ─── Sort & Filter (exact pattern) ─── */
  const sortedData = <T,>(data: T[], field: string, dir: string): T[] => {
    if (!field) return data
    return [...data].sort((a, b) => {
      const recA = a as unknown as Record<string, string | number>
      const recB = b as unknown as Record<string, string | number>
      const av = recA[field] ?? ""
      const bv = recB[field] ?? ""
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return dir === "asc" ? cmp : -cmp
    })
  }
  const filterData = <T,>(data: T[], statusKey: string, searchKeys?: string[]): T[] => {
    return data.filter((item) => {
      const rec = item as unknown as Record<string, string | number>
      if (statusFilter !== "all" && rec[statusKey] !== statusFilter) return false
      if (searchQ) {
        const q = searchQ.toLowerCase()
        const keys = searchKeys ?? Object.keys(rec)
        return keys.some((k) => String(rec[k]).toLowerCase().includes(q))
      }
      return true
    })
  }

  const toggleSort = (field: string) => {
    setSortField(field)
    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
  }

  const filteredVehicles = useMemo(
    () => sortedData(filterData(vehicles, "status", ["id", "regNo", "type", "location"]), sortField, sortDir),
    [sortField, sortDir, statusFilter, searchQ]
  )
  const filteredDrivers = useMemo(
    () => sortedData(filterData(drivers, "status", ["id", "name", "phone", "license"]), sortField, sortDir),
    [sortField, sortDir, statusFilter, searchQ]
  )
  const filteredTrips = useMemo(
    () => sortedData(filterData(trips, "status", ["id", "route", "vehicle", "driver"]), sortField, sortDir),
    [sortField, sortDir, statusFilter, searchQ]
  )
  const filteredRecords = useMemo(
    () => sortedData(filterData(fuelMaintRecords, "type", ["id", "vehicleReg", "details", "vendor"]), sortField, sortDir),
    [sortField, sortDir, statusFilter, searchQ]
  )

  /* ─── KPI computed values ─── */
  const activeCount = vehicles.filter((v) => v.status === "Active").length
  const onTripCount = vehicles.filter((v) => v.status === "On Trip").length
  const idleCount = vehicles.filter((v) => v.status === "Idle").length
  const avgFuelEff = +(vehicles.reduce((s, v) => s + v.mileage, 0) / vehicles.length).toFixed(1)
  const maintDueCount = vehicles.filter((v) => v.status === "Maintenance" || v.status === "Breakdown").length
  const utilizationPct = Math.round(((activeCount + onTripCount) / vehicles.length) * 100)

  /* ─── SortHeader helper ─── */
  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold gap-1 px-2"
      onClick={() => toggleSort(field)}>
      {label} <ArrowUpDown className="h-3 w-3 opacity-50" />
    </Button>
  )

  return (
    <div className="fmp-root space-y-4">
      <PageHeader
        title="Fleet Management Pro"
        description="Comprehensive Indian logistics fleet tracking, driver management & trip analytics"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="fmp-tabs h-auto flex-wrap gap-1 bg-muted/50">
          {["Fleet Dashboard", "Vehicle Registry", "Driver Management", "Trip Management", "Fuel & Maintenance", "Fleet Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="fmp-tab text-xs px-3 py-1.5">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════
            Tab 0 — Fleet Dashboard
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === "0" && (
          <div className="fmp-dash space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <KPICard title="Total Vehicles" value={75} icon={Truck} trend="up" change={4} />
              <KPICard title="Active Now" value={activeCount} icon={Activity} trend="up" change={12} />
              <KPICard title="On Trips" value={onTripCount} icon={Route} trend="up" change={8} />
              <KPICard title="Idle Fleet" value={idleCount} icon={Clock} trend="down" change={3} />
              <KPICard title="Avg Fuel Efficiency" value={`${avgFuelEff} km/l`} icon={Gauge} trend="up" change={6} colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" />
              <KPICard title="Maintenance Due" value={maintDueCount} icon={Wrench} trend="down" change={2} colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" />
              <KPICard title="Total Drivers" value={70} icon={Users} trend="up" change={5} colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" />
              <KPICard title="Fleet Utilization" value={`${utilizationPct}%`} icon={TrendingUp} trend="up" change={7} colorClass="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="fmp-chart-card border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Trips</CardTitle></CardHeader>
                <CardContent>
                  <AreaChart data={monthlyTrips} height={220}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Completed" stackId="a" fill="#059669" />
                    <Area type="monotone" dataKey="Delayed" stackId="a" fill="#ea580c" />
                    <Area type="monotone" dataKey="Cancelled" stackId="a" fill="#e11d48" />
                  </AreaChart>
                </CardContent>
              </Card>
              <Card className="fmp-chart-card border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Vehicle Type Distribution</CardTitle></CardHeader>
                <CardContent>
                  <PieChart height={220}>
                    <Pie data={vehicleTypeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                      label={({ name, emoji }) => `${emoji} ${name}`} labelLine={false}>
                      {vehicleTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </CardContent>
              </Card>
              <Card className="fmp-chart-card border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Fuel Consumption by Type</CardTitle></CardHeader>
                <CardContent>
                  <BarChart data={fuelByType} height={220}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="fuel" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            Tab 1 — Vehicle Registry
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === "1" && (
          <div className="fmp-vehicles space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search vehicles by ID, reg, type, location..."
                  value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                  className="fmp-search pl-8 h-9 text-sm" />
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {[{ label: "All", value: "all" }, ...VEHICLE_STATUSES.map((s) => ({ label: s, value: s }))].map((f) => (
                  <Badge key={f.value} variant={statusFilter === f.value ? "default" : "outline"}
                    className="fmp-filter cursor-pointer text-[10px] px-2 py-0.5"
                    onClick={() => { setStatusFilter(f.value); toast.info("Filter", `Showing ${f.label} vehicles`) }}>
                    {f.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <SortHeader label="ID" field="id" />
              <SortHeader label="Registration" field="regNo" />
              <SortHeader label="Type" field="type" />
              <SortHeader label="Location" field="location" />
              <span className="ml-auto">{filteredVehicles.length} vehicles</span>
            </div>
            <ScrollArea className="h-[480px]">
              <div className="space-y-2">
                {filteredVehicles.map((v) => (
                  <Card key={v.id}
                    className="fmp-vehicle-card flex flex-col sm:flex-row sm:items-center gap-2 p-3 hover:shadow-md transition-shadow cursor-pointer border-border/60"
                    onClick={() => { setSelectedVehicle(v); setSheetOpen(true); toast.info("Vehicle", `Viewing ${v.id} — ${v.regNo}`) }}>
                    <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                      <div><span className="text-muted-foreground">ID:</span> <span className="font-semibold">{v.id}</span></div>
                      <div><span className="text-muted-foreground">Reg:</span> <span className="font-mono font-semibold">{v.regNo}</span></div>
                      <div><VehicleTypeBadge type={v.type} /></div>
                      <div><VehicleStatusBadge status={v.status} /></div>
                      <div><FuelTypeBadge fuel={v.fuelType} /></div>
                      <div><MileageTile value={v.mileage} /></div>
                      <div><CapacityTile value={v.capacity} /></div>
                      <div><span className="text-muted-foreground">Service:</span> <span>{v.lastService}</span></div>
                      <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" /><span>{v.location}</span></div>
                      <div><OdometerTile value={v.odometer} /></div>
                      <div><ExpiredBadge date={v.insuranceExpiry} label="Insurance" /></div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            Tab 2 — Driver Management
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === "2" && (
          <div className="fmp-drivers space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search drivers by ID, name, phone, license..."
                  value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                  className="fmp-search pl-8 h-9 text-sm" />
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {[{ label: "All", value: "all" }, ...DRIVER_STATUSES.map((s) => ({ label: s, value: s }))].map((f) => (
                  <Badge key={f.value} variant={statusFilter === f.value ? "default" : "outline"}
                    className="fmp-filter cursor-pointer text-[10px] px-2 py-0.5"
                    onClick={() => { setStatusFilter(f.value); toast.info("Filter", `Showing ${f.label} drivers`) }}>
                    {f.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <SortHeader label="Name" field="name" />
              <SortHeader label="ID" field="id" />
              <SortHeader label="Rating" field="rating" />
              <SortHeader label="Earnings" field="earnings" />
              <span className="ml-auto">{filteredDrivers.length} drivers</span>
            </div>
            <ScrollArea className="h-[480px]">
              <div className="space-y-2">
                {filteredDrivers.map((d) => (
                  <Card key={d.id}
                    className="fmp-driver-card flex flex-col sm:flex-row sm:items-center gap-2 p-3 hover:shadow-md transition-shadow cursor-pointer border-border/60"
                    onClick={() => { setSelectedDriver(d); setSheetOpen(true); toast.info("Driver", `Viewing ${d.name}`) }}>
                    <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                      <div><span className="text-muted-foreground">ID:</span> <span className="font-semibold">{d.id}</span></div>
                      <div className="font-semibold">{d.name}</div>
                      <div><span className="text-muted-foreground">Phone:</span> {d.phone}</div>
                      <div><span className="text-muted-foreground">License:</span> <span className="font-mono">{d.license}</span></div>
                      <div><DriverStatusBadge status={d.status} /></div>
                      <div><span className="text-muted-foreground">Vehicle:</span> {d.vehicle}</div>
                      <div><span className="text-muted-foreground">Trips:</span> {d.totalTrips.toLocaleString()}</div>
                      <div><span className="text-muted-foreground">Total km:</span> {d.totalKm.toLocaleString()}</div>
                      <div><RatingBar rating={d.rating} /></div>
                      <div><span className="text-muted-foreground">Earnings:</span> <RevenueTile value={d.earnings} /></div>
                      <div><ExpiredBadge date={d.licenseExpiry} label="License Exp" /></div>
                      <div><span className="text-muted-foreground">Experience:</span> {d.experience} yrs</div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            Tab 3 — Trip Management
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === "3" && (
          <div className="fmp-trips space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search trips by ID, route, vehicle, driver..."
                  value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                  className="fmp-search pl-8 h-9 text-sm" />
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {[{ label: "All", value: "all" }, ...TRIP_STATUSES.map((s) => ({ label: s, value: s }))].map((f) => (
                  <Badge key={f.value} variant={statusFilter === f.value ? "default" : "outline"}
                    className="fmp-filter cursor-pointer text-[10px] px-2 py-0.5"
                    onClick={() => { setStatusFilter(f.value); toast.info("Filter", `Showing ${f.label} trips`) }}>
                    {f.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <SortHeader label="ID" field="id" />
              <SortHeader label="Route" field="route" />
              <SortHeader label="Revenue" field="revenue" />
              <SortHeader label="Distance" field="distance" />
              <span className="ml-auto">{filteredTrips.length} trips</span>
            </div>
            <ScrollArea className="h-[480px]">
              <div className="space-y-2">
                {filteredTrips.map((t) => (
                  <Card key={t.id}
                    className="fmp-trip-card flex flex-col sm:flex-row sm:items-center gap-2 p-3 hover:shadow-md transition-shadow cursor-pointer border-border/60"
                    onClick={() => { setSelectedTrip(t); setSheetOpen(true); toast.info("Trip", `Viewing ${t.id} — ${t.route}`) }}>
                    <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                      <div><span className="text-muted-foreground">ID:</span> <span className="font-semibold">{t.id}</span></div>
                      <div><RouteBadge route={t.route} /></div>
                      <div><span className="text-muted-foreground">Vehicle:</span> {t.vehicle}</div>
                      <div><span className="text-muted-foreground">Driver:</span> {t.driver}</div>
                      <div><TripStatusBadge status={t.status} /></div>
                      <div><span className="text-muted-foreground">Distance:</span> {t.distance.toLocaleString()} km</div>
                      <div><ETATile eta={t.eta} /></div>
                      <div><span className="text-muted-foreground">Fuel:</span> {t.fuelUsed} L</div>
                      <div><LoadTile value={t.load} max={25} /></div>
                      <div><span className="text-muted-foreground">Revenue:</span> <RevenueTile value={t.revenue} /></div>
                      <div className="col-span-2"><span className="text-muted-foreground">Departure:</span> {t.departure}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            Tab 4 — Fuel & Maintenance
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === "4" && (
          <div className="fmp-fuel-maint space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search records by vehicle, details, vendor..."
                  value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                  className="fmp-search pl-8 h-9 text-sm" />
              </div>
              <div className="flex flex-wrap gap-1">
                {[{ label: "All", value: "all" }, { label: "Fuel", value: "Fuel" }, { label: "Maintenance", value: "Maintenance" }].map((f) => (
                  <Badge key={f.value} variant={statusFilter === f.value ? "default" : "outline"}
                    className="fmp-filter cursor-pointer text-[10px] px-2 py-0.5"
                    onClick={() => { setStatusFilter(f.value); toast.info("Filter", `Showing ${f.label} records`) }}>
                    {f.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecords.map((r) => (
                <Card key={r.id}
                  className={`fmp-fm-card overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-border/60 ${r.type === "Fuel" ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-orange-500"}`}
                  onClick={() => { setSelectedRecord(r); setSheetOpen(true); toast.info("Record", `${r.type}: ${r.details}`) }}>
                  <div className={`h-1.5 ${r.type === "Fuel" ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-orange-400 to-orange-600"}`} />
                  <CardContent className="glass-subtle p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={`text-[10px] ${r.type === "Fuel" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                        {r.type === "Fuel" ? "⛽" : "🔧"} {r.type}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{r.id}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                      <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-mono font-semibold">{r.vehicleReg}</span></div>
                      <div><span className="text-muted-foreground">Cost:</span> <CostTile value={r.cost} /></div>
                      <div><span className="text-muted-foreground">Date:</span> {r.date}</div>
                      <div><OdometerTile value={r.odometer} /></div>
                      <div className="col-span-2"><span className="text-muted-foreground">Details:</span> {r.details}</div>
                      <div><span className="text-muted-foreground">Vendor:</span> {r.vendor}</div>
                      <div><span className="text-muted-foreground">Center:</span> {r.serviceCenter}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            Tab 5 — Fleet Analytics
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === "5" && (
          <div className="fmp-analytics space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <KPICard title="Avg Trip Duration" value="18.5 hrs" icon={Clock} trend="down" change={5} colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" />
              <KPICard title="Fuel Cost/km" value={fmtINR(12)} icon={Fuel} trend="up" change={3} colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" />
              <KPICard title="Maint Cost/Vehicle" value={fmtINR(45000)} icon={Wrench} trend="down" change={12} colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" />
              <KPICard title="Driver Satisfaction" value="4.3/5" icon={Star} trend="up" change={8} colorClass="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" />
              <KPICard title="Route Efficiency" value="87.2%" icon={Navigation} trend="up" change={4} colorClass="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400" />
              <KPICard title="Fleet ROI" value="23.6%" icon={DollarSign} trend="up" change={6} colorClass="bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400" />
              <KPICard title="Safety Score" value="92/100" icon={Shield} trend="up" change={2} colorClass="bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400" />
              <KPICard title="Carbon Footprint" value="142 tCO₂" icon={Thermometer} trend="down" change={7} colorClass="bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="fmp-chart-card border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Fleet Costs</CardTitle></CardHeader>
                <CardContent>
                  <LineChart data={monthlyCosts} height={240}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Line type="monotone" dataKey="Operational" stroke="#059669" strokeWidth={2} />
                    <Line type="monotone" dataKey="Maintenance" stroke="#ea580c" strokeWidth={2} />
                  </LineChart>
                </CardContent>
              </Card>
              <Card className="fmp-chart-card border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Vehicle Utilization by Type</CardTitle></CardHeader>
                <CardContent>
                  <BarChart data={utilByType} height={240} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis dataKey="type" type="category" tick={{ fontSize: 9 }} width={85} />
                    <Tooltip />
                    <Bar dataKey="utilization" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </CardContent>
              </Card>
              <Card className="fmp-chart-card border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Routes by Revenue</CardTitle></CardHeader>
                <CardContent>
                  <BarChart data={topRoutes} height={240} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <YAxis dataKey="route" type="category" tick={{ fontSize: 9 }} width={100} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Bar dataKey="revenue" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </CardContent>
              </Card>
              <Card className="fmp-chart-card border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Cost Breakdown (6 Months)</CardTitle></CardHeader>
                <CardContent>
                  <AreaChart data={costBreakdown} height={240}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Area type="monotone" dataKey="Fuel" stackId="a" fill="#d97706" />
                    <Area type="monotone" dataKey="Maintenance" stackId="a" fill="#ea580c" />
                    <Area type="monotone" dataKey="Insurance" stackId="a" fill="#3b82f6" />
                    <Area type="monotone" dataKey="Depreciation" stackId="a" fill="#e11d48" />
                  </AreaChart>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Tabs>

      {/* ═══════════════════════════════════════════════════════════
          Sheets
          ═══════════════════════════════════════════════════════════ */}
      <Sheet open={!!(sheetOpen && selectedVehicle)} onOpenChange={(o) => { setSheetOpen(o); if (!o) setSelectedVehicle(null) }}>
        <SheetContent className="fmp-sheet-vehicle w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent text-lg">
              Vehicle Details — {selectedVehicle?.id}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-[80vh]">
            <div className="space-y-4 text-sm">
              {selectedVehicle && (
                <>
                  <Card className="p-4 border-border/60">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedVehicle).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-muted-foreground capitalize text-xs">{k.replace(/([A-Z])/g, " $1")}:</span>
                          <p className="font-semibold text-xs">{String(v)}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 border-border/60">
                    <p className="font-medium mb-3 text-xs">Fuel Efficiency</p>
                    <FuelEfficiencyBar value={selectedVehicle.mileage} />
                  </Card>
                  <Card className="p-4 border-border/60">
                    <p className="font-medium mb-2 text-xs">Vehicle Status</p>
                    <VehicleStatusBadge status={selectedVehicle.status} />
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Capacity:</span> <CapacityTile value={selectedVehicle.capacity} /></div>
                      <div><span className="text-muted-foreground">Odometer:</span> <OdometerTile value={selectedVehicle.odometer} /></div>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Sheet open={!!(sheetOpen && selectedDriver)} onOpenChange={(o) => { setSheetOpen(o); if (!o) setSelectedDriver(null) }}>
        <SheetContent className="fmp-sheet-driver w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent text-lg">
              Driver Profile — {selectedDriver?.name}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-[80vh]">
            <div className="space-y-4 text-sm">
              {selectedDriver && (
                <>
                  <Card className="p-4 border-border/60">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
                        {selectedDriver.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{selectedDriver.name}</p>
                        <DriverStatusBadge status={selectedDriver.status} />
                        <div className="mt-1"><RatingBar rating={selectedDriver.rating} /></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedDriver).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-muted-foreground capitalize text-xs">{k.replace(/([A-Z])/g, " $1")}:</span>
                          <p className="font-semibold text-xs">{k === "earnings" ? fmtINR(v as number) : String(v)}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Sheet open={!!(sheetOpen && selectedTrip)} onOpenChange={(o) => { setSheetOpen(o); if (!o) setSelectedTrip(null) }}>
        <SheetContent className="fmp-sheet-trip w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent text-lg">
              Trip Timeline — {selectedTrip?.id}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-[80vh]">
            <div className="space-y-4 text-sm">
              {selectedTrip && (
                <>
                  <Card className="p-4 border-border/60">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <RouteBadge route={selectedTrip.route} />
                      <TripStatusBadge status={selectedTrip.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedTrip).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-muted-foreground capitalize text-xs">{k.replace(/([A-Z])/g, " $1")}:</span>
                          <p className="font-semibold text-xs">{k === "revenue" ? fmtINR(v as number) : String(v)}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 border-border/60">
                    <p className="font-medium mb-2 text-xs">Load Status</p>
                    <LoadTile value={selectedTrip.load} max={25} />
                  </Card>
                  <Card className="p-4 border-border/60">
                    <p className="font-medium mb-2 text-xs">Trip Timeline</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Departure: {selectedTrip.departure}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>ETA: {selectedTrip.eta}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Distance: {selectedTrip.distance.toLocaleString()} km</span>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Sheet open={!!(sheetOpen && selectedRecord)} onOpenChange={(o) => { setSheetOpen(o); if (!o) setSelectedRecord(null) }}>
        <SheetContent className="fmp-sheet-record w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="bg-gradient-to-r from-amber-600 to-emerald-600 bg-clip-text text-transparent text-lg">
              {selectedRecord?.type} Record — {selectedRecord?.id}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-[80vh]">
            <div className="space-y-4 text-sm">
              {selectedRecord && (
                <Card className="p-4 border-border/60">
                  <div className={`h-1.5 rounded-full mb-4 ${selectedRecord.type === "Fuel" ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-orange-400 to-orange-600"}`} />
                  <Badge className={`mb-3 text-[10px] ${selectedRecord.type === "Fuel" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                    {selectedRecord.type === "Fuel" ? "⛽" : "🔧"} {selectedRecord.type}
                  </Badge>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedRecord).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-muted-foreground capitalize text-xs">{k.replace(/([A-Z])/g, " $1")}:</span>
                        <p className="font-semibold text-xs">{k === "cost" ? fmtINR(v as number) : String(v)}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
