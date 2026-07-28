"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, Line, AreaChart, Area, PieChart, Pie, Cell,
  LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, Eye, Filter,
  IndianRupee, AlertTriangle, CheckCircle2, XCircle, Clock,
  FileText, TrendingUp, TrendingDown, BarChart3, PieChart as PieIcon,
  Activity, ShieldCheck, Ban, ChevronDown, ChevronUp,
  Truck, Package, Plane, TrainFront, Ship, Receipt,
  DollarSign, Percent, CalendarDays, Users, RefreshCw,
  MessageSquare, Scale, FileWarning, MapPin, ArrowRightLeft,
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

// ============================================================================
// Types
// ============================================================================
interface FreightInvoice {
  id: string;
  invoiceNo: string;
  carrier: string;
  route: string;
  freightType: string;
  billedAmount: number;
  expectedAmount: number;
  variance: number;
  status: string;
  dueDate: string;
  discrepancy: string;
}

interface RateRecord {
  id: string;
  lane: string;
  carrier: string;
  rateType: string;
  contractedRate: number;
  benchmarkRate: number;
  actualRate: number;
  volume: number;
  savingsPct: number;
  onTimePct: number;
}

interface PaymentRecord {
  id: string;
  refNo: string;
  carrier: string;
  invoiceNo: string;
  amount: number;
  gst: number;
  tds: number;
  netAmount: number;
  status: string;
  method: string;
  dueDate: string;
  stage: number;
}

interface DisputeRecord {
  id: string;
  disputeId: string;
  carrier: string;
  invoiceNo: string;
  disputeType: string;
  severity: string;
  amount: number;
  status: string;
  daysElapsed: number;
  slaTarget: number;
  events: string[];
}

// ============================================================================
// Seeded Data Generation
// ============================================================================
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const INR_COLORS = ["#4338ca", "#ea580c", "#059669", "#475569", "#7c3aed", "#dc2626", "#0891b2", "#ca8a04"];

function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function generateData() {
  const rand = seededRandom(199133);

  const carriers = ["BlueDart", "Delhivery", "DTDC", "Gati", "XpressBees", "Ecom Express", "Shadowfax", "Spotted", "Rivigo", "BlackBuck"] as const;
  const cities = ["Mumbai", "Delhi", "Chennai", "Bangalore", "Hyderabad", "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Lucknow", "Coimbatore", "Indore"] as const;
  const invoiceStatuses = ["Pending Review", "Under Audit", "Audited", "Flagged", "Cleared", "Paid", "Disputed", "Reversed"] as const;
  const freightTypes = ["FTL", "PTL", "Express", "Last Mile", "Air Cargo", "Surface", "Rail", "Multimodal"] as const;
  const discrepancyTypes = ["Overcharge", "Duplicate Invoice", "Weight Mismatch", "Accessorial Error", "Rate Mismatch", "Missing Documentation"] as const;
  const lanes = ["Mumbai-Delhi", "Chennai-Bangalore", "Kolkata-Mumbai", "Delhi-Chennai", "Pune-Hyderabad", "Ahmedabad-Jaipur", "Mumbai-Pune", "Delhi-Kolkata", "Bangalore-Hyderabad", "Chennai-Kolkata", "Delhi-Pune", "Mumbai-Hyderabad"] as const;
  const rateTypes = ["Base Rate", "FTL Rate", "PTL Rate", "Express Premium", "Fuel Surcharge", "Accessorial"] as const;
  const paymentStatuses = ["Scheduled", "Processing", "Held", "Approved", "Paid", "Failed", "Reversed", "Partially Paid"] as const;
  const paymentMethods = ["NEFT", "RTGS", "UPI", "IMPS", "Cheque", "Bank Draft", "ECS", "Wire Transfer", "Net Banking", "Wallet"] as const;
  const disputeTypes = ["Overcharge", "Billing Error", "Duplicate Charge", "Service Failure", "Delay Penalty", "Weight Dispute", "Route Deviation", "Missing POD"] as const;
  const disputeStatuses = ["Open", "Under Investigation", "Carrier Responded", "Accepted", "Rejected", "Escalated"] as const;
  const severityLevels = ["Critical", "High", "Medium", "Low", "Minimal"] as const;

  const invoices: FreightInvoice[] = [];
  for (let i = 0; i < 80; i++) {
    const billed = Math.round(rand() * 200000 + 5000);
    const variance = (rand() - 0.4) * 30;
    invoices.push({
      id: `inv-${i + 1}`,
      invoiceNo: `FAP-2024-${String(i + 1).padStart(4, "0")}`,
      carrier: carriers[Math.floor(rand() * carriers.length)],
      route: `${cities[Math.floor(rand() * cities.length)]}-${cities[Math.floor(rand() * cities.length)]}`,
      freightType: freightTypes[Math.floor(rand() * freightTypes.length)],
      billedAmount: billed,
      expectedAmount: Math.round(billed / (1 + variance / 100)),
      variance: Math.round(variance * 100) / 100,
      status: invoiceStatuses[Math.floor(rand() * invoiceStatuses.length)],
      dueDate: `2024-${String(Math.floor(rand() * 12) + 1).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      discrepancy: rand() > 0.35 ? discrepancyTypes[Math.floor(rand() * discrepancyTypes.length)] : "None",
    });
  }

  const rates: RateRecord[] = [];
  for (let i = 0; i < 60; i++) {
    const contracted = Math.round(rand() * 150 + 20);
    const benchmark = Math.round(contracted * (0.9 + rand() * 0.2));
    const actual = Math.round(contracted * (0.85 + rand() * 0.3));
    rates.push({
      id: `rate-${i + 1}`,
      lane: lanes[Math.floor(rand() * lanes.length)],
      carrier: carriers[Math.floor(rand() * carriers.length)],
      rateType: rateTypes[Math.floor(rand() * rateTypes.length)],
      contractedRate: contracted,
      benchmarkRate: benchmark,
      actualRate: actual,
      volume: Math.round(rand() * 500 + 10),
      savingsPct: Math.round(((contracted - actual) / contracted) * 10000) / 100,
      onTimePct: Math.round(rand() * 30 + 70),
    });
  }

  const payments: PaymentRecord[] = [];
  for (let i = 0; i < 70; i++) {
    const amt = Math.round(rand() * 180000 + 3000);
    const gst = Math.round(amt * 0.18);
    const tds = Math.round(amt * 0.02);
    payments.push({
      id: `pay-${i + 1}`,
      refNo: `PAY-${String(i + 1).padStart(5, "0")}`,
      carrier: carriers[Math.floor(rand() * carriers.length)],
      invoiceNo: `FAP-2024-${String(Math.floor(rand() * 80) + 1).padStart(4, "0")}`,
      amount: amt,
      gst,
      tds,
      netAmount: amt + gst - tds,
      status: paymentStatuses[Math.floor(rand() * paymentStatuses.length)],
      method: paymentMethods[Math.floor(rand() * paymentMethods.length)],
      dueDate: `2024-${String(Math.floor(rand() * 12) + 1).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      stage: Math.floor(rand() * 5),
    });
  }

  const disputes: DisputeRecord[] = [];
  const eventSets = [
    ["Raised", "Evidence Submitted", "Carrier Responded", "Under Review", "Settled"],
    ["Raised", "Evidence Submitted", "Carrier Responded", "Escalated"],
    ["Raised", "Evidence Submitted", "Under Review"],
    ["Raised", "Carrier Responded", "Resolution Proposed", "Settled"],
    ["Raised", "Evidence Submitted", "Rejected", "Appealed", "Under Legal Review"],
  ];
  for (let i = 0; i < 55; i++) {
    disputes.push({
      id: `disp-${i + 1}`,
      disputeId: `DSP-${String(i + 1).padStart(4, "0")}`,
      carrier: carriers[Math.floor(rand() * carriers.length)],
      invoiceNo: `FAP-2024-${String(Math.floor(rand() * 80) + 1).padStart(4, "0")}`,
      disputeType: disputeTypes[Math.floor(rand() * disputeTypes.length)],
      severity: severityLevels[Math.floor(rand() * severityLevels.length)],
      amount: Math.round(rand() * 800000 + 5000),
      status: disputeStatuses[Math.floor(rand() * disputeStatuses.length)],
      daysElapsed: Math.floor(rand() * 14),
      slaTarget: 7,
      events: eventSets[Math.floor(rand() * eventSets.length)],
    });
  }

  const monthlySpend = [
    { month: "Jan", spend: 4200000, audited: 3800000, savings: 400000 },
    { month: "Feb", spend: 3800000, audited: 3500000, savings: 300000 },
    { month: "Mar", spend: 5100000, audited: 4800000, savings: 300000 },
    { month: "Apr", spend: 4600000, audited: 4200000, savings: 400000 },
    { month: "May", spend: 4900000, audited: 4500000, savings: 400000 },
    { month: "Jun", spend: 5300000, audited: 4900000, savings: 400000 },
    { month: "Jul", spend: 4100000, audited: 3800000, savings: 300000 },
    { month: "Aug", spend: 4700000, audited: 4400000, savings: 300000 },
    { month: "Sep", spend: 5500000, audited: 5100000, savings: 400000 },
    { month: "Oct", spend: 5000000, audited: 4700000, savings: 300000 },
    { month: "Nov", spend: 5200000, audited: 4800000, savings: 400000 },
    { month: "Dec", spend: 5800000, audited: 5400000, savings: 400000 },
  ];

  const discrepancyByType = [
    { name: "Overcharge", value: 34, color: "#dc2626" },
    { name: "Duplicate", value: 18, color: "#ea580c" },
    { name: "Weight Mismatch", value: 22, color: "#ca8a04" },
    { name: "Accessorial Error", value: 14, color: "#0891b2" },
    { name: "Rate Error", value: 8, color: "#7c3aed" },
    { name: "Missing Charge", value: 4, color: "#475569" },
  ];

  const topCarriers = [
    { name: "BlueDart", invoices: 156 },
    { name: "Delhivery", invoices: 142 },
    { name: "DTDC", invoices: 128 },
    { name: "Gati", invoices: 115 },
    { name: "XpressBees", invoices: 108 },
    { name: "Ecom Express", invoices: 98 },
    { name: "Shadowfax", invoices: 85 },
    { name: "Spotted", invoices: 72 },
    { name: "Rivigo", invoices: 65 },
    { name: "BlackBuck", invoices: 58 },
  ];

  const auditStatusDist = [
    { name: "Audited", value: 45, color: "#0891b2" },
    { name: "Pending", value: 25, color: "#64748b" },
    { name: "Flagged", value: 12, color: "#dc2626" },
    { name: "Cleared", value: 10, color: "#059669" },
    { name: "Disputed", value: 8, color: "#ea580c" },
  ];

  const reconTrend = [
    { month: "Jan", matched: 320, unmatched: 45, disputed: 15 },
    { month: "Feb", matched: 340, unmatched: 38, disputed: 12 },
    { month: "Mar", matched: 360, unmatched: 30, disputed: 10 },
    { month: "Apr", matched: 350, unmatched: 35, disputed: 15 },
    { month: "May", matched: 380, unmatched: 28, disputed: 12 },
    { month: "Jun", matched: 400, unmatched: 22, disputed: 8 },
    { month: "Jul", matched: 390, unmatched: 25, disputed: 15 },
    { month: "Aug", matched: 410, unmatched: 20, disputed: 10 },
    { month: "Sep", matched: 420, unmatched: 18, disputed: 7 },
    { month: "Oct", matched: 430, unmatched: 15, disputed: 5 },
    { month: "Nov", matched: 440, unmatched: 12, disputed: 3 },
    { month: "Dec", matched: 450, unmatched: 10, disputed: 5 },
  ];

  const carrierRecon = [
    { name: "BlueDart", matched: 145, unmatched: 11 },
    { name: "Delhivery", matched: 132, unmatched: 10 },
    { name: "DTDC", matched: 118, unmatched: 10 },
    { name: "Gati", matched: 108, unmatched: 7 },
    { name: "XpressBees", matched: 100, unmatched: 8 },
    { name: "Ecom Express", matched: 90, unmatched: 8 },
    { name: "Shadowfax", matched: 78, unmatched: 7 },
    { name: "Spotted", matched: 65, unmatched: 7 },
    { name: "Rivigo", matched: 60, unmatched: 5 },
    { name: "BlackBuck", matched: 52, unmatched: 6 },
  ];

  const quarterlySavings = [
    { quarter: "Q1", freightSavings: 12, accessorialSavings: 5, rateCorrection: 3, gstSavings: 2 },
    { quarter: "Q2", freightSavings: 15, accessorialSavings: 6, rateCorrection: 4, gstSavings: 3 },
    { quarter: "Q3", freightSavings: 18, accessorialSavings: 7, rateCorrection: 5, gstSavings: 4 },
    { quarter: "Q4", freightSavings: 14, accessorialSavings: 8, rateCorrection: 3, gstSavings: 2 },
  ];

  const disputeResolution = [
    { name: "Won", value: 40, color: "#059669" },
    { name: "Lost", value: 15, color: "#dc2626" },
    { name: "Partial", value: 25, color: "#ca8a04" },
    { name: "Settled", value: 20, color: "#0891b2" },
  ];

  const laneCostTrend = [
    { month: "Jan", "Mumbai-Delhi": 85, "Chennai-Bangalore": 62, "Kolkata-Mumbai": 78, "Delhi-Chennai": 90, "Pune-Hyderabad": 55 },
    { month: "Feb", "Mumbai-Delhi": 82, "Chennai-Bangalore": 60, "Kolkata-Mumbai": 80, "Delhi-Chennai": 88, "Pune-Hyderabad": 52 },
    { month: "Mar", "Mumbai-Delhi": 88, "Chennai-Bangalore": 65, "Kolkata-Mumbai": 82, "Delhi-Chennai": 92, "Pune-Hyderabad": 58 },
    { month: "Apr", "Mumbai-Delhi": 84, "Chennai-Bangalore": 58, "Kolkata-Mumbai": 76, "Delhi-Chennai": 86, "Pune-Hyderabad": 50 },
    { month: "May", "Mumbai-Delhi": 90, "Chennai-Bangalore": 68, "Kolkata-Mumbai": 85, "Delhi-Chennai": 94, "Pune-Hyderabad": 60 },
    { month: "Jun", "Mumbai-Delhi": 86, "Chennai-Bangalore": 63, "Kolkata-Mumbai": 79, "Delhi-Chennai": 89, "Pune-Hyderabad": 54 },
  ];

  return {
    invoices, rates, payments, disputes,
    carriers: [...carriers], invoiceStatuses: [...invoiceStatuses],
    freightTypes: [...freightTypes], discrepancyTypes: [...discrepancyTypes],
    lanes: [...lanes], rateTypes: [...rateTypes],
    paymentStatuses: [...paymentStatuses], paymentMethods: [...paymentMethods],
    disputeTypes: [...disputeTypes], disputeStatuses: [...disputeStatuses],
    severityLevels: [...severityLevels],
    monthlySpend, discrepancyByType, topCarriers, auditStatusDist,
    reconTrend, carrierRecon, quarterlySavings, disputeResolution, laneCostTrend,
  };
}

const data = generateData();

// ============================================================================
// Sub-components (outside main component, receive toast if needed)
// ============================================================================

function AuditStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    "Pending Review": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    "Under Audit": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Audited": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    "Flagged": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Cleared": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Paid": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    "Disputed": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    "Reversed": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium fap-badge-shimmer", colorMap[status] || "bg-gray-100 text-gray-700")}>{status}</span>;
}

function FreightTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    FTL: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
    PTL: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Express: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Last Mile": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
    "Air Cargo": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    Surface: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Rail: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Multimodal: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colorMap[type] || "bg-gray-100 text-gray-700")}>{type}</span>;
}

function DiscrepancyBadge({ type }: { type: string }) {
  if (type === "None") return null;
  const colorMap: Record<string, string> = {
    Overcharge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Duplicate Invoice": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    "Weight Mismatch": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Accessorial Error": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    "Rate Mismatch": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    "Missing Documentation": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colorMap[type] || "bg-gray-100 text-gray-700")}>{type}</span>;
}

function AmountVarianceBar({ billed, expected }: { billed: number; expected: number }) {
  const max = Math.max(billed, expected);
  const billedPct = max > 0 ? (billed / max) * 100 : 0;
  const withinTolerance = Math.abs(billed - expected) / expected < 0.05;
  const barColor = withinTolerance ? "bg-emerald-500" : billed > expected ? "bg-red-500" : "bg-sky-500";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all fap-amount-bar", barColor)} style={{ width: `${billedPct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-16 text-right">{formatINR(billed)}</span>
    </div>
  );
}

function RateComparisonBar({ contracted, benchmark, actual }: { contracted: number; benchmark: number; actual: number }) {
  const max = Math.max(contracted, benchmark, actual);
  const cPct = max > 0 ? (contracted / max) * 100 : 0;
  const bPct = max > 0 ? (benchmark / max) * 100 : 0;
  const aPct = max > 0 ? (actual / max) * 100 : 0;
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground w-20">Contracted</span>
        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className="h-full rounded-full bg-indigo-500 fap-rate-bar" style={{ width: `${cPct}%` }} /></div>
        <span className="text-xs w-14 text-right">₹{contracted}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground w-20">Benchmark</span>
        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className="h-full rounded-full bg-emerald-500 fap-rate-bar" style={{ width: `${bPct}%` }} /></div>
        <span className="text-xs w-14 text-right">₹{benchmark}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground w-20">Actual</span>
        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className="h-full rounded-full bg-orange-500 fap-rate-bar" style={{ width: `${aPct}%` }} /></div>
        <span className="text-xs w-14 text-right">₹{actual}</span>
      </div>
    </div>
  );
}

function SavingsIndicator({ pct }: { pct: number }) {
  const isSaved = pct >= 0;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", isSaved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400")}>
      {isSaved ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Scheduled: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Held: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Approved: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Reversed: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
    "Partially Paid": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colorMap[status] || "bg-gray-100 text-gray-700")}>{status}</span>;
}

function GSTBreakdownTile({ amount }: { amount: number }) {
  const cgst = Math.round(amount * 0.09);
  const sgst = Math.round(amount * 0.09);
  return (
    <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="text-center"><p className="text-[10px] text-muted-foreground">CGST 9%</p><p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{formatINR(cgst)}</p></div>
      <div className="text-center"><p className="text-[10px] text-muted-foreground">SGST 9%</p><p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{formatINR(sgst)}</p></div>
      <div className="text-center"><p className="text-[10px] text-muted-foreground">Total GST</p><p className="text-xs font-semibold text-orange-600 dark:text-orange-400">{formatINR(cgst + sgst)}</p></div>
    </div>
  );
}

function TDSBadge({ amount }: { amount: number }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">TDS {formatINR(amount)}</span>;
}

function PaymentTimeline({ stage }: { stage: number }) {
  const stages = ["Invoice", "Verified", "Approved", "Processing", "Paid"];
  return (
    <div className="flex items-center gap-1 w-full">
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <div className={cn("fap-timeline-dot w-3 h-3 rounded-full shrink-0", i <= stage ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600")} title={s} />
          {i < stages.length - 1 && <div className={cn("flex-1 h-0.5", i < stage ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600")} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function DisputeSeverityBadge({ severity }: { severity: string }) {
  const colorMap: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Low: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    Minimal: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", colorMap[severity] || "bg-gray-100 text-gray-700")}>{severity}</span>;
}

function SLATracker({ elapsed, target }: { elapsed: number; target: number }) {
  const pct = Math.min((elapsed / target) * 100, 100);
  const isOverdue = elapsed > target;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{elapsed}d elapsed</span>
        <span className={cn("font-medium", isOverdue ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>{target}d target</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div className={cn("h-full rounded-full transition-all", isOverdue ? "bg-red-500" : elapsed > target * 0.7 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function DisputeTimeline({ events }: { events: string[] }) {
  return (
    <div className="relative pl-4 space-y-3">
      <div className="absolute left-[5px] top-1 bottom-1 w-0.5 bg-gray-300 dark:bg-gray-600" />
      {events.map((ev, i) => (
        <div key={i} className="relative flex items-center gap-2 fap-dispute-event">
          <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 border-2 border-white dark:border-gray-900 z-10", i === events.length - 1 ? "bg-indigo-500" : "bg-emerald-500")} />
          <span className="text-xs text-muted-foreground">{ev}</span>
        </div>
      ))}
    </div>
  );
}

function ResolutionRateRing({ rate }: { rate: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="fap-resolution-ring">
      <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-200 dark:text-gray-700" />
      <circle cx="32" cy="32" r={radius} fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 32 32)" />
      <text x="32" y="36" textAnchor="middle" className="fill-foreground text-[11px] font-bold">{rate}%</text>
    </svg>
  );
}

function LanePerformanceCard({ record }: { record: RateRecord }) {
  return (
    <Card className="fap-lane-card">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">{record.lane}</p>
          <SavingsIndicator pct={record.savingsPct} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-muted-foreground">Volume</span><p className="font-semibold">{record.volume} shipments</p></div>
          <div><span className="text-muted-foreground">Avg Rate</span><p className="font-semibold">₹{record.actualRate}/kg</p></div>
          <div><span className="text-muted-foreground">On-Time</span><p className="font-semibold">{record.onTimePct}%</p></div>
          <div><span className="text-muted-foreground">Carrier</span><p className="font-semibold">{record.carrier}</p></div>
        </div>
        <RateComparisonBar contracted={record.contractedRate} benchmark={record.benchmarkRate} actual={record.actualRate} />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================
export default function FreightAuditPaymentView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FreightInvoice | null>(null);
  const [selectedRate, setSelectedRate] = useState<RateRecord | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(null);

  const handleSort = useCallback((field: string) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }, [sortField]);

  const filteredInvoices = useMemo(() => {
    let list = [...data.invoices];
    if (searchQuery) list = list.filter((i) => i.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) || i.carrier.toLowerCase().includes(searchQuery.toLowerCase()));
    if (statusFilter !== "All") list = list.filter((i) => i.status === statusFilter);
    if (sortField) list.sort((a, b) => { const av = (a as any)[sortField]; const bv = (b as any)[sortField]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp; });
    return list;
  }, [searchQuery, statusFilter, sortField, sortDir]);

  const filteredRates = useMemo(() => {
    let list = [...data.rates];
    if (searchQuery) list = list.filter((r) => r.carrier.toLowerCase().includes(searchQuery.toLowerCase()) || r.lane.toLowerCase().includes(searchQuery.toLowerCase()));
    if (statusFilter !== "All") list = list.filter((r) => r.carrier === statusFilter);
    if (sortField) list.sort((a, b) => { const av = (a as any)[sortField]; const bv = (b as any)[sortField]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp; });
    return list;
  }, [searchQuery, statusFilter, sortField, sortDir]);

  const filteredPayments = useMemo(() => {
    let list = [...data.payments];
    if (searchQuery) list = list.filter((p) => p.refNo.toLowerCase().includes(searchQuery.toLowerCase()) || p.carrier.toLowerCase().includes(searchQuery.toLowerCase()));
    if (statusFilter !== "All") list = list.filter((p) => p.status === statusFilter);
    if (sortField) list.sort((a, b) => { const av = (a as any)[sortField]; const bv = (b as any)[sortField]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp; });
    return list;
  }, [searchQuery, statusFilter, sortField, sortDir]);

  const filteredDisputes = useMemo(() => {
    let list = [...data.disputes];
    if (searchQuery) list = list.filter((d) => d.disputeId.toLowerCase().includes(searchQuery.toLowerCase()) || d.carrier.toLowerCase().includes(searchQuery.toLowerCase()));
    if (statusFilter !== "All") list = list.filter((d) => d.status === statusFilter);
    if (sortField) list.sort((a, b) => { const av = (a as any)[sortField]; const bv = (b as any)[sortField]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp; });
    return list;
  }, [searchQuery, statusFilter, sortField, sortDir]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-muted-foreground" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 text-indigo-500" /> : <ArrowDown className="w-3 h-3 text-indigo-500" />;
  };

  const kpis = [
    { label: "Total Freight Spend", value: "₹6.12 Cr", icon: IndianRupee, color: "text-indigo-600 dark:text-indigo-400", border: "border-l-indigo-500" },
    { label: "Invoices Audited", value: "847", icon: FileText, color: "text-orange-600 dark:text-orange-400", border: "border-l-orange-500" },
    { label: "Discrepancies Found", value: "156", icon: AlertTriangle, color: "text-red-600 dark:text-red-400", border: "border-l-red-500" },
    { label: "Audit Coverage", value: "94.2%", icon: ShieldCheck, color: "text-emerald-600 dark:text-emerald-400", border: "border-l-emerald-500" },
    { label: "Avg Savings Rate", value: "8.7%", icon: Percent, color: "text-violet-600 dark:text-violet-400", border: "border-l-violet-500" },
    { label: "Pending Payments", value: "₹1.24 Cr", icon: Clock, color: "text-amber-600 dark:text-amber-400", border: "border-l-amber-500" },
    { label: "Disputes Open", value: "23", icon: Ban, color: "text-rose-600 dark:text-rose-400", border: "border-l-rose-500" },
    { label: "Carriers Active", value: "10", icon: Users, color: "text-cyan-600 dark:text-cyan-400", border: "border-l-cyan-500" },
  ];

  const analyticsCards = [
    { label: "Total Reconciled", value: "₹4.88 Cr", border: "border-l-indigo-500" },
    { label: "Unmatched Amount", value: "₹18.4 L", border: "border-l-orange-500" },
    { label: "Match Rate", value: "96.2%", border: "border-l-emerald-500" },
    { label: "Avg Audit Time", value: "2.3 days", border: "border-l-violet-500" },
    { label: "Carrier Score", value: "87/100", border: "border-l-slate-500" },
    { label: "Dispute Win Rate", value: "72%", border: "border-l-red-500" },
    { label: "GST Reconciled", value: "₹92.1 L", border: "border-l-cyan-500" },
    { label: "TDS Reconciled", value: "₹12.8 L", border: "border-l-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Freight Audit & Payment Reconciliation" description="Comprehensive freight spend audit, rate benchmarking, payment tracking, and dispute resolution" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap gap-1 bg-muted p-1">
          {["dashboard", "invoices", "rate-benchmark", "payments", "disputes", "analytics"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="fap-tab-trigger data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              {tab === "dashboard" ? "Audit Dashboard" : tab === "invoices" ? "Freight Invoices" : tab === "rate-benchmark" ? "Rate Benchmarking" : tab === "payments" ? "Payment Tracking" : tab === "disputes" ? "Dispute Resolution" : "Reconciliation Analytics"}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ===== TAB 0: Audit Dashboard ===== */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-3 fap-kpi-grid">
            {kpis.map((kpi, i) => (
              <Card key={i} className={cn("fap-kpi-card border-l-4", kpi.border, "animate-fap-fade-up")} style={{ animationDelay: `${i * 50}ms` }}>
                <CardContent className="p-4 flex items-center gap-3">
                  <kpi.icon className={cn("w-5 h-5 shrink-0", kpi.color)} />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
                    <p className="text-lg font-bold fap-counter-value">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="fap-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Freight Spend vs Audited</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.monthlySpend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(v: number) => formatINR(v)} />
                    <Area type="monotone" dataKey="spend" fill="#4338ca" fillOpacity={0.15} stroke="#4338ca" name="Total Spend" />
                    <Area type="monotone" dataKey="audited" fill="#059669" fillOpacity={0.15} stroke="#059669" name="Audited" />
                    <Line type="monotone" dataKey="savings" stroke="#ea580c" strokeWidth={2} dot={false} name="Savings" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="fap-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Discrepancy by Type</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={data.discrepancyByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                        {data.discrepancyByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="fap-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Audit Status Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={data.auditStatusDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                        {data.auditStatusDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="fap-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top 10 Carriers by Invoice Count</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.topCarriers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="invoices" fill="#4338ca" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== TAB 1: Freight Invoices ===== */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search invoice number or carrier..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-8 pr-8 h-9 rounded-md border bg-background text-sm appearance-none cursor-pointer">
                <option value="All">All Statuses</option>
                {data.invoiceStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-background border-b">
                    <tr>
                      {[
                        { key: "invoiceNo", label: "Invoice #" },
                        { key: "carrier", label: "Carrier" },
                        { key: "route", label: "Route" },
                        { key: "freightType", label: "Freight Type" },
                        { key: "billedAmount", label: "Billed" },
                        { key: "expectedAmount", label: "Expected" },
                        { key: "variance", label: "Variance %" },
                        { key: "status", label: "Status" },
                        { key: "dueDate", label: "Due Date" },
                        { key: "", label: "Actions" },
                      ].map((col) => (
                        <th key={col.key} className="px-3 py-2 text-left font-medium text-muted-foreground cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 fap-sort-header" onClick={() => col.key && handleSort(col.key)}>
                          <div className="flex items-center gap-1">{col.label}{col.key && <SortIcon field={col.key} />}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.slice(0, 40).map((inv, i) => (
                      <tr key={inv.id} className={cn("border-b hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors fap-row-stripe", i % 2 === 0 && "bg-gray-50/50 dark:bg-gray-900/20")}>
                        <td className="px-3 py-2 font-mono font-medium">{inv.invoiceNo}</td>
                        <td className="px-3 py-2">{inv.carrier}</td>
                        <td className="px-3 py-2">{inv.route}</td>
                        <td className="px-3 py-2"><FreightTypeBadge type={inv.freightType} /></td>
                        <td className="px-3 py-2">{formatINR(inv.billedAmount)}</td>
                        <td className="px-3 py-2">{formatINR(inv.expectedAmount)}</td>
                        <td className={cn("px-3 py-2 font-medium", inv.variance > 5 ? "text-red-600" : inv.variance < -5 ? "text-sky-600" : "text-emerald-600")}>{inv.variance > 0 ? "+" : ""}{inv.variance}%</td>
                        <td className="px-3 py-2"><AuditStatusBadge status={inv.status} /></td>
                        <td className="px-3 py-2">{inv.dueDate}</td>
                        <td className="px-3 py-2">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 fap-action-btn" onClick={() => { setSelectedInvoice(inv); setDrawerOpen(true); }}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Sheet open={drawerOpen && !!selectedInvoice} onOpenChange={(o) => { setDrawerOpen(o); if (!o) setSelectedInvoice(null); }}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              {selectedInvoice && (
                <>
                  <SheetHeader>
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 -mx-6 -mt-4 px-6 py-4 rounded-b-xl">
                      <SheetTitle className="text-white">Invoice {selectedInvoice.invoiceNo}</SheetTitle>
                      <p className="text-indigo-100 text-sm mt-1">{selectedInvoice.carrier} · {selectedInvoice.route}</p>
                    </div>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2"><AuditStatusBadge status={selectedInvoice.status} /><FreightTypeBadge type={selectedInvoice.freightType} /></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Amount Variance</p>
                      <AmountVarianceBar billed={selectedInvoice.billedAmount} expected={selectedInvoice.expectedAmount} />
                    </div>
                    {selectedInvoice.discrepancy !== "None" && <div className="flex items-center gap-2"><span className="text-sm font-medium">Discrepancy:</span><DiscrepancyBadge type={selectedInvoice.discrepancy} /></div>}
                    <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs">
                      <div><span className="text-muted-foreground block">Invoice #</span><span className="font-medium">{selectedInvoice.invoiceNo}</span></div>
                      <div><span className="text-muted-foreground block">Billed</span><span className="font-medium">{formatINR(selectedInvoice.billedAmount)}</span></div>
                      <div><span className="text-muted-foreground block">Expected</span><span className="font-medium">{formatINR(selectedInvoice.expectedAmount)}</span></div>
                      <div><span className="text-muted-foreground block">Variance</span><span className="font-medium">{selectedInvoice.variance}%</span></div>
                      <div><span className="text-muted-foreground block">Due Date</span><span className="font-medium">{selectedInvoice.dueDate}</span></div>
                      <div><span className="text-muted-foreground block">Route</span><span className="font-medium">{selectedInvoice.route}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => { toast.success("Approved", "Invoice approved for payment"); setDrawerOpen(false); }}>Approve</Button>
                      <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50" onClick={() => { toast.warning("Flagged", "Invoice has been flagged for review"); setDrawerOpen(false); }}>Flag</Button>
                      <Button size="sm" variant="outline" className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50" onClick={() => { toast.info("Dispute Raised", "Dispute has been created"); setDrawerOpen(false); }}>Dispute</Button>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        {/* ===== TAB 2: Rate Benchmarking ===== */}
        <TabsContent value="rate-benchmark" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search carrier or lane..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-8 pr-8 h-9 rounded-md border bg-background text-sm appearance-none cursor-pointer">
                <option value="All">All Carriers</option>
                {data.carriers.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRates.slice(0, 12).map((r) => (
              <LanePerformanceCard key={r.id} record={r} />
            ))}
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-background border-b">
                    <tr>
                      {[
                        { key: "lane", label: "Lane" }, { key: "carrier", label: "Carrier" },
                        { key: "rateType", label: "Rate Type" }, { key: "contractedRate", label: "Contracted" },
                        { key: "benchmarkRate", label: "Benchmark" }, { key: "actualRate", label: "Actual" },
                        { key: "volume", label: "Volume" }, { key: "savingsPct", label: "Savings %" },
                        { key: "onTimePct", label: "On-Time %" }, { key: "", label: "Actions" },
                      ].map((col) => (
                        <th key={col.key} className="px-3 py-2 text-left font-medium text-muted-foreground cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 fap-sort-header" onClick={() => col.key && handleSort(col.key)}>
                          <div className="flex items-center gap-1">{col.label}{col.key && <SortIcon field={col.key} />}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRates.slice(0, 40).map((r, i) => (
                      <tr key={r.id} className={cn("border-b hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors fap-row-stripe", i % 2 === 0 && "bg-gray-50/50 dark:bg-gray-900/20")}>
                        <td className="px-3 py-2 font-medium">{r.lane}</td>
                        <td className="px-3 py-2">{r.carrier}</td>
                        <td className="px-3 py-2">{r.rateType}</td>
                        <td className="px-3 py-2">₹{r.contractedRate}</td>
                        <td className="px-3 py-2">₹{r.benchmarkRate}</td>
                        <td className="px-3 py-2">₹{r.actualRate}</td>
                        <td className="px-3 py-2">{r.volume}</td>
                        <td className="px-3 py-2"><SavingsIndicator pct={r.savingsPct} /></td>
                        <td className="px-3 py-2">{r.onTimePct}%</td>
                        <td className="px-3 py-2">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 fap-action-btn" onClick={() => { setSelectedRate(r); setDrawerOpen(true); }}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Sheet open={drawerOpen && !!selectedRate} onOpenChange={(o) => { setDrawerOpen(o); if (!o) setSelectedRate(null); }}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              {selectedRate && (
                <>
                  <SheetHeader>
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 -mx-6 -mt-4 px-6 py-4 rounded-b-xl">
                      <SheetTitle className="text-white">Rate Details — {selectedRate.lane}</SheetTitle>
                      <p className="text-emerald-100 text-sm mt-1">{selectedRate.carrier} · {selectedRate.rateType}</p>
                    </div>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <RateComparisonBar contracted={selectedRate.contractedRate} benchmark={selectedRate.benchmarkRate} actual={selectedRate.actualRate} />
                    <div className="flex items-center justify-between"><span className="text-sm font-medium">Savings</span><SavingsIndicator pct={selectedRate.savingsPct} /></div>
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs">
                      <div><span className="text-muted-foreground block">Lane</span><span className="font-medium">{selectedRate.lane}</span></div>
                      <div><span className="text-muted-foreground block">Volume</span><span className="font-medium">{selectedRate.volume} shipments</span></div>
                      <div><span className="text-muted-foreground block">On-Time</span><span className="font-medium">{selectedRate.onTimePct}%</span></div>
                      <div><span className="text-muted-foreground block">Rate Type</span><span className="font-medium">{selectedRate.rateType}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => { toast.success("Renegotiation Initiated", "Rate renegotiation request sent to carrier"); setDrawerOpen(false); }}>Renegotiate</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => { toast.info("Benchmark Updated", "Benchmark rates have been refreshed"); setDrawerOpen(false); }}>Benchmark</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => { toast.info("Exported", "Rate data exported to CSV"); setDrawerOpen(false); }}>Export</Button>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        {/* ===== TAB 3: Payment Tracking ===== */}
        <TabsContent value="payments" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search payment reference..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-8 pr-8 h-9 rounded-md border bg-background text-sm appearance-none cursor-pointer">
                <option value="All">All Statuses</option>
                {data.paymentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-background border-b">
                    <tr>
                      {[
                        { key: "refNo", label: "Ref #" }, { key: "carrier", label: "Carrier" },
                        { key: "invoiceNo", label: "Invoice" }, { key: "amount", label: "Amount" },
                        { key: "gst", label: "GST" }, { key: "tds", label: "TDS" },
                        { key: "netAmount", label: "Net Amount" }, { key: "status", label: "Status" },
                        { key: "method", label: "Method" }, { key: "", label: "Actions" },
                      ].map((col) => (
                        <th key={col.key} className="px-3 py-2 text-left font-medium text-muted-foreground cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 fap-sort-header" onClick={() => col.key && handleSort(col.key)}>
                          <div className="flex items-center gap-1">{col.label}{col.key && <SortIcon field={col.key} />}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.slice(0, 40).map((p, i) => (
                      <tr key={p.id} className={cn("border-b hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors fap-row-stripe", i % 2 === 0 && "bg-gray-50/50 dark:bg-gray-900/20")}>
                        <td className="px-3 py-2 font-mono font-medium">{p.refNo}</td>
                        <td className="px-3 py-2">{p.carrier}</td>
                        <td className="px-3 py-2">{p.invoiceNo}</td>
                        <td className="px-3 py-2">{formatINR(p.amount)}</td>
                        <td className="px-3 py-2 text-indigo-600">{formatINR(p.gst)}</td>
                        <td className="px-3 py-2 text-red-600">{formatINR(p.tds)}</td>
                        <td className="px-3 py-2 font-medium">{formatINR(p.netAmount)}</td>
                        <td className="px-3 py-2"><PaymentStatusBadge status={p.status} /></td>
                        <td className="px-3 py-2">{p.method}</td>
                        <td className="px-3 py-2">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 fap-action-btn" onClick={() => { setSelectedPayment(p); setDrawerOpen(true); }}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Sheet open={drawerOpen && !!selectedPayment} onOpenChange={(o) => { setDrawerOpen(o); if (!o) setSelectedPayment(null); }}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              {selectedPayment && (
                <>
                  <SheetHeader>
                    <div className="bg-gradient-to-r from-slate-600 to-gray-700 -mx-6 -mt-4 px-6 py-4 rounded-b-xl">
                      <SheetTitle className="text-white">Payment {selectedPayment.refNo}</SheetTitle>
                      <p className="text-slate-200 text-sm mt-1">{selectedPayment.carrier} · {selectedPayment.method}</p>
                    </div>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2"><PaymentStatusBadge status={selectedPayment.status} /><TDSBadge amount={selectedPayment.tds} /></div>
                    <div><p className="text-sm font-medium mb-2">GST Breakdown</p><GSTBreakdownTile amount={selectedPayment.amount} /></div>
                    <div><p className="text-sm font-medium mb-2">Payment Progress</p><PaymentTimeline stage={selectedPayment.stage} /></div>
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs">
                      <div><span className="text-muted-foreground block">Reference</span><span className="font-medium">{selectedPayment.refNo}</span></div>
                      <div><span className="text-muted-foreground block">Invoice</span><span className="font-medium">{selectedPayment.invoiceNo}</span></div>
                      <div><span className="text-muted-foreground block">Base Amount</span><span className="font-medium">{formatINR(selectedPayment.amount)}</span></div>
                      <div><span className="text-muted-foreground block">Net Amount</span><span className="font-medium">{formatINR(selectedPayment.netAmount)}</span></div>
                      <div><span className="text-muted-foreground block">Method</span><span className="font-medium">{selectedPayment.method}</span></div>
                      <div><span className="text-muted-foreground block">Due Date</span><span className="font-medium">{selectedPayment.dueDate}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => { toast.success("Processing", "Payment processing initiated"); setDrawerOpen(false); }}>Process</Button>
                      <Button size="sm" variant="outline" className="flex-1 border-amber-300 text-amber-600 hover:bg-amber-50" onClick={() => { toast.warning("Held", "Payment has been put on hold"); setDrawerOpen(false); }}>Hold</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => { toast.info("Released", "Payment hold has been released"); setDrawerOpen(false); }}>Release</Button>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        {/* ===== TAB 4: Dispute Resolution ===== */}
        <TabsContent value="disputes" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search dispute ID or carrier..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-8 pr-8 h-9 rounded-md border bg-background text-sm appearance-none cursor-pointer">
                <option value="All">All Statuses</option>
                {data.disputeStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-background border-b">
                    <tr>
                      {[
                        { key: "disputeId", label: "Dispute ID" }, { key: "carrier", label: "Carrier" },
                        { key: "invoiceNo", label: "Invoice" }, { key: "disputeType", label: "Type" },
                        { key: "severity", label: "Severity" }, { key: "amount", label: "Amount" },
                        { key: "status", label: "Status" }, { key: "daysElapsed", label: "Days" },
                        { key: "slaTarget", label: "SLA" }, { key: "", label: "Actions" },
                      ].map((col) => (
                        <th key={col.key} className="px-3 py-2 text-left font-medium text-muted-foreground cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 fap-sort-header" onClick={() => col.key && handleSort(col.key)}>
                          <div className="flex items-center gap-1">{col.label}{col.key && <SortIcon field={col.key} />}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDisputes.slice(0, 40).map((d, i) => (
                      <tr key={d.id} className={cn("border-b hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-colors fap-row-stripe", i % 2 === 0 && "bg-gray-50/50 dark:bg-gray-900/20")}>
                        <td className="px-3 py-2 font-mono font-medium">{d.disputeId}</td>
                        <td className="px-3 py-2">{d.carrier}</td>
                        <td className="px-3 py-2">{d.invoiceNo}</td>
                        <td className="px-3 py-2">{d.disputeType}</td>
                        <td className="px-3 py-2"><DisputeSeverityBadge severity={d.severity} /></td>
                        <td className="px-3 py-2 font-medium">{formatINR(d.amount)}</td>
                        <td className="px-3 py-2"><AuditStatusBadge status={d.status} /></td>
                        <td className="px-3 py-2">{d.daysElapsed}d</td>
                        <td className="px-3 py-2">{d.slaTarget}d</td>
                        <td className="px-3 py-2">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 fap-action-btn" onClick={() => { setSelectedDispute(d); setDrawerOpen(true); }}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Sheet open={drawerOpen && !!selectedDispute} onOpenChange={(o) => { setDrawerOpen(o); if (!o) setSelectedDispute(null); }}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              {selectedDispute && (
                <>
                  <SheetHeader>
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 -mx-6 -mt-4 px-6 py-4 rounded-b-xl">
                      <SheetTitle className="text-white">Dispute {selectedDispute.disputeId}</SheetTitle>
                      <p className="text-orange-100 text-sm mt-1">{selectedDispute.carrier} · {selectedDispute.disputeType}</p>
                    </div>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <DisputeSeverityBadge severity={selectedDispute.severity} />
                      <AuditStatusBadge status={selectedDispute.status} />
                    </div>
                    <SLATracker elapsed={selectedDispute.daysElapsed} target={selectedDispute.slaTarget} />
                    <div>
                      <p className="text-sm font-medium mb-2">Event Timeline</p>
                      <DisputeTimeline events={selectedDispute.events} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs">
                      <div><span className="text-muted-foreground block">Dispute ID</span><span className="font-medium">{selectedDispute.disputeId}</span></div>
                      <div><span className="text-muted-foreground block">Amount</span><span className="font-medium">{formatINR(selectedDispute.amount)}</span></div>
                      <div><span className="text-muted-foreground block">Carrier</span><span className="font-medium">{selectedDispute.carrier}</span></div>
                      <div><span className="text-muted-foreground block">Type</span><span className="font-medium">{selectedDispute.disputeType}</span></div>
                      <div><span className="text-muted-foreground block">Invoice</span><span className="font-medium">{selectedDispute.invoiceNo}</span></div>
                      <div><span className="text-muted-foreground block">Severity</span><span className="font-medium">{selectedDispute.severity}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={() => { toast.warning("Escalated", "Dispute escalated to senior management"); setDrawerOpen(false); }}>Escalate</Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => { toast.success("Accepted", "Dispute resolution accepted"); setDrawerOpen(false); }}>Accept</Button>
                      <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50" onClick={() => { toast.error("Legal Escalation", "Dispute escalated to legal team"); setDrawerOpen(false); }}>Legal</Button>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        {/* ===== TAB 5: Reconciliation Analytics ===== */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-4 gap-3 fap-analytics-grid">
            {analyticsCards.map((card, i) => (
              <Card key={i} className={cn("fap-analytics-card border-l-4", card.border)}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-lg font-bold mt-1 fap-counter-value">{card.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="fap-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Reconciliation Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.reconTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="matched" stroke="#059669" strokeWidth={2} name="Matched" />
                    <Line type="monotone" dataKey="unmatched" stroke="#dc2626" strokeWidth={2} name="Unmatched" />
                    <Line type="monotone" dataKey="disputed" stroke="#ea580c" strokeWidth={2} name="Disputed" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="fap-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Carrier-wise Reconciliation</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.carrierRecon}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="matched" fill="#059669" radius={[4, 4, 0, 0]} name="Matched" />
                    <Bar dataKey="unmatched" fill="#dc2626" radius={[4, 4, 0, 0]} name="Unmatched" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="fap-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Savings by Quarter (₹ Lakh)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.quarterlySavings}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="freightSavings" stackId="a" fill="#4338ca" name="Freight Savings" />
                    <Bar dataKey="accessorialSavings" stackId="a" fill="#ea580c" name="Accessorial Savings" />
                    <Bar dataKey="rateCorrection" stackId="a" fill="#059669" name="Rate Correction" />
                    <Bar dataKey="gstSavings" stackId="a" fill="#475569" name="GST Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="fap-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Dispute Resolution Rate</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={data.disputeResolution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                        {data.disputeResolution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="fap-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Lane-wise Cost Trend (₹/kg)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={data.laneCostTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="Mumbai-Delhi" stroke="#4338ca" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Chennai-Bangalore" stroke="#ea580c" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Kolkata-Mumbai" stroke="#059669" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Delhi-Chennai" stroke="#475569" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Pune-Hyderabad" stroke="#7c3aed" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
