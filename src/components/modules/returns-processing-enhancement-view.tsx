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
const RPE_C = [C.teal, C.indigo, C.rose, C.amber, C.emerald, C.sky, C.purple, C.orange]
const CC = [C.teal, C.indigo, C.rose, C.amber, C.emerald, C.sky, C.purple, C.orange, "#65a30d", C.slate]

const CUSTOMERS = ["Aarav Patel", "Diya Sharma", "Vihaan Gupta", "Anaya Reddy", "Kabir Singh", "Riya Mehta", "Aryan Kumar", "Ishaan Joshi", "Aditi Nair", "Vivaan Verma", "Saanvi Rao", "Reyansh Das", "Priya Iyer", "Arjun Deshmukh", "Nisha Pillai", "Rohan Chandra", "Meera Tiwari", "Dev Gupta", "Pooja Kulkarni", "Siddharth Menon"] as const
const RETURN_REASONS = ["Defective Product", "Wrong Item", "Size Issue", "Color Mismatch", "Damaged in Transit", "Missing Parts", "Quality Not Expected", "Not As Described", "Changed Mind", "Better Price Found", "Gift Return", "Warranty Claim"] as const
const RETURN_CATEGORIES = ["Electronics", "Apparel", "Home & Kitchen", "Footwear", "Beauty", "Toys", "Books", "Sports"] as const
const DISPOSITION_TYPES = ["Restock", "Refurbish", "Liquidate", "Donate", "Recycle", "Dispose"] as const
const WAREHOUSES = ["Mumbai DC", "Delhi Hub", "Chennai DC", "Bangalore FC", "Pune FC", "Hyderabad DC", "Kolkata WH", "Ahmedabad WH"] as const
const RETURN_STATUSES = ["Requested", "Picked Up", "In Transit", "Received", "Inspected", "Processed"] as const
const INSPECTION_RESULTS = ["Pass", "Conditional", "Fail", "Pending"] as const
const CARRIER_PARTNERS = ["Delhivery Reverse", "BlueDart Returns", "DTDC Reverse", "Ekart Logistics", "XpressBees", "Shadowfax", "Ecom Express", "Indian Post"] as const
const REFUND_TYPES = ["Original Payment", "Store Credit", "Replacement", "Bank Transfer", "UPI Refund"] as const

function formatINR(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`
  return `₹${v.toLocaleString("en-IN")}`
}

interface ReturnOrder { id: string; orderId: string; customer: string; category: string; reason: string; status: string; returnDate: string; receivedDate: string; warehouse: string; carrier: string; items: number; refundType: string; refundAmount: number; inspectionResult: string; disposition: string; qualityScore: number; processingTime: number; customerImpact: string }
interface InspectionRecord { id: string; returnId: string; customer: string; category: string; inspector: string; inspectDate: string; result: string; qualityScore: number; defectsFound: number; photos: number; notes: string; restockable: boolean; disposition: string; processingCost: number }
interface DispositionRecord { id: string; returnId: string; customer: string; category: string; dispositionType: string; processedDate: string; recoveryValue: number; originalValue: number; recoveryRate: number; timeToProcess: number; warehouse: string; destination: string }
interface RefundRecord { id: string; returnId: string; customer: string; refundType: string; amount: number; status: string; processedDate: string; processingTime: number; customerSatisfaction: number }

function generateData() {
  const s = seededRandom(183)
  const INSPECTORS = ["Anil Sharma QA", "Pooja Verma QC", "Rajesh Kumar QC", "Neha Singh QA", "Vikram Patel QC", "Sunita Gupta QA"] as const
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(s() * arr.length)]

  const returns: ReturnOrder[] = Array.from({ length: 100 }, (_, i) => {
    const qs = Math.floor(s() * 60) + 40
    return {
      id: `RET-${String(i + 1).padStart(5, "0")}`, orderId: `ORD-${String(Math.floor(s() * 50000) + 10000).padStart(6, "0")}`,
      customer: pick(CUSTOMERS), category: pick(RETURN_CATEGORIES), reason: pick(RETURN_REASONS),
      status: pick(RETURN_STATUSES), returnDate: `2026-${String(Math.floor(s() * 7) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      receivedDate: `2026-${String(Math.floor(s() * 7) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      warehouse: pick(WAREHOUSES), carrier: pick(CARRIER_PARTNERS), items: Math.floor(s() * 4) + 1,
      refundType: pick(REFUND_TYPES), refundAmount: Math.floor(s() * 25000) + 500,
      inspectionResult: pick(INSPECTION_RESULTS), disposition: pick(DISPOSITION_TYPES),
      qualityScore: qs, processingTime: Math.floor(s() * 7) + 1,
      customerImpact: ["Low", "Medium", "High"][Math.floor(s() * 3)],
    }
  })

  const inspections: InspectionRecord[] = Array.from({ length: 80 }, (_, i) => {
    const r = pick(returns)
    const qs = Math.floor(s() * 60) + 40
    return {
      id: `INS-${String(i + 1).padStart(4, "0")}`, returnId: r.id, customer: r.customer, category: r.category,
      inspector: pick(INSPECTORS), inspectDate: `2026-${String(Math.floor(s() * 7) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      result: pick(INSPECTION_RESULTS), qualityScore: qs, defectsFound: Math.floor(s() * 4),
      photos: Math.floor(s() * 6) + 1, notes: qs >= 70 ? "Product in good condition, minor cosmetic issues" : "Significant defects found, requires refurbishment or disposal",
      restockable: qs >= 70, disposition: pick(DISPOSITION_TYPES), processingCost: Math.floor(s() * 500) + 50,
    }
  })

  const dispositions: DispositionRecord[] = Array.from({ length: 60 }, (_, i) => {
    const r = pick(returns)
    const orig = Math.floor(s() * 20000) + 1000
    const rec = Math.floor(orig * (s() * 0.6 + 0.2))
    return {
      id: `DSP-${String(i + 1).padStart(4, "0")}`, returnId: r.id, customer: r.customer, category: r.category,
      dispositionType: pick(DISPOSITION_TYPES), processedDate: `2026-${String(Math.floor(s() * 7) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      recoveryValue: rec, originalValue: orig, recoveryRate: Math.round(rec / orig * 100),
      timeToProcess: Math.floor(s() * 5) + 1, warehouse: pick(WAREHOUSES),
      destination: ["Main Stock", "Refurb Center", "Liquidation Partner", "NGO Partner", "Recycling Facility", "Disposal Facility"][Math.floor(s() * 6)],
    }
  })

  const refunds: RefundRecord[] = Array.from({ length: 50 }, (_, i) => {
    const r = pick(returns)
    const fStatuses = ["Completed", "Pending", "Processing", "Failed"]
    return {
      id: `REF-${String(i + 1).padStart(4, "0")}`, returnId: r.id, customer: r.customer,
      refundType: pick(REFUND_TYPES), amount: Math.floor(s() * 25000) + 500,
      status: fStatuses[Math.floor(s() * fStatuses.length)],
      processedDate: `2026-${String(Math.floor(s() * 7) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      processingTime: Math.floor(s() * 5) + 1, customerSatisfaction: Math.round((s() * 2 + 3) * 10) / 10,
    }
  })

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyTrend = months.map((m) => ({
    month: m, returns: Math.floor(s() * 120) + 80, refunds: Math.floor(s() * 100) + 60,
    recoveryRate: Math.floor(s() * 20) + 55, avgProcessTime: Math.floor(s() * 3) + 2,
  }))

  return { returns, inspections, dispositions, refunds, monthlyTrend, months, CUSTOMERS, RETURN_REASONS, RETURN_CATEGORIES, DISPOSITION_TYPES, WAREHOUSES, RETURN_STATUSES, INSPECTION_RESULTS, CARRIER_PARTNERS, REFUND_TYPES }
}

function FieldGrid({ fields }: { fields: { label: string; value: string }[] }) {
  return (<div className="rpe-drawer-field-grid">{fields.map((f, i) => (<div key={i} className="rpe-drawer-field"><span className="rpe-drawer-field-label">{f.label}</span><span className="rpe-drawer-field-value">{f.value}</span></div>))}</div>)
}
function MetricsRow({ metrics }: { metrics: { label: string; value: string; color?: string }[] }) {
  return (<div className="rpe-drawer-metrics">{metrics.map((m, i) => (<div key={i} className="rpe-drawer-metric-card" style={m.color ? { borderTopColor: m.color } : undefined}><span className="rpe-drawer-metric-label">{m.label}</span><span className="rpe-drawer-metric-value">{m.value}</span></div>))}</div>)
}
function ScoreRing({ score, size = 80, strokeWidth = 6 }: { score: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2, circ = 2 * Math.PI * r, off = circ - (score / 100) * circ
  const col = score >= 80 ? C.emerald : score >= 60 ? C.amber : C.rose
  return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/><text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fontSize={size*0.22} fontWeight="700" fill={col}>{score}%</text></svg>)
}
function QBadge({ score }: { score: number }) {
  const label = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Poor"
  const cls = score >= 85 ? "rpe-q-excellent" : score >= 70 ? "rpe-q-good" : score >= 50 ? "rpe-q-fair" : "rpe-q-poor"
  return <span className={`rpe-qbadge ${cls}`}>{label}</span>
}

export default function ReturnsProcessingEnhancementView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterReason, setFilterReason] = useState("all")
  const [filterResult, setFilterResult] = useState("all")
  const [filterDisposition, setFilterDisposition] = useState("all")
  const [filterRefundType, setFilterRefundType] = useState("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<string>("")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortAsc, setSortAsc] = useState(true)

  const kpis = useMemo(() => {
    const avgProc = Math.round(data.returns.reduce((a, r) => a + r.processingTime, 0) / data.returns.length)
    const totalRefund = data.refunds.reduce((a, r) => a + r.amount, 0)
    const avgSat = (data.refunds.reduce((a, r) => a + r.customerSatisfaction, 0) / data.refunds.length).toFixed(1)
    const pending = data.returns.filter((r) => r.status === "Requested" || r.status === "Received").length
    const avgRecovery = Math.round(data.dispositions.reduce((a, d) => a + d.recoveryRate, 0) / data.dispositions.length)
    return [
      { label: "Total Returns", value: data.returns.length, color: C.teal, icon: "↩️" },
      { label: "Avg Process Time", value: `${avgProc} days`, color: C.indigo, icon: "⏱️" },
      { label: "Recovery Rate", value: `${avgRecovery}%`, color: C.emerald, icon: "♻️" },
      { label: "Pending", value: pending, color: C.amber, icon: "📋" },
      { label: "Total Refunds", value: formatINR(totalRefund), color: C.rose, icon: "💰" },
      { label: "Satisfaction", value: avgSat, color: C.sky, icon: "😊" },
    ]
  }, [data])

  const reasonDist = useMemo(() => [...RETURN_REASONS].map((r) => ({ name: r.length > 14 ? r.substring(0, 14) + ".." : r, fullName: r, value: data.returns.filter((ret) => ret.reason === r).length })), [data])
  const catDist = useMemo(() => [...RETURN_CATEGORIES].map((c) => ({ name: c, value: data.returns.filter((r) => r.category === c).length })), [data])
  const dispDist = useMemo(() => [...DISPOSITION_TYPES].map((d) => ({ name: d, value: data.dispositions.filter((dp) => dp.dispositionType === d).length })), [data])

  const handleSort = (f: any) => { if (sortBy === f) setSortAsc(!sortAsc); else { setSortBy(f); setSortAsc(true) } }
  const sortFn = <T extends Record<string, any>>(items: T[]): T[] => [...items].sort((a, b) => { const va = a[sortBy], vb = b[sortBy]; if (typeof va === "number") return sortAsc ? va - vb : vb - va; return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va)) })

  const filteredReturns = useMemo(() => {
    let items = [...data.returns]
    if (searchTerm) items = items.filter((r) => r.customer.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "all") items = items.filter((r) => r.status === filterStatus)
    if (filterCategory !== "all") items = items.filter((r) => r.category === filterCategory)
    if (filterReason !== "all") items = items.filter((r) => r.reason === filterReason)
    return sortFn(items)
  }, [data, searchTerm, filterStatus, filterCategory, filterReason, sortBy, sortAsc])

  const filteredInspections = useMemo(() => {
    let items = [...data.inspections]
    if (searchTerm) items = items.filter((ins) => ins.customer.toLowerCase().includes(searchTerm.toLowerCase()) || ins.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterResult !== "all") items = items.filter((ins) => ins.result === filterResult)
    if (filterCategory !== "all") items = items.filter((ins) => ins.category === filterCategory)
    return sortFn(items)
  }, [data, searchTerm, filterResult, filterCategory, sortBy, sortAsc])

  const filteredDispositions = useMemo(() => {
    let items = [...data.dispositions]
    if (searchTerm) items = items.filter((d) => d.customer.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterDisposition !== "all") items = items.filter((d) => d.dispositionType === filterDisposition)
    return sortFn(items)
  }, [data, searchTerm, filterDisposition, sortBy, sortAsc])

  const filteredRefunds = useMemo(() => {
    let items = [...data.refunds]
    if (searchTerm) items = items.filter((ref) => ref.customer.toLowerCase().includes(searchTerm.toLowerCase()) || ref.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterRefundType !== "all") items = items.filter((ref) => ref.refundType === filterRefundType)
    return sortFn(items)
  }, [data, searchTerm, filterRefundType, sortBy, sortAsc])

  const openReturnDrawer = (r: ReturnOrder) => { setDrawerData(r); setDrawerType("return"); setDrawerOpen(true) }
  const openInspectionDrawer = (ins: InspectionRecord) => { setDrawerData(ins); setDrawerType("inspection"); setDrawerOpen(true) }
  const openDispositionDrawer = (d: DispositionRecord) => { setDrawerData(d); setDrawerType("disposition"); setDrawerOpen(true) }
  const openRefundDrawer = (ref: RefundRecord) => { setDrawerData(ref); setDrawerType("refund"); setDrawerOpen(true) }

  const renderDrawer = () => {
    if (!drawerData) return null
    if (drawerType === "return") {
      const r = drawerData as ReturnOrder
      return (<><div className="rpe-drawer-header"><div className="rpe-drawer-header-left"><ScoreRing score={r.qualityScore} /><div><h3 className="rpe-drawer-title">{r.id}</h3><p className="rpe-drawer-subtitle">{r.customer} - {r.orderId}</p><div className="rpe-drawer-badges"><span className={`rpe-badge-status rpe-status-${r.status.toLowerCase().replace(/\s+/g, "-")}`}>{r.status}</span><QBadge score={r.qualityScore} /></div></div></div></div><MetricsRow metrics={[{ label: "Refund Amount", value: formatINR(r.refundAmount), color: C.teal }, { label: "Processing Time", value: `${r.processingTime} days`, color: C.indigo }, { label: "Items", value: String(r.items), color: C.amber }]} /><FieldGrid fields={[{ label: "Category", value: r.category }, { label: "Reason", value: r.reason }, { label: "Carrier", value: r.carrier }, { label: "Warehouse", value: r.warehouse }, { label: "Disposition", value: r.disposition }, { label: "Return Date", value: r.returnDate }]} /><div className="rpe-drawer-actions"><button className="rpe-btn-primary">Process Return</button><button className="rpe-btn-secondary">Inspect</button><button className="rpe-btn-ghost">Contact Customer</button></div></>)
    }
    if (drawerType === "inspection") {
      const ins = drawerData as InspectionRecord
      return (<><div className="rpe-drawer-header"><div className="rpe-drawer-header-left"><ScoreRing score={ins.qualityScore} /><div><h3 className="rpe-drawer-title">{ins.id}</h3><p className="rpe-drawer-subtitle">{ins.customer} - {ins.category}</p><div className="rpe-drawer-badges"><span className={`rpe-badge-result rpe-result-${ins.result.toLowerCase()}`}>{ins.result}</span><span className={ins.restockable ? "rpe-badge-restock" : "rpe-badge-no-restock"}>{ins.restockable ? "Restockable" : "Not Restockable"}</span></div></div></div></div><div className="rpe-drawer-desc">{ins.notes}</div><MetricsRow metrics={[{ label: "Defects Found", value: String(ins.defectsFound), color: C.rose }, { label: "Photos", value: String(ins.photos), color: C.sky }, { label: "Cost", value: formatINR(ins.processingCost), color: C.amber }]} /><div className="rpe-drawer-score-grid"><div className="rpe-drawer-score-item" style={{ borderTopColor: C.teal }}><span className="rpe-drawer-score-label">Quality</span><span className="rpe-drawer-score-value">{ins.qualityScore}%</span></div><div className="rpe-drawer-score-item" style={{ borderTopColor: C.indigo }}><span className="rpe-drawer-score-label">Defects</span><span className="rpe-drawer-score-value">{ins.defectsFound}</span></div><div className="rpe-drawer-score-item" style={{ borderTopColor: C.emerald }}><span className="rpe-drawer-score-label">Restock</span><span className="rpe-drawer-score-value">{ins.restockable ? "Yes" : "No"}</span></div><div className="rpe-drawer-score-item" style={{ borderTopColor: C.amber }}><span className="rpe-drawer-score-label">Disposition</span><span className="rpe-drawer-score-value">{ins.disposition}</span></div></div><FieldGrid fields={[{ label: "Return ID", value: ins.returnId }, { label: "Inspector", value: ins.inspector }, { label: "Inspection Date", value: ins.inspectDate }, { label: "Category", value: ins.category }]} /><div className="rpe-drawer-actions"><button className="rpe-btn-primary">Update Result</button><button className="rpe-btn-secondary">Request Photo</button><button className="rpe-btn-ghost">View Return</button></div></>)
    }
    if (drawerType === "disposition") {
      const d = drawerData as DispositionRecord
      return (<><div className="rpe-drawer-header"><div className="rpe-drawer-header-left"><ScoreRing score={d.recoveryRate} /><div><h3 className="rpe-drawer-title">{d.id}</h3><p className="rpe-drawer-subtitle">{d.customer} - {d.category}</p><div className="rpe-drawer-badges"><span className={`rpe-badge-disp rpe-disp-${d.dispositionType.toLowerCase()}`}>{d.dispositionType}</span></div></div></div></div><MetricsRow metrics={[{ label: "Recovery", value: formatINR(d.recoveryValue), color: C.emerald }, { label: "Original Value", value: formatINR(d.originalValue), color: C.rose }, { label: "Recovery Rate", value: `${d.recoveryRate}%`, color: C.teal }]} /><div className="rpe-recovery-bar-section"><div className="rpe-recovery-bar-track"><div className="rpe-recovery-bar" style={{ width: `${d.recoveryRate}%`, backgroundColor: d.recoveryRate >= 60 ? C.emerald : d.recoveryRate >= 30 ? C.amber : C.rose }} /></div><span className="rpe-recovery-bar-label">{d.recoveryRate}% Recovery</span></div><FieldGrid fields={[{ label: "Return ID", value: d.returnId }, { label: "Category", value: d.category }, { label: "Warehouse", value: d.warehouse }, { label: "Destination", value: d.destination }, { label: "Processed", value: d.processedDate }]} /><div className="rpe-drawer-actions"><button className="rpe-btn-primary">Confirm Disposition</button><button className="rpe-btn-secondary">Reassign</button><button className="rpe-btn-ghost">View Report</button></div></>)
    }
    if (drawerType === "refund") {
      const ref = drawerData as RefundRecord
      return (<><div className="rpe-drawer-header"><div className="rpe-drawer-header-left"><div className="rpe-drawer-refund-icon">💰</div><div><h3 className="rpe-drawer-title">{ref.id}</h3><p className="rpe-drawer-subtitle">{ref.customer}</p><div className="rpe-drawer-badges"><span className={`rpe-badge-refund-type`}>{ref.refundType}</span><span className={`rpe-badge-status rpe-status-${ref.status.toLowerCase()}`}>{ref.status}</span></div></div></div></div><MetricsRow metrics={[{ label: "Amount", value: formatINR(ref.amount), color: C.teal }, { label: "Processing Time", value: `${ref.processingTime} days`, color: C.indigo }, { label: "Satisfaction", value: `${ref.customerSatisfaction}/5`, color: C.amber }]} /><FieldGrid fields={[{ label: "Return ID", value: ref.returnId }, { label: "Refund Type", value: ref.refundType }, { label: "Processed Date", value: ref.processedDate }, { label: "Status", value: ref.status }]} /><div className="rpe-drawer-actions"><button className="rpe-btn-primary">Process Refund</button><button className="rpe-btn-secondary">Contact Customer</button><button className="rpe-btn-ghost">View Return</button></div></>)
    }
    return null
  }

  // Carrier performance for radar
  const carrierPerf = useMemo(() => {
    return [...CARRIER_PARTNERS].slice(0, 6).map((cp) => ({
      carrier: cp.length > 14 ? cp.substring(0, 14) + ".." : cp,
      recovery: Math.floor(Math.random() * 20 + 70),
      speed: Math.floor(Math.random() * 30 + 50),
    }))
  }, [])

  // Category-reason heatmap data
  const heatmapData = useMemo(() => {
    return [...RETURN_CATEGORIES].map((cat) => {
      const row: Record<string, any> = { category: cat }
      ;[...RETURN_REASONS].forEach((reason) => {
        row[reason] = data.returns.filter((r) => r.category === cat && r.reason === reason).length
      })
      return row
    })
  }, [data])

  const tabs = [
    { title: "Dashboard", content: (
      <div className="rpe-tab-dashboard">
        <div className="rpe-kpi-grid">{kpis.map((k, i) => (<div key={i} className="rpe-kpi-card" style={{ borderTopColor: k.color }}><span className="rpe-kpi-icon">{k.icon}</span><span className="rpe-kpi-label">{k.label}</span><span className="rpe-kpi-value">{k.value}</span></div>))}</div>
        <div className="rpe-chart-grid">
          <div className="rpe-chart-card rpe-chart-wide"><h4 className="rpe-chart-title">Monthly Returns & Recovery Rate</h4><ResponsiveContainer width="100%" height={260}><AreaChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="month" tick={{fontSize:12}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip contentStyle={{borderRadius:8,border:"1px solid #e2e8f0"}}/><Legend/><Area type="monotone" dataKey="returns" name="Returns" fill="#0d948833" stroke={C.teal} strokeWidth={2}/><Area type="monotone" dataKey="refunds" name="Refunds" fill="#e11d4833" stroke={C.rose} strokeWidth={2}/><Line type="monotone" dataKey="recoveryRate" name="Recovery %" stroke={C.indigo} strokeWidth={2} strokeDasharray="5 5" dot={{r:3}}/></AreaChart></ResponsiveContainer></div>
          <div className="rpe-chart-card"><h4 className="rpe-chart-title">Return Reasons</h4><ResponsiveContainer width="100%" height={260}><BarChart data={reasonDist} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis type="number" tick={{fontSize:12}} stroke="#94a3b8"/><YAxis dataKey="name" type="category" tick={{fontSize:10}} stroke="#94a3b8" width={110}/><Tooltip contentStyle={{borderRadius:8}}/><Bar dataKey="value" name="Count" radius={[0,4,4,0]}>{reasonDist.map((_e,i) => <Cell key={i} fill={CC[i%CC.length]}/>)}</Bar></BarChart></ResponsiveContainer></div>
          <div className="rpe-chart-card"><h4 className="rpe-chart-title">Return Categories</h4><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={catDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>{catDist.map((_e,i) => <Cell key={i} fill={RPE_C[i%RPE_C.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
          <div className="rpe-chart-card"><h4 className="rpe-chart-title">Disposition Distribution</h4><ResponsiveContainer width="100%" height={260}><BarChart data={dispDist}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="name" tick={{fontSize:11}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip contentStyle={{borderRadius:8}}/><Bar dataKey="value" name="Count" radius={[4,4,0,0]}>{dispDist.map((_e,i) => <Cell key={i} fill={CC[i%CC.length]}/>)}</Bar></BarChart></ResponsiveContainer></div>
          <div className="rpe-chart-card"><h4 className="rpe-chart-title">Carrier Performance</h4><ResponsiveContainer width="100%" height={260}><RadarChart data={carrierPerf}><PolarGrid/><PolarAngleAxis dataKey="carrier" tick={{fontSize:10}}/><PolarRadiusAxis tick={{fontSize:10}}/><Radar name="Recovery" dataKey="recovery" stroke={C.teal} fill="#0d948833" strokeWidth={2}/><Radar name="Speed" dataKey="speed" stroke={C.indigo} fill="#6366f133" strokeWidth={2}/></RadarChart></ResponsiveContainer></div>
        </div>
      </div>
    )},
    { title: "Returns", content: (
      <div className="rpe-tab-section">
        <div className="rpe-filters"><input className="rpe-search" placeholder="Search by customer or ID..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/><select className="rpe-filter" value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}><option value="all">All Statuses</option>{[...RETURN_STATUSES].map(st=><option key={st} value={st}>{st}</option>)}</select><select className="rpe-filter" value={filterCategory} onChange={(e)=>setFilterCategory(e.target.value)}><option value="all">All Categories</option>{[...RETURN_CATEGORIES].map(c=><option key={c} value={c}>{c}</option>)}</select><select className="rpe-filter" value={filterReason} onChange={(e)=>setFilterReason(e.target.value)}><option value="all">All Reasons</option>{[...RETURN_REASONS].map(r=><option key={r} value={r}>{r}</option>)}</select></div>
        <div className="rpe-table-wrap"><table className="rpe-table"><thead><tr><th className="rpe-clickable" onClick={()=>handleSort("id")}>ID {sortBy==="id"&&(sortAsc?"↑":"↓")}</th><th>Order</th><th>Customer</th><th>Category</th><th>Reason</th><th>Status</th><th>Carrier</th><th>Items</th><th>Refund</th><th>Quality</th></tr></thead><tbody>{filteredReturns.slice(0,50).map(r=><tr key={r.id} className="rpe-row" onClick={()=>openReturnDrawer(r)}><td className="rpe-cell-id">{r.id}</td><td className="rpe-cell-mono">{r.orderId}</td><td>{r.customer}</td><td><span className="rpe-badge-cat">{r.category}</span></td><td className="rpe-cell-truncate">{r.reason}</td><td><span className={`rpe-badge-status rpe-status-${r.status.toLowerCase().replace(/\s+/g,"-")}`}>{r.status}</span></td><td className="rpe-cell-truncate">{r.carrier}</td><td className="rpe-cell-mono">{r.items}</td><td className="rpe-cell-mono">{formatINR(r.refundAmount)}</td><td><QBadge score={r.qualityScore}/></td></tr>)}</tbody></table></div>
      </div>
    )},
    { title: "Inspection", content: (
      <div className="rpe-tab-section">
        <div className="rpe-filters"><input className="rpe-search" placeholder="Search by customer or ID..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/><select className="rpe-filter" value={filterResult} onChange={(e)=>setFilterResult(e.target.value)}><option value="all">All Results</option>{[...INSPECTION_RESULTS].map(r=><option key={r} value={r}>{r}</option>)}</select><select className="rpe-filter" value={filterCategory} onChange={(e)=>setFilterCategory(e.target.value)}><option value="all">All Categories</option>{[...RETURN_CATEGORIES].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div className="rpe-table-wrap"><table className="rpe-table"><thead><tr><th className="rpe-clickable" onClick={()=>handleSort("id")}>ID {sortBy==="id"&&(sortAsc?"↑":"↓")}</th><th>Return ID</th><th>Customer</th><th>Category</th><th>Inspector</th><th>Result</th><th>Quality</th><th>Defects</th><th>Restock</th><th>Disposition</th><th>Cost</th></tr></thead><tbody>{filteredInspections.slice(0,50).map(ins=><tr key={ins.id} className="rpe-row" onClick={()=>openInspectionDrawer(ins)}><td className="rpe-cell-id">{ins.id}</td><td className="rpe-cell-mono">{ins.returnId}</td><td>{ins.customer}</td><td><span className="rpe-badge-cat">{ins.category}</span></td><td>{ins.inspector}</td><td><span className={`rpe-badge-result rpe-result-${ins.result.toLowerCase()}`}>{ins.result}</span></td><td><ScoreRing score={ins.qualityScore} size={38} strokeWidth={3}/></td><td className="rpe-cell-mono">{ins.defectsFound}</td><td>{ins.restockable ? <span className="rpe-badge-restock">Yes</span> : <span className="rpe-badge-no-restock">No</span>}</td><td><span className={`rpe-badge-disp rpe-disp-${ins.disposition.toLowerCase()}`}>{ins.disposition}</span></td><td className="rpe-cell-mono">{formatINR(ins.processingCost)}</td></tr>)}</tbody></table></div>
      </div>
    )},
    { title: "Disposition", content: (
      <div className="rpe-tab-section">
        <div className="rpe-filters"><input className="rpe-search" placeholder="Search by customer or ID..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/><select className="rpe-filter" value={filterDisposition} onChange={(e)=>setFilterDisposition(e.target.value)}><option value="all">All Types</option>{[...DISPOSITION_TYPES].map(d=><option key={d} value={d}>{d}</option>)}</select></div>
        <div className="rpe-table-wrap"><table className="rpe-table"><thead><tr><th>ID</th><th>Return ID</th><th>Customer</th><th>Category</th><th>Type</th><th>Recovery</th><th>Original</th><th>Rate</th><th>Days</th><th>Destination</th></tr></thead><tbody>{filteredDispositions.slice(0,50).map(d=><tr key={d.id} className="rpe-row" onClick={()=>openDispositionDrawer(d)}><td className="rpe-cell-id">{d.id}</td><td className="rpe-cell-mono">{d.returnId}</td><td>{d.customer}</td><td><span className="rpe-badge-cat">{d.category}</span></td><td><span className={`rpe-badge-disp rpe-disp-${d.dispositionType.toLowerCase()}`}>{d.dispositionType}</span></td><td className="rpe-cell-mono">{formatINR(d.recoveryValue)}</td><td className="rpe-cell-mono">{formatINR(d.originalValue)}</td><td><div className="rpe-coverage-bar-wrap"><div className="rpe-coverage-bar-track"><div className="rpe-coverage-bar" style={{width:`${d.recoveryRate}%`,backgroundColor:d.recoveryRate>=60?C.emerald:d.recoveryRate>=30?C.amber:C.rose}}/></div><span className="rpe-coverage-label">{d.recoveryRate}%</span></div></td><td className="rpe-cell-mono">{d.timeToProcess}d</td><td className="rpe-cell-truncate">{d.destination}</td></tr>)}</tbody></table></div>
      </div>
    )},
    { title: "Refunds", content: (
      <div className="rpe-tab-section">
        <div className="rpe-filters"><input className="rpe-search" placeholder="Search by customer or ID..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/><select className="rpe-filter" value={filterRefundType} onChange={(e)=>setFilterRefundType(e.target.value)}><option value="all">All Types</option>{[...REFUND_TYPES].map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div className="rpe-table-wrap"><table className="rpe-table"><thead><tr><th className="rpe-clickable" onClick={()=>handleSort("id")}>ID {sortBy==="id"&&(sortAsc?"↑":"↓")}</th><th>Return ID</th><th>Customer</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th>Days</th><th>Satisfaction</th></tr></thead><tbody>{filteredRefunds.slice(0,50).map(ref=><tr key={ref.id} className="rpe-row" onClick={()=>openRefundDrawer(ref)}><td className="rpe-cell-id">{ref.id}</td><td className="rpe-cell-mono">{ref.returnId}</td><td>{ref.customer}</td><td><span className="rpe-badge-refund-type">{ref.refundType}</span></td><td className="rpe-cell-mono">{formatINR(ref.amount)}</td><td><span className={`rpe-badge-status rpe-status-${ref.status.toLowerCase()}`}>{ref.status}</span></td><td>{ref.processedDate}</td><td className="rpe-cell-mono">{ref.processingTime}d</td><td className="rpe-cell-mono">{ref.customerSatisfaction}/5</td></tr>)}</tbody></table></div>
      </div>
    )},
    { title: "Analytics", content: (
      <div className="rpe-tab-dashboard">
        <div className="rpe-kpi-grid">
          <div className="rpe-kpi-card" style={{borderTopColor:C.teal}}><span className="rpe-kpi-icon">📊</span><span className="rpe-kpi-label">Avg Recovery</span><span className="rpe-kpi-value">{Math.round(data.dispositions.reduce((a,d)=>a+d.recoveryRate,0)/data.dispositions.length)}%</span></div>
          <div className="rpe-kpi-card" style={{borderTopColor:C.indigo}}><span className="rpe-kpi-icon">📈</span><span className="rpe-kpi-label">Restock Rate</span><span className="rpe-kpi-value">{Math.round(data.inspections.filter(i=>i.restockable).length/data.inspections.length*100)}%</span></div>
          <div className="rpe-kpi-card" style={{borderTopColor:C.rose}}><span className="rpe-kpi-icon">⚠️</span><span className="rpe-kpi-label">Fail Rate</span><span className="rpe-kpi-value">{Math.round(data.inspections.filter(i=>i.result==="Fail").length/data.inspections.length*100)}%</span></div>
          <div className="rpe-kpi-card" style={{borderTopColor:C.emerald}}><span className="rpe-kpi-icon">✅</span><span className="rpe-kpi-label">Pass Rate</span><span className="rpe-kpi-value">{Math.round(data.inspections.filter(i=>i.result==="Pass").length/data.inspections.length*100)}%</span></div>
        </div>
        <div className="rpe-chart-grid">
          <div className="rpe-chart-card rpe-chart-wide"><h4 className="rpe-chart-title">Processing Time by Category</h4><ResponsiveContainer width="100%" height={260}><BarChart data={[...RETURN_CATEGORIES].map(cat=>({category:cat,avgTime:Math.round(data.returns.filter(r=>r.category===cat).reduce((a,r)=>a+r.processingTime,0)/Math.max(data.returns.filter(r=>r.category===cat).length,1))}))}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="category" tick={{fontSize:11}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip contentStyle={{borderRadius:8}}/><Bar dataKey="avgTime" name="Avg Days" radius={[4,4,0,0]} fill={C.indigo}/></BarChart></ResponsiveContainer></div>
          <div className="rpe-chart-card"><h4 className="rpe-chart-title">Monthly Return Rate</h4><ResponsiveContainer width="100%" height={260}><LineChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="month" tick={{fontSize:12}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip contentStyle={{borderRadius:8}}/><Line type="monotone" dataKey="returns" name="Returns" stroke={C.teal} strokeWidth={2} dot={{r:4}}/></LineChart></ResponsiveContainer></div>
          <div className="rpe-chart-card"><h4 className="rpe-chart-title">Recovery vs Process Time</h4><ResponsiveContainer width="100%" height={260}><AreaChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="month" tick={{fontSize:12}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip contentStyle={{borderRadius:8}}/><Legend/><Area type="monotone" dataKey="recoveryRate" name="Recovery %" fill="#05966933" stroke={C.emerald} strokeWidth={2}/><Area type="monotone" dataKey="avgProcessTime" name="Avg Days" fill="#6366f133" stroke={C.indigo} strokeWidth={2}/></AreaChart></ResponsiveContainer></div>
        </div>
      </div>
    )},
  ]

  return (
    <div className="rpe-root">
      <PageHeader title="Returns Processing Enhancement" description="End-to-end returns management with quality inspection, disposition tracking, and refund automation" />
      <div className="rpe-tabs">{tabs.map((tab, i) => (<button key={i} className={cn("rpe-tab-btn", activeTab===i && "rpe-tab-btn-active")} onClick={()=>setActiveTab(i)}>{tab.title}</button>))}</div>
      <div className="rpe-tab-content">{tabs[activeTab].content}</div>
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}><SheetContent className="rpe-sheet" side="right"><div className="rpe-sheet-body">{renderDrawer()}</div></SheetContent></Sheet>
    </div>
  )
}
