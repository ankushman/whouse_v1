"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ShieldPlus, ArrowUpRight, ArrowDownRight,
  CheckCircle2, XCircle, AlertTriangle, Clock,
  BarChart3, Eye, Search, IndianRupee, Calendar,
  TrendingDown, FileText, Users, RefreshCw,
  Truck, Package, Banknote, Scale,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
interface InsuranceClaim {
  id: string;
  policyNumber: string;
  claimNumber: string;
  customer: string;
  city: string;
  phone: string;
  insuranceType: "cargo_transit" | "warehouse_liability" | "employee_compensation" | "property" | "vehicle_fleet" | "general_liability";
  insurer: string;
  claimAmount: number;
  approvedAmount: number;
  deductible: number;
  status: "draft" | "submitted" | "under_review" | "investigation" | "approved" | "partially_approved" | "rejected" | "settled" | "closed";
  incidentDate: string;
  filedDate: string;
  settlementDate?: string;
  description: string;
  category: string;
  assignedAdjuster?: string;
  priority: "low" | "medium" | "high" | "critical";
  documents: number;
  assessmentNotes?: string;
}

// ============================================================================
// Seeded Data
// ============================================================================
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateData() {
  const rand = seededRandom(158158);

  const cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur", "Lucknow", "Ahmedabad"];
  const customers = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sunita Devi", "Rajesh Gupta", "Neha Singh", "Vikram Joshi", "Kavita Reddy", "Manish Agarwal", "Deepa Nair", "Suresh Menon", "Anita Desai", "Prakash Iyer", "Ritu Malhotra", "Arjun Verma"];
  const insurers = ["ICICI Lombard", "Bajaj Allianz", "HDFC ERGO", "New India Assurance", "National Insurance", "IFFCO Tokio", "SBI General", "Reliance General", "Royal Sundaram", "Cholamandalam MS"];
  const categories = ["Fire Damage", "Water Damage", "Theft & Burglary", "Transit Damage", "Natural Calamity", "Equipment Breakdown", "Vehicle Accident", "Employee Injury", "Third Party Liability", "Stock Damage"];
  const adjusters = ["Anand Krishnan", "Bharathi Raman", "Chandra Sekhar", "Divya Nair", "Eswar Rao", "Farhan Ali", "Geeta Sharma", "Harish Patel"];
  const descriptions = [
    "Fire broke out in warehouse section B-3 due to electrical short circuit",
    "Flood water entered ground floor during heavy monsoon, damaged 200 cartons",
    "Cargo container found with broken seal and missing items during transit",
    "Forklift collision caused racking collapse and product damage",
    "Lightning strike caused power surge damaging HVAC systems",
    "Truck overturned on NH-48 near Vadodara, cargo extensively damaged",
    "Employee slipped on wet floor in dispatch area, suffered fracture",
    "Cyclone damage to warehouse roof and stored inventory",
    "Theft reported from bonded warehouse with forced entry marks",
    "Chemical spill caused damage to adjacent goods and floor surface",
  ];

  const insuranceTypes: Array<InsuranceClaim["insuranceType"]> = ["cargo_transit", "warehouse_liability", "employee_compensation", "property", "vehicle_fleet", "general_liability"];
  const statusWeights: Array<{ status: InsuranceClaim["status"]; w: number }> = [
    { status: "draft", w: 0.04 }, { status: "submitted", w: 0.06 },
    { status: "under_review", w: 0.10 }, { status: "investigation", w: 0.08 },
    { status: "approved", w: 0.14 }, { status: "partially_approved", w: 0.10 },
    { status: "rejected", w: 0.06 }, { status: "settled", w: 0.25 },
    { status: "closed", w: 0.17 },
  ];
  const priorityWeights: Array<{ priority: InsuranceClaim["priority"]; w: number }> = [
    { priority: "low", w: 0.20 }, { priority: "medium", w: 0.35 },
    { priority: "high", w: 0.30 }, { priority: "critical", w: 0.15 },
  ];

  function pickStatus(): InsuranceClaim["status"] {
    const r = rand(); let cum = 0;
    for (const s of statusWeights) { cum += s.w; if (r < cum) return s.status; }
    return "settled";
  }
  function pickPriority(): InsuranceClaim["priority"] {
    const r = rand(); let cum = 0;
    for (const p of priorityWeights) { cum += p.w; if (r < cum) return p.priority; }
    return "medium";
  }

  const claims: InsuranceClaim[] = [];
  for (let i = 0; i < 300; i++) {
    const status = pickStatus();
    const isSettled = ["settled", "closed", "rejected"].includes(status);
    const hasApproval = ["approved", "partially_approved", "settled"].includes(status);
    const m = Math.floor(rand() * 12) + 1;
    const d = Math.floor(rand() * 28) + 1;
    const claimAmt = Math.round((rand() * 2500000 + 25000) * 100) / 100;

    claims.push({
      id: `ICL-${String(i + 3001).padStart(4, "0")}`,
      policyNumber: `POL-${String(2024000 + Math.floor(rand() * 200)).padStart(7, "0")}`,
      claimNumber: `CLM-${String(2025000 + i).padStart(7, "0")}`,
      customer: customers[Math.floor(rand() * customers.length)],
      city: cities[Math.floor(rand() * cities.length)],
      phone: String(7000000000 + Math.floor(rand() * 3000000000)),
      insuranceType: insuranceTypes[Math.floor(rand() * insuranceTypes.length)],
      insurer: insurers[Math.floor(rand() * insurers.length)],
      claimAmount: claimAmt,
      approvedAmount: hasApproval ? Math.round(claimAmt * (0.4 + rand() * 0.55) * 100) / 100 : 0,
      deductible: Math.round(claimAmt * (0.02 + rand() * 0.08) * 100) / 100,
      status,
      incidentDate: `2024-${String(Math.min(m, 12)).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      filedDate: `2024-${String(Math.min(m + 1, 12)).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      settlementDate: isSettled ? `2025-${String(Math.min(m + 3, 12)).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}` : undefined,
      description: descriptions[Math.floor(rand() * descriptions.length)],
      category: categories[Math.floor(rand() * categories.length)],
      assignedAdjuster: status === "draft" ? undefined : adjusters[Math.floor(rand() * adjusters.length)],
      priority: pickPriority(),
      documents: Math.floor(rand() * 8) + 1,
      assessmentNotes: hasApproval ? "Damage assessment completed. Loss quantified and documented with photographic evidence." : undefined,
    });
  }

  // Monthly trends
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyTrends = months.map(m => ({
    month: m,
    claims: Math.floor(rand() * 80 + 40),
    settled: Math.floor(rand() * 50 + 20),
    claimValue: Math.round(rand() * 50000000 + 10000000),
    settlementValue: Math.round(rand() * 35000000 + 8000000),
    avgSettlementDays: Math.round((rand() * 40 + 15) * 10) / 10,
    rejectionRate: Math.round((rand() * 12 + 3) * 10) / 10,
  }));

  // Insurer performance
  const insurerPerf = insurers.map(ins => ({
    insurer: ins,
    totalClaims: Math.floor(rand() * 200 + 30),
    avgSettlement: Math.round(rand() * 3000000 + 500000),
    avgDays: Math.round((rand() * 30 + 10) * 10) / 10,
    approvalRate: Math.round((rand() * 25 + 65) * 10) / 10,
    rejectionRate: Math.round((rand() * 12 + 3) * 10) / 10,
    totalSettled: Math.round(rand() * 50000000 + 5000000),
  }));

  // Category breakdown
  const categoryBreakdown = categories.map(c => ({
    category: c,
    totalClaims: Math.floor(rand() * 100 + 15),
    totalClaimed: Math.round(rand() * 20000000 + 1000000),
    totalSettled: Math.round(rand() * 15000000 + 500000),
    avgDays: Math.round((rand() * 35 + 10) * 10) / 10,
    approvalRate: Math.round((rand() * 25 + 60) * 10) / 10,
  }));

  // Insurance type pie
  const typeLabels: Record<string, string> = { cargo_transit: "Cargo Transit", warehouse_liability: "Warehouse Liability", employee_compensation: "Employee Comp.", property: "Property", vehicle_fleet: "Vehicle Fleet", general_liability: "General Liability" };
  const typePie = insuranceTypes.map(t => ({ name: typeLabels[t], value: claims.filter(c => c.insuranceType === t).length }));

  return { claims, monthlyTrends, insurerPerf, categoryBreakdown, typePie, typeLabels };
}

// ============================================================================
// Theme & Config
// ============================================================================
const THEME = { primary: "#0ea5e9", secondary: "#f59e0b", accent: "#10b981", danger: "#ef4444", muted: "#64748b" };
const PIE_COLORS = ["#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899", "#14b8a6", "#84cc16"];

function formatINR(amount: number): string {
  if (amount >= 10000000) return "₹" + (amount / 10000000).toFixed(2) + " Cr";
  if (amount >= 100000) return "₹" + (amount / 100000).toFixed(2) + " L";
  if (amount >= 1000) return "₹" + (amount / 1000).toFixed(1) + "K";
  return "₹" + amount.toFixed(0);
}
function formatNumber(n: number): string { return n.toLocaleString("en-IN"); }

const statusConfig: Record<InsuranceClaim["status"], { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
  submitted: { label: "Submitted", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  under_review: { label: "Under Review", color: "text-cyan-700 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
  investigation: { label: "Investigation", color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/40" },
  approved: { label: "Approved", color: "text-sky-700 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/40" },
  partially_approved: { label: "Partial", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  rejected: { label: "Rejected", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  settled: { label: "Settled", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  closed: { label: "Closed", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-800" },
};

const priorityConfig: Record<InsuranceClaim["priority"], { label: string; color: string; bg: string }> = {
  low: { label: "Low", color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800" },
  medium: { label: "Medium", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/40" },
  high: { label: "High", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/40" },
  critical: { label: "Critical", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/40" },
};

const typeColorConfig: Record<InsuranceClaim["insuranceType"], { color: string; bg: string }> = {
  cargo_transit: { color: "text-sky-700", bg: "bg-sky-100 dark:bg-sky-900/40" },
  warehouse_liability: { color: "text-violet-700", bg: "bg-violet-100 dark:bg-violet-900/40" },
  employee_compensation: { color: "text-amber-700", bg: "bg-amber-100 dark:bg-amber-900/40" },
  property: { color: "text-emerald-700", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  vehicle_fleet: { color: "text-cyan-700", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
  general_liability: { color: "text-indigo-700", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
};

// ============================================================================
// Main
// ============================================================================
export default function InsuranceClaimsView() {
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const data = useMemo(() => generateData(), []);

  const tabs = [
    { label: "Dashboard", icon: BarChart3 },
    { label: "Claims Queue", icon: FileText },
    { label: "Insurer Analysis", icon: Scale },
    { label: "Category Insights", icon: TrendingDown },
  ];

  // KPIs
  const totalClaims = data.claims.length;
  const openClaims = data.claims.filter(c => ["draft", "submitted", "under_review", "investigation"].includes(c.status)).length;
  const settledClaims = data.claims.filter(c => ["settled"].includes(c.status)).length;
  const totalClaimed = data.claims.reduce((s, c) => s + c.claimAmount, 0);
  const totalSettled = data.claims.filter(c => c.approvedAmount > 0).reduce((s, c) => s + c.approvedAmount, 0);
  const criticalClaims = data.claims.filter(c => c.priority === "critical").length;

  const kpis = [
    { label: "Total Claims", value: formatNumber(totalClaims), change: "+7.2%", up: true, icon: ShieldPlus, color: THEME.primary },
    { label: "Open Claims", value: formatNumber(openClaims), change: "-3.1%", up: false, icon: Clock, color: THEME.secondary },
    { label: "Settled", value: formatNumber(settledClaims), change: "+14.5%", up: true, icon: CheckCircle2, color: THEME.accent },
    { label: "Total Claimed", value: formatINR(totalClaimed), change: "+11.8%", up: true, icon: IndianRupee, color: THEME.primary },
    { label: "Total Settled", value: formatINR(totalSettled), change: "+9.3%", up: true, icon: Banknote, color: THEME.accent },
    { label: "Critical Claims", value: formatNumber(criticalClaims), change: "-5.6%", up: false, icon: AlertTriangle, color: THEME.danger },
  ];

  // Status Pie
  const statusPie = Object.entries(statusConfig).map(([k, v]) => ({
    name: v.label,
    value: data.claims.filter(c => c.status === k).length,
  }));

  // Alerts
  const alerts = [
    { title: "Critical Claim Pending", desc: "₹18.5L cargo transit claim pending 45+ days", severity: "critical" as const },
    { title: "Insurer Delay Alert", desc: "New India Assurance 8 claims past SLA", severity: "warning" as const },
    { title: "Policy Expiry", desc: "3 warehouse liability policies expiring in 15 days", severity: "warning" as const },
    { title: "High Rejection Rate", desc: "ICICI Lombard rejection rate at 14.2%", severity: "info" as const },
    { title: "Investigation Stalled", desc: "5 investigation claims awaiting adjuster visit", severity: "warning" as const },
    { title: "Settlement Milestone", desc: "₹2.3Cr settled this month — 8% above target", severity: "info" as const },
  ];

  // Tab 2: Filtered claims
  const filteredClaims = useMemo(() => {
    return data.claims.filter(c => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (typeFilter !== "all" && c.insuranceType !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.id.toLowerCase().includes(q) || c.claimNumber.toLowerCase().includes(q) ||
          c.customer.toLowerCase().includes(q) || c.policyNumber.toLowerCase().includes(q) ||
          c.insurer.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data.claims, statusFilter, typeFilter, searchQuery]);

  const uniqueStatuses = ["all", ...new Set(data.claims.map(c => c.status))] as const;
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: data.claims.length };
    data.claims.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return counts;
  }, [data.claims]);

  const handleViewClaim = useCallback((claim: InsuranceClaim) => {
    setSelectedClaim(claim);
    setDrawerOpen(true);
  }, []);

  return (
    <div className="icm-container">
      {/* Tab Header */}
      <div className="icm-tab-header">
        <div className="icm-tab-nav">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button key={tab.label} className={`icm-tab-btn ${activeTab === i ? "icm-tab-active" : ""}`} onClick={() => setActiveTab(i)}>
                <Icon className="icm-tab-icon" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="icm-header-badge">
          <ShieldPlus className="icm-header-badge-icon" />
          <span>Insurance Claims Management</span>
        </div>
      </div>

      {/* Tab 0: Dashboard */}
      {activeTab === 0 && (
        <div className="icm-tab-content">
          <div className="icm-kpi-grid">
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <div key={i} className="icm-kpi-card">
                  <div className="icm-kpi-top">
                    <span className="icm-kpi-label">{kpi.label}</span>
                    <div className="icm-kpi-icon-wrap" style={{ backgroundColor: kpi.color + "18" }}>
                      <Icon className="icm-kpi-icon" style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <div className="icm-kpi-value">{kpi.value}</div>
                  <div className={`icm-kpi-change ${kpi.up ? "icm-kpi-up" : "icm-kpi-down"}`}>
                    {kpi.up ? <ArrowUpRight className="icm-kpi-change-icon" /> : <ArrowDownRight className="icm-kpi-change-icon" />}
                    {kpi.change} vs last month
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row 1 */}
          <div className="icm-chart-row">
            <div className="icm-chart-card icm-chart-wide">
              <h3 className="icm-chart-title">Monthly Claims Value & Settlement</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip formatter={(value: number, name: string) => {
                    if (["rejectionRate"].includes(name)) return `${value}%`;
                    return formatINR(value);
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="claimValue" name="Claim Value" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar yAxisId="left" dataKey="settlementValue" name="Settlement Value" fill={THEME.accent} radius={[4, 4, 0, 0]} barSize={16} />
                  <Line yAxisId="right" dataKey="rejectionRate" name="Rejection %" stroke={THEME.danger} strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="icm-chart-card icm-chart-narrow">
              <h3 className="icm-chart-title">Claims Status Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusPie} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {statusPie.map((_entry, index) => (
                      <Cell key={`sp-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="icm-chart-row">
            <div className="icm-chart-card icm-chart-narrow">
              <h3 className="icm-chart-title">Insurance Type Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={data.typePie} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {data.typePie.map((_entry, index) => (
                      <Cell key={`tp-${index}`} fill={[THEME.primary, "#8b5cf6", THEME.secondary, THEME.accent, "#06b6d4", "#f97316"][index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="icm-chart-card icm-chart-wide">
              <h3 className="icm-chart-title">Monthly Claims & Avg Settlement Days</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}d`} />
                  <Tooltip formatter={(value: number, name: string) => name === "avgSettlementDays" ? `${value} days` : formatNumber(value)} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="claims" name="Claims Filed" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar yAxisId="left" dataKey="settled" name="Settled" fill={THEME.accent} radius={[4, 4, 0, 0]} barSize={14} />
                  <Line yAxisId="right" dataKey="avgSettlementDays" name="Avg Days" stroke={THEME.secondary} strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="icm-alerts-section">
            <h3 className="icm-section-title"><AlertTriangle className="icm-section-title-icon" /> Insurance Alerts</h3>
            <div className="icm-alerts-grid">
              {alerts.map((alert, i) => (
                <div key={i} className={`icm-alert-card icm-alert-${alert.severity}`}>
                  <div className="icm-alert-header"><AlertTriangle className="icm-alert-icon" /><span className="icm-alert-title">{alert.title}</span></div>
                  <p className="icm-alert-desc">{alert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Claims Queue */}
      {activeTab === 1 && (
        <div className="icm-tab-content">
          <div className="icm-table-toolbar">
            <div className="icm-filters-row">
              <div className="icm-filter-bar">
                {uniqueStatuses.map(s => {
                  const cfg = s !== "all" ? statusConfig[s as InsuranceClaim["status"]] : null;
                  return (
                    <button key={s} className={`icm-filter-btn ${statusFilter === s ? "icm-filter-active" : ""}`} onClick={() => setStatusFilter(s)}>
                      {s === "all" ? "All" : cfg?.label || s}
                      <span className="icm-filter-count">{statusCounts[s] || 0}</span>
                    </button>
                  );
                })}
              </div>
              <div className="icm-filter-bar icm-type-filter">
                <button className={`icm-filter-btn ${typeFilter === "all" ? "icm-filter-active" : ""}`} onClick={() => setTypeFilter("all")}>All Types</button>
                {Object.entries(data.typeLabels).map(([k, v]) => (
                  <button key={k} className={`icm-filter-btn ${typeFilter === k ? "icm-filter-active" : ""}`} onClick={() => setTypeFilter(k)}>{v}</button>
                ))}
              </div>
            </div>
            <div className="icm-search-box">
              <Search className="icm-search-icon" />
              <input type="text" placeholder="Search by claim ID, policy, customer, insurer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="icm-search-input" />
            </div>
          </div>

          <div className="icm-table-wrap">
            <table className="icm-table">
              <thead>
                <tr className="icm-table-head">
                  <th>Claim / Policy</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Insurer</th>
                  <th>Type</th>
                  <th>Claim Amount (₹)</th>
                  <th>Approved (₹)</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Adjuster</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.slice(0, 30).map((claim, i) => {
                  const sc = statusConfig[claim.status];
                  const pc = priorityConfig[claim.priority];
                  const tc = typeColorConfig[claim.insuranceType];
                  return (
                    <tr key={claim.id} className={`icm-table-row ${i % 2 === 0 ? "icm-row-even" : "icm-row-odd"}`}>
                      <td>
                        <div className="icm-cell-id">{claim.id}</div>
                        <div className="icm-cell-sub">{claim.claimNumber}</div>
                        <div className="icm-cell-sub">{claim.policyNumber}</div>
                      </td>
                      <td>
                        <div className="icm-cell-name">{claim.customer}</div>
                        <div className="icm-cell-phone">{claim.city}</div>
                      </td>
                      <td><span className="icm-category-badge">{claim.category}</span></td>
                      <td><span className="icm-insurer-badge">{claim.insurer}</span></td>
                      <td><span className={`icm-type-badge ${tc.bg} ${tc.color}`}>{data.typeLabels[claim.insuranceType]}</span></td>
                      <td className="icm-cell-amount">₹{claim.claimAmount.toLocaleString("en-IN")}</td>
                      <td className="icm-cell-amount icm-cell-secondary">{claim.approvedAmount > 0 ? `₹${claim.approvedAmount.toLocaleString("en-IN")}` : "—"}</td>
                      <td><span className={`icm-status-badge ${pc.bg} ${pc.color}`}>{pc.label}</span></td>
                      <td><span className={`icm-status-badge ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                      <td className="icm-cell-center">{claim.assignedAdjuster || "—"}</td>
                      <td>
                        <button className="icm-action-btn" onClick={() => handleViewClaim(claim)}>
                          <Eye className="icm-action-icon" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="icm-table-footer">Showing {Math.min(30, filteredClaims.length)} of {filteredClaims.length} insurance claims</div>
        </div>
      )}

      {/* Tab 2: Insurer Analysis */}
      {activeTab === 2 && (
        <div className="icm-tab-content">
          <div className="icm-chart-row">
            <div className="icm-chart-card icm-chart-wide">
              <h3 className="icm-chart-title">Insurer: Approval Rate & Rejection Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.insurerPerf} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <YAxis dataKey="insurer" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="approvalRate" name="Approval Rate" fill={THEME.accent} radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="rejectionRate" name="Rejection Rate" fill={THEME.danger} radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="icm-chart-card icm-chart-narrow">
              <h3 className="icm-chart-title">Insurer Claims Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.insurerPerf.map(v => ({ name: v.insurer, value: v.totalClaims }))} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {data.insurerPerf.map((_entry, index) => (
                      <Cell key={`ins-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="icm-chart-card icm-chart-full">
            <h3 className="icm-chart-title">Insurer Performance Scorecard</h3>
            <div className="icm-table-wrap">
              <table className="icm-table">
                <thead>
                  <tr className="icm-table-head">
                    <th>Insurer</th>
                    <th>Total Claims</th>
                    <th>Approval Rate</th>
                    <th>Rejection Rate</th>
                    <th>Avg Settlement (₹)</th>
                    <th>Avg Days</th>
                    <th>Total Settled (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.insurerPerf.map((ins, i) => (
                    <tr key={ins.insurer} className={`icm-table-row ${i % 2 === 0 ? "icm-row-even" : "icm-row-odd"}`}>
                      <td><span className="icm-insurer-badge">{ins.insurer}</span></td>
                      <td className="icm-cell-center">{formatNumber(ins.totalClaims)}</td>
                      <td className="icm-cell-center">{ins.approvalRate}%</td>
                      <td className={`icm-cell-center ${ins.rejectionRate > 10 ? "icm-cell-danger" : ""}`}>{ins.rejectionRate}%</td>
                      <td className="icm-cell-amount">₹{formatNumber(ins.avgSettlement)}</td>
                      <td className={`icm-cell-center ${ins.avgDays > 30 ? "icm-cell-danger" : ""}`}>{ins.avgDays}d</td>
                      <td className="icm-cell-amount">₹{formatINR(ins.totalSettled)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Category Insights */}
      {activeTab === 3 && (
        <div className="icm-tab-content">
          <div className="icm-chart-row">
            <div className="icm-chart-card icm-chart-wide">
              <h3 className="icm-chart-title">Category-wise Claimed vs Settled Amount</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data.categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={60} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip formatter={(value: number, name: string) => name === "approvalRate" ? `${value}%` : formatINR(value)} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="totalClaimed" name="Total Claimed" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar yAxisId="left" dataKey="totalSettled" name="Total Settled" fill={THEME.accent} radius={[4, 4, 0, 0]} barSize={14} />
                  <Line yAxisId="right" dataKey="approvalRate" name="Approval %" stroke={THEME.secondary} strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="icm-chart-card icm-chart-narrow">
              <h3 className="icm-chart-title">Category Claims Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.categoryBreakdown.map(c => ({ name: c.category, value: c.totalClaims }))} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {data.categoryBreakdown.map((_entry, index) => (
                      <Cell key={`cat-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="icm-chart-card icm-chart-full">
            <h3 className="icm-chart-title">Category Breakdown Details</h3>
            <div className="icm-table-wrap">
              <table className="icm-table">
                <thead>
                  <tr className="icm-table-head">
                    <th>Category</th>
                    <th>Total Claims</th>
                    <th>Total Claimed (₹)</th>
                    <th>Total Settled (₹)</th>
                    <th>Recovery Rate</th>
                    <th>Avg Days</th>
                    <th>Approval Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categoryBreakdown.map((c, i) => {
                    const recovery = c.totalClaimed > 0 ? ((c.totalSettled / c.totalClaimed) * 100).toFixed(1) : "0";
                    return (
                      <tr key={c.category} className={`icm-table-row ${i % 2 === 0 ? "icm-row-even" : "icm-row-odd"}`}>
                        <td><span className="icm-category-badge">{c.category}</span></td>
                        <td className="icm-cell-center">{formatNumber(c.totalClaims)}</td>
                        <td className="icm-cell-amount">₹{formatINR(c.totalClaimed)}</td>
                        <td className="icm-cell-amount">₹{formatINR(c.totalSettled)}</td>
                        <td className="icm-cell-center">
                          <div className="icm-mini-bar">
                            <div className="icm-mini-bar-fill" style={{ width: `${Math.min(Number(recovery), 100)}%`, backgroundColor: Number(recovery) >= 70 ? THEME.accent : THEME.secondary }} />
                            <span className="icm-mini-bar-text">{recovery}%</span>
                          </div>
                        </td>
                        <td className={`icm-cell-center ${c.avgDays > 30 ? "icm-cell-danger" : ""}`}>{c.avgDays}d</td>
                        <td className="icm-cell-center">{c.approvalRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Claim Detail Drawer */}
      {drawerOpen && selectedClaim && (
        <div className="icm-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="icm-drawer" onClick={(e) => e.stopPropagation()}>
            <div className={`icm-drawer-header icm-drawer-header-${["settled"].includes(selectedClaim.status) ? "settled" : selectedClaim.status === "rejected" ? "rejected" : "open"}`}>
              <div className="icm-drawer-header-top">
                <h2 className="icm-drawer-title">{selectedClaim.id}</h2>
                <button className="icm-drawer-close" onClick={() => setDrawerOpen(false)}>&times;</button>
              </div>
              <div className="icm-drawer-badges">
                <span className={`icm-status-badge ${statusConfig[selectedClaim.status].bg} ${statusConfig[selectedClaim.status].color}`}>{statusConfig[selectedClaim.status].label}</span>
                <span className={`icm-status-badge ${priorityConfig[selectedClaim.priority].bg} ${priorityConfig[selectedClaim.priority].color}`}>{priorityConfig[selectedClaim.priority].label}</span>
                <span className={`icm-type-badge ${typeColorConfig[selectedClaim.insuranceType].bg} ${typeColorConfig[selectedClaim.insuranceType].color}`}>{data.typeLabels[selectedClaim.insuranceType]}</span>
              </div>
            </div>

            <div className="icm-drawer-body">
              {/* Claim Info */}
              <div className="icm-drawer-section">
                <h4 className="icm-drawer-section-title">Claim & Policy</h4>
                <div className="icm-drawer-grid">
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Claim Number</span>
                    <span className="icm-drawer-field-value">{selectedClaim.claimNumber}</span>
                  </div>
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Policy Number</span>
                    <span className="icm-drawer-field-value">{selectedClaim.policyNumber}</span>
                  </div>
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Insurer</span>
                    <span className="icm-drawer-field-value">{selectedClaim.insurer}</span>
                  </div>
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Category</span>
                    <span className="icm-drawer-field-value">{selectedClaim.category}</span>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="icm-drawer-section">
                <h4 className="icm-drawer-section-title">Claimant</h4>
                <div className="icm-drawer-grid">
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Customer</span>
                    <span className="icm-drawer-field-value">{selectedClaim.customer}</span>
                  </div>
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">City</span>
                    <span className="icm-drawer-field-value">{selectedClaim.city}</span>
                  </div>
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Phone</span>
                    <span className="icm-drawer-field-value">{selectedClaim.phone}</span>
                  </div>
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Documents</span>
                    <span className="icm-drawer-field-value">{selectedClaim.documents} files</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="icm-drawer-section">
                <h4 className="icm-drawer-section-title">Key Dates</h4>
                <div className="icm-drawer-grid">
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Incident Date</span>
                    <span className="icm-drawer-field-value">{selectedClaim.incidentDate}</span>
                  </div>
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Filed Date</span>
                    <span className="icm-drawer-field-value">{selectedClaim.filedDate}</span>
                  </div>
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Settlement Date</span>
                    <span className="icm-drawer-field-value">{selectedClaim.settlementDate || "—"}</span>
                  </div>
                  <div className="icm-drawer-field">
                    <span className="icm-drawer-field-label">Adjuster</span>
                    <span className="icm-drawer-field-value">{selectedClaim.assignedAdjuster || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="icm-drawer-section">
                <h4 className="icm-drawer-section-title">Incident Description</h4>
                <div className="icm-desc-card">
                  <Package className="icm-desc-icon" />
                  <span className="icm-desc-text">{selectedClaim.description}</span>
                </div>
              </div>

              {/* Financial */}
              <div className="icm-drawer-section">
                <h4 className="icm-drawer-section-title">Financial Summary</h4>
                <div className="icm-financial-grid">
                  <div className="icm-financial-item">
                    <span className="icm-financial-label">Claim Amount</span>
                    <span className="icm-financial-value icm-financial-primary">₹{selectedClaim.claimAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="icm-financial-item">
                    <span className="icm-financial-label">Approved Amount</span>
                    <span className="icm-financial-value icm-financial-accent">{selectedClaim.approvedAmount > 0 ? `₹${selectedClaim.approvedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}</span>
                  </div>
                  <div className="icm-financial-item">
                    <span className="icm-financial-label">Deductible</span>
                    <span className="icm-financial-value">₹{selectedClaim.deductible.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  {selectedClaim.approvedAmount > 0 && (
                    <div className="icm-financial-item">
                      <span className="icm-financial-label">Net Settlement</span>
                      <span className="icm-financial-value icm-financial-net">₹{(selectedClaim.approvedAmount - selectedClaim.deductible).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
                {selectedClaim.approvedAmount > 0 && (
                  <div className="icm-recovery-bar">
                    <div className="icm-recovery-bar-label">Recovery Rate</div>
                    <div className="icm-recovery-bar-track">
                      <div className="icm-recovery-bar-fill" style={{ width: `${Math.min((selectedClaim.approvedAmount / selectedClaim.claimAmount) * 100, 100)}%` }} />
                    </div>
                    <div className="icm-recovery-bar-value">{((selectedClaim.approvedAmount / selectedClaim.claimAmount) * 100).toFixed(1)}%</div>
                  </div>
                )}
              </div>

              {/* Assessment Notes */}
              {selectedClaim.assessmentNotes && (
                <div className="icm-drawer-section">
                  <h4 className="icm-drawer-section-title">Assessment Notes</h4>
                  <div className="icm-notes-card">
                    <FileText className="icm-notes-icon" />
                    <span className="icm-notes-text">{selectedClaim.assessmentNotes}</span>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="icm-drawer-section">
                <h4 className="icm-drawer-section-title">Claim Timeline</h4>
                <div className="icm-drawer-timeline">
                  <div className={`icm-timeline-step ${selectedClaim.status !== "draft" ? "icm-timeline-done" : "icm-timeline-pending"}`}>
                    <div className="icm-timeline-dot" /><span>Incident</span>
                    <span className="icm-timeline-date">{selectedClaim.incidentDate}</span>
                  </div>
                  <div className={`icm-timeline-step ${["under_review", "investigation", "approved", "partially_approved", "rejected", "settled", "closed"].includes(selectedClaim.status) ? "icm-timeline-done" : "icm-timeline-pending"}`}>
                    <div className="icm-timeline-dot" /><span>Filed</span>
                    <span className="icm-timeline-date">{selectedClaim.filedDate}</span>
                  </div>
                  <div className={`icm-timeline-step ${["approved", "partially_approved", "settled", "closed"].includes(selectedClaim.status) ? "icm-timeline-done" : selectedClaim.status === "rejected" ? "icm-timeline-rejected" : "icm-timeline-pending"}`}>
                    <div className="icm-timeline-dot" /><span>{selectedClaim.status === "rejected" ? "Rejected" : selectedClaim.settlementDate ? "Settled" : "Processing"}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="icm-drawer-actions">
                {["draft", "submitted"].includes(selectedClaim.status) && (
                  <button className="icm-btn icm-btn-primary"><RefreshCw className="icm-btn-icon" /> Submit to Insurer</button>
                )}
                {selectedClaim.status === "under_review" && (
                  <button className="icm-btn icm-btn-primary"><CheckCircle2 className="icm-btn-icon" /> Approve Claim</button>
                )}
                <button className="icm-btn icm-btn-secondary"><FileText className="icm-btn-icon" /> Download Report</button>
                <button className="icm-btn icm-btn-secondary"><Eye className="icm-btn-icon" /> View Documents</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
