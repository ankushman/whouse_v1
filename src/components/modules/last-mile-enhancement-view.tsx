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
  Bike, Battery, CreditCard, Wallet, ThumbsUp, ThumbsDown, Meh,
  MessageSquare, MapPinned, Route as RouteIcon, Gauge, TruckIcon,
  UserCheck, BadgeCheck, ScanBarcode, Percent, CircleDot, ArrowLeftRight,
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
// Enums
// ============================================================================
const DELIVERY_STATUSES = ["Confirmed", "Picked Up", "Out for Delivery", "Delivered", "Failed", "Rescheduled", "Returned", "Cancelled"] as const
const DELIVERY_TYPES = ["Standard", "Express", "Same-Day", "Pickup Point"] as const
const PAYMENT_MODES = ["COD", "UPI", "Prepaid", "Pickup Point"] as const
const VEHICLE_TYPES = ["Bike", "Scooter", "E-Rickshaw", "Van"] as const
const TRAFFIC_CONDITIONS = ["Light", "Moderate", "Heavy", "Jam"] as const
const ROUTE_STATUSES = ["Active", "Completed", "Delayed", "Cancelled", "In Progress", "Optimized", "Failed", "Reassigned"] as const
const COMPLAINT_CATEGORIES = ["Late Delivery", "Damaged Product", "Wrong Item", "Missing Item", "Rude Agent", "Payment Issue"] as const
const SENTIMENTS = ["Positive", "Neutral", "Negative"] as const
const AGENT_SHIFTS = ["Morning", "Evening", "Night"] as const
const DELIVERY_ZONES = ["Zone North", "Zone South", "Zone East", "Zone West", "Zone Central", "Zone Harbour", "Zone Suburban", "Zone Tech Park"] as const
const INDIAN_CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"] as const
const INDIAN_PINCODES = ["400001", "400051", "400076", "400060", "110001", "110045", "110092", "110053", "560001", "560034", "560076", "560100", "600001", "600034", "600096", "600107", "500001", "500034", "500072", "500081", "411001", "411038", "411057", "411014", "700001", "700034", "700091", "700107", "380001", "380015", "380052", "380060"] as const
const CUSTOMER_NAMES = [
  "Arjun Mehta", "Priya Sharma", "Rahul Verma", "Sneha Patel", "Vikram Singh",
  "Ananya Reddy", "Karthik Rajan", "Deepika Nair", "Rohit Gupta", "Meera Iyer",
  "Amit Joshi", "Pooja Das", "Suresh Kumar", "Kavita Rao", "Manish Tiwari",
  "Divya Menon", "Sanjay Verma", "Neha Saxena", "Rajesh Pillai", "Swati Kulkarni",
  "Prateek Dubey", "Anjali Mishra", "Vivek Nair", "Shalini Gupta", "Harish Chauhan",
  "Ritu Bhat", "Arun Kapoor", "Suman Devi", "Gaurav Hegde", "Pallavi Desai",
  "Nikhil Sharma", "Rashmi Pandey", "Ashok Yadav", "Bhavna Soni", "Dinesh Rao",
  "Lakshmi Iyer", "Prakash Jha", "Sunita Kumari", "Vinay Kulkarni", "Madhuri Deshmukh",
  "Tarun Grover", "Kirti Singh", "Sunil Bhatt", "Asha Bhosle", "Ramesh Agarwal",
  "Geeta Devi", "Chirag Mehta", "Preeti Kapoor", "Manoj Kumar", "Sarita Verma",
  "Alok Ranjan", "Nisha Goyal", "Rajiv Menon", "Kamini Sharma", "Yogesh Patil",
  "Sangita Rao", "Atul Bhat", "Prachi Jain", "Dilip Shukla", "Anita Kulkarni",
  "Sanjeev Pandey", "Rekha Singh", "Umesh Tiwari", "Kavita Menon", "Hemant Joshi",
  "Sweta Dubey", "Mukesh Gupta", "Alka Verma", "Prabhu Nair", "Chhaya Das",
] as const
const AGENT_NAMES = [
  "Suresh Yadav", "Mohan Singh", "Raju Koli", "Amit Tiwari", "Dinesh Patel",
  "Ramesh Kumar", "Sunil Gaikwad", "Vijay Jadhav", "Arjun Bhosle", "Ganesh Patil",
  "Nitin Sharma", "Prakash Rao", "Harish Mehta", "Santosh Desai", "Manoj Pawar",
  "Kishan Reddy", "Thiru Murugan", "Sekhar Babu", "Ravi Teja", "Srikanth Goud",
  "Deepak Chavan", "Sachin Kadam", "Arun Sawant", "Gajanan More", "Balasaheb Jadhav",
  "Pradeep Shinde", "Vasant Dalvi", "Nandu Bhoir", "Eknath Patil", "Rajan Sonawane",
  "Bharat Kulkarni", "Gopal Rane", "Datta Joshi", "Uddhav Thakur", "Shankar Wagh",
  "Anil Mhatre", "Milind Patil", "Sanjay Salvi", "Rajendra Nikam", "Mahesh Deshmukh",
  "Subhash Pawar", "Ramesh Chavan", "Narayan Jadhav", "Vilas Shinde", "Madhav Dani",
  "Prakash Ingle", "Satish Kadam", "Dilip Kulkarni", "Anand Desai", "Suresh Mane",
  "Ganesh Kulkarni", "Vitthal Patil", "Dnyaneshwar More", "Bapurao Jadhav", "Eknath Shinde",
  "Laxman Dalvi", "Sambhaji Rane", "Abhay Sawant", "Devendra Patil", "Nitin Deshmukh",
] as const
const INDIAN_ADDRESSES = [
  "Flat 301, Green Towers, Andheri West", "H.No 42, Lajpat Nagar, South Delhi", "Apt 12B, Koramangala 4th Block",
  "Plot 7, T Nagar Main Road", "Flat 5A, Jubilee Hills Road 36", "7/12, Koregaon Park Lane 5",
  "21B, Salt Lake Sector V", "Shop 3, CG Road Navrangpura", "Flat 102, Powai Lake Homes",
  "H.No 88, Dwarka Sector 21", "Apt 3C, HSR Layout 27th Main", "42, Anna Nagar East",
  "Flat 8, Banjara Hills Road 10", "15/2, Viman Nagar", "Plot 19, Behala Chowrasta",
  "Flat 201, Lower Parel West", "H.No 55, Rohini Sector 7", "6A, JP Nagar Phase 6",
  "34, Adyar 20th Street", "Flat 2D, Madhapur", "12/1, Kothrud Depur",
  "Flat 7, Shyambazar", "89, Satellite Road", "Flat 501, Worli Sea Face",
  "H.No 101, GTB Nagar", "Apt 8, Whitefield Main Road", "Flat 15, Velachery Main Road",
  "Plot 3, Gachibowli", "H.No 67, Aundh", "21A, New Alipore",
] as const

// ============================================================================
// Color Maps
// ============================================================================
const STATUS_COLORS: Record<string, string> = {
  "Confirmed": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Picked Up": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Out for Delivery": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Delivered": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Failed": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 lme-status-pulse-failed",
  "Rescheduled": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Returned": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Cancelled": "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
}
const TYPE_COLORS: Record<string, string> = {
  "Standard": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "Express": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Same-Day": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Pickup Point": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
}
const PAYMENT_COLORS: Record<string, string> = {
  "COD": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "UPI": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Prepaid": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Pickup Point": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
}
const VEHICLE_COLORS: Record<string, string> = {
  "Bike": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Scooter": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "E-Rickshaw": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Van": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
}
const VEHICLE_EMOJIS: Record<string, string> = {
  "Bike": "🏍", "Scooter": "🛵", "E-Rickshaw": "🚛", "Van": "🚐",
}
const TRAFFIC_COLORS: Record<string, string> = {
  "Light": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Moderate": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Heavy": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Jam": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 lme-status-pulse-failed",
}
const COMPLAINT_COLORS: Record<string, string> = {
  "Late Delivery": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Damaged Product": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Wrong Item": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Missing Item": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Rude Agent": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Payment Issue": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
}
const SENTIMENT_COLORS: Record<string, string> = {
  "Positive": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Neutral": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "Negative": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}
const ZONE_COLORS: Record<string, string> = {
  "Zone North": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Zone South": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Zone East": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Zone West": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Zone Central": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Zone Harbour": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Zone Suburban": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Zone Tech Park": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
}
const SHIFT_COLORS: Record<string, string> = {
  "Morning": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Evening": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Night": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
}
const ROUTE_STATUS_COLORS: Record<string, string> = {
  "Active": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 lme-status-pulse-active",
  "Completed": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Delayed": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 lme-status-pulse-warning",
  "Cancelled": "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
  "In Progress": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 lme-status-pulse-active",
  "Optimized": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Failed": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 lme-status-pulse-failed",
  "Reassigned": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
}
const CHART_COLORS = ["#7c3aed", "#059669", "#ea580c", "#e11d48", "#0891b2", "#d97706", "#6366f1", "#14b8a6"]

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const statuses = DELIVERY_STATUSES
  const types = DELIVERY_TYPES
  const payments = PAYMENT_MODES
  const vehicles = VEHICLE_TYPES
  const traffic = TRAFFIC_CONDITIONS
  const routeStatuses = ROUTE_STATUSES
  const complaints = COMPLAINT_CATEGORIES
  const sentiments = SENTIMENTS
  const shifts = AGENT_SHIFTS
  const zones = DELIVERY_ZONES
  const cities = INDIAN_CITIES
  const pincodes = INDIAN_PINCODES
  const customers = CUSTOMER_NAMES
  const agents = AGENT_NAMES
  const addresses = INDIAN_ADDRESSES

  // Dashboard KPI data
  const kpis = {
    totalDeliveries: 1247, successful: 1089, failed: 52, avgTime: 42,
    activeAgents: 186, codCollections: formatINR(1856000), satisfaction: 4.3,
    routeEfficiency: 87.2,
  }

  // Daily delivery chart (14 days)
  const dailyDeliveries = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    Successful: ri(80, 120, i * 7 + 1),
    Failed: ri(3, 12, i * 7 + 2),
    InTransit: ri(15, 35, i * 7 + 3),
  }))

  // City-wise deliveries
  const cityDeliveries = cities.map((city, i) => ({
    city,
    Deliveries: ri(120, 280, i * 11 + 100),
    Returns: ri(5, 25, i * 11 + 101),
  }))

  // Delivery type pie
  const deliveryTypeData = types.map((t, i) => ({
    name: t,
    value: ri(80, 350, i * 13 + 200),
  }))

  // Delivery orders
  const orders = Array.from({ length: 75 }, (_, i) => {
    const s = i * 17 + 300
    const status = pick(statuses, s)
    return {
      id: `LME-${String(10000 + i).slice(1)}`,
      customer: pick(customers, s + 1),
      address: pick(addresses, s + 2),
      city: pick(cities, s + 3),
      pincode: pick(pincodes, s + 4),
      status,
      type: pick(types, s + 5),
      payment: pick(payments, s + 6),
      weight: `${(seededRandom(s + 7) * 9.5 + 0.5).toFixed(1)} kg`,
      dimensions: `${ri(10, 60, s + 8)}×${ri(10, 40, s + 9)}×${ri(5, 30, s + 10)} cm`,
      agent: pick(agents, s + 11),
      amount: formatINR(ri(150, 5000, s + 12)),
      eta: `${ri(8, 22, s + 13)}:${String(ri(0, 59, s + 14)).padStart(2, "0")}`,
      createdAt: `${ri(1, 28, s + 15)}/${ri(1, 12, s + 16)}/2025`,
    }
  })

  // Delivery agents
  const deliveryAgents = Array.from({ length: 60 }, (_, i) => {
    const s = i * 19 + 500
    const vehicle = pick(vehicles, s)
    const isEV = vehicle === "E-Rickshaw"
    return {
      id: `DA-${String(1000 + i).slice(1)}`,
      name: pick(agents, s + 1),
      vehicle,
      zone: pick(zones, s + 2),
      shift: pick(shifts, s + 3),
      rating: +(seededRandom(s + 4) * 2 + 3).toFixed(1),
      completed: ri(20, 250, s + 5),
      earnings: formatINR(ri(8000, 45000, s + 6)),
      batteryLevel: isEV ? ri(15, 100, s + 7) : null,
      onTimePct: ri(70, 99, s + 8),
      phone: `+91 ${ri(7000, 9999, s + 9)}${ri(100000, 999999, s + 10)}`,
      activeOrders: ri(0, 8, s + 11),
      todayDelivered: ri(5, 30, s + 12),
    }
  })

  // Routes
  const routes = Array.from({ length: 55 }, (_, i) => {
    const s = i * 23 + 800
    const st = pick(routeStatuses, s)
    const waypoints = ri(4, 18, s + 1)
    const dist = +(seededRandom(s + 2) * 40 + 5).toFixed(1)
    const estTime = ri(20, 180, s + 3)
    const actTime = st === "Completed" ? ri(Math.max(15, estTime - 30), estTime + 45, s + 4) : null
    return {
      id: `RT-${String(5000 + i).slice(1)}`,
      route: `${pick(cities, s + 5)} → ${pick(addresses, s + 6).split(",")[0]}`,
      agent: pick(agents, s + 7),
      status: st,
      waypoints,
      distance: `${dist} km`,
      distanceNum: dist,
      estimatedTime: `${estTime} min`,
      actualTime: actTime !== null ? `${actTime} min` : "—",
      fuelCost: formatINR(ri(50, 500, s + 8)),
      efficiency: ri(65, 99, s + 9),
      traffic: pick(traffic, s + 10),
      stops: ri(4, 20, s + 11),
      created: `${ri(1, 28, s + 12)}/${ri(1, 12, s + 13)}/2025`,
    }
  })

  // Customer feedback
  const feedback = Array.from({ length: 65 }, (_, i) => {
    const s = i * 29 + 1200
    const nps = ri(1, 10, s)
    const sentiment = nps >= 9 ? "Positive" as const : nps >= 7 ? "Neutral" as const : "Negative" as const
    return {
      id: `FB-${String(4000 + i).slice(1)}`,
      customer: pick(customers, s + 1),
      city: pick(cities, s + 2),
      nps,
      sentiment,
      speed: ri(1, 5, s + 3),
      packaging: ri(1, 5, s + 4),
      agentBehavior: ri(1, 5, s + 5),
      communication: ri(1, 5, s + 6),
      complaint: pick(complaints, s + 7),
      deliveryStatus: pick(statuses.filter(x => x !== "Confirmed" && x !== "Picked Up"), s + 8),
      agent: pick(agents, s + 9),
      orderId: `LME-${String(ri(1000, 1074, s + 10)).slice(1)}`,
      date: `${ri(1, 28, s + 11)}/${ri(1, 12, s + 12)}/2025`,
    }
  })

  // Analytics
  const analyticsKpis = {
    avgDeliveryTime: "38 min", successRate: "94.2%", failedRate: "3.8%",
    avgNPS: 8.1, codRatio: "32%", avgEarnings: "₹18.5K",
    avgEfficiency: "86.4%", dailyCapacity: "1,450",
  }
  const dailyPerformance = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    Deliveries: ri(100, 200, i * 31 + 2000),
    OnTime: ri(85, 120, i * 31 + 2001),
    Returns: ri(2, 15, i * 31 + 2002),
  }))
  const zoneEfficiency = zones.map((z, i) => ({
    zone: z,
    Efficiency: ri(70, 98, i * 37 + 2100),
    Deliveries: ri(50, 180, i * 37 + 2101),
  }))
  const paymentDistribution = payments.map((p, i) => ({
    mode: p,
    count: ri(150, 600, i * 41 + 2200),
  }))
  const complaintDistribution = complaints.map((c, i) => ({
    category: c,
    count: ri(5, 80, i * 43 + 2300),
  }))
  const costRevenueData = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    Revenue: ri(800000, 1500000, i * 47 + 2400),
    Cost: ri(400000, 900000, i * 47 + 2401),
    Profit: ri(200000, 600000, i * 47 + 2402),
  }))

  return {
    kpis, dailyDeliveries, cityDeliveries, deliveryTypeData, orders, deliveryAgents,
    routes, feedback, analyticsKpis, dailyPerformance, zoneEfficiency,
    paymentDistribution, complaintDistribution, costRevenueData,
  }
}

// ============================================================================
// Unique Visual Components
// ============================================================================
function DeliveryStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>
      {(status === "Out for Delivery" || status === "In Progress") && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" /></span>}
      {status === "Failed" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" /></span>}
      {status === "Delayed" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" /></span>}
      {status}
    </span>
  )
}

function DeliveryTypeBadge({ type }: { type: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", TYPE_COLORS[type] || "")}>{type}</span>
}

function PaymentModeBadge({ mode }: { mode: string }) {
  const icons: Record<string, string> = { "COD": "💵", "UPI": "📱", "Prepaid": "💳", "Pickup Point": "🏪" }
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", PAYMENT_COLORS[mode] || "")}>
      {icons[mode]} {mode}
    </span>
  )
}

function AgentRatingBadge({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i < full ? "fill-amber-400 text-amber-400" : i === full && half ? "fill-amber-300 text-amber-300" : "text-gray-300 dark:text-gray-600")} />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-700 dark:text-gray-300">{rating}</span>
    </span>
  )
}

function VehicleTypeBadge({ type }: { type: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", VEHICLE_COLORS[type] || "")}>
      {VEHICLE_EMOJIS[type]} {type}
    </span>
  )
}

function BatteryLevelBar({ level }: { level: number }) {
  const color = level >= 70 ? "from-emerald-400 to-emerald-500" : level >= 40 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"
  return (
    <div className="flex items-center gap-2">
      <div className="lme-battery-bar h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r", color)} style={{ width: `${level}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{level}%</span>
    </div>
  )
}

function NPSBadge({ score }: { score: number }) {
  const color = score >= 9 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : score >= 7 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
  const label = score >= 9 ? "Promoter" : score >= 7 ? "Passive" : "Detractor"
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", color)}>{score} · {label}</span>
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const icons: Record<string, React.ReactNode> = {
    "Positive": <ThumbsUp className="h-3.5 w-3.5" />,
    "Neutral": <Meh className="h-3.5 w-3.5" />,
    "Negative": <ThumbsDown className="h-3.5 w-3.5" />,
  }
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", SENTIMENT_COLORS[sentiment] || "")}>
      {icons[sentiment]} {sentiment}
    </span>
  )
}

function ComplaintCategoryBadge({ category }: { category: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", COMPLAINT_COLORS[category] || "")}>{category}</span>
}

function ZoneBadge({ zone }: { zone: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", ZONE_COLORS[zone] || "")}>{zone}</span>
}

function ShiftBadge({ shift }: { shift: string }) {
  const icons: Record<string, string> = { "Morning": "🌅", "Evening": "🌆", "Night": "🌙" }
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", SHIFT_COLORS[shift] || "")}>
      {icons[shift]} {shift}
    </span>
  )
}

function EarningsTile({ amount }: { amount: string }) {
  return (
    <div className="lme-tile-earnings flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20">
      <IndianRupee className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{amount}</span>
    </div>
  )
}

function DistanceTile({ distance }: { distance: string }) {
  return (
    <div className="lme-tile-distance flex items-center gap-1.5 rounded-md bg-cyan-50 px-2 py-1 dark:bg-cyan-900/20">
      <Navigation className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
      <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300">{distance}</span>
    </div>
  )
}

function EfficiencyScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? "from-emerald-400 to-emerald-500" : score >= 65 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"
  return (
    <div className="flex items-center gap-2">
      <div className="lme-efficiency-bar h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r transition-all", color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{score}%</span>
    </div>
  )
}

function TrafficConditionBadge({ condition }: { condition: string }) {
  const colors: Record<string, string> = { "Light": "🟢", "Moderate": "🟡", "Heavy": "🟠", "Jam": "🔴" }
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold", TRAFFIC_COLORS[condition] || "")}>
      {colors[condition]} {condition}
    </span>
  )
}

function OnTimePercentageBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? "from-emerald-400 to-emerald-500" : pct >= 75 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"
  return (
    <div className="flex items-center gap-2">
      <div className="lme-ontime-bar h-2.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{pct}%</span>
    </div>
  )
}

function CODCollectionTile({ amount }: { amount: string }) {
  return (
    <div className="lme-tile-cod flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 dark:bg-amber-900/20">
      <Wallet className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">{amount}</span>
    </div>
  )
}

function DeliveryTimeTile({ estimated, actual }: { estimated: string; actual: string }) {
  return (
    <div className="lme-tile-time flex items-center gap-2 rounded-md bg-violet-50 px-2 py-1 dark:bg-violet-900/20">
      <Timer className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
      <span className="text-xs text-violet-600 dark:text-violet-300">{estimated}</span>
      <ArrowLeftRight className="h-3 w-3 text-gray-400" />
      <span className={cn("text-xs font-semibold", actual === "—" ? "text-gray-400" : "text-violet-700 dark:text-violet-200")}>{actual}</span>
    </div>
  )
}

function WeightDimensionTile({ weight, dimensions }: { weight: string; dimensions: string }) {
  return (
    <div className="lme-tile-weight flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
      <Weight className="h-3.5 w-3.5" /> {weight}
      <Separator orientation="vertical" className="h-3" />
      <Boxes className="h-3.5 w-3.5" /> {dimensions}
    </div>
  )
}

function RouteStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", ROUTE_STATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>
      {(status === "Active" || status === "In Progress") && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" /></span>}
      {status === "Failed" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" /></span>}
      {status}
    </span>
  )
}

function WaypointCountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
      <RouteIcon className="h-3 w-3" /> {count} stops
    </span>
  )
}

function CustomerNameTile({ name, city, pincode }: { name: string; city: string; pincode: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{name}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{city} · {pincode}</span>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-3 w-3", i < full ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600")} />
      ))}
      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{rating}</span>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export default function LastMileEnhancementView() {
  const [activeTab, setActiveTab] = useState("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<typeof data.orders[0] | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<typeof data.deliveryAgents[0] | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<typeof data.routes[0] | null>(null)
  const [selectedFeedback, setSelectedFeedback] = useState<typeof data.feedback[0] | null>(null)
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
      <div className={cn("flex items-center gap-1 transition-all", sortCol === col ? "font-bold text-violet-700 dark:text-violet-300 scale-105" : "hover:text-violet-600")}>
        {children} {sortCol === col && (sortAsc ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
      </div>
    </TableHead>
  )

  const kpis = [
    { label: "Total Deliveries", value: data.kpis.totalDeliveries.toLocaleString(), icon: PackageCheck, color: "from-violet-500 to-violet-600", change: "+12%" },
    { label: "Successful", value: data.kpis.successful.toLocaleString(), icon: CheckCircle2, color: "from-emerald-500 to-emerald-600", change: "+8%" },
    { label: "Failed Attempts", value: data.kpis.failed.toString(), icon: XCircle, color: "from-rose-500 to-rose-600", change: "-15%" },
    { label: "Avg Delivery Time", value: `${data.kpis.avgTime} min`, icon: Timer, color: "from-cyan-500 to-cyan-600", change: "-5%" },
    { label: "Active Agents", value: data.kpis.activeAgents.toString(), icon: Users, color: "from-amber-500 to-amber-600", change: "+3" },
    { label: "COD Collections", value: data.kpis.codCollections, icon: Wallet, color: "from-orange-500 to-orange-600", change: "+18%" },
    { label: "Satisfaction", value: `${data.kpis.satisfaction}/5`, icon: Star, color: "from-indigo-500 to-indigo-600", change: "+0.2" },
    { label: "Route Efficiency", value: `${data.kpis.routeEfficiency}%`, icon: Gauge, color: "from-teal-500 to-teal-600", change: "+4%" },
  ]

  const filteredOrders = sortData(
    data.orders.filter(o =>
      !searchTerm || o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.city.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    searchTerm ? "id" : sortCol || "id"
  )

  const filteredAgents = sortData(
    data.deliveryAgents.filter(a =>
      !searchTerm || a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.zone.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    sortCol || "name"
  )

  const filteredRoutes = sortData(data.routes, sortCol || "id")

  const filteredFeedback = sortData(data.feedback, sortCol || "nps")

  const analyticsKpiList = [
    { label: "Avg Delivery Time", value: data.analyticsKpis.avgDeliveryTime, icon: Timer, color: "from-violet-500 to-violet-600" },
    { label: "Success Rate", value: data.analyticsKpis.successRate, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
    { label: "Failed Rate", value: data.analyticsKpis.failedRate, icon: XCircle, color: "from-rose-500 to-rose-600" },
    { label: "Avg NPS Score", value: data.analyticsKpis.avgNPS.toString(), icon: Star, color: "from-amber-500 to-amber-600" },
    { label: "COD Ratio", value: data.analyticsKpis.codRatio, icon: Wallet, color: "from-orange-500 to-orange-600" },
    { label: "Avg Earnings", value: data.analyticsKpis.avgEarnings, icon: IndianRupee, color: "from-cyan-500 to-cyan-600" },
    { label: "Avg Efficiency", value: data.analyticsKpis.avgEfficiency, icon: Gauge, color: "from-indigo-500 to-indigo-600" },
    { label: "Daily Capacity", value: data.analyticsKpis.dailyCapacity, icon: Package, color: "from-teal-500 to-teal-600" },
  ]

  return (
    <div className="lme-container space-y-4">
      <PageHeader title="Last-Mile Delivery Enhancement" description="Advanced last-mile delivery operations for Indian e-commerce & D2C brands" />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="lme-tabs-list bg-gray-100 dark:bg-gray-800">
          {["Delivery Dashboard", "Delivery Orders", "Delivery Agents", "Route & Optimization", "Customer Experience", "Delivery Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="lme-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ===== Tab 0: Dashboard ===== */}
        <TabsContent value="0" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className="lme-kpi-card relative overflow-hidden border-l-4" style={{ borderLeftColor: k.color.includes("violet") ? "#7c3aed" : k.color.includes("emerald") ? "#059669" : k.color.includes("rose") ? "#e11d48" : k.color.includes("cyan") ? "#0891b2" : k.color.includes("amber") ? "#d97706" : k.color.includes("orange") ? "#ea580c" : k.color.includes("indigo") ? "#6366f1" : "#14b8a6" }}>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80" style={{ background: `linear-gradient(90deg, ${k.color.includes("violet") ? "#7c3aed" : "#059669"}, ${k.color.includes("violet") ? "#6366f1" : "#0891b2"})` }} />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{k.label}</p>
                      <p className="lme-kpi-value mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{k.value}</p>
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{k.change}</p>
                    </div>
                    <div className={cn("lme-kpi-icon flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md", k.color)}>
                      <k.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="lme-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Daily Deliveries</CardTitle></CardHeader><CardContent><AreaChart data={data.dailyDeliveries}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="Successful" stackId="1" stroke="#059669" fill="#05966980" /><Area type="monotone" dataKey="Failed" stackId="1" stroke="#e11d48" fill="#e11d4880" /><Area type="monotone" dataKey="InTransit" stackId="1" stroke="#7c3aed" fill="#7c3aed80" /></AreaChart></CardContent></Card>
            <Card className="lme-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">City-wise Deliveries</CardTitle></CardHeader><CardContent><BarChart data={data.cityDeliveries}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="Deliveries" fill="#7c3aed" /><Bar dataKey="Returns" fill="#ea580c" /></BarChart></CardContent></Card>
            <Card className="lme-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Delivery Types</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.deliveryTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{data.deliveryTypeData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        {/* ===== Tab 1: Delivery Orders ===== */}
        <TabsContent value="1" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search orders by customer, ID or city..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); toast.info("Filters cleared", "All filters have been reset") }}>Clear</Button>
          </div>
          <Card className="lme-table-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="id">Order ID</SortHeader>
                  <TableHead>Customer</TableHead>
                  <SortHeader col="status">Status</SortHeader>
                  <SortHeader col="type">Type</SortHeader>
                  <TableHead>Payment</TableHead>
                  <TableHead>Weight/Dim</TableHead>
                  <SortHeader col="amount">Amount</SortHeader>
                  <TableHead>Agent</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredOrders.slice(0, 25).map((o, i) => (
                    <TableRow key={o.id} className={cn("lme-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-violet-50/50 dark:hover:bg-violet-950/20")}>
                      <TableCell className="font-mono text-xs font-medium">{o.id}</TableCell>
                      <TableCell><CustomerNameTile name={o.customer} city={o.city} pincode={o.pincode} /></TableCell>
                      <TableCell><DeliveryStatusBadge status={o.status} /></TableCell>
                      <TableCell><DeliveryTypeBadge type={o.type} /></TableCell>
                      <TableCell><PaymentModeBadge mode={o.payment} /></TableCell>
                      <TableCell><WeightDimensionTile weight={o.weight} dimensions={o.dimensions} /></TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{o.amount}</TableCell>
                      <TableCell className="text-xs">{o.agent}</TableCell>
                      <TableCell className="text-xs text-gray-500">{o.eta}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="lme-action-btn" onClick={() => { setSelectedOrder(o); toast.info("Order Details", `Viewing ${o.id}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Tab 2: Delivery Agents ===== */}
        <TabsContent value="2" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search agents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAgents.slice(0, 30).map(a => (
              <Card key={a.id} className="lme-agent-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="h-1 bg-gradient-to-r from-violet-500 to-emerald-500" />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{a.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{a.id} · {a.phone}</p>
                    </div>
                    <div className="flex gap-1">
                      <VehicleTypeBadge type={a.vehicle} />
                      <ShiftBadge shift={a.shift} />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <ZoneBadge zone={a.zone} />
                    <AgentRatingBadge rating={a.rating} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-md bg-gray-50 p-2 text-center dark:bg-gray-800">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{a.completed}</p>
                      <p className="text-xs text-gray-500">Delivered</p>
                    </div>
                    <div className="rounded-md bg-gray-50 p-2 text-center dark:bg-gray-800">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{a.todayDelivered}</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <EarningsTile amount={a.earnings} />
                    {a.batteryLevel !== null && <BatteryLevelBar level={a.batteryLevel} />}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">On-time</span>
                    <OnTimePercentageBar pct={a.onTimePct} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="lme-action-btn flex-1 text-xs" onClick={() => { setSelectedAgent(a); toast.info("Agent Profile", `Viewing ${a.name}`) }}>View Details</Button>
                    <Button size="sm" className="lme-action-btn flex-1 bg-violet-600 text-xs hover:bg-violet-700" onClick={() => toast.success("Assignment", `${a.name} assigned new orders`)}>Assign</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ===== Tab 3: Routes ===== */}
        <TabsContent value="3" className="space-y-4">
          <Card className="lme-table-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="id">Route ID</SortHeader>
                  <TableHead>Route</TableHead>
                  <SortHeader col="status">Status</SortHeader>
                  <TableHead>Stops</TableHead>
                  <SortHeader col="distance">Distance</SortHeader>
                  <TableHead>Time (Est → Act)</TableHead>
                  <SortHeader col="efficiency">Efficiency</SortHeader>
                  <TableHead>Traffic</TableHead>
                  <SortHeader col="fuelCost">Fuel Cost</SortHeader>
                  <TableHead>Agent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredRoutes.slice(0, 25).map((r, i) => (
                    <TableRow key={r.id} className={cn("lme-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-violet-50/50 dark:hover:bg-violet-950/20")}>
                      <TableCell className="font-mono text-xs font-medium">{r.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs">{r.route}</TableCell>
                      <TableCell><RouteStatusBadge status={r.status} /></TableCell>
                      <TableCell><WaypointCountBadge count={r.waypoints} /></TableCell>
                      <TableCell><DistanceTile distance={r.distance} /></TableCell>
                      <TableCell><DeliveryTimeTile estimated={r.estimatedTime} actual={r.actualTime} /></TableCell>
                      <TableCell><EfficiencyScoreBar score={r.efficiency} /></TableCell>
                      <TableCell><TrafficConditionBadge condition={r.traffic} /></TableCell>
                      <TableCell className="text-xs font-semibold">{r.fuelCost}</TableCell>
                      <TableCell className="text-xs">{r.agent}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="lme-action-btn" onClick={() => { setSelectedRoute(r); toast.info("Route Details", `Viewing ${r.id}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Tab 4: Customer Experience ===== */}
        <TabsContent value="4" className="space-y-4">
          <Card className="lme-table-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="nps">NPS</SortHeader>
                  <TableHead>Customer</TableHead>
                  <SortHeader col="sentiment">Sentiment</SortHeader>
                  <TableHead>Speed</TableHead>
                  <TableHead>Packaging</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Communication</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredFeedback.slice(0, 25).map((f, i) => (
                    <TableRow key={f.id} className={cn("lme-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-violet-50/50 dark:hover:bg-violet-950/20")}>
                      <TableCell><NPSBadge score={f.nps} /></TableCell>
                      <TableCell><span className="text-sm font-medium">{f.customer}</span></TableCell>
                      <TableCell><SentimentBadge sentiment={f.sentiment} /></TableCell>
                      <TableCell><StarRating rating={f.speed} /></TableCell>
                      <TableCell><StarRating rating={f.packaging} /></TableCell>
                      <TableCell><StarRating rating={f.agentBehavior} /></TableCell>
                      <TableCell><StarRating rating={f.communication} /></TableCell>
                      <TableCell><ComplaintCategoryBadge category={f.complaint} /></TableCell>
                      <TableCell className="text-xs">{f.city}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="lme-action-btn" onClick={() => { setSelectedFeedback(f); toast.info("Feedback", `Viewing feedback for ${f.customer}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Tab 5: Analytics ===== */}
        <TabsContent value="5" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {analyticsKpiList.map((k, i) => (
              <Card key={i} className="lme-analytics-card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("lme-analytics-icon flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", k.color)}><k.icon className="h-4.5 w-4.5" /></div>
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
            <Card className="lme-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Daily Performance</CardTitle></CardHeader><CardContent><LineChart data={data.dailyPerformance}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="Deliveries" stroke="#7c3aed" strokeWidth={2} /><Line type="monotone" dataKey="OnTime" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="Returns" stroke="#e11d48" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="lme-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Zone Efficiency</CardTitle></CardHeader><CardContent><BarChart data={data.zoneEfficiency} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="zone" type="category" tick={{ fontSize: 10 }} width={90} /><Tooltip /><Bar dataKey="Efficiency" fill="#7c3aed" /></BarChart></CardContent></Card>
            <Card className="lme-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Payment Mode Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.paymentDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({ mode, percent }: { mode: string; percent: number }) => `${mode} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{data.paymentDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="lme-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Complaint Categories</CardTitle></CardHeader><CardContent><BarChart data={data.complaintDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill="#e11d48" /></BarChart></CardContent></Card>
          </div>
          <Card className="lme-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Cost vs Revenue (6-Month)</CardTitle></CardHeader><CardContent><AreaChart data={data.costRevenueData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => formatINR(v)} /><Area type="monotone" dataKey="Revenue" stackId="1" stroke="#7c3aed" fill="#7c3aed80" /><Area type="monotone" dataKey="Cost" stackId="1" stroke="#e11d48" fill="#e11d4880" /><Area type="monotone" dataKey="Profit" stackId="1" stroke="#059669" fill="#05966980" /></AreaChart></CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* ===== Sheet: Order Details ===== */}
      <Sheet open={!!selectedOrder} onOpenChange={open => { if (!open) setSelectedOrder(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
                <SheetTitle className="text-white flex items-center gap-2"><PackageCheck className="h-5 w-5" /> Order {selectedOrder.id}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Status</p><DeliveryStatusBadge status={selectedOrder.status} /></div>
                  <div><p className="text-xs text-gray-500">Type</p><DeliveryTypeBadge type={selectedOrder.type} /></div>
                  <div><p className="text-xs text-gray-500">Payment</p><PaymentModeBadge mode={selectedOrder.payment} /></div>
                  <div><p className="text-xs text-gray-500">Amount</p><span className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedOrder.amount}</span></div>
                </div>
                <Separator />
                <div><p className="text-xs text-gray-500 mb-1">Customer</p><p className="text-sm font-semibold">{selectedOrder.customer}</p><p className="text-xs text-gray-500">{selectedOrder.address}, {selectedOrder.city} - {selectedOrder.pincode}</p></div>
                <Separator />
                <div><p className="text-xs text-gray-500 mb-1">Package</p><WeightDimensionTile weight={selectedOrder.weight} dimensions={selectedOrder.dimensions} /></div>
                <div className="grid grid-cols-2 gap-3"><div><p className="text-xs text-gray-500">Agent</p><p className="text-sm font-medium">{selectedOrder.agent}</p></div><div><p className="text-xs text-gray-500">ETA</p><p className="text-sm font-medium">{selectedOrder.eta}</p></div></div>
                <div className="flex gap-2 pt-2">
                  <Button className="lme-action-btn flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => toast.success("Updated", `Order ${selectedOrder.id} status updated`)}>Update Status</Button>
                  <Button variant="outline" className="lme-action-btn" onClick={() => toast.info("Assigned", `Reassigning ${selectedOrder.id}`)}>Reassign</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ===== Sheet: Agent Details ===== */}
      <Sheet open={!!selectedAgent} onOpenChange={open => { if (!open) setSelectedAgent(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedAgent && (
            <>
              <SheetHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
                <SheetTitle className="text-white flex items-center gap-2"><Users className="h-5 w-5" /> {selectedAgent.name}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">ID</p><p className="font-mono text-sm">{selectedAgent.id}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm">{selectedAgent.phone}</p></div>
                  <div><p className="text-xs text-gray-500">Vehicle</p><VehicleTypeBadge type={selectedAgent.vehicle} /></div>
                  <div><p className="text-xs text-gray-500">Shift</p><ShiftBadge shift={selectedAgent.shift} /></div>
                  <div><p className="text-xs text-gray-500">Zone</p><ZoneBadge zone={selectedAgent.zone} /></div>
                  <div><p className="text-xs text-gray-500">Rating</p><AgentRatingBadge rating={selectedAgent.rating} /></div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800"><p className="text-2xl font-bold">{selectedAgent.completed}</p><p className="text-xs text-gray-500">Total Delivered</p></div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800"><p className="text-2xl font-bold">{selectedAgent.todayDelivered}</p><p className="text-xs text-gray-500">Today</p></div>
                </div>
                <div className="flex items-center justify-between"><span className="text-xs text-gray-500">Earnings</span><EarningsTile amount={selectedAgent.earnings} /></div>
                {selectedAgent.batteryLevel !== null && <div className="flex items-center justify-between"><span className="text-xs text-gray-500">Battery</span><BatteryLevelBar level={selectedAgent.batteryLevel} /></div>}
                <div className="flex items-center justify-between"><span className="text-xs text-gray-500">On-time</span><OnTimePercentageBar pct={selectedAgent.onTimePct} /></div>
                <div className="flex gap-2 pt-2">
                  <Button className="lme-action-btn flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success("Assigned", `${selectedAgent.name} assigned new orders`)}>Assign Orders</Button>
                  <Button variant="outline" className="lme-action-btn" onClick={() => toast.info("Shift", `Changing shift for ${selectedAgent.name}`)}>Change Shift</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ===== Sheet: Route Details ===== */}
      <Sheet open={!!selectedRoute} onOpenChange={open => { if (!open) setSelectedRoute(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedRoute && (
            <>
              <SheetHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
                <SheetTitle className="text-white flex items-center gap-2"><Route className="h-5 w-5" /> Route {selectedRoute.id}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Status</p><RouteStatusBadge status={selectedRoute.status} /></div>
                  <div><p className="text-xs text-gray-500">Traffic</p><TrafficConditionBadge condition={selectedRoute.traffic} /></div>
                  <div><p className="text-xs text-gray-500">Distance</p><DistanceTile distance={selectedRoute.distance} /></div>
                  <div><p className="text-xs text-gray-500">Efficiency</p><EfficiencyScoreBar score={selectedRoute.efficiency} /></div>
                  <div><p className="text-xs text-gray-500">Fuel Cost</p><span className="text-sm font-bold">{selectedRoute.fuelCost}</span></div>
                  <div><p className="text-xs text-gray-500">Stops</p><WaypointCountBadge count={selectedRoute.waypoints} /></div>
                </div>
                <Separator />
                <div><p className="text-xs text-gray-500 mb-1">Route Path</p><p className="text-sm">{selectedRoute.route}</p></div>
                <div className="grid grid-cols-2 gap-3"><div><p className="text-xs text-gray-500">Agent</p><p className="text-sm font-medium">{selectedRoute.agent}</p></div><div><p className="text-xs text-gray-500">Created</p><p className="text-sm">{selectedRoute.created}</p></div></div>
                <DeliveryTimeTile estimated={selectedRoute.estimatedTime} actual={selectedRoute.actualTime} />
                <div className="flex gap-2 pt-2">
                  <Button className="lme-action-btn flex-1 bg-orange-600 hover:bg-orange-700" onClick={() => toast.success("Optimized", `Route ${selectedRoute.id} re-optimized`)}>Re-Optimize</Button>
                  <Button variant="outline" className="lme-action-btn" onClick={() => toast.info("Reassigned", `Route ${selectedRoute.id} reassigned`)}>Reassign</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ===== Sheet: Feedback Details ===== */}
      <Sheet open={!!selectedFeedback} onOpenChange={open => { if (!open) setSelectedFeedback(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedFeedback && (
            <>
              <SheetHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
                <SheetTitle className="text-white flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Feedback {selectedFeedback.id}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">NPS</p><NPSBadge score={selectedFeedback.nps} /></div>
                  <div><p className="text-xs text-gray-500">Sentiment</p><SentimentBadge sentiment={selectedFeedback.sentiment} /></div>
                </div>
                <Separator />
                <div><p className="text-xs text-gray-500 mb-1">Customer</p><p className="text-sm font-semibold">{selectedFeedback.customer}</p><p className="text-xs text-gray-500">{selectedFeedback.city} · Order: {selectedFeedback.orderId}</p></div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500 mb-1">Delivery Speed</p><StarRating rating={selectedFeedback.speed} /></div>
                  <div><p className="text-xs text-gray-500 mb-1">Packaging</p><StarRating rating={selectedFeedback.packaging} /></div>
                  <div><p className="text-xs text-gray-500 mb-1">Agent Behavior</p><StarRating rating={selectedFeedback.agentBehavior} /></div>
                  <div><p className="text-xs text-gray-500 mb-1">Communication</p><StarRating rating={selectedFeedback.communication} /></div>
                </div>
                <div><p className="text-xs text-gray-500 mb-1">Complaint</p><ComplaintCategoryBadge category={selectedFeedback.complaint} /></div>
                <div><p className="text-xs text-gray-500">Agent</p><p className="text-sm">{selectedFeedback.agent}</p></div>
                <div className="flex gap-2 pt-2">
                  <Button className="lme-action-btn flex-1 bg-rose-600 hover:bg-rose-700" onClick={() => toast.success("Resolved", `Complaint for ${selectedFeedback.id} resolved`)}>Mark Resolved</Button>
                  <Button variant="outline" className="lme-action-btn" onClick={() => toast.info("Escalated", `Feedback ${selectedFeedback.id} escalated`)}>Escalate</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
