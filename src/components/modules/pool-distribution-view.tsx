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
  Gauge, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, Eye, X, Clock, Package, ArrowRight,
  ChevronRight,
  MapPin, Truck, Navigation, Users, Fuel, IndianRupee,
  Warehouse, Filter, Calendar, Route, Phone,
  Weight, Car, Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(140140)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const rDate = (start: number, end: number) => new Date(2026, 6, rInt(start, end)).toISOString().split("T")[0]
const rTime = () => `${String(rInt(4, 20)).padStart(2, "0")}:${String(rInt(0, 59)).padStart(2, "0")}`
const fmtRupee = (n: number) => `₹${n.toLocaleString("en-IN")}`

const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const POOL_STATUSES = ["Planned", "Dispatched", "In Transit", "Delivered", "Delayed", "Cancelled", "Partial Delivery"]
const VEHICLE_TYPES = ["Truck 20ft", "Truck 40ft", "Container 20ft", "Container 40ft", "Mini Truck", "Flatbed Trailer", "Refrigerated", "Tanker"]
const FUEL_TYPES = ["Diesel", "Petrol", "CNG", "Electric", "Hybrid"]
const ROUTE_TYPES = ["Mumbai→Delhi", "Delhi→Kolkata", "Chennai→Bangalore", "Mumbai→Pune", "Delhi→Chennai", "Kolkata→Mumbai", "Pune→Bangalore", "Chennai→Kolkata"]

const DRIVERS = [
  { id: "DRV-001", name: "Rajesh Kumar", phone: "9876543210", license: "MH-04-2023001", rating: 4.5, trips: rInt(100, 500) },
  { id: "DRV-002", name: "Sunil Verma", phone: "9876543211", license: "DL-01-2023002", rating: 4.2, trips: rInt(80, 400) },
  { id: "DRV-003", name: "Murugan S.", phone: "9876543212", license: "TN-04-2023003", rating: 4.8, trips: rInt(120, 600) },
  { id: "DRV-004", name: "Ganesh Patil", phone: "9876543213", license: "MH-12-2023004", rating: 4.1, trips: rInt(90, 350) },
  { id: "DRV-005", name: "Alok Singh", phone: "9876543214", license: "WB-02-2023005", rating: 4.6, trips: rInt(110, 450) },
  { id: "DRV-006", name: "Krishna Reddy", phone: "9876543215", license: "KA-01-2023006", rating: 3.9, trips: rInt(70, 300) },
  { id: "DRV-007", name: "Dinesh Yadav", phone: "9876543216", license: "MH-04-2023007", rating: 4.3, trips: rInt(95, 380) },
  { id: "DRV-008", name: "Senthil R.", phone: "9876543217", license: "TN-09-2023008", rating: 4.7, trips: rInt(130, 550) },
]

const VEHICLES = [
  { id: "VH-001", reg: "MH-04-AB-1234", type: "Truck 40ft", capacity: 28000, fuel: "Diesel", year: 2023, mileage: 45000 },
  { id: "VH-002", reg: "DL-01-CD-5678", type: "Container 20ft", capacity: 21000, fuel: "Diesel", year: 2022, mileage: 68000 },
  { id: "VH-003", reg: "TN-04-EF-9012", type: "Truck 20ft", capacity: 14000, fuel: "CNG", year: 2024, mileage: 12000 },
  { id: "VH-004", reg: "WB-02-GH-3456", type: "Flatbed Trailer", capacity: 35000, fuel: "Diesel", year: 2021, mileage: 82000 },
  { id: "VH-005", reg: "MH-12-IJ-7890", type: "Mini Truck", capacity: 3500, fuel: "Electric", year: 2025, mileage: 5000 },
  { id: "VH-006", reg: "KA-01-KL-2345", type: "Refrigerated", capacity: 18000, fuel: "Hybrid", year: 2023, mileage: 52000 },
  { id: "VH-007", reg: "DL-08-MN-6789", type: "Tanker", capacity: 25000, fuel: "Diesel", year: 2022, mileage: 71000 },
  { id: "VH-008", reg: "TN-01-OP-0123", type: "Container 40ft", capacity: 28000, fuel: "Diesel", year: 2024, mileage: 28000 },
  { id: "VH-009", reg: "MH-04-QR-4567", type: "Truck 20ft", capacity: 14000, fuel: "Diesel", year: 2023, mileage: 55000 },
  { id: "VH-010", reg: "GJ-01-ST-8901", type: "Mini Truck", capacity: 3500, fuel: "CNG", year: 2024, mileage: 8000 },
]

// Pool/shipment records
const pools = (() => {
  const result: Array<{
    id: string; route: string; origin: string; destination: string;
    vehicle: typeof VEHICLES[0]; driver: typeof DRIVERS[0];
    status: string; priority: string;
    totalShipments: number; totalWeight: number; totalVolume: number;
    totalDistance: number; estimatedDuration: number; actualDuration: number | null;
    departureTime: string; eta: string; actualArrival: string | null;
    cost: number; fuelCost: number; tollCost: number; driverCost: number;
    utilization: number; fuelEfficiency: number;
    createdDate: string; warehouse: string;
  }> = []

  for (let i = 0; i < 100; i++) {
    const vehicle = pick(VEHICLES)
    const driver = pick(DRIVERS)
    const route = pick(ROUTE_TYPES)
    const [origin, destination] = route.split("→")
    const status = pick(POOL_STATUSES)
    const priority = status === "Cancelled" ? "Low" : pick(["Critical", "High", "Medium", "Medium", "Low"])
    const totalShipments = rInt(3, 25)
    const totalWeight = rInt(2000, vehicle.capacity * 0.95)
    const totalVolume = Math.round(totalWeight * rInt(8, 15) / 10)
    const totalDistance = rInt(150, 2500)
    const estDur = Math.round(totalDistance / rInt(35, 55))
    const actDur = status === "Delivered" || status === "Partial Delivery" ? estDur + rInt(-30, 60) : null
    const depTime = rTime()
    const etaH = parseInt(depTime.split(":")[0]) + estDur
    const eta = `${String(Math.min(23, etaH)).padStart(2, "0")}:${depTime.split(":")[1]}`
    const cost = totalDistance * rInt(15, 35) + rInt(500, 2000)
    const fuelCost = Math.round(cost * rand() * 0.35 + cost * 0.25)
    const tollCost = rInt(200, 2000)
    const driverCost = rInt(800, 2500)
    const utilization = Math.round((totalWeight / vehicle.capacity) * 100)

    result.push({
      id: `PL-${String(i + 1).padStart(4, "0")}`,
      route, origin: origin.trim(), destination: destination.trim(),
      vehicle, driver, status, priority,
      totalShipments, totalWeight, totalVolume,
      totalDistance, estimatedDuration: estDur, actualDuration: actDur,
      departureTime: depTime, eta, actualArrival: status === "Delivered" ? rTime() : null,
      cost, fuelCost, tollCost, driverCost,
      utilization: Math.min(100, utilization),
      fuelEfficiency: +(rand() * 4 + 3).toFixed(1),
      createdDate: rDate(1, 28),
      warehouse: pick(WAREHOUSES),
    })
  }
  return result
})()

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const COLORS = ["#0d9488", "#f59e0b", "#6366f1", "#ef4444", "#ec4899", "#06b6d4", "#10b981", "#f97316"]

const monthlyPools = MONTHS.map((m) => ({
  month: m, created: rInt(60, 150), delivered: rInt(50, 140), delayed: rInt(2, 20), cancelled: rInt(0, 8),
}))

const monthlyCosts = MONTHS.map((m) => ({
  month: m, fuel: rInt(500000, 1500000), toll: rInt(100000, 400000), driver: rInt(200000, 600000), maintenance: rInt(50000, 200000),
}))

const routeDist = (() => {
  const counts: Record<string, number> = {}
  pools.forEach((p) => { counts[p.route] = (counts[p.route] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})()

const vehicleTypeDist = (() => {
  const counts: Record<string, number> = {}
  pools.forEach((p) => { counts[p.vehicle.type] = (counts[p.vehicle.type] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const warehouseLoads = WAREHOUSES.map((w) => ({
  warehouse: w, dispatched: rInt(20, 60), received: rInt(15, 55), inTransit: rInt(5, 20), delayed: rInt(1, 8),
}))

const fuelDist = FUEL_TYPES.map((f) => ({
  type: f, count: VEHICLES.filter((v) => v.fuel === f).length, costShare: rInt(10, 40),
}))

const scheduleConflicts = (() => {
  const result: Array<{
    id: string; pool1: string; pool2: string; vehicle: string;
    conflict: string; severity: string; warehouse: string;
    time: string; status: string; resolution: string | null;
  }> = []
  for (let i = 0; i < 15; i++) {
    const status = pick(["Open", "Resolved", "Rescheduled", "Escalated"])
    result.push({
      id: `SCF-${String(i + 1).padStart(4, "0")}`,
      pool1: `PL-${String(rInt(1, 100)).padStart(4, "0")}`,
      pool2: `PL-${String(rInt(1, 100)).padStart(4, "0")}`,
      vehicle: pick(VEHICLES).reg,
      conflict: pick(["Time overlap", "Driver unavailability", "Vehicle maintenance", "Route conflict", "Capacity exceed", "License expiry"]),
      severity: pick(["High", "Medium", "Low"]),
      warehouse: pick(WAREHOUSES),
      time: rTime(),
      status,
      resolution: status === "Resolved" ? pick(["Reassigned vehicle", "Adjusted schedule", "Split shipment"]) : null,
    })
  }
  return result
})()

const STATUS_COLORS: Record<string, string> = {
  Planned: "pd-badge-planned", Dispatched: "pd-badge-dispatched", "In Transit": "pd-badge-transit",
  Delivered: "pd-badge-delivered", Delayed: "pd-badge-delayed", Cancelled: "pd-badge-cancelled", "Partial Delivery": "pd-badge-partial",
}
const PRIORITY_COLORS: Record<string, string> = {
  Critical: "pd-badge-critical", High: "pd-badge-high", Medium: "pd-badge-medium", Low: "pd-badge-low",
}
const VEHICLE_BG: Record<string, string> = {
  "Truck 20ft": "pd-chip-truck-s", "Truck 40ft": "pd-chip-truck-l",
  "Container 20ft": "pd-chip-cont-s", "Container 40ft": "pd-chip-cont-l",
  "Mini Truck": "pd-chip-mini", "Flatbed Trailer": "pd-chip-flatbed",
  "Refrigerated": "pd-chip-refrigerated", "Tanker": "pd-chip-tanker",
}
const SEVERITY_COLORS: Record<string, string> = {
  High: "pd-badge-sev-high", Medium: "pd-badge-sev-medium", Low: "pd-badge-sev-low",
}

export default function PoolDistributionView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [poolSearch, setPoolSearch] = useState("")
  const [poolStatusFilter, setPoolStatusFilter] = useState("All")
  const [poolRouteFilter, setPoolRouteFilter] = useState("All")
  const [selectedPool, setSelectedPool] = useState<typeof pools[0] | null>(null)

  const totalCost = pools.reduce((a, b) => a + b.cost, 0)
  const avgUtilization = Math.round(pools.reduce((a, b) => a + b.utilization, 0) / pools.length)
  const delayedCount = pools.filter((p) => p.status === "Delayed").length
  const inTransitCount = pools.filter((p) => p.status === "In Transit").length

  const filteredPools = (() => {
    const q = poolSearch.toLowerCase()
    return pools.filter((p) => {
      const matchSearch = !q || p.id.toLowerCase().includes(q) || p.route.toLowerCase().includes(q)
        || p.vehicle.reg.toLowerCase().includes(q) || p.driver.name.toLowerCase().includes(q)
        || p.origin.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q)
      const matchStatus = poolStatusFilter === "All" || p.status === poolStatusFilter
      const matchRoute = poolRouteFilter === "All" || p.route === poolRouteFilter
      return matchSearch && matchStatus && matchRoute
    })
  })()
  const visiblePools = filteredPools.slice(0, 60)

  return (
    <div className="pd-container">
      {/* Header */}
      <div className="pd-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-600 to-amber-500 flex items-center justify-center">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pool Distribution & Scheduling</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Multi-Shipment Consolidation · Vehicle Scheduling · Route Costing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="pd-stat-chip"><span className="text-[10px] text-gray-500">In Transit</span><span className="text-sm font-bold text-teal-600">{inTransitCount}</span></span>
          <span className="pd-stat-chip"><span className="text-[10px] text-gray-500">Delayed</span><span className="text-sm font-bold text-red-600">{delayedCount}</span></span>
          <span className="pd-stat-chip"><span className="text-[10px] text-gray-500">Avg Util</span><span className="text-sm font-bold text-amber-600">{avgUtilization}%</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="pd-tabs-wrapper mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Dashboard</TabsTrigger>
            <TabsTrigger value="pools" className="gap-1.5"><Package className="h-3.5 w-3.5" />Pool Register</TabsTrigger>
            <TabsTrigger value="vehicles" className="gap-1.5"><Car className="h-3.5 w-3.5" />Vehicles</TabsTrigger>
            <TabsTrigger value="scheduling" className="gap-1.5"><Clock className="h-3.5 w-3.5" />Scheduling</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Analytics</TabsTrigger>
          </TabsList>

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { title: "Total Pools", val: "100", icon: Package, cls: "pd-kpi-teal" },
                  { title: "In Transit", val: String(inTransitCount), icon: Navigation, cls: "pd-kpi-indigo" },
                  { title: "Delivered", val: String(pools.filter((p) => p.status === "Delivered").length), icon: CheckCircle2, cls: "pd-kpi-emerald" },
                  { title: "Delayed", val: String(delayedCount), icon: AlertTriangle, cls: "pd-kpi-red" },
                  { title: "Avg Utilization", val: `${avgUtilization}%`, icon: Gauge, cls: "pd-kpi-amber" },
                  { title: "Total Cost", val: fmtRupee(totalCost), icon: IndianRupee, cls: "pd-kpi-cyan" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("pd-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-base font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Pool Lifecycle</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={monthlyPools}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="created" fill="#0d9488" radius={[4, 4, 0, 0]} name="Created" />
                    <Bar dataKey="delivered" fill="#10b981" radius={[4, 4, 0, 0]} name="Delivered" />
                    <Line type="monotone" dataKey="delayed" stroke="#f59e0b" strokeWidth={2} dot={false} name="Delayed" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Route Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={routeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="count" nameKey="name" label={({ name, percent }) => `${name.split("→")[1]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {routeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Load Summary</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><BarChart data={warehouseLoads} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" fontSize={11} /><YAxis type="category" dataKey="warehouse" fontSize={10} width={95} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="dispatched" fill="#0d9488" stackId="a" name="Dispatched" />
                    <Bar dataKey="received" fill="#10b981" stackId="a" name="Received" />
                    <Bar dataKey="inTransit" fill="#6366f1" stackId="a" name="In Transit" />
                    <Bar dataKey="delayed" fill="#ef4444" stackId="a" name="Delayed" />
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost Breakdown</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><AreaChart data={monthlyCosts}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip formatter={(v: number) => fmtRupee(v)} /><Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="fuel" stackId="a" stroke="#f59e0b" fill="#f59e0b20" name="Fuel" />
                    <Area type="monotone" dataKey="toll" stackId="a" stroke="#6366f1" fill="#6366f120" name="Toll" />
                    <Area type="monotone" dataKey="driver" stackId="a" stroke="#0d9488" fill="#0d948820" name="Driver" />
                    <Area type="monotone" dataKey="maintenance" stackId="a" stroke="#ef4444" fill="#ef444420" name="Maintenance" />
                  </AreaChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              {/* Active Transit Table */}
              <Card className="card-crud-lift pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Navigation className="h-4 w-4 text-indigo-500" />Active In-Transit Pools ({inTransitCount})</CardTitle></CardHeader><CardContent>
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader><TableRow>
                      <TableHead className="text-[10px]">Pool ID</TableHead>
                      <TableHead className="text-[10px]">Route</TableHead>
                      <TableHead className="text-[10px]">Vehicle</TableHead>
                      <TableHead className="text-[10px]">Driver</TableHead>
                      <TableHead className="text-[10px]">Shipments</TableHead>
                      <TableHead className="text-[10px]">Weight (kg)</TableHead>
                      <TableHead className="text-[10px]">Utilization</TableHead>
                      <TableHead className="text-[10px]">Departure</TableHead>
                      <TableHead className="text-[10px]">ETA</TableHead>
                      <TableHead className="text-[10px]">Distance</TableHead>
                      <TableHead className="text-[10px]">Action</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {pools.filter((p) => p.status === "In Transit").slice(0, 10).map((p) => (
                        <TableRow key={p.id} className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 cursor-pointer" onClick={() => setSelectedPool(p)}>
                          <TableCell className="text-[11px] font-mono font-semibold text-teal-700 dark:text-teal-400">{p.id}</TableCell>
                          <TableCell className="text-[11px]"><MapPin className="h-3 w-3 inline mr-0.5 text-teal-500" />{p.origin} → {p.destination}</TableCell>
                          <TableCell className="text-[10px] font-mono">{p.vehicle.reg}</TableCell>
                          <TableCell className="text-[11px]">{p.driver.name}</TableCell>
                          <TableCell className="numeric-cell text-[11px] font-semibold">{p.totalShipments}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono">{p.totalWeight.toLocaleString()}</TableCell>
                          <TableCell className="text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <div className="w-12 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                <div className={cn("h-full rounded-full", p.utilization >= 80 ? "bg-emerald-500" : p.utilization >= 50 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${p.utilization}%` }} />
                              </div>
                              <span className={cn("font-mono text-[9px]", p.utilization >= 80 ? "text-emerald-600" : p.utilization >= 50 ? "text-amber-600" : "text-red-600")}>{p.utilization}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[10px] font-mono">{p.departureTime}</TableCell>
                          <TableCell className="text-[10px] font-mono">{p.eta}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono">{p.totalDistance} km</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={(e) => { e.stopPropagation(); setSelectedPool(p) }}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 2: POOL REGISTER */}
          {activeTab === "pools" && (
            <div className="mt-4 space-y-4">
              <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Filter className="h-4 w-4 text-teal-500" />Filter Pools</CardTitle></CardHeader><CardContent>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                    <input className="pd-filter-input pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full" placeholder="Pool ID, Route, Vehicle, Driver..." value={poolSearch} onChange={(e) => setPoolSearch(e.target.value)} />
                  </div>
                  <select className="pd-filter-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2" value={poolStatusFilter} onChange={(e) => setPoolStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    {POOL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="pd-filter-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2" value={poolRouteFilter} onChange={(e) => setPoolRouteFilter(e.target.value)}>
                    <option value="All">All Routes</option>
                    {ROUTE_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <Badge variant="outline" className="badge-interactive text-[10px]">{filteredPools.length} results</Badge>
                </div>
              </CardContent></Card>

              <Card className="card-crud-lift glass-subtle pd-chart-card"><CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader><TableRow className="pd-table-header">
                      <TableHead className="text-[10px]">ID</TableHead>
                      <TableHead className="text-[10px]">Route</TableHead>
                      <TableHead className="text-[10px]">Vehicle</TableHead>
                      <TableHead className="text-[10px]">Driver</TableHead>
                      <TableHead className="text-[10px]">Status</TableHead>
                      <TableHead className="text-[10px]">Priority</TableHead>
                      <TableHead className="text-[10px]">Shipments</TableHead>
                      <TableHead className="text-[10px]">Weight</TableHead>
                      <TableHead className="text-[10px]">Util%</TableHead>
                      <TableHead className="text-[10px]">Distance</TableHead>
                      <TableHead className="text-[10px]">Est. Duration</TableHead>
                      <TableHead className="text-[10px]">Cost</TableHead>
                      <TableHead className="text-[10px]"></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {visiblePools.map((p) => (
                        <TableRow key={p.id} className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 cursor-pointer" onClick={() => setSelectedPool(p)}>
                          <TableCell className="text-[10px] font-mono font-semibold text-teal-700 dark:text-teal-400">{p.id}</TableCell>
                          <TableCell className="text-[11px]"><MapPin className="h-3 w-3 inline mr-0.5 text-teal-500" />{p.origin}→{p.destination}</TableCell>
                          <TableCell className="text-[10px] font-mono">{p.vehicle.reg}</TableCell>
                          <TableCell className="text-[11px]">{p.driver.name}</TableCell>
                          <TableCell><Badge className={cn("text-[9px]", STATUS_COLORS[p.status])}>{p.status}</Badge></TableCell>
                          <TableCell><Badge className={cn("text-[9px]", PRIORITY_COLORS[p.priority])}>{p.priority}</Badge></TableCell>
                          <TableCell className="numeric-cell text-[10px] font-semibold">{p.totalShipments}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono">{p.totalWeight.toLocaleString()} kg</TableCell>
                          <TableCell className="text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <div className="w-10 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                <div className={cn("h-full rounded-full", p.utilization >= 80 ? "bg-emerald-500" : p.utilization >= 50 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${p.utilization}%` }} />
                              </div>
                              <span className="font-mono text-[9px]">{p.utilization}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono">{p.totalDistance} km</TableCell>
                          <TableCell className="text-[10px]">{p.estimatedDuration}h</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono">{fmtRupee(p.cost)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={(e) => { e.stopPropagation(); setSelectedPool(p) }}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 3: VEHICLES */}
          {activeTab === "vehicles" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Vehicle Type Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={vehicleTypeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="count" nameKey="name" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {vehicleTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Fuel Type Share</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={fuelDist} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="costShare" nameKey="type" label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {fuelDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Fleet Overview ({VEHICLES.length} Vehicles)</CardTitle></CardHeader><CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {VEHICLES.map((v) => (
                    <div key={v.id} className="pd-vehicle-card rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-teal-600 font-semibold">{v.id}</span>
                        <Badge className={cn("text-[8px] px-1", VEHICLE_BG[v.type] || "")}>{v.type}</Badge>
                      </div>
                      <div className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-1">{v.reg}</div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <div><span className="text-gray-500">Capacity:</span> <span className="font-semibold">{v.capacity.toLocaleString()} kg</span></div>
                        <div><span className="text-gray-500">Fuel:</span> <span className="font-semibold">{v.fuel}</span></div>
                        <div><span className="text-gray-500">Year:</span> <span className="font-semibold">{v.year}</span></div>
                        <div><span className="text-gray-500">Mileage:</span> <span className="font-semibold">{v.mileage.toLocaleString()} km</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>

              {/* Drivers */}
              <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Driver Pool ({DRIVERS.length} Drivers)</CardTitle></CardHeader><CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {DRIVERS.map((d) => (
                    <div key={d.id} className="pd-driver-card rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 flex items-center justify-center">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold">{d.name}</div>
                          <div className="text-[9px] text-gray-500">{d.id}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div><span className="text-gray-500">Phone:</span> <span className="font-mono">{d.phone}</span></div>
                        <div><span className="text-gray-500">License:</span> <span className="font-mono">{d.license.slice(-5)}</span></div>
                        <div><span className="text-gray-500">Rating:</span> <span className={cn("font-bold", d.rating >= 4.5 ? "text-emerald-600" : d.rating >= 4.0 ? "text-amber-600" : "text-red-600")}>{d.rating} ★</span></div>
                        <div><span className="text-gray-500">Trips:</span> <span className="font-semibold">{d.trips}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 4: SCHEDULING */}
          {activeTab === "scheduling" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { title: "Schedule Conflicts", val: String(scheduleConflicts.filter((s) => s.status !== "Resolved").length), cls: "pd-sched-conflict" },
                  { title: "Resolved Today", val: String(scheduleConflicts.filter((s) => s.status === "Resolved").length), cls: "pd-sched-resolved" },
                  { title: "Avg Fuel Efficiency", val: `${(pools.reduce((a, b) => a + b.fuelEfficiency, 0) / pools.length).toFixed(1)} km/L`, cls: "pd-sched-fuel" },
                  { title: "On-Time Rate", val: `${rInt(85, 96)}%`, cls: "pd-schedule-ontime" },
                ].map((s) => (
                  <div key={s.title} className={cn("rounded-xl p-4 border border-gray-200 dark:border-gray-700", s.cls)}>
                    <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">{s.title}</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{s.val}</div>
                  </div>
                ))}
              </div>

              <Card className="card-crud-lift pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Schedule Conflicts ({scheduleConflicts.length})</CardTitle></CardHeader><CardContent>
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader><TableRow>
                      <TableHead className="text-[10px]">ID</TableHead>
                      <TableHead className="text-[10px]">Pool 1</TableHead>
                      <TableHead className="text-[10px]">Pool 2</TableHead>
                      <TableHead className="text-[10px]">Vehicle</TableHead>
                      <TableHead className="text-[10px]">Conflict</TableHead>
                      <TableHead className="text-[10px]">Severity</TableHead>
                      <TableHead className="text-[10px]">Warehouse</TableHead>
                      <TableHead className="text-[10px]">Time</TableHead>
                      <TableHead className="text-[10px]">Status</TableHead>
                      <TableHead className="text-[10px]">Resolution</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {scheduleConflicts.map((c) => (
                        <TableRow key={c.id} className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20">
                          <TableCell className="text-[10px] font-mono">{c.id}</TableCell>
                          <TableCell className="text-[10px] font-mono">{c.pool1}</TableCell>
                          <TableCell className="text-[10px] font-mono">{c.pool2}</TableCell>
                          <TableCell className="text-[10px] font-mono">{c.vehicle}</TableCell>
                          <TableCell className="text-[11px]">{c.conflict}</TableCell>
                          <TableCell><Badge className={cn("text-[9px]", SEVERITY_COLORS[c.severity])}>{c.severity}</Badge></TableCell>
                          <TableCell className="text-[10px]">{c.warehouse}</TableCell>
                          <TableCell className="text-[10px] font-mono">{c.time}</TableCell>
                          <TableCell><Badge variant="outline" className={cn("text-[9px]",
                            c.status === "Open" ? "border-red-300 text-red-600"
                            : c.status === "Resolved" ? "border-emerald-300 text-emerald-600"
                            : c.status === "Escalated" ? "border-amber-300 text-amber-600" : ""
                          )}>{c.status}</Badge></TableCell>
                          <TableCell className="text-[10px] text-emerald-600">{c.resolution || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 5: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { title: "Avg Distance", val: `${Math.round(pools.reduce((a, b) => a + b.totalDistance, 0) / pools.length)} km`, sub: "Per pool" },
                  { title: "Avg Shipments/Pool", val: (pools.reduce((a, b) => a + b.totalShipments, 0) / pools.length).toFixed(1), sub: "Consolidation ratio" },
                  { title: "Cost/km", val: fmtRupee(Math.round(totalCost / pools.reduce((a, b) => a + b.totalDistance, 0))), sub: "Weighted average" },
                  { title: "Fuel Cost Share", val: `${Math.round(pools.reduce((a, b) => a + b.fuelCost, 0) / totalCost * 100)}%`, sub: "Of total logistics" },
                ].map((s) => (
                  <Card key={s.title} className="pd-analytics-card rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-[10px] font-medium text-gray-500 uppercase">{s.title}</div>
                    <div className="text-xl font-bold text-teal-700 dark:text-teal-400 mt-1">{s.val}</div>
                    <div className="text-[9px] text-gray-400">{s.sub}</div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Pool Volume & Cost Trend</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={monthlyPools}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="created" fill="#0d9488" radius={[4, 4, 0, 0]} name="Created" />
                    <Bar dataKey="delivered" fill="#10b981" radius={[4, 4, 0, 0]} name="Delivered" />
                    <Line type="monotone" dataKey="delayed" stroke="#f59e0b" strokeWidth={2} name="Delayed" />
                    <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} name="Cancelled" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost Components Trend</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><AreaChart data={monthlyCosts}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="fuel" stackId="a" stroke="#f59e0b" fill="#f59e0b20" name="Fuel" />
                    <Area type="monotone" dataKey="driver" stackId="a" stroke="#0d9488" fill="#0d948820" name="Driver Cost" />
                    <Area type="monotone" dataKey="toll" stackId="a" stroke="#6366f1" fill="#6366f120" name="Toll" />
                    <Area type="monotone" dataKey="maintenance" stackId="a" stroke="#ef4444" fill="#ef444420" name="Maintenance" />
                  </AreaChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Throughput</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><BarChart data={warehouseLoads}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="warehouse" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="dispatched" fill="#0d9488" stackId="s" name="Dispatched" />
                    <Bar dataKey="received" fill="#10b981" stackId="s" name="Received" />
                    <Bar dataKey="delayed" fill="#ef4444" stackId="s" name="Delayed" />
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="pd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={(() => {
                      const counts: Record<string, number> = {}
                      pools.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1 })
                      return Object.entries(counts).map(([name, count]) => ({ name, count }))
                    })()} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="count" nameKey="name" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {POOL_STATUSES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 9 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>
            </div>
          )}
        </Tabs>
      </div>

      {/* POOL DETAIL DRAWER */}
      {selectedPool && (
        <div className="pd-drawer-overlay" onClick={() => setSelectedPool(null)}>
          <div className="pd-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="pd-drawer-header">
              <div className={cn("pd-status-banner", selectedPool.status === "Delivered" ? "pd-banner-delivered" : selectedPool.status === "Delayed" ? "pd-banner-delayed" : selectedPool.status === "In Transit" ? "pd-banner-transit" : selectedPool.status === "Cancelled" ? "pd-banner-cancelled" : "pd-banner-default")}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedPool.id}</h3>
                    <p className="text-xs text-white/70">{selectedPool.route} · {selectedPool.priority}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => setSelectedPool(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="pd-drawer-content space-y-4">
              {/* Flow */}
              <div className="pd-flow-dots">
                {["Planned", "Dispatched", "In Transit", "Delivered"].map((step, i) => {
                  const statuses = ["Planned", "Dispatched", "In Transit", "Delivered"]
                  const activeIdx = (() => {
                    if (selectedPool.status === "Delivered" || selectedPool.status === "Partial Delivery") return 3
                    if (selectedPool.status === "In Transit") return 2
                    if (selectedPool.status === "Dispatched") return 1
                    return 0
                  })()
                  return (
                    <div key={step} className="flex items-center gap-1.5">
                      <div className={cn("pd-flow-dot", i <= activeIdx ? "pd-dot-active" : "pd-dot-inactive")} />
                      <span className={cn("text-[10px]", i <= activeIdx ? "text-teal-700 font-medium" : "text-gray-400")}>{step}</span>
                      {i < 3 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                    </div>
                  )
                })}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Vehicle", value: selectedPool.vehicle.reg, icon: Car },
                  { label: "Vehicle Type", value: selectedPool.vehicle.type, icon: Truck },
                  { label: "Driver", value: selectedPool.driver.name, icon: Users },
                  { label: "Driver Rating", value: `${selectedPool.driver.rating} ★`, icon: Star },
                  { label: "Origin", value: selectedPool.origin, icon: MapPin },
                  { label: "Destination", value: selectedPool.destination, icon: Navigation },
                  { label: "Total Shipments", value: String(selectedPool.totalShipments), icon: Package },
                  { label: "Total Weight", value: `${selectedPool.totalWeight.toLocaleString()} kg`, icon: Weight },
                  { label: "Distance", value: `${selectedPool.totalDistance} km`, icon: Route },
                  { label: "Est. Duration", value: `${selectedPool.estimatedDuration} hours`, icon: Clock },
                  { label: "Departure", value: selectedPool.departureTime, icon: Clock },
                  { label: "ETA", value: selectedPool.eta, icon: Calendar },
                ].map((info) => (
                  <div key={info.label} className="pd-info-item rounded-lg p-2.5 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <info.icon className="h-3 w-3 text-teal-500" />
                      <span className="text-[9px] text-gray-500 uppercase font-medium">{info.label}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">{info.value}</div>
                  </div>
                ))}
              </div>

              {/* Utilization */}
              <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-medium text-gray-500 uppercase mb-2">Vehicle Utilization</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", selectedPool.utilization >= 80 ? "bg-emerald-500" : selectedPool.utilization >= 50 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${selectedPool.utilization}%` }} />
                  </div>
                  <span className={cn("text-sm font-bold", selectedPool.utilization >= 80 ? "text-emerald-600" : selectedPool.utilization >= 50 ? "text-amber-600" : "text-red-600")}>{selectedPool.utilization}%</span>
                </div>
                <div className="text-[9px] text-gray-400 mt-1">{selectedPool.totalWeight.toLocaleString()} kg / {selectedPool.vehicle.capacity.toLocaleString()} kg capacity</div>
              </div>

              {/* Cost Breakdown */}
              <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-medium text-gray-500 uppercase mb-2">Cost Breakdown</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-bold text-teal-700">{fmtRupee(selectedPool.fuelCost)}</div>
                    <div className="text-[9px] text-gray-500">Fuel</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-indigo-600">{fmtRupee(selectedPool.tollCost)}</div>
                    <div className="text-[9px] text-gray-500">Toll</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-amber-600">{fmtRupee(selectedPool.driverCost)}</div>
                    <div className="text-[9px] text-gray-500">Driver</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{fmtRupee(selectedPool.cost)}</div>
                    <div className="text-[9px] text-gray-500">Total</div>
                  </div>
                </div>
              </div>

              {/* Duration */}
              {selectedPool.actualDuration !== null && (
                <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="text-[10px] font-medium text-gray-500 uppercase mb-2">Delivery Performance</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500">Estimated: </span>
                      <span className="text-[11px] font-semibold">{selectedPool.estimatedDuration}h</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <div>
                      <span className="text-[10px] text-gray-500">Actual: </span>
                      <span className={cn("text-[11px] font-bold", selectedPool.actualDuration <= selectedPool.estimatedDuration ? "text-emerald-600" : "text-red-600")}>{selectedPool.actualDuration}h</span>
                    </div>
                    <Badge className={cn("text-[9px]", selectedPool.actualDuration <= selectedPool.estimatedDuration ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                      {selectedPool.actualDuration <= selectedPool.estimatedDuration ? "On Time" : "Delayed"}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
