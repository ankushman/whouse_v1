"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap, AlertTriangle, BrainCircuit, BarChart3, Route, Truck, Ship, TrainFront, Globe, MapPin, Package, Gauge, Activity, Timer, Compass, Anchor } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function fmtINR(n: number): string { const s = n < 0 ? "-" : "", a = Math.abs(n); if (a >= 1e7) return `₹${s}${(a / 1e7).toFixed(2)}Cr`; if (a >= 1e5) return `₹${s}${(a / 1e5).toFixed(2)}L`; if (a >= 1e3) return `₹${s}${(a / 1e3).toFixed(1)}K`; return `₹${s}${a.toLocaleString("en-IN")}` }
function filterData<T,>(data: T[], q: string): T[] { if (!q) return data; const l = q.toLowerCase(); return data.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T,>(data: T[], field: string, dir: "asc" | "desc"): T[] { return [...data].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[field], bv = (b as unknown as Record<string, string | number>)[field]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av)) }) }

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const CITIES = ["Mumbai", "Delhi", "Chennai", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Ahmedabad", "Jaipur", "Kochi", "Guwahati", "Indore"] as const
const MODES = ["Road FTL", "Road LTL", "Rail", "Coastal Ship", "Air Cargo", "Multimodal", "Pipeline", "Express Parcel"] as const
const MODE_EMOJI: Record<string, string> = { "Road FTL": "🚛", "Road LTL": "🚚", "Rail": "🚂", "Coastal Ship": "🚢", "Air Cargo": "✈️", "Multimodal": "🔀", "Pipeline": "⛽", "Express Parcel": "📦" }
const C_STATUSES = ["Active", "Seasonal", "Suspended", "Under Review", "New", "Deprecated"] as const
const RATE_TYPES = ["Spot", "Contract", "FTL Spot", "FTL Contract", "LTL Spot", "LTL Contract", "Express", "Charter"] as const
const R_STATUSES = ["Active", "Expired", "Negotiating", "Pending", "Accepted", "Rejected"] as const
const CARRIER_TYPES = ["Major Fleet", "Regional", "Asset-Light", "Broker", "Specialist", "Rail Operator", "Shipping Line", "Airline"] as const
const CARRIER_EMOJI: Record<string, string> = { "Major Fleet": "🏢", "Regional": "🏘️", "Asset-Light": "📋", "Broker": "🤝", "Specialist": "🎯", "Rail Operator": "🚂", "Shipping Line": "🚢", "Airline": "✈️" }
const GRADES = ["A+ Premium", "A Excellent", "B+ Good", "B Average", "C Below Avg", "D Poor"] as const
const T_STATUSES = ["At Origin", "In Transit", "At Hub", "Customs Hold", "Delayed", "At Destination", "Delivered", "Exception"] as const
const EXCEPTIONS = ["Weather", "Mechanical", "Congestion", "Documentation", "Labor", "Regulatory"] as const
const PRIORITIES = ["Critical", "High", "Medium", "Low"] as const
const CARRIERS = ["BlueDart", "Delhivery", "DTDC", "Gati", "TNT Express", "FedEx India", "DHL India", "CONCOR", "VRL Logistics", "Allcargo"] as const
const COLORS = ["#3b82f6", "#0891b2", "#059669", "#d97706", "#7c3aed", "#e11d48", "#6366f1", "#f97316"]

/* ═══════ 16 Unique Visual Components ═══════ */
// 1. ModeBadge
function ModeBadge({ mode }: { mode: string }) {
  const c: Record<string, string> = { "Road FTL": "bg-blue-100 text-blue-700", "Road LTL": "bg-sky-100 text-sky-700", Rail: "bg-emerald-100 text-emerald-700", "Coastal Ship": "bg-cyan-100 text-cyan-700", "Air Cargo": "bg-violet-100 text-violet-700", Multimodal: "bg-indigo-100 text-indigo-700", Pipeline: "bg-amber-100 text-amber-700", "Express Parcel": "bg-rose-100 text-rose-700" }
  return <span className={cn("fli-mode inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium", c[mode] || "bg-gray-100")}>{MODE_EMOJI[mode]} {mode}</span>
}
// 2. CorridorStatusBadge (pulse for Active)
function CorridorStatusBadge({ status }: { status: string }) {
  const c: Record<string, string> = { Active: "bg-emerald-100 text-emerald-700", Seasonal: "bg-amber-100 text-amber-700", Suspended: "bg-red-100 text-red-700", "Under Review": "bg-blue-100 text-blue-700", New: "bg-violet-100 text-violet-700", Deprecated: "bg-gray-200 text-gray-500" }
  return <span className={cn("fli-cor-status inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium", c[status] || "bg-gray-100")}>{status === "Active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}{status}</span>
}
// 3. RouteTile
function RouteTile({ o, d }: { o: string; d: string }) {
  return <span className="fli-route inline-flex items-center gap-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{o} <Route className="w-3 h-3 text-blue-500" /> {d}</span>
}
// 4. DistanceTile
function DistanceTile({ km }: { km: number }) { return <span className="fli-dist text-[10px] font-bold text-blue-600 tabular-nums">{km.toLocaleString("en-IN")} km</span> }
// 5. TransitTile
function TransitTile({ hrs }: { hrs: number }) { return <span className={cn("fli-transit text-[10px] font-bold tabular-nums", hrs <= 24 ? "text-emerald-600" : hrs <= 48 ? "text-amber-600" : "text-red-600")}>{hrs}h</span> }
// 6. CostPerTonTile
function CostPerTonTile({ cost }: { cost: number }) { return <span className="fli-cost text-[10px] font-bold text-violet-600 tabular-nums">{fmtINR(cost)}</span> }
// 7. UtilizationBar (4-color)
function UtilizationBar({ pct }: { pct: number }) {
  const c = pct < 40 ? "#059669" : pct < 70 ? "#3b82f6" : pct < 85 ? "#d97706" : "#e11d48"
  return <div className="fli-util w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: c }} /></div>
}
// 8. RateTypeBadge
function RateTypeBadge({ type }: { type: string }) {
  const c: Record<string, string> = { Spot: "bg-orange-100 text-orange-700", Contract: "bg-blue-100 text-blue-700", "FTL Spot": "bg-amber-100 text-amber-700", "FTL Contract": "bg-emerald-100 text-emerald-700", "LTL Spot": "bg-sky-100 text-sky-700", "LTL Contract": "bg-cyan-100 text-cyan-700", Express: "bg-violet-100 text-violet-700", Charter: "bg-rose-100 text-rose-700" }
  return <span className={cn("fli-rate-type px-1.5 py-0.5 rounded text-[10px] font-medium", c[type] || "bg-gray-100")}>{type}</span>
}
// 9. RateStatusBadge (pulse for Negotiating)
function RateStatusBadge({ status }: { status: string }) {
  const c: Record<string, string> = { Active: "bg-emerald-100 text-emerald-700", Expired: "bg-gray-200 text-gray-500", Negotiating: "bg-amber-100 text-amber-700", Pending: "bg-blue-100 text-blue-700", Accepted: "bg-green-100 text-green-700", Rejected: "bg-red-100 text-red-700" }
  return <span className={cn("fli-rate-status inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium", c[status] || "bg-gray-100")}>{status === "Negotiating" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}{status}</span>
}
// 10. TrendIndicator
function TrendIndicator({ dir }: { dir: number }) {
  const up = dir >= 0
  return <span className={cn("fli-trend inline-flex items-center gap-0.5 text-[10px] font-bold", up ? "text-emerald-600" : "text-red-600")}>{up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{up ? "+" : ""}{dir}%</span>
}
// 11. CarrierTypeBadge
function CarrierTypeBadge({ type }: { type: string }) {
  const c: Record<string, string> = { "Major Fleet": "bg-blue-100 text-blue-700", Regional: "bg-emerald-100 text-emerald-700", "Asset-Light": "bg-cyan-100 text-cyan-700", Broker: "bg-amber-100 text-amber-700", Specialist: "bg-violet-100 text-violet-700", "Rail Operator": "bg-teal-100 text-teal-700", "Shipping Line": "bg-sky-100 text-sky-700", Airline: "bg-rose-100 text-rose-700" }
  return <span className={cn("fli-carrier-type inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium", c[type] || "bg-gray-100")}>{CARRIER_EMOJI[type]} {type}</span>
}
// 12. CarrierGrade
function CarrierGrade({ grade }: { grade: string }) {
  const c: Record<string, string> = { "A+ Premium": "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300", "A Excellent": "bg-green-100 text-green-700", "B+ Good": "bg-blue-100 text-blue-700", "B Average": "bg-amber-100 text-amber-700", "C Below Avg": "bg-orange-100 text-orange-700", "D Poor": "bg-red-100 text-red-700" }
  return <span className={cn("fli-grade px-1.5 py-0.5 rounded text-[10px] font-bold", c[grade] || "bg-gray-100")}>{grade}</span>
}
// 13. TransitStatusBadge (pulse for In Transit)
function TransitStatusBadge({ status }: { status: string }) {
  const c: Record<string, string> = { "At Origin": "bg-slate-100 text-slate-600", "In Transit": "bg-blue-100 text-blue-700", "At Hub": "bg-amber-100 text-amber-700", "Customs Hold": "bg-red-100 text-red-700", Delayed: "bg-orange-100 text-orange-700", "At Destination": "bg-cyan-100 text-cyan-700", Delivered: "bg-emerald-100 text-emerald-700", Exception: "bg-rose-100 text-rose-700" }
  return <span className={cn("fli-transit-status inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium", c[status] || "bg-gray-100")}>{status === "In Transit" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}{status}</span>
}
// 14. ExceptionBadge
function ExceptionBadge({ type }: { type: string }) {
  const c: Record<string, string> = { Weather: "bg-sky-100 text-sky-700", Mechanical: "bg-orange-100 text-orange-700", Congestion: "bg-amber-100 text-amber-700", Documentation: "bg-blue-100 text-blue-700", Labor: "bg-violet-100 text-violet-700", Regulatory: "bg-red-100 text-red-700" }
  return <span className={cn("fli-exception px-1.5 py-0.5 rounded text-[10px] font-medium", c[type] || "bg-gray-100")}>{type}</span>
}
// 15. PriorityBadge (Critical glow)
function PriorityBadge({ p }: { p: string }) {
  const c: Record<string, string> = { Critical: "bg-red-600 text-white shadow-[0_0_8px_rgba(220,38,38,0.5)]", High: "bg-orange-100 text-orange-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-slate-100 text-slate-600" }
  return <span className={cn("fli-priority px-1.5 py-0.5 rounded-full text-[10px] font-bold", c[p] || "bg-gray-100")}>{p}</span>
}
// 16. ShipmentValueTile
function ShipmentValueTile({ value }: { value: number }) { return <span className={cn("fli-value text-[10px] font-bold tabular-nums", value > 5e6 ? "text-rose-600" : value > 1e6 ? "text-amber-600" : "text-emerald-600")}>{fmtINR(value)}</span> }

/* ═══════ Data Generation ═══════ */
function generateData() {
  const corridors = Array.from({ length: 75 }, (_, i) => { const s = i * 7 + 1; const oi = i % 12, di = (i * 3 + 5) % 12; return { id: i + 1, origin: CITIES[oi], destination: CITIES[di] === CITIES[oi] ? CITIES[(oi + 1) % 12] : CITIES[di], mode: MODES[ri(0, 7, s)] as string, status: C_STATUSES[ri(0, 5, s + 1)] as string, distance: ri(200, 2500, s + 2), transitTime: ri(6, 72, s + 3), costPerTon: ri(1200, 8000, s + 4), tonnage: ri(50, 5000, s + 5), utilization: ri(20, 98, s + 6) } })
  const rates = Array.from({ length: 70 }, (_, i) => { const s = i * 8 + 100; return { id: i + 1, corridor: `${CITIES[i % 12]}→${CITIES[(i + 3) % 12]}`, type: RATE_TYPES[ri(0, 7, s)] as string, status: R_STATUSES[ri(0, 5, s + 1)] as string, perKm: ri(8, 65, s + 2), perTon: ri(1200, 8500, s + 3), fuelSurcharge: ri(3, 18, s + 4), handling: ri(100, 1500, s + 5), insurance: ri(200, 5000, s + 6), validity: `${ri(1, 12, s + 7)}mo`, trend: ri(-12, 12, s + 8) } })
  const carriers = Array.from({ length: 55 }, (_, i) => { const s = i * 9 + 200; return { id: i + 1, name: CARRIERS[i % 10], type: CARRIER_TYPES[ri(0, 7, s)] as string, grade: GRADES[ri(0, 5, s + 1)] as string, onTime: ri(700, 990, s + 2) / 10, damageRate: ri(0, 50, s + 3) / 10, claimRate: ri(0, 30, s + 4) / 10, avgTransit: ri(8, 72, s + 5), fleetSize: ri(10, 500, s + 6), routes: ri(5, 200, s + 7) } })
  const transits = Array.from({ length: 65 }, (_, i) => { const s = i * 10 + 300; return { id: i + 1, corridor: `${CITIES[i % 12]}→${CITIES[(i + 5) % 12]}`, carrier: CARRIERS[i % 10], status: T_STATUSES[ri(0, 7, s)] as string, exception: EXCEPTIONS[ri(0, 5, s + 1)] as string, location: CITIES[ri(0, 11, s + 2)] as string, eta: ri(1, 96, s + 3), delay: ri(0, 24, s + 4), value: ri(50000, 25000000, s + 5), priority: PRIORITIES[ri(0, 3, s + 6)] as string } })
  const monthlyVolume = MONTHS.map((m, i) => ({ month: m, FTL: ri(800, 3500, i + 1), LTL: ri(400, 2200, i + 50), Parcel: ri(200, 1500, i + 100) }))
  const modeDist = MODES.slice(0, 6).map((m, i) => ({ name: m, value: ri(10, 40, i + 150) }))
  const corridorPerf = Array.from({ length: 10 }, (_, i) => ({ name: `${CITIES[i]}→${CITIES[(i + 3) % 12]}`, throughput: ri(5000, 25000, i + 200), reliability: ri(70, 98, i + 250), efficiency: ri(60, 95, i + 300) }))
  const costTrend = MONTHS.map((m, i) => ({ month: m, cost: ri(1500, 4500, i + 400), target: 3000 }))
  const gradeDist = GRADES.map((g, i) => ({ name: g, value: ri(5, 30, i + 500) }))
  const modeEff = MODES.map((m, i) => ({ mode: m, costEff: ri(50, 95, i + 550), speed: ri(40, 98, i + 600), reliability: ri(60, 99, i + 650) }))
  const corridorRev = Array.from({ length: 10 }, (_, i) => ({ name: `${CITIES[i]}→${CITIES[(i + 4) % 12]}`, revenue: ri(5000000, 50000000, i + 700) }))
  return { corridors, rates, carriers, transits, monthlyVolume, modeDist, corridorPerf, costTrend, gradeDist, modeEff, corridorRev, MODES, C_STATUSES, RATE_TYPES, R_STATUSES, CARRIER_TYPES, GRADES, T_STATUSES, EXCEPTIONS, PRIORITIES }
}

function KpiIcon({ name, className }: { name: string; className?: string }) {
  const cls = cn("h-4 w-4", className)
  switch (name) { case "Route": return <Route className={cls} />; case "Package": return <Package className={cls} />; case "IndianRupee": return <IndianRupee className={cls} />; case "Gauge": return <Gauge className={cls} />; case "BarChart3": return <BarChart3 className={cls} />; case "AlertTriangle": return <AlertTriangle className={cls} />; case "Clock": return <Clock className={cls} />; case "Activity": return <Activity className={cls} />; case "BrainCircuit": return <BrainCircuit className={cls} />; case "Compass": return <Compass className={cls} />; default: return <Activity className={cls} /> }
}

/* ═══════ Main Component ═══════ */
export default function FreightLaneIntelligenceView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null)
  const [sheetType, setSheetType] = useState("corridor")
  const { toast } = useToast()

  const handleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const SortIcon = ({ field }: { field: string }) => <ArrowUpDown className={cn("w-3 h-3 ml-0.5", sortField === field ? "text-blue-600" : "opacity-40")} />

  const src = activeTab === "1" ? data.corridors : activeTab === "2" ? data.rates : activeTab === "3" ? data.carriers : activeTab === "4" ? data.transits : []
  const filtered = useMemo(() => sortedData(filterData(src as unknown as Record<string, string | number>[], searchQ) as unknown as Record<string, string | number>[], sortField, sortDir), [src, searchQ, sortField, sortDir])

  const ac = data.corridors.filter(c => c.status === "Active").length
  const kpis = [
    { label: "Active Lanes", value: String(ac), icon: "Route", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Total Tonnage", value: `${(data.corridors.reduce((s, c) => s + c.tonnage, 0) / 1000).toFixed(1)}K T`, icon: "Package", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Avg Cost/Ton", value: fmtINR(Math.round(data.corridors.reduce((s, c) => s + c.costPerTon, 0) / data.corridors.length)), icon: "IndianRupee", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { label: "On-Time Rate", value: `${Math.round(data.carriers.reduce((s, c) => s + c.onTime, 0) / data.carriers.length)}%`, icon: "Gauge", color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    { label: "Revenue", value: fmtINR(data.transits.reduce((s, t) => s + t.value, 0)), icon: "BarChart3", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Idle Lanes", value: String(data.corridors.filter(c => c.utilization < 20).length), icon: "AlertTriangle", color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: "Transit Time", value: `${Math.round(data.corridors.reduce((s, c) => s + c.transitTime, 0) / data.corridors.length)}h`, icon: "Clock", color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/20" },
    { label: "Utilization", value: `${Math.round(data.corridors.reduce((s, c) => s + c.utilization, 0) / data.corridors.length)}%`, icon: "Activity", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  ]
  const searchPH = activeTab === "1" ? "Search corridors..." : activeTab === "2" ? "Search rates..." : activeTab === "3" ? "Search carriers..." : activeTab === "4" ? "Search transit..." : "Search..."

  return (
    <div className="fli-root space-y-4 p-4">
      <PageHeader title="Freight Lane Intelligence" description="Comprehensive freight lane analytics, rate management, carrier scoring, and real-time transit tracking across India" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
          {["Lane Dashboard", "Freight Corridors", "Rate Management", "Carrier Performance", "Transit Tracking", "Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="text-xs font-medium px-3">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ═══ Tab 0: Lane Dashboard ═══ */}
        <TabsContent value="0" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className={cn("hover:shadow-md transition-shadow", k.bg)}>
                <CardContent className="flex items-center gap-3 p-3">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm", k.color)}><KpiIcon name={k.icon} className={k.color} /></div>
                  <div><p className="text-[10px] text-muted-foreground">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Volume (tons)</CardTitle></CardHeader><CardContent><AreaChart data={data.monthlyVolume}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="FTL" stackId="1" stroke="#3b82f6" fill="#bfdbfe" /><Area type="monotone" dataKey="LTL" stackId="1" stroke="#0891b2" fill="#a5f3fc" /><Area type="monotone" dataKey="Parcel" stackId="1" stroke="#d97706" fill="#fde68a" /></AreaChart></CardContent></Card>
            <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">Mode Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.modeDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{data.modeDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">Top 10 Corridors</CardTitle></CardHeader><CardContent><BarChart data={data.corridorPerf}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-25} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="throughput" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>

        {/* ═══ Tabs 1-4: Data Tables ═══ */}
        {activeTab >= "1" && activeTab <= "4" && (
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={searchPH} className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="text-xs">{filtered.length} records</Badge>
          </div>
        )}

        {/* ═══ Tab 1: Freight Corridors ═══ */}
        <TabsContent value="1" className="space-y-3">
          <div className="overflow-auto rounded-lg border max-h-[460px]">
            <table className="w-full text-xs"><thead className="bg-slate-50 dark:bg-slate-800 sticky top-0"><tr>
              <th className="fli-th px-2 py-2 text-left font-medium">Mode</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Route</th>
              <th className="fli-th px-2 py-2 text-left font-medium cursor-pointer" onClick={() => handleSort("distance")}>Dist <SortIcon field="distance" /></th>
              <th className="fli-th px-2 py-2 text-left font-medium cursor-pointer" onClick={() => handleSort("transitTime")}>Transit <SortIcon field="transitTime" /></th>
              <th className="fli-th px-2 py-2 text-left font-medium cursor-pointer" onClick={() => handleSort("costPerTon")}>Cost/Ton <SortIcon field="costPerTon" /></th>
              <th className="fli-th px-2 py-2 text-left font-medium cursor-pointer" onClick={() => handleSort("tonnage")}>Tonnage <SortIcon field="tonnage" /></th>
              <th className="fli-th px-2 py-2 text-left font-medium">Status</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Utilization</th>
              <th className="px-2 py-2"></th>
            </tr></thead><tbody>
              {(filtered as unknown as typeof data.corridors).map(r => (
                <tr key={r.id} className="fli-row border-t hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => { setSelectedRow(r as unknown as Record<string, unknown>); setSheetType("corridor"); setSheetOpen(true) }}>
                  <td className="px-2 py-1.5"><ModeBadge mode={r.mode} /></td>
                  <td className="px-2 py-1.5"><RouteTile o={r.origin} d={r.destination} /></td>
                  <td className="px-2 py-1.5"><DistanceTile km={r.distance} /></td>
                  <td className="px-2 py-1.5"><TransitTile hrs={r.transitTime} /></td>
                  <td className="px-2 py-1.5"><CostPerTonTile cost={r.costPerTon} /></td>
                  <td className="px-2 py-1.5 tabular-nums font-medium">{r.tonnage.toLocaleString()}</td>
                  <td className="px-2 py-1.5"><CorridorStatusBadge status={r.status} /></td>
                  <td className="px-2 py-1.5 min-w-[50px]"><UtilizationBar pct={r.utilization} /><span className="text-[9px] ml-1 text-muted-foreground">{r.utilization}%</span></td>
                  <td className="px-2 py-1.5"><Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setSelectedRow(r as unknown as Record<string, unknown>); setSheetType("corridor"); setSheetOpen(true) }}><Eye className="w-3 h-3" /></Button></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </TabsContent>

        {/* ═══ Tab 2: Rate Management ═══ */}
        <TabsContent value="2" className="space-y-3">
          <div className="overflow-auto rounded-lg border max-h-[460px]">
            <table className="w-full text-xs"><thead className="bg-slate-50 dark:bg-slate-800 sticky top-0"><tr>
              <th className="fli-th px-2 py-2 text-left font-medium">Type</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Corridor</th>
              <th className="fli-th px-2 py-2 text-left font-medium cursor-pointer" onClick={() => handleSort("perKm")}>₹/km <SortIcon field="perKm" /></th>
              <th className="fli-th px-2 py-2 text-left font-medium">₹/ton</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Fuel%</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Handling</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Insurance</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Status</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Trend</th>
              <th className="px-2 py-2"></th>
            </tr></thead><tbody>
              {(filtered as unknown as typeof data.rates).map(r => (
                <tr key={r.id} className="fli-row border-t hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => { setSelectedRow(r as unknown as Record<string, unknown>); setSheetType("rate"); setSheetOpen(true) }}>
                  <td className="px-2 py-1.5"><RateTypeBadge type={r.type} /></td>
                  <td className="px-2 py-1.5 text-[10px] font-medium">{r.corridor}</td>
                  <td className="px-2 py-1.5 tabular-nums font-bold">{fmtINR(r.perKm)}</td>
                  <td className="px-2 py-1.5 tabular-nums font-medium">{fmtINR(r.perTon)}</td>
                  <td className="px-2 py-1.5 tabular-nums">{r.fuelSurcharge}%</td>
                  <td className="px-2 py-1.5 tabular-nums">{fmtINR(r.handling)}</td>
                  <td className="px-2 py-1.5 tabular-nums">{fmtINR(r.insurance)}</td>
                  <td className="px-2 py-1.5"><RateStatusBadge status={r.status} /></td>
                  <td className="px-2 py-1.5"><TrendIndicator dir={r.trend} /></td>
                  <td className="px-2 py-1.5"><Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setSelectedRow(r as unknown as Record<string, unknown>); setSheetType("rate"); setSheetOpen(true) }}><Eye className="w-3 h-3" /></Button></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </TabsContent>

        {/* ═══ Tab 3: Carrier Performance ═══ */}
        <TabsContent value="3" className="space-y-3">
          <div className="overflow-auto rounded-lg border max-h-[460px]">
            <table className="w-full text-xs"><thead className="bg-slate-50 dark:bg-slate-800 sticky top-0"><tr>
              <th className="fli-th px-2 py-2 text-left font-medium">Carrier</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Type</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Grade</th>
              <th className="fli-th px-2 py-2 text-left font-medium cursor-pointer" onClick={() => handleSort("onTime")}>On-Time <SortIcon field="onTime" /></th>
              <th className="fli-th px-2 py-2 text-left font-medium">Dmg%</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Claim%</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Avg Transit</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Fleet</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Routes</th>
              <th className="px-2 py-2"></th>
            </tr></thead><tbody>
              {(filtered as unknown as typeof data.carriers).map(r => (
                <tr key={r.id} className="fli-row border-t hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => { setSelectedRow(r as unknown as Record<string, unknown>); setSheetType("carrier"); setSheetOpen(true) }}>
                  <td className="px-2 py-1.5 font-medium">{r.name}</td>
                  <td className="px-2 py-1.5"><CarrierTypeBadge type={r.type} /></td>
                  <td className="px-2 py-1.5"><CarrierGrade grade={r.grade} /></td>
                  <td className="px-2 py-1.5 tabular-nums font-bold">{r.onTime}%</td>
                  <td className="px-2 py-1.5 tabular-nums text-red-600">{r.damageRate}%</td>
                  <td className="px-2 py-1.5 tabular-nums">{r.claimRate}%</td>
                  <td className="px-2 py-1.5"><TransitTile hrs={r.avgTransit} /></td>
                  <td className="px-2 py-1.5 tabular-nums">{r.fleetSize}</td>
                  <td className="px-2 py-1.5 tabular-nums">{r.routes}</td>
                  <td className="px-2 py-1.5"><Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setSelectedRow(r as unknown as Record<string, unknown>); setSheetType("carrier"); setSheetOpen(true) }}><Eye className="w-3 h-3" /></Button></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </TabsContent>

        {/* ═══ Tab 4: Transit Tracking ═══ */}
        <TabsContent value="4" className="space-y-3">
          <div className="overflow-auto rounded-lg border max-h-[460px]">
            <table className="w-full text-xs"><thead className="bg-slate-50 dark:bg-slate-800 sticky top-0"><tr>
              <th className="fli-th px-2 py-2 text-left font-medium">#</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Status</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Exception</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Priority</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Corridor</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Carrier</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Location</th>
              <th className="fli-th px-2 py-2 text-left font-medium cursor-pointer" onClick={() => handleSort("eta")}>ETA <SortIcon field="eta" /></th>
              <th className="fli-th px-2 py-2 text-left font-medium">Delay</th>
              <th className="fli-th px-2 py-2 text-left font-medium">Value</th>
              <th className="px-2 py-2"></th>
            </tr></thead><tbody>
              {(filtered as unknown as typeof data.transits).map(r => (
                <tr key={r.id} className="fli-row border-t hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => { setSelectedRow(r as unknown as Record<string, unknown>); setSheetType("transit"); setSheetOpen(true) }}>
                  <td className="px-2 py-1.5 font-mono font-medium">{String(r.id).padStart(3, "0")}</td>
                  <td className="px-2 py-1.5"><TransitStatusBadge status={r.status} /></td>
                  <td className="px-2 py-1.5"><ExceptionBadge type={r.exception} /></td>
                  <td className="px-2 py-1.5"><PriorityBadge p={r.priority} /></td>
                  <td className="px-2 py-1.5 text-[10px]">{r.corridor}</td>
                  <td className="px-2 py-1.5 text-[10px]">{r.carrier}</td>
                  <td className="px-2 py-1.5 text-[10px] flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" />{r.location}</td>
                  <td className="px-2 py-1.5 tabular-nums font-medium flex items-center gap-0.5"><Timer className="w-3 h-3 text-slate-400" />{r.eta}h</td>
                  <td className={cn("px-2 py-1.5 tabular-nums font-bold", r.delay > 12 ? "text-red-600" : r.delay > 4 ? "text-amber-600" : "text-emerald-600")}>{r.delay}h</td>
                  <td className="px-2 py-1.5"><ShipmentValueTile value={r.value} /></td>
                  <td className="px-2 py-1.5"><Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setSelectedRow(r as unknown as Record<string, unknown>); setSheetType("transit"); setSheetOpen(true) }}><Eye className="w-3 h-3" /></Button></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </TabsContent>

        {/* ═══ Tab 5: Analytics ═══ */}
        <TabsContent value="5" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Avg Cost/Ton Trend", value: fmtINR(ri(2000, 4000, 999)), icon: "IndianRupee", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
              { label: "AI Predictions", value: "98.2%", icon: "BrainCircuit", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { label: "Optimized Routes", value: `${ri(40, 85, 888)}%`, icon: "Compass", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Savings Potential", value: fmtINR(ri(5000000, 25000000, 777)), icon: "BarChart3", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
            ].map((k, i) => (
              <Card key={i} className={cn("hover:shadow-md transition-shadow", k.bg)}>
                <CardContent className="flex items-center gap-3 p-3">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm", k.color)}><KpiIcon name={k.icon} className={k.color} /></div>
                  <div><p className="text-[10px] text-muted-foreground">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost Trend (₹/ton)</CardTitle></CardHeader><CardContent><LineChart data={data.costTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={v => fmtINR(v as number)} /><Tooltip formatter={v => fmtINR(v as number)} /><Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} /><Line type="monotone" dataKey="target" stroke="#e11d48" strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">Carrier Grade Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.gradeDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{data.gradeDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">Mode Efficiency</CardTitle></CardHeader><CardContent><BarChart data={data.modeEff}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mode" tick={{ fontSize: 8 }} angle={-20} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 10 }} unit="%" /><Tooltip /><Bar dataKey="costEff" fill="#3b82f6" radius={[4, 4, 0, 0]} /><Bar dataKey="speed" fill="#0891b2" radius={[4, 4, 0, 0]} /><Bar dataKey="reliability" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">Corridor Revenue</CardTitle></CardHeader><CardContent><BarChart data={data.corridorRev} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={v => fmtINR(v as number)} /><YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={90} /><Tooltip formatter={v => fmtINR(v as number)} /><Bar dataKey="revenue" fill="#7c3aed" radius={[0, 4, 4, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══ Sheet ═══ */}
      <Sheet open={!!(sheetOpen && selectedRow)} onOpenChange={o => { setSheetOpen(o); if (!o) setSelectedRow(null) }}>
        <SheetContent className="w-[400px] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 p-4 rounded-lg text-white mt-4">
            <SheetHeader><SheetTitle className="text-white">
              {sheetType === "corridor" ? `${String(selectedRow?.origin)} → ${String(selectedRow?.destination)}` : sheetType === "rate" ? String(selectedRow?.corridor) : sheetType === "carrier" ? String(selectedRow?.name) : `Transit #${String(selectedRow?.id)?.padStart(3, "0")}`}
            </SheetTitle></SheetHeader>
          </div>
          {selectedRow && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                {sheetType === "corridor" && <>
                  <div><span className="text-muted-foreground">Mode</span><div className="mt-0.5"><ModeBadge mode={String(selectedRow.mode)} /></div></div>
                  <div><span className="text-muted-foreground">Status</span><div className="mt-0.5"><CorridorStatusBadge status={String(selectedRow.status)} /></div></div>
                  <div><span className="text-muted-foreground">Distance</span><div className="mt-0.5"><DistanceTile km={Number(selectedRow.distance)} /></div></div>
                  <div><span className="text-muted-foreground">Transit</span><div className="mt-0.5"><TransitTile hrs={Number(selectedRow.transitTime)} /></div></div>
                  <div><span className="text-muted-foreground">Cost/Ton</span><div className="mt-0.5"><CostPerTonTile cost={Number(selectedRow.costPerTon)} /></div></div>
                  <div><span className="text-muted-foreground">Tonnage</span><div className="font-bold tabular-nums">{Number(selectedRow.tonnage).toLocaleString()}</div></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Utilization</span><div className="mt-0.5 flex items-center gap-2"><UtilizationBar pct={Number(selectedRow.utilization)} /><span className="font-bold">{String(selectedRow.utilization)}%</span></div></div>
                </>}
                {sheetType === "rate" && <>
                  <div><span className="text-muted-foreground">Type</span><div className="mt-0.5"><RateTypeBadge type={String(selectedRow.type)} /></div></div>
                  <div><span className="text-muted-foreground">Status</span><div className="mt-0.5"><RateStatusBadge status={String(selectedRow.status)} /></div></div>
                  <div><span className="text-muted-foreground">Per Km</span><div className="font-bold">{fmtINR(Number(selectedRow.perKm))}</div></div>
                  <div><span className="text-muted-foreground">Per Ton</span><div className="font-bold">{fmtINR(Number(selectedRow.perTon))}</div></div>
                  <div><span className="text-muted-foreground">Fuel Surcharge</span><div className="font-bold">{String(selectedRow.fuelSurcharge)}%</div></div>
                  <div><span className="text-muted-foreground">Handling</span><div className="font-bold">{fmtINR(Number(selectedRow.handling))}</div></div>
                  <div><span className="text-muted-foreground">Insurance</span><div className="font-bold">{fmtINR(Number(selectedRow.insurance))}</div></div>
                  <div><span className="text-muted-foreground">Validity</span><div className="font-medium">{String(selectedRow.validity)}</div></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Trend</span><div className="mt-0.5"><TrendIndicator dir={Number(selectedRow.trend)} /></div></div>
                </>}
                {sheetType === "carrier" && <>
                  <div className="col-span-2"><span className="text-muted-foreground">Type</span><div className="mt-0.5"><CarrierTypeBadge type={String(selectedRow.type)} /></div></div>
                  <div><span className="text-muted-foreground">Grade</span><div className="mt-0.5"><CarrierGrade grade={String(selectedRow.grade)} /></div></div>
                  <div><span className="text-muted-foreground">On-Time</span><div className="font-bold text-emerald-600">{String(selectedRow.onTime)}%</div></div>
                  <div><span className="text-muted-foreground">Damage Rate</span><div className="font-bold text-red-600">{String(selectedRow.damageRate)}%</div></div>
                  <div><span className="text-muted-foreground">Claim Rate</span><div className="font-bold">{String(selectedRow.claimRate)}%</div></div>
                  <div><span className="text-muted-foreground">Avg Transit</span><div className="font-bold">{String(selectedRow.avgTransit)}h</div></div>
                  <div><span className="text-muted-foreground">Fleet Size</span><div className="font-bold">{String(selectedRow.fleetSize)}</div></div>
                  <div><span className="text-muted-foreground">Routes</span><div className="font-bold">{String(selectedRow.routes)}</div></div>
                </>}
                {sheetType === "transit" && <>
                  <div><span className="text-muted-foreground">Status</span><div className="mt-0.5"><TransitStatusBadge status={String(selectedRow.status)} /></div></div>
                  <div><span className="text-muted-foreground">Exception</span><div className="mt-0.5"><ExceptionBadge type={String(selectedRow.exception)} /></div></div>
                  <div><span className="text-muted-foreground">Priority</span><div className="mt-0.5"><PriorityBadge p={String(selectedRow.priority)} /></div></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Location</span><div className="mt-0.5 flex items-center gap-1 font-medium"><MapPin className="w-3 h-3 text-slate-400" />{String(selectedRow.location)}</div></div>
                  <div><span className="text-muted-foreground">ETA</span><div className="font-bold flex items-center gap-1"><Timer className="w-3 h-3" />{String(selectedRow.eta)}h</div></div>
                  <div><span className="text-muted-foreground">Delay</span><div className={cn("font-bold", Number(selectedRow.delay) > 12 ? "text-red-600" : "text-amber-600")}>{String(selectedRow.delay)}h</div></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Shipment Value</span><div className="mt-0.5"><ShipmentValueTile value={Number(selectedRow.value)} /></div></div>
                </>}
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <Button size="sm" className="flex-1" onClick={() => { toast.success("Updated", "Record updated successfully"); setSheetOpen(false) }}><Zap className="w-3 h-3 mr-1" />Action</Button>
                <Button size="sm" variant="outline" onClick={() => { toast.info("Exported", "Record exported to dashboard"); setSheetOpen(false) }}><Eye className="w-3 h-3" /></Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
