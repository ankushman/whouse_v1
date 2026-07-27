"use client"

import { useState, useMemo, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  Waves,
  CircuitBoard,
  RefreshCw,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { ExportButton } from "@/components/shared/export-button"
import {
  PredictiveDetailDrawer,
  type PredictiveAnomaly,
} from "@/components/shared/predictive-detail-drawer"
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// ── Types ────────────────────────────────────────────────────────────────────

interface ForecastPoint {
  date: string
  actual: number | null
  forecast: number | null
  lowerBound: number | null
  upperBound: number | null
}

interface Anomaly {
  id: string
  metric: string
  warehouse: string
  severity: "critical" | "warning" | "info"
  expected: number
  observed: number
  deviationPct: number
  detectedAt: string
  description: string
  recommendation: string
}

interface PredictiveKPI {
  id: string
  label: string
  icon: typeof Brain
  currentValue: number
  predictedValue: number
  unit: string
  changePct: number
  confidence: number
  trend: "up" | "down" | "stable"
  insight: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const forecastData: ForecastPoint[] = (() => {
  const today = new Date()
  const points: ForecastPoint[] = []
  for (let i = -14; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const label = `${d.getDate()}/${d.getMonth() + 1}`
    const isHistorical = i <= 0
    const isToday = i === 0
    const base = 4200 + Math.sin(i * 0.4) * 350 + i * 18
    const noise = (Math.random() - 0.5) * 180
    const actual = isHistorical ? Math.round(base + noise) : null
    const forecast = isToday ? Math.round(base) : isHistorical ? null : Math.round(base + i * 5)
    const spread = 80 + Math.abs(i) * 12
    points.push({
      date: label,
      actual,
      forecast,
      lowerBound: forecast != null ? forecast - spread : null,
      upperBound: forecast != null ? forecast + spread : null,
    })
  }
  return points
})()

const anomalies: Anomaly[] = [
  {
    id: "AN-001",
    metric: "Inbound Throughput",
    warehouse: "Mumbai Hub",
    severity: "critical",
    expected: 245,
    observed: 168,
    deviationPct: -31.4,
    detectedAt: "12 min ago",
    description: "Sudden 31% drop in inbound throughput vs. expected baseline. Pattern matches staffing shortage signature.",
    recommendation: "Deploy 3 additional forklift operators from cross-trained pool. ETA restoration: 45 min.",
  },
  {
    id: "AN-002",
    metric: "Order Cycle Time",
    warehouse: "Delhi NCR",
    severity: "warning",
    expected: 38,
    observed: 52,
    deviationPct: 36.8,
    detectedAt: "28 min ago",
    description: "Order cycle time trending above 1.5σ threshold for 3 consecutive hours.",
    recommendation: "Investigate pick path optimization. Reorder velocity bin suggests ABC reclassification.",
  },
  {
    id: "AN-003",
    metric: "Dock Utilization",
    warehouse: "Chennai Hub",
    severity: "warning",
    expected: 72,
    observed: 91,
    deviationPct: 26.4,
    detectedAt: "1 hr ago",
    description: "Dock utilization peaked above 90% — risk of congestion cascade in next 2 hours.",
    recommendation: "Reroute 2 inbound trucks to secondary dock. Activate overflow staging lane B.",
  },
  {
    id: "AN-004",
    metric: "Energy Consumption",
    warehouse: "Pune Warehouse",
    severity: "info",
    expected: 182,
    observed: 198,
    deviationPct: 8.8,
    detectedAt: "2 hr ago",
    description: "Energy draw slightly above baseline. Correlated with extended chiller runtime.",
    recommendation: "Inspect chiller defrost cycle. Schedule HVAC maintenance window.",
  },
  {
    id: "AN-005",
    metric: "Pick Accuracy",
    warehouse: "Kolkata Depot",
    severity: "critical",
    expected: 99.6,
    observed: 97.2,
    deviationPct: -2.4,
    detectedAt: "3 hr ago",
    description: "Pick accuracy fell below SLA threshold. Cluster of errors in SKU 4xxx range.",
    recommendation: "Verify barcode label integrity on SKU 4100-4199. Retrain picker on bay C-12.",
  },
]

const predictiveKPIs: PredictiveKPI[] = [
  {
    id: "kpi-1",
    label: "Tomorrow's Throughput",
    icon: Activity,
    currentValue: 4582,
    predictedValue: 4891,
    unit: "units",
    changePct: 6.7,
    confidence: 0.91,
    trend: "up",
    insight: "Upward trend driven by scheduled Maruti production ramp-up.",
  },
  {
    id: "kpi-2",
    label: "Week's Labor Need",
    icon: Target,
    currentValue: 312,
    predictedValue: 348,
    unit: "hrs",
    changePct: 11.5,
    confidence: 0.86,
    trend: "up",
    insight: "Diwali demand surge forecasted. Add 1 shift Thursday/Friday.",
  },
  {
    id: "kpi-3",
    label: "Inventory Carrying Cost",
    icon: Gauge,
    currentValue: 18.4,
    predictedValue: 16.9,
    unit: "₹L",
    changePct: -8.2,
    confidence: 0.78,
    trend: "down",
    insight: "Decline expected after SKU rationalization completes Week 47.",
  },
  {
    id: "kpi-4",
    label: "On-Time Delivery Rate",
    icon: Zap,
    currentValue: 94.2,
    predictedValue: 96.1,
    unit: "%",
    changePct: 2.0,
    confidence: 0.93,
    trend: "up",
    insight: "Route optimization rollout showing sustained improvement.",
  },
]

const scenarioData = [
  { scenario: "Baseline", throughput: 4582, cost: 142, sla: 94.2 },
  { scenario: "Optimistic", throughput: 5120, cost: 138, sla: 96.8 },
  { scenario: "Pessimistic", throughput: 4010, cost: 156, sla: 89.5 },
  { scenario: "Stress Test", throughput: 3650, cost: 168, sla: 84.1 },
]

const modelMetrics = [
  { label: "Model Accuracy (MAPE)", value: "4.2%", trend: "down" as const, hint: "Lower is better" },
  { label: "R² Score", value: "0.91", trend: "up" as const, hint: "Variance explained" },
  { label: "Training Data Points", value: "84.2K", trend: "up" as const, hint: "Last 90 days" },
  { label: "Prediction Latency", value: "127ms", trend: "down" as const, hint: "P95 inference time" },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function PredictiveAnalyticsView() {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState("forecast")
  const [refreshing, setRefreshing] = useState(false)
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      toast.success("Forecasts refreshed", "Latest model run loaded successfully")
    }, 1200)
  }

  const handleAckAnomaly = (a: Anomaly) => {
    toast.info("Anomaly acknowledged", `${a.metric} at ${a.warehouse} marked for action`)
  }

  const criticalCount = useMemo(() => anomalies.filter((a) => a.severity === "critical").length, [])
  const warningCount = useMemo(() => anomalies.filter((a) => a.severity === "warning").length, [])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader
        title="Predictive Analytics"
        description={`AI-driven forecasts, anomaly detection & scenario planning · Updated ${new Date(now).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
        actions={
          <>
            <ExportButton
              data={anomalies}
              filename="predictive-anomalies"
              label="Export"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-press focus-ring-primary"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
              Refresh
            </Button>
          </>
        }
      />

      {/* Hero KPI row */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {predictiveKPIs.map((kpi) => (
          <PredictiveKPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Anomaly summary strip */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        <Card className="predictive-card-glow predictive-critical-glow overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Critical Anomalies</div>
              <div className="text-3xl font-bold text-destructive mt-1 animate-pulse-subtle">{criticalCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Require immediate action</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="predictive-card-glow predictive-warning-glow overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Warnings</div>
              <div className="text-3xl font-bold text-amber-500 mt-1">{warningCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Monitor closely</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="predictive-card-glow predictive-info-glow overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Model Confidence</div>
              <div className="text-3xl font-bold text-emerald-500 mt-1">87%</div>
              <div className="text-xs text-muted-foreground mt-1">Across all forecasts</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="forecast" className="text-xs">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="text-xs">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            Anomalies
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="text-xs">
            <Waves className="h-3.5 w-3.5 mr-1.5" />
            Scenarios
          </TabsTrigger>
          <TabsTrigger value="model" className="text-xs">
            <CircuitBoard className="h-3.5 w-3.5 mr-1.5" />
            Model
          </TabsTrigger>
        </TabsList>

        {/* FORECAST TAB */}
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Throughput Forecast — Next 14 Days
              </CardTitle>
              <CardDescription>
                Historical actuals (solid) + ML forecast (dashed) with 80% confidence interval shading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ actual: { label: "Actual" }, forecast: { label: "Forecast" } }}
                className="h-[320px] w-full"
              >
                <AreaChart data={forecastData} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ciBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="actualArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ReferenceArea
                    x1={forecastData[14]?.date}
                    x2={forecastData[28]?.date}
                    fill="hsl(var(--primary))"
                    fillOpacity={0.04}
                  />
                  <ReferenceLine x={forecastData[14]?.date} stroke="hsl(var(--border))" strokeDasharray="4 4" />
                  <Area
                    type="monotone"
                    dataKey="upperBound"
                    stroke="none"
                    fill="url(#ciBand)"
                    connectNulls
                  />
                  <Area
                    type="monotone"
                    dataKey="lowerBound"
                    stroke="none"
                    fill="hsl(var(--background))"
                    connectNulls
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#actualArea)"
                    connectNulls
                    dot={{ r: 2, fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    connectNulls
                    dot={{ r: 2, fill: "hsl(var(--primary))", fillOpacity: 0.5 }}
                  />
                </AreaChart>
              </ChartContainer>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-4 rounded bg-primary" /> Actual (historical)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-primary" style={{ backgroundImage: "linear-gradient(to right, hsl(var(--primary)) 50%, transparent 50%)", backgroundSize: "6px 1px" }} /> Forecast
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-4 rounded bg-primary/20" /> 80% confidence band
                </span>
                <span className="ml-auto flex items-center gap-1 text-primary">
                  <Sparkles className="h-3 w-3" />
                  SARIMA(2,1,2) + exogenous regressors
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANOMALIES TAB */}
        <TabsContent value="anomalies" className="space-y-3">
          {anomalies.map((a) => (
            <Card
              key={a.id}
              className={cn(
                "anomaly-card-hover cursor-pointer",
                a.severity === "critical" && "border-destructive/40",
                a.severity === "warning" && "border-amber-500/40",
                selectedAnomaly?.id === a.id && "ring-2 ring-primary"
              )}
              onClick={() => {
                setSelectedAnomaly(a)
                setDrawerOpen(true)
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                        a.severity === "critical" && "bg-destructive/10 text-destructive",
                        a.severity === "warning" && "bg-amber-500/10 text-amber-500",
                        a.severity === "info" && "bg-blue-500/10 text-blue-500"
                      )}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-foreground truncate">{a.metric}</h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] py-0 px-1.5",
                            a.severity === "critical" && "border-destructive/40 text-destructive",
                            a.severity === "warning" && "border-amber-500/40 text-amber-600",
                            a.severity === "info" && "border-blue-500/40 text-blue-600"
                          )}
                        >
                          {a.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">· {a.warehouse}</span>
                        <span className="text-xs text-muted-foreground/70">· {a.detectedAt}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{a.description}</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded-md bg-muted/40 px-2 py-1.5">
                          <div className="text-muted-foreground text-[10px] uppercase">Expected</div>
                          <div className="font-semibold mt-0.5">{a.expected}</div>
                        </div>
                        <div className="rounded-md bg-muted/40 px-2 py-1.5">
                          <div className="text-muted-foreground text-[10px] uppercase">Observed</div>
                          <div className="font-semibold mt-0.5">{a.observed}</div>
                        </div>
                        <div
                          className={cn(
                            "rounded-md px-2 py-1.5",
                            a.deviationPct > 0 ? "bg-amber-500/10" : "bg-destructive/10"
                          )}
                        >
                          <div className="text-muted-foreground text-[10px] uppercase">Deviation</div>
                          <div
                            className={cn(
                              "font-semibold mt-0.5 flex items-center gap-0.5",
                              a.deviationPct > 0 ? "text-amber-600" : "text-destructive"
                            )}
                          >
                            {a.deviationPct > 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(a.deviationPct)}%
                          </div>
                        </div>
                      </div>
                      {selectedAnomaly?.id === a.id && (
                        <div className="mt-3 p-3 rounded-md bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="text-[10px] uppercase tracking-wider text-primary font-medium">
                            <Sparkles className="inline h-3 w-3 mr-1" />
                            AI Recommendation
                          </div>
                          <p className="mt-1 text-xs text-foreground leading-relaxed">{a.recommendation}</p>
                          <Button
                            size="sm"
                            className="mt-2 h-7 text-xs btn-press focus-ring-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAckAnomaly(a)
                            }}
                          >
                            Acknowledge
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                      selectedAnomaly?.id === a.id && "rotate-90"
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* SCENARIOS TAB */}
        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Waves className="h-4 w-4 text-primary" />
                Scenario Impact Analysis
              </CardTitle>
              <CardDescription>What-if analysis across 4 operating scenarios (next 7 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ChartContainer config={{}} className="h-[260px] w-full">
                  <BarChart data={scenarioData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="scenario" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="throughput" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
                <div className="space-y-2">
                  {scenarioData.map((s) => (
                    <div key={s.scenario} className="rounded-lg border bg-card p-3 scenario-card-hover">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{s.scenario}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            s.scenario === "Optimistic" && "border-emerald-500/40 text-emerald-600",
                            s.scenario === "Pessimistic" && "border-amber-500/40 text-amber-600",
                            s.scenario === "Stress Test" && "border-destructive/40 text-destructive"
                          )}
                        >
                          SLA {s.sla}%
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-muted-foreground text-[10px] uppercase">Throughput</div>
                          <div className="font-semibold">{s.throughput.toLocaleString("en-IN")} u</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-[10px] uppercase">Cost/Unit</div>
                          <div className="font-semibold">₹{s.cost}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODEL TAB */}
        <TabsContent value="model" className="space-y-4">
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {modelMetrics.map((m) => (
              <Card key={m.label} className="model-metric-card overflow-hidden">
                <CardContent className="p-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                  <div className="text-2xl font-bold mt-1 flex items-center gap-1">
                    {m.value}
                    {m.trend === "up" ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-emerald-500" />
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">{m.hint}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CircuitBoard className="h-4 w-4 text-primary" />
                Model Architecture
              </CardTitle>
              <CardDescription>Ensemble of statistical + gradient-boosted models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Layer 1 — SARIMA(2,1,2)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Seasonal autoregressive component for daily/weekly seasonality. Captures recurring dock-arrival patterns.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Layer 2 — XGBoost Regressor</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Captures non-linear interactions between 24 exogenous features (weather, holidays, upstream signals).
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Layer 3 — Bayesian Anomaly Detector</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Maintains rolling 14-day distribution per metric. Flags observations beyond 1.5σ (warning) / 2.5σ (critical).
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PredictiveDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        anomaly={selectedAnomaly}
        onAcknowledge={(a) => {
          toast.info("Anomaly acknowledged", `${a.metric} at ${a.warehouse}`)
        }}
        onResolve={(a) => {
          toast.success("Anomaly resolved", `${a.metric} marked as resolved`)
          setSelectedAnomaly(null)
        }}
      />
    </div>
  )
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function PredictiveKPICard({ kpi }: { kpi: PredictiveKPI }) {
  const Icon = kpi.icon
  const isUp = kpi.trend === "up"
  const isPositive = (isUp && kpi.changePct > 0) || (!isUp && kpi.changePct < 0)

  return (
    <Card className="predictive-kpi-card kpi-card-tilt overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px]",
              isPositive ? "border-emerald-500/40 text-emerald-600" : "border-amber-500/40 text-amber-600"
            )}
          >
            {isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {Math.abs(kpi.changePct)}%
          </Badge>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">{kpi.label}</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight">{kpi.predictedValue.toLocaleString("en-IN")}</span>
          <span className="text-xs text-muted-foreground">{kpi.unit}</span>
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground line-through">
          Now: {kpi.currentValue.toLocaleString("en-IN")} {kpi.unit}
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <Progress value={kpi.confidence * 100} className="h-1" />
          <span className="text-[10px] text-muted-foreground shrink-0">{Math.round(kpi.confidence * 100)}%</span>
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground">Confidence</div>
        <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{kpi.insight}</p>
      </CardContent>
    </Card>
  )
}
