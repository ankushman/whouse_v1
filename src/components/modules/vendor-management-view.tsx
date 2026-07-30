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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
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
  Package,
  DollarSign,
  Truck,
  ShieldCheck,
  Factory,
  Wrench,
  Boxes,
  Eye,
  Phone,
  Mail,
  Calendar,
  Activity,
  Target,
  Percent,
  Zap,
  FileBarChart,
  Sparkles,
  ArrowUpRight,
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
  Legend,
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

type VendorTier = "tier-1" | "tier-2" | "tier-3"
type VendorStatus = "preferred" | "active" | "review" | "suspended"
type VendorCategory = "raw-material" | "components" | "packaging" | "logistics" | "services"

interface Vendor {
  id: string
  code: string
  name: string
  tier: VendorTier
  status: VendorStatus
  category: VendorCategory
  city: string
  state: string
  contact: string
  email: string
  phone: string
  rating: number
  onTimeDelivery: number
  qualityScore: number
  defectRate: number
  totalPOs: number
  activePOs: number
  totalSpend: number
  ytdSpend: number
  leadTimeAvg: number
  leadTimeSLA: number
  paymentTerms: string
  onboardedDate: string
  lastAudit: string
  certificationCount: number
}

// ============================================================================
// Mock data — 16 vendors across categories, tiers, statuses
// ============================================================================

const vendorsData: Vendor[] = [
  { id: "1", code: "VND-001", name: "Bosch Auto Components India", tier: "tier-1", status: "preferred", category: "components", city: "Bangalore", state: "Karnataka", contact: "Rajesh Nair", email: "rajesh.nair@bosch.in", phone: "+91-80-2299-1234", rating: 4.8, onTimeDelivery: 96.5, qualityScore: 98.2, defectRate: 0.3, totalPOs: 412, activePOs: 18, totalSpend: 24500000, ytdSpend: 8200000, leadTimeAvg: 4.2, leadTimeSLA: 5, paymentTerms: "Net-45", onboardedDate: "2019-03-12", lastAudit: "2024-05-15", certificationCount: 6 },
  { id: "2", code: "VND-002", name: "Tata Steel Long Products", tier: "tier-1", status: "preferred", category: "raw-material", city: "Jamshedpur", state: "Jharkhand", contact: "Anita Desai", email: "anita.desai@tatasteel.in", phone: "+91-657-243-0098", rating: 4.7, onTimeDelivery: 94.8, qualityScore: 97.5, defectRate: 0.5, totalPOs: 287, activePOs: 12, totalSpend: 38700000, ytdSpend: 12400000, leadTimeAvg: 6.8, leadTimeSLA: 7, paymentTerms: "Net-60", onboardedDate: "2018-07-22", lastAudit: "2024-04-08", certificationCount: 8 },
  { id: "3", code: "VND-003", name: "Motherson Sumi Wiring Systems", tier: "tier-1", status: "active", category: "components", city: "Noida", state: "Uttar Pradesh", contact: "Vikram Sharma", email: "vikram.s@motherson.com", phone: "+91-120-4567-890", rating: 4.5, onTimeDelivery: 91.2, qualityScore: 95.8, defectRate: 1.2, totalPOs: 356, activePOs: 22, totalSpend: 18200000, ytdSpend: 6300000, leadTimeAvg: 5.4, leadTimeSLA: 5, paymentTerms: "Net-30", onboardedDate: "2020-01-15", lastAudit: "2024-06-20", certificationCount: 5 },
  { id: "4", code: "VND-004", name: "Bharat Forge Ltd", tier: "tier-1", status: "preferred", category: "components", city: "Pune", state: "Maharashtra", contact: "Suresh Iyer", email: "suresh.iyer@bharatforge.com", phone: "+91-20-2613-0808", rating: 4.6, onTimeDelivery: 93.7, qualityScore: 96.9, defectRate: 0.8, totalPOs: 198, activePOs: 9, totalSpend: 31200000, ytdSpend: 9800000, leadTimeAvg: 7.2, leadTimeSLA: 8, paymentTerms: "Net-45", onboardedDate: "2017-11-03", lastAudit: "2024-03-14", certificationCount: 7 },
  { id: "5", code: "VND-005", name: "Uno Minda Electronics", tier: "tier-2", status: "active", category: "components", city: "Manesar", state: "Haryana", contact: "Priya Khanna", email: "priya.k@unominda.com", phone: "+91-124-4385-100", rating: 4.2, onTimeDelivery: 88.5, qualityScore: 93.4, defectRate: 1.8, totalPOs: 245, activePOs: 15, totalSpend: 9800000, ytdSpend: 3400000, leadTimeAvg: 6.1, leadTimeSLA: 6, paymentTerms: "Net-30", onboardedDate: "2021-05-18", lastAudit: "2024-02-22", certificationCount: 4 },
  { id: "6", code: "VND-006", name: "Sundaram Fasteners Ltd", tier: "tier-1", status: "active", category: "components", city: "Chennai", state: "Tamil Nadu", contact: "Lakshmi Narayanan", email: "lakshmi.n@sundaram.in", phone: "+91-44-2498-1234", rating: 4.4, onTimeDelivery: 92.1, qualityScore: 96.2, defectRate: 0.9, totalPOs: 312, activePOs: 14, totalSpend: 8600000, ytdSpend: 2900000, leadTimeAvg: 3.8, leadTimeSLA: 4, paymentTerms: "Net-30", onboardedDate: "2019-09-10", lastAudit: "2024-04-30", certificationCount: 5 },
  { id: "7", code: "VND-007", name: "JK Tyre & Industries", tier: "tier-1", status: "preferred", category: "components", city: "Mysore", state: "Karnataka", contact: "Arun Prasad", email: "arun.prasad@jktyre.com", phone: "+91-80-2214-9876", rating: 4.5, onTimeDelivery: 95.3, qualityScore: 97.1, defectRate: 0.4, totalPOs: 178, activePOs: 7, totalSpend: 16400000, ytdSpend: 5600000, leadTimeAvg: 8.5, leadTimeSLA: 9, paymentTerms: "Net-45", onboardedDate: "2018-02-28", lastAudit: "2024-05-22", certificationCount: 6 },
  { id: "8", code: "VND-008", name: "Gabriel India Ltd", tier: "tier-2", status: "review", category: "components", city: "Hosur", state: "Tamil Nadu", contact: "Sanjay Gupta", email: "sanjay.gabriel@gabriel.in", phone: "+91-4344-234-567", rating: 3.8, onTimeDelivery: 84.6, qualityScore: 91.2, defectRate: 2.4, totalPOs: 142, activePOs: 11, totalSpend: 4200000, ytdSpend: 1800000, leadTimeAvg: 7.8, leadTimeSLA: 6, paymentTerms: "Net-30", onboardedDate: "2022-03-08", lastAudit: "2024-01-15", certificationCount: 3 },
  { id: "9", code: "VND-009", name: "Sandhar Technologies", tier: "tier-2", status: "active", category: "components", city: "Gurugram", state: "Haryana", contact: "Manish Agarwal", email: "manish@sandhar.in", phone: "+91-124-4567-890", rating: 4.0, onTimeDelivery: 89.7, qualityScore: 93.9, defectRate: 1.5, totalPOs: 187, activePOs: 13, totalSpend: 6800000, ytdSpend: 2400000, leadTimeAvg: 5.6, leadTimeSLA: 6, paymentTerms: "Net-30", onboardedDate: "2020-11-22", lastAudit: "2024-03-05", certificationCount: 4 },
  { id: "10", code: "VND-010", name: "Minda Industries Ltd", tier: "tier-1", status: "preferred", category: "components", city: "Noida", state: "Uttar Pradesh", contact: "Deepak Minda", email: "deepak@mindaindustries.com", phone: "+91-120-4567-100", rating: 4.7, onTimeDelivery: 96.1, qualityScore: 98.0, defectRate: 0.5, totalPOs: 268, activePOs: 16, totalSpend: 19800000, ytdSpend: 6700000, leadTimeAvg: 4.8, leadTimeSLA: 5, paymentTerms: "Net-45", onboardedDate: "2018-06-14", lastAudit: "2024-05-08", certificationCount: 7 },
  { id: "11", code: "VND-011", name: "SKF Bearings India", tier: "tier-1", status: "active", category: "components", city: "Bangalore", state: "Karnataka", contact: "Anand Subramaniam", email: "anand.s@skf.in", phone: "+91-80-2234-5678", rating: 4.6, onTimeDelivery: 94.2, qualityScore: 97.5, defectRate: 0.6, totalPOs: 234, activePOs: 10, totalSpend: 15200000, ytdSpend: 5100000, leadTimeAvg: 5.2, leadTimeSLA: 6, paymentTerms: "Net-30", onboardedDate: "2019-04-20", lastAudit: "2024-04-12", certificationCount: 6 },
  { id: "12", code: "VND-012", name: "Suprajit Engineering Ltd", tier: "tier-2", status: "review", category: "components", city: "Bangalore", state: "Karnataka", contact: "Mohan Reddy", email: "mohan.r@suprajit.com", phone: "+91-80-2839-1234", rating: 3.9, onTimeDelivery: 86.3, qualityScore: 92.1, defectRate: 2.1, totalPOs: 134, activePOs: 8, totalSpend: 3800000, ytdSpend: 1500000, leadTimeAvg: 6.4, leadTimeSLA: 5, paymentTerms: "Net-30", onboardedDate: "2021-08-15", lastAudit: "2024-02-10", certificationCount: 3 },
  { id: "13", code: "VND-013", name: "Packaging Plus Industries", tier: "tier-3", status: "active", category: "packaging", city: "Pune", state: "Maharashtra", contact: "Reena Joshi", email: "reena@packagingplus.in", phone: "+91-20-2456-7890", rating: 4.1, onTimeDelivery: 90.8, qualityScore: 94.5, defectRate: 1.3, totalPOs: 412, activePOs: 28, totalSpend: 2400000, ytdSpend: 980000, leadTimeAvg: 2.8, leadTimeSLA: 3, paymentTerms: "Net-15", onboardedDate: "2020-09-05", lastAudit: "2024-04-02", certificationCount: 2 },
  { id: "14", code: "VND-014", name: "BlueDart Express Ltd", tier: "tier-1", status: "preferred", category: "logistics", city: "Mumbai", state: "Maharashtra", contact: "Kunal Bhatia", email: "kunal.b@bluedart.com", phone: "+91-22-4567-8900", rating: 4.5, onTimeDelivery: 95.4, qualityScore: 96.8, defectRate: 0.7, totalPOs: 567, activePOs: 42, totalSpend: 12400000, ytdSpend: 4200000, leadTimeAvg: 1.2, leadTimeSLA: 2, paymentTerms: "Net-15", onboardedDate: "2017-08-12", lastAudit: "2024-05-30", certificationCount: 5 },
  { id: "15", code: "VND-015", name: "Quality Audit Services", tier: "tier-2", status: "active", category: "services", city: "Chennai", state: "Tamil Nadu", contact: "Geeta Iyer", email: "geeta@qas.in", phone: "+91-44-2839-5678", rating: 4.3, onTimeDelivery: 92.5, qualityScore: 95.6, defectRate: 0, totalPOs: 89, activePOs: 6, totalSpend: 1800000, ytdSpend: 620000, leadTimeAvg: 4.0, leadTimeSLA: 5, paymentTerms: "Net-30", onboardedDate: "2022-01-25", lastAudit: "2024-03-18", certificationCount: 4 },
  { id: "16", code: "VND-016", name: "Steel Strips Wheels", tier: "tier-2", status: "suspended", category: "components", city: "Chandigarh", state: "Punjab", contact: "Harjot Singh", email: "harjot@sswl.in", phone: "+91-172-4567-890", rating: 2.8, onTimeDelivery: 72.4, qualityScore: 85.6, defectRate: 4.2, totalPOs: 76, activePOs: 0, totalSpend: 3200000, ytdSpend: 240000, leadTimeAvg: 9.8, leadTimeSLA: 7, paymentTerms: "Net-30", onboardedDate: "2021-12-10", lastAudit: "2024-01-22", certificationCount: 2 },
]

// ============================================================================
// Configs
// ============================================================================

const tierConfig: Record<VendorTier, { label: string; color: string; bg: string; icon: typeof Award }> = {
  "tier-1": { label: "Tier-1 (Strategic)", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", icon: Award },
  "tier-2": { label: "Tier-2 (Approved)", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", icon: ShieldCheck },
  "tier-3": { label: "Tier-3 (Transactional)", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-900", icon: Package },
}

const statusConfig: Record<VendorStatus, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  preferred: { label: "Preferred", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950", border: "border-emerald-300 dark:border-emerald-700", icon: Star },
  active: { label: "Active", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", border: "border-blue-300 dark:border-blue-700", icon: CheckCircle2 },
  review: { label: "Under Review", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950", border: "border-amber-300 dark:border-amber-700", icon: AlertTriangle },
  suspended: { label: "Suspended", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", border: "border-red-300 dark:border-red-700", icon: XCircle },
}

const categoryConfig: Record<VendorCategory, { label: string; color: string; bg: string; icon: typeof Factory; pieColor: string }> = {
  "raw-material": { label: "Raw Materials", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-950", icon: Factory, pieColor: "#f97316" },
  components: { label: "Components", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", icon: Wrench, pieColor: "#3b82f6" },
  packaging: { label: "Packaging", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950", icon: Boxes, pieColor: "#10b981" },
  logistics: { label: "Logistics", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", icon: Truck, pieColor: "#8b5cf6" },
  services: { label: "Services", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-100 dark:bg-cyan-950", icon: Activity, pieColor: "#06b6d4" },
}

// ============================================================================
// 30-day spend trend mock
// ============================================================================

const spendTrend30d = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.now() - (29 - i) * 86_400_000)
  const day = d.getDay()
  const weekend = day === 0 || day === 6
  const base = 320000 + (i * 5000)
  const variance = ((i * 7 + 3) % 5) * 40000
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    spend: weekend ? Math.round(base * 0.4 + variance * 0.3) : Math.round(base + variance),
    pos: weekend ? 8 + (i % 4) : 24 + (i % 8),
  }
})

// ============================================================================
// Component
// ============================================================================

const spendChartConfig = {
  spend: { label: "Spend (₹)", color: "#8b5cf6" },
  pos: { label: "POs", color: "#3b82f6" },
} satisfies ChartConfig

const ratingChartConfig = {
  rating: { label: "Rating", color: "#f59e0b" },
  onTime: { label: "On-Time %", color: "#10b981" },
  quality: { label: "Quality %", color: "#3b82f6" },
} satisfies ChartConfig

const pieConfig = {
  value: { label: "Vendors", color: "#3b82f6" },
} satisfies ChartConfig

export function VendorManagementView() {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedTab, setSelectedTab] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailVendor, setDetailVendor] = useState<Vendor | null>(null)

  const filteredVendors = useMemo(() => {
    return vendorsData.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.code.toLowerCase().includes(search.toLowerCase()) ||
        v.contact.toLowerCase().includes(search.toLowerCase()) ||
        v.city.toLowerCase().includes(search.toLowerCase())
      const matchTier = tierFilter === "all" || v.tier === tierFilter
      const matchStatus = statusFilter === "all" || v.status === statusFilter
      const matchCategory = categoryFilter === "all" || v.category === categoryFilter
      const matchTab =
        selectedTab === "all" ||
        (selectedTab === "preferred" && v.status === "preferred") ||
        (selectedTab === "active" && v.status === "active") ||
        (selectedTab === "review" && v.status === "review") ||
        (selectedTab === "suspended" && v.status === "suspended")
      return matchSearch && matchTier && matchStatus && matchCategory && matchTab
    })
  }, [search, tierFilter, statusFilter, categoryFilter, selectedTab])

  // KPI metrics
  const totalVendors = vendorsData.length
  const preferredVendors = vendorsData.filter((v) => v.status === "preferred").length
  const reviewVendors = vendorsData.filter((v) => v.status === "review").length
  const suspendedVendors = vendorsData.filter((v) => v.status === "suspended").length
  const totalSpend = vendorsData.reduce((s, v) => s + v.ytdSpend, 0)
  const avgOnTime = vendorsData.reduce((s, v) => s + v.onTimeDelivery, 0) / vendorsData.length
  const avgQuality = vendorsData.reduce((s, v) => s + v.qualityScore, 0) / vendorsData.length
  const avgDefect = vendorsData.reduce((s, v) => s + v.defectRate, 0) / vendorsData.length
  const activePOs = vendorsData.reduce((s, v) => s + v.activePOs, 0)
  const avgRating = vendorsData.reduce((s, v) => s + v.rating, 0) / vendorsData.length

  // Category distribution
  const categoryDistribution = useMemo(() => {
    const counts: Record<string, { count: number; spend: number }> = {}
    vendorsData.forEach((v) => {
      if (!counts[v.category]) counts[v.category] = { count: 0, spend: 0 }
      counts[v.category].count += 1
      counts[v.category].spend += v.ytdSpend
    })
    return Object.entries(counts).map(([key, v]) => ({
      name: categoryConfig[key as VendorCategory].label,
      count: v.count,
      spend: v.spend,
      color: categoryConfig[key as VendorCategory].pieColor,
      key,
    }))
  }, [])

  // Top 5 vendors by YTD spend
  const topVendors = useMemo(() => {
    return [...vendorsData].sort((a, b) => b.ytdSpend - a.ytdSpend).slice(0, 5)
  }, [])

  // Vendor rating comparison
  const ratingComparison = useMemo(() => {
    return [...vendorsData]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8)
      .map((v) => ({
        name: v.name.split(" ")[0].slice(0, 8),
        rating: v.rating,
        onTime: v.onTimeDelivery,
        quality: v.qualityScore,
      }))
  }, [])

  const openDetail = (v: Vendor) => {
    setDetailVendor(v)
    setDetailOpen(true)
  }

  const handleExport = () => {
    const rows = filteredVendors.map((v) => ({
      Code: v.code,
      Name: v.name,
      Tier: tierConfig[v.tier].label,
      Status: statusConfig[v.status].label,
      Category: categoryConfig[v.category].label,
      City: v.city,
      State: v.state,
      Contact: v.contact,
      Email: v.email,
      Phone: v.phone,
      Rating: v.rating,
      OnTimeDelivery: v.onTimeDelivery,
      QualityScore: v.qualityScore,
      DefectRate: v.defectRate,
      TotalPOs: v.totalPOs,
      ActivePOs: v.activePOs,
      YTDSpend: v.ytdSpend,
      TotalSpend: v.totalSpend,
      LeadTimeAvg: v.leadTimeAvg,
      LeadTimeSLA: v.leadTimeSLA,
      PaymentTerms: v.paymentTerms,
      Onboarded: v.onboardedDate,
      LastAudit: v.lastAudit,
      Certifications: v.certificationCount,
    }))
    exportToCSV(rows, "vendor-master")
    toast.success("Export complete", `${rows.length} vendors exported to CSV.`)
  }

  const handleRefresh = () => {
    toast.info("Refreshing vendors", "Syncing vendor master from ERP...")
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <PageHeader
        title="Vendor Management"
        description="Supplier performance analytics, scorecard, contract tracking, and procurement insights"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 vendor-kpi-enter">
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                Total Vendors
              </p>
              <Factory className="h-3 w-3 text-blue-500" />
            </div>
            <p className="text-xl font-bold text-number">{totalVendors}</p>
            <p className="text-[10px] text-muted-foreground">{preferredVendors} preferred</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                YTD Spend
              </p>
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-number">₹{(totalSpend / 100000).toFixed(1)}L</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="h-2.5 w-2.5" /> +12.4% YoY
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" />
                Avg On-Time
              </p>
              {avgOnTime >= 92 ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-amber-500" />}
            </div>
            <p className={cn("text-xl font-bold text-number", avgOnTime >= 92 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
              {avgOnTime.toFixed(1)}%
            </p>
            <p className="text-[10px] text-muted-foreground">SLA: ≥92%</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Avg Quality
              </p>
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            </div>
            <p className={cn("text-xl font-bold text-number", avgQuality >= 95 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
              {avgQuality.toFixed(1)}%
            </p>
            <p className="text-[10px] text-muted-foreground">Defect: {avgDefect.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3" />
                Avg Rating
              </p>
              <Award className="h-3 w-3 text-amber-500" />
            </div>
            <p className="text-xl font-bold text-number">{avgRating.toFixed(1)}<span className="text-[10px] font-normal text-muted-foreground">/5</span></p>
            <p className="text-[10px] text-muted-foreground">{preferredVendors} ≥4.5 stars</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Active POs
              </p>
              <Package className="h-3 w-3 text-violet-500" />
            </div>
            <p className="text-xl font-bold text-number">{activePOs}</p>
            <p className="text-[10px] text-muted-foreground">across {totalVendors} vendors</p>
          </CardContent>
        </Card>
      </div>

      {/* Top row charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 30-day spend trend */}
        <Card className="lg:col-span-2 rounded-xl border-border/60 shadow-sm vendor-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-violet-500" />
              30-Day Procurement Spend Trend
            </CardTitle>
            <CardDescription className="text-xs">
              Daily spend (₹) and PO count · YTD total: ₹{(totalSpend / 10000000).toFixed(2)}Cr
            </CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <ChartContainer config={spendChartConfig} className="aspect-[16/6] w-full">
              <AreaChart data={spendTrend30d} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="vendorSpendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={60} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="spend" type="monotone" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#vendorSpendGrad)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category distribution */}
        <Card className="rounded-xl border-border/60 shadow-sm vendor-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Boxes className="h-4 w-4 text-blue-500" />
              Vendor Categories
            </CardTitle>
            <CardDescription className="text-xs">
              {totalVendors} vendors across {categoryDistribution.length} categories
            </CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <ChartContainer config={pieConfig} className="aspect-square w-full max-w-[200px] mx-auto">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={36}
                  outerRadius={64}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {categoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 space-y-1">
              {categoryDistribution.map((c) => (
                <div key={c.key} className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: c.color }} />
                    <span className="text-muted-foreground">{c.name}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{c.count}</span>
                    <span className="text-muted-foreground text-number">₹{(c.spend / 100000).toFixed(0)}L</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top vendors + rating comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 vendors */}
        <Card className="rounded-xl border-border/60 shadow-sm vendor-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Top 5 Vendors by YTD Spend
            </CardTitle>
            <CardDescription className="text-xs">
              Highest-value procurement partners this fiscal year
            </CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0 space-y-2">
            {topVendors.map((v, i) => {
              const initials = v.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              return (
                <div
                  key={v.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/40 transition-colors vendor-row-in cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => openDetail(v)}
                >
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0",
                    i === 0 && "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
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
                    <p className="text-xs font-medium truncate">{v.name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> {v.rating}
                      <span>·</span>
                      {statusConfig[v.status].label}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-number">₹{(v.ytdSpend / 10000000).toFixed(2)}Cr</p>
                    <p className="text-[10px] text-muted-foreground">{v.activePOs} active POs</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Rating comparison chart */}
        <Card className="rounded-xl border-border/60 shadow-sm vendor-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-500" />
              Vendor Performance Comparison
            </CardTitle>
            <CardDescription className="text-xs">
              Top 8 vendors — Rating / On-Time % / Quality % comparison
            </CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <ChartContainer config={ratingChartConfig} className="aspect-[16/8] w-full">
              <BarChart data={ratingComparison} margin={{ top: 4, right: 8, bottom: 0, left: -20 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="onTime" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="quality" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="rating" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-2 flex items-center justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500" /> On-Time</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-blue-500" /> Quality</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-500" /> Rating (×20)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor master table */}
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Vendor Master
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {filteredVendors.length} of {vendorsData.length} vendors · Click row for full scorecard
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="btn-outline-animate h-7 gap-1.5 text-xs" onClick={handleRefresh}>
                <RefreshCw className="h-3 w-3" /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="btn-outline-animate h-7 gap-1.5 text-xs" onClick={handleExport}>
                <Download className="h-3 w-3" /> Export
              </Button>
              <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={() => toast.info("Onboard vendor", "Opening vendor onboarding form...")}>
                <Sparkles className="h-3 w-3" /> Onboard
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
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
                <SelectItem value="tier-1">Tier-1 (Strategic)</SelectItem>
                <SelectItem value="tier-2">Tier-2 (Approved)</SelectItem>
                <SelectItem value="tier-3">Tier-3 (Transactional)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="preferred">Preferred</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 text-xs">
                <Factory className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="raw-material">Raw Materials</SelectItem>
                <SelectItem value="components">Components</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-5 h-8">
              <TabsTrigger value="all" className="text-[10px]">All ({vendorsData.length})</TabsTrigger>
              <TabsTrigger value="preferred" className="text-[10px]">Preferred ({preferredVendors})</TabsTrigger>
              <TabsTrigger value="active" className="text-[10px]">Active ({vendorsData.filter((v) => v.status === "active").length})</TabsTrigger>
              <TabsTrigger value="review" className="text-[10px]">Review ({reviewVendors})</TabsTrigger>
              <TabsTrigger value="suspended" className="text-[10px]">Suspended ({suspendedVendors})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="glass-subtle pt-0">
          <div className="rounded-lg border overflow-hidden">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Vendor</TableHead>
                  <TableHead className="text-xs">Tier / Status</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs text-right">Rating</TableHead>
                  <TableHead className="text-xs text-right">On-Time</TableHead>
                  <TableHead className="text-xs text-right">Quality</TableHead>
                  <TableHead className="text-xs text-right">Defect</TableHead>
                  <TableHead className="text-xs text-right">YTD Spend</TableHead>
                  <TableHead className="text-xs text-right">POs</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((v, idx) => {
                  const tier = tierConfig[v.tier]
                  const status = statusConfig[v.status]
                  const cat = categoryConfig[v.category]
                  const TierIcon = tier.icon
                  const StatusIcon = status.icon
                  const CatIcon = cat.icon
                  const initials = v.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                  return (
                    <TableRow
                      key={v.id}
                      className="cursor-pointer hover:bg-accent/40 transition-colors vendor-row-in"
                      style={{ animationDelay: `${idx * 30}ms` }}
                      onClick={() => openDetail(v)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{v.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{v.code} · {v.city}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <Badge variant="outline" className={cn("text-[9px] w-fit", tier.color, tier.bg)}>
                            <TierIcon className="h-2.5 w-2.5 mr-0.5" /> {tier.label.split(" ")[0]}
                          </Badge>
                          <Badge variant="outline" className={cn("text-[9px] w-fit", status.color, status.bg, status.border)}>
                            <StatusIcon className="h-2.5 w-2.5 mr-0.5" /> {status.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CatIcon className={cn("h-3 w-3", cat.color)} />
                          <span className="text-[10px]">{cat.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className={cn("text-xs font-medium text-number", v.rating >= 4.5 ? "text-emerald-600 dark:text-emerald-400" : v.rating >= 4 ? "text-blue-600 dark:text-blue-400" : v.rating >= 3.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                            {v.rating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn("text-xs font-medium text-number", v.onTimeDelivery >= 92 ? "text-emerald-600 dark:text-emerald-400" : v.onTimeDelivery >= 85 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                          {v.onTimeDelivery.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn("text-xs font-medium text-number", v.qualityScore >= 95 ? "text-emerald-600 dark:text-emerald-400" : v.qualityScore >= 90 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                          {v.qualityScore.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn("text-xs font-medium text-number", v.defectRate <= 1 ? "text-emerald-600 dark:text-emerald-400" : v.defectRate <= 2 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                          {v.defectRate.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs font-medium text-number">₹{(v.ytdSpend / 100000).toFixed(1)}L</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-medium text-number">{v.activePOs}</span>
                          <span className="text-[10px] text-muted-foreground">/ {v.totalPOs}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); openDetail(v) }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredVendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-xs text-muted-foreground">
                      No vendors match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Vendor detail drawer placeholder (drawer to be added next round) */}
      {detailOpen && detailVendor && (
        <VendorQuickDetailDialog
          vendor={detailVendor}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          toast={toast}
        />
      )}
    </div>
  )
}

// ============================================================================
// Inline Vendor Quick Detail Dialog (lightweight — uses simple inline panel)
// ============================================================================

function VendorQuickDetailDialog({
  vendor,
  open,
  onOpenChange,
  toast,
}: {
  vendor: Vendor
  open: boolean
  onOpenChange: (open: boolean) => void
  toast: ReturnType<typeof useToast>
}) {
  // This is a simple inline drawer-like sheet using the existing Sheet pattern
  // To avoid bloating, we re-use the same approach as other detail drawers
  // but inline here. For a full detail drawer, see vendor-detail-drawer.tsx
  // (planned for next round).
  React.useEffect(() => {
    if (open) {
      // No-op; drawer state managed by parent
    }
  }, [open, vendor.id])

  return <VendorDetailSheet vendor={vendor} open={open} onOpenChange={onOpenChange} toast={toast} />
}

// Sheet-based inline drawer (using @/components/ui/sheet)
// Sheet imports moved to top of file

function VendorDetailSheet({
  vendor,
  open,
  onOpenChange,
  toast,
}: {
  vendor: Vendor
  open: boolean
  onOpenChange: (open: boolean) => void
  toast: ReturnType<typeof useToast>
}) {
  const tier = tierConfig[vendor.tier]
  const status = statusConfig[vendor.status]
  const cat = categoryConfig[vendor.category]
  const TierIcon = tier.icon
  const StatusIcon = status.icon
  const CatIcon = cat.icon
  const initials = vendor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  // Performance trend (mock)
  const perfTrend = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(Date.now() - (11 - i) * 30 * 86_400_000).toLocaleDateString("en-IN", { month: "short" }),
    onTime: Math.max(70, Math.min(100, vendor.onTimeDelivery + ((i % 5) - 2) * 1.5)),
    quality: Math.max(75, Math.min(100, vendor.qualityScore + ((i % 4) - 2) * 1.2)),
  }))

  const handleCall = () => toast.info("Calling", `Dialing ${vendor.contact}...`)
  const handleEmail = () => toast.info("Email", `Composing email to ${vendor.email}...`)
  const handleExport = () => {
    exportToCSV([{
      code: vendor.code,
      name: vendor.name,
      tier: tier.label,
      status: status.label,
      rating: vendor.rating,
      onTime: vendor.onTimeDelivery,
      quality: vendor.qualityScore,
      defectRate: vendor.defectRate,
      ytdSpend: vendor.ytdSpend,
    }], `vendor-${vendor.code}`)
    toast.success("Exported", `${vendor.name} scorecard exported.`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header */}
        <SheetHeader className={cn(
          "relative px-5 py-4 border-b vendor-drawer-header",
          "bg-gradient-to-b",
          status.color.replace("text-", "from-").replace("-700", "-500/15"),
          status.color.replace("text-", "via-").replace("-700", "-500/5"),
          "to-transparent",
          status.border
        )}>
          <div className="absolute inset-0 vendor-drawer-sheen pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <Avatar className="h-12 w-12 shrink-0 border-2 vendor-icon-pulse" >
              <AvatarFallback className="text-sm bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-1">
              <SheetTitle className="text-base font-semibold flex items-center gap-2 flex-wrap">
                <span className="truncate">{vendor.name}</span>
                <Badge variant="outline" className={cn("text-[10px] rounded-full", status.color, status.bg, status.border)}>
                  <StatusIcon className="h-3 w-3 mr-1" /> {status.label}
                </Badge>
              </SheetTitle>
              <SheetDescription className="text-xs flex items-center gap-2 flex-wrap">
                <span className="font-mono">{vendor.code}</span>
                <span className="text-muted-foreground">·</span>
                <Badge variant="outline" className={cn("text-[10px]", tier.color, tier.bg)}>
                  <TierIcon className="h-3 w-3 mr-0.5" /> {tier.label}
                </Badge>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-0.5">
                  <CatIcon className={cn("h-3 w-3", cat.color)} /> {cat.label}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" /> {vendor.city}, {vendor.state}
                </span>
              </SheetDescription>
            </div>
          </div>

          {/* Hero stat grid */}
          <div className="relative mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 vendor-stat-enter">
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", status.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3" /> Rating
              </p>
              <p className={cn("text-sm font-bold text-number", vendor.rating >= 4.5 ? "text-emerald-600 dark:text-emerald-400" : vendor.rating >= 4 ? "text-blue-600 dark:text-blue-400" : vendor.rating >= 3.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                {vendor.rating.toFixed(1)}/5
              </p>
              <p className="text-[9px] text-muted-foreground">{vendor.certificationCount} certifications</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", status.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" /> On-Time
              </p>
              <p className={cn("text-sm font-bold text-number", vendor.onTimeDelivery >= 92 ? "text-emerald-600 dark:text-emerald-400" : vendor.onTimeDelivery >= 85 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                {vendor.onTimeDelivery.toFixed(1)}%
              </p>
              <p className="text-[9px] text-muted-foreground">SLA: 92%</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", status.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Quality
              </p>
              <p className={cn("text-sm font-bold text-number", vendor.qualityScore >= 95 ? "text-emerald-600 dark:text-emerald-400" : vendor.qualityScore >= 90 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                {vendor.qualityScore.toFixed(1)}%
              </p>
              <p className="text-[9px] text-muted-foreground">Defect: {vendor.defectRate.toFixed(2)}%</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", status.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> YTD Spend
              </p>
              <p className="text-sm font-bold text-number">₹{(vendor.ytdSpend / 100000).toFixed(1)}L</p>
              <p className="text-[9px] text-muted-foreground">{vendor.activePOs} active POs</p>
            </div>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="p-4 space-y-3 vendor-body-enter min-h-[400px]">
          {/* Contact info */}
          <div className="rounded-xl border bg-card p-3 vendor-card-enter">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
              <Users className="h-3 w-3" /> Primary Contact
            </p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {vendor.contact.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">{vendor.contact}</p>
                  <p className="text-[10px] text-muted-foreground">{vendor.email}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{vendor.phone}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="btn-outline-animate h-7 w-7 p-0" onClick={handleCall}>
                  <Phone className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="btn-outline-animate h-7 w-7 p-0" onClick={handleEmail}>
                  <Mail className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Performance trend */}
          <div className="rounded-xl border bg-card p-3 vendor-card-enter">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
              <Activity className="h-3 w-3" /> 12-Month Performance Trend
            </p>
            <ChartContainer config={ratingChartConfig} className="aspect-[16/6] w-full">
              <LineChart data={perfTrend} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="onTime" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                <Line dataKey="quality" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ChartContainer>
            <div className="mt-2 flex items-center justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500" /> On-Time %</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-blue-500" /> Quality %</span>
            </div>
          </div>

          {/* Contract & operational info */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border bg-card p-3 vendor-card-enter">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                <FileBarChart className="h-3 w-3" /> Contract
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Terms</span>
                  <span className="font-medium">{vendor.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lead Time SLA</span>
                  <span className="font-medium text-number">{vendor.leadTimeSLA}d</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actual Avg</span>
                  <span className={cn("font-medium text-number", vendor.leadTimeAvg <= vendor.leadTimeSLA ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                    {vendor.leadTimeAvg}d
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Onboarded</span>
                  <span className="font-medium text-number">{vendor.onboardedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Audit</span>
                  <span className="font-medium text-number">{vendor.lastAudit}</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-3 vendor-card-enter">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                <Package className="h-3 w-3" /> Procurement
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total POs</span>
                  <span className="font-medium text-number">{vendor.totalPOs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active POs</span>
                  <span className="font-medium text-number">{vendor.activePOs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">YTD Spend</span>
                  <span className="font-medium text-number">₹{(vendor.ytdSpend / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lifetime</span>
                  <span className="font-medium text-number">₹{(vendor.totalSpend / 10000000).toFixed(2)}Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certifications</span>
                  <span className="font-medium text-number">{vendor.certificationCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scorecard breakdown */}
          <div className="rounded-xl border bg-card p-3 vendor-card-enter">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
              <Award className="h-3 w-3" /> Vendor Scorecard
            </p>
            <div className="space-y-2">
              {[
                { label: "On-Time Delivery", value: vendor.onTimeDelivery, target: 92, weight: 30 },
                { label: "Quality Score", value: vendor.qualityScore, target: 95, weight: 30 },
                { label: "Defect Rate (inverted)", value: 100 - vendor.defectRate * 10, target: 95, weight: 20 },
                { label: "Lead Time Compliance", value: (vendor.leadTimeSLA / vendor.leadTimeAvg) * 100, target: 100, weight: 20 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className="text-muted-foreground">{s.label} <span className="text-muted-foreground/60">({s.weight}%)</span></span>
                    <span className={cn("font-medium", s.value >= s.target ? "text-emerald-600 dark:text-emerald-400" : s.value >= s.target - 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
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
                  vendor.rating >= 4.5 ? "text-emerald-600 dark:text-emerald-400" :
                  vendor.rating >= 4 ? "text-blue-600 dark:text-blue-400" :
                  vendor.rating >= 3.5 ? "text-amber-600 dark:text-amber-400" :
                  "text-red-600 dark:text-red-400"
                )}>
                  {((vendor.onTimeDelivery * 0.3 + vendor.qualityScore * 0.3 + (100 - vendor.defectRate * 10) * 0.2 + (vendor.leadTimeSLA / vendor.leadTimeAvg) * 100 * 0.2)).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="btn-outline-animate flex-1 gap-1.5" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" /> Export Scorecard
            </Button>
            <Button variant="outline" size="sm" className="btn-outline-animate flex-1 gap-1.5" onClick={() => toast.info("Schedule audit", `Scheduling audit for ${vendor.name}...`)}>
              <Calendar className="h-3.5 w-3.5" /> Schedule Audit
            </Button>
            <Button variant="outline" size="sm" className="btn-outline-animate flex-1 gap-1.5" onClick={() => toast.info("Renew contract", `Initiating contract renewal for ${vendor.name}...`)}>
              <FileBarChart className="h-3.5 w-3.5" /> Renew
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
