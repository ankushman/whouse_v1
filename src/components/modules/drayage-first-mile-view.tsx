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
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts"
import {
  Truck,
  Container,
  Anchor,
  Clock,
  MapPin,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Thermometer,
  Navigation,
  User,
  Wrench,
  CalendarDays,
  ShieldAlert,
  Fuel,
  IndianRupee,
  Gauge,
  Activity,
  RotateCcw,
  Route,
  Package,
  ChevronRight,
  RefreshCw,
  BarChart3,
  Target,
  Star,
  Phone,
  CreditCard,
  Warehouse,
  Loader2,
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
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(2)} L`
      : `₹${n.toLocaleString("en-IN")}`

// ============================================================================
// Enums (returned from generateData)
// ============================================================================
const DRAYAGE_STATUSES = [
  "Pending",
  "Dispatched",
  "In Transit",
  "At Port",
  "Gate-In",
  "Unloading",
  "Completed",
  "Cancelled",
] as const

const ORDER_TYPES = [
  "FCL Import",
  "FCL Export",
  "LCL Import",
  "LCL Export",
  "Empty Return",
  "Devanning",
  "Stuffing",
  "Cross-Dock",
  "Bonded",
  "Transshipment",
] as const

const CONTAINER_TYPES = [
  "20ft",
  "40ft",
  "40ft HC",
  "45ft HC",
  "20ft Open Top",
  "40ft Flat Rack",
  "20ft Reefer",
  "40ft Reefer",
] as const

const INDIAN_PORTS = [
  "JNPT Nhava Sheva",
  "Mundra",
  "Chennai",
  "Hazira",
  "Visakhapatnam",
  "Tuticorin",
  "Cochin",
  "Kolkata",
  "Kandla",
  "Ennore",
  "Dahej",
  "Krishnapatnam",
] as const

const DESTINATIONS = [
  "Mumbai",
  "Delhi NCR",
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Coimbatore",
  "Indore",
  "Nagpur",
  "Vizag",
  "Goa",
] as const

const TRUCK_TYPES = [
  "20ft Trailer",
  "40ft Trailer",
  "Skeleton",
  "Flatbed",
  "Lowbed",
  "Tanker",
  "Reefer",
  "Port Trailer",
  "ICD Trailer",
  "Multi-Axle",
] as const

const TRUCK_STATUSES = [
  "Available",
  "On Trip",
  "Maintenance",
  "At Port",
  "Loading",
  "Unloading",
  "Idle",
  "Out of Service",
] as const

const TRUCKING_COMPANIES = [
  "BlueDart",
  "TCI",
  "VRL",
  "Gati",
  "Transport Corp",
  "BlackBuck",
  "Roadzen",
  "Vahak",
  "Porter",
  "Ninjacart",
  "TVS Supply",
  "DHL",
] as const

const BASE_CITIES = [
  "Mumbai",
  "Delhi",
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Coimbatore",
  "Indore",
  "Nagpur",
  "Vizag",
  "Goa",
  "Surat",
  "Bhopal",
  "Patna",
  "Chandigarh",
  " Kochi",
] as const

const APPT_STATUSES = [
  "Scheduled",
  "Checked-In",
  "Loading",
  "Completed",
  "Cancelled",
  "No-Show",
  "Delayed",
  "Rescheduled",
] as const

const TIME_SLOTS = [
  "6AM-10AM",
  "10AM-2PM",
  "2PM-6PM",
  "6PM-10PM",
  "10PM-2AM",
  "2AM-6AM",
] as const

const APPT_TYPES = [
  "Export Stuffing",
  "Import Devanning",
  "Empty Return",
  "Reefer Inspection",
  "Bonded Transfer",
] as const

const CONTAINER_STATUSES = [
  "At Port",
  "In Transit",
  "At Yard",
  "Unloading",
  "Empty Available",
  "Stuffed",
  "Customs Hold",
  "Released",
] as const

// ============================================================================
// Status color configs
// ============================================================================
const drayageStatusConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Pending: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
  Dispatched: { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  "In Transit": { color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800" },
  "At Port": { color: "text-teal-700 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800" },
  "Gate-In": { color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800" },
  Unloading: { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
  Completed: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  Cancelled: { color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
}

const truckStatusConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Available: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  "On Trip": { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  Maintenance: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
  "At Port": { color: "text-teal-700 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800" },
  Loading: { color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800" },
  Unloading: { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
  Idle: { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-950/30", border: "border-slate-200 dark:border-slate-700" },
  "Out of Service": { color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
}

const apptStatusConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Scheduled: { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  "Checked-In": { color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800" },
  Loading: { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
  Completed: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  Cancelled: { color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
  "No-Show": { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/40", border: "border-slate-300 dark:border-slate-600" },
  Delayed: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
  Rescheduled: { color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800" },
}

const containerTrackingStatusConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  "At Port": { color: "text-teal-700 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800" },
  "In Transit": { color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800" },
  "At Yard": { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  Unloading: { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
  "Empty Available": { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/40", border: "border-slate-300 dark:border-slate-600" },
  Stuffed: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  "Customs Hold": { color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
  Released: { color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800" },
}

const CHART_COLORS = ["#0d9488", "#ea580c", "#4f46e5", "#475569", "#d97706", "#059669"]

// ============================================================================
// Data interfaces
// ============================================================================
interface DrayageOrder {
  id: string
  orderId: string
  status: string
  orderType: string
  containerType: string
  port: string
  destination: string
  containerNo: string
  truckReg: string
  driverName: string
  tripProgress: number
  eta: string
  etaMinutes: number
  cost: number
  detentionDays: number
  detentionLimit: number
  createdAt: string
}

interface TruckRecord {
  id: string
  regNumber: string
  truckType: string
  status: string
  company: string
  driverName: string
  driverLicense: string
  driverPhone: string
  baseCity: string
  currentCity: string
  lat: number
  lng: number
  gpsActive: boolean
  lastTripKm: number
  maintenanceDueKm: number
  currentOdometer: number
  fuelLevel: number
}

interface AppointmentRecord {
  id: string
  appointmentId: string
  status: string
  port: string
  timeSlot: string
  appointmentType: string
  containerCount: number
  containerNos: string[]
  truckReg: string
  gatePassNo: string
  waitMinutes: number
  scheduledDate: string
  notes: string
}

interface ContainerRecord {
  id: string
  containerNo: string
  status: string
  containerType: string
  port: string
  destination: string
  weight: number
  teu: number
  lat: number
  lng: number
  gpsActive: boolean
  eta: string
  etaMinutes: number
  daysInTransit: number
  temperature: number
  isReefer: boolean
}

interface AnalyticsData {
  totalTrips: number
  avgTurnaround: number
  costEfficiency: number
  utilizationRate: number
  detentionIncidents: number
  fuelCost: number
  revenuePerTrip: number
  customerSatisfaction: number
  monthlyTrips: { month: string; import: number; export: number; domestic: number }[]
  portPerformance: { port: string; trips: number; avgHours: number }[]
  containerTypeUtil: { type: string; count: number }[]
  costBreakdown: { category: string; amount: number }[]
  weeklyOnTime: { week: string; onTime: number; delayed: number }[]
  weeklyVolume: { day: string; import: number; export: number; domestic: number; empty: number }[]
  portDistribution: { port: string; trips: number }[]
  orderStatusDist: { status: string; count: number }[]
}

// ============================================================================
// generateData
// ============================================================================
function generateData() {
  const driverNames = [
    "Ravi Kumar", "Suresh Patel", "Anil Reddy", "Mohit Sharma", "Imran Khan",
    "Pradeep Singh", "Venkat Rao", "Joseph Mathew", "Manoj Verma", "Vikram Singh",
    "Harpreet Kaur", "Amit Ranjan", "Sushant Mohanty", "Deepak Joshi", "Rajesh Nair",
    "Karthik Rajan", "Sanjay Gupta", "Arjun Mehta", "Balu Iyer", "Dinesh Yadav",
    "Nikhil Pandey", "Tamil Selvan", "Gurpreet Walia", "Sunil Kulkarni", "Prakash Hegde",
    "Bhaskar Rao", "Ajay Dubey", "Vijay Chauhan", "Krishna Murthy", "Tarun Bhat",
  ]

  const orders: DrayageOrder[] = []
  for (let i = 0; i < 70; i++) {
    const seed = i * 17 + 3
    const status = pick(DRAYAGE_STATUSES, seed)
    const tripProgress =
      status === "Completed"
        ? 100
        : status === "Pending"
          ? 0
          : status === "Dispatched"
            ? ri(5, 20, seed + 1)
            : status === "In Transit"
              ? ri(21, 70, seed + 2)
              : status === "At Port"
                ? ri(71, 80, seed + 3)
                : status === "Gate-In"
                  ? ri(81, 90, seed + 4)
                  : status === "Unloading"
                    ? ri(91, 98, seed + 5)
                    : 0
    const etaMinutes =
      status === "Completed" || status === "Cancelled"
        ? 0
        : ri(15, 480, seed + 10)
    orders.push({
      id: `ord-${i}`,
      orderId: `DRY-${2024}${String(i + 1).padStart(4, "0")}`,
      status,
      orderType: pick(ORDER_TYPES, seed + 6),
      containerType: pick(CONTAINER_TYPES, seed + 7),
      port: pick(INDIAN_PORTS, seed + 8),
      destination: pick(DESTINATIONS, seed + 9),
      containerNo: `MSCU${ri(1000000, 9999999, seed + 11)}`,
      truckReg: `${pick(["MH", "TN", "KA", "GJ", "DL", "RJ", "WB", "TS", "KL", "UP", "HR", "PB"], seed + 12)}-${String(ri(1, 99, seed + 13)).padStart(2, "0")}-${pick(["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"], seed + 14)}-${ri(1000, 9999, seed + 15)}`,
      driverName: pick(driverNames, seed + 16),
      tripProgress,
      eta: etaMinutes > 0 ? `${Math.floor(etaMinutes / 60)}h ${etaMinutes % 60}m` : "—",
      etaMinutes,
      cost: ri(8000, 85000, seed + 17),
      detentionDays: ri(0, 12, seed + 18),
      detentionLimit: pick([7, 10, 14, 21], seed + 19),
      createdAt: `2024-${String(ri(1, 12, seed + 20)).padStart(2, "0")}-${String(ri(1, 28, seed + 21)).padStart(2, "0")}`,
    })
  }

  const trucks: TruckRecord[] = []
  for (let i = 0; i < 50; i++) {
    const seed = i * 23 + 7
    const status = pick(TRUCK_STATUSES, seed)
    const base = pick(BASE_CITIES, seed + 1)
    trucks.push({
      id: `truck-${i}`,
      regNumber: `${pick(["MH", "TN", "KA", "GJ", "DL", "RJ", "WB", "TS", "KL", "UP"], seed + 2)}-${String(ri(1, 99, seed + 3)).padStart(2, "0")}-${pick(["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP"], seed + 4)}-${ri(1000, 9999, seed + 5)}`,
      truckType: pick(TRUCK_TYPES, seed + 6),
      status,
      company: pick(TRUCKING_COMPANIES, seed + 7),
      driverName: pick(driverNames, seed + 8),
      driverLicense: `DL${ri(1000000000, 9999999999, seed + 9)}`,
      driverPhone: `+91 ${ri(7000000000, 9999999999, seed + 10)}`,
      baseCity: base,
      currentCity: status === "Available" || status === "Idle" ? base : pick(BASE_CITIES, seed + 11),
      lat: ri(8, 35, seed + 12) + seededRandom(seed + 13),
      lng: ri(68, 97, seed + 14) + seededRandom(seed + 15),
      gpsActive: status !== "Out of Service" && status !== "Maintenance" ? ri(0, 1, seed + 16) === 1 : false,
      lastTripKm: ri(50, 1200, seed + 17),
      maintenanceDueKm: ri(5000, 20000, seed + 18),
      currentOdometer: ri(10000, 300000, seed + 19),
      fuelLevel: ri(10, 100, seed + 20),
    })
  }

  const appointments: AppointmentRecord[] = []
  for (let i = 0; i < 45; i++) {
    const seed = i * 31 + 11
    const cCount = ri(1, 6, seed + 8)
    const containerNos: string[] = []
    for (let c = 0; c < cCount; c++) {
      containerNos.push(`CSLU${ri(1000000, 9999999, seed + 50 + c)}`)
    }
    appointments.push({
      id: `appt-${i}`,
      appointmentId: `APT-${String(i + 1).padStart(4, "0")}`,
      status: pick(APPT_STATUSES, seed),
      port: pick(INDIAN_PORTS, seed + 1),
      timeSlot: pick(TIME_SLOTS, seed + 2),
      appointmentType: pick(APPT_TYPES, seed + 3),
      containerCount: cCount,
      containerNos,
      truckReg: `${pick(["MH", "TN", "KA", "GJ", "DL"], seed + 4)}-${String(ri(1, 99, seed + 5)).padStart(2, "0")}-${pick(["AB", "CD", "EF"], seed + 6)}-${ri(1000, 9999, seed + 7)}`,
      gatePassNo: `GP-${ri(10000, 99999, seed + 9)}`,
      waitMinutes: ri(0, 180, seed + 10),
      scheduledDate: `2024-${String(ri(1, 12, seed + 11)).padStart(2, "0")}-${String(ri(1, 28, seed + 12)).padStart(2, "0")}`,
      notes: pick(["On schedule", "Priority shipment", "Awaiting customs", "Documents pending", "Carrier delayed", "Equipment ready"], seed + 13),
    })
  }

  const containers: ContainerRecord[] = []
  for (let i = 0; i < 65; i++) {
    const seed = i * 37 + 13
    const ct = pick(CONTAINER_TYPES, seed + 3)
    const isReefer = ct === "20ft Reefer" || ct === "40ft Reefer"
    containers.push({
      id: `ctr-${i}`,
      containerNo: `TCLU${ri(1000000, 9999999, seed)}`,
      status: pick(CONTAINER_STATUSES, seed + 1),
      containerType: ct,
      port: pick(INDIAN_PORTS, seed + 2),
      destination: pick(DESTINATIONS.slice(0, 10), seed + 4),
      weight: ri(2, 32, seed + 5) + seededRandom(seed + 6),
      teu: ct.startsWith("20") ? 1 : 2,
      lat: ri(8, 35, seed + 7) + seededRandom(seed + 8),
      lng: ri(68, 97, seed + 9) + seededRandom(seed + 10),
      gpsActive: ri(0, 1, seed + 11) === 1,
      eta: `${ri(1, 72, seed + 12)}h`,
      etaMinutes: ri(60, 4320, seed + 13),
      daysInTransit: ri(0, 14, seed + 14),
      temperature: isReefer ? ri(-18, 5, seed + 15) : 0,
      isReefer,
    })
  }

  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyTrips = months.map((m, idx) => ({
    month: m,
    import: ri(120, 320, idx * 5 + 100),
    export: ri(80, 250, idx * 5 + 200),
    domestic: ri(40, 150, idx * 5 + 300),
  }))

  const portPerformance = INDIAN_PORTS.slice(0, 6).map((port, idx) => ({
    port: port.split(" ")[0],
    trips: ri(200, 800, idx * 7 + 400),
    avgHours: ri(4, 18, idx * 7 + 500) + seededRandom(idx * 7 + 600),
  }))

  const containerTypeUtil = CONTAINER_TYPES.slice(0, 6).map((type, idx) => ({
    type,
    count: ri(30, 180, idx * 9 + 700),
  }))

  const costBreakdown = [
    { category: "Fuel", amount: ri(150000, 400000, 800) },
    { category: "Toll", amount: ri(50000, 150000, 801) },
    { category: "Driver", amount: ri(200000, 500000, 802) },
    { category: "Labor", amount: ri(80000, 200000, 803) },
    { category: "Equipment", amount: ri(100000, 300000, 804) },
    { category: "Misc", amount: ri(20000, 80000, 805) },
  ]

  const weeks = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"]
  const weeklyOnTime = weeks.map((w, idx) => ({
    week: w,
    onTime: ri(60, 95, idx * 3 + 900),
    delayed: ri(5, 40, idx * 3 + 950),
  }))

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weeklyVolume = days.map((d, idx) => ({
    day: d,
    import: ri(20, 60, idx * 4 + 1000),
    export: ri(15, 50, idx * 4 + 1100),
    domestic: ri(5, 25, idx * 4 + 1200),
    empty: ri(3, 15, idx * 4 + 1300),
  }))

  const portDistribution = INDIAN_PORTS.slice(0, 6).map((port, idx) => ({
    port: port.split(" ")[0],
    trips: ri(100, 500, idx * 11 + 1400),
  }))

  const orderStatusDist = DRAYAGE_STATUSES.map((s, idx) => ({
    status: s,
    count: ri(3, 20, idx * 13 + 1500),
  }))

  const analytics: AnalyticsData = {
    totalTrips: 2847,
    avgTurnaround: 8.4,
    costEfficiency: 94.2,
    utilizationRate: 87.6,
    detentionIncidents: 23,
    fuelCost: 4250000,
    revenuePerTrip: 32500,
    customerSatisfaction: 4.6,
    monthlyTrips,
    portPerformance,
    containerTypeUtil,
    costBreakdown,
    weeklyOnTime,
    weeklyVolume,
    portDistribution,
    orderStatusDist,
  }

  return {
    orders,
    trucks,
    appointments,
    containers,
    analytics,
  }
}

// ============================================================================
// Unique Visual Components (22)
// ============================================================================

// 1. DrayageStatusBadge — 8-tier status pill
function DrayageStatusBadge({ status }: { status: string }) {
  const cfg = drayageStatusConfig[status] ?? drayageStatusConfig["Pending"]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold dfm-status-badge",
        cfg.color,
        cfg.bg,
        cfg.border
      )}
    >
      {status}
    </span>
  )
}

// 2. OrderTypeBadge — drayage order type with color
function OrderTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    "FCL Import": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
    "FCL Export": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    "LCL Import": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    "LCL Export": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    "Empty Return": "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
    Devanning: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    Stuffing: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Cross-Dock": "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
    Bonded: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    Transshipment: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-transparent px-2 py-0.5 text-[10px] font-medium dfm-order-type-badge",
        colorMap[type] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {type}
    </span>
  )
}

// 3. ContainerTypeBadge — container size/type badge
function ContainerTypeBadge({ type }: { type: string }) {
  const isReefer = type.includes("Reefer")
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium dfm-container-type-badge",
        isReefer
          ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
      )}
    >
      {isReefer && <Thermometer className="h-2.5 w-2.5" />}
      {type}
    </span>
  )
}

// 4. PortBadge — Indian port pill
function PortBadge({ port }: { port: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-800 dark:border-teal-700 dark:bg-teal-950/30 dark:text-teal-300 dfm-port-badge"
      )}
    >
      <Anchor className="h-2.5 w-2.5" />
      {port}
    </span>
  )
}

// 5. ETAIndicator — time remaining with color
function ETAIndicator({ minutes }: { minutes: number }) {
  if (minutes <= 0)
    return (
      <span className="text-[10px] text-muted-foreground dfm-eta-indicator">—</span>
    )
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const urgency =
    minutes <= 60
      ? "text-red-600 dark:text-red-400"
      : minutes <= 180
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium dfm-eta-indicator",
        urgency
      )}
    >
      <Clock className="h-2.5 w-2.5" />
      {h}h {m}m
    </span>
  )
}

// 6. TripProgressIndicator — 6-stage progress bar
function TripProgressIndicator({ progress }: { progress: number }) {
  const stages = [
    "Assigned",
    "Picked Up",
    "In Transit",
    "At Port",
    "Gate-In",
    "Unloading",
  ]
  const currentStage = Math.min(
    Math.floor((progress / 100) * stages.length),
    stages.length - 1
  )
  return (
    <div className="flex flex-col gap-1 dfm-trip-progress">
      <div className="flex items-center gap-0.5">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage}>
            <div
              className={cn(
                "flex-1 text-center",
                idx <= currentStage ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground/40"
              )}
            >
              <div
                className={cn(
                  "h-1 rounded-full transition-colors",
                  idx <= currentStage
                    ? "bg-teal-500 dark:bg-teal-400"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              />
              <span className="text-[8px] leading-tight block mt-0.5">{stage}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="text-right text-[10px] text-muted-foreground font-medium">{progress}%</div>
    </div>
  )
}

// 7. CostTile — INR amount with icon
function CostTile({ amount }: { amount: number }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 dfm-cost-tile">
      <IndianRupee className="h-3 w-3" />
      {formatINR(amount)}
    </div>
  )
}

// 8. DetentionWarningBadge — warning when near detention limit
function DetentionWarningBadge({
  days,
  limit,
}: {
  days: number
  limit: number
}) {
  if (days === 0)
    return (
      <span className="text-[10px] text-muted-foreground dfm-detention-badge">
        No detention
      </span>
    )
  const ratio = days / limit
  const isOver = ratio >= 1
  const isNear = ratio >= 0.75
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold dfm-detention-badge",
        isOver
          ? "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-400 animate-pulse"
          : isNear
            ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse"
            : "border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950/40 dark:text-green-400"
      )}
    >
      {isOver ? (
        <XCircle className="h-2.5 w-2.5" />
      ) : isNear ? (
        <AlertTriangle className="h-2.5 w-2.5" />
      ) : (
        <CheckCircle2 className="h-2.5 w-2.5" />
      )}
      {days}/{limit} days
    </span>
  )
}

// 9. TruckStatusBadge — 8-tier truck status
function TruckStatusBadge({ status }: { status: string }) {
  const cfg = truckStatusConfig[status] ?? truckStatusConfig["Available"]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold dfm-truck-status-badge",
        cfg.color,
        cfg.bg,
        cfg.border
      )}
    >
      {status}
    </span>
  )
}

// 10. TruckTypeBadge — truck type pill
function TruckTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-800 dark:bg-orange-950/30 dark:text-orange-300 dfm-truck-type-badge"
      )}
    >
      <Truck className="h-2.5 w-2.5" />
      {type}
    </span>
  )
}

// 11. CompanyBadge — trucking company badge
function CompanyBadge({ company }: { company: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300 dfm-company-badge"
      )}
    >
      {company}
    </span>
  )
}

// 12. DriverInfoTile — name + license + phone compact tile
function DriverInfoTile({
  name,
  license,
  phone,
}: {
  name: string
  license: string
  phone: string
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/40 dfm-driver-tile">
      <div className="flex items-center gap-1.5">
        <User className="h-3 w-3 text-slate-600 dark:text-slate-400" />
        <span className="text-xs font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <CreditCard className="h-2.5 w-2.5" />
        <span className="font-mono">{license}</span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Phone className="h-2.5 w-2.5" />
        <span className="font-mono">{phone}</span>
      </div>
    </div>
  )
}

// 13. LocationTile — city + GPS status
function LocationTile({
  city,
  gpsActive,
}: {
  city: string
  gpsActive: boolean
}) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] dfm-location-tile">
      <MapPin
        className={cn(
          "h-2.5 w-2.5",
          gpsActive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-500 dark:text-red-400"
        )}
      />
      <span className="font-medium">{city}</span>
      <span
        className={cn(
          "text-[9px] font-medium",
          gpsActive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-500 dark:text-red-400"
        )}
      >
        {gpsActive ? "GPS ●" : "GPS ○"}
      </span>
    </div>
  )
}

// 14. MaintenanceDueBadge — maintenance due indicator
function MaintenanceDueBadge({
  current,
  due,
}: {
  current: number
  due: number
}) {
  const remaining = due - (current % due)
  const ratio = remaining / due
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium dfm-maintenance-badge",
        ratio <= 0.1
          ? "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-400"
          : ratio <= 0.25
            ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
            : "border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950/40 dark:text-green-400"
      )}
    >
      <Wrench className="h-2.5 w-2.5" />
      {remaining} km
    </span>
  )
}

// 15. AppointmentStatusBadge — 8-tier appointment status
function AppointmentStatusBadge({ status }: { status: string }) {
  const cfg = apptStatusConfig[status] ?? apptStatusConfig["Scheduled"]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold dfm-appt-status-badge",
        cfg.color,
        cfg.bg,
        cfg.border
      )}
    >
      {status}
    </span>
  )
}

// 16. TimeSlotBadge — time slot with color
function TimeSlotBadge({ slot }: { slot: string }) {
  const isNight = slot.includes("PM") || slot.includes("AM")
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium dfm-time-slot-badge",
        isNight
          ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
          : "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"
      )}
    >
      <Clock className="h-2.5 w-2.5" />
      {slot}
    </span>
  )
}

// 17. GatePassBadge — gate pass status
function GatePassBadge({ passNo }: { passNo: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 dfm-gate-pass-badge"
      )}
    >
      {passNo}
    </span>
  )
}

// 18. WaitTimeIndicator — wait time at port (color coded)
function WaitTimeIndicator({ minutes }: { minutes: number }) {
  const color =
    minutes >= 120
      ? "text-red-600 dark:text-red-400"
      : minutes >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-semibold dfm-wait-time",
        color
      )}
    >
      <Timer className="h-2.5 w-2.5" />
      {minutes} min
    </span>
  )
}

// 19. ContainerCountTile — container count for appointment
function ContainerCountTile({ count }: { count: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 dark:border-indigo-700 dark:bg-indigo-950/30 dfm-container-count-tile">
      <Container className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
      <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">
        {count}
      </span>
      <span className="text-[10px] text-indigo-600 dark:text-indigo-400">
        containers
      </span>
    </div>
  )
}

// 20. GPSLocationTile — GPS coordinates with status
function GPSLocationTile({
  lat,
  lng,
  active,
}: {
  lat: number
  lng: number
  active: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-mono dfm-gps-tile",
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
          : "border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950/30 dark:text-red-400"
      )}
    >
      <Navigation
        className={cn(
          "h-2.5 w-2.5",
          active
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-500 dark:text-red-400"
        )}
      />
      {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
    </div>
  )
}

// 21. DaysInTransitCounter — day counter with color
function DaysInTransitCounter({ days }: { days: number }) {
  const color =
    days >= 10
      ? "text-red-600 dark:text-red-400"
      : days >= 5
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold dfm-days-counter",
        color,
        days >= 10
          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
          : days >= 5
            ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
            : "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
      )}
    >
      <Activity className="h-2.5 w-2.5" />
      {days} day{days !== 1 ? "s" : ""}
    </span>
  )
}

// 22. TemperatureIndicator — for reefer containers (°C)
function TemperatureIndicator({
  temp,
  isReefer,
}: {
  temp: number
  isReefer: boolean
}) {
  if (!isReefer)
    return (
      <span className="text-[10px] text-muted-foreground dfm-temp-indicator">
        N/A
      </span>
    )
  const isOk = temp >= -25 && temp <= 5
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold dfm-temp-indicator",
        isOk
          ? "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300"
          : "border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950/30 dark:text-red-400"
      )}
    >
      <Thermometer className="h-2.5 w-2.5" />
      {temp}°C
    </span>
  )
}

// ============================================================================
// KPI Card helper
// ============================================================================
function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ElementType
  trend?: "up" | "down" | "neutral"
  color: string
}) {
  return (
    <Card className="dfm-kpi-card">
      <CardContent className="glass-subtle p-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground font-medium">
              {title}
            </span>
            <span className="text-lg font-bold tracking-tight">{value}</span>
            <div className="flex items-center gap-1">
              {trend === "up" && (
                <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              )}
              {trend === "down" && (
                <ArrowDownRight className="h-3 w-3 text-red-600 dark:text-red-400" />
              )}
              <span className="text-[10px] text-muted-foreground">{subtitle}</span>
            </div>
          </div>
          <div className={cn("rounded-lg p-2", color)}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export default function DrayageFirstMileView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState<string>("0")

  // Filters — Tab 1
  const [orderSearch, setOrderSearch] = useState("")
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")
  // Filters — Tab 2
  const [truckSearch, setTruckSearch] = useState("")
  const [truckStatusFilter, setTruckStatusFilter] = useState("all")
  // Filters — Tab 3
  const [apptSearch, setApptSearch] = useState("")
  const [apptStatusFilter, setApptStatusFilter] = useState("all")
  // Filters — Tab 4
  const [containerSearch, setContainerSearch] = useState("")
  const [containerStatusFilter, setContainerStatusFilter] = useState("all")

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<DrayageOrder | null>(null)
  const [selectedTruck, setSelectedTruck] = useState<TruckRecord | null>(null)
  const [selectedAppt, setSelectedAppt] = useState<AppointmentRecord | null>(null)
  const [selectedContainer, setSelectedContainer] =
    useState<ContainerRecord | null>(null)

  // Sort states
  const [orderSortCol, setOrderSortCol] = useState<string>("id")
  const [orderSortDir, setOrderSortDir] = useState<"asc" | "desc">("asc")
  const [truckSortCol, setTruckSortCol] = useState<string>("id")
  const [truckSortDir, setTruckSortDir] = useState<"asc" | "desc">("asc")

  const openDrawer = (
    type: string,
    item:
      | DrayageOrder
      | TruckRecord
      | AppointmentRecord
      | ContainerRecord
      | null
  ) => {
    setDrawerType(type)
    if (type === "order") setSelectedOrder(item as unknown as DrayageOrder)
    if (type === "truck") setSelectedTruck(item as unknown as TruckRecord)
    if (type === "appointment")
      setSelectedAppt(item as unknown as AppointmentRecord)
    if (type === "container")
      setSelectedContainer(item as unknown as ContainerRecord)
    setDrawerOpen(true)
  }

  const handleSort = (
    col: string,
    tab: "order" | "truck"
  ) => {
    if (tab === "order") {
      if (orderSortCol === col) {
        setOrderSortDir(orderSortDir === "asc" ? "desc" : "asc")
      } else {
        setOrderSortCol(col)
        setOrderSortDir("asc")
      }
    } else {
      if (truckSortCol === col) {
        setTruckSortDir(truckSortDir === "asc" ? "desc" : "asc")
      } else {
        setTruckSortCol(col)
        setTruckSortDir("asc")
      }
    }
  }

  const SortHeader = ({
    col,
    label,
    tab,
  }: {
    col: string
    label: string
    tab: "order" | "truck"
  }) => {
    const sortCol = tab === "order" ? orderSortCol : truckSortCol
    const sortDir = tab === "order" ? orderSortDir : truckSortDir
    return (
      <TableHead
        className="text-xs cursor-pointer select-none hover:bg-accent/50"
        onClick={() => handleSort(col, tab)}
      >
        <div className="flex items-center gap-0.5">
          {label}
          {sortCol === col && (
            <span className="text-[9px]">
              {sortDir === "asc" ? "↑" : "↓"}
            </span>
          )}
        </div>
      </TableHead>
    )
  }

  // Filtered + sorted data
  const filteredOrders = useMemo(() => {
    let filtered = data.orders
    if (orderStatusFilter !== "all")
      filtered = filtered.filter((o) => o.status === orderStatusFilter)
    if (orderSearch)
      filtered = filtered.filter(
        (o) =>
          o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
          o.containerNo.toLowerCase().includes(orderSearch.toLowerCase()) ||
          o.destination.toLowerCase().includes(orderSearch.toLowerCase())
      )
    return [...filtered].sort((a, b) => {
      const dir = orderSortDir === "asc" ? 1 : -1
      const aVal = a[orderSortCol as keyof DrayageOrder]
      const bVal = b[orderSortCol as keyof DrayageOrder]
      if (typeof aVal === "number" && typeof bVal === "number")
        return (aVal - bVal) * dir
      return String(aVal).localeCompare(String(bVal)) * dir
    })
  }, [data.orders, orderSearch, orderStatusFilter, orderSortCol, orderSortDir])

  const filteredTrucks = useMemo(() => {
    let filtered = data.trucks
    if (truckStatusFilter !== "all")
      filtered = filtered.filter((t) => t.status === truckStatusFilter)
    if (truckSearch)
      filtered = filtered.filter(
        (t) =>
          t.regNumber.toLowerCase().includes(truckSearch.toLowerCase()) ||
          t.driverName.toLowerCase().includes(truckSearch.toLowerCase()) ||
          t.company.toLowerCase().includes(truckSearch.toLowerCase())
      )
    return [...filtered].sort((a, b) => {
      const dir = truckSortDir === "asc" ? 1 : -1
      const aVal = a[truckSortCol as keyof TruckRecord]
      const bVal = b[truckSortCol as keyof TruckRecord]
      if (typeof aVal === "number" && typeof bVal === "number")
        return (aVal - bVal) * dir
      return String(aVal).localeCompare(String(bVal)) * dir
    })
  }, [data.trucks, truckSearch, truckStatusFilter, truckSortCol, truckSortDir])

  const filteredAppointments = useMemo(() => {
    let filtered = data.appointments
    if (apptStatusFilter !== "all")
      filtered = filtered.filter((a) => a.status === apptStatusFilter)
    if (apptSearch)
      filtered = filtered.filter(
        (a) =>
          a.appointmentId.toLowerCase().includes(apptSearch.toLowerCase()) ||
          a.port.toLowerCase().includes(apptSearch.toLowerCase())
      )
    return filtered
  }, [data.appointments, apptSearch, apptStatusFilter])

  const filteredContainers = useMemo(() => {
    let filtered = data.containers
    if (containerStatusFilter !== "all")
      filtered = filtered.filter((c) => c.status === containerStatusFilter)
    if (containerSearch)
      filtered = filtered.filter(
        (c) =>
          c.containerNo.toLowerCase().includes(containerSearch.toLowerCase()) ||
          c.destination.toLowerCase().includes(containerSearch.toLowerCase())
      )
    return filtered
  }, [data.containers, containerSearch, containerStatusFilter])

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <PageHeader
        title="Drayage & First-Mile Operations"
        description="Manage container drayage between Indian ports/ICDs and warehouses"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 h-9">
          <TabsTrigger value="0" className="text-[11px]">Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="text-[11px]">Active Orders</TabsTrigger>
          <TabsTrigger value="2" className="text-[11px]">Trucks & Drivers</TabsTrigger>
          <TabsTrigger value="3" className="text-[11px]">Port Scheduling</TabsTrigger>
          <TabsTrigger value="4" className="text-[11px]">Containers</TabsTrigger>
          <TabsTrigger value="5" className="text-[11px]">Analytics</TabsTrigger>
        </TabsList>

        {/* ================================================================ */}
        {/* TAB 0 — Drayage Dashboard                                        */}
        {/* ================================================================ */}
        <TabsContent value="0" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            <KpiCard
              title="Active Drayage Orders"
              value={String(data.orders.filter((o) => !["Completed", "Cancelled"].includes(o.status)).length)}
              subtitle="+12% vs last week"
              icon={Package}
              trend="up"
              color="bg-teal-600"
            />
            <KpiCard
              title="Containers in Transit"
              value={String(data.orders.filter((o) => o.status === "In Transit").length)}
              subtitle="4 arriving today"
              icon={Container}
              trend="neutral"
              color="bg-indigo-600"
            />
            <KpiCard
              title="Trucks Available"
              value={String(data.trucks.filter((t) => t.status === "Available").length)}
              subtitle="15 on standby"
              icon={Truck}
              trend="up"
              color="bg-orange-600"
            />
            <KpiCard
              title="Avg Turnaround Time"
              value="8.4h"
              subtitle="-0.6h improvement"
              icon={Timer}
              trend="up"
              color="bg-slate-600"
            />
            <KpiCard
              title="Today's Gate-In"
              value="18"
              subtitle="3 pending check-in"
              icon={Warehouse}
              trend="neutral"
              color="bg-amber-600"
            />
            <KpiCard
              title="Pending Appointments"
              value={String(data.appointments.filter((a) => ["Scheduled", "Delayed", "Rescheduled"].includes(a.status)).length)}
              subtitle="6 this week"
              icon={CalendarDays}
              trend="down"
              color="bg-emerald-600"
            />
            <KpiCard
              title="Avg Cost per Trip"
              value={formatINR(32500)}
              subtitle="₹2.1K saved vs avg"
              icon={IndianRupee}
              trend="up"
              color="bg-rose-600"
            />
            <KpiCard
              title="On-Time Rate"
              value="92.4%"
              subtitle="+1.8% vs last month"
              icon={Target}
              trend="up"
              color="bg-cyan-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Weekly Trip Volume */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Weekly Trip Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <AreaChart data={data.analytics.weeklyVolume}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="import" stackId="1" stroke="#0d9488" fill="#0d9488" fillOpacity={0.6} name="Import" />
                    <Area type="monotone" dataKey="export" stackId="1" stroke="#ea580c" fill="#ea580c" fillOpacity={0.6} name="Export" />
                    <Area type="monotone" dataKey="domestic" stackId="1" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} name="Domestic" />
                    <Area type="monotone" dataKey="empty" stackId="1" stroke="#475569" fill="#475569" fillOpacity={0.6} name="Empty Return" />
                  </AreaChart>
                </div>
              </CardContent>
            </Card>

            {/* Port-wise Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Port-wise Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <BarChart data={data.analytics.portDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="port" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="trips" radius={[4, 4, 0, 0]}>
                      {data.analytics.portDistribution.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <PieChart>
                    <Pie
                      data={data.analytics.orderStatusDist}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ status, percent }: { status: string; percent: number }) =>
                        `${status} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                      fontSize={9}
                    >
                      {data.analytics.orderStatusDist.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={CHART_COLORS[idx % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================================================================ */}
        {/* TAB 1 — Active Drayage Orders                                     */}
        {/* ================================================================ */}
        <TabsContent value="1" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-semibold">
                  Active Drayage Orders ({filteredOrders.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search order, container, destination..."
                      className="h-8 pl-7 text-xs"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                  </div>
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <Filter className="h-3 w-3 mr-1" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {DRAYAGE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="glass-subtle pt-0">
              <div className="rounded-lg border overflow-x-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <SortHeader col="orderId" label="Order ID" tab="order" />
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Container</TableHead>
                      <TableHead className="text-xs">Port → Dest</TableHead>
                      <TableHead className="text-xs">Progress</TableHead>
                      <SortHeader col="etaMinutes" label="ETA" tab="order" />
                      <SortHeader col="cost" label="Cost" tab="order" />
                      <TableHead className="text-xs">Detention</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.slice(0, 50).map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-accent/40 transition-colors dfm-order-row"
                        onClick={() => openDrawer("order", order)}
                      >
                        <TableCell>
                          <span className="text-xs font-mono font-semibold">{order.orderId}</span>
                        </TableCell>
                        <TableCell>
                          <DrayageStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>
                          <OrderTypeBadge type={order.orderType} />
                        </TableCell>
                        <TableCell>
                          <ContainerTypeBadge type={order.containerType} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <PortBadge port={order.port} />
                            <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              <ChevronRight className="h-2 w-2" />
                              {order.destination}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TripProgressIndicator progress={order.tripProgress} />
                        </TableCell>
                        <TableCell>
                          <ETAIndicator minutes={order.etaMinutes} />
                        </TableCell>
                        <TableCell>
                          <CostTile amount={order.cost} />
                        </TableCell>
                        <TableCell>
                          <DetentionWarningBadge days={order.detentionDays} limit={order.detentionLimit} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDrawer("order", order)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center text-xs text-muted-foreground">
                          No orders match the current filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* TAB 2 — Truck & Driver Management                                  */}
        {/* ================================================================ */}
        <TabsContent value="2" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-semibold">
                  Truck & Driver Management ({filteredTrucks.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search reg, driver, company..."
                      className="h-8 pl-7 text-xs"
                      value={truckSearch}
                      onChange={(e) => setTruckSearch(e.target.value)}
                    />
                  </div>
                  <Select value={truckStatusFilter} onValueChange={setTruckStatusFilter}>
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <Filter className="h-3 w-3 mr-1" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {TRUCK_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="glass-subtle pt-0">
              <div className="rounded-lg border overflow-x-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <SortHeader col="regNumber" label="Reg No." tab="truck" />
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Company</TableHead>
                      <TableHead className="text-xs">Driver</TableHead>
                      <TableHead className="text-xs">Location</TableHead>
                      <SortHeader col="fuelLevel" label="Fuel" tab="truck" />
                      <TableHead className="text-xs">Maintenance</TableHead>
                      <TableHead className="text-xs">Odometer</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrucks.slice(0, 50).map((truck) => (
                      <TableRow
                        key={truck.id}
                        className="cursor-pointer hover:bg-accent/40 transition-colors dfm-truck-row"
                        onClick={() => openDrawer("truck", truck)}
                      >
                        <TableCell>
                          <span className="text-xs font-mono font-semibold">{truck.regNumber}</span>
                        </TableCell>
                        <TableCell>
                          <TruckStatusBadge status={truck.status} />
                        </TableCell>
                        <TableCell>
                          <TruckTypeBadge type={truck.truckType} />
                        </TableCell>
                        <TableCell>
                          <CompanyBadge company={truck.company} />
                        </TableCell>
                        <TableCell>
                          <span className="text-xs">{truck.driverName}</span>
                        </TableCell>
                        <TableCell>
                          <LocationTile city={truck.currentCity} gpsActive={truck.gpsActive} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Fuel className="h-2.5 w-2.5 text-amber-500" />
                            <span
                              className={cn(
                                "text-[10px] font-bold",
                                truck.fuelLevel <= 20
                                  ? "text-red-600 dark:text-red-400"
                                  : truck.fuelLevel <= 40
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-emerald-600 dark:text-emerald-400"
                              )}
                            >
                              {truck.fuelLevel}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <MaintenanceDueBadge current={truck.currentOdometer} due={truck.maintenanceDueKm} />
                        </TableCell>
                        <TableCell>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {(truck.currentOdometer / 1000).toFixed(1)}K km
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDrawer("truck", truck)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* TAB 3 — Port/ICD Scheduling                                       */}
        {/* ================================================================ */}
        <TabsContent value="3" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-semibold">
                  Port/ICD Scheduling ({filteredAppointments.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search appointment, port..."
                      className="h-8 pl-7 text-xs"
                      value={apptSearch}
                      onChange={(e) => setApptSearch(e.target.value)}
                    />
                  </div>
                  <Select value={apptStatusFilter} onValueChange={setApptStatusFilter}>
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <Filter className="h-3 w-3 mr-1" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {APPT_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="glass-subtle pt-0">
              <div className="rounded-lg border overflow-x-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Appointment</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Port</TableHead>
                      <TableHead className="text-xs">Time Slot</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Containers</TableHead>
                      <TableHead className="text-xs">Gate Pass</TableHead>
                      <TableHead className="text-xs">Wait Time</TableHead>
                      <TableHead className="text-xs">Truck</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appt) => (
                      <TableRow
                        key={appt.id}
                        className="cursor-pointer hover:bg-accent/40 transition-colors dfm-appt-row"
                        onClick={() => openDrawer("appointment", appt)}
                      >
                        <TableCell>
                          <span className="text-xs font-mono font-semibold">{appt.appointmentId}</span>
                        </TableCell>
                        <TableCell>
                          <AppointmentStatusBadge status={appt.status} />
                        </TableCell>
                        <TableCell>
                          <PortBadge port={appt.port} />
                        </TableCell>
                        <TableCell>
                          <TimeSlotBadge slot={appt.timeSlot} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="badge-interactive text-[10px]">{appt.appointmentType}</Badge>
                        </TableCell>
                        <TableCell>
                          <ContainerCountTile count={appt.containerCount} />
                        </TableCell>
                        <TableCell>
                          <GatePassBadge passNo={appt.gatePassNo} />
                        </TableCell>
                        <TableCell>
                          <WaitTimeIndicator minutes={appt.waitMinutes} />
                        </TableCell>
                        <TableCell>
                          <span className="text-[10px] font-mono text-muted-foreground">{appt.truckReg}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDrawer("appointment", appt)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* TAB 4 — Container Tracking                                         */}
        {/* ================================================================ */}
        <TabsContent value="4" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-semibold">
                  Container Tracking ({filteredContainers.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search container, destination..."
                      className="h-8 pl-7 text-xs"
                      value={containerSearch}
                      onChange={(e) => setContainerSearch(e.target.value)}
                    />
                  </div>
                  <Select value={containerStatusFilter} onValueChange={setContainerStatusFilter}>
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <Filter className="h-3 w-3 mr-1" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {CONTAINER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="glass-subtle pt-0">
              <div className="rounded-lg border overflow-x-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Container</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Port</TableHead>
                      <TableHead className="text-xs">Destination</TableHead>
                      <TableHead className="text-xs">TEU / Weight</TableHead>
                      <TableHead className="text-xs">GPS</TableHead>
                      <TableHead className="text-xs">ETA</TableHead>
                      <TableHead className="text-xs">Days</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContainers.slice(0, 50).map((ctr) => (
                      <TableRow
                        key={ctr.id}
                        className="cursor-pointer hover:bg-accent/40 transition-colors dfm-container-row"
                        onClick={() => openDrawer("container", ctr)}
                      >
                        <TableCell>
                          <span className="text-xs font-mono font-semibold">{ctr.containerNo}</span>
                        </TableCell>
                        <TableCell>
                          <DrayageStatusBadge status={ctr.status} />
                        </TableCell>
                        <TableCell>
                          <ContainerTypeBadge type={ctr.containerType} />
                        </TableCell>
                        <TableCell>
                          <PortBadge port={ctr.port} />
                        </TableCell>
                        <TableCell>
                          <span className="text-xs">{ctr.destination}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-medium">{ctr.teu} TEU</span>
                            <span className="text-[10px] text-muted-foreground">{ctr.weight.toFixed(1)} tons</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <GPSLocationTile lat={ctr.lat} lng={ctr.lng} active={ctr.gpsActive} />
                        </TableCell>
                        <TableCell>
                          <ETAIndicator minutes={ctr.etaMinutes} />
                        </TableCell>
                        <TableCell>
                          <DaysInTransitCounter days={ctr.daysInTransit} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDrawer("container", ctr)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* TAB 5 — Drayage Analytics                                          */}
        {/* ================================================================ */}
        <TabsContent value="5" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            <KpiCard
              title="Total Trips"
              value={String(data.analytics.totalTrips)}
              subtitle="+14% vs last quarter"
              icon={Route}
              trend="up"
              color="bg-teal-600"
            />
            <KpiCard
              title="Avg Turnaround"
              value={`${data.analytics.avgTurnaround}h`}
              subtitle="-0.8h improvement"
              icon={Timer}
              trend="up"
              color="bg-orange-600"
            />
            <KpiCard
              title="Cost Efficiency"
              value={`${data.analytics.costEfficiency}%`}
              subtitle="+2.1% vs target"
              icon={TrendingUp}
              trend="up"
              color="bg-indigo-600"
            />
            <KpiCard
              title="Utilization Rate"
              value={`${data.analytics.utilizationRate}%`}
              subtitle="87.6% fleet utilized"
              icon={Gauge}
              trend="up"
              color="bg-slate-600"
            />
            <KpiCard
              title="Detention Incidents"
              value={String(data.analytics.detentionIncidents)}
              subtitle="-5 vs last month"
              icon={AlertTriangle}
              trend="up"
              color="bg-amber-600"
            />
            <KpiCard
              title="Fuel Cost"
              value={formatINR(data.analytics.fuelCost)}
              subtitle="₹42.5L this month"
              icon={Fuel}
              trend="down"
              color="bg-emerald-600"
            />
            <KpiCard
              title="Revenue per Trip"
              value={formatINR(data.analytics.revenuePerTrip)}
              subtitle="+₹1.2K per trip"
              icon={IndianRupee}
              trend="up"
              color="bg-rose-600"
            />
            <KpiCard
              title="Customer Satisfaction"
              value={`${data.analytics.customerSatisfaction}/5`}
              subtitle="Based on 340 reviews"
              icon={Star}
              trend="up"
              color="bg-cyan-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Monthly Trip Trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Monthly Trip Trend (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <LineChart data={data.analytics.monthlyTrips}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="import" stroke="#0d9488" strokeWidth={2} name="Import" />
                    <Line type="monotone" dataKey="export" stroke="#ea580c" strokeWidth={2} name="Export" />
                    <Line type="monotone" dataKey="domestic" stroke="#4f46e5" strokeWidth={2} name="Domestic" />
                  </LineChart>
                </div>
              </CardContent>
            </Card>

            {/* Port Performance Comparison */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Port Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <BarChart data={data.analytics.portPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="port" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="trips" fill="#0d9488" radius={[4, 4, 0, 0]} name="Trips" />
                    <Bar dataKey="avgHours" fill="#ea580c" radius={[4, 4, 0, 0]} name="Avg Hours" />
                  </BarChart>
                </div>
              </CardContent>
            </Card>

            {/* Container Type Utilization */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Container Type Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <PieChart>
                    <Pie
                      data={data.analytics.containerTypeUtil}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ type, count }: { type: string; count: number }) =>
                        `${type}: ${count}`
                      }
                      labelLine={false}
                      fontSize={9}
                    >
                      {data.analytics.containerTypeUtil.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <BarChart data={data.analytics.costBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 9 }} width={70} />
                    <Tooltip formatter={(val: number) => formatINR(val)} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                      {data.analytics.costBreakdown.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
              </CardContent>
            </Card>

            {/* Weekly On-Time Performance */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Weekly On-Time Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <AreaChart data={data.analytics.weeklyOnTime}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="onTime" stroke="#059669" fill="#059669" fillOpacity={0.4} name="On-Time %" />
                    <Area type="monotone" dataKey="delayed" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} name="Delayed %" />
                  </AreaChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ================================================================== */}
      {/* DRAWER                                                             */}
      {/* ================================================================== */}
      <Sheet
        open={!!(drawerOpen && drawerType)}
        onOpenChange={(open) => {
          setDrawerOpen(open)
          if (!open) setDrawerType(null)
        }}
      >
        <SheetContent side="right" className="w-[460px] overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Detail Drawer</SheetTitle>
          </SheetHeader>

          {drawerType === "order" && selectedOrder && (
            <>
              {/* Gradient header */}
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5" />
                  <h3 className="text-lg font-bold">{selectedOrder.orderId}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <DrayageStatusBadge status={selectedOrder.status} />
                  <OrderTypeBadge type={selectedOrder.orderType} />
                  <ContainerTypeBadge type={selectedOrder.containerType} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <TripProgressIndicator progress={selectedOrder.tripProgress} />
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Container</span>
                    <span className="text-xs font-mono font-semibold">{selectedOrder.containerNo}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Truck</span>
                    <span className="text-xs font-mono">{selectedOrder.truckReg}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Driver</span>
                    <span className="text-xs">{selectedOrder.driverName}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Created</span>
                    <span className="text-xs">{selectedOrder.createdAt}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <PortBadge port={selectedOrder.port} />
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium">{selectedOrder.destination}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <CostTile amount={selectedOrder.cost} />
                  <ETAIndicator minutes={selectedOrder.etaMinutes} />
                  <DetentionWarningBadge days={selectedOrder.detentionDays} limit={selectedOrder.detentionLimit} />
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.info("Reassigning", `${selectedOrder.orderId} is being reassigned`)
                      setDrawerOpen(false)
                    }}
                  >
                    <RefreshCw className="h-3 w-3" /> Reassign
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.success("Tracking enabled", `Live tracking for ${selectedOrder.orderId}`)
                    }}
                  >
                    <Navigation className="h-3 w-3" /> Track
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.warning("Escalated", `${selectedOrder.orderId} has been escalated to operations`)
                      setDrawerOpen(false)
                    }}
                  >
                    <AlertTriangle className="h-3 w-3" /> Escalate
                  </Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "truck" && selectedTruck && (
            <>
              {/* Gradient header orange→amber */}
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5" />
                  <h3 className="text-lg font-bold">{selectedTruck.regNumber}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <TruckStatusBadge status={selectedTruck.status} />
                  <TruckTypeBadge type={selectedTruck.truckType} />
                  <CompanyBadge company={selectedTruck.company} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <DriverInfoTile
                  name={selectedTruck.driverName}
                  license={selectedTruck.driverLicense}
                  phone={selectedTruck.driverPhone}
                />
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <LocationTile city={selectedTruck.currentCity} gpsActive={selectedTruck.gpsActive} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Fuel Level</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedTruck.fuelLevel} className="h-2 flex-1" />
                      <span className="text-[10px] font-bold">{selectedTruck.fuelLevel}%</span>
                    </div>
                  </div>
                  <MaintenanceDueBadge current={selectedTruck.currentOdometer} due={selectedTruck.maintenanceDueKm} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Odometer</span>
                    <span className="text-xs font-mono">{selectedTruck.currentOdometer.toLocaleString()} km</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Last Trip</span>
                    <span className="text-xs">{selectedTruck.lastTripKm} km</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Base City</span>
                    <span className="text-xs">{selectedTruck.baseCity}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.success("Dispatched", `${selectedTruck.regNumber} dispatched to port`)
                      setDrawerOpen(false)
                    }}
                  >
                    <Route className="h-3 w-3" /> Dispatch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.info("Tracking", `Live location for ${selectedTruck.regNumber}`)
                    }}
                  >
                    <Navigation className="h-3 w-3" /> Track
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.info("Scheduled", `Maintenance scheduled for ${selectedTruck.regNumber}`)
                      setDrawerOpen(false)
                    }}
                  >
                    <Wrench className="h-3 w-3" /> Schedule Maintenance
                  </Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "appointment" && selectedAppt && (
            <>
              {/* Gradient header indigo→violet */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-5 w-5" />
                  <h3 className="text-lg font-bold">{selectedAppt.appointmentId}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppointmentStatusBadge status={selectedAppt.status} />
                  <TimeSlotBadge slot={selectedAppt.timeSlot} />
                  <Badge variant="outline" className="badge-interactive text-[10px] text-white border-white/40">
                    {selectedAppt.appointmentType}
                  </Badge>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <PortBadge port={selectedAppt.port} />
                  <span className="text-[10px] text-muted-foreground">
                    Scheduled: {selectedAppt.scheduledDate}
                  </span>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <ContainerCountTile count={selectedAppt.containerCount} />
                  <GatePassBadge passNo={selectedAppt.gatePassNo} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Truck</span>
                    <span className="text-xs font-mono">{selectedAppt.truckReg}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Wait Time</span>
                    <WaitTimeIndicator minutes={selectedAppt.waitMinutes} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Containers</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedAppt.containerNos.map((cn) => (
                      <span key={cn} className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {cn}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Notes</span>
                  <span className="text-xs">{selectedAppt.notes}</span>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.info("Rescheduling", `${selectedAppt.appointmentId} rescheduled`)
                      setDrawerOpen(false)
                    }}
                  >
                    <CalendarDays className="h-3 w-3" /> Reschedule
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.success("Checked In", `${selectedAppt.appointmentId} checked in at gate`)
                      setDrawerOpen(false)
                    }}
                  >
                    <CheckCircle2 className="h-3 w-3" /> Check-In
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.error("Cancelled", `${selectedAppt.appointmentId} has been cancelled`)
                      setDrawerOpen(false)
                    }}
                  >
                    <XCircle className="h-3 w-3" /> Cancel
                  </Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "container" && selectedContainer && (
            <>
              {/* Gradient header slate→gray-800 */}
              <div className="bg-gradient-to-r from-slate-700 to-gray-800 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Container className="h-5 w-5" />
                  <h3 className="text-lg font-bold">{selectedContainer.containerNo}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <DrayageStatusBadge status={selectedContainer.status} />
                  <ContainerTypeBadge type={selectedContainer.containerType} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">TEU</span>
                    <span className="text-lg font-bold">{selectedContainer.teu}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Weight</span>
                    <span className="text-lg font-bold">{selectedContainer.weight.toFixed(1)} tons</span>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <PortBadge port={selectedContainer.port} />
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {selectedContainer.destination}
                  </div>
                </div>
                <GPSLocationTile lat={selectedContainer.lat} lng={selectedContainer.lng} active={selectedContainer.gpsActive} />
                <div className="flex flex-wrap items-center gap-3">
                  <ETAIndicator minutes={selectedContainer.etaMinutes} />
                  <DaysInTransitCounter days={selectedContainer.daysInTransit} />
                  <TemperatureIndicator temp={selectedContainer.temperature} isReefer={selectedContainer.isReefer} />
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.success("Tracking", `Live tracking enabled for ${selectedContainer.containerNo}`)
                    }}
                  >
                    <Navigation className="h-3 w-3" /> Track
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.info("Rerouting", `${selectedContainer.containerNo} is being rerouted`)
                      setDrawerOpen(false)
                    }}
                  >
                    <Route className="h-3 w-3" /> Reroute
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      toast.error("Damage Reported", `Damage report filed for ${selectedContainer.containerNo}`)
                      setDrawerOpen(false)
                    }}
                  >
                    <ShieldAlert className="h-3 w-3" /> Report Damage
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
