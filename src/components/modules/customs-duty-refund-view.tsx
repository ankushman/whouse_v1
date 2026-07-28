"use client";

import React, { useState, useMemo } from "react";
import {
  Gavel,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileSearch,
  Download,
  TrendingUp,
  TrendingDown,
  Eye,
  ScanLine,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Landmark,
  Receipt,
  BadgePercent,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { useToast } from "@/hooks/use-toast-helper";
import { cn } from "@/lib/utils";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const SCHEMES = ["Duty Drawback", "Advance Authorization", "RoDTEP", "SEIS", "MEIS", "EPCG", "EODS", "DBK"] as const;
const CLAIM_TYPES = ["Export Duty Refund", "IGST Refund", "Drawback Claim", "RoDTEP Credit", "SEIS Incentive", "Excise Rebate", "GST Compensation", "Customs Bond Refund"] as const;
const CLAIM_STATUSES = ["Submitted", "Under Review", "Approved", "Partially Approved", "Rejected", "Appealed", "Disbursed", "Pending Documents"] as const;
const PRODUCT_CATEGORIES = ["Textiles", "Pharma", "Engineering Goods", "Auto Components", "Chemicals", "Agriculture", "IT Products", "Leather", "Handicrafts", "Gems & Jewelry"] as const;
const PORTS = ["JNPT Mumbai", "Mundra", "Chennai", "Kolkata", "Cochin", "Visakhapatnam", "Tuticorin", "Kandla", "Ennore", "Nhava Sheva"] as const;
const INDIAN_STATES = [
  "Maharashtra", "Gujarat", "Tamil Nadu", "Karnataka", "Telangana",
  "Andhra Pradesh", "Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "West Bengal",
  "Haryana", "Punjab", "Kerala", "Delhi NCR",
] as const;
const PROCESSING_STAGES = ["Initiated", "Documents Verified", "Assessment", "CBIC Review", "Approval Pending", "Sanctioned", "Payment Processing", "Completed"] as const;
const REJECTION_REASONS = ["Incomplete Documentation", "Valuation Discrepancy", "Non-Eligible Goods", "Time Limit Expired", "Duplicate Claim", "Classification Mismatch", "Missing BOE", "Authentication Failed"] as const;

const claimStatusColorMap: Record<string, string> = {
  Submitted: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30",
  "Under Review": "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  Approved: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  "Partially Approved": "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30",
  Rejected: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
  Appealed: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30",
  Disbursed: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30",
  "Pending Documents": "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800",
};

interface ClaimRecord {
  id: string;
  scheme: string;
  claimType: string;
  status: string;
  applicant: string;
  exportValue: string;
  dutyClaimed: string;
  dutyRefunded: string;
  refundPercent: number;
  submissionDate: string;
  approvalDate: string;
  disbursementDate: string;
  port: string;
  state: string;
  productCategory: string;
  boeNumber: string;
  processingStage: string;
}

interface SchemeAnalytics {
  id: string;
  scheme: string;
  totalClaims: number;
  approvedClaims: number;
  totalClaimed: string;
  totalDisbursed: string;
  approvalRate: number;
  avgProcessingDays: number;
  pendingClaims: number;
  rejectionRate: number;
}

interface RoDTEPCredit {
  id: string;
  exporterName: string;
  iec: string;
  shipmentCount: number;
  exportValue: string;
  creditRate: number;
  creditEarned: string;
  creditUtilized: string;
  creditBalance: string;
  state: string;
  port: string;
  status: string;
  lastUpdated: string;
}

interface IGSTRefund {
  id: string;
  exporterName: string;
  gstin: string;
  period: string;
  igstPaid: string;
  refundClaimed: string;
  refundSanctioned: string;
  refundReceived: string;
  pendingAmount: string;
  status: string;
  filingDate: string;
  state: string;
}

interface CustomsBond {
  id: string;
  bondNumber: string;
  bondType: string;
  amount: string;
  utilizedAmount: string;
  availableAmount: string;
  expiryDate: string;
  status: string;
  importer: string;
  port: string;
  obligations: number;
  state: string;
}

function generateData() {
  const ri = seededRandom(19701);
  const exporters = [
    "Tata Steel Exports",
    "Reliance Industries",
    "Infosys BPM",
    "Wipro Enterprises",
    "Dr. Reddy's Labs",
    "Lupin Pharma",
    "Bajaj Auto Ltd",
    "Mahindra & Mahindra",
    "Asian Paints Exports",
    "Godrej Consumer",
    "TVS Motors",
    "Arvind Fashion",
    "Raymond Ltd",
    "Maruti Suzuki",
    "Hero MotoCorp",
  ];

  const officers = [
    "Commissioner Sharma",
    "DC Mishra",
    "AC Verma",
    "Superintendent Gupta",
    "Inspector Patel",
    "Examiner Singh",
    "Appraiser Rao",
    "Preventive Officer Iyer",
  ];

  const bondTypes = ["BG under Sec 143", "Bank Guarantee", "Cash Deposit", "Surity Bond", "RT-12 Bond", "Self Guarantee"];

  // Claims (70)
  const claims: ClaimRecord[] = Array.from({ length: 70 }, (_, i) => {
    const exportVal = Math.floor(ri() * 500) + 50;
    const refundPct = Math.floor(ri() * 12) + 1;
    const statusRoll = ri();
    return {
      id: `CLM-${String(2024000 + i).padStart(7, "0")}`,
      scheme: SCHEMES[Math.floor(ri() * SCHEMES.length)],
      claimType: CLAIM_TYPES[Math.floor(ri() * CLAIM_TYPES.length)],
      status: statusRoll < 0.25 ? "Submitted" : statusRoll < 0.35 ? "Under Review" : statusRoll < 0.55 ? "Approved" : statusRoll < 0.62 ? "Partially Approved" : statusRoll < 0.72 ? "Rejected" : statusRoll < 0.78 ? "Appealed" : statusRoll < 0.92 ? "Disbursed" : "Pending Documents",
      applicant: exporters[Math.floor(ri() * exporters.length)],
      exportValue: `₹${(exportVal * 100000).toLocaleString("en-IN")}`,
      dutyClaimed: `₹${(exportVal * 1800 + Math.floor(ri() * 500000)).toLocaleString("en-IN")}`,
      dutyRefunded: `₹${(exportVal * 1800 * (refundPct / 100) + Math.floor(ri() * 100000)).toLocaleString("en-IN")}`,
      refundPercent: refundPct,
      submissionDate: `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      approvalDate: ri() < 0.6 ? `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}` : "—",
      disbursementDate: ri() < 0.4 ? `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}` : "—",
      port: PORTS[Math.floor(ri() * PORTS.length)],
      state: INDIAN_STATES[Math.floor(ri() * INDIAN_STATES.length)],
      productCategory: PRODUCT_CATEGORIES[Math.floor(ri() * PRODUCT_CATEGORIES.length)],
      boeNumber: `BOE-${String(Math.floor(ri() * 900000) + 100000).padStart(6, "0")}`,
      processingStage: PROCESSING_STAGES[Math.floor(ri() * PROCESSING_STAGES.length)],
    };
  });

  // Scheme Analytics (8)
  const schemeAnalytics: SchemeAnalytics[] = SCHEMES.map((scheme) => {
    const total = Math.floor(ri() * 200) + 50;
    const approved = Math.floor(total * (ri() * 0.4 + 0.4));
    return {
      id: `SA-${scheme.substring(0, 3).toUpperCase()}`,
      scheme,
      totalClaims: total,
      approvedClaims: approved,
      totalClaimed: `₹${(Math.floor(ri() * 900) + 100).toLocaleString("en-IN")} Cr`,
      totalDisbursed: `₹${(Math.floor(ri() * 600) + 50).toLocaleString("en-IN")} Cr`,
      approvalRate: Math.round((approved / total) * 100),
      avgProcessingDays: Math.floor(ri() * 45) + 15,
      pendingClaims: Math.floor(ri() * 30) + 5,
      rejectionRate: Math.floor(ri() * 15) + 2,
    };
  });

  // RoDTEP Credits (40)
  const rodtepCredits: RoDTEPCredit[] = Array.from({ length: 40 }, (_, i) => {
    const creditEarned = Math.floor(ri() * 500) + 50;
    return {
      id: `RDP-${String(2024000 + i).padStart(7, "0")}`,
      exporterName: exporters[Math.floor(ri() * exporters.length)],
      iec: `AABCA${String(Math.floor(ri() * 9000) + 1000)}`,
      shipmentCount: Math.floor(ri() * 200) + 10,
      exportValue: `₹${(Math.floor(ri() * 800) + 50).toLocaleString("en-IN")} L`,
      creditRate: Math.floor(ri() * 3) + 1,
      creditEarned: `₹${(creditEarned * 100000).toLocaleString("en-IN")}`,
      creditUtilized: `₹${(Math.floor(creditEarned * 0.7) * 100000).toLocaleString("en-IN")}`,
      creditBalance: `₹${(Math.floor(creditEarned * 0.3) * 100000).toLocaleString("en-IN")}`,
      state: INDIAN_STATES[Math.floor(ri() * INDIAN_STATES.length)],
      port: PORTS[Math.floor(ri() * PORTS.length)],
      status: ri() < 0.7 ? "Active" : ri() < 0.85 ? "Under Scrutiny" : "Suspended",
      lastUpdated: `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
    };
  });

  // IGST Refunds (50)
  const igstRefunds: IGSTRefund[] = Array.from({ length: 50 }, (_, i) => {
    const paid = Math.floor(ri() * 200) + 20;
    const sanctioned = Math.floor(paid * (ri() * 0.3 + 0.6));
    return {
      id: `IGST-${String(2024000 + i).padStart(7, "0")}`,
      exporterName: exporters[Math.floor(ri() * exporters.length)],
      gstin: `${String(Math.floor(ri() * 37) + 1).padStart(2, "0")}AABCA${String(Math.floor(ri() * 9000) + 1000)}${String.fromCharCode(65 + Math.floor(ri() * 26))}${String.fromCharCode(90 + Math.floor(ri() * 10))}`,
      period: `2024-${["Apr-Jun", "Jul-Sep", "Oct-Dec"][Math.floor(ri() * 3)]}`,
      igstPaid: `₹${(paid * 100000).toLocaleString("en-IN")}`,
      refundClaimed: `₹${(Math.floor(paid * 0.95) * 100000).toLocaleString("en-IN")}`,
      refundSanctioned: `₹${(sanctioned * 100000).toLocaleString("en-IN")}`,
      refundReceived: `₹${(Math.floor(sanctioned * 0.9) * 100000).toLocaleString("en-IN")}`,
      pendingAmount: `₹${((Math.floor(paid * 0.95) - sanctioned) * 100000).toLocaleString("en-IN")}`,
      status: sanctioned > paid * 0.9 ? "Fully Sanctioned" : sanctioned > paid * 0.5 ? "Partially Sanctioned" : "Under Process",
      filingDate: `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      state: INDIAN_STATES[Math.floor(ri() * INDIAN_STATES.length)],
    };
  });

  // Customs Bonds (35)
  const customsBonds: CustomsBond[] = Array.from({ length: 35 }, (_, i) => {
    const amount = Math.floor(ri() * 200) + 10;
    const utilized = Math.floor(amount * (ri() * 0.6 + 0.1));
    return {
      id: `BND-${String(2024000 + i).padStart(7, "0")}`,
      bondNumber: `BG-${String(Math.floor(ri() * 90000) + 10000)}/${2024}`,
      bondType: bondTypes[Math.floor(ri() * bondTypes.length)],
      amount: `₹${(amount * 100000).toLocaleString("en-IN")}`,
      utilizedAmount: `₹${(utilized * 100000).toLocaleString("en-IN")}`,
      availableAmount: `₹${((amount - utilized) * 100000).toLocaleString("en-IN")}`,
      expiryDate: `2025-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      status: ri() < 0.55 ? "Active" : ri() < 0.75 ? "Expiring Soon" : ri() < 0.85 ? "Expired" : ri() < 0.93 ? "Exhausted" : "Discharged",
      importer: exporters[Math.floor(ri() * exporters.length)],
      port: PORTS[Math.floor(ri() * PORTS.length)],
      obligations: Math.floor(ri() * 12) + 1,
      state: INDIAN_STATES[Math.floor(ri() * INDIAN_STATES.length)],
    };
  });

  // Charts
  const monthlyRefund = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    claimed: Math.floor(ri() * 300) + 100,
    approved: Math.floor(ri() * 250) + 80,
    disbursed: Math.floor(ri() * 200) + 60,
    rejected: Math.floor(ri() * 30) + 5,
  }));

  const schemePerformance = SCHEMES.map((s) => ({
    scheme: s.length > 10 ? s.substring(0, 10) + "…" : s,
    approvalRate: Math.floor(ri() * 30) + 65,
    processingDays: Math.floor(ri() * 40) + 15,
  }));

  const stateWiseRefund = INDIAN_STATES.slice(0, 10).map((st) => ({
    state: st,
    amount: Math.floor(ri() * 200) + 20,
  }));

  const categoryBreakdown = PRODUCT_CATEGORIES.map((cat) => ({
    category: cat.length > 10 ? cat.substring(0, 10) + "…" : cat,
    value: Math.floor(ri() * 150) + 20,
  }));

  return {
    claims, schemeAnalytics, rodtepCredits, igstRefunds, customsBonds,
    monthlyRefund, schemePerformance, stateWiseRefund, categoryBreakdown,
    SCHEMES: [...SCHEMES], CLAIM_TYPES: [...CLAIM_TYPES], CLAIM_STATUSES: [...CLAIM_STATUSES],
    PRODUCT_CATEGORIES: [...PRODUCT_CATEGORIES], PORTS: [...PORTS], INDIAN_STATES: [...INDIAN_STATES],
    PROCESSING_STAGES: [...PROCESSING_STAGES], REJECTION_REASONS: [...REJECTION_REASONS],
  };
}

// ──────────────────────────────────────────────────────
// Unique Visual Components
// ──────────────────────────────────────────────────────

function RefundProgressBar({ percent }: { percent: number }) {
  const color = percent >= 80 ? "bg-emerald-500" : percent >= 50 ? "bg-cyan-500" : percent >= 25 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="cdr-refund-bar flex items-center gap-2 w-28">
      <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className={cn("h-full rounded-full cdr-bar-fill", color)} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">{percent}%</span>
    </div>
  );
}

function ProcessingPipeline({ stage, stages }: { stage: string; stages: string[] }) {
  const idx = stages.indexOf(stage);
  return (
    <div className="flex items-center gap-0.5">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={cn("w-2.5 h-2.5 rounded-full transition-all", i <= idx ? "bg-emerald-500" : i === idx + 1 ? "bg-amber-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600")} />
          {i < stages.length - 1 && <div className={cn("w-3 h-0.5", i < idx ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600")} />}
        </div>
      ))}
    </div>
  );
}

function BondUtilizationBar({ utilized, total }: { utilized: number; total: number }) {
  const pct = total > 0 ? (utilized / total) * 100 : 0;
  const color = pct >= 80 ? "bg-red-500" : pct >= 50 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2 w-32">
      <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className={cn("h-full rounded-full cdr-bar-fill", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-500">{Math.round(pct)}%</span>
    </div>
  );
}

function ClaimStatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold", claimStatusColorMap[status] || "bg-slate-400 text-white")}>{status}</span>;
}

function INRBadge({ amount, size = "sm" }: { amount: string; size?: string }) {
  return <span className={cn("font-mono font-semibold", size === "sm" ? "text-xs text-slate-700 dark:text-slate-200" : "text-base text-slate-800 dark:text-slate-100")}>{amount}</span>;
}

// ──────────────────────────────────────────────────────
// Drawer Components
// ──────────────────────────────────────────────────────

function ClaimDrawer({ data, fields, toast }: { data: ClaimRecord; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-amber-600 to-yellow-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.id}</h3>
          <p className="text-amber-100 text-sm">{data.scheme} — {data.claimType}</p>
        </div>
        <div className="ml-auto">
          <Gavel className="h-8 w-8 text-amber-300" />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Status</p>
            <ClaimStatusBadge status={data.status} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Refund %</p>
            <RefundProgressBar percent={data.refundPercent} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Export Value</p>
            <INRBadge amount={data.exportValue} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Duty Refunded</p>
            <INRBadge amount={data.dutyRefunded} />
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
          <p className="text-xs text-slate-500 mb-2">Processing Pipeline</p>
          <ProcessingPipeline stage={data.processingStage} stages={["Initiated", "Docs Verified", "Assessment", "CBIC Review", "Approval Pending", "Sanctioned", "Payment", "Completed"]} />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {fields.map((f, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">{f.label}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <Button size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" onClick={() => toast.success("Claim report downloaded")}><Download className="h-4 w-4 mr-1" /> Report</Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Escalated to CBIC")}><ArrowRight className="h-4 w-4 mr-1" /> Escalate</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Claim appeal filed")}><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>
    </>
  );
}

function RodtepDrawer({ data, fields, toast }: { data: RoDTEPCredit; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.id}</h3>
          <p className="text-emerald-200 text-sm">{data.exporterName} — IEC: {data.iec}</p>
        </div>
        <div className="ml-auto"><Landmark className="h-8 w-8 text-emerald-300" /></div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Credit Earned</p>
            <INRBadge amount={data.creditEarned} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Credit Balance</p>
            <INRBadge amount={data.creditBalance} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Shipments</p>
            <p className="text-lg font-bold text-emerald-600">{data.shipmentCount}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Credit Rate</p>
            <p className="text-lg font-bold text-teal-600">{data.creditRate}%</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {fields.map((f, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">{f.label}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => toast.success("Credit transfer initiated")}><ArrowRight className="h-4 w-4 mr-1" /> Transfer</Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Statement downloaded")}><Download className="h-4 w-4 mr-1" /> Statement</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Audit scheduled")}><ScanLine className="h-4 w-4" /></Button>
        </div>
      </div>
    </>
  );
}

function IGSTDrawer({ data, fields, toast }: { data: IGSTRefund; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.id}</h3>
          <p className="text-blue-200 text-sm">{data.exporterName}</p>
        </div>
        <div className="ml-auto"><Receipt className="h-8 w-8 text-blue-300" /></div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">IGST Paid</p>
            <INRBadge amount={data.igstPaid} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Sanctioned</p>
            <INRBadge amount={data.refundSanctioned} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Received</p>
            <INRBadge amount={data.refundReceived} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Pending</p>
            <INRBadge amount={data.pendingAmount} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {fields.map((f, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">{f.label}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.success("IGST refund claim updated")}><RefreshCw className="h-4 w-4 mr-1" /> Update</Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Statement downloaded")}><Download className="h-4 w-4 mr-1" /> Statement</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Tracking initiated")}><Eye className="h-4 w-4" /></Button>
        </div>
      </div>
    </>
  );
}

function BondDrawer({ data, fields, toast }: { data: CustomsBond; fields: { label: string; value: string }[]; toast: any }) {
  const utilPct = 65;
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.bondNumber}</h3>
          <p className="text-rose-200 text-sm">{data.bondType}</p>
        </div>
        <div className="ml-auto"><ShieldCheck className="h-8 w-8 text-rose-300" /></div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Bond Amount</p>
            <INRBadge amount={data.amount} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Available</p>
            <INRBadge amount={data.availableAmount} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Utilization</p>
            <BondUtilizationBar utilized={utilPct} total={100} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500">Obligations</p>
            <p className="text-lg font-bold text-rose-600">{data.obligations}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {fields.map((f, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">{f.label}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <Button size="sm" className="flex-1 bg-rose-600 hover:bg-rose-700 text-white" onClick={() => toast.success("Bond renewed")}><RefreshCw className="h-4 w-4 mr-1" /> Renew</Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Obligation discharged")}><CheckCircle2 className="h-4 w-4 mr-1" /> Discharge</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Bond details downloaded")}><Download className="h-4 w-4" /></Button>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────
// Sort Helper
// ──────────────────────────────────────────────────────
function universalSort<T>(items: T[], sortBy: any, sortDir: any, key: keyof T) {
  return [...items].sort((a, b) => {
    const aVal = String(a[key] ?? "");
    const bVal = String(b[key] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });
}

// ──────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────
export default function CustomsDutyRefundView() {
  const data = useMemo(() => generateData(), []);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("0");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);
  const [drawerType, setDrawerType] = useState<string>("");

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("asc"); }
  };
  const openDrawer = (type: string, item: any) => {
    setDrawerType(type); setDrawerData(item); setDrawerOpen(true);
  };

  const totalClaims = data.claims.length;
  const totalDisbursed = data.claims.filter(c => c.status === "Disbursed").length;
  const approvedClaims = data.claims.filter(c => c.status === "Approved" || c.status === "Partially Approved" || c.status === "Disbursed").length;
  const pendingClaims = data.claims.filter(c => c.status === "Submitted" || c.status === "Under Review" || c.status === "Pending Documents").length;
  const rejectedClaims = data.claims.filter(c => c.status === "Rejected").length;
  const totalSchemes = data.schemeAnalytics.length;
  const activeBonds = data.customsBonds.filter(b => b.status === "Active").length;

  const kpis = [
    { label: "Total Claims", value: totalClaims, sub: `${data.CLAIM_TYPES.length} types`, icon: FileSearch, color: "text-amber-600 dark:text-amber-400" },
    { label: "Disbursed", value: totalDisbursed, sub: `${((totalDisbursed / totalClaims) * 100).toFixed(1)}% rate`, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Approved", value: approvedClaims, sub: "Incl. partial", icon: ShieldCheck, color: "text-sky-600 dark:text-sky-400" },
    { label: "Pending", value: pendingClaims, sub: "In pipeline", icon: Clock, color: "text-orange-600 dark:text-orange-400" },
    { label: "Rejected", value: rejectedClaims, sub: "Appeals open", icon: AlertTriangle, color: "text-red-600 dark:text-red-400" },
    { label: "Active Schemes", value: totalSchemes, sub: "Govt. programs", icon: Landmark, color: "text-violet-600 dark:text-violet-400" },
    { label: "Active Bonds", value: activeBonds, sub: `${data.customsBonds.length} total`, icon: Receipt, color: "text-rose-600 dark:text-rose-400" },
    { label: "RoDTEP Credits", value: data.rodtepCredits.filter(r => r.status === "Active").length, sub: "Active exporters", icon: BadgePercent, color: "text-teal-600 dark:text-teal-400" },
  ];

  const filteredClaims = useMemo(() => {
    let f = data.claims;
    if (searchTerm) f = f.filter(c => c.id.toLowerCase().includes(searchTerm.toLowerCase()) || c.applicant.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") f = f.filter(c => c.status === filterStatus);
    return sortBy ? universalSort(f, sortBy, sortDir, sortBy as keyof ClaimRecord) : f;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.claims]);

  const filteredRodtep = useMemo(() => {
    let f = data.rodtepCredits;
    if (searchTerm) f = f.filter(r => r.exporterName.toLowerCase().includes(searchTerm.toLowerCase()) || r.iec.includes(searchTerm));
    if (filterStatus !== "All") f = f.filter(r => r.status === filterStatus);
    return f;
  }, [searchTerm, filterStatus, data.rodtepCredits]);

  const filteredIGST = useMemo(() => {
    let f = data.igstRefunds;
    if (searchTerm) f = f.filter(g => g.exporterName.toLowerCase().includes(searchTerm.toLowerCase()) || g.gstin.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") f = f.filter(g => g.status === filterStatus);
    return sortBy ? universalSort(f, sortBy, sortDir, sortBy as keyof IGSTRefund) : f;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.igstRefunds]);

  const filteredBonds = useMemo(() => {
    let f = data.customsBonds;
    if (searchTerm) f = f.filter(b => b.bondNumber.toLowerCase().includes(searchTerm.toLowerCase()) || b.importer.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") f = f.filter(b => b.status === filterStatus);
    return sortBy ? universalSort(f, sortBy, sortDir, sortBy as keyof CustomsBond) : f;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.customsBonds]);

  const PIE_COLORS = ["#d97706", "#06b6d4", "#10b981", "#ef4444", "#7c3aed", "#ec4899", "#f97316", "#14b8a6", "#6366f1", "#f43f5e"];

  return (
    <div className="cdr-root flex flex-col gap-4 p-4 md:p-6">
      <PageHeader title="Customs Duty Refund & Drawback Analytics" description="Duty drawback claims, RoDTEP credits, IGST refund tracking, customs bond management & export incentive schemes for Indian logistics" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="cdr-tabs flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 h-auto">
          {["Refund Dashboard", "Duty Drawback Claims", "RoDTEP Credits", "IGST Refund Tracker", "Customs Bonds", "Scheme Analytics"].map((tab, idx) => (
            <TabsTrigger key={idx} value={String(idx)} className="cdr-tab-trigger">{tab}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 cdr-kpi-grid">
            {kpis.map((kpi, i) => (
              <Card key={i} className="cdr-kpi-card border-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800", kpi.color)}><kpi.icon className="h-5 w-5" /></div>
                  <div>
                    <p className="text-2xl font-bold cdr-counter-value">{kpi.value}</p>
                    <p className="text-xs text-slate-500">{kpi.label}</p>
                    <p className="text-[10px] text-slate-400">{kpi.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="cdr-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Refund Pipeline</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.monthlyRefund}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-slate-500" />
                    <YAxis tick={{ fontSize: 11 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="claimed" fill="#f59e0b" name="Claimed" />
                    <Bar dataKey="approved" fill="#06b6d4" name="Approved" />
                    <Bar dataKey="disbursed" fill="#10b981" name="Disbursed" />
                    <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="cdr-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Scheme Approval Rate vs Processing Days</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.schemePerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="scheme" tick={{ fontSize: 10 }} className="text-slate-500" />
                    <YAxis tick={{ fontSize: 11 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="approvalRate" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Approval %" />
                    <Line type="monotone" dataKey="processingDays" stroke="#f97316" strokeWidth={2} name="Processing Days" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="cdr-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">State-wise Refund (₹ Cr)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.stateWiseRefund}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="state" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={50} className="text-slate-500" />
                    <YAxis tick={{ fontSize: 11 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="amount" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="cdr-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Refund by Product Category</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.categoryBreakdown} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={90} innerRadius={50} label={({ value }: { value: number }) => `₹${value}Cr`} labelLine={false}>
                      {data.categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 1: Duty Drawback Claims */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Search claim ID or applicant..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 h-8 text-sm" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm">
              <option value="All">All Status</option>
              {data.CLAIM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 dark:bg-slate-800">
                <th className="cdr-sort-header px-3 py-2 text-left cursor-pointer hover:text-amber-600" onClick={() => handleSort("id")}>Claim ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}</th>
                <th className="px-3 py-2 text-left">Scheme</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Refund %</th>
                <th className="px-3 py-2 text-left">Export Value</th>
                <th className="px-3 py-2 text-left">Applicant</th>
                <th className="px-3 py-2 text-left">BOE</th>
                <th className="px-3 py-2 text-left">Port</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr></thead>
              <tbody>{filteredClaims.slice(0, 20).map(c => (
                <tr key={c.id} className="cdr-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/20">
                  <td className="px-3 py-2 font-mono text-xs font-semibold">{c.id}</td>
                  <td className="px-3 py-2 text-xs">{c.scheme}</td>
                  <td className="px-3 py-2 text-xs">{c.claimType}</td>
                  <td className="px-3 py-2"><ClaimStatusBadge status={c.status} /></td>
                  <td className="px-3 py-2"><RefundProgressBar percent={c.refundPercent} /></td>
                  <td className="px-3 py-2 text-xs font-mono">{c.exportValue}</td>
                  <td className="px-3 py-2 text-xs">{c.applicant}</td>
                  <td className="px-3 py-2 font-mono text-xs">{c.boeNumber}</td>
                  <td className="px-3 py-2 text-xs">{c.port}</td>
                  <td className="px-3 py-2 text-center"><Button size="sm" variant="ghost" className="cdr-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("claim", c)}>View</Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 2: RoDTEP Credits */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Search exporter or IEC..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 h-8 text-sm" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm">
              <option value="All">All Status</option>
              {["Active", "Under Scrutiny", "Suspended"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-3 py-2 text-left">ID</th><th className="px-3 py-2 text-left">Exporter</th><th className="px-3 py-2 text-left">IEC</th><th className="px-3 py-2 text-left">Shipments</th><th className="px-3 py-2 text-left">Export Value</th><th className="px-3 py-2 text-left">Rate</th><th className="px-3 py-2 text-left">Credit Earned</th><th className="px-3 py-2 text-left">Balance</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-center">Actions</th>
              </tr></thead>
              <tbody>{filteredRodtep.slice(0, 20).map(r => (
                <tr key={r.id} className="cdr-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20">
                  <td className="px-3 py-2 font-mono text-xs font-semibold">{r.id}</td>
                  <td className="px-3 py-2 text-xs font-medium">{r.exporterName}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.iec}</td>
                  <td className="px-3 py-2 text-xs">{r.shipmentCount}</td>
                  <td className="px-3 py-2 text-xs font-mono">{r.exportValue}</td>
                  <td className="px-3 py-2 text-xs font-bold text-teal-600">{r.creditRate}%</td>
                  <td className="px-3 py-2 text-xs font-mono">{r.creditEarned}</td>
                  <td className="px-3 py-2 text-xs font-mono">{r.creditBalance}</td>
                  <td className="px-3 py-2"><span className={cn("text-xs font-semibold", r.status === "Active" ? "text-emerald-600" : r.status === "Under Scrutiny" ? "text-amber-600" : "text-red-600")}>{r.status}</span></td>
                  <td className="px-3 py-2 text-center"><Button size="sm" variant="ghost" className="cdr-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("rodtep", r)}>View</Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 3: IGST Refund */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Search exporter or GSTIN..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 h-8 text-sm" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm">
              <option value="All">All Status</option>
              {["Fully Sanctioned", "Partially Sanctioned", "Under Process"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 dark:bg-slate-800">
                <th className="cdr-sort-header px-3 py-2 text-left cursor-pointer hover:text-blue-600" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}</th>
                <th className="px-3 py-2 text-left">Exporter</th><th className="px-3 py-2 text-left">Period</th><th className="px-3 py-2 text-left">IGST Paid</th><th className="px-3 py-2 text-left">Sanctioned</th><th className="px-3 py-2 text-left">Received</th><th className="px-3 py-2 text-left">Pending</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-left">State</th><th className="px-3 py-2 text-center">Actions</th>
              </tr></thead>
              <tbody>{filteredIGST.slice(0, 20).map(g => (
                <tr key={g.id} className="cdr-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20">
                  <td className="px-3 py-2 font-mono text-xs font-semibold">{g.id}</td>
                  <td className="px-3 py-2 text-xs">{g.exporterName}</td>
                  <td className="px-3 py-2 text-xs">{g.period}</td>
                  <td className="px-3 py-2 text-xs font-mono">{g.igstPaid}</td>
                  <td className="px-3 py-2 text-xs font-mono">{g.refundSanctioned}</td>
                  <td className="px-3 py-2 text-xs font-mono">{g.refundReceived}</td>
                  <td className="px-3 py-2 text-xs font-mono">{g.pendingAmount}</td>
                  <td className="px-3 py-2"><span className={cn("text-xs font-bold", g.status === "Fully Sanctioned" ? "text-emerald-600" : g.status === "Partially Sanctioned" ? "text-amber-600" : "text-sky-600")}>{g.status}</span></td>
                  <td className="px-3 py-2 text-xs">{g.state}</td>
                  <td className="px-3 py-2 text-center"><Button size="sm" variant="ghost" className="cdr-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("igst", g)}>View</Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 4: Customs Bonds */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Search bond number or importer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 h-8 text-sm" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm">
              <option value="All">All Status</option>
              {["Active", "Expiring Soon", "Expired", "Exhausted", "Discharged"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 dark:bg-slate-800">
                <th className="cdr-sort-header px-3 py-2 text-left cursor-pointer hover:text-rose-600" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}</th>
                <th className="px-3 py-2 text-left">Bond #</th><th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-left">Amount</th><th className="px-3 py-2 text-left">Available</th><th className="px-3 py-2 text-left">Utilization</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-left">Importer</th><th className="px-3 py-2 text-left">Port</th><th className="px-3 py-2 text-center">Actions</th>
              </tr></thead>
              <tbody>{filteredBonds.slice(0, 20).map(b => (
                <tr key={b.id} className="cdr-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/20">
                  <td className="px-3 py-2 font-mono text-xs font-semibold">{b.id}</td>
                  <td className="px-3 py-2 font-mono text-xs">{b.bondNumber}</td>
                  <td className="px-3 py-2 text-xs">{b.bondType}</td>
                  <td className="px-3 py-2 text-xs font-mono">{b.amount}</td>
                  <td className="px-3 py-2 text-xs font-mono">{b.availableAmount}</td>
                  <td className="px-3 py-2"><BondUtilizationBar utilized={Math.floor((parseInt(b.utilizedAmount.replace(/[₹,]/g, "")) / parseInt(b.amount.replace(/[₹,]/g, ""))) * 100) || 30} total={100} /></td>
                  <td className="px-3 py-2"><span className={cn("text-xs font-semibold", b.status === "Active" ? "text-emerald-600" : b.status === "Expiring Soon" ? "text-amber-600" : b.status === "Expired" ? "text-red-600" : b.status === "Exhausted" ? "text-orange-600" : "text-slate-500")}>{b.status}</span></td>
                  <td className="px-3 py-2 text-xs">{b.importer}</td>
                  <td className="px-3 py-2 text-xs">{b.port}</td>
                  <td className="px-3 py-2 text-center"><Button size="sm" variant="ghost" className="cdr-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("bond", b)}>View</Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 5: Scheme Analytics */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.schemeAnalytics.map((sa) => (
              <Card key={sa.id} className="cdr-scheme-card border-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm">{sa.scheme}</h3>
                    <BadgePercent className="h-5 w-5 text-violet-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-600">{sa.totalClaims}</p>
                      <p className="text-[10px] text-slate-400">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-600">{sa.approvedClaims}</p>
                      <p className="text-[10px] text-slate-400">Approved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-sky-600">{sa.approvalRate}%</p>
                      <p className="text-[10px] text-slate-400">Approval</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-600">{sa.avgProcessingDays}d</p>
                      <p className="text-[10px] text-slate-400">Avg Days</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Disbursed: {sa.totalDisbursed}</span>
                    <span className="text-slate-500">Pending: {sa.pendingClaims}</span>
                  </div>
                  <div className="mt-2">
                    <RefundProgressBar percent={sa.approvalRate} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Sheet Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] overflow-y-auto p-4 sm:p-6">
          <SheetHeader>
            <SheetTitle className="text-base font-semibold">
              {drawerType === "claim" && "Claim Details"}
              {drawerType === "rodtep" && "RoDTEP Credit Details"}
              {drawerType === "igst" && "IGST Refund Details"}
              {drawerType === "bond" && "Customs Bond Details"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {drawerType === "claim" && drawerData && <ClaimDrawer data={drawerData} toast={toast} fields={[{ label: "Applicant", value: drawerData.applicant }, { label: "Port", value: drawerData.port }, { label: "State", value: drawerData.state }, { label: "Product", value: drawerData.productCategory }, { label: "BOE Number", value: drawerData.boeNumber }, { label: "Submitted", value: drawerData.submissionDate }]} />}
            {drawerType === "rodtep" && drawerData && <RodtepDrawer data={drawerData} toast={toast} fields={[{ label: "State", value: drawerData.state }, { label: "Port", value: drawerData.port }, { label: "Credit Utilized", value: drawerData.creditUtilized }, { label: "Export Value", value: drawerData.exportValue }, { label: "Last Updated", value: drawerData.lastUpdated }, { label: "Status", value: drawerData.status }]} />}
            {drawerType === "igst" && drawerData && <IGSTDrawer data={drawerData} toast={toast} fields={[{ label: "GSTIN", value: drawerData.gstin }, { label: "Period", value: drawerData.period }, { label: "State", value: drawerData.state }, { label: "Filing Date", value: drawerData.filingDate }, { label: "Claimed", value: drawerData.refundClaimed }, { label: "Status", value: drawerData.status }]} />}
            {drawerType === "bond" && drawerData && <BondDrawer data={drawerData} toast={toast} fields={[{ label: "Importer", value: drawerData.importer }, { label: "Port", value: drawerData.port }, { label: "Expiry", value: drawerData.expiryDate }, { label: "Utilized", value: drawerData.utilizedAmount }, { label: "State", value: drawerData.state }, { label: "Obligations", value: String(drawerData.obligations) }]} />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
