"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Filter,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  XCircle,
  Timer,
  RefreshCw,
  ArrowRight,
  ArrowLeftRight,
  Database,
  Server,
  Zap,
  BarChart3,
  PieChart as PieIcon,
  AlertTriangle,
  ShieldCheck,
  Layers,
  BookOpen,
  IndianRupee,
  Percent,
  ChevronRight,
  ChevronDown,
  Play,
  Ban,
  Link2,
  Unlink,
  Edit3,
  ArrowLeftRight as SyncIcon,
  FileCheck,
  FileMinus,
  FilePlus,
  Receipt,
  RotateCcw,
  ClipboardCheck,
  Package,
  Scale,
  EyeOff,
  Hand,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast-helper";
import { cn } from "@/lib/utils";

// ============================================================================
// Seeded Random
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ============================================================================
// INR Formatter
// ============================================================================
function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const rand = seededRandom(2013510);

  const syncTypes = [
    "Inventory Push", "Inventory Pull", "Invoice Sync", "GRN Sync",
    "Dispatch Sync", "Payment Sync", "Journal Entry", "Sales Return",
    "Stock Transfer", "Price Master",
  ] as const;

  const syncStatuses = [
    "Completed", "Running", "Scheduled", "Failed", "Retry Pending",
    "Cancelled", "Paused", "Conflict",
  ] as const;

  const frequencies = [
    "Real-time", "Every 5 min", "Every 15 min", "Hourly", "Daily", "Weekly",
  ] as const;

  const directions = [
    "WMS→Tally", "Tally→WMS", "Bidirectional", "WMS→SAP", "SAP→WMS", "WMS→Zoho",
  ] as const;

  const erpTargets = [
    "Tally Prime", "Tally ERP 9", "SAP Business One", "Zoho Books", "Busy Accounting",
  ] as const;

  const wmsAccountTypes = [
    "Sales Revenue", "Purchase Cost", "Freight Charges", "Customs Duty",
    "GST Payable", "GST Receivable (ITC)", "TDS Payable", "Cash/Bank",
    "Debtors", "Creditors", "Stock-in-Trade", "Round Off",
  ] as const;

  const tallyLedgerGroups = [
    "Sales Account", "Purchase Account", "Indirect Expenses", "Indirect Incomes",
    "Duties & Taxes", "Bank Accounts", "Sundry Debtors", "Sundry Creditors",
    "Stock-in-Hand", "Cash-in-Hand", "Tax Deducted at Source", "Secured Loans",
  ] as const;

  const mappingStatuses = [
    "Auto-Matched", "Manual", "Unmapped", "Modified", "Verified",
    "Duplicate", "Archived", "Conflict",
  ] as const;

  const voucherTypes = [
    "Sales Invoice", "Purchase Invoice", "Credit Note", "Debit Note",
    "Journal Entry", "Payment Voucher", "Receipt Voucher", "Delivery Note",
    "Receipt Note", "Reversal Journal",
  ] as const;

  const voucherStatuses = [
    "Synced", "Pending", "Failed", "Partially Synced", "Approved",
    "Draft", "Reversed", "On Hold",
  ] as const;

  const voucherModes = [
    "Vatable (IGST)", "Vatable (CGST+SGST)", "Export (Zero Rated)", "Exempt",
    "Non-GST", "Reverse Charge", "SEZ", "Composition",
  ] as const;

  const productCategories = [
    "Electronics", "Textiles", "Pharma", "Auto Parts", "FMCG",
    "Industrial", "Chemicals", "Agriculture", "IT Products", "Leather",
  ] as const;

  const reconStatuses = [
    "Matched", "WMS Excess", "Tally Excess", "Value Mismatch",
    "Zero in WMS", "Zero in Tally", "Negative Variance", "Pending Sync",
  ] as const;

  const erpConnections = [
    "Tally Prime (HQ)", "Tally ERP 9 (WH-1)", "SAP B1 (Finance)",
    "Zoho Books (Sales)", "Busy Acc. (Procurement)",
  ] as const;

  const companies = [
    "AutoFlow Logistics Pvt Ltd", "Tata Steel Warehousing", "Reliance Supply Chain",
    "Mahindra Logistics Park", "BlueDart Fulfillment", "Delhivery Express WH",
    "Gati Distribution Center", "DTDC Supply Hub", "XpressBees Mega WH",
    "Ecom Express Center",
  ] as const;

  // ---- Sync Jobs (85) ----
  const syncJobs: Array<{
    id: string; type: string; direction: string; erp: string; frequency: string;
    records: number; status: string; duration: string; lastRun: string;
    progress: number; stage: string; created: string;
  }> = [];
  const stages = ["Init", "Extract", "Transform", "Load", "Verify"];
  for (let i = 0; i < 85; i++) {
    const status = syncStatuses[Math.floor(rand() * syncStatuses.length)];
    const progress = status === "Completed" ? 100 : status === "Running" ? Math.floor(rand() * 60 + 20) : 0;
    const stageIdx = status === "Completed" ? 4 : status === "Running" ? Math.min(Math.floor(progress / 25), 3) : 0;
    const d = Math.floor(rand() * 28 + 1);
    syncJobs.push({
      id: `SJ-${String(10001 + i)}`,
      type: syncTypes[Math.floor(rand() * syncTypes.length)],
      direction: directions[Math.floor(rand() * directions.length)],
      erp: erpTargets[Math.floor(rand() * erpTargets.length)],
      frequency: frequencies[Math.floor(rand() * frequencies.length)],
      records: Math.floor(rand() * 5000 + 50),
      status,
      duration: status === "Completed" ? `${Math.floor(rand() * 45 + 5)}s` : status === "Running" ? "..." : "—",
      lastRun: `2025-06-${String(d).padStart(2, "0")} ${String(Math.floor(rand() * 24)).padStart(2, "0")}:${String(Math.floor(rand() * 60)).padStart(2, "0")}`,
      progress,
      stage: stages[stageIdx],
      created: `2025-${String(Math.floor(rand() * 6 + 1)).padStart(2, "0")}-${String(Math.floor(rand() * 28 + 1)).padStart(2, "0")}`,
    });
  }

  // ---- Ledger Mappings (70) ----
  const ledgerMappings: Array<{
    id: string; wmsAccount: string; tallyLedger: string; wmsType: string;
    tallyGroup: string; status: string; confidence: number; mappedDate: string;
    lastUsed: string;
  }> = [];
  for (let i = 0; i < 70; i++) {
    const status = mappingStatuses[Math.floor(rand() * mappingStatuses.length)];
    const confidence = status === "Auto-Matched" ? Math.floor(rand() * 15 + 85) :
      status === "Manual" ? Math.floor(rand() * 20 + 70) :
      status === "Unmapped" ? 0 : Math.floor(rand() * 100);
    ledgerMappings.push({
      id: `LM-${String(2001 + i)}`,
      wmsAccount: wmsAccountTypes[Math.floor(rand() * wmsAccountTypes.length)],
      tallyLedger: tallyLedgerGroups[Math.floor(rand() * tallyLedgerGroups.length)],
      wmsType: wmsAccountTypes[Math.floor(rand() * wmsAccountTypes.length)],
      tallyGroup: tallyLedgerGroups[Math.floor(rand() * tallyLedgerGroups.length)],
      status,
      confidence,
      mappedDate: `2025-${String(Math.floor(rand() * 6 + 1)).padStart(2, "0")}-${String(Math.floor(rand() * 28 + 1)).padStart(2, "0")}`,
      lastUsed: `2025-06-${String(Math.floor(rand() * 28 + 1)).padStart(2, "0")}`,
    });
  }

  // ---- Vouchers (75) ----
  const vouchers: Array<{
    id: string; voucherNumber: string; type: string; status: string; mode: string;
    amount: number; tallyAmount: number; cgst: number; sgst: number; igst: number;
    party: string; date: string; syncDate: string; warehouse: string;
  }> = [];
  for (let i = 0; i < 75; i++) {
    const status = voucherStatuses[Math.floor(rand() * voucherStatuses.length)];
    const amount = Math.floor(rand() * 500000 + 10000);
    const tallyAmt = status === "Synced" ? amount : Math.floor(amount * (0.95 + rand() * 0.1));
    const mode = voucherModes[Math.floor(rand() * voucherModes.length)];
    const isIGST = mode === "Vatable (IGST)" || mode === "Export (Zero Rated)" || mode === "SEZ";
    vouchers.push({
      id: `V-${String(3001 + i)}`,
      voucherNumber: `VCH-${String(Math.floor(rand() * 90000 + 10000))}`,
      type: voucherTypes[Math.floor(rand() * voucherTypes.length)],
      status,
      mode,
      amount,
      tallyAmount: tallyAmt,
      cgst: isIGST ? 0 : Math.floor(amount * 0.09),
      sgst: isIGST ? 0 : Math.floor(amount * 0.09),
      igst: isIGST ? Math.floor(amount * 0.18) : 0,
      party: companies[Math.floor(rand() * companies.length)],
      date: `2025-${String(Math.floor(rand() * 6 + 1)).padStart(2, "0")}-${String(Math.floor(rand() * 28 + 1)).padStart(2, "0")}`,
      syncDate: status === "Synced" ? `2025-06-${String(Math.floor(rand() * 28 + 1)).padStart(2, "0")}` : "—",
      warehouse: `WH-${Math.floor(rand() * 5 + 1)}`,
    });
  }

  // ---- Stock Reconciliation (80) ----
  const stockItems: Array<{
    id: string; sku: string; product: string; category: string; status: string;
    wmsQty: number; tallyQty: number; wmsValue: number; tallyValue: number;
    unitPrice: number; warehouse: string; lastCounted: string;
  }> = [];
  const products = [
    "LED Panel 12W", "Cotton Fabric Roll", "Paracetamol 500mg", "Brake Pad Set",
    "Washing Powder 1kg", "Bearing 6205", "Sulfuric Acid 5L", "Rice Basmati 25kg",
    "Laptop Dell 14", "Leather Wallet", "Phone Case", "Silk Saree",
    "Amoxicillin 250mg", "Engine Oil 5L", "Soap Bar Pack", "Hydraulic Cylinder",
    "HCL 2.5L", "Wheat Flour 50kg", "Monitor 24in", "Leather Belt",
  ];
  for (let i = 0; i < 80; i++) {
    const status = reconStatuses[Math.floor(rand() * reconStatuses.length)];
    const unitPrice = Math.floor(rand() * 5000 + 100);
    const wmsQty = status === "Zero in WMS" ? 0 : Math.floor(rand() * 2000 + 10);
    const tallyQty = status === "Zero in Tally" ? 0 : status === "Matched" ? wmsQty : Math.floor(wmsQty * (0.8 + rand() * 0.4));
    stockItems.push({
      id: `SR-${String(4001 + i)}`,
      sku: `SKU-${String(Math.floor(rand() * 90000 + 10000))}`,
      product: products[Math.floor(rand() * products.length)],
      category: productCategories[Math.floor(rand() * productCategories.length)],
      status,
      wmsQty,
      tallyQty: Math.max(0, tallyQty),
      wmsValue: wmsQty * unitPrice,
      tallyValue: Math.max(0, tallyQty) * unitPrice,
      unitPrice,
      warehouse: `WH-${Math.floor(rand() * 5 + 1)}`,
      lastCounted: `2025-06-${String(Math.floor(rand() * 28 + 1)).padStart(2, "0")}`,
    });
  }

  // ---- Dashboard KPIs ----
  const kpis = {
    activeConnections: Math.floor(rand() * 3 + 3),
    jobsToday: Math.floor(rand() * 200 + 80),
    recordsSynced: Math.floor(rand() * 50000 + 10000),
    successRate: parseFloat((94 + rand() * 5).toFixed(1)),
    pendingConflicts: Math.floor(rand() * 12 + 2),
    avgLatency: parseFloat((1.2 + rand() * 4).toFixed(1)),
    lastFullSync: `2025-06-${String(Math.floor(rand() * 5 + 24)).padStart(2, "0")} ${String(Math.floor(rand() * 24)).padStart(2, "0")}:${String(Math.floor(rand() * 60)).padStart(2, "0")}`,
    integrityScore: parseFloat((96 + rand() * 3.5).toFixed(1)),
  };

  // ---- Hourly sync volume ----
  const hourlyVolume = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, "0")}:00`,
    Pushed: Math.floor(rand() * 800 + 100),
    Pulled: Math.floor(rand() * 600 + 50),
    Failed: Math.floor(rand() * 30 + 2),
  }));

  // ---- Sync status distribution ----
  const statusDist = [
    { name: "Success", value: Math.floor(rand() * 200 + 300) },
    { name: "Running", value: Math.floor(rand() * 15 + 3) },
    { name: "Failed", value: Math.floor(rand() * 20 + 5) },
    { name: "Pending", value: Math.floor(rand() * 30 + 8) },
    { name: "Retry", value: Math.floor(rand() * 10 + 2) },
    { name: "Scheduled", value: Math.floor(rand() * 40 + 10) },
  ];

  // ---- ERP uptime 7 days ----
  const erpUptime = erpConnections.map((conn) => {
    const days = Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      uptime: Math.floor(rand() * 8 + 92),
    }));
    return { connection: conn.split(" (")[0], days };
  });
  const uptimeChartData = Array.from({ length: 7 }, (_, i) => {
    const row: Record<string, string | number> = { day: `Day ${i + 1}` };
    erpConnections.forEach((conn) => {
      row[conn.split(" (")[0]] = Math.floor(rand() * 8 + 92);
    });
    return row;
  });

  // ---- Data flow by module ----
  const modules = ["Inventory", "Invoices", "GRN", "Dispatch", "Payments", "Journals"];
  const moduleFlow = modules.map((m) => ({
    module: m,
    inbound: Math.floor(rand() * 5000 + 500),
    outbound: Math.floor(rand() * 5000 + 500),
    errors: Math.floor(rand() * 200 + 10),
  }));

  // ---- Analytics data ----
  const dailySyncTrend = Array.from({ length: 30 }, (_, i) => ({
    day: `Jun ${i + 1}`,
    Success: Math.floor(rand() * 300 + 150),
    Failed: Math.floor(rand() * 20 + 3),
    Pending: Math.floor(rand() * 40 + 5),
  }));

  const errorByModule = [
    { module: "Inventory Sync", errors: Math.floor(rand() * 50 + 20) },
    { module: "Invoice Mismatch", errors: Math.floor(rand() * 40 + 15) },
    { module: "GRN Validation", errors: Math.floor(rand() * 30 + 10) },
    { module: "Payment Failures", errors: Math.floor(rand() * 25 + 8) },
    { module: "Journal Posting", errors: Math.floor(rand() * 20 + 5) },
    { module: "Stock Transfer", errors: Math.floor(rand() * 18 + 4) },
    { module: "GST Calculation", errors: Math.floor(rand() * 15 + 3) },
    { module: "Batch Sync Error", errors: Math.floor(rand() * 12 + 2) },
    { module: "Network Timeout", errors: Math.floor(rand() * 10 + 3) },
    { module: "Auth Failure", errors: Math.floor(rand() * 8 + 1) },
  ];

  const directionFlowPie = [
    { name: "WMS→ERP", value: Math.floor(rand() * 40 + 30) },
    { name: "ERP→WMS", value: Math.floor(rand() * 30 + 20) },
    { name: "Bidirectional", value: Math.floor(rand() * 15 + 5) },
  ];

  const monthlyPerformance = [
    { month: "Jan", rate: Math.floor(rand() * 10 + 85) },
    { month: "Feb", rate: Math.floor(rand() * 10 + 86) },
    { month: "Mar", rate: Math.floor(rand() * 10 + 88) },
    { month: "Apr", rate: Math.floor(rand() * 8 + 89) },
    { month: "May", rate: Math.floor(rand() * 6 + 91) },
    { month: "Jun", rate: Math.floor(rand() * 4 + 93) },
  ];

  const analyticsKpis = {
    totalSyncs24h: Math.floor(rand() * 5000 + 3000),
    errorRate: parseFloat((1.2 + rand() * 3).toFixed(1)),
    avgLatency: parseFloat((1.5 + rand() * 3).toFixed(1)),
    dataConflicts: Math.floor(rand() * 15 + 3),
    erpHealthScore: Math.floor(rand() * 8 + 90),
    recordsProcessed: Math.floor(rand() * 80000 + 20000),
    failedJobs: Math.floor(rand() * 20 + 3),
    autoMatchRate: parseFloat((72 + rand() * 20).toFixed(1)),
  };

  return {
    syncJobs, ledgerMappings, vouchers, stockItems, kpis, hourlyVolume,
    statusDist, uptimeChartData, moduleFlow, erpConnections,
    dailySyncTrend, errorByModule, directionFlowPie, monthlyPerformance,
    analyticsKpis, syncTypes, syncStatuses, frequencies, directions,
    erpTargets, wmsAccountTypes, tallyLedgerGroups, mappingStatuses,
    voucherTypes, voucherStatuses, voucherModes, productCategories, reconStatuses,
  };
}

type Data = ReturnType<typeof generateData>;

// ============================================================================
// Color Maps
// ============================================================================
const SYNC_STATUS_COLORS: Record<string, string> = {
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700",
  Running: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-300 dark:border-cyan-700 tie-running-pulse",
  Scheduled: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600",
  Failed: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-300 dark:border-red-700",
  "Retry Pending": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-700",
  Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-300 dark:border-rose-700",
  Paused: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-300 dark:border-orange-700",
  Conflict: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border-violet-300 dark:border-violet-700",
};

const MAPPING_STATUS_COLORS: Record<string, string> = {
  "Auto-Matched": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700",
  Manual: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-300 dark:border-sky-700",
  Unmapped: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-600",
  Modified: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-700",
  Verified: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-300 dark:border-teal-700",
  Duplicate: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-300 dark:border-rose-700",
  Archived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-600",
  Conflict: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border-violet-300 dark:border-violet-700",
};

const VOUCHER_STATUS_COLORS: Record<string, string> = {
  Synced: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-700",
  Failed: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-300 dark:border-red-700",
  "Partially Synced": "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-300 dark:border-orange-700",
  Approved: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-300 dark:border-teal-700",
  Draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-600",
  Reversed: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-300 dark:border-rose-700",
  "On Hold": "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border-violet-300 dark:border-violet-700",
};

const STOCK_STATUS_COLORS: Record<string, string> = {
  Matched: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700",
  "WMS Excess": "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-300 dark:border-cyan-700",
  "Tally Excess": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-700",
  "Value Mismatch": "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-300 dark:border-orange-700",
  "Zero in WMS": "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-300 dark:border-red-700",
  "Zero in Tally": "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-300 dark:border-rose-700",
  "Negative Variance": "bg-red-200 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-400 dark:border-red-600",
  "Pending Sync": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-600",
};

const ERP_COLORS: Record<string, string> = {
  "Tally Prime": "bg-slate-700 text-white dark:bg-slate-600",
  "Tally ERP 9": "bg-slate-500 text-white dark:bg-slate-500",
  "SAP Business One": "bg-blue-700 text-white dark:bg-blue-800",
  "Zoho Books": "bg-red-600 text-white dark:bg-red-700",
  "Busy Accounting": "bg-purple-600 text-white dark:bg-purple-700",
};

const DIRECTION_ARROWS: Record<string, string> = {
  "WMS→Tally": "→",
  "Tally→WMS": "←",
  "Bidirectional": "↔",
  "WMS→SAP": "→",
  "SAP→WMS": "←",
  "WMS→Zoho": "→",
};

const DIRECTION_COLORS: Record<string, string> = {
  "WMS→Tally": "text-orange-600 dark:text-orange-400",
  "Tally→WMS": "text-teal-600 dark:text-teal-400",
  "Bidirectional": "text-violet-600 dark:text-violet-400",
  "WMS→SAP": "text-blue-600 dark:text-blue-400",
  "SAP→WMS": "text-cyan-600 dark:text-cyan-400",
  "WMS→Zoho": "text-red-600 dark:text-red-400",
};

const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  "Sales Revenue": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  "Purchase Cost": "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  "Freight Charges": "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  "Customs Duty": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  "GST Payable": "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-500",
  "GST Receivable (ITC)": "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  "TDS Payable": "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  "Cash/Bank": "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
  "Debtors": "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  "Creditors": "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  "Stock-in-Trade": "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
  "Round Off": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
  Textiles: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400",
  Pharma: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  "Auto Parts": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  FMCG: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  Industrial: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Chemicals: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  Agriculture: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  "IT Products": "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  Leather: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-500",
};

const PIE_COLORS = ["#c2410c", "#0d9488", "#334155", "#d97706", "#f97316", "#64748b"];
const PIE_COLORS_LIGHT = ["#10b981", "#06b6d4", "#64748b", "#ef4444", "#f59e0b", "#a855f7"];

// ============================================================================
// Sub-components (outside main function, no toast access)
// ============================================================================

function SyncStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium border px-2 py-0.5 tie-badge-shimmer", SYNC_STATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>
      {status}
    </Badge>
  );
}

function SyncProgressBar({ progress, stage }: { progress: number; stage: string }) {
  const stages = ["Init", "Extract", "Transform", "Load", "Verify"];
  const stageIdx = stages.indexOf(stage);
  return (
    <div className="tie-progress-bar">
      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
        {stages.map((s, i) => (
          <span key={s} className={cn(i <= stageIdx && "text-orange-700 dark:text-orange-400 font-semibold")}>{s}</span>
        ))}
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full tie-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-right text-[10px] text-muted-foreground mt-0.5">{progress}%</div>
    </div>
  );
}

function DirectionBadge({ direction }: { direction: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-mono font-bold", DIRECTION_COLORS[direction])}>
      {DIRECTION_ARROWS[direction] || "→"} {direction.split("→")[0].trim()}
    </span>
  );
}

function FrequencyBadge({ freq }: { freq: string }) {
  const colors: Record<string, string> = {
    "Real-time": "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30",
    "Every 5 min": "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
    "Every 15 min": "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30",
    "Hourly": "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
    "Daily": "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30",
    "Weekly": "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full font-medium", colors[freq] || "")}>
      <Clock className="w-3 h-3" /> {freq}
    </span>
  );
}

function ERPBadge({ erp }: { erp: string }) {
  return (
    <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-semibold", ERP_COLORS[erp] || "bg-gray-500 text-white")}>
      {erp}
    </span>
  );
}

function MappingStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium border px-2 py-0.5", MAPPING_STATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>
      {status}
    </Badge>
  );
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const color = confidence >= 100 ? "bg-emerald-500" :
    confidence >= 90 ? "bg-cyan-500" :
    confidence >= 70 ? "bg-amber-500" :
    confidence >= 50 ? "bg-orange-500" : "bg-red-500";
  const label = confidence >= 100 ? "Exact" :
    confidence >= 90 ? "High" :
    confidence >= 70 ? "Medium" :
    confidence >= 50 ? "Low" : "No Match";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-muted-foreground">Confidence</span>
        <span className={cn("font-bold", color.replace("bg-", "text-").replace("-500", "-600"))}>{confidence}% — {label}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full tie-confidence-fill", color)} style={{ width: `${confidence}%` }} />
      </div>
    </div>
  );
}

function LedgerPairCard({ wms, tally, confidence }: { wms: string; tally: string; confidence: number }) {
  return (
    <Card className="tie-ledger-pair-card border-2">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-center flex-1">
            <div className="text-[10px] text-muted-foreground uppercase">WMS Account</div>
            <div className="text-sm font-semibold text-orange-700 dark:text-orange-400">{wms}</div>
          </div>
          <ArrowLeftRight className="w-5 h-5 text-muted-foreground shrink-0" />
          <div className="text-center flex-1">
            <div className="text-[10px] text-muted-foreground uppercase">Tally Ledger</div>
            <div className="text-sm font-semibold text-teal-700 dark:text-teal-400">{tally}</div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <span className={cn("text-xs font-bold", confidence >= 90 ? "text-emerald-600" : confidence >= 70 ? "text-amber-600" : "text-red-600")}>
            {confidence}% Match
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function AccountTypeBadge({ type }: { type: string }) {
  return (
    <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium", ACCOUNT_TYPE_COLORS[type] || "bg-gray-100 text-gray-600")}>
      {type}
    </span>
  );
}

function VoucherStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium border px-2 py-0.5", VOUCHER_STATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>
      {status}
    </Badge>
  );
}

function VoucherModeBadge({ mode }: { mode: string }) {
  const colors: Record<string, string> = {
    "Vatable (IGST)": "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    "Vatable (CGST+SGST)": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    "Export (Zero Rated)": "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400",
    "Exempt": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    "Non-GST": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    "Reverse Charge": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    "SEZ": "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    "Composition": "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  };
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border px-1.5 py-0.5", colors[mode] || "bg-gray-100 text-gray-600")}>
      {mode}
    </Badge>
  );
}

function GSTModeTile({ cgst, sgst, igst }: { cgst: number; sgst: number; igst: number }) {
  const total = cgst + sgst + igst;
  return (
    <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-teal-200 dark:border-teal-800">
      <CardContent className="p-3 space-y-2">
        <div className="text-[10px] text-muted-foreground uppercase font-semibold">GST Breakdown</div>
        <div className="flex gap-2">
          {cgst > 0 && (
            <div className="flex-1 text-center">
              <div className="text-[10px] text-muted-foreground">CGST</div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{formatINR(cgst)}</div>
              <div className="h-1 bg-emerald-200 dark:bg-emerald-800 rounded-full mt-0.5"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(cgst / total) * 100}%` }} /></div>
            </div>
          )}
          {sgst > 0 && (
            <div className="flex-1 text-center">
              <div className="text-[10px] text-muted-foreground">SGST</div>
              <div className="text-xs font-bold text-teal-700 dark:text-teal-400">{formatINR(sgst)}</div>
              <div className="h-1 bg-teal-200 dark:bg-teal-800 rounded-full mt-0.5"><div className="h-full bg-teal-500 rounded-full" style={{ width: `${(sgst / total) * 100}%` }} /></div>
            </div>
          )}
          {igst > 0 && (
            <div className="flex-1 text-center">
              <div className="text-[10px] text-muted-foreground">IGST</div>
              <div className="text-xs font-bold text-blue-700 dark:text-blue-400">{formatINR(igst)}</div>
              <div className="h-1 bg-blue-200 dark:bg-blue-800 rounded-full mt-0.5"><div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }} /></div>
            </div>
          )}
        </div>
        <div className="text-center text-xs font-semibold">Total: {formatINR(total)}</div>
      </CardContent>
    </Card>
  );
}

function AmountSyncIndicator({ wmsAmt, tallyAmt }: { wmsAmt: number; tallyAmt: number }) {
  const matched = wmsAmt === tallyAmt;
  const diff = wmsAmt - tallyAmt;
  return (
    <Card className={cn("border", matched ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20")}>
      <CardContent className="p-3 flex items-center justify-between">
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground">WMS</div>
          <div className="text-sm font-bold tabular-nums">{formatINR(wmsAmt)}</div>
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-bold", matched ? "text-emerald-600" : "text-red-600")}>
          {matched ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {matched ? "Match" : `${diff > 0 ? "+" : ""}${formatINR(diff)}`}
        </div>
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground">Tally</div>
          <div className="text-sm font-bold tabular-nums">{formatINR(tallyAmt)}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function VoucherTypeIcon({ type }: { type: string }) {
  const icons: Record<string, { icon: React.ElementType; color: string }> = {
    "Sales Invoice": { icon: FileCheck, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    "Purchase Invoice": { icon: FilePlus, color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
    "Credit Note": { icon: FileMinus, color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
    "Debit Note": { icon: FileMinus, color: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
    "Journal Entry": { icon: BookOpen, color: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400" },
    "Payment Voucher": { icon: Receipt, color: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400" },
    "Receipt Voucher": { icon: Receipt, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400" },
    "Delivery Note": { icon: Package, color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
    "Receipt Note": { icon: ClipboardCheck, color: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" },
    "Reversal Journal": { icon: RotateCcw, color: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400" },
  };
  const { icon: Icon, color } = icons[type] || { icon: FileText, color: "bg-gray-100 text-gray-600" };
  return (
    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center tie-voucher-icon", color)}>
      <Icon className="w-4 h-4" />
    </div>
  );
}

function StockStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium border px-2 py-0.5", STOCK_STATUS_COLORS[status] || "bg-gray-100 text-gray-600")}>
      {status}
    </Badge>
  );
}

function VarianceTile({ wmsQty, tallyQty }: { wmsQty: number; tallyQty: number }) {
  const matched = wmsQty === tallyQty;
  const diff = wmsQty - tallyQty;
  return (
    <div className={cn("rounded-lg p-3 text-center", matched ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800")}>
      <div className="flex items-center justify-center gap-4">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">WMS</div>
          <div className={cn("text-lg font-bold tabular-nums", matched ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>{wmsQty.toLocaleString("en-IN")}</div>
        </div>
        <div className="text-muted-foreground">vs</div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">Tally</div>
          <div className={cn("text-lg font-bold tabular-nums", matched ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400")}>{tallyQty.toLocaleString("en-IN")}</div>
        </div>
      </div>
      <div className={cn("text-xs font-bold mt-1 tie-variance-pulse", matched ? "text-emerald-600" : diff > 0 ? "text-cyan-600" : "text-red-600")}>
        {matched ? "✓ Matched" : `Δ ${diff > 0 ? "+" : ""}${diff.toLocaleString("en-IN")}`}
      </div>
    </div>
  );
}

function ValueComparisonBar({ wmsVal, tallyVal }: { wmsVal: number; tallyVal: number }) {
  const max = Math.max(wmsVal, tallyVal, 1);
  return (
    <div className="space-y-2">
      <div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">WMS Value</span>
          <span className="font-bold text-orange-700 dark:text-orange-400">{formatINR(wmsVal)}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full tie-value-bar" style={{ width: `${(wmsVal / max) * 100}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Tally Value</span>
          <span className="font-bold text-teal-700 dark:text-teal-400">{formatINR(tallyVal)}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full tie-value-bar" style={{ width: `${(tallyVal / max) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function CategoryFilterPill({ category, active, onClick }: { category: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-[11px] px-2.5 py-1 rounded-full font-medium border transition-all",
        active
          ? cn("tie-category-pill-active", CATEGORY_COLORS[category] || "bg-orange-100 text-orange-700")
          : "bg-white dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
      )}
    >
      {category}
    </button>
  );
}

function HealthGaugeSVG({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#10b981" : score >= 75 ? "#d97706" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" className="dark:stroke-slate-700" />
        <circle cx="80" cy="80" r={radius} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 80 80)" className="transition-all duration-1000" />
        <text x="80" y="72" textAnchor="middle" className="fill-foreground text-3xl font-bold" fontSize="32" fontWeight="bold">{score}</text>
        <text x="80" y="96" textAnchor="middle" className="fill-muted-foreground" fontSize="12">Health Score</text>
      </svg>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================
export default function TallyIntegrationERPView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortCol, setSortCol] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<Record<string, unknown> | null>(null);
  const [drawerTab, setDrawerTab] = useState<string>("jobs");

  const data = useMemo(() => generateData(), []);

  const handleSort = useCallback((col: string) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }, [sortCol]);

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown className="w-3 h-3 text-muted-foreground" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 text-orange-600" /> : <ArrowDown className="w-3 h-3 text-orange-600" />;
  };

  // ---- Filtered data ----
  const filteredJobs = useMemo(() => {
    let arr = [...data.syncJobs];
    if (search) arr = arr.filter((j) => j.id.toLowerCase().includes(search.toLowerCase()) || j.type.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") arr = arr.filter((j) => j.status === statusFilter);
    if (sortCol) {
      arr.sort((a, b) => {
        const va = String((a as Record<string, unknown>)[sortCol] ?? "");
        const vb = String((b as Record<string, unknown>)[sortCol] ?? "");
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return arr;
  }, [data.syncJobs, search, statusFilter, sortCol, sortDir]);

  const filteredMappings = useMemo(() => {
    let arr = [...data.ledgerMappings];
    if (search) arr = arr.filter((m) => m.wmsAccount.toLowerCase().includes(search.toLowerCase()) || m.tallyLedger.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") arr = arr.filter((m) => m.status === statusFilter);
    return arr;
  }, [data.ledgerMappings, search, statusFilter]);

  const filteredVouchers = useMemo(() => {
    let arr = [...data.vouchers];
    if (search) arr = arr.filter((v) => v.voucherNumber.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") arr = arr.filter((v) => v.status === statusFilter);
    if (sortCol) {
      arr.sort((a, b) => {
        const va = String((a as Record<string, unknown>)[sortCol] ?? "");
        const vb = String((b as Record<string, unknown>)[sortCol] ?? "");
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return arr;
  }, [data.vouchers, search, statusFilter, sortCol, sortDir]);

  const filteredStock = useMemo(() => {
    let arr = [...data.stockItems];
    if (search) arr = arr.filter((s) => s.sku.toLowerCase().includes(search.toLowerCase()) || s.product.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") arr = arr.filter((s) => s.status === statusFilter);
    if (sortCol) {
      arr.sort((a, b) => {
        const va = String((a as Record<string, unknown>)[sortCol] ?? "");
        const vb = String((b as Record<string, unknown>)[sortCol] ?? "");
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return arr;
  }, [data.stockItems, search, statusFilter, sortCol, sortDir]);

  const openDrawer = useCallback((record: Record<string, unknown>, tab: string) => {
    setDrawerRecord(record);
    setDrawerTab(tab);
    setDrawerOpen(true);
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Tally Integration & ERP Sync"
        description="Manage data synchronization between WMS and Tally/SAP/Zoho ERP systems"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="tie-action-btn" onClick={() => toast.info("Sync Initiated", "Full sync started across all ERP connections")}>
              <RefreshCw className="w-4 h-4 mr-1" /> Force Sync All
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearch(""); setStatusFilter("all"); setSortCol(""); }}>
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          {[
            { value: "dashboard", label: "Sync Dashboard" },
            { value: "jobs", label: "Sync Jobs" },
            { value: "ledger", label: "Ledger Mapping" },
            { value: "voucher", label: "Voucher Sync" },
            { value: "stock", label: "Stock Reconciliation" },
            { value: "analytics", label: "Integration Analytics" },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="tie-tab-trigger">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ============ TAB 0: Sync Dashboard ============ */}
        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Active Connections", value: data.kpis.activeConnections, suffix: "", color: "border-l-orange-500", icon: <Server className="w-4 h-4 text-orange-600" /> },
              { label: "Sync Jobs Today", value: data.kpis.jobsToday, suffix: "", color: "border-l-teal-500", icon: <SyncIcon className="w-4 h-4 text-teal-600" /> },
              { label: "Records Synced", value: data.kpis.recordsSynced, suffix: "", color: "border-l-slate-500", icon: <Database className="w-4 h-4 text-slate-600" /> },
              { label: "Success Rate", value: `${data.kpis.successRate}%`, suffix: "", color: "border-l-emerald-500", icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: "Pending Conflicts", value: data.kpis.pendingConflicts, suffix: "", color: "border-l-amber-500", icon: <AlertTriangle className="w-4 h-4 text-amber-600" /> },
              { label: "Avg Latency", value: `${data.kpis.avgLatency}s`, suffix: "", color: "border-l-cyan-500", icon: <Timer className="w-4 h-4 text-cyan-600" /> },
              { label: "Last Full Sync", value: data.kpis.lastFullSync, suffix: "", color: "border-l-violet-500", icon: <Clock className="w-4 h-4 text-violet-600" /> },
              { label: "Integrity Score", value: `${data.kpis.integrityScore}%`, suffix: "", color: "border-l-rose-500", icon: <ShieldCheck className="w-4 h-4 text-rose-600" /> },
            ].map((kpi, i) => (
              <Card key={kpi.label} className={cn("tie-kpi-card", kpi.color)} style={{ animationDelay: `${i * 50}ms` }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="tie-counter-value">
                      <div className="text-xl font-bold tabular-nums">{typeof kpi.value === "number" ? kpi.value.toLocaleString("en-IN") : kpi.value}</div>
                      <div className="text-[11px] text-muted-foreground">{kpi.label}</div>
                    </div>
                    {kpi.icon}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="tie-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Hourly Sync Volume Today</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.hourlyVolume}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="Pushed" stackId="1" stroke="#c2410c" fill="#fed7aa" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="Pulled" stackId="1" stroke="#0d9488" fill="#99f6e4" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="Failed" stackId="1" stroke="#ef4444" fill="#fecaca" fillOpacity={0.7} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="tie-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Job Status Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.statusDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                      {data.statusDist.map((_, i) => <Cell key={i} fill={PIE_COLORS_LIGHT[i % PIE_COLORS_LIGHT.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="tie-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">ERP Connection Uptime (7 Days)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.uptimeChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis domain={[85, 100]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {["Tally Prime", "Tally ERP 9", "SAP B1", "Zoho Books", "Busy Acc."].map((name, i) => (
                      <Bar key={name} dataKey={name} fill={["#c2410c", "#334155", "#0d9488", "#d97706", "#f97316"][i]} radius={[2, 2, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="tie-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Data Flow by Module</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.moduleFlow} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="module" type="category" width={80} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="inbound" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="outbound" stackId="a" fill="#c2410c" radius={[0, 2, 2, 0]} />
                    <Bar dataKey="errors" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ TAB 1: Sync Jobs ============ */}
        <TabsContent value="jobs" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by Job ID or type..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setStatusFilter("all")} className={cn("text-[11px] px-2.5 py-1 rounded-full border", statusFilter === "all" ? "bg-orange-700 text-white border-orange-700" : "bg-white dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700")}>All</button>
              {[...data.syncStatuses].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={cn("text-[11px] px-2.5 py-1 rounded-full border", statusFilter === s ? "bg-orange-700 text-white border-orange-700" : "bg-white dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <div className="max-h-[480px] overflow-y-auto tie-table-scroll">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10">
                  <tr>
                    {[
                      { key: "id", label: "Job ID" },
                      { key: "type", label: "Type" },
                      { key: "direction", label: "Direction" },
                      { key: "erp", label: "ERP" },
                      { key: "frequency", label: "Freq." },
                      { key: "records", label: "Records" },
                      { key: "status", label: "Status" },
                      { key: "duration", label: "Duration" },
                      { key: "lastRun", label: "Last Run" },
                      { key: "actions", label: "Actions" },
                    ].map((col) => (
                      <th key={col.key} className="tie-sort-header px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase whitespace-nowrap cursor-pointer select-none" onClick={() => col.key !== "actions" && handleSort(col.key)}>
                        <span className="flex items-center gap-1">{col.label} {col.key !== "actions" && <SortIcon col={col.key} />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job, idx) => (
                    <tr key={job.id} className={cn("tie-jobs-row border-t border-slate-100 dark:border-slate-800", idx % 2 === 1 && "bg-slate-50/50 dark:bg-slate-900/30")}>
                      <td className="px-3 py-2 font-mono text-xs font-semibold">{job.id}</td>
                      <td className="px-3 py-2 text-xs">{job.type}</td>
                      <td className="px-3 py-2"><DirectionBadge direction={job.direction} /></td>
                      <td className="px-3 py-2"><ERPBadge erp={job.erp} /></td>
                      <td className="px-3 py-2"><FrequencyBadge freq={job.frequency} /></td>
                      <td className="px-3 py-2 text-xs tabular-nums">{job.records.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2"><SyncStatusBadge status={job.status} /></td>
                      <td className="px-3 py-2 text-xs tabular-nums">{job.duration}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{job.lastRun}</td>
                      <td className="px-3 py-2">
                        <Button size="sm" variant="ghost" className="tie-action-btn h-7 px-2" onClick={() => openDrawer(job, "jobs")}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ============ TAB 2: Ledger Mapping ============ */}
        <TabsContent value="ledger" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by account name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setStatusFilter("all")} className={cn("text-[11px] px-2.5 py-1 rounded-full border", statusFilter === "all" ? "bg-slate-700 text-white border-slate-700" : "bg-white dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700")}>All</button>
              {[...data.mappingStatuses].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={cn("text-[11px] px-2.5 py-1 rounded-full border", statusFilter === s ? "bg-slate-700 text-white border-slate-700" : "bg-white dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 tie-ledger-grid">
            {filteredMappings.map((map) => (
              <Card key={map.id} className="tie-ledger-card hover:shadow-md transition-shadow cursor-pointer" onClick={() => openDrawer(map, "ledger")}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">{map.id}</span>
                    <MappingStatusBadge status={map.status} />
                  </div>
                  <LedgerPairCard wms={map.wmsAccount} tally={map.tallyLedger} confidence={map.confidence} />
                  <ConfidenceBar confidence={map.confidence} />
                  <div className="flex flex-wrap gap-1">
                    <AccountTypeBadge type={map.wmsType} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ============ TAB 3: Voucher Sync ============ */}
        <TabsContent value="voucher" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by voucher number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setStatusFilter("all")} className={cn("text-[11px] px-2.5 py-1 rounded-full border", statusFilter === "all" ? "bg-teal-700 text-white border-teal-700" : "bg-white dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700")}>All</button>
              {[...data.voucherStatuses].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={cn("text-[11px] px-2.5 py-1 rounded-full border", statusFilter === s ? "bg-teal-700 text-white border-teal-700" : "bg-white dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <div className="max-h-[480px] overflow-y-auto tie-table-scroll">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10">
                  <tr>
                    {[
                      { key: "id", label: "Voucher #" },
                      { key: "type", label: "Type" },
                      { key: "status", label: "Status" },
                      { key: "mode", label: "GST Mode" },
                      { key: "amount", label: "WMS Amount" },
                      { key: "tallyAmount", label: "Tally Amount" },
                      { key: "party", label: "Party" },
                      { key: "date", label: "Date" },
                      { key: "syncDate", label: "Sync Date" },
                      { key: "actions", label: "Actions" },
                    ].map((col) => (
                      <th key={col.key} className="tie-sort-header px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase whitespace-nowrap cursor-pointer select-none" onClick={() => col.key !== "actions" && handleSort(col.key)}>
                        <span className="flex items-center gap-1">{col.label} {col.key !== "actions" && <SortIcon col={col.key} />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredVouchers.map((v, idx) => (
                    <tr key={v.id} className={cn("tie-voucher-row border-t border-slate-100 dark:border-slate-800", idx % 2 === 1 && "bg-slate-50/50 dark:bg-slate-900/30")}>
                      <td className="px-3 py-2 flex items-center gap-2"><VoucherTypeIcon type={v.type} /><span className="font-mono text-xs">{v.voucherNumber}</span></td>
                      <td className="px-3 py-2 text-xs">{v.type}</td>
                      <td className="px-3 py-2"><VoucherStatusBadge status={v.status} /></td>
                      <td className="px-3 py-2"><VoucherModeBadge mode={v.mode} /></td>
                      <td className="px-3 py-2 text-xs tabular-nums font-semibold">{formatINR(v.amount)}</td>
                      <td className={cn("px-3 py-2 text-xs tabular-nums", v.amount === v.tallyAmount ? "text-emerald-600" : "text-red-600")}>{formatINR(v.tallyAmount)}</td>
                      <td className="px-3 py-2 text-xs max-w-[120px] truncate">{v.party}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{v.date}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{v.syncDate}</td>
                      <td className="px-3 py-2">
                        <Button size="sm" variant="ghost" className="tie-action-btn h-7 px-2" onClick={() => openDrawer(v, "voucher")}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ============ TAB 4: Stock Reconciliation ============ */}
        <TabsContent value="stock" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by SKU or product..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setStatusFilter("all")} className={cn("text-[11px] px-2.5 py-1 rounded-full border", statusFilter === "all" ? "bg-amber-600 text-white border-amber-600" : "bg-white dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700")}>All</button>
              {[...data.reconStatuses].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={cn("text-[11px] px-2.5 py-1 rounded-full border", statusFilter === s ? "bg-amber-600 text-white border-amber-600" : "bg-white dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[...data.productCategories].map((cat) => (
              <CategoryFilterPill key={cat} category={cat} active={statusFilter === cat} onClick={() => setStatusFilter(statusFilter === cat ? "all" : cat)} />
            ))}
          </div>
          <div className="rounded-lg border overflow-hidden">
            <div className="max-h-[480px] overflow-y-auto tie-table-scroll">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10">
                  <tr>
                    {[
                      { key: "sku", label: "SKU" },
                      { key: "product", label: "Product" },
                      { key: "category", label: "Category" },
                      { key: "status", label: "Status" },
                      { key: "wmsQty", label: "WMS Qty" },
                      { key: "tallyQty", label: "Tally Qty" },
                      { key: "variance", label: "Variance" },
                      { key: "wmsValue", label: "WMS Value" },
                      { key: "tallyValue", label: "Tally Value" },
                      { key: "actions", label: "Actions" },
                    ].map((col) => (
                      <th key={col.key} className="tie-sort-header px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase whitespace-nowrap cursor-pointer select-none" onClick={() => col.key !== "actions" && col.key !== "variance" && handleSort(col.key)}>
                        <span className="flex items-center gap-1">{col.label} {col.key !== "actions" && col.key !== "variance" && <SortIcon col={col.key} />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStock.map((item, idx) => {
                    const diff = item.wmsQty - item.tallyQty;
                    return (
                      <tr key={item.id} className={cn("tie-stock-row border-t border-slate-100 dark:border-slate-800", idx % 2 === 1 && "bg-slate-50/50 dark:bg-slate-900/30")}>
                        <td className="px-3 py-2 font-mono text-xs">{item.sku}</td>
                        <td className="px-3 py-2 text-xs font-medium">{item.product}</td>
                        <td className="px-3 py-2"><span className={cn("text-[11px] px-1.5 py-0.5 rounded-full", CATEGORY_COLORS[item.category] || "")}>{item.category}</span></td>
                        <td className="px-3 py-2"><StockStatusBadge status={item.status} /></td>
                        <td className="px-3 py-2 text-xs tabular-nums">{item.wmsQty.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2 text-xs tabular-nums">{item.tallyQty.toLocaleString("en-IN")}</td>
                        <td className={cn("px-3 py-2 text-xs font-bold tabular-nums", diff === 0 ? "text-emerald-600" : diff > 0 ? "text-cyan-600" : "text-red-600")}>
                          {diff === 0 ? "—" : `${diff > 0 ? "+" : ""}${diff.toLocaleString("en-IN")}`}
                        </td>
                        <td className="px-3 py-2 text-xs tabular-nums">{formatINR(item.wmsValue)}</td>
                        <td className="px-3 py-2 text-xs tabular-nums">{formatINR(item.tallyValue)}</td>
                        <td className="px-3 py-2">
                          <Button size="sm" variant="ghost" className="tie-action-btn h-7 px-2" onClick={() => openDrawer(item, "stock")}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ============ TAB 5: Integration Analytics ============ */}
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Syncs (24h)", value: data.analyticsKpis.totalSyncs24h.toLocaleString("en-IN"), color: "border-l-orange-500" },
              { label: "Error Rate", value: `${data.analyticsKpis.errorRate}%`, color: "border-l-red-500" },
              { label: "Avg Latency", value: `${data.analyticsKpis.avgLatency}s`, color: "border-l-cyan-500" },
              { label: "Data Conflicts", value: data.analyticsKpis.dataConflicts.toString(), color: "border-l-amber-500" },
              { label: "ERP Health Score", value: `${data.analyticsKpis.erpHealthScore}%`, color: "border-l-emerald-500" },
              { label: "Records (24h)", value: data.analyticsKpis.recordsProcessed.toLocaleString("en-IN"), color: "border-l-teal-500" },
              { label: "Failed Jobs", value: data.analyticsKpis.failedJobs.toString(), color: "border-l-rose-500" },
              { label: "Auto-Match Rate", value: `${data.analyticsKpis.autoMatchRate}%`, color: "border-l-violet-500" },
            ].map((kpi, i) => (
              <Card key={kpi.label} className={cn("tie-analytics-card", kpi.color)} style={{ animationDelay: `${i * 50}ms` }}>
                <CardContent className="p-4">
                  <div className="tie-counter-value">
                    <div className="text-xl font-bold tabular-nums">{kpi.value}</div>
                    <div className="text-[11px] text-muted-foreground">{kpi.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="tie-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">30-Day Sync Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.dailySyncTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={4} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="Success" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Failed" stroke="#ef4444" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Pending" stroke="#d97706" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="tie-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Error by Module (Top 10)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.errorByModule} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="module" type="category" width={110} tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Bar dataKey="errors" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="tie-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">ERP Connection Health</CardTitle></CardHeader>
              <CardContent className="flex justify-center">
                <HealthGaugeSVG score={data.analyticsKpis.erpHealthScore} />
              </CardContent>
            </Card>
            <Card className="tie-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Data Flow by Direction</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data.directionFlowPie} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                      {data.directionFlowPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="tie-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Sync Performance</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="rate" stroke="#0d9488" fill="#99f6e4" fillOpacity={0.6} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ============ DRAWER ============ */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto p-0">
          <SheetHeader>
            <SheetTitle className="sr-only">Detail View</SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-4">
            {/* Jobs Drawer */}
            {drawerTab === "jobs" && drawerRecord && (
              <>
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">{String(drawerRecord.id)}</div>
                      <div className="text-sm opacity-90">{String(drawerRecord.type)}</div>
                    </div>
                    <SyncStatusBadge status={String(drawerRecord.status)} />
                  </div>
                </div>
                <SyncProgressBar progress={Number(drawerRecord.progress)} stage={String(drawerRecord.stage)} />
                <div className="flex items-center gap-2 flex-wrap">
                  <DirectionBadge direction={String(drawerRecord.direction)} />
                  <ERPBadge erp={String(drawerRecord.erp)} />
                  <FrequencyBadge freq={String(drawerRecord.frequency)} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Records</span><div className="font-semibold tabular-nums">{Number(drawerRecord.records).toLocaleString("en-IN")}</div></div>
                  <div><span className="text-muted-foreground">Duration</span><div className="font-semibold">{String(drawerRecord.duration)}</div></div>
                  <div><span className="text-muted-foreground">Last Run</span><div className="font-semibold">{String(drawerRecord.lastRun)}</div></div>
                  <div><span className="text-muted-foreground">Created</span><div className="font-semibold">{String(drawerRecord.created)}</div></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="tie-action-btn flex-1" onClick={() => { toast.success("Sync Job Started", `${drawerRecord.id} is now running`); setDrawerOpen(false); }}><Play className="w-3.5 h-3.5 mr-1" /> Run</Button>
                  <Button size="sm" variant="outline" className="tie-action-btn flex-1" onClick={() => { toast.warning("Job Cancelled", `${drawerRecord.id} has been cancelled`); setDrawerOpen(false); }}><Ban className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                  <Button size="sm" variant="outline" className="tie-action-btn" onClick={() => toast.info("Viewing Log", `Opening sync log for ${drawerRecord.id}`)}><Eye className="w-3.5 h-3.5" /></Button>
                </div>
              </>
            )}

            {/* Ledger Drawer */}
            {drawerTab === "ledger" && drawerRecord && (
              <>
                <div className="bg-gradient-to-r from-slate-700 to-gray-800 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">{String(drawerRecord.id)}</div>
                      <div className="text-sm opacity-90">Ledger Mapping</div>
                    </div>
                    <MappingStatusBadge status={String(drawerRecord.status)} />
                  </div>
                </div>
                <ConfidenceBar confidence={Number(drawerRecord.confidence)} />
                <LedgerPairCard wms={String(drawerRecord.wmsAccount)} tally={String(drawerRecord.tallyLedger)} confidence={Number(drawerRecord.confidence)} />
                <div className="flex flex-wrap gap-1">
                  <AccountTypeBadge type={String(drawerRecord.wmsType)} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">WMS Type</span><div className="font-medium">{String(drawerRecord.wmsType)}</div></div>
                  <div><span className="text-muted-foreground">Tally Group</span><div className="font-medium">{String(drawerRecord.tallyGroup)}</div></div>
                  <div><span className="text-muted-foreground">Mapped Date</span><div className="font-medium">{String(drawerRecord.mappedDate)}</div></div>
                  <div><span className="text-muted-foreground">Last Used</span><div className="font-medium">{String(drawerRecord.lastUsed)}</div></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="tie-action-btn flex-1" onClick={() => { toast.success("Mapping Confirmed", `Ledger mapping ${drawerRecord.id} saved`); setDrawerOpen(false); }}><Link2 className="w-3.5 h-3.5 mr-1" /> Map</Button>
                  <Button size="sm" variant="outline" className="tie-action-btn flex-1" onClick={() => { toast.warning("Mapping Removed", `Ledger mapping ${drawerRecord.id} unmapped`); setDrawerOpen(false); }}><Unlink className="w-3.5 h-3.5 mr-1" /> Unmap</Button>
                  <Button size="sm" variant="outline" className="tie-action-btn" onClick={() => toast.info("Edit Mode", `Editing ${drawerRecord.id}`)}><Edit3 className="w-3.5 h-3.5" /></Button>
                </div>
              </>
            )}

            {/* Voucher Drawer */}
            {drawerTab === "voucher" && drawerRecord && (
              <>
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <VoucherTypeIcon type={String(drawerRecord.type)} />
                      <div>
                        <div className="text-lg font-bold">{String(drawerRecord.voucherNumber)}</div>
                        <div className="text-sm opacity-90">{String(drawerRecord.type)}</div>
                      </div>
                    </div>
                    <VoucherStatusBadge status={String(drawerRecord.status)} />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <VoucherModeBadge mode={String(drawerRecord.mode)} />
                </div>
                <GSTModeTile cgst={Number(drawerRecord.cgst)} sgst={Number(drawerRecord.sgst)} igst={Number(drawerRecord.igst)} />
                <AmountSyncIndicator wmsAmt={Number(drawerRecord.amount)} tallyAmt={Number(drawerRecord.tallyAmount)} />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Party</span><div className="font-medium">{String(drawerRecord.party)}</div></div>
                  <div><span className="text-muted-foreground">Warehouse</span><div className="font-medium">{String(drawerRecord.warehouse)}</div></div>
                  <div><span className="text-muted-foreground">Date</span><div className="font-medium">{String(drawerRecord.date)}</div></div>
                  <div><span className="text-muted-foreground">Sync Date</span><div className="font-medium">{String(drawerRecord.syncDate)}</div></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="tie-action-btn flex-1" onClick={() => { toast.success("Voucher Synced", `${drawerRecord.voucherNumber} synced to ERP`); setDrawerOpen(false); }}><SyncIcon className="w-3.5 h-3.5 mr-1" /> Sync</Button>
                  <Button size="sm" variant="outline" className="tie-action-btn flex-1" onClick={() => { toast.success("Voucher Approved", `${drawerRecord.voucherNumber} approved`); setDrawerOpen(false); }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve</Button>
                  <Button size="sm" variant="outline" className="tie-action-btn" onClick={() => { toast.warning("Reversal Initiated", `${drawerRecord.voucherNumber} reversal started`); setDrawerOpen(false); }}><RotateCcw className="w-3.5 h-3.5" /></Button>
                </div>
              </>
            )}

            {/* Stock Drawer */}
            {drawerTab === "stock" && drawerRecord && (
              <>
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">{String(drawerRecord.sku)}</div>
                      <div className="text-sm opacity-90">{String(drawerRecord.product)}</div>
                    </div>
                    <StockStatusBadge status={String(drawerRecord.status)} />
                  </div>
                </div>
                <VarianceTile wmsQty={Number(drawerRecord.wmsQty)} tallyQty={Number(drawerRecord.tallyQty)} />
                <ValueComparisonBar wmsVal={Number(drawerRecord.wmsValue)} tallyVal={Number(drawerRecord.tallyValue)} />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Category</span><div className="font-medium">{String(drawerRecord.category)}</div></div>
                  <div><span className="text-muted-foreground">Warehouse</span><div className="font-medium">{String(drawerRecord.warehouse)}</div></div>
                  <div><span className="text-muted-foreground">Unit Price</span><div className="font-bold tabular-nums">{formatINR(Number(drawerRecord.unitPrice))}</div></div>
                  <div><span className="text-muted-foreground">Last Counted</span><div className="font-medium">{String(drawerRecord.lastCounted)}</div></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="tie-action-btn flex-1" onClick={() => { toast.success("Stock Synced", `${drawerRecord.sku} synced to Tally`); setDrawerOpen(false); }}><SyncIcon className="w-3.5 h-3.5 mr-1" /> Sync</Button>
                  <Button size="sm" variant="outline" className="tie-action-btn flex-1" onClick={() => { toast.info("Adjustment Created", `Adjustment for ${drawerRecord.sku}`); setDrawerOpen(false); }}><Scale className="w-3.5 h-3.5 mr-1" /> Adjust</Button>
                  <Button size="sm" variant="outline" className="tie-action-btn" onClick={() => { toast.warning("Variance Ignored", `${drawerRecord.sku} marked as ignored`); setDrawerOpen(false); }}><EyeOff className="w-3.5 h-3.5" /></Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
