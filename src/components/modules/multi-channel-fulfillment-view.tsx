"use client"

import { useState, Fragment } from "react"
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
  LayoutGrid, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, Eye, X, Clock, Package, ArrowRight,
  ChevronRight, MapPin, Truck, Users, IndianRupee,
  Warehouse, Filter, Calendar, Star, Globe, ShoppingBag,
  Store, Zap, Boxes, Tag, ArrowUpRight, ArrowDownRight,
  Smartphone, Monitor, RotateCcw, PackageCheck, PackageX,
  Timer, CreditCard, TruckIcon, Plane, Ship,
} from "lucide-react"
import { cn } from "@/lib/utils"

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(143143)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const rDate = (start: number, end: number) => new Date(2026, 6, rInt(start, end)).toISOString().split("T")[0]
const fmtRupee = (n: number) => `₹${n.toLocaleString("en-IN")}`

const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const CHANNELS = [
  { id: "B2B", name: "B2B Direct", icon: "Building", color: "#8b5cf6" },
  { id: "B2C", name: "B2C Own Store", icon: "Store", color: "#06b6d4" },
  { id: "AMZ", name: "Amazon", icon: "Package", color: "#f59e0b" },
  { id: "FLP", name: "Flipkart", icon: "ShoppingBag", color: "#3b82f6" },
  { id: "MKT", name: "Meesho", icon: "Smartphone", color: "#ec4899" },
  { id: "JIO", name: "JioMart", icon: "Monitor", color: "#10b981" },
  { id: "NYK", name: "Nykaa", icon: "Star", color: "#f43f5e" },
  { id: "BLD", name: "Blinkit/Zepto", icon: "Zap", color: "#f97316" },
]
const ORDER_STATUSES = ["Received", "Picked", "Packed", "Quality Check", "Dispatched", "In Transit", "Delivered", "Cancelled", "Returned", "Delayed"]
const FULFILLMENT_TYPES = ["Standard", "Express", "Same Day", "Next Day", "Scheduled", "Cross-Dock", "Dropship"]
const PAYMENT_METHODS = ["Prepaid", "COD", "UPI", "Net 30", "Net 60", "Credit Card", "Bank Transfer"]
const CARRIER_PARTNERS = ["Delhivery", "BlueDart", "DTDC", "Ecom Express", "Xpressbees", "Amazon Shipping", "Shadowfax", "Spoton"]

const orders = (() => {
  const result: Array<{
    id: string; channel: typeof CHANNELS[0];
    customer: string; customerType: string; status: string;
    items: number; totalWeight: number; totalValue: number;
    fulfillmentType: string; paymentMethod: string; carrier: string;
    trackingId: string; priority: string;
    orderDate: string; promisedDate: string; shippedDate: string | null;
    deliveryDate: string | null; slaHours: number; actualHours: number | null;
    warehouse: string; city: string; state: string;
  }> = []

  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad", "Jaipur", "Lucknow", "Ahmedabad"]
  const states = ["Maharashtra", "Delhi NCR", "Karnataka", "Tamil Nadu", "West Bengal", "Maharashtra", "Telangana", "Rajasthan", "Uttar Pradesh", "Gujarat"]
  const b2bCustomers = ["Tata Motors", "Reliance Retail", "BigBasket", "DMart", "Spencer's", "More Supermarket", "Heritage Foods", "Vijetha Supermarket", "Nilgiris", "Natures Basket"]
  const b2cPrefixes = ["Mr.", "Ms.", "Dr."]

  for (let i = 0; i < 150; i++) {
    const channel = pick(CHANNELS)
    const status = pick(ORDER_STATUSES)
    const isB2B = channel.id === "B2B"
    const customer = isB2B ? pick(b2bCustomers) : `${pick(b2cPrefixes)} ${pick(["Raj", "Priya", "Amit", "Sunita", "Vikram", "Deepa", "Manoj", "Kavitha", "Arjun", "Lakshmi"])} ${pick(["Sharma", "Patel", "Kumar", "Verma", "Singh", "Nair", "Gupta", "Raman", "Mehta", "Iyer"])}`
    const cityIdx = rInt(0, cities.length - 1)
    const slaH = pick([24, 48, 72, 96, 120])
    const actualH = (status === "Delivered" || status === "Returned") ? slaH + rInt(-12, 36) : null

    result.push({
      id: `ORD-${String(i + 1).padStart(5, "0")}`,
      channel, customer, customerType: isB2B ? "B2B" : "B2C",
      status, items: rInt(1, isB2B ? 500 : 15),
      totalWeight: rInt(1, isB2B ? 50000 : 50),
      totalValue: rInt(isB2B ? 50000 : 200, isB2B ? 5000000 : 50000),
      fulfillmentType: pick(FULFILLMENT_TYPES),
      paymentMethod: isB2B ? pick(["Net 30", "Net 60", "Bank Transfer", "Credit Card"]) : pick(["Prepaid", "COD", "UPI", "Credit Card"]),
      carrier: status === "Received" || status === "Cancelled" ? "—" : pick(CARRIER_PARTNERS),
      trackingId: status === "Received" || status === "Cancelled" ? "—" : `${channel.id}-${String(rInt(100000, 999999))}`,
      priority: status === "Cancelled" ? "Low" : pick(["Critical", "High", "Medium", "Medium", "Low"]),
      orderDate: rDate(1, 28), promisedDate: rDate(1, 28),
      shippedDate: ["Picked", "Packed", "QC", "Received", "Cancelled"].includes(status) ? null : rDate(1, 28),
      deliveryDate: ["Delivered", "Returned"].includes(status) ? rDate(1, 28) : null,
      slaHours: slaH, actualHours: actualH,
      warehouse: pick(WAREHOUSES), city: cities[cityIdx], state: states[cityIdx],
    })
  }
  return result
})()

const channelPerformance = CHANNELS.map((ch) => {
  const chOrders = orders.filter((o) => o.channel.id === ch.id)
  const delivered = chOrders.filter((o) => o.status === "Delivered")
  const total = chOrders.length || 1
  return {
    ...ch, orders: total, revenue: chOrders.reduce((s, o) => s + o.totalValue, 0),
    fillRate: Math.round(delivered.length / total * 100),
    avgSla: Math.round(chOrders.reduce((s, o) => s + o.slaHours, 0) / total),
    onTime: delivered.filter((d) => d.actualHours !== null && d.actualHours <= d.slaHours).length,
    cancellations: chOrders.filter((o) => o.status === "Cancelled").length,
    returns: chOrders.filter((o) => o.status === "Returned").length,
  }
})

const carrierPerformance = CARRIER_PARTNERS.map((c) => {
  const cOrders = orders.filter((o) => o.carrier === c)
  const delivered = cOrders.filter((o) => o.status === "Delivered")
  const total = cOrders.length || 1
  return {
    name: c, shipments: total, delivered: delivered.length,
    avgCost: rInt(40, 250), onTimeRate: Math.round(rand() * 15 + 80),
    damageRate: +(rand() * 2 + 0.3).toFixed(1), avgTransit: rInt(1, 5),
  }
})

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#3b82f6", "#ec4899", "#10b981", "#f43f5e", "#f97316"]

const monthlyVolume = MONTHS.map((m) => ({
  month: m, b2b: rInt(200, 800), b2c: rInt(300, 1200), marketplace: rInt(500, 2000),
}))

const monthlyRevenue = MONTHS.map((m) => ({
  month: m, revenue: rInt(5000000, 25000000), cost: rInt(1000000, 8000000), profit: 0,
}))
monthlyRevenue.forEach((m) => { m.profit = m.revenue - m.cost })

const channelDist = CHANNELS.map((ch) => ({ name: ch.name, value: orders.filter((o) => o.channel.id === ch.id).length }))
const fulfillmentDist = (() => {
  const counts: Record<string, number> = {}
  orders.forEach((o) => { counts[o.fulfillmentType] = (counts[o.fulfillmentType] || 0) + 1 })
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
})()

const warehouseFulfillment = WAREHOUSES.map((w) => ({
  warehouse: w, standard: rInt(40, 200), express: rInt(20, 100), sameDay: rInt(5, 40), crossDock: rInt(2, 20),
}))

const STATUS_COLORS: Record<string, string> = {
  Received: "mcf-badge-received", Picked: "mcf-badge-picked", Packed: "mcf-badge-packed",
  "Quality Check": "mcf-badge-qc", Dispatched: "mcf-badge-dispatched", "In Transit": "mcf-badge-transit",
  Delivered: "mcf-badge-delivered", Cancelled: "mcf-badge-cancelled", Returned: "mcf-badge-returned", Delayed: "mcf-badge-delayed",
}

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "mcf-priority-critical", High: "mcf-priority-high", Medium: "mcf-priority-medium", Low: "mcf-priority-low",
}

const totalOrders = orders.length
const pendingOrders = orders.filter((o) => ["Received", "Picked", "Packed", "Quality Check"].includes(o.status)).length
const totalRevenue = orders.reduce((s, o) => s + o.totalValue, 0)
const avgFillRate = Math.round(channelPerformance.reduce((s, c) => s + c.fillRate, 0) / channelPerformance.length)
const activeCarriers = carrierPerformance.filter((c) => c.shipments > 5).length
const returnRate = Math.round(orders.filter((o) => o.status === "Returned").length / totalOrders * 1000) / 10

const SUMMARY_KPIS = [
  { label: "Total Orders", value: String(totalOrders), sub: `${pendingOrders} in pipeline`, icon: Package, trend: "up" },
  { label: "Revenue", value: `₹${(totalRevenue / 10000000).toFixed(1)}Cr`, sub: `Across ${CHANNELS.length} channels`, icon: IndianRupee, trend: "up" },
  { label: "Avg Fill Rate", value: `${avgFillRate}%`, sub: "Target: 97%", icon: PackageCheck, trend: avgFillRate > 95 ? "up" : "down" },
  { label: "Active Carriers", value: String(activeCarriers), sub: `${CARRIER_PARTNERS.length} total`, icon: Truck, trend: "up" },
  { label: "Return Rate", value: `${returnRate}%`, sub: `${orders.filter((o) => o.status === "Returned").length} returns`, icon: RotateCcw, trend: returnRate < 5 ? "up" : "down" },
  { label: "Same-Day", value: `${orders.filter((o) => o.fulfillmentType === "Same Day").length}`, sub: "Express orders", icon: Zap, trend: "up" },
]

type OrderDetail = typeof orders[0]

export default function MultiChannelFulfillmentView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = (order: OrderDetail) => { setSelectedOrder(order); setDrawerOpen(true) }

  const filteredOrders = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "orders", label: "Orders" },
    { id: "channels", label: "Channels" },
    { id: "carriers", label: "Carriers" },
    { id: "analytics", label: "Analytics" },
  ]

  return (
    <div className="mcf-root flex flex-col h-full">
      {/* Header */}
      <div className="mcf-header px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="mcf-icon-wrap">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <h1 className="mcf-title text-xl font-bold">Multi-Channel Fulfillment</h1>
            <p className="mcf-subtitle text-sm">Unified order management across B2B, B2C &amp; marketplace channels</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="mcf-badge-trend mcf-badge-trend-up">{totalOrders} Orders</Badge>
          <Badge className="mcf-badge-trend mcf-badge-trend-up">{CHANNELS.length} Channels</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="mcf-tabs-wrap px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mcf-tabs-list">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="mcf-tab-trigger">{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="mcf-content flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {SUMMARY_KPIS.map((kpi) => (
                <Card key={kpi.label} className="mcf-kpi-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <kpi.icon className="h-4 w-4 mcf-kpi-icon" />
                      <span className={cn("mcf-trend-badge", kpi.trend === "up" ? "mcf-trend-up" : "mcf-trend-down")}>
                        {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      </span>
                    </div>
                    <div className="mcf-kpi-value text-lg font-bold">{kpi.value}</div>
                    <div className="mcf-kpi-label text-xs">{kpi.label}</div>
                    <div className="mcf-kpi-sub text-xs">{kpi.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Order Volume by Channel</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyVolume}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="b2b" name="B2B" fill="#8b5cf633" stroke="#8b5cf6" strokeWidth={2} />
                      <Area type="monotone" dataKey="b2c" name="B2C" fill="#06b6d433" stroke="#06b6d4" strokeWidth={2} />
                      <Area type="monotone" dataKey="marketplace" name="Marketplace" fill="#f59e0b33" stroke="#f59e0b" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Channel Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={channelDist} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, value }) => `${name}: ${value}`}>
                        {channelDist.map((_, idx) => { const cc = COLORS; return <Cell key={idx} fill={cc[idx % cc.length]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Fulfillment Type Split</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={fulfillmentDist} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, value }) => `${name}: ${value}`}>
                        {fulfillmentDist.map((_, idx) => { const fc = COLORS; return <Cell key={idx} fill={fc[idx % fc.length]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Revenue &amp; Profit Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" tickFormatter={(v) => `₹${(v / 10000000).toFixed(0)}Cr`} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtRupee(v)} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} opacity={0.8} />
                      <Bar dataKey="cost" name="Cost" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.6} />
                      <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Warehouse Fulfillment Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={warehouseFulfillment}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 9 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="standard" name="Standard" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="express" name="Express" stackId="a" fill="#06b6d4" />
                      <Bar dataKey="sameDay" name="Same Day" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="crossDock" name="Cross-Dock" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="mcf-alert-card">
              <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Channel Alerts</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { msg: "Flipkart SLA breach — 23 orders exceeding 48hr delivery window", severity: "critical", time: "8m ago" },
                    { msg: "Amazon same-day fulfillment capacity at 92% — Mumbai Hub near limit", severity: "warning", time: "22m ago" },
                    { msg: "Meesho return spike — 15% return rate on electronics category", severity: "warning", time: "45m ago" },
                    { msg: "B2C own store: 5-star rating improved to 4.7 this week", severity: "info", time: "1h ago" },
                    { msg: "JioMart integration sync delay — 12 min latency (threshold: 5 min)", severity: "warning", time: "2h ago" },
                    { msg: "Blinkit/Zepto 10-min delivery SLA met for 98.2% of orders today", severity: "info", time: "3h ago" },
                  ].map((alert, idx) => (
                    <div key={idx} className={cn("mcf-alert-row flex items-center justify-between p-2 rounded-lg text-sm", alert.severity === "critical" && "mcf-alert-critical", alert.severity === "warning" && "mcf-alert-warning", alert.severity === "info" && "mcf-alert-info")}>
                      <div className="flex items-center gap-2">
                        {alert.severity === "critical" ? <AlertTriangle className="h-4 w-4 text-red-500" /> : alert.severity === "warning" ? <Clock className="h-4 w-4 text-amber-500" /> : <Eye className="h-4 w-4 text-blue-500" />}
                        <span>{alert.msg}</span>
                      </div>
                      <span className="text-xs opacity-70">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input className="mcf-filter-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" placeholder="Search by order ID, customer, or channel..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="mcf-filter-select rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {ORDER_STATUSES.map((s) => {
                const cnt = orders.filter((o) => o.status === s).length
                return (
                  <Card key={s} className="mcf-stat-mini cursor-pointer" onClick={() => setStatusFilter(s)}>
                    <CardContent className="p-2 text-center">
                      <div className="text-sm font-bold">{cnt}</div>
                      <div className="text-[9px] opacity-60 truncate">{s}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="mcf-table-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="mcf-table-header">
                        <TableHead className="mcf-th">Order</TableHead>
                        <TableHead className="mcf-th">Channel</TableHead>
                        <TableHead className="mcf-th">Customer</TableHead>
                        <TableHead className="mcf-th">Type</TableHead>
                        <TableHead className="mcf-th">Items</TableHead>
                        <TableHead className="mcf-th">Value</TableHead>
                        <TableHead className="mcf-th">Payment</TableHead>
                        <TableHead className="mcf-th">Carrier</TableHead>
                        <TableHead className="mcf-th">Warehouse</TableHead>
                        <TableHead className="mcf-th">SLA</TableHead>
                        <TableHead className="mcf-th">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.slice(0, 35).map((o) => (
                        <TableRow key={o.id} className="mcf-table-row cursor-pointer" onClick={() => openDrawer(o)}>
                          <TableCell className="mcf-td font-mono text-xs">{o.id}</TableCell>
                          <TableCell className="mcf-td"><Badge className="mcf-channel-badge text-[10px]" style={{ background: `${o.channel.color}15`, color: o.channel.color, borderColor: `${o.channel.color}30` }}>{o.channel.name}</Badge></TableCell>
                          <TableCell className="mcf-td text-xs max-w-[120px] truncate">{o.customer}</TableCell>
                          <TableCell className="mcf-td"><Badge className="mcf-type-badge text-[10px]">{o.fulfillmentType}</Badge></TableCell>
                          <TableCell className="mcf-td text-xs font-mono">{o.items}</TableCell>
                          <TableCell className="mcf-td text-xs font-mono">{fmtRupee(o.totalValue)}</TableCell>
                          <TableCell className="mcf-td text-xs">{o.paymentMethod}</TableCell>
                          <TableCell className="mcf-td text-xs">{o.carrier}</TableCell>
                          <TableCell className="mcf-td text-xs">{o.warehouse}</TableCell>
                          <TableCell className="mcf-td text-xs">{o.slaHours}h</TableCell>
                          <TableCell className="mcf-td"><Badge className={cn(STATUS_COLORS[o.status], "text-[10px]")}>{o.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "channels" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {channelPerformance.map((ch) => (
                <Card key={ch.id} className="mcf-channel-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="mcf-ch-icon" style={{ background: ch.color }}>{ch.name.charAt(0)}</div>
                        <div>
                          <h3 className="text-sm font-semibold">{ch.name}</h3>
                          <p className="text-[10px] opacity-60">{ch.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="opacity-60">Orders:</span> <span className="font-mono font-bold">{ch.orders}</span></div>
                      <div><span className="opacity-60">Revenue:</span> <span className="font-mono">{fmtRupee(ch.revenue)}</span></div>
                      <div><span className="opacity-60">Fill Rate:</span> <span className={cn("font-bold", ch.fillRate >= 95 ? "text-emerald-600" : "text-amber-500")}>{ch.fillRate}%</span></div>
                      <div><span className="opacity-60">Avg SLA:</span> <span className="font-mono">{ch.avgSla}h</span></div>
                      <div><span className="opacity-60">On-Time:</span> <span className={cn("font-bold", ch.onTime / ch.orders >= 0.9 ? "text-emerald-600" : "text-red-500")}>{ch.onTime}</span></div>
                      <div><span className="opacity-60">Cancelled:</span> <span className="text-red-500">{ch.cancellations}</span></div>
                    </div>
                    <div className="mcf-ch-progress mt-2">
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-full rounded-full transition-all" style={{ width: `${ch.fillRate}%`, background: ch.fillRate >= 95 ? "#10b981" : ch.fillRate >= 85 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "carriers" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Carrier Shipment Volume</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={carrierPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="shipments" name="Shipments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="delivered" name="Delivered" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">On-Time Delivery Rate</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={carrierPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" domain={[70, 100]} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="var(--chart-axis, #6b7280)" width={80} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="onTimeRate" name="On-Time %" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="mcf-table-card">
              <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Carrier Performance Summary</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="mcf-table-header">
                        <TableHead className="mcf-th">Carrier</TableHead>
                        <TableHead className="mcf-th">Shipments</TableHead>
                        <TableHead className="mcf-th">Delivered</TableHead>
                        <TableHead className="mcf-th">Avg Cost</TableHead>
                        <TableHead className="mcf-th">On-Time Rate</TableHead>
                        <TableHead className="mcf-th">Damage Rate</TableHead>
                        <TableHead className="mcf-th">Avg Transit (days)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {carrierPerformance.map((c) => (
                        <TableRow key={c.name} className="mcf-table-row">
                          <TableCell className="mcf-td text-xs font-medium">{c.name}</TableCell>
                          <TableCell className="mcf-td font-mono text-xs">{c.shipments}</TableCell>
                          <TableCell className="mcf-td font-mono text-xs">{c.delivered}</TableCell>
                          <TableCell className="mcf-td font-mono text-xs">{fmtRupee(c.avgCost)}</TableCell>
                          <TableCell className={cn("mcf-td text-xs font-bold", c.onTimeRate >= 95 ? "text-emerald-600" : c.onTimeRate >= 85 ? "text-amber-500" : "text-red-500")}>{c.onTimeRate}%</TableCell>
                          <TableCell className={cn("mcf-td text-xs", c.damageRate < 1 ? "text-emerald-600" : "text-red-500")}>{c.damageRate}%</TableCell>
                          <TableCell className="mcf-td font-mono text-xs">{c.avgTransit}d</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Avg Order Value", value: fmtRupee(Math.round(totalRevenue / totalOrders)), sub: "B2B: ₹2.5L | B2C: ₹1.2K" },
                { label: "Cost per Order", value: `₹${rInt(85, 220)}`, sub: "Avg fulfillment cost" },
                { label: "COD Ratio", value: `${rInt(25, 45)}%`, sub: "Cash on delivery" },
                { label: "Marketplace Share", value: `${rInt(55, 75)}%`, sub: "Of total orders" },
              ].map((k) => (
                <Card key={k.label} className="mcf-kpi-card">
                  <CardContent className="p-4">
                    <div className="mcf-kpi-value text-lg font-bold">{k.value}</div>
                    <div className="mcf-kpi-label text-xs">{k.label}</div>
                    <div className="mcf-kpi-sub text-xs">{k.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Channel Revenue Share</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={channelPerformance.map((c) => ({ name: c.name, value: c.revenue })).sort((a, b) => b.value - a.value)} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name }) => name}>
                        {channelPerformance.map((c, idx) => <Cell key={idx} fill={c.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtRupee(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Payment Method Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={(() => {
                        const counts: Record<string, number> = {}
                        orders.forEach((o) => { counts[o.paymentMethod] = (counts[o.paymentMethod] || 0) + 1 })
                        return Object.entries(counts).map(([name, value]) => ({ name, value }))
                      })()} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, value }) => `${name}: ${value}`}>
                        {["#8b5cf6", "#06b6d4", "#f59e0b", "#3b82f6", "#ec4899", "#10b981", "#f43f5e"].map((c, idx) => {
                          const pmData = (() => {
                            const counts: Record<string, number> = {}
                            orders.forEach((o) => { counts[o.paymentMethod] = (counts[o.paymentMethod] || 0) + 1 })
                            return Object.entries(counts).map(([name, value]) => ({ name, value }))
                          })()
                          return <Cell key={idx} fill={c} />
                        })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">SLA Compliance by Channel</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={channelPerformance.map((c) => ({ name: c.name, fillRate: c.fillRate, onTime: Math.round(c.onTime / (c.orders || 1) * 100) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" domain={[70, 100]} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="fillRate" name="Fill Rate %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="onTime" name="On-Time %" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mcf-chart-card">
                <CardHeader className="pb-2"><CardTitle className="mcf-chart-title text-sm">Order Status Pipeline</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={ORDER_STATUSES.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="status" tick={{ fontSize: 9 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="count" name="Orders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      {drawerOpen && selectedOrder && (
        <div className="mcf-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="mcf-drawer" onClick={(e) => e.stopPropagation()}>
            <div className={cn("mcf-drawer-header p-5", selectedOrder.status === "Delivered" ? "mcf-drawer-header-delivered" : selectedOrder.status === "Cancelled" || selectedOrder.status === "Returned" ? "mcf-drawer-header-cancelled" : "mcf-drawer-header-active")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="mcf-drawer-avatar"><Package className="h-6 w-6" /></div>
                  <div>
                    <h2 className="font-bold text-lg">{selectedOrder.id}</h2>
                    <p className="text-sm opacity-80">{selectedOrder.customer}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge className="mcf-channel-badge" style={{ background: `${selectedOrder.channel.color}30`, color: "#fff", borderColor: `${selectedOrder.channel.color}50` }}>{selectedOrder.channel.name}</Badge>
                <Badge className={cn(STATUS_COLORS[selectedOrder.status])}>{selectedOrder.status}</Badge>
                <Badge className={cn(PRIORITY_COLORS[selectedOrder.priority], "text-white")}>{selectedOrder.priority}</Badge>
              </div>
            </div>

            <div className="px-5 py-3 border-b">
              <div className="flex items-center justify-between">
                {["Received", "Picked", "Packed", "Dispatched", "Delivered"].map((step, idx) => (
                  <Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={cn("mcf-flow-dot", idx <= (selectedOrder.status === "Delivered" ? 4 : selectedOrder.status === "Dispatched" ? 3 : selectedOrder.status === "Packed" ? 2 : selectedOrder.status === "Picked" ? 1 : 0) ? "mcf-flow-dot-active" : "mcf-flow-dot-inactive")}>
                        {idx <= (selectedOrder.status === "Delivered" ? 4 : selectedOrder.status === "Dispatched" ? 3 : selectedOrder.status === "Packed" ? 2 : selectedOrder.status === "Picked" ? 1 : 0) ? <CheckCircle2 className="h-3 w-3" /> : <span className="text-[10px]">{idx + 1}</span>}
                      </div>
                      <span className="text-[10px] mt-1 opacity-70">{step}</span>
                    </div>
                    {idx < 4 && <div className={cn("flex-1 h-0.5 mx-1", idx < (selectedOrder.status === "Delivered" ? 4 : selectedOrder.status === "Dispatched" ? 3 : 0) ? "bg-violet-500" : "bg-gray-300 dark:bg-gray-600")} />}
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              <div>
                <h3 className="mcf-section-title text-sm font-semibold mb-2">Order Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Order ID", value: selectedOrder.id },
                    { label: "Customer", value: selectedOrder.customer },
                    { label: "Customer Type", value: selectedOrder.customerType },
                    { label: "Channel", value: selectedOrder.channel.name },
                    { label: "Fulfillment", value: selectedOrder.fulfillmentType },
                    { label: "Payment", value: selectedOrder.paymentMethod },
                    { label: "Order Date", value: selectedOrder.orderDate },
                    { label: "Promised Date", value: selectedOrder.promisedDate },
                    { label: "Shipped Date", value: selectedOrder.shippedDate || "—" },
                    { label: "Delivery Date", value: selectedOrder.deliveryDate || "—" },
                    { label: "City", value: selectedOrder.city },
                    { label: "State", value: selectedOrder.state },
                  ].map((item) => (
                    <div key={item.label} className="mcf-info-cell p-2 rounded-lg">
                      <div className="mcf-info-label text-[10px] uppercase opacity-50">{item.label}</div>
                      <div className="mcf-info-value text-xs font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mcf-section-title text-sm font-semibold mb-2">Order Metrics</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Items", value: String(selectedOrder.items) },
                    { label: "Total Weight", value: `${selectedOrder.totalWeight.toLocaleString()} kg` },
                    { label: "Total Value", value: fmtRupee(selectedOrder.totalValue) },
                    { label: "SLA Hours", value: `${selectedOrder.slaHours}h` },
                    { label: "Actual Hours", value: selectedOrder.actualHours !== null ? `${selectedOrder.actualHours}h` : "—" },
                    { label: "SLA Met", value: selectedOrder.actualHours !== null ? (selectedOrder.actualHours <= selectedOrder.slaHours ? "Yes" : "No") : "Pending" },
                  ].map((item) => (
                    <div key={item.label} className="mcf-info-cell p-2 rounded-lg">
                      <div className="mcf-info-label text-[10px] uppercase opacity-50">{item.label}</div>
                      <div className="mcf-info-value text-xs font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mcf-section-title text-sm font-semibold mb-2">Shipping</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="mcf-info-cell p-2 rounded-lg">
                    <div className="mcf-info-label text-[10px] uppercase opacity-50">Carrier</div>
                    <div className="mcf-info-value text-xs font-medium">{selectedOrder.carrier}</div>
                  </div>
                  <div className="mcf-info-cell p-2 rounded-lg">
                    <div className="mcf-info-label text-[10px] uppercase opacity-50">Tracking ID</div>
                    <div className="mcf-info-value text-xs font-medium font-mono">{selectedOrder.trackingId}</div>
                  </div>
                  <div className="mcf-info-cell p-2 rounded-lg col-span-2">
                    <div className="mcf-info-label text-[10px] uppercase opacity-50">Warehouse</div>
                    <div className="mcf-info-value text-xs font-medium">{selectedOrder.warehouse}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
