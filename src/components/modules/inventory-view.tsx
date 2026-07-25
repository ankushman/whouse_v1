"use client";

import { useMemo, useState, useCallback } from "react";
import { inventoryItems, warehouses } from "@/data/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { BarcodeScannerModal } from "@/components/shared/barcode-scanner-modal";
import { ExportButton, exportToCSV } from "@/components/shared/export-button";
import { DataTable, type Column, type BatchAction } from "@/components/shared/data-table";
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Filter,
  RefreshCw,
  BrainCircuit,
  Download,
  ShoppingCart,
  ScanBarcode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InventoryDetailDrawer, type InventoryDetailRow } from "@/components/shared/inventory-detail-drawer";
import { useToast } from "@/hooks/use-toast-helper";

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

const forecastChartConfig = {
  actual: { label: "Actual Demand", color: "var(--chart-1)" },
  forecast: { label: "Forecasted Demand", color: "var(--chart-2)" },
};

const forecastData = (() => {
  const base = [285, 312, 298, 340, 365, 378, 355, 320, 390, 410, 385, 362];
  return base.map((v, i) => {
    const variance = 1 + (Math.sin(i * 1.3) * 0.12 + Math.cos(i * 0.7) * 0.05);
    return {
      week: `W${i + 1}`,
      actual: i < 4 ? v : undefined,
      forecast: Math.round(v * variance),
    };
  });
})();

type InventoryRow = (typeof inventoryItems)[number];

export function InventoryView() {
  const [warehouseFilter, setWarehouseFilter] = useState<WarehouseFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [abcFilter, setAbcFilter] = useState<AbcFilter>("All");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InventoryDetailRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const toast = useToast();

  const openDetail = useCallback((item: InventoryDetailRow) => {
    setDetailItem(item);
    setDetailOpen(true);
  }, []);

  const handleReorder = useCallback((item: InventoryDetailRow) => {
    const deficit = (item.minStock ?? 0) - item.quantity;
    toast.success(
      "Reorder placed",
      `${item.sku} — ${Math.max(0, deficit + (item.minStock ?? 0))} units ordered from supplier`
    );
    setDetailOpen(false);
  }, [toast]);

  const handleRefresh = useCallback((item: InventoryDetailRow) => {
    toast.info("Refreshing inventory", `Recounting ${item.sku} stock levels...`);
  }, [toast]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      if (warehouseFilter !== "All" && item.warehouse !== warehouseFilter) return false;
      if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
      if (abcFilter !== "All" && item.abcClass !== abcFilter) return false;
      return true;
    });
  }, [warehouseFilter, categoryFilter, abcFilter]);

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
    filteredItems.forEach((item) => { counts[item.abcClass]++; });
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
    return filteredItems.filter((item) => item.quantity < item.minStock);
  }, [filteredItems]);

  const hasActiveFilters =
    warehouseFilter !== "All" || categoryFilter !== "All" || abcFilter !== "All";

  const handleExportCSV = useCallback(() => {
    const data = filteredItems.map((item) => ({
      SKU: item.sku,
      "Part Name": item.partName,
      Category: item.category,
      Warehouse: item.warehouse,
      Quantity: item.quantity,
      "Min Stock": item.minStock,
      Variance: item.variance,
      "ABC Class": item.abcClass,
    }))
    exportToCSV(data, "inventory-data")
  }, [filteredItems])

  const columns: Column<InventoryRow>[] = useMemo(() => [
    {
      key: "sku",
      header: "SKU",
      sortable: true,
      className: "w-[110px]",
      render: (value) => (
        <span className="font-mono text-xs font-medium">{value as string}</span>
      ),
    },
    {
      key: "partName",
      header: "Part Name",
      sortable: true,
      render: (value, row) => (
        <div className="max-w-[220px]">
          <p className="truncate text-xs font-medium">{value as string}</p>
          <p className="text-[10px] text-muted-foreground">{row.location}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      className: "w-[100px]",
      render: (value) => (
        <Badge variant="outline" className="text-[10px] font-normal">{value as string}</Badge>
      ),
    },
    {
      key: "warehouse",
      header: "Warehouse",
      sortable: true,
      className: "w-[90px]",
    },
    {
      key: "quantity",
      header: "Quantity",
      sortable: true,
      className: "w-[100px]",
      render: (value, row) => {
        const stockPercent = Math.min(100, Math.round(((value as number) / row.maxStock) * 100));
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-semibold text-number">{value as number}</span>
            <Progress value={stockPercent} className="h-1 w-14" />
          </div>
        );
      },
    },
    {
      key: "lastCount",
      header: "Last Count",
      className: "w-[80px]",
      sortable: true,
      render: (value) => <span className="text-xs text-number text-right block">{value as string}</span>,
    },
    {
      key: "variance",
      header: "Variance",
      sortable: true,
      className: "w-[80px]",
      render: (value) => {
        const v = value as number;
        return (
          <span className={cn(
            "text-xs font-semibold text-number",
            v > 0 && "text-red-600 dark:text-red-400",
            v < 0 && "text-amber-600 dark:text-amber-400",
            v === 0 && "text-muted-foreground"
          )}>
            {v > 0 ? `+${v}` : v}
          </span>
        );
      },
    },
    {
      key: "daysSinceLastCount",
      header: "Days",
      sortable: true,
      className: "w-[60px]",
      render: (value) => (
        <span className={cn(
          "text-xs",
          (value as number) > 7 ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"
        )}>
          {value as number}d
        </span>
      ),
    },
  ], []);

  const batchActions: BatchAction<InventoryRow>[] = useMemo(() => [
    {
      label: "Export Selected",
      icon: Download,
      onClick: (rows) => {
        const data = rows.map((item) => ({
          SKU: item.sku,
          "Part Name": item.partName,
          Category: item.category,
          Warehouse: item.warehouse,
          Quantity: item.quantity,
          "Min Stock": item.minStock,
          Variance: item.variance,
          "ABC Class": item.abcClass,
        }));
        exportToCSV(data, "inventory-selected");
      },
    },
    {
      label: "Reorder Low Stock",
      icon: ShoppingCart,
      onClick: (rows) => {
        const lowStock = rows.filter((r) => r.quantity < r.minStock);
        // Reorder workflow — ready for API integration
      },
    },
  ], []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Track stock levels, accuracy and variance across warehouses"
        actions={
          <div className="flex items-center gap-2">
            <ExportButton onExportCSV={handleExportCSV} />
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setScannerOpen(true)}>
              <ScanBarcode className="h-3.5 w-3.5" />
              Scan
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
        <Card className="card-depth card-accent-blue relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total SKUs</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-number">{summary.totalSkus}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Items</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-number">{summary.totalItems.toLocaleString()}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <BarChart3 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth relative overflow-hidden border-red-200 dark:border-red-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Below Min Stock</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-red-600 dark:text-red-400 text-number">{summary.belowMin.length}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Avg Accuracy</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-number">{summary.avgAccuracy}%</p>
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
        <Card className="card-accent-green card-shine">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">ABC Classification</CardTitle>
            <CardDescription className="text-xs">Distribution by value class (A = High, B = Medium, C = Low)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={abcChartConfig} className="mx-auto h-[220px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={abcData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {abcData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="card-accent-purple card-shine">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Category Distribution</CardTitle>
            <CardDescription className="text-xs">Inventory items per part category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryChartConfig} className="h-[220px] w-full">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" width={90} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {categoryData.map((entry, index) => (<Cell key={`bar-${index}`} fill={entry.fill} />))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Demand Forecasting Chart */}
      <Card className="card-depth chart-card card-accent-blue card-shine">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Demand Forecasting</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-normal text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800">
              Forecast Accuracy: 94.2%
            </Badge>
          </div>
          <CardDescription className="text-xs">Actual vs forecasted demand for the next 12 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={forecastChartConfig} className="h-[240px] w-full">
            <AreaChart data={forecastData} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="actual" stroke="var(--chart-1)" strokeWidth={2} fill="url(#actualGradient)" connectNulls={false} />
              <Area type="monotone" dataKey="forecast" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="6 3" fill="url(#forecastGradient)" connectNulls={false} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Separator />

      {/* Filter Bar */}
      <div className="filter-bar flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
              {warehouses.map((w) => (<SelectItem key={w.id} value={w.city}>{w.city}</SelectItem>))}
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
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={() => { setWarehouseFilter("All"); setCategoryFilter("All"); setAbcFilter("All"); }}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Tabs: DataTable + Stock Alerts */}
      <Tabs defaultValue="variance" className="w-full">
        <TabsList className="h-9">
          <TabsTrigger value="variance" className="text-xs">
            Inventory Items
            {filteredItems.length > 0 && (<Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-[10px]">{filteredItems.length}</Badge>)}
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs">
            Stock Alerts
            {stockAlerts.length > 0 && (<Badge variant="destructive" className="ml-1.5 h-4 px-1.5 text-[10px]">{stockAlerts.length}</Badge>)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="variance" className="mt-4">
          <DataTable<InventoryRow>
            data={filteredItems}
            columns={columns}
            searchableColumns={["sku", "partName"]}
            searchPlaceholder="Search SKU, part name..."
            selectable
            batchActions={batchActions}
            pageSize={10}
            showCount
            onRowClick={(row) => openDetail(row as unknown as InventoryDetailRow)}
          />
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          {stockAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
                  <Package className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="mt-3 text-sm font-medium">All stock levels are healthy</p>
                <p className="mt-1 text-xs text-muted-foreground">No items are currently below minimum stock levels.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-tight md:grid-cols-2 xl:grid-cols-3">
              {stockAlerts.map((item) => {
                const deficit = item.minStock - item.quantity;
                const stockPercent = Math.round((item.quantity / item.minStock) * 100);
                return (
                  <Card
                    key={item.id}
                    className="border-red-200 dark:border-red-900 cursor-pointer hover:shadow-md hover:border-red-300 dark:hover:border-red-800 transition-all"
                    onClick={() => openDetail(item as unknown as InventoryDetailRow)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                            <p className="truncate text-xs font-semibold">{item.partName}</p>
                          </div>
                          <p className="mt-1 font-mono text-[10px] text-muted-foreground">{item.sku}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-[10px]">{item.abcClass}</Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Current / Min</span>
                          <span className="font-semibold text-number">{item.quantity} / {item.minStock}</span>
                        </div>
                        <Progress value={stockPercent} className="h-1.5" />
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{item.warehouse} · {item.category}</span>
                          <span className="font-medium text-red-600 dark:text-red-400 text-number">-{deficit} units short</span>
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
      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        inventoryItems={inventoryItems}
      />

      {/* Inventory Detail Drawer */}
      <InventoryDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        item={detailItem}
        onReorder={handleReorder}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
