"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Anchor, AlertTriangle, CheckCircle2, Route, Activity, Clock, DollarSign, ShieldCheck, ShieldAlert, Ship, Container, Truck, TrainFront, Waves, ClipboardCheck, Users } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const CARGO_TYPES = ["fcl", "lcl", "break_bulk", "roll_on_roll", "project_cargo", "bulk_liquid", "bulk_dry", "reefer"] as const
const VESSEL_STATUS = ["berthed", "arriving", "departed", "at_anchor", "loading", "discharging", "waiting"] as const
const PORTS = ["Nhava Sheva JNPT", "Mundra", "Chennai", "Kandla", "Kolkata Haldia", "Tuticorin V.O.C", "Cochin", "Ennore Kamarajar"] as const
const TERMINALS = ["CT-1", "CT-2", "CT-3", "BOT-1", "BOT-2", "LCT-1", "OCT-1", "OCT-2"] as const
const OPERATIONS = ["import", "export", "transshipment", "coastal"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#0ea5e9", sec: "#f59e0b", ter: "#059669", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#0ea5e9", "#f59e0b", "#059669", "#dc2626", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function CargoBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { fcl: "bg-sky-100 text-sky-700 dark:bg-sky-900/30", lcl: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", break_bulk: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", roll_on_roll: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", project_cargo: "poh-project bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30", bulk_liquid: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", bulk_dry: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", reefer: "poh-reefer bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" }
  return <span className={"poh-cargo-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{type.replace(/_/g, " ")}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { berthed: "poh-berthed bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", arriving: "poh-arriving bg-blue-100 text-blue-700 dark:bg-blue-900/30 shadow-[0_0_6px_rgba(59,130,246,0.3)]", departed: "bg-gray-200 text-gray-600 dark:bg-gray-700", at_anchor: "poh-at-anchor bg-amber-100 text-amber-700 dark:bg-amber-900/30", loading: "poh-loading bg-violet-100 text-violet-700 dark:bg-violet-900/30 shadow-[0_0_6px_rgba(139,92,246,0.3)]", discharging: "poh-discharging bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 shadow-[0_0_6px_rgba(6,182,212,0.3)]", waiting: "poh-waiting bg-orange-100 text-orange-700 dark:bg-orange-900/30" }
  return <span className={"poh-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function OperationBadge({ op }: { op: string }) {
  const cols: Record<string, string> = { import: "bg-emerald-100 text-emerald-700", export: "bg-sky-100 text-sky-700", transshipment: "bg-violet-100 text-violet-700", coastal: "bg-amber-100 text-amber-700" }
  return <span className={"poh-op-badge inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold " + (cols[op] || "bg-gray-100 text-gray-600")}>{op}</span>
}

function UtilBar({ value }: { value: number }) {
  const col = value >= 95 ? TH.err : value >= 80 ? TH.warn : TH.ok
  return <div className="poh-util-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function TonnageBar({ value }: { value: number }) {
  const col = value >= 8000 ? TH.err : value >= 5000 ? TH.warn : TH.ok
  return <div className="poh-tonnage-bar flex items-center gap-1.5"><div className="w-14 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: Math.min(value / 10000 * 100, 100) + "%", backgroundColor: col }}/></div><span className="text-[10px] font-semibold" style={{ color: col }}>{(value / 1000).toFixed(1)}K</span></div>
}

function HealthRing({ pct, label, color }: { pct: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, off = c - (pct / 100) * c
  return <div className="poh-health-ring flex flex-col items-center"><svg width="68" height="68" viewBox="0 0 68 68"><circle cx="34" cy="34" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6"/><circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 34 34)" className="transition-all duration-700"/><text x="34" y="38" textAnchor="middle" className="text-[11px] font-bold" fill={color}>{pct}%</text></svg><span className="text-[9px] text-gray-500 mt-0.5">{label}</span></div>
}

function KpiTile({ label, value, change, icon: Icon }: { label: string; value: string; change: number; icon: React.ComponentType<{ className?: string }> }) {
  return <div className="poh-kpi-tile bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-center justify-between mb-2"><span className="text-[11px] font-medium text-gray-500">{label}</span><Icon className="w-4 h-4 text-sky-500"/></div><div className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</div><div className={"flex items-center gap-1 mt-1 text-[10px] font-semibold " + (change >= 0 ? "text-emerald-600" : "text-red-500")}><span>{change >= 0 ? "+" : ""}{change}%</span></div></div>
}

function ValueTile({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="poh-value-tile bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"><div className="text-[10px] text-gray-500 mb-1">{label}</div><div className="text-lg font-bold" style={{ color }}>{value}</div></div>
}

const vessels = Array.from({ length: 60 }, (_, i) => {
  const seed = i * 239 + 71
  return {
    id: "POH-" + String(i + 4001).padStart(4, "0"), vesselName: pick(["MSC Aurora", "CMA Marco Polo", "Maersk Elba", "Evergreen Hero", "Cosco Fortune", "Yang Ming Unity", "Hapag Express", "ONE Harmony", "PIL Venture", "SCI Vigilance"], seed),
    status: pick(VESSEL_STATUS, seed + 1), cargoType: pick(CARGO_TYPES, seed + 2),
    port: pick(PORTS, seed + 3), terminal: pick(TERMINALS, seed + 4), operation: pick(OPERATIONS, seed + 5),
    teu: ri(100, 8000, seed + 6), tonnage: ri(500, 10000, seed + 7),
    berthUtil: ri(40, 100, seed + 8), dwellTime: ri(4, 96, seed + 9),
    containers: ri(10, 500, seed + 10), craneMoves: ri(20, 200, seed + 11),
    eta: MO[ri(0, 11, seed + 12)] + " " + ri(1, 28, seed + 13),
    draft: (ri(80, 160, seed + 14) / 10).toFixed(1)
  }
})

const monthlyData = MO.map((m, i) => ({ month: m, vessels: ri(80, 200, i * 23 + 1), teu: ri(30000, 80000, i * 23 + 2), berth: ri(70, 95, i * 23 + 3), dwell: ri(12, 36, i * 23 + 4) }))
const cargoDist = CARGO_TYPES.map((c, i) => ({ name: c.replace(/_/g, " "), value: ri(5, 20, i * 53) }))

export default function PortOperationsHubView() {
  const [tab, setTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filteredVessels = useMemo(() => {
    return vessels.filter(v => {
      if (searchQuery && !v.id.toLowerCase().includes(searchQuery.toLowerCase()) && !v.vesselName.toLowerCase().includes(searchQuery.toLowerCase()) && !v.port.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters["cargo"] && !activeFilters["cargo"].includes(v.cargoType)) return false
      if (activeFilters["status"] && !activeFilters["status"].includes(v.status)) return false
      if (activeFilters["operation"] && !activeFilters["operation"].includes(v.operation)) return false
      return true
    })
  }, [searchQuery, activeFilters])

  const filterGroups = [
    { key: "cargo", label: "Cargo", options: CARGO_TYPES.map(c => ({ value: c, label: c.replace(/_/g, " "), count: 0 })) },
    { key: "status", label: "Status", options: VESSEL_STATUS.map(s => ({ value: s, label: s.replace(/_/g, " "), count: 0 })) },
    { key: "operation", label: "Operation", options: OPERATIONS.map(o => ({ value: o, label: o, count: 0 })) }
  ]

  const totalVessels = vessels.length
  const avgBerthUtil = Math.round(vessels.reduce((s, v) => s + v.berthUtil, 0) / totalVessels)
  const totalTeu = vessels.reduce((s, v) => s + v.teu, 0)
  const waitingCount = vessels.filter(v => v.status === "waiting" || v.status === "at_anchor").length

  return (
    <div className="space-y-4">
      <PageHeader title="Port Operations Hub" description="Real-time vessel tracking, berth management and cargo throughput monitoring" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="poh-tabs-list">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="vessels">Vessels</TabsTrigger>
          <TabsTrigger value="cargo">Cargo</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <KpiTile label="Active Vessels" value={String(totalVessels)} change={7} icon={Anchor} />
            <KpiTile label="Berth Utilisation" value={avgBerthUtil + "%"} change={3} icon={Activity} />
            <KpiTile label="Total TEU" value={(totalTeu / 1000).toFixed(0) + "K"} change={11} icon={Container} />
            <KpiTile label="Waiting/Anchored" value={String(waitingCount)} change={-15} icon={ShieldAlert} />
          </div>
          <div className="flex gap-6 mb-4 justify-center flex-wrap">
            <HealthRing pct={avgBerthUtil} label="Berth Util" color={TH.ok} />
            <HealthRing pct={89} label="Throughput" color={TH.pri} />
            <HealthRing pct={82} label="On-Time" color={TH.sec} />
            <HealthRing pct={94} label="Safety" color={TH.ok} />
            <HealthRing pct={71} label="Automation" color={TH.ter} />
            <HealthRing pct={88} label="Env Score" color={TH.pri} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="poh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Vessel Traffic</CardTitle></CardHeader><CardContent><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="vessels" stroke={TH.pri} strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="poh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">TEU Volume</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="teu" fill={TH.sec} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="poh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Dwell Time Trend</CardTitle></CardHeader><CardContent><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="dwell" stroke={TH.ter} fill="rgba(5,150,105,0.15)" strokeWidth={2} /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="vessels">
          <ModuleBreadcrumb items={[{ label: "Port Ops" }, { label: "All Vessels" }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalVessels} filteredCount={filteredVessels.length} onRefresh={() => {}} placeholder="Search by ID, vessel name, or port..." />
          <Card className="poh-table-card"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><th className="px-3 py-2 text-left font-semibold">ID</th><th className="px-3 py-2 text-left font-semibold">Vessel</th><th className="px-3 py-2 text-left font-semibold">Status</th><th className="px-3 py-2 text-left font-semibold">Cargo</th><th className="px-3 py-2 text-left font-semibold">Port</th><th className="px-3 py-2 text-left font-semibold">TEU</th><th className="px-3 py-2 text-left font-semibold">Berth Util</th><th className="px-3 py-2 text-left font-semibold">Tonnage</th><th className="px-3 py-2 text-left font-semibold">Dwell</th><th className="px-3 py-2 text-left font-semibold">Op</th></tr></thead><tbody>
            {filteredVessels.slice(0, 30).map((v) => (
              <tr key={v.id} className="poh-table-row border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-3 py-2 font-mono font-semibold text-sky-600">{v.id}</td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{v.vesselName}</td>
                <td className="px-3 py-2"><StatusBadge status={v.status} /></td>
                <td className="px-3 py-2"><CargoBadge type={v.cargoType} /></td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{v.port}</td>
                <td className="px-3 py-2 font-semibold">{v.teu.toLocaleString()}</td>
                <td className="px-3 py-2"><UtilBar value={v.berthUtil} /></td>
                <td className="px-3 py-2"><TonnageBar value={v.tonnage} /></td>
                <td className="px-3 py-2 text-gray-600">{v.dwellTime}h</td>
                <td className="px-3 py-2"><OperationBadge op={v.operation} /></td>
              </tr>
            ))}
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="cargo">
          <ModuleBreadcrumb items={[{ label: "Port Ops" }, { label: "Cargo Analysis" }]} />
          <div className="grid grid-cols-4 gap-4 mb-4">
            <ValueTile label="FCL Containers" value={String(vessels.filter(v => v.cargoType === "fcl").length)} color={TH.pri} />
            <ValueTile label="Reefer Units" value={String(vessels.filter(v => v.cargoType === "reefer").length)} color={TH.ok} />
            <ValueTile label="Avg Dwell Time" value={Math.round(vessels.reduce((s, v) => s + v.dwellTime, 0) / totalVessels) + "h"} color={TH.sec} />
            <ValueTile label="Crane Moves" value={vessels.reduce((s, v) => s + v.craneMoves, 0).toLocaleString()} color={TH.ter} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="poh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Cargo Type Mix</CardTitle></CardHeader><CardContent><PieChart><Pie data={cargoDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}><Cell fill={PC[0]} /><Cell fill={PC[1]} /><Cell fill={PC[2]} /><Cell fill={PC[3]} /><Cell fill={PC[4]} /><Cell fill={PC[5]} /><Cell fill={PC[6]} /><Cell fill={PC[7]} /></Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="poh-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Berth Utilisation Trend</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="berth" fill={TH.pri} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <ModuleBreadcrumb items={[{ label: "Port Ops" }, { label: "Insights" }]} />
          <div className="grid grid-cols-2 gap-4">
            <Card className="poh-insight-card border-l-4 border-l-sky-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><Anchor className="w-4 h-4 text-sky-600" /><span className="font-semibold text-sm">Nhava Sheva Congestion</span></div><p className="text-xs text-gray-600 dark:text-gray-400">JNPT CT-1 berth occupancy at 96% causing 8-hour average wait for arriving vessels. Pre-berthing allocation optimization could reduce dwell time by 20% and save 500 crane moves daily.</p></CardContent></Card>
            <Card className="poh-insight-card border-l-4 border-l-amber-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><Waves className="w-4 h-4 text-amber-600" /><span className="font-semibold text-sm">Monsoon Impact</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Mumbai port operations expected 15% slowdown during July-August monsoon. Activate Tuticorin V.O.C as overflow hub for container traffic. Ensure reefer power backup across all terminals.</p></CardContent></Card>
            <Card className="poh-insight-card border-l-4 border-l-emerald-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="font-semibold text-sm">Vessel Turnaround</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Average vessel turnaround time reduced to 18 hours (down from 26 hours in Q1). Streamlined documentation and dual crane deployment on CT-2 contributed to 30% improvement.</p></CardContent></Card>
            <Card className="poh-insight-card border-l-4 border-l-violet-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><Ship className="w-4 h-4 text-violet-600" /><span className="font-semibold text-sm">Coastal Shipping Growth</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Coastal cargo volume grew 24% YoY driven by RoRo services between Chennai and Kolkata. Consider adding Ennore Kamarajar terminal for dedicated coastal operations to meet projected demand.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
