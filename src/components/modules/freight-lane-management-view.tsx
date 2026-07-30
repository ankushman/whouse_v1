"use client"
import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const WAREHOUSES = ["Mumbai DC", "Delhi Hub", "Chennai DC", "Bangalore FC", "Pune WH", "Hyderabad DC", "Kolkata WH", "Ahmedabad FC"] as const
const LANES = ["Mumbai-Delhi", "Delhi-Chennai", "Chennai-Bangalore", "Mumbai-Pune", "Delhi-Kolkata", "Hyderabad-Mumbai", "Pune-Bangalore", "Ahmedabad-Delhi", "Kolkata-Guwahati", "Mumbai-Hyderabad", "Delhi-Jaipur", "Chennai-Kochi"] as const
const MODES = ["Road FTL", "Road LTL", "Rail", "Air", "Sea", "Multimodal", "Express Courier", "Parcel"] as const
const CARRIERS = ["BlueDart", "DTDC", "Delhivery", "Gati", "TNT Express", "FedEx India", "DHL India", "Container Corp", "Indian Railways", "VRL Logistics"] as const
const SHIPMENT_TYPES = ["FCL", "LTL", "Parcel", "Palletized", "Bulk", "Oversized", "Temperature Controlled", "Hazmat"] as const
const LANE_STATUSES = ["Active", "Under Review", "Seasonal", "Suspended", "New"] as const
const PRIORITY_LEVELS = ["Critical", "High", "Medium", "Low", "Routine"] as const
const SERVICE_LEVELS = ["Standard", "Express", "Next Day", "Same Day", "Economy", "Guaranteed"] as const
const SHIP_STATUSES = ["Booked", "In Transit", "At Hub", "Out for Delivery", "Delivered", "Cancelled"] as const

const C = { teal: "#0d9488", indigo: "#6366f1", rose: "#e11d48", amber: "#d97706", emerald: "#059669", sky: "#0284c7", purple: "#7c3aed", slate: "#475569", orange: "#ea580c" }
const CC = [C.teal, C.indigo, C.rose, C.amber, C.emerald, C.sky, C.purple, C.orange, "#65a30d", C.slate]

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

function formatINR(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`
  return `₹${v.toLocaleString("en-IN")}`
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flm-rating-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={s <= Math.round(rating) ? "flm-star-filled" : "flm-star-empty"}>★</span>
      ))}
      <span className="flm-rating-value">{rating.toFixed(1)}</span>
    </span>
  )
}

function generateData() {
  const rand = seededRandom(187)
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
  const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

  const origins = ["Mumbai", "Delhi", "Chennai", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Ahmedabad", "Jaipur", "Guwahati", "Kochi"]
  const dests = ["Mumbai", "Delhi", "Chennai", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Ahmedabad", "Jaipur", "Guwahati", "Kochi"]

  const freightLanes = Array.from({ length: 80 }, (_, i) => {
    const ln = pick(LANES)
    const parts = ln.split("-")
    return {
      id: `FL-${String(i + 1).padStart(4, "0")}`,
      laneName: ln,
      origin: parts[0] || pick(origins),
      destination: parts[1] || pick(dests),
      mode: pick(MODES),
      carrier: pick(CARRIERS),
      distanceKm: rInt(150, 2200),
      transitTimeHrs: rInt(4, 72),
      costPerTon: rInt(800, 15000),
      capacityUtilPct: rInt(30, 98),
      onTimePct: rInt(65, 99),
      shipmentsMonth: rInt(5, 120),
      revenue: rInt(50000, 5000000),
      status: pick(LANE_STATUSES),
      serviceLevel: pick(SERVICE_LEVELS),
      warehouse: pick(WAREHOUSES),
      rating: +(rand() * 3 + 2).toFixed(1),
    }
  })

  const shipments = Array.from({ length: 120 }, (_, i) => {
    const planned = rInt(6, 72)
    const actual = planned + rInt(-4, 12)
    return {
      id: `SHP-${String(i + 1).padStart(5, "0")}`,
      laneName: pick(LANES),
      carrier: pick(CARRIERS),
      mode: pick(MODES),
      shipmentType: pick(SHIPMENT_TYPES),
      weightTon: +(rand() * 25 + 0.5).toFixed(1),
      cost: rInt(5000, 400000),
      status: pick(SHIP_STATUSES),
      priority: pick(PRIORITY_LEVELS),
      pickupDate: `2026-07-${String(rInt(1, 28)).padStart(2, "0")}`,
      deliveryDate: `2026-07-${String(rInt(1, 31)).padStart(2, "0")}`,
      actualTimeHrs: actual,
      plannedTimeHrs: planned,
      delayHrs: Math.max(0, actual - planned),
      warehouse: pick(WAREHOUSES),
      serviceLevel: pick(SERVICE_LEVELS),
    }
  })

  const rateAnalysis = Array.from({ length: 60 }, (_, i) => {
    const base = rInt(5000, 25000)
    const fuel = Math.round(base * (rand() * 0.15 + 0.05))
    const handling = rInt(500, 5000)
    const insurance = rInt(200, 3000)
    const total = base + fuel + handling + insurance
    const market = Math.round(total * (rand() * 0.3 + 0.85))
    return {
      id: `RATE-${String(i + 1).padStart(4, "0")}`,
      laneName: pick(LANES),
      mode: pick(MODES),
      carrier: pick(CARRIERS),
      baseRate: base,
      fuelSurcharge: fuel,
      handlingFee: handling,
      insuranceCost: insurance,
      totalRate: total,
      marketAvg: market,
      savingsPct: market > total ? Math.round(((market - total) / market) * 100) : -Math.round(((total - market) / market) * 100),
      effectiveDate: `2026-${String(rInt(1, 12)).padStart(2, "0")}-${String(rInt(1, 28)).padStart(2, "0")}`,
    }
  })

  const performanceMetrics = Array.from({ length: 50 }, (_, i) => {
    const total = rInt(10, 200)
    const onTime = Math.round(total * (rand() * 0.35 + 0.6))
    const damage = rInt(0, Math.round(total * 0.05))
    const claims = rInt(0, damage)
    return {
      id: `PM-${String(i + 1).padStart(4, "0")}`,
      laneName: pick(LANES),
      carrier: pick(CARRIERS),
      mode: pick(MODES),
      shipmentsTotal: total,
      onTimeCount: onTime,
      damageCount: damage,
      claimsCount: claims,
      avgTransitHrs: +(rand() * 40 + 4).toFixed(1),
      avgCostPerTon: rInt(1000, 12000),
      customerSatScore: +(rand() * 3 + 2).toFixed(1),
      month: `${String(rInt(1, 12)).padStart(2, "0")}/2026`,
    }
  })

  const laneCapacity = Array.from({ length: 40 }, (_, i) => {
    const maxCap = rInt(50, 500)
    const cur = Math.round(maxCap * (rand() * 0.7 + 0.2))
    return {
      id: `CAP-${String(i + 1).padStart(4, "0")}`,
      laneName: pick(LANES),
      mode: pick(MODES),
      maxCapacity: maxCap,
      currentLoad: cur,
      availableCapacity: maxCap - cur,
      peakUtilPct: rInt(60, 100),
      avgUtilPct: rInt(40, 95),
      waitTimeHrs: +(rand() * 12 + 0.5).toFixed(1),
      congestionLevel: pick(["Low", "Medium", "High", "Critical"] as const),
      seasonalFactor: +(rand() * 0.6 + 0.7).toFixed(2),
    }
  })

  return {
    freightLanes, shipments, rateAnalysis, performanceMetrics, laneCapacity,
    warehouses: WAREHOUSES, lanes: LANES, modes: MODES, carriers: CARRIERS,
    shipmentTypes: SHIPMENT_TYPES, laneStatuses: LANE_STATUSES, priorityLevels: PRIORITY_LEVELS,
    serviceLevels: SERVICE_LEVELS, shipStatuses: SHIP_STATUSES,
  }
}

export default function FreightLaneManagementView() {
  const [tab, setTab] = useState(0)
  const [drawerData, setDrawerData] = useState<any>(null)
  const data = useMemo(() => generateData(), [])
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortDir, setSortDir] = useState("asc")

  const tabs = ["Dashboard", "Lanes", "Shipments", "Rate Analysis", "Performance", "Capacity"]

  const sortFn = (a: any, b: any) => {
    const av = a[sortBy], bv = b[sortBy]
    const m = typeof av === "string" ? av.localeCompare(bv) : av - bv
    return sortDir === "asc" ? m : -m
  }

  // ─── Dashboard KPIs ───
  const kpiData = useMemo(() => {
    const active = data.freightLanes.filter(l => l.status === "Active").length
    const avgOnTime = Math.round(data.freightLanes.reduce((s, l) => s + l.onTimePct, 0) / data.freightLanes.length)
    const totalRev = data.freightLanes.reduce((s, l) => s + l.revenue, 0)
    const avgUtil = Math.round(data.freightLanes.reduce((s, l) => s + l.capacityUtilPct, 0) / data.freightLanes.length)
    const avgRating = (data.freightLanes.reduce((s, l) => s + l.rating, 0) / data.freightLanes.length).toFixed(1)
    const activeShip = data.shipments.filter(s => ["In Transit", "At Hub", "Out for Delivery"].includes(s.status)).length
    return [
      { label: "Active Lanes", value: active, sub: `of ${data.freightLanes.length} total`, color: C.teal },
      { label: "Avg On-Time %", value: `${avgOnTime}%`, sub: "last 30 days", color: C.emerald },
      { label: "Monthly Revenue", value: formatINR(totalRev), sub: "across all lanes", color: C.indigo },
      { label: "Avg Utilization", value: `${avgUtil}%`, sub: "capacity used", color: C.sky },
      { label: "Avg Rating", value: avgRating, sub: "carrier score", color: C.amber },
      { label: "Active Shipments", value: activeShip, sub: `of ${data.shipments.length}`, color: C.rose },
    ]
  }, [data])

  // ─── Dashboard Charts Data ───
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyShip = months.map((m, i) => ({
      month: m,
      shipments: Math.floor(Math.random() * 200 + 80),
      revenue: Math.floor(Math.random() * 2000000 + 1000000),
    }))
    const modeMix = [...MODES].map(m => ({
      name: m,
      value: data.freightLanes.filter(l => l.mode === m).length || Math.floor(Math.random() * 20 + 3),
    }))
    const topLanes = [...data.freightLanes].sort((a, b) => b.revenue - a.revenue).slice(0, 8)
    const statusMix = [...LANE_STATUSES].map(s => ({
      name: s,
      value: data.freightLanes.filter(l => l.status === s).length,
    }))
    const carrierPerf = [...CARRIERS].map(c => {
      const cl = data.freightLanes.filter(l => l.carrier === c)
      return {
        carrier: c,
        onTime: cl.length ? Math.round(cl.reduce((s, l) => s + l.onTimePct, 0) / cl.length) : 70,
        cost: cl.length ? Math.round(cl.reduce((s, l) => s + l.costPerTon, 0) / cl.length) : 5000,
        reliability: cl.length ? Math.round(cl.reduce((s, l) => s + l.rating, 0) / cl.length * 20) : 60,
        volume: cl.length ? Math.min(100, cl.reduce((s, l) => s + l.shipmentsMonth, 0) / 10) : 30,
      }
    })
    return { monthlyShip, modeMix, topLanes, statusMix, carrierPerf }
  }, [data])

  // ─── Tab 1: Lanes filtered ───
  const filteredLanes = useMemo(() => {
    let list = [...data.freightLanes]
    if (search) list = list.filter(l => l.id.toLowerCase().includes(search.toLowerCase()) || l.laneName.toLowerCase().includes(search.toLowerCase()) || l.carrier.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter(l => l.mode === filterType)
    if (filterStatus !== "all") list = list.filter(l => l.status === filterStatus)
    return list.sort(sortFn)
  }, [data, search, filterType, filterStatus, sortBy, sortDir])

  // ─── Tab 2: Shipments filtered ───
  const filteredShipments = useMemo(() => {
    let list = [...data.shipments]
    if (search) list = list.filter(s => s.id.toLowerCase().includes(search.toLowerCase()) || s.laneName.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter(s => s.priority === filterType)
    if (filterStatus !== "all") list = list.filter(s => s.status === filterStatus)
    return list.sort(sortFn)
  }, [data, search, filterType, filterStatus, sortBy, sortDir])

  // ─── Tab 4: Performance filtered ───
  const filteredPerf = useMemo(() => {
    let list = [...data.performanceMetrics]
    if (search) list = list.filter(p => p.id.toLowerCase().includes(search.toLowerCase()) || p.laneName.toLowerCase().includes(search.toLowerCase()) || p.carrier.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter(p => p.carrier === filterType)
    if (filterStatus !== "all") list = list.filter(p => p.mode === filterStatus)
    return list.sort(sortFn)
  }, [data, search, filterType, filterStatus, sortBy, sortDir])

  // ─── Tab 5: Capacity filtered ───
  const filteredCap = useMemo(() => {
    let list = [...data.laneCapacity]
    if (search) list = list.filter(c => c.id.toLowerCase().includes(search.toLowerCase()) || c.laneName.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter(c => c.mode === filterType)
    if (filterStatus !== "all") list = list.filter(c => c.congestionLevel === filterStatus)
    return list.sort(sortFn)
  }, [data, search, filterType, filterStatus, sortBy, sortDir])

  const handleSort = (col: string) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortBy(col); setSortDir("asc") }
  }

  // ─── Drawers ───
  function LaneDrawer({ item, onClose }: { item: any; onClose: () => void }) {
    return (
      <>
        <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
          <SheetContent>
            <div className="flm-drawer-header">
              <h3 className="flm-drawer-title">{item?.laneName}</h3>
              <span className={cn("flm-mode-badge flm-mode-badge-" + (item?.mode || "").toLowerCase().replace(/\s+/g, "-"), "")}>{item?.mode}</span>
              <span className={cn("flm-status-badge flm-status-badge-" + (item?.status || "active").toLowerCase().replace(/\s+/g, "-"), "")}>{item?.status}</span>
            </div>
            <div className="flm-drawer-body">
              <div className="flm-rating-section"><RatingStars rating={item?.rating || 0} /></div>
              <div className="flm-util-section">
                <div className="flm-util-label">Utilization {item?.capacityUtilPct}%</div>
                <div className="flm-util-bar"><div className={cn("flm-util-fill", item?.capacityUtilPct > 90 ? "flm-util-teal" : item?.capacityUtilPct > 70 ? "flm-util-green" : item?.capacityUtilPct > 40 ? "flm-util-amber" : "flm-util-red")} style={{ width: `${item?.capacityUtilPct}%` }} /></div>
              </div>
              <div className="flm-metrics-grid">
                <div className="flm-metric-card"><div className="flm-metric-value">{formatINR(item?.costPerTon || 0)}/T</div><div className="flm-metric-label">Cost/Ton</div></div>
                <div className="flm-metric-card"><div className="flm-metric-value">{item?.onTimePct}%</div><div className="flm-metric-label">On-Time</div></div>
                <div className="flm-metric-card"><div className="flm-metric-value">{item?.shipmentsMonth}/mo</div><div className="flm-metric-label">Shipments</div></div>
              </div>
              <div className="flm-fields-grid">
                <div className="flm-field"><span className="flm-field-label">Distance</span><span className="flm-field-value">{item?.distanceKm} km</span></div>
                <div className="flm-field"><span className="flm-field-label">Transit</span><span className="flm-field-value">{item?.transitTimeHrs} hrs</span></div>
                <div className="flm-field"><span className="flm-field-label">Revenue</span><span className="flm-field-value">{formatINR(item?.revenue || 0)}</span></div>
                <div className="flm-field"><span className="flm-field-label">Service</span><span className="flm-field-value">{item?.serviceLevel}</span></div>
                <div className="flm-field"><span className="flm-field-label">Warehouse</span><span className="flm-field-value">{item?.warehouse}</span></div>
                <div className="flm-field"><span className="flm-field-label">Carrier</span><span className="flm-field-value">{item?.carrier}</span></div>
              </div>
              <div className="flm-drawer-actions">
                <button className="flm-action-btn flm-action-primary">Edit Lane</button>
                <button className="flm-action-btn flm-action-secondary">View Analytics</button>
                <button className="flm-action-btn flm-action-outline">Manage Capacity</button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  function ShipmentDrawer({ item, onClose }: { item: any; onClose: () => void }) {
    return (
      <>
        <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
          <SheetContent>
            <div className="flm-drawer-header">
              <h3 className="flm-drawer-title">{item?.id}</h3>
              <span className={cn("flm-priority-badge flm-priority-badge-" + (item?.priority || "medium").toLowerCase(), "")}>{item?.priority}</span>
              <span className={cn("flm-ship-status-badge flm-ship-status-badge-" + (item?.status || "booked").toLowerCase().replace(/\s+/g, "-"), "")}>{item?.status}</span>
            </div>
            <div className="flm-drawer-body">
              <div className="flm-delay-section">
                <span className={cn("flm-delay-badge", item?.delayHrs > 2 ? "flm-delay-rose" : item?.delayHrs > 0 ? "flm-delay-amber" : "flm-delay-ok")}>
                  {item?.delayHrs > 0 ? `${item?.delayHrs}h delay` : "On Time"}
                </span>
              </div>
              <div className="flm-metrics-grid">
                <div className="flm-metric-card"><div className="flm-metric-value">{formatINR(item?.cost || 0)}</div><div className="flm-metric-label">Total Cost</div></div>
                <div className="flm-metric-card"><div className="flm-metric-value">{item?.weightTon}T</div><div className="flm-metric-label">Weight</div></div>
                <div className="flm-metric-card"><div className="flm-metric-value">{item?.actualTimeHrs}h</div><div className="flm-metric-label">Actual Transit</div></div>
              </div>
              <div className="flm-fields-grid">
                <div className="flm-field"><span className="flm-field-label">Lane</span><span className="flm-field-value">{item?.laneName}</span></div>
                <div className="flm-field"><span className="flm-field-label">Carrier</span><span className="flm-field-value">{item?.carrier}</span></div>
                <div className="flm-field"><span className="flm-field-label">Mode</span><span className="flm-field-value">{item?.mode}</span></div>
                <div className="flm-field"><span className="flm-field-label">Type</span><span className="flm-field-value">{item?.shipmentType}</span></div>
                <div className="flm-field"><span className="flm-field-label">Pickup</span><span className="flm-field-value">{item?.pickupDate}</span></div>
                <div className="flm-field"><span className="flm-field-label">Delivery</span><span className="flm-field-value">{item?.deliveryDate}</span></div>
              </div>
              <div className="flm-drawer-actions">
                <button className="flm-action-btn flm-action-primary">Track Shipment</button>
                <button className="flm-action-btn flm-action-secondary">Update Status</button>
                <button className="flm-action-btn flm-action-outline">Generate BOL</button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  function PerfDrawer({ item, onClose }: { item: any; onClose: () => void }) {
    const otp = item?.shipmentsTotal ? Math.round((item?.onTimeCount / item?.shipmentsTotal) * 100) : 0
    const dmg = item?.shipmentsTotal ? ((item?.damageCount / item?.shipmentsTotal) * 100).toFixed(1) : "0"
    return (
      <>
        <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
          <SheetContent>
            <div className="flm-drawer-header">
              <h3 className="flm-drawer-title">{item?.laneName} — {item?.carrier}</h3>
            </div>
            <div className="flm-drawer-body">
              <div className="flm-badges-row">
                <span className={cn("flm-ontime-badge", otp > 90 ? "flm-ontime-green" : otp > 80 ? "flm-ontime-amber" : "flm-ontime-red")}>{otp}% On-Time</span>
                <span className={cn("flm-dmg-badge", parseFloat(dmg) === 0 ? "flm-dmg-green" : parseFloat(dmg) <= 2 ? "flm-dmg-amber" : "flm-dmg-rose")}>{dmg}% Damage</span>
                <span className={cn("flm-sat-badge", item?.customerSatScore > 4 ? "flm-sat-green" : item?.customerSatScore > 3 ? "flm-sat-amber" : "flm-sat-rose")}>{item?.customerSatScore}/5.0</span>
              </div>
              <div className="flm-metrics-grid">
                <div className="flm-metric-card"><div className="flm-metric-value">{item?.shipmentsTotal}</div><div className="flm-metric-label">Total Shipments</div></div>
                <div className="flm-metric-card"><div className="flm-metric-value">{item?.avgTransitHrs}h</div><div className="flm-metric-label">Avg Transit</div></div>
                <div className="flm-metric-card"><div className="flm-metric-value">{formatINR(item?.avgCostPerTon || 0)}/T</div><div className="flm-metric-label">Avg Cost/Ton</div></div>
              </div>
              <div className="flm-fields-grid">
                <div className="flm-field"><span className="flm-field-label">Mode</span><span className="flm-field-value">{item?.mode}</span></div>
                <div className="flm-field"><span className="flm-field-label">Claims</span><span className="flm-field-value">{item?.claimsCount}</span></div>
                <div className="flm-field"><span className="flm-field-label">Month</span><span className="flm-field-value">{item?.month}</span></div>
                <div className="flm-field"><span className="flm-field-label">Damage Count</span><span className="flm-field-value">{item?.damageCount}</span></div>
              </div>
              <div className="flm-drawer-actions">
                <button className="flm-action-btn flm-action-primary">View Details</button>
                <button className="flm-action-btn flm-action-secondary">Export Report</button>
                <button className="flm-action-btn flm-action-outline">Flag Issue</button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  function CapDrawer({ item, onClose }: { item: any; onClose: () => void }) {
    return (
      <>
        <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
          <SheetContent>
            <div className="flm-drawer-header">
              <h3 className="flm-drawer-title">{item?.laneName}</h3>
              <span className={cn("flm-congestion-badge flm-congestion-badge-" + (item?.congestionLevel || "low").toLowerCase(), "")}>{item?.congestionLevel}</span>
            </div>
            <div className="flm-drawer-body">
              <div className="flm-util-section">
                <div className="flm-util-label">Peak Utilization {item?.peakUtilPct}%</div>
                <div className="flm-util-bar"><div className={cn("flm-util-fill", item?.peakUtilPct > 90 ? "flm-util-teal" : item?.peakUtilPct > 70 ? "flm-util-green" : item?.peakUtilPct > 40 ? "flm-util-amber" : "flm-util-red")} style={{ width: `${item?.peakUtilPct}%` }} /></div>
              </div>
              <div className="flm-metrics-grid">
                <div className="flm-metric-card"><div className="flm-metric-value">{item?.currentLoad}/{item?.maxCapacity}</div><div className="flm-metric-label">Current Load</div></div>
                <div className="flm-metric-card"><div className="flm-metric-value">{item?.availableCapacity}</div><div className="flm-metric-label">Available</div></div>
                <div className="flm-metric-card"><div className="flm-metric-value">{item?.waitTimeHrs}h</div><div className="flm-metric-label">Wait Time</div></div>
              </div>
              <div className="flm-fields-grid">
                <div className="flm-field"><span className="flm-field-label">Mode</span><span className="flm-field-value">{item?.mode}</span></div>
                <div className="flm-field"><span className="flm-field-label">Avg Utilization</span><span className="flm-field-value">{item?.avgUtilPct}%</span></div>
                <div className="flm-field"><span className="flm-field-label">Seasonal Factor</span><span className="flm-field-value">{item?.seasonalFactor}x</span></div>
              </div>
              <div className="flm-drawer-actions">
                <button className="flm-action-btn flm-action-primary">Adjust Capacity</button>
                <button className="flm-action-btn flm-action-secondary">View History</button>
                <button className="flm-action-btn flm-action-outline">Set Alert</button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  const thClass = "flm-th"
  const tdClass = "flm-td"

  return (
    <div className="flm-root">
      <PageHeader title="Freight Lane Management" description="Monitor and optimize freight lanes, carrier performance, and rate analysis across India" />
      <div className="flm-tabs">{tabs.map((t, i) => (
        <button key={t} className={cn("flm-tab", tab === i && "flm-tab-active")} onClick={() => setTab(i)}>{t}</button>
      ))}</div>

      {/* ─── Tab 0: Dashboard ─── */}
      {tab === 0 && (
        <div className="flm-tab-content">
          <div className="flm-kpi-grid">{kpiData.map(k => (
            <div key={k.label} className="flm-kpi-card" style={{ borderLeftColor: k.color }}>
              <div className="flm-kpi-label">{k.label}</div>
              <div className="flm-kpi-value">{k.value}</div>
              <div className="flm-kpi-sub">{k.sub}</div>
            </div>
          ))}</div>
          <div className="flm-chart-grid">
            <div className="flm-chart-card"><h4 className="flm-chart-title">Monthly Shipment Volume & Revenue</h4>
              <ResponsiveContainer width="100%" height={250}><AreaChart data={chartData.monthlyShip}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="shipments" stroke={C.teal} fill={C.teal} fillOpacity={0.15} name="Shipments" />
                <Line type="monotone" dataKey="revenue" stroke={C.indigo} strokeDasharray="5 5" yAxisId={0} name="Revenue (₹)" dot={false} />
              </AreaChart></ResponsiveContainer></div>
            <div className="flm-chart-card"><h4 className="flm-chart-title">Mode Distribution</h4>
              <ResponsiveContainer width="100%" height={250}><PieChart>
                <Pie data={chartData.modeMix} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={2}>
                  {chartData.modeMix.map((_, i) => <Cell key={i} fill={CC[i % CC.length]} />)}
                </Pie><Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} /><Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </PieChart></ResponsiveContainer></div>
            <div className="flm-chart-card"><h4 className="flm-chart-title">Top Lanes by Revenue</h4>
              <ResponsiveContainer width="100%" height={250}><BarChart data={chartData.topLanes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis type="number" stroke="#94a3b8" fontSize={12} /><YAxis type="category" dataKey="laneName" stroke="#94a3b8" fontSize={11} width={120} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="revenue" fill={C.teal} radius={[0, 4, 4, 0]} />
              </BarChart></ResponsiveContainer></div>
            <div className="flm-chart-card"><h4 className="flm-chart-title">Lane Status</h4>
              <ResponsiveContainer width="100%" height={250}><PieChart>
                <Pie data={chartData.statusMix} cx="50%" cy="50%" outerRadius={95} dataKey="value" paddingAngle={2}>
                  {chartData.statusMix.map((_, i) => <Cell key={i} fill={CC[i % CC.length]} />)}
                </Pie><Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} /><Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </PieChart></ResponsiveContainer></div>
            <div className="flm-chart-card flm-chart-wide"><h4 className="flm-chart-title">Carrier Performance</h4>
              <ResponsiveContainer width="100%" height={300}><RadarChart data={chartData.carrierPerf.slice(0, 8)}>
                <PolarGrid stroke="#334155" /><PolarAngleAxis dataKey="carrier" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={9} />
                <Radar name="On-Time" dataKey="onTime" stroke={C.teal} fill={C.teal} fillOpacity={0.15} />
                <Radar name="Cost" dataKey="cost" stroke={C.indigo} fill={C.indigo} fillOpacity={0.1} />
                <Radar name="Reliability" dataKey="reliability" stroke={C.rose} fill={C.rose} fillOpacity={0.1} />
                <Radar name="Volume" dataKey="volume" stroke={C.amber} fill={C.amber} fillOpacity={0.1} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
              </RadarChart></ResponsiveContainer></div>
          </div>
        </div>
      )}

      {/* ─── Tab 1: Lanes ─── */}
      {tab === 1 && (
        <div className="flm-tab-content">
          <div className="flm-filter-bar">
            <input className="flm-search" placeholder="Search lanes..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="flm-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">All Modes</option>{[...data.modes].map(m => <option key={m} value={m}>{m}</option>)}</select>
            <select className="flm-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="all">All Status</option>{[...data.laneStatuses].map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="flm-table-wrap"><table className="flm-table"><thead>
            <tr>
              <th className={thClass} onClick={() => handleSort("id")}>ID</th>
              <th className={thClass} onClick={() => handleSort("laneName")}>Lane</th>
              <th className={thClass} onClick={() => handleSort("mode")}>Mode</th>
              <th className={thClass} onClick={() => handleSort("carrier")}>Carrier</th>
              <th className={thClass} onClick={() => handleSort("distanceKm")}>Dist (km)</th>
              <th className={thClass} onClick={() => handleSort("costPerTon")}>Cost/Ton</th>
              <th className={thClass} onClick={() => handleSort("capacityUtilPct")}>Utilization</th>
              <th className={thClass} onClick={() => handleSort("rating")}>Rating</th>
              <th className={thClass} onClick={() => handleSort("onTimePct")}>On-Time</th>
              <th className={thClass} onClick={() => handleSort("status")}>Status</th>
            </tr>
          </thead><tbody>
            {filteredLanes.slice(0, 50).map(l => (
              <tr key={l.id} className="flm-tr" onClick={() => setDrawerData(l)}>
                <td className={tdClass}>{l.id}</td>
                <td className={tdClass}>{l.laneName}</td>
                <td className={tdClass}><span className={cn("flm-mode-badge flm-mode-badge-" + l.mode.toLowerCase().replace(/\s+/g, "-"), "")}>{l.mode}</span></td>
                <td className={tdClass}>{l.carrier}</td>
                <td className={tdClass}>{l.distanceKm}</td>
                <td className={tdClass}>{formatINR(l.costPerTon)}</td>
                <td className={tdClass}><div className="flm-util-bar"><div className={cn("flm-util-fill", l.capacityUtilPct > 90 ? "flm-util-teal" : l.capacityUtilPct > 70 ? "flm-util-green" : l.capacityUtilPct > 40 ? "flm-util-amber" : "flm-util-red")} style={{ width: `${l.capacityUtilPct}%` }} /></div><span className="flm-util-pct">{l.capacityUtilPct}%</span></td>
                <td className={tdClass}><RatingStars rating={l.rating} /></td>
                <td className={tdClass}>{l.onTimePct}%</td>
                <td className={tdClass}><span className={cn("flm-status-badge flm-status-badge-" + l.status.toLowerCase().replace(/\s+/g, "-"), "")}>{l.status}</span></td>
              </tr>
            ))}
          </tbody></table></div>
          {filteredLanes.length > 50 && <div className="flm-showing">Showing 50 of {filteredLanes.length}</div>}
        </div>
      )}

      {/* ─── Tab 2: Shipments ─── */}
      {tab === 2 && (
        <div className="flm-tab-content">
          <div className="flm-filter-bar">
            <input className="flm-search" placeholder="Search shipments..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="flm-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">All Priority</option>{[...data.priorityLevels].map(p => <option key={p} value={p}>{p}</option>)}</select>
            <select className="flm-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="all">All Status</option>{[...data.shipStatuses].map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="flm-table-wrap"><table className="flm-table"><thead>
            <tr>
              <th className={thClass} onClick={() => handleSort("id")}>ID</th>
              <th className={thClass} onClick={() => handleSort("laneName")}>Lane</th>
              <th className={thClass} onClick={() => handleSort("carrier")}>Carrier</th>
              <th className={thClass} onClick={() => handleSort("mode")}>Mode</th>
              <th className={thClass} onClick={() => handleSort("shipmentType")}>Type</th>
              <th className={thClass} onClick={() => handleSort("weightTon")}>Weight</th>
              <th className={thClass} onClick={() => handleSort("cost")}>Cost</th>
              <th className={thClass} onClick={() => handleSort("priority")}>Priority</th>
              <th className={thClass} onClick={() => handleSort("status")}>Status</th>
              <th className={thClass} onClick={() => handleSort("delayHrs")}>Delay</th>
            </tr>
          </thead><tbody>
            {filteredShipments.slice(0, 50).map(s => (
              <tr key={s.id} className="flm-tr" onClick={() => setDrawerData({ ...s, drawerType: "shipment" })}>
                <td className={tdClass}>{s.id}</td>
                <td className={tdClass}>{s.laneName}</td>
                <td className={tdClass}>{s.carrier}</td>
                <td className={tdClass}>{s.mode}</td>
                <td className={tdClass}>{s.shipmentType}</td>
                <td className={tdClass}>{s.weightTon}T</td>
                <td className={tdClass}>{formatINR(s.cost)}</td>
                <td className={tdClass}><span className={cn("flm-priority-badge flm-priority-badge-" + s.priority.toLowerCase(), "")}>{s.priority}</span></td>
                <td className={tdClass}><span className={cn("flm-ship-status-badge flm-ship-status-badge-" + s.status.toLowerCase().replace(/\s+/g, "-"), "")}>{s.status}</span></td>
                <td className={tdClass}><span className={cn("flm-delay-badge", s.delayHrs > 2 ? "flm-delay-rose" : s.delayHrs > 0 ? "flm-delay-amber" : "flm-delay-ok")}>{s.delayHrs > 0 ? `${s.delayHrs}h` : "OK"}</span></td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {/* ─── Tab 3: Rate Analysis ─── */}
      {tab === 3 && (
        <div className="flm-tab-content">
          <div className="flm-chart-grid">
            <div className="flm-chart-card"><h4 className="flm-chart-title">Rate Trend: Actual vs Market Average</h4>
              <ResponsiveContainer width="100%" height={250}><LineChart data={[...data.rateAnalysis].slice(0, 20).map((r, i) => ({ name: `#${i + 1}`, actual: r.totalRate, market: r.marketAvg }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="name" stroke="#94a3b8" fontSize={11} /><YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Line type="monotone" dataKey="actual" stroke={C.teal} strokeWidth={2} name="Actual Rate" />
                <Line type="monotone" dataKey="market" stroke={C.rose} strokeDasharray="5 5" name="Market Avg" />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </LineChart></ResponsiveContainer></div>
            <div className="flm-chart-card"><h4 className="flm-chart-title">Rate by Mode</h4>
              <ResponsiveContainer width="100%" height={250}><BarChart data={[...MODES].map(m => ({ mode: m, avg: Math.round(data.rateAnalysis.filter(r => r.mode === m).reduce((s, r) => s + r.totalRate, 0) / Math.max(1, data.rateAnalysis.filter(r => r.mode === m).length)) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="mode" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" height={60} /><YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="avg" fill={C.indigo} radius={[4, 4, 0, 0]} name="Avg Rate (₹)" />
              </BarChart></ResponsiveContainer></div>
            <div className="flm-chart-card"><h4 className="flm-chart-title">Top Lanes by Cost Savings %</h4>
              <ResponsiveContainer width="100%" height={250}><BarChart data={[...data.rateAnalysis].sort((a, b) => b.savingsPct - a.savingsPct).slice(0, 10).map((r, i) => ({ lane: r.laneName, savings: r.savingsPct }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis type="number" stroke="#94a3b8" fontSize={11} /><YAxis type="category" dataKey="lane" stroke="#94a3b8" fontSize={11} width={110} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="savings" fill={C.emerald} radius={[0, 4, 4, 0]} name="Savings %" />
              </BarChart></ResponsiveContainer></div>
            <div className="flm-chart-card"><h4 className="flm-chart-title">Carrier Rate Comparison</h4>
              <ResponsiveContainer width="100%" height={250}><BarChart data={[...CARRIERS].map(c => ({ carrier: c, avg: Math.round(data.rateAnalysis.filter(r => r.carrier === c).reduce((s, r) => s + r.totalRate, 0) / Math.max(1, data.rateAnalysis.filter(r => r.carrier === c).length)) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="carrier" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" height={60} /><YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="avg" fill={C.amber} radius={[4, 4, 0, 0]} name="Avg Total Rate" />
              </BarChart></ResponsiveContainer></div>
          </div>
          <div className="flm-summary-grid">
            {[
              { label: "Avg Base Rate", value: formatINR(Math.round(data.rateAnalysis.reduce((s, r) => s + r.baseRate, 0) / data.rateAnalysis.length)), sub: "per shipment" },
              { label: "Avg Fuel Surcharge", value: formatINR(Math.round(data.rateAnalysis.reduce((s, r) => s + r.fuelSurcharge, 0) / data.rateAnalysis.length)), sub: "avg per lane" },
              { label: "Avg Handling Fee", value: formatINR(Math.round(data.rateAnalysis.reduce((s, r) => s + r.handlingFee, 0) / data.rateAnalysis.length)), sub: "avg per lane" },
              { label: "Avg Insurance Cost", value: formatINR(Math.round(data.rateAnalysis.reduce((s, r) => s + r.insuranceCost, 0) / data.rateAnalysis.length)), sub: "avg per lane" },
            ].map(k => (
              <div key={k.label} className="flm-summary-card">
                <div className="flm-summary-label">{k.label}</div>
                <div className="flm-summary-value">{k.value}</div>
                <div className="flm-summary-sub">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tab 4: Performance ─── */}
      {tab === 4 && (
        <div className="flm-tab-content">
          <div className="flm-filter-bar">
            <input className="flm-search" placeholder="Search performance..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="flm-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">All Carriers</option>{[...data.carriers].map(c => <option key={c} value={c}>{c}</option>)}</select>
            <select className="flm-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="all">All Modes</option>{[...data.modes].map(m => <option key={m} value={m}>{m}</option>)}</select>
          </div>
          <div className="flm-table-wrap"><table className="flm-table"><thead>
            <tr>
              <th className={thClass} onClick={() => handleSort("id")}>ID</th>
              <th className={thClass} onClick={() => handleSort("laneName")}>Lane</th>
              <th className={thClass} onClick={() => handleSort("carrier")}>Carrier</th>
              <th className={thClass} onClick={() => handleSort("mode")}>Mode</th>
              <th className={thClass} onClick={() => handleSort("shipmentsTotal")}>Shipments</th>
              <th className={thClass} onClick={() => handleSort("onTimeCount")}>On-Time %</th>
              <th className={thClass} onClick={() => handleSort("damageCount")}>Damage %</th>
              <th className={thClass} onClick={() => handleSort("claimsCount")}>Claims</th>
              <th className={thClass} onClick={() => handleSort("avgTransitHrs")}>Avg Transit</th>
              <th className={thClass} onClick={() => handleSort("customerSatScore")}>Satisfaction</th>
            </tr>
          </thead><tbody>
            {filteredPerf.map(p => {
              const otp = p.shipmentsTotal ? Math.round((p.onTimeCount / p.shipmentsTotal) * 100) : 0
              const dmg = p.shipmentsTotal ? ((p.damageCount / p.shipmentsTotal) * 100).toFixed(1) : "0"
              return (
                <tr key={p.id} className="flm-tr" onClick={() => setDrawerData({ ...p, drawerType: "perf" })}>
                  <td className={tdClass}>{p.id}</td>
                  <td className={tdClass}>{p.laneName}</td>
                  <td className={tdClass}>{p.carrier}</td>
                  <td className={tdClass}>{p.mode}</td>
                  <td className={tdClass}>{p.shipmentsTotal}</td>
                  <td className={tdClass}><span className={cn("flm-ontime-badge", otp > 90 ? "flm-ontime-green" : otp > 80 ? "flm-ontime-amber" : "flm-ontime-red")}>{otp}%</span></td>
                  <td className={tdClass}><span className={cn("flm-dmg-badge", parseFloat(dmg) === 0 ? "flm-dmg-green" : parseFloat(dmg) <= 2 ? "flm-dmg-amber" : "flm-dmg-rose")}>{dmg}%</span></td>
                  <td className={tdClass}>{p.claimsCount}</td>
                  <td className={tdClass}>{p.avgTransitHrs}h</td>
                  <td className={tdClass}><span className={cn("flm-sat-badge", p.customerSatScore > 4 ? "flm-sat-green" : p.customerSatScore > 3 ? "flm-sat-amber" : "flm-sat-rose")}>{p.customerSatScore}/5</span></td>
                </tr>
              )
            })}
          </tbody></table></div>
        </div>
      )}

      {/* ─── Tab 5: Capacity ─── */}
      {tab === 5 && (
        <div className="flm-tab-content">
          <div className="flm-filter-bar">
            <input className="flm-search" placeholder="Search capacity..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="flm-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">All Modes</option>{[...data.modes].map(m => <option key={m} value={m}>{m}</option>)}</select>
            <select className="flm-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="all">All Congestion</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option></select>
          </div>
          <div className="flm-table-wrap"><table className="flm-table"><thead>
            <tr>
              <th className={thClass} onClick={() => handleSort("id")}>ID</th>
              <th className={thClass} onClick={() => handleSort("laneName")}>Lane</th>
              <th className={thClass} onClick={() => handleSort("mode")}>Mode</th>
              <th className={thClass} onClick={() => handleSort("maxCapacity")}>Max Cap</th>
              <th className={thClass} onClick={() => handleSort("currentLoad")}>Current</th>
              <th className={thClass} onClick={() => handleSort("availableCapacity")}>Available</th>
              <th className={thClass} onClick={() => handleSort("peakUtilPct")}>Peak Util</th>
              <th className={thClass} onClick={() => handleSort("congestionLevel")}>Congestion</th>
              <th className={thClass} onClick={() => handleSort("seasonalFactor")}>Seasonal</th>
            </tr>
          </thead><tbody>
            {filteredCap.map(c => (
              <tr key={c.id} className="flm-tr" onClick={() => setDrawerData({ ...c, drawerType: "cap" })}>
                <td className={tdClass}>{c.id}</td>
                <td className={tdClass}>{c.laneName}</td>
                <td className={tdClass}>{c.mode}</td>
                <td className={tdClass}>{c.maxCapacity}</td>
                <td className={tdClass}>{c.currentLoad}</td>
                <td className={tdClass}>{c.availableCapacity}</td>
                <td className={tdClass}><div className="flm-util-bar"><div className={cn("flm-util-fill", c.peakUtilPct > 90 ? "flm-util-teal" : c.peakUtilPct > 70 ? "flm-util-green" : c.peakUtilPct > 40 ? "flm-util-amber" : "flm-util-red")} style={{ width: `${c.peakUtilPct}%` }} /></div><span className="flm-util-pct">{c.peakUtilPct}%</span></td>
                <td className={tdClass}><span className={cn("flm-congestion-badge flm-congestion-badge-" + c.congestionLevel.toLowerCase(), "")}>{c.congestionLevel}</span></td>
                <td className={tdClass}>{c.seasonalFactor}x</td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {/* ─── Drawers ─── */}
      {drawerData?.drawerType === "perf" ? <PerfDrawer item={drawerData} onClose={() => setDrawerData(null)} /> :
       drawerData?.drawerType === "shipment" ? <ShipmentDrawer item={drawerData} onClose={() => setDrawerData(null)} /> :
       drawerData?.drawerType === "cap" ? <CapDrawer item={drawerData} onClose={() => setDrawerData(null)} /> :
       drawerData ? <LaneDrawer item={drawerData} onClose={() => setDrawerData(null)} /> : null}
    </div>
  )
}
