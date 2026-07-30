"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Box, Search, Eye, X, TrendingUp, TrendingDown, Package, ShieldCheck,
  AlertTriangle, CheckCircle2, Clock, Award, Leaf, DollarSign, BarChart3,
  FileSearch, ClipboardCheck, IndianRupee, ArrowRightLeft, Recycle,
  ChevronRight, Filter, RefreshCw, PackageCheck, Layers, Beaker,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// ============================================================================
// Types
// ============================================================================
type PackagingType = "Corrugated Box" | "Stretch Wrap" | "Shrink Wrap" | "Bubble Wrap" | "Foam Insert" | "Pallet" | "Custom Crate";
type Material = "Corrugated" | "LDPE" | "HDPE" | "EPS Foam" | "Kraft Paper" | "Biodegradable";
type SpecStatus = "active" | "draft" | "deprecated" | "under_review";
type StockStatus = "in_stock" | "low_stock" | "critical" | "out_of_stock";
type ComplianceResult = "pass" | "fail" | "pending";
type Priority = "high" | "medium" | "low";
type OptStatus = "pending" | "implemented" | "rejected";
type AuditStatus = "current" | "overdue" | "upcoming";
type TestType = "burst" | "crush" | "vibration" | "drop" | "moisture" | "seal" | "print" | "dimension";

const WAREHOUSES = [
  "WH-Mumbai-Navi", "WH-Delhi-NCR", "WH-Chennai-Siruseri",
  "WH-Bangalore-Whitefield", "WH-Kolkata-Haldia", "WH-Hyderabad-Gachibowli",
] as const;

const PACKAGING_TYPES: PackagingType[] = [
  "Corrugated Box", "Stretch Wrap", "Shrink Wrap", "Bubble Wrap",
  "Foam Insert", "Pallet", "Custom Crate",
];

const MATERIALS: Material[] = ["Corrugated", "LDPE", "HDPE", "EPS Foam", "Kraft Paper", "Biodegradable"];

const SPEC_STATUSES: SpecStatus[] = ["active", "draft", "deprecated", "under_review"];

const PKG_TYPE_COLORS: Record<PackagingType, string> = {
  "Corrugated Box": "#f59e0b",
  "Stretch Wrap": "#3b82f6",
  "Shrink Wrap": "#6366f1",
  "Bubble Wrap": "#ec4899",
  "Foam Insert": "#64748b",
  Pallet: "#eab308",
  "Custom Crate": "#22c55e",
};

const MATERIAL_COLORS: Record<Material, string> = {
  Corrugated: "#f59e0b", LDPE: "#3b82f6", HDPE: "#6366f1",
  "EPS Foam": "#64748b", "Kraft Paper": "#eab308", Biodegradable: "#22c55e",
};

const STATUS_COLORS: Record<SpecStatus, string> = {
  active: "#22c55e", draft: "#f59e0b", deprecated: "#ef4444", under_review: "#3b82f6",
};

const BIS_STANDARDS = [
  "IS 1060", "IS 2508", "IS 9077", "IS 10171", "BIS FMCS", "FSSAI 2.1",
  "IS 6688", "IS 11901", "IS 15227", "IS 13326",
];

const TEST_TYPES: TestType[] = ["burst", "crush", "vibration", "drop", "moisture", "seal", "print", "dimension"];

const TEST_NAMES: Record<TestType, string> = {
  burst: "Burst Strength", crush: "Crush Test", vibration: "Vibration Test",
  drop: "Drop Test", moisture: "Moisture Barrier", seal: "Seal Integrity",
  print: "Print Quality", dimension: "Dimension Tolerance",
};

const INDIAN_PRODUCTS = [
  { name: "Basmati Rice 5kg", sku: "FD-RIC-001", cat: "Food" },
  { name: "Organic Turmeric 200g", sku: "FD-TRM-002", cat: "Food" },
  { name: "Premium Darjeeling Tea 500g", sku: "FD-TEA-003", cat: "Food" },
  { name: "RBD Coconut Oil 1L", sku: "FD-COC-004", cat: "Food" },
  { name: "Millet Flour Mix 2kg", sku: "FD-MLT-005", cat: "Food" },
  { name: "Paracetamol 500mg", sku: "PH-PAR-001", cat: "Pharma" },
  { name: "Vitamin D3 Capsules", sku: "PH-VTD-002", cat: "Pharma" },
  { name: "Cetirizine 10mg", sku: "PH-CET-003", cat: "Pharma" },
  { name: "ORS Sachets 100pk", sku: "PH-ORS-004", cat: "Pharma" },
  { name: "Ayurvedic Chyawanprash 500g", sku: "PH-CHY-005", cat: "Pharma" },
  { name: "LED Panel Light 2ft", sku: "EL-LED-001", cat: "Electronics" },
  { name: "USB-C Cable 1m", sku: "EL-USC-002", cat: "Electronics" },
  { name: "Bluetooth Speaker", sku: "EL-BTS-003", cat: "Electronics" },
  { name: "Smart Watch Band", sku: "EL-SWB-004", cat: "Electronics" },
  { name: "Power Bank 20000mAh", sku: "EL-PWB-005", cat: "Electronics" },
  { name: "Automotive Filter Kit", sku: "AU-FLT-001", cat: "Auto Parts" },
  { name: "Brake Pad Set", sku: "AU-BRK-002", cat: "Auto Parts" },
  { name: "Engine Oil 5L", sku: "AU-ENG-003", cat: "Auto Parts" },
  { name: "Wiper Blade Set", sku: "AU-WPR-004", cat: "Auto Parts" },
  { name: "Radiator Coolant 2L", sku: "AU-RAD-005", cat: "Auto Parts" },
  { name: "Hex Bolt M10x50", sku: "IN-BLT-001", cat: "Industrial" },
  { name: "Steel Bearing 6205", sku: "IN-BRG-002", cat: "Industrial" },
  { name: "PVC Pipe 2\" 4m", sku: "IN-PVC-003", cat: "Industrial" },
  { name: "Welding Rod E6013", sku: "IN-WLD-004", cat: "Industrial" },
  { name: "Wire Rope 10mm", sku: "IN-WRE-005", cat: "Industrial" },
];

const MATERIAL_NAMES = [
  "3-Ply Corrugated Sheet", "5-Ply Corrugated Board", "LDPE Film 50mu",
  "LDPE Film 100mu", "HDPE Container 500ml", "HDPE Drum 50L",
  "EPS Foam Block 50mm", "EPS Foam Sheet 20mm", "Kraft Paper 120gsm",
  "Kraft Paper 200gsm", "PLA Biodegradable Film", "Cornstarch Peanuts",
  "Corrugated Flute A", "Corrugated Flute C", "LDPE Shrink Film",
];

const MATERIAL_SUPPLIERS = [
  "Packwell India Pvt Ltd", "Corrupack Industries", "Shree Balaji Packaging",
  "Supreme Industries", "RK Flexible Pack", "EcoPack Solutions",
  "National Packaging Co", "Sealed Air India", "Uflex Ltd",
  "Polyplex Corporation", "Jindal Poly Films", "Aarti Industries",
];

const FIRST_NAMES = [
  "Arjun", "Priya", "Rahul", "Sneha", "Vikram", "Ananya", "Amit", "Kavya",
  "Rohit", "Divya", "Suresh", "Meera", "Nikhil", "Pooja", "Manish", "Ritu",
  "Deepak", "Shalini", "Kiran", "Anita", "Sanjay", "Lakshmi", "Vishal", "Sunita",
];
const LAST_NAMES = [
  "Sharma", "Patel", "Kumar", "Singh", "Gupta", "Reddy", "Iyer", "Nair",
  "Joshi", "Rao", "Mehta", "Verma", "Chopra", "Malhotra", "Bhat", "Deshmukh",
];

// ============================================================================
// Seeded Random
// ============================================================================
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
let _seed = 126126;
function rand(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return _seed / 2147483647;
}
function randInt(min: number, max: number): number { return Math.floor(rand() * (max - min + 1)) + min; }
function randFloat(min: number, max: number, dec = 1): number { return parseFloat((rand() * (max - min) + min).toFixed(dec)); }

// ============================================================================
// Mock Data Generation
// ============================================================================

interface PackagingSpec {
  id: string; product: string; sku: string; category: string;
  pkgType: PackagingType; material: Material;
  dimL: number; dimW: number; dimH: number;
  weight: number; volume: number;
  costMaterial: number; costLabor: number; costOverhead: number; costTotal: number;
  fillRate: number; warehouse: string;
  status: SpecStatus;
  shockResistance: number; moistureBarrier: number; tempRating: number;
  bisStandard: string; bisTestDate: string; bisResult: ComplianceResult; bisNextDue: string;
  recyclability: number; biodegradable: boolean; carbonFootprint: number;
  lastUpdated: string;
  changeHistory: { date: string; change: string; author: string }[];
}

function generateSpecs(): PackagingSpec[] {
  const specs: PackagingSpec[] = [];
  for (let i = 0; i < 150; i++) {
    const prod = pick(INDIAN_PRODUCTS);
    const pType = pick(PACKAGING_TYPES);
    const mat = pick(MATERIALS);
    const l = randInt(5, 120); const w = randInt(5, 80); const h = randInt(2, 60);
    const vol = (l * w * h) / 1000;
    const wt = randFloat(10, 2500, 0);
    const cMat = randFloat(0.5, 85);
    const cLab = randFloat(0.2, 25);
    const cOvh = randFloat(0.1, 15);
    const status = pick(SPEC_STATUSES);
    const std = pick(BIS_STANDARDS);
    const result = rand() > 0.12 ? (rand() > 0.05 ? "pass" as const : "pending" as const) : "fail" as const;
    const month = randInt(1, 12);
    const day = randInt(1, 28);
    const testDate = `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const nextDue = `2025-${String(Math.min(month + 6, 12)).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const changes: { date: string; change: string; author: string }[] = [];
    for (let c = 0; c < randInt(2, 5); c++) {
      const ch = pick([
        "Dimension updated for new product variant",
        "Material supplier changed",
        "Cost optimization applied",
        "BIS compliance re-certified",
        "Packaging redesign for better fill rate",
        "Switched to eco-friendly material",
        "Shock padding increased",
        "Label layout updated",
      ]);
      changes.push({
        date: `2024-${String(Math.max(1, month - c * 2)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`,
        change: ch,
        author: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      });
    }

    specs.push({
      id: `PKG-${String(i + 1).padStart(4, '0')}`,
      product: prod.name, sku: prod.sku, category: prod.cat,
      pkgType: pType, material: mat,
      dimL: l, dimW: w, dimH: h,
      weight: wt, volume: parseFloat(vol.toFixed(1)),
      costMaterial: cMat, costLabor: cLab, costOverhead: cOvh,
      costTotal: parseFloat((cMat + cLab + cOvh).toFixed(2)),
      fillRate: randInt(42, 98),
      warehouse: pick(WAREHOUSES),
      status,
      shockResistance: randInt(30, 98),
      moistureBarrier: randInt(25, 99),
      tempRating: randInt(20, 95),
      bisStandard: std, bisTestDate: testDate, bisResult: result, bisNextDue: nextDue,
      recyclability: randInt(40, 98),
      biodegradable: mat === "Biodegradable" || (mat === "Kraft Paper" && rand() > 0.4),
      carbonFootprint: randFloat(0.01, 2.5, 2),
      lastUpdated: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      changeHistory: changes,
    });
  }
  return specs;
}

interface MaterialItem {
  id: string; name: string; category: Material; supplier: string;
  warehouse: string; unit: string;
  stockQty: number; reorderLevel: number;
  unitCost: number; totalValue: number;
  leadTime: number; status: StockStatus; lastOrdered: string;
}

function generateMaterials(): MaterialItem[] {
  const items: MaterialItem[] = [];
  for (let i = 0; i < 80; i++) {
    const mat = pick(MATERIALS);
    const stock = randInt(10, 5000);
    const reorder = randInt(100, 1000);
    const status: StockStatus = stock > reorder * 2 ? "in_stock" : stock > reorder ? "low_stock" : stock > 0 ? "critical" : "out_of_stock";
    const unit = mat === "Corrugated" ? "sheets" : mat === "LDPE" || mat === "HDPE" ? "kg" : mat === "EPS Foam" ? "blocks" : mat === "Kraft Paper" ? "rolls" : "kg";
    const uCost = randFloat(0.5, 150);
    items.push({
      id: `MAT-${String(i + 1).padStart(4, '0')}`,
      name: pick(MATERIAL_NAMES), category: mat, supplier: pick(MATERIAL_SUPPLIERS),
      warehouse: pick(WAREHOUSES), unit,
      stockQty: stock, reorderLevel: reorder,
      unitCost: uCost, totalValue: parseFloat((stock * uCost).toFixed(2)),
      leadTime: randInt(3, 21), status,
      lastOrdered: `2024-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`,
    });
  }
  return items;
}

interface OptimizationRec {
  id: string; product: string;
  currentType: PackagingType; recommendedType: PackagingType;
  currentCost: number; recommendedCost: number;
  savingsPct: number; savingsAmount: number;
  priority: Priority; status: OptStatus; impactScore: number;
}

function generateOptimizations(): OptimizationRec[] {
  const recs: OptimizationRec[] = [];
  for (let i = 0; i < 20; i++) {
    const cur = pick(PACKAGING_TYPES);
    let rec = cur;
    while (rec === cur) rec = pick(PACKAGING_TYPES);
    const curCost = randFloat(5, 100);
    const recCost = randFloat(2, curCost * 0.95);
    const savPct = parseFloat(((1 - recCost / curCost) * 100).toFixed(1));
    recs.push({
      id: `OPT-${String(i + 1).padStart(4, '0')}`,
      product: pick(INDIAN_PRODUCTS).name,
      currentType: cur, recommendedType: rec,
      currentCost: curCost, recommendedCost: recCost,
      savingsPct: savPct, savingsAmount: parseFloat((curCost - recCost).toFixed(2)),
      priority: savPct > 25 ? "high" : savPct > 12 ? "medium" : "low",
      status: pick(["pending", "implemented", "rejected"] as OptStatus[]),
      impactScore: randInt(30, 98),
    });
  }
  return recs;
}

interface ComplianceAudit {
  id: string; specId: string; specName: string; standard: string;
  testType: TestType; lastTestDate: string;
  result: ComplianceResult; nextDue: string;
  assignedTo: string; status: AuditStatus;
}

function generateAudits(): ComplianceAudit[] {
  const audits: ComplianceAudit[] = [];
  for (let i = 0; i < 15; i++) {
    const result = rand() > 0.12 ? (rand() > 0.05 ? "pass" as const : "pending" as const) : "fail" as const;
    const status = result === "fail" ? "overdue" as AuditStatus : rand() > 0.5 ? "current" as AuditStatus : "upcoming" as AuditStatus;
    const m = randInt(1, 12); const d = randInt(1, 28);
    audits.push({
      id: `AUD-2024-${String(i + 1).padStart(3, '0')}`,
      specId: `PKG-${String(randInt(1, 150)).padStart(4, '0')}`,
      specName: pick(INDIAN_PRODUCTS).name,
      standard: pick(BIS_STANDARDS),
      testType: pick(TEST_TYPES),
      lastTestDate: `2024-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      result, nextDue: `2025-${String(Math.min(m + 6, 12)).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      assignedTo: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      status,
    });
  }
  return audits;
}

function generateMonthlyTrends() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m, i) => ({
    month: m,
    materialCost: parseFloat((45000 + randInt(-8000, 12000) + i * 500).toFixed(0)),
    laborCost: parseFloat((18000 + randInt(-3000, 5000) + i * 200).toFixed(0)),
    overhead: parseFloat((12000 + randInt(-2000, 4000)).toFixed(0)),
    identified: parseFloat((50000 + randInt(-10000, 20000) + i * 1500).toFixed(0)),
    realized: parseFloat((30000 + randInt(-8000, 12000) + i * 1000).toFixed(0)),
    complianceRate: parseFloat((82 + randInt(-8, 12) + i * 0.3).toFixed(1)),
    pkgVolume: randInt(800, 2500),
  }));
}

function generateSustainabilityRadar() {
  return [
    { axis: "Recyclability", value: 78 },
    { axis: "Material Efficiency", value: 85 },
    { axis: "Weight Optimization", value: 71 },
    { axis: "Biodegradable %", value: 56 },
    { axis: "Cost per Unit", value: 68 },
    { axis: "Compliance Score", value: 91 },
  ];
}

// ============================================================================
// Component
// ============================================================================
export default function PackagingStandardsView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchSpec, setSearchSpec] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterMaterial, setFilterMaterial] = useState("all");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStockStatus, setFilterStockStatus] = useState("all");
  const [searchMat, setSearchMat] = useState("");
  const [selectedSpec, setSelectedSpec] = useState<PackagingSpec | null>(null);

  const specs = useMemo(() => generateSpecs(), []);
  const materials = useMemo(() => generateMaterials(), []);
  const optimizations = useMemo(() => generateOptimizations(), []);
  const audits = useMemo(() => generateAudits(), []);
  const monthlyTrends = useMemo(() => generateMonthlyTrends(), []);
  const sustainabilityRadar = useMemo(() => generateSustainabilityRadar(), []);

  // --- Derived Stats ---
  const activeSpecs = specs.filter(s => s.status === "active").length;
  const avgCost = parseFloat((specs.reduce((a, s) => a + s.costTotal, 0) / specs.length).toFixed(2));
  const avgFillRate = Math.round(specs.reduce((a, s) => a + s.fillRate, 0) / specs.length);
  const ecoFriendly = Math.round(specs.filter(s => s.biodegradable || s.recyclability > 80).length / specs.length * 100);
  const pendingReviews = specs.filter(s => s.status === "under_review").length;
  const lowStockCount = materials.filter(m => m.status === "low_stock" || m.status === "critical").length;
  const totalMatValue = materials.reduce((a, m) => a + m.totalValue, 0);
  const passedAudits = audits.filter(a => a.result === "pass").length;
  const failedAudits = audits.filter(a => a.result === "fail").length;

  // --- Chart Data ---
  const typeDistribution = PACKAGING_TYPES.map(t => ({
    name: t, value: specs.filter(s => s.pkgType === t).length,
    color: PKG_TYPE_COLORS[t],
  }));

  const whVolumeData = WAREHOUSES.map(wh => ({
    name: wh.replace("WH-", ""),
    volume: specs.filter(s => s.warehouse === wh).length,
  }));

  const materialStockData = materials
    .slice(0, 15)
    .map(m => ({ name: m.name.substring(0, 18), current: m.stockQty, reorder: m.reorderLevel, fill: Math.round(m.stockQty / m.reorderLevel * 100) }))
    .sort((a, b) => b.current - a.current);

  const materialCatData = MATERIALS.map(m => ({
    name: m, value: materials.filter(mt => mt.category === m).length,
    color: MATERIAL_COLORS[m],
  }));

  const failureReasons = TEST_TYPES.map(t => ({
    name: TEST_NAMES[t],
    value: audits.filter(a => a.testType === t && a.result === "fail").length + randInt(0, 3),
  })).filter(r => r.value > 0);

  const whCostData = WAREHOUSES.map(wh => ({
    name: wh.replace("WH-", ""),
    costPerUnit: parseFloat((specs.filter(s => s.warehouse === wh).reduce((a, s) => a + s.costTotal, 0) / Math.max(1, specs.filter(s => s.warehouse === wh).length)).toFixed(2)),
  }));
  const avgLine = [{ name: "Avg", costPerUnit: avgCost }];

  const scatterData = specs.map(s => ({
    fillRate: s.fillRate, cost: s.costTotal, name: s.id,
  }));

  // --- Filtered Tables ---
  const filteredSpecs = useMemo(() => {
    return specs.filter(s => {
      if (searchSpec && !s.id.toLowerCase().includes(searchSpec.toLowerCase()) && !s.product.toLowerCase().includes(searchSpec.toLowerCase()) && !s.sku.toLowerCase().includes(searchSpec.toLowerCase())) return false;
      if (filterType !== "all" && s.pkgType !== filterType) return false;
      if (filterMaterial !== "all" && s.material !== filterMaterial) return false;
      if (filterWarehouse !== "all" && s.warehouse !== filterWarehouse) return false;
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      return true;
    });
  }, [specs, searchSpec, filterType, filterMaterial, filterWarehouse, filterStatus]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      if (searchMat && !m.name.toLowerCase().includes(searchMat.toLowerCase()) && !m.id.toLowerCase().includes(searchMat.toLowerCase())) return false;
      if (filterStockStatus !== "all" && m.status !== filterStockStatus) return false;
      return true;
    });
  }, [materials, searchMat, filterStockStatus]);

  // --- Badge Helpers ---
  const pkgTypeBadge = (t: PackagingType) => {
    const cls: Record<PackagingType, string> = {
      "Corrugated Box": "pkg-badge-corrugated", "Stretch Wrap": "pkg-badge-stretch-wrap",
      "Shrink Wrap": "pkg-badge-shrink-wrap", "Bubble Wrap": "pkg-badge-bubble-wrap",
      "Foam Insert": "pkg-badge-foam-insert", "Pallet": "pkg-badge-pallet",
      "Custom Crate": "pkg-badge-custom-crate",
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[t]}`}>{t}</span>;
  };

  const materialBadge = (m: Material) => {
    const cls: Record<Material, string> = {
      Corrugated: "pkg-badge-corrugated-mat", LDPE: "pkg-badge-ldpe", HDPE: "pkg-badge-hdpe",
      "EPS Foam": "pkg-badge-eps-foam", "Kraft Paper": "pkg-badge-kraft-paper", Biodegradable: "pkg-badge-biodegradable",
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[m]}`}>{m}</span>;
  };

  const statusBadge = (s: SpecStatus) => {
    const cls: Record<SpecStatus, string> = { active: "pkg-badge-active", draft: "pkg-badge-draft", deprecated: "pkg-badge-deprecated", under_review: "pkg-badge-under-review" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[s]}`}>{s.replace("_", " ")}</span>;
  };

  const stockBadge = (s: StockStatus) => {
    const cls: Record<StockStatus, string> = { in_stock: "pkg-badge-in-stock", low_stock: "pkg-badge-low-stock", critical: "pkg-badge-critical", out_of_stock: "pkg-badge-out-of-stock" };
    const labels: Record<StockStatus, string> = { in_stock: "In Stock", low_stock: "Low Stock", critical: "Critical", out_of_stock: "Out of Stock" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[s]}`}>{labels[s]}</span>;
  };

  const complianceBadge = (r: ComplianceResult) => {
    const cls: Record<ComplianceResult, string> = { pass: "pkg-badge-pass", fail: "pkg-badge-fail", pending: "pkg-badge-pending-result" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[r]}`}>{r.toUpperCase()}</span>;
  };

  const priorityBadge = (p: Priority) => {
    const cls: Record<Priority, string> = { high: "pkg-badge-high-priority", medium: "pkg-badge-medium-priority", low: "pkg-badge-low-priority" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[p]}`}>{p.toUpperCase()}</span>;
  };

  const optStatusBadge = (s: OptStatus) => {
    const cls: Record<OptStatus, string> = { pending: "pkg-badge-opt-pending", implemented: "pkg-badge-opt-implemented", rejected: "pkg-badge-opt-rejected" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[s]}`}>{s}</span>;
  };

  const auditStatusBadge = (s: AuditStatus) => {
    const cls: Record<AuditStatus, string> = { current: "pkg-badge-current-audit", overdue: "pkg-badge-overdue-audit", upcoming: "pkg-badge-upcoming-audit" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[s]}`}>{s.toUpperCase()}</span>;
  };

  const testTypeBadge = (t: TestType) => {
    const cls: Record<TestType, string> = {
      burst: "pkg-badge-burst", crush: "pkg-badge-crush", vibration: "pkg-badge-vibration",
      drop: "pkg-badge-drop", moisture: "pkg-badge-moisture", seal: "pkg-badge-seal",
      print: "pkg-badge-print", dimension: "pkg-badge-dimension",
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls[t]}`}>{TEST_NAMES[t]}</span>;
  };

  const fillRateBar = (rate: number) => {
    const cls = rate > 80 ? "pkg-fill-rate-high" : rate > 50 ? "pkg-fill-rate-mid" : "pkg-fill-rate-low";
    return (
      <div className="pkg-progress-bar w-16 h-1.5">
        <div className={`pkg-progress-fill ${cls}`} style={{ width: `${rate}%` }} />
      </div>
    );
  };

  const protectionBar = (val: number, label: string) => {
    const cls = val > 80 ? "pkg-progress-green" : val > 50 ? "pkg-progress-amber" : "pkg-progress-red";
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs"><span className="text-gray-500 dark:text-gray-400">{label}</span><span className="font-medium">{val}%</span></div>
        <div className="pkg-progress-bar"><div className={`pkg-progress-fill ${cls}`} style={{ width: `${val}%` }} /></div>
      </div>
    );
  };

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="p-6 space-y-6">
      {/* ===== Header ===== */}
      <div className="pkg-header-banner pkg-anim-1">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-cyan-500 shadow-lg shadow-rose-500/20">
              <span title="Box"><Box className="h-6 w-6 text-white" /></span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-cyan-600 to-lime-600 bg-clip-text text-transparent">
                Packaging Standards & Specifications
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">BIS/IS compliance, cost optimization & sustainability tracking</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Total Specs", value: specs.length, icon: Package, cls: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
              { label: "Active", value: activeSpecs, icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
              { label: "Avg Cost", value: `₹${avgCost}`, icon: IndianRupee, cls: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" },
              { label: "Fill Rate", value: `${avgFillRate}%`, icon: TrendingUp, cls: "bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400" },
              { label: "Eco-Friendly", value: `${ecoFriendly}%`, icon: Leaf, cls: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
              { label: "Pending Review", value: pendingReviews, icon: Clock, cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
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
          <TabsTrigger value="overview" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-rose-600 dark:data-[state=active]:bg-gray-700">Overview</TabsTrigger>
          <TabsTrigger value="specs" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-cyan-600 dark:data-[state=active]:bg-gray-700">Specs Library</TabsTrigger>
          <TabsTrigger value="materials" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-lime-600 dark:data-[state=active]:bg-gray-700">Materials</TabsTrigger>
          <TabsTrigger value="optimization" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-gray-700">Cost Optimization</TabsTrigger>
          <TabsTrigger value="compliance" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600 dark:data-[state=active]:bg-gray-700">BIS/IS Compliance</TabsTrigger>
        </TabsList>

        {/* ===== TAB 1: Overview ===== */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pkg-kpi-grid-6">
            {[
              { title: "Total Specs", value: specs.length, sub: "across 7 types", cls: "pkg-kpi-rose", icon: Package },
              { title: "Active Packaging", value: activeSpecs, sub: `${specs.filter(s => s.status === "draft").length} drafts`, cls: "pkg-kpi-cyan", icon: CheckCircle2 },
              { title: "Cost/Unit", value: `₹${avgCost}`, sub: "avg all specs", cls: "pkg-kpi-lime", icon: IndianRupee },
              { title: "Avg Fill Rate", value: `${avgFillRate}%`, sub: "across all SKUs", cls: "pkg-kpi-amber", icon: TrendingUp },
              { title: "Eco-Friendly", value: `${ecoFriendly}%`, sub: "bio/recyclable", cls: "pkg-kpi-indigo", icon: Leaf },
              { title: "Pending Reviews", value: pendingReviews, sub: "awaiting approval", cls: "pkg-kpi-emerald", icon: Clock },
            ].map((k, i) => (
              <div key={i} className={`pkg-kpi-card ${k.cls} pkg-anim-${i + 1}`}>
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
            <Card className="pkg-anim-5"><CardHeader><CardTitle className="text-base">Packaging Type Distribution</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart><Pie data={typeDistribution} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {typeDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="pkg-anim-6"><CardHeader><CardTitle className="text-base">Material Cost Trend (12 Months)</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={monthlyTrends}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" className="text-xs" /><YAxis className="text-xs" />
                  <Tooltip /><Legend />
                  <Area type="monotone" dataKey="materialCost" fill="#f43f5e" fillOpacity={0.2} stroke="#f43f5e" name="Material Cost" />
                  <Line type="monotone" dataKey="laborCost" stroke="#06b6d4" name="Labor Cost" strokeWidth={2} />
                  <Bar dataKey="overhead" fill="#84cc16" name="Overhead" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="pkg-anim-7"><CardHeader><CardTitle className="text-base">Sustainability Score (Radar)</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={sustainabilityRadar}><PolarGrid className="stroke-gray-200 dark:stroke-gray-700" /><PolarAngleAxis dataKey="axis" className="text-xs" /><PolarRadiusAxis className="text-xs" domain={[0, 100]} />
                  <Radar name="Score" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="pkg-anim-8"><CardHeader><CardTitle className="text-base">Warehouse Packaging Volume</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={whVolumeData}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-xs" /><YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>
        </TabsContent>

        {/* ===== TAB 2: Specs Library ===== */}
        <TabsContent value="specs" className="space-y-6">
          <div className="pkg-filter-bar">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by spec ID, product, SKU..." className="pl-9 h-9" value={searchSpec} onChange={e => setSearchSpec(e.target.value)} />
            </div>
            <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {PACKAGING_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent></Select>
            <Select value={filterMaterial} onValueChange={setFilterMaterial}><SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Material" /></SelectTrigger><SelectContent>
              <SelectItem value="all">All Materials</SelectItem>
              {MATERIALS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent></Select>
            <Select value={filterWarehouse} onValueChange={setFilterWarehouse}><SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Warehouse" /></SelectTrigger><SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {WAREHOUSES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent></Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {SPEC_STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
            </SelectContent></Select>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="pkg-data-table">
                <thead><tr>
                  <th>Spec ID</th><th>Product / SKU</th><th>Type</th><th>Material</th>
                  <th>Dimensions</th><th>Weight</th><th>Cost/Unit</th><th>Fill Rate</th>
                  <th>Warehouse</th><th>Status</th><th>Updated</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {filteredSpecs.slice(0, 50).map((s, i) => (
                    <tr key={s.id} className={`pkg-anim-${Math.min(i + 1, 12)}`}>
                      <td className="font-mono text-xs font-semibold">{s.id}</td>
                      <td><div className="font-medium text-sm">{s.product}</div><div className="text-xs text-gray-500">{s.sku}</div></td>
                      <td>{pkgTypeBadge(s.pkgType)}</td>
                      <td>{materialBadge(s.material)}</td>
                      <td className="text-xs font-mono">{s.dimL}×{s.dimW}×{s.dimH}cm</td>
                      <td className="text-xs">{s.weight}g</td>
                      <td className="font-medium text-sm">₹{s.costTotal}</td>
                      <td><div className="flex items-center gap-2">{fillRateBar(s.fillRate)}<span className="text-xs font-medium">{s.fillRate}%</span></div></td>
                      <td className="text-xs">{s.warehouse.replace("WH-", "")}</td>
                      <td>{statusBadge(s.status)}</td>
                      <td className="text-xs text-gray-500">{s.lastUpdated}</td>
                      <td><Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedSpec(s)}><span title="Eye"><Eye className="h-4 w-4 text-gray-500" /></span></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
              Showing {Math.min(50, filteredSpecs.length)} of {filteredSpecs.length} specifications
            </div>
          </div>

          {/* Spec Detail Drawer */}
          {selectedSpec && (
            <>
              <div className="pkg-drawer-overlay" onClick={() => setSelectedSpec(null)} />
              <div className="pkg-drawer-panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">{selectedSpec.id} — Spec Details</h3>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedSpec(null)} className="h-8 w-8 p-0"><X className="h-4 w-4" /></Button>
                </div>

                {/* Status Banner */}
                <div className={`pkg-drawer-status-banner pkg-drawer-banner-${selectedSpec.status}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {statusBadge(selectedSpec.status)}
                      <span className="text-sm font-medium">{selectedSpec.product}</span>
                    </div>
                    <span className="text-xs text-gray-500">{selectedSpec.sku}</span>
                  </div>
                </div>

                {/* Product & Packaging Info */}
                <div className="pkg-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Package className="h-4 w-4 text-rose-500" />Packaging Details</h4>
                  <div className="pkg-info-grid">
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Type</div><div className="text-sm font-medium mt-0.5">{pkgTypeBadge(selectedSpec.pkgType)}</div></div>
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Material</div><div className="text-sm font-medium mt-0.5">{materialBadge(selectedSpec.material)}</div></div>
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Dimensions</div><div className="text-sm font-mono font-medium mt-0.5">{selectedSpec.dimL}×{selectedSpec.dimW}×{selectedSpec.dimH} cm</div></div>
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Weight</div><div className="text-sm font-medium mt-0.5">{selectedSpec.weight}g</div></div>
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Volume</div><div className="text-sm font-medium mt-0.5">{selectedSpec.volume}L</div></div>
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Fill Rate</div><div className="flex items-center gap-2 mt-0.5">{fillRateBar(selectedSpec.fillRate)}<span className="text-sm font-medium">{selectedSpec.fillRate}%</span></div></div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="pkg-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><IndianRupee className="h-4 w-4 text-cyan-500" />Cost Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Material</span><span className="font-medium">₹{selectedSpec.costMaterial}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Labor</span><span className="font-medium">₹{selectedSpec.costLabor}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Overhead</span><span className="font-medium">₹{selectedSpec.costOverhead}</span></div>
                    <Separator />
                    <div className="flex justify-between text-sm font-semibold"><span>Total Cost/Unit</span><span className="text-rose-600">₹{selectedSpec.costTotal}</span></div>
                  </div>
                </div>

                {/* Protection Levels */}
                <div className="pkg-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-lime-600" />Protection Levels</h4>
                  <div className="space-y-3">
                    {protectionBar(selectedSpec.shockResistance, "Shock Resistance")}
                    {protectionBar(selectedSpec.moistureBarrier, "Moisture Barrier")}
                    {protectionBar(selectedSpec.tempRating, "Temperature Rating")}
                  </div>
                </div>

                {/* BIS Compliance */}
                <div className="pkg-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-amber-500" />BIS/IS Compliance</h4>
                  <div className="pkg-info-grid">
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Standard</div><div className="text-sm font-semibold mt-0.5">{selectedSpec.bisStandard}</div></div>
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Test Date</div><div className="text-sm font-medium mt-0.5">{selectedSpec.bisTestDate}</div></div>
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Result</div><div className="mt-0.5">{complianceBadge(selectedSpec.bisResult)}</div></div>
                    <div className="pkg-info-item"><div className="text-xs text-gray-500">Next Due</div><div className="text-sm font-medium mt-0.5">{selectedSpec.bisNextDue}</div></div>
                  </div>
                </div>

                {/* Sustainability */}
                <div className="pkg-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Leaf className="h-4 w-4 text-green-500" />Sustainability</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Recyclability</span><span className="font-medium">{selectedSpec.recyclability}%</span></div>
                    <div className="pkg-progress-bar"><div className={`pkg-progress-fill ${selectedSpec.recyclability > 70 ? "pkg-progress-green" : "pkg-progress-amber"}`} style={{ width: `${selectedSpec.recyclability}%` }} /></div>
                    <div className="flex justify-between text-sm mt-2"><span className="text-gray-500">Biodegradable</span><Badge variant={selectedSpec.biodegradable ? "default" : "secondary"} className="text-xs">{selectedSpec.biodegradable ? "Yes" : "No"}</Badge></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Carbon Footprint</span><span className="font-medium">{selectedSpec.carbonFootprint} kg CO2/unit</span></div>
                  </div>
                </div>

                {/* Change History Timeline */}
                <div className="pkg-section-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-indigo-500" />Change History</h4>
                  <div className="space-y-0">
                    {selectedSpec.changeHistory.map((ch, i) => (
                      <div key={i} className="pkg-timeline-item">
                        <div className="pkg-timeline-dot" />
                        <div className="text-sm font-medium">{ch.change}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{ch.author} — {ch.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* ===== TAB 3: Material Inventory ===== */}
        <TabsContent value="materials" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pkg-kpi-grid-6">
            {[
              { title: "Total SKUs", value: materials.length, cls: "pkg-kpi-cyan", icon: Layers },
              { title: "Low Stock", value: lowStockCount, cls: "pkg-kpi-amber", icon: AlertTriangle },
              { title: "Total Value", value: `₹${(totalMatValue / 1000).toFixed(0)}K`, cls: "pkg-kpi-rose", icon: IndianRupee },
              { title: "Avg Lead Time", value: `${Math.round(materials.reduce((a, m) => a + m.leadTime, 0) / materials.length)}d`, cls: "pkg-kpi-indigo", icon: Clock },
              { title: "Pending Orders", value: materials.filter(m => m.status === "low_stock" || m.status === "critical").length, cls: "pkg-kpi-lime", icon: Package },
              { title: "Quality Pass %", value: `${Math.round(materials.filter(m => m.status !== "out_of_stock").length / materials.length * 100)}%`, cls: "pkg-kpi-emerald", icon: CheckCircle2 },
            ].map((k, i) => (
              <div key={i} className={`pkg-kpi-card ${k.cls} pkg-anim-${i + 1}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{k.title}</span>
                  <k.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold">{k.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="pkg-anim-5"><CardHeader><CardTitle className="text-base">Material Stock Levels (Top 15)</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={materialStockData} layout="vertical"><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" className="text-xs" /><YAxis type="category" dataKey="name" width={120} className="text-xs" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="current" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Current Stock" />
                  <Bar dataKey="reorder" fill="#fbbf24" radius={[0, 4, 4, 0]} name="Reorder Level" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="pkg-anim-6"><CardHeader><CardTitle className="text-base">Material Category Distribution</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart><Pie data={materialCatData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {materialCatData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>

          {/* Material Table */}
          <div className="pkg-filter-bar">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search materials..." className="pl-9 h-9" value={searchMat} onChange={e => setSearchMat(e.target.value)} />
            </div>
            <Select value={filterStockStatus} onValueChange={setFilterStockStatus}><SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Stock Status" /></SelectTrigger><SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent></Select>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="pkg-data-table">
                <thead><tr>
                  <th>ID</th><th>Material</th><th>Category</th><th>Supplier</th>
                  <th>Warehouse</th><th>Unit</th><th>Stock</th><th>Reorder</th>
                  <th>Unit Cost</th><th>Total Value</th><th>Lead Time</th><th>Status</th><th>Last Ordered</th>
                </tr></thead>
                <tbody>
                  {filteredMaterials.slice(0, 40).map((m, i) => (
                    <tr key={m.id} className={`pkg-anim-${Math.min(i + 1, 12)}`}>
                      <td className="font-mono text-xs font-semibold">{m.id}</td>
                      <td className="text-sm font-medium">{m.name}</td>
                      <td>{materialBadge(m.category)}</td>
                      <td className="text-xs">{m.supplier}</td>
                      <td className="text-xs">{m.warehouse.replace("WH-", "")}</td>
                      <td className="text-xs text-gray-500">{m.unit}</td>
                      <td className="font-medium text-sm">{m.stockQty.toLocaleString()}</td>
                      <td className="text-xs text-gray-500">{m.reorderLevel.toLocaleString()}</td>
                      <td className="text-sm">₹{m.unitCost}</td>
                      <td className="text-sm font-medium">₹{m.totalValue.toLocaleString()}</td>
                      <td className="text-xs">{m.leadTime}d</td>
                      <td>{stockBadge(m.status)}</td>
                      <td className="text-xs text-gray-500">{m.lastOrdered}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
              Showing {Math.min(40, filteredMaterials.length)} of {filteredMaterials.length} materials
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB 4: Cost Optimization ===== */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="pkg-anim-1"><CardHeader><CardTitle className="text-base">Cost Savings Opportunity (12 Months)</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" className="text-xs" /><YAxis className="text-xs" />
                  <Tooltip /><Legend />
                  <Area type="monotone" dataKey="identified" fill="#6366f1" fillOpacity={0.2} stroke="#6366f1" name="Identified Savings" />
                  <Line type="monotone" dataKey="realized" stroke="#10b981" name="Realized Savings" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="pkg-anim-2"><CardHeader><CardTitle className="text-base">Packaging Cost per Unit by Warehouse</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={whCostData}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-xs" /><YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="costPerUnit" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Cost/Unit" />
                  <Line dataKey="costPerUnit" data={avgLine} stroke="#06b6d4" strokeDasharray="6 3" dot={false} name="Average" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card className="pkg-anim-3"><CardHeader><CardTitle className="text-base">Fill Rate vs Material Cost</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="fillRate" name="Fill Rate %" className="text-xs" /><YAxis dataKey="cost" name="Cost ₹" className="text-xs" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={scatterData} fill="#84cc16" fillOpacity={0.5} />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>

          {/* Optimization Table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="pkg-data-table">
                <thead><tr>
                  <th>ID</th><th>Product</th><th>Current Type</th><th>Recommended</th>
                  <th>Current Cost</th><th>New Cost</th><th>Savings %</th><th>Savings ₹</th>
                  <th>Priority</th><th>Status</th><th>Impact</th>
                </tr></thead>
                <tbody>
                  {optimizations.map((o, i) => (
                    <tr key={o.id} className={`pkg-anim-${Math.min(i + 1, 12)}`}>
                      <td className="font-mono text-xs font-semibold">{o.id}</td>
                      <td className="text-sm font-medium">{o.product}</td>
                      <td>{pkgTypeBadge(o.currentType)}</td>
                      <td>{pkgTypeBadge(o.recommendedType)}</td>
                      <td className="text-sm">₹{o.currentCost}</td>
                      <td className="text-sm font-medium text-emerald-600 dark:text-emerald-400">₹{o.recommendedCost}</td>
                      <td className="pkg-savings-positive text-sm">{o.savingsPct}%</td>
                      <td className="pkg-savings-positive text-sm font-medium">₹{o.savingsAmount}</td>
                      <td>{priorityBadge(o.priority)}</td>
                      <td>{optStatusBadge(o.status)}</td>
                      <td><div className="pkg-progress-bar w-12"><div className={`pkg-progress-fill ${o.impactScore > 70 ? "pkg-progress-green" : o.impactScore > 40 ? "pkg-progress-amber" : "pkg-progress-red"}`} style={{ width: `${o.impactScore}%` }} /></div><span className="text-xs ml-1">{o.impactScore}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB 5: BIS/IS Compliance ===== */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pkg-kpi-grid-6">
            {[
              { title: "Total Tests", value: audits.length, cls: "pkg-kpi-indigo", icon: Beaker },
              { title: "Passed", value: passedAudits, cls: "pkg-kpi-emerald", icon: CheckCircle2 },
              { title: "Failed", value: failedAudits, cls: "pkg-kpi-rose", icon: AlertTriangle },
              { title: "Pending", value: audits.filter(a => a.result === "pending").length, cls: "pkg-kpi-amber", icon: Clock },
            ].map((k, i) => (
              <div key={i} className={`pkg-kpi-card ${k.cls} pkg-anim-${i + 1}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{k.title}</span>
                  <k.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold">{k.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="pkg-anim-5"><CardHeader><CardTitle className="text-base">Compliance Rate Trend (12 Months)</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyTrends}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" className="text-xs" /><YAxis domain={[60, 100]} className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="complianceRate" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b" }} name="Compliance %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent></Card>

            {failureReasons.length > 0 && (
              <Card className="pkg-anim-6"><CardHeader><CardTitle className="text-base">Test Failure Reasons</CardTitle></CardHeader><CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart><Pie data={failureReasons} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {failureReasons.map((_, i) => <Cell key={i} fill={["#f43f5e", "#06b6d4", "#84cc16", "#f59e0b", "#6366f1", "#ec4899", "#64748b", "#eab308"][i % 8]} />)}
                  </Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </CardContent></Card>
            )}
          </div>

          {/* Compliance Audit Table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="pkg-data-table">
                <thead><tr>
                  <th>Audit ID</th><th>Spec</th><th>Product</th><th>Standard</th>
                  <th>Test Type</th><th>Last Test</th><th>Result</th><th>Next Due</th>
                  <th>Assigned To</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {audits.map((a, i) => (
                    <tr key={a.id} className={`pkg-anim-${Math.min(i + 1, 12)}`}>
                      <td className="font-mono text-xs font-semibold">{a.id}</td>
                      <td className="text-xs font-mono">{a.specId}</td>
                      <td className="text-sm font-medium">{a.specName}</td>
                      <td className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{a.standard}</td>
                      <td>{testTypeBadge(a.testType)}</td>
                      <td className="text-xs text-gray-500">{a.lastTestDate}</td>
                      <td>{complianceBadge(a.result)}</td>
                      <td className="text-xs">{a.nextDue}</td>
                      <td className="text-xs">{a.assignedTo}</td>
                      <td>{auditStatusBadge(a.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
