"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"

// ─── Seeded Random ───────────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ─── Theme Colors ────────────────────────────────────────────────────────────
const COLORS = {
  teal: "#0d9488",
  indigo: "#6366f1",
  rose: "#e11d48",
  amber: "#d97706",
  emerald: "#059669",
  sky: "#0284c7",
  purple: "#7c3aed",
  slate: "#475569",
  orange: "#ea580c",
  lime: "#65a30d",
}

const LMD_COLORS = [
  COLORS.teal, COLORS.indigo, COLORS.rose, COLORS.amber,
  COLORS.emerald, COLORS.sky, COLORS.purple, COLORS.orange,
]

const CHART_COLORS = [
  COLORS.teal, COLORS.indigo, COLORS.rose, COLORS.amber,
  COLORS.emerald, COLORS.sky, COLORS.purple, COLORS.orange,
  COLORS.lime, COLORS.slate,
]

// ─── Constants ────────────────────────────────────────────────────────────────
const RIDERS = [
  "Arun Kumar", "Ravi Sharma", "Suresh Patel", "Vijay Singh", "Mohan Das",
  "Rajesh Gupta", "Amit Joshi", "Sanjay Verma", "Pradeep Yadav", "Kiran Nair",
  "Deepak Mishra", "Sunil Rao", "Ramesh Pillai", "Anil Deshmukh", "Ganesh Reddy",
  "Manoj Tiwari", "Arjun Mehta", "Dinesh Karthik", "Harish Chandra", "Pawan Kalyan",
  "Karthik Rajan", "Naveen Kumar", "Senthil Murugan", "Balaji Iyer", "Raghu Nath",
  "Vivek Pandey", "Chiranjeevi Goud", "Ashok Reddy", "Prabhu Deva", "Siva Subramanian",
] as const

const DELIVERY_ZONES = [
  "South Mumbai", "Bandra-Kurla", "Andheri-East", "Powai-Hiranandani",
  "Thane-Belapur", "Navi Mumbai", "Goregaon-Malad", "Borivali-Dahisar",
  "Worli-Prabhadevi", "Chembur-Trombay", "Vashi-Nerul", "Panvel-Khalapur",
  "Pune Hinjewadi", "Pune Kharadi", "Pune Wakad", "Noida Sector 62",
  "Gurgaon Udyog Vihar", "Gurgaon Sohna Rd", "Whitefield Bangalore", "Electronic City",
] as const

const DELIVERY_TYPES = [
  "Standard", "Express", "Same-Day", "Next-Day", "Scheduled",
  "COD", "Bulk Drop", "Reverse Pickup", "Exchange", "Warranty Return",
] as const

const FAILURE_REASONS = [
  "Address Not Found", "Customer Not Available", "Wrong Pincode",
  "Access Denied", "Road Blocked", "Vehicle Breakdown", "Weather Disruption",
  "Item Damaged", "Short Delivery", "Customer Refused", "OTP Mismatch",
  "Weight Exceeded", "Documentation Issue", "Gate Entry Denied",
] as const

const DELIVERY_PLATFORMS = [
  "Internal Fleet", "Delhivery", "BlueDart", "DTDC", "Ekart",
  "Shadowfax", "XpressBees", "Ecom Express", "Rivigo", "Spoton",
] as const

const ZONE_TYPES = ["Urban Dense", "Urban Medium", "Suburban", "Semi-Rural", "Industrial", "Commercial Hub"] as const
const TIME_SLOTS = ["6AM-9AM", "9AM-12PM", "12PM-3PM", "3PM-6PM", "6PM-9PM", "9PM-12AM"] as const

// ─── INR Formatting ──────────────────────────────────────────────────────────
function formatINR(val: number) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`
  return `₹${val.toLocaleString("en-IN")}`
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface DeliveryRecord {
  id: string; rider: string; zone: string; zoneType: string; deliveryType: string
  platform: string; orderId: string; customer: string; distance: number; timeSlot: string
  status: string; attemptCount: number; estimatedTime: string; actualTime: string
  codAmount: number; deliveryCost: number; rating: number; lateness: number; warehouse: string
}

interface RiderPerformance {
  id: string; rider: string; zone: string; platform: string; totalDeliveries: number
  successRate: number; avgDeliveryTime: number; avgDistance: number; totalDistance: number
  codCollected: number; rating: number; onTimeRate: number; failedAttempts: number
  activeDays: number; avgPerDay: number; earnings: number
}

interface ZoneAnalytics {
  id: string; zone: string; zoneType: string; city: string; totalDeliveries: number
  successRate: number; avgDeliveryTime: number; failureRate: number; avgDistance: number
  coveragePct: number; density: number; peakSlot: string; costPerDelivery: number; warehouse: string
}

interface FailureRecord {
  id: string; orderId: string; rider: string; zone: string; reason: string
  attemptCount: number; redeliveryScheduled: boolean; costImpact: number
  customerImpact: string; date: string; status: string; warehouse: string
}

interface TimeSlotAnalysis {
  id: string; timeSlot: string; totalDeliveries: number; successRate: number
  avgDeliveryTime: number; avgDistance: number; failureRate: number; peakVolume: number
  avgRating: number; codPercentage: number; costEfficiency: number
}

// ─── Data Generation ─────────────────────────────────────────────────────────
function generateData() {
  const s = seededRandom(182)

  const WAREHOUSES = ["Mumbai DC", "Delhi Hub", "Chennai DC", "Bangalore FC", "Pune FC", "Hyderabad DC"] as const
  const CUSTOMERS = [
    "Priya Sharma", "Rahul Mehta", "Anita Desai", "Vikram Patel", "Sneha Kulkarni",
    "Arjun Reddy", "Meera Nair", "Karthik Iyer", "Divya Joshi", "Nikhil Gupta",
    "Pooja Agarwal", "Rohan Verma", "Sakshi Singh", "Aditya Kapoor", "Kavita Rao",
    "Manish Tiwari", "Shreya Das", "Varun Malik", "Anjali Bhattacharya", "Siddharth Pandey",
  ] as const
  const STATUSES = ["Delivered", "Failed", "Rescheduled", "In Transit", "Out for Delivery", "Returned"] as const

  // Deliveries
  const deliveries: DeliveryRecord[] = Array.from({ length: 120 }, (_, i) => {
    const statuses = [...STATUSES]
    const status = statuses[Math.floor(s() * statuses.length)]
    const deliveryType = DELIVERY_TYPES[Math.floor(s() * DELIVERY_TYPES.length)]
    const platform = DELIVERY_PLATFORMS[Math.floor(s() * DELIVERY_PLATFORMS.length)]
    const zone = DELIVERY_ZONES[Math.floor(s() * DELIVERY_ZONES.length)]
    const zoneType = ZONE_TYPES[Math.floor(s() * ZONE_TYPES.length)]
    const rider = RIDERS[Math.floor(s() * RIDERS.length)]
    const timeSlot = TIME_SLOTS[Math.floor(s() * TIME_SLOTS.length)]
    const dist = Math.floor(s() * 25) + 2
    const estH = Math.floor(s() * 3) + 1
    const estM = Math.floor(s() * 60)
    const lateness = status === "Delivered" ? (s() > 0.6 ? Math.floor(s() * 30) : 0) : (s() > 0.3 ? Math.floor(s() * 60) + 10 : 0)
    return {
      id: `LMD-${String(i + 1).padStart(5, "0")}`,
      rider, zone, zoneType, deliveryType, platform,
      orderId: `ORD-${String(Math.floor(s() * 50000) + 10000).padStart(6, "0")}`,
      customer: CUSTOMERS[Math.floor(s() * CUSTOMERS.length)],
      distance: dist, timeSlot, status,
      attemptCount: status === "Failed" ? Math.floor(s() * 3) + 1 : 1,
      estimatedTime: `${String(estH).padStart(2, "0")}:${String(estM).padStart(2, "0")}`,
      actualTime: lateness > 0 ? `${String(Math.min(estH + 1, 23)).padStart(2, "0")}:${String(estM + lateness).padStart(2, "0")}` : `${String(estH).padStart(2, "0")}:${String(estM).padStart(2, "0")}`,
      codAmount: deliveryType === "COD" ? Math.floor(s() * 15000) + 500 : 0,
      deliveryCost: Math.floor(s() * 150) + 30,
      rating: status === "Delivered" ? Math.round((s() * 2 + 3) * 10) / 10 : 0,
      lateness,
      warehouse: WAREHOUSES[Math.floor(s() * WAREHOUSES.length)],
    }
  })

  // Rider Performance
  const riderPerf: RiderPerformance[] = Array.from({ length: 60 }, (_, i) => {
    const rider = RIDERS[Math.floor(s() * RIDERS.length)]
    const totalDels = Math.floor(s() * 200) + 50
    const successRate = Math.floor(s() * 20) + 78
    const avgTime = Math.floor(s() * 40) + 20
    const avgDist = Math.floor(s() * 15) + 3
    return {
      id: `RDR-${String(i + 1).padStart(4, "0")}`,
      rider, zone: DELIVERY_ZONES[Math.floor(s() * DELIVERY_ZONES.length)],
      platform: DELIVERY_PLATFORMS[Math.floor(s() * DELIVERY_PLATFORMS.length)],
      totalDeliveries: totalDels, successRate, avgDeliveryTime: avgTime,
      avgDistance: avgDist, totalDistance: Math.floor(avgDist * totalDels),
      codCollected: Math.floor(s() * 500000) + 50000,
      rating: Math.round((s() * 1.5 + 3.5) * 10) / 10,
      onTimeRate: Math.floor(s() * 18) + 80,
      failedAttempts: Math.floor(totalDels * (100 - successRate) / 100),
      activeDays: Math.floor(s() * 25) + 5, avgPerDay: Math.floor(totalDels / (Math.floor(s() * 25) + 5)),
      earnings: Math.floor(s() * 25000) + 8000,
    }
  })

  // Zone Analytics
  const zoneAnalytics: ZoneAnalytics[] = Array.from({ length: 40 }, (_, i) => {
    const zone = DELIVERY_ZONES[Math.floor(s() * DELIVERY_ZONES.length)]
    const zType = ZONE_TYPES[Math.floor(s() * ZONE_TYPES.length)]
    const city = zone.includes("Pune") ? "Pune" : zone.includes("Noida") || zone.includes("Gurgaon") ? "NCR" : "Mumbai"
    return {
      id: `ZNA-${String(i + 1).padStart(4, "0")}`,
      zone, zoneType: zType, city,
      totalDeliveries: Math.floor(s() * 500) + 100,
      successRate: Math.floor(s() * 18) + 80,
      avgDeliveryTime: Math.floor(s() * 35) + 15,
      failureRate: Math.floor(s() * 10) + 2,
      avgDistance: Math.floor(s() * 12) + 2,
      coveragePct: Math.floor(s() * 25) + 70,
      density: Math.floor(s() * 5000) + 500,
      peakSlot: TIME_SLOTS[Math.floor(s() * TIME_SLOTS.length)],
      costPerDelivery: Math.floor(s() * 100) + 35,
      warehouse: WAREHOUSES[Math.floor(s() * WAREHOUSES.length)],
    }
  })

  // Failure Records
  const failureRecords: FailureRecord[] = Array.from({ length: 70 }, (_, i) => {
    const reasons = [...FAILURE_REASONS]
    const reason = reasons[Math.floor(s() * reasons.length)]
    const fStatuses = ["Redelivery Scheduled", "Customer Contacted", "Returned to Hub", "Resolved", "Escalated"]
    return {
      id: `FLR-${String(i + 1).padStart(4, "0")}`,
      orderId: `ORD-${String(Math.floor(s() * 50000) + 10000).padStart(6, "0")}`,
      rider: RIDERS[Math.floor(s() * RIDERS.length)],
      zone: DELIVERY_ZONES[Math.floor(s() * DELIVERY_ZONES.length)],
      reason, attemptCount: Math.floor(s() * 3) + 1,
      redeliveryScheduled: s() > 0.3,
      costImpact: Math.floor(s() * 500) + 50,
      customerImpact: ["Low", "Medium", "High", "Critical"][Math.floor(s() * 4)],
      date: `2026-${String(Math.floor(s() * 7) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      status: fStatuses[Math.floor(s() * fStatuses.length)],
      warehouse: WAREHOUSES[Math.floor(s() * WAREHOUSES.length)],
    }
  })

  // Time Slot Analysis
  const timeSlotData: TimeSlotAnalysis[] = [...TIME_SLOTS].map((ts) => ({
    id: `TSA-${ts.replace(/[-:]/g, "")}`,
    timeSlot: ts, totalDeliveries: Math.floor(s() * 300) + 50,
    successRate: Math.floor(s() * 15) + 82, avgDeliveryTime: Math.floor(s() * 30) + 15,
    avgDistance: Math.floor(s() * 10) + 3, failureRate: Math.floor(s() * 8) + 2,
    peakVolume: Math.floor(s() * 80) + 20, avgRating: Math.round((s() * 1.2 + 3.8) * 10) / 10,
    codPercentage: Math.floor(s() * 40) + 10, costEfficiency: Math.floor(s() * 30) + 65,
  }))

  // Monthly trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyTrend = months.map((month) => ({
    month, deliveries: Math.floor(s() * 2000) + 3000, failures: Math.floor(s() * 200) + 100,
    onTime: Math.floor(s() * 15) + 82, avgCost: Math.floor(s() * 30) + 50, revenue: Math.floor(s() * 500000) + 800000,
  }))

  // Platform comparison
  const platformComparison = [...DELIVERY_PLATFORMS].map((p) => ({
    platform: p.length > 12 ? p.substring(0, 12) + ".." : p,
    fullName: p, deliveries: Math.floor(s() * 800) + 200,
    successRate: Math.floor(s() * 12) + 85, avgTime: Math.floor(s() * 25) + 15,
    costPerKm: Math.floor(s() * 15) + 8, marketShare: Math.floor(s() * 20) + 5,
  }))

  return {
    deliveries, riderPerf, zoneAnalytics, failureRecords, timeSlotData,
    monthlyTrend, platformComparison, months,
    RIDERS, DELIVERY_ZONES, DELIVERY_TYPES, FAILURE_REASONS, DELIVERY_PLATFORMS,
    ZONE_TYPES, TIME_SLOTS, WAREHOUSES,
  }
}

// ─── Helper Components ───────────────────────────────────────────────────────
function FieldGrid({ fields }: { fields: { label: string; value: string }[] }) {
  return (
    <div className="lmd-drawer-field-grid">
      {fields.map((f, i) => (
        <div key={i} className="lmd-drawer-field">
          <span className="lmd-drawer-field-label">{f.label}</span>
          <span className="lmd-drawer-field-value">{f.value}</span>
        </div>
      ))}
    </div>
  )
}

function MetricsRow({ metrics }: { metrics: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="lmd-drawer-metrics">
      {metrics.map((m, i) => (
        <div key={i} className="lmd-drawer-metric-card" style={m.color ? { borderTopColor: m.color } : undefined}>
          <span className="lmd-drawer-metric-label">{m.label}</span>
          <span className="lmd-drawer-metric-value">{m.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── SVG Score Ring ──────────────────────────────────────────────────────────
function ScoreRing({ score, size = 80, strokeWidth = 6 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? COLORS.emerald : score >= 60 ? COLORS.amber : COLORS.rose
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.22} fontWeight="700" fill={color}>{score}%</text>
    </svg>
  )
}

// ─── Rating Stars ────────────────────────────────────────────────────────────
function RatingStars({ rating }: { rating: number }) {
  const stars = Math.round(rating)
  return (
    <span className="lmd-rating">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < stars ? "lmd-star-filled" : "lmd-star-empty"}>&#9733;</span>
      ))}
      <span className="lmd-rating-val">{rating.toFixed(1)}</span>
    </span>
  )
}

// ─── Lateness Badge ──────────────────────────────────────────────────────────
function LatenessBadge({ mins }: { mins: number }) {
  if (mins === 0) return <span className="lmd-badge-on-time">On Time</span>
  if (mins <= 15) return <span className="lmd-badge-late-minor">+{mins}m</span>
  return <span className="lmd-badge-late-major">+{mins}m Late</span>
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LastMileDeliveryAnalyticsView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterZone, setFilterZone] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDeliveryType, setFilterDeliveryType] = useState("all")
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [filterReason, setFilterReason] = useState("all")
  const [filterZoneType, setFilterZoneType] = useState("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<string>("")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortAsc, setSortAsc] = useState(true)

  // KPIs
  const kpis = useMemo(() => {
    const total = data.deliveries.length
    const delivered = data.deliveries.filter((d) => d.status === "Delivered").length
    const onTime = data.deliveries.filter((d) => d.lateness === 0 && d.status === "Delivered").length
    const avgRating = (data.deliveries.filter((d) => d.rating > 0).reduce((a, d) => a + d.rating, 0) / data.deliveries.filter((d) => d.rating > 0).length).toFixed(1)
    const totalCOD = data.deliveries.reduce((a, d) => a + d.codAmount, 0)
    const failed = data.deliveries.filter((d) => d.status === "Failed").length
    return [
      { label: "Total Deliveries", value: total, color: COLORS.teal, icon: "📦" },
      { label: "Success Rate", value: `${Math.round(delivered / total * 100)}%`, color: COLORS.emerald, icon: "✅" },
      { label: "On-Time Rate", value: `${Math.round(onTime / total * 100)}%`, color: COLORS.indigo, icon: "⏱️" },
      { label: "Avg Rating", value: avgRating, color: COLORS.amber, icon: "⭐" },
      { label: "COD Collected", value: formatINR(totalCOD), color: COLORS.sky, icon: "💰" },
      { label: "Failed", value: failed, color: COLORS.rose, icon: "❌" },
    ]
  }, [data])

  // Distributions
  const statusDist = useMemo(() => {
    const sts = ["Delivered", "Failed", "Rescheduled", "In Transit", "Out for Delivery", "Returned"]
    return sts.map((st) => ({ name: st, value: data.deliveries.filter((d) => d.status === st).length }))
  }, [data])

  const typeDist = useMemo(() => {
    return [...DELIVERY_TYPES].map((t) => ({ name: t.length > 10 ? t.substring(0, 10) + ".." : t, fullName: t, value: data.deliveries.filter((d) => d.deliveryType === t).length }))
  }, [data])

  const platformDist = useMemo(() => {
    return [...DELIVERY_PLATFORMS].map((p) => ({ name: p, value: data.deliveries.filter((d) => d.platform === p).length }))
  }, [data])

  const reasonDist = useMemo(() => {
    return [...FAILURE_REASONS].map((r) => ({ name: r.length > 16 ? r.substring(0, 16) + ".." : r, fullName: r, value: data.failureRecords.filter((f) => f.reason === r).length }))
  }, [data])

  const zoneTypeDist = useMemo(() => {
    return [...ZONE_TYPES].map((z) => ({ name: z, value: data.zoneAnalytics.filter((za) => za.zoneType === z).length }))
  }, [data])

  // Filters + Sort
  const handleSort = (field: any) => {
    if (sortBy === field) setSortAsc(!sortAsc)
    else { setSortBy(field); setSortAsc(true) }
  }

  const sortItems = <T extends Record<string, any>>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
      const va = a[sortBy], vb = b[sortBy]
      if (typeof va === "number") return sortAsc ? va - vb : vb - va
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }

  const filteredDeliveries = useMemo(() => {
    let items = [...data.deliveries]
    if (searchTerm) items = items.filter((d) => d.rider.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase()) || d.orderId.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterZone !== "all") items = items.filter((d) => d.zone === filterZone)
    if (filterStatus !== "all") items = items.filter((d) => d.status === filterStatus)
    if (filterDeliveryType !== "all") items = items.filter((d) => d.deliveryType === filterDeliveryType)
    return sortItems(items)
  }, [data, searchTerm, filterZone, filterStatus, filterDeliveryType, sortBy, sortAsc])

  const filteredRiders = useMemo(() => {
    let items = [...data.riderPerf]
    if (searchTerm) items = items.filter((r) => r.rider.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterPlatform !== "all") items = items.filter((r) => r.platform === filterPlatform)
    return sortItems(items)
  }, [data, searchTerm, filterPlatform, sortBy, sortAsc])

  const filteredZones = useMemo(() => {
    let items = [...data.zoneAnalytics]
    if (searchTerm) items = items.filter((z) => z.zone.toLowerCase().includes(searchTerm.toLowerCase()) || z.city.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterZoneType !== "all") items = items.filter((z) => z.zoneType === filterZoneType)
    return sortItems(items)
  }, [data, searchTerm, filterZoneType, sortBy, sortAsc])

  const filteredFailures = useMemo(() => {
    let items = [...data.failureRecords]
    if (searchTerm) items = items.filter((f) => f.rider.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterReason !== "all") items = items.filter((f) => f.reason === filterReason)
    return sortItems(items)
  }, [data, searchTerm, filterReason, sortBy, sortAsc])

  // Drawer
  const openDeliveryDrawer = (d: DeliveryRecord) => { setDrawerData(d); setDrawerType("delivery"); setDrawerOpen(true) }
  const openRiderDrawer = (r: RiderPerformance) => { setDrawerData(r); setDrawerType("rider"); setDrawerOpen(true) }
  const openZoneDrawer = (z: ZoneAnalytics) => { setDrawerData(z); setDrawerType("zone"); setDrawerOpen(true) }
  const openFailureDrawer = (f: FailureRecord) => { setDrawerData(f); setDrawerType("failure"); setDrawerOpen(true) }

  const renderDrawer = () => {
    if (!drawerData) return null
    if (drawerType === "delivery") {
      const d = drawerData as DeliveryRecord
      return (
        <>
          <div className="lmd-drawer-header">
            <div className="lmd-drawer-header-left">
              <LatenessBadge mins={d.lateness} />
              <div>
                <h3 className="lmd-drawer-title">{d.id}</h3>
                <p className="lmd-drawer-subtitle">{d.orderId} - {d.customer}</p>
                <div className="lmd-drawer-badges">
                  <span className={`lmd-badge-status lmd-status-${d.status.toLowerCase().replace(/\s+/g, "-")}`}>{d.status}</span>
                  <span className="lmd-badge-type">{d.deliveryType}</span>
                </div>
              </div>
            </div>
          </div>
          <MetricsRow metrics={[
            { label: "Delivery Cost", value: formatINR(d.deliveryCost), color: COLORS.teal },
            { label: "COD Amount", value: formatINR(d.codAmount), color: COLORS.amber },
            { label: "Distance", value: `${d.distance} km`, color: COLORS.indigo },
          ]} />
          {d.rating > 0 && <div className="lmd-drawer-rating-section"><RatingStars rating={d.rating} /></div>}
          <FieldGrid fields={[
            { label: "Rider", value: d.rider }, { label: "Zone", value: d.zone },
            { label: "Platform", value: d.platform }, { label: "Time Slot", value: d.timeSlot },
            { label: "Est. Time", value: d.estimatedTime }, { label: "Actual Time", value: d.actualTime },
            { label: "Attempts", value: String(d.attemptCount) }, { label: "Zone Type", value: d.zoneType },
          ]} />
          <div className="lmd-drawer-actions">
            <button className="lmd-btn-primary">Track Live</button>
            <button className="lmd-btn-secondary">Contact Rider</button>
            <button className="lmd-btn-ghost">Reassign</button>
          </div>
        </>
      )
    }
    if (drawerType === "rider") {
      const r = drawerData as RiderPerformance
      return (
        <>
          <div className="lmd-drawer-header">
            <div className="lmd-drawer-header-left">
              <ScoreRing score={r.successRate} />
              <div>
                <h3 className="lmd-drawer-title">{r.id}</h3>
                <p className="lmd-drawer-subtitle">{r.rider}</p>
                <div className="lmd-drawer-badges">
                  <span className="lmd-badge-platform">{r.platform}</span>
                  <span className="lmd-badge-zone-type">{r.zone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lmd-drawer-rating-section"><RatingStars rating={r.rating} /></div>
          <MetricsRow metrics={[
            { label: "Total Deliveries", value: String(r.totalDeliveries), color: COLORS.teal },
            { label: "On-Time Rate", value: `${r.onTimeRate}%`, color: COLORS.indigo },
            { label: "Monthly Earnings", value: formatINR(r.earnings), color: COLORS.emerald },
          ]} />
          <div className="lmd-drawer-score-grid">
            <div className="lmd-drawer-score-item" style={{ borderTopColor: COLORS.teal }}>
              <span className="lmd-drawer-score-label">Success Rate</span>
              <span className="lmd-drawer-score-value">{r.successRate}%</span>
            </div>
            <div className="lmd-drawer-score-item" style={{ borderTopColor: COLORS.rose }}>
              <span className="lmd-drawer-score-label">Failed</span>
              <span className="lmd-drawer-score-value">{r.failedAttempts}</span>
            </div>
            <div className="lmd-drawer-score-item" style={{ borderTopColor: COLORS.sky }}>
              <span className="lmd-drawer-score-label">Avg Time</span>
              <span className="lmd-drawer-score-value">{r.avgDeliveryTime}m</span>
            </div>
            <div className="lmd-drawer-score-item" style={{ borderTopColor: COLORS.amber }}>
              <span className="lmd-drawer-score-label">Avg Dist</span>
              <span className="lmd-drawer-score-value">{r.avgDistance}km</span>
            </div>
          </div>
          <FieldGrid fields={[
            { label: "Zone", value: r.zone }, { label: "Total Distance", value: `${r.totalDistance} km` },
            { label: "Active Days", value: String(r.activeDays) }, { label: "Avg/Day", value: String(r.avgPerDay) },
            { label: "COD Collected", value: formatINR(r.codCollected) },
          ]} />
          <div className="lmd-drawer-actions">
            <button className="lmd-btn-primary">View Route History</button>
            <button className="lmd-btn-secondary">Assign Zone</button>
            <button className="lmd-btn-ghost">Performance Review</button>
          </div>
        </>
      )
    }
    if (drawerType === "zone") {
      const z = drawerData as ZoneAnalytics
      return (
        <>
          <div className="lmd-drawer-header">
            <div className="lmd-drawer-header-left">
              <ScoreRing score={z.successRate} />
              <div>
                <h3 className="lmd-drawer-title">{z.id}</h3>
                <p className="lmd-drawer-subtitle">{z.zone} - {z.city}</p>
                <div className="lmd-drawer-badges">
                  <span className="lmd-badge-zone-type">{z.zoneType}</span>
                </div>
              </div>
            </div>
          </div>
          <MetricsRow metrics={[
            { label: "Total Deliveries", value: String(z.totalDeliveries), color: COLORS.teal },
            { label: "Avg Delivery Time", value: `${z.avgDeliveryTime}m`, color: COLORS.indigo },
            { label: "Cost/Delivery", value: formatINR(z.costPerDelivery), color: COLORS.amber },
          ]} />
          <div className="lmd-drawer-score-grid">
            <div className="lmd-drawer-score-item" style={{ borderTopColor: COLORS.emerald }}>
              <span className="lmd-drawer-score-label">Coverage</span>
              <span className="lmd-drawer-score-value">{z.coveragePct}%</span>
            </div>
            <div className="lmd-drawer-score-item" style={{ borderTopColor: COLORS.rose }}>
              <span className="lmd-drawer-score-label">Failure Rate</span>
              <span className="lmd-drawer-score-value">{z.failureRate}%</span>
            </div>
            <div className="lmd-drawer-score-item" style={{ borderTopColor: COLORS.sky }}>
              <span className="lmd-drawer-score-label">Density</span>
              <span className="lmd-drawer-score-value">{z.density}</span>
            </div>
            <div className="lmd-drawer-score-item" style={{ borderTopColor: COLORS.purple }}>
              <span className="lmd-drawer-score-label">Peak Slot</span>
              <span className="lmd-drawer-score-value">{z.peakSlot}</span>
            </div>
          </div>
          <FieldGrid fields={[
            { label: "City", value: z.city }, { label: "Avg Distance", value: `${z.avgDistance} km` },
            { label: "Warehouse", value: z.warehouse }, { label: "Zone Type", value: z.zoneType },
          ]} />
          <div className="lmd-drawer-actions">
            <button className="lmd-btn-primary">Optimize Routes</button>
            <button className="lmd-btn-secondary">Reallocate Riders</button>
            <button className="lmd-btn-ghost">Zone Report</button>
          </div>
        </>
      )
    }
    if (drawerType === "failure") {
      const f = drawerData as FailureRecord
      return (
        <>
          <div className="lmd-drawer-header">
            <div className="lmd-drawer-header-left">
              <div className="lmd-drawer-failure-icon">&#9888;</div>
              <div>
                <h3 className="lmd-drawer-title">{f.id}</h3>
                <p className="lmd-drawer-subtitle">{f.orderId} - {f.rider}</p>
                <div className="lmd-drawer-badges">
                  <span className="lmd-badge-reason">{f.reason}</span>
                  <span className={`lmd-badge-status lmd-status-${f.status.toLowerCase().replace(/\s+/g, "-")}`}>{f.status}</span>
                </div>
              </div>
            </div>
          </div>
          <MetricsRow metrics={[
            { label: "Cost Impact", value: formatINR(f.costImpact), color: COLORS.rose },
            { label: "Attempts", value: String(f.attemptCount), color: COLORS.amber },
            { label: "Customer Impact", value: f.customerImpact, color: COLORS.indigo },
          ]} />
          <FieldGrid fields={[
            { label: "Zone", value: f.zone }, { label: "Date", value: f.date },
            { label: "Reason", value: f.reason }, { label: "Redelivery", value: f.redeliveryScheduled ? "Scheduled" : "Not Scheduled" },
            { label: "Warehouse", value: f.warehouse },
          ]} />
          <div className="lmd-drawer-actions">
            <button className="lmd-btn-primary">Schedule Redelivery</button>
            <button className="lmd-btn-secondary">Contact Customer</button>
            <button className="lmd-btn-ghost">Escalate</button>
          </div>
        </>
      )
    }
    return null
  }

  // ─── Tabs ──────────────────────────────────────────────────────────────────
  const tabs = [
    // Tab 0: Dashboard
    {
      title: "Dashboard",
      content: (
        <div className="lmd-tab-dashboard">
          <div className="lmd-kpi-grid">
            {kpis.map((kpi, i) => (
              <div key={i} className="lmd-kpi-card" style={{ borderTopColor: kpi.color }}>
                <span className="lmd-kpi-icon">{kpi.icon}</span>
                <span className="lmd-kpi-label">{kpi.label}</span>
                <span className="lmd-kpi-value">{kpi.value}</span>
              </div>
            ))}
          </div>
          <div className="lmd-chart-grid">
            <div className="lmd-chart-card lmd-chart-wide">
              <h4 className="lmd-chart-title">Monthly Delivery Volume & On-Time Rate</h4>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[70, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="deliveries" name="Volume" fill="#0d948833" stroke={COLORS.teal} strokeWidth={2} />
                  <Area yAxisId="left" type="monotone" dataKey="failures" name="Failures" fill="#e11d4833" stroke={COLORS.rose} strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="onTime" name="On-Time %" stroke={COLORS.indigo} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="lmd-chart-card">
              <h4 className="lmd-chart-title">Delivery Status</h4>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusDist.map((_e, idx) => <Cell key={idx} fill={LMD_COLORS[idx % LMD_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="lmd-chart-card">
              <h4 className="lmd-chart-title">Top Failure Reasons</h4>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={reasonDist.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="#94a3b8" width={110} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
                    {reasonDist.slice(0, 8).map((_e, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lmd-chart-card">
              <h4 className="lmd-chart-title">Delivery Type Mix</h4>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={typeDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-25} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                    {typeDist.map((_e, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lmd-chart-card">
              <h4 className="lmd-chart-title">Platform Market Share</h4>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={platformDist} cx="50%" cy="50%" outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {platformDist.map((_e, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="lmd-chart-card">
              <h4 className="lmd-chart-title">Platform Performance Comparison</h4>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={data.platformComparison.slice(0, 6)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="platform" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar name="Success Rate" dataKey="successRate" stroke={COLORS.teal} fill="#0d948833" strokeWidth={2} />
                  <Radar name="Avg Time" dataKey="avgTime" stroke={COLORS.indigo} fill="#6366f133" strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ),
    },
    // Tab 1: Deliveries
    {
      title: "Deliveries",
      content: (
        <div className="lmd-tab-section">
          <div className="lmd-filters">
            <input className="lmd-search" placeholder="Search by rider, ID or order..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="lmd-filter" value={filterZone} onChange={(e) => setFilterZone(e.target.value)}>
              <option value="all">All Zones</option>
              {[...DELIVERY_ZONES].map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
            <select className="lmd-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              {["Delivered", "Failed", "Rescheduled", "In Transit", "Out for Delivery", "Returned"].map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
            <select className="lmd-filter" value={filterDeliveryType} onChange={(e) => setFilterDeliveryType(e.target.value)}>
              <option value="all">All Types</option>
              {[...DELIVERY_TYPES].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="lmd-table-wrap">
            <table className="lmd-table">
              <thead>
                <tr>
                  <th className="lmd-clickable" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Order</th>
                  <th className="lmd-clickable" onClick={() => handleSort("rider")}>Rider {sortBy === "rider" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Zone</th>
                  <th>Type</th>
                  <th>Platform</th>
                  <th>Slot</th>
                  <th>Distance</th>
                  <th>Status</th>
                  <th>Lateness</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.slice(0, 50).map((d) => (
                  <tr key={d.id} className="lmd-row" onClick={() => openDeliveryDrawer(d)}>
                    <td className="lmd-cell-id">{d.id}</td>
                    <td className="lmd-cell-mono">{d.orderId}</td>
                    <td>{d.rider}</td>
                    <td className="lmd-cell-truncate">{d.zone}</td>
                    <td><span className="lmd-badge-type">{d.deliveryType}</span></td>
                    <td>{d.platform}</td>
                    <td>{d.timeSlot}</td>
                    <td className="lmd-cell-mono">{d.distance}km</td>
                    <td><span className={`lmd-badge-status lmd-status-${d.status.toLowerCase().replace(/\s+/g, "-")}`}>{d.status}</span></td>
                    <td><LatenessBadge mins={d.lateness} /></td>
                    <td>{d.rating > 0 ? <RatingStars rating={d.rating} /> : <span className="lmd-na">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Tab 2: Rider Performance
    {
      title: "Rider Performance",
      content: (
        <div className="lmd-tab-section">
          <div className="lmd-filters">
            <input className="lmd-search" placeholder="Search by rider name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="lmd-filter" value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
              <option value="all">All Platforms</option>
              {[...DELIVERY_PLATFORMS].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="lmd-table-wrap">
            <table className="lmd-table">
              <thead>
                <tr>
                  <th className="lmd-clickable" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortAsc ? "↑" : "↓")}</th>
                  <th className="lmd-clickable" onClick={() => handleSort("rider")}>Rider {sortBy === "rider" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Zone</th>
                  <th>Platform</th>
                  <th className="lmd-clickable" onClick={() => handleSort("totalDeliveries")}>Total {sortBy === "totalDeliveries" && (sortAsc ? "↑" : "↓")}</th>
                  <th className="lmd-clickable" onClick={() => handleSort("successRate")}>Success {sortBy === "successRate" && (sortAsc ? "↑" : "↓")}</th>
                  <th className="lmd-clickable" onClick={() => handleSort("onTimeRate")}>On-Time {sortBy === "onTimeRate" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Rating</th>
                  <th className="lmd-clickable" onClick={() => handleSort("earnings")}>Earnings {sortBy === "earnings" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Failed</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiders.slice(0, 50).map((r) => (
                  <tr key={r.id} className="lmd-row" onClick={() => openRiderDrawer(r)}>
                    <td className="lmd-cell-id">{r.id}</td>
                    <td>{r.rider}</td>
                    <td className="lmd-cell-truncate">{r.zone}</td>
                    <td><span className="lmd-badge-platform">{r.platform}</span></td>
                    <td className="lmd-cell-mono">{r.totalDeliveries}</td>
                    <td><ScoreRing score={r.successRate} size={38} strokeWidth={3} /></td>
                    <td className="lmd-cell-mono">{r.onTimeRate}%</td>
                    <td><RatingStars rating={r.rating} /></td>
                    <td className="lmd-cell-mono">{formatINR(r.earnings)}</td>
                    <td className="lmd-cell-mono lmd-text-rose">{r.failedAttempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Tab 3: Zone Analytics
    {
      title: "Zone Analytics",
      content: (
        <div className="lmd-tab-section">
          <div className="lmd-filters">
            <input className="lmd-search" placeholder="Search by zone or city..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="lmd-filter" value={filterZoneType} onChange={(e) => setFilterZoneType(e.target.value)}>
              <option value="all">All Zone Types</option>
              {[...ZONE_TYPES].map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          <div className="lmd-table-wrap">
            <table className="lmd-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th className="lmd-clickable" onClick={() => handleSort("zone")}>Zone {sortBy === "zone" && (sortAsc ? "↑" : "↓")}</th>
                  <th>City</th>
                  <th>Type</th>
                  <th className="lmd-clickable" onClick={() => handleSort("totalDeliveries")}>Deliveries {sortBy === "totalDeliveries" && (sortAsc ? "↑" : "↓")}</th>
                  <th className="lmd-clickable" onClick={() => handleSort("successRate")}>Success {sortBy === "successRate" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Failure</th>
                  <th className="lmd-clickable" onClick={() => handleSort("coveragePct")}>Coverage {sortBy === "coveragePct" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Cost/Delivery</th>
                  <th>Peak Slot</th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.slice(0, 50).map((z) => (
                  <tr key={z.id} className="lmd-row" onClick={() => openZoneDrawer(z)}>
                    <td className="lmd-cell-id">{z.id}</td>
                    <td>{z.zone}</td>
                    <td>{z.city}</td>
                    <td><span className="lmd-badge-zone-type">{z.zoneType}</span></td>
                    <td className="lmd-cell-mono">{z.totalDeliveries}</td>
                    <td><ScoreRing score={z.successRate} size={38} strokeWidth={3} /></td>
                    <td className="lmd-cell-mono lmd-text-rose">{z.failureRate}%</td>
                    <td>
                      <div className="lmd-coverage-bar-wrap">
                        <div className="lmd-coverage-bar-track"><div className="lmd-coverage-bar" style={{ width: `${z.coveragePct}%`, backgroundColor: z.coveragePct >= 85 ? COLORS.emerald : z.coveragePct >= 70 ? COLORS.amber : COLORS.rose }} /></div>
                        <span className="lmd-coverage-label">{z.coveragePct}%</span>
                      </div>
                    </td>
                    <td className="lmd-cell-mono">{formatINR(z.costPerDelivery)}</td>
                    <td>{z.peakSlot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Tab 4: Failure Analysis
    {
      title: "Failure Analysis",
      content: (
        <div className="lmd-tab-section">
          <div className="lmd-filters">
            <input className="lmd-search" placeholder="Search by rider or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="lmd-filter" value={filterReason} onChange={(e) => setFilterReason(e.target.value)}>
              <option value="all">All Reasons</option>
              {[...FAILURE_REASONS].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="lmd-table-wrap">
            <table className="lmd-table">
              <thead>
                <tr>
                  <th className="lmd-clickable" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Order</th>
                  <th>Rider</th>
                  <th>Zone</th>
                  <th>Reason</th>
                  <th>Attempts</th>
                  <th className="lmd-clickable" onClick={() => handleSort("costImpact")}>Cost Impact {sortBy === "costImpact" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Customer Impact</th>
                  <th>Status</th>
                  <th>Redelivery</th>
                </tr>
              </thead>
              <tbody>
                {filteredFailures.slice(0, 50).map((f) => (
                  <tr key={f.id} className="lmd-row" onClick={() => openFailureDrawer(f)}>
                    <td className="lmd-cell-id">{f.id}</td>
                    <td className="lmd-cell-mono">{f.orderId}</td>
                    <td>{f.rider}</td>
                    <td className="lmd-cell-truncate">{f.zone}</td>
                    <td><span className="lmd-badge-reason">{f.reason}</span></td>
                    <td className="lmd-cell-mono">{f.attemptCount}</td>
                    <td className="lmd-cell-mono">{formatINR(f.costImpact)}</td>
                    <td><span className={`lmd-badge-impact lmd-impact-${f.customerImpact.toLowerCase()}`}>{f.customerImpact}</span></td>
                    <td><span className={`lmd-badge-status lmd-status-${f.status.toLowerCase().replace(/\s+/g, "-")}`}>{f.status}</span></td>
                    <td>{f.redeliveryScheduled ? <span className="lmd-badge-yes">Yes</span> : <span className="lmd-badge-no">No</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Tab 5: Time Slot Analysis
    {
      title: "Time Slots",
      content: (
        <div className="lmd-tab-dashboard">
          <div className="lmd-chart-grid">
            <div className="lmd-chart-card lmd-chart-wide">
              <h4 className="lmd-chart-title">Time Slot Performance</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.timeSlotData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="timeSlot" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Legend />
                  <Bar dataKey="totalDeliveries" name="Volume" fill={COLORS.teal} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="peakVolume" name="Peak" fill={COLORS.indigo} radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lmd-chart-card">
              <h4 className="lmd-chart-title">Success Rate by Slot</h4>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.timeSlotData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="timeSlot" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-25} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[60, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="successRate" name="Success %" radius={[4, 4, 0, 0]}>
                    {data.timeSlotData.map((_e, idx) => <Cell key={idx} fill={_e.successRate >= 90 ? COLORS.emerald : _e.successRate >= 80 ? COLORS.amber : COLORS.rose} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lmd-chart-card">
              <h4 className="lmd-chart-title">Failure Rate by Slot</h4>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.timeSlotData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="timeSlot" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-25} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Line type="monotone" dataKey="failureRate" name="Failure %" stroke={COLORS.rose} strokeWidth={2} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="lmd-chart-card">
              <h4 className="lmd-chart-title">Cost Efficiency by Slot</h4>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.timeSlotData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="timeSlot" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-25} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[40, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Area type="monotone" dataKey="costEfficiency" name="Efficiency %" fill="#0d948833" stroke={COLORS.teal} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="lmd-timeslot-summary-grid">
            {data.timeSlotData.map((ts) => (
              <div key={ts.id} className="lmd-timeslot-card">
                <h5 className="lmd-timeslot-label">{ts.timeSlot}</h5>
                <div className="lmd-timeslot-metrics">
                  <div><span className="lmd-timeslot-val">{ts.totalDeliveries}</span><span className="lmd-timeslot-sub">Volume</span></div>
                  <div><span className="lmd-timeslot-val">{ts.successRate}%</span><span className="lmd-timeslot-sub">Success</span></div>
                  <div><span className="lmd-timeslot-val">{ts.avgRating}</span><span className="lmd-timeslot-sub">Rating</span></div>
                  <div><span className="lmd-timeslot-val">{ts.codPercentage}%</span><span className="lmd-timeslot-sub">COD</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="lmd-root">
      <PageHeader title="Last Mile Delivery Analytics" description="Monitor delivery performance, rider efficiency, zone analytics, and failure patterns across your last-mile network" />
      <div className="lmd-tabs">
        {tabs.map((tab, idx) => (
          <button key={idx} className={cn("lmd-tab-btn", activeTab === idx && "lmd-tab-btn-active")} onClick={() => setActiveTab(idx)}>{tab.title}</button>
        ))}
      </div>
      <div className="lmd-tab-content">{tabs[activeTab].content}</div>
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="lmd-sheet" side="right">
          <div className="lmd-sheet-body">{renderDrawer()}</div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
