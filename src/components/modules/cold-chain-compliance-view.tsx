"use client";

import React, { useState, useMemo } from "react";
import {
  TestTubes,
  Thermometer,
  ThermometerSnowflake,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ScanLine,
  FileSearch,
  Download,
  ClipboardList,
  TrendingDown,
  TrendingUp,
  Eye,
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

// ──────────────────────────────────────────────────────
// Seeded Random
// ──────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ──────────────────────────────────────────────────────
// Constants & Enums
// ──────────────────────────────────────────────────────
const COMPLIANCE_LEVELS = ["FSSAI Compliant", "WHO GDP", "EU GDP", "US FDA 21 CFR", "ISO 22000", "HACCP", "BRCGS", "FSSC 22000"] as const;
const AUDIT_TYPES = ["Internal Audit", "External Audit", "Regulatory Inspection", "Customer Audit", "Supplier Audit", "Pre-shipment Audit", "Routine Inspection", "Surprise Audit"] as const;
const TEMPERATURE_ZONES = ["Frozen (-25°C)", "Deep Chill (-18°C)", "Chill (2-8°C)", "Controlled Room (15-25°C)", "Ambient Controlled", "Warm Chain (30-40°C)", "Ultra-Frozen (-60°C)", "Cryogenic (-150°C)"] as const;
const DEVIATION_SEVERITIES = ["Critical", "Major", "Minor", "Observation", "None"] as const;
const DEVIATION_TYPES = [
  "Temperature Excursion",
  "Humidity Breach",
  "Time-Out-of-Range",
  "Cross-Contamination Risk",
  "Packaging Integrity Failure",
  "Cold Chain Break",
  "Sensor Calibration Drift",
  "Documentation Gap",
  "Labeling Non-Compliance",
  "Transport Delay",
] as const;
const CERTIFICATION_STATUSES = ["Active", "Expiring Soon", "Expired", "Under Review", "Revoked", "Suspended"] as const;
const PRODUCT_CATEGORIES = ["Vaccines", "Biologics", "Insulin", "Blood Products", "Pharma API", "Diagnostics", "Organic Produce", "Dairy", "Seafood", "Frozen Foods", "Chemicals", "Clinical Trials"] as const;
const INDIAN_CITIES = [
  "Mumbai", "Delhi NCR", "Chennai", "Bangalore", "Hyderabad",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Chandigarh", "Cochin", "Visakhapatnam", "Indore", "Nagpur",
] as const;

const deviationColorMap: Record<string, string> = {
  Critical: "bg-red-600 text-white",
  Major: "bg-orange-500 text-white",
  Minor: "bg-amber-500 text-white",
  Observation: "bg-sky-500 text-white",
  None: "bg-emerald-500 text-white",
};

const certStatusColorMap: Record<string, string> = {
  Active: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  "Expiring Soon": "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  Expired: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
  "Under Review": "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30",
  Revoked: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800",
  Suspended: "bg-violet-600 text-white",
};

const auditStatusColorMap: Record<string, string> = {
  Scheduled: "text-sky-600 dark:text-sky-400",
  "In Progress": "text-amber-600 dark:text-amber-400",
  Completed: "text-emerald-600 dark:text-emerald-400",
  "Passed": "text-emerald-600 dark:text-emerald-400",
  Failed: "text-red-600 dark:text-red-400",
  "Conditional Pass": "text-amber-600 dark:text-amber-400",
};

// ──────────────────────────────────────────────────────
// Data Types
// ──────────────────────────────────────────────────────
interface ComplianceCert {
  id: string;
  standard: string;
  certNumber: string;
  status: string;
  issuedDate: string;
  expiryDate: string;
  issuer: string;
  scope: string;
  facility: string;
  city: string;
  lastAudit: string;
  nextAudit: string;
  score: number;
}

interface DeviationRecord {
  id: string;
  type: string;
  severity: string;
  status: string;
  zone: string;
  productId: string;
  batchId: string;
  reportedBy: string;
  timestamp: string;
  resolvedAt: string;
  duration: string;
  minTemp: string;
  maxTemp: string;
  targetMin: string;
  targetMax: string;
  city: string;
  description: string;
  rootCause: string;
}

interface TemperatureLog {
  id: string;
  zone: string;
  currentTemp: string;
  targetMin: string;
  targetMax: string;
  humidity: number;
  status: string;
  sensorCount: number;
  alertCount: number;
  lastCalibration: string;
  city: string;
  facility: string;
  productCategory: string;
  uptime: number;
}

interface AuditRecord {
  id: string;
  type: string;
  standard: string;
  status: string;
  auditor: string;
  startDate: string;
  endDate: string;
  findings: number;
  criticals: number;
  majors: number;
  minors: number;
  score: number;
  city: string;
  facility: string;
  scope: string;
}

interface CalibrationRecord {
  id: string;
  sensorId: string;
  sensorType: string;
  zone: string;
  status: string;
  lastCalibrated: string;
  nextDue: string;
  deviation: string;
  technician: string;
  facility: string;
  city: string;
  accuracy: number;
  certified: boolean;
}

// ──────────────────────────────────────────────────────
// Data Generation
// ──────────────────────────────────────────────────────
function generateData() {
  const ri = seededRandom(19601);

  const auditors = [
    "Dr. Meera Krishnan",
    "Rajiv Agarwal",
    "Priya Choudhary",
    "Suresh Battula",
    "Anita Deshmukh",
    "Vikram Shah",
    "Deepa Nair",
    "Ramesh Pillai",
  ];

  const technicians = [
    "Tech. Sharma",
    "Tech. Gupta",
    "Tech. Rao",
    "Tech. Iyer",
    "Tech. Singh",
  ];

  const facilities = [
    "Cold Store Alpha",
    "Cold Store Beta",
    "Pharma Hub Central",
    "Perishable Terminal",
    "Vaccine Warehouse",
    "Blood Bank Storage",
    "Dairy Processing Unit",
    "Seaport Cold Terminal",
    "Airport Cargo Cold",
    "Biologics Center",
    "Frozen Foods Depot",
    "Clinical Trial Storage",
  ];

  const deviationStatuses = ["Open", "Investigating", "CAPA Initiated", "Resolved", "Closed"];
  const auditStatusesList = ["Scheduled", "In Progress", "Completed", "Passed", "Failed", "Conditional Pass"];

  // ── Certifications (40) ──
  const certs: ComplianceCert[] = Array.from({ length: 40 }, (_, i) => {
    const statusRoll = ri();
    return {
      id: `CERT-${String(2024000 + i).padStart(7, "0")}`,
      standard: COMPLIANCE_LEVELS[Math.floor(ri() * COMPLIANCE_LEVELS.length)],
      certNumber: `${COMPLIANCE_LEVELS[Math.floor(ri() * COMPLIANCE_LEVELS.length)].replace(/\s/g, "-").substring(0, 5)}-${String(Math.floor(ri() * 9000) + 1000)}`,
      status: statusRoll < 0.55 ? "Active" : statusRoll < 0.75 ? "Expiring Soon" : statusRoll < 0.85 ? "Expired" : statusRoll < 0.93 ? "Under Review" : statusRoll < 0.97 ? "Revoked" : "Suspended",
      issuedDate: `2022-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      expiryDate: `2025-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      issuer: ["FSSAI India", "Bureau Veritas", "SGS India", "TUV NORD", "Intertek", "DQSA", "CDSCO", "FDA India"][Math.floor(ri() * 8)],
      scope: PRODUCT_CATEGORIES[Math.floor(ri() * PRODUCT_CATEGORIES.length)],
      facility: facilities[Math.floor(ri() * facilities.length)],
      city: INDIAN_CITIES[Math.floor(ri() * INDIAN_CITIES.length)],
      lastAudit: `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      nextAudit: `2025-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      score: Math.floor(ri() * 30) + 70,
    };
  });

  // ── Deviations (60) ──
  const deviations: DeviationRecord[] = Array.from({ length: 60 }, (_, i) => {
    const sevIdx = Math.floor(ri() * 5);
    return {
      id: `DEV-${String(2024000 + i).padStart(7, "0")}`,
      type: DEVIATION_TYPES[Math.floor(ri() * DEVIATION_TYPES.length)],
      severity: DEVIATION_SEVERITIES[sevIdx],
      status: deviationStatuses[Math.floor(ri() * deviationStatuses.length)],
      zone: TEMPERATURE_ZONES[Math.floor(ri() * TEMPERATURE_ZONES.length)],
      productId: `PRD-${String(Math.floor(ri() * 9000) + 1000)}`,
      batchId: `BATCH-${String(Math.floor(ri() * 900) + 100)}`,
      reportedBy: auditors[Math.floor(ri() * auditors.length)],
      timestamp: `2024-12-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")} ${String(Math.floor(ri() * 24)).padStart(2, "0")}:${String(Math.floor(ri() * 60)).padStart(2, "0")}`,
      resolvedAt: ri() < 0.6 ? `2024-12-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")} ${String(Math.floor(ri() * 24)).padStart(2, "0")}:${String(Math.floor(ri() * 60)).padStart(2, "0")}` : "—",
      duration: `${Math.floor(ri() * 12) + 1}h ${Math.floor(ri() * 59)}m`,
      minTemp: `-${Math.floor(ri() * 20) + 5}°C`,
      maxTemp: `${Math.floor(ri() * 15) + 2}°C`,
      targetMin: "-25°C",
      targetMax: "-18°C",
      city: INDIAN_CITIES[Math.floor(ri() * INDIAN_CITIES.length)],
      description: `Temperature monitoring sensor detected excursion beyond acceptable threshold limits. Automated alert dispatched to quality team for immediate investigation and corrective action.`,
      rootCause: ri() < 0.4 ? "Door seal failure" : ri() < 0.6 ? "Compressor malfunction" : ri() < 0.8 ? "Power fluctuation" : "Human error during loading",
    };
  });

  // ── Temperature Logs (50) ──
  const tempLogs: TemperatureLog[] = Array.from({ length: 50 }, (_, i) => {
    const zone = TEMPERATURE_ZONES[Math.floor(ri() * TEMPERATURE_ZONES.length)];
    const statusRoll = ri();
    const curTemp = zone.includes("-60") || zone.includes("-150") ? `-${Math.floor(ri() * 100) + 50}` : zone.includes("-25") || zone.includes("-18") ? `-${Math.floor(ri() * 10) + 15}` : zone.includes("2-8") ? `${Math.floor(ri() * 7) + 2}` : `${Math.floor(ri() * 10) + 15}`;
    return {
      id: `TL-${String(i + 1).padStart(4, "0")}`,
      zone,
      currentTemp: `${curTemp}°C`,
      targetMin: zone.includes("-60") || zone.includes("-150") ? "-65°C" : zone.includes("-25") || zone.includes("-18") ? "-25°C" : zone.includes("2-8") ? "2°C" : "15°C",
      targetMax: zone.includes("-60") || zone.includes("-150") ? "-55°C" : zone.includes("-25") || zone.includes("-18") ? "-18°C" : zone.includes("2-8") ? "8°C" : "25°C",
      humidity: Math.floor(ri() * 60) + 30,
      status: statusRoll < 0.8 ? "Normal" : statusRoll < 0.9 ? "Warning" : "Critical",
      sensorCount: Math.floor(ri() * 12) + 4,
      alertCount: Math.floor(ri() * 8),
      lastCalibration: `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      city: INDIAN_CITIES[Math.floor(ri() * INDIAN_CITIES.length)],
      facility: facilities[Math.floor(ri() * facilities.length)],
      productCategory: PRODUCT_CATEGORIES[Math.floor(ri() * PRODUCT_CATEGORIES.length)],
      uptime: Math.floor(ri() * 3) + 97,
    };
  });

  // ── Audits (50) ──
  const audits: AuditRecord[] = Array.from({ length: 50 }, (_, i) => {
    const score = Math.floor(ri() * 35) + 65;
    return {
      id: `AUD-${String(2024000 + i).padStart(7, "0")}`,
      type: AUDIT_TYPES[Math.floor(ri() * AUDIT_TYPES.length)],
      standard: COMPLIANCE_LEVELS[Math.floor(ri() * COMPLIANCE_LEVELS.length)],
      status: score >= 90 ? (ri() < 0.8 ? "Passed" : "Conditional Pass") : ri() < 0.6 ? "Completed" : ri() < 0.8 ? "Conditional Pass" : "Failed",
      auditor: auditors[Math.floor(ri() * auditors.length)],
      startDate: `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      endDate: `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
      findings: Math.floor(ri() * 15) + 1,
      criticals: Math.floor(ri() * 3),
      majors: Math.floor(ri() * 5),
      minors: Math.floor(ri() * 8),
      score,
      city: INDIAN_CITIES[Math.floor(ri() * INDIAN_CITIES.length)],
      facility: facilities[Math.floor(ri() * facilities.length)],
      scope: PRODUCT_CATEGORIES[Math.floor(ri() * PRODUCT_CATEGORIES.length)],
    };
  });

  // ── Calibrations (45) ──
  const calibrations: CalibrationRecord[] = Array.from({ length: 45 }, (_, i) => ({
    id: `CAL-${String(2024000 + i).padStart(7, "0")}`,
    sensorId: `SNS-${String(Math.floor(ri() * 9000) + 1000)}`,
    sensorType: ["PT100 RTD", "Thermocouple Type T", "Thermistor NTC", "Infrared", "Humidity RH", "Data Logger"][Math.floor(ri() * 6)],
    zone: TEMPERATURE_ZONES[Math.floor(ri() * TEMPERATURE_ZONES.length)],
    status: ri() < 0.7 ? "Calibrated" : ri() < 0.85 ? "Due Soon" : ri() < 0.93 ? "Overdue" : "Out of Service",
    lastCalibrated: `2024-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
    nextDue: `2025-${String(Math.floor(ri() * 12) + 1).padStart(2, "0")}-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
    deviation: `±${(ri() * 2 + 0.1).toFixed(1)}°C`,
    technician: technicians[Math.floor(ri() * technicians.length)],
    facility: facilities[Math.floor(ri() * facilities.length)],
    city: INDIAN_CITIES[Math.floor(ri() * INDIAN_CITIES.length)],
    accuracy: Math.floor(ri() * 5) + 95,
    certified: ri() < 0.85,
  }));

  // ── Chart Data ──
  const tempTrend = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    frozen: -(Math.floor(ri() * 8) + 18),
    chill: Math.floor(ri() * 6) + 2,
    room: Math.floor(ri() * 8) + 18,
    targetFrozen: -20,
    targetChill: 5,
    targetRoom: 22,
  }));

  const complianceTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    score: Math.floor(ri() * 15) + 82,
    deviations: Math.floor(ri() * 8) + 2,
    audits: Math.floor(ri() * 5) + 3,
  }));

  const deviationByType = DEVIATION_TYPES.map((t) => ({
    type: t.length > 18 ? t.substring(0, 18) + "…" : t,
    count: Math.floor(ri() * 12) + 2,
  }));

  const certByStandard = COMPLIANCE_LEVELS.map((s) => ({
    standard: s.length > 12 ? s.substring(0, 12) + "…" : s,
    active: Math.floor(ri() * 8) + 3,
    expiring: Math.floor(ri() * 4) + 1,
    expired: Math.floor(ri() * 3),
  }));

  return {
    certs,
    deviations,
    tempLogs,
    audits,
    calibrations,
    tempTrend,
    complianceTrend,
    deviationByType,
    certByStandard,
    auditors,
    technicians,
    facilities,
    COMPLIANCE_LEVELS: [...COMPLIANCE_LEVELS],
    AUDIT_TYPES: [...AUDIT_TYPES],
    TEMPERATURE_ZONES: [...TEMPERATURE_ZONES],
    DEVIATION_SEVERITIES: [...DEVIATION_SEVERITIES],
    DEVIATION_TYPES: [...DEVIATION_TYPES],
    CERTIFICATION_STATUSES: [...CERTIFICATION_STATUSES],
    PRODUCT_CATEGORIES: [...PRODUCT_CATEGORIES],
    INDIAN_CITIES: [...INDIAN_CITIES],
  };
}

// ──────────────────────────────────────────────────────
// Unique Visual Components
// ──────────────────────────────────────────────────────

function TempRangeIndicator({ current, min, max }: { current: string; min: string; max: string }) {
  const parseTemp = (t: string) => parseFloat(t.replace("°C", ""));
  const cur = parseTemp(current);
  const lo = parseTemp(min);
  const hi = parseTemp(max);
  const inRange = cur >= lo && cur <= hi;
  const pct = Math.min(100, Math.max(0, ((cur - lo) / (hi - lo)) * 100));
  const barColor = inRange ? "bg-emerald-500" : "bg-red-500";
  return (
    <div className="ccc-temp-indicator flex items-center gap-2 w-24">
      <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
        <div className={cn("h-full rounded-full transition-all ccc-temp-fill", barColor)} style={{ width: `${Math.abs(pct)}%` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 shadow-sm ccc-temp-dot" style={{ left: `${Math.abs(pct)}%`, marginLeft: -6, backgroundColor: inRange ? "#10b981" : "#ef4444" }} />
      </div>
      <span className={cn("text-xs font-mono font-semibold min-w-[3rem] text-right", inRange ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>{current}</span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-bold", deviationColorMap[severity] || "bg-slate-400 text-white")}>
      {severity}
    </span>
  );
}

function CertExpiryRing({ daysLeft }: { daysLeft: number }) {
  const color = daysLeft > 180 ? "#10b981" : daysLeft > 90 ? "#06b6d4" : daysLeft > 30 ? "#d97706" : "#ef4444";
  const pct = Math.min(100, (daysLeft / 365) * 100);
  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="ccc-expiry-ring relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-200 dark:text-slate-700" />
        <circle cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${circumference}`} strokeDashoffset={`${offset}`} strokeLinecap="round" className="ccc-expiry-arc" />
      </svg>
      <span className="relative z-10 text-[9px] font-bold" style={{ color }}>{daysLeft}d</span>
    </div>
  );
}

function CalibrationStatusPill({ status }: { status: string }) {
  const color = status === "Calibrated" ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30" : status === "Due Soon" ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30" : status === "Overdue" ? "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30" : "text-slate-500 bg-slate-50 dark:text-slate-400 dark:bg-slate-800";
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", color)}>{status}</span>;
}

function AuditScoreGauge({ score }: { score: number }) {
  const color = score >= 90 ? "#10b981" : score >= 80 ? "#06b6d4" : score >= 70 ? "#d97706" : "#ef4444";
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="ccc-audit-gauge relative flex items-center justify-center" style={{ width: 48, height: 48 }}>
      <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
        <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${circumference}`} strokeDashoffset={`${offset}`} strokeLinecap="round" className="ccc-audit-arc" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Drawer Components
// ──────────────────────────────────────────────────────

function CertDrawer({ data, fields, toast }: { data: ComplianceCert; fields: { label: string; value: string }[]; toast: any }) {
  // Derive days left from score as deterministic fallback
  const daysLeft = data.score >= 95 ? 240 : data.score >= 85 ? 150 : data.score >= 75 ? 60 : 15;
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.id}</h3>
          <p className="text-amber-100 text-sm">{data.standard} — {data.certNumber}</p>
        </div>
        <div className="ml-auto">
          <CertExpiryRing daysLeft={daysLeft} />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
            <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-bold mt-1", certStatusColorMap[data.status])}>{data.status}</span>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{data.score}%</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Issued</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{data.issuedDate}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Expiry</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{data.expiryDate}</p>
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
          <Button size="sm" className="press-scale flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.success("Certificate downloaded")}><Download className="h-4 w-4 mr-1" /> Download</Button>
          <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => toast.success("Renewal initiated")}><ClipboardList className="h-4 w-4 mr-1" /> Renew</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Audit scheduled")}><FileSearch className="press-scale btn-outline-animate h-4 w-4" /></Button>
        </div>
      </div>
    </>
  );
}

function DeviationDrawer({ data, fields, toast }: { data: DeviationRecord; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-red-600 to-rose-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.id}</h3>
          <p className="text-red-200 text-sm">{data.type} — {data.severity}</p>
        </div>
        <div className="ml-auto">
          <SeverityBadge severity={data.severity} />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
            <p className="text-lg font-bold text-red-600">{data.duration}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Temp Range</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{data.minTemp} ~ {data.maxTemp}</p>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description</p>
          <p className="text-sm text-slate-700 dark:text-slate-200">{data.description}</p>
        </div>
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3">
          <p className="text-xs text-red-500 mb-1">Root Cause</p>
          <p className="text-sm font-medium text-red-700 dark:text-red-300">{data.rootCause}</p>
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
          <Button size="sm" className="press-scale flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={() => toast.success("CAPA initiated")}><AlertTriangle className="h-4 w-4 mr-1" /> CAPA</Button>
          <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => toast.success("Investigation assigned")}><FileSearch className="h-4 w-4 mr-1" /> Investigate</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Deviation resolved")}><CheckCircle2 className="press-scale btn-outline-animate h-4 w-4" /></Button>
        </div>
      </div>
    </>
  );
}

function AuditDrawer({ data, fields, toast }: { data: AuditRecord; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.id}</h3>
          <p className="text-blue-200 text-sm">{data.type} — {data.standard}</p>
        </div>
        <div className="ml-auto">
          <AuditScoreGauge score={data.score} />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Findings</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.findings}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
            <span className={cn("text-sm font-bold", auditStatusColorMap[data.status])}>{data.status}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-2 text-center">
            <p className="text-lg font-bold text-red-600">{data.criticals}</p>
            <p className="text-[10px] text-slate-400">Criticals</p>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-2 text-center">
            <p className="text-lg font-bold text-amber-600">{data.majors}</p>
            <p className="text-[10px] text-slate-400">Majors</p>
          </div>
          <div className="rounded-lg bg-sky-50 dark:bg-sky-950/20 p-2 text-center">
            <p className="text-lg font-bold text-sky-600">{data.minors}</p>
            <p className="text-[10px] text-slate-400">Minors</p>
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
          <Button size="sm" className="press-scale flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.success("Audit report generated")}><Download className="h-4 w-4 mr-1" /> Report</Button>
          <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => toast.success("Corrective actions assigned")}><ClipboardList className="h-4 w-4 mr-1" /> Actions</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Follow-up scheduled")}><ScanLine className="press-scale btn-outline-animate h-4 w-4" /></Button>
        </div>
      </div>
    </>
  );
}

function CalibrationDrawer({ data, fields, toast }: { data: CalibrationRecord; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.sensorId}</h3>
          <p className="text-emerald-200 text-sm">{data.sensorType} — {data.zone}</p>
        </div>
        <div className="ml-auto">
          <Thermometer className="h-8 w-8 text-emerald-300" />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
            <CalibrationStatusPill status={data.status} />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{data.accuracy}%</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Deviation</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{data.deviation}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Certified</p>
            <p className={cn("text-sm font-bold", data.certified ? "text-emerald-600" : "text-red-600")}>{data.certified ? "Yes" : "No"}</p>
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
          <Button size="sm" className="press-scale flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => toast.success("Calibration scheduled")}><ScanLine className="h-4 w-4 mr-1" /> Calibrate</Button>
          <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => toast.success("Certificate downloaded")}><Download className="h-4 w-4 mr-1" /> Cert</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Sensor replaced")}><TestTubes className="press-scale btn-outline-animate h-4 w-4" /></Button>
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
export default function ColdChainComplianceView() {
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
    setDrawerType(type);
    setDrawerData(item);
    setDrawerOpen(true);
  };

  // KPIs
  const activeCerts = data.certs.filter((c) => c.status === "Active").length;
  const openDeviations = data.deviations.filter((d) => d.status === "Open" || d.status === "Investigating").length;
  const criticalDeviations = data.deviations.filter((d) => d.severity === "Critical").length;
  const normalZones = data.tempLogs.filter((t) => t.status === "Normal").length;
  const passedAudits = data.audits.filter((a) => a.status === "Passed").length;
  const avgAuditScore = Math.round(data.audits.reduce((a, au) => a + au.score, 0) / data.audits.length);
  const calibratedSensors = data.calibrations.filter((c) => c.status === "Calibrated").length;
  const overdueCalibrations = data.calibrations.filter((c) => c.status === "Overdue").length;

  const kpis = [
    { label: "Active Certs", value: activeCerts, sub: `${data.certs.length} total`, icon: ShieldCheck, color: "text-amber-600 dark:text-amber-400" },
    { label: "Open Deviations", value: openDeviations, sub: `${criticalDeviations} critical`, icon: AlertTriangle, color: "text-red-600 dark:text-red-400" },
    { label: "Zones Normal", value: normalZones, sub: `${data.tempLogs.length} monitored`, icon: ThermometerSnowflake, color: "text-cyan-600 dark:text-cyan-400" },
    { label: "Audits Passed", value: passedAudits, sub: `${avgAuditScore}% avg score`, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Sensors Cal.", value: calibratedSensors, sub: `${overdueCalibrations} overdue`, icon: TestTubes, color: "text-blue-600 dark:text-blue-400" },
    { label: "Temp Excursions", value: criticalDeviations, sub: "This month", icon: TrendingDown, color: "text-orange-600 dark:text-orange-400" },
    { label: "Compliance Rate", value: `${Math.min(98, avgAuditScore)}%`, sub: "Overall", icon: TrendingUp, color: "text-violet-600 dark:text-violet-400" },
    { label: "Standards", value: data.COMPLIANCE_LEVELS.length, sub: "Covered", icon: ClipboardList, color: "text-teal-600 dark:text-teal-400" },
  ];

  // Filtered data
  const filteredCerts = useMemo(() => {
    let filtered = data.certs;
    if (searchTerm) filtered = filtered.filter((c) => c.id.toLowerCase().includes(searchTerm.toLowerCase()) || c.standard.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") filtered = filtered.filter((c) => c.status === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof ComplianceCert) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.certs]);

  const filteredDeviations = useMemo(() => {
    let filtered = data.deviations;
    if (searchTerm) filtered = filtered.filter((d) => d.id.toLowerCase().includes(searchTerm.toLowerCase()) || d.type.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") filtered = filtered.filter((d) => d.severity === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof DeviationRecord) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.deviations]);

  const filteredTempLogs = useMemo(() => {
    let filtered = data.tempLogs;
    if (searchTerm) filtered = filtered.filter((t) => t.zone.toLowerCase().includes(searchTerm.toLowerCase()) || t.facility.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") filtered = filtered.filter((t) => t.status === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof TemperatureLog) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.tempLogs]);

  const filteredAudits = useMemo(() => {
    let filtered = data.audits;
    if (searchTerm) filtered = filtered.filter((a) => a.id.toLowerCase().includes(searchTerm.toLowerCase()) || a.standard.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") filtered = filtered.filter((a) => a.status === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof AuditRecord) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.audits]);

  const filteredCalibrations = useMemo(() => {
    let filtered = data.calibrations;
    if (searchTerm) filtered = filtered.filter((c) => c.sensorId.toLowerCase().includes(searchTerm.toLowerCase()) || c.zone.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") filtered = filtered.filter((c) => c.status === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof CalibrationRecord) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.calibrations]);

  const PIE_COLORS = ["#dc2626", "#ea580c", "#d97706", "#06b6d4", "#10b981", "#7c3aed", "#ec4899", "#6366f1", "#f97316", "#14b8a6"];

  return (
    <div className="ccc-root flex flex-col gap-4 p-4 md:p-6">
      <PageHeader
        title="Cold Chain Compliance & Audit"
        description="Temperature compliance monitoring, FSSAI/WHO GDP certification tracking, deviation management & sensor calibration across Indian cold chain facilities"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="ccc-tabs flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 h-auto">
          {["Compliance Dashboard", "Certifications", "Deviation Tracker", "Temperature Monitoring", "Audit Management", "Sensor Calibration"].map((tab, idx) => (
            <TabsTrigger key={idx} value={String(idx)} className="ccc-tab-trigger">{tab}</TabsTrigger>
          ))}
        </TabsList>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 0: Compliance Dashboard                  */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="0" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ccc-kpi-grid">
            {kpis.map((kpi, i) => (
              <Card key={i} className="hover-lift-sm ccc-kpi-card border-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                <CardContent className="inner-glow glass-subtle p-4 flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800", kpi.color)}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold ccc-counter-value">{kpi.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{kpi.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{kpi.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="hover-lift-sm ccc-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Temperature Trend (24h)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.tempTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} className="text-slate-500" />
                    <YAxis tick={{ fontSize: 11 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="frozen" stroke="#06b6d4" strokeWidth={2} dot={false} name="Frozen" />
                    <Line type="monotone" dataKey="chill" stroke="#10b981" strokeWidth={2} dot={false} name="Chill" />
                    <Line type="monotone" dataKey="room" stroke="#f59e0b" strokeWidth={2} dot={false} name="Room" />
                    <Line type="monotone" dataKey="targetFrozen" stroke="#06b6d4" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Frozen Target" />
                    <Line type="monotone" dataKey="targetChill" stroke="#10b981" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Chill Target" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm ccc-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Compliance Score Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.complianceTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-slate-500" />
                    <YAxis tick={{ fontSize: 11 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} name="Score %" />
                    <Bar dataKey="deviations" fill="#ef4444" opacity={0.6} name="Deviations" />
                    <Bar dataKey="audits" fill="#06b6d4" opacity={0.6} name="Audits" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm ccc-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Deviations by Type</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.deviationByType} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis type="number" tick={{ fontSize: 11 }} className="text-slate-500" />
                    <YAxis dataKey="type" type="category" width={100} tick={{ fontSize: 10 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm ccc-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Certifications by Standard</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.certByStandard}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="standard" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={50} className="text-slate-500" />
                    <YAxis tick={{ fontSize: 11 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="active" stackId="a" fill="#10b981" name="Active" />
                    <Bar dataKey="expiring" stackId="a" fill="#f59e0b" name="Expiring" />
                    <Bar dataKey="expired" stackId="a" fill="#ef4444" name="Expired" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 1: Certifications                       */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input placeholder="Search cert ID or standard..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 h-8 text-sm" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm">
              <option value="All">All Status</option>
              {data.CERTIFICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="ccc-sort-header px-3 py-2 text-left cursor-pointer hover:text-amber-600" onClick={() => handleSort("id")}>Cert ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}</th>
                  <th className="px-3 py-2 text-left">Standard</th>
                  <th className="px-3 py-2 text-left">Cert #</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Score</th>
                  <th className="px-3 py-2 text-left">Issuer</th>
                  <th className="px-3 py-2 text-left">Scope</th>
                  <th className="px-3 py-2 text-left">Expiry</th>
                  <th className="px-3 py-2 text-left">Facility</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.slice(0, 20).map((cert) => (
                  <tr key={cert.id} className="ccc-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/20">
                    <td className="px-3 py-2 font-mono text-xs font-semibold">{cert.id}</td>
                    <td className="px-3 py-2 text-xs font-medium">{cert.standard}</td>
                    <td className="px-3 py-2 font-mono text-xs">{cert.certNumber}</td>
                    <td className="px-3 py-2"><span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-bold", certStatusColorMap[cert.status])}>{cert.status}</span></td>
                    <td className="px-3 py-2 text-xs font-bold">{cert.score}%</td>
                    <td className="px-3 py-2 text-xs">{cert.issuer}</td>
                    <td className="px-3 py-2 text-xs">{cert.scope}</td>
                    <td className="px-3 py-2 text-xs">{cert.expiryDate}</td>
                    <td className="px-3 py-2 text-xs">{cert.city}</td>
                    <td className="px-3 py-2 text-center">
                      <Button size="sm" variant="ghost" className="press-scale ccc-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("cert", cert)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 2: Deviation Tracker                    */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input placeholder="Search deviation ID or type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 h-8 text-sm" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm">
              <option value="All">All Severity</option>
              {data.DEVIATION_SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="ccc-sort-header px-3 py-2 text-left cursor-pointer hover:text-red-600" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Severity</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Zone</th>
                  <th className="px-3 py-2 text-left">Temp Range</th>
                  <th className="px-3 py-2 text-left">Duration</th>
                  <th className="px-3 py-2 text-left">Root Cause</th>
                  <th className="px-3 py-2 text-left">City</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeviations.slice(0, 20).map((dev) => (
                  <tr key={dev.id} className="ccc-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-red-50/50 dark:hover:bg-red-950/20">
                    <td className="px-3 py-2 font-mono text-xs font-semibold">{dev.id}</td>
                    <td className="px-3 py-2 text-xs">{dev.type}</td>
                    <td className="px-3 py-2"><SeverityBadge severity={dev.severity} /></td>
                    <td className="px-3 py-2"><span className={cn("text-xs font-semibold", dev.status === "Open" ? "text-red-600" : dev.status === "Resolved" || dev.status === "Closed" ? "text-emerald-600" : "text-amber-600")}>{dev.status}</span></td>
                    <td className="px-3 py-2 text-xs">{dev.zone}</td>
                    <td className="px-3 py-2 text-xs font-mono">{dev.minTemp} ~ {dev.maxTemp}</td>
                    <td className="px-3 py-2 text-xs font-mono">{dev.duration}</td>
                    <td className="px-3 py-2 text-xs">{dev.rootCause}</td>
                    <td className="px-3 py-2 text-xs">{dev.city}</td>
                    <td className="px-3 py-2 text-center">
                      <Button size="sm" variant="ghost" className="press-scale ccc-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("deviation", dev)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 3: Temperature Monitoring               */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input placeholder="Search zone or facility..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 h-8 text-sm" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm">
              <option value="All">All Status</option>
              {["Normal", "Warning", "Critical"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTempLogs.slice(0, 18).map((log) => (
              <Card key={log.id} className="hover-lift-sm ccc-zone-card border-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer" onClick={() => setDrawerOpen(false)}>
                <CardContent className="inner-glow glass-subtle p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-sm">{log.zone}</h3>
                      <p className="text-xs text-slate-500">{log.facility} — {log.city}</p>
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", log.status === "Normal" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : log.status === "Warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400")}>{log.status}</span>
                  </div>
                  <TempRangeIndicator current={log.currentTemp} min={log.targetMin} max={log.targetMax} />
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{log.sensorCount}</p>
                      <p className="text-[10px] text-slate-400">Sensors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-600 dark:text-slate-300">{log.humidity}%</p>
                      <p className="text-[10px] text-slate-400">Humidity</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-600 dark:text-slate-300">{log.alertCount}</p>
                      <p className="text-[10px] text-slate-400">Alerts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{log.uptime}%</p>
                      <p className="text-[10px] text-slate-400">Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 4: Audit Management                     */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input placeholder="Search audit ID or standard..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 h-8 text-sm" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm">
              <option value="All">All Status</option>
              {["Scheduled", "In Progress", "Completed", "Passed", "Failed", "Conditional Pass"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="ccc-sort-header px-3 py-2 text-left cursor-pointer hover:text-blue-600" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Standard</th>
                  <th className="px-3 py-2 text-left">Score</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Findings</th>
                  <th className="px-3 py-2 text-left">Auditor</th>
                  <th className="px-3 py-2 text-left">Facility</th>
                  <th className="px-3 py-2 text-left">Period</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudits.slice(0, 20).map((audit) => (
                  <tr key={audit.id} className="ccc-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20">
                    <td className="px-3 py-2 font-mono text-xs font-semibold">{audit.id}</td>
                    <td className="px-3 py-2 text-xs">{audit.type}</td>
                    <td className="px-3 py-2 text-xs">{audit.standard}</td>
                    <td className="px-3 py-2"><AuditScoreGauge score={audit.score} /></td>
                    <td className="px-3 py-2"><span className={cn("text-xs font-bold", auditStatusColorMap[audit.status])}>{audit.status}</span></td>
                    <td className="px-3 py-2 text-xs">{audit.findings} (<span className="text-red-600">{audit.criticals}C</span> / <span className="text-amber-600">{audit.majors}M</span> / <span className="text-sky-600">{audit.minors}m</span>)</td>
                    <td className="px-3 py-2 text-xs">{audit.auditor}</td>
                    <td className="px-3 py-2 text-xs">{audit.city}</td>
                    <td className="px-3 py-2 text-xs">{audit.startDate} ~ {audit.endDate}</td>
                    <td className="px-3 py-2 text-center">
                      <Button size="sm" variant="ghost" className="press-scale ccc-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("audit", audit)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 5: Sensor Calibration                   */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input placeholder="Search sensor ID or zone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 h-8 text-sm" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm">
              <option value="All">All Status</option>
              {["Calibrated", "Due Soon", "Overdue", "Out of Service"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="ccc-sort-header px-3 py-2 text-left cursor-pointer hover:text-emerald-600" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}</th>
                  <th className="px-3 py-2 text-left">Sensor ID</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Accuracy</th>
                  <th className="px-3 py-2 text-left">Deviation</th>
                  <th className="px-3 py-2 text-left">Zone</th>
                  <th className="px-3 py-2 text-left">Next Due</th>
                  <th className="px-3 py-2 text-left">City</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalibrations.slice(0, 20).map((cal) => (
                  <tr key={cal.id} className="ccc-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20">
                    <td className="px-3 py-2 font-mono text-xs font-semibold">{cal.id}</td>
                    <td className="px-3 py-2 font-mono text-xs">{cal.sensorId}</td>
                    <td className="px-3 py-2 text-xs">{cal.sensorType}</td>
                    <td className="px-3 py-2"><CalibrationStatusPill status={cal.status} /></td>
                    <td className="px-3 py-2 text-xs font-bold">{cal.accuracy}%</td>
                    <td className="px-3 py-2 text-xs font-mono">{cal.deviation}</td>
                    <td className="px-3 py-2 text-xs">{cal.zone}</td>
                    <td className="px-3 py-2 text-xs">{cal.nextDue}</td>
                    <td className="px-3 py-2 text-xs">{cal.city}</td>
                    <td className="px-3 py-2 text-center">
                      <Button size="sm" variant="ghost" className="press-scale ccc-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("calibration", cal)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════ */}
      {/* Sheet Drawer                                */}
      {/* ═══════════════════════════════════════════ */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] overflow-y-auto p-4 sm:p-6">
          <SheetHeader>
            <SheetTitle className="text-base font-semibold">
              {drawerType === "cert" && "Certification Details"}
              {drawerType === "deviation" && "Deviation Details"}
              {drawerType === "audit" && "Audit Details"}
              {drawerType === "calibration" && "Calibration Details"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {drawerType === "cert" && drawerData && (
              <CertDrawer data={drawerData} toast={toast} fields={[
                { label: "Issuer", value: drawerData.issuer },
                { label: "Scope", value: drawerData.scope },
                { label: "Facility", value: drawerData.facility },
                { label: "City", value: drawerData.city },
                { label: "Last Audit", value: drawerData.lastAudit },
                { label: "Next Audit", value: drawerData.nextAudit },
              ]} />
            )}
            {drawerType === "deviation" && drawerData && (
              <DeviationDrawer data={drawerData} toast={toast} fields={[
                { label: "Product ID", value: drawerData.productId },
                { label: "Batch ID", value: drawerData.batchId },
                { label: "Reported By", value: drawerData.reportedBy },
                { label: "City", value: drawerData.city },
                { label: "Reported", value: drawerData.timestamp },
                { label: "Resolved", value: drawerData.resolvedAt },
              ]} />
            )}
            {drawerType === "audit" && drawerData && (
              <AuditDrawer data={drawerData} toast={toast} fields={[
                { label: "Auditor", value: drawerData.auditor },
                { label: "Scope", value: drawerData.scope },
                { label: "Facility", value: drawerData.facility },
                { label: "City", value: drawerData.city },
                { label: "Start Date", value: drawerData.startDate },
                { label: "End Date", value: drawerData.endDate },
              ]} />
            )}
            {drawerType === "calibration" && drawerData && (
              <CalibrationDrawer data={drawerData} toast={toast} fields={[
                { label: "Sensor Type", value: drawerData.sensorType },
                { label: "Zone", value: drawerData.zone },
                { label: "Technician", value: drawerData.technician },
                { label: "Facility", value: drawerData.facility },
                { label: "City", value: drawerData.city },
                { label: "Last Cal.", value: drawerData.lastCalibrated },
              ]} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
