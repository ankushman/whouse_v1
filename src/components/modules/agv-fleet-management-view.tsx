"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { useToast } from "@/hooks/use-toast-helper";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Bot, Battery, Zap, Gauge, Activity, AlertTriangle,
  Clock, Wrench, Play, Pause, Square, RefreshCw, Filter,
  MapPin, Package, ChevronRight, TrendingUp, BarChart3,
  CheckCircle2, XCircle, ArrowUpDown, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  seededRandom + formatINR                                           */
/* ------------------------------------------------------------------ */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const AGV_MODELS = [
  "KUKA KR4", "MiR500", "OTTO 100", "Lattice Robot", "Fetch Freight 500",
  "Geek+ Pulse", "Vecna Pallet Truck", "HAI Robotics", "Quicktron M100C",
] as const;

const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F"] as const;

const AGV_STATUSES = ["Active", "Charging", "Idle", "Maintenance", "Offline", "Error", "Returning"] as const;

const MISSION_TYPES = ["Pickup", "Transport", "Putaway", "Palletizing", "Charging", "Return"] as const;

const MISSION_STATUSES = ["Pending", "In Progress", "Completed", "Failed", "Cancelled", "Paused"] as const;

const PRIORITY_LEVELS = ["Emergency", "High", "Medium", "Low", "Scheduled"] as const;

const MAINT_TYPES = ["Preventive", "Corrective", "Emergency", "Software Update", "Calibration"] as const;

const MAINT_STATUSES = ["Scheduled", "In Progress", "Completed", "Overdue"] as const;

const CHARGING_STATIONS = ["Station A", "Station B", "Station C", "Station D", "Station E", "Station F"] as const;

const PIE_COLORS = ["#059669", "#d97706", "#475569", "#7c3aed", "#e11d48"];
const CHART_COLORS = ["#7c3aed", "#0891b2", "#d97706", "#059669", "#e11d48", "#475569"];

/* ------------------------------------------------------------------ */
/*  Data generation                                                     */
/* ------------------------------------------------------------------ */
const rng = seededRandom(2073301);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const rInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

const agvs = Array.from({ length: 40 }, (_, i) => ({
  id: `AGV-${String(i + 1).padStart(3, "0")}`,
  model: pick(AGV_MODELS),
  zone: pick(ZONES),
  battery: rInt(3, 100),
  status: pick(AGV_STATUSES),
  speed: rInt(0, 150),
  tasks: rInt(10, 500),
  lastMission: pick(MISSION_TYPES),
  distanceToday: +(rng() * 25 + 0.5).toFixed(1),
}));

const missions = Array.from({ length: 55 }, (_, i) => ({
  id: `MSN-${String(i + 1).padStart(4, "0")}`,
  agvId: agvs[Math.floor(rng() * agvs.length)].id,
  type: pick(MISSION_TYPES),
  status: pick(MISSION_STATUSES),
  priority: pick(PRIORITY_LEVELS),
  progress: rInt(0, 100),
  stage: rInt(0, 4),
  createdAt: `${String(rInt(1, 12)).padStart(2, "0")}:${String(rInt(0, 59)).padStart(2, "0")}`,
  eta: `${String(rInt(12, 23)).padStart(2, "0")}:${String(rInt(0, 59)).padStart(2, "0")}`,
}));

const batteryRecords = agvs.map((a) => ({
  agvId: a.id,
  battery: a.battery,
  health: +(rng() * 40 + 60).toFixed(1),
  cycles: rInt(100, 900),
  station: pick(CHARGING_STATIONS),
  charging: a.status === "Charging",
  nextCharge: `+${rInt(10, 120)}min`,
}));

const maintRecords = Array.from({ length: 30 }, (_, i) => ({
  id: `MNT-${String(i + 1).padStart(4, "0")}`,
  agvId: agvs[Math.floor(rng() * agvs.length)].id,
  type: pick(MAINT_TYPES),
  status: pick(MAINT_STATUSES),
  cost: rInt(500, 50000),
  nextService: rInt(-5, 30),
  description: ["Wheel alignment", "Sensor calibration", "Battery check", "Motor servicing", "Software patch"][rInt(0, 4)],
}));

const hourlyThroughput = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  pickup: rInt(5, 40),
  transport: rInt(10, 55),
  drop: rInt(3, 30),
}));

const chargingSchedule = Array.from({ length: 12 }, (_, i) => ({
  id: `CHG-${String(i + 1).padStart(3, "0")}`,
  agvId: agvs[Math.floor(rng() * agvs.length)].id,
  station: pick(CHARGING_STATIONS),
  timeSlot: `${String(rInt(1, 12)).padStart(2, "0")}:00 – ${String(rInt(13, 23)).padStart(2, "0")}:00`,
  duration: `${rInt(30, 120)} min`,
}));

const weeklyTasks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
  day: d, completed: rInt(80, 200), failed: rInt(2, 20),
}));

/* ------------------------------------------------------------------ */
/*  Visual Components                                                   */
/* ------------------------------------------------------------------ */

// 1. AGVStatusBadge
function AGVStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Charging: "bg-amber-100 text-amber-700 border-amber-300",
    Idle: "bg-slate-100 text-slate-600 border-slate-300",
    Maintenance: "bg-violet-100 text-violet-700 border-violet-300",
    Offline: "bg-rose-100 text-rose-600 border-rose-300",
    Error: "bg-red-100 text-red-700 border-red-300",
    Returning: "bg-cyan-100 text-cyan-700 border-cyan-300",
  };
  const icons: Record<string, string> = {
    Active: "🟢", Charging: "⚡", Idle: "⏸️", Maintenance: "🔧",
    Offline: "🔴", Error: "❗", Returning: "🔄",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", map[status] ?? "bg-gray-100 text-gray-600")}>
      {icons[status] ?? "⬤"} {status}
    </span>
  );
}

// 2. BatteryIndicator
function BatteryIndicator({ battery, charging }: { battery: number; charging?: boolean }) {
  const color = battery > 60 ? "#059669" : battery > 30 ? "#d97706" : "#e11d48";
  return (
    <div className="agv-battery flex items-center gap-2">
      <div className="h-4 w-20 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full transition-all" style={{ width: `${battery}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{battery}%</span>
      {charging && <Zap className="h-3 w-3 text-amber-500 animate-pulse" />}
    </div>
  );
}

// 3. SpeedIndicator
function SpeedIndicator({ speed }: { speed: number }) {
  const color = speed > 80 ? "#0891b2" : speed > 20 ? "#d97706" : "#475569";
  return (
    <div className="agv-speed flex items-center gap-1.5">
      <Gauge className="h-3.5 w-3.5" style={{ color }} />
      <span className="text-xs font-mono font-semibold" style={{ color }}>{speed} m/min</span>
    </div>
  );
}

// 4. AGVModelBadge
function AGVModelBadge({ model }: { model: string }) {
  const colors: Record<string, string> = {
    "KUKA KR4": "bg-violet-100 text-violet-700",
    MiR500: "bg-cyan-100 text-cyan-700",
    "OTTO 100": "bg-amber-100 text-amber-700",
    "Lattice Robot": "bg-emerald-100 text-emerald-700",
    "Fetch Freight 500": "bg-rose-100 text-rose-700",
    "Geek+ Pulse": "bg-indigo-100 text-indigo-700",
    "Vecna Pallet Truck": "bg-orange-100 text-orange-700",
    "HAI Robotics": "bg-teal-100 text-teal-700",
    "Quicktron M100C": "bg-fuchsia-100 text-fuchsia-700",
  };
  return <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold", colors[model] ?? "bg-slate-100 text-slate-600")}>{model}</span>;
}

// 5. ZoneBadge
function ZoneBadge({ zone }: { zone: string }) {
  const colors: Record<string, string> = {
    "Zone A": "bg-violet-500", "Zone B": "bg-cyan-500", "Zone C": "bg-amber-500",
    "Zone D": "bg-emerald-500", "Zone E": "bg-rose-500", "Zone F": "bg-slate-500",
  };
  return (
    <span className="agv-zone inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: colors[zone] ?? "#475569" }}>
      <MapPin className="h-2.5 w-2.5" />{zone}
    </span>
  );
}

// 6. MissionTimeline
function MissionTimeline({ stage }: { stage: number }) {
  const labels = ["Assigned", "Dispatched", "In Progress", "Completed", "Confirmed"];
  return (
    <div className="agv-timeline flex items-center gap-0.5">
      {labels.map((l, i) => (
        <React.Fragment key={l}>
          <div className="flex flex-col items-center gap-0.5">
            <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold", i <= stage ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-300 text-slate-400")}>{i + 1}</div>
            <span className="text-[9px] text-slate-500 max-w-[48px] text-center leading-tight">{l}</span>
          </div>
          {i < 4 && <div className={cn("h-0.5 w-6 flex-shrink-0", i < stage ? "bg-violet-500" : "bg-slate-200")} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// 7. ProgressRing
function ProgressRing({ progress }: { progress: number }) {
  const r = 28, c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  const color = progress > 75 ? "#059669" : progress > 40 ? "#d97706" : "#e11d48";
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="agv-progress-ring -rotate-90">
      <circle cx="34" cy="34" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
      <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      <text x="34" y="38" textAnchor="middle" className="text-[11px] font-bold fill-slate-700" transform="rotate(90 34 34)">{progress}%</text>
    </svg>
  );
}

// 8. MissionTypeBadge
function MissionTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    Pickup: "bg-cyan-100 text-cyan-700", Transport: "bg-violet-100 text-violet-700",
    Putaway: "bg-amber-100 text-amber-700", Palletizing: "bg-emerald-100 text-emerald-700",
    Charging: "bg-rose-100 text-rose-700", Return: "bg-slate-100 text-slate-600",
  };
  const icons: Record<string, React.ReactNode> = {
    Pickup: <Package className="h-3 w-3" />, Transport: <ChevronRight className="h-3 w-3" />,
    Putaway: <MapPin className="h-3 w-3" />, Palletizing: <Activity className="h-3 w-3" />,
    Charging: <Zap className="h-3 w-3" />, Return: <RotateCcw className="h-3 w-3" />,
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", map[type] ?? "bg-gray-100 text-gray-600")}>{icons[type]} {type}</span>;
}

// 9. PriorityBadge
function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    Emergency: "bg-red-100 text-red-700 border-red-300",
    High: "bg-rose-100 text-rose-700 border-rose-300",
    Medium: "bg-amber-100 text-amber-700 border-amber-300",
    Low: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Scheduled: "bg-slate-100 text-slate-600 border-slate-300",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold", map[priority] ?? "bg-gray-100", priority === "Emergency" && "animate-pulse")}>{priority}</span>;
}

// 10. MaintenanceTypeBadge
function MaintenanceTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    Preventive: "bg-emerald-100 text-emerald-700", Corrective: "bg-amber-100 text-amber-700",
    Emergency: "bg-red-100 text-red-700", "Software Update": "bg-violet-100 text-violet-700",
    Calibration: "bg-cyan-100 text-cyan-700",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", map[type] ?? "bg-gray-100 text-gray-600")}>{type}</span>;
}

// 11. MaintenanceStatusBadge
function MaintenanceStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Scheduled: "bg-blue-100 text-blue-700", "In Progress": "bg-amber-100 text-amber-700",
    Completed: "bg-emerald-100 text-emerald-700", Overdue: "bg-red-100 text-red-700",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold", map[status] ?? "bg-gray-100 text-gray-600")}>{status}</span>;
}

// 12. NextServiceDateIndicator
function NextServiceDateIndicator({ days }: { days: number }) {
  if (days < 0) return <span className="text-xs font-bold text-red-600">Overdue by {Math.abs(days)}d</span>;
  if (days <= 3) return <span className="text-xs font-bold text-amber-600">{days}d left</span>;
  if (days <= 10) return <span className="text-xs font-medium text-cyan-600">{days}d left</span>;
  return <span className="text-xs font-medium text-emerald-600">{days}d left</span>;
}

// 13. PartsCostTile
function PartsCostTile({ cost }: { cost: number }) {
  return (
    <div className="agv-cost-tile rounded-lg border border-amber-200 bg-amber-50 p-2 text-center">
      <p className="text-[10px] text-amber-600 font-medium">Est. Cost</p>
      <p className="text-sm font-bold text-amber-800">{formatINR(cost)}</p>
    </div>
  );
}

// 14. ChargeCycleGauge
function ChargeCycleGauge({ cycles, max = 1000 }: { cycles: number; max?: number }) {
  const pct = Math.min(cycles / max, 1);
  const r = 50, cx = 60, cy = 55;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const angle = startAngle + pct * (endAngle - startAngle);
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const largeArc = pct > 0.5 ? 1 : 0;
  const color = pct > 0.8 ? "#e11d48" : pct > 0.5 ? "#d97706" : "#059669";
  return (
    <svg width="120" height="70" viewBox="0 0 120 70" className="agv-cycle-gauge">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
      <text x={cx} y={cy - 8} textAnchor="middle" className="text-lg font-bold fill-slate-700">{cycles}</text>
      <text x={cx} y={cy + 6} textAnchor="middle" className="text-[9px] fill-slate-400">/ {max} cycles</text>
    </svg>
  );
}

// 15. AGVCard
function AGVCard({ agv, onClick }: { agv: typeof agvs[0]; onClick: () => void }) {
  return (
    <div onClick={onClick} className="agv-card cursor-pointer rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-slate-800">{agv.id}</span>
        <AGVStatusBadge status={agv.status} />
      </div>
      <AGVModelBadge model={agv.model} />
      <div className="mt-2">
        <BatteryIndicator battery={agv.battery} charging={agv.status === "Charging"} />
      </div>
      <div className="mt-1">
        <SpeedIndicator speed={agv.speed} />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
        <span>Tasks: {agv.tasks}</span><span>{agv.zone}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sort helper                                                        */
/* ------------------------------------------------------------------ */
function sortData(data: any[], key: string, dir: "asc" | "desc"): any[] {
  return [...data].sort((a, b) => {
    const va = a[key], vb = b[key];
    if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va;
    return dir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function AGVFleetManagementView() {
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<Record<string, unknown> | null>(null);
  const [drawerTab, setDrawerTab] = useState<"agv" | "mission" | "maint">("agv");

  // Tab 1 state
  const [agvSearch, setAgvSearch] = useState("");
  const [agvStatusFilter, setAgvStatusFilter] = useState("all");
  const [agvZoneFilter, setAgvZoneFilter] = useState("all");
  const [agvSortKey, setAgvSortKey] = useState("id");
  const [agvSortDir, setAgvSortDir] = useState<"asc" | "desc">("asc");

  // Tab 1 view toggle
  const [agvView, setAgvView] = useState<"card" | "table">("card");

  // Tab 2 state
  const [missionSearch, setMissionSearch] = useState("");
  const [missionStatusFilter, setMissionStatusFilter] = useState("all");
  const [missionTypeFilter, setMissionTypeFilter] = useState("all");

  // Tab 4 state
  const [maintSearch, setMaintSearch] = useState("");
  const [maintStatusFilter, setMaintStatusFilter] = useState("all");
  const [maintTypeFilter, setMaintTypeFilter] = useState("all");

  const openDrawer = useCallback((record: Record<string, unknown>, tab: "agv" | "mission" | "maint") => {
    setDrawerRecord(record);
    setDrawerTab(tab);
    setDrawerOpen(true);
  }, []);

  // Tab 1 filtered/sorted
  const filteredAgvs = useMemo(() => {
    let d = agvs.filter((a) => {
      if (agvSearch && !a.id.toLowerCase().includes(agvSearch.toLowerCase()) && !a.model.toLowerCase().includes(agvSearch.toLowerCase())) return false;
      if (agvStatusFilter !== "all" && a.status !== agvStatusFilter) return false;
      if (agvZoneFilter !== "all" && a.zone !== agvZoneFilter) return false;
      return true;
    });
    return sortData(d as any[], agvSortKey, agvSortDir);
  }, [agvSearch, agvStatusFilter, agvZoneFilter, agvSortKey, agvSortDir]);

  // Tab 2 filtered
  const filteredMissions = useMemo(() => {
    return missions.filter((m) => {
      if (missionSearch && !m.id.toLowerCase().includes(missionSearch.toLowerCase()) && !m.agvId.toLowerCase().includes(missionSearch.toLowerCase())) return false;
      if (missionStatusFilter !== "all" && m.status !== missionStatusFilter) return false;
      if (missionTypeFilter !== "all" && m.type !== missionTypeFilter) return false;
      return true;
    });
  }, [missionSearch, missionStatusFilter, missionTypeFilter]);

  // Tab 4 filtered
  const filteredMaint = useMemo(() => {
    return maintRecords.filter((m) => {
      if (maintSearch && !m.id.toLowerCase().includes(maintSearch.toLowerCase()) && !m.agvId.toLowerCase().includes(maintSearch.toLowerCase())) return false;
      if (maintStatusFilter !== "all" && m.status !== maintStatusFilter) return false;
      if (maintTypeFilter !== "all" && m.type !== maintTypeFilter) return false;
      return true;
    });
  }, [maintSearch, maintStatusFilter, maintTypeFilter]);

  // Maintenance KPIs
  const maintScheduled = maintRecords.filter((m) => m.status === "Scheduled").length;
  const maintInProgress = maintRecords.filter((m) => m.status === "In Progress").length;
  const maintOverdue = maintRecords.filter((m) => m.status === "Overdue").length;
  const maintTotalCost = maintRecords.reduce((s, m) => s + m.cost, 0);

  // Battery KPIs
  const chargingCount = batteryRecords.filter((b) => b.charging).length;
  const avgHealth = +(batteryRecords.reduce((s, b) => s + b.health, 0) / batteryRecords.length).toFixed(1);
  const lowBattery = batteryRecords.filter((b) => b.battery <= 20).length;
  const criticalBattery = batteryRecords.filter((b) => b.battery <= 10).length;

  // Dashboard KPIs
  const activeMissions = missions.filter((m) => m.status === "In Progress").length;
  const avgBattery = Math.round(agvs.reduce((s, a) => s + a.battery, 0) / agvs.length);
  const tasksToday = agvs.reduce((s, a) => s + a.tasks, 0);
  const fleetUtil = Math.round((agvs.filter((a) => a.status === "Active").length / agvs.length) * 100);
  const alertsActive = agvs.filter((a) => a.status === "Error" || a.status === "Offline").length;
  const distToday = +agvs.reduce((s, a) => s + a.distanceToday, 0).toFixed(1);
  const avgSpeed = Math.round(agvs.reduce((s, a) => s + a.speed, 0) / agvs.length);

  // Fleet status pie data
  const fleetPie = useMemo(() => {
    const counts: Record<string, number> = { Active: 0, Charging: 0, Idle: 0, Maintenance: 0, Offline: 0 };
    agvs.forEach((a) => {
      if (counts[a.status] !== undefined) counts[a.status]++;
      else counts["Offline"]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // Battery distribution
  const batteryDist = useMemo(() => {
    const ranges = [
      { range: ">80%", count: 0 }, { range: "60-80%", count: 0 }, { range: "40-60%", count: 0 },
      { range: "20-40%", count: 0 }, { range: "10-20%", count: 0 }, { range: "<10%", count: 0 },
    ];
    agvs.forEach((a) => {
      if (a.battery > 80) ranges[0].count++;
      else if (a.battery > 60) ranges[1].count++;
      else if (a.battery > 40) ranges[2].count++;
      else if (a.battery > 20) ranges[3].count++;
      else if (a.battery > 10) ranges[4].count++;
      else ranges[5].count++;
    });
    return ranges;
  }, []);

  // Zone utilization
  const zoneUtil = useMemo(() => ZONES.map((z) => ({
    zone: z, tasks: rInt(50, 300), utilization: rInt(40, 95),
  })), []);

  // Model performance
  const modelPerf = useMemo(() => AGV_MODELS.map((m) => ({
    model: m, avgSpeed: rInt(40, 120), reliability: rInt(85, 99),
  })), []);

  // Mission completion by type summary
  const missionTypeSummary = useMemo(() =>
    MISSION_TYPES.map((t) => ({
      type: t,
      total: missions.filter((m) => m.type === t).length,
      completed: missions.filter((m) => m.type === t && m.status === "Completed").length,
      failed: missions.filter((m) => m.type === t && m.status === "Failed").length,
    })), []);

  // Analytics KPIs
  const fleetUptime = 94.7;
  const avgTasksPerHr = 18.3;
  const batteryLifeHrs = 8.2;
  const distEfficiency = +(distToday / tasksToday * 100).toFixed(1);
  const maintCost = maintRecords.reduce((s, m) => s + m.cost, 0);
  const errorRate = 2.1;
  const throughput = 142;
  const roi = 287;

  return (
    <div className="agv-fleet-mgmt space-y-6">
      <PageHeader title="AGV Fleet Management" description="Warehouse robotics fleet monitoring, mission control & maintenance" />

      <Tabs defaultValue="0">
        <TabsList className="flex w-full overflow-x-auto">
          {["Fleet Dashboard", "AGV Inventory", "Mission Control", "Battery & Charging", "Maintenance", "Analytics"].map((t, i) => (
            <TabsTrigger key={t} value={String(i)} className="text-xs">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ===== TAB 0 – Fleet Dashboard ===== */}
        <TabsContent value="0" className="space-y-6 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total AGVs", value: agvs.length, icon: <Bot className="h-4 w-4 text-violet-500" /> },
              { label: "Active Missions", value: activeMissions, icon: <Activity className="h-4 w-4 text-cyan-500" /> },
              { label: "Avg Battery %", value: avgBattery, icon: <Battery className="h-4 w-4 text-emerald-500" /> },
              { label: "Tasks Today", value: tasksToday, icon: <Package className="h-4 w-4 text-amber-500" /> },
              { label: "Fleet Utilization %", value: fleetUtil, icon: <TrendingUp className="h-4 w-4 text-violet-500" /> },
              { label: "Alerts Active", value: alertsActive, icon: <AlertTriangle className="h-4 w-4 text-rose-500" /> },
              { label: "Distance Today (km)", value: distToday, icon: <MapPin className="h-4 w-4 text-cyan-500" /> },
              { label: "Avg Speed (m/min)", value: avgSpeed, icon: <Gauge className="h-4 w-4 text-amber-500" /> },
            ].map((k) => (
              <Card key={k.label}>
                <CardContent className="glass-subtle p-3 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-50 p-2">{k.icon}</div>
                  <div><p className="text-[10px] text-slate-500">{k.label}</p><p className="text-lg font-bold text-slate-800">{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Fleet Status Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart><Pie data={fleetPie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {fleetPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie><Tooltip /><Legend /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Hourly Throughput</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={hourlyThroughput}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip /><Legend />
                    <Area type="monotone" dataKey="pickup" stackId="a" fill="#7c3aed" stroke="#7c3aed" />
                    <Area type="monotone" dataKey="transport" stackId="a" fill="#0891b2" stroke="#0891b2" />
                    <Area type="monotone" dataKey="drop" stackId="a" fill="#059669" stroke="#059669" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Battery Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={batteryDist}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                  <Tooltip /><Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {batteryDist.map((_, i) => <Cell key={i} fill={i < 2 ? "#059669" : i < 4 ? "#d97706" : "#e11d48"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 1 – AGV Inventory ===== */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /><Input placeholder="Search AGVs..." value={agvSearch} onChange={(e) => setAgvSearch(e.target.value)} className="pl-8 h-9 text-sm" /></div>
            <Select value={agvStatusFilter} onValueChange={setAgvStatusFilter}><SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{AGV_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select value={agvZoneFilter} onValueChange={setAgvZoneFilter}><SelectTrigger className="w-[130px] h-9 text-sm"><SelectValue placeholder="Zone" /></SelectTrigger><SelectContent>{ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent></Select>
            <Button variant="outline" size="sm" onClick={() => { setAgvSortDir(agvSortDir === "asc" ? "desc" : "asc"); }}><ArrowUpDown className="btn-outline-animate h-3.5 w-3.5 mr-1" />{agvSortDir === "asc" ? "ASC" : "DESC"}</Button>
            <Button variant="outline" size="sm" onClick={() => setAgvView(agvView === "card" ? "table" : "card")}>{agvView === "card" ? "Table" : "Cards"}</Button>
          </div>
          {agvView === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredAgvs.map((a) => <AGVCard key={a.id} agv={a} onClick={() => openDrawer(a as unknown as Record<string, unknown>, "agv")} />)}
            </div>
          ) : (
            <Card>
              <CardContent className="glass-subtle p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
                      {[["id","AGV ID"],["model","Model"],["zone","Zone"],["battery","Battery"],["status","Status"],["speed","Speed"],["tasks","Tasks"],["lastMission","Last Mission"]].map(([k, l]) => (
                        <th key={String(k)} className="cursor-pointer px-3 py-2 select-none hover:bg-slate-100" onClick={() => { if (agvSortKey === k) setAgvSortDir(agvSortDir === "asc" ? "desc" : "asc"); else { setAgvSortKey(String(k)); setAgvSortDir("asc"); } }}>{l} {agvSortKey === k && <ArrowUpDown className="inline h-3 w-3 ml-0.5" />}</th>
                      ))}
                    </tr></thead>
                    <tbody>{filteredAgvs.map((a) => (
                      <tr key={a.id} className="border-b last:border-0 hover:bg-slate-50 cursor-pointer" onClick={() => openDrawer(a as unknown as Record<string, unknown>, "agv")}>
                        <td className="px-3 py-2 font-medium">{a.id}</td>
                        <td className="px-3 py-2"><AGVModelBadge model={a.model} /></td>
                        <td className="px-3 py-2"><ZoneBadge zone={a.zone} /></td>
                        <td className="px-3 py-2"><BatteryIndicator battery={a.battery} charging={a.status === "Charging"} /></td>
                        <td className="px-3 py-2"><AGVStatusBadge status={a.status} /></td>
                        <td className="px-3 py-2"><SpeedIndicator speed={a.speed} /></td>
                        <td className="px-3 py-2 font-mono text-xs">{a.tasks}</td>
                        <td className="px-3 py-2"><MissionTypeBadge type={a.lastMission} /></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== TAB 2 – Mission Control ===== */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /><Input placeholder="Search missions..." value={missionSearch} onChange={(e) => setMissionSearch(e.target.value)} className="pl-8 h-9 text-sm" /></div>
            <Select value={missionStatusFilter} onValueChange={setMissionStatusFilter}><SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{MISSION_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select value={missionTypeFilter} onValueChange={setMissionTypeFilter}><SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent>{MISSION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-2">
            {filteredMissions.map((m) => (
              <div key={m.id} onClick={() => openDrawer(m as unknown as Record<string, unknown>, "mission")} className="agv-mission-row flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                <ProgressRing progress={m.progress} />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap"><span className="text-sm font-bold text-slate-800">{m.id}</span><MissionTypeBadge type={m.type} /><PriorityBadge priority={m.priority} /></div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500"><span>🤖 {m.agvId}</span><span>🕐 {m.createdAt}</span><span> ETA {m.eta}</span></div>
                  <MissionTimeline stage={m.stage} />
                </div>
                <AGVStatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ===== TAB 3 – Battery & Charging ===== */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Charging Now", value: chargingCount, color: "text-amber-600" },
              { label: "Avg Health", value: `${avgHealth}%`, color: "text-emerald-600" },
              { label: "Low Battery (<20%)", value: lowBattery, color: "text-amber-600" },
              { label: "Critical (<10%)", value: criticalBattery, color: "text-red-600" },
            ].map((k) => (
              <Card key={k.label}><CardContent className="glass-subtle p-3"><p className="text-[10px] text-slate-500">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></CardContent></Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Battery Health by AGV</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={batteryRecords.slice(0, 20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="agvId" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 10 }} domain={[50, 100]} />
                    <Tooltip /><Bar dataKey="health" radius={[4, 4, 0, 0]}>
                      {batteryRecords.slice(0, 20).map((b, i) => <Cell key={i} fill={b.health > 80 ? "#059669" : b.health > 60 ? "#d97706" : "#e11d48"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Charge Cycle Gauges (Top 6)</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {batteryRecords.slice(0, 6).map((b) => (
                    <div key={b.agvId} className="flex flex-col items-center rounded-lg border border-slate-100 p-2">
                      <ChargeCycleGauge cycles={b.cycles} />
                      <span className="mt-1 text-xs font-semibold text-slate-600">{b.agvId}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Charging Schedule</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-xs text-slate-500">
                    <th className="pb-2 pr-4">AGV</th><th className="pb-2 pr-4">Station</th><th className="pb-2 pr-4">Time Slot</th><th className="pb-2">Duration</th>
                  </tr></thead>
                  <tbody>
                    {chargingSchedule.map((c) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50 cursor-pointer" onClick={() => openDrawer(c as unknown as Record<string, unknown>, "agv")}>
                        <td className="py-2 pr-4 font-medium">{c.agvId}</td>
                        <td className="py-2 pr-4"><ZoneBadge zone={c.station.replace("Station", "Zone")} /></td>
                        <td className="py-2 pr-4 text-xs text-slate-600">{c.timeSlot}</td>
                        <td className="py-2 text-xs text-slate-600">{c.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 4 – Maintenance ===== */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Scheduled", value: maintScheduled, color: "text-blue-600" },
              { label: "In Progress", value: maintInProgress, color: "text-amber-600" },
              { label: "Overdue", value: maintOverdue, color: "text-red-600" },
              { label: "Total Cost", value: formatINR(maintTotalCost), color: "text-rose-600" },
            ].map((k) => (
              <Card key={k.label}><CardContent className="glass-subtle p-3"><p className="text-[10px] text-slate-500">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></CardContent></Card>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /><Input placeholder="Search maintenance..." value={maintSearch} onChange={(e) => setMaintSearch(e.target.value)} className="pl-8 h-9 text-sm" /></div>
            <Select value={maintStatusFilter} onValueChange={setMaintStatusFilter}><SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{MAINT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select value={maintTypeFilter} onValueChange={setMaintTypeFilter}><SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent>{MAINT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-2">
            {filteredMaint.map((m) => (
              <div key={m.id} onClick={() => openDrawer(m as unknown as Record<string, unknown>, "maint")} className="agv-maint-row flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">{m.id}</span>
                    <span className="text-xs text-slate-500">{m.agvId}</span>
                    <MaintenanceTypeBadge type={m.type} />
                    <MaintenanceStatusBadge status={m.status} />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span>🔧 {m.description}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <NextServiceDateIndicator days={m.nextService} />
                  <PartsCostTile cost={m.cost} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ===== TAB 5 – Analytics ===== */}
        <TabsContent value="5" className="space-y-6 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Fleet Uptime", value: `${fleetUptime}%`, color: "text-violet-600" },
              { label: "Avg Tasks/Hour", value: avgTasksPerHr, color: "text-cyan-600" },
              { label: "Battery Life", value: `${batteryLifeHrs}h`, color: "text-emerald-600" },
              { label: "Dist Efficiency", value: distEfficiency, color: "text-amber-600" },
              { label: "Maintenance Cost", value: formatINR(maintCost), color: "text-rose-600" },
              { label: "Error Rate", value: `${errorRate}%`, color: "text-red-600" },
              { label: "Throughput", value: `${throughput}/hr`, color: "text-cyan-600" },
              { label: "ROI", value: `${roi}%`, color: "text-emerald-600" },
            ].map((k) => (
              <Card key={k.label}>
                <CardContent className="glass-subtle p-3"><p className="text-[10px] text-slate-500">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Weekly Task Completion</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyTasks}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip /><Legend />
                    <Line type="monotone" dataKey="completed" stroke="#7c3aed" strokeWidth={2} />
                    <Line type="monotone" dataKey="failed" stroke="#e11d48" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Zone Utilization</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={zoneUtil}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip /><Legend />
                    <Bar dataKey="utilization" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">AGV Model Performance Comparison</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={modelPerf} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="model" tick={{ fontSize: 9 }} width={120} />
                  <Tooltip /><Legend />
                  <Bar dataKey="avgSpeed" fill="#0891b2" name="Avg Speed" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="reliability" fill="#059669" name="Reliability %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Mission Completion by Type</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={missionTypeSummary}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="type" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                  <Tooltip /><Legend />
                  <Bar dataKey="completed" fill="#059669" name="Completed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" fill="#e11d48" name="Failed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Cost & Efficiency Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-violet-50 border border-violet-100">
                  <p className="text-[10px] text-violet-500 font-medium">Fleet Investment</p>
                  <p className="text-base font-bold text-violet-700">{formatINR(48500000)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-cyan-50 border border-cyan-100">
                  <p className="text-[10px] text-cyan-500 font-medium">Annual Savings</p>
                  <p className="text-base font-bold text-cyan-700">{formatINR(12800000)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] text-emerald-500 font-medium">Labor Cost Saved</p>
                  <p className="text-base font-bold text-emerald-700">{formatINR(8200000)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-[10px] text-amber-500 font-medium">Operational Cost</p>
                  <p className="text-base font-bold text-amber-700">{formatINR(6400000)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== DRAWER ===== */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <>
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-5 rounded-b-xl mb-4 -mx-6 -mt-6">
              <SheetHeader><SheetTitle className="text-white text-base">
                {drawerTab === "agv" ? String(drawerRecord?.id ?? "AGV Details") : drawerTab === "mission" ? String(drawerRecord?.id ?? "Mission Details") : String(drawerRecord?.id ?? "Maintenance Details")}
              </SheetTitle></SheetHeader>
            </div>

            {drawerTab === "agv" && drawerRecord && (
              <div className="space-y-3">
                {[
                  { label: "Model", value: String(drawerRecord.model) },
                  { label: "Zone", value: String(drawerRecord.zone) },
                  { label: "Status", value: String(drawerRecord.status) },
                  { label: "Battery", value: `${drawerRecord.battery}%` },
                  { label: "Speed", value: `${drawerRecord.speed} m/min` },
                  { label: "Tasks", value: String(drawerRecord.tasks) },
                  { label: "Distance Today", value: `${drawerRecord.distanceToday} km` },
                  { label: "Last Mission", value: String(drawerRecord.lastMission) },
                ].map((t) => (
                  <div key={t.label} className="flex justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-xs text-slate-500">{t.label}</span><span className="text-xs font-semibold text-slate-800">{t.value}</span>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1" onClick={() => { toast.success("Dispatched", `${drawerRecord.id} has been dispatched`); setDrawerOpen(false); }}><Play className="h-3.5 w-3.5 mr-1" />Dispatch</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1" onClick={() => { toast.info("Charging", `${drawerRecord.id} sent to charging station`); setDrawerOpen(false); }}><Zap className="h-3.5 w-3.5 mr-1" />Charge</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1" onClick={() => { toast.warning("Maintenance", `${drawerRecord.id} flagged for maintenance`); setDrawerOpen(false); }}><Wrench className="h-3.5 w-3.5 mr-1" />Maintain</Button>
                </div>
              </div>
            )}

            {drawerTab === "mission" && drawerRecord && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <ProgressRing progress={Number(drawerRecord.progress) || 0} />
                  <div><p className="text-sm font-bold">{String(drawerRecord.type)} Mission</p><AGVStatusBadge status={String(drawerRecord.status)} /></div>
                </div>
                {[
                  { label: "AGV", value: String(drawerRecord.agvId) },
                  { label: "Priority", value: String(drawerRecord.priority) },
                  { label: "Progress", value: `${drawerRecord.progress}%` },
                  { label: "Created", value: String(drawerRecord.createdAt) },
                  { label: "ETA", value: String(drawerRecord.eta) },
                ].map((t) => (
                  <div key={t.label} className="flex justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-xs text-slate-500">{t.label}</span><span className="text-xs font-semibold text-slate-800">{t.value}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <p className="text-xs text-slate-500 mb-2">Mission Timeline</p>
                  <MissionTimeline stage={Number(drawerRecord.stage) || 0} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => { toast.error("Mission Aborted", `${drawerRecord.id} has been aborted`); setDrawerOpen(false); }}><XCircle className="h-3.5 w-3.5 mr-1" />Abort</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1" onClick={() => { toast.info("Mission Paused", `${drawerRecord.id} has been paused`); setDrawerOpen(false); }}><Pause className="h-3.5 w-3.5 mr-1" />Pause</Button>
                  <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => { toast.success("Mission Resumed", `${drawerRecord.id} has been resumed`); setDrawerOpen(false); }}><Play className="h-3.5 w-3.5 mr-1" />Resume</Button>
                </div>
              </div>
            )}

            {drawerTab === "maint" && drawerRecord && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <MaintenanceTypeBadge type={String(drawerRecord.type)} />
                  <MaintenanceStatusBadge status={String(drawerRecord.status)} />
                </div>
                {[
                  { label: "AGV", value: String(drawerRecord.agvId) },
                  { label: "Type", value: String(drawerRecord.type) },
                  { label: "Status", value: String(drawerRecord.status) },
                  { label: "Description", value: String(drawerRecord.description) },
                  { label: "Next Service", value: `${drawerRecord.nextService} days` },
                ].map((t) => (
                  <div key={t.label} className="flex justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-xs text-slate-500">{t.label}</span><span className="text-xs font-semibold text-slate-800">{t.value}</span>
                  </div>
                ))}
                <PartsCostTile cost={Number(drawerRecord.cost) || 0} />
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => { toast.success("Scheduled", `Maintenance ${drawerRecord.id} scheduled`); setDrawerOpen(false); }}><Clock className="h-3.5 w-3.5 mr-1" />Schedule</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1" onClick={() => { toast.info("Updated", `Maintenance ${drawerRecord.id} updated`); setDrawerOpen(false); }}><RefreshCw className="h-3.5 w-3.5 mr-1" />Update</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1" onClick={() => { toast.warning("Escalated", `Maintenance ${drawerRecord.id} escalated`); setDrawerOpen(false); }}><AlertTriangle className="h-3.5 w-3.5 mr-1" />Escalate</Button>
                </div>
              </div>
            )}
          </>
        </SheetContent>
      </Sheet>
    </div>
  );
}
