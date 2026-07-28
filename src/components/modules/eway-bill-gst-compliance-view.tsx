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
  ShieldCheck,
  ChevronDown,
  Truck,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  RotateCcw,
  Printer,
  FileDown,
  FileUp,
  CalendarDays,
  ShieldAlert,
  Route,
  Navigation,
  IndianRupee,
  Percent,
  BarChart3,
  PieChart as PieIcon,
  RefreshCw,
  ArrowRight,
  CircleDot,
  Flag,
  OctagonX,
  Zap,
  Ban,
  Gavel,
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
  const rand = seededRandom(2025134);

  const ewbStatuses = ["Active", "Valid", "Expired", "Cancelled", "Extended", "Transferred", "Suspended", "Rejected"] as const;
  const supplyTypes = [
    "Outward (Sales)", "Outward (Transfer)", "Outward (Branch)",
    "Inward (Purchase)", "Inward (Branch)", "Credit/Debit Notes",
    "Job Work", "Exhibition", "Exports", "Others",
  ] as const;
  const indianStates = [
    { name: "Maharashtra", code: "27" },
    { name: "Gujarat", code: "24" },
    { name: "Delhi", code: "07" },
    { name: "Karnataka", code: "29" },
    { name: "Tamil Nadu", code: "33" },
    { name: "Telangana", code: "36" },
    { name: "Rajasthan", code: "08" },
    { name: "Madhya Pradesh", code: "23" },
    { name: "Uttar Pradesh", code: "09" },
    { name: "West Bengal", code: "19" },
    { name: "Kerala", code: "32" },
    { name: "Andhra Pradesh", code: "28" },
  ] as const;
  const transportModes = ["Road", "Rail", "Air", "Ship", "Multi-Modal (Road+Rail)", "Multi-Modal (Road+Ship)", "Courier", "Hand Delivery"] as const;
  const vehicleTypes = ["Truck (Heavy)", "Truck (Medium)", "Truck (Light)", "Tempo", "Pickup", "Trailer", "Tanker", "Container", "Rail Wagon", "Courier Van"] as const;
  const assignmentStatuses = ["Assigned", "En-Route", "Reached Checkpoint", "Delivered", "Vehicle Changed", "Detained", "Overdue", "Completed"] as const;
  const vehicleRegStates = ["MH", "GJ", "DL", "KA", "TN", "TS", "RJ", "MP", "UP", "WB", "KL", "AP"] as const;
  const checkpointStatuses = ["Origin", "Checkpoint 1", "Checkpoint 2", "Checkpoint 3", "Destination", "Unloaded"] as const;
  const returnTypes = [
    "GSTR-1 (Outward)", "GSTR-2A (Auto-populated)", "GSTR-2B (ITC Statement)",
    "GSTR-3B (Summary)", "GSTR-4 (Composition)", "GSTR-5 (NR)",
    "GSTR-6 (ISD)", "GSTR-7 (TDS)", "GSTR-8 (E-commerce)", "GSTR-9 (Annual)",
  ] as const;
  const filingStatuses = ["Not Filed", "Draft", "Submitted", "Filed", "Processed", "Acknowledged", "Defective", "Rejected"] as const;
  const reconciliationStatuses = ["Matched", "Partially Matched", "Mismatched", "Pending", "Claimed", "Reversed", "Blocked", "Carry Forward"] as const;
  const mismatchReasons = [
    "Value Difference", "Tax Rate Mismatch", "Duplicate Claim", "ITC Exceeded",
    "Ineligible ITC", "Section 16(4) Time Bar", "Missing Invoice",
    "Reverse Charge Mismatch", "RCM Not Paid", "GSTR-2B Not Available",
  ] as const;
  const transporters = [
    "BlueDart Logistics", "Delhivery Express", "DTDC Supply Chain", "Gati Limited",
    "XpressBees Cargo", "Ecom Express Freight", "Shadowfax Networks",
    "Spotted Logistics", "Rivigo Transport", "BlackBuck Freight",
  ] as const;

  const panChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function generateEWBNumber(stateCode: string, idx: number): string {
    const pan = panChars[Math.floor(rand() * 26)] + panChars[Math.floor(rand() * 26)] +
      panChars[Math.floor(rand() * 26)] + panChars[Math.floor(rand() * 26)] +
      panChars[Math.floor(rand() * 26)] + panChars[Math.floor(rand() * 10)];
    const serial = String(idx).padStart(7, "0").slice(0, 5) + String(Math.floor(rand() * 10));
    return `${stateCode}${pan}${serial}`;
  }

  function generateVehiclePlate(stateCode: string): string {
    const district = String(Math.floor(rand() * 99) + 1).padStart(2, "0");
    const series = String.fromCharCode(65 + Math.floor(rand() * 26)) + String.fromCharCode(65 + Math.floor(rand() * 26));
    const number = String(Math.floor(rand() * 10000)).padStart(4, "0");
    return `${stateCode}-${district}-${series}-${number}`;
  }

  function generateGSTIN(stateCode: string): string {
    const pan = Array.from({ length: 10 }, () => panChars[Math.floor(rand() * 26)]).join("");
    const entity = Math.floor(rand() * 9) + 1;
    const check = Math.floor(rand() * 10);
    return `${stateCode}${pan}${entity}${check}Z${String.fromCharCode(65 + Math.floor(rand() * 26))}`;
  }

  // ---- E-Way Bills (90) ----
  const ewbBills: Array<{ id: string; ewbNumber: string; date: string; fromState: string; fromCode: string; toState: string; toCode: string; supplyType: string; transportMode: string; transporter: string; value: number; distance: number; validityDays: number; expiryDate: string; status: string; goodsDescription: string; gstin: string }> = [];
  for (let i = 0; i < 90; i++) {
    const fromState = indianStates[Math.floor(rand() * indianStates.length)];
    let toState = indianStates[Math.floor(rand() * indianStates.length)];
    while (toState.code === fromState.code) toState = indianStates[Math.floor(rand() * indianStates.length)];
    const distance = Math.floor(rand() * 2500 + 20);
    const validityDays = distance <= 100 ? 1 : distance <= 300 ? 3 : distance <= 500 ? 8 : 15;
    const status = ewbStatuses[Math.floor(rand() * ewbStatuses.length)];
    const createdDate = new Date(2025, Math.floor(rand() * 12), Math.floor(rand() * 28) + 1);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + validityDays);
    const value = Math.floor(rand() * 1500000 + 50000);
    ewbBills.push({
      id: `ewb-${i + 1}`,
      ewbNumber: generateEWBNumber(fromState.code, i),
      date: createdDate.toISOString().slice(0, 10),
      fromState: fromState.name,
      fromCode: fromState.code,
      toState: toState.name,
      toCode: toState.code,
      supplyType: supplyTypes[Math.floor(rand() * supplyTypes.length)],
      transportMode: transportModes[Math.floor(rand() * transportModes.length)],
      transporter: transporters[Math.floor(rand() * transporters.length)],
      value,
      distance,
      validityDays,
      expiryDate: expiryDate.toISOString().slice(0, 10),
      status,
      goodsDescription: ["Electronic Components", "Textile Goods", "Auto Parts", "Pharmaceutical Products", "Agricultural Produce", "Machinery Parts", "Chemical Products", "FMCG Goods", "Steel Products", "IT Equipment"][Math.floor(rand() * 10)],
      gstin: generateGSTIN(fromState.code),
    });
  }

  // ---- Vehicle Mappings (70) ----
  const vehicleMappings: Array<{ id: string; ewbNumber: string; vehicleType: string; vehiclePlate: string; oldVehiclePlate: string | null; regState: string; fromCity: string; toCity: string; status: string; currentCheckpoint: number; driverName: string; driverPhone: string; assignedDate: string; eta: string }> = [];
  for (let i = 0; i < 70; i++) {
    const regState = vehicleRegStates[Math.floor(rand() * vehicleRegStates.length)];
    const bill = ewbBills[Math.floor(rand() * ewbBills.length)];
    const currentCheckpoint = Math.floor(rand() * 6);
    const oldPlate = rand() > 0.7 ? generateVehiclePlate(vehicleRegStates[Math.floor(rand() * vehicleRegStates.length)]) : null;
    vehicleMappings.push({
      id: `vm-${i + 1}`,
      ewbNumber: bill.ewbNumber,
      vehicleType: vehicleTypes[Math.floor(rand() * vehicleTypes.length)],
      vehiclePlate: generateVehiclePlate(regState),
      oldVehiclePlate: oldPlate,
      regState,
      fromCity: bill.fromState,
      toCity: bill.toState,
      status: assignmentStatuses[Math.floor(rand() * assignmentStatuses.length)],
      currentCheckpoint,
      driverName: ["Rajesh Kumar", "Suresh Yadav", "Anil Sharma", "Vikram Singh", "Manoj Patel", "Deepak Gupta", "Ramesh Verma", "Arjun Rao", "Pradeep Joshi", "Kiran Naik"][Math.floor(rand() * 10)],
      driverPhone: `9${Math.floor(rand() * 9000000000 + 1000000000)}`,
      assignedDate: `2025-${String(Math.floor(rand() * 12) + 1).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      eta: `2025-${String(Math.floor(rand() * 3) + 10).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
    });
  }

  // ---- GST Returns (50) ----
  const gstReturns: Array<{ id: string; returnType: string; status: string; fy: string; month: number; period: string; gstin: string; stateName: string; totalTax: number; cgst: number; sgst: number; igst: number; cess: number; filingDate: string | null; dueDate: string }> = [];
  for (let i = 0; i < 50; i++) {
    const returnType = returnTypes[Math.floor(rand() * returnTypes.length)];
    const status = filingStatuses[Math.floor(rand() * filingStatuses.length)];
    const state = indianStates[Math.floor(rand() * indianStates.length)];
    const fy = rand() > 0.5 ? "2024-25" : "2023-24";
    const month = Math.floor(rand() * 12) + 1;
    const totalTax = Math.floor(rand() * 500000 + 10000);
    const cgst = Math.floor(totalTax * 0.2);
    const sgst = Math.floor(totalTax * 0.2);
    const igst = Math.floor(totalTax * 0.4);
    const cess = Math.floor(totalTax * 0.2);
    gstReturns.push({
      id: `gst-${i + 1}`,
      returnType,
      status,
      fy,
      month,
      period: `${month <= 3 ? fy.slice(5) : fy.slice(0, 4)}-${String(month).padStart(2, "0")}`,
      gstin: generateGSTIN(state.code),
      stateName: state.name,
      totalTax,
      cgst,
      sgst,
      igst,
      cess,
      filingDate: status === "Filed" || status === "Processed" || status === "Acknowledged"
        ? `2025-${String(month).padStart(2, "0")}-${String(Math.floor(rand() * 20) + 1).padStart(2, "0")}`
        : null,
      dueDate: `2025-${String(month).padStart(2, "0")}-${String(20).padStart(2, "0")}`,
    });
  }

  // ---- ITC Reconciliation (60) ----
  const itcRecords: Array<{ id: string; supplierGSTIN: string; supplierName: string; invoiceNumber: string; status: string; matchPct: number; mismatchReason: string | null; totalITC: number; claimed: number; reversed: number; section16DaysLeft: number; invoiceDate: string; gstin: string }> = [];
  for (let i = 0; i < 60; i++) {
    const status = reconciliationStatuses[Math.floor(rand() * reconciliationStatuses.length)];
    const state = indianStates[Math.floor(rand() * indianStates.length)];
    const matchPct = status === "Matched" ? 100 : status === "Partially Matched" ? Math.floor(rand() * 30 + 50) : status === "Mismatched" ? Math.floor(rand() * 40 + 10) : status === "Pending" ? 0 : Math.floor(rand() * 100);
    const totalITC = Math.floor(rand() * 800000 + 5000);
    const claimed = status === "Claimed" ? totalITC : Math.floor(totalITC * (matchPct / 100));
    const reversed = status === "Reversed" ? totalITC : 0;
    const invoiceDate = new Date(2025, Math.floor(rand() * 12), Math.floor(rand() * 28) + 1);
    const section16Days = Math.floor((180 - (Date.now() - invoiceDate.getTime()) / 86400000));
    itcRecords.push({
      id: `itc-${i + 1}`,
      supplierGSTIN: generateGSTIN(state.code),
      supplierName: ["Tata Steel Ltd", "Reliance Industries", "Bajaj Auto Parts", "Mahindra Logistics", "L&T Engineering", "Wipro Supplies", "Infosys Procurement", "Godrej Materials", "Hindustan Unilever Supply", "Asian Paints Distributors"][Math.floor(rand() * 10)],
      invoiceNumber: `INV-${String(Math.floor(rand() * 90000) + 10000)}`,
      status,
      matchPct,
      mismatchReason: (status === "Mismatched" || status === "Partially Matched") ? mismatchReasons[Math.floor(rand() * mismatchReasons.length)] : null,
      totalITC,
      claimed,
      reversed,
      section16DaysLeft: Math.max(0, section16Days),
      invoiceDate: invoiceDate.toISOString().slice(0, 10),
      gstin: generateGSTIN("27"),
    });
  }

  // ---- Dashboard KPIs ----
  const activeBills = ewbBills.filter(b => b.status === "Active" || b.status === "Valid").length;
  const expiringToday = ewbBills.filter(b => {
    const exp = new Date(b.expiryDate);
    const today = new Date();
    return Math.abs(today.getTime() - exp.getTime()) < 86400000 && b.status === "Active";
  }).length + Math.floor(rand() * 5 + 2);
  const expiredLast7 = ewbBills.filter(b => b.status === "Expired").length;
  const generatedToday = Math.floor(rand() * 15 + 3);
  const avgValidity = (ewbBills.reduce((a, b) => a + b.validityDays, 0) / ewbBills.length).toFixed(1);
  const complianceRate = (85 + rand() * 12).toFixed(1);
  const pendingExtensions = ewbBills.filter(b => b.status === "Active" && b.validityDays <= 2).length + Math.floor(rand() * 3);
  const totalGstLiability = Math.floor(rand() * 5000000 + 2000000);

  const monthlyTrend: Array<{ month: string; Generated: number; Extended: number; Cancelled: number; Expired: number }> = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < 12; i++) {
    monthlyTrend.push({
      month: months[i],
      Generated: Math.floor(rand() * 80 + 30),
      Extended: Math.floor(rand() * 20 + 5),
      Cancelled: Math.floor(rand() * 15 + 3),
      Expired: Math.floor(rand() * 12 + 2),
    });
  }

  const statusDistribution = [
    { name: "Active", value: ewbBills.filter(b => b.status === "Active" || b.status === "Valid").length },
    { name: "Expired", value: ewbBills.filter(b => b.status === "Expired").length },
    { name: "Cancelled", value: ewbBills.filter(b => b.status === "Cancelled").length },
    { name: "Extended", value: ewbBills.filter(b => b.status === "Extended").length },
    { name: "Transferred", value: ewbBills.filter(b => b.status === "Transferred").length },
  ];

  const transporterCount: Record<string, number> = {};
  ewbBills.forEach(b => { transporterCount[b.transporter] = (transporterCount[b.transporter] || 0) + 1; });
  const topTransporters = Object.entries(transporterCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name: name.split(" ")[0], count }));

  const distanceDistribution = [
    { range: "<100km", count: ewbBills.filter(b => b.distance < 100).length, validity: "1 day" },
    { range: "100-300km", count: ewbBills.filter(b => b.distance >= 100 && b.distance < 300).length, validity: "3 days" },
    { range: "300-500km", count: ewbBills.filter(b => b.distance >= 300 && b.distance < 500).length, validity: "8 days" },
    { range: "500-1000km", count: ewbBills.filter(b => b.distance >= 500 && b.distance < 1000).length, validity: "15 days" },
    { range: ">1000km", count: ewbBills.filter(b => b.distance >= 1000).length, validity: "15 days" },
  ];

  // ---- Analytics data ----
  const complianceTrend = months.map((m, i) => ({
    month: m,
    rate: Math.floor(82 + rand() * 15),
    target: 95,
  }));

  const stateWiseCompliance = indianStates.map(s => ({
    state: s.name.slice(0, 6),
    compliance: Math.floor(75 + rand() * 23),
  })).sort((a, b) => b.compliance - a.compliance);

  const filingStatusPie = [
    { name: "Filed", value: Math.floor(rand() * 30 + 40) },
    { name: "Late", value: Math.floor(rand() * 15 + 5) },
    { name: "Not Filed", value: Math.floor(rand() * 10 + 2) },
    { name: "Defective", value: Math.floor(rand() * 5 + 1) },
  ];

  const penaltyTrend = months.map(m => ({
    month: m,
    "Late Fee": Math.floor(rand() * 50000 + 5000),
    Interest: Math.floor(rand() * 20000 + 2000),
    Penalty: Math.floor(rand() * 30000 + 3000),
    Other: Math.floor(rand() * 10000 + 1000),
  }));

  const itcStatusPie = [
    { name: "Matched", value: Math.floor(rand() * 20 + 15) },
    { name: "Partial", value: Math.floor(rand() * 8 + 4) },
    { name: "Mismatch", value: Math.floor(rand() * 6 + 2) },
    { name: "Pending", value: Math.floor(rand() * 10 + 5) },
    { name: "Blocked", value: Math.floor(rand() * 3 + 1) },
  ];

  const riskScoreQuarterly = [
    { quarter: "Q1 FY24", score: Math.floor(rand() * 20 + 60) },
    { quarter: "Q2 FY24", score: Math.floor(rand() * 20 + 65) },
    { quarter: "Q3 FY24", score: Math.floor(rand() * 20 + 70) },
    { quarter: "Q4 FY24", score: Math.floor(rand() * 20 + 75) },
    { quarter: "Q1 FY25", score: Math.floor(rand() * 20 + 78) },
    { quarter: "Q2 FY25", score: Math.floor(rand() * 20 + 80) },
  ];

  return {
    ewbBills, vehicleMappings, gstReturns, itcRecords,
    activeBills, expiringToday, expiredLast7, generatedToday,
    avgValidity, complianceRate, pendingExtensions, totalGstLiability,
    monthlyTrend, statusDistribution, topTransporters, distanceDistribution,
    complianceTrend, stateWiseCompliance, filingStatusPie,
    penaltyTrend, itcStatusPie, riskScoreQuarterly,
    indianStates, checkpointStatuses,
  };
}

type Data = ReturnType<typeof generateData>;

// ============================================================================
// Color Maps
// ============================================================================
const EWB_STATUS_COLORS: Record<string, string> = {
  Active: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
  Valid: "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800",
  Expired: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
  Cancelled: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800",
  Extended: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  Transferred: "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800",
  Suspended: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
  Rejected: "text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
};

const FILING_STATUS_COLORS: Record<string, string> = {
  "Not Filed": "text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-800",
  Draft: "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30",
  Submitted: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  Filed: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  Processed: "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30",
  Acknowledged: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
  Defective: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30",
  Rejected: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
};

const ITC_STATUS_COLORS: Record<string, string> = {
  Matched: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  "Partially Matched": "text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30",
  Mismatched: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
  Pending: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  Claimed: "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30",
  Reversed: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30",
  Blocked: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30",
  "Carry Forward": "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30",
};

const VEHICLE_STATUS_COLORS: Record<string, string> = {
  Assigned: "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30",
  "En-Route": "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
  "Reached Checkpoint": "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  Delivered: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  "Vehicle Changed": "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30",
  Detained: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
  Overdue: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30",
  Completed: "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30",
};

const THEME_COLORS = ["#1e40af", "#d97706", "#059669", "#e11d48", "#7c3aed", "#0891b2", "#ea580c", "#475569"];
const PIE_COLORS = ["#1e40af", "#d97706", "#059669", "#e11d48", "#7c3aed"];

// ============================================================================
// Sub-Components
// ============================================================================
function EWBStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("ewb-badge-shimmer inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ewb-transition", EWB_STATUS_COLORS[status] || EWB_STATUS_COLORS["Active"])}>
      {status}
    </span>
  );
}

function ValidityTimer({ expiryDate, status }: { expiryDate: string; status: string }) {
  const [now, setNow] = useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, new Date(expiryDate).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);

  if (status === "Expired" || status === "Cancelled" || status === "Rejected") {
    return <span className="text-red-600 dark:text-red-400 text-xs font-mono">—</span>;
  }

  const colorClass = days >= 7 ? "text-emerald-600 dark:text-emerald-400" : days >= 3 ? "text-amber-600 dark:text-amber-400" : days >= 1 ? "text-orange-600 dark:text-orange-400" : "ewb-pulse-red text-red-600 dark:text-red-400";

  return (
    <span className={cn("font-mono text-xs tabular-nums", colorClass)}>
      {days}d {hours}h
    </span>
  );
}

function StateCodeBadge({ name, code }: { name: string; code: string }) {
  return (
    <span className="ewb-transition inline-flex items-center gap-1 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
      <span>{code}</span>
      <span className="hidden sm:inline">{name.slice(0, 8)}</span>
    </span>
  );
}

function DistanceIndicator({ distance }: { distance: number }) {
  const label = distance < 100 ? "Short" : distance < 300 ? "Medium" : distance < 500 ? "Long" : "X-Long";
  const pct = Math.min(100, (distance / 2500) * 100);
  const color = distance < 100 ? "bg-emerald-500" : distance < 300 ? "bg-amber-500" : distance < 500 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full ewb-fill-bar", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-muted-foreground">{label} ({distance}km)</span>
    </div>
  );
}

function EWBNumberDisplay({ number }: { number: string }) {
  const stateCode = number.slice(0, 2);
  const rest = number.slice(2);
  return (
    <span className="font-mono text-xs sm:text-sm">
      <span className="rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-1 py-0.5 font-bold">{stateCode}</span>
      <span className="text-muted-foreground">{rest.slice(0, 5)}</span>
      <span className="text-foreground font-bold">{rest.slice(5)}</span>
    </span>
  );
}

function VehiclePlateBadge({ plate, regState }: { plate: string; regState: string }) {
  return (
    <span className="ewb-plate-glow ewb-transition inline-flex items-center rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 font-mono text-sm font-bold tracking-wider text-amber-800 dark:text-amber-300">
      {plate}
    </span>
  );
}

function RouteProgressTracker({ currentCheckpoint, checkpointStatuses }: { currentCheckpoint: number; checkpointStatuses: readonly string[] }) {
  return (
    <div className="flex items-center gap-1 w-full py-2">
      {checkpointStatuses.map((cp, idx) => (
        <React.Fragment key={idx}>
          <div className={cn(
            "ewb-checkpoint-appear flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0",
            idx <= currentCheckpoint
              ? "bg-emerald-500 text-white shadow-[0_0_8px_rgba(5,150,105,0.5)]"
              : "bg-muted text-muted-foreground"
          )} style={{ animationDelay: `${idx * 120}ms` }}>
            {idx <= currentCheckpoint ? "✓" : idx + 1}
          </div>
          {idx < checkpointStatuses.length - 1 && (
            <div className={cn("flex-1 h-0.5 rounded ewb-fill-bar", idx < currentCheckpoint ? "bg-emerald-400" : "bg-muted")} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function CheckpointBadge({ status, index }: { status: string; index: number }) {
  return (
    <span className={cn(
      "ewb-checkpoint-appear inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ewb-transition",
      index <= parseInt(status)
        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
        : "border-muted bg-muted text-muted-foreground"
    )}>
      {status}
    </span>
  );
}

function VehicleChangeIndicator({ oldPlate }: { oldPlate: string | null }) {
  if (!oldPlate) return null;
  return (
    <span className="ewb-badge-shimmer inline-flex items-center gap-1 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-400">
      <ArrowRight className="w-3 h-3" />
      Changed
    </span>
  );
}

function ReturnStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("ewb-badge-shimmer inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ewb-transition", FILING_STATUS_COLORS[status] || FILING_STATUS_COLORS["Not Filed"])}>
      {status}
    </span>
  );
}

function FilingCalendarTile({ returns }: { returns: Data["gstReturns"] }) {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  return (
    <div className="grid grid-cols-4 gap-1">
      {months.map((m, i) => {
        const monthReturns = returns.filter(r => r.month === (i < 9 ? i + 4 : i - 8));
        const hasFiled = monthReturns.some(r => ["Filed", "Processed", "Acknowledged"].includes(r.status));
        const hasPending = monthReturns.some(r => ["Draft", "Submitted"].includes(r.status));
        const hasOverdue = monthReturns.some(r => r.status === "Not Filed" && i < 9);
        const bgClass = hasFiled ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
          : hasOverdue ? "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700"
            : hasPending ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
              : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700";
        return (
          <div key={m} className={cn("ewb-calendar-cell rounded border p-1.5 text-center text-[10px] font-semibold", bgClass)}>
            {m}
          </div>
        );
      })}
    </div>
  );
}

function GSTINBadge({ gstin }: { gstin: string }) {
  const stateCode = gstin.slice(0, 2);
  return (
    <span className="font-mono text-xs">
      <span className="rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 font-bold">{stateCode}</span>
      <span className="text-muted-foreground">{gstin.slice(2, 7)}</span>
      <span className="font-bold">{gstin.slice(7)}</span>
    </span>
  );
}

function DueDateIndicator({ dueDate, status }: { dueDate: string; status: string }) {
  const daysLeft = Math.max(0, Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000));
  if (["Filed", "Processed", "Acknowledged"].includes(status)) {
    return <span className="text-emerald-600 dark:text-emerald-400 text-xs">✓ Filed</span>;
  }
  const colorClass = daysLeft > 7 ? "text-sky-600 dark:text-sky-400" : daysLeft > 0 ? "text-amber-600 dark:text-amber-400" : "ewb-pulse-red text-red-600 dark:text-red-400";
  return <span className={cn("text-xs font-semibold", colorClass)}>{daysLeft === 0 ? "Today" : daysLeft > 0 ? `${daysLeft}d left` : "Overdue"}</span>;
}

function TaxBreakdownTile({ cgst, sgst, igst, cess }: { cgst: number; sgst: number; igst: number; cess: number }) {
  const items = [
    { label: "CGST", val: cgst, color: "text-blue-600 dark:text-blue-400" },
    { label: "SGST", val: sgst, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "IGST", val: igst, color: "text-amber-600 dark:text-amber-400" },
    { label: "Cess", val: cess, color: "text-rose-600 dark:text-rose-400" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(it => (
        <div key={it.label} className="rounded-lg bg-muted/50 p-2">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{it.label}</div>
          <div className={cn("text-sm font-bold tabular-nums", it.color)}>{formatINR(it.val)}</div>
        </div>
      ))}
    </div>
  );
}

function ITCStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("ewb-badge-shimmer inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ewb-transition", ITC_STATUS_COLORS[status] || ITC_STATUS_COLORS["Pending"])}>
      {status}
    </span>
  );
}

function MatchPercentageBar({ pct }: { pct: number }) {
  const colorClass = pct === 100 ? "bg-emerald-500" : pct >= 80 ? "bg-cyan-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-24 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full ewb-fill-bar", colorClass)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-xs font-bold tabular-nums", pct === 100 ? "text-emerald-600 dark:text-emerald-400" : pct >= 80 ? "text-cyan-600 dark:text-cyan-400" : pct >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>{pct}%</span>
    </div>
  );
}

function MismatchReasonBadge({ reason }: { reason: string | null }) {
  if (!reason) return <span className="text-muted-foreground text-xs">—</span>;
  const severity = ["Value Difference", "Tax Rate Mismatch", "Duplicate Claim"].includes(reason) ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
    : ["Ineligible ITC", "Section 16(4) Time Bar"].includes(reason) ? "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400"
      : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400";
  return (
    <span className={cn("ewb-badge-shimmer inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold", severity)}>
      {reason}
    </span>
  );
}

function ITCAmountTile({ total, claimed, reversed }: { total: number; claimed: number; reversed: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Total ITC</span>
        <span className="font-bold tabular-nums">{formatINR(total)}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-emerald-600 dark:text-emerald-400">Claimed</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">{formatINR(claimed)}</span>
      </div>
      {reversed > 0 && (
        <div className="flex justify-between text-xs">
          <span className="text-red-600 dark:text-red-400">Reversed</span>
          <span className="text-red-600 dark:text-red-400 font-bold tabular-nums">{formatINR(reversed)}</span>
        </div>
      )}
    </div>
  );
}

function Section16Timer({ daysLeft }: { daysLeft: number }) {
  const colorClass = daysLeft > 90 ? "text-emerald-600 dark:text-emerald-400" : daysLeft > 30 ? "text-amber-600 dark:text-amber-400" : daysLeft > 0 ? "ewb-pulse-red text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400";
  return (
    <div className={cn("rounded-lg bg-muted/50 p-2 text-center", daysLeft <= 30 && daysLeft > 0 && "ring-1 ring-red-200 dark:ring-red-800")}>
      <div className="text-[10px] text-muted-foreground uppercase">Sec 16(4) Timer</div>
      <div className={cn("text-lg font-bold tabular-nums ewb-countdown", colorClass)}>{daysLeft > 0 ? `${daysLeft}d` : "Expired"}</div>
    </div>
  );
}

// ============================================================================
// Sort Header
// ============================================================================
function SortHeader({ label, sortKey, sortDir, onSort }: { label: string; sortKey: string; sortDir: string | null; onSort: (k: string) => void }) {
  return (
    <button onClick={() => onSort(sortKey)} className="ewb-sort-head flex items-center gap-1 text-xs font-semibold uppercase tracking-wide hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
      {label}
      {sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : sortDir === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3 text-muted-foreground" />}
    </button>
  );
}

// ============================================================================
// Main Component
// ============================================================================
export default function EWayBillGSTComplianceView() {
  const { toast } = useToast();
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState("0");
  const [ewbSearch, setEwbSearch] = useState("");
  const [ewbStatusFilter, setEwbStatusFilter] = useState("All");
  const [vmSearch, setVmSearch] = useState("");
  const [gstSearch, setGstSearch] = useState("");
  const [gstTypeFilter, setGstTypeFilter] = useState("All");
  const [itcSearch, setItcSearch] = useState("");
  const [itcStatusFilter, setItcStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<any>(null);

  const handleSort = useCallback((key: string) => {
    setSortDir(prev => prev === "asc" && sortKey === key ? "desc" : "asc");
    setSortKey(key);
  }, [sortKey]);

  // ---- Tab 0: Dashboard ----
  const kpis = [
    { label: "Active E-Way Bills", value: data.activeBills, icon: FileText, color: "border-l-emerald-500", iconColor: "text-emerald-600 dark:text-emerald-400" },
    { label: "Expiring Today", value: data.expiringToday, icon: Timer, color: "border-l-amber-500", iconColor: "text-amber-600 dark:text-amber-400" },
    { label: "Expired Last 7 Days", value: data.expiredLast7, icon: AlertTriangle, color: "border-l-red-500", iconColor: "text-red-600 dark:text-red-400" },
    { label: "Bills Generated Today", value: data.generatedToday, icon: TrendingUp, color: "border-l-blue-500", iconColor: "text-blue-600 dark:text-blue-400" },
    { label: "Avg Validity Days", value: data.avgValidity, icon: Clock, color: "border-l-violet-500", iconColor: "text-violet-600 dark:text-violet-400" },
    { label: "Compliance Rate %", value: `${data.complianceRate}%`, icon: ShieldCheck, color: "border-l-teal-500", iconColor: "text-teal-600 dark:text-teal-400" },
    { label: "Pending Extensions", value: data.pendingExtensions, icon: RotateCcw, color: "border-l-orange-500", iconColor: "text-orange-600 dark:text-orange-400" },
    { label: "Total GST Liability", value: formatINR(data.totalGstLiability), icon: IndianRupee, color: "border-l-rose-500", iconColor: "text-rose-600 dark:text-rose-400" },
  ];

  // ---- Filtered & Sorted Lists ----
  const filteredEWB = useMemo(() => {
    let list = data.ewbBills;
    if (ewbSearch) list = list.filter(b => b.ewbNumber.toLowerCase().includes(ewbSearch.toLowerCase()) || b.fromState.toLowerCase().includes(ewbSearch.toLowerCase()) || b.toState.toLowerCase().includes(ewbSearch.toLowerCase()));
    if (ewbStatusFilter !== "All") list = list.filter(b => b.status === ewbStatusFilter);
    if (sortKey && sortDir) {
      list = [...list].sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        const cmp = typeof aVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [data.ewbBills, ewbSearch, ewbStatusFilter, sortKey, sortDir]);

  const filteredVM = useMemo(() => {
    let list = data.vehicleMappings;
    if (vmSearch) list = list.filter(v => v.vehiclePlate.toLowerCase().includes(vmSearch.toLowerCase()) || v.ewbNumber.toLowerCase().includes(vmSearch.toLowerCase()));
    return list;
  }, [data.vehicleMappings, vmSearch]);

  const filteredGST = useMemo(() => {
    let list = data.gstReturns;
    if (gstSearch) list = list.filter(r => r.gstin.toLowerCase().includes(gstSearch.toLowerCase()));
    if (gstTypeFilter !== "All") list = list.filter(r => r.returnType === gstTypeFilter);
    if (sortKey && sortDir) {
      list = [...list].sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        const cmp = typeof aVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [data.gstReturns, gstSearch, gstTypeFilter, sortKey, sortDir]);

  const filteredITC = useMemo(() => {
    let list = data.itcRecords;
    if (itcSearch) list = list.filter(r => r.supplierGSTIN.toLowerCase().includes(itcSearch.toLowerCase()) || r.supplierName.toLowerCase().includes(itcSearch.toLowerCase()));
    if (itcStatusFilter !== "All") list = list.filter(r => r.status === itcStatusFilter);
    if (sortKey && sortDir) {
      list = [...list].sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        const cmp = typeof aVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [data.itcRecords, itcSearch, itcStatusFilter, sortKey, sortDir]);

  // ---- Analytics KPIs ----
  const analyticsKpis = [
    { label: "E-Way Bill Compliance", value: `${data.complianceRate}%`, icon: ShieldCheck, color: "border-l-emerald-500" },
    { label: "GST Filing Rate", value: `${(82 + parseFloat(data.complianceRate) * 0.1).toFixed(1)}%`, icon: FileText, color: "border-l-blue-500" },
    { label: "ITC Match Rate", value: `${(78 + parseFloat(data.complianceRate) * 0.12).toFixed(1)}%`, icon: Activity, color: "border-l-teal-500" },
    { label: "Total GST Paid", value: formatINR(data.totalGstLiability * 1.5), icon: IndianRupee, color: "border-l-amber-500" },
    { label: "Penalty Paid", value: formatINR(245000), icon: Gavel, color: "border-l-red-500" },
    { label: "Notices Received", value: "12", icon: AlertTriangle, color: "border-l-orange-500" },
    { label: "Risk Score", value: `${(15 + parseFloat(data.complianceRate) * 0.7).toFixed(0)}/100`, icon: ShieldAlert, color: "border-l-rose-500" },
    { label: "Avg Processing Days", value: "3.2", icon: Clock, color: "border-l-violet-500" },
  ];

  // ---- Drawers ----
  const openDrawer = useCallback((record: any) => {
    setDrawerRecord(record);
    setDrawerOpen(true);
  }, []);

  return (
    <div className="ewb-root space-y-4">
      <PageHeader title="E-Way Bill & GST Compliance" description="Indian logistics compliance management with e-way bill tracking, GST filing, and ITC reconciliation" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ewb-tab-list flex w-full overflow-x-auto">
          <TabsTrigger value="0" className="ewb-tab-trigger min-w-[120px]">Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="ewb-tab-trigger min-w-[120px]">E-Way Bills</TabsTrigger>
          <TabsTrigger value="2" className="ewb-tab-trigger min-w-[120px]">Vehicle Map</TabsTrigger>
          <TabsTrigger value="3" className="ewb-tab-trigger min-w-[120px]">GST Returns</TabsTrigger>
          <TabsTrigger value="4" className="ewb-tab-trigger min-w-[120px]">ITC Reconcile</TabsTrigger>
          <TabsTrigger value="5" className="ewb-tab-trigger min-w-[120px]">Analytics</TabsTrigger>
        </TabsList>

        {/* ==================== TAB 0: Dashboard ==================== */}
        <TabsContent value="0" className="ewb-tab-content space-y-4 mt-4">
          <div className="ewb-kpi-grid grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpis.map((kpi, i) => (
              <Card key={i} className={cn("ewb-kpi-card border-l-4", kpi.color)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                      <p className="text-xl font-bold tabular-nums ewb-counter">{kpi.value}</p>
                    </div>
                    <kpi.icon className={cn("w-5 h-5 opacity-60", kpi.iconColor)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Monthly E-Way Bill Generation Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="Generated" stackId="1" stroke="#1e40af" fill="#1e40af" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="Extended" stackId="1" stroke="#d97706" fill="#d97706" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="Cancelled" stackId="1" stroke="#e11d48" fill="#e11d48" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="Expired" stackId="1" stroke="#475569" fill="#475569" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">E-Way Bill Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.statusDistribution} cx="50%" cy="50%" outerRadius={90} innerRadius={45} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {data.statusDistribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Top 10 Transporters by Bill Count</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.topTransporters} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#1e40af" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Distance-Wise Validity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.distanceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== TAB 1: E-Way Bill Register ==================== */}
        <TabsContent value="1" className="ewb-tab-content space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search EWB number, state..." value={ewbSearch} onChange={e => setEwbSearch(e.target.value)} className="pl-9" />
            </div>
            <select value={ewbStatusFilter} onChange={e => setEwbStatusFilter(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
              <option value="All">All Statuses</option>
              {data.ewbBills.some(b => b.status === "Active") && <option>Active</option>}
              <option>Valid</option><option>Expired</option><option>Cancelled</option><option>Extended</option><option>Transferred</option><option>Suspended</option><option>Rejected</option>
            </select>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="max-h-[520px] overflow-y-auto ewb-scrollbar">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background/95 backdrop-blur z-10">
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left"><SortHeader label="EWB #" sortKey="ewbNumber" sortDir={sortKey === "ewbNumber" ? sortDir : null} onSort={handleSort} /></th>
                    <th className="px-3 py-2 text-left"><SortHeader label="Date" sortKey="date" sortDir={sortKey === "date" ? sortDir : null} onSort={handleSort} /></th>
                    <th className="px-3 py-2 text-left hidden md:table-cell">From</th>
                    <th className="px-3 py-2 text-left hidden md:table-cell">To</th>
                    <th className="px-3 py-2 text-left hidden lg:table-cell">Supply Type</th>
                    <th className="px-3 py-2 text-left hidden lg:table-cell">Transport</th>
                    <th className="px-3 py-2 text-right"><SortHeader label="Value" sortKey="value" sortDir={sortKey === "value" ? sortDir : null} onSort={handleSort} /></th>
                    <th className="px-3 py-2 text-center">Validity</th>
                    <th className="px-3 py-2 text-center">Status</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEWB.map((bill, idx) => (
                    <tr key={bill.id} className={cn("ewb-ewb-row ewb-row-stripe border-b transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/20", idx % 2 === 1 && "bg-muted/30")}>
                      <td className="px-3 py-2"><EWBNumberDisplay number={bill.ewbNumber} /></td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{bill.date}</td>
                      <td className="px-3 py-2 hidden md:table-cell"><StateCodeBadge name={bill.fromState} code={bill.fromCode} /></td>
                      <td className="px-3 py-2 hidden md:table-cell"><StateCodeBadge name={bill.toState} code={bill.toCode} /></td>
                      <td className="px-3 py-2 text-xs hidden lg:table-cell">{bill.supplyType}</td>
                      <td className="px-3 py-2 text-xs hidden lg:table-cell">{bill.transportMode}</td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">{formatINR(bill.value)}</td>
                      <td className="px-3 py-2 text-center"><ValidityTimer expiryDate={bill.expiryDate} status={bill.status} /></td>
                      <td className="px-3 py-2 text-center"><EWBStatusBadge status={bill.status} /></td>
                      <td className="px-3 py-2 text-center">
                        <Button variant="ghost" size="icon" className="ewb-action-btn h-7 w-7" onClick={() => openDrawer(bill)}>
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

        {/* ==================== TAB 2: Vehicle Mapping ==================== */}
        <TabsContent value="2" className="ewb-tab-content space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search vehicle plate or EWB number..." value={vmSearch} onChange={e => setVmSearch(e.target.value)} className="pl-9" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredVM.map((vm, idx) => (
              <Card key={vm.id} className={cn("ewb-vm-card ewb-row-stripe", idx % 2 === 1 && "bg-muted/20")}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <VehiclePlateBadge plate={vm.vehiclePlate} regState={vm.regState} />
                    <VehicleChangeIndicator oldPlate={vm.oldVehiclePlate} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">EWB: </span>
                    <span className="font-mono text-[11px]">{vm.ewbNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>{vm.fromCity}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    <span>{vm.toCity}</span>
                  </div>
                  <RouteProgressTracker currentCheckpoint={vm.currentCheckpoint} checkpointStatuses={data.checkpointStatuses} />
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-muted-foreground">Type:</span> {vm.vehicleType}</div>
                    <div><span className="text-muted-foreground">Driver:</span> {vm.driverName}</div>
                    <div><span className="text-muted-foreground">ETA:</span> {vm.eta}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold", VEHICLE_STATUS_COLORS[vm.status] || "")}>{vm.status}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ewb-action-btn w-full text-xs" onClick={() => openDrawer(vm)}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ==================== TAB 3: GST Return Tracker ==================== */}
        <TabsContent value="3" className="ewb-tab-content space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search GSTIN..." value={gstSearch} onChange={e => setGstSearch(e.target.value)} className="pl-9" />
            </div>
            <select value={gstTypeFilter} onChange={e => setGstTypeFilter(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
              <option value="All">All Return Types</option>
              {data.gstReturns.filter((v, i, a) => a.findIndex(t => t.returnType === v.returnType) === i).map(r => (
                <option key={r.returnType} value={r.returnType}>{r.returnType}</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="max-h-[520px] overflow-y-auto ewb-scrollbar">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background/95 backdrop-blur z-10">
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left">Return Type</th>
                    <th className="px-3 py-2 text-left hidden md:table-cell">GSTIN</th>
                    <th className="px-3 py-2 text-left">Period</th>
                    <th className="px-3 py-2 text-right"><SortHeader label="Tax (₹)" sortKey="totalTax" sortDir={sortKey === "totalTax" ? sortDir : null} onSort={handleSort} /></th>
                    <th className="px-3 py-2 text-left hidden lg:table-cell">State</th>
                    <th className="px-3 py-2 text-center">Due</th>
                    <th className="px-3 py-2 text-center">Status</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGST.map((ret, idx) => (
                    <tr key={ret.id} className={cn("ewb-gst-row ewb-row-stripe border-b transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20", idx % 2 === 1 && "bg-muted/30")}>
                      <td className="px-3 py-2 text-xs font-semibold">{ret.returnType}</td>
                      <td className="px-3 py-2 hidden md:table-cell"><GSTINBadge gstin={ret.gstin} /></td>
                      <td className="px-3 py-2 text-xs">{ret.period}</td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">{formatINR(ret.totalTax)}</td>
                      <td className="px-3 py-2 text-xs hidden lg:table-cell">{ret.stateName}</td>
                      <td className="px-3 py-2 text-center"><DueDateIndicator dueDate={ret.dueDate} status={ret.status} /></td>
                      <td className="px-3 py-2 text-center"><ReturnStatusBadge status={ret.status} /></td>
                      <td className="px-3 py-2 text-center">
                        <Button variant="ghost" size="icon" className="ewb-action-btn h-7 w-7" onClick={() => openDrawer(ret)}>
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

        {/* ==================== TAB 4: ITC Reconciliation ==================== */}
        <TabsContent value="4" className="ewb-tab-content space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search supplier GSTIN..." value={itcSearch} onChange={e => setItcSearch(e.target.value)} className="pl-9" />
            </div>
            <select value={itcStatusFilter} onChange={e => setItcStatusFilter(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
              <option value="All">All Statuses</option>
              <option>Matched</option><option>Partially Matched</option><option>Mismatched</option><option>Pending</option><option>Claimed</option><option>Reversed</option><option>Blocked</option><option>Carry Forward</option>
            </select>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="max-h-[520px] overflow-y-auto ewb-scrollbar">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background/95 backdrop-blur z-10">
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left">Supplier</th>
                    <th className="px-3 py-2 text-left hidden md:table-cell">GSTIN</th>
                    <th className="px-3 py-2 text-left hidden lg:table-cell">Invoice</th>
                    <th className="px-3 py-2 text-center">Match</th>
                    <th className="px-3 py-2 text-right"><SortHeader label="Total ITC" sortKey="totalITC" sortDir={sortKey === "totalITC" ? sortDir : null} onSort={handleSort} /></th>
                    <th className="px-3 py-2 text-left hidden lg:table-cell">Reason</th>
                    <th className="px-3 py-2 text-center">Sec 16(4)</th>
                    <th className="px-3 py-2 text-center">Status</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredITC.map((rec, idx) => (
                    <tr key={rec.id} className={cn("ewb-itc-row ewb-row-stripe border-b transition-colors hover:bg-rose-50/50 dark:hover:bg-rose-950/20", idx % 2 === 1 && "bg-muted/30")}>
                      <td className="px-3 py-2 text-xs font-medium">{rec.supplierName}</td>
                      <td className="px-3 py-2 hidden md:table-cell"><GSTINBadge gstin={rec.supplierGSTIN} /></td>
                      <td className="px-3 py-2 text-xs font-mono hidden lg:table-cell">{rec.invoiceNumber}</td>
                      <td className="px-3 py-2 text-center"><MatchPercentageBar pct={rec.matchPct} /></td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">{formatINR(rec.totalITC)}</td>
                      <td className="px-3 py-2 hidden lg:table-cell"><MismatchReasonBadge reason={rec.mismatchReason} /></td>
                      <td className="px-3 py-2 text-center text-[11px] font-mono tabular-nums">{rec.section16DaysLeft}d</td>
                      <td className="px-3 py-2 text-center"><ITCStatusBadge status={rec.status} /></td>
                      <td className="px-3 py-2 text-center">
                        <Button variant="ghost" size="icon" className="ewb-action-btn h-7 w-7" onClick={() => openDrawer(rec)}>
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

        {/* ==================== TAB 5: Compliance Analytics ==================== */}
        <TabsContent value="5" className="ewb-tab-content space-y-4 mt-4">
          <div className="ewb-kpi-grid grid grid-cols-2 gap-3 lg:grid-cols-4">
            {analyticsKpis.map((kpi, i) => (
              <Card key={i} className={cn("ewb-analytics-card border-l-4", kpi.color)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                      <p className="text-xl font-bold tabular-nums ewb-counter">{kpi.value}</p>
                    </div>
                    <kpi.icon className="w-5 h-5 text-muted-foreground opacity-50" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Monthly E-Way Bill Compliance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.complianceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="rate" stroke="#1e40af" strokeWidth={2} dot={{ r: 3 }} name="Compliance %" />
                    <Line type="monotone" dataKey="target" stroke="#e11d48" strokeWidth={2} strokeDasharray="8 4" dot={false} name="Target %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">State-Wise Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.stateWiseCompliance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="state" tick={{ fontSize: 10 }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="compliance" name="Compliance %" radius={[4, 4, 0, 0]}>
                      {data.stateWiseCompliance.map((entry, i) => (
                        <Cell key={i} fill={entry.compliance >= 90 ? "#059669" : entry.compliance >= 80 ? "#d97706" : "#e11d48"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">GST Return Filing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.filingStatusPie} cx="50%" cy="50%" outerRadius={90} innerRadius={45} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {data.filingStatusPie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Monthly Penalty Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.penaltyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Late Fee" stackId="a" fill="#1e40af" />
                    <Bar dataKey="Interest" stackId="a" fill="#d97706" />
                    <Bar dataKey="Penalty" stackId="a" fill="#e11d48" />
                    <Bar dataKey="Other" stackId="a" fill="#475569" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">ITC Reconciliation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.itcStatusPie} cx="50%" cy="50%" outerRadius={90} innerRadius={45} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {data.itcStatusPie.map((_, i) => (
                        <Cell key={i} fill={THEME_COLORS[i % THEME_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Risk Score by Quarter</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.riskScoreQuarterly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="score" stroke="#e11d48" strokeWidth={3} dot={{ r: 4 }} name="Risk Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ==================== DRAWERS ==================== */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="ewb-drawer w-[420px] sm:w-[500px] overflow-y-auto">
          <>
            <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <SheetTitle className="text-base">
                {drawerRecord?.ewbNumber ? `E-Way Bill ${drawerRecord.ewbNumber}` :
                  drawerRecord?.vehiclePlate ? `Vehicle ${drawerRecord.vehiclePlate}` :
                    drawerRecord?.returnType ? `${drawerRecord.returnType}` :
                      drawerRecord?.supplierName ? `ITC: ${drawerRecord.supplierName}` :
                        "Details"}
              </SheetTitle>
            </SheetHeader>

            <div className="p-4 space-y-4">
              {/* EWB Drawer */}
              {drawerRecord?.ewbNumber && (
                <>
                  <div className="flex items-center gap-3">
                    <EWBStatusBadge status={drawerRecord.status} />
                    <ValidityTimer expiryDate={drawerRecord.expiryDate} status={drawerRecord.status} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StateCodeBadge name={drawerRecord.fromState} code={drawerRecord.fromCode} />
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <StateCodeBadge name={drawerRecord.toState} code={drawerRecord.toCode} />
                  </div>
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase">Invoice Value</div>
                        <div className="text-lg font-bold tabular-nums">{formatINR(drawerRecord.value)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-muted-foreground uppercase">Distance</div>
                        <div className="text-sm font-semibold">{drawerRecord.distance} km</div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Supply Type</span><div className="font-medium">{drawerRecord.supplyType}</div></div>
                    <div><span className="text-muted-foreground">Transport Mode</span><div className="font-medium">{drawerRecord.transportMode}</div></div>
                    <div><span className="text-muted-foreground">Transporter</span><div className="font-medium">{drawerRecord.transporter}</div></div>
                    <div><span className="text-muted-foreground">Goods</span><div className="font-medium">{drawerRecord.goodsDescription}</div></div>
                    <div><span className="text-muted-foreground">GSTIN</span><div className="font-mono">{drawerRecord.gstin}</div></div>
                    <div><span className="text-muted-foreground">Created</span><div className="font-medium">{drawerRecord.date}</div></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Valid Until</span><div className="font-medium">{drawerRecord.expiryDate}</div></div>
                  </div>
                  <DistanceIndicator distance={drawerRecord.distance} />
                  <div className="flex gap-2">
                    <Button size="sm" className="ewb-action-btn flex-1" onClick={() => { toast.success("E-Way Bill Extended", `${drawerRecord.ewbNumber} validity extended by 3 days`); setDrawerOpen(false); }}><RotateCcw className="w-3.5 h-3.5 mr-1" /> Extend</Button>
                    <Button size="sm" variant="outline" className="ewb-action-btn flex-1" onClick={() => { toast.success("E-Way Bill Cancelled", `${drawerRecord.ewbNumber} has been cancelled`); setDrawerOpen(false); }}><XCircle className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                    <Button size="sm" variant="outline" className="ewb-action-btn" onClick={() => toast.info("Printing E-Way Bill", `Generating PDF for ${drawerRecord.ewbNumber}`)}><Printer className="w-3.5 h-3.5" /></Button>
                  </div>
                </>
              )}

              {/* Vehicle Drawer */}
              {drawerRecord?.vehiclePlate && (
                <>
                  <div className="flex items-center gap-3">
                    <VehiclePlateBadge plate={drawerRecord.vehiclePlate} regState={drawerRecord.regState} />
                    {drawerRecord.oldVehiclePlate && <VehicleChangeIndicator oldPlate={drawerRecord.oldVehiclePlate} />}
                  </div>
                  <RouteProgressTracker currentCheckpoint={drawerRecord.currentCheckpoint} checkpointStatuses={data.checkpointStatuses} />
                  <div className="flex flex-wrap gap-1">
                    {data.checkpointStatuses.map((cp, i) => (
                      <CheckpointBadge key={i} status={String(drawerRecord.currentCheckpoint)} index={i} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">EWB Number</span><div className="font-mono">{drawerRecord.ewbNumber}</div></div>
                    <div><span className="text-muted-foreground">Vehicle Type</span><div className="font-medium">{drawerRecord.vehicleType}</div></div>
                    <div><span className="text-muted-foreground">Driver</span><div className="font-medium">{drawerRecord.driverName}</div></div>
                    <div><span className="text-muted-foreground">Phone</span><div className="font-mono">{drawerRecord.driverPhone}</div></div>
                    <div><span className="text-muted-foreground">Route</span><div className="font-medium">{drawerRecord.fromCity} → {drawerRecord.toCity}</div></div>
                    <div><span className="text-muted-foreground">ETA</span><div className="font-medium">{drawerRecord.eta}</div></div>
                    <div><span className="text-muted-foreground">Assigned</span><div className="font-medium">{drawerRecord.assignedDate}</div></div>
                    <div><span className="text-muted-foreground">Status</span><div className="font-medium">{drawerRecord.status}</div></div>
                  </div>
                  {drawerRecord.oldVehiclePlate && (
                    <div className="rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 p-2 text-xs">
                      <span className="text-muted-foreground">Vehicle changed from:</span>
                      <span className="font-mono font-bold ml-1">{drawerRecord.oldVehiclePlate}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" className="ewb-action-btn flex-1" onClick={() => { toast.success("Vehicle Reassigned", `${drawerRecord.vehiclePlate} has been reassigned`); setDrawerOpen(false); }}><RefreshCw className="w-3.5 h-3.5 mr-1" /> Reassign</Button>
                    <Button size="sm" variant="outline" className="ewb-action-btn flex-1" onClick={() => toast.info("Report Filed", `Incident report for ${drawerRecord.vehiclePlate}`)}><FileText className="w-3.5 h-3.5 mr-1" /> Report</Button>
                    <Button size="sm" variant="outline" className="ewb-action-btn" onClick={() => { toast.success("Marked Complete", `${drawerRecord.vehiclePlate} delivery completed`); setDrawerOpen(false); }}><CheckCircle2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </>
              )}

              {/* GST Return Drawer */}
              {drawerRecord?.returnType && (
                <>
                  <div className="flex items-center gap-3">
                    <ReturnStatusBadge status={drawerRecord.status} />
                    <DueDateIndicator dueDate={drawerRecord.dueDate} status={drawerRecord.status} />
                  </div>
                  <FilingCalendarTile returns={data.gstReturns} />
                  <GSTINBadge gstin={drawerRecord.gstin} />
                  <TaxBreakdownTile cgst={drawerRecord.cgst} sgst={drawerRecord.sgst} igst={drawerRecord.igst} cess={drawerRecord.cess} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Return Type</span><div className="font-medium">{drawerRecord.returnType}</div></div>
                    <div><span className="text-muted-foreground">FY</span><div className="font-medium">{drawerRecord.fy}</div></div>
                    <div><span className="text-muted-foreground">Period</span><div className="font-medium">{drawerRecord.period}</div></div>
                    <div><span className="text-muted-foreground">State</span><div className="font-medium">{drawerRecord.stateName}</div></div>
                    <div><span className="text-muted-foreground">Total Tax</span><div className="font-bold tabular-nums">{formatINR(drawerRecord.totalTax)}</div></div>
                    <div><span className="text-muted-foreground">Filing Date</span><div className="font-medium">{drawerRecord.filingDate || "—"}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="ewb-action-btn flex-1" onClick={() => { toast.success("Return Filed", `${drawerRecord.returnType} for ${drawerRecord.period}`); setDrawerOpen(false); }}><FileUp className="w-3.5 h-3.5 mr-1" /> File</Button>
                    <Button size="sm" variant="outline" className="ewb-action-btn flex-1" onClick={() => toast.info("Downloaded", `${drawerRecord.returnType} PDF downloaded`)}><FileDown className="w-3.5 h-3.5 mr-1" /> Download</Button>
                    <Button size="sm" variant="outline" className="ewb-action-btn" onClick={() => toast.info("Revision Started", `Opening revision for ${drawerRecord.returnType}`)}><RefreshCw className="w-3.5 h-3.5" /></Button>
                  </div>
                </>
              )}

              {/* ITC Drawer */}
              {drawerRecord?.supplierName && (
                <>
                  <div className="flex items-center gap-3">
                    <ITCStatusBadge status={drawerRecord.status} />
                    <span className="text-xs text-muted-foreground">{drawerRecord.supplierName}</span>
                  </div>
                  <MatchPercentageBar pct={drawerRecord.matchPct} />
                  <MismatchReasonBadge reason={drawerRecord.mismatchReason} />
                  <ITCAmountTile total={drawerRecord.totalITC} claimed={drawerRecord.claimed} reversed={drawerRecord.reversed} />
                  <Section16Timer daysLeft={drawerRecord.section16DaysLeft} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Supplier GSTIN</span><div className="font-mono">{drawerRecord.supplierGSTIN}</div></div>
                    <div><span className="text-muted-foreground">Invoice</span><div className="font-mono">{drawerRecord.invoiceNumber}</div></div>
                    <div><span className="text-muted-foreground">Invoice Date</span><div className="font-medium">{drawerRecord.invoiceDate}</div></div>
                    <div><span className="text-muted-foreground">Buyer GSTIN</span><div className="font-mono">{drawerRecord.gstin}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="ewb-action-btn flex-1" onClick={() => { toast.success("ITC Accepted", `${drawerRecord.invoiceNumber} ITC accepted`); setDrawerOpen(false); }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept</Button>
                    <Button size="sm" variant="outline" className="ewb-action-btn flex-1" onClick={() => { toast.success("ITC Rejected", `${drawerRecord.invoiceNumber} ITC rejected`); setDrawerOpen(false); }}><XCircle className="w-3.5 h-3.5 mr-1" /> Reject</Button>
                    <Button size="sm" variant="outline" className="ewb-action-btn" onClick={() => toast.warning("Escalated", `${drawerRecord.invoiceNumber} escalated for review`)}><ArrowUp className="w-3.5 h-3.5" /></Button>
                  </div>
                </>
              )}
            </div>
          </>
        </SheetContent>
      </Sheet>
    </div>
  );
}
