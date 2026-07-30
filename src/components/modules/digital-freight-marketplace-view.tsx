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
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import {
  Search, Eye, Truck, IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Package, BarChart3, Activity, Users, ShieldCheck, AlertTriangle, Clock, Target, CheckCircle2,
  RefreshCw, FileDown, ArrowRight, Navigation, Route, XCircle, Gavel,
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
const pick = <T,>(arr: readonly T[], seed: number): T => arr[Math.floor(seededRandom(seed) * arr.length)] as unknown as T
const ri = (min: number, max: number, seed: number): number => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const rf = (min: number, max: number, seed: number, dec = 1): number => Number((seededRandom(seed) * (max - min) + min).toFixed(dec))
const formatINR = (n: number) =>
  n >= 10000000 ? `\u20b9${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `\u20b9${(n / 100000).toFixed(2)} L` : `\u20b9${n.toLocaleString("en-IN")}`

// ============================================================================
// Theme & Enums
// ============================================================================
const C = { blue: "#3b82f6", emerald: "#059669", orange: "#ea580c", violet: "#7c3aed", cyan: "#0891b2", amber: "#d97706" }
const CC = [C.blue, C.emerald, C.orange, C.violet, C.cyan, C.amber, "#e11d48", "#4f46e5"]

const SHIPPERS = [
  "Reliance Logistics", "Tata Supply Chain", "Adani Ports", "Mahindra Logistics",
  "Delhivery Freight", "BlueDart Cargo", "DTDC Freight", "Allcargo Logistics",
  "VRL Logistics", "TCI Express",
] as const
const CARRIERS = [
  "Delhivery Transport", "BlueDart Freight", "TCI Express", "Gati", "Safexpress",
  "VRL Logistics", "Mahindra Logistics", "Allcargo", "Spoton", "Shadowfax",
  "Rivigo", "BlackBuck", "XpressBees", "Ecom Express", "Professional Couriers",
] as const
const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Kochi", "Coimbatore", "Nagpur", "Surat",
  "Indore", "Bhopal",
] as const
const VEHICLE_TYPES = [
  "20ft Container", "40ft Container", "Open Truck", "Flatbed",
  "Refrigerated", "Tanker", "Trailer", "Mini Truck",
] as const
const FREIGHT_TYPES = ["FTL", "PTL", "LTL", "Express", "Part-Load"] as const
const LOAD_STATUSES = ["Open", "Bidding", "Awarded", "In Transit", "Delivered", "Expired", "Cancelled"] as const
const BID_STATUSES = ["Submitted", "Shortlisted", "Awarded", "Rejected", "Withdrawn", "Counter-Offer"] as const
const SPOT_MODES = ["FTL", "PTL", "LTL", "Express", "Rail", "Air"] as const
const TRENDS = ["Up", "Down", "Stable", "Volatile"] as const
const VOLATILITIES = ["Low", "Medium", "High", "Extreme"] as const
const CONTRACT_STATUSES = ["Active", "Expiring Soon", "Expired", "Renegotiation", "Terminated", "Draft"] as const
const PENALTIES = ["None", "2%", "5%", "10%", "Variable"] as const
const LANE_PAIRS = [
  "Mumbai-Delhi", "Delhi-Chennai", "Bangalore-Hyderabad", "Mumbai-Pune", "Delhi-Kolkata",
  "Chennai-Coimbatore", "Hyderabad-Mumbai", "Pune-Bangalore", "Ahmedabad-Delhi",
  "Kolkata-Guwahati", "Surat-Mumbai", "Jaipur-Delhi", "Lucknow-Kolkata",
  "Nagpur-Chennai", "Indore-Mumbai", "Bhopal-Pune", "Coimbatore-Chennai",
  "Kochi-Bangalore",
] as const

// ============================================================================
// Color Maps
// ============================================================================
const VT_EMOJI: Record<string, string> = {
  "20ft Container": "\ud83d\udce6", "40ft Container": "\ud83d\udce6", "Open Truck": "\ud83d\ude9a",
  Flatbed: "\ud83d\ude9a", Refrigerated: "\u2744\ufe0f", Tanker: "\u26fd",
  Trailer: "\ud83d\ude9a", "Mini Truck": "\ud83d\ude90",
}
const FT_CLR: Record<string, string> = {
  FTL: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  PTL: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  LTL: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  Express: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "Part-Load": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
}
const LS_CLR: Record<string, string> = {
  Open: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Bidding: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Awarded: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  "In Transit": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  Delivered: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
  Expired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
}
const BS_CLR: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Shortlisted: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Awarded: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Withdrawn: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "Counter-Offer": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
}
const CS_CLR: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Expiring Soon": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Expired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  Renegotiation: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Terminated: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
}
const MODE_CLR: Record<string, string> = {
  FTL: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  PTL: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  LTL: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  Express: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Rail: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Air: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
}

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const loads: Record<string, string | number>[] = []
  for (let i = 0; i < 75; i++) {
    const s = i * 13 + 7
    const o = pick(CITIES, s) as string
    const d = pick(CITIES.filter(c => c !== o), s + 1) as string
    loads.push({
      id: `LD-${String(i + 1).padStart(4, "0")}`,
      shipper: pick(SHIPPERS, s + 2) as string,
      origin: o,
      destination: d,
      weight: rf(2, 45, s + 3),
      vehicleType: pick(VEHICLE_TYPES, s + 4) as string,
      freightType: pick(FREIGHT_TYPES, s + 5) as string,
      rate: ri(8000, 250000, s + 6),
      validUntil: `2026-07-${String(ri(1, 28, s + 7)).padStart(2, "0")}`,
      bids: ri(0, 12, s + 8),
      status: pick(LOAD_STATUSES, s + 9) as string,
    })
  }

  const bids: Record<string, string | number>[] = []
  for (let i = 0; i < 70; i++) {
    const s = i * 17 + 3
    bids.push({
      id: `BD-${String(i + 1).padStart(4, "0")}`,
      loadId: `LD-${String(ri(1, 75, s) % 75 + 1).padStart(4, "0")}`,
      carrier: pick(CARRIERS, s + 1) as string,
      bidAmount: ri(8000, 250000, s + 2),
      transitDays: ri(1, 8, s + 3),
      rating: rf(2.5, 5.0, s + 4),
      fleetSize: ri(10, 500, s + 5),
      equipmentAge: ri(1, 12, s + 6),
      compliance: ri(65, 100, s + 7),
      status: pick(BID_STATUSES, s + 8) as string,
    })
  }

  const spotRates: Record<string, string | number>[] = []
  for (let i = 0; i < 65; i++) {
    const s = i * 19 + 11
    const base = ri(5000, 80000, s)
    const fuel = Math.round(base * (seededRandom(s + 1) * 0.15 + 0.05))
    const acc = ri(200, 8000, s + 2)
    spotRates.push({
      id: `SR-${String(i + 1).padStart(4, "0")}`,
      lane: pick(LANE_PAIRS, s + 3) as string,
      mode: pick(SPOT_MODES, s + 4) as string,
      baseRate: base,
      fuelSurcharge: fuel,
      accessorial: acc,
      totalRate: base + fuel + acc,
      validFrom: `2026-07-${String(ri(1, 15, s + 5)).padStart(2, "0")}`,
      validTo: `2026-07-${String(ri(16, 31, s + 6)).padStart(2, "0")}`,
      trend: pick(TRENDS, s + 7) as string,
      volatility: pick(VOLATILITIES, s + 8) as string,
    })
  }

  const contracts: Record<string, string | number>[] = []
  for (let i = 0; i < 55; i++) {
    const s = i * 23 + 5
    contracts.push({
      id: `CT-${String(i + 1).padStart(4, "0")}`,
      shipper: pick(SHIPPERS, s) as string,
      carrier: pick(CARRIERS, s + 1) as string,
      lane: pick(LANE_PAIRS, s + 2) as string,
      rate: ri(12, 85, s + 3),
      volume: ri(50, 2000, s + 4),
      startDate: `2026-0${String(ri(1, 6, s + 5)).padStart(2, "0")}-01`,
      endDate: `2026-${String(ri(7, 12, s + 6)).padStart(2, "0")}-28`,
      status: pick(CONTRACT_STATUSES, s + 7) as string,
      penalty: pick(PENALTIES, s + 8) as string,
    })
  }

  // Chart data
  const dailyVolume = Array.from({ length: 14 }, (_, i) => ({
    day: `Jul ${i + 1}`,
    Booked: ri(40, 120, i * 5 + 100),
    Matched: ri(30, 90, i * 5 + 101),
    "In Transit": ri(20, 80, i * 5 + 102),
    Delivered: ri(15, 70, i * 5 + 103),
  }))

  const modePie = ["FTL", "PTL", "LTL", "Express", "Air", "Rail", "Multimodal"].map((n, i) => ({
    name: n,
    value: ri(80, 400, i * 7 + 200),
  }))

  const laneDensity = LANE_PAIRS.slice(0, 10).map((n, i) => ({
    name: n,
    volume: ri(200, 1200, i * 11 + 300),
  }))

  const monthlyGMV = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    gmv: ri(5000000, 25000000, i * 4 + 400),
  }))

  const laneMargin = LANE_PAIRS.slice(0, 10).map((n, i) => ({
    name: n,
    margin: ri(50000, 500000, i * 9 + 500),
  }))

  const modeMix = ["FTL", "PTL", "LTL", "Express", "Rail", "Air"].map((n, i) => ({
    name: n,
    pct: ri(10, 35, i * 7 + 600),
  }))

  const costBreakdown = Array.from({ length: 6 }, (_, i) => ({
    month: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"][i],
    Freight: ri(3000000, 12000000, i * 5 + 700),
    Handling: ri(500000, 2000000, i * 5 + 701),
    Insurance: ri(100000, 500000, i * 5 + 702),
    Demurrage: ri(50000, 300000, i * 5 + 703),
    Tolls: ri(200000, 800000, i * 5 + 704),
  }))

  return { loads, bids, spotRates, contracts, dailyVolume, modePie, laneDensity, monthlyGMV, laneMargin, modeMix, costBreakdown }
}

// ============================================================================
// Unique Visual Components (16+)
// ============================================================================

// 1. VehicleTypeBadge — 8 types with emoji
function VehicleTypeBadge({ type }: { type: string }) {
  return (
    <span className="dfm-vt inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
      {VT_EMOJI[type] ?? "\ud83d\ude9a"}{type}
    </span>
  )
}

// 2. FreightTypeBadge — 5 types with color
function FreightTypeBadge({ type }: { type: string }) {
  return <span className={cn("dfm-ft inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", FT_CLR[type] ?? FT_CLR.FTL)}>{type}</span>
}

// 3. LoadStatusBadge — 7-tier, Bidding pulse, Open green pulse
function LoadStatusBadge({ s }: { s: string }) {
  const pulse = s === "Bidding" ? "animate-pulse" : s === "Open" ? "animate-pulse" : ""
  return <span className={cn("dfm-ls inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", LS_CLR[s] ?? "", pulse)}>{s}</span>
}

// 4. CarrierBadge — 15 Indian carriers
function CarrierBadge({ name }: { name: string }) {
  const cl = name.includes("BlueDart")
    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
    : name.includes("Delhivery")
    ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
    : name.includes("TCI")
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
    : name.includes("Rivigo")
    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
    : "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300"
  return <span className={cn("dfm-carrier inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium", cl)}>{name}</span>
}

// 5. BidStatusBadge — 6-tier, Submitted pulse, Counter-Offer amber pulse
function BidStatusBadge({ s }: { s: string }) {
  const pulse = s === "Submitted" ? "animate-pulse" : s === "Counter-Offer" ? "animate-pulse" : ""
  return <span className={cn("dfm-bs inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", BS_CLR[s] ?? "", pulse)}>{s}</span>
}

// 6. RatingBar — 1-5 stars with color
function RatingBar({ rating }: { rating: number }) {
  const rounded = Math.round(rating)
  const cl = rounded >= 4 ? "text-amber-500" : rounded >= 3 ? "text-orange-500" : "text-red-500"
  return (
    <span className="dfm-rating inline-flex items-center gap-0.5">
      <span className={cl}>{"\u2605".repeat(rounded)}</span>
      <span className="text-slate-300 dark:text-slate-600">{"\u2605".repeat(5 - rounded)}</span>
      <span className="text-[10px] font-medium ml-1">{rating.toFixed(1)}</span>
    </span>
  )
}

// 7. ComplianceBar — 3-color: green>90%, amber 75-90%, red<75%
function ComplianceBar({ pct }: { pct: number }) {
  const tier = pct >= 90
    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
    : pct >= 75
    ? "bg-gradient-to-r from-amber-500 to-amber-400"
    : "bg-gradient-to-r from-red-500 to-red-400"
  return (
    <div className="dfm-compliance flex items-center gap-1.5">
      <div className="h-2 w-14 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full", tier)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-medium">{pct}%</span>
    </div>
  )
}

// 8. ModeBadge — 6 types
function ModeBadge({ mode }: { mode: string }) {
  return <span className={cn("dfm-mode inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", MODE_CLR[mode] ?? MODE_CLR.FTL)}>{mode}</span>
}

// 9. TrendBadge — 4: Up green arrow, Down red arrow, Stable gray, Volatile orange pulse
function TrendBadge({ trend }: { trend: string }) {
  const map: Record<string, { cl: string; icon: React.ReactNode }> = {
    Up: { cl: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30", icon: <ArrowUpRight className="h-3 w-3" /> },
    Down: { cl: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30", icon: <ArrowDownRight className="h-3 w-3" /> },
    Stable: { cl: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40", icon: <span className="text-[10px]">\u2192</span> },
    Volatile: { cl: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30", icon: <Activity className="h-3 w-3" /> },
  }
  const t = map[trend] ?? map.Stable
  const pulse = trend === "Volatile" ? "animate-pulse" : ""
  return (
    <span className={cn("dfm-trend inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold", t.cl, pulse)}>
      {t.icon}{trend}
    </span>
  )
}

// 10. VolatilityBar — 4-color: Low/Medium/High/Extreme
function VolatilityBar({ vol }: { vol: string }) {
  const map: Record<string, { w: number; cl: string }> = {
    Low: { w: 25, cl: "bg-emerald-500" },
    Medium: { w: 50, cl: "bg-amber-500" },
    High: { w: 75, cl: "bg-orange-500" },
    Extreme: { w: 100, cl: "bg-red-500" },
  }
  const v = map[vol] ?? map.Low
  return (
    <div className="dfm-volatility flex items-center gap-1.5">
      <div className="h-2 w-14 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full", v.cl)} style={{ width: `${v.w}%` }} />
      </div>
      <span className="text-[10px] font-medium">{vol}</span>
    </div>
  )
}

// 11. RateTile — INR with trend indicator
function RateTile({ amount, trend }: { amount: number; trend: string }) {
  const up = trend === "Up"
  const cl = up
    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
    : trend === "Down"
    ? "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
    : "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/40"
  return (
    <span className={cn("dfm-rate inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold", cl)}>
      <IndianRupee className="h-3 w-3" />{formatINR(amount)}
      {trend === "Up" ? <ArrowUpRight className="h-3 w-3" /> : trend === "Down" ? <ArrowDownRight className="h-3 w-3" /> : null}
    </span>
  )
}

// 12. ContractStatusBadge — 6-tier, Expiring Soon amber pulse, Terminated red
function ContractStatusBadge({ s }: { s: string }) {
  const pulse = s === "Expiring Soon" ? "animate-pulse" : ""
  return <span className={cn("dfm-cs inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", CS_CLR[s] ?? "", pulse)}>{s}</span>
}

// 13. PenaltyBadge — 5 tiers
function PenaltyBadge({ p }: { p: string }) {
  const cl = p === "None"
    ? "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400"
    : p === "Variable"
    ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
    : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
  return <span className={cn("dfm-penalty inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", cl)}>{p}</span>
}

// 14. VolumeTile — MT/month with conditional color
function VolumeTile({ vol }: { vol: number }) {
  const cl = vol >= 1000
    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
    : vol >= 500
    ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
    : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40"
  return <span className={cn("dfm-vol inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold", cl)}>{vol.toLocaleString("en-IN")} MT</span>
}

// 15. LaneBadge — origin→destination compact format
function LaneBadge({ lane }: { lane: string }) {
  const parts = lane.split("-")
  return (
    <span className="dfm-lane inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
      <ArrowRight className="h-3 w-3" />{parts[0]}<span className="text-[8px]">\u2192</span>{parts[1]}
    </span>
  )
}

// 16. MarginTile — INR with green/red indicator
function MarginTile({ amount }: { amount: number }) {
  const cl = amount >= 200000
    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
    : amount >= 100000
    ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
    : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
  return (
    <span className={cn("dfm-margin inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold", cl)}>
      <IndianRupee className="h-3 w-3" />{formatINR(amount)}
    </span>
  )
}

// Shared: KpiCard
function KpiCard({ title, value, subtitle, icon: Icon, trend, color }: {
  title: string; value: string; subtitle: string; icon: React.ElementType;
  trend?: "up" | "down" | "neutral"; color: string
}) {
  return (
    <Card className="glass-subtle dfm-kpi"><CardContent className="p-4">
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
    </CardContent></Card>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export default function DigitalFreightMarketplaceView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState<string>("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterVal, setFilterVal] = useState("all")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetType, setSheetType] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<Record<string, string | number> | null>(null)
  const [sortCol, setSortCol] = useState<string>("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const openSheet = (type: string, item: Record<string, string | number>) => {
    setSheetType(type)
    setSelectedItem(item)
    setSheetOpen(true)
  }

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortCol(col); setSortDir("asc") }
  }

  const SortHeader = ({ col, label }: { col: string; label: string }) => (
    <TableHead className="text-xs cursor-pointer select-none hover:bg-accent/50 dfm-sort-header" onClick={() => handleSort(col)}>
      <div className="flex items-center gap-0.5">
        {label}{sortCol === col && <span className="text-[9px]">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>}
      </div>
    </TableHead>
  )

  const sortFn = (a: Record<string, string | number>, b: Record<string, string | number>) => {
    const av = a[sortCol] ?? ""
    const bv = b[sortCol] ?? ""
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv))
    return sortDir === "asc" ? cmp : -cmp
  }

  const filteredLoads = useMemo(() => {
    let f = data.loads
    if (searchTerm) f = f.filter(o =>
      String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.shipper).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.origin).toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filterVal !== "all") f = f.filter(o => o.status === filterVal)
    return [...f].sort(sortFn)
  }, [data.loads, searchTerm, filterVal, sortCol, sortDir])

  const filteredBids = useMemo(() => {
    let f = data.bids
    if (searchTerm) f = f.filter(b =>
      String(b.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(b.carrier).toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filterVal !== "all") f = f.filter(b => b.status === filterVal)
    return [...f].sort(sortFn)
  }, [data.bids, searchTerm, filterVal, sortCol, sortDir])

  const filteredSpot = useMemo(() => {
    let f = data.spotRates
    if (searchTerm) f = f.filter(r =>
      String(r.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.lane).toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filterVal !== "all") f = f.filter(r => r.mode === filterVal)
    return [...f].sort(sortFn)
  }, [data.spotRates, searchTerm, filterVal, sortCol, sortDir])

  const filteredContracts = useMemo(() => {
    let f = data.contracts
    if (searchTerm) f = f.filter(c =>
      String(c.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.shipper).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.carrier).toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filterVal !== "all") f = f.filter(c => c.status === filterVal)
    return [...f].sort(sortFn)
  }, [data.contracts, searchTerm, filterVal, sortCol, sortDir])

  const tab = activeTab
  const filterOptions = tab === "1"
    ? [...LOAD_STATUSES]
    : tab === "2"
    ? [...BID_STATUSES]
    : tab === "3"
    ? [...SPOT_MODES]
    : tab === "4"
    ? [...CONTRACT_STATUSES]
    : []

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <PageHeader title="Digital Freight Marketplace" description="Real-time load posting, carrier bidding, spot rates & contract management for Indian logistics" />

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchTerm(""); setFilterVal("all") }}>
        <TabsList className="grid w-full grid-cols-6 h-9">
          <TabsTrigger value="0" className="text-[11px]">Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="text-[11px]">Load Posting</TabsTrigger>
          <TabsTrigger value="2" className="text-[11px]">Carrier Bidding</TabsTrigger>
          <TabsTrigger value="3" className="text-[11px]">Spot Rates</TabsTrigger>
          <TabsTrigger value="4" className="text-[11px]">Contracts</TabsTrigger>
          <TabsTrigger value="5" className="text-[11px]">Analytics</TabsTrigger>
        </TabsList>

        {/* ================================================================== */}
        {/* TAB 0 — Marketplace Dashboard */}
        {/* ================================================================== */}
        <TabsContent value="0" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 dfm-kpi-grid">
            <KpiCard title="Active Shipments" value="2,847" subtitle="+18% vs last week" icon={Truck} trend="up" color="bg-blue-600" />
            <KpiCard title="Available Carriers" value="342" subtitle="15 new this month" icon={Users} trend="up" color="bg-emerald-600" />
            <KpiCard title="Avg Rate" value="\u20b912.4/km" subtitle="-3.2% this quarter" icon={IndianRupee} trend="down" color="bg-orange-600" />
            <KpiCard title="Marketplace GMV" value={formatINR(185000000)} subtitle="+24% YoY" icon={TrendingUp} trend="up" color="bg-violet-600" />
            <KpiCard title="Match Rate" value="87.3%" subtitle="+2.1% improvement" icon={Target} trend="up" color="bg-cyan-600" />
            <KpiCard title="On-Time %" value="94.6%" subtitle="Above 90% SLA" icon={Clock} trend="up" color="bg-amber-600" />
            <KpiCard title="Disputes Open" value="23" subtitle="-5 vs last week" icon={AlertTriangle} trend="down" color="bg-red-600" />
            <KpiCard title="Cost Savings" value={formatINR(4200000)} subtitle="This quarter" icon={ShieldCheck} trend="up" color="bg-emerald-600" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="dfm-chart col-span-1 md:col-span-2">
              <CardHeader><CardTitle className="text-sm">Daily Shipment Volume (Stacked)</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <AreaChart data={data.dailyVolume}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="Booked" stackId="1" stroke={C.blue} fill={C.blue} fillOpacity={0.4} />
                    <Area type="monotone" dataKey="Matched" stackId="1" stroke={C.emerald} fill={C.emerald} fillOpacity={0.4} />
                    <Area type="monotone" dataKey="In Transit" stackId="1" stroke={C.orange} fill={C.orange} fillOpacity={0.4} />
                    <Area type="monotone" dataKey="Delivered" stackId="1" stroke={C.violet} fill={C.violet} fillOpacity={0.4} />
                  </AreaChart>
                </div>
              </CardContent>
            </Card>
            <Card className="dfm-chart">
              <CardHeader><CardTitle className="text-sm">Freight Mode Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <PieChart>
                    <Pie data={data.modePie} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={undefined} labelLine={false}>
                      {data.modePie.map((_: Record<string, string | number>, i: number) => (
                        <Cell key={i} fill={CC[i % CC.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="dfm-chart">
            <CardHeader><CardTitle className="text-sm">Lane Density — Top 10 Routes by Volume</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <BarChart data={data.laneDensity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="volume" fill={C.cyan} radius={[0, 4, 4, 0]} />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 1 — Load Posting */}
        {/* ================================================================== */}
        <TabsContent value="1" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search load, shipper, origin..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="dfm-table-row">
                  <SortHeader col="id" label="Load ID" />
                  <TableHead className="text-[10px]">Shipper</TableHead>
                  <TableHead className="text-[10px]">Origin</TableHead>
                  <TableHead className="text-[10px]">Dest</TableHead>
                  <TableHead className="text-[10px]">Wt (MT)</TableHead>
                  <TableHead className="text-[10px]">Vehicle</TableHead>
                  <TableHead className="text-[10px]">Type</TableHead>
                  <TableHead className="text-[10px]">Rate (\u20b9)</TableHead>
                  <TableHead className="text-[10px]">Valid Until</TableHead>
                  <TableHead className="text-[10px]">Bids</TableHead>
                  <TableHead className="text-[10px]">Status</TableHead>
                  <TableHead className="text-[10px] w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoads.map((o) => (
                  <TableRow key={String(o.id)} className="cursor-pointer dfm-table-row hover:bg-muted/50" onClick={() => openSheet("load", o)}>
                    <TableCell className="text-xs font-mono font-semibold">{String(o.id)}</TableCell>
                    <TableCell className="text-[10px]">{String(o.shipper)}</TableCell>
                    <TableCell className="text-[10px]">{String(o.origin)}</TableCell>
                    <TableCell className="text-[10px]">{String(o.destination)}</TableCell>
                    <TableCell className="numeric-cell text-[10px] font-medium">{Number(o.weight).toFixed(1)}</TableCell>
                    <TableCell><VehicleTypeBadge type={String(o.vehicleType)} /></TableCell>
                    <TableCell><FreightTypeBadge type={String(o.freightType)} /></TableCell>
                    <TableCell><RateTile amount={Number(o.rate)} trend="Stable" /></TableCell>
                    <TableCell className="text-[10px]">{String(o.validUntil)}</TableCell>
                    <TableCell className="text-[10px] font-semibold">{String(o.bids)}</TableCell>
                    <TableCell><LoadStatusBadge s={String(o.status)} /></TableCell>
                    <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 2 — Carrier Bidding */}
        {/* ================================================================== */}
        <TabsContent value="2" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search bid, carrier, load..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="dfm-table-row">
                  <SortHeader col="id" label="Bid ID" />
                  <TableHead className="text-[10px]">Load ID</TableHead>
                  <TableHead className="text-[10px]">Carrier</TableHead>
                  <TableHead className="text-[10px]">Amount (\u20b9)</TableHead>
                  <TableHead className="text-[10px]">Days</TableHead>
                  <TableHead className="text-[10px]">Rating</TableHead>
                  <TableHead className="text-[10px]">Fleet</TableHead>
                  <TableHead className="text-[10px]">Equip Age</TableHead>
                  <TableHead className="text-[10px]">Compliance</TableHead>
                  <TableHead className="text-[10px]">Status</TableHead>
                  <TableHead className="text-[10px] w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBids.map((b) => (
                  <TableRow key={String(b.id)} className="cursor-pointer dfm-table-row hover:bg-muted/50" onClick={() => openSheet("bid", b)}>
                    <TableCell className="text-xs font-mono font-semibold">{String(b.id)}</TableCell>
                    <TableCell className="text-[10px] font-mono">{String(b.loadId)}</TableCell>
                    <TableCell><CarrierBadge name={String(b.carrier)} /></TableCell>
                    <TableCell><RateTile amount={Number(b.bidAmount)} trend="Stable" /></TableCell>
                    <TableCell className="text-[10px] font-medium">{String(b.transitDays)}</TableCell>
                    <TableCell><RatingBar rating={Number(b.rating)} /></TableCell>
                    <TableCell className="text-[10px]">{String(b.fleetSize)}</TableCell>
                    <TableCell className="text-[10px]">{String(b.equipmentAge)} yrs</TableCell>
                    <TableCell><ComplianceBar pct={Number(b.compliance)} /></TableCell>
                    <TableCell><BidStatusBadge s={String(b.status)} /></TableCell>
                    <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 3 — Spot Rates */}
        {/* ================================================================== */}
        <TabsContent value="3" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search rate, lane, mode..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Mode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                {filterOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="dfm-table-row">
                  <SortHeader col="id" label="Rate ID" />
                  <TableHead className="text-[10px]">Lane</TableHead>
                  <TableHead className="text-[10px]">Mode</TableHead>
                  <TableHead className="text-[10px]">Base (\u20b9)</TableHead>
                  <TableHead className="text-[10px]">Fuel (\u20b9)</TableHead>
                  <TableHead className="text-[10px]">Access (\u20b9)</TableHead>
                  <TableHead className="text-[10px]">Total (\u20b9)</TableHead>
                  <TableHead className="text-[10px]">Valid From</TableHead>
                  <TableHead className="text-[10px]">Valid To</TableHead>
                  <TableHead className="text-[10px]">Trend</TableHead>
                  <TableHead className="text-[10px]">Volatility</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpot.map((r) => (
                  <TableRow key={String(r.id)} className="cursor-pointer dfm-table-row hover:bg-muted/50" onClick={() => openSheet("spot", r)}>
                    <TableCell className="text-xs font-mono font-semibold">{String(r.id)}</TableCell>
                    <TableCell><LaneBadge lane={String(r.lane)} /></TableCell>
                    <TableCell><ModeBadge mode={String(r.mode)} /></TableCell>
                    <TableCell className="numeric-cell text-[10px]">{formatINR(Number(r.baseRate))}</TableCell>
                    <TableCell className="text-[10px]">{formatINR(Number(r.fuelSurcharge))}</TableCell>
                    <TableCell className="text-[10px]">{formatINR(Number(r.accessorial))}</TableCell>
                    <TableCell><RateTile amount={Number(r.totalRate)} trend={String(r.trend)} /></TableCell>
                    <TableCell className="text-[10px]">{String(r.validFrom)}</TableCell>
                    <TableCell className="text-[10px]">{String(r.validTo)}</TableCell>
                    <TableCell><TrendBadge trend={String(r.trend)} /></TableCell>
                    <TableCell><VolatilityBar vol={String(r.volatility)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 4 — Contract Management */}
        {/* ================================================================== */}
        <TabsContent value="4" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search contract, shipper, carrier..." className="h-8 pl-8 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filterOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredContracts.map((c) => {
              const status = String(c.status)
              const gradCls = status === "Active"
                ? "from-blue-600 to-emerald-600"
                : status === "Expiring Soon"
                ? "from-amber-600 to-orange-600"
                : status === "Terminated"
                ? "from-red-600 to-rose-700"
                : status === "Draft"
                ? "from-slate-500 to-slate-600"
                : "from-violet-600 to-cyan-600"
              return (
                <Card key={String(c.id)} className="dfm-contract-card cursor-pointer hover:shadow-md transition-shadow" onClick={() => openSheet("contract", c)}>
                  <div className={cn("rounded-t-lg bg-gradient-to-r p-3 text-white", gradCls)}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-mono">{String(c.id)}</span>
                      <ContractStatusBadge s={status} />
                    </div>
                    <div className="text-[10px] mt-1 opacity-80">{String(c.shipper)} &harr; {String(c.carrier)}</div>
                  </div>
                  <CardContent className="glass-subtle p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <LaneBadge lane={String(c.lane)} />
                      <span className="text-xs font-semibold">\u20b9{String(c.rate)}/km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <VolumeTile vol={Number(c.volume)} />
                      <PenaltyBadge p={String(c.penalty)} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{String(c.startDate)}</span>
                      <span>{String(c.endDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 5 — Freight Analytics */}
        {/* ================================================================== */}
        <TabsContent value="5" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 dfm-kpi-grid">
            <KpiCard title="Monthly GMV" value={formatINR(185000000)} subtitle="+24% YoY" icon={TrendingUp} trend="up" color="bg-blue-600" />
            <KpiCard title="Avg Margin" value="12.4%" subtitle="+1.8% vs target" icon={Target} trend="up" color="bg-emerald-600" />
            <KpiCard title="Cost/km" value="\u20b914.2" subtitle="-2.1% this quarter" icon={IndianRupee} trend="down" color="bg-orange-600" />
            <KpiCard title="Carrier Score" value="4.3/5" subtitle="Top 10 avg" icon={ShieldCheck} trend="up" color="bg-violet-600" />
            <KpiCard title="Bids/Load" value="4.7" subtitle="Competitive" icon={Activity} trend="up" color="bg-cyan-600" />
            <KpiCard title="Contract Cover" value="68%" subtitle="Volume on contract" icon={BarChart3} trend="up" color="bg-amber-600" />
            <KpiCard title="Spot Savings" value={formatINR(2800000)} subtitle="vs contract rates" icon={TrendingDown} trend="down" color="bg-emerald-600" />
            <KpiCard title="Dispute Rate" value="1.2%" subtitle="Below 2% SLA" icon={AlertTriangle} trend="down" color="bg-red-600" />
          </div>

          <Card className="dfm-chart">
            <CardHeader><CardTitle className="text-sm">Monthly GMV Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <LineChart data={data.monthlyGMV}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => formatINR(v)} />
                  <Tooltip formatter={(v: number) => formatINR(v)} />
                  <Line type="monotone" dataKey="gmv" stroke={C.blue} strokeWidth={2} dot={false} />
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="dfm-chart">
              <CardHeader><CardTitle className="text-sm">Lane Performance — Top 10 by Margin</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <BarChart data={data.laneMargin} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v: number) => formatINR(v)} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={120} />
                    <Tooltip formatter={(v: number) => formatINR(v)} />
                    <Bar dataKey="margin" fill={C.emerald} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </div>
              </CardContent>
            </Card>
            <Card className="dfm-chart">
              <CardHeader><CardTitle className="text-sm">Freight Mode Mix</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <BarChart data={data.modeMix} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 10 }} unit="%" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="pct" fill={C.violet} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="dfm-chart">
            <CardHeader><CardTitle className="text-sm">Cost Breakdown (6-Month Stacked)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <AreaChart data={data.costBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => formatINR(v)} />
                  <Tooltip formatter={(v: number) => formatINR(v)} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="Freight" stackId="1" stroke={C.blue} fill={C.blue} fillOpacity={0.4} />
                  <Area type="monotone" dataKey="Handling" stackId="1" stroke={C.emerald} fill={C.emerald} fillOpacity={0.4} />
                  <Area type="monotone" dataKey="Insurance" stackId="1" stroke={C.violet} fill={C.violet} fillOpacity={0.4} />
                  <Area type="monotone" dataKey="Demurrage" stackId="1" stroke={C.orange} fill={C.orange} fillOpacity={0.4} />
                  <Area type="monotone" dataKey="Tolls" stackId="1" stroke={C.amber} fill={C.amber} fillOpacity={0.4} />
                </AreaChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ================================================================== */}
      {/* Detail Sheet — blue→emerald gradient header */}
      {/* ================================================================== */}
      <Sheet open={!!(sheetOpen && sheetType)} onOpenChange={(open) => { setSheetOpen(open); if (!open) { setSheetType(null); setSelectedItem(null) } }}>
        <SheetContent side="right" className="w-[460px] overflow-y-auto p-0">
          <SheetHeader className="sr-only"><SheetTitle>Detail View</SheetTitle></SheetHeader>

          {sheetType === "load" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-6 text-white dfm-sheet-header">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5" /><h3 className="text-lg font-bold">{String(selectedItem.id)}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <LoadStatusBadge s={String(selectedItem.status)} />
                  <FreightTypeBadge type={String(selectedItem.freightType)} />
                  <VehicleTypeBadge type={String(selectedItem.vehicleType)} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Shipper</span><span className="text-xs font-medium">{String(selectedItem.shipper)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Route</span><LaneBadge lane={`${String(selectedItem.origin)}-${String(selectedItem.destination)}`} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Weight</span><span className="text-xs font-semibold">{Number(selectedItem.weight).toFixed(1)} MT</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Valid Until</span><span className="text-xs">{String(selectedItem.validUntil)}</span></div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <RateTile amount={Number(selectedItem.rate)} trend="Stable" />
                  <span className="text-xs font-semibold">{String(selectedItem.bids)} bids</span>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1 dfm-action" onClick={() => { toast.success("Posted", `Load ${String(selectedItem.id)} posted to marketplace`) }}><CheckCircle2 className="h-3 w-3" />Accept Bid</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1 dfm-action" onClick={() => { toast.info("Refreshed", "Bid list refreshed") }}><RefreshCw className="h-3 w-3" />Refresh</Button>
                  <Button size="sm" variant="destructive" className="h-8 text-xs gap-1 dfm-action" onClick={() => { toast.error("Cancelled", `Load ${String(selectedItem.id)} cancelled`); setSheetOpen(false) }}><XCircle className="h-3 w-3" />Cancel</Button>
                </div>
              </div>
            </>
          )}

          {sheetType === "bid" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-6 text-white dfm-sheet-header">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5" /><h3 className="text-lg font-bold">{String(selectedItem.id)}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <BidStatusBadge s={String(selectedItem.status)} />
                  <CarrierBadge name={String(selectedItem.carrier)} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Load</span><span className="text-xs font-mono">{String(selectedItem.loadId)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Transit</span><span className="text-xs font-semibold">{String(selectedItem.transitDays)} days</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Fleet Size</span><span className="text-xs">{String(selectedItem.fleetSize)} vehicles</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Equip Age</span><span className="text-xs">{String(selectedItem.equipmentAge)} years</span></div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><span className="text-[10px] text-muted-foreground">Rating</span><RatingBar rating={Number(selectedItem.rating)} /></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] text-muted-foreground">Compliance</span><ComplianceBar pct={Number(selectedItem.compliance)} /></div>
                </div>
                <RateTile amount={Number(selectedItem.bidAmount)} trend="Stable" />
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1 dfm-action" onClick={() => { toast.success("Awarded", `Bid ${String(selectedItem.id)} awarded`) }}><CheckCircle2 className="h-3 w-3" />Award</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1 dfm-action" onClick={() => { toast.info("Counter", "Counter-offer sent") }}><RefreshCw className="h-3 w-3" />Counter-Offer</Button>
                  <Button size="sm" variant="destructive" className="h-8 text-xs gap-1 dfm-action" onClick={() => { toast.error("Rejected", `Bid ${String(selectedItem.id)} rejected`) }}><AlertTriangle className="h-3 w-3" />Reject</Button>
                </div>
              </div>
            </>
          )}

          {sheetType === "spot" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-6 text-white dfm-sheet-header">
                <div className="flex items-center gap-2 mb-2">
                  <Route className="h-5 w-5" /><h3 className="text-lg font-bold">{String(selectedItem.id)}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ModeBadge mode={String(selectedItem.mode)} />
                  <TrendBadge trend={String(selectedItem.trend)} />
                  <VolatilityBar vol={String(selectedItem.volatility)} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Lane</span><LaneBadge lane={String(selectedItem.lane)} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Mode</span><ModeBadge mode={String(selectedItem.mode)} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Base Rate</span><span className="text-xs font-semibold">{formatINR(Number(selectedItem.baseRate))}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Fuel Surcharge</span><span className="text-xs">{formatINR(Number(selectedItem.fuelSurcharge))}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Accessorial</span><span className="text-xs">{formatINR(Number(selectedItem.accessorial))}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Total</span><RateTile amount={Number(selectedItem.totalRate)} trend={String(selectedItem.trend)} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Valid From</span><span className="text-xs">{String(selectedItem.validFrom)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Valid To</span><span className="text-xs">{String(selectedItem.validTo)}</span></div>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1 dfm-action" onClick={() => { toast.success("Booked", `Rate ${String(selectedItem.id)} booked`) }}><Gavel className="h-3 w-3" />Book Rate</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1 dfm-action" onClick={() => { toast.info("Exported", "Rate card exported") }}><FileDown className="h-3 w-3" />Export</Button>
                </div>
              </div>
            </>
          )}

          {sheetType === "contract" && selectedItem && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-6 text-white dfm-sheet-header">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-5 w-5" /><h3 className="text-lg font-bold">{String(selectedItem.id)}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ContractStatusBadge s={String(selectedItem.status)} />
                  <PenaltyBadge p={String(selectedItem.penalty)} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Shipper</span><span className="text-xs font-medium">{String(selectedItem.shipper)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Carrier</span><CarrierBadge name={String(selectedItem.carrier)} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Lane</span><LaneBadge lane={String(selectedItem.lane)} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Rate</span><span className="text-xs font-bold">\u20b9{String(selectedItem.rate)}/km</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Volume</span><VolumeTile vol={Number(selectedItem.volume)} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Penalty</span><PenaltyBadge p={String(selectedItem.penalty)} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Start</span><span className="text-xs">{String(selectedItem.startDate)}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">End</span><span className="text-xs">{String(selectedItem.endDate)}</span></div>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1 dfm-action" onClick={() => { toast.success("Renewed", `Contract ${String(selectedItem.id)} renewed`) }}><CheckCircle2 className="h-3 w-3" />Renew</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1 dfm-action" onClick={() => { toast.info("Exported", "Contract exported") }}><FileDown className="h-3 w-3" />Export</Button>
                  <Button size="sm" variant="destructive" className="h-8 text-xs gap-1 dfm-action" onClick={() => { toast.error("Terminated", `Contract ${String(selectedItem.id)} terminated`); setSheetOpen(false) }}><AlertTriangle className="h-3 w-3" />Terminate</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
