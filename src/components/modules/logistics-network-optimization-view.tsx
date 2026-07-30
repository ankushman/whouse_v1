"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartNetwork,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Eye,
  RefreshCw,
  Target,
  Zap,
  Activity,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Truck,
  Package,
  Warehouse,
  Route,
  Layers,
  AlertTriangle,
  DollarSign,
  Timer,
  GitBranch,
  ChevronRight,
  Star,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldCheck,
  Lightbulb,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
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

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const NODES = [
  "Mumbai DC", "Delhi NCR Hub", "Bengaluru WH", "Chennai Port WH",
  "Kolkata Distribution", "Hyderabad Fulfillment", "Pune Warehouse", "Ahmedabad Hub",
  "Jaipur Sorting", "Lucknow Regional", "Chandigarh Transit", "Indore Fulfillment",
  "Coimbatore Hub", "Bhopal Distribution", "Patna Regional", "Guwahati Gateway",
  "Kochi Port", "Visakhapatnam WH", "Nagpur Transit", "Goa Gateway",
] as const

const ROUTES = [
  "Mumbai–Delhi Corridor", "Delhi–Kolkata Express", "Chennai–Bengaluru Belt",
  "Mumbai–Pune Link", "Hyderabad–Chennai Route", "Delhi–Jaipur Express",
  "Kolkata–Guwahati Link", "Bengaluru–Coimbatore", "Mumbai–Ahmedabad Express",
  "Delhi–Lucknow Corridor", "Chennai–Kolkata Coastal", "Pune–Hyderabad Route",
  "Nagpur–Bhopal Central", "Indore–Ahmedabad Link", "Chandigarh–Delhi Express",
  "Jaipur–Indore Central", "Visakhapatnam–Chennai Port", "Kochi–Coimbatore Link",
  "Guwahati–Patna Route", "Lucknow–Patna Corridor",
] as const

const TRANSPORT_MODES = ["Road (FTL)", "Road (PTL)", "Rail", "Air", "Sea", "Multimodal"] as const
const ROUTE_TYPES = ["Primary", "Secondary", "Tertiary", "Last Mile", "Cross-Dock"] as const
const OPTIMIZATION_TYPES = ["Route Optimization", "Load Consolidation", "Mode Shifting", "Hub Reallocation", "Fleet Sizing", "Carbon Reduction"] as const
const IMPACT_LEVELS = ["Critical", "High", "Medium", "Low"] as const
const NODE_TYPES = ["Distribution Center", "Fulfillment Center", "Transit Hub", "Port Warehouse", "Regional Hub", "Gateway"] as const
const CITIES = ["Mumbai", "Delhi NCR", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"] as const

const COLORS = {
  teal: "#0d9488",
  indigo: "#6366f1",
  rose: "#e11d48",
  amber: "#f59e0b",
  emerald: "#059669",
  sky: "#0ea5e9",
  violet: "#8b5cf6",
  orange: "#f97316",
  pink: "#ec4899",
  lime: "#84cc16",
}

const MODE_COLORS: Record<string, string> = {
  "Road (FTL)": "#6366f1",
  "Road (PTL)": "#0ea5e9",
  "Rail": "#f59e0b",
  "Air": "#e11d48",
  "Sea": "#0d9488",
  "Multimodal": "#8b5cf6",
}

const IMPACT_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#f97316",
  Medium: "#f59e0b",
  Low: "#22c55e",
}

const NODE_TYPE_ICONS: Record<string, React.ReactNode> = {
  "Distribution Center": <Warehouse className="h-3.5 w-3" />,
  "Fulfillment Center": <Package className="h-3.5 w-3" />,
  "Transit Hub": <GitBranch className="h-3.5 w-3" />,
  "Port Warehouse": <Layers className="h-3.5 w-3" />,
  "Regional Hub": <MapPin className="h-3.5 w-3" />,
  "Gateway": <Route className="h-3.5 w-3" />,
}

// ─── Types ───────────────────────────────────────────────────────────────
interface NetworkNode {
  id: string
  name: string
  type: string
  city: string
  state: string
  capacity: number
  utilization: number
  throughput: number
  connections: number
  costPerUnit: number
  transitTime: number
  reliability: number
  carbonScore: number
  status: string
  monthlyThroughput: number
  expansionNeed: boolean
}

interface NetworkRoute {
  id: string
  name: string
  origin: string
  destination: string
  distance: number
  transitTime: number
  mode: string
  routeType: string
  costPerKm: number
  totalCost: number
  utilization: number
  reliability: number
  onTimeRate: number
  volumeCapacity: number
  currentVolume: number
  status: string
  co2PerTonKm: number
}

interface OptimizationOpportunity {
  id: string
  type: string
  route: string
  impact: string
  description: string
  currentCost: number
  proposedCost: number
  savings: number
  savingsPct: number
  implementationEffort: string
  timeline: string
  carbonReduction: number
  status: string
  priority: number
}

interface ScenarioSimulation {
  id: string
  name: string
  description: string
  type: string
  currentNetworkCost: number
  proposedNetworkCost: number
  savings: number
  serviceImprovement: number
  carbonReduction: number
  reliabilityImprovement: number
  complexity: string
  feasibility: number
  dateCreated: string
}

// ─── Data Generation ──────────────────────────────────────────────────────
function generateData() {
  const months = ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"]
  const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana", "Gujarat", "Rajasthan", "Uttar Pradesh", "Punjab", "Madhya Pradesh", "Bihar", "Assam", "Kerala", "Andhra Pradesh"]

  // ── Network Nodes — 20 ──
  const networkNodes: NetworkNode[] = Array.from({ length: 20 }, (_, i) => {
    const seed = i + 1001
    const s = seededRandom
    const name = NODES[i]
    const city = CITIES[Math.min(i, CITIES.length - 1)]
    const state = states[Math.min(i, states.length - 1)]
    const nodeType = NODE_TYPES[Math.floor(s(seed) * NODE_TYPES.length)]
    const capacity = Math.floor(s(seed + 1) * 8000) + 2000
    const utilization = Math.floor(s(seed + 2) * 50) + 35
    const throughput = Math.floor(capacity * utilization / 100)
    const connections = Math.floor(s(seed + 3) * 8) + 2
    const costPerUnit = Math.floor(s(seed + 4) * 80) + 20
    const transitTime = Math.floor(s(seed + 5) * 48) + 4
    const reliability = Math.floor(s(seed + 6) * 20) + 75
    const carbonScore = Math.floor(s(seed + 7) * 60) + 20
    const statuses = ["Optimal", "Near Capacity", "Expansion Needed", "Underutilized"]
    const status = utilization > 80 ? "Near Capacity" : utilization < 50 ? "Underutilized" : s(seed + 8) > 0.85 ? "Expansion Needed" : "Optimal"
    return {
      id: `ND-${String(i + 1).padStart(3, "0")}`,
      name, type: nodeType, city, state, capacity, utilization, throughput,
      connections, costPerUnit, transitTime, reliability, carbonScore, status,
      monthlyThroughput: Math.floor(throughput * (0.8 + s(seed + 9) * 0.4)),
      expansionNeed: utilization > 75 || s(seed + 10) > 0.9,
    }
  })

  // ── Network Routes — 50 ──
  const networkRoutes: NetworkRoute[] = Array.from({ length: 50 }, (_, i) => {
    const seed = i + 2001
    const s = seededRandom
    const routeName = ROUTES[i % ROUTES.length]
    const origin = NODES[Math.floor(s(seed) * NODES.length)]
    const dest = NODES[Math.floor(s(seed + 1) * (NODES.length - 1)) + 1]
    const mode = TRANSPORT_MODES[Math.floor(s(seed + 2) * TRANSPORT_MODES.length)]
    const routeType = ROUTE_TYPES[Math.floor(s(seed + 3) * ROUTE_TYPES.length)]
    const distance = Math.floor(s(seed + 4) * 2500) + 100
    const transitTime = Math.floor(distance / (mode === "Air" ? 800 : mode === "Rail" ? 60 : mode === "Sea" ? 25 : 40)) + Math.floor(s(seed + 5) * 12)
    const costPerKm = Math.floor((mode === "Air" ? 12 : mode === "Sea" ? 1.5 : mode === "Rail" ? 3 : mode === "Multimodal" ? 5 : 6) * (0.7 + s(seed + 6) * 0.6))
    const totalCost = Math.round(distance * costPerKm)
    const utilization = Math.floor(s(seed + 7) * 50) + 30
    const reliability = Math.floor(s(seed + 8) * 15) + 82
    const onTimeRate = Math.floor(s(seed + 9) * 20) + 75
    const volumeCap = Math.floor(s(seed + 10) * 500) + 50
    const currentVolume = Math.floor(volumeCap * utilization / 100)
    const status = utilization > 85 ? "Congested" : utilization < 40 ? "Underutilized" : "Active"
    const co2 = mode === "Air" ? Math.floor(s(seed + 11) * 800) + 600 : mode === "Sea" ? Math.floor(s(seed + 11) * 30) + 10 : mode === "Rail" ? Math.floor(s(seed + 11) * 40) + 15 : Math.floor(s(seed + 11) * 150) + 50
    return {
      id: `RT-${String(i + 1).padStart(3, "0")}`,
      name: routeName, origin, destination: dest, distance, transitTime,
      mode, routeType, costPerKm, totalCost, utilization, reliability,
      onTimeRate, volumeCapacity: volumeCap, currentVolume, status,
      co2PerTonKm: co2,
    }
  })

  // ── Optimization Opportunities — 45 ──
  const optDescriptions = [
    "Consolidate PTL shipments to FTL on this route to reduce per-unit cost by 25%",
    "Shift mode from Road to Rail for non-time-sensitive cargo, saving ₹2.4L/month",
    "Reallocate traffic from congested hub to underutilized secondary hub",
    "Introduce cross-dock stop to split deliveries and reduce last-mile distance",
    "Reduce empty return trips by matching backhaul loads, improving fleet utilization",
    "Implement dynamic routing to bypass congested corridors during peak hours",
    "Shift volumes to multimodal (road+rail) for mid-distance corridors",
    "Add secondary hub to reduce average delivery radius by 30%",
    "Consolidate shipments from 3 regional warehouses to single fulfillment center",
    "Implement night-time delivery to reduce congestion and transit time",
  ]
  const optEfforts = ["Low", "Medium", "High", "Very High"]
  const optTimelines = ["1-2 Weeks", "1 Month", "2-3 Months", "3-6 Months", "6+ Months"]
  const optStatuses = ["Identified", "Planned", "In Progress", "Implemented", "Rejected"]

  const optimizationOpportunities: OptimizationOpportunity[] = Array.from({ length: 45 }, (_, i) => {
    const seed = i + 3001
    const s = seededRandom
    const type = OPTIMIZATION_TYPES[Math.floor(s(seed) * OPTIMIZATION_TYPES.length)]
    const route = ROUTES[i % ROUTES.length]
    const impact = IMPACT_LEVELS[Math.floor(s(seed + 1) * IMPACT_LEVELS.length)]
    const currentCost = Math.floor(s(seed + 2) * 500000) + 100000
    const savingsPct = Math.floor(s(seed + 3) * 30) + 5
    const proposedCost = Math.round(currentCost * (1 - savingsPct / 100))
    return {
      id: `OP-${String(i + 1).padStart(3, "0")}`,
      type, route, impact,
      description: optDescriptions[i % optDescriptions.length],
      currentCost, proposedCost,
      savings: currentCost - proposedCost,
      savingsPct,
      implementationEffort: optEfforts[Math.floor(s(seed + 4) * optEfforts.length)],
      timeline: optTimelines[Math.floor(s(seed + 5) * optTimelines.length)],
      carbonReduction: Math.floor(s(seed + 6) * 40) + 5,
      status: optStatuses[Math.floor(s(seed + 7) * optStatuses.length)],
      priority: i + 1,
    }
  })

  // ── Scenario Simulations — 30 ──
  const scenarioNames = [
    "Add Nagpur Mega Hub", "Rail Mode Shift (Delhi-Mumbai)", "South India Consolidation",
    "East Coast Direct Link", "North India Rebalancing", "Multi-Modal Corridor",
    "Green Logistics Transition", "Last Mile Optimization", "Port Direct Connect",
    "Fleet Electrification Pilot", "Weekend Bypass Strategy", "Monsoon Route Redesign",
  ]
  const scenarioTypes = ["Network Redesign", "Mode Shift", "Hub Addition", "Route Optimization", "Fleet Strategy", "Carbon Reduction"]

  const scenarioSimulations: ScenarioSimulation[] = Array.from({ length: 30 }, (_, i) => {
    const seed = i + 4001
    const s = seededRandom
    const name = scenarioNames[i % scenarioNames.length]
    const scenType = scenarioTypes[Math.floor(s(seed) * scenarioTypes.length)]
    const currentCost = Math.floor(s(seed + 1) * 2000000) + 500000
    const savingsPct = Math.floor(s(seed + 2) * 20) + 3
    const day = Math.floor(s(seed + 3) * 28) + 1
    const complexities = ["Simple", "Moderate", "Complex", "Very Complex"]
    return {
      id: `SC-${String(i + 1).padStart(3, "0")}`,
      name,
      description: `${scenType}: ${name} — Comprehensive network simulation with cost, service, and carbon analysis`,
      type: scenType,
      currentNetworkCost: currentCost,
      proposedNetworkCost: Math.round(currentCost * (1 - savingsPct / 100)),
      savings: Math.round(currentCost * savingsPct / 100),
      serviceImprovement: Math.floor(s(seed + 4) * 15) + 1,
      carbonReduction: Math.floor(s(seed + 5) * 35) + 5,
      reliabilityImprovement: Math.floor(s(seed + 6) * 10) + 1,
      complexity: complexities[Math.floor(s(seed + 7) * 4)],
      feasibility: Math.floor(s(seed + 8) * 40) + 55,
      dateCreated: `2025-${String(Math.floor(s(seed + 9) * 12) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    }
  })

  // ── Monthly analytics ──
  const monthlyAnalytics = months.map((month, i) => {
    const seed = i + 5001
    const s = seededRandom
    const totalCost = Math.floor(s(seed) * 4000000) + 2000000
    return {
      month,
      totalCost,
      avgTransitTime: Math.floor(s(seed + 1) * 20) + 20,
      reliability: Math.floor(s(seed + 2) * 10) + 85,
      utilization: Math.floor(s(seed + 3) * 20) + 50,
      carbonEmissions: Math.floor(s(seed + 4) * 500) + 200,
      onTimeRate: Math.floor(s(seed + 5) * 15) + 78,
    }
  })

  return {
    networkNodes, networkRoutes, optimizationOpportunities, scenarioSimulations, monthlyAnalytics,
    months, NODES, ROUTES, TRANSPORT_MODES, ROUTE_TYPES, OPTIMIZATION_TYPES, IMPACT_LEVELS,
    NODE_TYPES, CITIES, states,
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────
function FieldGrid({ fields }: { fields: { label: string; value: string }[] }) {
  return (
    <div className="lno-drawer-field-grid">
      {fields.map((f, i) => (
        <div key={i} className="lno-drawer-field">
          <span className="lno-drawer-field-label">{f.label}</span>
          <span className="lno-drawer-field-value">{f.value}</span>
        </div>
      ))}
    </div>
  )
}

function MetricsRow({ metrics }: { metrics: { label: string; value: string; sub: string; color: string }[] }) {
  return (
    <div className="lno-drawer-metrics-row">
      {metrics.map((m, i) => (
        <div key={i} className="lno-drawer-metric-card" style={{ borderLeftColor: m.color }}>
          <span className="lno-drawer-metric-label">{m.label}</span>
          <span className="lno-drawer-metric-value">{m.value}</span>
          <span className="lno-drawer-metric-sub">{m.sub}</span>
        </div>
      ))}
    </div>
  )
}

function UtilizationRing({ value, size = 80 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)
  const color = value >= 85 ? "#dc2626" : value >= 70 ? "#f97316" : value >= 50 ? "#f59e0b" : value >= 30 ? "#6366f1" : "#94a3b8"
  return (
    <div className="lno-ring-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <span className="lno-ring-text" style={{ color }}>{value}%</span>
    </div>
  )
}

function formatINR(amount: number): string {
  if (Math.abs(amount) >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  return `₹${Math.abs(amount).toLocaleString("en-IN")}`
}

function sortBy(arr: any[], key: string, dir: "asc" | "desc"): any[] {
  return [...arr].sort((a, b) => {
    const va = a[key]; const vb = b[key]
    if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va
    return dir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
  })
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function LogisticsNetworkOptimizationView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterNodeType, setFilterNodeType] = useState("all")
  const [filterMode, setFilterMode] = useState("all")
  const [filterImpact, setFilterImpact] = useState("all")
  const [filterRouteType, setFilterRouteType] = useState("all")
  const [sortKey, setSortKey] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const toast = useToast()

  // ── Tab 0: Dashboard ──────────────────────────────────────────────────
  const totalSavings = data.optimizationOpportunities.reduce((a, o) => a + o.savings, 0)
  const avgUtilization = Math.round(data.networkNodes.reduce((a, n) => a + n.utilization, 0) / data.networkNodes.length)
  const avgReliability = Math.round(data.networkRoutes.reduce((a, r) => a + r.reliability, 0) / data.networkRoutes.length)
  const dashboardKPIs = [
    { label: "Network Nodes", value: data.networkNodes.length, sub: `${data.networkNodes.filter((n) => n.status === "Optimal").length} optimal`, color: COLORS.teal, icon: ChartNetwork },
    { label: "Active Routes", value: data.networkRoutes.length, sub: `${data.networkRoutes.filter((r) => r.status === "Active").length} active`, color: COLORS.indigo, icon: Route },
    { label: "Avg Utilization", value: `${avgUtilization}%`, sub: "Across all nodes", color: COLORS.amber, icon: Gauge },
    { label: "Network Reliability", value: `${avgReliability}%`, sub: "On-time performance", color: COLORS.emerald, icon: ShieldCheck },
    { label: "Optimization Savings", value: formatINR(totalSavings), sub: `${data.optimizationOpportunities.length} opportunities`, color: COLORS.violet, icon: Lightbulb },
    { label: "Carbon Score", value: `${Math.round(data.networkNodes.reduce((a, n) => a + n.carbonScore, 0) / data.networkNodes.length)}`, sub: "Avg node rating", color: COLORS.sky, icon: Activity },
  ]

  // Monthly cost and reliability
  const monthlyTrend = data.monthlyAnalytics

  // Mode distribution
  const modeDist = TRANSPORT_MODES.map((m) => ({
    name: m, count: data.networkRoutes.filter((r) => r.mode === m).length,
  }))

  // Route type distribution
  const routeTypeDist = ROUTE_TYPES.map((rt) => ({
    name: rt, count: data.networkRoutes.filter((r) => r.routeType === rt).length,
  }))

  // Node utilization by type
  const nodeUtilByType = NODE_TYPES.map((nt) => {
    const nodes = data.networkNodes.filter((n) => n.type === nt)
    return {
      type: nt.replace(" Center", "").replace(" Hub", "").replace(" Warehouse", ""),
      avgUtil: nodes.length ? Math.round(nodes.reduce((a, n) => a + n.utilization, 0) / nodes.length) : 0,
      count: nodes.length,
    }
  })

  // Top 5 costliest routes
  const topCostRoutes = sortBy(data.networkRoutes, "totalCost", "desc").slice(0, 5)

  // Optimization by type
  const optByType = OPTIMIZATION_TYPES.map((ot) => ({
    type: ot.replace(" Optimization", ""),
    savings: data.optimizationOpportunities.filter((o) => o.type === ot).reduce((a, o) => a + o.savings, 0),
    count: data.optimizationOpportunities.filter((o) => o.type === ot).length,
  }))

  // ── Tab 1: Network Nodes ───────────────────────────────────────────────
  const filteredNodes = useMemo(() => {
    let items = data.networkNodes
    if (searchTerm) items = items.filter((n) => n.name.toLowerCase().includes(searchTerm.toLowerCase()) || n.city.toLowerCase().includes(searchTerm.toLowerCase()) || n.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterNodeType !== "all") items = items.filter((n) => n.type === filterNodeType)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterNodeType, sortKey, sortDir])

  // ── Tab 2: Route Analysis ─────────────────────────────────────────────
  const filteredRoutes = useMemo(() => {
    let items = data.networkRoutes
    if (searchTerm) items = items.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.origin.toLowerCase().includes(searchTerm.toLowerCase()) || r.destination.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterMode !== "all") items = items.filter((r) => r.mode === filterMode)
    if (filterRouteType !== "all") items = items.filter((r) => r.routeType === filterRouteType)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterMode, filterRouteType, sortKey, sortDir])

  // ── Tab 3: Optimization ───────────────────────────────────────────────
  const filteredOptimizations = useMemo(() => {
    let items = data.optimizationOpportunities
    if (searchTerm) items = items.filter((o) => o.route.toLowerCase().includes(searchTerm.toLowerCase()) || o.description.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterImpact !== "all") items = items.filter((o) => o.impact === filterImpact)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterImpact, sortKey, sortDir])

  // ── Tab 4: Scenarios ─────────────────────────────────────────────────
  const filteredScenarios = useMemo(() => {
    let items = data.scenarioSimulations
    if (searchTerm) items = items.filter((sc) => sc.name.toLowerCase().includes(searchTerm.toLowerCase()) || sc.type.toLowerCase().includes(searchTerm.toLowerCase()))
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, sortKey, sortDir])

  // ─── Drawer ────────────────────────────────────────────────────────────
  const openDrawer = (type: string, item: any) => { setDrawerType(type); setDrawerData(item); setDrawerOpen(true) }
  const handleSort = (key: string) => { if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("asc") } }
  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <TableHead className="cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">{label}{sortKey === field && <span className="lno-sort-ind">{sortDir === "asc" ? "▲" : "▼"}</span>}</div>
    </TableHead>
  )

  const tabs = [
    // Tab 0 — Dashboard
    {
      title: "Network Overview",
      content: (
        <div className="lno-tab-content">
          <div className="lno-kpi-grid">
            {dashboardKPIs.map((kpi, i) => (
              <div key={i} className={`lno-kpi-card lno-kpi-${i}`}>
                <div className="lno-kpi-icon-wrap" style={{ backgroundColor: kpi.color + "18" }}><kpi.icon className="h-5 w-5" style={{ color: kpi.color }} /></div>
                <div className="lno-kpi-info">
                  <span className="lno-kpi-label">{kpi.label}</span>
                  <span className="lno-kpi-value">{kpi.value}</span>
                  <span className="lno-kpi-sub">{kpi.sub}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="lno-chart-grid">
            {/* Monthly Cost & Reliability Composed */}
            <Card className="lno-chart-card lno-chart-full">
              <CardHeader className="lno-chart-header"><CardTitle className="lno-chart-title">Monthly Network Cost & Reliability</CardTitle><CardDescription>Cost trend and reliability over 12 months</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[70, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="totalCost" fill={COLORS.indigo} name="Network Cost" radius={[4, 4, 0, 0]} barSize={16} />
                    <Line yAxisId="right" type="monotone" dataKey="reliability" stroke={COLORS.emerald} name="Reliability %" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="onTimeRate" stroke={COLORS.amber} name="On-Time %" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {/* Transport Mode Pie */}
            <Card className="lno-chart-card">
              <CardHeader className="lno-chart-header"><CardTitle className="lno-chart-title">Transport Mode Mix</CardTitle><CardDescription>Route count by transport mode</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={modeDist} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="count" nameKey="name" label={({ name, percent }: any) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                      {Object.values(MODE_COLORS).map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {/* Route Type Bar */}
            <Card className="lno-chart-card">
              <CardHeader className="lno-chart-header"><CardTitle className="lno-chart-title">Route Type Distribution</CardTitle><CardDescription>Routes by category</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={routeTypeDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]} barSize={30}>
                      {[COLORS.teal, COLORS.indigo, COLORS.amber, COLORS.rose, COLORS.emerald].map((c, i) => <Cell key={i} fill={c} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {/* Node Utilization by Type */}
            <Card className="lno-chart-card">
              <CardHeader className="lno-chart-header"><CardTitle className="lno-chart-title">Node Utilization by Type</CardTitle><CardDescription>Average utilization across node types</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={nodeUtilByType} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="type" type="category" width={100} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="avgUtil" name="Avg Utilization %" radius={[0, 6, 6, 0]} barSize={14}>
                      {nodeUtilByType.map((entry, i) => <Cell key={i} fill={entry.avgUtil >= 80 ? "#dc2626" : entry.avgUtil >= 60 ? "#f97316" : "#6366f1"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {/* Optimization Savings by Type */}
            <Card className="lno-chart-card">
              <CardHeader className="lno-chart-header"><CardTitle className="lno-chart-title">Optimization Savings by Type</CardTitle><CardDescription>Potential cost savings (₹L)</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={optByType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="type" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="savings" name="Savings" radius={[6, 6, 0, 0]} barSize={24}>
                      {[COLORS.teal, COLORS.indigo, COLORS.rose, COLORS.amber, COLORS.emerald, COLORS.violet].map((c, i) => <Cell key={i} fill={c} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {/* Carbon Trend */}
            <Card className="lno-chart-card">
              <CardHeader className="lno-chart-header"><CardTitle className="lno-chart-title">Carbon Emissions Trend</CardTitle><CardDescription>Monthly CO2 emissions (tons)</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.monthlyAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="carbonEmissions" fill={COLORS.emerald + "30"} stroke={COLORS.emerald} name="CO2 Emissions" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    // Tab 1 — Network Nodes
    {
      title: "Network Nodes",
      content: (
        <div className="lno-tab-content">
          <div className="lno-toolbar">
            <div className="lno-search-wrap"><Search className="h-4 w-4 lno-search-icon" /><Input placeholder="Search by node, city..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="lno-search-input" /></div>
            <div className="lno-filter-row">
              <Select value={filterNodeType} onValueChange={setFilterNodeType}><SelectTrigger className="lno-select"><SelectValue placeholder="Node Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem>{NODE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredNodes, "network-nodes")} className="btn-outline-animate lno-export-btn"><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
            </div>
          </div>
          <div className="lno-table-wrap">
            <Table className="table-hover-highlight"><TableHeader><TableRow>
              <SortHeader label="ID" field="id" /><SortHeader label="Node" field="name" /><TableHead>Type</TableHead><TableHead>City</TableHead><SortHeader label="Capacity" field="capacity" /><SortHeader label="Utilization" field="utilization" /><TableHead>Connections</TableHead><SortHeader label="Cost/Unit" field="costPerUnit" /><TableHead>Reliability</TableHead><TableHead>Status</TableHead><TableHead className="lno-action-col">Action</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredNodes.map((n) => (
                <TableRow key={n.id} className="lno-table-row">
                  <TableCell className="font-mono text-xs">{n.id}</TableCell>
                  <TableCell className="font-medium text-sm">{n.name}</TableCell>
                  <TableCell><div className="lno-type-badge">{NODE_TYPE_ICONS[n.type]} <span className="ml-1">{n.type.replace(" Center", "").replace(" Hub", "").replace(" Warehouse", "")}</span></div></TableCell>
                  <TableCell className="text-xs">{n.city}, {n.state}</TableCell>
                  <TableCell>{n.capacity.toLocaleString()}</TableCell>
                  <TableCell><div className="lno-util-cell"><div className="lno-util-bar-bg"><div className="lno-util-bar-fill" style={{ width: `${n.utilization}%`, backgroundColor: n.utilization >= 85 ? "#dc2626" : n.utilization >= 70 ? "#f97316" : n.utilization >= 50 ? "#f59e0b" : "#6366f1" }} /></div><span className="lno-util-val">{n.utilization}%</span></div></TableCell>
                  <TableCell>{n.connections}</TableCell>
                  <TableCell>₹{n.costPerUnit}</TableCell>
                  <TableCell><span className={`lno-reliability-badge ${n.reliability >= 90 ? "lno-rel-high" : n.reliability >= 80 ? "lno-rel-med" : "lno-rel-low"}`}>{n.reliability}%</span></TableCell>
                  <TableCell><span className={`lno-node-status ${n.status === "Optimal" ? "lno-ns-ok" : n.status === "Near Capacity" ? "lno-ns-warn" : n.status === "Underutilized" ? "lno-ns-under" : "lno-ns-expand"}`}>{n.status}</span></TableCell>
                  <TableCell><Button variant="ghost" size="sm" className="lno-view-btn" onClick={() => openDrawer("node", n)}><Eye className="h-3.5 w-3.5" /> View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
          <div className="lno-table-footer">Showing {filteredNodes.length} of {data.networkNodes.length} nodes</div>
        </div>
      ),
    },
    // Tab 2 — Route Analysis
    {
      title: "Route Analysis",
      content: (
        <div className="lno-tab-content">
          <div className="lno-toolbar">
            <div className="lno-search-wrap"><Search className="h-4 w-4 lno-search-icon" /><Input placeholder="Search by route, origin, destination..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="lno-search-input" /></div>
            <div className="lno-filter-row">
              <Select value={filterMode} onValueChange={setFilterMode}><SelectTrigger className="lno-select"><SelectValue placeholder="Mode" /></SelectTrigger><SelectContent><SelectItem value="all">All Modes</SelectItem>{TRANSPORT_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
              <Select value={filterRouteType} onValueChange={setFilterRouteType}><SelectTrigger className="lno-select"><SelectValue placeholder="Route Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem>{ROUTE_TYPES.map((rt) => <SelectItem key={rt} value={rt}>{rt}</SelectItem>)}</SelectContent></Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredRoutes, "network-routes")} className="btn-outline-animate lno-export-btn"><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
            </div>
          </div>
          <div className="lno-table-wrap">
            <Table className="table-hover-highlight"><TableHeader><TableRow>
              <SortHeader label="ID" field="id" /><SortHeader label="Route" field="name" /><TableHead>Origin - Dest</TableHead><TableHead>Mode</TableHead><SortHeader label="Distance" field="distance" /><SortHeader label="Transit" field="transitTime" /><SortHeader label="Cost" field="totalCost" /><SortHeader label="Utilization" field="utilization" /><SortHeader label="On-Time" field="onTimeRate" /><TableHead className="lno-action-col">Action</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredRoutes.map((r) => (
                <TableRow key={r.id} className="lno-table-row">
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="font-medium text-sm max-w-[160px] truncate">{r.name}</TableCell>
                  <TableCell className="text-xs"><span className="lno-route-chain">{r.origin.split(" ")[0]} <ChevronRight className="h-3 w-3 inline" /> {r.destination.split(" ")[0]}</span></TableCell>
                  <TableCell><span className="lno-mode-badge" style={{ backgroundColor: (MODE_COLORS[r.mode] || "#6366f1") + "18", color: MODE_COLORS[r.mode] || "#6366f1" }}>{r.mode.split(" ")[0]}</span></TableCell>
                  <TableCell>{r.distance.toLocaleString()} km</TableCell>
                  <TableCell>{r.transitTime}h</TableCell>
                  <TableCell className="numeric-cell font-medium">{formatINR(r.totalCost)}</TableCell>
                  <TableCell><div className="lno-util-cell"><div className="lno-util-bar-bg"><div className="lno-util-bar-fill" style={{ width: `${r.utilization}%`, backgroundColor: r.utilization >= 85 ? "#dc2626" : r.utilization >= 60 ? "#f97316" : "#6366f1" }} /></div><span className="lno-util-val">{r.utilization}%</span></div></TableCell>
                  <TableCell><span className={`lno-reliability-badge ${r.onTimeRate >= 90 ? "lno-rel-high" : r.onTimeRate >= 80 ? "lno-rel-med" : "lno-rel-low"}`}>{r.onTimeRate}%</span></TableCell>
                  <TableCell><Button variant="ghost" size="sm" className="lno-view-btn" onClick={() => openDrawer("route", r)}><Eye className="h-3.5 w-3.5" /> View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
          <div className="lno-table-footer">Showing {filteredRoutes.length} of {data.networkRoutes.length} routes</div>
        </div>
      ),
    },
    // Tab 3 — Optimization
    {
      title: "Optimization",
      content: (
        <div className="lno-tab-content">
          <div className="lno-toolbar">
            <div className="lno-search-wrap"><Search className="h-4 w-4 lno-search-icon" /><Input placeholder="Search by route, description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="lno-search-input" /></div>
            <div className="lno-filter-row">
              <Select value={filterImpact} onValueChange={setFilterImpact}><SelectTrigger className="lno-select"><SelectValue placeholder="Impact" /></SelectTrigger><SelectContent><SelectItem value="all">All Impact</SelectItem>{IMPACT_LEVELS.map((il) => <SelectItem key={il} value={il}>{il}</SelectItem>)}</SelectContent></Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredOptimizations, "optimizations")} className="btn-outline-animate lno-export-btn"><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
            </div>
          </div>
          <div className="lno-table-wrap">
            <Table className="table-hover-highlight"><TableHeader><TableRow>
              <SortHeader label="#" field="priority" /><SortHeader label="ID" field="id" /><TableHead>Type</TableHead><TableHead>Route</TableHead><TableHead>Impact</TableHead><SortHeader label="Savings" field="savings" /><SortHeader label="Savings %" field="savingsPct" /><TableHead>Effort</TableHead><TableHead>Timeline</TableHead><TableHead>CO2</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredOptimizations.map((o) => (
                <TableRow key={o.id} className="lno-table-row">
                  <TableCell className="text-xs font-mono">#{o.priority}</TableCell>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell><Badge variant="outline" className="badge-interactive text-xs">{o.type.replace(" Optimization", "")}</Badge></TableCell>
                  <TableCell className="text-xs max-w-[140px] truncate">{o.route}</TableCell>
                  <TableCell><span className="lno-impact-badge" style={{ backgroundColor: IMPACT_COLORS[o.impact] + "18", color: IMPACT_COLORS[o.impact] }}>{o.impact}</span></TableCell>
                  <TableCell className="font-semibold text-sm">{formatINR(o.savings)}</TableCell>
                  <TableCell><span className={`lno-savings-pct ${o.savingsPct >= 20 ? "lno-sp-high" : o.savingsPct >= 10 ? "lno-sp-med" : "lno-sp-low"}`}>{o.savingsPct}%</span></TableCell>
                  <TableCell><span className="text-xs">{o.implementationEffort}</span></TableCell>
                  <TableCell><span className="text-xs">{o.timeline}</span></TableCell>
                  <TableCell><span className="lno-co2-badge">-{o.carbonReduction}%</span></TableCell>
                  <TableCell><span className={`lno-opt-status ${o.status === "Implemented" ? "lno-opt-done" : o.status === "In Progress" ? "lno-opt-progress" : o.status === "Rejected" ? "lno-opt-rejected" : o.status === "Planned" ? "lno-opt-planned" : "lno-opt-identified"}`}>{o.status}</span></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
          <div className="lno-table-footer">Showing {filteredOptimizations.length} of {data.optimizationOpportunities.length} opportunities</div>
        </div>
      ),
    },
    // Tab 4 — Scenarios
    {
      title: "Scenario Simulation",
      content: (
        <div className="lno-tab-content">
          <div className="lno-toolbar">
            <div className="lno-search-wrap"><Search className="h-4 w-4 lno-search-icon" /><Input placeholder="Search by scenario name, type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="lno-search-input" /></div>
            <div className="lno-filter-row">
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredScenarios, "scenarios")} className="btn-outline-animate lno-export-btn"><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
            </div>
          </div>
          <div className="lno-table-wrap">
            <Table className="table-hover-highlight"><TableHeader><TableRow>
              <SortHeader label="ID" field="id" /><SortHeader label="Scenario" field="name" /><TableHead>Type</TableHead><SortHeader label="Savings" field="savings" /><SortHeader label="Service" field="serviceImprovement" /><SortHeader label="CO2" field="carbonReduction" /><SortHeader label="Reliability" field="reliabilityImprovement" /><TableHead>Feasibility</TableHead><TableHead>Complexity</TableHead><TableHead className="lno-action-col">Action</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredScenarios.map((sc) => (
                <TableRow key={sc.id} className="lno-table-row">
                  <TableCell className="font-mono text-xs">{sc.id}</TableCell>
                  <TableCell className="font-medium text-sm max-w-[180px] truncate">{sc.name}</TableCell>
                  <TableCell><Badge variant="outline" className="badge-interactive text-xs">{sc.type}</Badge></TableCell>
                  <TableCell className="font-semibold text-emerald-600 text-sm">{formatINR(sc.savings)}</TableCell>
                  <TableCell><span className="lno-svc-badge">+{sc.serviceImprovement}%</span></TableCell>
                  <TableCell><span className="lno-co2-badge">-{sc.carbonReduction}%</span></TableCell>
                  <TableCell><span className="lno-svc-badge">+{sc.reliabilityImprovement}%</span></TableCell>
                  <TableCell><div className="lno-feas-cell"><div className="lno-feas-bar-bg"><div className="lno-feas-bar-fill" style={{ width: `${sc.feasibility}%`, backgroundColor: sc.feasibility >= 80 ? "#22c55e" : sc.feasibility >= 60 ? "#6366f1" : "#f59e0b" }} /></div><span className="lno-feas-val">{sc.feasibility}%</span></div></TableCell>
                  <TableCell><Badge variant="outline" className="badge-interactive text-xs">{sc.complexity}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="sm" className="lno-view-btn" onClick={() => openDrawer("scenario", sc)}><Eye className="h-3.5 w-3.5" /> View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
          <div className="lno-table-footer">Showing {filteredScenarios.length} of {data.scenarioSimulations.length} scenarios</div>
        </div>
      ),
    },
  ]

  // ─── Drawer Rendering ──────────────────────────────────────────────────
  const renderDrawer = () => {
    if (!drawerData) return null
    if (drawerType === "node") {
      const n = drawerData
      return (<>
        <SheetHeader className="lno-drawer-header"><SheetTitle className="lno-drawer-title"><ChartNetwork className="h-5 w-5 text-teal-500" /> {n.id}</SheetTitle><SheetDescription>{n.name}</SheetDescription></SheetHeader>
        <div className="lno-drawer-body">
          <div className="lno-drawer-visual-row">
            <UtilizationRing value={n.utilization} />
            <div className="lno-drawer-visual-info">
              <span className={`lno-node-status lno-ns-lg ${n.status === "Optimal" ? "lno-ns-ok" : n.status === "Near Capacity" ? "lno-ns-warn" : n.status === "Underutilized" ? "lno-ns-under" : "lno-ns-expand"}`}>{n.status}</span>
              <span className="lno-reliability-badge lno-rel-lg">{n.reliability}% reliable</span>
              {n.expansionNeed && <span className="lno-expand-badge"><AlertTriangle className="h-3 w-3" /> Expansion Needed</span>}
            </div>
          </div>
          <MetricsRow metrics={[
            { label: "Throughput", value: n.throughput.toLocaleString(), sub: `of ${n.capacity.toLocaleString()} capacity`, color: COLORS.teal },
            { label: "Cost/Unit", value: `₹${n.costPerUnit}`, sub: `${n.connections} connections`, color: COLORS.indigo },
            { label: "Carbon Score", value: `${n.carbonScore}/100`, sub: `Transit: ${n.transitTime}h avg`, color: COLORS.emerald },
          ]} />
          <FieldGrid fields={[
            { label: "Node Name", value: n.name }, { label: "Type", value: n.type },
            { label: "City", value: n.city }, { label: "State", value: n.state },
            { label: "Capacity", value: n.capacity.toLocaleString() }, { label: "Utilization", value: `${n.utilization}%` },
            { label: "Connections", value: String(n.connections) }, { label: "Transit Time", value: `${n.transitTime}h` },
            { label: "Monthly Throughput", value: n.monthlyThroughput.toLocaleString() }, { label: "Node ID", value: n.id },
          ]} />
        </div>
        <SheetFooter className="lno-drawer-footer">
          <Button size="sm" variant="outline"><RefreshCw className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Rebalance</Button>
          <Button size="sm" variant="outline"><MapPin className="btn-outline-animate h-3.5 w-3.5 mr-1" /> View Map</Button>
          <Button size="sm" className="lno-drawer-primary-btn"><Zap className="h-3.5 w-3.5 mr-1" /> Optimize</Button>
        </SheetFooter>
      </>)
    }
    if (drawerType === "route") {
      const r = drawerData
      return (<>
        <SheetHeader className="lno-drawer-header"><SheetTitle className="lno-drawer-title"><Route className="h-5 w-5 text-indigo-500" /> {r.id}</SheetTitle><SheetDescription>{r.name}</SheetDescription></SheetHeader>
        <div className="lno-drawer-body">
          <div className="lno-drawer-visual-row">
            <UtilizationRing value={r.utilization} />
            <div className="lno-drawer-visual-info">
              <span className="lno-mode-badge" style={{ backgroundColor: (MODE_COLORS[r.mode] || "#6366f1") + "18", color: MODE_COLORS[r.mode] || "#6366f1", fontSize: 13, padding: "4px 14px" }}>{r.mode}</span>
              <span className="lno-route-chain-lg">{r.origin} <ChevronRight className="h-4 w-4 inline" /> {r.destination}</span>
            </div>
          </div>
          <MetricsRow metrics={[
            { label: "Total Cost", value: formatINR(r.totalCost), sub: `₹${r.costPerKm}/km`, color: COLORS.indigo },
            { label: "Distance", value: `${r.distance.toLocaleString()} km`, sub: `Transit: ${r.transitTime}h`, color: COLORS.teal },
            { label: "On-Time Rate", value: `${r.onTimeRate}%`, sub: `CO2: ${r.co2PerTonKm} g/t-km`, color: COLORS.amber },
          ]} />
          <FieldGrid fields={[
            { label: "Route Name", value: r.name }, { label: "Route Type", value: r.routeType },
            { label: "Origin", value: r.origin }, { label: "Destination", value: r.destination },
            { label: "Mode", value: r.mode }, { label: "Distance", value: `${r.distance.toLocaleString()} km` },
            { label: "Transit Time", value: `${r.transitTime}h` }, { label: "Cost/Km", value: `₹${r.costPerKm}` },
            { label: "Volume Cap", value: r.volumeCapacity.toLocaleString() }, { label: "Current Vol", value: r.currentVolume.toLocaleString() },
          ]} />
          {/* Volume utilization bar */}
          <div className="lno-vol-bar-wrap">
            <div className="lno-vol-bar-label">Volume Utilization: {Math.round(r.currentVolume / r.volumeCapacity * 100)}%</div>
            <div className="lno-vol-bar-bg"><div className="lno-vol-bar-fill" style={{ width: `${(r.currentVolume / r.volumeCapacity) * 100}%` }} /></div>
          </div>
        </div>
        <SheetFooter className="lno-drawer-footer">
          <Button size="sm" variant="outline"><RefreshCw className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Reoptimize</Button>
          <Button size="sm" variant="outline"><Truck className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Simulate</Button>
          <Button size="sm" className="lno-drawer-primary-btn"><Zap className="h-3.5 w-3.5 mr-1" /> Apply</Button>
        </SheetFooter>
      </>)
    }
    if (drawerType === "scenario") {
      const sc = drawerData
      return (<>
        <SheetHeader className="lno-drawer-header"><SheetTitle className="lno-drawer-title"><Lightbulb className="h-5 w-5 text-violet-500" /> {sc.id}</SheetTitle><SheetDescription>{sc.name}</SheetDescription></SheetHeader>
        <div className="lno-drawer-body">
          <div className="lno-drawer-visual-row">
            <UtilizationRing value={sc.feasibility} />
            <div className="lno-drawer-visual-info">
              <Badge variant="outline" className="badge-interactive lno-sc-type-badge">{sc.type}</Badge>
              <Badge variant="outline" className="badge-interactive lno-sc-complexity-badge">{sc.complexity}</Badge>
            </div>
          </div>
          <div className="lno-drawer-desc-box"><p>{sc.description}</p></div>
          <MetricsRow metrics={[
            { label: "Savings", value: formatINR(sc.savings), sub: `of ${formatINR(sc.currentNetworkCost)}`, color: COLORS.emerald },
            { label: "Service Improvement", value: `+${sc.serviceImprovement}%`, sub: `Reliability: +${sc.reliabilityImprovement}%`, color: COLORS.indigo },
            { label: "Carbon Reduction", value: `-${sc.carbonReduction}%`, sub: `Feasibility: ${sc.feasibility}%`, color: COLORS.amber },
          ]} />
          <FieldGrid fields={[
            { label: "Scenario", value: sc.name }, { label: "Type", value: sc.type },
            { label: "Current Cost", value: formatINR(sc.currentNetworkCost) }, { label: "Proposed Cost", value: formatINR(sc.proposedNetworkCost) },
            { label: "Complexity", value: sc.complexity }, { label: "Feasibility", value: `${sc.feasibility}%` },
            { label: "Date Created", value: sc.dateCreated }, { label: "Scenario ID", value: sc.id },
          ]} />
        </div>
        <SheetFooter className="lno-drawer-footer">
          <Button size="sm" variant="outline"><RefreshCw className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Recalculate</Button>
          <Button size="sm" variant="outline"><BarChart3 className="btn-outline-animate h-3.5 w-3.5 mr-1" /> Compare</Button>
          <Button size="sm" className="lno-drawer-primary-btn"><Zap className="h-3.5 w-3.5 mr-1" /> Implement</Button>
        </SheetFooter>
      </>)
    }
    return null
  }

  return (
    <div className="lno-container">
      <PageHeader title="Logistics Network Optimization" description="Optimize your India logistics network with route analysis, mode shifting, and scenario simulation" />
      <div className="lno-tab-nav">
        {tabs.map((tab, i) => (
          <button key={i} className={`lno-tab-btn ${activeTab === i ? "active" : ""}`} onClick={() => { setActiveTab(i); setSearchTerm(""); setFilterNodeType("all"); setFilterMode("all"); setFilterImpact("all"); setFilterRouteType("all") }}>{tab.title}</button>
        ))}
      </div>
      <div className="lno-tab-content-wrap">{tabs[activeTab].content}</div>
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}><SheetContent className="lno-drawer-panel" side="right">{renderDrawer()}</SheetContent></Sheet>
    </div>
  )
}
