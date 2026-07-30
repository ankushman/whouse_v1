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
  Anchor, Ship, Plane, TrainFront, Globe, Radio, Satellite,
  Thermometer, Droplets, Snowflake, Wind, CloudRain, Gauge,
  type LucideIcon,
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
const SHIPMENT_STATUSES = ["Booked", "In Transit", "Customs Hold", "At Port", "Loading", "Unloading", "Last Mile", "Delivered", "Exception", "Returned"] as const
const TRANSPORT_MODES = ["Ocean", "Air", "Road", "Rail", "Multimodal"] as const
const INCOTERMS = ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"] as const
const WEATHER_CONDITIONS = ["Clear", "Partly Cloudy", "Rainy", "Stormy", "Foggy", "Windy"] as const
const ALERT_TYPES = ["Delay", "Route Deviation", "Temperature", "Customs", "Documentation", "Security", "Equipment", "Weather"] as const
const ALERT_SEVERITIES = ["Critical", "High", "Medium", "Low", "Info"] as const
const NODE_TYPES = ["Origin", "Port", "ICD", "CFS", "Hub", "Transit", "Destination"] as const
const CARRIER_STATUSES = ["On Track", "Delayed", "Early", "At Risk", "Diverted"] as const
const DOCUMENT_TYPES = ["Bill of Lading", "Commercial Invoice", "Packing List", "Certificate of Origin", "Customs Declaration", "Insurance", "Phyto Certificate", "Fumigation"] as const
const DOC_STATUSES = ["Pending", "Submitted", "Approved", "Rejected", "Expired"] as const
const TRACKING_TYPES = ["GPS", "RFID", "Barcode", "IoT Sensor", "API Integration"] as const
const INDIAN_PORTS = ["JNPT Mumbai", "Mundra", "Chennai", "Hazira", "Kolkata Haldia", "Cochin", "Tuticorin", "Kandla", "Vizag", "Mormugao"] as const
const ORIGINS = ["Shanghai", "Shenzhen", "Ningbo", "Busan", "Singapore", "Rotterdam", "Dubai", "Colombo", "Hong Kong", "Hamburg", "Tianjin", "Qingdao", "Kaohsiung", "Port Klang", "Tokyo"] as const
const DESTINATIONS = ["Mumbai ICD", "Delhi ICD Tughlakabad", "Chennai ICD", "Kolkata CFS", "Bangalore APM", "Hyderabad ICD", "Ahmedabad ICD", "Pune DICC", "Jaipur ICD", "Cochin Port"] as const
const CARRIER_NAMES = [
  "Maersk Line", "MSC", "CMA CGM", "Hapag-Lloyd", "ONE", "Evergreen",
  "COSCO", "ZIM", "Yang Ming", "HMM", "PIL", "X-Press Feeders",
  "Samudera Shipping", "Shreyas Shipping", "SCI Shipping India",
  "Container Corporation", "BlueDart Logistics", "Delhivery Freight",
  "Allcargo Logistics", "VRL Logistics", "TCI Freight", "SafeExpress",
  "DHL Supply Chain", "FedEx Trade Networks", "Kuehne+Nagel India",
] as const

// ============================================================================
// Color Maps
// ============================================================================
const STATUS_COLORS: Record<string, string> = {
  "Booked": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "In Transit": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 scv-status-pulse-active",
  "Customs Hold": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 scv-status-pulse-warning",
  "At Port": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Loading": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Unloading": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Last Mile": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Delivered": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Exception": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 scv-status-pulse-failed",
  "Returned": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
}
const MODE_COLORS: Record<string, string> = {
  "Ocean": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Air": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Road": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Rail": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Multimodal": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
}
const MODE_ICONS: Record<string, string> = { "Ocean": "🚢", "Air": "✈️", "Road": "🚛", "Rail": "🚂", "Multimodal": "🔀" }
const SEVERITY_COLORS: Record<string, string> = {
  "Critical": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 scv-status-pulse-failed",
  "High": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Medium": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Low": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Info": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
}
const ALERT_TYPE_COLORS: Record<string, string> = {
  "Delay": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Route Deviation": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Temperature": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Customs": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Documentation": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Security": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Equipment": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Weather": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
}
const CARRIER_STATUS_COLORS: Record<string, string> = {
  "On Track": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Delayed": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 scv-status-pulse-warning",
  "Early": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "At Risk": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 scv-status-pulse-failed",
  "Diverted": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 scv-status-pulse-failed",
}
const DOC_STATUS_COLORS: Record<string, string> = {
  "Pending": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Submitted": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Approved": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Rejected": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Expired": "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
}
const WEATHER_COLORS: Record<string, string> = {
  "Clear": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Partly Cloudy": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "Rainy": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Stormy": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 scv-status-pulse-failed",
  "Foggy": "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
  "Windy": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
}
const WEATHER_ICONS: Record<string, string> = { "Clear": "☀️", "Partly Cloudy": "⛅", "Rainy": "🌧️", "Stormy": "⛈️", "Foggy": "🌫️", "Windy": "💨" }
const TRACKING_COLORS: Record<string, string> = {
  "GPS": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "RFID": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Barcode": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "IoT Sensor": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "API Integration": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
}
const CHART_COLORS = ["#0d9488", "#7c3aed", "#ea580c", "#e11d48", "#0891b2", "#d97706", "#059669", "#6366f1"]

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const statuses = SHIPMENT_STATUSES
  const modes = TRANSPORT_MODES
  const incoterms = INCOTERMS
  const weather = WEATHER_CONDITIONS
  const alertTypes = ALERT_TYPES
  const alertSevs = ALERT_SEVERITIES
  const nodeTypes = NODE_TYPES
  const carrierStats = CARRIER_STATUSES
  const docTypes = DOCUMENT_TYPES
  const docStats = DOC_STATUSES
  const trackingTypes = TRACKING_TYPES
  const ports = INDIAN_PORTS
  const origins = ORIGINS
  const destinations = DESTINATIONS
  const carriers = CARRIER_NAMES

  // Dashboard KPIs
  const kpis = {
    totalShipments: 2845, inTransit: 1247, exceptions: 38, avgTransitDays: 12.4,
    onTimeRate: 91.3, customsClearance: 94.7, activeAlerts: 23, trackingCoverage: 96.8,
  }

  // Daily shipment chart
  const dailyShipments = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    Booked: ri(20, 60, i * 7 + 1),
    InTransit: ri(40, 100, i * 7 + 2),
    Delivered: ri(30, 80, i * 7 + 3),
    Exception: ri(1, 8, i * 7 + 4),
  }))

  // Mode distribution pie
  const modeDistribution = modes.map((m, i) => ({
    name: m,
    value: ri(100, 500, i * 13 + 200),
  }))

  // Port throughput bar
  const portThroughput = ports.map((p, i) => ({
    port: p.split(" ")[0],
    TEUs: ri(500, 3000, i * 17 + 400),
    Clearance: ri(85, 98, i * 17 + 401),
  }))

  // Shipments
  const shipments = Array.from({ length: 80 }, (_, i) => {
    const s = i * 23 + 300
    const mode = pick(modes, s)
    return {
      id: `SVC-${String(20000 + i).slice(1)}`,
      blNumber: mode === "Ocean" ? `BL${String(900000 + i).slice(1)}` : mode === "Air" ? `AWB${String(200000 + i).slice(1)}` : `LR-${String(50000 + i).slice(1)}`,
      status: pick(statuses, s + 1),
      mode,
      origin: pick(origins, s + 2),
      destination: pick(destinations, s + 3),
      carrier: pick(carriers, s + 4),
      incoterm: pick(incoterms, s + 5),
      containers: ri(1, 12, s + 6),
      weight: `${(seededRandom(s + 7) * 25 + 1).toFixed(1)} MT`,
      eta: `${ri(1, 28, s + 8)}/${ri(1, 12, s + 9)}/2025`,
      etd: `${ri(1, 28, s + 10)}/${ri(1, 12, s + 11)}/2025`,
      transitDays: ri(3, 45, s + 12),
      value: formatINR(ri(500000, 50000000, s + 13)),
      tracking: pick(trackingTypes, s + 14),
      weather: pick(weather, s + 15),
      temperature: mode === "Ocean" || mode === "Air" ? `${(seededRandom(s + 16) * 30 - 5).toFixed(1)}°C` : "—",
      humidity: `${ri(40, 95, s + 17)}%`,
    }
  })

  // Alerts
  const alerts = Array.from({ length: 65 }, (_, i) => {
    const s = i * 31 + 800
    const severity = pick(alertSevs, s)
    return {
      id: `ALT-${String(3000 + i).slice(1)}`,
      type: pick(alertTypes, s + 1),
      severity,
      shipment: `SVC-${String(20000 + ri(0, 79, s + 2)).slice(1)}`,
      description: [
        "Shipment delayed due to port congestion",
        "Vessel rerouted due to weather conditions",
        "Temperature excursion detected in container",
        "Customs hold — documents pending verification",
        "Container weight mismatch at port entry",
        "Security alert — unauthorized access attempt",
        "Equipment malfunction — crane unavailable",
        "Weather advisory — cyclone warning issued",
        "Transit time exceeded SLA threshold",
        "Documentation deadline approaching",
        "Route deviation — carrier notified",
        "Insurance claim initiated for damage",
      ][ri(0, 11, s + 3)],
      location: pick(ports, s + 4),
      acknowledged: severity === "Low" || severity === "Info" ? seededRandom(s + 5) > 0.5 : seededRandom(s + 5) > 0.8,
      resolved: seededRandom(s + 6) > 0.7,
      createdAt: `${ri(1, 28, s + 7)}/${ri(1, 12, s + 8)}/2025`,
      resolvedAt: seededRandom(s + 6) > 0.7 ? `${ri(1, 28, s + 9)}/${ri(1, 12, s + 10)}/2025` : "—",
    }
  })

  // Carrier performance
  const carrierPerf = Array.from({ length: 55 }, (_, i) => {
    const s = i * 37 + 1200
    const cs = pick(carrierStats, s)
    return {
      id: `CR-${String(4000 + i).slice(1)}`,
      carrier: pick(carriers, s + 1),
      mode: pick(modes, s + 2),
      status: cs,
      shipments: ri(5, 80, s + 3),
      onTimeRate: ri(70, 99, s + 4),
      avgTransitDays: +(seededRandom(s + 5) * 20 + 3).toFixed(1),
      damageRate: +(seededRandom(s + 6) * 5).toFixed(1),
      costIndex: +(seededRandom(s + 7) * 50 + 80).toFixed(0),
      lastShipment: `${ri(1, 28, s + 8)}/${ri(1, 12, s + 9)}/2025`,
      compliance: ri(80, 100, s + 10),
    }
  })

  // Document tracker
  const documents = Array.from({ length: 70 }, (_, i) => {
    const s = i * 41 + 1600
    const ds = pick(docStats, s)
    return {
      id: `DOC-${String(6000 + i).slice(1)}`,
      shipment: `SVC-${String(20000 + ri(0, 79, s + 1)).slice(1)}`,
      type: pick(docTypes, s + 2),
      status: ds,
      submittedDate: `${ri(1, 28, s + 3)}/${ri(1, 12, s + 4)}/2025`,
      expiryDate: `${ri(1, 28, s + 5)}/${ri(1, 12, s + 6)}/2025`,
      issuedBy: pick(origins, s + 7),
      destination: pick(destinations, s + 8),
      verifiedBy: ds === "Approved" ? ["CBIC Mumbai", "ICE Chennai", "CBIC Delhi", "Customs Kolkata"][ri(0, 3, s + 9)] : "—",
      remarks: ds === "Rejected" ? "Incorrect HS code classification" : ds === "Pending" ? "Awaiting origin documents" : "",
    }
  })

  // Analytics KPIs
  const analyticsKpis = {
    avgTransitTime: "12.4 days", onTimeDelivery: "91.3%", exceptionRate: "1.3%",
    customsEfficiency: "94.7%", avgCostPerTEU: "₹42K", docCompliance: "97.2%",
    trackingAccuracy: "96.8%", carrierDiversity: 25,
  }
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    Shipments: ri(300, 600, i * 47 + 2400),
    OnTime: ri(250, 500, i * 47 + 2401),
    Exceptions: ri(3, 25, i * 47 + 2402),
  }))
  const modePerformance = modes.map((m, i) => ({
    mode: m,
    OnTime: ri(75, 98, i * 53 + 2600),
    Cost: ri(60, 200, i * 53 + 2601),
  }))
  const alertByType = alertTypes.map((a, i) => ({
    type: a,
    count: ri(5, 50, i * 59 + 2800),
  }))
  const carrierPerformanceChart = Array.from({ length: 8 }, (_, i) => ({
    name: pick(carriers, i * 61 + 3000).split(" ")[0],
    OnTime: ri(80, 99, i * 61 + 3001),
    Compliance: ri(85, 100, i * 61 + 3002),
    DamageRate: ri(0, 5, i * 61 + 3003),
  }))
  const costTrend = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    Ocean: ri(1000000, 3000000, i * 67 + 3200),
    Air: ri(2000000, 5000000, i * 67 + 3201),
    Road: ri(500000, 1500000, i * 67 + 3202),
    Rail: ri(300000, 800000, i * 67 + 3203),
  }))

  return {
    kpis, dailyShipments, modeDistribution, portThroughput, shipments,
    alerts, carrierPerf, documents, analyticsKpis, monthlyTrend,
    modePerformance, alertByType, carrierPerformanceChart, costTrend,
  }
}

// ============================================================================
// Unique Visual Components
// ============================================================================
function ShipmentStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>
      {(status === "In Transit" || status === "Loading" || status === "Unloading" || status === "Last Mile") && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" /></span>}
      {status === "Exception" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" /></span>}
      {(status === "Customs Hold" || status === "Returned") && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" /></span>}
      {status}
    </span>
  )
}

function TransportModeBadge({ mode }: { mode: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", MODE_COLORS[mode] || "")}>
      {MODE_ICONS[mode]} {mode}
    </span>
  )
}

function IncotermBadge({ incoterm }: { incoterm: string }) {
  return <span className="inline-flex items-center rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{incoterm}</span>
}

function WeatherBadge({ condition }: { condition: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", WEATHER_COLORS[condition] || "")}>
      {WEATHER_ICONS[condition]} {condition}
    </span>
  )
}

function AlertSeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", SEVERITY_COLORS[severity] || "")}>
      {severity === "Critical" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" /></span>}
      {severity}
    </span>
  )
}

function AlertTypeBadge({ type }: { type: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", ALERT_TYPE_COLORS[type] || "")}>{type}</span>
}

function CarrierStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", CARRIER_STATUS_COLORS[status] || "")}>
      {(status === "Delayed" || status === "At Risk") && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" /></span>}
      {status === "Diverted" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" /></span>}
      {status}
    </span>
  )
}

function DocumentStatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", DOC_STATUS_COLORS[status] || "")}>{status}</span>
}

function TrackingTypeBadge({ type }: { type: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", TRACKING_COLORS[type] || "")}>{type}</span>
}

function TemperatureTile({ temp }: { temp: string }) {
  if (temp === "—") return <span className="text-xs text-gray-400">—</span>
  const num = parseFloat(temp)
  const color = num > 25 ? "text-rose-600 dark:text-rose-400" : num < 5 ? "text-cyan-600 dark:text-cyan-400" : "text-emerald-600 dark:text-emerald-400"
  return (
    <div className="scv-tile-temp flex items-center gap-1">
      <Thermometer className={cn("h-3.5 w-3.5", color)} />
      <span className={cn("text-xs font-semibold", color)}>{temp}</span>
    </div>
  )
}

function HumidityTile({ humidity }: { humidity: string }) {
  return (
    <div className="scv-tile-humidity flex items-center gap-1">
      <Droplets className="h-3.5 w-3.5 text-blue-500" />
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{humidity}</span>
    </div>
  )
}

function RouteTile({ origin, destination, mode }: { origin: string; destination: string; mode: string }) {
  return (
    <div className="scv-tile-route flex items-center gap-2 text-xs">
      <span className="font-medium text-gray-900 dark:text-gray-100">{origin}</span>
      <div className="flex items-center gap-1 text-gray-400">
        <div className="h-px w-8 bg-gray-300 dark:bg-gray-600" />
        <span>{MODE_ICONS[mode]}</span>
        <div className="h-px w-8 bg-gray-300 dark:bg-gray-600" />
      </div>
      <span className="font-medium text-gray-900 dark:text-gray-100">{destination}</span>
    </div>
  )
}

function OnTimeBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? "from-emerald-400 to-emerald-500" : pct >= 75 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"
  return (
    <div className="flex items-center gap-2">
      <div className="scv-ontime-bar h-2.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{pct}%</span>
    </div>
  )
}

function ComplianceBar({ pct }: { pct: number }) {
  const color = pct >= 95 ? "from-teal-400 to-teal-500" : pct >= 85 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"
  return (
    <div className="flex items-center gap-2">
      <div className="scv-compliance-bar h-2.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{pct}%</span>
    </div>
  )
}

function DamageRateTile({ rate }: { rate: number }) {
  const num = rate
  const color = num <= 1 ? "text-emerald-600 dark:text-emerald-400" : num <= 3 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"
  return <span className={cn("text-xs font-bold", color)}>{num}%</span>
}

function ContainerCountBadge({ count }: { count: number }) {
  const color = count <= 3 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : count <= 8 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", color)}>{count} TEU</span>
}

function ValueTile({ value }: { value: string }) {
  return (
    <div className="scv-tile-value flex items-center gap-1">
      <IndianRupee className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{value}</span>
    </div>
  )
}

function AcknowledgedIndicator({ acknowledged, resolved }: { acknowledged: boolean; resolved: boolean }) {
  if (resolved) return <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><CheckCircle2 className="h-3 w-3" /> Resolved</span>
  if (acknowledged) return <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"><Eye className="h-3 w-3" /> Acknowledged</span>
  return <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-900/40 dark:text-gray-300"><AlertTriangle className="h-3 w-3" /> Pending</span>
}

// ============================================================================
// Main Component
// ============================================================================
export default function SupplyChainVisibilityView() {
  const [activeTab, setActiveTab] = useState("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedShipment, setSelectedShipment] = useState<typeof data.shipments[0] | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<typeof data.alerts[0] | null>(null)
  const [selectedCarrier, setSelectedCarrier] = useState<typeof data.carrierPerf[0] | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<typeof data.documents[0] | null>(null)
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
      <div className={cn("flex items-center gap-1 transition-all", sortCol === col ? "font-bold text-teal-700 dark:text-teal-300 scale-105" : "hover:text-teal-600")}>
        {children} {sortCol === col && (sortAsc ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
      </div>
    </TableHead>
  )

  const kpis = [
    { label: "Total Shipments", value: data.kpis.totalShipments.toLocaleString(), icon: Package, color: "from-teal-500 to-teal-600", change: "+8%" },
    { label: "In Transit", value: data.kpis.inTransit.toLocaleString(), icon: Ship, color: "from-blue-500 to-blue-600", change: "+12%" },
    { label: "Exceptions", value: data.kpis.exceptions.toString(), icon: AlertTriangle, color: "from-rose-500 to-rose-600", change: "-22%" },
    { label: "Avg Transit Days", value: data.kpis.avgTransitDays.toString(), icon: Timer, color: "from-amber-500 to-amber-600", change: "-0.8" },
    { label: "On-Time Rate", value: `${data.kpis.onTimeRate}%`, icon: Gauge, color: "from-emerald-500 to-emerald-600", change: "+2.1%" },
    { label: "Customs Clearance", value: `${data.kpis.customsClearance}%`, icon: ShieldCheck, color: "from-violet-500 to-violet-600", change: "+1.5%" },
    { label: "Active Alerts", value: data.kpis.activeAlerts.toString(), icon: Radio, color: "from-orange-500 to-orange-600", change: "-5" },
    { label: "Tracking Coverage", value: `${data.kpis.trackingCoverage}%`, icon: Satellite, color: "from-indigo-500 to-indigo-600", change: "+0.4%" },
  ]

  const filteredShipments = sortData(
    data.shipments.filter(s =>
      !searchTerm || s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.blNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    sortCol || "id"
  )
  const filteredAlerts = sortData(data.alerts, sortCol || "severity")
  const filteredCarriers = sortData(data.carrierPerf, sortCol || "onTimeRate")
  const filteredDocs = sortData(data.documents, sortCol || "status")

  const analyticsKpiList = [
    { label: "Avg Transit Time", value: data.analyticsKpis.avgTransitTime, icon: Timer, color: "from-teal-500 to-teal-600" },
    { label: "On-Time Delivery", value: data.analyticsKpis.onTimeDelivery, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
    { label: "Exception Rate", value: data.analyticsKpis.exceptionRate, icon: AlertTriangle, color: "from-rose-500 to-rose-600" },
    { label: "Customs Efficiency", value: data.analyticsKpis.customsEfficiency, icon: ShieldCheck, color: "from-violet-500 to-violet-600" },
    { label: "Avg Cost/TEU", value: data.analyticsKpis.avgCostPerTEU, icon: IndianRupee, color: "from-amber-500 to-amber-600" },
    { label: "Doc Compliance", value: data.analyticsKpis.docCompliance, icon: CheckCircle2, color: "from-blue-500 to-blue-600" },
    { label: "Tracking Accuracy", value: data.analyticsKpis.trackingAccuracy, icon: Satellite, color: "from-indigo-500 to-indigo-600" },
    { label: "Carrier Diversity", value: data.analyticsKpis.carrierDiversity.toString(), icon: Globe, color: "from-cyan-500 to-cyan-600" },
  ]

  return (
    <div className="scv-container space-y-4">
      <PageHeader title="Supply Chain Visibility" description="End-to-end shipment tracking across ocean, air, road & rail for India trade lanes" />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="scv-tabs-list bg-gray-100 dark:bg-gray-800">
          {["Visibility Dashboard", "Shipment Tracker", "Alerts & Exceptions", "Carrier Performance", "Document Tracker", "Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="scv-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ===== Tab 0: Dashboard ===== */}
        <TabsContent value="0" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className="scv-kpi-card relative overflow-hidden border-l-4" style={{ borderLeftColor: i === 0 ? "#0d9488" : i === 1 ? "#3b82f6" : i === 2 ? "#e11d48" : i === 3 ? "#d97706" : i === 4 ? "#059669" : i === 5 ? "#7c3aed" : i === 6 ? "#ea580c" : "#6366f1" }}>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80" style={{ background: `linear-gradient(90deg, ${i === 0 ? "#0d9488" : "#3b82f6"}, ${i === 0 ? "#14b8a6" : "#60a5fa"})` }} />
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{k.label}</p>
                      <p className="scv-kpi-value mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{k.value}</p>
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{k.change}</p>
                    </div>
                    <div className={cn("scv-kpi-icon flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md", k.color)}>
                      <k.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="scv-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Daily Shipment Volume</CardTitle></CardHeader><CardContent><AreaChart data={data.dailyShipments}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="Booked" stackId="1" stroke="#3b82f6" fill="#3b82f680" /><Area type="monotone" dataKey="InTransit" stackId="1" stroke="#7c3aed" fill="#7c3aed80" /><Area type="monotone" dataKey="Delivered" stackId="1" stroke="#059669" fill="#05966980" /><Area type="monotone" dataKey="Exception" stackId="1" stroke="#e11d48" fill="#e11d4880" /></AreaChart></CardContent></Card>
            <Card className="scv-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Transport Mode Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.modeDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{data.modeDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="scv-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Port Throughput (TEUs)</CardTitle></CardHeader><CardContent><BarChart data={data.portThroughput}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="port" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="TEUs" fill="#0d9488" /></BarChart></CardContent></Card>
          </div>
        </TabsContent>

        {/* ===== Tab 1: Shipment Tracker ===== */}
        <TabsContent value="1" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search by ID, BL/AWB, origin or destination..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); toast.info("Cleared", "All filters reset") }}>Clear</Button>
          </div>
          <Card className="card-crud-lift scv-table-card overflow-hidden">
            <CardContent className="glass-subtle p-0">
              <Table className="table-hover-highlight">
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="id">ID</SortHeader>
                  <SortHeader col="blNumber">BL/AWB</SortHeader>
                  <SortHeader col="status">Status</SortHeader>
                  <SortHeader col="mode">Mode</SortHeader>
                  <TableHead>Route</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Incoterm</TableHead>
                  <TableHead>TEU</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Weather</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredShipments.slice(0, 25).map((s, i) => (
                    <TableRow key={s.id} className={cn("scv-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-teal-50/50 dark:hover:bg-teal-950/20")}>
                      <TableCell className="font-mono text-xs font-medium">{s.id}</TableCell>
                      <TableCell className="font-mono text-xs">{s.blNumber}</TableCell>
                      <TableCell><ShipmentStatusBadge status={s.status} /></TableCell>
                      <TableCell><TransportModeBadge mode={s.mode} /></TableCell>
                      <TableCell><RouteTile origin={s.origin} destination={s.destination} mode={s.mode} /></TableCell>
                      <TableCell className="text-xs max-w-[120px] truncate">{s.carrier}</TableCell>
                      <TableCell><IncotermBadge incoterm={s.incoterm} /></TableCell>
                      <TableCell><ContainerCountBadge count={s.containers} /></TableCell>
                      <TableCell><ValueTile value={s.value} /></TableCell>
                      <TableCell className="text-xs">{s.eta}</TableCell>
                      <TableCell><WeatherBadge condition={s.weather} /></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="scv-action-btn" onClick={() => { setSelectedShipment(s); toast.info("Shipment", `Tracking ${s.id}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Tab 2: Alerts ===== */}
        <TabsContent value="2" className="space-y-4">
          <Card className="card-crud-lift scv-table-card overflow-hidden">
            <CardContent className="glass-subtle p-0">
              <Table className="table-hover-highlight">
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="severity">Severity</SortHeader>
                  <TableHead>Type</TableHead>
                  <TableHead>Shipment</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredAlerts.slice(0, 25).map((a, i) => (
                    <TableRow key={a.id} className={cn("scv-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-teal-50/50 dark:hover:bg-teal-950/20")}>
                      <TableCell><AlertSeverityBadge severity={a.severity} /></TableCell>
                      <TableCell><AlertTypeBadge type={a.type} /></TableCell>
                      <TableCell className="font-mono text-xs">{a.shipment}</TableCell>
                      <TableCell className="max-w-[220px] truncate text-xs">{a.description}</TableCell>
                      <TableCell className="text-xs">{a.location}</TableCell>
                      <TableCell><AcknowledgedIndicator acknowledged={a.acknowledged} resolved={a.resolved} /></TableCell>
                      <TableCell className="text-xs">{a.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" className="scv-action-btn" onClick={() => { setSelectedAlert(a); toast.info("Alert", `Viewing ${a.id}`) }}><Eye className="h-4 w-4" /></Button>
                          {!a.resolved && <Button size="sm" variant="ghost" className="scv-action-btn text-emerald-600" onClick={() => toast.success("Resolved", `Alert ${a.id} marked resolved`)}><CheckCircle2 className="h-4 w-4" /></Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Tab 3: Carrier Performance ===== */}
        <TabsContent value="3" className="space-y-4">
          <Card className="card-crud-lift scv-table-card overflow-hidden">
            <CardContent className="glass-subtle p-0">
              <Table className="table-hover-highlight">
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="carrier">Carrier</SortHeader>
                  <SortHeader col="mode">Mode</SortHeader>
                  <SortHeader col="status">Status</SortHeader>
                  <SortHeader col="shipments">Shipments</SortHeader>
                  <SortHeader col="onTimeRate">On-Time</SortHeader>
                  <SortHeader col="avgTransitDays">Avg Transit</SortHeader>
                  <TableHead>Damage</TableHead>
                  <SortHeader col="compliance">Compliance</SortHeader>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredCarriers.slice(0, 25).map((c, i) => (
                    <TableRow key={c.id} className={cn("scv-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-teal-50/50 dark:hover:bg-teal-950/20")}>
                      <TableCell className="text-xs font-medium max-w-[150px] truncate">{c.carrier}</TableCell>
                      <TableCell><TransportModeBadge mode={c.mode} /></TableCell>
                      <TableCell><CarrierStatusBadge status={c.status} /></TableCell>
                      <TableCell className="text-xs text-center">{c.shipments}</TableCell>
                      <TableCell><OnTimeBar pct={c.onTimeRate} /></TableCell>
                      <TableCell className="text-xs">{c.avgTransitDays}d</TableCell>
                      <TableCell><DamageRateTile rate={c.damageRate} /></TableCell>
                      <TableCell><ComplianceBar pct={c.compliance} /></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="scv-action-btn" onClick={() => { setSelectedCarrier(c); toast.info("Carrier", `Viewing ${c.carrier}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Tab 4: Documents ===== */}
        <TabsContent value="4" className="space-y-4">
          <Card className="card-crud-lift scv-table-card overflow-hidden">
            <CardContent className="glass-subtle p-0">
              <Table className="table-hover-highlight">
                <TableHeader><TableRow className="bg-gray-50/80 dark:bg-gray-800/80">
                  <SortHeader col="id">Doc ID</SortHeader>
                  <TableHead>Shipment</TableHead>
                  <SortHeader col="type">Type</SortHeader>
                  <SortHeader col="status">Status</SortHeader>
                  <TableHead>Issued By</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Verified By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredDocs.slice(0, 25).map((d, i) => (
                    <TableRow key={d.id} className={cn("scv-table-row transition-colors", i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/50", "hover:bg-teal-50/50 dark:hover:bg-teal-950/20")}>
                      <TableCell className="font-mono text-xs">{d.id}</TableCell>
                      <TableCell className="font-mono text-xs">{d.shipment}</TableCell>
                      <TableCell><span className="text-xs font-medium">{d.type}</span></TableCell>
                      <TableCell><DocumentStatusBadge status={d.status} /></TableCell>
                      <TableCell className="text-xs">{d.issuedBy}</TableCell>
                      <TableCell className="text-xs max-w-[120px] truncate">{d.destination}</TableCell>
                      <TableCell className="text-xs">{d.submittedDate}</TableCell>
                      <TableCell className="text-xs">{d.expiryDate}</TableCell>
                      <TableCell className="text-xs">{d.verifiedBy}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" className="scv-action-btn" onClick={() => { setSelectedDoc(d); toast.info("Document", `Viewing ${d.id}`) }}><Eye className="h-4 w-4" /></Button></TableCell>
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
              <Card key={i} className="scv-analytics-card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("scv-analytics-icon flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", k.color)}><k.icon className="h-4.5 w-4.5" /></div>
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
            <Card className="scv-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Monthly Shipment Trend</CardTitle></CardHeader><CardContent><LineChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="Shipments" stroke="#0d9488" strokeWidth={2} /><Line type="monotone" dataKey="OnTime" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="Exceptions" stroke="#e11d48" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="scv-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Mode Performance</CardTitle></CardHeader><CardContent><BarChart data={data.modePerformance}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mode" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="OnTime" fill="#0d9488" /><Bar dataKey="Cost" fill="#7c3aed" /></BarChart></CardContent></Card>
            <Card className="scv-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Alerts by Type</CardTitle></CardHeader><CardContent><BarChart data={data.alertByType} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="type" type="category" tick={{ fontSize: 10 }} width={100} /><Tooltip /><Bar dataKey="count" fill="#e11d48" /></BarChart></CardContent></Card>
            <Card className="scv-chart-card"><CardHeader><CardTitle className="text-sm font-semibold">Cost by Mode (6-Month)</CardTitle></CardHeader><CardContent><AreaChart data={data.costTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => formatINR(v)} /><Area type="monotone" dataKey="Ocean" stackId="1" stroke="#3b82f6" fill="#3b82f680" /><Area type="monotone" dataKey="Air" stackId="1" stroke="#7c3aed" fill="#7c3aed80" /><Area type="monotone" dataKey="Road" stackId="1" stroke="#d97706" fill="#d9770680" /><Area type="monotone" dataKey="Rail" stackId="1" stroke="#059669" fill="#05966980" /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ===== Sheet: Shipment ===== */}
      <Sheet open={!!selectedShipment} onOpenChange={open => { if (!open) setSelectedShipment(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedShipment && (
            <>
              <SheetHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
                <SheetTitle className="text-white flex items-center gap-2"><Ship className="h-5 w-5" /> Shipment {selectedShipment.id}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Status</p><ShipmentStatusBadge status={selectedShipment.status} /></div>
                  <div><p className="text-xs text-gray-500">BL/AWB</p><p className="font-mono text-sm font-medium">{selectedShipment.blNumber}</p></div>
                  <div><p className="text-xs text-gray-500">Mode</p><TransportModeBadge mode={selectedShipment.mode} /></div>
                  <div><p className="text-xs text-gray-500">Incoterm</p><IncotermBadge incoterm={selectedShipment.incoterm} /></div>
                  <div><p className="text-xs text-gray-500">Containers</p><ContainerCountBadge count={selectedShipment.containers} /></div>
                  <div><p className="text-xs text-gray-500">Weight</p><span className="text-sm font-medium">{selectedShipment.weight}</span></div>
                </div>
                <Separator />
                <div><p className="text-xs text-gray-500 mb-1">Route</p><RouteTile origin={selectedShipment.origin} destination={selectedShipment.destination} mode={selectedShipment.mode} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Carrier</p><p className="text-sm font-medium">{selectedShipment.carrier}</p></div>
                  <div><p className="text-xs text-gray-500">Tracking</p><TrackingTypeBadge type={selectedShipment.tracking} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">ETD</p><p className="text-sm">{selectedShipment.etd}</p></div>
                  <div><p className="text-xs text-gray-500">ETA</p><p className="text-sm">{selectedShipment.eta}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <TemperatureTile temp={selectedShipment.temperature} />
                  <HumidityTile humidity={selectedShipment.humidity} />
                  <WeatherBadge condition={selectedShipment.weather} />
                </div>
                <div><p className="text-xs text-gray-500">Value</p><ValueTile value={selectedShipment.value} /></div>
                <div className="flex gap-2 pt-2">
                  <Button className="scv-action-btn flex-1 bg-teal-600 hover:bg-teal-700" onClick={() => toast.success("Updated", `Shipment ${selectedShipment.id} updated`)}>Update Status</Button>
                  <Button variant="outline" className="btn-outline-animate scv-action-btn" onClick={() => toast.info("Tracking", `Live tracking for ${selectedShipment.id}`)}>Track Live</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ===== Sheet: Alert ===== */}
      <Sheet open={!!selectedAlert} onOpenChange={open => { if (!open) setSelectedAlert(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedAlert && (
            <>
              <SheetHeader className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
                <SheetTitle className="text-white flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Alert {selectedAlert.id}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Severity</p><AlertSeverityBadge severity={selectedAlert.severity} /></div>
                  <div><p className="text-xs text-gray-500">Type</p><AlertTypeBadge type={selectedAlert.type} /></div>
                  <div><p className="text-xs text-gray-500">Status</p><AcknowledgedIndicator acknowledged={selectedAlert.acknowledged} resolved={selectedAlert.resolved} /></div>
                  <div><p className="text-xs text-gray-500">Location</p><span className="text-sm">{selectedAlert.location}</span></div>
                </div>
                <Separator />
                <div><p className="text-xs text-gray-500 mb-1">Description</p><p className="text-sm">{selectedAlert.description}</p></div>
                <div><p className="text-xs text-gray-500">Shipment</p><p className="font-mono text-sm">{selectedAlert.shipment}</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Created</p><p className="text-sm">{selectedAlert.createdAt}</p></div>
                  <div><p className="text-xs text-gray-500">Resolved</p><p className="text-sm">{selectedAlert.resolvedAt}</p></div>
                </div>
                <div className="flex gap-2 pt-2">
                  {!selectedAlert.resolved ? (
                    <>
                      <Button className="scv-action-btn flex-1 bg-rose-600 hover:bg-rose-700" onClick={() => toast.success("Resolved", `Alert ${selectedAlert.id} resolved`)}>Resolve</Button>
                      <Button variant="outline" className="btn-outline-animate scv-action-btn" onClick={() => toast.info("Escalated", `Alert ${selectedAlert.id} escalated`)}>Escalate</Button>
                    </>
                  ) : (
                    <Button variant="outline" className="btn-outline-animate scv-action-btn flex-1" onClick={() => toast.info("Reopened", `Alert ${selectedAlert.id} reopened`)}>Reopen</Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ===== Sheet: Carrier ===== */}
      <Sheet open={!!selectedCarrier} onOpenChange={open => { if (!open) setSelectedCarrier(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedCarrier && (
            <>
              <SheetHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
                <SheetTitle className="text-white flex items-center gap-2"><Truck className="h-5 w-5" /> {selectedCarrier.carrier}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Status</p><CarrierStatusBadge status={selectedCarrier.status} /></div>
                  <div><p className="text-xs text-gray-500">Mode</p><TransportModeBadge mode={selectedCarrier.mode} /></div>
                  <div><p className="text-xs text-gray-500">Shipments</p><span className="text-lg font-bold">{selectedCarrier.shipments}</span></div>
                  <div><p className="text-xs text-gray-500">Avg Transit</p><span className="text-lg font-bold">{selectedCarrier.avgTransitDays}d</span></div>
                </div>
                <Separator />
                <div className="flex items-center justify-between"><span className="text-xs text-gray-500">On-Time Rate</span><OnTimeBar pct={selectedCarrier.onTimeRate} /></div>
                <div className="flex items-center justify-between"><span className="text-xs text-gray-500">Compliance</span><ComplianceBar pct={selectedCarrier.compliance} /></div>
                <div className="flex items-center justify-between"><span className="text-xs text-gray-500">Damage Rate</span><DamageRateTile rate={selectedCarrier.damageRate} /></div>
                <div><p className="text-xs text-gray-500">Last Shipment</p><p className="text-sm">{selectedCarrier.lastShipment}</p></div>
                <div className="flex gap-2 pt-2">
                  <Button className="scv-action-btn flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success("Review", `Carrier review for ${selectedCarrier.carrier}`)}>Review</Button>
                  <Button variant="outline" className="btn-outline-animate scv-action-btn" onClick={() => toast.info("Contract", `Viewing contract for ${selectedCarrier.carrier}`)}>View Contract</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ===== Sheet: Document ===== */}
      <Sheet open={!!selectedDoc} onOpenChange={open => { if (!open) setSelectedDoc(null) }}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          {selectedDoc && (
            <>
              <SheetHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 -mx-6 -mt-6 mb-4 rounded-b-xl">
                <SheetTitle className="text-white flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Document {selectedDoc.id}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Type</p><span className="text-sm font-medium">{selectedDoc.type}</span></div>
                  <div><p className="text-xs text-gray-500">Status</p><DocumentStatusBadge status={selectedDoc.status} /></div>
                  <div><p className="text-xs text-gray-500">Shipment</p><p className="font-mono text-sm">{selectedDoc.shipment}</p></div>
                  <div><p className="text-xs text-gray-500">Verified By</p><p className="text-sm">{selectedDoc.verifiedBy}</p></div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Issued By</p><p className="text-sm">{selectedDoc.issuedBy}</p></div>
                  <div><p className="text-xs text-gray-500">Destination</p><p className="text-sm">{selectedDoc.destination}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Submitted</p><p className="text-sm">{selectedDoc.submittedDate}</p></div>
                  <div><p className="text-xs text-gray-500">Expiry</p><p className="text-sm">{selectedDoc.expiryDate}</p></div>
                </div>
                {selectedDoc.remarks && <div><p className="text-xs text-gray-500">Remarks</p><p className="text-sm text-amber-600 dark:text-amber-400">{selectedDoc.remarks}</p></div>}
                <div className="flex gap-2 pt-2">
                  {selectedDoc.status === "Pending" ? (
                    <Button className="scv-action-btn flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("Submitted", `Document ${selectedDoc.id} submitted`)}>Submit</Button>
                  ) : selectedDoc.status === "Rejected" ? (
                    <>
                      <Button className="scv-action-btn flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => toast.info("Resubmitted", `Document ${selectedDoc.id} resubmitted`)}>Resubmit</Button>
                      <Button variant="outline" className="btn-outline-animate scv-action-btn" onClick={() => toast.info("Appeal", `Appeal for ${selectedDoc.id}`)}>Appeal</Button>
                    </>
                  ) : (
                    <Button variant="outline" className="btn-outline-animate scv-action-btn flex-1" onClick={() => toast.info("Download", `Downloading ${selectedDoc.id}`)}>Download</Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
