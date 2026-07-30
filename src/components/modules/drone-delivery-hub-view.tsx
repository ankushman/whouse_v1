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
  Send, MapPin, Clock, IndianRupee, TrendingUp, Target,
  ArrowUpRight, ArrowDownRight, Search, Eye, Filter,
  Battery, Zap, Wind, ShieldAlert, CheckCircle2, XCircle,
  AlertTriangle, BarChart3, Package, Star, Activity, Gauge,
  Navigation, type LucideIcon,
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
const DRONE_TYPES = ["Quadcopter", "Hexacopter", "Fixed-Wing", "Hybrid", "Heavy-Lift", "Nano"] as const
const DRONE_MODELS = ["DJI Mavic 3", "Parrot ANAFI", "Skydio X10", "Amazon MK30", "Zipline Serpent", "Wingcopter 198"] as const
const DRONE_ZONES = ["Zone A (0-2km)", "Zone B (2-5km)", "Zone C (5-10km)", "Zone D (10-15km)", "Zone E (15-25km)", "Zone F (>25km)"] as const
const DRONE_STATUSES = ["Active", "Idle", "In Flight", "Charging", "Maintenance", "Offline", "Calibrating", "Returning"] as const
const DELIVERY_PRIORITIES = ["Emergency", "Rush", "High", "Medium", "Low"] as const
const DELIVERY_STATUSES = ["Queued", "Dispatched", "In Flight", "Hovering", "Delivered", "Failed", "Rerouted", "Returning"] as const
const FLIGHT_STATUSES = ["Completed", "Aborted", "Rerouted", "Low Battery Return", "Signal Lost", "Collision Avoided"] as const
const NFZ_TYPES = ["Airport Proximity", "Military Area", "Government Building", "Hospital", "School", "Dense Population", "Temporary Event", "Weather Hazard"] as const
const NFZ_STATUSES = ["Active", "Expired", "Suspended", "Updated"] as const
const INDIAN_HUBS = ["Mumbai Hub", "Delhi NCR Hub", "Bangalore Tech Park", "Chennai Port", "Hyderabad HITEC", "Pune Industrial", "Kolkata Salt Lake", "Ahmedabad SG Highway", "Jaipur Mansarovar", "Lucknow Gomti Nagar"] as const
const INDIAN_CUSTOMERS = [
  "Rajesh Kumar", "Priya Sharma", "Arun Patel", "Sneha Reddy", "Vikram Singh",
  "Ananya Iyer", "Karthik Menon", "Deepa Nair", "Sanjay Gupta", "Meera Joshi",
  "Rohit Verma", "Pooja Agarwal", "Amit Bose", "Kavitha Krishnan", "Manish Tiwari",
  "Divya Saxena", "Suresh Pillai", "Lakshmi Rao", "Nikhil Deshmukh", "Ritu Malhotra",
  "Pradeep Yadav", "Shalini Kulkarni", "Harish Chauhan", "Sunita Devi", "Vishal Kapoor",
  "Anjali Mehta", "Ramesh Bhatt", "Pallavi Hegde", "Dinesh Shukla", "Swati Pandey",
  "Ganesh Iyer", "Komal Thakur", "Tarun Grover", "Bhavna Sinha", "Akhil Nambiar",
  "Madhuri Dixit", "Siddharth Jha", "Prachi Goyal", "Rajan Pillai", "Neha Chopra",
  "Kiran Rao", "Yogesh Patil", "Asha Menon", "Varun Khanna", "Shikha Verma",
  "Gaurav Tandon", "Suman Latha", "Pankaj Dubey", "Rekha Nair", "Mohan Das",
] as const
const INDIAN_LOCATIONS = [
  "Bandra West Mumbai", "Connaught Place Delhi", "Koramangala Bangalore", "T Nagar Chennai",
  "Madhapur Hyderabad", "Viman Nagar Pune", "Salt Lake Kolkata", "Navrangpura Ahmedabad",
  "C-Scheme Jaipur", "Gomti Nagar Lucknow", "MG Road Kochi", "RS Puram Coimbatore",
  "Dharampeth Nagpur", "Ring Road Surat", "Vijay Nagar Indore", "MP Nagar Bhopal",
] as const

const PIE_COLORS = ["#0284c7", "#059669", "#ea580c", "#7c3aed", "#e11d48", "#d97706", "#0891b2", "#6366f1"]

// ============================================================================
// Color Maps
// ============================================================================
const DRONE_STATUS_COLORS: Record<string, string> = {
  "Active": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Idle": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "In Flight": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 ddh-pulse-active",
  "Charging": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 ddh-pulse-charge",
  "Maintenance": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Offline": "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  "Calibrating": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ddh-pulse-active",
  "Returning": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 ddh-pulse-active",
}
const PRIORITY_COLORS: Record<string, string> = {
  "Emergency": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ddh-pulse-critical",
  "Rush": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "High": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Medium": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Low": "bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400",
}
const DELIVERY_STATUS_COLORS: Record<string, string> = {
  "Queued": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "Dispatched": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ddh-pulse-active",
  "In Flight": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 ddh-pulse-active",
  "Hovering": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 ddh-pulse-active",
  "Delivered": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Failed": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ddh-pulse-error",
  "Rerouted": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Returning": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
}
const FLIGHT_STATUS_COLORS: Record<string, string> = {
  "Completed": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Aborted": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ddh-pulse-error",
  "Rerouted": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Low Battery Return": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Signal Lost": "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  "Collision Avoided": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 ddh-pulse-warning",
}
const NFZ_TYPE_COLORS: Record<string, string> = {
  "Airport Proximity": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Military Area": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Government Building": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Hospital": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "School": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Dense Population": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Temporary Event": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Weather Hazard": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
}
const NFZ_STATUS_COLORS: Record<string, string> = {
  "Active": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Expired": "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  "Suspended": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Updated": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
}

// ============================================================================
// Data Generation
// ============================================================================
interface DroneRecord { id: string; type: string; model: string; zone: string; status: string; battery: number; lastFlight: number; totalFlights: number; flightHours: number; healthScore: number; }
interface DeliveryRecord { id: string; customer: string; pickupHub: string; dropLocation: string; weight: number; distance: number; priority: string; status: string; droneAssigned: string; eta: number; }
interface FlightRecord { id: string; droneId: string; route: string; distance: number; duration: number; speed: number; altitude: number; wind: number; status: string; energyUsed: number; }
interface NFZRecord { id: string; type: string; location: string; radius: number; altitudeLimit: number; reason: string; status: string; validUntil: string; }

function generateData() {
  const drones: DroneRecord[] = []
  for (let i = 0; i < 75; i++) {
    const s = i * 17 + 3
    drones.push({
      id: `DRN-${String(i + 100).padStart(3, "0")}`, type: pick(DRONE_TYPES, s) as string,
      model: pick(DRONE_MODELS, s + 1) as string, zone: pick(DRONE_ZONES, s + 2) as string,
      status: pick(DRONE_STATUSES, s + 3) as string, battery: ri(5, 100, s + 4),
      lastFlight: ri(5, 120, s + 5), totalFlights: ri(10, 5000, s + 6),
      flightHours: ri(5, 2000, s + 7), healthScore: ri(55, 99, s + 8),
    })
  }

  const deliveries: DeliveryRecord[] = []
  for (let i = 0; i < 70; i++) {
    const s = i * 19 + 7
    deliveries.push({
      id: `DLV-${String(i + 5001).padStart(4, "0")}`, customer: pick(INDIAN_CUSTOMERS, s) as string,
      pickupHub: pick(INDIAN_HUBS, s + 1) as string, dropLocation: pick(INDIAN_LOCATIONS, s + 2) as string,
      weight: ri(50, 5000, s + 3), distance: ri(1, 30, s + 4), priority: pick(DELIVERY_PRIORITIES, s + 5) as string,
      status: pick(DELIVERY_STATUSES, s + 6) as string, droneAssigned: `DRN-${String(ri(100, 174, s + 7)).padStart(3, "0")}`,
      eta: ri(5, 90, s + 8),
    })
  }

  const flights: FlightRecord[] = []
  for (let i = 0; i < 60; i++) {
    const s = i * 23 + 11
    flights.push({
      id: `FLT-${String(i + 3001).padStart(4, "0")}`, droneId: `DRN-${String(ri(100, 174, s)).padStart(3, "0")}`,
      route: `${pick(INDIAN_HUBS, s + 1).toString().split(" ")[0]} → ${pick(INDIAN_LOCATIONS, s + 2).toString().split(" ")[0]}`,
      distance: ri(1, 30, s + 3), duration: ri(5, 120, s + 4), speed: ri(15, 80, s + 5),
      altitude: ri(30, 150, s + 6), wind: ri(0, 45, s + 7),
      status: pick(FLIGHT_STATUSES, s + 8) as string, energyUsed: ri(10, 85, s + 9),
    })
  }

  const nfzs: NFZRecord[] = []
  const nfzLocations = ["IGI Airport Delhi (5km)", "Mumbai Chhatrapati Airport (5km)", "Bangalore HAL Airport (4km)", "Chennai Airport (5km)", "Hyderabad Airport (4km)", "Rashtrapati Bhavan Delhi (2km)", "Indian Parliament (2km)", "Military Station Bangalore (3km)", "INS Vikramaditya Kochi (5km)", "ISRO HQ Ahmedabad (3km)", "DRDO Hyderabad (4km)", "Taj Mahal Agra (3km)", "PMO New Delhi (2km)", "South Block Delhi (2km)", "Defence Colony Mumbai (2km)"]
  const nfzReasons = ["Restricted airspace per DGCA", "Security zone per GOI", "VIP movement area", "Controlled airspace", "Temporary restriction for event", "Weather advisory", "Low altitude restriction", "Population density safety"]
  for (let i = 0; i < 55; i++) {
    const s = i * 29 + 13
    nfzs.push({
      id: `NFZ-${String(i + 4001).padStart(4, "0")}`, type: pick(NFZ_TYPES, s) as string,
      location: nfzLocations[i % nfzLocations.length],
      radius: ri(1, 10, s + 1), altitudeLimit: ri(30, 200, s + 2),
      reason: nfzReasons[i % nfzReasons.length], status: pick(NFZ_STATUSES, s + 3) as string,
      validUntil: `${ri(1, 28, s + 4)}/${ri(1, 12, s + 5)}/2027`,
    })
  }

  // Chart data
  const hourlyDeliveries = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    "Completed": ri(5, 25, i * 3), "In-Flight": ri(2, 12, i * 3 + 1), "Charging": ri(1, 8, i * 3 + 2),
  }))
  const typeDist = DRONE_TYPES.map((t, i) => ({ name: t, value: ri(5, 25, i * 7) }))
  const zoneCoverage = DRONE_ZONES.map((z, i) => ({ name: z.split(" ")[0] + " " + z.split(" ")[1], value: ri(30, 100, i * 11) }))
  const dailyTrend = Array.from({ length: 14 }, (_, i) => ({ day: `Day ${i + 1}`, deliveries: ri(50, 200, i * 5) }))
  const zoneThroughput = DRONE_ZONES.map((z, i) => ({ name: z.split(" ")[0] + " " + z.split(" ")[1], count: ri(20, 120, i * 9) }))
  const failureReasons = ["Low Battery", "Signal Lost", "Wind Exceeded", "NFZ Violation", "Payload Too Heavy", "Obstacle Detected", "Motor Failure", "Weather"].map((r, i) => ({ name: r, count: ri(2, 20, i * 13) }))
  const costTrend = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    "Fuel Savings": ri(200000, 800000, i * 3), "Labor Savings": ri(300000, 1000000, i * 3 + 1),
    "Maintenance": ri(100000, 400000, i * 3 + 2), "Revenue": ri(500000, 2000000, i * 3 + 3),
  }))

  return { drones, deliveries, flights, nfzs, hourlyDeliveries, typeDist, zoneCoverage, dailyTrend, zoneThroughput, failureReasons, costTrend }
}

// ============================================================================
// Visual Components
// ============================================================================
function DroneTypeBadge({ type }: { type: string }) {
  const icons: Record<string, string> = { "Quadcopter": "🚁", "Hexacopter": "🎯", "Fixed-Wing": "✈️", "Hybrid": "🔄", "Heavy-Lift": "🏗️", "Nano": "🤏" }
  return <Badge className="text-[10px] px-1.5 py-0 font-medium bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">{icons[type] ?? ""} {type}</Badge>
}
function DroneStatusBadge({ status }: { status: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", DRONE_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge> }
function BatteryBar({ pct }: { pct: number }) {
  const color = pct > 60 ? "bg-emerald-500" : pct > 20 ? "bg-amber-500" : "bg-red-500"
  return <div className="flex items-center gap-2 w-20"><div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.min(pct, 100)}%` }} /></div><span className="text-[10px] font-mono">{pct}%</span></div>
}
function HealthBar({ pct }: { pct: number }) {
  const color = pct > 80 ? "bg-emerald-500" : pct > 60 ? "bg-amber-500" : "bg-red-500"
  return <div className="flex items-center gap-2 w-20"><div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(pct, 100)}%` }} /></div><span className="text-[10px] font-mono">{pct}</span></div>
}
function PriorityBadge({ priority }: { priority: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", PRIORITY_COLORS[priority] ?? "bg-gray-100 text-gray-700")}>{priority}</Badge> }
function DeliveryStatusBadge({ status }: { status: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", DELIVERY_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge> }
function FlightStatusBadge({ status }: { status: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", FLIGHT_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge> }
function EnergyBar({ pct }: { pct: number }) {
  const color = pct < 30 ? "bg-emerald-500" : pct < 60 ? "bg-amber-500" : "bg-red-500"
  return <div className="flex items-center gap-2 w-20"><div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(pct, 100)}%` }} /></div><span className="text-[10px] font-mono">{pct}%</span></div>
}
function SpeedTile({ speed }: { speed: number }) {
  const color = speed > 60 ? "text-emerald-600 dark:text-emerald-400" : speed > 30 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  return <span className={cn("text-xs font-mono font-medium", color)}>{speed} km/h</span>
}
function NFZTypeBadge({ type }: { type: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", NFZ_TYPE_COLORS[type] ?? "bg-gray-100 text-gray-700")}>{type}</Badge> }
function NFZStatusBadge({ status }: { status: string }) { return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", NFZ_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge> }
function AltitudeTile({ alt }: { alt: number }) {
  const color = alt > 120 ? "text-red-600 dark:text-red-400" : alt > 80 ? "text-amber-600 dark:text-amber-400" : "text-sky-600 dark:text-sky-400"
  return <span className={cn("text-xs font-mono font-medium", color)}>{alt}m</span>
}
function ZoneBadge({ zone }: { zone: string }) { const short = zone.split(" ")[0] + " " + zone.split(" ")[1]; return <Badge className="text-[10px] px-1.5 py-0 font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{short}</Badge> }
function DistanceTile({ km }: { km: number }) { return <span className="text-xs font-mono font-medium text-sky-600 dark:text-sky-400">{km} km</span> }
function WeightTile({ g }: { g: number }) {
  const color = g > 3000 ? "text-red-600 dark:text-red-400" : g > 1000 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
  return <span className={cn("text-xs font-mono font-medium", color)}>{g}g</span>
}
function ETATile({ min }: { min: number }) {
  const color = min > 60 ? "text-red-600 dark:text-red-400" : min > 30 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
  return <span className={cn("text-xs font-mono font-medium", color)}>{min}m</span>
}

function SortHeader({ label, field, sortField, sortDir, onSort }: { label: string; field: string; sortField: string; sortDir: "asc" | "desc"; onSort: (f: string) => void }) {
  return (
    <TableHead className="cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => onSort(field)}>
      <div className={cn("flex items-center gap-1 text-xs font-semibold uppercase tracking-wider", sortField === field ? "text-foreground" : "text-gray-500 dark:text-gray-400")}>
        {label}
        {sortField === field && <span className="text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </div>
    </TableHead>
  )
}

// ============================================================================
// Main
// ============================================================================
export default function DroneDeliveryHubView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null)

  const kpis = useMemo(() => [
    { label: "Active Drones", value: data.drones.filter(d => d.status === "Active" || d.status === "In Flight").length.toString(), change: "+3", up: true, icon: Send, color: "text-sky-600 dark:text-sky-400" },
    { label: "Deliveries Today", value: "347", change: "+22%", up: true, icon: Package, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Avg Flight Time", value: "18min", change: "-2min", up: false, icon: Clock, color: "text-blue-600 dark:text-blue-400" },
    { label: "Coverage Radius", value: "25km", change: "+5km", up: true, icon: MapPin, color: "text-violet-600 dark:text-violet-400" },
    { label: "Success Rate", value: "96.8%", change: "+0.5%", up: true, icon: Target, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Battery Health", value: "82%", change: "-1%", up: false, icon: Battery, color: "text-amber-600 dark:text-amber-400" },
    { label: "Fleet Utilization", value: "74%", change: "+8%", up: true, icon: Gauge, color: "text-cyan-600 dark:text-cyan-400" },
    { label: "Cost Savings", value: formatINR(12400000), change: "+15%", up: true, icon: IndianRupee, color: "text-emerald-600 dark:text-emerald-400" },
  ], [data])

  const handleSort = (field: string) => { if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(field); setSortDir("desc") } }

  const sortFn = <T,>(items: T[], field: string): T[] => {
    if (!field) return items
    return [...items].sort((a, b) => { const aV = (a as unknown as Record<string, string | number>)[field] ?? ""; const bV = (b as unknown as Record<string, string | number>)[field] ?? ""; return sortDir === "asc" ? (aV < bV ? -1 : aV > bV ? 1 : 0) : (aV < bV ? 1 : aV > bV ? -1 : 0) })
  }

  const filteredDrones = useMemo(() => { let f = data.drones; if (searchQ) f = f.filter(d => d.id.toLowerCase().includes(searchQ.toLowerCase()) || d.model.toLowerCase().includes(searchQ.toLowerCase())); if (statusFilter !== "all") f = f.filter(d => d.status === statusFilter); return sortFn(f, sortField) }, [data.drones, searchQ, statusFilter, sortField, sortDir])
  const filteredDeliveries = useMemo(() => { let f = data.deliveries; if (searchQ) f = f.filter(d => d.customer.toLowerCase().includes(searchQ.toLowerCase()) || d.id.toLowerCase().includes(searchQ.toLowerCase())); if (statusFilter !== "all") f = f.filter(d => d.status === statusFilter); return sortFn(f, sortField) }, [data.deliveries, searchQ, statusFilter, sortField, sortDir])
  const filteredFlights = useMemo(() => { let f = data.flights; if (searchQ) f = f.filter(f2 => f2.id.toLowerCase().includes(searchQ.toLowerCase()) || f2.route.toLowerCase().includes(searchQ.toLowerCase())); if (statusFilter !== "all") f = f.filter(f2 => f2.status === statusFilter); return sortFn(f, sortField) }, [data.flights, searchQ, statusFilter, sortField, sortDir])
  const filteredNFZs = useMemo(() => { let f = data.nfzs; if (searchQ) f = f.filter(n => n.location.toLowerCase().includes(searchQ.toLowerCase()) || n.type.toLowerCase().includes(searchQ.toLowerCase())); if (statusFilter !== "all") f = f.filter(n => n.status === statusFilter); return sortFn(f, sortField) }, [data.nfzs, searchQ, statusFilter, sortField, sortDir])

  const openDetail = (d: DeliveryRecord) => { setSelectedDelivery(d); setSheetOpen(true); toast.info("Delivery Detail", `Viewing ${d.id}`) }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <PageHeader title="Drone Delivery Hub" description="Fleet management, delivery operations, flight analytics and no-fly zone compliance for drone-based logistics" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 h-auto flex-wrap gap-1">
          {["Drone Dashboard", "Fleet Management", "Delivery Queue", "Flight Analytics", "No-Fly Zones", "Delivery Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-xs px-3 py-1.5">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpis.map((k, i) => { const Icon = k.icon; return (
              <Card key={i} className="hover-lift-sm ddh-kpi-card border-l-4 border-l-sky-500 hover:shadow-lg transition-shadow">
                <CardContent className="inner-glow p-3">
                  <div className="flex items-center justify-between">
                    <div><p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{k.label}</p><p className="text-lg font-bold mt-0.5">{k.value}</p>
                      <div className={cn("flex items-center text-[10px] mt-1 gap-0.5", k.up ? "text-emerald-600" : "text-red-600")}>{k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{k.change}</div>
                    </div>
                    <Icon className={cn("w-5 h-5 opacity-50", k.color)} />
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover-lift-sm ddh-chart-card col-span-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Hourly Deliveries</CardTitle></CardHeader><CardContent><AreaChart data={data.hourlyDeliveries} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" tick={{ fontSize: 8 }} interval={2} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Completed" stackId="a" fill="#059669" /><Area type="monotone" dataKey="In-Flight" stackId="a" fill="#0284c7" /><Area type="monotone" dataKey="Charging" stackId="a" fill="#d97706" /></AreaChart></CardContent></Card>
            <Card className="hover-lift-sm ddh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Drone Types</CardTitle></CardHeader><CardContent><PieChart width={240} height={240}><Pie data={data.typeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name.split("-")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>{data.typeDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
          <Card className="hover-lift-sm ddh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Zone Coverage</CardTitle></CardHeader><CardContent><BarChart data={data.zoneCoverage} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
        </TabsContent>

        {/* Tab 1: Fleet Management */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" /><Input placeholder="Search by ID, model..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 text-xs w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{DRONE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table><TableHeader><TableRow>
              <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Model</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Zone</TableHead>
              <SortHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Battery</TableHead>
              <SortHeader label="Flights" field="totalFlights" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Health</TableHead>
            </TableRow></TableHeader><TableBody>
              {filteredDrones.map(d => (<TableRow key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <TableCell className="text-xs font-mono">{d.id}</TableCell><TableCell><DroneTypeBadge type={d.type} /></TableCell><TableCell className="text-xs">{d.model}</TableCell><TableCell><ZoneBadge zone={d.zone} /></TableCell><TableCell><DroneStatusBadge status={d.status} /></TableCell><TableCell><BatteryBar pct={d.battery} /></TableCell><TableCell className="text-xs font-mono">{d.totalFlights.toLocaleString()}</TableCell><TableCell><HealthBar pct={d.healthScore} /></TableCell>
              </TableRow>))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* Tab 2: Delivery Queue */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" /><Input placeholder="Search by customer, ID..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 text-xs w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{DELIVERY_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table><TableHeader><TableRow>
              <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Route</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Weight</TableHead>
              <SortHeader label="Distance" field="distance" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Priority</TableHead>
              <SortHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Drone</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">ETA</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</TableHead>
            </TableRow></TableHeader><TableBody>
              {filteredDeliveries.map(d => (<TableRow key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <TableCell className="press-scale text-xs font-mono">{d.id}</TableCell><TableCell className="text-xs font-medium">{d.customer}</TableCell><TableCell className="text-[10px]"><span>{d.pickupHub.split(" ")[0]}</span><span className="text-gray-400 mx-0.5">→</span><span>{d.dropLocation.split(" ").slice(0, 2).join(" ")}</span></TableCell><TableCell><WeightTile g={d.weight} /></TableCell><TableCell><DistanceTile km={d.distance} /></TableCell><TableCell><PriorityBadge priority={d.priority} /></TableCell><TableCell><DeliveryStatusBadge status={d.status} /></TableCell><TableCell className="text-xs font-mono">{d.droneAssigned}</TableCell><TableCell><ETATile min={d.eta} /></TableCell><TableCell><Button variant="ghost" size="sm" className="h-7 text-[10px] ddh-action-btn" onClick={() => openDetail(d)}><Eye className="w-3 h-3 mr-1" />View</Button></TableCell>
              </TableRow>))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* Tab 3: Flight Analytics */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" /><Input placeholder="Search by ID, route..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 text-xs w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{FLIGHT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table><TableHeader><TableRow>
              <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Drone</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Route</TableHead>
              <SortHeader label="Dist" field="distance" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortHeader label="Speed" field="speed" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortHeader label="Alt" field="altitude" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Wind</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Energy</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</TableHead>
            </TableRow></TableHeader><TableBody>
              {filteredFlights.map(f => (<TableRow key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <TableCell className="text-xs font-mono">{f.id}</TableCell><TableCell className="text-xs font-mono">{f.droneId}</TableCell><TableCell className="text-[10px]">{f.route}</TableCell><TableCell><DistanceTile km={f.distance} /></TableCell><TableCell><SpeedTile speed={f.speed} /></TableCell><TableCell><AltitudeTile alt={f.altitude} /></TableCell><TableCell className="text-xs font-mono">{f.wind} km/h</TableCell><TableCell><EnergyBar pct={f.energyUsed} /></TableCell><TableCell><FlightStatusBadge status={f.status} /></TableCell>
              </TableRow>))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* Tab 4: No-Fly Zones */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" /><Input placeholder="Search by location, type..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 text-xs w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{NFZ_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table><TableHeader><TableRow>
              <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Location</TableHead>
              <SortHeader label="Radius" field="radius" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortHeader label="Alt Limit" field="altitudeLimit" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reason</TableHead>
              <SortHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Valid Until</TableHead>
            </TableRow></TableHeader><TableBody>
              {filteredNFZs.map(n => (<TableRow key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <TableCell className="text-xs font-mono">{n.id}</TableCell><TableCell><NFZTypeBadge type={n.type} /></TableCell><TableCell className="text-xs">{n.location}</TableCell><TableCell className="text-xs font-mono">{n.radius} km</TableCell><TableCell><AltitudeTile alt={n.altitudeLimit} /></TableCell><TableCell className="text-[10px] text-gray-600 dark:text-gray-400 max-w-[150px] truncate">{n.reason}</TableCell><TableCell><NFZStatusBadge status={n.status} /></TableCell><TableCell className="text-xs">{n.validUntil}</TableCell>
              </TableRow>))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* Tab 5: Analytics */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Deliveries (YTD)", value: "18,432", icon: Package, color: "text-sky-600 dark:text-sky-400" },
              { label: "Avg Success Rate", value: "96.8%", icon: Target, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Fleet Downtime", value: "2.1%", icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400" },
              { label: "Revenue", value: formatINR(56000000), icon: IndianRupee, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Avg Delivery Time", value: "22min", icon: Clock, color: "text-blue-600 dark:text-blue-400" },
              { label: "Fleet Size", value: "75", icon: Activity, color: "text-violet-600 dark:text-violet-400" },
              { label: "NFZ Compliance", value: "99.4%", icon: ShieldAlert, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Customer Rating", value: "4.7★", icon: Star, color: "text-amber-600 dark:text-amber-400" },
            ].map((k, i) => { const Icon = k.icon; return (
              <Card key={i} className="inner-glow hover-lift-sm ddh-kpi-card border-l-4 border-l-emerald-500"><CardContent className="p-3"><div className="flex items-center justify-between"><div><p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{k.label}</p><p className="text-base font-bold mt-0.5">{k.value}</p></div><Icon className={cn("w-5 h-5 opacity-50", k.color)} /></div></CardContent></Card>
            )})}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover-lift-sm ddh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Daily Delivery Trend</CardTitle></CardHeader><CardContent><LineChart data={data.dailyTrend} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="deliveries" stroke="#0284c7" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="hover-lift-sm ddh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Zone Throughput</CardTitle></CardHeader><CardContent><BarChart data={data.zoneThroughput} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover-lift-sm ddh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Failure Reasons</CardTitle></CardHeader><CardContent><BarChart data={data.failureReasons} layout="vertical" height={260}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={110} /><Tooltip /><Bar dataKey="count" fill="#e11d48" radius={[0, 4, 4, 0]} /></BarChart></CardContent></Card>
            <Card className="hover-lift-sm ddh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost vs Revenue (6-Month)</CardTitle></CardHeader><CardContent><AreaChart data={data.costTrend} height={260}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Area type="monotone" dataKey="Fuel Savings" stackId="a" fill="#059669" /><Area type="monotone" dataKey="Labor Savings" stackId="a" fill="#0284c7" /><Area type="monotone" dataKey="Maintenance" stackId="a" fill="#ea580c" /><Area type="monotone" dataKey="Revenue" stackId="a" fill="#7c3aed" /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Sheet */}
      <Sheet open={!!(sheetOpen && selectedDelivery)} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[420px] sm:w-[540px] overflow-y-auto">
          {selectedDelivery && (<>
            <SheetHeader><div className="h-2 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full -mx-6 -mt-6 mb-4" /><SheetTitle className="flex items-center gap-2"><Send className="w-4 h-4 text-sky-600" />{selectedDelivery.id}</SheetTitle></SheetHeader>
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-2"><DeliveryStatusBadge status={selectedDelivery.status} /><PriorityBadge priority={selectedDelivery.priority} /></div>
              <Separator />
              <div className="space-y-2">
                <div className="text-xs"><span className="text-gray-500">Customer: </span><span className="font-semibold">{selectedDelivery.customer}</span></div>
                <div className="text-xs"><span className="text-gray-500">Route: </span><span>{selectedDelivery.pickupHub} → {selectedDelivery.dropLocation}</span></div>
                <div className="text-xs"><span className="text-gray-500">Weight: </span><WeightTile g={selectedDelivery.weight} /></div>
                <div className="text-xs"><span className="text-gray-500">Distance: </span><DistanceTile km={selectedDelivery.distance} /></div>
                <div className="text-xs"><span className="text-gray-500">Drone: </span><span className="font-mono">{selectedDelivery.droneAssigned}</span></div>
                <div className="text-xs"><span className="text-gray-500">ETA: </span><ETATile min={selectedDelivery.eta} /></div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button size="sm" className="press-scale text-xs flex-1 bg-sky-600 hover:bg-sky-700" onClick={() => toast.success("Dispatched", `Delivery ${selectedDelivery.id} dispatched`)}>Dispatch</Button>
                <Button size="sm" className="press-scale text-xs flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.info("Rerouted", `Delivery ${selectedDelivery.id} rerouted`)}>Reroute</Button>
              </div>
            </div>
          </>)}
        </SheetContent>
      </Sheet>
    </div>
  )
}
