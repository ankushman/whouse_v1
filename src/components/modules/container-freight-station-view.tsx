"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  Container, Ship, FileCheck, Stamp, Globe, Clock, CheckCircle2, XCircle,
  AlertTriangle, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Search, Filter, Eye, Zap, Activity, Target, Package, BarChart3,
  IndianRupee, Timer, FileText, ShieldCheck, Info, CircleDot, RefreshCw,
  ChevronRight, Truck, ClipboardList, Warehouse, MapPin, Boxes, StampIcon,
  Anchor, Receipt, FileBadge, Archive, Scale, Globe2, Luggage,
  BadgeCheck, ArrowRightLeft, PackageSearch, CalendarDays, BadgeInfo,
  Forklift, Palette,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
type CfsStatus = "received" | "unloading" | "inspection" | "customs_hold" | "cleared" | "loading" | "dispatched" | "rejected";
type ContainerType = "fcl_20" | "fcl_40" | "fcl_40hc" | "lcl" | "air_cargo" | "break_bulk";
type MovementType = "import" | "export" | "transit";
type DocStatus = "pending" | "submitted" | "approved" | "rejected" | "expired";
type CustomsRegime = "sea_import" | "sea_export" | "air_import" | "air_export" | "bonded" | "exbonded";

const WAREHOUSES = [
  "Mumbai Central Hub", "Delhi NCR Facility", "Chennai Gateway",
  "Kolkata Distribution", "Bangalore South Hub", "Hyderabad Depot",
] as const;
type Warehouse = typeof WAREHOUSES[number];

interface ContainerRecord {
  id: string;
  containerNumber: string;
  size: ContainerType;
  movement: MovementType;
  warehouse: string;
  status: CfsStatus;
  arrivalDate: number;
  departureDate: number | null;
  detentionDays: number;
  freeDaysRemaining: number;
  grossWeight: number;
  cargoWeight: number;
  packages: number;
  lineItems: number;
  value: number;
  shipper: string;
  consignee: string;
  vessel: string;
  voyage: string;
  pol: string;
  pod: string;
  shippingLine: string;
  blNumber: string;
  customsRegime: CustomsRegime;
  beNumber: string;
  ieNumber: string;
  dutyAmount: number;
  dutyStatus: "paid" | "pending" | "exempted";
  sealNumber: string;
  damageFlag: boolean;
  hazmatFlag: boolean;
  temperatureFlag: boolean;
  oogFlag: boolean;
  notes: string;
}

interface CustomsDoc {
  id: string;
  containerId: string;
  docType: string;
  docName: string;
  status: DocStatus;
  submittedDate: number | null;
  approvedDate: number | null;
  expiryDate: number | null;
  filedBy: string;
  remarks: string;
}

interface SealRecord {
  id: string;
  containerId: string;
  sealNumber: string;
  sealType: string;
  appliedDate: number;
  verifiedBy: string;
  status: "intact" | "broken" | "replaced";
  location: string;
  photoUrl: string | null;
}

interface StorageEntry {
  id: string;
  containerId: string;
  warehouse: string;
  zone: string;
  block: string;
  position: string;
  entryDate: number;
  storageDays: number;
  dailyRate: number;
  totalCharge: number;
  freeStorageUsed: number;
  freeStorageTotal: number;
}

// ============================================================================
// Seeded Random & Data
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateData() {
  const rand = seededRandom(121121);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
  const pickIdx = <T,>(arr: readonly T[]): number => Math.floor(rand() * arr.length);
  const now = Date.now();
  const day = 86400000;
  const hour = 3600000;

  const sizes: ContainerType[] = ["fcl_20", "fcl_40", "fcl_40hc", "lcl", "air_cargo", "break_bulk"];
  const movements: MovementType[] = ["import", "export", "transit"];
  const statuses: CfsStatus[] = ["received", "unloading", "inspection", "customs_hold", "cleared", "loading", "dispatched", "rejected"];
  const regimes: CustomsRegime[] = ["sea_import", "sea_export", "air_import", "air_export", "bonded", "exbonded"];
  const shippers = ["Maersk Line India", "MSC India", "CMA CGM India", "Hapag-Lloyd India", "COSCO Shipping", "Evergreen Marine", "ONE Line", "Yang Ming", "ZIM Integrated", "PIL India"];
  const consignees = ["Tata Steel Ltd", "Reliance Industries", "Mahindra Logistics", "TVS Supply Chain", "Allcargo Logistics", "Blue Dart Express", "DHL Supply Chain", "FedEx India", "Delhivery", "Xpressbee"];
  const vessels = ["MV Maersk Elba", "MSC Fantasia", "CMA CGM Marco Polo", "Hapag-Lloyd Berlin", "COSCO Universe", "Ever Given", "ONE Harmony", "Yang Ming Unity", "ZIM Galaxy", "PIL Pioneer"];
  const ports = ["Nhava Sheva (JNPT)", "Mundra Port", "Chennai Port", "Kolkata (Haldia)", "Cochin Port", "Visakhapatnam", "Tuticorin (VOCP)", "Kandla Port", "Hazira Port", "Mormugao"];
  const docTypes = ["Bill of Entry", "Shipping Bill", "Commercial Invoice", "Packing List", "Certificate of Origin", "Phyto Certificate", "Fumigation Cert", "Insurance Policy", "IGM (Import General Manifest)", "EGM (Export General Manifest)", "LC (Letter of Credit)", "HS Code Declaration", "GST E-Way Bill", "ITC (HS) Classification", "Customs Bond"];
  const sealTypes = ["CBEC Customs Seal", "ISO 17712 High Security", "Tamper-Evident Bolt", "Electronic Seal (e-Seal)", "Wire Seal", "Plastic Strip Seal"];
  const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Yard Area 1", "Yard Area 2", "Under Crane"];
  const blocks = ["Block 1", "Block 2", "Block 3", "Block 4", "Bay A", "Bay B", "Bay C", "Tier 1", "Tier 2"];
  const notes = ["Awaiting customs clearance", "Documentation pending", "Cargo inspection scheduled", "Duty payment pending", "Phyto certificate required", "Fumigation in progress", "Partial hold — HS code verification", "No issues", "Priority shipment — expedite", "Hazmat declaration verified"];

  // 60 containers
  const containers: ContainerRecord[] = [];
  for (let i = 0; i < 60; i++) {
    const size = pick(sizes);
    const movement = pick(movements);
    const status = pick(statuses);
    const arrivalDaysAgo = Math.floor(rand() * 30) + 1;
    const arrival = now - arrivalDaysAgo * day;
    const detention = Math.floor(rand() * 14);
    const freeDays = movement === "import" ? Math.max(7 - arrivalDaysAgo, 0) : Math.max(5 - arrivalDaysAgo, 0);
    const isDispatched = status === "dispatched";
    const dutyPaid = rand() > 0.3;

    containers.push({
      id: `CFS-${String(i + 1).padStart(4, "0")}`,
      containerNumber: `${pick(["MSCU", "MAEU", "CMAU", "HLCU", "CSLU", "EGLV", "OOLU", "YMLU"])}${String(Math.floor(rand() * 9000000) + 1000000)}`,
      size,
      movement,
      warehouse: pick(WAREHOUSES),
      status,
      arrivalDate: arrival,
      departureDate: isDispatched ? arrival + (detention + 1) * day : null,
      detentionDays: detention,
      freeDaysRemaining: freeDays,
      grossWeight: size === "fcl_20" ? Math.floor(rand() * 22000) + 5000 : Math.floor(rand() * 35000) + 10000,
      cargoWeight: Math.floor(rand() * 25000) + 2000,
      packages: Math.floor(rand() * 500) + 10,
      lineItems: Math.floor(rand() * 30) + 2,
      value: Math.floor(rand() * 20000000) + 200000,
      shipper: pick(shippers),
      consignee: pick(consignees),
      vessel: pick(vessels),
      voyage: `${String(Math.floor(rand() * 900) + 100)}W`,
      pol: pick(ports),
      pod: pick(ports),
      shippingLine: pick(shippers),
      blNumber: `${pick(["MAEU", "MSCU", "CMAU"])}${String(Math.floor(rand() * 900000000) + 100000000)}`,
      customsRegime: movement === "import" ? pick(["sea_import", "air_import", "bonded"]) : pick(["sea_export", "air_export", "exbonded"]),
      beNumber: movement === "import" ? `BE-${String(Math.floor(rand() * 900000) + 100000)}` : "",
      ieNumber: movement === "export" ? `IE-${String(Math.floor(rand() * 900000) + 100000)}` : "",
      dutyAmount: dutyPaid ? Math.floor(rand() * 3000000) + 100000 : 0,
      dutyStatus: dutyPaid ? "paid" : rand() > 0.5 ? "pending" : "exempted",
      sealNumber: `SL-${String(Math.floor(rand() * 900000) + 100000)}`,
      damageFlag: rand() > 0.93,
      hazmatFlag: rand() > 0.92,
      temperatureFlag: rand() > 0.94,
      oogFlag: rand() > 0.97,
      notes: pick(notes),
    });
  }

  // 90 customs docs
  const docs: CustomsDoc[] = [];
  for (let i = 0; i < 90; i++) {
    const cont = containers[i % containers.length];
    const dt = pick(docTypes);
    const st: DocStatus = rand() > 0.2 ? rand() > 0.3 ? (dt.includes("LC") ? "approved" : "approved") : "submitted" : rand() > 0.5 ? "pending" : "rejected";
    docs.push({
      id: `DOC-${String(i + 1).padStart(4, "0")}`,
      containerId: cont.id,
      docType: dt,
      docName: `${cont.containerNumber} — ${dt}`,
      status: st,
      submittedDate: st !== "pending" ? now - Math.floor(rand() * 10) * day : null,
      approvedDate: st === "approved" ? now - Math.floor(rand() * 5) * day : null,
      expiryDate: dt.includes("LC") ? now + Math.floor(rand() * 90) * day : null,
      filedBy: pick(["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Gupta", "Vikram Singh", "Deepa Nair"]),
      remarks: st === "rejected" ? "Document correction required — mismatch in HS code" : st === "pending" ? "Awaiting supporting documents" : "All documents verified and approved",
    });
  }

  // 40 seal records
  const seals: SealRecord[] = [];
  for (let i = 0; i < 40; i++) {
    const cont = containers[i % containers.length];
    seals.push({
      id: `SEAL-${String(i + 1).padStart(3, "0")}`,
      containerId: cont.id,
      sealNumber: `SL-${String(Math.floor(rand() * 900000) + 100000)}`,
      sealType: pick(sealTypes),
      appliedDate: now - Math.floor(rand() * 15) * day,
      verifiedBy: pick(["Customs Officer A", "Customs Officer B", "CFS Inspector C", "Port Authority D"]),
      status: pick(["intact", "intact", "intact", "broken", "replaced"]),
      location: `${pick(zones)} / ${pick(blocks)}`,
      photoUrl: rand() > 0.3 ? `seal_photos/${String(i + 1).padStart(3, "0")}.jpg` : null,
    });
  }

  // 35 storage entries
  const storage: StorageEntry[] = [];
  for (let i = 0; i < 35; i++) {
    const cont = containers[i % containers.length];
    const storageDays = Math.floor(rand() * 14) + 1;
    const dailyRate = cont.size === "fcl_20" ? 800 : cont.size === "fcl_40" || cont.size === "fcl_40hc" ? 1500 : 500;
    storage.push({
      id: `STR-${String(i + 1).padStart(4, "0")}`,
      containerId: cont.id,
      warehouse: pick(WAREHOUSES),
      zone: pick(zones),
      block: pick(blocks),
      position: `P-${String(Math.floor(rand() * 50) + 1)}`,
      entryDate: now - storageDays * day,
      storageDays,
      dailyRate,
      totalCharge: storageDays * dailyRate,
      freeStorageUsed: Math.min(storageDays, 7),
      freeStorageTotal: 7,
    });
  }

  // Monthly throughput trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const throughputTrend = months.map((m) => ({
    month: m,
    imports: Math.floor(rand() * 60) + 40,
    exports: Math.floor(rand() * 40) + 25,
    transit: Math.floor(rand() * 20) + 10,
    teu: Math.floor(rand() * 150) + 100,
  }));

  // Duty collection trend
  const dutyTrend = months.map((m) => ({
    month: m,
    customsDuty: Math.floor(rand() * 5000000) + 3000000,
    gst: Math.floor(rand() * 2000000) + 1000000,
    cess: Math.floor(rand() * 500000) + 200000,
    total: 0,
  }));
  dutyTrend.forEach((d) => { d.total = d.customsDuty + d.gst + d.cess; });

  // Detention trend
  const detentionTrend = months.map((m) => ({
    month: m,
    avgDetention: Math.round((rand() * 5 + 2) * 10) / 10,
    containers: Math.floor(rand() * 15) + 5,
  }));

  // Storage revenue trend
  const storageRevenueTrend = months.map((m) => ({
    month: m,
    revenue: Math.floor(rand() * 800000) + 400000,
    utilization: Math.floor(rand() * 30) + 60,
  }));

  return { containers, docs, seals, storage, throughputTrend, dutyTrend, detentionTrend, storageRevenueTrend, now };
}

const CHART_COLORS = ["#0d9488", "#f97316", "#6366f1", "#ec4899", "#eab308", "#06b6d4", "#10b981", "#ef4444"];

const STATUS_COLORS: Record<CfsStatus, string> = {
  received: "#6b7280",
  unloading: "#f59e0b",
  inspection: "#6366f1",
  customs_hold: "#ef4444",
  cleared: "#10b981",
  loading: "#06b6d4",
  dispatched: "#0d9488",
  rejected: "#dc2626",
};

const STATUS_LABELS: Record<CfsStatus, string> = {
  received: "Received",
  unloading: "Unloading",
  inspection: "Under Inspection",
  customs_hold: "Customs Hold",
  cleared: "Customs Cleared",
  loading: "Loading",
  dispatched: "Dispatched",
  rejected: "Rejected",
};

const SIZE_LABELS: Record<ContainerType, string> = {
  fcl_20: "20ft FCL",
  fcl_40: "40ft FCL",
  fcl_40hc: "40ft HC",
  lcl: "LCL",
  air_cargo: "Air Cargo",
  break_bulk: "Break Bulk",
};

const DOC_STATUS_COLORS: Record<DocStatus, string> = {
  pending: "#f59e0b",
  submitted: "#6366f1",
  approved: "#10b981",
  rejected: "#ef4444",
  expired: "#6b7280",
};

// ============================================================================
// Component
// ============================================================================
export default function ContainerFreightStationView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [filterMovement, setFilterMovement] = useState<string>("all");
  const [filterSize, setFilterSize] = useState<string>("all");
  const [filterDocStatus, setFilterDocStatus] = useState<string>("all");
  const [selectedContainer, setSelectedContainer] = useState<ContainerRecord | null>(null);

  const tabs = [
    "CFS Overview",
    "Container Register",
    "Customs Documentation",
    "Seal & Integrity",
    "Storage & Demurrage",
  ];

  // Computed
  const activeContainers = data.containers.filter((c) => !["dispatched", "rejected"].includes(c.status)).length;
  const customsPending = data.containers.filter((c) => c.status === "customs_hold").length;
  const clearedToday = data.containers.filter((c) => c.status === "cleared").length;
  const totalDuty = data.containers.reduce((s, c) => s + c.dutyAmount, 0);
  const avgDetention = Math.round(data.containers.reduce((s, c) => s + c.detentionDays, 0) / data.containers.length * 10) / 10;
  const totalPackages = data.containers.reduce((s, c) => s + c.packages, 0);

  // Status pipeline counts
  const pipelineCounts = (["received", "unloading", "inspection", "customs_hold", "cleared", "loading", "dispatched", "rejected"] as CfsStatus[]).map((s) => ({
    status: STATUS_LABELS[s],
    count: data.containers.filter((c) => c.status === s).length,
    color: STATUS_COLORS[s],
  }));

  // Movement distribution
  const movementDist = (["import", "export", "transit"] as MovementType[]).map((m) => ({
    name: m.charAt(0).toUpperCase() + m.slice(1),
    value: data.containers.filter((c) => c.movement === m).length,
  }));

  // Size distribution
  const sizeDist = (["fcl_20", "fcl_40", "fcl_40hc", "lcl", "air_cargo", "break_bulk"] as ContainerType[]).map((s) => ({
    name: SIZE_LABELS[s],
    value: data.containers.filter((c) => c.size === s).length,
  }));

  // Doc status distribution
  const docStatusDist = (["pending", "submitted", "approved", "rejected", "expired"] as DocStatus[]).map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: data.docs.filter((d) => d.status === s).length,
    color: DOC_STATUS_COLORS[s],
  }));

  // Doc type breakdown
  const docTypeBreakdown = [...new Set(data.docs.map((d) => d.docType))].map((dt) => ({
    name: dt.length > 20 ? dt.slice(0, 20) + "…" : dt,
    value: data.docs.filter((d) => d.docType === dt).length,
  })).sort((a, b) => b.value - a.value).slice(0, 10);

  // Duty by warehouse
  const dutyByWarehouse = WAREHOUSES.map((wh) => ({
    warehouse: wh.split(" ")[0],
    duty: data.containers.filter((c) => c.warehouse === wh).reduce((s, c) => s + c.dutyAmount, 0),
  }));

  // Filtered
  const filteredContainers = useMemo(() => {
    return data.containers.filter((c) => {
      if (searchTerm && !c.id.toLowerCase().includes(searchTerm.toLowerCase()) && !c.containerNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterWarehouse !== "all" && c.warehouse !== filterWarehouse) return false;
      if (filterMovement !== "all" && c.movement !== filterMovement) return false;
      if (filterSize !== "all" && c.size !== filterSize) return false;
      return true;
    });
  }, [data.containers, searchTerm, filterStatus, filterWarehouse, filterMovement, filterSize]);

  const filteredDocs = useMemo(() => {
    return data.docs.filter((d) => {
      if (searchTerm && !d.docName.toLowerCase().includes(searchTerm.toLowerCase()) && !d.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterDocStatus !== "all" && d.status !== filterDocStatus) return false;
      return true;
    });
  }, [data.docs, searchTerm, filterDocStatus]);

  // Warehouse storage comparison
  const whStorage = WAREHOUSES.map((wh) => {
    const whStr = data.storage.filter((s) => s.warehouse === wh);
    return {
      warehouse: wh.split(" ")[0],
      revenue: whStr.reduce((s, e) => s + e.totalCharge, 0),
      containers: whStr.length,
      utilization: whStr.length ? Math.round((whStr.reduce((s, e) => s + e.storageDays, 0) / (whStr.length * 14)) * 100) : 0,
    };
  });

  // Container radar per warehouse
  const containerRadar = WAREHOUSES.map((wh) => {
    const whc = data.containers.filter((c) => c.warehouse === wh);
    return {
      warehouse: wh.split(" ")[0],
      imports: whc.filter((c) => c.movement === "import").length * 10,
      exports: whc.filter((c) => c.movement === "export").length * 10,
      transit: whc.filter((c) => c.movement === "transit").length * 10,
      cleared: whc.filter((c) => c.status === "cleared").length * 15,
      held: whc.filter((c) => c.status === "customs_hold").length * 20,
    };
  });

  const fmt = (n: number) => n.toLocaleString("en-IN");
  const fmtCur = (n: number) => "₹" + fmt(n);
  const fmtTime = (ts: number) => new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="cfs-container space-y-4">
      {/* Header */}
      <div className="cfs-header">
        <div className="cfs-header-content">
          <div className="cfs-header-icon-wrap">
            <Container className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="cfs-header-title">Container Freight Station &amp; Customs</h1>
            <p className="cfs-header-subtitle">CFS operations, customs documentation, seal integrity, storage management across 6 Indian ports &amp; warehouses</p>
          </div>
        </div>
        <div className="cfs-header-badges">
          <div className="cfs-header-badge cfs-badge-teal">
            <Package className="h-3.5 w-3.5" />
            <span>{activeContainers} Active Containers</span>
          </div>
          <div className="cfs-header-badge cfs-badge-red">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{customsPending} Customs Hold</span>
          </div>
          <div className="cfs-header-badge cfs-badge-green">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{clearedToday} Cleared</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cfs-tabs">
        {tabs.map((tab, i) => (
          <button key={tab} className={`cfs-tab ${activeTab === i ? "cfs-tab-active" : ""}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: CFS Overview */}
      {activeTab === 0 && (
        <div className="cfs-tab-content space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Active Containers", value: activeContainers, total: data.containers.length, icon: Container, color: "cfs-kpi-teal" },
              { label: "Customs Hold", value: customsPending, icon: ShieldCheck, color: "cfs-kpi-red" },
              { label: "Total Duty", value: fmtCur(totalDuty), icon: IndianRupee, color: "cfs-kpi-amber" },
              { label: "Avg Detention", value: `${avgDetention}d`, icon: Clock, color: "cfs-kpi-purple" },
              { label: "Total TEU", value: data.containers.length, icon: Ship, color: "cfs-kpi-green" },
              { label: "Total Packages", value: fmt(totalPackages), icon: Boxes, color: "cfs-kpi-blue" },
            ].map((kpi, i) => (
              <Card key={i} className={`cfs-kpi-card ${kpi.color} cfs-stagger-${Math.min(i, 5)}`}>
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className="h-4 w-4 cfs-kpi-icon" />
                    {kpi.total && <span className="cfs-kpi-total">/ {kpi.total}</span>}
                  </div>
                  <div className="cfs-kpi-value">{kpi.value}</div>
                  <div className="cfs-kpi-label">{kpi.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Status Pipeline */}
          <Card className="cfs-card">
            <CardHeader className="pb-2">
              <CardTitle className="cfs-card-title"><Activity className="h-4 w-4" /> Container Status Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="cfs-pipeline">
                {pipelineCounts.map((p, i) => (
                  <div key={p.status} className="cfs-pipeline-stage" style={{ flex: p.count || 0.5 }}>
                    <div className="cfs-pipeline-bar" style={{ backgroundColor: p.color }}>
                      <span className="cfs-pipeline-count">{p.count}</span>
                    </div>
                    <span className="cfs-pipeline-label">{p.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Throughput Trend + Movement/Size Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="cfs-card lg:col-span-2 cfs-stagger-6">
              <CardHeader className="pb-2">
                <CardTitle className="cfs-card-title"><TrendingUp className="h-4 w-4" /> Monthly Throughput (12 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.throughputTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="imports" stackId="a" fill="#0d9488" name="Imports" />
                      <Bar dataKey="exports" stackId="a" fill="#f97316" name="Exports" />
                      <Bar dataKey="transit" stackId="a" fill="#6366f1" name="Transit" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="teu" stroke="#ec4899" strokeWidth={2} name="TEU" dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cfs-card cfs-stagger-7">
              <CardHeader className="pb-2">
                <CardTitle className="cfs-card-title"><Globe2 className="h-4 w-4" /> Movement &amp; Size</CardTitle>
              </CardHeader>
              <CardContent className="glass-subtle space-y-4">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Movement Type</div>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={movementDist} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={3}>
                          {movementDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Container Size</div>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sizeDist} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={2}>
                          {sizeDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[(i + 3) % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Legend wrapperStyle={{ fontSize: 9 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Duty by Warehouse + Detention Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="cfs-card cfs-stagger-8">
              <CardHeader className="pb-2">
                <CardTitle className="cfs-card-title"><IndianRupee className="h-4 w-4" /> Duty Collection by Warehouse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dutyByWarehouse} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <YAxis type="category" dataKey="warehouse" tick={{ fontSize: 10 }} width={80} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtCur(v)} />
                      <Bar dataKey="duty" fill="#f97316" radius={[0, 4, 4, 0]} name="Duty (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cfs-card cfs-stagger-9">
              <CardHeader className="pb-2">
                <CardTitle className="cfs-card-title"><Timer className="h-4 w-4" /> Avg Detention Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.detentionTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="avgDetention" stroke="#ef4444" strokeWidth={2} name="Avg Days" dot={{ r: 3 }} />
                      <Bar dataKey="containers" fill="#6366f1" name="Containers" radius={[4, 4, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 1: Container Register */}
      {activeTab === 1 && (
        <div className="cfs-tab-content space-y-4">
          <Card className="cfs-filter-card">
            <CardContent className="glass-subtle p-3 flex flex-wrap items-center gap-3">
              <div className="cfs-filter-search">
                <Search className="h-3.5 w-3.5" />
                <input placeholder="Search ID or container..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="cfs-filter-input" />
              </div>
              <select className="cfs-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                {(["received", "unloading", "inspection", "customs_hold", "cleared", "loading", "dispatched", "rejected"] as CfsStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <select className="cfs-filter-select" value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {WAREHOUSES.map((wh) => <option key={wh} value={wh}>{wh.split(" ")[0]}</option>)}
              </select>
              <select className="cfs-filter-select" value={filterMovement} onChange={(e) => setFilterMovement(e.target.value)}>
                <option value="all">All Movement</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
                <option value="transit">Transit</option>
              </select>
              <select className="cfs-filter-select" value={filterSize} onChange={(e) => setFilterSize(e.target.value)}>
                <option value="all">All Sizes</option>
                {(["fcl_20", "fcl_40", "fcl_40hc", "lcl", "air_cargo", "break_bulk"] as ContainerType[]).map((s) => <option key={s} value={s}>{SIZE_LABELS[s]}</option>)}
              </select>
              <span className="cfs-filter-count">{filteredContainers.length} containers</span>
            </CardContent>
          </Card>

          <Card className="cfs-card">
            <CardHeader className="pb-2">
              <CardTitle className="cfs-card-title"><ClipboardList className="h-4 w-4" /> Container Register</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="cfs-table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Container</th>
                      <th>Size</th>
                      <th>Movement</th>
                      <th>Warehouse</th>
                      <th>Shipping Line</th>
                      <th>Status</th>
                      <th>Arrival</th>
                      <th>Detention</th>
                      <th>Duty</th>
                      <th>Flags</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContainers.map((c) => (
                      <tr key={c.id} className="cfs-table-row">
                        <td className="font-mono text-xs">{c.id}</td>
                        <td className="font-mono text-xs">{c.containerNumber}</td>
                        <td className="text-xs">{SIZE_LABELS[c.size]}</td>
                        <td>
                          <Badge variant="outline" className={`text-[10px] ${c.movement === "import" ? "border-teal-500 text-teal-600" : c.movement === "export" ? "border-orange-500 text-orange-600" : "border-indigo-500 text-indigo-600"}`}>
                            {c.movement}
                          </Badge>
                        </td>
                        <td className="text-xs">{c.warehouse.split(" ")[0]}</td>
                        <td className="text-xs max-w-[120px] truncate">{c.shippingLine}</td>
                        <td>
                          <Badge className="badge-interactive cfs-status-badge text-[10px]" style={{ background: `${STATUS_COLORS[c.status]}20`, color: STATUS_COLORS[c.status] }}>
                            {STATUS_LABELS[c.status]}
                          </Badge>
                        </td>
                        <td className="text-xs">{fmtTime(c.arrivalDate)}</td>
                        <td className="text-xs">{c.detentionDays}d</td>
                        <td className="text-xs font-semibold">{c.dutyStatus === "paid" ? fmtCur(c.dutyAmount) : c.dutyStatus === "pending" ? "Pending" : "Exempt"}</td>
                        <td>
                          <span className="cfs-flags-cell">
                            {c.damageFlag && <span title="Damage" className="cfs-flag cfs-flag-dmg"><AlertTriangle className="h-3 w-3" /></span>}
                            {c.hazmatFlag && <span title="Hazmat" className="cfs-flag cfs-flag-haz"><Zap className="h-3 w-3" /></span>}
                            {c.temperatureFlag && <span title="Temperature controlled" className="cfs-flag cfs-flag-temp"><PackageSearch className="h-3 w-3" /></span>}
                          </span>
                        </td>
                        <td>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedContainer(c)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Container Detail Drawer */}
          {selectedContainer && (
            <div className="cfs-drawer-backdrop" onClick={() => setSelectedContainer(null)}>
              <div className="cfs-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="cfs-drawer-header">
                  <h3 className="cfs-drawer-title">{selectedContainer.id} — {selectedContainer.containerNumber}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedContainer(null)} className="h-8 w-8 p-0">
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="cfs-drawer-body space-y-4">
                  <div className="cfs-drawer-section">
                    <h4 className="cfs-drawer-section-title">Container Overview</h4>
                    <div className="cfs-drawer-grid">
                      <div><span className="cfs-drawer-label">Size</span><span className="cfs-drawer-value">{SIZE_LABELS[selectedContainer.size]}</span></div>
                      <div><span className="cfs-drawer-label">Movement</span><span className="cfs-drawer-value capitalize">{selectedContainer.movement}</span></div>
                      <div><span className="badge-interactive cfs-drawer-label">Status</span><Badge className="cfs-status-badge" style={{ background: `${STATUS_COLORS[selectedContainer.status]}20`, color: STATUS_COLORS[selectedContainer.status] }}>{STATUS_LABELS[selectedContainer.status]}</Badge></div>
                      <div><span className="cfs-drawer-label">Warehouse</span><span className="cfs-drawer-value">{selectedContainer.warehouse}</span></div>
                      <div><span className="cfs-drawer-label">Weight</span><span className="cfs-drawer-value">{fmt(selectedContainer.grossWeight)} kg</span></div>
                      <div><span className="cfs-drawer-label">Packages</span><span className="cfs-drawer-value">{fmt(selectedContainer.packages)}</span></div>
                    </div>
                  </div>
                  <div className="cfs-drawer-section">
                    <h4 className="cfs-drawer-section-title">Shipping &amp; Route</h4>
                    <div className="cfs-drawer-grid">
                      <div><span className="cfs-drawer-label">Vessel</span><span className="cfs-drawer-value">{selectedContainer.vessel}</span></div>
                      <div><span className="cfs-drawer-label">Voyage</span><span className="cfs-drawer-value">{selectedContainer.voyage}</span></div>
                      <div><span className="cfs-drawer-label">POL</span><span className="cfs-drawer-value">{selectedContainer.pol}</span></div>
                      <div><span className="cfs-drawer-label">POD</span><span className="cfs-drawer-value">{selectedContainer.pod}</span></div>
                      <div><span className="cfs-drawer-label">Shipper</span><span className="cfs-drawer-value">{selectedContainer.shipper}</span></div>
                      <div><span className="cfs-drawer-label">Consignee</span><span className="cfs-drawer-value">{selectedContainer.consignee}</span></div>
                    </div>
                  </div>
                  <div className="cfs-drawer-section">
                    <h4 className="cfs-drawer-section-title">Customs &amp; Duty</h4>
                    <div className="cfs-drawer-grid">
                      <div><span className="cfs-drawer-label">BE Number</span><span className="cfs-drawer-value font-mono">{selectedContainer.beNumber || "—"}</span></div>
                      <div><span className="cfs-drawer-label">IE Number</span><span className="cfs-drawer-value font-mono">{selectedContainer.ieNumber || "—"}</span></div>
                      <div><span className="cfs-drawer-label">Regime</span><span className="cfs-drawer-value">{selectedContainer.customsRegime.replace("_", " ")}</span></div>
                      <div><span className="cfs-drawer-label">Duty</span><span className={`cfs-drawer-value font-semibold ${selectedContainer.dutyStatus === "paid" ? "text-emerald-600" : selectedContainer.dutyStatus === "pending" ? "text-amber-600" : ""}`}>{selectedContainer.dutyStatus === "paid" ? fmtCur(selectedContainer.dutyAmount) : selectedContainer.dutyStatus === "pending" ? "Payment Pending" : "Exempted"}</span></div>
                      <div><span className="cfs-drawer-label">BL Number</span><span className="cfs-drawer-value font-mono text-xs">{selectedContainer.blNumber}</span></div>
                      <div><span className="cfs-drawer-label">Seal Number</span><span className="cfs-drawer-value font-mono">{selectedContainer.sealNumber}</span></div>
                    </div>
                  </div>
                  <div className="cfs-drawer-section">
                    <h4 className="cfs-drawer-section-title">Timing &amp; Detention</h4>
                    <div className="cfs-drawer-grid">
                      <div><span className="cfs-drawer-label">Arrival</span><span className="cfs-drawer-value">{fmtTime(selectedContainer.arrivalDate)}</span></div>
                      <div><span className="cfs-drawer-label">Departure</span><span className="cfs-drawer-value">{selectedContainer.departureDate ? fmtTime(selectedContainer.departureDate) : "—"}</span></div>
                      <div><span className="cfs-drawer-label">Detention</span><span className={`cfs-drawer-value font-semibold ${selectedContainer.detentionDays > 5 ? "text-red-600" : "text-emerald-600"}`}>{selectedContainer.detentionDays} days</span></div>
                      <div><span className="cfs-drawer-label">Free Days</span><span className={`cfs-drawer-value ${selectedContainer.freeDaysRemaining <= 1 ? "text-red-600 font-semibold" : ""}`}>{selectedContainer.freeDaysRemaining} remaining</span></div>
                    </div>
                    {selectedContainer.freeDaysRemaining <= 7 && (
                      <div className="cfs-drawer-timeline mt-2">
                        <div className="cfs-drawer-timeline-bar" style={{ width: `${Math.max(0, ((7 - selectedContainer.freeDaysRemaining) / 7) * 100)}%` }}>
                          <span className="cfs-drawer-timeline-dot" />
                        </div>
                        <span className="text-xs text-muted-foreground">Free storage period usage</span>
                      </div>
                    )}
                  </div>
                  <div className="cfs-drawer-section">
                    <h4 className="cfs-drawer-section-title">Notes</h4>
                    <p className="cfs-drawer-text">{selectedContainer.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Customs Documentation */}
      {activeTab === 2 && (
        <div className="cfs-tab-content space-y-4">
          <Card className="cfs-filter-card">
            <CardContent className="glass-subtle p-3 flex flex-wrap items-center gap-3">
              <div className="cfs-filter-search">
                <Search className="h-3.5 w-3.5" />
                <input placeholder="Search doc name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="cfs-filter-input" />
              </div>
              <select className="cfs-filter-select" value={filterDocStatus} onChange={(e) => setFilterDocStatus(e.target.value)}>
                <option value="all">All Status</option>
                {(["pending", "submitted", "approved", "rejected", "expired"] as DocStatus[]).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <span className="cfs-filter-count">{filteredDocs.length} documents</span>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {([
              { label: "Total Documents", value: data.docs.length, color: "cfs-kpi-teal" },
              { label: "Approved", value: data.docs.filter((d) => d.status === "approved").length, color: "cfs-kpi-green" },
              { label: "Pending", value: data.docs.filter((d) => d.status === "pending").length, color: "cfs-kpi-amber" },
              { label: "Rejected", value: data.docs.filter((d) => d.status === "rejected").length, color: "cfs-kpi-red" },
            ]).map((kpi, i) => (
              <Card key={i} className={`cfs-kpi-card ${kpi.color}`}>
                <CardContent className="glass-subtle p-4">
                  <div className="cfs-kpi-value">{kpi.value}</div>
                  <div className="cfs-kpi-label">{kpi.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="cfs-card">
            <CardHeader className="pb-2">
              <CardTitle className="cfs-card-title"><FileCheck className="h-4 w-4" /> Document Register</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="cfs-table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Document Name</th>
                      <th>Type</th>
                      <th>Container</th>
                      <th>Status</th>
                      <th>Filed By</th>
                      <th>Submitted</th>
                      <th>Approved</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((d) => (
                      <tr key={d.id} className="cfs-table-row">
                        <td className="font-mono text-xs">{d.id}</td>
                        <td className="text-xs max-w-[180px] truncate">{d.docName}</td>
                        <td className="text-xs">{d.docType}</td>
                        <td className="font-mono text-xs">{d.containerId}</td>
                        <td>
                          <Badge className="badge-interactive cfs-doc-badge text-[10px]" style={{ background: `${DOC_STATUS_COLORS[d.status]}20`, color: DOC_STATUS_COLORS[d.status] }}>
                            {d.status}
                          </Badge>
                        </td>
                        <td className="text-xs">{d.filedBy}</td>
                        <td className="text-xs">{d.submittedDate ? fmtTime(d.submittedDate) : "—"}</td>
                        <td className="text-xs">{d.approvedDate ? fmtTime(d.approvedDate) : "—"}</td>
                        <td className="text-xs max-w-[140px] truncate">{d.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Doc Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="cfs-card">
              <CardHeader className="pb-2">
                <CardTitle className="cfs-card-title"><BarChart3 className="h-4 w-4" /> Document Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={docStatusDist} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                        {docStatusDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cfs-card">
              <CardHeader className="pb-2">
                <CardTitle className="cfs-card-title"><Archive className="h-4 w-4" /> Document Type Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={docTypeBreakdown} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={110} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Duty Trend */}
          <Card className="cfs-card">
            <CardHeader className="pb-2">
              <CardTitle className="cfs-card-title"><IndianRupee className="h-4 w-4" /> Duty Collection Trend (12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dutyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtCur(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="customsDuty" fill="#f97316" stroke="#f97316" fillOpacity={0.3} name="Customs Duty" />
                    <Area type="monotone" dataKey="gst" fill="#6366f1" stroke="#6366f1" fillOpacity={0.3} name="GST" />
                    <Area type="monotone" dataKey="cess" fill="#10b981" stroke="#10b981" fillOpacity={0.3} name="Cess" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Seal & Integrity */}
      {activeTab === 3 && (
        <div className="cfs-tab-content space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Seals", value: data.seals.length, color: "cfs-kpi-teal" },
              { label: "Intact", value: data.seals.filter((s) => s.status === "intact").length, color: "cfs-kpi-green" },
              { label: "Broken", value: data.seals.filter((s) => s.status === "broken").length, color: "cfs-kpi-red" },
              { label: "Replaced", value: data.seals.filter((s) => s.status === "replaced").length, color: "cfs-kpi-amber" },
            ].map((kpi, i) => (
              <Card key={i} className={`cfs-kpi-card ${kpi.color}`}>
                <CardContent className="glass-subtle p-4">
                  <div className="cfs-kpi-value">{kpi.value}</div>
                  <div className="cfs-kpi-label">{kpi.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Seal Distribution */}
          <Card className="cfs-card">
            <CardHeader className="pb-2">
              <CardTitle className="cfs-card-title"><ShieldCheck className="h-4 w-4" /> Seal Integrity Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[
                      { name: "Intact", value: data.seals.filter((s) => s.status === "intact").length, color: "#10b981" },
                      { name: "Broken", value: data.seals.filter((s) => s.status === "broken").length, color: "#ef4444" },
                      { name: "Replaced", value: data.seals.filter((s) => s.status === "replaced").length, color: "#f59e0b" },
                    ]} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" paddingAngle={3} label={({ name, value }) => `${name}: ${value}`}>
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Seal Register */}
          <Card className="cfs-card">
            <CardHeader className="pb-2">
              <CardTitle className="cfs-card-title"><Stamp className="h-4 w-4" /> Seal Register</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="cfs-table w-full">
                  <thead>
                    <tr>
                      <th>Seal ID</th>
                      <th>Seal Number</th>
                      <th>Type</th>
                      <th>Container</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Verified By</th>
                      <th>Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.seals.map((s) => (
                      <tr key={s.id} className="cfs-table-row">
                        <td className="font-mono text-xs">{s.id}</td>
                        <td className="font-mono text-xs">{s.sealNumber}</td>
                        <td className="text-xs">{s.sealType}</td>
                        <td className="font-mono text-xs">{s.containerId}</td>
                        <td>
                          <Badge className={`cfs-seal-badge text-[10px] ${s.status === "intact" ? "cfs-seal-ok" : s.status === "broken" ? "cfs-seal-broken" : "cfs-seal-replaced"}`}>
                            {s.status}
                          </Badge>
                        </td>
                        <td className="text-xs">{s.location}</td>
                        <td className="text-xs">{s.verifiedBy}</td>
                        <td className="text-xs">{fmtTime(s.appliedDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 4: Storage & Demurrage */}
      {activeTab === 4 && (
        <div className="cfs-tab-content space-y-4">
          {/* Storage KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Storage Revenue", value: fmtCur(data.storage.reduce((s, e) => s + e.totalCharge, 0)), icon: IndianRupee, color: "cfs-kpi-amber" },
              { label: "Active Storage", value: data.storage.length, icon: Warehouse, color: "cfs-kpi-teal" },
              { label: "Avg Storage Days", value: `${Math.round(data.storage.reduce((s, e) => s + e.storageDays, 0) / data.storage.length)}d`, icon: Clock, color: "cfs-kpi-purple" },
              { label: "Avg Daily Rate", value: `₹${Math.round(data.storage.reduce((s, e) => s + e.dailyRate, 0) / data.storage.length)}`, icon: Receipt, color: "cfs-kpi-blue" },
            ].map((kpi, i) => (
              <Card key={i} className={`cfs-kpi-card ${kpi.color}`}>
                <CardContent className="glass-subtle p-4">
                  <kpi.icon className="h-4 w-4 cfs-kpi-icon mb-2" />
                  <div className="cfs-kpi-value">{kpi.value}</div>
                  <div className="cfs-kpi-label">{kpi.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Storage Revenue Trend */}
          <Card className="cfs-card">
            <CardHeader className="pb-2">
              <CardTitle className="cfs-card-title"><TrendingUp className="h-4 w-4" /> Storage Revenue Trend (12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.storageRevenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#f97316" stroke="#f97316" fillOpacity={0.3} name="Revenue (₹)" />
                    <Line yAxisId="right" type="monotone" dataKey="utilization" stroke="#6366f1" strokeWidth={2} name="Utilization %" dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Storage Table */}
          <Card className="cfs-card">
            <CardHeader className="pb-2">
              <CardTitle className="cfs-card-title"><Archive className="h-4 w-4" /> Storage Register</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="cfs-table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Container</th>
                      <th>Warehouse</th>
                      <th>Zone / Block</th>
                      <th>Position</th>
                      <th>Days</th>
                      <th>Free Used</th>
                      <th>Daily Rate</th>
                      <th>Total Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.storage.map((s) => (
                      <tr key={s.id} className="cfs-table-row">
                        <td className="font-mono text-xs">{s.id}</td>
                        <td className="font-mono text-xs">{s.containerId}</td>
                        <td className="text-xs">{s.warehouse.split(" ")[0]}</td>
                        <td className="text-xs">{s.zone} / {s.block}</td>
                        <td className="text-xs">{s.position}</td>
                        <td className="text-xs font-semibold">{s.storageDays}d</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="cfs-shelf-bar-bg w-12">
                              <div className={`cfs-shelf-bar ${s.freeStorageUsed / s.freeStorageTotal > 0.8 ? "cfs-shelf-crit" : s.freeStorageUsed / s.freeStorageTotal > 0.5 ? "cfs-shelf-warn" : "cfs-shelf-ok"}`} style={{ width: `${(s.freeStorageUsed / s.freeStorageTotal) * 100}%` }} />
                            </div>
                            <span className="text-xs">{s.freeStorageUsed}/{s.freeStorageTotal}</span>
                          </div>
                        </td>
                        <td className="text-xs">₹{fmt(s.dailyRate)}</td>
                        <td className="text-xs font-semibold">₹{fmt(s.totalCharge)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Storage Comparison + Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="cfs-card">
              <CardHeader className="pb-2">
                <CardTitle className="cfs-card-title"><MapPin className="h-4 w-4" /> Warehouse Storage Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={whStorage}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtCur(v)} />
                      <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cfs-card">
              <CardHeader className="pb-2">
                <CardTitle className="cfs-card-title"><Globe className="h-4 w-4" /> Container Operations Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={containerRadar}>
                      <PolarGrid className="opacity-30" />
                      <PolarAngleAxis dataKey="warehouse" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis tick={{ fontSize: 9 }} />
                      <Radar name="Imports" dataKey="imports" stroke="#0d9488" fill="#0d9488" fillOpacity={0.2} />
                      <Radar name="Exports" dataKey="exports" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
                      <Radar name="Cleared" dataKey="cleared" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                      <Radar name="Held" dataKey="held" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
