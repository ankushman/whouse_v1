"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  LayoutGrid, Box, Package, Warehouse, Search, Eye, ArrowUpDown,
  Activity, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, RefreshCw, Users, BrainCircuit, BarChart3, CheckCircle, Target,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ZONE_TYPES = ["Bulk Storage","Pick Zone","Packing","Receiving","Shipping","Cold Storage","Hazardous","Returns"] as const
const ZT_EMOJI: Record<string,string> = {"Bulk Storage":"\u{1f4e6}","Pick Zone":"\u{1f3af}","Packing":"\u{1f4e6}","Receiving":"\u{1f4e5}","Shipping":"\u{1f4e4}","Cold Storage":"\u{2744}\ufe0f","Hazardous":"\u2622\ufe0f","Returns":"\u{1f504}"}
const ZONE_STS = ["Active","Full","Maintenance","Reorganized","Empty","Locked"] as const
const SLOT_TYPES = ["Fast-Move A","A-B","Slow-Move B","B-C","Dead Stock C","C-C-Return","Seasonal","Overstock"] as const
const SL_STRATS = ["ABC Analysis","Frequency","Family","Weight","Size","Velocity"] as const
const PUT_STS = ["Pending","In Progress","Completed","Exception","Redirected","Cancelled","Hold","Batched"] as const
const PRIO = ["P1 Critical","P2 High","P3 Medium","P4 Low"] as const
const ST_TYPES = ["Rack","Pallet","Mezzanine","Floor","Shelf","Cold Room","Hazardous Cabinet","Returns Area"] as const
const ST_EMOJI: Record<string,string> = {Rack:"\u{1f3d7}\ufe0f",Pallet:"\u{1f4e6}",Mezzanine:"\u{1f3e2}",Floor:"\u{1f7eb}",Shelf:"\u{1f4da}","Cold Room":"\u{2744}\ufe0f","Hazardous Cabinet":"\u2622\ufe0f","Returns Area":"\u{1f504}"}
const WHS = ["WH-Mumbai","WH-Delhi","WH-BLR","WH-Chennai","WH-Hyderabad","WH-Kolkata","WH-Pune","WH-Ahmedabad"] as const
const SUPS = ["Rajesh K","Priya S","Amit P","Sunita R","Vikram S","Anjali N","Deepak G","Meera I","Suresh M","Kavita J"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {blue:"#3b82f6",violet:"#7c3aed",emerald:"#059669",rose:"#e11d48",amber:"#d97706",indigo:"#6366f1"}
const PC = [TH.blue,TH.violet,TH.emerald,TH.rose,TH.amber,TH.indigo,"#06b6d4","#f43f5e"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function fmtINR(n: number): string { const s = n < 0 ? "-" : ""; const a = Math.abs(n); if (a >= 1e7) return `\u20b9${s}${(a / 1e7).toFixed(2)} Cr`; if (a >= 1e5) return `\u20b9${s}${(a / 1e5).toFixed(2)} L`; return `\u20b9${s}${a.toLocaleString("en-IN")}` }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 16 Visual Components */
function ZoneTypeBadge({ type }: { type: string }) {
  const cl: Record<string,string> = {"Bulk Storage":"bg-blue-100 text-blue-800","Pick Zone":"bg-emerald-100 text-emerald-800",Packing:"bg-violet-100 text-violet-800",Receiving:"bg-amber-100 text-amber-800",Shipping:"bg-indigo-100 text-indigo-800","Cold Storage":"bg-cyan-100 text-cyan-800",Hazardous:"bg-rose-100 text-rose-800",Returns:"bg-gray-100 text-gray-800"}
  return <span className={`wdp-zone-type inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[type]||"bg-gray-100"}`}>{ZT_EMOJI[type]} {type}</span>
}
function ZoneStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Active:"bg-emerald-100 text-emerald-700",Full:"bg-red-100 text-red-700",Maintenance:"bg-amber-100 text-amber-700",Reorganized:"bg-indigo-100 text-indigo-700",Empty:"bg-gray-100 text-gray-500",Locked:"bg-rose-100 text-rose-700"}
  return <span className={`wdp-zone-status inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||""} ${status==="Active"?"animate-pulse":""}`}>\u25cf {status}</span>
}
function SlotTypeBadge({ type }: { type: string }) {
  const cl: Record<string,string> = {"Fast-Move A":"bg-emerald-100 text-emerald-800","A-B":"bg-blue-100 text-blue-800","Slow-Move B":"bg-amber-100 text-amber-800","B-C":"bg-indigo-100 text-indigo-800","Dead Stock C":"bg-red-100 text-red-800","C-C-Return":"bg-gray-100 text-gray-700",Seasonal:"bg-violet-100 text-violet-800",Overstock:"bg-rose-100 text-rose-800"}
  return <span className={`wdp-slot-type inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[type]||"bg-gray-100"}`}>{type}</span>
}
function SlotStrategyBadge({ strategy }: { strategy: string }) {
  return <span className="wdp-slot-strat inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-100 text-violet-700"><BrainCircuit className="h-3 w-3"/>{strategy}</span>
}
function PutawayStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Pending:"bg-amber-100 text-amber-700","In Progress":"bg-blue-100 text-blue-700",Completed:"bg-emerald-100 text-emerald-700",Exception:"bg-red-100 text-red-700",Redirected:"bg-indigo-100 text-indigo-700",Cancelled:"bg-gray-100 text-gray-500",Hold:"bg-rose-100 text-rose-700",Batched:"bg-violet-100 text-violet-700"}
  return <span className={`wdp-put-status inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||""} ${status==="In Progress"?"animate-pulse":""}`}>\u25cf {status}</span>
}
function PriorityBadge({ priority }: { priority: string }) {
  const cl: Record<string,string> = {"P1 Critical":"wdp-prio-p1 bg-red-100 text-red-700 shadow-sm shadow-red-300/50","P2 High":"wdp-prio-p2 bg-orange-100 text-orange-700","P3 Medium":"wdp-prio-p3 bg-amber-100 text-amber-700","P4 Low":"wdp-prio-p4 bg-gray-100 text-gray-500"}
  return <span className={`wdp-priority inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${cl[priority]||""}`}>{priority}</span>
}
function UtilizationBar({ value }: { value: number }) {
  const c = value > 70 ? "bg-emerald-500" : value > 40 ? "bg-blue-500" : value > 20 ? "bg-amber-500" : "bg-red-500"
  return <div className="wdp-util-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${c}`} style={{ width: `${Math.min(value,100)}%` }}/></div>
}
function OccupancyBar({ value }: { value: number }) {
  const c = value > 95 ? "bg-red-500" : value > 80 ? "bg-amber-500" : value > 50 ? "bg-blue-500" : "bg-emerald-500"
  return <div className="wdp-occ-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${c}`} style={{ width: `${Math.min(value,100)}%` }}/></div>
}
function StorageTypeBadge({ type }: { type: string }) {
  return <span className="wdp-stor-type inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">{ST_EMOJI[type]} {type}</span>
}
function VelocityBar({ score }: { score: number }) {
  const c = score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"
  return <div className="wdp-vel-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${c}`} style={{ width: `${score}%` }}/></div>
}
function WHBadge({ wh }: { wh: string }) {
  return <span className="wdp-wh inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700"><Warehouse className="h-3 w-3"/>{wh}</span>
}
function TurnoverTile({ rate }: { rate: number }) {
  return <span className="wdp-turnover inline-flex items-center gap-1 text-[10px] font-medium text-gray-700"><RefreshCw className="h-3 w-3 text-indigo-500"/>{rate.toFixed(1)}x</span>
}
function SKUTile({ sku }: { sku: string }) {
  return <span className="wdp-sku inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-800">{sku}</span>
}
function WeightTile({ kg }: { kg: number }) {
  return <span className="wdp-weight inline-flex items-center gap-1 text-[10px] text-gray-600"><Package className="h-3 w-3"/>{kg} kg</span>
}
function SupervisorBadge({ name }: { name: string }) {
  return <span className="wdp-sup inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700"><Users className="h-3 w-3"/>{name}</span>
}
function DimensionTile({ l, w, h }: { l: number; w: number; h: number }) {
  return <span className="wdp-dim inline-flex items-center gap-1 text-[10px] text-gray-500"><Box className="h-3 w-3"/>{l}\u00d7{w}\u00d7{h} cm</span>
}

/* Data Generation (265 records) */
const zones = Array.from({ length: 75 }, (_, i) => ({ id: i + 1, code: `ZN-${String(i+1).padStart(3,"0")}`, type: ZONE_TYPES[ri(0,7,i*7+1)] as string, status: ZONE_STS[ri(0,5,i*7+2)] as string, util: ri(15,98,i*7+3), cap: ri(500,5000,i*7+4), items: ri(50,4000,i*7+5), wh: WHS[ri(0,7,i*7+6)] as string, sup: SUPS[ri(0,9,i*7+7)] as string }))
const slots = Array.from({ length: 70 }, (_, i) => ({ id: i + 1, code: `SL-${String(i+1).padStart(3,"0")}`, type: SLOT_TYPES[ri(0,7,i*8+1)] as string, strat: SL_STRATS[ri(0,5,i*8+2)] as string, pickRate: ri(20,200,i*8+3), hits: ri(5,80,i*8+4), acc: ri(85,100,i*8+5), vel: ri(10,100,i*8+6) }))
const putaways = Array.from({ length: 55 }, (_, i) => ({ id: i + 1, sku: `SKU-${String(ri(10000,99999,i*9+1)).padStart(5,"0")}`, zone: ZONE_TYPES[ri(0,7,i*9+2)] as string, slot: `SL-${String(ri(1,70,i*9+3)).padStart(3,"0")}`, status: PUT_STS[ri(0,7,i*9+4)] as string, prio: PRIO[ri(0,3,i*9+5)] as string, wt: ri(1,500,i*9+6), l: ri(10,200,i*9+7), w: ri(10,150,i*9+8), h: ri(5,180,i*9+9), assigned: SUPS[ri(0,9,i*9+10)] as string, elapsed: `${ri(0,48,i*9+11)}h ${ri(0,59,i*9+12)}m` }))
const storage = Array.from({ length: 65 }, (_, i) => { const cap = ri(200,10000,i*10+3), filled = ri(50,Math.min(9000,cap),i*10+4); return { id: i+1, code: `ST-${String(i+1).padStart(3,"0")}`, type: ST_TYPES[ri(0,7,i*10+1)] as string, occ: Math.round(filled/cap*100), cap, filled, avail: cap-filled, turn: +(ri(1,15,i*10+5)+seededRandom(i*10+6)).toFixed(1), wh: WHS[ri(0,7,i*10+7)] as string }})
const data = { zones, slots, putaways, storage }

/* Chart Data */
const thrData = Array.from({ length: 30 }, (_, i) => ({ day: `D${i+1}`, Receiving: ri(80,300,i*3+100), Picking: ri(100,350,i*3+101), Shipping: ri(60,280,i*3+102) }))
const ztPie = ZONE_TYPES.map((n, i) => ({ name: n, value: ri(5,20,i+200) }))
const whComp = WHS.map((w, i) => ({ name: w.replace("WH-",""), throughput: ri(500,3000,i+300), efficiency: ri(70,98,i+400) }))
const utilTrend = MO.map((m, i) => ({ month: m, utilization: ri(70,95,i+500), target: 85 }))
const stPie = ST_TYPES.map((n, i) => ({ name: n, value: ri(5,25,i+600) }))
const putEff = Array.from({ length: 6 }, (_, i) => ({ month: MO[i*2], efficiency: ri(75,98,i+700), target: 90 }))
const zPerf = ZONE_TYPES.map((z, i) => ({ zone: z, perf: ri(60,98,i+800) }))

export default function WMSDashboardProView() {
  const [activeTab, setActiveTab] = useState("0")
  const [search, setSearch] = useState("")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selZone, setSelZone] = useState<typeof data.zones[0] | null>(null)
  const { toast } = useToast()
  const showSheet = !!(sheetOpen && selZone)

  const fZones = useMemo(() => sortedData(filterData(data.zones, search), "util", sortDir), [search, sortDir])
  const fSlots = useMemo(() => sortedData(filterData(data.slots, search), "pickRate", sortDir), [search, sortDir])
  const fPuts = useMemo(() => sortedData(filterData(data.putaways, search), "wt", sortDir), [search, sortDir])
  const fStor = useMemo(() => sortedData(filterData(data.storage, search), "occ", sortDir), [search, sortDir])

  const activePutCount = data.putaways.filter(p => p.status !== "Completed" && p.status !== "Cancelled").length
  const avgUtil = Math.round(zones.reduce((s,z) => s+z.util, 0) / zones.length)
  const avgAcc = Math.round(slots.reduce((s,sl) => s+sl.acc, 0) / slots.length)
  const avgVel = Math.round(slots.reduce((s,sl) => s+sl.vel, 0) / slots.length)

  const kpis = [
    { label: "Total Zones", value: "75", icon: LayoutGrid, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Utilization %", value: `${avgUtil}%`, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Putaways", value: String(activePutCount), icon: Package, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Pick Efficiency", value: `${avgAcc}%`, icon: Target, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Slot Score", value: String(avgVel), icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Storage Capacity", value: fmtINR(124500000), icon: Warehouse, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Throughput", value: "2,450/day", icon: TrendingUp, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Accuracy %", value: "97.8%", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  ]

  const SearchBar = () => (
    <div className="flex items-center gap-2 mb-3">
      <div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input placeholder="Search records..." value={search} onChange={e=>setSearch(e.target.value)} className="wdp-search pl-8 h-9 text-sm"/></div>
      <Button variant="outline" size="sm" className="wdp-sort-btn" onClick={()=>setSortDir(d=>d==="asc"?"desc":"asc")}><ArrowUpDown className="h-4 w-4"/></Button>
    </div>
  )

  return (
    <div className="wdp-root space-y-4">
      <PageHeader title="WMS Dashboard Pro" description="Comprehensive warehouse management \u2014 zone, slotting, putaway, storage & analytics across 8 Indian warehouses"/>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="wdp-tabs h-auto flex-wrap gap-1 bg-muted/50">
          {["WMS Dashboard","Zone Management","Slotting Optimization","Putaway Management","Storage Utilization","WMS Analytics"].map((t,i)=>(
            <TabsTrigger key={i} value={String(i)} className="wdp-tab text-xs px-3 py-1.5">{t}</TabsTrigger>
          ))}
        </TabsList>

        {activeTab === "0" && (
          <div className="wdp-dash space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kpis.map((k,i)=>(
                <Card key={i} className="wdp-kpi border-border/60">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`wdp-kpi-icon ${k.bg} p-2.5 rounded-lg`}><k.icon className={`h-5 w-5 ${k.color}`}/></div>
                    <div><p className="text-xs text-muted-foreground">{k.label}</p><p className={`wdp-kpi-val text-lg font-bold ${k.color}`}>{k.value}</p></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="wdp-chart border-border/60">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Daily Throughput (30 Days)</CardTitle></CardHeader>
              <CardContent><LineChart data={thrData} height={250}><CartesianGrid strokeDasharray="3 3" className="stroke-muted"/><XAxis dataKey="day" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Line type="monotone" dataKey="Receiving" stroke={TH.blue} strokeWidth={2} dot={false}/><Line type="monotone" dataKey="Picking" stroke={TH.emerald} strokeWidth={2} dot={false}/><Line type="monotone" dataKey="Shipping" stroke={TH.violet} strokeWidth={2} dot={false}/></LineChart></CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="wdp-chart border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Zone Type Distribution</CardTitle></CardHeader>
                <CardContent><PieChart height={260}><Pie data={ztPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({name})=>name} labelLine={false}>{ztPie.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent>
              </Card>
              <Card className="wdp-chart border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Warehouse Comparison</CardTitle></CardHeader>
                <CardContent><BarChart data={whComp} height={260}><CartesianGrid strokeDasharray="3 3" className="stroke-muted"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Bar dataKey="throughput" fill={TH.blue} radius={[4,4,0,0]}/><Bar dataKey="efficiency" fill={TH.emerald} radius={[4,4,0,0]}/></BarChart></CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "1" && (
          <div className="wdp-zones space-y-3">
            <SearchBar/>
            <p className="text-xs text-muted-foreground">{fZones.length} zones \u00b7 Sort: {sortDir === "desc" ? "Highest first" : "Lowest first"}</p>
            <div className="overflow-auto max-h-[520px] rounded-lg border border-border/60">
              <table className="w-full text-xs"><thead className="sticky top-0 bg-muted/90 backdrop-blur"><tr className="border-b">
                <th className="p-2 text-left font-semibold">Code</th><th className="p-2 text-left font-semibold">Type</th>
                <th className="p-2 text-left font-semibold">Status</th><th className="p-2 text-left font-semibold min-w-[120px]">Utilization</th>
                <th className="p-2 text-right font-semibold">Cap</th><th className="p-2 text-right font-semibold">Items</th>
                <th className="p-2 text-left font-semibold">Warehouse</th><th className="p-2 text-left font-semibold">Supervisor</th>
                <th className="p-2 text-center font-semibold">Action</th>
              </tr></thead><tbody>
                {fZones.map(z=>(
                  <tr key={z.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-2 font-mono font-semibold">{z.code}</td>
                    <td className="p-2"><ZoneTypeBadge type={z.type}/></td>
                    <td className="p-2"><ZoneStatusBadge status={z.status}/></td>
                    <td className="p-2"><div className="flex items-center gap-2"><UtilizationBar value={z.util}/><span className="font-mono text-[10px] w-8 text-right">{z.util}%</span></div></td>
                    <td className="p-2 text-right font-mono">{z.cap.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono">{z.items.toLocaleString()}</td>
                    <td className="p-2"><WHBadge wh={z.wh}/></td>
                    <td className="p-2"><SupervisorBadge name={z.sup}/></td>
                    <td className="p-2 text-center"><Button variant="ghost" size="sm" className="wdp-eye-btn h-7 w-7 p-0" onClick={()=>{setSelZone(z);setSheetOpen(true);toast.success("Zone Details",`Viewing ${z.code}`)}}><Eye className="h-3.5 w-3.5"/></Button></td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          </div>
        )}

        {activeTab === "2" && (
          <div className="wdp-slots space-y-3">
            <SearchBar/>
            <p className="text-xs text-muted-foreground">{fSlots.length} slots \u00b7 Sort by pick rate: {sortDir}</p>
            <div className="overflow-auto max-h-[520px] rounded-lg border border-border/60">
              <table className="w-full text-xs"><thead className="sticky top-0 bg-muted/90 backdrop-blur"><tr className="border-b">
                <th className="p-2 text-left font-semibold">Code</th><th className="p-2 text-left font-semibold">Type</th>
                <th className="p-2 text-left font-semibold">Strategy</th><th className="p-2 text-right font-semibold">Pick Rate</th><th className="p-2 text-right font-semibold">Hits/Day</th>
                <th className="p-2 text-right font-semibold">Accuracy</th><th className="p-2 text-left font-semibold min-w-[120px]">Velocity</th>
              </tr></thead><tbody>
                {fSlots.map(s=>(
                  <tr key={s.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-2 font-mono font-semibold">{s.code}</td>
                    <td className="p-2"><SlotTypeBadge type={s.type}/></td>
                    <td className="p-2"><SlotStrategyBadge strategy={s.strat}/></td>
                    <td className="p-2 text-right font-mono">{s.pickRate}</td>
                    <td className="p-2 text-right font-mono">{s.hits}</td>
                    <td className="p-2 text-right font-mono">{s.acc}%</td>
                    <td className="p-2"><div className="flex items-center gap-2"><VelocityBar score={s.vel}/><span className="font-mono text-[10px] w-6 text-right">{s.vel}</span></div></td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          </div>
        )}

        {activeTab === "3" && (
          <div className="wdp-putaways space-y-3">
            <SearchBar/>
            <p className="text-xs text-muted-foreground">{fPuts.length} putaways \u00b7 Sort by weight: {sortDir}</p>
            <div className="overflow-auto max-h-[520px] rounded-lg border border-border/60">
              <table className="w-full text-xs"><thead className="sticky top-0 bg-muted/90 backdrop-blur"><tr className="border-b">
                <th className="p-2 text-left font-semibold">SKU</th><th className="p-2 text-left font-semibold">Zone</th>
                <th className="p-2 text-left font-semibold">Slot</th><th className="p-2 text-left font-semibold">Status</th>
                <th className="p-2 text-left font-semibold">Priority</th><th className="p-2 text-left font-semibold">Weight</th>
                <th className="p-2 text-left font-semibold">Dimensions</th><th className="p-2 text-left font-semibold">Assigned</th>
                <th className="p-2 text-left font-semibold">Elapsed</th>
              </tr></thead><tbody>
                {fPuts.map(p=>(
                  <tr key={p.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-2"><SKUTile sku={p.sku}/></td>
                    <td className="p-2 text-[10px]">{p.zone}</td>
                    <td className="p-2 font-mono text-[10px]">{p.slot}</td>
                    <td className="p-2"><PutawayStatusBadge status={p.status}/></td>
                    <td className="p-2"><PriorityBadge priority={p.prio}/></td>
                    <td className="p-2"><WeightTile kg={p.wt}/></td>
                    <td className="p-2"><DimensionTile l={p.l} w={p.w} h={p.h}/></td>
                    <td className="p-2"><SupervisorBadge name={p.assigned}/></td>
                    <td className="p-2 text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/>{p.elapsed}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          </div>
        )}

        {activeTab === "4" && (
          <div className="wdp-storage space-y-3">
            <SearchBar/>
            <p className="text-xs text-muted-foreground">{fStor.length} records \u00b7 Sort by occupancy: {sortDir}</p>
            <div className="overflow-auto max-h-[520px] rounded-lg border border-border/60">
              <table className="w-full text-xs"><thead className="sticky top-0 bg-muted/90 backdrop-blur"><tr className="border-b">
                <th className="p-2 text-left font-semibold">Code</th><th className="p-2 text-left font-semibold">Type</th>
                <th className="p-2 text-left font-semibold min-w-[120px]">Occupancy</th>
                <th className="p-2 text-right font-semibold">Cap</th><th className="p-2 text-right font-semibold">Filled</th>
                <th className="p-2 text-right font-semibold">Avail</th><th className="p-2 text-left font-semibold">Turnover</th>
                <th className="p-2 text-left font-semibold">Warehouse</th>
              </tr></thead><tbody>
                {fStor.map(s=>(
                  <tr key={s.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-2 font-mono font-semibold">{s.code}</td>
                    <td className="p-2"><StorageTypeBadge type={s.type}/></td>
                    <td className="p-2"><div className="flex items-center gap-2"><OccupancyBar value={s.occ}/><span className="font-mono text-[10px] w-8 text-right">{s.occ}%</span></div></td>
                    <td className="p-2 text-right font-mono">{s.cap.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono">{s.filled.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono">{s.avail.toLocaleString()}</td>
                    <td className="p-2"><TurnoverTile rate={s.turn}/></td>
                    <td className="p-2"><WHBadge wh={s.wh}/></td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          </div>
        )}

        {activeTab === "5" && (
          <div className="wdp-analytics space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="wdp-chart border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Utilization Trend vs Target (85%)</CardTitle></CardHeader>
                <CardContent><LineChart data={utilTrend} height={240}><CartesianGrid strokeDasharray="3 3" className="stroke-muted"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} domain={[60,100]}/><Tooltip/><Line type="monotone" dataKey="utilization" stroke={TH.blue} strokeWidth={2}/><Line type="monotone" dataKey="target" stroke={TH.rose} strokeDasharray="6 3" strokeWidth={1.5}/></LineChart></CardContent>
              </Card>
              <Card className="wdp-chart border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Storage Type Distribution</CardTitle></CardHeader>
                <CardContent><PieChart height={240}><Pie data={stPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({name})=>name} labelLine={false}>{stPie.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent>
              </Card>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="wdp-chart border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Putaway Efficiency (6 Months)</CardTitle></CardHeader>
                <CardContent><AreaChart data={putEff} height={240}><CartesianGrid strokeDasharray="3 3" className="stroke-muted"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} domain={[60,100]}/><Tooltip/><Area type="monotone" dataKey="efficiency" fill={TH.violet} stroke={TH.violet} fillOpacity={0.3}/><Area type="monotone" dataKey="target" fill={TH.rose} stroke={TH.rose} fillOpacity={0.1}/></AreaChart></CardContent>
              </Card>
              <Card className="wdp-chart border-border/60">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Zone Performance</CardTitle></CardHeader>
                <CardContent><BarChart data={zPerf} height={240} layout="vertical"><CartesianGrid strokeDasharray="3 3" className="stroke-muted"/><XAxis type="number" tick={{fontSize:10}} domain={[0,100]}/><YAxis dataKey="zone" type="category" tick={{fontSize:9}} width={100}/><Tooltip/><Bar dataKey="perf" fill={TH.emerald} radius={[0,4,4,0]}/></BarChart></CardContent>
              </Card>
            </div>
          </div>
        )}
      </Tabs>

      <Sheet open={showSheet} onOpenChange={o=>{setSheetOpen(o);if(!o)setSelZone(null)}}>
        <SheetContent className="wdp-sheet w-full sm:max-w-lg">
          <SheetHeader><SheetTitle className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Zone Details \u2014 {selZone?.code}</SheetTitle></SheetHeader>
          {selZone && (
            <div className="mt-4 space-y-4">
              <Card className="wdp-sheet-card p-4 border-border/60">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <ZoneTypeBadge type={selZone.type}/>
                  <ZoneStatusBadge status={selZone.status}/>
                  <WHBadge wh={selZone.wh}/>
                </div>
                <div className="space-y-3">
                  <div><p className="text-xs text-muted-foreground mb-1">Utilization ({selZone.util}%)</p><UtilizationBar value={selZone.util}/></div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground text-xs">Capacity:</span><p className="font-mono font-semibold">{selZone.cap.toLocaleString()} units</p></div>
                    <div><span className="text-muted-foreground text-xs">Current Items:</span><p className="font-mono font-semibold">{selZone.items.toLocaleString()}</p></div>
                    <div><span className="text-muted-foreground text-xs">Available:</span><p className="font-mono font-semibold text-emerald-600">{(selZone.cap - selZone.items).toLocaleString()}</p></div>
                    <div><span className="text-muted-foreground text-xs">Filled Value:</span><p className="font-mono font-semibold">{fmtINR(selZone.items * 2450)}</p></div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t"><SupervisorBadge name={selZone.sup}/></div>
                </div>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}