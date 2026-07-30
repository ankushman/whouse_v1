"use client";

import React, { useState, useMemo } from "react";
import {
  Radar,
  ShieldHalf,
  Eye,
  Camera,
  Siren,
  AlertTriangle,
  CheckCircle2,
  ScanLine,
  Fingerprint,
  Radio,
  FileSearch,
  Download,
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
const THREAT_LEVELS = ["Critical", "High", "Medium", "Low", "None"] as const;
const INCIDENT_TYPES = [
  "Contraband Detected",
  "Tampering Attempt",
  "Unauthorized Access",
  "Smuggling Attempt",
  "Explosive Trace",
  "Radiation Anomaly",
  "Seal Integrity Breach",
  "Identity Fraud",
  "Container Weight Mismatch",
  "Stowaway Detected",
  "Customs Violation",
  "Safety Hazard",
] as const;
const SCAN_TYPES = [
  "X-Ray",
  "Gamma-Ray",
  "Radiation Portal",
  "Millimeter Wave",
  "Explosive Trace Detector",
  "Vapor Scanner",
  "Nuclear Density",
  "MRI Scanning",
] as const;
const CAMERA_TYPES = ["PTZ", "Fixed", "Thermal", "ANPR", "Body Scanner", "Cargo Scanner"] as const;
const ZONE_STATUSES = ["Secured", "Alert", "Locked Down", "Under Patrol", "Maintenance"] as const;
const SECURITY_LEVELS = ["ISPS Level 1", "ISPS Level 2", "ISPS Level 3", "Customs Controlled", "Restricted"] as const;
const INSPECTION_RESULTS = ["Clear", "Flagged", "Held", "Rejected", "Quarantine"] as const;
const INDIAN_PORTS = [
  "JNPT Mumbai",
  "Mundra",
  "Chennai",
  "Kolkata",
  "Cochin",
  "Visakhapatnam",
  "Tuticorin",
  "Kandla",
  "Ennore",
  "Paradip",
  "Mormugao",
  "New Mangalore",
] as const;
const CARGO_CATEGORIES = ["FCL", "LCL", "Break Bulk", "Liquid Bulk", "Dry Bulk", "Reefer", "OOG", "HAZMAT", "Diplomatic", "Military"] as const;

const threatColorMap: Record<string, string> = {
  Critical: "bg-red-600 text-white",
  High: "bg-orange-500 text-white",
  Medium: "bg-amber-500 text-white",
  Low: "bg-emerald-500 text-white",
  None: "bg-slate-400 text-white",
};

const inspectionColorMap: Record<string, string> = {
  Clear: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  Flagged: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  Held: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30",
  Rejected: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
  Quarantine: "bg-violet-600 text-white",
};

const zoneStatusColorMap: Record<string, string> = {
  Secured: "text-emerald-600 dark:text-emerald-400",
  Alert: "text-amber-600 dark:text-amber-400",
  "Locked Down": "text-red-600 dark:text-red-400",
  "Under Patrol": "text-sky-600 dark:text-sky-400",
  Maintenance: "text-slate-500 dark:text-slate-400",
};

// ──────────────────────────────────────────────────────
// Data Types
// ──────────────────────────────────────────────────────
interface ScanRecord {
  id: string;
  containerId: string;
  scanType: string;
  result: string;
  threatLevel: string;
  operator: string;
  timestamp: string;
  duration: string;
  anomalyScore: number;
  cargoCategory: string;
  port: string;
}

interface SurveillanceFeed {
  id: string;
  cameraName: string;
  cameraType: string;
  zone: string;
  status: string;
  resolution: string;
  fps: number;
  recording: boolean;
  alertCount: number;
  lastMotion: string;
  port: string;
}

interface SecurityZone {
  id: string;
  zoneName: string;
  level: string;
  status: string;
  personnel: number;
  cameras: number;
  barriers: number;
  sensors: number;
  area: string;
  port: string;
  lastInspection: string;
  compliance: number;
}

interface Incident {
  id: string;
  type: string;
  severity: string;
  status: string;
  location: string;
  reportedBy: string;
  timestamp: string;
  resolvedAt: string;
  description: string;
  port: string;
  cargoRef: string;
}

interface Inspection {
  id: string;
  containerId: string;
  category: string;
  result: string;
  inspector: string;
  timestamp: string;
  findings: string;
  port: string;
  cargoWeight: string;
  declaredWeight: string;
  weightVariance: number;
}

// ──────────────────────────────────────────────────────
// Data Generation
// ──────────────────────────────────────────────────────
function generateData() {
  const ri = seededRandom(19501);

  const operators = [
    "Vikram Patel",
    "Ananya Sharma",
    "Rajesh Kumar",
    "Priya Iyer",
    "Suresh Menon",
    "Deepika Nair",
    "Arun Singh",
    "Kavita Desai",
    "Manoj Gupta",
    "Sneha Reddy",
  ];

  const zoneNames = [
    "Berth Zone A",
    "Berth Zone B",
    "Container Yard Alpha",
    "Container Yard Beta",
    "Customs Inspection Bay",
    "Gate Complex North",
    "Gate Complex South",
    "Reefer Station",
    "Hazmat Storage",
    "Bonded Warehouse",
    "Port Entry Checkpoint",
    "Vessel Boarding Area",
    "CFS Terminal",
    "Cold Storage Zone",
    "Open Yard Storage",
  ];

  const inspectors = [
    "Inspector Rao",
    "Officer Mehta",
    "Commander Joshi",
    "Sub-Inspector Das",
    "Inspector Verma",
    "Officer Kulkarni",
  ];

  const incidentStatuses = ["Open", "Investigating", "Escalated", "Resolved", "Closed"];

  // Scans (80 records)
  const scans: ScanRecord[] = Array.from({ length: 80 }, (_, i) => {
    const threatIdx = Math.floor(ri() * 5);
    return {
      id: `SCN-${String(2024000 + i).padStart(7, "0")}`,
      containerId: `CTNR-${String(Math.floor(ri() * 90000) + 10000).padStart(6, "0")}`,
      scanType: SCAN_TYPES[Math.floor(ri() * SCAN_TYPES.length)],
      result:
        ri() < 0.7
          ? "Clear"
          : ri() < 0.85
            ? "Flagged"
            : ri() < 0.95
              ? "Held"
              : "Rejected",
      threatLevel: THREAT_LEVELS[threatIdx],
      operator: operators[Math.floor(ri() * operators.length)],
      timestamp: `2024-12-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")} ${String(Math.floor(ri() * 24)).padStart(2, "0")}:${String(Math.floor(ri() * 60)).padStart(2, "0")}`,
      duration: `${Math.floor(ri() * 45) + 2}m ${Math.floor(ri() * 59) + 1}s`,
      anomalyScore:
        threatIdx === 0
          ? Math.floor(ri() * 15) + 85
          : threatIdx === 1
            ? Math.floor(ri() * 20) + 60
            : threatIdx === 2
              ? Math.floor(ri() * 30) + 30
              : Math.floor(ri() * 20) + 5,
      cargoCategory: CARGO_CATEGORIES[Math.floor(ri() * CARGO_CATEGORIES.length)],
      port: INDIAN_PORTS[Math.floor(ri() * INDIAN_PORTS.length)],
    };
  });

  // Surveillance (50 feeds)
  const feeds: SurveillanceFeed[] = Array.from({ length: 50 }, (_, i) => ({
    id: `CAM-${String(i + 1).padStart(3, "0")}`,
    cameraName: `${zoneNames[Math.floor(ri() * zoneNames.length)]} Cam ${Math.floor(ri() * 8) + 1}`,
    cameraType: CAMERA_TYPES[Math.floor(ri() * CAMERA_TYPES.length)],
    zone: zoneNames[Math.floor(ri() * zoneNames.length)],
    status: ri() < 0.85 ? "Online" : ri() < 0.93 ? "Alert" : "Offline",
    resolution: ri() < 0.4 ? "4K UHD" : ri() < 0.7 ? "1080p Full HD" : "720p HD",
    fps: Math.floor(ri() * 25) + 5,
    recording: ri() < 0.9,
    alertCount: Math.floor(ri() * 12),
    lastMotion: `${Math.floor(ri() * 59) + 1}m ago`,
    port: INDIAN_PORTS[Math.floor(ri() * INDIAN_PORTS.length)],
  }));

  // Security Zones (15)
  const securityZones: SecurityZone[] = zoneNames.map((z, i) => ({
    id: `ZONE-${String(i + 1).padStart(3, "0")}`,
    zoneName: z,
    level: SECURITY_LEVELS[Math.floor(ri() * SECURITY_LEVELS.length)],
    status: ZONE_STATUSES[Math.floor(ri() * ZONE_STATUSES.length)],
    personnel: Math.floor(ri() * 8) + 2,
    cameras: Math.floor(ri() * 12) + 4,
    barriers: Math.floor(ri() * 6) + 1,
    sensors: Math.floor(ri() * 20) + 3,
    area: `${(ri() * 9 + 1).toFixed(1)} acres`,
    port: INDIAN_PORTS[Math.floor(ri() * INDIAN_PORTS.length)],
    lastInspection: `2024-12-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")}`,
    compliance: Math.floor(ri() * 25) + 75,
  }));

  // Incidents (60)
  const incidents: Incident[] = Array.from({ length: 60 }, (_, i) => ({
    id: `INC-${String(2024000 + i).padStart(7, "0")}`,
    type: INCIDENT_TYPES[Math.floor(ri() * INCIDENT_TYPES.length)],
    severity: THREAT_LEVELS[Math.floor(ri() * 4)],
    status: incidentStatuses[Math.floor(ri() * incidentStatuses.length)],
    location: zoneNames[Math.floor(ri() * zoneNames.length)],
    reportedBy: operators[Math.floor(ri() * operators.length)],
    timestamp: `2024-12-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")} ${String(Math.floor(ri() * 24)).padStart(2, "0")}:${String(Math.floor(ri() * 60)).padStart(2, "0")}`,
    resolvedAt:
      ri() < 0.6
        ? `2024-12-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")} ${String(Math.floor(ri() * 24)).padStart(2, "0")}:${String(Math.floor(ri() * 60)).padStart(2, "0")}`
        : "—",
    description: `Security screening detected irregular pattern. Response team dispatched. Awaiting investigation report for incident resolution.`,
    port: INDIAN_PORTS[Math.floor(ri() * INDIAN_PORTS.length)],
    cargoRef: `CTNR-${String(Math.floor(ri() * 90000) + 10000).padStart(6, "0")}`,
  }));

  // Inspections (50)
  const inspections: Inspection[] = Array.from({ length: 50 }, (_, i) => {
    const cargoW = Math.floor(ri() * 28000) + 2000;
    const declaredW = Math.floor(ri() * 28000) + 2000;
    return {
      id: `INS-${String(2024000 + i).padStart(7, "0")}`,
      containerId: `CTNR-${String(Math.floor(ri() * 90000) + 10000).padStart(6, "0")}`,
      category: CARGO_CATEGORIES[Math.floor(ri() * CARGO_CATEGORIES.length)],
      result: INSPECTION_RESULTS[Math.floor(ri() * INSPECTION_RESULTS.length)],
      inspector: inspectors[Math.floor(ri() * inspectors.length)],
      timestamp: `2024-12-${String(Math.floor(ri() * 28) + 1).padStart(2, "0")} ${String(Math.floor(ri() * 24)).padStart(2, "0")}:${String(Math.floor(ri() * 60)).padStart(2, "0")}`,
      findings:
        ri() < 0.65
          ? "No anomalies detected. Cargo matches declaration."
          : ri() < 0.8
            ? "Minor weight variance. Further review recommended."
            : "Significant discrepancy found. Cargo flagged for detailed examination.",
      port: INDIAN_PORTS[Math.floor(ri() * INDIAN_PORTS.length)],
      cargoWeight: `${cargoW.toLocaleString()} kg`,
      declaredWeight: `${declaredW.toLocaleString()} kg`,
      weightVariance: ri() < 0.7 ? Math.floor(ri() * 3) : Math.floor(ri() * 15) + 3,
    };
  });

  // Chart Data
  const threatTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    critical: Math.floor(ri() * 5) + 1,
    high: Math.floor(ri() * 10) + 3,
    medium: Math.floor(ri() * 15) + 8,
    low: Math.floor(ri() * 20) + 10,
  }));

  const scanVolume = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    xray: Math.floor(ri() * 300) + 800,
    gamma: Math.floor(ri() * 200) + 400,
    radiation: Math.floor(ri() * 150) + 300,
    mmWave: Math.floor(ri() * 100) + 200,
  }));

  const incidentByType = INCIDENT_TYPES.map((t) => ({
    type: t,
    count: Math.floor(ri() * 15) + 2,
  }));

  const zoneCompliance = securityZones.map((z) => ({
    zone: z.zoneName.split(" ").slice(0, 2).join(" "),
    compliance: z.compliance,
    personnel: z.personnel,
    cameras: z.cameras,
  }));

  return {
    scans,
    feeds,
    securityZones,
    incidents,
    inspections,
    threatTrend,
    scanVolume,
    incidentByType,
    zoneCompliance,
    operators,
    zoneNames,
    inspectors,
    THREAT_LEVELS: [...THREAT_LEVELS],
    INCIDENT_TYPES: [...INCIDENT_TYPES],
    SCAN_TYPES: [...SCAN_TYPES],
    CAMERA_TYPES: [...CAMERA_TYPES],
    ZONE_STATUSES: [...ZONE_STATUSES],
    SECURITY_LEVELS: [...SECURITY_LEVELS],
    INSPECTION_RESULTS: [...INSPECTION_RESULTS],
    INDIAN_PORTS: [...INDIAN_PORTS],
    CARGO_CATEGORIES: [...CARGO_CATEGORIES],
  };
}

// ──────────────────────────────────────────────────────
// Unique Visual Components
// ──────────────────────────────────────────────────────

function ThreatLevelRing({ level, size = 40 }: { level: string; size?: number }) {
  const colorMap: Record<string, string> = {
    Critical: "#dc2626",
    High: "#ea580c",
    Medium: "#d97706",
    Low: "#16a34a",
    None: "#6b7280",
  };
  const color = colorMap[level] || "#6b7280";
  const abbrev = level.substring(0, 1).toUpperCase();
  const pct =
    level === "Critical" ? 100 : level === "High" ? 75 : level === "Medium" ? 50 : level === "Low" ? 25 : 5;
  return (
    <div className="mcs-threat-ring relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-200 dark:text-slate-700" />
        <circle
          cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={`${pct}, 100`} strokeLinecap="round" className="mcs-ring-progress"
        />
      </svg>
      <span className="relative z-10 text-xs font-bold" style={{ color }}>{abbrev}</span>
    </div>
  );
}

function AnomalyScoreBar({ score }: { score: number }) {
  const barColor =
    score >= 80
      ? "from-red-500 to-red-600"
      : score >= 60
        ? "from-orange-400 to-orange-500"
        : score >= 30
          ? "from-amber-400 to-amber-500"
          : "from-emerald-400 to-emerald-500";
  const textColor =
    score >= 80 ? "#dc2626" : score >= 60 ? "#ea580c" : score >= 30 ? "#d97706" : "#16a34a";
  return (
    <div className="mcs-anomaly-bar flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r mcs-anomaly-fill", barColor)}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <span className="text-xs font-mono font-semibold min-w-[2.5rem] text-right" style={{ color: textColor }}>
        {score}%
      </span>
    </div>
  );
}

function CameraStatusIndicator({ status, recording }: { status: string; recording: boolean }) {
  const statusColor = status === "Online" ? "bg-emerald-500" : status === "Alert" ? "bg-amber-500 animate-pulse" : "bg-red-500";
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("inline-block h-2 w-2 rounded-full", statusColor)} />
      {recording && <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {status}{recording ? " ●REC" : ""}
      </span>
    </div>
  );
}

function ComplianceGauge({ value, label }: { value: number; label?: string }) {
  const color = value >= 95 ? "#10b981" : value >= 85 ? "#06b6d4" : value >= 75 ? "#d97706" : "#ef4444";
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="mcs-compliance-gauge flex flex-col items-center">
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
          <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
          <circle
            cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${circumference}`} strokeDashoffset={`${offset}`} strokeLinecap="round"
            className="mcs-compliance-arc"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>{value}%</span>
      </div>
      {label && <span className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{label}</span>}
    </div>
  );
}

function WeightVarianceBadge({ variance }: { variance: number }) {
  const color =
    variance <= 2
      ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30"
      : variance <= 5
        ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30"
        : variance <= 10
          ? "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/30"
          : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", color)}>
      {variance > 2 ? "▲" : "●"} {variance}%
    </span>
  );
}

// ──────────────────────────────────────────────────────
// Drawer Components
// ──────────────────────────────────────────────────────
function ScanDrawer({ data, fields, toast }: { data: ScanRecord; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.id}</h3>
          <p className="text-cyan-100 text-sm">{data.scanType} — {data.port}</p>
        </div>
        <div className="ml-auto">
          <ThreatLevelRing level={data.threatLevel} size={48} />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Anomaly</p>
            <p className="text-lg font-bold" style={{ color: data.anomalyScore >= 80 ? "#dc2626" : data.anomalyScore >= 60 ? "#ea580c" : "#06b6d4" }}>{data.anomalyScore}%</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{data.duration}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Result</p>
            <p className={cn("text-sm font-bold", inspectionColorMap[data.result])}>{data.result}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Category</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{data.cargoCategory}</p>
          </div>
        </div>
        <AnomalyScoreBar score={data.anomalyScore} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {fields.map((f, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">{f.label}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <Button size="sm" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => toast.success("Scan report downloaded")}>
            <Download className="h-4 w-4 mr-1" /> Report
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Re-scan initiated")}>
            <ScanLine className="h-4 w-4 mr-1" /> Re-scan
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Flag escalated")}>
            <AlertTriangle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

function FeedDrawer({ data, fields, toast }: { data: SurveillanceFeed; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.cameraName}</h3>
          <p className="text-slate-300 text-sm">{data.cameraType} — {data.resolution} @ {data.fps}fps</p>
        </div>
        <div className="ml-auto">
          <Camera className="h-8 w-8 text-slate-400" />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Alerts</p>
            <p className="text-lg font-bold text-amber-600">{data.alertCount}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">FPS</p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{data.fps}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center flex items-center justify-center">
            <CameraStatusIndicator status={data.status} recording={data.recording} />
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
          <Button size="sm" className="flex-1 bg-slate-700 hover:bg-slate-800 text-white" onClick={() => toast.success("Live feed opened")}>
            <Eye className="h-4 w-4 mr-1" /> Live View
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Recording snapshot saved")}>
            <Download className="h-4 w-4 mr-1" /> Snapshot
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("PTZ control activated")}>
            <Radio className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

function ZoneDrawer({ data, fields, toast }: { data: SecurityZone; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.zoneName}</h3>
          <p className="text-indigo-200 text-sm">{data.level} — {data.port}</p>
        </div>
        <div className="ml-auto">
          <ComplianceGauge value={data.compliance} label="ISPS" />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Personnel</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{data.personnel}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Cameras</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{data.cameras}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Barriers</p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{data.barriers}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Sensors</p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{data.sensors}</p>
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
          <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => toast.success("Patrol dispatched")}>
            <ShieldHalf className="h-4 w-4 mr-1" /> Patrol
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Zone audit started")}>
            <FileSearch className="h-4 w-4 mr-1" /> Audit
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Alert issued for zone")}>
            <Siren className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

function IncidentDrawer({ data, fields, toast }: { data: Incident; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-red-600 to-rose-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.id}</h3>
          <p className="text-red-200 text-sm">{data.type} — {data.severity}</p>
        </div>
        <div className="ml-auto">
          <ThreatLevelRing level={data.severity} size={48} />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Severity</p>
            <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-bold", threatColorMap[data.severity])}>{data.severity}</span>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
            <span className={cn("text-sm font-bold", data.status === "Open" ? "text-red-600" : data.status === "Resolved" || data.status === "Closed" ? "text-emerald-600" : "text-amber-600")}>{data.status}</span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description</p>
          <p className="text-sm text-slate-700 dark:text-slate-200">{data.description}</p>
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
          <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={() => toast.success("Incident escalated")}>
            <Siren className="h-4 w-4 mr-1" /> Escalate
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Investigation assigned")}>
            <FileSearch className="h-4 w-4 mr-1" /> Investigate
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Incident resolved")}>
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

function InspectionDrawer({ data, fields, toast }: { data: Inspection; fields: { label: string; value: string }[]; toast: any }) {
  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 h-24 flex items-end p-4">
        <div>
          <h3 className="text-white font-bold text-lg">{data.id}</h3>
          <p className="text-teal-200 text-sm">{data.inspector} — {data.port}</p>
        </div>
        <div className="ml-auto">
          <Fingerprint className="h-8 w-8 text-teal-300" />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Result</p>
            <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-bold", inspectionColorMap[data.result])}>{data.result}</span>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Weight Var.</p>
            <WeightVarianceBadge variance={data.weightVariance} />
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Findings</p>
          <p className="text-sm text-slate-700 dark:text-slate-200">{data.findings}</p>
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
          <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" onClick={() => toast.success("Inspection report generated")}>
            <Download className="h-4 w-4 mr-1" /> Report
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Re-inspection scheduled")}>
            <ScanLine className="h-4 w-4 mr-1" /> Re-inspect
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Quarantine hold placed")}>
            <ShieldHalf className="h-4 w-4" />
          </Button>
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
export default function MaritimeSecurityView() {
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
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const openDrawer = (type: string, item: any) => {
    setDrawerType(type);
    setDrawerData(item);
    setDrawerOpen(true);
  };

  // Dashboard KPIs
  const totalScans = data.scans.length;
  const flaggedScans = data.scans.filter((s) => s.result !== "Clear").length;
  const criticalThreats = data.scans.filter((s) => s.threatLevel === "Critical").length;
  const onlineCameras = data.feeds.filter((f) => f.status === "Online").length;
  const openIncidents = data.incidents.filter(
    (i) => i.status === "Open" || i.status === "Investigating" || i.status === "Escalated"
  ).length;
  const avgCompliance = Math.round(
    data.securityZones.reduce((a, z) => a + z.compliance, 0) / data.securityZones.length
  );

  const kpis = [
    { label: "Total Scans", value: totalScans, sub: "This month", icon: ScanLine, color: "text-cyan-600 dark:text-cyan-400" },
    { label: "Flagged Cargo", value: flaggedScans, sub: `${((flaggedScans / totalScans) * 100).toFixed(1)}% rate`, icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400" },
    { label: "Critical Threats", value: criticalThreats, sub: "Require escalation", icon: Siren, color: "text-red-600 dark:text-red-400" },
    { label: "Cameras Online", value: onlineCameras, sub: `${data.feeds.length} total`, icon: Camera, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Open Incidents", value: openIncidents, sub: "Active cases", icon: ShieldHalf, color: "text-orange-600 dark:text-orange-400" },
    { label: "ISPS Compliance", value: `${avgCompliance}%`, sub: "Avg. across zones", icon: CheckCircle2, color: "text-indigo-600 dark:text-indigo-400" },
    { label: "Inspections", value: data.inspections.length, sub: "Completed", icon: Fingerprint, color: "text-teal-600 dark:text-teal-400" },
    { label: "Security Zones", value: data.securityZones.length, sub: `${data.securityZones.filter((z) => z.status === "Secured").length} secured`, icon: Radar, color: "text-violet-600 dark:text-violet-400" },
  ];

  // Filtered data
  const filteredScans = useMemo(() => {
    let filtered = data.scans;
    if (searchTerm)
      filtered = filtered.filter(
        (s) => s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.containerId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (filterStatus !== "All") filtered = filtered.filter((s) => s.result === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof ScanRecord) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.scans]);

  const filteredFeeds = useMemo(() => {
    let filtered = data.feeds;
    if (searchTerm)
      filtered = filtered.filter(
        (f) => f.cameraName.toLowerCase().includes(searchTerm.toLowerCase()) || f.zone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (filterStatus !== "All") filtered = filtered.filter((f) => f.status === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof SurveillanceFeed) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.feeds]);

  const filteredZones = useMemo(() => {
    let filtered = data.securityZones;
    if (searchTerm) filtered = filtered.filter((z) => z.zoneName.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") filtered = filtered.filter((z) => z.status === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof SecurityZone) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.securityZones]);

  const filteredIncidents = useMemo(() => {
    let filtered = data.incidents;
    if (searchTerm)
      filtered = filtered.filter(
        (i) => i.id.toLowerCase().includes(searchTerm.toLowerCase()) || i.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (filterStatus !== "All") filtered = filtered.filter((i) => i.severity === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof Incident) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.incidents]);

  const filteredInspections = useMemo(() => {
    let filtered = data.inspections;
    if (searchTerm)
      filtered = filtered.filter(
        (ins) => ins.id.toLowerCase().includes(searchTerm.toLowerCase()) || ins.containerId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (filterStatus !== "All") filtered = filtered.filter((ins) => ins.result === filterStatus);
    return sortBy ? universalSort(filtered, sortBy, sortDir, sortBy as keyof Inspection) : filtered;
  }, [searchTerm, filterStatus, sortBy, sortDir, data.inspections]);

  const PIE_COLORS = ["#dc2626", "#ea580c", "#d97706", "#06b6d4", "#10b981", "#7c3aed", "#ec4899", "#6366f1", "#f97316", "#14b8a6", "#8b5cf6", "#f43f5e"];

  return (
    <div className="mcs-root flex flex-col gap-4 p-4 md:p-6">
      <PageHeader
        title="Maritime Cargo Security & Surveillance"
        description="Port security operations, cargo scanning, surveillance monitoring & incident management across Indian ports"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mcs-tabs flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 h-auto">
          {["Security Dashboard", "Cargo Scanning", "Surveillance Network", "Security Zones", "Incident Tracker", "Inspection Audit"].map((tab, idx) => (
            <TabsTrigger key={idx} value={String(idx)} className="mcs-tab-trigger">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 0: Security Dashboard                  */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="0" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mcs-kpi-grid">
            {kpis.map((kpi, i) => (
              <Card key={i} className="mcs-kpi-card border-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800", kpi.color)}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold mcs-counter-value">{kpi.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{kpi.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{kpi.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="mcs-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Threat Level Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.threatTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-slate-500" />
                    <YAxis tick={{ fontSize: 11 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="critical" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} name="Critical" />
                    <Area type="monotone" dataKey="high" stackId="1" stroke="#ea580c" fill="#ea580c" fillOpacity={0.6} name="High" />
                    <Area type="monotone" dataKey="medium" stackId="1" stroke="#d97706" fill="#d97706" fillOpacity={0.6} name="Medium" />
                    <Area type="monotone" dataKey="low" stackId="1" stroke="#16a34a" fill="#16a34a" fillOpacity={0.6} name="Low" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="mcs-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Monthly Scan Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.scanVolume}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-slate-500" />
                    <YAxis tick={{ fontSize: 11 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="xray" stackId="a" fill="#06b6d4" name="X-Ray" />
                    <Bar dataKey="gamma" stackId="a" fill="#7c3aed" name="Gamma-Ray" />
                    <Bar dataKey="radiation" stackId="a" fill="#f59e0b" name="Radiation Portal" />
                    <Bar dataKey="mmWave" stackId="a" fill="#10b981" name="MM Wave" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="mcs-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Incidents by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.incidentByType} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={90} innerRadius={50} label={({ count }: { count: number }) => `${count}`} labelLine={false}>
                      {data.incidentByType.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="mcs-chart-card border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Zone Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.zoneCompliance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} className="text-slate-500" />
                    <YAxis dataKey="zone" type="category" width={80} tick={{ fontSize: 10 }} className="text-slate-500" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="compliance" radius={[0, 4, 4, 0]}>
                      {data.zoneCompliance.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.compliance >= 95 ? "#10b981" : entry.compliance >= 85 ? "#06b6d4" : entry.compliance >= 75 ? "#d97706" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 1: Cargo Scanning                       */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Search scan ID or container..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-8 text-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm"
            >
              <option value="All">All Results</option>
              {data.INSPECTION_RESULTS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="mcs-sort-header px-3 py-2 text-left cursor-pointer hover:text-cyan-600" onClick={() => handleSort("id")}>
                    Scan ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-3 py-2 text-left">Container</th>
                  <th className="px-3 py-2 text-left">Scan Type</th>
                  <th className="px-3 py-2 text-left">Result</th>
                  <th className="px-3 py-2 text-left">Threat</th>
                  <th className="px-3 py-2 text-left">Anomaly</th>
                  <th className="px-3 py-2 text-left">Operator</th>
                  <th className="px-3 py-2 text-left">Port</th>
                  <th className="px-3 py-2 text-left">Timestamp</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.slice(0, 20).map((scan) => (
                  <tr key={scan.id} className="mcs-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20">
                    <td className="px-3 py-2 font-mono text-xs font-semibold">{scan.id}</td>
                    <td className="px-3 py-2 font-mono text-xs">{scan.containerId}</td>
                    <td className="px-3 py-2">{scan.scanType}</td>
                    <td className="px-3 py-2">
                      <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold", inspectionColorMap[scan.result])}>
                        {scan.result}
                      </span>
                    </td>
                    <td className="px-3 py-2"><ThreatLevelRing level={scan.threatLevel} size={28} /></td>
                    <td className="px-3 py-2"><AnomalyScoreBar score={scan.anomalyScore} /></td>
                    <td className="px-3 py-2 text-xs">{scan.operator}</td>
                    <td className="px-3 py-2 text-xs">{scan.port}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">{scan.timestamp}</td>
                    <td className="px-3 py-2 text-center">
                      <Button size="sm" variant="ghost" className="mcs-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("scan", scan)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 2: Surveillance Network                 */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Search camera or zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-8 text-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm"
            >
              <option value="All">All Status</option>
              {["Online", "Alert", "Offline"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFeeds.slice(0, 18).map((feed) => (
              <Card
                key={feed.id}
                className="mcs-feed-card border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => openDrawer("feed", feed)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold">{feed.id}</span>
                    </div>
                    <CameraStatusIndicator status={feed.status} recording={feed.recording} />
                  </div>
                  <p className="text-sm font-semibold mb-1">{feed.cameraName}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{feed.cameraType}</span>
                    <span>•</span>
                    <span>{feed.resolution}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                    <span>{feed.zone}</span>
                    <span className="font-mono">{feed.port}</span>
                  </div>
                  {feed.alertCount > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{feed.alertCount} alerts</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 3: Security Zones                       */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Search zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-8 text-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm"
            >
              <option value="All">All Status</option>
              {data.ZONE_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredZones.map((zone) => (
              <Card
                key={zone.id}
                className="mcs-zone-card border-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                onClick={() => openDrawer("zone", zone)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-sm">{zone.zoneName}</h3>
                      <p className="text-xs text-slate-500">{zone.port}</p>
                    </div>
                    <ComplianceGauge value={zone.compliance} label="Compliance" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("text-xs font-semibold", zoneStatusColorMap[zone.status])}>{zone.status}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{zone.level}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{zone.personnel}</p>
                      <p className="text-[10px] text-slate-400">Guards</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-600 dark:text-slate-300">{zone.cameras}</p>
                      <p className="text-[10px] text-slate-400">Cams</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-600 dark:text-slate-300">{zone.barriers}</p>
                      <p className="text-[10px] text-slate-400">Barriers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-600 dark:text-slate-300">{zone.sensors}</p>
                      <p className="text-[10px] text-slate-400">Sensors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 4: Incident Tracker                     */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Search incident ID or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-8 text-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm"
            >
              <option value="All">All Severity</option>
              {data.THREAT_LEVELS.slice(0, 4).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="mcs-sort-header px-3 py-2 text-left cursor-pointer hover:text-red-600" onClick={() => handleSort("id")}>
                    ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Severity</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Location</th>
                  <th className="px-3 py-2 text-left">Reported By</th>
                  <th className="px-3 py-2 text-left">Port</th>
                  <th className="px-3 py-2 text-left">Cargo Ref</th>
                  <th className="px-3 py-2 text-left">Timestamp</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.slice(0, 20).map((inc) => (
                  <tr key={inc.id} className="mcs-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-red-50/50 dark:hover:bg-red-950/20">
                    <td className="px-3 py-2 font-mono text-xs font-semibold">{inc.id}</td>
                    <td className="px-3 py-2 text-xs">{inc.type}</td>
                    <td className="px-3 py-2">
                      <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-bold", threatColorMap[inc.severity])}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          inc.status === "Open" ? "text-red-600" : inc.status === "Resolved" || inc.status === "Closed" ? "text-emerald-600" : "text-amber-600"
                        )}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs">{inc.location}</td>
                    <td className="px-3 py-2 text-xs">{inc.reportedBy}</td>
                    <td className="px-3 py-2 text-xs">{inc.port}</td>
                    <td className="px-3 py-2 font-mono text-xs">{inc.cargoRef}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">{inc.timestamp}</td>
                    <td className="px-3 py-2 text-center">
                      <Button size="sm" variant="ghost" className="mcs-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("incident", inc)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab 5: Inspection Audit                     */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Search inspection ID or container..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-8 text-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-sm"
            >
              <option value="All">All Results</option>
              {data.INSPECTION_RESULTS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="mcs-sort-header px-3 py-2 text-left cursor-pointer hover:text-teal-600" onClick={() => handleSort("id")}>
                    ID {sortBy === "id" && (sortDir === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-3 py-2 text-left">Container</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Result</th>
                  <th className="px-3 py-2 text-left">Weight Var.</th>
                  <th className="px-3 py-2 text-left">Inspector</th>
                  <th className="px-3 py-2 text-left">Port</th>
                  <th className="px-3 py-2 text-left">Cargo Wt.</th>
                  <th className="px-3 py-2 text-left">Timestamp</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.slice(0, 20).map((ins) => (
                  <tr key={ins.id} className="mcs-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-teal-50/50 dark:hover:bg-teal-950/20">
                    <td className="px-3 py-2 font-mono text-xs font-semibold">{ins.id}</td>
                    <td className="px-3 py-2 font-mono text-xs">{ins.containerId}</td>
                    <td className="px-3 py-2 text-xs">{ins.category}</td>
                    <td className="px-3 py-2">
                      <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold", inspectionColorMap[ins.result])}>
                        {ins.result}
                      </span>
                    </td>
                    <td className="px-3 py-2"><WeightVarianceBadge variance={ins.weightVariance} /></td>
                    <td className="px-3 py-2 text-xs">{ins.inspector}</td>
                    <td className="px-3 py-2 text-xs">{ins.port}</td>
                    <td className="px-3 py-2 font-mono text-xs">{ins.cargoWeight}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">{ins.timestamp}</td>
                    <td className="px-3 py-2 text-center">
                      <Button size="sm" variant="ghost" className="mcs-action-btn h-7 px-2 text-xs" onClick={() => openDrawer("inspection", ins)}>
                        View
                      </Button>
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
              {drawerType === "scan" && "Cargo Scan Details"}
              {drawerType === "feed" && "Camera Feed Details"}
              {drawerType === "zone" && "Security Zone Details"}
              {drawerType === "incident" && "Incident Details"}
              {drawerType === "inspection" && "Inspection Details"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {drawerType === "scan" && drawerData && (
              <ScanDrawer
                data={drawerData}
                toast={toast}
                fields={[
                  { label: "Container ID", value: drawerData.containerId },
                  { label: "Scan Type", value: drawerData.scanType },
                  { label: "Operator", value: drawerData.operator },
                  { label: "Port", value: drawerData.port },
                  { label: "Timestamp", value: drawerData.timestamp },
                  { label: "Duration", value: drawerData.duration },
                ]}
              />
            )}
            {drawerType === "feed" && drawerData && (
              <FeedDrawer
                data={drawerData}
                toast={toast}
                fields={[
                  { label: "Zone", value: drawerData.zone },
                  { label: "Resolution", value: drawerData.resolution },
                  { label: "FPS", value: String(drawerData.fps) },
                  { label: "Port", value: drawerData.port },
                  { label: "Alert Count", value: String(drawerData.alertCount) },
                  { label: "Last Motion", value: drawerData.lastMotion },
                ]}
              />
            )}
            {drawerType === "zone" && drawerData && (
              <ZoneDrawer
                data={drawerData}
                toast={toast}
                fields={[
                  { label: "Security Level", value: drawerData.level },
                  { label: "Status", value: drawerData.status },
                  { label: "Area", value: drawerData.area },
                  { label: "Port", value: drawerData.port },
                  { label: "Last Inspection", value: drawerData.lastInspection },
                  { label: "Compliance", value: `${drawerData.compliance}%` },
                ]}
              />
            )}
            {drawerType === "incident" && drawerData && (
              <IncidentDrawer
                data={drawerData}
                toast={toast}
                fields={[
                  { label: "Location", value: drawerData.location },
                  { label: "Reported By", value: drawerData.reportedBy },
                  { label: "Port", value: drawerData.port },
                  { label: "Cargo Ref", value: drawerData.cargoRef },
                  { label: "Reported", value: drawerData.timestamp },
                  { label: "Resolved", value: drawerData.resolvedAt },
                ]}
              />
            )}
            {drawerType === "inspection" && drawerData && (
              <InspectionDrawer
                data={drawerData}
                toast={toast}
                fields={[
                  { label: "Container", value: drawerData.containerId },
                  { label: "Category", value: drawerData.category },
                  { label: "Inspector", value: drawerData.inspector },
                  { label: "Port", value: drawerData.port },
                  { label: "Cargo Weight", value: drawerData.cargoWeight },
                  { label: "Declared Weight", value: drawerData.declaredWeight },
                ]}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
