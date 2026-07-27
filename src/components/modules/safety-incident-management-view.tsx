"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Clock, Search,
  Filter, Eye, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight,
  ArrowDownRight, User, Building2, Calendar, FileText, Activity, Target,
  Zap, Info, ChevronDown, ChevronUp, TriangleAlert, Flame, Droplets,
  HardHat, Wind, Radiation, Biohazard, Skull, Heart, ThermometerSun,
  Siren, ShieldCheck, ShieldX, ClipboardCheck, Flag, Megaphone,
  AlertOctagon, Footprints, BrainCircuit, Hand, CircleAlert,
  Ban, Check, Cross, Plus, Minus, BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
type Severity = "critical" | "major" | "moderate" | "minor";
type Status = "open" | "investigating" | "root_cause_found" | "corrective_action" | "closed";
type Category = "slip_trip_fall" | "mechanical" | "chemical" | "electrical" | "fire" | "ergonomic" | "fall_from_height" | "struck_by" | "near_miss" | "environmental" | "vehicle" | "heat_stress";

const CATEGORY_LABELS: Record<Category, string> = {
  slip_trip_fall: "Slip/Trip/Fall",
  mechanical: "Mechanical",
  chemical: "Chemical Spill/Exposure",
  electrical: "Electrical",
  fire: "Fire/Explosion",
  ergonomic: "Ergonomic",
  fall_from_height: "Fall from Height",
  struck_by: "Struck By Object",
  near_miss: "Near Miss",
  environmental: "Environmental",
  vehicle: "Vehicle/Forklift",
  heat_stress: "Heat Stress",
};

const CATEGORY_ICONS: Partial<Record<Category, React.ReactNode>> = {
  slip_trip_fall: <Footprints className="h-4 w-4" />,
  mechanical: <Cog className="h-4 w-4" />,
  chemical: <Droplets className="h-4 w-4" />,
  electrical: <Zap className="h-4 w-4" />,
  fire: <Flame className="h-4 w-4" />,
  ergonomic: <Hand className="h-4 w-4" />,
  fall_from_height: <ArrowDownRight className="h-4 w-4" />,
  struck_by: <TriangleAlert className="h-4 w-4" />,
  near_miss: <AlertTriangle className="h-4 w-4" />,
  environmental: <Wind className="h-4 w-4" />,
  vehicle: <Siren className="h-4 w-4" />,
  heat_stress: <ThermometerSun className="h-4 w-4" />,
};

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  major: "Major",
  moderate: "Moderate",
  minor: "Minor",
};

const STATUS_LABELS: Record<Status, string> = {
  open: "Open",
  investigating: "Investigating",
  root_cause_found: "Root Cause Found",
  corrective_action: "Corrective Action",
  closed: "Closed",
};

interface Witness { name: string; role: string; statement: string; date: string; }
interface CorrectiveAction { id: string; description: string; assignee: string; dueDate: string; status: "pending" | "in_progress" | "completed"; priority: Severity; }
interface RootCauseAnalysis { method: string; causes: string[]; contributingFactors: string[]; immediateActions: string[]; findings: string; }
interface InjuryRecord { bodyPart: string; injuryType: string; firstAid: boolean; medicalTreatment: boolean; lostTime: boolean; restrictedDuty: boolean; daysLost: number; }

interface Incident {
  id: string;
  incidentNo: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  status: Status;
  warehouse: string;
  location: string;
  reportedBy: string;
  department: string;
  reportedAt: string;
  occurredAt: string;
  shift: string;
  weatherConditions: string;
  witnesses: Witness[];
  rootCauseAnalysis: RootCauseAnalysis | null;
  correctiveActions: CorrectiveAction[];
  injuryRecord: InjuryRecord | null;
  equipmentInvolved: string;
  costEstimate: number;
  oshaRecordable: boolean;
  nearMiss: boolean;
  recurrence: boolean;
  photoCount: number;
  riskScore: number;
}

// ============================================================================
// Deterministic Mock Data Generator
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateSafetyData() {
  const rand = seededRandom(116116);

  const warehouses = [
    "Mumbai DC", "Delhi NCR Hub", "Chennai Distribution", "Kolkata Warehouse",
    "Bangalore South", "Hyderabad Central",
  ];

  const locations = [
    "Dock A1", "Dock B3", "Receiving Bay", "Packing Area C", "Staging Zone D2",
    "Forklift Lane 3", "Cold Storage Unit", "Racking Section E", "Loading Bay F1",
    "Break Room", "Parking Lot", "Mezzanine Level", "Battery Charging Station",
    "Conveyor Belt Area", "Office Wing", "External Yard", "Chemical Storage Room",
    "High Bay Section", "Returns Processing", "Quality Lab",
  ];

  const categories: Category[] = [
    "slip_trip_fall", "slip_trip_fall", "near_miss", "mechanical", "chemical",
    "electrical", "fire", "ergonomic", "fall_from_height", "struck_by",
    "near_miss", "environmental", "vehicle", "heat_stress",
  ];

  const severities: Severity[] = ["minor", "minor", "minor", "moderate", "moderate", "moderate", "major", "major", "critical"];
  const statuses: Status[] = ["open", "investigating", "root_cause_found", "corrective_action", "closed", "closed", "closed"];
  const shifts = ["Morning (6AM-2PM)", "Afternoon (2PM-10PM)", "Night (10PM-6AM)"];
  const departments = ["Warehousing", "Logistics", "Maintenance", "Quality", "Safety", "Administration", "Returns"];
  const reporters = [
    "Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Devi", "Vikram Singh",
    "Anjali Gupta", "Mohammed Irfan", "Deepa Nair", "Suresh Menon", "Kavita Rao",
    "Arjun Reddy", "Lakshmi Iyer", "Rohit Mehta", "Sneha Kulkarni", "Manoj Tiwari",
  ];
  const methods = ["5-Why Analysis", "Fishbone Diagram", "Fault Tree Analysis", "Barrier Analysis", "Bowtie Analysis"];
  const bodyParts = ["Back", "Hand/Finger", "Foot/Ankle", "Knee", "Shoulder", "Head", "Eye", "Arm", "Wrist", "Neck", "Leg", "Torso"];
  const injuryTypes = ["Strain", "Cut/Laceration", "Bruise/Contusion", "Burn", "Fracture", "Sprain", "Puncture", "Concussion", "Crush", "Dermatitis"];
  const weathers = ["Clear", "Rainy", "Hot & Humid", "Foggy", "Normal", "Windy"];

  const titleTemplates: Record<Category, string[]> = {
    slip_trip_fall: ["Wet floor caused slip in dock area", "Tripped over pallet debris", "Fell on oily surface near conveyor", "Slipped on rain-soaked loading bay"],
    mechanical: ["Forklift brake failure near racking", "Conveyor belt jam caused pinch injury", "Pallet jack malfunction struck worker", "Shelving unit collapsed in storage area"],
    chemical: ["Chemical drum leaked in storage", "Fumes from cleaning agent exposure", "Battery acid spill at charging station", "Improper mixing caused reaction"],
    electrical: ["Exposed wiring in mezzanine area", "Short circuit in cold storage unit", "Electrical shock from faulty outlet", "Power tool malfunction caused arc flash"],
    fire: ["Small fire near battery charging station", "Welding spark ignited packaging material", "Electrical panel overheating", "Chemical combustion in storage area"],
    ergonomic: ["Repetitive strain from lifting operations", "Improper workstation posture injury", "Manual handling injury - heavy load", "Awkward positioning caused back strain"],
    fall_from_height: ["Falled from mezzanine platform", "Ladder slip during stock retrieval", "Fell from racking system", "Roof access fall during maintenance"],
    struck_by: ["Struck by falling inventory from shelf", "Forklift hit worker in staging area", "Swinging pallet struck passing worker", "Debris fell from conveyor system"],
    near_miss: ["Near miss - forklift almost hit worker", "Almost fell from edge of dock plate", "Chemical splash narrowly avoided", "Falling object missed worker by inches"],
    environmental: ["Water contamination detected in drainage", "Dust exceedance in grinding area", "Noise level breach in mechanical room", "Chemical vapor detected in storage"],
    vehicle: ["Forklift collision in narrow aisle", "Trailer movement incident at dock", "Forklift tipped over on incline", "Vehicle struck dock door"],
    heat_stress: ["Worker fainted in non-airconditioned area", "Heat exhaustion during peak summer shift", "Dehydration incident in yard area", "Heat cramps reported in loading bay"],
  };

  const causes: Record<Category, string[]> = {
    slip_trip_fall: ["Wet floor without signage", "Poor housekeeping", "Inadequate footwear policy", "Missing floor mats"],
    mechanical: ["Lack of preventive maintenance", "Operator error", "Equipment overload", "Worn components not replaced"],
    chemical: ["Improper storage", "Missing PPE", "Label misread", "Incompatible chemical proximity"],
    electrical: ["Wiring deterioration", "DIY repairs", "Missing ground fault protection", "Overloaded circuits"],
    fire: ["Combustible material storage violation", "Welding without hot work permit", "Electrical overload", "Missing fire extinguisher"],
    ergonomic: ["Poor workstation design", "No mechanical aid available", "Inadequate training", "Excessive repetitive motion"],
    fall_from_height: ["Missing guardrails", "Improper ladder use", "No fall arrest harness", "Unsecured platform"],
    struck_by: ["Unsecured stored materials", "Limited visibility", "Improper stacking", "No exclusion zone"],
    near_miss: ["Lack of awareness", "Rushed operations", "Communication failure", "Procedural shortcut"],
    environmental: ["Containment failure", "Lack of monitoring", "Ventilation system failure", "Improper disposal"],
    vehicle: ["Speeding", "Blind spot", "Fatigued operator", "Poor lighting"],
    heat_stress: ["Inadequate ventilation", "Insufficient hydration breaks", "No acclimatization program", "PPE adding heat burden"],
  };

  const incidents: Incident[] = [];

  for (let i = 0; i < 48; i++) {
    const cat: Category = categories[Math.floor(rand() * categories.length)];
    const sev: Severity = cat === "near_miss" ? (rand() > 0.7 ? "moderate" : "minor") : (severities[Math.floor(rand() * severities.length)] as Severity);
    const stat: Status = statuses[Math.floor(rand() * statuses.length)];
    const titles = titleTemplates[cat];
    const title = titles[Math.floor(rand() * titles.length)];
    const hasInjury = rand() > 0.3;
    const isNearMiss = cat === "near_miss";
    const riskScore = Math.round((sev === "critical" ? 25 : sev === "major" ? 18 : sev === "moderate" ? 10 : 5) * (stat === "open" ? 2.5 : stat === "investigating" ? 2 : stat === "root_cause_found" ? 1.5 : stat === "corrective_action" ? 1.2 : 0.8) + rand() * 5);

    const witnesses: Witness[] = [];
    const nw = Math.floor(rand() * 3);
    for (let w = 0; w < nw; w++) {
      const r = reporters[Math.floor(rand() * reporters.length)];
      witnesses.push({ name: r, role: departments[Math.floor(rand() * departments.length)], statement: `Observed ${title.toLowerCase()} from ${locations[Math.floor(rand() * locations.length)]}.`, date: `2026-01-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}` });
    }

    const rca: RootCauseAnalysis | null = ["root_cause_found", "corrective_action", "closed"].includes(stat) ? {
      method: methods[Math.floor(rand() * methods.length)],
      causes: [causes[cat][Math.floor(rand() * causes[cat].length)], causes[cat][Math.floor(rand() * causes[cat].length)]],
      contributingFactors: ["Fatigue", "Time pressure", "Insufficient training", "Poor communication", "Equipment age", "Environmental conditions"].filter(() => rand() > 0.5).slice(0, 2),
      immediateActions: ["Area cordoned off", "Equipment locked out", "Affected employee sent for medical", "Safety stand-down conducted", "Immediate cleanup"].filter(() => rand() > 0.5).slice(0, 2),
      findings: `Root cause identified as ${causes[cat][0].toLowerCase()} leading to incident. Contributing factors exacerbated the risk. Immediate corrective measures were implemented.`,
    } : null;

    const cas: CorrectiveAction[] = [];
    if (stat !== "open") {
      const nca = Math.floor(rand() * 4) + 1;
      for (let c = 0; c < nca; c++) {
        cas.push({
          id: `CA-${String(i + 1).padStart(3, "0")}-${c + 1}`,
          description: `Implement ${causes[cat][c % causes[cat].length].toLowerCase()} control measures`,
          assignee: reporters[Math.floor(rand() * reporters.length)],
          dueDate: `2026-${String(Math.floor(rand() * 3) + 7).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
          status: stat === "closed" ? "completed" : stat === "corrective_action" ? (rand() > 0.5 ? "in_progress" : "pending") : "pending",
          priority: c === 0 ? sev : ["minor", "moderate"][Math.floor(rand() * 2)] as Severity,
        });
      }
    }

    const injury: InjuryRecord | null = hasInjury ? {
      bodyPart: bodyParts[Math.floor(rand() * bodyParts.length)],
      injuryType: injuryTypes[Math.floor(rand() * injuryTypes.length)],
      firstAid: sev === "minor" || rand() > 0.5,
      medicalTreatment: sev === "major" || sev === "critical" || rand() > 0.6,
      lostTime: sev === "critical" || (sev === "major" && rand() > 0.4),
      restrictedDuty: rand() > 0.6,
      daysLost: sev === "critical" ? Math.floor(rand() * 30) + 7 : sev === "major" ? Math.floor(rand() * 10) + 1 : 0,
    } : null;

    const month = Math.floor(rand() * 12) + 1;
    const day = Math.floor(rand() * 28) + 1;
    const occDate = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    incidents.push({
      id: `INC-${String(i + 1).padStart(4, "0")}`,
      incidentNo: `INC-2026-${String(i + 1).padStart(4, "0")}`,
      title,
      description: `${title}. Occurred during ${shifts[Math.floor(rand() * 3)]} shift. Immediate area was secured and safety team notified.`,
      category: cat,
      severity: sev,
      status: stat,
      warehouse: warehouses[Math.floor(rand() * warehouses.length)],
      location: locations[Math.floor(rand() * locations.length)],
      reportedBy: reporters[Math.floor(rand() * reporters.length)],
      department: departments[Math.floor(rand() * departments.length)],
      reportedAt: occDate,
      occurredAt: occDate,
      shift: shifts[Math.floor(rand() * 3)],
      weatherConditions: weathers[Math.floor(rand() * weathers.length)],
      witnesses,
      rootCauseAnalysis: rca,
      correctiveActions: cas,
      injuryRecord: injury,
      equipmentInvolved: rand() > 0.5 ? ["Forklift #FL-07", "Conveyor CV-03", "Pallet Jack PJ-12", "Shelving Unit SE-15", "Battery Charger BC-02"][Math.floor(rand() * 5)] : "N/A",
      costEstimate: sev === "critical" ? Math.round(rand() * 500000) + 100000 : sev === "major" ? Math.round(rand() * 100000) + 10000 : sev === "moderate" ? Math.round(rand() * 20000) + 2000 : Math.round(rand() * 5000) + 500,
      oshaRecordable: hasInjury && (sev === "major" || sev === "critical"),
      nearMiss: isNearMiss,
      recurrence: rand() > 0.85,
      photoCount: Math.floor(rand() * 8) + 1,
      riskScore: Math.min(Math.max(riskScore, 1), 100),
    });
  }

  return incidents.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}

// ============================================================================
// Helper Components
// ============================================================================
function SeverityBadge({ severity }: { severity: Severity }) {
  const colorMap: Record<Severity, "destructive" | "warning" | "default" | "secondary"> = {
    critical: "destructive", major: "warning", moderate: "default", minor: "secondary",
  };
  return <Badge variant={colorMap[severity]} className="text-[10px] font-bold uppercase tracking-wider">{SEVERITY_LABELS[severity]}</Badge>;
}

function StatusBadge({ status }: { status: Status }) {
  const colorMap: Record<Status, "destructive" | "warning" | "default" | "secondary" | "outline"> = {
    open: "destructive", investigating: "warning", root_cause_found: "default", corrective_action: "secondary", closed: "outline",
  };
  return <Badge variant={colorMap[status]} className="text-[10px]">{STATUS_LABELS[status]}</Badge>;
}

function FormatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function RiskScoreRing({ score, size = 60 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 75 ? "#ef4444" : score >= 50 ? "#f59e0b" : score >= 25 ? "#3b82f6" : "#22c55e";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" className="text-muted-foreground/20" strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={4} strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>{Math.round(score)}</span>
    </div>
  );
}

function Cog({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" /><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1", "#84cc16", "#e11d48"];

// ============================================================================
// Main Component
// ============================================================================
export function SafetyIncidentManagementView() {
  const incidents = useMemo(() => generateSafetyData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [expandedCA, setExpandedCA] = useState<string | null>(null);

  // KPI Data
  const kpis = useMemo(() => {
    const total = incidents.length;
    const open = incidents.filter(i => i.status === "open" || i.status === "investigating").length;
    const critical = incidents.filter(i => i.severity === "critical").length;
    const oshaRecordable = incidents.filter(i => i.oshaRecordable).length;
    const nearMisses = incidents.filter(i => i.nearMiss).length;
    const closed = incidents.filter(i => i.status === "closed").length;
    const resolutionRate = total > 0 ? Math.round((closed / total) * 100) : 0;
    const totalCost = incidents.reduce((s, i) => s + i.costEstimate, 0);
    const avgResolutionDays = 4.2;
    const trir = total > 0 ? ((oshaRecordable / total) * 200000).toFixed(1) : "0.0";
    return { total, open, critical, oshaRecordable, nearMisses, closed, resolutionRate, totalCost, avgResolutionDays, trir };
  }, [incidents]);

  // Monthly Trend
  const monthlyTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, mi) => {
      const monthInc = incidents.filter(i => { const d = new Date(i.occurredAt); return d.getMonth() === mi; });
      return {
        month: m,
        incidents: monthInc.length,
        critical: monthInc.filter(i => i.severity === "critical").length,
        nearMiss: monthInc.filter(i => i.nearMiss).length,
        oshaRecordable: monthInc.filter(i => i.oshaRecordable).length,
      };
    });
  }, [incidents]);

  // Category Distribution
  const categoryDist = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return Object.entries(counts).map(([cat, count]) => ({
      name: CATEGORY_LABELS[cat as Category] || cat,
      value: count,
      color: COLORS[Object.keys(CATEGORY_LABELS).indexOf(cat) % COLORS.length],
    })).sort((a, b) => b.value - a.value);
  }, [incidents]);

  // Warehouse Comparison
  const warehouseComp = useMemo(() => {
    const whMap: Record<string, { total: number; critical: number; closed: number; cost: number }> = {};
    incidents.forEach(i => {
      if (!whMap[i.warehouse]) whMap[i.warehouse] = { total: 0, critical: 0, closed: 0, cost: 0 };
      whMap[i.warehouse].total++;
      if (i.severity === "critical") whMap[i.warehouse].critical++;
      if (i.status === "closed") whMap[i.warehouse].closed++;
      whMap[i.warehouse].cost += i.costEstimate;
    });
    return Object.entries(whMap).map(([wh, d]) => ({
      warehouse: wh.replace(" ", "\n"),
      incidents: d.total,
      critical: d.critical,
      closed: d.closed,
      cost: d.cost,
    }));
  }, [incidents]);

  // Severity Distribution
  const severityDist = useMemo(() => {
    return (["critical", "major", "moderate", "minor"] as Severity[]).map(s => ({
      severity: SEVERITY_LABELS[s],
      count: incidents.filter(i => i.severity === s).length,
      color: s === "critical" ? "#ef4444" : s === "major" ? "#f59e0b" : s === "moderate" ? "#3b82f6" : "#22c55e",
    }));
  }, [incidents]);

  // Safety culture - leading indicators
  const safetyCulture = useMemo(() => {
    return [
      { metric: "Safety Observations Filed", value: 156, target: 200, trend: "up" },
      { metric: "Safety Training Hours", value: 840, target: 1000, trend: "up" },
      { metric: "Near Miss Report Rate", value: 3.2, target: 5.0, trend: "up" },
      { metric: "PPE Compliance", value: 94, target: 100, trend: "stable" },
      { metric: "Safety Meetings Held", value: 48, target: 52, trend: "up" },
      { metric: "Days Since Last Incident", value: 12, target: 30, trend: "down" },
    ];
  }, []);

  // Filtered incidents
  const filtered = useMemo(() => {
    return incidents.filter(i => {
      if (searchQuery && !i.title.toLowerCase().includes(searchQuery.toLowerCase()) && !i.incidentNo.toLowerCase().includes(searchQuery.toLowerCase()) && !i.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterSeverity !== "all" && i.severity !== filterSeverity) return false;
      if (filterStatus !== "all" && i.status !== filterStatus) return false;
      if (filterCategory !== "all" && i.category !== filterCategory) return false;
      if (filterWarehouse !== "all" && i.warehouse !== filterWarehouse) return false;
      return true;
    });
  }, [incidents, searchQuery, filterSeverity, filterStatus, filterCategory, filterWarehouse]);

  const tabLabels = [
    "Safety Overview",
    "Incident Register",
    "Root Cause Analysis",
    "Corrective Actions",
    "Compliance & OSHA",
  ];

  return (
    <div className="sim-container">
      {/* Animated Gradient Header */}
      <div className="sim-header">
        <div className="sim-header-content">
          <div className="flex items-center gap-3">
            <div className="sim-header-icon">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Safety & Incident Management</h1>
              <p className="text-white/70 text-sm">EHS Dashboard — Incident Tracking, Root Cause Analysis & Compliance</p>
            </div>
          </div>
          <div className="sim-header-badges">
            <div className="sim-header-badge bg-red-500/20 border-red-400/30">
              <AlertTriangle className="h-3.5 w-3.5 text-red-300" />
              <span className="text-red-200 text-sm font-medium">{kpis.open} Open</span>
            </div>
            <div className="sim-header-badge bg-emerald-500/20 border-emerald-400/30">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-emerald-200 text-sm font-medium">{kpis.resolutionRate}% Resolved</span>
            </div>
            <div className="sim-header-badge bg-amber-500/20 border-amber-400/30">
              <Activity className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-amber-200 text-sm font-medium">TRIR {kpis.trir}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="sim-tabs">
        {tabLabels.map((label, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)} className={`sim-tab ${activeTab === idx ? "active" : ""}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sim-content">
        {/* ===== TAB 0: Safety Overview ===== */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="sim-kpi-card sim-kpi-total">
                <ShieldAlert className="h-5 w-5 text-white/80" />
                <div className="text-2xl font-bold text-white">{kpis.total}</div>
                <div className="text-white/70 text-xs">Total Incidents</div>
              </div>
              <div className="sim-kpi-card sim-kpi-open">
                <AlertOctagon className="h-5 w-5 text-white/80" />
                <div className="text-2xl font-bold text-white">{kpis.open}</div>
                <div className="text-white/70 text-xs">Open / Investigating</div>
              </div>
              <div className="sim-kpi-card sim-kpi-critical">
                <Flame className="h-5 w-5 text-white/80" />
                <div className="text-2xl font-bold text-white">{kpis.critical}</div>
                <div className="text-white/70 text-xs">Critical Incidents</div>
              </div>
              <div className="sim-kpi-card sim-kpi-nearmiss">
                <AlertTriangle className="h-5 w-5 text-white/80" />
                <div className="text-2xl font-bold text-white">{kpis.nearMisses}</div>
                <div className="text-white/70 text-xs">Near Misses</div>
              </div>
              <div className="sim-kpi-card sim-kpi-cost">
                <IndianRupee className="h-5 w-5 text-white/80" />
                <div className="text-2xl font-bold text-white">{FormatINR(kpis.totalCost)}</div>
                <div className="text-white/70 text-xs">Total Cost Impact</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Monthly Trend */}
              <Card className="col-span-2 sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <LineChartIcon className="h-4 w-4 text-blue-500" /> Monthly Incident Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="incidents" name="Total" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="critical" name="Critical" fill="#ef4444" radius={[2, 2, 0, 0]} />
                      <Line dataKey="nearMiss" name="Near Miss" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-purple-500" /> By Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={categoryDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2} label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {categoryDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {categoryDist.slice(0, 6).map(c => (
                      <div key={c.name} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="truncate">{c.name.split("/")[0]}</span>
                        <span className="ml-auto font-mono text-muted-foreground">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row: Warehouse Comparison + Safety Culture */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Warehouse Comparison */}
              <Card className="sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-cyan-500" /> Warehouse Safety Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={warehouseComp} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="warehouse" tick={{ fontSize: 9 }} width={90} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="incidents" name="Total" fill="#3b82f6" radius={[0, 2, 2, 0]} />
                      <Bar dataKey="critical" name="Critical" fill="#ef4444" radius={[0, 2, 2, 0]} />
                      <Bar dataKey="closed" name="Closed" fill="#22c55e" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Safety Culture / Leading Indicators */}
              <Card className="sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Safety Culture — Leading Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {safetyCulture.map((item) => {
                    const pct = Math.min((item.value / item.target) * 100, 100);
                    return (
                      <div key={item.metric} className="sim-culture-item">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{item.metric}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold">{typeof item.value === "number" ? item.value.toLocaleString() : item.value}</span>
                            <span className="text-[10px] text-muted-foreground">/ {item.target.toLocaleString()}</span>
                            {item.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                            {item.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                            {item.trend === "stable" && <Minus className="h-3 w-3 text-blue-500" />}
                          </div>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Severity Distribution + Days Since Incident */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <CircleAlert className="h-4 w-4 text-red-500" /> Severity Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={severityDist} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="count" paddingAngle={3} label={({ severity, percent }) => `${severity} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {severityDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {severityDist.map(s => (
                      <div key={s.severity} className="text-center">
                        <div className="w-3 h-3 rounded-full mx-auto mb-0.5" style={{ backgroundColor: s.color }} />
                        <div className="text-xs">{s.severity}</div>
                        <div className="text-sm font-bold font-mono">{s.count}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card className="col-span-2 sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" /> Key Safety Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="sim-metric-box">
                      <div className="text-xs text-muted-foreground">Total Recordable Incident Rate (TRIR)</div>
                      <div className="text-2xl font-bold text-blue-600">{kpis.trir}</div>
                      <div className="text-[10px] text-muted-foreground">per 200,000 hours worked</div>
                    </div>
                    <div className="sim-metric-box">
                      <div className="text-xs text-muted-foreground">OSHA Recordable</div>
                      <div className="text-2xl font-bold text-red-600">{kpis.oshaRecordable}</div>
                      <div className="text-[10px] text-muted-foreground">this period</div>
                    </div>
                    <div className="sim-metric-box">
                      <div className="text-xs text-muted-foreground">Avg Resolution</div>
                      <div className="text-2xl font-bold text-emerald-600">{kpis.avgResolutionDays}d</div>
                      <div className="text-[10px] text-muted-foreground">target: 5 days</div>
                    </div>
                    <div className="sim-metric-box">
                      <div className="text-xs text-muted-foreground">Near Miss Ratio</div>
                      <div className="text-2xl font-bold text-amber-600">{kpis.total > 0 ? (kpis.nearMisses / kpis.total * 100).toFixed(1) : 0}%</div>
                      <div className="text-[10px] text-muted-foreground">higher = better culture</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===== TAB 1: Incident Register ===== */}
        {activeTab === 1 && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="sim-filter-bar">
              <div className="sim-search-box">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search incidents..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="sim-search-input"
                />
              </div>
              <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="sim-filter-select">
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="major">Major</option>
                <option value="moderate">Moderate</option>
                <option value="minor">Minor</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="sim-filter-select">
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="root_cause_found">Root Cause Found</option>
                <option value="corrective_action">Corrective Action</option>
                <option value="closed">Closed</option>
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="sim-filter-select">
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)} className="sim-filter-select">
                <option value="all">All Warehouses</option>
                {["Mumbai DC", "Delhi NCR Hub", "Chennai Distribution", "Kolkata Warehouse", "Bangalore South", "Hyderabad Central"].map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <div className="text-xs text-muted-foreground">{filtered.length} incidents</div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="sim-table">
                <thead>
                  <tr>
                    <th>Incident #</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Warehouse</th>
                    <th>Date</th>
                    <th>Risk</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 30).map(inc => (
                    <tr key={inc.id} className="sim-table-row" onClick={() => { setSelectedIncident(inc); setActiveTab(2); }}>
                      <td className="font-mono text-xs">{inc.incidentNo}</td>
                      <td className="text-xs font-medium max-w-[200px] truncate">{inc.title}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          {CATEGORY_ICONS[inc.category]}
                          <span className="text-xs">{CATEGORY_LABELS[inc.category]}</span>
                        </div>
                      </td>
                      <td><SeverityBadge severity={inc.severity} /></td>
                      <td><StatusBadge status={inc.status} /></td>
                      <td className="text-xs">{inc.warehouse.split(" ")[0]}</td>
                      <td className="text-xs text-muted-foreground">{inc.occurredAt}</td>
                      <td><RiskScoreRing score={inc.riskScore} size={36} /></td>
                      <td>
                        <button className="sim-view-btn" onClick={e => { e.stopPropagation(); setSelectedIncident(inc); setActiveTab(2); }}>
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== TAB 2: Root Cause Analysis ===== */}
        {activeTab === 2 && (
          <div className="space-y-4">
            {!selectedIncident ? (
              <div className="sim-empty-state">
                <ShieldX className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">Select an incident from the register to view its root cause analysis</p>
                <button onClick={() => setActiveTab(1)} className="sim-nav-btn">
                  <ChevronRight className="h-4 w-4" /> Go to Incident Register
                </button>
              </div>
            ) : (
              <>
                {/* Incident Detail Header */}
                <div className="sim-detail-header">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-white/70">{selectedIncident.incidentNo}</span>
                        <SeverityBadge severity={selectedIncident.severity} />
                        <StatusBadge status={selectedIncident.status} />
                        {selectedIncident.oshaRecordable && <Badge variant="destructive" className="text-[10px]">OSHA</Badge>}
                        {selectedIncident.nearMiss && <Badge variant="warning" className="text-[10px]">Near Miss</Badge>}
                      </div>
                      <h2 className="text-lg font-bold text-white">{selectedIncident.title}</h2>
                      <p className="text-white/60 text-xs mt-1">{selectedIncident.description}</p>
                    </div>
                    <div className="text-right">
                      <RiskScoreRing score={selectedIncident.riskScore} size={72} />
                      <div className="text-white/60 text-[10px] mt-1">Risk Score</div>
                    </div>
                  </div>
                  <div className="sim-detail-meta">
                    <div><Building2 className="h-3.5 w-3.5" /><span>{selectedIncident.warehouse}</span></div>
                    <div><MapPin className="h-3.5 w-3.5" /><span>{selectedIncident.location}</span></div>
                    <div><User className="h-3.5 w-3.5" /><span>{selectedIncident.reportedBy}</span></div>
                    <div><Calendar className="h-3.5 w-3.5" /><span>{selectedIncident.occurredAt} — {selectedIncident.shift}</span></div>
                    <div><IndianRupee className="h-3.5 w-3.5" /><span>{FormatINR(selectedIncident.costEstimate)}</span></div>
                    {selectedIncident.equipmentInvolved !== "N/A" && <div><Cog className="h-3.5 w-3.5" /><span>{selectedIncident.equipmentInvolved}</span></div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Root Cause Analysis */}
                  <Card className="sim-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-purple-500" /> Root Cause Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedIncident.rootCauseAnalysis ? (
                        <div className="space-y-4">
                          <div className="sim-rca-method">
                            <Badge variant="outline" className="text-xs">{selectedIncident.rootCauseAnalysis.method}</Badge>
                            <span className="text-xs text-muted-foreground">Analysis Method</span>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-red-600 mb-1.5 flex items-center gap-1"><XCircle className="h-3 w-3" /> Root Causes</div>
                            {selectedIncident.rootCauseAnalysis.causes.map((c, i) => (
                              <div key={i} className="sim-rca-cause">{c}</div>
                            ))}
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-amber-600 mb-1.5 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Contributing Factors</div>
                            {selectedIncident.rootCauseAnalysis.contributingFactors.map((f, i) => (
                              <div key={i} className="sim-rca-factor">{f}</div>
                            ))}
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-blue-600 mb-1.5 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Immediate Actions Taken</div>
                            {selectedIncident.rootCauseAnalysis.immediateActions.map((a, i) => (
                              <div key={i} className="sim-rca-action">{a}</div>
                            ))}
                          </div>

                          <div className="sim-rca-findings">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Findings</div>
                            <p className="text-xs">{selectedIncident.rootCauseAnalysis.findings}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <ClipboardCheck className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">Root cause analysis not yet completed</p>
                          <p className="text-[10px]">Status: {STATUS_LABELS[selectedIncident.status]}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Injury Record + Witnesses */}
                  <div className="space-y-4">
                    {/* Injury Record */}
                    <Card className="sim-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" /> Injury Record
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedIncident.injuryRecord ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="sim-injury-field">
                                <span className="text-[10px] text-muted-foreground">Body Part</span>
                                <span className="text-xs font-medium">{selectedIncident.injuryRecord.bodyPart}</span>
                              </div>
                              <div className="sim-injury-field">
                                <span className="text-[10px] text-muted-foreground">Injury Type</span>
                                <span className="text-xs font-medium">{selectedIncident.injuryRecord.injuryType}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedIncident.injuryRecord.firstAid && <Badge variant="secondary" className="text-[10px]">First Aid</Badge>}
                              {selectedIncident.injuryRecord.medicalTreatment && <Badge variant="warning" className="text-[10px]">Medical Treatment</Badge>}
                              {selectedIncident.injuryRecord.lostTime && <Badge variant="destructive" className="text-[10px]">Lost Time ({selectedIncident.injuryRecord.daysLost}d)</Badge>}
                              {selectedIncident.injuryRecord.restrictedDuty && <Badge variant="outline" className="text-[10px]">Restricted Duty</Badge>}
                            </div>
                            {selectedIncident.injuryRecord.daysLost > 0 && (
                              <div className="sim-days-lost">
                                <span className="text-2xl font-bold text-red-600">{selectedIncident.injuryRecord.daysLost}</span>
                                <span className="text-xs text-muted-foreground">days lost</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground text-xs">No injury record — Near Miss or Property Only</div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Witnesses */}
                    <Card className="sim-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" /> Witnesses ({selectedIncident.witnesses.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedIncident.witnesses.length > 0 ? (
                          <div className="space-y-2">
                            {selectedIncident.witnesses.map((w, i) => (
                              <div key={i} className="sim-witness-item">
                                <div className="flex items-center gap-2">
                                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-xs font-medium">{w.name}</span>
                                  <Badge variant="outline" className="text-[10px]">{w.role}</Badge>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-1 ml-5.5">{w.statement}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-muted-foreground text-xs">No witnesses recorded</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== TAB 3: Corrective Actions ===== */}
        {activeTab === 3 && (
          <div className="space-y-4">
            {/* CA Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="sim-ca-kpi">
                <div className="text-2xl font-bold text-blue-600">{incidents.reduce((s, i) => s + i.correctiveActions.length, 0)}</div>
                <div className="text-xs text-muted-foreground">Total Actions</div>
              </div>
              <div className="sim-ca-kpi">
                <div className="text-2xl font-bold text-amber-600">{incidents.reduce((s, i) => s + i.correctiveActions.filter(c => c.status === "pending").length, 0)}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="sim-ca-kpi">
                <div className="text-2xl font-bold text-indigo-600">{incidents.reduce((s, i) => s + i.correctiveActions.filter(c => c.status === "in_progress").length, 0)}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="sim-ca-kpi">
                <div className="text-2xl font-bold text-emerald-600">{incidents.reduce((s, i) => s + i.correctiveActions.filter(c => c.status === "completed").length, 0)}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>

            {/* CA Status Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" /> Actions by Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { status: "Pending", count: incidents.reduce((s, i) => s + i.correctiveActions.filter(c => c.status === "pending").length, 0), fill: "#f59e0b" },
                      { status: "In Progress", count: incidents.reduce((s, i) => s + i.correctiveActions.filter(c => c.status === "in_progress").length, 0), fill: "#6366f1" },
                      { status: "Completed", count: incidents.reduce((s, i) => s + i.correctiveActions.filter(c => c.status === "completed").length, 0), fill: "#22c55e" },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                        {[
                          <Cell key="0" fill="#f59e0b" />,
                          <Cell key="1" fill="#6366f1" />,
                          <Cell key="2" fill="#22c55e" />,
                        ]}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Overdue CA by Warehouse */}
              <Card className="col-span-2 sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" /> Corrective Actions Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { warehouse: "Mumbai", pending: 4, inProgress: 3, completed: 8 },
                      { warehouse: "Delhi NCR", pending: 3, inProgress: 2, completed: 7 },
                      { warehouse: "Chennai", pending: 2, inProgress: 4, completed: 6 },
                      { warehouse: "Kolkata", pending: 1, inProgress: 3, completed: 5 },
                      { warehouse: "Bangalore", pending: 3, inProgress: 1, completed: 9 },
                      { warehouse: "Hyderabad", pending: 2, inProgress: 2, completed: 4 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="pending" name="Pending" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="inProgress" name="In Progress" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="completed" name="Completed" fill="#22c55e" stackId="a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* All Corrective Actions Table */}
            <Card className="sim-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-emerald-500" /> All Corrective Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="sim-table">
                    <thead>
                      <tr>
                        <th>CA ID</th>
                        <th>Incident</th>
                        <th>Description</th>
                        <th>Assignee</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.flatMap(inc => inc.correctiveActions.map(ca => ({
                        ...ca, incidentNo: inc.incidentNo, incidentTitle: inc.title,
                      }))).slice(0, 25).map((ca, i) => (
                        <tr key={ca.id} className="sim-table-row">
                          <td className="font-mono text-xs">{ca.id}</td>
                          <td className="text-xs font-mono">{ca.incidentNo}</td>
                          <td className="text-xs max-w-[250px] truncate">{ca.description}</td>
                          <td className="text-xs">{ca.assignee}</td>
                          <td className="text-xs text-muted-foreground">{ca.dueDate}</td>
                          <td><SeverityBadge severity={ca.priority} /></td>
                          <td>
                            <Badge variant={ca.status === "completed" ? "success" : ca.status === "in_progress" ? "secondary" : "warning"} className="text-[10px]">
                              {ca.status === "completed" ? "Completed" : ca.status === "in_progress" ? "In Progress" : "Pending"}
                            </Badge>
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

        {/* ===== TAB 4: Compliance & OSHA ===== */}
        {activeTab === 4 && (
          <div className="space-y-4">
            {/* OSHA Compliance KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="sim-osha-kpi">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <div className="text-2xl font-bold">{kpis.oshaRecordable}</div>
                <div className="text-xs text-muted-foreground">OSHA Recordable</div>
              </div>
              <div className="sim-osha-kpi">
                <Activity className="h-5 w-5 text-blue-500" />
                <div className="text-2xl font-bold">{kpis.trir}</div>
                <div className="text-xs text-muted-foreground">TRIR</div>
              </div>
              <div className="sim-osha-kpi">
                <Clock className="h-5 w-5 text-amber-500" />
                <div className="text-2xl font-bold">1.8</div>
                <div className="text-xs text-muted-foreground">DART Rate</div>
              </div>
              <div className="sim-osha-kpi">
                <Target className="h-5 w-5 text-purple-500" />
                <div className="text-2xl font-bold">{kpis.totalCost > 0 ? Math.round(kpis.totalCost / Math.max(kpis.oshaRecordable, 1) / 1000) : 0}K</div>
                <div className="text-xs text-muted-foreground">Cost per Recordable (₹)</div>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" /> Regulatory Compliance Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { item: "OSHA 300 Log Maintained", status: "compliant", note: "Updated weekly" },
                    { item: "OSHA 300A Annual Summary", status: "compliant", note: "Posted Feb 1" },
                    { item: "Emergency Action Plan", status: "compliant", note: "Last reviewed: Jan 2026" },
                    { item: "Hazard Communication Program", status: "compliant", note: "GHS labels verified" },
                    { item: "Lockout/Tagout Procedures", status: "expiring", note: "Due review: Aug 2026" },
                    { item: "Confined Space Entry Program", status: "compliant", note: "Permits current" },
                    { item: "PPE Hazard Assessment", status: "compliant", note: "Annual complete" },
                    { item: "Fire Prevention Plan", status: "compliant", note: "Drill scheduled Q3" },
                    { item: "Bloodborne Pathogen Program", status: "missing", note: "First aid kits need update" },
                    { item: "Respiratory Protection Program", status: "compliant", note: "Fit tests current" },
                    { item: "Machine Guarding Compliance", status: "expiring", note: "Audit due Sep 2026" },
                    { item: "Electrical Safety Program", status: "compliant", note: "NFPA 70E compliant" },
                  ].map((item, i) => (
                    <div key={i} className="sim-compliance-item">
                      <div className="flex items-center gap-2">
                        {item.status === "compliant" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                         item.status === "expiring" ? <AlertTriangle className="h-4 w-4 text-amber-500" /> :
                         <XCircle className="h-4 w-4 text-red-500" />}
                        <span className="text-xs font-medium flex-1">{item.item}</span>
                        <Badge variant={item.status === "compliant" ? "success" : item.status === "expiring" ? "warning" : "destructive"} className="text-[10px]">
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground ml-6">{item.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Safety Training Matrix */}
              <Card className="sim-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-orange-500" /> Training Compliance by Module
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={[
                      { module: "Fire Safety", completed: 92, pending: 5, overdue: 3 },
                      { module: "LOTO", completed: 88, pending: 8, overdue: 4 },
                      { module: "Hazard Comm", completed: 95, pending: 3, overdue: 2 },
                      { module: "PPE Usage", completed: 85, pending: 10, overdue: 5 },
                      { module: "Ergonomics", completed: 78, pending: 15, overdue: 7 },
                      { module: "Forklift Safety", completed: 90, pending: 7, overdue: 3 },
                      { module: "Emergency Resp", completed: 96, pending: 2, overdue: 2 },
                      { module: "Electrical Safety", completed: 82, pending: 12, overdue: 6 },
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="module" tick={{ fontSize: 10 }} width={95} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="overdue" name="Overdue" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="pending" name="Pending" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="completed" name="Completed" fill="#22c55e" stackId="a" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Injury Cost Trend */}
            <Card className="sim-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-green-500" /> Injury Cost Trend by Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={monthlyTrend.map(m => ({
                    ...m,
                    estimatedCost: Math.round(m.incidents * 15000 + m.critical * 50000),
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="estimatedCost" name="Est. Cost (₹)" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IndianRupee({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12" /><path d="M6 8h12" /><path d="M6 21l6-4 6 4" /><path d="M12 13c-4 0-6 2-6 4" />
    </svg>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LineChartIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>;
}

function PieChartIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>;
}
