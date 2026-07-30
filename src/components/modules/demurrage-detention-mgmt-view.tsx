"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, Eye, Filter, Clock,
  FileText, TrendingUp, TrendingDown, Activity, AlertTriangle,
  CheckCircle2, XCircle, Timer, Anchor, Ship, Package, Truck,
  IndianRupee, Percent, ChevronRight, ChevronDown, AlertOctagon,
  FileWarning, ShieldCheck, Ban, Scale, DollarSign, BarChart3,
  CircleDot, Upload, Receipt, RotateCcw, Zap, Info, FileCheck,
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
// Seeded Random
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

// ============================================================================
// INR Formatter
// ============================================================================
function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10000000) return `\u20B9${(amount / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `\u20B9${(amount / 100000).toFixed(2)} L`;
  return `\u20B9${amount.toLocaleString("en-IN")}`;
}

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const rand = seededRandom(2044501);

  const ports = [
    "Nhava Sheva JNPT", "Mundra", "Chennai", "Kolkata", "Visakhapatnam",
    "Cochin", "Kandla", "Tuticorin", "Paradip", "Ennore", "Mumbai Port", "Hazira",
  ] as const;

  const containerStatuses = [
    "At Port", "In Transit to ICD", "At ICD", "Empty Return Pending",
    "Returned", "On Hold", "Disputed", "Released",
  ] as const;

  const shippingLines = [
    "Maersk", "MSC", "CMA CGM", "COSCO", "Hapag-Lloyd", "ONE", "Evergreen", "Yang Ming", "PIL", "Wan Hai",
  ] as const;

  const containerSizes = [
    "20ft GP", "40ft GP", "40ft HC", "20ft RF", "40ft RF", "45ft HC",
  ] as const;

  const chargeCategories = ["Storage", "Electricity", "Handling", "Documentation", "Inspection", "Late Fee"] as const;

  const freeTimeTypes = [
    "Port Import", "Port Export", "ICD Import", "ICD Export", "CFS", "Bonded", "Empty Return", "Special",
  ] as const;

  const utilizationZones = [
    "Green", "Yellow", "Amber", "Orange", "Red", "Expired",
  ] as const;

  const invoiceStatuses = [
    "Draft", "Pending", "Under Review", "Approved", "Disputed", "Paid", "Partially Paid", "Written Off",
  ] as const;

  const paymentMethods = [
    "NEFT", "RTGS", "UPI", "Wire Transfer", "Bank Guarantee", "LC", "Credit Note", "Adjustment",
  ] as const;

  const disputeTypes = [
    "Excessive Charges", "Wrong Calculation", "Double Billing", "Free Time Not Granted",
    "Container Damage", "Late Documentation", "Port Congestion", "Force Majeure",
  ] as const;

  const disputeStatuses = ["Open", "Under Investigation", "Carrier Responded", "Accepted", "Rejected", "Escalated"] as const;

  const severityLevels = ["Critical", "High", "Medium", "Low", "Minimal"] as const;

  // --- Container Data ---
  const containers = Array.from({ length: 75 }, (_, i) => {
    const prefix = ["MSKU", "MSCU", "CMDU", "CSLU", "HLXU", "OOLU", "EISU", "YMLU", " PILU", "WHLU"];
    const p = prefix[i % 10];
    const num = String(100000 + Math.floor(rand() * 900000)).slice(0, 7);
    const status = containerStatuses[Math.floor(rand() * containerStatuses.length)];
    const daysAtPort = Math.floor(rand() * 45) + 1;
    const freeTimeDays = Math.floor(rand() * 14) + 3;
    const freeTimeUsed = Math.min(100, Math.floor((daysAtPort / freeTimeDays) * 100));
    const demurrageAmt = status === "At Port" || status === "On Hold" ? Math.floor(rand() * 500000) + 5000 : 0;
    const detentionAmt = (status === "At ICD" || status === "In Transit to ICD") ? Math.floor(rand() * 300000) + 3000 : 0;
    return {
      id: i + 1, containerNo: `${p}${num}`, port: ports[Math.floor(rand() * ports.length)],
      shippingLine: shippingLines[i % 10], size: containerSizes[Math.floor(rand() * containerSizes.length)],
      status, daysAtPort, freeTimeDays, freeTimeUsed,
      demurrage: demurrageAmt, detention: detentionAmt,
      totalDD: demurrageAmt + detentionAmt,
      blNumber: `BL${String(200000 + Math.floor(rand() * 800000)).slice(0, 6)}`,
      cargoType: ["FCL", "LCL", "Break Bulk", "OOG"][Math.floor(rand() * 4)],
      commodity: ["Electronics", "Textiles", "Auto Parts", "Pharma", "FMCG", "Machinery", "Chemicals", "Steel"][Math.floor(rand() * 8)],
      arrivalDate: `2026-0${(Math.floor(rand() * 6) + 1).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      estimatedRelease: `2026-0${Math.min(9, (Math.floor(rand() * 3) + 7)).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
    };
  });

  // --- Free Time Records ---
  const freeTimeRecords = Array.from({ length: 70 }, (_, i) => {
    const used = Math.floor(rand() * 100) + 1;
    const zone = used < 50 ? utilizationZones[0] : used < 70 ? utilizationZones[1] : used < 85 ? utilizationZones[2] : used < 95 ? utilizationZones[3] : used < 100 ? utilizationZones[4] : utilizationZones[5];
    return {
      id: i + 1, type: freeTimeTypes[Math.floor(rand() * freeTimeTypes.length)],
      port: ports[Math.floor(rand() * ports.length)], shippingLine: shippingLines[Math.floor(rand() * shippingLines.length)],
      container: containers[i % containers.length].containerNo,
      utilization: used, zone,
      totalDays: Math.floor(rand() * 14) + 3, usedDays: Math.floor(rand() * 10) + 1,
      remainingHours: zone === "Expired" ? 0 : Math.floor(rand() * 168),
      extensionStatus: ["Pending", "Approved", "Rejected", "Expired", "N/A"][Math.floor(rand() * 5)] as string,
      expiryDate: `2026-0${Math.min(9, (Math.floor(rand() * 3) + 7)).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
    };
  });

  // --- Invoice Data ---
  const invoices = Array.from({ length: 65 }, (_, i) => {
    const base = Math.floor(rand() * 800000) + 20000;
    const gst = Math.floor(base * 0.18);
    const status = invoiceStatuses[Math.floor(rand() * invoiceStatuses.length)];
    return {
      id: i + 1, invoiceNo: `DD-INV-${String(6000 + i).padStart(5, "0")}`,
      shippingLine: shippingLines[i % 10], port: ports[Math.floor(rand() * ports.length)],
      container: containers[i % containers.length].containerNo,
      status, chargeType: chargeCategories[Math.floor(rand() * chargeCategories.length)],
      demurrage: Math.floor(base * 0.6), detention: Math.floor(base * 0.4),
      subtotal: base, gst, total: base + gst,
      baseAmount: base, cgst: Math.floor(gst / 2), sgst: Math.floor(gst / 2),
      gstType: ["IGST", "CGST+SGST"][Math.floor(rand() * 2)] as string,
      paymentMethod: paymentMethods[Math.floor(rand() * paymentMethods.length)],
      dueDate: `2026-0${Math.min(9, (Math.floor(rand() * 3) + 7)).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      paidDate: status === "Paid" ? `2026-0${(Math.floor(rand() * 6) + 1).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}` : "—",
      paidAmount: status === "Paid" ? base + gst : status === "Partially Paid" ? Math.floor((base + gst) * (rand() * 0.6 + 0.2)) : 0,
    };
  });

  // --- Dispute Data ---
  const disputes = Array.from({ length: 55 }, (_, i) => {
    const claimed = Math.floor(rand() * 1000000) + 50000;
    const sev = severityLevels[Math.floor(rand() * severityLevels.length)];
    return {
      id: i + 1, disputeNo: `DISP-${String(1000 + i).padStart(4, "0")}`,
      type: disputeTypes[Math.floor(rand() * disputeTypes.length)],
      shippingLine: shippingLines[i % 10], port: ports[Math.floor(rand() * ports.length)],
      status: disputeStatuses[Math.floor(rand() * disputeStatuses.length)],
      severity: sev,
      claimed, offered: Math.floor(claimed * (rand() * 0.7 + 0.1)),
      settled: Math.floor(rand() * 2) === 0 ? Math.floor(claimed * (rand() * 0.5 + 0.2)) : 0,
      daysElapsed: Math.floor(rand() * 14) + 1,
      slaTarget: 7,
      container: containers[i % containers.length].containerNo,
      invoiceRef: invoices[i % invoices.length].invoiceNo,
      evidence: { invoice: Math.floor(rand() * 2) === 0, bl: Math.floor(rand() * 2) === 0, portReceipt: Math.floor(rand() * 2) === 0, photos: Math.floor(rand() * 2) === 0 },
      raisedDate: `2026-0${(Math.floor(rand() * 6) + 1).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      resolutionDate: ["Accepted", "Rejected"].includes(disputeStatuses[Math.floor(rand() * disputeStatuses.length)]) ? `2026-0${(Math.floor(rand() * 3) + 4).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}` : "—",
      assignee: ["Raj K.", "Priya M.", "Amit S.", "Neha P.", "Vikram T."][Math.floor(rand() * 5)],
    };
  });

  // --- KPI Data ---
  const kpis = {
    activeContainers: containers.filter(c => ["At Port", "At ICD", "In Transit to ICD", "Empty Return Pending"].includes(c.status)).length,
    totalLiability: containers.reduce((s, c) => s + c.totalDD, 0),
    atRisk: containers.filter(c => c.freeTimeUsed >= 85).length,
    avgFreeTimeUsed: Math.round(containers.reduce((s, c) => s + c.freeTimeUsed, 0) / containers.length),
    monthCharges: invoices.filter(inv => ["Pending", "Under Review", "Approved"].includes(inv.status)).reduce((s, inv) => s + inv.total, 0),
    disputesPending: disputes.filter(d => ["Open", "Under Investigation", "Carrier Responded"].includes(d.status)).length,
    avgTurnaround: (containers.reduce((s, c) => s + c.daysAtPort, 0) / containers.length).toFixed(1),
    savingsAchieved: Math.floor(containers.reduce((s, c) => s + c.totalDD, 0) * 0.15),
  };

  // --- Chart Data ---
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyDD = months.map((m, idx) => ({
    month: m,
    Demurrage: Math.floor(rand() * 4000000) + 1000000,
    Detention: Math.floor(rand() * 2000000) + 500000,
    Total: 0,
  })).map(d => ({ ...d, Total: d.Demurrage + d.Detention }));

  const chargeDistribution = chargeCategories.map(c => ({ name: c, value: Math.floor(rand() * 3000000) + 500000 }));

  const portwiseDD = ports.slice(0, 6).map(p => ({
    port: p.length > 12 ? p.slice(0, 12) : p,
    Demurrage: Math.floor(rand() * 5000000) + 1000000,
    Detention: Math.floor(rand() * 2500000) + 500000,
  }));

  const turnaroundTrend = months.map(m => ({ month: m, Actual: Math.floor(rand() * 10) + 5, Target: 7 }));

  // --- Analytics ---
  const analyticsKpis = {
    totalDDPaid: Math.floor(rand() * 50000000) + 10000000,
    avgPerContainer: Math.floor(rand() * 50000) + 10000,
    savingsFromNegotiation: Math.floor(rand() * 8000000) + 2000000,
    disputeWinRate: Math.floor(rand() * 30) + 50,
    turnaroundImprovement: Math.floor(rand() * 15) + 5,
    congestionIndex: Math.floor(rand() * 40) + 50,
    carrierScore: Math.floor(rand() * 20) + 70,
    yoyReduction: Math.floor(rand() * 15) + 5,
  };

  const analyticsCharts = {
    portComparison: ports.slice(0, 6).map(p => ({
      port: p.length > 12 ? p.slice(0, 12) : p,
      Demurrage: Math.floor(rand() * 4000000) + 800000,
      Detention: Math.floor(rand() * 2000000) + 400000,
    })),
    disputeResolution: [
      { name: "Won", value: Math.floor(rand() * 20) + 15 },
      { name: "Lost", value: Math.floor(rand() * 10) + 5 },
      { name: "Partial", value: Math.floor(rand() * 8) + 5 },
      { name: "Settled", value: Math.floor(rand() * 12) + 8 },
    ],
  };

  return {
    ports, containerStatuses, shippingLines, containerSizes, chargeCategories,
    freeTimeTypes, utilizationZones, invoiceStatuses, paymentMethods,
    disputeTypes, disputeStatuses, severityLevels,
    containers, freeTimeRecords, invoices, disputes,
    kpis, monthlyDD, chargeDistribution, portwiseDD, turnaroundTrend,
    analyticsKpis, analyticsCharts, months,
  };
}

const data = generateData();

// ============================================================================
// Unique Visual Components
// ============================================================================
function ContainerStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "At Port": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "In Transit to ICD": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    "At ICD": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    "Empty Return Pending": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "Returned": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    "On Hold": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    "Disputed": "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    "Released": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return <span className={cn("ddm-pill ddm-bucket-badge px-2 py-0.5 rounded-full text-xs font-medium", colors[status] || "bg-gray-100 text-gray-600")}>{String(status)}</span>;
}

function PortBadge({ port }: { port: string }) {
  const colors = ["bg-blue-50 text-blue-700", "bg-teal-50 text-teal-700", "bg-amber-50 text-amber-700", "bg-rose-50 text-rose-700", "bg-violet-50 text-violet-700", "bg-emerald-50 text-emerald-700"];
  const c = colors[port.length % colors.length];
  return <span className={cn("ddm-pill ddm-wh-badge px-2 py-0.5 rounded-md text-xs font-medium border", c)}>{String(port)}</span>;
}

function ShippingLineBadge({ line }: { line: string }) {
  return <span className="ddm-pill px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{String(line)}</span>;
}

function ContainerSizeBadge({ size }: { size: string }) {
  const colors: Record<string, string> = { "20ft GP": "bg-blue-100 text-blue-700", "40ft GP": "bg-indigo-100 text-indigo-700", "40ft HC": "bg-amber-100 text-amber-700", "20ft RF": "bg-cyan-100 text-cyan-700", "40ft RF": "bg-teal-100 text-teal-700", "45ft HC": "bg-purple-100 text-purple-700" };
  return <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", colors[size] || "bg-gray-100")}>{String(size)}</span>;
}

function FreeTimeBar({ used }: { used: number }) {
  const color = used < 60 ? "#059669" : used < 80 ? "#d97706" : used < 95 ? "#ea580c" : "#dc2626";
  return (
    <div className="ddm-heat-bar w-full h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
      <div className="ddm-util-fill h-full rounded" style={{ width: `${Math.min(100, used)}%`, background: color, transition: "width 0.8s ease-out" }} />
    </div>
  );
}

function DDChargeTile({ demurrage, detention }: { demurrage: number; detention: number }) {
  return (
    <div className="ddm-value-tile p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Demurrage</span><span className="font-semibold text-red-600 tabular-nums">{formatINR(demurrage)}</span></div>
      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Detention</span><span className="font-semibold text-amber-600 tabular-nums">{formatINR(detention)}</span></div>
      <div className="flex justify-between text-xs border-t border-slate-200 dark:border-slate-700 pt-1"><span className="font-medium">Total</span><span className="font-bold tabular-nums">{formatINR(demurrage + detention)}</span></div>
    </div>
  );
}

function ContainerNumberDisplay({ num }: { num: string }) {
  return <span className="ddm-container-no font-mono text-sm tracking-wider font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{String(num)}</span>;
}

function DaysCounterBadge({ days, label }: { days: number; label?: string }) {
  const color = days <= 3 ? "bg-emerald-100 text-emerald-700" : days <= 7 ? "bg-amber-100 text-amber-700" : days <= 14 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700";
  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold tabular-nums", color)}>{String(days)}d {label || ""}</span>;
}

function UtilizationZoneBadge({ zone }: { zone: string }) {
  const colors: Record<string, string> = { Green: "bg-emerald-100 text-emerald-700", Yellow: "bg-yellow-100 text-yellow-700", Amber: "bg-amber-100 text-amber-700", Orange: "bg-orange-100 text-orange-700", Red: "bg-red-100 text-red-700", Expired: "bg-rose-100 text-rose-700" };
  return <span className={cn("ddm-pill px-2 py-0.5 rounded-full text-xs font-bold", colors[zone] || "bg-gray-100")}>{String(zone)}</span>;
}

function CountdownTimer({ hours }: { hours: number }) {
  if (hours === 0) return <span className="text-xs font-bold text-red-600 ddm-expired-flash">EXPIRED</span>;
  const days = Math.floor(hours / 24);
  const hrs = hours % 24;
  const color = hours < 24 ? "text-red-600 ddm-sla-urgent" : hours < 72 ? "text-amber-600" : "text-emerald-600";
  return <span className={cn("text-xs font-bold tabular-nums", color)}>{days > 0 ? `${days}d ` : ""}{hrs}h remaining</span>;
}

function InvoiceStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { Draft: "bg-slate-100 text-slate-600", Pending: "bg-amber-100 text-amber-700", "Under Review": "bg-blue-100 text-blue-700", Approved: "bg-emerald-100 text-emerald-700", Disputed: "bg-red-100 text-red-700", Paid: "bg-green-100 text-green-700", "Partially Paid": "bg-orange-100 text-orange-700", "Written Off": "bg-rose-100 text-rose-700" };
  return <span className={cn("ddm-pill ddm-wo-status-badge px-2 py-0.5 rounded-full text-xs font-medium", colors[status] || "bg-gray-100")}>{String(status)}</span>;
}

function ChargeTypeBadge({ type }: { type: string }) {
  const colors = ["bg-red-50 text-red-600", "bg-amber-50 text-amber-600", "bg-blue-50 text-blue-600", "bg-slate-50 text-slate-600", "bg-purple-50 text-purple-600", "bg-rose-50 text-rose-600"];
  return <span className={cn("px-2 py-0.5 rounded text-xs font-medium", colors[type.length % colors.length])}>{String(type)}</span>;
}

function GSTCalculationTile({ base, cgst, sgst, gstType }: { base: number; cgst: number; sgst: number; gstType: string }) {
  return (
    <div className="ddm-gst-tile p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Base Amount</span><span className="font-semibold tabular-nums">{formatINR(base)}</span></div>
      {gstType === "CGST+SGST" ? (
        <>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">CGST (9%)</span><span className="tabular-nums">{formatINR(cgst)}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">SGST (9%)</span><span className="tabular-nums">{formatINR(sgst)}</span></div>
        </>
      ) : (
        <div className="flex justify-between text-xs"><span className="text-muted-foreground">IGST (18%)</span><span className="tabular-nums">{formatINR(cgst + sgst)}</span></div>
      )}
    </div>
  );
}

function InvoiceTimeline({ status }: { status: string }) {
  const stages = ["Raised", "Reviewed", "Approved", "Paid"];
  const statusIdx = ["Draft", "Pending", "Under Review", "Approved", "Paid"].indexOf(status);
  return (
    <div className="ddm-approval-progress flex items-center gap-1">
      {stages.map((s, idx) => (
        <React.Fragment key={s}>
          <div className={cn("ddm-stage w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold", idx <= statusIdx ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500")}>
            {idx < statusIdx ? <CheckCircle2 className="w-3 h-3" /> : <span>{idx + 1}</span>}
          </div>
          {idx < stages.length - 1 && <div className={cn("h-0.5 w-4", idx < statusIdx ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700")} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function DisputeTypeBadge({ type }: { type: string }) {
  const colors = ["bg-red-100 text-red-700", "bg-orange-100 text-orange-700", "bg-amber-100 text-amber-700", "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-rose-100 text-rose-700", "bg-slate-100 text-slate-700", "bg-teal-100 text-teal-700"];
  return <span className={cn("ddm-pill px-2 py-0.5 rounded-full text-xs font-medium", colors[type.length % colors.length])}>{String(type)}</span>;
}

function DisputeSeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = { Critical: "bg-red-600 text-white ddm-risk-critical", High: "bg-orange-500 text-white", Medium: "bg-amber-400 text-amber-900", Low: "bg-blue-100 text-blue-700", Minimal: "bg-slate-100 text-slate-600" };
  return <span className={cn("ddm-pill px-2 py-0.5 rounded-full text-xs font-bold", colors[severity] || "bg-gray-100")}>{String(severity)}</span>;
}

function DisputeStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { Open: "bg-amber-100 text-amber-700", "Under Investigation": "bg-blue-100 text-blue-700", "Carrier Responded": "bg-cyan-100 text-cyan-700", Accepted: "bg-emerald-100 text-emerald-700", Rejected: "bg-red-100 text-red-700", Escalated: "bg-rose-100 text-rose-700" };
  return <span className={cn("ddm-pill ddm-wo-status-badge px-2 py-0.5 rounded-full text-xs font-medium", colors[status] || "bg-gray-100")}>{String(status)}</span>;
}

function SLATracker({ elapsed, target }: { elapsed: number; target: number }) {
  const pct = Math.min(100, (elapsed / target) * 100);
  const color = pct <= 50 ? "#059669" : pct <= 80 ? "#d97706" : "#dc2626";
  return (
    <div className="ddm-sla-tracker space-y-1">
      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">SLA: {String(elapsed)}/{String(target)} days</span><span className="font-bold" style={{ color }}>{String(Math.round(pct))}%</span></div>
      <div className="ddm-recovery-bar w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
        <div className="h-full rounded" style={{ width: `${pct}%`, background: color, transition: "width 0.6s ease-out" }} />
      </div>
    </div>
  );
}

function DisputeAmountTile({ claimed, offered, settled }: { claimed: number; offered: number; settled: number }) {
  return (
    <div className="ddm-wo-value-tile p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Claimed</span><span className="font-semibold text-red-600 tabular-nums">{formatINR(claimed)}</span></div>
      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Offered</span><span className="font-semibold text-amber-600 tabular-nums">{formatINR(offered)}</span></div>
      {settled > 0 && <div className="flex justify-between text-xs border-t border-slate-200 dark:border-slate-700 pt-1"><span className="font-medium">Settled</span><span className="font-bold text-emerald-600 tabular-nums">{formatINR(settled)}</span></div>}
    </div>
  );
}

function EvidenceTracker({ evidence }: { evidence: { invoice: boolean; bl: boolean; portReceipt: boolean; photos: boolean } }) {
  const items = [
    { label: "Invoice", ok: evidence.invoice },
    { label: "B/L", ok: evidence.bl },
    { label: "Port Receipt", ok: evidence.portReceipt },
    { label: "Photos", ok: evidence.photos },
  ];
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map(it => (
        <span key={it.label} className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium", it.ok ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-400")}>
          {it.ok ? <FileCheck className="w-3 h-3" /> : <FileWarning className="w-3 h-3" />}
          {it.label}
        </span>
      ))}
    </div>
  );
}

function ResolutionRateRing({ rate }: { rate: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (rate / 100) * circ;
  const color = rate >= 70 ? "#059669" : rate >= 50 ? "#d97706" : "#dc2626";
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="ddm-score-ring">
      <circle cx="34" cy="34" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-700" />
      <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 34 34)" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      <text x="34" y="36" textAnchor="middle" className="text-xs font-bold fill-current" style={{ color }}>{String(rate)}%</text>
    </svg>
  );
}

const CHART_COLORS = ["#991b1b", "#0d9488", "#ca8a04", "#475569", "#d97706", "#7c3aed"];

// ============================================================================
// Main Component
// ============================================================================
export default function DemurrageDetentionMgmtView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("0");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<Record<string, unknown> | null>(null);

  const toggleSort = useCallback((field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }, [sortField]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 ml-1 text-teal-600" /> : <ArrowDown className="w-3 h-3 ml-1 text-teal-600" />;
  };

  // --- Tab 1: Container sorting ---
  const filteredContainers = useMemo(() => {
    let arr = [...data.containers];
    if (statusFilter !== "all") arr = arr.filter(c => c.status === statusFilter);
    if (searchTerm) arr = arr.filter(c => c.containerNo.toLowerCase().includes(searchTerm.toLowerCase()) || c.port.toLowerCase().includes(searchTerm.toLowerCase()) || c.shippingLine.toLowerCase().includes(searchTerm.toLowerCase()));
    arr.sort((a, b) => {
      const va = (a as Record<string, unknown>)[sortField];
      const vb = (b as Record<string, unknown>)[sortField];
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [searchTerm, statusFilter, sortField, sortDir]);

  // --- Tab 3: Invoice sorting ---
  const filteredInvoices = useMemo(() => {
    let arr = [...data.invoices];
    if (statusFilter !== "all") arr = arr.filter(inv => inv.status === statusFilter);
    if (searchTerm) arr = arr.filter(inv => inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) || inv.shippingLine.toLowerCase().includes(searchTerm.toLowerCase()));
    arr.sort((a, b) => {
      const va = (a as Record<string, unknown>)[sortField];
      const vb = (b as Record<string, unknown>)[sortField];
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [searchTerm, statusFilter, sortField, sortDir]);

  // --- Tab 4: Dispute sorting ---
  const filteredDisputes = useMemo(() => {
    let arr = [...data.disputes];
    if (statusFilter !== "all") arr = arr.filter(d => d.status === statusFilter);
    if (searchTerm) arr = arr.filter(d => d.disputeNo.toLowerCase().includes(searchTerm.toLowerCase()) || d.type.toLowerCase().includes(searchTerm.toLowerCase()));
    arr.sort((a, b) => {
      const va = (a as Record<string, unknown>)[sortField];
      const vb = (b as Record<string, unknown>)[sortField];
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [searchTerm, statusFilter, sortField, sortDir]);

  const k = data.kpis;
  const ak = data.analyticsKpis;

  return (
    <div className="ddm-root flex flex-col gap-4 p-4">
      <PageHeader title="Demurrage & Detention Management" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          {["D&D Dashboard", "Container Tracker", "Free Time Mgmt", "Invoice & Billing", "Disputes & Claims", "D&D Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="data-[state=active]:shadow-md">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ====== TAB 0: Dashboard ====== */}
        <TabsContent value="0" className="space-y-4 mt-4">
          <div className="ddm-kpi-grid grid grid-cols-4 gap-4">
            {[
              { label: "Active Containers", value: k.activeContainers, icon: <Package className="w-4 h-4" /> },
              { label: "Total D&D Liability", value: formatINR(k.totalLiability), icon: <IndianRupee className="w-4 h-4" /> },
              { label: "Containers at Risk", value: k.atRisk, icon: <AlertTriangle className="w-4 h-4" /> },
              { label: "Avg Free Time Used", value: `${k.avgFreeTimeUsed}%`, icon: <Percent className="w-4 h-4" /> },
              { label: "This Month Charges", value: formatINR(k.monthCharges), icon: <DollarSign className="w-4 h-4" /> },
              { label: "Disputes Pending", value: k.disputesPending, icon: <Scale className="w-4 h-4" /> },
              { label: "Avg Turnaround", value: `${k.avgTurnaround}d`, icon: <Clock className="w-4 h-4" /> },
              { label: "Savings Achieved", value: formatINR(k.savingsAchieved), icon: <TrendingUp className="w-4 h-4" /> },
            ].map((item, idx) => (
              <Card key={idx} className="ddm-kpi-card">
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
                  <CardTitle className="text-xs text-muted-foreground font-medium">{item.label}</CardTitle>
                  <span className="text-muted-foreground">{item.icon}</span>
                </CardHeader>
                <CardContent className="glass-subtle px-4 pb-3"><div className="text-xl font-bold tabular-nums">{item.value}</div></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="ddm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly D&D Charges</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><AreaChart data={data.monthlyDD}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Legend /><Area type="monotone" dataKey="Demurrage" stackId="1" stroke="#991b1b" fill="#fecaca" /><Area type="monotone" dataKey="Detention" stackId="1" stroke="#0d9488" fill="#99f6e4" /><Area type="monotone" dataKey="Total" stroke="#ca8a04" fill="none" strokeWidth={2} /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card className="ddm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Charge Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={data.chargeDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}>{data.chargeDistribution.map((_: unknown, idx: number) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => formatINR(v)} /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="ddm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Port-wise D&D</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.portwiseDD}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="port" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Legend /><Bar dataKey="Demurrage" fill="#991b1b" radius={[4, 4, 0, 0]} /><Bar dataKey="Detention" fill="#0d9488" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="ddm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Turnaround Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><LineChart data={data.turnaroundTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="Actual" stroke="#991b1b" strokeWidth={2} /><Line type="monotone" dataKey="Target" stroke="#0d9488" strokeDasharray="5 5" /></LineChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>

        {/* ====== TAB 1: Container Tracker ====== */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search container, port, line..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background"><option value="all">All Statuses</option>{data.containerStatuses.map(s => <option key={String(s)} value={String(s)}>{String(s)}</option>)}</select>
          </div>
          <div className="rounded-lg border overflow-auto max-h-[520px]">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                  {[
                    { key: "containerNo", label: "Container" }, { key: "port", label: "Port" }, { key: "shippingLine", label: "Line" },
                    { key: "size", label: "Size" }, { key: "status", label: "Status" }, { key: "daysAtPort", label: "Days" },
                    { key: "freeTimeUsed", label: "Free Time %" }, { key: "totalDD", label: "D&D Total" },
                    { key: "blNumber", label: "B/L" }, { key: "arrivalDate", label: "Arrival" },
                  ].map(h => (
                    <th key={h.key} className="ddm-sort-header px-3 py-2 text-left font-medium cursor-pointer" onClick={() => toggleSort(h.key)}>
                      {h.label}<SortIcon field={h.key} />
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredContainers.map((c, idx) => (
                  <tr key={c.id} className={cn("ddm-data-row ddm-tab-1-row border-t transition-colors", idx % 2 === 1 && "bg-slate-50/50 dark:bg-slate-800/30")}>
                    <td className="px-3 py-2"><ContainerNumberDisplay num={c.containerNo} /></td>
                    <td className="px-3 py-2"><PortBadge port={c.port} /></td>
                    <td className="px-3 py-2"><ShippingLineBadge line={c.shippingLine} /></td>
                    <td className="px-3 py-2"><ContainerSizeBadge size={c.size} /></td>
                    <td className="px-3 py-2"><ContainerStatusBadge status={c.status} /></td>
                    <td className="px-3 py-2"><DaysCounterBadge days={c.daysAtPort} /></td>
                    <td className="px-3 py-2"><div className="w-20"><FreeTimeBar used={c.freeTimeUsed} /><div className="text-[10px] mt-0.5 tabular-nums">{c.freeTimeUsed}%</div></div></td>
                    <td className="px-3 py-2 font-bold tabular-nums">{formatINR(c.totalDD)}</td>
                    <td className="px-3 py-2 font-mono text-[10px]">{c.blNumber}</td>
                    <td className="px-3 py-2">{c.arrivalDate}</td>
                    <td className="px-3 py-2"><Button size="sm" variant="ghost" className="ddm-action-btn h-7" onClick={() => { setDrawerRecord(c); setDrawerOpen(true); }}><Eye className="w-3 h-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ====== TAB 2: Free Time Management ====== */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search free time records..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background"><option value="all">All Zones</option>{data.utilizationZones.map(z => <option key={String(z)} value={String(z)}>{String(z)}</option>)}</select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.freeTimeRecords.filter(r => statusFilter === "all" || r.zone === statusFilter).filter(r => searchTerm === "" || r.port.toLowerCase().includes(searchTerm.toLowerCase()) || r.container.toLowerCase().includes(searchTerm.toLowerCase())).map(r => (
              <Card key={r.id} className="ddm-chart-card hover:shadow-md transition-shadow">
                <CardContent className="glass-subtle p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="font-bold text-sm">{String(r.type)}</span><PortBadge port={r.port} /></div>
                    <UtilizationZoneBadge zone={r.zone} />
                  </div>
                  <div className="flex items-center gap-2"><ShippingLineBadge line={r.shippingLine} /><span className="font-mono text-[10px] text-muted-foreground">{r.container}</span></div>
                  <div className="w-full"><FreeTimeBar used={r.utilization} /><div className="flex justify-between text-[10px] mt-1"><span className="text-muted-foreground">{r.usedDays}/{r.totalDays} days</span><span className="font-bold tabular-nums">{r.utilization}%</span></div></div>
                  <div className="flex items-center justify-between"><CountdownTimer hours={r.remainingHours} /><span className="text-[10px] text-muted-foreground">Expiry: {r.expiryDate}</span></div>
                  {r.extensionStatus !== "N/A" && <Badge variant="outline" className="badge-interactive text-[10px]">{String(r.extensionStatus)}</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ====== TAB 3: Invoice & Billing ====== */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search invoice, line..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background"><option value="all">All Statuses</option>{data.invoiceStatuses.map(s => <option key={String(s)} value={String(s)}>{String(s)}</option>)}</select>
          </div>
          <div className="rounded-lg border overflow-auto max-h-[520px]">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                  {[
                    { key: "invoiceNo", label: "Invoice" }, { key: "shippingLine", label: "Line" }, { key: "port", label: "Port" },
                    { key: "chargeType", label: "Charge" }, { key: "status", label: "Status" }, { key: "demurrage", label: "Demurrage" },
                    { key: "detention", label: "Detention" }, { key: "total", label: "Total" },
                    { key: "gstType", label: "GST" }, { key: "dueDate", label: "Due Date" },
                  ].map(h => (
                    <th key={h.key} className="ddm-sort-header px-3 py-2 text-left font-medium cursor-pointer" onClick={() => toggleSort(h.key)}>
                      {h.label}<SortIcon field={h.key} />
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv, idx) => (
                  <tr key={inv.id} className={cn("ddm-data-row ddm-tab-3-row border-t transition-colors", idx % 2 === 1 && "bg-slate-50/50 dark:bg-slate-800/30")}>
                    <td className="px-3 py-2 font-mono font-bold">{inv.invoiceNo}</td>
                    <td className="px-3 py-2"><ShippingLineBadge line={inv.shippingLine} /></td>
                    <td className="px-3 py-2"><PortBadge port={inv.port} /></td>
                    <td className="px-3 py-2"><ChargeTypeBadge type={inv.chargeType} /></td>
                    <td className="px-3 py-2"><InvoiceStatusBadge status={inv.status} /></td>
                    <td className="px-3 py-2 tabular-nums text-red-600">{formatINR(inv.demurrage)}</td>
                    <td className="px-3 py-2 tabular-nums text-amber-600">{formatINR(inv.detention)}</td>
                    <td className="px-3 py-2 font-bold tabular-nums">{formatINR(inv.total)}</td>
                    <td className="badge-interactive px-3 py-2"><Badge variant="outline" className="text-[10px]">{inv.gstType}</Badge></td>
                    <td className="px-3 py-2">{inv.dueDate}</td>
                    <td className="px-3 py-2"><Button size="sm" variant="ghost" className="ddm-action-btn h-7" onClick={() => { setDrawerRecord(inv); setDrawerOpen(true); }}><Eye className="w-3 h-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ====== TAB 4: Disputes & Claims ====== */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search disputes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background"><option value="all">All Statuses</option>{data.disputeStatuses.map(s => <option key={String(s)} value={String(s)}>{String(s)}</option>)}</select>
          </div>
          <div className="rounded-lg border overflow-auto max-h-[520px]">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                  {[
                    { key: "disputeNo", label: "Dispute" }, { key: "type", label: "Type" }, { key: "shippingLine", label: "Line" },
                    { key: "severity", label: "Severity" }, { key: "status", label: "Status" }, { key: "claimed", label: "Claimed" },
                    { key: "daysElapsed", label: "Days" }, { key: "container", label: "Container" },
                    { key: "raisedDate", label: "Raised" }, { key: "assignee", label: "Assignee" },
                  ].map(h => (
                    <th key={h.key} className="ddm-sort-header px-3 py-2 text-left font-medium cursor-pointer" onClick={() => toggleSort(h.key)}>
                      {h.label}<SortIcon field={h.key} />
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisputes.map((d, idx) => (
                  <tr key={d.id} className={cn("ddm-data-row ddm-tab-4-row border-t transition-colors", idx % 2 === 1 && "bg-slate-50/50 dark:bg-slate-800/30")}>
                    <td className="px-3 py-2 font-mono font-bold">{d.disputeNo}</td>
                    <td className="px-3 py-2"><DisputeTypeBadge type={d.type} /></td>
                    <td className="px-3 py-2"><ShippingLineBadge line={d.shippingLine} /></td>
                    <td className="px-3 py-2"><DisputeSeverityBadge severity={d.severity} /></td>
                    <td className="px-3 py-2"><DisputeStatusBadge status={d.status} /></td>
                    <td className="px-3 py-2 font-bold tabular-nums text-red-600">{formatINR(d.claimed)}</td>
                    <td className="px-3 py-2"><SLATracker elapsed={d.daysElapsed} target={d.slaTarget} /></td>
                    <td className="px-3 py-2 font-mono text-[10px]">{d.container}</td>
                    <td className="px-3 py-2">{d.raisedDate}</td>
                    <td className="px-3 py-2">{d.assignee}</td>
                    <td className="px-3 py-2"><Button size="sm" variant="ghost" className="ddm-action-btn h-7" onClick={() => { setDrawerRecord(d); setDrawerOpen(true); }}><Eye className="w-3 h-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ====== TAB 5: Analytics ====== */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="ddm-kpi-grid grid grid-cols-4 gap-4">
            {[
              { label: "Total D&D Paid", value: formatINR(ak.totalDDPaid), icon: <DollarSign className="w-4 h-4" /> },
              { label: "Avg Per Container", value: formatINR(ak.avgPerContainer), icon: <Package className="w-4 h-4" /> },
              { label: "Savings (Negotiation)", value: formatINR(ak.savingsFromNegotiation), icon: <TrendingUp className="w-4 h-4" /> },
              { label: "Dispute Win Rate", value: `${ak.disputeWinRate}%`, icon: <ShieldCheck className="w-4 h-4" /> },
              { label: "Turnaround Improvement", value: `+${ak.turnaroundImprovement}%`, icon: <TrendingDown className="w-4 h-4" /> },
              { label: "Port Congestion Index", value: `${ak.congestionIndex}%`, icon: <AlertTriangle className="w-4 h-4" /> },
              { label: "Carrier Score", value: `${ak.carrierScore}/100`, icon: <BarChart3 className="w-4 h-4" /> },
              { label: "YoY Reduction", value: `-${ak.yoyReduction}%`, icon: <Activity className="w-4 h-4" /> },
            ].map((item, idx) => (
              <Card key={idx} className="ddm-kpi-card">
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
                  <CardTitle className="text-xs text-muted-foreground font-medium">{item.label}</CardTitle>
                  <span className="text-muted-foreground">{item.icon}</span>
                </CardHeader>
                <CardContent className="glass-subtle px-4 pb-3"><div className="text-xl font-bold tabular-nums">{item.value}</div></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="ddm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Port-wise Comparison</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.analyticsCharts.portComparison}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="port" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Legend /><Bar dataKey="Demurrage" fill="#991b1b" radius={[4, 4, 0, 0]} /><Bar dataKey="Detention" fill="#0d9488" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="ddm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Dispute Resolution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={data.analyticsCharts.disputeResolution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}>{data.analyticsCharts.disputeResolution.map((_: unknown, idx: number) => <Cell key={idx} fill={CHART_COLORS[idx]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ====== DRAWER ====== */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="ddm-drawer-header text-white px-4 py-3 rounded-lg" style={{ background: "linear-gradient(135deg, #991b1b, #be123c)" }}>
              {drawerRecord && "containerNo" in drawerRecord ? String(drawerRecord.containerNo) : drawerRecord && "invoiceNo" in drawerRecord ? String(drawerRecord.invoiceNo) : drawerRecord && "disputeNo" in drawerRecord ? String(drawerRecord.disputeNo) : "Details"}
            </SheetTitle>
          </SheetHeader>
          {drawerRecord && (
            <div className="mt-4 px-1 space-y-4">
              {/* Container Drawer */}
              {"status" in drawerRecord && "containerNo" in drawerRecord && (
                <>
                  <div className="flex items-center justify-between">
                    <div><div className="text-lg font-bold">{String(drawerRecord.containerNo)}</div><div className="text-sm opacity-90">{String(drawerRecord.port)}</div></div>
                    <ContainerStatusBadge status={String(drawerRecord.status)} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Free Time Used</span><span className="font-bold tabular-nums">{String(drawerRecord.freeTimeUsed)}%</span></div>
                    <FreeTimeBar used={Number(drawerRecord.freeTimeUsed)} />
                  </div>
                  <DDChargeTile demurrage={Number(drawerRecord.demurrage)} detention={Number(drawerRecord.detention)} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Shipping Line</span><div className="font-medium">{String(drawerRecord.shippingLine)}</div></div>
                    <div><span className="text-muted-foreground">Size</span><div className="font-medium"><ContainerSizeBadge size={String(drawerRecord.size)} /></div></div>
                    <div><span className="text-muted-foreground">Days at Port</span><div className="font-medium tabular-nums">{String(drawerRecord.daysAtPort)}</div></div>
                    <div><span className="text-muted-foreground">B/L Number</span><div className="font-mono">{String(drawerRecord.blNumber)}</div></div>
                    <div><span className="text-muted-foreground">Cargo Type</span><div className="font-medium">{String(drawerRecord.cargoType)}</div></div>
                    <div><span className="text-muted-foreground">Commodity</span><div className="font-medium">{String(drawerRecord.commodity)}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="ddm-action-btn flex-1" onClick={() => { toast.success("Container Released", `${drawerRecord.containerNo} marked as released`); setDrawerOpen(false); }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Release</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddm-action-btn flex-1" onClick={() => { toast.info("Dispute Raised", `Dispute for ${drawerRecord.containerNo}`); setDrawerOpen(false); }}><AlertTriangle className="w-3.5 h-3.5 mr-1" />Dispute</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddm-action-btn" onClick={() => { toast.warning("Escalated", `${drawerRecord.containerNo} escalated to management`); setDrawerOpen(false); }}><Zap className="w-3.5 h-3.5" /></Button>
                  </div>
                </>
              )}
              {/* Invoice Drawer */}
              {"invoiceNo" in drawerRecord && !("containerNo" in drawerRecord) && (
                <>
                  <div className="flex items-center justify-between">
                    <div><div className="text-lg font-bold font-mono">{String(drawerRecord.invoiceNo)}</div><div className="text-sm opacity-90">{String(drawerRecord.shippingLine)}</div></div>
                    <InvoiceStatusBadge status={String(drawerRecord.status)} />
                  </div>
                  <DDChargeTile demurrage={Number(drawerRecord.demurrage)} detention={Number(drawerRecord.detention)} />
                  <GSTCalculationTile base={Number(drawerRecord.baseAmount)} cgst={Number(drawerRecord.cgst)} sgst={Number(drawerRecord.sgst)} gstType={String(drawerRecord.gstType)} />
                  <InvoiceTimeline status={String(drawerRecord.status)} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Port</span><div className="font-medium">{String(drawerRecord.port)}</div></div>
                    <div><span className="text-muted-foreground">Charge Type</span><div className="font-medium"><ChargeTypeBadge type={String(drawerRecord.chargeType)} /></div></div>
                    <div><span className="text-muted-foreground">Payment Method</span><div className="font-medium">{String(drawerRecord.paymentMethod)}</div></div>
                    <div><span className="text-muted-foreground">Due Date</span><div className="font-medium">{String(drawerRecord.dueDate)}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="ddm-action-btn flex-1" onClick={() => { toast.success("Approved", `${drawerRecord.invoiceNo} approved`); setDrawerOpen(false); }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddm-action-btn flex-1" onClick={() => { toast.warning("Disputed", `${drawerRecord.invoiceNo} disputed`); setDrawerOpen(false); }}><Ban className="w-3.5 h-3.5 mr-1" />Dispute</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddm-action-btn" onClick={() => { toast.info("Payment Initiated", `${drawerRecord.invoiceNo}`); setDrawerOpen(false); }}><Receipt className="w-3.5 h-3.5" /></Button>
                  </div>
                </>
              )}
              {/* Dispute Drawer */}
              {"disputeNo" in drawerRecord && (
                <>
                  <div className="flex items-center justify-between">
                    <div><div className="text-lg font-bold font-mono">{String(drawerRecord.disputeNo)}</div><div className="text-sm opacity-90">{String(drawerRecord.type)}</div></div>
                    <DisputeSeverityBadge severity={String(drawerRecord.severity)} />
                  </div>
                  <SLATracker elapsed={Number(drawerRecord.daysElapsed)} target={Number(drawerRecord.slaTarget)} />
                  <DisputeAmountTile claimed={Number(drawerRecord.claimed)} offered={Number(drawerRecord.offered)} settled={Number(drawerRecord.settled)} />
                  <EvidenceTracker evidence={drawerRecord.evidence as { invoice: boolean; bl: boolean; portReceipt: boolean; photos: boolean }} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Status</span><div className="font-medium"><DisputeStatusBadge status={String(drawerRecord.status)} /></div></div>
                    <div><span className="text-muted-foreground">Shipping Line</span><div className="font-medium">{String(drawerRecord.shippingLine)}</div></div>
                    <div><span className="text-muted-foreground">Port</span><div className="font-medium">{String(drawerRecord.port)}</div></div>
                    <div><span className="text-muted-foreground">Assignee</span><div className="font-medium">{String(drawerRecord.assignee)}</div></div>
                    <div><span className="text-muted-foreground">Container</span><div className="font-mono text-[10px]">{String(drawerRecord.container)}</div></div>
                    <div><span className="text-muted-foreground">Invoice Ref</span><div className="font-mono text-[10px]">{String(drawerRecord.invoiceRef)}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="ddm-action-btn flex-1" onClick={() => { toast.success("Escalated", `${drawerRecord.disputeNo} escalated`); setDrawerOpen(false); }}><Zap className="w-3.5 h-3.5 mr-1" />Escalate</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddm-action-btn flex-1" onClick={() => { toast.info("Accepted", `${drawerRecord.disputeNo} accepted`); setDrawerOpen(false); }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Accept</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate ddm-action-btn" onClick={() => { toast.error("Escalated to Legal", `${drawerRecord.disputeNo}`); setDrawerOpen(false); }}><Scale className="w-3.5 h-3.5" /></Button>
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
