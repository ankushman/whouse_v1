"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Users,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Building2,
  MapPin,
  Star,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Percent,
  Zap,
  Timer,
  ShieldCheck,
  Activity,
  Trophy,
  Eye,
  Phone,
  Mail,
  Calendar,
  FileBarChart,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  Boxes,
  Truck,
  AlertCircle,
  Flame,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ============================================================================
// Types
// ============================================================================

type CustomerTier = "platinum" | "gold" | "silver" | "bronze"
type SLAStatus = "exceeding" | "on-track" | "at-risk" | "breached"
type ServiceType = "inbound" | "outbound" | "cross-dock" | "returns"

interface CustomerSLA {
  id: string
  code: string
  name: string
  tier: CustomerTier
  status: SLAStatus
  city: string
  state: string
  contact: string
  email: string
  phone: string
  contractSLA: number          // % target, e.g. 95
  actualSLA: number            // % actual achieved
  ytdShipments: number
  onTimeCount: number
  delayedCount: number
  breachedCount: number
  avgLeadTime: number          // hours
  slaLeadTime: number          // hours target
  totalValue: number           // ₹ value of shipments YTD
  penaltyRisk: number          // ₹ penalty exposure
  creditRating: number         // 1-5
  lastReview: string
  contractExpiry: string
  activeShipments: number
}

// ============================================================================
// Mock data — 14 customers
// ============================================================================

const customersSLAData: CustomerSLA[] = [
  { id: "1", code: "CUS-001", name: "Maruti Suzuki India Ltd", tier: "platinum", status: "exceeding", city: "Gurugram", state: "Haryana", contact: "Rajeev Sharma", email: "rajeev.sharma@maruti.co.in", phone: "+91-124-4567-890", contractSLA: 98, actualSLA: 98.7, ytdShipments: 1842, onTimeCount: 1818, delayedCount: 18, breachedCount: 6, avgLeadTime: 22.5, slaLeadTime: 24, totalValue: 84200000, penaltyRisk: 0, creditRating: 5, lastReview: "2024-06-15", contractExpiry: "2025-03-31", activeShipments: 42 },
  { id: "2", code: "CUS-002", name: "Tata Motors Ltd", tier: "platinum", status: "on-track", city: "Mumbai", state: "Maharashtra", contact: "Anita Desai", email: "anita.d@tatamotors.com", phone: "+91-22-6665-8282", contractSLA: 96, actualSLA: 96.4, ytdShipments: 1456, onTimeCount: 1404, delayedCount: 38, breachedCount: 14, avgLeadTime: 26.8, slaLeadTime: 28, totalValue: 62400000, penaltyRisk: 240000, creditRating: 5, lastReview: "2024-06-10", contractExpiry: "2024-12-31", activeShipments: 35 },
  { id: "3", code: "CUS-003", name: "Bosch Ltd India", tier: "platinum", status: "exceeding", city: "Bangalore", state: "Karnataka", contact: "Vikram Reddy", email: "vikram.r@bosch.in", phone: "+91-80-2299-1234", contractSLA: 97, actualSLA: 98.2, ytdShipments: 1284, onTimeCount: 1261, delayedCount: 19, breachedCount: 4, avgLeadTime: 18.2, slaLeadTime: 20, totalValue: 48600000, penaltyRisk: 0, creditRating: 5, lastReview: "2024-06-20", contractExpiry: "2025-06-30", activeShipments: 28 },
  { id: "4", code: "CUS-004", name: "Bharat Forge Ltd", tier: "gold", status: "on-track", city: "Pune", state: "Maharashtra", contact: "Suresh Iyer", email: "suresh.i@bharatforge.com", phone: "+91-20-2613-0808", contractSLA: 95, actualSLA: 95.8, ytdShipments: 982, onTimeCount: 941, delayedCount: 32, breachedCount: 9, avgLeadTime: 32.1, slaLeadTime: 36, totalValue: 32400000, penaltyRisk: 180000, creditRating: 4, lastReview: "2024-05-28", contractExpiry: "2024-11-30", activeShipments: 22 },
  { id: "5", code: "CUS-005", name: "Motherson Sumi Systems", tier: "gold", status: "at-risk", city: "Noida", state: "Uttar Pradesh", contact: "Deepak Agarwal", email: "deepak.a@motherson.com", phone: "+91-120-4567-100", contractSLA: 95, actualSLA: 92.3, ytdShipments: 1124, onTimeCount: 1037, delayedCount: 65, breachedCount: 22, avgLeadTime: 38.5, slaLeadTime: 32, totalValue: 28400000, penaltyRisk: 820000, creditRating: 4, lastReview: "2024-05-15", contractExpiry: "2024-09-30", activeShipments: 31 },
  { id: "6", code: "CUS-006", name: "Uno Minda Ltd", tier: "gold", status: "on-track", city: "Manesar", state: "Haryana", contact: "Prakash Khanna", email: "prakash@unominda.com", phone: "+91-124-4385-100", contractSLA: 94, actualSLA: 95.2, ytdShipments: 856, onTimeCount: 815, delayedCount: 30, breachedCount: 11, avgLeadTime: 28.4, slaLeadTime: 30, totalValue: 22400000, penaltyRisk: 220000, creditRating: 4, lastReview: "2024-06-05", contractExpiry: "2025-01-31", activeShipments: 19 },
  { id: "7", code: "CUS-007", name: "Jamna Auto Industries", tier: "silver", status: "on-track", city: "Delhi", state: "Delhi", contact: "Manoj Verma", email: "manoj.v@jamnaauto.in", phone: "+91-11-4567-8900", contractSLA: 92, actualSLA: 93.1, ytdShipments: 642, onTimeCount: 598, delayedCount: 32, breachedCount: 12, avgLeadTime: 42.6, slaLeadTime: 48, totalValue: 12400000, penaltyRisk: 145000, creditRating: 3, lastReview: "2024-04-22", contractExpiry: "2024-10-31", activeShipments: 14 },
  { id: "8", code: "CUS-008", name: "Varroc Polymers Ltd", tier: "silver", status: "at-risk", city: "Aurangabad", state: "Maharashtra", contact: "Kiran Joshi", email: "kiranj@varroc.com", phone: "+91-240-4567-890", contractSLA: 93, actualSLA: 90.8, ytdShipments: 524, onTimeCount: 476, delayedCount: 36, breachedCount: 12, avgLeadTime: 45.2, slaLeadTime: 40, totalValue: 9800000, penaltyRisk: 340000, creditRating: 3, lastReview: "2024-04-10", contractExpiry: "2024-08-31", activeShipments: 16 },
  { id: "9", code: "CUS-009", name: "Endurance Technologies", tier: "gold", status: "exceeding", city: "Aurangabad", state: "Maharashtra", contact: "Sanjay Mehta", email: "sanjay.m@endurance.in", phone: "+91-240-2456-789", contractSLA: 95, actualSLA: 96.8, ytdShipments: 742, onTimeCount: 718, delayedCount: 19, breachedCount: 5, avgLeadTime: 26.8, slaLeadTime: 28, totalValue: 18400000, penaltyRisk: 0, creditRating: 4, lastReview: "2024-06-12", contractExpiry: "2025-04-30", activeShipments: 18 },
  { id: "10", code: "CUS-010", name: "Suprajit Engineering Ltd", tier: "silver", status: "breached", city: "Bangalore", state: "Karnataka", contact: "Mohan Reddy", email: "mohan.r@suprajit.com", phone: "+91-80-2839-1234", contractSLA: 92, actualSLA: 87.4, ytdShipments: 412, onTimeCount: 360, delayedCount: 38, breachedCount: 14, avgLeadTime: 52.4, slaLeadTime: 44, totalValue: 6800000, penaltyRisk: 580000, creditRating: 2, lastReview: "2024-03-15", contractExpiry: "2024-07-31", activeShipments: 12 },
  { id: "11", code: "CUS-011", name: "Minda Industries Ltd", tier: "gold", status: "on-track", city: "Noida", state: "Uttar Pradesh", contact: "Rakesh Minda", email: "rakesh@mindaindustries.com", phone: "+91-120-4567-200", contractSLA: 95, actualSLA: 95.6, ytdShipments: 894, onTimeCount: 855, delayedCount: 30, breachedCount: 9, avgLeadTime: 30.2, slaLeadTime: 32, totalValue: 22600000, penaltyRisk: 195000, creditRating: 4, lastReview: "2024-06-08", contractExpiry: "2025-02-28", activeShipments: 21 },
  { id: "12", code: "CUS-012", name: "SKF Bearings India", tier: "silver", status: "on-track", city: "Bangalore", state: "Karnataka", contact: "Anand Subramaniam", email: "anand.s@skf.in", phone: "+91-80-2234-5678", contractSLA: 94, actualSLA: 94.8, ytdShipments: 568, onTimeCount: 538, delayedCount: 22, breachedCount: 8, avgLeadTime: 28.6, slaLeadTime: 30, totalValue: 14200000, penaltyRisk: 95000, creditRating: 3, lastReview: "2024-05-25", contractExpiry: "2024-12-31", activeShipments: 13 },
  { id: "13", code: "CUS-013", name: "Gabriel India Ltd", tier: "silver", status: "at-risk", city: "Hosur", state: "Tamil Nadu", contact: "Sanjay Gupta", email: "sanjay.gabriel@gabriel.in", phone: "+91-4344-234-567", contractSLA: 92, actualSLA: 91.2, ytdShipments: 384, onTimeCount: 350, delayedCount: 26, breachedCount: 8, avgLeadTime: 48.6, slaLeadTime: 44, totalValue: 5600000, penaltyRisk: 220000, creditRating: 3, lastReview: "2024-04-18", contractExpiry: "2024-09-30", activeShipments: 9 },
  { id: "14", code: "CUS-014", name: "Sandhar Technologies", tier: "bronze", status: "breached", city: "Gurugram", state: "Haryana", contact: "Manish Agarwal", email: "manish@sandhar.in", phone: "+91-124-4567-890", contractSLA: 90, actualSLA: 84.6, ytdShipments: 246, onTimeCount: 208, delayedCount: 28, breachedCount: 10, avgLeadTime: 58.2, slaLeadTime: 48, totalValue: 3400000, penaltyRisk: 410000, creditRating: 2, lastReview: "2024-02-28", contractExpiry: "2024-06-30", activeShipments: 7 },
]

// ============================================================================
// Configs
// ============================================================================

const tierConfig: Record<CustomerTier, { label: string; color: string; bg: string; icon: typeof Trophy; pieColor: string }> = {
  platinum: { label: "Platinum", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", icon: Trophy, pieColor: "#8b5cf6" },
  gold: { label: "Gold", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950", icon: Award, pieColor: "#f59e0b" },
  silver: { label: "Silver", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-900", icon: ShieldCheck, pieColor: "#94a3b8" },
  bronze: { label: "Bronze", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-950", icon: Boxes, pieColor: "#c2410c" },
}

const statusConfig: Record<SLAStatus, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  exceeding: { label: "Exceeding SLA", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950", border: "border-emerald-300 dark:border-emerald-700", icon: TrendingUp },
  "on-track": { label: "On Track", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", border: "border-blue-300 dark:border-blue-700", icon: CheckCircle2 },
  "at-risk": { label: "At Risk", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950", border: "border-amber-300 dark:border-amber-700", icon: AlertTriangle },
  breached: { label: "SLA Breached", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", border: "border-red-300 dark:border-red-700", icon: XCircle },
}

// ============================================================================
// 30-day SLA compliance trend (mock)
// ============================================================================

const slaTrend30d = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.now() - (29 - i) * 86_400_000)
  const day = d.getDay()
  const weekend = day === 0 || day === 6
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    actual: weekend ? 92 + (i % 3) : 94 + (i % 4) + ((i * 7) % 3),
    target: 95,
  }
})

// ============================================================================
// Chart configs
// ============================================================================

const slaChartConfig = {
  actual: { label: "Actual SLA %", color: "#10b981" },
  target: { label: "Target SLA %", color: "#f59e0b" },
} satisfies ChartConfig

const pieConfig = {
  value: { label: "Customers", color: "#3b82f6" },
} satisfies ChartConfig

// ============================================================================
// Component
// ============================================================================

export function CustomerSLAPerformanceView() {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTab, setSelectedTab] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailCustomer, setDetailCustomer] = useState<CustomerSLA | null>(null)

  const filteredCustomers = useMemo(() => {
    return customersSLAData.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.contact.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase())
      const matchTier = tierFilter === "all" || c.tier === tierFilter
      const matchStatus = statusFilter === "all" || c.status === statusFilter
      const matchTab =
        selectedTab === "all" ||
        (selectedTab === "exceeding" && c.status === "exceeding") ||
        (selectedTab === "on-track" && c.status === "on-track") ||
        (selectedTab === "at-risk" && c.status === "at-risk") ||
        (selectedTab === "breached" && c.status === "breached")
      return matchSearch && matchTier && matchStatus && matchTab
    })
  }, [search, tierFilter, statusFilter, selectedTab])

  // KPI metrics
  const totalCustomers = customersSLAData.length
  const exceedingCount = customersSLAData.filter((c) => c.status === "exceeding").length
  const atRiskCount = customersSLAData.filter((c) => c.status === "at-risk").length
  const breachedCount = customersSLAData.filter((c) => c.status === "breached").length
  const avgSLA = customersSLAData.reduce((s, c) => s + c.actualSLA, 0) / customersSLAData.length
  const totalShipments = customersSLAData.reduce((s, c) => s + c.ytdShipments, 0)
  const totalOnTime = customersSLAData.reduce((s, c) => s + c.onTimeCount, 0)
  const totalValue = customersSLAData.reduce((s, c) => s + c.totalValue, 0)
  const totalPenaltyRisk = customersSLAData.reduce((s, c) => s + c.penaltyRisk, 0)
  const overallCompliance = (totalOnTime / totalShipments) * 100
  const activeShipments = customersSLAData.reduce((s, c) => s + c.activeShipments, 0)

  // Tier distribution
  const tierDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    customersSLAData.forEach((c) => {
      counts[c.tier] = (counts[c.tier] || 0) + 1
    })
    return Object.entries(counts).map(([key, count]) => ({
      name: tierConfig[key as CustomerTier].label,
      value: count,
      color: tierConfig[key as CustomerTier].pieColor,
      key,
    }))
  }, [])

  // Top performers (sorted by actualSLA desc, top 5)
  const topPerformers = useMemo(() => {
    return [...customersSLAData].sort((a, b) => b.actualSLA - a.actualSLA).slice(0, 5)
  }, [])

  // Bottom performers (at-risk + breached, sorted by actualSLA asc)
  const bottomPerformers = useMemo(() => {
    return [...customersSLAData]
      .filter((c) => c.status === "at-risk" || c.status === "breached")
      .sort((a, b) => a.actualSLA - b.actualSLA)
      .slice(0, 5)
  }, [])

  // Customer comparison chart data
  const comparisonData = useMemo(() => {
    return [...customersSLAData]
      .sort((a, b) => b.actualSLA - a.actualSLA)
      .slice(0, 10)
      .map((c) => ({
        name: c.name.split(" ")[0].slice(0, 8),
        actual: c.actualSLA,
        target: c.contractSLA,
      }))
  }, [])

  const openDetail = (c: CustomerSLA) => {
    setDetailCustomer(c)
    setDetailOpen(true)
  }

  const handleExport = () => {
    const rows = filteredCustomers.map((c) => ({
      Code: c.code,
      Name: c.name,
      Tier: tierConfig[c.tier].label,
      Status: statusConfig[c.status].label,
      City: c.city,
      State: c.state,
      Contact: c.contact,
      Email: c.email,
      Phone: c.phone,
      ContractSLA: c.contractSLA,
      ActualSLA: c.actualSLA,
      YTDShipments: c.ytdShipments,
      OnTime: c.onTimeCount,
      Delayed: c.delayedCount,
      Breached: c.breachedCount,
      AvgLeadTime: c.avgLeadTime,
      SLALeadTime: c.slaLeadTime,
      TotalValue: c.totalValue,
      PenaltyRisk: c.penaltyRisk,
      CreditRating: c.creditRating,
      LastReview: c.lastReview,
      ContractExpiry: c.contractExpiry,
      ActiveShipments: c.activeShipments,
    }))
    exportToCSV(rows, "customer-sla-performance")
    toast.success("Export complete", `${rows.length} customers exported to CSV.`)
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <PageHeader
        title="Customer SLA Performance"
        description="Cross-customer SLA compliance dashboard, penalty risk tracking, and contract renewal alerts"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 csla-kpi-enter">
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                Total Customers
              </p>
              <Building2 className="h-3 w-3 text-blue-500" />
            </div>
            <p className="text-xl font-bold text-number">{totalCustomers}</p>
            <p className="text-[10px] text-muted-foreground">{activeShipments} active shipments</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" />
                Avg SLA
              </p>
              {avgSLA >= 95 ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-amber-500" />}
            </div>
            <p className={cn("text-xl font-bold text-number", avgSLA >= 95 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
              {avgSLA.toFixed(1)}%
            </p>
            <p className="text-[10px] text-muted-foreground">Target: ≥95%</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Exceeding
              </p>
            </div>
            <p className="text-xl font-bold text-number text-emerald-600 dark:text-emerald-400">{exceedingCount}</p>
            <p className="text-[10px] text-muted-foreground">customers above SLA</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                At Risk
              </p>
            </div>
            <p className="text-xl font-bold text-number text-amber-600 dark:text-amber-400">{atRiskCount}</p>
            <p className="text-[10px] text-muted-foreground">below SLA target</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Breached
              </p>
            </div>
            <p className="text-xl font-bold text-number text-red-600 dark:text-red-400">{breachedCount}</p>
            <p className="text-[10px] text-muted-foreground">critical action needed</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Flame className="h-3 w-3" />
                Penalty Risk
              </p>
            </div>
            <p className="text-xl font-bold text-number text-red-600 dark:text-red-400">₹{(totalPenaltyRisk / 100000).toFixed(1)}L</p>
            <p className="text-[10px] text-muted-foreground">YTD exposure</p>
          </CardContent>
        </Card>
      </div>

      {/* Top row charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 30-day SLA trend */}
        <Card className="lg:col-span-2 rounded-xl border-border/60 shadow-sm csla-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              30-Day SLA Compliance Trend
            </CardTitle>
            <CardDescription className="text-xs">
              Network-wide SLA % vs target · Current: {overallCompliance.toFixed(1)}%
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={slaChartConfig} className="aspect-[16/6] w-full">
              <AreaChart data={slaTrend30d} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="cslaActualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="target" type="monotone" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
                <Area dataKey="actual" type="monotone" stroke="#10b981" strokeWidth={1.8} fill="url(#cslaActualGrad)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tier distribution */}
        <Card className="rounded-xl border-border/60 shadow-sm csla-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-violet-500" />
              Customer Tier Mix
            </CardTitle>
            <CardDescription className="text-xs">
              {totalCustomers} customers · YTD value ₹{(totalValue / 10000000).toFixed(1)}Cr
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={pieConfig} className="aspect-square w-full max-w-[180px] mx-auto">
              <PieChart>
                <Pie
                  data={tierDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={36}
                  outerRadius={64}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {tierDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
              {tierDistribution.map((t) => (
                <div key={t.key} className="flex items-center gap-1 text-[10px]">
                  <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: t.color }} />
                  <span className="text-muted-foreground">{t.name}</span>
                  <span className="font-medium ml-auto">{t.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top + Bottom performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top performers */}
        <Card className="rounded-xl border-border/60 shadow-sm csla-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-500" />
              Top 5 SLA Performers
            </CardTitle>
            <CardDescription className="text-xs">
              Customers exceeding or meeting SLA targets consistently
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {topPerformers.map((c, i) => {
              const initials = c.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/40 transition-colors csla-row-in cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => openDetail(c)}
                >
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0",
                    i === 0 && "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 csla-rank-glow",
                    i === 1 && "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                    i === 2 && "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
                    i > 2 && "bg-muted text-muted-foreground"
                  )}>
                    {i + 1}
                  </span>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className={cn("px-1 rounded-sm", tierConfig[c.tier].bg, tierConfig[c.tier].color)}>{tierConfig[c.tier].label}</span>
                      · {c.activeShipments} active
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-number">{c.actualSLA.toFixed(1)}%</p>
                    <p className="text-[10px] text-muted-foreground text-number">target {c.contractSLA}%</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Bottom performers (at-risk + breached) */}
        <Card className="rounded-xl border-border/60 shadow-sm csla-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              At-Risk & Breached (Action Required)
            </CardTitle>
            <CardDescription className="text-xs">
              Customers with SLA below target — penalty risk ₹{(bottomPerformers.reduce((s, c) => s + c.penaltyRisk, 0) / 100000).toFixed(1)}L
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {bottomPerformers.map((c, i) => {
              const initials = c.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/40 transition-colors csla-row-in cursor-pointer csla-row-warning"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => openDetail(c)}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-[9px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className={cn("px-1 rounded-sm", statusConfig[c.status].bg, statusConfig[c.status].color)}>
                        {statusConfig[c.status].label}
                      </span>
                      · gap {((c.contractSLA - c.actualSLA)).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-xs font-bold text-number", c.status === "breached" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400")}>
                      {c.actualSLA.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-red-600 dark:text-red-400 text-number">₹{(c.penaltyRisk / 100000).toFixed(1)}L risk</p>
                  </div>
                </div>
              )
            })}
            {bottomPerformers.length === 0 && (
              <div className="text-center text-[10px] text-muted-foreground py-6">
                No at-risk or breached customers
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SLA comparison chart */}
      <Card className="rounded-xl border-border/60 shadow-sm csla-chart-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            Customer SLA Comparison (Top 10)
          </CardTitle>
          <CardDescription className="text-xs">
            Actual vs Contract SLA % — bars below the orange line are at risk
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={slaChartConfig} className="aspect-[16/6] w-full">
            <BarChart data={comparisonData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="target" fill="#f59e0b" radius={[3, 3, 0, 0]} fillOpacity={0.4} />
              <Bar dataKey="actual" radius={[3, 3, 0, 0]}>
                {comparisonData.map((entry, i) => (
                  <Cell key={i} fill={entry.actual >= entry.target ? "#10b981" : entry.actual >= entry.target - 3 ? "#f59e0b" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <div className="mt-2 flex items-center justify-center gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-500/40" /> Contract SLA</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500" /> Exceeding</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-500" /> At Risk</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-red-500" /> Breached</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer SLA master table */}
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Customer SLA Master
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {filteredCustomers.length} of {customersSLAData.length} customers · Click row for full SLA scorecard
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => toast.info("Refreshing", "Syncing SLA data from WMS...")}>
                <RefreshCw className="h-3 w-3" /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={handleExport}>
                <Download className="h-3 w-3" /> Export
              </Button>
              <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={() => toast.info("New SLA contract", "Opening SLA contract wizard...")}>
                <Sparkles className="h-3 w-3" /> New Contract
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
            <div className="relative col-span-2 md:col-span-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search name / code / city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-7 text-xs"
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="h-8 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="exceeding">Exceeding</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="breached">Breached</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-5 h-8">
              <TabsTrigger value="all" className="text-[10px]">All ({customersSLAData.length})</TabsTrigger>
              <TabsTrigger value="exceeding" className="text-[10px]">Exceeding ({exceedingCount})</TabsTrigger>
              <TabsTrigger value="on-track" className="text-[10px]">On Track ({customersSLAData.filter((c) => c.status === "on-track").length})</TabsTrigger>
              <TabsTrigger value="at-risk" className="text-[10px]">At Risk ({atRiskCount})</TabsTrigger>
              <TabsTrigger value="breached" className="text-[10px]">Breached ({breachedCount})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs">Tier / Status</TableHead>
                  <TableHead className="text-xs text-right">Contract SLA</TableHead>
                  <TableHead className="text-xs text-right">Actual SLA</TableHead>
                  <TableHead className="text-xs text-right">Shipments</TableHead>
                  <TableHead className="text-xs text-right">On-Time</TableHead>
                  <TableHead className="text-xs text-right">Delayed</TableHead>
                  <TableHead className="text-xs text-right">Breached</TableHead>
                  <TableHead className="text-xs text-right">Penalty Risk</TableHead>
                  <TableHead className="text-xs text-right">YTD Value</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((c, idx) => {
                  const tier = tierConfig[c.tier]
                  const status = statusConfig[c.status]
                  const TierIcon = tier.icon
                  const StatusIcon = status.icon
                  const initials = c.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                  const slaGap = c.actualSLA - c.contractSLA
                  return (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer hover:bg-accent/40 transition-colors csla-row-in"
                      style={{ animationDelay: `${idx * 30}ms` }}
                      onClick={() => openDetail(c)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{c.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{c.code} · {c.city}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <Badge variant="outline" className={cn("text-[9px] w-fit", tier.color, tier.bg)}>
                            <TierIcon className="h-2.5 w-2.5 mr-0.5" /> {tier.label}
                          </Badge>
                          <Badge variant="outline" className={cn("text-[9px] w-fit", status.color, status.bg, status.border)}>
                            <StatusIcon className="h-2.5 w-2.5 mr-0.5" /> {status.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs font-medium text-number">{c.contractSLA}%</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <span className={cn(
                            "text-xs font-bold text-number",
                            c.actualSLA >= c.contractSLA ? "text-emerald-600 dark:text-emerald-400" :
                            c.actualSLA >= c.contractSLA - 3 ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                          )}>
                            {c.actualSLA.toFixed(1)}%
                          </span>
                          <span className={cn(
                            "text-[10px] flex items-center",
                            slaGap >= 0 ? "text-emerald-500" : "text-red-500"
                          )}>
                            {slaGap >= 0 ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                            {Math.abs(slaGap).toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs font-medium text-number">{c.ytdShipments}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 text-number">{c.onTimeCount}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400 text-number">{c.delayedCount}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn("text-xs font-medium text-number", c.breachedCount > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                          {c.breachedCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn("text-xs font-medium text-number", c.penaltyRisk > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                          {c.penaltyRisk > 0 ? `₹${(c.penaltyRisk / 100000).toFixed(1)}L` : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs font-medium text-number">₹{(c.totalValue / 10000000).toFixed(2)}Cr</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); openDetail(c) }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center text-xs text-muted-foreground">
                      No customers match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer SLA detail drawer */}
      <CustomerSLADetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        customer={detailCustomer}
      />
    </div>
  )
}

// ============================================================================
// Customer SLA Detail Drawer (inline multi-tab sheet)
// ============================================================================

interface CustomerSLADetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: CustomerSLA | null
}

function CustomerSLADetailDrawer({ open, onOpenChange, customer }: CustomerSLADetailDrawerProps) {
  const toast = useToast()
  const [selectedTab, setSelectedTab] = React.useState<"overview" | "shipments" | "scorecard" | "penalty" | "contract">("overview")

  React.useEffect(() => {
    if (open) setSelectedTab("overview")
  }, [open, customer?.id])

  if (!customer) return null

  const tier = tierConfig[customer.tier]
  const status = statusConfig[customer.status]
  const TierIcon = tier.icon
  const StatusIcon = status.icon
  const initials = customer.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
  const slaGap = customer.actualSLA - customer.contractSLA
  const onTimePct = (customer.onTimeCount / customer.ytdShipments) * 100

  // Mock 6-month SLA trend
  const sla6m = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.now() - (5 - i) * 30 * 86_400_000)
    const variance = ((i * 7 + 3) % 5) - 2
    return {
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      actual: Math.max(80, Math.min(100, customer.actualSLA + variance)),
      target: customer.contractSLA,
    }
  })

  // Mock recent shipments (5)
  const recentShipments = Array.from({ length: 5 }, (_, i) => {
    const seed = (customer.id.charCodeAt(0) + i * 17) % 1000
    const statuses = ["On-Time", "On-Time", "On-Time", "Delayed", "On-Time"]
    if (customer.status === "breached") statuses[3] = "Breached"
    return {
      id: `SHP-2024-${8000 + seed}`,
      date: new Date(Date.now() - i * 2 * 86_400_000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      type: ["Inbound", "Outbound", "Cross-Dock"][i % 3] as string,
      warehouse: ["Chennai Hub", "Pune DC", "Gurugram NCR", "Bangalore Tech", "Mumbai West"][i],
      status: statuses[i],
      value: 80000 + (seed * 120),
    }
  })

  const handleCall = () => toast.info("Calling", `Dialing ${customer.contact}...`)
  const handleEmail = () => toast.info("Email", `Composing email to ${customer.email}...`)
  const handleExport = () => {
    exportToCSV([{
      code: customer.code,
      name: customer.name,
      tier: tier.label,
      status: status.label,
      actualSLA: customer.actualSLA,
      contractSLA: customer.contractSLA,
      ytdShipments: customer.ytdShipments,
      penaltyRisk: customer.penaltyRisk,
    }], `customer-sla-${customer.code}`)
    toast.success("Exported", `${customer.name} SLA scorecard exported.`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header */}
        <SheetHeader className={cn(
          "relative px-5 py-4 border-b csla-drawer-header",
          "bg-gradient-to-b",
          status.color.replace("text-", "from-").replace("-700", "-500/15"),
          status.color.replace("text-", "via-").replace("-700", "-500/5"),
          "to-transparent",
          status.border
        )}>
          <div className="absolute inset-0 csla-drawer-sheen pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <Avatar className="h-12 w-12 shrink-0 border-2 csla-icon-pulse">
              <AvatarFallback className="text-sm bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-1">
              <SheetTitle className="text-base font-semibold flex items-center gap-2 flex-wrap">
                <span className="truncate">{customer.name}</span>
                <Badge variant="outline" className={cn("text-[10px] rounded-full", status.color, status.bg, status.border)}>
                  <StatusIcon className="h-3 w-3 mr-1" /> {status.label}
                </Badge>
              </SheetTitle>
              <SheetDescription className="text-xs flex items-center gap-2 flex-wrap">
                <span className="font-mono">{customer.code}</span>
                <span className="text-muted-foreground">·</span>
                <Badge variant="outline" className={cn("text-[10px]", tier.color, tier.bg)}>
                  <TierIcon className="h-3 w-3 mr-0.5" /> {tier.label}
                </Badge>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" /> {customer.city}, {customer.state}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-0.5">
                  <Calendar className="h-3 w-3" /> Renewal {customer.contractExpiry}
                </span>
              </SheetDescription>
            </div>
          </div>

          {/* Hero stat grid */}
          <div className="relative mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 csla-stat-enter">
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", status.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" /> Actual SLA
              </p>
              <p className={cn(
                "text-sm font-bold text-number",
                customer.actualSLA >= customer.contractSLA ? "text-emerald-600 dark:text-emerald-400" :
                customer.actualSLA >= customer.contractSLA - 3 ? "text-amber-600 dark:text-amber-400" :
                "text-red-600 dark:text-red-400"
              )}>
                {customer.actualSLA.toFixed(1)}%
              </p>
              <p className="text-[9px] text-muted-foreground">
                Contract: {customer.contractSLA}% · {slaGap >= 0 ? "+" : ""}{slaGap.toFixed(1)}
              </p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", status.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Truck className="h-3 w-3" /> YTD Shipments
              </p>
              <p className="text-sm font-bold text-number">{customer.ytdShipments}</p>
              <p className="text-[9px] text-muted-foreground">{customer.activeShipments} active now</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", status.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Avg Lead Time
              </p>
              <p className={cn("text-sm font-bold text-number", customer.avgLeadTime <= customer.slaLeadTime ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                {customer.avgLeadTime.toFixed(1)}h
              </p>
              <p className="text-[9px] text-muted-foreground">SLA: {customer.slaLeadTime}h</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", status.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Flame className="h-3 w-3" /> Penalty Risk
              </p>
              <p className={cn("text-sm font-bold text-number", customer.penaltyRisk > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                {customer.penaltyRisk > 0 ? `₹${(customer.penaltyRisk / 100000).toFixed(1)}L` : "None"}
              </p>
              <p className="text-[9px] text-muted-foreground">YTD exposure</p>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="relative mt-3 flex gap-1 rounded-lg bg-muted/60 p-0.5 overflow-x-auto">
            {([
              { id: "overview", label: "Overview" },
              { id: "shipments", label: `Shipments (${recentShipments.length})` },
              { id: "scorecard", label: "Scorecard" },
              { id: "penalty", label: "Penalty" },
              { id: "contract", label: "Contract" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTab(t.id)}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium transition-all csla-tab-switch",
                  selectedTab === t.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="p-4 space-y-3 csla-body-enter min-h-[400px]">
          {/* OVERVIEW TAB */}
          {selectedTab === "overview" && (
            <>
              {/* Contact info */}
              <div className="rounded-xl border bg-card p-3 csla-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Primary Contact
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {customer.contact.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{customer.contact}</p>
                      <p className="text-[10px] text-muted-foreground">{customer.email}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={handleCall}>
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={handleEmail}>
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* SLA trend */}
              <div className="rounded-xl border bg-card p-3 csla-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Activity className="h-3 w-3" /> 6-Month SLA Trend
                </p>
                <ChartContainer config={slaChartConfig} className="aspect-[16/6] w-full">
                  <AreaChart data={sla6m} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="cslaDrawerGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area dataKey="target" type="monotone" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
                    <Area dataKey="actual" type="monotone" stroke="#10b981" strokeWidth={1.8} fill="url(#cslaDrawerGrad)" />
                  </AreaChart>
                </ChartContainer>
              </div>

              {/* Shipment summary */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border bg-card p-3 csla-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Boxes className="h-3 w-3" /> Shipment Breakdown
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> On-Time
                      </span>
                      <span className="font-medium text-number">{customer.onTimeCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
                        <Clock className="h-3 w-3" /> Delayed
                      </span>
                      <span className="font-medium text-number">{customer.delayedCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-red-700 dark:text-red-300">
                        <XCircle className="h-3 w-3" /> Breached
                      </span>
                      <span className="font-medium text-number">{customer.breachedCount}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">On-Time %</span>
                      <span className={cn("font-bold text-number", onTimePct >= customer.contractSLA ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                        {onTimePct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-3 csla-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Gauge className="h-3 w-3" /> Credit & Value
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Credit Rating</span>
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={cn("h-2.5 w-2.5", i < customer.creditRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                        ))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">YTD Value</span>
                      <span className="font-medium text-number">₹{(customer.totalValue / 10000000).toFixed(2)}Cr</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Avg Order</span>
                      <span className="font-medium text-number">₹{((customer.totalValue / customer.ytdShipments) / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Last Review</span>
                      <span className="font-medium text-number">{customer.lastReview}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SHIPMENTS TAB */}
          {selectedTab === "shipments" && (
            <div className="rounded-xl border bg-card p-3 csla-card-enter">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                <Truck className="h-3 w-3" /> Recent Shipments
              </p>
              <div className="space-y-1.5">
                {recentShipments.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors csla-row-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn(
                        "rounded-md p-1.5 shrink-0",
                        s.status === "On-Time" && "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
                        s.status === "Delayed" && "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
                        s.status === "Breached" && "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                      )}>
                        <Truck className="h-3 w-3" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-medium">{s.id}</p>
                        <p className="text-[10px] text-muted-foreground">{s.date} · {s.type} · {s.warehouse}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="outline" className={cn(
                        "text-[9px]",
                        s.status === "On-Time" && "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
                        s.status === "Delayed" && "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700",
                        s.status === "Breached" && "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
                      )}>
                        {s.status}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground text-number mt-0.5">₹{s.value.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCORECARD TAB */}
          {selectedTab === "scorecard" && (
            <div className="rounded-xl border bg-card p-3 csla-card-enter">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                <Award className="h-3 w-3" /> SLA Scorecard
              </p>
              <div className="space-y-2">
                {[
                  { label: "On-Time Delivery", value: onTimePct, target: customer.contractSLA, weight: 40 },
                  { label: "Lead Time Compliance", value: (customer.slaLeadTime / customer.avgLeadTime) * 100, target: 100, weight: 25 },
                  { label: "Quality (no defects)", value: 100 - (customer.breachedCount / customer.ytdShipments) * 100, target: 98, weight: 20 },
                  { label: "Documentation Accuracy", value: 96 + (customer.creditRating - 3), target: 95, weight: 15 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="text-muted-foreground">{s.label} <span className="text-muted-foreground/60">({s.weight}%)</span></span>
                      <span className={cn("font-medium", s.value >= s.target ? "text-emerald-600 dark:text-emerald-400" : s.value >= s.target - 3 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                        {s.value.toFixed(1)}% <span className="text-muted-foreground">/ {s.target}%</span>
                      </span>
                    </div>
                    <Progress value={Math.min(100, s.value)} className="h-1" />
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Overall Composite Score</span>
                  <span className={cn(
                    "text-sm font-bold text-number",
                    customer.actualSLA >= customer.contractSLA ? "text-emerald-600 dark:text-emerald-400" :
                    customer.actualSLA >= customer.contractSLA - 3 ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  )}>
                    {((onTimePct * 0.4 + (customer.slaLeadTime / customer.avgLeadTime) * 100 * 0.25 + (100 - (customer.breachedCount / customer.ytdShipments) * 100) * 0.2 + (96 + (customer.creditRating - 3)) * 0.15)).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PENALTY TAB */}
          {selectedTab === "penalty" && (
            <>
              <div className={cn("rounded-xl border p-3 csla-card-enter", customer.penaltyRisk > 0 ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800" : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800")}>
                <div className="flex items-start gap-2">
                  <div className={cn("rounded-lg p-1.5", customer.penaltyRisk > 0 ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400")}>
                    <Flame className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">
                      {customer.penaltyRisk > 0 ? "Penalty Exposure Active" : "No Penalty Exposure"}
                    </p>
                    <p className="text-[11px] mt-0.5 opacity-90">
                      {customer.penaltyRisk > 0
                        ? `YTD penalty risk: ₹${(customer.penaltyRisk / 100000).toFixed(1)}L based on ${customer.breachedCount} SLA breaches.`
                        : "Customer is meeting or exceeding all SLA targets. No penalty clauses triggered."
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-card p-3 csla-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Penalty Calculation</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract SLA Target</span>
                    <span className="font-medium text-number">{customer.contractSLA}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actual SLA Achieved</span>
                    <span className={cn("font-medium text-number", slaGap >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                      {customer.actualSLA.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SLA Gap</span>
                    <span className={cn("font-medium text-number", slaGap >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                      {slaGap >= 0 ? "+" : ""}{slaGap.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Breached Shipments</span>
                    <span className="font-medium text-number text-red-600 dark:text-red-400">{customer.breachedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Penalty per Breach</span>
                    <span className="font-medium text-number">₹{customer.penaltyRisk > 0 ? Math.round(customer.penaltyRisk / Math.max(1, customer.breachedCount)).toLocaleString("en-IN") : "0"}</span>
                  </div>
                  <Separator className="my-1.5" />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Total Penalty Exposure</span>
                    <span className={cn("font-bold text-number", customer.penaltyRisk > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                      ₹{(customer.penaltyRisk / 100000).toFixed(2)}L
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CONTRACT TAB */}
          {selectedTab === "contract" && (
            <div className="rounded-xl border bg-card p-3 csla-card-enter">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                <FileBarChart className="h-3 w-3" /> Contract Details
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Code</span>
                  <span className="font-mono font-medium">{customer.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tier</span>
                  <span className={cn("font-medium", tier.color)}>{tier.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credit Rating</span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={cn("h-2.5 w-2.5", i < customer.creditRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                    ))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SLA Target</span>
                  <span className="font-medium text-number">{customer.contractSLA}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lead Time SLA</span>
                  <span className="font-medium text-number">{customer.slaLeadTime}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last QBR</span>
                  <span className="font-medium text-number">{customer.lastReview}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Expiry</span>
                  <span className="font-medium text-number text-amber-600 dark:text-amber-400">{customer.contractExpiry}</span>
                </div>
                <Separator className="my-1.5" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">YTD Shipment Value</span>
                  <span className="font-medium text-number">₹{(customer.totalValue / 10000000).toFixed(2)}Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Shipments</span>
                  <span className="font-medium text-number">{customer.activeShipments}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => toast.info("Schedule QBR", `Scheduling QBR with ${customer.name}...`)}>
                  <Calendar className="h-3.5 w-3.5" /> Schedule QBR
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => toast.info("Renew contract", `Initiating contract renewal for ${customer.name}...`)}>
                  <FileBarChart className="h-3.5 w-3.5" /> Renew
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" /> Export Scorecard
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => toast.info("Escalation", `Escalating ${customer.name} to senior management...`)}>
            <AlertCircle className="h-3.5 w-3.5" /> Escalate
          </Button>
          <Button size="sm" className="flex-1 gap-1.5" onClick={() => toast.success("Acknowledge", `${customer.name} SLA status acknowledged.`)}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledge
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
