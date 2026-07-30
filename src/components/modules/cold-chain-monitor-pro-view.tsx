"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Thermometer, Snowflake, AlertTriangle, CheckCircle2, Route, Activity, Truck, ShieldCheck, Clock, DollarSign, ThermometerSnowflake, ShieldAlert, CloudRain, Waves, FlaskConical, PackageCheck } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const PRODUCT_TYPES = ["pharmaceutical", "vaccine", "food_dairy", "frozen_meat", "seafood", "fresh_produce", "chemical", "biological"] as const
const SHIPMENT_STATUS = ["in_transit", "at_hub", "delivered", "alert", "delayed", "quarantine"] as const
const COLD_TYPES = ["chilled", "frozen", "ambient_controlled", "deep_frozen", "ultra_cold"] as const
const REGIONS = ["Mumbai Metro", "Delhi NCR", "Bangalore Urban", "Chennai Metro", "Hyderabad City", "Pune Region", "Kolkata Metro", "Ahmedabad Zone"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"] as const
const TEMP_BANDS = ["optimal", "warning", "critical", "breach"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#06b6d4", sec: "#3b82f6", ter: "#059669", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#06b6d4", "#3b82f6", "#059669", "#f59e0b", "#dc2626", "#8b5cf6", "#ec4899", "#14b8a6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function ProductBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { pharmaceutical: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", vaccine: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", food_dairy: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", frozen_meat: "bg-red-100 text-red-700 dark:bg-red-900/30", seafood: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", fresh_produce: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", chemical: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", biological: "bg-pink-100 text-pink-700 dark:bg-pink-900/30" }
  return <span className={"ccm-product-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{type.replace(/_/g, " ")}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { in_transit: "ccm-in-transit bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 shadow-[0_0_6px_rgba(6,182,212,0.3)]", at_hub: "ccm-at-hub bg-blue-100 text-blue-700 dark:bg-blue-900/30 shadow-[0_0_6px_rgba(59,130,246,0.3)]", delivered: "ccm-delivered bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", alert: "ccm-alert bg-amber-100 text-amber-700 dark:bg-amber-900/30 shadow-[0_0_6px_rgba(217,119,6,0.3)]", delayed: "ccm-delayed bg-orange-100 text-orange-700 dark:bg-orange-900/30", quarantine: "ccm-quarantine bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]" }
  return <span className={"ccm-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function ColdBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { chilled: "bg-blue-100 text-blue-700", frozen: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", ambient_controlled: "bg-emerald-100 text-emerald-700", deep_frozen: "ccm-deep-frozen bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30", ultra_cold: "ccm-ultra-cold bg-violet-100 text-violet-700 dark:bg-violet-900/30" }
  return <span className={"ccm-cold-badge inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold " + (cols[type] || "")}>{type.replace(/_/g, " ")}</span>
}

function TempBandBadge({ band }: { band: string }) {
  const cols: Record<string, string> = { optimal: "bg-emerald-100 text-emerald-700", warning: "bg-amber-100 text-amber-700", critical: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", breach: "ccm-breach bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]" }
  return <span className={"ccm-temp-band-badge inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase " + (cols[band] || "")}>{band}</span>
}

function TempGauge({ current, min, max }: { current: number; min: number; max: number }) {
  const range = max - min
  const pct = Math.round(((current - min) / range) * 100)
  const isOk = current >= min && current <= max
  const col = isOk ? TH.ok : current < min ? "#3b82f6" : TH.err
  return <div className="ccm-temp-gauge flex items-center gap-1.5"><Thermometer className="w-3 h-3" style={{ color: col }}/><span className={"text-[10px] font-bold " + (isOk ? "" : "text-red-600")}>{current}&deg;C</span><span className="text-[9px] text-gray-400">({min}&deg;-{max}&deg;C)</span></div>
}

function HumidityBar({ value }: { value: number }) {
  const col = value <= 30 ? TH.err : value >= 80 ? TH.warn : TH.ok
  return <div className="ccm-humidity-bar flex items-center gap-1.5"><div className="w-14 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-semibold" style={{ color: col }}>{value}%</span></div>
}

function HealthRing({ pct, label, color }: { pct: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, off = c - (pct / 100) * c
  return <div className="ccm-health-ring flex flex-col items-center"><svg width="68" height="68" viewBox="0 0 68 68"><circle cx="34" cy="34" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6"/><circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 34 34)" className="transition-all duration-700"/><text x="34" y="38" textAnchor="middle" className="text-[11px] font-bold" fill={color}>{pct}%</text></svg><span className="text-[9px] text-gray-500 mt-0.5">{label}</span></div>
}

function KpiTile({ label, value, change, icon: Icon }: { label: string; value: string; change: number; icon: React.ComponentType<{ className?: string }> }) {
  return <div className="ccm-kpi-tile bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-center justify-between mb-2"><span className="text-[11px] font-medium text-gray-500">{label}</span><Icon className="w-4 h-4 text-cyan-500"/></div><div className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</div><div className={"flex items-center gap-1 mt-1 text-[10px] font-semibold " + (change >= 0 ? "text-emerald-600" : "text-red-500")}><span>{change >= 0 ? "+" : ""}{change}%</span></div></div>
}

function ValueTile({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="ccm-value-tile bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"><div className="text-[10px] text-gray-500 mb-1">{label}</div><div className="text-lg font-bold" style={{ color }}>{value}</div></div>
}

const shipments = Array.from({ length: 55 }, (_, i) => {
  const seed = i * 193 + 77
  const product = pick(PRODUCT_TYPES, seed)
  const coldType = pick(COLD_TYPES, seed + 1)
  const tempRanges: Record<string, [number, number]> = { chilled: [2, 8], frozen: [-25, -15], ambient_controlled: [15, 25], deep_frozen: [-40, -20], ultra_cold: [-80, -60] }
  const [tMin, tMax] = tempRanges[coldType]
  const currentTemp = ri(tMin - 5, tMax + 8, seed + 2)
  const deviation = currentTemp < tMin ? currentTemp - tMin : currentTemp > tMax ? currentTemp - tMax : 0
  const band = Math.abs(deviation) === 0 ? "optimal" : Math.abs(deviation) <= 2 ? "warning" : Math.abs(deviation) <= 5 ? "critical" : "breach"
  const status = band === "breach" ? "alert" : pick(SHIPMENT_STATUS, seed + 3)
  return {
    id: "CCM-" + String(i + 5001).padStart(4, "0"), product, status, coldType,
    city: pick(CITIES, seed + 4), region: pick(REGIONS, seed + 5),
    currentTemp, minTemp: tMin, maxTemp: tMax, band, deviation,
    humidity: ri(25, 90, seed + 6), duration: ri(2, 72, seed + 7),
    value: ri(50000, 500000, seed + 8), weight: ri(10, 5000, seed + 9),
    sensorCount: ri(1, 6, seed + 10), alerts: band === "breach" ? ri(3, 15, seed + 11) : band === "critical" ? ri(1, 4, seed + 11) : 0
  }
})

const monthlyData = MO.map((m, i) => ({ month: m, shipments: ri(180, 350, i * 11 + 1), breaches: ri(0, 8, i * 11 + 2), compliance: ri(92, 99, i * 11 + 3), cost: ri(200, 600, i * 11 + 4) }))
const productDist = PRODUCT_TYPES.map((t, i) => ({ name: t.replace(/_/g, " "), value: ri(5, 20, i * 37) }))

export default function ColdChainMonitorProView() {
  const [tab, setTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      if (searchQuery && !s.id.toLowerCase().includes(searchQuery.toLowerCase()) && !s.city.toLowerCase().includes(searchQuery.toLowerCase()) && !s.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilters["product"] && !activeFilters["product"].includes(s.product)) return false
      if (activeFilters["status"] && !activeFilters["status"].includes(s.status)) return false
      if (activeFilters["coldType"] && !activeFilters["coldType"].includes(s.coldType)) return false
      return true
    })
  }, [searchQuery, activeFilters])

  const filterGroups = [
    { key: "product", label: "Product", options: PRODUCT_TYPES.map(t => ({ value: t, label: t.replace(/_/g, " "), count: 0 })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUS.map(s => ({ value: s, label: s.replace(/_/g, " "), count: 0 })) },
    { key: "coldType", label: "Cold Type", options: COLD_TYPES.map(c => ({ value: c, label: c.replace(/_/g, " "), count: 0 })) }
  ]

  const totalShipments = shipments.length
  const complianceRate = Math.round(shipments.filter(s => s.band === "optimal").length / totalShipments * 100)
  const breachCount = shipments.filter(s => s.band === "breach").length
  const totalValue = shipments.reduce((s, sh) => s + sh.value, 0)

  return (
    <div className="space-y-4">
      <PageHeader title="Cold Chain Monitor Pro" description="End-to-end temperature compliance and cold chain visibility" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="ccm-tabs-list">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <KpiTile label="Active Shipments" value={String(totalShipments)} change={6} icon={ThermometerSnowflake} />
            <KpiTile label="Compliance Rate" value={complianceRate + "%"} change={3} icon={ShieldCheck} />
            <KpiTile label="Total Value" value={"&#8377;" + (totalValue / 10000000).toFixed(1) + "Cr"} change={-2} icon={DollarSign} />
            <KpiTile label="Temp Breaches" value={String(breachCount)} change={-15} icon={ShieldAlert} />
          </div>
          <div className="flex gap-6 mb-4 justify-center flex-wrap">
            <HealthRing pct={complianceRate} label="Compliance" color={TH.ok} />
            <HealthRing pct={96} label="Sensor Uptime" color={TH.pri} />
            <HealthRing pct={89} label="On-Time Delivery" color={TH.sec} />
            <HealthRing pct={97} label="Data Integrity" color={TH.ok} />
            <HealthRing pct={84} label="Cost Efficiency" color={TH.ter} />
            <HealthRing pct={92} label="Audit Score" color={TH.pri} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="ccm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Shipment Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="shipments" stroke={TH.pri} strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="ccm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Temperature Breaches</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="breaches" fill={TH.err} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="ccm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Compliance Trend</CardTitle></CardHeader><CardContent><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="compliance" stroke={TH.ok} fill="rgba(5,150,105,0.15)" strokeWidth={2} /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="shipments">
          <ModuleBreadcrumb items={[{ label: "Cold Chain" }, { label: "All Shipments" }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalShipments} filteredCount={filteredShipments.length} onRefresh={() => {}} placeholder="Search shipments by ID, city, or product..." />
          <Card className="ccm-table-card"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><th className="px-3 py-2 text-left font-semibold">ID</th><th className="px-3 py-2 text-left font-semibold">Product</th><th className="px-3 py-2 text-left font-semibold">Status</th><th className="px-3 py-2 text-left font-semibold">Cold Type</th><th className="px-3 py-2 text-left font-semibold">City</th><th className="px-3 py-2 text-left font-semibold">Temp</th><th className="px-3 py-2 text-left font-semibold">Band</th><th className="px-3 py-2 text-left font-semibold">Humidity</th><th className="px-3 py-2 text-left font-semibold">Duration</th><th className="px-3 py-2 text-left font-semibold">Alerts</th></tr></thead><tbody>
            {filteredShipments.slice(0, 30).map((s) => (
              <tr key={s.id} className="ccm-table-row border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-3 py-2 font-mono font-semibold text-cyan-600">{s.id}</td>
                <td className="px-3 py-2"><ProductBadge type={s.product} /></td>
                <td className="px-3 py-2"><StatusBadge status={s.status} /></td>
                <td className="px-3 py-2"><ColdBadge type={s.coldType} /></td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{s.city}</td>
                <td className="px-3 py-2"><TempGauge current={s.currentTemp} min={s.minTemp} max={s.maxTemp} /></td>
                <td className="px-3 py-2"><TempBandBadge band={s.band} /></td>
                <td className="px-3 py-2"><HumidityBar value={s.humidity} /></td>
                <td className="px-3 py-2 text-gray-600">{s.duration}h</td>
                <td className="px-3 py-2">{s.alerts > 0 ? <span className="ccm-alert-count inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700"><ShieldAlert className="w-3 h-3"/>{s.alerts}</span> : <span className="text-gray-400">0</span>}</td>
              </tr>
            ))}
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="compliance">
          <ModuleBreadcrumb items={[{ label: "Cold Chain" }, { label: "Compliance" }]} />
          <div className="grid grid-cols-4 gap-4 mb-4">
            <ValueTile label="Optimal Shipments" value={String(shipments.filter(s => s.band === "optimal").length)} color={TH.ok} />
            <ValueTile label="Warning Shipments" value={String(shipments.filter(s => s.band === "warning").length)} color={TH.warn} />
            <ValueTile label="Breach Incidents" value={String(breachCount)} color={TH.err} />
            <ValueTile label="Avg Duration" value={Math.round(shipments.reduce((s, sh) => s + sh.duration, 0) / totalShipments) + "h"} color={TH.pri} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="ccm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Product Type Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={productDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}><Cell fill={PC[0]} /><Cell fill={PC[1]} /><Cell fill={PC[2]} /><Cell fill={PC[3]} /><Cell fill={PC[4]} /><Cell fill={PC[5]} /><Cell fill={PC[6]} /><Cell fill={PC[7]} /></Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="ccm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Cost (Lakh)</CardTitle></CardHeader><CardContent><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="cost" fill={TH.pri} radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <ModuleBreadcrumb items={[{ label: "Cold Chain" }, { label: "Insights" }]} />
          <div className="grid grid-cols-2 gap-4">
            <Card className="ccm-insight-card border-l-4 border-l-cyan-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><Thermometer className="w-4 h-4 text-cyan-600" /><span className="font-semibold text-sm">Vaccine Cold Chain Risk</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Ultra-cold vaccine shipments show 4% higher deviation rates during Mumbai-Chennai corridor. Pre-conditioning at origin hub recommended for improved stability.</p></CardContent></Card>
            <Card className="ccm-insight-card border-l-4 border-l-red-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-600" /><span className="font-semibold text-sm">Breach Hotspots</span></div><p className="text-xs text-gray-600 dark:text-gray-400">3 consecutive breaches detected on Delhi NCR frozen meat route. Root cause: door seal failure on reefer truck RF-204. Immediate inspection required.</p></CardContent></Card>
            <Card className="ccm-insight-card border-l-4 border-l-emerald-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="font-semibold text-sm">Sensor Network Growth</span></div><p className="text-xs text-gray-600 dark:text-gray-400">IoT sensor coverage reached 96% of active cold chain routes. Real-time monitoring resolution improved to 30-second intervals across all zones.</p></CardContent></Card>
            <Card className="ccm-insight-card border-l-4 border-l-blue-500"><CardContent className="p-4"><div className="flex items-center gap-2 mb-2"><Snowflake className="w-4 h-4 text-blue-600" /><span className="font-semibold text-sm">Seasonal Demand</span></div><p className="text-xs text-gray-600 dark:text-gray-400">Fresh produce cold chain demand expected to increase 25% in August-September. Pre-position additional reefer capacity at Hyderabad and Chennai hubs.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
