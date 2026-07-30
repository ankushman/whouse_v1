"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { exportToCSV } from "@/components/shared/export-button"
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
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Boxes,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Star,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Factory,
  Wrench,
  ShieldCheck,
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
  ArrowDownRight,
  Gauge,
  Flame,
  Microscope,
  ClipboardCheck,
  Beaker,
  Crosshair,
  Medal,
  Users,
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

type SupplierTier = "tier-1" | "tier-2" | "tier-3"
type QualityGrade = "excellent" | "good" | "watch" | "critical"
type SupplierCategory = "raw-material" | "components" | "packaging" | "logistics" | "services"
type DefectType = "dimensional" | "surface" | "functional" | "documentation" | "packaging" | "compliance"

interface SupplierQuality {
  id: string
  code: string
  name: string
  tier: SupplierTier
  grade: QualityGrade
  category: SupplierCategory
  city: string
  region: "North" | "South" | "East" | "West"
  contact: string
  email: string
  phone: string
  qualityScore: number          // 0-100 composite
  defectRate: number            // PPM (parts per million)
  onTimeDelivery: number        // %
  fpY: number                   // first pass yield %
  auditScore: number            // 0-100
  openCAPA: number              // count of open corrective actions
  totalBatches: number
  rejectedBatches: number
  ppapApproved: number          // count
  isoCertified: boolean
  lastAudit: string             // ISO date
  nextAudit: string             // ISO date
  copq: number                  // cost of poor quality (₹)
  activeParts: number
  criticalParts: number
  ytdSpend: number
  trend90d: number              // -ve = declining, +ve = improving
}

// ============================================================================
// Mock data — 16 suppliers
// ============================================================================

const suppliersData: SupplierQuality[] = [
  { id: "1", code: "SUP-001", name: "Bosch Auto Components India", tier: "tier-1", grade: "excellent", category: "components", city: "Bangalore", region: "South", contact: "Rajesh Nair", email: "rajesh.nair@bosch.in", phone: "+91-80-2299-1234", qualityScore: 98.2, defectRate: 280, onTimeDelivery: 96.5, fpY: 99.4, auditScore: 96, openCAPA: 1, totalBatches: 412, rejectedBatches: 2, ppapApproved: 48, isoCertified: true, lastAudit: "2024-05-15", nextAudit: "2025-05-15", copq: 142000, activeParts: 48, criticalParts: 8, ytdSpend: 8200000, trend90d: 1.2 },
  { id: "2", code: "SUP-002", name: "Tata Steel Long Products", tier: "tier-1", grade: "excellent", category: "raw-material", city: "Jamshedpur", region: "East", contact: "Anita Desai", email: "anita.desai@tatasteel.in", phone: "+91-657-243-0098", qualityScore: 97.5, defectRate: 480, onTimeDelivery: 94.8, fpY: 98.9, auditScore: 94, openCAPA: 2, totalBatches: 287, rejectedBatches: 4, ppapApproved: 32, isoCertified: true, lastAudit: "2024-04-08", nextAudit: "2025-04-08", copq: 285000, activeParts: 28, criticalParts: 5, ytdSpend: 12400000, trend90d: 0.6 },
  { id: "3", code: "SUP-003", name: "Motherson Sumi Wiring Systems", tier: "tier-1", grade: "good", category: "components", city: "Noida", region: "North", contact: "Vikram Sharma", email: "vikram.s@motherson.com", phone: "+91-120-4567-890", qualityScore: 95.8, defectRate: 1180, onTimeDelivery: 91.2, fpY: 97.6, auditScore: 89, openCAPA: 4, totalBatches: 356, rejectedBatches: 9, ppapApproved: 38, isoCertified: true, lastAudit: "2024-06-20", nextAudit: "2025-06-20", copq: 540000, activeParts: 42, criticalParts: 6, ytdSpend: 6300000, trend90d: -0.4 },
  { id: "4", code: "SUP-004", name: "Bharat Forge Ltd", tier: "tier-1", grade: "excellent", category: "components", city: "Pune", region: "West", contact: "Suresh Iyer", email: "suresh.iyer@bharatforge.com", phone: "+91-20-2613-0808", qualityScore: 96.9, defectRate: 720, onTimeDelivery: 93.7, fpY: 98.4, auditScore: 92, openCAPA: 2, totalBatches: 198, rejectedBatches: 3, ppapApproved: 26, isoCertified: true, lastAudit: "2024-03-14", nextAudit: "2025-03-14", copq: 198000, activeParts: 32, criticalParts: 9, ytdSpend: 9800000, trend90d: 0.8 },
  { id: "5", code: "SUP-005", name: "Uno Minda Electronics", tier: "tier-2", grade: "good", category: "components", city: "Manesar", region: "North", contact: "Priya Khanna", email: "priya.k@unominda.com", phone: "+91-124-4385-100", qualityScore: 93.4, defectRate: 1820, onTimeDelivery: 88.5, fpY: 96.2, auditScore: 86, openCAPA: 5, totalBatches: 245, rejectedBatches: 12, ppapApproved: 22, isoCertified: true, lastAudit: "2024-02-22", nextAudit: "2025-02-22", copq: 412000, activeParts: 26, criticalParts: 3, ytdSpend: 3400000, trend90d: -1.1 },
  { id: "6", code: "SUP-006", name: "Sundaram Fasteners Ltd", tier: "tier-1", grade: "excellent", category: "components", city: "Chennai", region: "South", contact: "Lakshmi Narayanan", email: "lakshmi.n@sundaram.in", phone: "+91-44-2498-1234", qualityScore: 96.2, defectRate: 850, onTimeDelivery: 92.1, fpY: 98.1, auditScore: 90, openCAPA: 2, totalBatches: 312, rejectedBatches: 5, ppapApproved: 34, isoCertified: true, lastAudit: "2024-04-30", nextAudit: "2025-04-30", copq: 215000, activeParts: 38, criticalParts: 4, ytdSpend: 2900000, trend90d: 0.5 },
  { id: "7", code: "SUP-007", name: "JK Tyre & Industries", tier: "tier-1", grade: "excellent", category: "components", city: "Mysore", region: "South", contact: "Arun Prasad", email: "arun.prasad@jktyre.com", phone: "+91-80-2214-9876", qualityScore: 97.1, defectRate: 380, onTimeDelivery: 95.3, fpY: 99.0, auditScore: 93, openCAPA: 1, totalBatches: 178, rejectedBatches: 2, ppapApproved: 28, isoCertified: true, lastAudit: "2024-05-22", nextAudit: "2025-05-22", copq: 168000, activeParts: 24, criticalParts: 6, ytdSpend: 5600000, trend90d: 0.9 },
  { id: "8", code: "SUP-008", name: "Gabriel India Ltd", tier: "tier-2", grade: "watch", category: "components", city: "Hosur", region: "South", contact: "Sanjay Gupta", email: "sanjay.gabriel@gabriel.in", phone: "+91-4344-234-567", qualityScore: 91.2, defectRate: 2410, onTimeDelivery: 84.6, fpY: 94.8, auditScore: 78, openCAPA: 8, totalBatches: 142, rejectedBatches: 14, ppapApproved: 18, isoCertified: true, lastAudit: "2024-01-15", nextAudit: "2025-01-15", copq: 685000, activeParts: 22, criticalParts: 2, ytdSpend: 1800000, trend90d: -2.4 },
  { id: "9", code: "SUP-009", name: "Sandhar Technologies", tier: "tier-2", grade: "good", category: "components", city: "Gurugram", region: "North", contact: "Manish Agarwal", email: "manish@sandhar.in", phone: "+91-124-4567-890", qualityScore: 93.9, defectRate: 1490, onTimeDelivery: 89.7, fpY: 96.7, auditScore: 85, openCAPA: 3, totalBatches: 187, rejectedBatches: 8, ppapApproved: 24, isoCertified: true, lastAudit: "2024-03-05", nextAudit: "2025-03-05", copq: 348000, activeParts: 30, criticalParts: 3, ytdSpend: 2400000, trend90d: -0.2 },
  { id: "10", code: "SUP-010", name: "Minda Industries Ltd", tier: "tier-1", grade: "excellent", category: "components", city: "Noida", region: "North", contact: "Deepak Minda", email: "deepak@mindaindustries.com", phone: "+91-120-4567-100", qualityScore: 98.0, defectRate: 490, onTimeDelivery: 96.1, fpY: 99.2, auditScore: 95, openCAPA: 1, totalBatches: 268, rejectedBatches: 3, ppapApproved: 36, isoCertified: true, lastAudit: "2024-05-08", nextAudit: "2025-05-08", copq: 156000, activeParts: 44, criticalParts: 7, ytdSpend: 6700000, trend90d: 1.4 },
  { id: "11", code: "SUP-011", name: "SKF Bearings India", tier: "tier-1", grade: "excellent", category: "components", city: "Bangalore", region: "South", contact: "Anand Subramaniam", email: "anand.s@skf.in", phone: "+91-80-2234-5678", qualityScore: 97.5, defectRate: 580, onTimeDelivery: 94.2, fpY: 98.7, auditScore: 92, openCAPA: 2, totalBatches: 234, rejectedBatches: 4, ppapApproved: 30, isoCertified: true, lastAudit: "2024-04-12", nextAudit: "2025-04-12", copq: 198000, activeParts: 32, criticalParts: 5, ytdSpend: 5100000, trend90d: 0.7 },
  { id: "12", code: "SUP-012", name: "Suprajit Engineering Ltd", tier: "tier-2", grade: "watch", category: "components", city: "Bangalore", region: "South", contact: "Mohan Reddy", email: "mohan.r@suprajit.com", phone: "+91-80-2839-1234", qualityScore: 92.1, defectRate: 2080, onTimeDelivery: 86.3, fpY: 95.5, auditScore: 80, openCAPA: 6, totalBatches: 134, rejectedBatches: 11, ppapApproved: 16, isoCertified: true, lastAudit: "2024-02-10", nextAudit: "2025-02-10", copq: 478000, activeParts: 18, criticalParts: 1, ytdSpend: 1500000, trend90d: -1.8 },
  { id: "13", code: "SUP-013", name: "Packaging Plus Industries", tier: "tier-3", grade: "good", category: "packaging", city: "Pune", region: "West", contact: "Reena Joshi", email: "reena@packagingplus.in", phone: "+91-20-2456-7890", qualityScore: 94.5, defectRate: 1280, onTimeDelivery: 90.8, fpY: 97.1, auditScore: 84, openCAPA: 3, totalBatches: 412, rejectedBatches: 14, ppapApproved: 12, isoCertified: false, lastAudit: "2024-04-02", nextAudit: "2025-04-02", copq: 95000, activeParts: 36, criticalParts: 0, ytdSpend: 980000, trend90d: 0.3 },
  { id: "14", code: "SUP-014", name: "BlueDart Express Ltd", tier: "tier-1", grade: "excellent", category: "logistics", city: "Mumbai", region: "West", contact: "Kunal Bhatia", email: "kunal.b@bluedart.com", phone: "+91-22-4567-8900", qualityScore: 96.8, defectRate: 690, onTimeDelivery: 95.4, fpY: 98.6, auditScore: 91, openCAPA: 1, totalBatches: 567, rejectedBatches: 6, ppapApproved: 18, isoCertified: true, lastAudit: "2024-05-30", nextAudit: "2025-05-30", copq: 124000, activeParts: 22, criticalParts: 0, ytdSpend: 4200000, trend90d: 1.0 },
  { id: "15", code: "SUP-015", name: "Quality Audit Services", tier: "tier-2", grade: "good", category: "services", city: "Chennai", region: "South", contact: "Geeta Iyer", email: "geeta@qas.in", phone: "+91-44-2839-5678", qualityScore: 95.6, defectRate: 0, onTimeDelivery: 92.5, fpY: 99.5, auditScore: 88, openCAPA: 0, totalBatches: 89, rejectedBatches: 0, ppapApproved: 8, isoCertified: true, lastAudit: "2024-03-18", nextAudit: "2025-03-18", copq: 0, activeParts: 12, criticalParts: 0, ytdSpend: 620000, trend90d: 0.2 },
  { id: "16", code: "SUP-016", name: "Steel Strips Wheels", tier: "tier-2", grade: "critical", category: "components", city: "Chandigarh", region: "North", contact: "Harjot Singh", email: "harjot@sswl.in", phone: "+91-172-4567-890", qualityScore: 85.6, defectRate: 4180, onTimeDelivery: 72.4, fpY: 92.3, auditScore: 70, openCAPA: 12, totalBatches: 76, rejectedBatches: 18, ppapApproved: 8, isoCertified: true, lastAudit: "2024-01-22", nextAudit: "2025-01-22", copq: 1240000, activeParts: 14, criticalParts: 4, ytdSpend: 240000, trend90d: -3.8 },
]

// ============================================================================
// Configs
// ============================================================================

const tierConfig: Record<SupplierTier, { label: string; color: string; bg: string; icon: typeof Award }> = {
  "tier-1": { label: "Tier-1 (Strategic)", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", icon: Award },
  "tier-2": { label: "Tier-2 (Approved)", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", icon: ShieldCheck },
  "tier-3": { label: "Tier-3 (Transactional)", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-900", icon: Package },
}

const gradeConfig: Record<QualityGrade, {
  label: string
  color: string
  bg: string
  border: string
  icon: typeof CheckCircle2
  pieColor: string
}> = {
  excellent: { label: "Excellent", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950", border: "border-emerald-300 dark:border-emerald-700", icon: Star, pieColor: "#10b981" },
  good: { label: "Good", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", border: "border-blue-300 dark:border-blue-700", icon: CheckCircle2, pieColor: "#3b82f6" },
  watch: { label: "Watch", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950", border: "border-amber-300 dark:border-amber-700", icon: AlertTriangle, pieColor: "#f59e0b" },
  critical: { label: "Critical", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", border: "border-red-300 dark:border-red-700", icon: XCircle, pieColor: "#ef4444" },
}

const categoryConfig: Record<SupplierCategory, { label: string; color: string; bg: string; icon: typeof Factory; pieColor: string }> = {
  "raw-material": { label: "Raw Materials", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-950", icon: Factory, pieColor: "#f97316" },
  components: { label: "Components", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", icon: Wrench, pieColor: "#3b82f6" },
  packaging: { label: "Packaging", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950", icon: Boxes, pieColor: "#10b981" },
  logistics: { label: "Logistics", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", icon: Package, pieColor: "#8b5cf6" },
  services: { label: "Services", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-100 dark:bg-cyan-950", icon: Activity, pieColor: "#06b6d4" },
}

// ============================================================================
// 30-day defect rate trend mock
// ============================================================================

const defectTrend30d = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.now() - (29 - i) * 86_400_000)
  const day = d.getDay()
  const weekend = day === 0 || day === 6
  const base = 980 + (i % 7) * 40
  const variance = ((i * 11 + 7) % 9) * 80
  const spike = i === 14 ? 320 : 0  // quality incident on day 15
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    defectRate: weekend ? Math.round(base * 0.6 + variance * 0.4) : Math.round(base + variance + spike),
    target: 1000,
    fpy: weekend ? 99.4 - (i % 3) * 0.1 : 98.7 - (i % 5) * 0.15 - (spike ? 1.8 : 0),
  }
})

// ============================================================================
// Chart configs
// ============================================================================

const defectChartConfig = {
  defectRate: { label: "Defect Rate (PPM)", color: "#ef4444" },
  target: { label: "Target (1000 PPM)", color: "#94a3b8" },
} satisfies ChartConfig

const fpyChartConfig = {
  fpy: { label: "First Pass Yield %", color: "#10b981" },
} satisfies ChartConfig

const pieConfig = {
  value: { label: "Suppliers", color: "#3b82f6" },
} satisfies ChartConfig

const scoreComparisonConfig = {
  score: { label: "Quality Score", color: "#3b82f6" },
  audit: { label: "Audit Score", color: "#8b5cf6" },
} satisfies ChartConfig

// ============================================================================
// Main Component
// ============================================================================

export function SupplierQualityScorecardView() {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [selectedTab, setSelectedTab] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailSupplier, setDetailSupplier] = useState<SupplierQuality | null>(null)

  const filteredSuppliers = useMemo(() => {
    return suppliersData.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.contact.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase())
      const matchTier = tierFilter === "all" || s.tier === tierFilter
      const matchGrade = gradeFilter === "all" || s.grade === gradeFilter
      const matchCategory = categoryFilter === "all" || s.category === categoryFilter
      const matchRegion = regionFilter === "all" || s.region === regionFilter
      const matchTab = selectedTab === "all" || s.grade === selectedTab
      return matchSearch && matchTier && matchGrade && matchCategory && matchRegion && matchTab
    })
  }, [search, tierFilter, gradeFilter, categoryFilter, regionFilter, selectedTab])

  // KPI metrics
  const totalSuppliers = suppliersData.length
  const excellentCount = suppliersData.filter((s) => s.grade === "excellent").length
  const watchCount = suppliersData.filter((s) => s.grade === "watch").length
  const criticalCount = suppliersData.filter((s) => s.grade === "critical").length
  const avgQuality = suppliersData.reduce((s, v) => s + v.qualityScore, 0) / suppliersData.length
  const avgDefect = suppliersData.reduce((s, v) => s + v.defectRate, 0) / suppliersData.length
  const avgFPY = suppliersData.reduce((s, v) => s + v.fpY, 0) / suppliersData.length
  const avgOnTime = suppliersData.reduce((s, v) => s + v.onTimeDelivery, 0) / suppliersData.length
  const openCAPATotal = suppliersData.reduce((s, v) => s + v.openCAPA, 0)
  const totalCOPQ = suppliersData.reduce((s, v) => s + v.copq, 0)
  const totalRejected = suppliersData.reduce((s, v) => s + v.rejectedBatches, 0)
  const totalBatches = suppliersData.reduce((s, v) => s + v.totalBatches, 0)
  const auditPending = suppliersData.filter((s) => {
    const days = (new Date(s.nextAudit).getTime() - Date.now()) / 86_400_000
    return days < 120
  }).length

  // Category distribution
  const categoryDistribution = useMemo(() => {
    const counts: Record<string, { count: number; copq: number }> = {}
    suppliersData.forEach((s) => {
      if (!counts[s.category]) counts[s.category] = { count: 0, copq: 0 }
      counts[s.category].count += 1
      counts[s.category].copq += s.copq
    })
    return Object.entries(counts).map(([key, v]) => ({
      name: categoryConfig[key as SupplierCategory].label,
      count: v.count,
      copq: v.copq,
      color: categoryConfig[key as SupplierCategory].pieColor,
      key,
    }))
  }, [])

  // Grade distribution
  const gradeDistribution = useMemo(() => {
    const counts: Record<string, number> = { excellent: 0, good: 0, watch: 0, critical: 0 }
    suppliersData.forEach((s) => { counts[s.grade] += 1 })
    return Object.entries(counts).map(([key, value]) => ({
      name: gradeConfig[key as QualityGrade].label,
      value,
      color: gradeConfig[key as QualityGrade].pieColor,
      key,
    }))
  }, [])

  // Top 5 best performers
  const topPerformers = useMemo(() => {
    return [...suppliersData].sort((a, b) => b.qualityScore - a.qualityScore).slice(0, 5)
  }, [])

  // Bottom 5 at-risk suppliers
  const atRiskSuppliers = useMemo(() => {
    return [...suppliersData]
      .filter((s) => s.grade === "watch" || s.grade === "critical")
      .sort((a, b) => a.qualityScore - b.qualityScore)
      .slice(0, 5)
  }, [])

  // Score comparison (top 10 by spend)
  const scoreComparison = useMemo(() => {
    return [...suppliersData]
      .sort((a, b) => b.ytdSpend - a.ytdSpend)
      .slice(0, 10)
      .map((s) => ({
        name: s.name.split(" ")[0].slice(0, 8),
        score: s.qualityScore,
        audit: s.auditScore,
      }))
  }, [])

  const openDetail = (s: SupplierQuality) => {
    setDetailSupplier(s)
    setDetailOpen(true)
  }

  const handleExport = () => {
    exportToCSV(
      filteredSuppliers.map((s) => ({
        code: s.code,
        name: s.name,
        tier: tierConfig[s.tier].label,
        grade: gradeConfig[s.grade].label,
        category: categoryConfig[s.category].label,
        city: s.city,
        region: s.region,
        contact: s.contact,
        email: s.email,
        phone: s.phone,
        qualityScore: s.qualityScore,
        defectRatePPM: s.defectRate,
        onTimeDelivery: s.onTimeDelivery,
        firstPassYield: s.fpY,
        auditScore: s.auditScore,
        openCAPA: s.openCAPA,
        totalBatches: s.totalBatches,
        rejectedBatches: s.rejectedBatches,
        batchRejectionRate: ((s.rejectedBatches / s.totalBatches) * 100).toFixed(2) + "%",
        ppapApproved: s.ppapApproved,
        isoCertified: s.isoCertified ? "Yes" : "No",
        lastAudit: s.lastAudit,
        nextAudit: s.nextAudit,
        copq: s.copq,
        activeParts: s.activeParts,
        criticalParts: s.criticalParts,
        ytdSpend: s.ytdSpend,
        trend90d: s.trend90d,
      })),
      "supplier-quality-scorecard"
    )
    toast.success("Exported", `${filteredSuppliers.length} suppliers exported to CSV.`)
  }

  const handleRefresh = () => {
    toast.info("Refresh", "Quality metrics refreshed from latest inspection data.")
  }

  const handleNewAudit = () => {
    toast.info("Schedule Audit", "Opening audit scheduler...")
  }

  // KPI definitions
  const kpis = [
    {
      label: "Total Suppliers",
      value: totalSuppliers.toString(),
      sub: `${excellentCount} excellent · ${criticalCount} critical`,
      icon: Factory,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Avg Quality Score",
      value: avgQuality.toFixed(1),
      suffix: "/100",
      sub: `FPY ${avgFPY.toFixed(1)}% · OTD ${avgOnTime.toFixed(1)}%`,
      icon: Gauge,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    {
      label: "Avg Defect Rate",
      value: Math.round(avgDefect).toString(),
      suffix: " PPM",
      sub: `Target ≤ 1000 PPM`,
      icon: Microscope,
      color: avgDefect <= 1000 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950",
      border: "border-amber-200 dark:border-amber-800",
    },
    {
      label: "Open CAPAs",
      value: openCAPATotal.toString(),
      sub: `${watchCount + criticalCount} suppliers need attention`,
      icon: AlertTriangle,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950",
      border: "border-orange-200 dark:border-orange-800",
    },
    {
      label: "Cost of Poor Quality",
      value: `₹${(totalCOPQ / 100000).toFixed(1)}L`,
      sub: `${totalRejected} of ${totalBatches} batches rejected`,
      icon: Flame,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950",
      border: "border-red-200 dark:border-red-800",
    },
    {
      label: "Audits Due (120d)",
      value: auditPending.toString(),
      sub: `${suppliersData.filter(s => s.isoCertified).length} ISO certified`,
      icon: ClipboardCheck,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950",
      border: "border-violet-200 dark:border-violet-800",
    },
  ]

  // Tab counts
  const tabCounts = {
    all: totalSuppliers,
    excellent: excellentCount,
    good: suppliersData.filter(s => s.grade === "good").length,
    watch: watchCount,
    critical: criticalCount,
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Supplier Quality Scorecard"
        description="Cross-supplier quality performance dashboard — defect rates, FPY, audit scores, CAPA tracking, COPQ analytics"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <Card
              key={kpi.label}
              className={cn(
                "relative overflow-hidden sqs-kpi-enter hover:shadow-md transition-shadow",
                kpi.border
              )}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <CardContent className="glass-subtle p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                  <div className={cn("rounded-md p-1", kpi.bg)}>
                    <Icon className={cn("h-3 w-3", kpi.color)} />
                  </div>
                </div>
                <p className={cn("text-xl font-bold text-number", kpi.color)}>
                  {kpi.value}
                  {kpi.suffix && <span className="text-xs ml-0.5 font-medium">{kpi.suffix}</span>}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>
              </CardContent>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent sqs-shimmer" />
            </Card>
          )
        })}
      </div>

      {/* Charts row 1: defect trend + grade distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 sqs-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Microscope className="h-4 w-4 text-red-500" />
                  30-Day Defect Rate Trend
                </CardTitle>
                <CardDescription className="text-xs">
                  Average defect rate (PPM) across all suppliers vs target threshold
                </CardDescription>
              </div>
              <Badge variant="outline" className="badge-interactive text-[10px] bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700">
                <AlertTriangle className="h-3 w-3 mr-1" /> Day 15 spike
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <ChartContainer config={defectChartConfig} className="h-[200px] w-full">
              <AreaChart data={defectTrend30d} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="defectGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={4} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="defectRate" stroke="#ef4444" strokeWidth={2} fill="url(#defectGrad)" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="sqs-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-violet-500" />
              Quality Grade Distribution
            </CardTitle>
            <CardDescription className="text-xs">{totalSuppliers} suppliers by current grade</CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <ChartContainer config={pieConfig} className="h-[200px] w-full">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {gradeDistribution.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {gradeDistribution.map((g) => (
                <div key={g.key} className="flex items-center gap-1.5 text-[10px]">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-muted-foreground">{g.name}</span>
                  <span className="font-semibold ml-auto">{g.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2: Top performers + At-risk + score comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top 5 performers */}
        <Card className="sqs-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Medal className="h-4 w-4 text-amber-500" />
              Top 5 Quality Performers
            </CardTitle>
            <CardDescription className="text-xs">Highest quality scores this quarter</CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0 space-y-2">
            {topPerformers.map((s, i) => {
              const initials = s.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              return (
                <button
                  key={s.id}
                  onClick={() => openDetail(s)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left sqs-row-in",
                    i === 0 && "sqs-rank-glow"
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    i === 0 ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" :
                    i === 1 ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" :
                    i === 2 ? "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {i + 1}
                  </div>
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.code} · {categoryConfig[s.category].label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-number">{s.qualityScore.toFixed(1)}</p>
                    <p className="text-[9px] text-muted-foreground">{s.defectRate} PPM</p>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* At-risk suppliers */}
        <Card className="sqs-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              At-Risk Suppliers
            </CardTitle>
            <CardDescription className="text-xs">{atRiskSuppliers.length} suppliers need intervention</CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0 space-y-2">
            {atRiskSuppliers.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-4">No at-risk suppliers</div>
            ) : atRiskSuppliers.map((s, i) => {
              const initials = s.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              const grade = gradeConfig[s.grade]
              const GradeIcon = grade.icon
              return (
                <button
                  key={s.id}
                  onClick={() => openDetail(s)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left sqs-row-warning",
                    s.grade === "critical" && "border-red-300 dark:border-red-700"
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className={cn("text-[9px]", grade.bg, grade.color)}>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {s.code} · {s.defectRate} PPM · {s.openCAPA} CAPAs
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("text-[9px] shrink-0", grade.color, grade.bg, grade.border)}>
                    <GradeIcon className="h-2.5 w-2.5 mr-0.5" /> {grade.label}
                  </Badge>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Score comparison chart */}
        <Card className="sqs-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-blue-500" />
              Quality vs Audit Score
            </CardTitle>
            <CardDescription className="text-xs">Top 10 suppliers by spend</CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <ChartContainer config={scoreComparisonConfig} className="h-[200px] w-full">
              <BarChart data={scoreComparison} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[60, 100]} tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Quality" />
                <Bar dataKey="audit" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Audit" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category COPQ breakdown */}
      <Card className="sqs-chart-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Cost of Poor Quality by Category
          </CardTitle>
          <CardDescription className="text-xs">
            Where quality issues are costing the most — focus areas for FY25 QA programs
          </CardDescription>
        </CardHeader>
        <CardContent className="glass-subtle pt-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {categoryDistribution.map((cat) => {
              const maxCopq = Math.max(...categoryDistribution.map(c => c.copq))
              const pct = maxCopq > 0 ? (cat.copq / maxCopq) * 100 : 0
              return (
                <div key={cat.key} className="rounded-lg border p-2.5 bg-card sqs-cat-card">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <p className="text-[10px] font-medium uppercase tracking-wide">{cat.name}</p>
                  </div>
                  <p className="text-lg font-bold text-number">₹{(cat.copq / 100000).toFixed(1)}L</p>
                  <p className="text-[10px] text-muted-foreground mb-1.5">{cat.count} suppliers</p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full sqs-bar-fill"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Master Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Boxes className="h-5 w-5 text-primary" />
                Supplier Quality Master
              </CardTitle>
              <CardDescription className="text-xs">
                {filteredSuppliers.length} of {totalSuppliers} suppliers · click row or eye icon to view scorecard
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7 h-8 text-xs w-48 sqs-search-focus"
                />
              </div>
              <Button variant="outline" size="sm" className="btn-outline-animate h-8 text-xs" onClick={handleRefresh}>
                <RefreshCw className="h-3 w-3 mr-1" /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="btn-outline-animate h-8 text-xs" onClick={handleExport}>
                <Download className="h-3 w-3 mr-1" /> Export
              </Button>
              <Button size="sm" className="h-8 text-xs" onClick={handleNewAudit}>
                <ClipboardCheck className="h-3 w-3 mr-1" /> Schedule Audit
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mt-3">
            {([
              { id: "all", label: `All (${tabCounts.all})` },
              { id: "excellent", label: `Excellent (${tabCounts.excellent})` },
              { id: "good", label: `Good (${tabCounts.good})` },
              { id: "watch", label: `Watch (${tabCounts.watch})` },
              { id: "critical", label: `Critical (${tabCounts.critical})` },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTab(t.id)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[10px] font-medium transition-all sqs-tab-switch",
                  selectedTab === t.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="h-7 w-[120px] text-[10px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="tier-1">Tier-1</SelectItem>
                <SelectItem value="tier-2">Tier-2</SelectItem>
                <SelectItem value="tier-3">Tier-3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="h-7 w-[120px] text-[10px]">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="watch">Watch</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-7 w-[130px] text-[10px]">
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
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="h-7 w-[110px] text-[10px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="North">North</SelectItem>
                <SelectItem value="South">South</SelectItem>
                <SelectItem value="East">East</SelectItem>
                <SelectItem value="West">West</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="glass-subtle pt-0">
          <div className="rounded-md border overflow-x-auto">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-[10px] h-8">Supplier</TableHead>
                  <TableHead className="text-[10px] h-8">Grade</TableHead>
                  <TableHead className="text-[10px] h-8 text-right">Quality</TableHead>
                  <TableHead className="text-[10px] h-8 text-right">Defect (PPM)</TableHead>
                  <TableHead className="text-[10px] h-8 text-right">FPY %</TableHead>
                  <TableHead className="text-[10px] h-8 text-right">OTD %</TableHead>
                  <TableHead className="text-[10px] h-8 text-right">Audit</TableHead>
                  <TableHead className="text-[10px] h-8 text-right">CAPAs</TableHead>
                  <TableHead className="text-[10px] h-8 text-right">Batches (Rej)</TableHead>
                  <TableHead className="text-[10px] h-8 text-right">COPQ</TableHead>
                  <TableHead className="text-[10px] h-8 text-right">90d Trend</TableHead>
                  <TableHead className="text-[10px] h-8 text-center">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-xs text-muted-foreground py-6">
                      No suppliers match the current filters.
                    </TableCell>
                  </TableRow>
                ) : filteredSuppliers.map((s, i) => {
                  const grade = gradeConfig[s.grade]
                  const tier = tierConfig[s.tier]
                  const GradeIcon = grade.icon
                  const TierIcon = tier.icon
                  const initials = s.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                  const isCritical = s.grade === "critical"
                  const isWatch = s.grade === "watch"
                  return (
                    <TableRow
                      key={s.id}
                      onClick={() => openDetail(s)}
                      className={cn(
                        "cursor-pointer sqs-row-in text-xs",
                        isCritical && "sqs-row-critical",
                        isWatch && "sqs-row-watch",
                        !isCritical && !isWatch && "hover:bg-accent/50"
                      )}
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className={cn("text-[9px]", grade.bg, grade.color)}>{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[180px]">{s.name}</p>
                            <p className="text-[9px] text-muted-foreground font-mono">
                              {s.code} · <TierIcon className="inline h-2.5 w-2.5" /> {tier.label.split(" ")[0]} · {s.city}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[9px]", grade.color, grade.bg, grade.border)}>
                          <GradeIcon className="h-2.5 w-2.5 mr-0.5" /> {grade.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "font-bold text-number",
                          s.qualityScore >= 95 ? "text-emerald-600 dark:text-emerald-400" :
                          s.qualityScore >= 90 ? "text-blue-600 dark:text-blue-400" :
                          s.qualityScore >= 85 ? "text-amber-600 dark:text-amber-400" :
                          "text-red-600 dark:text-red-400"
                        )}>
                          {s.qualityScore.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "text-number",
                          s.defectRate <= 500 ? "text-emerald-600 dark:text-emerald-400" :
                          s.defectRate <= 1500 ? "text-amber-600 dark:text-amber-400" :
                          "text-red-600 dark:text-red-400"
                        )}>
                          {s.defectRate}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-number">{s.fpY.toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "text-number",
                          s.onTimeDelivery >= 95 ? "text-emerald-600 dark:text-emerald-400" :
                          s.onTimeDelivery >= 85 ? "text-amber-600 dark:text-amber-400" :
                          "text-red-600 dark:text-red-400"
                        )}>
                          {s.onTimeDelivery.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "text-number",
                          s.auditScore >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                          s.auditScore >= 80 ? "text-amber-600 dark:text-amber-400" :
                          "text-red-600 dark:text-red-400"
                        )}>
                          {s.auditScore}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {s.openCAPA === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">—</span>
                        ) : (
                          <Badge variant="outline" className={cn(
                            "text-[9px]",
                            s.openCAPA >= 8 ? "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700" :
                            s.openCAPA >= 4 ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700" :
                            "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700"
                          )}>
                            {s.openCAPA}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-number">
                        <span className="text-xs">{s.totalBatches}</span>
                        <span className="text-[9px] text-muted-foreground"> ({s.rejectedBatches})</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "text-number font-medium",
                          s.copq === 0 ? "text-emerald-600 dark:text-emerald-400" :
                          s.copq >= 500000 ? "text-red-600 dark:text-red-400" :
                          s.copq >= 200000 ? "text-amber-600 dark:text-amber-400" :
                          "text-muted-foreground"
                        )}>
                          {s.copq === 0 ? "—" : `₹${(s.copq / 100000).toFixed(1)}L`}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {s.trend90d > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
                            <ArrowUpRight className="h-3 w-3" /> +{s.trend90d.toFixed(1)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-red-600 dark:text-red-400 text-[10px] font-medium">
                            <ArrowDownRight className="h-3 w-3" /> {s.trend90d.toFixed(1)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => { e.stopPropagation(); openDetail(s) }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SupplierQualityDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        supplier={detailSupplier}
      />
    </div>
  )
}

// ============================================================================
// Detail Drawer (5 sub-tabs: Overview / Batches / Defects / Audit / Scorecard)
// ============================================================================

interface SupplierQualityDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: SupplierQuality | null
}

function SupplierQualityDetailDrawer({ open, onOpenChange, supplier }: SupplierQualityDetailDrawerProps) {
  const toast = useToast()
  const [selectedTab, setSelectedTab] = React.useState<"overview" | "batches" | "defects" | "audit" | "scorecard">("overview")

  React.useEffect(() => {
    if (open) setSelectedTab("overview")
  }, [open, supplier?.id])

  if (!supplier) return null

  const tier = tierConfig[supplier.tier]
  const grade = gradeConfig[supplier.grade]
  const cat = categoryConfig[supplier.category]
  const TierIcon = tier.icon
  const GradeIcon = grade.icon
  const CatIcon = cat.icon
  const initials = supplier.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
  const batchRejRate = (supplier.rejectedBatches / supplier.totalBatches) * 100

  // 6-month quality trend
  const quality6m = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.now() - (5 - i) * 30 * 86_400_000)
    const variance = ((i * 7 + 3) % 5) - 2
    return {
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      quality: Math.max(75, Math.min(100, supplier.qualityScore + variance)),
      audit: Math.max(70, Math.min(100, supplier.auditScore + variance - 1)),
      target: 95,
    }
  })

  // Mock recent batches (6)
  const recentBatches = Array.from({ length: 6 }, (_, i) => {
    const seed = (supplier.id.charCodeAt(0) + i * 23) % 1000
    const statuses = ["Accepted", "Accepted", "Accepted", "Conditional", "Accepted", "Rejected"]
    if (supplier.grade === "critical") {
      statuses[2] = "Rejected"
      statuses[4] = "Conditional"
    } else if (supplier.grade === "watch") {
      statuses[3] = "Rejected"
    }
    return {
      id: `BT-${2024}-${1000 + seed}`,
      date: new Date(Date.now() - i * 4 * 86_400_000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      partNo: `PRT-${8000 + seed}`,
      qty: 100 + (seed % 900),
      accepted: statuses[i] === "Rejected" ? 0 : statuses[i] === "Conditional" ? Math.floor((100 + (seed % 900)) * 0.85) : 100 + (seed % 900),
      status: statuses[i],
      inspector: ["R. Kumar", "S. Patel", "A. Singh", "M. Iyer", "P. Sharma", "D. Reddy"][i],
    }
  })

  // Mock defect breakdown (by type)
  const defectBreakdown: { type: DefectType; count: number; pct: number }[] = [
    { type: "dimensional", count: Math.round(supplier.openCAPA * 2.4) + 3, pct: 0 },
    { type: "surface", count: Math.round(supplier.openCAPA * 1.6) + 2, pct: 0 },
    { type: "functional", count: Math.round(supplier.openCAPA * 1.2) + 1, pct: 0 },
    { type: "documentation", count: Math.round(supplier.openCAPA * 0.6) + 1, pct: 0 },
    { type: "packaging", count: Math.round(supplier.openCAPA * 0.4), pct: 0 },
    { type: "compliance", count: Math.round(supplier.openCAPA * 0.3), pct: 0 },
  ]
  const totalDefects = defectBreakdown.reduce((s, d) => s + d.count, 0)
  defectBreakdown.forEach((d) => { d.pct = totalDefects > 0 ? (d.count / totalDefects) * 100 : 0 })

  const defectTypeConfig: Record<DefectType, { label: string; icon: typeof Beaker; color: string }> = {
    dimensional: { label: "Dimensional", icon: Crosshair, color: "text-red-600 dark:text-red-400" },
    surface: { label: "Surface Finish", icon: Sparkles, color: "text-orange-600 dark:text-orange-400" },
    functional: { label: "Functional", icon: Wrench, color: "text-amber-600 dark:text-amber-400" },
    documentation: { label: "Documentation", icon: FileBarChart, color: "text-blue-600 dark:text-blue-400" },
    packaging: { label: "Packaging", icon: Package, color: "text-violet-600 dark:text-violet-400" },
    compliance: { label: "Compliance", icon: ShieldCheck, color: "text-pink-600 dark:text-pink-400" },
  }

  // Mock audit history (4)
  const auditHistory = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(Date.now() - (3 - i) * 90 * 86_400_000)
    const scoreDelta = i === 3 ? 0 : (i % 2 === 0 ? 2 : -2)
    return {
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      type: i === 3 ? "ISO 9001:2015 Re-certification" : i === 1 ? "IATF 16949 Surveillance" : "Internal Quality Audit",
      score: Math.max(70, Math.min(100, supplier.auditScore + scoreDelta)),
      auditor: i === 3 ? "TUV Nord" : i === 1 ? "DNV GL" : "Internal QA Team",
      findings: i === 3 ? 0 : (i + 1) * 2,
      majorNCs: i === 0 ? 1 : 0,
    }
  })

  // Scorecard metrics
  const scorecardMetrics = [
    { name: "Defect Rate", weight: 25, score: Math.min(100, 100 - (supplier.defectRate / 50)), target: "≤ 1000 PPM", icon: Microscope },
    { name: "First Pass Yield", weight: 20, score: supplier.fpY, target: "≥ 98%", icon: Gauge },
    { name: "On-Time Delivery", weight: 20, score: supplier.onTimeDelivery, target: "≥ 95%", icon: Clock },
    { name: "Audit Performance", weight: 15, score: supplier.auditScore, target: "≥ 90/100", icon: ClipboardCheck },
    { name: "CAPA Closure", weight: 10, score: supplier.openCAPA === 0 ? 100 : Math.max(40, 100 - supplier.openCAPA * 8), target: "0 open CAPAs", icon: AlertTriangle },
    { name: "Batch Acceptance", weight: 10, score: 100 - batchRejRate, target: "≥ 98% acceptance", icon: CheckCircle2 },
  ]
  const compositeScore = scorecardMetrics.reduce((s, m) => s + (m.score * m.weight / 100), 0)

  const handleCall = () => toast.info("Calling", `Dialing ${supplier.contact}...`)
  const handleEmail = () => toast.info("Email", `Composing email to ${supplier.email}...`)
  const handleScheduleAudit = () => toast.info("Schedule Audit", `Scheduling next audit for ${supplier.name}...`)
  const handleExportScorecard = () => {
    exportToCSV([{
      code: supplier.code,
      name: supplier.name,
      compositeScore: compositeScore.toFixed(2),
      qualityScore: supplier.qualityScore,
      defectRate: supplier.defectRate,
      fpY: supplier.fpY,
      onTimeDelivery: supplier.onTimeDelivery,
      auditScore: supplier.auditScore,
      openCAPA: supplier.openCAPA,
      copq: supplier.copq,
    }], `supplier-scorecard-${supplier.code}`)
    toast.success("Exported", `${supplier.name} scorecard exported.`)
  }
  const handleEscalate = () => {
    toast.warning("Escalated", `${supplier.name} escalated to Quality Steering Committee.`)
  }
  const handleAcknowledge = () => {
    toast.success("Acknowledged", `Quality status of ${supplier.name} acknowledged.`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header */}
        <SheetHeader className={cn(
          "relative px-5 py-4 border-b sqs-drawer-header",
          "bg-gradient-to-b",
          grade.color.replace("text-", "from-").replace("-700", "-500/15"),
          grade.color.replace("text-", "via-").replace("-700", "-500/5"),
          "to-transparent",
          grade.border
        )}>
          <div className="absolute inset-0 sqs-drawer-sheen pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <Avatar className="h-12 w-12 shrink-0 border-2 sqs-icon-pulse">
              <AvatarFallback className={cn("text-sm", grade.bg, grade.color)}>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-1">
              <SheetTitle className="text-base font-semibold flex items-center gap-2 flex-wrap">
                <span className="truncate">{supplier.name}</span>
                <Badge variant="outline" className={cn("text-[10px] rounded-full", grade.color, grade.bg, grade.border)}>
                  <GradeIcon className="h-3 w-3 mr-1" /> {grade.label}
                </Badge>
              </SheetTitle>
              <SheetDescription className="text-xs flex items-center gap-2 flex-wrap">
                <span className="font-mono">{supplier.code}</span>
                <span className="text-muted-foreground">·</span>
                <Badge variant="outline" className={cn("text-[10px]", tier.color, tier.bg)}>
                  <TierIcon className="h-3 w-3 mr-0.5" /> {tier.label.split(" ")[0]}
                </Badge>
                <span className="text-muted-foreground">·</span>
                <Badge variant="outline" className={cn("text-[10px]", cat.color, cat.bg)}>
                  <CatIcon className="h-3 w-3 mr-0.5" /> {cat.label}
                </Badge>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" /> {supplier.city} ({supplier.region})
                </span>
              </SheetDescription>
            </div>
          </div>

          {/* Hero stat grid */}
          <div className="relative mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 sqs-stat-enter">
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", grade.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Gauge className="h-3 w-3" /> Quality Score
              </p>
              <p className={cn(
                "text-sm font-bold text-number",
                supplier.qualityScore >= 95 ? "text-emerald-600 dark:text-emerald-400" :
                supplier.qualityScore >= 90 ? "text-blue-600 dark:text-blue-400" :
                supplier.qualityScore >= 85 ? "text-amber-600 dark:text-amber-400" :
                "text-red-600 dark:text-red-400"
              )}>
                {supplier.qualityScore.toFixed(1)}
              </p>
              <p className="text-[9px] text-muted-foreground">of 100 composite</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", grade.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Microscope className="h-3 w-3" /> Defect Rate
              </p>
              <p className={cn(
                "text-sm font-bold text-number",
                supplier.defectRate <= 500 ? "text-emerald-600 dark:text-emerald-400" :
                supplier.defectRate <= 1500 ? "text-amber-600 dark:text-amber-400" :
                "text-red-600 dark:text-red-400"
              )}>
                {supplier.defectRate} PPM
              </p>
              <p className="text-[9px] text-muted-foreground">target ≤ 1000</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", grade.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Open CAPAs
              </p>
              <p className={cn(
                "text-sm font-bold text-number",
                supplier.openCAPA === 0 ? "text-emerald-600 dark:text-emerald-400" :
                supplier.openCAPA >= 8 ? "text-red-600 dark:text-red-400" :
                supplier.openCAPA >= 4 ? "text-amber-600 dark:text-amber-400" :
                "text-blue-600 dark:text-blue-400"
              )}>
                {supplier.openCAPA}
              </p>
              <p className="text-[9px] text-muted-foreground">{supplier.rejectedBatches} rejected batches</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", grade.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Flame className="h-3 w-3" /> COPQ
              </p>
              <p className={cn(
                "text-sm font-bold text-number",
                supplier.copq === 0 ? "text-emerald-600 dark:text-emerald-400" :
                supplier.copq >= 500000 ? "text-red-600 dark:text-red-400" :
                supplier.copq >= 200000 ? "text-amber-600 dark:text-amber-400" :
                "text-muted-foreground"
              )}>
                {supplier.copq === 0 ? "—" : `₹${(supplier.copq / 100000).toFixed(1)}L`}
              </p>
              <p className="text-[9px] text-muted-foreground">YTD exposure</p>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="relative mt-3 flex gap-1 rounded-lg bg-muted/60 p-0.5 overflow-x-auto">
            {([
              { id: "overview", label: "Overview" },
              { id: "batches", label: `Batches (${recentBatches.length})` },
              { id: "defects", label: "Defects" },
              { id: "audit", label: "Audit" },
              { id: "scorecard", label: "Scorecard" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTab(t.id)}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium transition-all sqs-tab-switch",
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
        <div className="p-4 space-y-3 sqs-body-enter min-h-[400px]">
          {/* OVERVIEW TAB */}
          {selectedTab === "overview" && (
            <>
              {/* Contact info */}
              <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Primary Contact
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {supplier.contact.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{supplier.contact}</p>
                      <p className="text-[10px] text-muted-foreground">{supplier.email}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{supplier.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="btn-outline-animate h-7 text-[10px]" onClick={handleCall}>
                      <Phone className="h-3 w-3 mr-1" /> Call
                    </Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate h-7 text-[10px]" onClick={handleEmail}>
                      <Mail className="h-3 w-3 mr-1" /> Email
                    </Button>
                  </div>
                </div>
              </div>

              {/* 6-month trend */}
              <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Activity className="h-3 w-3" /> 6-Month Quality & Audit Trend
                </p>
                <ChartContainer config={{
                  quality: { label: "Quality Score", color: "#3b82f6" },
                  audit: { label: "Audit Score", color: "#8b5cf6" },
                  target: { label: "Target", color: "#94a3b8" },
                }} className="h-[140px] w-full">
                  <AreaChart data={quality6m} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="qualityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[70, 100]} tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="quality" stroke="#3b82f6" strokeWidth={2} fill="url(#qualityGrad)" />
                    <Line type="monotone" dataKey="audit" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                  </AreaChart>
                </ChartContainer>
              </div>

              {/* Key metrics grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                    <Gauge className="h-3 w-3" /> First Pass Yield
                  </p>
                  <p className={cn(
                    "text-lg font-bold text-number",
                    supplier.fpY >= 98 ? "text-emerald-600 dark:text-emerald-400" :
                    supplier.fpY >= 95 ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  )}>
                    {supplier.fpY.toFixed(1)}%
                  </p>
                  <Progress value={supplier.fpY} className="h-1 mt-1 sqs-score-fill" />
                </div>
                <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> On-Time Delivery
                  </p>
                  <p className={cn(
                    "text-lg font-bold text-number",
                    supplier.onTimeDelivery >= 95 ? "text-emerald-600 dark:text-emerald-400" :
                    supplier.onTimeDelivery >= 85 ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  )}>
                    {supplier.onTimeDelivery.toFixed(1)}%
                  </p>
                  <Progress value={supplier.onTimeDelivery} className="h-1 mt-1 sqs-score-fill" />
                </div>
                <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                    <ClipboardCheck className="h-3 w-3" /> Audit Score
                  </p>
                  <p className={cn(
                    "text-lg font-bold text-number",
                    supplier.auditScore >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                    supplier.auditScore >= 80 ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  )}>
                    {supplier.auditScore}/100
                  </p>
                  <Progress value={supplier.auditScore} className="h-1 mt-1 sqs-score-fill" />
                </div>
                <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                    <Beaker className="h-3 w-3" /> Batch Acceptance
                  </p>
                  <p className={cn(
                    "text-lg font-bold text-number",
                    batchRejRate <= 2 ? "text-emerald-600 dark:text-emerald-400" :
                    batchRejRate <= 5 ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  )}>
                    {(100 - batchRejRate).toFixed(1)}%
                  </p>
                  <p className="text-[9px] text-muted-foreground">{supplier.rejectedBatches}/{supplier.totalBatches} rejected</p>
                </div>
              </div>

              {/* Parts & PPAP */}
              <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Boxes className="h-3 w-3" /> Parts Portfolio
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-base font-bold text-number">{supplier.activeParts}</p>
                    <p className="text-[9px] text-muted-foreground">Active Parts</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-base font-bold text-number text-amber-600 dark:text-amber-400">{supplier.criticalParts}</p>
                    <p className="text-[9px] text-muted-foreground">Critical Parts</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-base font-bold text-number text-emerald-600 dark:text-emerald-400">{supplier.ppapApproved}</p>
                    <p className="text-[9px] text-muted-foreground">PPAP Approved</p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Certifications
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {supplier.isoCertified ? (
                    <>
                      <Badge variant="outline" className="badge-interactive text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700">
                        <ShieldCheck className="h-3 w-3 mr-1" /> ISO 9001:2015
                      </Badge>
                      {supplier.tier === "tier-1" && (
                        <Badge variant="outline" className="badge-interactive text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                          <Award className="h-3 w-3 mr-1" /> IATF 16949
                        </Badge>
                      )}
                      <Badge variant="outline" className="badge-interactive text-[10px] bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> ISO 14001
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="outline" className="badge-interactive text-[10px] bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700">
                      <XCircle className="h-3 w-3 mr-1" /> Not ISO Certified
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}

          {/* BATCHES TAB */}
          {selectedTab === "batches" && (
            <div className="rounded-xl border bg-card p-3 sqs-card-enter">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" /> Recent Inspection Batches
                </p>
                <Badge variant="outline" className="badge-interactive text-[10px]">
                  {recentBatches.filter(b => b.status === "Accepted").length}/{recentBatches.length} accepted
                </Badge>
              </div>
              <div className="rounded-md border overflow-hidden">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 h-7">
                      <TableHead className="text-[9px]">Batch ID</TableHead>
                      <TableHead className="text-[9px]">Date</TableHead>
                      <TableHead className="text-[9px]">Part No</TableHead>
                      <TableHead className="text-[9px] text-right">Qty</TableHead>
                      <TableHead className="text-[9px] text-right">Accepted</TableHead>
                      <TableHead className="text-[9px]">Status</TableHead>
                      <TableHead className="text-[9px]">Inspector</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBatches.map((b) => (
                      <TableRow key={b.id} className="h-7 text-[10px]">
                        <TableCell className="font-mono text-[10px]">{b.id}</TableCell>
                        <TableCell>{b.date}</TableCell>
                        <TableCell className="font-mono text-[10px]">{b.partNo}</TableCell>
                        <TableCell className="text-right text-number">{b.qty}</TableCell>
                        <TableCell className="text-right text-number">{b.accepted}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[9px]",
                            b.status === "Accepted" && "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
                            b.status === "Conditional" && "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700",
                            b.status === "Rejected" && "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
                          )}>
                            {b.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px]">{b.inspector}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* DEFECTS TAB */}
          {selectedTab === "defects" && (
            <>
              <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Microscope className="h-3 w-3" /> Defect Pareto Analysis (last 90 days)
                </p>
                <div className="space-y-2">
                  {defectBreakdown.map((d) => {
                    const config = defectTypeConfig[d.type]
                    const Icon = config.icon
                    return (
                      <div key={d.type}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] flex items-center gap-1">
                            <Icon className={cn("h-3 w-3", config.color)} /> {config.label}
                          </span>
                          <span className="text-[10px] font-medium text-number">
                            {d.count} <span className="text-muted-foreground">({d.pct.toFixed(0)}%)</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full sqs-bar-fill"
                            style={{ width: `${d.pct}%`, backgroundColor: "currentColor" }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Total Defects (90d)</span>
                  <span className="font-bold text-number">{totalDefects}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1">
                  <span className="text-muted-foreground">Avg Defects / Batch</span>
                  <span className="font-bold text-number">{(totalDefects / supplier.totalBatches).toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-3 sqs-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Active CAPA Items ({supplier.openCAPA})
                </p>
                {supplier.openCAPA === 0 ? (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 text-center py-3 flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> No open corrective actions
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {Array.from({ length: Math.min(supplier.openCAPA, 4) }, (_, i) => {
                      const severities = ["Critical", "Major", "Minor"]
                      const sev = severities[i % 3]
                      const sevColor = sev === "Critical" ? "text-red-600 dark:text-red-400" : sev === "Major" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"
                      return (
                        <div key={i} className="flex items-center gap-2 p-1.5 rounded-md bg-muted/30">
                          <AlertTriangle className={cn("h-3 w-3 shrink-0", sevColor)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium truncate">
                              CAPA-{2024}-{1000 + i * 7 + parseInt(supplier.id)}: {["Dimensional out of tolerance", "Surface finish non-conformance", "Documentation gap in PPAP", "Functional test failure"][i % 4]}
                            </p>
                            <p className="text-[9px] text-muted-foreground">
                              Opened {new Date(Date.now() - i * 5 * 86_400_000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} · Due {new Date(Date.now() + (14 - i * 3) * 86_400_000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                            </p>
                          </div>
                          <Badge variant="outline" className={cn("text-[9px] shrink-0", sevColor)}>
                            {sev}
                          </Badge>
                        </div>
                      )
                    })}
                    {supplier.openCAPA > 4 && (
                      <p className="text-[10px] text-muted-foreground text-center pt-1">+ {supplier.openCAPA - 4} more CAPAs</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* AUDIT TAB */}
          {selectedTab === "audit" && (
            <div className="rounded-xl border bg-card p-3 sqs-card-enter">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <ClipboardCheck className="h-3 w-3" /> Audit History (last 12 months)
                </p>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Next due</p>
                  <p className="text-[10px] font-semibold">{new Date(supplier.nextAudit).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                </div>
              </div>
              <div className="space-y-2">
                {auditHistory.map((a, i) => (
                  <div key={i} className="rounded-lg border p-2.5 bg-muted/20">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium">{a.type}</p>
                        <p className="text-[9px] text-muted-foreground">{a.date} · {a.auditor}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn(
                          "text-sm font-bold text-number",
                          a.score >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                          a.score >= 80 ? "text-amber-600 dark:text-amber-400" :
                          "text-red-600 dark:text-red-400"
                        )}>
                          {a.score}
                        </p>
                        <p className="text-[9px] text-muted-foreground">/100</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[9px]">
                      <span className="flex items-center gap-0.5 text-muted-foreground">
                        <FileBarChart className="h-2.5 w-2.5" /> {a.findings} findings
                      </span>
                      {a.majorNCs > 0 && (
                        <span className="flex items-center gap-0.5 text-red-600 dark:text-red-400">
                          <XCircle className="h-2.5 w-2.5" /> {a.majorNCs} major NC
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <Button variant="outline" size="sm" className="btn-outline-animate w-full h-7 text-[10px]" onClick={handleScheduleAudit}>
                <Calendar className="h-3 w-3 mr-1" /> Schedule Next Audit
              </Button>
            </div>
          )}

          {/* SCORECARD TAB */}
          {selectedTab === "scorecard" && (
            <div className="rounded-xl border bg-card p-3 sqs-card-enter">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3" /> Weighted Quality Scorecard
                </p>
                <div className="text-right">
                  <p className="text-[9px] text-muted-foreground uppercase">Composite</p>
                  <p className={cn(
                    "text-lg font-bold text-number",
                    compositeScore >= 95 ? "text-emerald-600 dark:text-emerald-400" :
                    compositeScore >= 90 ? "text-blue-600 dark:text-blue-400" :
                    compositeScore >= 85 ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  )}>
                    {compositeScore.toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {scorecardMetrics.map((m) => {
                  const Icon = m.icon
                  return (
                    <div key={m.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] flex items-center gap-1.5">
                          <Icon className="h-3 w-3 text-muted-foreground" /> {m.name}
                          <Badge variant="outline" className="badge-interactive text-[9px] h-4">{m.weight}%</Badge>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-muted-foreground">{m.target}</span>
                          <span className={cn(
                            "text-[11px] font-bold text-number w-10 text-right",
                            m.score >= 95 ? "text-emerald-600 dark:text-emerald-400" :
                            m.score >= 85 ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                          )}>
                            {m.score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full sqs-score-fill",
                            m.score >= 95 ? "bg-emerald-500" :
                            m.score >= 85 ? "bg-amber-500" :
                            "bg-red-500"
                          )}
                          style={{ width: `${Math.min(100, m.score)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-muted/30 p-2">
                  <p className="text-[9px] text-muted-foreground uppercase">YTD Spend</p>
                  <p className="text-sm font-bold text-number">₹{(supplier.ytdSpend / 100000).toFixed(1)}L</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-2">
                  <p className="text-[9px] text-muted-foreground uppercase">COPQ / Spend Ratio</p>
                  <p className={cn(
                    "text-sm font-bold text-number",
                    supplier.copq === 0 ? "text-emerald-600 dark:text-emerald-400" :
                    (supplier.copq / supplier.ytdSpend) > 0.1 ? "text-red-600 dark:text-red-400" :
                    "text-amber-600 dark:text-amber-400"
                  )}>
                    {supplier.copq === 0 ? "0.0%" : ((supplier.copq / supplier.ytdSpend) * 100).toFixed(1) + "%"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="border-t px-4 py-3 flex-row gap-2">
          <Button variant="outline" size="sm" className="btn-outline-animate h-8 text-xs flex-1" onClick={handleExportScorecard}>
            <Download className="h-3 w-3 mr-1" /> Export Scorecard
          </Button>
          {(supplier.grade === "critical" || supplier.grade === "watch") && (
            <Button variant="destructive" size="sm" className="h-8 text-xs flex-1" onClick={handleEscalate}>
              <AlertTriangle className="h-3 w-3 mr-1" /> Escalate
            </Button>
          )}
          <Button size="sm" className="h-8 text-xs flex-1" onClick={handleAcknowledge}>
            <CheckCircle2 className="h-3 w-3 mr-1" /> Acknowledge
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
