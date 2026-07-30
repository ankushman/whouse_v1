"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import {
  Search, Filter, ArrowUpDown, Download, RefreshCw, TrendingUp,
  TrendingDown, Star, AlertTriangle, CheckCircle2, Clock, Truck,
  IndianRupee, Target, Users, ShieldCheck, ShieldAlert, Eye,
  ArrowUpRight, ArrowDownRight, Package, Timer, BarChart3, Zap,
} from "lucide-react"

// ─── Seed & Helpers ──────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  s = (s * 16807) % 2147483647
  return (s - 1) / 2147483646
}
const pick = <T,>(arr: readonly T[], seed: number) => arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const formatINR = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : `₹${n.toLocaleString("en-IN")}`

// ─── Enums ──────────────────────────────────────────────
const REGIONS = ["North", "South", "East", "West", "Central"] as const
const SLA_TYPES = ["Delivery Time", "Order Accuracy", "Damage Rate", "Return Processing", "POD Compliance", "Pickup Time", "COD Remittance", "Customer Response"] as const
const SLA_STATUSES = ["Compliant", "At Risk", "Non-Compliant", "Under Review", "Exempted"] as const
const CLAIM_TYPES = ["Damage", "Loss", "Delay", "Shortage", "Wrong Delivery", "Overcharge"] as const
const CLAIM_STATUSES = ["Open", "Under Investigation", "Acknowledged", "Settled", "Rejected"] as const
const SEVERITY_LEVELS = ["Critical", "High", "Medium", "Low"] as const
const PARTNER_NAMES = [
  "Delhivery", "BlueDart", "DTDC", "Gati", "XpressBees", "Ecom Express", "Rivigo", "BlackBuck",
  "VRL Logistics", "TCIL", "Mahindra Logistics", "Allcargo", "TCI Express", "SafeExpress", "Shadowfax",
  "Dotzot", "Spoton", "Locus", "ElasticRun", "Moovo", "FarEye", "LogiNext", "FreightFox",
  "Roadzen", "Trukkr", "Vahak", "Porter", "Ninjacart", "Licious Logistics", "Supplynote",
  "Freightwalla", "Shiprocket", "Pickrr", "Shipway", "AfterShip", "ClickPost", "Rivoship",
  "Loadshare", "Eshipz", "Shipsy", "Tiger Logistics", "Navatta", "Javas", "Sical Logistics",
  "TVS Supply Chain", "DHL Supply Chain", "Kuehne+Nagel", "DB Schenker", "Expeditors", "CEVA Logistics",
  "GEODIS", "Dimerco", "Agility", "Logwin", "Hellmann", "Cargo-Partner", "Rhenus", "Omni Logistics",
  "Kintetsu World", "Sankyu India", "Nippon Express",
] as const
const COST_CATEGORIES = ["Freight", "Handling", "Storage", "Last Mile", "Returns"] as const
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const PIE_COLORS = ["#4338ca", "#d97706", "#059669", "#e11d48", "#0891b2"]

// ─── Types ──────────────────────────────────────────────
interface Partner { id: string; name: string; region: string; score: number; onTimePct: number; slaPct: number; monthlyVolume: number; contractValue: number; rating: number; tier: string; trend: number[] }
interface SLARecord { id: string; partner: string; slaType: string; target: number; actual: number; status: string; period: string }
interface CostRecord { id: string; month: string; category: string; actual: number; budget: number; forecast: number }
interface Claim { id: string; claimId: string; partner: string; type: string; status: string; severity: string; amount: number; filedDate: string; resolutionDays: number; stage: number }
type DrawerRecord = Partner | SLARecord | CostRecord | Claim | null

// ─── Data Generation ────────────────────────────────────
let seedCounter = 2067701
const nextSeed = () => ++seedCounter

const partners: Partner[] = PARTNER_NAMES.map((name, i) => {
  const s = nextSeed()
  const score = ri(28, 98, s)
  return {
    id: `P${String(i + 1).padStart(3, "0")}`, name, region: pick(REGIONS, s), score,
    onTimePct: ri(62, 99, s), slaPct: ri(55, 100, s),
    monthlyVolume: ri(1200, 48000, s), contractValue: ri(800000, 85000000, s),
    rating: ri(1, 5, s), tier: score >= 85 ? "Gold" : score >= 70 ? "Silver" : score >= 50 ? "Bronze" : "Standard",
    trend: Array.from({ length: 6 }, () => ri(40, 100, nextSeed())),
  }
})

const slaRecords: SLARecord[] = Array.from({ length: 55 }, (_, i) => {
  const s = nextSeed()
  return { id: `SLA${i + 1}`, partner: pick(PARTNER_NAMES, s), slaType: pick(SLA_TYPES, s), target: ri(90, 100, s), actual: ri(60, 100, s), status: pick(SLA_STATUSES, s), period: `2024-${String(ri(1, 12, s)).padStart(2, "0")}` }
})

const costRecords: CostRecord[] = Array.from({ length: 50 }, (_, i) => {
  const s = nextSeed()
  return { id: `C${i + 1}`, month: pick(MONTHS, s), category: pick(COST_CATEGORIES, s), actual: ri(800000, 12000000, s), budget: ri(800000, 12000000, s), forecast: ri(800000, 12000000, s) }
})

const claims: Claim[] = Array.from({ length: 40 }, (_, i) => {
  const s = nextSeed()
  return { id: `CL${i + 1}`, claimId: `CLM-2024-${String(i + 1).padStart(4, "0")}`, partner: pick(PARTNER_NAMES, s), type: pick(CLAIM_TYPES, s), status: pick(CLAIM_STATUSES, s), severity: pick(SEVERITY_LEVELS, s), amount: ri(5000, 850000, s), filedDate: `2024-${String(ri(1, 12, s)).padStart(2, "0")}-${String(ri(1, 28, s)).padStart(2, "0")}`, resolutionDays: ri(1, 45, s), stage: pick([0, 1, 2, 3] as const, s) }
})

// ─── Chart Data ─────────────────────────────────────────
const monthlyTrend = MONTHS.map((m, i) => ({ month: m, onTime: ri(78, 96, 2067701 + i * 3), cost: ri(70, 95, 2067702 + i * 3), quality: ri(75, 98, 2067703 + i * 3) }))
const partnerDistribution = [{ name: "Gold", value: partners.filter(p => p.tier === "Gold").length }, { name: "Silver", value: partners.filter(p => p.tier === "Silver").length }, { name: "Bronze", value: partners.filter(p => p.tier === "Bronze").length }, { name: "Standard", value: partners.filter(p => p.tier === "Standard").length }]
const slaByCategory = SLA_TYPES.slice(0, 6).map((t, i) => ({ category: t.split(" ")[0], compliant: ri(15, 30, 3000 + i * 7), atRisk: ri(2, 8, 3001 + i * 7), nonCompliant: ri(0, 5, 3002 + i * 7) }))
const costTrend = MONTHS.map((m, i) => ({ month: m, actual: ri(8000000, 15000000, 4000 + i * 3), budget: ri(8000000, 15000000, 4001 + i * 3), forecast: ri(8000000, 15000000, 4002 + i * 3) }))
const costBreakdown = MONTHS.map((m, i) => ({ month: m, Freight: ri(3000000, 7000000, 5000 + i * 5), Handling: ri(1000000, 3000000, 5001 + i * 5), Storage: ri(800000, 2500000, 5002 + i * 5), "Last Mile": ri(1500000, 4000000, 5003 + i * 5), Returns: ri(500000, 2000000, 5004 + i * 5) }))
const quarterlyTrend = ["Q1", "Q2", "Q3", "Q4"].map((q, i) => ({ quarter: q, score: ri(70, 95, 6000 + i * 3), onTime: ri(80, 96, 6001 + i * 3), compliance: ri(75, 98, 6002 + i * 3) }))
const partnerComparison = partners.slice(0, 8).map((p, i) => ({ name: p.name.split(" ")[0].slice(0, 8), onTime: p.onTimePct, cost: ri(65, 95, 7000 + i), quality: ri(70, 98, 7001 + i) }))

const avgScore = +(partners.reduce((a, p) => a + p.score, 0) / partners.length).toFixed(1)
const avgSla = +(slaRecords.filter(s => s.status === "Compliant").length / slaRecords.length * 100).toFixed(1)
const totalContracts = partners.reduce((a, p) => a + p.contractValue, 0)
const openClaimsCount = claims.filter(c => c.status === "Open").length
const avgOnTime = +(partners.reduce((a, p) => a + p.onTimePct, 0) / partners.length).toFixed(1)
const avgResolution = +(claims.reduce((a, c) => a + c.resolutionDays, 0) / claims.length).toFixed(1)
const costVariance = +((costRecords.reduce((a, c) => a + c.actual, 0) - costRecords.reduce((a, c) => a + c.budget, 0)) / costRecords.reduce((a, c) => a + c.budget, 0) * 100).toFixed(1)

// ─── 14 Visual Components ───────────────────────────────

// 1. ScoreBadge
function ScoreBadge({ score }: { score: number }) {
  return <span className={cn("tps-score-badge inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-bold", score >= 80 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : score >= 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : score >= 40 ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300")}>{score}</span>
}

// 2. RegionBadge
function RegionBadge({ region }: { region: string }) {
  const colors: Record<string, string> = { North: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", South: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", East: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", West: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", Central: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300" }
  return <span className={cn("tps-region-badge inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", colors[region] ?? "bg-slate-100 text-slate-700")}>{region}</span>
}

// 3. StarRating
function StarRating({ rating }: { rating: number }) {
  return <span className="tps-star-rating inline-flex items-center gap-0.5">{[1, 2, 3, 4, 5].map(s => (<svg key={s} className={cn("h-3.5 w-3.5", s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600")} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</span>
}

// 4. SLAComplianceGauge
function SLAComplianceGauge({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value))
  const angle = (pct / 100) * 180
  const r = 60, cx = 70, cy = 70
  const x2 = cx + r * Math.cos(((180 - angle) * Math.PI) / 180)
  const y2 = cy - r * Math.sin(((180 - angle) * Math.PI) / 180)
  return (
    <div className="tps-sla-gauge relative flex items-end justify-center">
      <svg viewBox="0 0 140 85" className="w-36 h-24">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={pct >= 90 ? "#059669" : pct >= 70 ? "#d97706" : "#e11d48"} strokeWidth="10" strokeLinecap="round" />
        <text x={cx} y={cy - 12} textAnchor="middle" className="text-lg font-bold" fill={pct >= 90 ? "#059669" : pct >= 70 ? "#d97706" : "#e11d48"}>{pct.toFixed(0)}%</text>
        <text x={cx} y={cy + 6} textAnchor="middle" className="text-[10px]" fill="#64748b">Compliance</text>
      </svg>
    </div>
  )
}

// 5. SLAStatusBadge
function SLAStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = { "Compliant": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", "At Risk": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", "Non-Compliant": "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", "Under Review": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", "Exempted": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" }
  return <span className={cn("tps-sla-status-badge inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", cfg[status] ?? "bg-slate-100 text-slate-600")}>{status}</span>
}

// 6. ClaimTypeBadge
function ClaimTypeBadge({ type }: { type: string }) {
  const cfg: Record<string, string> = { Damage: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300", Loss: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", Delay: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", Shortage: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300", "Wrong Delivery": "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", Overcharge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" }
  return <span className={cn("tps-claim-type-badge inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", cfg[type] ?? "bg-slate-100 text-slate-600")}>{type}</span>
}

// 7. SeverityBadge (with Critical pulse)
function SeverityBadge({ severity }: { severity: string }) {
  const cfg: Record<string, string> = { Critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", High: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300", Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", Low: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" }
  return <span className={cn("tps-severity-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", cfg[severity] ?? "bg-slate-100 text-slate-600", severity === "Critical" && "animate-pulse")}>{severity === "Critical" && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}{severity}</span>
}

// 8. CostVarianceIndicator
function CostVarianceIndicator({ value }: { value: number }) {
  return <span className={cn("tps-cost-variance inline-flex items-center gap-1 text-xs font-semibold", value >= 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>{value >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{value >= 0 ? "+" : ""}{value}%</span>
}

// 9. TrendSparkline
function TrendSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
  const w = 60, h = 20
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ")
  const color = data[data.length - 1] >= data[data.length - 2] ? "#059669" : "#e11d48"
  return <svg viewBox={`0 0 ${w} ${h}`} className="tps-sparkline w-16 h-5"><polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} /></svg>
}

// 10. PartnerTierBadge
function PartnerTierBadge({ tier }: { tier: string }) {
  const cfg: Record<string, string> = { Gold: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300", Silver: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-400", Bronze: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border border-orange-300", Standard: "bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-500 border border-slate-300" }
  return <span className={cn("tps-tier-badge inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", cfg[tier] ?? cfg.Standard)}>{tier}</span>
}

// 11. DeliveryPerformanceBar
function DeliveryPerformanceBar({ onTime, damaged, delayed }: { onTime: number; damaged: number; delayed: number }) {
  const total = onTime + damaged + delayed || 1
  return <div className="tps-delivery-bar flex h-2 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800"><div className="bg-emerald-500" style={{ width: `${(onTime / total) * 100}%` }} /><div className="bg-amber-500" style={{ width: `${(damaged / total) * 100}%` }} /><div className="bg-red-500" style={{ width: `${(delayed / total) * 100}%` }} /></div>
}

// 12. ClaimResolutionTracker
function ClaimResolutionTracker({ stage }: { stage: number }) {
  const stages = ["Filed", "Investigating", "Acknowledged", "Resolved"]
  return <div className="tps-resolution-tracker flex items-center gap-1.5">{stages.map((label, i) => (<div key={label} className="flex items-center gap-1.5"><div className={cn("h-2.5 w-2.5 rounded-full", i <= stage ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700")} title={label} />{i < stages.length - 1 && <div className="h-px w-3 bg-slate-200 dark:bg-slate-700" />}</div>))}</div>
}

// 13. QuarterBadge
function QuarterBadge({ quarter }: { quarter: string }) {
  const colors: Record<string, string> = { Q1: "bg-indigo-100 text-indigo-700", Q2: "bg-emerald-100 text-emerald-700", Q3: "bg-amber-100 text-amber-700", Q4: "bg-rose-100 text-rose-700" }
  return <span className={cn("tps-quarter-badge inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold", colors[quarter] ?? "bg-slate-100 text-slate-600")}>{quarter}</span>
}

// 14. VolumeHeatCell
function VolumeHeatCell({ volume }: { volume: number }) {
  const intensity = Math.min(1, volume / 48000)
  const bg = intensity > 0.75 ? "bg-indigo-600 text-white" : intensity > 0.5 ? "bg-indigo-400 text-white" : intensity > 0.25 ? "bg-indigo-200 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200" : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
  return <span className={cn("tps-heat-cell inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-mono font-semibold", bg)}>{volume.toLocaleString("en-IN")}</span>
}

// ─── Main Component ─────────────────────────────────────
export default function ThreePlPerformanceScorecardView() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("0")
  const [search, setSearch] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [sortCol, setSortCol] = useState("score")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerRecord, setDrawerRecord] = useState<DrawerRecord>(null)

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortCol(col); setSortDir("desc") }
  }

  const filteredPartners = useMemo(() => {
    let list = [...partners]
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (regionFilter !== "all") list = list.filter(p => p.region === regionFilter)
    list.sort((a, b) => { const av = (a as unknown as Record<string, number | string>)[sortCol] as number; const bv = (b as unknown as Record<string, number | string>)[sortCol] as number; return sortDir === "asc" ? av - bv : bv - av })
    return list
  }, [search, regionFilter, sortCol, sortDir])

  const isPartner = (r: DrawerRecord): r is Partner => r !== null && "contractValue" in r
  const isClaim = (r: DrawerRecord): r is Claim => r !== null && "claimId" in r
  const isSLA = (r: DrawerRecord): r is SLARecord => r !== null && "slaType" in r

  const kpis = [
    { label: "Total 3PL Partners", value: partners.length.toString(), icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950" },
    { label: "Avg Score", value: avgScore.toString(), icon: Target, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
    { label: "SLA Compliance %", value: `${avgSla}%`, icon: ShieldCheck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Active Contracts", value: formatINR(totalContracts), icon: IndianRupee, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950" },
    { label: "Open Claims", value: openClaimsCount.toString(), icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950" },
    { label: "On-Time Delivery %", value: `${avgOnTime}%`, icon: Truck, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950" },
    { label: "Cost Variance", value: `${costVariance}%`, icon: TrendingDown, color: costVariance > 0 ? "text-red-600" : "text-emerald-600", bg: costVariance > 0 ? "bg-red-50 dark:bg-red-950" : "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Avg Resolution Days", value: avgResolution.toString(), icon: Timer, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-900" },
  ]

  const analyticsKpis = [
    { label: "Top Partner Score", value: `${Math.max(...partners.map(p => p.score))}`, icon: Star, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
    { label: "Bottom Partner Score", value: `${Math.min(...partners.map(p => p.score))}`, icon: ShieldAlert, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950" },
    { label: "Gold Partners", value: partners.filter(p => p.tier === "Gold").length.toString(), icon: Zap, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
    { label: "Total Monthly Volume", value: partners.reduce((a, p) => a + p.monthlyVolume, 0).toLocaleString("en-IN"), icon: Package, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950" },
    { label: "Avg On-Time", value: `${avgOnTime}%`, icon: Truck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Claims Settled", value: claims.filter(c => c.status === "Settled").length.toString(), icon: CheckCircle2, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950" },
    { label: "Total Claim Amount", value: formatINR(claims.reduce((a, c) => a + c.amount, 0)), icon: IndianRupee, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950" },
    { label: "SLA Exempted", value: slaRecords.filter(s => s.status === "Exempted").length.toString(), icon: ShieldCheck, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-900" },
  ]

  const openDrawer = (record: DrawerRecord) => { setDrawerRecord(record); setDrawerOpen(true) }

  return (
    <div className="tps-root space-y-4 p-4 md:p-6" id="3pl-performance-scorecard">
      <PageHeader title="3PL Performance Scorecard" description="Vendor evaluation, SLA tracking & cost analysis for logistics partners" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="tps-tabs-list grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          {["Scorecard Dashboard", "3PL Partners", "SLA Compliance", "Cost Analysis", "Claims & Disputes", "Performance Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="tps-tab-trigger text-xs">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* TAB 0: Scorecard Dashboard */}
        <TabsContent value="0" className="tps-tab-dashboard space-y-4 mt-4">
          <div className="tps-kpi-grid grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpis.map(k => { const Icon = k.icon; return (
              <Card key={k.label} className="inner-glow hover-lift-sm glass-subtle tps-kpi-card"><CardContent className="flex items-center gap-3 p-4">
                <div className={cn("tps-kpi-icon rounded-lg p-2", k.bg)}><Icon className={cn("h-4 w-4", k.color)} /></div>
                <div><p className="text-[11px] text-muted-foreground">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></div>
              </CardContent></Card>
            )})}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="hover-lift-sm lg:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Score Trend</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={220}><AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="onTime" name="On-Time" stroke="#059669" fill="#059669" fillOpacity={0.15} />
                <Area type="monotone" dataKey="cost" name="Cost Efficiency" stroke="#d97706" fill="#d97706" fillOpacity={0.15} />
                <Area type="monotone" dataKey="quality" name="Quality" stroke="#4338ca" fill="#4338ca" fillOpacity={0.15} />
              </AreaChart></ResponsiveContainer>
            </CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Partner Distribution</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={220}><PieChart>
                <Pie data={partnerDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3} label={({ name, value }) => `${name}: ${value}`}>
                  {partnerDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart></ResponsiveContainer>
            </CardContent></Card>
          </div>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">SLA Compliance by Category</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><BarChart data={slaByCategory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="category" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="compliant" name="Compliant" stackId="a" fill="#059669" /><Bar dataKey="atRisk" name="At Risk" stackId="a" fill="#d97706" /><Bar dataKey="nonCompliant" name="Non-Compliant" stackId="a" fill="#e11d48" />
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
        </TabsContent>

        {/* TAB 1: 3PL Partners */}
        <TabsContent value="1" className="tps-tab-partners space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search partners..." value={search} onChange={e => setSearch(e.target.value)} className="tps-search pl-9 h-9" /></div>
            <div className="flex gap-1">
              <Button variant={regionFilter === "all" ? "default" : "outline"} size="sm" className="press-scale h-8 text-xs" onClick={() => setRegionFilter("all")}>All</Button>
              {REGIONS.map(r => (<Button key={r} variant={regionFilter === r ? "default" : "outline"} size="sm" className="press-scale h-8 text-xs" onClick={() => setRegionFilter(r)}>{r}</Button>))}
            </div>
          </div>
          <Card><CardContent className="inner-glow glass-subtle p-0"><Table><TableHeader><TableRow>
            <TableHead className="cursor-pointer text-xs" onClick={() => handleSort("name")}>Partner <ArrowUpDown className="inline h-3 w-3" /></TableHead>
            <TableHead className="text-xs">Region</TableHead>
            <TableHead className="cursor-pointer text-xs" onClick={() => handleSort("score")}>Score <ArrowUpDown className="inline h-3 w-3" /></TableHead>
            <TableHead className="cursor-pointer text-xs" onClick={() => handleSort("onTimePct")}>On-Time %</TableHead>
            <TableHead className="cursor-pointer text-xs" onClick={() => handleSort("slaPct")}>SLA %</TableHead>
            <TableHead className="cursor-pointer text-xs" onClick={() => handleSort("monthlyVolume")}>Volume</TableHead>
            <TableHead className="cursor-pointer text-xs" onClick={() => handleSort("contractValue")}>Contract</TableHead>
            <TableHead className="text-xs">Rating</TableHead>
          </TableRow></TableHeader><TableBody>
            {filteredPartners.map(p => (
              <TableRow key={p.id} className="tps-partner-row cursor-pointer hover:bg-muted/50" onClick={() => openDrawer(p)}>
                <TableCell className="text-xs font-medium">{p.name}</TableCell>
                <TableCell><RegionBadge region={p.region} /></TableCell>
                <TableCell><ScoreBadge score={p.score} /></TableCell>
                <TableCell className="text-xs font-mono">{p.onTimePct}%</TableCell>
                <TableCell className="text-xs font-mono">{p.slaPct}%</TableCell>
                <TableCell><VolumeHeatCell volume={p.monthlyVolume} /></TableCell>
                <TableCell className="numeric-cell text-xs font-mono">{formatINR(p.contractValue)}</TableCell>
                <TableCell><StarRating rating={p.rating} /></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* TAB 2: SLA Compliance */}
        <TabsContent value="2" className="tps-tab-sla space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="hover-lift-sm flex flex-col items-center justify-center"><CardHeader className="pb-0"><CardTitle className="text-sm text-center">Overall SLA Compliance</CardTitle></CardHeader><CardContent><SLAComplianceGauge value={avgSla} /></CardContent></Card>
            <Card className="hover-lift-sm lg:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Compliance by Status</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={160}><BarChart data={SLA_STATUSES.map(s => ({ status: s, count: slaRecords.filter(r => r.status === s).length }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="status" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Bar dataKey="count" name="Records" radius={[4, 4, 0, 0]}>
                  {SLA_STATUSES.map((_, i) => <Cell key={i} fill={["#059669", "#d97706", "#e11d48", "#4338ca", "#475569"][i]} />)}
                </Bar>
              </BarChart></ResponsiveContainer>
            </CardContent></Card>
          </div>
          <Card><CardContent className="inner-glow glass-subtle p-0"><Table><TableHeader><TableRow>
            <TableHead className="text-xs">Partner</TableHead><TableHead className="text-xs">SLA Type</TableHead><TableHead className="text-xs">Target</TableHead>
            <TableHead className="text-xs">Actual</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">Period</TableHead>
          </TableRow></TableHeader><TableBody>
            {slaRecords.map(r => (
              <TableRow key={r.id} className="tps-sla-row cursor-pointer hover:bg-muted/50" onClick={() => openDrawer(r)}>
                <TableCell className="text-xs font-medium">{r.partner}</TableCell>
                <TableCell className="text-xs">{r.slaType}</TableCell>
                <TableCell className="text-xs font-mono">{r.target}%</TableCell>
                <TableCell className={cn("text-xs font-mono font-bold", r.actual >= r.target ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>{r.actual}%</TableCell>
                <TableCell><SLAStatusBadge status={r.status} /></TableCell>
                <TableCell><QuarterBadge quarter={`Q${Math.ceil(parseInt(r.period.split("-")[1]) / 3)}`} /></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* TAB 3: Cost Analysis */}
        <TabsContent value="3" className="tps-tab-cost space-y-4 mt-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Cost Trend</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={240}><LineChart data={costTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 10000000).toFixed(0)}Cr`} />
              <Tooltip formatter={(v: number) => formatINR(v)} /><Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#4338ca" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="budget" name="Budget" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#d97706" strokeWidth={2} strokeDasharray="2 2" dot={false} />
            </LineChart></ResponsiveContainer>
          </CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Cost Breakdown by Category</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={240}><BarChart data={costBreakdown}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => formatINR(v)} /><Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Freight" stackId="a" fill="#4338ca" /><Bar dataKey="Handling" stackId="a" fill="#d97706" /><Bar dataKey="Storage" stackId="a" fill="#059669" /><Bar dataKey="Last Mile" stackId="a" fill="#e11d48" /><Bar dataKey="Returns" stackId="a" fill="#0891b2" />
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
          <Card><CardContent className="inner-glow glass-subtle p-0"><Table><TableHeader><TableRow>
            <TableHead className="text-xs">ID</TableHead><TableHead className="text-xs">Month</TableHead><TableHead className="text-xs">Category</TableHead>
            <TableHead className="text-xs">Actual</TableHead><TableHead className="text-xs">Budget</TableHead><TableHead className="text-xs">Variance</TableHead>
          </TableRow></TableHeader><TableBody>
            {costRecords.slice(0, 20).map(r => { const variance = +((r.actual - r.budget) / r.budget * 100).toFixed(1); return (
              <TableRow key={r.id} className="tps-cost-row cursor-pointer hover:bg-muted/50" onClick={() => openDrawer(r)}>
                <TableCell className="text-xs font-mono">{r.id}</TableCell><TableCell className="text-xs">{r.month}</TableCell><TableCell className="text-xs">{r.category}</TableCell>
                <TableCell className="text-xs font-mono">{formatINR(r.actual)}</TableCell><TableCell className="text-xs font-mono">{formatINR(r.budget)}</TableCell>
                <TableCell><CostVarianceIndicator value={variance} /></TableCell>
              </TableRow>
            )})}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* TAB 4: Claims & Disputes */}
        <TabsContent value="4" className="tps-tab-claims space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CLAIM_STATUSES.map(s => (<Card key={s}><CardContent className="inner-glow hover-lift-sm glass-subtle p-3 text-center"><p className="text-[11px] text-muted-foreground">{s}</p><p className="text-lg font-bold">{claims.filter(c => c.status === s).length}</p></CardContent></Card>))}
          </div>
          <Card><CardContent className="inner-glow glass-subtle p-0"><Table><TableHeader><TableRow>
            <TableHead className="text-xs">Claim ID</TableHead><TableHead className="text-xs">Partner</TableHead><TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-xs">Severity</TableHead><TableHead className="text-xs">Amount</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">Resolution</TableHead>
          </TableRow></TableHeader><TableBody>
            {claims.map(c => (
              <TableRow key={c.id} className="tps-claim-row cursor-pointer hover:bg-muted/50" onClick={() => openDrawer(c)}>
                <TableCell className="text-xs font-mono">{c.claimId}</TableCell><TableCell className="text-xs font-medium">{c.partner}</TableCell>
                <TableCell><ClaimTypeBadge type={c.type} /></TableCell><TableCell><SeverityBadge severity={c.severity} /></TableCell>
                <TableCell className="numeric-cell text-xs font-mono font-semibold">{formatINR(c.amount)}</TableCell><TableCell><SLAStatusBadge status={c.status} /></TableCell>
                <TableCell><ClaimResolutionTracker stage={c.stage} /></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* TAB 5: Performance Analytics */}
        <TabsContent value="5" className="tps-tab-analytics space-y-4 mt-4">
          <div className="tps-analytics-kpi-grid grid grid-cols-2 md:grid-cols-4 gap-3">
            {analyticsKpis.map(k => { const Icon = k.icon; return (
              <Card key={k.label}><CardContent className="inner-glow hover-lift-sm glass-subtle flex items-center gap-3 p-4">
                <div className={cn("tps-analytics-icon rounded-lg p-2", k.bg)}><Icon className={cn("h-4 w-4", k.color)} /></div>
                <div><p className="text-[11px] text-muted-foreground">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></div>
              </CardContent></Card>
            )})}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Partner Comparison</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={260}><BarChart data={partnerComparison}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="onTime" name="On-Time" fill="#059669" /><Bar dataKey="cost" name="Cost" fill="#d97706" /><Bar dataKey="quality" name="Quality" fill="#4338ca" />
              </BarChart></ResponsiveContainer>
            </CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Quarterly Trend</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={260}><AreaChart data={quarterlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="quarter" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="score" name="Score" stroke="#4338ca" fill="#4338ca" fillOpacity={0.2} />
                <Area type="monotone" dataKey="onTime" name="On-Time" stroke="#059669" fill="#059669" fillOpacity={0.2} />
                <Area type="monotone" dataKey="compliance" name="Compliance" stroke="#d97706" fill="#d97706" fillOpacity={0.2} />
              </AreaChart></ResponsiveContainer>
            </CardContent></Card>
          </div>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Partner Performance Heatmap</CardTitle></CardHeader><CardContent>
            <div className="tps-heatmap-grid grid grid-cols-4 md:grid-cols-8 gap-2">
              {partners.slice(0, 32).map(p => (
                <div key={p.id} className="tps-heatmap-cell rounded-lg border p-2 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => openDrawer(p)}>
                  <p className="text-[10px] font-medium truncate">{p.name.split(" ")[0]}</p>
                  <ScoreBadge score={p.score} />
                  <div className="mt-1"><TrendSparkline data={p.trend} /></div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="tps-drawer w-[420px] sm:w-[480px] overflow-y-auto p-0">
          {drawerRecord && (
            <>
              <div className="tps-drawer-header bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
                <SheetHeader><SheetTitle className="text-white text-base">
                  {isPartner(drawerRecord) ? drawerRecord.name : isClaim(drawerRecord) ? drawerRecord.claimId : isSLA(drawerRecord) ? drawerRecord.id : (drawerRecord as CostRecord).id}
                </SheetTitle></SheetHeader>
                {isPartner(drawerRecord) && <div className="flex items-center gap-2 mt-2"><PartnerTierBadge tier={drawerRecord.tier} /><RegionBadge region={drawerRecord.region} /><StarRating rating={drawerRecord.rating} /></div>}
              </div>
              <div className="tps-drawer-body p-4 space-y-3">
                {isPartner(drawerRecord) && (<>
                  <div className="grid grid-cols-2 gap-2">
                    {[["Score", drawerRecord.score], ["On-Time %", `${drawerRecord.onTimePct}%`], ["SLA %", `${drawerRecord.slaPct}%`], ["Monthly Volume", drawerRecord.monthlyVolume.toLocaleString("en-IN")], ["Contract Value", formatINR(drawerRecord.contractValue)], ["Tier", drawerRecord.tier]].map(([k, v]) => (
                      <div key={k} className="rounded-lg border p-2.5"><p className="text-[10px] text-muted-foreground uppercase">{k}</p><p className="text-sm font-bold">{v}</p></div>
                    ))}
                  </div>
                  <div className="rounded-lg border p-3"><p className="text-[10px] text-muted-foreground uppercase mb-1">6-Month Trend</p><TrendSparkline data={drawerRecord.trend} /></div>
                  <div className="rounded-lg border p-3"><p className="text-[10px] text-muted-foreground uppercase mb-2">Delivery Performance</p><DeliveryPerformanceBar onTime={drawerRecord.onTimePct} damaged={ri(1, 8, 9999)} delayed={Math.max(0, 100 - drawerRecord.onTimePct - 5)} /><div className="flex justify-between mt-1 text-[10px] text-muted-foreground"><span>On-Time</span><span>Damaged</span><span>Delayed</span></div></div>
                </>)}
                {isClaim(drawerRecord) && (<div className="grid grid-cols-2 gap-2">
                  {[["Partner", drawerRecord.partner], ["Type", drawerRecord.type], ["Severity", drawerRecord.severity], ["Amount", formatINR(drawerRecord.amount)], ["Status", drawerRecord.status], ["Filed", drawerRecord.filedDate], ["Resolution", `${drawerRecord.resolutionDays} days`]].map(([k, v]) => (
                    <div key={k} className="rounded-lg border p-2.5"><p className="text-[10px] text-muted-foreground uppercase">{k}</p><p className="text-sm font-bold">{v}</p></div>
                  ))}
                </div>)}
                {isSLA(drawerRecord) && (<div className="grid grid-cols-2 gap-2">
                  {[["Partner", drawerRecord.partner], ["SLA Type", drawerRecord.slaType], ["Target", `${drawerRecord.target}%`], ["Actual", `${drawerRecord.actual}%`], ["Status", drawerRecord.status], ["Period", drawerRecord.period]].map(([k, v]) => (
                    <div key={k} className="rounded-lg border p-2.5"><p className="text-[10px] text-muted-foreground uppercase">{k}</p><p className="text-sm font-bold">{v}</p></div>
                  ))}
                </div>)}
                {!isPartner(drawerRecord) && !isClaim(drawerRecord) && !isSLA(drawerRecord) && (<div className="grid grid-cols-2 gap-2">
                  {[["Month", (drawerRecord as CostRecord).month], ["Category", (drawerRecord as CostRecord).category], ["Actual", formatINR((drawerRecord as CostRecord).actual)], ["Budget", formatINR((drawerRecord as CostRecord).budget)], ["Forecast", formatINR((drawerRecord as CostRecord).forecast)]].map(([k, v]) => (
                    <div key={k} className="rounded-lg border p-2.5"><p className="text-[10px] text-muted-foreground uppercase">{k}</p><p className="text-sm font-bold">{v}</p></div>
                  ))}
                </div>)}
              </div>
              <SheetFooter className="tps-drawer-footer border-t px-4 py-3 flex-row gap-2">
                <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8 text-xs flex-1" onClick={() => toast.success("Exported", "Record exported to CSV successfully")}><Download className="h-3 w-3 mr-1" /> Export</Button>
                <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8 text-xs flex-1" onClick={() => toast.info("Refreshed", "Data refreshed with latest metrics")}><RefreshCw className="h-3 w-3 mr-1" /> Refresh</Button>
                <Button size="sm" className="press-scale h-8 text-xs flex-1" onClick={() => toast.success("Saved", "Changes saved successfully")}><CheckCircle2 className="h-3 w-3 mr-1" /> Save</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}