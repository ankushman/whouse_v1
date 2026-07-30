"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Search, Eye, RefreshCw,
  Activity, Clock, Package, Truck, Users, Wrench, AlertTriangle,
  CheckCircle2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Timer, Target, Container, XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast-helper";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// SEEDED RANDOM
// ═══════════════════════════════════════════════════════════════════════════════
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 12345) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME COLORS
// ═══════════════════════════════════════════════════════════════════════════════
const TC = {
  navy: "#0f172a",
  cyan: "#06b6d4",
  orange: "#f97316",
  emerald: "#10b981",
  slate: "#64748b",
  amber: "#f59e0b",
  red: "#ef4444",
  rose: "#e11d48",
  sky: "#0ea5e9",
  teal: "#14b8a6",
  lime: "#84cc16",
  purple: "#8b5cf6",
  gray: "#9ca3af",
};

// ═══════════════════════════════════════════════════════════════════════════════
// INR FORMATTER
// ═══════════════════════════════════════════════════════════════════════════════
function formatINR(amount: number): string {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `\u20b9${(amount / 1000).toFixed(1)} K`;
  return `\u20b9${amount.toFixed(0)}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE ALL DATA
// ═══════════════════════════════════════════════════════════════════════════════
function generateData() {
  const r = seededRandom(2022901);
  const pick = <T,>(a: readonly T[]): T => a[Math.floor(r() * a.length)];
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;
  const rf = (min: number, max: number) => +(r() * (max - min) + min).toFixed(1);

  // ── Enums ──────────────────────────────────────────────────────
  const DOCK_STATUSES = ["Available", "Loading", "Unloading", "Blocked", "Maintenance", "Reserved", "Cleaning", "QC Hold"] as const;
  const DOCK_TYPES = ["Inbound-A", "Inbound-B", "Inbound-C", "Inbound-D", "Outbound-A", "Outbound-B", "Outbound-C", "Outbound-D", "Crossdock-A", "Crossdock-B", "Special"] as const;
  const VEHICLE_TYPES = ["Trailer 20ft", "Trailer 40ft", "Container 20ft", "Container 40ft", "Tanker", "Flatbed", "Refrigerated", "Open Truck", "Tata Ace", "Eicher"] as const;
  const APPOINTMENT_STATUSES = ["On-Time", "Early", "Late", "No-Show", "Checked-In", "Completed", "Cancelled", "Waiting"] as const;
  const WORKER_ROLES = ["Picker", "Packer", "Receiver", "Loader", "Forklift Operator", "QC Inspector", "Supervisor", "Shift Lead", "Material Handler", "Returns Processor"] as const;
  const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F"] as const;
  const TASK_STATUSES = ["Active", "On Break", "Idle", "Training", "Overtime", "Off-Duty", "Completed", "Pending Handover"] as const;
  const PERFORMANCE_LEVELS = ["Exceptional", "Good", "Average", "Below Avg", "Critical"] as const;
  const CARRIERS = ["BlueDart", "Delhivery", "DTDC", "Gati", "XpressBees", "Ecom Express", "Rivigo", "BlackBuck", "VRL", "TCIL"] as const;
  const INBOUND_STATUSES = ["Expected", "In-Transit", "Arrived", "Unloading", "Receiving", "Quality Check", "Putaway Complete", "Cancelled"] as const;
  const PRODUCT_CATEGORIES = ["Electronics", "Textiles", "Pharma", "Auto Parts", "FMCG", "Industrial", "Chemicals", "Agriculture", "IT Products", "Leather", "Paper", "Glass"] as const;
  const PRIORITY_LEVELS = ["Critical", "Urgent", "High", "Medium", "Low", "Scheduled"] as const;
  const ORDER_TYPES = ["B2B Wholesale", "B2C E-commerce", "Inter-Transfer", "Returns-to-Vendor", "Sample", "Replacement", "Express", "Standard"] as const;
  const OUTBOUND_STATUSES = ["Packed", "Picking in Progress", "Pick Complete", "Awaiting QC", "Dispatch Ready", "In-Transit", "Delivered", "Cancelled"] as const;
  const SHIPPING_METHODS = ["Surface", "Air", "Express", "Same-Day", "Next-Day", "Standard"] as const;
  const SLA_TIERS = ["Premium 4h", "Priority 8h", "Standard 24h", "Economy 48h", "Flex 72h"] as const;
  const EXCEPTION_TYPES = ["Inventory Shortage", "Equipment Failure", "Quality Hold", "Dock Blockage", "Labor Shortage", "Carrier Delay", "System Error", "Safety Incident", "Temperature Excursion", "Weight Discrepancy"] as const;
  const SEVERITY_LEVELS = ["P1 Critical", "P2 High", "P3 Medium", "P4 Low", "P5 Informational", "P6 Resolved"] as const;
  const EXCEPTION_STATUSES = ["Open", "Investigating", "Acknowledged", "Escalated", "Resolved", "Closed"] as const;
  const RESPONSIBLE_TEAMS = ["Operations", "Maintenance", "Quality", "Safety", "IT", "Logistics"] as const;
  const RESOLUTION_CATEGORIES = ["Fixed", "Bypassed", "Escalated", "Workaround", "Cancelled"] as const;
  const OPS_STATUSES = ["Running", "Paused", "Completed", "Queued", "Exception", "Idle"] as const;

  const NAMES = ["Rajesh K.", "Priya S.", "Amit P.", "Sunita D.", "Vikram M.", "Deepa R.", "Suresh N.", "Anita G.", "Rahul T.", "Meena J.", "Arjun B.", "Kavita L.", "Manoj V.", "Lakshmi H.", "Sanjay W.", "Pooja C.", "Harish F.", "Sneha K.", "Pradeep Q.", "Geeta U.", "Naveen X.", "Rekha Y.", "Ravi Z.", "Shalini A.", "Dinesh E.", "Aparna I.", "Gopal O.", "Madhuri P.", "Nitin R.", "Swati T.", "Ashok V.", "Vijayalakshmi N.", "Chandra S.", "Ramesh D.", "Bharathi M.", "Kumar J.", "Divya B.", "Venkat G.", "Jayanthi H.", "Subramanian K.", "Uma L.", "Srinivasan Q.", "Kamala R.", "Murugan T.", "Pankaj U.", "Ritu V.", "Tarun W.", "Neelam X.", "Bhawana Y.", "Gaurav Z.", "Isha A.", "Jitendra B.", "Komal C.", "Lalit D.", "Manisha E.", "Narendra F.", "Omkar G.", "Parul H.", "Qadir I.", "Rashmi J.", "Siddharth K.", "Tanuja L.", "Upendra M.", "Varsha N.", "Wasim O.", "Yogesh P.", "Zeenat Q.", "Anand R.", "Bindu S.", "Chirag T."];

  // ── Tab 1: Dock Records (65) ──────────────────────────────────
  const docks = Array.from({ length: 65 }, (_, i) => ({
    id: `DOC-${String(i + 1).padStart(3, "0")}`,
    name: pick(DOCK_TYPES) + `-${String(i + 1).padStart(2, "0")}`,
    type: pick(DOCK_TYPES),
    status: pick(DOCK_STATUSES),
    vehicleType: pick(VEHICLE_TYPES),
    appointmentStatus: pick(APPOINTMENT_STATUSES),
    vehicleNo: `KA${ri(10, 99)}${String.fromCharCode(65 + ri(0, 25))}${String.fromCharCode(65 + ri(0, 25))}${ri(1000, 9999)}`,
    driverName: pick(NAMES),
    utilization: ri(10, 100),
    loadProgress: ri(0, 100),
    appointmentTime: `${String(ri(6, 22)).padStart(2, "0")}:${String(ri(0, 59)).padStart(2, "0")}`,
    eta: `${ri(0, 48)}h`,
    cargoWeight: ri(200, 28000),
  }));

  // ── Tab 2: Workforce Records (75) ──────────────────────────────
  const workforce = Array.from({ length: 75 }, (_, i) => {
    const perf = ri(20, 100);
    const level = perf >= 95 ? "Exceptional" : perf >= 80 ? "Good" : perf >= 60 ? "Average" : perf >= 40 ? "Below Avg" : "Critical";
    const shiftElapsed = ri(10, 95);
    return {
      id: `WRK-${String(i + 1).padStart(3, "0")}`,
      name: NAMES[i % NAMES.length],
      role: pick(WORKER_ROLES),
      zone: pick(ZONES),
      status: pick(TASK_STATUSES),
      performance: perf,
      performanceLevel: level,
      shiftElapsed,
      shiftTotal: 480,
      tasksCompleted: ri(5, 80),
      tasksAssigned: ri(10, 100),
      hourlyRate: ri(180, 450),
      empId: `EMP${ri(10000, 99999)}`,
    };
  });

  // ── Tab 3: Inbound Records (70) ─────────────────────────────────
  const inbound = Array.from({ length: 70 }, (_, i) => {
    const stageIdx = ri(0, 6);
    const statuses = ["Expected", "In-Transit", "Arrived", "Unloading", "Receiving", "Quality Check", "Putaway Complete"];
    return {
      id: `INB-${String(i + 1).padStart(4, "0")}`,
      poNumber: `PO-${ri(2024, 2025)}-${String(i + 1).padStart(5, "0")}`,
      carrier: pick(CARRIERS),
      status: pick(INBOUND_STATUSES),
      category: pick(PRODUCT_CATEGORIES),
      priority: pick(PRIORITY_LEVELS),
      expectedQty: ri(50, 5000),
      receivedQty: stageIdx >= 3 ? ri(10, 5000) : 0,
      stageIndex: stageIdx,
      vehicleNo: `KA${ri(10, 99)}${String.fromCharCode(65 + ri(0, 25))}${String.fromCharCode(65 + ri(0, 25))}${ri(1000, 9999)}`,
      eta: `${ri(0, 72)}h`,
      etaStatus: ri(0, 2) === 0 ? "on-time" : ri(0, 1) === 0 ? "at-risk" : "delayed",
      origin: pick(["Mumbai", "Delhi", "Chennai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]),
      value: ri(50000, 5000000),
    };
  });

  // ── Tab 4: Outbound Records (70) ────────────────────────────────
  const outbound = Array.from({ length: 70 }, (_, i) => {
    const slaIdx = ri(0, 4);
    const slaHours = [4, 8, 24, 48, 72][slaIdx];
    const elapsed = ri(0, slaHours);
    const remaining = Math.max(0, slaHours - elapsed);
    const pct = remaining / slaHours;
    const readiness = ri(40, 100);
    return {
      id: `OUT-${String(i + 1).padStart(4, "0")}`,
      orderNo: `ORD-${ri(2024, 2025)}-${String(i + 1).padStart(6, "0")}`,
      orderType: pick(ORDER_TYPES),
      status: pick(OUTBOUND_STATUSES),
      shippingMethod: pick(SHIPPING_METHODS),
      carrier: pick(CARRIERS),
      slaTier: pick(SLA_TIERS),
      slaHours,
      slaRemaining: remaining,
      slaPct: pct,
      readiness,
      destination: pick(["Mumbai", "Delhi", "Chennai", "Bangalore", "Kolkata", "Hyderabad", "Jaipur", "Lucknow"]),
      totalItems: ri(5, 500),
      packedItems: ri(0, 500),
      value: ri(10000, 2000000),
      weight: ri(1, 2000),
    };
  });

  // ── Tab 5: Exception Records (60) ──────────────────────────────
  const exceptions = Array.from({ length: 60 }, (_, i) => {
    const sevIdx = ri(0, 5);
    const statIdx = ri(0, 4);
    const statusList = ["Open", "Investigating", "Acknowledged", "Escalated", "Resolved", "Closed"];
    const mttr = statIdx >= 3 ? ri(1, 72) : ri(1, 168);
    return {
      id: `EXC-${String(i + 1).padStart(4, "0")}`,
      type: pick(EXCEPTION_TYPES),
      severity: pick(SEVERITY_LEVELS),
      status: statusList[statIdx],
      statusIndex: statIdx,
      team: pick(RESPONSIBLE_TEAMS),
      resolution: pick(RESOLUTION_CATEGORIES),
      mttr,
      trend: pick(["up", "down", "stable"]),
      reportedBy: pick(NAMES),
      description: pick(["Unexpected qty variance found", "Forklift #12 motor overheating", "Product failed QC batch #452", "Bay 7 blocked by abandoned pallet", "3 call-outs on Zone C shift", "Carrier ETA missed by 6hrs", "WMS sync error at dock 4", "Minor spillage near loading bay", "Cold room 3 temp alert", "Package weight exceeds declared"]),
      createdAt: `${ri(1, 30)}h ago`,
      warehouse: pick(["WH-Mumbai", "WH-Delhi", "WH-Chennai", "WH-Bangalore", "WH-Kolkata"]),
      impactValue: ri(5000, 500000),
    };
  });

  // ── Dashboard: Hourly Throughput (24h) ─────────────────────────
  const hourlyThroughput = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    inbound: ri(30, 200),
    outbound: ri(25, 180),
    crossdock: ri(10, 80),
  }));

  // ── Dashboard: Ops Status Pie ───────────────────────────────────
  const opsStatusData = OPS_STATUSES.map(s => ({
    name: s,
    value: ri(3, 40),
  }));

  // ── Dashboard: Shift Performance ────────────────────────────────
  const shiftPerformance = [
    { shift: "Morning (6AM-2PM)", throughput: ri(800, 1400), target: 1200 },
    { shift: "Afternoon (2PM-10PM)", throughput: ri(700, 1300), target: 1100 },
    { shift: "Night (10PM-6AM)", throughput: ri(400, 900), target: 800 },
  ];

  // ── Dashboard: Ops Flow Stacked ─────────────────────────────────
  const opsFlow = [
    { stage: "Receiving", units: ri(200, 500) },
    { stage: "Putaway", units: ri(150, 450) },
    { stage: "Picking", units: ri(180, 480) },
    { stage: "Packing", units: ri(160, 420) },
    { stage: "Shipping", units: ri(140, 400) },
  ];

  // ── Dashboard KPIs ─────────────────────────────────────────────
  const kpis = [
    { label: "Active Operations", value: ri(18, 42), icon: Activity, color: TC.cyan, change: "+12%", up: true },
    { label: "Orders In Progress", value: ri(120, 380), icon: Package, color: TC.orange, change: "+8%", up: true },
    { label: "Dock Utilization", value: `${rf(55, 92)}%`, icon: Container, color: TC.emerald, change: "-2%", up: false },
    { label: "Pick Rate", value: `${ri(85, 155)} u/h`, icon: Target, color: TC.amber, change: "+5%", up: true },
    { label: "Labor Productivity", value: `${rf(72, 96)}%`, icon: Users, color: TC.teal, change: "+3%", up: true },
    { label: "Equipment Active", value: `${ri(28, 52)}/${ri(55, 65)}`, icon: Wrench, color: TC.sky, change: "+1", up: true },
    { label: "Exception Queue", value: ri(3, 18), icon: AlertTriangle, color: TC.red, change: "-4", up: false },
    { label: "On-Time Ship Rate", value: `${rf(88, 98)}%`, icon: Clock, color: TC.lime, change: "+1.2%", up: true },
  ];

  return {
    docks, workforce, inbound, outbound, exceptions,
    hourlyThroughput, opsStatusData, shiftPerformance, opsFlow, kpis,
    DOCK_STATUSES, DOCK_TYPES, VEHICLE_TYPES, APPOINTMENT_STATUSES,
    WORKER_ROLES, ZONES, TASK_STATUSES, PERFORMANCE_LEVELS,
    CARRIERS, INBOUND_STATUSES, PRODUCT_CATEGORIES, PRIORITY_LEVELS,
    ORDER_TYPES, OUTBOUND_STATUSES, SHIPPING_METHODS, SLA_TIERS,
    EXCEPTION_TYPES, SEVERITY_LEVELS, EXCEPTION_STATUSES,
    RESPONSIBLE_TEAMS, RESOLUTION_CATEGORIES, OPS_STATUSES,
  };
}

const DATA = generateData();

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE VISUAL COMPONENTS — Tab 1: Dock & Yard
// ═══════════════════════════════════════════════════════════════════════════════

function DockStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Available": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Loading": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Unloading": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "Blocked": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    "Maintenance": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Reserved": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "Cleaning": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "QC Hold": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  };
  return <span className={cn("woc-pill", map[status] || "bg-gray-100 text-gray-600")}>{status}</span>;
}

function DockUtilizationBar({ pct }: { pct: number }) {
  const color = pct < 50 ? TC.cyan : pct < 80 ? "#f59e0b" : TC.red;
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="woc-util-track">
        <div className="woc-util-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold min-w-[32px] text-right" style={{ color }}>{pct}%</span>
    </div>
  );
}

function VehicleTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    "Trailer 20ft": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    "Trailer 40ft": "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
    "Container 20ft": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "Container 40ft": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "Tanker": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Flatbed": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Refrigerated": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Open Truck": "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
    "Tata Ace": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Eicher": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  };
  return <span className={cn("woc-pill", colors[type] || "bg-gray-100 text-gray-600")}>{type}</span>;
}

function AppointmentTimeBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "On-Time": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Early": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "Late": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "No-Show": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    "Checked-In": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Completed": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Cancelled": "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    "Waiting": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  };
  return <span className={cn("woc-pill", map[status] || "bg-gray-100 text-gray-600")}>{status}</span>;
}

function DockGridCard({ dock, onClick }: { dock: typeof DATA.docks[number]; onClick: () => void }) {
  const statusColor: Record<string, string> = {
    Available: "border-emerald-400", Loading: "border-sky-400", Unloading: "border-cyan-400",
    Blocked: "border-red-400", Maintenance: "border-amber-400", Reserved: "border-purple-400",
    Cleaning: "border-teal-400", "QC Hold": "border-rose-400",
  };
  return (
    <div className={cn("woc-dock-card cursor-pointer", statusColor[dock.status] || "border-gray-300")} onClick={onClick}>
      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{dock.name}</div>
      <DockStatusBadge status={dock.status} />
      <div className="text-xs text-slate-500 mt-1">{dock.vehicleType}</div>
      <DockUtilizationBar pct={dock.loadProgress} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE VISUAL COMPONENTS — Tab 2: Workforce
// ═══════════════════════════════════════════════════════════════════════════════

function WorkerRoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    Picker: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Packer: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    Receiver: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    Loader: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Forklift Operator": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "QC Inspector": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    Supervisor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "Shift Lead": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "Material Handler": "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
    "Returns Processor": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return <span className={cn("woc-pill", map[role] || "bg-gray-100 text-gray-600")}>{role}</span>;
}

function ZoneBadge({ zone }: { zone: string }) {
  const colors: Record<string, string> = {
    "Zone A": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Zone B": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Zone C": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Zone D": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Zone E": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "Zone F": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  };
  return <span className={cn("woc-pill", colors[zone] || "bg-gray-100 text-gray-600")}>{zone}</span>;
}

function TaskStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "On Break": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    Idle: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    Training: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    Overtime: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Off-Duty": "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    Completed: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "Pending Handover": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  };
  return <span className={cn("woc-pill", map[status] || "bg-gray-100 text-gray-600")}>{status}</span>;
}

function PerformanceRing({ value }: { value: number }) {
  const color = value >= 95 ? TC.emerald : value >= 80 ? TC.teal : value >= 60 ? TC.amber : value >= 40 ? TC.orange : TC.red;
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" className="dark:stroke-slate-700" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{value}%</span>
      </div>
    </div>
  );
}

function ShiftProgressRing({ elapsed, total }: { elapsed: number; total: number }) {
  const pct = Math.min(100, (elapsed / total) * 100);
  const color = pct < 50 ? TC.cyan : pct < 80 ? TC.amber : TC.orange;
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const hrs = Math.floor(elapsed / 60);
  const mins = elapsed % 60;
  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" className="dark:stroke-slate-700" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{hrs}h{mins}m</span>
      </div>
    </div>
  );
}

function WorkerAvailabilityTile() {
  const total = DATA.workforce.length;
  const active = DATA.workforce.filter(w => w.status === "Active" || w.status === "Overtime").length;
  const onBreak = DATA.workforce.filter(w => w.status === "On Break").length;
  const idle = DATA.workforce.filter(w => w.status === "Idle").length;
  const offDuty = DATA.workforce.filter(w => w.status === "Off-Duty").length;
  const items = [
    { label: "Total", value: total, color: TC.slate },
    { label: "Active", value: active, color: TC.emerald },
    { label: "Break", value: onBreak, color: TC.amber },
    { label: "Idle", value: idle, color: TC.orange },
    { label: "Off-Duty", value: offDuty, color: TC.gray },
  ];
  return (
    <div className="grid grid-cols-5 gap-2">
      {items.map(it => (
        <div key={it.label} className="woc-avail-card" style={{ borderTopColor: it.color }}>
          <div className="text-lg font-bold" style={{ color: it.color }}>{it.value}</div>
          <div className="text-[10px] text-slate-500">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE VISUAL COMPONENTS — Tab 3: Inbound
// ═══════════════════════════════════════════════════════════════════════════════

function PipelineStageTracker({ stageIndex }: { stageIndex: number }) {
  const stages = ["Expected", "In-Transit", "Arrived", "Unloading", "Putaway"];
  return (
    <div className="flex items-center gap-1">
      {stages.map((s, idx) => (
        <React.Fragment key={s}>
          <div className={cn("woc-stage-dot", idx <= stageIndex ? "woc-stage-done" : "woc-stage-pending")}>
            {idx + 1}
          </div>
          {idx < stages.length - 1 && (
            <div className={cn("woc-stage-line", idx < stageIndex ? "woc-stage-line-done" : "woc-stage-line-pending")} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function InboundStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Expected: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    "In-Transit": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    Arrived: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    Unloading: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    Receiving: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Quality Check": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "Putaway Complete": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return <span className={cn("woc-pill", map[status] || "bg-gray-100 text-gray-600")}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    Urgent: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    High: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    Medium: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    Low: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    Scheduled: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  };
  return <span className={cn("woc-pill", map[priority] || "bg-gray-100 text-gray-600")}>{priority}</span>;
}

function CarrierBadge({ carrier }: { carrier: string }) {
  return <span className="woc-pill bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{carrier}</span>;
}

function VolumeIndicator({ expected, received }: { expected: number; received: number }) {
  const pct = expected > 0 ? Math.min(100, Math.round((received / expected) * 100)) : 0;
  const color = pct >= 90 ? TC.emerald : pct >= 50 ? TC.amber : TC.red;
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="woc-util-track">
        <div className="woc-util-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>Recv: {received}</span>
        <span>Exp: {expected}</span>
      </div>
    </div>
  );
}

function ETAIndicator({ eta, etaStatus }: { eta: string; etaStatus: string }) {
  const color = etaStatus === "on-time" ? TC.emerald : etaStatus === "at-risk" ? "#f59e0b" : TC.red;
  return (
    <span className="text-xs font-semibold" style={{ color }}>{eta} <span className="font-normal">({etaStatus})</span></span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE VISUAL COMPONENTS — Tab 4: Outbound
// ═══════════════════════════════════════════════════════════════════════════════

function OutboundStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Packed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Picking in Progress": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Pick Complete": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "Awaiting QC": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Dispatch Ready": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "In-Transit": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return <span className={cn("woc-pill", map[status] || "bg-gray-100 text-gray-600")}>{status}</span>;
}

function OrderTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    "B2B Wholesale": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "B2C E-commerce": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Inter-Transfer": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "Returns-to-Vendor": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    Sample: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    Replacement: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    Express: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    Standard: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return <span className={cn("woc-pill", map[type] || "bg-gray-100 text-gray-600")}>{type}</span>;
}

function ShippingMethodBadge({ method }: { method: string }) {
  const map: Record<string, string> = {
    Surface: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Air: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    Express: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Same-Day": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    "Next-Day": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    Standard: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return <span className={cn("woc-pill", map[method] || "bg-gray-100 text-gray-600")}>{method}</span>;
}

function SLATierBadge({ tier }: { tier: string }) {
  const map: Record<string, string> = {
    "Premium 4h": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "Priority 8h": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Standard 24h": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Economy 48h": "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    "Flex 72h": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  };
  return <span className={cn("woc-pill", map[tier] || "bg-gray-100 text-gray-600")}>{tier}</span>;
}

function SLACountdownTimer({ remaining, total, pct }: { remaining: number; total: number; pct: number }) {
  const color = pct < 0.25 ? TC.red : pct < 0.5 ? "#f59e0b" : TC.emerald;
  const hrs = Math.floor(remaining / 60);
  const mins = remaining % 60;
  const displayPct = Math.round(pct * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="woc-util-track flex-1">
        <div className="woc-util-fill" style={{ width: `${displayPct}%`, background: color }} />
      </div>
      <span className={cn("text-xs font-bold min-w-[40px] text-right", pct < 0.25 && "animate-pulse")} style={{ color }}>
        {hrs}h{mins}m
      </span>
    </div>
  );
}

function DispatchReadinessBar({ readiness }: { readiness: number }) {
  const color = readiness >= 80 ? TC.emerald : readiness >= 50 ? "#f59e0b" : TC.orange;
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="woc-util-track flex-1">
        <div className="woc-util-fill" style={{ width: `${readiness}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold min-w-[36px] text-right" style={{ color }}>{readiness}%</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE VISUAL COMPONENTS — Tab 5: Exceptions
// ═══════════════════════════════════════════════════════════════════════════════

function ExceptionSeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { cls: string; blink?: boolean }> = {
    "P1 Critical": { cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", blink: true },
    "P2 High": { cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
    "P3 Medium": { cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
    "P4 Low": { cls: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
    "P5 Informational": { cls: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
    "P6 Resolved": { cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  };
  const cfg = map[severity] || { cls: "bg-gray-100 text-gray-600" };
  return <span className={cn("woc-pill", cfg.cls, cfg.blink && "animate-pulse")}>{severity}</span>;
}

function ExceptionTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    "Inventory Shortage": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    "Equipment Failure": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Quality Hold": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "Dock Blockage": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Labor Shortage": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Carrier Delay": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "System Error": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "Safety Incident": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    "Temperature Excursion": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "Weight Discrepancy": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  };
  return <span className={cn("woc-pill", map[type] || "bg-gray-100 text-gray-600")}>{type}</span>;
}

function TeamBadge({ team }: { team: string }) {
  const map: Record<string, string> = {
    Operations: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    Quality: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    Safety: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    IT: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    Logistics: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  };
  return <span className={cn("woc-pill", map[team] || "bg-gray-100 text-gray-600")}>{team}</span>;
}

function ResolutionStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Open: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    Investigating: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    Acknowledged: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    Escalated: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    Resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Closed: "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300",
  };
  return <span className={cn("woc-pill", map[status] || "bg-gray-100 text-gray-600")}>{status}</span>;
}

function IncidentTimeline({ statusIndex }: { statusIndex: number }) {
  const stages = ["Detected", "Acknowledged", "Investigated", "Resolved", "Closed"];
  return (
    <div className="flex items-center gap-1">
      {stages.map((s, idx) => (
        <React.Fragment key={s}>
          <div className={cn("woc-stage-dot", idx <= statusIndex ? "woc-stage-done" : "woc-stage-pending")}>
            {idx + 1}
          </div>
          {idx < stages.length - 1 && (
            <div className={cn("woc-stage-line", idx < statusIndex ? "woc-stage-line-done" : "woc-stage-line-pending")} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function MeanTimeToResolve({ mttr }: { mttr: number }) {
  const color = mttr <= 4 ? TC.emerald : mttr <= 12 ? "#f59e0b" : mttr <= 24 ? TC.orange : TC.red;
  return (
    <div className="woc-mttr-tile" style={{ borderColor: color }}>
      <div className="text-[10px] text-slate-500 mb-1">MTTR</div>
      <div className="text-xl font-bold" style={{ color }}>{mttr}h</div>
    </div>
  );
}

function ExceptionTrendBadge({ trend }: { trend: string }) {
  const map: Record<string, { icon: React.ReactNode; color: string }> = {
    up: { icon: <TrendingUp className="w-3 h-3" />, color: TC.red },
    down: { icon: <TrendingDown className="w-3 h-3" />, color: TC.emerald },
    stable: { icon: <Activity className="w-3 h-3" />, color: TC.gray },
  };
  const cfg = map[trend] || map.stable;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: cfg.color }}>
      {cfg.icon} {trend}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SORT ICON HELPER
// ═══════════════════════════════════════════════════════════════════════════════
function SortIcon({ field, sortField }: { field: string; sortField: string }) {
  if (sortField !== field) return <span className="text-gray-300 dark:text-gray-600 ml-1 text-xs">↕</span>;
  return <span className="text-cyan-500 ml-1 text-xs">↑</span>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PIE CHART COLORS
// ═══════════════════════════════════════════════════════════════════════════════
const OPS_PIE_COLORS = [TC.emerald, TC.amber, TC.sky, TC.slate, TC.red, TC.gray];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function WarehouseOpsCommandView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("0");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<any>(null);

  const openDrawer = useCallback((record: any) => {
    setDrawerRecord(record);
    setDrawerOpen(true);
  }, []);

  const handleSort = useCallback((field: string) => {
    setSortField(prev => prev === field ? "" : field);
  }, []);

  const sortData = useCallback(<T extends Record<string, any>>(data: T[], field: string): T[] => {
    if (!sortField || sortField !== field) return data;
    return [...data].sort((a, b) => {
      const va = a[field], vb = b[field];
      if (typeof va === "number" && typeof vb === "number") return vb - va;
      return String(va).localeCompare(String(vb));
    });
  }, [sortField]);

  // ── Filtered Data ───────────────────────────────────────────────
  const filteredDocks = useMemo(() => {
    let d = DATA.docks;
    if (searchTerm) d = d.filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()) || x.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()));
    if (statusFilter !== "All") d = d.filter(x => x.status === statusFilter);
    return sortData(d, sortField);
  }, [searchTerm, statusFilter, sortField, sortData]);

  const filteredWorkforce = useMemo(() => {
    let d = DATA.workforce;
    if (searchTerm) d = d.filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()) || x.empId.toLowerCase().includes(searchTerm.toLowerCase()));
    if (statusFilter !== "All") d = d.filter(x => x.role === statusFilter || x.zone === statusFilter);
    return sortData(d, sortField);
  }, [searchTerm, statusFilter, sortField, sortData]);

  const filteredInbound = useMemo(() => {
    let d = DATA.inbound;
    if (searchTerm) d = d.filter(x => x.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) || x.carrier.toLowerCase().includes(searchTerm.toLowerCase()));
    if (statusFilter !== "All") d = d.filter(x => x.status === statusFilter || x.carrier === statusFilter);
    return sortData(d, sortField);
  }, [searchTerm, statusFilter, sortField, sortData]);

  const filteredOutbound = useMemo(() => {
    let d = DATA.outbound;
    if (searchTerm) d = d.filter(x => x.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) || x.carrier.toLowerCase().includes(searchTerm.toLowerCase()));
    if (statusFilter !== "All") d = d.filter(x => x.status === statusFilter || x.carrier === statusFilter);
    return sortData(d, sortField);
  }, [searchTerm, statusFilter, sortField, sortData]);

  const filteredExceptions = useMemo(() => {
    let d = DATA.exceptions;
    if (searchTerm) d = d.filter(x => x.id.toLowerCase().includes(searchTerm.toLowerCase()) || x.type.toLowerCase().includes(searchTerm.toLowerCase()));
    if (statusFilter !== "All") d = d.filter(x => x.severity === statusFilter || x.status === statusFilter);
    return sortData(d, sortField);
  }, [searchTerm, statusFilter, sortField, sortData]);

  return (
    <div className="woc-root flex flex-col gap-4">
      <PageHeader title="Warehouse Operations Command Center" description="Unified real-time command view of all warehouse operations" />

      {/* Global Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search records..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => { setSearchTerm(""); setStatusFilter("All"); setSortField(""); }}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v)}>
        <TabsList className="w-full flex overflow-x-auto">
          <TabsTrigger value="0" className="text-xs px-3">Live Ops Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="text-xs px-3">Dock & Yard</TabsTrigger>
          <TabsTrigger value="2" className="text-xs px-3">Workforce</TabsTrigger>
          <TabsTrigger value="3" className="text-xs px-3">Inbound Pipeline</TabsTrigger>
          <TabsTrigger value="4" className="text-xs px-3">Outbound Pipeline</TabsTrigger>
          <TabsTrigger value="5" className="text-xs px-3">Exception Queue</TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 0: LIVE OPERATIONS DASHBOARD                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="0" className="space-y-4 mt-4">
          {/* KPI Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DATA.kpis.map(kpi => (
              <Card key={kpi.label} className="hover-lift-sm woc-kpi-card">
                <CardContent className="inner-glow glass-subtle p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}18`, color: kpi.color }}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">{kpi.label}</div>
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{kpi.value}</div>
                    <div className={cn("text-[10px] font-semibold", kpi.up ? "text-emerald-600" : "text-red-500")}>
                      {kpi.up ? <ArrowUpRight className="w-3 h-3 inline mr-0.5" /> : <ArrowDownRight className="w-3 h-3 inline mr-0.5" />}
                      {kpi.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Hourly Throughput AreaChart */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Hourly Throughput (24h)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={DATA.hourlyThroughput}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="inbound" stackId="1" stroke={TC.cyan} fill={`${TC.cyan}40`} name="Inbound" />
                    <Area type="monotone" dataKey="outbound" stackId="1" stroke={TC.emerald} fill={`${TC.emerald}40`} name="Outbound" />
                    <Area type="monotone" dataKey="crossdock" stackId="1" stroke={TC.orange} fill={`${TC.orange}40`} name="Cross-dock" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ops Status PieChart */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Operations Status</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={DATA.opsStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                      {DATA.opsStatusData.map((_, idx) => <Cell key={idx} fill={OPS_PIE_COLORS[idx % OPS_PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Shift Performance BarChart */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Shift Performance</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DATA.shiftPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <XAxis dataKey="shift" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="throughput" fill={TC.cyan} name="Throughput" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill={TC.orange} name="Target" radius={[4, 4, 0, 0]} opacity={0.4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ops Flow Stacked BarChart */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Operations Flow</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DATA.opsFlow} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Bar dataKey="units" fill={TC.emerald} name="Units" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: DOCK & YARD CONTROL                                        */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search docks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9" />
            </div>
            <select className="h-9 rounded-md border border-input bg-background px-3 text-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              {DATA.DOCK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Dock Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredDocks.slice(0, 20).map(dock => (
              <DockGridCard key={dock.id} dock={dock} onClick={() => openDrawer(dock)} />
            ))}
          </div>

          {/* Table */}
          <Card>
            <CardContent className="inner-glow glass-subtle p-0">
              <div className="max-h-[400px] overflow-y-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("name")}>Dock <SortIcon field="name" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("status")}>Status <SortIcon field="status" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("type")}>Type <SortIcon field="type" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Vehicle</TableHead>
                      <TableHead className="text-xs">Appt Time</TableHead>
                      <TableHead className="text-xs">Appt Status</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("utilization")}>Utilization <SortIcon field="utilization" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Driver</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("cargoWeight")}>Weight (kg) <SortIcon field="cargoWeight" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocks.map(dock => (
                      <TableRow key={dock.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" onClick={() => openDrawer(dock)}>
                        <TableCell className="text-xs font-semibold">{dock.name}</TableCell>
                        <TableCell><DockStatusBadge status={dock.status} /></TableCell>
                        <TableCell className="text-xs">{dock.type}</TableCell>
                        <TableCell><VehicleTypeBadge type={dock.vehicleType} /></TableCell>
                        <TableCell className="text-xs">{dock.appointmentTime}</TableCell>
                        <TableCell><AppointmentTimeBadge status={dock.appointmentStatus} /></TableCell>
                        <TableCell><DockUtilizationBar pct={dock.utilization} /></TableCell>
                        <TableCell className="text-xs">{dock.driverName}</TableCell>
                        <TableCell className="numeric-cell text-xs">{dock.cargoWeight.toLocaleString()}</TableCell>
                        <TableCell><Eye className="h-3.5 w-3.5 text-slate-400" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: WORKFORCE DEPLOYMENT                                        */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search workers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9" />
            </div>
            <select className="h-9 rounded-md border border-input bg-background px-3 text-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Zones & Roles</option>
              {DATA.ZONES.map(z => <option key={z} value={z}>{z}</option>)}
              {DATA.WORKER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Workforce Availability</CardTitle></CardHeader>
            <CardContent><WorkerAvailabilityTile /></CardContent>
          </Card>

          <Card>
            <CardContent className="inner-glow glass-subtle p-0">
              <div className="max-h-[400px] overflow-y-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("name")}>Name <SortIcon field="name" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Role</TableHead>
                      <TableHead className="text-xs">Zone</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("status")}>Status <SortIcon field="status" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("performance")}>Perf % <SortIcon field="performance" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Level</TableHead>
                      <TableHead className="text-xs">Shift</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("tasksCompleted")}>Tasks <SortIcon field="tasksCompleted" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("hourlyRate")}>Rate (₹) <SortIcon field="hourlyRate" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkforce.map(w => (
                      <TableRow key={w.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" onClick={() => openDrawer(w)}>
                        <TableCell className="text-xs font-semibold">{w.name}</TableCell>
                        <TableCell><WorkerRoleBadge role={w.role} /></TableCell>
                        <TableCell><ZoneBadge zone={w.zone} /></TableCell>
                        <TableCell><TaskStatusBadge status={w.status} /></TableCell>
                        <TableCell><PerformanceRing value={w.performance} /></TableCell>
                        <TableCell className="text-xs">{w.performanceLevel}</TableCell>
                        <TableCell><ShiftProgressRing elapsed={w.shiftElapsed} total={w.shiftTotal} /></TableCell>
                        <TableCell className="text-xs">{w.tasksCompleted}/{w.tasksAssigned}</TableCell>
                        <TableCell className="numeric-cell text-xs">₹{w.hourlyRate}</TableCell>
                        <TableCell><Eye className="h-3.5 w-3.5 text-slate-400" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: INBOUND PIPELINE                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search inbound..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9" />
            </div>
            <select className="h-9 rounded-md border border-input bg-background px-3 text-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses & Carriers</option>
              {DATA.INBOUND_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              {DATA.CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Card>
            <CardContent className="inner-glow glass-subtle p-0">
              <div className="max-h-[400px] overflow-y-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("poNumber")}>PO # <SortIcon field="poNumber" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Carrier</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("status")}>Status <SortIcon field="status" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Priority</TableHead>
                      <TableHead className="text-xs">Stage</TableHead>
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-xs">Volume</TableHead>
                      <TableHead className="text-xs">ETA</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("value")}>Value <SortIcon field="value" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInbound.map(rec => (
                      <TableRow key={rec.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" onClick={() => openDrawer(rec)}>
                        <TableCell className="text-xs font-semibold">{rec.poNumber}</TableCell>
                        <TableCell><CarrierBadge carrier={rec.carrier} /></TableCell>
                        <TableCell><InboundStatusBadge status={rec.status} /></TableCell>
                        <TableCell><PriorityBadge priority={rec.priority} /></TableCell>
                        <TableCell><PipelineStageTracker stageIndex={rec.stageIndex} /></TableCell>
                        <TableCell className="text-xs">{rec.category}</TableCell>
                        <TableCell><VolumeIndicator expected={rec.expectedQty} received={rec.receivedQty} /></TableCell>
                        <TableCell><ETAIndicator eta={rec.eta} etaStatus={rec.etaStatus} /></TableCell>
                        <TableCell className="numeric-cell text-xs">{formatINR(rec.value)}</TableCell>
                        <TableCell><Eye className="h-3.5 w-3.5 text-slate-400" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: OUTBOUND PIPELINE                                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search outbound..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9" />
            </div>
            <select className="h-9 rounded-md border border-input bg-background px-3 text-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses & Carriers</option>
              {DATA.OUTBOUND_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              {DATA.CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Card>
            <CardContent className="inner-glow glass-subtle p-0">
              <div className="max-h-[400px] overflow-y-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("orderNo")}>Order # <SortIcon field="orderNo" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("status")}>Status <SortIcon field="status" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Shipping</TableHead>
                      <TableHead className="text-xs">Carrier</TableHead>
                      <TableHead className="text-xs">SLA Tier</TableHead>
                      <TableHead className="text-xs">SLA Timer</TableHead>
                      <TableHead className="text-xs">Readiness</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("value")}>Value <SortIcon field="value" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOutbound.map(rec => (
                      <TableRow key={rec.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" onClick={() => openDrawer(rec)}>
                        <TableCell className="text-xs font-semibold">{rec.orderNo}</TableCell>
                        <TableCell><OrderTypeBadge type={rec.orderType} /></TableCell>
                        <TableCell><OutboundStatusBadge status={rec.status} /></TableCell>
                        <TableCell><ShippingMethodBadge method={rec.shippingMethod} /></TableCell>
                        <TableCell><CarrierBadge carrier={rec.carrier} /></TableCell>
                        <TableCell><SLATierBadge tier={rec.slaTier} /></TableCell>
                        <TableCell><SLACountdownTimer remaining={rec.slaRemaining} total={rec.slaHours} pct={rec.slaPct} /></TableCell>
                        <TableCell><DispatchReadinessBar readiness={rec.readiness} /></TableCell>
                        <TableCell className="numeric-cell text-xs">{formatINR(rec.value)}</TableCell>
                        <TableCell><Eye className="h-3.5 w-3.5 text-slate-400" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: EXCEPTION & INCIDENT QUEUE                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search exceptions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9" />
            </div>
            <select className="h-9 rounded-md border border-input bg-background px-3 text-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Severities & Statuses</option>
              {DATA.SEVERITY_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
              {DATA.EXCEPTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <Card>
            <CardContent className="inner-glow glass-subtle p-0">
              <div className="max-h-[400px] overflow-y-auto">
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("id")}>ID <SortIcon field="id" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("severity")}>Severity <SortIcon field="severity" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("status")}>Status <SortIcon field="status" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs">Team</TableHead>
                      <TableHead className="text-xs">MTTR</TableHead>
                      <TableHead className="text-xs">Trend</TableHead>
                      <TableHead className="text-xs">Timeline</TableHead>
                      <TableHead className="text-xs cursor-pointer" onClick={() => handleSort("impactValue")}>Impact <SortIcon field="impactValue" sortField={sortField} /></TableHead>
                      <TableHead className="text-xs"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExceptions.map(exc => (
                      <TableRow key={exc.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" onClick={() => openDrawer(exc)}>
                        <TableCell className="text-xs font-semibold">{exc.id}</TableCell>
                        <TableCell><ExceptionSeverityBadge severity={exc.severity} /></TableCell>
                        <TableCell><ExceptionTypeBadge type={exc.type} /></TableCell>
                        <TableCell><ResolutionStatusBadge status={exc.status} /></TableCell>
                        <TableCell><TeamBadge team={exc.team} /></TableCell>
                        <TableCell><MeanTimeToResolve mttr={exc.mttr} /></TableCell>
                        <TableCell><ExceptionTrendBadge trend={exc.trend} /></TableCell>
                        <TableCell><IncidentTimeline statusIndex={exc.statusIndex} /></TableCell>
                        <TableCell className="numeric-cell text-xs">{formatINR(exc.impactValue)}</TableCell>
                        <TableCell><Eye className="h-3.5 w-3.5 text-slate-400" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* DRAWERS                                                              */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[440px] overflow-y-auto">
          {drawerRecord && (
            <>
              {/* Dock Drawer */}
              {activeTab === "1" && (
                <>
                  <div className="woc-drawer-header" style={{ background: "linear-gradient(135deg, #0f172a, #334155)" }}>
                    <SheetTitle className="text-white text-sm">{drawerRecord.name}</SheetTitle>
                  </div>
                  <SheetHeader className="sr-only"><SheetTitle>Dock Details</SheetTitle></SheetHeader>
                  <div className="space-y-4 mt-2 px-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <DockStatusBadge status={drawerRecord.status} />
                      <AppointmentTimeBadge status={drawerRecord.appointmentStatus} />
                    </div>
                    <DockUtilizationBar pct={drawerRecord.utilization} />
                    <VehicleTypeBadge type={drawerRecord.vehicleType} />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-slate-500">Driver:</span> <span className="font-medium">{drawerRecord.driverName}</span></div>
                      <div><span className="text-slate-500">Vehicle:</span> <span className="font-medium">{drawerRecord.vehicleNo}</span></div>
                      <div><span className="text-slate-500">Appt Time:</span> <span className="font-medium">{drawerRecord.appointmentTime}</span></div>
                      <div><span className="text-slate-500">Cargo:</span> <span className="font-medium">{drawerRecord.cargoWeight.toLocaleString()} kg</span></div>
                      <div><span className="text-slate-500">Load Progress:</span> <span className="font-medium">{drawerRecord.loadProgress}%</span></div>
                      <div><span className="text-slate-500">Type:</span> <span className="font-medium">{drawerRecord.type}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" className="press-scale flex-1 bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => { toast.success("Dock assigned successfully"); setDrawerOpen(false); }}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Assign
                      </Button>
                      <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => { toast.info("Dock released"); setDrawerOpen(false); }}>
                        <Package className="h-3.5 w-3.5 mr-1" /> Release
                      </Button>
                      <Button size="sm" variant="destructive" className="press-scale flex-1" onClick={() => { toast.warning("Dock placed on hold"); setDrawerOpen(false); }}>
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Hold
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Workforce Drawer */}
              {activeTab === "2" && (
                <>
                  <div className="woc-drawer-header" style={{ background: "linear-gradient(135deg, #06b6d4, #0d9488)" }}>
                    <SheetTitle className="text-white text-sm">{drawerRecord.name}</SheetTitle>
                  </div>
                  <SheetHeader className="sr-only"><SheetTitle>Worker Details</SheetTitle></SheetHeader>
                  <div className="space-y-4 mt-2 px-1">
                    <div className="flex items-center gap-4">
                      <PerformanceRing value={drawerRecord.performance} />
                      <ShiftProgressRing elapsed={drawerRecord.shiftElapsed} total={drawerRecord.shiftTotal} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <WorkerRoleBadge role={drawerRecord.role} />
                      <ZoneBadge zone={drawerRecord.zone} />
                      <TaskStatusBadge status={drawerRecord.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-slate-500">Emp ID:</span> <span className="font-medium">{drawerRecord.empId}</span></div>
                      <div><span className="text-slate-500">Performance:</span> <span className="font-medium">{drawerRecord.performanceLevel}</span></div>
                      <div><span className="text-slate-500">Tasks Done:</span> <span className="font-medium">{drawerRecord.tasksCompleted}/{drawerRecord.tasksAssigned}</span></div>
                      <div><span className="text-slate-500">Hourly Rate:</span> <span className="font-medium">₹{drawerRecord.hourlyRate}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" className="press-scale flex-1 bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => { toast.success("Worker reassigned"); setDrawerOpen(false); }}>
                        <Users className="h-3.5 w-3.5 mr-1" /> Reassign
                      </Button>
                      <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => { toast.info("Break started"); setDrawerOpen(false); }}>
                        <Timer className="h-3.5 w-3.5 mr-1" /> Break
                      </Button>
                      <Button size="sm" variant="destructive" className="press-scale flex-1" onClick={() => { toast.warning("Worker released"); setDrawerOpen(false); }}>
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Release
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Inbound Drawer */}
              {activeTab === "3" && (
                <>
                  <div className="woc-drawer-header" style={{ background: "linear-gradient(135deg, #f97316, #f59e0b)" }}>
                    <SheetTitle className="text-white text-sm">{drawerRecord.poNumber}</SheetTitle>
                  </div>
                  <SheetHeader className="sr-only"><SheetTitle>Inbound Details</SheetTitle></SheetHeader>
                  <div className="space-y-4 mt-2 px-1">
                    <PipelineStageTracker stageIndex={drawerRecord.stageIndex} />
                    <div className="flex items-center gap-2 flex-wrap">
                      <PriorityBadge priority={drawerRecord.priority} />
                      <InboundStatusBadge status={drawerRecord.status} />
                      <CarrierBadge carrier={drawerRecord.carrier} />
                    </div>
                    <VolumeIndicator expected={drawerRecord.expectedQty} received={drawerRecord.receivedQty} />
                    <ETAIndicator eta={drawerRecord.eta} etaStatus={drawerRecord.etaStatus} />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-slate-500">Category:</span> <span className="font-medium">{drawerRecord.category}</span></div>
                      <div><span className="text-slate-500">Origin:</span> <span className="font-medium">{drawerRecord.origin}</span></div>
                      <div><span className="text-slate-500">Vehicle:</span> <span className="font-medium">{drawerRecord.vehicleNo}</span></div>
                      <div><span className="text-slate-500">Value:</span> <span className="font-medium">{formatINR(drawerRecord.value)}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" className="press-scale flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={() => { toast.success("Receiving started"); setDrawerOpen(false); }}>
                        <Package className="h-3.5 w-3.5 mr-1" /> Receive
                      </Button>
                      <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => { toast.info("Rescheduled"); setDrawerOpen(false); }}>
                        <Clock className="h-3.5 w-3.5 mr-1" /> Reschedule
                      </Button>
                      <Button size="sm" variant="destructive" className="press-scale flex-1" onClick={() => { toast.error("Shipment rejected"); setDrawerOpen(false); }}>
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Outbound Drawer */}
              {activeTab === "4" && (
                <>
                  <div className="woc-drawer-header" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                    <SheetTitle className="text-white text-sm">{drawerRecord.orderNo}</SheetTitle>
                  </div>
                  <SheetHeader className="sr-only"><SheetTitle>Outbound Details</SheetTitle></SheetHeader>
                  <div className="space-y-4 mt-2 px-1">
                    <OutboundStatusBadge status={drawerRecord.status} />
                    <SLACountdownTimer remaining={drawerRecord.slaRemaining} total={drawerRecord.slaHours} pct={drawerRecord.slaPct} />
                    <DispatchReadinessBar readiness={drawerRecord.readiness} />
                    <div className="flex items-center gap-2 flex-wrap">
                      <OrderTypeBadge type={drawerRecord.orderType} />
                      <ShippingMethodBadge method={drawerRecord.shippingMethod} />
                      <SLATierBadge tier={drawerRecord.slaTier} />
                      <CarrierBadge carrier={drawerRecord.carrier} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-slate-500">Destination:</span> <span className="font-medium">{drawerRecord.destination}</span></div>
                      <div><span className="text-slate-500">Items:</span> <span className="font-medium">{drawerRecord.packedItems}/{drawerRecord.totalItems}</span></div>
                      <div><span className="text-slate-500">Weight:</span> <span className="font-medium">{drawerRecord.weight} kg</span></div>
                      <div><span className="text-slate-500">Value:</span> <span className="font-medium">{formatINR(drawerRecord.value)}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" className="press-scale flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { toast.success("Order shipped"); setDrawerOpen(false); }}>
                        <Truck className="h-3.5 w-3.5 mr-1" /> Ship
                      </Button>
                      <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => { toast.warning("Order held"); setDrawerOpen(false); }}>
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Hold
                      </Button>
                      <Button size="sm" variant="destructive" className="press-scale flex-1" onClick={() => { toast.info("Priority upgraded"); setDrawerOpen(false); }}>
                        <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Priority Up
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Exception Drawer */}
              {activeTab === "5" && (
                <>
                  <div className="woc-drawer-header" style={{ background: "linear-gradient(135deg, #e11d48, #ef4444)" }}>
                    <SheetTitle className="text-white text-sm">{drawerRecord.id} — {drawerRecord.type}</SheetTitle>
                  </div>
                  <SheetHeader className="sr-only"><SheetTitle>Exception Details</SheetTitle></SheetHeader>
                  <div className="space-y-4 mt-2 px-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ExceptionSeverityBadge severity={drawerRecord.severity} />
                      <ResolutionStatusBadge status={drawerRecord.status} />
                    </div>
                    <IncidentTimeline statusIndex={drawerRecord.statusIndex} />
                    <MeanTimeToResolve mttr={drawerRecord.mttr} />
                    <div className="flex items-center gap-2 flex-wrap">
                      <TeamBadge team={drawerRecord.team} />
                      <ExceptionTrendBadge trend={drawerRecord.trend} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-slate-500">Reported By:</span> <span className="font-medium">{drawerRecord.reportedBy}</span></div>
                      <div><span className="text-slate-500">Warehouse:</span> <span className="font-medium">{drawerRecord.warehouse}</span></div>
                      <div><span className="text-slate-500">Resolution:</span> <span className="font-medium">{drawerRecord.resolution}</span></div>
                      <div><span className="text-slate-500">Impact:</span> <span className="font-medium">{formatINR(drawerRecord.impactValue)}</span></div>
                      <div className="col-span-2"><span className="text-slate-500">Description:</span> <span className="font-medium">{drawerRecord.description}</span></div>
                      <div><span className="text-slate-500">Created:</span> <span className="font-medium">{drawerRecord.createdAt}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" className="press-scale flex-1 bg-sky-600 hover:bg-sky-700 text-white" onClick={() => { toast.info("Exception acknowledged"); setDrawerOpen(false); }}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Acknowledge
                      </Button>
                      <Button size="sm" variant="outline" className="press-scale btn-outline-animate flex-1" onClick={() => { toast.warning("Exception escalated"); setDrawerOpen(false); }}>
                        <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Escalate
                      </Button>
                      <Button size="sm" variant="destructive" className="press-scale flex-1" onClick={() => { toast.success("Exception resolved"); setDrawerOpen(false); }}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Resolve
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}


