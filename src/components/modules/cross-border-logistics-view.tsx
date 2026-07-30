"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Globe, Plane, Ship, TrainFront, AlertTriangle, CheckCircle2, Route, Activity, Clock, DollarSign, ShieldCheck, ShieldAlert, FileCheck2, Languages, Fingerprint, Truck } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const SHIPMENT_TYPES = ["export", "import", "transit", "re_export"] as const
const CLEARANCE_STATUS = ["pending", "cleared", "held", "rejected", "in_review", "released"] as const
const MODES = ["air", "sea", "land", "rail", "multimodal"] as const
const COUNTRIES = ["China", "UAE", "USA", "UK", "Germany", "Singapore", "Japan", "South Korea", "Thailand", "Vietnam"] as const
const GATEWAYS = ["Nhava Sheva", "JNPT", "Tuticorin", "Chennai Port", "IGI Delhi", "Mumbai Airport", "Bangalore Airport", "Kolkata Port"] as const
const DOC_STATUS = ["complete", "incomplete", "expired", "pending_submission"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#0d9488", sec: "#6366f1", ter: "#ea580c", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#0d9488", "#6366f1", "#059669", "#ea580c", "#dc2626", "#8b5cf6", "#ec4899", "#14b8a6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function ShipmentTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { export: "bg-teal-100 text-teal-700 dark:bg-teal-900/30", import: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30", transit: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", re_export: "bg-violet-100 text-violet-700 dark:bg-violet-900/30" }
  const icons: Record<string, string> = { export: "OUT", import: "IN", transit: "TR", re_export: "RE" }
  return <span className={"cbl-type-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{icons[type] || type.replace(/_/g, " ")}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { pending: "cbl-pending bg-amber-100 text-amber-700 dark:bg-amber-900/30 shadow-[0_0_6px_rgba(217,119,6,0.3)]", cleared: "cbl-cleared bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", held: "cbl-held bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]", rejected: "cbl-rejected bg-rose-100 text-rose-700 dark:bg-rose-900/30 shadow-[0_0_6px_rgba(244,63,94,0.3)]", in_review: "cbl-in-review bg-blue-100 text-blue-700 dark:bg-blue-900/30", released: "cbl-released bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 shadow-[0_0_6px_rgba(6,182,212,0.3)]" }
  return <span className={"cbl-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function ModeBadge({ mode }: { mode: string }) {
  const cols: Record<string, string> = { air: "bg-sky-100 text-sky-700", sea: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", land: "bg-amber-100 text-amber-700", rail: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", multimodal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30" }
  return <span className={"cbl-mode-badge inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold " + (cols[mode] || "bg-gray-100 text-gray-600")}>{mode}</span>
}

function CountryBadge({ country }: { country: string }) {
  return <span className={"cbl-country-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700"}><Globe className="w-2.5 h-2.5"/>{country}</span>
}

function DocBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { complete: "bg-emerald-100 text-emerald-700", incomplete: "bg-amber-100 text-amber-700", expired: "cbl-expired bg-red-100 text-red-700 dark:bg-red-900/30", pending_submission: "bg-gray-100 text-gray-600" }
  return <span className={"cbl-doc-badge inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function DutyBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100); const col = pct >= 80 ? TH.err : pct >= 50 ? TH.warn : TH.ok
  return <div className="cbl-duty-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: pct + "%", backgroundColor: col }}/></div><span className="text-[10px] font-semibold" style={{ color: col }}>&#8377;{value.toLocaleString()}</span></div>
}

function HealthRing({ pct, label, color }: { pct: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, off = c - (pct / 100) * c
  return <div className="cbl-health-ring flex flex-col items-center"><svg width="68" height="68" viewBox="0 0 68 68"><circle cx="34" cy="34" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6"/><circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 34 34)" className="transition-all duration-700"/><text x="34" y="38" textAnchor="middle" className="text-[11px] font-bold" fill={color}>{pct}%</text></svg><span className="text-[9px] text-gray-500 mt-0.5">{label}</span></div>
}

function KpiTile({ label, value, change, icon: Icon }: { label: string; value: string; change: number; icon: React.ComponentType<{ className?: string }> }) {
  return <div className="cbl-kpi-tile bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-center justify-between mb-2"><span className="text-[11px] font-medium text-gray-500">{label}</span><Icon className="w-4 h-4 text-teal-500"/></div><div className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</div><div className={"flex items-center gap-1 mt-1 text-[10px] font-semibold " + (change >= 0 ? "text-emerald-600" : "text-red-500")}><span>{change >= 0 ? "+" : ""}{change}%</span></div></div>
}

function ValueTile({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="cbl-value-tile bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"><div className="text-[10px] text-gray-500 mb-1">{label}</div><div className="text-lg font-bold" style={{ color }}>{value}</div></div>
}

const shipments = Array.from({ length: 50 }, (_, i) => {
  const seed = i * 211 + 93
  const status = pick(CLEARANCE_STATUS, seed)
  const docStatus = status === "cleared" || status === "released" ? pick(["complete"], seed + 1) : pick(DOC_STATUS, seed + 1)
  return {
    id: "CBL-" + String(i + 7001).padStart(4, "0"), type: pick(SHIPMENT_TYPES, seed + 2), status, mode: pick(MODES, seed + 3),
    country: pick(COUNTRIES, seed + 4), gateway: pick(GATEWAYS, seed + 5), docStatus,
    hsCode: "HS" + ri(1000, 9999, seed + 6), weight: ri(50, 25000, seed + 7),
    duty: ri(5000, 500000, seed + 8), igst: ri(1000, 180000, seed + 9),
    clearanceTime: ri(1, 72, seed + 10), documents: ri(2, 12, seed + 11),
    containerNo: "MSCU" + ri(100000, 999999, seed + 12), value: ri(100000, 10000000, seed + 13)
  }
})

const monthlyData = MO.map((m, i) => ({ month: m, shipments: ri(150, 400, i * 13 + 1), duty: ri(500, 2000, i * 13 + 2), clearance: ri(85, 98, i * 13 + 3), holds: ri(2, 15, i * 13 + 4) }))
const modeDist = MODES.map((m, i) => ({ name: m, value: ri(10, 30, i * 41) }))

export default function CrossBorderLogisticsView() {
  const [tab, setTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      if (searchQuery && !s.id.toLowerCase().includes(searchQuery.toLowerCase()) && !s.country.toLowerCase().includes(searchQuery.toLowerCase()) && !s.containerNo.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters["type"] && !activeFilters["type"].includes(s.type)) return false
      if (activeFilters["status"] && !activeFilters["status"].includes(s.status)) return false
      if (activeFilters["mode"] && !activeFilters["mode"].includes(s.mode)) return false
      return true
    })
  }, [searchQuery, activeFilters])

  const filterGroups = [
    { key: "type", label: "Type", options: SHIPMENT_TYPES.map(t => ({ value: t, label: t.replace(/_/g, " "), count: 0 })) },
    { key: "status", label: "Status", options: CLEARANCE_STATUS.map(s => ({ value: s, label: s.replace(/_/g, " "), count: 0 })) },
    { key: "mode", label: "Mode", options: MODES.map(m => ({ value: m, label: m, count: 0 })) }
  ]

  const totalShipments = shipments.length
  const clearanceRate = Math.round(shipments.filter(s => s.status === "cleared" || s.status === "released").length / totalShipments * 100)
  const totalDuty = shipments.reduce((s, sh) => s + sh.duty, 0)
  const heldCount = shipments.filter(s => s.status === "held" || s.status === "rejected").length

  return (
    <div className="space-y-4">
      <PageHeader title="Cross-Border Logistics Hub" description="International trade compliance, customs clearance and cross-border shipment tracking" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="cbl-tabs-list">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <KpiTile label="Active Shipments" value={String(totalShipments)} change={10} icon={Globe} />
            <KpiTile label="Clearance Rate" value={clearanceRate + "%"} change={5} icon={ShieldCheck} />
            <KpiTile label="Total Duty" value={"&#8377;" + (totalDuty / 10000000).toFixed(2) + "Cr"} change={-3} icon={DollarSign} />
            <KpiTile label="Held/Rejected" value={String(heldCount)} change={-20} icon={ShieldAlert} />
          </div>
          <div className="flex gap-6 mb-4 justify-center flex-wrap">
            <HealthRing pct={clearanceRate} label="Clearance" color={TH.ok} />
            <HealthRing pct={92} label="Doc Accuracy" color={TH.pri} />
            <HealthRing pct={88} label="On-Time" color={TH.sec} />
            <HealthRing pct={95} label="Compliance" color={TH.ok} />
            <HealthRing pct={78} label="Auto-Clear" color={TH.ter} />
            <HealthRing pct={84} label="Digital Filing" color={TH.pri} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="cbl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Shipment Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="shipments" stroke={TH.pri} strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="cbl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Customs Holds</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="holds" fill={TH.err} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="cbl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Clearance Trend</CardTitle></CardHeader><CardContent><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="clearance" stroke={TH.ok} fill="rgba(5,150,105,0.15)" strokeWidth={2} /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="shipments">
          <ModuleBreadcrumb items={[{ label: "Cross-Border" }, { label: "All Shipments" }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalShipments} filteredCount={filteredShipments.length} onRefresh={() => {}} placeholder="Search by ID, country, or container..." />
          <Card className="cbl-table-card"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><th className="px-3 py-2 text-left font-semibold">ID</th><th className="px-3 py-2 text-left font-semibold">Type</th><th className="px-3 py-2 text-left font-semibold">Status</th><th className="px-3 py-2 text-left font-semibold">Mode</th><th className="px-3 py-2 text-left font-semibold">Country</th><th className="px-3 py-2 text-left font-semibold">Gateway</th><th className="px-3 py-2 text-left font-semibold">HS Code</th><th className="px-3 py-2 text-left font-semibold">Duty</th><th className="px-3 py-2 text-left font-semibold">Docs</th><th className="px-3 py-2 text-left font-semibold">Clearance</th></tr></thead><tbody>
            {filteredShipments.slice(0, 30).map((s) => (
              <tr key={s.id} className="cbl-table-row border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-3 py-2 font-mono font-semibold text-teal-600">{s.id}</td>
                <td className="px-3 py-2"><ShipmentTypeBadge type={s.type} /></td>
                <td className="px-3 py-2"><StatusBadge status={s.status} /></td>
                <td className="px-3 py-2"><ModeBadge mode={s.mode} /></td>
                <td className="px-3 py-2"><CountryBadge country={s.country} /></td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{s.gateway}</td>
                <td className="px-3 py-2 font-mono text-[10px]">{s.hsCode}</td>
                <td className="px-3 py-2"><DutyBar value={s.duty} max={500000} /></td>
                <td className="px-3 py-2"><DocBadge status={s.docStatus} /></td>
                <td className="px-3 py-2 text-gray-600">{s.clearanceTime}h</td>
              </tr>
            ))}
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="compliance">
          <ModuleBreadcrumb items={[{ label: "Cross-Border" }, { label: "Compliance" }]} />
          <div className="grid grid-cols-4 gap-4 mb-4">
            <ValueTile label="Exports Cleared" value={String(shipments.filter(s => s.type === "export" && s.status === "cleared").length)} color={TH.ok} />
            <ValueTile label="Held at Customs" value={String(shipments.filter(s => s.status === "held").length)} color={TH.err} />
            <ValueTile label="Avg Duty/Ship" value={"&#8377;" + Math.round(totalDuty / totalShipments).toLocaleString()} color={TH.pri} />
            <ValueTile label="Doc Complete" value={String(shipments.filter(s => s.docStatus === "complete").length)} color={TH.sec} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="cbl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Transport Mode Split</CardTitle></CardHeader><CardContent><PieChart><Pie data={modeDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}><Cell fill={PC[0]} /><Cell fill={PC[1]} /><Cell fill={PC[2]} /><Cell fill={PC[3]} /><Cell fill={PC[4]} /></Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="cbl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Duty (Lakh)</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="duty" fill={TH.pri} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <ModuleBreadcrumb items={[{ label: "Cross-Border" }, { label: "Insights" }]} />
          <div className="grid grid-cols-2 gap-4">
            <Card className="cbl-insight-card border-l-4 border-l-teal-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-teal-600" /><span className="font-semibold text-sm">Export Growth China Route</span></div><p className="text-xs text-gray-600 dark:text-gray-400">China-India export corridor grew 18% QoQ. Electronics and pharmaceuticals dominate. Consider pre-clearance agreements with Nhava Sheva customs to reduce dwell time by 30%.</p></CardContent></Card>
            <Card className="cbl-insight-card border-l-4 border-l-red-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-600" /><span className="font-semibold text-sm">Documentation Delays</span></div><p className="text-xs text-gray-600 dark:text-gray-400">12% of shipments have incomplete documentation at filing. Certificate of Origin and FSSAI licenses are the top missing docs. Automate pre-filing validation to reduce holds.</p></CardContent></Card>
            <Card className="cbl-insight-card border-l-4 border-l-indigo-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><Ship className="w-4 h-4 text-indigo-600" /><span className="font-semibold text-sm">Sea Freight Optimization</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Sea freight accounts for 45% of volumes but 62% of customs holds. Container scanning backlog at Chennai Port is causing 8-hour delays. Explore direct port clearance for trusted traders.</p></CardContent></Card>
            <Card className="cbl-insight-card border-l-4 border-l-emerald-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="font-semibold text-sm">GST Integration Success</span></div><p className="text-xs text-gray-600 dark:text-gray-400">E-Way bill auto-generation achieved 94% success rate for cross-border shipments. Integration with ICEGATE reducing manual data entry by 70% across all gateways.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
