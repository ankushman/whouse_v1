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
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Clock,
  Activity,
  Hash,
  Percent,
  IndianRupee,
  Plus,
  Boxes,
  Layers,
  Calendar,
  Truck,
  Package,
  Factory,
  ShoppingCart,
  ChevronRight,
  CircleCheck,
  CircleDot,
  Circle,
  CirclePause,
  CircleSlash,
  Play,
  Pause,
  Target,
  Gauge,
  CalendarClock,
  ArrowRightCircle,
  ThumbsUp,
  Building2,
  Zap,
  Timer,
  ListChecks,
  FileBarChart,
  Crosshair,
  ArrowDown,
  ArrowUp,
  Minus,
  Sparkles,
  Bell,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

type MRPStatus =
  | "balanced"
  | "below-safety"
  | "reorder-due"
  | "reorder-placed"
  | "critical-shortage"
  | "overstock"
  | "obsolete-risk"

type MRPAction =
  | "none"
  | "expedite"
  | "raise-po"
  | "transfer"
  | "reduce"
  | "scrap"
  | "monitor"

type MRPABC = "A" | "B" | "C"

type MRPStrategy = "min-max" | "eoq" | "jit" | "safety-stock" | "mrp-net"

interface MRPDemandEntry {
  date: string
  source: "sales-order" | "work-order" | "forecast" | "safety-stock"
  refId: string
  qty: number
  warehouse: string
}

interface MRPSupplyEntry {
  date: string
  source: "on-hand" | "po-inbound" | "wo-completion" | "transfer-in" | "grn"
  refId: string
  qty: number
  warehouse: string
  status: "scheduled" | "in-transit" | "received" | "pending"
}

interface MRPLeadTime {
  stage: "supplier-po" | "supplier-processing" | "in-transit" | "qc-inspection" | "putaway"
  plannedDays: number
  actualDays: number
  notes: string
}

interface MRPRecommendation {
  type: "raise-po" | "expedite" | "transfer" | "reduce" | "scrap" | "monitor"
  priority: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  suggestedQty: number
  suggestedDate: string
  estimatedCost: number
  impact: string
}

interface MRPPlan {
  horizon: string
  openingQty: number
  totalDemand: number
  totalSupply: number
  projectedClosing: number
  projectedDaysOfCover: number
}

interface ReplenishmentItem {
  id: string
  partNo: string
  partDescription: string
  category: string
  uom: string
  warehouse: string
  abc: MRPABC
  strategy: MRPStrategy
  status: MRPStatus
  action: MRPAction
  onHand: number
  safetyStock: number
  reorderPoint: number
  maxLevel: number
  avgDailyDemand: number
  daysOfCover: number
  leadTimeDays: number
  eoq: number
  lastPoRef: string
  lastPoDate: string
  lastPoQty: number
  lastPoCost: number
  unitCost: number
  openPOQty: number
  openPOEta: string | null
  openWOQty: number
  openWOEta: string | null
  demand30d: number
  supply30d: number
  ytdConsumption: number
  ytdCost: number
  obsoleteRiskScore: number
  supplier: string
  supplierRating: number
  buyer: string
  plan: MRPPlan
  demands: MRPDemandEntry[]
  supplies: MRPSupplyEntry[]
  leadTimes: MRPLeadTime[]
  recommendations: MRPRecommendation[]
  notes: string
}

// ──────────────────────────────────────────────────────────
// META
// ──────────────────────────────────────────────────────────

const STATUS_META: Record<
  MRPStatus,
  { label: string; color: string; bg: string; border: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  balanced:          { label: "Balanced",          color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200",  pieColor: "#10b981", icon: CircleCheck },
  "below-safety":    { label: "Below Safety",      color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",    pieColor: "#f59e0b", icon: AlertTriangle },
  "reorder-due":     { label: "Reorder Due",       color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200",     pieColor: "#3b82f6", icon: CircleDot },
  "reorder-placed":  { label: "Reorder Placed",    color: "text-cyan-700",    bg: "bg-cyan-50",     border: "border-cyan-200",     pieColor: "#06b6d4", icon: Truck },
  "critical-shortage": { label: "Critical Shortage", color: "text-rose-700",  bg: "bg-rose-50",     border: "border-rose-200",     pieColor: "#ef4444", icon: XCircle },
  overstock:         { label: "Overstock",         color: "text-violet-700",  bg: "bg-violet-50",   border: "border-violet-200",   pieColor: "#8b5cf6", icon: ArrowUp },
  "obsolete-risk":   { label: "Obsolete Risk",     color: "text-pink-700",    bg: "bg-pink-50",     border: "border-pink-200",     pieColor: "#ec4899", icon: CircleSlash },
}

const ACTION_META: Record<
  MRPAction,
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  none:     { label: "No Action",      color: "text-slate-700",  bg: "bg-slate-100",  icon: Circle },
  expedite: { label: "Expedite",       color: "text-rose-700",   bg: "bg-rose-50",    icon: Zap },
  "raise-po": { label: "Raise PO",     color: "text-blue-700",   bg: "bg-blue-50",    icon: ShoppingCart },
  transfer: { label: "Transfer",       color: "text-cyan-700",   bg: "bg-cyan-50",    icon: ArrowRightCircle },
  reduce:   { label: "Reduce",         color: "text-amber-700",  bg: "bg-amber-50",   icon: ArrowDown },
  scrap:    { label: "Scrap",          color: "text-pink-700",   bg: "bg-pink-50",    icon: XCircle },
  monitor:  { label: "Monitor",        color: "text-violet-700", bg: "bg-violet-50",  icon: Eye },
}

const ABC_META: Record<MRPABC, { label: string; color: string; bg: string; pieColor: string }> = {
  A: { label: "A (High Value)", color: "text-rose-700",    bg: "bg-rose-50",    pieColor: "#ef4444" },
  B: { label: "B (Medium Value)", color: "text-amber-700", bg: "bg-amber-50",   pieColor: "#f59e0b" },
  C: { label: "C (Low Value)",  color: "text-emerald-700", bg: "bg-emerald-50", pieColor: "#10b981" },
}

const STRATEGY_META: Record<MRPStrategy, { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  "min-max":      { label: "Min-Max",       color: "text-blue-700",    bg: "bg-blue-50",    pieColor: "#3b82f6", icon: Target },
  "eoq":          { label: "EOQ",           color: "text-violet-700",  bg: "bg-violet-50",  pieColor: "#8b5cf6", icon: Gauge },
  "jit":          { label: "JIT",           color: "text-cyan-700",    bg: "bg-cyan-50",    pieColor: "#06b6d4", icon: Timer },
  "safety-stock": { label: "Safety Stock",  color: "text-amber-700",   bg: "bg-amber-50",   pieColor: "#f59e0b", icon: ShieldCheck2 },
  "mrp-net":      { label: "MRP Net Change",color: "text-emerald-700", bg: "bg-emerald-50", pieColor: "#10b981", icon: ListChecks },
}

function ShieldCheck2(props: { className?: string }) {
  // Lightweight inline icon to avoid extra lucide imports noise
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

// ──────────────────────────────────────────────────────────
// DETERMINISTIC HASH + MOCK DATA GEN
// ──────────────────────────────────────────────────────────

function hash(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) & 0x7fffffff
  }
  return h
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

// 16 MRP seeds — same Indian automotive parts used in WO/PS modules for continuity
const MRP_SEEDS: Array<{
  id: string
  partNo: string
  partDescription: string
  category: string
  uom: string
  warehouse: string
  abc: MRPABC
  strategy: MRPStrategy
  status: MRPStatus
  action: MRPAction
  onHand: number
  safetyStock: number
  reorderPoint: number
  maxLevel: number
  avgDailyDemand: number
  daysOfCover: number
  leadTimeDays: number
  eoq: number
  lastPoRef: string
  lastPoDate: string
  lastPoQty: number
  lastPoCost: number
  unitCost: number
  openPOQty: number
  openPOEta: string | null
  openWOQty: number
  openWOEta: string | null
  demand30d: number
  supply30d: number
  ytdConsumption: number
  ytdCost: number
  obsoleteRiskScore: number
  supplier: string
  supplierRating: number
  buyer: string
}> = [
  { id: "MRP-2026-7001", partNo: "BP-1001", partDescription: "Brake Pad Assembly — Passenger Car", category: "Finished Goods", uom: "pc", warehouse: "Chennai Hub", abc: "A", strategy: "mrp-net", status: "reorder-due", action: "raise-po", onHand: 320, safetyStock: 200, reorderPoint: 350, maxLevel: 1200, avgDailyDemand: 45, daysOfCover: 7, leadTimeDays: 8, eoq: 600, lastPoRef: "PO-2026-3001", lastPoDate: "2026-06-22", lastPoQty: 600, lastPoCost: 184000, unitCost: 368, openPOQty: 0, openPOEta: null, openWOQty: 320, openWOEta: "2026-07-28", demand30d: 1350, supply30d: 320, ytdConsumption: 14200, ytdCost: 5225600, obsoleteRiskScore: 5, supplier: "BrakeTech Components Pvt Ltd", supplierRating: 92, buyer: "Anil Mehta" },
  { id: "MRP-2026-7002", partNo: "WR-2002", partDescription: "Wheel Rim 17\" Machined", category: "Finished Goods", uom: "pc", warehouse: "Chennai Hub", abc: "A", strategy: "min-max", status: "balanced", action: "none", onHand: 540, safetyStock: 150, reorderPoint: 250, maxLevel: 800, avgDailyDemand: 22, daysOfCover: 24, leadTimeDays: 12, eoq: 400, lastPoRef: "PO-2026-2945", lastPoDate: "2026-06-18", lastPoQty: 400, lastPoCost: 96000, unitCost: 320, openPOQty: 0, openPOEta: null, openWOQty: 180, openWOEta: "2026-07-29", demand30d: 660, supply30d: 180, ytdConsumption: 7800, ytdCost: 2496000, obsoleteRiskScore: 8, supplier: "WheelWorks Industries", supplierRating: 88, buyer: "Anil Mehta" },
  { id: "MRP-2026-7003", partNo: "EB-3003", partDescription: "Engine Block Cast Iron V3", category: "Finished Goods", uom: "pc", warehouse: "Pune Plant", abc: "A", strategy: "mrp-net", status: "critical-shortage", action: "expedite", onHand: 48, safetyStock: 60, reorderPoint: 100, maxLevel: 400, avgDailyDemand: 8, daysOfCover: 6, leadTimeDays: 18, eoq: 120, lastPoRef: "PO-2026-3002", lastPoDate: "2026-07-05", lastPoQty: 120, lastPoCost: 640000, unitCost: 8000, openPOQty: 60, openPOEta: "2026-08-05", openWOQty: 48, openWOEta: "2026-07-30", demand30d: 240, supply30d: 48, ytdConsumption: 2880, ytdCost: 23040000, obsoleteRiskScore: 2, supplier: "CastIron Foundry Co", supplierRating: 85, buyer: "Sunita Rao" },
  { id: "MRP-2026-7004", partNo: "CS-4004", partDescription: "Caliper Seal Assembly", category: "Finished Goods", uom: "pc", warehouse: "Chennai Hub", abc: "B", strategy: "eoq", status: "balanced", action: "none", onHand: 992, safetyStock: 400, reorderPoint: 600, maxLevel: 1800, avgDailyDemand: 35, daysOfCover: 28, leadTimeDays: 6, eoq: 1000, lastPoRef: "PO-2026-3003", lastPoDate: "2026-06-25", lastPoQty: 1000, lastPoCost: 198400, unitCost: 198.4, openPOQty: 0, openPOEta: null, openWOQty: 0, openWOEta: null, demand30d: 1050, supply30d: 992, ytdConsumption: 11800, ytdCost: 2341120, obsoleteRiskScore: 12, supplier: "SealMart India", supplierRating: 91, buyer: "Anil Mehta" },
  { id: "MRP-2026-7005", partNo: "SA-5005", partDescription: "Shock Absorber Rear Damping", category: "Finished Goods", uom: "pc", warehouse: "Pune Plant", abc: "A", strategy: "min-max", status: "below-safety", action: "raise-po", onHand: 80, safetyStock: 120, reorderPoint: 200, maxLevel: 700, avgDailyDemand: 25, daysOfCover: 3, leadTimeDays: 10, eoq: 350, lastPoRef: "PO-2026-2980", lastPoDate: "2026-06-28", lastPoQty: 350, lastPoCost: 210000, unitCost: 350, openPOQty: 0, openPOEta: null, openWOQty: 50, openWOEta: "2026-08-02", demand30d: 750, supply30d: 50, ytdConsumption: 8400, ytdCost: 2940000, obsoleteRiskScore: 6, supplier: "DampTech Solutions", supplierRating: 87, buyer: "Sunita Rao" },
  { id: "MRP-2026-7006", partNo: "BT-6006", partDescription: "Li-Ion Battery Pack 48V", category: "Finished Goods", uom: "pc", warehouse: "Bengaluru Plant", abc: "A", strategy: "jit", status: "reorder-placed", action: "expedite", onHand: 18, safetyStock: 15, reorderPoint: 25, maxLevel: 80, avgDailyDemand: 4, daysOfCover: 4, leadTimeDays: 21, eoq: 50, lastPoRef: "PO-2026-3004", lastPoDate: "2026-07-12", lastPoQty: 50, lastPoCost: 425000, unitCost: 17000, openPOQty: 50, openPOEta: "2026-08-02", openWOQty: 12, openWOEta: "2026-08-05", demand30d: 120, supply30d: 12, ytdConsumption: 1400, ytdCost: 23800000, obsoleteRiskScore: 4, supplier: "PowerCell Energy", supplierRating: 95, buyer: "Vikram Singh" },
  { id: "MRP-2026-7007", partNo: "TB-7007", partDescription: "Tire Bead 18\" Heavy Duty", category: "Raw Material", uom: "pc", warehouse: "Chennai Hub", abc: "B", strategy: "min-max", status: "reorder-due", action: "raise-po", onHand: 200, safetyStock: 300, reorderPoint: 400, maxLevel: 1500, avgDailyDemand: 60, daysOfCover: 3, leadTimeDays: 5, eoq: 1200, lastPoRef: "PO-2026-2990", lastPoDate: "2026-06-30", lastPoQty: 1200, lastPoCost: 360000, unitCost: 300, openPOQty: 0, openPOEta: null, openWOQty: 0, openWOEta: "2026-08-04", demand30d: 1800, supply30d: 0, ytdConsumption: 19800, ytdCost: 5940000, obsoleteRiskScore: 7, supplier: "MRF Tyres Direct", supplierRating: 94, buyer: "Anil Mehta" },
  { id: "MRP-2026-7008", partNo: "WH-8008", partDescription: "Wiring Harness Continuity", category: "Finished Goods", uom: "pc", warehouse: "Bengaluru Plant", abc: "B", strategy: "eoq", status: "balanced", action: "monitor", onHand: 480, safetyStock: 250, reorderPoint: 400, maxLevel: 1100, avgDailyDemand: 32, daysOfCover: 15, leadTimeDays: 9, eoq: 800, lastPoRef: "PO-2026-2985", lastPoDate: "2026-06-26", lastPoQty: 800, lastPoCost: 88000, unitCost: 110, openPOQty: 0, openPOEta: null, openWOQty: 480, openWOEta: "2026-07-29", demand30d: 960, supply30d: 480, ytdConsumption: 10800, ytdCost: 1188000, obsoleteRiskScore: 11, supplier: "WirePro Industries", supplierRating: 89, buyer: "Vikram Singh" },
  { id: "MRP-2026-7009", partNo: "EB-9009", partDescription: "Engine Bolt M12 Tensile", category: "Raw Material", uom: "pc", warehouse: "Pune Plant", abc: "C", strategy: "min-max", status: "overstock", action: "reduce", onHand: 8200, safetyStock: 1000, reorderPoint: 2000, maxLevel: 6000, avgDailyDemand: 180, daysOfCover: 45, leadTimeDays: 4, eoq: 5000, lastPoRef: "PO-2026-2950", lastPoDate: "2026-06-15", lastPoQty: 5000, lastPoCost: 124000, unitCost: 24.8, openPOQty: 0, openPOEta: null, openWOQty: 0, openWOEta: null, demand30d: 5400, supply30d: 0, ytdConsumption: 62000, ytdCost: 1537600, obsoleteRiskScore: 22, supplier: "BoltFast Hardware", supplierRating: 86, buyer: "Sunita Rao" },
  { id: "MRP-2026-7010", partNo: "OL-1010", partDescription: "Engine Oil SAE 15W-40", category: "Consumables", uom: "L", warehouse: "Mumbai DC", abc: "B", strategy: "safety-stock", status: "balanced", action: "none", onHand: 2200, safetyStock: 800, reorderPoint: 1500, maxLevel: 4500, avgDailyDemand: 70, daysOfCover: 31, leadTimeDays: 7, eoq: 2000, lastPoRef: "PO-2026-2975", lastPoDate: "2026-06-29", lastPoQty: 2000, lastPoCost: 600000, unitCost: 300, openPOQty: 0, openPOEta: null, openWOQty: 0, openWOEta: null, demand30d: 2100, supply30d: 2000, ytdConsumption: 23500, ytdCost: 7050000, obsoleteRiskScore: 9, supplier: "Castrol India Direct", supplierRating: 96, buyer: "Anil Mehta" },
  { id: "MRP-2026-7011", partNo: "WS-1011", partDescription: "Windshield Optical Grade", category: "Finished Goods", uom: "pc", warehouse: "Delhi NCR Hub", abc: "A", strategy: "min-max", status: "obsolete-risk", action: "scrap", onHand: 180, safetyStock: 60, reorderPoint: 100, maxLevel: 400, avgDailyDemand: 2, daysOfCover: 90, leadTimeDays: 14, eoq: 200, lastPoRef: "PO-2026-2900", lastPoDate: "2026-05-10", lastPoQty: 200, lastPoCost: 240000, unitCost: 1200, openPOQty: 0, openPOEta: null, openWOQty: 0, openWOEta: null, demand30d: 60, supply30d: 0, ytdConsumption: 720, ytdCost: 864000, obsoleteRiskScore: 78, supplier: "GlassWorks India", supplierRating: 82, buyer: "Vikram Singh" },
  { id: "MRP-2026-7012", partNo: "RC-1012", partDescription: "Radiator Cap Pressure 1.1 bar", category: "Finished Goods", uom: "pc", warehouse: "Pune Plant", abc: "C", strategy: "eoq", status: "below-safety", action: "raise-po", onHand: 220, safetyStock: 180, reorderPoint: 300, maxLevel: 800, avgDailyDemand: 18, daysOfCover: 12, leadTimeDays: 6, eoq: 400, lastPoRef: "PO-2026-2970", lastPoDate: "2026-06-27", lastPoQty: 400, lastPoCost: 36000, unitCost: 90, openPOQty: 0, openPOEta: null, openWOQty: 220, openWOEta: "2026-07-30", demand30d: 540, supply30d: 220, ytdConsumption: 6100, ytdCost: 549000, obsoleteRiskScore: 14, supplier: "CapMart Supplies", supplierRating: 84, buyer: "Sunita Rao" },
  { id: "MRP-2026-7013", partNo: "AF-1013", partDescription: "Air Filter Dust Efficiency", category: "Finished Goods", uom: "pc", warehouse: "Chennai Hub", abc: "B", strategy: "min-max", status: "reorder-due", action: "raise-po", onHand: 280, safetyStock: 350, reorderPoint: 500, maxLevel: 1500, avgDailyDemand: 55, daysOfCover: 5, leadTimeDays: 7, eoq: 1000, lastPoRef: "PO-2026-2965", lastPoDate: "2026-06-25", lastPoQty: 1000, lastPoCost: 150000, unitCost: 150, openPOQty: 0, openPOEta: null, openWOQty: 0, openWOEta: "2026-08-08", demand30d: 1650, supply30d: 0, ytdConsumption: 18200, ytdCost: 2730000, obsoleteRiskScore: 6, supplier: "FilterPro India", supplierRating: 90, buyer: "Anil Mehta" },
  { id: "MRP-2026-7014", partNo: "SP-1014", partDescription: "Spark Plug Gap 0.9mm", category: "Finished Goods", uom: "pc", warehouse: "Bengaluru Plant", abc: "C", strategy: "min-max", status: "balanced", action: "none", onHand: 350, safetyStock: 100, reorderPoint: 200, maxLevel: 700, avgDailyDemand: 8, daysOfCover: 43, leadTimeDays: 5, eoq: 300, lastPoRef: "PO-2026-2955", lastPoDate: "2026-06-20", lastPoQty: 300, lastPoCost: 8500, unitCost: 28.3, openPOQty: 0, openPOEta: null, openWOQty: 50, openWOEta: "2026-07-16", demand30d: 240, supply30d: 50, ytdConsumption: 2700, ytdCost: 76410, obsoleteRiskScore: 18, supplier: "NGK Direct Supply", supplierRating: 97, buyer: "Vikram Singh" },
  { id: "MRP-2026-7015", partNo: "CA-1015", partDescription: "Clutch Assembly FAI", category: "Finished Goods", uom: "pc", warehouse: "Pune Plant", abc: "A", strategy: "mrp-net", status: "critical-shortage", action: "expedite", onHand: 6, safetyStock: 8, reorderPoint: 12, maxLevel: 50, avgDailyDemand: 1, daysOfCover: 6, leadTimeDays: 16, eoq: 25, lastPoRef: "PO-2026-3005", lastPoDate: "2026-07-08", lastPoQty: 25, lastPoCost: 48000, unitCost: 4800, openPOQty: 12, openPOEta: "2026-08-04", openWOQty: 6, openWOEta: "2026-07-28", demand30d: 30, supply30d: 6, ytdConsumption: 360, ytdCost: 1728000, obsoleteRiskScore: 3, supplier: "ClutchMaster India", supplierRating: 88, buyer: "Sunita Rao" },
  { id: "MRP-2026-7016", partNo: "HS-1016", partDescription: "Helmet Shell Impact Test", category: "Finished Goods", uom: "pc", warehouse: "Delhi NCR Hub", abc: "B", strategy: "min-max", status: "reorder-placed", action: "monitor", onHand: 240, safetyStock: 200, reorderPoint: 350, maxLevel: 1000, avgDailyDemand: 30, daysOfCover: 8, leadTimeDays: 9, eoq: 800, lastPoRef: "PO-2026-3010", lastPoDate: "2026-07-18", lastPoQty: 800, lastPoCost: 192000, unitCost: 240, openPOQty: 800, openPOEta: "2026-07-30", openWOQty: 0, openWOEta: "2026-08-05", demand30d: 900, supply30d: 800, ytdConsumption: 9800, ytdCost: 2352000, obsoleteRiskScore: 8, supplier: "Steelbird Direct", supplierRating: 93, buyer: "Vikram Singh" },
]

function genDemandEntries(seed: number, partNo: string, avgDaily: number): MRPDemandEntry[] {
  const h = hash(`demand-${seed}-${partNo}`)
  const sources: MRPDemandEntry["source"][] = ["sales-order", "work-order", "forecast", "safety-stock"]
  const refs = ["SO-2026-0123", "WO-2026-5001", "FCST-Q3-A", "WO-2026-5008", "SO-2026-0145", "WO-2026-5013", "FCST-Q3-B", "SO-2026-0156"]
  const warehouses = ["Chennai Hub", "Pune Plant", "Bengaluru Plant", "Mumbai DC", "Delhi NCR Hub"]
  const numEntries = 6 + (h % 4)
  const today = new Date("2026-07-26T00:00:00Z")
  return Array.from({ length: numEntries }, (_, i) => {
    const dh = hash(`demand-${seed}-${partNo}-${i}`)
    const src = sources[dh % sources.length]
    const ref = refs[dh % refs.length]
    const dayOffset = -3 + i + (dh % 5)
    const date = new Date(today.getTime() + dayOffset * 86400000)
    const qty = Math.max(1, Math.floor(avgDaily * (0.5 + (dh % 10) / 10)))
    return {
      date: date.toISOString().slice(0, 10),
      source: src,
      refId: ref,
      qty,
      warehouse: warehouses[dh % warehouses.length],
    }
  }).sort((a, b) => a.date.localeCompare(b.date))
}

function genSupplyEntries(seed: number, partNo: string, openPO: number, openWO: number): MRPSupplyEntry[] {
  const h = hash(`supply-${seed}-${partNo}`)
  const sources: MRPSupplyEntry["source"][] = ["on-hand", "po-inbound", "wo-completion", "transfer-in", "grn"]
  const refs = ["PO-2026-3001", "WO-2026-5001", "TR-2026-0056", "GRN-2026-0890", "PO-2026-3005", "WO-2026-5008"]
  const statuses: MRPSupplyEntry["status"][] = ["scheduled", "in-transit", "received", "pending"]
  const warehouses = ["Chennai Hub", "Pune Plant", "Bengaluru Plant", "Mumbai DC", "Delhi NCR Hub"]
  const today = new Date("2026-07-26T00:00:00Z")
  const numEntries = 4 + (h % 4)
  return Array.from({ length: numEntries }, (_, i) => {
    const sh = hash(`supply-${seed}-${partNo}-${i}`)
    const src = sources[sh % sources.length]
    const ref = refs[sh % refs.length]
    const dayOffset = -2 + i + (sh % 7)
    const date = new Date(today.getTime() + dayOffset * 86400000)
    let qty = 50 + (sh % 400)
    if (src === "po-inbound" && openPO > 0) qty = openPO
    if (src === "wo-completion" && openWO > 0) qty = openWO
    return {
      date: date.toISOString().slice(0, 10),
      source: src,
      refId: ref,
      qty,
      warehouse: warehouses[sh % warehouses.length],
      status: statuses[sh % statuses.length],
    }
  }).sort((a, b) => a.date.localeCompare(b.date))
}

function genLeadTimes(seed: number, totalLead: number): MRPLeadTime[] {
  const h = hash(`lead-${seed}`)
  const stages: Array<{ stage: MRPLeadTime["stage"]; base: number; label: string }> = [
    { stage: "supplier-po", base: 1, label: "PO Processing" },
    { stage: "supplier-processing", base: Math.max(2, Math.floor(totalLead * 0.45)), label: "Supplier Mfg" },
    { stage: "in-transit", base: Math.max(1, Math.floor(totalLead * 0.30)), label: "In-Transit" },
    { stage: "qc-inspection", base: 1, label: "QC Inspection" },
    { stage: "putaway", base: 1, label: "Putaway" },
  ]
  return stages.map((s, i) => {
    const lh = hash(`lead-${seed}-${i}`)
    const variance = (lh % 5) - 2
    const actual = Math.max(0, s.base + variance)
    return {
      stage: s.stage,
      plannedDays: s.base,
      actualDays: actual,
      notes: variance > 1 ? "Delayed — supplier capacity constrained" : variance < -1 ? "Faster than expected — expediting paid off" : "On schedule",
    }
  })
}

function genRecommendations(seed: number, status: MRPStatus, action: MRPAction, unitCost: number, daysOfCover: number, eoq: number, obsoleteRisk: number): MRPRecommendation[] {
  const recs: MRPRecommendation[] = []
  const today = new Date("2026-07-26T00:00:00Z")
  const futureDate = (days: number) => new Date(today.getTime() + days * 86400000).toISOString().slice(0, 10)

  if (action === "raise-po" || status === "reorder-due" || status === "below-safety") {
    recs.push({
      type: "raise-po",
      priority: status === "below-safety" ? "high" : "medium",
      title: "Raise Purchase Order",
      description: `Issue PO for ${eoq} units to replenish stock above reorder point. Current days of cover (${daysOfCover}d) below safety threshold.`,
      suggestedQty: eoq,
      suggestedDate: futureDate(1),
      estimatedCost: eoq * unitCost,
      impact: "Restores stock to safe levels within lead time window",
    })
  }
  if (action === "expedite" || status === "critical-shortage") {
    recs.push({
      type: "expedite",
      priority: "critical",
      title: "Expedite Open PO",
      description: `Contact supplier to expedite delivery. Critical shortage detected — current stock covers only ${daysOfCover}d of demand.`,
      suggestedQty: 0,
      suggestedDate: futureDate(3),
      estimatedCost: eoq * unitCost * 0.05,
      impact: "Prevents production stoppage and customer SLA breach",
    })
  }
  if (action === "reduce" || status === "overstock") {
    recs.push({
      type: "reduce",
      priority: "medium",
      title: "Reduce Future Orders",
      description: `Overstock detected. Cancel or defer open POs and reduce safety stock parameter. Days of cover (${daysOfCover}d) significantly exceeds target.`,
      suggestedQty: -Math.floor(eoq * 0.5),
      suggestedDate: futureDate(7),
      estimatedCost: 0,
      impact: "Frees up working capital and warehouse space",
    })
  }
  if (action === "scrap" || obsoleteRisk > 50) {
    recs.push({
      type: "scrap",
      priority: "high",
      title: "Initiate Obsolescence Review",
      description: `Obsolete risk score ${obsoleteRisk}/100. Initiate scrap workflow for slow-moving inventory. Coordinate with finance for write-off.`,
      suggestedQty: 0,
      suggestedDate: futureDate(14),
      estimatedCost: 0,
      impact: "Removes carrying cost and frees warehouse slot for fast-movers",
    })
  }
  if (action === "monitor" || status === "reorder-placed") {
    recs.push({
      type: "monitor",
      priority: "low",
      title: "Monitor Supply Arrival",
      description: `Open PO in transit. Monitor supplier confirmation and arrival. No immediate action required.`,
      suggestedQty: 0,
      suggestedDate: futureDate(7),
      estimatedCost: 0,
      impact: "Ensures on-time delivery and avoids surprise shortages",
    })
  }
  if (action === "transfer") {
    recs.push({
      type: "transfer",
      priority: "medium",
      title: "Inter-Warehouse Transfer",
      description: `Transfer stock from sister warehouse with surplus. Faster than raising new PO.`,
      suggestedQty: Math.floor(eoq * 0.5),
      suggestedDate: futureDate(2),
      estimatedCost: eoq * unitCost * 0.02,
      impact: "Balances inventory across network without procurement lead time",
    })
  }
  // Always add a "monitor" recommendation as baseline
  if (recs.length === 0) {
    recs.push({
      type: "monitor",
      priority: "low",
      title: "Continue Monitoring",
      description: `Stock levels healthy. Continue daily demand monitoring and weekly MRP net-change run.`,
      suggestedQty: 0,
      suggestedDate: futureDate(7),
      estimatedCost: 0,
      impact: "Maintains current service level",
    })
  }
  return recs
}

// Build the MRP list
const REPLENISHMENT_ITEMS: ReplenishmentItem[] = MRP_SEEDS.map((s) => {
  const demands = genDemandEntries(hash(s.id), s.partNo, s.avgDailyDemand)
  const supplies = genSupplyEntries(hash(s.id), s.partNo, s.openPOQty, s.openWOQty)
  const leadTimes = genLeadTimes(hash(s.id), s.leadTimeDays)
  const recommendations = genRecommendations(hash(s.id), s.status, s.action, s.unitCost, s.daysOfCover, s.eoq, s.obsoleteRiskScore)
  const totalDemand30 = demands.reduce((sum, d) => sum + d.qty, 0)
  const totalSupply30 = supplies.reduce((sum, sp) => sum + sp.qty, 0)
  const projectedClosing = s.onHand + totalSupply30 - totalDemand30
  const projectedDaysOfCover = totalDemand30 > 0 ? Math.floor((projectedClosing / totalDemand30) * 30) : 999
  return {
    ...s,
    demands,
    supplies,
    leadTimes,
    recommendations,
    plan: {
      horizon: "30 days (2026-07-26 to 2026-08-25)",
      openingQty: s.onHand,
      totalDemand: totalDemand30,
      totalSupply: totalSupply30,
      projectedClosing: Math.max(0, projectedClosing),
      projectedDaysOfCover,
    },
    notes:
      s.status === "critical-shortage"
        ? "CRITICAL — Production at risk. Expedite supplier and consider alternative sourcing."
        : s.status === "below-safety"
        ? "Stock below safety threshold. Raise PO immediately to avoid stockout."
        : s.status === "overstock"
        ? "Excess inventory detected. Reduce future orders and review safety stock parameters."
        : s.status === "obsolete-risk"
        ? "Slow-moving inventory flagged. Initiate obsolescence review with finance."
        : s.status === "reorder-due"
        ? "Reorder point reached. Raise PO within 24 hours to maintain service level."
        : s.status === "reorder-placed"
        ? "PO raised, awaiting delivery. Monitor supplier confirmation."
        : "Stock levels healthy. Continue regular MRP monitoring.",
  }
})

// ──────────────────────────────────────────────────────────
// STATUS TABS
// ──────────────────────────────────────────────────────────

const STATUS_TABS: Array<{ key: MRPStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "balanced", label: "Balanced" },
  { key: "below-safety", label: "Below Safety" },
  { key: "reorder-due", label: "Reorder Due" },
  { key: "reorder-placed", label: "Reorder Placed" },
  { key: "critical-shortage", label: "Critical" },
  { key: "overstock", label: "Overstock" },
  { key: "obsolete-risk", label: "Obsolete Risk" },
]

// Shared formatters (so drawer + main view both can use)
const fmtINR = (n: number) => "₹" + n.toLocaleString("en-IN")
const fmtNum = (n: number) => n.toLocaleString("en-IN")

// ──────────────────────────────────────────────────────────
// MAIN VIEW
// ──────────────────────────────────────────────────────────

export function InventoryReplenishmentView() {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<MRPStatus | "all">("all")
  const [abcFilter, setAbcFilter] = useState<MRPABC | "all">("all")
  const [strategyFilter, setStrategyFilter] = useState<MRPStrategy | "all">("all")
  const [selectedItem, setSelectedItem] = useState<ReplenishmentItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredItems = useMemo(() => {
    return REPLENISHMENT_ITEMS.filter((it) => {
      if (statusFilter !== "all" && it.status !== statusFilter) return false
      if (abcFilter !== "all" && it.abc !== abcFilter) return false
      if (strategyFilter !== "all" && it.strategy !== strategyFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          it.id.toLowerCase().includes(q) ||
          it.partNo.toLowerCase().includes(q) ||
          it.partDescription.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q) ||
          it.warehouse.toLowerCase().includes(q) ||
          it.supplier.toLowerCase().includes(q) ||
          it.buyer.toLowerCase().includes(q) ||
          it.lastPoRef.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, statusFilter, abcFilter, strategyFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: REPLENISHMENT_ITEMS.length }
    STATUS_TABS.forEach((t) => {
      if (t.key !== "all") counts[t.key] = REPLENISHMENT_ITEMS.filter((it) => it.status === t.key).length
    })
    return counts
  }, [])

  // KPI calculations
  const kpis = useMemo(() => {
    const total = REPLENISHMENT_ITEMS.length
    const criticalShortage = REPLENISHMENT_ITEMS.filter((it) => it.status === "critical-shortage").length
    const belowSafety = REPLENISHMENT_ITEMS.filter((it) => it.status === "below-safety" || it.status === "critical-shortage").length
    const reorderDue = REPLENISHMENT_ITEMS.filter((it) => it.status === "reorder-due" || it.status === "below-safety" || it.status === "critical-shortage").length
    const overstock = REPLENISHMENT_ITEMS.filter((it) => it.status === "overstock").length
    const obsoleteRisk = REPLENISHMENT_ITEMS.filter((it) => it.obsoleteRiskScore > 50).length
    const totalInventoryValue = REPLENISHMENT_ITEMS.reduce((s, it) => s + it.onHand * it.unitCost, 0)
    const totalOpenPOValue = REPLENISHMENT_ITEMS.reduce((s, it) => s + it.openPOQty * it.unitCost, 0)
    const avgDaysOfCover = total > 0 ? REPLENISHMENT_ITEMS.reduce((s, it) => s + it.daysOfCover, 0) / total : 0
    const avgSupplierRating = total > 0 ? REPLENISHMENT_ITEMS.reduce((s, it) => s + it.supplierRating, 0) / total : 0
    const totalYtdCost = REPLENISHMENT_ITEMS.reduce((s, it) => s + it.ytdCost, 0)
    const itemsNeedingAction = REPLENISHMENT_ITEMS.filter((it) => it.action !== "none" && it.action !== "monitor").length
    return {
      total,
      criticalShortage,
      belowSafety,
      reorderDue,
      overstock,
      obsoleteRisk,
      totalInventoryValue,
      totalOpenPOValue,
      avgDaysOfCover,
      avgSupplierRating,
      totalYtdCost,
      itemsNeedingAction,
    }
  }, [])

  // 6-month demand vs supply trend
  const trendData = useMemo(() => {
    return [
      { month: "Feb", demand: 4200, supply: 4350, stockout: 1 },
      { month: "Mar", demand: 4850, supply: 4700, stockout: 2 },
      { month: "Apr", demand: 5100, supply: 5200, stockout: 0 },
      { month: "May", demand: 5400, supply: 5300, stockout: 1 },
      { month: "Jun", demand: 5650, supply: 5800, stockout: 0 },
      { month: "Jul", demand: 5980, supply: 5750, stockout: 3 },
    ]
  }, [])

  // Status distribution
  const statusDist = useMemo(() => {
    return STATUS_TABS.filter((t) => t.key !== "all").map((t) => ({
      name: t.label,
      value: REPLENISHMENT_ITEMS.filter((it) => it.status === t.key).length,
      color: STATUS_META[t.key as MRPStatus].pieColor,
    }))
  }, [])

  // ABC distribution
  const abcDist = useMemo(() => {
    return (["A", "B", "C"] as MRPABC[]).map((k) => ({
      name: ABC_META[k].label,
      value: REPLENISHMENT_ITEMS.filter((it) => it.abc === k).length,
      color: ABC_META[k].pieColor,
    }))
  }, [])

  // Top 8 parts by inventory value
  const topValueParts = useMemo(() => {
    return [...REPLENISHMENT_ITEMS]
      .map((it) => ({ name: it.partNo, value: it.onHand * it.unitCost, daysOfCover: it.daysOfCover }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [])

  // Days of cover distribution
  const coverBuckets = useMemo(() => {
    const buckets = [
      { range: "0-5d", count: 0, color: "#ef4444" },
      { range: "6-10d", count: 0, color: "#f59e0b" },
      { range: "11-20d", count: 0, color: "#3b82f6" },
      { range: "21-30d", count: 0, color: "#06b6d4" },
      { range: "31-45d", count: 0, color: "#10b981" },
      { range: "46d+", count: 0, color: "#8b5cf6" },
    ]
    REPLENISHMENT_ITEMS.forEach((it) => {
      const d = it.daysOfCover
      if (d <= 5) buckets[0].count++
      else if (d <= 10) buckets[1].count++
      else if (d <= 20) buckets[2].count++
      else if (d <= 30) buckets[3].count++
      else if (d <= 45) buckets[4].count++
      else buckets[5].count++
    })
    return buckets
  }, [])

  function handleExport() {
    const rows = filteredItems.map((it) => ({
      "MRP ID": it.id,
      "Part No": it.partNo,
      "Description": it.partDescription,
      "Category": it.category,
      "UOM": it.uom,
      "Warehouse": it.warehouse,
      "ABC": it.abc,
      "Strategy": STRATEGY_META[it.strategy].label,
      "Status": STATUS_META[it.status].label,
      "Action": ACTION_META[it.action].label,
      "On Hand": it.onHand,
      "Safety Stock": it.safetyStock,
      "Reorder Point": it.reorderPoint,
      "Max Level": it.maxLevel,
      "Avg Daily Demand": it.avgDailyDemand,
      "Days Of Cover": it.daysOfCover,
      "Lead Time (days)": it.leadTimeDays,
      "EOQ": it.eoq,
      "Last PO Ref": it.lastPoRef,
      "Last PO Date": it.lastPoDate,
      "Last PO Qty": it.lastPoQty,
      "Last PO Cost": it.lastPoCost,
      "Unit Cost": it.unitCost,
      "Open PO Qty": it.openPOQty,
      "Open PO ETA": it.openPOEta || "",
      "Open WO Qty": it.openWOQty,
      "Open WO ETA": it.openWOEta || "",
      "Demand 30d": it.demand30d,
      "Supply 30d": it.supply30d,
      "YTD Consumption": it.ytdConsumption,
      "YTD Cost": it.ytdCost,
      "Obsolete Risk Score": it.obsoleteRiskScore,
      "Supplier": it.supplier,
      "Supplier Rating": it.supplierRating,
      "Buyer": it.buyer,
      "Projected Closing": it.plan.projectedClosing,
      "Projected Days Of Cover": it.plan.projectedDaysOfCover,
    }))
    exportToCSV(rows, `mrp-replenishment-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Export complete", `${filteredItems.length} MRP records exported to CSV`)
  }

  function handleRefresh() {
    toast.info("MRP Net Change Run", "Recalculated demand, supply, and recommendations for 16 parts")
  }

  function handleNewPlan() {
    toast.success("New Plan Started", "MRP planning session initiated — select parts and horizon")
  }

  function openDrawer(it: ReplenishmentItem) {
    setSelectedItem(it)
    setDrawerOpen(true)
  }

  return (
    <div className="mrp-view space-y-6">
      <PageHeader
        title="Inventory Replenishment (MRP)"
        description="Material Requirements Planning — auto-calculated reorder recommendations, demand/supply netting, and lead time analysis across the parts network"
      />

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="default" size="sm" onClick={handleNewPlan}>
          <Plus className="h-4 w-4 mr-1.5" /> New MRP Run
        </Button>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-1.5" /> Net Change
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
        <div className="ml-auto text-xs text-muted-foreground">
          Last MRP run: 2026-07-26 06:00 IST · Next scheduled: 2026-07-27 06:00 IST
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          icon={Boxes}
          label="Total Parts"
          value={fmtNum(kpis.total)}
          sub={`${kpis.itemsNeedingAction} need action`}
          gradient="from-blue-500/15 to-blue-500/0"
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600 dark:text-blue-400"
          className="mrp-kpi-enter"
          style={{ animationDelay: "0ms" }}
        />
        <KpiCard
          icon={XCircle}
          label="Critical Shortage"
          value={fmtNum(kpis.criticalShortage)}
          sub={`${kpis.belowSafety} below safety`}
          gradient="from-rose-500/15 to-rose-500/0"
          iconBg="bg-rose-500/10"
          iconColor="text-rose-600 dark:text-rose-400"
          alert={kpis.criticalShortage > 0}
          className="mrp-kpi-enter"
          style={{ animationDelay: "60ms" }}
        />
        <KpiCard
          icon={ShoppingCart}
          label="Reorder Due"
          value={fmtNum(kpis.reorderDue)}
          sub="parts need PO"
          gradient="from-blue-500/15 to-blue-500/0"
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600 dark:text-blue-400"
          className="mrp-kpi-enter"
          style={{ animationDelay: "120ms" }}
        />
        <KpiCard
          icon={ArrowUp}
          label="Overstock"
          value={fmtNum(kpis.overstock)}
          sub={`${kpis.obsoleteRisk} obsolete risk`}
          gradient="from-violet-500/15 to-violet-500/0"
          iconBg="bg-violet-500/10"
          iconColor="text-violet-600 dark:text-violet-400"
          className="mrp-kpi-enter"
          style={{ animationDelay: "180ms" }}
        />
        <KpiCard
          icon={Gauge}
          label="Avg Days of Cover"
          value={`${kpis.avgDaysOfCover.toFixed(1)}d`}
          sub="across all parts"
          gradient="from-emerald-500/15 to-emerald-500/0"
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
          className="mrp-kpi-enter"
          style={{ animationDelay: "240ms" }}
        />
        <KpiCard
          icon={IndianRupee}
          label="Inventory Value"
          value={fmtINR(kpis.totalInventoryValue)}
          sub={`+${fmtINR(kpis.totalOpenPOValue)} on PO`}
          gradient="from-amber-500/15 to-amber-500/0"
          iconBg="bg-amber-500/10"
          iconColor="text-amber-600 dark:text-amber-400"
          className="mrp-kpi-enter"
          style={{ animationDelay: "300ms" }}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="hover-lift-sm lg:col-span-2 mrp-chart-enter">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              6-Month Demand vs Supply Trend
            </CardTitle>
            <CardDescription>Monthly aggregate demand vs supply across all parts · stockout events overlaid</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrpDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mrpSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} fill="url(#mrpDemand)" name="Demand" />
                <Area type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={2} fill="url(#mrpSupply)" name="Supply" />
                <Line type="monotone" dataKey="stockout" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: "#ef4444" }} name="Stockouts" yAxisId={0} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm mrp-chart-enter">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-violet-500" />
              Status Distribution
            </CardTitle>
            <CardDescription>Replenishment status across all parts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusDist}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {statusDist.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="hover-lift-sm mrp-chart-enter">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4 text-amber-500" />
              ABC Classification
            </CardTitle>
            <CardDescription>Pareto value distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={abcDist} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {abcDist.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm mrp-chart-enter">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IndianRupee className="h-4 w-4 text-emerald-500" />
              Top 8 Parts by Inventory Value
            </CardTitle>
            <CardDescription>Concentration of capital in stock</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topValueParts} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={60} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {topValueParts.map((entry, idx) => {
                    const color = entry.daysOfCover <= 5 ? "#ef4444" : entry.daysOfCover <= 10 ? "#f59e0b" : "#3b82f6"
                    return <Cell key={idx} fill={color} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm mrp-chart-enter">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-cyan-500" />
              Days of Cover Distribution
            </CardTitle>
            <CardDescription>Stockout risk by cover bucket</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={coverBuckets} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {coverBuckets.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mrp-tab-row">
        {STATUS_TABS.map((t) => {
          const isActive = statusFilter === t.key
          const count = statusCounts[t.key] || 0
          const meta = t.key !== "all" ? STATUS_META[t.key as MRPStatus] : null
          return (
            <button
              key={t.key}
              onClick={() => setStatusFilter(t.key)}
              className={cn(
                "mrp-tab-btn inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-border bg-background text-muted-foreground hover:bg-muted/50 hover:border-muted"
              )}
            >
              {meta && <meta.icon className="h-3 w-3" />}
              {t.label}
              <span className={cn(
                "mrp-badge-pop ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                isActive ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by part no, description, supplier, PO ref…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 mrp-search-focus"
          />
        </div>
        <Select value={abcFilter} onValueChange={(v) => setAbcFilter(v as MRPABC | "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="ABC Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ABC Classes</SelectItem>
            <SelectItem value="A">A (High Value)</SelectItem>
            <SelectItem value="B">B (Medium Value)</SelectItem>
            <SelectItem value="C">C (Low Value)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={strategyFilter} onValueChange={(v) => setStrategyFilter(v as MRPStrategy | "all")}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Strategy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Strategies</SelectItem>
            <SelectItem value="min-max">Min-Max</SelectItem>
            <SelectItem value="eoq">EOQ</SelectItem>
            <SelectItem value="jit">JIT</SelectItem>
            <SelectItem value="safety-stock">Safety Stock</SelectItem>
            <SelectItem value="mrp-net">MRP Net Change</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-xs text-muted-foreground ml-auto">
          Showing <span className="font-semibold text-foreground">{filteredItems.length}</span> of {REPLENISHMENT_ITEMS.length} parts
        </div>
      </div>

      {/* Master Table */}
      <Card className="hover-lift-sm card-crud-lift mrp-table-card">
        <CardContent className="inner-glow glass-subtle p-0">
          <div className="overflow-x-auto">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[140px]">Part / Description</TableHead>
                  <TableHead className="w-[80px]">ABC</TableHead>
                  <TableHead className="w-[110px]">Strategy</TableHead>
                  <TableHead className="w-[130px]">Status</TableHead>
                  <TableHead className="w-[110px]">Action</TableHead>
                  <TableHead className="text-right">On Hand</TableHead>
                  <TableHead className="text-right">Safety</TableHead>
                  <TableHead className="text-right">Reorder Pt</TableHead>
                  <TableHead className="text-right">Days Cover</TableHead>
                  <TableHead className="text-right">Lead (d)</TableHead>
                  <TableHead className="text-right">Open PO</TableHead>
                  <TableHead className="text-right">Open WO</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Inv Value</TableHead>
                  <TableHead className="w-[140px]">Warehouse</TableHead>
                  <TableHead className="w-[140px]">Supplier</TableHead>
                  <TableHead className="w-[60px] text-right">→</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((it, idx) => {
                  const statusMeta = STATUS_META[it.status]
                  const actionMeta = ACTION_META[it.action]
                  const abcMeta = ABC_META[it.abc]
                  const stratMeta = STRATEGY_META[it.strategy]
                  const invValue = it.onHand * it.unitCost
                  const isCritical = it.status === "critical-shortage"
                  const isBelow = it.status === "below-safety"
                  const isOver = it.status === "overstock"
                  const isObsolete = it.status === "obsolete-risk"
                  return (
                    <TableRow
                      key={it.id}
                      onClick={() => openDrawer(it)}
                      className={cn(
                        "cursor-pointer mrp-row-in transition-colors",
                        isCritical && "mrp-row-critical",
                        isBelow && "mrp-row-warn",
                        isOver && "mrp-row-overstock",
                        isObsolete && "mrp-row-obsolete",
                        !isCritical && !isBelow && !isOver && !isObsolete && "hover:bg-muted/40"
                      )}
                      style={{ animationDelay: `${Math.min(idx * 25, 400)}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-blue-500/20">
                            <AvatarFallback className="rounded-md bg-transparent text-[10px] font-bold text-blue-700 dark:text-blue-300">
                              {it.partNo.split("-")[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs truncate">{it.partNo}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">{it.partDescription}</div>
                            <div className="text-[10px] text-muted-foreground/70 mt-0.5">{it.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center justify-center h-6 w-6 rounded-md text-[10px] font-bold", abcMeta.bg, abcMeta.color)}>
                          {it.abc}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium", stratMeta.bg, stratMeta.color)}>
                          <stratMeta.icon className="h-3 w-3" />
                          {stratMeta.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium", statusMeta.bg, statusMeta.color, statusMeta.border)}>
                          <statusMeta.icon className="h-3 w-3" />
                          {statusMeta.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium", actionMeta.bg, actionMeta.color)}>
                          <actionMeta.icon className="h-3 w-3" />
                          {actionMeta.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold tabular-nums">{fmtNum(it.onHand)} <span className="text-[10px] text-muted-foreground">{it.uom}</span></TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">{fmtNum(it.safetyStock)}</TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">{fmtNum(it.reorderPoint)}</TableCell>
                      <TableCell className={cn(
                        "text-right font-mono text-xs font-bold tabular-nums",
                        it.daysOfCover <= 5 ? "text-rose-600 dark:text-rose-400" : it.daysOfCover <= 10 ? "text-amber-600 dark:text-amber-400" : it.daysOfCover > 45 ? "text-violet-600 dark:text-violet-400" : "text-emerald-600 dark:text-emerald-400"
                      )}>
                        {it.daysOfCover}d
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">{it.leadTimeDays}</TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {it.openPOQty > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{fmtNum(it.openPOQty)}</span>
                            <span className="text-[9px] text-muted-foreground">{it.openPOEta}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {it.openWOQty > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="font-semibold text-violet-600 dark:text-violet-400">{fmtNum(it.openWOQty)}</span>
                            <span className="text-[9px] text-muted-foreground">{it.openWOEta}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className="numeric-cell text-right font-mono text-xs tabular-nums">{fmtINR(it.unitCost)}</TableCell>
                      <TableCell className="numeric-cell text-right font-mono text-xs font-semibold tabular-nums">{fmtINR(invValue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-[11px]">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[120px]">{it.warehouse}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-[11px]">
                          <Factory className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[120px]" title={it.supplier}>{it.supplier.split(" ")[0]}</span>
                          <span className="ml-1 inline-flex items-center justify-center h-4 min-w-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold px-1">
                            {it.supplierRating}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Drawer */}
      <ReplenishmentDetailDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// KPI Card subcomponent
// ──────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
  iconBg,
  iconColor,
  alert,
  className,
  style,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
  gradient: string
  iconBg: string
  iconColor: string
  alert?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Card className={cn("relative overflow-hidden", className)} style={style}>
      <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", gradient)} />
      {alert && (
        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
      )}
      <CardContent className="inner-glow glass-subtle relative p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBg)}>
            <Icon className={cn("h-4 w-4", iconColor)} />
          </div>
        </div>
        <div className="text-xl font-bold tracking-tight tabular-nums">{value}</div>
        <div className="text-[11px] font-medium text-muted-foreground mt-0.5">{label}</div>
        {sub && <div className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</div>}
      </CardContent>
    </Card>
  )
}

// ──────────────────────────────────────────────────────────
// DETAIL DRAWER
// ──────────────────────────────────────────────────────────

type DrawerTab = "overview" | "demand" | "supply" | "lead-times" | "plan" | "recommendations"

function ReplenishmentDetailDrawer({
  item,
  open,
  onOpenChange,
}: {
  item: ReplenishmentItem | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [tab, setTab] = useState<DrawerTab>("overview")
  const toast = useToast()

  React.useEffect(() => {
    if (open) setTab("overview")
  }, [open, item])

  if (!item) return null

  const statusMeta = STATUS_META[item.status]
  const actionMeta = ACTION_META[item.action]
  const abcMeta = ABC_META[item.abc]
  const stratMeta = STRATEGY_META[item.strategy]
  const invValue = item.onHand * item.unitCost
  const projectedShort = item.plan.projectedClosing < item.safetyStock
  const totalLeadPlanned = item.leadTimes.reduce((s, lt) => s + lt.plannedDays, 0)
  const totalLeadActual = item.leadTimes.reduce((s, lt) => s + lt.actualDays, 0)
  const leadVariance = totalLeadActual - totalLeadPlanned

  const tabs: Array<{ key: DrawerTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: "overview", label: "Overview", icon: Activity },
    { key: "demand", label: "Demand", icon: TrendingDown },
    { key: "supply", label: "Supply", icon: TrendingUp },
    { key: "lead-times", label: "Lead Times", icon: Clock },
    { key: "plan", label: "MRP Plan", icon: ListChecks },
    { key: "recommendations", label: "Recommendations", icon: Sparkles },
  ]

  function handleExecute(rec: MRPRecommendation) {
    toast.success("Action Executed", `${rec.title} — workflow initiated`)
  }

  function handleExport() {
    if (!item) return
    const rows = [{
      "MRP ID": item.id,
      "Part No": item.partNo,
      "Description": item.partDescription,
      "Status": statusMeta.label,
      "Action": actionMeta.label,
      "On Hand": item.onHand,
      "Days Of Cover": item.daysOfCover,
      "Projected Closing": item.plan.projectedClosing,
      "Recommendations": item.recommendations.length,
    }]
    exportToCSV(rows, `${item.id}-detail-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Exported", `${item.id} detail exported`)
  }

  // Status-aware footer actions
  const footerActions: Array<{ label: string; variant: "default" | "outline" | "secondary" | "destructive"; onClick: () => void }> = [
    { label: "Export", variant: "outline", onClick: handleExport },
  ]
  if (item.action === "raise-po" || item.status === "reorder-due" || item.status === "below-safety") {
    footerActions.push({ label: "Raise PO", variant: "default", onClick: () => { if (!item) return; toast.success("PO Drafted", `PO for ${item.eoq} units of ${item.partNo} created`) } })
  }
  if (item.action === "expedite" || item.status === "critical-shortage") {
    footerActions.push({ label: "Expedite", variant: "destructive", onClick: () => { if (!item) return; toast.warning("Expedite Requested", `Supplier ${item.supplier} notified — priority escalation`) } })
  }
  if (item.action === "transfer") {
    footerActions.push({ label: "Transfer", variant: "default", onClick: () => { if (!item) return; toast.info("Transfer Initiated", `Inter-warehouse transfer request created`) } })
  }
  if (item.action === "reduce" || item.status === "overstock") {
    footerActions.push({ label: "Reduce Orders", variant: "secondary", onClick: () => { if (!item) return; toast.info("Reduction Applied", `Open POs reduced — working capital freed`) } })
  }
  if (item.action === "scrap" || item.obsoleteRiskScore > 50) {
    footerActions.push({ label: "Initiate Scrap", variant: "destructive", onClick: () => { if (!item) return; toast.warning("Scrap Workflow", `Obsolescence review case opened with finance`) } })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="mrp-drawer-sheen w-full sm:max-w-[920px] overflow-y-auto p-0">
        {/* Header */}
        <SheetHeader className="mrp-drawer-header px-6 pt-6 pb-4 border-b bg-gradient-to-br from-blue-50/60 via-violet-50/40 to-cyan-50/60 dark:from-blue-950/30 dark:via-violet-950/20 dark:to-cyan-950/30 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30">
              <AvatarFallback className="rounded-xl bg-transparent text-sm font-bold text-blue-700 dark:text-blue-300">
                {item.partNo.split("-")[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-bold leading-tight">
                {item.partDescription}
              </SheetTitle>
              <SheetDescription className="text-xs mt-0.5">
                {item.id} · {item.partNo} · {item.category} · {item.uom}
              </SheetDescription>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium", statusMeta.bg, statusMeta.color, statusMeta.border)}>
                  <statusMeta.icon className="h-3 w-3" /> {statusMeta.label}
                </span>
                <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium", abcMeta.bg, abcMeta.color, "border-transparent")}>
                  ABC {item.abc}
                </span>
                <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium", stratMeta.bg, stratMeta.color, "border-transparent")}>
                  <stratMeta.icon className="h-3 w-3" /> {stratMeta.label}
                </span>
                <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium", actionMeta.bg, actionMeta.color, "border-transparent")}>
                  <actionMeta.icon className="h-3 w-3" /> {actionMeta.label}
                </span>
              </div>
            </div>
          </div>

          {/* Hero stat grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <HeroStat
              label="On Hand"
              value={fmtNum(item.onHand)}
              sub={`${item.uom} in stock`}
              tone={item.onHand < item.safetyStock ? "danger" : "default"}
              className="mrp-stat-enter"
              style={{ animationDelay: "0ms" }}
            />
            <HeroStat
              label="Days of Cover"
              value={`${item.daysOfCover}d`}
              sub={`Lead time ${item.leadTimeDays}d`}
              tone={item.daysOfCover <= 5 ? "danger" : item.daysOfCover <= 10 ? "warn" : "default"}
              className="mrp-stat-enter"
              style={{ animationDelay: "60ms" }}
            />
            <HeroStat
              label="Inventory Value"
              value={fmtINR(invValue)}
              sub={`${fmtINR(item.unitCost)}/unit`}
              tone="default"
              className="mrp-stat-enter"
              style={{ animationDelay: "120ms" }}
            />
            <HeroStat
              label="Projected Closing"
              value={fmtNum(item.plan.projectedClosing)}
              sub={`${item.plan.projectedDaysOfCover}d cover`}
              tone={projectedShort ? "danger" : "default"}
              className="mrp-stat-enter"
              style={{ animationDelay: "180ms" }}
            />
          </div>
        </SheetHeader>

        {/* Tabs */}
        <div className="flex border-b bg-background/60 sticky top-0 z-10 backdrop-blur">
          {tabs.map((t) => {
            const isActive = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "mrp-tab-btn flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all",
                  isActive
                    ? "border-blue-500 text-blue-700 dark:text-blue-300 bg-blue-50/40 dark:bg-blue-950/30"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Body */}
        <div className="mrp-body-enter p-6 space-y-4">
          {tab === "overview" && (
            <>
              {/* Stock Parameters */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Boxes className="h-4 w-4 text-blue-500" /> Stock Parameters
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <InfoCard label="On Hand" value={fmtNum(item.onHand)} sub={item.uom} tone={item.onHand < item.safetyStock ? "danger" : "default"} />
                  <InfoCard label="Safety Stock" value={fmtNum(item.safetyStock)} sub="minimum buffer" />
                  <InfoCard label="Reorder Point" value={fmtNum(item.reorderPoint)} sub="trigger threshold" />
                  <InfoCard label="Max Level" value={fmtNum(item.maxLevel)} sub="capacity ceiling" />
                </div>
              </div>

              {/* Stock level visual */}
              <Card>
                <CardContent className="inner-glow glass-subtle p-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Stock Level Position</div>
                  <div className="relative h-8 rounded-md bg-muted overflow-hidden">
                    {/* safety zone */}
                    <div className="absolute inset-y-0 left-0 bg-amber-200/60 dark:bg-amber-900/30" style={{ width: `${Math.min(100, (item.safetyStock / item.maxLevel) * 100)}%` }} />
                    {/* reorder point marker */}
                    <div className="absolute inset-y-0 w-0.5 bg-amber-500" style={{ left: `${Math.min(100, (item.reorderPoint / item.maxLevel) * 100)}%` }} />
                    {/* on-hand bar */}
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 transition-all",
                        item.onHand < item.safetyStock ? "bg-rose-500/80" : item.onHand > item.maxLevel * 0.85 ? "bg-violet-500/80" : "bg-emerald-500/80"
                      )}
                      style={{ width: `${Math.min(100, (item.onHand / item.maxLevel) * 100)}%` }}
                    />
                    {/* max marker */}
                    <div className="absolute inset-y-0 w-0.5 bg-violet-500 right-0" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>0</span>
                    <span className="text-amber-700 dark:text-amber-400">Safety: {fmtNum(item.safetyStock)}</span>
                    <span className="text-amber-700 dark:text-amber-400">Reorder: {fmtNum(item.reorderPoint)}</span>
                    <span className="text-violet-700 dark:text-violet-400">Max: {fmtNum(item.maxLevel)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Demand & Supply summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card>
                  <CardContent className="inner-glow glass-subtle p-4">
                    <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2">
                      <TrendingDown className="h-3.5 w-3.5 text-rose-500" /> 30-Day Demand
                    </h4>
                    <div className="text-2xl font-bold tabular-nums">{fmtNum(item.demand30d)} <span className="text-xs text-muted-foreground">{item.uom}</span></div>
                    <div className="text-[11px] text-muted-foreground mt-1">Avg {item.avgDailyDemand}/day · YTD {fmtNum(item.ytdConsumption)}</div>
                    <div className="text-[11px] text-muted-foreground">YTD cost: {fmtINR(item.ytdCost)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="inner-glow glass-subtle p-4">
                    <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> 30-Day Supply
                    </h4>
                    <div className="text-2xl font-bold tabular-nums">{fmtNum(item.supply30d)} <span className="text-xs text-muted-foreground">{item.uom}</span></div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      Open PO: {fmtNum(item.openPOQty)} {item.openPOEta ? `· ETA ${item.openPOEta}` : ""}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Open WO: {fmtNum(item.openWOQty)} {item.openWOEta ? `· ETA ${item.openWOEta}` : ""}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Traceability */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Crosshair className="h-4 w-4 text-violet-500" /> Traceability
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <TraceCard icon={ShoppingCart} label="Last PO" value={item.lastPoRef} sub={`${item.lastPoDate} · ${fmtNum(item.lastPoQty)} units · ${fmtINR(item.lastPoCost)}`} />
                  <TraceCard icon={Factory} label="Supplier" value={item.supplier.split(" ")[0]} sub={`Rating ${item.supplierRating}/100 · Lead ${item.leadTimeDays}d`} />
                  <TraceCard icon={Building2} label="Warehouse" value={item.warehouse} sub={`Buyer: ${item.buyer}`} />
                </div>
              </div>

              {/* Notes */}
              <Card className="hover-lift-sm bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40">
                <CardContent className="inner-glow glass-subtle p-3">
                  <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> MRP Notes
                  </div>
                  <div className="text-xs text-amber-900 dark:text-amber-200">{item.notes}</div>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "demand" && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4 text-rose-500" /> Demand Entries — {item.demands.length} records
                </h3>
                <span className="text-xs text-muted-foreground">Total: {fmtNum(item.demands.reduce((s, d) => s + d.qty, 0))} {item.uom}</span>
              </div>
              <div className="rounded-md border overflow-hidden">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Source</TableHead>
                      <TableHead className="text-xs">Reference</TableHead>
                      <TableHead className="text-xs">Warehouse</TableHead>
                      <TableHead className="text-right text-xs">Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.demands.map((d, i) => {
                      const srcColor =
                        d.source === "sales-order" ? "text-blue-700 bg-blue-50 dark:bg-blue-950/40" :
                        d.source === "work-order" ? "text-violet-700 bg-violet-50 dark:bg-violet-950/40" :
                        d.source === "forecast" ? "text-amber-700 bg-amber-50 dark:bg-amber-950/40" :
                        "text-rose-700 bg-rose-50 dark:bg-rose-950/40"
                      const srcLabel = d.source.replace("-", " ")
                      return (
                        <TableRow key={i} className="text-xs hover:bg-muted/40">
                          <TableCell className="font-mono">{d.date}</TableCell>
                          <TableCell>
                            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium capitalize", srcColor)}>
                              {srcLabel}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-[11px]">{d.refId}</TableCell>
                          <TableCell className="text-[11px]">{d.warehouse}</TableCell>
                          <TableCell className="text-right font-mono font-semibold tabular-nums">{fmtNum(d.qty)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {tab === "supply" && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" /> Supply Entries — {item.supplies.length} records
                </h3>
                <span className="text-xs text-muted-foreground">Total: {fmtNum(item.supplies.reduce((s, sp) => s + sp.qty, 0))} {item.uom}</span>
              </div>
              <div className="rounded-md border overflow-hidden">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Source</TableHead>
                      <TableHead className="text-xs">Reference</TableHead>
                      <TableHead className="text-xs">Warehouse</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-right text-xs">Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.supplies.map((sp, i) => {
                      const srcColor =
                        sp.source === "on-hand" ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40" :
                        sp.source === "po-inbound" ? "text-blue-700 bg-blue-50 dark:bg-blue-950/40" :
                        sp.source === "wo-completion" ? "text-violet-700 bg-violet-50 dark:bg-violet-950/40" :
                        sp.source === "transfer-in" ? "text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40" :
                        "text-amber-700 bg-amber-50 dark:bg-amber-950/40"
                      const statusColor =
                        sp.status === "received" ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40" :
                        sp.status === "in-transit" ? "text-blue-700 bg-blue-50 dark:bg-blue-950/40" :
                        sp.status === "scheduled" ? "text-amber-700 bg-amber-50 dark:bg-amber-950/40" :
                        "text-slate-700 bg-slate-100 dark:bg-slate-900/40"
                      const srcLabel = sp.source.replace("-", " ")
                      return (
                        <TableRow key={i} className="text-xs hover:bg-muted/40">
                          <TableCell className="font-mono">{sp.date}</TableCell>
                          <TableCell>
                            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium capitalize", srcColor)}>
                              {srcLabel}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-[11px]">{sp.refId}</TableCell>
                          <TableCell className="text-[11px]">{sp.warehouse}</TableCell>
                          <TableCell>
                            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium capitalize", statusColor)}>
                              {sp.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold tabular-nums">{fmtNum(sp.qty)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {tab === "lead-times" && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-cyan-500" /> Lead Time Breakdown — {item.leadTimes.length} stages
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">Planned: <span className="font-semibold text-foreground">{totalLeadPlanned}d</span></span>
                  <span className="text-muted-foreground">Actual: <span className={cn("font-semibold", leadVariance > 0 ? "text-rose-600 dark:text-rose-400" : leadVariance < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>{totalLeadActual}d</span></span>
                  <span className={cn("font-semibold", leadVariance > 0 ? "text-rose-600 dark:text-rose-400" : leadVariance < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                    {leadVariance > 0 ? "+" : ""}{leadVariance}d
                  </span>
                </div>
              </div>

              {/* Vertical timeline */}
              <div className="relative pl-6 space-y-3">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-emerald-500" />
                {item.leadTimes.map((lt, i) => {
                  const variance = lt.actualDays - lt.plannedDays
                  const tone = variance > 1 ? "danger" : variance < -1 ? "good" : "default"
                  return (
                    <div key={i} className="relative">
                      <div className={cn(
                        "absolute -left-4 top-1 h-3 w-3 rounded-full border-2 border-background",
                        tone === "danger" ? "bg-rose-500" : tone === "good" ? "bg-emerald-500" : "bg-blue-500"
                      )} />
                      <Card>
                        <CardContent className="inner-glow glass-subtle p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold capitalize">{lt.stage.replace("-", " ")}</div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">{lt.notes}</div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">Planned: <span className="font-mono font-semibold text-foreground">{lt.plannedDays}d</span></span>
                                <span className="text-muted-foreground">Actual: <span className={cn("font-mono font-semibold", tone === "danger" ? "text-rose-600 dark:text-rose-400" : tone === "good" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>{lt.actualDays}d</span></span>
                                <span className={cn("font-mono text-[10px] font-bold", tone === "danger" ? "text-rose-600 dark:text-rose-400" : tone === "good" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                                  {variance > 0 ? "+" : ""}{variance}d
                                </span>
                              </div>
                              <div className="mt-1 h-1.5 w-32 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={cn("h-full transition-all", tone === "danger" ? "bg-rose-500" : tone === "good" ? "bg-emerald-500" : "bg-blue-500")}
                                  style={{ width: `${Math.min(100, (lt.actualDays / Math.max(lt.plannedDays, lt.actualDays, 1)) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {tab === "plan" && (
            <>
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-violet-500" /> MRP Net Change Plan
              </h3>
              <Card>
                <CardContent className="inner-glow glass-subtle p-4">
                  <div className="text-xs text-muted-foreground mb-2">Planning Horizon</div>
                  <div className="text-sm font-mono">{item.plan.horizon}</div>
                </CardContent>
              </Card>

              {/* Net calculation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <InfoCard label="Opening Qty" value={fmtNum(item.plan.openingQty)} sub={item.uom} />
                <InfoCard label="Total Demand" value={fmtNum(item.plan.totalDemand)} sub="30d forecast" tone="danger" />
                <InfoCard label="Total Supply" value={fmtNum(item.plan.totalSupply)} sub="30d inbound" tone="good" />
                <InfoCard label="Projected Closing" value={fmtNum(item.plan.projectedClosing)} sub={`${item.plan.projectedDaysOfCover}d cover`} tone={projectedShort ? "danger" : "good"} />
              </div>

              {/* Visual net chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Demand vs Supply Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={[
                        { stage: "Opening", qty: item.plan.openingQty, color: "#3b82f6" },
                        { stage: "+ Supply", qty: item.plan.totalSupply, color: "#10b981" },
                        { stage: "- Demand", qty: -item.plan.totalDemand, color: "#ef4444" },
                        { stage: "Closing", qty: item.plan.projectedClosing, color: projectedShort ? "#ef4444" : "#10b981" },
                      ]}
                      margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                      <XAxis dataKey="stage" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Bar dataKey="qty" radius={[4, 4, 0, 0]}>
                        {[
                          { stage: "Opening", qty: item.plan.openingQty, color: "#3b82f6" },
                          { stage: "+ Supply", qty: item.plan.totalSupply, color: "#10b981" },
                          { stage: "- Demand", qty: -item.plan.totalDemand, color: "#ef4444" },
                          { stage: "Closing", qty: item.plan.projectedClosing, color: projectedShort ? "#ef4444" : "#10b981" },
                        ].map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={cn(projectedShort ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40" : "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40")}>
                <CardContent className="inner-glow glass-subtle p-3">
                  <div className={cn("text-xs font-semibold mb-1 flex items-center gap-1.5", projectedShort ? "text-rose-800 dark:text-rose-300" : "text-emerald-800 dark:text-emerald-300")}>
                    {projectedShort ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    {projectedShort ? "Projected Shortage" : "Healthy Projection"}
                  </div>
                  <div className={cn("text-xs", projectedShort ? "text-rose-900 dark:text-rose-200" : "text-emerald-900 dark:text-emerald-200")}>
                    {projectedShort
                      ? `Based on current demand and supply, stock will fall below safety stock within the planning horizon. Action required.`
                      : `Stock projected to remain above safety stock throughout the planning horizon.`}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "recommendations" && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" /> MRP Recommendations — {item.recommendations.length} suggestions
                </h3>
                <span className="text-xs text-muted-foreground">AI-generated · refresh after each MRP run</span>
              </div>

              <div className="space-y-3">
                {item.recommendations.map((rec, i) => {
                  const priorityColor =
                    rec.priority === "critical" ? "text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/40" :
                    rec.priority === "high" ? "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/40" :
                    rec.priority === "medium" ? "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/40" :
                    "text-slate-700 bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/40"
                  const typeIcon =
                    rec.type === "raise-po" ? ShoppingCart :
                    rec.type === "expedite" ? Zap :
                    rec.type === "transfer" ? ArrowRightCircle :
                    rec.type === "reduce" ? ArrowDown :
                    rec.type === "scrap" ? XCircle :
                    Eye
                  const TypeIcon = typeIcon
                  return (
                    <Card key={i} className="hover-lift-sm mrp-card-enter" style={{ animationDelay: `${i * 80}ms` }}>
                      <CardContent className="inner-glow glass-subtle p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-sm font-semibold">{rec.title}</div>
                                <div className="text-[11px] text-muted-foreground capitalize">{rec.type.replace("-", " ")}</div>
                              </div>
                              <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase", priorityColor)}>
                                {rec.priority}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5">{rec.description}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px]">
                              <div>
                                <div className="text-muted-foreground">Suggested Qty</div>
                                <div className="font-semibold font-mono">{rec.suggestedQty > 0 ? `+${fmtNum(rec.suggestedQty)}` : rec.suggestedQty < 0 ? `${fmtNum(rec.suggestedQty)}` : "—"}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Suggested Date</div>
                                <div className="font-semibold font-mono">{rec.suggestedDate}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Est. Cost</div>
                                <div className="font-semibold font-mono">{rec.estimatedCost > 0 ? fmtINR(rec.estimatedCost) : "—"}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Impact</div>
                                <div className="font-medium text-[10px] leading-tight">{rec.impact}</div>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button size="sm" variant="outline" onClick={() => handleExecute(rec)}>
                                Execute <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="border-t bg-muted/30 px-6 py-3 flex-row flex-wrap gap-2">
          {footerActions.map((a, i) => (
            <Button key={i} variant={a.variant} size="sm" onClick={a.onClick}>
              {a.label}
            </Button>
          ))}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ──────────────────────────────────────────────────────────
// Sub-components for the drawer
// ──────────────────────────────────────────────────────────

function HeroStat({
  label,
  value,
  sub,
  tone,
  className,
  style,
}: {
  label: string
  value: string
  sub?: string
  tone?: "default" | "danger" | "warn" | "good"
  className?: string
  style?: React.CSSProperties
}) {
  const toneClass =
    tone === "danger" ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-900/40" :
    tone === "warn" ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40" :
    tone === "good" ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40" :
    "bg-muted/40 border-border"
  const valueTone =
    tone === "danger" ? "text-rose-700 dark:text-rose-300" :
    tone === "warn" ? "text-amber-700 dark:text-amber-300" :
    tone === "good" ? "text-emerald-700 dark:text-emerald-300" :
    ""
  return (
    <div className={cn("rounded-lg border p-3", toneClass, className)} style={style}>
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className={cn("text-lg font-bold tabular-nums mt-0.5", valueTone)}>{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground/80 mt-0.5">{sub}</div>}
    </div>
  )
}

function InfoCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub?: string
  tone?: "default" | "danger" | "good"
}) {
  const toneClass =
    tone === "danger" ? "text-rose-700 dark:text-rose-300" :
    tone === "good" ? "text-emerald-700 dark:text-emerald-300" :
    ""
  return (
    <Card className="hover-lift-sm bg-muted/30">
      <CardContent className="inner-glow glass-subtle p-3">
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className={cn("text-base font-bold tabular-nums mt-0.5", toneClass)}>{value}</div>
        {sub && <div className="text-[10px] text-muted-foreground/80 mt-0.5">{sub}</div>}
      </CardContent>
    </Card>
  )
}

function TraceCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub: string
}) {
  return (
    <Card className="hover-lift-sm hover:shadow-md transition-shadow">
      <CardContent className="inner-glow glass-subtle p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
        </div>
        <div className="text-sm font-semibold font-mono">{value}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
      </CardContent>
    </Card>
  )
}
