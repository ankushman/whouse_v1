"use client"

import { useState, useMemo, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Leaf,
  Zap,
  TreePine,
  Sun,
  Wind,
  Droplets,
  Recycle,
  TrendingDown,
  TrendingUp,
  Factory,
  Gauge,
  Activity,
  Award,
  Target,
  Cpu,
  Flame,
  Lightbulb,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { ExportButton } from "@/components/shared/export-button"
import {
  EnergyDetailDrawer,
  type EnergySiteDetail,
} from "@/components/shared/energy-detail-drawer"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// ── Types ────────────────────────────────────────────────────────────────────

interface EnergySite {
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

interface EnergyReading {
  hour: string
  consumption: number
  solar: number
  grid: number
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const energySites: EnergySite[] = [
  { id: "wh-mum", name: "Mumbai Hub", type: "hub", dailyKwh: 1840, solarKwh: 412, carbonKg: 920, waterL: 1240, wasteRecycledPct: 78, efficiencyScore: 82, trend: "up" },
  { id: "wh-del", name: "Delhi NCR", type: "warehouse", dailyKwh: 1620, solarKwh: 285, carbonKg: 810, waterL: 980, wasteRecycledPct: 71, efficiencyScore: 76, trend: "stable" },
  { id: "wh-blr", name: "Bangalore", type: "warehouse", dailyKwh: 1480, solarKwh: 528, carbonKg: 612, waterL: 720, wasteRecycledPct: 88, efficiencyScore: 91, trend: "up" },
  { id: "wh-che", name: "Chennai Hub", type: "hub", dailyKwh: 1750, solarKwh: 396, carbonKg: 875, waterL: 1180, wasteRecycledPct: 74, efficiencyScore: 79, trend: "down" },
  { id: "wh-pun", name: "Pune Warehouse", type: "cold-storage", dailyKwh: 2120, solarKwh: 312, carbonKg: 1060, waterL: 1520, wasteRecycledPct: 68, efficiencyScore: 71, trend: "down" },
  { id: "wh-kol", name: "Kolkata Depot", type: "cross-dock", dailyKwh: 920, solarKwh: 142, carbonKg: 460, waterL: 540, wasteRecycledPct: 82, efficiencyScore: 85, trend: "up" },
]

const hourlyData: EnergyReading[] = Array.from({ length: 24 }, (_, h) => {
  const baseConsumption = 60 + Math.sin((h - 6) * 0.4) * 35 + (h >= 8 && h <= 18 ? 20 : 0)
  const solarGeneration = h >= 6 && h <= 18 ? Math.sin((h - 6) * 0.26) * 45 : 0
  return {
    hour: `${String(h).padStart(2, "0")}:00`,
    consumption: Math.round(baseConsumption + Math.random() * 8),
    solar: Math.max(0, Math.round(solarGeneration)),
    grid: Math.max(0, Math.round(baseConsumption - solarGeneration)),
  }
})

const carbonTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (29 - i))
  return {
    date: `${d.getDate()}/${d.getMonth() + 1}`,
    scope1: Math.round(820 + Math.sin(i * 0.3) * 80 + i * -2),
    scope2: Math.round(1240 + Math.sin(i * 0.4) * 120 + i * -4),
    offset: Math.round(180 + i * 4),
  }
})

const energySourceMix = [
  { name: "Grid (Coal-heavy)", value: 58, color: "hsl(var(--chart-5))" },
  { name: "Solar (Rooftop)", value: 22, color: "hsl(var(--chart-1))" },
  { name: "Grid (Renewable)", value: 14, color: "hsl(var(--chart-2))" },
  { name: "Diesel (Backup)", value: 6, color: "hsl(var(--chart-4))" },
]

const esgKpis = [
  { id: "e", label: "Energy Intensity", value: "4.82", unit: "kWh/m²", change: -8.4, target: "≤4.5", icon: Zap, status: "warning" as const },
  { id: "c", label: "Carbon Footprint", value: "4,820", unit: "kg CO₂e/day", change: -12.1, target: "≤4,500", icon: Leaf, status: "warning" as const },
  { id: "w", label: "Water Reuse", value: "34", unit: "%", change: 6.2, target: "≥40%", icon: Droplets, status: "warning" as const },
  { id: "r", label: "Waste Diversion", value: "78", unit: "%", change: 4.8, target: "≥85%", icon: Recycle, status: "warning" as const },
  { id: "s", label: "Renewable Share", value: "22", unit: "%", change: 38.5, target: "≥50% by 2027", icon: Sun, status: "info" as const },
  { id: "cert", label: "LEED Sites", value: "2/6", unit: "certified", change: 0, target: "All by 2028", icon: Award, status: "info" as const },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function EnergySustainabilityView() {
  const { toast } = useToast()
  const [selectedSite, setSelectedSite] = useState<EnergySite | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])

  const totals = useMemo(() => {
    return energySites.reduce(
      (acc, s) => ({
        kwh: acc.kwh + s.dailyKwh,
        solar: acc.solar + s.solarKwh,
        carbon: acc.carbon + s.carbonKg,
        water: acc.water + s.waterL,
        recycled: acc.recycled + s.wasteRecycledPct,
      }),
      { kwh: 0, solar: 0, carbon: 0, water: 0, recycled: 0 }
    )
  }, [])

  const avgEfficiency = Math.round(
    energySites.reduce((s, x) => s + x.efficiencyScore, 0) / energySites.length
  )

  const renewableShare = Math.round((totals.solar / totals.kwh) * 100)
  const carbonPerUnit = (totals.carbon / 1000).toFixed(2)
  const treesEquivalent = Math.round(totals.carbon / 21) // 1 tree absorbs ~21 kg CO₂/yr

  const handleOptimize = () => {
    toast.success("Optimization queued", "AI energy optimizer analyzing load-shifting opportunities")
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader
        title="Energy & Sustainability"
        description={`ESG dashboard · Real-time monitoring across ${energySites.length} sites · ${new Date(now).toLocaleTimeString("en-IN")}`}
        actions={
          <>
            <ExportButton
              data={energySites}
              filename="energy-sustainability"
              label="Export"
            />
            <Button
              size="sm"
              onClick={handleOptimize}
              className="btn-press focus-ring-primary energy-btn-gradient"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Optimize
            </Button>
          </>
        }
      />

      {/* Hero ESG metrics */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {esgKpis.map((kpi) => {
          const Icon = kpi.icon
          const isImproving = kpi.change < 0 || (kpi.label === "Water Reuse" || kpi.label === "Waste Diversion" || kpi.label === "Renewable Share") && kpi.change > 0
          return (
            <Card key={kpi.id} className="esg-kpi-card kpi-card-tilt overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  {kpi.change !== 0 && (
                    <span
                      className={cn(
                        "text-[10px] flex items-center gap-0.5 font-medium",
                        isImproving ? "text-emerald-500" : "text-amber-500"
                      )}
                    >
                      {kpi.change > 0 ? (
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      ) : (
                        <ArrowDownRight className="h-2.5 w-2.5" />
                      )}
                      {Math.abs(kpi.change)}%
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground uppercase tracking-wide">{kpi.label}</div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-xl font-bold">{kpi.value}</span>
                  <span className="text-[10px] text-muted-foreground">{kpi.unit}</span>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">Target: {kpi.target}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Top summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="energy-card-hero overflow-hidden">
          <CardContent className="p-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <Zap className="h-5 w-5 text-amber-500" />
                <Badge variant="outline" className="text-[10px]">
                  <Activity className="h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" />
                  Live
                </Badge>
              </div>
              <div className="mt-2 text-3xl font-bold">{totals.kwh.toLocaleString("en-IN")}</div>
              <div className="text-xs text-muted-foreground">kWh consumed today</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-md bg-amber-500/10">
                  <div className="text-[10px] text-muted-foreground uppercase">Grid</div>
                  <div className="font-semibold">{(totals.kwh - totals.solar).toLocaleString("en-IN")} kWh</div>
                </div>
                <div className="p-2 rounded-md bg-emerald-500/10">
                  <div className="text-[10px] text-muted-foreground uppercase">Solar</div>
                  <div className="font-semibold text-emerald-600">{totals.solar.toLocaleString("en-IN")} kWh</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="carbon-card-hero overflow-hidden">
          <CardContent className="p-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <Leaf className="h-5 w-5 text-emerald-500" />
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 text-[10px]">
                  <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                  -12%
                </Badge>
              </div>
              <div className="mt-2 text-3xl font-bold">{(totals.carbon / 1000).toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">tCO₂e emitted today</div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <TreePine className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-muted-foreground">
                  Equivalent to <span className="font-semibold text-foreground">{treesEquivalent.toLocaleString("en-IN")}</span> trees/yr offset
                </span>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                Net-zero target: 2032 · {Math.round((1 - totals.carbon / 6000) * 100)}% pathway
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="water-card-hero overflow-hidden">
          <CardContent className="p-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <Droplets className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-[10px]">
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5 text-emerald-500" />
                  +6%
                </Badge>
              </div>
              <div className="mt-2 text-3xl font-bold">{(totals.water / 1000).toFixed(1)}k</div>
              <div className="text-xs text-muted-foreground">Liters consumed today</div>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reuse rate</span>
                  <span className="font-semibold">34%</span>
                </div>
                <Progress value={34} className="h-1" />
                <div className="text-[10px] text-muted-foreground">Rainwater harvesting at 4/6 sites</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="efficiency-card-hero overflow-hidden">
          <CardContent className="p-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <Gauge className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="text-[10px]">6 sites</Badge>
              </div>
              <div className="mt-2 text-3xl font-bold">{avgEfficiency}%</div>
              <div className="text-xs text-muted-foreground">Avg efficiency score</div>
              <ChartContainer config={{}} className="h-[60px] w-full mt-2">
                <RadialBarChart
                  innerRadius="65%"
                  outerRadius="100%"
                  data={[{ value: avgEfficiency, fill: "hsl(var(--primary))" }]}
                  startAngle={90}
                  endAngle={90 - (avgEfficiency / 100) * 360}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" background cornerRadius={6} />
                </RadialBarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy consumption chart + source mix */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Hourly Energy Consumption — Today
            </CardTitle>
            <CardDescription>Total consumption vs. solar generation vs. grid draw (kWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ consumption: { label: "Total" }, solar: { label: "Solar" }, grid: { label: "Grid" } }}
              className="h-[260px] w-full"
            >
              <AreaChart data={hourlyData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="consArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="solarArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={2} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="consumption" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#consArea)" />
                <Area type="monotone" dataKey="solar" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#solarArea)" />
                <Line type="monotone" dataKey="grid" stroke="hsl(var(--chart-4))" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              Energy Source Mix
            </CardTitle>
            <CardDescription>Today's renewable share: {renewableShare}%</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[200px] w-full">
              <PieChart>
                <Pie
                  data={energySourceMix}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  stroke="none"
                >
                  {energySourceMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-3 space-y-1.5">
              {energySourceMix.map((src) => (
                <div key={src.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: src.color }} />
                    <span className="text-muted-foreground">{src.name}</span>
                  </span>
                  <span className="font-semibold">{src.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carbon trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-500" />
            Carbon Emissions — Last 30 Days
          </CardTitle>
          <CardDescription>
            Scope 1 (direct) + Scope 2 (purchased electricity) + Carbon offsets applied
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ scope1: { label: "Scope 1" }, scope2: { label: "Scope 2" }, offset: { label: "Offset" } }}
            className="h-[260px] w-full"
          >
            <BarChart data={carbonTrend} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={3} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="scope1" stackId="a" fill="hsl(var(--chart-5))" radius={[0, 0, 0, 0]} />
              <Bar dataKey="scope2" stackId="a" fill="hsl(var(--chart-4))" radius={[3, 3, 0, 0]} />
              <Line type="monotone" dataKey="offset" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            </BarChart>
          </ChartContainer>
          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-md bg-muted/40 p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Net Carbon</div>
              <div className="font-semibold mt-0.5">{carbonPerUnit} tCO₂e/day</div>
            </div>
            <div className="rounded-md bg-muted/40 p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Carbon Intensity</div>
              <div className="font-semibold mt-0.5">0.18 kg/unit shipped</div>
            </div>
            <div className="rounded-md bg-emerald-500/5 p-2">
              <div className="text-[10px] text-emerald-600 uppercase">Offset Coverage</div>
              <div className="font-semibold mt-0.5 text-emerald-600">12.4% of emissions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Factory className="h-4 w-4 text-primary" />
            Site-Level Energy Performance
          </CardTitle>
          <CardDescription>Click any site to see detailed energy breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {energySites.map((site) => (
              <Card
                key={site.id}
                className={cn(
                  "site-energy-card cursor-pointer energy-card-tilt",
                  selectedSite?.id === site.id && "ring-2 ring-primary"
                )}
                onClick={() => {
                  setSelectedSite(site)
                  setDrawerOpen(true)
                }}
              >
                <CardContent className="p-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold">{site.name}</div>
                      <Badge variant="outline" className="text-[10px] mt-0.5 capitalize">{site.type.replace("-", " ")}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {site.trend === "up" ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      ) : site.trend === "down" ? (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                      ) : (
                        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className={cn(
                        "text-xs font-semibold",
                        site.efficiencyScore >= 85 ? "text-emerald-600" : site.efficiencyScore >= 75 ? "text-amber-600" : "text-destructive"
                      )}>
                        {site.efficiencyScore}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                        <Zap className="h-2.5 w-2.5" /> Energy
                      </div>
                      <div className="font-semibold mt-0.5">{site.dailyKwh.toLocaleString("en-IN")} kWh</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                        <Sun className="h-2.5 w-2.5" /> Solar
                      </div>
                      <div className="font-semibold mt-0.5 text-emerald-600">
                        {Math.round((site.solarKwh / site.dailyKwh) * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                        <Leaf className="h-2.5 w-2.5" /> Carbon
                      </div>
                      <div className="font-semibold mt-0.5">{site.carbonKg} kg</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                        <Recycle className="h-2.5 w-2.5" /> Recycled
                      </div>
                      <div className="font-semibold mt-0.5">{site.wasteRecycledPct}%</div>
                    </div>
                  </div>
                  <Progress value={site.efficiencyScore} className="h-1 mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedSite && (
            <div className="mt-4 p-4 rounded-lg border bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{selectedSite.name} — Recommendations</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setSelectedSite(null)}
                >
                  Close
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-md bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-600">
                    <Flame className="h-3.5 w-3.5" /> Peak Load Shifting
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Shift chiller pre-cooling to 11:00–13:00 (solar peak). Estimated savings: 18 kWh/day.
                  </p>
                </div>
                <div className="p-3 rounded-md bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                    <Sun className="h-3.5 w-3.5" /> Solar Expansion
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Rooftop capacity can be expanded 40% with structural reinforcement. ROI: 3.2 years.
                  </p>
                </div>
                <div className="p-3 rounded-md bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
                    <Droplets className="h-3.5 w-3.5" /> Water Reuse
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Install greywater recycling for landscape irrigation. Estimated 240L/day savings.
                  </p>
                </div>
                <div className="p-3 rounded-md bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-center gap-2 text-xs font-medium text-purple-600">
                    <Wind className="h-3.5 w-3.5" /> HVAC Optimization
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Adjust setpoint by +1°C during 14:00–17:00. Comfort-neutral, saves 8 kWh/day.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sustainability targets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Net-Zero Roadmap
          </CardTitle>
          <CardDescription>Progress toward 2032 carbon neutrality commitment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { year: "2024", target: "Baseline established", done: true, pct: 100 },
              { year: "2025", target: "20% renewable share", done: true, pct: 100 },
              { year: "2026", target: "35% renewable + 15% EV fleet", done: false, pct: 65, current: true },
              { year: "2028", target: "60% renewable + LEED all sites", done: false, pct: 0 },
              { year: "2030", target: "85% renewable + 50% EV fleet", done: false, pct: 0 },
              { year: "2032", target: "Net-zero operations", done: false, pct: 0 },
            ].map((m) => (
              <div
                key={m.year}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  m.current && "border-primary/40 bg-primary/5",
                  !m.current && !m.done && "opacity-60"
                )}
              >
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    m.done && "bg-emerald-500 text-white",
                    m.current && "bg-primary text-primary-foreground animate-pulse-subtle",
                    !m.done && !m.current && "bg-muted text-muted-foreground"
                  )}
                >
                  {m.year.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{m.year}</span>
                    {m.current && (
                      <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                        IN PROGRESS
                      </Badge>
                    )}
                    {m.done && (
                      <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600">
                        ACHIEVED
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{m.target}</div>
                  {(m.current || m.done) && (
                    <Progress value={m.pct} className="h-1 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EnergyDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        site={selectedSite}
      />
    </div>
  )
}
