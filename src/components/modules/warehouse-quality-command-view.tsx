"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BarChart3, MapPin, Package, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star, Radio, Gauge, Microscope, ClipboardList, ShieldAlert, ArrowRight, ChevronRight, RefreshCw, Download, Filter, Target, Award, BadgeCheck
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const INSP_TYPES = ["Incoming","In-process","Final","Line","Source","Audit","Pre-shipment","Random"] as const
const INSP_EMOJI: Record<string,string> = {Incoming:"📥","In-process":"⚙️","Final":"✅","Line":"📏",Source:"🏭",Audit:"🔍","Pre-shipment":"🚚",Random:"🎲"}
const DEFECT_TYPES = ["Dimensional","Surface Finish","Material Defect","Assembly Error","Missing Component","Label Error","Packaging Damage","Weight Mismatch","Color Mismatch","Functional Failure"] as const
const DEFECT_SEVS = ["Critical","Major","Minor","Cosmetic"] as const
const GRADES = ["A - Excellent","B - Good","C - Acceptable","D - Marginal","E - Reject"] as const
const QC_STS = ["Passed","Failed","Conditional","In Progress","Pending Review","Escalated"] as const
const CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad"] as const
const INSPECTORS = ["Dr. Anand K.","Sunita P.","Ravi M.","Meera D.","Arun S.","Prachi T."] as const
const PRODUCTS = ["Electronics","FMCG","Auto Parts","Pharma","Apparel","Home Decor"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {emerald:"#059669",blue:"#3b82f6",amber:"#d97706",red:"#dc2626",violet:"#7c3aed",cyan:"#0891b2",rose:"#e11d48",orange:"#ea580c"}
const PC = [TH.emerald,TH.blue,TH.amber,TH.red,TH.violet,TH.cyan,TH.rose,TH.orange]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.abs(s) % arr.length] }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 16 Visual Components */
function InspTypeBadge({ t }: { t: string }) {
  const cl: Record<string,string> = {Incoming:"bg-blue-100 text-blue-700","In-process":"bg-amber-100 text-amber-700",Final:"bg-emerald-100 text-emerald-700",Line:"bg-violet-100 text-violet-700",Source:"bg-cyan-100 text-cyan-700",Audit:"bg-rose-100 text-rose-700","Pre-shipment":"bg-indigo-100 text-indigo-700",Random:"bg-orange-100 text-orange-700"}
  return <span className={"wqc-it-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[t]||"bg-gray-100")}>{INSP_EMOJI[t]} {t}</span>
}
function DefectBadge({ t }: { t: string }) {
  return <span className="wqc-def-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">❌ {t}</span>
}
function DefectSevBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Critical:"bg-red-100 text-red-700 shadow-[0_0_8px_oklch(0.55_0.22_25/0.3)]",Major:"bg-orange-100 text-orange-700",Minor:"bg-amber-100 text-amber-700",Cosmetic:"bg-blue-100 text-blue-700"}
  const emoji: Record<string,string> = {Critical:"🔴",Major:"🟠",Minor:"🟡",Cosmetic:"🔵"}
  return <span className={"wqc-sev-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold " + (cl[s]||"bg-gray-100")}>{emoji[s]} {s}</span>
}
function GradeBadge({ g }: { g: string }) {
  const grade = g.split(" ")[0]
  const cl: Record<string,string> = {A:"bg-emerald-100 text-emerald-700",B:"bg-blue-100 text-blue-700",C:"bg-amber-100 text-amber-700",D:"bg-orange-100 text-orange-700",E:"bg-red-100 text-red-700"}
  return <span className={"wqc-grade inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black " + (cl[grade]||"bg-gray-100")}>{grade}</span>
}
function QcStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Passed:"bg-emerald-100 text-emerald-700",Failed:"bg-red-100 text-red-700",Conditional:"bg-amber-100 text-amber-700","In Progress":"bg-blue-100 text-blue-700 animate-pulse","Pending Review":"bg-violet-100 text-violet-700",Escalated:"bg-red-100 text-red-700 shadow-[0_0_8px_oklch(0.55_0.22_25/0.3)] animate-pulse"}
  return <span className={"wqc-status inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cl[s]||"bg-gray-100")}>● {s}</span>
}
function CityBadge({ city }: { city: string }) { return <span className="wqc-city inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">📍 {city}</span> }
function InspectorBadge({ name, score }: { name: string; score: number }) {
  const c = score >= 95 ? "text-emerald-600" : score >= 85 ? "text-blue-600" : "text-amber-600"
  return <span className={"wqc-insp inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold " + c}><Microscope className="h-3 w-3"/>{name} <span className="font-black tabular-nums">{score}%</span></span>
}
function ProductBadge({ p }: { p: string }) { return <span className="wqc-prod inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">📦 {p}</span> }
function AccuracyGauge({ value }: { value: number }) {
  const c = value >= 99 ? "text-emerald-600" : value >= 97 ? "text-blue-600" : value >= 95 ? "text-amber-600" : "text-red-600"
  return <div className="wqc-acc flex items-center gap-1"><span className={"text-sm font-black tabular-nums " + c}>{value}%</span><div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c.replace("text-","bg-")} style={{width:value+"%"}}/></div></div>
}
function DefectRateBar({ value }: { value: number }) {
  const c = value <= 0.5 ? "bg-emerald-500" : value <= 1.5 ? "bg-blue-500" : value <= 3 ? "bg-amber-500" : "bg-red-500"
  return <div className="wqc-dr flex items-center gap-2"><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c} style={{width: Math.min(value*10, 100)+"%"}}/></div><span className="text-[10px] font-bold tabular-nums">{value}%</span></div>
}
function SpcIndicator({ cpk }: { cpk: number }) {
  const c = cpk >= 1.67 ? "text-emerald-600" : cpk >= 1.33 ? "text-blue-600" : cpk >= 1 ? "text-amber-600" : "text-red-600"
  return <span className={"wqc-spc inline-flex items-center gap-1 text-xs font-bold tabular-nums " + c}>Cpk: {cpk}</span>
}
function ValueTile({ value, label, trend }: { value: string; label: string; trend: number }) {
  return <div className="wqc-val text-right"><div className="text-sm font-bold tabular-nums">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div>{trend !== 0 && <div className={"text-[10px] font-semibold flex items-center justify-end gap-0.5 " + (trend > 0 ? "text-emerald-600" : "text-red-600")}>{trend > 0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}{Math.abs(trend)}%</div>}</div>
}
function StarRating({ value }: { value: number }) { return <span className="wqc-stars inline-flex gap-0.5">{"★".repeat(value)}{"☆".repeat(5-value)}</span> }
function CostTile({ value }: { value: number }) { return <span className="wqc-cost text-sm font-bold tabular-nums text-red-600 dark:text-red-400">₹{(value * 1000).toLocaleString("en-IN")}</span> }
function PassRateRing({ pct }: { pct: number }) {
  const c = pct >= 98 ? "text-emerald-500" : pct >= 95 ? "text-blue-500" : pct >= 90 ? "text-amber-500" : "text-red-500"
  return <div className="wqc-pass flex flex-col items-center"><div className={"text-2xl font-black tabular-nums " + c}>{pct}%</div><div className="text-[9px] text-muted-foreground">Pass</div></div>
}

function genInspections() {
  return Array.from({length: 80}, (_, i) => ({
    id: "QC-" + String(i+9001).padStart(4,"0"),
    type: pick(INSP_TYPES, i+1),
    status: pick(QC_STS, i+2),
    grade: pick(GRADES, i+3),
    city: pick(CITIES, i+4),
    inspector: pick(INSPECTORS, i+5),
    inspScore: ri(65, 100, i+6),
    product: pick(PRODUCTS, i+7),
    totalItems: ri(50, 500, i+8),
    passed: ri(40, 490, i+9),
    failed: ri(0, 30, i+10),
    defectRate: ri(0, 8, i+11) / 10,
    cpk: (ri(80, 200, i+12) / 100).toFixed(2),
    duration: ri(5, 120, i+13) + " min",
    costOfQuality: ri(1, 25, i+14),
    sampleSize: ri(5, 50, i+15),
  }))
}

function genDefects() {
  return Array.from({length: 60}, (_, i) => ({
    id: "DEF-" + String(i+10001).padStart(4,"0"),
    type: pick(DEFECT_TYPES, i+1),
    severity: pick(DEFECT_SEVS, i+2),
    city: pick(CITIES, i+3),
    product: pick(PRODUCTS, i+4),
    inspector: pick(INSPECTORS, i+5),
    resolved: i % 3 !== 0,
    rootCause: pick(["Process Variation","Material Issue","Operator Error","Machine Calibration","Environmental","Design Flaw"], i+6),
    correctiveAction: pick(["Adjust Process","Replace Material","Retrain Operator","Recalibrate","Change Spec","Add Inspection"], i+7),
    costImpact: ri(0, 50, i+8),
    recurrence: ri(0, 5, i+9),
  }))
}

function genCharts() {
  const monthly = MO.map((m, i) => ({ month: m, inspected: ri(500,2000,i), passed: ri(450,1950,i+12), defectRate: ri(0.5,4,i+24)/10, cost: ri(10,80,i+36) }))
  const typePie = INSP_TYPES.map((t, i) => ({ name: t.split(" ")[0], value: ri(20,80,i) }))
  const defectBar = DEFECT_TYPES.map((d, i) => ({ name: d.split(" ")[0], critical: ri(2,20,i), major: ri(5,30,i+10), minor: ri(10,50,i+20), cosmetic: ri(5,25,i+30) }))
  const cityLine = CITIES.map((c, i) => ({ city: c, accuracy: ri(92,100,i), defectRate: ri(0.3,3,i+8)/10 }))
  return { monthly, typePie, defectBar, cityLine }
}

export default function WarehouseQualityCommandView() {
  const [tab, setTab] = useState("overview")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc")
  const [detail, setDetail] = useState<Record<string, unknown>|null>(null)

  const inspections = useMemo(() => genInspections(), [])
  const defects = useMemo(() => genDefects(), [])
  const charts = useMemo(() => genCharts(), [])

  const filteredInsp = useMemo(() => sortedData(filterData(inspections, search), sortField, sortDir), [inspections, search, sortField, sortDir])
  const filteredDef = useMemo(() => sortedData(filterData(defects, search), sortField, sortDir), [defects, search, sortField, sortDir])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Total Inspections','1,247','+15%',<ClipboardList key='cl'/>],['Pass Rate','97.2%','+0.8%',<ShieldCheck key='sc'/>],['Defect Rate','0.8%','-0.3%',<AlertTriangle key='at'/>],['Avg Cpk','1.45','+0.12',<Target key='t'/>],['COQ Savings','\u20b94.2M','+22%',<IndianRupee key='r'/>],['Open Escalations','3','-2',<ShieldAlert key='sa'/>],['Inspectors','6','0',<Users key='u'/>],['Avg Duration','35 min','-8%',<Timer key='tm'/>]].map(([label,val,tr,icon], i) => (
          <Card key={i} className="glass-subtle wqc-kpi"><CardContent className="p-3"><div className="flex items-center gap-2.5">{icon}<div><div className="text-[10px] text-muted-foreground">{String(label)}</div><div className="text-lg font-black tabular-nums">{String(val)}</div><div className="text-[10px] font-semibold text-emerald-600">{String(tr)}</div></div></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle wqc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Monthly Inspection Volume</CardTitle></CardHeader><CardContent className="p-3"><AreaChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Area type="monotone" dataKey="inspected" stroke={TH.blue} fill={TH.blue} fillOpacity={0.3}/><Area type="monotone" dataKey="passed" stroke={TH.emerald} fill={TH.emerald} fillOpacity={0.3}/></AreaChart></CardContent></Card>
        <Card className="glass-subtle wqc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Inspection Type Mix</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.typePie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name}: {name:string}) => <text x={0} y={0} fill="currentColor" fontSize={9} textAnchor="middle">{name}</text>}>{charts.typePie.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
        <Card className="glass-subtle wqc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Defect Severity Distribution</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.defectBar}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="critical" fill={TH.red} stackId="a"/><Bar dataKey="major" fill={TH.orange} stackId="a"/><Bar dataKey="minor" fill={TH.amber} stackId="a"/><Bar dataKey="cosmetic" fill={TH.blue} stackId="a"/></BarChart></CardContent></Card>
        <Card className="glass-subtle wqc-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">City Accuracy & Defect Rate</CardTitle></CardHeader><CardContent className="p-3"><LineChart data={charts.cityLine}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="city" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Line type="monotone" dataKey="accuracy" stroke={TH.emerald} strokeWidth={2}/><Line type="monotone" dataKey="defectRate" stroke={TH.red} strokeWidth={2}/></LineChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search inspections..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-emerald-50 dark:bg-emerald-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="inline h-3 w-3 ml-0.5 opacity-50"/></th>
          <th className="p-2 text-left font-semibold">Type</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">Grade</th>
          <th className="p-2 text-left font-semibold">City</th>
          <th className="p-2 text-left font-semibold">Inspector</th>
          <th className="p-2 text-left font-semibold">Product</th>
          <th className="p-2 text-left font-semibold">Pass Rate</th>
          <th className="p-2 text-left font-semibold">Defect %</th>
          <th className="p-2 text-left font-semibold">Cpk</th>
          <th className="p-2 text-left font-semibold">COQ</th>
          <th className="p-2"></th>
        </tr></thead><tbody className="divide-y">
          {filteredInsp.map(row => (
            <tr key={row.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors">
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><InspTypeBadge t={row.type}/></td>
              <td className="p-2"><QcStatusBadge s={row.status}/></td>
              <td className="p-2"><GradeBadge g={row.grade}/></td>
              <td className="p-2"><CityBadge city={row.city}/></td>
              <td className="p-2"><InspectorBadge name={row.inspector} score={row.inspScore}/></td>
              <td className="p-2"><ProductBadge p={row.product}/></td>
              <td className="p-2"><AccuracyGauge value={Math.round((row.passed/Math.max(row.totalItems,1))*100)}/></td>
              <td className="p-2"><DefectRateBar value={row.defectRate}/></td>
              <td className="p-2"><SpcIndicator cpk={parseFloat(row.cpk)}/></td>
              <td className="p-2"><CostTile value={row.costOfQuality}/></td>
              <td className="p-2"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetail(row)}><Eye className="h-3 w-3"/></Button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredInsp.length} inspections</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search defects..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-red-50 dark:bg-red-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold">ID</th>
          <th className="p-2 text-left font-semibold">Type</th>
          <th className="p-2 text-left font-semibold">Severity</th>
          <th className="p-2 text-left font-semibold">City</th>
          <th className="p-2 text-left font-semibold">Product</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">Root Cause</th>
          <th className="p-2 text-left font-semibold">Action</th>
          <th className="p-2 text-left font-semibold">Recurrence</th>
          <th className="p-2 text-left font-semibold">Cost</th>
        </tr></thead><tbody className="divide-y">
          {filteredDef.map(row => (
            <tr key={row.id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><DefectBadge t={row.type}/></td>
              <td className="p-2"><DefectSevBadge s={row.severity}/></td>
              <td className="p-2"><CityBadge city={row.city}/></td>
              <td className="p-2"><ProductBadge p={row.product}/></td>
              <td className="p-2"><span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (row.resolved ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700 animate-pulse")}>{row.resolved ? "\u2705 Resolved" : "\U0001f534 Open"}</span></td>
              <td className="p-2 text-muted-foreground">{row.rootCause}</td>
              <td className="p-2 text-muted-foreground">{row.correctiveAction}</td>
              <td className="p-2 numeric-cell tabular-nums">{row.recurrence}</td>
              <td className="p-2"><CostTile value={row.costImpact}/></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredDef.length} defects</div>
    </div>
  )

  const tab3 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {INSPECTORS.map((name, i) => {
          const insp = inspections.filter(x => x.inspector === name)
          const avgScore = Math.round(insp.reduce((s,x) => s+x.inspScore, 0) / (insp.length||1))
          const totalInsp = insp.length
          const passCount = insp.filter(x => x.status==="Passed").length
          const avgDefRate = (insp.reduce((s,x) => s+x.defectRate, 0) / (insp.length||1)).toFixed(1)
          return (
            <Card key={name} className="glass-subtle wqc-inspector-card hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Microscope className="h-5 w-5 text-emerald-600"/><div><div className="text-sm font-bold">{name}</div><div className="text-[10px] text-muted-foreground">Inspector</div></div></div><PassRateRing pct={Math.round((passCount/Math.max(totalInsp,1))*100)}/></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-2 text-center"><div className="text-lg font-black text-emerald-600">{avgScore}%</div><div className="text-[9px] text-muted-foreground">Avg Score</div></div>
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 text-center"><div className="text-lg font-black text-blue-600">{totalInsp}</div><div className="text-[9px] text-muted-foreground">Inspections</div></div>
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-2 text-center"><div className="text-lg font-black text-amber-600">{avgDefRate}%</div><div className="text-[9px] text-muted-foreground">Avg Defect</div></div>
                  <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-2 text-center"><StarRating value={Math.round(avgScore/20)}/></div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const tabs = [
    {key:"overview",label:"Dashboard",icon:<ShieldCheck className="h-3.5 w-3.5"/>,content:tab0},
    {key:"inspections",label:"Inspections",icon:<ClipboardList className="h-3.5 w-3.5"/>,content:tab1},
    {key:"defects",label:"Defects",icon:<AlertTriangle className="h-3.5 w-3.5"/>,content:tab2},
    {key:"inspectors",label:"Inspectors",icon:<Users className="h-3.5 w-3.5"/>,content:tab3},
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Warehouse Quality Command Center" description="Quality inspection management, defect tracking, SPC monitoring, and inspector performance analytics"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><ShieldCheck className="h-3 w-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">97.2% Pass Rate</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">6 Inspectors Active</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">0.8% Defect Rate</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30"><ShieldAlert className="h-3 w-3 text-red-600"/><span className="text-[10px] font-semibold text-red-700 dark:text-red-300">3 Escalations</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}><SheetContent className="w-[420px] overflow-y-auto"><SheetHeader><SheetTitle className="text-sm">Inspection Detail</SheetTitle></SheetHeader>{detail && <div className="mt-4 space-y-3"><div className="rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-4"><div className="text-lg font-bold">QC Details</div></div>{Object.entries(detail).map(([k,v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/50"><span className="text-xs font-medium text-muted-foreground">{k}</span><span className="text-xs font-semibold tabular-nums">{String(v)}</span></div>)}</div>}</SheetContent></Sheet>
    </div>
  )
}