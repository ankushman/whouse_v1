"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import {
  Package, Search, Eye, Box, Leaf, ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
  IndianRupee, Recycle, Droplets, Zap, Weight, TrendingUp, Layers,
  Tag, Archive, BoxSelect, ArrowUpRight, ArrowDownRight, Activity, PackageCheck,
  RefreshCw, FileDown,
} from "lucide-react"

// ============================================================================
// Helpers
// ============================================================================
function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  s = (s * 16807) % 2147483647
  return (s - 1) / 2147483646
}
const pick = <T,>(arr: readonly T[], seed: number) => arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const formatINR = (n: number) =>
  n >= 10000000 ? `\u20b9${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `\u20b9${(n / 100000).toFixed(2)} L` : `\u20b9${n.toLocaleString("en-IN")}`

// ============================================================================
// Theme Colors
// ============================================================================
const C = { emerald: "#059669", orange: "ea580c", blue: "#3b82f6", amber: "#d97706", violet: "#7c3aed", rose: "#e11d48" }
const CC = [C.emerald, C.orange, C.blue, C.amber, C.violet, C.rose, "#0d9488", "#4f46e5"]

// ============================================================================
// Enum Arrays
// ============================================================================
const PKG_TYPES = ["Standard Box", "Custom Box", "Poly Mailer", "Tube", "Envelope", "Pallet Wrap", "Gift Box", "Eco-Friendly"] as const
const PKG_SIZES = ["S", "M", "L", "XL", "Custom"] as const
const MATERIALS = ["3-ply Corrugated", "5-ply Corrugated", "Bubble", "Kraft", "Polyethylene", "Foam", "Molded Pulp", "PLA Biodegradable"] as const
const PRIORITIES = ["Rush", "High", "Medium", "Low"] as const
const PKG_STATUSES = ["Queued", "In Progress", "Quality Check", "Completed", "Failed", "Rework"] as const
const CUSTOMERS = [
  "Rajesh Agarwal", "Priya Sharma", "Amit Patel", "Sunita Desai", "Vikram Mehta",
  "Neha Gupta", "Ravi Krishnan", "Ananya Iyer", "Suresh Nair", "Meena Reddy",
  "Karthik Rajan", "Deepa Joshi", "Arjun Verma", "Lakshmi Rao", "Sanjay Mishra",
  "Pooja Kulkarni", "Manish Singh", "Swati Bhat", "Rahul Das", "Anita Banerjee",
  "Harish Chauhan", "Divya Menon", "Prakash Hegde", "Kavita Saxena", "Sunil Yadav",
  "Ritu Sharma", "Ashok Kumar", "Nandini Pillai", "Vijay Thakur", "Geeta Sharma",
  "Arun Nambiar", "Shalini Kapoor", "Dinesh Pandey", "Bharathi Raman", "Gaurav Jain",
  "Sneha Patil", "Mohan Lal", "Rekha Verma", "Tushar Sharma", "Ishaan Malhotra",
  "Pallavi Deshmukh", "Nikhil Srivastava", "Aparna Krishnan", "Rohit Gupta", "Meera Nair",
  "Varun Khanna", "Sanya Iyer", "Rajat Kohli", "Tanya Agarwal", "Kunal Bhatt",
  "Aditi Singh", "Manish Tiwari", "Rajani Murthy", "Harpreet Kaur", "Balu Iyer",
] as const
const SKUS = [
  "IN-ELC-001", "IN-APR-012", "IN-FMG-045", "IN-TEX-023", "IN-PHA-089",
  "IN-AUT-067", "IN-HOM-034", "IN-SPT-056", "IN-FOO-078", "IN-ELC-102",
  "IN-APR-098", "IN-FMG-033", "IN-TEX-067", "IN-PHA-044", "IN-AUT-012",
  "IN-BKS-089", "IN-GMN-023", "IN-ELC-056", "IN-APR-067", "IN-FMG-091",
] as const
const MAT_INV_TYPES = ["Corrugated Sheet", "Bubble Wrap Roll", "Poly Mailer", "Packing Tape", "Stretch Film", "Foam Sheet", "Kraft Paper", "Air Column Roll"] as const
const GRADES = ["Standard", "Premium", "Heavy Duty", "Eco-Certified", "Food Safe"] as const
const STOCK_STATUSES = ["In Stock", "Low Stock", "Reorder", "Out of Stock", "Expired"] as const
const SUPPLIERS = [
  "Khanna Packaging", "IndiaMart Supply", "Divine Box Mfg", "Shreeji Packwell", "Sai Baba Industries",
  "Rajesh Printers", "Patel Box Works", "GreenPack Solutions", "NovaPack Ltd", "EcoWrap India",
  "PrimePack Industries", "Mahavir Packaging", "Singhania Polymers", "Tamil Nadu Packagers", "Bengaluru Box Co",
] as const
const METRIC_TYPES = ["Carbon Footprint", "Recycled Content %", "Plastic Reduction", "Waste Diversion", "Water Usage", "Energy Consumption"] as const
const SUS_CATEGORIES = ["Packaging Material", "Shipping Process", "Warehouse Ops", "Last Mile"] as const
const SUS_STATUSES = ["On Track", "At Risk", "Behind", "Exceeded"] as const
const CHECK_TYPES = ["Dimensional", "Weight", "Seal Integrity", "Drop Test", "Compression", "Label Accuracy", "Barcode Scan", "Visual Inspection"] as const
const QC_RESULTS = ["Pass", "Fail", "Conditional", "Retest Required"] as const
const DEFECTS = ["Over-sized", "Under-sized", "Wrong Material", "Seal Broken", "Crushed", "Label Misaligned", "Barcode Unreadable", "Insufficient Cushioning"] as const
const SEVERITIES = ["Critical", "Major", "Minor", "Cosmetic"] as const
const ACTIONS = ["Repackage", "Add Cushioning", "Relabel", "Reject Material", "Use Alternative", "No Action", "Escalate"] as const
const INSPECTORS = [
  "Ramesh Kumar", "Suresh Patel", "Anil Joshi", "Deepak Sharma", "Sanjay Gupta",
  "Rajesh Verma", "Vikram Singh", "Pradeep Rao", "Venkat Raman", "Mohan Iyer",
  "Ashok Nair", "Karthik Menon", "Harish Bhat", "Prakash Hegde", "Sunil Kulkarni",
  "Dinesh Yadav", "Manoj Tiwari", "Ajay Dubey", "Bhaskar Rao", "Nikhil Pandey",
] as const
const MAT_PIE_NAMES = ["Corrugated Box", "Bubble Wrap", "Poly Mailer", "Paper Fill", "Foam Insert", "Stretch Wrap", "Kraft Bag", "Custom Molded"] as const
const PKG_CATS = ["Small", "Medium", "Large", "Oversized", "Fragile", "Hazmat", "Palletized"] as const

// ============================================================================
// Color Maps
// ============================================================================
const PRIORITY_CLR: Record<string, string> = {
  Rush: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
}
const STATUS_CLR: Record<string, string> = {
  Queued: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Quality Check": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Failed: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  Rework: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
}
const GRADE_CLR: Record<string, string> = {
  Standard: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Premium: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  "Heavy Duty": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "Eco-Certified": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Food Safe": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
}
const STOCK_CLR: Record<string, string> = {
  "In Stock": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Low Stock": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Reorder: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "Out of Stock": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  Expired: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
}
const SUS_STATUS_CLR: Record<string, string> = {
  "On Track": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "At Risk": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Behind: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  Exceeded: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
}
const RESULT_CLR: Record<string, string> = {
  Pass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Fail: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  Conditional: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Retest Required": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
}
const SEV_CLR: Record<string, string> = {
  Critical: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  Major: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Minor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Cosmetic: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
}
const PKG_TYPE_ICONS: Record<string, React.ReactNode> = {
  "Standard Box": <Box className="h-2.5 w-2.5" />,
  "Custom Box": <BoxSelect className="h-2.5 w-2.5" />,
  "Poly Mailer": <Archive className="h-2.5 w-2.5" />,
  Tube: <Package className="h-2.5 w-2.5" />,
  Envelope: <Tag className="h-2.5 w-2.5" />,
  "Pallet Wrap": <Layers className="h-2.5 w-2.5" />,
  "Gift Box": <Box className="h-2.5 w-2.5" />,
  "Eco-Friendly": <Leaf className="h-2.5 w-2.5" />,
}
const METRIC_ICONS: Record<string, React.ReactNode> = {
  "Carbon Footprint": <Recycle className="h-2.5 w-2.5" />,
  "Recycled Content %": <Leaf className="h-2.5 w-2.5" />,
  "Plastic Reduction": <Droplets className="h-2.5 w-2.5" />,
  "Waste Diversion": <Recycle className="h-2.5 w-2.5" />,
  "Water Usage": <Droplets className="h-2.5 w-2.5" />,
  "Energy Consumption": <Zap className="h-2.5 w-2.5" />,
}
const ACTION_CLR: Record<string, string> = {
  Repackage: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Add Cushioning": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Relabel: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  "Reject Material": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  "Use Alternative": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "No Action": "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
  Escalate: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
}

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const orders: Record<string, string | number>[] = []
  for (let i = 0; i < 75; i++) {
    const s = i * 13 + 5
    orders.push({
      id: `SPO-${String(i + 1).padStart(4, "0")}`,
      customer: pick(CUSTOMERS, s) as string,
      sku: pick(SKUS, s + 1) as string,
      pkgType: pick(PKG_TYPES, s + 2) as string,
      size: pick(PKG_SIZES, s + 3) as string,
      material: pick(MATERIALS, s + 4) as string,
      weight: +(ri(5, 500, s + 5) / 10).toFixed(1),
      dimensions: `${ri(5, 120, s + 6)}x${ri(5, 80, s + 7)}x${ri(3, 60, s + 8)}`,
      priority: pick(PRIORITIES, s + 9) as string,
      status: pick(PKG_STATUSES, s + 10) as string,
      cost: ri(15, 2500, s + 11),
    })
  }
  const materials: Record<string, string | number>[] = []
  for (let i = 0; i < 60; i++) {
    const s = i * 17 + 3
    const stock = ri(20, 5000, s + 4)
    const reorder = ri(100, 2000, s + 5)
    const status = stock > reorder * 2 ? "In Stock" : stock > reorder ? "Low Stock" : stock > 0 ? "Reorder" : "Out of Stock"
    materials.push({
      id: `MAT-${String(i + 1).padStart(4, "0")}`,
      type: pick(MAT_INV_TYPES, s) as string,
      grade: pick(GRADES, s + 1) as string,
      unit: pick(["pcs", "m", "kg", "roll", "sheet", "box"] as const, s + 2) as string,
      stockQty: stock,
      reorderLevel: reorder,
      supplier: pick(SUPPLIERS, s + 3) as string,
      unitCost: ri(5, 1200, s + 6),
      totalValue: stock * ri(5, 1200, s + 6),
      status,
    })
  }
  const sustainability: Record<string, string | number>[] = []
  for (let i = 0; i < 55; i++) {
    const s = i * 19 + 7
    const cur = ri(10, 100, s + 3)
    const tgt = ri(60, 100, s + 4)
    const achievement = Math.round((cur / tgt) * 100)
    const status = cur >= tgt ? "Exceeded" : cur >= tgt * 0.8 ? "On Track" : cur >= tgt * 0.6 ? "At Risk" : "Behind"
    sustainability.push({
      id: `SUS-${String(i + 1).padStart(4, "0")}`,
      metricType: pick(METRIC_TYPES, s) as string,
      category: pick(SUS_CATEGORIES, s + 1) as string,
      currentValue: cur,
      target: tgt,
      achievement,
      period: pick(["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const, s + 2) as string,
      status,
    })
  }
  const qualityChecks: Record<string, string | number>[] = []
  for (let i = 0; i < 65; i++) {
    const s = i * 23 + 11
    const result = pick(QC_RESULTS, s + 5) as string
    qualityChecks.push({
      id: `QC-${String(i + 1).padStart(4, "0")}`,
      orderId: `SPO-${String(ri(1, 75, s) % 75 + 1).padStart(4, "0")}`,
      inspector: pick(INSPECTORS, s + 1) as string,
      checkType: pick(CHECK_TYPES, s + 2) as string,
      result,
      defectFound: result === "Pass" ? "None" : pick(DEFECTS, s + 3) as string,
      severity: result === "Pass" ? "None" : pick(SEVERITIES, s + 4) as string,
      actionTaken: result === "Pass" ? "No Action" : pick(ACTIONS, s + 6) as string,
      timestamp: `2025-${String(ri(1, 6, s + 7)).padStart(2, "0")}-${String(ri(1, 28, s + 8)).padStart(2, "0")} ${String(ri(6, 22, s + 9)).padStart(2, "0")}:${String(ri(0, 59, s + 10)).padStart(2, "0")}`,
    })
  }
  const hourlyThroughput = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    Standard: ri(80, 300, i * 3 + 100),
    Eco: ri(20, 120, i * 3 + 101),
    Fragile: ri(10, 60, i * 3 + 102),
  }))
  const materialPie = MAT_PIE_NAMES.map((n, i) => ({ name: n, value: ri(50, 300, i * 7 + 200) }))
  const categoryBar = PKG_CATS.map((n, i) => ({ name: n, count: ri(100, 600, i * 11 + 300) }))
  const dailyVolume = Array.from({ length: 14 }, (_, i) => ({ day: `Jun ${i + 1}`, volume: ri(800, 2500, i * 5 + 400) }))
  const materialCostBreakdown = MATERIALS.slice(0, 6).map((m, i) => ({ name: m, cost: ri(50000, 500000, i * 9 + 500) }))
  const defectTypeBar = DEFECTS.map((d, i) => ({ name: d, count: ri(5, 80, i * 7 + 600) }))
  const costTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
    month: m,
    Material: ri(200000, 800000, i * 4 + 700),
    Labor: ri(100000, 400000, i * 4 + 701),
    Overhead: ri(50000, 200000, i * 4 + 702),
    "Quality Control": ri(30000, 150000, i * 4 + 703),
  }))
  return {
    orders, materials, sustainability, qualityChecks,
    hourlyThroughput, materialPie, categoryBar, dailyVolume,
    materialCostBreakdown, defectTypeBar, costTrend,
    PKG_STATUSES, STOCK_STATUSES, SUS_STATUSES, QC_RESULTS,
  }
}

// ============================================================================
// Unique Visual Components (16+)
// ============================================================================

// 1. PackageTypeBadge — 8 types with icons
function PackageTypeBadge({ type }: { type: string }) {
  return (
    <span className="sph-pkg-type inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
      {PKG_TYPE_ICONS[type] ?? <Box className="h-2.5 w-2.5" />}{type}
    </span>
  )
}

// 2. PackageSizeBadge — 5 sizes with color scaling
function PackageSizeBadge({ size }: { size: string }) {
  const cl: Record<string, string> = {
    S: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
    M: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    L: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    XL: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    Custom: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  }
  return <span className={cn("sph-pkg-size inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", cl[size] ?? cl.M)}>{size}</span>
}

// 3. MaterialBadge — 8 materials
function MaterialBadge({ mat }: { mat: string }) {
  return <span className="sph-material inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">{mat}</span>
}

// 4. PriorityBadge — 4-tier, Rush with pulse
function PriorityBadge({ p }: { p: string }) {
  const pulse = p === "Rush" ? "animate-pulse" : ""
  return <span className={cn("sph-priority inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", PRIORITY_CLR[p] ?? "", pulse)}>{p}</span>
}

// 5. PackagingStatusBadge — 6-tier, In Progress with pulse
function PackagingStatusBadge({ s }: { s: string }) {
  const pulse = s === "In Progress" ? "animate-pulse" : ""
  return <span className={cn("sph-status inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", STATUS_CLR[s] ?? "", pulse)}>{s}</span>
}

// 6. MaterialGradeBadge — 5 grades
function MaterialGradeBadge({ g }: { g: string }) {
  return <span className={cn("sph-grade inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium", GRADE_CLR[g] ?? "bg-gray-100 text-gray-700")}>{g}</span>
}

// 7. StockStatusBadge — 5-tier, Out of Stock red pulse, Low Stock amber pulse
function StockStatusBadge({ s }: { s: string }) {
  const pulse = s === "Out of Stock" ? "animate-pulse" : s === "Low Stock" ? "animate-pulse" : ""
  return <span className={cn("sph-stock-status inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", STOCK_CLR[s] ?? "", pulse)}>{s}</span>
}

// 8. StockLevelBar — 3-color gradient with threshold markers
function StockLevelBar({ qty, reorder }: { qty: number; reorder: number }) {
  const pct = Math.min((qty / (reorder * 3)) * 100, 100)
  const tier = pct >= 66
    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
    : pct >= 33 ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-red-500 to-red-400"
  return (
    <div className="sph-stock-bar flex items-center gap-1.5">
      <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
        <div className={cn("h-full rounded-full", tier)} style={{ width: `${pct}%` }} />
        <div className="absolute top-0 h-full w-px bg-rose-500/60" style={{ left: `${33}%` }} />
        <div className="absolute top-0 h-full w-px bg-amber-500/60" style={{ left: `${66}%` }} />
      </div>
      <span className="text-[10px] font-medium text-muted-foreground">{qty.toLocaleString("en-IN")}</span>
    </div>
  )
}

// 9. MetricTypeBadge — 6 sustainability metrics with icons
function MetricTypeBadge({ m }: { m: string }) {
  return (
    <span className="sph-metric-type inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-800 dark:bg-violet-900/40 dark:text-violet-300">
      {METRIC_ICONS[m] ?? <Activity className="h-2.5 w-2.5" />}{m}
    </span>
  )
}

// 10. AchievementBar — 3-color: green >60%, amber 40-60%, red <40%
function AchievementBar({ pct }: { pct: number }) {
  const tier = pct >= 60
    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
    : pct >= 40 ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-red-500 to-red-400"
  const txtCl = pct >= 60 ? "text-emerald-700 dark:text-emerald-400" : pct >= 40 ? "text-amber-700 dark:text-amber-400" : "text-red-700 dark:text-red-400"
  return (
    <div className="sph-achievement flex items-center gap-1.5">
      <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full", tier)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className={cn("text-[10px] font-semibold", txtCl)}>{pct}%</span>
    </div>
  )
}

// 11. QCResultBadge — 4-tier
function QCResultBadge({ r }: { r: string }) {
  return <span className={cn("sph-qc-result inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", RESULT_CLR[r] ?? "")}>{r}</span>
}

// 12. DefectBadge — 8 types
function DefectBadge({ d }: { d: string }) {
  return <span className="sph-defect inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">{d}</span>
}

// 13. SeverityBadge — 4-tier, Critical pulse
function SeverityBadge({ s }: { s: string }) {
  const pulse = s === "Critical" ? "animate-pulse" : ""
  return <span className={cn("sph-severity inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", SEV_CLR[s] ?? "", pulse)}>{s}</span>
}

// 14. ActionTakenBadge — 7 actions
function ActionTakenBadge({ a }: { a: string }) {
  return <span className={cn("sph-action inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium", ACTION_CLR[a] ?? ACTION_CLR["No Action"])}>{a}</span>
}

// 15. ValueTile — INR formatted
function ValueTile({ amount }: { amount: number }) {
  return (
    <span className="sph-value-tile inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
      <IndianRupee className="h-3 w-3" />{formatINR(amount)}
    </span>
  )
}

// 16. WeightTile — kg with conditional color
function WeightTile({ kg }: { kg: number }) {
  const cl = kg > 30
    ? "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30"
    : kg > 10 ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" : "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
  return (
    <span className={cn("sph-weight-tile inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold", cl)}>
      <Weight className="h-3 w-3" />{kg} kg
    </span>
  )
}

// Shared: KpiCard
function KpiCard({ title, value, subtitle, icon: Icon, trend, color }: {
  title: string; value: string; subtitle: string; icon: React.ElementType; trend?: "up" | "down" | "neutral"; color: string
}) {
  return (
    <Card className="hover-lift-sm sph-kpi">
      <CardContent className="inner-glow glass-subtle p-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground font-medium">{title}</span>
            <span className="text-lg font-bold tracking-tight">{value}</span>
            <div className="flex items-center gap-1">
              {trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
              {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-600 dark:text-red-400" />}
              <span className="text-[10px] text-muted-foreground">{subtitle}</span>
            </div>
          </div>
          <div className={cn("rounded-lg p-2", color)}><Icon className="h-4 w-4 text-white" /></div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export default function SmartPackagingHubView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState<string>("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterVal, setFilterVal] = useState("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<Record<string, string | number> | null>(null)
  const [sortCol, setSortCol] = useState<string>("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const openDrawer = (type: string, item: Record<string, string | number>) => {
    setDrawerType(type)
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortCol(col); setSortDir("asc") }
  }

  const SortHeader = ({ col, label }: { col: string; label: string }) => (
    <TableHead className="text-xs cursor-pointer select-none hover:bg-accent/50 sph-sort-header" onClick={() => handleSort(col)}>
      <div className="flex items-center gap-0.5">
        {label}{sortCol === col && <span className="text-[9px]">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>}
      </div>
    </TableHead>
  )

  const sortFn = (a: Record<string, string | number>, b: Record<string, string | number>) => {
    const av = a[sortCol] ?? ""; const bv = b[sortCol] ?? ""
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv))
    return sortDir === "asc" ? cmp : -cmp
  }

  const filteredOrders = useMemo(() => {
    let f = data.orders
    if (searchTerm) f = f.filter(o => String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) || String(o.customer).toLowerCase().includes(searchTerm.toLowerCase()) || String(o.sku).toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterVal !== "all") f = f.filter(o => o.status === filterVal)
    return [...f].sort(sortFn)
  }, [data.orders, searchTerm, filterVal, sortCol, sortDir])

  const filteredMaterials = useMemo(() => {
    let f = data.materials
    if (searchTerm) f = f.filter(m => String(m.id).toLowerCase().includes(searchTerm.toLowerCase()) || String(m.type).toLowerCase().includes(searchTerm.toLowerCase()) || String(m.supplier).toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterVal !== "all") f = f.filter(m => m.status === filterVal)
    return [...f].sort(sortFn)
  }, [data.materials, searchTerm, filterVal, sortCol, sortDir])

  const filteredSus = useMemo(() => {
    let f = data.sustainability
    if (searchTerm) f = f.filter(s => String(s.id).toLowerCase().includes(searchTerm.toLowerCase()) || String(s.metricType).toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterVal !== "all") f = f.filter(s => s.status === filterVal)
    return [...f].sort(sortFn)
  }, [data.sustainability, searchTerm, filterVal, sortCol, sortDir])

  const filteredQC = useMemo(() => {
    let f = data.qualityChecks
    if (searchTerm) f = f.filter(q => String(q.id).toLowerCase().includes(searchTerm.toLowerCase()) || String(q.inspector).toLowerCase().includes(searchTerm.toLowerCase()) || String(q.orderId).toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterVal !== "all") f = f.filter(q => q.result === filterVal)
    return [...f].sort(sortFn)
  }, [data.qualityChecks, searchTerm, filterVal, sortCol, sortDir])

  const tab = activeTab
  const filterOptions = tab === "1" ? data.PKG_STATUSES : tab === "2" ? data.STOCK_STATUSES : tab === "3" ? data.SUS_STATUSES : tab === "4" ? data.QC_RESULTS : []

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <PageHeader title="Smart Packaging Hub" description="AI-powered packaging operations, material management & quality control for Indian warehouses" />

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchTerm(""); setFilterVal("all") }}>
        <TabsList className="grid w-full grid-cols-6 h-9">
          <TabsTrigger value="0" className="text-[11px]">Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="text-[11px]">Packaging Orders</TabsTrigger>
          <TabsTrigger value="2" className="text-[11px]">Material Inventory</TabsTrigger>
          <TabsTrigger value="3" className="text-[11px]">Sustainability</TabsTrigger>
          <TabsTrigger value="4" className="text-[11px]">Quality Control</TabsTrigger>
          <TabsTrigger value="5" className="text-[11px]">Analytics</TabsTrigger>
        </TabsList>

        {/* TAB 0 — Packaging Dashboard */}
        <TabsContent value="0" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sph-kpi-grid">
            <KpiCard title="Total Packages Today" value="1,247" subtitle="+12% vs yesterday" icon={Package} trend="up" color="bg-emerald-600" />
            <KpiCard title="Material Cost" value={formatINR(485000)} subtitle="-8% this month" icon={IndianRupee} trend="down" color="bg-orange-600" />
            <KpiCard title="Avg Package Weight" value="4.8 kg" subtitle="Optimized" icon={Weight} trend="up" color="bg-blue-600" />
            <KpiCard title="Sustainability Score" value="82.3%" subtitle="+3.2% improvement" icon={Leaf} trend="up" color="bg-violet-600" />
            <KpiCard title="Defect Rate" value="2.1%" subtitle="Below 3% target" icon={ShieldCheck} trend="up" color="bg-amber-600" />
            <KpiCard title="Throughput/hr" value="186" subtitle="Peak capacity" icon={TrendingUp} trend="up" color="bg-rose-600" />
            <KpiCard title="Material Utilization" value="91.4%" subtitle="+1.8% vs target" icon={Layers} trend="up" color="bg-blue-600" />
            <KpiCard title="Cost Savings" value={formatINR(125000)} subtitle="This month" icon={PackageCheck} trend="up" color="bg-emerald-600" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="hover-lift-sm sph-chart col-span-1 md:col-span-2">
              <CardHeader><CardTitle className="text-sm">Hourly Throughput (Stacked)</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[220px]"><AreaChart data={data.hourlyThroughput}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Standard" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="Eco" stackId="1" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="Fragile" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                </AreaChart></div>
              </CardContent>
            </Card>
            <Card className="hover-lift-sm sph-chart">
              <CardHeader><CardTitle className="text-sm">Material Type Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[220px]"><PieChart>
                  <Pie data={data.materialPie} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" label={({ name }: { name: string }) => <span className="text-[9px]">{name}</span>} labelLine={false}>
                    {data.materialPie.map((_: { name: string; value: number }, i: number) => <Cell key={i} fill={CC[i % CC.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart></div>
              </CardContent>
            </Card>
          </div>
          <Card className="hover-lift-sm sph-chart">
            <CardHeader><CardTitle className="text-sm">Package Category Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[200px]"><BarChart data={data.categoryBar}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 1 — Packaging Orders */}
        <TabsContent value="1" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search order, customer, SKU..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filterOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="sph-table-row">
              <SortHeader col="id" label="Order ID" />
              <TableHead className="text-[10px]">Customer</TableHead>
              <TableHead className="text-[10px]">SKU</TableHead>
              <TableHead className="text-[10px]">Type</TableHead>
              <TableHead className="text-[10px]">Size</TableHead>
              <TableHead className="text-[10px]">Material</TableHead>
              <TableHead className="text-[10px]">Weight</TableHead>
              <TableHead className="text-[10px]">Dimensions</TableHead>
              <TableHead className="text-[10px]">Priority</TableHead>
              <TableHead className="text-[10px]">Status</TableHead>
              <TableHead className="text-[10px]">Cost</TableHead>
              <TableHead className="text-[10px] w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredOrders.map((o) => (
                <TableRow key={o.id} className="cursor-pointer sph-table-row hover:bg-muted/50" onClick={() => openDrawer("order", o)}>
                  <TableCell className="text-xs font-mono font-semibold">{o.id}</TableCell>
                  <TableCell className="text-[10px]">{o.customer}</TableCell>
                  <TableCell className="text-[10px] font-mono">{o.sku}</TableCell>
                  <TableCell><PackageTypeBadge type={String(o.pkgType)} /></TableCell>
                  <TableCell><PackageSizeBadge size={String(o.size)} /></TableCell>
                  <TableCell><MaterialBadge mat={String(o.material)} /></TableCell>
                  <TableCell><WeightTile kg={Number(o.weight)} /></TableCell>
                  <TableCell className="text-[10px] font-mono">{o.dimensions}</TableCell>
                  <TableCell><PriorityBadge p={String(o.priority)} /></TableCell>
                  <TableCell><PackagingStatusBadge s={String(o.status)} /></TableCell>
                  <TableCell><ValueTile amount={Number(o.cost)} /></TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* TAB 2 — Material Inventory */}
        <TabsContent value="2" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search material ID, type, supplier..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filterOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="sph-table-row">
              <SortHeader col="id" label="Material ID" />
              <TableHead className="text-[10px]">Type</TableHead>
              <TableHead className="text-[10px]">Grade</TableHead>
              <TableHead className="text-[10px]">Unit</TableHead>
              <TableHead className="text-[10px]">Stock Level</TableHead>
              <TableHead className="text-[10px]">Supplier</TableHead>
              <TableHead className="text-[10px]">Unit Cost</TableHead>
              <TableHead className="text-[10px]">Total Value</TableHead>
              <TableHead className="text-[10px]">Status</TableHead>
              <TableHead className="text-[10px] w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredMaterials.map((m) => (
                <TableRow key={m.id} className="cursor-pointer sph-table-row hover:bg-muted/50" onClick={() => openDrawer("material", m)}>
                  <TableCell className="text-xs font-mono font-semibold">{m.id}</TableCell>
                  <TableCell className="text-[10px]">{m.type}</TableCell>
                  <TableCell><MaterialGradeBadge g={String(m.grade)} /></TableCell>
                  <TableCell className="text-[10px]">{m.unit}</TableCell>
                  <TableCell><StockLevelBar qty={Number(m.stockQty)} reorder={Number(m.reorderLevel)} /></TableCell>
                  <TableCell className="text-[10px]">{m.supplier}</TableCell>
                  <TableCell><ValueTile amount={Number(m.unitCost)} /></TableCell>
                  <TableCell><ValueTile amount={Number(m.totalValue)} /></TableCell>
                  <TableCell><StockStatusBadge s={String(m.status)} /></TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* TAB 3 — Sustainability Tracker */}
        <TabsContent value="3" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search record, metric, category..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filterOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="sph-table-row">
              <SortHeader col="id" label="Record ID" />
              <TableHead className="text-[10px]">Metric</TableHead>
              <TableHead className="text-[10px]">Category</TableHead>
              <TableHead className="text-[10px]">Current</TableHead>
              <TableHead className="text-[10px]">Target</TableHead>
              <TableHead className="text-[10px]">Achievement</TableHead>
              <TableHead className="text-[10px]">Period</TableHead>
              <TableHead className="text-[10px]">Status</TableHead>
              <TableHead className="text-[10px] w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredSus.map((s) => (
                <TableRow key={s.id} className="cursor-pointer sph-table-row hover:bg-muted/50" onClick={() => openDrawer("sustainability", s)}>
                  <TableCell className="text-xs font-mono font-semibold">{s.id}</TableCell>
                  <TableCell><MetricTypeBadge m={String(s.metricType)} /></TableCell>
                  <TableCell className="text-[10px]">{s.category}</TableCell>
                  <TableCell className="numeric-cell text-[10px] font-medium">{s.currentValue}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">{s.target}</TableCell>
                  <TableCell><AchievementBar pct={Number(s.achievement)} /></TableCell>
                  <TableCell className="text-[10px]">{s.period}</TableCell>
                  <TableCell><span className={cn("sph-sus-status inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", SUS_STATUS_CLR[String(s.status)] ?? "")}>{String(s.status)}</span></TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* TAB 4 — Quality Control */}
        <TabsContent value="4" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search check ID, inspector, order..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Result" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                {filterOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="sph-table-row">
              <SortHeader col="id" label="Check ID" />
              <TableHead className="text-[10px]">Order</TableHead>
              <TableHead className="text-[10px]">Inspector</TableHead>
              <TableHead className="text-[10px]">Type</TableHead>
              <TableHead className="text-[10px]">Result</TableHead>
              <TableHead className="text-[10px]">Defect</TableHead>
              <TableHead className="text-[10px]">Severity</TableHead>
              <TableHead className="text-[10px]">Action</TableHead>
              <TableHead className="text-[10px]">Timestamp</TableHead>
              <TableHead className="text-[10px] w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredQC.map((q) => (
                <TableRow key={q.id} className="cursor-pointer sph-table-row hover:bg-muted/50" onClick={() => openDrawer("qc", q)}>
                  <TableCell className="text-xs font-mono font-semibold">{q.id}</TableCell>
                  <TableCell className="text-[10px] font-mono">{q.orderId}</TableCell>
                  <TableCell className="text-[10px]">{q.inspector}</TableCell>
                  <TableCell className="text-[10px]">{q.checkType}</TableCell>
                  <TableCell><QCResultBadge r={String(q.result)} /></TableCell>
                  <TableCell>{String(q.defectFound) === "None" ? <span className="text-[10px] text-muted-foreground">—</span> : <DefectBadge d={String(q.defectFound)} />}</TableCell>
                  <TableCell>{String(q.severity) === "None" ? <span className="text-[10px] text-muted-foreground">—</span> : <SeverityBadge s={String(q.severity)} />}</TableCell>
                  <TableCell><ActionTakenBadge a={String(q.actionTaken)} /></TableCell>
                  <TableCell className="text-[10px] whitespace-nowrap">{String(q.timestamp)}</TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* TAB 5 — Packaging Analytics */}
        <TabsContent value="5" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sph-kpi-grid">
            <KpiCard title="Avg Cost/Pkg" value={formatINR(389)} subtitle="-12% vs last month" icon={IndianRupee} trend="down" color="bg-emerald-600" />
            <KpiCard title="Defect Rate" value="2.1%" subtitle="Below 3% target" icon={ShieldCheck} trend="up" color="bg-blue-600" />
            <KpiCard title="Material Waste" value="3.4%" subtitle="-0.8% improvement" icon={Recycle} trend="down" color="bg-orange-600" />
            <KpiCard title="Eco Packages" value="34.2%" subtitle="+5.1% this quarter" icon={Leaf} trend="up" color="bg-violet-600" />
            <KpiCard title="Throughput Peak" value="248/hr" subtitle="Today 14:00" icon={TrendingUp} trend="up" color="bg-amber-600" />
            <KpiCard title="QC Pass Rate" value="97.8%" subtitle="+0.3% vs target" icon={CheckCircle2} trend="up" color="bg-rose-600" />
            <KpiCard title="Rework Rate" value="1.8%" subtitle="-0.5% vs target" icon={AlertTriangle} trend="down" color="bg-blue-600" />
            <KpiCard title="Monthly Savings" value={formatINR(425000)} subtitle="Packaging optimization" icon={PackageCheck} trend="up" color="bg-emerald-600" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="hover-lift-sm sph-chart">
              <CardHeader><CardTitle className="text-sm">Daily Volume (14 Days)</CardTitle></CardHeader>
              <CardContent><div className="h-[220px]"><LineChart data={data.dailyVolume}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} />
              </LineChart></div></CardContent>
            </Card>
            <Card className="hover-lift-sm sph-chart">
              <CardHeader><CardTitle className="text-sm">Material Cost Breakdown</CardTitle></CardHeader>
              <CardContent><div className="h-[220px]"><BarChart data={data.materialCostBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="cost" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart></div></CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="hover-lift-sm sph-chart">
              <CardHeader><CardTitle className="text-sm">Defect Type Distribution</CardTitle></CardHeader>
              <CardContent><div className="h-[220px]"><BarChart data={data.defectTypeBar} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#e11d48" radius={[0, 4, 4, 0]} />
              </BarChart></div></CardContent>
            </Card>
            <Card className="hover-lift-sm sph-chart">
              <CardHeader><CardTitle className="text-sm">Cost Trend (6-Month Stacked)</CardTitle></CardHeader>
              <CardContent><div className="h-[220px]"><AreaChart data={data.costTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="Material" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.4} />
                <Area type="monotone" dataKey="Labor" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Area type="monotone" dataKey="Overhead" stackId="1" stroke="#d97706" fill="#d97706" fillOpacity={0.4} />
                <Area type="monotone" dataKey="Quality Control" stackId="1" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.4} />
              </AreaChart></div></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Sheet */}
      <Sheet open={!!(drawerOpen && drawerType)} onOpenChange={(open) => { setDrawerOpen(open); if (!open) { setDrawerType(null); setSelectedItem(null) } }}>
        <SheetContent side="right" className="w-[460px] overflow-y-auto p-0">
          <SheetHeader className="sr-only"><SheetTitle>Detail View</SheetTitle></SheetHeader>

          {drawerType === "order" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-emerald-600 to-orange-500 p-6 text-white sph-sheet-header">
                <div className="flex items-center gap-2 mb-2"><Package className="h-5 w-5" /><h3 className="text-lg font-bold">{String(selectedItem.id)}</h3></div>
                <div className="flex flex-wrap items-center gap-2">
                  <PackagingStatusBadge s={String(selectedItem.status)} />
                  <PriorityBadge p={String(selectedItem.priority)} />
                  <PackageTypeBadge type={String(selectedItem.pkgType)} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Customer</span><span className="text-xs font-medium">{String(selectedItem.customer)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">SKU</span><span className="text-xs font-mono">{String(selectedItem.sku)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Size</span><PackageSizeBadge size={String(selectedItem.size)} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Dimensions</span><span className="text-xs font-mono">{String(selectedItem.dimensions)} cm</span></div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <MaterialBadge mat={String(selectedItem.material)} />
                  <WeightTile kg={Number(selectedItem.weight)} />
                  <ValueTile amount={Number(selectedItem.cost)} />
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="press-scale h-8 text-xs gap-1 sph-action" onClick={() => { toast.success("Updated", `Order ${String(selectedItem.id)} updated`) }}><CheckCircle2 className="h-3 w-3" />Update</Button>
                  <Button size="sm" variant="outline" className="press-scale btn-outline-animate h-8 text-xs gap-1 sph-action" onClick={() => { toast.info("Reprinting", "Label reprinted") }}><RefreshCw className="h-3 w-3" />Reprint Label</Button>
                  <Button size="sm" variant="destructive" className="press-scale h-8 text-xs gap-1 sph-action" onClick={() => { toast.error("Cancelled", `Order ${String(selectedItem.id)} cancelled`); setDrawerOpen(false) }}><XCircle className="h-3 w-3" />Cancel</Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "material" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-emerald-600 to-orange-500 p-6 text-white sph-sheet-header">
                <div className="flex items-center gap-2 mb-2"><Layers className="h-5 w-5" /><h3 className="text-lg font-bold">{String(selectedItem.id)}</h3></div>
                <div className="flex flex-wrap items-center gap-2">
                  <MaterialGradeBadge g={String(selectedItem.grade)} />
                  <StockStatusBadge s={String(selectedItem.status)} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Type</span><span className="text-xs font-medium">{String(selectedItem.type)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Supplier</span><span className="text-xs">{String(selectedItem.supplier)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Stock Qty</span><span className="text-xs font-semibold">{Number(selectedItem.stockQty).toLocaleString("en-IN")} {String(selectedItem.unit)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Reorder Level</span><span className="text-xs">{Number(selectedItem.reorderLevel).toLocaleString("en-IN")}</span></div>
                </div>
                <StockLevelBar qty={Number(selectedItem.stockQty)} reorder={Number(selectedItem.reorderLevel)} />
                <div className="flex flex-wrap items-center gap-3">
                  <ValueTile amount={Number(selectedItem.unitCost)} />
                  <ValueTile amount={Number(selectedItem.totalValue)} />
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="press-scale h-8 text-xs gap-1 sph-action" onClick={() => { toast.success("Reordered", `Material ${String(selectedItem.id)} reordered`) }}><RefreshCw className="h-3 w-3" />Reorder</Button>
                  <Button size="sm" variant="outline" className="press-scale btn-outline-animate h-8 text-xs gap-1 sph-action" onClick={() => { toast.info("Exported", "Stock report exported") }}><FileDown className="h-3 w-3" />Export</Button>
                  <Button size="sm" variant="destructive" className="press-scale h-8 text-xs gap-1 sph-action" onClick={() => { toast.error("Archived", `Material ${String(selectedItem.id)} archived`); setDrawerOpen(false) }}><XCircle className="h-3 w-3" />Archive</Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "sustainability" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-emerald-600 to-orange-500 p-6 text-white sph-sheet-header">
                <div className="flex items-center gap-2 mb-2"><Leaf className="h-5 w-5" /><h3 className="text-lg font-bold">{String(selectedItem.id)}</h3></div>
                <div className="flex flex-wrap items-center gap-2">
                  <MetricTypeBadge m={String(selectedItem.metricType)} />
                  <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", SUS_STATUS_CLR[String(selectedItem.status)] ?? "")}>{String(selectedItem.status)}</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Category</span><span className="text-xs">{String(selectedItem.category)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Period</span><span className="text-xs">{String(selectedItem.period)}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Current Value</span><span className="text-sm font-bold">{selectedItem.currentValue}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Target</span><span className="text-sm font-bold text-muted-foreground">{selectedItem.target}</span></div>
                </div>
                <AchievementBar pct={Number(selectedItem.achievement)} />
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="press-scale h-8 text-xs gap-1 sph-action" onClick={() => { toast.success("Saved", "Sustainability record updated") }}><CheckCircle2 className="h-3 w-3" />Update</Button>
                  <Button size="sm" variant="outline" className="press-scale btn-outline-animate h-8 text-xs gap-1 sph-action" onClick={() => { toast.info("Exported", "Sustainability report exported") }}><FileDown className="h-3 w-3" />Export</Button>
                </div>
              </div>
            </>
          )}

          {drawerType === "qc" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-emerald-600 to-orange-500 p-6 text-white sph-sheet-header">
                <div className="flex items-center gap-2 mb-2"><ShieldCheck className="h-5 w-5" /><h3 className="text-lg font-bold">{String(selectedItem.id)}</h3></div>
                <div className="flex flex-wrap items-center gap-2">
                  <QCResultBadge r={String(selectedItem.result)} />
                  {String(selectedItem.severity) !== "None" && <SeverityBadge s={String(selectedItem.severity)} />}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Order</span><span className="text-xs font-mono">{String(selectedItem.orderId)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Inspector</span><span className="text-xs">{String(selectedItem.inspector)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Check Type</span><span className="text-xs">{String(selectedItem.checkType)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Timestamp</span><span className="text-xs">{String(selectedItem.timestamp)}</span></div>
                </div>
                {String(selectedItem.defectFound) !== "None" && (
                  <div className="flex flex-wrap items-center gap-2">
                    <DefectBadge d={String(selectedItem.defectFound)} />
                    <ActionTakenBadge a={String(selectedItem.actionTaken)} />
                  </div>
                )}
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="press-scale h-8 text-xs gap-1 sph-action" onClick={() => { toast.success("Recorded", "QC check recorded") }}><CheckCircle2 className="h-3 w-3" />Save</Button>
                  <Button size="sm" variant="outline" className="press-scale btn-outline-animate h-8 text-xs gap-1 sph-action" onClick={() => { toast.info("Retest", "Retest scheduled") }}><RefreshCw className="h-3 w-3" />Schedule Retest</Button>
                  <Button size="sm" variant="destructive" className="press-scale h-8 text-xs gap-1 sph-action" onClick={() => { toast.warning("Escalated", "QC check escalated to QA lead") }}><AlertTriangle className="h-3 w-3" />Escalate</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
