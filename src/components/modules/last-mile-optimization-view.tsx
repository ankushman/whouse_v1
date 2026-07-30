"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap, AlertTriangle, Users, BrainCircuit, BarChart3, MapPin, Bike, Package, Truck, Navigation, Route, Timer, Star, Phone, UserCheck } from "lucide-react"

// ============================================================================
// Helpers
// ============================================================================
function seededRandom(seed: number) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
const pick = <T,>(arr: readonly T[], seed: number) => arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const formatINR = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : `₹${n.toLocaleString("en-IN")}`

// ============================================================================
// Enums
// ============================================================================
const ZONE_TYPES = ["Metro Core 🏙️", "Urban 🏘️", "Suburban 🏡", "Semi-Urban 🌾", "Rural 🌿", "Industrial 🏭", "Commercial 🏢", "Special Economic Zone 🏗️"] as const
const ROUTE_STATUSES = ["Optimized", "In Progress", "Pending", "Deviated", "Failed", "Completed"] as const
const VEHICLE_TYPES = ["Motorcycle 🏍️", "Scooter 🛵", "Electric Van 🚐", "Delivery Van 🚚", "E-Rickshaw 🔋", "Bicycle 🚲", "Auto Rickshaw 🛺", "Pickup Truck 🛻"] as const
const FLEET_STATUSES = ["On Route", "Available", "Maintenance", "Charging", "Off Duty", "Break"] as const
const DELIVERY_TYPES = ["Standard", "Express", "Same-Day", "Next-Day", "Scheduled", "COD", "Prepaid", "Reverse Pickup"] as const
const PERF_STATUSES = ["On-Time", "Early", "Delayed", "Failed", "Rescheduled", "Cancelled"] as const
const HUB_TYPES = ["Mega Hub 🏢", "Micro Hub 📦", "Dark Store 🏪", "Pickup Point 📮", "Locker Bank 🔒", "D-Mart Kiosk 🛒", "Partner Store 🤝", "Virtual Hub ☁️"] as const
const HUB_STATUSES = ["Active", "Expanding", "New", "Maintenance", "Relocating", "Closing"] as const
const DELIVERY_MODES = ["Standard", "Express", "Same-Day", "Next-Day", "COD", "Scheduled"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi"] as const
const PIN_CODES = ["400001", "110001", "560001", "600001", "500001", "411001", "700001", "380001", "302001", "226001", "160001", "682001"] as const
const NAMES = ["Arjun Mehta", "Priya Sharma", "Rahul Verma", "Sneha Patel", "Vikram Singh", "Ananya Reddy", "Karthik Rajan", "Deepika Nair", "Rohit Gupta", "Meera Iyer", "Amit Joshi", "Pooja Das", "Suresh Kumar", "Kavita Rao", "Manish Tiwari", "Divya Menon", "Sanjay Verma", "Neha Saxena", "Rajesh Pillai", "Swati Kulkarni", "Prateek Dubey", "Anjali Mishra", "Vivek Nair", "Shalini Gupta", "Harish Chauhan", "Ritu Bhat", "Arun Kapoor", "Suman Devi", "Gaurav Hegde", "Pallavi Desai", "Nikhil Sharma", "Rashmi Pandey", "Ashok Yadav", "Bhavna Soni", "Dinesh Rao", "Lakshmi Iyer", "Prakash Jha", "Sunita Kumari", "Vinay Kulkarni", "Madhuri Deshmukh"] as const
const DELAY_REASONS = ["Traffic congestion", "Address not found", "Customer unavailable", "Vehicle breakdown", "Weather conditions", "Route deviation", "Wrong pincode", "Gate locked", "Payment issue", "Hub delay"] as const
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const

// ============================================================================
// Color Maps
// ============================================================================
const ZONE_COLORS: Record<string, string> = { "Metro Core": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", "Urban": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", "Suburban": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", "Semi-Urban": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "Rural": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", "Industrial": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300", "Commercial": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", "Special Economic Zone": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" }
const RSTATUS_COLORS: Record<string, string> = { "Optimized": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 lmo-pulse-active", "Pending": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "Deviated": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", "Failed": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", "Completed": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300" }
const VTYPE_COLORS: Record<string, string> = { "Motorcycle": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", "Scooter": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", "Electric Van": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", "Delivery Van": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", "E-Rickshaw": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "Bicycle": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", "Auto Rickshaw": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", "Pickup Truck": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300" }
const FSTATUS_COLORS: Record<string, string> = { "On Route": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 lmo-pulse-active", "Available": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", "Maintenance": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "Charging": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", "Off Duty": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300", "Break": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" }
const DTYPE_COLORS: Record<string, string> = { "Standard": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300", "Express": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", "Same-Day": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", "Next-Day": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", "Scheduled": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", "COD": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "Prepaid": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", "Reverse Pickup": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" }
const PSTATUS_COLORS: Record<string, string> = { "On-Time": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 lmo-pulse-active", "Early": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", "Delayed": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "Failed": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", "Rescheduled": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", "Cancelled": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300" }
const HTYPE_COLORS: Record<string, string> = { "Mega Hub": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", "Micro Hub": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", "Dark Store": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", "Pickup Point": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "Locker Bank": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", "D-Mart Kiosk": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", "Partner Store": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", "Virtual Hub": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" }
const HSTATUS_COLORS: Record<string, string> = { "Active": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 lmo-pulse-active", "Expanding": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", "New": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", "Maintenance": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "Relocating": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", "Closing": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" }
const CHART_COLORS = ["#059669", "#3b82f6", "#f97316", "#7c3aed", "#e11d48", "#0891b2", "#d97706", "#14b8a6"]

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const hourly = Array.from({ length: 12 }, (_, i) => ({ hour: `${String(i * 2 + 6).padStart(2, "0")}:00`, Standard: ri(30, 90, i * 3 + 1), Express: ri(15, 45, i * 3 + 2), "Same-Day": ri(5, 25, i * 3 + 3) }))
  const modePie = DELIVERY_MODES.map((m, i) => ({ name: m, value: ri(80, 350, i * 7 + 100) }))
  const cityBar = CITIES.map((c, i) => ({ city: c.slice(0, 6), Deliveries: ri(120, 340, i * 11 + 200) }))
  const routes = Array.from({ length: 75 }, (_, i) => { const s = i * 17 + 300; const zt = pick(ZONE_TYPES, s); return { id: `RT-${String(10000 + i).slice(1)}`, origin: pick(CITIES.slice(0, 8), s + 1), zone: zt.split(" ")[0] + " " + zt.split(" ")[1], status: pick(ROUTE_STATUSES, s + 2), distance: +(seededRandom(s + 3) * 45 + 3).toFixed(1), eta: ri(15, 180, s + 4), stops: ri(3, 22, s + 5), fuelCost: ri(40, 550, s + 6), score: ri(45, 100, s + 7), rider: pick(NAMES, s + 8) } })
  const fleet = Array.from({ length: 70 }, (_, i) => { const s = i * 19 + 500; const vt = pick(VEHICLE_TYPES, s); return { id: `FV-${String(1000 + i).slice(1)}`, type: vt.split(" ")[0] + " " + vt.split(" ")[1], status: pick(FLEET_STATUSES, s + 1), speed: ri(10, 80, s + 2), battery: ri(5, 100, s + 3), nextDelivery: `${ri(1, 60, s + 4)} min`, packages: ri(1, 30, s + 5), rating: +(seededRandom(s + 6) * 2 + 3).toFixed(1), rider: pick(NAMES, s + 7) } })
  const perf = Array.from({ length: 55 }, (_, i) => { const s = i * 23 + 800; return { id: `DP-${String(5000 + i).slice(1)}`, type: pick(DELIVERY_TYPES, s), status: pick(PERF_STATUSES, s + 1), rating: ri(1, 5, s + 2), time: ri(15, 120, s + 3), cod: ri(100, 15000, s + 4), pincode: pick(PIN_CODES, s + 5), delayReason: pick(PERF_STATUSES, s + 1) === "Delayed" ? pick(DELAY_REASONS, s + 6) : null, customer: pick(NAMES, s + 7) } })
  const hubs = Array.from({ length: 65 }, (_, i) => { const s = i * 29 + 1200; const ht = pick(HUB_TYPES, s); return { id: `HB-${String(4000 + i).slice(1)}`, type: ht.split(" ")[0] + " " + ht.split(" ")[1], status: pick(HUB_STATUSES, s + 1), capacity: ri(200, 2000, s + 2), utilization: ri(10, 100, s + 3), orders: ri(50, 800, s + 4), city: pick(CITIES, s + 5), manager: pick(NAMES, s + 6), hours: `${String(ri(6, 8, s + 7)).padStart(2, "0")}:00–${String(ri(18, 23, s + 8)).padStart(2, "0")}:00` } })
  const successTrend = MONTHS.map((m, i) => ({ month: m, Metro: ri(85, 98, i * 5 + 2000), "Non-Metro": ri(72, 92, i * 5 + 2001) }))
  const costByCity = CITIES.map((c, i) => ({ city: c.slice(0, 6), Cost: ri(25, 95, i * 7 + 2100) }))
  const modeDist = DELIVERY_MODES.map((m, i) => ({ name: m, value: ri(100, 500, i * 11 + 2200) }))
  const satTrend = MONTHS.map((m, i) => ({ month: m, Rating: +(seededRandom(i * 13 + 2300) * 1.5 + 3.2).toFixed(1) }))
  return { hourly, modePie, cityBar, routes, fleet, perf, hubs, successTrend, costByCity, modeDist, satTrend }
}

// ============================================================================
// 16 Unique Visual Components
// ============================================================================
function ZoneTypeBadge({ zone }: { zone: string }) { const base = zone.split(" ").slice(0, -1).join(" "); const emoji = ZONE_TYPES.find(z => z.startsWith(base))?.split(" ").pop() || ""; return <span className={cn("lmo-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", ZONE_COLORS[base] || "")}>{emoji} {base}</span> }
function RouteStatusBadge({ status }: { status: string }) { return <span className={cn("lmo-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", RSTATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>{status === "In Progress" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" /></span>}{status}</span> }
function VehicleTypeBadge({ type }: { type: string }) { const emoji = VEHICLE_TYPES.find(v => v.startsWith(type))?.split(" ").pop() || ""; return <span className={cn("lmo-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", VTYPE_COLORS[type] || "")}>{emoji} {type}</span> }
function FleetStatusBadge({ status }: { status: string }) { return <span className={cn("lmo-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", FSTATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>{status === "On Route" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" /></span>}{status}</span> }
function DeliveryTypeBadge({ type }: { type: string }) { return <span className={cn("lmo-badge inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", DTYPE_COLORS[type] || "")}>{type}</span> }
function DeliveryStatusBadge({ status }: { status: string }) { return <span className={cn("lmo-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", PSTATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>{status === "On-Time" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>}{status}</span> }
function StarRating({ rating }: { rating: number }) { return <div className="inline-flex items-center gap-0.5">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={cn("h-3 w-3", i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600")} />)}<span className="ml-1 text-xs text-gray-500">{rating}</span></div> }
function BatteryBar({ level }: { level: number }) { const c = level > 60 ? "bg-emerald-500" : level > 20 ? "bg-amber-500" : "bg-rose-500"; return <div className="lmo-battery flex items-center gap-2"><div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className={cn("h-full rounded-full", c)} style={{ width: `${level}%` }} /></div><span className="text-xs font-medium text-gray-600 dark:text-gray-400">{level}%</span></div> }
function DistanceTile({ km }: { km: number }) { const c = km > 30 ? "text-rose-600 dark:text-rose-400" : km > 15 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"; return <span className={cn("lmo-tile inline-flex items-center gap-1 text-xs font-semibold", c)}><MapPin className="h-3 w-3" />{km.toFixed(1)} km</span> }
function ETATile({ min }: { min: number }) { const c = min > 120 ? "text-rose-600 dark:text-rose-400" : min > 60 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"; return <span className={cn("lmo-tile inline-flex items-center gap-1 text-xs font-semibold", c)}><Timer className="h-3 w-3" />{min} min</span> }
function HubTypeBadge({ type }: { type: string }) { const emoji = HUB_TYPES.find(h => h.startsWith(type))?.split(" ").pop() || ""; return <span className={cn("lmo-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", HTYPE_COLORS[type] || "")}>{emoji} {type}</span> }
function HubStatusBadge({ status }: { status: string }) { return <span className={cn("lmo-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", HSTATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>{status === "Active" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>}{status}</span> }
function CapacityBar({ pct }: { pct: number }) { const c = pct < 60 ? "bg-emerald-500" : pct < 80 ? "bg-blue-500" : pct < 95 ? "bg-amber-500" : "bg-rose-500"; return <div className="lmo-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className={cn("h-full rounded-full", c)} style={{ width: `${pct}%` }} /></div><span className="text-xs font-medium">{pct}%</span></div> }
function UtilizationBar({ pct }: { pct: number }) { const c = pct > 90 ? "bg-rose-500" : pct > 70 ? "bg-amber-500" : pct > 40 ? "bg-blue-500" : "bg-emerald-500"; return <div className="lmo-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className={cn("h-full rounded-full", c)} style={{ width: `${pct}%` }} /></div><span className="text-xs font-medium">{pct}%</span></div> }
function PinCodeTile({ pin }: { pin: string }) { return <span className="lmo-pin inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"><MapPin className="h-3 w-3" />{pin}</span> }
function CODAmountTile({ amount }: { amount: number }) { return <span className="lmo-cod inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"><IndianRupee className="h-3 w-3" />{formatINR(amount)}</span> }

// ============================================================================
// Main Component
// ============================================================================
export default function LastMileOptimizationView() {
  const [activeTab, setActiveTab] = useState("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<ReturnType<typeof generateData>["routes"][0] | null>(null)
  const [selectedFleet, setSelectedFleet] = useState<ReturnType<typeof generateData>["fleet"][0] | null>(null)
  const [selectedPerf, setSelectedPerf] = useState<ReturnType<typeof generateData>["perf"][0] | null>(null)
  const [selectedHub, setSelectedHub] = useState<ReturnType<typeof generateData>["hubs"][0] | null>(null)
  const { toast } = useToast()

  const data = useMemo(() => generateData(), [])

  const sortData = <T,>(arr: T[], col: string) => {
    if (!sortCol || sortCol !== col) return arr
    return [...arr].sort((a, b) => {
      const va = (a as unknown as Record<string, string | number>)[col]
      const vb = (b as unknown as Record<string, string | number>)[col]
      if (typeof va === "number" && typeof vb === "number") return sortAsc ? va - vb : vb - va
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }

  const handleSort = (col: string) => { if (sortCol === col) setSortAsc(!sortAsc); else { setSortCol(col); setSortAsc(true) } }
  const SortHeader = ({ col, children }: { col: string; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => handleSort(col)}>
      <div className={cn("flex items-center gap-1 transition-all", sortCol === col ? "font-bold text-violet-700 dark:text-violet-300" : "hover:text-violet-600")}>{children} {sortCol === col && <ArrowUpDown className="h-3 w-3" />}</div>
    </TableHead>
  )

  const kpis = [
    { label: "Total Deliveries Today", value: "2,847", icon: Package, color: "from-emerald-500 to-emerald-600", change: "+14%" },
    { label: "Success Rate", value: "96.3%", icon: TrendingUp, color: "from-blue-500 to-blue-600", change: "+2.1%" },
    { label: "Avg Delivery Time", value: "38 min", icon: Clock, color: "from-orange-500 to-orange-600", change: "-6%" },
    { label: "Failed Attempts", value: "47", icon: AlertTriangle, color: "from-rose-500 to-rose-600", change: "-18%" },
    { label: "Cost per Delivery", value: "₹42", icon: IndianRupee, color: "from-violet-500 to-violet-600", change: "-₹3" },
    { label: "Active Riders", value: "312", icon: Bike, color: "from-cyan-500 to-cyan-600", change: "+24" },
    { label: "SLA Compliance", value: "94.7%", icon: Zap, color: "from-amber-500 to-amber-600", change: "+1.8%" },
    { label: "Customer Satisfaction", value: "4.5/5", icon: Star, color: "from-rose-500 to-rose-600", change: "+0.3" },
  ]

  const filteredRoutes = sortData(data.routes.filter(r => !searchTerm || r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.origin.toLowerCase().includes(searchTerm.toLowerCase())), searchTerm ? "id" : sortCol || "id")
  const filteredFleet = sortData(data.fleet.filter(f => !searchTerm || f.type.toLowerCase().includes(searchTerm.toLowerCase()) || f.rider.toLowerCase().includes(searchTerm.toLowerCase())), sortCol || "id")
  const filteredPerf = sortData(data.perf.filter(p => !searchTerm || p.customer.toLowerCase().includes(searchTerm.toLowerCase()) || p.pincode.includes(searchTerm)), sortCol || "id")
  const filteredHubs = sortData(data.hubs.filter(h => !searchTerm || h.city.toLowerCase().includes(searchTerm.toLowerCase()) || h.type.toLowerCase().includes(searchTerm.toLowerCase())), sortCol || "id")

  return (
    <div className="lmo-container space-y-4">
      <PageHeader title="Last-mile Optimization Hub" description="AI-powered last-mile delivery optimization for Indian logistics & warehousing" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="lmo-tabs-list bg-gray-100 dark:bg-gray-800">
          {["Optimization Dashboard", "Route Optimization", "Delivery Fleet", "Delivery Performance", "Hub & Spoke Network", "Delivery Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="lmo-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Optimization Dashboard */}
        <TabsContent value="0" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className="hover-lift-sm lmo-kpi-card relative overflow-hidden border-l-4" style={{ borderLeftColor: CHART_COLORS[i % CHART_COLORS.length] }}>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80" style={{ background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})` }} />
                <CardContent className="inner-glow glass-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{k.label}</p>
                      <p className="lmo-kpi-value mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{k.value}</p>
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />{k.change}</p>
                    </div>
                    <div className={cn("lmo-kpi-icon flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md", k.color)}><k.icon className="h-5 w-5" /></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="hover-lift-sm lmo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Hourly Delivery Volume</CardTitle></CardHeader><CardContent><AreaChart data={data.hourly}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="Standard" stackId="1" stroke="#059669" fill="#05966960" /><Area type="monotone" dataKey="Express" stackId="1" stroke="#3b82f6" fill="#3b82f660" /><Area type="monotone" dataKey="Same-Day" stackId="1" stroke="#f97316" fill="#f9731660" /></AreaChart></CardContent></Card>
            <Card className="hover-lift-sm lmo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Delivery Mode Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.modePie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{data.modePie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="hover-lift-sm lmo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">City-wise Deliveries</CardTitle></CardHeader><CardContent><BarChart data={data.cityBar}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="Deliveries" fill="#059669" /></BarChart></CardContent></Card>
          </div>
        </TabsContent>

        {/* Tab 1: Route Optimization */}
        <TabsContent value="1" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search routes by ID, origin..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); toast.success("Cleared", "All route filters have been reset") }}>Clear</Button>
          </div>
          <Card className="inner-glow hover-lift-sm card-crud-lift glass-subtle lmo-table-card overflow-hidden"><CardContent className="p-0"><Table><TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
            <SortHeader col="id">Route ID</SortHeader><TableHead>Origin</TableHead><SortHeader col="zone">Zone</SortHeader><SortHeader col="status">Status</SortHeader><SortHeader col="distance">Distance</SortHeader><SortHeader col="eta">ETA</SortHeader><TableHead>Stops</TableHead><TableHead>Fuel Cost</TableHead><SortHeader col="score">Score</SortHeader><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader><TableBody>
            {filteredRoutes.slice(0, 25).map((r, i) => (
              <TableRow key={r.id} className={cn("lmo-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20")} onClick={() => { setSelectedRoute(r); setSheetOpen(true); toast.success("Route Details", `Viewing ${r.id}`) }}>
                <TableCell className="font-mono text-xs font-medium">{r.id}</TableCell>
                <TableCell className="text-xs">{r.origin}</TableCell>
                <TableCell><ZoneTypeBadge zone={r.zone + " 🏙️"} /></TableCell>
                <TableCell><RouteStatusBadge status={r.status} /></TableCell>
                <TableCell><DistanceTile km={r.distance} /></TableCell>
                <TableCell><ETATile min={r.eta} /></TableCell>
                <TableCell className="text-xs">{r.stops}</TableCell>
                <TableCell className="numeric-cell text-xs font-semibold">{formatINR(r.fuelCost)}</TableCell>
                <TableCell><div className="numeric-cell lmo-bar h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className={cn("h-full rounded-full", r.score >= 80 ? "bg-emerald-500" : r.score >= 50 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${r.score}%` }} /></div><span className="ml-1 text-xs">{r.score}</span></TableCell>
                <TableCell className="press-scale text-right"><Button size="sm" variant="ghost" className="lmo-action-btn"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 2: Delivery Fleet */}
        <TabsContent value="2" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search fleet by vehicle type, rider..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); toast.success("Cleared", "All fleet filters have been reset") }}>Clear</Button>
          </div>
          <Card className="inner-glow hover-lift-sm card-crud-lift glass-subtle lmo-table-card overflow-hidden"><CardContent className="p-0"><Table><TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
            <SortHeader col="id">Vehicle ID</SortHeader><TableHead>Type</TableHead><SortHeader col="status">Status</SortHeader><SortHeader col="speed">Speed</SortHeader><TableHead>Battery/Fuel</TableHead><TableHead>Next Delivery</TableHead><TableHead>Packages</TableHead><SortHeader col="rating">Rating</SortHeader><TableHead>Rider</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader><TableBody>
            {filteredFleet.slice(0, 25).map((f, i) => (
              <TableRow key={f.id} className={cn("lmo-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-blue-50/50 dark:hover:bg-blue-950/20")} onClick={() => { setSelectedFleet(f); setSheetOpen(true); toast.success("Fleet Details", `Viewing ${f.id}`) }}>
                <TableCell className="font-mono text-xs font-medium">{f.id}</TableCell>
                <TableCell><VehicleTypeBadge type={f.type} /></TableCell>
                <TableCell><FleetStatusBadge status={f.status} /></TableCell>
                <TableCell><span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{f.speed} km/h</span></TableCell>
                <TableCell><BatteryBar level={f.battery} /></TableCell>
                <TableCell className="text-xs text-gray-500">{f.nextDelivery}</TableCell>
                <TableCell className="text-xs font-semibold">{f.packages}</TableCell>
                <TableCell><StarRating rating={f.rating} /></TableCell>
                <TableCell className="text-xs">{f.rider}</TableCell>
                <TableCell className="press-scale text-right"><Button size="sm" variant="ghost" className="lmo-action-btn"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 3: Delivery Performance */}
        <TabsContent value="3" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search by customer, pincode..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); toast.success("Cleared", "All performance filters have been reset") }}>Clear</Button>
          </div>
          <Card className="inner-glow hover-lift-sm card-crud-lift glass-subtle lmo-table-card overflow-hidden"><CardContent className="p-0"><Table><TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
            <SortHeader col="id">Delivery ID</SortHeader><TableHead>Type</TableHead><SortHeader col="status">Status</SortHeader><SortHeader col="rating">Rating</SortHeader><SortHeader col="time">Time</SortHeader><TableHead>COD</TableHead><TableHead>Pin Code</TableHead><TableHead>Delay Reason</TableHead><TableHead>Customer</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader><TableBody>
            {filteredPerf.slice(0, 25).map((p, i) => (
              <TableRow key={p.id} className={cn("lmo-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-orange-50/50 dark:hover:bg-orange-950/20")} onClick={() => { setSelectedPerf(p); setSheetOpen(true); toast.success("Performance Details", `Viewing ${p.id}`) }}>
                <TableCell className="font-mono text-xs font-medium">{p.id}</TableCell>
                <TableCell><DeliveryTypeBadge type={p.type} /></TableCell>
                <TableCell><DeliveryStatusBadge status={p.status} /></TableCell>
                <TableCell><StarRating rating={p.rating} /></TableCell>
                <TableCell><ETATile min={p.time} /></TableCell>
                <TableCell><CODAmountTile amount={p.cod} /></TableCell>
                <TableCell><PinCodeTile pin={p.pincode} /></TableCell>
                <TableCell className="text-xs text-rose-600 dark:text-rose-400">{p.delayReason || "—"}</TableCell>
                <TableCell className="text-xs">{p.customer}</TableCell>
                <TableCell className="press-scale text-right"><Button size="sm" variant="ghost" className="lmo-action-btn"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 4: Hub & Spoke Network */}
        <TabsContent value="4" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search hubs by city, type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); toast.success("Cleared", "All hub filters have been reset") }}>Clear</Button>
          </div>
          <Card className="inner-glow hover-lift-sm card-crud-lift glass-subtle lmo-table-card overflow-hidden"><CardContent className="p-0"><Table><TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
            <SortHeader col="id">Hub ID</SortHeader><TableHead>Type</TableHead><SortHeader col="status">Status</SortHeader><TableHead>Capacity</TableHead><TableHead>Utilization</TableHead><SortHeader col="orders">Orders</SortHeader><TableHead>City</TableHead><TableHead>Manager</TableHead><TableHead>Hours</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader><TableBody>
            {filteredHubs.slice(0, 25).map((h, i) => (
              <TableRow key={h.id} className={cn("lmo-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-violet-50/50 dark:hover:bg-violet-950/20")} onClick={() => { setSelectedHub(h); setSheetOpen(true); toast.success("Hub Details", `Viewing ${h.id}`) }}>
                <TableCell className="font-mono text-xs font-medium">{h.id}</TableCell>
                <TableCell><HubTypeBadge type={h.type} /></TableCell>
                <TableCell><HubStatusBadge status={h.status} /></TableCell>
                <TableCell><CapacityBar pct={Math.round(h.orders / h.capacity * 100)} /></TableCell>
                <TableCell><UtilizationBar pct={h.utilization} /></TableCell>
                <TableCell className="text-xs font-semibold">{h.orders}</TableCell>
                <TableCell className="text-xs">{h.city}</TableCell>
                <TableCell className="text-xs">{h.manager}</TableCell>
                <TableCell className="text-xs font-mono text-gray-500">{h.hours}</TableCell>
                <TableCell className="press-scale text-right"><Button size="sm" variant="ghost" className="lmo-action-btn"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 5: Delivery Analytics */}
        <TabsContent value="5" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover-lift-sm lmo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Delivery Success Trend (Metro vs Non-Metro)</CardTitle></CardHeader><CardContent><LineChart data={data.successTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="Metro" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="Non-Metro" stroke="#3b82f6" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="hover-lift-sm lmo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Cost per Delivery by City</CardTitle></CardHeader><CardContent><BarChart data={data.costByCity}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="Cost" fill="#f97316" /></BarChart></CardContent></Card>
            <Card className="hover-lift-sm lmo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Mode Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.modeDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{data.modeDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="hover-lift-sm lmo-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Customer Satisfaction Trend</CardTitle></CardHeader><CardContent><AreaChart data={data.satTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[3, 5]} tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="Rating" stroke="#7c3aed" fill="#7c3aed60" /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sheet: Route Details */}
      <Sheet open={!!(sheetOpen && selectedRoute)} onOpenChange={open => { if (!open) { setSheetOpen(false); setSelectedRoute(null) } }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedRoute && (<><SheetHeader className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl"><SheetTitle className="text-white flex items-center gap-2"><Navigation className="h-5 w-5" />Route {selectedRoute.id}</SheetTitle></SheetHeader>
          <div className="space-y-4 px-2">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-500">Status</p><RouteStatusBadge status={selectedRoute.status} /></div>
              <div><p className="text-xs text-gray-500">Zone</p><ZoneTypeBadge zone={selectedRoute.zone + " 🏙️"} /></div>
              <div><p className="text-xs text-gray-500">Origin</p><p className="text-sm font-semibold">{selectedRoute.origin}</p></div>
              <div><p className="text-xs text-gray-500">Stops</p><p className="text-sm font-semibold">{selectedRoute.stops}</p></div>
              <div><p className="text-xs text-gray-500">Distance</p><DistanceTile km={selectedRoute.distance} /></div>
              <div><p className="text-xs text-gray-500">ETA</p><ETATile min={selectedRoute.eta} /></div>
              <div><p className="text-xs text-gray-500">Fuel Cost</p><span className="text-sm font-bold">{formatINR(selectedRoute.fuelCost)}</span></div>
              <div><p className="text-xs text-gray-500">Optimization Score</p><div className="flex items-center gap-2"><div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className={cn("h-full rounded-full", selectedRoute.score >= 80 ? "bg-emerald-500" : selectedRoute.score >= 50 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${selectedRoute.score}%` }} /></div><span className="text-xs font-bold">{selectedRoute.score}</span></div></div>
            </div>
            <Separator /><div className="grid grid-cols-2 gap-3"><div><p className="text-xs text-gray-500">Rider</p><p className="text-sm font-medium">{selectedRoute.rider}</p></div><div><p className="text-xs text-gray-500">Contact</p><p className="text-sm flex items-center gap-1"><Phone className="h-3 w-3" />+91 {ri(7000, 9999, 999)}{ri(100000, 999999, 998)}</p></div></div>
            <div className="press-scale btn-outline-animate flex gap-2 pt-2"><Button className="lmo-action-btn flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success("Optimized", `Route ${selectedRoute.id} re-optimized`)}>Re-Optimize</Button><Button variant="outline" className="lmo-action-btn" onClick={() => toast.success("Reassigned", `Route ${selectedRoute.id} reassigned`)}>Reassign</Button></div>
          </div></>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Fleet Details */}
      <Sheet open={!!(sheetOpen && selectedFleet)} onOpenChange={open => { if (!open) { setSheetOpen(false); setSelectedFleet(null) } }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedFleet && (<><SheetHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl"><SheetTitle className="text-white flex items-center gap-2"><Truck className="h-5 w-5" />Vehicle {selectedFleet.id}</SheetTitle></SheetHeader>
          <div className="space-y-4 px-2">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-500">Type</p><VehicleTypeBadge type={selectedFleet.type} /></div>
              <div><p className="text-xs text-gray-500">Status</p><FleetStatusBadge status={selectedFleet.status} /></div>
              <div><p className="text-xs text-gray-500">Speed</p><span className="text-sm font-bold text-blue-600">{selectedFleet.speed} km/h</span></div>
              <div><p className="text-xs text-gray-500">Battery/Fuel</p><BatteryBar level={selectedFleet.battery} /></div>
              <div><p className="text-xs text-gray-500">Next Delivery</p><p className="text-sm font-medium">{selectedFleet.nextDelivery}</p></div>
              <div><p className="text-xs text-gray-500">Packages</p><p className="text-sm font-bold">{selectedFleet.packages}</p></div>
              <div><p className="text-xs text-gray-500">Rating</p><StarRating rating={selectedFleet.rating} /></div>
              <div><p className="text-xs text-gray-500">Rider</p><p className="text-sm font-medium">{selectedFleet.rider}</p></div>
            </div>
            <div className="press-scale btn-outline-animate flex gap-2 pt-2"><Button className="lmo-action-btn flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("Dispatched", `Vehicle ${selectedFleet.id} dispatched`)}>Dispatch</Button><Button variant="outline" className="lmo-action-btn" onClick={() => toast.success("Maintenance", `Vehicle ${selectedFleet.id} sent for maintenance`)}>Maintenance</Button></div>
          </div></>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Performance Details */}
      <Sheet open={!!(sheetOpen && selectedPerf)} onOpenChange={open => { if (!open) { setSheetOpen(false); setSelectedPerf(null) } }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedPerf && (<><SheetHeader className="bg-gradient-to-r from-orange-600 to-rose-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl"><SheetTitle className="text-white flex items-center gap-2"><BarChart3 className="h-5 w-5" />Delivery {selectedPerf.id}</SheetTitle></SheetHeader>
          <div className="space-y-4 px-2">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-500">Type</p><DeliveryTypeBadge type={selectedPerf.type} /></div>
              <div><p className="text-xs text-gray-500">Status</p><DeliveryStatusBadge status={selectedPerf.status} /></div>
              <div><p className="text-xs text-gray-500">Rating</p><StarRating rating={selectedPerf.rating} /></div>
              <div><p className="text-xs text-gray-500">Time</p><ETATile min={selectedPerf.time} /></div>
              <div><p className="text-xs text-gray-500">COD Amount</p><CODAmountTile amount={selectedPerf.cod} /></div>
              <div><p className="text-xs text-gray-500">Pin Code</p><PinCodeTile pin={selectedPerf.pincode} /></div>
            </div>
            {selectedPerf.delayReason && <div><p className="text-xs text-gray-500">Delay Reason</p><span className="text-sm text-rose-600 dark:text-rose-400">{selectedPerf.delayReason}</span></div>}
            <Separator /><div><p className="text-xs text-gray-500">Customer</p><p className="text-sm font-semibold">{selectedPerf.customer}</p></div>
            <div className="press-scale btn-outline-animate flex gap-2 pt-2"><Button className="lmo-action-btn flex-1 bg-orange-600 hover:bg-orange-700" onClick={() => toast.success("Resolved", `Delivery ${selectedPerf.id} issue resolved`)}>Resolve</Button><Button variant="outline" className="lmo-action-btn" onClick={() => toast.success("Escalated", `Delivery ${selectedPerf.id} escalated`) }>Escalate</Button></div>
          </div></>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Hub Details */}
      <Sheet open={!!(sheetOpen && selectedHub)} onOpenChange={open => { if (!open) { setSheetOpen(false); setSelectedHub(null) } }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedHub && (<><SheetHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl"><SheetTitle className="text-white flex items-center gap-2"><BrainCircuit className="h-5 w-5" />Hub {selectedHub.id}</SheetTitle></SheetHeader>
          <div className="space-y-4 px-2">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-500">Type</p><HubTypeBadge type={selectedHub.type} /></div>
              <div><p className="text-xs text-gray-500">Status</p><HubStatusBadge status={selectedHub.status} /></div>
              <div><p className="text-xs text-gray-500">City</p><p className="text-sm font-semibold">{selectedHub.city}</p></div>
              <div><p className="text-xs text-gray-500">Manager</p><p className="text-sm font-medium flex items-center gap-1"><UserCheck className="h-3 w-3" />{selectedHub.manager}</p></div>
              <div><p className="text-xs text-gray-500">Capacity Fill</p><CapacityBar pct={Math.round(selectedHub.orders / selectedHub.capacity * 100)} /></div>
              <div><p className="text-xs text-gray-500">Utilization</p><UtilizationBar pct={selectedHub.utilization} /></div>
              <div><p className="text-xs text-gray-500">Daily Orders</p><p className="text-sm font-bold">{selectedHub.orders}</p></div>
              <div><p className="text-xs text-gray-500">Operating Hours</p><p className="text-sm font-mono">{selectedHub.hours}</p></div>
            </div>
            <div className="press-scale btn-outline-animate flex gap-2 pt-2"><Button className="lmo-action-btn flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => toast.success("Expanded", `Hub ${selectedHub.id} expansion approved`)}>Expand</Button><Button variant="outline" className="lmo-action-btn" onClick={() => toast.success("Reassigned", `Hub ${selectedHub.id} manager reassigned`)}>Reassign</Button></div>
          </div></>)}
        </SheetContent>
      </Sheet>
    </div>
  )
}
