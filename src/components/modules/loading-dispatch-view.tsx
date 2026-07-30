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
  ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis,
} from "recharts"
import {
  Search, Truck, Clock, Star, Eye, X, Send,
  Package, ArrowUpRight, ArrowDownRight, IndianRupee,
  Gauge, Users, Fuel, Timer, LayoutGrid, CheckCircle2,
  FileCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Seed-based data generation
// ─────────────────────────────────────────────────────────────────────────────
function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(134134)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"] as const
const DOCKS = ["Dock D1", "Dock D2", "Dock D3", "Dock D4", "Dock D5", "Dock D6", "Dock D7", "Dock D8"] as const
const VEHICLE_TYPES = ["20ft Container", "40ft Container", "Trailer Truck", "Flatbed", "Refrigerated", "Tanker", "Mini Truck", "Delivery Van"] as const
const DISPATCH_STATUSES = ["Scheduled", "Staging", "Loading", "Quality Check", "Sealed", "Dispatched", "In Transit", "Delivered"] as const
const LOAD_PRIORITIES = ["Critical", "High", "Medium", "Low"] as const
const LOAD_TYPES = ["FCL (Full Container)", "LTL (Less Than Truckload)", "Pallet Ship", "Parcel/Courier", "Bulk Liquid", "Oversized"] as const

const PRODUCTS = [
  { sku: "F&B-1001", name: "Basmati Rice 25kg", cat: "Food", weight: 25.5, value: 2450 },
  { sku: "F&B-1002", name: "Turmeric Powder 500g", cat: "Food", weight: 0.6, value: 180 },
  { sku: "F&B-1003", name: "Organic Tea 1kg", cat: "Food", weight: 1.2, value: 1250 },
  { sku: "PHR-2001", name: "Paracetamol 500mg", cat: "Pharma", weight: 0.3, value: 350 },
  { sku: "PHR-2004", name: "ORS Sachets 100pc", cat: "Pharma", weight: 5.0, value: 780 },
  { sku: "PHR-2007", name: "Cough Syrup 200ml", cat: "Pharma", weight: 0.3, value: 290 },
  { sku: "ELC-3001", name: "LED Panel 2x2ft", cat: "Electronics", weight: 3.5, value: 3200 },
  { sku: "ELC-3005", name: "Power Bank 20000mAh", cat: "Electronics", weight: 0.4, value: 1800 },
  { sku: "AUT-4002", name: "Brake Pad Set", cat: "Auto Parts", weight: 4.8, value: 4500 },
  { sku: "AUT-4003", name: "Engine Oil 5L", cat: "Auto Parts", weight: 5.2, value: 1650 },
  { sku: "TXT-6001", name: "Cotton Fabric Roll", cat: "Textile", weight: 12.0, value: 5800 },
  { sku: "IND-5006", name: "Electrical Cable 2.5mm", cat: "Industrial", weight: 2.8, value: 680 },
]

const DRIVERS = [
  { id: "DRV-001", name: "Suresh Patel", license: "MH-01-2023001", phone: "+91-9876543210", warehouse: "Mumbai Hub", vehicle: "MH-01-AB-1234", vehicleType: "40ft Container", rating: 4.8 },
  { id: "DRV-002", name: "Rajesh Kumar", license: "DL-05-2022015", phone: "+91-9876543211", warehouse: "Delhi NCR", vehicle: "DL-05-CD-5678", vehicleType: "Trailer Truck", rating: 4.5 },
  { id: "DRV-003", name: "Mohan Das", license: "TN-09-2023012", phone: "+91-9876543212", warehouse: "Chennai DC", vehicle: "TN-09-EF-9012", vehicleType: "20ft Container", rating: 4.9 },
  { id: "DRV-004", name: "Arjun Reddy", license: "KA-03-2023008", phone: "+91-9876543213", warehouse: "Bangalore South", vehicle: "KA-03-GH-3456", vehicleType: "Refrigerated", rating: 4.3 },
  { id: "DRV-005", name: "Vikram Singh", license: "WB-07-2022004", phone: "+91-9876543214", warehouse: "Kolkata Hub", vehicle: "WB-07-IJ-7890", vehicleType: "Flatbed", rating: 4.6 },
  { id: "DRV-006", name: "Amit Joshi", license: "MH-12-2023019", phone: "+91-9876543215", warehouse: "Pune West", vehicle: "MH-12-KL-2345", vehicleType: "Tanker", rating: 4.7 },
  { id: "DRV-007", name: "Pradeep Nair", license: "KL-08-2023006", phone: "+91-9876543216", warehouse: "Chennai DC", vehicle: "KL-08-MN-6789", vehicleType: "40ft Container", rating: 4.4 },
  { id: "DRV-008", name: "Ravi Shankar", license: "MH-04-2022022", phone: "+91-9876543217", warehouse: "Mumbai Hub", vehicle: "MH-04-OP-0123", vehicleType: "Mini Truck", rating: 4.1 },
  { id: "DRV-009", name: "Sanjay Gupta", license: "HR-26-2023011", phone: "+91-9876543218", warehouse: "Delhi NCR", vehicle: "HR-26-QR-4567", vehicleType: "Delivery Van", rating: 4.2 },
  { id: "DRV-010", name: "Krishnan Iyer", license: "TN-04-2023017", phone: "+91-9876543219", warehouse: "Bangalore South", vehicle: "TN-04-ST-8901", vehicleType: "Trailer Truck", rating: 4.8 },
]

const CUSTOMERS = [
  { id: "CUST-001", name: "BigBasket Distribution", city: "Bangalore", state: "Karnataka", distance: 980 },
  { id: "CUST-002", name: "Reliance Fresh", city: "Mumbai", state: "Maharashtra", distance: 0 },
  { id: "CUST-003", name: "DMart Supply Chain", city: "Pune", state: "Maharashtra", distance: 150 },
  { id: "CUST-004", name: "Apollo Pharmacy", city: "Chennai", state: "Tamil Nadu", distance: 0 },
  { id: "CUST-005", name: "Metro Cash & Carry", city: "Kolkata", state: "West Bengal", distance: 0 },
  { id: "CUST-006", name: "Spencer's Retail", city: "Hyderabad", state: "Telangana", distance: 1250 },
  { id: "CUST-007", name: "More Supermarket", city: "Delhi", state: "Delhi NCR", distance: 1400 },
  { id: "CUST-008", name: "Vijay Sales", city: "Ahmedabad", state: "Gujarat", distance: 520 },
]

const PIE_COLORS = ["#0ea5e9", "#f43f5e", "#475569", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899"]
const VEHICLE_COLORS = ["#0ea5e9", "#6366f1", "#f59e0b", "#f43f5e", "#06b6d4", "#8b5cf6", "#10b981", "#ec4899"]
const COST_COLORS = ["#f43f5e", "#f59e0b", "#0ea5e9", "#475569"]
const MONTHS = ["Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26"]

// ─────────────────────────────────────────────────────────────────────────────
// Helper: format ₹
// ─────────────────────────────────────────────────────────────────────────────
const fmtRupee = (v: number) => `\u20b9${v.toLocaleString("en-IN")}`

// ─────────────────────────────────────────────────────────────────────────────
// Generate 100 dispatch records
// ─────────────────────────────────────────────────────────────────────────────
type DispatchRecord = {
  id: string
  vehicle: string
  vehicleType: string
  vehicleTypeIdx: number
  driver: typeof DRIVERS[0]
  customer: typeof CUSTOMERS[0]
  dock: string
  loadType: string
  loadTypeIdx: number
  priority: string
  status: string
  pallets: number
  weightTons: number
  volumeCbm: number
  valueInr: number
  eta: string
  scheduledTime: string
  startTime: string | null
  dispatchTime: string | null
  distance: number
  speed: number
}

const dispatchRecords: DispatchRecord[] = (() => {
  const recs: DispatchRecord[] = []
  for (let i = 0; i < 100; i++) {
    const driver = pick(DRIVERS)
    const customer = pick(CUSTOMERS)
    const vehicleType = pick(VEHICLE_TYPES)
    const loadType = pick(LOAD_TYPES)
    const status = pick(DISPATCH_STATUSES)
    const priority = pick(LOAD_PRIORITIES)
    const pallets = Math.floor(rand() * 40) + 4
    const weightTons = +(pallets * (0.3 + rand() * 1.2)).toFixed(1)
    const volumeCbm = +(pallets * (1.5 + rand() * 3)).toFixed(1)
    const baseValue = Math.floor(pallets * (500 + rand() * 3000))
    const hour = String(Math.floor(rand() * 14) + 5).padStart(2, "0")
    const min = String(Math.floor(rand() * 60)).padStart(2, "0")
    const sched = `2026-07-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}T${hour}:${min}`
    const dist = customer.distance === 0 ? Math.floor(rand() * 1500) + 200 : customer.distance
    const vtIdx = VEHICLE_TYPES.indexOf(vehicleType as never)
    const ltIdx = LOAD_TYPES.indexOf(loadType as never)
    recs.push({
      id: `DSP-${String(i + 1001).padStart(4, "0")}`,
      vehicle: driver.vehicle,
      vehicleType,
      vehicleTypeIdx: vtIdx >= 0 ? vtIdx : 0,
      driver,
      customer,
      dock: pick(DOCKS),
      loadType,
      loadTypeIdx: ltIdx >= 0 ? ltIdx : 0,
      priority,
      status,
      pallets,
      weightTons,
      volumeCbm,
      valueInr: baseValue,
      eta: sched,
      scheduledTime: sched,
      startTime: status !== "Scheduled" ? sched : null,
      dispatchTime: ["Dispatched", "In Transit", "Delivered"].includes(status) ? sched : null,
      distance: dist,
      speed: +(40 + rand() * 50).toFixed(0) as unknown as number,
    })
  }
  return recs
})()

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard data (generated once)
// ─────────────────────────────────────────────────────────────────────────────
const dailyTrend = (() => {
  const days: Array<{ day: string; dispatched: number; onTimeRate: number }> = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 6, i + 1)
    days.push({
      day: `${String(d.getDate()).padStart(2, "0")} Jul`,
      dispatched: Math.floor(rand() * 40) + 60,
      onTimeRate: +(rand() * 8 + 89).toFixed(1),
    })
  }
  return days
})()

const vehicleTypeDist = VEHICLE_TYPES.map((vt) => ({
  name: vt,
  value: dispatchRecords.filter((r) => r.vehicleType === vt).length,
}))

const warehousePerf = WAREHOUSES.map((wh) => ({
  warehouse: wh.replace(" Hub", "").replace(" DC", "").replace(" NCR", "").replace(" South", "").replace(" West", ""),
  dispatches: Math.floor(rand() * 50) + 60,
  avgLoadTime: Math.floor(rand() * 25) + 25,
}))

const loadTypeDist = LOAD_TYPES.map((lt) => {
  const short = lt.includes("(") ? lt.split("(")[0].trim() : lt
  return { name: short, value: dispatchRecords.filter((r) => r.loadType === lt).length }
})

const driverPerf = DRIVERS.map((d) => {
  const trips = Math.floor(rand() * 20) + 5
  const avgLoad = Math.floor(rand() * 25) + 25
  const onTime = +(rand() * 10 + 88).toFixed(1)
  return { driverId: d.id, driverName: d.name, vehicle: d.vehicle, license: d.license, warehouse: d.warehouse, trips, avgLoad, onTime, rating: d.rating }
})

// Dock data
const dockData = DOCKS.map((dock, idx) => {
  const occupied = idx < 6
  const driver = occupied ? pick(DRIVERS) : null
  const loadType = occupied ? pick(LOAD_TYPES) : null
  const priority = occupied ? pick(LOAD_PRIORITIES) : null
  const customer = occupied ? pick(CUSTOMERS) : null
  const utilization = occupied ? +(rand() * 40 + 55).toFixed(0) : 0
  const startHour = String(Math.floor(rand() * 4) + 6).padStart(2, "0")
  const startMin = String(Math.floor(rand() * 60)).padStart(2, "0")
  const estH = String(Math.floor(rand() * 3) + 1 + parseInt(startHour)).padStart(2, "0")
  const estM = String(Math.floor(rand() * 60)).padStart(2, "0")
  return {
    dock,
    status: idx === 7 ? "Maintenance" : (occupied ? "Occupied" : "Available"),
    vehicle: driver?.vehicle ?? "—",
    driver: driver?.name ?? "—",
    loadType: loadType ?? "—",
    destination: customer ? `${customer.city}, ${customer.state}` : "—",
    startTime: occupied ? `${startHour}:${startMin}` : "—",
    estCompletion: occupied ? `${estH}:${estM}` : "—",
    priority,
    utilization: Number(utilization),
  }
})

// Vehicle & driver tracking data
const vehicleScatter = (() => {
  const pts: Array<{ x: number; y: number; z: number; name: string }> = []
  for (let i = 0; i < 18; i++) {
    pts.push({
      x: +(rand() * 60 + 40).toFixed(0),
      y: +(rand() * 80 + 20).toFixed(0),
      z: Math.floor(rand() * 25) + 5,
      name: DRIVERS[i % DRIVERS.length].vehicle,
    })
  }
  return pts
})()

const starDist = (() => {
  const counts = [0, 0, 0, 0, 0]
  DRIVERS.forEach((d) => { const s = Math.round(d.rating) - 1; counts[s >= 0 && s < 5 ? s : 4]++ })
  return [5, 4, 3, 2, 1].map((star) => ({ stars: `${star}`, count: counts[star - 1] }))
})()

const activeDispatches = dispatchRecords.filter((r) => r.status === "In Transit" || r.status === "Dispatched").slice(0, 15)

// Analytics data
const costTrend = MONTHS.map((m) => ({
  month: m,
  fuel: Math.floor(rand() * 30000) + 180000,
  toll: Math.floor(rand() * 10000) + 40000,
  labor: Math.floor(rand() * 15000) + 60000,
  overhead: Math.floor(rand() * 8000) + 25000,
}))

const destPerformance = CUSTOMERS.map((c) => ({
  destination: c.name.split(" ")[0],
  onTime: +(rand() * 12 + 86).toFixed(1),
  damageFree: +(rand() * 8 + 90).toFixed(1),
  costEfficiency: +(rand() * 15 + 78).toFixed(1),
}))

const exceptionTypes = ["Damage", "Delay", "Wrong Docs", "Missing Items", "Weight Mismatch"]
const rootCauses = ["Improper packaging", "Traffic congestion", "Manual entry error", "Picking error", "Scale calibration", "Route deviation", "Weather conditions", "Driver fatigue", "System glitch", "Handover delay"]
const actions = ["Repack and reship", "Expedite delivery", "Issue corrected docs", "Re-pick and ship", "Recalibrate and verify", "Reassign route", "Reschedule dispatch", "Driver rotation", "System restart", "Process retraining"]

const exceptions = (() => {
  const rows: Array<{ type: string; count: number; pct: string; trend: "up" | "down"; rootCause: string; action: string; cost: number; priority: string }> = []
  for (let i = 0; i < 30; i++) {
    const type = pick(exceptionTypes)
    const count = Math.floor(rand() * 20) + 1
    const total = 450
    rows.push({
      type,
      count,
      pct: `${(count / total * 100).toFixed(1)}%`,
      trend: rand() > 0.5 ? "up" as const : "down" as const,
      rootCause: pick(rootCauses),
      action: pick(actions),
      cost: Math.floor(rand() * 15000) + 500,
      priority: pick(LOAD_PRIORITIES),
    })
  }
  return rows
})()

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_BADGE_CLS: Record<string, string> = {
  Scheduled: "ld-badge-scheduled",
  Staging: "ld-badge-staging",
  Loading: "ld-badge-loading",
  "Quality Check": "ld-badge-quality-check",
  Sealed: "ld-badge-sealed",
  Dispatched: "ld-badge-dispatched",
  "In Transit": "ld-badge-in-transit",
  Delivered: "ld-badge-delivered",
}

const STATUS_BANNER_CLS: Record<string, string> = {
  Scheduled: "ld-banner-gray",
  Staging: "ld-banner-amber",
  Loading: "ld-banner-sky-pulse",
  "Quality Check": "ld-banner-cyan-pulse",
  Sealed: "ld-banner-emerald",
  Dispatched: "ld-banner-sky",
  "In Transit": "ld-banner-indigo-pulse",
  Delivered: "ld-banner-green",
}

const PRIORITY_CLS: Record<string, string> = {
  Critical: "ld-pri-critical",
  High: "ld-pri-high",
  Medium: "ld-pri-medium",
  Low: "ld-pri-low",
}

function StatusBadge({ status }: { status: string }) {
  return <span className={cn("ld-badge", STATUS_BADGE_CLS[status] ?? "")}>{status}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  return <span className={cn("ld-pri-badge", PRIORITY_CLS[priority] ?? "")}>{priority}</span>
}

function VehicleTypeBadge({ idx, type }: { idx: number; type: string }) {
  return <span className={cn("ld-vt-badge", `ld-vt-${idx}`)}>{type}</span>
}

function LoadTypeBadge({ idx, type }: { idx: number; type: string }) {
  const short = type.includes("(") ? type.split("(")[0].trim() : type
  return <span className={cn("ld-lt-badge", `ld-lt-${idx}`)}>{short}</span>
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return (
    <span className="ld-stars">
      {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} className="ld-star" fill="currentColor" />)}
      {half === 1 && <Star className="ld-star" fill="currentColor" opacity={0.5} />}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} className="ld-star-empty" />)}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Dispatch Detail Drawer
// ─────────────────────────────────────────────────────────────────────────────
function DispatchDrawer({ record, onClose }: { record: DispatchRecord; onClose: () => void }) {
  const statusIdx = DISPATCH_STATUSES.indexOf(record.status as never)
  const steps = ["Scheduled", "Staged", "Loading", "QC Check", "Sealed", "Dispatched"]
  return (
    <>
      <div className="ld-drawer-backdrop" onClick={onClose} />
      <div className="ld-drawer">
        <div className={cn("ld-status-banner", STATUS_BANNER_CLS[record.status] ?? "")}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Dispatch ID</div>
              <div className="text-xl font-bold">{record.id}</div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Route Flow */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Route Flow</div>
            <div className="ld-route-flow">
              {[
                { label: "Dock", cls: "ld-route-node-0" },
                { label: "Loading Bay", cls: "ld-route-node-1" },
                { label: "Vehicle", cls: "ld-route-node-2" },
                { label: record.customer.city, cls: "ld-route-node-3" },
              ].map((node, idx, arr) => (
                <div key={idx} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn("ld-route-node", node.cls)}><Truck className="w-4 h-4" /></div>
                    <div className="ld-route-label">{node.label}</div>
                  </div>
                  {idx < arr.length - 1 && <div className="ld-route-arrow" />}
                </div>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Dispatch Info</div>
            <div className="ld-info-grid">
              <div className="ld-info-item"><span className="ld-info-label">Vehicle</span><span className="ld-info-value">{record.vehicle}</span></div>
              <div className="ld-info-item"><span className="ld-info-label">Type</span><span className="ld-info-value"><VehicleTypeBadge idx={record.vehicleTypeIdx} type={record.vehicleType} /></span></div>
              <div className="ld-info-item"><span className="ld-info-label">Driver</span><span className="ld-info-value">{record.driver.name}</span></div>
              <div className="ld-info-item"><span className="ld-info-label">License</span><span className="ld-info-value">{record.driver.license}</span></div>
              <div className="ld-info-item"><span className="ld-info-label">Phone</span><span className="ld-info-value">{record.driver.phone}</span></div>
              <div className="ld-info-item"><span className="ld-info-label">Destination</span><span className="ld-info-value">{record.customer.city}, {record.customer.state}</span></div>
              <div className="ld-info-item"><span className="ld-info-label">Distance</span><span className="ld-info-value">{record.distance} km</span></div>
              <div className="ld-info-item"><span className="ld-info-label">Dock</span><span className="ld-info-value">{record.dock}</span></div>
            </div>
          </div>

          {/* Load Summary */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Load Summary</div>
            <div className="grid grid-cols-4 gap-2">
              <div className="ld-load-card"><div className="ld-load-card-value">{record.pallets}</div><div className="ld-load-card-label">Pallets</div></div>
              <div className="ld-load-card"><div className="ld-load-card-value">{record.weightTons}</div><div className="ld-load-card-label">Weight (T)</div></div>
              <div className="ld-load-card"><div className="ld-load-card-value">{record.volumeCbm}</div><div className="ld-load-card-label">Volume (CBM)</div></div>
              <div className="ld-load-card"><div className="ld-load-card-value">{fmtRupee(record.valueInr)}</div><div className="ld-load-card-label">Value</div></div>
            </div>
          </div>

          {/* Compliance */}
          <div className="ld-compliance">
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#16a34a" }}>Compliance Checklist</div>
            <div className="grid grid-cols-2 gap-2">
              {["Weight Check", "Load Secured", "Temperature OK", "Docs Complete"].map((item) => (
                <div key={item} className="ld-compliance-item">
                  <span className="ld-compliance-check"><CheckCircle2 className="w-3 h-3" /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Dispatch Timeline</div>
            <div className="ld-timeline">
              {steps.map((step, idx) => {
                const done = idx <= Math.min(statusIdx, 5) && statusIdx >= 0
                const current = idx === Math.min(statusIdx, 5)
                return (
                  <div key={step} className="ld-timeline-step">
                    {idx < steps.length - 1 && <div className={cn("ld-timeline-line", done && "ld-timeline-line-done")} />}
                    <div className={cn("ld-timeline-dot", done ? (current ? "ld-timeline-dot-current" : "ld-timeline-dot-done") : "ld-timeline-dot-pending")}>
                      {done ? (current ? idx + 1 : "\u2713") : idx + 1}
                    </div>
                    <div className="ld-timeline-label">{step}</div>
                    {done && <div className="ld-timeline-time">{record.scheduledTime.slice(11, 16)}</div>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer stats */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t">
            <div className="ld-footer-stat"><span className="ld-footer-stat-label">Scheduled</span><span className="ld-footer-stat-value">{record.scheduledTime.slice(11, 16)}</span></div>
            <div className="ld-footer-stat"><span className="ld-footer-stat-label">Loading Started</span><span className="ld-footer-stat-value">{record.startTime ? record.startTime.slice(11, 16) : "—"}</span></div>
            <div className="ld-footer-stat"><span className="ld-footer-stat-label">Dispatched</span><span className="ld-footer-stat-value">{record.dispatchTime ? record.dispatchTime.slice(11, 16) : "—"}</span></div>
            <div className="ld-footer-stat"><span className="ld-footer-stat-label">Est. Delivery</span><span className="ld-footer-stat-value">{record.eta.slice(11, 16)}</span></div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function LoadingDispatchView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [vehicleFilter, setVehicleFilter] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<DispatchRecord | null>(null)

  // Filtered records for Tab 2
  const filtered = (() => {
    let list = dispatchRecords
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((r) =>
        r.id.toLowerCase().includes(q) ||
        r.vehicle.toLowerCase().includes(q) ||
        r.customer.name.toLowerCase().includes(q) ||
        r.driver.name.toLowerCase().includes(q) ||
        r.dock.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter)
    if (priorityFilter !== "all") list = list.filter((r) => r.priority === priorityFilter)
    if (vehicleFilter !== "all") list = list.filter((r) => r.vehicleType === vehicleFilter)
    return list
  })()

  const shown = filtered.slice(0, 50)

  return (
    <div className="ld-top-border space-y-4">
      <div className="flex items-center gap-3">
        <Send className="w-5 h-5 text-sky-600" />
        <h1 className="text-xl font-bold tracking-tight">Loading & Dispatch Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="dashboard" className="text-xs">Dispatch Dashboard</TabsTrigger>
          <TabsTrigger value="queue" className="text-xs">Loading Queue</TabsTrigger>
          <TabsTrigger value="docks" className="text-xs">Dock Management</TabsTrigger>
          <TabsTrigger value="tracking" className="text-xs">Vehicle & Driver</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">Dispatch Analytics</TabsTrigger>
        </TabsList>

        {/* ═══════════════════ TAB 1: Dashboard ═══════════════════ */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Total Dispatches Today", value: "84", cls: "ld-kpi-slate", icon: <Truck className="w-4 h-4" /> },
                { label: "In Loading", value: "12", cls: "ld-kpi-sky", icon: <Package className="w-4 h-4" /> },
                { label: "Staged", value: "8", cls: "ld-kpi-amber", icon: <Clock className="w-4 h-4" /> },
                { label: "Dispatched", value: "52", cls: "ld-kpi-emerald", icon: <Send className="w-4 h-4" /> },
                { label: "On-Time Rate", value: "94.2%", cls: "ld-kpi-rose", icon: <Gauge className="w-4 h-4" /> },
                { label: "Avg Load Time", value: "38 min", cls: "ld-kpi-violet", icon: <Timer className="w-4 h-4" /> },
              ].map((kpi, i) => (
                <div key={kpi.label} className={cn("ld-kpi-card", kpi.cls, `ld-fade-in ld-fade-in-${i + 1}`)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="ld-kpi-icon">{kpi.icon}</div>
                  </div>
                  <div className="ld-kpi-value">{kpi.value}</div>
                  <div className="ld-kpi-label">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="hover-lift-sm ld-fade-in ld-fade-in-1">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Daily Dispatch Volume & On-Time Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" domain={[80, 100]} tick={{ fontSize: 10 }} unit="%" />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="dispatched" fill="#0ea5e9" radius={[2, 2, 0, 0]} name="Dispatched" />
                      <Line yAxisId="right" type="monotone" dataKey="onTimeRate" stroke="#f43f5e" strokeWidth={2} dot={false} name="On-Time %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm ld-fade-in ld-fade-in-2">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Vehicle Type Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={vehicleTypeDist} cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={3} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {vehicleTypeDist.map((_, i) => <Cell key={i} fill={VEHICLE_COLORS[i % VEHICLE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="hover-lift-sm ld-fade-in ld-fade-in-3">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Warehouse Dispatch Performance</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={warehousePerf}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="dispatches" fill="#0ea5e9" radius={[2, 2, 0, 0]} name="Dispatches" />
                      <Bar dataKey="avgLoadTime" fill="#475569" radius={[2, 2, 0, 0]} name="Avg Load Time (min)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm ld-fade-in ld-fade-in-4">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Load Type Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={loadTypeDist} cx="50%" cy="50%" outerRadius={85} innerRadius={40} paddingAngle={3} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {loadTypeDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Driver Performance Table */}
            <Card className="hover-lift-sm ld-fade-in ld-fade-in-5">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Driver Performance</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Driver</TableHead>
                        <TableHead className="text-xs">Vehicle</TableHead>
                        <TableHead className="text-xs">License</TableHead>
                        <TableHead className="text-xs">Warehouse</TableHead>
                        <TableHead className="text-xs text-right">Trips</TableHead>
                        <TableHead className="text-xs text-right">Avg Load</TableHead>
                        <TableHead className="text-xs text-right">On-Time %</TableHead>
                        <TableHead className="text-xs">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driverPerf.map((d) => (
                        <TableRow key={d.driverId}>
                          <TableCell className="text-xs font-medium">{d.driverName}</TableCell>
                          <TableCell className="text-xs">{d.vehicle}</TableCell>
                          <TableCell className="text-xs">{d.license}</TableCell>
                          <TableCell className="text-xs">{d.warehouse}</TableCell>
                          <TableCell className="text-xs text-right">{d.trips}</TableCell>
                          <TableCell className="text-xs text-right">{d.avgLoad} min</TableCell>
                          <TableCell className="text-xs text-right">{d.onTime}%</TableCell>
                          <TableCell className="text-xs"><StarRating rating={d.rating} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════ TAB 2: Loading Queue ═══════════════════ */}
        {activeTab === "queue" && (
          <div className="space-y-4">
            <div className="ld-filter-bar">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input className="ld-search-input" placeholder="Search ID / Vehicle / Destination / Driver / Dock..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="ld-search-input pl-3 w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {DISPATCH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="ld-search-input pl-3 w-auto" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="all">All Priority</option>
                {LOAD_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select className="ld-search-input pl-3 w-auto" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}>
                <option value="all">All Vehicle</option>
                {VEHICLE_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <div className="text-xs text-muted-foreground self-center">Showing {shown.length} of {filtered.length}</div>
            </div>

            <Card>
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Dispatch ID</TableHead>
                        <TableHead className="text-xs">Vehicle</TableHead>
                        <TableHead className="text-xs">Type</TableHead>
                        <TableHead className="text-xs">Driver</TableHead>
                        <TableHead className="text-xs">Destination</TableHead>
                        <TableHead className="text-xs">Dock</TableHead>
                        <TableHead className="text-xs">Load Type</TableHead>
                        <TableHead className="text-xs">Priority</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs text-right">Pallets</TableHead>
                        <TableHead className="text-xs text-right">Weight (T)</TableHead>
                        <TableHead className="text-xs">ETA</TableHead>
                        <TableHead className="text-xs">Sched. Time</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shown.map((r) => (
                        <TableRow key={r.id} className={cn(r.status === "Loading" && "ld-row-loading", r.status === "In Transit" && "ld-row-in-transit", r.status === "Quality Check" && "ld-row-quality")}>
                          <TableCell className="text-xs font-mono font-semibold">{r.id}</TableCell>
                          <TableCell className="text-xs">{r.vehicle}</TableCell>
                          <TableCell><VehicleTypeBadge idx={r.vehicleTypeIdx} type={r.vehicleType} /></TableCell>
                          <TableCell className="text-xs">{r.driver.name}</TableCell>
                          <TableCell className="text-xs">{r.customer.city}, {r.customer.state}</TableCell>
                          <TableCell className="text-xs">{r.dock}</TableCell>
                          <TableCell><LoadTypeBadge idx={r.loadTypeIdx} type={r.loadType} /></TableCell>
                          <TableCell><PriorityBadge priority={r.priority} /></TableCell>
                          <TableCell><StatusBadge status={r.status} /></TableCell>
                          <TableCell className="text-xs text-right">{r.pallets}</TableCell>
                          <TableCell className="numeric-cell text-xs text-right">{r.weightTons}</TableCell>
                          <TableCell className="text-xs">{r.eta.slice(11, 16)}</TableCell>
                          <TableCell className="text-xs">{r.scheduledTime.slice(11, 16)}</TableCell>
                          <TableCell><button onClick={() => setSelectedRecord(r)} className="p-1 rounded hover:bg-muted"><Eye className="w-3.5 h-3.5 text-sky-600" /></button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════ TAB 3: Dock Management ═══════════════════ */}
        {activeTab === "docks" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Docks Total", value: "8", cls: "ld-kpi-slate", icon: <LayoutGrid className="w-4 h-4" /> },
                { label: "Occupied", value: "6", cls: "ld-kpi-sky", icon: <Package className="w-4 h-4" /> },
                { label: "Available", value: "2", cls: "ld-kpi-emerald", icon: <CheckCircle2 className="w-4 h-4" /> },
                { label: "Avg Turnaround", value: "45 min", cls: "ld-kpi-amber", icon: <Clock className="w-4 h-4" /> },
              ].map((kpi, i) => (
                <div key={kpi.label} className={cn("ld-kpi-card", kpi.cls, `ld-fade-in ld-fade-in-${i + 1}`)}>
                  <div className="flex items-center justify-between mb-2"><div className="ld-kpi-icon">{kpi.icon}</div></div>
                  <div className="ld-kpi-value">{kpi.value}</div>
                  <div className="ld-kpi-label">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Dock Status Grid */}
            <Card className="hover-lift-sm ld-fade-in ld-fade-in-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Dock Status Grid</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dockData.map((d) => (
                    <div key={d.dock} className={cn("p-4", d.status === "Occupied" && "ld-dock-occupied", d.status === "Available" && "ld-dock-available", d.status === "Maintenance" && "ld-dock-maintenance")}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(d.status === "Occupied" && "ld-dock-dot-occupied", d.status === "Available" && "ld-dock-dot-available", d.status === "Maintenance" && "ld-dock-dot-maintenance")} />
                        <span className="text-xs font-bold">{d.dock}</span>
                        <span className={cn("ld-badge ml-auto", d.status === "Occupied" ? "ld-badge-loading" : d.status === "Available" ? "ld-badge-delivered" : "ld-badge-scheduled")}>{d.status}</span>
                      </div>
                      {d.status === "Occupied" && (
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Vehicle: <span className="text-foreground font-medium">{d.vehicle}</span></div>
                          <div className="text-xs text-muted-foreground">Load: <span className="text-foreground font-medium">{d.loadType}</span></div>
                          <div className="text-xs text-muted-foreground">Est. Complete: <span className="text-foreground font-medium">{d.estCompletion}</span></div>
                        </div>
                      )}
                      {d.status === "Available" && <div className="text-xs text-muted-foreground">Ready for assignment</div>}
                      {d.status === "Maintenance" && <div className="text-xs text-muted-foreground">Under maintenance</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dock Utilization Chart */}
            <Card className="hover-lift-sm ld-fade-in ld-fade-in-3">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Dock Utilization (%)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={dockData.map((d) => ({ dock: d.dock.replace("Dock ", "D"), utilization: d.utilization }))}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="dock" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="utilization" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Utilization %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Dock Assignment Table */}
            <Card className="hover-lift-sm ld-fade-in ld-fade-in-4">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Dock Assignment Table</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Dock</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Vehicle</TableHead>
                        <TableHead className="text-xs">Driver</TableHead>
                        <TableHead className="text-xs">Load Type</TableHead>
                        <TableHead className="text-xs">Destination</TableHead>
                        <TableHead className="text-xs">Start</TableHead>
                        <TableHead className="text-xs">Est. Completion</TableHead>
                        <TableHead className="text-xs">Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dockData.map((d) => (
                        <TableRow key={d.dock}>
                          <TableCell className="text-xs font-bold">{d.dock}</TableCell>
                          <TableCell><StatusBadge status={d.status === "Occupied" ? "Loading" : d.status} /></TableCell>
                          <TableCell className="text-xs">{d.vehicle}</TableCell>
                          <TableCell className="text-xs">{d.driver}</TableCell>
                          <TableCell className="text-xs">{d.loadType}</TableCell>
                          <TableCell className="text-xs">{d.destination}</TableCell>
                          <TableCell className="text-xs">{d.startTime}</TableCell>
                          <TableCell className="text-xs">{d.estCompletion}</TableCell>
                          <TableCell>{d.priority ? <PriorityBadge priority={d.priority} /> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════ TAB 4: Vehicle & Driver Tracking ═══════════════════ */}
        {activeTab === "tracking" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Active Vehicles", value: "18", cls: "ld-kpi-slate", icon: <Truck className="w-4 h-4" /> },
                { label: "Drivers Available", value: "4", cls: "ld-kpi-sky", icon: <Users className="w-4 h-4" /> },
                { label: "Avg Delivery Time", value: "6.2 hrs", cls: "ld-kpi-emerald", icon: <Clock className="w-4 h-4" /> },
                { label: "Fuel Cost / Trip", value: fmtRupee(3240), cls: "ld-kpi-amber", icon: <Fuel className="w-4 h-4" /> },
              ].map((kpi, i) => (
                <div key={kpi.label} className={cn("ld-kpi-card", kpi.cls, `ld-fade-in ld-fade-in-${i + 1}`)}>
                  <div className="flex items-center justify-between mb-2"><div className="ld-kpi-icon">{kpi.icon}</div></div>
                  <div className="ld-kpi-value">{kpi.value}</div>
                  <div className="ld-kpi-label">{kpi.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="hover-lift-sm ld-fade-in ld-fade-in-1">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Vehicle Utilization (bubble = trips)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" dataKey="x" name="Utilization %" tick={{ fontSize: 10 }} unit="%" domain={[30, 100]} />
                      <YAxis type="number" dataKey="y" name="Distance (km)" tick={{ fontSize: 10 }} domain={[0, 200]} />
                      <ZAxis type="number" dataKey="z" range={[60, 400]} name="Trips" />
                      <Tooltip contentStyle={{ fontSize: 11 }} formatter={(value: number, name: string) => [name === "Trips" ? value : `${value}`, name]} />
                      <Scatter data={vehicleScatter} fill="#0ea5e9">
                        {vehicleScatter.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm ld-fade-in ld-fade-in-2">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Driver Star Rating Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={starDist}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="stars" tick={{ fontSize: 10 }} label={{ value: "Stars", position: "insideBottom", offset: -5, fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Drivers" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="hover-lift-sm ld-fade-in ld-fade-in-3">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Active Dispatches</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Dispatch ID</TableHead>
                        <TableHead className="text-xs">Driver</TableHead>
                        <TableHead className="text-xs">Phone</TableHead>
                        <TableHead className="text-xs">Vehicle</TableHead>
                        <TableHead className="text-xs">Type</TableHead>
                        <TableHead className="text-xs">Destination</TableHead>
                        <TableHead className="text-xs text-right">Distance</TableHead>
                        <TableHead className="text-xs">ETA</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs text-right">Speed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeDispatches.map((r) => (
                        <TableRow key={r.id} className={cn(r.status === "In Transit" && "ld-row-in-transit")}>
                          <TableCell className="text-xs font-mono font-semibold">{r.id}</TableCell>
                          <TableCell className="text-xs font-medium">{r.driver.name}</TableCell>
                          <TableCell className="text-xs">{r.driver.phone}</TableCell>
                          <TableCell className="text-xs">{r.vehicle}</TableCell>
                          <TableCell><VehicleTypeBadge idx={r.vehicleTypeIdx} type={r.vehicleType} /></TableCell>
                          <TableCell className="text-xs">{r.customer.city}, {r.customer.state}</TableCell>
                          <TableCell className="numeric-cell text-xs text-right">{r.distance} km</TableCell>
                          <TableCell className="text-xs">{r.eta.slice(11, 16)}</TableCell>
                          <TableCell><StatusBadge status={r.status} /></TableCell>
                          <TableCell className="text-xs text-right">{r.speed} km/h</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════ TAB 5: Dispatch Analytics ═══════════════════ */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Monthly Dispatches", value: "2,847", cls: "ld-kpi-slate", icon: <Send className="w-4 h-4" /> },
                { label: "Avg Transit Time", value: "4.8 hrs", cls: "ld-kpi-sky", icon: <Clock className="w-4 h-4" /> },
                { label: "Delivery Accuracy", value: "97.6%", cls: "ld-kpi-emerald", icon: <FileCheck className="w-4 h-4" /> },
                { label: "Cost per Dispatch", value: fmtRupee(4850), cls: "ld-kpi-amber", icon: <IndianRupee className="w-4 h-4" /> },
              ].map((kpi, i) => (
                <div key={kpi.label} className={cn("ld-kpi-card", kpi.cls, `ld-fade-in ld-fade-in-${i + 1}`)}>
                  <div className="flex items-center justify-between mb-2"><div className="ld-kpi-icon">{kpi.icon}</div></div>
                  <div className="ld-kpi-value">{kpi.value}</div>
                  <div className="ld-kpi-label">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Cost Trend */}
            <Card className="hover-lift-sm ld-fade-in ld-fade-in-1">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Dispatch Cost Trend (Stacked)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={costTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `\u20b9${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number) => fmtRupee(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" stackId="1" dataKey="fuel" fill="#f43f5e" name="Fuel" />
                    <Area type="monotone" stackId="1" dataKey="toll" fill="#f59e0b" name="Toll" />
                    <Area type="monotone" stackId="1" dataKey="labor" fill="#0ea5e9" name="Labor" />
                    <Area type="monotone" stackId="1" dataKey="overhead" fill="#475569" name="Overhead" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Destination Performance Radar */}
              <Card className="hover-lift-sm ld-fade-in ld-fade-in-2">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Destination Performance</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={destPerformance}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="destination" tick={{ fontSize: 9 }} />
                      <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="On-Time %" dataKey="onTime" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} />
                      <Radar name="Damage-Free %" dataKey="damageFree" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                      <Radar name="Cost Efficiency" dataKey="costEfficiency" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Exception Table placeholder - actually the full table */}
              <Card className="hover-lift-sm ld-fade-in ld-fade-in-3">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Delivery Exception Analysis</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto max-h-[400px]">
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Type</TableHead>
                          <TableHead className="text-xs text-right">Count</TableHead>
                          <TableHead className="text-xs text-right">%</TableHead>
                          <TableHead className="text-xs">Trend</TableHead>
                          <TableHead className="text-xs">Root Cause</TableHead>
                          <TableHead className="text-xs">Action Taken</TableHead>
                          <TableHead className="text-xs text-right">Cost</TableHead>
                          <TableHead className="text-xs">Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exceptions.slice(0, 30).map((e, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs font-medium">{e.type}</TableCell>
                            <TableCell className="text-xs text-right">{e.count}</TableCell>
                            <TableCell className="text-xs text-right">{e.pct}</TableCell>
                            <TableCell className="text-xs">{e.trend === "up" ? <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />}</TableCell>
                            <TableCell className="text-xs">{e.rootCause}</TableCell>
                            <TableCell className="text-xs">{e.action}</TableCell>
                            <TableCell className="numeric-cell text-xs text-right">{fmtRupee(e.cost)}</TableCell>
                            <TableCell><PriorityBadge priority={e.priority} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Tabs>

      {/* Drawer */}
      {selectedRecord && <DispatchDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  )
}
