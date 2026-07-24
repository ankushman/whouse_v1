"use client";

import { useMemo, useState } from "react";
import { inventoryItems, warehouses } from "@/data/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  Search,
} from "lucide-react";

const ABC_COLORS = {
  A: "#3b82f6",
  B: "#f59e0b",
  C: "#94a3b8",
};

const CATEGORY_COLORS: Record<string, string> = {
  Engine: "#3b82f6",
  Transmission: "#8b5cf6",
  Body: "#f59e0b",
  Electrical: "#10b981",
  Suspension: "#ef4444",
  Brakes: "#06b6d4",
};

const abcChartConfig = {
  A: { label: "Class A (High Value)", color: "#3b82f6" },
  B: { label: "Class B (Medium Value)", color: "#f59e0b" },
  C: { label: "Class C (Low Value)", color: "#94a3b8" },
};

const categoryChartConfig = {
  count: { label: "Items" },
  Engine: { label: "Engine", color: "#3b82f6" },
  Transmission: { label: "Transmission", color: "#8b5cf6" },
  Body: { label: "Body", color: "#f59e0b" },
  Electrical: { label: "Electrical", color: "#10b981" },
  Suspension: { label: "Suspension", color: "#ef4444" },
  Brakes: { label: "Brakes", color: "#06b6d4" },
};

type WarehouseFilter = "All" | string;
type CategoryFilter = "All" | "Engine" | "Transmission" | "Body" | "Electrical" | "Suspension" | "Brakes";
type AbcFilter = "All" | "A" | "B" | "C";

export function InventoryView() {
  const [warehouseFilter, setWarehouseFilter] = useState<WarehouseFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [abcFilter, setAbcFilter] = useState<AbcFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      if (warehouseFilter !== "All" && item.warehouse !== warehouseFilter) return false;
      if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
      if (abcFilter !== "All" && item.abcClass !== abcFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.sku.toLowerCase().includes(q) ||
          item.partName.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [warehouseFilter, categoryFilter, abcFilter, searchQuery]);

  const summary = useMemo(() => {
    const totalSkus = inventoryItems.length;
    const totalItems = inventoryItems.reduce((s, i) => s + i.quantity, 0);
    const belowMin = inventoryItems.filter((i) => i.quantity < i.minStock);
    const accuracyItems = inventoryItems.filter((i) => i.variance === 0);
    const avgAccuracy =
      inventoryItems.length > 0
        ? ((accuracyItems.length / inventoryItems.length) * 100).toFixed(1)
        : "0";
    return { totalSkus, totalItems, belowMin, avgAccuracy };
  }, []);

  const abcData = useMemo(() => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
    filteredItems.forEach((item) => {
      counts[item.abcClass]++;
    });
    return [
      { name: "A", value: counts.A, fill: ABC_COLORS.A },
      { name: "B", value: counts.B, fill: ABC_COLORS.B },
      { name: "C", value: counts.C, fill: ABC_COLORS.C },
    ].filter((d) => d.value > 0);
  }, [filteredItems]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([key, value]) => ({
        category: key,
        count: value,
        fill: CATEGORY_COLORS[key] || "#94a3b8",
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredItems]);

  const stockAlerts = useMemo(() => {
    return inventoryItems.filter((item) => item.quantity < item.minStock);
  }, []);

  const hasActiveFilters =
    warehouseFilter !== "All" || categoryFilter !== "All" || abcFilter !== "All";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Track stock levels, accuracy and variance across warehouses"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total SKUs</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {summary.totalSkus}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Items</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {summary.totalItems.toLocaleString()}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <BarChart3 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-red-200 dark:border-red-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Below Min Stock
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
                  {summary.belowMin.length}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Avg Accuracy
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {summary.avgAccuracy}%
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ABC Classification */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              ABC Classification
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution by value class (A = High, B = Medium, C = Low)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={abcChartConfig} className="mx-auto h-[220px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={abcData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {abcData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Category Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Inventory items per part category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryChartConfig} className="h-[220px] w-full">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="category"
                  type="category"
                  width={90}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </div>
          <Select value={warehouseFilter} onValueChange={(v) => setWarehouseFilter(v as WarehouseFilter)}>
            <SelectTrigger className="h-8 w-[150px] text-xs">
              <SelectValue placeholder="Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Warehouses</SelectItem>
              {warehouses.map((w) => (
                <SelectItem key={w.id} value={w.city}>
                  {w.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Engine">Engine</SelectItem>
              <SelectItem value="Transmission">Transmission</SelectItem>
              <SelectItem value="Body">Body</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Suspension">Suspension</SelectItem>
              <SelectItem value="Brakes">Brakes</SelectItem>
            </SelectContent>
          </Select>
          <Select value={abcFilter} onValueChange={(v) => setAbcFilter(v as AbcFilter)}>
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue placeholder="ABC Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Classes</SelectItem>
              <SelectItem value="A">Class A</SelectItem>
              <SelectItem value="B">Class B</SelectItem>
              <SelectItem value="C">Class C</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => {
                setWarehouseFilter("All");
                setCategoryFilter("All");
                setAbcFilter("All");
              }}
            >
              Clear all
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search SKU, part, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-[220px] rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none ring-ring/10 focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {/* Tabs: Variance Table + Stock Alerts */}
      <Tabs defaultValue="variance" className="w-full">
        <TabsList className="h-9">
          <TabsTrigger value="variance" className="text-xs">
            Variance Table
            {filteredItems.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-[10px]">
                {filteredItems.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs">
            Stock Alerts
            {stockAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-1.5 h-4 px-1.5 text-[10px]">
                {stockAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Variance Table */}
        <TabsContent value="variance" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="max-h-[480px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[110px] text-xs">SKU</TableHead>
                      <TableHead className="min-w-[200px] text-xs">Part Name</TableHead>
                      <TableHead className="w-[100px] text-xs">Category</TableHead>
                      <TableHead className="w-[90px] text-xs">Warehouse</TableHead>
                      <TableHead className="w-[75px] text-right text-xs">Quantity</TableHead>
                      <TableHead className="w-[75px] text-right text-xs">Last Count</TableHead>
                      <TableHead className="w-[75px] text-right text-xs">Variance</TableHead>
                      <TableHead className="w-[60px] text-right text-xs">Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const isAlert =
                        item.variance > 0 || item.quantity < item.minStock;
                      const stockPercent = Math.min(
                        100,
                        Math.round((item.quantity / item.maxStock) * 100)
                      );
                      return (
                        <TableRow
                          key={item.id}
                          className={isAlert ? "bg-red-50/60 dark:bg-red-950/30" : ""}
                        >
                          <TableCell className="font-mono text-xs font-medium">
                            {item.sku}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[220px]">
                              <p className="truncate text-xs font-medium">
                                {item.partName}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {item.location}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-[10px] font-normal"
                            >
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            {item.warehouse}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <Progress
                                value={stockPercent}
                                className="h-1 w-14"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {item.lastCount}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`text-xs font-semibold ${
                                item.variance > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : item.variance < 0
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {item.variance > 0
                                ? `+${item.variance}`
                                : item.variance}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`text-xs ${
                                item.daysSinceLastCount > 7
                                  ? "text-amber-600 dark:text-amber-400 font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {item.daysSinceLastCount}d
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">
                          No items match the current filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Alerts */}
        <TabsContent value="alerts" className="mt-4">
          {stockAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
                  <Package className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="mt-3 text-sm font-medium">All stock levels are healthy</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No items are currently below minimum stock levels.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {stockAlerts.map((item) => {
                const deficit = item.minStock - item.quantity;
                const stockPercent = Math.round(
                  (item.quantity / item.minStock) * 100
                );
                return (
                  <Card
                    key={item.id}
                    className="border-red-200 dark:border-red-900"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                            <p className="truncate text-xs font-semibold">
                              {item.partName}
                            </p>
                          </div>
                          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                            {item.sku}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0 text-[10px]"
                        >
                          {item.abcClass}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            Current / Min
                          </span>
                          <span className="font-semibold">
                            {item.quantity} / {item.minStock}
                          </span>
                        </div>
                        <Progress value={stockPercent} className="h-1.5" />
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{item.warehouse} · {item.category}</span>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            -{deficit} units short
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
