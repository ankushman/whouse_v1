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
  Warehouse, Truck, Clock, CheckCircle2, AlertTriangle, Zap, Target,
  Search, Eye, X, ChevronRight, ArrowUpRight, ArrowDownRight, Filter,
  MapPin, Users, Calendar, Timer, Star, ArrowUpDown, Plus, RefreshCw,
  Download, Wrench, LayoutGrid, ClipboardList, DoorOpen, ParkingCircle,
  Thermometer, Navigation, CircleDot, Flag, TrendingUp, MoveHorizontal,
  ArrowRightLeft, Gauge, Bell, Settings
} from "lucide-react"

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
const rng = seededRandom(151151)
function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

const DOCKS = [
  { id: "D01", name: "Dock A1", type: "Inbound", warehouse: "Mumbai Central", capacity: 28, level: randInt(10, 25), color: "#10b981" },
  { id: "D02", name: "Dock A2", type: "Inbound", warehouse: "Mumbai Central", capacity: 28, level: randInt(10, 25), color: "#10b981" },
  { id: "D03", name: "Dock B1", type: "Outbound", warehouse: "Mumbai Central", capacity: 28, level: randInt(10, 25), color: "#3b82f6" },
  { id: "D04", name: "Dock B2", type: "Outbound", warehouse: "Mumbai Central", capacity: 28, level: randInt(10, 25), color: "#3b82f6" },
  { id: "D05", name: "Dock C1", type: "Cross-Dock", warehouse: "Delhi NCR Hub", capacity: 32, level: randInt(15, 30), color: "#f59e0b" },
  { id: "D06", name: "Dock C2", type: "Cross-Dock", warehouse: "Delhi NCR Hub", capacity: 32, level: randInt(15, 30), color: "#f59e0b" },
  { id: "D07", name: "Dock D1", type: "Cold Storage", warehouse: "Chennai Port", capacity: 20, level: randInt(5, 18), color: "#06b6d4" },
  { id: "D08", name: "Dock D2", type: "Cold Storage", warehouse: "Chennai Port", capacity: 20, level: randInt(5, 18), color: "#06b6d4" },
]

const CARRIERS_LIST = ["BlueDart", "Delhivery", "DTDC", "FedEx", "DHL", "Gati", "Ecom Express", "Xpressbees", "Tata Motors Fleet", "Mahindra Logistics", "Allcargo Logistics", "VRL Logistics"]
const VEHICLE_TYPES = ["20ft Container", "40ft Container", "Truck (Open)", "Truck (Closed)", "Trailer", "Reefer", "Tanker", "Flatbed", "Mini Truck", "Tempo"]
const STATUSES = ["Scheduled", "Checking In", "Loading", "Unloading", "Completed", "Cancelled", "Delayed", "No Show"] as const
const YARD_ZONES = ["Yard Zone A (Staging)", "Yard Zone B (Queue)", "Yard Zone C (Holding)", "Yard Zone D (Emergency)", "Yard Zone E (Repair)", "Yard Zone F (Reserved)"]

interface Appointment {
  id: string; dock: string; dockType: string; carrier: string; vehicle: string; vehicleType: string;
  driver: string; license: string; appointmentTime: string; checkIn: string; status: string;
  loadType: string; pallets: number; weight: number; warehouse: string;
  plannedDuration: number; actualDuration: number; priority: string;
  yardZone: string; temperature: number; notes: string; completionPct: number;
}

const appointments: Appointment[] = []
for (let i = 0; i < 180; i++) {
  const dock = pick(DOCKS)
  const status = pick([...STATUSES])
  const plannedDur = randInt(30, 240)
  const actualDur = status === "Completed" ? randInt(20, plannedDur + 60) : status === "Loading" || status === "Unloading" ? randInt(10, plannedDur) : 0
  const compPct = status === "Completed" ? 100 : status === "Loading" || status === "Unloading" ? randInt(15, 95) : 0
  appointments.push({
    id: `APT-${String(1510001 + i).padStart(7, "0")}`,
    dock: dock.name, dockType: dock.type, carrier: pick(CARRIERS_LIST),
    vehicle: `MH-${String(randInt(1, 99)).padStart(2, "0")}-${String.fromCharCode(65 + randInt(0, 25))}-${String(randInt(1000, 9999))}`,
    vehicleType: pick(VEHICLE_TYPES),
    driver: pick(["Amit Sharma", "Rajesh Patel", "Suresh Kumar", "Vikram Singh", "Manoj Tiwari", "Ravi Yadav", "Sunil Gaikwad", "Pradeep Joshi", "Deepak Verma", "Arjun Reddy", "Nikhil Das", "Kiran Rao"]),
    license: `DL-${String(randInt(1, 99)).padStart(2, "0")}${String.fromCharCode(65 + randInt(0, 25))}${String(randInt(1000000, 9999999)).padStart(7, "0")}`,
    appointmentTime: `2026-07-28 ${String(randInt(6, 22)).padStart(2, "0")}:${String(randInt(0, 5) * 10).padStart(2, "0")}`,
    checkIn: status === "Scheduled" ? "—" : `2026-07-28 ${String(randInt(6, 22)).padStart(2, "0")}:${String(randInt(0, 5) * 10).padStart(2, "0")}`,
    status, loadType: pick(["FCL", "LTL", "Palletized", "Bulk", "Hazardous", "Perishable", "Oversized"]),
    pallets: randInt(2, 40), weight: randFloat(500, 25000, 0),
    warehouse: dock.warehouse, plannedDuration: plannedDur, actualDuration: actualDur,
    priority: pick(["Standard", "Priority", "Urgent", "VIP"]),
    yardZone: pick(YARD_ZONES),
    temperature: dock.type === "Cold Storage" ? randFloat(-18, 8) : randFloat(25, 42),
    notes: status === "Delayed" ? pick(["Traffic congestion", "Vehicle breakdown", "Documentation pending", "Dock occupied", "Staff shortage"]) : "",
    completionPct: compPct,
  })
}

const hourlyUtilization = Array.from({ length: 16 }, (_, i) => ({
  hour: `${String(i + 6).padStart(2, "0")}:00`,
  inbound: randInt(2, 8),
  outbound: randInt(2, 8),
  crossdock: randInt(0, 4),
  capacity: 8,
}))

const dockPerformance = DOCKS.map(d => ({
  name: d.name,
  utilization: randInt(60, 98),
  throughput: randInt(12, 45),
  avgTurnaround: randFloat(40, 120),
  delays: randInt(0, 8),
}))

const yardOccupancy = YARD_ZONES.map(z => ({
  zone: z.split(" (")[0],
  capacity: randInt(15, 40),
  occupied: randInt(5, 35),
  turnover: randFloat(2.5, 6.0),
})).map(d => ({ ...d, pct: Math.round(d.occupied / d.capacity * 100) }))

const dailyTrend = Array.from({ length: 28 }, (_, i) => ({
  day: String(i + 1),
  scheduled: randInt(20, 50),
  completed: randInt(18, 45),
  delayed: randInt(1, 10),
  noShow: randInt(0, 4),
}))

const carrierRadar = [
  { metric: "On-Time", BlueDart: 95, Delhivery: 88, FedEx: 93, DHL: 96, Gati: 82 },
  { metric: "Utilization", BlueDart: 90, Delhivery: 85, FedEx: 92, DHL: 94, Gati: 78 },
  { metric: "Turnaround", BlueDart: 88, Delhivery: 82, FedEx: 90, DHL: 91, Gati: 75 },
  { metric: "Compliance", BlueDart: 92, Delhivery: 87, FedEx: 94, DHL: 97, Gati: 80 },
  { metric: "Capacity", BlueDart: 78, Delhivery: 90, FedEx: 85, DHL: 82, Gati: 88 },
]

const STATUS_COLORS: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Checking In": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Loading: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Unloading: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  Delayed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "No Show": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
}

const PRIORITY_COLORS: Record<string, string> = {
  Standard: "#3b82f6", Priority: "#f59e0b", Urgent: "#ef4444", VIP: "#8b5cf6",
}

function fmtMin(min: number): string {
  if (min >= 60) return `${Math.floor(min / 60)}h ${min % 60}m`
  return `${min}m`
}
function fmtKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}T`
  return `${kg}kg`
}

export default function DockSchedulingYardView() {
  const [activeTab, setActiveTab] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [dockFilter, setDockFilter] = useState("All")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)
  const tabs = ["Dashboard", "Appointment Schedule", "Dock Management", "Yard Overview", "Analytics"]

  const filteredAppts = useMemo(() => {
    let data = [...appointments]
    if (statusFilter !== "All") data = data.filter(a => a.status === statusFilter)
    if (dockFilter !== "All") data = data.filter(a => a.dock === dockFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(a =>
        a.id.toLowerCase().includes(q) || a.carrier.toLowerCase().includes(q) ||
        a.vehicle.toLowerCase().includes(q) || a.driver.toLowerCase().includes(q) ||
        a.dock.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery, dockFilter])

  const activeDocks = DOCKS.length
  const totalCapacity = DOCKS.reduce((s, d) => s + d.capacity, 0)
  const usedCapacity = DOCKS.reduce((s, d) => s + d.level, 0)
  const avgUtil = Math.round(usedCapacity / totalCapacity * 100)
  const todayCompleted = appointments.filter(a => a.status === "Completed").length
  const todayDelayed = appointments.filter(a => a.status === "Delayed").length
  const avgTurnaround = Math.round(dockPerformance.reduce((s, d) => s + d.avgTurnaround, 0) / dockPerformance.length)
  const yardUtil = Math.round(yardOccupancy.reduce((s, d) => s + d.occupied, 0) / yardOccupancy.reduce((s, d) => s + d.capacity, 0) * 100)

  const statusCounts: Record<string, number> = {
    All: appointments.length,
    ...Object.fromEntries([...STATUSES].map(s => [s, appointments.filter(a => a.status === s).length])),
  }

  const openDrawer = (a: Appointment) => { setSelectedAppt(a); setDrawerOpen(true) }

  const dockColors = ["#10b981", "#10b981", "#3b82f6", "#3b82f6", "#f59e0b", "#f59e0b", "#06b6d4", "#06b6d4"]

  function renderDashboard() {
    return (
      <Fragment>
        <div className="dsy-kpi-grid">
          {[
            { label: "Active Docks", value: `${activeDocks}/${DOCKS.length}`, icon: DoorOpen, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", sub: `${totalCapacity} doors total` },
            { label: "Avg Utilization", value: `${avgUtil}%`, icon: Gauge, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", sub: `${usedCapacity}/${totalCapacity} in use` },
            { label: "Completed Today", value: String(todayCompleted), icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40", sub: `of ${appointments.length} scheduled` },
            { label: "Delayed", value: String(todayDelayed), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40", sub: todayDelayed > 10 ? "Action needed" : "Within target" },
            { label: "Avg Turnaround", value: fmtMin(avgTurnaround), icon: Timer, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", sub: "Loading + Unloading" },
            { label: "Yard Occupancy", value: `${yardUtil}%`, icon: ParkingCircle, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950/40", sub: `${yardOccupancy.reduce((s, d) => s + d.occupied, 0)} vehicles in yard` },
          ].map(kpi => (
            <Card key={kpi.label} className="dsy-kpi-card border-slate-100 dark:border-slate-800">
              <CardContent className="glass-subtle p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="dsy-label">{kpi.label}</p>
                    <p className={`dsy-value ${kpi.color}`}>{kpi.value}</p>
                    <p className="dsy-sub">{kpi.sub}</p>
                  </div>
                  <div className={`${kpi.bg} dsy-icon-wrap`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><Clock className="h-4 w-4 text-blue-500" />Hourly Dock Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={hourlyUtilization}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="inbound" stackId="a" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Inbound" />
                  <Area type="monotone" dataKey="outbound" stackId="a" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Outbound" />
                  <Area type="monotone" dataKey="crossdock" stackId="a" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Cross-Dock" />
                  <Line type="monotone" dataKey="capacity" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Capacity" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><Target className="h-4 w-4 text-emerald-500" />Appointment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={[...STATUSES].map(s => ({ name: s, value: appointments.filter(a => a.status === s).length }))} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                    {["#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#10b981", "#6b7280", "#ef4444", "#475569"].map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><Navigation className="h-4 w-4 text-violet-500" />Daily Appointment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(v: string) => `Day ${v}`} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="scheduled" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Scheduled" opacity={0.8} />
                  <Bar dataKey="completed" fill="#10b981" radius={[3, 3, 0, 0]} name="Completed" />
                  <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} dot={false} name="Delayed" />
                  <Line type="monotone" dataKey="noShow" stroke="#94a3b8" strokeWidth={2} dot={false} name="No Show" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><ParkingCircle className="h-4 w-4 text-amber-500" />Yard Zone Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={yardOccupancy}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="zone" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="occupied" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Occupied" />
                  <Bar dataKey="capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Capacity" />
                  <Line type="monotone" dataKey="pct" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Occupancy %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="dsy-alerts-section">
          <h3 className="dsy-section-heading"><Bell className="h-4 w-4 text-amber-500" />Dock & Yard Alerts</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { type: "critical", msg: "Dock C1 overload — 6 vehicles waiting, max 4 concurrent", time: "3 min ago" },
              { type: "warning", msg: "Reefer trailer #MH-12-F4789 temp rising above -15°C in Zone A", time: "8 min ago" },
              { type: "info", msg: "Appointment APT-1510042 check-in completed at Dock B2", time: "15 min ago" },
              { type: "warning", msg: "Driver Rajesh Patel DL-08R2345678 documentation incomplete", time: "22 min ago" },
              { type: "critical", msg: "Yard Zone D emergency — spill containment activated at Bay 7", time: "35 min ago" },
              { type: "info", msg: "Dock D1 cold chain validation passed — temp stable at 2°C", time: "45 min ago" },
            ].map((alert, i) => (
              <div key={i} className={`dsy-alert-card dsy-alert-${alert.type}`}>
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

  function renderSchedule() {
    const uniqueDocks = ["All", ...DOCKS.map(d => d.name)]
    return (
      <Fragment>
        <div className="dsy-filter-bar">
          <div className="flex flex-wrap gap-2 flex-1">
            {Object.entries(statusCounts).map(([s, c]) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className="badge-interactive dsy-filter-badge cursor-pointer" onClick={() => setStatusFilter(s)}>
                {s} <span className="ml-1 opacity-60">({c})</span>
              </Badge>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
            <input className="dsy-search-input" placeholder="Search appointments..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="dsy-select-input" value={dockFilter} onChange={e => setDockFilter(e.target.value)}>
            {uniqueDocks.map(d => <option key={d} value={d}>{d === "All" ? "All Docks" : d}</option>)}
          </select>
        </div>

        <Card className="dsy-table-card border-slate-100 dark:border-slate-800">
          <CardContent className="glass-subtle p-0">
            <div className="overflow-x-auto">
              <table className="dsy-table">
                <thead>
                  <tr className="dsy-table-head">
                    <th>Appt ID</th>
                    <th>Carrier / Vehicle</th>
                    <th>Dock</th>
                    <th>Time</th>
                    <th>Load</th>
                    <th>Weight</th>
                    <th>Priority</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppts.slice(0, 30).map(appt => (
                    <tr key={appt.id} className="dsy-table-row">
                      <td className="font-mono text-xs">{appt.id}</td>
                      <td>
                        <div className="font-medium text-sm">{appt.carrier}</div>
                        <div className="text-xs text-gray-500">{appt.vehicle}</div>
                      </td>
                      <td>
                        <Badge variant="outline" className="badge-interactive dsy-dock-badge">{appt.dock}</Badge>
                        <div className="text-xs text-gray-500 mt-0.5">{appt.dockType}</div>
                      </td>
                      <td>
                        <div className="text-xs font-medium">{appt.appointmentTime.split(" ")[1]}</div>
                        {appt.checkIn !== "—" && <div className="text-xs text-gray-500">In: {appt.checkIn.split(" ")[1]}</div>}
                      </td>
                      <td>
                        <Badge variant="outline" className="badge-interactive text-xs">{appt.loadType}</Badge>
                        <div className="text-xs text-gray-500 mt-0.5">{appt.pallets} pallets</div>
                      </td>
                      <td className="font-medium">{fmtKg(appt.weight)}</td>
                      <td>
                        <Badge className="badge-interactive text-xs" style={{ backgroundColor: PRIORITY_COLORS[appt.priority] + "18", color: PRIORITY_COLORS[appt.priority], borderColor: PRIORITY_COLORS[appt.priority] + "30" }}>{appt.priority}</Badge>
                      </td>
                      <td>
                        {appt.completionPct > 0 ? (
                          <div className="dsy-progress-wrap">
                            <div className="dsy-progress-bar">
                              <div className="dsy-progress-fill" style={{ width: `${appt.completionPct}%`, backgroundColor: appt.completionPct === 100 ? "#10b981" : "#3b82f6" }} />
                            </div>
                            <span className="text-xs font-medium">{appt.completionPct}%</span>
                          </div>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td><Badge className={STATUS_COLORS[appt.status]}>{appt.status}</Badge></td>
                      <td>
                        <Button size="sm" variant="ghost" className="dsy-action-btn" onClick={() => openDrawer(appt)}>
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

  function renderDockMgmt() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {DOCKS.map((dock, i) => {
            const dockAppts = appointments.filter(a => a.dock === dock.name)
            const active = dockAppts.filter(a => ["Loading", "Unloading", "Checking In"].includes(a.status)).length
            const queued = dockAppts.filter(a => a.status === "Scheduled").length
            const pct = Math.round(dock.level / dock.capacity * 100)
            return (
              <Card key={dock.id} className="dsy-dock-card border-slate-100 dark:border-slate-800" style={{ borderTopWidth: 3, borderTopColor: dock.color }}>
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="dsy-dock-icon" style={{ backgroundColor: dock.color + "18", border: `2px solid ${dock.color}` }}>
                        <Warehouse className="h-4 w-4" style={{ color: dock.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{dock.name}</p>
                        <p className="text-xs text-gray-500">{dock.type}</p>
                      </div>
                    </div>
                    <Badge variant={pct >= 90 ? "destructive" : pct >= 70 ? "default" : "outline"} className="badge-interactive text-xs">{pct}%</Badge>
                  </div>
                  <div className="dsy-dock-bar-wrap">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Capacity</span>
                      <span>{dock.level}/{dock.capacity}</span>
                    </div>
                    <div className="dsy-dock-bar">
                      <div className="dsy-dock-fill" style={{ width: `${pct}%`, backgroundColor: dock.color }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="dsy-metric-mini">
                      <p className="text-xs text-gray-500">Active</p>
                      <p className="text-sm font-semibold">{active}</p>
                    </div>
                    <div className="dsy-metric-mini">
                      <p className="text-xs text-gray-500">Queued</p>
                      <p className="text-sm font-semibold">{queued}</p>
                    </div>
                  </div>
                  {dock.type === "Cold Storage" && (
                    <div className="dsy-temp-badge">
                      <Thermometer className="h-3 w-3 text-cyan-500" />
                      <span>Temp: {dock.level > 15 ? "-18°C" : `${randFloat(0, 8)}°C`}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{dock.warehouse}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><ArrowUpDown className="h-4 w-4 text-blue-500" />Dock Throughput Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dockPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="throughput" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Shipments/Day" />
                  <Bar dataKey="delays" fill="#ef4444" radius={[4, 4, 0, 0]} name="Delays" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><Clock className="h-4 w-4 text-amber-500" />Avg Turnaround by Dock</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dockPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v: number) => fmtMin(v)} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={55} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtMin(v)} />
                  <Bar dataKey="avgTurnaround" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Avg Turnaround" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  function renderYardOverview() {
    return (
      <Fragment>
        <div className="dsy-yard-visual">
          <h3 className="dsy-section-heading"><LayoutGrid className="h-4 w-4 text-blue-500" />Yard Map — Live Occupancy</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {yardOccupancy.map((zone, i) => {
              const vehicles = appointments.filter(a => a.yardZone.includes(zone.zone) && ["Checking In", "Loading", "Unloading", "Scheduled"].includes(a.status)).slice(0, 6)
              const color = zone.pct >= 90 ? "#ef4444" : zone.pct >= 70 ? "#f59e0b" : "#10b981"
              return (
                <Card key={i} className="dsy-yard-card border-slate-100 dark:border-slate-800" style={{ borderLeftWidth: 4, borderLeftColor: color }}>
                  <CardContent className="glass-subtle p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-xs">{zone.zone}</p>
                      <Badge variant={zone.pct >= 90 ? "destructive" : "outline"} className="badge-interactive text-xs">{zone.pct}%</Badge>
                    </div>
                    <div className="dsy-yard-bar">
                      <div className="dsy-yard-fill" style={{ width: `${Math.min(zone.pct, 100)}%`, backgroundColor: color }} />
                    </div>
                    <div className="flex justify-between text-xs mt-1.5 text-gray-500">
                      <span>{zone.occupied}/{zone.capacity}</span>
                      <span>{zone.turnover}/hr</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {vehicles.slice(0, 4).map((v, j) => (
                        <div key={j} className="dsy-vehicle-chip">
                          <Truck className="h-3 w-3" />
                          <span className="text-xs truncate max-w-[60px]">{v.vehicle.split("-")[2]}</span>
                        </div>
                      ))}
                      {vehicles.length > 4 && <span className="text-xs text-gray-400">+{vehicles.length - 4}</span>}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><Truck className="h-4 w-4 text-emerald-500" />Vehicle Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={VEHICLE_TYPES.slice(0, 6).map(v => ({ name: v, value: appointments.filter(a => a.vehicleType === v).length }))} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}>
                    {["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"].map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><Flag className="h-4 w-4 text-violet-500" />Load Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={["FCL", "LTL", "Palletized", "Bulk", "Hazardous", "Perishable", "Oversized"].map(lt => ({ type: lt, count: appointments.filter(a => a.loadType === lt).length }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="type" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#f97316"].map((c, i) => <Cell key={i} fill={c} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  function renderAnalytics() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><TrendingUp className="h-4 w-4 text-emerald-500" />Throughput Trend (28 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(v: string) => `${v}`} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} name="Completed" />
                  <Area type="monotone" dataKey="delayed" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} name="Delayed" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><Target className="h-4 w-4 text-violet-500" />Carrier Performance Radar (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={carrierRadar}>
                  <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 8 }} />
                  <Radar name="BlueDart" dataKey="BlueDart" stroke="#2563eb" fill="#2563eb" fillOpacity={0.12} strokeWidth={2} />
                  <Radar name="Delhivery" dataKey="Delhivery" stroke="#dc2626" fill="#dc2626" fillOpacity={0.08} strokeWidth={2} />
                  <Radar name="FedEx" dataKey="FedEx" stroke="#9333ea" fill="#9333ea" fillOpacity={0.08} strokeWidth={2} />
                  <Radar name="DHL" dataKey="DHL" stroke="#ea580c" fill="#ea580c" fillOpacity={0.08} strokeWidth={2} />
                  <Radar name="Gati" dataKey="Gati" stroke="#059669" fill="#059669" fillOpacity={0.08} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><ArrowRightLeft className="h-4 w-4 text-amber-500" />Inbound vs Outbound Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hourlyUtilization}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="inbound" fill="#10b981" radius={[4, 4, 0, 0]} name="Inbound" />
                  <Bar dataKey="outbound" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Outbound" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dsy-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="dsy-title"><Timer className="h-4 w-4 text-cyan-500" />Delay Analysis by Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={["Traffic congestion", "Vehicle breakdown", "Documentation pending", "Dock occupied", "Staff shortage", "Weather delay"].map((reason, i) => ({ reason: reason.split(" ")[0].slice(0, 8), count: randInt(5, 25) }))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="reason" tick={{ fontSize: 9 }} width={70} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} name="Delays" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  return (
    <div className="dsy-root">
      <div className="dsy-header">
        <div>
          <h2 className="dsy-heading"><Warehouse className="h-5 w-5 text-emerald-500" />Dock Scheduling & Yard Management</h2>
          <p className="dsy-subheading">Loading dock allocation, truck scheduling, and yard operations across warehouses</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="btn-outline-animate dsy-header-btn"><RefreshCw className="h-3.5 w-3.5" />Refresh</Button>
          <Button size="sm" className="dsy-header-btn-primary"><Plus className="h-3.5 w-3.5" />New Appointment</Button>
        </div>
      </div>

      <div className="dsy-tabs-bar">
        {tabs.map((tab, i) => (
          <button key={tab} className={`dsy-tab ${activeTab === i ? "dsy-tab-active" : ""}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="dsy-content">
        {activeTab === 0 && renderDashboard()}
        {activeTab === 1 && renderSchedule()}
        {activeTab === 2 && renderDockMgmt()}
        {activeTab === 3 && renderYardOverview()}
        {activeTab === 4 && renderAnalytics()}
      </div>

      {drawerOpen && selectedAppt && (
        <div className="dsy-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="dsy-drawer" onClick={e => e.stopPropagation()}>
            <div className="dsy-drawer-header" style={{
              background: selectedAppt.status === "Completed" ? "linear-gradient(135deg, #059669, #10b981)" :
                selectedAppt.status === "Loading" || selectedAppt.status === "Unloading" ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" :
                  selectedAppt.status === "Delayed" ? "linear-gradient(135deg, #dc2626, #ef4444)" :
                    selectedAppt.status === "Scheduled" ? "linear-gradient(135deg, #2563eb, #3b82f6)" :
                      selectedAppt.status === "Checking In" ? "linear-gradient(135deg, #d97706, #f59e0b)" :
                        "linear-gradient(135deg, #6b7280, #9ca3af)"
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-lg">{selectedAppt.id}</p>
                  <p className="text-white/80 text-sm">{selectedAppt.carrier} — {selectedAppt.vehicle}</p>
                </div>
                <button className="text-white/70 hover:text-white" onClick={() => setDrawerOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-2 mt-3">
<div className="chip-group">
                <Badge className="badge-interactive bg-white/20 text-white border-white/30">{selectedAppt.dock}</Badge>
                <Badge className="badge-interactive bg-white/20 text-white border-white/30">{selectedAppt.loadType}</Badge>
                <Badge className="badge-interactive bg-white/20 text-white border-white/30">{selectedAppt.priority}</Badge>
</div>
              </div>
            </div>

            <div className="dsy-drawer-body">
              <div className="dsy-dock-flow">
                {["Scheduled", "Checked In", "Processing", "Completed"].map((step, i) => {
                  const stepMap: Record<string, number> = { Scheduled: 0, "Checking In": 1, Loading: 2, Unloading: 2, Completed: 3, Delayed: 2, "No Show": 0, Cancelled: -1 }
                  const current = stepMap[selectedAppt.status] ?? 0
                  const isActive = i === current
                  const isDone = i < current
                  return (
                    <div key={step} className={`dsy-flow-step ${isActive ? "dsy-flow-active" : isDone ? "dsy-flow-done" : "dsy-flow-pending"}`}>
                      <div className={`dsy-flow-dot ${isDone ? "dsy-flow-dot-done" : isActive ? "dsy-flow-dot-active" : ""}`} />
                      <span className="text-xs">{step}</span>
                      {i < 3 && <div className={`dsy-flow-line ${isDone ? "dsy-flow-line-done" : ""}`} />}
                    </div>
                  )
                })}
              </div>

              <div className="dsy-detail-grid">
                {[
                  { label: "Driver", value: selectedAppt.driver },
                  { label: "License", value: selectedAppt.license },
                  { label: "Vehicle Type", value: selectedAppt.vehicleType },
                  { label: "Warehouse", value: selectedAppt.warehouse },
                  { label: "Appointment", value: selectedAppt.appointmentTime },
                  { label: "Check-In", value: selectedAppt.checkIn },
                  { label: "Planned Duration", value: fmtMin(selectedAppt.plannedDuration) },
                  { label: "Actual Duration", value: selectedAppt.actualDuration > 0 ? fmtMin(selectedAppt.actualDuration) : "—" },
                  { label: "Pallets", value: String(selectedAppt.pallets) },
                  { label: "Weight", value: fmtKg(selectedAppt.weight) },
                  { label: "Yard Zone", value: selectedAppt.yardZone.split(" (")[0] },
                  { label: "Temperature", value: `${selectedAppt.temperature}°C` },
                ].map(item => (
                  <div key={item.label} className="dsy-detail-item">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-semibold text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              {selectedAppt.completionPct > 0 && selectedAppt.completionPct < 100 && (
                <div className="dsy-progress-section">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Processing Progress</span>
                    <span className="font-bold">{selectedAppt.completionPct}%</span>
                  </div>
                  <div className="dsy-progress-bar-lg">
                    <div className="dsy-progress-fill-lg" style={{ width: `${selectedAppt.completionPct}%` }} />
                  </div>
                </div>
              )}

              {selectedAppt.notes && (
                <div className="dsy-notes-section">
                  <h4 className="dsy-drawer-section-title"><AlertTriangle className="h-3.5 w-3.5 text-red-500" />Delay Notes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedAppt.notes}</p>
                </div>
              )}

              <div className="dsy-drawer-actions">
                <Button className="dsy-action-primary flex-1"><CheckCircle2 className="h-4 w-4" />Complete</Button>
                <Button variant="outline" className="btn-outline-animate dsy-action-secondary"><Clock className="h-4 w-4" />Reschedule</Button>
                <Button variant="outline" className="btn-outline-animate dsy-action-secondary text-red-500"><X className="h-4 w-4" />Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
