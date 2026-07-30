"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BrainCircuit, BarChart3, MapPin, Package, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star, Bot, Battery, Wifi, Route, BatteryCharging, Wrench, Settings, Radio, Gauge, ThermometerSun,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ROBOT_TYPES = ["Picking AMR","Sorting AMR","Heavy Payload AGV","Collaborative Robot","Forklift AGV","Conveyor Bot","Delivery Bot","Inspection Drone"] as const
const RT_EMOJI: Record<string,string> = {["Picking AMR"]:"📦",["Sorting AMR"]:"🔄",["Heavy Payload AGV"]:"🏋️",["Collaborative Robot"]:"🤖",["Forklift AGV"]:"🏗️",["Conveyor Bot"]:"⚙️",["Delivery Bot"]:"🚀",["Inspection Drone"]:"📡"}
const ROBOT_STS = ["Active","Charging","Idle","Maintenance","Error","Returning to Base","Updating","Decommissioned"] as const
const ZONES = ["Zone A - Receiving","Zone B - Putaway","Zone C - Picking","Zone D - Packing","Zone E - Shipping","Zone F - Cold Storage","Zone G - Returns","Zone H - Bulk Storage"] as const
const TASK_TYPES = ["Pick","Place","Transport","Sort","Count","Replenish","Charge","Return"] as const
const TASK_STS = ["Assigned","In Progress","Completed","Failed","Cancelled","Paused"] as const
const ALERT_TYPES = ["Low Battery","Path Blocked","Obstacle Detected","Connection Lost","Overheating","Task Timeout","Sensor Error","Charging Failed"] as const
const ALERT_SEVS = ["Critical","High","Medium","Low"] as const
const MAINT_TYPES = ["Battery Replacement","Sensor Calibration","Wheel Maintenance","Software Update","Motor Repair","Cleaning","Safety Check","Firmware Upgrade"] as const
const FLEET_CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {cyan:"#0891b2",blue:"#3b82f6",emerald:"#059669",amber:"#d97706",violet:"#7c3aed",rose:"#e11d48"}
const PC = [TH.cyan,TH.blue,TH.emerald,TH.amber,TH.violet,TH.rose,"#f97316","#8b5cf6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.abs(s) % arr.length] }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 16 Visual Components */
function RobotTypeBadge({ type }: { type: string }) {
  const cl: Record<string,string> = {["Picking AMR"]:"bg-cyan-100 text-cyan-700",["Sorting AMR"]:"bg-blue-100 text-blue-700",["Heavy Payload AGV"]:"bg-amber-100 text-amber-700",["Collaborative Robot"]:"bg-violet-100 text-violet-700",["Forklift AGV"]:"bg-emerald-100 text-emerald-700",["Conveyor Bot"]:"bg-rose-100 text-rose-700",["Delivery Bot"]:"bg-orange-100 text-orange-700",["Inspection Drone"]:"bg-indigo-100 text-indigo-700"}
  return <span className={`amr-rt-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[type]||"bg-gray-100"}`}>{RT_EMOJI[type]} {type}</span>
}
function RobotStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Active:"bg-emerald-100 text-emerald-700",Charging:"bg-amber-100 text-amber-700",Idle:"bg-slate-100 text-slate-600",Maintenance:"bg-blue-100 text-blue-700",Error:"bg-red-100 text-red-700","Returning to Base":"bg-cyan-100 text-cyan-700",Updating:"bg-violet-100 text-violet-700",Decommissioned:"bg-gray-100 text-gray-500"}
  const pulse = status==="Active"||status==="Error"||status==="Charging" ? "animate-pulse" : ""
  return <span className={`amr-rs-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||"bg-gray-100"} ${pulse}`}>● {status}</span>
}
function ZoneBadge({ zone }: { zone: string }) {
  const code = zone.split(" - ")[0]
  return <span className="amr-zone inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">📍 {code}</span>
}
function BatteryBar({ value }: { value: number }) {
  const c = value > 80 ? "bg-emerald-500" : value > 60 ? "bg-blue-500" : value > 40 ? "bg-amber-500" : value > 20 ? "bg-orange-500" : "bg-red-500"
  const icon = value <= 20 ? <BatteryCharging className="h-3 w-3 text-red-500" /> : <Battery className="h-3 w-3" />
  return <div className="amr-batt-bar flex items-center gap-2">{icon}<div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={`h-full rounded-full transition-all ${c}`} style={{width:`${Math.min(value,100)}%`}}/></div><span className="text-[10px] font-medium tabular-nums">{value}%</span></div>
}
function UptimeTile({ value, label }: { value: number; label: string }) {
  const c = value >= 95 ? "text-emerald-600 dark:text-emerald-400" : value >= 85 ? "text-blue-600 dark:text-blue-400" : value >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  return <div className="amr-uptime text-right"><div className={`text-sm font-bold tabular-nums ${c}`}>{value}%</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}
function TaskTypeBadge({ t }: { t: string }) {
  const cl: Record<string,string> = {Pick:"bg-emerald-100 text-emerald-700",Place:"bg-blue-100 text-blue-700",Transport:"bg-cyan-100 text-cyan-700",Sort:"bg-violet-100 text-violet-700",Count:"bg-amber-100 text-amber-700",Replenish:"bg-rose-100 text-rose-700",Charge:"bg-orange-100 text-orange-700",Return:"bg-slate-100 text-slate-600"}
  return <span className={`amr-tt-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[t]||"bg-gray-100"}`}>{t}</span>
}
function TaskStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Assigned:"bg-blue-100 text-blue-700","In Progress":"bg-amber-100 text-amber-700 animate-pulse",Completed:"bg-emerald-100 text-emerald-700",Failed:"bg-red-100 text-red-700",Cancelled:"bg-gray-100 text-gray-500",Paused:"bg-violet-100 text-violet-700"}
  return <span className={`amr-ts-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[s]||"bg-gray-100"}`}>● {s}</span>
}
function AlertTypeBadge({ t }: { t: string }) {
  return <span className="amr-at-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">⚠ {t}</span>
}
function AlertSeverityBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Critical:"bg-red-100 text-red-700 shadow-[0_0_8px_oklch(0.55_0.22_25/0.3)]",High:"bg-orange-100 text-orange-700",Medium:"bg-amber-100 text-amber-700",Low:"bg-blue-100 text-blue-700"}
  return <span className={`amr-as-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${cl[s]||"bg-gray-100"}`}>{s === "Critical" ? "🔴" : s === "High" ? "🟠" : s === "Medium" ? "🟡" : "🔵"} {s}</span>
}
function MaintTypeBadge({ t }: { t: string }) {
  return <span className="amr-mt-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">🔧 {t}</span>
}
function CityBadge({ city }: { city: string }) {
  return <span className="amr-city inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">📍 {city}</span>
}
function SpeedTile({ value, label }: { value: number; label: string }) {
  return <div className="amr-speed text-right"><div className="text-sm font-bold tabular-nums text-cyan-600 dark:text-cyan-400">{value} m/s</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}
function LoadBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  const c = pct > 90 ? "bg-red-500" : pct > 75 ? "bg-amber-500" : pct > 50 ? "bg-blue-500" : "bg-emerald-500"
  return <div className="amr-load-bar flex items-center gap-2"><div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className={`h-full rounded-full transition-all ${c}`} style={{width:`${pct}%`}}/></div><span className="text-[10px] font-medium tabular-nums">{value}/{max} kg</span></div>
}
function SignalBadge({ strength }: { strength: number }) {
  const bars = strength >= 80 ? 4 : strength >= 60 ? 3 : strength >= 40 ? 2 : 1
  const color = strength >= 80 ? "text-emerald-500" : strength >= 60 ? "text-blue-500" : strength >= 40 ? "text-amber-500" : "text-red-500"
  return <span className={`amr-signal inline-flex items-end gap-0.5 ${color}`}><Wifi className="h-3 w-3"/>{Array.from({length:4},(_,i)=><div key={i} className={`w-0.5 rounded-full ${i<bars?"bg-current":"bg-gray-300 dark:bg-gray-600"}`} style={{height:`${4+i*2}px`}}/>)}</span>
}
function EfficiencyRing({ value }: { value: number }) {
  const c = value >= 90 ? "text-emerald-500" : value >= 75 ? "text-blue-500" : value >= 60 ? "text-amber-500" : "text-red-500"
  return <div className="amr-eff inline-flex items-center gap-1"><Gauge className={`h-3 w-3 ${c}`}/><span className={`text-[10px] font-bold tabular-nums ${c}`}>{value}%</span></div>
}

const INDIAN_WAREHOUSES = ["WH-Mumbai-01","WH-Delhi-02","WH-BLR-03","WH-CHN-04","WH-HYD-05","WH-KOL-06","WH-PUNE-07","WH-AHD-08"]

function generateRobots() { return Array.from({length:75},(_,i)=>{ const s=i*137+42; const status=pick(ROBOT_STS,s); return {id:`AMR-${String(i+1).padStart(4,"0")}`,type:pick(ROBOT_TYPES,s+1),status,zone:pick(ZONES,s+2),battery:ri(5,100,s+3),uptime:ri(70,99,s+4),speed:ri(1,5,s+5)/10,load:ri(0,500,s+6),maxLoad:ri(200,1000,s+7),signal:ri(20,100,s+8),tasksCompleted:ri(50,2000,s+9),warehouse:pick(INDIAN_WAREHOUSES,s+10),lastSeen:`2024-${String(ri(1,12,s+11)).padStart(2,"0")}-${String(ri(1,28,s+12)).padStart(2,"0")} ${String(ri(0,23,s+13)).padStart(2,"0")}:${String(ri(0,59,s+14)).padStart(2,"0")}`,firmware:`v${ri(1,5,s+15)}.${ri(0,9,s+16)}.${ri(0,99,s+17)}`} })}

function generateTasks() { return Array.from({length:70},(_,i)=>{ const s=i*211+88; const status=pick(TASK_STS,s); return {id:`TSK-${String(i+1).padStart(4,"0")}`,robotId:`AMR-${String(ri(1,75,s)).padStart(4,"0")}`,type:pick(TASK_TYPES,s+1),status,priority:pick(["High","Medium","Low"],s+2),zone:pick(ZONES,s+3),duration:ri(1,120,s+4),startedAt:`2024-${String(ri(1,12,s+5)).padStart(2,"0")}-${String(ri(1,28,s+6)).padStart(2,"0")} ${String(ri(0,23,s+7)).padStart(2,"0")}:${String(ri(0,59,s+8)).padStart(2,"0")}`,items:ri(1,50,s+9)} })}

function generateAlerts() { return Array.from({length:55},(_,i)=>{ const s=i*317+66; return {id:`ALT-${String(i+1).padStart(4,"0")}`,robotId:`AMR-${String(ri(1,75,s)).padStart(4,"0")}`,type:pick(ALERT_TYPES,s+1),severity:pick(ALERT_SEVS,s+2),message:pick(["Battery below 15%","Path blocked by pallet","Unknown obstacle detected","WiFi signal lost","Motor temperature high","Task exceeded 10min timeout","Lidar sensor error","Charging station fault"],s+3),resolved:pick([true,false,true,true,false],s+4),warehouse:pick(INDIAN_WAREHOUSES,s+5),timestamp:`2024-${String(ri(1,12,s+6)).padStart(2,"0")}-${String(ri(1,28,s+7)).padStart(2,"0")} ${String(ri(0,23,s+8)).padStart(2,"0")}:${String(ri(0,59,s+9)).padStart(2,"0")}`} })}

function generateMaintenance() { return Array.from({length:65},(_,i)=>{ const s=i*431+55; return {id:`MNT-${String(i+1).padStart(4,"0")}`,robotId:`AMR-${String(ri(1,75,s)).padStart(4,"0")}`,type:pick(MAINT_TYPES,s+1),status:pick(["Scheduled","In Progress","Completed","Overdue"],s+2),technician:pick(["Raj Kumar","Priya Sharma","Amit Patel","Sneha Iyer","Vikram Singh","Meera Nair"],s+3),cost:ri(500,25000,s+4),duration:ri(30,480,s+5),scheduledDate:`2024-${String(ri(1,12,s+6)).padStart(2,"0")}-${String(ri(1,28,s+7)).padStart(2,"0")}`} })}

export function AutonomousMobileRobotsFleetView() {
  const [tab, setTab] = useState("0")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc")
  const [selRobot, setSelRobot] = useState<any>(null)

  const robots = useMemo(()=>generateRobots(),[])
  const tasks = useMemo(()=>generateTasks(),[])
  const alerts = useMemo(()=>generateAlerts(),[])
  const maintenance = useMemo(()=>generateMaintenance(),[])

  const dashKPIs = [
    {label:"Total Robots",value:robots.length,icon:Bot,color:"text-cyan-600",change:"+5"},
    {label:"Active Now",value:robots.filter(r=>r.status==="Active").length,icon:Activity,color:"text-emerald-600",change:"+3"},
    {label:"Charging",value:robots.filter(r=>r.status==="Charging").length,icon:BatteryCharging,color:"text-amber-600",change:"-2"},
    {label:"Errors",value:robots.filter(r=>r.status==="Error").length,icon:AlertTriangle,color:"text-red-600",change:"+1"},
    {label:"Fleet Uptime",value:"94%",icon:TrendingUp,color:"text-emerald-600",change:"+1.5%"},
    {label:"Tasks Today",value:tasks.filter(t=>t.status==="Completed").length,icon:Package,color:"text-blue-600",change:"+12%"},
    {label:"Avg Battery",value:"68%",icon:Battery,color:"text-amber-600",change:"-3%"},
    {label:"Alerts",value:alerts.filter(a=>!a.resolved).length,icon:Radio,color:"text-rose-600",change:"-4"},
  ]

  const hourlyTasks = Array.from({length:12},(_,i)=>({hour:`${(i*2).toString().padStart(2,"0")}:00`,pick:ri(20,80,i*73+11),place:ri(15,60,i*53+7),transport:ri(10,40,i*37+3)}))
  const typeData = ROBOT_TYPES.map((t,i)=>({name:t,value:ri(5,15,i*41+7)}))
  const zoneData = ZONES.map((z,i)=>({name:z.split(" - ")[0],robots:ri(5,15,i*61+13)}))
  const alertTypeData = ALERT_TYPES.map((t,i)=>({name:t,value:ri(2,15,i*29+5)}))
  const efficiencyTrend = MO.map((m,i)=>({month:m,efficiency:ri(85,98,i*67+3),uptime:ri(90,99,i*43+7)}))
  const maintCostData = MO.map((m,i)=>({month:m,cost:ri(5000,30000,i*71+11)}))

  const handleSort = (f: string) => { if(f===sortField) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortField(f); setSortDir("asc") } }
  const fRobots = sortedData(filterData(robots,search),sortField,sortDir)
  const fTasks = sortedData(filterData(tasks,search),sortField,sortDir)
  const fAlerts = sortedData(filterData(alerts,search),sortField,sortDir)
  const fMaint = sortedData(filterData(maintenance,search),sortField,sortDir)

  function SortHeader({label,field}:{label:string;field:string}) { return <th className="underline-animated amr-table-header px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={()=>handleSort(field)}><span className="inline-flex items-center gap-1">{label}{sortField===field?(sortDir==="asc"?<ArrowUpDown className="h-3 w-3"/>:<ArrowUpDown className="h-3 w-3 rotate-180"/>):null}</span></th> }

  return (
    <div className="amr-root flex flex-col gap-4 p-4">
      <PageHeader title="Autonomous Mobile Robots Fleet" description="Real-time AMR fleet monitoring, task management, and predictive maintenance" />

      <div className="flex items-center gap-2"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search robots, tasks, alerts..." className="pl-9 h-9 text-sm"/></div></div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="amr-tabs-list flex flex-wrap gap-1">
          {["Fleet Dashboard","Robot Inventory","Task Queue","Alert Monitor","Fleet Analytics","Maintenance Log"].map((t,i)=>(<TabsTrigger key={i} value={String(i)} className="amr-tab text-xs">{t}</TabsTrigger>))}
        </TabsList>

      {tab==="0" && <>
        <div className="inner-glow hover-lift-sm grid grid-cols-2 sm:grid-cols-4 gap-3">{dashKPIs.map((k,i)=>(<Card key={i} className="amr-kpi-card"><CardContent className="p-3 flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${k.color}/10 ${k.color}/20`}><k.icon className={`h-5 w-5 ${k.color}`}/></div><div><div className="text-lg font-bold">{k.value}</div><div className="text-[10px] text-muted-foreground">{k.label}</div><div className={`text-[10px] font-medium ${k.change.startsWith("+")?"text-emerald-600":"text-red-600"}`}>{k.change}</div></div></CardContent></Card>))}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover-lift-sm amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Hourly Task Throughput</CardTitle></CardHeader><CardContent><AreaChart data={hourlyTasks}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="hour" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Area type="monotone" dataKey="pick" stackId="a" stroke={TH.cyan} fill={TH.cyan} fillOpacity={0.3}/><Area type="monotone" dataKey="place" stackId="a" stroke={TH.blue} fill={TH.blue} fillOpacity={0.3}/><Area type="monotone" dataKey="transport" stackId="a" stroke={TH.emerald} fill={TH.emerald} fillOpacity={0.3}/></AreaChart></CardContent></Card>
          <Card className="hover-lift-sm amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Robot Type Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} label={({name,percent})=>`${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={9}>{typeData.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip contentStyle={{fontSize:11}}/></PieChart></CardContent></Card>
          <Card className="hover-lift-sm amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Robots by Zone</CardTitle></CardHeader><CardContent><BarChart data={zoneData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Bar dataKey="robots" fill={TH.cyan} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
          <Card className="hover-lift-sm amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Alert Types</CardTitle></CardHeader><CardContent><BarChart layout="vertical" data={alertTypeData}><CartesianGrid strokeDasharray="3 3"/><XAxis type="number" tick={{fontSize:10}}/><YAxis dataKey="name" type="category" tick={{fontSize:8}} width={90}/><Tooltip contentStyle={{fontSize:11}}/><Bar dataKey="value" fill={TH.rose} radius={[0,4,4,0]}/></BarChart></CardContent></Card>
        </div>
      </>}

      {tab==="1" && <>
        <Card><CardContent className="underline-animated inner-glow p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="amr-table-header sticky top-0 bg-card"><tr><SortHeader label="ID" field="id"/><SortHeader label="Type" field="type"/><SortHeader label="Status" field="status"/><SortHeader label="Zone" field="zone"/><SortHeader label="Battery" field="battery"/><SortHeader label="Uptime" field="uptime"/><SortHeader label="Speed" field="speed"/><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Signal</th></tr></thead><tbody>{fRobots.map(r=>(<tr key={r.id} className="amr-table-row border-b transition-colors hover:bg-muted/50 cursor-pointer" onClick={()=>setSelRobot(r)}><td className="px-3 py-2 text-xs font-mono font-medium">{r.id}</td><td className="px-3 py-2"><RobotTypeBadge type={r.type}/></td><td className="px-3 py-2"><RobotStatusBadge status={r.status}/></td><td className="px-3 py-2"><ZoneBadge zone={r.zone}/></td><td className="px-3 py-2"><BatteryBar value={r.battery}/></td><td className="px-3 py-2"><UptimeTile value={r.uptime} label="uptime"/></td><td className="px-3 py-2"><SpeedTile value={r.speed} label=""/></td><td className="px-3 py-2"><SignalBadge strength={r.signal}/></td></tr>))}</tbody></table></div></CardContent></Card>
      </>}

      {tab==="2" && <>
        <Card><CardContent className="inner-glow p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="amr-table-header sticky top-0 bg-card"><tr><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">ID</th><SortHeader label="Robot" field="robotId"/><SortHeader label="Type" field="type"/><SortHeader label="Status" field="status"/><SortHeader label="Priority" field="priority"/><SortHeader label="Zone" field="zone"/><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Duration</th><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Items</th></tr></thead><tbody>{fTasks.map(t=>(<tr key={t.id} className="amr-table-row border-b transition-colors hover:bg-muted/50"><td className="px-3 py-2 text-xs font-mono">{t.id}</td><td className="px-3 py-2 text-xs font-mono">{t.robotId}</td><td className="px-3 py-2"><TaskTypeBadge t={t.type}/></td><td className="px-3 py-2"><TaskStatusBadge s={t.status}/></td><td className="px-3 py-2 text-xs font-medium">{t.priority}</td><td className="px-3 py-2"><ZoneBadge zone={t.zone}/></td><td className="px-3 py-2 text-xs tabular-nums">{t.duration}m</td><td className="px-3 py-2 text-xs tabular-nums">{t.items}</td></tr>))}</tbody></table></div></CardContent></Card>
      </>}

      {tab==="3" && <>
        <Card><CardContent className="inner-glow p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="amr-table-header sticky top-0 bg-card"><tr><SortHeader label="ID" field="id"/><SortHeader label="Robot" field="robotId"/><SortHeader label="Type" field="type"/><SortHeader label="Severity" field="severity"/><SortHeader label="Status" field="resolved"/><SortHeader label="Warehouse" field="warehouse"/></tr></thead><tbody>{fAlerts.map(a=>(<tr key={a.id} className="amr-table-row border-b transition-colors hover:bg-muted/50"><td className="px-3 py-2 text-xs font-mono">{a.id}</td><td className="px-3 py-2 text-xs font-mono">{a.robotId}</td><td className="px-3 py-2"><AlertTypeBadge t={a.type}/></td><td className="px-3 py-2"><AlertSeverityBadge s={a.severity}/></td><td className="px-3 py-2"><span className={`text-[10px] font-medium ${a.resolved?"text-emerald-600":"text-red-600"}`}>{a.resolved?"Resolved":"Open"}</span></td><td className="px-3 py-2 text-xs">{a.warehouse}</td></tr>))}</tbody></table></div></CardContent></Card>
      </>}

      {tab==="4" && <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover-lift-sm amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Efficiency & Uptime Trend</CardTitle></CardHeader><CardContent><LineChart data={efficiencyTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Line type="monotone" dataKey="efficiency" stroke={TH.cyan} strokeWidth={2}/><Line type="monotone" dataKey="uptime" stroke={TH.emerald} strokeWidth={2}/></LineChart></CardContent></Card>
          <Card className="hover-lift-sm amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Monthly Maintenance Cost</CardTitle></CardHeader><CardContent><AreaChart data={maintCostData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:11}}/><Area type="monotone" dataKey="cost" stroke={TH.amber} fill={TH.amber} fillOpacity={0.3}/></AreaChart></CardContent></Card>
        </div>
      </>}

      {tab==="5" && <>
        <Card><CardContent className="inner-glow p-0"><div className="max-h-[500px] overflow-auto"><table className="w-full text-sm"><thead className="amr-table-header sticky top-0 bg-card"><tr><SortHeader label="ID" field="id"/><SortHeader label="Robot" field="robotId"/><SortHeader label="Type" field="type"/><SortHeader label="Status" field="status"/><SortHeader label="Technician" field="technician"/><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Cost</th><th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground">Duration</th></tr></thead><tbody>{fMaint.map(m=>(<tr key={m.id} className="amr-table-row border-b transition-colors hover:bg-muted/50"><td className="px-3 py-2 text-xs font-mono">{m.id}</td><td className="px-3 py-2 text-xs font-mono">{m.robotId}</td><td className="px-3 py-2"><MaintTypeBadge t={m.type}/></td><td className="px-3 py-2"><span className={`text-[10px] font-semibold ${m.status==="Completed"?"text-emerald-600":m.status==="In Progress"?"text-blue-600":m.status==="Overdue"?"text-red-600":"text-amber-600"}`}>{m.status}</span></td><td className="px-3 py-2 text-xs">{m.technician}</td><td className="px-3 py-2 text-xs font-medium tabular-nums text-right">₹{m.cost.toLocaleString("en-IN")}</td><td className="px-3 py-2 text-xs tabular-nums">{m.duration}m</td></tr>))}</tbody></table></div></CardContent></Card>
      </>}
      </Tabs>

      <Sheet open={!!selRobot} onOpenChange={()=>setSelRobot(null)}>
        <SheetContent><SheetHeader><SheetTitle>Robot Detail</SheetTitle></SheetHeader>{selRobot&&<div className="space-y-4 mt-4"><div className="grid grid-cols-2 gap-3"><div><div className="text-xs text-muted-foreground">ID</div><div className="text-sm font-mono font-medium">{selRobot.id}</div></div><div><div className="text-xs text-muted-foreground">Type</div><div className="text-sm"><RobotTypeBadge type={selRobot.type}/></div></div><div><div className="text-xs text-muted-foreground">Status</div><div className="text-sm"><RobotStatusBadge status={selRobot.status}/></div></div><div><div className="text-xs text-muted-foreground">Zone</div><div className="text-sm"><ZoneBadge zone={selRobot.zone}/></div></div><div><div className="text-xs text-muted-foreground">Battery</div><div className="text-sm"><BatteryBar value={selRobot.battery}/></div></div><div><div className="text-xs text-muted-foreground">Firmware</div><div className="text-sm font-mono">{selRobot.firmware}</div></div></div><div className="flex flex-wrap gap-3"><SpeedTile value={selRobot.speed} label="Speed"/><UptimeTile value={selRobot.uptime} label="Uptime"/><SignalBadge strength={selRobot.signal}/><LoadBar value={selRobot.load} max={selRobot.maxLoad}/><EfficiencyRing value={ri(75,99,selRobot.id.charCodeAt(4))}/></div></div>}</SheetContent>
      </Sheet>
    </div>
  )
}

export default AutonomousMobileRobotsFleetView
