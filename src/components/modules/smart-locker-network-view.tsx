"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BrainCircuit, BarChart3, MapPin, Lock, QrCode, Wifi,
  Package, Smartphone, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const LOCKER_TYPES = ["Standard","Large","Refrigerated","Frozen","Document","Hazardous","Oversized","Eco Green"] as const
const LT_EMOJI: Record<string,string> = {Standard:"\u{1f4e6}",Large:"\u{1f4e6}",Refrigerated:"\u2744\ufe0f",Frozen:"\u{1f9ca}",Document:"\u{1f4c4}",Hazardous:"\u2622\ufe0f",Oversized:"\u{1f3d7}\ufe0f","Eco Green":"\u267b\ufe0f"}
const LOCKER_STS = ["Available","Occupied","Maintenance","Reserved","Out of Service","Cleaning"] as const
const SIZES = ["S","M","L","XL"] as const
const CARRIERS = ["India Post","DTDC","Delhivery","BlueDart","Ekart","Shadowfax"] as const
const PARCEL_STS = ["Deposited","Awaiting Pickup","Picked Up","Overdue","Returned to Hub","Expired","Damaged","Misplaced"] as const
const PRIOS = ["Standard","Express","COD","Return"] as const
const ACT_TYPES = ["Deposit","Pickup","Return","Complaint","Rating","Verification","Reschedule","Extension"] as const
const METHODS = ["App","SMS","QR Scan","NFC Tap","OTP","Web","Kiosk"] as const
const MT_EMOJI: Record<string,string> = {App:"\u{1f4f1}",SMS:"\u{1f4f2}","QR Scan":"\u{1f4f0}","NFC Tap":"\u{1f4f7}",OTP:"\u{1f510}",Web:"\u{1f5a5}\ufe0f",Kiosk:"\u{1f3a8}"}
const EQUIP_TYPES = ["Electronic Lock","Camera","Temperature Sensor","LED Panel","Power Supply","Network Module","QR Scanner","Structural"] as const
const ET_EMOJI: Record<string,string> = {"Electronic Lock":"\u{1f512}",Camera:"\u{1f4f7}","Temperature Sensor":"\u{1f321}\ufe0f","LED Panel":"\u{1f4a1}","Power Supply":"\u{1f50b}","Network Module":"\u{1f4e1}","QR Scanner":"\u{1f4f0}",Structural:"\u{1f3d7}\ufe0f"}
const MAINT_STS = ["Healthy","Warning","Critical","Under Repair","Scheduled","Decommissioned"] as const
const CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad"] as const
const FREQS = ["First-time","Regular","Frequent","VIP"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {indigo:"#6366f1",blue:"#3b82f6",emerald:"#059669",amber:"#d97706",violet:"#7c3aed",rose:"#e11d48"}
const PC = [TH.indigo,TH.blue,TH.emerald,TH.amber,TH.violet,TH.rose,"#0891b2","#f97316"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function fmtINR(n: number): string { const s = n < 0 ? "-" : ""; const a = Math.abs(n); if (a >= 1e7) return `\u20b9${s}${(a / 1e7).toFixed(2)} Cr`; if (a >= 1e5) return `\u20b9${s}${(a / 1e5).toFixed(2)} L`; return `\u20b9${s}${a.toLocaleString("en-IN")}` }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 16 Visual Components */
function LockerTypeBadge({ type }: { type: string }) {
  const cl: Record<string,string> = {Standard:"bg-indigo-100 text-indigo-800",Large:"bg-blue-100 text-blue-800",Refrigerated:"bg-cyan-100 text-cyan-800",Frozen:"bg-sky-100 text-sky-800",Document:"bg-amber-100 text-amber-800",Hazardous:"bg-rose-100 text-rose-800",Oversized:"bg-violet-100 text-violet-800","Eco Green":"bg-emerald-100 text-emerald-800"}
  return <span className={`sln-lt-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[type]||"bg-gray-100"}`}>{LT_EMOJI[type]} {type}</span>
}
function LockerStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Available:"bg-emerald-100 text-emerald-700",Occupied:"bg-blue-100 text-blue-700",Maintenance:"bg-amber-100 text-amber-700",Reserved:"bg-violet-100 text-violet-700","Out of Service":"bg-red-100 text-red-700",Cleaning:"bg-cyan-100 text-cyan-700"}
  return <span className={`sln-ls-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||""} ${status==="Occupied"?"animate-pulse":""}`}>\u25cf {status}</span>
}
function SizeBadge({ size }: { size: string }) {
  const cl: Record<string,string> = {S:"bg-gray-100 text-gray-600",M:"bg-blue-100 text-blue-700",L:"bg-indigo-100 text-indigo-700",XL:"bg-violet-100 text-violet-700"}
  return <span className={`sln-size inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${cl[size]||"bg-gray-100"}`}>{size}</span>
}
function OccupancyBar({ value }: { value: number }) {
  const c = value > 90 ? "bg-red-500" : value > 75 ? "bg-amber-500" : value > 50 ? "bg-blue-500" : "bg-emerald-500"
  return <div className="sln-occ-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${c}`} style={{ width: `${Math.min(value,100)}%` }}/></div>
}
function LEDIndicator({ status }: { status: string }) {
  const c: Record<string,string> = {Available:"bg-emerald-500 shadow-emerald-400/50",Occupied:"bg-blue-500 shadow-blue-400/50",Maintenance:"bg-amber-500 shadow-amber-400/50","Out of Service":"bg-red-500 shadow-red-400/50",Reserved:"bg-violet-500 shadow-violet-400/50",Cleaning:"bg-cyan-500 shadow-cyan-400/50"}
  return <span className={`sln-led inline-block w-2.5 h-2.5 rounded-full shadow-sm ${c[status]||"bg-gray-400"}`}/>
}
function CarrierBadge({ name }: { name: string }) {
  const cl: Record<string,string> = {"India Post":"bg-orange-100 text-orange-700",DTDC:"bg-red-100 text-red-700",Delhivery:"bg-blue-100 text-blue-700",BlueDart:"bg-indigo-100 text-indigo-700",Ekart:"bg-yellow-100 text-yellow-800",Shadowfax:"bg-emerald-100 text-emerald-700"}
  return <span className={`sln-carrier inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[name]||"bg-gray-100"}`}>{name}</span>
}
function ParcelStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Deposited:"bg-blue-100 text-blue-700","Awaiting Pickup":"bg-amber-100 text-amber-700","Picked Up":"bg-emerald-100 text-emerald-700",Overdue:"bg-red-100 text-red-700","Returned to Hub":"bg-violet-100 text-violet-700",Expired:"bg-gray-100 text-gray-500",Damaged:"bg-rose-100 text-rose-700",Misplaced:"bg-orange-100 text-orange-700"}
  return <span className={`sln-ps-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||""} ${status==="Awaiting Pickup"?"animate-pulse":""}`}>\u25cf {status}</span>
}
function PriorityBadge({ prio }: { prio: string }) {
  const cl: Record<string,string> = {Standard:"bg-gray-100 text-gray-600",Express:"bg-indigo-100 text-indigo-700",COD:"bg-amber-100 text-amber-700",Return:"bg-rose-100 text-rose-700"}
  return <span className={`sln-prio inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${cl[prio]||"bg-gray-100"}`}>{prio}</span>
}
function DwellTimeTile({ hrs }: { hrs: number }) {
  const c = hrs > 48 ? "text-red-600" : hrs > 24 ? "text-amber-600" : "text-emerald-600"
  return <span className={`sln-dwell inline-flex items-center gap-1 text-[10px] font-medium ${c}`}><Clock className="h-3 w-3"/>{hrs.toFixed(1)}h</span>
}
function ActivityTypeBadge({ type }: { type: string }) {
  const cl: Record<string,string> = {Deposit:"bg-emerald-100 text-emerald-700",Pickup:"bg-blue-100 text-blue-700",Return:"bg-rose-100 text-rose-700",Complaint:"bg-red-100 text-red-700",Rating:"bg-amber-100 text-amber-700",Verification:"bg-indigo-100 text-indigo-700",Reschedule:"bg-violet-100 text-violet-700",Extension:"bg-cyan-100 text-cyan-700"}
  return <span className={`sln-act-type inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[type]||"bg-gray-100"}`}>{type}</span>
}
function MethodBadge({ method }: { method: string }) {
  return <span className="sln-method inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700">{MT_EMOJI[method]} {method}</span>
}
function FrequencyBadge({ freq }: { freq: string }) {
  const cl: Record<string,string> = {"First-time":"bg-gray-100 text-gray-600",Regular:"bg-blue-100 text-blue-700",Frequent:"bg-indigo-100 text-indigo-700",VIP:"bg-amber-100 text-amber-700"}
  return <span className={`sln-freq inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${cl[freq]||"bg-gray-100"}`}>{freq}</span>
}
function StarRating({ rating }: { rating: number }) {
  return <span className="sln-stars inline-flex gap-0.5">{Array.from({length:5},(_, i) => <span key={i} className={i < rating ? "text-amber-400" : "text-gray-300"}>\u2605</span>)}</span>
}
function EquipmentTypeBadge({ type }: { type: string }) {
  return <span className="sln-equip-type inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">{ET_EMOJI[type]} {type}</span>
}
function HealthScoreBar({ score }: { score: number }) {
  const c = score > 80 ? "bg-emerald-500" : score > 60 ? "bg-blue-500" : score > 40 ? "bg-amber-500" : "bg-red-500"
  return <div className="sln-health-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${c}`} style={{ width: `${Math.min(score,100)}%` }}/></div>
}
function CODAmountTile({ amount }: { amount: number }) {
  return <span className="sln-cod inline-flex items-center gap-1 text-[10px] font-medium text-gray-700"><IndianRupee className="h-3 w-3"/>{fmtINR(amount)}</span>
}

/* Data Generation */
function generateData() {
  const lockers = Array.from({length:75},(_, i)=>{
    const occ = ri(0,100,i*3+1)
    const st = LOCKER_STS[ri(0,5,i*3+2)]
    return {id:`LKR-${String(1001+i).padStart(4,"0")}`,type:LOCKER_TYPES[ri(0,7,i*3)],status:st,size:SIZES[ri(0,3,i*3+4)],occupancy:occ,city:CITIES[ri(0,7,i*3+5)],lastService:`${ri(1,28,i*3+6)}/${ri(1,12,i*3+7)}`,codeType:["QR","PIN","OTP","NFC"][ri(0,3,i*3+8)]}
  })
  const parcels = Array.from({length:70},(_, i)=>{
    const dwell = ri(1,72,i*4+1)
    return {id:`PAR-${String(2001+i).padStart(4,"0")}`,status:PARCEL_STS[ri(0,7,i*4)],carrier:CARRIERS[ri(0,5,i*4+1)],dwellTime:dwell,lockerId:`LKR-${String(ri(1001,1075,i*4+2)).padStart(4,"0")}`,customer:`Customer ${i+1}`,codAmount:ri(0,5000,i*4+3)*10,priority:PRIOS[ri(0,3,i*4+4)],deadline:`${ri(1,48,i*4+5)}h`}
  })
  const customers = Array.from({length:55},(_, i)=>{
    return {id:`CUS-${String(3001+i).padStart(4,"0")}`,activity:ACT_TYPES[ri(0,7,i*5)],method:METHODS[ri(0,6,i*5+1)],rating:ri(1,5,i*5+2),frequency:FREQS[ri(0,3,i*5+3)],city:CITIES[ri(0,7,i*5+4)],responseTime:`${ri(5,120,i*5+5)}min`}
  })
  const maintenance = Array.from({length:65},(_, i)=>{
    const score = ri(15,100,i*6+1)
    return {id:`MNT-${String(4001+i).padStart(4,"0")}`,type:EQUIP_TYPES[ri(0,7,i*6)],status:MAINT_STS[ri(0,5,i*6+1)],healthScore:score,nextDate:`${ri(1,30,i*6+2)}/${ri(1,12,i*6+3)}`,lastIncident:ri(0,30,i*6+4)>20?`Day -${ri(1,30,i*6+4)}`:"None",cost:ri(500,25000,i*6+5)*10,sla:ri(85,100,i*6+6)}
  })
  const kpiData = [
    {label:"Total Lockers",value:"1,200",icon:Box,color:TH.indigo,trend:"+12"},
    {label:"Active Lockers",value:"1,085",icon:Lock,color:TH.blue,trend:"+8"},
    {label:"Occupancy Rate",value:"78.5%",icon:Activity,color:TH.emerald,trend:"+3.2%"},
    {label:"Daily Parcels",value:"2,450",icon:Package,color:TH.amber,trend:"+156"},
    {label:"Revenue Today",value:fmtINR(184500),icon:IndianRupee,color:TH.violet,trend:"+15%"},
    {label:"Avg Dwell Time",value:"18.4h",icon:Clock,color:TH.rose,trend:"-2.1h"},
    {label:"Failed Pickups",value:"23",icon:XCircle,color:"#0891b2",trend:"-5"},
    {label:"Satisfaction",value:"4.6\u2605",icon:Star,color:"#f97316",trend:"+0.2"},
  ]
  const parcelVol = MO.map((m,i)=>({month:m,Standard:ri(400,800,i*11+1),Express:ri(150,400,i*11+2),Return:ri(50,150,i*11+3)}))
  const typePie = LOCKER_TYPES.map((t,i)=>({name:t,value:ri(80,200,i*13+1)}))
  const zoneUtil = CITIES.map((c,i)=>({zone:c,utilization:ri(50,98,i*17+1)}))
  const revenueTrend = MO.map((m,i)=>({month:m,revenue:ri(800000,2500000,i*19+1)}))
  const cityUtil = CITIES.map((c,i)=>({city:c,utilization:ri(45,95,i*23+1)}))
  const carrierPie = CARRIERS.map((c,i)=>({name:c,value:ri(100,500,i*29+1)}))
  const dwellDist = Array.from({length:24},(_, i)=>({hour:`${String(i).padStart(2,"0")}:00`,deposits:ri(10,80,i*31+1),pickups:ri(10,80,i*31+2)}))
  return {lockers,parcels,customers,maintenance,kpiData,parcelVol,typePie,zoneUtil,revenueTrend,cityUtil,carrierPie,dwellDist}
}

export default function SmartLockerNetworkView() {
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Record<string,unknown>|null>(null)
  const { toast } = useToast()
  const data = useMemo(()=>generateData(),[])
  const openSheet = (row: Record<string,unknown>) => { setSelectedRow(row); setSheetOpen(true) }

  const filtered = useMemo(()=>{
    const tab = parseInt(activeTab)
    const src = tab===1?data.lockers:tab===2?data.parcels:tab===3?data.customers:tab===4?data.maintenance:[]
    return sortedData(filterData(src as unknown as Record<string,string|number>[],searchQ) as unknown as Record<string,string|number>[],sortField,sortDir)
  },[activeTab,searchQ,sortField,sortDir,data])

  const toggleSort = (f:string) => { if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortField(f); setSortDir("asc") } }

  return (
    <div className="space-y-4">
      <PageHeader title="Smart Locker Network" description="Real-time monitoring and management of automated parcel locker ecosystem across India" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="sln-tabs-list">
          {["Network Dashboard","Locker Inventory","Parcel Operations","Customer Activity","Maintenance & Health","Network Analytics"].map((t,i)=>(
            <TabsTrigger key={i} value={String(i)} className="sln-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {activeTab==="0" && (
        <div className="space-y-4">
          <div className="sln-kpi-grid grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.kpiData.map((k,i)=>(
              <Card key={i} className="inner-glow hover-lift-sm glass-subtle sln-kpi-card"><CardContent className="p-3"><div className="flex items-center gap-2">{typeof k.icon === 'string' ? <span className="text-sm">{k.icon}</span> : <k.icon className="h-4 w-4" style={{color:k.color}}/>}<span className="text-[10px] text-gray-500">{k.label}</span></div><p className="text-lg font-bold mt-1">{k.value}</p><span className="text-[10px] text-emerald-600">{k.trend}</span></CardContent></Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover-lift-sm sln-chart-card col-span-1"><CardHeader className="pb-1"><CardTitle className="text-xs">Daily Parcel Volume</CardTitle></CardHeader><CardContent><AreaChart data={data.parcelVol}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Area type="monotone" dataKey="Standard" stackId="1" stroke={TH.blue} fill="rgba(59,130,246,0.3)"/><Area type="monotone" dataKey="Express" stackId="1" stroke={TH.indigo} fill="rgba(99,102,241,0.3)"/><Area type="monotone" dataKey="Return" stackId="1" stroke={TH.rose} fill="rgba(225,29,72,0.3)"/></AreaChart></CardContent></Card>
            <Card className="hover-lift-sm sln-chart-card col-span-1"><CardHeader className="pb-1"><CardTitle className="text-xs">Locker Types</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.typePie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" label={false}>{data.typePie.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
            <Card className="hover-lift-sm sln-chart-card col-span-1"><CardHeader className="pb-1"><CardTitle className="text-xs">Zone Utilization</CardTitle></CardHeader><CardContent><BarChart data={data.zoneUtil}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="zone" tick={{fontSize:9}} angle={-45}/><YAxis tick={{fontSize:10}}/><Tooltip/><Bar dataKey="utilization" fill={TH.indigo} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
          </div>
        </div>
      )}

      {activeTab!=="0" && activeTab!=="5" && (
        <div className="space-y-3">
          <div className="flex gap-2 items-center"><Search className="h-4 w-4 text-gray-400"/><Input placeholder="Search..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} className="max-w-xs h-8 text-xs"/></div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-[11px]">
              <thead><tr className="bg-gray-50">
                {activeTab==="1" && <>
                  <th className="sln-sort-header p-2 text-left cursor-pointer" onClick={()=>toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline"/></th>
                  <th className="sln-sort-header p-2 text-left">Type</th><th className="sln-sort-header p-2 text-left">Status</th><th className="sln-sort-header p-2 text-left">Size</th><th className="sln-sort-header p-2 text-left">LED</th><th className="sln-sort-header p-2 text-left">Occupancy</th><th className="sln-sort-header p-2 text-left">City</th><th className="sln-sort-header p-2 text-left">Code</th>
                </>}
                {activeTab==="2" && <>
                  <th className="sln-sort-header p-2 text-left cursor-pointer" onClick={()=>toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline"/></th>
                  <th className="sln-sort-header p-2 text-left">Status</th><th className="sln-sort-header p-2 text-left">Carrier</th><th className="sln-sort-header p-2 text-left">Priority</th><th className="sln-sort-header p-2 text-left">Locker</th><th className="sln-sort-header p-2 text-left">Dwell</th><th className="sln-sort-header p-2 text-left">COD</th><th className="sln-sort-header p-2 text-left">Deadline</th>
                </>}
                {activeTab==="3" && <>
                  <th className="sln-sort-header p-2 text-left cursor-pointer" onClick={()=>toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline"/></th>
                  <th className="sln-sort-header p-2 text-left">Activity</th><th className="sln-sort-header p-2 text-left">Method</th><th className="sln-sort-header p-2 text-left">Rating</th><th className="sln-sort-header p-2 text-left">Frequency</th><th className="sln-sort-header p-2 text-left">City</th><th className="sln-sort-header p-2 text-left">Response</th>
                </>}
                {activeTab==="4" && <>
                  <th className="sln-sort-header p-2 text-left cursor-pointer" onClick={()=>toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline"/></th>
                  <th className="sln-sort-header p-2 text-left">Equipment</th><th className="sln-sort-header p-2 text-left">Status</th><th className="sln-sort-header p-2 text-left">Health</th><th className="sln-sort-header p-2 text-left">Next Service</th><th className="sln-sort-header p-2 text-left">Last Incident</th><th className="sln-sort-header p-2 text-left">Cost</th><th className="sln-sort-header p-2 text-left">SLA</th>
                </>}
                <th className="p-2">Action</th>
              </tr></thead>
              <tbody>
                {filtered.map((row,i)=>{
                  const r = row as unknown as Record<string,string|number>
                  return <tr key={i} className="sln-table-row border-t cursor-pointer hover:bg-indigo-50/50" onClick={()=>openSheet(row)}>
                    {activeTab==="1" && <>
                      <td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><LockerTypeBadge type={String(r.type)}/></td><td className="p-2"><LockerStatusBadge status={String(r.status)}/></td><td className="p-2"><SizeBadge size={String(r.size)}/></td><td className="p-2"><LEDIndicator status={String(r.status)}/></td><td className="p-2 w-20"><OccupancyBar value={Number(r.occupancy)}/><span className="text-[9px] ml-1">{r.occupancy}%</span></td><td className="p-2">{String(r.city)}</td><td className="p-2 text-[10px]">{String(r.codeType)}</td>
                    </>}
                    {activeTab==="2" && <>
                      <td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><ParcelStatusBadge status={String(r.status)}/></td><td className="p-2"><CarrierBadge name={String(r.carrier)}/></td><td className="p-2"><PriorityBadge prio={String(r.priority)}/></td><td className="p-2 font-mono text-[10px]">{String(r.lockerId)}</td><td className="p-2"><DwellTimeTile hrs={Number(r.dwellTime)}/></td><td className="p-2"><CODAmountTile amount={Number(r.codAmount)}/></td><td className="p-2 text-[10px]">{String(r.deadline)}</td>
                    </>}
                    {activeTab==="3" && <>
                      <td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><ActivityTypeBadge type={String(r.activity)}/></td><td className="p-2"><MethodBadge method={String(r.method)}/></td><td className="p-2"><StarRating rating={Number(r.rating)}/></td><td className="p-2"><FrequencyBadge freq={String(r.frequency)}/></td><td className="p-2">{String(r.city)}</td><td className="p-2 text-[10px]">{String(r.responseTime)}</td>
                    </>}
                    {activeTab==="4" && <>
                      <td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><EquipmentTypeBadge type={String(r.type)}/></td><td className="p-2"><LockerStatusBadge status={String(r.status)}/></td><td className="p-2 w-20"><HealthScoreBar score={Number(r.healthScore)}/><span className="text-[9px] ml-1">{r.healthScore}%</span></td><td className="p-2 text-[10px]">{String(r.nextDate)}</td><td className="p-2 text-[10px]">{String(r.lastIncident)}</td><td className="p-2 text-[10px]">{fmtINR(Number(r.cost))}</td><td className="p-2 text-[10px]">{r.sla}%</td>
                    </>}
                    <td className="p-2"><Eye className="h-3.5 w-3.5 text-gray-400 hover:text-indigo-600"/></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab==="5" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover-lift-sm sln-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Revenue Trend</CardTitle></CardHeader><CardContent><LineChart data={data.revenueTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Line type="monotone" dataKey="revenue" stroke={TH.indigo} strokeWidth={2} dot={{r:3}}/></LineChart></CardContent></Card>
          <Card className="hover-lift-sm sln-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">City Utilization</CardTitle></CardHeader><CardContent><BarChart data={data.cityUtil} layout="vertical"><CartesianGrid strokeDasharray="3 3"/><XAxis type="number" tick={{fontSize:10}}/><YAxis dataKey="city" type="category" tick={{fontSize:9}} width={80}/><Tooltip/><Bar dataKey="utilization" fill={TH.blue} radius={[0,4,4,0]}/></BarChart></CardContent></Card>
          <Card className="hover-lift-sm sln-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Carrier Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.carrierPie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" label={false}>{data.carrierPie.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
          <Card className="hover-lift-sm sln-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Dwell Time Pattern</CardTitle></CardHeader><CardContent><AreaChart data={data.dwellDist}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="hour" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Area type="monotone" dataKey="deposits" stroke={TH.emerald} fill="rgba(5,150,105,0.2)"/><Area type="monotone" dataKey="pickups" stroke={TH.blue} fill="rgba(59,130,246,0.2)"/></AreaChart></CardContent></Card>
        </div>
      )}

      <Sheet open={!!(sheetOpen && selectedRow)} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <div className="sln-sheet-header bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-lg">
              <SheetTitle className="text-white text-sm">{String(selectedRow?.id || "Details")}</SheetTitle>
            </div>
          </SheetHeader>
          {selectedRow && Object.entries(selectedRow).filter(([k])=>k!=="id").map(([key,val])=>(
            <div key={key} className="sln-detail-item flex justify-between py-2 px-2 border-b border-gray-100 text-xs"><span className="text-gray-500 capitalize">{key}</span><span className="font-medium">{String(val)}</span></div>
          ))}
        </SheetContent>
      </Sheet>
    </div>
  )
}
