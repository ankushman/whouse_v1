"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BarChart3, MapPin, Package, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star, Radio, Gauge, Download, Filter, FileText, Handshake, Trophy, Medal, Target, Receipt, ClipboardCheck, ArrowRight, ChevronRight, RefreshCw, Globe, Truck, Calculator, BadgeDollarSign, Scale
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PROCUREMENT_TYPES = ["Spot Rate","Contract Rate","Bid Award","Rate Card","Spot Quote","Volume Commit","LTL Pool","FCL Contract"] as const
const PROC_EMOJI: Record<string,string> = {["Spot Rate"]:"💰",["Contract Rate"]:"📋",["Bid Award"]:"🏆",["Rate Card"]:"💳",["Spot Quote"]:"📢",["Volume Commit"]:"📊",["LTL Pool"]:"🚚",["FCL Contract"]:"🚢"}
const BID_STS = ["Open","Under Review","Awarded","Rejected","Expired","Negotiating"] as const
const LANE_TYPES = ["Domestic","Export","Import","Cross-dock","Last Mile","Long Haul","Regional","Local"] as const
const CARRIERS = ["BlueDart","Delhivery","DTDC","Ecom Express","XpressBees","Shadowfax","Rivigo","Spoton","Gati","VRL","TCI","SafeExpress"] as const
const CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad","Jaipur","Lucknow","Coimbatore","Indore"] as const
const EVAL_CRITERIA = ["Price","Transit Time","Service Quality","Capacity","Reliability","Coverage","Technology","Sustainability"] as const
const CONTRACT_STS = ["Active","Expiring Soon","Expired","Under Negotiation","Renewed","Terminated"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {blue:"#3b82f6",emerald:"#059669",amber:"#d97706",violet:"#7c3aed",rose:"#e11d48",cyan:"#0891b2",indigo:"#4f46e5",orange:"#f97316"}
const PC = [TH.blue,TH.emerald,TH.amber,TH.violet,TH.rose,TH.cyan,TH.indigo,TH.orange]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.abs(s) % arr.length] }
function rf(d: number): string { return "\u20b9" + (d * 1000).toLocaleString("en-IN") }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 17 Visual Components */
function ProcTypeBadge({ t }: { t: string }) {
  const cl: Record<string,string> = {["Spot Rate"]:"bg-amber-100 text-amber-700",["Contract Rate"]:"bg-blue-100 text-blue-700",["Bid Award"]:"bg-emerald-100 text-emerald-700",["Rate Card"]:"bg-violet-100 text-violet-700",["Spot Quote"]:"bg-rose-100 text-rose-700",["Volume Commit"]:"bg-cyan-100 text-cyan-700",["LTL Pool"]:"bg-indigo-100 text-indigo-700",["FCL Contract"]:"bg-orange-100 text-orange-700"}
  return <span className={"lpc-type inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[t]||"bg-gray-100")}>{PROC_EMOJI[t]} {t}</span>
}
function BidStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Open:"bg-emerald-100 text-emerald-700 animate-pulse","Under Review":"bg-amber-100 text-amber-700",Awarded:"bg-blue-100 text-blue-700",Rejected:"bg-red-100 text-red-700",Expired:"bg-gray-100 text-gray-500",Negotiating:"bg-violet-100 text-violet-700"}
  return <span className={"lpc-bid inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cl[s]||"bg-gray-100")}>● {s}</span>
}
function LaneTypeBadge({ t }: { t: string }) {
  const cl: Record<string,string> = {Domestic:"bg-blue-100 text-blue-700",Export:"bg-violet-100 text-violet-700",Import:"bg-cyan-100 text-cyan-700","Cross-dock":"bg-emerald-100 text-emerald-700","Last Mile":"bg-rose-100 text-rose-700","Long Haul":"bg-amber-100 text-amber-700",Regional:"bg-indigo-100 text-indigo-700",Local:"bg-orange-100 text-orange-700"}
  return <span className={"lpc-lane inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[t]||"bg-gray-100")}>{t}</span>
}
function CarrierBadge({ c }: { c: string }) {
  return <span className="lpc-carrier inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300">🚚 {c}</span>
}
function CityBadge({ city }: { city: string }) {
  return <span className="lpc-city inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">📍 {city}</span>
}
function EvalBadge({ c }: { c: string }) {
  return <span className="lpc-eval inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">⭐ {c}</span>
}
function ContractStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Active:"bg-emerald-100 text-emerald-700","Expiring Soon":"bg-amber-100 text-amber-700 animate-pulse",Expired:"bg-gray-100 text-gray-500","Under Negotiation":"bg-violet-100 text-violet-700",Renewed:"bg-blue-100 text-blue-700",Terminated:"bg-red-100 text-red-700"}
  return <span className={"lpc-cs inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cl[s]||"bg-gray-100")}>● {s}</span>
}
function SavingsBar({ value, benchmark }: { value: number; benchmark: number }) {
  const diff = benchmark - value
  const pct = benchmark > 0 ? Math.round((diff / benchmark) * 100) : 0
  const c = pct >= 15 ? "bg-emerald-500" : pct >= 8 ? "bg-blue-500" : pct >= 0 ? "bg-amber-500" : "bg-red-500"
  return <div className="lpc-savings flex items-center gap-2"><div className="text-xs font-bold tabular-nums">{pct > 0 ? "+" : ""}{pct}%</div><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c} style={{width: Math.min(Math.abs(pct)*3, 100) + "%"}}/></div></div>
}
function ScoreGauge({ value, label }: { value: number; label: string }) {
  const c = value >= 90 ? "text-emerald-600" : value >= 75 ? "text-blue-600" : value >= 60 ? "text-amber-600" : "text-red-600"
  return <div className="lpc-score flex flex-col items-center"><div className={"text-2xl font-black tabular-nums " + c}>{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}
function RateTile({ base, negotiated }: { base: number; negotiated: number }) {
  const saved = base - negotiated
  return <div className="lpc-rate text-right"><div className="text-sm font-bold tabular-nums text-emerald-600">{rf(negotiated)}</div><div className="text-[10px] text-muted-foreground line-through">{rf(base)}</div>{saved > 0 && <div className="text-[10px] font-semibold text-emerald-600">Save {rf(saved)}</div>}</div>
}
function VolumeBar({ committed, capacity }: { committed: number; capacity: number }) {
  const pct = Math.round((committed / capacity) * 100)
  const c = pct > 90 ? "bg-red-500" : pct > 75 ? "bg-amber-500" : pct > 50 ? "bg-blue-500" : "bg-emerald-500"
  return <div className="lpc-vol flex items-center gap-2"><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c} style={{width: Math.min(pct,100) + "%"}}/></div><span className="text-[10px] font-bold tabular-nums">{pct}%</span></div>
}
function StarRating({ value }: { value: number }) {
  return <span className="lpc-stars inline-flex gap-0.5">{"★".repeat(value)}{"☆".repeat(5-value)}</span>
}
function ValueTile({ value, label, trend }: { value: string; label: string; trend: number }) {
  return <div className="lpc-val text-right"><div className="text-sm font-bold tabular-nums">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div>{trend !== 0 && <div className={"text-[10px] font-semibold flex items-center justify-end gap-0.5 " + (trend > 0 ? "text-emerald-600" : "text-red-600")}>{trend > 0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}{Math.abs(trend)}%</div>}</div>
}
function ValueTileNoTrend({ value, label }: { value: string; label: string }) {
  return <div className="lpc-val text-right"><div className="text-sm font-bold tabular-nums">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}
function PriorityDot({ p }: { p: string }) {
  const cl: Record<string,string> = {Urgent:"bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",High:"bg-orange-500",Medium:"bg-amber-400",Low:"bg-blue-400"}
  return <div className={"lpc-priority w-2.5 h-2.5 rounded-full " + (cl[p]||"bg-gray-400")}/>
}
function CostTile({ value }: { value: number }) {
  return <span className="lpc-cost text-sm font-bold tabular-nums text-violet-600 dark:text-violet-400">{rf(value)}</span>
}
function TtlBadge({ days }: { days: number }) {
  const c = days > 90 ? "text-emerald-600" : days > 30 ? "text-amber-600" : "text-red-600"
  return <span className={"lpc-ttl inline-flex items-center gap-1 text-xs font-bold tabular-nums " + c}><Clock className="h-3 w-3"/>{days}d</span>
}

function genBids() {
  return Array.from({length: 75}, (_, i) => ({
    id: "BID-" + String(i+8001).padStart(4,"0"),
    type: pick(PROCUREMENT_TYPES, i+1),
    status: pick(BID_STS, i+2),
    laneType: pick(LANE_TYPES, i+3),
    origin: pick(CITIES, i+4),
    destination: pick(CITIES, (i+7) % CITIES.length),
    carrier: pick(CARRIERS, i+5),
    baseRate: ri(5, 50, i+6),
    negotiatedRate: ri(3, 45, i+7),
    volume: ri(100, 5000, i+8),
    committed: ri(50, 4000, i+9),
    evalScore: ri(60, 98, i+10),
    transitDays: ri(1, 15, i+11),
    serviceScore: ri(70, 99, i+12),
    totalValue: ri(50, 800, i+13),
    ttl: ri(5, 180, i+14),
  }))
}

function genContracts() {
  return Array.from({length: 45}, (_, i) => ({
    id: "CTR-" + String(i+4001).padStart(4,"0"),
    carrier: pick(CARRIERS, i+1),
    status: pick(CONTRACT_STS, i+2),
    laneType: pick(LANE_TYPES, i+3),
    origin: pick(CITIES, i+4),
    destination: pick(CITIES, (i+6) % CITIES.length),
    annualValue: ri(200, 5000, i+5),
    savings: ri(5, 25, i+6),
    startMonth: pick(MO, i+7),
    endMonth: pick(MO, i+8),
    performance: ri(75, 99, i+9),
    penaltyIncidents: ri(0, 12, i+10),
    onTimeRate: ri(85, 99, i+11),
  }))
}

function genCharts() {
  const monthly = MO.map((m, i) => ({ month: m, spend: ri(2000,8000,i), savings: ri(200,1500,i+12), bids: ri(10,50,i+24), awarded: ri(5,35,i+36) }))
  const typePie = PROCUREMENT_TYPES.map((t, i) => ({ name: t.split(" ")[0], value: ri(20,100,i) }))
  const carrierBar = CARRIERS.slice(0,8).map((c, i) => ({ name: c, volume: ri(500,4000,i), savings: ri(5,20,i+8), onTime: ri(85,99,i+16) }))
  const laneBar = LANE_TYPES.map((l, i) => ({ name: l.split(" ")[0], avgRate: ri(5,40,i), volume: ri(300,3000,i+8) }))
  const evalRadar = EVAL_CRITERIA.map((c, i) => ({ name: c.split(" ")[0], score: ri(60,98,i) }))
  return { monthly, typePie, carrierBar, laneBar, evalRadar }
}

export default function LogisticsProcurementCommandView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc")
  const [detail, setDetail] = useState<Record<string, unknown>|null>(null)

  const bids = useMemo(() => genBids(), [])
  const contracts = useMemo(() => genContracts(), [])
  const charts = useMemo(() => genCharts(), [])

  const filteredBids = useMemo(() => sortedData(filterData(bids, search), sortField, sortDir), [bids, search, sortField, sortDir])
  const filteredContracts = useMemo(() => sortedData(filterData(contracts, search), sortField, sortDir), [contracts, search, sortField, sortDir])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Active Bids','34','+8',<FileText key='f'/>],['Total Savings','\u20b912.5M','+18%',<Trophy key='t'/>],['Avg Savings Rate','14.2%','+2.1%',<Target key='g'/>],['Active Contracts','28','+3',<ClipboardCheck key='c'/>],['Open Bids','12','-2',<Handshake key='h'/>],['Avg Eval Score','86','+4',<Medal key='m'/>],['On-time Rate','94.5%','+1.2%',<Clock key='ck'/>],['Total Procurement','\u20b984M','+12%',<IndianRupee key='r'/>]].map(([label,val,tr,icon], i) => (
          <Card key={i} className="glass-subtle lpc-kpi"><CardContent className="p-3"><div className="flex items-center gap-2.5">{icon}<div><div className="text-[10px] text-muted-foreground">{String(label)}</div><div className="text-lg font-black tabular-nums">{String(val)}</div><div className="text-[10px] font-semibold text-emerald-600">{String(tr)}</div></div></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle lpc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Monthly Spend vs Savings (\u20b9L)</CardTitle></CardHeader><CardContent className="p-3"><AreaChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Area type="monotone" dataKey="spend" stroke={TH.blue} fill={TH.blue} fillOpacity={0.3}/><Area type="monotone" dataKey="savings" stroke={TH.emerald} fill={TH.emerald} fillOpacity={0.3}/></AreaChart></CardContent></Card>
        <Card className="glass-subtle lpc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Procurement Type Mix</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.typePie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name}: {name:string}) => <text x={0} y={0} fill="currentColor" fontSize={9} textAnchor="middle">{name}</text>}>{charts.typePie.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
        <Card className="glass-subtle lpc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Carrier Volume & Savings</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.carrierBar}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="volume" fill={TH.blue} radius={[4,4,0,0]}/><Bar dataKey="savings" fill={TH.emerald} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle lpc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Lane Rate Comparison (\u20b9K)</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.laneBar}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="avgRate" fill={TH.violet} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search bids..." value={search} onChange={e => setSearch(e.target.value)}/></div><Button variant="outline" size="sm" className="h-8 text-xs"><Download className="h-3 w-3 mr-1"/>Export</Button></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-blue-50 dark:bg-blue-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="inline h-3 w-3 ml-0.5 opacity-50"/></th>
          <th className="p-2 text-left font-semibold">Type</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">Route</th>
          <th className="p-2 text-left font-semibold">Lane</th>
          <th className="p-2 text-left font-semibold">Carrier</th>
          <th className="p-2 text-left font-semibold">Rate</th>
          <th className="p-2 text-left font-semibold">Savings</th>
          <th className="p-2 text-left font-semibold">Volume</th>
          <th className="p-2 text-left font-semibold">Eval</th>
          <th className="p-2 text-left font-semibold">Service</th>
          <th className="p-2 text-left font-semibold">TTL</th>
          <th className="p-2 text-left font-semibold">Value</th>
          <th className="p-2"></th>
        </tr></thead><tbody className="divide-y">
          {filteredBids.map(row => (
            <tr key={row.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><ProcTypeBadge t={row.type}/></td>
              <td className="p-2"><BidStatusBadge s={row.status}/></td>
              <td className="p-2"><div className="flex items-center gap-1 text-[10px]"><CityBadge city={row.origin}/><ChevronRight className="h-3 w-3 text-muted-foreground"/><CityBadge city={row.destination}/></div></td>
              <td className="p-2"><LaneTypeBadge t={row.laneType}/></td>
              <td className="p-2"><CarrierBadge c={row.carrier}/></td>
              <td className="p-2"><RateTile base={row.baseRate} negotiated={row.negotiatedRate}/></td>
              <td className="p-2"><SavingsBar value={row.negotiatedRate} benchmark={row.baseRate}/></td>
              <td className="p-2"><VolumeBar committed={row.committed} capacity={row.volume}/></td>
              <td className="p-2"><ScoreGauge value={row.evalScore} label="Eval"/></td>
              <td className="p-2 numeric-cell tabular-nums">{row.serviceScore}%</td>
              <td className="p-2"><TtlBadge days={row.ttl}/></td>
              <td className="p-2"><CostTile value={row.totalValue}/></td>
              <td className="p-2"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetail(row)}><Eye className="h-3 w-3"/></Button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredBids.length} bids</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search contracts..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredContracts.map(c => (
          <Card key={c.id} className="glass-subtle lpc-contract hover:border-blue-300 dark:hover:border-blue-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2"><span className="font-mono text-[10px] text-muted-foreground">{c.id}</span><ContractStatusBadge s={c.status}/></div>
              <div className="flex items-center gap-2 mb-2"><CarrierBadge c={c.carrier}/><LaneTypeBadge t={c.laneType}/></div>
              <div className="flex items-center gap-1 mb-2 text-[10px]"><CityBadge city={c.origin}/><ChevronRight className="h-3 w-3 text-muted-foreground"/><CityBadge city={c.destination}/></div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-1.5"><div className="text-xs font-black text-blue-600">{c.onTimeRate}%</div><div className="text-[9px] text-muted-foreground">On-time</div></div>
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-1.5"><div className="text-xs font-black text-emerald-600">{c.savings}%</div><div className="text-[9px] text-muted-foreground">Savings</div></div>
                <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-1.5"><div className="text-xs font-black text-violet-600">{c.penaltyIncidents}</div><div className="text-[9px] text-muted-foreground">Penalties</div></div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t"><StarRating value={Math.round(c.performance / 20)}/><span className="text-[10px] text-muted-foreground">{c.startMonth} - {c.endMonth}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tab3 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle lpc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Bid Activity (Monthly)</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="bids" fill={TH.blue} radius={[4,4,0,0]}/><Bar dataKey="awarded" fill={TH.emerald} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle lpc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Carrier On-time Performance (%)</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.carrierBar} layout="vertical"><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis type="number" domain={[80,100]} tick={{fontSize:10}}/><YAxis dataKey="name" type="category" width={70} tick={{fontSize:9}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="onTime" radius={[0,4,4,0]}>{charts.carrierBar.map((_,i) => <Cell key={i} fill={charts.carrierBar[i].onTime > 95 ? TH.emerald : charts.carrierBar[i].onTime > 90 ? TH.blue : TH.amber}/>)}</Bar></BarChart></CardContent></Card>
        <Card className="glass-subtle lpc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Evaluation Criteria Scores</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.evalRadar}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis domain={[0,100]} tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="score" fill={TH.violet} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle lpc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Lane Volume Distribution</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.laneBar} cx="50%" cy="50%" outerRadius={80} dataKey="volume" label={({name}: {name:string}) => <text x={0} y={0} fill="currentColor" fontSize={9} textAnchor="middle">{name}</text>}>{charts.laneBar.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
      </div>
    </div>
  )

  const tabs = [
    {key:"dashboard",label:"Dashboard",icon:<Trophy className="h-3.5 w-3.5"/>,content:tab0},
    {key:"bids",label:"Bid Mgmt",icon:<FileText className="h-3.5 w-3.5"/>,content:tab1},
    {key:"contracts",label:"Contracts",icon:<ClipboardCheck className="h-3.5 w-3.5"/>,content:tab2},
    {key:"analytics",label:"Analytics",icon:<BarChart3 className="h-3.5 w-3.5"/>,content:tab3},
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Logistics Procurement Command" description="Freight procurement intelligence with carrier bidding, rate optimization, contract management, and spend analytics"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><Handshake className="h-3 w-3 text-blue-600"/><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">12 Open Bids</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">\u20b912.5M Saved YTD</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"><span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">28 Active Contracts</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">3 Expiring Soon</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Bid Detail</SheetTitle></SheetHeader>
          {detail && <div className="mt-4 space-y-3"><div className="rounded-lg bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 p-4"><div className="text-lg font-bold">Procurement Details</div><div className="text-xs text-muted-foreground mt-1">Full bid and rate analysis</div></div>{Object.entries(detail).map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/50"><span className="text-xs font-medium text-muted-foreground">{k}</span><span className="text-xs font-semibold tabular-nums">{String(v)}</span></div>)}</div>}
        </SheetContent>
      </Sheet>
    </div>
  )
}