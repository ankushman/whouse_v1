"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  ScanBarcode,
  QrCode,
  PackageSearch,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRightLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  Shield,
  Truck,
  Warehouse,
  Factory,
  Users,
  FileText,
  Eye,
  X,
  ChevronDown,
  ChevronRight,
  Activity,
  Hash,
  Layers,
  Link2,
  Fingerprint,
  History,
  AlertCircle,
  CheckCheck,
  Ban,
  Timer,
  TrendingUp,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
type TraceStatus =
  | "active"
  | "quarantined"
  | "recalled"
  | "disposed"
  | "transit"
  | "shipped"
  | "received"
  | "in_production"
  | "quality_hold";
type ScanEventType =
  | "inbound"
  | "outbound"
  | "transfer"
  | "pick"
  | "putaway"
  | "adjustment"
  | "quarantine"
  | "recall"
  | "dispose"
  | "quality_check"
  | "return"
  | "rework";
type ScanMethod = "barcode" | "qr_code" | "rfid" | "manual" | "mobile_app";
type RecallSeverity = "low" | "medium" | "high" | "critical";
type ComplianceStatus = "compliant" | "non_compliant" | "pending_review" | "exempt";
type ScanLocation =
  | "receiving_dock"
  | "putaway_zone"
  | "picking_area"
  | "packing_station"
  | "shipping_dock"
  | "quality_lab"
  | "quarantine_zone"
  | "return_processing";

interface SerialRecord {
  id: string;
  serialNumber: string;
  gtin: string;
  batchNumber: string;
  lotNumber: string;
  productName: string;
  sku: string;
  category: string;
  manufacturer: string;
  mfgDate: number;
  expiryDate: number;
  status: TraceStatus;
  currentLocation: string;
  warehouse: string;
  scanMethod: ScanMethod;
  scannedBy: string;
  firstScan: number;
  lastScan: number;
  scanCount: number;
  temperature: number | null;
  humidity: number | null;
  weight: number;
  dimensions: string;
  recallFlag: boolean;
  quarantineReason: string | null;
  gs1Compliant: boolean;
  notes: string;
}

interface ScanEvent {
  id: string;
  serialNumber: string;
  productName: string;
  eventType: ScanEventType;
  scanMethod: ScanMethod;
  location: ScanLocation;
  warehouse: string;
  fromLocation: string | null;
  toLocation: string | null;
  scannedBy: string;
  timestamp: number;
  temperature: number | null;
  notes: string;
}

interface RecallRecord {
  id: string;
  recallId: string;
  productName: string;
  batchNumber: string;
  affectedUnits: number;
  recoveredUnits: number;
  severity: RecallSeverity;
  reason: string;
  initiatedBy: string;
  initiatedDate: number;
  status: "open" | "in_progress" | "completed" | "closed";
  warehouse: string;
}

interface ProductVerification {
  id: string;
  productName: string;
  sku: string;
  totalScanned: number;
  passed: number;
  failed: number;
  pending: number;
  compliance: ComplianceStatus;
  lastAudit: number;
  warehouse: string;
}

// ============================================================================
// Constants
// ============================================================================
const WAREHOUSES = [
  "WH-Mumbai-Navi",
  "WH-Delhi-NCR",
  "WH-Chennai-Siruseri",
  "WH-Bangalore-Whitefield",
  "WH-Kolkata-Haldia",
  "WH-Hyderabad-Gachibowli",
];

const STATUS_CONFIG: Record<
  TraceStatus,
  { label: string; color: string; bg: string }
> = {
  active: { label: "Active", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  quarantined: { label: "Quarantined", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  recalled: { label: "Recalled", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  disposed: { label: "Disposed", color: "#6b7280", bg: "rgba(107,114,128,0.15)" },
  transit: { label: "In Transit", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
  shipped: { label: "Shipped", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  received: { label: "Received", color: "#14b8a6", bg: "rgba(20,184,166,0.15)" },
  in_production: { label: "In Production", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  quality_hold: { label: "Quality Hold", color: "#ec4899", bg: "rgba(236,72,153,0.15)" },
};

const EVENT_CONFIG: Record<ScanEventType, { label: string; color: string }> = {
  inbound: { label: "Inbound", color: "#10b981" },
  outbound: { label: "Outbound", color: "#3b82f6" },
  transfer: { label: "Transfer", color: "#6366f1" },
  pick: { label: "Pick", color: "#f59e0b" },
  putaway: { label: "Putaway", color: "#14b8a6" },
  adjustment: { label: "Adjustment", color: "#6b7280" },
  quarantine: { label: "Quarantine", color: "#ef4444" },
  recall: { label: "Recall", color: "#dc2626" },
  dispose: { label: "Dispose", color: "#78716c" },
  quality_check: { label: "QC Check", color: "#8b5cf6" },
  return: { label: "Return", color: "#ec4899" },
  rework: { label: "Rework", color: "#f97316" },
};

const SCAN_METHOD_CONFIG: Record<ScanMethod, { label: string; color: string }> = {
  barcode: { label: "Barcode", color: "#3b82f6" },
  qr_code: { label: "QR Code", color: "#10b981" },
  rfid: { label: "RFID", color: "#6366f1" },
  manual: { label: "Manual", color: "#6b7280" },
  mobile_app: { label: "Mobile", color: "#f59e0b" },
};

const RECALL_COLORS: Record<RecallSeverity, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const THEME = {
  primary: "#0d9488",
  secondary: "#6366f1",
  accent: "#f59e0b",
  success: "#10b981",
  danger: "#ef4444",
  bg: "#0f172a",
};

// ============================================================================
// Seeded Random & Data Generation
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateData() {
  const rand = seededRandom(123123);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
  const pickIdx = <T,>(arr: readonly T[]): number => Math.floor(rand() * arr.length);
  const now = Date.now();
  const day = 86400000;
  const hour = 3600000;

  const products = [
    { name: "Paracetamol 500mg Tablets", sku: "PHR-PCM-500", category: "Pharmaceutical", gtin: "8901234001001", mfg: "Sun Pharma" },
    { name: "Cetirizine 10mg Tabs", sku: "PHR-CET-010", category: "Pharmaceutical", gtin: "8901234001002", mfg: "Dr Reddys" },
    { name: "Insulin Glargine Pen", sku: "PHR-INS-GLA", category: "Pharmaceutical", gtin: "8901234001003", mfg: "Biocon" },
    { name: "Amoxicillin Caps 250mg", sku: "PHR-AMX-250", category: "Pharmaceutical", gtin: "8901234001004", mfg: "Cipla" },
    { name: "Metformin 500mg Tabs", sku: "PHR-MET-500", category: "Pharmaceutical", gtin: "8901234001005", mfg: "Lupin" },
    { name: "Omeprazole 20mg Caps", sku: "PHR-OMP-020", category: "Pharmaceutical", gtin: "8901234001006", mfg: "Zydus Cadila" },
    { name: "Organic Basmati Rice 1kg", sku: "FOD-RIC-BAS", category: "Food & Beverage", gtin: "8904567002001", mfg: "India Gate" },
    { name: "Extra Virgin Olive Oil 500ml", sku: "FOD-OIL-EVO", category: "Food & Beverage", gtin: "8904567002002", mfg: "Figaro" },
    { name: "A2 Gir Cow Ghee 500ml", sku: "FOD-GHR-A2G", category: "Food & Beverage", gtin: "8904567002003", mfg: "Amul" },
    { name: "Premium Darjeeling Tea 250g", sku: "FOD-TEA-DAR", category: "Food & Beverage", gtin: "8904567002004", mfg: "Tata Tea" },
    { name: "Organic Turmeric Powder 200g", sku: "FOD-TRM-ORG", category: "Food & Beverage", gtin: "8904567002005", mfg: "Everest" },
    { name: "Lithium-ion Battery Cell 3.7V", sku: "ELC-BAT-LIO", category: "Electronics", gtin: "8907890003001", mfg: "Exide" },
    { name: "LED Panel Light 36W", sku: "ELC-LED-036", category: "Electronics", gtin: "8907890003002", mfg: "Philips India" },
    { name: "USB-C Cable 1.5m", sku: "ELC-USC-150", category: "Electronics", gtin: "8907890003003", mfg: "Boat" },
    { name: "Smartphone Case Polymer", sku: "ELC-PHN-CSE", category: "Electronics", gtin: "8907890003004", mfg: "Noise" },
    { name: "Automotive Brake Pad Set", sku: "AUT-BRK-PAD", category: "Automotive", gtin: "8903210004001", mfg: "Bosch" },
    { name: "Engine Oil 5W-30 4L", sku: "AUT-OIL-5W3", category: "Automotive", gtin: "8903210004002", mfg: "Castrol" },
    { name: "Air Filter Element", sku: "AUT-AIR-FLT", category: "Automotive", gtin: "8903210004003", mfg: "Mann Filter" },
    { name: "Hydraulic Pump Assembly", sku: "IND-HYD-PMP", category: "Industrial", gtin: "8906540005001", mfg: "Bosch Rexroth" },
    { name: "Stainless Steel Bearing 6205", sku: "IND-BRG-620", category: "Industrial", gtin: "8906540005002", mfg: "SKF India" },
    { name: "V-Belt A68 Industrial", sku: "IND-BLT-A68", category: "Industrial", gtin: "8906540005003", mfg: "Gates India" },
  ];

  const statuses: TraceStatus[] = ["active", "quarantined", "recalled", "disposed", "transit", "shipped", "received", "in_production", "quality_hold"];
  const scanMethods: ScanMethod[] = ["barcode", "qr_code", "rfid", "manual", "mobile_app"];
  const eventTypes: ScanEventType[] = ["inbound", "outbound", "transfer", "pick", "putaway", "adjustment", "quarantine", "recall", "dispose", "quality_check", "return", "rework"];
  const locations: ScanLocation[] = ["receiving_dock", "putaway_zone", "picking_area", "packing_station", "shipping_dock", "quality_lab", "quarantine_zone", "return_processing"];
  const scanners = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Gupta", "Vikram Singh", "Deepa Nair", "Arjun Mehta", "Kavitha Raman", "Suresh Iyer", "Meena Devi"];
  const whLocations = [
    "Rack A-01-03", "Rack A-02-01", "Rack B-01-05", "Rack B-03-02", "Rack C-01-01",
    "Rack C-02-04", "Floor Zone 1", "Floor Zone 2", "Cold Store CS-01", "Cold Store CS-02",
    "Hazardous Zone HZ-01", "Quarantine Area QA-01", "Staging Area ST-01", "Dock D-01",
    "Dock D-02", "Dock D-03", "Returns Bay RB-01", "QC Lab QL-01", "Shipping Lane SL-01",
  ];

  // 200 serial records
  const serials: SerialRecord[] = [];
  for (let i = 0; i < 200; i++) {
    const prod = products[pickIdx(products)];
    const mfgDaysAgo = Math.floor(rand() * 180) + 30;
    const shelfLifeDays = Math.floor(rand() * 730) + 90;
    const mfgDate = now - mfgDaysAgo * day;
    const expiryDate = mfgDate + shelfLifeDays * day;
    const firstScanDaysAgo = Math.min(mfgDaysAgo, Math.floor(rand() * 60) + 1);
    const scanCount = Math.floor(rand() * 15) + 1;
    const recallFlag = rand() > 0.92;
    const status = recallFlag
      ? pick(["recalled", "quarantined"] as const)
      : pick(statuses);
    const isTempControlled = prod.category === "Pharmaceutical" && rand() > 0.5;

    serials.push({
      id: `SN-${String(i + 1).padStart(4, "0")}`,
      serialNumber: `SN-${prod.sku}-${String(i + 1).padStart(6, "0")}`,
      gtin: prod.gtin,
      batchNumber: `BAT-${String(Math.floor(rand() * 9000) + 1000)}`,
      lotNumber: `LOT-${String(Math.floor(rand() * 900) + 100)}-${String.fromCharCode(65 + Math.floor(rand() * 12))}${String(Math.floor(rand() * 900) + 100)}`,
      productName: prod.name,
      sku: prod.sku,
      category: prod.category,
      manufacturer: prod.mfg,
      mfgDate,
      expiryDate,
      status,
      currentLocation: pick(whLocations),
      warehouse: pick(WAREHOUSES),
      scanMethod: pick(scanMethods),
      scannedBy: pick(scanners),
      firstScan: now - firstScanDaysAgo * day,
      lastScan: now - Math.floor(rand() * 3) * day - Math.floor(rand() * 24) * hour,
      scanCount,
      temperature: isTempControlled ? Math.round((rand() * 12 + 2) * 10) / 10 : null,
      humidity: isTempControlled ? Math.round(rand() * 40 + 30) : null,
      weight: Math.round(rand() * 5000 + 50),
      dimensions: `${Math.floor(rand() * 50 + 5)}x${Math.floor(rand() * 40 + 5)}x${Math.floor(rand() * 30 + 2)}cm`,
      recallFlag,
      quarantineReason: status === "quarantined" ? pick(["Temperature excursion", "Failed QC check", "Pending investigation", "Regulatory hold", "Packaging damage"]) : status === "quality_hold" ? pick(["AQL failure", "Microbial contamination", "Label mismatch", "Weight discrepancy"]) : null,
      gs1Compliant: rand() > 0.08,
      notes: pick(["No issues", "Regular scan", "Priority item", "Fragile handling required", "Temperature sensitive", "Batch verified", "Compliance checked", "Awaiting dispatch", "Picked for order", "Cross-docked"]),
    });
  }

  // 400 scan events
  const events: ScanEvent[] = [];
  for (let i = 0; i < 400; i++) {
    const serial = pick(serials);
    const eventType = pick(eventTypes);
    const daysAgo = Math.floor(rand() * 30);
    const hoursAgo = Math.floor(rand() * 24);

    events.push({
      id: `EVT-${String(i + 1).padStart(5, "0")}`,
      serialNumber: serial.serialNumber,
      productName: serial.productName,
      eventType,
      scanMethod: pick(scanMethods),
      location: pick(locations),
      warehouse: serial.warehouse,
      fromLocation: eventType === "transfer" || eventType === "putaway" ? pick(whLocations) : null,
      toLocation: eventType === "transfer" || eventType === "putaway" ? pick(whLocations) : null,
      scannedBy: pick(scanners),
      timestamp: now - daysAgo * day - hoursAgo * hour,
      temperature: serial.temperature,
      notes: pick(["Routine scan", "Exception flagged", "Verified OK", "Weight confirmed", "Temperature logged", "Location updated", "Manual override", "Batch match confirmed", "Duplicate scan — resolved"]),
    });
  }
  events.sort((a, b) => b.timestamp - a.timestamp);

  // 12 recalls
  const recalls: RecallRecord[] = [];
  const recallReasons = [
    "Microbial contamination detected in batch",
    "Labeling error — incorrect expiry date printed",
    "Temperature excursion during transit exceeding 8 hours",
    "Allergen cross-contamination risk identified",
    "Packaging integrity failure — seal broken",
    "FDA alert — Class II voluntary recall",
    "Customer complaint — adverse reaction reported",
    "Supplier quality deviation notification",
    "Regulatory authority mandatory recall directive",
    "GS1 code mismatch — traceability broken",
    "Metal contamination detected during QC",
    "Excess active ingredient — dosage deviation",
  ];
  for (let i = 0; i < 12; i++) {
    const prod = pick(products);
    const affected = Math.floor(rand() * 200) + 10;
    const recovered = Math.floor(affected * rand() * 0.8);
    const recallStatuses: RecallRecord["status"][] = ["open", "in_progress", "completed", "closed"];

    recalls.push({
      id: `REC-${String(i + 1).padStart(3, "0")}`,
      recallId: `RCL-${new Date().getFullYear()}-${String(Math.floor(rand() * 900) + 100)}`,
      productName: prod.name,
      batchNumber: `BAT-${String(Math.floor(rand() * 9000) + 1000)}`,
      affectedUnits: affected,
      recoveredUnits: recovered,
      severity: pick(["low", "medium", "high", "critical"] as const),
      reason: recallReasons[i],
      initiatedBy: pick(scanners),
      initiatedDate: now - Math.floor(rand() * 60) * day,
      status: pick(recallStatuses),
      warehouse: pick(WAREHOUSES),
    });
  }

  // 15 product verifications
  const verifications: ProductVerification[] = [];
  const complianceStatuses: ComplianceStatus[] = ["compliant", "non_compliant", "pending_review", "exempt"];
  for (let i = 0; i < 15; i++) {
    const prod = products[i % products.length];
    const total = Math.floor(rand() * 500) + 50;
    const passRate = rand() * 0.3 + 0.65;
    const passed = Math.floor(total * passRate);
    const failed = Math.floor(total * (1 - passRate) * 0.7);
    const pending = total - passed - failed;

    verifications.push({
      id: `PV-${String(i + 1).padStart(3, "0")}`,
      productName: prod.name,
      sku: prod.sku,
      totalScanned: total,
      passed,
      failed,
      pending,
      compliance: pick(complianceStatuses),
      lastAudit: now - Math.floor(rand() * 30) * day,
      warehouse: pick(WAREHOUSES),
    });
  }

  // Monthly scan volume trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const scanTrend = months.map((m, idx) => ({
    month: m,
    scans: Math.floor(rand() * 8000) + 3000,
    uniqueSerials: Math.floor(rand() * 3000) + 1000,
    exceptions: Math.floor(rand() * 200) + 20,
    avgScanTime: Math.round((rand() * 3 + 1.5) * 100) / 100,
  }));

  // Compliance by category
  const catCompliance = ["Pharmaceutical", "Food & Beverage", "Electronics", "Automotive", "Industrial"].map(cat => ({
    category: cat,
    compliant: Math.floor(rand() * 30) + 70,
    nonCompliant: Math.floor(rand() * 15) + 5,
    pendingReview: Math.floor(rand() * 10) + 2,
    exempt: Math.floor(rand() * 5),
  }));

  return {
    serials,
    events,
    recalls,
    verifications,
    scanTrend,
    catCompliance,
    months,
  };
}

// ============================================================================
// Date/Time Helpers
// ============================================================================
function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtDateTime(ts: number) {
  return new Date(ts).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function daysFromNow(ts: number) {
  const diff = ts - Date.now();
  return Math.ceil(diff / 86400000);
}
function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ============================================================================
// Component
// ============================================================================
export default function SerialNumberTrackingView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchSN, setSearchSN] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [selectedSerial, setSelectedSerial] = useState<SerialRecord | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [eventFilterType, setEventFilterType] = useState("all");
  const [recallFilterSeverity, setRecallFilterSeverity] = useState("all");
  const [recallFilterStatus, setRecallFilterStatus] = useState("all");

  const tabs = [
    { label: "Traceability Overview", icon: <ScanBarcode className="w-4 h-4" /> },
    { label: "Serial Register", icon: <QrCode className="w-4 h-4" /> },
    { label: "Scan Activity", icon: <History className="w-4 h-4" /> },
    { label: "Recall Tracker", icon: <AlertTriangle className="w-4 h-4" /> },
    { label: "GS1 Compliance", icon: <Shield className="w-4 h-4" /> },
  ];

  // KPIs
  const totalSerials = data.serials.length;
  const activeSerials = data.serials.filter(s => s.status === "active").length;
  const quarantinedSerials = data.serials.filter(s => s.status === "quarantined").length;
  const recalledSerials = data.serials.filter(s => s.status === "recalled").length;
  const gs1Compliant = data.serials.filter(s => s.gs1Compliant).length;
  const complianceRate = Math.round((gs1Compliant / totalSerials) * 100);
  const openRecalls = data.recalls.filter(r => r.status === "open" || r.status === "in_progress").length;
  const todayScans = data.events.filter(e => Date.now() - e.timestamp < 86400000).length;

  // Filtered serials
  const filteredSerials = useMemo(() => {
    return data.serials.filter(s => {
      if (searchSN && !s.serialNumber.toLowerCase().includes(searchSN.toLowerCase()) && !s.productName.toLowerCase().includes(searchSN.toLowerCase()) && !s.batchNumber.toLowerCase().includes(searchSN.toLowerCase()) && !s.gtin.includes(searchSN)) return false;
      if (filterWarehouse !== "all" && s.warehouse !== filterWarehouse) return false;
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      if (filterCategory !== "all" && s.category !== filterCategory) return false;
      if (filterMethod !== "all" && s.scanMethod !== filterMethod) return false;
      return true;
    });
  }, [data.serials, searchSN, filterWarehouse, filterStatus, filterCategory, filterMethod]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return data.events.filter(e => {
      if (eventFilterType !== "all" && e.eventType !== eventFilterType) return false;
      if (searchSN && !e.serialNumber.toLowerCase().includes(searchSN.toLowerCase()) && !e.productName.toLowerCase().includes(searchSN.toLowerCase())) return false;
      return true;
    });
  }, [data.events, eventFilterType, searchSN]);

  // Filtered recalls
  const filteredRecalls = useMemo(() => {
    return data.recalls.filter(r => {
      if (recallFilterSeverity !== "all" && r.severity !== recallFilterSeverity) return false;
      if (recallFilterStatus !== "all" && r.status !== recallFilterStatus) return false;
      return true;
    });
  }, [data.recalls, recallFilterSeverity, recallFilterStatus]);

  // Status distribution for pie
  const statusDist = useMemo(() => {
    const map: Record<string, number> = {};
    data.serials.forEach(s => { map[s.status] = (map[s.status] || 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ name: STATUS_CONFIG[k as TraceStatus]?.label || k, value: v, color: STATUS_CONFIG[k as TraceStatus]?.color || "#6b7280" }));
  }, [data.serials]);

  // Scan method distribution
  const methodDist = useMemo(() => {
    const map: Record<string, number> = {};
    data.serials.forEach(s => { map[s.scanMethod] = (map[s.scanMethod] || 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ name: SCAN_METHOD_CONFIG[k as ScanMethod]?.label || k, value: v, color: SCAN_METHOD_CONFIG[k as ScanMethod]?.color || "#6b7280" }));
  }, [data.serials]);

  // Category distribution
  const catDist = useMemo(() => {
    const map: Record<string, number> = {};
    data.serials.forEach(s => { map[s.category] = (map[s.category] || 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ name: k, value: v, color: ["#0d9488", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"][Object.keys(map).indexOf(k) % 5] }));
  }, [data.serials]);

  // Event type distribution
  const eventDist = useMemo(() => {
    const map: Record<string, number> = {};
    data.events.forEach(e => { map[e.eventType] = (map[e.eventType] || 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ name: EVENT_CONFIG[k as ScanEventType]?.label || k, value: v, color: EVENT_CONFIG[k as ScanEventType]?.color || "#6b7280" }));
  }, [data.events]);

  // Serial event timeline for a selected serial
  const serialTimeline = useMemo(() => {
    if (!selectedSerial) return [];
    return data.events.filter(e => e.serialNumber === selectedSerial.serialNumber).slice(0, 20);
  }, [selectedSerial, data.events]);

  // Per-warehouse scan volume for radar
  const warehouseScanRadar = useMemo(() => {
    return WAREHOUSES.map(wh => {
      const scans = data.events.filter(e => e.warehouse === wh).length;
      const exceptions = data.events.filter(e => e.warehouse === wh && (e.eventType === "quarantine" || e.eventType === "recall" || e.eventType === "dispose")).length;
      return { warehouse: wh.replace("WH-", ""), scans, exceptions, compliance: Math.round((scans - exceptions) / scans * 100) };
    });
  }, [data.events]);

  const openDrawer = (serial: SerialRecord) => {
    setSelectedSerial(serial);
    setShowDrawer(true);
  };

  const categories = [...new Set(data.serials.map(s => s.category))];

  return (
    <div className="sn-tracking-container">
      {/* Header */}
      <div className="sn-tracking-header">
        <div className="sn-header-top-border" />
        <div className="sn-header-content">
          <div className="sn-header-left">
            <div className="sn-header-icon-wrap">
              <ScanBarcode className="w-6 h-6 sn-header-icon" />
            </div>
            <div>
              <h1 className="sn-header-title">Serial Number Tracking &amp; Traceability</h1>
              <p className="sn-header-subtitle">GS1 India Compliant — Full Chain of Custody Visibility</p>
            </div>
          </div>
          <div className="sn-header-badges">
            <div className="sn-badge sn-badge-primary">
              <Hash className="w-3.5 h-3.5" />
              <span>{totalSerials} Tracked</span>
            </div>
            <div className="sn-badge sn-badge-success">
              <Shield className="w-3.5 h-3.5" />
              <span>{complianceRate}% GS1</span>
            </div>
            <div className="sn-badge sn-badge-warning">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{openRecalls} Recalls</span>
            </div>
            <div className="sn-badge sn-badge-info">
              <Activity className="w-3.5 h-3.5" />
              <span>{todayScans} Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sn-tabs-bar">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`sn-tab ${activeTab === idx ? "sn-tab-active" : ""}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sn-tab-content">
        {/* Tab 0: Traceability Overview */}
        {activeTab === 0 && (
          <div className="sn-overview-grid">
            {/* KPI Cards */}
            {[
              { label: "Total Tracked", value: totalSerials, icon: <Hash className="w-5 h-5" />, gradient: "sn-kpi-gradient-1", sub: "Unique serial numbers" },
              { label: "Active Items", value: activeSerials, icon: <CheckCircle2 className="w-5 h-5" />, gradient: "sn-kpi-gradient-2", sub: `${Math.round(activeSerials / totalSerials * 100)}% of total` },
              { label: "Quarantined", value: quarantinedSerials, icon: <AlertCircle className="w-5 h-5" />, gradient: "sn-kpi-gradient-3", sub: "Under investigation" },
              { label: "Recalled", value: recalledSerials, icon: <Ban className="w-5 h-5" />, gradient: "sn-kpi-gradient-4", sub: `${data.recalls.filter(r => r.severity === "critical").length} critical` },
              { label: "GS1 Compliance", value: `${complianceRate}%`, icon: <Shield className="w-5 h-5" />, gradient: "sn-kpi-gradient-5", sub: `${totalSerials - gs1Compliant} non-compliant` },
              { label: "Open Recalls", value: openRecalls, icon: <AlertTriangle className="w-5 h-5" />, gradient: "sn-kpi-gradient-6", sub: "Active investigations" },
            ].map((kpi, idx) => (
              <div key={idx} className={`sn-kpi-card ${kpi.gradient} sn-stagger-${idx + 1}`}>
                <div className="sn-kpi-icon-wrap">{kpi.icon}</div>
                <div className="sn-kpi-text">
                  <p className="sn-kpi-label">{kpi.label}</p>
                  <p className="sn-kpi-value">{kpi.value}</p>
                  <p className="sn-kpi-sub">{kpi.sub}</p>
                </div>
              </div>
            ))}

            {/* Status Distribution Pie */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-7">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.primary }}>
                    <Layers className="w-4 h-4" />
                  </span>
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={statusDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#475569" }}>
                      {statusDist.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Scan Volume Trend */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-8">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.secondary }}>
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  Monthly Scan Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={data.scanTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="scans" fill={`url(#snScanGrad)`} stroke={THEME.primary} fillOpacity={0.3} name="Total Scans" />
                    <Line yAxisId="left" type="monotone" dataKey="uniqueSerials" stroke={THEME.secondary} strokeWidth={2} dot={false} name="Unique Serials" />
                    <Bar yAxisId="right" dataKey="exceptions" fill={THEME.danger} radius={[4, 4, 0, 0]} name="Exceptions" />
                    <defs>
                      <linearGradient id="snScanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.5} />
                        <stop offset="95%" stopColor={THEME.primary} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Scan Method Distribution */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-9">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.accent }}>
                    <ScanBarcode className="w-4 h-4" />
                  </span>
                  Scan Method Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={methodDist} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#475569" }}>
                      {methodDist.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Warehouse Scan Radar */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-10">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: "#8b5cf6" }}>
                    <Warehouse className="w-4 h-4" />
                  </span>
                  Warehouse Scan Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={warehouseScanRadar.map(w => ({ name: w.warehouse, scans: w.scans, compliance: w.compliance }))}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Radar name="Scans" dataKey="scans" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.2} />
                    <Radar name="Compliance %" dataKey="compliance" stroke={THEME.secondary} fill={THEME.secondary} fillOpacity={0.15} />
                    <Legend />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-11">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: "#ec4899" }}>
                    <PackageSearch className="w-4 h-4" />
                  </span>
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={catDist} cx="50%" cy="50%" outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#475569" }}>
                      {catDist.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Compliance by Category Bar */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-12">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: "#14b8a6" }}>
                    <CheckCheck className="w-4 h-4" />
                  </span>
                  Compliance by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.catCompliance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Legend />
                    <Bar dataKey="compliant" stackId="a" fill="#10b981" name="Compliant" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="nonCompliant" stackId="a" fill="#ef4444" name="Non-Compliant" />
                    <Bar dataKey="pendingReview" stackId="a" fill="#f59e0b" name="Pending Review" />
                    <Bar dataKey="exempt" stackId="a" fill="#6b7280" name="Exempt" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 1: Serial Register */}
        {activeTab === 1 && (
          <div className="sn-register-section">
            {/* Filter Bar */}
            <div className="sn-filter-bar">
              <div className="sn-filter-group">
                <div className="sn-search-wrap">
                  <Search className="w-4 h-4 sn-search-icon" />
                  <Input
                    placeholder="Search serial, product, batch, GTIN..."
                    className="sn-search-input"
                    value={searchSN}
                    onChange={(e) => setSearchSN(e.target.value)}
                  />
                </div>
                <select className="sn-filter-select" value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)}>
                  <option value="all">All Warehouses</option>
                  {WAREHOUSES.map(wh => <option key={wh} value={wh}>{wh}</option>)}
                </select>
                <select className="sn-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select className="sn-filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="sn-filter-select" value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
                  <option value="all">All Methods</option>
                  {Object.entries(SCAN_METHOD_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="sn-filter-info">
                <span className="sn-filter-count">{filteredSerials.length} of {totalSerials} records</span>
              </div>
            </div>

            {/* Table */}
            <div className="sn-table-wrap">
              <table className="sn-table">
                <thead>
                  <tr className="sn-table-head">
                    <th>Serial Number</th>
                    <th>Product</th>
                    <th>Batch / Lot</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Warehouse</th>
                    <th>Location</th>
                    <th>Scan Method</th>
                    <th>Scans</th>
                    <th>Last Scan</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSerials.slice(0, 50).map((s, idx) => {
                    const daysToExpiry = daysFromNow(s.expiryDate);
                    const isExpiringSoon = daysToExpiry > 0 && daysToExpiry <= 90;
                    const isExpired = daysToExpiry <= 0;
                    return (
                      <tr key={s.id} className={`sn-table-row sn-stagger-${(idx % 10) + 1}`}>
                        <td className="sn-cell-mono sn-cell-serial">
                          <div className="sn-cell-serial-inner">
                            <span className="sn-serial-text">{s.serialNumber}</span>
                            {s.recallFlag && <span className="sn-recall-flag" title="Recall Flag"><AlertTriangle className="w-3 h-3" /></span>}
                            {!s.gs1Compliant && <span className="sn-noncompliant-flag" title="Non-Compliant"><Ban className="w-3 h-3" /></span>}
                          </div>
                        </td>
                        <td className="sn-cell-product">
                          <span className="sn-product-name">{s.productName}</span>
                          <span className="sn-product-sku">{s.sku}</span>
                        </td>
                        <td>
                          <span className="sn-batch-text">{s.batchNumber}</span>
                          <span className="sn-lot-text">{s.lotNumber}</span>
                        </td>
                        <td><span className="sn-category-badge" data-cat={s.category}>{s.category}</span></td>
                        <td>
                          <span className="sn-status-badge" style={{ color: STATUS_CONFIG[s.status].color, backgroundColor: STATUS_CONFIG[s.status].bg, borderColor: STATUS_CONFIG[s.status].color }}>
                            <span className="sn-status-dot" style={{ backgroundColor: STATUS_CONFIG[s.status].color }} />
                            {STATUS_CONFIG[s.status].label}
                          </span>
                        </td>
                        <td className="sn-cell-warehouse">{s.warehouse}</td>
                        <td className="sn-cell-location">{s.currentLocation}</td>
                        <td>
                          <span className="sn-scan-method-badge" style={{ color: SCAN_METHOD_CONFIG[s.scanMethod].color, borderColor: SCAN_METHOD_CONFIG[s.scanMethod].color }}>
                            {SCAN_METHOD_CONFIG[s.scanMethod].label}
                          </span>
                        </td>
                        <td className="sn-cell-center">{s.scanCount}</td>
                        <td className="sn-cell-time">{timeAgo(s.lastScan)}</td>
                        <td>
                          <span className={`sn-expiry-badge ${isExpired ? "sn-expiry-expired" : isExpiringSoon ? "sn-expiry-warning" : "sn-expiry-ok"}`}>
                            {isExpired ? "Expired" : isExpiringSoon ? `${daysToExpiry}d left` : fmtDate(s.expiryDate)}
                          </span>
                        </td>
                        <td>
                          <Button size="sm" variant="outline" className="press-scale btn-outline-animate sn-action-btn" onClick={() => openDrawer(s)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Scan Activity */}
        {activeTab === 2 && (
          <div className="sn-activity-section">
            {/* Event Type Distribution */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-1">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.primary }}>
                    <Activity className="w-4 h-4" />
                  </span>
                  Event Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventDist} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} width={100} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {eventDist.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Scan Timeline Trend */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-2">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.secondary }}>
                    <Timer className="w-4 h-4" />
                  </span>
                  Avg Scan Time Trend (seconds)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.scanTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[0, "auto"]} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Area type="monotone" dataKey="avgScanTime" stroke={THEME.accent} fill={THEME.accent} fillOpacity={0.2} name="Avg Scan Time (s)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Filter Bar */}
            <div className="sn-filter-bar" style={{ marginTop: "1rem" }}>
              <div className="sn-filter-group">
                <select className="sn-filter-select" value={eventFilterType} onChange={(e) => setEventFilterType(e.target.value)}>
                  <option value="all">All Event Types</option>
                  {Object.entries(EVENT_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="sn-filter-info">
                <span className="sn-filter-count">{filteredEvents.length} events</span>
              </div>
            </div>

            {/* Scan Event Table */}
            <div className="sn-table-wrap">
              <table className="sn-table">
                <thead>
                  <tr className="sn-table-head">
                    <th>Event ID</th>
                    <th>Serial Number</th>
                    <th>Product</th>
                    <th>Event Type</th>
                    <th>Scan Method</th>
                    <th>Location</th>
                    <th>Warehouse</th>
                    <th>From → To</th>
                    <th>Scanned By</th>
                    <th>Timestamp</th>
                    <th>Temp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.slice(0, 60).map((e, idx) => (
                    <tr key={e.id} className={`sn-table-row sn-stagger-${(idx % 10) + 1}`}>
                      <td className="sn-cell-mono">{e.id}</td>
                      <td className="sn-cell-serial-sn">{e.serialNumber}</td>
                      <td className="sn-cell-product-sm">{e.productName}</td>
                      <td>
                        <span className="sn-event-badge" style={{ color: EVENT_CONFIG[e.eventType].color, backgroundColor: `${EVENT_CONFIG[e.eventType].color}20`, borderColor: EVENT_CONFIG[e.eventType].color }}>
                          {EVENT_CONFIG[e.eventType].label}
                        </span>
                      </td>
                      <td>
                        <span className="sn-scan-method-badge" style={{ color: SCAN_METHOD_CONFIG[e.scanMethod].color, borderColor: SCAN_METHOD_CONFIG[e.scanMethod].color }}>
                          {SCAN_METHOD_CONFIG[e.scanMethod].label}
                        </span>
                      </td>
                      <td className="sn-cell-location-sm">{e.location.replace(/_/g, " ")}</td>
                      <td className="sn-cell-warehouse-sm">{e.warehouse}</td>
                      <td>
                        {e.fromLocation && e.toLocation ? (
                          <span className="sn-transfer-badge">
                            <ArrowRightLeft className="w-3 h-3" />
                            {e.fromLocation} → {e.toLocation}
                          </span>
                        ) : "—"}
                      </td>
                      <td>{e.scannedBy}</td>
                      <td className="sn-cell-time">{fmtDateTime(e.timestamp)}</td>
                      <td>{e.temperature !== null ? `${e.temperature}°C` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Recall Tracker */}
        {activeTab === 3 && (
          <div className="sn-recall-section">
            {/* Recall KPIs */}
            <div className="sn-recall-kpis">
              <div className="sn-recall-kpi sn-recall-kpi-open sn-stagger-1">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <p className="sn-recall-kpi-value">{data.recalls.filter(r => r.status === "open").length}</p>
                  <p className="sn-recall-kpi-label">Open</p>
                </div>
              </div>
              <div className="sn-recall-kpi sn-recall-kpi-progress sn-stagger-2">
                <RefreshCw className="w-5 h-5" />
                <div>
                  <p className="sn-recall-kpi-value">{data.recalls.filter(r => r.status === "in_progress").length}</p>
                  <p className="sn-recall-kpi-label">In Progress</p>
                </div>
              </div>
              <div className="sn-recall-kpi sn-recall-kpi-completed sn-stagger-3">
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <p className="sn-recall-kpi-value">{data.recalls.filter(r => r.status === "completed").length}</p>
                  <p className="sn-recall-kpi-label">Completed</p>
                </div>
              </div>
              <div className="sn-recall-kpi sn-recall-kpi-closed sn-stagger-4">
                <CheckCheck className="w-5 h-5" />
                <div>
                  <p className="sn-recall-kpi-value">{data.recalls.filter(r => r.status === "closed").length}</p>
                  <p className="sn-recall-kpi-label">Closed</p>
                </div>
              </div>
              <div className="sn-recall-kpi sn-recall-kpi-total sn-stagger-5">
                <PackageSearch className="w-5 h-5" />
                <div>
                  <p className="sn-recall-kpi-value">{data.recalls.reduce((a, r) => a + r.affectedUnits, 0)}</p>
                  <p className="sn-recall-kpi-label">Total Affected</p>
                </div>
              </div>
              <div className="sn-recall-kpi sn-recall-kpi-recovered sn-stagger-6">
                <RotateCcw className="w-5 h-5" />
                <div>
                  <p className="sn-recall-kpi-value">{data.recalls.reduce((a, r) => a + r.recoveredUnits, 0)}</p>
                  <p className="sn-recall-kpi-label">Recovered</p>
                </div>
              </div>
            </div>

            {/* Recall Severity Pie */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-7">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.danger }}>
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  Recall Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={["low", "medium", "high", "critical"].map(sev => ({ name: sev.charAt(0).toUpperCase() + sev.slice(1), value: data.recalls.filter(r => r.severity === sev).length, color: RECALL_COLORS[sev as RecallSeverity] }))} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {(["low", "medium", "high", "critical"] as const).map((sev, idx) => (
                        <Cell key={idx} fill={RECALL_COLORS[sev]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recall Recovery Rate Bar */}
            <Card className="hover-lift-sm sn-chart-card sn-stagger-8">
              <CardHeader className="sn-card-header">
                <CardTitle className="sn-card-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.success }}>
                    <RotateCcw className="w-4 h-4" />
                  </span>
                  Recovery Rate by Recall
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.recalls.map(r => ({
                    name: r.recallId,
                    affected: r.affectedUnits,
                    recovered: r.recoveredUnits,
                    remaining: r.affectedUnits - r.recoveredUnits,
                    severity: r.severity,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Legend />
                    <Bar dataKey="recovered" stackId="a" fill="#10b981" name="Recovered" />
                    <Bar dataKey="remaining" stackId="a" fill="#ef4444" name="Remaining" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Filter */}
            <div className="sn-filter-bar" style={{ marginTop: "1rem" }}>
              <div className="sn-filter-group">
                <select className="sn-filter-select" value={recallFilterSeverity} onChange={(e) => setRecallFilterSeverity(e.target.value)}>
                  <option value="all">All Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <select className="sn-filter-select" value={recallFilterStatus} onChange={(e) => setRecallFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="sn-filter-info">
                <span className="sn-filter-count">{filteredRecalls.length} recalls</span>
              </div>
            </div>

            {/* Recall Table */}
            <div className="sn-table-wrap">
              <table className="sn-table">
                <thead>
                  <tr className="sn-table-head">
                    <th>Recall ID</th>
                    <th>Product</th>
                    <th>Batch</th>
                    <th>Severity</th>
                    <th>Affected</th>
                    <th>Recovered</th>
                    <th>Recovery %</th>
                    <th>Status</th>
                    <th>Initiated</th>
                    <th>Initiated By</th>
                    <th>Warehouse</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecalls.map((r, idx) => {
                    const recoveryPct = Math.round((r.recoveredUnits / r.affectedUnits) * 100);
                    return (
                      <tr key={r.id} className={`sn-table-row sn-stagger-${(idx % 10) + 1}`}>
                        <td className="sn-cell-mono sn-cell-recall-id">{r.recallId}</td>
                        <td className="sn-cell-product-sm">{r.productName}</td>
                        <td className="sn-cell-mono">{r.batchNumber}</td>
                        <td>
                          <span className="sn-severity-badge" style={{ color: RECALL_COLORS[r.severity], backgroundColor: `${RECALL_COLORS[r.severity]}20`, borderColor: RECALL_COLORS[r.severity] }}>
                            <span className="sn-severity-dot" style={{ backgroundColor: RECALL_COLORS[r.severity] }} />
                            {r.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="sn-cell-center">{r.affectedUnits}</td>
                        <td className="sn-cell-center">{r.recoveredUnits}</td>
                        <td>
                          <div className="sn-recovery-bar-wrap">
                            <div className="sn-recovery-bar" style={{ width: `${recoveryPct}%`, backgroundColor: recoveryPct >= 80 ? "#10b981" : recoveryPct >= 50 ? "#f59e0b" : "#ef4444" }} />
                            <span className="sn-recovery-pct">{recoveryPct}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`sn-recall-status-badge sn-recall-status-${r.status}`}>
                            {r.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td>{fmtDate(r.initiatedDate)}</td>
                        <td>{r.initiatedBy}</td>
                        <td className="sn-cell-warehouse-sm">{r.warehouse}</td>
                        <td className="sn-cell-reason">{r.reason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: GS1 Compliance */}
        {activeTab === 4 && (
          <div className="sn-compliance-section">
            {/* Compliance KPIs */}
            <div className="sn-compliance-kpis">
              <div className="sn-comp-kpi sn-comp-kpi-total sn-stagger-1">
                <Fingerprint className="w-5 h-5" />
                <div>
                  <p className="sn-comp-kpi-value">{totalSerials}</p>
                  <p className="sn-comp-kpi-label">Total Items</p>
                </div>
              </div>
              <div className="sn-comp-kpi sn-comp-kpi-compliant sn-stagger-2">
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <p className="sn-comp-kpi-value">{gs1Compliant}</p>
                  <p className="sn-comp-kpi-label">GS1 Compliant</p>
                </div>
              </div>
              <div className="sn-comp-kpi sn-comp-kpi-noncompliant sn-stagger-3">
                <Ban className="w-5 h-5" />
                <div>
                  <p className="sn-comp-kpi-value">{totalSerials - gs1Compliant}</p>
                  <p className="sn-comp-kpi-label">Non-Compliant</p>
                </div>
              </div>
              <div className="sn-comp-kpi sn-comp-kpi-rate sn-stagger-4">
                <Shield className="w-5 h-5" />
                <div>
                  <p className="sn-comp-kpi-value">{complianceRate}%</p>
                  <p className="sn-comp-kpi-label">Compliance Rate</p>
                </div>
              </div>
            </div>

            {/* Verification Table */}
            <div className="sn-table-wrap">
              <table className="sn-table">
                <thead>
                  <tr className="sn-table-head">
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Warehouse</th>
                    <th>Total Scanned</th>
                    <th>Passed</th>
                    <th>Failed</th>
                    <th>Pending</th>
                    <th>Pass Rate</th>
                    <th>Compliance</th>
                    <th>Last Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {data.verifications.map((v, idx) => {
                    const passRate = Math.round((v.passed / v.totalScanned) * 100);
                    return (
                      <tr key={v.id} className={`sn-table-row sn-stagger-${(idx % 10) + 1}`}>
                        <td className="sn-cell-product-sm">{v.productName}</td>
                        <td className="sn-cell-mono">{v.sku}</td>
                        <td className="sn-cell-warehouse-sm">{v.warehouse}</td>
                        <td className="sn-cell-center">{v.totalScanned}</td>
                        <td className="sn-cell-center sn-cell-green">{v.passed}</td>
                        <td className="sn-cell-center sn-cell-red">{v.failed}</td>
                        <td className="sn-cell-center sn-cell-amber">{v.pending}</td>
                        <td>
                          <div className="sn-pass-bar-wrap">
                            <div className="sn-pass-bar" style={{ width: `${passRate}%`, backgroundColor: passRate >= 90 ? "#10b981" : passRate >= 70 ? "#f59e0b" : "#ef4444" }} />
                            <span className="sn-pass-pct">{passRate}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`sn-compliance-badge sn-compliance-${v.compliance}`}>
                            {v.compliance.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="sn-cell-time">{fmtDate(v.lastAudit)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {showDrawer && selectedSerial && (
        <>
          <div className="sn-drawer-backdrop" onClick={() => setShowDrawer(false)} />
          <div className="sn-drawer">
            <div className="sn-drawer-header">
              <div>
                <h3 className="sn-drawer-title">{selectedSerial.serialNumber}</h3>
                <p className="sn-drawer-subtitle">{selectedSerial.productName}</p>
              </div>
              <button className="sn-drawer-close" onClick={() => setShowDrawer(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="sn-drawer-body">
              {/* Status Banner */}
              <div className="sn-drawer-status-banner" style={{ borderColor: STATUS_CONFIG[selectedSerial.status].color, backgroundColor: STATUS_CONFIG[selectedSerial.status].bg }}>
                <span className="sn-drawer-status-dot" style={{ backgroundColor: STATUS_CONFIG[selectedSerial.status].color }} />
                <span className="sn-drawer-status-label" style={{ color: STATUS_CONFIG[selectedSerial.status].color }}>
                  {STATUS_CONFIG[selectedSerial.status].label}
                </span>
                {selectedSerial.recallFlag && (
                  <span className="sn-drawer-recall-badge">
                    <AlertTriangle className="w-3.5 h-3.5" /> RECALL FLAG
                  </span>
                )}
                {!selectedSerial.gs1Compliant && (
                  <span className="sn-drawer-noncompliant-badge">
                    <Ban className="w-3.5 h-3.5" /> NON-COMPLIANT
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="sn-drawer-section">
                <h4 className="sn-drawer-section-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.primary }}>
                    <PackageSearch className="w-4 h-4" />
                  </span>
                  Product Information
                </h4>
                <div className="sn-drawer-info-grid">
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">SKU</span>
                    <span className="sn-info-value">{selectedSerial.sku}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">GTIN</span>
                    <span className="sn-info-value sn-info-mono">{selectedSerial.gtin}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Category</span>
                    <span className="sn-info-value">{selectedSerial.category}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Manufacturer</span>
                    <span className="sn-info-value">{selectedSerial.manufacturer}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Batch Number</span>
                    <span className="sn-info-value sn-info-mono">{selectedSerial.batchNumber}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Lot Number</span>
                    <span className="sn-info-value sn-info-mono">{selectedSerial.lotNumber}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Mfg Date</span>
                    <span className="sn-info-value">{fmtDate(selectedSerial.mfgDate)}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Expiry Date</span>
                    <span className="sn-info-value">{fmtDate(selectedSerial.expiryDate)} ({daysFromNow(selectedSerial.expiryDate)}d)</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Weight</span>
                    <span className="sn-info-value">{selectedSerial.weight}g</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Dimensions</span>
                    <span className="sn-info-value">{selectedSerial.dimensions}</span>
                  </div>
                </div>
              </div>

              {/* Location & Scanning */}
              <div className="sn-drawer-section">
                <h4 className="sn-drawer-section-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.secondary }}>
                    <MapPin className="w-4 h-4" />
                  </span>
                  Location &amp; Scanning
                </h4>
                <div className="sn-drawer-info-grid">
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Warehouse</span>
                    <span className="sn-info-value">{selectedSerial.warehouse}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Current Location</span>
                    <span className="sn-info-value">{selectedSerial.currentLocation}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Scan Method</span>
                    <span className="sn-info-value">{SCAN_METHOD_CONFIG[selectedSerial.scanMethod].label}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Last Scanned By</span>
                    <span className="sn-info-value">{selectedSerial.scannedBy}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Total Scans</span>
                    <span className="sn-info-value">{selectedSerial.scanCount}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">First Scan</span>
                    <span className="sn-info-value">{fmtDateTime(selectedSerial.firstScan)}</span>
                  </div>
                  <div className="sn-drawer-info-item">
                    <span className="sn-info-label">Last Scan</span>
                    <span className="sn-info-value">{timeAgo(selectedSerial.lastScan)}</span>
                  </div>
                  {selectedSerial.temperature !== null && (
                    <div className="sn-drawer-info-item">
                      <span className="sn-info-label">Temperature</span>
                      <span className="sn-info-value sn-info-temp">{selectedSerial.temperature}°C</span>
                    </div>
                  )}
                  {selectedSerial.humidity !== null && (
                    <div className="sn-drawer-info-item">
                      <span className="sn-info-label">Humidity</span>
                      <span className="sn-info-value">{selectedSerial.humidity}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quarantine/Recall Info */}
              {selectedSerial.quarantineReason && (
                <div className="sn-drawer-section">
                  <h4 className="sn-drawer-section-title">
                    <span className="sn-chart-title-icon" style={{ background: THEME.danger }}>
                      <AlertCircle className="w-4 h-4" />
                    </span>
                    Quarantine / Hold Reason
                  </h4>
                  <div className="sn-drawer-quarantine-box">
                    <p className="sn-quarantine-text">{selectedSerial.quarantineReason}</p>
                  </div>
                </div>
              )}

              {/* Chain of Custody Timeline */}
              <div className="sn-drawer-section">
                <h4 className="sn-drawer-section-title">
                  <span className="sn-chart-title-icon" style={{ background: THEME.accent }}>
                    <History className="w-4 h-4" />
                  </span>
                  Chain of Custody ({serialTimeline.length} events)
                </h4>
                <div className="sn-timeline">
                  {serialTimeline.map((evt, idx) => (
                    <div key={evt.id} className="sn-timeline-item">
                      <div className="sn-timeline-connector">
                        <div className="sn-timeline-dot" style={{ backgroundColor: EVENT_CONFIG[evt.eventType].color }} />
                        {idx < serialTimeline.length - 1 && <div className="sn-timeline-line" />}
                      </div>
                      <div className="sn-timeline-content">
                        <div className="sn-timeline-header">
                          <span className="sn-timeline-event" style={{ color: EVENT_CONFIG[evt.eventType].color }}>
                            {EVENT_CONFIG[evt.eventType].label}
                          </span>
                          <span className="sn-timeline-time">{fmtDateTime(evt.timestamp)}</span>
                        </div>
                        <div className="sn-timeline-details">
                          <span className="sn-timeline-detail">
                            <MapPin className="w-3 h-3" /> {evt.location.replace(/_/g, " ")}
                          </span>
                          <span className="sn-timeline-detail">
                            <Users className="w-3 h-3" /> {evt.scannedBy}
                          </span>
                          <span className="sn-timeline-detail">
                            <ScanBarcode className="w-3 h-3" /> {SCAN_METHOD_CONFIG[evt.scanMethod].label}
                          </span>
                          {evt.fromLocation && (
                            <span className="sn-timeline-detail">
                              <ArrowRightLeft className="w-3 h-3" /> {evt.fromLocation} → {evt.toLocation}
                            </span>
                          )}
                          {evt.temperature !== null && (
                            <span className="sn-timeline-detail">
                              <Activity className="w-3 h-3" /> {evt.temperature}°C
                            </span>
                          )}
                        </div>
                        <p className="sn-timeline-note">{evt.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
