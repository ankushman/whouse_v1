"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Link, Zap, AlertTriangle, CheckCircle2, BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Radio, Star, ShieldCheck, Award, Users, DollarSign, Handshake, Target } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const PARTNER_TYPE = ["warehousing", "transport", "last_mile", "cold_chain", "cross_dock", "returns", "customs", "fulfillment"] as const
const TYPE_EMOJI: Record<string, string> = { warehousing: "\U0001f3e2", transport: "\U0001f69a", last_mile: "\U0001f3ce\ufe0f", cold_chain: "\u2744\ufe0f", cross_dock: "\u27a1\ufe0f", returns: "\U0001f504", customs: "\U0001f6e1\ufe0f", fulfillment: "\U0001f4e6" }
const PARTNER_STATUS = ["active", "probation", "suspended", "under_review", "inactive"] as const
const SLA_LEVEL = ["gold", "silver", "bronze", "standard"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#ec4899", sec: "#f59e0b", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#ec4899", "#f59e0b", "#059669", "#dc2626", "#8b5cf6", "#06b6d4", "#14b8a6", "#3b82f6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function TypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { warehousing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", transport: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", last_mile: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", cold_chain: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", cross_dock: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", returns: "bg-red-100 text-red-700 dark:bg-red-900/30", customs: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", fulfillment: "bg-pink-100 text-pink-700 dark:bg-pink-900/30" }
  return <span className={"tph-type-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{TYPE_EMOJI[type] || "\u2022"} {type.replace(/_/g, " ")}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { active: "tph-active bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", probation: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", suspended: "tph-suspended bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]", under_review: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", inactive: "bg-gray-200 text-gray-500" }
  return <span className={"tph-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function SlaBadge({ level }: { level: string }) {
  const cols: Record<string, string> = { gold: "tph-gold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 shadow-[0_0_6px_rgba(202,138,4,0.3)]", silver: "bg-gray-200 text-gray-700 dark:bg-gray-700/30", bronze: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", standard: "bg-blue-100 text-blue-700 dark:bg-blue-900/30" }
  return <span className={"tph-sla-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[level] || "")}><Award className="w-3 h-3"/>{level}</span>
}

function ScoreBar({ value }: { value: number }) {
  const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err
  return <div className="tph-score-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}</span></div>
}

function StarRating({ rating }: { rating: number }) { return <span className="tph-stars inline-flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={"w-3 h-3 " + (i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} style={{ fill: i <= rating ? "#facc15" : "none" }}/>)}</span> }

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="tph-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) { return <span className="tph-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-pink-50 text-pink-700 dark:bg-pink-900/20">{city}</span> }

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) { return <Card className="tph-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card> }

function ValueTile({ label, value }: { label: string; value: string | number }) { return <div className="tph-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div> }

function HealthRing({ value, label }: { value: number; label: string }) { const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err; const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ; return <div className="tph-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div> }

function genPartners() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: "3PL-" + String(i + 1).padStart(4, "0"),
    name: pick(["BlueDart Express", "Delhivery Logistics", "DTDC Express", "XpressBees", "Ecom Express", "Shadowfax", "Spoton Logistics", "DHL Supply Chain", "FedEx India", "Gati Ltd", "TNT Express", "Allcargo Logistics", "VRL Logistics", "TCI Express", "SafeExpress"], i + 1),
    type: pick(PARTNER_TYPE, i * 3 + 2),
    city: pick(CITIES, i * 3 + 3),
    sla: pick(SLA_LEVEL, i + 7),
    status: pick(PARTNER_STATUS, i + 15),
    score: ri(40, 99, i + 23),
    rating: ri(2, 5, i + 29),
    shipments: ri(50, 5000, i + 37),
    onTime: ri(60, 99, i + 43),
    damage: ri(0, 5, i + 49),
    revenue: ri(100000, 10000000, i + 53),
    contractEnd: "2026-" + String(ri(8, 12, i + 59)).padStart(2, "0") + "-" + String(ri(1, 28, i + 61)).padStart(2, "0")
  }))
}

function genContracts() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: "CTR-" + String(i + 1).padStart(4, "0"),
    partner: pick(["BlueDart", "Delhivery", "DTDC", "XpressBees", "Ecom Express", "Shadowfax", "Spoton", "DHL"], i + 7),
    type: pick(PARTNER_TYPE, i + 15),
    value: ri(500000, 20000000, i + 23),
    start: "2026-01-" + String(ri(1, 28, i + 29)).padStart(2, "0"),
    end: "2026-" + String(ri(6, 12, i + 37)).padStart(2, "0") + "-" + String(ri(1, 28, i + 41)).padStart(2, "0"),
    status: pick(["active", "expiring_soon", "expired", "renewed", "terminated"], i + 47),
    penalty: ri(0, 500000, i + 53)
  }))
}

function genCharts() {
  const spend = MO.map((m, i) => ({ month: m, spend: ri(5000000, 20000000, i + 101), partners: ri(20, 50, i + 151), sla: ri(80, 98, i + 201) }))
  const typeDist = PARTNER_TYPE.map((t, i) => ({ type: t.replace(/_/g, " "), count: ri(3, 15, i + 301), avgScore: ri(60, 95, i + 351) }))
  const scoreLine = MO.map((m, i) => ({ month: m, avgScore: ri(70, 95, i + 401), onTime: ri(75, 99, i + 451) }))
  return { spend, typeDist, scoreLine }
}

export default function ThreePlPartnerHubView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const partners = useMemo(() => genPartners(), [])
  const contracts = useMemo(() => genContracts(), [])
  const charts = useMemo(() => genCharts(), [])
  const filterPartners = useMemo(() => { let res = partners; if (search) { const q = search.toLowerCase(); res = res.filter(p => Object.values(p).some(val => typeof val === "string" && val.toLowerCase().includes(q))) } for (const [k, vals] of Object.entries(activeFilters)) { if (vals.length > 0) res = res.filter(p => vals.includes(String(p[k as keyof typeof p]))) } return res }, [partners, search, activeFilters])
  const sortedPartners = useMemo(() => { if (!sortCol) return filterPartners; return [...filterPartners].sort((a: any, b: any) => { const av = a[sortCol], bv = b[sortCol]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp }) }, [filterPartners, sortCol, sortDir])
  const toggleSort = (col: string) => { if (sortCol === col) { setSortDir(d => d === "asc" ? "desc" : "asc") } else { setSortCol(col); setSortDir("asc") } }
  const toggleFilter = (group: string, value: string) => { setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } }) }
  const clearAllFilters = () => setActiveFilters({})
  const handleRefresh = () => { setSearch(""); setActiveFilters({}); setSortCol(null) }

  const partnerFilterGroups = useMemo(() => { const tc: Record<string, number> = {}; const sc: Record<string, number> = {}; const slac: Record<string, number> = {}; partners.forEach(p => { tc[p.type] = (tc[p.type] || 0) + 1; sc[p.status] = (sc[p.status] || 0) + 1; slac[p.sla] = (slac[p.sla] || 0) + 1 }); return [{ key: "type", label: "Type", options: Object.entries(tc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "status", label: "Status", options: Object.entries(sc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "sla", label: "SLA Tier", options: Object.entries(slac).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }] }, [partners])

  return <div className="space-y-4 p-4">
    <PageHeader title="3PL Partner Hub" description="Comprehensive partner management with SLA tracking, performance scoring and contract lifecycle"/>

    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="grid grid-cols-4 w-full tph-tabs">
        <TabsTrigger value="dashboard"><BarChart3 className="w-3 h-3 mr-1"/>Dashboard</TabsTrigger>
        <TabsTrigger value="partners"><Users className="w-3 h-3 mr-1"/>Partners</TabsTrigger>
        <TabsTrigger value="contracts"><Handshake className="w-3 h-3 mr-1"/>Contracts</TabsTrigger>
        <TabsTrigger value="insights"><TrendingUp className="w-3 h-3 mr-1"/>Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <KpiTile label="Active Partners" value={String(partners.filter((p: any) => p.status === "active").length)} icon={<Users className="w-4 h-4" style={{ color: TH.pri }}/>} trend={10.5} color={TH.pri}/>
          <KpiTile label="Avg Score" value="82" icon={<Star className="w-4 h-4" style={{ color: TH.sec }}/>} trend={5.2} color={TH.sec}/>
          <KpiTile label="SLA Compliance" value="91%" icon={<ShieldCheck className="w-4 h-4" style={{ color: TH.ok }}/>} trend={3.8} color={TH.ok}/>
          <KpiTile label="Active Contracts" value={String(contracts.filter((c: any) => c.status === "active").length)} icon={<Handshake className="w-4 h-4" style={{ color: TH.warn }}/>} trend={2.1} color={TH.warn}/>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <HealthRing value={88} label="On-Time"/>
          <HealthRing value={91} label="SLA"/>
          <HealthRing value={82} label="Quality"/>
          <HealthRing value={76} label="Retention"/>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card className="tph-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Monthly Spend</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.spend} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="spend" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/></AreaChart></CardContent></Card>
          <Card className="tph-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Partner Type Distribution</CardTitle></CardHeader><CardContent className="p-2"><BarChart data={charts.typeDist} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="type" fontSize={8}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Bar dataKey="count" fill={TH.sec}/></BarChart></CardContent></Card>
          <Card className="tph-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Performance Trend</CardTitle></CardHeader><CardContent className="p-2"><LineChart data={charts.scoreLine} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Line type="monotone" dataKey="avgScore" stroke={TH.ok}/><Line type="monotone" dataKey="onTime" stroke={TH.pri}/></LineChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="partners" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Partners" }]}/>
        <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={partnerFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={partners.length} filteredCount={filterPartners.length} onRefresh={handleRefresh} placeholder="Search partners..."/>
        <Card className="tph-table-card"><CardContent className="p-2"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="border-b tph-table-header"><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="w-3 h-3 inline"/></th><th className="p-1.5 text-left">Partner</th><th className="p-1.5 text-left">Type</th><th className="p-1.5 text-left">City</th><th className="p-1.5 text-left">SLA</th><th className="p-1.5 text-left">Score</th><th className="p-1.5 text-left">Rating</th><th className="p-1.5 text-left">On-Time</th><th className="p-1.5 text-left">Shipments</th><th className="p-1.5 text-left">Status</th></tr></thead><tbody>
          {sortedPartners.map((p: any) => <tr key={p.id} className="border-b hover:bg-pink-50/50 dark:hover:bg-pink-900/10 tph-table-row"><td className="p-1.5 font-mono">{p.id}</td><td className="p-1.5 font-medium">{p.name}</td><td className="p-1.5"><TypeBadge type={p.type}/></td><td className="p-1.5"><CityBadge city={p.city}/></td><td className="p-1.5"><SlaBadge level={p.sla}/></td><td className="p-1.5"><ScoreBar value={p.score}/></td><td className="p-1.5"><StarRating rating={p.rating}/></td><td className="p-1.5"><span className={"text-[10px] font-bold " + (p.onTime >= 90 ? "text-emerald-600" : p.onTime >= 75 ? "text-amber-600" : "text-red-600")}>{p.onTime}%</span></td><td className="p-1.5">{p.shipments}</td><td className="p-1.5"><StatusBadge status={p.status}/></td></tr>)}
          </tbody></table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="contracts" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Contracts" }]}/>
        <div className="grid grid-cols-4 gap-3">
          <ValueTile label="Active" value={String(contracts.filter((c: any) => c.status === "active").length)}/>
          <ValueTile label="Expiring Soon" value={String(contracts.filter((c: any) => c.status === "expiring_soon").length)}/>
          <ValueTile label="Expired" value={String(contracts.filter((c: any) => c.status === "expired").length)}/>
          <ValueTile label="Total Value" value="\u20b98.5Cr"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="tph-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Spend Trend</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.spend} height={200}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="spend" stroke={TH.pri} fill={TH.pri} fillOpacity={0.15}/></AreaChart></CardContent></Card>
          <Card className="tph-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">SLA Tier Distribution</CardTitle></CardHeader><CardContent className="p-2"><PieChart height={200}><Pie data={SLA_LEVEL.map((s, i) => ({ name: s, value: ri(3, 20, i + 601) }))} cx="50%" cy="50%" outerRadius={60} dataKey="value" label><Cell fill={PC[0]}/><Cell fill={PC[1]}/><Cell fill={PC[2]}/><Cell fill={PC[3]}/></Pie><Tooltip contentStyle={{ fontSize: 11 }}/></PieChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Insights" }]}/>
        <div className="grid grid-cols-2 gap-3">
          <Card className="tph-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Star className="w-3 h-3 text-amber-500"/>Top Performers</div><div className="text-[10px] text-muted-foreground">5 partners scored above 95 this quarter. BlueDart and Delhivery lead in transport with 99% on-time. Shadowfax excels in last-mile with lowest cost-per-delivery at Rs 35.</div></Card>
          <Card className="tph-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500"/>At-Risk Partners</div><div className="text-[10px] text-muted-foreground">3 partners on probation with scores below 60. 2 partners have SLA compliance under 70%. Recommend corrective action plans and 30-day improvement targets.</div></Card>
          <Card className="tph-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Target className="w-3 h-3 text-cyan-500"/>Contract Optimization</div><div className="text-[10px] text-muted-foreground">8 contracts expiring in next 90 days. Consolidating cold-chain partners from 5 to 3 could save 18% annually. Multi-year commitments yield 12% rate advantage.</div></Card>
          <Card className="tph-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><DollarSign className="w-3 h-3 text-emerald-500"/>Revenue Impact</div><div className="text-[10px] text-muted-foreground">Partner-driven revenue grew 22% QoQ. Cross-dock partners contributed 15% of fulfillment capacity. Returns processing partners reduced reverse logistics cost by 28%.</div></Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
}