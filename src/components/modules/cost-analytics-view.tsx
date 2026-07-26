"use client"

import { useMemo, useCallback, useState } from "react"
import { costTrend } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { CostDetailDrawer, type CostCategory } from "@/components/shared/cost-detail-drawer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { AreaChart, BarChart, Bar, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Fuel,
  Wrench,
  Warehouse,
} from "lucide-react"
import { cn } from "@/lib/utils"

const costChartConfig = {
  labor: { label: "Labor", color: "#2563EB" },
  transport: { label: "Transport", color: "#10B981" },
  equipment: { label: "Equipment", color: "#F59E0B" },
  storage: { label: "Storage", color: "#8B5CF6" },
}

const pieConfig = {
  labor: { label: "Labor", color: "#2563EB" },
  transport: { label: "Transport", color: "#10B981" },
  equipment: { label: "Equipment", color: "#F59E0B" },
  storage: { label: "Storage", color: "#8B5CF6" },
}

const PIE_COLORS = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6"]

export function CostAnalyticsView() {
  const latest = costTrend.length > 1 ? costTrend[costTrend.length - 1] : null
  const previous = costTrend.length > 1 ? costTrend[costTrend.length - 2] : null
  const [drawerCategory, setDrawerCategory] = useState<CostCategory | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMonth, setDrawerMonth] = useState<string | undefined>(undefined)

  const openCostDrawer = useCallback((cat: CostCategory, month?: string) => {
    setDrawerCategory(cat)
    setDrawerMonth(month)
    setDrawerOpen(true)
  }, [])

  const categoryBreakdown = useMemo(() => {
    if (!latest) return []
    return [
      { name: "Labor", value: latest.labor, color: PIE_COLORS[0] },
      { name: "Transport", value: latest.transport, color: PIE_COLORS[1] },
      { name: "Equipment", value: latest.equipment, color: PIE_COLORS[2] },
      { name: "Storage", value: latest.storage, color: PIE_COLORS[3] },
    ]
  }, [latest])

  const momComparison = useMemo(() =>
    costTrend.slice(-6).map((entry, idx, arr) => {
      const prev = idx > 0 ? arr[idx - 1] : entry
      return {
        month: entry.month,
        labor: entry.labor,
        transport: entry.transport,
        equipment: entry.equipment,
        storage: entry.storage,
        total: entry.total,
        // Bug C1 fix: guard against division by zero (prev.labor/transport/etc could be 0).
        laborChange: idx > 0 && prev.labor !== 0 ? +((entry.labor - prev.labor) / prev.labor * 100).toFixed(1) : 0,
        transportChange: idx > 0 && prev.transport !== 0 ? +((entry.transport - prev.transport) / prev.transport * 100).toFixed(1) : 0,
        equipmentChange: idx > 0 && prev.equipment !== 0 ? +((entry.equipment - prev.equipment) / prev.equipment * 100).toFixed(1) : 0,
        storageChange: idx > 0 && prev.storage !== 0 ? +((entry.storage - prev.storage) / prev.storage * 100).toFixed(1) : 0,
        totalChange: idx > 0 && prev.total !== 0 ? +((entry.total - prev.total) / prev.total * 100).toFixed(1) : 0,
      }
    }), [])

  const handleExportCSV = useCallback(() => {
    const data = costTrend.map((entry) => ({
      Month: entry.month,
      Labor: `₹${(entry.labor / 1000).toFixed(0)}K`,
      Transport: `₹${(entry.transport / 1000).toFixed(0)}K`,
      Equipment: `₹${(entry.equipment / 1000).toFixed(0)}K`,
      Storage: `₹${(entry.storage / 1000).toFixed(0)}K`,
      Total: `₹${(entry.total / 1000).toFixed(0)}K`,
    }))
    exportToCSV(data, "cost-analytics", ["Month", "Labor", "Transport", "Equipment", "Storage", "Total"])
  }, [])

  if (!latest || !previous) return null

  const totalCostThisMonth = latest.total
  const totalCostLastMonth = previous.total
  // Bug C1 fix: guard against division by zero when previous month's total was 0.
  // Previously: 0 base → Infinity → "Infinity%" rendered in the summary card.
  const totalChange = totalCostLastMonth === 0
    ? "0.0"
    : ((totalCostThisMonth - totalCostLastMonth) / totalCostLastMonth * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost Analytics"
        description="Financial insights and cost optimization"
        actions={
          <ExportButton onExportCSV={handleExportCSV} />
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 stagger-children">
        {[
          { label: "Total Cost", value: `₹${(totalCostThisMonth / 100000).toFixed(2)}L`, change: parseFloat(totalChange), icon: DollarSign, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400", category: null as CostCategory | null },
          { label: "Labor Cost", value: `₹${(latest.labor / 100000).toFixed(2)}L`, icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400", category: "labor" as CostCategory },
          { label: "Transport Cost", value: `₹${(latest.transport / 100000).toFixed(2)}L`, icon: Fuel, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400", category: "transport" as CostCategory },
          { label: "Equipment Cost", value: `₹${(latest.equipment / 100000).toFixed(2)}L`, icon: Wrench, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400", category: "equipment" as CostCategory },
          { label: "Storage Cost", value: `₹${(latest.storage / 100000).toFixed(2)}L`, icon: Warehouse, color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400", category: "storage" as CostCategory },
        ].map((item) => (
          <Card
            key={item.label}
            className={cn(
              "card-depth hover-scale-sm rounded-xl border-border/60 shadow-sm transition-all",
              item.category && "cursor-pointer hover:border-primary/40 hover:shadow-md cost-summary-card-clickable"
            )}
            onClick={item.category ? () => openCostDrawer(item.category!) : undefined}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    {item.label}
                    {item.category && <BarChart3 className="size-2.5 text-muted-foreground/60" />}
                  </p>
                  <p className="mt-1 text-lg font-bold text-number">{item.value}</p>
                </div>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", item.color)}>
                  <item.icon className="h-4 w-4" />
                </div>
              </div>
              {item.change !== undefined && item.change !== 0 && (
                <div className={cn("mt-1 flex items-center gap-1 text-[10px] font-medium", item.change > 0 ? "text-red-600" : "text-emerald-600")}>
                  {item.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  <span>{item.change > 0 ? "+" : ""}{item.change}% vs last month</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-accent-blue card-shine rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cost Trend</CardTitle>
            <CardDescription className="text-xs">Monthly cost breakdown (₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={costChartConfig} className="h-[300px] w-full">
              <AreaChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <defs>
                  <linearGradient id="laborGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="labor" stackId="cost" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} />
                <Area type="monotone" dataKey="transport" stackId="cost" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="equipment" stackId="cost" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Area type="monotone" dataKey="storage" stackId="cost" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="card-accent-amber card-shine rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cost Breakdown</CardTitle>
            <CardDescription className="text-xs">Current month distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" paddingAngle={2}>
                  {categoryBreakdown.map((entry, idx) => {
                    const catMap: Record<string, CostCategory> = { Labor: "labor", Transport: "transport", Equipment: "equipment", Storage: "storage" }
                    return (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        className="cost-pie-slice"
                        onClick={() => openCostDrawer(catMap[entry.name])}
                      />
                    )
                  })}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* MoM Comparison */}
      <Card className="card-depth rounded-xl border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Month-over-Month Comparison</CardTitle>
          <CardDescription className="text-xs">Last 6 months with change percentages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mobile-scroll-hint -mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-x-visible md:px-0">
          <div className="table-container min-w-[540px]">
          <Table className="table-row-hover table-stripe">
            <TableHeader className="table-header-sticky-glass">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Month</TableHead>
                <TableHead className="text-xs text-right">Labor</TableHead>
                <TableHead className="text-xs text-right">Transport</TableHead>
                <TableHead className="text-xs text-right">Equipment</TableHead>
                <TableHead className="text-xs text-right">Storage</TableHead>
                <TableHead className="text-xs text-right font-semibold">Total</TableHead>
                <TableHead className="text-xs text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {momComparison.map((row) => (
                <TableRow key={row.month} className="group">
                  <TableCell className="text-xs font-medium">{row.month}</TableCell>
                  <TableCell
                    className="text-xs text-right text-number cost-mom-cell hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors group-hover:text-blue-600"
                    onClick={() => openCostDrawer("labor", row.month)}
                    title="Click to drill into Labor cost"
                  >₹{(row.labor / 1000).toFixed(0)}K</TableCell>
                  <TableCell
                    className="text-xs text-right text-number cost-mom-cell hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors group-hover:text-emerald-600"
                    onClick={() => openCostDrawer("transport", row.month)}
                    title="Click to drill into Transport cost"
                  >₹{(row.transport / 1000).toFixed(0)}K</TableCell>
                  <TableCell
                    className="text-xs text-right text-number cost-mom-cell hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors group-hover:text-amber-600"
                    onClick={() => openCostDrawer("equipment", row.month)}
                    title="Click to drill into Equipment cost"
                  >₹{(row.equipment / 1000).toFixed(0)}K</TableCell>
                  <TableCell
                    className="text-xs text-right text-number cost-mom-cell hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors group-hover:text-purple-600"
                    onClick={() => openCostDrawer("storage", row.month)}
                    title="Click to drill into Storage cost"
                  >₹{(row.storage / 1000).toFixed(0)}K</TableCell>
                  <TableCell className="text-xs text-right font-medium text-number">₹{(row.total / 1000).toFixed(0)}K</TableCell>
                  <TableCell className="text-xs text-right">
                    <span className={cn("font-medium", row.totalChange > 0 ? "text-red-600" : row.totalChange < 0 ? "text-emerald-600" : "text-muted-foreground")}>
                      {row.totalChange > 0 ? "+" : ""}{row.totalChange}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Category Drill-Down Drawer */}
      <CostDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        category={drawerCategory}
        monthLabel={drawerMonth}
      />
    </div>
  )
}
