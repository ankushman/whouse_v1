"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BrainCircuit, BarChart3, MapPin, Package, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star, RotateCcw, Truck, ShoppingBag, Store, Globe, Smartphone, ArrowRight,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const RETURN_STS = ["Received","In Transit","Inspecting","Approved","Rejected","Refunding","Exchanging","Completed"] as const
const RS_EMOJI: Record<string,string> = {Received:"📦","In Transit":"🚚",Inspecting:"🔍",Approved:"✅",Rejected:"❌",Refunding:"💰",Exchanging:"🔄",Completed:"🏆"}
const CHANNELS = ["Online App","Website","Amazon","Flipkart","Instagram","In-Store"] as const
const CH_EMOJI: Record<string,string> = {"Online App":"📱",Website:"🌐",Amazon:"🏬",Flipkart:"📲",Instagram:"📷","In-Store":"🏬"}
const REASONS = ["Size Issue","Color Mismatch","Defective","Wrong Item","Changed Mind","Not as Described","Late Delivery","Damaged in Transit"] as const
const RN_EMOJI: Record<string,string> = {"Size Issue":"📏","Color Mismatch":"🎨",Defective:"⚠\ufe0f","Wrong Item":"🛑","Changed Mind":"🤔","Not as Described":"💭","Late Delivery":"⏰","Damaged in Transit":"💥"}
const PRIOS = ["Urgent","Standard","Low"] as const
const INSP_TYPES = ["Visual","Functional","Dimensional","Cosmetic","Safety","Packaging","Electronic","Hygiene"] as const
const IT_EMOJI: Record<string,string> = {Visual:"👁",Functional:"⚙\ufe0f",Dimensional:"📐",Cosmetic:"💎",Safety:"🛡\ufe0f",Packaging:"📦",Electronic:"🔋",Hygiene:"🧼"}
const GRADES = ["A","B","C","D","F"] as const
const DISPOSITIONS = ["Resell","Refurbish","Liquidate","Donate","Recycle","Destroy"] as const
const REFUND_METHODS = ["Original Payment","Store Credit","Bank Transfer","UPI","Wallet","Replacement"] as const
const RM_EMOJI: Record<string,string> = {"Original Payment":"💳","Store Credit":"🏬","Bank Transfer":"🏦",UPI:"🤝","Wallet":"👜",Replacement:"🔄"}
const EXCH_TYPES = ["Size","Color","Model","Brand","Price Upgrade","Defect Replace","Accessory","Bundle"] as const
const ET_EMOJI: Record<string,string> = {Size:"📏",Color:"🎨",Model:"📱",Brand:"🎯","Price Upgrade":"⬆\ufe0f","Defect Replace":"🔧",Accessory:"🎒",Bundle:"📦"}
const CARRIERS = ["Delhivery","BlueDart","DTDC","Ekart","Shadowfax","XpressBees","Ecom Express","Amazon Logistics"] as const
const CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {rose:"#e11d48",blue:"#3b82f6",amber:"#d97706",emerald:"#059669",violet:"#7c3aed",cyan:"#0891b2"}
const PC = [TH.rose,TH.blue,TH.amber,TH.emerald,TH.violet,TH.cyan,"#f97316","#8b5cf6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.abs(s) % arr.length] }
function fmtINR(n: number): string { const s = n < 0 ? "-" : ""; const a = Math.abs(n); if (a >= 1e7) return `₹${s}${(a / 1e7).toFixed(2)} Cr`; if (a >= 1e5) return `₹${s}${(a / 1e5).toFixed(2)} L`; return `₹${s}${a.toLocaleString("en-IN")}` }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 16 Visual Components */
function ReturnStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Received:"bg-blue-100 text-blue-700","In Transit":"bg-cyan-100 text-cyan-700",Inspecting:"bg-amber-100 text-amber-700",Approved:"bg-emerald-100 text-emerald-700",Rejected:"bg-red-100 text-red-700",Refunding:"bg-violet-100 text-violet-700",Exchanging:"bg-blue-100 text-blue-700",Completed:"bg-emerald-100 text-emerald-700"}
  const pulse = status==="Inspecting"||status==="Refunding"||status==="In Transit" ? "animate-pulse" : ""
  return <span className={`ocr-rs-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||"bg-gray-100"} ${pulse}`}>{RS_EMOJI[status]} {status}</span>
}
function ChannelBadge({ ch }: { ch: string }) {
  const cl: Record<string,string> = {"Online App":"bg-rose-100 text-rose-700",Website:"bg-blue-100 text-blue-700",Amazon:"bg-amber-100 text-amber-700",Flipkart:"bg-violet-100 text-violet-700",Instagram:"bg-pink-100 text-pink-700","In-Store":"bg-emerald-100 text-emerald-700"}
  return <span className={`ocr-ch-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[ch]||"bg-gray-100"}`}>{CH_EMOJI[ch]} {ch}</span>
}
function ReturnReasonBadge({ reason }: { reason: string }) {
  return <span className={`ocr-rr-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300`}>{RN_EMOJI[reason]} {reason}</span>
}
function PriorityBadge({ p }: { p: string }) {
  const cl: Record<string,string> = {Urgent:"bg-red-100 text-red-700 shadow-[0_0_8px_oklch(0.55_0.22_25/0.3)]",Standard:"bg-blue-100 text-blue-700",Low:"bg-gray-100 text-gray-600"}
  return <span className={`ocr-prio-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${cl[p]||"bg-gray-100"}`}>{p === "Urgent" ? "🔴" : p === "Standard" ? "🔵" : "⚪"} {p}</span>
}
function ConditionGrade({ grade }: { grade: string }) {
  const cl: Record<string,string> = {A:"bg-emerald-100 text-emerald-700 border-emerald-300",B:"bg-blue-100 text-blue-700 border-blue-300",C:"bg-amber-100 text-amber-700 border-amber-300",D:"bg-orange-100 text-orange-700 border-orange-300",F:"bg-red-100 text-red-700 border-red-300"}
  return <span className={`ocr-grade inline-flex items-center justify-center w-6 h-6 rounded-full border-2 text-[10px] font-bold ${cl[grade]||"bg-gray-100 border-gray-300"}`}>{grade}</span>
}
function DispositionBadge({ d }: { d: string }) {
  const cl: Record<string,string> = {Resell:"bg-emerald-100 text-emerald-700",Refurbish:"bg-blue-100 text-blue-700",Liquidate:"bg-amber-100 text-amber-700",Donate:"bg-violet-100 text-violet-700",Recycle:"bg-cyan-100 text-cyan-700",Destroy:"bg-red-100 text-red-700"}
  return <span className={`ocr-disp-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[d]||"bg-gray-100"}`}>{d}</span>
}
function InspectionTypeBadge({ t }: { t: string }) {
  return <span className={`ocr-it-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300`}>{IT_EMOJI[t]} {t}</span>
}
function RefundMethodBadge({ m }: { m: string }) {
  const cl: Record<string,string> = {"Original Payment":"bg-emerald-100 text-emerald-700","Store Credit":"bg-violet-100 text-violet-700","Bank Transfer":"bg-blue-100 text-blue-700",UPI:"bg-cyan-100 text-cyan-700",Wallet:"bg-amber-100 text-amber-700",Replacement:"bg-rose-100 text-rose-700"}
  return <span className={`ocr-rm-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[m]||"bg-gray-100"}`}>{RM_EMOJI[m]} {m}</span>
}
function RefundStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Pending:"bg-amber-100 text-amber-700",Processing:"bg-blue-100 text-blue-700",Completed:"bg-emerald-100 text-emerald-700",Failed:"bg-red-100 text-red-700",Reversed:"bg-violet-100 text-violet-700","On Hold":"bg-gray-100 text-gray-600"}
  const pulse = status==="Processing" ? "animate-pulse" : ""
  return <span className={`ocr-rfs-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||"bg-gray-100"} ${pulse}`}>● {status}</span>
}
function ExchangeTypeBadge({ t }: { t: string }) {
  return <span className={`ocr-et-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300`}>{ET_EMOJI[t]} {t}</span>
}
function ExchangeStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Requested:"bg-blue-100 text-blue-700",Shipped:"bg-cyan-100 text-cyan-700","In Transit":"bg-amber-100 text-amber-700",Delivered:"bg-emerald-100 text-emerald-700",Cancelled:"bg-red-100 text-red-700",Pending:"bg-gray-100 text-gray-600"}
  const pulse = status==="In Transit"||status==="Shipped" ? "animate-pulse" : ""
  return <span className={`ocr-es-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||"bg-gray-100"} ${pulse}`}>● {status}</span>
}
function CarrierBadge({ c }: { c: string }) {
  return <span className={`ocr-carrier inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300`}>🚚 {c}</span>
}
function CityBadge({ city }: { city: string }) {
  return <span className={`ocr-city inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`}>📍 {city}</span>
}
function ValueTile({ value, label }: { value: number; label: string }) {
  const color = value > 10000 ? "text-emerald-600 dark:text-emerald-400" : value > 5000 ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"
  return <div className="ocr-value-tile text-right"><div className={`text-sm font-bold tabular-nums ${color}`}>{fmtINR(value)}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}
function SatisfactionStars({ rating }: { rating: number }) {
  return <span className="ocr-stars inline-flex gap-0.5">{Array.from({length:5},(_,i)=> <Star key={i} className={`h-3 w-3 ${i<Math.round(rating)?"fill-amber-400 text-amber-400":"text-gray-300 dark:text-gray-600"}`}/>)}</span>
}
function SLABar({ value }: { value: number }) {
  const c = value >= 95 ? "bg-emerald-500" : value >= 80 ? "bg-blue-500" : value >= 60 ? "bg-amber-500" : "bg-red-500"
  return <div className="ocr-sla-bar flex items-center gap-2"><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={`h-full rounded-full ${c}`} style={{width:`${Math.min(value,100)}%`}}/></div><span className="text-[10px] font-medium tabular-nums">{value}%</span></div>
}

const INDIAN_NAMES = ["Aarav Sharma","Priya Patel","Rahul Mehta","Ananya Gupta","Vikram Singh","Sneha Reddy","Arjun Kumar","Diya Iyer","Rohan Joshi","Meera Nair","Aditya Rao","Kavya Menon","Ishaan Verma","Tanya Das","Dev Malik","Pooja Saxena","Karan Chopra","Nisha Agarwal","Ravi Desai","Sonia Pillai"]
const PRODUCTS = ["iPhone 15 Pro","Samsung Galaxy S24","OnePlus 12","MacBook Air M3","iPad Pro","Sony WH-1000XM5","Nike Air Max","Levis 501","Boat Airdopes","Dell XPS 15","HP Pavilion","Canon EOS R6","Adidas Ultraboost","HM Jacket","Prestige Mixer","Bosch Drill","Whirlpool Fridge","LG TV 55","Raymond Suit","Fabindia Kurta"]

function generateReturns() { return Array.from({length:75},(_,i)=>{ const s=i*137+42; const status=pick(RETURN_STS,s); return {id:`RTN-${String(i+1).padStart(4,"0")}`,customer:pick(INDIAN_NAMES,s+1),channel:pick(CHANNELS,s+2),reason:pick(REASONS,s+3),priority:pick(PRIOS,s+4),product:pick(PRODUCTS,s+5),sku:`SKU-${ri(10000,99999,s+6)}`,value:ri(500,50000,s+7),status,city:pick(CITIES,s+8),rma:`RMA-${String(i+1).padStart(6,"0")}`,daysOpen:ri(0,14,s+9),timestamp:`2024-${String(ri(1,12,s+10)).padStart(2,"0")}-${String(ri(1,28,s+11)).padStart(2,"0")}`} })}
function generateQuality() { return Array.from({length:70},(_,i)=>{ const s=i*211+88; return {id:`QA-${String(i+1).padStart(4,"0")}`,returnId:`RTN-${String(ri(1,75,s)).padStart(4,"0")}`,inspectionType:pick(INSP_TYPES,s+1),grade:pick(GRADES,s+2),disposition:pick(DISPOSITIONS,s+3),inspector:pick(INDIAN_NAMES,s+4),processingTime:ri(1,48,s+5),defects:ri(0,5,s+6),notes:pick(["Minor scratch","Major defect","No issue found","Color variation","Missing parts","Cosmetic damage","Functional OK","Safety concern"],s+7)} })}
function generateRefunds() { return Array.from({length:65},(_,i)=>{ const s=i*317+66; return {id:`REF-${String(i+1).padStart(4,"0")}`,returnId:`RTN-${String(ri(1,75,s)).padStart(4,"0")}`,method:pick(REFUND_METHODS,s+1),status:pick(["Pending","Processing","Completed","Failed","Reversed","On Hold"],s+2),amount:ri(200,45000,s+3),slaPercent:ri(60,100,s+4),satisfaction:ri(1,5,s+5)/1,processingDays:ri(1,7,s+6),customer:pick(INDIAN_NAMES,s+7)} })}
function generateExchanges() { return Array.from({length:55},(_,i)=>{ const s=i*431+55; return {id:`EXC-${String(i+1).padStart(4,"0")}`,returnId:`RTN-${String(ri(1,75,s)).padStart(4,"0")}`,exchangeType:pick(EXCH_TYPES,s+1),status:pick(["Requested","Shipped","In Transit","Delivered","Cancelled","Pending"],s+2),carrier:pick(CARRIERS,s+3),originalProduct:pick(PRODUCTS,s+4),newProduct:pick(PRODUCTS,s+5),city:pick(CITIES,s+6),etaDays:ri(1,10,s+7),prefMatch:ri(60,100,s+8)} })}

export function OmnichannelReturnsHubView() {
  const [tab, setTab] = useState("0")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc")
  const [selReturn, setSelReturn] = useState<any>(null)

  const returns = useMemo(()=>generateReturns(),[])
  const quality = useMemo(()=>generateQuality(),[])
  const refunds = useMemo(()=>generateRefunds(),[])
  const exchanges = useMemo(()=>generateExchanges(),[])

  // Dashboard data
  const dashKPIs = [
    {label:"Total Returns",value:returns.length,icon:RotateCcw,color:"text-rose-600",change:"+12%"},
    {label:"Pending Inspection",value:returns.filter(r=>r.status==="Inspecting").length,icon:Search,color:"text-amber-600",change:"-5%"},
    {label:"Refund Processed",value:refunds.filter(r=>r.status==="Completed").length,icon:IndianRupee,color:"text-emerald-600",change:"+8%"},
    {label:"Exchange Requests",value:exchanges.length,icon:Package,color:"text-blue-600",change:"+15%"},
    {label:"Return Rate",value:"4.2%",icon:TrendingUp,color:"text-violet-600",change:"-0.3%"},
    {label:"Avg Process Time",value:"2.4d",icon:Clock,color:"text-cyan-600",change:"-0.5d"},
    {label:"Channel Spread",value:"6",icon:Globe,color:"text-amber-600",change:"+1"},
    {label:"Quality Score",value:"87%",icon:ShieldCheck,color:"text-emerald-600",change:"+3%"},
  ]

  const monthlyReturns = MO.map((m,i)=>{ const s=i*73+11; return {month:m,Online:ri(80,200,s),Store:ri(40,100,s+1),Marketplace:ri(60,180,s+2)} })
  const reasonData = REASONS.map((r,i)=>({name:r,value:ri(5,25,i*41+7)}))
  const channelData = CHANNELS.map((c,i)=>({name:c,returns:ri(30,80,i*53+17),rate:ri(2,8,i*31+3)}))
  const channelPerfData = CHANNELS.map((c,i)=>({name:c,rate:ri(2,8,i*53+3),refund:ri(1,5,i*41+2),exchange:ri(0,3,i*29+1)}))
  const refundMethodData = REFUND_METHODS.map((m,i)=>({name:m,value:ri(5,20,i*37+9)}))
  const monthlyTrend = MO.map((m,i)=>({month:m,returns:ri(100,300,i*61+13),refunds:ri(80,250,i*47+7),exchanges:ri(20,60,i*29+3)}))
  const cityData = CITIES.map((c,i)=>({name:c,returns:ri(50,200,i*71+23)})).sort((a,b)=>b.returns-a.returns)

  const handleSort = (f: string) => { if(f===sortField) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortField(f); setSortDir("asc") } }
  const fReturns = sortedData(filterData(returns,search),sortField,sortDir)
  const fQuality = sortedData(filterData(quality,search),sortField,sortDir)
  const fRefunds = sortedData(filterData(refunds,search),sortField,sortDir)
  const fExchanges = sortedData(filterData(exchanges,search),sortField,sortDir)

  function SortHeader({label,field}:{label:string;field:string}) { return <th className="ocr-table-header px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={()=>handleSort(field)}><span className="inline-flex items-center gap-1">{label}{sortField===field?(sortDir==="asc"?<ArrowUpDown className="h-3 w-3"/>:<ArrowUpDown className="h-3 w-3 rotate-180"/>):null}</span></th> }

  return (
    <div className="ocr-root flex flex-col gap-4 p-4">
      <PageHeader title="Omnichannel Returns Hub" description="Unified returns management across all sales channels" />

      {/* Search bar */}
      <div className="flex items-center gap-2"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search returns, orders, customers..." className="pl-9 h-9 text-sm"/></div></div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="ocr-tabs-list flex flex-wrap gap-1">
          {["Returns Dashboard","Return Orders","Quality Assessment","Refund Processing","Channel Analytics","Exchange Management"].map((t,i)=>(<TabsTrigger key={i} value={String(i)} className="ocr-tab text-xs">{t}</TabsTrigger>))}
        </TabsList>

      {tab==="0" && <>
        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{dashKPIs.map((k,i)=>(<Card key={i} className="ocr-kpi-card"><CardContent className="p-3 flex items-center gap-3"><div className={`ocr-kpi-icon flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${k.color}/10 ${k.color}/20`}><k.icon className={`h-5 w-5 ${k.color}`}/></div><div><div className="text-lg font-bold">{k.value}</div><div className="text-[10px] text-muted-foreground">{k.label}</div><div className={`text-[10px] font-medium ${k.change.startsWith("+")?"text-emerald-600":"text-red-600"}`}>{k.change}</div></div></CardContent></Card>))}</div>
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ocr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Monthly Returns Trend</CardTitle></CardHeader><CardContent><AreaChart data={monthlyReturns}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Area type="monotone" dataKey="Online" stackId="a" stroke={TH.rose} fill={TH.rose} fillOpacity={0.3}/><Area type="monotone" dataKey="Store" stackId="a" stroke={TH.blue} fill={TH.blue} fillOpacity={0.3}/><Area type="monotone" dataKey="Marketplace" stackId="a" stroke={TH.amber} fill={TH.amber} fillOpacity={0.3}/></AreaChart></CardContent></Card>
          <Card className="ocr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Return Reasons</CardTitle></CardHeader><CardContent><PieChart><Pie data={reasonData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} label={({name,percent})=>`${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={9}>{reasonData.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip contentStyle={{fontSize:11}}/></PieChart></CardContent></Card>
          <Card className="ocr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Returns by Channel</CardTitle></CardHeader><CardContent><BarChart data={channelData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Bar dataKey="returns" fill={TH.rose} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
          <Card className="ocr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Channel Performance</CardTitle></CardHeader><CardContent><BarChart layout="vertical" data={channelPerfData}><CartesianGrid strokeDasharray="3 3"/><XAxis type="number" tick={{fontSize:10}}/><YAxis dataKey="name" type="category" tick={{fontSize:9}} width={80}/><Tooltip contentStyle={{fontSize:11}}/><Bar dataKey="rate" fill={TH.violet} radius={[0,4,4,0]}/></BarChart></CardContent></Card>
        </div>
      </>}
      {tab==="1" && <>
        <Card><CardContent className="p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="ocr-table-header sticky top-0 bg-card"><tr><SortHeader label="RMA #" field="rma"/><SortHeader label="Customer" field="customer"/><SortHeader label="Channel" field="channel"/><SortHeader label="Reason" field="reason"/><SortHeader label="Status" field="status"/><SortHeader label="Value" field="value"/><SortHeader label="City" field="city"/></tr></thead><tbody>{fReturns.map(r=>(<tr key={r.id} className="ocr-table-row border-b transition-colors hover:bg-muted/50 cursor-pointer" onClick={()=>{setSelReturn(r)}}><td className="px-3 py-2 text-xs font-mono font-medium">{r.rma}</td><td className="px-3 py-2 text-xs">{r.customer}</td><td className="px-3 py-2"><ChannelBadge ch={r.channel}/></td><td className="px-3 py-2"><ReturnReasonBadge reason={r.reason}/></td><td className="px-3 py-2"><ReturnStatusBadge status={r.status}/></td><td className="px-3 py-2 text-xs font-medium tabular-nums text-right">{fmtINR(r.value)}</td><td className="px-3 py-2"><CityBadge city={r.city}/></td></tr>))}</tbody></table></div></CardContent></Card>
      </>}
      {tab==="2" && <>
        <Card><CardContent className="p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="ocr-table-header sticky top-0 bg-card"><tr><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">ID</th><SortHeader label="Type" field="inspectionType"/><SortHeader label="Grade" field="grade"/><SortHeader label="Disposition" field="disposition"/><SortHeader label="Inspector" field="inspector"/><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Time</th><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Defects</th></tr></thead><tbody>{fQuality.map(q=>(<tr key={q.id} className="ocr-table-row border-b transition-colors hover:bg-muted/50"><td className="px-3 py-2 text-xs font-mono">{q.id}</td><td className="px-3 py-2"><InspectionTypeBadge t={q.inspectionType}/></td><td className="px-3 py-2"><ConditionGrade grade={q.grade}/></td><td className="px-3 py-2"><DispositionBadge d={q.disposition}/></td><td className="px-3 py-2 text-xs">{q.inspector}</td><td className="px-3 py-2 text-xs tabular-nums">{q.processingTime}h</td><td className="px-3 py-2 text-xs tabular-nums">{q.defects}</td></tr>))}</tbody></table></div></CardContent></Card>
      </>}
      {tab==="3" && <>
        <Card><CardContent className="p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="ocr-table-header sticky top-0 bg-card"><tr><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">ID</th><SortHeader label="Method" field="method"/><SortHeader label="Status" field="status"/><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Amount</th><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">SLA</th><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Satisfaction</th><SortHeader label="Customer" field="customer"/></tr></thead><tbody>{fRefunds.map(r=>(<tr key={r.id} className="ocr-table-row border-b transition-colors hover:bg-muted/50"><td className="px-3 py-2 text-xs font-mono">{r.id}</td><td className="px-3 py-2"><RefundMethodBadge m={r.method}/></td><td className="px-3 py-2"><RefundStatusBadge status={r.status}/></td><td className="px-3 py-2 text-xs font-medium tabular-nums text-right">{fmtINR(r.amount)}</td><td className="px-3 py-2"><SLABar value={r.slaPercent}/></td><td className="px-3 py-2"><SatisfactionStars rating={r.satisfaction}/></td><td className="px-3 py-2 text-xs">{r.customer}</td></tr>))}</tbody></table></div></CardContent></Card>
      </>}
      {tab==="4" && <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ocr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Returns vs Refunds vs Exchanges</CardTitle></CardHeader><CardContent><LineChart data={monthlyTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Line type="monotone" dataKey="returns" stroke={TH.rose} strokeWidth={2}/><Line type="monotone" dataKey="refunds" stroke={TH.blue} strokeWidth={2}/><Line type="monotone" dataKey="exchanges" stroke={TH.emerald} strokeWidth={2}/></LineChart></CardContent></Card>
          <Card className="ocr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Refund Methods</CardTitle></CardHeader><CardContent><PieChart><Pie data={refundMethodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} label={({name,percent})=>`${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={9}>{refundMethodData.map((_,i)=><Cell key={i} fill={PC[(i+2)%PC.length]}/>)}</Pie><Tooltip contentStyle={{fontSize:11}}/></PieChart></CardContent></Card>
          <Card className="ocr-chart-card col-span-full"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Returns by City</CardTitle></CardHeader><CardContent><BarChart layout="vertical" data={cityData}><CartesianGrid strokeDasharray="3 3"/><XAxis type="number" tick={{fontSize:10}}/><YAxis dataKey="name" type="category" tick={{fontSize:9}} width={80}/><Tooltip contentStyle={{fontSize:11}}/><Bar dataKey="returns" fill={TH.cyan} radius={[0,4,4,0]}/></BarChart></CardContent></Card>
        </div>
      </>}
      {tab==="5" && <>
        <Card><CardContent className="p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="ocr-table-header sticky top-0 bg-card"><tr><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">ID</th><SortHeader label="Type" field="exchangeType"/><SortHeader label="Status" field="status"/><SortHeader label="Carrier" field="carrier"/><SortHeader label="City" field="city"/><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">ETA</th><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Pref Match</th></tr></thead><tbody>{fExchanges.map(e=>(<tr key={e.id} className="ocr-table-row border-b transition-colors hover:bg-muted/50"><td className="px-3 py-2 text-xs font-mono">{e.id}</td><td className="px-3 py-2"><ExchangeTypeBadge t={e.exchangeType}/></td><td className="px-3 py-2"><ExchangeStatusBadge status={e.status}/></td><td className="px-3 py-2"><CarrierBadge c={e.carrier}/></td><td className="px-3 py-2"><CityBadge city={e.city}/></td><td className="px-3 py-2 text-xs tabular-nums">{e.etaDays}d</td><td className="px-3 py-2"><SLABar value={e.prefMatch}/></td></tr>))}</tbody></table></div></CardContent></Card>
      </>}

      </Tabs>

      {/* Detail Sheet */}
      <Sheet open={!!selReturn} onOpenChange={()=>setSelReturn(null)}>
        <SheetContent><SheetHeader><SheetTitle>Return Detail</SheetTitle></SheetHeader>{selReturn&&<div className="space-y-4 mt-4"><div className="grid grid-cols-2 gap-3"><div><div className="text-xs text-muted-foreground">RMA</div><div className="text-sm font-mono font-medium">{selReturn.rma}</div></div><div><div className="text-xs text-muted-foreground">Customer</div><div className="text-sm">{selReturn.customer}</div></div><div><div className="text-xs text-muted-foreground">Product</div><div className="text-sm">{selReturn.product}</div></div><div><div className="text-xs text-muted-foreground">SKU</div><div className="text-sm font-mono">{selReturn.sku}</div></div><div><div className="text-xs text-muted-foreground">Value</div><div className="text-sm font-medium">{fmtINR(selReturn.value)}</div></div><div><div className="text-xs text-muted-foreground">Days Open</div><div className="text-sm">{selReturn.daysOpen}</div></div></div><div className="flex flex-wrap gap-2"><ReturnStatusBadge status={selReturn.status}/><ChannelBadge ch={selReturn.channel}/><ReturnReasonBadge reason={selReturn.reason}/><PriorityBadge p={selReturn.priority}/><CityBadge city={selReturn.city}/></div></div>}</SheetContent>
      </Sheet>
    </div>
  )
}

export default OmnichannelReturnsHubView