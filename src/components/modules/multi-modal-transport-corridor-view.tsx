"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, Eye, Filter, Clock,
  FileText, TrendingUp, TrendingDown, Activity, AlertTriangle,
  CheckCircle2, XCircle, Timer, Train, Ship, Truck, Plane, Anchor,
  IndianRupee, Percent, ChevronRight, ChevronDown, AlertOctagon,
  FileWarning, ShieldCheck, Ban, Scale, Package, MapPin, Route,
  Gauge, ThermometerSun, Waves, Mountain, Globe2, Zap, Info, BarChart3,
  CircleDot, RotateCcw, Warehouse, Navigation2, Compass, Fuel, Weight,
  ArrowRightLeft, FileCheck, ClipboardCheck, Radio,
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
  const rand = seededRandom(2059901);

  const corridors = [
    "Delhi-Mumbai Industrial Corridor", "Chennai-Bangalore Industrial Corridor",
    "Kolkata-Mumbai Freight Corridor", "Delhi-Kolkata Eastern Corridor",
    "Mumbai-Chennai Coastal Corridor", "Delhi-Chennai Southern Corridor",
    "Ahmedabad-Jaipur Golden Quadrant", "Hyderabad-Mumbai Western Link",
    "Kochi-Mangalore Coastal Link", "Guwahati-Kolkata NE Corridor",
    "Chandigarh-Ludhiana Industrial", "Pune-Goa Port Link",
  ] as const;

  const transportModes = [
    "Rail", "Road", "Coastal Shipping", "Inland Waterway", "Air Cargo", "Multimodal",
  ] as const;

  const cargoTypes = [
    "Containerized FCL", "Containerized LCL", "Bulk Dry", "Bulk Liquid",
    "Break Bulk", "OOG (Over Dimensional)", "Perishable", "Hazardous",
    "Cold Chain", "High Value",
  ] as const;

  const terminals = [
    "Nhava Sheva JNPT", "Mundra Port", "Chennai Port", "Kolkata Haldia",
    "Cochin Port", "Tuticorin V.O.Chidambaranar", "Kandla Port",
    "Visakhapatnam Port", "Paradip Port", "Ennore Kamarajar",
    "DMIC Dadri ICD", "CONCOR Tughlakabad ICD", "APM Mumbai",
    "DP World Chennai", "Adani Hazira", "IGI Airport Cargo",
    "CSIA Mumbai Cargo", "BLR Kempegowda Cargo", "MAA Chennai Air Cargo",
    "CCU Kolkata Air Cargo",
  ] as const;

  const operators = [
    "CONCOR", "DFDS", "Maersk Line", "MSC India", "Blue Dart",
    "Delhivery Express", "DTDC Cargo", "Gati Logistics", "Allcargo Logistics",
    "VRL Logistics", "Container Corporation", "Indian Railways FREIGHT",
    "DHL Supply Chain", "FedEx India", "TNT Express",
  ] as const;

  const corridorStatuses = [
    "Active", "Under Optimization", "Capacity Expansion", "Maintenance",
    "Seasonal Restricted", "Suspended",
  ] as const;

  const shipmentStatuses = [
    "Booked", "In Transit", "At Terminal", "Customs Hold", "Inspection",
    "Transloading", "Delivered", "Delayed", "Cancelled",
  ] as const;

  const riskLevels = ["Low", "Medium", "High", "Critical", "Extreme"] as const;

  const priorityLevels = ["Standard", "Economy", "Priority", "Express", "Emergency"] as const;

  const incidentTypes = [
    "Port Congestion", "Weather Disruption", "Equipment Failure",
    "Customs Delay", "Route Blockage", "Labor Strike", "Document Issue",
    "Cargo Damage", "Security Alert", "Fuel Shortage", "Schedule Change",
  ] as const;

  const documentTypes = [
    "Bill of Lading", "Customs Declaration", "E-Way Bill", "GST Invoice",
    "Certificate of Origin", "Phytosanitary Cert", "Insurance Cert",
    "Packing List", "Delivery Order", "Terminal Receipt",
  ] as const;

  // --- Corridor Data ---
  const corridorRecords = Array.from({ length: 70 }, (_, i) => {
    const mode1 = transportModes[Math.floor(rand() * transportModes.length)];
    let mode2 = transportModes[Math.floor(rand() * transportModes.length)];
    while (mode2 === mode1) mode2 = transportModes[Math.floor(rand() * transportModes.length)];
    const status = corridorStatuses[Math.floor(rand() * corridorStatuses.length)];
    const capacity = Math.floor(rand() * 8000) + 2000;
    const utilization = status === "Suspended" ? 0 : Math.floor(rand() * 60) + 30;
    const transitHrs = Math.floor(rand() * 72) + 12;
    const reliability = status === "Suspended" ? 0 : Math.floor(rand() * 25) + 70;
    return {
      id: i + 1,
      corridorName: corridors[i % corridors.length],
      origin: terminals[Math.floor(rand() * terminals.length)],
      destination: terminals[Math.floor(rand() * terminals.length)],
      primaryMode: mode1,
      secondaryMode: mode2,
      status,
      capacity,
      utilization,
      avgTransitHrs: transitHrs,
      onTimeReliability: reliability,
      costPerTon: Math.floor(rand() * 5000) + 1500,
      distanceKm: Math.floor(rand() * 2000) + 200,
      weeklyShipments: Math.floor(rand() * 50) + 5,
      weeklyTEU: Math.floor(rand() * 500) + 50,
      riskScore: Math.floor(rand() * 10) + 1,
      co2PerTonKm: +(rand() * 80 + 20).toFixed(1),
      lastIncident: `2026-0${Math.min(9, (Math.floor(rand() * 6) + 1)).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      nextMaintenance: `2026-0${Math.min(9, (Math.floor(rand() * 3) + 7)).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
    };
  });

  // --- Shipment Data ---
  const shipments = Array.from({ length: 80 }, (_, i) => {
    const status = shipmentStatuses[Math.floor(rand() * shipmentStatuses.length)];
    const mode = transportModes[Math.floor(rand() * transportModes.length)];
    const transitPct = status === "Booked" ? 0 : status === "Delivered" ? 100 : Math.floor(rand() * 90) + 5;
    return {
      id: i + 1,
      shipmentId: `SHP-${String(205000 + i).padStart(6, "0")}`,
      corridor: corridors[i % corridors.length],
      origin: terminals[Math.floor(rand() * terminals.length)],
      destination: terminals[Math.floor(rand() * terminals.length)],
      mode,
      status,
      cargoType: cargoTypes[Math.floor(rand() * cargoTypes.length)],
      operator: operators[i % operators.length],
      priority: priorityLevels[Math.floor(rand() * priorityLevels.length)],
      weight: Math.floor(rand() * 25000) + 500,
      teu: Math.floor(rand() * 10) + 1,
      value: Math.floor(rand() * 5000000) + 100000,
      bookedDate: `2026-0${(Math.floor(rand() * 6) + 1).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      eta: `2026-0${Math.min(9, (Math.floor(rand() * 3) + 4)).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      transitProgress: transitPct,
      currentLocation: status === "Delivered" ? "Destination Terminal" : terminals[Math.floor(rand() * terminals.length)],
      totalCost: Math.floor(rand() * 300000) + 20000,
      gstAmount: Math.floor((Math.floor(rand() * 300000) + 20000) * 0.18),
      insurance: Math.floor(rand() * 50000) + 5000,
      trackingUpdates: Math.floor(rand() * 15) + 2,
    };
  });

  // --- Terminal Throughput ---
  const terminalThroughput = Array.from({ length: 60 }, (_, i) => {
    return {
      id: i + 1,
      terminal: terminals[i % terminals.length],
      month: `2026-${String((Math.floor(rand() * 12) + 1)).padStart(2, "0")}`,
      teuHandled: Math.floor(rand() * 8000) + 500,
      vesselsProcessed: Math.floor(rand() * 40) + 5,
      avgDwellTime: +(rand() * 5 + 1).toFixed(1),
      truckTurnaround: +(rand() * 8 + 2).toFixed(1),
      railLoads: Math.floor(rand() * 200) + 20,
      throughputChange: Math.floor(rand() * 30) - 10,
      utilizationPct: Math.floor(rand() * 50) + 40,
    };
  });

  // --- Incidents ---
  const incidents = Array.from({ length: 45 }, (_, i) => {
    const risk = riskLevels[Math.floor(rand() * riskLevels.length)];
    return {
      id: i + 1,
      incidentId: `INC-${String(900 + i).padStart(4, "0")}`,
      corridor: corridors[i % corridors.length],
      type: incidentTypes[Math.floor(rand() * incidentTypes.length)],
      severity: risk,
      status: ["Open", "Investigating", "Mitigated", "Resolved", "Escalated"][Math.floor(rand() * 5)] as string,
      reportedDate: `2026-0${(Math.floor(rand() * 6) + 1).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      resolvedDate: risk === "Low" ? `2026-0${Math.min(9, (Math.floor(rand() * 3) + 4)).toString().padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}` : "—",
      impactDuration: Math.floor(rand() * 120) + 1,
      affectedShipments: Math.floor(rand() * 30) + 1,
      financialImpact: Math.floor(rand() * 5000000) + 50000,
      rootCause: ["Equipment", "Human Error", "Weather", "Process Gap", "Third Party", "Infrastructure"][Math.floor(rand() * 6)] as string,
      correctiveAction: ["Route Diversion", "Equipment Replacement", "Schedule Adjustment", "Escalation", "Claim Filed", "Preventive Maintenance"][Math.floor(rand() * 6)] as string,
      assignee: ["Arjun M.", "Deepika S.", "Karthik R.", "Meera J.", "Rohan P.", "Sanjay K."][Math.floor(rand() * 6)] as string,
    };
  });

  // --- KPI Data ---
  const kpis = {
    activeCorridors: corridorRecords.filter(c => ["Active", "Under Optimization", "Capacity Expansion"].includes(c.status)).length,
    totalShipments: shipments.filter(s => !["Delivered", "Cancelled"].includes(s.status)).length,
    avgReliability: Math.round(corridorRecords.filter(c => c.status !== "Suspended").reduce((s, c) => s + c.onTimeReliability, 0) / corridorRecords.filter(c => c.status !== "Suspended").length),
    openIncidents: incidents.filter(inc => ["Open", "Investigating", "Escalated"].includes(inc.status)).length,
    totalTEUWeek: corridorRecords.reduce((s, c) => s + c.weeklyTEU, 0),
    avgTransitHrs: Math.round(corridorRecords.filter(c => c.status !== "Suspended").reduce((s, c) => s + c.avgTransitHrs, 0) / corridorRecords.filter(c => c.status !== "Suspended").length),
    avgCostPerTon: Math.round(corridorRecords.reduce((s, c) => s + c.costPerTon, 0) / corridorRecords.length),
    co2Saved: Math.floor(rand() * 500) + 100,
  };

  // --- Chart Data ---
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyThroughput = months.map(m => ({
    month: m,
    Rail: Math.floor(rand() * 3000) + 1000,
    Road: Math.floor(rand() * 4000) + 2000,
    Coastal: Math.floor(rand() * 1500) + 500,
    Air: Math.floor(rand() * 300) + 100,
    Waterway: Math.floor(rand() * 800) + 200,
  }));

  const modeDistribution = transportModes.map(m => ({
    name: m,
    value: Math.floor(rand() * 5000) + 500,
  }));

  const corridorPerformance = corridors.slice(0, 8).map(c => ({
    corridor: c.length > 22 ? c.slice(0, 22) : c,
    Reliability: Math.floor(rand() * 25) + 70,
    Capacity: Math.floor(rand() * 40) + 40,
    CostEfficiency: Math.floor(rand() * 30) + 60,
  }));

  const carbonByMode = transportModes.map(m => ({
    mode: m,
    co2: +(rand() * 80 + 20).toFixed(1),
    target: +(rand() * 40 + 30).toFixed(1),
  }));

  const transitTrend = months.map(m => ({
    month: m,
    Actual: Math.floor(rand() * 15) + 20,
    Target: 28,
    Optimal: 18,
  }));

  // --- Analytics ---
  const analyticsKpis = {
    avgCostSavings: Math.floor(rand() * 20000000) + 5000000,
    modalShiftPct: Math.floor(rand() * 15) + 8,
    emptyMilesReduced: Math.floor(rand() * 30) + 10,
    dwellTimeImprovement: +(rand() * 20 + 5).toFixed(1),
    corridorUtilization: Math.floor(rand() * 20) + 65,
    greenLogisticsScore: Math.floor(rand() * 20) + 65,
    customerNPS: Math.floor(rand() * 20) + 55,
    roiPercent: Math.floor(rand() * 15) + 12,
  };

  const analyticsCharts = {
    modeComparison: transportModes.map(m => ({
      mode: m,
      Cost: Math.floor(rand() * 5000) + 1000,
      Speed: Math.floor(rand() * 60) + 10,
      Reliability: Math.floor(rand() * 25) + 70,
    })),
    savingsTrend: months.slice(0, 6).map(m => ({
      month: m,
      Savings: Math.floor(rand() * 5000000) + 1000000,
      Investment: Math.floor(rand() * 2000000) + 500000,
    })),
    riskDistribution: riskLevels.map(r => ({
      name: r,
      value: Math.floor(rand() * 20) + 2,
    })),
  };

  return {
    corridors, transportModes, cargoTypes, terminals, operators,
    corridorStatuses, shipmentStatuses, riskLevels, priorityLevels,
    incidentTypes, documentTypes,
    corridorRecords, shipments, terminalThroughput, incidents,
    kpis, monthlyThroughput, modeDistribution, corridorPerformance,
    carbonByMode, transitTrend, analyticsKpis, analyticsCharts, months,
  };
}

const data = generateData();

// ============================================================================
// Unique Visual Components
// ============================================================================

function TransportModeIcon({ mode }: { mode: string }) {
  const iconClass = "w-4 h-4";
  switch (mode) {
    case "Rail": return <Train className={cn(iconClass, "text-blue-600")} />;
    case "Road": return <Truck className={cn(iconClass, "text-amber-600")} />;
    case "Coastal Shipping": return <Ship className={cn(iconClass, "text-teal-600")} />;
    case "Inland Waterway": return <Waves className={cn(iconClass, "text-cyan-600")} />;
    case "Air Cargo": return <Plane className={cn(iconClass, "text-purple-600")} />;
    default: return <ArrowRightLeft className={cn(iconClass, "text-slate-600")} />;
  }
}

function CorridorStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    "Under Optimization": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "Capacity Expansion": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    Maintenance: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "Seasonal Restricted": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    Suspended: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  return <span className={cn("mtc-pill mtc-status-badge px-2 py-0.5 rounded-full text-xs font-medium", colors[status] || "bg-gray-100 text-gray-600")}>{String(status)}</span>;
}

function ShipmentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Booked: "bg-slate-100 text-slate-600", "In Transit": "bg-blue-100 text-blue-700",
    "At Terminal": "bg-amber-100 text-amber-700", "Customs Hold": "bg-red-100 text-red-700",
    Inspection: "bg-purple-100 text-purple-700", Transloading: "bg-cyan-100 text-cyan-700",
    Delivered: "bg-emerald-100 text-emerald-700", Delayed: "bg-orange-100 text-orange-700",
    Cancelled: "bg-rose-100 text-rose-700",
  };
  return <span className={cn("mtc-pill mtc-status-badge px-2 py-0.5 rounded-full text-xs font-medium", colors[status] || "bg-gray-100")}>{String(status)}</span>;
}

function RiskLevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Low: "bg-emerald-100 text-emerald-700", Medium: "bg-amber-100 text-amber-700",
    High: "bg-orange-100 text-orange-700", Critical: "bg-red-600 text-white mtc-risk-critical",
    Extreme: "bg-rose-700 text-white mtc-risk-critical",
  };
  return <span className={cn("mtc-pill px-2 py-0.5 rounded-full text-xs font-bold", colors[level] || "bg-gray-100")}>{String(level)}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    Standard: "bg-slate-100 text-slate-600", Economy: "bg-blue-50 text-blue-600",
    Priority: "bg-amber-100 text-amber-700", Express: "bg-orange-100 text-orange-700",
    Emergency: "bg-red-600 text-white mtc-risk-critical",
  };
  return <span className={cn("px-2 py-0.5 rounded text-xs font-bold", colors[priority] || "bg-gray-100")}>{String(priority)}</span>;
}

function ModeBadge({ mode }: { mode: string }) {
  const colors: Record<string, string> = {
    Rail: "bg-blue-100 text-blue-700", Road: "bg-amber-100 text-amber-700",
    "Coastal Shipping": "bg-teal-100 text-teal-700", "Inland Waterway": "bg-cyan-100 text-cyan-700",
    "Air Cargo": "bg-purple-100 text-purple-700", Multimodal: "bg-indigo-100 text-indigo-700",
  };
  return <span className={cn("mtc-pill mtc-mode-badge flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border", colors[mode] || "bg-gray-100")}><TransportModeIcon mode={mode} />{String(mode)}</span>;
}

function CargoTypeBadge({ type }: { type: string }) {
  const colors = ["bg-emerald-50 text-emerald-700", "bg-blue-50 text-blue-700", "bg-amber-50 text-amber-700", "bg-purple-50 text-purple-700", "bg-rose-50 text-rose-700", "bg-teal-50 text-teal-700", "bg-orange-50 text-orange-700", "bg-red-50 text-red-700", "bg-cyan-50 text-cyan-700", "bg-indigo-50 text-indigo-700"];
  return <span className={cn("px-2 py-0.5 rounded text-xs font-medium", colors[type.length % colors.length])}>{String(type)}</span>;
}

function UtilizationBar({ pct }: { pct: number }) {
  const color = pct < 50 ? "#059669" : pct < 75 ? "#d97706" : pct < 90 ? "#ea580c" : "#dc2626";
  return (
    <div className="mtc-heat-bar w-full h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
      <div className="mtc-util-fill h-full rounded" style={{ width: `${Math.min(100, pct)}%`, background: color, transition: "width 0.8s ease-out" }} />
    </div>
  );
}

function ReliabilityRing({ value }: { value: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 90 ? "#059669" : value >= 75 ? "#d97706" : "#dc2626";
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="mtc-score-ring">
      <circle cx="34" cy="34" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-700" />
      <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 34 34)" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      <text x="34" y="36" textAnchor="middle" className="text-xs font-bold fill-current" style={{ color }}>{String(value)}%</text>
    </svg>
  );
}

function CarbonScoreGauge({ co2, target }: { co2: number; target: number }) {
  const pct = Math.min(100, (co2 / target) * 100);
  const color = pct < 70 ? "#059669" : pct < 90 ? "#d97706" : "#dc2626";
  const r = 32;
  const circ = Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="80" height="48" viewBox="0 0 80 48" className="mtc-gauge">
      <path d="M 8 40 A 32 32 0 0 1 72 40" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-slate-200 dark:text-slate-700" />
      <path d="M 8 40 A 32 32 0 0 1 72 40" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 0.8s ease-out" }} />
      <text x="40" y="38" textAnchor="middle" className="text-xs font-bold fill-current" style={{ color }}>{String(co2)}</text>
      <text x="40" y="46" textAnchor="middle" className="text-[8px] text-muted-foreground">g/t-km</text>
    </svg>
  );
}

function TransitProgressBar({ pct, status }: { pct: number; status: string }) {
  const color = status === "Delayed" ? "#ea580c" : status === "Customs Hold" ? "#dc2626" : "#0d9488";
  return (
    <div className="mtc-transit-bar w-full">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] text-muted-foreground">Transit</span>
        <span className={cn("text-[10px] font-bold tabular-nums", pct >= 90 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-slate-500")}>{String(pct)}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: "width 0.8s ease-out" }} />
      </div>
    </div>
  );
}

function ModeSplitChart({ rail, road, coastal, other }: { rail: number; road: number; coastal: number; other: number }) {
  const total = rail + road + coastal + other;
  const rPct = Math.round((rail / total) * 100);
  const roPct = Math.round((road / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-2 rounded-full overflow-hidden flex-1">
        <div className="bg-blue-500" style={{ width: `${rPct}%` }} />
        <div className="bg-amber-500" style={{ width: `${roPct}%` }} />
        <div className="bg-teal-500" style={{ width: `${100 - rPct - roPct > 0 ? 100 - rPct - roPct : 0}%` }} />
      </div>
      <span className="text-[10px] text-muted-foreground tabular-nums">{rPct}/{roPct}</span>
    </div>
  );
}

function DwellTimeSpark({ dwellTime, change }: { dwellTime: number; change: number }) {
  const isGood = change <= 0;
  return (
    <div className="flex items-center gap-1">
      <span className={cn("text-xs font-bold tabular-nums", dwellTime > 4 ? "text-red-600" : dwellTime > 2.5 ? "text-amber-600" : "text-emerald-600")}>{String(dwellTime)}d</span>
      <span className={cn("text-[10px] font-medium tabular-nums", isGood ? "text-emerald-600" : "text-red-600")}>{isGood ? "" : "+"}{String(change)}%</span>
    </div>
  );
}

function IncidentSeverityIndicator({ severity }: { severity: string }) {
  const colors: Record<string, string> = { Low: "#059669", Medium: "#d97706", High: "#ea580c", Critical: "#dc2626", Extreme: "#be123c" };
  const c = colors[severity] || "#64748b";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: severity === "Critical" || severity === "Extreme" ? `0 0 6px ${c}` : "none" }} />
      <span className="text-xs font-medium" style={{ color: c }}>{String(severity)}</span>
    </div>
  );
}

function DocumentStatusTracker({ docs }: { docs: Record<string, boolean> }) {
  const items = Object.entries(docs).slice(0, 5);
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([name, ok]) => (
        <span key={name} className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium", ok ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-400")}>
          {ok ? <FileCheck className="w-3 h-3" /> : <FileWarning className="w-3 h-3" />}
          {name}
        </span>
      ))}
    </div>
  );
}

function CorridorRouteIndicator({ origin, destination, modes }: { origin: string; destination: string; modes: string[] }) {
  const shortOrigin = origin.length > 15 ? origin.slice(0, 15) : origin;
  const shortDest = destination.length > 15 ? destination.slice(0, 15) : destination;
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="font-medium text-slate-700 dark:text-slate-300">{shortOrigin}</span>
      <div className="flex items-center gap-0.5">
        {modes.slice(0, 3).map((m, i) => (
          <React.Fragment key={i}>
            <div className="w-3 h-0.5 bg-slate-400 dark:bg-slate-600" />
            <TransportModeIcon mode={m} />
          </React.Fragment>
        ))}
        <div className="w-3 h-0.5 bg-slate-400 dark:bg-slate-600" />
      </div>
      <span className="font-medium text-slate-700 dark:text-slate-300">{shortDest}</span>
    </div>
  );
}

const CHART_COLORS = ["#0369a1", "#d97706", "#0d9488", "#7c3aed", "#be123c", "#475569"];

// ============================================================================
// Main Component
// ============================================================================
export default function MultiModalTransportCorridorView() {
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
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 ml-1 text-blue-600" /> : <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />;
  };

  // --- Tab 1: Corridor sorting ---
  const filteredCorridors = useMemo(() => {
    let arr = [...data.corridorRecords];
    if (statusFilter !== "all") arr = arr.filter(c => c.status === statusFilter);
    if (searchTerm) arr = arr.filter(c => c.corridorName.toLowerCase().includes(searchTerm.toLowerCase()) || c.origin.toLowerCase().includes(searchTerm.toLowerCase()) || c.destination.toLowerCase().includes(searchTerm.toLowerCase()));
    arr.sort((a, b) => {
      const va = (a as Record<string, unknown>)[sortField];
      const vb = (b as Record<string, unknown>)[sortField];
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [searchTerm, statusFilter, sortField, sortDir]);

  // --- Tab 2: Shipment sorting ---
  const filteredShipments = useMemo(() => {
    let arr = [...data.shipments];
    if (statusFilter !== "all") arr = arr.filter(s => s.status === statusFilter);
    if (searchTerm) arr = arr.filter(s => s.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) || s.cargoType.toLowerCase().includes(searchTerm.toLowerCase()) || s.operator.toLowerCase().includes(searchTerm.toLowerCase()));
    arr.sort((a, b) => {
      const va = (a as Record<string, unknown>)[sortField];
      const vb = (b as Record<string, unknown>)[sortField];
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [searchTerm, statusFilter, sortField, sortDir]);

  // --- Tab 5: Incident sorting ---
  const filteredIncidents = useMemo(() => {
    let arr = [...data.incidents];
    if (statusFilter !== "all") arr = arr.filter(inc => inc.status === statusFilter);
    if (searchTerm) arr = arr.filter(inc => inc.incidentId.toLowerCase().includes(searchTerm.toLowerCase()) || inc.type.toLowerCase().includes(searchTerm.toLowerCase()));
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
    <div className="mtc-root flex flex-col gap-4 p-4">
      <PageHeader title="Multi-Modal Transport Corridor" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          {["Corridor Dashboard", "Shipment Tracker", "Terminal Throughput", "Carbon & Sustainability", "Incidents & Risks", "Corridor Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="data-[state=active]:shadow-md">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ====== TAB 0: Dashboard ====== */}
        <TabsContent value="0" className="space-y-4 mt-4">
          <div className="mtc-kpi-grid grid grid-cols-4 gap-4">
            {[
              { label: "Active Corridors", value: k.activeCorridors, icon: <Route className="w-4 h-4" /> },
              { label: "Active Shipments", value: k.totalShipments, icon: <Package className="w-4 h-4" /> },
              { label: "Avg Reliability", value: `${k.avgReliability}%`, icon: <ShieldCheck className="w-4 h-4" /> },
              { label: "Open Incidents", value: k.openIncidents, icon: <AlertTriangle className="w-4 h-4" /> },
              { label: "Weekly TEU", value: k.totalTEUWeek.toLocaleString(), icon: <ContainerIcon className="w-4 h-4" /> },
              { label: "Avg Transit Time", value: `${k.avgTransitHrs}h`, icon: <Clock className="w-4 h-4" /> },
              { label: "Avg Cost/Ton", value: formatINR(k.avgCostPerTon), icon: <IndianRupee className="w-4 h-4" /> },
              { label: "CO2 Saved (t)", value: k.co2Saved, icon: <Globe2 className="w-4 h-4" /> },
            ].map((item, idx) => (
              <Card key={idx} className="hover-lift-sm mtc-kpi-card">
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
                  <CardTitle className="text-xs text-muted-foreground font-medium">{item.label}</CardTitle>
                  <span className="text-muted-foreground">{item.icon}</span>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle px-4 pb-3"><div className="text-xl font-bold tabular-nums">{item.value}</div></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Mode Throughput (TEU)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><AreaChart data={data.monthlyThroughput}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Area type="monotone" dataKey="Rail" stackId="1" stroke="#0369a1" fill="#bae6fd" /><Area type="monotone" dataKey="Road" stackId="1" stroke="#d97706" fill="#fde68a" /><Area type="monotone" dataKey="Coastal" stackId="1" stroke="#0d9488" fill="#99f6e4" /><Area type="monotone" dataKey="Waterway" stackId="1" stroke="#06b6d4" fill="#cffafe" /><Area type="monotone" dataKey="Air" stackId="1" stroke="#7c3aed" fill="#ede9fe" /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Mode Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={data.modeDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}>{data.modeDistribution.map((_: unknown, idx: number) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Corridor Performance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.corridorPerformance}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="corridor" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 11 }} domain={[0, 100]} /><Tooltip /><Legend /><Bar dataKey="Reliability" fill="#0369a1" radius={[2, 2, 0, 0]} /><Bar dataKey="Capacity" fill="#0d9488" radius={[2, 2, 0, 0]} /><Bar dataKey="CostEfficiency" fill="#d97706" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Transit Time Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><LineChart data={data.transitTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} unit="h" /><Tooltip /><Legend /><Line type="monotone" dataKey="Actual" stroke="#0369a1" strokeWidth={2} /><Line type="monotone" dataKey="Target" stroke="#d97706" strokeDasharray="5 5" /><Line type="monotone" dataKey="Optimal" stroke="#059669" strokeDasharray="2 2" /></LineChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>

        {/* ====== TAB 1: Shipment Tracker ====== */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search shipment, operator, cargo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background"><option value="all">All Statuses</option>{data.shipmentStatuses.map(s => <option key={String(s)} value={String(s)}>{String(s)}</option>)}</select>
          </div>
          <div className="rounded-lg border overflow-auto max-h-[520px]">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                  {[
                    { key: "shipmentId", label: "Shipment" }, { key: "mode", label: "Mode" },
                    { key: "origin", label: "Origin" }, { key: "destination", label: "Destination" },
                    { key: "cargoType", label: "Cargo" }, { key: "status", label: "Status" },
                    { key: "transitProgress", label: "Progress" }, { key: "totalCost", label: "Cost" },
                    { key: "eta", label: "ETA" },
                  ].map(h => (
                    <th key={h.key} className="mtc-sort-header px-3 py-2 text-left font-medium cursor-pointer" onClick={() => toggleSort(h.key)}>
                      {h.label}<SortIcon field={h.key} />
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="mtc-tbody">
                {filteredShipments.map((s, idx) => (
                  <tr key={String(s.id)} className="mtc-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => { setDrawerRecord(s as unknown as Record<string, unknown>); setDrawerOpen(true); }}>
                    <td className="px-3 py-2 font-mono font-medium text-slate-800 dark:text-slate-200">{String(s.shipmentId)}</td>
                    <td className="px-3 py-2"><ModeBadge mode={String(s.mode)} /></td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400 max-w-[100px] truncate">{String(s.origin)}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400 max-w-[100px] truncate">{String(s.destination)}</td>
                    <td className="px-3 py-2"><CargoTypeBadge type={String(s.cargoType)} /></td>
                    <td className="px-3 py-2"><ShipmentStatusBadge status={String(s.status)} /></td>
                    <td className="px-3 py-2 min-w-[80px]"><TransitProgressBar pct={Number(s.transitProgress)} status={String(s.status)} /></td>
                    <td className="px-3 py-2 font-semibold tabular-nums">{formatINR(Number(s.totalCost))}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">{String(s.eta)}</td>
                    <td className="press-scale px-3 py-2"><Button size="sm" variant="ghost" className="mtc-action-btn" onClick={(e) => { e.stopPropagation(); setDrawerRecord(s as unknown as Record<string, unknown>); setDrawerOpen(true); }}><Eye className="w-3.5 h-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ====== TAB 2: Terminal Throughput ====== */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Terminal Utilization</CardTitle></CardHeader><CardContent><div className="space-y-3 max-h-[350px] overflow-y-auto">{data.terminalThroughput.filter((_, idx) => idx < 20).map((t, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground min-w-[120px] truncate">{String(t.terminal)}</span>
                <div className="flex-1"><UtilizationBar pct={Number(t.utilizationPct)} /></div>
                <span className="text-xs font-bold tabular-nums w-8 text-right">{String(t.utilizationPct)}%</span>
              </div>
            ))}</div></CardContent></Card>
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">TEU by Terminal</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={350}><BarChart data={data.terminalThroughput.filter((_, i) => i < 10).map(t => ({ terminal: String(t.terminal).length > 12 ? String(t.terminal).slice(0, 12) : String(t.terminal), teu: Number(t.teuHandled) }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis dataKey="terminal" type="category" tick={{ fontSize: 9 }} width={80} /><Tooltip /><Bar dataKey="teu" fill="#0369a1" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
          <div className="rounded-lg border overflow-auto max-h-[400px]">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Terminal</th>
                  <th className="px-3 py-2 text-left font-medium">TEU</th>
                  <th className="px-3 py-2 text-left font-medium">Vessels</th>
                  <th className="px-3 py-2 text-left font-medium">Avg Dwell</th>
                  <th className="px-3 py-2 text-left font-medium">Truck TA</th>
                  <th className="px-3 py-2 text-left font-medium">Rail Loads</th>
                  <th className="px-3 py-2 text-left font-medium">Utilization</th>
                </tr>
              </thead>
              <tbody className="mtc-tbody">
                {data.terminalThroughput.map((t, idx) => (
                  <tr key={idx} className="mtc-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{String(t.terminal)}</td>
                    <td className="px-3 py-2 font-bold tabular-nums">{Number(t.teuHandled).toLocaleString()}</td>
                    <td className="px-3 py-2 tabular-nums">{String(t.vesselsProcessed)}</td>
                    <td className="px-3 py-2"><DwellTimeSpark dwellTime={Number(t.avgDwellTime)} change={Number(t.throughputChange)} /></td>
                    <td className="px-3 py-2 tabular-nums">{String(t.truckTurnaround)}h</td>
                    <td className="px-3 py-2 tabular-nums">{Number(t.railLoads).toLocaleString()}</td>
                    <td className="px-3 py-2"><UtilizationBar pct={Number(t.utilizationPct)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ====== TAB 3: Carbon & Sustainability ====== */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">CO2 Emissions by Mode (g/t-km)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={data.carbonByMode}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mode" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 11 }} unit="g" /><Tooltip /><Legend /><Bar dataKey="co2" fill="#0369a1" radius={[4, 4, 0, 0]} name="Actual" /><Bar dataKey="target" fill="#059669" radius={[4, 4, 0, 0]} name="Target" /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Corridor Carbon Scores</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-3">{data.corridorRecords.filter((_, i) => i < 6).map((c, idx) => (
              <div key={idx} className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-[10px] text-muted-foreground truncate max-w-full">{String(c.corridorName).slice(0, 20)}</span>
                <CarbonScoreGauge co2={Number(c.co2PerTonKm)} target={50} />
              </div>
            ))}</div></CardContent></Card>
          </div>
          <div className="mtc-kpi-grid grid grid-cols-4 gap-4">
            {[
              { label: "Modal Shift Progress", value: `${ak.modalShiftPct}%`, icon: <ArrowRightLeft className="w-4 h-4" /> },
              { label: "Empty Miles Reduced", value: `${ak.emptyMilesReduced}%`, icon: <Route className="w-4 h-4" /> },
              { label: "Dwell Time Improve", value: `${ak.dwellTimeImprovement}%`, icon: <Clock className="w-4 h-4" /> },
              { label: "Corridor Utilization", value: `${ak.corridorUtilization}%`, icon: <Gauge className="w-4 h-4" /> },
              { label: "Green Logistics Score", value: `${ak.greenLogisticsScore}/100`, icon: <Globe2 className="w-4 h-4" /> },
              { label: "Customer NPS", value: ak.customerNPS, icon: <ShieldCheck className="w-4 h-4" /> },
              { label: "Cost Savings", value: formatINR(ak.avgCostSavings), icon: <TrendingUp className="w-4 h-4" /> },
              { label: "ROI", value: `${ak.roiPercent}%`, icon: <BarChart3 className="w-4 h-4" /> },
            ].map((item, idx) => (
              <Card key={idx} className="hover-lift-sm mtc-kpi-card">
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
                  <CardTitle className="text-xs text-muted-foreground font-medium">{item.label}</CardTitle>
                  <span className="text-muted-foreground">{item.icon}</span>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle px-4 pb-3"><div className="text-xl font-bold tabular-nums">{item.value}</div></CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ====== TAB 4: Incidents ====== */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search incidents, type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background"><option value="all">All Statuses</option>{["Open", "Investigating", "Mitigated", "Resolved", "Escalated"].map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="rounded-lg border overflow-auto max-h-[520px]">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                  {[
                    { key: "incidentId", label: "ID" }, { key: "corridor", label: "Corridor" },
                    { key: "type", label: "Type" }, { key: "severity", label: "Severity" },
                    { key: "status", label: "Status" }, { key: "impactDuration", label: "Duration(h)" },
                    { key: "affectedShipments", label: "Affected" }, { key: "financialImpact", label: "Impact" },
                    { key: "reportedDate", label: "Reported" },
                  ].map(h => (
                    <th key={h.key} className="mtc-sort-header px-3 py-2 text-left font-medium cursor-pointer" onClick={() => toggleSort(h.key)}>
                      {h.label}<SortIcon field={h.key} />
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="mtc-tbody">
                {filteredIncidents.map((inc, idx) => (
                  <tr key={idx} className="mtc-table-row border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => { setDrawerRecord(inc as unknown as Record<string, unknown>); setDrawerOpen(true); }}>
                    <td className="px-3 py-2 font-mono font-medium">{String(inc.incidentId)}</td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[100px] truncate">{String(inc.corridor)}</td>
                    <td className="px-3 py-2"><CargoTypeBadge type={String(inc.type)} /></td>
                    <td className="px-3 py-2"><IncidentSeverityIndicator severity={String(inc.severity)} /></td>
                    <td className="px-3 py-2"><ShipmentStatusBadge status={String(inc.status)} /></td>
                    <td className="px-3 py-2 font-bold tabular-nums">{String(inc.impactDuration)}</td>
                    <td className="px-3 py-2 font-bold tabular-nums">{String(inc.affectedShipments)}</td>
                    <td className="px-3 py-2 font-semibold tabular-nums">{formatINR(Number(inc.financialImpact))}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">{String(inc.reportedDate)}</td>
                    <td className="press-scale px-3 py-2"><Button size="sm" variant="ghost" className="mtc-action-btn" onClick={(e) => { e.stopPropagation(); setDrawerRecord(inc as unknown as Record<string, unknown>); setDrawerOpen(true); }}><Eye className="w-3.5 h-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ====== TAB 5: Analytics ====== */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="mtc-kpi-grid grid grid-cols-4 gap-4">
            {[
              { label: "Avg Cost Savings", value: formatINR(ak.avgCostSavings), icon: <TrendingUp className="w-4 h-4" /> },
              { label: "Modal Shift Pct", value: `${ak.modalShiftPct}%`, icon: <ArrowRightLeft className="w-4 h-4" /> },
              { label: "Empty Miles Reduced", value: `${ak.emptyMilesReduced}%`, icon: <Route className="w-4 h-4" /> },
              { label: "Dwell Time Improve", value: `${ak.dwellTimeImprovement}%`, icon: <Clock className="w-4 h-4" /> },
              { label: "Corridor Utilization", value: `${ak.corridorUtilization}%`, icon: <Gauge className="w-4 h-4" /> },
              { label: "Green Logistics Score", value: `${ak.greenLogisticsScore}/100`, icon: <Globe2 className="w-4 h-4" /> },
              { label: "Customer NPS", value: ak.customerNPS, icon: <ShieldCheck className="w-4 h-4" /> },
              { label: "ROI", value: `${ak.roiPercent}%`, icon: <BarChart3 className="w-4 h-4" /> },
            ].map((item, idx) => (
              <Card key={idx} className="hover-lift-sm mtc-kpi-card">
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
                  <CardTitle className="text-xs text-muted-foreground font-medium">{item.label}</CardTitle>
                  <span className="text-muted-foreground">{item.icon}</span>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle px-4 pb-3"><div className="text-xl font-bold tabular-nums">{item.value}</div></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Mode Comparison</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.analyticsCharts.modeComparison}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mode" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="Cost" fill="#0369a1" radius={[4, 4, 0, 0]} /><Bar dataKey="Speed" fill="#d97706" radius={[4, 4, 0, 0]} /><Bar dataKey="Reliability" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm mtc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Savings vs Investment</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.analyticsCharts.savingsTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Legend /><Bar dataKey="Savings" fill="#059669" radius={[4, 4, 0, 0]} /><Bar dataKey="Investment" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ====== DRAWER ====== */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mtc-drawer-header text-white px-4 py-3 rounded-lg" style={{ background: "linear-gradient(135deg, #0369a1, #0d9488)" }}>
              {drawerRecord && "shipmentId" in drawerRecord ? String(drawerRecord.shipmentId) : drawerRecord && "incidentId" in drawerRecord ? String(drawerRecord.incidentId) : drawerRecord && "corridorName" in drawerRecord ? String(drawerRecord.corridorName) : "Details"}
            </SheetTitle>
          </SheetHeader>
          {drawerRecord && (
            <div className="mt-4 px-1 space-y-4">
              {/* Shipment Drawer */}
              {"shipmentId" in drawerRecord && (
                <>
                  <div className="flex items-center justify-between">
                    <div><div className="text-lg font-bold font-mono">{String(drawerRecord.shipmentId)}</div><div className="text-sm opacity-90">{String(drawerRecord.corridor)}</div></div>
                    <ShipmentStatusBadge status={String(drawerRecord.status)} />
                  </div>
                  <ModeBadge mode={String(drawerRecord.mode)} />
                  <TransitProgressBar pct={Number(drawerRecord.transitProgress)} status={String(drawerRecord.status)} />
                  <div className="mtc-value-tile p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Cargo Type</span><span className="font-medium"><CargoTypeBadge type={String(drawerRecord.cargoType)} /></span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Priority</span><PriorityBadge priority={String(drawerRecord.priority)} /></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Weight</span><span className="font-semibold tabular-nums">{Number(drawerRecord.weight).toLocaleString()} kg</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">TEU</span><span className="font-semibold tabular-nums">{String(drawerRecord.teu)}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Value</span><span className="font-semibold tabular-nums">{formatINR(Number(drawerRecord.value))}</span></div>
                  </div>
                  <div className="mtc-value-tile p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Total Cost</span><span className="font-bold text-blue-700 tabular-nums">{formatINR(Number(drawerRecord.totalCost))}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">GST</span><span className="tabular-nums">{formatINR(Number(drawerRecord.gstAmount))}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Insurance</span><span className="tabular-nums">{formatINR(Number(drawerRecord.insurance))}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Origin</span><div className="font-medium">{String(drawerRecord.origin)}</div></div>
                    <div><span className="text-muted-foreground">Destination</span><div className="font-medium">{String(drawerRecord.destination)}</div></div>
                    <div><span className="text-muted-foreground">Operator</span><div className="font-medium">{String(drawerRecord.operator)}</div></div>
                    <div><span className="text-muted-foreground">Current Location</span><div className="font-medium">{String(drawerRecord.currentLocation)}</div></div>
                    <div><span className="text-muted-foreground">ETA</span><div className="font-medium tabular-nums">{String(drawerRecord.eta)}</div></div>
                    <div><span className="text-muted-foreground">Tracking Updates</span><div className="font-bold tabular-nums">{String(drawerRecord.trackingUpdates)}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="press-scale mtc-action-btn flex-1" onClick={() => { toast.success("Rerouted", `${drawerRecord.shipmentId} rerouted successfully`); setDrawerOpen(false); }}><Navigation2 className="w-3.5 h-3.5 mr-1" />Reroute</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate mtc-action-btn flex-1" onClick={() => { toast.info("Tracking Updated", `Fresh tracking for ${drawerRecord.shipmentId}`); setDrawerOpen(false); }}><Radio className="w-3.5 h-3.5 mr-1" />Track</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate mtc-action-btn" onClick={() => { toast.warning("Escalated", `${drawerRecord.shipmentId} escalated`); setDrawerOpen(false); }}><Zap className="w-3.5 h-3.5" /></Button>
                  </div>
                </>
              )}
              {/* Incident Drawer */}
              {"incidentId" in drawerRecord && (
                <>
                  <div className="flex items-center justify-between">
                    <div><div className="text-lg font-bold font-mono">{String(drawerRecord.incidentId)}</div><div className="text-sm opacity-90">{String(drawerRecord.type)}</div></div>
                    <IncidentSeverityIndicator severity={String(drawerRecord.severity)} />
                  </div>
                  <div className="mtc-value-tile p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Impact Duration</span><span className="font-bold tabular-nums">{String(drawerRecord.impactDuration)}h</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Affected Shipments</span><span className="font-bold tabular-nums">{String(drawerRecord.affectedShipments)}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Financial Impact</span><span className="font-bold text-red-600 tabular-nums">{formatINR(Number(drawerRecord.financialImpact))}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Status</span><div className="font-medium"><ShipmentStatusBadge status={String(drawerRecord.status)} /></div></div>
                    <div><span className="text-muted-foreground">Root Cause</span><div className="font-medium">{String(drawerRecord.rootCause)}</div></div>
                    <div><span className="text-muted-foreground">Corrective</span><div className="font-medium">{String(drawerRecord.correctiveAction)}</div></div>
                    <div><span className="text-muted-foreground">Assignee</span><div className="font-medium">{String(drawerRecord.assignee)}</div></div>
                    <div><span className="text-muted-foreground">Corridor</span><div className="font-medium text-muted-foreground truncate">{String(drawerRecord.corridor)}</div></div>
                    <div><span className="text-muted-foreground">Reported</span><div className="font-medium tabular-nums">{String(drawerRecord.reportedDate)}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="press-scale mtc-action-btn flex-1" onClick={() => { toast.success("Escalated", `${drawerRecord.incidentId} escalated to management`); setDrawerOpen(false); }}><Zap className="w-3.5 h-3.5 mr-1" />Escalate</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate mtc-action-btn flex-1" onClick={() => { toast.info("Resolved", `${drawerRecord.incidentId} marked resolved`); setDrawerOpen(false); }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Resolve</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate mtc-action-btn" onClick={() => { toast.error("Claim Filed", `${drawerRecord.incidentId} insurance claim`); setDrawerOpen(false); }}><Scale className="w-3.5 h-3.5" /></Button>
                  </div>
                </>
              )}
              {/* Corridor Drawer */}
              {"corridorName" in drawerRecord && !("shipmentId" in drawerRecord) && !("incidentId" in drawerRecord) && (
                <>
                  <div className="flex items-center justify-between">
                    <div><div className="text-lg font-bold">{String(drawerRecord.corridorName)}</div></div>
                    <CorridorStatusBadge status={String(drawerRecord.status)} />
                  </div>
                  <CorridorRouteIndicator origin={String(drawerRecord.origin)} destination={String(drawerRecord.destination)} modes={[String(drawerRecord.primaryMode), String(drawerRecord.secondaryMode)]} />
                  <div className="flex items-center justify-center"><ReliabilityRing value={Number(drawerRecord.onTimeReliability)} /></div>
                  <div className="mtc-value-tile p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Capacity</span><span className="font-semibold tabular-nums">{Number(drawerRecord.capacity).toLocaleString()}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Utilization</span><span className="font-semibold tabular-nums">{String(drawerRecord.utilization)}%</span></div>
                    <UtilizationBar pct={Number(drawerRecord.utilization)} />
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Avg Transit</span><span className="font-semibold tabular-nums">{String(drawerRecord.avgTransitHrs)}h</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Cost/Ton</span><span className="font-semibold tabular-nums">{formatINR(Number(drawerRecord.costPerTon))}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Weekly TEU</span><span className="font-semibold tabular-nums">{Number(drawerRecord.weeklyTEU).toLocaleString()}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Distance</span><span className="font-semibold tabular-nums">{Number(drawerRecord.distanceKm).toLocaleString()} km</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">CO2/t-km</span><span className="font-semibold tabular-nums">{String(drawerRecord.co2PerTonKm)}g</span></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="press-scale mtc-action-btn flex-1" onClick={() => { toast.success("Optimized", `${drawerRecord.corridorName} optimization started`); setDrawerOpen(false); }}><TrendingUp className="w-3.5 h-3.5 mr-1" />Optimize</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate mtc-action-btn flex-1" onClick={() => { toast.info("Capacity Review", `Reviewing ${drawerRecord.corridorName}`); setDrawerOpen(false); }}><Gauge className="w-3.5 h-3.5 mr-1" />Review</Button>
                    <Button size="sm" variant="outline" className="press-scale btn-outline-animate mtc-action-btn" onClick={() => { toast.warning("Alert Set", `Alerts configured`); setDrawerOpen(false); }}><Radio className="w-3.5 h-3.5" /></Button>
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

// Dummy component for TEU icon (uses existing Package icon)
function ContainerIcon({ className }: { className?: string }) {
  return <Package className={className} />;
}
