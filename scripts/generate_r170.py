#!/usr/bin/env python3
"""Generate R170: Value-Added Services (VAS) Center module."""

OUT = "/home/z/my-project/src/components/modules/value-added-services-view.tsx"

component = r'''"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts"
import {
  Sparkles, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, ArrowUpRight, ArrowDownRight, Eye, X, Package, Clock,
  Bot, Warehouse, Timer, MapPin, User, ChevronRight, ArrowRight,
  PackageCheck, Scan, Box, Boxes, LayoutGrid, Zap, Target,
  Truck, RotateCcw, QrCode, Filter, ArrowUpDown, Play, Pause,
  CircleDot, Square, Settings, Activity, Gauge, Users, Gift, Tag,
  PenTool, Palette, Star, Layers, Wrench, ClipboardCheck, BadgePercent,
  PackageOpen, Scissors, IndianRupee, FileText, Stamp, MessageSquare,
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

const VAS_SERVICE_TYPES = [
  "Gift Wrapping", "Custom Labeling", "Kitting & Bundling", "Product Assembly",
  "Quality Recheck", "Returns Processing", "Custom Packaging", "Insertions & Collateral",
  "Poly-bagging", "Shrink Wrapping", "Price Tagging", "Serialization",
] as const;
const ORDER_SOURCES = ["Amazon IN", "Flipkart", "Meesho", "Myntra", "Nykaa", "Ajio", "Snapdeal", "Direct D2C", "Croma", "BigBasket"] as const;
const COMPLEXITY_LEVELS = ["Simple", "Standard", "Complex", "Premium"] as const;
const VAS_STATUSES = ["Pending", "In Progress", "Quality Check", "Completed", "On Hold", "Cancelled"] as const;
const PRIORITY_LEVELS = ["Express", "High", "Normal", "Low", "Batch"] as const;
const OPERATOR_SKILLS = ["Gift Wrapping Expert", "Label Specialist", "Kitting Pro", "Assembly Technician", "QC Inspector", "Packaging Designer", "Returns Processor", "Poly-bag Operator"] as const;
const INDIAN_WAREHOUSES = ["Mumbai HUB-W1", "Delhi NCR HUB-W2", "Bangalore HUB-W3", "Chennai HUB-W4", "Hyderabad HUB-W5", "Kolkata HUB-W6", "Pune HUB-W7", "Jaipur HUB-W8"] as const;
const INDIAN_PIN_PREFIXES = ["400", "110", "560", "600", "500", "700", "411", "302"];
const MATERIALS = ["Premium Gift Paper", "Tissue Paper", "Bubble Wrap", "Corrugated Box", "Poly Bag", "Shrink Film", "Ribbon", "Sticker Label", "Thermal Label", "Custom Box", "Foam Insert", "Silica Gel Pack", "Thank You Card", "Product Manual", "Warranty Card"] as const;
const DEFECT_TYPES = ["Label Misprint", "Wrong Insert", "Damaged Wrap", "Missing Component", "Incorrect Assembly", "Wrong Gift Message", "Poor Seal Quality", "Dimension Mismatch"] as const;

function generateData() {
  const r = seededRandom(1704200);
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;
  const rf = (min: number, max: number) => +(r() * (max - min) + min).toFixed(1);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyTrend = months.map(m => ({
    month: m,
    ordersProcessed: ri(3000, 12000),
    giftWrap: ri(800, 3000),
    labeling: ri(500, 2500),
    kitting: ri(300, 1800),
    customPack: ri(200, 1200),
    rework: ri(100, 600),
    revenue: ri(500000, 2500000),
    avgCost: ri(8, 45),
  }))

  const servicePerformance = VAS_SERVICE_TYPES.map(svc => ({
    service: svc,
    volume: ri(200, 5000),
    avgTime: rf(1.5, 25),
    costPerUnit: rf(5, 120),
    qualityScore: rf(94, 99.9),
    customerSatisfaction: rf(3.8, 5.0),
    errorRate: rf(0.1, 3.2),
  }))

  const operators = Array.from({ length: 30 }, (_, i) => ({
    id: `OP-${String(i + 1).padStart(3, "0")}`,
    name: `${["Aarav", "Priya", "Rahul", "Ananya", "Vikram", "Sneha", "Arjun", "Kavya", "Deepak", "Neha", "Amit", "Pooja", "Ravi", "Shruti", "Karan", "Divya", "Manish", "Ritu", "Suresh", "Meera", "Rajesh", "Swati", "Harsh", "Anjali", "Gaurav", "Nisha", "Pranav", "Lakshmi", "Siddharth", "Tanvi"][i]}`,
    skill: pick(OPERATOR_SKILLS),
    warehouse: pick(INDIAN_WAREHOUSES),
    shift: pick(["Morning 6AM-2PM", "Afternoon 2PM-10PM", "Night 10PM-6AM"]),
    status: pick(["Active", "On Break", "Training", "Off Duty"]),
    tasksCompleted: ri(50, 800),
    tasksToday: ri(0, 45),
    avgTime: rf(2.5, 18),
    qualityScore: rf(95, 99.8),
    efficiency: rf(70, 99),
    certifications: ri(1, 5),
    joinDate: `2024-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
  }))

  const serviceOrders = Array.from({ length: 120 }, (_, i) => ({
    id: `VAS-${String(i + 1).padStart(4, "0")}`,
    orderId: `ORD-${ri(10000, 99999)}`,
    source: pick(ORDER_SOURCES),
    warehouse: pick(INDIAN_WAREHOUSES),
    serviceType: pick(VAS_SERVICE_TYPES),
    status: pick(VAS_STATUSES),
    priority: pick(PRIORITY_LEVELS),
    complexity: pick(COMPLEXITY_LEVELS),
    operatorId: operators[i % 30].id,
    operatorName: operators[i % 30].name,
    assignedAt: `2026-07-${String(ri(1, 28)).padStart(2, "0")} ${String(ri(0, 23)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}`,
    startedAt: pick(["Completed", "Quality Check", "In Progress"]).includes(pick(VAS_STATUSES)) ? `2026-07-${String(ri(1, 28)).padStart(2, "0")} ${String(ri(0, 23)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}` : null,
    completedAt: pick(["Completed"]).includes(pick(VAS_STATUSES)) ? `2026-07-${String(ri(1, 28)).padStart(2, "0")} ${String(ri(0, 23)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}` : null,
    processingTime: ri(1, 45),
    targetTime: ri(5, 30),
    materialCost: rf(5, 150),
    laborCost: rf(10, 80),
    totalCost: 0,
    sku: `SKU-${ri(10000, 99999)}`,
    productName: `${pick(["Electronics", "Apparel", "FMCG", "Beauty", "Home", "Sports", "Jewelry", "Toys", "Books", "Kitchen"])} ${pick(["Premium", "Standard", "Basic", "Deluxe", "Economy"])} ${ri(100, 999)}`,
    quantity: ri(1, 50),
    pinCode: `${pick(INDIAN_PIN_PREFIXES)}${String(ri(0, 999)).padStart(3, "0")}`,
    notes: pick(["Customer requested birthday wrapping", "Insert promotional flyer", "Gift message included", "Fragile - extra bubble wrap", "No branding material", "Premium gold ribbon", "Express delivery prep", "Add warranty card", "Multi-item bundle", "Custom sticker required", "Return label inside", "Special Diwali packaging"]),
  }))
  // Fix total cost
  serviceOrders.forEach(o => { o.totalCost = +(o.materialCost + o.laborCost).toFixed(2) })

  const inventory = Array.from({ length: 25 }, (_, i) => ({
    id: `MAT-${String(i + 1).padStart(3, "0")}`,
    material: pick(MATERIALS),
    warehouse: pick(INDIAN_WAREHOUSES),
    category: pick(["Wrapping", "Labeling", "Packaging", "Inserts", "Protection", "Assembly"]),
    stock: ri(0, 5000),
    reorderPoint: ri(200, 1000),
    maxStock: ri(2000, 8000),
    unitCost: rf(0.5, 50),
    supplier: pick(["PackPro India", "LabelCraft Mumbai", "WrapArt Delhi", "BoxMasters Pune", "PolyPak Chennai", "RibbonWorld Jaipur", "FoamTech Hyderabad", "PrintPlus Kolkata"]),
    lastRestocked: `2026-${String(ri(6, 7)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
    usagePerDay: ri(20, 300),
    status: (() => {
      const ratio = (i * 17 + 50) % 100;
      return ratio < 15 ? "Out of Stock" : ratio < 30 ? "Low Stock" : ratio < 90 ? "In Stock" : "Overstock";
    })(),
    location: `BIN-${ri(1, 20)}-${String.fromCharCode(65 + ri(0, 25))}${ri(1, 10)}`,
  }))

  const defects = Array.from({ length: 20 }, (_, i) => ({
    id: `DEF-${String(i + 1).padStart(3, "0")}`,
    orderId: serviceOrders[i].orderId,
    vasId: serviceOrders[i].id,
    serviceType: serviceOrders[i].serviceType,
    defectType: pick(DEFECT_TYPES),
    severity: pick(["Critical", "Major", "Minor", "Cosmetic"]),
    status: pick(["Open", "Investigating", "Resolved", "Closed"]),
    reportedBy: operators[i % 30].name,
    warehouse: pick(INDIAN_WAREHOUSES),
    description: pick(["Gift wrap torn at corner", "Label text misaligned", "Missing thank you card", "Wrong size poly bag", "Assembly part missing", "Gift message typo", "Seal not airtight", "Box dimensions incorrect", "Sticker peeling off", "Ribbon color mismatch"]),
    rootCause: pick(["Material defect", "Operator error", "Machine calibration", "Template mismatch", "Inadequate training", "Time pressure", "Environmental factor"]),
    correctiveAction: pick(["Replace material batch", "Retrain operator", "Recalibrate machine", "Update template", "Add QC checkpoint", "Adjust process timing", "Change supplier"]),
    costImpact: rf(10, 500),
    reportedAt: `2026-07-${String(ri(1, 28)).padStart(2, "0")} ${String(ri(0, 23)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}`,
  }))

  const sourcePerformance = ORDER_SOURCES.map(src => ({
    source: src,
    orders: ri(200, 4000),
    giftWrapRate: rf(15, 65),
    labelingRate: rf(20, 80),
    avgVASCost: rf(15, 85),
    defectRate: rf(0.3, 4.5),
    satisfaction: rf(3.5, 4.9),
  }))

  return {
    VAS_SERVICE_TYPES, ORDER_SOURCES, COMPLEXITY_LEVELS, VAS_STATUSES,
    PRIORITY_LEVELS, OPERATOR_SKILLS, INDIAN_WAREHOUSES, INDIAN_PIN_PREFIXES,
    MATERIALS, DEFECT_TYPES,
    months, monthlyTrend, servicePerformance, operators, serviceOrders,
    inventory, defects, sourcePerformance,
  };
}

const data = generateData()

const THEME = {
  primary: "#a855f7",    // Purple
  secondary: "#06b6d4",  // Cyan
  accent: "#f59e0b",     // Amber
  success: "#22c55e",    // Green
  danger: "#ef4444",     // Red
  muted: "#64748b",      // Slate
}

const PIE_COLORS = [THEME.primary, THEME.secondary, THEME.accent, THEME.success, THEME.danger, "#ec4899", "#6366f1", "#14b8a6", "#f97316", "#84cc16", "#8b5cf6", "#0ea5e9"]

function formatINR(val: number): string {
  if (val >= 10000000) return `\u20B9${(val / 10000000).toFixed(1)} Cr`
  if (val >= 100000) return `\u20B9${(val / 100000).toFixed(1)} L`
  return `\u20B9${val.toLocaleString("en-IN")}`
}

export default function ValueAddedServicesView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<typeof data.serviceOrders[0] | null>(null)
  const [selectedOperator, setSelectedOperator] = useState<typeof data.operators[0] | null>(null)
  const [selectedDefect, setSelectedDefect] = useState<typeof data.defects[0] | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<typeof data.inventory[0] | null>(null)
  const [now, setNow] = useState(new Date())

  useMemo(() => {
    const iv = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(iv)
  }, [])

  const PAGE_SIZE = 12

  const kpis = useMemo(() => {
    const active = data.operators.filter(o => o.status === "Active").length
    const completed = data.serviceOrders.filter(o => o.status === "Completed").length
    const totalCost = data.serviceOrders.reduce((a, o) => a + o.totalCost, 0)
    const avgQuality = +(data.operators.reduce((a, o) => a + o.qualityScore, 0) / data.operators.length).toFixed(1)
    const openDefects = data.defects.filter(d => d.status === "Open" || d.status === "Investigating").length
    const pending = data.serviceOrders.filter(o => o.status === "Pending").length
    return { active, completed, totalCost, avgQuality, openDefects, pending }
  }, [])

  // ─── Tab 0: Dashboard ─────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="vas-space-y-6">
      <div className="vas-clock-bar">
        <div className="vas-clock-label"><Sparkles size={14} /> VAS Operations Center</div>
        <div className="vas-clock-time">{now.toLocaleTimeString("en-IN", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
        <div className="vas-clock-date">{now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </div>

      <div className="vas-kpi-grid">
        {[
          { label: "Active Operators", value: kpis.active, sub: `of ${data.operators.length}`, icon: Users, color: THEME.primary },
          { label: "Orders Completed", value: kpis.completed, sub: `of ${data.serviceOrders.length}`, icon: PackageCheck, color: THEME.success },
          { label: "Total VAS Revenue", value: formatINR(kpis.totalCost), sub: "material + labor", icon: IndianRupee, color: THEME.accent },
          { label: "Avg Quality Score", value: `${kpis.avgQuality}%`, sub: "operator quality", icon: Target, color: THEME.secondary },
          { label: "Pending Orders", value: kpis.pending, sub: "awaiting processing", icon: Clock, color: "#ec4899" },
          { label: "Open Defects", value: kpis.openDefects, sub: "requiring attention", icon: AlertTriangle, color: THEME.danger },
        ].map((k, i) => (
          <div key={i} className="vas-kpi-card" style={{ borderLeftColor: k.color }}>
            <div className="vas-kpi-icon" style={{ backgroundColor: k.color + "18", color: k.color }}>
              <k.icon size={20} />
            </div>
            <div className="vas-kpi-content">
              <div className="vas-kpi-value">{k.value}</div>
              <div className="vas-kpi-label">{k.label}</div>
              <div className="vas-kpi-sub">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="vas-charts-row">
        <div className="vas-chart-card">
          <h3 className="vas-chart-title">Monthly VAS Processing Volume</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="giftWrap" name="Gift Wrap" fill={THEME.primary} radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="labeling" name="Labeling" fill={THEME.secondary} radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="kitting" name="Kitting" fill={THEME.accent} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" dataKey="revenue" name="Revenue (\u20B9)" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="vas-chart-card">
          <h3 className="vas-chart-title">Service Type Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.servicePerformance.slice(0, 6)}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="service" tick={{ fill: "#94a3b8", fontSize: 9 }} />
              <PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 9 }} />
              <Radar name="Volume" dataKey="volume" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.15} />
              <Radar name="Quality %" dataKey="qualityScore" stroke={THEME.success} fill={THEME.success} fillOpacity={0.1} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="vas-charts-row">
        <div className="vas-chart-card">
          <h3 className="vas-chart-title">Order Source Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.ORDER_SOURCES.map((s, i) => ({ name: s, value: data.serviceOrders.filter(o => o.source === s).length })).filter(d => d.value > 0)} cx="50%" cy="50%" outerRadius={100} innerRadius={55} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: "#475569" }}>
                {data.ORDER_SOURCES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="vas-chart-card">
          <h3 className="vas-chart-title">Channel Satisfaction Score</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.sourcePerformance.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="source" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis domain={[3, 5]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }} />
              <Bar dataKey="satisfaction" name="Satisfaction" radius={[4, 4, 0, 0]}>
                {data.sourcePerformance.slice(0, 8).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  // ─── Tab 1: Service Orders ────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    let result = [...data.serviceOrders]
    if (searchQuery) result = result.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || o.sku.includes(searchQuery))
    if (statusFilter !== "all") result = result.filter(o => o.status === statusFilter)
    if (serviceFilter !== "all") result = result.filter(o => o.serviceType === serviceFilter)
    if (priorityFilter !== "all") result = result.filter(o => o.priority === priorityFilter)
    if (sortField) result.sort((a, b) => {
      const av: number = (a as any)[sortField] ?? 0
      const bv: number = (b as any)[sortField] ?? 0
      return sortDir === "asc" ? av - bv : bv - av
    })
    return result
  }, [searchQuery, statusFilter, serviceFilter, priorityFilter, sortField, sortDir])

  const pagedOrders = filteredOrders.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const renderOrders = () => (
    <div className="vas-space-y-4">
      <div className="vas-toolbar">
        <div className="vas-search-wrap">
          <Search size={16} className="vas-search-icon" />
          <input className="vas-search-input" placeholder="Search by VAS ID, Order ID, SKU..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(0) }} />
        </div>
        <div className="vas-filter-pills">
          {["all", ...data.VAS_STATUSES].map(s => (
            <button key={s} className={cn("vas-pill", statusFilter === s && "vas-pill-active")} onClick={() => { setStatusFilter(s); setPage(0) }}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <div className="vas-filter-select">
          <Filter size={14} />
          <select value={serviceFilter} onChange={e => { setServiceFilter(e.target.value); setPage(0) }}>
            <option value="all">All Services</option>
            {data.VAS_SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="vas-filter-select">
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(0) }}>
            <option value="all">All Priority</option>
            {data.PRIORITY_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="vas-table-wrap">
        <table className="vas-table">
          <thead>
            <tr>
              {[
                { key: "id", label: "VAS ID" },
                { key: "orderId", label: "Order" },
                { key: "source", label: "Source" },
                { key: "serviceType", label: "Service" },
                { key: "priority", label: "Priority" },
                { key: "status", label: "Status" },
                { key: null, label: "Complexity" },
                { key: "processingTime", label: "Time" },
                { key: "totalCost", label: "Cost" },
                { key: null, label: "Actions" },
              ].map((col, ci) => (
                <th key={ci} className={cn(col.key && "vas-th-sort")} onClick={() => col.key && (setSortField(col.key), setSortDir(d => d === "asc" ? "desc" : "asc"))}>
                  <span className="vas-th-content">{col.label}{sortField === col.key && <ArrowUpDown size={12} />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedOrders.map(o => {
              const timePct = (o.processingTime / o.targetTime) * 100
              return (
                <tr key={o.id} className="vas-table-row">
                  <td className="vas-mono">{o.id}</td>
                  <td className="vas-mono">{o.orderId}</td>
                  <td className="vas-truncate">{o.source}</td>
                  <td className="vas-truncate">{o.serviceType}</td>
                  <td><span className={cn("vas-priority-badge", `vas-priority-${o.priority.toLowerCase()}`)}>{o.priority}</span></td>
                  <td><span className={cn("vas-status-badge", `vas-status-${o.status.toLowerCase().replace(" ", "-")}`)}>{o.status}</span></td>
                  <td><span className={cn("vas-complexity-badge", `vas-complexity-${o.complexity.toLowerCase()}`)}>{o.complexity}</span></td>
                  <td>
                    <div className="vas-time-indicator">
                      <div className="vas-time-bar" style={{ width: `${Math.min(100, timePct)}%`, backgroundColor: timePct > 100 ? THEME.danger : timePct > 80 ? THEME.accent : THEME.success }} />
                      <span>{o.processingTime}s</span>
                    </div>
                  </td>
                  <td className="vas-cost">{formatINR(o.totalCost)}</td>
                  <td>
                    <button className="vas-action-btn" onClick={() => setSelectedOrder(o)}><Eye size={14} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="vas-pagination">
        <span className="vas-page-info">Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length}</span>
        <div className="vas-page-btns">
          <button className="vas-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
          {Array.from({ length: Math.ceil(filteredOrders.length / PAGE_SIZE) }, (_, i) => (
            <button key={i} className={cn("vas-page-btn", page === i && "vas-page-active")} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button className="vas-page-btn" disabled={page >= Math.ceil(filteredOrders.length / PAGE_SIZE) - 1} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  )

  // ─── Tab 2: Operators & Workforce ──────────────────────────────────────────
  const renderOperators = () => (
    <div className="vas-space-y-6">
      <div className="vas-op-kpi-row">
        {[
          { label: "Total Operators", value: data.operators.length, icon: Users, color: THEME.primary },
          { label: "Active", value: data.operators.filter(o => o.status === "Active").length, icon: Play, color: THEME.success },
          { label: "On Break", value: data.operators.filter(o => o.status === "On Break").length, icon: Pause, color: THEME.accent },
          { label: "In Training", value: data.operators.filter(o => o.status === "Training").length, icon: ClipboardCheck, color: THEME.secondary },
          { label: "Avg Efficiency", value: `${+(data.operators.reduce((a, o) => a + o.efficiency, 0) / data.operators.length).toFixed(1)}%`, icon: TrendingUp, color: "#06b6d4" },
          { label: "Avg Quality", value: `${+(data.operators.reduce((a, o) => a + o.qualityScore, 0) / data.operators.length).toFixed(1)}%`, icon: Target, color: "#ec4899" },
        ].map((k, i) => (
          <div key={i} className="vas-op-kpi" style={{ borderTopColor: k.color }}>
            <k.icon size={18} style={{ color: k.color }} />
            <div className="vas-op-kpi-value">{k.value}</div>
            <div className="vas-op-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="vas-op-grid">
        {data.operators.map((op, i) => (
          <div key={i} className="vas-op-card" onClick={() => setSelectedOperator(op)}>
            <div className="vas-op-header">
              <div className="vas-op-avatar">{op.name.charAt(0)}</div>
              <div>
                <div className="vas-op-name">{op.name}</div>
                <div className="vas-op-id">{op.id}</div>
              </div>
              <span className={cn("vas-status-badge", `vas-status-${op.status.toLowerCase().replace(" ", "-")}`)}>{op.status}</span>
            </div>
            <div className="vas-op-skill"><Star size={12} /> {op.skill}</div>
            <div className="vas-op-info">
              <span><MapPin size={12} /> {op.warehouse}</span>
              <span><Clock size={12} /> {op.shift}</span>
            </div>
            <div className="vas-op-metrics">
              <div className="vas-op-metric">
                <span className="vas-op-metric-label">Efficiency</span>
                <div className="vas-op-bar"><div className="vas-op-bar-fill" style={{ width: `${op.efficiency}%`, backgroundColor: op.efficiency > 90 ? THEME.success : op.efficiency > 75 ? THEME.accent : THEME.danger }} /></div>
                <span>{op.efficiency}%</span>
              </div>
              <div className="vas-op-metric">
                <span className="vas-op-metric-label">Quality</span>
                <div className="vas-op-bar"><div className="vas-op-bar-fill" style={{ width: `${op.qualityScore}%`, backgroundColor: THEME.primary }} /></div>
                <span>{op.qualityScore}%</span>
              </div>
            </div>
            <div className="vas-op-footer">
              <span><PackageCheck size={12} /> {op.tasksToday} today / {op.tasksCompleted} total</span>
              <span><BadgePercent size={12} /> {op.certifications} certs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ─── Tab 3: Materials & Inventory ──────────────────────────────────────────
  const filteredInventory = useMemo(() => {
    let result = [...data.inventory]
    if (searchQuery) result = result.filter(m => m.material.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase()))
    if (statusFilter !== "all") result = result.filter(m => m.status === statusFilter)
    return result
  }, [searchQuery, statusFilter])

  const pagedInventory = filteredInventory.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const renderInventory = () => (
    <div className="vas-space-y-4">
      <div className="vas-toolbar">
        <div className="vas-search-wrap">
          <Search size={16} className="vas-search-icon" />
          <input className="vas-search-input" placeholder="Search by material or ID..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(0) }} />
        </div>
        <div className="vas-filter-pills">
          {["all", "In Stock", "Low Stock", "Overstock", "Out of Stock"].map(s => (
            <button key={s} className={cn("vas-pill", statusFilter === s && "vas-pill-active")} onClick={() => { setStatusFilter(s); setPage(0) }}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="vas-table-wrap">
        <table className="vas-table">
          <thead>
            <tr>
              <th>Material ID</th>
              <th>Material</th>
              <th>Warehouse</th>
              <th>Category</th>
              <th>Status</th>
              <th>Stock Level</th>
              <th>Reorder Point</th>
              <th>Unit Cost</th>
              <th>Usage/Day</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedInventory.map(m => {
              const stockPct = (m.stock / m.maxStock) * 100
              const reorderPct = (m.reorderPoint / m.maxStock) * 100
              return (
                <tr key={m.id} className="vas-table-row">
                  <td className="vas-mono">{m.id}</td>
                  <td className="vas-bold">{m.material}</td>
                  <td className="vas-truncate">{m.warehouse}</td>
                  <td><span className="vas-cat-badge">{m.category}</span></td>
                  <td><span className={cn("vas-stock-badge", `vas-stock-${m.status.toLowerCase().replace(" ", "-")}`)}>{m.status}</span></td>
                  <td>
                    <div className="vas-stock-visual">
                      <div className="vas-stock-bar-track">
                        <div className="vas-stock-bar-fill" style={{ width: `${stockPct}%`, backgroundColor: stockPct < 20 ? THEME.danger : stockPct < 40 ? THEME.accent : THEME.success }} />
                        <div className="vas-stock-bar-reorder" style={{ left: `${reorderPct}%` }} />
                      </div>
                      <span className="vas-stock-val">{m.stock}</span>
                    </div>
                  </td>
                  <td>{m.reorderPoint}</td>
                  <td className="vas-cost">{formatINR(m.unitCost)}</td>
                  <td>{m.usagePerDay}</td>
                  <td className="vas-truncate">{m.supplier}</td>
                  <td>
                    <button className="vas-action-btn" onClick={() => setSelectedMaterial(m)}><Eye size={14} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="vas-pagination">
        <span className="vas-page-info">Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filteredInventory.length)} of {filteredInventory.length}</span>
        <div className="vas-page-btns">
          <button className="vas-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
          {Array.from({ length: Math.ceil(filteredInventory.length / PAGE_SIZE) }, (_, i) => (
            <button key={i} className={cn("vas-page-btn", page === i && "vas-page-active")} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button className="vas-page-btn" disabled={page >= Math.ceil(filteredInventory.length / PAGE_SIZE) - 1} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  )

  // ─── Tab 4: Quality & Defects ──────────────────────────────────────────────
  const filteredDefects = useMemo(() => {
    let result = [...data.defects]
    if (severityFilter !== "all") result = result.filter(d => d.severity === severityFilter)
    if (statusFilter !== "all") result = result.filter(d => d.status === statusFilter)
    return result
  }, [severityFilter, statusFilter])

  const renderQuality = () => (
    <div className="vas-space-y-6">
      <div className="vas-defect-kpi-row">
        {[
          { label: "Total Defects", value: data.defects.length, icon: AlertTriangle, color: THEME.danger },
          { label: "Open", value: data.defects.filter(d => d.status === "Open").length, icon: CircleDot, color: THEME.accent },
          { label: "Critical", value: data.defects.filter(d => d.severity === "Critical").length, icon: AlertTriangle, color: "#dc2626" },
          { label: "Resolved", value: data.defects.filter(d => d.status === "Resolved" || d.status === "Closed").length, icon: CheckCircle2, color: THEME.success },
          { label: "Avg Cost Impact", value: formatINR(+(data.defects.reduce((a, d) => a + d.costImpact, 0) / data.defects.length).toFixed(0)), icon: IndianRupee, color: THEME.primary },
          { label: "Defect Rate", value: `${((data.defects.length / data.serviceOrders.length) * 100).toFixed(1)}%`, icon: BarChart3, color: THEME.secondary },
        ].map((k, i) => (
          <div key={i} className="vas-defect-kpi" style={{ borderTopColor: k.color }}>
            <k.icon size={18} style={{ color: k.color }} />
            <div className="vas-defect-kpi-value">{k.value}</div>
            <div className="vas-defect-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="vas-toolbar">
        <div className="vas-filter-select">
          <Filter size={14} />
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
            <option value="all">All Severity</option>
            {["Critical", "Major", "Minor", "Cosmetic"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="vas-filter-pills">
          {["all", "Open", "Investigating", "Resolved", "Closed"].map(s => (
            <button key={s} className={cn("vas-pill", statusFilter === s && "vas-pill-active")} onClick={() => setStatusFilter(s)}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="vas-defect-list">
        {filteredExceptions.map(def => (
          <div key={def.id} className="vas-defect-card" onClick={() => setSelectedDefect(def)}>
            <div className="vas-defect-header">
              <span className="vas-defect-id">{def.id}</span>
              <span className={cn("vas-severity-badge", `vas-severity-${def.severity.toLowerCase()}`)}>{def.severity}</span>
              <span className={cn("vas-status-badge", `vas-status-${def.status.toLowerCase()}`)}>{def.status}</span>
            </div>
            <div className="vas-defect-body">
              <span className="vas-defect-type"><Square size={12} /> {def.defectType}</span>
              <span className="vas-defect-order">Order: {def.orderId}</span>
              <span className="vas-defect-service">{def.serviceType}</span>
              <span className="vas-defect-reported">By: {def.reportedBy}</span>
            </div>
            <div className="vas-defect-footer">
              <span className="vas-defect-cause">Root: {def.rootCause}</span>
              <span className="vas-defect-cost"><IndianRupee size={12} /> {formatINR(def.costImpact)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ─── Drawers ───────────────────────────────────────────────────────────────
  const renderOrderDrawer = () => {
    if (!selectedOrder) return null
    const o = selectedOrder
    return (
      <>
        <div className="vas-drawer-overlay" onClick={() => setSelectedOrder(null)} />
        <div className="vas-drawer-panel">
          <div className="vas-drawer-header" style={{ background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})` }}>
            <div className="vas-drawer-title"><Sparkles size={20} /> VAS Order Detail</div>
            <button className="vas-drawer-close" onClick={() => setSelectedOrder(null)}><X size={18} /></button>
          </div>
          <div className="vas-drawer-body">
            <div className="vas-drawer-grid">
              {[
                { label: "VAS ID", value: o.id },
                { label: "Order ID", value: o.orderId },
                { label: "Source", value: o.source },
                { label: "Service", value: o.serviceType },
                { label: "Priority", value: o.priority },
                { label: "Status", value: o.status },
                { label: "Complexity", value: o.complexity },
                { label: "Warehouse", value: o.warehouse },
                { label: "Operator", value: o.operatorName },
                { label: "SKU", value: o.sku },
                { label: "Product", value: o.productName },
                { label: "Quantity", value: String(o.quantity) },
                { label: "Pin Code", value: o.pinCode },
                { label: "Target Time", value: `${o.targetTime}s` },
                { label: "Assigned", value: o.assignedAt },
                { label: "Completed", value: o.completedAt || "Pending" },
              ].map((field, i) => (
                <div key={i} className="vas-field-card">
                  <div className="vas-field-label">{field.label}</div>
                  <div className="vas-field-value">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="vas-drawer-metrics">
              {[
                { label: "Total Cost", value: formatINR(o.totalCost), color: THEME.accent },
                { label: "Material", value: formatINR(o.materialCost), color: THEME.primary },
                { label: "Labor", value: formatINR(o.laborCost), color: THEME.secondary },
              ].map((m, i) => (
                <div key={i} className="vas-metric-card" style={{ borderLeftColor: m.color }}>
                  <div className="vas-metric-val" style={{ color: m.color }}>{m.value}</div>
                  <div className="vas-metric-lbl">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="vas-drawer-info-block">
              <div className="vas-field-label">Notes</div>
              <div className="vas-field-value">{o.notes}</div>
            </div>
            <div className="vas-drawer-actions">
              <button className="vas-drawer-btn vas-drawer-btn-primary"><Play size={14} /> Start</button>
              <button className="vas-drawer-btn vas-drawer-btn-secondary"><ClipboardCheck size={14} /> QC Check</button>
              <button className="vas-drawer-btn vas-drawer-btn-accent"><PackageCheck size={14} /> Complete</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderOperatorDrawer = () => {
    if (!selectedOperator) return null
    const op = selectedOperator
    return (
      <>
        <div className="vas-drawer-overlay" onClick={() => setSelectedOperator(null)} />
        <div className="vas-drawer-panel">
          <div className="vas-drawer-header" style={{ background: `linear-gradient(135deg, ${THEME.secondary}, ${THEME.primary})` }}>
            <div className="vas-drawer-title"><Users size={20} /> Operator Detail</div>
            <button className="vas-drawer-close" onClick={() => setSelectedOperator(null)}><X size={18} /></button>
          </div>
          <div className="vas-drawer-body">
            <div className="vas-drawer-grid">
              {[
                { label: "Operator ID", value: op.id },
                { label: "Name", value: op.name },
                { label: "Skill", value: op.skill },
                { label: "Warehouse", value: op.warehouse },
                { label: "Shift", value: op.shift },
                { label: "Status", value: op.status },
                { label: "Join Date", value: op.joinDate },
                { label: "Certifications", value: String(op.certifications) },
                { label: "Avg Time/Task", value: `${op.avgTime}s` },
                { label: "Tasks Today", value: `${op.tasksToday} / ${op.tasksCompleted} total` },
              ].map((field, i) => (
                <div key={i} className="vas-field-card">
                  <div className="vas-field-label">{field.label}</div>
                  <div className="vas-field-value">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="vas-drawer-metrics">
              {[
                { label: "Efficiency", value: `${op.efficiency}%`, color: op.efficiency > 90 ? THEME.success : THEME.accent },
                { label: "Quality", value: `${op.qualityScore}%`, color: THEME.primary },
                { label: "Tasks", value: String(op.tasksCompleted), color: THEME.secondary },
              ].map((m, i) => (
                <div key={i} className="vas-metric-card" style={{ borderLeftColor: m.color }}>
                  <div className="vas-metric-val" style={{ color: m.color }}>{m.value}</div>
                  <div className="vas-metric-lbl">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="vas-drawer-actions">
              <button className="vas-drawer-btn vas-drawer-btn-primary"><Play size={14} /> Assign Task</button>
              <button className="vas-drawer-btn vas-drawer-btn-secondary"><ClipboardCheck size={14} /> Certify</button>
              <button className="vas-drawer-btn vas-drawer-btn-accent"><Settings size={14} /> Schedule</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderDefectDrawer = () => {
    if (!selectedDefect) return null
    const d = selectedDefect
    return (
      <>
        <div className="vas-drawer-overlay" onClick={() => setSelectedDefect(null)} />
        <div className="vas-drawer-panel">
          <div className="vas-drawer-header" style={{ background: `linear-gradient(135deg, ${THEME.danger}, ${THEME.accent})` }}>
            <div className="vas-drawer-title"><AlertTriangle size={20} /> Defect Detail</div>
            <button className="vas-drawer-close" onClick={() => setSelectedDefect(null)}><X size={18} /></button>
          </div>
          <div className="vas-drawer-body">
            <div className="vas-drawer-grid">
              {[
                { label: "Defect ID", value: d.id },
                { label: "Order ID", value: d.orderId },
                { label: "VAS ID", value: d.vasId },
                { label: "Service Type", value: d.serviceType },
                { label: "Defect Type", value: d.defectType },
                { label: "Severity", value: d.severity },
                { label: "Status", value: d.status },
                { label: "Reported By", value: d.reportedBy },
                { label: "Warehouse", value: d.warehouse },
                { label: "Cost Impact", value: formatINR(d.costImpact) },
                { label: "Reported At", value: d.reportedAt },
              ].map((field, i) => (
                <div key={i} className="vas-field-card">
                  <div className="vas-field-label">{field.label}</div>
                  <div className="vas-field-value">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="vas-drawer-info-block">
              <div className="vas-field-label">Description</div>
              <div className="vas-field-value">{d.description}</div>
            </div>
            <div className="vas-drawer-info-block">
              <div className="vas-field-label">Root Cause</div>
              <div className="vas-field-value">{d.rootCause}</div>
            </div>
            <div className="vas-drawer-info-block">
              <div className="vas-field-label">Corrective Action</div>
              <div className="vas-field-value">{d.correctiveAction}</div>
            </div>
            <div className="vas-drawer-actions">
              <button className="vas-drawer-btn vas-drawer-btn-primary"><CheckCircle2 size={14} /> Resolve</button>
              <button className="vas-drawer-btn vas-drawer-btn-secondary"><ArrowUpRight size={14} /> Escalate</button>
              <button className="vas-drawer-btn vas-drawer-btn-accent"><Search size={14} /> Investigate</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderMaterialDrawer = () => {
    if (!selectedMaterial) return null
    const m = selectedMaterial
    return (
      <>
        <div className="vas-drawer-overlay" onClick={() => setSelectedMaterial(null)} />
        <div className="vas-drawer-panel">
          <div className="vas-drawer-header" style={{ background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.primary})` }}>
            <div className="vas-drawer-title"><PackageOpen size={20} /> Material Detail</div>
            <button className="vas-drawer-close" onClick={() => setSelectedMaterial(null)}><X size={18} /></button>
          </div>
          <div className="vas-drawer-body">
            <div className="vas-drawer-grid">
              {[
                { label: "Material ID", value: m.id },
                { label: "Material", value: m.material },
                { label: "Category", value: m.category },
                { label: "Warehouse", value: m.warehouse },
                { label: "Status", value: m.status },
                { label: "Location", value: m.location },
                { label: "Stock", value: String(m.stock) },
                { label: "Max Stock", value: String(m.maxStock) },
                { label: "Reorder Point", value: String(m.reorderPoint) },
                { label: "Unit Cost", value: formatINR(m.unitCost) },
                { label: "Usage/Day", value: String(m.usagePerDay) },
                { label: "Supplier", value: m.supplier },
                { label: "Last Restocked", value: m.lastRestocked },
              ].map((field, i) => (
                <div key={i} className="vas-field-card">
                  <div className="vas-field-label">{field.label}</div>
                  <div className="vas-field-value">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="vas-drawer-metrics">
              {[
                { label: "Stock %", value: `${((m.stock / m.maxStock) * 100).toFixed(0)}%`, color: m.stock > m.reorderPoint ? THEME.success : THEME.danger },
                { label: "Days of Supply", value: `${Math.max(0, Math.floor(m.stock / m.usagePerDay))}`, color: THEME.primary },
                { label: "Value", value: formatINR(m.stock * m.unitCost), color: THEME.accent },
              ].map((mk, i) => (
                <div key={i} className="vas-metric-card" style={{ borderLeftColor: mk.color }}>
                  <div className="vas-metric-val" style={{ color: mk.color }}>{mk.value}</div>
                  <div className="vas-metric-lbl">{mk.label}</div>
                </div>
              ))}
            </div>
            <div className="vas-drawer-actions">
              <button className="vas-drawer-btn vas-drawer-btn-primary"><Package size={14} /> Restock</button>
              <button className="vas-drawer-btn vas-drawer-btn-secondary"><ArrowRight size={14} /> Transfer</button>
              <button className="vas-drawer-btn vas-drawer-btn-accent"><FileText size={14} /> PO Request</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const tabLabels = ["Dashboard", "Service Orders", "Operators", "Materials", "Quality & Defects"]

  return (
    <div className="vas-root">
      <Tabs value={String(activeTab)} onValueChange={v => { setActiveTab(Number(v)); setPage(0); setSearchQuery(""); setStatusFilter("all"); setServiceFilter("all"); setPriorityFilter("all"); setSeverityFilter("all") }}>
        <div className="vas-tabs-wrap">
          <TabsList className="vas-tabs-list">
            {tabLabels.map((label, i) => (
              <TabsTrigger key={i} value={String(i)} className="vas-tab-trigger">{label}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="vas-content-area">
          {[renderDashboard, renderOrders, renderOperators, renderInventory, renderQuality].map((renderFn, i) => (
            <TabsContent key={i} value={String(i)} className="vas-tab-content">{renderFn()}</TabsContent>
          ))}
        </div>
      </Tabs>

      {renderOrderDrawer()}
      {renderOperatorDrawer()}
      {renderDefectDrawer()}
      {renderMaterialDrawer()}
    </div>
  )
}
'''

with open(OUT, "w") as f:
    f.write(component)

print(f"Written {len(component)} chars to {OUT}")
