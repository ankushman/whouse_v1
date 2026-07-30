"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Search, Eye, X, TrendingUp, TrendingDown, Package, ShieldCheck,
  AlertTriangle, CheckCircle2, Clock, ArrowUpDown, Filter, RefreshCw,
  Printer, QrCode, ScanBarcode, Hash, BarChart3, Activity, Zap,
  Timer, Copy, Archive, RotateCcw, Pause, Ban, ClipboardCheck,
  MapPin, Smartphone, Monitor, Layers, FileText, Download,
  ChevronRight, IndianRupee, Percent, AlertCircle, CircleDot,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { useToast } from "@/hooks/use-toast-helper";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";

// ============================================================================
// Seeded Random & Helpers
// ============================================================================
function seededRandom(seed: number): number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  s = (s * 16807) % 2147483647;
  return (s - 1) / 2147483646;
}

const pick = <T,>(arr: readonly T[], seed: number) =>
  arr[Math.floor(seededRandom(seed) * arr.length)];

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
  let s = 20250701;
  const r = () => { s += 7; return seededRandom(s); };
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;
  const rf = (min: number, max: number) => +(r() * (max - min) + min).toFixed(2);

  const TEMPLATE_TYPES = [
    "Product", "EAN-13", "QR Code", "Shipping", "Pallet", "Return",
    "Hazmat", "Pharma", "Serial", "Batch", "Location", "GS1-128",
  ] as const;
  const TEMPLATE_STATUSES = [
    "Active", "Draft", "Archived", "Under Review", "Deprecated",
    "Published", "Pending Approval", "Retired",
  ] as const;
  const CATEGORIES = [
    "FMCG", "Electronics", "Pharma", "Apparel", "Auto Parts",
    "Food & Bev", "Chemical", "Textile", "Agriculture", "Industrial",
  ] as const;
  const PRINT_STATUSES = [
    "Queued", "Printing", "Processing", "Completed", "Failed",
    "Cancelled", "Paused", "Retrying",
  ] as const;
  const PRINTERS = [
    "HP LaserJet", "Toshiba B-EX", "Zebra ZT411", "Sato CL4NX",
    "Intermec PM43", "Citizen CL-S700", "Dymo LabelWriter",
    "Brother TD", "Epson TM-C", "Aristo 1000",
  ] as const;
  const PAPER_SIZES = [
    "4x6\"", "4x8\"", "2x1\"", "3x2\"", "100x150mm",
    "A4", "A5", "Custom",
  ] as const;
  const PRIORITIES = ["Critical", "High", "Medium", "Low", "Batch"] as const;
  const SCAN_TYPES = [
    "Receiving", "Picking", "Packing", "Shipping", "Inventory",
    "Returns", "Quality", "Audit", "Putaway", "Loading",
  ] as const;
  const SCAN_STATUSES = [
    "Valid", "Invalid", "Duplicate", "Expired", "Not Found",
    "Mismatched", "Blacklisted", "Re-scan",
  ] as const;
  const LOCATIONS = [
    "A1-Receiving", "A2-Staging", "A3-Bulk", "A4-Picking",
    "B1-Packing", "B2-Shipping", "B3-Returns", "B4-QA",
    "C1-Cold", "C2-Hazmat", "C3-High Value", "C4-Overflow",
  ] as const;
  const DEVICES = [
    "Zebra MC9300", "Honeywell CT60", "Datalogic GBT4400",
    "Zebra DS3608", "Socket S700", "Bluebird EF500",
    "Denali 9500R", "Newland FM75", "CipherLab 9700", "Unitech PA700",
  ] as const;
  const STANDARDS = [
    "GS1", "EAN-13", "UPC-A", "QR Code", "Data Matrix",
    "ITF-14", "Code 128", "GS1-128", "Code 39", "Aztec",
  ] as const;
  const COMPLIANCE_STATUSES = [
    "Compliant", "Non-Compliant", "Under Review", "Expiring",
    "Pending", "Deprecated", "Non-Applicable", "Waived",
  ] as const;
  const PRODUCT_CATS = [
    "FMCG", "Electronics", "Pharma", "Apparel", "Auto Parts",
    "Food & Bev", "Chemical", "Textile", "Agriculture",
    "Industrial", "Cosmetics", "Pet Care",
  ] as const;
  const AUDIT_FREQUENCIES = [
    "Weekly", "Bi-Weekly", "Monthly", "Quarterly", "Bi-Annual", "Annual",
  ] as const;

  const INDIAN_PRODUCTS = [
    "Parle-G Biscuits", "Amul Butter", "Tata Salt", "Maggi Noodles",
    "Dabur Chyawanprash", "Britannia Bread", "Haldiram Namkeen",
    "Marico Saffola", "ITC Aashirvaad", "Nestle KitKat",
    "Vim Dishwash", "Surf Excel", "Clinic Plus Shampoo",
    "Colgate Paste", "Fair & Lovely", "Horlicks Malt",
    "Cadbury Dairy Milk", "Lakme Lipstick", "Asian Paints",
    "Bata Shoes", "Raymond Suiting", "Bombay Dyeing",
    "Godrej Locks", "Cello Pens", "VIP Bags",
    "Hero Cycles", "Royal Enfield Parts", "MRF Tyres",
    "Ashok Leyland Filter", "Bosch Spark Plug", "Exide Battery",
    "UPL Pesticide", "Coromandel Fertilizer", "PI Industries Agri",
    "Lupin Pharma", "Cipla Tablets", "Sun Pharma Capsules",
    "Dr Reddys Syrup", "Aurobindo Injection", "Mankind Lozenges",
    "Wipro Laptop", "Boat Earbuds", "Realme Phone",
    "Havells Switch", "Polycab Wire", "Bajaj Mixer",
    "Prestige Cooker", "PHILIPS Trimmer", "Oppo Panel",
  ];

  const CITIES = [
    "Mumbai", "Delhi", "Chennai", "Bangalore", "Hyderabad",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Chandigarh", "Indore",
  ];

  const LABEL_TYPES_8 = [
    "Product", "Shipping", "Pallet", "Return", "QR", "Hazmat", "Pharma", "Location",
  ];

  const TT_COLORS: Record<string, string> = {
    "Product": "#059669", "EAN-13": "#7c3aed", "QR Code": "#0891b2",
    "Shipping": "#d97706", "Pallet": "#475569", "Return": "#e11d48",
    "Hazmat": "#dc2626", "Pharma": "#2563eb", "Serial": "#7c3aed",
    "Batch": "#ca8a04", "Location": "#0891b2", "GS1-128": "#475569",
  };
  const TS_COLORS: Record<string, string> = {
    "Active": "#059669", "Draft": "#6b7280", "Archived": "#475569",
    "Under Review": "#d97706", "Deprecated": "#dc2626", "Published": "#059669",
    "Pending Approval": "#d97706", "Retired": "#6b7280",
  };
  const CAT_COLORS: Record<string, string> = {
    "FMCG": "#059669", "Electronics": "#7c3aed", "Pharma": "#2563eb",
    "Apparel": "#e11d48", "Auto Parts": "#475569", "Food & Bev": "#d97706",
    "Chemical": "#dc2626", "Textile": "#ca8a04", "Agriculture": "#059669",
    "Industrial": "#475569", "Cosmetics": "#e11d48", "Pet Care": "#0891b2",
  };
  const PS_COLORS: Record<string, string> = {
    "Queued": "#6b7280", "Printing": "#0891b2", "Processing": "#d97706",
    "Completed": "#059669", "Failed": "#dc2626", "Cancelled": "#475569",
    "Paused": "#ca8a04", "Retrying": "#7c3aed",
  };
  const PR_COLORS: Record<string, string> = {
    "Critical": "#dc2626", "High": "#e11d48", "Medium": "#d97706",
    "Low": "#059669", "Batch": "#475569",
  };
  const ST_COLORS: Record<string, string> = {
    "Receiving": "#059669", "Picking": "#d97706", "Packing": "#7c3aed",
    "Shipping": "#0891b2", "Inventory": "#475569", "Returns": "#e11d48",
    "Quality": "#2563eb", "Audit": "#ca8a04", "Putaway": "#059669",
    "Loading": "#475569",
  };
  const SS_COLORS: Record<string, string> = {
    "Valid": "#059669", "Invalid": "#dc2626", "Duplicate": "#dc2626",
    "Expired": "#d97706", "Not Found": "#475569", "Mismatched": "#e11d48",
    "Blacklisted": "#1e293b", "Re-scan": "#0891b2",
  };
  const STD_COLORS: Record<string, string> = {
    "GS1": "#059669", "EAN-13": "#7c3aed", "UPC-A": "#d97706",
    "QR Code": "#0891b2", "Data Matrix": "#e11d48", "ITF-14": "#475569",
    "Code 128": "#ca8a04", "GS1-128": "#059669", "Code 39": "#7c3aed",
    "Aztec": "#2563eb",
  };
  const CS_COLORS: Record<string, string> = {
    "Compliant": "#059669", "Non-Compliant": "#dc2626",
    "Under Review": "#d97706", "Expiring": "#ca8a04",
    "Pending": "#6b7280", "Deprecated": "#475569",
    "Non-Applicable": "#0891b2", "Waived": "#7c3aed",
  };

  // --- 60 Templates ---
  const templates = Array.from({ length: 60 }, (_, i) => ({
    id: `TPL-${String(i + 1).padStart(4, "0")}`,
    name: `${pick(TEMPLATE_TYPES, s + i * 3)}-${pick(INDIAN_PRODUCTS, s + i * 3 + 1).split(" ")[0]}-v${ri(1, 5)}`,
    type: pick(TEMPLATE_TYPES, s + i * 3 + 2),
    status: pick(TEMPLATE_STATUSES, s + i * 5),
    category: pick(CATEGORIES, s + i * 7),
    format: pick(["4x6\"", "100x150mm", "3x2\"", "2x1\"", "A5"] as const, s + i * 11),
    printCount: ri(10, 15000),
    lastPrinted: `${ri(1, 28)} Jun 2025`,
    createdBy: `${pick(["Arjun", "Priya", "Rahul", "Sneha", "Vikram"] as const, s + i * 13)} ${pick(["Sharma", "Patel", "Kumar", "Singh", "Gupta"] as const, s + i * 13 + 1)}`,
    createdDate: `${ri(1, 28)} ${pick(["Jan", "Feb", "Mar", "Apr", "May"] as const, s + i * 17)} 2025`,
  }));

  // --- 75 Print Jobs ---
  const printJobs = Array.from({ length: 75 }, (_, i) => ({
    id: `PJ-${String(i + 1).padStart(4, "0")}`,
    templateId: pick(templates, s + i * 3).id,
    labelName: pick(INDIAN_PRODUCTS, s + i * 5),
    status: pick(PRINT_STATUSES, s + i * 7),
    printer: pick(PRINTERS, s + i * 9),
    paperSize: pick(PAPER_SIZES, s + i * 11),
    priority: pick(PRIORITIES, s + i * 13),
    copies: ri(1, 500),
    progress: pick(PRINT_STATUSES, s + i * 15) === "Completed" ? 100 : ri(0, 95),
    submittedAt: `${ri(1, 28)} Jun 2025 ${String(ri(0, 23)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}`,
    cost: rf(0.5, 45),
  }));

  // --- 85 Scan Records ---
  const scanRecords = Array.from({ length: 85 }, (_, i) => ({
    id: `SCN-${String(i + 1).padStart(4, "0")}`,
    barcode: `890${String(ri(1000000000, 9999999999))}`,
    type: pick(SCAN_TYPES, s + i * 3),
    status: pick(SCAN_STATUSES, s + i * 5),
    location: pick(LOCATIONS, s + i * 7),
    device: pick(DEVICES, s + i * 9),
    city: pick(CITIES, s + i * 11),
    scanTime: `${ri(1, 28)} Jun 2025 ${String(ri(0, 23)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}`,
    responseMs: ri(45, 850),
    product: pick(INDIAN_PRODUCTS, s + i * 13),
    operator: `${pick(["Amit", "Kavya", "Rohit", "Divya", "Suresh"] as const, s + i * 17)} ${pick(["Mehta", "Verma", "Reddy", "Iyer", "Nair"] as const, s + i * 17 + 1)}`,
  }));

  // --- 50 Compliance Records ---
  const complianceRecords = Array.from({ length: 50 }, (_, i) => ({
    id: `CMP-${String(i + 1).padStart(4, "0")}`,
    standard: pick(STANDARDS, s + i * 3),
    status: pick(COMPLIANCE_STATUSES, s + i * 5),
    category: pick(PRODUCT_CATS, s + i * 7),
    product: pick(INDIAN_PRODUCTS, s + i * 9),
    score: pick(COMPLIANCE_STATUSES, s + i * 11) === "Non-Compliant" ? ri(20, 55) : ri(70, 100),
    auditFrequency: pick(AUDIT_FREQUENCIES, s + i * 13),
    lastAudit: `${ri(1, 28)} ${pick(["Mar", "Apr", "May", "Jun"] as const, s + i * 17)} 2025`,
    nextAudit: `${ri(1, 28)} ${pick(["Jul", "Aug", "Sep"] as const, s + i * 19)} 2025`,
    auditor: `${pick(["Rajesh", "Meena", "Sunil", "Anita"] as const, s + i * 23)} ${pick(["Joshi", "Rao", "Chopra", "Bhat"] as const, s + i * 23 + 1)}`,
    findings: ri(0, 8),
  }));

  // --- Analytics ---
  const analytics = {
    totalPrinted: 184732,
    errorRate: 2.34,
    avgScanSuccess: 96.7,
    complianceRate: 91.2,
    totalTemplates: 60,
    activePrinters: 8,
    inkEfficiency: 88.5,
    costPerLabel: 1.85,
  };

  const monthlyVolume = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    "Product Labels": ri(8000, 22000),
    "Shipping Labels": ri(5000, 15000),
    "Pallet Labels": ri(2000, 8000),
    "Return Labels": ri(1000, 5000),
  }));

  const printStatusData = [
    { name: "Queued", value: ri(5, 15) },
    { name: "Printing", value: ri(3, 10) },
    { name: "Completed", value: ri(40, 60) },
    { name: "Failed", value: ri(2, 8) },
  ];

  const labelTypeData = LABEL_TYPES_8.map(t => ({ name: t, count: ri(500, 12000) }));

  const dailyVolume30 = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    Product: ri(200, 900),
    Shipping: ri(150, 600),
    Pallet: ri(50, 300),
    Return: ri(20, 150),
  }));

  const errorBreakdown = [
    { name: "Misprint", count: ri(10, 50) },
    { name: "Smudge", count: ri(5, 30) },
    { name: "Alignment", count: ri(8, 40) },
    { name: "Content Error", count: ri(3, 25) },
    { name: "Paper Jam", count: ri(2, 15) },
  ];

  const complianceTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    score: ri(85, 98),
    target: 95,
  }));

  const costByType = LABEL_TYPES_8.slice(0, 6).map(t => ({ name: t, value: rf(0.8, 4.5) }));

  const monthlyEfficiency = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    efficiency: ri(78, 96),
    target: 90,
  }));

  return {
    TEMPLATE_TYPES, TEMPLATE_STATUSES, CATEGORIES, PRINT_STATUSES, PRINTERS,
    PAPER_SIZES, PRIORITIES, SCAN_TYPES, SCAN_STATUSES, LOCATIONS, DEVICES,
    STANDARDS, COMPLIANCE_STATUSES, PRODUCT_CATS, AUDIT_FREQUENCIES,
    TT_COLORS, TS_COLORS, CAT_COLORS, PS_COLORS, PR_COLORS, ST_COLORS,
    SS_COLORS, STD_COLORS, CS_COLORS,
    templates, printJobs, scanRecords, complianceRecords, analytics,
    monthlyVolume, printStatusData, labelTypeData, dailyVolume30,
    errorBreakdown, complianceTrend, costByType, monthlyEfficiency,
  };
}

// ============================================================================
// Unique Visual Components (21 total)
// ============================================================================

// 1. TemplateTypeBadge
function TemplateTypeBadge({ type, color }: { type: string; color: string }) {
  return (
    <span
      className="bl-tt-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {type === "QR Code" ? <QrCode className="w-3 h-3" /> : <ScanBarcode className="w-3 h-3" />}
      {type}
    </span>
  );
}

// 2. TemplateStatusBadge
function TemplateStatusBadge({ status, color }: { status: string; color: string }) {
  const bgCls =
    status === "Active" || status === "Published"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
      : status === "Draft" || status === "Retired"
        ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        : status === "Under Review" || status === "Pending Approval"
          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
          : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";
  return (
    <span
      className={cn("bl-ts-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border", bgCls)}
      style={{ borderColor: color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}

// 3. CategoryBadge
function CategoryBadge({ category, color }: { category: string; color: string }) {
  return (
    <span
      className="bl-cat-badge inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border"
      style={{ borderColor: color, color, backgroundColor: color + "15" }}
    >
      {category}
    </span>
  );
}

// 4. FormatBadge
function FormatBadge({ format }: { format: string }) {
  return (
    <span className="bl-fmt-badge inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
      {format}
    </span>
  );
}

// 5. PrintCountIndicator
function PrintCountIndicator({ count }: { count: number }) {
  const level = count > 10000 ? "high" : count > 1000 ? "med" : "low";
  return (
    <span className={cn(
      "bl-print-count inline-flex items-center gap-1 text-[10px] font-semibold",
      level === "high" ? "text-emerald-600" : level === "med" ? "text-amber-600" : "text-slate-500"
    )}>
      <Printer className="w-3 h-3" />
      {count.toLocaleString("en-IN")}
    </span>
  );
}

// 6. TemplatePreviewCard
function TemplatePreviewCard({ type, format }: { type: string; format: string }) {
  const pattern =
    type === "QR Code"
      ? "grid grid-cols-4 gap-px p-1"
      : type === "Pallet" || type === "Shipping"
        ? "grid grid-cols-2 gap-1 p-1"
        : "flex flex-col gap-1 p-1";
  const lines = type === "QR Code" ? 16 : type === "Pallet" || type === "Shipping" ? 6 : 5;
  return (
    <div className="bl-tpl-preview bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 w-20 h-24 flex flex-col">
      <div className="flex-1">
        <div className={pattern}>
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={i}
              className="bl-tpl-preview-bar bg-slate-300 dark:bg-slate-600 rounded-sm"
              style={{
                height: type === "QR Code" ? "4px" : "2px",
                width: type === "QR Code" ? "100%" : `${60 + (i * 7) % 35}%`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="bl-tpl-preview-label text-[7px] text-center text-slate-400 mt-1 font-mono">{format}</div>
    </div>
  );
}

// 7. PrintJobStatusBadge (pulse on Printing)
function PrintJobStatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span
      className={cn(
        "bl-pjs-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white",
        status === "Printing" && "bl-pulse-cyan"
      )}
      style={{ backgroundColor: color }}
    >
      {status === "Printing" && <span className="bl-cyan-dot w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
      {status === "Completed" && <CheckCircle2 className="w-3 h-3" />}
      {status === "Failed" && <AlertCircle className="w-3 h-3" />}
      {status === "Queued" && <Clock className="w-3 h-3" />}
      {status !== "Completed" && status !== "Failed" && status !== "Queued" && status !== "Printing" && (
        <Activity className="w-3 h-3" />
      )}
      {status}
    </span>
  );
}

// 8. PrinterBadge
function PrinterBadge({ name }: { name: string }) {
  const brand = name.split(" ")[0];
  return (
    <span className="bl-printer-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      <Printer className="w-3 h-3" />
      {brand}
    </span>
  );
}

// 9. PriorityBadge (5-tier: Critical/High/Medium/Low/Batch)
function PriorityBadge({ priority, color }: { priority: string; color: string }) {
  return (
    <span
      className="bl-priority-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {priority === "Critical" && <Zap className="w-3 h-3" />}
      {priority}
    </span>
  );
}

// 10. PaperSizeBadge
function PaperSizeBadge({ size }: { size: string }) {
  return (
    <span className="bl-paper-badge inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
      {size}
    </span>
  );
}

// 11. ProgressIndicator
function ProgressIndicator({ progress }: { progress: number }) {
  const color = progress >= 80 ? "bg-emerald-500" : progress >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="bl-progress w-full flex items-center gap-2">
      <div className="bl-progress-track flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={cn("bl-progress-fill h-full rounded-full transition-all", color)} style={{ width: `${progress}%` }} />
      </div>
      <span className="bl-progress-text text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400 w-8 text-right">
        {progress}%
      </span>
    </div>
  );
}

// 12. ScanTypeBadge
function ScanTypeBadge({ type, color }: { type: string; color: string }) {
  return (
    <span
      className="bl-scan-type-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {type}
    </span>
  );
}

// 13. ScanStatusBadge (pulse on Invalid/Duplicate errors)
function ScanStatusBadge({ status, color }: { status: string; color: string }) {
  const isError = status === "Invalid" || status === "Duplicate" || status === "Blacklisted";
  return (
    <span
      className={cn(
        "bl-scan-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white",
        isError && "bl-pulse-red"
      )}
      style={{ backgroundColor: color }}
    >
      {isError && <span className="bl-red-dot w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
      {status}
    </span>
  );
}

// 14. LocationBadge
function LocationBadge({ location }: { location: string }) {
  const zone = location.split("-")[0];
  const zoneColor = zone === "A" ? "#059669" : zone === "B" ? "#7c3aed" : "#0891b2";
  return (
    <span
      className="bl-location-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white"
      style={{ backgroundColor: zoneColor }}
    >
      <MapPin className="w-3 h-3" />
      {location}
    </span>
  );
}

// 15. DeviceBadge
function DeviceBadge({ device }: { device: string }) {
  const brand = device.split(" ")[0];
  return (
    <span className="bl-device-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
      <Smartphone className="w-3 h-3" />
      {brand}
    </span>
  );
}

// 16. ScanTimeIndicator
function ScanTimeIndicator({ ms }: { ms: number }) {
  const color = ms < 200 ? "text-emerald-600" : ms < 500 ? "text-amber-600" : "text-red-600";
  const label = ms < 200 ? "Fast" : ms < 500 ? "Normal" : "Slow";
  return (
    <span className={cn("bl-scan-time inline-flex items-center gap-1 text-[10px] font-mono font-semibold", color)}>
      <Timer className="w-3 h-3" />
      {ms}ms <span className="bl-scan-time-label font-sans text-[9px] opacity-70">({label})</span>
    </span>
  );
}

// 17. BarcodePreview
function BarcodePreview({ barcode }: { barcode: string }) {
  const bars = barcode.slice(0, 20).split("").map((c, i) => ({
    w: ((c.charCodeAt(0) * 3 + i * 7) % 4) + 1,
    h: 24,
  }));
  return (
    <div className="bl-barcode-preview flex items-end gap-px bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-700">
      {bars.map((b, i) => (
        <div
          key={i}
          className="bl-bar bg-slate-800 dark:bg-slate-200 rounded-sm"
          style={{ width: `${b.w}px`, height: `${b.h}px` }}
        />
      ))}
      <span className="bl-barcode-text text-[6px] font-mono text-slate-500 ml-1 whitespace-nowrap">{barcode.slice(0, 13)}</span>
    </div>
  );
}

// 18. StandardBadge
function StandardBadge({ standard, color }: { standard: string; color: string }) {
  const Icon = standard === "QR Code" ? QrCode : standard === "GS1" || standard === "GS1-128" ? ShieldCheck : ScanBarcode;
  return (
    <span
      className="bl-std-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      <Icon className="w-3 h-3" />
      {standard}
    </span>
  );
}

// 19. ComplianceStatusBadge
function ComplianceStatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span
      className="bl-cs-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border-2"
      style={{ borderColor: color, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}

// 20. AuditFrequencyBadge
function AuditFrequencyBadge({ frequency }: { frequency: string }) {
  const colorMap: Record<string, string> = {
    "Weekly": "#dc2626", "Bi-Weekly": "#e11d48", "Monthly": "#d97706",
    "Quarterly": "#059669", "Bi-Annual": "#7c3aed", "Annual": "#475569",
  };
  return (
    <span
      className="bl-audit-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-white"
      style={{ backgroundColor: colorMap[frequency] || "#475569" }}
    >
      <ClipboardCheck className="w-3 h-3" />
      {frequency}
    </span>
  );
}

// 21. ComplianceScoreBar
function ComplianceScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="bl-score-bar w-full flex items-center gap-2">
      <div className="bl-score-track flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={cn("bl-score-fill h-full rounded-full transition-all", color)} style={{ width: `${score}%` }} />
      </div>
      <span
        className={cn(
          "bl-score-text text-xs font-bold tabular-nums",
          score >= 90 ? "text-emerald-600" : score >= 70 ? "text-amber-600" : "text-red-600"
        )}
      >
        {score}%
      </span>
    </div>
  );
}

// ============================================================================
// KPI Card
// ============================================================================
function KpiCard({ title, value, icon: Icon, color, sub }: {
  title: string; value: string | number; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <Card className="bl-kpi-card">
      <CardContent className="glass-subtle p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="bl-kpi-title text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
          <div className="bl-kpi-icon p-1.5 rounded-lg" style={{ backgroundColor: color + "15" }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
        </div>
        <div className="bl-kpi-value text-2xl font-bold tabular-nums" style={{ color }}>{value}</div>
        {sub && <div className="bl-kpi-sub text-[10px] text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Column label maps
// ============================================================================
const PRINT_COL_LABELS: Record<string, string> = {
  id: "ID", labelName: "Label", status: "Status", printer: "Printer",
  paperSize: "Paper", priority: "Priority", copies: "Copies",
  progress: "Progress", submittedAt: "Submitted", cost: "Cost",
};
const SCAN_COL_LABELS: Record<string, string> = {
  id: "ID", barcode: "Barcode", type: "Type", status: "Status",
  location: "Location", device: "Device", responseMs: "Resp. Time",
  product: "Product", operator: "Operator", scanTime: "Scan Time",
};
const COMPLIANCE_COL_LABELS: Record<string, string> = {
  id: "ID", standard: "Standard", status: "Status", category: "Category",
  score: "Score", auditFrequency: "Audit Freq", lastAudit: "Last Audit",
  product: "Product", auditor: "Auditor", findings: "Findings",
};

// ============================================================================
// Main Component
// ============================================================================
export default function BarcodeLabelView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("0");
  const [search, setSearch] = useState("");
  const [filterVal, setFilterVal] = useState("all");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"template" | "print" | "scan" | "compliance" | null>(null);
  const [drawerIdx, setDrawerIdx] = useState<number>(-1);

  const data = useMemo(() => generateData(), []);

  const toggleSort = useCallback((col: string) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }, [sortCol]);

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown className="w-3 h-3 text-muted-foreground" />;
    return sortDir === "asc" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  };

  // Drawer record
  const drawerRecord = useMemo(() => {
    if (drawerType === "template") return data.templates[drawerIdx] ?? null;
    if (drawerType === "print") return data.printJobs[drawerIdx] ?? null;
    if (drawerType === "scan") return data.scanRecords[drawerIdx] ?? null;
    if (drawerType === "compliance") return data.complianceRecords[drawerIdx] ?? null;
    return null;
  }, [drawerType, drawerIdx, data]);

  // Generic sort helper
  const sortArr = useCallback((arr: Record<string, unknown>[]) => {
    if (!sortCol) return arr;
    return [...arr].sort((a, b) => {
      const av = String(a[sortCol] ?? "");
      const bv = String(b[sortCol] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [sortCol, sortDir]);

  // Filtered/sorted arrays
  const filteredTemplates = useMemo(() => {
    let arr = [...data.templates] as unknown as Record<string, unknown>[];
    if (search) arr = arr.filter(t =>
      String(t.name).toLowerCase().includes(search.toLowerCase()) ||
      String(t.id).toLowerCase().includes(search.toLowerCase())
    );
    if (filterVal !== "all") arr = arr.filter(t => t.status === filterVal);
    return sortArr(arr) as unknown as typeof data.templates;
  }, [search, filterVal, sortCol, sortDir, data.templates, sortArr]);

  const filteredPrintJobs = useMemo(() => {
    let arr = [...data.printJobs] as unknown as Record<string, unknown>[];
    if (search) arr = arr.filter(j =>
      String(j.labelName).toLowerCase().includes(search.toLowerCase()) ||
      String(j.id).toLowerCase().includes(search.toLowerCase())
    );
    if (filterVal !== "all") arr = arr.filter(j => j.status === filterVal);
    return sortArr(arr) as unknown as typeof data.printJobs;
  }, [search, filterVal, sortCol, sortDir, data.printJobs, sortArr]);

  const filteredScans = useMemo(() => {
    let arr = [...data.scanRecords] as unknown as Record<string, unknown>[];
    if (search) arr = arr.filter(s =>
      String(s.barcode).includes(search) ||
      String(s.product).toLowerCase().includes(search.toLowerCase())
    );
    if (filterVal !== "all") arr = arr.filter(s => s.status === filterVal);
    return sortArr(arr) as unknown as typeof data.scanRecords;
  }, [search, filterVal, sortCol, sortDir, data.scanRecords, sortArr]);

  const filteredCompliance = useMemo(() => {
    let arr = [...data.complianceRecords] as unknown as Record<string, unknown>[];
    if (search) arr = arr.filter(c =>
      String(c.product).toLowerCase().includes(search.toLowerCase()) ||
      String(c.standard).includes(search)
    );
    if (filterVal !== "all") arr = arr.filter(c => c.status === filterVal);
    return sortArr(arr) as unknown as typeof data.complianceRecords;
  }, [search, filterVal, sortCol, sortDir, data.complianceRecords, sortArr]);

  const PIE_COLORS = ["#059669", "#d97706", "#7c3aed", "#e11d48", "#0891b2", "#475569", "#ca8a04", "#2563eb"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Barcode & Labels"
        description="Manage label templates, print queues, scan history, and compliance standards across all warehouses."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bl-tabs-list flex flex-wrap h-auto gap-1 bg-muted p-1">
          {[
            { v: "0", l: "Label Dashboard", ic: BarChart3 },
            { v: "1", l: "Label Templates", ic: Layers },
            { v: "2", l: "Print Queue", ic: Printer },
            { v: "3", l: "Scan History", ic: ScanBarcode },
            { v: "4", l: "Compliance & Standards", ic: ShieldCheck },
            { v: "5", l: "Label Analytics", ic: TrendingUp },
          ].map(t => (
            <TabsTrigger
              key={t.v}
              value={t.v}
              className="bl-tab-trigger flex items-center gap-1.5 text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <t.ic className="w-3.5 h-3.5" /> {t.l}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ===== TAB 0: Label Dashboard ===== */}
        <TabsContent value="0" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Active Templates", value: data.templates.filter(t => t.status === "Active" || t.status === "Published").length, icon: Layers, color: "#059669", sub: "of 60 total" },
              { title: "Labels Printed Today", value: "4,287", icon: Printer, color: "#d97706", sub: "+12% vs yesterday" },
              { title: "Print Queue Size", value: data.printJobs.filter(j => j.status === "Queued" || j.status === "Printing").length, icon: BarChart3, color: "#7c3aed", sub: "jobs in pipeline" },
              { title: "Scan Rate Today", value: "96.7%", icon: ScanBarcode, color: "#0891b2", sub: "1,842 scans" },
              { title: "Avg Print Time", value: "2.4s", icon: Timer, color: "#475569", sub: "per label" },
              { title: "Label Errors Today", value: "14", icon: AlertTriangle, color: "#e11d48", sub: "2.3% error rate" },
              { title: "Compliance Score", value: "91.2%", icon: ShieldCheck, color: "#059669", sub: "GS1/EAN-13 compliant" },
              { title: "Ink/Toner Level", value: "67%", icon: Activity, color: "#d97706", sub: "across 8 printers" },
            ].map((k, i) => (
              <KpiCard key={i} {...k} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bl-chart-card">
              <CardHeader><CardTitle className="text-base">Monthly Label Printing Volume</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.monthlyVolume}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Product Labels" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="Shipping Labels" stackId="1" stroke="#d97706" fill="#d97706" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="Pallet Labels" stackId="1" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="Return Labels" stackId="1" stroke="#e11d48" fill="#e11d48" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bl-chart-card">
              <CardHeader><CardTitle className="text-base">Print Status Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.printStatusData}
                      cx="50%" cy="50%" outerRadius={100} innerRadius={50}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {data.printStatusData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bl-chart-card">
            <CardHeader><CardTitle className="text-base">Label Type Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.labelTypeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.labelTypeData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 1: Label Templates ===== */}
        <TabsContent value="1" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {data.TEMPLATE_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto bl-scroll">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                  <tr className="bl-table-header">
                    {[["id", "ID"], ["name", "Name"], ["type", "Type"], ["status", "Status"], ["category", "Category"], ["format", "Format"], ["printCount", "Prints"], ["lastPrinted", "Last Printed"], ["createdBy", "Creator"], ["createdDate", "Created"]].map(([col, label]) => (
                      <th
                        key={String(col)}
                        className="bl-th px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground"
                        onClick={() => toggleSort(String(col))}
                      >
                        <span className="inline-flex items-center gap-1">{label} <SortIcon col={String(col)} /></span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredTemplates.map((t, i) => (
                    <tr
                      key={t.id}
                      className="bl-table-row hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={() => { setDrawerType("template"); setDrawerIdx(i); setDrawerOpen(true); }}
                    >
                      <td className="bl-td px-3 py-2 font-mono text-xs font-semibold">{t.id}</td>
                      <td className="bl-td px-3 py-2 font-medium text-xs max-w-[160px] truncate">{t.name}</td>
                      <td className="bl-td px-3 py-2"><TemplateTypeBadge type={t.type} color={data.TT_COLORS[t.type] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2"><TemplateStatusBadge status={t.status} color={data.TS_COLORS[t.status] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2"><CategoryBadge category={t.category} color={data.CAT_COLORS[t.category] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2"><FormatBadge format={t.format} /></td>
                      <td className="bl-td px-3 py-2"><PrintCountIndicator count={t.printCount} /></td>
                      <td className="bl-td px-3 py-2 text-[10px] text-muted-foreground">{t.lastPrinted}</td>
                      <td className="bl-td px-3 py-2 text-xs">{t.createdBy}</td>
                      <td className="bl-td px-3 py-2 text-[10px] text-muted-foreground">{t.createdDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB 2: Print Queue ===== */}
        <TabsContent value="2" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search print jobs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {data.PRINT_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto bl-scroll">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                  <tr className="bl-table-header">
                    {["id", "labelName", "status", "printer", "paperSize", "priority", "copies", "progress", "submittedAt", "cost"].map(col => (
                      <th
                        key={col}
                        className="bl-th px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground"
                        onClick={() => toggleSort(col)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {PRINT_COL_LABELS[col] || col} <SortIcon col={col} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredPrintJobs.map((j, i) => (
                    <tr
                      key={j.id}
                      className="bl-table-row hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={() => { setDrawerType("print"); setDrawerIdx(i); setDrawerOpen(true); }}
                    >
                      <td className="bl-td px-3 py-2 font-mono text-xs font-semibold">{j.id}</td>
                      <td className="bl-td px-3 py-2 text-xs font-medium max-w-[140px] truncate">{j.labelName}</td>
                      <td className="bl-td px-3 py-2"><PrintJobStatusBadge status={j.status} color={data.PS_COLORS[j.status] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2"><PrinterBadge name={j.printer} /></td>
                      <td className="bl-td px-3 py-2"><PaperSizeBadge size={j.paperSize} /></td>
                      <td className="bl-td px-3 py-2"><PriorityBadge priority={j.priority} color={data.PR_COLORS[j.priority] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2 text-xs tabular-nums">{j.copies}</td>
                      <td className="bl-td px-3 py-2"><ProgressIndicator progress={j.progress} /></td>
                      <td className="bl-td px-3 py-2 text-[10px] text-muted-foreground">{j.submittedAt}</td>
                      <td className="bl-td px-3 py-2 text-xs font-mono">{formatINR(j.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB 3: Scan History ===== */}
        <TabsContent value="3" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search scans..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {data.SCAN_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto bl-scroll">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                  <tr className="bl-table-header">
                    {["id", "barcode", "type", "status", "location", "device", "responseMs", "product", "operator", "scanTime"].map(col => (
                      <th
                        key={col}
                        className="bl-th px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground"
                        onClick={() => toggleSort(col)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {SCAN_COL_LABELS[col] || col} <SortIcon col={col} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredScans.map((sc, i) => (
                    <tr
                      key={sc.id}
                      className="bl-table-row hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={() => { setDrawerType("scan"); setDrawerIdx(i); setDrawerOpen(true); }}
                    >
                      <td className="bl-td px-3 py-2 font-mono text-xs font-semibold">{sc.id}</td>
                      <td className="bl-td px-3 py-2"><BarcodePreview barcode={sc.barcode} /></td>
                      <td className="bl-td px-3 py-2"><ScanTypeBadge type={sc.type} color={data.ST_COLORS[sc.type] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2"><ScanStatusBadge status={sc.status} color={data.SS_COLORS[sc.status] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2"><LocationBadge location={sc.location} /></td>
                      <td className="bl-td px-3 py-2"><DeviceBadge device={sc.device} /></td>
                      <td className="bl-td px-3 py-2"><ScanTimeIndicator ms={sc.responseMs} /></td>
                      <td className="bl-td px-3 py-2 text-xs max-w-[120px] truncate">{sc.product}</td>
                      <td className="bl-td px-3 py-2 text-xs">{sc.operator}</td>
                      <td className="bl-td px-3 py-2 text-[10px] text-muted-foreground">{sc.scanTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB 4: Compliance & Standards ===== */}
        <TabsContent value="4" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search compliance..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {data.COMPLIANCE_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto bl-scroll">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                  <tr className="bl-table-header">
                    {["id", "standard", "status", "category", "score", "auditFrequency", "lastAudit", "product", "auditor", "findings"].map(col => (
                      <th
                        key={col}
                        className="bl-th px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground"
                        onClick={() => toggleSort(col)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {COMPLIANCE_COL_LABELS[col] || col} <SortIcon col={col} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredCompliance.map((c, i) => (
                    <tr
                      key={c.id}
                      className="bl-table-row hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={() => { setDrawerType("compliance"); setDrawerIdx(i); setDrawerOpen(true); }}
                    >
                      <td className="bl-td px-3 py-2 font-mono text-xs font-semibold">{c.id}</td>
                      <td className="bl-td px-3 py-2"><StandardBadge standard={c.standard} color={data.STD_COLORS[c.standard] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2"><ComplianceStatusBadge status={c.status} color={data.CS_COLORS[c.status] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2"><CategoryBadge category={c.category} color={data.CAT_COLORS[c.category] || "#475569"} /></td>
                      <td className="bl-td px-3 py-2"><ComplianceScoreBar score={c.score} /></td>
                      <td className="bl-td px-3 py-2"><AuditFrequencyBadge frequency={c.auditFrequency} /></td>
                      <td className="bl-td px-3 py-2 text-[10px] text-muted-foreground">{c.lastAudit}</td>
                      <td className="bl-td px-3 py-2 text-xs max-w-[120px] truncate">{c.product}</td>
                      <td className="bl-td px-3 py-2 text-xs">{c.auditor}</td>
                      <td className="bl-td px-3 py-2 text-xs tabular-nums">{c.findings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB 5: Label Analytics ===== */}
        <TabsContent value="5" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Total Labels Printed", value: data.analytics.totalPrinted.toLocaleString("en-IN"), icon: Printer, color: "#059669" },
              { title: "Error Rate", value: `${data.analytics.errorRate}%`, icon: AlertTriangle, color: "#e11d48" },
              { title: "Avg Scan Success", value: `${data.analytics.avgScanSuccess}%`, icon: ScanBarcode, color: "#0891b2" },
              { title: "Compliance Rate", value: `${data.analytics.complianceRate}%`, icon: ShieldCheck, color: "#059669" },
              { title: "Total Templates", value: data.analytics.totalTemplates, icon: Layers, color: "#7c3aed" },
              { title: "Active Printers", value: data.analytics.activePrinters, icon: Printer, color: "#d97706" },
              { title: "Ink Usage Efficiency", value: `${data.analytics.inkEfficiency}%`, icon: Activity, color: "#475569" },
              { title: "Cost Per Label", value: formatINR(data.analytics.costPerLabel), icon: IndianRupee, color: "#0891b2" },
            ].map((k, i) => (
              <KpiCard key={i} {...k} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bl-chart-card">
              <CardHeader><CardTitle className="text-base">Daily Print Volume (30 Days)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.dailyVolume30}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 9 }} interval={4} />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Product" stroke="#059669" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Shipping" stroke="#d97706" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Pallet" stroke="#7c3aed" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Return" stroke="#e11d48" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bl-chart-card">
              <CardHeader><CardTitle className="text-base">Error Breakdown</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.errorBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis type="category" dataKey="name" className="text-xs" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#e11d48" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bl-chart-card">
              <CardHeader><CardTitle className="text-base">Compliance Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.complianceTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[80, 100]} className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} name="Score" />
                    <Line type="monotone" dataKey="target" stroke="#e11d48" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bl-chart-card">
              <CardHeader><CardTitle className="text-base">Cost Per Label by Type</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={data.costByType}
                      cx="50%" cy="50%" outerRadius={95} innerRadius={45}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ₹${value}`}
                      labelLine={false}
                    >
                      {data.costByType.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bl-chart-card">
            <CardHeader><CardTitle className="text-base">Monthly Print Efficiency (6 Months)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.monthlyEfficiency}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis domain={[70, 100]} className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="efficiency" stroke="#0891b2" fill="#0891b2" fillOpacity={0.3} name="Efficiency %" />
                  <Line type="monotone" dataKey="target" stroke="#059669" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ==================== DRAWER ==================== */}
      <Sheet open={!!(drawerOpen && drawerType)} onOpenChange={setDrawerOpen}>
        <SheetContent className="bl-drawer w-[420px] sm:w-[500px] overflow-y-auto">
          <>
            {/* Template Drawer */}
            {drawerType === "template" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as {
                id: string; name: string; type: string; status: string; category: string;
                format: string; printCount: number; lastPrinted: string;
                createdBy: string; createdDate: string;
              };
              return (
                <>
                  <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    <SheetTitle className="text-base">{rec.name}</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TemplateTypeBadge type={rec.type} color={data.TT_COLORS[rec.type] || "#475569"} />
                      <TemplateStatusBadge status={rec.status} color={data.TS_COLORS[rec.status] || "#475569"} />
                      <CategoryBadge category={rec.category} color={data.CAT_COLORS[rec.category] || "#475569"} />
                    </div>
                    <TemplatePreviewCard type={rec.type} format={rec.format} />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-muted-foreground">Template ID</span><div className="font-mono font-semibold">{rec.id}</div></div>
                      <div><span className="text-muted-foreground">Format</span><div><FormatBadge format={rec.format} /></div></div>
                      <div><span className="text-muted-foreground">Total Prints</span><div><PrintCountIndicator count={rec.printCount} /></div></div>
                      <div><span className="text-muted-foreground">Last Printed</span><div className="font-medium">{rec.lastPrinted}</div></div>
                      <div><span className="text-muted-foreground">Created By</span><div className="font-medium">{rec.createdBy}</div></div>
                      <div><span className="text-muted-foreground">Created Date</span><div className="font-medium">{rec.createdDate}</div></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bl-action-btn flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => { toast.success("Template Edited", `${rec.name} updated successfully`); setDrawerOpen(false); }}><FileText className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                      <Button size="sm" variant="outline" className="btn-outline-animate bl-action-btn flex-1" onClick={() => { toast.success("Template Duplicated", `Copy of ${rec.name} created`); setDrawerOpen(false); }}><Copy className="w-3.5 h-3.5 mr-1" /> Duplicate</Button>
                      <Button size="sm" variant="outline" className="btn-outline-animate bl-action-btn" onClick={() => { toast.warning("Template Archived", `${rec.name} moved to archive`); setDrawerOpen(false); }}><Archive className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Print Job Drawer */}
            {drawerType === "print" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as {
                id: string; labelName: string; status: string; printer: string;
                paperSize: string; priority: string; copies: number;
                progress: number; submittedAt: string; cost: number;
              };
              return (
                <>
                  <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                    <SheetTitle className="text-base">Print Job {rec.id}</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <PrintJobStatusBadge status={rec.status} color={data.PS_COLORS[rec.status] || "#475569"} />
                      <PriorityBadge priority={rec.priority} color={data.PR_COLORS[rec.priority] || "#475569"} />
                    </div>
                    <ProgressIndicator progress={rec.progress} />
                    <div className="flex items-center gap-2 flex-wrap">
                      <PrinterBadge name={rec.printer} />
                      <PaperSizeBadge size={rec.paperSize} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-muted-foreground">Label</span><div className="font-medium truncate">{rec.labelName}</div></div>
                      <div><span className="text-muted-foreground">Copies</span><div className="font-semibold tabular-nums">{rec.copies}</div></div>
                      <div><span className="text-muted-foreground">Cost</span><div className="font-bold tabular-nums">{formatINR(rec.cost)}</div></div>
                      <div><span className="text-muted-foreground">Submitted</span><div className="font-medium">{rec.submittedAt}</div></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bl-action-btn flex-1 bg-amber-600 hover:bg-amber-700" onClick={() => { toast.success("Reprinting", `Job ${rec.id} sent to printer`); setDrawerOpen(false); }}><RotateCcw className="w-3.5 h-3.5 mr-1" /> Reprint</Button>
                      <Button size="sm" variant="outline" className="btn-outline-animate bl-action-btn flex-1" onClick={() => { toast.warning("Job Cancelled", `${rec.id} has been cancelled`); setDrawerOpen(false); }}><Ban className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                      <Button size="sm" variant="outline" className="btn-outline-animate bl-action-btn" onClick={() => { toast.info("Job Paused", `${rec.id} paused`); setDrawerOpen(false); }}><Pause className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Scan Record Drawer */}
            {drawerType === "scan" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as {
                id: string; barcode: string; type: string; status: string;
                location: string; device: string; city: string; scanTime: string;
                responseMs: number; product: string; operator: string;
              };
              return (
                <>
                  <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                    <SheetTitle className="text-base">Scan {rec.id}</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ScanStatusBadge status={rec.status} color={data.SS_COLORS[rec.status] || "#475569"} />
                      <ScanTypeBadge type={rec.type} color={data.ST_COLORS[rec.type] || "#475569"} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <LocationBadge location={rec.location} />
                      <DeviceBadge device={rec.device} />
                    </div>
                    <BarcodePreview barcode={rec.barcode} />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-muted-foreground">Product</span><div className="font-medium truncate">{rec.product}</div></div>
                      <div><span className="text-muted-foreground">Operator</span><div className="font-medium">{rec.operator}</div></div>
                      <div><span className="text-muted-foreground">Response Time</span><div><ScanTimeIndicator ms={rec.responseMs} /></div></div>
                      <div><span className="text-muted-foreground">City</span><div className="font-medium">{rec.city}</div></div>
                      <div className="col-span-2"><span className="text-muted-foreground">Scan Time</span><div className="font-medium">{rec.scanTime}</div></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bl-action-btn flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => { toast.success("Re-scanning", `Barcode ${rec.barcode.slice(0, 13)} re-scanned`); setDrawerOpen(false); }}><RotateCcw className="w-3.5 h-3.5 mr-1" /> Re-scan</Button>
                      <Button size="sm" variant="outline" className="btn-outline-animate bl-action-btn flex-1" onClick={() => { toast.info("Investigation Started", `Looking into ${rec.id}`); setDrawerOpen(false); }}><Search className="w-3.5 h-3.5 mr-1" /> Investigate</Button>
                      <Button size="sm" variant="outline" className="btn-outline-animate bl-action-btn" onClick={() => { toast.success("Exported", `Scan ${rec.id} data exported`); setDrawerOpen(false); }}><Download className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Compliance Drawer */}
            {drawerType === "compliance" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as {
                id: string; standard: string; status: string; category: string;
                product: string; score: number; auditFrequency: string;
                lastAudit: string; nextAudit: string; auditor: string; findings: number;
              };
              return (
                <>
                  <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                    <SheetTitle className="text-base">Compliance {rec.id}</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 space-y-4">
                    <ComplianceScoreBar score={rec.score} />
                    <div className="flex items-center gap-2 flex-wrap">
                      <StandardBadge standard={rec.standard} color={data.STD_COLORS[rec.standard] || "#475569"} />
                      <ComplianceStatusBadge status={rec.status} color={data.CS_COLORS[rec.status] || "#475569"} />
                      <AuditFrequencyBadge frequency={rec.auditFrequency} />
                    </div>
                    <Card className="bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800">
                      <CardContent className="glass-subtle p-3">
                        <div className="bl-audit-info text-[10px] text-muted-foreground uppercase">Last Audit</div>
                        <div className="text-sm font-bold">{rec.lastAudit}</div>
                        <div className="bl-audit-info text-[10px] text-muted-foreground uppercase mt-2">Next Audit</div>
                        <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">{rec.nextAudit}</div>
                      </CardContent>
                    </Card>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-muted-foreground">Product</span><div className="font-medium truncate">{rec.product}</div></div>
                      <div><span className="text-muted-foreground">Category</span><div><CategoryBadge category={rec.category} color={data.CAT_COLORS[rec.category] || "#475569"} /></div></div>
                      <div><span className="text-muted-foreground">Auditor</span><div className="font-medium">{rec.auditor}</div></div>
                      <div><span className="text-muted-foreground">Findings</span><div className="font-semibold tabular-nums">{rec.findings}</div></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bl-action-btn flex-1 bg-cyan-600 hover:bg-cyan-700" onClick={() => { toast.success("Audit Started", `Compliance check for ${rec.id}`); setDrawerOpen(false); }}><ClipboardCheck className="w-3.5 h-3.5 mr-1" /> Audit</Button>
                      <Button size="sm" variant="outline" className="btn-outline-animate bl-action-btn flex-1" onClick={() => { toast.warning("Remediation", `Fixes initiated for ${rec.id}`); setDrawerOpen(false); }}><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Remediate</Button>
                      <Button size="sm" variant="outline" className="btn-outline-animate bl-action-btn" onClick={() => { toast.info("Exemption Filed", `${rec.id} exemption requested`); setDrawerOpen(false); }}><ShieldCheck className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </>
        </SheetContent>
      </Sheet>

      {/* Inline Styles */}
      <style>{`
        .bl-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .bl-scroll::-webkit-scrollbar-track { background: transparent; }
        .bl-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .bl-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .bl-pulse-cyan { animation: bl-pulse-c 1.5s ease-in-out infinite; }
        @keyframes bl-pulse-c { 0%, 100% { box-shadow: 0 0 0 0 rgba(8, 145, 178, 0.4); } 50% { box-shadow: 0 0 0 6px rgba(8, 145, 178, 0); } }
        .bl-pulse-red { animation: bl-pulse-r 1.5s ease-in-out infinite; }
        @keyframes bl-pulse-r { 0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); } 50% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); } }
      `}</style>
    </div>
  );
}
