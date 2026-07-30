"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Grid2x2Plus, AlertTriangle, CheckCircle2, Route, Activity, Thermometer, Users, Box, ScanBarcode, Zap, Lock, Unlock, Eye, Move, RotateCw, Clock, DollarSign } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const ZONE_TYPES = ["receiving", "bulk_storage", "picking", "packing", "shipping", "quality", "cold_storage", "hazmat", "returns", "staging"] as const
const ZONE_STATUS = ["active", "under_maintenance", "full", "locked", "reconfiguring", "idle"] as const
const FLOOR_TYPES = ["ground", "mezzanine", "upper", "basement", "roof"] as const
const WAREHOUSES = ["Mumbai DC-1", "Delhi DC-2", "Bangalore DC-3", "Chennai DC-4", "Hyderabad DC-5", "Pune DC-6", "Kolkata DC-7", "Ahmedabad DC-8"] as const
const RACK_TYPES = ["selective", "drive_in", "push_back", "mobile", "high_bay", "carton_flow", "pallet_flow"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#2563eb", sec: "#7c3aed", ter: "#059669", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#2563eb", "#7c3aed", "#059669", "#f59e0b", "#dc2626", "#8b5cf6", "#ec4899", "#14b8a6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function ZoneTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { receiving: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", bulk_storage: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", picking: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", packing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", shipping: "bg-sky-100 text-sky-700", quality: "bg-pink-100 text-pink-700", cold_storage: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", hazmat: "wdf-hazmat bg-red-100 text-red-700 dark:bg-red-900/30", returns: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", staging: "bg-gray-100 text-gray-700" }
  return <span className={"wdf-type-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{type.replace(/_/g, " ")}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { active: "wdf-active bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", under_maintenance: "wdf-maintenance bg-amber-100 text-amber-700 dark:bg-amber-900/30", full: "wdf-full bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]", locked: "wdf-locked bg-violet-100 text-violet-700 dark:bg-violet-900/30", reconfiguring: "wdf-reconfiguring bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", idle: "bg-gray-200 text-gray-600 dark:bg-gray-700" }
  return <span className={"wdf-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function FloorBadge({ floor }: { floor: string }) {
  const cols: Record<string, string> = { ground: "bg-blue-100 text-blue-700", mezzanine: "bg-violet-100 text-violet-700", upper: "bg-indigo-100 text-indigo-700", basement: "bg-gray-100 text-gray-600", roof: "bg-amber-100 text-amber-700" }
  return <span className={"wdf-floor-badge inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold " + (cols[floor] || "")}>{floor}</span>
}

function RackBadge({ type }: { type: string }) {
  return <span className={"wdf-rack-badge inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700"}>{type.replace(/_/g, " ")}</span>
}

function UtilBar({ value }: { value: number }) {
  const col = value >= 95 ? TH.err : value >= 80 ? TH.warn : TH.ok
  return <div className="wdf-util-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function SlotBar({ used, total }: { used: number; total: number }) {
  const pct = Math.round((used / total) * 100); const col = pct >= 95 ? TH.err : pct >= 80 ? TH.warn : TH.ok
  return <div className="wdf-slot-bar flex items-center gap-1.5"><div className="w-14 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: pct + "%", backgroundColor: col }}/></div><span className="text-[10px] font-semibold" style={{ color: col }}>{used}/{total}</span></div>
}

function HealthRing({ pct, label, color }: { pct: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, off = c - (pct / 100) * c
  return <div className="wdf-health-ring flex flex-col items-center"><svg width="68" height="68" viewBox="0 0 68 68"><circle cx="34" cy="34" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6"/><circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 34 34)" className="transition-all duration-700"/><text x="34" y="38" textAnchor="middle" className="text-[11px] font-bold" fill={color}>{pct}%</text></svg><span className="text-[9px] text-gray-500 mt-0.5">{label}</span></div>
}

function KpiTile({ label, value, change, icon: Icon }: { label: string; value: string; change: number; icon: React.ComponentType<{ className?: string }> }) {
  return <div className="wdf-kpi-tile bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-center justify-between mb-2"><span className="text-[11px] font-medium text-gray-500">{label}</span><Icon className="w-4 h-4 text-blue-500"/></div><div className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</div><div className={"flex items-center gap-1 mt-1 text-[10px] font-semibold " + (change >= 0 ? "text-emerald-600" : "text-red-500")}><span>{change >= 0 ? "+" : ""}{change}%</span></div></div>
}

function ValueTile({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="wdf-value-tile bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"><div className="text-[10px] text-gray-500 mb-1">{label}</div><div className="text-lg font-bold" style={{ color }}>{value}</div></div>
}

const zones = Array.from({ length: 65 }, (_, i) => {
  const seed = i * 257 + 61
  const status = pick(ZONE_STATUS, seed)
  const totalSlots = ri(50, 500, seed + 1)
  const usedSlots = status === "full" ? totalSlots : status === "idle" ? ri(0, 10, seed + 2) : ri(10, totalSlots, seed + 2)
  return {
    id: "WDF-" + String(i + 3001).padStart(4, "0"), type: pick(ZONE_TYPES, seed + 3), status,
    floor: pick(FLOOR_TYPES, seed + 4), warehouse: pick(WAREHOUSES, seed + 5),
    rackType: pick(RACK_TYPES, seed + 6), totalSlots, usedSlots,
    utilisation: Math.round((usedSlots / totalSlots) * 100),
    sqft: ri(500, 10000, seed + 7), aisles: ri(2, 12, seed + 8),
    temp: ri(18, 28, seed + 9), humidity: ri(35, 75, seed + 10),
    lastAudit: MO[ri(0, 11, seed + 11)] + " " + ri(1, 28, seed + 12),
    equipment: ri(2, 20, seed + 13)
  }
})

const monthlyData = MO.map((m, i) => ({ month: m, throughput: ri(5000, 15000, i * 17 + 1), utilisation: ri(65, 95, i * 17 + 2), reconfig: ri(1, 8, i * 17 + 3), audits: ri(2, 12, i * 17 + 4) }))
const zoneDist = ZONE_TYPES.map((z, i) => ({ name: z.replace(/_/g, " "), value: ri(5, 15, i * 43) }))

export default function WarehouseDigitalFloorPlanView() {
  const [tab, setTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filteredZones = useMemo(() => {
    return zones.filter(z => {
      if (searchQuery && !z.id.toLowerCase().includes(searchQuery.toLowerCase()) && !z.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) && !z.type.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters["type"] && !activeFilters["type"].includes(z.type)) return false
      if (activeFilters["status"] && !activeFilters["status"].includes(z.status)) return false
      if (activeFilters["floor"] && !activeFilters["floor"].includes(z.floor)) return false
      return true
    })
  }, [searchQuery, activeFilters])

  const filterGroups = [
    { key: "type", label: "Zone Type", options: ZONE_TYPES.map(t => ({ value: t, label: t.replace(/_/g, " "), count: 0 })) },
    { key: "status", label: "Status", options: ZONE_STATUS.map(s => ({ value: s, label: s.replace(/_/g, " "), count: 0 })) },
    { key: "floor", label: "Floor", options: FLOOR_TYPES.map(f => ({ value: f, label: f, count: 0 })) }
  ]

  const totalZones = zones.length
  const avgUtil = Math.round(zones.reduce((s, z) => s + z.utilisation, 0) / totalZones)
  const totalSqft = zones.reduce((s, z) => s + z.sqft, 0)
  const activeZones = zones.filter(z => z.status === "active").length

  return (
    <div className="space-y-4">
      <PageHeader title="Warehouse Digital Floor Plan" description="Visualize and optimize warehouse zone layouts, slot utilization and space planning" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="wdf-tabs-list">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <KpiTile label="Total Zones" value={String(totalZones)} change={8} icon={Grid2x2Plus} />
            <KpiTile label="Avg Utilisation" value={avgUtil + "%"} change={3} icon={Activity} />
            <KpiTile label="Total Sq Ft" value={(totalSqft / 100000).toFixed(1) + "L"} change={5} icon={Box} />
            <KpiTile label="Active Zones" value={String(activeZones)} change={-2} icon={Zap} />
          </div>
          <div className="flex gap-6 mb-4 justify-center flex-wrap">
            <HealthRing pct={avgUtil} label="Utilisation" color={TH.ok} />
            <HealthRing pct={91} label="Space Used" color={TH.pri} />
            <HealthRing pct={85} label="Pick Accuracy" color={TH.sec} />
            <HealthRing pct={97} label="Slot Accuracy" color={TH.ok} />
            <HealthRing pct={78} label="Automation" color={TH.ter} />
            <HealthRing pct={93} label="Audit Score" color={TH.pri} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="wdf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Throughput</CardTitle></CardHeader><CardContent><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="throughput" stroke={TH.pri} strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="wdf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Reconfigurations</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="reconfig" fill={TH.sec} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="wdf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Utilisation Trend</CardTitle></CardHeader><CardContent><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="utilisation" stroke={TH.ter} fill="rgba(5,150,105,0.15)" strokeWidth={2} /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="zones">
          <ModuleBreadcrumb items={[{ label: "Floor Plan" }, { label: "All Zones" }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalZones} filteredCount={filteredZones.length} onRefresh={() => {}} placeholder="Search zones by ID, warehouse, or type..." />
          <Card className="wdf-table-card"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><th className="px-3 py-2 text-left font-semibold">ID</th><th className="px-3 py-2 text-left font-semibold">Type</th><th className="px-3 py-2 text-left font-semibold">Status</th><th className="px-3 py-2 text-left font-semibold">Floor</th><th className="px-3 py-2 text-left font-semibold">Warehouse</th><th className="px-3 py-2 text-left font-semibold">Rack</th><th className="px-3 py-2 text-left font-semibold">Utilisation</th><th className="px-3 py-2 text-left font-semibold">Slots</th><th className="px-3 py-2 text-left font-semibold">Sq Ft</th><th className="px-3 py-2 text-left font-semibold">Equipment</th></tr></thead><tbody>
            {filteredZones.slice(0, 30).map((z) => (
              <tr key={z.id} className="wdf-table-row border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-3 py-2 font-mono font-semibold text-blue-600">{z.id}</td>
                <td className="px-3 py-2"><ZoneTypeBadge type={z.type} /></td>
                <td className="px-3 py-2"><StatusBadge status={z.status} /></td>
                <td className="px-3 py-2"><FloorBadge floor={z.floor} /></td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{z.warehouse}</td>
                <td className="px-3 py-2"><RackBadge type={z.rackType} /></td>
                <td className="px-3 py-2"><UtilBar value={z.utilisation} /></td>
                <td className="px-3 py-2"><SlotBar used={z.usedSlots} total={z.totalSlots} /></td>
                <td className="px-3 py-2 font-semibold">{z.sqft.toLocaleString()}</td>
                <td className="px-3 py-2 text-gray-600">{z.equipment}</td>
              </tr>
            ))}
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="layout">
          <ModuleBreadcrumb items={[{ label: "Floor Plan" }, { label: "Layout Analysis" }]} />
          <div className="grid grid-cols-4 gap-4 mb-4">
            <ValueTile label="Ground Floor Zones" value={String(zones.filter(z => z.floor === "ground").length)} color={TH.pri} />
            <ValueTile label="Mezzanine Zones" value={String(zones.filter(z => z.floor === "mezzanine").length)} color={TH.sec} />
            <ValueTile label="Total Aisles" value={String(zones.reduce((s, z) => s + z.aisles, 0))} color={TH.ok} />
            <ValueTile label="Full Zones" value={String(zones.filter(z => z.status === "full").length)} color={TH.err} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="wdf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Zone Type Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={zoneDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}><Cell fill={PC[0]} /><Cell fill={PC[1]} /><Cell fill={PC[2]} /><Cell fill={PC[3]} /><Cell fill={PC[4]} /><Cell fill={PC[5]} /><Cell fill={PC[6]} /><Cell fill={PC[7]} /><Cell fill={PC[0]} /><Cell fill={PC[1]} /></Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="wdf-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Audits</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="audits" fill={TH.pri} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <ModuleBreadcrumb items={[{ label: "Floor Plan" }, { label: "Insights" }]} />
          <div className="grid grid-cols-2 gap-4">
            <Card className="wdf-insight-card border-l-4 border-l-blue-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><Grid2x2Plus className="w-4 h-4 text-blue-600" /><span className="font-semibold text-sm">Slotting Optimization</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Picking zones at Delhi DC-2 show 30% higher travel distance than optimal. Re-slotting fast-moving SKUs to golden zones can reduce pick time by 22% and improve throughput by 1800 units/day.</p></CardContent></Card>
            <Card className="wdf-insight-card border-l-4 border-l-violet-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><RotateCw className="w-4 h-4 text-violet-600" /><span className="font-semibold text-sm">Zone Reconfiguration</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Mumbai DC-1 bulk storage is at 98% capacity. Recommend converting staging zone B3 to overflow storage. Estimated 2-day reconfiguration with minimal disruption to operations.</p></CardContent></Card>
            <Card className="wdf-insight-card border-l-4 border-l-emerald-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="font-semibold text-sm">Space Utilization</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Bangalore DC-3 achieved 94% space utilization after implementing high-bay racking. This model can be replicated to Chennai DC-4 and Hyderabad DC-5 for projected 15% capacity increase.</p></CardContent></Card>
            <Card className="wdf-insight-card border-l-4 border-l-amber-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-600" /><span className="font-semibold text-sm">Equipment Bottleneck</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Pune DC-6 picking zone has 3 forklifts for 8 aisles causing peak-hour congestion. Deploying 2 additional reach trucks during 10AM-2PM shift can reduce wait time by 40%.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
