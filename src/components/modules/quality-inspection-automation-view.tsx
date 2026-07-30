"use client"
import { useState, useMemo } from "react"
import {
  BarChart, Bar, AreaChart, Area, ComposedChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search, TrendingUp, TrendingDown, Minus, ArrowUpDown, Filter,
  X, ChevronRight, Clock, MapPin, Star, AlertTriangle, CheckCircle2,
  FileText, IndianRupee, Eye, Download, RefreshCw, ArrowUpRight,
  ArrowDownRight, Globe, Building, Truck, PackageCheck, Timer,
  DollarSign, Percent, Thermometer, Cpu, Camera, BarChart3,
  Target, Zap, ShieldCheck, ShieldAlert, Wrench, CircleDot,
  Factory, Boxes, ScanBarcode, ClipboardCheck, Brain,
} from "lucide-react"

// ─── Seed & Helpers ──────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  s = (s * 16807) % 2147483647
  return (s - 1) / 2147483646
}
const pick = <T,>(arr: T[], seed: number) => arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const rf = (min: number, max: number, seed: number) => +(seededRandom(seed) * (max - min) + min).toFixed(2)
const formatINR = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : `₹${n.toLocaleString("en-IN")}`
const formatPct = (n: number) => `${n.toFixed(1)}%`

// ─── Enums ────────────────────────────────────────────────
const WAREHOUSES = [
  "Mumbai Hub", "Delhi NCR Hub", "Bengaluru DC", "Chennai DC",
  "Hyderabad DC", "Pune Warehouse", "Kolkata Hub", "Ahmedabad DC",
] as const
const ZONES = ["West", "North", "South", "South", "West", "West", "East", "West"] as const
const PRODUCT_CATEGORIES = [
  "Electronics", "FMCG", "Pharmaceuticals", "Apparel", "Automotive Parts",
  "Food & Beverage", "Cosmetics", "Industrial", "Consumer Durables", "Agricultural",
] as const
const INSPECTION_TYPES = [
  "Visual Inspection", "Dimensional Check", "Weight Verification",
  "Barcode/Label Scan", "Color Consistency", "Surface Defect Detection",
  "Seal Integrity", "Packaging Compliance", "Temperature Check", "AI Vision Analysis",
] as const
const DEFECT_CATEGORIES = [
  "Cosmetic Damage", "Functional Defect", "Missing Components",
  "Wrong Label", "Size Mismatch", "Color Variation", "Packaging Damage",
  "Contamination", "Weight Out of Spec", "Seal Broken",
] as const
const SEVERITY_LEVELS = ["Critical", "Major", "Minor", "Informational"] as const
const AI_CONFIDENCE_LEVELS = ["High (>95%)", "Medium (85-95%)", "Low (<85%)"] as const
const INSPECTION_STATUSES = ["Passed", "Failed", "Conditional", "In Progress", "Quarantined"] as const
const SENSOR_TYPES = ["Camera", "Thermal Sensor", "IR Scanner", "Laser Gauge", "Load Cell", "X-Ray"] as const
const AUTOMATION_RULES = [
  "Auto-reject critical defects", "Auto-pass high-confidence passes",
  "Quarantine low-confidence fails", "Route to rework", "Flag for manual review",
  "Trigger root-cause analysis", "Batch hold on pattern detection",
] as const

// ─── Types ────────────────────────────────────────────────
interface InspectionRecord {
  id: string; batch: string; sku: string; product: string; category: string;
  type: string; warehouse: string; zone: string; status: string;
  severity: string; aiConfidence: number; aiModel: string; sensorUsed: string;
  defects: number; defectType: string; inspector: string; duration: number;
  timestamp: string; autoProcessed: boolean; retried: boolean; costSaved: number;
}
interface DefectLog {
  id: string; batch: string; product: string; category: string;
  defectType: string; severity: string; location: string; warehouse: string;
  description: string; detectedBy: string; aiFlagged: boolean; confidence: number;
  imageCaptured: boolean; actionTaken: string; costImpact: number; timestamp: string;
}
interface InspectionStation {
  id: string; name: string; warehouse: string; type: string; sensorType: string;
  status: string; throughput: number; avgAccuracy: number; totalInspected: number;
  defectsFound: number; uptime: number; aiModel: string; lastCalibrated: string;
  nextMaintenance: string; operator: string;
}
interface AIModel {
  id: string; name: string; version: string; category: string; accuracy: number;
  precision: number; recall: number; f1Score: number; trainingSamples: number;
  lastRetrained: string; inferenceTime: number; isActive: boolean;
  misclassificationRate: number; warehouse: string;
}
interface CostRecord {
  id: string; period: string; warehouse: string; laborSaved: number;
  automationInvestment: number; roi: number; defectsPrevented: number;
  costOfQuality: number; scrapReduction: number; throughputGain: number;
}

// ─── Data Generation ─────────────────────────────────────
function generateData() {
  const indianNames = [
    "Arjun Sharma", "Priya Patel", "Rahul Mehta", "Sneha Iyer", "Vikram Singh",
    "Ananya Reddy", "Rajesh Kumar", "Deepika Nair", "Amit Joshi", "Kavitha Das",
    "Sanjay Gupta", "Meera Menon", "Karthik Rao", "Pooja Saxena", "Sunil Verma",
  ]
  const aiModels = ["QC-Vision v3.2", "DefectNet v2.1", "PackGuard v1.8", "SurfaceScan v4.0", "ClassifyPro v2.5"]
  const locations = ["Outer Surface", "Inner Surface", "Top Seal", "Bottom Edge", "Side Panel",
    "Label Area", "Cap/Closure", "Hinge Area", "Print Quality", "Corner Joint"]

  const inspections: InspectionRecord[] = []
  for (let i = 0; i < 90; i++) {
    const seed = i * 137 + 42
    const hasDefect = seededRandom(seed + 1) > 0.7
    const aiConf = rf(72, 99.8, seed + 2)
    inspections.push({
      id: `QIA-${String(i + 1).padStart(5, "0")}`,
      batch: `BATCH-${ri(1000, 9999, seed + 3)}`,
      sku: `SKU-${String.fromCharCode(65 + ri(0, 25, seed + 4))}${ri(1000, 9999, seed + 5)}`,
      product: pick([...PRODUCT_CATEGORIES], seed + 6) as string,
      type: pick([...INSPECTION_TYPES], seed + 7) as string,
      category: pick([...PRODUCT_CATEGORIES], seed + 6) as string,
      warehouse: WAREHOUSES[i % WAREHOUSES.length] as string,
      zone: ZONES[i % ZONES.length] as string,
      status: hasDefect ? pick([...INSPECTION_STATUSES].slice(1, 5), seed + 8) as string : "Passed",
      severity: hasDefect ? pick([...SEVERITY_LEVELS], seed + 9) as string : "Informational",
      aiConfidence: aiConf,
      aiModel: pick(aiModels, seed + 10),
      sensorUsed: pick([...SENSOR_TYPES], seed + 11) as string,
      defects: hasDefect ? ri(1, 8, seed + 12) : 0,
      defectType: hasDefect ? pick([...DEFECT_CATEGORIES], seed + 13) as string : "None",
      inspector: aiConf > 90 ? "AI Auto" : pick(indianNames, seed + 14) as string,
      duration: ri(2, 45, seed + 15),
      timestamp: `2025-${String(ri(1, 12, seed + 16)).padStart(2, "0")}-${String(ri(1, 28, seed + 17)).padStart(2, "0")} ${String(ri(6, 22, seed + 18)).padStart(2, "0")}:${String(ri(0, 59, seed + 19)).padStart(2, "0")}`,
      autoProcessed: aiConf > 90 && !hasDefect,
      retried: hasDefect && seededRandom(seed + 20) > 0.8,
      costSaved: hasDefect ? ri(500, 25000, seed + 21) : ri(50, 500, seed + 22),
    })
  }

  const defects: DefectLog[] = []
  for (let i = 0; i < 65; i++) {
    const seed = i * 199 + 77
    const aiFlagged = seededRandom(seed + 1) > 0.35
    defects.push({
      id: `DEF-${String(i + 1).padStart(5, "0")}`,
      batch: `BATCH-${ri(1000, 9999, seed + 2)}`,
      product: pick([...PRODUCT_CATEGORIES], seed + 3) as string,
      category: pick([...DEFECT_CATEGORIES], seed + 4),
      defectType: pick([...DEFECT_CATEGORIES], seed + 4) as string,
      severity: pick([...SEVERITY_LEVELS], seed + 5) as string,
      location: pick(locations, seed + 6) as string,
      warehouse: WAREHOUSES[i % WAREHOUSES.length] as string,
      description: `${pick(["Minor scratch", "Dent on surface", "Label misaligned", "Color fade", "Seal compromised", "Missing screw", "Size out of tolerance", "Surface contamination"], seed + 7)} detected during ${pick([...INSPECTION_TYPES], seed + 8)}`,
      detectedBy: aiFlagged ? "AI Vision" : pick(indianNames, seed + 9) as string,
      aiFlagged,
      confidence: rf(60, 99, seed + 10),
      imageCaptured: seededRandom(seed + 11) > 0.15,
      actionTaken: pick(["Rejected", "Reworked", "Quarantined", "Manual Review", "Root Cause Analysis"], seed + 12) as string,
      costImpact: ri(200, 50000, seed + 13),
      timestamp: `2025-${String(ri(1, 12, seed + 14)).padStart(2, "0")}-${String(ri(1, 28, seed + 15)).padStart(2, "0")} ${String(ri(6, 22, seed + 16)).padStart(2, "0")}:${String(ri(0, 59, seed + 17)).padStart(2, "0")}`,
    })
  }

  const stations: InspectionStation[] = []
  for (let i = 0; i < 24; i++) {
    const seed = i * 223 + 99
    stations.push({
      id: `STA-${String(i + 1).padStart(3, "0")}`,
      name: `${WAREHOUSES[i % WAREHOUSES.length]} Station ${ri(1, 5, seed)}`,
      warehouse: WAREHOUSES[i % WAREHOUSES.length] as string,
      type: pick([...INSPECTION_TYPES], seed + 1) as string,
      sensorType: pick([...SENSOR_TYPES], seed + 2) as string,
      status: seededRandom(seed + 3) > 0.15 ? "Online" : seededRandom(seed + 3) > 0.5 ? "Maintenance" : "Offline",
      throughput: ri(200, 2000, seed + 4),
      avgAccuracy: rf(85, 99.5, seed + 5),
      totalInspected: ri(10000, 500000, seed + 6),
      defectsFound: ri(50, 5000, seed + 7),
      uptime: rf(85, 99.9, seed + 8),
      aiModel: pick(aiModels, seed + 9),
      lastCalibrated: `2025-${String(ri(1, 6, seed + 10)).padStart(2, "0")}-${ri(1, 28, seed + 11)}`,
      nextMaintenance: `2025-${String(ri(7, 12, seed + 12)).padStart(2, "0")}-${ri(1, 28, seed + 13)}`,
      operator: pick(indianNames, seed + 14),
    })
  }

  const aiModelsData: AIModel[] = []
  for (let i = 0; i < 10; i++) {
    const seed = i * 311 + 55
    const precision = rf(80, 99, seed + 1)
    const recall = rf(82, 98, seed + 2)
    const f1 = +(2 * precision * recall / (precision + recall)).toFixed(2)
    aiModelsData.push({
      id: `AI-${String(i + 1).padStart(3, "0")}`,
      name: pick(aiModels, seed) as string,
      version: `v${ri(1, 5, seed + 1)}.${ri(0, 9, seed + 2)}.${ri(0, 9, seed + 3)}`,
      category: pick([...PRODUCT_CATEGORIES], seed + 4) as string,
      accuracy: rf(88, 99.5, seed + 5),
      precision, recall, f1Score: f1,
      trainingSamples: ri(50000, 2000000, seed + 6),
      lastRetrained: `2025-${String(ri(1, 12, seed + 7)).padStart(2, "0")}-15`,
      inferenceTime: rf(15, 200, seed + 8),
      isActive: seededRandom(seed + 9) > 0.2,
      misclassificationRate: rf(0.5, 8, seed + 10),
      warehouse: WAREHOUSES[i % WAREHOUSES.length] as string,
    })
  }

  const costs: CostRecord[] = []
  for (let i = 0; i < 32; i++) {
    const seed = i * 373 + 88
    const laborSaved = ri(200000, 5000000, seed)
    const investment = ri(500000, 10000000, seed + 1)
    costs.push({
      id: `QIA-COST-${String(i + 1).padStart(4, "0")}`,
      period: `Q${ri(1, 4, seed + 2)} 2025`,
      warehouse: WAREHOUSES[i % WAREHOUSES.length] as string,
      laborSaved,
      automationInvestment: investment,
      roi: +((laborSaved - investment * 0.3) / (investment * 0.3) * 100).toFixed(1),
      defectsPrevented: ri(200, 10000, seed + 3),
      costOfQuality: ri(100000, 3000000, seed + 4),
      scrapReduction: rf(5, 35, seed + 5),
      throughputGain: rf(10, 60, seed + 6),
    })
  }

  const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
    const seed = i * 47 + 100
    return {
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      totalInspected: ri(15000, 80000, seed),
      passRate: rf(88, 98, seed + 1),
      aiAccuracy: rf(90, 99, seed + 2),
      defectsFound: ri(200, 2000, seed + 3),
      autoProcessed: ri(10000, 60000, seed + 4),
      laborSaved: ri(500000, 3000000, seed + 5),
    }
  })
  const severityDist = SEVERITY_LEVELS.map(s => ({
    severity: s, count: defects.filter(d => d.severity === s).length,
    color: s === "Critical" ? "#dc2626" : s === "Major" ? "#f59e0b" : s === "Minor" ? "#6366f1" : "#94a3b8",
  }))
  const defectTypeDist = DEFECT_CATEGORIES.slice(0, 7).map(dt => ({
    type: dt, count: defects.filter(d => d.defectType === dt).length,
    color: ["#0d9488", "#6366f1", "#e11d48", "#f59e0b", "#8b5cf6", "#0ea5e9", "#ec4899"][DEFECT_CATEGORIES.indexOf(dt) % 7],
  }))
  const warehouseAccuracy = WAREHOUSES.map((wh, idx) => {
    const seed = idx * 61 + 200
    return { warehouse: wh, accuracy: rf(90, 99, seed), throughput: ri(5000, 20000, seed + 1), defects: ri(50, 800, seed + 2) }
  })
  const aiVsManual = [
    { metric: "Accuracy", ai: 96.5, manual: 88.2 },
    { metric: "Speed (units/hr)", ai: 850, manual: 200 },
    { metric: "Consistency %", ai: 98.1, manual: 72.5 },
    { metric: "Cost per Unit", ai: 1.2, manual: 8.5 },
    { metric: "Defect Catch Rate", ai: 94.8, manual: 78.3 },
  ]

  return {
    inspections, defects, stations, aiModels: aiModelsData, costs, monthlyTrend,
    severityDist, defectTypeDist, warehouseAccuracy, aiVsManual,
    WAREHOUSES, ZONES, PRODUCT_CATEGORIES, INSPECTION_TYPES, DEFECT_CATEGORIES,
    SEVERITY_LEVELS, AI_CONFIDENCE_LEVELS, INSPECTION_STATUSES, SENSOR_TYPES, AUTOMATION_RULES,
    SEVERITY_COLORS: { Critical: "#dc2626", Major: "#f59e0b", Minor: "#6366f1", Informational: "#94a3b8" },
    STATUS_COLORS: { Passed: "#10b981", Failed: "#dc2626", Conditional: "#f59e0b", "In Progress": "#6366f1", Quarantined: "#8b5cf6" },
  }
}

const data = generateData()

// ─── Helper Components ───────────────────────────────────
function FieldGrid({ fields }: { fields: { label: string; value: string; icon?: React.ReactNode }[] }) {
  return (
    <div className="qia-drawer-field-grid">
      {fields.map((f, i) => (
        <div key={i} className="qia-drawer-field">
          <span className="qia-drawer-field-label">{f.icon}{f.label}</span>
          <span className="qia-drawer-field-value">{f.value}</span>
        </div>
      ))}
    </div>
  )
}
function MetricsRow({ metrics }: { metrics: { label: string; value: string; color: string }[] }) {
  return (
    <div className="qia-drawer-metrics-row">
      {metrics.map((m, i) => (
        <div key={i} className={`qia-drawer-metric-card qia-metric-${m.color}`}>
          <span className="qia-drawer-metric-label">{m.label}</span>
          <span className="qia-drawer-metric-value">{m.value}</span>
        </div>
      ))}
    </div>
  )
}
function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 95 ? "#10b981" : value >= 85 ? "#f59e0b" : "#ef4444"
  return (
    <div className="qia-confidence-bar">
      <div className="qia-cb-track"><div className="qia-cb-fill" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} /></div>
      <span className="qia-cb-value" style={{ color }}>{formatPct(value)}</span>
    </div>
  )
}
function SeverityBadge({ severity }: { severity: string }) {
  const cls: Record<string, string> = { Critical: "qia-severity-critical", Major: "qia-severity-major", Minor: "qia-severity-minor", Informational: "qia-severity-info" }
  return <span className={`qia-severity-badge ${cls[severity] || ""}`}>{severity}</span>
}
function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = { Passed: "qia-status-passed", Failed: "qia-status-failed", Conditional: "qia-status-conditional", "In Progress": "qia-status-progress", Quarantined: "qia-status-quarantined" }
  return <span className={`qia-status-badge ${cls[status] || ""}`}>{status}</span>
}
function ScoreGauge({ score, label }: { score: number; label: string }) {
  const r = 28; const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 95 ? "#10b981" : score >= 85 ? "#6366f1" : score >= 70 ? "#f59e0b" : "#ef4444"
  return (
    <div className="qia-gauge-wrap">
      <svg width={72} height={72} className="qia-gauge">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 36 36)`} />
        <text x="36" y="36" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="800" fill={color}>{score.toFixed(1)}</text>
      </svg>
      <span className="qia-gauge-label">{label}</span>
    </div>
  )
}

// ─── Sort Helper ──────────────────────────────────────────
function sortBy(arr: any[], key: string, dir: "asc" | "desc"): any[] {
  return [...arr].sort((a, b) => {
    const va = a[key]; const vb = b[key]
    if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va
    return dir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
  })
}

// ─── Drawers ───────────────────────────────────────────────
function InspectionDrawer({ v, onClose }: { v: any; onClose: () => void }) {
  return (
    <>
      <div className="qia-drawer-overlay" onClick={onClose} />
      <div className="qia-drawer-panel">
        <div className="qia-drawer-header qia-header-inspection">
          <div className="qia-drawer-header-info">
            <h3 className="qia-drawer-title">{v.id}</h3>
            <div className="qia-drawer-subtitle">
              <StatusBadge status={v.status} />
              <SeverityBadge severity={v.severity} />
              <MapPin size={13} /> {v.warehouse}
            </div>
          </div>
          <button onClick={onClose} className="qia-drawer-close"><X size={18} /></button>
        </div>
        <div className="qia-drawer-body">
          <div className="qia-drawer-visual">
            <ScoreGauge score={v.aiConfidence} label="AI Confidence" />
            <div className="qia-drawer-inspection-stats">
              <div className="qia-stat-chip"><ScanBarcode size={14} /> {v.type}</div>
              <div className={`qia-stat-chip ${v.autoProcessed ? "qia-chip-auto" : ""}`}>{v.autoProcessed ? <Cpu size={14} /> : <Brain size={14} />}{v.autoProcessed ? "Auto-Processed" : v.inspector}</div>
              <div className="qia-stat-chip"><Camera size={14} /> {v.sensorUsed}</div>
            </div>
          </div>
          <FieldGrid fields={[
            { label: "Batch", value: v.batch, icon: <Boxes size={13} /> },
            { label: "SKU", value: v.sku, icon: <PackageCheck size={13} /> },
            { label: "Product", value: v.product, icon: <Factory size={13} /> },
            { label: "Inspection Type", value: v.type, icon: <Eye size={13} /> },
            { label: "AI Model", value: v.aiModel, icon: <Cpu size={13} /> },
            { label: "Defect Count", value: String(v.defects), icon: <AlertTriangle size={13} /> },
            { label: "Defect Type", value: v.defectType, icon: <ShieldAlert size={13} /> },
            { label: "Duration", value: `${v.duration}s`, icon: <Timer size={13} /> },
            { label: "Timestamp", value: v.timestamp, icon: <Clock size={13} /> },
            { label: "Cost Saved", value: formatINR(v.costSaved), icon: <IndianRupee size={13} /> },
          ]} />
          <MetricsRow metrics={[
            { label: "Defects", value: String(v.defects), color: v.defects > 0 ? "rose" : "teal" },
            { label: "Confidence", value: formatPct(v.aiConfidence), color: v.aiConfidence >= 90 ? "teal" : "amber" },
            { label: "Cost Saved", value: formatINR(v.costSaved), color: "indigo" },
          ]} />
          <div className="qia-drawer-actions">
            <Button size="sm" className="press-scale qia-btn-primary"><Eye size={14} /> View Images</Button>
            <Button size="sm" variant="outline"><FileText size={14} /> Full Report</Button>
            <Button size="sm" variant="outline"><Download size={14} /> Export</Button>
          </div>
        </div>
      </div>
    </>
  )
}

function DefectDrawer({ d, onClose }: { d: any; onClose: () => void }) {
  return (
    <>
      <div className="qia-drawer-overlay" onClick={onClose} />
      <div className="qia-drawer-panel">
        <div className="qia-drawer-header qia-header-defect">
          <div className="qia-drawer-header-info">
            <h3 className="qia-drawer-title">Defect: {d.id}</h3>
            <div className="qia-drawer-subtitle">
              <SeverityBadge severity={d.severity} />
              {d.aiFlagged ? <Badge className="badge-interactive qia-ai-badge"><Cpu size={12} /> AI Flagged</Badge> : null}
              <MapPin size={13} /> {d.warehouse}
            </div>
          </div>
          <button onClick={onClose} className="qia-drawer-close"><X size={18} /></button>
        </div>
        <div className="qia-drawer-body">
          <div className="qia-drawer-defect-visual">
            <div className="qia-defect-desc-box">
              <AlertTriangle size={16} />
              <span>{d.description}</span>
            </div>
            <ConfidenceBar value={d.confidence} />
          </div>
          <FieldGrid fields={[
            { label: "Batch", value: d.batch, icon: <Boxes size={13} /> },
            { label: "Product", value: d.product, icon: <PackageCheck size={13} /> },
            { label: "Defect Type", value: d.defectType, icon: <ShieldAlert size={13} /> },
            { label: "Location", value: d.location, icon: <MapPin size={13} /> },
            { label: "Detected By", value: d.detectedBy, icon: d.aiFlagged ? <Cpu size={13} /> : <Eye size={13} /> },
            { label: "Image Captured", value: d.imageCaptured ? "Yes" : "No", icon: <Camera size={13} /> },
            { label: "Action Taken", value: d.actionTaken, icon: <Wrench size={13} /> },
            { label: "Cost Impact", value: formatINR(d.costImpact), icon: <IndianRupee size={13} /> },
            { label: "Timestamp", value: d.timestamp, icon: <Clock size={13} /> },
          ]} />
          <MetricsRow metrics={[
            { label: "Severity", value: d.severity, color: d.severity === "Critical" ? "rose" : d.severity === "Major" ? "amber" : "indigo" },
            { label: "Confidence", value: formatPct(d.confidence), color: d.confidence >= 90 ? "teal" : "amber" },
            { label: "Cost Impact", value: formatINR(d.costImpact), color: d.costImpact > 10000 ? "rose" : "teal" },
          ]} />
          <div className="qia-drawer-actions">
            <Button size="sm" className="press-scale qia-btn-primary"><Eye size={14} /> View Images</Button>
            <Button size="sm" variant="outline"><Wrench size={14} /> Root Cause</Button>
            <Button size="sm" variant="outline"><Download size={14} /> Report</Button>
          </div>
        </div>
      </div>
    </>
  )
}

function StationDrawer({ s, onClose }: { s: any; onClose: () => void }) {
  const statusCls: Record<string, string> = { Online: "qia-status-passed", Maintenance: "qia-status-conditional", Offline: "qia-status-failed" }
  return (
    <>
      <div className="qia-drawer-overlay" onClick={onClose} />
      <div className="qia-drawer-panel">
        <div className="qia-drawer-header qia-header-station">
          <div className="qia-drawer-header-info">
            <h3 className="qia-drawer-title">{s.name}</h3>
            <div className="qia-drawer-subtitle">
              <span className={`qia-status-badge ${statusCls[s.status] || ""}`}>{s.status}</span>
              <MapPin size={13} /> {s.warehouse}
            </div>
          </div>
          <button onClick={onClose} className="qia-drawer-close"><X size={18} /></button>
        </div>
        <div className="qia-drawer-body">
          <div className="qia-drawer-station-visual">
            <ScoreGauge score={s.avgAccuracy} label="Accuracy" />
            <ScoreGauge score={s.uptime} label="Uptime" />
          </div>
          <FieldGrid fields={[
            { label: "Station ID", value: s.id, icon: <FileText size={13} /> },
            { label: "Type", value: s.type, icon: <ScanBarcode size={13} /> },
            { label: "Sensor", value: s.sensorType, icon: <Camera size={13} /> },
            { label: "AI Model", value: s.aiModel, icon: <Cpu size={13} /> },
            { label: "Throughput", value: `${s.throughput.toLocaleString()} units/hr`, icon: <Zap size={13} /> },
            { label: "Total Inspected", value: s.totalInspected.toLocaleString(), icon: <BarChart3 size={13} /> },
            { label: "Defects Found", value: s.defectsFound.toLocaleString(), icon: <AlertTriangle size={13} /> },
            { label: "Operator", value: s.operator, icon: <ClipboardCheck size={13} /> },
            { label: "Last Calibrated", value: s.lastCalibrated, icon: <Wrench size={13} /> },
            { label: "Next Maintenance", value: s.nextMaintenance, icon: <Clock size={13} /> },
          ]} />
          <MetricsRow metrics={[
            { label: "Accuracy", value: formatPct(s.avgAccuracy), color: "teal" },
            { label: "Uptime", value: formatPct(s.uptime), color: "indigo" },
            { label: "Throughput", value: `${s.throughput}/hr`, color: "amber" },
          ]} />
          <div className="qia-drawer-actions">
            <Button size="sm" className="press-scale qia-btn-primary"><RefreshCw size={14} /> Calibrate</Button>
            <Button size="sm" variant="outline"><Wrench size={14} /> Maintenance</Button>
            <Button size="sm" variant="outline"><BarChart3 size={14} /> Analytics</Button>
          </div>
        </div>
      </div>
    </>
  )
}

function AIDrawer({ m, onClose }: { m: any; onClose: () => void }) {
  return (
    <>
      <div className="qia-drawer-overlay" onClick={onClose} />
      <div className="qia-drawer-panel">
        <div className="qia-drawer-header qia-header-ai">
          <div className="qia-drawer-header-info">
            <h3 className="qia-drawer-title">{m.name} {m.version}</h3>
            <div className="qia-drawer-subtitle">
              <Badge className={`qia-ai-active-badge ${m.isActive ? "qia-active-on" : "qia-active-off"}`}>{m.isActive ? "Active" : "Inactive"}</Badge>
              <MapPin size={13} /> {m.warehouse}
            </div>
          </div>
          <button onClick={onClose} className="qia-drawer-close"><X size={18} /></button>
        </div>
        <div className="qia-drawer-body">
          <div className="qia-drawer-ai-visual">
            <ScoreGauge score={m.accuracy} label="Accuracy" />
            <ScoreGauge score={m.f1Score} label="F1 Score" />
            <ScoreGauge score={100 - m.misclassificationRate} label="Correct Rate" />
          </div>
          <FieldGrid fields={[
            { label: "Model ID", value: m.id, icon: <FileText size={13} /> },
            { label: "Category", value: m.category, icon: <Factory size={13} /> },
            { label: "Precision", value: formatPct(m.precision), icon: <Target size={13} /> },
            { label: "Recall", value: formatPct(m.recall), icon: <Eye size={13} /> },
            { label: "F1 Score", value: formatPct(m.f1Score), icon: <Star size={13} /> },
            { label: "Training Samples", value: m.trainingSamples.toLocaleString(), icon: <BarChart3 size={13} /> },
            { label: "Inference Time", value: `${m.inferenceTime}ms`, icon: <Zap size={13} /> },
            { label: "Misclass. Rate", value: formatPct(m.misclassificationRate), icon: <AlertTriangle size={13} /> },
            { label: "Last Retrained", value: m.lastRetrained, icon: <Clock size={13} /> },
          ]} />
          <MetricsRow metrics={[
            { label: "Accuracy", value: formatPct(m.accuracy), color: "teal" },
            { label: "F1 Score", value: formatPct(m.f1Score), color: "indigo" },
            { label: "Inference", value: `${m.inferenceTime}ms`, color: "amber" },
          ]} />
          <div className="qia-drawer-actions">
            <Button size="sm" className="press-scale qia-btn-primary"><RefreshCw size={14} /> Retrain</Button>
            <Button size="sm" variant="outline"><BarChart3 size={14} /> Metrics</Button>
            <Button size="sm" variant="outline"><Download size={14} /> Export Model</Button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main Component ───────────────────────────────────────
export default function QualityInspectionAutomationView() {
  const [activeTab, setActiveTab] = useState("0")
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterWarehouse, setFilterWarehouse] = useState("all")
  const [sortKey, setSortKey] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<"inspection" | "defect" | "station" | "ai">("inspection")

  const filteredInspections = useMemo(() => {
    let r = data.inspections.filter(v => v.id.toLowerCase().includes(search.toLowerCase()) || v.product.toLowerCase().includes(search.toLowerCase()) || v.warehouse.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") r = r.filter(v => v.status === filterStatus)
    if (filterSeverity !== "all") r = r.filter(v => v.severity === filterSeverity)
    if (filterWarehouse !== "all") r = r.filter(v => v.warehouse === filterWarehouse)
    return sortKey ? sortBy(r, sortKey, sortDir) : r
  }, [search, filterStatus, filterSeverity, filterWarehouse, sortKey, sortDir])

  const filteredDefects = useMemo(() => {
    let r = data.defects.filter(d => d.id.toLowerCase().includes(search.toLowerCase()) || d.product.toLowerCase().includes(search.toLowerCase()))
    if (filterSeverity !== "all") r = r.filter(d => d.severity === filterSeverity)
    if (filterWarehouse !== "all") r = r.filter(d => d.warehouse === filterWarehouse)
    return sortKey ? sortBy(r, sortKey, sortDir) : r
  }, [search, filterSeverity, filterWarehouse, sortKey, sortDir])

  const filteredStations = useMemo(() => {
    let r = data.stations
    if (filterWarehouse !== "all") r = r.filter(s => s.warehouse === filterWarehouse)
    if (filterStatus !== "all") r = r.filter(s => s.status === filterStatus)
    return sortKey ? sortBy(r, sortKey, sortDir) : r
  }, [filterWarehouse, filterStatus, sortKey, sortDir])

  const filteredAI = useMemo(() => {
    let r = data.aiModels
    if (filterWarehouse !== "all") r = r.filter(m => m.warehouse === filterWarehouse)
    return sortKey ? sortBy(r, sortKey, sortDir) : r
  }, [filterWarehouse, sortKey, sortDir])

  const totalCostSaved = data.inspections.reduce((a, b) => a + b.costSaved, 0)
  const avgAIAccuracy = +(data.aiModels.reduce((a, b) => a + b.accuracy, 0) / data.aiModels.length).toFixed(1)
  const autoProcessedCount = data.inspections.filter(v => v.autoProcessed).length
  const aiFlaggedDefects = data.defects.filter(d => d.aiFlagged).length
  const avgPassRate = +(data.monthlyTrend.reduce((a, b) => a + b.passRate, 0) / 12).toFixed(1)

  const openDrawer = (item: any, type: typeof drawerType) => { setDrawerData(item); setDrawerType(type) }
  const toggleSort = (key: string) => { if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("desc") } }

  return (
    <div className="qia-container">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="qia-header">
          <div className="qia-header-left">
            <h1 className="qia-title"><Cpu size={26} className="qia-title-icon" />Quality Inspection Automation</h1>
            <p className="qia-subtitle">AI-powered inspection, defect detection &amp; quality assurance automation</p>
          </div>
          <div className="qia-header-controls">
            <div className="qia-search-box">
              <Search size={15} />
              <input type="text" placeholder="Search inspections, batches, SKUs..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")}><X size={14} /></button>}
            </div>
            <button className="qia-refresh-btn"><RefreshCw size={15} /> Refresh</button>
          </div>
        </div>
        <TabsList className="qia-tabs-list">
          <TabsTrigger value="0" className="qia-tab-trigger"><BarChart3 size={14} /> Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="qia-tab-trigger"><ScanBarcode size={14} /> Inspections</TabsTrigger>
          <TabsTrigger value="2" className="qia-tab-trigger"><AlertTriangle size={14} /> Defects</TabsTrigger>
          <TabsTrigger value="3" className="qia-tab-trigger"><Factory size={14} /> Stations</TabsTrigger>
          <TabsTrigger value="4" className="qia-tab-trigger"><Brain size={14} /> AI Models</TabsTrigger>
          <TabsTrigger value="5" className="qia-tab-trigger"><DollarSign size={14} /> Cost Analysis</TabsTrigger>
        </TabsList>

        {/* ═══ Tab 0: Dashboard ═══ */}
        <TabsContent value="0" className="qia-tab-content">
          <div className="qia-kpi-grid">
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-teal"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><ScanBarcode size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">Total Inspections</span><span className="qia-kpi-value">{data.inspections.length}</span><span className="qia-kpi-sub">Auto-processed: {autoProcessedCount}</span></div></CardContent></Card>
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-indigo"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><Brain size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">AI Accuracy</span><span className="qia-kpi-value">{avgAIAccuracy}%</span><span className="qia-kpi-sub"><TrendingUp size={12} /> +1.8% vs last quarter</span></div></CardContent></Card>
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-rose"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><AlertTriangle size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">Defects Found</span><span className="qia-kpi-value">{data.defects.length}</span><span className="qia-kpi-sub">AI-flagged: {aiFlaggedDefects}</span></div></CardContent></Card>
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-amber"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><IndianRupee size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">Cost Saved</span><span className="qia-kpi-value">{formatINR(totalCostSaved)}</span><span className="qia-kpi-sub">Defect prevention</span></div></CardContent></Card>
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-emerald"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><ShieldCheck size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">Pass Rate</span><span className="qia-kpi-value">{avgPassRate}%</span><span className="qia-kpi-sub">Network average</span></div></CardContent></Card>
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-violet"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><Factory size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">Stations Online</span><span className="qia-kpi-value">{data.stations.filter(s => s.status === "Online").length}/{data.stations.length}</span><span className="qia-kpi-sub">{data.WAREHOUSES.length} warehouses</span></div></CardContent></Card>
          </div>
          <div className="qia-chart-grid">
            <Card className="hover-lift-sm qia-chart-card qia-chart-wide"><CardHeader className="qia-chart-header"><CardTitle className="qia-chart-title">Monthly Inspection &amp; AI Performance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><ComposedChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis yAxisId="count" tick={{ fontSize: 12 }} /><YAxis yAxisId="rate" orientation="right" domain={[80, 100]} tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} /><Legend wrapperStyle={{ fontSize: 12 }} /><Bar yAxisId="count" dataKey="totalInspected" fill="#c7d2fe" name="Inspected" radius={[4, 4, 0, 0]} /><Bar yAxisId="count" dataKey="autoProcessed" fill="#0d9488" name="Auto-Processed" radius={[4, 4, 0, 0]} /><Line yAxisId="rate" type="monotone" dataKey="passRate" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} name="Pass %" /><Line yAxisId="rate" type="monotone" dataKey="aiAccuracy" stroke="#e11d48" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="AI Acc %" /></ComposedChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm qia-chart-card"><CardHeader className="qia-chart-header"><CardTitle className="qia-chart-title">Severity Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={data.severityDist} dataKey="count" nameKey="severity" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} label={({ severity, count }) => `${severity}: ${count}`}><Cell fill="#dc2626" /><Cell fill="#f59e0b" /><Cell fill="#6366f1" /><Cell fill="#94a3b8" /></Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
          <div className="qia-chart-grid">
            <Card className="hover-lift-sm qia-chart-card"><CardHeader className="qia-chart-header"><CardTitle className="qia-chart-title">Defect Types</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={data.defectTypeDist}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="type" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={55} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 8 }} /><Bar dataKey="count" radius={[4, 4, 0, 0]}>{data.defectTypeDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm qia-chart-card"><CardHeader className="qia-chart-header"><CardTitle className="qia-chart-title">AI vs Manual Comparison</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={data.aiVsManual} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis type="number" tick={{ fontSize: 12 }} /><YAxis dataKey="metric" type="category" tick={{ fontSize: 11 }} width={110} /><Tooltip contentStyle={{ borderRadius: 8 }} /><Legend wrapperStyle={{ fontSize: 12 }} /><Bar dataKey="ai" fill="#0d9488" name="AI" radius={[0, 4, 4, 0]} /><Bar dataKey="manual" fill="#94a3b8" name="Manual" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
          <div className="qia-chart-grid">
            <Card className="hover-lift-sm qia-chart-card qia-chart-wide"><CardHeader className="qia-chart-header"><CardTitle className="qia-chart-title">Labor Savings &amp; Defect Prevention Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><AreaChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 8 }} /><Legend wrapperStyle={{ fontSize: 12 }} /><Area type="monotone" dataKey="laborSaved" stroke="#0d9488" fill="#ccfbf1" strokeWidth={2} name="Labor Saved (₹)" /><Area type="monotone" dataKey="defectsFound" stroke="#e11d48" fill="#fee2e2" strokeWidth={2} name="Defects Found" /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm qia-chart-card"><CardHeader className="qia-chart-header"><CardTitle className="qia-chart-title">Warehouse Accuracy</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.warehouseAccuracy}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="warehouse" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={50} /><YAxis domain={[85, 100]} tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 8 }} /><Bar dataKey="accuracy" radius={[4, 4, 0, 0]} fill="#0d9488" /></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>

        {/* ═══ Tab 1: Inspections ═══ */}
        <TabsContent value="1" className="qia-tab-content">
          <div className="qia-table-toolbar">
            <div className="qia-filter-row">
              <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {data.WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                {data.INSPECTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
                <option value="all">All Severity</option>
                {data.SEVERITY_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Badge className="badge-interactive qia-count-badge">{filteredInspections.length} records</Badge>
            </div>
          </div>
          <div className="qia-table-container">
            <table className="qia-table">
              <thead><tr>
                <th onClick={() => toggleSort("id")}>ID <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("batch")}>Batch <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("product")}>Product <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("type")}>Type <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("status")}>Status <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("severity")}>Severity <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("aiConfidence")}>AI Conf. <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("defects")}>Defects <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("autoProcessed")}>Auto <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("warehouse")}>Warehouse <ArrowUpDown size={12} /></th>
              </tr></thead>
              <tbody>
                {filteredInspections.map(v => (
                  <tr key={v.id} className={`qia-row ${v.status === "Failed" ? "qia-row-failed" : v.status === "Quarantined" ? "qia-row-quarantined" : ""}`} onClick={() => openDrawer(v, "inspection")}>
                    <td className="qia-mono-cell">{v.id}</td>
                    <td className="qia-mono-cell">{v.batch}</td>
                    <td><Badge className="badge-interactive qia-category-badge">{v.product}</Badge></td>
                    <td><Badge className="badge-interactive qia-type-badge">{v.type}</Badge></td>
                    <td><StatusBadge status={v.status} /></td>
                    <td><SeverityBadge severity={v.severity} /></td>
                    <td><ConfidenceBar value={v.aiConfidence} /></td>
                    <td className="qia-number-cell">{v.defects}</td>
                    <td>{v.autoProcessed ? <Badge className="badge-interactive qia-auto-badge"><Cpu size={10} /> Yes</Badge> : <span className="qia-manual-label">{v.inspector}</span>}</td>
                    <td><div className="qia-warehouse-cell"><MapPin size={12} />{v.warehouse}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══ Tab 2: Defects ═══ */}
        <TabsContent value="2" className="qia-tab-content">
          <div className="qia-table-toolbar">
            <div className="qia-filter-row">
              <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {data.WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
                <option value="all">All Severity</option>
                {data.SEVERITY_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Badge className="badge-interactive qia-count-badge">{filteredDefects.length} defects</Badge>
            </div>
          </div>
          <div className="qia-table-container">
            <table className="qia-table">
              <thead><tr>
                <th onClick={() => toggleSort("id")}>ID <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("product")}>Product <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("defectType")}>Defect Type <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("severity")}>Severity <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("location")}>Location <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("detectedBy")}>Detected By <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("aiFlagged")}>AI Flag <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("confidence")}>Confidence <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("actionTaken")}>Action <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("costImpact")}>Cost Impact <ArrowUpDown size={12} /></th>
              </tr></thead>
              <tbody>
                {filteredDefects.map(d => (
                  <tr key={d.id} className={`qia-row ${d.severity === "Critical" ? "qia-row-critical" : d.severity === "Major" ? "qia-row-major" : ""}`} onClick={() => openDrawer(d, "defect")}>
                    <td className="qia-mono-cell">{d.id}</td>
                    <td><Badge className="badge-interactive qia-category-badge">{d.product}</Badge></td>
                    <td><Badge className="badge-interactive qia-type-badge">{d.defectType}</Badge></td>
                    <td><SeverityBadge severity={d.severity} /></td>
                    <td className="qia-warehouse-cell">{d.location}</td>
                    <td>{d.aiFlagged ? <Badge className="badge-interactive qia-ai-badge-sm"><Cpu size={10} /> AI</Badge> : d.detectedBy}</td>
                    <td className="qia-number-cell">{d.aiFlagged ? "Yes" : "No"}</td>
                    <td><ConfidenceBar value={d.confidence} /></td>
                    <td><Badge className="badge-interactive qia-action-badge">{d.actionTaken}</Badge></td>
                    <td className="qia-number-cell">{formatINR(d.costImpact)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══ Tab 3: Stations ═══ */}
        <TabsContent value="3" className="qia-tab-content">
          <div className="qia-table-toolbar">
            <div className="qia-filter-row">
              <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {data.WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Online">Online</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Offline">Offline</option>
              </select>
              <Badge className="badge-interactive qia-count-badge">{filteredStations.length} stations</Badge>
            </div>
          </div>
          <div className="qia-station-grid">
            {filteredStations.map(s => (
              <Card key={s.id} className={`qia-station-card ${s.status === "Offline" ? "qia-station-offline" : s.status === "Maintenance" ? "qia-station-maintenance" : ""}`} onClick={() => openDrawer(s, "station")}>
                <CardContent className="inner-glow glass-subtle qia-station-body">
                  <div className="qia-station-header">
                    <span className={`qia-station-status-dot qia-dot-${s.status.toLowerCase()}`} />
                    <span className="qia-station-name">{s.name}</span>
                    <span className="qia-station-id">{s.id}</span>
                  </div>
                  <div className="qia-station-metrics">
                    <ScoreGauge score={s.avgAccuracy} label="Accuracy" />
                    <ScoreGauge score={s.uptime} label="Uptime" />
                  </div>
                  <div className="qia-station-info">
                    <div className="qia-station-info-row"><ScanBarcode size={12} /> {s.type}</div>
                    <div className="qia-station-info-row"><Camera size={12} /> {s.sensorType}</div>
                    <div className="qia-station-info-row"><Zap size={12} /> {s.throughput.toLocaleString()} units/hr</div>
                    <div className="qia-station-info-row"><Cpu size={12} /> {s.aiModel}</div>
                    <div className="qia-station-info-row"><ClipboardCheck size={12} /> {s.operator}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══ Tab 4: AI Models ═══ */}
        <TabsContent value="4" className="qia-tab-content">
          <div className="qia-table-toolbar">
            <div className="qia-filter-row">
              <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {data.WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <Badge className="badge-interactive qia-count-badge">{filteredAI.length} models</Badge>
            </div>
          </div>
          <div className="qia-table-container">
            <table className="qia-table">
              <thead><tr>
                <th onClick={() => toggleSort("name")}>Model <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("version")}>Version <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("category")}>Category <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("accuracy")}>Accuracy <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("f1Score")}>F1 Score <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("precision")}>Precision <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("recall")}>Recall <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("inferenceTime")}>Inference <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("isActive")}>Status <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("warehouse")}>Warehouse <ArrowUpDown size={12} /></th>
              </tr></thead>
              <tbody>
                {filteredAI.map(m => (
                  <tr key={m.id} className={`qia-row ${!m.isActive ? "qia-row-inactive" : ""}`} onClick={() => openDrawer(m, "ai")}>
                    <td><div className="qia-vendor-cell"><span className="qia-vendor-name">{m.name}</span></div></td>
                    <td className="qia-mono-cell">{m.version}</td>
                    <td><Badge className="badge-interactive qia-category-badge">{m.category}</Badge></td>
                    <td className="qia-number-cell qia-score-highlight">{formatPct(m.accuracy)}</td>
                    <td className="qia-number-cell">{formatPct(m.f1Score)}</td>
                    <td className="qia-number-cell">{formatPct(m.precision)}</td>
                    <td className="qia-number-cell">{formatPct(m.recall)}</td>
                    <td className="qia-number-cell">{m.inferenceTime}ms</td>
                    <td><Badge className={`qia-ai-active-badge ${m.isActive ? "qia-active-on" : "qia-active-off"}`}>{m.isActive ? "Active" : "Inactive"}</Badge></td>
                    <td><div className="qia-warehouse-cell"><MapPin size={12} />{m.warehouse}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══ Tab 5: Cost Analysis ═══ */}
        <TabsContent value="5" className="qia-tab-content">
          <div className="qia-cost-summary-grid">
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-teal"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><TrendingDown size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">Total Labor Saved</span><span className="qia-kpi-value">{formatINR(data.costs.reduce((a, b) => a + b.laborSaved, 0))}</span><span className="qia-kpi-sub">FY 2025-26</span></div></CardContent></Card>
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-indigo"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><IndianRupee size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">Avg ROI</span><span className="qia-kpi-value">{formatPct(data.costs.reduce((a, b) => a + b.roi, 0) / data.costs.length)}</span><span className="qia-kpi-sub">Investment return</span></div></CardContent></Card>
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-rose"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><ShieldAlert size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">Defects Prevented</span><span className="qia-kpi-value">{data.costs.reduce((a, b) => a + b.defectsPrevented, 0).toLocaleString()}</span><span className="qia-kpi-sub">Total prevented</span></div></CardContent></Card>
            <Card className="inner-glow hover-lift-sm glass-subtle qia-kpi-card qia-kpi-amber"><CardContent className="qia-kpi-body"><div className="qia-kpi-icon-wrap"><ArrowUpRight size={22} /></div><div className="qia-kpi-text"><span className="qia-kpi-label">Avg Throughput Gain</span><span className="qia-kpi-value">{formatPct(data.costs.reduce((a, b) => a + b.throughputGain, 0) / data.costs.length)}</span><span className="qia-kpi-sub">vs manual</span></div></CardContent></Card>
          </div>
          <div className="qia-chart-grid">
            <Card className="hover-lift-sm qia-chart-card qia-chart-wide"><CardHeader className="qia-chart-header"><CardTitle className="qia-chart-title">ROI &amp; Cost of Quality by Period</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><ComposedChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 8 }} /><Legend wrapperStyle={{ fontSize: 12 }} /><Bar dataKey="laborSaved" fill="#0d9488" name="Labor Saved" radius={[4, 4, 0, 0]} /><Line type="monotone" dataKey="defectsFound" stroke="#e11d48" strokeWidth={2} name="Defects" /></ComposedChart></ResponsiveContainer></CardContent></Card>
            <Card className="hover-lift-sm qia-chart-card"><CardHeader className="qia-chart-header"><CardTitle className="qia-chart-title">Scrap Reduction &amp; Throughput Gain</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><AreaChart data={data.costs}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="period" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 8 }} /><Legend wrapperStyle={{ fontSize: 12 }} /><Area type="monotone" dataKey="scrapReduction" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} name="Scrap Reduction %" /><Area type="monotone" dataKey="throughputGain" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} name="Throughput Gain %" /></AreaChart></ResponsiveContainer></CardContent></Card>
          </div>
          <div className="qia-table-container">
            <table className="qia-table">
              <thead><tr>
                <th onClick={() => toggleSort("period")}>Period <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("warehouse")}>Warehouse <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("laborSaved")}>Labor Saved <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("automationInvestment")}>Investment <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("roi")}>ROI <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("defectsPrevented")}>Defects Prevented <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("scrapReduction")}>Scrap Reduction <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("throughputGain")}>Throughput Gain <ArrowUpDown size={12} /></th>
              </tr></thead>
              <tbody>
                {data.costs.map(c => (
                  <tr key={c.id} className="qia-row">
                    <td className="qia-mono-cell">{c.period}</td>
                    <td><div className="qia-warehouse-cell"><MapPin size={12} />{c.warehouse}</div></td>
                    <td className="qia-number-cell">{formatINR(c.laborSaved)}</td>
                    <td className="qia-number-cell">{formatINR(c.automationInvestment)}</td>
                    <td className="qia-number-cell">{formatPct(c.roi)}</td>
                    <td className="qia-number-cell">{c.defectsPrevented.toLocaleString()}</td>
                    <td><span className={`qia-trend-badge ${c.scrapReduction > 15 ? "qia-trend-up" : "qia-trend-flat"}`}>{formatPct(c.scrapReduction)}</span></td>
                    <td><span className={`qia-trend-badge ${c.throughputGain > 30 ? "qia-trend-up" : "qia-trend-flat"}`}>{formatPct(c.throughputGain)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {drawerData && drawerType === "inspection" && <InspectionDrawer v={drawerData} onClose={() => setDrawerData(null)} />}
      {drawerData && drawerType === "defect" && <DefectDrawer d={drawerData} onClose={() => setDrawerData(null)} />}
      {drawerData && drawerType === "station" && <StationDrawer s={drawerData} onClose={() => setDrawerData(null)} />}
      {drawerData && drawerType === "ai" && <AIDrawer m={drawerData} onClose={() => setDrawerData(null)} />}
    </div>
  )
}
