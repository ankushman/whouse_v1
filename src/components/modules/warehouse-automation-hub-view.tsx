"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Bot, Cpu, Radio, Wifi, Battery, AlertTriangle, CheckCircle2, Clock, Zap, BarChart3, TrendingUp, TrendingDown, Activity, Eye, Search, ArrowUpDown, Thermometer, Wrench, ShieldCheck, Settings } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const ROBOT_TYPES = ["AGV", "AMR", "Robotic Arm", "Conveyor Bot", "Sorting Bot", "Pallet Jack Bot", "Drone", "Picker Bot"] as const
const ROBOT_EMOJI: Record<string, string> = { AGV: "\U0001f916", AMR: "\U0001f916", "Robotic Arm": "\U0001f9be", "Conveyor Bot": "\u2699\ufe0f", "Sorting Bot": "\U0001f4e6", "Pallet Jack Bot": "\U0001f69a", Drone: "\U0001f681", "Picker Bot": "\U0001f4e5" }
const TASK_TYPES = ["picking", "putaway", "sorting", "packing", "transport", "replenish", "quality_check", "charging"] as const
const TASK_EMOJI: Record<string, string> = { picking: "\U0001f4e5", putaway: "\U0001f4e6", sorting: "\U0001f500", packing: "\U0001f4e6", transport: "\U0001f69a", replenish: "\U0001f504", quality_check: "\u2705", charging: "\u26a1" }
const ROBOT_STATUS = ["active", "idle", "charging", "maintenance", "error", "offline"] as const
const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F", "Cold Storage", "High Bay"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#8b5cf6", sec: "#06b6d4", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#8b5cf6", "#06b6d4", "#059669", "#d97706", "#dc2626", "#3b82f6", "#ec4899", "#f59e0b"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function RobotTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { AGV: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", AMR: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", "Robotic Arm": "bg-blue-100 text-blue-700 dark:bg-blue-900/30", "Conveyor Bot": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", "Sorting Bot": "bg-amber-100 text-amber-700 dark:bg-amber-900/30", "Pallet Jack Bot": "bg-orange-100 text-orange-700 dark:bg-orange-900/30", Drone: "bg-sky-100 text-sky-700 dark:bg-sky-900/30", "Picker Bot": "bg-pink-100 text-pink-700 dark:bg-pink-900/30" }
  return <span className={"wah-robot-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{ROBOT_EMOJI[type] || "\u2022"} {type}</span>
}

function TaskBadge({ task }: { task: string }) {
  return <span className="wah-task-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">{TASK_EMOJI[task] || "\u2022"} {task.replace(/_/g, " ")}</span>
}

function RobotStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { active: "wah-active bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", idle: "wah-idle bg-gray-100 text-gray-500 dark:bg-gray-900/30", charging: "wah-charging bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 animate-pulse", maintenance: "wah-maint bg-amber-100 text-amber-700 dark:bg-amber-900/30", error: "wah-error bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]", offline: "wah-offline bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500" }
  const icons: Record<string, React.ReactNode> = { active: <Radio className="w-3 h-3" />, idle: <Clock className="w-3 h-3" />, charging: <Battery className="w-3 h-3" />, maintenance: <Wrench className="w-3 h-3" />, error: <AlertTriangle className="w-3 h-3" />, offline: <Wifi className="w-3 h-3" /> }
  return <span className={"wah-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{icons[status]} {status}</span>
}

function BatteryGauge({ value }: { value: number }) {
  const col = value >= 60 ? TH.ok : value >= 25 ? TH.warn : TH.err
  return <div className="wah-battery-gauge flex items-center gap-1.5"><div className="w-12 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function EffBar({ value }: { value: number }) {
  const col = value >= 80 ? TH.ok : value >= 50 ? TH.warn : TH.err
  return <div className="wah-eff-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="wah-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) {
  return <span className="wah-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/20">{city}</span>
}

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) {
  return <Card className="wah-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card>
}

function ValueTile({ label, value }: { label: string; value: string | number }) {
  return <div className="wah-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}

function HealthRing({ value, label }: { value: number; label: string }) {
  const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err
  const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ
  return <div className="wah-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div>
}

function TempBadge({ temp }: { temp: number }) {
  const col = temp > 35 ? TH.err : temp > 28 ? TH.warn : TH.ok
  return <span className="wah-temp-badge inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: col }}><Thermometer className="w-3 h-3"/>{temp}\u00b0C</span>
}

function UptimeBadge({ hours }: { hours: number }) {
  const col = hours >= 720 ? TH.ok : hours >= 360 ? TH.warn : TH.err
  return <span className="wah-uptime-badge inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: col }}><ShieldCheck className="w-3 h-3"/>{hours}h</span>
}

function genRobots() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: "RB-" + String(i + 1).padStart(4, "0"),
    type: pick(ROBOT_TYPES, i * 3 + 2),
    name: pick(["Atlas-Prime", "NanoHaul-X", "SwiftPick", "HeavyLift Pro", "SortMaster", "PackBot AI", "ScanDrone", "ChargeRover", "CargoMole", "Picker One", "StowBot", "FleetRunner", "ZoneCruiser", "SkySorter", "GroundHog", "AeroFetch"], i * 3 + 3),
    zone: pick(ZONES, i * 3 + 4),
    city: pick(CITIES, i * 3 + 5),
    battery: pick(ROBOT_STATUS, i + 1) === "charging" ? ri(5, 95, i + 7) : ri(20, 100, i + 11),
    efficiency: ri(40, 98, i + 13),
    tasksCompleted: ri(50, 2000, i + 17),
    tasksPerHour: ri(10, 120, i + 19),
    currentTask: pick(ROBOT_STATUS, i + 1) === "active" ? pick(TASK_TYPES, i + 23) : null,
    uptime: ri(100, 2000, i + 29),
    temperature: ri(22, 42, i + 31),
    speed: ri(1, 15, i + 37),
    payload: ri(5, 500, i + 41),
    firmware: "v" + ri(1, 5, i + 43) + "." + ri(0, 9, i + 47) + "." + ri(0, 20, i + 51),
    lastMaintenance: "2026-07-" + String(ri(1, 30, i + 53)).padStart(2, "0"),
    status: pick(ROBOT_STATUS, i + 1)
  }))
}

function genTasks() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: "TSK-" + String(i + 1).padStart(5, "0"),
    type: pick(TASK_TYPES, i * 3 + 2),
    robot: "RB-" + String(ri(1, 60, i + 7)).padStart(4, "0"),
    zone: pick(ZONES, i * 3 + 8),
    priority: pick(["high", "medium", "low"], i + 11),
    status: pick(["completed", "in_progress", "queued", "failed", "cancelled"], i + 13),
    duration: ri(2, 45, i + 17),
    items: ri(1, 200, i + 19),
    weight: ri(1, 500, i + 23),
    accuracy: ri(85, 100, i + 29),
    timestamp: "2026-07-" + String(ri(1, 30, i + 31)).padStart(2, "0") + " " + String(ri(6, 22, i + 37)).padStart(2, "0") + ":" + String(ri(0, 59, i + 41)).padStart(2, "0")
  }))
}

function genAlerts() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: "ALT-" + String(i + 1).padStart(4, "0"),
    type: pick(["battery_low", "overheating", "collision_risk", "path_blocked", "signal_lost", "task_timeout", "maintenance_due", "anomaly_detected", "payload_exceeded", "zone_unreachable"], i + 3),
    robot: "RB-" + String(ri(1, 60, i + 7)).padStart(4, "0"),
    zone: pick(ZONES, i + 11),
    severity: pick(["critical", "warning", "info", "info"], i + 13),
    message: pick(["Battery below 15%", "Temperature exceeds 40C", "Collision risk detected", "Path blocked by obstacle", "Signal lost for 30s", "Task timeout after 20 min", "Scheduled maintenance overdue", "Behavior anomaly detected", "Payload exceeds limit", "Zone temporarily unreachable"], i + 17),
    resolved: pick([true, false, false], i + 21),
    timestamp: "2026-07-" + String(ri(1, 30, i + 23)).padStart(2, "0") + " " + String(ri(0, 23, i + 29)).padStart(2, "0") + ":" + String(ri(0, 59, i + 31)).padStart(2, "0")
  }))
}

function genCharts() {
  const hourly = MO.map((m, i) => ({ month: m, tasks: ri(5000, 25000, i + 101), automated: ri(4000, 22000, i + 151), manual: ri(500, 5000, i + 201), errors: ri(10, 200, i + 251) }))
  const typeDist = ROBOT_TYPES.map((t, i) => ({ type: t, count: ri(3, 15, i + 301), avgEff: ri(60, 95, i + 351) }))
  const zoneUtil = ZONES.map((z, i) => ({ zone: z, utilization: ri(30, 95, i + 401), throughput: ri(200, 3000, i + 451), robots: ri(3, 15, i + 501) }))
  const alertTrend = MO.map((m, i) => ({ month: m, critical: ri(1, 10, i + 551), warning: ri(5, 30, i + 601), resolved: ri(10, 40, i + 651) }))
  return { hourly, typeDist, zoneUtil, alertTrend }
}

export default function WarehouseAutomationHubView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const robots = useMemo(() => genRobots(), [])
  const tasks = useMemo(() => genTasks(), [])
  const alerts = useMemo(() => genAlerts(), [])
  const charts = useMemo(() => genCharts(), [])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const sortIcon = (f: string) => sortField === f ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""

  const filterRobots = useMemo(() => {
    if (!search) return robots
    const lq = search.toLowerCase()
    return robots.filter(r => Object.values(r).some(v => typeof v === "string" && v.toLowerCase().includes(lq)))
  }, [robots, search])
  const sortedRobots = useMemo(() => [...filterRobots].sort((a, b) => { const va = a[sortField as keyof typeof a], vb = b[sortField as keyof typeof b]; if (va == null || vb == null) return 0; return sortDir === "asc" ? String(va).localeCompare(String(vb), undefined, { numeric: true }) : -String(va).localeCompare(String(vb), undefined, { numeric: true }) }), [filterRobots, sortField, sortDir])

  const filterTasks = useMemo(() => {
    if (!search) return tasks
    const lq = search.toLowerCase()
    return tasks.filter(t => Object.values(t).some(v => typeof v === "string" && v.toLowerCase().includes(lq)))
  }, [tasks, search])

  const activeRobots = robots.filter(r => r.status === "active").length
  const avgEff = Math.round(robots.reduce((s, r) => s + r.efficiency, 0) / robots.length)
  const errorCount = robots.filter(r => r.status === "error").length
  const totalTasksDone = tasks.filter(t => t.status === "completed").length

  const handleRefresh = () => { setSearch(""); setSortField("id"); setSortDir("asc"); setActiveFilters({}) }
  const toggleFilter = (group: string, value: string) => {
    setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } })
  }
  const clearAllFilters = () => setActiveFilters({})
  const totalActiveFilters = Object.values(activeFilters).reduce((s, v) => s + v.length, 0)

  const robotFilterGroups = useMemo(() => {
    const tc: Record<string, number> = {}; const sc: Record<string, number> = {}
    robots.forEach(r => { tc[r.type] = (tc[r.type] || 0) + 1; sc[r.status] = (sc[r.status] || 0) + 1 })
    return [
      { key: "type", label: "Type", options: Object.entries(tc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) },
      { key: "status", label: "Status", options: Object.entries(sc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) },
      { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: robots.filter(r => r.zone === z).length })) }
    ]
  }, [robots])

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile label="Active Robots" value={String(activeRobots)} icon={<Bot className="w-4 h-4 text-violet-500"/>} trend={6.3} color={TH.pri}/>
        <KpiTile label="Avg Efficiency" value={avgEff + "%"} icon={<Zap className="w-4 h-4 text-cyan-500"/>} trend={4.1} color={TH.sec}/>
        <KpiTile label="Errors" value={String(errorCount)} icon={<AlertTriangle className="w-4 h-4 text-red-500"/>} trend={-12.5} color={TH.err}/>
        <KpiTile label="Tasks Done" value={String(totalTasksDone)} icon={<CheckCircle2 className="w-4 h-4 text-emerald-500"/>} trend={9.8} color={TH.ok}/>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <HealthRing value={avgEff} label="Fleet Efficiency"/>
        <HealthRing value={Math.round(robots.filter(r => r.battery >= 50).length / robots.length * 100)} label="Battery OK"/>
        <HealthRing value={Math.round(robots.filter(r => r.uptime >= 500).length / robots.length * 100)} label="Uptime Good"/>
        <HealthRing value={Math.round((1 - errorCount / robots.length) * 100)} label="Reliability"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="wah-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Automation vs Manual Tasks</CardTitle></CardHeader><CardContent><AreaChart data={charts.hourly} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Area type="monotone" dataKey="automated" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/><Area type="monotone" dataKey="manual" stroke={TH.warn} fill={TH.warn} fillOpacity={0.15}/><Line type="monotone" dataKey="errors" stroke={TH.err} strokeWidth={2} dot={{ r: 3 }}/></AreaChart></CardContent></Card>
        <Card className="wah-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Robot Type Distribution</CardTitle></CardHeader><CardContent><BarChart data={charts.typeDist} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="type" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="count" fill={TH.pri} radius={[2, 2, 0, 0]}/><Bar dataKey="avgEff" fill={TH.ok} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card>
        <Card className="wah-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Zone Utilization</CardTitle></CardHeader><CardContent><BarChart data={charts.zoneUtil} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="zone" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="utilization" fill={TH.sec} radius={[2, 2, 0, 0]}/><Bar dataKey="throughput" fill={TH.ok} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card>
        <Card className="wah-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Alert Trend</CardTitle></CardHeader><CardContent><LineChart data={charts.alertTrend} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Line type="monotone" dataKey="critical" stroke={TH.err} strokeWidth={2} dot={{ r: 3 }}/><Line type="monotone" dataKey="warning" stroke={TH.warn} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }}/><Line type="monotone" dataKey="resolved" stroke={TH.ok} strokeWidth={2} dot={{ r: 3 }}/></LineChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <ModuleBreadcrumb items={[{ label: "Warehouse" }, { label: "Automation" }, { label: "Robot Fleet" }]}/>
      <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={robotFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={robots.length} filteredCount={sortedRobots.length} onRefresh={handleRefresh} placeholder="Search robots by name, type, zone..." />
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]">
        <table className="wah-table w-full text-xs"><thead className="bg-violet-50 dark:bg-violet-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("name")}>Name {sortIcon("name")}</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Zone</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Battery</th><th className="p-2 text-left">Efficiency</th><th className="p-2 text-right">Tasks/Hr</th><th className="p-2 text-left">Temp</th><th className="p-2 text-right">Uptime</th></tr></thead><tbody>{sortedRobots.map(r => <tr key={r.id} className="wah-table-row border-t hover:bg-violet-50/50 dark:hover:bg-violet-900/10 cursor-pointer" onClick={() => setDetail(r as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{r.id}</td><td className="p-2 font-medium">{r.name}</td><td className="p-2"><RobotTypeBadge type={r.type}/></td><td className="p-2"><span className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-gray-50 dark:bg-gray-800">{r.zone}</span></td><td className="p-2"><RobotStatusBadge status={r.status}/></td><td className="p-2"><BatteryGauge value={r.battery}/></td><td className="p-2"><EffBar value={r.efficiency}/></td><td className="p-2 text-right font-medium">{r.tasksPerHour}</td><td className="p-2"><TempBadge temp={r.temperature}/></td><td className="p-2 text-right"><UptimeBadge hours={r.uptime}/></td></tr>)}</tbody></table>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>Showing {sortedRobots.length} of {robots.length} robots</span>{totalActiveFilters > 0 && <span>{totalActiveFilters} filters active</span>}</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <ModuleBreadcrumb items={[{ label: "Warehouse" }, { label: "Automation" }, { label: "Tasks" }]}/>
      <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={[]} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={tasks.length} filteredCount={filterTasks.length} onRefresh={handleRefresh} placeholder="Search tasks..." />
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]">
        <table className="wah-table w-full text-xs"><thead className="bg-cyan-50 dark:bg-cyan-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Robot</th><th className="p-2 text-left">Zone</th><th className="p-2 text-left">Priority</th><th className="p-2 text-left">Status</th><th className="p-2 text-right">Duration</th><th className="p-2 text-right">Items</th><th className="p-2 text-right">Accuracy</th></tr></thead><tbody>{filterTasks.map(t => <tr key={t.id} className="wah-table-row border-t hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 cursor-pointer" onClick={() => setDetail(t as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{t.id}</td><td className="p-2"><TaskBadge task={t.type}/></td><td className="p-2 font-mono text-[10px]">{t.robot}</td><td className="p-2 text-[10px]">{t.zone}</td><td className="p-2"><span className={"inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium " + (t.priority === "high" ? "bg-red-100 text-red-700" : t.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{t.priority}</span></td><td className="p-2"><span className={"inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium " + (t.status === "completed" ? "bg-emerald-100 text-emerald-700" : t.status === "in_progress" ? "bg-blue-100 text-blue-700" : t.status === "failed" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600")}>{t.status.replace(/_/g, " ")}</span></td><td className="p-2 text-right">{t.duration} min</td><td className="p-2 text-right">{t.items}</td><td className="p-2 text-right"><span className="text-[10px] font-bold" style={{ color: t.accuracy >= 95 ? TH.ok : t.accuracy >= 85 ? TH.warn : TH.err }}>{t.accuracy}%</span></td></tr>)}</tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filterTasks.length} tasks</div>
    </div>
  )

  const tab3 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.map(al => (
          <Card key={al.id} className={"wah-alert-card glass-subtle transition-shadow " + (al.severity === "critical" ? "border-red-300 dark:border-red-700 shadow-[0_0_8px_rgba(220,38,38,0.2)]" : al.severity === "warning" ? "border-amber-300 dark:border-amber-700" : "border-gray-200 dark:border-gray-700")}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between"><span className="font-mono text-[10px] text-muted-foreground">{al.id}</span><span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (al.severity === "critical" ? "wah-alert-crit bg-red-100 text-red-700 shadow-[0_0_6px_rgba(220,38,38,0.3)]" : al.severity === "warning" ? "wah-alert-warn bg-amber-100 text-amber-700" : "wah-alert-info bg-blue-100 text-blue-700")}>{al.severity === "critical" ? <AlertTriangle className="w-3 h-3"/> : al.severity === "warning" ? <Zap className="w-3 h-3"/> : <Settings className="w-3 h-3"/>}{al.severity}</span></div>
              <div className="text-xs font-medium">{al.message}</div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>Robot: {al.robot} | {al.zone}</span>{al.resolved ? <span className="text-emerald-600 font-medium flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3"/>Resolved</span> : <span className="text-red-600 font-medium">Unresolved</span>}</div>
              <div className="text-[10px] text-muted-foreground">{al.timestamp}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tab4 = (
    <div className="space-y-4">
      <ModuleBreadcrumb items={[{ label: "Warehouse" }, { label: "Automation" }, { label: "Insights" }]}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="wah-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-violet-600">{robots.filter(r => r.status === "charging").length}</div><div className="text-[10px] text-muted-foreground mt-1">Charging Now</div></CardContent></Card>
        <Card className="wah-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-cyan-600">{robots.reduce((s, r) => s + r.tasksCompleted, 0).toLocaleString()}</div><div className="text-[10px] text-muted-foreground mt-1">Total Tasks Done</div></CardContent></Card>
        <Card className="wah-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-emerald-600">{alerts.filter(a => a.resolved).length}/{alerts.length}</div><div className="text-[10px] text-muted-foreground mt-1">Alerts Resolved</div></CardContent></Card>
        <Card className="wah-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-amber-600">{avgEff}%</div><div className="text-[10px] text-muted-foreground mt-1">Avg Fleet Efficiency</div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="wah-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Robot Status Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={ROBOT_STATUS.map(s => ({ name: s, value: robots.filter(r => r.status === s).length }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{ROBOT_STATUS.map((_, i) => <Cell key={i} fill={PC[i % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
        <Card className="wah-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Task Type Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={TASK_TYPES.map(t => ({ name: t, value: tasks.filter(tk => tk.type === t).length }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{TASK_TYPES.map((_, i) => <Cell key={i} fill={PC[(i + 3) % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
      </div>
    </div>
  )

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-3.5 h-3.5" />, content: tab0 },
    { key: "robots", label: "Robot Fleet", icon: <Bot className="w-3.5 h-3.5" />, content: tab1 },
    { key: "tasks", label: "Task Queue", icon: <Cpu className="w-3.5 h-3.5" />, content: tab2 },
    { key: "alerts", label: "Alerts", icon: <AlertTriangle className="w-3.5 h-3.5" />, content: tab3 },
    { key: "insights", label: "Insights", icon: <Eye className="w-3.5 h-3.5" />, content: tab4 }
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Warehouse Automation Hub" description="AI-powered warehouse robotics command center with real-time fleet monitoring, task orchestration, and predictive maintenance alerts"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"><Bot className="w-3 h-3 text-violet-600"/><span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">{activeRobots} Robots Active</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><CheckCircle2 className="w-3 h-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{avgEff}% Efficiency</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30"><Wifi className="w-3 h-3 text-cyan-600"/><span className="text-[10px] font-semibold text-cyan-700 dark:text-cyan-300">{robots.length} Fleet Size</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30"><AlertTriangle className="w-3 h-3 text-red-600"/><span className="text-[10px] font-semibold text-red-700 dark:text-red-300">{alerts.filter(a => !a.resolved).length} Unresolved Alerts</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-violet-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Detail View</SheetTitle></SheetHeader>
          {detail && <div className="mt-4 space-y-3">
            <div className="wah-detail-header rounded-lg p-4 bg-gradient-to-br from-violet-500 to-cyan-600 text-white"><div className="text-lg font-bold">{String(detail.id)}</div><div className="text-xs opacity-80 mt-1">{String(detail.name || detail.type || "Record")}</div></div>
            {Object.entries(detail).filter(([k]) => k !== "id").map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b"><span className="text-[10px] text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><span className="text-xs font-medium">{v === null ? "N/A" : typeof v === "number" ? v.toLocaleString() : String(v)}</span></div>)}
          </div>}
        </SheetContent>
      </Sheet>
    </div>
  )
}