"use client"

import { useMemo } from "react"
import { costTrend } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { AreaChart, BarChart, Bar, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  BarChart3,
  PieChart as PieIcon,
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
  const latest = costTrend[costTrend.length - 1]
  const previous = costTrend[costTrend.length - 2]

  const totalCostThisMonth = latest.total
  const totalCostLastMonth = previous.total
  const totalChange = ((totalCostThisMonth - totalCostLastMonth) / totalCostLastMonth * 100).toFixed(1)

  const categoryBreakdown = useMemo(() => [
    { name: "Labor", value: latest.labor, color: PIE_COLORS[0] },
    { name: "Transport", value: latest.transport, color: PIE_COLORS[1] },
    { name: "Equipment", value: latest.equipment, color: PIE_COLORS[2] },
    { name: "Storage", value: latest.storage, color: PIE_COLORS[3] },
  ], [latest])

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
        laborChange: idx > 0 ? +((entry.labor - prev.labor) / prev.labor * 100).toFixed(1) : 0,
        transportChange: idx > 0 ? +((entry.transport - prev.transport) / prev.transport * 100).toFixed(1) : 0,
        equipmentChange: idx > 0 ? +((entry.equipment - prev.equipment) / prev.equipment * 100).toFixed(1) : 0,
        storageChange: idx > 0 ? +((entry.storage - prev.storage) / prev.storage * 100).toFixed(1) : 0,
        totalChange: idx > 0 ? +((entry.total - prev.total) / prev.total * 100).toFixed(1) : 0,
      }
    }), [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost Analytics"
        description="Financial insights and cost optimization"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 stagger-children">
        {[
          { label: "Total Cost", value: `₹${(totalCostThisMonth / 100000).toFixed(2)}L`, change: +parseFloat(totalChange), icon: DollarSign, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Labor Cost", value: `₹${(latest.labor / 100000).toFixed(2)}L`, icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Transport Cost", value: `₹${(latest.transport / 100000).toFixed(2)}L`, icon: Fuel, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
          { label: "Equipment Cost", value: `₹${(latest.equipment / 100000).toFixed(2)}L`, icon: Wrench, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
          { label: "Storage Cost", value: `₹${(latest.storage / 100000).toFixed(2)}L`, icon: Warehouse, color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
        ].map((item) => (
          <Card key={item.label} className="card-depth rounded-xl border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-lg font-bold">{item.value}</p>
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
        <Card className="card-accent-blue rounded-xl border-border/60 shadow-sm">
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

        <Card className="card-accent-amber rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cost Breakdown</CardTitle>
            <CardDescription className="text-xs">Current month distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" paddingAngle={2}>
                  {categoryBreakdown.map((entry, idx) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* MoM Comparison */}
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Month-over-Month Comparison</CardTitle>
          <CardDescription className="text-xs">Last 6 months with change percentages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-container">
          <Table className="table-row-hover table-stripe">
            <TableHeader>
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
                <TableRow key={row.month}>
                  <TableCell className="text-xs font-medium">{row.month}</TableCell>
                  <TableCell className="text-xs text-right">₹{(row.labor / 1000).toFixed(0)}K</TableCell>
                  <TableCell className="text-xs text-right">₹{(row.transport / 1000).toFixed(0)}K</TableCell>
                  <TableCell className="text-xs text-right">₹{(row.equipment / 1000).toFixed(0)}K</TableCell>
                  <TableCell className="text-xs text-right">₹{(row.storage / 1000).toFixed(0)}K</TableCell>
                  <TableCell className="text-xs text-right font-medium">₹{(row.total / 1000).toFixed(0)}K</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}
