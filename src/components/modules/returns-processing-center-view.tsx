"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Recycle, RotateCcw, PackageOpen, Search, Eye, ArrowUpDown,
  TrendingUp, Clock, IndianRupee, Star, AlertTriangle, CheckCircle,
  XCircle, Package, BarChart3, Activity, ShieldCheck, ArrowLeftRight,
  Truck, Warehouse, Tag, RefreshCw, Undo2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"

/* ═══════════════════════════════════════════════════════════════════
   Seed-based deterministic random helpers
   ═══════════════════════════════════════════════════════════════════ */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000
  return x - Math.floor(x)
}
function ri(min: number, max: number, seed: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min
}

/* ═══════════════════════════════════════════════════════════════════
   Enums (as const)
   ═══════════════════════════════════════════════════════════════════ */
const RETURN_STATUSES = ["Requested", "Picked Up", "In Transit", "Received", "Inspecting", "Approved", "Refunded", "Rejected"] as const
const RETURN_REASONS = ["Defective", "Wrong Item", "Size Issue", "Color Mismatch", "Damaged in Transit", "Not Received", "Changed Mind", "Not as Described"] as const
const PLATFORMS = ["Amazon", "Flipkart", "Myntra", "Meesho", "Snapdeal", "Nykaa", "Ajio", "JioMart"] as const
const INDIAN_CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Nagpur", "Indore"] as const
const INSPECTION_STATUSES = ["Pending", "In Progress", "Passed", "Failed", "Partially Passed", "On Hold"] as const
const DEFECT_TYPES = ["Cosmetic Damage", "Functional Failure", "Missing Parts", "Wrong Item", "Stained", "Tampered Packaging", "Expired", "Counterfeit"] as const
const RESOLUTIONS = ["Refund", "Replacement", "Repair", "Resell as New", "Resell as Open Box", "Dispose"] as const
const SEVERITY_LEVELS = ["Critical", "High", "Medium", "Low"] as const
const REFUND_METHODS = ["UPI", "NEFT", "Wallet", "Credit Note", "Bank Transfer"] as const
const REFUND_STATUSES = ["Processing", "Initiated", "Completed", "Failed", "Reversed"] as const
const GRADES = ["A+", "A", "B", "C", "D"] as const
const DISPOSITIONS = ["Resell as New", "Resell as Open Box", "Resell as Refurbished", "Donate", "Recycle", "Dispose"] as const
const INDIAN_NAMES = ["Aarav Sharma", "Priya Patel", "Rohit Kumar", "Sneha Reddy", "Vikram Singh", "Anjali Gupta", "Arjun Mehta", "Divya Nair", "Karthik Iyer", "Pooja Das", "Manish Verma", "Ritu Joshi", "Sanjay Rathore", "Neha Saxena", "Deepak Chauhan"] as const
const CATEGORIES = ["Electronics", "Apparel", "Footwear", "Home Decor", "Beauty", "Sports", "Books", "Toys"] as const
const COLORS = ["#d97706", "#059669", "#e11d48", "#3b82f6", "#7c3aed", "#0891b2", "#6366f1", "#f97316"]

/* ═══════════════════════════════════════════════════════════════════
   INR formatting
   ═══════════════════════════════════════════════════════════════════ */
function fmtINR(n: number): string {
  const sign = n < 0 ? "-" : ""
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${sign}${(abs / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `₹${sign}${(abs / 1e5).toFixed(2)} L`
  return `₹${sign}${abs.toLocaleString("en-IN")}`
}

/* ═══════════════════════════════════════════════════════════════════
   16 Unique Visual Components
   ═══════════════════════════════════════════════════════════════════ */

function ReturnStatusBadge({ status }: { status: string }) {
  const pulse = ["Picked Up", "In Transit", "Inspecting"].includes(status)
  const colorMap: Record<string, string> = {
    Requested: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "Picked Up": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "In Transit": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Received: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
    Inspecting: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Refunded: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  }
  return (
    <Badge variant="outline" className={`rpc-status-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "rpc-pulse-active" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function ReturnReasonBadge({ reason }: { reason: string }) {
  const colorMap: Record<string, string> = {
    Defective: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Wrong Item": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Size Issue": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Color Mismatch": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    "Damaged in Transit": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
    "Not Received": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    "Changed Mind": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    "Not as Described": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
  }
  return (
    <Badge variant="outline" className={`rpc-reason-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[reason] || "bg-gray-100 text-gray-700"}`}>
      {reason}
    </Badge>
  )
}

function PlatformBadge({ platform }: { platform: string }) {
  const colorMap: Record<string, string> = {
    Amazon: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Flipkart: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Myntra: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
    Meesho: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Snapdeal: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Nykaa: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-400",
    Ajio: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    JioMart: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
  }
  return (
    <Badge variant="outline" className={`rpc-platform-badge gap-1 text-[10px] px-2 py-0.5 font-semibold ${colorMap[platform] || "bg-gray-100 text-gray-700"}`}>
      {platform}
    </Badge>
  )
}

function InspectionStatusBadge({ status }: { status: string }) {
  const pulse = status === "In Progress"
  const colorMap: Record<string, string> = {
    Pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Passed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Partially Passed": "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    "On Hold": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  }
  return (
    <Badge variant="outline" className={`rpc-inspect-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "rpc-pulse-warning" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function DefectTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    "Cosmetic Damage": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Functional Failure": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Missing Parts": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Wrong Item": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    Stained: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    "Tampered Packaging": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
    Expired: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    Counterfeit: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  }
  return (
    <Badge variant="outline" className={`rpc-defect-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}>
      {type}
    </Badge>
  )
}

function ResolutionBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    Refund: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Replacement: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Repair: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Resell as New": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
    "Resell as Open Box": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    Dispose: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  }
  return (
    <Badge variant="outline" className={`rpc-resolution-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}>
      <ArrowLeftRight className="h-3 w-3" /> {type}
    </Badge>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const pulse = severity === "Critical" || severity === "High"
  const glow = severity === "Critical"
  const colorMap: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    High: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  }
  return (
    <Badge variant="outline" className={`rpc-severity-badge gap-1 text-[10px] px-2 py-0.5 font-bold ${pulse ? (glow ? "rpc-pulse-critical-glow" : "rpc-pulse-warning") : ""} ${colorMap[severity] || "bg-gray-100 text-gray-700"}`}>
      <AlertTriangle className="h-3 w-3" /> {severity}
    </Badge>
  )
}

function RefundMethodBadge({ method }: { method: string }) {
  const iconMap: Record<string, string> = {
    UPI: "⚡", NEFT: "🏦", Wallet: "👛", "Credit Note": "📝", "Bank Transfer": "💳",
  }
  return (
    <Badge variant="outline" className="rpc-refund-method-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      {iconMap[method] || "💰"} {method}
    </Badge>
  )
}

function RefundStatusBadge({ status }: { status: string }) {
  const pulse = status === "Processing"
  const colorMap: Record<string, string> = {
    Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Initiated: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Reversed: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  }
  return (
    <Badge variant="outline" className={`rpc-refund-status-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "rpc-pulse-active" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function GradeBadge({ grade }: { grade: string }) {
  const colorMap: Record<string, string> = {
    "A+": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-bold",
    A: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-bold",
    B: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 font-semibold",
    C: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 font-semibold",
    D: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 font-bold",
  }
  return (
    <Badge variant="outline" className={`rpc-grade-badge gap-1 text-[10px] px-2 py-0.5 ${colorMap[grade] || "bg-gray-100 text-gray-700"}`}>
      <Star className="h-3 w-3" /> Grade {grade}
    </Badge>
  )
}

function DispositionBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    "Resell as New": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Resell as Open Box": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Resell as Refurbished": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Donate: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    Recycle: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
    Dispose: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  }
  return (
    <Badge variant="outline" className={`rpc-disposition-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}>
      <Recycle className="h-3 w-3" /> {type}
    </Badge>
  )
}

function ConditionBar({ level }: { level: number }) {
  const color = level > 80 ? "bg-emerald-500" : level > 60 ? "bg-green-500" : level > 40 ? "bg-amber-500" : level > 20 ? "bg-orange-500" : "bg-red-500"
  return (
    <div className="rpc-condition-bar flex items-center gap-2">
      <div className="h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${level}%` }} />
      </div>
      <span className="text-[10px] font-bold" style={{ color: level > 60 ? "#059669" : level > 40 ? "#d97706" : "#e11d48" }}>{level}%</span>
    </div>
  )
}

function SatisfactionBar({ rating }: { rating: number }) {
  return (
    <div className="rpc-satisfaction-bar flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`h-3 w-3 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
      ))}
      <span className="ml-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400">{rating}.0</span>
    </div>
  )
}

function ReturnTile({ amount }: { amount: number }) {
  return (
    <div className="rpc-return-tile inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      <IndianRupee className="h-3 w-3" /> {fmtINR(amount)}
    </div>
  )
}

function MarkdownTile({ percent }: { percent: number }) {
  const color = percent > 50 ? "text-red-600 dark:text-red-400" : percent > 20 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
  return (
    <div className={`rpc-markdown-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-bold ${color} dark:bg-gray-800`}>
      <Tag className="h-3 w-3" /> {percent}% off
    </div>
  )
}

function ResolutionTimeTile({ days }: { days: number }) {
  const color = days > 7 ? "text-red-600 dark:text-red-400" : days > 3 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
  return (
    <div className={`rpc-resolution-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-bold ${color} dark:bg-gray-800`}>
      <Clock className="h-3 w-3" /> {days}d
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Data Generation
   ═══════════════════════════════════════════════════════════════════ */
function generateData() {
  const returns = Array.from({ length: 75 }, (_, i) => {
    const s = i * 7 + 1
    return {
      id: `RET-${String(i + 1001).padStart(4, "0")}`,
      status: RETURN_STATUSES[i % 8],
      reason: RETURN_REASONS[i % 8],
      platform: PLATFORMS[i % 8],
      city: INDIAN_CITIES[i % 12],
      category: CATEGORIES[i % 8],
      value: ri(200, 25000, s),
      orderId: `ORD-${ri(100000, 999999, s + 1)}`,
      customer: INDIAN_NAMES[i % 15],
      pickupSlot: `${ri(9, 20, s + 2)}:${String(ri(0, 5, s + 3) * 10).padStart(2, "0")}`,
    }
  })
  const inspections = Array.from({ length: 70 }, (_, i) => {
    const s = i * 6 + 200
    return {
      id: `INS-${String(i + 2001).padStart(4, "0")}`,
      status: INSPECTION_STATUSES[i % 6],
      defect: DEFECT_TYPES[i % 8],
      resolution: RESOLUTIONS[i % 6],
      time: ri(5, 120, s),
      inspector: INDIAN_NAMES[i % 15],
      severity: SEVERITY_LEVELS[i % 4],
      returnId: `RET-${String(i + 1001).padStart(4, "0")}`,
    }
  })
  const refunds = Array.from({ length: 55 }, (_, i) => {
    const s = i * 5 + 400
    const method = REFUND_METHODS[i % 5]
    return {
      id: `RFD-${String(i + 3001).padStart(4, "0")}`,
      amount: ri(200, 25000, s + 1),
      method,
      processingTime: ri(1, 7, s + 2),
      originalPayment: ["COD", "Credit Card", "UPI", "Net Banking", "EMI"][i % 5],
      satisfaction: ri(1, 5, s + 3),
      status: REFUND_STATUSES[i % 5],
      isReplacement: method === "Credit Note" || i % 7 === 0,
    }
  })
  const dispositions = Array.from({ length: 65 }, (_, i) => {
    const s = i * 5 + 600
    const disp = DISPOSITIONS[i % 6]
    const gradeIdx = disp === "Resell as New" ? 0 : disp === "Resell as Open Box" ? 2 : disp === "Resell as Refurbished" ? 3 : 4
    return {
      id: `DSP-${String(i + 4001).padStart(4, "0")}`,
      type: disp,
      grade: GRADES[gradeIdx % 5],
      listedPrice: ri(100, 15000, s + 1),
      originalPrice: ri(500, 30000, s + 2),
      markdown: ri(5, 70, s + 3),
      platform: PLATFORMS[i % 8],
      daysToResell: ri(1, 30, s + 4),
    }
  })
  return { RETURN_STATUSES, RETURN_REASONS, PLATFORMS, INDIAN_CITIES, INSPECTION_STATUSES, DEFECT_TYPES, RESOLUTIONS, SEVERITY_LEVELS, REFUND_METHODS, REFUND_STATUSES, GRADES, DISPOSITIONS, CATEGORIES, INDIAN_NAMES, returns, inspections, refunds, dispositions }
}

/* ═══════════════════════════════════════════════════════════════════
   Sort / Filter helpers
   ═══════════════════════════════════════════════════════════════════ */
function filterData<T,>(data: T[], q: string): T[] {
  if (!q) return data
  const lower = q.toLowerCase()
  return data.filter(item => Object.values(item as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(lower)))
}
function sortedData<T,>(data: T[], field: string, dir: "asc" | "desc"): T[] {
  return [...data].sort((a, b) => {
    const av = (a as unknown as Record<string, string | number>)[field]
    const bv = (b as unknown as Record<string, string | number>)[field]
    if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av
    return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  })
}

/* ═══════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════ */
export default function ReturnsProcessingCenterView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState<typeof data.returns[0] | null>(null)
  const { toast } = useToast()

  const handleSort = (f: string) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(f); setSortDir("asc") }
  }

  const kpis = [
    { label: "Total Returns", value: data.returns.length, icon: PackageOpen, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Processing Queue", value: data.returns.filter(x => ["Requested", "Picked Up", "In Transit", "Received", "Inspecting"].includes(x.status)).length, icon: RotateCcw, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Refunds Issued", value: fmtINR(data.refunds.filter(x => x.status === "Completed").reduce((s, r) => s + r.amount, 0)), icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Return Rate", value: "4.2%", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: "Avg Resolution", value: `${(data.inspections.reduce((s, x) => s + x.time, 0) / data.inspections.length / 60).toFixed(1)}d`, icon: Clock, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { label: "Quality Inspected", value: data.inspections.length, icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Disposed Items", value: data.dispositions.filter(x => x.type === "Dispose" || x.type === "Recycle").length, icon: Recycle, color: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-800/50" },
    { label: "Resellable Items", value: data.dispositions.filter(x => x.type.startsWith("Resell")).length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  ]

  // Charts
  const dailyReturns = Array.from({ length: 7 }, (_, i) => ({ day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], Refund: ri(5, 20, i + 10), Replace: ri(2, 10, i + 50), Reject: ri(1, 5, i + 90) }))
  const reasonPie = RETURN_REASONS.map((r, i) => ({ name: r, value: ri(5, 30, i + 100) }))
  const platformBar = PLATFORMS.map((p, i) => ({ platform: p, Returns: ri(10, 60, i + 150) }))

  const filteredReturns = sortedData(filterData(data.returns, searchQ), sortField, sortDir)
  const filteredInspections = sortedData(filterData(data.inspections, searchQ), sortField, sortDir)
  const filteredDispositions = sortedData(filterData(data.dispositions, searchQ), sortField, sortDir)

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button variant="ghost" size="sm" className="rpc-sort-header h-8 px-2 text-[10px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleSort(field)}>
      <span className="flex items-center gap-1">{children}<ArrowUpDown className="h-3 w-3" /></span>
    </Button>
  )

  return (
    <div className="rpc-root space-y-4 p-4">
      <PageHeader title="Returns Processing Center" description="Manage customer returns, quality inspection, refund processing, and item disposition" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="rpc-tabs space-y-4">
        <TabsList className="rpc-tabs-list h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
          {["Returns Dashboard", "Return Requests", "Quality Inspection", "Refund Processing", "Resale & Disposition", "Returns Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="rpc-tab-trigger text-xs font-medium px-3">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ══════════ Tab 0: Dashboard ══════════ */}
        <TabsContent value="0" className="rpc-tab-content space-y-4">
          <div className="rpc-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className={`rpc-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="rpc-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="rpc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Daily Return Volume</CardTitle></CardHeader>
              <CardContent><AreaChart data={dailyReturns}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Refund" stackId="a" fill="#059669" /><Area type="monotone" dataKey="Replace" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Reject" stackId="a" fill="#e11d48" /></AreaChart></CardContent>
            </Card>
            <Card className="rpc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Return Reasons</CardTitle></CardHeader>
              <CardContent><PieChart><Pie data={reasonPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{reasonPie.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="rpc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Platform-wise Returns</CardTitle></CardHeader>
              <CardContent><BarChart data={platformBar}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="platform" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="Returns" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══════════ Tab 1: Return Requests ══════════ */}
        <TabsContent value="1" className="rpc-tab-content space-y-4">
          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search returns..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="text-xs">{filteredReturns.length} returns</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="rpc-return-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left"><SortHeader field="id">ID</SortHeader></th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">Platform</th><th className="p-2 text-left">Reason</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">City</th><th className="p-2 text-left"><SortHeader field="value">Value</SortHeader></th><th className="p-2 text-left">Customer</th><th className="p-2 text-left">Order</th><th className="p-2 text-center">Action</th></tr></thead>
              <tbody>
                {filteredReturns.map((ret) => (
                  <tr key={ret.id} className="rpc-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{ret.id}</td>
                    <td className="p-2"><ReturnStatusBadge status={ret.status} /></td>
                    <td className="p-2"><PlatformBadge platform={ret.platform} /></td>
                    <td className="p-2"><ReturnReasonBadge reason={ret.reason} /></td>
                    <td className="p-2 text-[10px] font-medium text-gray-600 dark:text-gray-400">{ret.category}</td>
                    <td className="p-2 text-[10px] font-medium text-gray-600 dark:text-gray-400">{ret.city}</td>
                    <td className="p-2"><ReturnTile amount={ret.value} /></td>
                    <td className="p-2 text-[10px] font-medium">{ret.customer}</td>
                    <td className="p-2 text-[10px] font-mono">{ret.orderId}</td>
                    <td className="p-2 text-center"><Button variant="ghost" size="sm" className="rpc-view-btn h-7 w-7 p-0 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30" onClick={() => { setSelectedReturn(ret); setSheetOpen(true); toast.success("Viewing Return", `${ret.id} details opened`) }}><Eye className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 2: Quality Inspection ══════════ */}
        <TabsContent value="2" className="rpc-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search inspections..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="text-xs">{filteredInspections.length} inspections</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="rpc-inspect-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">Defect</th><th className="p-2 text-left">Severity</th><th className="p-2 text-left">Resolution</th><th className="p-2 text-left">Inspector</th><th className="p-2 text-left"><SortHeader field="time">Time</SortHeader></th><th className="p-2 text-left">Return</th></tr></thead>
              <tbody>
                {filteredInspections.map((insp) => (
                  <tr key={insp.id} className="rpc-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{insp.id}</td>
                    <td className="p-2"><InspectionStatusBadge status={insp.status} /></td>
                    <td className="p-2"><DefectTypeBadge type={insp.defect} /></td>
                    <td className="p-2"><SeverityBadge severity={insp.severity} /></td>
                    <td className="p-2"><ResolutionBadge type={insp.resolution} /></td>
                    <td className="p-2 text-[10px] font-medium">{insp.inspector}</td>
                    <td className="p-2"><ResolutionTimeTile days={Math.round(insp.time / 60)} /></td>
                    <td className="p-2 text-[10px] font-mono">{insp.returnId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 3: Refund Processing ══════════ */}
        <TabsContent value="3" className="rpc-tab-content space-y-4">
          <div className="rpc-refund-grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.refunds.map((rfd) => {
              const isRefund = !rfd.isReplacement
              return (
                <Card key={rfd.id} className={`rpc-refund-card group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${isRefund ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-amber-500"}`}>
                  <div className={`rpc-refund-card-header p-3 ${isRefund ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-amber-500 to-amber-600"} text-white`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{isRefund ? "Refund" : "Replacement"}</span>
                      <RefundStatusBadge status={rfd.status} />
                    </div>
                    <p className="text-2xl font-bold mt-1">{fmtINR(rfd.amount)}</p>
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Method</span><RefundMethodBadge method={rfd.method} /></div>
                    <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Original Payment</span><Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400">{rfd.originalPayment}</Badge></div>
                    <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Processing Time</span><ResolutionTimeTile days={rfd.processingTime} /></div>
                    <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Satisfaction</span><SatisfactionBar rating={rfd.satisfaction} /></div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ══════════ Tab 4: Resale & Disposition ══════════ */}
        <TabsContent value="4" className="rpc-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search dispositions..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="text-xs">{filteredDispositions.length} items</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="rpc-disposition-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Condition</th><th className="p-2 text-left">Listed</th><th className="p-2 text-left">Original</th><th className="p-2 text-left">Markdown</th><th className="p-2 text-left">Platform</th><th className="p-2 text-left">Days</th></tr></thead>
              <tbody>
                {filteredDispositions.map((d) => (
                  <tr key={d.id} className="rpc-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{d.id}</td>
                    <td className="p-2"><DispositionBadge type={d.type} /></td>
                    <td className="p-2"><GradeBadge grade={d.grade} /></td>
                    <td className="p-2"><ConditionBar level={100 - d.markdown} /></td>
                    <td className="p-2"><ReturnTile amount={d.listedPrice} /></td>
                    <td className="p-2 text-[10px] font-medium text-gray-600 dark:text-gray-400">{fmtINR(d.originalPrice)}</td>
                    <td className="p-2"><MarkdownTile percent={d.markdown} /></td>
                    <td className="p-2"><PlatformBadge platform={d.platform} /></td>
                    <td className="p-2"><ResolutionTimeTile days={d.daysToResell} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 5: Analytics ══════════ */}
        <TabsContent value="5" className="rpc-tab-content space-y-4">
          <div className="rpc-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {[
              { label: "Total Returns (YTD)", value: data.returns.length, icon: PackageOpen, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
              { label: "Refund Rate", value: `${((data.refunds.filter(x => x.status === "Completed").length / Math.max(data.returns.length, 1)) * 100).toFixed(1)}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Total Refund Value", value: fmtINR(data.refunds.reduce((s, r) => s + r.amount, 0)), icon: IndianRupee, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
              { label: "Resale Recovery", value: fmtINR(data.dispositions.filter(x => x.type.startsWith("Resell")).reduce((s, d) => s + d.listedPrice, 0)), icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            ].map((k, i) => (
              <Card key={i} className={`rpc-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="rpc-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="rpc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Return Trend</CardTitle></CardHeader>
              <CardContent><LineChart data={Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Returns: ri(40, 120, i + 200), Refunds: ri(200000, 1500000, i + 300) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="Returns" stroke="#d97706" strokeWidth={2} yAxisId={0} /><Line type="monotone" dataKey="Refunds" stroke="#059669" strokeWidth={2} yAxisId={1} /></LineChart></CardContent>
            </Card>
            <Card className="rpc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Category Return Rate</CardTitle></CardHeader>
              <CardContent><BarChart data={CATEGORIES.map((c, i) => ({ category: c, rate: ri(1, 8, i + 400) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 10 }} unit="%" /><Tooltip /><Bar dataKey="rate" fill="#e11d48" radius={[4, 4, 0, 0]} /></BarChart></CardContent>
            </Card>
            <Card className="rpc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Return Reasons</CardTitle></CardHeader>
              <CardContent><BarChart data={RETURN_REASONS.map((r, i) => ({ reason: r, count: ri(5, 40, i + 500) }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis dataKey="reason" type="category" tick={{ fontSize: 9 }} width={90} /><Tooltip /><Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} /></BarChart></CardContent>
            </Card>
            <Card className="rpc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Financial Impact (6 months)</CardTitle></CardHeader>
              <CardContent><AreaChart data={Array.from({ length: 6 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i], Refund: ri(500, 1500, i + 600), Logistics: ri(100, 400, i + 650), Replacement: ri(80, 300, i + 700), Recovery: ri(200, 800, i + 750) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Refund" stackId="a" fill="#e11d48" /><Area type="monotone" dataKey="Logistics" stackId="a" fill="#d97706" /><Area type="monotone" dataKey="Replacement" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Recovery" stackId="a" fill="#059669" /></AreaChart></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ══════════ Sheet ══════════ */}
      <Sheet open={!!(sheetOpen && selectedReturn)} onOpenChange={o => { setSheetOpen(o); if (!o) setSelectedReturn(null) }}>
        <SheetContent className="rpc-sheet w-full sm:w-[540px]">
          {selectedReturn && (
            <>
              <div className="rpc-sheet-header bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-500 p-6 mx-6 mt-6 rounded-xl text-white">
                <SheetHeader><SheetTitle className="text-white">Return Request Detail</SheetTitle></SheetHeader>
                <p className="text-sm opacity-80 mt-1">{selectedReturn.id} | {selectedReturn.platform}</p>
              </div>
              <ScrollArea className="mt-4 px-6">
                <div className="space-y-3 pb-6">
                  <div className="rpc-detail-grid grid grid-cols-2 gap-3">
                    <div className="rpc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Status</p><ReturnStatusBadge status={selectedReturn.status} /></div>
                    <div className="rpc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Reason</p><ReturnReasonBadge reason={selectedReturn.reason} /></div>
                    <div className="rpc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Platform</p><PlatformBadge platform={selectedReturn.platform} /></div>
                    <div className="rpc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Category</p><Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium">{selectedReturn.category}</Badge></div>
                    <div className="rpc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Value</p><ReturnTile amount={selectedReturn.value} /></div>
                    <div className="rpc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Customer</p><p className="text-[11px] font-semibold">{selectedReturn.customer}</p></div>
                    <div className="rpc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Order ID</p><p className="text-[11px] font-mono font-semibold">{selectedReturn.orderId}</p></div>
                    <div className="rpc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">City</p><p className="text-[11px] font-medium">{selectedReturn.city}</p></div>
                    <div className="rpc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800 col-span-2"><p className="text-[10px] text-gray-500 dark:text-gray-400">Pickup Slot</p><p className="text-[11px] font-semibold">{selectedReturn.pickupSlot}</p></div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
