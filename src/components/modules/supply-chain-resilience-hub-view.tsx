"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BarChart3, MapPin, Package, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star, Radio, Gauge, ShieldAlert, HeartPulse, Globe, ArrowRight, ChevronRight, RefreshCw, Download, Filter, TriangleAlert, CircleDot, Waypoints, Route, Warehouse, Truck, Plane, Ship, TrainFront
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const RISK_TYPES = ["Supplier Failure","Transport Disruption","Demand Surge","Regulatory Change","Natural Disaster","Geopolitical Risk","Cyber Threat","Quality Issue","Labor Strike","Port Congestion"] as const
const RISK_EMOJI: Record<string,string> = {["Supplier Failure"]:"📥",["Transport Disruption"]:"🚛",["Demand Surge"]:"📈",["Regulatory Change"]:"📜",["Natural Disaster"]:"🌊",["Geopolitical Risk"]:"🗺",["Cyber Threat"]:"🖥",["Quality Issue"]:"❌",["Labor Strike"]:"⚖️",["Port Congestion"]:"🚢"}
const RISK_SEVS = ["Critical","High","Medium","Low"] as const
const BCP_STS = ["Active","Draft","Testing","Expired","Under Review"] as const
const ALT_ROUTES = ["Air Freight","Rail Diversion","Alternate Port","Nearshoring","Safety Stock","Dual Sourcing","Buffer Inventory","Express Lane"] as const
const CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad","Jaipur","Lucknow","Coimbatore","Indore"] as const
const REGIONS = ["North India","South India","West India","East India","Central India","NE India"] as const
const SUPPLIERS = ["Tata Steel","Reliance Industries","Mahindra Logistics","Blue Star","Godrej Group","L&T","Bajaj Electricals","Hindalco","JSW Steel","Grasim"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {red:"#dc2626",orange:"#ea580c",amber:"#d97706",blue:"#3b82f6",emerald:"#059669",violet:"#7c3aed",rose:"#e11d48",cyan:"#0891b2"}
const PC = [TH.red,TH.orange,TH.amber,TH.blue,TH.emerald,TH.violet,TH.rose,TH.cyan]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.abs(s) % arr.length] }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 17 Visual Components */
function RiskTypeBadge({ t }: { t: string }) {
  const cl: Record<string,string> = {["Supplier Failure"]:"bg-red-100 text-red-700",["Transport Disruption"]:"bg-orange-100 text-orange-700",["Demand Surge"]:"bg-blue-100 text-blue-700",["Regulatory Change"]:"bg-amber-100 text-amber-700",["Natural Disaster"]:"bg-violet-100 text-violet-700",["Geopolitical Risk"]:"bg-slate-100 text-slate-700",["Cyber Threat"]:"bg-cyan-100 text-cyan-700",["Quality Issue"]:"bg-rose-100 text-rose-700",["Labor Strike"]:"bg-indigo-100 text-indigo-700",["Port Congestion"]:"bg-emerald-100 text-emerald-700"}
  return <span className={"scr-rt-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[t]||"bg-gray-100")}>{RISK_EMOJI[t]} {t}</span>
}
function RiskSevBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Critical:"bg-red-100 text-red-700 shadow-[0_0_8px_oklch(0.55_0.22_25/0.3)]",High:"bg-orange-100 text-orange-700",Medium:"bg-amber-100 text-amber-700",Low:"bg-blue-100 text-blue-700"}
  const emoji: Record<string,string> = {Critical:"🔴",High:"🟠",Medium:"🟡",Low:"🔵"}
  const pulse = s==="Critical" ? " animate-pulse" : ""
  return <span className={"scr-rs-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold " + (cl[s]||"bg-gray-100") + pulse}>{emoji[s]} {s}</span>
}
function BcpStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Active:"bg-emerald-100 text-emerald-700",Draft:"bg-blue-100 text-blue-700",Testing:"bg-amber-100 text-amber-700",Expired:"bg-gray-100 text-gray-500","Under Review":"bg-violet-100 text-violet-700"}
  return <span className={"scr-bcp-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cl[s]||"bg-gray-100")}>● {s}</span>
}
function AltRouteBadge({ r }: { r: string }) {
  const cl: Record<string,string> = {["Air Freight"]:"bg-violet-100 text-violet-700",["Rail Diversion"]:"bg-blue-100 text-blue-700",["Alternate Port"]:"bg-cyan-100 text-cyan-700",Nearshoring:"bg-emerald-100 text-emerald-700",["Safety Stock"]:"bg-amber-100 text-amber-700",["Dual Sourcing"]:"bg-indigo-100 text-indigo-700",["Buffer Inventory"]:"bg-rose-100 text-rose-700",["Express Lane"]:"bg-orange-100 text-orange-700"}
  return <span className={"scr-alt-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[r]||"bg-gray-100")}>{r}</span>
}
function CityBadge({ city }: { city: string }) {
  return <span className="scr-city inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">📍 {city}</span>
}
function RegionBadge({ r }: { r: string }) {
  return <span className="scr-region inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{r}</span>
}
function SupplierBadge({ s }: { s: string }) {
  return <span className="scr-supp inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300">🏭 {s}</span>
}
function RiskScoreRing({ score }: { score: number }) {
  const c = score >= 80 ? "text-red-500" : score >= 60 ? "text-orange-500" : score >= 40 ? "text-amber-500" : "text-emerald-500"
  const label = score >= 80 ? "Critical" : score >= 60 ? "High" : score >= 40 ? "Medium" : "Low"
  return <div className="scr-score flex flex-col items-center"><div className={"text-3xl font-black tabular-nums " + c}>{score}</div><div className={"text-[10px] font-bold " + c}>{label}</div></div>
}
function ResilienceGauge({ value }: { value: number }) {
  const c = value >= 85 ? "text-emerald-600" : value >= 70 ? "text-blue-600" : value >= 55 ? "text-amber-600" : "text-red-600"
  return <div className="scr-resilience flex items-center gap-1"><span className={"text-sm font-black tabular-nums " + c}>{value}%</span><div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c.replace("text-","bg-")} style={{width: value + "%"}}/></div></div>
}
function ImpactBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  const c = pct > 80 ? "bg-red-500" : pct > 60 ? "bg-orange-500" : pct > 40 ? "bg-amber-500" : "bg-blue-500"
  return <div className="scr-impact flex items-center gap-2 w-full"><div className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c} style={{width: pct + "%"}}/></div><span className="text-[10px] font-bold tabular-nums min-w-[40px] text-right">{value}</span></div>
}
function MitigationBar({ pct }: { pct: number }) {
  const c = pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-blue-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"
  return <div className="scr-mit flex items-center gap-1.5"><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c} style={{width: pct + "%"}}/></div><span className="text-[10px] font-bold tabular-nums">{pct}%</span></div>
}
function ValueTile({ value, label, trend }: { value: string; label: string; trend: number }) {
  return <div className="scr-val text-right"><div className="text-sm font-bold tabular-nums">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div>{trend !== 0 && <div className={"text-[10px] font-semibold flex items-center justify-end gap-0.5 " + (trend > 0 ? "text-emerald-600" : "text-red-600")}>{trend > 0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}{Math.abs(trend)}%</div>}</div>
}
function SlaCountdown({ days }: { days: number }) {
  const c = days > 30 ? "text-emerald-600 dark:text-emerald-400" : days > 14 ? "text-amber-600 dark:text-amber-400" : days > 7 ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400"
  return <span className={"scr-sla inline-flex items-center gap-1 text-xs font-bold tabular-nums " + c}><Timer className="h-3 w-3"/>{days}d</span>
}
function CostTile({ value }: { value: number }) {
  return <span className="scr-cost text-sm font-bold tabular-nums text-orange-600 dark:text-orange-400">₹{(value * 1000).toLocaleString("en-IN")}</span>
}
function StarRating({ value }: { value: number }) {
  return <span className="scr-stars inline-flex gap-0.5">{"★".repeat(value)}{"☆".repeat(5-value)}</span>
}
function PriorityDot({ p }: { p: string }) {
  const cl: Record<string,string> = {Urgent:"bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",High:"bg-orange-500",Medium:"bg-amber-400",Low:"bg-blue-400"}
  return <div className={"scr-priority w-2.5 h-2.5 rounded-full " + (cl[p]||"bg-gray-400")}/>
}

function genRisks() {
  return Array.from({length: 75}, (_, i) => ({
    id: "RSK-" + String(i+7001).padStart(4,"0"),
    type: pick(RISK_TYPES, i+1),
    severity: pick(RISK_SEVS, i+2),
    riskScore: ri(10, 95, i+3),
    region: pick(REGIONS, i+4),
    city: pick(CITIES, i+5),
    supplier: pick(SUPPLIERS, i+6),
    impact: ri(1, 100, i+7),
    likelihood: ri(5, 95, i+8),
    mitigation: ri(20, 100, i+9),
    residual: ri(5, 60, i+10),
    status: pick(["Active","Mitigated","Monitoring","Escalated","Resolved"], i+11),
    owner: pick(["Rahul S.","Priya M.","Amit K.","Sneha D.","Vikram P.","Geeta T."], i+12),
    costExposure: ri(10, 500, i+13),
    slaDays: ri(3, 90, i+14),
  }))
}

function genBcp() {
  return Array.from({length: 40}, (_, i) => ({
    id: "BCP-" + String(i+3001).padStart(4,"0"),
    name: pick(["Primary Supplier BCP","Transport Fallback","Warehouse Contingency","IT DR Plan","Financial Continuity","Demand Surge Response","Regulatory Compliance","Quality Escalation"], i+1),
    status: pick(BCP_STS, i+2),
    riskType: pick(RISK_TYPES, i+3),
    altRoute: pick(ALT_ROUTES, i+4),
    region: pick(REGIONS, i+5),
    resilience: ri(50, 98, i+6),
    rto: ri(1, 72, i+7) + "h",
    rpo: ri(0, 24, i+8) + "h",
    lastTest: ri(1, 90, i+9) + "d ago",
    nextTest: ri(1, 180, i+10) + "d",
    effectiveness: ri(60, 99, i+11),
  }))
}

function genCharts() {
  const monthly = MO.map((m, i) => ({ month: m, riskEvents: ri(5,35,i), mitigated: ri(3,28,i+12), cost: ri(50,300,i+24), resilience: ri(65,98,i+36) }))
  const riskPie = RISK_TYPES.map((t, i) => ({ name: t.split(" ")[0], value: ri(5,40,i) }))
  const sevBar = RISK_SEVS.map((s, i) => ({ name: s, count: ri(10,50,i), mitigated: ri(5,45,i+4) }))
  const regionLine = REGIONS.map((r, i) => ({ region: r.split(" ")[0], score: ri(30,85,i), resilience: ri(55,95,i+6), cost: ri(20,200,i+12) }))
  const altPie = ALT_ROUTES.map((r, i) => ({ name: r.split(" ")[0], value: ri(20,100,i) }))
  return { monthly, riskPie, sevBar, regionLine, altPie }
}

export default function SupplyChainResilienceHubView() {
  const [tab, setTab] = useState("overview")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc")
  const [detail, setDetail] = useState<Record<string, unknown>|null>(null)

  const risks = useMemo(() => genRisks(), [])
  const bcpPlans = useMemo(() => genBcp(), [])
  const charts = useMemo(() => genCharts(), [])

  const filteredRisks = useMemo(() => sortedData(filterData(risks, search), sortField, sortDir), [risks, search, sortField, sortDir])
  const filteredBcp = useMemo(() => sortedData(filterData(bcpPlans, search), sortField, sortDir), [bcpPlans, search, sortField, sortDir])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Active Risks','23','-8%',<ShieldAlert key='sa'/>],['Avg Risk Score','62','+5%',<Gauge key='g'/>],['Resilience Index','84%','+3%',<ShieldCheck key='sc'/>],['BCP Plans Active','18','+2',<HeartPulse key='hp'/>],['Mitigated This Month','45','+12%',<CheckCircle key='cc'/>],['Cost Exposure','\u20b92.4M','-15%',<IndianRupee key='r'/>],['Avg RTO','4.2h','-20%',<Timer key='t'/>],['Next BCP Test','12d','--',<Clock key='ck'/>]].map(([label,val,tr,icon], i) => (
          <Card key={i} className="glass-subtle scr-kpi"><CardContent className="p-3"><div className="flex items-center gap-2.5">{icon}<div><div className="text-[10px] text-muted-foreground">{String(label)}</div><div className="text-lg font-black tabular-nums">{String(val)}</div><div className="text-[10px] font-semibold text-emerald-600">{String(tr)}</div></div></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle scr-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Monthly Risk Events</CardTitle></CardHeader><CardContent className="p-3"><AreaChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Area type="monotone" dataKey="riskEvents" stroke={TH.red} fill={TH.red} fillOpacity={0.3}/><Area type="monotone" dataKey="mitigated" stroke={TH.emerald} fill={TH.emerald} fillOpacity={0.3}/></AreaChart></CardContent></Card>
        <Card className="glass-subtle scr-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Risk Category Distribution</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.riskPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name}: {name:string}) => <text x={0} y={0} fill="currentColor" fontSize={9} textAnchor="middle">{name}</text>}>{charts.riskPie.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
        <Card className="glass-subtle scr-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Risk Severity Breakdown</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.sevBar}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="count" fill={TH.orange} radius={[4,4,0,0]}/><Bar dataKey="mitigated" fill={TH.emerald} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle scr-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Alternate Strategy Mix</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.altPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,percent}: {name:string;percent:number}) => <text x={0} y={0} fill="currentColor" fontSize={9} textAnchor="middle">{name} {(percent*100).toFixed(0)}%</text>}>{charts.altPie.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search risks..." value={search} onChange={e => setSearch(e.target.value)}/></div><Button variant="outline" size="sm" className="h-8 text-xs"><Filter className="h-3 w-3 mr-1"/>Filter</Button></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-red-50 dark:bg-red-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="inline h-3 w-3 ml-0.5 opacity-50"/></th>
          <th className="p-2 text-left font-semibold">Type</th>
          <th className="p-2 text-left font-semibold">Severity</th>
          <th className="p-2 text-left font-semibold">Score</th>
          <th className="p-2 text-left font-semibold">Region</th>
          <th className="p-2 text-left font-semibold">Supplier</th>
          <th className="p-2 text-left font-semibold">Impact</th>
          <th className="p-2 text-left font-semibold">Likelihood</th>
          <th className="p-2 text-left font-semibold">Mitigation</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">SLA</th>
          <th className="p-2 text-left font-semibold">Exposure</th>
          <th className="p-2"></th>
        </tr></thead><tbody className="divide-y">
          {filteredRisks.map(row => (
            <tr key={row.id} className={"hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors " + (row.severity === "Critical" && row.status === "Active" ? "bg-red-50/60 dark:bg-red-900/10" : "")}>
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><RiskTypeBadge t={row.type}/></td>
              <td className="p-2"><RiskSevBadge s={row.severity}/></td>
              <td className="p-2"><RiskScoreRing score={row.riskScore}/></td>
              <td className="p-2"><RegionBadge r={row.region}/></td>
              <td className="p-2"><SupplierBadge s={row.supplier}/></td>
              <td className="p-2"><ImpactBar value={row.impact} max={100}/></td>
              <td className="p-2 numeric-cell tabular-nums">{row.likelihood}%</td>
              <td className="p-2"><MitigationBar pct={row.mitigation}/></td>
              <td className="p-2"><span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (row.status==="Active"?"bg-red-100 text-red-700 animate-pulse":row.status==="Resolved"?"bg-emerald-100 text-emerald-700":row.status==="Mitigated"?"bg-blue-100 text-blue-700":"bg-amber-100 text-amber-700")}>● {row.status}</span></td>
              <td className="p-2"><SlaCountdown days={row.slaDays}/></td>
              <td className="p-2"><CostTile value={row.costExposure}/></td>
              <td className="p-2"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetail(row)}><Eye className="h-3 w-3"/></Button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredRisks.length} risks</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {bcpPlans.map(plan => (
          <Card key={plan.id} className="glass-subtle scr-bcp-card hover:border-orange-300 dark:hover:border-orange-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2"><span className="font-mono text-[10px] text-muted-foreground">{plan.id}</span><BcpStatusBadge s={plan.status}/></div>
              <div className="text-xs font-bold mb-2">{plan.name}</div>
              <div className="flex items-center gap-2 mb-2"><RiskTypeBadge t={plan.riskType}/><AltRouteBadge r={plan.altRoute}/></div>
              <div className="grid grid-cols-2 gap-1.5 text-center">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-1.5"><div className="text-xs font-black text-blue-600">{plan.rto}</div><div className="text-[9px] text-muted-foreground">RTO</div></div>
                <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-1.5"><div className="text-xs font-black text-violet-600">{plan.rpo}</div><div className="text-[9px] text-muted-foreground">RPO</div></div>
              </div>
              <div className="mt-2"><ResilienceGauge value={plan.resilience}/><div className="flex items-center justify-between mt-1"><span className="text-[10px] text-muted-foreground">Last test: {plan.lastTest}</span><span className="text-[10px] text-muted-foreground">Eff: {plan.effectiveness}%</span></div></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tab3 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle scr-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Monthly Cost Exposure (\u20b9K)</CardTitle></CardHeader><CardContent className="p-3"><LineChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Line type="monotone" dataKey="cost" stroke={TH.orange} strokeWidth={2} dot={{r:3}}/></LineChart></CardContent></Card>
        <Card className="glass-subtle scr-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Resilience Trend (%)</CardTitle></CardHeader><CardContent className="p-3"><LineChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis domain={[60,100]} tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Line type="monotone" dataKey="resilience" stroke={TH.emerald} strokeWidth={2} dot={{r:4}}/></LineChart></CardContent></Card>
        <Card className="glass-subtle scr-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Risk Score by Region</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.regionLine}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="region" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="score" fill={TH.red} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle scr-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Resilience by Region (%)</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.regionLine}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="region" tick={{fontSize:9}}/><YAxis domain={[40,100]} tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="resilience" fill={TH.emerald} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
      </div>
    </div>
  )

  const tab4 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {REGIONS.map((region, i) => {
          const regionRisks = risks.filter(r => r.region === region)
          const critical = regionRisks.filter(r => r.severity === "Critical").length
          const high = regionRisks.filter(r => r.severity === "High").length
          const mitigated = regionRisks.filter(r => r.status === "Mitigated" || r.status === "Resolved").length
          const avgScore = Math.round(regionRisks.reduce((s,r) => s+r.riskScore, 0) / (regionRisks.length||1))
          const avgResilience = Math.round(regionRisks.reduce((s,r) => s+r.mitigation, 0) / (regionRisks.length||1))
          return (
            <Card key={region} className="glass-subtle scr-region-card hover:border-orange-300 dark:hover:border-orange-700 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3"><RegionBadge r={region}/><RiskScoreRing score={avgScore}/></div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-2"><div className="text-lg font-black text-red-600">{critical}</div><div className="text-[9px] text-muted-foreground">Critical</div></div>
                  <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-2"><div className="text-lg font-black text-orange-600">{high}</div><div className="text-[9px] text-muted-foreground">High</div></div>
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-2"><div className="text-lg font-black text-emerald-600">{mitigated}</div><div className="text-[9px] text-muted-foreground">Mitigated</div></div>
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2"><ResilienceGauge value={avgResilience}/></div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const tabs = [
    {key:"overview",label:"Overview",icon:<ShieldAlert className="h-3.5 w-3.5"/>,content:tab0},
    {key:"risks",label:"Risk Register",icon:<TriangleAlert className="h-3.5 w-3.5"/>,content:tab1},
    {key:"bcp",label:"BCP Plans",icon:<HeartPulse className="h-3.5 w-3.5"/>,content:tab2},
    {key:"analytics",label:"Analytics",icon:<BarChart3 className="h-3.5 w-3.5"/>,content:tab3},
    {key:"regions",label:"Regions",icon:<Globe className="h-3.5 w-3.5"/>,content:tab4},
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Supply Chain Resilience Hub" description="Risk intelligence, business continuity planning, disruption monitoring, and resilience analytics across the supply chain network"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30"><ShieldAlert className="h-3 w-3 text-red-600"/><span className="text-[10px] font-semibold text-red-700 dark:text-red-300">3 Critical Risks</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">18 Active BCPs</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">Network Resilience: 84%</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">Next Audit: 12d</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-red-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Risk Detail</SheetTitle></SheetHeader>
          {detail && <div className="mt-4 space-y-3"><div className="rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4"><div className="text-lg font-bold">Risk Analysis</div><div className="text-xs text-muted-foreground mt-1">Full risk assessment details</div></div>{Object.entries(detail).map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/50"><span className="text-xs font-medium text-muted-foreground">{k}</span><span className="text-xs font-semibold tabular-nums">{String(v)}</span></div>)}</div>}
        </SheetContent>
      </Sheet>
    </div>
  )
}