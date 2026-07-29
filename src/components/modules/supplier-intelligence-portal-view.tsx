"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { exportToCSV } from "@/components/shared/export-button"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BrainCircuit, BarChart3, ShieldCheck, Star, Award, Globe,
  Truck, Handshake, Target, Activity, RefreshCw, FileDown, CircleDot,
} from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646
  s = (s * 16807) % 2147483647; return (s - 1) / 2147483646
}
const pick = <T,>(a: readonly T[], s: number): T => a[Math.floor(seededRandom(s) * a.length)] as unknown as T
const ri = (min: number, max: number, s: number) => Math.floor(seededRandom(s) * (max - min + 1)) + min
const formatINR = (n: number) =>
  n >= 1e7 ? `\u20b9${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `\u20b9${(n / 1e5).toFixed(2)} L` : `\u20b9${n.toLocaleString("en-IN")}`

const C = { blue: "#3b82f6", emerald: "#059669", amber: "#d97706", violet: "#7c3aed", rose: "#e11d48", indigo: "#6366f1" }
const CC = [C.blue, C.emerald, C.amber, C.violet, C.rose, C.indigo, "#0891b2", "#ea580c"]

// ─── Enums ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Raw Materials", "Packaging", "Logistics", "Technology", "Equipment", "Chemicals", "Textiles", "Electronics"] as const
const CAT_EMOJI: Record<string, string> = { "Raw Materials": "\u270f\ufe0f", Packaging: "\ud83d\udce6", Logistics: "\ud83d\ude9a", Technology: "\ud83d\udcbb", Equipment: "\u2699\ufe0f", Chemicals: "\ud83e\uddea", Textiles: "\ud83e\udde5", Electronics: "\ud83d\udd0c" }
const STATUSES = ["Active", "Onboarding", "Under Review", "Suspended", "Blacklisted", "Dormant"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"] as const
const METRICS = ["Quality", "Delivery", "Cost", "Responsiveness", "Innovation", "Sustainability", "Risk", "Compliance"] as const
const GRADES = ["A+", "A", "B+", "B", "C+", "C"] as const
const RISK_TYPES = ["Financial", "Operational", "Geopolitical", "Quality", "Compliance", "Supply Disruption", "Cyber", "Environmental"] as const
const SEVERITIES = ["Critical", "High", "Medium", "Low", "Info"] as const
const CT_TYPES = ["Fixed Rate", "Volume-Based", "Rate Card", "Framework", "Spot", "Long-Term", "MOU", "Consortium"] as const
const CT_STATUSES = ["Active", "Pending", "Expiring", "Expired", "Terminated", "Renegotiating"] as const
const STATES = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana", "Gujarat", "West Bengal", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Kerala", "Punjab"] as const
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const PERIODS = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"] as const
const SUPPLIERS = ["Tata Steel Ltd", "Reliance Industries", "Mahindra Logistics", "TVS Supply Chain", "Godrej Consumer Products", "JSW Steel", "Adani Ports & SEZ", "Ashok Leyland", "Dr Reddys Labs", "Britannia Industries", "ITC Ltd", "Hindustan Unilever", "Maruti Suzuki", "Bharat Forge", "Larsen & Toubro", "UPL Ltd", "Dalmia Bharat Cement", "Bajaj Auto Ltd", "Hero Motocorp", "Sun Pharma"] as const
const FIRST = ["Rajesh", "Priya", "Amit", "Sneha", "Vikram", "Neha", "Suresh", "Anjali"] as const
const LAST = ["Mehta", "Shah", "Patel", "Reddy", "Singh", "Gupta", "Kumar", "Verma"] as const

// ─── Color maps ────────────────────────────────────────────────────────────
const GRADE_CLR: Record<string, string> = { "A+": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", A: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", "B+": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300", B: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", "C+": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300", C: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" }
const SEV_CLR: Record<string, string> = { Critical: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.5)]", High: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", Low: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", Info: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" }
const ST_CLR: Record<string, string> = { Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", Onboarding: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", "Under Review": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", Suspended: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", Blacklisted: "bg-gray-800 text-gray-100 dark:bg-gray-700 dark:text-gray-200", Dormant: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" }
const CS_CLR: Record<string, string> = { Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", Pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", Expiring: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", Expired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", Terminated: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", Renegotiating: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300" }

// ─── 16 Visual Components ─────────────────────────────────────────────────
// 1
const SupplierCategoryBadge = ({ cat }: { cat: string }) => <Badge className="sip-cat-badge text-[11px] px-2 py-0 bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300">{CAT_EMOJI[cat] ?? ""} {cat}</Badge>
// 2
const SupplierStatusBadge = ({ status }: { status: string }) => <Badge className={`sip-status-badge text-[11px] px-2 py-0 ${ST_CLR[status] ?? ""} ${status === "Active" ? "animate-pulse" : ""}`}>{status}</Badge>
// 3
const RatingBar = ({ v }: { v: number }) => { const c = v > 80 ? "bg-emerald-500" : v > 60 ? "bg-blue-500" : v > 40 ? "bg-amber-500" : "bg-red-500"; return (<div className="sip-rating-bar flex items-center gap-1.5"><div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${c}`} style={{ width: `${v}%` }} /></div><span className="text-[11px] text-muted-foreground w-7 text-right">{v}</span></div>) }
// 4
const CityBadge = ({ city }: { city: string }) => <Badge variant="outline" className="sip-city-badge text-[11px] px-2 py-0"><Globe className="h-3 w-3 mr-1" />{city}</Badge>
// 5
const MI: Record<string, React.ReactNode> = { Quality: <ShieldCheck className="h-3 w-3" />, Delivery: <Truck className="h-3 w-3" />, Cost: <IndianRupee className="h-3 w-3" />, Responsiveness: <Zap className="h-3 w-3" />, Innovation: <BrainCircuit className="h-3 w-3" />, Sustainability: <Award className="h-3 w-3" />, Risk: <AlertTriangle className="h-3 w-3" />, Compliance: <ShieldCheck className="h-3 w-3" /> }
const MetricTypeBadge = ({ m }: { m: string }) => <Badge className="sip-metric-badge text-[11px] px-2 py-0 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">{MI[m]} {m}</Badge>
// 6
const GradeBadge = ({ g }: { g: string }) => <Badge className={`sip-grade-badge text-[11px] px-2 py-0 font-bold ${GRADE_CLR[g] ?? ""}`}>{g}</Badge>
// 7
const TrendIndicator = ({ t }: { t: string }) => t === "Up" ? <span className="sip-trend-up text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 text-xs"><TrendingUp className="h-3 w-3" />Up</span> : <span className="sip-trend-down text-red-600 dark:text-red-400 flex items-center gap-0.5 text-xs"><TrendingDown className="h-3 w-3" />Down</span>
// 8
const RI: Record<string, React.ReactNode> = { Financial: <IndianRupee className="h-3 w-3" />, Operational: <Activity className="h-3 w-3" />, Geopolitical: <Globe className="h-3 w-3" />, Quality: <Star className="h-3 w-3" />, Compliance: <ShieldCheck className="h-3 w-3" />, "Supply Disruption": <Truck className="h-3 w-3" />, Cyber: <BrainCircuit className="h-3 w-3" />, Environmental: <Award className="h-3 w-3" /> }
const RiskTypeBadge = ({ t }: { t: string }) => <Badge className="sip-risk-type-badge text-[11px] px-2 py-0 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">{RI[t]} {t}</Badge>
// 9
const RiskSeverityBadge = ({ s }: { s: string }) => <Badge className={`sip-severity-badge text-[11px] px-2 py-0 ${SEV_CLR[s] ?? ""}`}>{s}</Badge>
// 10
const RiskScoreBar = ({ v }: { v: number }) => { const c = v > 75 ? "bg-red-500" : v > 50 ? "bg-amber-500" : v > 25 ? "bg-blue-500" : "bg-emerald-500"; return (<div className="sip-risk-score-bar flex items-center gap-1.5"><div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${c}`} style={{ width: `${v}%` }} /></div><span className="text-[11px] text-muted-foreground w-7 text-right">{v}</span></div>) }
// 11
const CTTypeBadge = ({ t }: { t: string }) => <Badge className="sip-ct-type-badge text-[11px] px-2 py-0 bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300">{t}</Badge>
// 12
const ContractStatusBadge = ({ s }: { s: string }) => <Badge className={`sip-ct-status-badge text-[11px] px-2 py-0 ${CS_CLR[s] ?? ""} ${s === "Active" ? "animate-pulse" : ""}`}>{s}</Badge>
// 13
const ValueTile = ({ v }: { v: number }) => <span className="sip-value-tile font-semibold text-xs">{formatINR(v)}</span>
// 14
const ComplianceBar = ({ v }: { v: number }) => { const c = v > 85 ? "bg-emerald-500" : v > 70 ? "bg-blue-500" : v > 50 ? "bg-amber-500" : "bg-red-500"; return (<div className="sip-compliance-bar flex items-center gap-1.5"><div className="h-1.5 w-14 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${c}`} style={{ width: `${v}%` }} /></div><span className="text-[11px] text-muted-foreground w-7 text-right">{v}%</span></div>) }
// 15
const SpendTile = ({ v }: { v: number }) => <span className="sip-spend-tile font-bold text-sm text-blue-700 dark:text-blue-300">{formatINR(v)}</span>
// 16
const ImpactTile = ({ v }: { v: number }) => <span className={`sip-impact-tile font-semibold text-xs ${v > 5e7 ? "text-red-600 dark:text-red-400" : v > 1e7 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>{formatINR(v)}</span>

// ─── Data Generation — 265 records ───────────────────────────────────────
function generateData() {
  const suppliers = Array.from({ length: 75 }, (_, i) => ({ id: `SUP-${String(i + 1).padStart(3, "0")}`, name: pick(SUPPLIERS, 1e3 + i * 7), category: pick(CATEGORIES, 2e3 + i * 3), status: pick(STATUSES, 3e3 + i * 5), rating: ri(25, 98, 4e3 + i), city: pick(CITIES, 5e3 + i * 11), compliance: ri(55, 100, 6e3 + i), spend: ri(5e5, 9.5e7, 7e3 + i * 13), contact: `${pick(FIRST, 8e3 + i)} ${pick(LAST, 9e3 + i)}` }))
  const scorecards = Array.from({ length: 70 }, (_, i) => ({ id: `SC-${String(i + 1).padStart(3, "0")}`, supplier: pick(SUPPLIERS, 1e4 + i * 7), metric: pick(METRICS, 11e3 + i * 3), score: ri(60, 99, 12e3 + i * 5), grade: pick(GRADES, 13e3 + i), trend: pick(["Up", "Down"] as const, 14e3 + i), period: pick(PERIODS, 15e3 + i * 2) }))
  const risks = Array.from({ length: 55 }, (_, i) => ({ id: `RSK-${String(i + 1).padStart(3, "0")}`, supplier: pick(SUPPLIERS, 2e4 + i * 7), type: pick(RISK_TYPES, 21e3 + i * 3), severity: pick(SEVERITIES, 22e3 + i * 5), score: ri(5, 95, 23e3 + i), mitigation: pick(["Pending", "In Progress", "Completed", "Not Started"] as const, 24e3 + i), impact: ri(1e5, 8e7, 25e3 + i * 11), probability: ri(5, 85, 26e3 + i), state: pick(STATES, 27e3 + i * 13) }))
  const contracts = Array.from({ length: 65 }, (_, i) => ({ id: `CTR-${String(i + 1).padStart(3, "0")}`, supplier: pick(SUPPLIERS, 3e4 + i * 7), type: pick(CT_TYPES, 31e3 + i * 3), status: pick(CT_STATUSES, 32e3 + i * 5), value: ri(2e5, 1.2e8, 33e3 + i * 11), start: `2024-${String(ri(1, 12, 34e3 + i)).padStart(2, "0")}-01`, end: `2025-${String(ri(1, 12, 35e3 + i)).padStart(2, "0")}-28`, autoRenew: seededRandom(36e3 + i) > 0.5, slaCompliance: ri(60, 100, 37e3 + i) }))
  const kpis = { totalSuppliers: 75, activeContracts: 42, avgScore: 84.2, riskAlerts: 18, onTimeRate: 94.6, totalSpend: 4.25e9, criticalSuppliers: 7, complianceRate: 91.3 }
  const monthlySpend = MONTHS.map((m, i) => ({ month: m, direct: ri(120, 450, 4e4 + i * 3), indirect: ri(50, 200, 41e3 + i * 3), spot: ri(20, 150, 42e3 + i * 3) }))
  const catPie = CATEGORIES.map((c, i) => ({ name: c, value: ri(8, 25, 43e3 + i * 7) }))
  const perfBar = Array.from({ length: 10 }, (_, i) => ({ name: String(SUPPLIERS[i]).split(" ").slice(0, 2).join(" "), quality: ri(75, 98, 44e3 + i), delivery: ri(70, 96, 45e3 + i) }))
  const perfTrend = MONTHS.map((m, i) => ({ month: m, quality: ri(80, 97, 46e3 + i), delivery: ri(78, 95, 47e3 + i), cost: ri(70, 92, 48e3 + i) }))
  const riskDist = RISK_TYPES.map((t, i) => ({ type: t, count: ri(3, 15, 49e3 + i) }))
  const regionalSpend = CITIES.map((c, i) => ({ city: c, spend: ri(20, 95, 5e4 + i * 7) }))
  return { suppliers, scorecards, risks, contracts, kpis, monthlySpend, catPie, perfBar, perfTrend, riskDist, regionalSpend } as const
}
const data = generateData()

// ─── Main Component ──────────────────────────────────────────────────────
export default function SupplierIntelligencePortalView() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterVal, setFilterVal] = useState("all")
  const [sortCol, setSortCol] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Record<string, string | number> | null>(null)

  const handleSort = (col: string) => { if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortCol(col); setSortDir("asc") } }
  const sortFn = <T,>(items: T[], field: string): T[] => {
    if (!field) return items
    return [...items].sort((a, b) => { const aV = (a as unknown as Record<string, string | number>)[field] ?? ""; const bV = (b as unknown as Record<string, string | number>)[field] ?? ""; return sortDir === "asc" ? (aV < bV ? -1 : aV > bV ? 1 : 0) : (aV < bV ? 1 : aV > bV ? -1 : 0) })
  }
  const SortHeader = ({ col, label }: { col: string; label: string }) => {
    const arrow = sortCol === col ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""
    return (
      <TableHead className="text-xs cursor-pointer select-none hover:bg-accent/50 sip-sort-header" onClick={() => handleSort(col)}>
        <div className="flex items-center gap-0.5">{label}<ArrowUpDown className="h-3 w-3 text-muted-foreground" />{arrow && <span className="text-[9px]">{arrow}</span>}</div>
      </TableHead>
    )
  }

  const filterOpts = activeTab === "0" ? ["all"] : activeTab === "1" ? [...STATUSES] : activeTab === "2" ? [...METRICS] : activeTab === "3" ? [...SEVERITIES] : activeTab === "4" ? [...CT_STATUSES] : ["all"]
  const tabData = activeTab === "1" || activeTab === "0" ? data.suppliers : activeTab === "2" ? data.scorecards : activeTab === "3" ? data.risks : activeTab === "4" ? data.contracts : data.suppliers
  const filterKey = activeTab === "1" ? "status" : activeTab === "2" ? "metric" : activeTab === "3" ? "severity" : activeTab === "4" ? "status" : ""
  const filtered = useMemo(() => {
    let arr = tabData as unknown as Record<string, string | number>[]
    if (searchTerm) arr = arr.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase())))
    if (filterVal !== "all" && filterKey) arr = arr.filter(r => r[filterKey] === filterVal)
    return sortFn(arr, sortCol)
  }, [tabData, searchTerm, filterVal, sortCol, sortDir, filterKey])

  const kpiDefs = [
    { label: "Total Suppliers", value: String(data.kpis.totalSuppliers), icon: <Users className="h-4 w-4" />, color: "text-blue-600" },
    { label: "Active Contracts", value: String(data.kpis.activeContracts), icon: <Handshake className="h-4 w-4" />, color: "text-emerald-600" },
    { label: "Avg Score", value: `${data.kpis.avgScore}%`, icon: <Star className="h-4 w-4" />, color: "text-violet-600" },
    { label: "Risk Alerts", value: String(data.kpis.riskAlerts), icon: <AlertTriangle className="h-4 w-4" />, color: "text-rose-600" },
    { label: "On-Time Rate", value: `${data.kpis.onTimeRate}%`, icon: <Target className="h-4 w-4" />, color: "text-indigo-600" },
    { label: "Total Spend", value: formatINR(data.kpis.totalSpend), icon: <IndianRupee className="h-4 w-4" />, color: "text-amber-600" },
    { label: "Critical Suppliers", value: String(data.kpis.criticalSuppliers), icon: <Zap className="h-4 w-4" />, color: "text-red-600" },
    { label: "Compliance Rate", value: `${data.kpis.complianceRate}%`, icon: <ShieldCheck className="h-4 w-4" />, color: "text-emerald-600" },
  ]

  const renderVal = (key: string, val: string | number) => {
    if (typeof val !== "number") return String(val)
    if (["spend", "value", "impact"].some(k => key.includes(k))) return formatINR(val)
    if (["score", "rating", "compliance", "slaCompliance", "probability"].some(k => key.includes(k))) return `${val}%`
    if (key === "autoRenew") return val === 1 ? "Yes" : "No"
    return String(val)
  }

  return (
    <div className="sip-root flex flex-col gap-4 p-4 md:p-6">
      <PageHeader title="Supplier Intelligence Portal" description="AI-powered supplier analytics, risk intelligence & contract management for Indian logistics" actions={
        <div className="flex gap-2">
          <Button size="sm" className="gap-1 text-xs sip-btn" onClick={() => toast.success("Refreshed", "Supplier data refreshed successfully")}><RefreshCw className="h-3 w-3" />Refresh</Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs sip-btn" onClick={() => exportToCSV(filtered, `supplier-intelligence-tab${activeTab}`)}><FileDown className="h-3 w-3" />Export</Button>
        </div>
      } />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="sip-tabs flex-wrap">
          <TabsTrigger value="0"><BarChart3 className="h-3.5 w-3.5 mr-1" />Dashboard</TabsTrigger>
          <TabsTrigger value="1"><Users className="h-3.5 w-3.5 mr-1" />Registry</TabsTrigger>
          <TabsTrigger value="2"><Star className="h-3.5 w-3.5 mr-1" />Scorecards</TabsTrigger>
          <TabsTrigger value="3"><AlertTriangle className="h-3.5 w-3.5 mr-1" />Risks</TabsTrigger>
          <TabsTrigger value="4"><Handshake className="h-3.5 w-3.5 mr-1" />Contracts</TabsTrigger>
          <TabsTrigger value="5"><BrainCircuit className="h-3.5 w-3.5 mr-1" />Analytics</TabsTrigger>
        </TabsList>

        {/* Tab 0: Intelligence Dashboard */}
        <TabsContent value="0" className="sip-tab-dashboard flex flex-col gap-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{kpiDefs.map((k, i) => <Card key={i} className="sip-kpi"><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[11px] text-muted-foreground">{k.label}</span><span className={cn("sip-kpi-icon", k.color)}>{k.icon}</span></div><p className="text-lg font-bold mt-1">{k.value}</p></CardContent></Card>)}</div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="sip-chart"><CardHeader className="pb-1"><CardTitle className="text-sm">Monthly Spend Trend</CardTitle><CardDescription className="text-[11px]">Direct, Indirect & Spot (\u20b9 L)</CardDescription></CardHeader><CardContent><LineChart data={data.monthlySpend} height={230}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="direct" stroke={C.blue} strokeWidth={2} /><Line type="monotone" dataKey="indirect" stroke={C.emerald} strokeWidth={2} /><Line type="monotone" dataKey="spot" stroke={C.amber} strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="sip-chart"><CardHeader className="pb-1"><CardTitle className="text-sm">Supplier Categories</CardTitle><CardDescription className="text-[11px]">Distribution across 8 categories</CardDescription></CardHeader><CardContent><PieChart height={230}><Pie data={data.catPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name }: { name: string }) => <span className="text-[10px]">{name}</span>} labelLine={false}>{data.catPie.map((_, i) => <Cell key={i} fill={CC[i % CC.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
          <Card className="sip-chart"><CardHeader className="pb-1"><CardTitle className="text-sm">Top 10 Supplier Performance</CardTitle><CardDescription className="text-[11px]">Quality vs Delivery scores</CardDescription></CardHeader><CardContent><BarChart data={data.perfBar} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={55} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="quality" fill={C.blue} /><Bar dataKey="delivery" fill={C.emerald} /></BarChart></CardContent></Card>
        </TabsContent>

        {/* Tab 1: Supplier Registry */}
        <TabsContent value="1" className="sip-tab-registry flex flex-col gap-4 mt-4">
          <div className="flex gap-2 flex-wrap"><div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search suppliers..." className="sip-search h-8 text-sm pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><Select value={filterVal} onValueChange={setFilterVal}><SelectTrigger className="sip-filter h-8 text-sm w-40"><SelectValue /></SelectTrigger><SelectContent>{filterOpts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
          <Card className="sip-table-card overflow-hidden"><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><SortHeader col="id" label="ID" /><SortHeader col="name" label="Supplier" /><SortHeader col="category" label="Category" /><SortHeader col="status" label="Status" /><SortHeader col="rating" label="Rating" /><SortHeader col="city" label="City" /><SortHeader col="compliance" label="Compliance" /><SortHeader col="spend" label="Spend" /><TableHead className="text-xs w-10" /></TableRow></TableHeader><TableBody>{filtered.slice(0, 25).map((r, i) => <TableRow key={i} className="sip-table-row hover:bg-accent/40 cursor-pointer" onClick={() => { setSelectedRow(r); setSheetOpen(true) }}><TableCell className="text-xs font-mono">{String(r.id)}</TableCell><TableCell className="text-xs font-medium max-w-[150px] truncate">{String(r.name)}</TableCell><TableCell><SupplierCategoryBadge cat={String(r.category)} /></TableCell><TableCell><SupplierStatusBadge status={String(r.status)} /></TableCell><TableCell><RatingBar v={Number(r.rating)} /></TableCell><TableCell><CityBadge city={String(r.city)} /></TableCell><TableCell><ComplianceBar v={Number(r.compliance)} /></TableCell><TableCell><SpendTile v={Number(r.spend)} /></TableCell><TableCell><Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => { e.stopPropagation(); setSelectedRow(r); setSheetOpen(true) }}><Eye className="h-3.5 w-3.5" /></Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 2: Performance Scorecards */}
        <TabsContent value="2" className="sip-tab-scorecards flex flex-col gap-4 mt-4">
          <div className="flex gap-2 flex-wrap"><div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search scorecards..." className="sip-search h-8 text-sm pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><Select value={filterVal} onValueChange={setFilterVal}><SelectTrigger className="sip-filter h-8 text-sm w-40"><SelectValue /></SelectTrigger><SelectContent>{filterOpts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
          <Card className="sip-table-card overflow-hidden"><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><SortHeader col="id" label="ID" /><SortHeader col="supplier" label="Supplier" /><SortHeader col="metric" label="Metric" /><SortHeader col="score" label="Score" /><SortHeader col="grade" label="Grade" /><SortHeader col="trend" label="Trend" /><SortHeader col="period" label="Period" /><TableHead className="text-xs w-10" /></TableRow></TableHeader><TableBody>{filtered.slice(0, 25).map((r, i) => <TableRow key={i} className="sip-table-row hover:bg-accent/40 cursor-pointer" onClick={() => { setSelectedRow(r); setSheetOpen(true) }}><TableCell className="text-xs font-mono">{String(r.id)}</TableCell><TableCell className="text-xs font-medium max-w-[140px] truncate">{String(r.supplier)}</TableCell><TableCell><MetricTypeBadge m={String(r.metric)} /></TableCell><TableCell className="text-xs font-medium">{String(r.score)}%</TableCell><TableCell><GradeBadge g={String(r.grade)} /></TableCell><TableCell><TrendIndicator t={String(r.trend)} /></TableCell><TableCell className="text-xs text-muted-foreground">{String(r.period)}</TableCell><TableCell><Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => { e.stopPropagation(); setSelectedRow(r); setSheetOpen(true) }}><Eye className="h-3.5 w-3.5" /></Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 3: Risk Intelligence */}
        <TabsContent value="3" className="sip-tab-risks flex flex-col gap-4 mt-4">
          <div className="flex gap-2 flex-wrap"><div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search risks..." className="sip-search h-8 text-sm pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><Select value={filterVal} onValueChange={setFilterVal}><SelectTrigger className="sip-filter h-8 text-sm w-40"><SelectValue /></SelectTrigger><SelectContent>{filterOpts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
          <Card className="sip-table-card overflow-hidden"><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><SortHeader col="id" label="ID" /><SortHeader col="supplier" label="Supplier" /><SortHeader col="type" label="Type" /><SortHeader col="severity" label="Severity" /><SortHeader col="score" label="Score" /><SortHeader col="mitigation" label="Mitigation" /><SortHeader col="impact" label="Impact" /><SortHeader col="probability" label="Prob" /><SortHeader col="state" label="State" /><TableHead className="text-xs w-10" /></TableRow></TableHeader><TableBody>{filtered.slice(0, 25).map((r, i) => <TableRow key={i} className="sip-table-row hover:bg-accent/40 cursor-pointer" onClick={() => { setSelectedRow(r); setSheetOpen(true) }}><TableCell className="text-xs font-mono">{String(r.id)}</TableCell><TableCell className="text-xs font-medium max-w-[120px] truncate">{String(r.supplier)}</TableCell><TableCell><RiskTypeBadge t={String(r.type)} /></TableCell><TableCell><RiskSeverityBadge s={String(r.severity)} /></TableCell><TableCell><RiskScoreBar v={Number(r.score)} /></TableCell><TableCell className="text-xs">{String(r.mitigation)}</TableCell><TableCell><ImpactTile v={Number(r.impact)} /></TableCell><TableCell className="text-xs">{String(r.probability)}%</TableCell><TableCell className="text-xs text-muted-foreground">{String(r.state)}</TableCell><TableCell><Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => { e.stopPropagation(); setSelectedRow(r); setSheetOpen(true) }}><Eye className="h-3.5 w-3.5" /></Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 4: Contract Management */}
        <TabsContent value="4" className="sip-tab-contracts flex flex-col gap-4 mt-4">
          <div className="flex gap-2 flex-wrap"><div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search contracts..." className="sip-search h-8 text-sm pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><Select value={filterVal} onValueChange={setFilterVal}><SelectTrigger className="sip-filter h-8 text-sm w-40"><SelectValue /></SelectTrigger><SelectContent>{filterOpts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
          <Card className="sip-table-card overflow-hidden"><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><SortHeader col="id" label="ID" /><SortHeader col="supplier" label="Supplier" /><SortHeader col="type" label="Type" /><SortHeader col="status" label="Status" /><SortHeader col="value" label="Value" /><SortHeader col="start" label="Start" /><SortHeader col="end" label="End" /><SortHeader col="autoRenew" label="Auto" /><SortHeader col="slaCompliance" label="SLA" /><TableHead className="text-xs w-10" /></TableRow></TableHeader><TableBody>{filtered.slice(0, 25).map((r, i) => <TableRow key={i} className="sip-table-row hover:bg-accent/40 cursor-pointer" onClick={() => { setSelectedRow(r); setSheetOpen(true) }}><TableCell className="text-xs font-mono">{String(r.id)}</TableCell><TableCell className="text-xs font-medium max-w-[120px] truncate">{String(r.supplier)}</TableCell><TableCell><CTTypeBadge t={String(r.type)} /></TableCell><TableCell><ContractStatusBadge s={String(r.status)} /></TableCell><TableCell><ValueTile v={Number(r.value)} /></TableCell><TableCell className="text-xs text-muted-foreground whitespace-nowrap">{String(r.start)}</TableCell><TableCell className="text-xs text-muted-foreground whitespace-nowrap">{String(r.end)}</TableCell><TableCell>{r.autoRenew ? <Badge className="sip-auto-renew text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-1.5">Auto</Badge> : <span className="text-[10px] text-muted-foreground">Manual</span>}</TableCell><TableCell><ComplianceBar v={Number(r.slaCompliance)} /></TableCell><TableCell><Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => { e.stopPropagation(); setSelectedRow(r); setSheetOpen(true) }}><Eye className="h-3.5 w-3.5" /></Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 5: Intelligence Analytics */}
        <TabsContent value="5" className="sip-tab-analytics flex flex-col gap-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="sip-chart"><CardHeader className="pb-1"><CardTitle className="text-sm">Spend by Category</CardTitle><CardDescription className="text-[11px]">Procurement spend breakdown</CardDescription></CardHeader><CardContent><PieChart height={230}><Pie data={data.catPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name }: { name: string }) => <span className="text-[10px]">{name}</span>} labelLine={false}>{data.catPie.map((_, i) => <Cell key={i} fill={CC[i % CC.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="sip-chart"><CardHeader className="pb-1"><CardTitle className="text-sm">Performance Trend (12 Months)</CardTitle><CardDescription className="text-[11px]">Quality, Delivery & Cost</CardDescription></CardHeader><CardContent><AreaChart data={data.perfTrend} height={230}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="quality" stroke={C.blue} fill={C.blue} fillOpacity={0.15} /><Area type="monotone" dataKey="delivery" stroke={C.emerald} fill={C.emerald} fillOpacity={0.15} /><Area type="monotone" dataKey="cost" stroke={C.amber} fill={C.amber} fillOpacity={0.15} /></AreaChart></CardContent></Card>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="sip-chart"><CardHeader className="pb-1"><CardTitle className="text-sm">Risk Distribution by Type</CardTitle><CardDescription className="text-[11px]">Count per risk category</CardDescription></CardHeader><CardContent><BarChart data={data.riskDist} height={230}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="type" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={55} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill={C.rose} /></BarChart></CardContent></Card>
            <Card className="sip-chart"><CardHeader className="pb-1"><CardTitle className="text-sm">Regional Spend (\u20b9 Cr)</CardTitle><CardDescription className="text-[11px]">Across 8 Indian cities</CardDescription></CardHeader><CardContent><BarChart data={data.regionalSpend} layout="vertical" height={230}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="city" tick={{ fontSize: 11 }} width={85} /><Tooltip /><Bar dataKey="spend" fill={C.violet} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Sheet */}
      <Sheet open={!!(sheetOpen && selectedRow)} onOpenChange={open => { setSheetOpen(open); if (!open) setSelectedRow(null) }}>
        <SheetContent side="right" className="sip-sheet w-[440px] overflow-y-auto p-0">
          <SheetHeader className="sr-only"><SheetTitle>Detail View</SheetTitle><SheetDescription>Record details</SheetDescription></SheetHeader>
          <div className="h-28 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-5">
            <div className="flex items-center gap-1.5 text-white/60 text-[11px]"><CircleDot className="h-3 w-3" />Supplier Intelligence Portal</div>
            <p className="text-white font-bold text-base mt-1">{String(selectedRow?.id ?? "")}</p>
            <p className="text-white/80 text-sm mt-0.5">{String(selectedRow?.supplier ?? selectedRow?.name ?? "")}</p>
            <div className="flex items-center gap-1.5 mt-2 text-white/50 text-[11px]"><Clock className="h-3 w-3" />{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
          </div>
          <div className="p-5 space-y-1">
            {Object.entries(selectedRow ?? {}).filter(([k]) => k !== "id").map(([key, val]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-border/40">
                <span className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-xs font-medium">{renderVal(key, val)}</span>
              </div>
            ))}
            <Separator className="my-3" />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="sip-action h-8 text-xs gap-1" onClick={() => toast.success("Updated", `Record ${String(selectedRow?.id)} updated`)}><Zap className="h-3 w-3" />Update</Button>
              <Button size="sm" variant="outline" className="sip-action h-8 text-xs gap-1" onClick={() => toast.info("Exported", "Record exported to CSV")}><FileDown className="h-3 w-3" />Export</Button>
              <Button size="sm" variant="destructive" className="sip-action h-8 text-xs gap-1" onClick={() => { toast.error("Archived", `Record ${String(selectedRow?.id)} archived`); setSheetOpen(false) }}><AlertTriangle className="h-3 w-3" />Archive</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
