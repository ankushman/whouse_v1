"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

const C = { teal: "#0d9488", indigo: "#6366f1", rose: "#e11d48", amber: "#d97706", emerald: "#059669", sky: "#0284c7", purple: "#7c3aed", slate: "#475569", orange: "#ea580c" }
const CC = [C.teal, C.indigo, C.rose, C.amber, C.emerald, C.sky, C.purple, C.orange, "#65a30d", C.slate]
const CCM_C = [C.teal, C.indigo, C.rose, C.amber, C.emerald, C.sky, C.purple, C.orange]

const WAREHOUSES = ["Mumbai Cold Store", "Delhi Cold Hub", "Chennai Cold DC", "Bangalore Cold FC", "Pune Cold Storage", "Hyderabad Cold DC", "Kolkata Cold WH", "Ahmedabad Cold FC"] as const
const PRODUCT_TYPES = ["Frozen Foods", "Dairy Products", "Pharmaceuticals", "Fresh Produce", "Meat & Poultry", "Seafood", "Ice Cream", "Beverages", "Floral", "Chemicals"] as const
const SENSOR_TYPES = ["Temperature", "Humidity", "CO2 Level", "Door Open", "Power Status", "Battery Level"] as const
const ALERT_TYPES = ["Temperature Excursion", "Humidity Deviation", "Sensor Offline", "Battery Low", "Door Left Open", "Power Failure", "Compressor Fault", "Defrost Cycle Overdue"] as const
const CARRIERS = ["ColdStar Logistics", "SnowWay Express", "IceChain India", "ReeferTrack", "PolarTrans", "FreshRoute India", "CoolMove Logistics", "TempGuard India"] as const
const ROUTE_ZONES = ["Mumbai-Pune", "Delhi-Jaipur", "Chennai-Bangalore", "Hyderabad-Vizag", "Kolkata-Guwahati", "Ahmedabad-Rajkot"] as const
const COMPLIANCE_STANDARDS = ["FSSAI", "WHO GDP", "EU GDP", "US FDA", "CDSCO", "ISO 22000"] as const

function formatINR(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`
  return `₹${v.toLocaleString("en-IN")}`
}

interface Shipment { id: string; carrier: string; route: string; productType: string; sensorCount: number; currentTemp: number; targetTempMin: number; targetTempMax: number; humidity: number; status: string; departure: string; eta: string; excursions: number; complianceScore: number; warehouse: string; value: number }
interface ColdRoom { id: string; warehouse: string; roomName: string; currentTemp: number; targetTemp: number; humidity: number; capacity: number; occupancy: number; doorOpenMins: number; lastDefrost: string; compressors: number; activeAlerts: number; energyKwh: number; compliance: string }
interface SensorAlert { id: string; warehouse: string; roomOrShipment: string; alertType: string; severity: string; currentValue: number; threshold: number; deviation: string; timestamp: string; acknowledged: boolean; resolved: boolean; costImpact: number }
interface ComplianceRecord { id: string; warehouse: string; standard: string; auditDate: string; score: number; findings: number; critical: number; status: string; nextAudit: string; auditor: string }
interface EnergyRecord { id: string; warehouse: string; period: string; consumptionKwh: number; cost: number; efficiency: number; benchmark: number; deviation: number; compressorHours: number; defrostCycles: number }

function generateData() {
  const s = seededRandom(184)
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(s() * arr.length)]
  const statuses = ["In Transit", "At Hub", "Loading", "Unloading", "Completed", "Delayed"]

  const shipments: Shipment[] = Array.from({ length: 80 }, (_, i) => {
    const prodType = pick(PRODUCT_TYPES)
    const tMin = prodType === "Frozen Foods" ? -25 : prodType === "Pharmaceuticals" ? 2 : prodType === "Fresh Produce" ? 1 : prodType === "Meat & Poultry" ? -18 : prodType === "Seafood" ? -20 : prodType === "Ice Cream" ? -22 : prodType === "Dairy Products" ? 0 : prodType === "Beverages" ? 4 : 3
    const tMax = tMin + (prodType === "Frozen Foods" ? 4 : prodType === "Pharmaceuticals" ? 6 : prodType === "Fresh Produce" ? 6 : 5)
    const curTemp = tMin + Math.floor(s() * (tMax - tMin + 3)) - 1
    return {
      id: `SHP-${String(i + 1).padStart(5, "0")}`, carrier: pick(CARRIERS), route: pick(ROUTE_ZONES), productType: prodType,
      sensorCount: Math.floor(s() * 4) + 2, currentTemp: curTemp, targetTempMin: tMin, targetTempMax: tMax,
      humidity: Math.floor(s() * 30) + 40, status: pick(statuses),
      departure: `2026-07-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      eta: `2026-07-${String(Math.floor(s() * 5) + 26).padStart(2, "0")}`,
      excursions: curTemp < tMin || curTemp > tMax ? Math.floor(s() * 3) + 1 : 0,
      complianceScore: Math.floor(s() * 20) + 78, warehouse: pick(WAREHOUSES),
      value: Math.floor(s() * 8000000) + 500000,
    }
  })

  const coldRooms: ColdRoom[] = Array.from({ length: 50 }, (_, i) => {
    const wh = pick(WAREHOUSES)
    const tTarget = Math.floor(s() * 30) - 20
    return {
      id: `CRM-${String(i + 1).padStart(4, "0")}`, warehouse: wh,
      roomName: `${wh.split(" ")[0]} ${["Freezer A", "Chiller B", "Blast Freezer", "Pharma Room", "Dairy Vault", "Seafood Hold", "Produce Zone", "Ambient Staging"][Math.floor(s() * 8)]}`,
      currentTemp: tTarget + Math.floor(s() * 4) - 2, targetTemp: tTarget,
      humidity: Math.floor(s() * 30) + 40, capacity: Math.floor(s() * 500) + 100,
      occupancy: Math.floor(s() * 400) + 50, doorOpenMins: Math.floor(s() * 30),
      lastDefrost: `2026-07-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      compressors: Math.floor(s() * 3) + 1, activeAlerts: Math.floor(s() * 3),
      energyKwh: Math.floor(s() * 2000) + 500, compliance: pick(["Compliant", "At Risk", "Non-Compliant"]),
    }
  })

  const alerts: SensorAlert[] = Array.from({ length: 70 }, (_, i) => {
    const aType = pick(ALERT_TYPES)
    const severity = pick(["Critical", "High", "Medium", "Low"])
    return {
      id: `ALT-${String(i + 1).padStart(4, "0")}`, warehouse: pick(WAREHOUSES),
      roomOrShipment: s() > 0.5 ? pick(coldRooms.map(r => r.roomName)) : pick(shipments.map(sh => sh.id)),
      alertType: aType, severity, currentValue: Math.floor(s() * 15),
      threshold: Math.floor(s() * 8) + 5, deviation: s() > 0.5 ? "+3.2°C" : "-2.1°C",
      timestamp: `2026-07-28 ${String(Math.floor(s() * 24)).padStart(2, "0")}:${String(Math.floor(s() * 60)).padStart(2, "0")}`,
      acknowledged: s() > 0.4, resolved: s() > 0.6,
      costImpact: severity === "Critical" ? Math.floor(s() * 100000) + 10000 : severity === "High" ? Math.floor(s() * 20000) + 2000 : Math.floor(s() * 3000),
    }
  })

  const compliance: ComplianceRecord[] = Array.from({ length: 50 }, (_, i) => {
    return {
      id: `CMP-${String(i + 1).padStart(4, "0")}`, warehouse: pick(WAREHOUSES),
      standard: pick(COMPLIANCE_STANDARDS), auditDate: `2026-07-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      score: Math.floor(s() * 25) + 72, findings: Math.floor(s() * 8) + 1, critical: Math.floor(s() * 3),
      status: pick(["Pass", "Conditional", "Fail", "Scheduled"]),
      nextAudit: `2026-10-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      auditor: pick(["Dr. A. Sharma QA", "FSSAI Inspector R. Kumar", "WHO GDP Auditor P. Singh", "ISO Lead Auditor M. Patel", "CDSCO Reviewer S. Gupta"]),
    }
  })

  const energy: EnergyRecord[] = Array.from({ length: 60 }, (_, i) => {
    const kwh = Math.floor(s() * 3000) + 800
    const bm = Math.floor(s() * 500) + 1500
    return {
      id: `ENG-${String(i + 1).padStart(4, "0")}`, warehouse: pick(WAREHOUSES),
      period: `2026-${String(Math.floor(s() * 7) + 1).padStart(2, "0")}`,
      consumptionKwh: kwh, cost: Math.floor(kwh * (s() * 4 + 6)),
      efficiency: Math.floor(s() * 25) + 70, benchmark: bm,
      deviation: kwh > bm ? Math.round((kwh - bm) / bm * 100) : -Math.round((bm - kwh) / bm * 100),
      compressorHours: Math.floor(s() * 200) + 100, defrostCycles: Math.floor(s() * 10) + 2,
    }
  })

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyTrend = months.map((m) => ({
    month: m, avgTemp: Math.floor(s() * 5) - 10, excursions: Math.floor(s() * 20) + 5,
    energyCost: Math.floor(s() * 500000) + 300000, complianceRate: Math.floor(s() * 12) + 85,
  }))

  return { shipments, coldRooms, alerts, compliance, energy, monthlyTrend, months, WAREHOUSES, PRODUCT_TYPES, SENSOR_TYPES, ALERT_TYPES, CARRIERS, ROUTE_ZONES, COMPLIANCE_STANDARDS }
}

function FieldGrid({ fields }: { fields: { label: string; value: string }[] }) {
  return (<div className="ccm-drawer-field-grid">{fields.map((f, i) => (<div key={i} className="ccm-drawer-field"><span className="ccm-drawer-field-label">{f.label}</span><span className="ccm-drawer-field-value">{f.value}</span></div>))}</div>)
}
function MetricsRow({ metrics }: { metrics: { label: string; value: string; color?: string }[] }) {
  return (<div className="ccm-drawer-metrics">{metrics.map((m, i) => (<div key={i} className="ccm-drawer-metric-card" style={m.color ? { borderTopColor: m.color } : undefined}><span className="ccm-drawer-metric-label">{m.label}</span><span className="ccm-drawer-metric-value">{m.value}</span></div>))}</div>)
}
function ScoreRing({ score, size = 80, strokeWidth = 6 }: { score: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2, circ = 2 * Math.PI * r, off = circ - (score / 100) * circ
  const col = score >= 80 ? C.emerald : score >= 60 ? C.amber : C.rose
  return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/><text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fontSize={size*0.22} fontWeight="700" fill={col}>{score}%</text></svg>)
}

function TempBadge({ temp, min, max }: { temp: number; min: number; max: number }) {
  if (temp >= min && temp <= max) return <span className="ccm-temp-ok">✓ {temp}°C</span>
  if (temp < min) return <span className="ccm-temp-cold">↓ {temp}°C</span>
  return <span className="ccm-temp-hot">↑ {temp}°C</span>
}

export default function ColdChainMonitoringView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterWarehouse, setFilterWarehouse] = useState("all")
  const [filterProductType, setFilterProductType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterStandard, setFilterStandard] = useState("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<string>("")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortAsc, setSortAsc] = useState(true)

  const kpis = useMemo(() => {
    const inTransit = data.shipments.filter(sh => sh.status === "In Transit").length
    const excursionCount = data.shipments.reduce((a, sh) => a + sh.excursions, 0)
    const activeAlerts = data.alerts.filter(a => !a.resolved).length
    const totalEnergy = data.energy.reduce((a, e) => a + e.cost, 0)
    const avgCompliance = Math.round(data.compliance.reduce((a, c) => a + c.score, 0) / data.compliance.length)
    const totalValue = data.shipments.reduce((a, sh) => a + sh.value, 0)
    return [
      { label: "Active Shipments", value: inTransit, color: C.sky, icon: "🚚" },
      { label: "Excursions", value: excursionCount, color: C.rose, icon: "🌡️" },
      { label: "Active Alerts", value: activeAlerts, color: C.amber, icon: "⚠️" },
      { label: "Energy Cost", value: formatINR(totalEnergy), color: C.purple, icon: "⚡" },
      { label: "Compliance", value: `${avgCompliance}%`, color: C.emerald, icon: "✅" },
      { label: "Cargo Value", value: formatINR(totalValue), color: C.teal, icon: "💎" },
    ]
  }, [data])

  const prodDist = useMemo(() => [...PRODUCT_TYPES].map(p => ({ name: p.length > 10 ? p.substring(0, 10) + ".." : p, fullName: p, value: data.shipments.filter(sh => sh.productType === p).length })), [data])
  const alertTypeDist = useMemo(() => [...ALERT_TYPES].map(a => ({ name: a.length > 14 ? a.substring(0, 14) + ".." : a, fullName: a, value: data.alerts.filter(al => al.alertType === a).length })), [data])
  const standardDist = useMemo(() => [...COMPLIANCE_STANDARDS].map(st => ({ name: st, value: data.compliance.filter(c => c.standard === st).length })), [data])
  const severityDist = useMemo(() => ["Critical", "High", "Medium", "Low"].map(sev => ({ name: sev, value: data.alerts.filter(a => a.severity === sev).length, color: sev === "Critical" ? C.rose : sev === "High" ? C.amber : sev === "Medium" ? C.sky : C.emerald })), [data])

  const handleSort = (f: any) => { if (sortBy === f) setSortAsc(!sortAsc); else { setSortBy(f); setSortAsc(true) } }
  const sortFn = <T extends Record<string, any>>(items: T[]): T[] => [...items].sort((a, b) => { const va = a[sortBy], vb = b[sortBy]; if (typeof va === "number") return sortAsc ? va - vb : vb - va; return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va)) })

  const filteredShipments = useMemo(() => {
    let items = [...data.shipments]
    if (searchTerm) items = items.filter(sh => sh.carrier.toLowerCase().includes(searchTerm.toLowerCase()) || sh.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterWarehouse !== "all") items = items.filter(sh => sh.warehouse === filterWarehouse)
    if (filterProductType !== "all") items = items.filter(sh => sh.productType === filterProductType)
    if (filterStatus !== "all") items = items.filter(sh => sh.status === filterStatus)
    return sortFn(items)
  }, [data, searchTerm, filterWarehouse, filterProductType, filterStatus, sortBy, sortAsc])

  const filteredRooms = useMemo(() => {
    let items = [...data.coldRooms]
    if (searchTerm) items = items.filter(r => r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterWarehouse !== "all") items = items.filter(r => r.warehouse === filterWarehouse)
    return sortFn(items)
  }, [data, searchTerm, filterWarehouse, sortBy, sortAsc])

  const filteredAlerts = useMemo(() => {
    let items = [...data.alerts]
    if (searchTerm) items = items.filter(a => a.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterSeverity !== "all") items = items.filter(a => a.severity === filterSeverity)
    return sortFn(items)
  }, [data, searchTerm, filterSeverity, sortBy, sortAsc])

  const filteredCompliance = useMemo(() => {
    let items = [...data.compliance]
    if (searchTerm) items = items.filter(c => c.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStandard !== "all") items = items.filter(c => c.standard === filterStandard)
    return sortFn(items)
  }, [data, searchTerm, filterStandard, sortBy, sortAsc])

  const openShipmentDrawer = (sh: Shipment) => { setDrawerData(sh); setDrawerType("shipment"); setDrawerOpen(true) }
  const openRoomDrawer = (rm: ColdRoom) => { setDrawerData(rm); setDrawerType("room"); setDrawerOpen(true) }
  const openAlertDrawer = (al: SensorAlert) => { setDrawerData(al); setDrawerType("alert"); setDrawerOpen(true) }
  const openComplianceDrawer = (cmp: ComplianceRecord) => { setDrawerData(cmp); setDrawerType("compliance"); setDrawerOpen(true) }

  const renderDrawer = () => {
    if (!drawerData) return null
    if (drawerType === "shipment") {
      const sh = drawerData as Shipment
      return (<><div className="ccm-drawer-header"><div className="ccm-drawer-header-left"><TempBadge temp={sh.currentTemp} min={sh.targetTempMin} max={sh.targetTempMax} /><div><h3 className="ccm-drawer-title">{sh.id}</h3><p className="ccm-drawer-subtitle">{sh.carrier} - {sh.route}</p><div className="ccm-drawer-badges"><span className="ccm-badge-product">{sh.productType}</span><span className={`ccm-badge-status ccm-status-${sh.status.toLowerCase().replace(/\s+/g,"-")}`}>{sh.status}</span></div></div></div></div><MetricsRow metrics={[{label:"Cargo Value",value:formatINR(sh.value),color:C.teal},{label:"Excursions",value:String(sh.excursions),color:C.rose},{label:"Compliance",value:`${sh.complianceScore}%`,color:C.emerald}]} /><FieldGrid fields={[{label:"Route",value:sh.route},{label:"Sensors",value:String(sh.sensorCount)},{label:"Humidity",value:`${sh.humidity}%`},{label:"Target Range",value:`${sh.targetTempMin}°C to ${sh.targetTempMax}°C`},{label:"Departure",value:sh.departure},{label:"ETA",value:sh.eta}]} /><div className="ccm-drawer-actions"><button className="ccm-btn-primary">Track Live</button><button className="ccm-btn-secondary">Alert Driver</button><button className="ccm-btn-ghost">Re-route</button></div></>)
    }
    if (drawerType === "room") {
      const rm = drawerData as ColdRoom
      const dev = Math.abs(rm.currentTemp - rm.targetTemp)
      return (<><div className="ccm-drawer-header"><div className="ccm-drawer-header-left"><ScoreRing score={rm.compliance === "Compliant" ? 92 : rm.compliance === "At Risk" ? 65 : 35} /><div><h3 className="ccm-drawer-title">{rm.id}</h3><p className="ccm-drawer-subtitle">{rm.roomName}</p><div className="ccm-drawer-badges"><span className={`ccm-badge-compliance ccm-comp-${rm.compliance.toLowerCase().replace(/\s+/g,"-")}`}>{rm.compliance}</span></div></div></div></div><MetricsRow metrics={[{label:"Deviation",value:`${dev > 0 ? "+" : ""}${dev}°C`,color:dev>2?C.rose:C.teal},{label:"Occupancy",value:`${rm.occupancy}/${rm.capacity}`,color:C.indigo},{label:"Energy",value:`${rm.energyKwh} kWh`,color:C.purple}]} /><div className="ccm-drawer-score-grid"><div className="ccm-drawer-score-item" style={{borderTopColor:C.sky}}><span className="ccm-drawer-score-label">Current</span><span className="ccm-drawer-score-value">{rm.currentTemp}°C</span></div><div className="ccm-drawer-score-item" style={{borderTopColor:C.teal}}><span className="ccm-drawer-score-label">Target</span><span className="ccm-drawer-score-value">{rm.targetTemp}°C</span></div><div className="ccm-drawer-score-item" style={{borderTopColor:C.amber}}><span className="ccm-drawer-score-label">Door Open</span><span className="ccm-drawer-score-value">{rm.doorOpenMins}m</span></div><div className="ccm-drawer-score-item" style={{borderTopColor:C.rose}}><span className="ccm-drawer-score-label">Alerts</span><span className="ccm-drawer-score-value">{rm.activeAlerts}</span></div></div><FieldGrid fields={[{label:"Warehouse",value:rm.warehouse},{label:"Humidity",value:`${rm.humidity}%`},{label:"Compressors",value:String(rm.compressors)},{label:"Last Defrost",value:rm.lastDefrost}]} /><div className="ccm-drawer-actions"><button className="ccm-btn-primary">Adjust Temp</button><button className="ccm-btn-secondary">Defrost</button><button className="ccm-btn-ghost">Maintenance</button></div></>)
    }
    if (drawerType === "alert") {
      const al = drawerData as SensorAlert
      return (<><div className="ccm-drawer-header"><div className="ccm-drawer-header-left"><div className="ccm-drawer-alert-icon">⚠️</div><div><h3 className="ccm-drawer-title">{al.id}</h3><p className="ccm-drawer-subtitle">{al.alertType}</p><div className="ccm-drawer-badges"><span className={`ccm-badge-severity ccm-sev-${al.severity.toLowerCase()}`}>{al.severity}</span><span className={al.resolved?"ccm-badge-resolved":al.acknowledged?"ccm-badge-ack":"ccm-badge-unack"}>{al.resolved?"Resolved":al.acknowledged?"Acknowledged":"Unacknowledged"}</span></div></div></div></div><MetricsRow metrics={[{label:"Current",value:String(al.currentValue),color:C.rose},{label:"Threshold",value:String(al.threshold),color:C.amber},{label:"Cost Impact",value:formatINR(al.costImpact),color:C.indigo}]} /><div className="ccm-drawer-desc"><strong>Deviation:</strong> {al.deviation} from threshold at {al.timestamp}</div><FieldGrid fields={[{label:"Warehouse",value:al.warehouse},{label:"Room/Shipment",value:al.roomOrShipment},{label:"Alert Type",value:al.alertType},{label:"Deviation",value:al.deviation}]} /><div className="ccm-drawer-actions"><button className="ccm-btn-primary">Acknowledge</button><button className="ccm-btn-secondary">Escalate</button><button className="ccm-btn-ghost">View Sensor</button></div></>)
    }
    if (drawerType === "compliance") {
      const cmp = drawerData as ComplianceRecord
      return (<><div className="ccm-drawer-header"><div className="ccm-drawer-header-left"><ScoreRing score={cmp.score} /><div><h3 className="ccm-drawer-title">{cmp.id}</h3><p className="ccm-drawer-subtitle">{cmp.standard} - {cmp.warehouse}</p><div className="ccm-drawer-badges"><span className={`ccm-badge-result ccm-result-${cmp.status.toLowerCase()}`}>{cmp.status}</span></div></div></div></div><MetricsRow metrics={[{label:"Score",value:`${cmp.score}%`,color:C.emerald},{label:"Findings",value:String(cmp.findings),color:C.amber},{label:"Critical",value:String(cmp.critical),color:C.rose}]} /><FieldGrid fields={[{label:"Auditor",value:cmp.auditor},{label:"Audit Date",value:cmp.auditDate},{label:"Next Audit",value:cmp.nextAudit},{label:"Standard",value:cmp.standard}]} /><div className="ccm-drawer-actions"><button className="ccm-btn-primary">View Report</button><button className="ccm-btn-secondary">Schedule Follow-up</button><button className="ccm-btn-ghost">Export</button></div></>)
    }
    return null
  }

  const tabs = [
    { title: "Dashboard", content: (
      <div className="ccm-tab-dashboard">
        <div className="ccm-kpi-grid">{kpis.map((k,i) => (<div key={i} className="ccm-kpi-card" style={{borderTopColor:k.color}}><span className="ccm-kpi-icon">{k.icon}</span><span className="ccm-kpi-label">{k.label}</span><span className="ccm-kpi-value">{k.value}</span></div>))}</div>
        <div className="ccm-chart-grid">
          <div className="ccm-chart-card ccm-chart-wide"><h4 className="ccm-chart-title">Monthly Temperature & Excursions</h4><ResponsiveContainer width="100%" height={260}><AreaChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="month" tick={{fontSize:12}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip contentStyle={{borderRadius:8,border:"1px solid #e2e8f0"}}/><Legend/><Area type="monotone" dataKey="avgTemp" name="Avg Temp (°C)" fill="#0284c733" stroke={C.sky} strokeWidth={2}/><Area type="monotone" dataKey="excursions" name="Excursions" fill="#e11d4833" stroke={C.rose} strokeWidth={2}/><Line type="monotone" dataKey="complianceRate" name="Compliance %" stroke={C.emerald} strokeWidth={2} strokeDasharray="5 5" dot={{r:3}}/></AreaChart></ResponsiveContainer></div>
          <div className="ccm-chart-card"><h4 className="ccm-chart-title">Product Type Distribution</h4><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={prodDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>{prodDist.map((_e,i)=><Cell key={i} fill={CCM_C[i%CCM_C.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
          <div className="ccm-chart-card"><h4 className="ccm-chart-title">Alert Types</h4><ResponsiveContainer width="100%" height={260}><BarChart data={alertTypeDist} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis type="number" tick={{fontSize:12}} stroke="#94a3b8"/><YAxis dataKey="name" type="category" tick={{fontSize:10}} stroke="#94a3b8" width={110}/><Tooltip contentStyle={{borderRadius:8}}/><Bar dataKey="value" name="Count" radius={[0,4,4,0]}>{alertTypeDist.map((_e,i)=><Cell key={i} fill={CC[i%CC.length]}/>)}</Bar></BarChart></ResponsiveContainer></div>
          <div className="ccm-chart-card"><h4 className="ccm-chart-title">Severity Distribution</h4><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={severityDist} cx="50%" cy="50%" outerRadius={90} paddingAngle={2} dataKey="value" label={({name,value})=>`${name}: ${value}`}><Tooltip/></Pie></PieChart></ResponsiveContainer></div>
          <div className="ccm-chart-card"><h4 className="ccm-chart-title">Compliance Standards</h4><ResponsiveContainer width="100%" height={260}><BarChart data={standardDist}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="name" tick={{fontSize:11}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip contentStyle={{borderRadius:8}}/><Bar dataKey="value" name="Audits" radius={[4,4,0,0]} fill={C.indigo}/></BarChart></ResponsiveContainer></div>
        </div>
      </div>
    )},
    { title: "Shipments", content: (
      <div className="ccm-tab-section">
        <div className="ccm-filters"><input className="ccm-search" placeholder="Search by carrier or ID..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/><select className="ccm-filter" value={filterWarehouse} onChange={e=>setFilterWarehouse(e.target.value)}><option value="all">All Warehouses</option>{[...WAREHOUSES].map(w=><option key={w} value={w}>{w}</option>)}</select><select className="ccm-filter" value={filterProductType} onChange={e=>setFilterProductType(e.target.value)}><option value="all">All Products</option>{[...PRODUCT_TYPES].map(p=><option key={p} value={p}>{p}</option>)}</select><select className="ccm-filter" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option value="all">All Statuses</option>{["In Transit","At Hub","Loading","Unloading","Completed","Delayed"].map(st=><option key={st} value={st}>{st}</option>)}</select></div>
        <div className="ccm-table-wrap"><table className="ccm-table"><thead><tr><th className="ccm-clickable" onClick={()=>handleSort("id")}>ID {sortBy==="id"&&(sortAsc?"↑":"↓")}</th><th>Carrier</th><th>Route</th><th>Product</th><th>Temp</th><th>Humidity</th><th>Status</th><th>Excursions</th><th>Compliance</th><th>Value</th></tr></thead><tbody>{filteredShipments.slice(0,50).map(sh=><tr key={sh.id} className="ccm-row" onClick={()=>openShipmentDrawer(sh)}><td className="ccm-cell-id">{sh.id}</td><td>{sh.carrier}</td><td className="ccm-cell-truncate">{sh.route}</td><td><span className="ccm-badge-product">{sh.productType}</span></td><td><TempBadge temp={sh.currentTemp} min={sh.targetTempMin} max={sh.targetTempMax}/></td><td className="ccm-cell-mono">{sh.humidity}%</td><td><span className={`ccm-badge-status ccm-status-${sh.status.toLowerCase().replace(/\s+/g,"-")}`}>{sh.status}</span></td><td className="ccm-cell-mono">{sh.excursions}</td><td><ScoreRing score={sh.complianceScore} size={38} strokeWidth={3}/></td><td className="ccm-cell-mono">{formatINR(sh.value)}</td></tr>)}</tbody></table></div>
      </div>
    )},
    { title: "Cold Rooms", content: (
      <div className="ccm-tab-section">
        <div className="ccm-filters"><input className="ccm-search" placeholder="Search by room name..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/><select className="ccm-filter" value={filterWarehouse} onChange={e=>setFilterWarehouse(e.target.value)}><option value="all">All Warehouses</option>{[...WAREHOUSES].map(w=><option key={w} value={w}>{w}</option>)}</select></div>
        <div className="ccm-table-wrap"><table className="ccm-table"><thead><tr><th>ID</th><th>Room</th><th>Current Temp</th><th>Target</th><th>Humidity</th><th>Occupancy</th><th>Compliance</th><th>Door Open</th><th>Alerts</th><th>Energy</th></tr></thead><tbody>{filteredRooms.slice(0,50).map(rm=><tr key={rm.id} className="ccm-row" onClick={()=>openRoomDrawer(rm)}><td className="ccm-cell-id">{rm.id}</td><td className="ccm-cell-truncate">{rm.roomName}</td><td className="ccm-cell-mono">{rm.currentTemp}°C</td><td className="ccm-cell-mono">{rm.targetTemp}°C</td><td className="ccm-cell-mono">{rm.humidity}%</td><td className="ccm-cell-mono">{rm.occupancy}/{rm.capacity}</td><td><span className={`ccm-badge-compliance ccm-comp-${rm.compliance.toLowerCase().replace(/\s+/g,"-")}`}>{rm.compliance}</span></td><td className="ccm-cell-mono">{rm.doorOpenMins}m</td><td className="ccm-cell-mono ccm-text-rose">{rm.activeAlerts}</td><td className="ccm-cell-mono">{rm.energyKwh}kWh</td></tr>)}</tbody></table></div>
      </div>
    )},
    { title: "Alerts", content: (
      <div className="ccm-tab-section">
        <div className="ccm-filters"><input className="ccm-search" placeholder="Search by warehouse..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/><select className="ccm-filter" value={filterSeverity} onChange={e=>setFilterSeverity(e.target.value)}><option value="all">All Severity</option>{["Critical","High","Medium","Low"].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
        <div className="ccm-table-wrap"><table className="ccm-table"><thead><tr><th className="ccm-clickable" onClick={()=>handleSort("id")}>ID {sortBy==="id"&&(sortAsc?"↑":"↓")}</th><th>Warehouse</th><th>Room/Shipment</th><th>Type</th><th>Severity</th><th>Value</th><th>Deviation</th><th>Time</th><th>Status</th></tr></thead><tbody>{filteredAlerts.slice(0,50).map(al=><tr key={al.id} className="ccm-row" onClick={()=>openAlertDrawer(al)}><td className="ccm-cell-id">{al.id}</td><td className="ccm-cell-truncate">{al.warehouse}</td><td className="ccm-cell-truncate">{al.roomOrShipment}</td><td><span className="ccm-badge-type">{al.alertType}</span></td><td><span className={`ccm-badge-severity ccm-sev-${al.severity.toLowerCase()}`}>{al.severity}</span></td><td className="ccm-cell-mono">{formatINR(al.costImpact)}</td><td>{al.deviation}</td><td className="ccm-cell-mono">{al.timestamp.split(" ")[1]}</td><td>{al.resolved?<span className="ccm-badge-resolved">Resolved</span>:al.acknowledged?<span className="ccm-badge-ack">Acknowledged</span>:<span className="ccm-badge-unack">Unack</span>}</td></tr>)}</tbody></table></div>
      </div>
    )},
    { title: "Compliance", content: (
      <div className="ccm-tab-section">
        <div className="ccm-filters"><input className="ccm-search" placeholder="Search by warehouse..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/><select className="ccm-filter" value={filterStandard} onChange={e=>setFilterStandard(e.target.value)}><option value="all">All Standards</option>{[...COMPLIANCE_STANDARDS].map(st=><option key={st} value={st}>{st}</option>)}</select></div>
        <div className="ccm-table-wrap"><table className="ccm-table"><thead><tr><th>ID</th><th>Warehouse</th><th>Standard</th><th>Score</th><th>Findings</th><th>Critical</th><th>Status</th><th>Auditor</th><th>Date</th><th>Next Audit</th></tr></thead><tbody>{filteredCompliance.slice(0,50).map(cmp=><tr key={cmp.id} className="ccm-row" onClick={()=>openComplianceDrawer(cmp)}><td className="ccm-cell-id">{cmp.id}</td><td className="ccm-cell-truncate">{cmp.warehouse}</td><td><span className="ccm-badge-standard">{cmp.standard}</span></td><td><ScoreRing score={cmp.score} size={38} strokeWidth={3}/></td><td className="ccm-cell-mono">{cmp.findings}</td><td className="ccm-cell-mono ccm-text-rose">{cmp.critical}</td><td><span className={`ccm-badge-result ccm-result-${cmp.status.toLowerCase()}`}>{cmp.status}</span></td><td className="ccm-cell-truncate">{cmp.auditor}</td><td>{cmp.auditDate}</td><td>{cmp.nextAudit}</td></tr>)}</tbody></table></div>
      </div>
    )},
    { title: "Energy", content: (
      <div className="ccm-tab-dashboard">
        <div className="ccm-chart-grid">
          <div className="ccm-chart-card ccm-chart-wide"><h4 className="ccm-chart-title">Monthly Energy Cost & Compliance Rate</h4><ResponsiveContainer width="100%" height={280}><AreaChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="month" tick={{fontSize:12}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip contentStyle={{borderRadius:8,border:"1px solid #e2e8f0"}}/><Legend/><Area type="monotone" dataKey="energyCost" name="Energy Cost (₹)" fill="#7c3aed33" stroke={C.purple} strokeWidth={2}/><Line type="monotone" dataKey="complianceRate" name="Compliance %" stroke={C.emerald} strokeWidth={2} strokeDasharray="5 5" dot={{r:3}}/></AreaChart></ResponsiveContainer></div>
          <div className="ccm-chart-card"><h4 className="ccm-chart-title">Efficiency Benchmark</h4><ResponsiveContainer width="100%" height={260}><BarChart data={data.energy.slice(0,15).map(e=>({period:e.period,efficiency:e.efficiency,benchmark:e.benchmark}))}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="period" tick={{fontSize:10}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8" domain={[50,100]}/><Tooltip contentStyle={{borderRadius:8}}/><Legend/><Bar dataKey="efficiency" name="Efficiency %" fill={C.teal} radius={[4,4,0,0]}/><Bar dataKey="benchmark" name="Benchmark %" fill="#e2e8f0" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
          <div className="ccm-chart-card"><h4 className="ccm-chart-title">Consumption Trend</h4><ResponsiveContainer width="100%" height={260}><LineChart data={data.energy.slice(0,20).map(e=>({period:e.period,consumption:e.consumptionKwh}))}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="period" tick={{fontSize:10}} stroke="#94a3b8" angle={-25} textAnchor="end" height={50}/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip contentStyle={{borderRadius:8}}/><Line type="monotone" dataKey="consumption" name="kWh" stroke={C.amber} strokeWidth={2} dot={{r:3}}/></LineChart></ResponsiveContainer></div>
        </div>
        <div className="ccm-energy-summary-grid">{data.energy.slice(0,8).map(e=><div key={e.id} className="ccm-energy-card"><h5 className="ccm-energy-label">{e.warehouse.split(" ")[0]}</h5><div className="ccm-energy-metrics"><div><span className="ccm-energy-val">{e.consumptionKwh}</span><span className="ccm-energy-sub">kWh</span></div><div><span className="ccm-energy-val">{formatINR(e.cost)}</span><span className="ccm-energy-sub">Cost</span></div><div><span className="ccm-energy-val">{e.efficiency}%</span><span className="ccm-energy-sub">Efficiency</span></div></div></div>)}</div>
      </div>
    )},
  ]

  return (
    <div className="ccm-root">
      <PageHeader title="Cold Chain Monitoring" description="Real-time temperature monitoring, shipment tracking, compliance management, and energy optimization for cold chain logistics" />
      <div className="ccm-tabs">{tabs.map((tab,i) => (<button key={i} className={cn("ccm-tab-btn", activeTab===i && "ccm-tab-btn-active")} onClick={()=>setActiveTab(i)}>{tab.title}</button>))}</div>
      <div className="ccm-tab-content">{tabs[activeTab].content}</div>
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}><SheetContent className="ccm-sheet" side="right"><div className="ccm-sheet-body">{renderDrawer()}</div></SheetContent></Sheet>
    </div>
  )
}
