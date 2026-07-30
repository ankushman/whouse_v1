"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BrainCircuit, BarChart3, ShieldCheck, ShieldAlert, Microscope,
  TestTubes, ClipboardCheck, Award, Star, Package, RotateCcw, Tag, ScanBarcode, Camera, FileCheck2,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const REASONS = ["Size Issue","Color Mismatch","Defective","Wrong Product","Damaged in Transit","Changed Mind","Warranty Claim","Duplicate Order"] as const
const R_EMOJI: Record<string,string> = {"Size Issue":"\u{1f454}","Color Mismatch":"\u{1f3a8}",Defective:"\u{1f527}","Wrong Product":"\u274c","Damaged in Transit":"\u{1f4e6}","Changed Mind":"\u{1f504}","Warranty Claim":"\u{1f6e1}\ufe0f","Duplicate Order":"\u{1f501}"}
const CATEGORIES = ["Electronics","Fashion","Home & Living","Beauty","Sports","Books","Toys","Grocery"] as const
const INSPECT_STS = ["Pending","In Progress","Passed","Failed","Hold","Escalated"] as const
const GRADES = ["A","B","C","D","F"] as const
const DECISIONS = ["Restock","Refurbish","Liquidate","Recycle","Return to Supplier","Destroy"] as const
const DEFECT_TYPES = ["Cosmetic","Functional","Packaging","Missing Parts","Safety","Contamination","Label Error","Structural"] as const
const D_EMOJI: Record<string,string> = {Cosmetic:"\u{1f4f8}",Functional:"\u2699\ufe0f",Packaging:"\u{1f4e6}","Missing Parts":"\u{1f529}",Safety:"\u{1f6a8}",Contamination:"\u{1f9ea}","Label Error":"\u{1f3f7}\ufe0f",Structural:"\u{1f3d7}\ufe0f"}
const SEVERITIES = ["Critical","Major","Minor","Trivial","Observation"] as const
const CA_STS = ["Open","In Progress","Closed","Verified"] as const
const REFURB_TYPES = ["Repackaging","Cleaning","Repair","Part Replacement","Firmware Update","Painting","Testing","Quality Seal"] as const
const RF_EMOJI: Record<string,string> = {Repackaging:"\u{1f4e6}",Cleaning:"\u{1f9f9}",Repair:"\u{1f527}","Part Replacement":"\u{1f529}","Firmware Update":"\u{1f4bb}",Painting:"\u{1f3a8}",Testing:"\u{1f9ea}","Quality Seal":"\u2705"}
const REFURB_STS = ["Queued","In Progress","QC Pending","Approved","Rejected","Completed"] as const
const CB_CATS = ["Defective","Wrong Item","Late Delivery","Short Ship","Damaged","Quality Deviation","Non-Compliance","Documentation"] as const
const CB_STS = ["Pending Review","Approved","Disputed","Partially Accepted","Rejected","Settled"] as const
const INSPECTORS = ["Arun K","Deepa S","Ravi M","Sneha P","Karthik R","Meera J","Prasad V","Anitha N"] as const
const TECHNICIANS = ["Suresh T","Lakshmi B","Rahul D","Pooja K","Mohan S","Divya R","Sanjay G","Kavitha M"] as const
const SUPPLIERS = ["Reliance Supply","Tata Materials","Adani Parts","Birla Components","Mahindra Logistics","Godrej Packaging","Wipro Tech","Infosys Systems"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {rose:"#e11d48",blue:"#3b82f6",amber:"#d97706",emerald:"#059669",violet:"#7c3aed",indigo:"#6366f1"}
const PC = [TH.rose,TH.blue,TH.amber,TH.emerald,TH.violet,TH.indigo,"#0891b2","#f97316"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function fmtINR(n: number): string { const s = n < 0 ? "-" : ""; const a = Math.abs(n); if (a >= 1e7) return `\u20b9${s}${(a / 1e7).toFixed(2)} Cr`; if (a >= 1e5) return `\u20b9${s}${(a / 1e5).toFixed(2)} L`; return `\u20b9${s}${a.toLocaleString("en-IN")}` }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 16 Visual Components */
function ReturnReasonBadge({ reason }: { reason: string }) {
  const cl: Record<string,string> = {"Size Issue":"bg-blue-100 text-blue-800","Color Mismatch":"bg-violet-100 text-violet-800",Defective:"bg-red-100 text-red-800","Wrong Product":"bg-rose-100 text-rose-800","Damaged in Transit":"bg-amber-100 text-amber-800","Changed Mind":"bg-gray-100 text-gray-700","Warranty Claim":"bg-indigo-100 text-indigo-800","Duplicate Order":"bg-orange-100 text-orange-800"}
  return <span className={`rqc-reason inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[reason]||"bg-gray-100"}`}>{R_EMOJI[reason]} {reason}</span>
}
function CategoryBadge({ cat }: { cat: string }) {
  const cl: Record<string,string> = {Electronics:"bg-blue-100 text-blue-800",Fashion:"bg-pink-100 text-pink-800","Home & Living":"bg-amber-100 text-amber-800",Beauty:"bg-rose-100 text-rose-800",Sports:"bg-emerald-100 text-emerald-800",Books:"bg-indigo-100 text-indigo-800",Toys:"bg-violet-100 text-violet-800",Grocery:"bg-green-100 text-green-800"}
  return <span className={`rqc-cat inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[cat]||"bg-gray-100"}`}>{cat}</span>
}
function InspectionStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Pending:"bg-amber-100 text-amber-700","In Progress":"bg-blue-100 text-blue-700",Passed:"bg-emerald-100 text-emerald-700",Failed:"bg-red-100 text-red-700",Hold:"bg-violet-100 text-violet-700",Escalated:"bg-rose-100 text-rose-700"}
  return <span className={`rqc-insp-status inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||""} ${status==="In Progress"?"animate-pulse":""}`}>\u25cf {status}</span>
}
function ConditionGrade({ grade }: { grade: string }) {
  const cl: Record<string,string> = {A:"bg-emerald-100 text-emerald-800",B:"bg-blue-100 text-blue-800",C:"bg-amber-100 text-amber-800",D:"bg-orange-100 text-orange-800",F:"bg-red-100 text-red-800"}
  const label: Record<string,string> = {A:"Like New",B:"Good",C:"Fair",D:"Poor",F:"Unsellable"}
  return <span className={`rqc-grade inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${cl[grade]||"bg-gray-100"}`}>{grade} - {label[grade]}</span>
}
function DecisionBadge({ decision }: { decision: string }) {
  const cl: Record<string,string> = {Restock:"bg-emerald-100 text-emerald-700",Refurbish:"bg-blue-100 text-blue-700",Liquidate:"bg-amber-100 text-amber-700",Recycle:"bg-green-100 text-green-700","Return to Supplier":"bg-violet-100 text-violet-700",Destroy:"bg-red-100 text-red-700"}
  return <span className={`rqc-decision inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${cl[decision]||"bg-gray-100"}`}>{decision}</span>
}
function InspectorBadge({ name }: { name: string }) {
  return <span className="rqc-inspector inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700"><ClipboardCheck className="h-3 w-3"/>{name}</span>
}
function DefectTypeBadge({ type }: { type: string }) {
  return <span className="rqc-defect-type inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700">{D_EMOJI[type]} {type}</span>
}
function DefectSeverityBadge({ severity }: { severity: string }) {
  const cl: Record<string,string> = {Critical:"rqc-sev-critical bg-red-100 text-red-700 shadow-sm shadow-red-300/50",Major:"bg-rose-100 text-rose-700",Minor:"bg-amber-100 text-amber-700",Trivial:"bg-blue-100 text-blue-700",Observation:"bg-gray-100 text-gray-500"}
  return <span className={`rqc-severity inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${cl[severity]||""}`}>{severity}</span>
}
function CorrectiveActionBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Open:"bg-amber-100 text-amber-700","In Progress":"bg-blue-100 text-blue-700",Closed:"bg-emerald-100 text-emerald-700",Verified:"bg-indigo-100 text-indigo-700"}
  return <span className={`rqc-ca inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[status]||"bg-gray-100"}`}>{status}</span>
}
function RefurbTypeBadge({ type }: { type: string }) {
  return <span className="rqc-refurb-type inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-700">{RF_EMOJI[type]} {type}</span>
}
function RefurbStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {Queued:"bg-gray-100 text-gray-500","In Progress":"bg-blue-100 text-blue-700","QC Pending":"bg-amber-100 text-amber-700",Approved:"bg-emerald-100 text-emerald-700",Rejected:"bg-red-100 text-red-700",Completed:"bg-indigo-100 text-indigo-700"}
  return <span className={`rqc-refurb-status inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||""} ${status==="In Progress"?"animate-pulse":""}`}>\u25cf {status}</span>
}
function ConditionArrow({ from, to }: { from: string; to: string }) {
  const gradeIdx: Record<string,number> = {A:4,B:3,C:2,D:1,F:0}
  const improved = (gradeIdx[to]||0) > (gradeIdx[from]||0)
  return <span className={`rqc-cond-arrow inline-flex items-center gap-1 text-[10px] font-mono ${improved?"text-emerald-600":"text-red-600"}`}>{from} <ArrowUpDown className="h-3 w-3"/> {to} {improved?"\u2191":"\u2193"}</span>
}
function ROIBadge({ roi }: { roi: number }) {
  const c = roi > 100 ? "bg-emerald-100 text-emerald-700" : roi > 50 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
  return <span className={`rqc-roi inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${c}`}>{roi}% ROI</span>
}
function ChargebackCategoryBadge({ cat }: { cat: string }) {
  const cl: Record<string,string> = {Defective:"bg-red-100 text-red-700","Wrong Item":"bg-rose-100 text-rose-700","Late Delivery":"bg-amber-100 text-amber-700","Short Ship":"bg-orange-100 text-orange-700",Damaged:"bg-violet-100 text-violet-700","Quality Deviation":"bg-blue-100 text-blue-700","Non-Compliance":"bg-indigo-100 text-indigo-700",Documentation:"bg-gray-100 text-gray-600"}
  return <span className={`rqc-cb-cat inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${cl[cat]||"bg-gray-100"}`}>{cat}</span>
}
function ChargebackStatusBadge({ status }: { status: string }) {
  const cl: Record<string,string> = {"Pending Review":"bg-amber-100 text-amber-700",Approved:"bg-emerald-100 text-emerald-700",Disputed:"bg-red-100 text-red-700","Partially Accepted":"bg-blue-100 text-blue-700",Rejected:"bg-gray-100 text-gray-500",Settled:"bg-indigo-100 text-indigo-700"}
  return <span className={`rqc-cb-status inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cl[status]||""} ${status==="Pending Review"?"animate-pulse":""}`}>\u25cf {status}</span>
}
function AmountTile({ amount }: { amount: number }) {
  const c = amount > 100000 ? "text-red-600 font-bold" : amount > 50000 ? "text-amber-600" : "text-gray-700"
  return <span className={`rqc-amount inline-flex items-center gap-1 text-[10px] ${c}`}><IndianRupee className="h-3 w-3"/>{fmtINR(amount)}</span>
}

/* Data Generation */
function generateData() {
  const inspections = Array.from({length:75},(_, i)=>{
    const fromG = GRADES[ri(2,4,i*3+1)]
    const toG = GRADES[Math.max(0,ri(0,4,i*3+2))]
    return {id:`INS-${String(1001+i).padStart(4,"0")}`,reason:REASONS[ri(0,7,i*3)],category:CATEGORIES[ri(0,7,i*3+1)],status:INSPECT_STS[ri(0,5,i*3+2)],condition:toG,fromCondition:fromG,inspector:INSPECTORS[ri(0,INSPECTORS.length-1,i*3+3)],timeMin:ri(5,45,i*3+4),images:ri(2,12,i*3+5),decision:DECISIONS[ri(0,5,i*3+6)]}
  })
  const defects = Array.from({length:70},(_, i)=>{
    return {id:`DEF-${String(2001+i).padStart(4,"0")}`,type:DEFECT_TYPES[ri(0,7,i*4)],severity:SEVERITIES[ri(0,4,i*4+1)],frequency:ri(1,25,i*4+2),cost:ri(500,50000,i*4+3)*10,location:["Zone A","Zone B","Zone C","Zone D","QC Bay","Receiving","Returns Dock","Staging"][ri(0,7,i*4+4)],caStatus:CA_STS[ri(0,3,i*4+5)],photos:ri(1,8,i*4+6),recurrence:ri(0,5,i*4+7)}
  })
  const refurbishments = Array.from({length:55},(_, i)=>{
    const fromG = GRADES[ri(2,4,i*5+1)]
    const toG = GRADES[Math.min(4,ri(0,Math.max(0,"ABCD".indexOf(fromG)+1),i*5+2))]
    const cost = ri(200,8000,i*5+3)*10
    const resale = ri(500,15000,i*5+4)*10
    return {id:`RFB-${String(3001+i).padStart(4,"0")}`,type:REFURB_TYPES[ri(0,7,i*5)],status:REFURB_STS[ri(0,5,i*5+1)],fromCondition:fromG,toCondition:toG,timeHrs:ri(1,8,i*5+2),cost,resale,roi:Math.round(((resale-cost)/cost)*100),technician:TECHNICIANS[ri(0,TECHNICIANS.length-1,i*5+5)]}
  })
  const chargebacks = Array.from({length:65},(_, i)=>{
    return {id:`CB-${String(4001+i).padStart(4,"0")}`,category:CB_CATS[ri(0,7,i*6)],status:CB_STS[ri(0,5,i*6+1)],amount:ri(5000,500000,i*6+2)*10,po:`PO-${String(ri(9000,9999,i*6+3))}`,supplier:SUPPLIERS[ri(0,7,i*6+3)],evidence:ri(1,15,i*6+4),recovery:ri(0,100,i*6+5),claimDate:`${ri(1,28,i*6+6)}/${ri(1,12,i*6+7)}`}
  })
  const kpiData = [
    {label:"Total Inspections",value:"3,842",icon:Microscope,color:TH.rose,trend:"+245"},
    {label:"Pass Rate",value:"94.2%",icon:ShieldCheck,color:TH.emerald,trend:"+1.8%"},
    {label:"Fail Rate",value:"5.8%",icon:ShieldAlert,color:TH.amber,trend:"-1.8%"},
    {label:"Avg QC Time",value:"18 min",icon:Clock,color:TH.blue,trend:"-2 min"},
    {label:"Returns Cost",value:fmtINR(2450000),icon:IndianRupee,color:TH.violet,trend:"-12%"},
    {label:"Pending Reviews",value:"67",icon:ClipboardCheck,color:TH.indigo,trend:"-8"},
    {label:"Chargebacks",value:"₹42.5 L",icon:RotateCcw,color:"#f97316",trend:"+₹5.2L"},
    {label:"Credit Issued",value:fmtINR(1870000),icon:Star,color:"#0891b2",trend:"+₹1.1L"},
  ]
  const inspTrend = MO.map((m,i)=>({month:m,Passed:ri(200,350,i*11+1),Failed:ri(10,40,i*11+2),Pending:ri(5,20,i*11+3)}))
  const reasonPie = REASONS.map((r,i)=>({name:r,value:ri(20,120,i*13+1)}))
  const catScore = CATEGORIES.map((c,i)=>({name:c,score:ri(75,99,i*17+1)}))
  const passTrend = MO.map((m,i)=>({month:m,rate:ri(88,98,i*19+1),target:95}))
  const defectPie = DEFECT_TYPES.map((d,i)=>({name:d,value:ri(10,60,i*23+1)}))
  const catQuality = CATEGORIES.map((c,i)=>({name:c,score:ri(70,99,i*29+1)}))
  const recoveryTrend = MO.map((m,i)=>({month:m,recovery:ri(40,90,i*31+1)}))
  return {inspections,defects,refurbishments,chargebacks,kpiData,inspTrend,reasonPie,catScore,passTrend,defectPie,catQuality,recoveryTrend}
}

export default function ReturnsQualityCenterView() {
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
    const src = tab===1?data.inspections:tab===2?data.defects:tab===3?data.refurbishments:tab===4?data.chargebacks:[]
    return sortedData(filterData(src as unknown as Record<string,string|number>[],searchQ) as unknown as Record<string,string|number>[],sortField,sortDir)
  },[activeTab,searchQ,sortField,sortDir,data])

  const toggleSort = (f:string) => { if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortField(f); setSortDir("asc") } }

  return (
    <div className="space-y-4">
      <PageHeader title="Returns Quality Center" description="End-to-end quality inspection, defect tracking, refurbishment, and supplier chargeback management" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="rqc-tabs-list">
          {["Quality Dashboard","Inspection Queue","Defect Catalog","Refurbishment","Supplier Chargebacks","Quality Analytics"].map((t,i)=>(
            <TabsTrigger key={i} value={String(i)} className="rqc-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {activeTab==="0" && (
        <div className="space-y-4">
          <div className="rqc-kpi-grid grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.kpiData.map((k,i)=>(
              <Card key={i} className="inner-glow hover-lift-sm glass-subtle rqc-kpi-card"><CardContent className="p-3"><div className="flex items-center gap-2"><k.icon className="h-4 w-4" style={{color:k.color}}/><span className="text-[10px] text-gray-500">{k.label}</span></div><p className="text-lg font-bold mt-1">{k.value}</p><span className="text-[10px] text-emerald-600">{k.trend}</span></CardContent></Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover-lift-sm rqc-chart-card col-span-1"><CardHeader className="pb-1"><CardTitle className="text-xs">Inspection Trend</CardTitle></CardHeader><CardContent><LineChart data={data.inspTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Line type="monotone" dataKey="Passed" stroke={TH.emerald}/><Line type="monotone" dataKey="Failed" stroke={TH.rose}/><Line type="monotone" dataKey="Pending" stroke={TH.amber}/></LineChart></CardContent></Card>
            <Card className="hover-lift-sm rqc-chart-card col-span-1"><CardHeader className="pb-1"><CardTitle className="text-xs">Return Reasons</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.reasonPie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" label={false}>{data.reasonPie.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
            <Card className="hover-lift-sm rqc-chart-card col-span-1"><CardHeader className="pb-1"><CardTitle className="text-xs">Category Quality</CardTitle></CardHeader><CardContent><BarChart data={data.catScore}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:9}} angle={-45}/><YAxis tick={{fontSize:10}}/><Tooltip/><Bar dataKey="score" fill={TH.rose} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
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
                  <th className="rqc-sort-header p-2 text-left cursor-pointer" onClick={()=>toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline"/></th>
                  <th className="rqc-sort-header p-2 text-left">Reason</th><th className="rqc-sort-header p-2 text-left">Category</th><th className="rqc-sort-header p-2 text-left">Status</th><th className="rqc-sort-header p-2 text-left">Grade</th><th className="rqc-sort-header p-2 text-left">Decision</th><th className="rqc-sort-header p-2 text-left">Inspector</th><th className="rqc-sort-header p-2 text-left">Time</th>
                </>}
                {activeTab==="2" && <>
                  <th className="rqc-sort-header p-2 text-left cursor-pointer" onClick={()=>toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline"/></th>
                  <th className="rqc-sort-header p-2 text-left">Defect</th><th className="rqc-sort-header p-2 text-left">Severity</th><th className="rqc-sort-header p-2 text-left">Frequency</th><th className="rqc-sort-header p-2 text-left">Location</th><th className="rqc-sort-header p-2 text-left">Cost</th><th className="rqc-sort-header p-2 text-left">Action</th><th className="rqc-sort-header p-2 text-left">Photos</th>
                </>}
                {activeTab==="3" && <>
                  <th className="rqc-sort-header p-2 text-left cursor-pointer" onClick={()=>toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline"/></th>
                  <th className="rqc-sort-header p-2 text-left">Type</th><th className="rqc-sort-header p-2 text-left">Status</th><th className="rqc-sort-header p-2 text-left">Condition</th><th className="rqc-sort-header p-2 text-left">ROI</th><th className="rqc-sort-header p-2 text-left">Cost</th><th className="rqc-sort-header p-2 text-left">Resale</th><th className="rqc-sort-header p-2 text-left">Tech</th>
                </>}
                {activeTab==="4" && <>
                  <th className="rqc-sort-header p-2 text-left cursor-pointer" onClick={()=>toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline"/></th>
                  <th className="rqc-sort-header p-2 text-left">Category</th><th className="rqc-sort-header p-2 text-left">Status</th><th className="rqc-sort-header p-2 text-left">Amount</th><th className="rqc-sort-header p-2 text-left">Supplier</th><th className="rqc-sort-header p-2 text-left">PO</th><th className="rqc-sort-header p-2 text-left">Evidence</th><th className="rqc-sort-header p-2 text-left">Recovery</th>
                </>}
                <th className="p-2">Action</th>
              </tr></thead>
              <tbody>
                {filtered.map((row,i)=>{
                  const r = row as unknown as Record<string,string|number>
                  return <tr key={i} className="rqc-table-row border-t cursor-pointer hover:bg-rose-50/50" onClick={()=>openSheet(row)}>
                    {activeTab==="1" && <>
                      <td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><ReturnReasonBadge reason={String(r.reason)}/></td><td className="p-2"><CategoryBadge cat={String(r.category)}/></td><td className="p-2"><InspectionStatusBadge status={String(r.status)}/></td><td className="p-2"><ConditionGrade grade={String(r.condition)}/></td><td className="p-2"><DecisionBadge decision={String(r.decision)}/></td><td className="p-2"><InspectorBadge name={String(r.inspector)}/></td><td className="p-2 text-[10px]">{r.timeMin}m</td>
                    </>}
                    {activeTab==="2" && <>
                      <td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><DefectTypeBadge type={String(r.type)}/></td><td className="p-2"><DefectSeverityBadge severity={String(r.severity)}/></td><td className="p-2 text-center">{r.frequency}</td><td className="p-2 text-[10px]">{String(r.location)}</td><td className="p-2"><AmountTile amount={Number(r.cost)}/></td><td className="p-2"><CorrectiveActionBadge status={String(r.caStatus)}/></td><td className="p-2 text-center">{r.photos}</td>
                    </>}
                    {activeTab==="3" && <>
                      <td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><RefurbTypeBadge type={String(r.type)}/></td><td className="p-2"><RefurbStatusBadge status={String(r.status)}/></td><td className="p-2"><ConditionArrow from={String(r.fromCondition)} to={String(r.toCondition)}/></td><td className="p-2"><ROIBadge roi={Number(r.roi)}/></td><td className="p-2"><AmountTile amount={Number(r.cost)}/></td><td className="p-2"><AmountTile amount={Number(r.resale)}/></td><td className="p-2 text-[10px]">{String(r.technician)}</td>
                    </>}
                    {activeTab==="4" && <>
                      <td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><ChargebackCategoryBadge cat={String(r.category)}/></td><td className="p-2"><ChargebackStatusBadge status={String(r.status)}/></td><td className="p-2"><AmountTile amount={Number(r.amount)}/></td><td className="p-2 text-[10px]">{String(r.supplier)}</td><td className="p-2 font-mono text-[10px]">{String(r.po)}</td><td className="p-2 text-center">{r.evidence}</td><td className="p-2 text-[10px]">{r.recovery}%</td>
                    </>}
                    <td className="p-2"><Eye className="h-3.5 w-3.5 text-gray-400 hover:text-rose-600"/></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab==="5" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover-lift-sm rqc-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Pass Rate Trend</CardTitle></CardHeader><CardContent><AreaChart data={data.passTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} domain={[80,100]}/><Tooltip/><Area type="monotone" dataKey="rate" stroke={TH.emerald} fill="rgba(5,150,105,0.15)"/><Line type="monotone" dataKey="target" stroke={TH.amber} strokeDasharray="5 5"/></AreaChart></CardContent></Card>
          <Card className="hover-lift-sm rqc-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Defect Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={data.defectPie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name" label={false}>{data.defectPie.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
          <Card className="hover-lift-sm rqc-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Category Quality</CardTitle></CardHeader><CardContent><BarChart data={data.catQuality}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:9}} angle={-45}/><YAxis tick={{fontSize:10}} domain={[60,100]}/><Tooltip/><Bar dataKey="score" fill={TH.blue} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
          <Card className="hover-lift-sm rqc-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Chargeback Recovery</CardTitle></CardHeader><CardContent><LineChart data={data.recoveryTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} domain={[30,100]}/><Tooltip/><Line type="monotone" dataKey="recovery" stroke={TH.indigo} strokeWidth={2} dot={{r:3}}/></LineChart></CardContent></Card>
        </div>
      )}

      <Sheet open={!!(sheetOpen && selectedRow)} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <div className="rqc-sheet-header bg-gradient-to-r from-rose-600 to-violet-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-lg">
              <SheetTitle className="text-white text-sm">{String(selectedRow?.id || "Details")}</SheetTitle>
            </div>
          </SheetHeader>
          {selectedRow && Object.entries(selectedRow).filter(([k])=>k!=="id").map(([key,val])=>(
            <div key={key} className="rqc-detail-item flex justify-between py-2 px-2 border-b border-gray-100 text-xs"><span className="text-gray-500 capitalize">{key}</span><span className="font-medium">{String(val)}</span></div>
          ))}
        </SheetContent>
      </Sheet>
    </div>
  )
}
