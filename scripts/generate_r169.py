#!/usr/bin/env python3
"""Generate R169: Goods-to-Person (GTP) Picking System module."""

OUT = "/home/z/my-project/src/components/modules/goods-to-person-picking-view.tsx"

component = r'''"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts"
import {
  ArrowRightLeft, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, ArrowUpRight, ArrowDownRight, Eye, X, Package, Clock,
  Bot, Warehouse, Timer, MapPin, User, ChevronRight, ArrowRight,
  PackageCheck, Scan, Box, Boxes, LayoutGrid, Zap, Target,
  Truck, RotateCcw, QrCode, Filter, ArrowUpDown, Play, Pause,
  CircleDot, Square, Settings, Activity, Gauge, Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Seed-based data generation
// ─────────────────────────────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const GTP_PICKING_STATION_TYPES = ["Picking Station Alpha", "Picking Station Beta", "Picking Station Gamma", "Picking Station Delta", "Picking Station Epsilon", "Picking Station Zeta"] as const;
const ROBOT_TYPES = ["AMR Shuttle", "Autostore Robot", "Kiva-style Pod", "Scalable Storage Unit", "Lattice Binner", "Free-roaming AGV", "Conveyor-Linked Bot"] as const;
const STORAGE_SYSTEMS = ["Autostore", "Scalable AS/RS", "Dematic Multishuttle", "Swisslog CarryPick", "Knapp OSR Shuttle", "Vanderlande Pallet Shuttle", "SSI Schaefer Modular"] as const;
const ITEM_CATEGORIES = ["Electronics", "Apparel", "FMCG", "Pharma", "Automotive Parts", "Home & Kitchen", "Beauty", "Sports", "Books", "Toys"] as const;
const PICK_PRIORITIES = ["Express", "Same-Day", "Next-Day", "Standard", "Economy", "Bulk"] as const;
const PICK_STATUSES = ["Assigned", "In Progress", "Completed", "Verified", "Exception", "Cancelled"] as const;
const STATION_STATUSES = ["Active", "Idle", "Maintenance", "Changeover", "Offline"] as const;
const EXCEPTION_TYPES = ["Item Mismatch", "Short Pick", "Damaged Stock", "Weight Discrepancy", "Barcode Unreadable", "Location Mismatch", "Qty Override", "System Timeout"] as const;
const ZONES = ["Zone A - Fast Movers", "Zone B - Medium Movers", "Zone C - Slow Movers", "Zone D - Bulk Storage", "Zone E - Hazmat", "Zone F - High Value", "Zone G - Returns", "Zone H - Cold Chain"] as const;
const PICK_WAVES = ["Wave 1 - Morning Peak", "Wave 2 - Midday", "Wave 3 - Afternoon", "Wave 4 - Evening", "Wave 5 - Night Shift", "Wave 6 - Express Hour", "Wave 7 - Bulk Consolidation"] as const;
const INDIAN_WAREHOUSES = ["Mumbai HUB-W1", "Delhi NCR HUB-W2", "Bangalore HUB-W3", "Chennai HUB-W4", "Hyderabad HUB-W5", "Kolkata HUB-W6", "Pune HUB-W7", "Jaipur HUB-W8"] as const;
const INDIAN_PIN_PREFIXES = ["400", "110", "560", "600", "500", "700", "411", "302"]

function generateData() {
  const r = seededRandom(1694200);
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;
  const rf = (min: number, max: number) => +(r() * (max - min) + min).toFixed(1);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];

  // Monthly throughput trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyTrend = months.map((m, i) => ({
    month: m,
    picks: ri(12000, 28000),
    fulfilled: ri(10000, 26000),
    exceptions: ri(200, 1200),
    throughput: ri(85, 99),
    robotUtilization: ri(70, 95),
  }))

  // Category performance
  const categoryPerformance = ITEM_CATEGORIES.map(cat => ({
    category: cat,
    picksToday: ri(800, 5000),
    accuracy: rf(96.5, 99.9),
    avgPickTime: rf(2.1, 8.5),
    exceptionRate: rf(0.1, 2.5),
    itemsPerHour: ri(120, 450),
  }))

  // 40 GTP picking stations
  const stations = Array.from({ length: 40 }, (_, i) => ({
    id: `GTP-ST-${String(i + 1).padStart(3, "0")}`,
    name: `${pick(GTP_PICKING_STATION_TYPES)} ${i + 1}`,
    warehouse: pick(INDIAN_WAREHOUSES),
    zone: pick(ZONES),
    status: pick(STATION_STATUSES),
    operator: `Operator ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26)}`,
    currentWave: pick(PICK_WAVES),
    picksCompleted: ri(0, 320),
    picksTarget: ri(200, 400),
    linesPerHour: ri(60, 280),
    accuracy: rf(97.0, 99.9),
    uptimeToday: rf(4.0, 12.0),
    totalUptime: rf(2.0, 8.0),
    robotsAssigned: ri(2, 8),
    stationType: pick(ROBOT_TYPES),
    storageSystem: pick(STORAGE_SYSTEMS),
    pickRate: rf(85, 100),
    avgCycleTime: rf(8, 35),
    exceptionsCount: ri(0, 15),
    lastActivity: `${ri(0, 59)} min ago`,
  }))

  // 100 active pick tasks
  const pickTasks = Array.from({ length: 100 }, (_, i) => ({
    id: `PKT-${String(i + 1).padStart(4, "0")}`,
    orderId: `ORD-${ri(10000, 99999)}`,
    stationId: stations[i % 40].id,
    station: stations[i % 40].name,
    operator: stations[i % 40].operator,
    warehouse: pick(INDIAN_WAREHOUSES),
    zone: pick(ZONES),
    category: pick(ITEM_CATEGORIES),
    priority: pick(PICK_PRIORITIES),
    status: pick(PICK_STATUSES),
    sku: `SKU-${ri(10000, 99999)}`,
    itemName: `${pick(ITEM_CATEGORIES)} Item ${ri(100, 999)}`,
    qtyRequired: ri(1, 20),
    qtyPicked: pick(PICK_STATUSES) === "Completed" || pick(PICK_STATUSES) === "Verified" ? ri(1, 20) : ri(0, 15),
    pickLocation: `${pick(ZONES).split(" - ")[0]}-${ri(1, 20)}-${ri(1, 10)}-${String.fromCharCode(65 + ri(0, 25))}`,
    robotId: `BOT-${ri(100, 999)}`,
    robotType: pick(ROBOT_TYPES),
    aisle: ri(1, 20),
    rack: ri(1, 10),
    level: ri(1, 6),
    position: String.fromCharCode(65 + ri(0, 25)),
    startTime: `${ri(0, 23)}:${String(ri(0, 59)).padStart(2, "0")}`,
    endTime: pick(PICK_STATUSES) === "Completed" ? `${ri(0, 23)}:${String(ri(0, 59)).padStart(2, "0")}` : null,
    cycleTimeSec: ri(8, 45),
    targetCycleTime: ri(10, 30),
    weight: `${rf(0.05, 25.0)} kg`,
    dimensions: `${ri(5, 60)}x${ri(5, 40)}x${ri(2, 50)}`,
    assignedAt: `2026-07-${String(ri(1, 28)).padStart(2, "0")} ${ri(0, 23)}:${String(ri(0, 59)).padStart(2, "0")}`,
    verifiedBy: pick(PICK_STATUSES) === "Verified" ? `Verifier ${ri(1, 20)}` : null,
    pinCode: `${pick(INDIAN_PIN_PREFIXES)}${String(ri(0, 999)).padStart(3, "0")}`,
  }))

  // 30 robots
  const robots = Array.from({ length: 30 }, (_, i) => ({
    id: `BOT-${ri(100, 999)}`,
    type: pick(ROBOT_TYPES),
    model: `${pick(STORAGE_SYSTEMS)} ${ri(100, 999)}`,
    warehouse: pick(INDIAN_WAREHOUSES),
    zone: pick(ZONES),
    status: pick(["Working", "Idle", "Charging", "Maintenance", "Error", "Returning", "Queued"]),
    batteryLevel: ri(5, 100),
    currentTask: pick(["Transporting", "Picking", "Returning to Station", "Storing", "Replenishing", "Idle", "Charging"]),
    stationId: stations[i % 40].id,
    stationName: stations[i % 40].name,
    tripsCompleted: ri(0, 150),
    tripsToday: ri(0, 50),
    avgTripTime: rf(30, 180),
    payloadWeight: `${rf(0.5, 50)} kg`,
    maxPayload: `${ri(25, 75)} kg`,
    speed: `${rf(0.5, 2.5)} m/s`,
    utilization: rf(60, 99),
    totalRuntime: `${ri(100, 5000)} hrs`,
    lastMaintenance: `2026-${String(ri(1, 7)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
    nextMaintenance: `2026-${String(ri(7, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
    errorCode: ri(0, 10) === 0 ? `ERR-${ri(100, 999)}` : null,
    firmwareVersion: `v${ri(1, 5)}.${ri(0, 9)}.${ri(0, 20)}`,
  }))

  // 40 storage pods / shelves
  const storagePods = Array.from({ length: 40 }, (_, i) => ({
    id: `POD-${String(i + 1).padStart(3, "0")}`,
    warehouse: pick(INDIAN_WAREHOUSES),
    zone: pick(ZONES),
    type: pick(STORAGE_SYSTEMS),
    location: `${pick(ZONES).split(" - ")[0]}-${ri(1, 20)}-${ri(1, 10)}`,
    totalBins: ri(20, 120),
    occupiedBins: ri(5, 80),
    weight: `${rf(5, 200)} kg`,
    maxWeight: `${ri(150, 300)} kg`,
    temperature: `${rf(15, 35)}°C`,
    humidity: `${rf(30, 80)}%`,
    lastAccessed: `${ri(0, 59)} min ago`,
    accessFrequency: pick(["High", "Medium", "Low"]),
    items: ri(10, 500),
    maxItems: ri(100, 800),
    status: pick(["Active", "Full", "Low Stock", "Maintenance", "Reserved"]),
  }))

  // 20 exceptions
  const exceptions = Array.from({ length: 20 }, (_, i) => ({
    id: `GTP-EXC-${String(i + 1).padStart(3, "0")}`,
    taskId: pickTasks[i].id,
    stationId: stations[i % 40].id,
    warehouse: pick(INDIAN_WAREHOUSES),
    type: pick(EXCEPTION_TYPES),
    severity: pick(["Critical", "High", "Medium", "Low"]),
    status: pick(["Open", "Investigating", "Resolved", "Escalated", "Closed"]),
    reportedBy: stations[i % 40].operator,
    description: `Exception during ${pick(PICK_STATUSES).toLowerCase()} operation`,
    rootCause: pick(["Incorrect bin mapping", "Robot misalignment", "Scanner failure", "Weight sensor drift", "Software timeout", "Operator error", "Damaged barcode label", "Inventory discrepancy"]),
    correctiveAction: pick(["Re-map bin location", "Recalibrate robot", "Replace scanner unit", "Recalibrate load cell", "Restart picker station", "Retrain operator", "Reprint barcode", "Cycle count reconciliation"]),
    reportedAt: `2026-07-${String(ri(1, 28)).padStart(2, "0")} ${ri(0, 23)}:${String(ri(0, 59)).padStart(2, "0")}`,
    resolvedAt: pick(["Resolved", "Closed"]).includes(pick(["Open", "Investigating", "Resolved", "Escalated", "Closed"])) ? `2026-07-${String(ri(1, 28)).padStart(2, "0")} ${ri(0, 23)}:${String(ri(0, 59)).padStart(2, "0")}` : null,
    impact: pick(["Task delayed", "Station paused", "Robot rerouted", "Wave disrupted", "No impact"]),
  }))

  // 7 pick waves
  const waves = PICK_WAVES.map((w, i) => ({
    id: `WAVE-${i + 1}`,
    name: w,
    warehouse: pick(INDIAN_WAREHOUSES),
    status: pick(["Active", "Completed", "Queued", "In Progress", "Released", "Pending"]),
    totalOrders: ri(50, 500),
    completedOrders: ri(0, 500),
    totalLines: ri(200, 2000),
    completedLines: ri(0, 2000),
    stationsAssigned: ri(5, 20),
    robotsDeployed: ri(10, 40),
    startTime: `${String(ri(0, 23)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}`,
    endTime: null,
    priority: pick(PICK_PRIORITIES),
    slaDeadline: `${String(ri(12, 23)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}`,
    exceptionCount: ri(0, 25),
    pickRate: rf(75, 100),
  }))

  // Zone utilization
  const zoneUtilization = ZONES.map(z => ({
    zone: z.split(" - ")[1],
    stationCount: ri(3, 10),
    robotCount: ri(5, 20),
    utilization: ri(40, 98),
    pickRate: ri(100, 500),
    accuracy: rf(96, 99.9),
    avgCycleTime: rf(10, 35),
  }))

  return {
    GTP_PICKING_STATION_TYPES, ROBOT_TYPES, STORAGE_SYSTEMS, ITEM_CATEGORIES,
    PICK_PRIORITIES, PICK_STATUSES, STATION_STATUSES, EXCEPTION_TYPES,
    ZONES, PICK_WAVES, INDIAN_WAREHOUSES, INDIAN_PIN_PREFIXES,
    months, monthlyTrend, categoryPerformance, stations, pickTasks, robots,
    storagePods, exceptions, waves, zoneUtilization,
  };
}

const data = generateData()

// ─────────────────────────────────────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────────────────────────────────────
const THEME = {
  primary: "#0ea5e9",   // Sky blue
  secondary: "#8b5cf6",  // Violet
  accent: "#f59e0b",    // Amber
  success: "#22c55e",    // Green
  danger: "#ef4444",     // Red
  muted: "#64748b",      // Slate
}

const PIE_COLORS = [THEME.primary, THEME.secondary, THEME.accent, THEME.success, THEME.danger, "#06b6d4", "#ec4899", "#6366f1", "#14b8a6", "#f97316"]

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function GoodsToPersonPickingView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [zoneFilter, setZoneFilter] = useState("all")
  const [exceptionTypeFilter, setExceptionTypeFilter] = useState("all")
  const [exceptionSeverityFilter, setExceptionSeverityFilter] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(0)
  const [selectedStation, setSelectedStation] = useState<typeof data.stations[0] | null>(null)
  const [selectedTask, setSelectedTask] = useState<typeof data.pickTasks[0] | null>(null)
  const [selectedRobot, setSelectedRobot] = useState<typeof data.robots[0] | null>(null)
  const [selectedPod, setSelectedPod] = useState<typeof data.storagePods[0] | null>(null)
  const [selectedException, setSelectedException] = useState<typeof data.exceptions[0] | null>(null)
  const [now, setNow] = useState(new Date())

  useMemo(() => {
    const iv = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(iv)
  }, [])

  const PAGE_SIZE = 12

  // KPI calculations
  const kpis = useMemo(() => {
    const active = data.stations.filter(s => s.status === "Active").length
    const totalPicks = data.stations.reduce((a, s) => a + s.picksCompleted, 0)
    const avgAccuracy = +(data.stations.reduce((a, s) => a + s.accuracy, 0) / data.stations.length).toFixed(1)
    const avgCycleTime = +(data.stations.reduce((a, s) => a + s.avgCycleTime, 0) / data.stations.length).toFixed(1)
    const activeRobots = data.robots.filter(r => r.status === "Working").length
    const openExc = data.exceptions.filter(e => e.status === "Open" || e.status === "Investigating").length
    return { active, totalPicks, avgAccuracy, avgCycleTime, activeRobots, openExc }
  }, [])

  // ─── Tab 0: Dashboard ─────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="gtp-space-y-6">
      {/* Clock */}
      <div className="gtp-clock-bar">
        <div className="gtp-clock-label"><Activity size={14} /> GTP System Live</div>
        <div className="gtp-clock-time">{now.toLocaleTimeString("en-IN", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
        <div className="gtp-clock-date">{now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </div>

      {/* KPIs */}
      <div className="gtp-kpi-grid">
        {[
          { label: "Active Stations", value: kpis.active, sub: `of ${data.stations.length}`, icon: LayoutGrid, color: THEME.primary },
          { label: "Total Picks Today", value: kpis.totalPicks.toLocaleString("en-IN"), sub: "across all warehouses", icon: PackageCheck, color: THEME.success },
          { label: "Avg Accuracy", value: `${kpis.avgAccuracy}%`, sub: "pick accuracy", icon: Target, color: THEME.secondary },
          { label: "Avg Cycle Time", value: `${kpis.avgCycleTime}s`, sub: "per pick cycle", icon: Timer, color: THEME.accent },
          { label: "Active Robots", value: kpis.activeRobots, sub: `of ${data.robots.length}`, icon: Bot, color: "#06b6d4" },
          { label: "Open Exceptions", value: kpis.openExc, sub: "requiring attention", icon: AlertTriangle, color: THEME.danger },
        ].map((k, i) => (
          <div key={i} className="gtp-kpi-card" style={{ borderLeftColor: k.color }}>
            <div className="gtp-kpi-icon" style={{ backgroundColor: k.color + "18", color: k.color }}>
              <k.icon size={20} />
            </div>
            <div className="gtp-kpi-content">
              <div className="gtp-kpi-value">{k.value}</div>
              <div className="gtp-kpi-label">{k.label}</div>
              <div className="gtp-kpi-sub">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="gtp-charts-row">
        <div className="gtp-chart-card">
          <h3 className="gtp-chart-title">Monthly Pick Throughput Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="picks" name="Total Picks" fill={THEME.primary} radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="fulfilled" name="Fulfilled" fill={THEME.success} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" dataKey="throughput" name="Throughput %" stroke={THEME.accent} strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="gtp-chart-card">
          <h3 className="gtp-chart-title">Category Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.categoryPerformance.slice(0, 6)}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 9 }} />
              <Radar name="Picks Today" dataKey="picksToday" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.15} />
              <Radar name="Items/Hour" dataKey="itemsPerHour" stroke={THEME.secondary} fill={THEME.secondary} fillOpacity={0.1} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="gtp-charts-row">
        <div className="gtp-chart-card">
          <h3 className="gtp-chart-title">Robot Utilization by Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.ROBOT_TYPES.map((t, i) => ({ name: t, value: data.robots.filter(r => r.type === t).length })).filter(d => d.value > 0)} cx="50%" cy="50%" outerRadius={100} innerRadius={55} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: "#475569" }}>
                {data.ROBOT_TYPES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="gtp-chart-card">
          <h3 className="gtp-chart-title">Zone-wise Pick Rate</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.zoneUtilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="zone" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }} />
              <Bar dataKey="pickRate" name="Pick Rate" radius={[4, 4, 0, 0]}>
                {data.zoneUtilization.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone Status Grid */}
      <div className="gtp-section-card">
        <h3 className="gtp-section-title"><MapPin size={16} /> Zone Status Overview</h3>
        <div className="gtp-zone-grid">
          {data.ZONES.map((z, i) => {
            const util = data.zoneUtilization[i]
            return (
              <div key={i} className="gtp-zone-card">
                <div className="gtp-zone-name">{z}</div>
                <div className="gtp-zone-stats">
                  <span><LayoutGrid size={12} /> {util.stationCount} stations</span>
                  <span><Bot size={12} /> {util.robotCount} robots</span>
                  <span><Gauge size={12} /> {util.accuracy}% accuracy</span>
                </div>
                <div className="gtp-zone-bar-wrap">
                  <div className="gtp-zone-bar-label">Utilization</div>
                  <div className="gtp-zone-bar-track">
                    <div className="gtp-zone-bar-fill" style={{ width: `${util.utilization}%`, backgroundColor: util.utilization > 85 ? THEME.danger : util.utilization > 60 ? THEME.accent : THEME.success }} />
                  </div>
                  <div className="gtp-zone-bar-val">{util.utilization}%</div>
                </div>
                <div className="gtp-zone-bar-wrap">
                  <div className="gtp-zone-bar-label">Avg Cycle</div>
                  <div className="gtp-zone-bar-track">
                    <div className="gtp-zone-bar-fill" style={{ width: `${Math.min(100, (util.avgCycleTime / 40) * 100)}%`, backgroundColor: THEME.primary }} />
                  </div>
                  <div className="gtp-zone-bar-val">{util.avgCycleTime}s</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ─── Tab 1: Picking Stations ──────────────────────────────────────────────
  const filteredStations = useMemo(() => {
    let result = [...data.stations]
    if (searchQuery) result = result.filter(s => s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.warehouse.toLowerCase().includes(searchQuery.toLowerCase()))
    if (statusFilter !== "all") result = result.filter(s => s.status === statusFilter)
    if (zoneFilter !== "all") result = result.filter(s => s.zone === zoneFilter)
    if (sortField) result.sort((a, b) => {
      const av: number = (a as any)[sortField] ?? 0
      const bv: number = (b as any)[sortField] ?? 0
      return sortDir === "asc" ? av - bv : bv - av
    })
    return result
  }, [searchQuery, statusFilter, zoneFilter, sortField, sortDir])

  const pagedStations = filteredStations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const renderStations = () => (
    <div className="gtp-space-y-4">
      <div className="gtp-toolbar">
        <div className="gtp-search-wrap">
          <Search size={16} className="gtp-search-icon" />
          <input className="gtp-search-input" placeholder="Search by ID, name, or warehouse..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(0) }} />
        </div>
        <div className="gtp-filter-pills">
          {["all", ...data.STATION_STATUSES].map(s => (
            <button key={s} className={cn("gtp-pill", statusFilter === s && "gtp-pill-active")} onClick={() => { setStatusFilter(s); setPage(0) }}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <div className="gtp-filter-select">
          <Filter size={14} />
          <select value={zoneFilter} onChange={e => { setZoneFilter(e.target.value); setPage(0) }}>
            <option value="all">All Zones</option>
            {data.ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>

      <div className="gtp-table-wrap">
        <table className="gtp-table">
          <thead>
            <tr>
              {[
                { key: "id", label: "Station ID" },
                { key: "name", label: "Name" },
                { key: "warehouse", label: "Warehouse" },
                { key: "status", label: "Status" },
                { key: "picksCompleted", label: "Picks" },
                { key: null, label: "Progress" },
                { key: "linesPerHour", label: "Lines/Hr" },
                { key: "accuracy", label: "Accuracy" },
                { key: "uptimeToday", label: "Uptime (hrs)" },
                { key: "robotsAssigned", label: "Robots" },
                { key: null, label: "Actions" },
              ].map((col, ci) => (
                <th key={ci} className={cn(col.key && "gtp-th-sort")} onClick={() => col.key && (setSortField(col.key), setSortDir(d => d === "asc" ? "desc" : "asc"))}>
                  <span className="gtp-th-content">{col.label}{sortField === col.key && <ArrowUpDown size={12} />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedStations.map((s, i) => {
              const progress = (s.picksCompleted / s.picksTarget) * 100
              return (
                <tr key={s.id} className="gtp-table-row">
                  <td className="gtp-mono">{s.id}</td>
                  <td className="gtp-bold">{s.name}</td>
                  <td>{s.warehouse}</td>
                  <td><span className={cn("gtp-status-badge", `gtp-status-${s.status.toLowerCase().replace(" ", "-")}`)}>{s.status}</span></td>
                  <td>{s.picksCompleted}/{s.picksTarget}</td>
                  <td>
                    <div className="gtp-progress-wrap">
                      <div className="gtp-progress-track"><div className="gtp-progress-fill" style={{ width: `${Math.min(100, progress)}%`, backgroundColor: progress >= 90 ? THEME.success : progress >= 60 ? THEME.accent : THEME.primary }} /></div>
                      <span className="gtp-progress-pct">{progress.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td>{s.linesPerHour}</td>
                  <td>
                    <div className="gtp-bar-mini"><div className="gtp-bar-mini-fill" style={{ width: `${s.accuracy}%`, backgroundColor: s.accuracy > 98 ? THEME.success : s.accuracy > 96 ? THEME.accent : THEME.danger }} /><span>{s.accuracy}%</span></div>
                  </td>
                  <td>{s.uptimeToday}</td>
                  <td>
                    <span className="gtp-robot-badge"><Bot size={12} /> {s.robotsAssigned}</span>
                  </td>
                  <td>
                    <button className="gtp-action-btn" onClick={() => setSelectedStation(s)}><Eye size={14} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="gtp-pagination">
        <span className="gtp-page-info">Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filteredStations.length)} of {filteredStations.length}</span>
        <div className="gtp-page-btns">
          <button className="gtp-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
          {Array.from({ length: Math.ceil(filteredStations.length / PAGE_SIZE) }, (_, i) => (
            <button key={i} className={cn("gtp-page-btn", page === i && "gtp-page-active")} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button className="gtp-page-btn" disabled={page >= Math.ceil(filteredStations.length / PAGE_SIZE) - 1} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  )

  // ─── Tab 2: Pick Tasks ────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    let result = [...data.pickTasks]
    if (searchQuery) result = result.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || t.sku.includes(searchQuery))
    if (statusFilter !== "all") result = result.filter(t => t.status === statusFilter)
    if (priorityFilter !== "all") result = result.filter(t => t.priority === priorityFilter)
    if (sortField) result.sort((a, b) => {
      const av: number = (a as any)[sortField] ?? 0
      const bv: number = (b as any)[sortField] ?? 0
      return sortDir === "asc" ? av - bv : bv - av
    })
    return result
  }, [searchQuery, statusFilter, priorityFilter, sortField, sortDir])

  const pagedTasks = filteredTasks.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const renderTasks = () => (
    <div className="gtp-space-y-4">
      <div className="gtp-toolbar">
        <div className="gtp-search-wrap">
          <Search size={16} className="gtp-search-icon" />
          <input className="gtp-search-input" placeholder="Search by task ID, order ID, or SKU..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(0) }} />
        </div>
        <div className="gtp-filter-pills">
          {["all", ...data.PICK_STATUSES].map(s => (
            <button key={s} className={cn("gtp-pill", statusFilter === s && "gtp-pill-active")} onClick={() => { setStatusFilter(s); setPage(0) }}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <div className="gtp-filter-select">
          <Filter size={14} />
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(0) }}>
            <option value="all">All Priorities</option>
            {data.PICK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="gtp-table-wrap">
        <table className="gtp-table">
          <thead>
            <tr>
              {[
                { key: "id", label: "Task ID" },
                { key: "orderId", label: "Order" },
                { key: "station", label: "Station" },
                { key: "priority", label: "Priority" },
                { key: "status", label: "Status" },
                { key: "sku", label: "SKU" },
                { key: "category", label: "Category" },
                { key: null, label: "Qty" },
                { key: "cycleTimeSec", label: "Cycle (s)" },
                { key: null, label: "Cycle Target" },
                { key: null, label: "Actions" },
              ].map((col, ci) => (
                <th key={ci} className={cn(col.key && "gtp-th-sort")} onClick={() => col.key && (setSortField(col.key), setSortDir(d => d === "asc" ? "desc" : "asc"))}>
                  <span className="gtp-th-content">{col.label}{sortField === col.key && <ArrowUpDown size={12} />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedTasks.map(t => {
              const cyclePct = (t.cycleTimeSec / t.targetCycleTime) * 100
              return (
                <tr key={t.id} className="gtp-table-row">
                  <td className="gtp-mono">{t.id}</td>
                  <td className="gtp-mono">{t.orderId}</td>
                  <td className="gtp-truncate">{t.station}</td>
                  <td><span className={cn("gtp-priority-badge", `gtp-priority-${t.priority.toLowerCase().replace("-", "")}`)}>{t.priority}</span></td>
                  <td><span className={cn("gtp-status-badge", `gtp-status-${t.status.toLowerCase().replace(" ", "-")}`)}>{t.status}</span></td>
                  <td className="gtp-mono">{t.sku}</td>
                  <td>{t.category}</td>
                  <td>{t.qtyPicked}/{t.qtyRequired}</td>
                  <td>{t.cycleTimeSec}s</td>
                  <td>
                    <div className="gtp-cycle-indicator">
                      <div className="gtp-cycle-bar" style={{ width: `${Math.min(100, cyclePct)}%`, backgroundColor: cyclePct > 100 ? THEME.danger : cyclePct > 80 ? THEME.accent : THEME.success }} />
                      <span>{t.targetCycleTime}s</span>
                    </div>
                  </td>
                  <td>
                    <button className="gtp-action-btn" onClick={() => setSelectedTask(t)}><Eye size={14} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="gtp-pagination">
        <span className="gtp-page-info">Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filteredTasks.length)} of {filteredTasks.length}</span>
        <div className="gtp-page-btns">
          <button className="gtp-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
          {Array.from({ length: Math.ceil(filteredTasks.length / PAGE_SIZE) }, (_, i) => (
            <button key={i} className={cn("gtp-page-btn", page === i && "gtp-page-active")} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button className="gtp-page-btn" disabled={page >= Math.ceil(filteredTasks.length / PAGE_SIZE) - 1} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  )

  // ─── Tab 3: Robot Fleet ───────────────────────────────────────────────────
  const renderRobots = () => (
    <div className="gtp-space-y-6">
      {/* Robot KPIs */}
      <div className="gtp-robot-kpi-row">
        {[
          { label: "Total Robots", value: data.robots.length, icon: Bot, color: THEME.primary },
          { label: "Working", value: data.robots.filter(r => r.status === "Working").length, icon: Play, color: THEME.success },
          { label: "Charging", value: data.robots.filter(r => r.status === "Charging").length, icon: Zap, color: THEME.accent },
          { label: "Maintenance", value: data.robots.filter(r => r.status === "Maintenance").length, icon: Settings, color: THEME.danger },
          { label: "Avg Battery", value: `${+(data.robots.reduce((a, r) => a + r.batteryLevel, 0) / data.robots.length).toFixed(0)}%`, icon: Gauge, color: THEME.secondary },
          { label: "Avg Utilization", value: `${+(data.robots.reduce((a, r) => a + r.utilization, 0) / data.robots.length).toFixed(1)}%`, icon: TrendingUp, color: "#06b6d4" },
        ].map((k, i) => (
          <div key={i} className="gtp-robot-kpi" style={{ borderTopColor: k.color }}>
            <k.icon size={18} style={{ color: k.color }} />
            <div className="gtp-robot-kpi-value">{k.value}</div>
            <div className="gtp-robot-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Robot Cards */}
      <div className="gtp-robot-grid">
        {data.robots.map((robot, i) => (
          <div key={i} className="gtp-robot-card" onClick={() => setSelectedRobot(robot)}>
            <div className="gtp-robot-header">
              <div className="gtp-robot-id">{robot.id}</div>
              <span className={cn("gtp-status-badge", `gtp-status-${robot.status.toLowerCase()}`)}>{robot.status}</span>
            </div>
            <div className="gtp-robot-type">{robot.type}</div>
            <div className="gtp-robot-info">
              <span><MapPin size={12} /> {robot.warehouse}</span>
              <span><Box size={12} /> {robot.zone}</span>
            </div>
            <div className="gtp-robot-metrics">
              <div className="gtp-robot-metric">
                <span className="gtp-metric-label">Battery</span>
                <div className="gtp-battery-bar">
                  <div className="gtp-battery-fill" style={{ width: `${robot.batteryLevel}%`, backgroundColor: robot.batteryLevel > 40 ? THEME.success : robot.batteryLevel > 20 ? THEME.accent : THEME.danger }} />
                </div>
                <span className="gtp-metric-val">{robot.batteryLevel}%</span>
              </div>
              <div className="gtp-robot-metric">
                <span className="gtp-metric-label">Utilization</span>
                <div className="gtp-battery-bar">
                  <div className="gtp-battery-fill" style={{ width: `${robot.utilization}%`, backgroundColor: THEME.primary }} />
                </div>
                <span className="gtp-metric-val">{robot.utilization}%</span>
              </div>
            </div>
            <div className="gtp-robot-footer">
              <span><Package size={12} /> {robot.currentTask}</span>
              <span><ArrowRight size={12} /> {robot.tripsToday} trips</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ─── Tab 4: Storage Pods ──────────────────────────────────────────────────
  const filteredPods = useMemo(() => {
    let result = [...data.storagePods]
    if (searchQuery) result = result.filter(p => p.id.toLowerCase().includes(searchQuery.toLowerCase()) || p.zone.toLowerCase().includes(searchQuery.toLowerCase()))
    if (statusFilter !== "all") result = result.filter(p => p.status === statusFilter)
    return result
  }, [searchQuery, statusFilter])

  const pagedPods = filteredPods.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const renderPods = () => (
    <div className="gtp-space-y-4">
      <div className="gtp-toolbar">
        <div className="gtp-search-wrap">
          <Search size={16} className="gtp-search-icon" />
          <input className="gtp-search-input" placeholder="Search by pod ID or zone..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(0) }} />
        </div>
        <div className="gtp-filter-pills">
          {["all", "Active", "Full", "Low Stock", "Maintenance", "Reserved"].map(s => (
            <button key={s} className={cn("gtp-pill", statusFilter === s && "gtp-pill-active")} onClick={() => { setStatusFilter(s); setPage(0) }}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="gtp-table-wrap">
        <table className="gtp-table">
          <thead>
            <tr>
              <th>Pod ID</th>
              <th>Warehouse</th>
              <th>Zone</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Bins Used</th>
              <th>Items</th>
              <th>Weight</th>
              <th>Access</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedPods.map(pod => (
              <tr key={pod.id} className="gtp-table-row">
                <td className="gtp-mono">{pod.id}</td>
                <td className="gtp-truncate">{pod.warehouse}</td>
                <td className="gtp-truncate">{pod.zone}</td>
                <td className="gtp-truncate">{pod.type.split(" ")[0]}</td>
                <td className="gtp-mono">{pod.location}</td>
                <td><span className={cn("gtp-status-badge", `gtp-status-${pod.status.toLowerCase()}`)}>{pod.status}</span></td>
                <td>
                  <div className="gtp-bin-visual">
                    <div className="gtp-bin-grid">
                      {Array.from({ length: 20 }, (_, bi) => (
                        <div key={bi} className={cn("gtp-bin-cell", bi < Math.round((pod.occupiedBins / pod.totalBins) * 20) ? "gtp-bin-occupied" : "gtp-bin-empty")} />
                      ))}
                    </div>
                    <span className="gtp-bin-count">{pod.occupiedBins}/{pod.totalBins}</span>
                  </div>
                </td>
                <td>
                  <div className="gtp-bar-mini"><div className="gtp-bar-mini-fill" style={{ width: `${(pod.items / pod.maxItems) * 100}%`, backgroundColor: THEME.primary }} /><span>{pod.items}/{pod.maxItems}</span></div>
                </td>
                <td><span className={cn(pod.weight === `${parseFloat(pod.weight) >= 150} kg` ? "gtp-weight-warn" : "")}>{pod.weight}</span></td>
                <td><span className={cn("gtp-access-badge", `gtp-access-${pod.accessFrequency.toLowerCase()}`)}>{pod.accessFrequency}</span></td>
                <td>
                  <button className="gtp-action-btn" onClick={() => setSelectedPod(pod)}><Eye size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gtp-pagination">
        <span className="gtp-page-info">Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filteredPods.length)} of {filteredPods.length}</span>
        <div className="gtp-page-btns">
          <button className="gtp-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
          {Array.from({ length: Math.ceil(filteredPods.length / PAGE_SIZE) }, (_, i) => (
            <button key={i} className={cn("gtp-page-btn", page === i && "gtp-page-active")} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button className="gtp-page-btn" disabled={page >= Math.ceil(filteredPods.length / PAGE_SIZE) - 1} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  )

  // ─── Tab 5: Exceptions & Waves ───────────────────────────────────────────
  const filteredExceptions = useMemo(() => {
    let result = [...data.exceptions]
    if (exceptionTypeFilter !== "all") result = result.filter(e => e.type === exceptionTypeFilter)
    if (exceptionSeverityFilter !== "all") result = result.filter(e => e.severity === exceptionSeverityFilter)
    if (statusFilter !== "all") result = result.filter(e => e.status === statusFilter)
    return result
  }, [exceptionTypeFilter, exceptionSeverityFilter, statusFilter])

  const renderExceptions = () => (
    <div className="gtp-space-y-6">
      {/* Exception KPIs */}
      <div className="gtp-exc-kpi-row">
        {[
          { label: "Total Exceptions", value: data.exceptions.length, icon: AlertTriangle, color: THEME.danger },
          { label: "Open", value: data.exceptions.filter(e => e.status === "Open").length, icon: CircleDot, color: THEME.accent },
          { label: "Investigating", value: data.exceptions.filter(e => e.status === "Investigating").length, icon: Search, color: THEME.primary },
          { label: "Resolved", value: data.exceptions.filter(e => e.status === "Resolved" || e.status === "Closed").length, icon: CheckCircle2, color: THEME.success },
          { label: "Critical", value: data.exceptions.filter(e => e.severity === "Critical").length, icon: AlertTriangle, color: "#dc2626" },
          { label: "Escalated", value: data.exceptions.filter(e => e.status === "Escalated").length, icon: ArrowUpRight, color: THEME.secondary },
        ].map((k, i) => (
          <div key={i} className="gtp-exc-kpi" style={{ borderTopColor: k.color }}>
            <k.icon size={18} style={{ color: k.color }} />
            <div className="gtp-exc-kpi-value">{k.value}</div>
            <div className="gtp-exc-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Exception Filters */}
      <div className="gtp-toolbar">
        <div className="gtp-filter-select">
          <Filter size={14} />
          <select value={exceptionTypeFilter} onChange={e => setExceptionTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            {data.EXCEPTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="gtp-filter-select">
          <select value={exceptionSeverityFilter} onChange={e => setExceptionSeverityFilter(e.target.value)}>
            <option value="all">All Severity</option>
            {["Critical", "High", "Medium", "Low"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="gtp-filter-pills">
          {["all", "Open", "Investigating", "Resolved", "Escalated", "Closed"].map(s => (
            <button key={s} className={cn("gtp-pill", statusFilter === s && "gtp-pill-active")} onClick={() => setStatusFilter(s)}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Exception List */}
      <div className="gtp-exc-list">
        {filteredExceptions.map(exc => (
          <div key={exc.id} className="gtp-exc-card" onClick={() => setSelectedException(exc)}>
            <div className="gtp-exc-header">
              <span className="gtp-exc-id">{exc.id}</span>
              <span className={cn("gtp-severity-badge", `gtp-severity-${exc.severity.toLowerCase()}`)}>{exc.severity}</span>
              <span className={cn("gtp-status-badge", `gtp-status-${exc.status.toLowerCase()}`)}>{exc.status}</span>
            </div>
            <div className="gtp-exc-body">
              <span className="gtp-exc-type"><Square size={12} /> {exc.type}</span>
              <span className="gtp-exc-task">Task: {exc.taskId}</span>
              <span className="gtp-exc-station">Station: {exc.stationId}</span>
              <span className="gtp-exc-warehouse">{exc.warehouse}</span>
            </div>
            <div className="gtp-exc-footer">
              <span className="gtp-exc-cause">Root: {exc.rootCause}</span>
              <span className="gtp-exc-impact"><AlertTriangle size={12} /> {exc.impact}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pick Waves */}
      <div className="gtp-section-card">
        <h3 className="gtp-section-title"><Zap size={16} /> Active Pick Waves</h3>
        <div className="gtp-wave-grid">
          {data.waves.map((wave, i) => {
            const progress = wave.totalOrders > 0 ? (wave.completedOrders / wave.totalOrders) * 100 : 0
            const lineProgress = wave.totalLines > 0 ? (wave.completedLines / wave.totalLines) * 100 : 0
            return (
              <div key={i} className="gtp-wave-card">
                <div className="gtp-wave-header">
                  <span className="gtp-wave-name">{wave.name}</span>
                  <span className={cn("gtp-status-badge", `gtp-status-${wave.status.toLowerCase().replace(" ", "-")}`)}>{wave.status}</span>
                </div>
                <div className="gtp-wave-priority"><span className={cn("gtp-priority-badge", `gtp-priority-${wave.priority.toLowerCase().replace("-", "")}`)}>{wave.priority}</span></div>
                <div className="gtp-wave-stats">
                  <span><Package size={12} /> {wave.completedOrders}/{wave.totalOrders} orders</span>
                  <span><LayoutGrid size={12} /> {wave.completedLines}/{wave.totalLines} lines</span>
                  <span><Bot size={12} /> {wave.robotsDeployed} robots</span>
                  <span><Users size={12} /> {wave.stationsAssigned} stations</span>
                </div>
                <div className="gtp-wave-bars">
                  <div className="gtp-wave-bar-wrap">
                    <span>Orders</span>
                    <div className="gtp-wave-bar-track"><div className="gtp-wave-bar-fill" style={{ width: `${progress}%`, backgroundColor: THEME.primary }} /></div>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="gtp-wave-bar-wrap">
                    <span>Lines</span>
                    <div className="gtp-wave-bar-track"><div className="gtp-wave-bar-fill" style={{ width: `${lineProgress}%`, backgroundColor: THEME.success }} /></div>
                    <span>{lineProgress.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="gtp-wave-meta">
                  <span><Clock size={12} /> Start: {wave.startTime}</span>
                  <span><Timer size={12} /> SLA: {wave.slaDeadline}</span>
                  {wave.exceptionCount > 0 && <span className="gtp-wave-exc"><AlertTriangle size={12} /> {wave.exceptionCount} exceptions</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ─── Drawers ───────────────────────────────────────────────────────────────
  const renderStationDrawer = () => {
    if (!selectedStation) return null
    const s = selectedStation
    return (
      <>
        <div className="gtp-drawer-overlay" onClick={() => setSelectedStation(null)} />
        <div className="gtp-drawer-panel">
          <div className="gtp-drawer-header" style={{ background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})` }}>
            <div className="gtp-drawer-title"><LayoutGrid size={20} /> Station Detail</div>
            <button className="gtp-drawer-close" onClick={() => setSelectedStation(null)}><X size={18} /></button>
          </div>
          <div className="gtp-drawer-body">
            <div className="gtp-drawer-grid">
              {[
                { label: "Station ID", value: s.id },
                { label: "Name", value: s.name },
                { label: "Warehouse", value: s.warehouse },
                { label: "Zone", value: s.zone },
                { label: "Status", value: s.status },
                { label: "Operator", value: s.operator },
                { label: "Current Wave", value: s.currentWave },
                { label: "Station Type", value: s.stationType },
                { label: "Storage System", value: s.storageSystem },
                { label: "Last Activity", value: s.lastActivity },
              ].map((field, i) => (
                <div key={i} className="gtp-field-card">
                  <div className="gtp-field-label">{field.label}</div>
                  <div className="gtp-field-value">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="gtp-drawer-metrics">
              {[
                { label: "Pick Rate", value: `${s.pickRate}%`, color: THEME.primary },
                { label: "Accuracy", value: `${s.accuracy}%`, color: THEME.success },
                { label: "Lines/Hour", value: s.linesPerHour.toString(), color: THEME.accent },
              ].map((m, i) => (
                <div key={i} className="gtp-metric-card" style={{ borderLeftColor: m.color }}>
                  <div className="gtp-metric-val" style={{ color: m.color }}>{m.value}</div>
                  <div className="gtp-metric-lbl">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="gtp-drawer-actions">
              <button className="gtp-drawer-btn gtp-drawer-btn-primary"><Play size={14} /> Resume</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-secondary"><Pause size={14} /> Pause</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-accent"><Settings size={14} /> Configure</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderTaskDrawer = () => {
    if (!selectedTask) return null
    const t = selectedTask
    return (
      <>
        <div className="gtp-drawer-overlay" onClick={() => setSelectedTask(null)} />
        <div className="gtp-drawer-panel">
          <div className="gtp-drawer-header" style={{ background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.danger})` }}>
            <div className="gtp-drawer-title"><PackageCheck size={20} /> Pick Task Detail</div>
            <button className="gtp-drawer-close" onClick={() => setSelectedTask(null)}><X size={18} /></button>
          </div>
          <div className="gtp-drawer-body">
            <div className="gtp-drawer-grid">
              {[
                { label: "Task ID", value: t.id },
                { label: "Order ID", value: t.orderId },
                { label: "SKU", value: t.sku },
                { label: "Item", value: t.itemName },
                { label: "Station", value: t.station },
                { label: "Operator", value: t.operator },
                { label: "Priority", value: t.priority },
                { label: "Status", value: t.status },
                { label: "Warehouse", value: t.warehouse },
                { label: "Zone", value: t.zone },
                { label: "Pick Location", value: t.pickLocation },
                { label: "Category", value: t.category },
                { label: "Quantity", value: `${t.qtyPicked}/${t.qtyRequired}` },
                { label: "Robot", value: `${t.robotId} (${t.robotType})` },
                { label: "Weight", value: t.weight },
                { label: "Dimensions", value: t.dimensions },
                { label: "Pin Code", value: t.pinCode },
              ].map((field, i) => (
                <div key={i} className="gtp-field-card">
                  <div className="gtp-field-label">{field.label}</div>
                  <div className="gtp-field-value">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="gtp-drawer-metrics">
              {[
                { label: "Cycle Time", value: `${t.cycleTimeSec}s`, color: t.cycleTimeSec > t.targetCycleTime ? THEME.danger : THEME.success },
                { label: "Target", value: `${t.targetCycleTime}s`, color: THEME.primary },
                { label: "Qty Progress", value: `${Math.round((t.qtyPicked / t.qtyRequired) * 100)}%`, color: THEME.accent },
              ].map((m, i) => (
                <div key={i} className="gtp-metric-card" style={{ borderLeftColor: m.color }}>
                  <div className="gtp-metric-val" style={{ color: m.color }}>{m.value}</div>
                  <div className="gtp-metric-lbl">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="gtp-drawer-actions">
              <button className="gtp-drawer-btn gtp-drawer-btn-primary"><CheckCircle2 size={14} /> Confirm Pick</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-secondary"><RotateCcw size={14} /> Reassign</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-accent"><Scan size={14} /> Rescan Item</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderRobotDrawer = () => {
    if (!selectedRobot) return null
    const r = selectedRobot
    return (
      <>
        <div className="gtp-drawer-overlay" onClick={() => setSelectedRobot(null)} />
        <div className="gtp-drawer-panel">
          <div className="gtp-drawer-header" style={{ background: `linear-gradient(135deg, #06b6d4, ${THEME.primary})` }}>
            <div className="gtp-drawer-title"><Bot size={20} /> Robot Detail</div>
            <button className="gtp-drawer-close" onClick={() => setSelectedRobot(null)}><X size={18} /></button>
          </div>
          <div className="gtp-drawer-body">
            <div className="gtp-drawer-grid">
              {[
                { label: "Robot ID", value: r.id },
                { label: "Type", value: r.type },
                { label: "Model", value: r.model },
                { label: "Warehouse", value: r.warehouse },
                { label: "Zone", value: r.zone },
                { label: "Status", value: r.status },
                { label: "Current Task", value: r.currentTask },
                { label: "Station", value: r.stationName },
                { label: "Speed", value: r.speed },
                { label: "Payload", value: `${r.payloadWeight} / ${r.maxPayload}` },
                { label: "Firmware", value: r.firmwareVersion },
                { label: "Total Runtime", value: r.totalRuntime },
              ].map((field, i) => (
                <div key={i} className="gtp-field-card">
                  <div className="gtp-field-label">{field.label}</div>
                  <div className="gtp-field-value">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="gtp-drawer-metrics">
              {[
                { label: "Battery", value: `${r.batteryLevel}%`, color: r.batteryLevel > 40 ? THEME.success : r.batteryLevel > 20 ? THEME.accent : THEME.danger },
                { label: "Utilization", value: `${r.utilization}%`, color: THEME.primary },
                { label: "Trips Today", value: r.tripsToday.toString(), color: THEME.secondary },
              ].map((m, i) => (
                <div key={i} className="gtp-metric-card" style={{ borderLeftColor: m.color }}>
                  <div className="gtp-metric-val" style={{ color: m.color }}>{m.value}</div>
                  <div className="gtp-metric-lbl">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="gtp-drawer-actions">
              <button className="gtp-drawer-btn gtp-drawer-btn-primary"><Play size={14} /> Deploy</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-secondary"><Warehouse size={14} /> Dock</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-accent"><Settings size={14} /> Diagnostics</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderPodDrawer = () => {
    if (!selectedPod) return null
    const p = selectedPod
    return (
      <>
        <div className="gtp-drawer-overlay" onClick={() => setSelectedPod(null)} />
        <div className="gtp-drawer-panel">
          <div className="gtp-drawer-header" style={{ background: `linear-gradient(135deg, ${THEME.secondary}, ${THEME.accent})` }}>
            <div className="gtp-drawer-title"><Box size={20} /> Storage Pod Detail</div>
            <button className="gtp-drawer-close" onClick={() => setSelectedPod(null)}><X size={18} /></button>
          </div>
          <div className="gtp-drawer-body">
            <div className="gtp-drawer-grid">
              {[
                { label: "Pod ID", value: p.id },
                { label: "Warehouse", value: p.warehouse },
                { label: "Zone", value: p.zone },
                { label: "Type", value: p.type },
                { label: "Location", value: p.location },
                { label: "Status", value: p.status },
                { label: "Access Frequency", value: p.accessFrequency },
                { label: "Last Accessed", value: p.lastAccessed },
                { label: "Temperature", value: p.temperature },
                { label: "Humidity", value: p.humidity },
              ].map((field, i) => (
                <div key={i} className="gtp-field-card">
                  <div className="gtp-field-label">{field.label}</div>
                  <div className="gtp-field-value">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="gtp-drawer-metrics">
              {[
                { label: "Bins Used", value: `${p.occupiedBins}/${p.totalBins}`, color: THEME.primary },
                { label: "Items", value: `${p.items}/${p.maxItems}`, color: THEME.secondary },
                { label: "Weight", value: p.weight, color: THEME.accent },
              ].map((m, i) => (
                <div key={i} className="gtp-metric-card" style={{ borderLeftColor: m.color }}>
                  <div className="gtp-metric-val" style={{ color: m.color }}>{m.value}</div>
                  <div className="gtp-metric-lbl">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="gtp-drawer-actions">
              <button className="gtp-drawer-btn gtp-drawer-btn-primary"><ArrowRightLeft size={14} /> Retrieve</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-secondary"><RotateCcw size={14} /> Replenish</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-accent"><Scan size={14} /> Audit</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderExceptionDrawer = () => {
    if (!selectedException) return null
    const e = selectedException
    return (
      <>
        <div className="gtp-drawer-overlay" onClick={() => setSelectedException(null)} />
        <div className="gtp-drawer-panel">
          <div className="gtp-drawer-header" style={{ background: `linear-gradient(135deg, ${THEME.danger}, ${THEME.accent})` }}>
            <div className="gtp-drawer-title"><AlertTriangle size={20} /> Exception Detail</div>
            <button className="gtp-drawer-close" onClick={() => setSelectedException(null)}><X size={18} /></button>
          </div>
          <div className="gtp-drawer-body">
            <div className="gtp-drawer-grid">
              {[
                { label: "Exception ID", value: e.id },
                { label: "Task ID", value: e.taskId },
                { label: "Station", value: e.stationId },
                { label: "Warehouse", value: e.warehouse },
                { label: "Type", value: e.type },
                { label: "Severity", value: e.severity },
                { label: "Status", value: e.status },
                { label: "Reported By", value: e.reportedBy },
                { label: "Impact", value: e.impact },
                { label: "Reported At", value: e.reportedAt },
                { label: "Resolved At", value: e.resolvedAt || "Pending" },
              ].map((field, i) => (
                <div key={i} className="gtp-field-card">
                  <div className="gtp-field-label">{field.label}</div>
                  <div className="gtp-field-value">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="gtp-drawer-info-block">
              <div className="gtp-field-label">Description</div>
              <div className="gtp-field-value">{e.description}</div>
            </div>
            <div className="gtp-drawer-info-block">
              <div className="gtp-field-label">Root Cause</div>
              <div className="gtp-field-value">{e.rootCause}</div>
            </div>
            <div className="gtp-drawer-info-block">
              <div className="gtp-field-label">Corrective Action</div>
              <div className="gtp-field-value">{e.correctiveAction}</div>
            </div>
            <div className="gtp-drawer-actions">
              <button className="gtp-drawer-btn gtp-drawer-btn-primary"><CheckCircle2 size={14} /> Resolve</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-secondary"><ArrowUpRight size={14} /> Escalate</button>
              <button className="gtp-drawer-btn gtp-drawer-btn-accent"><Search size={14} /> Investigate</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ─── Main Render ──────────────────────────────────────────────────────────
  const tabLabels = [
    "Dashboard",
    "Picking Stations",
    "Pick Tasks",
    "Robot Fleet",
    "Storage Pods",
    "Exceptions & Waves",
  ]

  return (
    <div className="gtp-root">
      <Tabs value={String(activeTab)} onValueChange={v => { setActiveTab(Number(v)); setPage(0); setSearchQuery(""); setStatusFilter("all"); setPriorityFilter("all"); setZoneFilter("all") }}>
        <div className="gtp-tabs-wrap">
          <TabsList className="gtp-tabs-list">
            {tabLabels.map((label, i) => (
              <TabsTrigger key={i} value={String(i)} className="gtp-tab-trigger">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="gtp-content-area">
          {[renderDashboard, renderStations, renderTasks, renderRobots, renderPods, renderExceptions].map((renderFn, i) => (
            <TabsContent key={i} value={String(i)} className="gtp-tab-content">
              {renderFn()}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {renderStationDrawer()}
      {renderTaskDrawer()}
      {renderRobotDrawer()}
      {renderPodDrawer()}
      {renderExceptionDrawer()}
    </div>
  )
}
'''

with open(OUT, "w") as f:
    f.write(component)

print(f"Written {len(component)} chars to {OUT}")
