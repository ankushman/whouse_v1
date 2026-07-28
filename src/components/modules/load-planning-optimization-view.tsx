"use client"
import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

// ─── Constants ───────────────────────────────────────────────────────────────
const WAREHOUSES = ["Mumbai DC", "Delhi Hub", "Chennai DC", "Bangalore FC", "Pune WH", "Hyderabad DC", "Kolkata WH", "Ahmedabad FC"] as const
const VEHICLE_TYPES = ["20ft Container", "40ft Container", "Truck 10T", "Truck 20T", "Trailer 30T", "Mini Truck 5T", "Tanker", "Flatbed", "Refrigerated", "Open Top"] as const
const LOAD_TYPES = ["FCL", "LTL", "Palletized", "Bulk", "Oversized", "Hazmat", "Temperature Controlled", "Fragile"] as const
const PRODUCT_CATEGORIES = ["Electronics", "FMCG", "Pharmaceuticals", "Apparel", "Auto Parts", "Food & Beverage", "Industrial", "Agriculture", "Textiles", "Chemicals"] as const
const ROUTE_ZONES = ["Mumbai-Delhi", "Delhi-Chennai", "Chennai-Bangalore", "Mumbai-Pune", "Delhi-Kolkata", "Hyderabad-Chennai", "Pune-Bangalore", "Ahmedabad-Delhi", "Kolkata-Guwahati", "Mumbai-Hyderabad"] as const
const CARRIERS = ["BlueDart", "DTDC", "Delhivery", "Ecom Express", "Gati", "TNT Express", "FedEx India", "DHL India", "Shadowfax", "XpressBees"] as const
const LOAD_STATUSES = ["Planned", "In Progress", "Loaded", "Dispatched", "Delivered", "Cancelled"] as const
const PRIORITY_LEVELS = ["Critical", "High", "Medium", "Low", "Routine"] as const
const CONSTRAINT_TYPES = ["Weight Limit", "Height Restriction", "Stackability", "Temperature", "Hazmat Segregation", "Fragile Handling", "Axle Weight", "Customs Seal"] as const
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const IMPROVEMENTS = ["Consolidate", "Split Load", "Change Vehicle", "Adjust Route", "Add Pallet", "Remove Item"] as const

const C = { teal: "#0d9488", indigo: "#6366f1", rose: "#e11d48", amber: "#d97706", emerald: "#059669", sky: "#0284c7", purple: "#7c3aed", slate: "#475569", orange: "#ea580c" }
const CC = [C.teal, C.indigo, C.rose, C.amber, C.emerald, C.sky, C.purple, C.orange, "#65a30d", C.slate]

// ─── Seeded Random ───────────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ─── INR Formatting ──────────────────────────────────────────────────────────
function formatINR(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`
  return `₹${val.toLocaleString("en-IN")}`
}

// ─── Generate Data ────────────────────────────────────────────────────────────
function generateData() {
  const rand = seededRandom(186186)
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
  const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

  // 1. Load Plans (100)
  const loadPlans = Array.from({ length: 100 }, (_, i) => ({
    id: `LP-${String(i + 1).padStart(4, "0")}`,
    route: pick(ROUTE_ZONES),
    vehicleType: pick(VEHICLE_TYPES),
    carrier: pick(CARRIERS),
    loadType: pick(LOAD_TYPES),
    productCategory: pick(PRODUCT_CATEGORIES),
    weightTon: +(rand() * 28 + 2).toFixed(1),
    volumeCbm: +(rand() * 55 + 5).toFixed(1),
    utilizationPct: Math.round(rand() * 60 + 35),
    plannedDate: `2025-${String(rInt(1, 12)).padStart(2, "0")}-${String(rInt(1, 28)).padStart(2, "0")}`,
    status: pick(LOAD_STATUSES),
    priority: pick(PRIORITY_LEVELS),
    estimatedCost: rInt(15000, 350000),
    constraints: Array.from({ length: rInt(1, 3) }, () => pick(CONSTRAINT_TYPES)),
    warehouse: pick(WAREHOUSES),
    palletCount: rInt(2, 48),
  }))

  // 2. Load Optimization (70)
  const loadOptimization = Array.from({ length: 70 }, (_, i) => {
    const wu = Math.round(rand() * 70 + 25)
    const vu = Math.round(rand() * 70 + 25)
    return {
      id: `OPT-${String(i + 1).padStart(4, "0")}`,
      planId: loadPlans[i % 100].id,
      vehicleType: pick(VEHICLE_TYPES),
      maxWeightTon: +(rand() * 25 + 5).toFixed(1),
      maxVolumeCbm: +(rand() * 50 + 10).toFixed(1),
      currentWeight: +(rand() * 25 + 2).toFixed(1),
      currentVolume: +(rand() * 50 + 3).toFixed(1),
      weightUtilPct: wu,
      volumeUtilPct: vu,
      combinedUtilPct: Math.round((wu + vu) / 2),
      suggestedImprovement: pick(IMPROVEMENTS),
      potentialSaving: rInt(5000, 180000),
      recommendation: Array.from({ length: rInt(1, 4) }, () => pick(IMPROVEMENTS)),
    }
  })

  // 3. Vehicle Fleet (40)
  const vehicleFleet = Array.from({ length: 40 }, (_, i) => {
    const avail = pick(["Available", "In Use", "Maintenance", "Out of Service"] as const)
    return {
      id: `VH-${String(i + 1).padStart(4, "0")}`,
      vehicleType: pick(VEHICLE_TYPES),
      plateNo: `MH${rInt(10, 99)}${String.fromCharCode(65 + rInt(0, 25))}${String.fromCharCode(65 + rInt(0, 25))}${String(rInt(1000, 9999))}`,
      capacityTon: +(rand() * 28 + 3).toFixed(1),
      volumeCbm: +(rand() * 55 + 8).toFixed(1),
      available: avail,
      currentLocation: pick(WAREHOUSES),
      totalTrips: rInt(10, 520),
      avgUtilPct: Math.round(rand() * 55 + 40),
      maintenanceDue: pick(["Due Soon", "Overdue", "OK"] as const),
      fuelEfficiency: +(rand() * 6 + 3).toFixed(1),
      year: rInt(2018, 2025),
    }
  })

  // 4. Route Analysis (50)
  const routeAnalysis = Array.from({ length: 50 }, (_, i) => ({
    id: `RT-${String(i + 1).padStart(4, "0")}`,
    route: pick(ROUTE_ZONES),
    distanceKm: rInt(150, 2200),
    avgTimeHrs: +(rand() * 24 + 4).toFixed(1),
    avgCost: rInt(20000, 450000),
    loadFrequency: rInt(5, 120),
    avgUtilPct: Math.round(rand() * 50 + 45),
    onTimePct: Math.round(rand() * 30 + 68),
    accidentCount: rInt(0, 8),
    peakHour: `${String(rInt(6, 22)).padStart(2, "0")}:${rInt(0, 1) ? "00" : "30"}`,
    congestionLevel: pick(["Low", "Medium", "High", "Critical"] as const),
  }))

  // 5. Cost Analysis (60 monthly)
  const costAnalysis = Array.from({ length: 60 }, (_, i) => {
    const mIdx = i % 12
    const fuel = rInt(180000, 650000)
    const labor = rInt(250000, 800000)
    const maint = rInt(80000, 350000)
    const toll = rInt(40000, 180000)
    const penalty = rInt(0, 120000)
    const total = fuel + labor + maint + toll + penalty
    const target = Math.round(total * (rand() * 0.2 + 0.85))
    return {
      id: `CA-${String(i + 1).padStart(4, "0")}`,
      month: `${MONTHS[mIdx]} ${2020 + Math.floor(i / 12)}`,
      fuelCost: fuel,
      laborCost: labor,
      vehicleMaint: maint,
      tollCost: toll,
      delayPenalty: penalty,
      totalCost: total,
      targetCost: target,
      savingsPct: +(rand() * 18 + 2).toFixed(1),
      loadsHandled: rInt(80, 600),
      revenue: Math.round(total * (rand() * 0.6 + 1.2)),
    }
  })

  return {
    loadPlans,
    loadOptimization,
    vehicleFleet,
    routeAnalysis,
    costAnalysis,
    warehouses: WAREHOUSES,
    vehicleTypes: VEHICLE_TYPES,
    loadTypes: LOAD_TYPES,
    productCategories: PRODUCT_CATEGORIES,
    routeZones: ROUTE_ZONES,
    carriers: CARRIERS,
    loadStatuses: LOAD_STATUSES,
    priorityLevels: PRIORITY_LEVELS,
    constraintTypes: CONSTRAINT_TYPES,
    months: MONTHS,
    improvements: IMPROVEMENTS,
  }
}

type Data = ReturnType<typeof generateData>

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TABS = ["Dashboard", "Load Plans", "Optimization", "Fleet", "Routes", "Cost Analytics"] as const

function UtilBar({ fields: pct }: { fields: number }) {
  const color = pct < 50 ? C.rose : pct < 75 ? C.amber : pct < 90 ? C.emerald : C.teal
  return (
    <div className="lpo-util-bar">
      <div className="lpo-util-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      <span>{pct}%</span>
    </div>
  )
}

function PriorityBadge({ fields: level }: { fields: string }) {
  const cls: Record<string, string> = {
    Critical: "lpo-priority-critical",
    High: "lpo-priority-high",
    Medium: "lpo-priority-medium",
    Low: "lpo-priority-low",
    Routine: "lpo-priority-routine",
  }
  return <span className={cn("lpo-badge", cls[level] || "")}>{level}</span>
}

function StatusBadge({ fields: status }: { fields: string }) {
  const cls: Record<string, string> = {
    Planned: "lpo-status-planned",
    "In Progress": "lpo-status-inprogress",
    Loaded: "lpo-status-loaded",
    Dispatched: "lpo-status-dispatched",
    Delivered: "lpo-status-delivered",
    Cancelled: "lpo-status-cancelled",
  }
  return <span className={cn("lpo-badge", cls[status] || "")}>{status}</span>
}

function CongestionBadge({ fields: level }: { fields: string }) {
  const cls: Record<string, string> = {
    Critical: "lpo-congestion-critical",
    High: "lpo-congestion-high",
    Medium: "lpo-congestion-medium",
    Low: "lpo-congestion-low",
  }
  return <span className={cn("lpo-badge", cls[level] || "")}>{level}</span>
}

function AvailableBadge({ fields: status }: { fields: string }) {
  const cls: Record<string, string> = {
    Available: "lpo-available-ok",
    "In Use": "lpo-available-inuse",
    Maintenance: "lpo-available-maintenance",
    "Out of Service": "lpo-available-oos",
  }
  return <span className={cn("lpo-badge", cls[status] || "")}>{status}</span>
}

function MaintBadge({ fields: status }: { fields: string }) {
  const cls: Record<string, string> = {
    OK: "lpo-maint-ok",
    "Due Soon": "lpo-maint-due",
    Overdue: "lpo-maint-overdue",
  }
  return <span className={cn("lpo-badge", cls[status] || "")}>{status}</span>
}

function ImprovementBadge({ fields: text }: { fields: string }) {
  const cls: Record<string, string> = {
    Consolidate: "lpo-improve-consolidate",
    "Split Load": "lpo-improve-split",
    "Change Vehicle": "lpo-improve-change",
    "Adjust Route": "lpo-improve-adjust",
    "Add Pallet": "lpo-improve-add",
    "Remove Item": "lpo-improve-remove",
  }
  return <span className={cn("lpo-badge", cls[text] || "")}>{text}</span>
}

function OnTimeBadge({ fields: pct }: { fields: number }) {
  const cls = pct < 80 ? "lpo-ontime-bad" : pct < 90 ? "lpo-ontime-warn" : "lpo-ontime-good"
  return <span className={cn("lpo-badge", cls)}>{pct}%</span>
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ fields }: { fields: { label: string; value: string; sub: string } }) {
  return (
    <div className="lpo-kpi-card">
      <div className="lpo-kpi-label">{fields.label}</div>
      <div className="lpo-kpi-value">{fields.value}</div>
      <div className="lpo-kpi-sub">{fields.sub}</div>
    </div>
  )
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ fields }: { fields: { label: string; value: string; border: string } }) {
  return (
    <div className="lpo-summary-card" style={{ borderLeftColor: fields.border }}>
      <div className="lpo-summary-label">{fields.label}</div>
      <div className="lpo-summary-value">{fields.value}</div>
    </div>
  )
}

// ─── Sort Header Component ────────────────────────────────────────────────────
function SortHeader({ fields }: { fields: { label: string; sortBy: any; currentSort: any; sortDir: string; onSort: (col: any) => void } }) {
  return (
    <th
      className="cursor-pointer select-none hover:bg-muted/50 transition-colors text-xs font-medium text-muted-foreground"
      onClick={() => fields.onSort(fields.sortBy)}
    >
      {fields.label}{" "}
      {fields.currentSort === fields.sortBy
        ? fields.sortDir === "asc"
          ? "↑"
          : "↓"
        : ""}
    </th>
  )
}

// ─── Drawer Components ────────────────────────────────────────────────────────
function LoadPlanDrawer({ item, onClose }: { item: any; onClose: () => void }) {
  if (!item) return null
  return (
    <>
      <Sheet open={!!item} onOpenChange={(open: boolean) => { if (!open) onClose() }}>
        <SheetContent className="lpo-drawer-sheet">
          <div className="lpo-drawer-header">
            <div className="lpo-drawer-title">{item.id} — {item.route}</div>
            <div className="lpo-drawer-badges">
              <PriorityBadge fields={item.priority} />
              <StatusBadge fields={item.status} />
            </div>
          </div>
          <div className="lpo-drawer-body">
            <div className="lpo-drawer-metrics">
              <div className="lpo-drawer-metric">
                <span>Weight</span>
                <strong>{item.weightTon} T</strong>
              </div>
              <div className="lpo-drawer-metric">
                <span>Volume</span>
                <strong>{item.volumeCbm} CBM</strong>
              </div>
              <div className="lpo-drawer-metric">
                <span>Est. Cost</span>
                <strong>{formatINR(item.estimatedCost)}</strong>
              </div>
            </div>
            <div className="lpo-drawer-util-label">Utilization</div>
            <UtilBar fields={item.utilizationPct} />
            <div className="lpo-drawer-section-title">Constraints</div>
            <div className="lpo-drawer-constraints">
              {item.constraints.map((c: string, i: number) => (
                <span key={i} className="lpo-drawer-tag">{c}</span>
              ))}
            </div>
            <div className="lpo-drawer-field-grid">
              <div><span>Vehicle</span><p>{item.vehicleType}</p></div>
              <div><span>Carrier</span><p>{item.carrier}</p></div>
              <div><span>Load Type</span><p>{item.loadType}</p></div>
              <div><span>Category</span><p>{item.productCategory}</p></div>
              <div><span>Warehouse</span><p>{item.warehouse}</p></div>
              <div><span>Pallets</span><p>{item.palletCount}</p></div>
            </div>
            <div className="lpo-drawer-actions">
              <button className="lpo-btn-primary">Approve</button>
              <button className="lpo-btn-secondary">Edit Plan</button>
              <button className="lpo-btn-danger">Cancel</button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function OptimizationDrawer({ item, onClose }: { item: any; onClose: () => void }) {
  if (!item) return null
  return (
    <>
      <Sheet open={!!item} onOpenChange={(open: boolean) => { if (!open) onClose() }}>
        <SheetContent className="lpo-drawer-sheet">
          <div className="lpo-drawer-header">
            <div className="lpo-drawer-title">{item.id} — {item.planId}</div>
            <ImprovementBadge fields={item.suggestedImprovement} />
          </div>
          <div className="lpo-drawer-body">
            <div className="lpo-drawer-metrics">
              <div className="lpo-drawer-metric">
                <span>Weight Util</span>
                <strong>{item.weightUtilPct}%</strong>
              </div>
              <div className="lpo-drawer-metric">
                <span>Volume Util</span>
                <strong>{item.volumeUtilPct}%</strong>
              </div>
              <div className="lpo-drawer-metric">
                <span>Combined</span>
                <strong>{item.combinedUtilPct}%</strong>
              </div>
            </div>
            <div className="lpo-drawer-util-label">Weight Utilization</div>
            <UtilBar fields={item.weightUtilPct} />
            <div className="lpo-drawer-util-label" style={{ marginTop: 8 }}>Volume Utilization</div>
            <UtilBar fields={item.volumeUtilPct} />
            <div className="lpo-drawer-field-grid">
              <div><span>Vehicle</span><p>{item.vehicleType}</p></div>
              <div><span>Max Weight</span><p>{item.maxWeightTon} T</p></div>
              <div><span>Max Volume</span><p>{item.maxVolumeCbm} CBM</p></div>
              <div><span>Current Weight</span><p>{item.currentWeight} T</p></div>
              <div><span>Potential Saving</span><p>{formatINR(item.potentialSaving)}</p></div>
            </div>
            <div className="lpo-drawer-actions">
              <button className="lpo-btn-primary">Apply</button>
              <button className="lpo-btn-secondary">Review</button>
              <button className="lpo-btn-danger">Dismiss</button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function FleetDrawer({ item, onClose }: { item: any; onClose: () => void }) {
  if (!item) return null
  return (
    <>
      <Sheet open={!!item} onOpenChange={(open: boolean) => { if (!open) onClose() }}>
        <SheetContent className="lpo-drawer-sheet">
          <div className="lpo-drawer-header">
            <div className="lpo-drawer-title">{item.id} — {item.plateNo}</div>
            <div className="lpo-drawer-badges">
              <AvailableBadge fields={item.available} />
              <MaintBadge fields={item.maintenanceDue} />
            </div>
          </div>
          <div className="lpo-drawer-body">
            <div className="lpo-drawer-metrics">
              <div className="lpo-drawer-metric">
                <span>Avg Utilization</span>
                <strong>{item.avgUtilPct}%</strong>
              </div>
              <div className="lpo-drawer-metric">
                <span>Total Trips</span>
                <strong>{item.totalTrips}</strong>
              </div>
              <div className="lpo-drawer-metric">
                <span>Fuel Efficiency</span>
                <strong>{item.fuelEfficiency} km/L</strong>
              </div>
            </div>
            <div className="lpo-drawer-field-grid">
              <div><span>Vehicle Type</span><p>{item.vehicleType}</p></div>
              <div><span>Capacity</span><p>{item.capacityTon} T / {item.volumeCbm} CBM</p></div>
              <div><span>Location</span><p>{item.currentLocation}</p></div>
              <div><span>Year</span><p>{item.year}</p></div>
              <div><span>Available</span><p>{item.available}</p></div>
            </div>
            <div className="lpo-drawer-actions">
              <button className="lpo-btn-primary">Assign Trip</button>
              <button className="lpo-btn-secondary">Schedule Maint.</button>
              <button className="lpo-btn-danger">Decommission</button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function RouteDrawer({ item, onClose }: { item: any; onClose: () => void }) {
  if (!item) return null
  return (
    <>
      <Sheet open={!!item} onOpenChange={(open: boolean) => { if (!open) onClose() }}>
        <SheetContent className="lpo-drawer-sheet">
          <div className="lpo-drawer-header">
            <div className="lpo-drawer-title">{item.id} — {item.route}</div>
            <div className="lpo-drawer-badges">
              <CongestionBadge fields={item.congestionLevel} />
              <OnTimeBadge fields={item.onTimePct} />
            </div>
          </div>
          <div className="lpo-drawer-body">
            <div className="lpo-drawer-metrics">
              <div className="lpo-drawer-metric">
                <span>Distance</span>
                <strong>{item.distanceKm} km</strong>
              </div>
              <div className="lpo-drawer-metric">
                <span>Avg Time</span>
                <strong>{item.avgTimeHrs} hrs</strong>
              </div>
              <div className="lpo-drawer-metric">
                <span>Avg Cost</span>
                <strong>{formatINR(item.avgCost)}</strong>
              </div>
            </div>
            <div className="lpo-drawer-field-grid">
              <div><span>Frequency</span><p>{item.loadFrequency} loads/mo</p></div>
              <div><span>Avg Utilization</span><p>{item.avgUtilPct}%</p></div>
              <div><span>Peak Hour</span><p>{item.peakHour}</p></div>
              <div><span>Accidents</span><p>{item.accidentCount}</p></div>
              <div><span>Congestion</span><p>{item.congestionLevel}</p></div>
            </div>
            <div className="lpo-drawer-actions">
              <button className="lpo-btn-primary">Optimize Route</button>
              <button className="lpo-btn-secondary">Schedule</button>
              <button className="lpo-btn-danger">Blacklist</button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoadPlanningOptimizationView() {
  const [tab, setTab] = useState(0)
  const data = useMemo(() => generateData(), [])
  const [drawerData, setDrawerData] = useState<any>(null)

  // Search & filter states
  const [search, setSearch] = useState("")
  const [filterRoute, setFilterRoute] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterVehicle, setFilterVehicle] = useState("all")
  const [filterCongestion, setFilterCongestion] = useState("all")
  const [filterAvail, setFilterAvail] = useState("all")

  // Sort states per table
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const handleSort = (col: any) => {
    if (sortBy === col) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortBy(col)
      setSortDir("asc")
    }
  }

  const sortCmp = (a: any, b: any) => {
    const av = a[sortBy]
    const bv = b[sortBy]
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "asc" ? av - bv : bv - av
    }
    return sortDir === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  }

  const SH = (label: string, col: any) => (
    <SortHeader
      fields={{ label, sortBy: col, currentSort: sortBy, sortDir, onSort: handleSort }}
    />
  )

  // ── Dashboard KPIs ─────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const avgUtil = Math.round(data.loadPlans.reduce((s, p) => s + p.utilizationPct, 0) / data.loadPlans.length)
    const fleetAvail = data.vehicleFleet.filter(v => v.available === "Available" || v.available === "In Use").length
    const fleetUtil = Math.round(data.vehicleFleet.reduce((s, v) => s + v.avgUtilPct, 0) / data.vehicleFleet.length)
    const latestCost = data.costAnalysis[data.costAnalysis.length - 1]
    const totalCost = latestCost.totalCost
    const avgOnTime = Math.round(data.routeAnalysis.reduce((s, r) => s + r.onTimePct, 0) / data.routeAnalysis.length)
    const avgSavings = +(data.costAnalysis.reduce((s, c) => s + Number(c.savingsPct), 0) / data.costAnalysis.length).toFixed(1)
    return { totalLoads: data.loadPlans.length, avgUtil, fleetUtil, monthlyCost: totalCost, onTimeRate: avgOnTime, savingsPct: avgSavings, fleetAvail }
  }, [data])

  // ── Dashboard chart data ───────────────────────────────────────────────
  const monthlyLoadData = useMemo(() => {
    return data.costAnalysis.slice(-12).map((c, idx) => ({
      month: c.month,
      loads: c.loadsHandled,
      utilization: 70 + Math.round((idx / 11) * 18 + (idx % 3) * 3),
    }))
  }, [data])

  const loadTypePie = useMemo(() => {
    const counts: Record<string, number> = {}
    data.loadPlans.forEach(p => { counts[p.loadType] = (counts[p.loadType] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [data])

  const vehicleUtilBars = useMemo(() => {
    const map: Record<string, { total: number; util: number }> = {}
    data.vehicleFleet.forEach(v => {
      if (!map[v.vehicleType]) map[v.vehicleType] = { total: 0, util: 0 }
      map[v.vehicleType].total++
      map[v.vehicleType].util += v.avgUtilPct
    })
    return Object.entries(map).map(([name, d]) => ({
      name: name.length > 12 ? name.slice(0, 12) + "…" : name,
      avgUtil: Math.round(d.util / d.total),
    }))
  }, [data])

  const congestionPie = useMemo(() => {
    const counts: Record<string, number> = {}
    data.routeAnalysis.forEach(r => { counts[r.congestionLevel] = (counts[r.congestionLevel] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [data])

  const carrierRadar = useMemo(() => {
    return data.carriers.slice(0, 10).map((c, idx) => ({
      carrier: c.length > 8 ? c.slice(0, 8) : c,
      onTime: 70 + Math.round((idx % 5) * 3 + idx),
      cost: 65 + Math.round((idx % 7) * 4 + idx * 0.5),
      utilization: 60 + Math.round((idx % 6) * 5),
      reliability: 75 + Math.round((idx % 4) * 4),
    }))
  }, [data])

  // ── Filtered/sorted tables ──────────────────────────────────────────────
  const filteredPlans = useMemo(() => {
    return data.loadPlans.filter(p => {
      if (search && !p.id.toLowerCase().includes(search.toLowerCase()) && !p.route.toLowerCase().includes(search.toLowerCase())) return false
      if (filterRoute !== "all" && p.route !== filterRoute) return false
      if (filterStatus !== "all" && p.status !== filterStatus) return false
      if (filterPriority !== "all" && p.priority !== filterPriority) return false
      return true
    }).sort(sortCmp)
  }, [data, search, filterRoute, filterStatus, filterPriority, sortBy, sortDir])

  const filteredOpt = useMemo(() => {
    return data.loadOptimization.filter(o => {
      if (search && !o.id.toLowerCase().includes(search.toLowerCase())) return false
      if (filterVehicle !== "all" && o.vehicleType !== filterVehicle) return false
      return true
    }).sort(sortCmp)
  }, [data, search, filterVehicle, sortBy, sortDir])

  const filteredFleet = useMemo(() => {
    return data.vehicleFleet.filter(v => {
      if (search && !v.id.toLowerCase().includes(search.toLowerCase()) && !v.plateNo.toLowerCase().includes(search.toLowerCase())) return false
      if (filterVehicle !== "all" && v.vehicleType !== filterVehicle) return false
      if (filterAvail !== "all" && v.available !== filterAvail) return false
      return true
    }).sort(sortCmp)
  }, [data, search, filterVehicle, filterAvail, sortBy, sortDir])

  const filteredRoutes = useMemo(() => {
    return data.routeAnalysis.filter(r => {
      if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.route.toLowerCase().includes(search.toLowerCase())) return false
      if (filterCongestion !== "all" && r.congestionLevel !== filterCongestion) return false
      return true
    }).sort(sortCmp)
  }, [data, search, filterCongestion, sortBy, sortDir])

  // ── Cost chart data ────────────────────────────────────────────────────
  const costTrend = useMemo(() => data.costAnalysis.slice(-12), [data])
  const costVsTarget = useMemo(() =>
    costTrend.map(c => ({ month: c.month.split(" ")[0], actual: c.totalCost, target: c.targetCost })),
    [costTrend]
  )
  const savingsTrend = useMemo(() =>
    costTrend.map(c => ({ month: c.month.split(" ")[0], savings: Number(c.savingsPct) })),
    [costTrend]
  )
  const revVsCost = useMemo(() =>
    costTrend.map(c => ({ month: c.month.split(" ")[0], revenue: c.revenue, cost: c.totalCost })),
    [costTrend]
  )

  const costKpis = useMemo(() => {
    const latest = data.costAnalysis[data.costAnalysis.length - 1]
    return { fuel: latest.fuelCost, labor: latest.laborCost, maint: latest.vehicleMaint, toll: latest.tollCost }
  }, [data])

  return (
    <div className="lpo-root">
      <PageHeader title="Load Planning & Optimization" description="Plan, optimize and manage warehouse loads, fleet utilization, routes and cost analytics" />

      {/* Tabs */}
      <div className="lpo-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={cn("lpo-tab", tab === i && "lpo-tab-active")} onClick={() => { setTab(i); setSearch("") }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Tab 0: Dashboard ─────────────────────────────────────────── */}
      {tab === 0 && (
        <div className="lpo-tab-content">
          <div className="lpo-kpi-grid">
            <KpiCard fields={{ label: "Total Loads Planned", value: String(kpis.totalLoads), sub: "Across all warehouses" }} />
            <KpiCard fields={{ label: "Avg Utilization", value: `${kpis.avgUtil}%`, sub: "Weight + Volume combined" }} />
            <KpiCard fields={{ label: "Fleet Utilization", value: `${kpis.fleetUtil}%`, sub: `${kpis.fleetAvail}/${data.vehicleFleet.length} active` }} />
            <KpiCard fields={{ label: "Monthly Cost", value: formatINR(kpis.monthlyCost), sub: "Latest month total" }} />
            <KpiCard fields={{ label: "On-Time Rate", value: `${kpis.onTimeRate}%`, sub: "Route delivery SLA" }} />
            <KpiCard fields={{ label: "Cost Savings", value: `${kpis.savingsPct}%`, sub: "Average monthly savings" }} />
          </div>

          <div className="lpo-chart-grid">
            <div className="lpo-chart-card">
              <h3>Monthly Loads & Utilization</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlyLoadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="loads" fill={C.teal} stroke={C.teal} fillOpacity={0.3} />
                  <Area type="monotone" dataKey="utilization" stroke={C.indigo} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="lpo-chart-card">
              <h3>Load Type Mix</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={loadTypePie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2}>
                    {loadTypePie.map((_, i) => <Cell key={i} fill={CC[i % CC.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="lpo-chart-card">
              <h3>Vehicle Utilization by Type</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={vehicleUtilBars}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="avgUtil" fill={C.teal} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="lpo-chart-card">
              <h3>Route Congestion</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={congestionPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2}>
                    {congestionPie.map((_, i) => (
                      <Cell key={i} fill={[C.emerald, C.amber, C.rose, "#1e293b"][i] || C.slate} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="lpo-chart-card lpo-chart-wide">
              <h3>Carrier Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={carrierRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="carrier" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar name="On-Time" dataKey="onTime" stroke={C.teal} fill={C.teal} fillOpacity={0.15} />
                  <Radar name="Cost Eff" dataKey="cost" stroke={C.amber} fill={C.amber} fillOpacity={0.1} />
                  <Radar name="Utilization" dataKey="utilization" stroke={C.indigo} fill={C.indigo} fillOpacity={0.1} />
                  <Radar name="Reliability" dataKey="reliability" stroke={C.rose} fill={C.rose} fillOpacity={0.1} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 1: Load Plans ─────────────────────────────────────────── */}
      {tab === 1 && (
        <div className="lpo-tab-content">
          <div className="lpo-filters">
            <input className="lpo-search" placeholder="Search ID or route…" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="lpo-select" value={filterRoute} onChange={e => setFilterRoute(e.target.value)}>
              <option value="all">All Routes</option>
              {data.routeZones.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="lpo-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              {data.loadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="lpo-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              {data.priorityLevels.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="lpo-table-wrap">
            <table className="lpo-table">
              <thead>
                <tr>
                  {SH("ID", "id")}
                  {SH("Route", "route")}
                  {SH("Vehicle", "vehicleType")}
                  {SH("Carrier", "carrier")}
                  {SH("Load Type", "loadType")}
                  {SH("Weight (T)", "weightTon")}
                  {SH("Volume (CBM)", "volumeCbm")}
                  {SH("Utilization", "utilizationPct")}
                  {SH("Priority", "priority")}
                  {SH("Status", "status")}
                </tr>
              </thead>
              <tbody className="lpo-tbody">
                {filteredPlans.slice(0, 50).map(p => (
                  <tr key={p.id} className="lpo-row-click" onClick={() => setDrawerData(p)}>
                    <td className="font-mono text-xs">{p.id}</td>
                    <td className="text-xs">{p.route}</td>
                    <td className="text-xs">{p.vehicleType}</td>
                    <td className="text-xs">{p.carrier}</td>
                    <td className="text-xs">{p.loadType}</td>
                    <td className="text-xs text-right">{p.weightTon}</td>
                    <td className="text-xs text-right">{p.volumeCbm}</td>
                    <td><UtilBar fields={p.utilizationPct} /></td>
                    <td><PriorityBadge fields={p.priority} /></td>
                    <td><StatusBadge fields={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <LoadPlanDrawer item={drawerData} onClose={() => setDrawerData(null)} />
        </div>
      )}

      {/* ── Tab 2: Optimization ──────────────────────────────────────── */}
      {tab === 2 && (
        <div className="lpo-tab-content">
          <div className="lpo-filters">
            <input className="lpo-search" placeholder="Search ID…" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="lpo-select" value={filterVehicle} onChange={e => setFilterVehicle(e.target.value)}>
              <option value="all">All Vehicles</option>
              {data.vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="lpo-table-wrap">
            <table className="lpo-table">
              <thead>
                <tr>
                  {SH("ID", "id")}
                  {SH("Plan ID", "planId")}
                  {SH("Vehicle", "vehicleType")}
                  {SH("Weight Util%", "weightUtilPct")}
                  {SH("Volume Util%", "volumeUtilPct")}
                  {SH("Combined %", "combinedUtilPct")}
                  {SH("Saving", "potentialSaving")}
                  {SH("Improvement", "suggestedImprovement")}
                </tr>
              </thead>
              <tbody className="lpo-tbody">
                {filteredOpt.slice(0, 50).map(o => (
                  <tr key={o.id} className="lpo-row-click" onClick={() => setDrawerData(o)}>
                    <td className="font-mono text-xs">{o.id}</td>
                    <td className="font-mono text-xs">{o.planId}</td>
                    <td className="text-xs">{o.vehicleType}</td>
                    <td><UtilBar fields={o.weightUtilPct} /></td>
                    <td><UtilBar fields={o.volumeUtilPct} /></td>
                    <td className="text-xs text-right font-semibold">{o.combinedUtilPct}%</td>
                    <td className="text-xs text-right">{formatINR(o.potentialSaving)}</td>
                    <td><ImprovementBadge fields={o.suggestedImprovement} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <OptimizationDrawer item={drawerData} onClose={() => setDrawerData(null)} />
        </div>
      )}

      {/* ── Tab 3: Fleet ────────────────────────────────────────────── */}
      {tab === 3 && (
        <div className="lpo-tab-content">
          <div className="lpo-filters">
            <input className="lpo-search" placeholder="Search ID or plate…" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="lpo-select" value={filterVehicle} onChange={e => setFilterVehicle(e.target.value)}>
              <option value="all">All Types</option>
              {data.vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="lpo-select" value={filterAvail} onChange={e => setFilterAvail(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
          <div className="lpo-table-wrap">
            <table className="lpo-table">
              <thead>
                <tr>
                  {SH("ID", "id")}
                  {SH("Vehicle Type", "vehicleType")}
                  {SH("Plate No", "plateNo")}
                  {SH("Capacity (T)", "capacityTon")}
                  {SH("Volume (CBM)", "volumeCbm")}
                  {SH("Available", "available")}
                  {SH("Location", "currentLocation")}
                  {SH("Trips", "totalTrips")}
                  {SH("Avg Util%", "avgUtilPct")}
                  {SH("Fuel Eff", "fuelEfficiency")}
                </tr>
              </thead>
              <tbody className="lpo-tbody">
                {filteredFleet.map(v => (
                  <tr key={v.id} className="lpo-row-click" onClick={() => setDrawerData(v)}>
                    <td className="font-mono text-xs">{v.id}</td>
                    <td className="text-xs">{v.vehicleType}</td>
                    <td className="font-mono text-xs">{v.plateNo}</td>
                    <td className="text-xs text-right">{v.capacityTon}</td>
                    <td className="text-xs text-right">{v.volumeCbm}</td>
                    <td><AvailableBadge fields={v.available} /></td>
                    <td className="text-xs">{v.currentLocation}</td>
                    <td className="text-xs text-right">{v.totalTrips}</td>
                    <td><UtilBar fields={v.avgUtilPct} /></td>
                    <td className="text-xs text-right">{v.fuelEfficiency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FleetDrawer item={drawerData} onClose={() => setDrawerData(null)} />
        </div>
      )}

      {/* ── Tab 4: Routes ────────────────────────────────────────────── */}
      {tab === 4 && (
        <div className="lpo-tab-content">
          <div className="lpo-filters">
            <input className="lpo-search" placeholder="Search ID or route…" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="lpo-select" value={filterCongestion} onChange={e => setFilterCongestion(e.target.value)}>
              <option value="all">All Congestion</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="lpo-table-wrap">
            <table className="lpo-table">
              <thead>
                <tr>
                  {SH("ID", "id")}
                  {SH("Route", "route")}
                  {SH("Distance (km)", "distanceKm")}
                  {SH("Avg Time (hrs)", "avgTimeHrs")}
                  {SH("Avg Cost", "avgCost")}
                  {SH("Frequency", "loadFrequency")}
                  {SH("On-Time %", "onTimePct")}
                  {SH("Congestion", "congestionLevel")}
                  {SH("Accidents", "accidentCount")}
                </tr>
              </thead>
              <tbody className="lpo-tbody">
                {filteredRoutes.slice(0, 50).map(r => (
                  <tr key={r.id} className="lpo-row-click" onClick={() => setDrawerData(r)}>
                    <td className="font-mono text-xs">{r.id}</td>
                    <td className="text-xs">{r.route}</td>
                    <td className="text-xs text-right">{r.distanceKm}</td>
                    <td className="text-xs text-right">{r.avgTimeHrs}</td>
                    <td className="text-xs text-right">{formatINR(r.avgCost)}</td>
                    <td className="text-xs text-right">{r.loadFrequency}</td>
                    <td><OnTimeBadge fields={r.onTimePct} /></td>
                    <td><CongestionBadge fields={r.congestionLevel} /></td>
                    <td className="text-xs text-right">{r.accidentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <RouteDrawer item={drawerData} onClose={() => setDrawerData(null)} />
        </div>
      )}

      {/* ── Tab 5: Cost Analytics ───────────────────────────────────── */}
      {tab === 5 && (
        <div className="lpo-tab-content">
          <div className="lpo-chart-grid">
            <div className="lpo-chart-card">
              <h3>Monthly Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={costTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="fuelCost" stackId="a" fill={C.amber} stroke={C.amber} fillOpacity={0.6} />
                  <Area type="monotone" dataKey="laborCost" stackId="a" fill={C.sky} stroke={C.sky} fillOpacity={0.6} />
                  <Area type="monotone" dataKey="vehicleMaint" stackId="a" fill={C.rose} stroke={C.rose} fillOpacity={0.6} />
                  <Area type="monotone" dataKey="tollCost" stackId="a" fill={C.purple} stroke={C.purple} fillOpacity={0.6} />
                  <Area type="monotone" dataKey="delayPenalty" stackId="a" fill={C.orange} stroke={C.orange} fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="lpo-chart-card">
              <h3>Cost vs Target</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={costVsTarget}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="actual" fill={C.rose} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="target" fill={C.teal} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="lpo-chart-card">
              <h3>Savings % Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={savingsTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="savings" stroke={C.emerald} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="lpo-chart-card">
              <h3>Revenue vs Cost</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revVsCost}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="revenue" fill={C.teal} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="cost" fill={C.rose} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lpo-summary-grid">
            <SummaryCard fields={{ label: "Fuel Cost", value: formatINR(costKpis.fuel), border: C.amber }} />
            <SummaryCard fields={{ label: "Labor Cost", value: formatINR(costKpis.labor), border: C.sky }} />
            <SummaryCard fields={{ label: "Maintenance", value: formatINR(costKpis.maint), border: C.rose }} />
            <SummaryCard fields={{ label: "Toll Cost", value: formatINR(costKpis.toll), border: C.purple }} />
            <SummaryCard fields={{ label: "Total Cost", value: formatINR(costKpis.fuel + costKpis.labor + costKpis.maint + costKpis.toll), border: C.slate }} />
            <SummaryCard fields={{ label: "Avg Savings", value: `${kpis.savingsPct}%`, border: C.emerald }} />
          </div>
        </div>
      )}
    </div>
  )
}
