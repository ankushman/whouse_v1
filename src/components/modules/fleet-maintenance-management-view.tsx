"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar,
} from "recharts";
import {
  Wrench, Truck, Fuel, Gauge, AlertTriangle, CheckCircle2, XCircle,
  Clock, Search, Filter, Eye, ChevronRight, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Calendar, DollarSign, BarChart3,
  Activity, Target, Zap, Info, ClipboardCheck, FileText, Timer,
  IndianRupee, Settings, Battery, ThermometerSun, WrenchIcon,
  CircleDot, Hexagon, SquareDot, TriangleAlert, ShieldAlert,
  HardHat, RefreshCw, MapPin, Flag, Plus, Minus, Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
type VehicleType = "forklift" | "reach_truck" | "pallet_jack" | "tractor" | "delivery_truck" | "cold_truck" | "sweeper" | "boom_lift" | "tugger" | "order_picker";
type FuelType = "diesel" | "electric" | "lpg" | "cng" | "gasoline" | "manual";
type MaintenanceType = "preventive" | "corrective" | "emergency" | "predictive";
type Priority = "critical" | "high" | "medium" | "low";
type WorkOrderStatus = "scheduled" | "in_progress" | "parts_ordered" | "awaiting_approval" | "completed" | "cancelled";
type VehicleStatus = "operational" | "under_maintenance" | "out_of_service" | "decommissioned";

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  forklift: "Forklift",
  reach_truck: "Reach Truck",
  pallet_jack: "Pallet Jack",
  tractor: "Terminal Tractor",
  delivery_truck: "Delivery Truck",
  cold_truck: "Reefer Truck",
  sweeper: "Floor Sweeper",
  boom_lift: "Boom Lift",
  tugger: "Tugger",
  order_picker: "Order Picker",
};

const VEHICLE_TYPE_ICONS: Partial<Record<VehicleType, React.ReactNode>> = {
  forklift: <Forklift className="h-4 w-4" />,
  reach_truck: <Construction className="h-4 w-4" />,
  pallet_jack: <Truck className="h-4 w-4" />,
  tractor: <Truck className="h-4 w-4" />,
  delivery_truck: <Truck className="h-4 w-4" />,
  cold_truck: <Car className="h-4 w-4" />,
  sweeper: <Bus className="h-4 w-4" />,
  boom_lift: <Construction className="h-4 w-4" />,
  tugger: <Truck className="h-4 w-4" />,
  order_picker: <Construction className="h-4 w-4" />,
};

const MAINT_TYPE_LABELS: Record<MaintenanceType, string> = {
  preventive: "Preventive",
  corrective: "Corrective",
  emergency: "Emergency",
  predictive: "Predictive",
};

const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  parts_ordered: "Parts Ordered",
  awaiting_approval: "Awaiting Approval",
  completed: "Completed",
  cancelled: "Cancelled",
};

const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  operational: "Operational",
  under_maintenance: "Under Maintenance",
  out_of_service: "Out of Service",
  decommissioned: "Decommissioned",
};

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: MaintenanceType;
  priority: Priority;
  status: WorkOrderStatus;
  description: string;
  scheduledDate: string;
  completedDate: string | null;
  assignedTo: string;
  estimatedCost: number;
  actualCost: number;
  partsUsed: string[];
  odometerAtService: number;
  nextServiceOdometer: number;
  nextServiceDate: string;
  downtimeHours: number;
  notes: string;
}

interface Vehicle {
  id: string;
  assetTag: string;
  name: string;
  type: VehicleType;
  fuelType: FuelType;
  status: VehicleStatus;
  warehouse: string;
  manufacturer: string;
  model: string;
  year: number;
  serialNo: string;
  purchaseDate: string;
  purchaseCost: number;
  currentOdometer: number;
  maxOdometer: number;
  lastServiceDate: string;
  nextServiceDate: string;
  lastServiceOdometer: number;
  totalDowntimeHours: number;
  totalMaintenanceCost: number;
  fuelConsumption: number;
  avgDailyUsage: number;
  tireCondition: "good" | "fair" | "poor" | "critical";
  batteryHealth: number;
  utilizationRate: number;
  maintenanceRecords: MaintenanceRecord[];
}

// ============================================================================
// Deterministic Mock Data Generator
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateFleetData() {
  const rand = seededRandom(117117);

  const warehouses = [
    "Mumbai DC", "Delhi NCR Hub", "Chennai Distribution",
    "Kolkata Warehouse", "Bangalore South", "Hyderabad Central",
  ];

  const vehicleTypes: VehicleType[] = [
    "forklift", "forklift", "forklift", "reach_truck", "reach_truck",
    "pallet_jack", "pallet_jack", "pallet_jack", "tractor", "tractor",
    "delivery_truck", "cold_truck", "sweeper", "boom_lift", "tugger", "order_picker",
  ];

  const fuelTypes: Record<VehicleType, FuelType[]> = {
    forklift: ["diesel", "electric", "lpg"],
    reach_truck: ["electric"],
    pallet_jack: ["electric", "manual"],
    tractor: ["diesel", "cng"],
    delivery_truck: ["diesel", "cng", "gasoline"],
    cold_truck: ["diesel"],
    sweeper: ["electric", "lpg"],
    boom_lift: ["diesel", "electric"],
    tugger: ["electric"],
    order_picker: ["electric"],
  };

  const manufacturers: Record<VehicleType, string[]> = {
    forklift: ["Toyota", "Crown", "Hyster", "Yale", "Komatsu"],
    reach_truck: ["Crown", "Raymond", "Hyster", "Yale"],
    pallet_jack: ["Crown", "Raymond", "Toyota", "Uline"],
    tractor: ["Kalmar", "Terberg", "Capacity", "OTT"],
    delivery_truck: ["Tata Motors", "Ashok Leyland", "Eicher", "BharatBenz"],
    cold_truck: ["Tata Motors", "Ashok Leyland", "Isuzu"],
    sweeper: ["Tennant", "Nilfisk", "Karcher"],
    boom_lift: ["JLG", "Genie", "Skyjack"],
    tugger: ["Crown", "Toyota", "Raymond"],
    order_picker: ["Crown", "Raymond", "Hyster"],
  };

  const models: Record<string, string[]> = {
    Toyota: ["8FGU25", "8FBE18", "8FGCU25"],
    Crown: ["RC 5500", "RR 5795", "WP 3045-35"],
    Hyster: ["H80FT", "S60FT", "E80Z"],
    Yale: ["GDP80VX", "MR16D", "J80W"],
    Komatsu: ["FD30T-16", "FG25T-16"],
    Raymond: ["9600", "5500-OPC30TT", "102T"],
    Kalmar: ["DCD120-6", " Ottawa T2"],
    Terberg: ["YT202", "YT222"],
    Capacity: ["TR250", "TR300"],
    "Tata Motors": ["LPT 1615", "Signa 2818.K", "Ace EX"],
    "Ashok Leyland": ["Ecomet 1415", "Boss 1215", "4018"],
    Eicher: ["Pro 6028T", "Pro 2055XP"],
    BharatBenz: ["1215R", "3143C"],
    Isuzu: ["NQR 75L", "FTR 800"],
    Tennant: ["T7", "S20", "5680"],
    Nilfisk: ["SC5000", "CB30"],
    Karcher: ["BR 700", "KM 70/30"],
    JLG: ["450AJ", "600S"],
    Genie: ["S-65", "GS-2669"],
    Skyjack: ["SJIII 3226", "SJ12"],
    Uline: ["H-1155"],
  };

  const assignees = [
    "Ramesh Sharma", "Sunil Patel", "Anil Kumar", "Deepak Verma",
    "Pradeep Gupta", "Suresh Yadav", "Ravi Singh", "Manoj Tiwari",
    "Vijay Kumar", "Arun Mehta",
  ];

  const statuses: VehicleStatus[] = ["operational", "operational", "operational", "operational", "operational", "under_maintenance", "out_of_service"];
  const maintenanceTypes: MaintenanceType[] = ["preventive", "preventive", "preventive", "corrective", "emergency", "predictive"];
  const priorities: Priority[] = ["low", "low", "medium", "medium", "high", "critical"];
  const woStatuses: WorkOrderStatus[] = ["scheduled", "in_progress", "parts_ordered", "awaiting_approval", "completed", "completed", "completed", "cancelled"];

  const tireConditions: ("good" | "fair" | "poor" | "critical")[] = ["good", "good", "good", "fair", "fair", "poor", "critical"];
  const parts = [
    "Hydraulic Filter", "Oil Filter", "Air Filter", "Brake Pad Set", "Drive Tire (pair)",
    "Steer Tire (pair)", "Battery 48V", "Charger Assembly", "Fork Tips", "Mast Chain",
    "Transmission Fluid", "Coolant Hose", "Seat Assembly", "Side Mirror Set", "LED Light Bar",
    "Proximity Sensor", "Load Backrest", "Forklift Fork (set)", "Control Lever", "Ignition Switch",
  ];

  const vehicles: Vehicle[] = [];

  for (let i = 0; i < 32; i++) {
    const vType: VehicleType = vehicleTypes[Math.floor(rand() * vehicleTypes.length)];
    const fuel = fuelTypes[vType][Math.floor(rand() * fuelTypes[vType].length)];
    const mfr = manufacturers[vType][Math.floor(rand() * manufacturers[vType].length)];
    const mfrModels = models[mfr] || ["Standard"];
    const model = mfrModels[Math.floor(rand() * mfrModels.length)];
    const year = 2018 + Math.floor(rand() * 7);
    const vStatus: VehicleStatus = statuses[Math.floor(rand() * statuses.length)];
    const wh = warehouses[Math.floor(rand() * warehouses.length)];
    const baseOdometer = Math.floor(rand() * 15000) + 2000;
    const tireCond = tireConditions[Math.floor(rand() * tireConditions.length)];
    const battery = fuel === "electric" ? Math.round(rand() * 40 + 60) : 100;
    const purchaseCost = vType === "delivery_truck" || vType === "cold_truck" ? Math.round(rand() * 2000000) + 1500000 :
      vType === "tractor" ? Math.round(rand() * 1500000) + 1000000 :
      vType === "boom_lift" ? Math.round(rand() * 1000000) + 800000 :
      vType === "reach_truck" ? Math.round(rand() * 800000) + 500000 :
      Math.round(rand() * 500000) + 200000;

    const mRecords: MaintenanceRecord[] = [];
    const nmRecs = Math.floor(rand() * 5) + 1;
    for (let m = 0; m < nmRecs; m++) {
      const mType: MaintenanceType = maintenanceTypes[Math.floor(rand() * maintenanceTypes.length)];
      const mPriority: Priority = mType === "emergency" ? "critical" : priorities[Math.floor(rand() * priorities.length)];
      const mStatus: WorkOrderStatus = m === nmRecs - 1 && vStatus === "under_maintenance" ? "in_progress" : woStatuses[Math.floor(rand() * woStatuses.length)];
      const month = Math.floor(rand() * 7) + 1;
      const day = Math.floor(rand() * 28) + 1;
      const estCost = mType === "emergency" ? Math.round(rand() * 50000) + 10000 :
        mType === "corrective" ? Math.round(rand() * 25000) + 5000 :
        mType === "predictive" ? Math.round(rand() * 15000) + 3000 :
        Math.round(rand() * 8000) + 2000;
      const nParts = Math.floor(rand() * 4) + 1;
      const usedParts: string[] = [];
      for (let p = 0; p < nParts; p++) usedParts.push(parts[Math.floor(rand() * parts.length)]);

      mRecords.push({
        id: `WO-${String(i + 1).padStart(3, "0")}-${String(m + 1).padStart(2, "0")}`,
        vehicleId: `V-${String(i + 1).padStart(3, "0")}`,
        vehicleName: `${mfr} ${model}`,
        type: mType,
        priority: mPriority,
        status: mStatus,
        description: `${MAINT_TYPE_LABELS[mType]} maintenance — ${["engine service", "brake inspection", "hydraulic system check", "battery replacement", "tire rotation", "fork chain tension", "cooling system flush", "transmission service", "electrical diagnostic", "lift cylinder seal"][m % 10]}`,
        scheduledDate: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        completedDate: mStatus === "completed" ? `2026-${String(month).padStart(2, "0")}-${String(Math.min(day + Math.floor(rand() * 3) + 1, 28)).padStart(2, "0")}` : null,
        assignedTo: assignees[Math.floor(rand() * assignees.length)],
        estimatedCost: estCost,
        actualCost: mStatus === "completed" ? Math.round(estCost * (0.8 + rand() * 0.5)) : 0,
        partsUsed: usedParts,
        odometerAtService: baseOdometer + m * 500,
        nextServiceOdometer: baseOdometer + (m + 1) * 500 + Math.floor(rand() * 200),
        nextServiceDate: `2026-${String(Math.min(month + 2, 12)).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        downtimeHours: mType === "emergency" ? Math.floor(rand() * 24) + 8 : mType === "corrective" ? Math.floor(rand() * 12) + 4 : Math.floor(rand() * 4) + 1,
        notes: rand() > 0.5 ? "No additional issues found." : "Follow-up inspection recommended in 30 days.",
      });
    }

    const totalMaintCost = mRecords.filter(r => r.status === "completed").reduce((s, r) => s + r.actualCost, 0);
    const totalDowntime = mRecords.reduce((s, r) => s + r.downtimeHours, 0);

    vehicles.push({
      id: `V-${String(i + 1).padStart(3, "0")}`,
      assetTag: `ASSET-${String(2026000 + i + 1)}`,
      name: `${mfr} ${model}`,
      type: vType,
      fuelType: fuel,
      status: vStatus,
      warehouse: wh,
      manufacturer: mfr,
      model,
      year,
      serialNo: `SN-${String(100000 + Math.floor(rand() * 900000))}`,
      purchaseDate: `${year}-0${Math.floor(rand() * 3) + 1}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      purchaseCost,
      currentOdometer: baseOdometer + nmRecs * 500,
      maxOdometer: fuel === "electric" ? 20000 : 50000,
      lastServiceDate: mRecords.length > 0 ? mRecords[mRecords.length - 1].scheduledDate : "N/A",
      nextServiceDate: mRecords.length > 0 ? mRecords[mRecords.length - 1].nextServiceDate : "N/A",
      lastServiceOdometer: mRecords.length > 0 ? mRecords[mRecords.length - 1].odometerAtService : 0,
      totalDowntimeHours: totalDowntime,
      totalMaintenanceCost: totalMaintCost,
      fuelConsumption: fuel === "electric" ? Math.round(rand() * 15 + 8) : fuel === "diesel" ? Math.round(rand() * 5 + 3) : Math.round(rand() * 8 + 5),
      avgDailyUsage: Math.round(rand() * 8 + 2),
      tireCondition: tireCond,
      batteryHealth: battery,
      utilizationRate: Math.round(rand() * 40 + 55),
      maintenanceRecords: mRecords,
    });
  }

  return vehicles;
}

// ============================================================================
// Helper Components
// ============================================================================
function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, "destructive" | "warning" | "secondary" | "outline"> = {
    critical: "destructive", high: "warning", medium: "secondary", low: "outline",
  };
  return <Badge variant={map[priority]} className="text-[10px] font-bold uppercase tracking-wider">{priority}</Badge>;
}

function StatusBadge({ status }: { status: WorkOrderStatus }) {
  const map: Record<WorkOrderStatus, "destructive" | "warning" | "default" | "secondary" | "outline" | "success"> = {
    scheduled: "outline", in_progress: "warning", parts_ordered: "secondary",
    awaiting_approval: "default", completed: "success", cancelled: "destructive",
  };
  return <Badge variant={map[status]} className="text-[10px]">{STATUS_LABELS[status]}</Badge>;
}

function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const map: Record<VehicleStatus, "success" | "warning" | "destructive" | "secondary"> = {
    operational: "success", under_maintenance: "warning", out_of_service: "destructive", decommissioned: "secondary",
  };
  return <Badge variant={map[status]} className="text-[10px]">{VEHICLE_STATUS_LABELS[status]}</Badge>;
}

function FormatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function HealthRing({ value, size = 48, label }: { value: number; size?: number; label: string }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const color = value >= 80 ? "#22c55e" : value >= 60 ? "#f59e0b" : value >= 40 ? "#f97316" : "#ef4444";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" className="text-muted-foreground/20" strokeWidth={4} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={4} strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <span className="absolute text-xs font-bold" style={{ color }}>{value}%</span>
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"];

function Forklift({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="10" height="10" rx="1" /><path d="M16 7h4v10h-4" /><circle cx="5" cy="20" r="1.5" /><circle cx="19" cy="20" r="1.5" /><path d="M2 17h10" /><path d="M14 12h6" /><path d="M16 12v5" /></svg>;
}
function Construction({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20" /><path d="M5 20V8l7-5 7 5v12" /><path d="M9 20v-6h6v6" /><path d="M9 10h1" /><path d="M14 10h1" /><path d="M12 15v2" /></svg>;
}
function Car({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-3.6A2 2 0 0 0 13.7 6h-3.4A2 2 0 0 0 9 7.4L7 10l-3.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>;
}
function Bus({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 19V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14" /><path d="M3 19h18" /><path d="M3 14h18" /><rect x="7" y="6" width="10" height="3" rx="1" /><circle cx="7" cy="16.5" r="1.5" /><circle cx="17" cy="16.5" r="1.5" /></svg>;
}

// ============================================================================
// Main Component
// ============================================================================
export function FleetMaintenanceManagementView() {
  const vehicles = useMemo(() => generateFleetData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // All work orders flattened
  const allWorkOrders = useMemo(() => {
    return vehicles.flatMap(v => v.maintenanceRecords.map(r => ({ ...r, vehicleType: v.type, warehouse: v.warehouse })));
  }, [vehicles]);

  // KPIs
  const kpis = useMemo(() => {
    const total = vehicles.length;
    const operational = vehicles.filter(v => v.status === "operational").length;
    const underMaint = vehicles.filter(v => v.status === "under_maintenance").length;
    const openWO = allWorkOrders.filter(w => !["completed", "cancelled"].includes(w.status)).length;
    const completedWO = allWorkOrders.filter(w => w.status === "completed").length;
    const totalCost = allWorkOrders.filter(w => w.status === "completed").reduce((s, w) => s + w.actualCost, 0);
    const avgDowntime = vehicles.reduce((s, v) => s + v.totalDowntimeHours, 0) / total;
    const fleetUtilization = Math.round(vehicles.reduce((s, v) => s + v.utilizationRate, 0) / total);
    return { total, operational, underMaint, openWO, completedWO, totalCost, avgDowntime, fleetUtilization };
  }, [vehicles, allWorkOrders]);

  // Vehicle type distribution
  const typeDist = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => { counts[v.type] = (counts[v.type] || 0) + 1; });
    return Object.entries(counts).map(([t, c]) => ({ name: VEHICLE_TYPE_LABELS[t as VehicleType], value: c, color: COLORS[Object.keys(VEHICLE_TYPE_LABELS).indexOf(t) % COLORS.length] })).sort((a, b) => b.value - a.value);
  }, [vehicles]);

  // Monthly maintenance cost trend
  const monthlyCostTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, mi) => {
      const mWO = allWorkOrders.filter(w => {
        const d = new Date(w.scheduledDate);
        return d.getMonth() === mi && w.status === "completed";
      });
      return {
        month: m,
        cost: mWO.reduce((s, w) => s + w.actualCost, 0),
        preventive: mWO.filter(w => w.type === "preventive").reduce((s, w) => s + w.actualCost, 0),
        corrective: mWO.filter(w => w.type === "corrective").reduce((s, w) => s + w.actualCost, 0),
        emergency: mWO.filter(w => w.type === "emergency").reduce((s, w) => s + w.actualCost, 0),
      };
    });
  }, [allWorkOrders]);

  // Warehouse fleet comparison
  const warehouseFleet = useMemo(() => {
    const whMap: Record<string, { total: number; operational: number; maintCost: number; utilization: number }> = {};
    vehicles.forEach(v => {
      if (!whMap[v.warehouse]) whMap[v.warehouse] = { total: 0, operational: 0, maintCost: 0, utilization: 0 };
      whMap[v.warehouse].total++;
      if (v.status === "operational") whMap[v.warehouse].operational++;
      whMap[v.warehouse].maintCost += v.totalMaintenanceCost;
      whMap[v.warehouse].utilization += v.utilizationRate;
    });
    return Object.entries(whMap).map(([wh, d]) => ({
      warehouse: wh.replace(" ", "\n"),
      vehicles: d.total,
      operational: d.operational,
      cost: d.maintCost,
      utilization: Math.round(d.utilization / d.total),
    }));
  }, [vehicles]);

  // Maintenance type breakdown
  const maintTypeBreakdown = useMemo(() => {
    return (["preventive", "corrective", "emergency", "predictive"] as MaintenanceType[]).map(t => ({
      type: MAINT_TYPE_LABELS[t],
      count: allWorkOrders.filter(w => w.type === t).length,
      cost: allWorkOrders.filter(w => w.type === t && w.status === "completed").reduce((s, w) => s + w.actualCost, 0),
      color: t === "preventive" ? "#22c55e" : t === "corrective" ? "#f59e0b" : t === "emergency" ? "#ef4444" : "#6366f1",
    }));
  }, [allWorkOrders]);

  // Upcoming services (next 30 days)
  const upcomingServices = useMemo(() => {
    return vehicles
      .filter(v => v.status !== "decommissioned")
      .sort((a, b) => new Date(a.nextServiceDate).getTime() - new Date(b.nextServiceDate).getTime())
      .slice(0, 10);
  }, [vehicles]);

  // Downtime by vehicle type
  const downtimeByType = useMemo(() => {
    const dtMap: Record<string, number> = {};
    vehicles.forEach(v => { dtMap[v.type] = (dtMap[v.type] || 0) + v.totalDowntimeHours; });
    return Object.entries(dtMap).map(([t, h]) => ({ type: VEHICLE_TYPE_LABELS[t as VehicleType], hours: h })).sort((a, b) => b.hours - a.hours);
  }, [vehicles]);

  // Filtered vehicles
  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase()) && !v.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) && !v.serialNo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterType !== "all" && v.type !== filterType) return false;
      if (filterStatus !== "all" && v.status !== filterStatus) return false;
      if (filterWarehouse !== "all" && v.warehouse !== filterWarehouse) return false;
      return true;
    });
  }, [vehicles, searchQuery, filterType, filterStatus, filterWarehouse]);

  const tabLabels = ["Fleet Overview", "Vehicle Registry", "Work Orders", "Cost Analytics", "Maintenance Schedule"];

  return (
    <div className="fm-container">
      {/* Animated Gradient Header */}
      <div className="fm-header">
        <div className="fm-header-content">
          <div className="flex items-center gap-3">
            <div className="fm-header-icon">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Fleet Maintenance Management</h1>
              <p className="text-white/70 text-sm">Vehicle Registry, PM Scheduling, Work Orders & Cost Analytics</p>
            </div>
          </div>
          <div className="fm-header-badges">
            <div className="fm-header-badge bg-emerald-500/20 border-emerald-400/30">
              <Activity className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-emerald-200 text-sm font-medium">{kpis.operational} Active</span>
            </div>
            <div className="fm-header-badge bg-amber-500/20 border-amber-400/30">
              <Wrench className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-amber-200 text-sm font-medium">{kpis.openWO} Open WOs</span>
            </div>
            <div className="fm-header-badge bg-blue-500/20 border-blue-400/30">
              <Gauge className="h-3.5 w-3.5 text-blue-300" />
              <span className="text-blue-200 text-sm font-medium">{kpis.fleetUtilization}% Utilization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="fm-tabs">
        {tabLabels.map((label, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)} className={`fm-tab ${activeTab === idx ? "active" : ""}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="fm-content">
        {/* ===== TAB 0: Fleet Overview ===== */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Vehicles", value: kpis.total, icon: <Truck className="h-5 w-5" />, cls: "fm-kpi-blue" },
                { label: "Operational", value: kpis.operational, icon: <CheckCircle2 className="h-5 w-5" />, cls: "fm-kpi-green" },
                { label: "Open Work Orders", value: kpis.openWO, icon: <ClipboardCheck className="h-5 w-5" />, cls: "fm-kpi-amber" },
                { label: "Total Maint. Cost", value: FormatINR(kpis.totalCost), icon: <IndianRupee className="h-5 w-5" />, cls: "fm-kpi-purple" },
              ].map((kpi, i) => (
                <div key={i} className={`fm-kpi-card ${kpi.cls}`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="text-white/80">{kpi.icon}</div>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                  <div className="text-white/70 text-xs">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Vehicle Type Distribution */}
              <Card className="fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-500" /> Fleet Composition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={typeDist} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={2} label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {typeDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Cost Trend */}
              <Card className="col-span-2 fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-green-500" /> Monthly Maintenance Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={monthlyCostTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="cost" name="Total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                      <Line type="monotone" dataKey="preventive" name="Preventive" stroke="#22c55e" strokeWidth={1.5} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="corrective" name="Corrective" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2: Warehouse Fleet + Downtime */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cyan-500" /> Warehouse Fleet Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={warehouseFleet} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="warehouse" tick={{ fontSize: 9 }} width={90} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="vehicles" name="Total" fill="#3b82f6" radius={[0, 2, 2, 0]} />
                      <Bar dataKey="operational" name="Operational" fill="#22c55e" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Timer className="h-4 w-4 text-red-500" /> Downtime by Vehicle Type (Hours)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={downtimeByType}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="hours" name="Downtime (hrs)" fill="#ef4444" radius={[4, 4, 0, 0]}>
                        {downtimeByType.map((entry, idx) => <Cell key={idx} fill={entry.hours > 50 ? "#ef4444" : entry.hours > 25 ? "#f59e0b" : "#22c55e"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Maintenance Type Breakdown + Upcoming Services */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4 text-indigo-500" /> Maintenance Type Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={maintTypeBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="count" paddingAngle={3}>
                        {maintTypeBreakdown.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Upcoming Services */}
              <Card className="col-span-2 fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-500" /> Upcoming Scheduled Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {upcomingServices.map((v, i) => {
                      const daysUntil = Math.ceil((new Date(v.nextServiceDate).getTime() - Date.now()) / 86400000);
                      const urgent = daysUntil <= 7;
                      return (
                        <div key={v.id} className={`fm-upcoming-item ${urgent ? "fm-upcoming-urgent" : ""}`}>
                          <div className="flex items-center gap-2 flex-1">
                            {VEHICLE_TYPE_ICONS[v.type]}
                            <span className="text-xs font-medium">{v.name}</span>
                            <Badge variant="outline" className="text-[10px]">{v.assetTag}</Badge>
                            <Badge variant="secondary" className="text-[10px]">{v.warehouse.split(" ")[0]}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{v.nextServiceDate}</span>
                            <Badge variant={urgent ? "destructive" : daysUntil <= 14 ? "warning" : "success"} className="text-[10px]">
                              {daysUntil > 0 ? `${daysUntil}d` : "Overdue"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===== TAB 1: Vehicle Registry ===== */}
        {activeTab === 1 && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="fm-filter-bar">
              <div className="fm-search-box">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search vehicles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="fm-search-input" />
              </div>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="fm-filter-select">
                <option value="all">All Types</option>
                {Object.entries(VEHICLE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="fm-filter-select">
                <option value="all">All Status</option>
                {Object.entries(VEHICLE_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)} className="fm-filter-select">
                <option value="all">All Warehouses</option>
                {["Mumbai DC", "Delhi NCR Hub", "Chennai Distribution", "Kolkata Warehouse", "Bangalore South", "Hyderabad Central"].map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <span className="text-xs text-muted-foreground">{filtered.length} vehicles</span>
            </div>

            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.slice(0, 18).map(v => (
                <Card key={v.id} className="fm-vehicle-card" onClick={() => setSelectedVehicle(v)}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="fm-vehicle-icon">{VEHICLE_TYPE_ICONS[v.type]}</div>
                        <div>
                          <div className="text-xs font-semibold">{v.name}</div>
                          <div className="text-[10px] text-muted-foreground">{v.assetTag} · {v.year}</div>
                        </div>
                      </div>
                      <VehicleStatusBadge status={v.status} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="text-center">
                        <HealthRing value={v.utilizationRate} size={40} label="Utilization" />
                      </div>
                      <div className="text-center">
                        <HealthRing value={v.batteryHealth} size={40} label={v.fuelType === "electric" ? "Battery" : "Fuel"} />
                      </div>
                      <div className="text-center">
                        <HealthRing value={v.tireCondition === "good" ? 95 : v.tireCondition === "fair" ? 65 : v.tireCondition === "poor" ? 35 : 10} size={40} label="Tires" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{v.warehouse.split(" ")[0]}</span>
                      <span>Odo: {v.currentOdometer.toLocaleString()} km</span>
                      <span>Maint: {FormatINR(v.totalMaintenanceCost)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB 2: Work Orders ===== */}
        {activeTab === 2 && (
          <div className="space-y-4">
            {/* WO Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total WOs", value: allWorkOrders.length, color: "text-blue-600" },
                { label: "Open", value: kpis.openWO, color: "text-amber-600" },
                { label: "Completed", value: kpis.completedWO, color: "text-emerald-600" },
                { label: "Emergency", value: allWorkOrders.filter(w => w.type === "emergency").length, color: "text-red-600" },
              ].map((k, i) => (
                <div key={i} className="fm-wo-kpi" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Work Orders by Status Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" /> WOs by Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={(["scheduled", "in_progress", "parts_ordered", "awaiting_approval", "completed", "cancelled"] as WorkOrderStatus[]).map(s => ({
                      status: STATUS_LABELS[s],
                      count: allWorkOrders.filter(w => w.status === s).length,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="status" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                        {["#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#22c55e", "#ef4444"].map((c, idx) => <Cell key={idx} fill={c} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* All Work Orders Table */}
              <Card className="col-span-2 fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" /> All Work Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="fm-table">
                      <thead>
                        <tr>
                          <th>WO #</th>
                          <th>Vehicle</th>
                          <th>Type</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Assigned</th>
                          <th>Scheduled</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allWorkOrders.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()).slice(0, 20).map(wo => (
                          <tr key={wo.id} className="fm-table-row">
                            <td className="font-mono text-xs">{wo.id}</td>
                            <td className="text-xs">{wo.vehicleName.split(" ").slice(0, 2).join(" ")}</td>
                            <td className="text-xs">{MAINT_TYPE_LABELS[wo.type]}</td>
                            <td><PriorityBadge priority={wo.priority} /></td>
                            <td><StatusBadge status={wo.status} /></td>
                            <td className="text-xs">{wo.assignedTo.split(" ")[0]}</td>
                            <td className="text-xs text-muted-foreground">{wo.scheduledDate}</td>
                            <td className="text-xs font-mono">{wo.status === "completed" ? FormatINR(wo.actualCost) : FormatINR(wo.estimatedCost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===== TAB 3: Cost Analytics ===== */}
        {activeTab === 3 && (
          <div className="space-y-4">
            {/* Cost KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Maintenance Cost", value: FormatINR(kpis.totalCost), icon: <IndianRupee className="h-5 w-5 text-blue-500" /> },
                { label: "Avg Cost per Vehicle", value: FormatINR(kpis.totalCost / kpis.total), icon: <Car className="h-5 w-5 text-amber-500" /> },
                { label: "Preventive Ratio", value: `${Math.round(allWorkOrders.filter(w => w.type === "preventive").length / Math.max(allWorkOrders.length, 1) * 100)}%`, icon: <Settings className="h-5 w-5 text-green-500" /> },
                { label: "Avg Downtime", value: `${kpis.avgDowntime.toFixed(1)} hrs`, icon: <Clock className="h-5 w-5 text-red-500" /> },
              ].map((k, i) => (
                <div key={i} className="fm-cost-kpi">
                  <div className="flex items-center gap-2 mb-1">{k.icon}</div>
                  <div className="text-xl font-bold">{k.value}</div>
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Cost by Type + Cost per Warehouse */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" /> Cost by Maintenance Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={maintTypeBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="cost" name="Cost (₹)" radius={[4, 4, 0, 0]}>
                        {maintTypeBreakdown.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cyan-500" /> Maintenance Cost by Warehouse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={warehouseFleet}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="cost" name="Maint. Cost" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Cost Trend Area Chart */}
            <Card className="fm-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" /> Cost Trend — Preventive vs Corrective vs Emergency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={monthlyCostTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="preventive" name="Preventive" stackId="cost" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} />
                    <Area type="monotone" dataKey="corrective" name="Corrective" stackId="cost" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                    <Area type="monotone" dataKey="emergency" name="Emergency" stackId="cost" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===== TAB 4: Maintenance Schedule ===== */}
        {activeTab === 4 && (
          <div className="space-y-4">
            {/* Utilization & Health Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Fleet Health Summary */}
              <Card className="fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" /> Fleet Health Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: "Fleet Availability", value: kpis.fleetUtilization, target: 90 },
                      { metric: "PM Compliance", value: 78, target: 95 },
                      { metric: "First-Time Fix Rate", value: 85, target: 90 },
                      { metric: "Parts Availability", value: 92, target: 95 },
                      { metric: "Avg Repair Time", value: 68, target: 100 },
                      { metric: "Preventive Ratio", value: Math.round(allWorkOrders.filter(w => w.type === "preventive").length / Math.max(allWorkOrders.length, 1) * 100), target: 70 },
                    ].map((item, i) => {
                      const pct = Math.min((item.value / item.target) * 100, 100);
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{item.metric}</span>
                            <span className="text-xs font-mono font-bold">{item.value}{item.metric.includes("Rate") || item.metric.includes("Ratio") ? "%" : item.metric.includes("Time") ? " hrs" : "%"}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? "#22c55e" : pct >= 70 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Vehicles Requiring Attention */}
              <Card className="fm-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" /> Vehicles Requiring Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vehicles
                      .filter(v => v.status !== "decommissioned")
                      .sort((a, b) => {
                        const scoreA = (a.batteryHealth < 70 ? 1 : 0) + (a.tireCondition === "poor" || a.tireCondition === "critical" ? 1 : 0) + (a.utilizationRate < 60 ? 1 : 0);
                        const scoreB = (b.batteryHealth < 70 ? 1 : 0) + (b.tireCondition === "poor" || b.tireCondition === "critical" ? 1 : 0) + (b.utilizationRate < 60 ? 1 : 0);
                        return scoreB - scoreA;
                      })
                      .slice(0, 8)
                      .map(v => {
                        const issues: string[] = [];
                        if (v.batteryHealth < 70) issues.push(`Battery ${v.batteryHealth}%`);
                        if (v.tireCondition === "poor" || v.tireCondition === "critical") issues.push(`Tires: ${v.tireCondition}`);
                        if (v.utilizationRate < 60) issues.push(`Low util: ${v.utilizationRate}%`);
                        return (
                          <div key={v.id} className="fm-attention-item">
                            <div className="flex items-center gap-2 flex-1">
                              {VEHICLE_TYPE_ICONS[v.type]}
                              <span className="text-xs font-medium">{v.name}</span>
                              <VehicleStatusBadge status={v.status} />
                            </div>
                            <div className="flex gap-1">
                              {issues.map((issue, i) => (
                                <Badge key={i} variant={issue.includes("critical") ? "destructive" : "warning"} className="text-[10px]">{issue}</Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Full Service Schedule Table */}
            <Card className="fm-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" /> Service Schedule Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="fm-table">
                    <thead>
                      <tr>
                        <th>Vehicle</th>
                        <th>Type</th>
                        <th>Warehouse</th>
                        <th>Last Service</th>
                        <th>Next Service</th>
                        <th>Odometer</th>
                        <th>Health</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.filter(v => v.status !== "decommissioned").sort((a, b) => new Date(a.nextServiceDate).getTime() - new Date(b.nextServiceDate).getTime()).slice(0, 20).map(v => {
                        const daysUntil = Math.ceil((new Date(v.nextServiceDate).getTime() - Date.now()) / 86400000);
                        return (
                          <tr key={v.id} className="fm-table-row">
                            <td className="text-xs font-medium">{v.name.split(" ").slice(0, 2).join(" ")}</td>
                            <td className="text-xs">{VEHICLE_TYPE_LABELS[v.type]}</td>
                            <td className="text-xs text-muted-foreground">{v.warehouse.split(" ")[0]}</td>
                            <td className="text-xs text-muted-foreground">{v.lastServiceDate}</td>
                            <td className="text-xs">
                              <Badge variant={daysUntil <= 0 ? "destructive" : daysUntil <= 7 ? "warning" : daysUntil <= 14 ? "secondary" : "outline"} className="text-[10px]">
                                {v.nextServiceDate} ({daysUntil > 0 ? `${daysUntil}d` : "Overdue"})
                              </Badge>
                            </td>
                            <td className="text-xs font-mono">{v.currentOdometer.toLocaleString()}</td>
                            <td>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.batteryHealth >= 80 ? "#22c55e" : v.batteryHealth >= 60 ? "#f59e0b" : "#ef4444" }} />
                                <span className="text-xs">{v.batteryHealth}%</span>
                              </div>
                            </td>
                            <td><VehicleStatusBadge status={v.status} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
