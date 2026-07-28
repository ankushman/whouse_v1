"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, Eye, Filter, Clock,
  FileText, TrendingUp, TrendingDown, Activity, AlertTriangle,
  CheckCircle2, XCircle, Timer, GitCompareArrows, Truck, Package,
  IndianRupee, Percent, ChevronRight, Zap, Info, ArrowRight,
  Warehouse, MapPin, BarChart3, ShieldCheck, RotateCcw, Ban,
  PackageCheck, Layers, ArrowLeftRight, Route,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast-helper";
import { cn } from "@/lib/utils";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10000000) return `\u20B9${(amount / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `\u20B9${(amount / 100000).toFixed(2)} L`;
  return `\u20B9${amount.toLocaleString("en-IN")}`;
}

function generateData() {
  const rand = seededRandom(2055101);

  const warehouses = [
    "Mumbai WH", "Delhi NCR WH", "Chennai WH", "Bangalore WH", "Kolkata WH",
    "Pune WH", "Hyderabad WH", "Ahmedabad WH", "Jaipur WH", "Lucknow WH",
    "Coimbatore WH", "Indore WH",
  ] as const;

  const transferStatuses = [
    "Pending Approval", "Approved", "In Transit", "Received", "Partial", "Cancelled", "On Hold", "Completed",
  ] as const;

  const transferReasons = [
    "Stock Imbalance", "Demand Surge", "Seasonal Shift", "Promotional Stock",
    "Consolidation", "Dead Stock Move", "New Warehouse Setup", "Cost Optimization",
  ] as const;

  const transportModes = ["Road FTL", "Road PTL", "Rail", "Air", "Multimodal", "Self Fleet"] as const;

  const productCategories = [
    "Electronics", "Textiles", "Pharma", "Auto Parts", "FMCG", "Industrial", "Chemicals", "Agriculture", "IT Products", "Leather",
  ] as const;

  const priorityLevels = ["Critical", "Urgent", "High", "Medium", "Low"] as const;

  const imbalanceTypes = [
    "Overstock", "Understock", "Critical Shortage", "Excess Stock", "Mismatch", "Optimal",
  ] as const;

  const ruleStatuses = [
    "Active", "Paused", "Draft", "Expired", "Under Review",
  ] as const;

  const ruleTriggers = [
    "Days of Cover < 7", "Days of Cover < 14", "Stockout Risk", "Overstock > 120%",
    "Demand Spike > 200%", "Manual Override", "Weekly Review", "Seasonal Transition",
  ] as const;

  // --- Transfers ---
  const transfers = Array.from({ length: 70 }, (_, i) => {
    const srcIdx = Math.floor(rand() * warehouses.length);
    let dstIdx = (srcIdx + 1 + Math.floor(rand() * (warehouses.length - 1))) % warehouses.length;
    const status = transferStatuses[Math.floor(rand() * transferStatuses.length)];
    const qty = Math.floor(rand() * 5000) + 50;
    const unitCost = Math.floor(rand() * 5000) + 100;
    return {
      id: i + 1,
      transferNo: `TRF-${String(5000 + i).padStart(5, "0")}`,
      source: warehouses[srcIdx],
      destination: warehouses[dstIdx],
      category: productCategories[Math.floor(rand() * productCategories.length)],
      sku: `SKU${String(10000 + Math.floor(rand() * 90000))}`,
      status,
      reason: transferReasons[Math.floor(rand() * transferReasons.length)],
      priority: priorityLevels[Math.floor(rand() * priorityLevels.length)],
      mode: transportModes[Math.floor(rand() * transportModes.length)],
      qty, receivedQty: status === "Completed" ? qty : Math.floor(rand() * qty),
      unitCost, totalValue: qty * unitCost,
      transitDays: Math.floor(rand() * 10) + 1,
      eta: `2026-0${Math.min(9, Math.floor(rand() * 3) + 7)}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      createdDate: `2026-0${(Math.floor(rand() * 6) + 1).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
    };
  });

  // --- Stock Levels (12 warehouses × 10 categories) ---
  const stockLevels = Array.from({ length: 80 }, (_, i) => {
    const wh = warehouses[Math.floor(rand() * warehouses.length)];
    const cat = productCategories[Math.floor(rand() * productCategories.length)];
    const onHand = Math.floor(rand() * 10000) + 100;
    const allocated = Math.floor(onHand * (rand() * 0.5));
    const safetyStock = Math.floor(rand() * 2000) + 200;
    const daysCover = Math.floor(rand() * 60) + 1;
    const type = daysCover < 5 ? imbalanceTypes[2] : daysCover < 10 ? imbalanceTypes[1] : daysCover > 45 ? imbalanceTypes[3] : Math.random() > 0.7 ? imbalanceTypes[0] : imbalanceTypes[5];
    return {
      id: i + 1, warehouse: wh, category: cat,
      sku: `SKU${String(10000 + Math.floor(rand() * 90000))}`,
      onHand, allocated, available: onHand - allocated,
      safetyStock, daysCover,
      imbalanceType: type,
      avgDailyDemand: Math.floor(rand() * 200) + 10,
      lastRestock: `2026-0${(Math.floor(rand() * 6) + 1).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
    };
  });

  // --- Rebalance Rules ---
  const rules = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    ruleName: `Rule ${String(100 + i)}: ${ruleTriggers[i % ruleTriggers.length]}`,
    trigger: ruleTriggers[i % ruleTriggers.length],
    status: ruleStatuses[Math.floor(rand() * ruleStatuses.length)],
    sourceZone: ["North", "South", "West", "East", "Central"][Math.floor(rand() * 5)],
    destZone: ["North", "South", "West", "East", "Central"][Math.floor(rand() * 5)],
    category: productCategories[Math.floor(rand() * productCategories.length)],
    minQty: Math.floor(rand() * 1000) + 50,
    maxQty: Math.floor(rand() * 10000) + 1000,
    executionCount: Math.floor(rand() * 200) + 1,
    lastExecuted: `2026-0${(Math.floor(rand() * 6) + 1).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
    savingsGenerated: Math.floor(rand() * 5000000) + 100000,
  }));

  // --- KPIs ---
  const kpis = {
    activeTransfers: transfers.filter(t => ["Pending Approval", "Approved", "In Transit"].includes(t.status)).length,
    totalInTransit: transfers.filter(t => t.status === "In Transit").reduce((s, t) => s + t.totalValue, 0),
    imbalanceAlerts: stockLevels.filter(s => s.imbalanceType === "Critical Shortage").length,
    avgTransitDays: (transfers.reduce((s, t) => s + t.transitDays, 0) / transfers.length).toFixed(1),
    rebalanceSavings: Math.floor(rand() * 8000000) + 2000000,
    autoRules: rules.filter(r => r.status === "Active").length,
    stockUtilization: Math.floor(rand() * 15) + 72,
    pendingApprovals: transfers.filter(t => t.status === "Pending Approval").length,
  };

  const monthlyTransfers = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => ({
    month: m, Inbound: Math.floor(rand() * 300) + 50, Outbound: Math.floor(rand() * 300) + 50, Internal: Math.floor(rand() * 200) + 30,
  }));

  const warehouseDistribution = warehouses.slice(0, 6).map(w => ({
    warehouse: w.replace(" WH", ""), Overstock: Math.floor(rand() * 30) + 5, Understock: Math.floor(rand() * 25) + 5, Optimal: Math.floor(rand() * 40) + 10,
  }));

  const savingsTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(m => ({
    month: m, Savings: Math.floor(rand() * 5000000) + 1000000, Potential: Math.floor(rand() * 3000000) + 500000,
  }));

  const analyticsKpis = {
    totalRebalanced: Math.floor(rand() * 50000) + 5000,
    avgReductionDays: Math.floor(rand() * 5) + 2,
    fulfillmentUplift: Math.floor(rand() * 8) + 3,
    transportCost: Math.floor(rand() * 20000000) + 5000000,
    automationRate: Math.floor(rand() * 20) + 60,
    stockoutReduction: Math.floor(rand() * 15) + 10,
    avgSavingsPerTransfer: Math.floor(rand() * 50000) + 10000,
    excessReduction: Math.floor(rand() * 10) + 5,
  };

  return {
    warehouses, transferStatuses, transferReasons, transportModes, productCategories,
    priorityLevels, imbalanceTypes, ruleStatuses, ruleTriggers,
    transfers, stockLevels, rules, kpis, monthlyTransfers, warehouseDistribution, savingsTrend, analyticsKpis,
  };
}

const data = generateData();
const COLORS = ["#0d9488", "#d97706", "#7c3aed", "#dc2626", "#475569", "#059669"];

// ============================================================================
// Unique Visual Components
// ============================================================================
function TransferStatusBadge({ status }: { status: string }) {
  const c: Record<string, string> = {
    "Pending Approval": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    "Approved": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "In Transit": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    "Received": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    "Partial": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "Cancelled": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    "On Hold": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    "Completed": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  };
  return <span className={cn("mwr-pill px-2 py-0.5 rounded-full text-xs font-medium", c[status] || "bg-gray-100")}>{String(status)}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const c: Record<string, string> = { Critical: "bg-red-600 text-white", Urgent: "bg-orange-500 text-white", High: "bg-amber-400 text-amber-900", Medium: "bg-blue-100 text-blue-700", Low: "bg-slate-100 text-slate-600" };
  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold", c[priority])}>{String(priority)}</span>;
}

function WarehousePill({ name }: { name: string }) {
  const colors = ["bg-teal-50 text-teal-700 border-teal-200", "bg-violet-50 text-violet-700 border-violet-200", "bg-amber-50 text-amber-700 border-amber-200", "bg-rose-50 text-rose-700 border-rose-200", "bg-blue-50 text-blue-700 border-blue-200", "bg-emerald-50 text-emerald-700 border-emerald-200"];
  return <span className={cn("mwr-wh-pill px-2 py-0.5 rounded-md text-xs font-medium border", colors[name.length % colors.length])}>{String(name)}</span>;
}

function TransferFlowIndicator({ source, destination }: { source: string; destination: string }) {
  return (
    <div className="mwr-flow-indicator flex items-center gap-1.5 text-xs">
      <span className="font-medium text-teal-700 dark:text-teal-400 truncate max-w-[80px]">{String(source).replace(" WH", "")}</span>
      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
      <span className="font-medium text-violet-700 dark:text-violet-400 truncate max-w-[80px]">{String(destination).replace(" WH", "")}</span>
    </div>
  );
}

function QtyProgressBar({ received, total }: { received: number; total: number }) {
  const pct = Math.min(100, Math.round((received / total) * 100));
  const color = pct >= 100 ? "#059669" : pct >= 50 ? "#d97706" : "#dc2626";
  return (
    <div className="mwr-qty-bar space-y-0.5">
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
        <div className="h-full rounded" style={{ width: `${pct}%`, background: color, transition: "width 0.6s ease-out" }} />
      </div>
      <div className="flex justify-between text-[10px] tabular-nums"><span>{received}/{total}</span><span className="font-bold">{pct}%</span></div>
    </div>
  );
}

function ImbalanceTypeBadge({ type }: { type: string }) {
  const c: Record<string, string> = {
    "Critical Shortage": "bg-red-600 text-white mwr-risk-critical",
    "Understock": "bg-orange-100 text-orange-700",
    "Overstock": "bg-amber-100 text-amber-700",
    "Excess Stock": "bg-yellow-100 text-yellow-700",
    "Mismatch": "bg-purple-100 text-purple-700",
    "Optimal": "bg-emerald-100 text-emerald-700",
  };
  return <span className={cn("mwr-pill px-2 py-0.5 rounded-full text-xs font-medium", c[type] || "bg-gray-100")}>{String(type)}</span>;
}

function DaysCoverBar({ days }: { days: number }) {
  const pct = Math.min(100, Math.round((days / 60) * 100));
  const color = days < 5 ? "#dc2626" : days < 10 ? "#ea580c" : days < 20 ? "#d97706" : days < 35 ? "#0d9488" : "#059669";
  return (
    <div className="mwr-cover-bar space-y-0.5">
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
        <div className="h-full rounded mwr-cover-fill" style={{ width: `${pct}%`, background: color, transition: "width 0.8s ease-out" }} />
      </div>
      <div className="text-[10px] font-bold tabular-nums" style={{ color }}>{days} days cover</div>
    </div>
  );
}

function RuleStatusBadge({ status }: { status: string }) {
  const c: Record<string, string> = { Active: "bg-emerald-100 text-emerald-700", Paused: "bg-amber-100 text-amber-700", Draft: "bg-slate-100 text-slate-600", Expired: "bg-red-100 text-red-700", "Under Review": "bg-blue-100 text-blue-700" };
  return <span className={cn("mwr-pill px-2 py-0.5 rounded-full text-xs font-medium", c[status])}>{String(status)}</span>;
}

function SavingsTile({ savings }: { savings: number }) {
  return (
    <div className="mwr-savings-tile p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
      <div className="text-xs text-emerald-600 font-medium">Savings Generated</div>
      <div className="text-lg font-bold text-emerald-700 tabular-nums">{formatINR(savings)}</div>
    </div>
  );
}

function RuleExecutionRing({ count }: { count: number }) {
  const maxRef = 200;
  const pct = Math.min(100, Math.round((count / maxRef) * 100));
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? "#059669" : pct >= 40 ? "#d97706" : "#dc2626";
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="mwr-score-ring">
      <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
      <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 26 26)" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      <text x="26" y="28" textAnchor="middle" className="text-[10px] font-bold fill-current" style={{ color }}>{String(count)}</text>
    </svg>
  );
}

function TransferValueTile({ value, qty, unitCost }: { value: number; qty: number; unitCost: number }) {
  return (
    <div className="mwr-value-tile p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Qty</span><span className="font-bold tabular-nums">{String(qty)}</span></div>
      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Unit Cost</span><span className="tabular-nums">{formatINR(unitCost)}</span></div>
      <div className="flex justify-between text-xs border-t border-slate-200 dark:border-slate-700 pt-1"><span className="font-medium">Total Value</span><span className="font-bold tabular-nums">{formatINR(value)}</span></div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================
export default function MultiWarehouseRebalanceView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("0");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<Record<string, unknown> | null>(null);

  const toggleSort = useCallback((f: string) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("asc"); }
  }, [sortField]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 ml-1 text-teal-600" /> : <ArrowDown className="w-3 h-3 ml-1 text-teal-600" />;
  };

  const genericSort = useCallback((arr: Record<string, unknown>[], f: string, d: "asc" | "desc") => {
    return [...arr].sort((a, b) => {
      const cmp = String(a[f]).localeCompare(String(b[f]), undefined, { numeric: true });
      return d === "asc" ? cmp : -cmp;
    });
  }, []);

  const filteredTransfers = useMemo(() => {
    let arr = data.transfers;
    if (statusFilter !== "all") arr = arr.filter(t => t.status === statusFilter);
    if (searchTerm) arr = arr.filter(t => t.transferNo.toLowerCase().includes(searchTerm.toLowerCase()) || t.source.toLowerCase().includes(searchTerm.toLowerCase()) || t.destination.toLowerCase().includes(searchTerm.toLowerCase()));
    return genericSort(arr, sortField, sortDir);
  }, [searchTerm, statusFilter, sortField, sortDir, genericSort]);

  const filteredStock = useMemo(() => {
    let arr = data.stockLevels;
    if (statusFilter !== "all") arr = arr.filter(s => s.imbalanceType === statusFilter);
    if (searchTerm) arr = arr.filter(s => s.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) || s.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    return genericSort(arr, sortField, sortDir);
  }, [searchTerm, statusFilter, sortField, sortDir, genericSort]);

  const filteredRules = useMemo(() => {
    let arr = data.rules;
    if (statusFilter !== "all") arr = arr.filter(r => r.status === statusFilter);
    if (searchTerm) arr = arr.filter(r => r.ruleName.toLowerCase().includes(searchTerm.toLowerCase()));
    return genericSort(arr, sortField, sortDir);
  }, [searchTerm, statusFilter, sortField, sortDir, genericSort]);

  const k = data.kpis;
  const ak = data.analyticsKpis;

  return (
    <div className="mwr-root flex flex-col gap-4 p-4">
      <PageHeader title="Multi-Warehouse Inventory Rebalancing" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          {["Rebalance Dashboard", "Transfer Orders", "Stock Imbalance", "Rebalance Rules", "Network Heatmap", "Rebalance Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="data-[state=active]:shadow-md">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* TAB 0: Dashboard */}
        <TabsContent value="0" className="space-y-4 mt-4">
          <div className="mwr-kpi-grid grid grid-cols-4 gap-4">
            {[
              { label: "Active Transfers", value: k.activeTransfers, icon: <Truck className="w-4 h-4" /> },
              { label: "Value In Transit", value: formatINR(k.totalInTransit), icon: <IndianRupee className="w-4 h-4" /> },
              { label: "Imbalance Alerts", value: k.imbalanceAlerts, icon: <AlertTriangle className="w-4 h-4" /> },
              { label: "Avg Transit Days", value: `${k.avgTransitDays}d`, icon: <Clock className="w-4 h-4" /> },
              { label: "Rebalance Savings", value: formatINR(k.rebalanceSavings), icon: <TrendingUp className="w-4 h-4" /> },
              { label: "Active Rules", value: k.autoRules, icon: <GitCompareArrows className="w-4 h-4" /> },
              { label: "Stock Utilization", value: `${k.stockUtilization}%`, icon: <Percent className="w-4 h-4" /> },
              { label: "Pending Approvals", value: k.pendingApprovals, icon: <Timer className="w-4 h-4" /> },
            ].map((item, idx) => (
              <Card key={idx} className="mwr-kpi-card">
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
                  <CardTitle className="text-xs text-muted-foreground font-medium">{item.label}</CardTitle>
                  <span className="text-muted-foreground">{item.icon}</span>
                </CardHeader>
                <CardContent className="px-4 pb-3"><div className="text-xl font-bold tabular-nums">{item.value}</div></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="mwr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Transfers</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.monthlyTransfers}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="Inbound" fill="#0d9488" radius={[4,4,0,0]} /><Bar dataKey="Outbound" fill="#d97706" radius={[4,4,0,0]} /><Bar dataKey="Internal" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="mwr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Stock Distribution by WH</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.warehouseDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="warehouse" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="Overstock" fill="#d97706" stackId="a" radius={[0,0,0,0]} /><Bar dataKey="Understock" fill="#dc2626" stackId="a" /><Bar dataKey="Optimal" fill="#059669" stackId="a" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
          <Card className="mwr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Savings Trend (6 months)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><AreaChart data={data.savingsTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Legend /><Area type="monotone" dataKey="Savings" stroke="#059669" fill="#d1fae5" /><Area type="monotone" dataKey="Potential" stroke="#7c3aed" fill="#ede9fe" /></AreaChart></ResponsiveContainer></CardContent></Card>
        </TabsContent>

        {/* TAB 1: Transfer Orders */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search transfer, warehouse..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background"><option value="all">All Statuses</option>{data.transferStatuses.map(s => <option key={String(s)} value={String(s)}>{String(s)}</option>)}</select>
          </div>
          <div className="rounded-lg border overflow-auto max-h-[520px]">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                  {[{ key: "transferNo", label: "Transfer" }, { key: "source", label: "Route" }, { key: "category", label: "Category" }, { key: "priority", label: "Priority" }, { key: "status", label: "Status" }, { key: "qty", label: "Qty" }, { key: "totalValue", label: "Value" }, { key: "mode", label: "Mode" }, { key: "eta", label: "ETA" }, { key: "createdDate", label: "Created" }].map(h => (
                    <th key={h.key} className="mwr-sort-header px-3 py-2 text-left font-medium cursor-pointer" onClick={() => toggleSort(h.key)}>{h.label}<SortIcon field={h.key} /></th>
                  ))}
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.map((t, idx) => (
                  <tr key={t.id} className={cn("mwr-data-row mwr-tab-1-row border-t transition-colors", idx % 2 === 1 && "bg-slate-50/50 dark:bg-slate-800/30")}>
                    <td className="px-3 py-2 font-mono font-bold">{t.transferNo}</td>
                    <td className="px-3 py-2"><TransferFlowIndicator source={t.source} destination={t.destination} /></td>
                    <td className="px-3 py-2 text-xs">{t.category}</td>
                    <td className="px-3 py-2"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-3 py-2"><TransferStatusBadge status={t.status} /></td>
                    <td className="px-3 py-2"><QtyProgressBar received={t.receivedQty} total={t.qty} /></td>
                    <td className="px-3 py-2 font-bold tabular-nums">{formatINR(t.totalValue)}</td>
                    <td className="px-3 py-2"><Badge variant="outline" className="text-[10px]">{t.mode}</Badge></td>
                    <td className="px-3 py-2">{t.eta}</td>
                    <td className="px-3 py-2">{t.createdDate}</td>
                    <td className="px-3 py-2"><Button size="sm" variant="ghost" className="mwr-action-btn h-7" onClick={() => { setDrawerRecord(t); setDrawerOpen(true); }}><Eye className="w-3 h-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB 2: Stock Imbalance */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search SKU, warehouse..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background"><option value="all">All Types</option>{data.imbalanceTypes.map(t => <option key={String(t)} value={String(t)}>{String(t)}</option>)}</select>
          </div>
          <div className="rounded-lg border overflow-auto max-h-[520px]">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                  {[{ key: "sku", label: "SKU" }, { key: "warehouse", label: "Warehouse" }, { key: "category", label: "Category" }, { key: "imbalanceType", label: "Type" }, { key: "onHand", label: "On Hand" }, { key: "available", label: "Available" }, { key: "safetyStock", label: "Safety Stock" }, { key: "daysCover", label: "Cover" }, { key: "avgDailyDemand", label: "Daily Demand" }, { key: "lastRestock", label: "Last Restock" }].map(h => (
                    <th key={h.key} className="mwr-sort-header px-3 py-2 text-left font-medium cursor-pointer" onClick={() => toggleSort(h.key)}>{h.label}<SortIcon field={h.key} /></th>
                  ))}
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.map((s, idx) => (
                  <tr key={s.id} className={cn("mwr-data-row mwr-tab-2-row border-t transition-colors", idx % 2 === 1 && "bg-slate-50/50 dark:bg-slate-800/30")}>
                    <td className="px-3 py-2 font-mono text-[11px]">{s.sku}</td>
                    <td className="px-3 py-2"><WarehousePill name={s.warehouse} /></td>
                    <td className="px-3 py-2">{s.category}</td>
                    <td className="px-3 py-2"><ImbalanceTypeBadge type={s.imbalanceType} /></td>
                    <td className="px-3 py-2 tabular-nums font-bold">{s.onHand.toLocaleString()}</td>
                    <td className="px-3 py-2 tabular-nums">{s.available.toLocaleString()}</td>
                    <td className="px-3 py-2 tabular-nums">{s.safetyStock.toLocaleString()}</td>
                    <td className="px-3 py-2"><DaysCoverBar days={s.daysCover} /></td>
                    <td className="px-3 py-2 tabular-nums">{s.avgDailyDemand}</td>
                    <td className="px-3 py-2">{s.lastRestock}</td>
                    <td className="px-3 py-2"><Button size="sm" variant="ghost" className="mwr-action-btn h-7" onClick={() => { toast.info("Rebalance Initiated", `Transfer for ${s.sku}`); }}><GitCompareArrows className="w-3 h-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB 3: Rebalance Rules */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search rules..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background"><option value="all">All Statuses</option>{data.ruleStatuses.map(s => <option key={String(s)} value={String(s)}>{String(s)}</option>)}</select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRules.map(r => (
              <Card key={r.id} className="mwr-chart-card hover:shadow-md transition-shadow">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1"><div className="font-bold text-sm">{r.ruleName}</div><div className="text-[10px] text-muted-foreground mt-0.5">{r.trigger}</div></div>
                    <RuleExecutionRing count={r.executionCount} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <RuleStatusBadge status={r.status} />
                    <Badge variant="outline" className="text-[10px]">{r.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div><span className="text-muted-foreground">Source Zone</span><div className="font-medium">{r.sourceZone}</div></div>
                    <div><span className="text-muted-foreground">Dest Zone</span><div className="font-medium">{r.destZone}</div></div>
                    <div><span className="text-muted-foreground">Min/Max Qty</span><div className="font-medium tabular-nums">{r.minQty} / {r.maxQty}</div></div>
                    <div><span className="text-muted-foreground">Last Executed</span><div className="font-medium">{r.lastExecuted}</div></div>
                  </div>
                  <SavingsTile savings={r.savingsGenerated} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 4: Network Heatmap */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.warehouses.map((wh, idx) => {
              const whStock = data.stockLevels.filter(s => s.warehouse === wh);
              const overstock = whStock.filter(s => s.imbalanceType === "Overstock" || s.imbalanceType === "Excess Stock").length;
              const understock = whStock.filter(s => s.imbalanceType === "Understock" || s.imbalanceType === "Critical Shortage").length;
              const optimal = whStock.filter(s => s.imbalanceType === "Optimal").length;
              const totalSku = whStock.length;
              const healthPct = totalSku > 0 ? Math.round((optimal / totalSku) * 100) : 0;
              return (
                <Card key={idx} className="mwr-wh-card hover:shadow-md transition-all hover:-translate-y-0.5">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center gap-2"><Warehouse className="w-4 h-4 text-teal-600" /><span className="font-bold text-sm">{String(wh)}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{overstock} over</span>
                      <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{understock} under</span>
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">{optimal} ok</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Health</span>
                      <span className={cn("text-xs font-bold", healthPct >= 60 ? "text-emerald-600" : healthPct >= 30 ? "text-amber-600" : "text-red-600")}>{healthPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${healthPct}%`, background: healthPct >= 60 ? "#059669" : healthPct >= 30 ? "#d97706" : "#dc2626", transition: "width 0.8s" }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 5: Analytics */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="mwr-kpi-grid grid grid-cols-4 gap-4">
            {[
              { label: "Total Rebalanced", value: ak.totalRebalanced.toLocaleString(), icon: <Package className="w-4 h-4" /> },
              { label: "Avg Reduction Days", value: `-${ak.avgReductionDays}d`, icon: <Clock className="w-4 h-4" /> },
              { label: "Fulfillment Uplift", value: `+${ak.fulfillmentUplift}%`, icon: <TrendingUp className="w-4 h-4" /> },
              { label: "Transport Cost", value: formatINR(ak.transportCost), icon: <Truck className="w-4 h-4" /> },
              { label: "Automation Rate", value: `${ak.automationRate}%`, icon: <Activity className="w-4 h-4" /> },
              { label: "Stockout Reduction", value: `-${ak.stockoutReduction}%`, icon: <ShieldCheck className="w-4 h-4" /> },
              { label: "Avg Savings/Transfer", value: formatINR(ak.avgSavingsPerTransfer), icon: <IndianRupee className="w-4 h-4" /> },
              { label: "Excess Reduction", value: `-${ak.excessReduction}%`, icon: <TrendingDown className="w-4 h-4" /> },
            ].map((item, idx) => (
              <Card key={idx} className="mwr-kpi-card">
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
                  <CardTitle className="text-xs text-muted-foreground font-medium">{item.label}</CardTitle>
                  <span className="text-muted-foreground">{item.icon}</span>
                </CardHeader>
                <CardContent className="px-4 pb-3"><div className="text-xl font-bold tabular-nums">{item.value}</div></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="mwr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Savings Trend (6 months)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><LineChart data={data.savingsTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Legend /><Line type="monotone" dataKey="Savings" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="Potential" stroke="#7c3aed" strokeDasharray="5 5" /></LineChart></ResponsiveContainer></CardContent></Card>
            <Card className="mwr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.warehouseDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="warehouse" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="Overstock" fill="#d97706" stackId="a" /><Bar dataKey="Understock" fill="#dc2626" stackId="a" /><Bar dataKey="Optimal" fill="#059669" stackId="a" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* DRAWER */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mwr-drawer-header text-white px-4 py-3 rounded-lg" style={{ background: "linear-gradient(135deg, #0d9488, #134e4a)" }}>
              {drawerRecord && "transferNo" in drawerRecord ? String(drawerRecord.transferNo) : "Details"}
            </SheetTitle>
          </SheetHeader>
          {drawerRecord && (
            <div className="mt-4 px-1 space-y-4">
              {"transferNo" in drawerRecord && (
                <>
                  <div className="flex items-center justify-between">
                    <div><div className="text-lg font-bold font-mono">{String(drawerRecord.transferNo)}</div></div>
                    <TransferStatusBadge status={String(drawerRecord.status)} />
                  </div>
                  <TransferFlowIndicator source={String(drawerRecord.source)} destination={String(drawerRecord.destination)} />
                  <TransferValueTile value={Number(drawerRecord.totalValue)} qty={Number(drawerRecord.qty)} unitCost={Number(drawerRecord.unitCost)} />
                  <QtyProgressBar received={Number(drawerRecord.receivedQty)} total={Number(drawerRecord.qty)} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Priority</span><div className="font-medium"><PriorityBadge priority={String(drawerRecord.priority)} /></div></div>
                    <div><span className="text-muted-foreground">Category</span><div className="font-medium">{String(drawerRecord.category)}</div></div>
                    <div><span className="text-muted-foreground">Reason</span><div className="font-medium">{String(drawerRecord.reason)}</div></div>
                    <div><span className="text-muted-foreground">Mode</span><div className="font-medium">{String(drawerRecord.mode)}</div></div>
                    <div><span className="text-muted-foreground">ETA</span><div className="font-medium">{String(drawerRecord.eta)}</div></div>
                    <div><span className="text-muted-foreground">Transit Days</span><div className="font-medium tabular-nums">{String(drawerRecord.transitDays)}d</div></div>
                    <div><span className="text-muted-foreground">SKU</span><div className="font-mono text-[10px]">{String(drawerRecord.sku)}</div></div>
                    <div><span className="text-muted-foreground">Created</span><div className="font-medium">{String(drawerRecord.createdDate)}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="mwr-action-btn flex-1" onClick={() => { toast.success("Approved", `${drawerRecord.transferNo} approved`); setDrawerOpen(false); }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve</Button>
                    <Button size="sm" variant="outline" className="mwr-action-btn flex-1" onClick={() => { toast.info("On Hold", `${drawerRecord.transferNo} placed on hold`); setDrawerOpen(false); }}><Ban className="w-3.5 h-3.5 mr-1" />Hold</Button>
                    <Button size="sm" variant="outline" className="mwr-action-btn" onClick={() => { toast.error("Cancelled", `${drawerRecord.transferNo} cancelled`); setDrawerOpen(false); }}><XCircle className="w-3.5 h-3.5" /></Button>
                  </div>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
