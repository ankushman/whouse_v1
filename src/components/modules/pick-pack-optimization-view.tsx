"use client"

import { useState, useMemo, Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import {
  Package, Truck, Clock, CheckCircle2, AlertTriangle, Zap, Target,
  Search, Eye, X, ChevronRight, ArrowUpRight, ArrowDownRight,
  MapPin, Users, Box, BarChart3, TrendingUp, TrendingDown, Filter,
  PackageCheck, ClipboardList, LayoutGrid, ScanBarcode, Route,
  Timer, Star, ArrowLeftRight, Info, Settings, Download, RefreshCw
} from "lucide-react"

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
const rng = seededRandom(149149)
function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

const STATUSES = ["Pending", "Picking", "Picked", "Packing", "Packed", "Shipped", "Exception"] as const
const PRIORITIES = ["Urgent", "High", "Medium", "Low"] as const
const METHODS = ["Single Order", "Batch Pick", "Wave Pick", "Zone Pick", "Cluster Pick"] as const
const ZONES = ["Zone A - Electronics", "Zone B - FMCG", "Zone C - Apparel", "Zone D - Building", "Zone E - Pharma", "Zone F - Auto Parts"] as const
const WAREHOUSES = ["Mumbai Central", "Delhi NCR Hub", "Chennai Port", "Bangalore South", "Hyderabad East", "Kolkata WH", "Pune West", "Ahmedabad North"]
const PICKERS = [
  { id: "PK01", name: "Amit Kumar", zone: "Zone A", picks: 245, accuracy: 99.2, speed: 18.5, avatar: "bg-sky-500" },
  { id: "PK02", name: "Priya Iyer", zone: "Zone B", picks: 312, accuracy: 99.8, speed: 22.3, avatar: "bg-rose-500" },
  { id: "PK03", name: "Suresh Babu", zone: "Zone C", picks: 198, accuracy: 98.7, speed: 16.8, avatar: "bg-amber-500" },
  { id: "PK04", name: "Lakshmi Devi", zone: "Zone D", picks: 278, accuracy: 99.5, speed: 20.1, avatar: "bg-emerald-500" },
  { id: "PK05", name: "Rajesh Nair", zone: "Zone E", picks: 226, accuracy: 99.0, speed: 17.9, avatar: "bg-purple-500" },
  { id: "PK06", name: "Kavitha R", zone: "Zone F", picks: 256, accuracy: 99.6, speed: 21.5, avatar: "bg-cyan-500" },
]

const STATUS_STYLES: Record<string, string> = {
  "Pending": "ppo-status-pending", "Picking": "ppo-status-picking", "Picked": "ppo-status-picked",
  "Packing": "ppo-status-packing", "Packed": "ppo-status-packed", "Shipped": "ppo-status-shipped",
  "Exception": "ppo-status-exception",
}
const PRIORITY_STYLES: Record<string, string> = {
  "Urgent": "ppo-priority-urgent", "High": "ppo-priority-high", "Medium": "ppo-priority-medium", "Low": "ppo-priority-low",
}
const HEADER_GRADIENTS: Record<string, string> = {
  "Pending": "from-gray-400 to-gray-500", "Picking": "from-sky-400 to-sky-600",
  "Picked": "from-blue-400 to-blue-600", "Packing": "from-amber-400 to-amber-600",
  "Packed": "from-emerald-400 to-emerald-600", "Shipped": "from-teal-400 to-teal-600",
  "Exception": "from-red-400 to-rose-600",
}
const FLOW = ["Queued", "Picking", "Quality Check", "Packing", "Labelled", "Dispatched"]
const PIE_COLORS = ["#0ea5e9", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#a3e635"]

const orders: Array<{
  id: string; date: string; customer: string; warehouse: string; zone: string;
  items: number; method: string; priority: string; status: string;
  picker: string; lines: number; estMinutes: number; actualMinutes: number;
  accuracy: number; sku: string; weight: number; shipBy: string;
}> = []

for (let i = 0; i < 150; i++) {
  const status = pick([...STATUSES])
  const priority = pick([...PRIORITIES])
  const method = pick([...METHODS])
  const zone = pick([...ZONES])
  const warehouse = pick(WAREHOUSES)
  const picker = pick(PICKERS)
  const items = randInt(1, 25)
  const estMinutes = randInt(5, 45)
  const actualMinutes = status === "Pending" ? 0 : status === "Picking" ? randInt(1, estMinutes) : randInt(3, estMinutes + 10)
  orders.push({
    id: `ORD-${String(2608001 + i).padStart(7, "0")}`,
    date: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
    customer: pick(["Tata Motors", "Reliance Retail", "BigBasket", "DMart", "Spencer's", "Metro Cash", "Croma", "Decathlon", "Pepperfry", "Nykaa", "Amazon IN", "Flipkart"]),
    warehouse, zone: zone as string, items, method, priority, status,
    picker: status !== "Pending" ? picker.name : "Unassigned",
    lines: randInt(1, 12),
    estMinutes, actualMinutes,
    accuracy: ["Packed", "Shipped"].includes(status) ? randFloat(96, 100) : 0,
    sku: `SKU-${String(1000 + randInt(0, 999)).padStart(4, "0")}`,
    weight: randFloat(0.5, 50),
    shipBy: `2026-07-${String(Math.min(randInt(1, 28) + 2, 31)).padStart(2, "0")}`,
  })
}

const monthlyVolume = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  orders: randInt(800, 1500),
  picked: randInt(700, 1400),
  packed: randInt(650, 1300),
  shipped: randInt(600, 1250),
}))

const methodPie = METHODS.map(m => ({ name: m, value: orders.filter(o => o.method === m).length }))
const zonePie = ZONES.map(z => ({ name: z.split(" - ")[1], value: orders.filter(o => o.zone === z).length }))
const zonePerf = ZONES.map(z => ({
  name: z.split(" - ")[1],
  throughput: randInt(70, 99),
  accuracy: randInt(95, 100),
  utilization: randInt(60, 95),
  backlog: randInt(5, 40),
}))

const dailyPicks = Array.from({ length: 28 }, (_, i) => ({
  day: String(i + 1),
  planned: randInt(80, 150),
  actual: randInt(75, 145),
}))

function fmtNum(n: number): string { return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n) }

export default function PickPackOptimizationView() {
  const [activeTab, setActiveTab] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)
  const tabs = ["Dashboard", "Pick Queue", "Zone Performance", "Picker Leaderboard", "Analytics"]

  const filteredOrders = useMemo(() => {
    let data = [...orders]
    if (statusFilter !== "All") data = data.filter(o => o.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(o => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.sku.toLowerCase().includes(q))
    }
    return data
  }, [statusFilter, searchQuery])

  const openOrders = orders.filter(o => ["Pending", "Picking", "Packing"].includes(o.status)).length
  const completedToday = orders.filter(o => o.status === "Shipped").length
  const avgAccuracy = orders.filter(o => o.accuracy > 0).reduce((s, o) => s + o.accuracy, 0) / Math.max(orders.filter(o => o.accuracy > 0).length, 1)
  const avgPickTime = (orders.filter(o => o.actualMinutes > 0).reduce((s, o) => s + o.actualMinutes, 0) / Math.max(orders.filter(o => o.actualMinutes > 0).length, 1)).toFixed(1)
  const exceptions = orders.filter(o => o.status === "Exception").length
  const statusCounts: Record<string, number> = {
    "All": orders.length, ...Object.fromEntries(STATUSES.map(s => [s, orders.filter(o => o.status === s).length])),
  }

  const getCurrentStep = (status: string): number => {
    const m: Record<string, number> = { Pending: 0, Picking: 1, Picked: 2, Packing: 3, Packed: 4, Shipped: 5, Exception: 2 }
    return m[status] ?? 0
  }

  const openDrawer = (o: typeof orders[0]) => { setSelectedOrder(o); setDrawerOpen(true) }
  const closeDrawer = () => { setDrawerOpen(false); setSelectedOrder(null) }

  function renderDashboard() {
    return (
      <Fragment>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { l: "Open Orders", v: String(openOrders), i: Package, c: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400", t: "-12%", up: true },
            { l: "Completed Today", v: String(completedToday), i: CheckCircle2, c: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", t: "+8%", up: true },
            { l: "Avg Pick Accuracy", v: `${avgAccuracy.toFixed(1)}%`, i: Target, c: "bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400", t: "+0.3%", up: true },
            { l: "Avg Pick Time", v: `${avgPickTime}min`, i: Clock, c: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", t: "-1.4m", up: true },
            { l: "Exceptions", v: String(exceptions), i: AlertTriangle, c: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400", t: "-22%", up: true },
            { l: "Throughput/hr", v: `${randInt(120, 200)}`, i: Zap, c: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", t: "+11%", up: true },
          ].map((k, idx) => (
            <div key={idx} className="ppo-kpi-card">
              <div className="flex items-start justify-between">
                <div className="ppo-kpi-label">{k.l}</div>
                <div className={`ppo-kpi-icon ${k.c}`}><k.i className="h-4 w-4" /></div>
              </div>
              <div className="mt-1 ppo-kpi-value">{k.v}</div>
              <div className={`mt-1 ppo-kpi-trend ${k.up ? "ppo-kpi-trend-up" : "ppo-kpi-trend-down"}`}>
                {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{k.t} vs LMo
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="border-sky-100 dark:border-sky-900/40">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><BarChart3 className="h-4 w-4 text-sky-500" />Monthly Order Volume</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={monthlyVolume}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="orders" fill="#0ea5e9" radius={[2,2,0,0]} name="Orders" />
                  <Bar dataKey="shipped" fill="#10b981" radius={[2,2,0,0]} name="Shipped" />
                  <Line dataKey="packed" stroke="#f59e0b" strokeWidth={2} dot={false} name="Packed" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-sky-100 dark:border-sky-900/40">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><LayoutGrid className="h-4 w-4 text-rose-500" />Pick Method Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={methodPie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {methodPie.map((_, idx) => { const c = [...PIE_COLORS]; return <Cell key={String(idx)} fill={c[idx]} /> })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-sky-100 dark:border-sky-900/40">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-amber-500" />Zone Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={zonePie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {zonePie.map((_, idx) => { const c = [...PIE_COLORS]; return <Cell key={String(idx)} fill={c[idx]} /> })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="border-sky-100 dark:border-sky-900/40">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><ArrowLeftRight className="h-4 w-4 text-emerald-500" />Planned vs Actual Picks (Daily)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={dailyPicks}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={3} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="planned" fill="#0ea5e9" fillOpacity={0.15} stroke="#0ea5e9" strokeWidth={2} name="Planned" />
                  <Area type="monotone" dataKey="actual" fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2} name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-sky-100 dark:border-sky-900/40">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="h-4 w-4 text-amber-500" />Pick & Pack Alerts</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { type: "critical", t: "Zone C (Apparel) backlog exceeds 35 orders", d: "2 pickers assigned to Zone B — reallocate resources" },
                  { type: "warning", t: "Picker Amit Kumar: accuracy dropped to 97.8%", d: "Threshold is 98.5% — schedule retraining session" },
                  { type: "info", t: "Wave pick efficiency up 15% this week", d: "Batch consolidation strategy showing strong results" },
                  { type: "critical", t: "8 urgent orders past SLA deadline", d: "Customer: Tata Motors, Reliance Retail — escalate immediately" },
                  { type: "warning", t: "Packaging material stock below reorder point", d: "Carton Box-M (500ml) at 120 units — order restock" },
                  { type: "info", t: "New zone picking path reduced travel by 22%", d: "Zone D re-slotted based on ABC velocity analysis" },
                ].map((a, idx) => (
                  <div key={idx} className={`ppo-alert ppo-alert-${a.type}`}>
                    <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${a.type === "critical" ? "text-red-500" : a.type === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                    <div><div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{a.t}</div><div className="text-[10px] text-gray-500 dark:text-gray-400">{a.d}</div></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  function renderPickQueue() {
    return (
      <Fragment>
        <div className="flex flex-wrap gap-2">
          {(["All", ...STATUSES] as Array<string>).map(s => (
            <button key={s} className={`ppo-status-badge cursor-pointer px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm ${statusFilter === s ? "ring-2 ring-sky-500" : ""}`} onClick={() => setStatusFilter(s)}>
              {s} ({String(statusCounts[s] || 0)})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by order ID, customer, SKU..." className="ppo-search w-full pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Badge variant="outline" className="badge-interactive text-xs">{filteredOrders.length} orders</Badge>
        </div>
        <div className="ppo-table-wrap">
          <table className="ppo-table">
            <thead className="ppo-table-head"><tr>
              <th>Order ID</th><th>Customer</th><th>Zone</th><th>Method</th><th>Items</th><th>Weight</th><th>Picker</th><th>Est (min)</th><th>Actual</th><th>Priority</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {filteredOrders.slice(0, 30).map(o => (
                <tr key={o.id} className="ppo-table-row">
                  <td className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">{o.id}</td>
                  <td className="text-xs font-medium">{o.customer}</td>
                  <td className="text-[10px] text-gray-500 dark:text-gray-400">{o.zone.split(" - ")[1]}</td>
                  <td><span className="ppo-method-badge">{o.method.split(" ")[0]}</span></td>
                  <td className="text-xs">{String(o.items)}</td>
                  <td className="text-xs">{o.weight.toFixed(1)}kg</td>
                  <td className="text-xs">{o.picker}</td>
                  <td className="text-xs text-gray-500 dark:text-gray-400">{String(o.estMinutes)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16"><div className="ppo-progress-track"><div className={`ppo-progress-fill ${o.actualMinutes <= o.estMinutes ? "ppo-fill-emerald" : o.actualMinutes <= o.estMinutes * 1.2 ? "ppo-fill-amber" : "ppo-fill-red"}`} style={{ width: `${Math.min((o.actualMinutes / Math.max(o.estMinutes, 1)) * 100, 100)}%` }} /></div></div>
                      <span className="text-xs">{o.actualMinutes > 0 ? String(o.actualMinutes) : "—"}</span>
                    </div>
                  </td>
                  <td><span className={`ppo-priority-badge ${PRIORITY_STYLES[o.priority]}`}>{o.priority}</span></td>
                  <td><span className={`ppo-status-badge ${STATUS_STYLES[o.status]}`}>{o.status}</span></td>
                  <td><button onClick={() => openDrawer(o)} className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-sky-600 dark:hover:bg-gray-800"><Eye className="h-3.5 w-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fragment>
    )
  }

  function renderZonePerformance() {
    return (
      <Fragment>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { l: "Active Zones", v: "6", i: LayoutGrid, c: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" },
            { l: "Avg Throughput", v: `${randInt(80, 95)}%`, i: Zap, c: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { l: "Avg Accuracy", v: `${randFloat(97, 99)}%`, i: Target, c: "bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400" },
            { l: "Total Backlog", v: String(randInt(30, 80)), i: Clock, c: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
            { l: "Zone Utilization", v: `${randFloat(70, 90)}%`, i: Box, c: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
            { l: "Avg Travel Time", v: `${randFloat(3, 8)}min`, i: Route, c: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
          ].map((k, idx) => (
            <div key={idx} className="ppo-kpi-card">
              <div className="flex items-start justify-between"><div className="ppo-kpi-label">{k.l}</div><div className={`ppo-kpi-icon ${k.c}`}><k.i className="h-4 w-4" /></div></div>
              <div className="mt-1 ppo-kpi-value">{k.v}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="border-sky-100 dark:border-sky-900/40">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><BarChart3 className="h-4 w-4 text-sky-500" />Zone Multi-Metric Comparison</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={zonePerf}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="throughput" fill="#0ea5e9" radius={[2,2,0,0]} name="Throughput" />
                  <Bar dataKey="accuracy" fill="#10b981" radius={[2,2,0,0]} name="Accuracy" />
                  <Bar dataKey="utilization" fill="#f59e0b" radius={[2,2,0,0]} name="Utilization" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-sky-100 dark:border-sky-900/40">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><Clock className="h-4 w-4 text-amber-500" />Zone Backlog Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={zonePerf} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="backlog" fill="#f43f5e" radius={[0,4,4,0]} name="Backlog" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-sky-100 dark:border-sky-900/40">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-indigo-500" />Zone Detail Cards</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {ZONES.map((z, idx) => {
                const zp = zonePerf[idx]
                const picker = PICKERS[idx]
                return (
                  <div key={z} className="ppo-zone-card">
                    <div className="mb-2 text-xs font-bold text-gray-900 dark:text-gray-100">{z.split(" - ")[1]}</div>
                    <div className="space-y-2 text-[10px]">
                      {[{ l: "Throughput", v: String(zp.throughput) }, { l: "Accuracy", v: String(zp.accuracy) + "%" }, { l: "Utilization", v: String(zp.utilization) + "%" }, { l: "Backlog", v: String(zp.backlog) }].map((f, fi) => (
                        <div key={fi} className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{f.l}</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{f.v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white ${picker.avatar}`}>{picker.name.split(" ").map(n => n[0]).join("")}</div>
                      <span className="text-[10px] text-gray-600 dark:text-gray-400">{picker.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  function renderPickerLeaderboard() {
    const sorted = [...PICKERS].sort((a, b) => b.picks - a.picks)
    return (
      <Fragment>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {[
            { l: "Total Pickers", v: String(PICKERS.length), i: Users, c: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" },
            { l: "Avg Picks/Day", v: String(Math.round(PICKERS.reduce((s, p) => s + p.picks, 0) / PICKERS.length)), i: Package, c: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { l: "Avg Accuracy", v: `${(PICKERS.reduce((s, p) => s + p.accuracy, 0) / PICKERS.length).toFixed(1)}%`, i: Star, c: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
          ].map((k, idx) => (
            <div key={idx} className="ppo-kpi-card">
              <div className="flex items-start justify-between"><div className="ppo-kpi-label">{k.l}</div><div className={`ppo-kpi-icon ${k.c}`}><k.i className="h-4 w-4" /></div></div>
              <div className="mt-1 ppo-kpi-value">{k.v}</div>
            </div>
          ))}
        </div>

        <Card className="border-sky-100 dark:border-sky-900/40">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4 text-sky-500" />Picker Performance Rankings</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sorted.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-sky-50/50 dark:border-gray-800 dark:hover:bg-sky-950/10">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${idx === 0 ? "bg-gradient-to-br from-amber-400 to-yellow-500" : idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400" : idx === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700" : "bg-gradient-to-br from-sky-400 to-sky-600"}`}>{String(idx + 1)}</span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${p.avatar}`}>{p.name.split(" ").map(n => n[0]).join("")}</div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{p.name}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">{p.zone}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center text-[10px]">
                    <div><div className="text-gray-500 dark:text-gray-400">Picks</div><div className="font-bold text-gray-900 dark:text-gray-100">{String(p.picks)}</div></div>
                    <div><div className="text-gray-500 dark:text-gray-400">Accuracy</div><div className="font-bold text-emerald-600 dark:text-emerald-400">{p.accuracy}%</div></div>
                    <div><div className="text-gray-500 dark:text-gray-400">Speed</div><div className="font-bold text-sky-600 dark:text-sky-400">{p.speed}/hr</div></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  function renderAnalytics() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="border-sky-100 dark:border-sky-900/40">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-emerald-500" />Pick Accuracy Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={["Jan","Feb","Mar","Apr","May","Jun","Jul"].map((m, i) => ({ month: m, accuracy: randFloat(96, 99.5), speed: randFloat(15, 25) }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[90, 100]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} name="Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-sky-100 dark:border-sky-900/40">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><Timer className="h-4 w-4 text-amber-500" />Pick Time by Method</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={METHODS.map(m => ({ method: m.split(" ")[0] + " " + m.split(" ")[1], avgTime: randFloat(8, 30) }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="method" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} label={{ value: "Minutes", position: "bottom", fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="avgTime" radius={[4,4,0,0]}>
                    {["#0ea5e9", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"].map((c, i) => { const colors = ["#0ea5e9","#f43f5e","#10b981","#f59e0b","#8b5cf6"]; const tc = [...colors]; return <Cell key={String(i)} fill={tc[i]} /> })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-sky-100 dark:border-sky-900/40">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><ArrowLeftRight className="h-4 w-4 text-indigo-500" />Priority Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={PRIORITIES.map(p => ({ priority: p, count: orders.filter(o => o.priority === p).length }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="priority" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {["#f43f5e","#f97316","#f59e0b","#10b981"].map((c, i) => { const colors = ["#f43f5e","#f97316","#f59e0b","#10b981"]; const tc = [...colors]; return <Cell key={String(i)} fill={tc[i]} /> })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  function renderDrawer() {
    if (!selectedOrder) return null
    const o = selectedOrder
    const step = getCurrentStep(o.status)
    return (
      <div className="ppo-drawer-overlay" onClick={closeDrawer}>
        <div className="ppo-drawer-panel" onClick={e => e.stopPropagation()}>
          <div className={`ppo-drawer-header-gradient bg-gradient-to-r ${HEADER_GRADIENTS[o.status] || "from-gray-500 to-slate-600"} text-white`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /><span className="text-lg font-bold">{o.id}</span></div>
                <div className="mt-1 text-sm opacity-90">{o.customer}</div>
                <div className="mt-1 text-xs opacity-75">{o.warehouse} | {o.zone}</div>
              </div>
              <button onClick={closeDrawer} className="rounded-lg bg-white/20 p-1.5 hover:bg-white/30"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{o.status}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{o.priority}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{o.method}</span>
            </div>
          </div>
          <div className="ppo-drawer-body">
            <div className="ppo-drawer-section">
              <div className="ppo-drawer-section-title">Pick & Pack Flow</div>
              <div className="flex items-center justify-between">
                {FLOW.map((s, si) => (
                  <Fragment key={s}>
                    <div className="ppo-flow-step">
                      <div className={`ppo-flow-circle ${si < step ? "ppo-flow-done" : si === step ? "ppo-flow-current" : "ppo-flow-pending"}`}>{si < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : si + 1}</div>
                      <span className="text-[9px] text-gray-500 dark:text-gray-400">{s}</span>
                    </div>
                    {si < FLOW.length - 1 && <div className={`ppo-flow-line ${si < step ? "ppo-flow-line-done" : "ppo-flow-line-pending"}`} />}
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="ppo-drawer-section">
              <div className="ppo-drawer-section-title">Order Details</div>
              <div className="ppo-drawer-field-grid">
                {[
                  { l: "Date", v: o.date }, { l: "Ship By", v: o.shipBy },
                  { l: "Items", v: String(o.items) }, { l: "Lines", v: String(o.lines) },
                  { l: "Weight", v: `${o.weight.toFixed(1)} kg` }, { l: "SKU", v: o.sku },
                  { l: "Zone", v: o.zone }, { l: "Picker", v: o.picker },
                ].map((f, i) => (
                  <div key={i} className="ppo-drawer-field"><div className="ppo-drawer-field-label">{f.l}</div><div className="ppo-drawer-field-value">{f.v}</div></div>
                ))}
              </div>
            </div>
            <div className="ppo-drawer-section">
              <div className="ppo-drawer-section-title">Time Performance</div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1"><div className="ppo-progress-track"><div className={`ppo-progress-fill ${o.actualMinutes <= o.estMinutes ? "ppo-fill-emerald" : "ppo-fill-amber"}`} style={{ width: `${Math.min((o.actualMinutes / Math.max(o.estMinutes, 1)) * 100, 100)}%` }} /></div></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{o.actualMinutes > 0 ? `${o.actualMinutes}m` : "—"}/{o.estMinutes}m est</span>
              </div>
              {o.accuracy > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pick Accuracy: {o.accuracy.toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className="ppo-drawer-section">
              <div className="ppo-drawer-section-title">Actions</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700 gap-1"><ScanBarcode className="h-3.5 w-3.5" /> Assign Picker</Button>
                <Button size="sm" variant="outline" className="btn-outline-animate gap-1"><PackageCheck className="h-3.5 w-3.5" /> Confirm Pick</Button>
                <Button size="sm" variant="outline" className="btn-outline-animate gap-1"><Box className="h-3.5 w-3.5" /> Generate Pack</Button>
                <Button size="sm" variant="outline" className="btn-outline-animate gap-1"><Truck className="h-3.5 w-3.5" /> Create Shipment</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg"><Package className="h-5 w-5 text-white" /></div>
          <div><h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">Pick & Pack Optimization</h1><p className="text-xs text-gray-500 dark:text-gray-400">Order picking, packing, and fulfillment efficiency management</p></div>
        </div>
        <Badge className="badge-interactive bg-gradient-to-r from-sky-500 to-blue-600 text-white border-0">{fmtNum(orders.length)} Orders</Badge>
      </div>
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {tabs.map((tab, idx) => (
          <button key={tab} className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all duration-150 ${activeTab === idx ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-50" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`} onClick={() => setActiveTab(idx)}>{tab}</button>
        ))}
      </div>
      <div className="ppo-tab-content">
        {activeTab === 0 && renderDashboard()}
        {activeTab === 1 && renderPickQueue()}
        {activeTab === 2 && renderZonePerformance()}
        {activeTab === 3 && renderPickerLeaderboard()}
        {activeTab === 4 && renderAnalytics()}
      </div>
      {drawerOpen && renderDrawer()}
    </div>
  )
}
