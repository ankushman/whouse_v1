"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Anchor, Clock, Truck, AlertTriangle, CheckCircle2, BarChart3, TrendingUp, TrendingDown, Zap, Eye, Search, Thermometer, Wrench, MapPin, Package, Timer, ArrowUpDown, Radio } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const DOCK_TYPES = ["loading", "unloading", "cross_dock", "cold_storage", "hazardous", "bulk"] as const
const DOCK_EMOJI: Record<string, string> = { loading: "\U0001f4e5", unloading: "\U0001f4e4", cross_dock: "\u27a1\ufe0f", cold_storage: "\u2744\ufe0f", hazardous: "\u2622\ufe0f", bulk: "\U0001f4e6" }
const DOCK_STATUS = ["available", "occupied", "maintenance", "reserved", "blocked"] as const
const APPT_STATUS = ["scheduled", "checked_in", "loading", "unloading", "completed", "cancelled", "delayed"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#3b82f6", sec: "#f59e0b", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#3b82f6", "#f59e0b", "#059669", "#dc2626", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function DockTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { loading: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", unloading: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", cross_dock: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", cold_storage: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", hazardous: "bg-red-100 text-red-700 dark:bg-red-900/30", bulk: "bg-violet-100 text-violet-700 dark:bg-violet-900/30" }
  return <span className={"sds-dock-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{DOCK_EMOJI[type] || "\u2022"} {type.replace(/_/g, " ")}</span>
}

function DockStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { available: "sds-available bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", occupied: "sds-occupied bg-blue-100 text-blue-700 dark:bg-blue-900/30", maintenance: "sds-maint bg-amber-100 text-amber-700 dark:bg-amber-900/30", reserved: "sds-reserved bg-violet-100 text-violet-700 dark:bg-violet-900/30", blocked: "sds-blocked bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]" }
  const icons: Record<string, React.ReactNode> = { available: <CheckCircle2 className="w-3 h-3" />, occupied: <Truck className="w-3 h-3" />, maintenance: <Wrench className="w-3 h-3" />, reserved: <Clock className="w-3 h-3" />, blocked: <AlertTriangle className="w-3 h-3" /> }
  return <span className={"sds-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{icons[status]} {status}</span>
}

function ApptStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { scheduled: "bg-gray-100 text-gray-600", checked_in: "bg-blue-100 text-blue-700", loading: "bg-violet-100 text-violet-700", unloading: "bg-amber-100 text-amber-700", completed: "bg-emerald-100 text-emerald-700", cancelled: "bg-red-100 text-red-700", delayed: "bg-red-100 text-red-700 shadow-[0_0_6px_rgba(220,38,38,0.3)]" }
  return <span className={"sds-appt-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function UtilBar({ value }: { value: number }) {
  const col = value >= 80 ? TH.err : value >= 50 ? TH.warn : TH.ok
  return <div className="sds-util-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="sds-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) { return <span className="sds-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20">{city}</span> }

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) { return <Card className="sds-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card> }

function ValueTile({ label, value }: { label: string; value: string | number }) { return <div className="sds-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div> }

function HealthRing({ value, label }: { value: number; label: string }) { const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err; const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ; return <div className="sds-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div> }

function genDocks() {
  return Array.from({ length: 40 }, (_, i) => ({
    id: "DK-" + String(i + 1).padStart(3, "0"),
    type: pick(DOCK_TYPES, i * 3 + 1),
    name: pick(["Gate Alpha", "Gate Bravo", "Gate Charlie", "Gate Delta", "Bay 1", "Bay 2", "Dock East", "Dock West", "Platform A", "Ramp B"], i * 3 + 2),
    city: pick(CITIES, i * 3 + 3),
    status: pick(DOCK_STATUS, i + 5),
    utilization: ri(10, 95, i + 7),
    throughput: ri(5, 50, i + 11),
    avgWait: ri(5, 120, i + 13),
    capacity: ri(2, 8, i + 17),
    currentLoad: ri(0, 8, i + 19),
    temperature: ri(18, 35, i + 23),
    lastService: "2026-07-" + String(ri(1, 30, i + 29)).padStart(2, "0"),
    equipment: pick(["Conveyor", "Forklift", "Pallet Jack", "Scanner", "Scale", "Chiller"], i + 31)
  }))
}

function genAppointments() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: "APT-" + String(i + 1).padStart(5, "0"),
    dock: "DK-" + String(ri(1, 40, i + 7)).padStart(3, "0"),
    carrier: pick(["BlueDart", "Delhivery", "DTDC", "XpressBees", "Ecom Express", "Shadowfax", "Spoton", "Amazon Truck"], i + 11),
    vehicle: pick(["TRK-" + String(ri(100, 999, i + 13)), "VAN-" + String(ri(100, 999, i + 17)), "FLT-" + String(ri(10, 99, i + 19))], i + 23),
    status: pick(APPT_STATUS, i + 29),
    scheduledTime: String(ri(6, 22, i + 31)).padStart(2, "0") + ":" + String(ri(0, 59, i + 37)).padStart(2, "0"),
    actualTime: String(ri(6, 23, i + 41)).padStart(2, "0") + ":" + String(ri(0, 59, i + 43)).padStart(2, "0"),
    delay: ri(-15, 90, i + 47),
    pallets: ri(1, 40, i + 51),
    weight: ri(100, 8000, i + 53),
    priority: pick(["high", "medium", "low"], i + 57),
    date: "2026-07-" + String(ri(1, 30, i + 59)).padStart(2, "0")
  }))
}

function genCharts() {
  const hourly = MO.map((m, i) => ({ month: m, scheduled: ri(200, 800, i + 101), completed: ri(150, 750, i + 151), delayed: ri(10, 80, i + 201), cancelled: ri(5, 30, i + 251) }))
  const typeDist = DOCK_TYPES.map((t, i) => ({ type: t, count: ri(3, 12, i + 301), avgUtil: ri(40, 90, i + 351) }))
  const waitLine = MO.map((m, i) => ({ month: m, avgWait: ri(15, 90, i + 401), target: 30, peakWait: ri(60, 180, i + 451) }))
  return { hourly, typeDist, waitLine }
}

export default function SmartDockSchedulerView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const docks = useMemo(() => genDocks(), [])
  const appointments = useMemo(() => genAppointments(), [])
  const charts = useMemo(() => genCharts(), [])
  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const sortIcon = (f: string) => sortField === f ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""
  const filterDocks = useMemo(() => { if (!search) return docks; const lq = search.toLowerCase(); return docks.filter(d => Object.values(d).some(v => typeof v === "string" && v.toLowerCase().includes(lq))) }, [docks, search])
  const sortedDocks = useMemo(() => [...filterDocks].sort((a, b) => { const va = a[sortField as keyof typeof a], vb = b[sortField as keyof typeof b]; if (va == null || vb == null) return 0; return sortDir === "asc" ? String(va).localeCompare(String(vb), undefined, { numeric: true }) : -String(va).localeCompare(String(vb), undefined, { numeric: true }) }), [filterDocks, sortField, sortDir])
  const filterAppts = useMemo(() => { if (!search) return appointments; const lq = search.toLowerCase(); return appointments.filter(a => Object.values(a).some(v => typeof v === "string" && v.toLowerCase().includes(lq))) }, [appointments, search])
  const availDocks = docks.filter(d => d.status === "available").length
  const avgUtil = Math.round(docks.reduce((s, d) => s + d.utilization, 0) / docks.length)
  const avgWait = Math.round(docks.reduce((s, d) => s + d.avgWait, 0) / docks.length)
  const completedAppts = appointments.filter(a => a.status === "completed").length
  const handleRefresh = () => { setSearch(""); setSortField("id"); setSortDir("asc"); setActiveFilters({}) }
  const toggleFilter = (group: string, value: string) => { setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } }) }
  const clearAllFilters = () => setActiveFilters({})
  const totalActiveFilters = Object.values(activeFilters).reduce((s, v) => s + v.length, 0)
  const dockFilterGroups = useMemo(() => { const tc: Record<string, number> = {}; const sc: Record<string, number> = {}; docks.forEach(d => { tc[d.type] = (tc[d.type] || 0) + 1; sc[d.status] = (sc[d.status] || 0) + 1 }); return [{ key: "type", label: "Type", options: Object.entries(tc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "status", label: "Status", options: Object.entries(sc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }] }, [docks])

  const tab0 = (<div className="space-y-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><KpiTile label="Available Docks" value={String(availDocks)} icon={<Anchor className="w-4 h-4 text-blue-500"/>} trend={5.2} color={TH.pri}/><KpiTile label="Avg Utilization" value={avgUtil + "%"} icon={<Zap className="w-4 h-4 text-amber-500"/>} trend={2.3} color={TH.sec}/><KpiTile label="Avg Wait Time" value={avgWait + " min"} icon={<Clock className="w-4 h-4 text-red-500"/>} trend={-8.1} color={TH.err}/><KpiTile label="Completed" value={String(completedAppts)} icon={<CheckCircle2 className="w-4 h-4 text-emerald-500"/>} trend={11.4} color={TH.ok}/></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><HealthRing value={100 - avgUtil} label="Free Capacity"/><HealthRing value={Math.round(appointments.filter(a => a.status === "completed").length / appointments.length * 100)} label="On-Time"/><HealthRing value={95} label="Equipment"/><HealthRing value={Math.round((1 - docks.filter(d => d.status === "blocked").length / docks.length) * 100)} label="Operational"/></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Card className="sds-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Appointment Volume</CardTitle></CardHeader><CardContent><AreaChart data={charts.hourly} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Area type="monotone" dataKey="scheduled" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/><Area type="monotone" dataKey="completed" stroke={TH.ok} fill={TH.ok} fillOpacity={0.15}/><Line type="monotone" dataKey="delayed" stroke={TH.err} strokeWidth={2} dot={{ r: 3 }}/></AreaChart></CardContent></Card><Card className="sds-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Dock Type & Utilization</CardTitle></CardHeader><CardContent><BarChart data={charts.typeDist} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="type" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="count" fill={TH.pri} radius={[2, 2, 0, 0]}/><Bar dataKey="avgUtil" fill={TH.sec} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card><Card className="sds-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Wait Time Trend</CardTitle></CardHeader><CardContent><LineChart data={charts.waitLine} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Line type="monotone" dataKey="avgWait" stroke={TH.warn} strokeWidth={2} dot={{ r: 3 }}/><Line type="monotone" dataKey="target" stroke={TH.ok} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }}/><Line type="monotone" dataKey="peakWait" stroke={TH.err} strokeWidth={2} dot={{ r: 3 }}/></LineChart></CardContent></Card><Card className="sds-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Dock Status Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={DOCK_STATUS.map(s => ({ name: s, value: docks.filter(d => d.status === s).length }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{DOCK_STATUS.map((_, i) => <Cell key={i} fill={PC[i % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card></div></div>)

  const tab1 = (<div className="space-y-3"><ModuleBreadcrumb items={[{ label: "Warehouse" }, { label: "Dock Scheduling" }, { label: "Docks" }]}/><SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={dockFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={docks.length} filteredCount={sortedDocks.length} onRefresh={handleRefresh} placeholder="Search docks by name, type..." /><div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]"><table className="sds-table w-full text-xs"><thead className="bg-blue-50 dark:bg-blue-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Name</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">City</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Utilization</th><th className="p-2 text-right">Throughput</th><th className="p-2 text-right">Wait</th><th className="p-2 text-left">Equipment</th></tr></thead><tbody>{sortedDocks.map(d => <tr key={d.id} className="sds-table-row border-t hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer" onClick={() => setDetail(d as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{d.id}</td><td className="p-2 font-medium">{d.name}</td><td className="p-2"><DockTypeBadge type={d.type}/></td><td className="p-2"><CityBadge city={d.city}/></td><td className="p-2"><DockStatusBadge status={d.status}/></td><td className="p-2"><UtilBar value={d.utilization}/></td><td className="p-2 text-right">{d.throughput}/hr</td><td className="p-2 text-right">{d.avgWait} min</td><td className="p-2 text-[10px]">{d.equipment}</td></tr>)}</tbody></table></div><div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>Showing {sortedDocks.length} of {docks.length} docks</span>{totalActiveFilters > 0 && <span>{totalActiveFilters} filters</span>}</div></div>)

  const tab2 = (<div className="space-y-3"><ModuleBreadcrumb items={[{ label: "Warehouse" }, { label: "Dock Scheduling" }, { label: "Appointments" }]}/><SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={[]} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={appointments.length} filteredCount={filterAppts.length} onRefresh={handleRefresh} placeholder="Search appointments..." /><div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]"><table className="sds-table w-full text-xs"><thead className="bg-amber-50 dark:bg-amber-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Carrier</th><th className="p-2 text-left">Dock</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Scheduled</th><th className="p-2 text-left">Actual</th><th className="p-2 text-right">Delay</th><th className="p-2 text-right">Pallets</th><th className="p-2 text-left">Priority</th></tr></thead><tbody>{filterAppts.map(ap => <tr key={ap.id} className="sds-table-row border-t hover:bg-amber-50/50 dark:hover:bg-amber-900/10 cursor-pointer" onClick={() => setDetail(ap as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{ap.id}</td><td className="p-2 font-medium">{ap.carrier}</td><td className="p-2 font-mono text-[10px]">{ap.dock}</td><td className="p-2"><ApptStatusBadge status={ap.status}/></td><td className="p-2 text-[10px]">{ap.scheduledTime}</td><td className="p-2 text-[10px]">{ap.actualTime}</td><td className="p-2 text-right"><span className="text-[10px] font-bold" style={{ color: ap.delay > 15 ? TH.err : ap.delay > 0 ? TH.warn : TH.ok }}>{ap.delay > 0 ? "+" + ap.delay : "0"} min</span></td><td className="p-2 text-right">{ap.pallets}</td><td className="p-2"><span className={"inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium " + (ap.priority === "high" ? "bg-red-100 text-red-700" : ap.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{ap.priority}</span></td></tr>)}</tbody></table></div><div className="text-[10px] text-muted-foreground text-right">{filterAppts.length} appointments</div></div>)

  const tabs = [{ key: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-3.5 h-3.5" />, content: tab0 }, { key: "docks", label: "Docks", icon: <Anchor className="w-3.5 h-3.5" />, content: tab1 }, { key: "appointments", label: "Appointments", icon: <Clock className="w-3.5 h-3.5" />, content: tab2 }]

  return (<div className="space-y-4 p-4"><PageHeader title="Smart Dock Scheduler" description="AI-powered dock scheduling with real-time bay management, appointment optimization, and wait time analytics"/><div className="flex items-center gap-3 flex-wrap"><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><Anchor className="w-3 h-3 text-blue-600"/><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">{availDocks} Docks Available</span></div><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><CheckCircle2 className="w-3 h-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{completedAppts} Completed Today</span></div><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><Clock className="w-3 h-3 text-amber-600"/><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">{avgWait} min Avg Wait</span></div><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"><Radio className="w-3 h-3 text-violet-600"/><span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">{docks.length} Total Docks</span></div></div><Tabs value={tab} onValueChange={setTab}><TabsList className="bg-gradient-to-r from-blue-500/10 to-amber-500/10 p-0.5 h-9">{tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}</TabsList>{tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}</Tabs><Sheet open={!!detail} onOpenChange={() => setDetail(null)}><SheetContent className="w-[420px] overflow-y-auto"><SheetHeader><SheetTitle className="text-sm">Detail View</SheetTitle></SheetHeader>{detail && <div className="mt-4 space-y-3"><div className="sds-detail-header rounded-lg p-4 bg-gradient-to-br from-blue-500 to-amber-600 text-white"><div className="text-lg font-bold">{String(detail.id)}</div><div className="text-xs opacity-80 mt-1">{String(detail.name || detail.carrier || "Record")}</div></div>{Object.entries(detail).filter(([k]) => k !== "id").map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b"><span className="text-[10px] text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><span className="text-xs font-medium">{typeof v === "number" ? v.toLocaleString() : String(v)}</span></div>)}</div>}</SheetContent></Sheet></div>)
}