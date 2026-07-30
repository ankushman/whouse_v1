"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  ArrowLeftRight, ArrowRightLeft, Package, Truck, Clock, CheckCircle2,
  XCircle, AlertTriangle, TrendingUp, TrendingDown, ArrowUpRight,
  ArrowDownRight, Search, Filter, Eye, Zap, PackageCheck, PackageX,
  Warehouse, MapPin, Timer, RotateCcw, BarChart3, Activity, Target,
  Layers, TruckIcon, Container, Ship, Train, Plane, Boxes, ScanBarcode,
  ClipboardList, Gauge, Thermometer, Wind, RefreshCw, ChevronRight,
  IndianRupee, Users, FileText, ShieldCheck, AlertOctagon, Info, CircleDot,
  GitBranch, Forklift, Route, CalendarDays, BadgeCheck, LayoutGrid,
  Waypoints, Network, Shuffle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
type XDockStatus = "arrived" | "unloading" | "sorting" | "staging" | "loading" | "departed" | "delayed" | "cancelled";
type TransferPriority = "critical" | "high" | "medium" | "low";
type TransportMode = "truck" | "rail" | "air" | "sea" | "intermodal";
type ConsolidationType = "single_source" | "multi_source" | "deconsolidation" | "kitting" | "returns_processing";
type GateStatus = "available" | "occupied" | "reserved" | "maintenance";
type DockType = "inbound" | "outbound" | "cross_dock" | "flex";

const STATUS_LABELS: Record<XDockStatus, string> = {
  arrived: "Arrived",
  unloading: "Unloading",
  sorting: "Sorting",
  staging: "Staging",
  loading: "Loading",
  departed: "Departed",
  delayed: "Delayed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<XDockStatus, string> = {
  arrived: "#3b82f6",
  unloading: "#f59e0b",
  sorting: "#8b5cf6",
  staging: "#06b6d4",
  loading: "#f97316",
  departed: "#10b981",
  delayed: "#ef4444",
  cancelled: "#6b7280",
};

const PRIORITY_LABELS: Record<TransferPriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const PRIORITY_COLORS: Record<TransferPriority, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#3b82f6",
  low: "#6b7280",
};

const TRANSPORT_MODE_LABELS: Record<TransportMode, string> = {
  truck: "Truck",
  rail: "Rail",
  air: "Air",
  sea: "Sea",
  intermodal: "Intermodal",
};

const TRANSPORT_ICONS: Partial<Record<TransportMode, React.ReactNode>> = {
  truck: <Truck className="h-3.5 w-3.5" />,
  rail: <Train className="h-3.5 w-3.5" />,
  air: <Plane className="h-3.5 w-3.5" />,
  sea: <Ship className="h-3.5 w-3.5" />,
  intermodal: <Container className="h-3.5" />,
};

const CONSOLIDATION_LABELS: Record<ConsolidationType, string> = {
  single_source: "Single Source",
  multi_source: "Multi-Source Consolidation",
  deconsolidation: "Deconsolidation",
  kitting: "Kitting/Assembly",
  returns_processing: "Returns Processing",
};

const GATE_STATUS_LABELS: Record<GateStatus, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  maintenance: "Maintenance",
};

const GATE_STATUS_COLORS: Record<GateStatus, string> = {
  available: "#10b981",
  occupied: "#3b82f6",
  reserved: "#f59e0b",
  maintenance: "#ef4444",
};

const WAREHOUSES = [
  "Mumbai Central Hub", "Delhi NCR Facility", "Chennai Gateway",
  "Kolkata Distribution", "Bangalore South Hub", "Hyderabad Depot",
] as const;

type Warehouse = typeof WAREHOUSES[number];

// ============================================================================
// Seeded PRNG
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ============================================================================
// Data Generation
// ============================================================================
interface TransferShipment {
  id: string;
  source: Warehouse;
  destination: Warehouse;
  transportMode: TransportMode;
  status: XDockStatus;
  priority: TransferPriority;
  consolidationType: ConsolidationType;
  arrivalTime: number;
  departureTime: number;
  dwellTimeMin: number;
  palletCount: number;
  totalWeight: number;
  totalVolume: number;
  lineItems: number;
  value: number;
  handlingUnit: string;
  carrier: string;
  driverName: string;
  vehicleReg: string;
  dockAssignment: string;
  gateNumber: string;
  slaMinutes: number;
  isOtp: boolean;
  damageFlag: boolean;
  qualityHold: boolean;
  scanRate: number;
  notes: string;
}

interface GateRecord {
  id: string;
  gateNumber: string;
  gateType: DockType;
  status: GateStatus;
  warehouse: Warehouse;
  currentShipment: string | null;
  lastUsed: number;
  avgTurnaround: number;
  utilizationToday: number;
}

interface DockSlot {
  id: string;
  dockNumber: string;
  dockType: DockType;
  warehouse: Warehouse;
  status: GateStatus;
  currentShipmentId: string | null;
  currentShipmentLabel: string;
  occupancyMinutes: number;
  maxCapacityMin: number;
  throughputToday: number;
  avgProcessingTime: number;
}

interface HourlyFlow {
  hour: string;
  inbound: number;
  outbound: number;
  crossDock: number;
  total: number;
}

function generateData() {
  const rand = seededRandom(119119);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
  const pickIdx = <T,>(arr: readonly T[]): number => Math.floor(rand() * arr.length);

  const statuses: XDockStatus[] = ["arrived", "unloading", "sorting", "staging", "loading", "departed", "delayed", "cancelled"];
  const priorities: TransferPriority[] = ["critical", "high", "medium", "low"];
  const transportModes: TransportMode[] = ["truck", "rail", "air", "sea", "intermodal"];
  const consolidationTypes: ConsolidationType[] = ["single_source", "multi_source", "deconsolidation", "kitting", "returns_processing"];
  const gateStatuses: GateStatus[] = ["available", "occupied", "reserved", "maintenance"];
  const dockTypes: DockType[] = ["inbound", "outbound", "cross_dock", "flex"];

  const carriers = [
    "BlueDart Logistics", "DTDC Express", "Delhivery", "Ekart Logistics",
    "TCI Express", "Gati Limited", "VRL Logistics", "AllCargo Logistics",
    "SafeExpress", "Spoton"
  ];
  const drivers = [
    "Rajesh Kumar", "Sunil Patel", "Amit Singh", "Vikram Sharma", "Manoj Gupta",
    "Suresh Yadav", "Anil Mehta", "Ramesh Verma", "Pradeep Joshi", "Deepak Chauhan",
    "Kiran Rao", "Naveen Reddy", "Arun Nair", "Santosh Das", "Gopalakrishnan P"
  ];
  const handlingUnits = ["Pallets", "Cartons", "Totes", "IGloos", "Slip Sheets", "Cages", "Bags", "Crates"];
  const notes = [
    "Priority express — handle with urgency",
    "Temperature-sensitive — cold chain required",
    "Fragile items — careful handling",
    "Hazmat — follow safety protocols",
    "High-value cargo — security escort needed",
    "Time-critical — SLA breach risk",
    "Customer escalation — escalate to ops manager",
    "Multi-drop — verify routing",
    "Oversized load — special equipment needed",
    "Pharmaceutical — GMP compliance required",
    "Perishable — FIFO processing",
    "Electronic components — ESD precautions",
    "Awaiting customs clearance",
    "Customer pickup scheduled",
    "Consolidation in progress",
  ];

  // Generate 65 transfer shipments
  const now = Date.now();
  const shipments: TransferShipment[] = [];
  for (let i = 0; i < 65; i++) {
    const src = pick(WAREHOUSES);
    let dest = pick(WAREHOUSES);
    while (dest === src) dest = pick(WAREHOUSES);

    const status = pick(statuses);
    const arrivalOffset = Math.floor(rand() * 48) * 3600000;
    const dwellMinutes = Math.floor(rand() * 180) + 15;
    const arrivalTime = now - arrivalOffset;
    const departureTime = status === "departed" || status === "delayed"
      ? arrivalTime + dwellMinutes * 60000
      : status === "arrived"
        ? arrivalTime
        : arrivalTime + Math.floor(dwellMinutes * rand()) * 60000;

    const palletCount = Math.floor(rand() * 40) + 2;
    const totalWeight = Math.floor(rand() * 8000) + 200;
    const totalVolume = Math.floor(rand() * 60) + 1;
    const lineItems = Math.floor(rand() * 50) + 3;
    const value = Math.floor(rand() * 5000000) + 50000;
    const slaMinutes = pick([60, 90, 120, 180, 240]);
    const isOtp = rand() > 0.35;
    const damageFlag = rand() > 0.92;
    const qualityHold = rand() > 0.94;
    const scanRate = Math.floor(rand() * 15) + 85;

    shipments.push({
      id: `XDT-${String(i + 1).padStart(4, "0")}`,
      source: src,
      destination: dest,
      transportMode: pick(transportModes),
      status,
      priority: pick(priorities),
      consolidationType: pick(consolidationTypes),
      arrivalTime,
      departureTime,
      dwellTimeMin: dwellMinutes,
      palletCount,
      totalWeight,
      totalVolume,
      lineItems,
      value,
      handlingUnit: pick(handlingUnits),
      carrier: pick(carriers),
      driverName: pick(drivers),
      vehicleReg: `MH${Math.floor(rand() * 99).toString().padStart(2, "0")}${String.fromCharCode(65 + Math.floor(rand() * 26))}${String.fromCharCode(65 + Math.floor(rand() * 26))}${Math.floor(rand() * 9999).toString().padStart(4, "0")}`,
      dockAssignment: `D-${(i % 12) + 1}`,
      gateNumber: `G-${(i % 8) + 1}`,
      slaMinutes,
      isOtp,
      damageFlag,
      qualityHold,
      scanRate,
      notes: pick(notes),
    });
  }

  // Generate 24 gates
  const gates: GateRecord[] = [];
  for (let i = 0; i < 24; i++) {
    const gStatus = pick(gateStatuses);
    gates.push({
      id: `G-${(i % 8) + 1}-${pickIdx(WAREHOUSES)}`,
      gateNumber: `G-${(i % 8) + 1}`,
      gateType: pick(dockTypes),
      status: gStatus,
      warehouse: WAREHOUSES[i % 6],
      currentShipment: gStatus === "occupied" ? shipments[i % shipments.length].id : null,
      lastUsed: now - Math.floor(rand() * 3600000 * 6),
      avgTurnaround: Math.floor(rand() * 120) + 20,
      utilizationToday: Math.floor(rand() * 40) + 50,
    });
  }

  // Generate 18 dock slots
  const docks: DockSlot[] = [];
  for (let i = 0; i < 18; i++) {
    const dStatus = pick(gateStatuses);
    const processingShip = dStatus === "occupied" ? shipments[i % shipments.length] : null;
    docks.push({
      id: `D-${i + 1}`,
      dockNumber: `D-${i + 1}`,
      dockType: pick(dockTypes),
      warehouse: WAREHOUSES[i % 6],
      status: dStatus,
      currentShipmentId: processingShip?.id ?? null,
      currentShipmentLabel: processingShip ? `${processingShip.id} (${processingShip.carrier})` : "—",
      occupancyMinutes: dStatus === "occupied" ? Math.floor(rand() * 90) + 5 : 0,
      maxCapacityMin: 120,
      throughputToday: Math.floor(rand() * 12) + 2,
      avgProcessingTime: Math.floor(rand() * 60) + 15,
    });
  }

  // Generate hourly flow data (24h)
  const hourlyFlow: HourlyFlow[] = [];
  for (let h = 0; h < 24; h++) {
    const inb = Math.floor(rand() * 18) + 3;
    const outb = Math.floor(rand() * 16) + 2;
    const cd = Math.floor(rand() * 10) + 1;
    hourlyFlow.push({
      hour: `${h.toString().padStart(2, "0")}:00`,
      inbound: inb,
      outbound: outb,
      crossDock: cd,
      total: inb + outb + cd,
    });
  }

  // Monthly throughput trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyThroughput = months.map(m => ({
    month: m,
    shipments: Math.floor(rand() * 400) + 250,
    pallets: Math.floor(rand() * 8000) + 4000,
    avgDwell: +(rand() * 80 + 40).toFixed(1),
    otpRate: +(rand() * 15 + 82).toFixed(1),
    costPerUnit: +(rand() * 30 + 50).toFixed(2),
  }));

  // Consolidation type distribution
  const consolidationDist = consolidationTypes.map(ct => ({
    type: CONSOLIDATION_LABELS[ct],
    count: Math.floor(rand() * 200) + 20,
  }));

  return { shipments, gates, docks, hourlyFlow, monthlyThroughput, consolidationDist, carriers, drivers };
}

const DATA = generateData();

// ============================================================================
// Helper components
// ============================================================================
function formatTime(ms: number) {
  const diff = Date.now() - ms;
  if (diff < 0) return "In future";
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
}

function formatWeight(kg: number) {
  return kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${kg}kg`;
}

function StatusBadge({ status }: { status: XDockStatus }) {
  const variant = status === "departed" ? "success"
    : status === "delayed" ? "destructive"
    : status === "cancelled" ? "secondary"
    : "default";
  return (
    <Badge variant={variant as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"} className="badge-interactive cd-status-badge cd-status--${status}">
      <span className="cd-status-dot" style={{ backgroundColor: STATUS_COLORS[status] }} />
      {STATUS_LABELS[status]}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: TransferPriority }) {
  return (
    <Badge variant={priority === "critical" ? "destructive" : priority === "high" ? "warning" : "default"}
      className="cd-priority-badge">
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

function KpiCard({ title, value, subtitle, icon, trend, colorClass }: {
  title: string; value: string; subtitle: string;
  icon: React.ReactNode; trend?: "up" | "down"; colorClass: string;
}) {
  return (
    <Card className={`cd-kpi-card ${colorClass}`}>
      <CardContent className="glass-subtle p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="cd-kpi-title">{title}</p>
            <p className="cd-kpi-value">{value}</p>
            <p className="cd-kpi-subtitle">
              {trend === "up" && <TrendingUp className="h-3 w-3 inline mr-1" style={{ color: "#10b981" }} />}
              {trend === "down" && <TrendingDown className="h-3 w-3 inline mr-1" style={{ color: "#ef4444" }} />}
              {subtitle}
            </p>
          </div>
          <div className={`cd-kpi-icon ${colorClass}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function SvgRing({ value, size = 56, strokeWidth = 5, label }: {
  value: number; size?: number; strokeWidth?: number; label: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(value, 100) / 100) * circ;
  const color = value >= 85 ? "#10b981" : value >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="cd-ring-container">
      <svg width={size} height={size} className="cd-ring-svg">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} className="dark:stroke-gray-700" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} className="cd-ring-progress" />
      </svg>
      <div className="cd-ring-label">{Math.round(value)}%</div>
    </div>
  );
}

// ============================================================================
// Main component
// ============================================================================
export default function CrossDockTransshipmentView() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterTransport, setFilterTransport] = useState<string>("all");
  const [selectedShipment, setSelectedShipment] = useState<TransferShipment | null>(null);

  const tabs = [
    "Cross-Dock Overview",
    "Transfer Register",
    "Dock & Gate Control",
    "Flow Analytics",
    "Performance Scorecard",
  ];

  const activeShipments = useMemo(() =>
    DATA.shipments.filter(s => !["departed", "cancelled"].includes(s.status)),
    []
  );

  const filteredShipments = useMemo(() => {
    return DATA.shipments.filter(s => {
      if (searchQuery && !s.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.carrier.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.source.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.destination.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.driverName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      if (filterWarehouse !== "all" && s.source !== filterWarehouse && s.destination !== filterWarehouse) return false;
      if (filterPriority !== "all" && s.priority !== filterPriority) return false;
      if (filterTransport !== "all" && s.transportMode !== filterTransport) return false;
      return true;
    });
  }, [searchQuery, filterStatus, filterWarehouse, filterPriority, filterTransport]);

  // KPI calculations
  const totalShipments = DATA.shipments.length;
  const activeCount = activeShipments.length;
  const delayedCount = DATA.shipments.filter(s => s.status === "delayed").length;
  const departedCount = DATA.shipments.filter(s => s.status === "departed").length;
  const totalPallets = DATA.shipments.reduce((a, s) => a + s.palletCount, 0);
  const totalValue = DATA.shipments.reduce((a, s) => a + s.value, 0);
  const avgDwell = +(DATA.shipments.reduce((a, s) => a + s.dwellTimeMin, 0) / totalShipments).toFixed(1);
  const otpRate = +((DATA.shipments.filter(s => s.isOtp).length / totalShipments) * 100).toFixed(1);
  const avgScanRate = +(DATA.shipments.reduce((a, s) => a + s.scanRate, 0) / totalShipments).toFixed(1);

  // Status distribution
  const statusDist = useMemo(() => {
    const counts: Record<string, number> = {};
    DATA.shipments.forEach(s => { counts[s.status] = (counts[s.status] || 0) + 1; });
    return Object.entries(counts).map(([status, count]) => ({
      status: STATUS_LABELS[status as XDockStatus],
      count,
      fill: STATUS_COLORS[status as XDockStatus],
    }));
  }, []);

  // Transport mode distribution
  const transportDist = useMemo(() => {
    const counts: Record<string, number> = {};
    DATA.shipments.forEach(s => { counts[s.transportMode] = (counts[s.transportMode] || 0) + 1; });
    return Object.entries(counts).map(([mode, count]) => ({
      mode: TRANSPORT_MODE_LABELS[mode as TransportMode],
      count,
    }));
  }, []);

  // Warehouse throughput
  const warehouseThroughput = useMemo(() => {
    return WAREHOUSES.map(wh => {
      const whShipments = DATA.shipments.filter(s => s.source === wh || s.destination === wh);
      return {
        warehouse: wh.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, ""),
        inbound: DATA.shipments.filter(s => s.destination === wh).length,
        outbound: DATA.shipments.filter(s => s.source === wh).length,
        total: whShipments.length,
        avgDwell: +(whShipments.reduce((a, s) => a + s.dwellTimeMin, 0) / Math.max(whShipments.length, 1)).toFixed(1),
      };
    });
  }, []);

  // Dock utilization
  const dockUtilData = useMemo(() => {
    return DATA.docks.map(d => ({
      dock: d.dockNumber,
      utilization: d.throughputToday,
      avgTime: d.avgProcessingTime,
      warehouse: d.warehouse.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, ""),
    }));
  }, []);

  // Priority distribution
  const priorityDist = useMemo(() => {
    const counts: Record<string, number> = {};
    DATA.shipments.forEach(s => { counts[s.priority] = (counts[s.priority] || 0) + 1; });
    return Object.entries(counts).map(([p, count]) => ({
      priority: PRIORITY_LABELS[p as TransferPriority],
      count,
      fill: PRIORITY_COLORS[p as TransferPriority],
    }));
  }, []);

  return (
    <div className="cd-main-container">
      {/* ===== Header ===== */}
      <div className="cd-header">
        <div className="cd-header-content">
          <div className="cd-header-left">
            <div className="cd-header-icon-wrap">
              <ArrowLeftRight className="h-6 w-6" />
            </div>
            <div>
              <h1 className="cd-header-title">Cross-Dock Transshipment Hub</h1>
              <p className="cd-header-subtitle">Real-time transfer, staging & throughput management across all warehouses</p>
            </div>
          </div>
          <div className="cd-header-badges">
            <Badge variant="outline" className="badge-interactive cd-header-badge cd-header-badge--active">
              <Activity className="h-3 w-3 mr-1" />
              {activeCount} Active
            </Badge>
            <Badge variant="destructive" className="badge-interactive cd-header-badge">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {delayedCount} Delayed
            </Badge>
            <Badge variant="success" className="badge-interactive cd-header-badge cd-header-badge--success">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {otpRate}% OTP
            </Badge>
          </div>
        </div>
      </div>

      {/* ===== Tab Bar ===== */}
      <div className="cd-tab-bar">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`cd-tab-btn ${activeTab === i ? "cd-tab-btn--active" : ""}`}>
            <span className="cd-tab-text">{tab}</span>
            {activeTab === i && <span className="cd-tab-indicator" />}
          </button>
        ))}
      </div>

      {/* ===== Tab Content ===== */}
      <div className="cd-tab-content">

        {/* --------------------------------------------------------------- */}
        {/* Tab 0: Cross-Dock Overview                                      */}
        {/* --------------------------------------------------------------- */}
        {activeTab === 0 && (
          <div className="cd-overview-grid">
            {/* KPI Cards */}
            <KpiCard title="Total Transfers" value={String(totalShipments)}
              subtitle={`Pallets: ${totalPallets.toLocaleString()}`}
              icon={<Shuffle className="h-5 w-5" />} trend="up" colorClass="cd-kpi--blue" />
            <KpiCard title="Active Now" value={String(activeCount)}
              subtitle={`${delayedCount} delayed, ${departedCount} departed`}
              icon={<Activity className="h-5 w-5" />} colorClass="cd-kpi--green" />
            <KpiCard title="Avg Dwell Time" value={`${avgDwell} min`}
              subtitle="Target: &lt; 90 min"
              icon={<Timer className="h-5 w-5" />}
              trend={avgDwell > 90 ? "down" : "up"} colorClass="cd-kpi--amber" />
            <KpiCard title="On-Time Performance" value={`${otpRate}%`}
              subtitle={`${DATA.shipments.filter(s => s.isOtp).length}/${totalShipments} shipments`}
              icon={<Target className="h-5 w-5" />} trend={otpRate >= 85 ? "up" : "down"} colorClass="cd-kpi--purple" />
            <KpiCard title="Total Value" value={formatCurrency(totalValue)}
              subtitle={`${DATA.shipments.length} line items`}
              icon={<IndianRupee className="h-5 w-5" />} colorClass="cd-kpi--teal" />
            <KpiCard title="Avg Scan Rate" value={`${avgScanRate}%`}
              subtitle="RFID + barcode accuracy"
              icon={<ScanBarcode className="h-5 w-5" />} trend="up" colorClass="cd-kpi--rose" />

            {/* Status Pipeline */}
            <Card className="cd-chart-card cd-chart-card--wide">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Status Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cd-pipeline-container">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => {
                    const count = DATA.shipments.filter(s => s.status === key).length;
                    const pct = ((count / totalShipments) * 100).toFixed(0);
                    return (
                      <div key={key} className="cd-pipeline-stage">
                        <div className="cd-pipeline-bar" style={{
                          backgroundColor: STATUS_COLORS[key as XDockStatus],
                          width: `${Math.max(Number(pct), 8)}%`,
                        }} />
                        <div className="cd-pipeline-label">
                          <span className="cd-pipeline-name">{label}</span>
                          <span className="cd-pipeline-count">{count}</span>
                          <span className="cd-pipeline-pct">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Throughput Trend */}
            <Card className="cd-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Monthly Throughput
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={DATA.monthlyThroughput}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="shipments" fill="#6366f1" name="Shipments" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" dataKey="otpRate" stroke="#10b981" name="OTP %" strokeWidth={2} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Consolidation Type Distribution */}
            <Card className="cd-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Layers className="h-4 w-4 mr-2" />
                  Consolidation Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={DATA.consolidationDist} dataKey="count" nameKey="type"
                      cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false} fontSize={10}>
                      {DATA.consolidationDist.map((_, i) => (
                        <Cell key={i} fill={["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"][i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Warehouse Throughput Comparison */}
            <Card className="cd-chart-card cd-chart-card--wide">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Warehouse className="h-4 w-4 mr-2" />
                  Warehouse Cross-Dock Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={warehouseThroughput} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="warehouse" tick={{ fontSize: 10 }} width={120} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="inbound" fill="#3b82f6" name="Inbound" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="outbound" fill="#f97316" name="Outbound" stackId="a" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transport Mode Split */}
            <Card className="cd-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Route className="h-4 w-4 mr-2" />
                  Transport Mode Split
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={transportDist} dataKey="count" nameKey="mode"
                      cx="50%" cy="50%" outerRadius={85} innerRadius={45} paddingAngle={4}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false} fontSize={10}>
                      {transportDist.map((_, i) => (
                        <Cell key={i} fill={["#f97316", "#6366f1", "#10b981", "#3b82f6", "#8b5cf6"][i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card className="cd-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <AlertOctagon className="h-4 w-4 mr-2" />
                  Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={priorityDist} dataKey="count" nameKey="priority"
                      cx="50%" cy="50%" outerRadius={85} innerRadius={45} paddingAngle={4}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false} fontSize={10}>
                      {priorityDist.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Active Transfers */}
            <Card className="cd-chart-card cd-chart-card--full">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Active Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cd-recent-table-wrap">
                  <table className="cd-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Route</th>
                        <th>Mode</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Pallets</th>
                        <th>Weight</th>
                        <th>Dwell</th>
                        <th>SLA</th>
                        <th>OTP</th>
                        <th>Flags</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeShipments.slice(0, 15).map((s) => (
                        <tr key={s.id} className="cd-table-row" onClick={() => setSelectedShipment(s)}>
                          <td className="cd-cell-mono">{s.id}</td>
                          <td>
                            <span className="cd-route-text">{s.source.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, "")} → {s.destination.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, "")}</span>
                          </td>
                          <td>
                            <span className="cd-mode-cell">
                              {TRANSPORT_ICONS[s.transportMode]}
                              {TRANSPORT_MODE_LABELS[s.transportMode]}
                            </span>
                          </td>
                          <td><StatusBadge status={s.status} /></td>
                          <td><PriorityBadge priority={s.priority} /></td>
                          <td>{s.palletCount}</td>
                          <td>{formatWeight(s.totalWeight)}</td>
                          <td>{s.dwellTimeMin}m</td>
                          <td>
                            <span className={s.dwellTimeMin <= s.slaMinutes ? "cd-sla-ok" : "cd-sla-breach"}>
                              {s.dwellTimeMin}/{s.slaMinutes}m
                            </span>
                          </td>
                          <td>
                            {s.isOtp ? <CheckCircle2 className="h-4 w-4 cd-otp-ok" /> : <XCircle className="h-4 w-4 cd-otp-fail" />}
                          </td>
                          <td>
                            <span className="cd-flags-cell">
                              {s.damageFlag && <AlertTriangle className="h-3.5 w-3.5 cd-flag-damage" />}
                              {s.qualityHold && <ShieldCheck className="h-3.5 w-3.5 cd-flag-hold" />}
                              {!s.damageFlag && !s.qualityHold && <CheckCircle2 className="h-3.5 w-3.5 cd-flag-clean" />}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* Tab 1: Transfer Register                                        */}
        {/* --------------------------------------------------------------- */}
        {activeTab === 1 && (
          <div className="cd-register-layout">
            {/* Filter Bar */}
            <Card className="cd-filter-card">
              <CardContent className="glass-subtle p-3">
                <div className="cd-filter-bar">
                  <div className="cd-filter-search">
                    <Search className="h-4 w-4 cd-filter-search-icon" />
                    <input type="text" placeholder="Search ID, carrier, driver, route..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="cd-filter-input" />
                  </div>
                  <div className="cd-filter-group">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="cd-filter-select">
                      <option value="all">All Status</option>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="cd-filter-select">
                      <option value="all">All Priority</option>
                      {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <select value={filterTransport} onChange={e => setFilterTransport(e.target.value)} className="cd-filter-select">
                      <option value="all">All Modes</option>
                      {Object.entries(TRANSPORT_MODE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)} className="cd-filter-select">
                      <option value="all">All Warehouses</option>
                      {WAREHOUSES.map(wh => <option key={wh} value={wh}>{wh.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, "")}</option>)}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="cd-results-summary">
              <span className="cd-results-count">{filteredShipments.length} shipments found</span>
              <div className="cd-results-stats">
                <span className="cd-results-stat">Active: {filteredShipments.filter(s => !["departed", "cancelled"].includes(s.status)).length}</span>
                <span className="cd-results-stat">Delayed: {filteredShipments.filter(s => s.status === "delayed").length}</span>
                <span className="cd-results-stat">Value: {formatCurrency(filteredShipments.reduce((a, s) => a + s.value, 0))}</span>
              </div>
            </div>

            {/* Shipment Table */}
            <Card className="cd-table-card">
              <CardContent className="glass-subtle p-0">
                <div className="cd-register-table-wrap">
                  <table className="cd-table cd-table--full">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Route</th>
                        <th>Mode</th>
                        <th>Carrier</th>
                        <th>Driver</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Consolidation</th>
                        <th>Pallets</th>
                        <th>Weight</th>
                        <th>Value</th>
                        <th>Dwell / SLA</th>
                        <th>Dock</th>
                        <th>Gate</th>
                        <th>Scan</th>
                        <th>Flags</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShipments.map((s) => (
                        <tr key={s.id} className="cd-table-row cd-table-row--clickable" onClick={() => setSelectedShipment(s)}>
                          <td className="cd-cell-mono">{s.id}</td>
                          <td>
                            <div className="cd-route-cell">
                              <span className="cd-route-from">{s.source.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, "")}</span>
                              <ArrowRightLeft className="h-3 w-3 cd-route-arrow" />
                              <span className="cd-route-to">{s.destination.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, "")}</span>
                            </div>
                          </td>
                          <td>
                            <span className="cd-mode-cell">
                              {TRANSPORT_ICONS[s.transportMode]}
                              {TRANSPORT_MODE_LABELS[s.transportMode]}
                            </span>
                          </td>
                          <td className="cd-cell-compact">{s.carrier}</td>
                          <td className="cd-cell-compact">{s.driverName}</td>
                          <td><StatusBadge status={s.status} /></td>
                          <td><PriorityBadge priority={s.priority} /></td>
                          <td className="cd-cell-compact">{CONSOLIDATION_LABELS[s.consolidationType]}</td>
                          <td>{s.palletCount} {s.handlingUnit.toLowerCase()}</td>
                          <td>{formatWeight(s.totalWeight)}</td>
                          <td>{formatCurrency(s.value)}</td>
                          <td>
                            <div className="cd-sla-cell">
                              <span className={s.dwellTimeMin <= s.slaMinutes ? "cd-sla-ok" : "cd-sla-breach"}>
                                {s.dwellTimeMin}/{s.slaMinutes}m
                              </span>
                              <div className="cd-sla-bar">
                                <div className="cd-sla-bar-fill"
                                  style={{
                                    width: `${Math.min((s.dwellTimeMin / s.slaMinutes) * 100, 100)}%`,
                                    backgroundColor: s.dwellTimeMin <= s.slaMinutes ? "#10b981" : s.dwellTimeMin <= s.slaMinutes * 1.2 ? "#f59e0b" : "#ef4444",
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="cd-cell-mono">{s.dockAssignment}</td>
                          <td className="cd-cell-mono">{s.gateNumber}</td>
                          <td>
                            <span className={s.scanRate >= 95 ? "cd-scan-ok" : "cd-scan-warn"}>
                              {s.scanRate}%
                            </span>
                          </td>
                          <td>
                            <span className="cd-flags-cell">
                              {s.damageFlag && <span title="Damage reported"><AlertTriangle className="h-3.5 w-3.5 cd-flag-damage" /></span>}
                              {s.qualityHold && <span title="Quality hold"><ShieldCheck className="h-3.5 w-3.5 cd-flag-hold" /></span>}
                              {!s.damageFlag && !s.qualityHold && <span title="Clean"><PackageCheck className="h-3.5 w-3.5 cd-flag-clean" /></span>}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Shipment Inspector Drawer */}
            {selectedShipment && (
              <div className="cd-inspector-overlay" onClick={() => setSelectedShipment(null)}>
                <div className="cd-inspector-drawer" onClick={e => e.stopPropagation()}>
                  <div className="cd-inspector-header">
                    <div className="cd-inspector-title-row">
                      <ArrowLeftRight className="h-5 w-5" />
                      <h3 className="cd-inspector-title">{selectedShipment.id}</h3>
                      <StatusBadge status={selectedShipment.status} />
                      <PriorityBadge priority={selectedShipment.priority} />
                    </div>
                    <button className="cd-inspector-close" onClick={() => setSelectedShipment(null)}>
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="cd-inspector-body">
                    {/* Route Info */}
                    <div className="cd-inspector-section">
                      <h4 className="cd-inspector-section-title">
                        <Route className="h-4 w-4 mr-2" />Route & Carrier
                      </h4>
                      <div className="cd-inspector-grid">
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">From</span>
                          <span className="cd-inspector-value">{selectedShipment.source}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">To</span>
                          <span className="cd-inspector-value">{selectedShipment.destination}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Transport Mode</span>
                          <span className="cd-inspector-value">
                            {TRANSPORT_ICONS[selectedShipment.transportMode]} {TRANSPORT_MODE_LABELS[selectedShipment.transportMode]}
                          </span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Carrier</span>
                          <span className="cd-inspector-value">{selectedShipment.carrier}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Driver</span>
                          <span className="cd-inspector-value">{selectedShipment.driverName}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Vehicle</span>
                          <span className="cd-inspector-value cd-mono">{selectedShipment.vehicleReg}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipment Details */}
                    <div className="cd-inspector-section">
                      <h4 className="cd-inspector-section-title">
                        <Package className="h-4 w-4 mr-2" />Shipment Details
                      </h4>
                      <div className="cd-inspector-grid">
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Consolidation</span>
                          <span className="cd-inspector-value">{CONSOLIDATION_LABELS[selectedShipment.consolidationType]}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Handling Unit</span>
                          <span className="cd-inspector-value">{selectedShipment.handlingUnit}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Pallets</span>
                          <span className="cd-inspector-value">{selectedShipment.palletCount}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Total Weight</span>
                          <span className="cd-inspector-value">{formatWeight(selectedShipment.totalWeight)}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Volume</span>
                          <span className="cd-inspector-value">{selectedShipment.totalVolume} CBM</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Line Items</span>
                          <span className="cd-inspector-value">{selectedShipment.lineItems}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Value</span>
                          <span className="cd-inspector-value">{formatCurrency(selectedShipment.value)}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Scan Rate</span>
                          <span className="cd-inspector-value">{selectedShipment.scanRate}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Timing & SLA */}
                    <div className="cd-inspector-section">
                      <h4 className="cd-inspector-section-title">
                        <Timer className="h-4 w-4 mr-2" />Timing & SLA
                      </h4>
                      <div className="cd-inspector-grid">
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Arrived</span>
                          <span className="cd-inspector-value">{formatTime(selectedShipment.arrivalTime)}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Departed</span>
                          <span className="cd-inspector-value">{formatTime(selectedShipment.departureTime)}</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Dwell Time</span>
                          <span className="cd-inspector-value">{selectedShipment.dwellTimeMin} min</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">SLA Target</span>
                          <span className="cd-inspector-value">{selectedShipment.slaMinutes} min</span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">On-Time</span>
                          <span className="cd-inspector-value">
                            {selectedShipment.isOtp
                              ? <span className="cd-inspector-yes"><CheckCircle2 className="h-4 w-4 mr-1" />Yes</span>
                              : <span className="cd-inspector-no"><XCircle className="h-4 w-4 mr-1" />No</span>}
                          </span>
                        </div>
                        <div className="cd-inspector-field">
                          <span className="cd-inspector-label">Dock</span>
                          <span className="cd-inspector-value">{selectedShipment.dockAssignment} | {selectedShipment.gateNumber}</span>
                        </div>
                      </div>
                      {/* SLA Progress Bar */}
                      <div className="cd-inspector-sla-bar-wrap">
                        <div className="cd-inspector-sla-label">
                          SLA Progress: {selectedShipment.dwellTimeMin} / {selectedShipment.slaMinutes} min
                        </div>
                        <div className="cd-inspector-sla-bar">
                          <div className="cd-inspector-sla-bar-fill" style={{
                            width: `${Math.min((selectedShipment.dwellTimeMin / selectedShipment.slaMinutes) * 100, 100)}%`,
                            backgroundColor: selectedShipment.dwellTimeMin <= selectedShipment.slaMinutes ? "#10b981"
                              : selectedShipment.dwellTimeMin <= selectedShipment.slaMinutes * 1.2 ? "#f59e0b" : "#ef4444",
                          }} />
                        </div>
                      </div>
                    </div>

                    {/* Flags */}
                    <div className="cd-inspector-section">
                      <h4 className="cd-inspector-section-title">
                        <AlertOctagon className="h-4 w-4 mr-2" />Flags & Notes
                      </h4>
                      <div className="cd-inspector-flags">
                        <div className="cd-inspector-flag">
                          <span className="cd-inspector-label">Damage</span>
                          <span className="cd-inspector-value">
                            {selectedShipment.damageFlag
                              ? <Badge variant="destructive"><AlertTriangle className="badge-interactive h-3 w-3 mr-1" />Reported</Badge>
                              : <Badge variant="success"><CheckCircle2 className="badge-interactive h-3 w-3 mr-1" />None</Badge>}
                          </span>
                        </div>
                        <div className="cd-inspector-flag">
                          <span className="cd-inspector-label">Quality Hold</span>
                          <span className="cd-inspector-value">
                            {selectedShipment.qualityHold
                              ? <Badge variant="warning"><ShieldCheck className="badge-interactive h-3 w-3 mr-1" />On Hold</Badge>
                              : <Badge variant="success"><CheckCircle2 className="badge-interactive h-3 w-3 mr-1" />Clear</Badge>}
                          </span>
                        </div>
                      </div>
                      <div className="cd-inspector-notes">
                        <span className="cd-inspector-label">Notes</span>
                        <p className="cd-inspector-note-text">{selectedShipment.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* Tab 2: Dock & Gate Control                                      */}
        {/* --------------------------------------------------------------- */}
        {activeTab === 2 && (
          <div className="cd-dock-layout">
            {/* Dock Slots */}
            <Card className="cd-dock-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Dock Slots Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cd-dock-grid">
                  {DATA.docks.map(dock => (
                    <div key={dock.id} className={`cd-dock-slot cd-dock-slot--${dock.status}`}>
                      <div className="cd-dock-slot-header">
                        <span className="cd-dock-number">{dock.dockNumber}</span>
                        <Badge variant={
                          dock.status === "available" ? "success"
                          : dock.status === "occupied" ? "default"
                          : dock.status === "reserved" ? "warning" : "destructive"
                        } className="cd-dock-status-badge-small">
                          {GATE_STATUS_LABELS[dock.status]}
                        </Badge>
                      </div>
                      <div className="cd-dock-slot-body">
                        <span className="cd-dock-type">{dock.dockType.replace("_", " ").toUpperCase()}</span>
                        <span className="cd-dock-warehouse">{dock.warehouse.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, "")}</span>
                        {dock.currentShipmentId && (
                          <span className="cd-dock-shipment">{dock.currentShipmentLabel}</span>
                        )}
                        {!dock.currentShipmentId && (
                          <span className="cd-dock-empty">No active shipment</span>
                        )}
                      </div>
                      <div className="cd-dock-slot-footer">
                        <span className="cd-dock-metric">Throughput: {dock.throughputToday}/day</span>
                        <span className="cd-dock-metric">Avg: {dock.avgProcessingTime}m</span>
                      </div>
                      {dock.status === "occupied" && (
                        <div className="cd-dock-occupancy-bar">
                          <div className="cd-dock-occupancy-fill" style={{
                            width: `${(dock.occupancyMinutes / dock.maxCapacityMin) * 100}%`,
                            backgroundColor: dock.occupancyMinutes > 90 ? "#ef4444" : dock.occupancyMinutes > 60 ? "#f59e0b" : "#10b981",
                          }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gate Summary KPIs */}
            <div className="cd-dock-kpi-row">
              <KpiCard title="Total Docks" value={String(DATA.docks.length)}
                subtitle={`${DATA.docks.filter(d => d.status === "available").length} available`}
                icon={<LayoutGrid className="h-5 w-5" />} colorClass="cd-kpi--blue" />
              <KpiCard title="Occupied" value={String(DATA.docks.filter(d => d.status === "occupied").length)}
                subtitle={`${DATA.docks.filter(d => d.status === "reserved").length} reserved`}
                icon={<Package className="h-5 w-5" />} colorClass="cd-kpi--amber" />
              <KpiCard title="Gate Utilization" value={`${+(DATA.gates.reduce((a, g) => a + g.utilizationToday, 0) / DATA.gates.length).toFixed(0)}%`}
                subtitle="Average across all gates"
                icon={<Gauge className="h-5 w-5" />} trend="up" colorClass="cd-kpi--green" />
            </div>

            {/* Gate Table */}
            <Card className="cd-chart-card cd-chart-card--full">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Waypoints className="h-4 w-4 mr-2" />
                  Gate Registry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cd-gate-table-wrap">
                  <table className="cd-table">
                    <thead>
                      <tr>
                        <th>Gate</th>
                        <th>Type</th>
                        <th>Warehouse</th>
                        <th>Status</th>
                        <th>Current Shipment</th>
                        <th>Last Used</th>
                        <th>Avg Turnaround</th>
                        <th>Utilization</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DATA.gates.map(g => (
                        <tr key={g.id} className="cd-table-row">
                          <td className="cd-cell-mono">{g.gateNumber}</td>
                          <td>{g.gateType.replace("_", " ").toUpperCase()}</td>
                          <td>{g.warehouse.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, "")}</td>
                          <td>
                            <Badge variant={
                              g.status === "available" ? "success"
                              : g.status === "occupied" ? "default"
                              : g.status === "reserved" ? "warning" : "destructive"
                            }>
                              {GATE_STATUS_LABELS[g.status]}
                            </Badge>
                          </td>
                          <td>{g.currentShipment || "—"}</td>
                          <td>{formatTime(g.lastUsed)}</td>
                          <td>{g.avgTurnaround}m</td>
                          <td>
                            <div className="cd-util-cell">
                              <div className="cd-util-bar">
                                <div className="cd-util-bar-fill" style={{
                                  width: `${g.utilizationToday}%`,
                                  backgroundColor: g.utilizationToday >= 80 ? "#ef4444" : g.utilizationToday >= 60 ? "#f59e0b" : "#10b981",
                                }} />
                              </div>
                              <span className="cd-util-label">{g.utilizationToday}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* Tab 3: Flow Analytics                                            */}
        {/* --------------------------------------------------------------- */}
        {activeTab === 3 && (
          <div className="cd-analytics-layout">
            {/* Hourly Flow */}
            <Card className="cd-chart-card cd-chart-card--full">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Activity className="h-4 w-4 mr-2" />
                  24-Hour Flow Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={DATA.hourlyFlow}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="inbound" stackId="flow" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Inbound" />
                    <Area type="monotone" dataKey="outbound" stackId="flow" stroke="#f97316" fill="#f97316" fillOpacity={0.6} name="Outbound" />
                    <Area type="monotone" dataKey="crossDock" stackId="flow" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Cross-Dock" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly OTP & Dwell Trend */}
            <Card className="cd-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  OTP & Avg Dwell Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={DATA.monthlyThroughput}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} unit="m" />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line yAxisId="left" type="monotone" dataKey="otpRate" stroke="#10b981" strokeWidth={2.5} name="OTP %" dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="avgDwell" stroke="#f97316" strokeWidth={2.5} name="Avg Dwell (min)" dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost per Unit Trend */}
            <Card className="cd-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Cost per Unit Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={DATA.monthlyThroughput}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="costPerUnit" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Cost/Unit (INR)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Dock Throughput Comparison */}
            <Card className="cd-chart-card cd-chart-card--wide">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dock Throughput Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dockUtilData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="dock" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="utilization" fill="#6366f1" name="Throughput (shipments)" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="avgTime" stroke="#ef4444" name="Avg Time (min)" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Warehouse Performance Radar */}
            <Card className="cd-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Network className="h-4 w-4 mr-2" />
                  Warehouse Cross-Dock Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={warehouseThroughput.map(w => ({
                    warehouse: w.warehouse,
                    inbound: w.inbound * 5,
                    outbound: w.outbound * 5,
                    total: w.total * 3,
                    speed: Math.max(0, 100 - w.avgDwell),
                  }))}>
                    <PolarGrid className="opacity-30" />
                    <PolarAngleAxis dataKey="warehouse" tick={{ fontSize: 9 }} />
                    <PolarRadiusAxis tick={{ fontSize: 9 }} />
                    <Radar name="Inbound" dataKey="inbound" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    <Radar name="Outbound" dataKey="outbound" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
                    <Radar name="Speed" dataKey="speed" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Consolidation Performance */}
            <Card className="cd-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Layers className="h-4 w-4 mr-2" />
                  Consolidation Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={DATA.consolidationDist}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Bar dataKey="count" name="Shipments" radius={[4, 4, 0, 0]}>
                      {DATA.consolidationDist.map((_, i) => (
                        <Cell key={i} fill={["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"][i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Pie */}
            <Card className="cd-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Overall Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={statusDist} dataKey="count" nameKey="status"
                      cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false} fontSize={10}>
                      {statusDist.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* Tab 4: Performance Scorecard                                     */}
        {/* --------------------------------------------------------------- */}
        {activeTab === 4 && (
          <div className="cd-scorecard-layout">
            {/* Performance Rings */}
            <Card className="cd-scorecard-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Target className="h-4 w-4 mr-2" />
                  Cross-Dock Performance Rings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cd-rings-grid">
                  <div className="cd-ring-item">
                    <SvgRing value={otpRate} label="OTP" />
                    <span className="cd-ring-name">On-Time Performance</span>
                  </div>
                  <div className="cd-ring-item">
                    <SvgRing value={avgScanRate} label="Scan" />
                    <span className="cd-ring-name">Scan Accuracy</span>
                  </div>
                  <div className="cd-ring-item">
                    <SvgRing value={100 - (delayedCount / totalShipments) * 100} label="No Delay" />
                    <span className="cd-ring-name">Non-Delay Rate</span>
                  </div>
                  <div className="cd-ring-item">
                    <SvgRing value={Math.min(100, (1 - avgDwell / 120) * 100)} label="Dwell" />
                    <span className="cd-ring-name">Dwell Efficiency</span>
                  </div>
                  <div className="cd-ring-item">
                    <SvgRing value={+(DATA.gates.reduce((a, g) => a + g.utilizationToday, 0) / DATA.gates.length).toFixed(0)} label="Util" />
                    <span className="cd-ring-name">Gate Utilization</span>
                  </div>
                  <div className="cd-ring-item">
                    <SvgRing value={100 - (DATA.shipments.filter(s => s.damageFlag).length / totalShipments) * 100} label="Quality" />
                    <span className="cd-ring-name">Damage-Free Rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SLA Compliance Progress Bars */}
            <Card className="cd-scorecard-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  SLA Compliance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cd-progress-list">
                  {WAREHOUSES.map(wh => {
                    const whShipments = DATA.shipments.filter(s => s.source === wh || s.destination === wh);
                    const withinSla = whShipments.filter(s => s.dwellTimeMin <= s.slaMinutes).length;
                    const pct = whShipments.length ? (withinSla / whShipments.length) * 100 : 0;
                    return (
                      <div key={wh} className="cd-progress-item">
                        <div className="cd-progress-header">
                          <span className="cd-progress-label">{wh.replace(/ (Hub|Facility|Gateway|Distribution|Depot)$/, "")}</span>
                          <span className="cd-progress-value">{Math.round(pct)}% ({withinSla}/{whShipments.length})</span>
                        </div>
                        <div className="cd-progress-bar">
                          <div className="cd-progress-bar-fill" style={{
                            width: `${pct}%`,
                            backgroundColor: pct >= 90 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444",
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="cd-scorecard-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Key Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cd-metrics-grid">
                  {[
                    { label: "Total Transfers Today", value: String(totalShipments), icon: <Shuffle className="h-4 w-4" /> },
                    { label: "Active Cross-Dock Ops", value: String(activeCount), icon: <Activity className="h-4 w-4" /> },
                    { label: "Avg Dwell Time", value: `${avgDwell} min`, icon: <Timer className="h-4 w-4" /> },
                    { label: "Total Pallets Moved", value: totalPallets.toLocaleString(), icon: <Boxes className="h-4 w-4" /> },
                    { label: "Total Shipment Value", value: formatCurrency(totalValue), icon: <IndianRupee className="h-4 w-4" /> },
                    { label: "On-Time Rate", value: `${otpRate}%`, icon: <Target className="h-4 w-4" /> },
                    { label: "Damage Rate", value: `${((DATA.shipments.filter(s => s.damageFlag).length / totalShipments) * 100).toFixed(1)}%`, icon: <AlertTriangle className="h-4 w-4" /> },
                    { label: "Quality Hold Rate", value: `${((DATA.shipments.filter(s => s.qualityHold).length / totalShipments) * 100).toFixed(1)}%`, icon: <ShieldCheck className="h-4 w-4" /> },
                    { label: "Avg Pallets/Transfer", value: `${(totalPallets / totalShipments).toFixed(1)}`, icon: <Layers className="h-4 w-4" /> },
                    { label: "Avg Weight/Transfer", value: formatWeight(Math.round(DATA.shipments.reduce((a, s) => a + s.totalWeight, 0) / totalShipments)), icon: <Package className="h-4 w-4" /> },
                    { label: "Total Line Items", value: DATA.shipments.reduce((a, s) => a + s.lineItems, 0).toLocaleString(), icon: <FileText className="h-4 w-4" /> },
                    { label: "Total Carriers Active", value: String(new Set(DATA.shipments.map(s => s.carrier)).size), icon: <Truck className="h-4 w-4" /> },
                  ].map((m, i) => (
                    <div key={i} className="cd-metric-item">
                      <div className="cd-metric-icon">{m.icon}</div>
                      <span className="cd-metric-label">{m.label}</span>
                      <span className="cd-metric-value">{m.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Carrier Performance */}
            <Card className="cd-scorecard-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Truck className="h-4 w-4 mr-2" />
                  Carrier Performance Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cd-carrier-ranking">
                  {DATA.carriers.map(carrier => {
                    const cShipments = DATA.shipments.filter(s => s.carrier === carrier);
                    const cOtp = cShipments.length ? (cShipments.filter(s => s.isOtp).length / cShipments.length) * 100 : 0;
                    const cAvgDwell = cShipments.length ? cShipments.reduce((a, s) => a + s.dwellTimeMin, 0) / cShipments.length : 0;
                    return (
                      <div key={carrier} className="cd-carrier-item">
                        <div className="cd-carrier-header">
                          <span className="cd-carrier-name">{carrier}</span>
                          <span className="cd-carrier-count">{cShipments.length} shipments</span>
                        </div>
                        <div className="cd-carrier-metrics">
                          <div className="cd-carrier-metric">
                            <span className="cd-carrier-metric-label">OTP</span>
                            <span className={cOtp >= 80 ? "cd-carrier-metric-value cd-metric-good" : "cd-carrier-metric-value cd-metric-bad"}>
                              {cOtp.toFixed(1)}%
                            </span>
                          </div>
                          <div className="cd-carrier-metric">
                            <span className="cd-carrier-metric-label">Avg Dwell</span>
                            <span className={cAvgDwell <= 90 ? "cd-carrier-metric-value cd-metric-good" : "cd-carrier-metric-value cd-metric-bad"}>
                              {cAvgDwell.toFixed(0)}m
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Consolidation Type Success Rates */}
            <Card className="cd-scorecard-card">
              <CardHeader className="pb-2">
                <CardTitle className="cd-chart-title">
                  <Forklift className="h-4 w-4 mr-2" />
                  Consolidation Type Success Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cd-progress-list">
                  {(Object.entries(CONSOLIDATION_LABELS) as [ConsolidationType, string][]).map(([ct, label]) => {
                    const ctShipments = DATA.shipments.filter(s => s.consolidationType === ct);
                    const ctOtp = ctShipments.length ? (ctShipments.filter(s => s.isOtp).length / ctShipments.length) * 100 : 0;
                    return (
                      <div key={ct} className="cd-progress-item">
                        <div className="cd-progress-header">
                          <span className="cd-progress-label">{label}</span>
                          <span className="cd-progress-value">{ctOtp.toFixed(0)}% OTP ({ctShipments.length} ops)</span>
                        </div>
                        <div className="cd-progress-bar">
                          <div className="cd-progress-bar-fill" style={{
                            width: `${ctOtp}%`,
                            backgroundColor: ctOtp >= 80 ? "#10b981" : ctOtp >= 60 ? "#f59e0b" : "#ef4444",
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
