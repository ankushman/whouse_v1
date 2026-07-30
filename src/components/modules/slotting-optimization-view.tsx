"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutList, Search, Eye, X, TrendingUp, Package, ArrowRightLeft,
  AlertTriangle, CheckCircle2, Clock, Award, BarChart3, Activity,
  IndianRupee, ChevronRight, Layers, Grid2x2, ArrowUpDown,
  Target, Zap, ShieldAlert, Ruler, Weight, MapPin, Thermometer,
  Move, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ============================================================================
// Types
// ============================================================================
type Zone = "A" | "B" | "C" | "D" | "E" | "F";
type ABCClazz = "A" | "B" | "C";
type BinStatus = "occupied" | "partial" | "empty" | "reserved" | "maintenance" | "quarantine";
type ReassignStatus = "pending" | "scheduled" | "completed" | "overdue";
type ErgoLevel = "optimal" | "acceptable" | "strained";
type Priority = "high" | "medium" | "low";

const WAREHOUSES = [
  "WH-Mumbai-Navi", "WH-Delhi-NCR", "WH-Chennai-Siruseri",
  "WH-Bangalore-Whitefield", "WH-Kolkata-Haldia", "WH-Hyderabad-Gachibowli",
] as const;

const ZONES: Zone[] = ["A", "B", "C", "D", "E", "F"];
const ZONE_LABELS: Record<Zone, string> = {
  A: "High-Velocity Picking", B: "Medium-Velocity", C: "Bulk Storage",
  D: "Cold Storage", E: "Hazmat/DG", F: "Returns & Rework",
};
const ZONE_COLORS: Record<Zone, string> = {
  A: "#f59e0b", B: "#3b82f6", C: "#64748b", D: "#ec4899", E: "#8b5cf6", F: "#22c55e",
};
const ABC_COLORS: Record<ABCClazz, string> = { A: "#f59e0b", B: "#3b82f6", C: "#64748b" };

const BIN_STATUSES: BinStatus[] = ["occupied", "partial", "empty", "reserved", "maintenance", "quarantine"];
const REASSIGN_STATUSES: ReassignStatus[] = ["pending", "scheduled", "completed", "overdue"];
const ERGO_LEVELS: ErgoLevel[] = ["optimal", "acceptable", "strained"];

const INDIAN_SKUS = [
  { sku: "SKU-FD-0001", product: "Basmati Rice 5kg", weight: 5.2, volume: 6.8 },
  { sku: "SKU-FD-0002", product: "Organic Turmeric 200g", weight: 0.25, volume: 0.35 },
  { sku: "SKU-FD-0003", product: "Premium Tea 500g", weight: 0.6, volume: 0.8 },
  { sku: "SKU-PH-0010", product: "Paracetamol 500mg", weight: 0.01, volume: 0.02 },
  { sku: "SKU-PH-0011", product: "Vitamin D3 Caps", weight: 0.02, volume: 0.03 },
  { sku: "SKU-EL-0020", product: "LED Panel 2ft", weight: 1.2, volume: 4.5 },
  { sku: "SKU-EL-0021", product: "USB-C Cable 1m", weight: 0.05, volume: 0.12 },
  { sku: "SKU-EL-0022", product: "Bluetooth Speaker", weight: 0.35, volume: 0.9 },
  { sku: "SKU-AU-0030", product: "Automotive Filter", weight: 0.8, volume: 2.1 },
  { sku: "SKU-AU-0031", product: "Brake Pad Set", weight: 3.5, volume: 5.0 },
  { sku: "SKU-IN-0040", product: "Hex Bolt M10x50", weight: 0.05, volume: 0.04 },
  { sku: "SKU-IN-0041", product: "Steel Bearing 6205", weight: 0.12, volume: 0.08 },
  { sku: "SKU-IN-0042", product: "PVC Pipe 2in 4m", weight: 2.8, volume: 8.0 },
  { sku: "SKU-FD-0004", product: "Coconut Oil 1L", weight: 1.1, volume: 1.2 },
  { sku: "SKU-FD-0005", product: "Millet Flour 2kg", weight: 2.1, volume: 3.5 },
  { sku: "SKU-PH-0012", product: "Cetirizine 10mg", weight: 0.01, volume: 0.02 },
  { sku: "SKU-PH-0013", product: "ORS Sachets 100pk", weight: 0.5, volume: 0.8 },
  { sku: "SKU-EL-0023", product: "Smart Watch Band", weight: 0.03, volume: 0.05 },
  { sku: "SKU-EL-0024", product: "Power Bank 20K", weight: 0.4, volume: 0.6 },
  { sku: "SKU-AU-0032", product: "Engine Oil 5L", weight: 4.8, volume: 5.5 },
  { sku: "SKU-IN-0043", product: "Welding Rod E6013", weight: 2.0, volume: 1.5 },
  { sku: "SKU-IN-0044", product: "Wire Rope 10mm", weight: 5.0, volume: 3.2 },
  { sku: "SKU-FD-0006", product: "Cashew Nuts 500g", weight: 0.55, volume: 0.7 },
  { sku: "SKU-PH-0014", product: "Chyawanprash 500g", weight: 0.55, volume: 0.65 },
];

const FIRST_NAMES = [
  "Arjun", "Priya", "Rahul", "Sneha", "Vikram", "Ananya", "Amit", "Kavya",
  "Rohit", "Divya", "Suresh", "Meera", "Nikhil", "Pooja", "Manish", "Ritu",
];
const LAST_NAMES = ["Sharma", "Patel", "Kumar", "Singh", "Gupta", "Reddy", "Iyer", "Nair"];

// ============================================================================
// Seeded Random
// ============================================================================
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
let _seed = 127127;
function rand(): number { _seed = (_seed * 16807 + 0) % 2147483647; return _seed / 2147483647; }
function randInt(min: number, max: number): number { return Math.floor(rand() * (max - min + 1)) + min; }
function randFloat(min: number, max: number, dec = 1): number { return parseFloat((rand() * (max - min) + min).toFixed(dec)); }

// ============================================================================
// Mock Data
// ============================================================================
interface BinRecord {
  id: string; warehouse: string; zone: Zone;
  aisle: string; rack: string; level: number; position: string;
  status: BinStatus; sku: string; product: string;
  abc: ABCClazz; pickFreq: number;
  utilization: number; maxWeight: number; currentWeight: number;
  dimensions: string; heightCm: number;
  lastPick: string;
}

function generateBins(): BinRecord[] {
  const bins: BinRecord[] = [];
  for (let i = 0; i < 200; i++) {
    const zone = pick(ZONES);
    const aisle = `A${String(randInt(1, 12)).padStart(2, "0")}`;
    const rack = `R${String(randInt(1, 20)).padStart(2, "0")}`;
    const level = randInt(1, 5);
    const pos = String(randInt(1, 8)).padStart(2, "0");
    const status = pick(BIN_STATUSES);
    const skuInfo = pick(INDIAN_SKUS);
    const abc: ABCClazz = rand() > 0.7 ? "A" : rand() > 0.5 ? "B" : "C";
    const util = status === "empty" ? 0 : status === "partial" ? randInt(15, 80) : randInt(70, 100);
    const pickFreq = zone === "A" ? randInt(50, 300) : zone === "B" ? randInt(15, 80) : randInt(1, 20);
    const m = randInt(1, 12); const d = randInt(1, 28);
    bins.push({
      id: `BIN-${String(i + 1).padStart(5, "0")}`,
      warehouse: pick(WAREHOUSES), zone, aisle, rack, level, position: pos,
      status, sku: status === "empty" || status === "maintenance" ? "—" : skuInfo.sku,
      product: status === "empty" || status === "maintenance" ? "—" : skuInfo.product,
      abc, pickFreq, utilization: util,
      maxWeight: randInt(50, 500), currentWeight: util === 0 ? 0 : Math.round(rand() * randInt(50, 500) * util / 100),
      dimensions: `${randInt(60, 120)}×${randInt(40, 80)}×${randInt(30, 60)}`,
      heightCm: level * randInt(50, 70),
      lastPick: `2024-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }
  return bins;
}

interface ReassignmentRec {
  id: string; sku: string; product: string; currentBin: string; currentZone: Zone;
  recommendedBin: string; recommendedZone: Zone;
  reason: string; priority: Priority; status: ReassignStatus;
  estSavingsMin: number; weightKg: number;
}

function generateReassignments(): ReassignmentRec[] {
  const recs: ReassignmentRec[] = [];
  const reasons = [
    "High pick frequency in wrong zone", "Ergonomic improvement needed",
    "Weight exceeds floor capacity", "Consolidate A-items to golden zone",
    "Reduce travel distance for top 20%", "Seasonal velocity shift detected",
    "Adjacent to slow-moving items", "Excessive height for heavy product",
    "Cross-contamination risk in food zone", "Temperature compliance for pharma",
  ];
  for (let i = 0; i < 25; i++) {
    const s = pick(INDIAN_SKUS);
    const cz = pick(ZONES); let rz = cz;
    while (rz === cz) rz = pick(ZONES);
    const pri = rand() > 0.6 ? "high" : rand() > 0.3 ? "medium" : "low";
    const st: ReassignStatus = pri === "high" ? pick(["pending", "overdue"]) : pick(["pending", "scheduled", "completed"]);
    recs.push({
      id: `RA-${String(i + 1).padStart(4, "0")}`,
      sku: s.sku, product: s.product,
      currentBin: `BIN-${String(randInt(1, 200)).padStart(5, "0")}`,
      currentZone: cz,
      recommendedBin: `BIN-${String(randInt(1, 200)).padStart(5, "0")}`,
      recommendedZone: rz,
      reason: pick(reasons), priority: pri, status: st,
      estSavingsMin: randInt(1, 15), weightKg: s.weight,
    });
  }
  return recs;
}

interface PickPathRecord {
  pathId: string; zone: Zone; avgDistance: number; avgTime: number;
  picksPerHour: number; efficiencyScore: number;
}

function generatePickPaths(): PickPathRecord[] {
  return ZONES.map(z => ({
    pathId: `PATH-${z}`,
    zone: z,
    avgDistance: z === "A" ? randFloat(120, 250) : z === "B" ? randFloat(250, 450) : randFloat(400, 800),
    avgTime: z === "A" ? randFloat(2, 5) : z === "B" ? randFloat(5, 10) : randFloat(8, 18),
    picksPerHour: z === "A" ? randInt(120, 200) : z === "B" ? randInt(60, 120) : randInt(20, 60),
    efficiencyScore: z === "A" ? randInt(82, 98) : z === "B" ? randInt(60, 82) : randInt(30, 60),
  }));
}

interface ErgonomicRecord {
  heightZone: string; label: string; bins: number; items: number;
  avgWeightKg: number; incidentCount: number; level: ErgoLevel;
}

function generateErgonomicData(): ErgonomicRecord[] {
  return [
    { heightZone: "Floor (0-30cm)", label: "Floor", bins: 45, items: 320, avgWeightKg: 18.5, incidentCount: 12, level: "strained" },
    { heightZone: "Low (30-90cm)", label: "Low", bins: 60, items: 580, avgWeightKg: 12.3, incidentCount: 5, level: "acceptable" },
    { heightZone: "Golden (90-150cm)", label: "Golden", bins: 80, items: 1200, avgWeightKg: 6.8, incidentCount: 1, level: "optimal" },
    { heightZone: "High (150-200cm)", label: "High", bins: 55, items: 450, avgWeightKg: 8.2, incidentCount: 7, level: "acceptable" },
    { heightZone: "Top (200-300cm)", label: "Top", bins: 30, items: 180, avgWeightKg: 15.1, incidentCount: 9, level: "strained" },
  ];
}

function generateMonthlyTrends() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m, i) => ({
    month: m,
    utilization: randInt(68, 92),
    reassignments: randInt(5, 30),
    travelDist: randFloat(350, 600),
    picksPerHour: randInt(85, 140),
    efficiency: randInt(75, 95),
  }));
}

// ============================================================================
// Component
// ============================================================================
export default function SlottingOptimizationView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchBin, setSearchBin] = useState("");
  const [filterZone, setFilterZone] = useState("all");
  const [filterBinStatus, setFilterBinStatus] = useState("all");
  const [filterABC, setFilterABC] = useState("all");
  const [searchReassign, setSearchReassign] = useState("");
  const [selectedBin, setSelectedBin] = useState<BinRecord | null>(null);

  const bins = useMemo(() => generateBins(), []);
  const reassignments = useMemo(() => generateReassignments(), []);
  const pickPaths = useMemo(() => generatePickPaths(), []);
  const ergonomicData = useMemo(() => generateErgonomicData(), []);
  const monthlyTrends = useMemo(() => generateMonthlyTrends(), []);

  // --- Stats ---
  const totalBins = bins.length;
  const occupiedBins = bins.filter(b => b.status === "occupied").length;
  const partialBins = bins.filter(b => b.status === "partial").length;
  const emptyBins = bins.filter(b => b.status === "empty").length;
  const avgUtilization = Math.round(bins.reduce((a, b) => a + b.utilization, 0) / bins.length);
  const totalReassignments = reassignments.length;
  const pendingReassignments = reassignments.filter(r => r.status === "pending" || r.status === "overdue").length;
  const totalIncidents = ergonomicData.reduce((a, e) => a + e.incidentCount, 0);

  // --- Chart Data ---
  const zoneDistribution = ZONES.map(z => ({
    name: `Zone ${z} (${ZONE_LABELS[z]})`,
    value: bins.filter(b => b.zone === z).length,
    color: ZONE_COLORS[z],
  }));

  const abcDistribution = (["A", "B", "C"] as ABCClazz[]).map(c => ({
    name: `Class ${c}`, value: bins.filter(b => b.abc === c).length, color: ABC_COLORS[c],
  }));

  const binStatusDist = BIN_STATUSES.map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: bins.filter(b => b.status === s).length,
  })).filter(d => d.value > 0);

  const zoneUtilization = ZONES.map(z => ({
    name: `Zone ${z}`,
    utilization: Math.round(bins.filter(b => b.zone === z).reduce((a, b) => a + b.utilization, 0) / Math.max(1, bins.filter(b => b.zone === z).length)),
    target: 85,
  }));

  const whUtilization = WAREHOUSES.map(wh => ({
    name: wh.replace("WH-", ""),
    utilization: Math.round(bins.filter(b => b.warehouse === wh).reduce((a, b) => a + b.utilization, 0) / Math.max(1, bins.filter(b => b.warehouse === wh).length)),
  }));

  // --- Heatmap data for bin grid (per zone) ---
  const zoneGrids = useMemo(() => {
    const grids: Record<Zone, BinRecord[]> = {} as Record<Zone, BinRecord[]>;
    ZONES.forEach(z => { grids[z] = bins.filter(b => b.zone === z).slice(0, 48); });
    return grids;
  }, [bins]);

  // --- Filtered bins ---
  const filteredBins = useMemo(() => {
    return bins.filter(b => {
      if (searchBin && !b.id.toLowerCase().includes(searchBin.toLowerCase()) && !b.sku.toLowerCase().includes(searchBin.toLowerCase()) && !b.product.toLowerCase().includes(searchBin.toLowerCase())) return false;
      if (filterZone !== "all" && b.zone !== filterZone) return false;
      if (filterBinStatus !== "all" && b.status !== filterBinStatus) return false;
      if (filterABC !== "all" && b.abc !== filterABC) return false;
      return true;
    });
  }, [bins, searchBin, filterZone, filterBinStatus, filterABC]);

  const filteredReassignments = useMemo(() => {
    return reassignments.filter(r => {
      if (searchReassign && !r.id.toLowerCase().includes(searchReassign.toLowerCase()) && !r.sku.toLowerCase().includes(searchReassign.toLowerCase()) && !r.product.toLowerCase().includes(searchReassign.toLowerCase())) return false;
      return true;
    });
  }, [reassignments, searchReassign]);

  // --- Badge Helpers ---
  const zoneBadge = (z: Zone) => {
    const cls: Record<Zone, string> = { A: "slot-badge-zone-a", B: "slot-badge-zone-b", C: "slot-badge-zone-c", D: "slot-badge-zone-d", E: "slot-badge-zone-e", F: "slot-badge-zone-f" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[z]}`}>Zone {z}</span>;
  };
  const abcBadge = (c: ABCClazz) => {
    const cls: Record<ABCClazz, string> = { A: "slot-badge-abc-a", B: "slot-badge-abc-b", C: "slot-badge-abc-c" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[c]}`}>Class {c}</span>;
  };
  const binStatusBadge = (s: BinStatus) => {
    const cls: Record<BinStatus, string> = { occupied: "slot-badge-occupied", partial: "slot-badge-partial", empty: "slot-badge-empty", reserved: "slot-badge-reserved", maintenance: "slot-badge-maintenance", quarantine: "slot-badge-quarantine" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[s]}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
  };
  const reassignStatusBadge = (s: ReassignStatus) => {
    const cls: Record<ReassignStatus, string> = { pending: "slot-badge-reassign-pending", scheduled: "slot-badge-reassign-scheduled", completed: "slot-badge-reassign-completed", overdue: "slot-badge-reassign-overdue" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[s]}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
  };
  const ergoBadge = (e: ErgoLevel) => {
    const cls: Record<ErgoLevel, string> = { optimal: "slot-badge-optimal", acceptable: "slot-badge-acceptable", strained: "slot-badge-strained" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[e]}`}>{e.charAt(0).toUpperCase() + e.slice(1)}</span>;
  };
  const priorityBadge = (p: Priority) => {
    const cls: Record<Priority, string> = { high: "slot-badge-high-pri", medium: "slot-badge-medium-pri", low: "slot-badge-low-pri" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[p]}`}>{p.toUpperCase()}</span>;
  };

  const utilBar = (val: number) => {
    const cls = val > 85 ? "slot-progress-red" : val > 60 ? "slot-progress-orange" : val > 30 ? "slot-progress-teal" : "slot-progress-green";
    return <div className="slot-progress-bar w-16 h-1.5"><div className={`slot-progress-fill ${cls}`} style={{ width: `${val}%` }} /></div>;
  };

  const heatClass = (freq: number) => {
    if (freq > 200) return "slot-heat-4";
    if (freq > 100) return "slot-heat-3";
    if (freq > 40) return "slot-heat-2";
    if (freq > 10) return "slot-heat-1";
    return "slot-heat-0";
  };

  const ergoStripCls = (label: string) => {
    switch (label) {
      case "Floor": return "slot-ergo-floor";
      case "Low": return "slot-ergo-low";
      case "Golden": return "slot-ergo-golden";
      case "High": return "slot-ergo-high";
      case "Top": return "slot-ergo-top";
      default: return "slot-ergo-floor";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ===== Header ===== */}
      <div className="slot-header-banner slot-anim-1">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 shadow-lg shadow-purple-500/20">
              <span title="LayoutList"><LayoutList className="h-6 w-6 text-white" /></span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-orange-600 to-teal-600 bg-clip-text text-transparent">
                Slotting Optimization & Bin Assignment
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">ABC classification, pick-path optimization & ergonomic bin placement</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Total Bins", value: totalBins, icon: Grid2x2, cls: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
              { label: "Occupied", value: occupiedBins, icon: Package, cls: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
              { label: "Empty", value: emptyBins, icon: CheckCircle2, cls: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
              { label: "Utilization", value: `${avgUtilization}%`, icon: TrendingUp, cls: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
              { label: "Reassignments", value: totalReassignments, icon: ArrowRightLeft, cls: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400" },
              { label: "Incidents", value: totalIncidents, icon: AlertTriangle, cls: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
            ].map((b, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${b.cls} text-sm font-medium`}>
                <b.icon className="h-4 w-4" />
                <span className="font-semibold">{b.value}</span>
                <span className="text-xs opacity-70">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="overview" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 dark:data-[state=active]:bg-gray-700">Overview</TabsTrigger>
          <TabsTrigger value="abc" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 dark:data-[state=active]:bg-gray-700">ABC Classification</TabsTrigger>
          <TabsTrigger value="bins" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-teal-600 dark:data-[state=active]:bg-gray-700">Bin Assignment</TabsTrigger>
          <TabsTrigger value="pickpath" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700">Pick Path</TabsTrigger>
          <TabsTrigger value="ergonomic" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-rose-600 dark:data-[state=active]:bg-gray-700">Ergonomics</TabsTrigger>
        </TabsList>

        {/* ===== TAB 1: Overview ===== */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Total Bins", value: totalBins, sub: `across ${ZONES.length} zones`, cls: "slot-kpi-purple", icon: Grid2x2 },
              { title: "Utilization", value: `${avgUtilization}%`, sub: "avg fill rate", cls: "slot-kpi-orange", icon: TrendingUp },
              { title: "Empty Slots", value: emptyBins, sub: `${Math.round(emptyBins/totalBins*100)}% available`, cls: "slot-kpi-teal", icon: Package },
              { title: "Reassignments", value: pendingReassignments, sub: "pending/overdue", cls: "slot-kpi-rose", icon: ArrowRightLeft },
              { title: "Avg Picks/Hr", value: Math.round(pickPaths.reduce((a, p) => a + p.picksPerHour, 0) / pickPaths.length), sub: "across zones", cls: "slot-kpi-sky", icon: Zap },
              { title: "Incidents", value: totalIncidents, sub: "ergonomic alerts", cls: "slot-kpi-lime", icon: ShieldAlert },
            ].map((k, i) => (
              <div key={i} className={`slot-kpi-card ${k.cls} slot-anim-${i + 1}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{k.title}</span>
                  <k.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold">{k.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{k.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover-lift-sm slot-anim-5"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name.split("(")[0].trim()} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {zoneDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="hover-lift-sm slot-anim-6"><CardHeader><CardTitle className="text-base">Warehouse Utilization (%)</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={whUtilization}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-xs" /><YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="utilization" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Utilization %" />
                  <Line dataKey="target" stroke="#f97316" strokeDasharray="6 3" dot={false} name="Target (85%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="hover-lift-sm slot-anim-7"><CardHeader><CardTitle className="text-base">Zone Utilization vs Target</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={zoneUtilization}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-xs" /><YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip /><Legend />
                  <Bar dataKey="utilization" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Current %" />
                  <Line dataKey="target" stroke="#f97316" strokeDasharray="6 3" dot={false} name="Target (85%)" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="hover-lift-sm slot-anim-8"><CardHeader><CardTitle className="text-base">Slotting Efficiency Trend (12 Months)</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyTrends}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" className="text-xs" /><YAxis domain={[60, 100]} className="text-xs" />
                  <Tooltip /><Legend />
                  <Area type="monotone" dataKey="efficiency" fill="#8b5cf6" fillOpacity={0.2} stroke="#8b5cf6" name="Efficiency %" />
                  <Line type="monotone" dataKey="picksPerHour" stroke="#f97316" name="Picks/Hr" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>
        </TabsContent>

        {/* ===== TAB 2: ABC Classification ===== */}
        <TabsContent value="abc" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover-lift-sm slot-anim-1"><CardHeader><CardTitle className="text-base">ABC Class Distribution</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart><Pie data={abcDistribution} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {abcDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="hover-lift-sm slot-anim-2"><CardHeader><CardTitle className="text-base">Bin Status Overview</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart><Pie data={binStatusDist} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {binStatusDist.map((_, i) => <Cell key={i} fill={["#3b82f6", "#f59e0b", "#22c55e", "#8b5cf6", "#ef4444", "#ec4899"][i]} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>

          {/* ABC items per zone */}
          <Card className="hover-lift-sm slot-anim-3"><CardHeader><CardTitle className="text-base">ABC Items by Zone</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ZONES.map(z => ({
                name: `Zone ${z}`,
                A: bins.filter(b => b.zone === z && b.abc === "A").length,
                B: bins.filter(b => b.zone === z && b.abc === "B").length,
                C: bins.filter(b => b.zone === z && b.abc === "C").length,
              }))}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" className="text-xs" /><YAxis className="text-xs" />
                <Tooltip /><Legend />
                <Bar dataKey="A" stackId="abc" fill="#f59e0b" name="Class A (High Vel.)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="B" stackId="abc" fill="#3b82f6" name="Class B (Med Vel.)" />
                <Bar dataKey="C" stackId="abc" fill="#64748b" name="Class C (Low Vel.)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent></Card>

          {/* Reassignment queue */}
          <div className="slot-filter-bar">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search reassignment ID, SKU, product..." className="pl-9 h-9" value={searchReassign} onChange={e => setSearchReassign(e.target.value)} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="slot-data-table">
                <thead><tr>
                  <th>ID</th><th>Product / SKU</th><th>Current Bin</th><th>Current Zone</th>
                  <th>Recommended Bin</th><th>Target Zone</th><th>Reason</th>
                  <th>Savings</th><th>Priority</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {filteredReassignments.map((r, i) => (
                    <tr key={r.id} className={`slot-anim-${Math.min(i + 1, 12)}`}>
                      <td className="font-mono text-xs font-semibold">{r.id}</td>
                      <td><div className="font-medium text-sm">{r.product}</div><div className="text-xs text-gray-500">{r.sku}</div></td>
                      <td className="font-mono text-xs">{r.currentBin}</td>
                      <td>{zoneBadge(r.currentZone)}</td>
                      <td className="font-mono text-xs">{r.recommendedBin}</td>
                      <td>{zoneBadge(r.recommendedZone)}</td>
                      <td className="text-xs max-w-[200px] truncate">{r.reason}</td>
                      <td className="text-sm font-medium text-teal-600 dark:text-teal-400">{r.estSavingsMin} min</td>
                      <td>{priorityBadge(r.priority)}</td>
                      <td>{reassignStatusBadge(r.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB 3: Bin Assignment ===== */}
        <TabsContent value="bins" className="space-y-6">
          <div className="slot-filter-bar">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search bin ID, SKU, product..." className="pl-9 h-9" value={searchBin} onChange={e => setSearchBin(e.target.value)} />
            </div>
            <Select value={filterZone} onValueChange={setFilterZone}><SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Zone" /></SelectTrigger><SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {ZONES.map(z => <SelectItem key={z} value={z}>Zone {z} — {ZONE_LABELS[z]}</SelectItem>)}
            </SelectContent></Select>
            <Select value={filterBinStatus} onValueChange={setFilterBinStatus}><SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {BIN_STATUSES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
            </SelectContent></Select>
            <Select value={filterABC} onValueChange={setFilterABC}><SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="ABC Class" /></SelectTrigger><SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="A">Class A</SelectItem>
              <SelectItem value="B">Class B</SelectItem>
              <SelectItem value="C">Class C</SelectItem>
            </SelectContent></Select>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="slot-data-table">
                <thead><tr>
                  <th>Bin ID</th><th>Warehouse</th><th>Zone</th><th>Location</th>
                  <th>ABC</th><th>SKU / Product</th><th>Status</th>
                  <th>Utilization</th><th>Pick Freq</th><th>Last Pick</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {filteredBins.slice(0, 60).map((b, i) => (
                    <tr key={b.id} className={`slot-anim-${Math.min(i + 1, 12)}`}>
                      <td className="font-mono text-xs font-semibold">{b.id}</td>
                      <td className="text-xs">{b.warehouse.replace("WH-", "")}</td>
                      <td>{zoneBadge(b.zone)}</td>
                      <td className="font-mono text-xs">{b.aisle}-{b.rack}-L{b.level}-{b.position}</td>
                      <td>{abcBadge(b.abc)}</td>
                      <td><div className="font-medium text-sm">{b.product}</div><div className="text-xs text-gray-500">{b.sku}</div></td>
                      <td>{binStatusBadge(b.status)}</td>
                      <td><div className="flex items-center gap-2">{utilBar(b.utilization)}<span className="text-xs font-medium">{b.utilization}%</span></div></td>
                      <td className="text-xs font-medium">{b.pickFreq}/day</td>
                      <td className="text-xs text-gray-500">{b.lastPick}</td>
                      <td><Button size="sm" variant="ghost" className="press-scale h-8 w-8 p-0" onClick={() => setSelectedBin(b)}><span title="Eye"><Eye className="h-4 w-4 text-gray-500" /></span></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
              Showing {Math.min(60, filteredBins.length)} of {filteredBins.length} bins
            </div>
          </div>

          {/* Bin Detail Drawer */}
          {selectedBin && (
            <>
              <div className="slot-drawer-overlay" onClick={() => setSelectedBin(null)} />
              <div className="slot-drawer-panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">{selectedBin.id} — Bin Details</h3>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedBin(null)} className="press-scale h-8 w-8 p-0"><X className="h-4 w-4" /></Button>
                </div>

                <div className="slot-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-500" />Location</h4>
                  <div className="slot-info-grid">
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Warehouse</div><div className="text-sm font-medium mt-0.5">{selectedBin.warehouse.replace("WH-", "")}</div></div>
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Zone</div><div className="mt-0.5">{zoneBadge(selectedBin.zone)}</div></div>
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Aisle / Rack</div><div className="text-sm font-mono font-medium mt-0.5">{selectedBin.aisle} / {selectedBin.rack}</div></div>
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Level / Position</div><div className="text-sm font-medium mt-0.5">Level {selectedBin.level} / Pos {selectedBin.position}</div></div>
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Status</div><div className="mt-0.5">{binStatusBadge(selectedBin.status)}</div></div>
                    <div className="slot-info-item"><div className="text-xs text-gray-500">ABC Class</div><div className="mt-0.5">{abcBadge(selectedBin.abc)}</div></div>
                  </div>
                </div>

                <div className="slot-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Package className="h-4 w-4 text-orange-500" />Product</h4>
                  <div className="slot-info-grid">
                    <div className="slot-info-item"><div className="text-xs text-gray-500">SKU</div><div className="text-sm font-mono font-medium mt-0.5">{selectedBin.sku}</div></div>
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Product</div><div className="text-sm font-medium mt-0.5">{selectedBin.product}</div></div>
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Dimensions</div><div className="text-sm font-mono font-medium mt-0.5">{selectedBin.dimensions} cm</div></div>
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Bin Height</div><div className="text-sm font-medium mt-0.5">{selectedBin.heightCm} cm</div></div>
                  </div>
                </div>

                <div className="slot-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-teal-500" />Utilization & Weight</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Utilization</span><span className="font-semibold">{selectedBin.utilization}%</span></div>
                      <div className="slot-progress-bar"><div className={`slot-progress-fill ${selectedBin.utilization > 85 ? "slot-progress-red" : selectedBin.utilization > 60 ? "slot-progress-orange" : "slot-progress-teal"}`} style={{ width: `${selectedBin.utilization}%` }} /></div>
                    </div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Current Weight</span><span className="font-medium">{selectedBin.currentWeight} kg</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Max Weight Capacity</span><span className="font-medium">{selectedBin.maxWeight} kg</span></div>
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Weight Utilization</span><span className="font-semibold">{selectedBin.maxWeight > 0 ? Math.round(selectedBin.currentWeight / selectedBin.maxWeight * 100) : 0}%</span></div>
                      <div className="slot-progress-bar"><div className={`slot-progress-fill ${selectedBin.currentWeight / selectedBin.maxWeight > 0.85 ? "slot-progress-red" : "slot-progress-purple"}`} style={{ width: `${selectedBin.maxWeight > 0 ? Math.round(selectedBin.currentWeight / selectedBin.maxWeight * 100) : 0}%` }} /></div>
                    </div>
                  </div>
                </div>

                <div className="slot-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" />Pick Activity</h4>
                  <div className="slot-info-grid">
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Pick Frequency</div><div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">{selectedBin.pickFreq}/day</div></div>
                    <div className="slot-info-item"><div className="text-xs text-gray-500">Last Pick</div><div className="text-sm font-medium mt-0.5">{selectedBin.lastPick}</div></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bin Visual Grid per Zone */}
          <Card className="hover-lift-sm slot-anim-6"><CardHeader><CardTitle className="text-base">Bin Heatmap — Pick Frequency by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-4">
              {ZONES.map(z => (
                <div key={z}>
                  <div className="flex items-center gap-2 mb-2">
                    {zoneBadge(z)}
                    <span className="text-xs text-gray-500">{ZONE_LABELS[z]}</span>
                  </div>
                  <div className="slot-bin-grid">
                    {zoneGrids[z].map((b, i) => (
                      <div key={i} className={`slot-bin-cell ${heatClass(b.pickFreq)}`} onClick={() => setSelectedBin(b)}>
                        <span className="text-[10px] font-bold">{b.id.split("-")[1]}</span>
                        <span className="text-[9px] opacity-70">{b.pickFreq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#f0fdf4] border border-[#86efac]" />Low</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#dcfce7] border border-[#4ade80]" />Medium</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#fef08a] border border-[#facc15]" />High</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#fecaca] border border-[#f87171]" />Very High</div>
            </div>
          </CardContent></Card>
        </TabsContent>

        {/* ===== TAB 4: Pick Path ===== */}
        <TabsContent value="pickpath" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover-lift-sm slot-anim-1"><CardHeader><CardTitle className="text-base">Avg Travel Distance by Zone (m)</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pickPaths}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey={`Zone`} className="text-xs" /><YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="avgDistance" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Avg Distance (m)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="hover-lift-sm slot-anim-2"><CardHeader><CardTitle className="text-base">Picks per Hour by Zone</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pickPaths}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey={`Zone`} className="text-xs" /><YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="picksPerHour" fill="#f97316" radius={[6, 6, 0, 0]} name="Picks/Hour" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="hover-lift-sm slot-anim-3"><CardHeader><CardTitle className="text-base">Zone Efficiency Scores</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pickPaths} layout="vertical"><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" domain={[0, 100]} className="text-xs" /><YAxis type="category" dataKey={`zone`} width={60} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="efficiencyScore" fill="#14b8a6" radius={[0, 4, 4, 0]} name="Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="hover-lift-sm slot-anim-4"><CardHeader><CardTitle className="text-base">Travel Distance Trend (12 Months)</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" className="text-xs" /><YAxis className="text-xs" />
                  <Tooltip /><Legend />
                  <Area type="monotone" dataKey="travelDist" fill="#8b5cf6" fillOpacity={0.2} stroke="#8b5cf6" name="Avg Distance (m)" />
                  <Line type="monotone" dataKey="picksPerHour" stroke="#f97316" name="Picks/Hr" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>

          {/* Pick Path Performance Table */}
          <Card className="hover-lift-sm slot-anim-5"><CardHeader><CardTitle className="text-base">Zone Performance Summary</CardTitle></CardHeader><CardContent>
            <div className="overflow-x-auto">
              <table className="slot-data-table">
                <thead><tr>
                  <th>Path</th><th>Zone</th><th>Description</th>
                  <th>Avg Distance (m)</th><th>Avg Time (min)</th>
                  <th>Picks/Hour</th><th>Efficiency</th>
                </tr></thead>
                <tbody>
                  {pickPaths.map((p, i) => (
                    <tr key={p.pathId} className={`slot-anim-${Math.min(i + 1, 12)}`}>
                      <td className="font-mono text-xs font-semibold">{p.pathId}</td>
                      <td>{zoneBadge(p.zone)}</td>
                      <td className="text-sm">{ZONE_LABELS[p.zone]}</td>
                      <td className="font-medium text-sm">{p.avgDistance}m</td>
                      <td className="text-sm">{p.avgTime} min</td>
                      <td className="font-medium text-sm text-orange-600 dark:text-orange-400">{p.picksPerHour}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="slot-progress-bar w-20"><div className={`slot-progress-fill ${p.efficiencyScore > 80 ? "slot-progress-green" : p.efficiencyScore > 60 ? "slot-progress-amber" : "slot-progress-red"}`} style={{ width: `${p.efficiencyScore}%` }} /></div>
                          <span className="text-xs font-medium">{p.efficiencyScore}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </TabsContent>

        {/* ===== TAB 5: Ergonomics ===== */}
        <TabsContent value="ergonomic" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ergonomicData.map((e, i) => (
              <div key={i} className={`slot-kpi-card ${e.level === "optimal" ? "slot-kpi-teal" : e.level === "acceptable" ? "slot-kpi-orange" : "slot-kpi-rose"} slot-anim-${i + 1}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{e.label}</span>
                  {e.level === "optimal" ? <CheckCircle2 className="h-4 w-4 text-teal-500" /> : e.level === "acceptable" ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <ShieldAlert className="h-4 w-4 text-red-500" />}
                </div>
                <div className="text-2xl font-bold">{e.bins}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{e.heightZone}</div>
                <div className="mt-2">{ergoBadge(e.level)}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover-lift-sm slot-anim-6"><CardHeader><CardTitle className="text-base">Rack Height Profile — Ergonomic Zones</CardTitle></CardHeader><CardContent>
              <div className="space-y-1">
                {[...ergonomicData].reverse().map((e, i) => (
                  <div key={i} className={`slot-ergo-strip ${ergoStripCls(e.label)}`}>
                    <span className="flex-1 text-left">{e.heightZone}</span>
                    <span className="mx-3">{e.bins} bins</span>
                    <span>{e.avgWeightKg} kg avg</span>
                    {e.incidentCount > 5 && <span className="ml-2 text-[10px] font-bold">⚠ {e.incidentCount} incidents</span>}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#dcfce7]" />Optimal</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#fed7aa]" />Acceptable</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#fee2e2]" />Strained</span>
              </div>
            </CardContent></Card>

            <Card className="hover-lift-sm slot-anim-7"><CardHeader><CardTitle className="text-base">Avg Weight & Incidents by Height Zone</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={ergonomicData}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="label" className="text-xs" /><YAxis yAxisId="left" className="text-xs" /><YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip /><Legend />
                  <Bar yAxisId="left" dataKey="avgWeightKg" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Avg Weight (kg)" />
                  <Line yAxisId="right" type="monotone" dataKey="incidentCount" stroke="#f43f5e" name="Incidents" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>

          {/* Ergonomic Data Table */}
          <Card className="hover-lift-sm slot-anim-8"><CardHeader><CardTitle className="text-base">Ergonomic Assessment Detail</CardTitle></CardHeader><CardContent>
            <div className="overflow-x-auto">
              <table className="slot-data-table">
                <thead><tr>
                  <th>Height Zone</th><th>Bins</th><th>Items Stored</th>
                  <th>Avg Weight</th><th>Incidents</th><th>Assessment</th>
                  <th>Risk Level</th>
                </tr></thead>
                <tbody>
                  {ergonomicData.map((e, i) => (
                    <tr key={i} className={`slot-anim-${Math.min(i + 1, 12)}`}>
                      <td className="font-medium text-sm">{e.heightZone}</td>
                      <td className="font-medium">{e.bins}</td>
                      <td>{e.items.toLocaleString()}</td>
                      <td className="font-medium">{e.avgWeightKg} kg</td>
                      <td className={e.incidentCount > 8 ? "font-bold text-red-600 dark:text-red-400" : e.incidentCount > 3 ? "text-amber-600 dark:text-amber-400" : ""}>{e.incidentCount}</td>
                      <td>
                        <div className="slot-progress-bar w-24"><div className={`slot-progress-fill ${e.level === "optimal" ? "slot-progress-green" : e.level === "acceptable" ? "slot-progress-amber" : "slot-progress-red"}`} style={{ width: `${e.level === "optimal" ? 95 : e.level === "acceptable" ? 60 : 25}%` }} /></div>
                      </td>
                      <td>{ergoBadge(e.level)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
