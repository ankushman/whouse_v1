"use client"

import { useState, Fragment } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Line,
} from "recharts"
import {
  Bus, Fuel, Gauge, MapPin, Navigation, Wrench, AlertTriangle, CheckCircle2,
  Clock, XCircle, DollarSign, Package, Truck,
  Phone, FileText, ArrowRight, CalendarDays, Route, Users, Zap,
  Search,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

// ─── Seed-based Deterministic Mock ──────────────────────────
const SEED = 145145
function sr(n: number): number {
  const x = Math.sin(SEED * 9301 + n * 49297 + 233280) * 10000
  return x - Math.floor(x)
}
function ri(n: number, min: number, max: number) { return Math.floor(sr(n) * (max - min + 1)) + min }

const WAREHOUSES = ["Mumbai DC", "Delhi NCR Hub", "Chennai Gateway", "Kolkata East", "Bengaluru South", "Hyderabad Central"]

const VEHICLE_TYPES = ["Heavy Truck", "Medium Truck", "Light Commercial", "Refrigerated", "Flatbed", "Tanker", "Container Carrier", "Pickup Van"]
const FUEL_TYPES = ["Diesel", "CNG", "Electric", "Petrol", "Hybrid"]
const STATUSES = ["Active", "Maintenance", "On Trip", "Idle", "Out of Service"] as const
const TRIP_STATUSES = ["In Transit", "Loading", "Unloading", "Completed", "Delayed", "Cancelled"] as const
const DRIVERS: Array<{ id: string; name: string; phone: string; license: string; rating: number; trips: number; expYears: number }> = [
  { id: "DRV001", name: "Rajesh Kumar", phone: "+91 98765 43210", license: "MH-04-20190012345", rating: 4.8, trips: 1247, expYears: 12 },
  { id: "DRV002", name: "Suresh Yadav", phone: "+91 87654 32109", license: "DL-08-20180098765", rating: 4.6, trips: 983, expYears: 10 },
  { id: "DRV003", name: "Anil Sharma", phone: "+91 76543 21098", license: "TN-04-20170056789", rating: 4.9, trips: 1562, expYears: 15 },
  { id: "DRV004", name: "Vijay Patil", phone: "+91 65432 10987", license: "KA-01-20190034567", rating: 4.5, trips: 876, expYears: 8 },
  { id: "DRV005", name: "Manoj Singh", phone: "+91 54321 09876", license: "WB-04-20200078901", rating: 4.7, trips: 1102, expYears: 11 },
  { id: "DRV006", name: "Ganesh Reddy", phone: "+91 43210 98765", license: "TS-08-20190011223", rating: 4.4, trips: 721, expYears: 7 },
  { id: "DRV007", name: "Pradeep Joshi", phone: "+91 32109 87654", license: "MH-12-20210044556", rating: 4.8, trips: 1345, expYears: 13 },
  { id: "DRV008", name: "Karthik Nair", phone: "+91 21098 76543", license: "KL-01-20180066778", rating: 4.6, trips: 1056, expYears: 9 },
  { id: "DRV009", name: "Deepak Gupta", phone: "+91 10987 65432", license: "HR-26-20190089900", rating: 4.3, trips: 654, expYears: 6 },
  { id: "DRV010", name: "Arjun Menon", phone: "+91 99887 76655", license: "KL-07-20200012334", rating: 4.9, trips: 1423, expYears: 14 },
]

const ROUTES: Array<{ id: string; from: string; to: string; distance: number; avgHours: number; tolls: number }> = [
  { id: "RT001", from: "Mumbai DC", to: "Delhi NCR Hub", distance: 1419, avgHours: 26, tolls: 3200 },
  { id: "RT002", from: "Mumbai DC", to: "Bengaluru South", distance: 984, avgHours: 18, tolls: 1800 },
  { id: "RT003", from: "Delhi NCR Hub", to: "Kolkata East", distance: 1492, avgHours: 28, tolls: 3500 },
  { id: "RT004", from: "Chennai Gateway", to: "Bengaluru South", distance: 368, avgHours: 7, tolls: 800 },
  { id: "RT005", from: "Hyderabad Central", to: "Mumbai DC", distance: 712, avgHours: 13, tolls: 1500 },
  { id: "RT006", from: "Kolkata East", to: "Chennai Gateway", distance: 1676, avgHours: 30, tolls: 3800 },
  { id: "RT007", from: "Bengaluru South", to: "Hyderabad Central", distance: 570, avgHours: 10, tolls: 1100 },
  { id: "RT008", from: "Delhi NCR Hub", to: "Hyderabad Central", distance: 1571, avgHours: 28, tolls: 3400 },
]

const INDIAN_CITIES: Array<{ name: string; lat: number; lng: number }> = [
  { name: "Mumbai", lat: 19.076, lng: 72.877 }, { name: "Delhi", lat: 28.704, lng: 77.102 },
  { name: "Chennai", lat: 13.082, lng: 80.270 }, { name: "Kolkata", lat: 22.572, lng: 88.363 },
  { name: "Bengaluru", lat: 12.971, lng: 77.594 }, { name: "Hyderabad", lat: 17.385, lng: 78.486 },
  { name: "Pune", lat: 18.520, lng: 73.856 }, { name: "Ahmedabad", lat: 23.022, lng: 72.571 },
  { name: "Jaipur", lat: 26.912, lng: 75.787 }, { name: "Lucknow", lat: 26.846, lng: 80.946 },
]

// ─── Generate Vehicles ──────────────────────────
const vehicles: Array<{
  id: string; regNo: string; type: string; make: string; model: string; year: number;
  capacity: number; fuelType: string; status: typeof STATUSES[number]; mileage: number;
  lastService: string; nextService: string; gpsEnabled: boolean; warehouse: string;
  insuranceExpiry: string; fitnessExpiry: string; pollutionCertExpiry: string;
  driver: typeof DRIVERS[number] | null; fuelLevel: number; batteryLevel: number;
}> = (() => {
  const makes = ["Tata", "Ashok Leyland", "Eicher", "Mahindra", "BharatBenz", "Isuzu", "Volvo Eicher", "Piaggio"]
  const arr: Array<typeof vehicles extends Array<infer T> ? T : never> = []
  for (let i = 0; i < 80; i++) {
    const type = VEHICLE_TYPES[ri(i * 3, 0, VEHICLE_TYPES.length - 1)]
    const make = makes[ri(i * 3 + 1, 0, makes.length - 1)]
    const fuel = FUEL_TYPES[ri(i * 3 + 2, 0, FUEL_TYPES.length - 1)]
    const status = STATUSES[ri(i * 3 + 3, 0, STATUSES.length - 1)]
    const wh = WAREHOUSES[ri(i * 3 + 4, 0, WAREHOUSES.length - 1)]
    const driver = status === "Active" || status === "On Trip" ? DRIVERS[ri(i * 3 + 5, 0, DRIVERS.length - 1)] : null
    const year = 2018 + ri(i * 3 + 6, 0, 7)
    arr.push({
      id: `VH${String(i + 1).padStart(4, "0")}`,
      regNo: `${["MH", "DL", "TN", "KA", "WB", "TS", "HR", "KL"][ri(i * 3 + 7, 0, 7)]}-${String(ri(i * 3 + 8, 1, 99)).padStart(2, "0")}-${String(ri(i * 3 + 9, 10, 99))}${String.fromCharCode(65 + ri(i * 3 + 10, 0, 25))}${String.fromCharCode(65 + ri(i * 3 + 11, 0, 25))}${String.fromCharCode(65 + ri(i * 3 + 12, 0, 25))}${String(ri(i * 3 + 13, 1000, 9999))}`,
      type, make, model: `${make} ${type.includes("Heavy") ? "LPT" : type.includes("Light") ? "Dost" : type.includes("Refrigerated") ? "Reefer" : type.includes("Tanker") ? "Tanker" : type.includes("Container") ? "Container" : type.includes("Pickup") ? "Bolero" : "Eicher"}`,
      year, capacity: [5, 10, 15, 20, 25, 30, 40][ri(i * 3 + 14, 0, 6)],
      fuelType: fuel, status, mileage: ri(i * 3 + 15, 20000, 350000),
      lastService: `2026-${String(ri(i * 3 + 16, 1, 6)).padStart(2, "0")}-${String(ri(i * 3 + 17, 1, 28)).padStart(2, "0")}`,
      nextService: `2026-${String(ri(i * 3 + 18, 7, 12)).padStart(2, "0")}-${String(ri(i * 3 + 19, 1, 28)).padStart(2, "0")}`,
      gpsEnabled: sr(i * 3 + 20) > 0.1, warehouse: wh,
      insuranceExpiry: `2027-${String(ri(i * 3 + 21, 1, 12)).padStart(2, "0")}-${String(ri(i * 3 + 22, 1, 28)).padStart(2, "0")}`,
      fitnessExpiry: `2027-${String(ri(i * 3 + 23, 1, 12)).padStart(2, "0")}-${String(ri(i * 3 + 24, 1, 28)).padStart(2, "0")}`,
      pollutionCertExpiry: `2026-${String(ri(i * 3 + 25, 8, 12)).padStart(2, "0")}-${String(ri(i * 3 + 26, 1, 28)).padStart(2, "0")}`,
      driver, fuelLevel: ri(i * 3 + 27, 10, 100), batteryLevel: fuel === "Electric" ? ri(i * 3 + 28, 15, 95) : 0,
    })
  }
  return arr
})()

// ─── Generate Trips ──────────────────────────
const trips: Array<{
  id: string; vehicleId: string; vehicleReg: string; driver: typeof DRIVERS[number];
  route: typeof ROUTES[number]; departure: string; eta: string; status: typeof TRIP_STATUSES[number];
  stops: number; distanceCovered: number; fuelUsed: number; cargoWeight: number;
  cargoType: string; tollsPaid: number; delayReason: string | null;
}> = (() => {
  const cargoTypes = ["FMCG", "Electronics", "Pharmaceuticals", "Textiles", "Auto Parts", "Agriculture", "Chemicals", "Consumer Goods"]
  const delayReasons = ["Traffic congestion", "Road closure", "Vehicle breakdown", "Weather conditions", "Late loading", "Documentation delay", null, null, null, null]
  const arr: Array<typeof trips extends Array<infer T> ? T : never> = []
  for (let i = 0; i < 100; i++) {
    const route = ROUTES[ri(i * 4, 0, ROUTES.length - 1)]
    const status = TRIP_STATUSES[ri(i * 4 + 1, 0, TRIP_STATUSES.length - 1)]
    const driver = DRIVERS[ri(i * 4 + 2, 0, DRIVERS.length - 1)]
    const veh = vehicles[ri(i * 4 + 3, 0, vehicles.length - 1)]
    const delay = delayReasons[ri(i * 4 + 4, 0, delayReasons.length - 1)]
    arr.push({
      id: `TRP${String(i + 1).padStart(4, "0")}`,
      vehicleId: veh.id, vehicleReg: veh.regNo, driver, route,
      departure: `2026-07-${String(ri(i * 4 + 5, 1, 28)).padStart(2, "0")} ${String(ri(i * 4 + 6, 5, 18)).padStart(2, "0")}:${String(ri(i * 4 + 7, 0, 59)).padStart(2, "0")}`,
      eta: `2026-07-${String(ri(i * 4 + 8, 1, 28)).padStart(2, "0")} ${String(ri(i * 4 + 9, 5, 22)).padStart(2, "0")}:${String(ri(i * 4 + 10, 0, 59)).padStart(2, "0")}`,
      status, stops: ri(i * 4 + 11, 0, 5),
      distanceCovered: Math.round(route.distance * (sr(i * 4 + 12) * 0.5 + status === "Completed" ? 0.5 : sr(i * 4 + 12) * 0.3)),
      fuelUsed: Math.round(route.distance * (0.15 + sr(i * 4 + 13) * 0.1)),
      cargoWeight: ri(i * 4 + 14, 500, 25000), cargoType: cargoTypes[ri(i * 4 + 15, 0, cargoTypes.length - 1)],
      tollsPaid: route.tolls, delayReason: status === "Delayed" ? delay : null,
    })
  }
  return arr
})()

// ─── Generate Maintenance Records ──────────────────────────
const maintenanceRecords: Array<{
  id: string; vehicleId: string; vehicleReg: string; type: string; description: string;
  cost: number; status: string; scheduledDate: string; completedDate: string | null;
  vendor: string; priority: string;
}> = (() => {
  const types = ["Scheduled Service", "Oil Change", "Brake Replacement", "Tire Rotation", "Engine Repair", "AC Repair", "Battery Replacement", "Transmission Service", "Electrical Repair", "Body Work"]
  const vendors = ["Tata Motors Service", "Ashok Leyland Service Center", "Mahindra First Choice", " Bosch Service Center", "Castrol Pitstop", "TVS Logistics Workshop", "Daimler Service Hub", "Local Workshop"]
  const arr: Array<typeof maintenanceRecords extends Array<infer T> ? T : never> = []
  for (let i = 0; i < 50; i++) {
    const veh = vehicles[ri(i * 3, 0, vehicles.length - 1)]
    const type = types[ri(i * 3 + 1, 0, types.length - 1)]
    const statusVal = ["Completed", "In Progress", "Scheduled", "Completed", "Pending"][ri(i * 3 + 2, 0, 4)]
    arr.push({
      id: `MNT${String(i + 1).padStart(4, "0")}`, vehicleId: veh.id, vehicleReg: veh.regNo,
      type, description: `${type} for ${veh.regNo} — ${veh.make} ${veh.model}`,
      cost: [1500, 2500, 5000, 8000, 12000, 18000, 25000, 35000, 45000, 65000][ri(i * 3 + 3, 0, 9)],
      status: statusVal,
      scheduledDate: `2026-${String(ri(i * 3 + 4, 1, 12)).padStart(2, "0")}-${String(ri(i * 3 + 5, 1, 28)).padStart(2, "0")}`,
      completedDate: statusVal === "Completed" ? `2026-${String(ri(i * 3 + 6, 1, 7)).padStart(2, "0")}-${String(ri(i * 3 + 7, 1, 28)).padStart(2, "0")}` : null,
      vendor: vendors[ri(i * 3 + 8, 0, vendors.length - 1)],
      priority: ["Low", "Medium", "High", "Critical"][ri(i * 3 + 9, 0, 3)],
    })
  }
  return arr
})()

// ─── Generate Fuel Logs ──────────────────────────
const fuelLogs: Array<{
  id: string; vehicleId: string; vehicleReg: string; fuelType: string; quantity: number;
  costPerLitre: number; totalCost: number; station: string; odometer: number;
  date: string; driver: typeof DRIVERS[number];
}> = (() => {
  const stations = ["Indian Oil", "HPCL", "BPCL", "Shell", "Reliance Petrol", "Essar Petrol Pump", "Adani Total Gas", "GAIL CNG Station"]
  const arr: Array<typeof fuelLogs extends Array<infer T> ? T : never> = []
  for (let i = 0; i < 60; i++) {
    const veh = vehicles[ri(i * 2, 0, vehicles.length - 1)]
    const qty = [20, 40, 60, 80, 100, 120, 150, 200][ri(i * 2 + 1, 0, 7)]
    const cpl = veh.fuelType === "CNG" ? 55 + sr(i * 2 + 2) * 10 : veh.fuelType === "Electric" ? 8 + sr(i * 2 + 3) * 4 : 75 + sr(i * 2 + 4) * 15
    arr.push({
      id: `FUL${String(i + 1).padStart(4, "0")}`, vehicleId: veh.id, vehicleReg: veh.regNo,
      fuelType: veh.fuelType, quantity: qty, costPerLitre: Math.round(cpl * 100) / 100,
      totalCost: Math.round(qty * cpl), station: stations[ri(i * 2 + 5, 0, stations.length - 1)],
      odometer: veh.mileage + ri(i * 2 + 6, 100, 5000),
      date: `2026-07-${String(ri(i * 2 + 7, 1, 28)).padStart(2, "0")}`,
      driver: DRIVERS[ri(i * 2 + 8, 0, DRIVERS.length - 1)],
    })
  }
  return arr
})()

// ─── Theme Constants ──────────────────────────
const THEME = {
  primary: "#0d9488",   // teal-600
  secondary: "#6366f1", // indigo-500
  accent: "#f97316",   // orange-500
  success: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
}

const STATUS_COLORS: Record<string, string> = {
  "Active": "#22c55e",
  "Maintenance": "#eab308",
  "On Trip": "#3b82f6",
  "Idle": "#94a3b8",
  "Out of Service": "#ef4444",
}

const TRIP_STATUS_COLORS: Record<string, string> = {
  "In Transit": "#3b82f6",
  "Loading": "#f97316",
  "Unloading": "#a855f7",
  "Completed": "#22c55e",
  "Delayed": "#ef4444",
  "Cancelled": "#6b7280",
}

const FUEL_COLORS: Record<string, string> = {
  "Diesel": "#1e293b",
  "CNG": "#22c55e",
  "Electric": "#3b82f6",
  "Petrol": "#ef4444",
  "Hybrid": "#a855f7",
}

const CHART_COLORS = [THEME.primary, THEME.secondary, THEME.accent, THEME.success, THEME.warning, THEME.danger, "#8b5cf6", "#ec4899"]

const TABS = ["Dashboard", "Fleet", "Trips", "Maintenance", "Fuel & Analytics"] as const
type TabName = typeof TABS[number]

// ─── Dashboard KPI Data ──────────────────────────
const kpiData = (() => {
  const activeCount = vehicles.filter(v => v.status === "Active" || v.status === "On Trip").length
  const onTripCount = vehicles.filter(v => v.status === "On Trip").length
  const maintCount = vehicles.filter(v => v.status === "Maintenance").length
  const totalCapacity = vehicles.reduce((s, v) => s + v.capacity, 0)
  const avgFuelEff = vehicles.reduce((s, v) => s + (100 / (v.mileage / 1000 * 0.15 + 3)), 0) / vehicles.length
  const delayedTrips = trips.filter(t => t.status === "Delayed").length
  return { activeCount, onTripCount, maintCount, totalCapacity, avgFuelEff: Math.round(avgFuelEff * 10) / 10, delayedTrips }
})()

// ─── Chart Data ──────────────────────────
const vehicleStatusChartData = (() => {
  const map: Record<string, number> = {}
  vehicles.forEach(v => { map[v.status] = (map[v.status] || 0) + 1 })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
})()

const vehicleTypeChartData = (() => {
  const map: Record<string, number> = {}
  vehicles.forEach(v => { map[v.type] = (map[v.type] || 0) + 1 })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
})()

const fuelTypeChartData = (() => {
  const map: Record<string, number> = {}
  vehicles.forEach(v => { map[v.fuelType] = (map[v.fuelType] || 0) + 1 })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
})()

const warehouseFleetChartData = WAREHOUSES.map(wh => {
  const count = vehicles.filter(v => v.warehouse === wh).length
  const active = vehicles.filter(v => v.warehouse === wh && (v.status === "Active" || v.status === "On Trip")).length
  return { warehouse: wh.replace(" DC", "").replace(" Hub", "").replace(" Gateway", "").replace(" East", "").replace(" South", "").replace(" Central", ""), total: count, active }
})

const monthlyTripChartData = [
  { month: "Jan", trips: 142, onTime: 128, delayed: 14 },
  { month: "Feb", trips: 156, onTime: 141, delayed: 15 },
  { month: "Mar", trips: 168, onTime: 155, delayed: 13 },
  { month: "Apr", trips: 134, onTime: 119, delayed: 15 },
  { month: "May", trips: 178, onTime: 164, delayed: 14 },
  { month: "Jun", trips: 192, onTime: 180, delayed: 12 },
  { month: "Jul", trips: 186, onTime: 172, delayed: 14 },
]

const dailyCostChartData = Array.from({ length: 14 }, (_, i) => ({
  day: `Jul ${i + 15}`,
  fuel: Math.round(35000 + sr(i * 7) * 20000),
  maintenance: Math.round(8000 + sr(i * 7 + 1) * 12000),
  tolls: Math.round(5000 + sr(i * 7 + 2) * 8000),
}))

const alertsData = [
  { id: "ALT001", type: "warning", title: "VH0042 Insurance Expiring", desc: "Insurance expires in 7 days", time: "2h ago" },
  { id: "ALT002", type: "danger", title: "VH0018 Overdue Service", desc: "Scheduled service overdue by 5 days", time: "3h ago" },
  { id: "ALT003", type: "warning", title: "TRP0087 Delayed — Traffic", desc: "Mumbai-Pune expressway congestion", time: "4h ago" },
  { id: "ALT004", type: "info", title: "VH0065 Fuel Low", desc: "Diesel below 15% capacity", time: "5h ago" },
  { id: "ALT005", type: "danger", title: "TRP0092 Vehicle Breakdown", desc: "Engine failure on NH-44, driver stranded", time: "6h ago" },
  { id: "ALT006", type: "info", title: "PUC Cert Expiring — 5 Vehicles", desc: "Pollution certificates expiring this week", time: "8h ago" },
]

// ─── Maintenance Analytics ──────────────────────────
const maintByTypeChartData = (() => {
  const map: Record<string, number> = {}
  maintenanceRecords.forEach(m => { map[m.type] = (map[m.type] || 0) + 1 })
  return Object.entries(map).map(([name, count]) => ({ name, count }))
})()

const maintCostByWarehouseChartData = WAREHOUSES.map(wh => {
  const vehIds = vehicles.filter(v => v.warehouse === wh).map(v => v.id)
  const cost = maintenanceRecords.filter(m => vehIds.includes(m.vehicleId)).reduce((s, m) => s + m.cost, 0)
  return { warehouse: wh.replace(" DC", "").replace(" Hub", "").replace(" Gateway", "").replace(" East", "").replace(" South", "").replace(" Central", ""), cost }
})

// ─── Fuel Analytics ──────────────────────────
const fuelConsumptionByWarehouseChartData = WAREHOUSES.map(wh => {
  const vehIds = vehicles.filter(v => v.warehouse === wh).map(v => v.id)
  const total = fuelLogs.filter(f => vehIds.includes(f.vehicleId)).reduce((s, f) => s + f.totalCost, 0)
  return { warehouse: wh.replace(" DC", "").replace(" Hub", "").replace(" Gateway", "").replace(" East", "").replace(" South", "").replace(" Central", ""), cost: total }
})

const fuelEfficiencyChartData = FUEL_TYPES.map(ft => {
  const fVehicles = vehicles.filter(v => v.fuelType === ft)
  const avgMileage = fVehicles.length > 0 ? Math.round(fVehicles.reduce((s, v) => s + v.mileage, 0) / fVehicles.length / 100) : 0
  return { fuelType: ft, kmPerUnit: avgMileage || 0 }
})

const driverPerformanceChartData = DRIVERS.slice(0, 8).map(d => {
  const dTrips = trips.filter(t => t.driver.id === d.id)
  const completed = dTrips.filter(t => t.status === "Completed").length
  const delayed = dTrips.filter(t => t.status === "Delayed").length
  return { name: d.name.split(" ")[0], completed, delayed, rating: d.rating }
})

// ─── Custom Tooltip ──────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="vft-tooltip">
      <p className="vft-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="vft-tooltip-value" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── Main Component ──────────────────────────
export default function VehicleFleetTransportView() {
  const [activeTab, setActiveTab] = useState<TabName>("Dashboard")
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[number] | null>(null)
  const [selectedTrip, setSelectedTrip] = useState<typeof trips[number] | null>(null)
  const [vehicleSearch, setVehicleSearch] = useState("")
  const [tripStatusFilter, setTripStatusFilter] = useState<string>("All")
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<string>("All")

  const filteredVehicles = vehicles.filter(v => {
    if (vehicleStatusFilter !== "All" && v.status !== vehicleStatusFilter) return false
    if (vehicleSearch && !v.regNo.toLowerCase().includes(vehicleSearch.toLowerCase()) && !v.make.toLowerCase().includes(vehicleSearch.toLowerCase()) && !v.type.toLowerCase().includes(vehicleSearch.toLowerCase())) return false
    return true
  })

  const filteredTrips = trips.filter(t => {
    if (tripStatusFilter !== "All" && t.status !== tripStatusFilter) return false
    return true
  })

  return (
    <div className="vft-root">
      {/* ─── Header ─── */}
      <div className="vft-header">
        <div className="vft-header-left">
          <div className="vft-header-icon">
            <Bus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="vft-header-title">Vehicle Fleet & Transport Management</h1>
            <p className="vft-header-subtitle">Indian Warehouse Network — {vehicles.length} Vehicles | {trips.length} Active Trips | {ROUTES.length} Routes</p>
          </div>
        </div>
        <div className="vft-header-actions">
          <Badge className="badge-interactive vft-badge-live"><span className="vft-pulse-dot" /> Live Tracking: {vehicles.filter(v => v.status === "On Trip").length} On Road</Badge>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="vft-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`vft-tab ${activeTab === tab ? "vft-tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─── */}
      <div className="vft-content">
        {activeTab === "Dashboard" && (
          <DashboardTab
            onSelectVehicle={setSelectedVehicle}
            onSelectTrip={setSelectedTrip}
          />
        )}
        {activeTab === "Fleet" && (
          <FleetTab
            vehicles={filteredVehicles}
            onSelect={setSelectedVehicle}
            search={vehicleSearch}
            onSearchChange={setVehicleSearch}
            statusFilter={vehicleStatusFilter}
            onStatusFilterChange={setVehicleStatusFilter}
          />
        )}
        {activeTab === "Trips" && (
          <TripsTab
            trips={filteredTrips}
            onSelect={setSelectedTrip}
            statusFilter={tripStatusFilter}
            onStatusFilterChange={setTripStatusFilter}
          />
        )}
        {activeTab === "Maintenance" && (
          <MaintenanceTab
            records={maintenanceRecords}
            onSelectVehicle={(regNo) => {
              const v = vehicles.find(vv => vv.regNo === regNo)
              if (v) setSelectedVehicle(v)
            }}
          />
        )}
        {activeTab === "Fuel & Analytics" && (
          <FuelAnalyticsTab
            onSelectVehicle={setSelectedVehicle}
            onSelectTrip={setSelectedTrip}
          />
        )}
      </div>

      {/* ─── Vehicle Detail Drawer ─── */}
      <Sheet open={!!selectedVehicle} onOpenChange={(open) => { if (!open) setSelectedVehicle(null) }}>
        <SheetContent className="vft-drawer">
          {selectedVehicle && <VehicleDetailDrawer vehicle={selectedVehicle} />}
        </SheetContent>
      </Sheet>

      {/* ─── Trip Detail Drawer ─── */}
      <Sheet open={!!selectedTrip} onOpenChange={(open) => { if (!open) setSelectedTrip(null) }}>
        <SheetContent className="vft-drawer">
          {selectedTrip && <TripDetailDrawer trip={selectedTrip} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ─── Dashboard Tab ──────────────────────────
function DashboardTab({ onSelectVehicle, onSelectTrip }: { onSelectVehicle: (v: typeof vehicles[number]) => void; onSelectTrip: (t: typeof trips[number]) => void }) {
  return (
    <div className="vft-tab-content">
      {/* KPIs */}
      <div className="vft-kpi-grid">
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.primary}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.primary}20`, color: THEME.primary }}><Bus className="h-5 w-5" /></div>
          <div className="vft-kpi-value">{kpiData.activeCount}</div>
          <div className="vft-kpi-label">Active Vehicles</div>
          <div className="vft-kpi-change vft-up">+3 this week</div>
        </div>
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.secondary}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.secondary}20`, color: THEME.secondary }}><Navigation className="h-5 w-5" /></div>
          <div className="vft-kpi-value">{kpiData.onTripCount}</div>
          <div className="vft-kpi-label">On Road</div>
          <div className="vft-kpi-change vft-up">{Math.round(kpiData.onTripCount / kpiData.activeCount * 100)}% utilization</div>
        </div>
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.accent}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.accent}20`, color: THEME.accent }}><Wrench className="h-5 w-5" /></div>
          <div className="vft-kpi-value">{kpiData.maintCount}</div>
          <div className="vft-kpi-label">In Maintenance</div>
          <div className="vft-kpi-change vft-down">-2 vs last week</div>
        </div>
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.success}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.success}20`, color: THEME.success }}><Package className="h-5 w-5" /></div>
          <div className="vft-kpi-value">{kpiData.totalCapacity}</div>
          <div className="vft-kpi-label">Total Capacity (tons)</div>
          <div className="vft-kpi-change">Across all vehicles</div>
        </div>
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.warning}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.warning}20`, color: THEME.warning }}><Fuel className="h-5 w-5" /></div>
          <div className="vft-kpi-value">{kpiData.avgFuelEff}</div>
          <div className="vft-kpi-label">Avg Fuel Eff (km/L)</div>
          <div className="vft-kpi-change vft-down">-0.3 vs last month</div>
        </div>
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.danger}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.danger}20`, color: THEME.danger }}><AlertTriangle className="h-5 w-5" /></div>
          <div className="vft-kpi-value">{kpiData.delayedTrips}</div>
          <div className="vft-kpi-label">Delayed Trips</div>
          <div className="vft-kpi-change vft-down">Need attention</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="vft-chart-grid-2">
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><Route className="h-4 w-4" /> Monthly Trip Volume</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><ComposedChart data={monthlyTripChartData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip content={<CustomTooltip />} /><Legend /><Bar dataKey="onTime" name="On-Time" fill={THEME.primary} radius={[4, 4, 0, 0]} /><Bar dataKey="delayed" name="Delayed" fill={THEME.danger} radius={[4, 4, 0, 0]} /><Line dataKey="trips" name="Total" stroke={THEME.secondary} strokeWidth={2} dot={{ fill: THEME.secondary }} /></ComposedChart></div></CardContent></Card>
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><Bus className="h-4 w-4" /> Fleet by Status</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><PieChart><Pie data={vehicleStatusChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{vehicleStatusChartData.map((_, idx) => { const tc = CHART_COLORS; return <Cell key={idx} fill={tc[idx % tc.length]} /> })}</Pie><Tooltip content={<CustomTooltip />} /></PieChart></div></CardContent></Card>
      </div>

      {/* Charts Row 2 */}
      <div className="vft-chart-grid-3">
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><Truck className="h-4 w-4" /> Vehicle Types</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><PieChart><Pie data={vehicleTypeChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}>{vehicleTypeChartData.map((_, idx) => { const tc = CHART_COLORS; return <Cell key={idx} fill={tc[idx % tc.length]} /> })}</Pie><Tooltip content={<CustomTooltip />} /></PieChart></div></CardContent></Card>
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><Fuel className="h-4 w-4" /> Fuel Type Distribution</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><PieChart><Pie data={fuelTypeChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{fuelTypeChartData.map((_, idx) => { const tc = [FUEL_COLORS["Diesel"], FUEL_COLORS["CNG"], FUEL_COLORS["Electric"], FUEL_COLORS["Petrol"], FUEL_COLORS["Hybrid"]]; return <Cell key={idx} fill={tc[idx % tc.length]} /> })}</Pie><Tooltip content={<CustomTooltip />} /></PieChart></div></CardContent></Card>
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><Gauge className="h-4 w-4" /> Fleet by Warehouse</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><BarChart data={warehouseFleetChartData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="warehouse" tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v: string) => v.slice(0, 6)} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip content={<CustomTooltip />} /><Legend /><Bar dataKey="total" name="Total" fill={THEME.primary} radius={[4, 4, 0, 0]} /><Bar dataKey="active" name="Active" fill={THEME.success} radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
      </div>

      {/* Active Trips Table + Alerts */}
      <div className="vft-chart-grid-2">
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><Navigation className="h-4 w-4" /> Recent Trips</CardTitle></CardHeader><CardContent>
          <div className="vft-table-wrap">
            <table className="vft-table">
              <thead><tr><th>ID</th><th>Route</th><th>Driver</th><th>Status</th><th>Progress</th></tr></thead>
              <tbody>
                {trips.filter(t => t.status === "In Transit" || t.status === "Delayed").slice(0, 8).map(trip => (
                  <tr key={trip.id} className="vft-table-row" onClick={() => onSelectTrip(trip)}>
                    <td className="vft-mono">{trip.id}</td>
                    <td>{trip.route.from.replace(" DC", "").replace(" Hub", "")} → {trip.route.to.replace(" DC", "").replace(" Hub", "")}</td>
                    <td>{trip.driver.name}</td>
                    <td><Badge className="badge-interactive vft-status-badge" style={{ background: `${TRIP_STATUS_COLORS[trip.status]}20`, color: TRIP_STATUS_COLORS[trip.status] }}>{trip.status}</Badge></td>
                    <td><div className="vft-progress-cell"><Progress value={Math.round(trip.distanceCovered / trip.route.distance * 100)} className="vft-progress" /><span className="vft-progress-text">{Math.round(trip.distanceCovered / trip.route.distance * 100)}%</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent></Card>

        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><AlertTriangle className="h-4 w-4" /> Fleet Alerts</CardTitle></CardHeader><CardContent>
          <div className="vft-alerts-list">
            {alertsData.map(alert => (
              <div key={alert.id} className={`vft-alert-item vft-alert-${alert.type}`}>
                <div className="vft-alert-icon">
                  {alert.type === "danger" ? <AlertTriangle className="h-4 w-4" /> : alert.type === "warning" ? <Clock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </div>
                <div className="vft-alert-content">
                  <div className="vft-alert-title">{alert.title}</div>
                  <div className="vft-alert-desc">{alert.desc}</div>
                </div>
                <div className="vft-alert-time">{alert.time}</div>
              </div>
            ))}
          </div>
        </CardContent></Card>
      </div>
    </div>
  )
}

// ─── Fleet Tab ──────────────────────────
function FleetTab({ vehicles: vList, onSelect, search, onSearchChange, statusFilter, onStatusFilterChange }: {
  vehicles: typeof vehicles; onSelect: (v: typeof vehicles[number]) => void;
  search: string; onSearchChange: (s: string) => void;
  statusFilter: string; onStatusFilterChange: (s: string) => void;
}) {
  const uniqueStatuses = ["All", ...STATUSES]
  return (
    <div className="vft-tab-content">
      {/* Status Filters */}
      <div className="vft-filter-bar">
        {uniqueStatuses.map(s => (
          <button key={s} className={`vft-filter-btn ${statusFilter === s ? "vft-filter-active" : ""}`} style={statusFilter === s ? { background: STATUS_COLORS[s] || THEME.primary, color: "#fff" } : {}} onClick={() => onStatusFilterChange(s)}>
            {s} {s !== "All" && <span className="vft-filter-count">{vehicles.filter(v => v.status === s).length}</span>}
          </button>
        ))}
        <div className="vft-search-box">
          <input type="text" className="vft-search-input" placeholder="Search by reg no, make, type..." value={search} onChange={e => onSearchChange(e.target.value)} />
          <Search className="h-4 w-4 vft-search-icon" />
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="vft-vehicle-grid">
        {vList.slice(0, 24).map(v => (
          <div key={v.id} className="vft-vehicle-card" onClick={() => onSelect(v)}>
            <div className="vft-vehicle-card-header" style={{ background: `linear-gradient(135deg, ${STATUS_COLORS[v.status]}30, ${STATUS_COLORS[v.status]}10)` }}>
              <div className="vft-vehicle-reg">{v.regNo}</div>
              <Badge className="badge-interactive vft-vehicle-status-badge" style={{ background: `${STATUS_COLORS[v.status]}20`, color: STATUS_COLORS[v.status] }}>{v.status}</Badge>
            </div>
            <div className="vft-vehicle-card-body">
              <div className="vft-vehicle-info-row"><Bus className="h-4 w-4" style={{ color: THEME.primary }} /><span>{v.make} {v.model}</span></div>
              <div className="vft-vehicle-info-row"><Truck className="h-4 w-4" style={{ color: THEME.secondary }} /><span>{v.type} • {v.year}</span></div>
              <div className="vft-vehicle-info-row"><Fuel className="h-4 w-4" style={{ color: FUEL_COLORS[v.fuelType] }} /><span>{v.fuelType} • {v.capacity} tons</span></div>
              <div className="vft-vehicle-info-row"><MapPin className="h-4 w-4" style={{ color: THEME.accent }} /><span>{v.warehouse}</span></div>
              <div className="vft-vehicle-fuel-bar">
                <div className="vft-fuel-label">Fuel: {v.fuelLevel}%</div>
                <Progress value={v.fuelLevel} className="vft-fuel-progress" style={{ "--progress-color": v.fuelLevel < 20 ? THEME.danger : THEME.primary } as React.CSSProperties} />
              </div>
              {v.driver && (
                <div className="vft-vehicle-driver">
                  <Users className="h-3.5 w-3.5" />
                  <span>{v.driver.name}</span>
                  <Badge className="badge-interactive vft-rating-badge" style={{ background: THEME.warning + "20", color: THEME.warning }}>{v.driver.rating}</Badge>
                </div>
              )}
              <div className="vft-vehicle-meta">
                <span>{(v.mileage / 1000).toFixed(0)}k km</span>
                <span>GPS: {v.gpsEnabled ? <CheckCircle2 className="h-3 w-3 inline text-green-400" /> : <XCircle className="h-3 w-3 inline text-red-400" />}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="vft-result-count">Showing {Math.min(vList.length, 24)} of {vList.length} vehicles</div>
    </div>
  )
}

// ─── Trips Tab ──────────────────────────
function TripsTab({ trips: tList, onSelect, statusFilter, onStatusFilterChange }: {
  trips: typeof trips; onSelect: (t: typeof trips[number]) => void;
  statusFilter: string; onStatusFilterChange: (s: string) => void;
}) {
  const uniqueStatuses = ["All", ...TRIP_STATUSES]
  return (
    <div className="vft-tab-content">
      {/* Status Filters */}
      <div className="vft-filter-bar">
        {uniqueStatuses.map(s => (
          <button key={s} className={`vft-filter-btn ${statusFilter === s ? "vft-filter-active" : ""}`} style={statusFilter === s ? { background: TRIP_STATUS_COLORS[s] || THEME.primary, color: "#fff" } : {}} onClick={() => onStatusFilterChange(s)}>
            {s} {s !== "All" && <span className="vft-filter-count">{trips.filter(t => t.status === s).length}</span>}
          </button>
        ))}
      </div>

      {/* Trip Table */}
      <Card className="vft-card">
        <CardContent className="glass-subtle vft-card-content">
          <div className="vft-table-wrap">
            <table className="vft-table">
              <thead>
                <tr>
                  <th>Trip ID</th><th>Route</th><th>Vehicle</th><th>Driver</th>
                  <th>Cargo</th><th>Departure</th><th>ETA</th><th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tList.slice(0, 30).map(trip => (
                  <tr key={trip.id} className="vft-table-row" onClick={() => onSelect(trip)}>
                    <td className="vft-mono">{trip.id}</td>
                    <td>
                      <div className="vft-route-cell">
                        <span>{trip.route.from.replace(" DC", "").replace(" Hub", "")}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{trip.route.to.replace(" DC", "").replace(" Hub", "")}</span>
                      </div>
                      <span className="vft-route-dist">{trip.route.distance} km</span>
                    </td>
                    <td className="vft-mono">{trip.vehicleReg}</td>
                    <td>{trip.driver.name}</td>
                    <td>
                      <Badge className="badge-interactive vft-cargo-badge" style={{ background: `${THEME.secondary}20`, color: THEME.secondary }}>{trip.cargoType}</Badge>
                      <span className="vft-cargo-weight">{trip.cargoWeight} kg</span>
                    </td>
                    <td className="vft-mono vft-sm">{trip.departure.split(" ")[1]}</td>
                    <td className="vft-mono vft-sm">{trip.eta.split(" ")[1]}</td>
                    <td>
                      <div className="vft-progress-cell">
                        <Progress value={Math.round(trip.distanceCovered / trip.route.distance * 100)} className="vft-progress" />
                        <span className="vft-progress-text">{Math.round(trip.distanceCovered / trip.route.distance * 100)}%</span>
                      </div>
                    </td>
                    <td>
                      <Badge className="badge-interactive vft-status-badge" style={{ background: `${TRIP_STATUS_COLORS[trip.status]}20`, color: TRIP_STATUS_COLORS[trip.status] }}>
                        {trip.status}
                      </Badge>
                      {trip.status === "Delayed" && trip.delayReason && (
                        <span className="vft-delay-reason">{trip.delayReason}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="vft-result-count">Showing {Math.min(tList.length, 30)} of {tList.length} trips</div>
    </div>
  )
}

// ─── Maintenance Tab ──────────────────────────
function MaintenanceTab({ records, onSelectVehicle }: {
  records: typeof maintenanceRecords; onSelectVehicle: (regNo: string) => void;
}) {
  const summaryCards = [
    { label: "Total Records", value: records.length, icon: Wrench, color: THEME.primary },
    { label: "Completed", value: records.filter(r => r.status === "Completed").length, icon: CheckCircle2, color: THEME.success },
    { label: "In Progress", value: records.filter(r => r.status === "In Progress").length, icon: Clock, color: THEME.warning },
    { label: "Scheduled", value: records.filter(r => r.status === "Scheduled").length, icon: CalendarDays, color: THEME.secondary },
    { label: "Total Cost", value: records.reduce((s, r) => s + r.cost, 0), icon: DollarSign, color: THEME.accent, format: true },
    { label: "Critical", value: records.filter(r => r.priority === "Critical").length, icon: AlertTriangle, color: THEME.danger },
  ]

  const priorityColors: Record<string, string> = { "Low": "#94a3b8", "Medium": "#3b82f6", "High": "#f97316", "Critical": "#ef4444" }
  const statusColors: Record<string, string> = { "Completed": "#22c55e", "In Progress": "#3b82f6", "Scheduled": "#a855f7", "Pending": "#eab308" }

  return (
    <div className="vft-tab-content">
      {/* Summary Cards */}
      <div className="vft-summary-grid">
        {summaryCards.map((sc, i) => (
          <div key={i} className="vft-summary-card" style={{ borderTop: `3px solid ${sc.color}` }}>
            <div className="vft-summary-icon" style={{ background: `${sc.color}20`, color: sc.color }}><sc.icon className="h-5 w-5" /></div>
            <div className="vft-summary-value">{sc.format ? `₹${sc.value.toLocaleString("en-IN")}` : sc.value}</div>
            <div className="vft-summary-label">{sc.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="vft-chart-grid-2">
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title">Maintenance by Type</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><BarChart data={maintByTypeChartData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis dataKey="name" type="category" width={120} tick={{ fill: "#94a3b8", fontSize: 11 }} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="count" fill={THEME.primary} radius={[0, 4, 4, 0]} /></BarChart></div></CardContent></Card>
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title">Cost by Warehouse (₹)</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><BarChart data={maintCostByWarehouseChartData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="warehouse" tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v: string) => v.slice(0, 6)} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="cost" fill={THEME.accent} radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
      </div>

      {/* Records Table */}
      <Card className="vft-card">
        <CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><Wrench className="h-4 w-4" /> Maintenance Records</CardTitle></CardHeader>
        <CardContent className="glass-subtle vft-card-content">
          <div className="vft-table-wrap">
            <table className="vft-table">
              <thead><tr><th>ID</th><th>Vehicle</th><th>Type</th><th>Vendor</th><th>Scheduled</th><th>Completed</th><th>Cost</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {records.slice(0, 25).map(rec => (
                  <tr key={rec.id} className="vft-table-row" onClick={() => onSelectVehicle(rec.vehicleReg)}>
                    <td className="vft-mono">{rec.id}</td>
                    <td className="vft-mono">{rec.vehicleReg}</td>
                    <td>{rec.type}</td>
                    <td>{rec.vendor}</td>
                    <td className="vft-mono vft-sm">{rec.scheduledDate}</td>
                    <td className="vft-mono vft-sm">{rec.completedDate || "—"}</td>
                    <td className="vft-mono">₹{rec.cost.toLocaleString("en-IN")}</td>
                    <td><Badge className="badge-interactive vft-priority-badge" style={{ background: `${priorityColors[rec.priority]}20`, color: priorityColors[rec.priority] }}>{rec.priority}</Badge></td>
                    <td><Badge className="badge-interactive vft-status-badge" style={{ background: `${statusColors[rec.status]}20`, color: statusColors[rec.status] }}>{rec.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Fuel & Analytics Tab ──────────────────────────
function FuelAnalyticsTab({ onSelectVehicle, onSelectTrip }: {
  onSelectVehicle: (v: typeof vehicles[number]) => void; onSelectTrip: (t: typeof trips[number]) => void;
}) {
  const totalFuelCost = fuelLogs.reduce((s, f) => s + f.totalCost, 0)
  const avgCostPerKm = fuelLogs.reduce((s, f) => s + f.costPerLitre, 0) / fuelLogs.length
  const topFuelStations = (() => {
    const map: Record<string, number> = {}
    fuelLogs.forEach(f => { map[f.station] = (map[f.station] || 0) + f.totalCost })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
  })()

  return (
    <div className="vft-tab-content">
      {/* KPIs */}
      <div className="vft-kpi-grid vft-kpi-grid-4">
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.primary}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.primary}20`, color: THEME.primary }}><Fuel className="h-5 w-5" /></div>
          <div className="vft-kpi-value">₹{totalFuelCost.toLocaleString("en-IN")}</div>
          <div className="vft-kpi-label">Total Fuel Cost (Jul)</div>
        </div>
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.secondary}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.secondary}20`, color: THEME.secondary }}><Gauge className="h-5 w-5" /></div>
          <div className="vft-kpi-value">₹{avgCostPerKm.toFixed(2)}</div>
          <div className="vft-kpi-label">Avg Cost/Litre</div>
        </div>
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.accent}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.accent}20`, color: THEME.accent }}><DollarSign className="h-5 w-5" /></div>
          <div className="vft-kpi-value">₹{Math.round(totalFuelCost / 30).toLocaleString("en-IN")}</div>
          <div className="vft-kpi-label">Daily Average</div>
        </div>
        <div className="vft-kpi" style={{ borderTop: `3px solid ${THEME.success}` }}>
          <div className="vft-kpi-icon" style={{ background: `${THEME.success}20`, color: THEME.success }}><Zap className="h-5 w-5" /></div>
          <div className="vft-kpi-value">{vehicles.filter(v => v.fuelType === "CNG" || v.fuelType === "Electric" || v.fuelType === "Hybrid").length}</div>
          <div className="vft-kpi-label">Green Fleet Vehicles</div>
        </div>
      </div>

      {/* Charts */}
      <div className="vft-chart-grid-2">
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title">Daily Cost Breakdown</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><AreaChart data={dailyCostChartData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} /><Tooltip content={<CustomTooltip />} /><Legend /><Area dataKey="fuel" name="Fuel" fill={THEME.primary} fillOpacity={0.6} stroke={THEME.primary} /><Area dataKey="maintenance" name="Maintenance" fill={THEME.accent} fillOpacity={0.6} stroke={THEME.accent} /><Area dataKey="tolls" name="Tolls" fill={THEME.secondary} fillOpacity={0.6} stroke={THEME.secondary} /></AreaChart></div></CardContent></Card>
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title">Fuel Cost by Warehouse</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><BarChart data={fuelConsumptionByWarehouseChartData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="warehouse" tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v: string) => v.slice(0, 6)} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="cost" fill={THEME.primary} radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
      </div>

      <div className="vft-chart-grid-2">
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title">Fuel Efficiency by Type</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><BarChart data={fuelEfficiencyChartData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="fuelType" tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="kmPerUnit" name="km per litre" fill={THEME.secondary} radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
        <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><Users className="h-4 w-4" /> Driver Performance</CardTitle></CardHeader><CardContent><div className="vft-chart-container"><BarChart data={driverPerformanceChartData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip content={<CustomTooltip />} /><Legend /><Bar dataKey="completed" name="Completed" fill={THEME.success} radius={[4, 4, 0, 0]} /><Bar dataKey="delayed" name="Delayed" fill={THEME.danger} radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
      </div>

      {/* Top Fuel Stations */}
      <Card className="vft-card"><CardHeader className="vft-card-header"><CardTitle className="vft-card-title"><Fuel className="h-4 w-4" /> Top Fuel Stations by Spend</CardTitle></CardHeader><CardContent>
        <div className="vft-stations-grid">
          {topFuelStations.map(([station, cost], i) => (
            <div key={i} className="vft-station-item">
              <div className="vft-station-rank">#{i + 1}</div>
              <div className="vft-station-info"><div className="vft-station-name">{station}</div><div className="vft-station-cost">₹{cost.toLocaleString("en-IN")}</div></div>
              <div className="vft-station-bar"><Progress value={Math.round(cost / topFuelStations[0][1] * 100)} className="vft-progress" /></div>
            </div>
          ))}
        </div>
      </CardContent></Card>
    </div>
  )
}

// ─── Vehicle Detail Drawer ──────────────────────────
function VehicleDetailDrawer({ vehicle }: { vehicle: typeof vehicles[number] }) {
  const gradientMap: Record<string, string> = {
    "Active": `linear-gradient(135deg, ${THEME.success}, ${THEME.primary})`,
    "Maintenance": `linear-gradient(135deg, ${THEME.warning}, ${THEME.accent})`,
    "On Trip": `linear-gradient(135deg, ${THEME.secondary}, #3b82f6)`,
    "Idle": `linear-gradient(135deg, #64748b, #475569)`,
    "Out of Service": `linear-gradient(135deg, ${THEME.danger}, #991b1b)`,
  }
  const gradient = gradientMap[vehicle.status] || gradientMap["Active"]

  return (
    <ScrollArea className="h-full">
      <div className="vft-drawer-inner">
        {/* Header */}
        <div className="vft-drawer-header" style={{ background: gradient }}>
          <div className="vft-drawer-header-row">
            <div>
              <div className="vft-drawer-reg">{vehicle.regNo}</div>
              <div className="vft-drawer-make">{vehicle.make} {vehicle.model}</div>
            </div>
            <Badge className="badge-interactive vft-drawer-status" style={{ background: `${STATUS_COLORS[vehicle.status]}30`, color: "#fff" }}>{vehicle.status}</Badge>
          </div>
          <div className="vft-drawer-badges">
<div className="chip-group">
            <Badge className="badge-interactive vft-drawer-type-badge" style={{ background: `${THEME.secondary}30`, color: "#fff" }}>{vehicle.type}</Badge>
            <Badge className="badge-interactive vft-drawer-fuel-badge" style={{ background: `${FUEL_COLORS[vehicle.fuelType]}30`, color: "#fff" }}>{vehicle.fuelType}</Badge>
            {vehicle.gpsEnabled && <Badge className="badge-interactive vft-drawer-gps-badge" style={{ background: "#22c55e30", color: "#fff" }}>GPS</Badge>}
</div>
          </div>
        </div>

        {/* Lifecycle Flow */}
        <div className="vft-drawer-lifecycle">
          {["Purchased", "Active", "Maintenance", "Retired"].map((step, i) => {
            const isActive = (step === "Active" && vehicle.status === "Active") || (step === "Active" && vehicle.status === "On Trip") || (step === "Active" && vehicle.status === "Idle") || (step === "Maintenance" && vehicle.status === "Maintenance") || (step === "Retired" && vehicle.status === "Out of Service")
            return (
              <Fragment key={step}>
                <div className={`vft-lifecycle-step ${isActive ? "vft-lifecycle-active" : ""}`}>
                  <div className="vft-lifecycle-dot" style={isActive ? { background: THEME.primary } : {}} />
                  <span className="vft-lifecycle-text">{step}</span>
                </div>
                {i < 3 && <div className="vft-lifecycle-line" />}
              </Fragment>
            )
          })}
        </div>

        {/* Info Grid */}
        <div className="vft-drawer-section-title">Vehicle Information</div>
        <div className="vft-drawer-info-grid">
          <div className="vft-info-item"><span className="vft-info-label">Year</span><span className="vft-info-value">{vehicle.year}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Capacity</span><span className="vft-info-value">{vehicle.capacity} tons</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Mileage</span><span className="vft-info-value">{(vehicle.mileage / 1000).toFixed(0)}k km</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Fuel Level</span><span className="vft-info-value">{vehicle.fuelLevel}%</span></div>
          {vehicle.fuelType === "Electric" && (
            <div className="vft-info-item"><span className="vft-info-label">Battery</span><span className="vft-info-value">{vehicle.batteryLevel}%</span></div>
          )}
          <div className="vft-info-item"><span className="vft-info-label">Warehouse</span><span className="vft-info-value">{vehicle.warehouse}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Insurance</span><span className="vft-info-value">{vehicle.insuranceExpiry}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Fitness Cert</span><span className="vft-info-value">{vehicle.fitnessExpiry}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">PUC Cert</span><span className="vft-info-value">{vehicle.pollutionCertExpiry}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Last Service</span><span className="vft-info-value">{vehicle.lastService}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Next Service</span><span className="vft-info-value">{vehicle.nextService}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">GPS</span><span className="vft-info-value">{vehicle.gpsEnabled ? "Enabled" : "Disabled"}</span></div>
        </div>

        {/* Driver */}
        {vehicle.driver && (
          <>
            <div className="vft-drawer-section-title">Assigned Driver</div>
            <div className="vft-drawer-driver-card">
              <div className="vft-driver-avatar"><Users className="h-6 w-6" /></div>
              <div className="vft-driver-details">
                <div className="vft-driver-name">{vehicle.driver.name}</div>
                <div className="vft-driver-meta-row">
                  <span><Phone className="h-3 w-3" /> {vehicle.driver.phone}</span>
                  <Badge className="badge-interactive vft-rating-badge" style={{ background: THEME.warning + "20", color: THEME.warning }}>{vehicle.driver.rating}</Badge>
                </div>
                <div className="vft-driver-meta-row"><span>{vehicle.driver.license}</span></div>
                <div className="vft-driver-meta-row"><span>{vehicle.driver.trips} trips • {vehicle.driver.expYears} yrs exp</span></div>
              </div>
            </div>
          </>
        )}

        {/* Compliance */}
        <div className="vft-drawer-section-title">Compliance Status</div>
        <div className="vft-compliance-grid">
          {[
            { label: "Insurance", expiry: vehicle.insuranceExpiry, ok: new Date(vehicle.insuranceExpiry) > new Date("2026-08-15") },
            { label: "Fitness", expiry: vehicle.fitnessExpiry, ok: new Date(vehicle.fitnessExpiry) > new Date("2026-08-15") },
            { label: "PUC", expiry: vehicle.pollutionCertExpiry, ok: new Date(vehicle.pollutionCertExpiry) > new Date("2026-08-15") },
          ].map((item, i) => (
            <div key={i} className="vft-compliance-item" style={{ borderLeft: `3px solid ${item.ok ? THEME.success : THEME.danger}` }}>
              <div className="vft-compliance-label">{item.label}</div>
              <div className="vft-compliance-expiry">{item.expiry}</div>
              <Badge className="badge-interactive vft-compliance-badge" style={{ background: `${item.ok ? THEME.success : THEME.danger}20`, color: item.ok ? THEME.success : THEME.danger }}>
                {item.ok ? "Valid" : "Expiring Soon"}
              </Badge>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="vft-drawer-actions">
          <Button className="vft-action-btn" style={{ background: THEME.primary, color: "#fff" }}><Navigation className="h-4 w-4" /> Track Live</Button>
          <Button className="vft-action-btn" style={{ background: THEME.secondary, color: "#fff" }}><Wrench className="h-4 w-4" /> Schedule Service</Button>
          <Button className="btn-outline-animate vft-action-btn" variant="outline"><FileText className="h-4 w-4" /> Documents</Button>
          <Button className="btn-outline-animate vft-action-btn" variant="outline"><Fuel className="h-4 w-4" /> Fuel Log</Button>
        </div>
      </div>
    </ScrollArea>
  )
}

// ─── Trip Detail Drawer ──────────────────────────
function TripDetailDrawer({ trip }: { trip: typeof trips[number] }) {
  const gradientMap: Record<string, string> = {
    "In Transit": `linear-gradient(135deg, ${THEME.secondary}, #3b82f6)`,
    "Loading": `linear-gradient(135deg, ${THEME.accent}, #ea580c)`,
    "Unloading": `linear-gradient(135deg, #a855f7, #7c3aed)`,
    "Completed": `linear-gradient(135deg, ${THEME.success}, #16a34a)`,
    "Delayed": `linear-gradient(135deg, ${THEME.danger}, #991b1b)`,
    "Cancelled": `linear-gradient(135deg, #64748b, #475569)`,
  }
  const progress = Math.round(trip.distanceCovered / trip.route.distance * 100)

  return (
    <ScrollArea className="h-full">
      <div className="vft-drawer-inner">
        {/* Header */}
        <div className="vft-drawer-header" style={{ background: gradientMap[trip.status] || gradientMap["In Transit"] }}>
          <div className="vft-drawer-header-row">
            <div>
              <div className="vft-drawer-reg">{trip.id}</div>
              <div className="vft-drawer-make">{trip.route.from} → {trip.route.to}</div>
            </div>
            <Badge className="badge-interactive vft-drawer-status" style={{ background: "#ffffff30", color: "#fff" }}>{trip.status}</Badge>
          </div>
          {trip.delayReason && (
            <div className="vft-drawer-delay"><AlertTriangle className="h-4 w-4" /> Delay: {trip.delayReason}</div>
          )}
        </div>

        {/* Trip Flow */}
        <div className="vft-drawer-lifecycle">
          {["Dispatched", "In Transit", "Arrived", "Unloading", "Completed"].map((step, i) => {
            const stepsArr = ["Dispatched", "In Transit", "Arrived", "Unloading", "Completed"]
            const statusIndex = stepsArr.indexOf(trip.status === "Loading" ? "Dispatched" : trip.status === "Cancelled" ? "Dispatched" : trip.status)
            const isActive = i <= statusIndex
            return (
              <Fragment key={step}>
                <div className={`vft-lifecycle-step ${isActive ? "vft-lifecycle-active" : ""}`}>
                  <div className="vft-lifecycle-dot" style={isActive ? { background: THEME.primary } : {}} />
                  <span className="vft-lifecycle-text">{step}</span>
                </div>
                {i < 4 && <div className="vft-lifecycle-line" />}
              </Fragment>
            )
          })}
        </div>

        {/* Progress */}
        <div className="vft-drawer-progress-section">
          <div className="vft-drawer-progress-header">
            <span>Trip Progress</span>
            <span className="vft-drawer-progress-pct">{progress}%</span>
          </div>
          <Progress value={progress} className="vft-drawer-progress-bar" />
          <div className="vft-drawer-progress-detail">{trip.distanceCovered} / {trip.route.distance} km covered</div>
        </div>

        {/* Info Grid */}
        <div className="vft-drawer-section-title">Trip Details</div>
        <div className="vft-drawer-info-grid">
          <div className="vft-info-item"><span className="vft-info-label">Vehicle</span><span className="vft-info-value">{trip.vehicleReg}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Route ID</span><span className="vft-info-value">{trip.route.id}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Distance</span><span className="vft-info-value">{trip.route.distance} km</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Est. Duration</span><span className="vft-info-value">{trip.route.avgHours} hrs</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Stops</span><span className="vft-info-value">{trip.stops}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Fuel Used</span><span className="vft-info-value">{trip.fuelUsed} L</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Departure</span><span className="vft-info-value">{trip.departure}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">ETA</span><span className="vft-info-value">{trip.eta}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Tolls</span><span className="vft-info-value">₹{trip.tollsPaid.toLocaleString("en-IN")}</span></div>
          <div className="vft-info-item"><span className="vft-info-label">Cargo</span><span className="vft-info-value">{trip.cargoType} ({trip.cargoWeight} kg)</span></div>
        </div>

        {/* Driver */}
        <div className="vft-drawer-section-title">Driver</div>
        <div className="vft-drawer-driver-card">
          <div className="vft-driver-avatar"><Users className="h-6 w-6" /></div>
          <div className="vft-driver-details">
            <div className="vft-driver-name">{trip.driver.name}</div>
            <div className="badge-interactive vft-driver-meta-row"><span><Phone className="h-3 w-3" /> {trip.driver.phone}</span><Badge className="vft-rating-badge" style={{ background: THEME.warning + "20", color: THEME.warning }}>{trip.driver.rating}</Badge></div>
            <div className="vft-driver-meta-row"><span>License: {trip.driver.license}</span></div>
            <div className="vft-driver-meta-row"><span>{trip.driver.trips} trips • {trip.driver.expYears} yrs exp</span></div>
          </div>
        </div>

        {/* Route Details */}
        <div className="vft-drawer-section-title">Route Summary</div>
        <div className="vft-route-summary">
          <div className="vft-route-point"><div className="vft-route-dot" style={{ background: THEME.primary }} /><div><div className="vft-route-name">{trip.route.from}</div></div></div>
          <div className="vft-route-line-container"><div className="vft-route-line" /><span>{trip.route.distance} km • ~{trip.route.avgHours} hrs • ₹{trip.route.tolls.toLocaleString("en-IN")} tolls</span></div>
          <div className="vft-route-point"><div className="vft-route-dot" style={{ background: THEME.accent }} /><div><div className="vft-route-name">{trip.route.to}</div></div></div>
        </div>

        {/* Actions */}
        <div className="vft-drawer-actions">
          <Button className="vft-action-btn" style={{ background: THEME.primary, color: "#fff" }}><Navigation className="h-4 w-4" /> Track Live</Button>
          <Button className="vft-action-btn" style={{ background: THEME.accent, color: "#fff" }}><Phone className="h-4 w-4" /> Call Driver</Button>
          <Button className="btn-outline-animate vft-action-btn" variant="outline"><AlertTriangle className="h-4 w-4" /> Report Issue</Button>
          <Button className="btn-outline-animate vft-action-btn" variant="outline"><FileText className="h-4 w-4" /> E-Way Bill</Button>
        </div>
      </div>
    </ScrollArea>
  )
}
