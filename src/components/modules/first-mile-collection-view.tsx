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
  Tooltip,
} from "recharts"
import {
  Truck, MapPin, Clock, Package, Star, Fuel, IndianRupee, Users,
  Route, TrendingUp, ArrowUpRight, ArrowDownRight, Navigation, Phone,
  BarChart3, Target, Warehouse, PackageCheck, Timer, Zap, ShieldCheck,
  CalendarDays, AlertTriangle, CheckCircle2, XCircle, RefreshCw,
  Search, Eye, Weight, Boxes, Building2, Sun, Moon, ChevronRight,
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
// Enums (18+ const arrays)
// ============================================================================
const PICKUP_STATUSES = ["Scheduled", "Picked Up", "In Transit", "Delivered", "Cancelled", "Delayed", "No Show", "Rescheduled"] as const
const COMMODITIES = ["Fresh Produce", "Dairy", "FMCG", "Electronics", "Apparel", "Pharmaceuticals", "Auto Parts", "Agricultural", "Textiles", "Food Grains", "Spices", "Tea/Coffee"] as const
const PICKUP_TYPES = ["Scheduled", "On-Demand", "Bulk", "Express", "Emergency"] as const
const COLLECTION_HUBS = ["Hub Mumbai North", "Hub Delhi NCR West", "Hub Chennai South", "Hub Kolkata East", "Hub Bangalore Central", "Hub Hyderabad Cyber", "Hub Ahmedabad West", "Hub Pune IT"] as const
const INDIAN_CITIES = ["Mumbai", "Delhi NCR", "Chennai", "Kolkata", "Bangalore", "Hyderabad", "Ahmedabad", "Jaipur", "Pune", "Kochi", "Lucknow", "Indore", "Bhopal", "Patna", "Guwahati", "Coimbatore", "Vizag", "Nagpur"] as const
const VEHICLE_TYPES = ["Tata Ace", "Mahindra Bolero", "Ashok Leyland Dost", "Eicher Pro", "Tata 407", "Force Tempo", "Piaggio Ape", "Mahindra Jeeto", "TVS King", "Bajaj RE"] as const
const SUPPLIER_CATEGORIES = ["Farmer", "Dairy Farm", "Manufacturer", "Distributor", "Wholesaler", "Retailer", "Co-operative", "Aggregator"] as const
const DRIVER_SHIFTS = ["Morning", "Evening", "Night"] as const
const ROUTE_STATUSES = ["Active", "Completed", "Delayed", "Cancelled", "In Progress"] as const
const PICKUP_FREQUENCIES = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "On-Demand"] as const
const DRIVER_STATUSES = ["On Trip", "Available", "Off Duty", "Break", "On Call"] as const
const SUPPLIER_STATUSES = ["Active", "Inactive", "Pending Review", "Suspended", "New"] as const
const INDIAN_PLATES = ["MH", "KA", "TN", "DL", "GJ", "RJ", "UP", "WB", "TS", "AP"] as const
const DRIVER_NAMES = [
  "Ravi Kumar", "Suresh Patel", "Anil Reddy", "Mohit Sharma", "Imran Khan",
  "Pradeep Singh", "Venkat Rao", "Joseph Mathew", "Manoj Verma", "Vikram Singh",
  "Harpreet Kaur", "Amit Ranjan", "Sushant Mohanty", "Deepak Joshi", "Rajesh Nair",
  "Karthik Rajan", "Sanjay Gupta", "Arjun Mehta", "Balu Iyer", "Dinesh Yadav",
  "Nikhil Pandey", "Tamil Selvan", "Gurpreet Walia", "Sunil Kulkarni", "Prakash Hegde",
  "Bhaskar Rao", "Ajay Dubey", "Vijay Chauhan", "Krishna Murthy", "Tarun Bhat",
] as const
const SUPPLIER_NAMES = [
  "Krishna Farms", "Tamil Nadu Dairy", "Nirma Industries", "Big Basket Agri", "Royal Spice Co",
  "Patel Textiles", "Bengaluru Electronics", "Kolkata Pharma", "Mumbai FMCG Dist", "Pune Auto Parts",
  "Hyderabad Agri", "Ahmedabad Dairy", "Jaipur Garments", "Lucknow Wholesalers", "Indore Co-op",
  "Chennai Tea Co", "Kochi Spice Farm", "Bhopal Food Grains", "Patna Textiles", "Guwahati Agri",
  "Coimbatore Mills", "Vizag Seafood", "Nagpur Oranges", "Delhi NCR Distributors", "Mumbai Farmer Co-op",
  "Bangalore Dairy", "Hyderabad Pharma", "Kolkata Rice Traders", "Pune Spice House", "Ahmedabad FMCG",
  "Jaipur Dairy Farm", "Lucknow Electronics", "Indore Textiles", "Chennai Auto Parts", "Kochi Tea Estate",
  "Bhopal Pharma", "Patna Wholesaler", "Guwahati Tea Co", "Coimbatore Dairy", "Vizag Textiles",
  "Nagpur Farmer Co-op", "Delhi Apparels", "Mumbai Spices", "Bangalore Auto Parts", "Hyderabad Textiles",
  "Ahmedabad Electronics", "Jaipur Food Grains", "Lucknow Pharma", "Indore Dairy", "Chennai FMCG",
] as const

// ============================================================================
// Color Maps
// ============================================================================
const STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Scheduled: { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  "Picked Up": { color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800" },
  "In Transit": { color: "text-cyan-700 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-200 dark:border-cyan-800" },
  Delivered: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  Cancelled: { color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
  Delayed: { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
  "No Show": { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/40", border: "border-slate-300 dark:border-slate-600" },
  Rescheduled: { color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800" },
}
const COMMODITY_COLORS: Record<string, string> = {
  "Fresh Produce": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Dairy: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  FMCG: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Electronics: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Apparel: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  Pharmaceuticals: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Auto Parts": "bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300",
  Agricultural: "bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300",
  Textiles: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  "Food Grains": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Spices: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "Tea/Coffee": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
}
const PICKUP_TYPE_COLORS: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "On-Demand": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Bulk: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  Express: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
}
const SHIFT_COLORS: Record<string, string> = {
  Morning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Evening: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  Night: "bg-slate-700 text-slate-100 dark:bg-slate-600 dark:text-slate-100",
}
const HUB_COLORS: Record<string, string> = {
  "Hub Mumbai North": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Hub Delhi NCR West": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  "Hub Chennai South": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Hub Kolkata East": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Hub Bangalore Central": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  "Hub Hyderabad Cyber": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  "Hub Ahmedabad West": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "Hub Pune IT": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
}
const SUPPLIER_CAT_COLORS: Record<string, string> = {
  Farmer: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "Dairy Farm": "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  Manufacturer: "bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300",
  Distributor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  Wholesaler: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Retailer: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  "Co-operative": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  Aggregator: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
}
const FREQ_COLORS: Record<string, string> = {
  Daily: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Weekly: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Bi-Weekly": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Monthly: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "On-Demand": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
}
const ROUTE_STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Active: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  Completed: { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  Delayed: { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
  Cancelled: { color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
  "In Progress": { color: "text-cyan-700 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-200 dark:border-cyan-800" },
}
const DRIVER_STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  "On Trip": { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  Available: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  "Off Duty": { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/40", border: "border-slate-300 dark:border-slate-600" },
  Break: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
  "On Call": { color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800" },
}
const SUPPLIER_STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Active: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  Inactive: { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/40", border: "border-slate-300 dark:border-slate-600" },
  "Pending Review": { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
  Suspended: { color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
  New: { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
}
const PIE_COLORS = ["#3b82f6", "#059669", "#ea580c", "#7c3aed", "#0d9488", "#d97706", "#e11d48", "#4f46e5", "#0891b2", "#65a30d", "#c026d3", "#dc2626"]

// ============================================================================
// Interfaces
// ============================================================================
interface PickupOrder { id: string; pickupId: string; supplierName: string; commodity: string; quantity: number; pickupLocation: string; destHub: string; driverName: string; vehicle: string; vehiclePlate: string; status: string; scheduledTime: string; weightKg: number; pickupType: string }
interface RouteRecord { id: string; routeId: string; name: string; stops: number; distanceKm: number; estTime: string; actualTime: string; driver: string; vehicle: string; status: string; fuelCost: number; efficiency: number; hubName: string }
interface DriverRecord { id: string; driverId: string; name: string; phone: string; license: string; vehicleType: string; vehiclePlate: string; currentLocation: string; status: string; tripsToday: number; rating: number; earningsToday: number; shift: string }
interface SupplierRecord { id: string; supplierId: string; name: string; category: string; location: string; hub: string; contact: string; pickupFrequency: string; avgVolume: number; status: string; complianceScore: number; onboardingDate: string; lastPickup: string }

// ============================================================================
// generateData
// ============================================================================
function generateData() {
  const orders: PickupOrder[] = []
  for (let i = 0; i < 65; i++) {
    const s = i * 17 + 3
    orders.push({
      id: `po-${i}`, pickupId: `FMC-${String(i + 1).padStart(4, "0")}`,
      supplierName: pick(SUPPLIER_NAMES, s + 1) as string,
      commodity: pick(COMMODITIES, s + 2) as string,
      quantity: ri(50, 5000, s + 3), pickupLocation: pick(INDIAN_CITIES, s + 4) as string,
      destHub: pick(COLLECTION_HUBS, s + 5) as string,
      driverName: pick(DRIVER_NAMES, s + 6) as string,
      vehicle: pick(VEHICLE_TYPES, s + 7) as string,
      vehiclePlate: `${pick(INDIAN_PLATES, s + 8)}-${String(ri(1, 99, s + 9)).padStart(2, "0")}-${pick(["AB", "CD", "EF", "GH", "IJ"], s + 10)}-${ri(1000, 9999, s + 11)}`,
      status: pick(PICKUP_STATUSES, s) as string,
      scheduledTime: `${String(ri(6, 22, s + 12)).padStart(2, "0")}:${String(ri(0, 59, s + 13)).padStart(2, "0")}`,
      weightKg: ri(100, 5000, s + 14), pickupType: pick(PICKUP_TYPES, s + 15) as string,
    })
  }
  const routes: RouteRecord[] = []
  for (let i = 0; i < 55; i++) {
    const s = i * 23 + 7
    const estMin = ri(60, 480, s + 4)
    const actMin = estMin + ri(-30, 60, s + 5)
    routes.push({
      id: `rt-${i}`, routeId: `RT-${String(i + 1).padStart(4, "0")}`,
      name: `${pick(INDIAN_CITIES, s)} → ${pick(COLLECTION_HUBS, s + 1)}` as string,
      stops: ri(3, 15, s + 2), distanceKm: ri(15, 250, s + 3),
      estTime: `${Math.floor(estMin / 60)}h ${estMin % 60}m`,
      actualTime: `${Math.floor(Math.max(0, actMin) / 60)}h ${Math.max(0, actMin) % 60}m`,
      driver: pick(DRIVER_NAMES, s + 6) as string,
      vehicle: pick(VEHICLE_TYPES, s + 7) as string,
      status: pick(ROUTE_STATUSES, s + 8) as string,
      fuelCost: ri(200, 3500, s + 9), efficiency: ri(60, 99, s + 10),
      hubName: pick(COLLECTION_HUBS, s + 11) as string,
    })
  }
  const drivers: DriverRecord[] = []
  for (let i = 0; i < 50; i++) {
    const s = i * 29 + 13
    drivers.push({
      id: `drv-${i}`, driverId: `DRV-${String(i + 1).padStart(4, "0")}`,
      name: DRIVER_NAMES[i % DRIVER_NAMES.length],
      phone: `+91 ${ri(7000000000, 9999999999, s)}`,
      license: `DL${ri(1000000000, 9999999999, s + 1)}`,
      vehicleType: pick(VEHICLE_TYPES, s + 2) as string,
      vehiclePlate: `${pick(INDIAN_PLATES, s + 3)}-${String(ri(1, 99, s + 4)).padStart(2, "0")}-${pick(["AB", "CD", "EF", "GH"], s + 5)}-${ri(1000, 9999, s + 6)}`,
      currentLocation: pick(INDIAN_CITIES, s + 7) as string,
      status: pick(DRIVER_STATUSES, s + 8) as string,
      tripsToday: ri(1, 12, s + 9), rating: ri(30, 50, s + 10) / 10,
      earningsToday: ri(800, 4500, s + 11), shift: pick(DRIVER_SHIFTS, s + 12) as string,
    })
  }
  const suppliers: SupplierRecord[] = []
  for (let i = 0; i < 55; i++) {
    const s = i * 31 + 19
    suppliers.push({
      id: `sup-${i}`, supplierId: `SUP-${String(i + 1).padStart(4, "0")}`,
      name: SUPPLIER_NAMES[i % SUPPLIER_NAMES.length],
      category: pick(SUPPLIER_CATEGORIES, s + 1) as string,
      location: pick(INDIAN_CITIES, s + 2) as string,
      hub: pick(COLLECTION_HUBS, s + 3) as string,
      contact: `+91 ${ri(7000000000, 9999999999, s + 4)}`,
      pickupFrequency: pick(PICKUP_FREQUENCIES, s + 5) as string,
      avgVolume: ri(100, 10000, s + 6),
      status: pick(SUPPLIER_STATUSES, s + 7) as string,
      complianceScore: ri(60, 100, s + 8),
      onboardingDate: `2024-${String(ri(1, 12, s + 9)).padStart(2, "0")}-${String(ri(1, 28, s + 10)).padStart(2, "0")}`,
      lastPickup: `2024-${String(ri(10, 12, s + 11)).padStart(2, "0")}-${String(ri(1, 28, s + 12)).padStart(2, "0")}`,
    })
  }
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weeklyPickupTrend = days.map((d, i) => ({ day: d, scheduled: ri(80, 200, i * 5 + 100), completed: ri(60, 180, i * 5 + 200), onDemand: ri(10, 60, i * 5 + 300) }))
  const hubCollections = COLLECTION_HUBS.map((h, i) => ({ hub: h.replace("Hub ", ""), collections: ri(150, 500, i * 7 + 400) }))
  const commodityMix = COMMODITIES.map((c, i) => ({ name: c, value: ri(20, 200, i * 9 + 500) }))
  const dailyCollectionTrend = Array.from({ length: 14 }, (_, i) => ({ date: `Dec ${i + 1}`, pickups: ri(100, 250, i * 6 + 700), delivered: ri(80, 220, i * 6 + 800) }))
  const routeEfficiencyData = COLLECTION_HUBS.slice(0, 6).map((h, i) => ({ hub: h.replace("Hub ", ""), efficiency: ri(70, 98, i * 8 + 900) }))
  const supplierPerfData = SUPPLIER_CATEGORIES.map((c, i) => ({ name: c, value: ri(30, 150, i * 10 + 1000) }))
  const pickupTimeDist = [
    { range: "0-30 min", count: ri(20, 60, 1100) },
    { range: "30-60 min", count: ri(40, 80, 1101) },
    { range: "1-2 hrs", count: ri(30, 70, 1102) },
    { range: "2-4 hrs", count: ri(10, 40, 1103) },
    { range: "4+ hrs", count: ri(5, 20, 1104) },
  ]
  const costRevenueData = days.map((d, i) => ({ day: d, cost: ri(50000, 150000, i * 11 + 1200), revenue: ri(60000, 200000, i * 11 + 1300) }))

  return {
    PICKUP_STATUSES, COMMODITIES, PICKUP_TYPES, COLLECTION_HUBS, INDIAN_CITIES, VEHICLE_TYPES,
    SUPPLIER_CATEGORIES, DRIVER_SHIFTS, ROUTE_STATUSES, PICKUP_FREQUENCIES, DRIVER_STATUSES,
    SUPPLIER_STATUSES,
    orders, routes, drivers, suppliers,
    dashboardKpis: { totalPickupsToday: 156, collectionsCompleted: 134, activeRoutes: 42, pendingPickups: 22, supplierCoverage: 87.3, avgPickupTime: 47, collectionRate: 85.9, revenueToday: 2450000 },
    weeklyPickupTrend, hubCollections, commodityMix,
    dailyCollectionTrend, routeEfficiencyData, supplierPerfData, pickupTimeDist, costRevenueData,
    analyticsKpis: { avgDeliveryTime: 2.3, onTimeRate: 92.4, routeUtilization: 78.6, costPerPickup: 1250, totalRevenue: 18500000, supplierRetention: 94.1, fleetUtilization: 82.3, customerSatisfaction: 4.5 },
  }
}

// ============================================================================
// Unique Visual Components (22+)
// ============================================================================

// 1. PickupStatusBadge — 8 statuses with pulse for In Transit/Delayed
function PickupStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_COLORS[status] ?? STATUS_COLORS["Scheduled"]
  const pulse = status === "In Transit" ? "fmc-pulse-cyan" : status === "Delayed" ? "fmc-pulse-orange" : status === "Cancelled" ? "fmc-pulse-red" : ""
  return <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold fmc-status-badge", cfg.color, cfg.bg, cfg.border, pulse)}>{status}</span>
}

// 2. CommodityBadge — 12 colors
function CommodityBadge({ commodity }: { commodity: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium fmc-commodity-badge", COMMODITY_COLORS[commodity] ?? "bg-gray-100 text-gray-700")}>{commodity}</span>
}

// 3. PickupTypeBadge — 5 types with icons
function PickupTypeBadge({ type }: { type: string }) {
  const icon = type === "Express" ? <Zap className="h-2.5 w-2.5" /> : type === "Emergency" ? <AlertTriangle className="h-2.5 w-2.5" /> : type === "Bulk" ? <Boxes className="h-2.5 w-2.5" /> : type === "On-Demand" ? <Timer className="h-2.5 w-2.5" /> : <CalendarDays className="h-2.5 w-2.5" />
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium fmc-pickup-type-badge", PICKUP_TYPE_COLORS[type] ?? "bg-gray-100 text-gray-700")}>{icon}{type}</span>
}

// 4. RouteEfficiencyBar — 3-tier gradient green/amber/red
function RouteEfficiencyBar({ pct }: { pct: number }) {
  const tier = pct >= 80 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : pct >= 60 ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-red-500 to-red-400"
  return (
    <div className="flex items-center gap-1.5 fmc-route-eff-bar">
      <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", tier)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-[10px] font-semibold", pct >= 80 ? "text-emerald-700 dark:text-emerald-400" : pct >= 60 ? "text-amber-700 dark:text-amber-400" : "text-red-700 dark:text-red-400")}>{pct}%</span>
    </div>
  )
}

// 5. FuelCostTile — INR with fuel icon
function FuelCostTile({ amount }: { amount: number }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/30 dark:text-orange-300 fmc-fuel-tile"><Fuel className="h-3 w-3" />{formatINR(amount)}</span>
}

// 6. DistanceTile — km with route icon
function DistanceTile({ km }: { km: number }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 fmc-distance-tile"><Route className="h-3 w-3" />{km} km</span>
}

// 7. StopCountBadge — number with color
function StopCountBadge({ count }: { count: number }) {
  const c = count >= 10 ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300" : count >= 6 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300"
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold fmc-stop-badge", c)}><Navigation className="h-2.5 w-2.5" />{count}</span>
}

// 8. DriverRatingBadge — star rating with color
function DriverRatingBadge({ rating }: { rating: number }) {
  const c = rating >= 4.5 ? "text-amber-500" : rating >= 3.5 ? "text-blue-500" : rating >= 2.5 ? "text-orange-500" : "text-red-500"
  return <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-semibold fmc-driver-rating", c)}><Star className="h-2.5 w-2.5 fill-current" />{rating.toFixed(1)}</span>
}

// 9. VehicleTypeBadge — Indian vehicle types
function VehicleTypeBadge({ type }: { type: string }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-800 dark:bg-teal-950/30 dark:text-teal-300 fmc-vehicle-badge"><Truck className="h-2.5 w-2.5" />{type}</span>
}

// 10. ShiftBadge — Morning/Evening/Night with color
function ShiftBadge({ shift }: { shift: string }) {
  const icon = shift === "Morning" ? <Sun className="h-2.5 w-2.5" /> : shift === "Night" ? <Moon className="h-2.5 w-2.5" /> : <Moon className="h-2.5 w-2.5" />
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium fmc-shift-badge", SHIFT_COLORS[shift])}>{icon}{shift}</span>
}

// 11. EarningsTile — INR amount
function EarningsTile({ amount }: { amount: number }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 fmc-earnings-tile"><IndianRupee className="h-3 w-3" />{formatINR(amount)}</span>
}

// 12. SupplierCategoryBadge — 8 supplier categories
function SupplierCategoryBadge({ category }: { category: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium fmc-supplier-cat-badge", SUPPLIER_CAT_COLORS[category] ?? "bg-gray-100 text-gray-700")}>{category}</span>
}

// 13. ComplianceScoreBar — 3-tier gradient
function ComplianceScoreBar({ score }: { score: number }) {
  const tier = score >= 85 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : score >= 70 ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-red-500 to-red-400"
  return (
    <div className="flex items-center gap-1.5 fmc-compliance-bar">
      <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", tier)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn("text-[10px] font-semibold", score >= 85 ? "text-emerald-700 dark:text-emerald-400" : score >= 70 ? "text-amber-700 dark:text-amber-400" : "text-red-700 dark:text-red-400")}>{score}%</span>
    </div>
  )
}

// 14. PickupFrequencyBadge — Daily/Weekly/Bi-Weekly/Monthly/On-Demand
function PickupFrequencyBadge({ freq }: { freq: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium fmc-freq-badge", FREQ_COLORS[freq] ?? "bg-gray-100 text-gray-700")}>{freq}</span>
}

// 15. LocationTile — with MapPin styling
function LocationTile({ location }: { location: string }) {
  return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground fmc-location-tile"><MapPin className="h-2.5 w-2.5" />{location}</span>
}

// 16. WeightTile — kg with formatting
function WeightTile({ kg }: { kg: number }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 fmc-weight-tile"><Weight className="h-3 w-3" />{kg.toLocaleString("en-IN")} kg</span>
}

// 17. QuantityTile — with unit
function QuantityTile({ qty, unit }: { qty: number; unit?: string }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 fmc-qty-tile"><Boxes className="h-3 w-3" />{qty.toLocaleString("en-IN")}{unit ? ` ${unit}` : ""}</span>
}

// 18. HubBadge — collection hub with color
function HubBadge({ hub }: { hub: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium fmc-hub-badge", HUB_COLORS[hub] ?? "bg-gray-100 text-gray-700")}><Warehouse className="h-2.5 w-2.5" />{hub.replace("Hub ", "")}</span>
}

// 19. TripCounterBadge — trips count
function TripCounterBadge({ trips }: { trips: number }) {
  const c = trips >= 8 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" : trips >= 4 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300"
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold fmc-trip-badge", c)}><Package className="h-2.5 w-2.5" />{trips}</span>
}

// 20. OnTimeIndicator — on-time % with color
function OnTimeIndicator({ pct }: { pct: number }) {
  const c = pct >= 90 ? "text-emerald-600 dark:text-emerald-400" : pct >= 75 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  const icon = pct >= 90 ? <CheckCircle2 className="h-3 w-3" /> : pct >= 75 ? <AlertTriangle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />
  return <span className={cn("inline-flex items-center gap-1 text-xs font-semibold fmc-ontime-indicator", c)}>{icon}{pct}%</span>
}

// 21. CostRevenueTile — cost vs revenue comparison
function CostRevenueTile({ cost, revenue }: { cost: number; revenue: number }) {
  const margin = ((revenue - cost) / revenue * 100).toFixed(1)
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/40 fmc-cost-rev-tile">
      <span className="text-[10px] text-red-600 dark:text-red-400 font-medium">C: {formatINR(cost)}</span>
      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">R: {formatINR(revenue)}</span>
      <span className={cn("text-[10px] font-semibold", Number(margin) >= 20 ? "text-emerald-600" : "text-amber-600")}>{margin}%</span>
    </div>
  )
}

// 22. TimeVsEstimateTile — actual vs estimated with color diff
function TimeVsEstimateTile({ actual, estimate }: { actual: string; estimate: string }) {
  const aMin = actual.includes("h") ? Number(actual.split("h")[0]) * 60 + Number(actual.split(" ")[1]?.replace("m", "")) : 0
  const eMin = estimate.includes("h") ? Number(estimate.split("h")[0]) * 60 + Number(estimate.split(" ")[1]?.replace("m", "")) : 0
  const diff = aMin - eMin
  return (
    <div className="flex items-center gap-1 fmc-time-est-tile">
      <span className="text-[10px] text-muted-foreground">Est: {estimate}</span>
      <span className={cn("text-[10px] font-semibold", diff <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400")}>
        Act: {actual} {diff > 0 ? `(+${diff}m)` : diff < 0 ? `(${diff}m)` : "(on time)"}
      </span>
    </div>
  )
}

// Shared: KpiCard
function KpiCard({ title, value, subtitle, icon: Icon, trend, color }: {
  title: string; value: string; subtitle: string; icon: React.ElementType; trend?: "up" | "down" | "neutral"; color: string
}) {
  return (
    <Card className="fmc-kpi-card">
      <CardContent className="glass-subtle p-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground font-medium">{title}</span>
            <span className="text-lg font-bold tracking-tight">{value}</span>
            <div className="flex items-center gap-1">
              {trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
              {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-600 dark:text-red-400" />}
              <span className="text-[10px] text-muted-foreground">{subtitle}</span>
            </div>
          </div>
          <div className={cn("rounded-lg p-2", color)}><Icon className="h-4 w-4 text-white" /></div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export default function FirstMileCollectionView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState<string>("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<PickupOrder | RouteRecord | DriverRecord | SupplierRecord | null>(null)
  const [sortCol, setSortCol] = useState<string>("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const openDrawer = (type: string, item: PickupOrder | RouteRecord | DriverRecord | SupplierRecord) => {
    setDrawerType(type)
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortCol(col); setSortDir("asc") }
  }

  const SortHeader = ({ col, label }: { col: string; label: string }) => (
    <TableHead className="text-xs cursor-pointer select-none hover:bg-accent/50 fmc-sort-header" onClick={() => handleSort(col)}>
      <div className="flex items-center gap-0.5">{label}{sortCol === col && <span className="text-[9px]">{sortDir === "asc" ? "↑" : "↓"}</span>}</div>
    </TableHead>
  )

  // Filtered data per tab
  const filteredOrders = useMemo(() => {
    let f = data.orders
    if (statusFilter !== "all") f = f.filter((o) => o.status === statusFilter)
    if (searchTerm) f = f.filter((o) => o.pickupId.toLowerCase().includes(searchTerm.toLowerCase()) || o.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || o.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    return [...f].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const aV = a[sortCol as keyof PickupOrder]; const bV = b[sortCol as keyof PickupOrder]
      return typeof aV === "number" && typeof bV === "number" ? (aV - bV) * dir : String(aV).localeCompare(String(bV)) * dir
    })
  }, [data.orders, searchTerm, statusFilter, sortCol, sortDir])

  const filteredRoutes = useMemo(() => {
    let f = data.routes
    if (statusFilter !== "all") f = f.filter((r) => r.status === statusFilter)
    if (searchTerm) f = f.filter((r) => r.routeId.toLowerCase().includes(searchTerm.toLowerCase()) || r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return [...f].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const aV = a[sortCol as keyof RouteRecord]; const bV = b[sortCol as keyof RouteRecord]
      return typeof aV === "number" && typeof bV === "number" ? (aV - bV) * dir : String(aV).localeCompare(String(bV)) * dir
    })
  }, [data.routes, searchTerm, statusFilter, sortCol, sortDir])

  const filteredDrivers = useMemo(() => {
    let f = data.drivers
    if (statusFilter !== "all") f = f.filter((d) => d.status === statusFilter)
    if (searchTerm) f = f.filter((d) => d.driverId.toLowerCase().includes(searchTerm.toLowerCase()) || d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return [...f].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const aV = a[sortCol as keyof DriverRecord]; const bV = b[sortCol as keyof DriverRecord]
      return typeof aV === "number" && typeof bV === "number" ? (aV - bV) * dir : String(aV).localeCompare(String(bV)) * dir
    })
  }, [data.drivers, searchTerm, statusFilter, sortCol, sortDir])

  const filteredSuppliers = useMemo(() => {
    let f = data.suppliers
    if (statusFilter !== "all") f = f.filter((s) => s.status === statusFilter)
    if (searchTerm) f = f.filter((s) => s.supplierId.toLowerCase().includes(searchTerm.toLowerCase()) || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return [...f].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const aV = a[sortCol as keyof SupplierRecord]; const bV = b[sortCol as keyof SupplierRecord]
      return typeof aV === "number" && typeof bV === "number" ? (aV - bV) * dir : String(aV).localeCompare(String(bV)) * dir
    })
  }, [data.suppliers, searchTerm, statusFilter, sortCol, sortDir])

  const tab = activeTab
  const statuses = tab === "1" ? data.PICKUP_STATUSES : tab === "2" ? data.ROUTE_STATUSES : tab === "3" ? data.DRIVER_STATUSES : data.SUPPLIER_STATUSES

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <PageHeader title="First-Mile Collection Hub" description="Manage pickup operations from suppliers to collection hubs across India" />

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchTerm(""); setStatusFilter("all"); }}>
        <TabsList className="grid w-full grid-cols-6 h-9">
          <TabsTrigger value="0" className="text-[11px]">Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="text-[11px]">Pickup Orders</TabsTrigger>
          <TabsTrigger value="2" className="text-[11px]">Route Optimization</TabsTrigger>
          <TabsTrigger value="3" className="text-[11px]">Driver & Fleet</TabsTrigger>
          <TabsTrigger value="4" className="text-[11px]">Suppliers</TabsTrigger>
          <TabsTrigger value="5" className="text-[11px]">Analytics</TabsTrigger>
        </TabsList>

        {/* TAB 0 — Collection Dashboard */}
        <TabsContent value="0" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 fmc-kpi-grid">
            <KpiCard title="Total Pickups Today" value={String(data.dashboardKpis.totalPickupsToday)} subtitle="+8% vs yesterday" icon={Package} trend="up" color="bg-blue-600" />
            <KpiCard title="Collections Completed" value={String(data.dashboardKpis.collectionsCompleted)} subtitle="85.9% completion" icon={PackageCheck} trend="up" color="bg-emerald-600" />
            <KpiCard title="Active Routes" value={String(data.dashboardKpis.activeRoutes)} subtitle="6 delays reported" icon={Route} trend="neutral" color="bg-violet-600" />
            <KpiCard title="Pending Pickups" value={String(data.dashboardKpis.pendingPickups)} subtitle="-3 from morning" icon={Timer} trend="down" color="bg-orange-600" />
            <KpiCard title="Supplier Coverage" value={`${data.dashboardKpis.supplierCoverage}%`} subtitle="+2.1% this month" icon={Users} trend="up" color="bg-teal-600" />
            <KpiCard title="Avg Pickup Time" value={`${data.dashboardKpis.avgPickupTime} min`} subtitle="-5 min improvement" icon={Clock} trend="up" color="bg-amber-600" />
            <KpiCard title="Collection Rate" value={`${data.dashboardKpis.collectionRate}%`} subtitle="Above 85% target" icon={Target} trend="up" color="bg-rose-600" />
            <KpiCard title="Revenue Today" value={formatINR(data.dashboardKpis.revenueToday)} subtitle="+12% vs last week" icon={IndianRupee} trend="up" color="bg-indigo-600" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="fmc-chart-card"><CardHeader><CardTitle className="text-sm">Weekly Pickup Trend</CardTitle></CardHeader><CardContent><div className="h-[220px]"><AreaChart data={data.weeklyPickupTrend}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="completed" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} /><Area type="monotone" dataKey="scheduled" stackId="2" stroke="#059669" fill="#059669" fillOpacity={0.3} /><Area type="monotone" dataKey="onDemand" stackId="3" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} /></AreaChart></div></CardContent></Card>
            <Card className="fmc-chart-card"><CardHeader><CardTitle className="text-sm">Hub-wise Collections</CardTitle></CardHeader><CardContent><div className="h-[220px]"><BarChart data={data.hubCollections}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="hub" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="collections" fill="#0d9488" radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
            <Card className="fmc-chart-card"><CardHeader><CardTitle className="text-sm">Commodity Mix</CardTitle></CardHeader><CardContent><div className="h-[220px]"><PieChart><Pie data={data.commodityMix} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" label={({ name }) => <span className="text-[9px]">{name}</span>} labelLine={false}>{data.commodityMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></div></CardContent></Card>
          </div>
        </TabsContent>

        {/* TAB 1 — Pickup Orders */}
        <TabsContent value="1" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search pickup ID, supplier, location..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="fmc-table-row">
              <SortHeader col="pickupId" label="Pickup ID" /><TableHead className="text-[10px]">Supplier</TableHead><TableHead className="text-[10px]">Commodity</TableHead><TableHead className="text-[10px]">Location</TableHead><TableHead className="text-[10px]">Dest Hub</TableHead><TableHead className="text-[10px]">Status</TableHead><TableHead className="text-[10px]">Type</TableHead><TableHead className="text-[10px]">Time</TableHead><TableHead className="text-[10px]">Weight</TableHead><TableHead className="text-[10px] w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredOrders.map((o) => (
                <TableRow key={o.id} className="cursor-pointer fmc-table-row hover:bg-muted/50" onClick={() => openDrawer("order", o)}>
                  <TableCell className="text-xs font-mono font-semibold">{o.pickupId}</TableCell>
                  <TableCell className="text-[10px]">{o.supplierName}</TableCell>
                  <TableCell><CommodityBadge commodity={o.commodity} /></TableCell>
                  <TableCell><LocationTile location={o.pickupLocation} /></TableCell>
                  <TableCell><HubBadge hub={o.destHub} /></TableCell>
                  <TableCell><PickupStatusBadge status={o.status} /></TableCell>
                  <TableCell><PickupTypeBadge type={o.pickupType} /></TableCell>
                  <TableCell className="text-[10px]"><Clock className="h-2.5 w-2.5 inline mr-0.5" />{o.scheduledTime}</TableCell>
                  <TableCell><WeightTile kg={o.weightKg} /></TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* TAB 2 — Route Optimization */}
        <TabsContent value="2" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search route ID, name..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="fmc-table-row">
              <SortHeader col="routeId" label="Route ID" /><TableHead className="text-[10px]">Name</TableHead><TableHead className="text-[10px]">Stops</TableHead><TableHead className="text-[10px]">Distance</TableHead><TableHead className="text-[10px]">Time (Est/Act)</TableHead><TableHead className="text-[10px]">Driver</TableHead><TableHead className="text-[10px]">Vehicle</TableHead><TableHead className="text-[10px]">Status</TableHead><TableHead className="text-[10px]">Efficiency</TableHead><TableHead className="text-[10px]">Fuel Cost</TableHead><TableHead className="text-[10px] w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredRoutes.map((r) => (
                <TableRow key={r.id} className="cursor-pointer fmc-table-row hover:bg-muted/50" onClick={() => openDrawer("route", r)}>
                  <TableCell className="text-xs font-mono font-semibold">{r.routeId}</TableCell>
                  <TableCell className="text-[10px] max-w-[140px] truncate">{r.name}</TableCell>
                  <TableCell><StopCountBadge count={r.stops} /></TableCell>
                  <TableCell><DistanceTile km={r.distanceKm} /></TableCell>
                  <TableCell><TimeVsEstimateTile actual={r.actualTime} estimate={r.estTime} /></TableCell>
                  <TableCell className="text-[10px]">{r.driver}</TableCell>
                  <TableCell><VehicleTypeBadge type={r.vehicle} /></TableCell>
                  <TableCell><PickupStatusBadge status={r.status} /></TableCell>
                  <TableCell><RouteEfficiencyBar pct={r.efficiency} /></TableCell>
                  <TableCell><FuelCostTile amount={r.fuelCost} /></TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* TAB 3 — Driver & Vehicle Fleet */}
        <TabsContent value="3" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search driver ID, name..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="fmc-table-row">
              <SortHeader col="driverId" label="Driver ID" /><TableHead className="text-[10px]">Name</TableHead><TableHead className="text-[10px]">Phone</TableHead><TableHead className="text-[10px]">Vehicle</TableHead><TableHead className="text-[10px]">Plate</TableHead><TableHead className="text-[10px]">Location</TableHead><TableHead className="text-[10px]">Status</TableHead><TableHead className="text-[10px]">Trips</TableHead><TableHead className="text-[10px]">Rating</TableHead><TableHead className="text-[10px]">Earnings</TableHead><TableHead className="text-[10px]">Shift</TableHead><TableHead className="text-[10px] w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredDrivers.map((d) => (
                <TableRow key={d.id} className="cursor-pointer fmc-table-row hover:bg-muted/50" onClick={() => openDrawer("driver", d)}>
                  <TableCell className="text-xs font-mono font-semibold">{d.driverId}</TableCell>
                  <TableCell className="text-[10px] font-medium">{d.name}</TableCell>
                  <TableCell className="text-[10px]">{d.phone}</TableCell>
                  <TableCell><VehicleTypeBadge type={d.vehicleType} /></TableCell>
                  <TableCell className="text-[10px] font-mono">{d.vehiclePlate}</TableCell>
                  <TableCell><LocationTile location={d.currentLocation} /></TableCell>
                  <TableCell><PickupStatusBadge status={d.status} /></TableCell>
                  <TableCell><TripCounterBadge trips={d.tripsToday} /></TableCell>
                  <TableCell><DriverRatingBadge rating={d.rating} /></TableCell>
                  <TableCell><EarningsTile amount={d.earningsToday} /></TableCell>
                  <TableCell><ShiftBadge shift={d.shift} /></TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* TAB 4 — Supplier Management */}
        <TabsContent value="4" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search supplier ID, name..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="fmc-table-row">
              <SortHeader col="supplierId" label="Supplier ID" /><TableHead className="text-[10px]">Name</TableHead><TableHead className="text-[10px]">Category</TableHead><TableHead className="text-[10px]">Location</TableHead><TableHead className="text-[10px]">Hub</TableHead><TableHead className="text-[10px]">Contact</TableHead><TableHead className="text-[10px]">Frequency</TableHead><TableHead className="text-[10px]">Volume</TableHead><TableHead className="text-[10px]">Status</TableHead><TableHead className="text-[10px]">Compliance</TableHead><TableHead className="text-[10px]">Last Pickup</TableHead><TableHead className="text-[10px] w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredSuppliers.map((s) => (
                <TableRow key={s.id} className="cursor-pointer fmc-table-row hover:bg-muted/50" onClick={() => openDrawer("supplier", s)}>
                  <TableCell className="text-xs font-mono font-semibold">{s.supplierId}</TableCell>
                  <TableCell className="text-[10px] font-medium">{s.name}</TableCell>
                  <TableCell><SupplierCategoryBadge category={s.category} /></TableCell>
                  <TableCell><LocationTile location={s.location} /></TableCell>
                  <TableCell><HubBadge hub={s.hub} /></TableCell>
                  <TableCell className="text-[10px]">{s.contact}</TableCell>
                  <TableCell><PickupFrequencyBadge freq={s.pickupFrequency} /></TableCell>
                  <TableCell><QuantityTile qty={s.avgVolume} /></TableCell>
                  <TableCell><PickupStatusBadge status={s.status} /></TableCell>
                  <TableCell><ComplianceScoreBar score={s.complianceScore} /></TableCell>
                  <TableCell className="text-[10px]">{s.lastPickup}</TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* TAB 5 — Collection Analytics */}
        <TabsContent value="5" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 fmc-kpi-grid">
            <KpiCard title="Avg Delivery Time" value={`${data.analyticsKpis.avgDeliveryTime} hrs`} subtitle="From pickup to hub" icon={Clock} trend="down" color="bg-blue-600" />
            <KpiCard title="On-Time Rate" value={`${data.analyticsKpis.onTimeRate}%`} subtitle="+1.2% vs last month" icon={Target} trend="up" color="bg-emerald-600" />
            <KpiCard title="Route Utilization" value={`${data.analyticsKpis.routeUtilization}%`} subtitle="78% capacity used" icon={Route} trend="up" color="bg-violet-600" />
            <KpiCard title="Cost per Pickup" value={formatINR(data.analyticsKpis.costPerPickup)} subtitle="-₹50 vs last week" icon={IndianRupee} trend="down" color="bg-orange-600" />
            <KpiCard title="Total Revenue" value={formatINR(data.analyticsKpis.totalRevenue)} subtitle="This quarter" icon={TrendingUp} trend="up" color="bg-teal-600" />
            <KpiCard title="Supplier Retention" value={`${data.analyticsKpis.supplierRetention}%`} subtitle="94% retention rate" icon={ShieldCheck} trend="up" color="bg-amber-600" />
            <KpiCard title="Fleet Utilization" value={`${data.analyticsKpis.fleetUtilization}%`} subtitle="Active vehicles" icon={Truck} trend="neutral" color="bg-rose-600" />
            <KpiCard title="Satisfaction" value={`${data.analyticsKpis.customerSatisfaction}/5`} subtitle="Supplier feedback" icon={Star} trend="up" color="bg-indigo-600" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="fmc-chart-card"><CardHeader><CardTitle className="text-sm">Daily Collection Trend</CardTitle></CardHeader><CardContent><div className="h-[220px]"><LineChart data={data.dailyCollectionTrend}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="date" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="pickups" stroke="#3b82f6" strokeWidth={2} /><Line type="monotone" dataKey="delivered" stroke="#059669" strokeWidth={2} /></LineChart></div></CardContent></Card>
            <Card className="fmc-chart-card"><CardHeader><CardTitle className="text-sm">Route Efficiency by Hub</CardTitle></CardHeader><CardContent><div className="h-[220px]"><BarChart data={data.routeEfficiencyData}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="hub" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="efficiency" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
            <Card className="fmc-chart-card"><CardHeader><CardTitle className="text-sm">Supplier Performance</CardTitle></CardHeader><CardContent><div className="h-[220px]"><PieChart><Pie data={data.supplierPerfData} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" label={({ name }) => <span className="text-[9px]">{name}</span>} labelLine={false}>{data.supplierPerfData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></div></CardContent></Card>
            <Card className="fmc-chart-card"><CardHeader><CardTitle className="text-sm">Pickup Time Distribution</CardTitle></CardHeader><CardContent><div className="h-[220px]"><BarChart data={data.pickupTimeDist}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="range" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
            <Card className="fmc-chart-card col-span-1 md:col-span-2"><CardHeader><CardTitle className="text-sm">Cost vs Revenue Trend</CardTitle></CardHeader><CardContent><div className="h-[220px]"><AreaChart data={data.costRevenueData}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="cost" stroke="#e11d48" fill="#e11d48" fillOpacity={0.15} /><Area type="monotone" dataKey="revenue" stroke="#059669" fill="#059669" fillOpacity={0.15} /></AreaChart></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sheet Drawer */}
      <Sheet open={!!(drawerOpen && drawerType)} onOpenChange={(open) => { setDrawerOpen(open); if (!open) setDrawerType(null) }}>
        <SheetContent side="right" className="w-[460px] overflow-y-auto p-0">
          <SheetHeader className="sr-only"><SheetTitle>Detail Drawer</SheetTitle></SheetHeader>

          {drawerType === "order" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white fmc-drawer-header">
                <div className="flex items-center gap-2 mb-2"><Package className="h-5 w-5" /><h3 className="text-lg font-bold">{(selectedItem as unknown as PickupOrder).pickupId}</h3></div>
                <div className="flex flex-wrap items-center gap-2">
                  <PickupStatusBadge status={(selectedItem as unknown as PickupOrder).status} />
                  <PickupTypeBadge type={(selectedItem as unknown as PickupOrder).pickupType} />
                  <CommodityBadge commodity={(selectedItem as unknown as PickupOrder).commodity} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Supplier</span><span className="text-xs font-medium">{(selectedItem as unknown as PickupOrder).supplierName}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Driver</span><span className="text-xs">{(selectedItem as unknown as PickupOrder).driverName}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Vehicle</span><span className="text-xs font-mono">{(selectedItem as unknown as PickupOrder).vehicle} ({(selectedItem as unknown as PickupOrder).vehiclePlate})</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Scheduled</span><span className="text-xs">{(selectedItem as unknown as PickupOrder).scheduledTime}</span></div>
                </div>
                <div className="flex items-center gap-2"><LocationTile location={(selectedItem as unknown as PickupOrder).pickupLocation} /><ChevronRight className="h-3 w-3 text-muted-foreground" /><HubBadge hub={(selectedItem as unknown as PickupOrder).destHub} /></div>
                <div className="flex flex-wrap items-center gap-3"><WeightTile kg={(selectedItem as unknown as PickupOrder).weightKg} /><QuantityTile qty={(selectedItem as unknown as PickupOrder).quantity} /></div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.info("Reassigning", `Reassigning ${(selectedItem as unknown as PickupOrder).pickupId}`); setDrawerOpen(false) }}><RefreshCw className="h-3 w-3" />Reassign</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.success("Tracking", `Live tracking for ${(selectedItem as unknown as PickupOrder).pickupId}`) }}><Navigation className="h-3 w-3" />Track</Button>
                  <Button size="sm" variant="destructive" className="h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.error("Cancelled", `Pickup ${(selectedItem as unknown as PickupOrder).pickupId} cancelled`); setDrawerOpen(false) }}><XCircle className="h-3 w-3" />Cancel Pickup</Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "route" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white fmc-drawer-header">
                <div className="flex items-center gap-2 mb-2"><Route className="h-5 w-5" /><h3 className="text-lg font-bold">{(selectedItem as unknown as RouteRecord).routeId}</h3></div>
                <div className="flex flex-wrap items-center gap-2"><PickupStatusBadge status={(selectedItem as unknown as RouteRecord).status} /><StopCountBadge count={(selectedItem as unknown as RouteRecord).stops} /></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Route Name</span><span className="text-xs font-medium">{(selectedItem as unknown as RouteRecord).name}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Driver</span><span className="text-xs">{(selectedItem as unknown as RouteRecord).driver}</span></div>
                </div>
                <div className="flex flex-wrap items-center gap-3"><DistanceTile km={(selectedItem as unknown as RouteRecord).distanceKm} /><FuelCostTile amount={(selectedItem as unknown as RouteRecord).fuelCost} /></div>
                <TimeVsEstimateTile actual={(selectedItem as unknown as RouteRecord).actualTime} estimate={(selectedItem as unknown as RouteRecord).estTime} />
                <RouteEfficiencyBar pct={(selectedItem as unknown as RouteRecord).efficiency} />
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.info("Optimizing", `Optimizing ${(selectedItem as unknown as RouteRecord).routeId}`); setDrawerOpen(false) }}><BarChart3 className="h-3 w-3" />Optimize</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.success("Reassigned", `Route ${(selectedItem as unknown as RouteRecord).routeId} reassigned`) }}><RefreshCw className="h-3 w-3" />Reassign</Button>
                  <Button size="sm" variant="destructive" className="h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.warning("Closing", `Route ${(selectedItem as unknown as RouteRecord).routeId} closed`); setDrawerOpen(false) }}><XCircle className="h-3 w-3" />Close Route</Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "driver" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white fmc-drawer-header">
                <div className="flex items-center gap-2 mb-2"><Users className="h-5 w-5" /><h3 className="text-lg font-bold">{(selectedItem as unknown as DriverRecord).driverId}</h3></div>
                <div className="flex flex-wrap items-center gap-2"><PickupStatusBadge status={(selectedItem as unknown as DriverRecord).status} /><ShiftBadge shift={(selectedItem as unknown as DriverRecord).shift} /></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Name</span><span className="text-xs font-medium">{(selectedItem as unknown as DriverRecord).name}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Phone</span><span className="text-xs">{(selectedItem as unknown as DriverRecord).phone}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">License</span><span className="text-xs font-mono">{(selectedItem as unknown as DriverRecord).license}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Vehicle</span><span className="text-xs">{(selectedItem as unknown as DriverRecord).vehicleType} ({(selectedItem as unknown as DriverRecord).vehiclePlate})</span></div>
                </div>
                <div className="flex flex-wrap items-center gap-3"><LocationTile location={(selectedItem as unknown as DriverRecord).currentLocation} /><TripCounterBadge trips={(selectedItem as unknown as DriverRecord).tripsToday} /><DriverRatingBadge rating={(selectedItem as unknown as DriverRecord).rating} /><EarningsTile amount={(selectedItem as unknown as DriverRecord).earningsToday} /></div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.success("Trip Assigned", `New trip for ${(selectedItem as unknown as DriverRecord).name}`) }}><Package className="h-3 w-3" />Assign Trip</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.info("Calling", `Calling ${(selectedItem as unknown as DriverRecord).phone}`) }}><Phone className="h-3 w-3" />Contact</Button>
                  <Button size="sm" variant="destructive" className="h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.warning("Deactivated", `Driver ${(selectedItem as unknown as DriverRecord).name} deactivated`); setDrawerOpen(false) }}><XCircle className="h-3 w-3" />Deactivate</Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "supplier" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white fmc-drawer-header">
                <div className="flex items-center gap-2 mb-2"><Building2 className="h-5 w-5" /><h3 className="text-lg font-bold">{(selectedItem as unknown as SupplierRecord).supplierId}</h3></div>
                <div className="flex flex-wrap items-center gap-2"><PickupStatusBadge status={(selectedItem as unknown as SupplierRecord).status} /><SupplierCategoryBadge category={(selectedItem as unknown as SupplierRecord).category} /></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Name</span><span className="text-xs font-medium">{(selectedItem as unknown as SupplierRecord).name}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Contact</span><span className="text-xs">{(selectedItem as unknown as SupplierRecord).contact}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Onboarded</span><span className="text-xs">{(selectedItem as unknown as SupplierRecord).onboardingDate}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Last Pickup</span><span className="text-xs">{(selectedItem as unknown as SupplierRecord).lastPickup}</span></div>
                </div>
                <div className="flex items-center gap-2"><LocationTile location={(selectedItem as unknown as SupplierRecord).location} /><ChevronRight className="h-3 w-3 text-muted-foreground" /><HubBadge hub={(selectedItem as unknown as SupplierRecord).hub} /></div>
                <div className="flex flex-wrap items-center gap-3"><PickupFrequencyBadge freq={(selectedItem as unknown as SupplierRecord).pickupFrequency} /><QuantityTile qty={(selectedItem as unknown as SupplierRecord).avgVolume} /><ComplianceScoreBar score={(selectedItem as unknown as SupplierRecord).complianceScore} /></div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.success("Scheduled", `Pickup scheduled for ${(selectedItem as unknown as SupplierRecord).name}`) }}><CalendarDays className="h-3 w-3" />Schedule Pickup</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.info("Audit", `Audit initiated for ${(selectedItem as unknown as SupplierRecord).name}`) }}><ShieldCheck className="h-3 w-3" />Audit</Button>
                  <Button size="sm" variant="destructive" className="h-8 text-xs gap-1 fmc-action-btn" onClick={() => { toast.warning("Deactivated", `Supplier ${(selectedItem as unknown as SupplierRecord).name} deactivated`); setDrawerOpen(false) }}><XCircle className="h-3 w-3" />Deactivate</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
