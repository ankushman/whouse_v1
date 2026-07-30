"use client"

import { useState, useMemo, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  Shield, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, FileText,
  Activity, Target, ArrowUpRight, ArrowDownRight, BarChart3, Scale, Users,
  Truck, Package, Warehouse,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { ExportButton } from "@/components/shared/export-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CC = { indigo: "#6366f1", emerald: "#059669", amber: "#d97706", sky: "#0284c7", rose: "#e11d48", green: "#16a34a", orange: "#ea580c", teal: "#0d9488", slate: "#475569", purple: "#7c3aed", blue: "#1e40af", cyan: "#06b6d4", lime: "#65a30d" }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const WAREHOUSES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Kolkata"]

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}

function generateData() {
  const r = seededRandom(191191191)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)]
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min

  const POLICY_TYPES = ["Marine Cargo", "Warehouse Liability", "Transit Insurance", "Goods-in-Transit", "Storage & Warehousing", "Comprehensive", "Third-Party Liability"]
  const CLAIM_STATUSES = ["Open", "Under Review", "Approved", "Rejected", "Settled", "Escalated"]
  const CLAIM_TYPES = ["Physical Damage", "Water Damage", "Theft", "Fire Damage", "Mishandling", "Delay", "Shortage", "Contamination"]
  const RISK_LEVELS = ["Low", "Medium", "High", "Critical"]
  const INSURERS = ["ICICI Lombard", "Bajaj Allianz", "HDFC ERGO", "New India Assurance", "National Insurance", "Tata AIG", "IFFCO Tokio", "Future Generali"]
  const CURRENCIES = ["INR", "USD", "EUR", "GBP"]
  const PRIORITIES = ["Low", "Medium", "High", "Urgent"]
  const SEVERITIES = ["Minor", "Moderate", "Major", "Catastrophic"]

  const policies = Array.from({ length: 60 }, (_, i) => ({
    id: `INS-${String(i + 1).padStart(4, "0")}`,
    policyNumber: `POL-${ri(2024, 2026)}-${String(i + 1).padStart(6, "0")}`,
    type: pick(POLICY_TYPES), insurer: pick(INSURERS), warehouse: pick(WAREHOUSES),
    sumInsured: ri(500000, 50000000), premium: ri(10000, 500000),
    deductible: ri(10000, 200000), status: pick(["Active", "Active", "Active", "Expired", "Pending Renewal"]),
    startDate: `${ri(1, 28)}/${pick(MONTHS)}/${ri(2023, 2025)}`,
    endDate: `${ri(1, 28)}/${pick(MONTHS)}/${ri(2025, 2027)}`,
    claimsCount: ri(0, 12), totalClaimed: ri(0, 5000000),
  }))

  const claims = Array.from({ length: 80 }, (_, i) => {
    const pol = pick(policies)
    const claimAmount = ri(5000, 3000000)
    const approved = claimAmount * (r() * 0.8 + 0.2)
    return {
      id: `CLM-${String(i + 1).padStart(5, "0")}`,
      policyId: pol.policyNumber, claimType: pick(CLAIM_TYPES),
      status: pick(CLAIM_STATUSES), priority: pick(PRIORITIES),
      warehouse: pol.warehouse, insurer: pol.insurer,
      claimAmount, approvedAmount: +(claimAmount >= 100000 ? approved : claimAmount).toFixed(0),
      filedDate: Date.now() - ri(1, 180) * 86400000,
      resolvedDate: r() > 0.5 ? Date.now() + ri(-90, 90) * 86400000 : null,
      description: pick(["Container damage during transit", "Water seepage in warehouse", "Pallet collapse during loading", "Fire damage to stored goods", "Theft from dock area", "Temperature excursion in cold chain", "Chemical contamination of batch", "Short delivery at destination"]),
      documentsCount: ri(2, 12), assessmentNotes: pick(["Under investigation", "Evidence reviewed", "Third party assessment pending", "Surveyor report received", "Awaiting insurer approval", "Document verification in progress"]),
      severity: pick(SEVERITIES),
    }
  })

  const riskAssessments = Array.from({ length: 50 }, (_, i) => ({
    id: `RSK-${String(i + 1).padStart(4, "0")}`,
    warehouse: pick(WAREHOUSES), category: pick(["Theft & Pilferage", "Fire", "Flood", "Natural Disaster", "Equipment Failure", "Handling Damage", "Temperature Risk", "Cyber Risk"]),
    riskLevel: pick(RISK_LEVELS), probability: ri(1, 100), impact: ri(1, 100),
    mitigationMeasure: pick(["CCTV + Guards", "Fire suppression system", "Flood barriers", "Earthquake retrofit", "Preventive maintenance", "Staff training", "Temperature monitoring", "Cyber security audit"]),
    residualRisk: ri(1, 60), lastAssessed: `${ri(1, 28)}/${pick(MONTHS)}/2024`,
    owner: pick(["R.K. Sharma", "A. Patel", "S. Krishnan", "M. Gupta", "P. Singh", "V. Reddy"]),
  }))

  const payments = Array.from({ length: 40 }, (_, i) => ({
    id: `PAY-${String(i + 1).padStart(4, "0")}`,
    claimId: pick(claims).id, insurer: pick(INSURERS),
    amount: ri(10000, 5000000), status: pick(["Paid", "Pending", "Processing", "Rejected", "Partial"]),
    method: pick(["NEFT", "RTGS", "Cheque", "Wire Transfer"]),
    initiatedDate: Date.now() - ri(1, 120) * 86400000,
    completedDate: r() > 0.4 ? Date.now() - ri(0, 60) * 86400000 : null,
  }))

  const monthlyClaims = MONTHS.map(m => ({ month: m, filed: ri(5, 25), settled: ri(3, 20), rejected: ri(0, 5), avgAmount: ri(50000, 500000) }))
  const claimTypeData = CLAIM_TYPES.map(t => ({ type: t, value: ri(5, 20) }))
  const claimStatusData = CLAIM_STATUSES.map(s => ({ status: s, value: ri(5, 25) }))
  const riskRadarData = WAREHOUSES.map(w => ({ warehouse: w, theft: ri(20, 80), fire: ri(10, 60), flood: ri(15, 70), handling: ri(25, 75), natural: ri(5, 40), cyber: ri(10, 50) }))
  const premiumTrend = MONTHS.map(m => ({ month: m, paid: ri(800000, 2500000), claims: ri(200000, 1500000), net: 0 }))
  premiumTrend.forEach(m => { m.net = m.paid - m.claims })
  const lossRatioTrend = MONTHS.map(m => ({ month: m, ratio: +(r() * 60 + 30).toFixed(1), target: 65 }))

  return {
    policies, claims, riskAssessments, payments,
    monthlyClaims, claimTypeData, claimStatusData, riskRadarData, premiumTrend, lossRatioTrend,
    POLICY_TYPES, CLAIM_STATUSES, CLAIM_TYPES, RISK_LEVELS, INSURERS, PRIORITIES, SEVERITIES, WAREHOUSES,
  }
}

// ── Unique Visual Components ──
function RiskScoreBar({ probability, impact }: { probability: number; impact: number }) {
  const score = Math.round((probability * 0.4 + impact * 0.6))
  const color = score < 30 ? CC.emerald : score < 60 ? CC.amber : score < 80 ? CC.orange : CC.rose
  return (
    <div className="cig-risk-bar space-y-1">
      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Risk Score</span><span className="font-bold" style={{ color }}>{score}</span></div>
      <div className="w-full h-2 rounded bg-muted overflow-hidden"><div className="h-full rounded transition-all" style={{ width: `${Math.min(score, 100)}%`, background: color }} /></div>
      <div className="flex justify-between text-[9px] text-muted-foreground"><span>Prob: {probability}%</span><span>Impact: {impact}%</span></div>
    </div>
  )
}

function ClaimProgressTracker({ status }: { status: string }) {
  const steps = ["Open", "Under Review", "Approved", "Settled"]
  const idx = steps.indexOf(status) >= 0 ? steps.indexOf(status) : status === "Rejected" ? -1 : status === "Escalated" ? 1 : 0
  return (
    <div className="cig-progress-tracker flex items-center gap-1 px-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2",
            i < idx ? "bg-emerald-500 border-emerald-500 text-white" : i === idx ? "bg-indigo-500 border-indigo-500 text-white" : "bg-muted border-muted-foreground/30 text-muted-foreground"
          )}>{i < idx ? "\u2713" : i + 1}</div>
          {i < steps.length - 1 && <div className={cn("w-6 h-0.5", i < idx ? "bg-emerald-500" : "bg-muted-foreground/20")} />}
        </div>
      ))}
    </div>
  )
}

function PayoutBar({ claimed, approved }: { claimed: number; approved: number }) {
  const pct = claimed > 0 ? Math.round(approved / claimed * 100) : 0
  const color = pct >= 80 ? CC.emerald : pct >= 50 ? CC.amber : CC.rose
  return (
    <div className="cig-payout-bar space-y-1 px-2">
      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Settlement Ratio</span><span className="font-bold" style={{ color }}>{pct}%</span></div>
      <div className="w-full h-3 rounded bg-muted overflow-hidden relative">
        <div className="absolute inset-0 h-full rounded bg-rose-200 dark:bg-rose-900/30" />
        <div className="absolute top-0 left-0 h-full rounded transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground"><span>Claimed: {fmtINR(claimed)}</span><span>Approved: {fmtINR(approved)}</span></div>
    </div>
  )
}

function SeverityIndicator({ severity }: { severity: string }) {
  const config: Record<string, { color: string; bg: string; icon: string }> = {
    Minor: { color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: "\u25CF" },
    Moderate: { color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30", icon: "\u25CF" },
    Major: { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30", icon: "\u25CF" },
    Catastrophic: { color: "text-rose-600", bg: "bg-rose-100 dark:bg-rose-900/30", icon: "\u25C9" },
  }
  const c = config[severity] || config.Minor
  return <span className={cn("cig-severity text-[10px] font-medium px-1.5 py-0.5 rounded", c.bg, c.color)}>{c.icon} {severity}</span>
}

function PolicyCoverageBar({ sumInsured, premium }: { sumInsured: number; premium: number }) {
  const ratio = sumInsured > 0 ? (premium / sumInsured * 100) : 0
  return (
    <div className="cig-coverage-bar space-y-1 px-2">
      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Premium Rate</span><span className="font-medium text-indigo-600">{ratio.toFixed(2)}%</span></div>
      <div className="w-full h-2 rounded bg-muted overflow-hidden"><div className="h-full rounded bg-indigo-500 transition-all" style={{ width: `${Math.min(ratio * 5, 100)}%` }} /></div>
      <div className="flex justify-between text-[9px] text-muted-foreground"><span>Sum Insured: {fmtINR(sumInsured)}</span><span>Premium: {fmtINR(premium)}</span></div>
    </div>
  )
}

// Badge Helpers
function SBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Open: "bg-sky-100 text-sky-700", "Under Review": "bg-amber-100 text-amber-700", Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700", Settled: "bg-emerald-100 text-emerald-700", Escalated: "bg-slate-800 text-white",
    Active: "bg-emerald-100 text-emerald-700", Expired: "bg-rose-100 text-rose-700", "Pending Renewal": "bg-amber-100 text-amber-700",
    Paid: "bg-emerald-100 text-emerald-700", Pending: "bg-amber-100 text-amber-700", Processing: "bg-blue-100 text-blue-700",
    Partial: "bg-orange-100 text-orange-700", Low: "bg-emerald-100 text-emerald-700", Medium: "bg-amber-100 text-amber-700",
    High: "bg-orange-100 text-orange-700", Urgent: "bg-slate-800 text-white",
  }
  return <Badge variant="outline" className={cn("cig-sbadge text-[10px] px-2 py-0.5", m[status] || "")}>{status}</Badge>
}

function RiskBadge({ level }: { level: string }) {
  const m: Record<string, string> = { Low: "bg-emerald-100 text-emerald-700", Medium: "bg-amber-100 text-amber-700", High: "bg-orange-100 text-orange-700", Critical: "bg-slate-800 text-white" }
  return <Badge className={cn("cig-risk-badge text-[10px] px-2 font-medium", m[level] || "")}>{level}</Badge>
}

const sheetGrad = "bg-gradient-to-r from-[#6366f1] to-[#059669] text-white"
const fmtINR = (v: number) => `\u20b9${(v / 100000).toFixed(1)}L`
const fmtDate = (ts: number | null) => ts ? new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "\u2014"

export default function CargoInsuranceClaimsView() {
  const data = useMemo(() => generateData(), [])
  const [tab, setTab] = useState("0")
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState("")
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()

  const sortFn = <T extends Record<string, any>>(items: T[], key: any) => {
    const s = [...items].sort((a, b) => { const va = a[key], vb = b[key]; return va < vb ? -1 : va > vb ? 1 : 0 })
    return sortDir === "asc" ? s : s.reverse()
  }

  const SH = ({ label, field }: { label: string; field: any }) => (
    <TableHead className="cursor-pointer select-none text-[11px]" onClick={() => { if (sortBy === field) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortBy(field); setSortDir("asc") } }}>
      <span className="cig-sort-head flex items-center gap-1">{label} {sortBy === field && (sortDir === "asc" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}</span>
    </TableHead>
  )

  const ActBtn = ({ d, t }: { d: any; t: string }) => (
    <Button variant="ghost" size="sm" className="cig-view-btn h-6 text-[10px]" onClick={() => { setDrawerData(d); setDrawerType(t) }}><Activity className="h-3 w-3 mr-1" />View</Button>
  )

  const DrawerActions = ({ id, name }: { id: string; name: string }) => (
    <div className="flex gap-2 pt-2">
      {[{ label: "Edit", icon: Scale }, { label: "Details", icon: Target }, { label: "Report", icon: BarChart3 }].map(a => (
        <Button key={a.label} variant="outline" size="sm" className="cig-action-btn flex-1 text-xs h-8" onClick={() => toast.success(a.label, `${id} ${a.label.toLowerCase()} action triggered`)}><a.icon className="h-3 w-3 mr-1" />{a.label}</Button>
      ))}
    </div>
  )

  const DrawerHeader = ({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) => (
    <SheetHeader className={cn("cig-drawer-header rounded-lg p-4 -mx-6 -mt-6 mb-4", sheetGrad)}>
      <SheetTitle className="text-white text-sm">{title}</SheetTitle>
      {desc && <SheetDescription className="text-emerald-100 mt-1">{desc}</SheetDescription>}
      {children && <SheetDescription className="text-emerald-100 flex flex-wrap gap-1.5 mt-1">{children}</SheetDescription>}
    </SheetHeader>
  )

  const InfoGrid = ({ items }: { items: [string, string][] }) => (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {items.map(([l, v]) => (<div key={l} className="flex justify-between p-1.5 rounded bg-muted/50"><span className="text-muted-foreground">{l}</span><span className="font-medium">{v}</span></div>))}
    </div>
  )

  // Tab 0: Dashboard
  const DashboardTab = () => {
    const totalClaims = data.claims.length
    const totalClaimedAmt = data.claims.reduce((a, c) => a + c.claimAmount, 0)
    const totalApprovedAmt = data.claims.reduce((a, c) => a + c.approvedAmount, 0)
    const settlementRate = Math.round(totalApprovedAmt / totalClaimedAmt * 100)
    const activePolicies = data.policies.filter(p => p.status === "Active").length
    const highRisks = data.riskAssessments.filter(r => r.riskLevel === "High" || r.riskLevel === "Critical").length
    const kpis = [
      { label: "Active Policies", value: `${activePolicies}/${data.policies.length}`, icon: Shield, color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Open Claims", value: data.claims.filter(c => c.status === "Open" || c.status === "Under Review").length.toString(), icon: FileText, color: "text-sky-600", bg: "bg-sky-50" },
      { label: "Total Claimed", value: fmtINR(totalClaimedAmt), icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Settlement Rate", value: `${settlementRate}%`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Avg Resolution", value: "23 days", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
      { label: "High Risks", value: highRisks.toString(), icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
    ]
    return (
      <div className="cig-dashboard space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map(k => (
            <Card key={k.label} className="cig-kpi-card border-border/60"><CardContent className="p-4 flex items-center gap-3">
              <div className={cn("cig-kpi-icon p-2 rounded-lg", k.bg)}><k.icon className={cn("h-4 w-4", k.color)} /></div>
              <div><p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></div>
            </CardContent></Card>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cig-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Claims Trend</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><BarChart data={data.monthlyClaims}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="filed" fill={CC.indigo} radius={[2, 2, 0, 0]} name="Filed" /><Bar dataKey="settled" fill={CC.emerald} radius={[2, 2, 0, 0]} name="Settled" /><Bar dataKey="rejected" fill={CC.rose} radius={[2, 2, 0, 0]} name="Rejected" />
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="cig-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Claim Type Distribution</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><PieChart>
              <Pie data={data.claimTypeData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" paddingAngle={2}>
                {[CC.indigo, CC.sky, CC.amber, CC.rose, CC.orange, CC.teal, CC.purple, CC.emerald].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
            </PieChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="cig-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Risk Radar</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><RadarChart data={data.riskRadarData}>
              <PolarGrid stroke="#e5e7eb" /><PolarAngleAxis dataKey="warehouse" tick={{ fontSize: 9 }} /><PolarRadiusAxis tick={{ fontSize: 8 }} />
              <Radar name="Theft" dataKey="theft" stroke={CC.indigo} fill={CC.indigo} fillOpacity={0.1} />
              <Radar name="Fire" dataKey="fire" stroke={CC.rose} fill={CC.rose} fillOpacity={0.1} />
              <Radar name="Flood" dataKey="flood" stroke={CC.sky} fill={CC.sky} fillOpacity={0.1} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} /><Tooltip contentStyle={{ fontSize: 11 }} />
            </RadarChart></ResponsiveContainer>
          </CardContent></Card>
        </div>
        <Card className="cig-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Loss Ratio Trend (Claims/Premium)</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={200}><LineChart data={data.lossRatioTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis domain={[20, 100]} tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="ratio" stroke={CC.indigo} strokeWidth={2} dot={{ r: 3 }} name="Loss Ratio %" />
            <Line type="monotone" dataKey="target" stroke={CC.rose} strokeDasharray="5 5" strokeWidth={2} name="Target 65%" />
          </LineChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
    )
  }

  // Tab 1: Policies
  const PoliciesTab = () => {
    const rows = sortFn(data.policies.filter(p => {
      if (search && !p.policyNumber.toLowerCase().includes(search.toLowerCase()) && !p.warehouse.toLowerCase().includes(search.toLowerCase())) return false
      if (filterType !== "all" && p.type !== filterType) return false
      if (filterStatus !== "all" && p.status !== filterStatus) return false
      return true
    }), sortBy)
    return (
      <div className="cig-policies-tab space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search policies..." value={search} onChange={e => setSearch(e.target.value)} className="cig-search h-8 text-xs w-60" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="cig-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Types</option>{data.POLICY_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="cig-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{["Active", "Expired", "Pending Renewal"].map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><SH label="Policy #" field="policyNumber" /><TableHead className="text-[11px]">Type</TableHead><TableHead className="text-[11px]">Insurer</TableHead><TableHead className="text-[11px]">Warehouse</TableHead><SH label="Sum Insured" field="sumInsured" /><SH label="Premium" field="premium" /><TableHead className="text-[11px]">Claims</TableHead><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(p => (
          <TableRow key={p.id} className="cig-policy-row">
            <TableCell className="text-xs font-mono">{p.id}</TableCell><TableCell className="text-[10px] font-mono">{p.policyNumber}</TableCell>
            <TableCell className="text-[10px]">{p.type}</TableCell><TableCell className="text-[10px]">{p.insurer}</TableCell><TableCell className="text-[10px]">{p.warehouse}</TableCell>
            <TableCell className="text-xs">{fmtINR(p.sumInsured)}</TableCell><TableCell className="text-xs">{fmtINR(p.premium)}</TableCell>
            <TableCell className="text-xs">{p.claimsCount}</TableCell><TableCell><SBadge status={p.status} /></TableCell><ActBtn d={p} t="policy" />
          </TableRow>
        ))}</TableBody></Table></div>
        <p className="text-xs text-muted-foreground">Showing {Math.min(rows.length, 15)} of {rows.length} policies</p>
      </div>
    )
  }

  // Tab 2: Claims
  const ClaimsTab = () => {
    const [fp, setFp] = useState("all")
    const rows = sortFn(data.claims.filter(c => {
      if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.warehouse.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== "all" && c.status !== filterStatus) return false
      if (fp !== "all" && c.priority !== fp) return false
      return true
    }), sortBy)
    return (
      <div className="cig-claims-tab space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search claims..." value={search} onChange={e => setSearch(e.target.value)} className="cig-search h-8 text-xs w-60" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="cig-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{data.CLAIM_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
          <select value={fp} onChange={e => setFp(e.target.value)} className="cig-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Priority</option>{data.PRIORITIES.map(p => <option key={p}>{p}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-[480px] overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="Claim ID" field="id" /><SH label="Policy #" field="policyId" /><TableHead className="text-[11px]">Type</TableHead><TableHead className="text-[11px]">Warehouse</TableHead><TableHead className="text-[11px]">Severity</TableHead><SH label="Claimed" field="claimAmount" /><SH label="Approved" field="approvedAmount" /><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Priority</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 20).map(c => (
          <TableRow key={c.id} className="cig-claim-row">
            <TableCell className="text-xs font-mono">{c.id}</TableCell><TableCell className="text-[9px] font-mono">{c.policyId}</TableCell>
            <TableCell className="text-[10px]">{c.claimType}</TableCell><TableCell className="text-[10px]">{c.warehouse}</TableCell>
            <TableCell><SeverityIndicator severity={c.severity} /></TableCell>
            <TableCell className="text-xs">{fmtINR(c.claimAmount)}</TableCell><TableCell className="text-xs">{fmtINR(c.approvedAmount)}</TableCell>
            <TableCell><SBadge status={c.status} /></TableCell><SBadge status={c.priority} /><ActBtn d={c} t="claim" />
          </TableRow>
        ))}</TableBody></Table></div>
        <p className="text-xs text-muted-foreground">Showing {Math.min(rows.length, 20)} of {rows.length} claims</p>
      </div>
    )
  }

  // Tab 3: Risk Assessment
  const RiskTab = () => {
    const [fr, setFr] = useState("all")
    const rows = sortFn(data.riskAssessments.filter(r => {
      if (search && !r.warehouse.toLowerCase().includes(search.toLowerCase()) && !r.category.toLowerCase().includes(search.toLowerCase())) return false
      if (fr !== "all" && r.riskLevel !== fr) return false
      return true
    }), sortBy)
    return (
      <div className="cig-risk-tab space-y-4">
        <Card className="cig-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Premium vs Claims Trend</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={200}><AreaChart data={data.premiumTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            <Area type="monotone" dataKey="paid" stroke={CC.indigo} fill={CC.indigo} fillOpacity={0.3} name="Premium Paid" />
            <Area type="monotone" dataKey="claims" stroke={CC.rose} fill={CC.rose} fillOpacity={0.3} name="Claims Paid" />
          </AreaChart></ResponsiveContainer>
        </CardContent></Card>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search risks..." value={search} onChange={e => setSearch(e.target.value)} className="cig-search h-8 text-xs w-60" />
          <select value={fr} onChange={e => setFr(e.target.value)} className="cig-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Levels</option>{data.RISK_LEVELS.map(l => <option key={l}>{l}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><TableHead className="text-[11px]">Warehouse</TableHead><TableHead className="text-[11px]">Category</TableHead><TableHead className="text-[11px]">Risk Level</TableHead><SH label="Prob. %" field="probability" /><SH label="Impact %" field="impact" /><SH label="Residual" field="residualRisk" /><TableHead className="text-[11px]">Mitigation</TableHead><TableHead className="text-[11px]">Owner</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(r => (
          <TableRow key={r.id} className="cig-risk-row">
            <TableCell className="text-xs font-mono">{r.id}</TableCell><TableCell className="text-[10px]">{r.warehouse}</TableCell>
            <TableCell className="text-[10px]">{r.category}</TableCell><RiskBadge level={r.riskLevel} />
            <TableCell className="text-xs">{r.probability}%</TableCell><TableCell className="text-xs">{r.impact}%</TableCell>
            <TableCell><Badge className={cn("text-[10px]", r.residualRisk < 25 ? "bg-emerald-100 text-emerald-700" : r.residualRisk < 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")}>{r.residualRisk}%</Badge></TableCell>
            <TableCell className="text-[10px] max-w-[120px] truncate">{r.mitigationMeasure}</TableCell>
            <TableCell className="text-[10px]">{r.owner}</TableCell><ActBtn d={r} t="risk" />
          </TableRow>
        ))}</TableBody></Table></div>
      </div>
    )
  }

  // Tab 4: Payments
  const PaymentsTab = () => {
    const [fm, setFm] = useState("all")
    const rows = sortFn(data.payments.filter(p => {
      if (search && !p.claimId.toLowerCase().includes(search.toLowerCase())) return false
      if (fm !== "all" && p.status !== fm) return false
      return true
    }), sortBy)
    return (
      <div className="cig-payments-tab space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          {[{ label: "Total Paid", value: fmtINR(data.payments.filter(p => p.status === "Paid").reduce((a, p) => a + p.amount, 0)), color: "text-emerald-600" },
            { label: "Pending", value: fmtINR(data.payments.filter(p => p.status === "Pending" || p.status === "Processing").reduce((a, p) => a + p.amount, 0)), color: "text-amber-600" },
            { label: "Avg Payout", value: fmtINR(Math.round(data.payments.reduce((a, p) => a + p.amount, 0) / data.payments.length)), color: "text-indigo-600" },
            { label: "Total Payments", value: data.payments.length.toString(), color: "text-sky-600" },
          ].map(s => (<Card key={s.label} className="cig-stat-card border-border/60"><CardContent className="p-4 text-center"><p className="text-[10px] text-muted-foreground">{s.label}</p><p className={cn("text-xl font-bold", s.color)}>{s.value}</p></CardContent></Card>))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className="cig-search h-8 text-xs w-60" />
          <select value={fm} onChange={e => setFm(e.target.value)} className="cig-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{["Paid", "Pending", "Processing", "Rejected", "Partial"].map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><SH label="Claim ID" field="claimId" /><TableHead className="text-[11px]">Insurer</TableHead><SH label="Amount" field="amount" /><TableHead className="text-[11px]">Method</TableHead><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Initiated</TableHead><TableHead className="text-[11px]">Completed</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(p => (
          <TableRow key={p.id} className="cig-payment-row">
            <TableCell className="text-xs font-mono">{p.id}</TableCell><TableCell className="text-[10px] font-mono">{p.claimId}</TableCell>
            <TableCell className="text-[10px]">{p.insurer}</TableCell><TableCell className="text-xs font-medium">{fmtINR(p.amount)}</TableCell>
            <TableCell><Badge variant="outline" className="text-[10px]">{p.method}</Badge></TableCell><SBadge status={p.status} />
            <TableCell className="text-[10px]">{fmtDate(p.initiatedDate)}</TableCell><TableCell className="text-[10px]">{fmtDate(p.completedDate)}</TableCell><ActBtn d={p} t="payment" />
          </TableRow>
        ))}</TableBody></Table></div>
      </div>
    )
  }

  // Tab 5: Analytics
  const AnalyticsTab = () => (
    <div className="cig-analytics-tab space-y-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Claims Filed (YTD)", value: data.monthlyClaims.reduce((a, m) => a + m.filed, 0), icon: FileText, color: "text-indigo-600" },
          { label: "Claims Settled", value: data.monthlyClaims.reduce((a, m) => a + m.settled, 0), icon: CheckCircle, color: "text-emerald-600" },
          { label: "Rejection Rate", value: `${Math.round(data.monthlyClaims.reduce((a, m) => a + m.rejected, 0) / data.monthlyClaims.reduce((a, m) => a + m.filed, 0) * 100)}%`, icon: AlertTriangle, color: "text-rose-600" },
          { label: "Avg Claim Amount", value: fmtINR(Math.round(data.claims.reduce((a, c) => a + c.claimAmount, 0) / data.claims.length)), icon: DollarSign, color: "text-amber-600" },
        ].map(s => (<Card key={s.label} className="cig-analytics-stat border-border/60"><CardContent className="p-4 flex items-center gap-3"><s.icon className={cn("h-5 w-5", s.color)} /><div><p className="text-[10px] text-muted-foreground">{s.label}</p><p className={cn("text-lg font-bold", s.color)}>{s.value}</p></div></CardContent></Card>))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="cig-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Claim Status Breakdown</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={220}><PieChart>
            <Pie data={data.claimStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
              {[CC.sky, CC.amber, CC.emerald, CC.rose, CC.indigo, CC.slate].map((c, i) => <Cell key={i} fill={c} />)}
            </Pie><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
          </PieChart></ResponsiveContainer>
        </CardContent></Card>
        <Card className="cig-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Avg Claim Amount by Month</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={220}><LineChart data={data.monthlyClaims}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="avgAmount" stroke={CC.indigo} strokeWidth={2} dot={{ r: 3 }} name="Avg Amount" />
          </LineChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
      <Card className="cig-chart-card border-border/60"><CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">Insurer Performance Summary</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.INSURERS.slice(0, 8).map(ins => {
            const insClaims = data.claims.filter(c => c.insurer === ins)
            const settled = insClaims.filter(c => c.status === "Settled" || c.status === "Approved").length
            const rate = insClaims.length > 0 ? Math.round(settled / insClaims.length * 100) : 0
            return (
              <div key={ins} className="cig-insurer-card p-3 rounded-lg border border-border/60 hover:shadow-sm transition-shadow">
                <p className="text-xs font-medium">{ins}</p>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>Claims: {insClaims.length}</span><span className={cn("font-medium", rate >= 70 ? "text-emerald-600" : rate >= 40 ? "text-amber-600" : "text-rose-600")}>{rate}% settled</span></div>
                <div className="w-full h-1.5 rounded bg-muted mt-1"><div className="h-full rounded" style={{ width: `${rate}%`, background: rate >= 70 ? CC.emerald : rate >= 40 ? CC.amber : CC.rose }} /></div>
              </div>
            )
          })}
        </div>
      </CardContent></Card>
    </div>
  )

  const open = !!drawerData
  const close = () => setDrawerData(null)

  return (
    <div className="cig-root space-y-6">
      <PageHeader title="Cargo Insurance & Claims" description="Manage insurance policies, claims processing, risk assessment, and cargo damage tracking" actions={<ExportButton data={data.policies.map(p => ({ ID: p.id, Policy: p.policyNumber, Type: p.type, Insurer: p.insurer, "Sum Insured": p.sumInsured, Premium: p.premium, Status: p.status }))} filename="insurance-policies" />} />
      <Tabs value={tab} onValueChange={v => { setTab(v); setSearch(""); setFilterType("all"); setFilterStatus("all") }}>
        <TabsList className="flex-wrap h-auto gap-1">
          {[{ v: "0", l: "Insurance Dashboard" }, { v: "1", l: "Policies" }, { v: "2", l: "Claims" }, { v: "3", l: "Risk Assessment" }, { v: "4", l: "Payments" }, { v: "5", l: "Analytics" }].map(t => <TabsTrigger key={t.v} value={t.v} className="cig-tab-trigger text-xs h-7 px-3">{t.l}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {tab === "0" && <DashboardTab />}
      {tab === "1" && <PoliciesTab />}
      {tab === "2" && <ClaimsTab />}
      {tab === "3" && <RiskTab />}
      {tab === "4" && <PaymentsTab />}
      {tab === "5" && <AnalyticsTab />}

      {/* Policy Drawer */}
      <Sheet open={open && drawerType === "policy"} onOpenChange={close}><SheetContent className="cig-policy-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.policyNumber}`} >
          <Badge className="bg-white/20 text-white text-[10px] border-0">{drawerData.type}</Badge><SBadge status={drawerData.status} />
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <Card className="border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">Coverage</p><PolicyCoverageBar sumInsured={drawerData.sumInsured} premium={drawerData.premium} /></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Claims", value: drawerData.claimsCount.toString() },
            { label: "Total Claimed", value: fmtINR(drawerData.totalClaimed) },
            { label: "Deductible", value: fmtINR(drawerData.deductible) },
          ].map(m => (<Card key={m.label} className="border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-indigo-700">{m.value}</p></CardContent></Card>))}</div>
          <InfoGrid items={[["Insurer", drawerData.insurer], ["Warehouse", drawerData.warehouse], ["Start Date", drawerData.startDate], ["End Date", drawerData.endDate], ["Status", drawerData.status], ["ID", drawerData.id]]} />
          <DrawerActions id={drawerData.id} name={drawerData.policyNumber} />
        </div></>}
      </SheetContent></Sheet>

      {/* Claim Drawer */}
      <Sheet open={open && drawerType === "claim"} onOpenChange={close}><SheetContent className="cig-claim-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.id}`} >
          <Badge className="bg-white/20 text-white text-[10px] border-0">{drawerData.claimType}</Badge><SBadge status={drawerData.status} /><SBadge status={drawerData.priority} />
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <Card className="border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-2">Claim Progress</p><ClaimProgressTracker status={drawerData.status} /></CardContent></Card>
          <Card className="border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">Payout Analysis</p><PayoutBar claimed={drawerData.claimAmount} approved={drawerData.approvedAmount} /></CardContent></Card>
          <div className="p-3 rounded-lg bg-muted/50 text-xs"><p className="text-[10px] text-muted-foreground">Description</p><p className="mt-1">{drawerData.description}</p></div>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Claimed", value: fmtINR(drawerData.claimAmount) },
            { label: "Approved", value: fmtINR(drawerData.approvedAmount) },
            { label: "Documents", value: `${drawerData.documentsCount} files` },
          ].map(m => (<Card key={m.label} className="border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-sky-700">{m.value}</p></CardContent></Card>))}</div>
          <InfoGrid items={[["Policy", drawerData.policyId], ["Warehouse", drawerData.warehouse], ["Insurer", drawerData.insurer], ["Filed", fmtDate(drawerData.filedDate)], ["Resolved", fmtDate(drawerData.resolvedDate)], ["Severity", drawerData.severity], ["Assessment", drawerData.assessmentNotes]]} />
          <DrawerActions id={drawerData.id} name={drawerData.id} />
        </div></>}
      </SheetContent></Sheet>

      {/* Risk Drawer */}
      <Sheet open={open && drawerType === "risk"} onOpenChange={close}><SheetContent className="cig-risk-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.id} — ${drawerData.warehouse}`} >
          <RiskBadge level={drawerData.riskLevel} /><Badge className="bg-white/20 text-white text-[10px] border-0">{drawerData.category}</Badge>
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <Card className="border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">Risk Score</p><RiskScoreBar probability={drawerData.probability} impact={drawerData.impact} /></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Probability", value: `${drawerData.probability}%` },
            { label: "Impact", value: `${drawerData.impact}%` },
            { label: "Residual", value: `${drawerData.residualRisk}%` },
          ].map(m => (<Card key={m.label} className="border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-amber-700">{m.value}</p></CardContent></Card>))}</div>
          <InfoGrid items={[["Warehouse", drawerData.warehouse], ["Category", drawerData.category], ["Mitigation", drawerData.mitigationMeasure], ["Owner", drawerData.owner], ["Last Assessed", drawerData.lastAssessed], ["Risk Level", drawerData.riskLevel]]} />
          <DrawerActions id={drawerData.id} name={drawerData.category} />
        </div></>}
      </SheetContent></Sheet>

      {/* Payment Drawer */}
      <Sheet open={open && drawerType === "payment"} onOpenChange={close}><SheetContent className="cig-payment-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.id}`} >
          <SBadge status={drawerData.status} /><Badge className="bg-white/20 text-white text-[10px] border-0">{drawerData.method}</Badge>
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Amount", value: fmtINR(drawerData.amount) },
            { label: "Method", value: drawerData.method },
            { label: "Status", value: drawerData.status },
          ].map(m => (<Card key={m.label} className="border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-emerald-700">{m.value}</p></CardContent></Card>))}</div>
          <InfoGrid items={[["Claim ID", drawerData.claimId], ["Insurer", drawerData.insurer], ["Initiated", fmtDate(drawerData.initiatedDate)], ["Completed", fmtDate(drawerData.completedDate)], ["Amount", fmtINR(drawerData.amount)], ["Status", drawerData.status]]} />
          <DrawerActions id={drawerData.id} name={drawerData.claimId} />
        </div></>}
      </SheetContent></Sheet>
    </div>
  )
}
