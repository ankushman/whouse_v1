"use client"

import { useState } from "react"
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
  ComposedChart,
} from "recharts"
import {
  Puzzle, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, Eye, X, Clock, Package, Star, Zap, ArrowRight,
  Box, IndianRupee, User, ChevronRight, ShieldAlert, Boxes,
  RotateCcw, FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(137137)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const KIT_STATUSES = ["Draft", "Components Reserved", "In Assembly", "QC Check", "Completed", "Shipped", "Cancelled"]
const KIT_TYPES = ["Standard Kit", "Custom Bundle", "Promotional Pack", "Gift Set", "Repair Kit", "Sample Pack", "Emergency Kit", "Wholesale Pack"]
const PRIORITIES = ["Critical", "High", "Medium", "Low"]
const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D"]

const KIT_TEMPLATES = [
  { id: "KT-001", name: "First Aid Kit (50pc)", components: 12, type: "Standard Kit", value: 4500 },
  { id: "KT-002", name: "Festival Gift Box", components: 8, type: "Gift Set", value: 2800 },
  { id: "KT-003", name: "Auto Repair Kit Pro", components: 15, type: "Repair Kit", value: 12500 },
  { id: "KT-004", name: "Electronics Starter Pack", components: 6, type: "Sample Pack", value: 8900 },
  { id: "KT-005", name: "Promotional Combo A", components: 4, type: "Promotional Pack", value: 1200 },
  { id: "KT-006", name: "Office Stationery Set", components: 10, type: "Wholesale Pack", value: 3200 },
  { id: "KT-007", name: "Emergency Safety Kit", components: 18, type: "Emergency Kit", value: 18500 },
  { id: "KT-008", name: "Custom Gift Hamper", components: 6, type: "Custom Bundle", value: 5500 },
  { id: "KT-009", name: "Warehouse Tool Kit", components: 14, type: "Standard Kit", value: 9800 },
  { id: "KT-010", name: "Distributor Pack 10pc", components: 10, type: "Wholesale Pack", value: 4200 },
]

const COMPONENTS = [
  { sku: "CMP-001", name: "Bandage Roll 5cm", cat: "Medical", price: 45 },
  { sku: "CMP-002", name: "Antiseptic Liquid 100ml", cat: "Medical", price: 120 },
  { sku: "CMP-003", name: "Cotton Wool 100g", cat: "Medical", price: 35 },
  { sku: "CMP-004", name: "Gauze Pad 10x10", cat: "Medical", price: 28 },
  { sku: "CMP-005", name: "Gift Box S", cat: "Packaging", price: 85 },
  { sku: "CMP-006", name: "Ribbon Roll Gold", cat: "Packaging", price: 65 },
  { sku: "CMP-007", name: "Brake Pad Set", cat: "Auto Parts", price: 4500 },
  { sku: "CMP-008", name: "Engine Oil 1L", cat: "Auto Parts", price: 380 },
  { sku: "CMP-009", name: "LED Bulb 9W", cat: "Electronics", price: 120 },
  { sku: "CMP-010", name: "USB Cable 1m", cat: "Electronics", price: 150 },
  { sku: "CMP-011", name: "Notebook A5 100pg", cat: "Stationery", price: 45 },
  { sku: "CMP-012", name: "Pen Pack 10pc", cat: "Stationery", price: 180 },
  { sku: "CMP-013", name: "Safety Goggles", cat: "Safety", price: 350 },
  { sku: "CMP-014", name: "Gloves Nitrile 100pc", cat: "Safety", price: 580 },
  { sku: "CMP-015", name: "Sticker Label Roll", cat: "Packaging", price: 25 },
  { sku: "CMP-016", name: "Chocolate Box 250g", cat: "Food", price: 650 },
  { sku: "CMP-017", name: "Screwdriver Set 8pc", cat: "Tools", price: 420 },
  { sku: "CMP-018", name: "Wrench Set 6pc", cat: "Tools", price: 780 },
]

const ASSEMBLERS = [
  { id: "ASM-001", name: "Vikram Das", warehouse: "Mumbai Hub", speed: "Fast", cert: "L2" },
  { id: "ASM-002", name: "Meena Kumari", warehouse: "Delhi NCR", speed: "Expert", cert: "L3" },
  { id: "ASM-003", name: "Raju Nair", warehouse: "Chennai DC", speed: "Standard", cert: "L1" },
  { id: "ASM-004", name: "Sunita Bose", warehouse: "Kolkata Hub", speed: "Expert", cert: "L3" },
  { id: "ASM-005", name: "Arun Patel", warehouse: "Bangalore South", speed: "Fast", cert: "L2" },
  { id: "ASM-006", name: "Divya Sharma", warehouse: "Pune West", speed: "Standard", cert: "L1" },
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const COLORS = ["#e11d48", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"]

// Kit orders
const kitOrders = (() => {
  const result: Array<{
    id: string; template: typeof KIT_TEMPLATES[0]; type: string; qty: number;
    status: string; priority: string; warehouse: string; assembler: typeof ASSEMBLERS[0] | null;
    zone: string; componentsReady: number; totalComponents: number; progress: number;
    createdAt: string; dueDate: string; completedAt: string | null; value: number;
    defectCount: number;
  }> = []
  for (let i = 0; i < 100; i++) {
    const tmpl = pick(KIT_TEMPLATES)
    const status = pick(KIT_STATUSES)
    const priority = status === "Cancelled" ? "Low" : pick(PRIORITIES)
    const warehouse = pick(WAREHOUSES)
    const assembler = status !== "Draft" && status !== "Cancelled" ? pick(ASSEMBLERS) : null
    const totalComp = tmpl.components
    const progress = status === "Completed" || status === "Shipped" ? 100
      : status === "Cancelled" ? 0
      : status === "Draft" ? 0
      : status === "Components Reserved" ? rInt(10, 30)
      : status === "In Assembly" ? rInt(40, 85)
      : rInt(85, 99)
    const day = String(rInt(1, 28)).padStart(2, "0")
    result.push({
      id: `KIT-${String(i + 1).padStart(4, "0")}`,
      template: tmpl,
      type: tmpl.type,
      qty: rInt(1, 50),
      status, priority, warehouse, assembler,
      zone: pick(ZONES),
      componentsReady: Math.round(totalComp * progress / 100),
      totalComponents: totalComp,
      progress,
      createdAt: `2026-07-${day}`,
      dueDate: `2026-07-${String(Math.min(28, parseInt(day) + rInt(2, 10))).padStart(2, "0")}`,
      completedAt: status === "Completed" || status === "Shipped" ? `2026-07-${day}` : null,
      value: tmpl.value * rInt(1, 50),
      defectCount: status === "Completed" || status === "Shipped" ? rInt(0, 3) : 0,
    })
  }
  return result
})()

// Component inventory
const componentInventory = (() => {
  return COMPONENTS.map((c) => ({
    ...c,
    stock: rInt(50, 500),
    reserved: rInt(10, 100),
    available: 0, // computed below
    reorderLevel: rInt(20, 80),
  })).map((c) => ({ ...c, available: c.stock - c.reserved }))
})()

// Monthly trend
const monthlyTrend = MONTHS.map((m) => ({
  month: m, kits: rInt(80, 200), completed: rInt(60, 180),
  defectRate: +(rand() * 4 + 0.5).toFixed(1),
}))

// Template distribution
const templateDist = KIT_TEMPLATES.map((t) => ({ name: t.name.split("(")[0].trim(), count: rInt(5, 25) }))

// Type distribution
const typeDist = (() => {
  const counts: Record<string, number> = {}
  kitOrders.forEach((k) => { counts[k.type] = (counts[k.type] || 0) + 1 })
  return Object.entries(counts).map(([type, count]) => ({ type, count }))
})()

// Assembly station utilization
const stationUtil = (() => {
  return ASSEMBLERS.map((a) => ({
    assembler: a.name,
    station: `Station ${a.id.split("-")[1]}`,
    warehouse: a.warehouse,
    speed: a.speed,
    utilization: rInt(40, 95),
    kitsToday: rInt(8, 30),
    avgTime: rInt(5, 45),
    defects: rInt(0, 4),
  }))
})()

// Component shortage
const componentShortage = componentInventory.filter((c) => c.available < c.reorderLevel).map((c) => ({
  ...c, shortage: c.reorderLevel - c.available, urgency: c.available < c.reorderLevel / 2 ? "Critical" : "Warning",
}))

// Quality data
const qualityStats = (() => {
  return MONTHS.map((m) => ({
    month: m,
    inspected: rInt(80, 200),
    passed: rInt(75, 195),
    defects: rInt(1, 12),
  }))
})()

const STATUS_COLORS: Record<string, string> = {
  Draft: "kit-badge-draft", "Components Reserved": "kit-badge-reserved",
  "In Assembly": "kit-badge-assembly", "QC Check": "kit-badge-qc",
  Completed: "kit-badge-completed", Shipped: "kit-badge-shipped", Cancelled: "kit-badge-cancelled",
}
const PRIORITY_COLORS: Record<string, string> = {
  Critical: "kit-badge-critical", High: "kit-badge-high", Medium: "kit-badge-medium", Low: "kit-badge-low",
}
const SPEED_COLORS: Record<string, string> = {
  Expert: "kit-badge-expert", Fast: "kit-badge-fast", Standard: "kit-badge-standard",
}

const fmtRupee = (n: number) => `₹${n.toLocaleString("en-IN")}`

export default function KittingAssemblyView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [queueSearch, setQueueSearch] = useState("")
  const [queueStatusFilter, setQueueStatusFilter] = useState("All")
  const [queueTypeFilter, setQueueTypeFilter] = useState("All")
  const [selectedKit, setSelectedKit] = useState<typeof kitOrders[0] | null>(null)

  const filteredQueue = (() => {
    const q = queueSearch.toLowerCase()
    return kitOrders.filter((k) => {
      const matchSearch = !q || k.id.toLowerCase().includes(q) || k.template.name.toLowerCase().includes(q)
        || k.warehouse.toLowerCase().includes(q) || k.type.toLowerCase().includes(q)
      const matchStatus = queueStatusFilter === "All" || k.status === queueStatusFilter
      const matchType = queueTypeFilter === "All" || k.type === queueTypeFilter
      return matchSearch && matchStatus && matchType
    })
  })()
  const visibleQueue = filteredQueue.slice(0, 60)

  return (
    <div className="kit-container">
      {/* Header */}
      <div className="kit-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-sky-500 flex items-center justify-center">
            <Puzzle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Kitting & Assembly</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Multi-Component Kit Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="kit-stat-chip"><span className="text-[10px] text-gray-500">Templates</span><span className="text-sm font-bold text-rose-600">10</span></span>
          <span className="kit-stat-chip"><span className="text-[10px] text-gray-500">In Assembly</span><span className="text-sm font-bold text-sky-600">{kitOrders.filter((k) => k.status === "In Assembly").length}</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="kit-tabs-wrapper mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Dashboard</TabsTrigger>
            <TabsTrigger value="queue" className="gap-1.5"><Package className="h-3.5 w-3.5" />Kit Queue</TabsTrigger>
            <TabsTrigger value="components" className="gap-1.5"><Boxes className="h-3.5 w-3.5" />Components</TabsTrigger>
            <TabsTrigger value="stations" className="gap-1.5"><User className="h-3.5 w-3.5" />Stations</TabsTrigger>
            <TabsTrigger value="quality" className="gap-1.5"><ShieldAlert className="h-3.5 w-3.5" />Quality</TabsTrigger>
          </TabsList>

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { title: "Total Kits", val: "100", icon: Puzzle, cls: "kit-kpi-rose" },
                  { title: "In Assembly", val: String(kitOrders.filter((k) => k.status === "In Assembly").length), icon: Zap, cls: "kit-kpi-sky" },
                  { title: "Completed", val: String(kitOrders.filter((k) => ["Completed", "Shipped"].includes(k.status)).length), icon: CheckCircle2, cls: "kit-kpi-emerald" },
                  { title: "Cancelled", val: String(kitOrders.filter((k) => k.status === "Cancelled").length), icon: X, cls: "kit-kpi-gray" },
                  { title: "Avg Build Time", val: "18 min", icon: Clock, cls: "kit-kpi-amber" },
                  { title: "Defect Rate", val: "2.3%", icon: AlertTriangle, cls: "kit-kpi-violet" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("kit-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-lg font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="kit-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Kit Volume & Defect Rate</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="kits" fill="#e11d48" radius={[4, 4, 0, 0]} name="Total Kits" />
                    <Line type="monotone" dataKey="defectRate" stroke="#f59e0b" strokeWidth={2} dot={false} name="Defect %" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="kit-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Kit Type Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={typeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="count" nameKey="type" label={({ type, percent }) => `${type.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <Card className="kit-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Kit Templates Overview</CardTitle></CardHeader><CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {KIT_TEMPLATES.slice(0, 10).map((t) => (
                    <div key={t.id} className="kit-template-card rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-rose-500" />
                        <span className="text-[11px] font-semibold truncate">{t.name.split("(")[0]}</span>
                      </div>
                      <div className="text-[9px] text-gray-500">{t.components} components | {t.type}</div>
                      <div className="text-[10px] font-mono text-emerald-600 mt-1">{fmtRupee(t.value)}</div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 2: KIT QUEUE */}
          {activeTab === "queue" && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2 kit-filter-bar">
                <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" /><input type="text" placeholder="Kit ID / Template / Warehouse / Type..." value={queueSearch} onChange={(e) => setQueueSearch(e.target.value)} className="kit-input w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" /></div>
                <select value={queueStatusFilter} onChange={(e) => setQueueStatusFilter(e.target.value)} className="kit-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2">
                  <option value="All">All Status</option>{KIT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={queueTypeFilter} onChange={(e) => setQueueTypeFilter(e.target.value)} className="kit-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2">
                  <option value="All">All Types</option>{KIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="kit-table-wrapper overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <Table className="table-hover-highlight"><TableHeader><TableRow>
                  <TableHead className="text-[10px]">Kit ID</TableHead><TableHead className="text-[10px]">Template</TableHead>
                  <TableHead className="text-[10px]">Type</TableHead><TableHead className="text-[10px]">Qty</TableHead>
                  <TableHead className="text-[10px]">Priority</TableHead><TableHead className="text-[10px]">Status</TableHead>
                  <TableHead className="text-[10px]">Progress</TableHead><TableHead className="text-[10px]">Components</TableHead>
                  <TableHead className="text-[10px]">Value ₹</TableHead><TableHead className="text-[10px]">Warehouse</TableHead>
                  <TableHead className="text-[10px] hidden md:table-cell">Assembler</TableHead>
                  <TableHead className="text-[10px] hidden lg:table-cell">Due</TableHead>
                  <TableHead className="text-[10px]">Actions</TableHead>
                </TableRow></TableHeader><TableBody>
                  {visibleQueue.map((k) => (
                    <TableRow key={k.id} className={cn("text-xs", k.status === "In Assembly" ? "kit-row-assembly" : k.status === "QC Check" ? "kit-row-qc" : "")}>
                      <TableCell className="font-mono font-medium">{k.id}</TableCell>
                      <TableCell className="truncate max-w-[140px]">{k.template.name.split("(")[0]}</TableCell>
                      <TableCell><Badge className="badge-interactive text-[9px] px-1.5 py-0 kit-badge-type">{k.type.split(" ")[0]}</Badge></TableCell>
                      <TableCell className="tabular-nums">{k.qty}</TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", PRIORITY_COLORS[k.priority])}>{k.priority}</Badge></TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", STATUS_COLORS[k.status])}>{k.status.split(" ")[0]}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className="kit-progress-bar w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-sky-500" style={{ width: `${k.progress}%` }} />
                          </div>
                          <span className="text-[9px] tabular-nums text-gray-500">{k.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="numeric-cell tabular-nums">{k.componentsReady}/{k.totalComponents}</TableCell>
                      <TableCell className="numeric-cell font-mono">{fmtRupee(k.value)}</TableCell>
                      <TableCell className="text-[10px]">{k.warehouse.split(" ")[0]}</TableCell>
                      <TableCell className="hidden md:table-cell text-[10px]">{k.assembler?.name.split(" ")[0] || "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-[10px]">{k.dueDate}</TableCell>
                      <TableCell><Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => setSelectedKit(k)}><Eye className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </div>
              <div className="text-xs text-gray-400 text-right">Showing {visibleQueue.length} of {filteredQueue.length} records</div>
            </div>
          )}

          {/* TAB 3: COMPONENTS */}
          {activeTab === "components" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Total Components", val: "18", icon: Boxes, cls: "kit-kpi-rose" },
                  { title: "Low Stock", val: String(componentShortage.length), icon: AlertTriangle, cls: "kit-kpi-amber" },
                  { title: "Total Reserved", val: String(componentInventory.reduce((s, c) => s + c.reserved, 0)), icon: Package, cls: "kit-kpi-sky" },
                  { title: "Available", val: String(componentInventory.reduce((s, c) => s + c.available, 0)), icon: CheckCircle2, cls: "kit-kpi-emerald" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("kit-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-lg font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              <div className="kit-table-wrapper overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <Table className="table-hover-highlight"><TableHeader><TableRow>
                  <TableHead className="text-[10px]">SKU</TableHead><TableHead className="text-[10px]">Component</TableHead>
                  <TableHead className="text-[10px]">Category</TableHead><TableHead className="text-[10px]">Price ₹</TableHead>
                  <TableHead className="text-[10px]">Stock</TableHead><TableHead className="text-[10px]">Reserved</TableHead>
                  <TableHead className="text-[10px]">Available</TableHead><TableHead className="text-[10px]">Reorder Lvl</TableHead>
                  <TableHead className="text-[10px]">Status</TableHead>
                </TableRow></TableHeader><TableBody>
                  {componentInventory.map((c) => (
                    <TableRow key={c.sku} className={cn("text-xs", c.available < c.reorderLevel ? "kit-row-shortage" : "")}>
                      <TableCell className="font-mono">{c.sku}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-[10px]">{c.cat}</TableCell>
                      <TableCell className="numeric-cell font-mono">{c.price}</TableCell>
                      <TableCell className="tabular-nums">{c.stock}</TableCell>
                      <TableCell className="tabular-nums text-amber-600">{c.reserved}</TableCell>
                      <TableCell className={cn("tabular-nums font-semibold", c.available < c.reorderLevel / 2 ? "text-red-500" : c.available < c.reorderLevel ? "text-amber-500" : "text-emerald-500")}>{c.available}</TableCell>
                      <TableCell className="tabular-nums">{c.reorderLevel}</TableCell>
                      <TableCell>
                        {c.available < c.reorderLevel ? (
                          <Badge className={cn("text-[9px] px-1.5 py-0", c.available < c.reorderLevel / 2 ? "kit-badge-critical" : "kit-badge-low-stock")}>
                            {c.available < c.reorderLevel / 2 ? "Critical" : "Low Stock"}
                          </Badge>
                        ) : (
                          <Badge className="badge-interactive text-[9px] px-1.5 py-0 kit-badge-instock">In Stock</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </div>
            </div>
          )}

          {/* TAB 4: STATIONS */}
          {activeTab === "stations" && (
            <div className="mt-4 space-y-4">
              <Card className="kit-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Assembly Station Utilization</CardTitle></CardHeader><CardContent>
                <ResponsiveContainer width="100%" height={260}><BarChart data={stationUtil}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="assembler" fontSize={10} />
                  <YAxis fontSize={11} domain={[0, 100]} unit="%" /><Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="utilization" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Utilization %" />
                </BarChart></ResponsiveContainer>
              </CardContent></Card>

              <div className="kit-table-wrapper overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <Table className="table-hover-highlight"><TableHeader><TableRow>
                  <TableHead className="text-[10px]">Station</TableHead><TableHead className="text-[10px]">Assembler</TableHead>
                  <TableHead className="text-[10px]">Speed</TableHead><TableHead className="text-[10px]">Cert</TableHead>
                  <TableHead className="text-[10px]">Warehouse</TableHead><TableHead className="text-[10px]">Utilization</TableHead>
                  <TableHead className="text-[10px]">Kits Today</TableHead><TableHead className="text-[10px]">Avg Time</TableHead>
                  <TableHead className="text-[10px]">Defects</TableHead>
                </TableRow></TableHeader><TableBody>
                  {stationUtil.map((s) => (
                    <TableRow key={s.station} className="text-xs">
                      <TableCell className="font-medium">{s.station}</TableCell>
                      <TableCell>{s.assembler}</TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", SPEED_COLORS[s.speed])}>{s.speed}</Badge></TableCell>
                      <TableCell><Badge className="badge-interactive text-[9px] px-1.5 py-0 kit-badge-cert">{s.defects === 0 ? "L1" : s.defects < 2 ? "L2" : "L3"}</Badge></TableCell>
                      <TableCell className="text-[10px]">{s.warehouse.split(" ")[0]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className="kit-progress-bar w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className={cn("h-full rounded-full", s.utilization > 80 ? "bg-emerald-500" : s.utilization > 50 ? "bg-sky-500" : "bg-amber-500")} style={{ width: `${s.utilization}%` }} />
                          </div>
                          <span className="text-[9px] tabular-nums">{s.utilization}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums">{s.kitsToday}</TableCell>
                      <TableCell className="tabular-nums">{s.avgTime}m</TableCell>
                      <TableCell className={cn("tabular-nums", s.defects > 2 ? "text-red-500 font-semibold" : "text-emerald-500")}>{s.defects}</TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </div>
            </div>
          )}

          {/* TAB 5: QUALITY */}
          {activeTab === "quality" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Total Inspected", val: String(qualityStats.reduce((s, q) => s + q.inspected, 0)), icon: ShieldAlert, cls: "kit-kpi-rose" },
                  { title: "Pass Rate", val: "96.8%", icon: CheckCircle2, cls: "kit-kpi-emerald" },
                  { title: "Total Defects", val: String(qualityStats.reduce((s, q) => s + q.defects, 0)), icon: AlertTriangle, cls: "kit-kpi-amber" },
                  { title: "Avg QC Time", val: "3.5 min", icon: Clock, cls: "kit-kpi-sky" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("kit-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-lg font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="kit-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Inspection vs Defects</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={qualityStats}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="inspected" fill="#e11d48" radius={[4, 4, 0, 0]} name="Inspected" />
                    <Bar dataKey="passed" fill="#10b981" radius={[4, 4, 0, 0]} name="Passed" />
                    <Line type="monotone" dataKey="defects" stroke="#f59e0b" strokeWidth={2} dot={false} name="Defects" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="kit-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Defect Categories</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={[
                      { cat: "Missing Component", count: rInt(5, 20) },
                      { cat: "Wrong Component", count: rInt(3, 15) },
                      { cat: "Damaged Item", count: rInt(2, 10) },
                      { cat: "Incorrect Qty", count: rInt(1, 8) },
                      { cat: "Label Error", count: rInt(1, 6) },
                    ]} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="count" nameKey="cat" label={({ cat, percent }) => `${cat.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {[0, 1, 2, 3, 4].map((i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>
            </div>
          )}
        </Tabs>
      </div>

      {/* Kit Detail Drawer */}
      {selectedKit && (
        <div className="kit-drawer-overlay" onClick={() => setSelectedKit(null)}>
          <div className="kit-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Kit Detail: {selectedKit.id}</h3>
              <Button size="sm" variant="ghost" onClick={() => setSelectedKit(null)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
            </div>

            <div className={cn("kit-drawer-banner rounded-lg p-3 mb-4", selectedKit.status === "Completed" || selectedKit.status === "Shipped" ? "kit-banner-completed" : selectedKit.status === "In Assembly" ? "kit-banner-assembly" : selectedKit.status === "Cancelled" ? "kit-banner-cancelled" : "kit-banner-pending")}>
              <div className="flex items-center gap-2">
                {selectedKit.status === "Completed" || selectedKit.status === "Shipped" ? <CheckCircle2 className="h-4 w-4 text-white" /> :
                 selectedKit.status === "Cancelled" ? <X className="h-4 w-4 text-white" /> :
                 selectedKit.status === "In Assembly" ? <Zap className="h-4 w-4 text-white" /> :
                 <Clock className="h-4 w-4 text-white" />}
                <span className="text-sm font-semibold text-white">{selectedKit.status}</span>
                {selectedKit.status === "In Assembly" && <span className="kit-pulse-dot" />}
              </div>
            </div>

            <div className="kit-flow mb-4">
              <div className="flex items-center justify-between">
                {["Reservation", "Assembly", "QC Check", "Shipped"].map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={cn("kit-flow-dot", i === 0 ? "kit-dot-rose" : i === 1 ? "kit-dot-sky" : i === 2 ? "kit-dot-amber" : "kit-dot-emerald")} />
                      <span className="text-[9px] mt-1 text-gray-500">{step}</span>
                    </div>
                    {i < 3 && <ArrowRight className="h-3 w-3 text-gray-300 mx-1" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "Kit ID", value: selectedKit.id }, { label: "Template", value: selectedKit.template.name.split("(")[0] },
                { label: "Type", value: selectedKit.type }, { label: "Qty", value: String(selectedKit.qty) },
                { label: "Priority", value: selectedKit.priority }, { label: "Warehouse", value: selectedKit.warehouse },
                { label: "Zone", value: selectedKit.zone }, { label: "Value", value: fmtRupee(selectedKit.value) },
              ].map((item) => (
                <div key={item.label} className="kit-info-box rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                  <div className="text-[9px] text-gray-400 uppercase">{item.label}</div>
                  <div className="text-xs font-medium">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="kit-progress-section rounded-lg p-3 mb-4 bg-gray-50 dark:bg-gray-800">
              <div className="text-[10px] font-semibold text-gray-500 mb-2">Assembly Progress</div>
              <div className="flex items-center gap-2">
                <div className="kit-progress-bar flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-full rounded-full bg-gradient-to-r from-rose-500 via-sky-500 to-emerald-500" style={{ width: `${selectedKit.progress}%` }} />
                </div>
                <span className="text-sm font-bold tabular-nums">{selectedKit.progress}%</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Components: {selectedKit.componentsReady} / {selectedKit.totalComponents}</div>
            </div>

            <div className="kit-drawer-footer flex justify-between text-[10px] text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Created: {selectedKit.createdAt}</span>
              <span>Due: {selectedKit.dueDate}</span>
              <span>Assembler: {selectedKit.assembler?.name || "Unassigned"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
