"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldX,
  Activity,
  Target,
  Zap,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  BarChart3,
  PieChart as PieChartIcon,
  Brain,
  FileWarning,
  Ban,
  Users,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Factory,
  Truck,
  Package,
  Layers,
  GitBranch,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
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

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const SUPPLIERS = [
  "Tata Steel Ltd", "Reliance Industries", "Mahindra Logistics", "TVS Supply Chain",
  "Dalmia Bharat Cement", "UPL Ltd", "Godrej Consumer Products", "JSW Steel",
  "Adani Ports & SEZ", "Ashok Leyland", "Bajaj Auto Ltd", "Hero Motocorp",
  "Dr Reddys Labs", "Sun Pharma", "Britannia Industries", "ITC Ltd",
  "Hindustan Unilever", "Maruti Suzuki", "Bharat Forge", "Larsen & Toubro",
] as const

const WAREHOUSES = [
  "Mumbai DC", "Delhi NCR Hub", "Bengaluru WH", "Chennai Port", "Kolkata Distribution",
  "Hyderabad Fulfillment", "Pune Warehouse", "Ahmedabad Hub",
] as const

const RISK_CATEGORIES = [
  "Financial Risk", "Operational Risk", "Quality Risk", "Compliance Risk",
  "Supply Chain Risk", "Geopolitical Risk", "Cybersecurity Risk", "Reputational Risk",
] as const

const RISK_LEVELS = ["Critical", "High", "Medium", "Low"] as const

const MITIGATION_STATUSES = ["Not Started", "In Progress", "Implemented", "Monitoring", "Completed"] as const

const CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const

const COLORS = {
  teal: "#0d9488",
  indigo: "#6366f1",
  rose: "#e11d48",
  amber: "#f59e0b",
  emerald: "#059669",
  sky: "#0ea5e9",
  violet: "#8b5cf6",
  orange: "#f97316",
  pink: "#ec4899",
  lime: "#84cc16",
}

const RISK_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#f97316",
  Medium: "#f59e0b",
  Low: "#22c55e",
}

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "#94a3b8",
  "In Progress": "#f59e0b",
  Implemented: "#6366f1",
  Monitoring: "#0ea5e9",
  Completed: "#22c55e",
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Financial Risk": <DollarSign className="h-4 w-4" />,
  "Operational Risk": <Activity className="h-4 w-4" />,
  "Quality Risk": <ShieldCheck className="h-4 w-4" />,
  "Compliance Risk": <FileWarning className="h-4 w-4" />,
  "Supply Chain Risk": <Truck className="h-4 w-4" />,
  "Geopolitical Risk": <Globe className="h-4 w-4" />,
  "Cybersecurity Risk": <ShieldX className="h-4 w-4" />,
  "Reputational Risk": <Users className="h-4 w-4" />,
}

// ─── Types ───────────────────────────────────────────────────────────────
interface RiskRegisterItem {
  id: string
  supplier: string
  category: string
  riskLevel: string
  riskScore: number
  probability: number
  impact: number
  description: string
  detectedDate: string
  lastAssessed: string
  exposure: number
  trend: string
  warehouse: string
  slaStatus: string
}

interface RiskAssessment {
  id: string
  supplier: string
  warehouse: string
  category: string
  overallScore: number
  financialScore: number
  operationalScore: number
  qualityScore: number
  complianceScore: number
  supplyChainScore: number
  assessedBy: string
  assessmentDate: string
  nextReview: string
  priority: string
  status: string
}

interface MitigationPlan {
  id: string
  supplier: string
  riskId: string
  riskCategory: string
  planName: string
  description: string
  status: string
  priority: string
  owner: string
  startDate: string
  targetDate: string
  completionPct: number
  budgetAllocated: number
  budgetSpent: number
  residualRisk: number
}

interface WatchlistItem {
  id: string
  supplier: string
  watchReason: string
  severity: string
  triggerEvent: string
  lastIncident: string
  incidentCount: number
  financialExposure: number
  actionRequired: string
  monitoringFrequency: string
  escalationLevel: number
  warehouse: string
}

interface RiskAnalytics {
  id: string
  month: string
  totalRisks: number
  criticalRisks: number
  highRisks: number
  mitigatedRisks: number
  newRisks: number
  avgRiskScore: number
  financialExposure: number
  complianceBreachCount: number
  supplierLosses: number
}

// ─── Data Generation ──────────────────────────────────────────────────────
function generateData() {
  const months = ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"]

  const descriptions: string[] = [
    "Payment delays exceeding 45 days on multiple invoices",
    "Quality rejection rate above 5% threshold",
    "Single-source dependency for critical raw materials",
    "Non-compliance with revised GST filing requirements",
    "Operational disruptions due to workforce shortages",
    "Supply chain lead time increased by 30%",
    "Geopolitical instability affecting import routes",
    "Cybersecurity vulnerability in EDI integration",
    "Reputational risk from environmental non-compliance",
    "Financial instability indicated by credit rating downgrade",
    "Regulatory compliance gap in hazardous materials handling",
    "Quality audit failure — process deviation noted",
    "Transportation route disruption due to infrastructure delays",
    "Currency fluctuation exposure on USD-denominated contracts",
    "Supplier warehouse fire — capacity reduction of 40%",
    "Late delivery pattern — 3 consecutive months below SLA",
    "Documentation non-compliance for customs clearance",
    "Price escalation beyond contracted caps",
    "Loss of key supplier personnel affecting continuity",
    "Inadequate insurance coverage for goods in transit",
  ]

  const watchReasons: string[] = [
    "Credit rating downgraded to BBB-",
    "Quality rejection rate exceeded threshold",
    "Multiple SLA breaches in last 30 days",
    "Key personnel departure",
    "Regulatory action initiated",
    "Financial losses reported in Q4",
    "Supply chain disruption identified",
    "Geopolitical risk escalated in region",
    "Cybersecurity incident reported",
    "Environmental compliance violation",
  ]

  const triggerEvents: string[] = [
    "Failed quality audit", "Payment default", "Regulatory notice", "Delivery failure",
    "Credit rating change", "Workforce strike", "Natural disaster impact", "IT system breach",
    "Key customer loss", "Material shortage",
  ]

  const actionsRequired: string[] = [
    "Immediate audit required", "Alternative supplier sourced",
    "Escalate to procurement head", "Invoke force majeure clause",
    "Conduct financial due diligence", "Review contract terms",
    "Activate backup supply plan", "Monitor weekly",
  ]

  const freqOptions: string[] = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly"]

  const planNames: string[] = [
    "Dual Sourcing Strategy", "Quality Improvement Program", "Financial Hedging Plan",
    "Compliance Remediation", "Inventory Buffer Buildup", "Alternative Route Planning",
    "Cybersecurity Hardening", "Insurance Coverage Enhancement", "Contract Renegotiation",
    "Supplier Development Program", "Contingency Stock Planning", "Diversification Strategy",
  ]

  const owners: string[] = [
    "Priya Sharma", "Rahul Mehta", "Anita Desai", "Vikram Singh",
    "Sneha Patel", "Rajesh Kumar", "Neha Gupta", "Arun Verma",
  ]

  // Risk Register — 85 items
  const riskRegister: RiskRegisterItem[] = Array.from({ length: 85 }, (_, i) => {
    const seed = i + 1001
    const s = seededRandom
    const supplier = SUPPLIERS[Math.floor(s(seed) * SUPPLIERS.length)]
    const category = RISK_CATEGORIES[Math.floor(s(seed + 1) * RISK_CATEGORIES.length)]
    const riskLevel = RISK_LEVELS[Math.floor(s(seed + 2) * RISK_LEVELS.length)]
    const probability = Math.floor(s(seed + 3) * 80) + 20
    const impact = Math.floor(s(seed + 4) * 80) + 20
    const riskScore = Math.round(probability * impact / 100)
    const monthIdx = Math.floor(s(seed + 5) * 12)
    const day = Math.floor(s(seed + 6) * 28) + 1
    const day2 = Math.floor(s(seed + 7) * 28) + 1
    const trendOptions = ["increasing", "stable", "decreasing"]
    const trend = trendOptions[Math.floor(s(seed + 8) * 3)]
    const exposure = Math.floor(s(seed + 9) * 500) + 10
    const warehouse = WAREHOUSES[Math.floor(s(seed + 10) * WAREHOUSES.length)]
    const slaStatuses = ["Compliant", "At Risk", "Breached"]
    const slaStatus = slaStatuses[Math.floor(s(seed + 11) * 3)]
    return {
      id: `RR-${String(i + 1).padStart(3, "0")}`,
      supplier,
      category,
      riskLevel,
      riskScore,
      probability,
      impact,
      description: descriptions[i % descriptions.length],
      detectedDate: `2025-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      lastAssessed: `2025-${String(Math.min(monthIdx + 2, 12)).padStart(2, "0")}-${String(day2).padStart(2, "0")}`,
      exposure,
      trend,
      warehouse,
      slaStatus,
    }
  })

  // Risk Assessments — 60
  const riskAssessments: RiskAssessment[] = Array.from({ length: 60 }, (_, i) => {
    const seed = i + 2001
    const s = seededRandom
    const supplier = SUPPLIERS[Math.floor(s(seed) * SUPPLIERS.length)]
    const warehouse = WAREHOUSES[Math.floor(s(seed + 1) * WAREHOUSES.length)]
    const category = RISK_CATEGORIES[Math.floor(s(seed + 2) * RISK_CATEGORIES.length)]
    const finScore = Math.floor(s(seed + 3) * 40) + 60
    const opScore = Math.floor(s(seed + 4) * 40) + 60
    const qualScore = Math.floor(s(seed + 5) * 40) + 60
    const compScore = Math.floor(s(seed + 6) * 40) + 60
    const scScore = Math.floor(s(seed + 7) * 40) + 60
    const overallScore = Math.round((finScore + opScore + qualScore + compScore + scScore) / 5)
    const monthIdx = Math.floor(s(seed + 8) * 12)
    const day = Math.floor(s(seed + 9) * 28) + 1
    const owner = owners[Math.floor(s(seed + 10) * owners.length)]
    const priorities = ["Critical", "High", "Medium", "Low"]
    const priority = priorities[Math.floor(s(seed + 11) * 4)]
    const statuses = ["Pending Review", "In Progress", "Completed", "Scheduled"]
    const status = statuses[Math.floor(s(seed + 12) * 4)]
    return {
      id: `RA-${String(i + 1).padStart(3, "0")}`,
      supplier,
      warehouse,
      category,
      overallScore,
      financialScore: finScore,
      operationalScore: opScore,
      qualityScore: qualScore,
      complianceScore: compScore,
      supplyChainScore: scScore,
      assessedBy: owner,
      assessmentDate: `2025-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      nextReview: `2025-${String(Math.min(monthIdx + 3, 12)).padStart(2, "0")}-${String(Math.floor(s(seed + 13) * 28) + 1).padStart(2, "0")}`,
      priority,
      status,
    }
  })

  // Mitigation Plans — 55
  const mitigationPlans: MitigationPlan[] = Array.from({ length: 55 }, (_, i) => {
    const seed = i + 3001
    const s = seededRandom
    const supplier = SUPPLIERS[Math.floor(s(seed) * SUPPLIERS.length)]
    const category = RISK_CATEGORIES[Math.floor(s(seed + 1) * RISK_CATEGORIES.length)]
    const status = MITIGATION_STATUSES[Math.floor(s(seed + 2) * MITIGATION_STATUSES.length)]
    const priorities = ["Critical", "High", "Medium", "Low"]
    const priority = priorities[Math.floor(s(seed + 3) * 4)]
    const owner = owners[Math.floor(s(seed + 4) * owners.length)]
    const planName = planNames[i % planNames.length]
    const monthIdx = Math.floor(s(seed + 5) * 10)
    const day = Math.floor(s(seed + 6) * 28) + 1
    const completionPct = status === "Completed" ? 100 : status === "Implemented" ? Math.floor(s(seed + 7) * 30) + 70 : status === "In Progress" ? Math.floor(s(seed + 7) * 60) + 20 : status === "Monitoring" ? Math.floor(s(seed + 7) * 20) + 80 : 0
    const budgetAllocated = Math.floor(s(seed + 8) * 95 + 5) * 100000
    const budgetSpent = Math.floor(budgetAllocated * (completionPct / 100) * (0.7 + s(seed + 9) * 0.5))
    const residualRisk = Math.max(5, Math.floor(s(seed + 10) * 50))
    return {
      id: `MP-${String(i + 1).padStart(3, "0")}`,
      supplier,
      riskId: `RR-${String(Math.floor(s(seed + 11) * 85) + 1).padStart(3, "0")}`,
      riskCategory: category,
      planName,
      description: `Comprehensive ${planName.toLowerCase()} for ${supplier} to address ${category.toLowerCase()} exposure and reduce risk profile`,
      status,
      priority,
      owner,
      startDate: `2025-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      targetDate: `2025-${String(Math.min(monthIdx + 3, 12)).padStart(2, "0")}-${String(Math.floor(s(seed + 12) * 28) + 1).padStart(2, "0")}`,
      completionPct,
      budgetAllocated,
      budgetSpent,
      residualRisk,
    }
  })

  // Watchlist — 35
  const watchlist: WatchlistItem[] = Array.from({ length: 35 }, (_, i) => {
    const seed = i + 4001
    const s = seededRandom
    const supplier = SUPPLIERS[Math.floor(s(seed) * SUPPLIERS.length)]
    const severities = ["Critical", "High", "Medium"]
    const severity = severities[Math.floor(s(seed + 1) * 3)]
    const monthIdx = Math.floor(s(seed + 2) * 12)
    const day = Math.floor(s(seed + 3) * 28) + 1
    return {
      id: `WL-${String(i + 1).padStart(3, "0")}`,
      supplier,
      watchReason: watchReasons[i % watchReasons.length],
      severity,
      triggerEvent: triggerEvents[i % triggerEvents.length],
      lastIncident: `2025-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      incidentCount: Math.floor(s(seed + 4) * 12) + 1,
      financialExposure: Math.floor(s(seed + 5) * 900) + 10,
      actionRequired: actionsRequired[i % actionsRequired.length],
      monitoringFrequency: freqOptions[Math.floor(s(seed + 6) * freqOptions.length)],
      escalationLevel: Math.floor(s(seed + 7) * 3) + 1,
      warehouse: WAREHOUSES[Math.floor(s(seed + 8) * WAREHOUSES.length)],
    }
  })

  // Risk Analytics — 12 months
  const riskAnalytics: RiskAnalytics[] = months.map((month, i) => {
    const seed = i + 5001
    const s = seededRandom
    const total = Math.floor(s(seed) * 30) + 60
    const critical = Math.floor(total * (0.08 + s(seed + 1) * 0.12))
    const high = Math.floor(total * (0.15 + s(seed + 2) * 0.15))
    return {
      id: `AN-${String(i + 1).padStart(3, "0")}`,
      month,
      totalRisks: total,
      criticalRisks: critical,
      highRisks: high,
      mitigatedRisks: Math.floor(total * (0.4 + s(seed + 3) * 0.3)),
      newRisks: Math.floor(total * (0.1 + s(seed + 4) * 0.2)),
      avgRiskScore: Math.floor(s(seed + 5) * 25) + 45,
      financialExposure: Math.floor(s(seed + 6) * 400) + 200,
      complianceBreachCount: Math.floor(s(seed + 7) * 8) + 1,
      supplierLosses: Math.floor(s(seed + 8) * 5),
    }
  })

  return { riskRegister, riskAssessments, mitigationPlans, watchlist, riskAnalytics, months, SUPPLIERS, WAREHOUSES, RISK_CATEGORIES, RISK_LEVELS, MITIGATION_STATUSES, descriptions, watchReasons, planNames, owners, freqOptions }
}

// ─── Helper Components ─────────────────────────────────────────────────────
function FieldGrid({ fields }: { fields: { label: string; value: string }[] }) {
  return (
    <div className="srm-drawer-field-grid">
      {fields.map((f, i) => (
        <div key={i} className="srm-drawer-field">
          <span className="srm-drawer-field-label">{f.label}</span>
          <span className="srm-drawer-field-value">{f.value}</span>
        </div>
      ))}
    </div>
  )
}

function MetricsRow({ metrics }: { metrics: { label: string; value: string; sub: string; color: string }[] }) {
  return (
    <div className="srm-drawer-metrics-row">
      {metrics.map((m, i) => (
        <div key={i} className="srm-drawer-metric-card" style={{ borderLeftColor: m.color }}>
          <span className="srm-drawer-metric-label">{m.label}</span>
          <span className="srm-drawer-metric-value">{m.value}</span>
          <span className="srm-drawer-metric-sub">{m.sub}</span>
        </div>
      ))}
    </div>
  )
}

function RiskScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : score >= 25 ? "#f97316" : "#dc2626"
  return (
    <div className="srm-score-ring-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <span className="srm-score-ring-text" style={{ color }}>{score}</span>
    </div>
  )
}

function TrendBadge({ trend }: { trend: string }) {
  if (trend === "increasing") return <span className="srm-trend-badge srm-trend-up"><ArrowUpRight className="h-3 w-3" /> Increasing</span>
  if (trend === "decreasing") return <span className="srm-trend-badge srm-trend-down"><ArrowDownRight className="h-3 w-3" /> Decreasing</span>
  return <span className="srm-trend-badge srm-trend-flat">— Stable</span>
}

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  return `₹${amount.toLocaleString("en-IN")}`
}

function sortBy(arr: any[], key: string, dir: "asc" | "desc"): any[] {
  return [...arr].sort((a, b) => {
    const va = a[key]
    const vb = b[key]
    if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va
    return dir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
  })
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function SupplierRiskManagementView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterWarehouse, setFilterWarehouse] = useState("all")
  const [sortKey, setSortKey] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const toast = useToast()

  // ── Tab 0: Dashboard ──────────────────────────────────────────────────
  const dashboardKPIs = [
    { label: "Total Active Risks", value: data.riskRegister.length, sub: "Across all categories", color: COLORS.rose, icon: ShieldAlert },
    { label: "Critical Risks", value: data.riskRegister.filter((r) => r.riskLevel === "Critical").length, sub: "Immediate action needed", color: "#dc2626", icon: Flame },
    { label: "Avg Risk Score", value: Math.round(data.riskRegister.reduce((a, r) => a + r.riskScore, 0) / data.riskRegister.length), sub: "Scale 0–100", color: COLORS.amber, icon: Gauge },
    { label: "Watchlist Suppliers", value: data.watchlist.length, sub: "Under monitoring", color: COLORS.violet, icon: Eye },
    { label: "Mitigation Progress", value: `${Math.round(data.mitigationPlans.reduce((a, m) => a + m.completionPct, 0) / data.mitigationPlans.length)}%`, sub: "Avg completion rate", color: COLORS.emerald, icon: Target },
    { label: "Financial Exposure", value: `₹${(data.riskRegister.reduce((a, r) => a + r.exposure, 0) / 100).toFixed(0)}L`, sub: "Total potential loss", color: COLORS.indigo, icon: DollarSign },
  ]

  // Monthly risk trend chart
  const monthlyTrendData = data.riskAnalytics.map((a) => ({
    month: a.month,
    totalRisks: a.totalRisks,
    criticalRisks: a.criticalRisks,
    mitigatedRisks: a.mitigatedRisks,
    newRisks: a.newRisks,
    avgScore: a.avgRiskScore,
  }))

  // Risk by category distribution
  const categoryDist = [...new Set(data.riskRegister.map((r) => r.category))].map((cat) => ({
    name: cat.replace(" Risk", ""),
    value: data.riskRegister.filter((r) => r.category === cat).length,
  }))

  // Risk by level
  const levelDist = RISK_LEVELS.map((level) => ({
    name: level,
    value: data.riskRegister.filter((r) => r.riskLevel === level).length,
  }))

  // Risk heatmap data — supplier vs category
  const supplierRiskMatrix = SUPPLIERS.slice(0, 10).map((sup) => {
    const supRisks = data.riskRegister.filter((r) => r.supplier === sup)
    const entry: any = { supplier: sup.split(" ")[0] }
    RISK_CATEGORIES.forEach((cat) => {
      const risks = supRisks.filter((r) => r.category === cat)
      entry[cat.replace(" Risk", "")] = risks.length > 0 ? Math.round(risks.reduce((a, r) => a + r.riskScore, 0) / risks.length) : 0
    })
    return entry
  })

  // Top 10 highest risk items
  const topRisks = sortBy(data.riskRegister, "riskScore", "desc").slice(0, 10)

  // Mitigation status breakdown
  const mitigationStatusDist = MITIGATION_STATUSES.map((st) => ({
    name: st,
    value: data.mitigationPlans.filter((m) => m.status === st).length,
  }))

  // Exposure by warehouse
  const warehouseExposure = WAREHOUSES.map((wh) => ({
    warehouse: wh.split(" ")[0],
    exposure: data.riskRegister.filter((r) => r.warehouse === wh).reduce((a, r) => a + r.exposure, 0),
    count: data.riskRegister.filter((r) => r.warehouse === wh).length,
  }))

  // ── Tab 1: Risk Register ─────────────────────────────────────────────
  const filteredRiskRegister = useMemo(() => {
    let items = data.riskRegister
    if (searchTerm) items = items.filter((r) => r.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterCategory !== "all") items = items.filter((r) => r.category === filterCategory)
    if (filterLevel !== "all") items = items.filter((r) => r.riskLevel === filterLevel)
    if (filterWarehouse !== "all") items = items.filter((r) => r.warehouse === filterWarehouse)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterCategory, filterLevel, filterWarehouse, sortKey, sortDir])

  // ── Tab 2: Risk Assessments ───────────────────────────────────────────
  const filteredAssessments = useMemo(() => {
    let items = data.riskAssessments
    if (searchTerm) items = items.filter((a) => a.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterCategory !== "all") items = items.filter((a) => a.category === filterCategory)
    if (filterWarehouse !== "all") items = items.filter((a) => a.warehouse === filterWarehouse)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterCategory, filterWarehouse, sortKey, sortDir])

  // ── Tab 3: Mitigation Plans ───────────────────────────────────────────
  const filteredMitigations = useMemo(() => {
    let items = data.mitigationPlans
    if (searchTerm) items = items.filter((m) => m.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || m.planName.toLowerCase().includes(searchTerm.toLowerCase()) || m.id.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterCategory !== "all") items = items.filter((m) => m.riskCategory === filterCategory)
    if (filterLevel !== "all") items = items.filter((m) => m.priority === filterLevel)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterCategory, filterLevel, sortKey, sortDir])

  // ── Tab 4: Watchlist ─────────────────────────────────────────────────
  const filteredWatchlist = useMemo(() => {
    let items = data.watchlist
    if (searchTerm) items = items.filter((w) => w.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || w.watchReason.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterLevel !== "all") items = items.filter((w) => w.severity === filterLevel)
    if (filterWarehouse !== "all") items = items.filter((w) => w.warehouse === filterWarehouse)
    return sortBy(items, sortKey, sortDir)
  }, [data, searchTerm, filterLevel, filterWarehouse, sortKey, sortDir])

  // ── Tab 5: Analytics ──────────────────────────────────────────────────
  const financialTrend = data.riskAnalytics.map((a) => ({
    month: a.month,
    exposure: a.financialExposure,
    breaches: a.complianceBreachCount * 15,
    losses: a.supplierLosses * 25,
  }))

  const riskVelocity = data.riskAnalytics.map((a) => ({
    month: a.month,
    newRisks: a.newRisks,
    mitigated: a.mitigatedRisks,
    netRisk: a.newRisks * 2 - a.mitigatedRisks,
  }))

  const categoryHeatmap = RISK_CATEGORIES.map((cat) => {
    const catRisks = data.riskRegister.filter((r) => r.category === cat)
    return {
      category: cat.replace(" Risk", ""),
      totalRisks: catRisks.length,
      avgScore: catRisks.length > 0 ? Math.round(catRisks.reduce((a, r) => a + r.riskScore, 0) / catRisks.length) : 0,
      criticalCount: catRisks.filter((r) => r.riskLevel === "Critical").length,
      avgExposure: catRisks.length > 0 ? Math.round(catRisks.reduce((a, r) => a + r.exposure, 0) / catRisks.length) : 0,
    }
  })

  // ─── Drawer Handlers ────────────────────────────────────────────────────
  const openDrawer = (type: string, item: any) => {
    setDrawerType(type)
    setDrawerData(item)
    setDrawerOpen(true)
  }

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <TableHead className="cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">{label}{sortKey === field && <span className="srm-sort-indicator">{sortDir === "asc" ? "▲" : "▼"}</span>}</div>
    </TableHead>
  )

  // ─── Render ────────────────────────────────────────────────────────────
  const tabs = [
    // Tab 0 — Dashboard
    {
      title: "Risk Dashboard",
      content: (
        <div className="srm-tab-content">
          {/* KPI Grid */}
          <div className="srm-kpi-grid">
            {dashboardKPIs.map((kpi, i) => (
              <div key={i} className={`srm-kpi-card srm-kpi-${i}`}>
                <div className="srm-kpi-icon-wrap" style={{ backgroundColor: kpi.color + "18" }}>
                  <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
                </div>
                <div className="srm-kpi-info">
                  <span className="srm-kpi-label">{kpi.label}</span>
                  <span className="srm-kpi-value">{kpi.value}</span>
                  <span className="srm-kpi-sub">{kpi.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="srm-chart-grid">
            {/* Monthly Trend ComposedChart */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Monthly Risk Trend</CardTitle>
                <CardDescription>Risk volume and score over 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="totalRisks" fill={COLORS.indigo} name="Total Risks" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar yAxisId="left" dataKey="criticalRisks" fill={COLORS.rose} name="Critical" radius={[4, 4, 0, 0]} barSize={16} />
                    <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke={COLORS.amber} name="Avg Score" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="mitigatedRisks" stroke={COLORS.emerald} name="Mitigated" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Category Distribution PieChart */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Risk by Category</CardTitle>
                <CardDescription>Distribution across risk types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryDist} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" nameKey="name" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                      {[COLORS.teal, COLORS.indigo, COLORS.rose, COLORS.amber, COLORS.emerald, COLORS.sky, COLORS.violet, COLORS.orange].map((color, i) => <Cell key={i} fill={color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Level Distribution */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Risk Level Distribution</CardTitle>
                <CardDescription>Critical / High / Medium / Low breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={levelDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]} barSize={40}>
                      {levelDist.map((entry, i) => <Cell key={i} fill={RISK_COLORS[entry.name]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Supplier Risk Heatmap */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Top 10 Supplier Risk Matrix</CardTitle>
                <CardDescription>Score intensity by risk category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="srm-heatmap-grid">
                  <div className="srm-heatmap-header">
                    <span className="srm-heatmap-corner">Supplier</span>
                    {RISK_CATEGORIES.slice(0, 5).map((cat) => (
                      <span key={cat} className="srm-heatmap-col-head">{cat.replace(" Risk", "").slice(0, 6)}</span>
                    ))}
                  </div>
                  {supplierRiskMatrix.map((row: any, i: number) => (
                    <div key={i} className="srm-heatmap-row">
                      <span className="srm-heatmap-row-head">{row.supplier}</span>
                      {RISK_CATEGORIES.slice(0, 5).map((cat) => {
                        const val = row[cat.replace(" Risk", "")]
                        const bg = val >= 70 ? "#fecaca" : val >= 40 ? "#fef08a" : val > 0 ? "#bbf7d0" : "#f8fafc"
                        return <span key={cat} className="srm-heatmap-cell" style={{ backgroundColor: bg, color: val >= 70 ? "#dc2626" : "#334155" }}>{val}</span>
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top 10 Risks Horizontal Bar */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Top 10 Highest Risk Items</CardTitle>
                <CardDescription>By composite risk score</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topRisks} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <YAxis dataKey="supplier" type="category" width={120} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="riskScore" name="Risk Score" radius={[0, 6, 6, 0]} barSize={14}>
                      {topRisks.map((entry, i) => <Cell key={i} fill={RISK_COLORS[entry.riskLevel] || "#6366f1"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Mitigation Status Pie */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Mitigation Status</CardTitle>
                <CardDescription>Current plan status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={mitigationStatusDist} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" nameKey="name" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                      {Object.values(STATUS_COLORS).map((color, i) => <Cell key={i} fill={color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Warehouse Exposure */}
            <Card className="hover-lift-sm srm-chart-card srm-chart-full">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Warehouse Risk Exposure</CardTitle>
                <CardDescription>Exposure (₹L) and risk count by warehouse</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={warehouseExposure}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="exposure" fill={COLORS.rose} name="Exposure (₹L)" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="count" stroke={COLORS.indigo} name="Risk Count" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },

    // Tab 1 — Risk Register
    {
      title: "Risk Register",
      content: (
        <div className="srm-tab-content">
          <div className="srm-toolbar">
            <div className="srm-search-wrap">
              <Search className="h-4 w-4 srm-search-icon" />
              <Input placeholder="Search by supplier, ID, description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="srm-search-input" />
            </div>
            <div className="srm-filter-row">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="srm-select-trigger"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {RISK_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="srm-select-trigger"><SelectValue placeholder="Risk Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {RISK_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                <SelectTrigger className="srm-select-trigger"><SelectValue placeholder="Warehouse" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredRiskRegister, "risk-register")} className="press-scale btn-outline-animate srm-export-btn">
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
            </div>
          </div>
          <div className="srm-table-wrap">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" />
                  <SortHeader label="Supplier" field="supplier" />
                  <TableHead>Category</TableHead>
                  <SortHeader label="Level" field="riskLevel" />
                  <SortHeader label="Score" field="riskScore" />
                  <TableHead>Prob / Impact</TableHead>
                  <SortHeader label="Exposure (₹L)" field="exposure" />
                  <TableHead>Trend</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="srm-action-col">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRiskRegister.map((r) => (
                  <TableRow key={r.id} className="srm-table-row">
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.supplier}</TableCell>
                    <TableCell>
                      <div className="srm-cat-badge" style={{ backgroundColor: COLORS.teal + "15", color: COLORS.teal }}>
                        {CATEGORY_ICONS[r.category]} <span className="ml-1">{r.category.replace(" Risk", "")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="srm-level-badge" style={{ backgroundColor: RISK_COLORS[r.riskLevel] + "18", color: RISK_COLORS[r.riskLevel] }}>{r.riskLevel}</span>
                    </TableCell>
                    <TableCell>
                      <div className="srm-score-cell">
                        <div className="srm-score-bar-bg">
                          <div className="srm-score-bar-fill" style={{ width: `${r.riskScore}%`, backgroundColor: r.riskScore >= 70 ? "#dc2626" : r.riskScore >= 50 ? "#f97316" : r.riskScore >= 30 ? "#f59e0b" : "#22c55e" }} />
                        </div>
                        <span className="srm-score-val">{r.riskScore}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs">{r.probability}% / {r.impact}%</span></TableCell>
                    <TableCell className="font-medium">{r.exposure}</TableCell>
                    <TableCell><TrendBadge trend={r.trend} /></TableCell>
                    <TableCell>
                      <span className={`srm-sla-badge ${r.slaStatus === "Compliant" ? "srm-sla-ok" : r.slaStatus === "At Risk" ? "srm-sla-warn" : "srm-sla-breach"}`}>
                        {r.slaStatus === "Compliant" ? <CheckCircle2 className="h-3 w-3" /> : r.slaStatus === "At Risk" ? <AlertTriangle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        <span>{r.slaStatus}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="press-scale srm-view-btn" onClick={() => openDrawer("risk", r)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="srm-table-footer">Showing {filteredRiskRegister.length} of {data.riskRegister.length} risk items</div>
        </div>
      ),
    },

    // Tab 2 — Risk Assessments
    {
      title: "Risk Assessments",
      content: (
        <div className="srm-tab-content">
          <div className="srm-toolbar">
            <div className="srm-search-wrap">
              <Search className="h-4 w-4 srm-search-icon" />
              <Input placeholder="Search by supplier, assessment ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="srm-search-input" />
            </div>
            <div className="srm-filter-row">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="srm-select-trigger"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {RISK_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                <SelectTrigger className="srm-select-trigger"><SelectValue placeholder="Warehouse" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredAssessments, "risk-assessments")} className="press-scale btn-outline-animate srm-export-btn">
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
            </div>
          </div>
          <div className="srm-table-wrap">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" />
                  <SortHeader label="Supplier" field="supplier" />
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Category</TableHead>
                  <SortHeader label="Overall" field="overallScore" />
                  <TableHead>Financial</TableHead>
                  <TableHead>Operational</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="srm-action-col">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.map((a) => (
                  <TableRow key={a.id} className="srm-table-row">
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell className="font-medium">{a.supplier}</TableCell>
                    <TableCell className="text-xs">{a.warehouse}</TableCell>
                    <TableCell>
                      <div className="srm-cat-badge" style={{ backgroundColor: COLORS.teal + "15", color: COLORS.teal }}>
                        {CATEGORY_ICONS[a.category]} <span className="ml-1">{a.category.replace(" Risk", "")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="srm-score-cell">
                        <div className="srm-score-bar-bg">
                          <div className="srm-score-bar-fill" style={{ width: `${a.overallScore}%`, backgroundColor: a.overallScore >= 80 ? "#22c55e" : a.overallScore >= 60 ? "#f59e0b" : "#f97316" }} />
                        </div>
                        <span className="srm-score-val">{a.overallScore}</span>
                      </div>
                    </TableCell>
                    <TableCell><div className="numeric-cell srm-mini-bar"><div className="srm-mini-fill" style={{ width: `${a.financialScore}%`, backgroundColor: COLORS.indigo }} /><span className="srm-mini-val">{a.financialScore}</span></div></TableCell>
                    <TableCell><div className="numeric-cell srm-mini-bar"><div className="srm-mini-fill" style={{ width: `${a.operationalScore}%`, backgroundColor: COLORS.sky }} /><span className="srm-mini-val">{a.operationalScore}</span></div></TableCell>
                    <TableCell><div className="numeric-cell srm-mini-bar"><div className="srm-mini-fill" style={{ width: `${a.qualityScore}%`, backgroundColor: COLORS.emerald }} /><span className="srm-mini-val">{a.qualityScore}</span></div></TableCell>
                    <TableCell><div className="numeric-cell srm-mini-bar"><div className="srm-mini-fill" style={{ width: `${a.complianceScore}%`, backgroundColor: COLORS.violet }} /><span className="srm-mini-val">{a.complianceScore}</span></div></TableCell>
                    <TableCell>
                      <span className={`srm-assess-status-badge ${a.status === "Completed" ? "srm-status-done" : a.status === "In Progress" ? "srm-status-progress" : "srm-status-pending"}`}>
                        {a.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="press-scale srm-view-btn" onClick={() => openDrawer("assessment", a)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="srm-table-footer">Showing {filteredAssessments.length} of {data.riskAssessments.length} assessments</div>
        </div>
      ),
    },

    // Tab 3 — Mitigation Plans
    {
      title: "Mitigation Plans",
      content: (
        <div className="srm-tab-content">
          <div className="srm-toolbar">
            <div className="srm-search-wrap">
              <Search className="h-4 w-4 srm-search-icon" />
              <Input placeholder="Search by supplier, plan name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="srm-search-input" />
            </div>
            <div className="srm-filter-row">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="srm-select-trigger"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {RISK_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="srm-select-trigger"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {RISK_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredMitigations, "mitigation-plans")} className="press-scale btn-outline-animate srm-export-btn">
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
            </div>
          </div>
          <div className="srm-table-wrap">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" />
                  <SortHeader label="Supplier" field="supplier" />
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Owner</TableHead>
                  <SortHeader label="Completion" field="completionPct" />
                  <TableHead>Budget (₹L)</TableHead>
                  <TableHead className="srm-action-col">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMitigations.map((m) => (
                  <TableRow key={m.id} className="srm-table-row">
                    <TableCell className="font-mono text-xs">{m.id}</TableCell>
                    <TableCell className="font-medium">{m.supplier}</TableCell>
                    <TableCell><span className="font-medium text-sm">{m.planName}</span></TableCell>
                    <TableCell>
                      <div className="srm-cat-badge" style={{ backgroundColor: COLORS.teal + "15", color: COLORS.teal }}>
                        {CATEGORY_ICONS[m.riskCategory]} <span className="ml-1">{m.riskCategory.replace(" Risk", "")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="srm-mit-status-badge" style={{ backgroundColor: STATUS_COLORS[m.status] + "18", color: STATUS_COLORS[m.status] }}>{m.status}</span>
                    </TableCell>
                    <TableCell>
                      <span className="srm-level-badge" style={{ backgroundColor: RISK_COLORS[m.priority] + "18", color: RISK_COLORS[m.priority] }}>{m.priority}</span>
                    </TableCell>
                    <TableCell className="text-sm">{m.owner}</TableCell>
                    <TableCell>
                      <div className="srm-progress-cell">
                        <div className="srm-progress-bar-bg">
                          <div className="srm-progress-bar-fill" style={{ width: `${m.completionPct}%`, backgroundColor: m.completionPct >= 80 ? "#22c55e" : m.completionPct >= 50 ? "#6366f1" : m.completionPct >= 20 ? "#f59e0b" : "#94a3b8" }} />
                        </div>
                        <span className="srm-progress-val">{m.completionPct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="srm-budget-text">{formatINR(m.budgetAllocated)}</span>
                      <span className="text-xs text-muted-foreground"> / {formatINR(m.budgetSpent)} spent</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="press-scale srm-view-btn" onClick={() => openDrawer("mitigation", m)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="srm-table-footer">Showing {filteredMitigations.length} of {data.mitigationPlans.length} plans</div>
        </div>
      ),
    },

    // Tab 4 — Watchlist
    {
      title: "Supplier Watchlist",
      content: (
        <div className="srm-tab-content">
          <div className="srm-toolbar">
            <div className="srm-search-wrap">
              <Search className="h-4 w-4 srm-search-icon" />
              <Input placeholder="Search by supplier, reason..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="srm-search-input" />
            </div>
            <div className="srm-filter-row">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="srm-select-trigger"><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  {["Critical", "High", "Medium", "Low"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                <SelectTrigger className="srm-select-trigger"><SelectValue placeholder="Warehouse" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredWatchlist, "supplier-watchlist")} className="press-scale btn-outline-animate srm-export-btn">
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
            </div>
          </div>

          {/* Watchlist cards */}
          <div className="srm-watchlist-grid">
            {filteredWatchlist.map((w) => (
              <Card key={w.id} className="hover-lift-sm srm-watch-card" onClick={() => openDrawer("watchlist", w)}>
                <CardHeader className="srm-watch-header">
                  <div className="srm-watch-header-top">
                    <div className="flex items-center gap-2">
                      <span className="srm-watch-severity-dot" style={{ backgroundColor: RISK_COLORS[w.severity] || "#f59e0b" }} />
                      <CardTitle className="srm-watch-title">{w.supplier}</CardTitle>
                    </div>
                    <Badge variant="outline" className="badge-interactive srm-watch-id-badge">{w.id}</Badge>
                  </div>
                  <CardDescription className="srm-watch-reason">{w.watchReason}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="srm-watch-body">
                    <div className="srm-watch-info-row">
                      <span className="srm-watch-label">Trigger:</span>
                      <span className="srm-watch-value">{w.triggerEvent}</span>
                    </div>
                    <div className="srm-watch-info-row">
                      <span className="srm-watch-label">Last Incident:</span>
                      <span className="srm-watch-value">{w.lastIncident}</span>
                    </div>
                    <div className="srm-watch-info-row">
                      <span className="srm-watch-label">Incidents:</span>
                      <span className="srm-watch-value">{w.incidentCount}</span>
                    </div>
                    <div className="srm-watch-info-row">
                      <span className="srm-watch-label">Exposure:</span>
                      <span className="srm-watch-value srm-exposure-val">₹{w.financialExposure}L</span>
                    </div>
                    <div className="srm-watch-info-row">
                      <span className="srm-watch-label">Monitoring:</span>
                      <span className="srm-watch-value">{w.monitoringFrequency}</span>
                    </div>
                  </div>
                  <div className="srm-watch-footer">
                    <span className={`srm-watch-severity-badge ${w.severity === "Critical" ? "srm-sev-critical" : w.severity === "High" ? "srm-sev-high" : "srm-sev-medium"}`}>
                      {w.severity}
                    </span>
                    <span className="srm-watch-action-text">{w.actionRequired}</span>
                  </div>
                  {/* Escalation indicator */}
                  <div className="srm-escalation-bar">
                    <span className="srm-escalation-label">Escalation</span>
                    <div className="srm-escalation-levels">
                      {[1, 2, 3].map((lv) => (
                        <div key={lv} className={`srm-escalation-dot ${w.escalationLevel >= lv ? "active" : ""}`} />
                      ))}
                    </div>
                    <span className="srm-escalation-val">L{w.escalationLevel}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="srm-table-footer">Showing {filteredWatchlist.length} of {data.watchlist.length} watchlist items</div>
        </div>
      ),
    },

    // Tab 5 — Risk Analytics
    {
      title: "Risk Analytics",
      content: (
        <div className="srm-tab-content">
          {/* Analytics KPIs */}
          <div className="srm-analytics-kpi-row">
            <div className="srm-analytics-kpi">
              <span className="srm-analytics-kpi-label">Total Exposure</span>
              <span className="srm-analytics-kpi-value">{formatINR(data.riskAnalytics.reduce((a, r) => a + r.financialExposure, 0) * 100000)}</span>
              <span className="srm-analytics-kpi-sub">FY 2025 aggregate</span>
            </div>
            <div className="srm-analytics-kpi">
              <span className="srm-analytics-kpi-label">Avg Mitigation Rate</span>
              <span className="srm-analytics-kpi-value">{Math.round(data.riskAnalytics.reduce((a, r) => a + r.mitigatedRisks, 0) / data.riskAnalytics.reduce((a, r) => a + r.totalRisks, 0) * 100)}%</span>
              <span className="srm-analytics-kpi-sub">Successfully mitigated</span>
            </div>
            <div className="srm-analytics-kpi">
              <span className="srm-analytics-kpi-label">Compliance Breaches</span>
              <span className="srm-analytics-kpi-value">{data.riskAnalytics.reduce((a, r) => a + r.complianceBreachCount, 0)}</span>
              <span className="srm-analytics-kpi-sub">Total incidents FY</span>
            </div>
            <div className="srm-analytics-kpi">
              <span className="srm-analytics-kpi-label">Supplier Losses</span>
              <span className="srm-analytics-kpi-value">{data.riskAnalytics.reduce((a, r) => a + r.supplierLosses, 0)}</span>
              <span className="srm-analytics-kpi-sub">Suppliers lost FY</span>
            </div>
          </div>

          <div className="srm-chart-grid">
            {/* Financial Exposure Trend */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Financial Exposure Trend</CardTitle>
                <CardDescription>Monthly exposure, breach cost, and loss tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={financialTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="exposure" fill={COLORS.rose + "30"} stroke={COLORS.rose} name="Exposure" strokeWidth={2} />
                    <Area type="monotone" dataKey="breaches" fill={COLORS.amber + "30"} stroke={COLORS.amber} name="Breach Cost" strokeWidth={2} />
                    <Area type="monotone" dataKey="losses" fill={COLORS.indigo + "30"} stroke={COLORS.indigo} name="Losses" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Velocity */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Risk Velocity</CardTitle>
                <CardDescription>New vs mitigated risks per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={riskVelocity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="newRisks" fill={COLORS.rose} name="New Risks" radius={[4, 4, 0, 0]} barSize={18} />
                    <Bar dataKey="mitigated" fill={COLORS.emerald} name="Mitigated" radius={[4, 4, 0, 0]} barSize={18} />
                    <Line type="monotone" dataKey="netRisk" stroke={COLORS.indigo} name="Net Risk" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Risk Analysis */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Category Risk Analysis</CardTitle>
                <CardDescription>Average score and critical count by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={categoryHeatmap}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="avgScore" fill={COLORS.indigo} name="Avg Score" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="criticalCount" stroke={COLORS.rose} name="Critical Count" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar: Risk Dimension Profile */}
            <Card className="hover-lift-sm srm-chart-card">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Risk Dimension Profile</CardTitle>
                <CardDescription>Top 5 supplier risk assessment averages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={RISK_CATEGORIES.slice(0, 6).map((cat) => {
                    const catAssessments = data.riskAssessments.filter((a) => a.category === cat)
                    const count = catAssessments.length || 1
                    return {
                      dimension: cat.replace(" Risk", ""),
                      current: Math.round(catAssessments.reduce((a, b) => a + b.overallScore, 0) / count),
                      target: 85,
                    }
                  })}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar name="Current" dataKey="current" stroke={COLORS.indigo} fill={COLORS.indigo} fillOpacity={0.3} strokeWidth={2} />
                    <Radar name="Target" dataKey="target" stroke={COLORS.emerald} fill={COLORS.emerald} fillOpacity={0.1} strokeWidth={1} strokeDasharray="5 5" />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Avg Risk Score Trend */}
            <Card className="hover-lift-sm srm-chart-card srm-chart-full">
              <CardHeader className="srm-chart-header">
                <CardTitle className="srm-chart-title">Average Risk Score Trend</CardTitle>
                <CardDescription>Monthly average score and risk velocity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.riskAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="avgRiskScore" fill={COLORS.rose + "30"} stroke={COLORS.rose} name="Avg Risk Score" strokeWidth={2} />
                    <Line type="monotone" dataKey="newRisks" stroke={COLORS.amber} name="New Risks (count)" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ]

  // ─── Drawer Content ────────────────────────────────────────────────────
  const renderDrawer = () => {
    if (!drawerData) return null

    if (drawerType === "risk") {
      const r = drawerData
      return (
        <>
          <SheetHeader className="srm-drawer-header">
            <SheetTitle className="srm-drawer-title">
              <ShieldAlert className="h-5 w-5 text-rose-500" /> Risk: {r.id}
            </SheetTitle>
            <SheetDescription>{r.supplier} — {r.category}</SheetDescription>
          </SheetHeader>
          <div className="srm-drawer-body">
            <div className="srm-drawer-visual-row">
              <RiskScoreRing score={r.riskScore} />
              <div className="srm-drawer-visual-info">
                <span className="srm-level-badge" style={{ backgroundColor: RISK_COLORS[r.riskLevel] + "18", color: RISK_COLORS[r.riskLevel], fontSize: 14, padding: "4px 12px" }}>{r.riskLevel}</span>
                <TrendBadge trend={r.trend} />
                <span className={`srm-sla-badge ${r.slaStatus === "Compliant" ? "srm-sla-ok" : r.slaStatus === "At Risk" ? "srm-sla-warn" : "srm-sla-breach"}`}>
                  {r.slaStatus === "Compliant" ? <CheckCircle2 className="h-3 w-3" /> : r.slaStatus === "At Risk" ? <AlertTriangle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  SLA: {r.slaStatus}
                </span>
              </div>
            </div>
            <div className="srm-drawer-desc-box">
              <p>{r.description}</p>
            </div>
            <MetricsRow metrics={[
              { label: "Risk Score", value: `${r.riskScore}/100`, sub: "Composite", color: COLORS.rose },
              { label: "Exposure", value: `₹${r.exposure}L`, sub: "Potential loss", color: COLORS.amber },
              { label: "Probability", value: `${r.probability}%`, sub: `Impact: ${r.impact}%`, color: COLORS.indigo },
            ]} />
            <FieldGrid fields={[
              { label: "Supplier", value: r.supplier },
              { label: "Category", value: r.category },
              { label: "Warehouse", value: r.warehouse },
              { label: "Detected", value: r.detectedDate },
              { label: "Last Assessed", value: r.lastAssessed },
              { label: "Probability", value: `${r.probability}%` },
              { label: "Impact", value: `${r.impact}%` },
              { label: "Risk ID", value: r.id },
            ]} />
          </div>
          <SheetFooter className="srm-drawer-footer">
            <Button size="sm" variant="outline"><RefreshCw className="press-scale btn-outline-animate h-3.5 w-3.5 mr-1" /> Reassess</Button>
            <Button size="sm" variant="outline"><ShieldCheck className="press-scale btn-outline-animate h-3.5 w-3.5 mr-1" /> Create Mitigation</Button>
            <Button size="sm" className="press-scale srm-drawer-primary-btn"><Zap className="h-3.5 w-3.5 mr-1" /> Escalate</Button>
          </SheetFooter>
        </>
      )
    }

    if (drawerType === "assessment") {
      const a = drawerData
      return (
        <>
          <SheetHeader className="srm-drawer-header">
            <SheetTitle className="srm-drawer-title">
              <BarChart3 className="h-5 w-5 text-indigo-500" /> Assessment: {a.id}
            </SheetTitle>
            <SheetDescription>{a.supplier} — {a.warehouse}</SheetDescription>
          </SheetHeader>
          <div className="srm-drawer-body">
            <div className="srm-drawer-visual-row">
              <RiskScoreRing score={a.overallScore} />
              <div className="srm-drawer-scores-grid">
                <div className="srm-drawer-dim-score"><span className="srm-dim-label">Financial</span><div className="srm-dim-bar"><div className="srm-dim-fill" style={{ width: `${a.financialScore}%`, backgroundColor: COLORS.indigo }} /></div><span className="srm-dim-val">{a.financialScore}</span></div>
                <div className="srm-drawer-dim-score"><span className="srm-dim-label">Operational</span><div className="srm-dim-bar"><div className="srm-dim-fill" style={{ width: `${a.operationalScore}%`, backgroundColor: COLORS.sky }} /></div><span className="srm-dim-val">{a.operationalScore}</span></div>
                <div className="srm-drawer-dim-score"><span className="srm-dim-label">Quality</span><div className="srm-dim-bar"><div className="srm-dim-fill" style={{ width: `${a.qualityScore}%`, backgroundColor: COLORS.emerald }} /></div><span className="srm-dim-val">{a.qualityScore}</span></div>
                <div className="srm-drawer-dim-score"><span className="srm-dim-label">Compliance</span><div className="srm-dim-bar"><div className="srm-dim-fill" style={{ width: `${a.complianceScore}%`, backgroundColor: COLORS.violet }} /></div><span className="srm-dim-val">{a.complianceScore}</span></div>
                <div className="srm-drawer-dim-score"><span className="srm-dim-label">Supply Chain</span><div className="srm-dim-bar"><div className="srm-dim-fill" style={{ width: `${a.supplyChainScore}%`, backgroundColor: COLORS.amber }} /></div><span className="srm-dim-val">{a.supplyChainScore}</span></div>
              </div>
            </div>
            <MetricsRow metrics={[
              { label: "Overall Score", value: `${a.overallScore}/100`, sub: "Composite", color: a.overallScore >= 80 ? COLORS.emerald : COLORS.amber },
              { label: "Priority", value: a.priority, sub: a.status, color: RISK_COLORS[a.priority] || COLORS.amber },
              { label: "Next Review", value: a.nextReview, sub: `By ${a.assessedBy}`, color: COLORS.indigo },
            ]} />
            <FieldGrid fields={[
              { label: "Supplier", value: a.supplier },
              { label: "Warehouse", value: a.warehouse },
              { label: "Category", value: a.category },
              { label: "Assessed By", value: a.assessedBy },
              { label: "Assessment Date", value: a.assessmentDate },
              { label: "Next Review", value: a.nextReview },
              { label: "Status", value: a.status },
              { label: "Assessment ID", value: a.id },
            ]} />
          </div>
          <SheetFooter className="srm-drawer-footer">
            <Button size="sm" variant="outline"><RefreshCw className="press-scale btn-outline-animate h-3.5 w-3.5 mr-1" /> Reassess</Button>
            <Button size="sm" variant="outline"><ShieldCheck className="press-scale btn-outline-animate h-3.5 w-3.5 mr-1" /> Generate Report</Button>
            <Button size="sm" className="press-scale srm-drawer-primary-btn"><Zap className="h-3.5 w-3.5 mr-1" /> Initiate Mitigation</Button>
          </SheetFooter>
        </>
      )
    }

    if (drawerType === "mitigation") {
      const m = drawerData
      return (
        <>
          <SheetHeader className="srm-drawer-header">
            <SheetTitle className="srm-drawer-title">
              <Target className="h-5 w-5 text-emerald-500" /> Plan: {m.id}
            </SheetTitle>
            <SheetDescription>{m.planName}</SheetDescription>
          </SheetHeader>
          <div className="srm-drawer-body">
            <div className="srm-drawer-visual-row">
              <div className="srm-drawer-progress-visual">
                <RiskScoreRing score={m.completionPct} size={70} />
                <span className="srm-progress-label">{m.status}</span>
              </div>
              <div className="srm-drawer-visual-info">
                <span className="srm-level-badge" style={{ backgroundColor: RISK_COLORS[m.priority] + "18", color: RISK_COLORS[m.priority] }}>{m.priority}</span>
                <span className="srm-mit-status-badge" style={{ backgroundColor: STATUS_COLORS[m.status] + "18", color: STATUS_COLORS[m.status] }}>{m.status}</span>
              </div>
            </div>
            <div className="srm-drawer-desc-box">
              <p>{m.description}</p>
            </div>
            <MetricsRow metrics={[
              { label: "Completion", value: `${m.completionPct}%`, sub: m.status, color: COLORS.emerald },
              { label: "Budget", value: formatINR(m.budgetAllocated), sub: `Spent: ${formatINR(m.budgetSpent)}`, color: COLORS.indigo },
              { label: "Residual Risk", value: `${m.residualRisk}%`, sub: m.riskCategory.replace(" Risk", ""), color: COLORS.amber },
            ]} />
            <FieldGrid fields={[
              { label: "Supplier", value: m.supplier },
              { label: "Risk ID", value: m.riskId },
              { label: "Category", value: m.riskCategory },
              { label: "Owner", value: m.owner },
              { label: "Start Date", value: m.startDate },
              { label: "Target Date", value: m.targetDate },
              { label: "Priority", value: m.priority },
              { label: "Plan ID", value: m.id },
            ]} />
            {/* Budget breakdown bar */}
            <div className="srm-budget-breakdown">
              <div className="srm-budget-bar">
                <div className="srm-budget-spent" style={{ width: `${Math.min(100, (m.budgetSpent / m.budgetAllocated) * 100)}%` }} />
              </div>
              <div className="srm-budget-labels">
                <span>Spent: {formatINR(m.budgetSpent)}</span>
                <span>Total: {formatINR(m.budgetAllocated)}</span>
              </div>
            </div>
          </div>
          <SheetFooter className="srm-drawer-footer">
            <Button size="sm" variant="outline"><RefreshCw className="press-scale btn-outline-animate h-3.5 w-3.5 mr-1" /> Update Status</Button>
            <Button size="sm" variant="outline"><Ban className="press-scale btn-outline-animate h-3.5 w-3.5 mr-1" /> Defer</Button>
            <Button size="sm" className="press-scale srm-drawer-primary-btn"><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Complete</Button>
          </SheetFooter>
        </>
      )
    }

    if (drawerType === "watchlist") {
      const w = drawerData
      return (
        <>
          <SheetHeader className="srm-drawer-header">
            <SheetTitle className="srm-drawer-title">
              <Eye className="h-5 w-5 text-violet-500" /> Watchlist: {w.id}
            </SheetTitle>
            <SheetDescription>{w.supplier} — Under Monitoring</SheetDescription>
          </SheetHeader>
          <div className="srm-drawer-body">
            <div className="srm-drawer-visual-row">
              <div className="srm-drawer-progress-visual">
                <RiskScoreRing score={Math.max(0, 100 - w.escalationLevel * 30)} size={70} />
                <span className={`srm-watch-severity-badge srm-sev-lg ${w.severity === "Critical" ? "srm-sev-critical" : w.severity === "High" ? "srm-sev-high" : "srm-sev-medium"}`}>
                  {w.severity}
                </span>
              </div>
              <div className="srm-drawer-visual-info">
                <span className="srm-watch-freq-badge">{w.monitoringFrequency}</span>
                <span className="srm-incident-count-badge">{w.incidentCount} incidents</span>
              </div>
            </div>
            <div className="srm-drawer-desc-box">
              <p><strong>Reason:</strong> {w.watchReason}</p>
              <p className="mt-1"><strong>Trigger Event:</strong> {w.triggerEvent}</p>
            </div>
            <MetricsRow metrics={[
              { label: "Financial Exposure", value: `₹${w.financialExposure}L`, sub: "Potential loss", color: COLORS.rose },
              { label: "Incidents", value: String(w.incidentCount), sub: w.lastIncident, color: COLORS.amber },
              { label: "Escalation", value: `Level ${w.escalationLevel}`, sub: w.monitoringFrequency, color: COLORS.violet },
            ]} />
            <FieldGrid fields={[
              { label: "Supplier", value: w.supplier },
              { label: "Watch Reason", value: w.watchReason },
              { label: "Trigger Event", value: w.triggerEvent },
              { label: "Last Incident", value: w.lastIncident },
              { label: "Monitoring", value: w.monitoringFrequency },
              { label: "Warehouse", value: w.warehouse },
              { label: "Action Required", value: w.actionRequired },
            ]} />
          </div>
          <SheetFooter className="srm-drawer-footer">
            <Button size="sm" variant="outline"><RefreshCw className="press-scale btn-outline-animate h-3.5 w-3.5 mr-1" /> Update Status</Button>
            <Button size="sm" variant="outline"><Eye className="press-scale btn-outline-animate h-3.5 w-3.5 mr-1" /> Full Profile</Button>
            <Button size="sm" className="press-scale srm-drawer-primary-btn"><Zap className="h-3.5 w-3.5 mr-1" /> Escalate Now</Button>
          </SheetFooter>
        </>
      )
    }

    return null
  }

  return (
    <div className="srm-container">
      <PageHeader
        title="Supplier Risk Management"
        description="Identify, assess, and mitigate supplier risks across your supply chain"
      />
      {/* Tab Navigation */}
      <div className="srm-tab-nav">
        {tabs.map((tab, i) => (
          <button key={i} className={`srm-tab-btn ${activeTab === i ? "active" : ""}`} onClick={() => { setActiveTab(i); setSearchTerm(""); setFilterCategory("all"); setFilterLevel("all"); setFilterWarehouse("all") }}>
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="srm-tab-content-wrap">{tabs[activeTab].content}</div>

      {/* Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="srm-drawer-panel" side="right">
          {renderDrawer()}
        </SheetContent>
      </Sheet>
    </div>
  )
}
