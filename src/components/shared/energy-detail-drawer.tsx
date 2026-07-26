"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Leaf,
  Zap,
  Sun,
  Droplets,
  Recycle,
  TrendingUp,
  TrendingDown,
  Activity,
  Gauge,
  Award,
  Building,
  Snowflake,
  Truck,
  Warehouse,
  Lightbulb,
  Download,
  ChevronRight,
  Flame,
  Wind,
  Battery,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plug,
  TreePine,
  CloudRain,
  Thermometer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ── Types ────────────────────────────────────────────────────────────────────

export interface EnergySiteDetail {
  id: string
  name: string
  type: "warehouse" | "cold-storage" | "cross-dock" | "hub"
  dailyKwh: number
  solarKwh: number
  carbonKg: number
  waterL: number
  wasteRecycledPct: number
  efficiencyScore: number
  trend: "up" | "down" | "stable"
}

interface EnergyDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  site: EnergySiteDetail | null
}

// ── Status theming ───────────────────────────────────────────────────────────

const scoreTheme = (score: number) => {
  if (score >= 85) return { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", bar: "bg-emerald-500" }
  if (score >= 70) return { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", bar: "bg-blue-500" }
  if (score >= 55) return { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", bar: "bg-amber-500" }
  return { text: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", bar: "bg-red-500" }
}

const siteTypeIcon = {
  warehouse: Warehouse,
  "cold-storage": Snowflake,
  "cross-dock": Truck,
  hub: Building,
} as const

// ── Deterministic helpers ────────────────────────────────────────────────────

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// ── 24-hour consumption breakdown ────────────────────────────────────────────

interface HourlyReading {
  hour: string
  total: number
  solar: number
  grid: number
  hvac: number
  lighting: number
  equipment: number
}

function getHourlyData(site: EnergySiteDetail): HourlyReading[] {
  const seed = hashStr(site.id)
  const points: HourlyReading[] = []
  const base = site.dailyKwh / 24
  for (let h = 0; h < 24; h++) {
    // Solar peaks at noon
    const solarFactor = h >= 6 && h <= 18 ? Math.sin(((h - 6) / 12) * Math.PI) : 0
    const solar = Math.round(base * 0.4 * solarFactor * (site.solarKwh / site.dailyKwh * 2.5))
    // Total peaks during business hours
    const businessFactor = h >= 8 && h <= 20 ? 1.4 + Math.sin(((h - 8) / 12) * Math.PI) * 0.3 : 0.6
    const total = Math.round(base * businessFactor + ((seed >> h) & 0x3) * 0.5)
    const grid = Math.max(0, total - solar)
    // Appliance split (varies by site type)
    const isCold = site.type === "cold-storage"
    const hvac = Math.round(total * (isCold ? 0.55 : 0.35))
    const lighting = Math.round(total * (h >= 18 || h < 6 ? 0.25 : 0.12))
    const equipment = Math.max(0, total - hvac - lighting)
    points.push({
      hour: `${String(h).padStart(2, "0")}:00`,
      total,
      solar,
      grid,
      hvac,
      lighting,
      equipment,
    })
  }
  return points
}

// ── Appliance breakdown ──────────────────────────────────────────────────────

interface ApplianceBreakdown {
  appliance: string
  kwh: number
  pct: number
  icon: typeof Zap
  color: string
}

function getApplianceBreakdown(site: EnergySiteDetail): ApplianceBreakdown[] {
  const isCold = site.type === "cold-storage"
  const total = site.dailyKwh
  const breakdown: ApplianceBreakdown[] = isCold
    ? [
        { appliance: "Refrigeration Compressors", kwh: Math.round(total * 0.42), pct: 42, icon: Snowflake, color: "#3B82F6" },
        { appliance: "HVAC (ambient)", kwh: Math.round(total * 0.18), pct: 18, icon: Wind, color: "#06B6D4" },
        { appliance: "Material Handling", kwh: Math.round(total * 0.15), pct: 15, icon: Truck, color: "#F59E0B" },
        { appliance: "Lighting", kwh: Math.round(total * 0.10), pct: 10, icon: Lightbulb, color: "#EAB308" },
        { appliance: "Conveyors & Sorters", kwh: Math.round(total * 0.08), pct: 8, icon: Activity, color: "#8B5CF6" },
        { appliance: "IT & Servers", kwh: Math.round(total * 0.04), pct: 4, icon: Battery, color: "#10B981" },
        { appliance: "Other (Plug Load)", kwh: Math.round(total * 0.03), pct: 3, icon: Plug, color: "#94A3B8" },
      ]
    : [
        { appliance: "HVAC & Ventilation", kwh: Math.round(total * 0.38), pct: 38, icon: Wind, color: "#06B6D4" },
        { appliance: "Material Handling", kwh: Math.round(total * 0.22), pct: 22, icon: Truck, color: "#F59E0B" },
        { appliance: "Lighting", kwh: Math.round(total * 0.14), pct: 14, icon: Lightbulb, color: "#EAB308" },
        { appliance: "Conveyors & Sorters", kwh: Math.round(total * 0.12), pct: 12, icon: Activity, color: "#8B5CF6" },
        { appliance: "Dock Equipment", kwh: Math.round(total * 0.08), pct: 8, icon: Building, color: "#EF4444" },
        { appliance: "IT & Servers", kwh: Math.round(total * 0.04), pct: 4, icon: Battery, color: "#10B981" },
        { appliance: "Other (Plug Load)", kwh: Math.round(total * 0.02), pct: 2, icon: Plug, color: "#94A3B8" },
      ]
  return breakdown
}

// ── 30-day emissions ─────────────────────────────────────────────────────────

interface DayEmission {
  day: string
  scope1: number
  scope2: number
  offset: number
}

function getEmissionsHistory(site: EnergySiteDetail): DayEmission[] {
  const seed = hashStr(site.id)
  const days: DayEmission[] = []
  const base = site.carbonKg
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const label = `${d.getDate()}/${d.getMonth() + 1}`
    const variance = ((seed >> (i % 16)) & 0x7) - 3
    const weekend = d.getDay() === 0 || d.getDay() === 6
    const factor = weekend ? 0.65 : 1.0
    days.push({
      day: label,
      scope1: Math.round(base * 0.25 * factor + variance),
      scope2: Math.round(base * 0.65 * factor - variance),
      offset: Math.round(base * 0.15 * factor),
    })
  }
  return days
}

// ── Solar generation stats ───────────────────────────────────────────────────

interface SolarStats {
  capacity: number
  todayOutput: number
  monthlyOutput: number
  co2Avoided: number
  treesEquivalent: number
  utilization: number
  efficiency: number
  panels: number
  inverterStatus: "optimal" | "good" | "degraded"
}

function getSolarStats(site: EnergySiteDetail): SolarStats {
  const seed = hashStr(site.id)
  const capacity = 80 + (seed % 60)
  const todayOutput = site.solarKwh
  const monthlyOutput = Math.round(todayOutput * 28 + (seed % 200))
  const co2Avoided = Math.round(monthlyOutput * 0.82)
  const treesEquivalent = Math.round(co2Avoided / 21)
  const utilization = Math.round((todayOutput / (capacity * 5)) * 100)
  return {
    capacity,
    todayOutput,
    monthlyOutput,
    co2Avoided,
    treesEquivalent,
    utilization: Math.min(98, utilization),
    efficiency: 92 + (seed % 7),
    panels: 40 + (seed % 30),
    inverterStatus: utilization > 75 ? "optimal" : utilization > 55 ? "good" : "degraded",
  }
}

// ── Recommendations ──────────────────────────────────────────────────────────

interface Recommendation {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  estimatedSavings: string
  paybackMonths: number
  category: "solar" | "hvac" | "lighting" | "process" | "water"
}

function getRecommendations(site: EnergySiteDetail): Recommendation[] {
  const seed = hashStr(site.id)
  const base: Recommendation[] = [
    {
      id: "R1",
      title: "Expand rooftop solar capacity by 40 kW",
      description: "Roof survey shows 320 sqm of unused south-facing space. Adding 40 kW capacity would push solar share from current to 45%.",
      impact: "high",
      estimatedSavings: "₹2.4L/month",
      paybackMonths: 38,
      category: "solar",
    },
    {
      id: "R2",
      title: "Implement peak load shifting for HVAC",
      description: "Pre-cool facility by 2°C between 10:00-12:00 to reduce peak demand by 18%. BMS rule update required.",
      impact: "high",
      estimatedSavings: "₹85k/month",
      paybackMonths: 8,
      category: "hvac",
    },
    {
      id: "R3",
      title: "Replace T8 fluorescent with LED + occupancy sensors",
      description: "Remaining 240 T8 fixtures in warehouse zone C consume 32W each. LED retrofit at 14W with motion sensors.",
      impact: "medium",
      estimatedSavings: "₹18k/month",
      paybackMonths: 14,
      category: "lighting",
    },
    {
      id: "R4",
      title: "Recover rainwater for landscape & dock wash",
      description: "Rooftop catchment 1,800 sqm can capture 2.4M L/year. Reduces municipal water draw by 35%.",
      impact: "medium",
      estimatedSavings: "₹6k/month",
      paybackMonths: 22,
      category: "water",
    },
    {
      id: "R5",
      title: "Optimize conveyor idle shutdown timer",
      description: "Current idle timer set to 90s. Reducing to 30s with proximity-based wake saves 6% on equipment load.",
      impact: "low",
      estimatedSavings: "₹4k/month",
      paybackMonths: 4,
      category: "process",
    },
  ]
  // Deterministically pick 3-4 based on site
  return base.slice(0, 3 + (seed % 3))
}

// ── Component ────────────────────────────────────────────────────────────────

const recCategoryIcon = {
  solar: Sun,
  hvac: Wind,
  lighting: Lightbulb,
  process: Activity,
  water: Droplets,
} as const

const impactColor = {
  high: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30",
  medium: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
  low: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
} as const

const inverterStatusColor = {
  optimal: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  good: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  degraded: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
} as const

const chartConfig: ChartConfig = {
  total: { label: "Total", color: "#2563EB" },
  solar: { label: "Solar", color: "#F59E0B" },
  grid: { label: "Grid", color: "#94a3b8" },
  scope1: { label: "Scope 1", color: "#EF4444" },
  scope2: { label: "Scope 2", color: "#F59E0B" },
  offset: { label: "Offset", color: "#10B981" },
}

export function EnergyDetailDrawer({
  open,
  onOpenChange,
  site,
}: EnergyDetailDrawerProps) {
  const { toast } = useToast()

  const theme = site ? scoreTheme(site.efficiencyScore) : scoreTheme(0)
  const SiteIcon = site ? siteTypeIcon[site.type] : Warehouse

  const hourlyData = React.useMemo(() => (site ? getHourlyData(site) : []), [site])
  const applianceBreakdown = React.useMemo(() => (site ? getApplianceBreakdown(site) : []), [site])
  const emissionsHistory = React.useMemo(() => (site ? getEmissionsHistory(site) : []), [site])
  const solarStats = React.useMemo(() => (site ? getSolarStats(site) : null), [site])
  const recommendations = React.useMemo(() => (site ? getRecommendations(site) : []), [site])

  if (!site) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto" />
      </Sheet>
    )
  }

  const solarShare = Math.round((site.solarKwh / site.dailyKwh) * 100)
  const gridShare = 100 - solarShare
  const treesPerYear = Math.round((site.carbonKg * 365 * 0.15) / 21)

  const handleExport = () => {
    const csv = [
      `Energy & Sustainability Report - ${site.name}`,
      `Type,${site.type}`,
      `Daily kWh,${site.dailyKwh}`,
      `Solar kWh,${site.solarKwh}`,
      `Solar Share,${solarShare}%`,
      `Carbon (kg/day),${site.carbonKg}`,
      `Water (L/day),${site.waterL}`,
      `Waste Recycled,${site.wasteRecycledPct}%`,
      `Efficiency Score,${site.efficiencyScore}`,
      ``,
      `Appliance Breakdown:`,
      ...applianceBreakdown.map((a) => `${a.appliance},${a.kwh} kWh,${a.pct}%`),
      ``,
      `Recommendations:`,
      ...recommendations.map((r) => `${r.id}. [${r.impact}] ${r.title} — Savings: ${r.estimatedSavings}, Payback: ${r.paybackMonths}mo`),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `energy-${site.id}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Report exported", `energy-${site.id}.csv`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header */}
        <div className={cn(
          "energy-drawer-header relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border-b border-emerald-500/30",
          "shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]"
        )}>
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl" />
            <Sun className="absolute top-4 right-4 size-16 text-amber-500/30" />
          </div>
          <SheetHeader className="p-5 pb-4 relative">
            <div className="flex items-start gap-3">
              <div className="energy-icon-pulse size-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <SiteIcon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/40">
                    {site.type.replace("-", " ")}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px] font-bold", theme.text)}>
                    <Leaf className="size-2.5 mr-1" />
                    ESG Score {site.efficiencyScore}
                  </Badge>
                </div>
                <SheetTitle className="text-lg font-bold leading-tight">
                  {site.name}
                </SheetTitle>
                <SheetDescription className="text-xs mt-0.5 flex items-center gap-2">
                  {site.trend === "up" ? (
                    <><TrendingUp className="size-3 text-emerald-500" /> Improving</>
                  ) : site.trend === "down" ? (
                    <><TrendingDown className="size-3 text-red-500" /> Declining</>
                  ) : (
                    <><Activity className="size-3 text-muted-foreground" /> Stable</>
                  )}
                </SheetDescription>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="energy-stat-enter grid grid-cols-4 gap-2 mt-4">
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Daily kWh</p>
                <p className="text-sm font-bold text-number tabular-nums">{site.dailyKwh.toLocaleString("en-IN")}</p>
                <p className="text-[9px] text-muted-foreground">{(site.dailyKwh * 30).toLocaleString("en-IN")}/mo</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Solar Share</p>
                <p className="text-sm font-bold text-number tabular-nums text-amber-600 dark:text-amber-400">{solarShare}%</p>
                <p className="text-[9px] text-muted-foreground">{site.solarKwh} kWh</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Carbon</p>
                <p className="text-sm font-bold text-number tabular-nums text-red-600 dark:text-red-400">{site.carbonKg} kg</p>
                <p className="text-[9px] text-muted-foreground">~{Math.round(site.carbonKg * 365 / 1000)}T/yr</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Efficiency</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", theme.text)}>{site.efficiencyScore}</p>
                <p className="text-[9px] text-muted-foreground">/ 100</p>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="energy-drawer-body-enter p-5 space-y-5">
          {/* 24-hour consumption chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="size-3.5 text-muted-foreground" />
                24-Hour Energy Consumption
              </h3>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-blue-500" /> Grid</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-amber-500" /> Solar</span>
              </div>
            </div>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <AreaChart data={hourlyData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="hour" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="grid" stackId="1" stroke="#2563EB" strokeWidth={1.5} fill="url(#gridGrad)" />
                    <Area type="monotone" dataKey="solar" stackId="1" stroke="#F59E0B" strokeWidth={1.5} fill="url(#solarGrad)" />
                    <ReferenceLine x="12:00" stroke="#94a3b8" strokeDasharray="2 2" strokeWidth={0.5} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Appliance breakdown */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Gauge className="size-3.5 text-muted-foreground" />
              Appliance-Level Breakdown (Today)
            </h3>
            <Card className="border-border/40">
              <CardContent className="p-3 space-y-1.5">
                {applianceBreakdown.map((a, i) => {
                  const AIcon = a.icon
                  return (
                    <div
                      key={a.appliance}
                      className="energy-card-enter flex items-center gap-3 py-1.5 group"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="size-7 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${a.color}1A` }}>
                        <AIcon className="size-3.5" style={{ color: a.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs font-medium truncate">{a.appliance}</p>
                          <span className="text-xs font-semibold text-number tabular-nums shrink-0">{a.kwh} kWh</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={a.pct} className="h-1" />
                          <span className="text-[10px] text-muted-foreground w-8 text-right">{a.pct}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Solar generation stats */}
          {solarStats && (
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Sun className="size-3.5 text-amber-500" />
                Solar Generation Stats
              </h3>
              <Card className="border-border/40">
                <CardContent className="p-3">
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Capacity</p>
                      <p className="text-sm font-bold text-number">{solarStats.capacity} kWp</p>
                      <p className="text-[10px] text-muted-foreground">{solarStats.panels} panels</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Today</p>
                      <p className="text-sm font-bold text-number text-amber-600 dark:text-amber-400">{solarStats.todayOutput} kWh</p>
                      <p className="text-[10px] text-muted-foreground">{solarStats.utilization}% util</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">This Month</p>
                      <p className="text-sm font-bold text-number">{solarStats.monthlyOutput.toLocaleString("en-IN")} kWh</p>
                      <p className="text-[10px] text-muted-foreground">{solarStats.efficiency}% eff</p>
                    </div>
                  </div>
                  <Separator className="mb-3" />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <TreePine className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="font-semibold text-number">{solarStats.treesEquivalent}</p>
                        <p className="text-[10px] text-muted-foreground">trees equivalent/yr</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="size-4 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-semibold text-number">{solarStats.co2Avoided.toLocaleString("en-IN")} kg</p>
                        <p className="text-[10px] text-muted-foreground">CO₂ avoided/mo</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Inverter status:</span>
                    <Badge variant="outline" className={cn("text-[9px] uppercase", inverterStatusColor[solarStats.inverterStatus])}>
                      {solarStats.inverterStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 30-day emissions */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Flame className="size-3.5 text-red-500" />
              30-Day Carbon Emissions (Scope 1 + 2)
            </h3>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <ChartContainer config={chartConfig} className="h-[160px] w-full">
                  <BarChart data={emissionsHistory} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="day" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={5} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="scope1" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} barSize={6} />
                    <Bar dataKey="scope2" stackId="a" fill="#F59E0B" radius={[2, 2, 0, 0]} barSize={6} />
                  </BarChart>
                </ChartContainer>
                <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-red-500" /> Scope 1 (Direct)</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-amber-500" /> Scope 2 (Grid)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Water + waste */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border/40">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="size-4 text-blue-500" />
                  <h4 className="text-xs font-semibold">Water</h4>
                </div>
                <p className="text-xl font-bold text-number">{(site.waterL / 1000).toFixed(1)}k L</p>
                <p className="text-[10px] text-muted-foreground">today consumption</p>
                <Progress value={65} className="h-1 mt-2" />
              </CardContent>
            </Card>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Recycle className="size-4 text-emerald-500" />
                  <h4 className="text-xs font-semibold">Waste</h4>
                </div>
                <p className="text-xl font-bold text-number text-emerald-600 dark:text-emerald-400">{site.wasteRecycledPct}%</p>
                <p className="text-[10px] text-muted-foreground">diverted from landfill</p>
                <Progress value={site.wasteRecycledPct} className="h-1 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lightbulb className="size-3.5 text-amber-500" />
                AI Recommendations
              </h3>
              <Badge variant="outline" className="text-[9px]">
                <Award className="size-2.5 mr-1" />
                {recommendations.length} opportunities
              </Badge>
            </div>
            <div className="space-y-2">
              {recommendations.map((r, i) => {
                const RIcon = recCategoryIcon[r.category]
                return (
                  <div
                    key={r.id}
                    className="energy-card-enter rounded-lg border border-border/40 bg-background/60 p-3"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="size-7 rounded-md bg-amber-500/10 flex items-center justify-center shrink-0">
                          <RIcon className="size-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground leading-snug">{r.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{r.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-[9px] uppercase shrink-0", impactColor[r.impact])}>
                        {r.impact}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[10px] mt-2 pt-2 border-t border-border/30">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <TrendingDown className="size-2.5" />
                          {r.estimatedSavings}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="size-2.5" />
                          {r.paybackMonths}mo payback
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[10px] gap-1 px-2"
                        onClick={() => toast.success("Recommendation queued", r.title)}
                      >
                        Queue
                        <ChevronRight className="size-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="flex items-center gap-2 pb-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={handleExport}>
              <Download className="size-3.5" />
              Export Report
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => {
              toast.info("Scheduling audit", `ESG audit for ${site.name} scheduled`)
            }}>
              <Award className="size-3.5" />
              Schedule Audit
            </Button>
            <Button size="sm" className="gap-1.5 text-xs h-8 ml-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => {
              toast.success("Carbon offset purchased", `${site.carbonKg} kg CO₂ offset for ${site.name}`)
              onOpenChange(false)
            }}>
              <Leaf className="size-3.5" />
              Offset Carbon
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
