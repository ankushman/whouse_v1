"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BrainCircuit, BarChart3, MapPin, Package, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star, Archive, Tags, Percent, Truck, Warehouse, FileText, RefreshCw, Link2,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const OWNER_STS = ["Active","Pending Receipt","Partial Receipt","Quality Check","Dispute","Expired","Return Initiated","Completed"] as const
const SLOC_STS = ["In Stock","Reserved","Allocated","Shipped","Damaged","Expired","Quarantine","Written Off"] as const
const CONSIGNMENT_TYPES = ["Raw Materials","Finished Goods","Spare Parts","Packaging","Semi-Finished","Safety Stock","Seasonal","Promotional"] as const
const CT_EMOJI: Record<string,string> = {"Raw Materials":"🪨","Finished Goods":"📦","Spare Parts":"🔧","Packaging":"📦","Semi-Finished":"⚙️","Safety Stock":"🛡️","Seasonal":"🎄","Promotional":"🎁"}
const INDIAN_SUPPLIERS = ["Tata Steel","Reliance Industries","Mahindra & Mahindra","Wipro","Infosys","L&T","Bajaj Group","Godrej","Adani Ports","JSW Steel","Asian Paints","Maruti Suzuki","Sun Pharma","Dr. Reddys","Hindalco","Grasim"]
const PAYMENT_TERMS = ["Net 30","Net 45","Net 60","Net 90","Advance 100%","50-50 Milestone","Letter of Credit","Open Account"] as const
const CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad"]
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {violet:"#7c3aed",blue:"#3b82f6",emerald:"#059669",amber:"#d97706",rose:"#e11d48",cyan:"#0891b2"}
const PC = [TH.violet,TH.blue,TH.emerald,TH.amber,TH.rose,TH.cyan,"#f97316","#8b5cf6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.abs(s) % arr.length] }
function fmtINR(n: number): string { const s = n < 0 ? "-" : ""; const a = Math.abs(n); if (a >= 1e7) return "\u20b9" + s + (a / 1e7).toFixed(2) + " Cr"; if (a >= 1e5) return "\u20b9" + s + (a / 1e5).toFixed(2) + " L"; return "\u20b9" + s + a.toLocaleString("en-IN") }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 16 Visual Components */
function OwnerStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Active:"bg-emerald-100 text-emerald-700","Pending Receipt":"bg-blue-100 text-blue-700","Partial Receipt":"bg-cyan-100 text-cyan-700","Quality Check":"bg-amber-100 text-amber-700",Dispute:"bg-red-100 text-red-700",Expired:"bg-gray-100 text-gray-500","Return Initiated":"bg-violet-100 text-violet-700",Completed:"bg-emerald-100 text-emerald-700"}
  const pulse = s==="Active"||s==="Quality Check"||s==="Return Initiated" ? "animate-pulse" : ""
  return <span className={`cip-os-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[s]||"bg-gray-100"} ${pulse}`}>● {s}</span>
}
function SlocStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {"In Stock":"bg-emerald-100 text-emerald-700",Reserved:"bg-blue-100 text-blue-700",Allocated:"bg-cyan-100 text-cyan-700",Shipped:"bg-violet-100 text-violet-700",Damaged:"bg-red-100 text-red-700",Expired:"bg-gray-100 text-gray-500",Quarantine:"bg-amber-100 text-amber-700","Written Off":"bg-red-100 text-red-700"}
  return <span className={`cip-ss-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[s]||"bg-gray-100"}`}>● {s}</span>
}
function ConsignmentTypeBadge({ t }: { t: string }) {
  return <span className="cip-ct-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">{CT_EMOJI[t]} {t}</span>
}
function PaymentTermBadge({ t }: { t: string }) {
  const cl: Record<string,string> = {"Net 30":"bg-emerald-100 text-emerald-700","Net 45":"bg-blue-100 text-blue-700","Net 60":"bg-cyan-100 text-cyan-700","Net 90":"bg-amber-100 text-amber-700","Advance 100%":"bg-violet-100 text-violet-700","50-50 Milestone":"bg-rose-100 text-rose-700","Letter of Credit":"bg-indigo-100 text-indigo-700","Open Account":"bg-gray-100 text-gray-600"}
  return <span className={`cip-pt-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${cl[t]||"bg-gray-100"}`}>💳 {t}</span>
}
function ValueTile({ value, label }: { value: number; label: string }) {
  const c = value > 500000 ? "text-violet-600 dark:text-violet-400" : value > 100000 ? "text-blue-600 dark:text-blue-400" : value > 50000 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
  return <div className="cip-value text-right"><div className={`text-sm font-bold tabular-nums ${c}`}>{fmtINR(value)}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}
function SupplierBadge({ name }: { name: string }) {
  return <span className="cip-supplier inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">🏭 {name}</span>
}
function CityBadge({ city }: { city: string }) {
  return <span className="cip-city inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">📍 {city}</span>
}
function UtilizationBar({ value }: { value: number }) {
  const c = value > 90 ? "bg-red-500" : value > 75 ? "bg-amber-500" : value > 50 ? "bg-blue-500" : "bg-emerald-500"
  return <div className="cip-util flex items-center gap-2"><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={`h-full rounded-full transition-all ${c}`} style={{width:`${Math.min(value,100)}%`}}/></div><span className="text-[10px] font-medium tabular-nums">{value}%</span></div>
}
function DaysTile({ value, label }: { value: number; label: string }) {
  const c = value > 60 ? "text-red-600 dark:text-red-400" : value > 30 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
  return <div className="cip-days text-right"><div className={`text-sm font-bold tabular-nums ${c}`}>{value}d</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}
function QtyBadge({ qty, unit }: { qty: number; unit: string }) {
  return <span className="cip-qty inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">📊 {qty.toLocaleString("en-IN")} {unit}</span>
}
function TurnoverBar({ value }: { value: number }) {
  const c = value > 8 ? "bg-emerald-500" : value > 5 ? "bg-blue-500" : value > 3 ? "bg-amber-500" : "bg-red-500"
  return <div className="cip-turnover flex items-center gap-2"><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={`h-full rounded-full ${c}`} style={{width:`${(value/12)*100}%`}}/></div><span className="text-[10px] font-medium tabular-nums">{value}x</span></div>
}
function AgingBadge({ days }: { days: number }) {
  const label = days > 90 ? "Critical" : days > 60 ? "Warning" : days > 30 ? "Normal" : "Fresh"
  const c = days > 90 ? "text-red-600" : days > 60 ? "text-amber-600" : days > 30 ? "text-blue-600" : "text-emerald-600"
  return <span className={`cip-aging inline-flex items-center gap-1 text-[10px] font-bold ${c}`}>📅 {label} ({days}d)</span>
}
function ExpiryBar({ pct }: { pct: number }) {
  const c = pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : pct > 40 ? "bg-blue-500" : "bg-emerald-500"
  return <div className="cip-expiry flex items-center gap-2"><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={`h-full rounded-full ${c}`} style={{width:`${pct}%`}}/></div><span className="text-[10px] font-medium tabular-nums">{pct}% elapsed</span></div>
}
function LinkBadge({ linked }: { linked: boolean }) {
  return <span className={`cip-link inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${linked ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{linked ? "🔗 Linked" : "⚠ Unlinked"}</span>
}

function generateConsignmentOwners() { return Array.from({length:75},(_,i)=>{ const s=i*137+42; return {id:`CO-${String(i+1).padStart(4,"0")}`,supplier:pick(INDIAN_SUPPLIERS,s+1),type:pick(CONSIGNMENT_TYPES,s+2),status:pick(OWNER_STS,s+3),value:ri(50000,5000000,s+4),qty:ri(100,10000,s+5),unit:pick(["pcs","kg","liters","meters","sets","boxes"],s+6),paymentTerm:pick(PAYMENT_TERMS,s+7),city:pick(CITIES,s+8),contractRef:`CTR-${String(ri(1000,9999,s+9)).padStart(4,"0")}`,receivedPct:ri(0,100,s+10),daysOpen:ri(1,365,s+11),linkedPO:pick([true,false,true],s+12)} }) }

function generateStockLocations() { return Array.from({length:70},(_,i)=>{ const s=i*211+88; return {id:`SLOC-${String(i+1).padStart(4,"0")}`,ownerId:`CO-${String(ri(1,75,s)).padStart(4,"0")}`,product:`SKU-${ri(10000,99999,s+1)}`,description:pick(["Steel Sheets 2mm","Copper Wire 4mm","Aluminum Ingots","Plastic Pellets","Rubber Gaskets","Electronic Components","Textile Rolls","Chemical Solvent","Glass Panels","Battery Cells"],s+2),status:pick(SLOC_STS,s+3),qty:ri(10,5000,s+4),value:ri(5000,500000,s+5),warehouse:pick(CITIES,s+6)+" WH",zone:pick(["A1","B2","C3","D4","E5","F6","G7","H8"],s+7),shelf:pick(["R1S1","R1S2","R2S1","R2S2","R3S1","R3S2","R4S1","R4S2"],s+8),aging:ri(0,180,s+9),expiryPct:ri(0,100,s+10),turnover:ri(1,12,s+11)} }) }

function generateAnalytics() { return Array.from({length:55},(_,i)=>{ const s=i*317+66; return {id:`ANL-${String(i+1).padStart(4,"0")}`,supplier:pick(INDIAN_SUPPLIERS,s+1),type:pick(CONSIGNMENT_TYPES,s+2),totalValue:ri(100000,10000000,s+3),utilization:ri(40,100,s+4),turnoverRate:ri(1,12,s+5),agedCount:ri(0,50,s+6),returnRate:ri(0,15,s+7)/10,qualityScore:ri(70,100,s+8),costSavings:ri(5000,200000,s+9)} }) }

export function ConsignmentInventoryProView() {
  const [tab, setTab] = useState("0")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc")
  const [selOwner, setSelOwner] = useState<any>(null)

  const owners = useMemo(()=>generateConsignmentOwners(),[])
  const slocs = useMemo(()=>generateStockLocations(),[])
  const analytics = useMemo(()=>generateAnalytics(),[])

  const dashKPIs = [
    {label:"Active Consignment",value:owners.filter(o=>o.status==="Active").length,icon:Archive,color:"text-violet-600",change:"+3"},
    {label:"Total Value",value:fmtINR(owners.reduce((a,o)=>a+o.value,0)),icon:IndianRupee,color:"text-blue-600",change:"+8%"},
    {label:"Stock Locations",value:slocs.length,icon:Warehouse,color:"text-emerald-600",change:"+5"},
    {label:"Avg Utilization",value:"72%",icon:Percent,color:"text-cyan-600",change:"+4%"},
    {label:"Pending Receipt",value:owners.filter(o=>o.status==="Pending Receipt").length,icon:Truck,color:"text-amber-600",change:"-2"},
    {label:"In Dispute",value:owners.filter(o=>o.status==="Dispute").length,icon:AlertTriangle,color:"text-red-600",change:"+1"},
    {label:"Aged Stock (>90d)",value:slocs.filter(s=>s.aging>90).length,icon:Clock,color:"text-rose-600",change:"+7"},
    {label:"Quality Score",value:"91%",icon:ShieldCheck,color:"text-emerald-600",change:"+2%"},
  ]

  const monthlyValue = MO.map((m,i)=>({month:m,consignment:ri(1000000,5000000,i*73+11),returns:ri(50000,300000,i*53+7),savings:ri(10000,200000,i*37+3)}))
  const typeData = CONSIGNMENT_TYPES.map((t,i)=>({name:t,value:ri(5,20,i*41+7)}))
  const supplierTop = INDIAN_SUPPLIERS.slice(0,8).map((s,i)=>({name:s.replace(/\s.*/,""),value:ri(10,50,i*61+17)}))
  const utilizationTrend = MO.map((m,i)=>({month:m,utilization:ri(60,95,i*67+3),turnover:ri(3,10,i*43+7)}))
  const expiryData = slocs.filter(s=>s.expiryPct>50).slice(0,8).map(s=>({name:s.product.substring(0,10),expiry:s.expiryPct,aging:s.aging}))

  const handleSort = (f: string) => { if(f===sortField) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortField(f); setSortDir("asc") } }
  const fOwners = sortedData(filterData(owners,search),sortField,sortDir)
  const fSlocs = sortedData(filterData(slocs,search),sortField,sortDir)
  const fAnalytics = sortedData(filterData(analytics,search),sortField,sortDir)

  function SortHeader({label,field}:{label:string;field:string}) { return <th className="cip-table-header px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={()=>handleSort(field)}><span className="inline-flex items-center gap-1">{label}{sortField===field?(sortDir==="asc"?<ArrowUpDown className="h-3 w-3"/>:<ArrowUpDown className="h-3 w-3 rotate-180"/>):null}</span></th> }

  return (
    <div className="cip-root flex flex-col gap-4 p-4">
      <PageHeader title="Consignment Inventory Pro" description="Advanced consignment tracking with supplier management, aging analysis, and financial reporting" />
      <div className="flex items-center gap-2"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search consignments, suppliers, SKUs..." className="pl-9 h-9 text-sm"/></div></div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="cip-tabs-list flex flex-wrap gap-1">
          {["Consignment Dashboard","Consignee Inventory","Stock Locations","Financial Analytics","Aging & Expiry","Supplier Performance"].map((t,i)=>(<TabsTrigger key={i} value={String(i)} className="cip-tab text-xs">{t}</TabsTrigger>))}
        </TabsList>

      {tab==="0" && <>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{dashKPIs.map((k,i)=>(<Card key={i} className="cip-kpi-card"><CardContent className="p-3 flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${k.color}/10 ${k.color}/20`}><k.icon className={`h-5 w-5 ${k.color}`}/></div><div><div className="text-lg font-bold">{k.value}</div><div className="text-[10px] text-muted-foreground">{k.label}</div><div className={`text-[10px] font-medium ${k.change.startsWith("+")?"text-emerald-600":"text-red-600"}`}>{k.change}</div></div></CardContent></Card>))}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cip-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Monthly Consignment Value</CardTitle></CardHeader><CardContent><AreaChart data={monthlyValue}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Area type="monotone" dataKey="consignment" stroke={TH.violet} fill={TH.violet} fillOpacity={0.3}/><Area type="monotone" dataKey="returns" stroke={TH.rose} fill={TH.rose} fillOpacity={0.2}/><Area type="monotone" dataKey="savings" stroke={TH.emerald} fill={TH.emerald} fillOpacity={0.2}/></AreaChart></CardContent></Card>
          <Card className="cip-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Consignment Types</CardTitle></CardHeader><CardContent><PieChart><Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} label={({name,percent})=>`${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={9}>{typeData.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip contentStyle={{fontSize:11}}/></PieChart></CardContent></Card>
          <Card className="cip-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Top Suppliers</CardTitle></CardHeader><CardContent><BarChart data={supplierTop}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Bar dataKey="value" fill={TH.blue} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
          <Card className="cip-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Utilization & Turnover Trend</CardTitle></CardHeader><CardContent><LineChart data={utilizationTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Line type="monotone" dataKey="utilization" stroke={TH.cyan} strokeWidth={2}/><Line type="monotone" dataKey="turnover" stroke={TH.amber} strokeWidth={2}/></LineChart></CardContent></Card>
        </div>
      </>}

      {tab==="1" && <>
        <Card><CardContent className="p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="cip-table-header sticky top-0 bg-card"><tr><SortHeader label="ID" field="id"/><SortHeader label="Supplier" field="supplier"/><SortHeader label="Type" field="type"/><SortHeader label="Status" field="status"/><SortHeader label="Value" field="value"/><SortHeader label="Qty" field="qty"/><SortHeader label="Payment" field="paymentTerm"/><SortHeader label="Received" field="receivedPct"/></tr></thead><tbody>{fOwners.map(o=>(<tr key={o.id} className="cip-table-row border-b transition-colors hover:bg-muted/50 cursor-pointer" onClick={()=>setSelOwner(o)}><td className="px-3 py-2 text-xs font-mono font-medium">{o.id}</td><td className="px-3 py-2"><SupplierBadge name={o.supplier.split(" ")[0]}/></td><td className="px-3 py-2"><ConsignmentTypeBadge t={o.type}/></td><td className="px-3 py-2"><OwnerStatusBadge s={o.status}/></td><td className="px-3 py-2"><ValueTile value={o.value} label=""/></td><td className="px-3 py-2"><QtyBadge qty={o.qty} unit={o.unit}/></td><td className="px-3 py-2"><PaymentTermBadge t={o.paymentTerm}/></td><td className="px-3 py-2"><UtilizationBar value={o.receivedPct}/></td></tr>))}</tbody></table></div></CardContent></Card>
      </>}

      {tab==="2" && <>
        <Card><CardContent className="p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="cip-table-header sticky top-0 bg-card"><tr><SortHeader label="ID" field="id"/><SortHeader label="Product" field="product"/><SortHeader label="Status" field="status"/><SortHeader label="Warehouse" field="warehouse"/><SortHeader label="Aging" field="aging"/><SortHeader label="Expiry" field="expiryPct"/><SortHeader label="Turnover" field="turnover"/></tr></thead><tbody>{fSlocs.map(s=>(<tr key={s.id} className="cip-table-row border-b transition-colors hover:bg-muted/50"><td className="px-3 py-2 text-xs font-mono">{s.id}</td><td className="px-3 py-2 text-xs font-mono">{s.product}</td><td className="px-3 py-2"><SlocStatusBadge s={s.status}/></td><td className="px-3 py-2 text-xs">{s.warehouse}</td><td className="px-3 py-2"><AgingBadge days={s.aging}/></td><td className="px-3 py-2"><ExpiryBar pct={s.expiryPct}/></td><td className="px-3 py-2"><TurnoverBar value={s.turnover}/></td></tr>))}</tbody></table></div></CardContent></Card>
      </>}

      {tab==="3" && <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cip-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Expiring Stock (Top 8)</CardTitle></CardHeader><CardContent><BarChart layout="vertical" data={expiryData}><CartesianGrid strokeDasharray="3 3"/><XAxis type="number" domain={[0,100]} tick={{fontSize:10}} unit="%"/><YAxis dataKey="name" type="category" tick={{fontSize:9}} width={90}/><Tooltip contentStyle={{fontSize:11}}/><Bar dataKey="expiry" fill={TH.rose} radius={[0,4,4,0]}/><Bar dataKey="aging" fill={TH.amber} radius={[0,4,4,0]}/></BarChart></CardContent></Card>
          <Card className="cip-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Status Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={SLOC_STS.map((s,i)=>({name:s,value:ri(5,20,i*47+9)}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} label={({name,percent})=>`${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={9}>{SLOC_STS.map((_,i)=><Cell key={i} fill={PC[(i+3)%PC.length]}/>)}</Pie><Tooltip contentStyle={{fontSize:11}}/></PieChart></CardContent></Card>
        </div>
      </>}

      {tab==="4" && <>
        <Card><CardContent className="p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="cip-table-header sticky top-0 bg-card"><tr><SortHeader label="ID" field="id"/><SortHeader label="Supplier" field="supplier"/><SortHeader label="Type" field="type"/><SortHeader label="Total Value" field="totalValue"/><SortHeader label="Utilization" field="utilization"/><SortHeader label="Turnover" field="turnoverRate"/><SortHeader label="Quality" field="qualityScore"/><SortHeader label="Savings" field="costSavings"/></tr></thead><tbody>{fAnalytics.map(a=>(<tr key={a.id} className="cip-table-row border-b transition-colors hover:bg-muted/50"><td className="px-3 py-2 text-xs font-mono">{a.id}</td><td className="px-3 py-2"><SupplierBadge name={a.supplier.split(" ")[0]}/></td><td className="px-3 py-2"><ConsignmentTypeBadge t={a.type}/></td><td className="px-3 py-2 text-xs font-medium tabular-nums text-right">{fmtINR(a.totalValue)}</td><td className="px-3 py-2"><UtilizationBar value={a.utilization}/></td><td className="px-3 py-2"><TurnoverBar value={a.turnoverRate}/></td><td className="px-3 py-2 text-xs tabular-nums">{a.qualityScore}%</td><td className="px-3 py-2 text-xs font-medium tabular-nums text-right">{fmtINR(a.costSavings)}</td></tr>))}</tbody></table></div></CardContent></Card>
      </>}

      {tab==="5" && <>
        <Card><CardContent className="p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="cip-table-header sticky top-0 bg-card"><tr><SortHeader label="ID" field="id"/><SortHeader label="Supplier" field="supplier"/><SortHeader label="Type" field="type"/><SortHeader label="Value" field="totalValue"/><SortHeader label="Utilization" field="utilization"/><SortHeader label="Aged Items" field="agedCount"/><SortHeader label="Return Rate" field="returnRate"/><SortHeader label="Quality" field="qualityScore"/></tr></thead><tbody>{fAnalytics.map(a=>(<tr key={a.id} className="cip-table-row border-b transition-colors hover:bg-muted/50"><td className="px-3 py-2 text-xs font-mono">{a.id}</td><td className="px-3 py-2"><SupplierBadge name={a.supplier.split(" ")[0]}/></td><td className="px-3 py-2"><ConsignmentTypeBadge t={a.type}/></td><td className="px-3 py-2 text-xs font-medium tabular-nums text-right">{fmtINR(a.totalValue)}</td><td className="px-3 py-2"><UtilizationBar value={a.utilization}/></td><td className="px-3 py-2 text-xs tabular-nums">{a.agedCount}</td><td className="px-3 py-2 text-xs tabular-nums">{a.returnRate}%</td><td className="px-3 py-2 text-xs tabular-nums">{a.qualityScore}%</td></tr>))}</tbody></table></div></CardContent></Card>
      </>}
      </Tabs>

      <Sheet open={!!selOwner} onOpenChange={()=>setSelOwner(null)}>
        <SheetContent><SheetHeader><SheetTitle>Consignment Detail</SheetTitle></SheetHeader>{selOwner&&<div className="space-y-4 mt-4"><div className="grid grid-cols-2 gap-3"><div><div className="text-xs text-muted-foreground">ID</div><div className="text-sm font-mono font-medium">{selOwner.id}</div></div><div><div className="text-xs text-muted-foreground">Supplier</div><div className="text-sm">{selOwner.supplier}</div></div><div><div className="text-xs text-muted-foreground">Type</div><div className="text-sm"><ConsignmentTypeBadge t={selOwner.type}/></div></div><div><div className="text-xs text-muted-foreground">Status</div><div className="text-sm"><OwnerStatusBadge s={selOwner.status}/></div></div><div><div className="text-xs text-muted-foreground">Value</div><div className="text-sm font-medium">{fmtINR(selOwner.value)}</div></div><div><div className="text-xs text-muted-foreground">Quantity</div><div className="text-sm">{selOwner.qty.toLocaleString("en-IN")} {selOwner.unit}</div></div><div><div className="text-xs text-muted-foreground">Payment Term</div><div className="text-sm"><PaymentTermBadge t={selOwner.paymentTerm}/></div></div><div><div className="text-xs text-muted-foreground">Days Open</div><div className="text-sm">{selOwner.daysOpen}</div></div></div><div className="flex flex-wrap gap-2"><CityBadge city={selOwner.city}/><LinkBadge linked={selOwner.linkedPO}/><UtilizationBar value={selOwner.receivedPct}/></div></div>}</SheetContent>
      </Sheet>
    </div>
  )
}

export default ConsignmentInventoryProView
