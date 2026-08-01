"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BarChart3, MapPin, Package, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star, Target, Crosshair, Brain, Sparkles, ShoppingCart, Warehouse, ArrowRight, ListOrdered, Waypoints, Route, Footprints, ChevronRight, Pickaxe, HandMetal
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PICK_METHODS = ["Zone Picking","Batch Picking","Wave Picking","Cluster Picking","Discrete Picking","Goods-to-Person","Voice Picking","Pick-to-Light"] as const
const PICK_EMOJI: Record<string,string> = {["Zone Picking"]:"🎯",["Batch Picking"]:"📦",["Wave Picking"]:"🌊",["Cluster Picking"]:"👥",["Discrete Picking"]:"📥",["Goods-to-Person"]:"🤖",["Voice Picking"]:"🎤",["Pick-to-Light"]:"💡"}
const PICK_STS = ["Assigned","In Progress","Completed","Paused","Cancelled","Exception"] as const
const ZONES = ["Zone A - Fast Movers","Zone B - Medium","Zone C - Slow Movers","Zone D - Bulk","Zone E - Hazmat","Zone F - Cold","Zone G - High Value","Zone H - Returns"] as const
const PRIORITIES = ["Urgent","High","Medium","Low","Economy"] as const
const SKU_CATS = ["Electronics","Apparel","FMCG","Pharma","Auto Parts","Home Decor","Sports","Books"] as const
const SLOT_TYPES = ["Pallet Rack","Shelf Bin","Floor Stack","Flow Rack","Carton Flow","Mezzanine","Mobile Rack","ASRS"] as const
const PATH_ALGOS = ["S-Shape","Largest Gap","Midpoint","Composite","Optimal AI","Nearest Neighbor","Zigzag","Return"] as const
const ERR_TYPES = ["Wrong SKU","Wrong Qty","Damaged","Short Ship","Location Error","Label Mismatch","Weight Mismatch","QC Fail"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {emerald:"#059669",blue:"#3b82f6",amber:"#d97706",rose:"#e11d48",violet:"#7c3aed",cyan:"#0891b2",indigo:"#4f46e5",orange:"#f97316"}
const PC = [TH.emerald,TH.blue,TH.amber,TH.rose,TH.violet,TH.cyan,TH.indigo,TH.orange]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.abs(s) % arr.length] }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 18 Visual Components */
function PickMethodBadge({ m }: { m: string }) {
  const cl: Record<string,string> = {["Zone Picking"]:"bg-emerald-100 text-emerald-700",["Batch Picking"]:"bg-blue-100 text-blue-700",["Wave Picking"]:"bg-amber-100 text-amber-700",["Cluster Picking"]:"bg-violet-100 text-violet-700",["Discrete Picking"]:"bg-cyan-100 text-cyan-700",["Goods-to-Person"]:"bg-indigo-100 text-indigo-700",["Voice Picking"]:"bg-rose-100 text-rose-700",["Pick-to-Light"]:"bg-orange-100 text-orange-700"}
  return <span className={"wsp-method inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[m]||"bg-gray-100")}>{PICK_EMOJI[m]} {m}</span>
}
function PickStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Assigned:"bg-blue-100 text-blue-700","In Progress":"bg-amber-100 text-amber-700 animate-pulse",Completed:"bg-emerald-100 text-emerald-700",Paused:"bg-slate-100 text-slate-600",Cancelled:"bg-gray-100 text-gray-500",Exception:"bg-red-100 text-red-700 shadow-[0_0_8px_oklch(0.55_0.22_25/0.3)]"}
  return <span className={"wsp-status inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cl[s]||"bg-gray-100")}>● {s}</span>
}
function ZoneBadge({ z }: { z: string }) {
  const code = z.split(" - ")[0]
  const cl: Record<string,string> = {"Zone A":"bg-emerald-50 text-emerald-700","Zone B":"bg-blue-50 text-blue-700","Zone C":"bg-amber-50 text-amber-700","Zone D":"bg-slate-50 text-slate-700","Zone E":"bg-red-50 text-red-700","Zone F":"bg-cyan-50 text-cyan-700","Zone G":"bg-violet-50 text-violet-700","Zone H":"bg-rose-50 text-rose-700"}
  return <span className={"wsp-zone inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold " + (cl[code]||"bg-gray-50") + " dark:bg-opacity-20"}>📍 {code}</span>
}
function PriorityBadge({ p }: { p: string }) {
  const cl: Record<string,string> = {Urgent:"bg-red-100 text-red-700 shadow-[0_0_8px_oklch(0.55_0.22_25/0.3)]",High:"bg-orange-100 text-orange-700",Medium:"bg-amber-100 text-amber-700",Low:"bg-blue-100 text-blue-700",Economy:"bg-slate-100 text-slate-600"}
  const emoji: Record<string,string> = {Urgent:"🔴",High:"🟠",Medium:"🟡",Low:"🔵",Economy:"⚪"}
  return <span className={"wsp-priority inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold " + (cl[p]||"bg-gray-100")}>{emoji[p]} {p}</span>
}
function SkuCatBadge({ c }: { c: string }) {
  const cl: Record<string,string> = {Electronics:"bg-indigo-100 text-indigo-700",Apparel:"bg-pink-100 text-pink-700",FMCG:"bg-emerald-100 text-emerald-700",Pharma:"bg-cyan-100 text-cyan-700","Auto Parts":"bg-amber-100 text-amber-700","Home Decor":"bg-violet-100 text-violet-700",Sports:"bg-orange-100 text-orange-700",Books:"bg-rose-100 text-rose-700"}
  return <span className={"wsp-sku inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[c]||"bg-gray-100")}>{c}</span>
}
function SlotTypeBadge({ t }: { t: string }) {
  return <span className="wsp-slot inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">📁 {t}</span>
}
function AlgoBadge({ a }: { a: string }) {
  const ai = a.includes("AI") || a.includes("Optimal")
  return <span className={"wsp-algo inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (ai ? "bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 dark:from-violet-900/30 dark:to-indigo-900/30" : "bg-slate-100 text-slate-700")}>{ai ? "🤖" : "🔧"} {a}</span>
}
function ErrTypeBadge({ t }: { t: string }) {
  return <span className="wsp-err inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">❌ {t}</span>
}
function PickerBadge({ name, score }: { name: string; score: number }) {
  const c = score >= 95 ? "text-emerald-600" : score >= 85 ? "text-blue-600" : score >= 70 ? "text-amber-600" : "text-red-600"
  return <span className={"wsp-picker inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold " + c}><Footprints className="h-3 w-3"/>{name} <span className="font-black tabular-nums">{score}%</span></span>
}
function AccuracyGauge({ value }: { value: number }) {
  const c = value >= 99 ? "text-emerald-600" : value >= 97 ? "text-blue-600" : value >= 95 ? "text-amber-600" : "text-red-600"
  return <div className="wsp-accuracy flex items-center gap-1"><span className={"text-sm font-black tabular-nums " + c}>{value}%</span><div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c.replace("text-","bg-")} style={{width: value + "%"}}/></div></div>
}
function SpeedTile({ value, unit }: { value: number; unit: string }) {
  return <div className="wsp-speed text-right"><div className="text-sm font-bold tabular-nums">{value}<span className="text-[10px] text-muted-foreground ml-0.5">{unit}</span></div></div>
}
function PickRateBar({ picks, target }: { picks: number; target: number }) {
  const pct = Math.round((picks / target) * 100)
  const c = pct >= 100 ? "bg-emerald-500" : pct >= 80 ? "bg-blue-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"
  return <div className="wsp-rate-bar flex items-center gap-2"><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c} style={{width: Math.min(pct,100) + "%"}}/></div><span className="text-[10px] font-bold tabular-nums">{picks}/{target}</span></div>
}
function TravelDistTile({ meters }: { meters: number }) {
  const km = (meters / 1000).toFixed(1)
  return <span className="wsp-travel text-xs font-medium tabular-nums text-violet-600 dark:text-violet-400">{km} km</span>
}
function UPHGauge({ uph }: { uph: number }) {
  const c = uph >= 120 ? "text-emerald-600" : uph >= 100 ? "text-blue-600" : uph >= 80 ? "text-amber-600" : "text-red-600"
  return <div className="wsp-uph flex items-center gap-1"><span className={"text-sm font-black tabular-nums " + c}>{uph}</span><span className="text-[9px] text-muted-foreground">UPH</span></div>
}
function EffortScore({ score }: { score: number }) {
  const c = score >= 90 ? "bg-emerald-100 text-emerald-700" : score >= 70 ? "bg-blue-100 text-blue-700" : score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
  return <span className={"wsp-effort inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold " + c}>{score}/100</span>
}
function StarRating({ value }: { value: number }) {
  return <span className="wsp-stars inline-flex gap-0.5">{"★".repeat(value)}{"☆".repeat(5-value)}</span>
}
function ValueTile({ value, label, trend }: { value: string; label: string; trend: number }) {
  return <div className="wsp-val text-right"><div className="text-sm font-bold tabular-nums">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div>{trend !== 0 && <div className={"text-[10px] font-semibold flex items-center justify-end gap-0.5 " + (trend > 0 ? "text-emerald-600" : "text-red-600")}>{trend > 0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}{Math.abs(trend)}%</div>}</div>
}

function genPickTasks() {
  return Array.from({length: 80}, (_, i) => ({
    id: "PK-" + String(i+5001).padStart(4,"0"),
    method: pick(PICK_METHODS, i+1),
    status: pick(PICK_STS, i+2),
    zone: pick(ZONES, i+3),
    priority: pick(PRIORITIES, i+4),
    picker: pick(["Arun K.","Bhavna S.","Deepak R.","Esha P.","Farhan M.","Geeta T."], i+5),
    pickerScore: ri(72, 99, i+6),
    sku: "SKU-" + String(ri(1000,9999,i+7)),
    skuCat: pick(SKU_CATS, i+8),
    slot: pick(SLOT_TYPES, i+9),
    location: "LOC-" + String(ri(1,999,i+10)).padStart(4,"0") + "-" + pick(["A","B","C","D"], i+11) + "-" + ri(1,6,i+12),
    qty: ri(1, 50, i+13),
    targetQty: ri(10, 60, i+14),
    picksPerHr: ri(65, 150, i+15),
    accuracy: ri(92, 100, i+16),
    travelDist: ri(200, 3500, i+17),
    effortScore: ri(40, 98, i+18),
    algo: pick(PATH_ALGOS, i+19),
    itemsTotal: ri(5, 120, i+20),
    orderCount: ri(1, 15, i+21),
    startTime: ri(0,23,i+22) + ":" + String(ri(0,59,i+23)).padStart(2,"0"),
    duration: ri(3, 90, i+23) + " min",
  }))
}

function genExceptions() {
  return Array.from({length: 55}, (_, i) => ({
    id: "EX-" + String(i+6001).padStart(4,"0"),
    taskId: "PK-" + String(ri(5001,5080,i+1)).padStart(4,"0"),
    type: pick(ERR_TYPES, i+2),
    severity: pick(["Critical","Major","Minor","Info"], i+3),
    zone: pick(ZONES, i+4),
    picker: pick(["Arun K.","Bhavna S.","Deepak R.","Esha P.","Farhan M.","Geeta T."], i+5),
    resolved: i % 3 !== 0,
    rootCause: pick(["Human Error","System Glitch","Wrong Label","Inventory Mismatch","Damaged Stock","Equipment Failure"], i+6),
    action: pick(["Re-pick","Adjust Qty","Replace Item","Investigate","Log and Skip","Escalate"], i+7),
    costImpact: ri(0, 50, i+8),
  }))
}

function genPickers() {
  return ["Arun K.","Bhavna S.","Deepak R.","Esha P.","Farhan M.","Geeta T."].map((name, i) => ({
    name,
    uph: ri(80, 145, i+1),
    accuracy: ri(93, 100, i+2),
    totalPicks: ri(2000, 8000, i+3),
    avgDist: ri(800, 2500, i+4),
    shift: pick(["Morning","Afternoon","Night"], i+5),
    zone: pick(ZONES, i+6),
    score: ri(75, 99, i+7),
    rating: ri(3, 5, i+8),
    exceptions: ri(0, 25, i+9),
  }))
}

function genCharts() {
  const hourly = Array.from({length:12}, (_, i) => ({ hour: (8+i) + ":00", picks: ri(200,600,i), accuracy: ri(94,100,i+12), errors: ri(0,15,i+24) }))
  const methodPie = PICK_METHODS.map((m, i) => ({ name: m.split(" ")[0], value: ri(80,400,i) }))
  const zoneBar = ZONES.map((z, i) => ({ name: z.split(" - ")[0], picks: ri(500,3000,i), accuracy: ri(93,100,i+8), time: ri(10,45,i+16) }))
  const monthly = MO.map((m, i) => ({ month: m, picks: ri(15000,45000,i), accuracy: ri(94,99,i+12), uph: ri(90,130,i+24) }))
  const algoBar = PATH_ALGOS.map((a, i) => ({ name: a.split(" ")[0], distance: ri(500,3000,i), time: ri(15,60,i+8), efficiency: ri(60,98,i+16) }))
  return { hourly, methodPie, zoneBar, monthly, algoBar }
}

export default function WarehouseSmartPickingView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc")
  const [detail, setDetail] = useState<Record<string, unknown>|null>(null)

  const pickTasks = useMemo(() => genPickTasks(), [])
  const exceptions = useMemo(() => genExceptions(), [])
  const pickers = useMemo(() => genPickers(), [])
  const charts = useMemo(() => genCharts(), [])

  const filteredTasks = useMemo(() => sortedData(filterData(pickTasks, search), sortField, sortDir), [pickTasks, search, sortField, sortDir])
  const filteredEx = useMemo(() => sortedData(filterData(exceptions, search), sortField, sortDir), [exceptions, search, sortField, sortDir])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Total Picks Today","4,218","12.3%",<Package key="p"/>],["Avg UPH","112","+5.1%",<Zap key="z"/>],["Accuracy Rate","97.8%","+0.3%",<Target key="t"/>],["Active Pickers","6","0",<Users key="u"/>],["Exceptions","8","-15%",<AlertTriangle key="a"/>],["Avg Travel","1.8 km","-8%",<Route key="r"/>],["Path Efficiency","91%","+3%",<Waypoints key="w"/>],["Cost per Pick","\u20b94.2","-6%",<IndianRupee key="r"/>]].map(([label,val,tr,icon], i) => (
          <Card key={i} className="glass-subtle wsp-kpi"><CardContent className="p-3"><div className="flex items-center gap-2.5">{icon}<div><div className="text-[10px] text-muted-foreground">{String(label)}</div><div className="text-lg font-black tabular-nums">{String(val)}</div><div className={"text-[10px] font-semibold " + (String(tr).startsWith("-")||String(tr).startsWith("0") ? "text-emerald-600" : "text-emerald-600")}>{String(tr)}</div></div></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle wsp-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Hourly Pick Volume</CardTitle></CardHeader><CardContent className="p-3"><AreaChart data={charts.hourly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="hour" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Area type="monotone" dataKey="picks" stroke={TH.emerald} fill={TH.emerald} fillOpacity={0.3}/></AreaChart></CardContent></Card>
        <Card className="glass-subtle wsp-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Pick Method Distribution</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.methodPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name}: {name:string}) => <text x={0} y={0} fill="currentColor" fontSize={9} textAnchor="middle">{name}</text>}>{charts.methodPie.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
        <Card className="glass-subtle wsp-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Zone Performance</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.zoneBar}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="picks" fill={TH.emerald} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle wsp-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Path Algorithm Efficiency (%)</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.algoBar} layout="vertical"><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis type="number" domain={[0,100]} tick={{fontSize:10}}/><YAxis dataKey="name" type="category" width={65} tick={{fontSize:9}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="efficiency" radius={[0,4,4,0]}>{charts.algoBar.map((_,i) => <Cell key={i} fill={charts.algoBar[i].efficiency > 90 ? TH.emerald : charts.algoBar[i].efficiency > 80 ? TH.blue : charts.algoBar[i].efficiency > 70 ? TH.amber : TH.rose}/>)}</Bar></BarChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search pick tasks..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-emerald-50 dark:bg-emerald-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="inline h-3 w-3 ml-0.5 opacity-50"/></th>
          <th className="p-2 text-left font-semibold">Method</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">Zone</th>
          <th className="p-2 text-left font-semibold">Priority</th>
          <th className="p-2 text-left font-semibold">Picker</th>
          <th className="p-2 text-left font-semibold">SKU</th>
          <th className="p-2 text-left font-semibold">Qty</th>
          <th className="p-2 text-left font-semibold">UPH</th>
          <th className="p-2 text-left font-semibold">Accuracy</th>
          <th className="p-2 text-left font-semibold">Travel</th>
          <th className="p-2 text-left font-semibold">Effort</th>
          <th className="p-2 text-left font-semibold">Algo</th>
          <th className="p-2"></th>
        </tr></thead><tbody className="divide-y">
          {filteredTasks.map(row => (
            <tr key={row.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors">
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><PickMethodBadge m={row.method}/></td>
              <td className="p-2"><PickStatusBadge s={row.status}/></td>
              <td className="p-2"><ZoneBadge z={row.zone}/></td>
              <td className="p-2"><PriorityBadge p={row.priority}/></td>
              <td className="p-2"><PickerBadge name={row.picker} score={row.pickerScore}/></td>
              <td className="p-2"><div><SkuCatBadge c={row.skuCat}/><div className="font-mono text-[9px] text-muted-foreground mt-0.5">{row.sku}</div></div></td>
              <td className="p-2"><PickRateBar picks={row.qty} target={row.targetQty}/></td>
              <td className="p-2"><UPHGauge uph={row.picksPerHr}/></td>
              <td className="p-2"><AccuracyGauge value={row.accuracy}/></td>
              <td className="p-2"><TravelDistTile meters={row.travelDist}/></td>
              <td className="p-2"><EffortScore score={row.effortScore}/></td>
              <td className="p-2"><AlgoBadge a={row.algo}/></td>
              <td className="p-2"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetail(row)}><Eye className="h-3 w-3"/></Button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredTasks.length} tasks</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {pickers.sort((a,b) => b.score - a.score).map((p, i) => (
          <Card key={p.name} className="glass-subtle wsp-picker-card hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white " + (i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600" : i === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500" : i === 2 ? "bg-gradient-to-br from-amber-600 to-amber-800" : "bg-gradient-to-br from-blue-400 to-blue-600")}>#{i+1}</div><div><div className="text-sm font-bold">{p.name}</div><div className="text-[10px] text-muted-foreground">{p.shift} Shift</div></div></div>
                <EffortScore score={p.score}/>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-2 text-center"><UPHGauge uph={p.uph}/></div>
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 text-center"><AccuracyGauge value={p.accuracy}/></div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-2 text-center"><SpeedTile value={p.totalPicks} unit="picks"/></div>
                <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-2 text-center"><TravelDistTile meters={p.avgDist}/></div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t"><StarRating value={p.rating}/><span className="text-[10px] text-muted-foreground">{p.exceptions} exceptions</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tab3 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search exceptions..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-red-50 dark:bg-red-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold">ID</th>
          <th className="p-2 text-left font-semibold">Task</th>
          <th className="p-2 text-left font-semibold">Error Type</th>
          <th className="p-2 text-left font-semibold">Severity</th>
          <th className="p-2 text-left font-semibold">Zone</th>
          <th className="p-2 text-left font-semibold">Picker</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">Root Cause</th>
          <th className="p-2 text-left font-semibold">Action</th>
          <th className="p-2 text-left font-semibold">Cost</th>
        </tr></thead><tbody className="divide-y">
          {filteredEx.map(row => (
            <tr key={row.id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2 font-mono">{row.taskId}</td>
              <td className="p-2"><ErrTypeBadge t={row.type}/></td>
              <td className="p-2"><PriorityBadge p={row.severity}/></td>
              <td className="p-2"><ZoneBadge z={row.zone}/></td>
              <td className="p-2 text-muted-foreground">{row.picker}</td>
              <td className="p-2"><span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (row.resolved ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700 animate-pulse")}>{row.resolved ? "\u2705 Resolved" : "\U0001f534 Open"}</span></td>
              <td className="p-2 text-muted-foreground">{row.rootCause}</td>
              <td className="p-2 text-muted-foreground">{row.action}</td>
              <td className="p-2 numeric-cell tabular-nums">\u20b9{row.costImpact}</td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredEx.length} exceptions</div>
    </div>
  )

  const tab4 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle wsp-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Monthly Pick Volume & UPH</CardTitle></CardHeader><CardContent className="p-3"><LineChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Line type="monotone" dataKey="picks" stroke={TH.emerald} strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="uph" stroke={TH.blue} strokeWidth={2} dot={{r:3}}/></LineChart></CardContent></Card>
        <Card className="glass-subtle wsp-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Hourly Error Rate</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.hourly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="hour" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="errors" fill={TH.rose} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle wsp-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Zone Accuracy Comparison (%)</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.zoneBar}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis domain={[90,100]} tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="accuracy" fill={TH.blue} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle wsp-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Monthly Accuracy Trend (%)</CardTitle></CardHeader><CardContent className="p-3"><LineChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:9}}/><YAxis domain={[93,100]} tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Line type="monotone" dataKey="accuracy" stroke={TH.emerald} strokeWidth={2} dot={{r:4}}/></LineChart></CardContent></Card>
      </div>
    </div>
  )

  const tab5 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {ZONES.map((z, i) => {
          const zoneTasks = pickTasks.filter(t => t.zone === z)
          const avgUPH = Math.round(zoneTasks.reduce((s,t) => s+t.picksPerHr, 0) / (zoneTasks.length||1))
          const avgAcc = Math.round(zoneTasks.reduce((s,t) => s+t.accuracy, 0) / (zoneTasks.length||1))
          const avgEffort = Math.round(zoneTasks.reduce((s,t) => s+t.effortScore, 0) / (zoneTasks.length||1))
          const exCount = exceptions.filter(e => e.zone === z).length
          return (
            <Card key={z} className="glass-subtle wsp-zone-card hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3"><ZoneBadge z={z}/><EffortScore score={avgEffort}/></div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-2"><UPHGauge uph={avgUPH}/></div>
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2"><AccuracyGauge value={avgAcc}/></div>
                  <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-2"><SpeedTile value={zoneTasks.length} unit="tasks"/></div>
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-2"><div className="text-lg font-black text-red-600">{exCount}</div><div className="text-[9px] text-muted-foreground">Exceptions</div></div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const tabs = [
    {key:"dashboard",label:"Dashboard",icon:<Sparkles className="h-3.5 w-3.5"/>,content:tab0},
    {key:"tasks",label:"Pick Tasks",icon:<ListOrdered className="h-3.5 w-3.5"/>,content:tab1},
    {key:"pickers",label:"Pickers",icon:<Users className="h-3.5 w-3.5"/>,content:tab2},
    {key:"exceptions",label:"Exceptions",icon:<XCircle className="h-3.5 w-3.5"/>,content:tab3},
    {key:"analytics",label:"Analytics",icon:<Brain className="h-3.5 w-3.5"/>,content:tab4},
    {key:"zones",label:"Zones",icon:<Warehouse className="h-3.5 w-3.5"/>,content:tab5},
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Warehouse Smart Picking" description="AI-powered pick optimization with real-time picker tracking, exception management, and path efficiency analytics"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><Sparkles className="h-3 w-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">AI Path Optimizer Active</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">6 Pickers Online</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"><span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">8 Zones Active</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">8 Open Exceptions</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Task Detail</SheetTitle></SheetHeader>
          {detail && (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-4"><div className="text-lg font-bold">Record Details</div><div className="text-xs text-muted-foreground mt-1">Full information for selected item</div></div>
              {Object.entries(detail).map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/50"><span className="text-xs font-medium text-muted-foreground">{k}</span><span className="text-xs font-semibold tabular-nums">{String(v)}</span></div>)}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}