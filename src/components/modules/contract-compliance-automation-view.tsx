"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"

// ─── Seeded Random ─────────────────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ─── Theme Colors ────────────────────────────────────────────────────────────────
const COLORS = {
  teal: "#0d9488",
  indigo: "#6366f1",
  rose: "#e11d48",
  amber: "#d97706",
  emerald: "#059669",
  sky: "#0284c7",
  purple: "#7c3aed",
  slate: "#475569",
  orange: "#ea580c",
  lime: "#65a30d",
}

const CCA_COLORS = [
  COLORS.teal, COLORS.indigo, COLORS.rose, COLORS.amber,
  COLORS.emerald, COLORS.sky, COLORS.purple, COLORS.orange,
]

const CHART_COLORS = [
  COLORS.teal, COLORS.indigo, COLORS.rose, COLORS.amber,
  COLORS.emerald, COLORS.sky, COLORS.purple, COLORS.orange,
  COLORS.lime, COLORS.slate,
]

// ─── Constants ──────────────────────────────────────────────────────────────────
const SUPPLIERS = [
  "Tata Steel Ltd", "Reliance Industries", "Mahindra Logistics", "Blue Dart Express",
  "Delhivery Pvt Ltd", "TCI Express Ltd", "Allcargo Logistics", "DHL Supply Chain India",
  "FedEx India", "Gati Ltd", "VRL Logistics", "Transport Corp of India",
  "Aarti Drugs Ltd", "Apollo Tyres", "Bajaj Electricals", "Cipla Ltd",
  "Dr Reddys Labs", "Godrej Consumer", "Hindustan Unilever", "ITC Ltd",
] as const

const CONTRACT_TYPES = [
  "Master Service Agreement", "Transportation SLA", "Warehousing Lease",
  "Freight Contract", "3PL Partnership", "Cold Chain Agreement",
  "Last Mile Service", "Bulk Shipping", "Cross-Dock Agreement", "Dedicated Fleet",
] as const

const COMPLIANCE_DIMS = [
  "Payment Terms", "Delivery SLA", "Quality Standards", "Insurance Coverage",
  "Regulatory Filing", "Data Protection", "Safety Compliance", "Environmental Norms",
] as const

const CLAUSE_CATEGORIES = [
  "Force Majeure", "Liability Cap", "Termination", "Renewal Terms",
  "Penalty Clause", "Service Level", "Confidentiality", "Dispute Resolution",
  "Indemnification", "Audit Rights",
] as const

const RISK_LEVELS = ["Critical", "High", "Medium", "Low"] as const
const COMPLIANCE_STATUSES = ["Compliant", "Partial", "Non-Compliant", "Under Review", "Expired"] as const
const OBLIGATION_TYPES = ["Financial", "Operational", "Legal", "Reporting", "Quality", "Safety"] as const
const RENEWAL_STATUSES = ["Auto-Renew", "Manual Review", "Negotiating", "Terminated", "Not Started"] as const
const AUDIT_TYPES = ["Internal", "External", "Regulatory", "Supplier Self-Assessment"] as const

// ─── INR Formatting ────────────────────────────────────────────────────────────────
function formatINR(val: number) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`
  return `₹${val.toLocaleString("en-IN")}`
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Contract {
  id: string; supplier: string; contractType: string; value: number; startDate: string; endDate: string
  complianceScore: number; status: string; riskLevel: string; renewalStatus: string
  totalClauses: number; compliantClauses: number; nonCompliantClauses: number; warehouse: string
}

interface Obligation {
  id: string; contractId: string; supplier: string; obligationType: string; description: string
  dueDate: string; status: string; value: number; penaltyAmount: number; compliancePct: number
}

interface ClauseReview {
  id: string; contractId: string; supplier: string; category: string; clauseText: string
  complianceStatus: string; riskLevel: string; lastReview: string; nextReview: string
  actionRequired: string; financialImpact: number
}

interface AuditRecord {
  id: string; contractId: string; supplier: string; auditType: string; auditDate: string
  auditor: string; overallScore: number; findings: number; criticalFindings: number
  resolved: number; status: string
}

interface PenaltyRecord {
  id: string; contractId: string; supplier: string; clauseType: string; date: string
  amount: number; reason: string; status: string; disputeActive: boolean
}

// ─── Data Generation ───────────────────────────────────────────────────────────────
function generateData() {
  const s = seededRandom(181)
  const WAREHOUSES = ["Mumbai DC", "Delhi Hub", "Chennai DC", "Bangalore FC", "Kolkata WH", "Hyderabad DC", "Pune FC", "Ahmedabad WH", "Jaipur FC", "Lucknow WH"] as const
  const AUDITORS = ["Rajesh Kumar CPA", "Priya Sharma LLB", "Amit Patel CFE", "Neha Gupta CIA", "Vikram Singh CA", "Sunita Joshi ACS", "Rahul Mehta CPA", "Deepa Nair LLB"] as const

  const contracts: Contract[] = Array.from({ length: 80 }, (_, i) => {
    const supplier = SUPPLIERS[Math.floor(s() * SUPPLIERS.length)]
    const contractType = CONTRACT_TYPES[Math.floor(s() * CONTRACT_TYPES.length)]
    const value = Math.floor(s() * 9500000) + 500000
    const totalClauses = Math.floor(s() * 30) + 15
    const compScore = Math.floor(s() * 55) + 45
    const compliant = Math.floor(totalClauses * compScore / 100)
    const nonComp = totalClauses - compliant
    const startMonth = Math.floor(s() * 12) + 1
    const startYear = 2023 + Math.floor(s() * 3)
    const durationMonths = Math.floor(s() * 24) + 6
    const endMonth = ((startMonth - 1 + durationMonths) % 12) + 1
    const endYear = startYear + Math.floor((startMonth - 1 + durationMonths) / 12)
    const statuses = [...COMPLIANCE_STATUSES]
    const status = statuses[Math.floor(s() * statuses.length)]
    const risks = [...RISK_LEVELS]
    const riskLevel = risks[Math.floor(s() * risks.length)]
    const renewals = [...RENEWAL_STATUSES]
    const renewalStatus = renewals[Math.floor(s() * renewals.length)]
    return {
      id: `CTR-${String(i + 1).padStart(4, "0")}`,
      supplier, contractType, value,
      startDate: `${startYear}-${String(startMonth).padStart(2, "0")}-01`,
      endDate: `${endYear}-${String(endMonth).padStart(2, "0")}-28`,
      complianceScore: compScore, status, riskLevel, renewalStatus,
      totalClauses, compliantClauses: compliant, nonCompliantClauses: nonComp,
      warehouse: WAREHOUSES[Math.floor(s() * WAREHOUSES.length)],
    }
  })

  const obligations: Obligation[] = Array.from({ length: 100 }, (_, i) => {
    const contract = contracts[Math.floor(s() * contracts.length)]
    const oblTypes = [...OBLIGATION_TYPES]
    const oblType = oblTypes[Math.floor(s() * oblTypes.length)]
    const oblStatuses = ["Fulfilled", "Pending", "Overdue", "In Progress", "Breached"]
    const status = oblStatuses[Math.floor(s() * oblStatuses.length)]
    const compPct = Math.floor(s() * 60) + 40
    return {
      id: `OBL-${String(i + 1).padStart(4, "0")}`,
      contractId: contract.id, supplier: contract.supplier, obligationType: oblType,
      description: `${oblType} obligation for ${contract.supplier} under ${contract.contractType} - ${["Quarterly reporting", "Monthly payment settlement", "Annual audit submission", "Safety certification", "Quality compliance report", "Insurance renewal"][Math.floor(s() * 6)]}`,
      dueDate: `2026-${String(Math.floor(s() * 12) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      status, value: Math.floor(s() * 5000000) + 100000,
      penaltyAmount: status === "Breached" ? Math.floor(s() * 500000) + 50000 : 0,
      compliancePct: compPct,
    }
  })

  const clauseReviews: ClauseReview[] = Array.from({ length: 90 }, (_, i) => {
    const contract = contracts[Math.floor(s() * contracts.length)]
    const cats = [...CLAUSE_CATEGORIES]
    const category = cats[Math.floor(s() * cats.length)]
    const cStatuses = ["Compliant", "Non-Compliant", "Needs Review", "Amended", "Waived"]
    const compStatus = cStatuses[Math.floor(s() * cStatuses.length)]
    const risks = [...RISK_LEVELS]
    const riskLevel = risks[Math.floor(s() * risks.length)]
    return {
      id: `CLR-${String(i + 1).padStart(4, "0")}`,
      contractId: contract.id, supplier: contract.supplier, category,
      clauseText: `${category} clause: ${["All parties must comply with applicable regulations", "Maximum liability shall not exceed contract value", "Either party may terminate with 30 days notice", "Automatic renewal unless written notice provided", "Late delivery penalty of 0.5% per day", "Minimum service level of 98.5% on-time delivery", "All confidential information protected for 5 years post-termination", "Disputes resolved through arbitration in Mumbai"][Math.floor(s() * 8)]}`,
      complianceStatus: compStatus, riskLevel,
      lastReview: `2026-${String(Math.floor(s() * 6) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      nextReview: `2026-${String(Math.floor(s() * 6) + 7).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      actionRequired: compStatus === "Non-Compliant" ? "Immediate remediation required" : compStatus === "Needs Review" ? "Schedule review meeting" : "No action needed",
      financialImpact: riskLevel === "Critical" ? Math.floor(s() * 2000000) + 500000 : riskLevel === "High" ? Math.floor(s() * 500000) + 100000 : Math.floor(s() * 50000),
    }
  })

  const auditRecords: AuditRecord[] = Array.from({ length: 60 }, (_, i) => {
    const contract = contracts[Math.floor(s() * contracts.length)]
    const aTypes = [...AUDIT_TYPES]
    const auditType = aTypes[Math.floor(s() * aTypes.length)]
    const overall = Math.floor(s() * 40) + 60
    const findings = Math.floor(s() * 15) + 1
    const critFindings = Math.floor(s() * Math.min(findings, 4))
    const aStatuses = ["Completed", "In Progress", "Scheduled", "Overdue"]
    const status = aStatuses[Math.floor(s() * aStatuses.length)]
    return {
      id: `AUD-${String(i + 1).padStart(4, "0")}`,
      contractId: contract.id, supplier: contract.supplier, auditType,
      auditDate: `2026-${String(Math.floor(s() * 12) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      auditor: AUDITORS[Math.floor(s() * AUDITORS.length)],
      overallScore: overall, findings, criticalFindings: critFindings,
      resolved: Math.floor(s() * findings), status,
    }
  })

  const penaltyRecords: PenaltyRecord[] = Array.from({ length: 55 }, (_, i) => {
    const contract = contracts[Math.floor(s() * contracts.length)]
    const clauseTypes = [...CLAUSE_CATEGORIES]
    const clauseType = clauseTypes[Math.floor(s() * clauseTypes.length)]
    const pStatuses = ["Paid", "Disputed", "Pending", "Waived", "In Appeal"]
    const status = pStatuses[Math.floor(s() * pStatuses.length)]
    return {
      id: `PNL-${String(i + 1).padStart(4, "0")}`,
      contractId: contract.id, supplier: contract.supplier, clauseType,
      date: `2026-${String(Math.floor(s() * 12) + 1).padStart(2, "0")}-${String(Math.floor(s() * 28) + 1).padStart(2, "0")}`,
      amount: Math.floor(s() * 3000000) + 50000,
      reason: `${["SLA breach - late delivery", "Quality non-compliance penalty", "Payment delay charges", "Insurance coverage gap penalty", "Safety regulation violation fine", "Environmental compliance breach", "Documentation non-compliance", "Service level failure charge"][Math.floor(s() * 8)]}`,
      status, disputeActive: status === "Disputed" || status === "In Appeal",
    }
  })

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyCompliance = months.map((month) => ({
    month,
    avgScore: Math.floor(s() * 15) + 75,
    penalties: Math.floor(s() * 8) + 1,
    audits: Math.floor(s() * 5) + 3,
    newContracts: Math.floor(s() * 4) + 1,
    expiringContracts: Math.floor(s() * 3),
  }))

  const dimCompliance = [...COMPLIANCE_DIMS].map((dim) => ({
    dimension: dim,
    current: Math.floor(s() * 25) + 70,
    target: Math.floor(s() * 10) + 85,
    industry: Math.floor(s() * 15) + 80,
  }))

  return {
    contracts, obligations, clauseReviews, auditRecords, penaltyRecords,
    monthlyCompliance, dimCompliance, months,
    SUPPLIERS, CONTRACT_TYPES, COMPLIANCE_DIMS, CLAUSE_CATEGORIES,
    RISK_LEVELS, COMPLIANCE_STATUSES, OBLIGATION_TYPES, RENEWAL_STATUSES, AUDIT_TYPES,
    WAREHOUSES,
  }
}

// ─── Helper Components ──────────────────────────────────────────────────────────────────
function FieldGrid({ fields }: { fields: { label: string; value: string }[] }) {
  return (
    <div className="cca-drawer-field-grid">
      {fields.map((f, i) => (
        <div key={i} className="cca-drawer-field">
          <span className="cca-drawer-field-label">{f.label}</span>
          <span className="cca-drawer-field-value">{f.value}</span>
        </div>
      ))}
    </div>
  )
}

function MetricsRow({ metrics }: { metrics: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="cca-drawer-metrics">
      {metrics.map((m, i) => (
        <div key={i} className="cca-drawer-metric-card" style={m.color ? { borderTopColor: m.color } : undefined}>
          <span className="cca-drawer-metric-label">{m.label}</span>
          <span className="cca-drawer-metric-value">{m.value}</span>
        </div>
      ))}
    </div>
  )
}

function ScoreRing({ score, size = 80, strokeWidth = 6 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const ringColor = score >= 80 ? COLORS.emerald : score >= 60 ? COLORS.amber : COLORS.rose
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={ringColor} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.22} fontWeight="700" fill={ringColor}>{score}%</text>
    </svg>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────────────
export default function ContractComplianceAutomationView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterContractType, setFilterContractType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRiskLevel, setFilterRiskLevel] = useState("all")
  const [filterObligationType, setFilterObligationType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterAuditType, setFilterAuditType] = useState("all")
  const [filterPenaltyStatus, setFilterPenaltyStatus] = useState("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<string>("")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortAsc, setSortAsc] = useState(true)

  // ─── KPI Computation ──────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const totalContracts = data.contracts.length
    const avgCompliance = Math.round(data.contracts.reduce((a, c) => a + c.complianceScore, 0) / totalContracts)
    const nonCompliant = data.contracts.filter((c) => c.status === "Non-Compliant").length
    const totalPenalties = data.penaltyRecords.reduce((a, p) => a + p.amount, 0)
    const expiringCount = data.contracts.filter((c) => {
      const end = new Date(c.endDate)
      const now = new Date("2026-07-28")
      return (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 90
    }).length
    const obligationsPending = data.obligations.filter((o) => o.status === "Pending" || o.status === "Overdue").length
    return [
      { label: "Total Contracts", value: totalContracts, color: COLORS.teal, icon: "📋" },
      { label: "Avg Compliance", value: `${avgCompliance}%`, color: COLORS.indigo, icon: "✅" },
      { label: "Non-Compliant", value: nonCompliant, color: COLORS.rose, icon: "⚠️" },
      { label: "Total Penalties", value: formatINR(totalPenalties), color: COLORS.amber, icon: "💰" },
      { label: "Expiring (90d)", value: expiringCount, color: COLORS.orange, icon: "⏰" },
      { label: "Obligations Pending", value: obligationsPending, color: COLORS.purple, icon: "📝" },
    ]
  }, [data])

  // ─── Derived Chart Data ───────────────────────────────────────────────────
  const statusDist = useMemo(() => {
    return [...COMPLIANCE_STATUSES].map((st) => ({
      name: st, value: data.contracts.filter((c) => c.status === st).length,
    }))
  }, [data])

  const contractTypeDist = useMemo(() => {
    return [...CONTRACT_TYPES].map((ct) => ({
      name: ct.length > 12 ? ct.substring(0, 12) + "…" : ct, fullName: ct,
      value: data.contracts.filter((c) => c.contractType === ct).length,
    }))
  }, [data])

  const riskDist = useMemo(() => {
    return [...RISK_LEVELS].map((r) => ({
      name: r, value: data.contracts.filter((c) => c.riskLevel === r).length,
      color: r === "Critical" ? COLORS.rose : r === "High" ? COLORS.amber : r === "Medium" ? COLORS.sky : COLORS.emerald,
    }))
  }, [data])

  const oblTypeDist = useMemo(() => {
    return [...OBLIGATION_TYPES].map((t) => ({ name: t, value: data.obligations.filter((o) => o.obligationType === t).length }))
  }, [data])

  const catDist = useMemo(() => {
    return [...CLAUSE_CATEGORIES].map((c) => ({ name: c, value: data.clauseReviews.filter((cl) => cl.category === c).length }))
  }, [data])

  const auditTypeDist = useMemo(() => {
    return [...AUDIT_TYPES].map((t) => ({ name: t.length > 14 ? t.substring(0, 14) + "..." : t, fullName: t, value: data.auditRecords.filter((a) => a.auditType === t).length }))
  }, [data])

  const penaltyStatusDist = useMemo(() => {
    const pStatuses = ["Paid", "Disputed", "Pending", "Waived", "In Appeal"]
    return pStatuses.map((st) => ({ name: st, value: data.penaltyRecords.filter((p) => p.status === st).length }))
  }, [data])

  // ─── Filter & Sort Logic ───────────────────────────────────────────────────
  const filteredContracts = useMemo(() => {
    let items = [...data.contracts]
    if (searchTerm) items = items.filter((c) => c.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterContractType !== "all") items = items.filter((c) => c.contractType === filterContractType)
    if (filterStatus !== "all") items = items.filter((c) => c.status === filterStatus)
    if (filterRiskLevel !== "all") items = items.filter((c) => c.riskLevel === filterRiskLevel)
    items.sort((a: any, b: any) => {
      const va = a[sortBy], vb = b[sortBy]
      if (typeof va === "number") return sortAsc ? va - vb : vb - va
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
    return items
  }, [data, searchTerm, filterContractType, filterStatus, filterRiskLevel, sortBy, sortAsc])

  const filteredObligations = useMemo(() => {
    let items = [...data.obligations]
    if (searchTerm) items = items.filter((o) => o.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterObligationType !== "all") items = items.filter((o) => o.obligationType === filterObligationType)
    items.sort((a: any, b: any) => {
      const va = a[sortBy], vb = b[sortBy]
      if (typeof va === "number") return sortAsc ? va - vb : vb - va
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
    return items
  }, [data, searchTerm, filterObligationType, sortBy, sortAsc])

  const filteredClauses = useMemo(() => {
    let items = [...data.clauseReviews]
    if (searchTerm) items = items.filter((c) => c.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterCategory !== "all") items = items.filter((c) => c.category === filterCategory)
    items.sort((a: any, b: any) => {
      const va = a[sortBy], vb = b[sortBy]
      if (typeof va === "number") return sortAsc ? va - vb : vb - va
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
    return items
  }, [data, searchTerm, filterCategory, sortBy, sortAsc])

  const filteredAudits = useMemo(() => {
    let items = [...data.auditRecords]
    if (searchTerm) items = items.filter((a) => a.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterAuditType !== "all") items = items.filter((a) => a.auditType === filterAuditType)
    items.sort((a: any, b: any) => {
      const va = a[sortBy], vb = b[sortBy]
      if (typeof va === "number") return sortAsc ? va - vb : vb - va
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
    return items
  }, [data, searchTerm, filterAuditType, sortBy, sortAsc])

  const filteredPenalties = useMemo(() => {
    let items = [...data.penaltyRecords]
    if (searchTerm) items = items.filter((p) => p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterPenaltyStatus !== "all") items = items.filter((p) => p.status === filterPenaltyStatus)
    items.sort((a: any, b: any) => {
      const va = a[sortBy], vb = b[sortBy]
      if (typeof va === "number") return sortAsc ? va - vb : vb - va
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
    return items
  }, [data, searchTerm, filterPenaltyStatus, sortBy, sortAsc])

  // ─── Drawer Handlers ──────────────────────────────────────────────────────
  const openContractDrawer = (contract: Contract) => { setDrawerData(contract); setDrawerType("contract"); setDrawerOpen(true) }
  const openObligationDrawer = (obl: Obligation) => { setDrawerData(obl); setDrawerType("obligation"); setDrawerOpen(true) }
  const openClauseDrawer = (clause: ClauseReview) => { setDrawerData(clause); setDrawerType("clause"); setDrawerOpen(true) }
  const openAuditDrawer = (audit: AuditRecord) => { setDrawerData(audit); setDrawerType("audit"); setDrawerOpen(true) }
  const openPenaltyDrawer = (penalty: PenaltyRecord) => { setDrawerData(penalty); setDrawerType("penalty"); setDrawerOpen(true) }

  const handleSort = (field: any) => {
    if (sortBy === field) setSortAsc(!sortAsc)
    else { setSortBy(field); setSortAsc(true) }
  }

  // ─── Drawer Renderers ──────────────────────────────────────────────────────
  const renderDrawer = () => {
    if (!drawerData) return null
    if (drawerType === "contract") {
      const c = drawerData as Contract
      return (
        <>
          <div className="cca-drawer-header">
            <div className="cca-drawer-header-left">
              <ScoreRing score={c.complianceScore} />
              <div>
                <h3 className="cca-drawer-title">{c.id}</h3>
                <p className="cca-drawer-subtitle">{c.supplier}</p>
                <div className="cca-drawer-badges">
                  <span className={cn("cca-badge-risk", `cca-risk-${c.riskLevel.toLowerCase()}`)}>{c.riskLevel}</span>
                  <span className={cn("cca-badge-status", `cca-status-${c.status.toLowerCase().replace(/\s+/g, "-")}`)}>{c.status}</span>
                </div>
              </div>
            </div>
          </div>
          <MetricsRow metrics={[
            { label: "Contract Value", value: formatINR(c.value), color: COLORS.teal },
            { label: "Clauses", value: `${c.totalClauses} total`, color: COLORS.indigo },
            { label: "Renewal", value: c.renewalStatus, color: COLORS.amber },
          ]} />
          <FieldGrid fields={[
            { label: "Contract Type", value: c.contractType },
            { label: "Start Date", value: c.startDate },
            { label: "End Date", value: c.endDate },
            { label: "Compliant Clauses", value: String(c.compliantClauses) },
            { label: "Non-Compliant", value: String(c.nonCompliantClauses) },
            { label: "Warehouse", value: c.warehouse },
          ]} />
          <div className="cca-drawer-actions">
            <button className="cca-btn-primary">Review Contract</button>
            <button className="cca-btn-secondary">Export PDF</button>
            <button className="cca-btn-ghost">Renew</button>
          </div>
        </>
      )
    }
    if (drawerType === "obligation") {
      const o = drawerData as Obligation
      return (
        <>
          <div className="cca-drawer-header">
            <div className="cca-drawer-header-left">
              <ScoreRing score={o.compliancePct} />
              <div>
                <h3 className="cca-drawer-title">{o.id}</h3>
                <p className="cca-drawer-subtitle">{o.supplier}</p>
                <div className="cca-drawer-badges">
                  <span className="cca-badge-obl-type">{o.obligationType}</span>
                  <span className={cn("cca-badge-status", `cca-status-${o.status.toLowerCase().replace(/\s+/g, "-")}`)}>{o.status}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="cca-drawer-desc">{o.description}</div>
          <MetricsRow metrics={[
            { label: "Value", value: formatINR(o.value), color: COLORS.teal },
            { label: "Penalty Amount", value: formatINR(o.penaltyAmount), color: COLORS.rose },
            { label: "Due Date", value: o.dueDate, color: COLORS.amber },
          ]} />
          <FieldGrid fields={[
            { label: "Contract ID", value: o.contractId },
            { label: "Obligation Type", value: o.obligationType },
            { label: "Compliance %", value: `${o.compliancePct}%` },
            { label: "Status", value: o.status },
            { label: "Due Date", value: o.dueDate },
            { label: "Penalty", value: formatINR(o.penaltyAmount) },
          ]} />
          <div className="cca-drawer-actions">
            <button className="cca-btn-primary">Mark Fulfilled</button>
            <button className="cca-btn-secondary">Escalate</button>
            <button className="cca-btn-ghost">View Contract</button>
          </div>
        </>
      )
    }
    if (drawerType === "clause") {
      const cl = drawerData as ClauseReview
      return (
        <>
          <div className="cca-drawer-header">
            <div className="cca-drawer-header-left">
              <div className="cca-drawer-clause-icon">📜</div>
              <div>
                <h3 className="cca-drawer-title">{cl.id}</h3>
                <p className="cca-drawer-subtitle">{cl.supplier} - {cl.category}</p>
                <div className="cca-drawer-badges">
                  <span className={cn("cca-badge-risk", `cca-risk-${cl.riskLevel.toLowerCase()}`)}>{cl.riskLevel}</span>
                  <span className={cn("cca-badge-status", `cca-status-${cl.complianceStatus.toLowerCase().replace(/\s+/g, "-")}`)}>{cl.complianceStatus}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="cca-drawer-desc">{cl.clauseText}</div>
          <MetricsRow metrics={[
            { label: "Financial Impact", value: formatINR(cl.financialImpact), color: COLORS.rose },
            { label: "Last Review", value: cl.lastReview, color: COLORS.indigo },
            { label: "Next Review", value: cl.nextReview, color: COLORS.teal },
          ]} />
          <FieldGrid fields={[
            { label: "Contract ID", value: cl.contractId },
            { label: "Category", value: cl.category },
            { label: "Compliance Status", value: cl.complianceStatus },
            { label: "Risk Level", value: cl.riskLevel },
            { label: "Action Required", value: cl.actionRequired },
          ]} />
          <div className="cca-drawer-actions">
            <button className="cca-btn-primary">Update Status</button>
            <button className="cca-btn-secondary">Amend Clause</button>
            <button className="cca-btn-ghost">View History</button>
          </div>
        </>
      )
    }
    if (drawerType === "audit") {
      const a = drawerData as AuditRecord
      return (
        <>
          <div className="cca-drawer-header">
            <div className="cca-drawer-header-left">
              <ScoreRing score={a.overallScore} />
              <div>
                <h3 className="cca-drawer-title">{a.id}</h3>
                <p className="cca-drawer-subtitle">{a.supplier} - {a.auditType}</p>
                <div className="cca-drawer-badges">
                  <span className="cca-badge-audit-type">{a.auditType}</span>
                  <span className={cn("cca-badge-status", `cca-status-${a.status.toLowerCase().replace(/\s+/g, "-")}`)}>{a.status}</span>
                </div>
              </div>
            </div>
          </div>
          <MetricsRow metrics={[
            { label: "Overall Score", value: `${a.overallScore}%`, color: COLORS.emerald },
            { label: "Findings", value: String(a.findings), color: COLORS.amber },
            { label: "Critical", value: String(a.criticalFindings), color: COLORS.rose },
          ]} />
          <div className="cca-drawer-score-grid">
            <div className="cca-drawer-score-item" style={{ borderTopColor: COLORS.teal }}>
              <span className="cca-drawer-score-label">Total Findings</span>
              <span className="cca-drawer-score-value">{a.findings}</span>
            </div>
            <div className="cca-drawer-score-item" style={{ borderTopColor: COLORS.rose }}>
              <span className="cca-drawer-score-label">Critical</span>
              <span className="cca-drawer-score-value">{a.criticalFindings}</span>
            </div>
            <div className="cca-drawer-score-item" style={{ borderTopColor: COLORS.emerald }}>
              <span className="cca-drawer-score-label">Resolved</span>
              <span className="cca-drawer-score-value">{a.resolved}</span>
            </div>
            <div className="cca-drawer-score-item" style={{ borderTopColor: COLORS.indigo }}>
              <span className="cca-drawer-score-label">Open</span>
              <span className="cca-drawer-score-value">{a.findings - a.resolved}</span>
            </div>
          </div>
          <FieldGrid fields={[
            { label: "Contract ID", value: a.contractId },
            { label: "Auditor", value: a.auditor },
            { label: "Audit Date", value: a.auditDate },
            { label: "Status", value: a.status },
          ]} />
          <div className="cca-drawer-actions">
            <button className="cca-btn-primary">View Report</button>
            <button className="cca-btn-secondary">Schedule Follow-up</button>
            <button className="cca-btn-ghost">Export</button>
          </div>
        </>
      )
    }
    if (drawerType === "penalty") {
      const p = drawerData as PenaltyRecord
      return (
        <>
          <div className="cca-drawer-header">
            <div className="cca-drawer-header-left">
              <div className="cca-drawer-penalty-icon">💰</div>
              <div>
                <h3 className="cca-drawer-title">{p.id}</h3>
                <p className="cca-drawer-subtitle">{p.supplier}</p>
                <div className="cca-drawer-badges">
                  <span className="cca-badge-clause-type">{p.clauseType}</span>
                  <span className={cn("cca-badge-status", `cca-status-${p.status.toLowerCase()}`)}>{p.status}</span>
                  {p.disputeActive && <span className="cca-badge-dispute">Dispute Active</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="cca-drawer-desc">{p.reason}</div>
          <MetricsRow metrics={[
            { label: "Penalty Amount", value: formatINR(p.amount), color: COLORS.rose },
            { label: "Date", value: p.date, color: COLORS.indigo },
            { label: "Dispute", value: p.disputeActive ? "Active" : "None", color: COLORS.amber },
          ]} />
          <FieldGrid fields={[
            { label: "Contract ID", value: p.contractId },
            { label: "Clause Type", value: p.clauseType },
            { label: "Amount", value: formatINR(p.amount) },
            { label: "Status", value: p.status },
            { label: "Dispute Active", value: p.disputeActive ? "Yes" : "No" },
          ]} />
          <div className="cca-drawer-actions">
            <button className="cca-btn-primary">Pay Now</button>
            <button className="cca-btn-secondary">Dispute</button>
            <button className="cca-btn-ghost">View Contract</button>
          </div>
        </>
      )
    }
    return null
  }

  // ─── Tab Definitions ──────────────────────────────────────────────────────
  const tabs = [
    // Tab 0: Dashboard
    {
      title: "Dashboard",
      content: (
        <div className="cca-tab-dashboard">
          {/* KPI Cards */}
          <div className="cca-kpi-grid">
            {kpis.map((kpi, i) => (
              <div key={i} className="cca-kpi-card" style={{ borderTopColor: kpi.color }}>
                <span className="cca-kpi-icon">{kpi.icon}</span>
                <span className="cca-kpi-label">{kpi.label}</span>
                <span className="cca-kpi-value">{kpi.value}</span>
              </div>
            ))}
          </div>
          {/* Charts Grid */}
          <div className="cca-chart-grid">
            {/* Chart 1: Monthly Compliance Trend - AreaChart */}
            <div className="cca-chart-card cca-chart-wide">
              <h4 className="cca-chart-title">Monthly Compliance Trend</h4>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.monthlyCompliance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Legend />
                  <Area type="monotone" dataKey="avgScore" name="Avg Score (%)" fill="#0d948833" stroke={COLORS.teal} strokeWidth={2} />
                  <Area type="monotone" dataKey="penalties" name="Penalties" fill="#e11d4833" stroke={COLORS.rose} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Chart 2: Compliance Status - PieChart Donut */}
            <div className="cca-chart-card">
              <h4 className="cca-chart-title">Compliance Status</h4>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusDist.map((_entry, idx) => <Cell key={idx} fill={CCA_COLORS[idx % CCA_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Chart 3: Risk Level Distribution - Horizontal BarChart */}
            <div className="cca-chart-card">
              <h4 className="cca-chart-title">Risk Level Distribution</h4>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={riskDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#94a3b8" width={80} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="value" name="Contracts" radius={[0, 4, 4, 0]}>
                    {riskDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Chart 4: Contract Types - Vertical BarChart */}
            <div className="cca-chart-card">
              <h4 className="cca-chart-title">Contract Types</h4>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={contractTypeDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-25} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="value" name="Contracts" radius={[4, 4, 0, 0]}>
                    {contractTypeDist.map((_entry, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Chart 5: Compliance Dimension Radar - 8 dims, current vs target */}
            <div className="cca-chart-card">
              <h4 className="cca-chart-title">Compliance Dimension Radar</h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data.dimCompliance}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Radar name="Current" dataKey="current" stroke={COLORS.teal} fill="#0d948833" strokeWidth={2} />
                  <Radar name="Target" dataKey="target" stroke={COLORS.indigo} fill="#6366f133" strokeWidth={2} />
                  <Radar name="Industry" dataKey="industry" stroke={COLORS.amber} fill="#d9770633" strokeWidth={2} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {/* Chart 6: Penalty Trend - LineChart */}
            <div className="cca-chart-card">
              <h4 className="cca-chart-title">Penalty Trend</h4>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.monthlyCompliance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Legend />
                  <Line type="monotone" dataKey="penalties" name="Penalties" stroke={COLORS.rose} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ),
    },
    // Tab 1: Contracts
    {
      title: "Contracts",
      content: (
        <div className="cca-tab-table-view">
          <div className="cca-filters">
            <input className="cca-search" placeholder="Search contracts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="cca-select" value={filterContractType} onChange={(e) => setFilterContractType(e.target.value)}>
              <option value="all">All Types</option>
              {data.CONTRACT_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
            </select>
            <select className="cca-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              {data.COMPLIANCE_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
            <select className="cca-select" value={filterRiskLevel} onChange={(e) => setFilterRiskLevel(e.target.value)}>
              <option value="all">All Risk</option>
              {data.RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="cca-table-wrapper">
            <table className="cca-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>ID</th>
                  <th onClick={() => handleSort("supplier")}>Supplier</th>
                  <th onClick={() => handleSort("contractType")}>Type</th>
                  <th onClick={() => handleSort("value")}>Value</th>
                  <th onClick={() => handleSort("complianceScore")}>Score</th>
                  <th onClick={() => handleSort("status")}>Status</th>
                  <th onClick={() => handleSort("riskLevel")}>Risk</th>
                  <th onClick={() => handleSort("renewalStatus")}>Renewal</th>
                  <th onClick={() => handleSort("endDate")}>End Date</th>
                  <th onClick={() => handleSort("totalClauses")}>Clauses</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((c) => (
                  <tr key={c.id} onClick={() => openContractDrawer(c)}>
                    <td className="cca-cell-mono">{c.id}</td>
                    <td>{c.supplier}</td>
                    <td>{c.contractType}</td>
                    <td className="cca-cell-mono">{formatINR(c.value)}</td>
                    <td><ScoreRing score={c.complianceScore} size={44} strokeWidth={4} /></td>
                    <td><span className={cn("cca-badge-status", `cca-status-${c.status.toLowerCase().replace(/\s+/g, "-")}`)}>{c.status}</span></td>
                    <td><span className={cn("cca-badge-risk", `cca-risk-${c.riskLevel.toLowerCase()}`)}>{c.riskLevel}</span></td>
                    <td>{c.renewalStatus}</td>
                    <td className="cca-cell-mono">{c.endDate}</td>
                    <td className="cca-cell-center">{c.compliantClauses}/{c.totalClauses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Tab 2: Obligations
    {
      title: "Obligations",
      content: (
        <div className="cca-tab-table-view">
          <div className="cca-filters">
            <input className="cca-search" placeholder="Search obligations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="cca-select" value={filterObligationType} onChange={(e) => setFilterObligationType(e.target.value)}>
              <option value="all">All Types</option>
              {data.OBLIGATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="cca-table-wrapper">
            <table className="cca-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>ID</th>
                  <th onClick={() => handleSort("supplier")}>Supplier</th>
                  <th onClick={() => handleSort("obligationType")}>Type</th>
                  <th>Description</th>
                  <th onClick={() => handleSort("dueDate")}>Due Date</th>
                  <th onClick={() => handleSort("status")}>Status</th>
                  <th onClick={() => handleSort("compliancePct")}>Compliance</th>
                  <th onClick={() => handleSort("value")}>Value</th>
                  <th onClick={() => handleSort("penaltyAmount")}>Penalty</th>
                </tr>
              </thead>
              <tbody>
                {filteredObligations.map((o) => (
                  <tr key={o.id} onClick={() => openObligationDrawer(o)}>
                    <td className="cca-cell-mono">{o.id}</td>
                    <td>{o.supplier}</td>
                    <td><span className="cca-badge-obl-type">{o.obligationType}</span></td>
                    <td className="cca-cell-truncate" title={o.description}>
                      {o.description.length > 40 ? o.description.substring(0, 40) + "…" : o.description}
                    </td>
                    <td className="cca-cell-mono">{o.dueDate}</td>
                    <td><span className={cn("cca-badge-status", `cca-status-${o.status.toLowerCase().replace(/\s+/g, "-")}`)}>{o.status}</span></td>
                    <td>
                      <div className="cca-compliance-bar-wrap">
                        <div className="cca-compliance-bar" style={{ width: `${o.compliancePct}%`, backgroundColor: o.compliancePct >= 80 ? COLORS.emerald : o.compliancePct >= 60 ? COLORS.amber : COLORS.rose }} />
                        <span className="cca-compliance-bar-label">{o.compliancePct}%</span>
                      </div>
                    </td>
                    <td className="cca-cell-mono">{formatINR(o.value)}</td>
                    <td className="cca-cell-mono">{formatINR(o.penaltyAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Tab 3: Clause Review
    {
      title: "Clause Review",
      content: (
        <div className="cca-tab-section">
          <div className="cca-filters">
            <input className="cca-search" placeholder="Search by supplier or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="cca-filter" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {[...CLAUSE_CATEGORIES].map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="cca-table-wrap">
            <table className="cca-table">
              <thead>
                <tr>
                  <th className="cca-clickable" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortAsc ? "↑" : "↓")}</th>
                  <th className="cca-clickable" onClick={() => handleSort("supplier")}>Supplier {sortBy === "supplier" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Category</th>
                  <th>Clause</th>
                  <th>Status</th>
                  <th>Risk</th>
                  <th className="cca-clickable" onClick={() => handleSort("lastReview")}>Last Review {sortBy === "lastReview" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Next Review</th>
                  <th className="cca-clickable" onClick={() => handleSort("financialImpact")}>Impact {sortBy === "financialImpact" && (sortAsc ? "↑" : "↓")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredClauses.slice(0, 40).map((cl) => (
                  <tr key={cl.id} className="cca-row" onClick={() => openClauseDrawer(cl)}>
                    <td className="cca-cell-id">{cl.id}</td>
                    <td>{cl.supplier}</td>
                    <td><span className="cca-badge-category">{cl.category}</span></td>
                    <td className="cca-cell-truncate">{cl.clauseText.substring(0, 50)}...</td>
                    <td><span className={`cca-badge-status cca-status-${cl.complianceStatus.toLowerCase().replace(/\s+/g, "-")}`}>{cl.complianceStatus}</span></td>
                    <td><span className={`cca-badge-risk cca-risk-${cl.riskLevel.toLowerCase()}`}>{cl.riskLevel}</span></td>
                    <td>{cl.lastReview}</td>
                    <td>{cl.nextReview}</td>
                    <td className="cca-cell-mono">{formatINR(cl.financialImpact)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Tab 4: Audit Trail
    {
      title: "Audit Trail",
      content: (
        <div className="cca-tab-section">
          <div className="cca-filters">
            <input className="cca-search" placeholder="Search by supplier or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="cca-filter" value={filterAuditType} onChange={(e) => setFilterAuditType(e.target.value)}>
              <option value="all">All Types</option>
              {[...AUDIT_TYPES].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="cca-table-wrap">
            <table className="cca-table">
              <thead>
                <tr>
                  <th className="cca-clickable" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortAsc ? "↑" : "↓")}</th>
                  <th className="cca-clickable" onClick={() => handleSort("supplier")}>Supplier {sortBy === "supplier" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Type</th>
                  <th className="cca-clickable" onClick={() => handleSort("auditDate")}>Date {sortBy === "auditDate" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Auditor</th>
                  <th>Score</th>
                  <th className="cca-clickable" onClick={() => handleSort("findings")}>Findings {sortBy === "findings" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Critical</th>
                  <th>Resolved</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudits.slice(0, 40).map((a) => (
                  <tr key={a.id} className="cca-row" onClick={() => openAuditDrawer(a)}>
                    <td className="cca-cell-id">{a.id}</td>
                    <td>{a.supplier}</td>
                    <td><span className="cca-badge-audit-type">{a.auditType}</span></td>
                    <td>{a.auditDate}</td>
                    <td>{a.auditor}</td>
                    <td>
                      <div className="cca-score-ring-mini">
                        <ScoreRing score={a.overallScore} size={40} strokeWidth={4} />
                      </div>
                    </td>
                    <td className="cca-cell-mono">{a.findings}</td>
                    <td className="cca-cell-mono cca-text-rose">{a.criticalFindings}</td>
                    <td className="cca-cell-mono cca-text-emerald">{a.resolved}</td>
                    <td><span className={`cca-badge-status cca-status-${a.status.toLowerCase().replace(/\s+/g, "-")}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Tab 5: Penalties & Disputes
    {
      title: "Penalties",
      content: (
        <div className="cca-tab-section">
          <div className="cca-filters">
            <input className="cca-search" placeholder="Search by supplier or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="cca-filter" value={filterPenaltyStatus} onChange={(e) => setFilterPenaltyStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              {["Paid", "Disputed", "Pending", "Waived", "In Appeal"].map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div className="cca-table-wrap">
            <table className="cca-table">
              <thead>
                <tr>
                  <th className="cca-clickable" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortAsc ? "↑" : "↓")}</th>
                  <th className="cca-clickable" onClick={() => handleSort("supplier")}>Supplier {sortBy === "supplier" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Clause Type</th>
                  <th className="cca-clickable" onClick={() => handleSort("date")}>Date {sortBy === "date" && (sortAsc ? "↑" : "↓")}</th>
                  <th className="cca-clickable" onClick={() => handleSort("amount")}>Amount {sortBy === "amount" && (sortAsc ? "↑" : "↓")}</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Dispute</th>
                </tr>
              </thead>
              <tbody>
                {filteredPenalties.slice(0, 40).map((p) => (
                  <tr key={p.id} className="cca-row" onClick={() => openPenaltyDrawer(p)}>
                    <td className="cca-cell-id">{p.id}</td>
                    <td>{p.supplier}</td>
                    <td><span className="cca-badge-clause-type">{p.clauseType}</span></td>
                    <td>{p.date}</td>
                    <td className="cca-cell-mono">{formatINR(p.amount)}</td>
                    <td className="cca-cell-truncate">{p.reason.substring(0, 40)}...</td>
                    <td><span className={`cca-badge-status cca-status-${p.status.toLowerCase().replace(/\s+/g, "-")}`}>{p.status}</span></td>
                    <td>{p.disputeActive ? <span className="cca-badge-dispute">Active</span> : <span className="cca-badge-no-dispute">None</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="cca-root">
      <PageHeader
        title="Contract Compliance Automation"
        description="Monitor contract compliance, obligations, audits, and penalties across all warehouses"
      />
      <div className="cca-tabs">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={cn("cca-tab-btn", activeTab === idx && "cca-tab-btn-active")}
            onClick={() => setActiveTab(idx)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="cca-tab-content">
        {tabs[activeTab].content}
      </div>
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="cca-sheet" side="right">
          <div className="cca-sheet-body">
            {renderDrawer()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
