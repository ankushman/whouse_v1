"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  Flame, ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2,
  XCircle, Search, Filter, Eye, Zap, Activity, Target, Package, BarChart3,
  IndianRupee, Clock, FileText, Thermometer, Droplets, Wind, Info,
  ChevronRight, Warehouse, MapPin, ClipboardList, Users, HardHat,
  TriangleAlert, Radiation, Skull, Beaker, FlaskConical, Pill,
  Snowflake, TreePine, BookOpen, RefreshCw, CalendarDays, TrendingUp,
  TrendingDown, PackageSearch, Gauge, Layers, CircleDot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
type HazmatClass = "class_1" | "class_2" | "class_3" | "class_4" | "class_5" | "class_6" | "class_7" | "class_8" | "class_9";
type StorageZone = "segregated" | "isolated" | "ventilated" | "temperature_controlled" | "outdoor_bunded" | "explosive_magazine";
type ComplianceStatus = "compliant" | "warning" | "non_compliant" | "expired";
type IncidentSeverity = "minor" | "moderate" | "major" | "critical";
type PpeLevel = "none" | "basic" | "intermediate" | "full";
type InspectionStatus = "passed" | "failed" | "scheduled" | "overdue";

const WAREHOUSES = [
  "Mumbai Central Hub", "Delhi NCR Facility", "Chennai Gateway",
  "Kolkata Distribution", "Bangalore South Hub", "Hyderabad Depot",
] as const;

const CLASS_LABELS: Record<HazmatClass, string> = {
  class_1: "Class 1: Explosives",
  class_2: "Class 2: Gases",
  class_3: "Class 3: Flammable Liquids",
  class_4: "Class 4: Flammable Solids",
  class_5: "Class 5: Oxidizers",
  class_6: "Class 6: Toxic",
  class_7: "Class 7: Radioactive",
  class_8: "Class 8: Corrosives",
  class_9: "Class 9: Miscellaneous",
};

const CLASS_COLORS: Record<HazmatClass, string> = {
  class_1: "#ef4444",
  class_2: "#f97316",
  class_3: "#eab308",
  class_4: "#f59e0b",
  class_5: "#a855f7",
  class_6: "#ec4899",
  class_7: "#6366f1",
  class_8: "#0ea5e9",
  class_9: "#6b7280",
};

const CLASS_ICONS: Record<HazmatClass, React.ReactNode> = {
  class_1: <Flame className="h-3.5 w-3.5" />,
  class_2: <Wind className="h-3.5 w-3.5" />,
  class_3: <Droplets className="h-3.5 w-3.5" />,
  class_4: <Flame className="h-3.5 w-3.5" />,
  class_5: <Radiation className="h-3.5 w-3.5" />,
  class_6: <Skull className="h-3.5 w-3.5" />,
  class_7: <Radiation className="h-3.5 w-3.5" />,
  class_8: <Beaker className="h-3.5 w-3.5" />,
  class_9: <Package className="h-3.5 w-3.5" />,
};

interface HazmatItem {
  id: string;
  productName: string;
  unNumber: string;
  hazmatClass: HazmatClass;
  warehouse: string;
  zone: string;
  quantity: number;
  unit: string;
  weight: number;
  storageZone: StorageZone;
  storageLocation: string;
  msdsAvailable: boolean;
  ppeRequired: PpeLevel;
  flashPoint: number | null;
  boilingPoint: number | null;
  radiationLevel: number | null;
  phLevel: number | null;
  incompatibles: string[];
  supplier: string;
  receivedDate: number;
  expiryDate: number;
  shelfLifeDays: number;
  remainingLife: number;
  complianceStatus: ComplianceStatus;
  lastInspection: number;
  nextInspection: number;
  incidentCount: number;
  notes: string;
}

interface SafetyIncident {
  id: string;
  itemId: string;
  warehouse: string;
  hazmatClass: HazmatClass;
  date: number;
  type: string;
  severity: IncidentSeverity;
  description: string;
  rootCause: string;
  correctiveAction: string | null;
  casualties: number;
  contaminationArea: number;
  responseTimeMin: number;
  resolved: boolean;
  costImpact: number;
}

interface PpeRequirement {
  id: string;
  hazmatClass: HazmatClass;
  level: PpeLevel;
  equipment: string[];
  trainingRequired: boolean;
  certificationExpiry: number;
  compliance: number;
}

interface StorageZoneRecord {
  id: string;
  name: string;
  warehouse: string;
  zoneType: StorageZone;
  capacity: number;
  usedCapacity: number;
  ventilation: "natural" | "mechanical" | "none";
  fireSuppression: string;
  temperatureRange: [number, number];
  humidityRange: [number, number];
  leakDetection: boolean;
  emergencyShower: boolean;
  eyeWash: boolean;
  inspectionDue: number;
  compliance: ComplianceStatus;
}

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
  const rand = seededRandom(122122);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
  const now = Date.now();
  const day = 86400000;

  const classes: HazmatClass[] = ["class_1", "class_2", "class_3", "class_4", "class_5", "class_6", "class_7", "class_8", "class_9"];
  const zones: StorageZone[] = ["segregated", "isolated", "ventilated", "temperature_controlled", "outdoor_bunded", "explosive_magazine"];
  const products = [
    { name: "Ammonium Nitrate 34%", cls: "class_5" as HazmatClass, un: "UN1942" },
    { name: "Sulphuric Acid 98%", cls: "class_8" as HazmatClass, un: "UN1830" },
    { name: "Methanol ACS Grade", cls: "class_3" as HazmatClass, un: "UN1230" },
    { name: "Sodium Cyanide 99%", cls: "class_6" as HazmatClass, un: "UN1689" },
    { name: "Hydrogen Peroxide 50%", cls: "class_5" as HazmatClass, un: "UN2014" },
    { name: "Toluene", cls: "class_3" as HazmatClass, un: "UN1294" },
    { name: "Liquefied Petroleum Gas", cls: "class_2" as HazmatClass, un: "UN1075" },
    { name: "Chlorine Gas Cylinder", cls: "class_2" as HazmatClass, un: "UN1017" },
    { name: "Xylene Mixed Isomers", cls: "class_3" as HazmatClass, un: "UN1307" },
    { name: "Formaldehyde 37%", cls: "class_6" as HazmatClass, un: "UN1198" },
    { name: "Acetone", cls: "class_3" as HazmatClass, un: "UN1090" },
    { name: "Nitric Acid 68%", cls: "class_8" as HazmatClass, un: "UN2031" },
    { name: "Diesel Fuel", cls: "class_3" as HazmatClass, un: "UN1202" },
    { name: "Ethanol 95%", cls: "class_3" as HazmatClass, un: "UN1170" },
    { name: "Calcium Hypochlorite 65%", cls: "class_5" as HazmatClass, un: "UN1748" },
    { name: "Uranium Ore (Low Level)", cls: "class_7" as HazmatClass, un: "UN2912" },
    { name: "Lithium Ion Batteries", cls: "class_9" as HazmatClass, un: "UN3481" },
    { name: "Mercury", cls: "class_8" as HazmatClass, un: "UN2809" },
    { name: "Hexane", cls: "class_3" as HazmatClass, un: "UN1208" },
    { name: "Potassium Permanganate", cls: "class_5" as HazmatClass, un: "UN1490" },
    { name: "Dichloromethane", cls: "class_6" as HazmatClass, un: "UN1593" },
    { name: "Petroleum Crude Oil", cls: "class_3" as HazmatClass, un: "UN1267" },
    { name: "Solid Sodium Hydroxide", cls: "class_8" as HazmatClass, un: "UN1823" },
    { name: "Red Phosphorus", cls: "class_4" as HazmatClass, un: "UN1338" },
    { name: "Ammonia Solution 28%", cls: "class_8" as HazmatClass, un: "UN2672" },
  ];
  const suppliers = ["SABIC India", "BASF India", "Dow Chemical India", "Reliance Chem", "Gujarat Fluorochem", "Deepak Fertilisers", "India Glycols", "Tata Chemicals", "GRFL Ltd", "Shivalik Bimetal"];
  const incidentTypes = ["Spill", "Leak", "Fire", "Fume Release", "Container Breach", "Label Mismatch", "Storage Violation", "Contamination", "Improper PPE", "Mixing Incompatibles"];
  const rootCauses = ["Handling error", "Container deterioration", "Improper storage", "Equipment failure", "Human error", "Label failure", "Overfilling", "Temperature excursion", "Impact damage", "Corrosion"];
  const correctiveActions = ["Area cordoned and cleaned", "PPE protocol updated", "Storage relocated", "Staff retrained", "Container replaced", "Ventilation upgraded", "Emergency drill conducted", "MSDS review completed", "Spill kit deployed", "Supervisor briefed"];
  const ppeEquip: Record<PpeLevel, string[]> = {
    none: [],
    basic: ["Safety glasses", "Chemical-resistant gloves"],
    intermediate: ["Safety glasses", "Chemical suit", "Nitrile gloves", "Safety boots"],
    full: ["Full-face respirator", "Chemical-proof suit", "Double gloves", "Safety boots", "Hard hat", "Self-contained breathing apparatus"],
  };
  const storageLocations = ["Bay A-1", "Bay A-2", "Bay B-1", "Bay B-2", "Cabinet C-1", "Cabinet C-2", "Drum Area D-1", "Drum Area D-2", "Vault V-1", "Tank Farm T-1", "Cool Store CS-1", "Magazine M-1"];

  // 50 hazmat items
  const items: HazmatItem[] = [];
  for (let i = 0; i < 50; i++) {
    const prod = pick(products);
    const shelfLife = Math.floor(rand() * 365) + 30;
    const receivedDays = Math.floor(rand() * shelfLife * 0.7);
    const remaining = Math.max(0, ((shelfLife - receivedDays) / shelfLife) * 100);
    const ppeLvl: PpeLevel = prod.cls === "class_7" ? "full" : prod.cls === "class_6" || prod.cls === "class_8" ? "intermediate" : prod.cls === "class_1" ? "full" : rand() > 0.5 ? "intermediate" : "basic";
    const storageZone: StorageZone = prod.cls === "class_1" ? "explosive_magazine" : prod.cls === "class_3" ? pick(["ventilated", "outdoor_bunded"]) : prod.cls === "class_7" ? "isolated" : prod.cls === "class_8" ? pick(["segregated", "ventilated"]) : pick(zones);
    const comp: ComplianceStatus = rand() > 0.85 ? (rand() > 0.5 ? "warning" : "non_compliant") : "compliant";

    items.push({
      id: `HZM-${String(i + 1).padStart(4, "0")}`,
      productName: prod.name,
      unNumber: prod.un,
      hazmatClass: prod.cls,
      warehouse: pick(WAREHOUSES),
      zone: storageZone,
      quantity: Math.floor(rand() * 2000) + 10,
      unit: pick(["kg", "liters", "cylinders", "drums", "tons", "packets"]),
      weight: Math.floor(rand() * 5000) + 50,
      storageZone: storageZone,
      storageLocation: pick(storageLocations),
      msdsAvailable: rand() > 0.08,
      ppeRequired: ppeLvl,
      flashPoint: prod.cls === "class_3" ? Math.floor(rand() * 80) - 20 : prod.cls === "class_4" ? Math.floor(rand() * 150) + 50 : null,
      boilingPoint: prod.cls === "class_3" ? Math.floor(rand() * 200) + 50 : null,
      radiationLevel: prod.cls === "class_7" ? Math.round(rand() * 5 * 10) / 10 : null,
      phLevel: prod.cls === "class_8" ? Math.round((rand() * 14) * 10) / 10 : null,
      incompatibles: classes.filter((c) => c !== prod.cls && rand() > 0.7).slice(0, 3).map((c) => CLASS_LABELS[c].split(":")[1].trim()),
      supplier: pick(suppliers),
      receivedDate: now - receivedDays * day,
      expiryDate: now + (shelfLife - receivedDays) * day,
      shelfLifeDays: shelfLife,
      remainingLife: Math.round(remaining * 10) / 10,
      complianceStatus: comp,
      lastInspection: now - Math.floor(rand() * 30) * day,
      nextInspection: now + Math.floor(rand() * 60) * day,
      incidentCount: Math.floor(rand() * 4),
      notes: rand() > 0.7 ? "No issues" : pick(["Requires temperature monitoring", "Fragile container — handle with care", "New batch — awaiting MSDS update", "Near expiry — prioritize usage", "Staff training renewal due"]),
    });
  }

  // 25 incidents
  const incidents: SafetyIncident[] = [];
  for (let i = 0; i < 25; i++) {
    const item = pick(items);
    const sev: IncidentSeverity = rand() > 0.7 ? "critical" : rand() > 0.5 ? "major" : rand() > 0.3 ? "moderate" : "minor";
    incidents.push({
      id: `HIC-${String(i + 1).padStart(4, "0")}`,
      itemId: item.id,
      warehouse: pick(WAREHOUSES),
      hazmatClass: item.hazmatClass,
      date: now - Math.floor(rand() * 180) * day,
      type: pick(incidentTypes),
      severity: sev,
      description: `${pick(incidentTypes)} involving ${item.productName} at ${pick(storageLocations)}`,
      rootCause: pick(rootCauses),
      correctiveAction: rand() > 0.3 ? pick(correctiveActions) : null,
      casualties: sev === "critical" ? Math.floor(rand() * 3) + 1 : sev === "major" ? Math.floor(rand() * 2) : 0,
      contaminationArea: Math.floor(rand() * 200) + 5,
      responseTimeMin: Math.floor(rand() * 120) + 5,
      resolved: rand() > 0.25,
      costImpact: Math.floor(rand() * 2000000) + 10000,
    });
  }

  // PPE requirements per class
  const ppeReqs: PpeRequirement[] = classes.map((cls, i) => ({
    id: `PPE-${i + 1}`,
    hazmatClass: cls,
    level: cls === "class_7" || cls === "class_1" ? "full" : cls === "class_6" || cls === "class_8" ? "intermediate" : "basic",
    equipment: ppeEquip[cls === "class_7" || cls === "class_1" ? "full" : cls === "class_6" || cls === "class_8" ? "intermediate" : "basic"],
    trainingRequired: true,
    certificationExpiry: now + Math.floor(rand() * 365) * day,
    compliance: Math.floor(rand() * 30) + 65,
  }));

  // 18 storage zones
  const storageZones: StorageZoneRecord[] = [];
  for (let i = 0; i < 18; i++) {
    const zoneType = zones[i % zones.length];
    const cap = Math.floor(rand() * 100) + 20;
    storageZones.push({
      id: `SZ-${String(i + 1).padStart(3, "0")}`,
      name: `${pick(WAREHOUSES).split(" ")[0]} ${zoneType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Zone ${i % 3 + 1}`,
      warehouse: WAREHOUSES[i % 6],
      zoneType,
      capacity: cap,
      usedCapacity: Math.floor(rand() * cap * 0.8) + Math.floor(cap * 0.15),
      ventilation: zoneType === "ventilated" ? "mechanical" : zoneType === "outdoor_bunded" ? "natural" : "none",
      fireSuppression: pick(["Sprinkler", "FM200", "CO2", "Dry Chemical", "Foam", "None"]),
      temperatureRange: zoneType === "temperature_controlled" ? [2, 8] : zoneType === "explosive_magazine" ? [15, 25] : [-10, 45],
      humidityRange: zoneType === "temperature_controlled" ? [30, 60] : [10, 90],
      leakDetection: rand() > 0.15,
      emergencyShower: rand() > 0.2,
      eyeWash: rand() > 0.2,
      inspectionDue: now + Math.floor(rand() * 90) * day,
      compliance: rand() > 0.8 ? "compliant" : rand() > 0.5 ? "warning" : "non_compliant",
    });
  }

  // Monthly incident trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const incidentTrend = months.map((m) => ({
    month: m,
    minor: Math.floor(rand() * 4),
    moderate: Math.floor(rand() * 3),
    major: Math.floor(rand() * 2),
    critical: rand() > 0.7 ? 1 : 0,
  }));

  // Compliance trend
  const complianceTrend = months.map((m) => ({
    month: m,
    compliance: Math.floor(rand() * 10) + 85,
    inspections: Math.floor(rand() * 20) + 15,
    violations: Math.floor(rand() * 5),
  }));

  return { items, incidents, ppeReqs, storageZones, incidentTrend, complianceTrend, now };
}

const SEVERITY_COLORS: Record<string, string> = { minor: "#f59e0b", moderate: "#f97316", major: "#ef4444", critical: "#dc2626" };

export default function HazmatDangerousGoodsView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [filterCompliance, setFilterCompliance] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<HazmatItem | null>(null);

  const tabs = ["Hazmat Overview", "Chemical Inventory", "Incident Tracker", "PPE & Safety", "Storage Zones"];

  // Computed
  const totalItems = data.items.length;
  const compliant = data.items.filter((i) => i.complianceStatus === "compliant").length;
  const incidentsOpen = data.incidents.filter((i) => !i.resolved).length;
  const totalWeight = data.items.reduce((s, i) => s + i.weight, 0);
  const expiredCount = data.items.filter((i) => i.remainingLife <= 0).length;
  const msdsMissing = data.items.filter((i) => !i.msdsAvailable).length;

  // Class distribution
  const classDist = (Object.keys(CLASS_LABELS) as HazmatClass[]).map((cls) => ({
    name: CLASS_LABELS[cls].split(":")[1].trim(),
    value: data.items.filter((i) => i.hazmatClass === cls).length,
    color: CLASS_COLORS[cls],
  }));

  // PPE compliance by class
  const ppeByClass = data.ppeReqs.map((p) => ({
    name: CLASS_LABELS[p.hazmatClass].split(":")[1].trim(),
    compliance: p.compliance,
    color: CLASS_COLORS[p.hazmatClass],
    level: p.level,
  }));

  // Storage zone capacity
  const zoneCapData = (Object.keys(CLASS_LABELS) as HazmatClass[]).map((cls) => {
    const zi = data.storageZones.filter((z) => data.items.some((it) => it.hazmatClass === cls && it.warehouse === z.warehouse));
    return { name: CLASS_LABELS[cls].split(":")[1].trim(), zones: zi.length, color: CLASS_COLORS[cls] };
  });

  // Filtered
  const filteredItems = useMemo(() => data.items.filter((i) => {
    if (searchTerm && !i.productName.toLowerCase().includes(searchTerm.toLowerCase()) && !i.unNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterClass !== "all" && i.hazmatClass !== filterClass) return false;
    if (filterWarehouse !== "all" && i.warehouse !== filterWarehouse) return false;
    if (filterCompliance !== "all" && i.complianceStatus !== filterCompliance) return false;
    return true;
  }), [data.items, searchTerm, filterClass, filterWarehouse, filterCompliance]);

  const filteredIncidents = useMemo(() => data.incidents.filter((inc) => {
    if (searchTerm && !inc.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterSeverity !== "all" && inc.severity !== filterSeverity) return false;
    if (filterWarehouse !== "all" && inc.warehouse !== filterWarehouse) return false;
    if (filterClass !== "all" && inc.hazmatClass !== filterClass) return false;
    return true;
  }), [data.incidents, searchTerm, filterSeverity, filterWarehouse, filterClass]);

  const fmt = (n: number) => n.toLocaleString("en-IN");
  const fmtCur = (n: number) => "₹" + fmt(n);
  const fmtTime = (ts: number) => new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeAgo = (ts: number) => { const d = Date.now() - ts; return d < 3600000 ? `${Math.floor(d / 60000)}m ago` : d < 86400000 ? `${Math.floor(d / 3600000)}h ago` : `${Math.floor(d / 86400000)}d ago`; };

  return (
    <div className="haz-container space-y-4">
      {/* Header */}
      <div className="haz-header">
        <div className="haz-header-content">
          <div className="haz-header-icon-wrap">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="haz-header-title">Hazmat &amp; Dangerous Goods Management</h1>
            <p className="haz-header-subtitle">UN classification, MSDS tracking, incident management, PPE compliance, and storage segregation for 6 warehouses</p>
          </div>
        </div>
        <div className="haz-header-badges">
          <div className="haz-header-badge haz-badge-orange">
            <Package className="h-3.5 w-3.5" />
            <span>{totalItems} Chemical Items</span>
          </div>
          <div className="haz-header-badge haz-badge-red">
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>{incidentsOpen} Open Incidents</span>
          </div>
          <div className="haz-header-badge haz-badge-green">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{Math.round((compliant / totalItems) * 100)}% Compliant</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="haz-tabs">
        {tabs.map((tab, i) => (
          <button key={tab} className={`haz-tab ${activeTab === i ? "haz-tab-active" : ""}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: Overview */}
      {activeTab === 0 && (
        <div className="haz-tab-content space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Total Items", value: totalItems, icon: Package, color: "haz-kpi-orange" },
              { label: "Compliance", value: `${Math.round((compliant / totalItems) * 100)}%`, icon: ShieldCheck, color: "haz-kpi-green" },
              { label: "Open Incidents", value: incidentsOpen, icon: AlertTriangle, color: "haz-kpi-red" },
              { label: "Total Weight", value: `${fmt(totalWeight)} kg`, icon: Gauge, color: "haz-kpi-purple" },
              { label: "Expired", value: expiredCount, icon: Clock, color: "haz-kpi-amber" },
              { label: "MSDS Missing", value: msdsMissing, icon: FileText, color: "haz-kpi-blue" },
            ].map((kpi, i) => (
              <Card key={i} className={`haz-kpi-card ${kpi.color} haz-stagger-${Math.min(i, 5)}`}>
                <CardContent className="inner-glow glass-subtle p-4">
                  <kpi.icon className="h-4 w-4 haz-kpi-icon mb-2" />
                  <div className="haz-kpi-value">{kpi.value}</div>
                  <div className="haz-kpi-label">{kpi.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Class Distribution + Compliance Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="hover-lift-sm haz-card">
              <CardHeader className="pb-2">
                <CardTitle className="haz-card-title"><Layers className="h-4 w-4" /> UN Hazard Class Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={classDist} cx="50%" cy="50%" innerRadius={45} outerRadius={85} dataKey="value" paddingAngle={2} label={({ name, value }) => `${name}: ${value}`}>
                        {classDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm haz-card">
              <CardHeader className="pb-2">
                <CardTitle className="haz-card-title"><TrendingUp className="h-4 w-4" /> Compliance Trend (12 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.complianceTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" domain={[80, 100]} tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line yAxisId="left" type="monotone" dataKey="compliance" stroke="#10b981" strokeWidth={2} name="Compliance %" dot={{ r: 3 }} />
                      <Bar yAxisId="right" dataKey="violations" fill="#ef4444" name="Violations" radius={[4, 4, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incident Trend + Danger Diamond Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="hover-lift-sm haz-card">
              <CardHeader className="pb-2">
                <CardTitle className="haz-card-title"><AlertTriangle className="h-4 w-4" /> Monthly Incident Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.incidentTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="minor" stackId="a" fill="#f59e0b" name="Minor" />
                      <Bar dataKey="moderate" stackId="a" fill="#f97316" name="Moderate" />
                      <Bar dataKey="major" stackId="a" fill="#ef4444" name="Major" />
                      <Bar dataKey="critical" stackId="a" fill="#dc2626" name="Critical" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm haz-card">
              <CardHeader className="pb-2">
                <CardTitle className="haz-card-title"><TriangleAlert className="h-4 w-4" /> PPE Compliance by Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ppeByClass} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="compliance" radius={[0, 4, 4, 0]} name="Compliance %">
                        {ppeByClass.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 1: Chemical Inventory */}
      {activeTab === 1 && (
        <div className="haz-tab-content space-y-4">
          <Card className="hover-lift-sm haz-filter-card">
            <CardContent className="inner-glow glass-subtle p-3 flex flex-wrap items-center gap-3">
              <div className="haz-filter-search">
                <Search className="h-3.5 w-3.5" />
                <input placeholder="Search product or UN#..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="haz-filter-input" />
              </div>
              <select className="haz-filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                <option value="all">All Classes</option>
                {(Object.keys(CLASS_LABELS) as HazmatClass[]).map((c) => <option key={c} value={c}>{CLASS_LABELS[c]}</option>)}
              </select>
              <select className="haz-filter-select" value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {WAREHOUSES.map((wh) => <option key={wh} value={wh}>{wh.split(" ")[0]}</option>)}
              </select>
              <select className="haz-filter-select" value={filterCompliance} onChange={(e) => setFilterCompliance(e.target.value)}>
                <option value="all">All Compliance</option>
                <option value="compliant">Compliant</option>
                <option value="warning">Warning</option>
                <option value="non_compliant">Non-Compliant</option>
                <option value="expired">Expired</option>
              </select>
              <span className="haz-filter-count">{filteredItems.length} items</span>
            </CardContent>
          </Card>

          <Card className="hover-lift-sm haz-card">
            <CardHeader className="pb-2">
              <CardTitle className="haz-card-title"><Beaker className="h-4 w-4" /> Chemical Inventory Register</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="haz-table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>UN#</th>
                      <th>Class</th>
                      <th>Warehouse</th>
                      <th>Qty</th>
                      <th>PPE</th>
                      <th>MSDS</th>
                      <th>Life %</th>
                      <th>Compliance</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const lifeColor = item.remainingLife > 60 ? "haz-life-ok" : item.remainingLife > 20 ? "haz-life-warn" : "haz-life-crit";
                      return (
                        <tr key={item.id} className="haz-table-row">
                          <td className="font-mono text-xs">{item.id}</td>
                          <td className="text-xs max-w-[150px] truncate">{item.productName}</td>
                          <td className="font-mono text-xs">{item.unNumber}</td>
                          <td>
                            <span className="haz-class-badge" style={{ background: `${CLASS_COLORS[item.hazmatClass]}20`, color: CLASS_COLORS[item.hazmatClass] }}>
                              {CLASS_ICONS[item.hazmatClass]} {CLASS_LABELS[item.hazmatClass].split(":")[0]}
                            </span>
                          </td>
                          <td className="text-xs">{item.warehouse.split(" ")[0]}</td>
                          <td className="text-xs">{item.quantity} {item.unit}</td>
                          <td className="text-xs capitalize">{item.ppeRequired}</td>
                          <td>{item.msdsAvailable ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="haz-life-bar-bg w-10">
                                <div className={`haz-life-bar ${lifeColor}`} style={{ width: `${item.remainingLife}%` }} />
                              </div>
                              <span className={`text-xs font-semibold ${lifeColor === "haz-life-ok" ? "text-emerald-600" : lifeColor === "haz-life-warn" ? "text-amber-600" : "text-red-600"}`}>
                                {item.remainingLife}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <Badge variant={item.complianceStatus === "compliant" ? "success" : item.complianceStatus === "warning" ? "warning" : "destructive"} className="badge-interactive text-[10px]">
                              {item.complianceStatus}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="ghost" size="sm" className="press-scale h-7 w-7 p-0" onClick={() => setSelectedItem(item)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Item Detail Drawer */}
          {selectedItem && (
            <div className="haz-drawer-backdrop" onClick={() => setSelectedItem(null)}>
              <div className="haz-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="haz-drawer-header">
                  <h3 className="haz-drawer-title">{selectedItem.id} — {selectedItem.productName}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)} className="press-scale h-8 w-8 p-0"><XCircle className="h-4 w-4" /></Button>
                </div>
                <div className="haz-drawer-body space-y-4">
                  <div className="haz-drawer-section">
                    <h4 className="haz-drawer-section-title">Product Info</h4>
                    <div className="haz-drawer-grid">
                      <div><span className="haz-drawer-label">UN Number</span><span className="haz-drawer-value font-mono">{selectedItem.unNumber}</span></div>
                      <div><span className="haz-drawer-label">Hazard Class</span><span className="haz-drawer-value">{CLASS_LABELS[selectedItem.hazmatClass]}</span></div>
                      <div><span className="haz-drawer-label">Quantity</span><span className="haz-drawer-value">{selectedItem.quantity} {selectedItem.unit}</span></div>
                      <div><span className="haz-drawer-label">Weight</span><span className="haz-drawer-value">{fmt(selectedItem.weight)} kg</span></div>
                      <div><span className="haz-drawer-label">Supplier</span><span className="haz-drawer-value">{selectedItem.supplier}</span></div>
                      <div><span className="haz-drawer-label">Storage Zone</span><span className="haz-drawer-value capitalize">{selectedItem.storageZone.replace("_", " ")}</span></div>
                    </div>
                  </div>
                  <div className="haz-drawer-section">
                    <h4 className="haz-drawer-section-title">Properties</h4>
                    <div className="haz-drawer-grid">
                      {selectedItem.flashPoint !== null && <div><span className="haz-drawer-label">Flash Point</span><span className="haz-drawer-value">{selectedItem.flashPoint}°C</span></div>}
                      {selectedItem.boilingPoint !== null && <div><span className="haz-drawer-label">Boiling Point</span><span className="haz-drawer-value">{selectedItem.boilingPoint}°C</span></div>}
                      {selectedItem.radiationLevel !== null && <div><span className="haz-drawer-label">Radiation</span><span className="haz-drawer-value text-red-600">{selectedItem.radiationLevel} μSv/h</span></div>}
                      {selectedItem.phLevel !== null && <div><span className="haz-drawer-label">pH Level</span><span className="haz-drawer-value">{selectedItem.phLevel}</span></div>}
                      <div><span className="badge-interactive haz-drawer-label">PPE Required</span><Badge variant={selectedItem.ppeRequired === "full" ? "destructive" : selectedItem.ppeRequired === "intermediate" ? "warning" : "outline"} className="text-[10px]">{selectedItem.ppeRequired.toUpperCase()}</Badge></div>
                      <div><span className="haz-drawer-label">MSDS</span>{selectedItem.msdsAvailable ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}</div>
                    </div>
                  </div>
                  {selectedItem.incompatibles.length > 0 && (
                    <div className="haz-drawer-section">
                      <h4 className="haz-drawer-section-title">Incompatibles</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.incompatibles.map((inc) => <Badge key={inc} variant="destructive" className="badge-interactive text-[10px]">{inc}</Badge>)}
                      </div>
                    </div>
                  )}
                  <div className="haz-drawer-section">
                    <h4 className="haz-drawer-section-title">Inspection Schedule</h4>
                    <div className="haz-drawer-grid">
                      <div><span className="haz-drawer-label">Last</span><span className="haz-drawer-value">{fmtTime(selectedItem.lastInspection)}</span></div>
                      <div><span className="haz-drawer-label">Next</span><span className="haz-drawer-value">{fmtTime(selectedItem.nextInspection)}</span></div>
                      <div><span className="haz-drawer-label">Incidents</span><span className={`haz-drawer-value ${selectedItem.incidentCount > 0 ? "text-red-600 font-semibold" : ""}`}>{selectedItem.incidentCount}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incident Tracker */}
      {activeTab === 2 && (
        <div className="haz-tab-content space-y-4">
          <Card className="hover-lift-sm haz-filter-card">
            <CardContent className="inner-glow glass-subtle p-3 flex flex-wrap items-center gap-3">
              <div className="haz-filter-search">
                <Search className="h-3.5 w-3.5" />
                <input placeholder="Search incident ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="haz-filter-input" />
              </div>
              <select className="haz-filter-select" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                <option value="all">All Severity</option>
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
              <select className="haz-filter-select" value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {WAREHOUSES.map((wh) => <option key={wh} value={wh}>{wh.split(" ")[0]}</option>)}
              </select>
              <span className="haz-filter-count">{filteredIncidents.length} incidents</span>
            </CardContent>
          </Card>

          <Card className="hover-lift-sm haz-card">
            <CardHeader className="pb-2">
              <CardTitle className="haz-card-title"><AlertOctagon className="h-4 w-4" /> Safety Incident Register</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="haz-table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Severity</th>
                      <th>Warehouse</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Casualties</th>
                      <th>Response</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncidents.map((inc) => (
                      <tr key={inc.id} className="haz-table-row">
                        <td className="font-mono text-xs">{inc.id}</td>
                        <td className="text-xs">{inc.type}</td>
                        <td>
                          <Badge className="badge-interactive haz-sev-badge text-[10px]" style={{ background: `${SEVERITY_COLORS[inc.severity]}20`, color: SEVERITY_COLORS[inc.severity] }}>
                            {inc.severity}
                          </Badge>
                        </td>
                        <td className="text-xs">{inc.warehouse.split(" ")[0]}</td>
                        <td className="text-xs">{fmtTime(inc.date)}</td>
                        <td className="text-xs max-w-[180px] truncate">{inc.description}</td>
                        <td className="text-xs font-semibold">{inc.casualties || "—"}</td>
                        <td className="text-xs">{inc.responseTimeMin}min</td>
                        <td>
                          {inc.resolved ? <Badge variant="success" className="badge-interactive text-[10px]">Resolved</Badge> : <Badge variant="destructive" className="text-[10px]">Open</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Root cause & severity charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="hover-lift-sm haz-card">
              <CardHeader className="pb-2">
                <CardTitle className="haz-card-title"><FileText className="h-4 w-4" /> Root Cause Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[...new Set(data.incidents.map((i) => i.rootCause))].map((rc) => ({
                        name: rc, value: data.incidents.filter((i) => i.rootCause === rc).length,
                      }))} cx="50%" cy="50%" innerRadius={35} outerRadius={70} dataKey="value" paddingAngle={2}>
                        {Array.from({ length: 10 }, (_, i) => <Cell key={i} fill={["#ef4444", "#f97316", "#f59e0b", "#eab308", "#10b981", "#06b6d4", "#6366f1", "#ec4899", "#8b5cf6", "#6b7280"][i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 9 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm haz-card">
              <CardHeader className="pb-2">
                <CardTitle className="haz-card-title"><IndianRupee className="h-4 w-4" /> Incident Cost Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...new Set(data.incidents.map((i) => i.type))].map((t) => ({
                      type: t,
                      cost: data.incidents.filter((i) => i.type === t).reduce((s, i) => s + i.costImpact, 0),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="type" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtCur(v)} />
                      <Bar dataKey="cost" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cost (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: PPE & Safety */}
      {activeTab === 3 && (
        <div className="haz-tab-content space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.ppeReqs.map((req, i) => (
              <Card key={req.id} className={`haz-ppe-card haz-stagger-${Math.min(i, 8)}`}>
                <CardContent className="inner-glow glass-subtle p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="haz-class-badge" style={{ background: `${CLASS_COLORS[req.hazmatClass]}20`, color: CLASS_COLORS[req.hazmatClass] }}>
                      {CLASS_ICONS[req.hazmatClass]} {CLASS_LABELS[req.hazmatClass]}
                    </span>
                    <Badge variant={req.level === "full" ? "destructive" : req.level === "intermediate" ? "warning" : "outline"} className="badge-interactive text-[10px]">
                      {req.level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1 mb-3">
                    {req.equipment.map((eq) => (
                      <div key={eq} className="haz-ppe-equip-item">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs">{eq}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Compliance</span>
                    <span className={`font-semibold ${req.compliance >= 85 ? "text-emerald-600" : req.compliance >= 70 ? "text-amber-600" : "text-red-600"}`}>{req.compliance}%</span>
                  </div>
                  <div className="haz-ppe-bar-bg">
                    <div className={`haz-ppe-bar ${req.compliance >= 85 ? "bg-emerald-500" : req.compliance >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${req.compliance}%` }} />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>Cert. due: {fmtTime(req.certificationExpiry)}</span>
                    <span>Training: {req.trainingRequired ? "Required" : "N/A"}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Storage Zones */}
      {activeTab === 4 && (
        <div className="haz-tab-content space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.storageZones.map((zone, i) => (
              <Card key={zone.id} className={`haz-zone-card haz-stagger-${Math.min(i, 11)}`}>
                <CardContent className="inner-glow glass-subtle p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="haz-zone-id">{zone.id}</span>
                    <Badge variant={zone.compliance === "compliant" ? "success" : zone.compliance === "warning" ? "warning" : "destructive"} className="badge-interactive text-[10px]">
                      {zone.compliance}
                    </Badge>
                  </div>
                  <div className="haz-zone-name">{zone.name}</div>
                  <div className="haz-zone-type">{zone.zoneType.replace("_", " ")}</div>
                  <div className="haz-zone-metrics">
                    <div className="haz-zone-metric"><Warehouse className="h-3 w-3" /><span>{zone.warehouse.split(" ")[0]}</span></div>
                    <div className="haz-zone-metric"><Wind className="h-3 w-3" /><span>{zone.ventilation}</span></div>
                  </div>
                  <div className="flex justify-between text-xs mb-1 mt-2">
                    <span>Capacity</span>
                    <span>{zone.usedCapacity}/{zone.capacity}</span>
                  </div>
                  <div className="haz-ppe-bar-bg">
                    <div className={`haz-ppe-bar ${zone.usedCapacity / zone.capacity > 0.85 ? "bg-red-500" : zone.usedCapacity / zone.capacity > 0.6 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${(zone.usedCapacity / zone.capacity) * 100}%` }} />
                  </div>
                  <div className="haz-zone-features mt-2">
                    {zone.leakDetection && <span className="haz-zone-feature"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Leak Det.</span>}
                    {zone.emergencyShower && <span className="haz-zone-feature"><CheckCircle2 className="h-3 w-3 text-blue-500" /> E. Shower</span>}
                    {zone.eyeWash && <span className="haz-zone-feature"><CheckCircle2 className="h-3 w-3 text-cyan-500" /> Eye Wash</span>}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>Fire: {zone.fireSuppression}</span>
                    <span>Temp: {zone.temperatureRange[0]}°~{zone.temperatureRange[1]}°C</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
