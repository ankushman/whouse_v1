"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Lock, Unlock, KeyRound, QrCode, Zap, AlertTriangle, CheckCircle2, Route, Activity, Thermometer, Users, Box, Wifi, Battery, Bell, ShieldCheck, Clock, DollarSign, Smartphone } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const LOCKER_TYPES = ["standard", "large", "refrigerated", "climate_controlled", "oversized", "express", "premium"] as const
const LOCKER_STATUS = ["available", "occupied", "maintenance", "out_of_service", "reserved", "collecting"] as const
const LOCKER_SIZES = ["S", "M", "L", "XL", "XXL"] as const
const REGIONS = ["Mumbai Metro", "Delhi NCR", "Bangalore Urban", "Chennai Metro", "Hyderabad City", "Pune Region", "Kolkata Metro", "Ahmedabad Zone"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"] as const
const USAGE_BANDS = ["low", "medium", "high", "critical"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#8b5cf6", sec: "#06b6d4", ter: "#f59e0b", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#8b5cf6", "#06b6d4", "#059669", "#f59e0b", "#dc2626", "#ec4899", "#14b8a6", "#3b82f6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function LockerTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { standard: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", large: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", refrigerated: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", climate_controlled: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", oversized: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", express: "bg-pink-100 text-pink-700 dark:bg-pink-900/30", premium: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30" }
  return <span className={"slf-type-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{type.replace(/_/g, " ")}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { available: "slf-available bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", occupied: "slf-occupied bg-blue-100 text-blue-700 dark:bg-blue-900/30 shadow-[0_0_6px_rgba(59,130,246,0.3)]", maintenance: "slf-maintenance bg-amber-100 text-amber-700 dark:bg-amber-900/30", out_of_service: "slf-out-of-service bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]", reserved: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", collecting: "slf-collecting bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 shadow-[0_0_6px_rgba(6,182,212,0.3)]" }
  return <span className={"slf-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function SizeBadge({ size }: { size: string }) {
  const cols: Record<string, string> = { S: "bg-gray-100 text-gray-600", M: "bg-blue-100 text-blue-700", L: "bg-violet-100 text-violet-700", XL: "bg-amber-100 text-amber-700", XXL: "bg-red-100 text-red-700" }
  return <span className={"slf-size-badge inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold " + (cols[size] || "")}>{size}</span>
}

function UsageBadge({ band }: { band: string }) {
  const cols: Record<string, string> = { low: "bg-emerald-100 text-emerald-700", medium: "bg-blue-100 text-blue-700", high: "bg-amber-100 text-amber-700", critical: "slf-critical bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]" }
  return <span className={"slf-usage-badge inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase " + (cols[band] || "")}>{band}</span>
}

function RegionBadge({ region }: { region: string }) {
  return <span className={"slf-region-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700"}><MapPin className="w-2.5 h-2.5"/>{region}</span>
}

function UtilBar({ value }: { value: number }) {
  const col = value >= 90 ? TH.err : value >= 70 ? TH.warn : TH.ok
  return <div className="slf-util-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function RevenueBar({ value }: { value: number }) {
  const col = value >= 5000 ? TH.ok : value >= 2000 ? TH.sec : TH.warn
  return <div className="slf-revenue-bar flex items-center gap-1.5"><div className="w-14 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: Math.min(value / 8000 * 100, 100) + "%", backgroundColor: col }}/></div><span className="text-[10px] font-semibold" style={{ color: col }}>&#8377;{value.toLocaleString()}</span></div>
}

function HealthRing({ pct, label, color }: { pct: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, off = c - (pct / 100) * c
  return <div className="slf-health-ring flex flex-col items-center"><svg width="68" height="68" viewBox="0 0 68 68"><circle cx="34" cy="34" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6"/><circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 34 34)" className="transition-all duration-700"/><text x="34" y="38" textAnchor="middle" className="text-[11px] font-bold" fill={color}>{pct}%</text></svg><span className="text-[9px] text-gray-500 mt-0.5">{label}</span></div>
}

function KpiTile({ label, value, change, icon: Icon }: { label: string; value: string; change: number; icon: React.ComponentType<{ className?: string }> }) {
  return <div className="slf-kpi-tile bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-center justify-between mb-2"><span className="text-[11px] font-medium text-gray-500">{label}</span><Icon className="w-4 h-4 text-violet-500"/></div><div className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</div><div className={"flex items-center gap-1 mt-1 text-[10px] font-semibold " + (change >= 0 ? "text-emerald-600" : "text-red-500")}><span>{change >= 0 ? "+" : ""}{change}%</span></div></div>
}

function ValueTile({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="slf-value-tile bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"><div className="text-[10px] text-gray-500 mb-1">{label}</div><div className="text-lg font-bold" style={{ color }}>{value}</div></div>
}

const lockers = Array.from({ length: 60 }, (_, i) => {
  const seed = i * 137 + 42
  const status = pick(LOCKER_STATUS, seed)
  const usage = status === "available" ? 0 : ri(5, 98, seed + 1)
  const band = usage >= 90 ? "critical" : usage >= 70 ? "high" : usage >= 30 ? "medium" : "low"
  return {
    id: "SLF-" + String(i + 1001).padStart(4, "0"), type: pick(LOCKER_TYPES, seed + 2), status, size: pick(LOCKER_SIZES, seed + 3),
    city: pick(CITIES, seed + 4), region: pick(REGIONS, seed + 5), location: pick(["Metro Station", "Mall", "Apartment Lobby", "Office Park", "Airport", "Hospital", "University", "Railway Station"], seed + 6),
    usage, band, revenue: ri(500, 8500, seed + 7), parcels: ri(0, 120, seed + 8), battery: ri(15, 100, seed + 9),
    temp: ri(2, 35, seed + 10), humidity: ri(20, 95, seed + 11), lastService: MO[ri(0, 11, seed + 12)] + " " + ri(1, 28, seed + 13),
    uptime: ri(90, 100, seed + 14), collects: ri(0, 45, seed + 15)
  }
})

const monthlyData = MO.map((m, i) => ({ month: m, revenue: ri(120, 280, i * 7 + 1), parcels: ri(800, 2200, i * 7 + 2), utilisation: ri(55, 95, i * 7 + 3), active: ri(45, 58, i * 7 + 4) }))
const typeDist = LOCKER_TYPES.map((t, i) => ({ name: t.replace(/_/g, " "), value: ri(8, 18, i * 31) }))

export default function SmartLockerFleetView() {
  const [tab, setTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filteredLockers = useMemo(() => {
    return lockers.filter(l => {
      if (searchQuery && !l.id.toLowerCase().includes(searchQuery.toLowerCase()) && !l.city.toLowerCase().includes(searchQuery.toLowerCase()) && !l.location.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters["type"] && !activeFilters["type"].includes(l.type)) return false
      if (activeFilters["status"] && !activeFilters["status"].includes(l.status)) return false
      if (activeFilters["region"] && !activeFilters["region"].includes(l.region)) return false
      return true
    })
  }, [searchQuery, activeFilters])

  const filterGroups = [
    { key: "type", label: "Type", options: LOCKER_TYPES.map(t => ({ value: t, label: t.replace(/_/g, " "), count: 0 })) },
    { key: "status", label: "Status", options: LOCKER_STATUS.map(s => ({ value: s, label: s.replace(/_/g, " "), count: 0 })) },
    { key: "region", label: "Region", options: REGIONS.map(r => ({ value: r, label: r, count: 0 })) }
  ]

  const totalLockers = lockers.length
  const totalRevenue = lockers.reduce((s, l) => s + l.revenue, 0)
  const avgUtil = Math.round(lockers.reduce((s, l) => s + l.usage, 0) / totalLockers)
  const totalParcels = lockers.reduce((s, l) => s + l.parcels, 0)

  return (
    <div className="space-y-4">
      <PageHeader title="Smart Locker Fleet Management" description="Monitor and manage the smart locker network across India" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="slf-tabs-list">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="lockers">Lockers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <KpiTile label="Total Lockers" value={String(totalLockers)} change={12} icon={Box} />
            <KpiTile label="Monthly Revenue" value={"&#8377;" + (totalRevenue / 1000).toFixed(1) + "K"} change={8} icon={DollarSign} />
            <KpiTile label="Avg Utilisation" value={avgUtil + "%"} change={5} icon={Activity} />
            <KpiTile label="Total Parcels" value={totalParcels.toLocaleString()} change={15} icon={Package} />
          </div>
          <div className="flex gap-6 mb-4 justify-center flex-wrap">
            <HealthRing pct={94} label="Network Uptime" color={TH.ok} />
            <HealthRing pct={72} label="Utilisation" color={TH.sec} />
            <HealthRing pct={88} label="Availability" color={TH.pri} />
            <HealthRing pct={96} label="Battery Health" color={TH.ok} />
            <HealthRing pct={85} label="Revenue Target" color={TH.sec} />
            <HealthRing pct={91} label="SLA Compliance" color={TH.ok} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="slf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Revenue Trend</CardTitle></CardHeader><CardContent><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="revenue" stroke={TH.pri} strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="slf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Parcels Processed</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="parcels" fill={TH.sec} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="slf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Utilisation Rate</CardTitle></CardHeader><CardContent><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="utilisation" stroke={TH.ter} fill="rgba(245,158,11,0.15)" strokeWidth={2} /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="lockers">
          <ModuleBreadcrumb items={[{ label: "Fleet Management" }, { label: "All Lockers" }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalLockers} filteredCount={filteredLockers.length} onRefresh={() => {}} placeholder="Search lockers by ID, city, or location..." />
          <Card className="slf-table-card"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><th className="px-3 py-2 text-left font-semibold">ID</th><th className="px-3 py-2 text-left font-semibold">Type</th><th className="px-3 py-2 text-left font-semibold">Status</th><th className="px-3 py-2 text-left font-semibold">Size</th><th className="px-3 py-2 text-left font-semibold">City</th><th className="px-3 py-2 text-left font-semibold">Location</th><th className="px-3 py-2 text-left font-semibold">Usage</th><th className="px-3 py-2 text-left font-semibold">Revenue</th><th className="px-3 py-2 text-left font-semibold">Battery</th><th className="px-3 py-2 text-left font-semibold">Parcels</th></tr></thead><tbody>
            {filteredLockers.slice(0, 30).map((l, i) => (
              <tr key={l.id} className="slf-table-row border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-3 py-2 font-mono font-semibold text-violet-600">{l.id}</td>
                <td className="px-3 py-2"><LockerTypeBadge type={l.type} /></td>
                <td className="px-3 py-2"><StatusBadge status={l.status} /></td>
                <td className="px-3 py-2"><SizeBadge size={l.size} /></td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{l.city}</td>
                <td className="px-3 py-2"><RegionBadge region={l.location} /></td>
                <td className="px-3 py-2"><UtilBar value={l.usage} /></td>
                <td className="px-3 py-2"><RevenueBar value={l.revenue} /></td>
                <td className="px-3 py-2"><div className="flex items-center gap-1"><Battery className="w-3 h-3"/><span className="text-[10px]">{l.battery}%</span></div></td>
                <td className="px-3 py-2 font-semibold">{l.parcels}</td>
              </tr>
            ))}
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="analytics">
          <ModuleBreadcrumb items={[{ label: "Fleet Management" }, { label: "Analytics" }]} />
          <div className="grid grid-cols-4 gap-4 mb-4">
            <ValueTile label="Available Lockers" value={String(lockers.filter(l => l.status === "available").length)} color={TH.ok} />
            <ValueTile label="Occupied Lockers" value={String(lockers.filter(l => l.status === "occupied").length)} color={TH.pri} />
            <ValueTile label="Avg Revenue/Locker" value={"&#8377;" + Math.round(totalRevenue / totalLockers).toLocaleString()} color={TH.sec} />
            <ValueTile label="Pending Collections" value={String(lockers.reduce((s, l) => s + l.collects, 0))} color={TH.ter} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="slf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Locker Type Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={typeDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}><Cell fill={PC[0]} /><Cell fill={PC[1]} /><Cell fill={PC[2]} /><Cell fill={PC[3]} /><Cell fill={PC[4]} /><Cell fill={PC[5]} /><Cell fill={PC[6]} /></Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="slf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Active Lockers</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="active" fill={TH.pri} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <ModuleBreadcrumb items={[{ label: "Fleet Management" }, { label: "Insights" }]} />
          <div className="grid grid-cols-2 gap-4">
            <Card className="slf-insight-card border-l-4 border-l-violet-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-violet-600" /><span className="font-semibold text-sm">High Demand Zones</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Mumbai Metro and Delhi NCR show 85%+ utilisation. Consider deploying 15 additional lockers in these regions to reduce waitlist and improve customer satisfaction.</p></CardContent></Card>
            <Card className="slf-insight-card border-l-4 border-l-cyan-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-cyan-600" /><span className="font-semibold text-sm">Battery Alert</span></div><p className="text-xs text-gray-600 dark:text-gray-400">8 lockers have battery below 25%. Schedule proactive maintenance visits to prevent downtime. SLF-1014, SLF-1017, SLF-1023 are top priority.</p></CardContent></Card>
            <Card className="slf-insight-card border-l-4 border-l-emerald-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="font-semibold text-sm">Revenue Growth</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Monthly revenue increased 12% MoM. Premium and express locker categories are driving growth with 18% higher margins than standard units.</p></CardContent></Card>
            <Card className="slf-insight-card border-l-4 border-l-amber-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-600" /><span className="font-semibold text-sm">Maintenance Backlog</span></div><p className="text-xs text-gray-600 dark:text-gray-400">4 lockers in out-of-service status for over 72 hours. Escalate to field service team for immediate resolution to maintain SLA targets.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
