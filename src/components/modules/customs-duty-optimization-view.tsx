"use client"
import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const WAREHOUSES = ["Mumbai Port DC", "Nhava Sheva CFS", "Delhi ICD", "Chennai Port DC", "Bangalore Air FC", "Kolkata Port WH", "Cochin Port DC", "Tuticorin DC", "Kandla Port WH", "Visakhapatnam DC"] as const
const PORTS = ["JNPT Mumbai", "Chennai Port", "Kolkata Port", "Cochin Port", "Tuticorin Port", "Kandla Port", "Visakhapatnam", "Mormugao", "Mangalore", "Ennore"] as const
const COUNTRIES = ["China", "USA", "Germany", "UAE", "Japan", "South Korea", "UK", "Singapore", "Thailand", "Vietnam", "Indonesia", "Taiwan"] as const
const HS_CODES = ["8542 (Chips)", "8471 (Laptops)", "8703 (Auto Parts)", "3004 (Pharma)", "6109 (Apparel)", "8481 (Valves)", "7318 (Fasteners)", "9018 (Medical)", "3923 (Plastics)", "2827 (Chemicals)", "7207 (Iron/Steel)", "0901 (Coffee)"] as const
const DUTY_TYPES = ["Basic Customs Duty", "IGST", "Social Welfare Surcharge", "Integrated Tax", "Compensation Cess", "Anti-Dumping Duty", "Safeguard Duty", "Countervailing Duty"] as const
const IMPORT_STATUSES = ["Pending Review", "Documentation", "Assessment", "Examination", "Duty Calculated", "Payment Pending", "Cleared", "Hold", "Under Audit"] as const
const COMPLIANCE_LEVELS = ["Fully Compliant", "Minor Issues", "Major Issues", "Non-Compliant", "Under Review"] as const
const PRIORITY_LEVELS = ["Critical", "High", "Medium", "Low", "Routine"] as const
const DOCUMENT_TYPES = ["Bill of Entry", "Invoice", "Packing List", "Certificate of Origin", "Phyto Certificate", "FSSAI License", "Test Report", "Insurance Certificate", "BL/AWB", "License/Permit"] as const

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

function ComplianceScore({ score }: { score: number }) {
  return (
    <span className="cdo-score-ring" style={{ color: score > 90 ? C.teal : score > 70 ? C.emerald : score > 50 ? C.amber : C.rose }}>
      {score > 90 ? "●" : score > 70 ? "●" : score > 50 ? "●" : "●"} {score}%
    </span>
  )
}

function generateData() {
  const rand = seededRandom(188)
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
  const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

  const imports = Array.from({ length: 100 }, (_, i) => {
    const assessVal = rInt(100000, 80000000)
    const dutyPct = rand() * 25 + 5
    return {
      id: `IMP-${String(i + 1).padStart(5, "0")}`,
      hsCode: pick(HS_CODES),
      country: pick(COUNTRIES),
      port: pick(PORTS),
      warehouse: pick(WAREHOUSES),
      assessValue: assessVal,
      totalDuty: Math.round(assessVal * dutyPct / 100),
      dutyPct: Math.round(dutyPct * 10) / 10,
      weightKg: rInt(50, 25000),
      containerNo: `MSKU${String(rInt(100000, 999999))}`,
      status: pick(IMPORT_STATUSES),
      priority: pick(PRIORITY_LEVELS),
      compliance: pick(COMPLIANCE_LEVELS),
      complianceScore: rInt(40, 100),
      docComplete: rand() > 0.2,
      submitDate: `2026-07-${String(rInt(1, 28)).padStart(2, "0")}`,
      clearanceDate: `2026-07-${String(rInt(1, 31)).padStart(2, "0")}`,
      agent: pick(["Rajesh Trans", "Skyline Customs", "Allcargo Logistics", "VRL Customs", "DCM Shriram", "Gateway Distriparks"]),
    }
  })

  const dutyBreakdown = Array.from({ length: 80 }, (_, i) => {
    const base = rInt(10000, 5000000)
    const igst = Math.round(base * (rand() * 0.18 + 0.05))
    const sws = Math.round(base * (rand() * 0.1 + 0.01))
    const cess = Math.round(base * (rand() * 0.06))
    const add = rand() > 0.6 ? Math.round(base * (rand() * 0.15 + 0.05)) : 0
    const safeguard = rand() > 0.85 ? Math.round(base * (rand() * 0.1)) : 0
    return {
      id: `DB-${String(i + 1).padStart(4, "0")}`,
      importId: imports[i % 100].id,
      hsCode: pick(HS_CODES),
      country: pick(COUNTRIES),
      basicDuty: base,
      igst: igst,
      sws: sws,
      cess: cess,
      antidumping: add,
      safeguard: safeguard,
      totalDuty: base + igst + sws + cess + add + safeguard,
      effectiveRate: 0,
      hsnDesc: pick(HS_CODES),
    }
  }).map(d => ({ ...d, effectiveRate: d.totalDuty > 0 ? Math.round((d.totalDuty / (d.basicDuty * 5)) * 100) : 0 }))

  const dutySavings = Array.from({ length: 50 }, (_, i) => ({
    id: `DS-${String(i + 1).padStart(4, "0")}`,
    category: pick(["FTA Utilization", "Advance Ruling", "Bonded Warehouse", "SEZ Benefit", "Drawback Claim", "RoDTEP", "MEIS/RoTCL", "Exemption Cert", "Customs Duty Refund", "Valuation Optimization"]),
    description: pick(["Reduced BCD under FTA", "Advance ruling on classification", "Duty deferral via bonding", "SEZ duty exemption", "Duty drawback claim filed", "RoDTEP scrip utilized", "Export incentive claimed", "Exemption certificate applied", "Refund processed", "Transaction value optimized"]),
    potentialSaving: rInt(50000, 5000000),
    realizedSaving: rInt(20000, 4000000),
    status: pick(["Active", "Completed", "Pending Approval", "In Review", "Rejected"]),
    month: `${String(rInt(1, 12)).padStart(2, "0")}/2026`,
  }))

  const complianceRecords = Array.from({ length: 60 }, (_, i) => ({
    id: `CMP-${String(i + 1).padStart(4, "0")}`,
    warehouse: pick(WAREHOUSES),
    country: pick(COUNTRIES),
    hsCode: pick(HS_CODES),
    documentType: pick(DOCUMENT_TYPES),
    docStatus: pick(["Complete", "Incomplete", "Expired", "Pending", "Rejected"]),
    complianceLevel: pick(COMPLIANCE_LEVELS),
    score: rInt(30, 100),
    violations: rInt(0, 5),
    penalties: rInt(0, 200000),
    lastAudit: `2026-${String(rInt(1, 12)).padStart(2, "0")}-${String(rInt(1, 28)).padStart(2, "0")}`,
    nextAudit: `2026-${String(rInt(6, 12)).padStart(2, "0")}-${String(rInt(1, 28)).padStart(2, "0")}`,
    auditor: pick(["CA Sharma", "CA Patel", "CA Krishnan", "CA Gupta", "CA Mehta"]),
  }))

  const monthlyTrend = Array.from({ length: 60 }, (_, i) => {
    const m = i % 12
    const base = rInt(5000000, 25000000)
    return {
      id: `MT-${String(i + 1).padStart(4, "0")}`,
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m],
      totalImports: rInt(50, 300),
      totalDuty: base,
      avgDutyPct: +(rand() * 20 + 8).toFixed(1),
      clearanceTimeHrs: rInt(12, 96),
      complianceRate: rInt(70, 99),
      savings: rInt(100000, 3000000),
      penalties: rInt(0, 500000),
      docsProcessed: rInt(80, 500),
    }
  })

  return {
    imports, dutyBreakdown, dutySavings, complianceRecords, monthlyTrend,
    warehouses: WAREHOUSES, ports: PORTS, countries: COUNTRIES, hsCodes: HS_CODES,
    dutyTypes: DUTY_TYPES, importStatuses: IMPORT_STATUSES, complianceLevels: COMPLIANCE_LEVELS,
    priorityLevels: PRIORITY_LEVELS, documentTypes: DOCUMENT_TYPES,
  }
}

export default function CustomsDutyOptimizationView() {
  const [tab, setTab] = useState(0)
  const [drawerData, setDrawerData] = useState<any>(null)
  const data = useMemo(() => generateData(), [])
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortDir, setSortDir] = useState("asc")

  const tabs = ["Dashboard", "Imports", "Duty Breakdown", "Savings", "Compliance", "Analytics"]

  const sortFn = (a: any, b: any) => {
    const av = a[sortBy], bv = b[sortBy]
    const m = typeof av === "string" ? av.localeCompare(bv) : av - bv
    return sortDir === "asc" ? m : -m
  }

  const kpiData = useMemo(() => [
    { label: "Total Imports", value: data.imports.length, sub: `across ${data.ports.length} ports`, color: C.teal },
    { label: "Total Duty Paid", value: formatINR(data.dutyBreakdown.reduce((s, d) => s + d.totalDuty, 0)), sub: "FY 2026-27", color: C.indigo },
    { label: "Avg Duty Rate", value: `${(data.imports.reduce((s, i) => s + i.dutyPct, 0) / data.imports.length).toFixed(1)}%`, sub: "across all HS codes", color: C.rose },
    { label: "Clearance Rate", value: `${Math.round(data.imports.filter(i => i.status === "Cleared").length / data.imports.length * 100)}%`, sub: "of total filings", color: C.emerald },
    { label: "Duty Savings", value: formatINR(data.dutySavings.reduce((s, d) => s + d.realizedSaving, 0)), sub: "realized YTD", color: C.amber },
    { label: "Compliance Score", value: `${Math.round(data.complianceRecords.reduce((s, c) => s + c.score, 0) / data.complianceRecords.length)}%`, sub: "avg across warehouses", color: C.sky },
  ], [data])

  const chartData = useMemo(() => {
    const monthly = data.monthlyTrend.filter((_, i) => i < 12)
    const byCountry = [...data.countries].map(c => ({ name: c, value: data.imports.filter(i => i.country === c).length || Math.floor(Math.random() * 15 + 3) }))
    const byDutyType = [
      { name: "Basic Duty", value: data.dutyBreakdown.reduce((s, d) => s + d.basicDuty, 0) },
      { name: "IGST", value: data.dutyBreakdown.reduce((s, d) => s + d.igst, 0) },
      { name: "SWS", value: data.dutyBreakdown.reduce((s, d) => s + d.sws, 0) },
      { name: "Cess", value: data.dutyBreakdown.reduce((s, d) => s + d.cess, 0) },
      { name: "Anti-Dumping", value: data.dutyBreakdown.reduce((s, d) => s + d.antidumping, 0) },
      { name: "Safeguard", value: data.dutyBreakdown.reduce((s, d) => s + d.safeguard, 0) },
    ]
    const complianceMix = [...data.complianceLevels].map(c => ({ name: c, value: data.complianceRecords.filter(r => r.complianceLevel === c).length }))
    const portPerf = [...data.ports].slice(0, 6).map(p => {
      const pi = data.imports.filter(i => i.port === p)
      return {
        port: p,
        throughput: Math.min(100, pi.length * 10),
        clearance: pi.length ? Math.round(pi.filter(i => i.status === "Cleared").length / pi.length * 100) : 70,
        compliance: pi.length ? Math.round(pi.reduce((s, i) => s + i.complianceScore, 0) / pi.length) : 75,
        avgDuty: pi.length ? Math.round(pi.reduce((s, i) => s + i.dutyPct, 0) / pi.length) : 15,
      }
    })
    return { monthly, byCountry, byDutyType, complianceMix, portPerf }
  }, [data])

  const filteredImports = useMemo(() => {
    let list = [...data.imports]
    if (search) list = list.filter(i => i.id.toLowerCase().includes(search.toLowerCase()) || i.hsCode.toLowerCase().includes(search.toLowerCase()) || i.country.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter(i => i.country === filterType)
    if (filterStatus !== "all") list = list.filter(i => i.status === filterStatus)
    return list.sort(sortFn)
  }, [data, search, filterType, filterStatus, sortBy, sortDir])

  const filteredDuty = useMemo(() => {
    let list = [...data.dutyBreakdown]
    if (search) list = list.filter(d => d.id.toLowerCase().includes(search.toLowerCase()) || d.hsCode.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter(d => d.country === filterType)
    return list.sort(sortFn)
  }, [data, search, filterType, sortBy, sortDir])

  const filteredCompliance = useMemo(() => {
    let list = [...data.complianceRecords]
    if (search) list = list.filter(c => c.id.toLowerCase().includes(search.toLowerCase()) || c.warehouse.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter(c => c.complianceLevel === filterType)
    if (filterStatus !== "all") list = list.filter(c => c.documentType === filterStatus)
    return list.sort(sortFn)
  }, [data, search, filterType, filterStatus, sortBy, sortDir])

  const handleSort = (col: string) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortBy(col); setSortDir("asc") }
  }

  function ImportDrawer({ item, onClose }: { item: any; onClose: () => void }) {
    return (
      <>
        <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
          <SheetContent>
            <div className="cdo-drawer-header">
              <h3 className="cdo-drawer-title">{item?.id}</h3>
              <span className={cn("cdo-priority-badge cdo-priority-badge-" + (item?.priority || "medium").toLowerCase(), "")}>{item?.priority}</span>
              <span className={cn("cdo-import-status-badge cdo-import-status-badge-" + (item?.status || "pending-review").toLowerCase().replace(/\s+/g, "-"), "")}>{item?.status}</span>
            </div>
            <div className="cdo-drawer-body">
              <div className="cdo-compliance-section">
                <span className={cn("cdo-compliance-badge cdo-compliance-badge-" + (item?.compliance || "fully-compliant").toLowerCase().replace(/\s+/g, "-"), "")}>{item?.compliance}</span>
                <ComplianceScore score={item?.complianceScore || 0} />
              </div>
              <div className="cdo-metrics-grid">
                <div className="cdo-metric-card"><div className="cdo-metric-value">{formatINR(item?.assessValue || 0)}</div><div className="cdo-metric-label">Assess Value</div></div>
                <div className="cdo-metric-card"><div className="cdo-metric-value">{formatINR(item?.totalDuty || 0)}</div><div className="cdo-metric-label">Total Duty</div></div>
                <div className="cdo-metric-card"><div className="cdo-metric-value">{item?.dutyPct}%</div><div className="cdo-metric-label">Duty Rate</div></div>
              </div>
              <div className="cdo-fields-grid">
                <div className="cdo-field"><span className="cdo-field-label">HS Code</span><span className="cdo-field-value">{item?.hsCode}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Country</span><span className="cdo-field-value">{item?.country}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Port</span><span className="cdo-field-value">{item?.port}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Container</span><span className="cdo-field-value">{item?.containerNo}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Weight</span><span className="cdo-field-value">{item?.weightKg} kg</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Warehouse</span><span className="cdo-field-value">{item?.warehouse}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Agent</span><span className="cdo-field-value">{item?.agent}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Docs</span><span className={cn("cdo-doc-badge", item?.docComplete ? "cdo-doc-complete" : "cdo-doc-incomplete")}>{item?.docComplete ? "Complete" : "Incomplete"}</span></div>
              </div>
              <div className="cdo-drawer-actions">
                <button className="cdo-action-btn cdo-action-primary">Process Entry</button>
                <button className="cdo-action-btn cdo-action-secondary">View Documents</button>
                <button className="cdo-action-btn cdo-action-outline">Calculate Duty</button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  function DutyDrawer({ item, onClose }: { item: any; onClose: () => void }) {
    const total = item?.totalDuty || 0
    return (
      <>
        <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
          <SheetContent>
            <div className="cdo-drawer-header">
              <h3 className="cdo-drawer-title">{item?.id} — {item?.hsCode}</h3>
              <span className="cdo-duty-total">{formatINR(total)}</span>
            </div>
            <div className="cdo-drawer-body">
              <div className="cdo-duty-breakdown-visual">
                <div className="cdo-duty-row"><span>Basic Duty</span><span>{formatINR(item?.basicDuty || 0)}</span><div className="cdo-duty-bar-bg"><div className="cdo-duty-bar-fill cdo-duty-fill-teal" style={{ width: `${Math.min(100, (item?.basicDuty || 0) / total * 100)}%` }} /></div></div>
                <div className="cdo-duty-row"><span>IGST</span><span>{formatINR(item?.igst || 0)}</span><div className="cdo-duty-bar-bg"><div className="cdo-duty-bar-fill cdo-duty-fill-indigo" style={{ width: `${Math.min(100, (item?.igst || 0) / total * 100)}%` }} /></div></div>
                <div className="cdo-duty-row"><span>SWS</span><span>{formatINR(item?.sws || 0)}</span><div className="cdo-duty-bar-bg"><div className="cdo-duty-bar-fill cdo-duty-fill-amber" style={{ width: `${Math.min(100, (item?.sws || 0) / total * 100)}%` }} /></div></div>
                <div className="cdo-duty-row"><span>Cess</span><span>{formatINR(item?.cess || 0)}</span><div className="cdo-duty-bar-bg"><div className="cdo-duty-bar-fill cdo-duty-fill-rose" style={{ width: `${Math.min(100, (item?.cess || 0) / total * 100)}%` }} /></div></div>
                {item?.antidumping > 0 && <div className="cdo-duty-row"><span>Anti-Dumping</span><span>{formatINR(item?.antidumping)}</span><div className="cdo-duty-bar-bg"><div className="cdo-duty-bar-fill cdo-duty-fill-orange" style={{ width: `${Math.min(100, item?.antidumping / total * 100)}%` }} /></div></div>}
              </div>
              <div className="cdo-fields-grid">
                <div className="cdo-field"><span className="cdo-field-label">Import ID</span><span className="cdo-field-value">{item?.importId}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Country</span><span className="cdo-field-value">{item?.country}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Eff. Rate</span><span className="cdo-field-value">{item?.effectiveRate}%</span></div>
              </div>
              <div className="cdo-drawer-actions">
                <button className="cdo-action-btn cdo-action-primary">Verify Calculation</button>
                <button className="cdo-action-btn cdo-action-secondary">Export Report</button>
                <button className="cdo-action-btn cdo-action-outline">Appeal if Error</button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  function ComplianceDrawer({ item, onClose }: { item: any; onClose: () => void }) {
    return (
      <>
        <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
          <SheetContent>
            <div className="cdo-drawer-header">
              <h3 className="cdo-drawer-title">{item?.id}</h3>
              <span className={cn("cdo-compliance-badge cdo-compliance-badge-" + (item?.complianceLevel || "fully-compliant").toLowerCase().replace(/\s+/g, "-"), "")}>{item?.complianceLevel}</span>
              <span className={cn("cdo-doc-status-badge cdo-doc-status-badge-" + (item?.docStatus || "complete").toLowerCase(), "")}>{item?.docStatus}</span>
            </div>
            <div className="cdo-drawer-body">
              <ComplianceScore score={item?.score || 0} />
              <div className="cdo-metrics-grid">
                <div className="cdo-metric-card"><div className="cdo-metric-value">{item?.violations}</div><div className="cdo-metric-label">Violations</div></div>
                <div className="cdo-metric-card"><div className="cdo-metric-value">{formatINR(item?.penalties || 0)}</div><div className="cdo-metric-label">Penalties</div></div>
                <div className="cdo-metric-card"><div className="cdo-metric-value">{item?.score}/100</div><div className="cdo-metric-label">Score</div></div>
              </div>
              <div className="cdo-fields-grid">
                <div className="cdo-field"><span className="cdo-field-label">Warehouse</span><span className="cdo-field-value">{item?.warehouse}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Country</span><span className="cdo-field-value">{item?.country}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">HS Code</span><span className="cdo-field-value">{item?.hsCode}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Document</span><span className="cdo-field-value">{item?.documentType}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Last Audit</span><span className="cdo-field-value">{item?.lastAudit}</span></div>
                <div className="cdo-field"><span className="cdo-field-label">Auditor</span><span className="cdo-field-value">{item?.auditor}</span></div>
              </div>
              <div className="cdo-drawer-actions">
                <button className="cdo-action-btn cdo-action-primary">Initiate Audit</button>
                <button className="cdo-action-btn cdo-action-secondary">Download Report</button>
                <button className="cdo-action-btn cdo-action-outline">Raise Dispute</button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  const thClass = "cdo-th"
  const tdClass = "cdo-td"

  return (
    <div className="cdo-root">
      <PageHeader title="Customs & Duty Optimization" description="Manage import compliance, duty calculations, savings opportunities, and customs clearance across Indian ports" />
      <div className="cdo-tabs">{tabs.map((t, i) => (
        <button key={t} className={cn("cdo-tab", tab === i && "cdo-tab-active")} onClick={() => setTab(i)}>{t}</button>
      ))}</div>

      {tab === 0 && (
        <div className="cdo-tab-content">
          <div className="cdo-kpi-grid">{kpiData.map(k => (
            <div key={k.label} className="cdo-kpi-card" style={{ borderLeftColor: k.color }}>
              <div className="cdo-kpi-label">{k.label}</div>
              <div className="cdo-kpi-value">{k.value}</div>
              <div className="cdo-kpi-sub">{k.sub}</div>
            </div>
          ))}</div>
          <div className="cdo-chart-grid">
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Monthly Import Volume & Duty</h4>
              <ResponsiveContainer width="100%" height={250}><AreaChart data={chartData.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="totalDuty" stroke={C.teal} fill={C.teal} fillOpacity={0.15} name="Total Duty (₹)" />
                <Line type="monotone" dataKey="complianceRate" stroke={C.indigo} strokeDasharray="5 5" name="Compliance %" dot={false} />
              </AreaChart></ResponsiveContainer></div>
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Imports by Country</h4>
              <ResponsiveContainer width="100%" height={250}><PieChart>
                <Pie data={chartData.byCountry} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={2}>
                  {chartData.byCountry.map((_, i) => <Cell key={i} fill={CC[i % CC.length]} />)}
                </Pie><Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} /><Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </PieChart></ResponsiveContainer></div>
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Duty Type Breakdown</h4>
              <ResponsiveContainer width="100%" height={250}><BarChart data={chartData.byDutyType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis type="number" stroke="#94a3b8" fontSize={11} /><YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="value" fill={C.indigo} radius={[0, 4, 4, 0]} />
              </BarChart></ResponsiveContainer></div>
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Compliance Distribution</h4>
              <ResponsiveContainer width="100%" height={250}><PieChart>
                <Pie data={chartData.complianceMix} cx="50%" cy="50%" outerRadius={95} dataKey="value" paddingAngle={2}>
                  {chartData.complianceMix.map((_, i) => <Cell key={i} fill={CC[i % CC.length]} />)}
                </Pie><Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} /><Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </PieChart></ResponsiveContainer></div>
            <div className="cdo-chart-card cdo-chart-wide"><h4 className="cdo-chart-title">Port Performance</h4>
              <ResponsiveContainer width="100%" height={300}><RadarChart data={chartData.portPerf}>
                <PolarGrid stroke="#334155" /><PolarAngleAxis dataKey="port" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={9} />
                <Radar name="Throughput" dataKey="throughput" stroke={C.teal} fill={C.teal} fillOpacity={0.15} />
                <Radar name="Clearance" dataKey="clearance" stroke={C.indigo} fill={C.indigo} fillOpacity={0.1} />
                <Radar name="Compliance" dataKey="compliance" stroke={C.emerald} fill={C.emerald} fillOpacity={0.1} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
              </RadarChart></ResponsiveContainer></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="cdo-tab-content">
          <div className="cdo-filter-bar">
            <input className="cdo-search" placeholder="Search imports..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="cdo-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">All Countries</option>{[...data.countries].map(c => <option key={c} value={c}>{c}</option>)}</select>
            <select className="cdo-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="all">All Status</option>{[...data.importStatuses].map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="cdo-table-wrap"><table className="cdo-table"><thead><tr>
            <th className={thClass} onClick={() => handleSort("id")}>ID</th>
            <th className={thClass} onClick={() => handleSort("hsCode")}>HS Code</th>
            <th className={thClass} onClick={() => handleSort("country")}>Country</th>
            <th className={thClass} onClick={() => handleSort("port")}>Port</th>
            <th className={thClass} onClick={() => handleSort("assessValue")}>Assess Value</th>
            <th className={thClass} onClick={() => handleSort("totalDuty")}>Total Duty</th>
            <th className={thClass} onClick={() => handleSort("dutyPct")}>Rate %</th>
            <th className={thClass} onClick={() => handleSort("priority")}>Priority</th>
            <th className={thClass} onClick={() => handleSort("status")}>Status</th>
            <th className={thClass} onClick={() => handleSort("complianceScore")}>Score</th>
          </tr></thead><tbody>
            {filteredImports.slice(0, 50).map(imp => (
              <tr key={imp.id} className="cdo-tr" onClick={() => setDrawerData(imp)}>
                <td className={tdClass}>{imp.id}</td>
                <td className={tdClass}>{imp.hsCode}</td>
                <td className={tdClass}>{imp.country}</td>
                <td className={tdClass}>{imp.port}</td>
                <td className={tdClass}>{formatINR(imp.assessValue)}</td>
                <td className={tdClass}>{formatINR(imp.totalDuty)}</td>
                <td className={tdClass}>{imp.dutyPct}%</td>
                <td className={tdClass}><span className={cn("cdo-priority-badge cdo-priority-badge-" + imp.priority.toLowerCase(), "")}>{imp.priority}</span></td>
                <td className={tdClass}><span className={cn("cdo-import-status-badge cdo-import-status-badge-" + imp.status.toLowerCase().replace(/\s+/g, "-"), "")}>{imp.status}</span></td>
                <td className={tdClass}><ComplianceScore score={imp.complianceScore} /></td>
              </tr>
            ))}
          </tbody></table></div>
          {filteredImports.length > 50 && <div className="cdo-showing">Showing 50 of {filteredImports.length}</div>}
        </div>
      )}

      {tab === 2 && (
        <div className="cdo-tab-content">
          <div className="cdo-filter-bar">
            <input className="cdo-search" placeholder="Search duty records..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="cdo-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">All Countries</option>{[...data.countries].map(c => <option key={c} value={c}>{c}</option>)}</select>
          </div>
          <div className="cdo-table-wrap"><table className="cdo-table"><thead><tr>
            <th className={thClass} onClick={() => handleSort("id")}>ID</th>
            <th className={thClass} onClick={() => handleSort("hsCode")}>HS Code</th>
            <th className={thClass} onClick={() => handleSort("country")}>Country</th>
            <th className={thClass} onClick={() => handleSort("basicDuty")}>Basic Duty</th>
            <th className={thClass} onClick={() => handleSort("igst")}>IGST</th>
            <th className={thClass} onClick={() => handleSort("cess")}>Cess</th>
            <th className={thClass} onClick={() => handleSort("antidumping")}>AD Duty</th>
            <th className={thClass} onClick={() => handleSort("totalDuty")}>Total</th>
            <th className={thClass} onClick={() => handleSort("effectiveRate")}>Eff Rate</th>
          </tr></thead><tbody>
            {filteredDuty.slice(0, 50).map(d => (
              <tr key={d.id} className="cdo-tr" onClick={() => setDrawerData({ ...d, drawerType: "duty" })}>
                <td className={tdClass}>{d.id}</td>
                <td className={tdClass}>{d.hsCode}</td>
                <td className={tdClass}>{d.country}</td>
                <td className={tdClass}>{formatINR(d.basicDuty)}</td>
                <td className={tdClass}>{formatINR(d.igst)}</td>
                <td className={tdClass}>{formatINR(d.cess)}</td>
                <td className={tdClass}>{d.antidumping > 0 ? formatINR(d.antidumping) : "—"}</td>
                <td className={tdClass}>{formatINR(d.totalDuty)}</td>
                <td className={tdClass}>{d.effectiveRate}%</td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {tab === 3 && (
        <div className="cdo-tab-content">
          <div className="cdo-chart-grid">
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Potential vs Realized Savings</h4>
              <ResponsiveContainer width="100%" height={250}><BarChart data={data.dutySavings.slice(0, 15).map((s, i) => ({ name: s.category.split(" ").slice(0, 2).join(" "), potential: s.potentialSaving, realized: s.realizedSaving }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" height={60} /><YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="potential" fill={C.indigo} radius={[4, 4, 0, 0]} name="Potential" />
                <Bar dataKey="realized" fill={C.teal} radius={[4, 4, 0, 0]} name="Realized" />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </BarChart></ResponsiveContainer></div>
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Monthly Savings Trend</h4>
              <ResponsiveContainer width="100%" height={250}><LineChart data={chartData.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Line type="monotone" dataKey="savings" stroke={C.teal} strokeWidth={2} name="Savings (₹)" />
                <Line type="monotone" dataKey="penalties" stroke={C.rose} strokeWidth={2} name="Penalties (₹)" strokeDasharray="5 5" />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </LineChart></ResponsiveContainer></div>
          </div>
          <div className="cdo-table-wrap"><table className="cdo-table"><thead><tr>
            <th className={thClass}>Category</th>
            <th className={thClass}>Description</th>
            <th className={thClass}>Potential</th>
            <th className={thClass}>Realized</th>
            <th className={thClass}>Status</th>
          </tr></thead><tbody>
            {data.dutySavings.slice(0, 30).map(s => (
              <tr key={s.id} className="cdo-tr">
                <td className={tdClass}>{s.category}</td>
                <td className={tdClass}>{s.description}</td>
                <td className={tdClass}>{formatINR(s.potentialSaving)}</td>
                <td className={tdClass}>{formatINR(s.realizedSaving)}</td>
                <td className={tdClass}><span className={cn("cdo-savings-status-badge cdo-savings-status-badge-" + s.status.toLowerCase().replace(/\s+/g, "-"), "")}>{s.status}</span></td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {tab === 4 && (
        <div className="cdo-tab-content">
          <div className="cdo-filter-bar">
            <input className="cdo-search" placeholder="Search compliance..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="cdo-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">All Levels</option>{[...data.complianceLevels].map(c => <option key={c} value={c}>{c}</option>)}</select>
            <select className="cdo-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="all">All Documents</option>{[...data.documentTypes].map(d => <option key={d} value={d}>{d}</option>)}</select>
          </div>
          <div className="cdo-table-wrap"><table className="cdo-table"><thead><tr>
            <th className={thClass} onClick={() => handleSort("id")}>ID</th>
            <th className={thClass} onClick={() => handleSort("warehouse")}>Warehouse</th>
            <th className={thClass} onClick={() => handleSort("country")}>Country</th>
            <th className={thClass} onClick={() => handleSort("documentType")}>Document</th>
            <th className={thClass} onClick={() => handleSort("docStatus")}>Doc Status</th>
            <th className={thClass} onClick={() => handleSort("complianceLevel")}>Compliance</th>
            <th className={thClass} onClick={() => handleSort("score")}>Score</th>
            <th className={thClass} onClick={() => handleSort("violations")}>Violations</th>
            <th className={thClass} onClick={() => handleSort("penalties")}>Penalties</th>
          </tr></thead><tbody>
            {filteredCompliance.slice(0, 50).map(c => (
              <tr key={c.id} className="cdo-tr" onClick={() => setDrawerData({ ...c, drawerType: "compliance" })}>
                <td className={tdClass}>{c.id}</td>
                <td className={tdClass}>{c.warehouse}</td>
                <td className={tdClass}>{c.country}</td>
                <td className={tdClass}>{c.documentType}</td>
                <td className={tdClass}><span className={cn("cdo-doc-status-badge cdo-doc-status-badge-" + c.docStatus.toLowerCase(), "")}>{c.docStatus}</span></td>
                <td className={tdClass}><span className={cn("cdo-compliance-badge cdo-compliance-badge-" + c.complianceLevel.toLowerCase().replace(/\s+/g, "-"), "")}>{c.complianceLevel}</span></td>
                <td className={tdClass}><ComplianceScore score={c.score} /></td>
                <td className={tdClass}>{c.violations}</td>
                <td className={tdClass}>{c.penalties > 0 ? formatINR(c.penalties) : "—"}</td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {tab === 5 && (
        <div className="cdo-tab-content">
          <div className="cdo-chart-grid">
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Monthly Duty Trend</h4>
              <ResponsiveContainer width="100%" height={250}><AreaChart data={chartData.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="totalDuty" stroke={C.indigo} fill={C.indigo} fillOpacity={0.15} name="Total Duty" />
              </AreaChart></ResponsiveContainer></div>
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Avg Duty Rate Trend</h4>
              <ResponsiveContainer width="100%" height={250}><LineChart data={chartData.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Line type="monotone" dataKey="avgDutyPct" stroke={C.rose} strokeWidth={2} name="Avg Duty %" />
              </LineChart></ResponsiveContainer></div>
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Clearance Time Trend</h4>
              <ResponsiveContainer width="100%" height={250}><BarChart data={chartData.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="clearanceTimeHrs" fill={C.amber} radius={[4, 4, 0, 0]} name="Clearance Time (hrs)" />
              </BarChart></ResponsiveContainer></div>
            <div className="cdo-chart-card"><h4 className="cdo-chart-title">Documents Processed</h4>
              <ResponsiveContainer width="100%" height={250}><BarChart data={chartData.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="docsProcessed" fill={C.teal} radius={[4, 4, 0, 0]} name="Documents" />
              </BarChart></ResponsiveContainer></div>
          </div>
          <div className="cdo-summary-grid">
            {[
              { label: "Total Duty YTD", value: formatINR(data.monthlyTrend.reduce((s, m) => s + m.totalDuty, 0)), sub: "all months" },
              { label: "Avg Clearance Time", value: `${Math.round(data.monthlyTrend.reduce((s, m) => s + m.clearanceTimeHrs, 0) / data.monthlyTrend.length)} hrs`, sub: "across ports" },
              { label: "Avg Compliance", value: `${Math.round(data.monthlyTrend.reduce((s, m) => s + m.complianceRate, 0) / data.monthlyTrend.length)}%`, sub: "warehouse avg" },
              { label: "Total Penalties", value: formatINR(data.monthlyTrend.reduce((s, m) => s + m.penalties, 0)), sub: "YTD penalties" },
            ].map(k => (
              <div key={k.label} className="cdo-summary-card">
                <div className="cdo-summary-label">{k.label}</div>
                <div className="cdo-summary-value">{k.value}</div>
                <div className="cdo-summary-sub">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {drawerData?.drawerType === "duty" ? <DutyDrawer item={drawerData} onClose={() => setDrawerData(null)} /> :
       drawerData?.drawerType === "compliance" ? <ComplianceDrawer item={drawerData} onClose={() => setDrawerData(null)} /> :
       drawerData ? <ImportDrawer item={drawerData} onClose={() => setDrawerData(null)} /> : null}
    </div>
  )
}
