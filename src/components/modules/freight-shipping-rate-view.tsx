"use client"

import { useState, useMemo, Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts"
import {
  Ship, Truck, Plane, Train, Package, Globe, IndianRupee, TrendingUp, TrendingDown,
  Search, Eye, X, ChevronRight, ArrowUpRight, ArrowDownRight, Filter,
  MapPin, Route, Clock, CheckCircle2, AlertTriangle, Zap, Target,
  Weight, Calculator, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  RefreshCw, Download, Plus, Edit, Trash2, Star, ArrowUpDown, Compass, Anchor, Navigation
} from "lucide-react"

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
const rng = seededRandom(150150)
function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

const CARRIERS = [
  { id: "CR01", name: "BlueDart Express", type: "Express", mode: "Air", region: "Pan India", rating: 4.8, baseRate: 45, color: "#2563eb" },
  { id: "CR02", name: "Delhivery Surface", type: "Surface", mode: "Road", region: "Pan India", rating: 4.5, baseRate: 28, color: "#dc2626" },
  { id: "CR03", name: "DTDC Express", type: "Express", mode: "Air", region: "Pan India", rating: 4.3, baseRate: 42, color: "#059669" },
  { id: "CR04", name: "FedEx India", type: "International", mode: "Air", region: "Global", rating: 4.7, baseRate: 65, color: "#7c3aed" },
  { id: "CR05", name: "DHL Express India", type: "International", mode: "Air", region: "Global", rating: 4.9, baseRate: 70, color: "#ea580c" },
  { id: "CR06", name: "Gati Ltd", type: "Surface", mode: "Road", region: "South India", rating: 3.9, baseRate: 22, color: "#0891b2" },
  { id: "CR07", name: "Professional Couriers", type: "Standard", mode: "Road", region: "West India", rating: 3.7, baseRate: 18, color: "#ca8a04" },
  { id: "CR08", name: "India Post Speed Post", type: "Government", mode: "Multi", region: "Pan India", rating: 3.5, baseRate: 15, color: "#475569" },
  { id: "CR09", name: "Ecom Express", type: "E-commerce", mode: "Road", region: "North India", rating: 4.1, baseRate: 25, color: "#be185d" },
  { id: "CR10", name: "Xpressbees", type: "E-commerce", mode: "Road", region: "Pan India", rating: 4.2, baseRate: 26, color: "#0d9488" },
]

const ZONES = [
  { id: "Z1", name: "Zone A (Local)", range: "0-50 km", baseCost: 30, color: "#10b981" },
  { id: "Z2", name: "Zone B (Nearby)", range: "50-200 km", baseCost: 55, color: "#3b82f6" },
  { id: "Z3", name: "Zone C (Regional)", range: "200-500 km", baseCost: 90, color: "#f59e0b" },
  { id: "Z4", name: "Zone D (National)", range: "500-1500 km", baseCost: 150, color: "#ef4444" },
  { id: "Z5", name: "Zone E (Remote)", range: "1500+ km", baseCost: 220, color: "#8b5cf6" },
]

const SERVICES = ["Standard", "Express", "Priority", "Same Day", "Economy", "COD", "Bulk Freight", "Temperature Controlled"] as const
const STATUSES = ["Active", "Under Review", "Expired", "Pending Approval", "Suspended"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi", "Indore", "Bhopal", "Coimbatore"]

interface RateRecord {
  id: string; carrier: string; origin: string; destination: string; zone: string;
  service: string; baseRate: number; perKg: number; volumetric: number; gst: number;
  totalRate: number; transitDays: number; status: string; validFrom: string; validTo: string;
  fuelSurcharge: number; handlingFee: number; insurance: number; rating: number;
  shipments: number; onTime: number; damages: number;
}

const rates: RateRecord[] = []
for (let i = 0; i < 200; i++) {
  const carrier = pick(CARRIERS)
  const zone = pick(ZONES)
  const service = pick([...SERVICES])
  const status = pick([...STATUSES])
  const origin = pick(CITIES)
  const dest = pick(CITIES.filter(c => c !== origin))
  const baseRate = zone.baseCost + randInt(-10, 30)
  const perKg = randFloat(5, 45)
  const volumetric = randFloat(3, 20)
  const fuelSurcharge = randFloat(5, 18)
  const handlingFee = randInt(10, 80)
  const insurance = randFloat(0, 5)
  const gst = ((baseRate + perKg * 5 + fuelSurcharge + handlingFee) * 0.18)
  const totalRate = Math.round(baseRate + perKg * 5 + volumetric + fuelSurcharge + handlingFee + insurance + gst)
  rates.push({
    id: `FRT-${String(1500001 + i).padStart(7, "0")}`,
    carrier: carrier.name, origin, destination: dest, zone: zone.name,
    service, baseRate, perKg, volumetric, gst: Math.round(gst),
    totalRate, transitDays: status === "Active" ? randInt(1, 7) : 0,
    status, validFrom: `2026-0${randInt(1, 6)}-${String(randInt(1, 28)).padStart(2, "0")}`,
    validTo: `2026-${randInt(7, 12)}-${String(randInt(1, 28)).padStart(2, "0")}`,
    fuelSurcharge: Math.round(fuelSurcharge * 10) / 10,
    handlingFee, insurance: Math.round(insurance * 100) / 100,
    rating: randFloat(3.0, 5.0, 1), shipments: randInt(50, 2000),
    onTime: randInt(80, 99), damages: randInt(0, 15),
  })
}

const monthlySpend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  air: randInt(80000, 200000),
  road: randInt(120000, 300000),
  rail: randInt(30000, 80000),
  total: 0,
})).map(d => ({ ...d, total: d.air + d.road + d.rail }))

const carrierCompare = CARRIERS.map(c => ({
  name: c.name.split(" ")[0],
  baseRate: c.baseRate,
  onTime: randInt(82, 99),
  claims: randInt(1, 12),
  coverage: randInt(60, 100),
  rating: c.rating,
}))

const zoneDistribution = ZONES.map(z => ({
  name: z.name.split(" (")[0],
  shipments: randInt(500, 5000),
  cost: randInt(100000, 600000),
  avgCost: 0,
})).map(d => ({ ...d, avgCost: Math.round(d.cost / d.shipments) }))

const savingsData = Array.from({ length: 6 }, (_, i) => ({
  month: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"][i],
  potential: randInt(50000, 150000),
  realized: randInt(30000, 100000),
  rate: 0,
})).map(d => ({ ...d, rate: Math.round(d.realized / d.potential * 100) }))

const SERVICE_COLORS: Record<string, string> = {
  Standard: "#3b82f6", Express: "#f59e0b", Priority: "#ef4444", "Same Day": "#8b5cf6",
  Economy: "#10b981", COD: "#06b6d4", "Bulk Freight": "#f97316", "Temperature Controlled": "#ec4899",
}
const STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Under Review": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Expired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "Pending Approval": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Suspended: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
}

function fmtINR(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n}`
}

export default function FreightShippingRateView() {
  const [activeTab, setActiveTab] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [carrierFilter, setCarrierFilter] = useState("All")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRate, setSelectedRate] = useState<RateRecord | null>(null)
  const tabs = ["Dashboard", "Rate Cards", "Carrier Performance", "Zone Cost Matrix", "Savings & Optimization"]

  const filteredRates = useMemo(() => {
    let data = [...rates]
    if (statusFilter !== "All") data = data.filter(r => r.status === statusFilter)
    if (carrierFilter !== "All") data = data.filter(r => r.carrier === carrierFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(r =>
        r.id.toLowerCase().includes(q) || r.carrier.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) || r.destination.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery, carrierFilter])

  const totalSpend = monthlySpend.reduce((s, m) => s + m.total, 0)
  const avgRate = Math.round(rates.filter(r => r.status === "Active").reduce((s, r) => s + r.totalRate, 0) / Math.max(rates.filter(r => r.status === "Active").length, 1))
  const activeCarriers = CARRIERS.filter(c => rates.some(r => r.carrier === c.name && r.status === "Active")).length
  const avgOnTime = Math.round(rates.filter(r => r.onTime > 0).reduce((s, r) => s + r.onTime, 0) / Math.max(rates.filter(r => r.onTime > 0).length, 1) * 10) / 10
  const totalShipments = rates.reduce((s, r) => s + r.shipments, 0)
  const totalDamages = rates.reduce((s, r) => s + r.damages, 0)
  const damageRate = ((totalDamages / Math.max(totalShipments, 1)) * 100).toFixed(2)

  const statusCounts: Record<string, number> = {
    All: rates.length,
    ...Object.fromEntries([...STATUSES].map(s => [s, rates.filter(r => r.status === s).length])),
  }

  const openDrawer = (r: RateRecord) => { setSelectedRate(r); setDrawerOpen(true) }

  const modeColors = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6"]
  const modeData = [
    { name: "Air Freight", value: rates.filter(r => r.carrier.includes("Express") || r.carrier.includes("DHL") || r.carrier.includes("FedEx")).length },
    { name: "Road Transport", value: rates.filter(r => r.carrier.includes("Surface") || r.carrier.includes("Gati") || r.carrier.includes("Courier") || r.carrier.includes("Ecom") || r.carrier.includes("Xpress")).length },
    { name: "Rail Freight", value: randInt(10, 30) },
    { name: "Multi-modal", value: randInt(5, 20) },
  ]

  const transitTrend = Array.from({ length: 28 }, (_, i) => ({
    day: String(i + 1),
    avgDays: randFloat(1.5, 4.5),
    target: 3.0,
  }))

  function renderDashboard() {
    return (
      <Fragment>
        <div className="fsr-kpi-grid">
          {[
            { label: "Total Monthly Spend", value: fmtINR(totalSpend), icon: IndianRupee, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", change: randFloat(2, 8) + "% vs last month" },
            { label: "Average Shipping Rate", value: fmtINR(avgRate), icon: Calculator, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", change: randFloat(-3, -1) + "% vs last month" },
            { label: "Active Carriers", value: String(activeCarriers), icon: Ship, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40", change: `of ${CARRIERS.length} total` },
            { label: "On-Time Delivery", value: `${avgOnTime}%`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", change: randFloat(0.5, 2) + "% improvement" },
            { label: "Total Shipments", value: fmtINR(totalShipments), icon: Package, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950/40", change: randFloat(5, 15) + "% this month" },
            { label: "Damage Rate", value: `${damageRate}%`, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/40", change: parseFloat(damageRate) < 1 ? "Below target" : "Needs attention" },
          ].map(kpi => (
            <Card key={kpi.label} className="hover-lift-sm fsr-kpi-card border-slate-100 dark:border-slate-800">
              <CardContent className="inner-glow glass-subtle p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="fsr-label">{kpi.label}</p>
                    <p className={`fsr-value ${kpi.color}`}>{kpi.value}</p>
                    <p className="fsr-change">{kpi.change}</p>
                  </div>
                  <div className={`${kpi.bg} fsr-icon-wrap`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><TrendingUp className="h-4 w-4 text-blue-500" />Freight Spend by Mode (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={monthlySpend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtINR(v)} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="road" stackId="a" fill="#3b82f6" name="Road" />
                  <Bar dataKey="air" stackId="a" fill="#f59e0b" name="Air" />
                  <Bar dataKey="rail" stackId="a" fill="#10b981" name="Rail" />
                  <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2} dot={false} name="Total" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><PieChartIcon className="h-4 w-4 text-violet-500" />Freight Mode Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={modeData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                    {modeData.map((_, i) => <Cell key={i} fill={modeColors[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><Ship className="h-4 w-4 text-emerald-500" />Transit Time Trend (July 2026)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={transitTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(v: string) => `Day ${v}`} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 6]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="avgDays" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} strokeWidth={2} name="Avg Days" />
                  <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Target (3d)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><Route className="h-4 w-4 text-amber-500" />Zone Cost Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={zoneDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtINR(v)} />
                  <Bar dataKey="cost" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Cost" />
                  <Line type="monotone" dataKey="avgCost" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Avg Cost/Shipment" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="fsr-alerts-section">
          <h3 className="fsr-section-heading"><AlertTriangle className="h-4 w-4 text-amber-500" />Rate Alerts & Notifications</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { type: "warning", msg: "BlueDart rates expire in 5 days — renegotiation required", time: "2 hours ago" },
              { type: "critical", msg: "Fuel surcharge increased 3.2% for all road carriers effective Aug 1", time: "5 hours ago" },
              { type: "info", msg: "New carrier Xpressbees approved for Zone A-D routes", time: "1 day ago" },
              { type: "warning", msg: "DHL international rates revised — 8% increase on express", time: "1 day ago" },
              { type: "info", msg: "GST e-invoice mandate effective for freight > ₹5L from Aug 2026", time: "2 days ago" },
              { type: "critical", msg: "Ecom Express service disruption in East India — rerouting active", time: "3 hours ago" },
            ].map((alert, i) => (
              <div key={i} className={`fsr-alert-card fsr-alert-${alert.type}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${alert.type === "critical" ? "text-red-500" : alert.type === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                  <div>
                    <p className="text-sm font-medium">{alert.msg}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    )
  }

  function renderRateCards() {
    const uniqueCarriers = ["All", ...CARRIERS.map(c => c.name)]
    return (
      <Fragment>
        <div className="fsr-filter-bar">
          <div className="flex flex-wrap gap-2 flex-1">
            {Object.entries(statusCounts).map(([s, c]) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className="badge-interactive fsr-filter-badge cursor-pointer" onClick={() => setStatusFilter(s)}>
                {s} <span className="ml-1 opacity-60">({c})</span>
              </Badge>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
            <input className="fsr-search-input" placeholder="Search rates..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="fsr-select-input" value={carrierFilter} onChange={e => setCarrierFilter(e.target.value)}>
            {uniqueCarriers.map(c => <option key={c} value={c}>{c === "All" ? "All Carriers" : c}</option>)}
          </select>
        </div>

        <Card className="hover-lift-sm fsr-table-card border-slate-100 dark:border-slate-800">
          <CardContent className="inner-glow glass-subtle p-0">
            <div className="overflow-x-auto">
              <table className="fsr-table">
                <thead>
                  <tr className="fsr-table-head">
                    <th>Rate ID</th>
                    <th>Carrier</th>
                    <th>Route</th>
                    <th>Zone</th>
                    <th>Service</th>
                    <th>Base Rate</th>
                    <th>Total Rate</th>
                    <th>Transit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRates.slice(0, 30).map(rate => (
                    <tr key={rate.id} className="fsr-table-row">
                      <td className="font-mono text-xs">{rate.id}</td>
                      <td>
                        <div className="fsr-carrier-name">{rate.carrier}</div>
                      </td>
                      <td>
                        <div className="fsr-route-cell">
                          <span>{rate.origin}</span>
                          <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          <span>{rate.destination}</span>
                        </div>
                      </td>
                      <td><Badge variant="outline" className="badge-interactive fsr-zone-badge">{rate.zone.split(" ")[1]}</Badge></td>
                      <td><Badge className="badge-interactive fsr-service-badge" style={{ backgroundColor: SERVICE_COLORS[rate.service] + "18", color: SERVICE_COLORS[rate.service], borderColor: SERVICE_COLORS[rate.service] + "30" }}>{rate.service}</Badge></td>
                      <td className="font-medium">{fmtINR(rate.baseRate)}</td>
                      <td className="font-semibold text-blue-600 dark:text-blue-400">{fmtINR(rate.totalRate)}</td>
                      <td className="center">{rate.transitDays > 0 ? `${rate.transitDays}d` : "—"}</td>
                      <td><Badge className={STATUS_COLORS[rate.status]}>{rate.status}</Badge></td>
                      <td>
                        <Button size="sm" variant="ghost" className="press-scale fsr-action-btn" onClick={() => openDrawer(rate)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  function renderCarrierPerf() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CARRIERS.map(carrier => {
            const carrierRates = rates.filter(r => r.carrier === carrier.name)
            const avgTotal = carrierRates.length > 0 ? Math.round(carrierRates.reduce((s, r) => s + r.totalRate, 0) / carrierRates.length) : 0
            const avgOnTime = carrierRates.length > 0 ? Math.round(carrierRates.reduce((s, r) => s + r.onTime, 0) / carrierRates.length) : 0
            const totalShip = carrierRates.reduce((s, r) => s + r.shipments, 0)
            return (
              <Card key={carrier.id} className="hover-lift-sm fsr-carrier-card border-slate-100 dark:border-slate-800">
                <CardContent className="inner-glow glass-subtle p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="fsr-carrier-avatar" style={{ backgroundColor: carrier.color + "18", border: `2px solid ${carrier.color}` }}>
                        <Ship className="h-4 w-4" style={{ color: carrier.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{carrier.name}</p>
                        <p className="text-xs text-gray-500">{carrier.type} · {carrier.mode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold">{carrier.rating}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="fsr-metric-mini">
                      <p className="text-xs text-gray-500">Avg Rate</p>
                      <p className="text-sm font-semibold">{fmtINR(avgTotal)}</p>
                    </div>
                    <div className="fsr-metric-mini">
                      <p className="text-xs text-gray-500">On-Time</p>
                      <p className={`text-sm font-semibold ${avgOnTime >= 95 ? "text-emerald-600" : avgOnTime >= 85 ? "text-amber-600" : "text-red-600"}`}>{avgOnTime}%</p>
                    </div>
                    <div className="fsr-metric-mini">
                      <p className="text-xs text-gray-500">Shipments</p>
                      <p className="text-sm font-semibold">{fmtINR(totalShip)}</p>
                    </div>
                    <div className="fsr-metric-mini">
                      <p className="text-xs text-gray-500">Coverage</p>
                      <p className="text-sm font-semibold">{carrier.region}</p>
                    </div>
                  </div>
                  <div className="fsr-ontime-bar-wrap">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">On-time performance</span>
                      <span className="font-medium">{avgOnTime}%</span>
                    </div>
                    <div className="fsr-ontime-bar">
                      <div className="fsr-ontime-fill" style={{ width: `${avgOnTime}%`, backgroundColor: avgOnTime >= 95 ? "#10b981" : avgOnTime >= 85 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><BarChart3 className="h-4 w-4 text-blue-500" />Carrier Cost Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={carrierCompare} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v: number) => `₹${v}`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="baseRate" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Base Rate (₹/kg)" />
                  <Bar dataKey="onTime" fill="#10b981" radius={[0, 4, 4, 0]} name="On-Time %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><Target className="h-4 w-4 text-violet-500" />Carrier Radar (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={["Base Rate", "On-Time", "Coverage", "Rating", "Low Claims"].map((metric, i) => ({
                  metric,
                  BlueDart: [45, 92, 95, 96, 90][i],
                  Delhivery: [28, 88, 90, 90, 85][i],
                  DHL: [70, 95, 98, 98, 95][i],
                  FedEx: [65, 93, 96, 94, 92][i],
                }))}>
                  <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis tick={{ fontSize: 8 }} />
                  <Radar name="BlueDart" dataKey="BlueDart" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="Delhivery" dataKey="Delhivery" stroke="#dc2626" fill="#dc2626" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="DHL" dataKey="DHL" stroke="#ea580c" fill="#ea580c" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="FedEx" dataKey="FedEx" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  function renderZoneCost() {
    return (
      <Fragment>
        <div className="fsr-kpi-grid mb-4">
          {ZONES.map(z => {
            const zRates = rates.filter(r => r.zone.includes(z.name.split(" ")[1]))
            const avgRate = zRates.length > 0 ? Math.round(zRates.reduce((s, r) => s + r.totalRate, 0) / zRates.length) : 0
            const zoneShip = zRates.reduce((s, r) => s + r.shipments, 0)
            return (
              <Card key={z.id} className="hover-lift-sm fsr-zone-kpi border-slate-100 dark:border-slate-800" style={{ borderLeftWidth: 4, borderLeftColor: z.color }}>
                <CardContent className="inner-glow glass-subtle p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="fsr-zone-dot" style={{ backgroundColor: z.color }} />
                    <div>
                      <p className="font-semibold text-sm">{z.name}</p>
                      <p className="text-xs text-gray-500">{z.range}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Avg Rate</p>
                      <p className="text-sm font-bold">{fmtINR(avgRate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Shipments</p>
                      <p className="text-sm font-bold">{fmtINR(zoneShip)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><Compass className="h-4 w-4 text-blue-500" />Cost per Zone (Stacked)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={ZONES.map(z => {
                  const zRates = rates.filter(r => r.zone.includes(z.name.split(" ")[1]))
                  return {
                    name: z.name.split(" ")[1],
                    base: Math.round(zRates.reduce((s, r) => s + r.baseRate, 0) / Math.max(zRates.length, 1)),
                    fuel: Math.round(zRates.reduce((s, r) => s + r.fuelSurcharge, 0) / Math.max(zRates.length, 1)),
                    handling: Math.round(zRates.reduce((s, r) => s + r.handlingFee, 0) / Math.max(zRates.length, 1)),
                    gst: Math.round(zRates.reduce((s, r) => s + r.gst, 0) / Math.max(zRates.length, 1)),
                  }
                })}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `₹${v}`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="base" stackId="a" fill="#3b82f6" name="Base Rate" />
                  <Bar dataKey="fuel" stackId="a" fill="#f59e0b" name="Fuel Surcharge" />
                  <Bar dataKey="handling" stackId="a" fill="#10b981" name="Handling Fee" />
                  <Bar dataKey="gst" stackId="a" fill="#ef4444" name="GST" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><MapPin className="h-4 w-4 text-emerald-500" />Top Routes by Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="fsr-routes-list">
                {rates.filter(r => r.status === "Active").sort((a, b) => b.shipments - a.shipments).slice(0, 8).map((r, i) => (
                  <div key={i} className="fsr-route-item">
                    <div className="flex items-center gap-2">
                      <span className="fsr-route-rank">#{i + 1}</span>
                      <div className="fsr-route-line">
                        <span className="font-medium text-sm">{r.origin}</span>
                        <Navigation className="h-3 w-3 text-gray-400" />
                        <span className="font-medium text-sm">{r.destination}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">{r.shipments} shipments</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{fmtINR(r.totalRate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  function renderSavings() {
    return (
      <Fragment>
        <div className="fsr-kpi-grid">
          {[
            { label: "Potential Savings", value: fmtINR(savingsData.reduce((s, d) => s + d.potential, 0)), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
            { label: "Realized Savings", value: fmtINR(savingsData.reduce((s, d) => s + d.realized, 0)), icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
            { label: "Avg Savings Rate", value: `${Math.round(savingsData.reduce((s, d) => s + d.rate, 0) / savingsData.length)}%`, icon: Target, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
            { label: "Rates Renegotiated", value: `${randInt(12, 28)}`, icon: RefreshCw, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          ].map(kpi => (
            <Card key={kpi.label} className="hover-lift-sm fsr-kpi-card border-slate-100 dark:border-slate-800">
              <CardContent className="inner-glow glass-subtle p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="fsr-label">{kpi.label}</p>
                    <p className={`fsr-value ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <div className={`${kpi.bg} fsr-icon-wrap`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><TrendingDown className="h-4 w-4 text-emerald-500" />Savings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={savingsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtINR(v)} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="potential" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Potential" opacity={0.7} />
                  <Bar dataKey="realized" fill="#10b981" radius={[4, 4, 0, 0]} name="Realized" />
                  <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Savings %" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover-lift-sm fsr-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="fsr-title"><Zap className="h-4 w-4 text-amber-500" />Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="fsr-recs-list">
                {[
                  { title: "Consolidate Zone B Shipments", desc: "Combine 3 daily shipments into 2 to save ₹45K/month", impact: "₹5.4L/year", priority: "High", color: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" },
                  { title: "Switch Zone E to Gati Surface", desc: "Road transport via Gati saves 35% vs BlueDart for remote zones", impact: "₹8.2L/year", priority: "High", color: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" },
                  { title: "Renegotiate DHL International", desc: "Volume commitment of 500+ shipments/month for 12% discount", impact: "₹12.6L/year", priority: "Medium", color: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800" },
                  { title: "Implement Zone Routing Optimization", desc: "Dynamic carrier selection based on real-time rates and transit", impact: "₹15L/year", priority: "Medium", color: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800" },
                  { title: "Bulk Freight for Heavy Items", desc: "Dedicated freight for >50kg shipments saves ₹120/shipment", impact: "₹3.6L/year", priority: "Low", color: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800" },
                  { title: "Ecom Express for COD Orders", desc: "Special COD rates ₹18/parcel vs ₹32 via standard carriers", impact: "₹6.8L/year", priority: "High", color: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" },
                ].map((rec, i) => (
                  <div key={i} className={`fsr-rec-card ${rec.color}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className={`h-3.5 w-3.5 ${rec.priority === "High" ? "text-red-500" : rec.priority === "Medium" ? "text-amber-500" : "text-blue-500"}`} />
                          <p className="font-semibold text-sm">{rec.title}</p>
                        </div>
                        <p className="text-xs text-gray-500">{rec.desc}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={rec.priority === "High" ? "destructive" : "outline"} className="badge-interactive text-xs">{rec.priority}</Badge>
                        <p className="text-sm font-bold text-emerald-600 mt-1">{rec.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  return (
    <div className="fsr-root">
      <div className="fsr-header">
        <div>
          <h2 className="fsr-heading"><Ship className="h-5 w-5 text-blue-500" />Freight & Shipping Rate Management</h2>
          <p className="fsr-subheading">Carrier rate management, cost analysis, and freight optimization across India</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="press-scale btn-outline-animate fsr-header-btn"><RefreshCw className="h-3.5 w-3.5" />Refresh Rates</Button>
          <Button size="sm" className="press-scale fsr-header-btn-primary"><Plus className="h-3.5 w-3.5" />New Rate Card</Button>
        </div>
      </div>

      <div className="fsr-tabs-bar">
        {tabs.map((tab, i) => (
          <button key={tab} className={`fsr-tab ${activeTab === i ? "fsr-tab-active" : ""}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="fsr-content">
        {activeTab === 0 && renderDashboard()}
        {activeTab === 1 && renderRateCards()}
        {activeTab === 2 && renderCarrierPerf()}
        {activeTab === 3 && renderZoneCost()}
        {activeTab === 4 && renderSavings()}
      </div>

      {drawerOpen && selectedRate && (
        <div className="fsr-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="fsr-drawer" onClick={e => e.stopPropagation()}>
            <div className="fsr-drawer-header" style={{
              background: selectedRate.status === "Active" ? "linear-gradient(135deg, #059669, #10b981)" :
                selectedRate.status === "Under Review" ? "linear-gradient(135deg, #d97706, #f59e0b)" :
                  selectedRate.status === "Expired" ? "linear-gradient(135deg, #6b7280, #9ca3af)" :
                    selectedRate.status === "Pending Approval" ? "linear-gradient(135deg, #2563eb, #3b82f6)" :
                      "linear-gradient(135deg, #dc2626, #ef4444)"
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-lg">{selectedRate.id}</p>
                  <p className="text-white/80 text-sm">{selectedRate.carrier}</p>
                </div>
                <button className="text-white/70 hover:text-white" onClick={() => setDrawerOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-2 mt-3">
<div className="chip-group">
                <Badge className="badge-interactive bg-white/20 text-white border-white/30">{selectedRate.service}</Badge>
                <Badge className="badge-interactive bg-white/20 text-white border-white/30">{selectedRate.zone}</Badge>
                <Badge className="badge-interactive bg-white/20 text-white border-white/30">{selectedRate.status}</Badge>
</div>
              </div>
            </div>

            <div className="fsr-drawer-body">
              <div className="fsr-route-header">
                <div className="fsr-route-circle"><Navigation className="h-4 w-4 text-emerald-500" /></div>
                <div className="flex-1 text-center">
                  <div className="fsr-route-dash" />
                </div>
                <div className="fsr-route-circle"><Anchor className="h-4 w-4 text-blue-500" /></div>
              </div>
              <div className="flex justify-between px-8 -mt-10 relative z-10">
                <div className="text-center">
                  <p className="font-semibold text-sm">{selectedRate.origin}</p>
                  <p className="text-xs text-gray-500">Origin</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{selectedRate.destination}</p>
                  <p className="text-xs text-gray-500">Destination</p>
                </div>
              </div>

              <div className="fsr-detail-grid">
                {[
                  { label: "Base Rate", value: fmtINR(selectedRate.baseRate) },
                  { label: "Per KG", value: `₹${selectedRate.perKg}/kg` },
                  { label: "Volumetric", value: fmtINR(selectedRate.volumetric) },
                  { label: "Total Rate", value: fmtINR(selectedRate.totalRate), highlight: true },
                  { label: "Transit Days", value: `${selectedRate.transitDays} days` },
                  { label: "GST (18%)", value: fmtINR(selectedRate.gst) },
                  { label: "Fuel Surcharge", value: `${selectedRate.fuelSurcharge}%` },
                  { label: "Handling Fee", value: fmtINR(selectedRate.handlingFee) },
                ].map(item => (
                  <div key={item.label} className={`fsr-detail-item ${item.highlight ? "fsr-detail-highlight" : ""}`}>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className={`font-semibold text-sm ${item.highlight ? "text-blue-600 text-lg" : ""}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="fsr-drawer-section">
                <h4 className="fsr-drawer-section-title">Carrier Performance</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="fsr-perf-card">
                    <p className="text-xs text-gray-500">Shipments</p>
                    <p className="font-bold">{selectedRate.shipments}</p>
                  </div>
                  <div className="fsr-perf-card">
                    <p className="text-xs text-gray-500">On-Time</p>
                    <p className={`font-bold ${selectedRate.onTime >= 95 ? "text-emerald-600" : "text-amber-600"}`}>{selectedRate.onTime}%</p>
                  </div>
                  <div className="fsr-perf-card">
                    <p className="text-xs text-gray-500">Damages</p>
                    <p className={`font-bold ${selectedRate.damages > 8 ? "text-red-600" : "text-emerald-600"}`}>{selectedRate.damages}</p>
                  </div>
                </div>
              </div>

              <div className="fsr-drawer-section">
                <h4 className="fsr-drawer-section-title">Validity</h4>
                <div className="flex gap-4">
                  <div className="flex-1 fsr-validity-card">
                    <p className="text-xs text-gray-500">Valid From</p>
                    <p className="font-medium text-sm">{selectedRate.validFrom}</p>
                  </div>
                  <div className="flex-1 fsr-validity-card">
                    <p className="text-xs text-gray-500">Valid To</p>
                    <p className="font-medium text-sm">{selectedRate.validTo}</p>
                  </div>
                </div>
              </div>

              <div className="fsr-drawer-actions">
                <Button className="press-scale fsr-action-primary flex-1"><Edit className="h-4 w-4" />Edit Rate</Button>
                <Button variant="outline" className="press-scale btn-outline-animate fsr-action-secondary"><RefreshCw className="h-4 w-4" />Renew</Button>
                <Button variant="outline" className="press-scale btn-outline-animate fsr-action-secondary text-red-500"><Trash2 className="h-4 w-4" />Revoke</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
