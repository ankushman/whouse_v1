"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BarChart3, MapPin, Package, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star, Radio, Gauge, ThermometerSun, Plane, TrainFront, Ship, Truck, Globe, Satellite, Radar, Target, Crosshair, Compass, Play, Pause, Square, CircleDot, MonitorSmartphone, ArrowRight, ArrowLeftRight, RefreshCw, Filter, Download, ChevronRight
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const WH_NAMES = ["Mumbai Hub","Delhi NCR","Bangalore South","Chennai Port","Hyderabad East","Kolkata DC","Pune West","Ahmedabad North"] as const
const OPS_TYPES = ["Receiving","Putaway","Picking","Packing","Shipping","Returns","QC Check","Kitting"] as const
const OPS_EMOJI: Record<string,string> = {Receiving:"📥",Putaway:"📂",Picking:"📦",Packing:"🏷️",Shipping:"🚛",Returns:"🔄","QC Check":"✅",Kitting:"🔧"}
const OPS_STS = ["Running","Paused","Delayed","Completed","Scheduled","Cancelled"] as const
const ALERT_CATS = ["SLA Breach","Capacity Alert","Equipment Failure","Staffing Issue","Safety Incident","Quality Hold","System Error","Weather Disruption"] as const
const ALERT_SEVS = ["P1 Critical","P2 High","P3 Medium","P4 Low"] as const
const TRANS_MODES = ["Road","Rail","Air","Sea","Multimodal"] as const
const TRANS_STS = ["In Transit","At Hub","Delayed","Delivered","Customs Hold","Loading","Unloading"] as const
const CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad","Jaipur","Lucknow","Coimbatore","Indore"] as const
const CARRIERS = ["BlueDart","Delhivery","DTDC","Ecom Express","XpressBees","Shadowfax","Rivigo","Spoton"] as const
const SHIP_TYPES = ["FCL","LCL","FTL","LTL","Parcel","Express","Bulk","Cold Chain"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {indigo:"#4f46e5",blue:"#3b82f6",emerald:"#059669",amber:"#d97706",rose:"#e11d48",cyan:"#0891b2",violet:"#7c3aed",orange:"#f97316"}
const PC = [TH.indigo,TH.blue,TH.emerald,TH.amber,TH.rose,TH.cyan,TH.violet,TH.orange]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.abs(s) % arr.length] }
function rf(d: number): string { return "\u20b9" + (d * 1000).toLocaleString("en-IN") }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 18 Visual Components */
function OpsTypeBadge({ t }: { t: string }) {
  const cl: Record<string,string> = {Receiving:"bg-indigo-100 text-indigo-700",Putaway:"bg-blue-100 text-blue-700",Picking:"bg-emerald-100 text-emerald-700",Packing:"bg-amber-100 text-amber-700",Shipping:"bg-rose-100 text-rose-700",Returns:"bg-cyan-100 text-cyan-700","QC Check":"bg-violet-100 text-violet-700",Kitting:"bg-orange-100 text-orange-700"}
  return <span className={"lct-ot-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[t]||"bg-gray-100")}>{OPS_EMOJI[t]} {t}</span>
}
function OpsStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Running:"bg-emerald-100 text-emerald-700",Paused:"bg-amber-100 text-amber-700",Delayed:"bg-red-100 text-red-700",Completed:"bg-slate-100 text-slate-600",Scheduled:"bg-blue-100 text-blue-700",Cancelled:"bg-gray-100 text-gray-500"}
  const pulse = s==="Running"||s==="Delayed" ? " animate-pulse" : ""
  return <span className={"lct-os-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cl[s]||"bg-gray-100") + pulse}>● {s}</span>
}
function AlertCatBadge({ c }: { c: string }) {
  return <span className="lct-ac-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">⚠ {c}</span>
}
function AlertSevBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {"P1 Critical":"bg-red-100 text-red-700 shadow-[0_0_8px_oklch(0.55_0.22_25/0.3)]","P2 High":"bg-orange-100 text-orange-700","P3 Medium":"bg-amber-100 text-amber-700","P4 Low":"bg-blue-100 text-blue-700"}
  const emoji: Record<string,string> = {"P1 Critical":"🔴","P2 High":"🟠","P3 Medium":"🟡","P4 Low":"🔵"}
  return <span className={"lct-as-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold " + (cl[s]||"bg-gray-100")}>{emoji[s]} {s}</span>
}
function TransModeBadge({ m }: { m: string }) {
  const emoji: Record<string,string> = {Road:"🚛",Rail:"🚂",Air:"✈️",Sea:"🚢",Multimodal:"🔗"}
  const cl: Record<string,string> = {Road:"bg-amber-100 text-amber-700",Rail:"bg-blue-100 text-blue-700",Air:"bg-violet-100 text-violet-700",Sea:"bg-cyan-100 text-cyan-700",Multimodal:"bg-emerald-100 text-emerald-700"}
  return <span className={"lct-tm-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[m]||"bg-gray-100")}>{emoji[m]} {m}</span>
}
function TransStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {"In Transit":"bg-blue-100 text-blue-700 animate-pulse","At Hub":"bg-indigo-100 text-indigo-700",Delayed:"bg-red-100 text-red-700",Delivered:"bg-emerald-100 text-emerald-700","Customs Hold":"bg-amber-100 text-amber-700",Loading:"bg-cyan-100 text-cyan-700",Unloading:"bg-violet-100 text-violet-700"}
  return <span className={"lct-ts-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cl[s]||"bg-gray-100")}>● {s}</span>
}
function ShipTypeBadge({ t }: { t: string }) {
  const cl: Record<string,string> = {FCL:"bg-blue-100 text-blue-700",LCL:"bg-indigo-100 text-indigo-700",FTL:"bg-amber-100 text-amber-700",LTL:"bg-orange-100 text-orange-700",Parcel:"bg-emerald-100 text-emerald-700",Express:"bg-rose-100 text-rose-700",Bulk:"bg-slate-100 text-slate-700","Cold Chain":"bg-cyan-100 text-cyan-700"}
  return <span className={"lct-st-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold " + (cl[t]||"bg-gray-100")}>{t}</span>
}
function CarrierBadge({ c }: { c: string }) {
  return <span className="lct-carrier inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300">🚚 {c}</span>
}
function CityBadge({ city }: { city: string }) {
  return <span className="lct-city inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">📍 {city}</span>
}
function WhBadge({ wh }: { wh: string }) {
  return <span className="lct-wh inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">🏭 {wh}</span>
}
function ThroughputBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  const c = pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : pct > 40 ? "bg-blue-500" : "bg-emerald-500"
  return <div className="lct-thr-bar flex items-center gap-2 w-full"><div className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c} style={{width: pct + "%"}}/></div><span className="text-[10px] font-bold tabular-nums min-w-[40px] text-right">{value}/{max}</span></div>
}
function SlaCountdown({ hours }: { hours: number }) {
  const c = hours > 8 ? "text-emerald-600 dark:text-emerald-400" : hours > 4 ? "text-amber-600 dark:text-amber-400" : hours > 2 ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400"
  return <span className={"lct-sla inline-flex items-center gap-1 text-xs font-bold tabular-nums " + c}><Timer className="h-3 w-3"/>{hours}h left</span>
}
function ValueTile({ value, label, trend }: { value: string; label: string; trend: number }) {
  return <div className="lct-val-tile text-right"><div className="text-sm font-bold tabular-nums">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div>{trend !== 0 && <div className={"text-[10px] font-semibold flex items-center justify-end gap-0.5 " + (trend > 0 ? "text-emerald-600" : "text-red-600")}>{trend > 0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}{Math.abs(trend)}%</div>}</div>
}
function HealthRing({ score }: { score: number }) {
  const c = score >= 90 ? "text-emerald-500" : score >= 75 ? "text-blue-500" : score >= 60 ? "text-amber-500" : "text-red-500"
  const label = score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 60 ? "Fair" : "Critical"
  return <div className="lct-health flex flex-col items-center"><div className={"text-3xl font-black tabular-nums " + c}>{score}</div><div className={"text-[10px] font-bold " + c}>{label}</div></div>
}
function PriorityDot({ p }: { p: string }) {
  const cl: Record<string,string> = {Urgent:"bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",High:"bg-orange-500",Medium:"bg-amber-400",Low:"bg-blue-400"}
  return <div className={"lct-priority w-2.5 h-2.5 rounded-full " + (cl[p]||"bg-gray-400")}/>
}
function StarRating({ value }: { value: number }) {
  return <span className="lct-stars inline-flex gap-0.5">{"★".repeat(value)}{"☆".repeat(5 - value)}</span>
}
function CostTile({ value }: { value: number }) {
  return <span className="lct-cost text-sm font-bold tabular-nums text-indigo-600 dark:text-indigo-400">{rf(value)}</span>
}
function ProgressRing({ pct }: { pct: number }) {
  const c = pct >= 90 ? "text-emerald-500" : pct >= 70 ? "text-blue-500" : pct >= 50 ? "text-amber-500" : "text-red-500"
  return <div className="lct-ring flex items-center gap-1.5"><div className={"text-xs font-bold tabular-nums " + c}>{pct}%</div><div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c.replace("text-","bg-")} style={{width: pct + "%"}}/></div></div>
}

/* Data */
function genOpsData() {
  return Array.from({length: 80}, (_, i) => ({
    id: "OPS-" + String(i+1001).padStart(4,"0"),
    warehouse: pick(WH_NAMES, i+1),
    type: pick(OPS_TYPES, i+2),
    status: pick(OPS_STS, i+3),
    throughput: ri(120, 950, i+4),
    target: ri(800, 1000, i+5),
    accuracy: ri(88, 100, i+6),
    slaHours: ri(1, 24, i+7),
    teamSize: ri(5, 45, i+8),
    shift: pick(["Morning","Afternoon","Night"], i+9),
    health: ri(55, 99, i+10),
    cost: ri(15, 120, i+11),
  }))
}

function genAlertData() {
  return Array.from({length: 65}, (_, i) => ({
    id: "ALT-" + String(i+2001).padStart(4,"0"),
    category: pick(ALERT_CATS, i+1),
    severity: pick(ALERT_SEVS, i+2),
    warehouse: pick(WH_NAMES, i+3),
    resolved: i % 3 === 0 ? false : i % 3 === 1 ? true : pick([true,false], i+4),
    createdAt: ri(1,48,i+7) + "h ago",
    assignee: pick(["Rahul S.","Priya M.","Amit K.","Sneha D.","Vikram P."], i+5),
    impact: pick(["High","Medium","Low"], i+6),
  }))
}

function genTransitData() {
  return Array.from({length: 70}, (_, i) => ({
    id: "TR-" + String(i+3001).padStart(4,"0"),
    origin: pick(CITIES, i+1),
    destination: pick(CITIES, (i+7) % CITIES.length),
    mode: pick(TRANS_MODES, i+2),
    status: pick(TRANS_STS, i+3),
    carrier: pick(CARRIERS, i+4),
    shipType: pick(SHIP_TYPES, i+5),
    eta: ri(1, 72, i+7) + "h",
    weight: ri(50, 5000, i+8) + " kg",
    value: ri(5, 500, i+6),
    progress: ri(5, 100, i+7),
    temp: ri(2, 35, i+8) + "°C",
  }))
}

function genChartData() {
  const monthly = MO.map((m, i) => ({ month: m, inbound: ri(2000,5000,i), outbound: ri(1800,4800,i+12), returns: ri(200,600,i+24), cost: ri(50,150,i+36) }))
  const hubPie = WH_NAMES.map((w, i) => ({ name: w.split(" ")[0], value: ri(500,3000,i) }))
  const modePie = TRANS_MODES.map((m, i) => ({ name: m, value: ri(100,800,i) }))
  const alertBar = ALERT_CATS.map((c, i) => ({ name: c.split(" ")[0], p1: ri(2,15,i), p2: ri(5,25,i+8), p3: ri(10,40,i+16), p4: ri(15,60,i+24) }))
  const carrierBar = CARRIERS.map((c, i) => ({ name: c, onTime: ri(75,98,i), avgCost: ri(20,80,i+8), volume: ri(500,3000,i+16) }))
  const cityLine = CITIES.slice(0,8).map((c, i) => ({ city: c, throughput: ri(2000,8000,i), accuracy: ri(90,99,i+8), cost: ri(30,120,i+16) }))
  return { monthly, hubPie, modePie, alertBar, carrierBar, cityLine }
}

export default function LogisticsControlTowerView() {
  const [tab, setTab] = useState("overview")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc")
  const [detail, setDetail] = useState<Record<string, unknown>|null>(null)
  const [sheetTab, setSheetTab] = useState("ops")

  const opsData = useMemo(() => genOpsData(), [])
  const alertData = useMemo(() => genAlertData(), [])
  const transitData = useMemo(() => genTransitData(), [])
  const charts = useMemo(() => genChartData(), [])

  const filteredOps = useMemo(() => sortedData(filterData(opsData, search), sortField, sortDir), [opsData, search, sortField, sortDir])
  const filteredAlerts = useMemo(() => sortedData(filterData(alertData, search), sortField, sortDir), [alertData, search, sortField, sortDir])
  const filteredTransit = useMemo(() => sortedData(filterData(transitData, search), sortField, sortDir), [transitData, search, sortField, sortDir])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }

  const tab0 = (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Total Shipments:12,847','Active Hubs:8/8','Avg Throughput:3,241/hr','On-time Rate:94.2%','Open Alerts:23','Cost Savings:18.5%','Avg Accuracy:97.3%','Network Health:91'].map((item, i) => {
          const [label, val] = item.split(":")
          const icons = [<Package key="p"/>,<Globe key="g"/>,<Activity key="a"/>,<Target key="t"/>,<AlertTriangle key="at"/>,<IndianRupee key="r"/>,<ShieldCheck key="s"/>,<HealthRing key="h" score={91}/>]
          return (
            <Card key={i} className="glass-subtle lct-kpi-card">
              <CardContent className="p-3"><div className="flex items-center gap-2.5">{icons[i]}<div><div className="text-[10px] text-muted-foreground">{label}</div><div className="text-lg font-black tabular-nums">{val}</div></div></div></CardContent>
            </Card>
          )
        })}
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle lct-chart-card"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Monthly Shipment Volume</CardTitle></CardHeader><CardContent className="p-3"><AreaChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Area type="monotone" dataKey="inbound" stackId="1" stroke={TH.blue} fill={TH.blue} fillOpacity={0.4}/><Area type="monotone" dataKey="outbound" stackId="1" stroke={TH.emerald} fill={TH.emerald} fillOpacity={0.4}/><Area type="monotone" dataKey="returns" stackId="1" stroke={TH.rose} fill={TH.rose} fillOpacity={0.4}/></AreaChart></CardContent></Card>
        <Card className="glass-subtle lct-chart-card"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Hub Distribution</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.hubPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name}: {name:string}) => <text x={0} y={0} fill="currentColor" fontSize={10} textAnchor="middle">{name}</text>}>{charts.hubPie.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
        <Card className="glass-subtle lct-chart-card"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Alert Distribution by Severity</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.alertBar}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="p1" fill={TH.rose} stackId="a"/><Bar dataKey="p2" fill={TH.orange} stackId="a"/><Bar dataKey="p3" fill={TH.amber} stackId="a"/><Bar dataKey="p4" fill={TH.blue} stackId="a"/></BarChart></CardContent></Card>
        <Card className="glass-subtle lct-chart-card"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Transport Mode Split</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.modePie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, percent}: {name:string;percent:number}) => <text x={0} y={0} fill="currentColor" fontSize={10} textAnchor="middle">{name} {(percent*100).toFixed(0)}%</text>}>{charts.modePie.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
      </div>
      {/* Carrier Performance */}
      <Card className="glass-subtle lct-chart-card"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Carrier On-time Performance (%)</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.carrierBar} layout="vertical"><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis type="number" domain={[0,100]} tick={{fontSize:10}}/><YAxis dataKey="name" type="category" width={85} tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="onTime" radius={[0,4,4,0]}>{charts.carrierBar.map((_,i) => <Cell key={i} fill={charts.carrierBar[i].onTime > 95 ? TH.emerald : charts.carrierBar[i].onTime > 90 ? TH.blue : charts.carrierBar[i].onTime > 85 ? TH.amber : TH.rose}/>)}</Bar></BarChart></CardContent></Card>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search operations..." value={search} onChange={e => setSearch(e.target.value)}/></div><Button variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3 mr-1"/>Refresh</Button></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-indigo-50 dark:bg-indigo-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="inline h-3 w-3 ml-0.5 opacity-50"/></th>
          <th className="p-2 text-left font-semibold">Warehouse</th>
          <th className="p-2 text-left font-semibold">Type</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">Throughput</th>
          <th className="p-2 text-left font-semibold">Target</th>
          <th className="p-2 text-left font-semibold">Accuracy</th>
          <th className="p-2 text-left font-semibold">SLA</th>
          <th className="p-2 text-left font-semibold">Team</th>
          <th className="p-2 text-left font-semibold">Health</th>
          <th className="p-2 text-left font-semibold">Cost</th>
          <th className="p-2"></th>
        </tr></thead><tbody className="divide-y">
          {filteredOps.map((row, idx) => (
            <tr key={row.id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors">
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><WhBadge wh={row.warehouse}/></td>
              <td className="p-2"><OpsTypeBadge t={row.type}/></td>
              <td className="p-2"><OpsStatusBadge s={row.status}/></td>
              <td className="p-2"><ThroughputBar value={row.throughput} max={row.target}/></td>
              <td className="p-2 numeric-cell tabular-nums">{row.target}</td>
              <td className="p-2 numeric-cell tabular-nums">{row.accuracy}%</td>
              <td className="p-2"><SlaCountdown hours={row.slaHours}/></td>
              <td className="p-2 tabular-nums">{row.teamSize}</td>
              <td className="p-2"><HealthRing score={row.health}/></td>
              <td className="p-2"><CostTile value={row.cost}/></td>
              <td className="p-2"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetail(row)}><Eye className="h-3 w-3"/></Button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredOps.length} operations</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search alerts..." value={search} onChange={e => setSearch(e.target.value)}/></div><Button variant="outline" size="sm" className="h-8 text-xs"><Filter className="h-3 w-3 mr-1"/>Filter</Button></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-rose-50 dark:bg-rose-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold">ID</th>
          <th className="p-2 text-left font-semibold">Category</th>
          <th className="p-2 text-left font-semibold">Severity</th>
          <th className="p-2 text-left font-semibold">Warehouse</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">Created</th>
          <th className="p-2 text-left font-semibold">Assignee</th>
          <th className="p-2 text-left font-semibold">Impact</th>
          <th className="p-2"></th>
        </tr></thead><tbody className="divide-y">
          {filteredAlerts.map(row => (
            <tr key={row.id} className={"hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-colors " + (!row.resolved && row.severity === "P1 Critical" ? "bg-red-50/60 dark:bg-red-900/10" : "")}>
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><AlertCatBadge c={row.category}/></td>
              <td className="p-2"><AlertSevBadge s={row.severity}/></td>
              <td className="p-2"><WhBadge wh={row.warehouse}/></td>
              <td className="p-2"><span className={"lct-resolved inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (row.resolved ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700 animate-pulse")}>{row.resolved ? "✅ Resolved" : "🔴 Open"}</span></td>
              <td className="p-2 tabular-nums">{row.createdAt}</td>
              <td className="p-2 text-muted-foreground">{row.assignee}</td>
              <td className="p-2"><PriorityDot p={row.impact}/></td>
              <td className="p-2"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetail(row)}><Eye className="h-3 w-3"/></Button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredAlerts.length} alerts</div>
    </div>
  )

  const tab3 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search shipments..." value={search} onChange={e => setSearch(e.target.value)}/></div><Button variant="outline" size="sm" className="h-8 text-xs"><Download className="h-3 w-3 mr-1"/>Export</Button></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-blue-50 dark:bg-blue-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="inline h-3 w-3 ml-0.5 opacity-50"/></th>
          <th className="p-2 text-left font-semibold">Route</th>
          <th className="p-2 text-left font-semibold">Mode</th>
          <th className="p-2 text-left font-semibold">Type</th>
          <th className="p-2 text-left font-semibold">Carrier</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">ETA</th>
          <th className="p-2 text-left font-semibold">Progress</th>
          <th className="p-2 text-left font-semibold">Weight</th>
          <th className="p-2 text-left font-semibold">Temp</th>
          <th className="p-2 text-left font-semibold">Value</th>
          <th className="p-2"></th>
        </tr></thead><tbody className="divide-y">
          {filteredTransit.map(row => (
            <tr key={row.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><div className="flex items-center gap-1 text-[10px]"><CityBadge city={row.origin}/><ChevronRight className="h-3 w-3 text-muted-foreground"/><CityBadge city={row.destination}/></div></td>
              <td className="p-2"><TransModeBadge m={row.mode}/></td>
              <td className="p-2"><ShipTypeBadge t={row.shipType}/></td>
              <td className="p-2"><CarrierBadge c={row.carrier}/></td>
              <td className="p-2"><TransStatusBadge s={row.status}/></td>
              <td className="p-2 tabular-nums">{row.eta}</td>
              <td className="p-2"><ProgressRing pct={row.progress}/></td>
              <td className="p-2 tabular-nums">{row.weight}</td>
              <td className="p-2 tabular-nums">{row.temp}</td>
              <td className="p-2"><CostTile value={row.value}/></td>
              <td className="p-2"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetail(row)}><Eye className="h-3 w-3"/></Button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredTransit.length} shipments</div>
    </div>
  )

  const tab4 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle lct-chart-card"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Cost Trend (\u20b9 K)</CardTitle></CardHeader><CardContent className="p-3"><LineChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Line type="monotone" dataKey="cost" stroke={TH.indigo} strokeWidth={2} dot={{r:3}}/></LineChart></CardContent></Card>
        <Card className="glass-subtle lct-chart-card"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Hub Throughput Comparison</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.cityLine}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="city" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="throughput" fill={TH.indigo} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle lct-chart-card"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Accuracy by Hub (%)</CardTitle></CardHeader><CardContent className="p-3"><LineChart data={charts.cityLine}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="city" tick={{fontSize:9}}/><YAxis domain={[85,100]} tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Line type="monotone" dataKey="accuracy" stroke={TH.emerald} strokeWidth={2} dot={{r:4}}/></LineChart></CardContent></Card>
        <Card className="glass-subtle lct-chart-card"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Cost per Hub (\u20b9K)</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.cityLine} layout="vertical"><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis type="number" tick={{fontSize:10}}/><YAxis dataKey="city" type="category" width={75} tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="cost" fill={TH.amber} radius={[0,4,4,0]}/></BarChart></CardContent></Card>
      </div>
    </div>
  )

  const tab5 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {WH_NAMES.map((wh, i) => {
          const ops = opsData.filter(o => o.warehouse === wh)
          const running = ops.filter(o => o.status === "Running").length
          const delayed = ops.filter(o => o.status === "Delayed").length
          const alerts = alertData.filter(a => a.warehouse === wh)
          const critical = alerts.filter(a => a.severity === "P1 Critical" && !a.resolved).length
          const avgHealth = Math.round(ops.reduce((s,o) => s+o.health, 0) / (ops.length||1))
          const avgThroughput = Math.round(ops.reduce((s,o) => s+o.throughput, 0) / (ops.length||1))
          return (
            <Card key={wh} className="glass-subtle lct-hub-card hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3"><WhBadge wh={wh}/><HealthRing score={avgHealth}/></div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2"><div className="text-lg font-black text-blue-600">{running}</div><div className="text-[9px] text-muted-foreground">Running</div></div>
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-2"><div className="text-lg font-black text-red-600">{delayed}</div><div className="text-[9px] text-muted-foreground">Delayed</div></div>
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-2"><div className="text-lg font-black text-amber-600">{critical}</div><div className="text-[9px] text-muted-foreground">Critical</div></div>
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-2"><div className="text-lg font-black text-emerald-600">{avgThroughput}</div><div className="text-[9px] text-muted-foreground">Avg Thruput</div></div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const tabs = [
    {key:"overview",label:"Overview",icon:<Radar className="h-3.5 w-3.5"/>,content:tab0},
    {key:"operations",label:"Operations",icon:<Gauge className="h-3.5 w-3.5"/>,content:tab1},
    {key:"alerts",label:"Alert Center",icon:<AlertTriangle className="h-3.5 w-3.5"/>,content:tab2},
    {key:"transit",label:"Transit",icon:<Truck className="h-3.5 w-3.5"/>,content:tab3},
    {key:"analytics",label:"Analytics",icon:<BarChart3 className="h-3.5 w-3.5"/>,content:tab4},
    {key:"hubs",label:"Hub Matrix",icon:<Globe className="h-3.5 w-3.5"/>,content:tab5},
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Logistics Control Tower" description="Real-time cross-warehouse operations monitoring, alert management, and transit tracking"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">LIVE</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">8 Hubs Connected</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30"><span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">Network Score: 91</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">3 Active Incidents</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Detail View</SheetTitle></SheetHeader>
          {detail && (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4"><div className="text-lg font-bold">Record Details</div><div className="text-xs text-muted-foreground mt-1">Full information for selected item</div></div>
              {Object.entries(detail).map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/50"><span className="text-xs font-medium text-muted-foreground">{k}</span><span className="text-xs font-semibold tabular-nums">{String(v)}</span></div>)}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}