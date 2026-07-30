"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, FlaskConical, AlertTriangle, CheckCircle2, Route, Activity, Thermometer, ShieldCheck, ShieldAlert, Clock, DollarSign, Microscope, TestTubes, RotateCcw, XCircle, ThumbsUp, ThumbsDown } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const RETURN_REASONS = ["defective", "wrong_item", "damaged", "quality_fail", "expired", "customer_change", "warranty", "recall"] as const
const INSPECTION_STATUS = ["pending", "in_progress", "passed", "failed", "quarantine", "disposed"] as const
const TEST_TYPES = ["visual", "functional", "dimensional", "electrical", "chemical", "stress_test", "drop_test", "leak_test"] as const
const SEVERITY = ["critical", "major", "minor", "cosmetic"] as const
const WAREHOUSES = ["Mumbai DC-1", "Delhi DC-2", "Bangalore DC-3", "Chennai DC-4", "Hyderabad DC-5", "Pune DC-6"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#ec4899", sec: "#8b5cf6", ter: "#f59e0b", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#ec4899", "#8b5cf6", "#059669", "#f59e0b", "#dc2626", "#14b8a6", "#3b82f6", "#f97316"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function ReasonBadge({ reason }: { reason: string }) {
  const cols: Record<string, string> = { defective: "bg-red-100 text-red-700 dark:bg-red-900/30", wrong_item: "bg-amber-100 text-amber-700", damaged: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", quality_fail: "rql-quality-fail bg-violet-100 text-violet-700 dark:bg-violet-900/30", expired: "bg-gray-100 text-gray-600", customer_change: "bg-blue-100 text-blue-700", warranty: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", recall: "rql-recall bg-rose-100 text-rose-700 dark:bg-rose-900/30 shadow-[0_0_6px_rgba(244,63,94,0.3)]" }
  return <span className={"rql-reason-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[reason] || "bg-gray-100 text-gray-700")}>{reason.replace(/_/g, " ")}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { pending: "rql-pending bg-gray-200 text-gray-600 dark:bg-gray-700", in_progress: "rql-in-progress bg-blue-100 text-blue-700 dark:bg-blue-900/30 shadow-[0_0_6px_rgba(59,130,246,0.3)]", passed: "rql-passed bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", failed: "rql-failed bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]", quarantine: "rql-quarantine bg-amber-100 text-amber-700 dark:bg-amber-900/30 shadow-[0_0_6px_rgba(217,119,6,0.3)]", disposed: "bg-gray-300 text-gray-500" }
  return <span className={"rql-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function TestBadge({ type }: { type: string }) {
  return <span className={"rql-test-badge inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30"}>{type.replace(/_/g, " ")}</span>
}

function SeverityBadge({ sev }: { sev: string }) {
  const cols: Record<string, string> = { critical: "rql-critical bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]", major: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", minor: "bg-amber-100 text-amber-700", cosmetic: "bg-gray-100 text-gray-600" }
  return <span className={"rql-severity-badge inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase " + (cols[sev] || "")}>{sev}</span>
}

function ScoreBar({ value }: { value: number }) {
  const col = value >= 80 ? TH.ok : value >= 50 ? TH.warn : TH.err
  return <div className="rql-score-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}/100</span></div>
}

function HealthRing({ pct, label, color }: { pct: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, off = c - (pct / 100) * c
  return <div className="rql-health-ring flex flex-col items-center"><svg width="68" height="68" viewBox="0 0 68 68"><circle cx="34" cy="34" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6"/><circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 34 34)" className="transition-all duration-700"/><text x="34" y="38" textAnchor="middle" className="text-[11px] font-bold" fill={color}>{pct}%</text></svg><span className="text-[9px] text-gray-500 mt-0.5">{label}</span></div>
}

function KpiTile({ label, value, change, icon: Icon }: { label: string; value: string; change: number; icon: React.ComponentType<{ className?: string }> }) {
  return <div className="rql-kpi-tile bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-center justify-between mb-2"><span className="text-[11px] font-medium text-gray-500">{label}</span><Icon className="w-4 h-4 text-pink-500"/></div><div className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</div><div className={"flex items-center gap-1 mt-1 text-[10px] font-semibold " + (change >= 0 ? "text-emerald-600" : "text-red-500")}><span>{change >= 0 ? "+" : ""}{change}%</span></div></div>
}

function ValueTile({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="rql-value-tile bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"><div className="text-[10px] text-gray-500 mb-1">{label}</div><div className="text-lg font-bold" style={{ color }}>{value}</div></div>
}

const returns = Array.from({ length: 55 }, (_, i) => {
  const seed = i * 179 + 53
  const status = pick(INSPECTION_STATUS, seed)
  const reason = pick(RETURN_REASONS, seed + 1)
  return {
    id: "RQL-" + String(i + 9001).padStart(4, "0"), reason, status,
    testType: pick(TEST_TYPES, seed + 2), severity: pick(SEVERITY, seed + 3),
    warehouse: pick(WAREHOUSES, seed + 4), inspector: pick(["Dr. Patel", "Ms. Sharma", "Mr. Kumar", "Dr. Singh", "Ms. Gupta", "Mr. Rao"], seed + 5),
    score: status === "passed" ? ri(80, 100, seed + 6) : status === "failed" ? ri(10, 45, seed + 6) : ri(0, 100, seed + 6),
    tests: ri(1, 8, seed + 7), defects: status === "failed" ? ri(1, 8, seed + 8) : 0,
    turnaround: ri(1, 48, seed + 9), value: ri(500, 50000, seed + 10),
    returnRoute: pick(["refurbish", "resell", "recycle", "dispose", "vendor_return", "warranty_repair"], seed + 11)
  }
})

const monthlyData = MO.map((m, i) => ({ month: m, returns: ri(120, 300, i * 19 + 1), passRate: ri(65, 95, i * 19 + 2), defects: ri(5, 30, i * 19 + 3), turnaround: ri(4, 24, i * 19 + 4) }))
const reasonDist = RETURN_REASONS.map((r, i) => ({ name: r.replace(/_/g, " "), value: ri(3, 20, i * 47) }))

export default function ReturnsQualityLabView() {
  const [tab, setTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filteredReturns = useMemo(() => {
    return returns.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) && !r.inspector.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters["reason"] && !activeFilters["reason"].includes(r.reason)) return false
      if (activeFilters["status"] && !activeFilters["status"].includes(r.status)) return false
      if (activeFilters["severity"] && !activeFilters["severity"].includes(r.severity)) return false
      return true
    })
  }, [searchQuery, activeFilters])

  const filterGroups = [
    { key: "reason", label: "Reason", options: RETURN_REASONS.map(r => ({ value: r, label: r.replace(/_/g, " "), count: 0 })) },
    { key: "status", label: "Status", options: INSPECTION_STATUS.map(s => ({ value: s, label: s.replace(/_/g, " "), count: 0 })) },
    { key: "severity", label: "Severity", options: SEVERITY.map(s => ({ value: s, label: s, count: 0 })) }
  ]

  const totalReturns = returns.length
  const passRate = Math.round(returns.filter(r => r.status === "passed").length / totalReturns * 100)
  const totalValue = returns.reduce((s, r) => s + r.value, 0)
  const failCount = returns.filter(r => r.status === "failed").length

  return (
    <div className="space-y-4">
      <PageHeader title="Returns Quality Lab" description="Systematic inspection, testing and disposition of returned merchandise" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="rql-tabs-list">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <KpiTile label="Total Inspections" value={String(totalReturns)} change={14} icon={FlaskConical} />
            <KpiTile label="Pass Rate" value={passRate + "%"} change={5} icon={CheckCircle2} />
            <KpiTile label="Total Value" value={"&#8377;" + (totalValue / 100000).toFixed(1) + "L"} change={-8} icon={DollarSign} />
            <KpiTile label="Failed Items" value={String(failCount)} change={-12} icon={XCircle} />
          </div>
          <div className="flex gap-6 mb-4 justify-center flex-wrap">
            <HealthRing pct={passRate} label="Pass Rate" color={TH.ok} />
            <HealthRing pct={88} label="Test Coverage" color={TH.pri} />
            <HealthRing pct={76} label="Turnaround" color={TH.sec} />
            <HealthRing pct={92} label="Accuracy" color={TH.ok} />
            <HealthRing pct={69} label="Recovery" color={TH.ter} />
            <HealthRing pct={85} label="Compliance" color={TH.pri} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="rql-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Return Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="returns" stroke={TH.pri} strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="rql-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Defects Found</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="defects" fill={TH.err} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="rql-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Pass Rate Trend</CardTitle></CardHeader><CardContent><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="passRate" stroke={TH.ok} fill="rgba(5,150,105,0.15)" strokeWidth={2} /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="inspections">
          <ModuleBreadcrumb items={[{ label: "Quality Lab" }, { label: "All Inspections" }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalReturns} filteredCount={filteredReturns.length} onRefresh={() => {}} placeholder="Search by ID, warehouse, or inspector..." />
          <Card className="rql-table-card"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><th className="px-3 py-2 text-left font-semibold">ID</th><th className="px-3 py-2 text-left font-semibold">Reason</th><th className="px-3 py-2 text-left font-semibold">Status</th><th className="px-3 py-2 text-left font-semibold">Test</th><th className="px-3 py-2 text-left font-semibold">Severity</th><th className="px-3 py-2 text-left font-semibold">Warehouse</th><th className="px-3 py-2 text-left font-semibold">Score</th><th className="px-3 py-2 text-left font-semibold">Defects</th><th className="px-3 py-2 text-left font-semibold">Turnaround</th><th className="px-3 py-2 text-left font-semibold">Value</th></tr></thead><tbody>
            {filteredReturns.slice(0, 30).map((r) => (
              <tr key={r.id} className="rql-table-row border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-3 py-2 font-mono font-semibold text-pink-600">{r.id}</td>
                <td className="px-3 py-2"><ReasonBadge reason={r.reason} /></td>
                <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                <td className="px-3 py-2"><TestBadge type={r.testType} /></td>
                <td className="px-3 py-2"><SeverityBadge sev={r.severity} /></td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{r.warehouse}</td>
                <td className="px-3 py-2"><ScoreBar value={r.score} /></td>
                <td className="px-3 py-2">{r.defects > 0 ? <span className="rql-defect-count inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">{r.defects}</span> : <span className="text-gray-400">0</span>}</td>
                <td className="px-3 py-2 text-gray-600">{r.turnaround}h</td>
                <td className="px-3 py-2 font-semibold">&#8377;{r.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="analytics">
          <ModuleBreadcrumb items={[{ label: "Quality Lab" }, { label: "Analytics" }]} />
          <div className="grid grid-cols-4 gap-4 mb-4">
            <ValueTile label="Refurbished" value={String(returns.filter(r => r.returnRoute === "refurbish").length)} color={TH.pri} />
            <ValueTile label="Recycled" value={String(returns.filter(r => r.returnRoute === "recycle").length)} color={TH.ok} />
            <ValueTile label="Avg Turnaround" value={Math.round(returns.reduce((s, r) => s + r.turnaround, 0) / totalReturns) + "h"} color={TH.sec} />
            <ValueTile label="Quarantined" value={String(returns.filter(r => r.status === "quarantine").length)} color={TH.ter} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="rql-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Return Reason Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={reasonDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}><Cell fill={PC[0]} /><Cell fill={PC[1]} /><Cell fill={PC[2]} /><Cell fill={PC[3]} /><Cell fill={PC[4]} /><Cell fill={PC[5]} /><Cell fill={PC[6]} /><Cell fill={PC[7]} /></Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="rql-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Avg Turnaround (hours)</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="turnaround" fill={TH.pri} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <ModuleBreadcrumb items={[{ label: "Quality Lab" }, { label: "Insights" }]} />
          <div className="grid grid-cols-2 gap-4">
            <Card className="rql-insight-card border-l-4 border-l-pink-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><Microscope className="w-4 h-4 text-pink-600" /><span className="font-semibold text-sm">Defective Rate Spike</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Defective returns from Delhi DC-2 increased 22% in July. Root cause traced to batch ENG-7821 from supplier Apex Electronics. Initiate supplier corrective action request immediately.</p></CardContent></Card>
            <Card className="rql-insight-card border-l-4 border-l-violet-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><TestTubes className="w-4 h-4 text-violet-600" /><span className="font-semibold text-sm">Testing Automation</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Automated functional testing reduced inspection time by 35% for electronics returns. Expand to home appliances category to achieve projected 25% throughput improvement.</p></CardContent></Card>
            <Card className="rql-insight-card border-l-4 border-l-emerald-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><ThumbsUp className="w-4 h-4 text-emerald-600" /><span className="font-semibold text-sm">Refurbishment Success</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Items routed to refurbishment have 87% resale success rate, recovering average 62% of original value. Prioritize cosmetic and minor defect items for refurbishment pipeline.</p></CardContent></Card>
            <Card className="rql-insight-card border-l-4 border-l-amber-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-600" /><span className="font-semibold text-sm">Recall Alert</span></div><p className="text-xs text-gray-600 dark:text-gray-400">3 items flagged under recall protocol this month. Ensure quarantine hold times are extended from 24h to 72h for all recall-related returns pending manufacturer investigation.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
