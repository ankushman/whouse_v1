"use client"
import { useState } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CL = ["#e11d48","#f43f5e","#fb7185","#fda4af","#be123c","#9f1239","#881337","#ffe4e6"]
const HUBS = ["Mumbai FC-1","Delhi FC-2","Bangalore FC-3","Chennai FC-4","Hyderabad FC-5","Kolkata FC-6","Pune DS-1","Noida DS-2","Gurugram HUB","Chakan DC"]
const VT = ["Tata 407","Eicher 19ft","Ashok Leyland 20ft","BharatBenz 28ft","Mahindra Bolero","Tata Ace","Isuzu 40ft","Eicher 35ft"]
const TT = ["Stock Transfer","Return Shuttle","Cross-Dock","Emergency Replenish","Sample Movement","IT Asset Move"]
const ST = ["Scheduled","In Transit","Delivered","Delayed","Cancelled","Loading"]
const PR = ["Critical","High","Medium","Low"]

function ri(a: number, b: number, v: number) { return Math.min(Math.max(v, a), b) }

const shuttles = [
  {id:"WSO-0001",origin:"Mumbai FC-1",destination:"Pune DS-1",transferType:"Stock Transfer",status:"In Transit",priority:"High",vehicle:"Tata 407",driver:"Rajesh Kumar",distanceKm:150,transitHours:3.5,weightKg:4200,pallets:12,scheduledTime:"2026-07-28 06:00",actualDeparture:"2026-07-28 06:15",eta:"2026-07-28 09:45",cost:18500,orderId:"ORD-90231",notes:"Fragile items"},
  {id:"WSO-0002",origin:"Delhi FC-2",destination:"Noida DS-2",transferType:"Cross-Dock",status:"Delivered",priority:"Medium",vehicle:"Eicher 19ft",driver:"Sunil Yadav",distanceKm:45,transitHours:1.2,weightKg:1800,pallets:6,scheduledTime:"2026-07-28 04:00",actualDeparture:"2026-07-28 04:10",eta:"2026-07-28 05:12",cost:5200,orderId:"ORD-90245",notes:"Perishable stock"},
  {id:"WSO-0003",origin:"Bangalore FC-3",destination:"Chennai FC-4",transferType:"Emergency Replenish",status:"Delayed",priority:"Critical",vehicle:"BharatBenz 28ft",driver:"Murugan S",distanceKm:350,transitHours:8,weightKg:7500,pallets:24,scheduledTime:"2026-07-28 02:00",actualDeparture:"2026-07-28 03:30",eta:"2026-07-28 11:30",cost:42000,orderId:"ORD-90212",notes:"Stockout risk at Chennai"},
  {id:"WSO-0004",origin:"Hyderabad FC-5",destination:"Bangalore FC-3",transferType:"Return Shuttle",status:"Scheduled",priority:"Low",vehicle:"Mahindra Bolero",driver:"Ravi Teja",distanceKm:570,transitHours:10,weightKg:800,pallets:3,scheduledTime:"2026-07-29 05:00",actualDeparture:"-",eta:"2026-07-29 15:00",cost:28000,orderId:"ORD-90278",notes:"Empty pallet return"},
  {id:"WSO-0005",origin:"Kolkata FC-6",destination:"Hyderabad FC-5",transferType:"Stock Transfer",status:"Loading",priority:"Medium",vehicle:"Ashok Leyland 20ft",driver:"Arun Das",distanceKm:1200,transitHours:18,weightKg:6500,pallets:20,scheduledTime:"2026-07-28 20:00",actualDeparture:"-",eta:"2026-07-29 14:00",cost:78000,orderId:"ORD-90290",notes:"Festival season stock"},
  {id:"WSO-0006",origin:"Pune DS-1",destination:"Chakan DC",transferType:"Sample Movement",status:"Delivered",priority:"Low",vehicle:"Tata Ace",driver:"Ganesh Patil",distanceKm:35,transitHours:0.8,weightKg:120,pallets:1,scheduledTime:"2026-07-28 10:00",actualDeparture:"2026-07-28 10:05",eta:"2026-07-28 10:53",cost:1800,orderId:"ORD-90301",notes:"QC lab samples"},
  {id:"WSO-0007",origin:"Gurugram HUB",destination:"Delhi FC-2",transferType:"IT Asset Move",status:"In Transit",priority:"High",vehicle:"Eicher 35ft",driver:"Vikram Singh",distanceKm:28,transitHours:0.5,weightKg:3500,pallets:8,scheduledTime:"2026-07-28 14:00",actualDeparture:"2026-07-28 14:20",eta:"2026-07-28 14:50",cost:4500,orderId:"ORD-90315",notes:"Server rack relocation"},
  {id:"WSO-0008",origin:"Chennai FC-4",destination:"Hyderabad FC-5",transferType:"Stock Transfer",status:"Scheduled",priority:"Medium",vehicle:"Isuzu 40ft",driver:"Krishna R",distanceKm:630,transitHours:12,weightKg:8200,pallets:28,scheduledTime:"2026-07-29 08:00",actualDeparture:"-",eta:"2026-07-29 20:00",cost:65000,orderId:"ORD-90322",notes:"Electronics consignment"},
  {id:"WSO-0009",origin:"Noida DS-2",destination:"Gurugram HUB",transferType:"Cross-Dock",status:"Delayed",priority:"Critical",vehicle:"Tata 407",driver:"Amit Sharma",distanceKm:18,transitHours:1.5,weightKg:900,pallets:4,scheduledTime:"2026-07-28 12:00",actualDeparture:"2026-07-28 13:00",eta:"2026-07-28 14:30",cost:2200,orderId:"ORD-90335",notes:"Express lane blocked"},
  {id:"WSO-0010",origin:"Chakan DC",destination:"Mumbai FC-1",transferType:"Return Shuttle",status:"In Transit",priority:"High",vehicle:"Eicher 19ft",driver:"Suresh M",distanceKm:95,transitHours:2.5,weightKg:2100,pallets:7,scheduledTime:"2026-07-28 07:00",actualDeparture:"2026-07-28 07:10",eta:"2026-07-28 09:40",cost:12000,orderId:"ORD-90348",notes:"Defective unit returns"},
  {id:"WSO-0011",origin:"Mumbai FC-1",destination:"Bangalore FC-3",transferType:"Stock Transfer",status:"Scheduled",priority:"Medium",vehicle:"BharatBenz 28ft",driver:"Pradeep K",distanceKm:980,transitHours:16,weightKg:7000,pallets:22,scheduledTime:"2026-07-29 22:00",actualDeparture:"-",eta:"2026-07-30 14:00",cost:89000,orderId:"ORD-90360",notes:"Pan-India long haul"},
  {id:"WSO-0012",origin:"Delhi FC-2",destination:"Kolkata FC-6",transferType:"Emergency Replenish",status:"In Transit",priority:"Critical",vehicle:"Ashok Leyland 20ft",driver:"Manoj T",distanceKm:1500,transitHours:18,weightKg:5800,pallets:18,scheduledTime:"2026-07-28 00:00",actualDeparture:"2026-07-28 00:30",eta:"2026-07-28 18:30",cost:95000,orderId:"ORD-90375",notes:"Critical replenishment run"},
  {id:"WSO-0013",origin:"Bangalore FC-3",destination:"Chakan DC",transferType:"Cross-Dock",status:"Delivered",priority:"Low",vehicle:"Mahindra Bolero",driver:"Naveen G",distanceKm:820,transitHours:14,weightKg:1500,pallets:5,scheduledTime:"2026-07-27 06:00",actualDeparture:"2026-07-27 06:15",eta:"2026-07-27 20:15",cost:45000,orderId:"ORD-90388",notes:"Auto spare parts"},
  {id:"WSO-0014",origin:"Hyderabad FC-5",destination:"Chennai FC-4",transferType:"Sample Movement",status:"Cancelled",priority:"Low",vehicle:"Tata Ace",driver:"Sridhar V",distanceKm:630,transitHours:11,weightKg:50,pallets:1,scheduledTime:"2026-07-28 16:00",actualDeparture:"-",eta:"-",cost:0,orderId:"ORD-90395",notes:"Cancelled by QC team"},
]

const tip = { background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 11 }

function HubBadge({ n }: { n: string }) { const c = CL[HUBS.indexOf(n) % 8]; return <span className="wso-hub-badge px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: c + "1a", color: c }}>{n.split(" ")[0]}</span> }
function TypeBadge({ t }: { t: string }) { const i = TT.indexOf(t) % 8; return <span className="wso-type-badge px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: CL[i] + "1a", color: CL[i] }}>{t}</span> }
function StatusBadge({ s }: { s: string }) { const m: Record<string, string> = { Scheduled: "bg-blue-500/15 text-blue-400", "In Transit": "bg-amber-500/15 text-amber-400", Delivered: "bg-emerald-500/15 text-emerald-400", Delayed: "bg-red-500/15 text-red-400", Cancelled: "bg-zinc-500/15 text-zinc-400", Loading: "bg-purple-500/15 text-purple-400" }; return <span className={"wso-status-badge px-1.5 py-0.5 rounded text-[10px] font-medium " + (m[s] || "")}>{s}</span> }
function PriorityBadge({ p }: { p: string }) { const m: Record<string, string> = { Critical: "bg-red-500/20 text-red-400 shadow-[0_0_6px_rgba(225,29,72,0.5)]", High: "bg-orange-500/15 text-orange-400", Medium: "bg-blue-500/15 text-blue-400", Low: "bg-zinc-500/15 text-zinc-400" }; return <span className={"wso-priority-badge px-1.5 py-0.5 rounded text-[10px] font-medium " + (m[p] || "")}>{p}</span> }
function TransitBar({ h }: { h: number }) { const w = ri(0, 100, (h / 18) * 100); const c = w > 70 ? "#e11d48" : w > 40 ? "#f59e0b" : "#10b981"; return <div className="wso-transit-bar w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: w + "%", backgroundColor: c }} /></div> }
function CostBadge({ c }: { c: number }) { return <span className="wso-cost-badge text-[10px] font-mono text-rose-300">{"\u20b9"}{(c / 1000).toFixed(1)}K</span> }
function KpiTile({ l, v, s, c }: { l: string; v: string; s: string; c: string }) { return <div className="wso-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4"><p className="text-xs text-zinc-500 mb-1">{l}</p><p className={"text-xl font-bold " + c}>{v}</p><p className="text-[10px] text-zinc-400 mt-1">{s}</p></div> }

const fg = [
  { key: "origin", label: "Origin Hub", options: HUBS.map(h => ({ value: h, label: h, count: 0 })) },
  { key: "transferType", label: "Type", options: TT.map(t => ({ value: t, label: t, count: 0 })) },
  { key: "status", label: "Status", options: ST.map(s => ({ value: s, label: s, count: 0 })) },
  { key: "priority", label: "Priority", options: PR.map(p => ({ value: p, label: p, count: 0 })) },
]

const insights = [
  { t: "Hub-and-Spoke Network Design", d: "India's warehouse shuttle network currently operates across 47 active corridors connecting 10 primary hubs, 8 fulfillment centers and 23 dark stores nationwide. Our network analysis reveals that 34% of existing shuttle routes overlap by more than 60% in first and last mile segments, indicating significant consolidation potential. The proposed hub-and-spoke redesign would establish 4 mega-hub clusters \u2014 Mumbai-Pune, Delhi-NCR, Bangalore-Chennai and Hyderabad-Kolkata \u2014 reducing total shuttle kilometers by 28% while maintaining same-day delivery SLAs for all metro corridors. Key enablers include cross-docking capability at mega-hubs reducing handling time from 4.2 hours to 1.8 hours, dedicated high-frequency lanes between cluster hubs operating 8 daily shuttles versus the current 3, and dynamic load balancing algorithms that predict demand surges 72 hours ahead using historical patterns. Pilot data from the Mumbai-Pune corridor demonstrates a 22% reduction in per-shipment cost and 35% improvement in vehicle utilization rates. Capital expenditure for hub upgrades is estimated at \u20b918 Cr with projected payback within 14 months through operational savings alone. Implementation roadmap suggests a phased 18-month rollout starting with the Delhi-NCR cluster where congestion-related delays cost approximately \u20b92.4 Cr quarterly." },
  { t: "Same-Day Shuttle SLA", d: "Achieving sub-6-hour inter-facility transfer SLAs across Indian metro clusters requires a fundamental rethinking of shuttle scheduling, vehicle allocation and route optimization. Current average shuttle transit times in the Mumbai-Pune corridor stand at 3.2 hours for 150km, while Delhi-NCR intra-city transfers average 1.8 hours for 45km. However, these figures mask significant variability with P90 times reaching 5.1 hours and 3.4 hours respectively due to traffic congestion, dock wait times and loading delays. Our analysis identifies three critical levers for SLA compression. First, pre-staged shuttle pools at high-volume origin hubs eliminate the 45-minute average vehicle allocation delay. Second, dedicated express lanes with pre-cleared toll passes on key corridors reduce road transit time by 18%. Third, automated dock scheduling with 15-minute arrival windows cuts destination wait time from 38 minutes to under 12 minutes. Combined, these interventions project a P95 transit time of 5.4 hours for the Mumbai-Pune corridor, meeting the sub-6-hour SLA target. Investment required is estimated at \u20b96.5 Cr for the Mumbai-Pune pilot, with fleet tracking IoT sensors accounting for 40% of the cost and the remainder split between dock automation and toll pass procurement." },
  { t: "Reverse Logistics Shuttle", d: "Dedicated return shuttle routes for reverse logistics operations can reduce per-unit handling costs by 35% compared to the current ad-hoc approach used across our warehouse network. Our study of 12 months of return shipment data reveals that 62% of reverse logistics volume follows predictable patterns \u2014 defective product returns peak on Mondays and Tuesdays following weekend deliveries, customer-initiated returns cluster around the 7-day post-delivery mark, and seasonal return surges follow Diwali and Holi sales by exactly 8 to 10 days. Despite this predictability, current operations treat reverse logistics as a secondary priority, often bundling return pickups with outbound delivery vehicles. This results in an average 2.3-day delay in return receipt processing, compared to 0.8 days for dedicated shuttle routes. The proposed dedicated reverse shuttle network would operate 6 fixed routes covering Mumbai, Delhi, Bangalore, Chennai, Hyderabad and Pune, with scheduled stops at 38 dark stores and 12 return processing centers. Annual cost projection is \u20b94.2 Cr for the dedicated fleet versus \u20b96.5 Cr for the current ad-hoc approach, yielding net savings of \u20b92.3 Cr. Additional benefits include faster refund processing improving customer NPS by an estimated 8 points." },
  { t: "EV Shuttle Fleet Transition", d: "Electric vehicle adoption for intra-city warehouse shuttle operations presents a compelling total-cost-of-ownership case that becomes cash-flow positive within 26 months of deployment. Our analysis compares Tata Ace EV, Mahindra Zeo and Ashok Leyland EV trucks against their diesel counterparts across 15 representative shuttle routes with distances ranging from 15km to 120km. For the median intra-city shuttle route of 45km, the EV variant saves \u20b9420 per trip in fuel costs alone, translating to \u20b91.53 Lakh per vehicle annually at 365 operating days. When factoring in reduced maintenance costs of approximately \u20b945,000 annually, total per-vehicle savings reach \u20b91.98 Lakh per year. Against a vehicle cost premium of \u20b94.2 Lakh for the EV variant over diesel, the payback period computes to 25.3 months. Critical infrastructure requirements include fast-charging stations at all 10 hub locations with a minimum of 4 charging bays each, total investment of \u20b93.8 Cr. Range anxiety is mitigated by the fact that 78% of intra-city shuttles operate under 60km per trip, well within the 150km range of current EV trucks. Government FAME-II subsidies reduce the effective vehicle premium by 22%, accelerating payback to 20 months. We recommend starting with Pune and Hyderabad corridors where electricity costs are lowest at \u20b96.8 per unit." },
]

export default function WarehouseShuttleOpsView() {
  const [af, setAf] = useState<Record<string, string[]>>({})
  const [sq, setSq] = useState("")
  const toggleFilter = (k: string, v: string) => setAf(p => { const arr = p[k] || []; if (arr.includes(v)) return (function () { const n = { ...p }; n[k] = arr.filter(x => x !== v); if (n[k].length === 0) delete n[k]; return n })(); return { ...p, [k]: [...arr, v] } })
  const filtered = shuttles.filter(s => { for (const [k, vs] of Object.entries(af)) { if (vs.length > 0 && !vs.includes(s[k as keyof typeof s] as string)) return false } return !sq || Object.values(s).some(v => String(v).toLowerCase().includes(sq.toLowerCase())) })
  const inTransit = shuttles.filter(s => s.status === "In Transit").length
  const scheduled = shuttles.filter(s => s.status === "Scheduled").length
  return (
    <div className="wso-root space-y-4 p-4">
      <PageHeader title="Warehouse Shuttle Ops" description="Inter-facility transfer management across hubs, fulfillment centers and dark stores" />
      <Tabs defaultValue="dashboard">
        <TabsList className="wso-tabs bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shuttles">Shuttles</TabsTrigger>
          <TabsTrigger value="routes">Route Map</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiTile l="Active Shuttles" v={String(inTransit + scheduled)} s={`${inTransit} in transit, ${scheduled} scheduled`} c="text-rose-400" />
            <KpiTile l="Today's Deliveries" v="8" s="On track for target of 12" c="text-emerald-400" />
            <KpiTile l="Avg Transit Time" v="7.4 hrs" s="-0.8 hrs vs last week" c="text-amber-400" />
            <KpiTile l="Fleet Utilization" v="83.2%" s="+4.1pp improvement" c="text-blue-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-zinc-900/60 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-300">Volume by Origin Hub</CardTitle></CardHeader><CardContent><BarChart data={HUBS.map(h => ({ name: h.split(" ")[0], v: shuttles.filter(s => s.origin === h).length }))} width={350} height={200}><CartesianGrid strokeDasharray="3 3" stroke="#27272a" /><XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#71717a" /><YAxis tick={{ fontSize: 9 }} stroke="#71717a" /><Tooltip contentStyle={tip} /><Bar dataKey="v" fill="#e11d48" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="bg-zinc-900/60 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-300">Monthly Shuttle Volume</CardTitle></CardHeader><CardContent><AreaChart data={[{ m: "Aug", v: 142 }, { m: "Sep", v: 158 }, { m: "Oct", v: 171 }, { m: "Nov", v: 189 }, { m: "Dec", v: 165 }, { m: "Jan", v: 152 }, { m: "Feb", v: 148 }, { m: "Mar", v: 178 }, { m: "Apr", v: 195 }, { m: "May", v: 201 }, { m: "Jun", v: 187 }, { m: "Jul", v: 214 }]} width={350} height={200}><CartesianGrid strokeDasharray="3 3" stroke="#27272a" /><XAxis dataKey="m" tick={{ fontSize: 9 }} stroke="#71717a" /><YAxis tick={{ fontSize: 9 }} stroke="#71717a" /><Tooltip contentStyle={tip} /><Area type="monotone" dataKey="v" stroke="#e11d48" fill="#e11d4830" /></AreaChart></CardContent></Card>
            <Card className="bg-zinc-900/60 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-300">Transfer Type Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={TT.map(t => ({ name: t, value: shuttles.filter(s => s.transferType === t).length }))} cx="50%" cy="50%" outerRadius={70} innerRadius={35} dataKey="value" paddingAngle={2} label>{TT.map((_, i) => <Cell key={i} fill={CL[i]} />)}</Pie><Tooltip contentStyle={tip} /></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="shuttles" className="space-y-4 mt-4">
          <ModuleBreadcrumb items={[{ label: "Warehouse" }, { label: "Shuttles" }]} />
          <SearchFilterToolbar searchQuery={sq} onSearchChange={setSq} onClearSearch={() => setSq("")} activeFilters={af} filterGroups={fg} onToggleFilter={toggleFilter} onClearAllFilters={() => { setAf({}); setSq("") }} totalItems={shuttles.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search shuttles by ID, hub, vehicle, driver..." />
          <Card className="bg-zinc-900/60 border-zinc-800"><CardContent className="p-0"><div className="overflow-x-auto max-h-[420px] overflow-y-auto"><table className="w-full text-sm"><thead><tr className="border-b border-zinc-800">{["ID", "Origin", "Dest", "Type", "Status", "Priority", "Vehicle", "Driver", "Dist", "Transit", "Weight", "Plts", "ETA", "Cost"].map(h => <th key={h} className="text-left px-2 py-2 text-zinc-500 text-[10px] font-medium sticky top-0 bg-zinc-900 z-10 whitespace-nowrap">{h}</th>)}</tr></thead><tbody>
            {filtered.map(s => { const rc = s.status === "Delayed" && s.priority === "Critical" ? "wso-row-critical" : s.status === "Delayed" || s.status === "Loading" ? "wso-row-warning" : ""; return (
              <tr key={s.id} className={"border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors " + rc}>
                <td className="px-2 py-1.5 font-mono text-[10px] text-rose-400 whitespace-nowrap">{s.id}</td>
                <td className="px-2 py-1.5 whitespace-nowrap"><HubBadge n={s.origin} /></td>
                <td className="px-2 py-1.5 text-[10px] text-zinc-300 whitespace-nowrap">{s.destination.split(" ")[0]}</td>
                <td className="px-2 py-1.5 whitespace-nowrap"><TypeBadge t={s.transferType} /></td>
                <td className="px-2 py-1.5 whitespace-nowrap"><StatusBadge s={s.status} /></td>
                <td className="px-2 py-1.5 whitespace-nowrap"><PriorityBadge p={s.priority} /></td>
                <td className="px-2 py-1.5 text-[10px] text-zinc-400 whitespace-nowrap">{s.vehicle}</td>
                <td className="px-2 py-1.5 text-[10px] text-zinc-400 whitespace-nowrap">{s.driver}</td>
                <td className="px-2 py-1.5 text-[10px] text-zinc-400 whitespace-nowrap">{s.distanceKm}km</td>
                <td className="px-2 py-1.5 whitespace-nowrap"><div className="flex items-center gap-1"><TransitBar h={s.transitHours} /><span className="text-[10px] text-zinc-500">{s.transitHours}h</span></div></td>
                <td className="px-2 py-1.5 text-[10px] text-zinc-400">{(s.weightKg / 1000).toFixed(1)}t</td>
                <td className="px-2 py-1.5 text-[10px] text-zinc-400">{s.pallets}</td>
                <td className="px-2 py-1.5 text-[10px] text-zinc-400 whitespace-nowrap">{s.eta}</td>
                <td className="px-2 py-1.5 whitespace-nowrap"><CostBadge c={s.cost} /></td>
              </tr>
            ) })}
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="routes" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-zinc-900/60 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-300">Route Frequency by Corridor</CardTitle></CardHeader><CardContent><BarChart data={[{ c: "MUM-PUN", v: 48 }, { c: "DEL-NCR", v: 42 }, { c: "BLR-CHE", v: 35 }, { c: "HYD-BLR", v: 31 }, { c: "KOL-HYD", v: 18 }, { c: "CHE-HYD", v: 27 }, { c: "DEL-KOL", v: 15 }, { c: "PUN-CHN", v: 12 }]} width={350} height={220} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#27272a" /><XAxis type="number" tick={{ fontSize: 9 }} stroke="#71717a" /><YAxis dataKey="c" type="category" tick={{ fontSize: 9 }} stroke="#71717a" width={60} /><Tooltip contentStyle={tip} /><Bar dataKey="v" fill="#f43f5e" radius={[0, 4, 4, 0]} /></BarChart></CardContent></Card>
            <Card className="bg-zinc-900/60 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-300">Vehicle Type Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={220}><Pie data={VT.map((v, i) => ({ name: v.split(" ")[0], value: [14, 11, 9, 7, 5, 3, 2, 1][i] }))} cx="50%" cy="50%" outerRadius={75} innerRadius={38} dataKey="value" paddingAngle={2}>{VT.map((_, i) => <Cell key={i} fill={CL[i % 8]} />)}</Pie><Tooltip contentStyle={tip} /></PieChart></CardContent></Card>
            <Card className="bg-zinc-900/60 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-300">Monthly Cost per Km Trend</CardTitle></CardHeader><CardContent><LineChart data={[{ m: "Aug", cpk: 18.4 }, { m: "Sep", cpk: 17.8 }, { m: "Oct", cpk: 19.2 }, { m: "Nov", cpk: 21.5 }, { m: "Dec", cpk: 20.1 }, { m: "Jan", cpk: 18.9 }, { m: "Feb", cpk: 17.2 }, { m: "Mar", cpk: 18.6 }, { m: "Apr", cpk: 16.8 }, { m: "May", cpk: 15.9 }, { m: "Jun", cpk: 16.2 }, { m: "Jul", cpk: 15.4 }]} width={350} height={220}><CartesianGrid strokeDasharray="3 3" stroke="#27272a" /><XAxis dataKey="m" tick={{ fontSize: 9 }} stroke="#71717a" /><YAxis tick={{ fontSize: 9 }} stroke="#71717a" tickFormatter={v => "\u20b9" + v} /><Tooltip contentStyle={tip} formatter={(v: number) => ["\u20b9" + v + "/km", "Cost"]} /><Line type="monotone" dataKey="cpk" stroke="#e11d48" strokeWidth={2} dot={false} /></LineChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="insights" className="space-y-4 mt-4">
          {insights.map((ins, i) => (
            <Card key={i} className="wso-insight-card bg-zinc-900/60 border border-rose-500/20"><CardContent className="p-4"><p className="text-sm font-medium text-rose-300">{ins.t}</p><p className="text-xs text-zinc-400 mt-2 leading-relaxed">{ins.d}</p></CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
