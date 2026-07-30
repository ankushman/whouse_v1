"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Search,
  Eye,
  ArrowUpDown,
  Package,
  Clock,
  AlertTriangle,
  TrendingDown,
  IndianRupee,
  ChevronRight,
  Gavel,
  Heart,
  RotateCcw,
  Recycle,
  Trash2,
  Wrench,
  CheckCircle2,
  XCircle,
  Shield,
  BarChart3,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast-helper";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────────────────
// SEEDED RANDOM & HELPERS
// ──────────────────────────────────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function formatINR(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatINRFull(value: number): string {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

// ──────────────────────────────────────────────────────────
// ENUMS
// ──────────────────────────────────────────────────────────

const AGING_BUCKETS = [
  "Fresh 0-15d",
  "Current 16-30d",
  "Aging 31-60d",
  "Slow 61-90d",
  "Very Slow 91-120d",
  "Near Dead 121-180d",
  "Dead >180d",
  "Obsolete",
] as const;

const CATEGORIES = [
  "Electronics",
  "Textiles",
  "Pharma",
  "Auto Parts",
  "FMCG",
  "Industrial",
  "Chemicals",
  "Agriculture",
  "IT Products",
  "Leather",
  "Paper",
  "Glass",
] as const;

const WAREHOUSES = [
  "Mumbai WH",
  "Delhi NCR WH",
  "Chennai WH",
  "Bangalore WH",
  "Kolkata WH",
  "Pune WH",
  "Hyderabad WH",
  "Ahmedabad WH",
  "Jaipur WH",
  "Lucknow WH",
] as const;

const DISPOSITION_ACTIONS = [
  "Continue Stocking",
  "Discount & Liquidate",
  "Transfer to Other WH",
  "Return to Vendor",
  "Write-Off",
  "Scrap",
] as const;

const VELOCITY_SEGMENTS = [
  "No Sale 180d+",
  "<1 unit/month",
  "1-5 units/month",
  "5-10 units/month",
  "10-25 units/month",
  "25-50 units/month",
  "50-100 units/month",
  "100-500 units/month",
  "500-1000 units/month",
  "1000+ units/month",
] as const;

const ROOT_CAUSES = [
  "Seasonal Demand Drop",
  "Product Lifecycle End",
  "Competition",
  "Pricing Issue",
  "Quality Complaint",
  "Supply Chain Disruption",
  "Wrong Forecast",
  "Market Shift",
] as const;

const ACTION_PLANS = [
  "Price Reduction",
  "Bundle Offer",
  "Return to Supplier",
  "Transfer to Clearance",
  "Write-Off",
  "Continue Monitoring",
] as const;

const WRITEOFF_STATUSES = [
  "Proposed",
  "Under Review",
  "Approved",
  "Processing",
  "Completed",
  "Rejected",
  "On Hold",
  "Cancelled",
] as const;

const DISPOSAL_METHODS = [
  "Scrap",
  "Auction",
  "Donation",
  "Return to Vendor",
  "Recycling",
  "Landfill",
] as const;

const APPROVAL_LEVELS = [
  "Shift Manager",
  "Warehouse Manager",
  "Regional Manager",
  "Finance Manager",
  "VP Operations",
  "CFO",
] as const;

const RESERVE_TYPES = [
  "General Obsolescence",
  "Specific Identification",
  "Inventory Decline",
  "Excess Stock",
  "Slow-Moving Reserve",
  "Warranty Reserve",
  "Return Processing",
  "Market Price Decline",
] as const;

const RESERVE_STATUSES = [
  "Calculated",
  "Pending Review",
  "Approved",
  "Adjusted",
  "Released",
  "Reversed",
] as const;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

interface SKURecord {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  qty: number;
  unitCost: number;
  totalValue: number;
  agingBucket: string;
  agingDays: number;
  lastMovementDays: number;
  disposition: string;
  batchNo: string;
  receivedDate: string;
}

interface SlowMovingRecord {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  velocity: string;
  rootCause: string;
  actionPlan: string;
  daysOnHand: number;
  carryingCostMonthly: number;
  inventoryValue: number;
  score: number;
  sparkData: number[];
}

interface WriteOffRecord {
  id: string;
  woNumber: string;
  sku: string;
  name: string;
  category: string;
  originalValue: number;
  writeOffValue: number;
  recoveryValue: number;
  status: string;
  disposalMethod: string;
  approvalLevel: string;
  proposedDate: string;
  completedDate: string;
  progressStage: number;
}

interface ProvisioningRecord {
  id: string;
  recordNo: string;
  category: string;
  reserveType: string;
  status: string;
  atRiskValue: number;
  calculatedAmount: number;
  approvedAmount: number;
  utilizedAmount: number;
  releasedAmount: number;
  riskScore: number;
  coveragePercent: number;
  monthlyHistory: number[];
  provisionVsActual: [number, number];
}

// ──────────────────────────────────────────────────────────
// DATA GENERATION
// ──────────────────────────────────────────────────────────

function generateData() {
  const r = seededRandom(2033501);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];
  const rand = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;
  const randF = (min: number, max: number) => +(r() * (max - min) + min).toFixed(2);

  // KPIs
  const kpis = {
    totalSKUs: rand(2400, 3600),
    totalInventoryValue: rand(15000000, 45000000),
    agedOver90: rand(280, 520),
    slowMoving: rand(180, 350),
    deadStock: rand(45, 120),
    obsolescenceReserve: rand(2000000, 8000000),
    writeOffThisMonth: rand(150000, 600000),
    agingHealthIndex: randF(52, 78),
  };

  // Monthly aging trend
  const monthlyAgingTrend = MONTHS.map((m) => ({
    month: m,
    fresh: rand(800, 1400),
    aging: rand(400, 800),
    slow: rand(200, 500),
    dead: rand(80, 250),
  }));

  // Category aging stacked data
  const categoryAgingData = CATEGORIES.slice(0, 8).map((cat) => ({
    category: cat,
    fresh: rand(50, 200),
    aging: rand(30, 120),
    slow: rand(15, 80),
    dead: rand(5, 40),
  }));

  // Write-off trend
  const writeOffTrend = MONTHS.map((m) => ({
    month: m,
    amount: rand(100000, 700000),
  }));

  // Aging distribution
  const agingDistribution = [
    { name: "Fresh 0-30d", value: rand(35, 45), color: "#059669" },
    { name: "Aging 30-90d", value: rand(20, 30), color: "#b45309" },
    { name: "Slow 90-180d", value: rand(12, 20), color: "#ea580c" },
    { name: "Dead >180d", value: rand(8, 15), color: "#e11d48" },
  ];

  // SKU records (80)
  const skuRecords: SKURecord[] = Array.from({ length: 80 }, (_, i) => {
    const cat = pick(CATEGORIES);
    const wh = pick(WAREHOUSES);
    const bucket = pick(AGING_BUCKETS);
    const agingDays = bucket.includes("Obsolete")
      ? rand(365, 720)
      : bucket.includes("Dead")
        ? rand(181, 364)
        : bucket.includes("Near Dead")
          ? rand(121, 180)
          : bucket.includes("Very Slow")
            ? rand(91, 120)
            : bucket.includes("Slow")
              ? rand(61, 90)
              : bucket.includes("Aging")
                ? rand(31, 60)
                : bucket.includes("Current")
                  ? rand(16, 30)
                  : rand(0, 15);
    return {
      id: `SKU-${String(i + 1).padStart(4, "0")}`,
      sku: `SKU-${rand(10000, 99999)}`,
      name: `${cat} Item ${String.fromCharCode(65 + (i % 26))}${String(Math.floor(i / 26) + 1)}`,
      category: cat,
      warehouse: wh,
      qty: rand(10, 5000),
      unitCost: randF(50, 25000),
      totalValue: 0,
      agingBucket: bucket,
      agingDays,
      lastMovementDays: rand(0, 400),
      disposition: pick(DISPOSITION_ACTIONS),
      batchNo: `BATCH-${rand(1000, 9999)}`,
      receivedDate: `2024-${String(rand(1, 12)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
    };
  });
  skuRecords.forEach((s) => { s.totalValue = Math.round(s.qty * s.unitCost); });

  // Slow-moving records (70)
  const slowMovingRecords: SlowMovingRecord[] = Array.from({ length: 70 }, (_, i) => {
    const cat = pick(CATEGORIES);
    const vel = pick(VELOCITY_SEGMENTS);
    const score = vel.includes("No Sale") ? rand(5, 15) : vel.includes("<1") ? rand(15, 30) : rand(30, 85);
    return {
      id: `SM-${String(i + 1).padStart(4, "0")}`,
      sku: `SKU-${rand(10000, 99999)}`,
      name: `Slow ${cat} ${String.fromCharCode(65 + (i % 26))}${String(Math.floor(i / 26) + 1)}`,
      category: cat,
      warehouse: pick(WAREHOUSES),
      velocity: vel,
      rootCause: pick(ROOT_CAUSES),
      actionPlan: pick(ACTION_PLANS),
      daysOnHand: rand(60, 450),
      carryingCostMonthly: rand(500, 50000),
      inventoryValue: rand(20000, 3000000),
      score,
      sparkData: Array.from({ length: 6 }, () => rand(0, 100)),
    };
  });

  // Write-off records (60)
  const writeOffRecords: WriteOffRecord[] = Array.from({ length: 60 }, (_, i) => {
    const origVal = rand(10000, 5000000);
    const writeOffPct = randF(0.3, 1.0);
    const woVal = Math.round(origVal * writeOffPct);
    const recoveryPct = randF(0, 0.5);
    const status = pick(WRITEOFF_STATUSES);
    const stage = status === "Completed" || status === "Processing" ? 4 : status === "Approved" ? 3 : status === "Under Review" ? 2 : 1;
    return {
      id: `WO-${String(i + 1).padStart(4, "0")}`,
      woNumber: `WO-2025-${String(i + 1).padStart(4, "0")}`,
      sku: `SKU-${rand(10000, 99999)}`,
      name: `WriteOff ${pick(CATEGORIES)} ${String.fromCharCode(65 + (i % 26))}${String(Math.floor(i / 26) + 1)}`,
      category: pick(CATEGORIES),
      originalValue: origVal,
      writeOffValue: woVal,
      recoveryValue: Math.round(woVal * recoveryPct),
      status,
      disposalMethod: pick(DISPOSAL_METHODS),
      approvalLevel: pick(APPROVAL_LEVELS),
      proposedDate: `2025-${String(rand(1, 6)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      completedDate: status === "Completed" ? `2025-${String(rand(3, 7)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}` : "-",
      progressStage: stage,
    };
  });

  // Provisioning records (55)
  const provisioningRecords: ProvisioningRecord[] = Array.from({ length: 55 }, (_, i) => {
    const atRisk = rand(50000, 5000000);
    const calcAmt = Math.round(atRisk * randF(0.05, 0.35));
    const appAmt = Math.round(calcAmt * randF(0.7, 1.0));
    const utilAmt = Math.round(appAmt * randF(0.1, 0.6));
    const relAmt = Math.round(appAmt * randF(0, 0.15));
    const coverage = Math.round((appAmt / atRisk) * 100);
    return {
      id: `PRV-${String(i + 1).padStart(4, "0")}`,
      recordNo: `PRV-2025-${String(i + 1).padStart(4, "0")}`,
      category: pick(CATEGORIES),
      reserveType: pick(RESERVE_TYPES),
      status: pick(RESERVE_STATUSES),
      atRiskValue: atRisk,
      calculatedAmount: calcAmt,
      approvedAmount: appAmt,
      utilizedAmount: utilAmt,
      releasedAmount: relAmt,
      riskScore: rand(1, 10),
      coveragePercent: Math.min(coverage, 100),
      monthlyHistory: Array.from({ length: 12 }, () => rand(10000, 300000)),
      provisionVsActual: [calcAmt, rand(Math.round(calcAmt * 0.5), Math.round(calcAmt * 1.2))] as [number, number],
    };
  });

  // Analytics
  const analyticsKPIs = {
    totalAgedValue: rand(25000000, 65000000),
    avgAgingDays: rand(45, 95),
    obsolescenceRate: randF(4.5, 12.8),
    writeOffRecoveryRate: randF(18, 42),
    slowMovingPct: randF(8, 18),
    deadStockPct: randF(2, 7),
    provisionCoverage: randF(55, 85),
    yoyImprovement: randF(-5, 15),
  };

  const warehouseAgingData = WAREHOUSES.slice(0, 5).map((wh) => ({
    name: wh.replace(" WH", ""),
    value: rand(500000, 8000000),
  }));

  const agingVelocityTrend = MONTHS.map((m) => ({
    month: m,
    avgDays: rand(40, 110),
    target: 60,
  }));

  const writeOffRecoveryDist = [
    { name: "Scrap Recovery", value: rand(15, 30), color: "#475569" },
    { name: "Auction", value: rand(20, 35), color: "#7c3aed" },
    { name: "Vendor Return", value: rand(15, 25), color: "#059669" },
    { name: "Donation", value: rand(5, 15), color: "#e11d48" },
    { name: "Recycling", value: rand(10, 20), color: "#b45309" },
  ];

  const dispositionDist = DISPOSAL_METHODS.map((m) => ({
    method: m,
    count: rand(5, 25),
  }));

  const topSlowestSKUs = Array.from({ length: 10 }, (_, i) => ({
    sku: `SKU-${rand(10000, 99999)}`,
    name: `Slow Item ${String.fromCharCode(65 + i)}`,
    days: rand(250, 600),
  })).sort((a, b) => b.days - a.days);

  return {
    kpis,
    monthlyAgingTrend,
    categoryAgingData,
    writeOffTrend,
    agingDistribution,
    skuRecords,
    slowMovingRecords,
    writeOffRecords,
    provisioningRecords,
    analyticsKPIs,
    warehouseAgingData,
    agingVelocityTrend,
    writeOffRecoveryDist,
    dispositionDist,
    topSlowestSKUs,
  };
}

const data = generateData();

// ──────────────────────────────────────────────────────────
// UNIQUE VISUAL COMPONENTS
// ──────────────────────────────────────────────────────────

const BUCKET_COLORS: Record<string, string> = {
  "Fresh 0-15d": "bg-emerald-500",
  "Current 16-30d": "bg-cyan-500",
  "Aging 31-60d": "bg-amber-500",
  "Slow 61-90d": "bg-orange-500",
  "Very Slow 91-120d": "bg-orange-600",
  "Near Dead 121-180d": "bg-red-500",
  "Dead >180d": "bg-rose-500",
  "Obsolete": "bg-slate-500",
};

function AgingBucketBadge({ bucket }: { bucket: string }) {
  return (
    <span
      className={cn(
        "iao-bucket-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white",
        BUCKET_COLORS[bucket] || "bg-gray-500"
      )}
    >
      {bucket}
    </span>
  );
}

function AgingHeatBar({ days }: { days: number }) {
  const pct = Math.min((days / 365) * 100, 100);
  const color =
    days <= 30 ? "#059669" : days <= 90 ? "#b45309" : days <= 180 ? "#ea580c" : "#e11d48";
  return (
    <div className="iao-heat-bar flex h-3 w-full items-center gap-1">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg, #059669, ${color})` }}
      />
      <span className="text-xs text-muted-foreground">{days}d</span>
    </div>
  );
}

function SKUValueTile({ value }: { value: number }) {
  return (
    <div className="iao-value-tile rounded-lg border border-border bg-card p-2 text-center">
      <p className="text-xs text-muted-foreground">Value</p>
      <p className="text-sm font-semibold" style={{ color: "#b45309" }}>
        {formatINR(value)}
      </p>
    </div>
  );
}

function LastMovementIndicator({ days }: { days: number }) {
  const color =
    days < 30 ? "text-emerald-500" : days < 60 ? "text-cyan-500" : days < 90 ? "text-amber-500" : days < 180 ? "text-orange-500" : "text-red-500";
  return (
    <span className={cn("iao-last-movement flex items-center gap-1 text-xs font-medium", color)}>
      <Clock className="h-3 w-3" /> {days}d ago
    </span>
  );
}

const DISPOSITION_COLORS: Record<string, string> = {
  "Continue Stocking": "bg-emerald-100 text-emerald-700",
  "Discount & Liquidate": "bg-amber-100 text-amber-700",
  "Transfer to Other WH": "bg-blue-100 text-blue-700",
  "Return to Vendor": "bg-violet-100 text-violet-700",
  "Write-Off": "bg-rose-100 text-rose-700",
  "Scrap": "bg-slate-100 text-slate-700",
};

function DispositionBadge({ disposition }: { disposition: string }) {
  return (
    <span className={cn("iao-disposition-badge inline-flex rounded-full px-2 py-0.5 text-xs font-medium", DISPOSITION_COLORS[disposition] || "bg-gray-100 text-gray-700")}>
      {disposition}
    </span>
  );
}

function WarehouseBadge({ warehouse }: { warehouse: string }) {
  return (
    <span className="iao-wh-badge inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
      {warehouse}
    </span>
  );
}

function VelocityBadge({ velocity }: { velocity: string }) {
  const color = velocity.includes("No Sale") ? "bg-rose-500"
    : velocity.startsWith("<1") ? "bg-red-500"
    : velocity.startsWith("1-5") ? "bg-orange-500"
    : velocity.startsWith("5-10") ? "bg-amber-500"
    : velocity.startsWith("10-25") ? "bg-yellow-500"
    : "bg-emerald-500";
  return (
    <span className={cn("iao-velocity-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white", color)}>
      {velocity}
    </span>
  );
}

function RootCauseBadge({ cause }: { cause: string }) {
  const colors: Record<string, string> = {
    "Seasonal Demand Drop": "bg-blue-100 text-blue-700",
    "Product Lifecycle End": "bg-rose-100 text-rose-700",
    "Competition": "bg-orange-100 text-orange-700",
    "Pricing Issue": "bg-amber-100 text-amber-700",
    "Quality Complaint": "bg-red-100 text-red-700",
    "Supply Chain Disruption": "bg-slate-100 text-slate-700",
    "Wrong Forecast": "bg-violet-100 text-violet-700",
    "Market Shift": "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={cn("iao-root-cause-badge inline-flex rounded-full px-2 py-0.5 text-xs font-medium", colors[cause] || "bg-gray-100 text-gray-700")}>
      {cause}
    </span>
  );
}

function ActionPlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    "Price Reduction": "bg-amber-100 text-amber-700",
    "Bundle Offer": "bg-violet-100 text-violet-700",
    "Return to Supplier": "bg-blue-100 text-blue-700",
    "Transfer to Clearance": "bg-orange-100 text-orange-700",
    "Write-Off": "bg-rose-100 text-rose-700",
    "Continue Monitoring": "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={cn("iao-action-plan-badge inline-flex rounded-full px-2 py-0.5 text-xs font-medium", colors[plan] || "bg-gray-100 text-gray-700")}>
      {plan}
    </span>
  );
}

function VelocityTrendSpark({ sparkData }: { sparkData: number[] }) {
  const w = 60, h = 20;
  const max = Math.max(...sparkData, 1);
  const points = sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="iao-sparkline">
      <polyline fill="none" stroke="#b45309" strokeWidth="1.5" points={points} />
    </svg>
  );
}

function DaysOnHandTile({ days }: { days: number }) {
  const color = days <= 90 ? "text-emerald-600" : days <= 180 ? "text-amber-600" : "text-red-600";
  return (
    <div className="iao-doh-tile rounded-lg border bg-card p-2 text-center">
      <p className="text-xs text-muted-foreground">Days on Hand</p>
      <p className={cn("text-lg font-bold", color)}>{days}</p>
    </div>
  );
}

function CarryingCostTile({ cost }: { cost: number }) {
  const color = cost < 5000 ? "text-emerald-600" : cost < 20000 ? "text-amber-600" : "text-red-600";
  return (
    <div className="iao-carrying-tile rounded-lg border bg-card p-2 text-center">
      <p className="text-xs text-muted-foreground">Carrying Cost/mo</p>
      <p className={cn("text-sm font-semibold", color)}>{formatINR(cost)}</p>
    </div>
  );
}

function SlowMotionScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score < 30 ? "#e11d48" : score < 60 ? "#ea580c" : "#b45309";
  const label = score < 30 ? "Critical" : score < 60 ? "Action Needed" : "Monitoring";
  return (
    <div className="iao-score-ring flex flex-col items-center">
      <svg width={52} height={52} viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="26" cy="26" r={radius}
          fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
        />
        <text x="26" y="28" textAnchor="middle" className="text-xs font-bold" fill={color}>{score}</text>
      </svg>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

function WriteOffStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Proposed: "bg-blue-100 text-blue-700",
    "Under Review": "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Processing: "bg-violet-100 text-violet-700",
    Completed: "bg-cyan-100 text-cyan-700",
    Rejected: "bg-rose-100 text-rose-700",
    "On Hold": "bg-slate-100 text-slate-700",
    Cancelled: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={cn("iao-wo-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colors[status] || "bg-gray-100 text-gray-700")}>
      {status}
    </span>
  );
}

function DisposalMethodBadge({ method }: { method: string }) {
  const icons: Record<string, React.ReactNode> = {
    Scrap: <Wrench className="mr-1 h-3 w-3" />,
    Auction: <Gavel className="mr-1 h-3 w-3" />,
    Donation: <Heart className="mr-1 h-3 w-3" />,
    "Return to Vendor": <RotateCcw className="mr-1 h-3 w-3" />,
    Recycling: <Recycle className="mr-1 h-3 w-3" />,
    Landfill: <Trash2 className="mr-1 h-3 w-3" />,
  };
  return (
    <span className="iao-disposal-badge inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
      {icons[method]} {method}
    </span>
  );
}

function ApprovalLevelBadge({ level }: { level: string }) {
  const idx = APPROVAL_LEVELS.indexOf(level as typeof APPROVAL_LEVELS[number]);
  const colors = ["bg-emerald-100 text-emerald-700", "bg-cyan-100 text-cyan-700", "bg-amber-100 text-amber-700", "bg-orange-100 text-orange-700", "bg-rose-100 text-rose-700", "bg-violet-100 text-violet-700"];
  return (
    <span className={cn("iao-approval-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colors[idx] || colors[0])}>
      <Shield className="mr-1 h-3 w-3" /> {level}
    </span>
  );
}

function RecoveryRateBar({ recovery, original }: { recovery: number; original: number }) {
  const pct = original > 0 ? Math.round((recovery / original) * 100) : 0;
  const color = pct >= 75 ? "#059669" : pct >= 50 ? "#06b6d4" : pct >= 25 ? "#b45309" : "#e11d48";
  return (
    <div className="iao-recovery-bar">
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">Recovery Rate</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function WriteOffValueTile({ original, writeOff, recovery }: { original: number; writeOff: number; recovery: number }) {
  return (
    <div className="iao-wo-value-tile grid grid-cols-3 gap-2 rounded-lg border bg-card p-3">
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground">Original</p>
        <p className="text-xs font-semibold">{formatINR(original)}</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground">Write-Off</p>
        <p className="text-xs font-semibold text-rose-600">{formatINR(writeOff)}</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground">Recovery</p>
        <p className="text-xs font-semibold text-emerald-600">{formatINR(recovery)}</p>
      </div>
    </div>
  );
}

function ApprovalProgressTracker({ stage }: { stage: number }) {
  const stages = ["Proposed", "Reviewed", "Approved", "Processed"];
  return (
    <div className="iao-approval-progress flex items-center gap-1">
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <div className={cn("iao-stage flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium", i < stage ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400")}>
            {i < stage ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-gray-300" />}
            {s}
          </div>
          {i < stages.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function DisposalTimeline() {
  const events = [
    { label: "Initiated", icon: <Zap className="h-3 w-3" /> },
    { label: "Valued", icon: <IndianRupee className="h-3 w-3" /> },
    { label: "Approved", icon: <CheckCircle2 className="h-3 w-3" /> },
    { label: "Disposed", icon: <Recycle className="h-3 w-3" /> },
    { label: "Verified", icon: <Shield className="h-3 w-3" /> },
  ];
  return (
    <div className="iao-disposal-timeline flex items-start gap-2">
      {events.map((e, i) => (
        <React.Fragment key={e.label}>
          <div className="flex flex-col items-center">
            <div className="iao-event-circle flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              {e.icon}
            </div>
            <span className="mt-1 text-[10px] text-muted-foreground">{e.label}</span>
          </div>
          {i < events.length - 1 && <div className="mt-3 h-0.5 flex-1 bg-gradient-to-r from-violet-200 to-violet-100" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function ReserveTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    "General Obsolescence": "bg-slate-100 text-slate-700",
    "Specific Identification": "bg-amber-100 text-amber-700",
    "Inventory Decline": "bg-rose-100 text-rose-700",
    "Excess Stock": "bg-orange-100 text-orange-700",
    "Slow-Moving Reserve": "bg-cyan-100 text-cyan-700",
    "Warranty Reserve": "bg-violet-100 text-violet-700",
    "Return Processing": "bg-blue-100 text-blue-700",
    "Market Price Decline": "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={cn("iao-reserve-type-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colors[type] || "bg-gray-100 text-gray-700")}>
      {type}
    </span>
  );
}

function ReserveStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Calculated: "bg-blue-100 text-blue-700",
    "Pending Review": "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Adjusted: "bg-orange-100 text-orange-700",
    Released: "bg-cyan-100 text-cyan-700",
    Reversed: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={cn("iao-reserve-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colors[status] || "bg-gray-100 text-gray-700")}>
      {status}
    </span>
  );
}

function ProvisionAmountTile({ calculated, approved, utilized, released }: { calculated: number; approved: number; utilized: number; released: number }) {
  return (
    <div className="iao-provision-tile grid grid-cols-2 gap-2 rounded-lg border bg-card p-3">
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground">Calculated</p>
        <p className="text-xs font-semibold text-blue-600">{formatINR(calculated)}</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground">Approved</p>
        <p className="text-xs font-semibold text-emerald-600">{formatINR(approved)}</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground">Utilized</p>
        <p className="text-xs font-semibold text-amber-600">{formatINR(utilized)}</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground">Released</p>
        <p className="text-xs font-semibold text-cyan-600">{formatINR(released)}</p>
      </div>
    </div>
  );
}

function ReserveCoverageRing({ pct }: { pct: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;
  const color = pct >= 75 ? "#059669" : pct >= 50 ? "#b45309" : "#e11d48";
  return (
    <div className="iao-coverage-ring flex flex-col items-center">
      <svg width={56} height={56} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={radius}
          fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
        />
        <text x="28" y="31" textAnchor="middle" className="text-xs font-bold" fill={color}>{pct}%</text>
      </svg>
      <span className="text-[10px] text-muted-foreground">Coverage</span>
    </div>
  );
}

function ProvisionVsActualBar({ provision, actual }: { provision: number; actual: number }) {
  const maxVal = Math.max(provision, actual, 1);
  return (
    <div className="iao-pv-bar flex items-end gap-2">
      <div className="flex flex-col items-center">
        <div className="w-8 rounded-t bg-violet-500" style={{ height: `${(provision / maxVal) * 40}px` }} />
        <span className="mt-1 text-[9px] text-muted-foreground">Prov</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-8 rounded-t bg-slate-400" style={{ height: `${(actual / maxVal) * 40}px` }} />
        <span className="mt-1 text-[9px] text-muted-foreground">Actual</span>
      </div>
    </div>
  );
}

function MonthlyProvisionTrend({ history }: { history: number[] }) {
  const last6 = history.slice(-6);
  const max = Math.max(...last6, 1);
  return (
    <div className="iao-monthly-trend flex items-end gap-0.5">
      {last6.map((v, i) => (
        <div
          key={i}
          className="w-4 rounded-t"
          style={{ height: `${Math.max((v / max) * 30, 2)}px`, backgroundColor: i === last6.length - 1 ? "#475569" : "#cbd5e1" }}
        />
      ))}
    </div>
  );
}

function RiskScoreBadge({ score }: { score: number }) {
  const color = score <= 3 ? "bg-emerald-100 text-emerald-700" : score <= 6 ? "bg-amber-100 text-amber-700" : score <= 8 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700";
  return (
    <span className={cn("iao-risk-badge inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold", color)}>
      Risk: {score}/10
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────

export default function InventoryAgingObsolescenceView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("0");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<SKURecord | SlowMovingRecord | WriteOffRecord | ProvisioningRecord | null>(null);

  const toggleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }, [sortField]);

  const sortData = useCallback(<T extends Record<string, unknown>>(records: T[]): T[] => {
    return [...records].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === "number" && typeof bVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortField, sortDir]);

  // Tab 1: filtered SKU records
  const filteredSKUs = useMemo(() => {
    let recs = data.skuRecords;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      recs = recs.filter((r) => r.sku.toLowerCase().includes(s) || r.name.toLowerCase().includes(s) || r.category.toLowerCase().includes(s));
    }
    if (statusFilter !== "all") recs = recs.filter((r) => r.agingBucket === statusFilter);
    return sortData(recs as unknown as Record<string, unknown>[]) as unknown as SKURecord[];
  }, [searchTerm, statusFilter, sortData]);

  // Tab 2: filtered slow-moving records
  const filteredSlow = useMemo(() => {
    let recs = data.slowMovingRecords;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      recs = recs.filter((r) => r.sku.toLowerCase().includes(s) || r.name.toLowerCase().includes(s) || r.velocity.toLowerCase().includes(s));
    }
    if (statusFilter !== "all") recs = recs.filter((r) => r.rootCause === statusFilter);
    return sortData(recs as unknown as Record<string, unknown>[]) as unknown as SlowMovingRecord[];
  }, [searchTerm, statusFilter, sortData]);

  // Tab 3: filtered write-off records
  const filteredWriteOffs = useMemo(() => {
    let recs = data.writeOffRecords;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      recs = recs.filter((r) => r.woNumber.toLowerCase().includes(s) || r.sku.toLowerCase().includes(s) || r.name.toLowerCase().includes(s));
    }
    if (statusFilter !== "all") recs = recs.filter((r) => r.status === statusFilter);
    return sortData(recs as unknown as Record<string, unknown>[]) as unknown as WriteOffRecord[];
  }, [searchTerm, statusFilter, sortData]);

  // Tab 4: filtered provisioning records
  const filteredProvisions = useMemo(() => {
    let recs = data.provisioningRecords;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      recs = recs.filter((r) => r.recordNo.toLowerCase().includes(s) || r.category.toLowerCase().includes(s) || r.reserveType.toLowerCase().includes(s));
    }
    if (statusFilter !== "all") recs = recs.filter((r) => r.status === statusFilter);
    return sortData(recs as unknown as Record<string, unknown>[]) as unknown as ProvisioningRecord[];
  }, [searchTerm, statusFilter, sortData]);

  const openDrawer = useCallback((record: unknown) => {
    setDrawerRecord(record as SKURecord | SlowMovingRecord | WriteOffRecord | ProvisioningRecord);
    setDrawerOpen(true);
  }, []);

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none whitespace-nowrap text-xs" onClick={() => toggleSort(field)}>
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  const CHART_COLORS = ["#059669", "#b45309", "#e11d48", "#475569", "#7c3aed", "#ea580c"];

  return (
    <div className="min-h-screen space-y-4">
      <PageHeader
        title="Inventory Aging & Obsolescence Management"
        description="Track inventory aging, identify slow-moving stock, and manage write-offs and provisions"
      />

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchTerm(""); setStatusFilter("all"); }}>
        <TabsList className="mb-4 flex w-full flex-wrap gap-1">
          <TabsTrigger value="0" className="text-xs sm:text-sm">Aging Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="text-xs sm:text-sm">SKU Aging Register</TabsTrigger>
          <TabsTrigger value="2" className="text-xs sm:text-sm">Slow-Moving Analysis</TabsTrigger>
          <TabsTrigger value="3" className="text-xs sm:text-sm">Write-Off & Disposal</TabsTrigger>
          <TabsTrigger value="4" className="text-xs sm:text-sm">Provisioning & Reserve</TabsTrigger>
          <TabsTrigger value="5" className="text-xs sm:text-sm">Aging Analytics</TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 0: AGING DASHBOARD                             */}
        {/* ═══════════════════════════════════════════════════ */}
        <TabsContent value="0" className="space-y-4">
          {/* KPI Tiles */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total SKUs Tracked", value: data.kpis.totalSKUs.toLocaleString(), icon: <Package className="h-4 w-4" />, color: "#b45309" },
              { label: "Total Inventory Value", value: formatINR(data.kpis.totalInventoryValue), icon: <IndianRupee className="h-4 w-4" />, color: "#059669" },
              { label: "Aged > 90 Days", value: data.kpis.agedOver90.toLocaleString(), icon: <Clock className="h-4 w-4" />, color: "#e11d48" },
              { label: "Slow-Moving SKUs", value: data.kpis.slowMoving.toLocaleString(), icon: <TrendingDown className="h-4 w-4" />, color: "#ea580c" },
              { label: "Dead Stock (No Movement 180d+)", value: data.kpis.deadStock.toLocaleString(), icon: <AlertTriangle className="h-4 w-4" />, color: "#e11d48" },
              { label: "Obsolescence Reserve", value: formatINR(data.kpis.obsolescenceReserve), icon: <Shield className="h-4 w-4" />, color: "#475569" },
              { label: "Write-Off This Month", value: formatINR(data.kpis.writeOffThisMonth), icon: <BarChart3 className="h-4 w-4" />, color: "#7c3aed" },
              { label: "Aging Health Index", value: `${data.kpis.agingHealthIndex}%`, icon: <Activity className="h-4 w-4" />, color: data.kpis.agingHealthIndex >= 65 ? "#059669" : "#e11d48" },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="inner-glow glass-subtle flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
                    <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Monthly Aging Trend */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Monthly Aging Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.monthlyAgingTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="fresh" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.3} name="Fresh 0-30d" />
                  <Area type="monotone" dataKey="aging" stackId="1" stroke="#b45309" fill="#b45309" fillOpacity={0.3} name="Aging 30-90d" />
                  <Area type="monotone" dataKey="slow" stackId="1" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} name="Slow 90-180d" />
                  <Area type="monotone" dataKey="dead" stackId="1" stroke="#e11d48" fill="#e11d48" fillOpacity={0.3} name="Dead >180d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Aging Distribution PieChart */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Aging Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.agingDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {data.agingDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Write-off Trend LineChart */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Monthly Write-Off Trend (₹)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.writeOffTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(v: number) => formatINRFull(v)} />
                    <Line type="monotone" dataKey="amount" stroke="#e11d48" strokeWidth={2} dot={{ r: 3 }} name="Write-Off" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category-wise Aging stacked BarChart */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Category-wise Aging (Top 8)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.categoryAgingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="fresh" stackId="a" fill="#059669" name="Fresh" />
                  <Bar dataKey="aging" stackId="a" fill="#b45309" name="Aging" />
                  <Bar dataKey="slow" stackId="a" fill="#ea580c" name="Slow" />
                  <Bar dataKey="dead" stackId="a" fill="#e11d48" name="Dead" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 1: SKU AGING REGISTER                          */}
        {/* ═══════════════════════════════════════════════════ */}
        <TabsContent value="1" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search SKU, name, category..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Aging Bucket" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buckets</SelectItem>
                {AGING_BUCKETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="inner-glow glass-subtle p-0">
              <div className="max-h-[520px] overflow-y-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow>
                      <SortHeader field="sku">SKU</SortHeader>
                      <SortHeader field="name">Name</SortHeader>
                      <SortHeader field="category">Category</SortHeader>
                      <SortHeader field="warehouse">Warehouse</SortHeader>
                      <SortHeader field="agingBucket">Aging</SortHeader>
                      <SortHeader field="agingDays">Days</SortHeader>
                      <SortHeader field="totalValue">Value</SortHeader>
                      <SortHeader field="lastMovementDays">Last Movement</SortHeader>
                      <SortHeader field="disposition">Disposition</SortHeader>
                      <TableHead className="text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSKUs.slice(0, 50).map((rec) => (
                      <TableRow key={rec.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => openDrawer(rec)}>
                        <TableCell className="text-xs font-mono">{rec.sku}</TableCell>
                        <TableCell className="max-w-[120px] truncate text-xs">{rec.name}</TableCell>
                        <TableCell><span className="text-xs">{rec.category}</span></TableCell>
                        <TableCell><WarehouseBadge warehouse={rec.warehouse} /></TableCell>
                        <TableCell><AgingBucketBadge bucket={rec.agingBucket} /></TableCell>
                        <TableCell><div className="w-24"><AgingHeatBar days={rec.agingDays} /></div></TableCell>
                        <TableCell className="numeric-cell text-xs font-medium" style={{ color: "#b45309" }}>{formatINR(rec.totalValue)}</TableCell>
                        <TableCell><LastMovementIndicator days={rec.lastMovementDays} /></TableCell>
                        <TableCell><DispositionBadge disposition={rec.disposition} /></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="press-scale h-7 w-7" onClick={(e) => { e.stopPropagation(); openDrawer(rec); }}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 2: SLOW-MOVING ANALYSIS                        */}
        {/* ═══════════════════════════════════════════════════ */}
        <TabsContent value="2" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search SKU, name, velocity..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Root Cause" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Causes</SelectItem>
                {ROOT_CAUSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="inner-glow glass-subtle p-0">
              <div className="max-h-[520px] overflow-y-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow>
                      <SortHeader field="sku">SKU</SortHeader>
                      <SortHeader field="name">Name</SortHeader>
                      <SortHeader field="velocity">Velocity</SortHeader>
                      <SortHeader field="rootCause">Root Cause</SortHeader>
                      <SortHeader field="actionPlan">Action Plan</SortHeader>
                      <SortHeader field="daysOnHand">DOH</SortHeader>
                      <SortHeader field="carryingCostMonthly">Carrying Cost</SortHeader>
                      <SortHeader field="inventoryValue">Value</SortHeader>
                      <SortHeader field="score">Score</SortHeader>
                      <TableHead className="text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSlow.slice(0, 50).map((rec) => (
                      <TableRow key={rec.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => openDrawer(rec)}>
                        <TableCell className="text-xs font-mono">{rec.sku}</TableCell>
                        <TableCell className="max-w-[120px] truncate text-xs">{rec.name}</TableCell>
                        <TableCell><VelocityBadge velocity={rec.velocity} /></TableCell>
                        <TableCell><RootCauseBadge cause={rec.rootCause} /></TableCell>
                        <TableCell><ActionPlanBadge plan={rec.actionPlan} /></TableCell>
                        <TableCell><DaysOnHandTile days={rec.daysOnHand} /></TableCell>
                        <TableCell><CarryingCostTile cost={rec.carryingCostMonthly} /></TableCell>
                        <TableCell className="numeric-cell text-xs font-medium" style={{ color: "#b45309" }}>{formatINR(rec.inventoryValue)}</TableCell>
                        <TableCell><SlowMotionScoreRing score={rec.score} /></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="press-scale h-7 w-7" onClick={(e) => { e.stopPropagation(); openDrawer(rec); }}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 3: WRITE-OFF & DISPOSAL                        */}
        {/* ═══════════════════════════════════════════════════ */}
        <TabsContent value="3" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search WO#, SKU, name..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {WRITEOFF_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="inner-glow glass-subtle p-0">
              <div className="max-h-[520px] overflow-y-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow>
                      <SortHeader field="woNumber">WO#</SortHeader>
                      <SortHeader field="name">Item</SortHeader>
                      <SortHeader field="originalValue">Original</SortHeader>
                      <SortHeader field="writeOffValue">Write-Off</SortHeader>
                      <SortHeader field="recoveryValue">Recovery</SortHeader>
                      <SortHeader field="status">Status</SortHeader>
                      <SortHeader field="disposalMethod">Method</SortHeader>
                      <SortHeader field="approvalLevel">Approver</SortHeader>
                      <SortHeader field="proposedDate">Date</SortHeader>
                      <TableHead className="text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWriteOffs.slice(0, 50).map((rec) => (
                      <TableRow key={rec.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => openDrawer(rec)}>
                        <TableCell className="text-xs font-mono">{rec.woNumber}</TableCell>
                        <TableCell className="max-w-[110px] truncate text-xs">{rec.name}</TableCell>
                        <TableCell className="numeric-cell text-xs">{formatINR(rec.originalValue)}</TableCell>
                        <TableCell className="numeric-cell text-xs text-rose-600 font-medium">{formatINR(rec.writeOffValue)}</TableCell>
                        <TableCell className="numeric-cell text-xs text-emerald-600 font-medium">{formatINR(rec.recoveryValue)}</TableCell>
                        <TableCell><WriteOffStatusBadge status={rec.status} /></TableCell>
                        <TableCell><DisposalMethodBadge method={rec.disposalMethod} /></TableCell>
                        <TableCell><ApprovalLevelBadge level={rec.approvalLevel} /></TableCell>
                        <TableCell className="text-xs">{rec.proposedDate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="press-scale h-7 w-7" onClick={(e) => { e.stopPropagation(); openDrawer(rec); }}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 4: PROVISIONING & RESERVE                       */}
        {/* ═══════════════════════════════════════════════════ */}
        <TabsContent value="4" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search record#, category, type..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {RESERVE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="inner-glow glass-subtle p-0">
              <div className="max-h-[520px] overflow-y-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow>
                      <SortHeader field="recordNo">Record#</SortHeader>
                      <SortHeader field="category">Category</SortHeader>
                      <SortHeader field="reserveType">Reserve Type</SortHeader>
                      <SortHeader field="status">Status</SortHeader>
                      <SortHeader field="atRiskValue">At-Risk Value</SortHeader>
                      <SortHeader field="approvedAmount">Approved</SortHeader>
                      <SortHeader field="coveragePercent">Coverage</SortHeader>
                      <SortHeader field="riskScore">Risk</SortHeader>
                      <SortHeader field="calculatedAmount">Provision vs Actual</SortHeader>
                      <TableHead className="text-xs">History</TableHead>
                      <TableHead className="text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProvisions.slice(0, 50).map((rec) => (
                      <TableRow key={rec.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => openDrawer(rec)}>
                        <TableCell className="text-xs font-mono">{rec.recordNo}</TableCell>
                        <TableCell className="text-xs">{rec.category}</TableCell>
                        <TableCell><ReserveTypeBadge type={rec.reserveType} /></TableCell>
                        <TableCell><ReserveStatusBadge status={rec.status} /></TableCell>
                        <TableCell className="numeric-cell text-xs font-medium" style={{ color: "#e11d48" }}>{formatINR(rec.atRiskValue)}</TableCell>
                        <TableCell className="numeric-cell text-xs font-medium text-emerald-600">{formatINR(rec.approvedAmount)}</TableCell>
                        <TableCell><ReserveCoverageRing pct={rec.coveragePercent} /></TableCell>
                        <TableCell><RiskScoreBadge score={rec.riskScore} /></TableCell>
                        <TableCell><ProvisionVsActualBar provision={rec.provisionVsActual[0]} actual={rec.provisionVsActual[1]} /></TableCell>
                        <TableCell><MonthlyProvisionTrend history={rec.monthlyHistory} /></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="press-scale h-7 w-7" onClick={(e) => { e.stopPropagation(); openDrawer(rec); }}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 5: AGING ANALYTICS                             */}
        {/* ═══════════════════════════════════════════════════ */}
        <TabsContent value="5" className="space-y-4">
          {/* Analytics KPI Cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total Aged Value", value: formatINR(data.analyticsKPIs.totalAgedValue), icon: <IndianRupee className="h-4 w-4" />, color: "#b45309" },
              { label: "Avg Aging Days", value: `${data.analyticsKPIs.avgAgingDays} days`, icon: <Clock className="h-4 w-4" />, color: "#e11d48" },
              { label: "Obsolescence Rate", value: `${data.analyticsKPIs.obsolescenceRate}%`, icon: <AlertTriangle className="h-4 w-4" />, color: "#ea580c" },
              { label: "Write-Off Recovery Rate", value: `${data.analyticsKPIs.writeOffRecoveryRate}%`, icon: <TrendingDown className="h-4 w-4" />, color: data.analyticsKPIs.writeOffRecoveryRate >= 30 ? "#059669" : "#e11d48" },
              { label: "Slow-Moving %", value: `${data.analyticsKPIs.slowMovingPct}%`, icon: <BarChart3 className="h-4 w-4" />, color: "#475569" },
              { label: "Dead Stock %", value: `${data.analyticsKPIs.deadStockPct}%`, icon: <AlertTriangle className="h-4 w-4" />, color: "#e11d48" },
              { label: "Provision Coverage", value: `${data.analyticsKPIs.provisionCoverage}%`, icon: <Shield className="h-4 w-4" />, color: data.analyticsKPIs.provisionCoverage >= 70 ? "#059669" : "#b45309" },
              { label: "YoY Improvement", value: `${data.analyticsKPIs.yoyImprovement > 0 ? "+" : ""}${data.analyticsKPIs.yoyImprovement}%`, icon: data.analyticsKPIs.yoyImprovement >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />, color: data.analyticsKPIs.yoyImprovement >= 0 ? "#059669" : "#e11d48" },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="inner-glow glass-subtle flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
                    <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Category Aging Heatmap BarChart */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Aging Heatmap by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={CATEGORIES.map((cat) => {
                  const base = data.categoryAgingData.find((d) => d.category === cat);
                  return {
                    category: cat,
                    fresh: base?.fresh ?? Math.floor(Math.random() * 150 + 30),
                    aging: base?.aging ?? Math.floor(Math.random() * 100 + 20),
                    slow: base?.slow ?? Math.floor(Math.random() * 70 + 10),
                    dead: base?.dead ?? Math.floor(Math.random() * 40 + 5),
                  };
                })}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="fresh" stackId="a" fill="#059669" name="Fresh" />
                  <Bar dataKey="aging" stackId="a" fill="#b45309" name="Aging" />
                  <Bar dataKey="slow" stackId="a" fill="#ea580c" name="Slow" />
                  <Bar dataKey="dead" stackId="a" fill="#e11d48" name="Dead" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Warehouse-wise Aging PieChart */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Warehouse-wise Aged Value (Top 5)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.warehouseAgingData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={10}>
                      {data.warehouseAgingData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatINR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Write-Off Recovery PieChart */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Write-Off Recovery Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.writeOffRecoveryDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={10}>
                      {data.writeOffRecoveryDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Aging Velocity LineChart */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Monthly Aging Velocity (Avg Days)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.agingVelocityTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="avgDays" stroke="#b45309" strokeWidth={2} name="Avg Days" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="target" stroke="#e11d48" strokeWidth={2} strokeDasharray="5 5" name="Target" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Disposition Method Distribution BarChart */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Disposition Method Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.dispositionDist} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="method" type="category" tick={{ fontSize: 10 }} width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7c3aed" name="Count" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top 10 Slowest SKUs horizontal BarChart */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Top 10 Slowest SKUs</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topSlowestSKUs} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="sku" type="category" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip formatter={(v: number) => `${v} days`} />
                  <Bar dataKey="days" fill="#e11d48" name="Aging Days" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════ */}
      {/* DRAWERS                                              */}
      {/* ═══════════════════════════════════════════════════ */}

      {/* SKU Drawer */}
      <Sheet open={!!(drawerOpen && drawerRecord && "sku" in (drawerRecord as SKURecord))} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] sm:w-[500px] overflow-y-auto">
          {(drawerRecord as SKURecord) && (
            <>
              <SheetHeader style={{ background: "linear-gradient(135deg, #b45309, #ea580c)" }} className="rounded-t-lg px-6 py-4 text-white">
                <SheetTitle className="text-white text-base">SKU Details — {(drawerRecord as SKURecord).sku}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap gap-2">
                  <AgingBucketBadge bucket={(drawerRecord as SKURecord).agingBucket} />
                  <WarehouseBadge warehouse={(drawerRecord as SKURecord).warehouse} />
                  <DispositionBadge disposition={(drawerRecord as SKURecord).disposition} />
                </div>
                <AgingHeatBar days={(drawerRecord as SKURecord).agingDays} />
                <div className="flex items-center gap-2">
                  <LastMovementIndicator days={(drawerRecord as SKURecord).lastMovementDays} />
                </div>
                <SKUValueTile value={(drawerRecord as SKURecord).totalValue} />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{(drawerRecord as SKURecord).name}</span></div>
                  <div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{(drawerRecord as SKURecord).category}</span></div>
                  <div><span className="text-muted-foreground">Qty:</span> <span className="font-medium">{(drawerRecord as SKURecord).qty.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">Unit Cost:</span> <span className="font-medium">{formatINR((drawerRecord as SKURecord).unitCost)}</span></div>
                  <div><span className="text-muted-foreground">Batch:</span> <span className="font-medium">{(drawerRecord as SKURecord).batchNo}</span></div>
                  <div><span className="text-muted-foreground">Received:</span> <span className="font-medium">{(drawerRecord as SKURecord).receivedDate}</span></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="press-scale flex-1" style={{ backgroundColor: "#b45309" }} onClick={() => { toast.info("Review Initiated", `Reviewing ${(drawerRecord as SKURecord).sku}`); setDrawerOpen(false); }}>
                    Review
                  </Button>
                  <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => { toast.warning("Disposition Initiated", `For ${(drawerRecord as SKURecord).sku}`); setDrawerOpen(false); }}>
                    Initiate Disposition
                  </Button>
                  <Button size="sm" variant="secondary" className="press-scale flex-1" onClick={() => { toast.success("Extended", `Aging extended for ${(drawerRecord as SKURecord).sku}`); setDrawerOpen(false); }}>
                    Extend
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Slow-Moving Drawer */}
      <Sheet open={!!(drawerOpen && drawerRecord && "score" in (drawerRecord as SlowMovingRecord))} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] sm:w-[500px] overflow-y-auto">
          {(drawerRecord as SlowMovingRecord) && (
            <>
              <SheetHeader style={{ background: "linear-gradient(135deg, #e11d48, #f472b6)" }} className="rounded-t-lg px-6 py-4 text-white">
                <SheetTitle className="text-white text-base">Slow-Moving Item — {(drawerRecord as SlowMovingRecord).sku}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <VelocityBadge velocity={(drawerRecord as SlowMovingRecord).velocity} />
                  <SlowMotionScoreRing score={(drawerRecord as SlowMovingRecord).score} />
                </div>
                <VelocityTrendSpark sparkData={(drawerRecord as SlowMovingRecord).sparkData} />
                <div className="flex flex-wrap gap-2">
                  <RootCauseBadge cause={(drawerRecord as SlowMovingRecord).rootCause} />
                  <ActionPlanBadge plan={(drawerRecord as SlowMovingRecord).actionPlan} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <DaysOnHandTile days={(drawerRecord as SlowMovingRecord).daysOnHand} />
                  <CarryingCostTile cost={(drawerRecord as SlowMovingRecord).carryingCostMonthly} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{(drawerRecord as SlowMovingRecord).name}</span></div>
                  <div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{(drawerRecord as SlowMovingRecord).category}</span></div>
                  <div><span className="text-muted-foreground">Warehouse:</span> <span className="font-medium">{(drawerRecord as SlowMovingRecord).warehouse}</span></div>
                  <div><span className="text-muted-foreground">Inventory Value:</span> <span className="font-medium" style={{ color: "#b45309" }}>{formatINR((drawerRecord as SlowMovingRecord).inventoryValue)}</span></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="press-scale flex-1" style={{ backgroundColor: "#e11d48" }} onClick={() => { toast.info("Action Plan Created", `For ${(drawerRecord as SlowMovingRecord).sku}`); setDrawerOpen(false); }}>
                    Create Action Plan
                  </Button>
                  <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => { toast.warning("Escalated", `${(drawerRecord as SlowMovingRecord).sku} escalated`); setDrawerOpen(false); }}>
                    Escalate
                  </Button>
                  <Button size="sm" variant="secondary" className="press-scale flex-1" onClick={() => { toast.success("Resolved", `${(drawerRecord as SlowMovingRecord).sku} marked resolved`); setDrawerOpen(false); }}>
                    Mark Resolved
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Write-Off Drawer */}
      <Sheet open={!!(drawerOpen && drawerRecord && "woNumber" in (drawerRecord as WriteOffRecord))} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] sm:w-[500px] overflow-y-auto">
          {(drawerRecord as WriteOffRecord) && (
            <>
              <SheetHeader style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }} className="rounded-t-lg px-6 py-4 text-white">
                <SheetTitle className="text-white text-base">Write-Off — {(drawerRecord as WriteOffRecord).woNumber}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap gap-2">
                  <WriteOffStatusBadge status={(drawerRecord as WriteOffRecord).status} />
                  <DisposalMethodBadge method={(drawerRecord as WriteOffRecord).disposalMethod} />
                </div>
                <RecoveryRateBar recovery={(drawerRecord as WriteOffRecord).recoveryValue} original={(drawerRecord as WriteOffRecord).originalValue} />
                <WriteOffValueTile
                  original={(drawerRecord as WriteOffRecord).originalValue}
                  writeOff={(drawerRecord as WriteOffRecord).writeOffValue}
                  recovery={(drawerRecord as WriteOffRecord).recoveryValue}
                />
                <ApprovalProgressTracker stage={(drawerRecord as WriteOffRecord).progressStage} />
                <DisposalTimeline />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Item:</span> <span className="font-medium">{(drawerRecord as WriteOffRecord).name}</span></div>
                  <div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{(drawerRecord as WriteOffRecord).category}</span></div>
                  <div><span className="text-muted-foreground">Approval Level:</span> <ApprovalLevelBadge level={(drawerRecord as WriteOffRecord).approvalLevel} /></div>
                  <div><span className="text-muted-foreground">Proposed:</span> <span className="font-medium">{(drawerRecord as WriteOffRecord).proposedDate}</span></div>
                  <div><span className="text-muted-foreground">Completed:</span> <span className="font-medium">{(drawerRecord as WriteOffRecord).completedDate}</span></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="press-scale flex-1" style={{ backgroundColor: "#7c3aed" }} onClick={() => { toast.success("Approved", `${(drawerRecord as WriteOffRecord).woNumber} approved`); setDrawerOpen(false); }}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => { toast.error("Rejected", `${(drawerRecord as WriteOffRecord).woNumber} rejected`); setDrawerOpen(false); }}>
                    Reject
                  </Button>
                  <Button size="sm" variant="secondary" className="press-scale flex-1" onClick={() => { toast.warning("Escalated", `${(drawerRecord as WriteOffRecord).woNumber} escalated`); setDrawerOpen(false); }}>
                    Escalate
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Provisioning Drawer */}
      <Sheet open={!!(drawerOpen && drawerRecord && "recordNo" in (drawerRecord as ProvisioningRecord))} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] sm:w-[500px] overflow-y-auto">
          {(drawerRecord as ProvisioningRecord) && (
            <>
              <SheetHeader style={{ background: "linear-gradient(135deg, #475569, #64748b)" }} className="rounded-t-lg px-6 py-4 text-white">
                <SheetTitle className="text-white text-base">Provision — {(drawerRecord as ProvisioningRecord).recordNo}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <ReserveTypeBadge type={(drawerRecord as ProvisioningRecord).reserveType} />
                  <ReserveStatusBadge status={(drawerRecord as ProvisioningRecord).status} />
                  <RiskScoreBadge score={(drawerRecord as ProvisioningRecord).riskScore} />
                </div>
                <div className="flex items-center justify-center">
                  <ReserveCoverageRing pct={(drawerRecord as ProvisioningRecord).coveragePercent} />
                </div>
                <ProvisionAmountTile
                  calculated={(drawerRecord as ProvisioningRecord).calculatedAmount}
                  approved={(drawerRecord as ProvisioningRecord).approvedAmount}
                  utilized={(drawerRecord as ProvisioningRecord).utilizedAmount}
                  released={(drawerRecord as ProvisioningRecord).releasedAmount}
                />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{(drawerRecord as ProvisioningRecord).category}</span></div>
                  <div><span className="text-muted-foreground">At-Risk Value:</span> <span className="font-medium" style={{ color: "#e11d48" }}>{formatINR((drawerRecord as ProvisioningRecord).atRiskValue)}</span></div>
                  <div><span className="text-muted-foreground">Provision vs Actual:</span></div>
                  <div><ProvisionVsActualBar provision={(drawerRecord as ProvisioningRecord).provisionVsActual[0]} actual={(drawerRecord as ProvisioningRecord).provisionVsActual[1]} /></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="press-scale flex-1" style={{ backgroundColor: "#475569" }} onClick={() => { toast.success("Approved", `${(drawerRecord as ProvisioningRecord).recordNo} approved`); setDrawerOpen(false); }}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => { toast.info("Adjustment Initiated", `For ${(drawerRecord as ProvisioningRecord).recordNo}`); setDrawerOpen(false); }}>
                    Adjust
                  </Button>
                  <Button size="sm" variant="secondary" className="press-scale flex-1" onClick={() => { toast.warning("Released", `${(drawerRecord as ProvisioningRecord).recordNo} released`); setDrawerOpen(false); }}>
                    Release
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
