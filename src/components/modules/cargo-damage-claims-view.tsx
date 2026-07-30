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
  Zap, Info, TriangleAlert, Package, PackageX, PackageCheck,
  Droplets, Flame, ThermometerSun, Snowflake, Truck, IndianRupee,
  Scale, Gavel, FileCheck, FileWarning, RefreshCw, BarChart3,
  ClipboardCheck, Camera, Ban, Handshake, Stamp, BadgeDollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
type DamageType = "crushed" | "wet_damage" | "contamination" | "theft" | "fire_damage" | "temperature" | "mishandling" | "dropped" | "pierced" | "missing_items" | "label_damage" | "pest_infestation";
type ClaimStatus = "reported" | "investigating" | "evidence_gathering" | "submitted_insurer" | "under_review" | "approved" | "partially_approved" | "rejected" | "settled" | "closed";
type ClaimSeverity = "critical" | "major" | "moderate" | "minor";
type ClaimCategory = "inbound" | "outbound" | "storage" | "transit" | "returns";
type InvestigationStatus = "not_started" | "witness_interview" | "cctv_review" | "site_inspection" | "root_cause_found" | "report_filed";

const DAMAGE_LABELS: Record<DamageType, string> = {
  crushed: "Crushed/Compressed",
  wet_damage: "Water/Moisture Damage",
  contamination: "Chemical Contamination",
  theft: "Theft/Pilferage",
  fire_damage: "Fire/Heat Damage",
  temperature: "Temperature Abuse",
  mishandling: "Mishandling",
  dropped: "Dropped Impact",
  pierced: "Pierced/Punctured",
  missing_items: "Missing Items",
  label_damage: "Label/Documentation",
  pest_infestation: "Pest Infestation",
};

const DAMAGE_ICONS: Partial<Record<DamageType, React.ReactNode>> = {
  crushed: <PackageX className="h-3.5 w-3.5" />,
  wet_damage: <Droplets className="h-3.5 w-3.5" />,
  contamination: <Droplets className="h-3.5 w-3.5" />,
  theft: <Ban className="h-3.5 w-3.5" />,
  fire_damage: <Flame className="h-3.5 w-3.5" />,
  temperature: <ThermometerSun className="h-3.5 w-3.5" />,
  mishandling: <Handshake className="h-3.5 w-3.5" />,
  dropped: <PackageX className="h-3.5 w-3.5" />,
  pierced: <PackageX className="h-3.5 w-3.5" />,
  missing_items: <AlertTriangle className="h-3.5 w-3.5" />,
  label_damage: <FileWarning className="h-3.5 w-3.5" />,
  pest_infestation: <AlertTriangle className="h-3.5 w-3.5" />,
};

const STATUS_LABELS: Record<ClaimStatus, string> = {
  reported: "Reported",
  investigating: "Investigating",
  evidence_gathering: "Evidence Gathering",
  submitted_insurer: "Submitted to Insurer",
  under_review: "Under Review",
  approved: "Approved",
  partially_approved: "Partially Approved",
  rejected: "Rejected",
  settled: "Settled",
  closed: "Closed",
};

const SEVERITY_LABELS: Record<ClaimSeverity, string> = {
  critical: "Critical",
  major: "Major",
  moderate: "Moderate",
  minor: "Minor",
};

const CATEGORY_LABELS: Record<ClaimCategory, string> = {
  inbound: "Inbound",
  outbound: "Outbound",
  storage: "Storage",
  transit: "In Transit",
  returns: "Returns Processing",
};

interface PhotoEvidence { id: string; url: string; description: string; takenAt: string; takenBy: string; }
interface Investigation { status: InvestigationStatus; lead: string; startDate: string; findings: string; rootCause: string; preventiveActions: string[]; }
interface InsurerResponse { company: string; policyNo: string; claimRef: string; submittedDate: string; responseDate: string | null; approvedAmount: number | null; rejectionReason: string | null; }

interface CargoDamageClaim {
  id: string;
  claimNo: string;
  title: string;
  description: string;
  damageType: DamageType;
  severity: ClaimSeverity;
  status: ClaimStatus;
  category: ClaimCategory;
  warehouse: string;
  location: string;
  reportedBy: string;
  department: string;
  reportedAt: string;
  occurredAt: string;
  sku: string;
  productName: string;
  batchNo: string;
  quantityAffected: number;
  unitCost: number;
  totalClaimAmount: number;
  currency: string;
  photos: PhotoEvidence[];
  witnesses: { name: string; role: string; statement: string }[];
  investigation: Investigation;
  insurerResponse: InsurerResponse | null;
  liableParty: string;
  carrierName: string;
  shipmentRef: string;
  insuranceClaim: boolean;
  recoveryAmount: number;
  resolutionDays: number | null;
}

// ============================================================================
// Deterministic Mock Data Generator
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateClaimsData() {
  const rand = seededRandom(118118);

  const warehouses = ["Mumbai DC", "Delhi NCR Hub", "Chennai Distribution", "Kolkata Warehouse", "Bangalore South", "Hyderabad Central"];
  const locations = ["Dock A1", "Staging Zone D", "Cold Storage", "Racking Section E", "Packing Area C", "Receiving Bay", "Yard Area", "Loading Bay F1", "Returns Processing", "Mezzanine Level"];
  const departments = ["Warehousing", "Logistics", "Quality", "Returns", "Safety", "Administration"];
  const reporters = ["Rajesh K.", "Priya S.", "Amit P.", "Sunita D.", "Vikram S.", "Anjali G.", "Mohammed I.", "Deepa N.", "Suresh M.", "Kavita R.", "Arjun R.", "Lakshmi I.", "Rohit M.", "Sneha K.", "Manoj T."];
  const carriers = ["DHL Express", "BlueDart", "Delhivery", "DTDC", "FedEx India", "Gati Limited", "Allcargo Logistics", "TCI Express", "VRL Logistics", "SafeExpress"];
  const insurers = ["HDFC ERGO", "ICICI Lombard", "Bajaj Allianz", "New India Assurance", "IFFCO Tokio", "Tata AIG"];
  const products = ["Industrial Bearings (SKF 6205)", "Circuit Board Assembly", "Pharmaceutical Vials (500ml)", "Automotive Gaskets Set", "Cotton Bales (170kg)", "Steel Wire Rods (8mm)", "LED Panel Lights", "Food Grade Lubricant (5L)", "Textile Fabric Rolls", "Electrical Switchgear"];
  const skus = ["SKU-MECH-001", "SKU-ELEC-042", "SKU-PHAR-015", "SKU-AUTO-008", "SKU-TEXT-003", "SKU-STEL-022", "SKU-LIGH-007", "SKU-LUBE-011", "SKU-FABR-019", "SKU-SWIT-005"];

  const damageTypes: DamageType[] = ["crushed", "wet_damage", "contamination", "theft", "fire_damage", "temperature", "mishandling", "dropped", "pierced", "missing_items", "label_damage", "pest_infestation"];
  const severities: ClaimSeverity[] = ["minor", "minor", "minor", "moderate", "moderate", "moderate", "major", "major", "critical"];
  const statuses: ClaimStatus[] = ["reported", "investigating", "evidence_gathering", "submitted_insurer", "under_review", "approved", "partially_approved", "rejected", "settled", "closed", "closed", "closed"];
  const categories: ClaimCategory[] = ["inbound", "inbound", "outbound", "transit", "storage", "returns"];
  const invStatuses: InvestigationStatus[] = ["not_started", "witness_interview", "cctv_review", "site_inspection", "root_cause_found", "report_filed"];

  const titleTemplates: Record<DamageType, string[]> = {
    crushed: ["Pallet collapsed crushing inventory", "Heavy load shifted onto adjacent goods", "Racking failure caused product damage"],
    wet_damage: ["Water leak damaged stored goods", "Rain exposure during unloading", "Flooded storage area"],
    contamination: ["Chemical spill on adjacent products", "Cross-contamination in cold storage", "Dust/debris contamination during transit"],
    theft: ["Missing cartons from sealed shipment", "Pilferage during transit", "Shortage discovered at receiving"],
    fire_damage: ["Heat damage to temperature-sensitive goods", "Electrical fire in storage area", "Smoldering pallet damaged nearby stock"],
    temperature: ["Cold chain breach during transit", "Reefer unit failure", "Warehouse AC outage"],
    mishandling: ["Rough handling caused packaging damage", "Forklift prongs tore packaging", "Improper stacking led to collapse"],
    dropped: ["Package dropped from height during loading", "Forklift dropped pallet", "Manual handling accident"],
    pierced: ["Forklift pierced packaging", "Sharp object penetrated outer carton", "Strapping wire punctured goods"],
    missing_items: ["Contents missing from sealed carton", "Partial shipment received", "Items missing from returned goods"],
    label_damage: ["Barcode labels destroyed", "MRL documentation water damaged", "Shipping marks illegible"],
    pest_infestation: ["Rodent damage to packaging", "Insect contamination found", "Stored grain pest infestation"],
  };

  const claims: CargoDamageClaim[] = [];

  for (let i = 0; i < 55; i++) {
    const dType: DamageType = damageTypes[Math.floor(rand() * damageTypes.length)];
    const sev: ClaimSeverity = severities[Math.floor(rand() * severities.length)] as ClaimSeverity;
    const stat: ClaimStatus = statuses[Math.floor(rand() * statuses.length)] as ClaimStatus;
    const cat: ClaimCategory = categories[Math.floor(rand() * categories.length)] as ClaimCategory;
    const pi = Math.floor(rand() * products.length);
    const qty = Math.floor(rand() * 200) + 5;
    const unitCost = Math.floor(rand() * 5000) + 100;
    const titles = titleTemplates[dType];

    const hasInsurer = stat !== "reported" && stat !== "investigating" && rand() > 0.2;
    const insurer = hasInsurer ? insurers[Math.floor(rand() * insurers.length)] : null;
    const isClosed = ["settled", "closed", "rejected"].includes(stat);
    const approvedAmt = hasInsurer && isClosed ? Math.round(qty * unitCost * (rand() * 0.6 + 0.3)) : null;
    const recovery = isClosed ? Math.round((approvedAmt || 0) * (rand() * 0.2)) : 0;

    const invStatus: InvestigationStatus = ["reported", "investigating"].includes(stat) ? "not_started" :
      stat === "evidence_gathering" ? "cctv_review" :
      isClosed ? "report_filed" : invStatuses[Math.floor(rand() * invStatuses.length)] as InvestigationStatus;

    const inv: Investigation = {
      status: invStatus,
      lead: reporters[Math.floor(rand() * reporters.length)],
      startDate: `2026-${String(Math.floor(rand() * 6) + 1).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      findings: invStatus === "root_cause_found" || isClosed ? "Root cause identified through CCTV review and witness statements." : "Investigation ongoing.",
      rootCause: isClosed ? ["Forklift operator error", "Improper packaging by supplier", "Waterproofing failure", "Temperature monitoring gap", "Security protocol breach", "Handling procedure deviation"][Math.floor(rand() * 6)] : "Pending investigation.",
      preventiveActions: isClosed ? ["Updated handling SOP", "Installed additional CCTV", "Reinforced packaging requirements", "Temperature monitoring added", "Security checkpoint added", "Staff retraining completed"].filter(() => rand() > 0.5).slice(0, 2) : [],
    };

    const month = Math.floor(rand() * 12) + 1;
    const day = Math.floor(rand() * 28) + 1;
    const occDate = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const nw = Math.floor(rand() * 3);
    const witnesses: { name: string; role: string; statement: string }[] = [];
    for (let w = 0; w < nw; w++) {
      witnesses.push({ name: reporters[Math.floor(rand() * reporters.length)], role: departments[Math.floor(rand() * departments.length)], statement: `Observed ${titles[0].toLowerCase().slice(0, 40)} at ${locations[Math.floor(rand() * locations.length)]}.` });
    }

    claims.push({
      id: `CLM-${String(i + 1).padStart(4, "0")}`,
      claimNo: `CLM-2026-${String(i + 1).padStart(4, "0")}`,
      title: titles[Math.floor(rand() * titles.length)],
      description: `${titles[0]}. Affected ${qty} units of ${products[pi]} (${skus[pi]}). Immediate area secured and investigation team notified.`,
      damageType: dType,
      severity: sev,
      status: stat,
      category: cat,
      warehouse: warehouses[Math.floor(rand() * warehouses.length)],
      location: locations[Math.floor(rand() * locations.length)],
      reportedBy: reporters[Math.floor(rand() * reporters.length)],
      department: departments[Math.floor(rand() * departments.length)],
      reportedAt: occDate,
      occurredAt: occDate,
      sku: skus[pi],
      productName: products[pi],
      batchNo: `BATCH-${String(2026000 + Math.floor(rand() * 999)).padStart(7, "0")}`,
      quantityAffected: qty,
      unitCost,
      totalClaimAmount: qty * unitCost,
      currency: "INR",
      photos: Array.from({ length: Math.floor(rand() * 5) + 1 }, (_, idx) => ({
        id: `PH-${String(i + 1)}-${idx + 1}`,
        url: `/evidence/claim-${i + 1}-photo-${idx + 1}.jpg`,
        description: `Evidence photo ${idx + 1} — damage documentation`,
        takenAt: occDate,
        takenBy: reporters[Math.floor(rand() * reporters.length)],
      })),
      witnesses,
      investigation: inv,
      insurerResponse: insurer ? {
        company: insurer,
        policyNo: `POL-${String(Math.floor(rand() * 9000000) + 1000000)}`,
        claimRef: `INS-${String(Math.floor(rand() * 90000) + 10000)}`,
        submittedDate: occDate,
        responseDate: isClosed ? `2026-${String(Math.min(month + 1, 12)).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}` : null,
        approvedAmount: approvedAmt,
        rejectionReason: stat === "rejected" ? "Insufficient documentation" : null,
      } : null,
      liableParty: rand() > 0.5 ? carriers[Math.floor(rand() * carriers.length)] : "Own Warehouse Operations",
      carrierName: carriers[Math.floor(rand() * carriers.length)],
      shipmentRef: `SHP-2026-${String(Math.floor(rand() * 9000) + 1000)}`,
      insuranceClaim: hasInsurer,
      recoveryAmount: recovery,
      resolutionDays: isClosed ? Math.floor(rand() * 30) + 5 : null,
    });
  }

  return claims.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}

// ============================================================================
// Helper Components
// ============================================================================
function SeverityBadge({ severity }: { severity: ClaimSeverity }) {
  const map: Record<ClaimSeverity, "destructive" | "warning" | "default" | "secondary"> = {
    critical: "destructive", major: "warning", moderate: "default", minor: "secondary",
  };
  return <Badge variant={map[severity]} className="badge-interactive text-[10px] font-bold uppercase tracking-wider">{SEVERITY_LABELS[severity]}</Badge>;
}

function StatusBadge({ status }: { status: ClaimStatus }) {
  const map: Record<ClaimStatus, "destructive" | "warning" | "default" | "secondary" | "outline" | "success"> = {
    reported: "destructive", investigating: "warning", evidence_gathering: "default",
    submitted_insurer: "secondary", under_review: "secondary", approved: "success",
    partially_approved: "warning", rejected: "destructive", settled: "success", closed: "outline",
  };
  return <Badge variant={map[status]} className="badge-interactive text-[10px]">{STATUS_LABELS[status]}</Badge>;
}

function FormatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#22c55e", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1", "#84cc16", "#e11d48"];

// ============================================================================
// Main Component
// ============================================================================
export function CargoDamageClaimsView() {
  const claims = useMemo(() => generateClaimsData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [selectedClaim, setSelectedClaim] = useState<CargoDamageClaim | null>(null);

  // KPIs
  const kpis = useMemo(() => {
    const total = claims.length;
    const open = claims.filter(c => !["settled", "closed", "rejected"].includes(c.status)).length;
    const critical = claims.filter(c => c.severity === "critical").length;
    const totalClaimed = claims.reduce((s, c) => s + c.totalClaimAmount, 0);
    const totalRecovered = claims.reduce((s, c) => s + c.recoveryAmount, 0);
    const insured = claims.filter(c => c.insuranceClaim).length;
    const settled = claims.filter(c => c.status === "settled" || c.status === "closed").length;
    const rejectionRate = claims.filter(c => c.status === "rejected").length;
    return { total, open, critical, totalClaimed, totalRecovered, insured, settled, rejectionRate };
  }, [claims]);

  // Monthly trend
  const monthlyTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, mi) => {
      const mc = claims.filter(c => { const d = new Date(c.occurredAt); return d.getMonth() === mi; });
      return {
        month: m,
        claims: mc.length,
        amount: mc.reduce((s, c) => s + c.totalClaimAmount, 0),
        critical: mc.filter(c => c.severity === "critical").length,
        recovered: mc.reduce((s, c) => s + c.recoveryAmount, 0),
      };
    });
  }, [claims]);

  // Damage type distribution
  const damageDist = useMemo(() => {
    const counts: Record<string, number> = {};
    claims.forEach(c => { counts[c.damageType] = (counts[c.damageType] || 0) + 1; });
    return Object.entries(counts).map(([t, count]) => ({
      name: DAMAGE_LABELS[t as DamageType] || t,
      value: count,
      color: COLORS[Object.keys(DAMAGE_LABELS).indexOf(t) % COLORS.length],
    })).sort((a, b) => b.value - a.value);
  }, [claims]);

  // Category distribution
  const catDist = useMemo(() => {
    return (Object.entries(CATEGORY_LABELS) as [ClaimCategory, string][]).map(([k, label]) => ({
      category: label,
      count: claims.filter(c => c.category === k).length,
      amount: claims.filter(c => c.category === k).reduce((s, c) => s + c.totalClaimAmount, 0),
    }));
  }, [claims]);

  // Top liable parties
  const liableParties = useMemo(() => {
    const lp: Record<string, number> = {};
    claims.forEach(c => { lp[c.liableParty] = (lp[c.liableParty] || 0) + 1; });
    return Object.entries(lp).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
  }, [claims]);

  // Filtered claims
  const filtered = useMemo(() => {
    return claims.filter(c => {
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && !c.claimNo.toLowerCase().includes(searchQuery.toLowerCase()) && !c.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterSeverity !== "all" && c.severity !== filterSeverity) return false;
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterCategory !== "all" && c.category !== filterCategory) return false;
      if (filterWarehouse !== "all" && c.warehouse !== filterWarehouse) return false;
      return true;
    });
  }, [claims, searchQuery, filterSeverity, filterStatus, filterCategory, filterWarehouse]);

  const tabLabels = ["Claims Overview", "Claims Register", "Claim Inspector", "Insurance & Recovery", "Liability Analysis"];

  return (
    <div className="cdc-container">
      {/* Animated Gradient Header */}
      <div className="cdc-header">
        <div className="cdc-header-content">
          <div className="flex items-center gap-3">
            <div className="cdc-header-icon">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Cargo Damage Claims</h1>
              <p className="text-white/70 text-sm">Damage Reporting, Investigation, Insurance Claims & Recovery Tracking</p>
            </div>
          </div>
          <div className="cdc-header-badges">
            <div className="cdc-header-badge bg-red-500/20 border-red-400/30">
              <AlertTriangle className="h-3.5 w-3.5 text-red-300" />
              <span className="text-red-200 text-sm font-medium">{kpis.open} Open</span>
            </div>
            <div className="cdc-header-badge bg-emerald-500/20 border-emerald-400/30">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-emerald-200 text-sm font-medium">{FormatINR(kpis.totalRecovered)} Recovered</span>
            </div>
            <div className="cdc-header-badge bg-amber-500/20 border-amber-400/30">
              <IndianRupee className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-amber-200 text-sm font-medium">{FormatINR(kpis.totalClaimed)} Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="cdc-tabs">
        {tabLabels.map((label, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)} className={`cdc-tab ${activeTab === idx ? "active" : ""}`}>{label}</button>
        ))}
      </div>

      <div className="cdc-content">
        {/* ===== TAB 0: Claims Overview ===== */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Claims", value: kpis.total, icon: <PackageX className="h-5 w-5" />, cls: "cdc-kpi-red" },
                { label: "Open Claims", value: kpis.open, icon: <Clock className="h-5 w-5" />, cls: "cdc-kpi-amber" },
                { label: "Critical", value: kpis.critical, icon: <AlertTriangle className="h-5 w-5" />, cls: "cdc-kpi-rose" },
                { label: "Total Claimed", value: FormatINR(kpis.totalClaimed), icon: <IndianRupee className="h-5 w-5" />, cls: "cdc-kpi-purple" },
              ].map((kpi, i) => (
                <div key={i} className={`cdc-kpi-card ${kpi.cls}`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="text-white/80">{kpi.icon}</div>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                  <div className="text-white/70 text-xs">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Financial Recovery Bar */}
            <div className="cdc-recovery-bar">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">Financial Recovery Rate</span>
                <span className="text-xs font-mono font-bold">{kpis.totalClaimed > 0 ? Math.round(kpis.totalRecovered / kpis.totalClaimed * 100) : 0}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000" style={{ width: `${kpis.totalClaimed > 0 ? Math.min(kpis.totalRecovered / kpis.totalClaimed * 100, 100) : 0}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                <span>Recovered: {FormatINR(kpis.totalRecovered)}</span>
                <span>Total Claimed: {FormatINR(kpis.totalClaimed)}</span>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="cdc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-rose-500" /> By Damage Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={damageDist} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={2} label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {damageDist.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-2 cdc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-purple-500" /> Monthly Claims Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="claims" name="Claims" fill="#ef4444" radius={[2, 2, 0, 0]} />
                      <Line type="monotone" dataKey="recovered" name="Recovered (₹)" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="cdc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" /> Claims by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={catDist}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="count" name="Claims" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="cdc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-amber-500" /> Top Liable Parties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={liableParties} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={120} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="count" name="Claims" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Claim Status Pipeline */}
            <Card className="cdc-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-indigo-500" /> Claims Status Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {(["reported", "investigating", "evidence_gathering", "submitted_insurer", "under_review", "approved", "partially_approved", "rejected", "settled", "closed"] as ClaimStatus[]).map(s => {
                    const count = claims.filter(c => c.status === s).length;
                    if (count === 0) return null;
                    const colors: Record<string, string> = {
                      reported: "#ef4444", investigating: "#f59e0b", evidence_gathering: "#3b82f6",
                      submitted_insurer: "#6366f1", under_review: "#8b5cf6", approved: "#22c55e",
                      partially_approved: "#f59e0b", rejected: "#ef4444", settled: "#22c55e", closed: "#94a3b8",
                    };
                    return (
                      <div key={s} className="flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-lg min-w-[80px]" style={{ backgroundColor: `${colors[s]}15`, border: `1px solid ${colors[s]}30` }}>
                        <span className="text-lg font-bold" style={{ color: colors[s] }}>{count}</span>
                        <span className="text-[10px] text-center text-muted-foreground leading-tight">{STATUS_LABELS[s]}</span>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===== TAB 1: Claims Register ===== */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="cdc-filter-bar">
              <div className="cdc-search-box">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search claims..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="cdc-search-input" />
              </div>
              <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="cdc-filter-select">
                <option value="all">All Severity</option>
                {Object.entries(SEVERITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="cdc-filter-select">
                <option value="all">All Status</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="cdc-filter-select">
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)} className="cdc-filter-select">
                <option value="all">All Warehouses</option>
                {["Mumbai DC", "Delhi NCR Hub", "Chennai Distribution", "Kolkata Warehouse", "Bangalore South", "Hyderabad Central"].map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <span className="text-xs text-muted-foreground">{filtered.length} claims</span>
            </div>

            <div className="overflow-x-auto">
              <table className="cdc-table">
                <thead>
                  <tr>
                    <th>Claim #</th>
                    <th>Title</th>
                    <th>Damage Type</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Warehouse</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 30).map(cl => (
                    <tr key={cl.id} className="cdc-table-row" onClick={() => { setSelectedClaim(cl); setActiveTab(2); }}>
                      <td className="font-mono text-xs">{cl.claimNo}</td>
                      <td className="text-xs font-medium max-w-[180px] truncate">{cl.title}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          {DAMAGE_ICONS[cl.damageType]}
                          <span className="text-xs truncate max-w-[80px]">{DAMAGE_LABELS[cl.damageType].split("/")[0]}</span>
                        </div>
                      </td>
                      <td><SeverityBadge severity={cl.severity} /></td>
                      <td><StatusBadge status={cl.status} /></td>
                      <td className="text-xs font-mono">{FormatINR(cl.totalClaimAmount)}</td>
                      <td className="text-xs">{cl.warehouse.split(" ")[0]}</td>
                      <td className="text-xs text-muted-foreground">{cl.occurredAt}</td>
                      <td>
                        <button className="cdc-view-btn" onClick={e => { e.stopPropagation(); setSelectedClaim(cl); setActiveTab(2); }}>
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

        {/* ===== TAB 2: Claim Inspector ===== */}
        {activeTab === 2 && (
          <div className="space-y-4">
            {!selectedClaim ? (
              <div className="cdc-empty-state">
                <ShieldAlert className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">Select a claim from the register to inspect details</p>
                <button onClick={() => setActiveTab(1)} className="cdc-nav-btn">
                  <ChevronRight className="h-4 w-4" /> Go to Claims Register
                </button>
              </div>
            ) : (
              <>
                <div className="cdc-detail-header">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-sm text-white/70">{selectedClaim.claimNo}</span>
                        <SeverityBadge severity={selectedClaim.severity} />
                        <StatusBadge status={selectedClaim.status} />
                        {selectedClaim.insuranceClaim && <Badge variant="secondary" className="badge-interactive text-[10px]">Insured</Badge>}
                      </div>
                      <h2 className="text-lg font-bold text-white">{selectedClaim.title}</h2>
                      <p className="text-white/60 text-xs mt-1">{selectedClaim.description}</p>
                    </div>
                  </div>
                  <div className="cdc-detail-meta">
                    <div><Building2 className="h-3.5 w-3.5" /><span>{selectedClaim.warehouse} — {selectedClaim.location}</span></div>
                    <div><Package className="h-3.5 w-3.5" /><span>{selectedClaim.productName} ({selectedClaim.sku})</span></div>
                    <div><User className="h-3.5 w-3.5" /><span>{selectedClaim.reportedBy} — {selectedClaim.department}</span></div>
                    <div><Calendar className="h-3.5 w-3.5" /><span>{selectedClaim.occurredAt}</span></div>
                    <div><IndianRupee className="h-3.5 w-3.5" /><span>{FormatINR(selectedClaim.totalClaimAmount)} ({selectedClaim.quantityAffected} units × {FormatINR(selectedClaim.unitCost)})</span></div>
                    <div><Truck className="h-3.5 w-3.5" /><span>{selectedClaim.carrierName} — {selectedClaim.shipmentRef}</span></div>
                    <div><Gavel className="h-3.5 w-3.5" /><span>Liable: {selectedClaim.liableParty}</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Investigation */}
                  <Card className="cdc-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-blue-500" /> Investigation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="glass-subtle space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <Badge variant={selectedClaim.investigation.status === "report_filed" ? "success" : selectedClaim.investigation.status === "not_started" ? "destructive" : "warning"} className="badge-interactive text-[10px]">
                          {selectedClaim.investigation.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Lead Investigator</span>
                        <span className="text-xs font-medium">{selectedClaim.investigation.lead}</span>
                      </div>
                      {selectedClaim.investigation.rootCause !== "Pending investigation." && (
                        <>
                          <div className="cdc-rca-box">
                            <div className="text-xs font-semibold text-red-600 mb-1">Root Cause</div>
                            <p className="text-xs">{selectedClaim.investigation.rootCause}</p>
                          </div>
                          {selectedClaim.investigation.preventiveActions.length > 0 && (
                            <div>
                              <div className="text-xs font-semibold text-emerald-600 mb-1">Preventive Actions</div>
                              {selectedClaim.investigation.preventiveActions.map((a, i) => (
                                <div key={i} className="cdc-action-item">{a}</div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Camera className="h-3.5 w-3.5" />
                        <span>{selectedClaim.photos.length} photos attached</span>
                        <span>·</span>
                        <span>{selectedClaim.witnesses.length} witnesses</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Insurance Response */}
                  <Card className="cdc-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-purple-500" /> Insurance & Recovery
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="glass-subtle space-y-3">
                      {selectedClaim.insurerResponse ? (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="cdc-field"><span className="text-[10px] text-muted-foreground">Insurer</span><span className="text-xs font-medium">{selectedClaim.insurerResponse.company}</span></div>
                            <div className="cdc-field"><span className="text-[10px] text-muted-foreground">Policy No.</span><span className="text-xs font-mono">{selectedClaim.insurerResponse.policyNo}</span></div>
                            <div className="cdc-field"><span className="text-[10px] text-muted-foreground">Claim Ref</span><span className="text-xs font-mono">{selectedClaim.insurerResponse.claimRef}</span></div>
                            <div className="cdc-field"><span className="text-[10px] text-muted-foreground">Submitted</span><span className="text-xs">{selectedClaim.insurerResponse.submittedDate}</span></div>
                          </div>
                          {selectedClaim.insurerResponse.approvedAmount !== null && (
                            <div className="cdc-amount-box">
                              <span className="text-[10px] text-muted-foreground">Approved Amount</span>
                              <span className="text-xl font-bold text-emerald-600">{FormatINR(selectedClaim.insurerResponse.approvedAmount)}</span>
                              <span className="text-[10px] text-muted-foreground">of {FormatINR(selectedClaim.totalClaimAmount)} claimed</span>
                            </div>
                          )}
                          {selectedClaim.insurerResponse.rejectionReason && (
                            <div className="cdc-rejection-box">
                              <span className="text-xs font-semibold text-red-600">Rejection Reason</span>
                              <p className="text-xs">{selectedClaim.insurerResponse.rejectionReason}</p>
                            </div>
                          )}
                          {selectedClaim.recoveryAmount > 0 && (
                            <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                              <span className="text-xs text-muted-foreground">Recovery Amount</span>
                              <span className="text-sm font-bold text-emerald-600">{FormatINR(selectedClaim.recoveryAmount)}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <Stamp className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">No insurance claim filed for this damage</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== TAB 3: Insurance & Recovery ===== */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Insurance Claims Filed", value: kpis.insured, color: "text-blue-600" },
                { label: "Settled/Approved", value: kpis.settled, color: "text-emerald-600" },
                { label: "Rejected", value: kpis.rejectionRate, color: "text-red-600" },
                { label: "Recovery Rate", value: `${kpis.totalClaimed > 0 ? Math.round(kpis.totalRecovered / kpis.totalClaimed * 100) : 0}%`, color: "text-purple-600" },
              ].map((k, i) => (
                <div key={i} className="cdc-ins-kpi" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="cdc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-green-500" /> Monthly Recovery Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="amount" name="Claimed" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                      <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="cdc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Scale className="h-4 w-4 text-indigo-500" /> Claims by Severity vs Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={(["reported", "investigating", "evidence_gathering", "submitted_insurer", "under_review", "approved", "rejected", "settled", "closed"] as ClaimStatus[]).map(s => ({
                      status: STATUS_LABELS[s],
                      critical: claims.filter(c => c.status === s && c.severity === "critical").length,
                      major: claims.filter(c => c.status === s && c.severity === "major").length,
                      moderate: claims.filter(c => c.status === s && c.severity === "moderate").length,
                      minor: claims.filter(c => c.status === s && c.severity === "minor").length,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="status" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="major" name="Major" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="moderate" name="Moderate" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="minor" name="Minor" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===== TAB 4: Liability Analysis ===== */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="cdc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-amber-500" /> Liability by Party (Claim Count + Amount)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={liableParties.map(lp => ({
                      ...lp,
                      amount: claims.filter(c => c.liableParty === lp.name).reduce((s, c) => s + c.totalClaimAmount, 0),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="count" name="Claims" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="cdc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" /> Damage Type — Claimed Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(DAMAGE_LABELS).map(([k, label]) => ({
                      type: label.split("/")[0],
                      amount: claims.filter(c => c.damageType === k).reduce((s, c) => s + c.totalClaimAmount, 0),
                    })).sort((a, b) => b.amount - a.amount).slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="amount" name="Amount (₹)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Warehouse Damage Comparison */}
            <Card className="cdc-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-cyan-500" /> Claims & Cost by Warehouse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={["Mumbai DC", "Delhi NCR Hub", "Chennai Distribution", "Kolkata Warehouse", "Bangalore South", "Hyderabad Central"].map(wh => ({
                    warehouse: wh.split(" ")[0] + (wh.split(" ")[1] ? "\n" + wh.split(" ")[1] : ""),
                    claims: claims.filter(c => c.warehouse === wh).length,
                    amount: claims.filter(c => c.warehouse === wh).reduce((s, c) => s + c.totalClaimAmount, 0),
                  }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="warehouse" tick={{ fontSize: 9 }} width={85} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="claims" name="Claims" fill="#ef4444" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function PieChartIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>;
}
