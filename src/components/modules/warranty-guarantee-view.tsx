"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ShieldQuestion, ArrowUpRight, ArrowDownRight,
  CheckCircle2, XCircle, AlertTriangle, Clock, RefreshCw,
  BarChart3, Eye, Search, IndianRupee, Calendar,
  TrendingDown, Package, Users, Wrench, FileText,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
interface WarrantyClaim {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  city: string;
  product: string;
  sku: string;
  category: string;
  warrantyType: "standard" | "extended" | "lifetime" | "manufacturer";
  purchaseDate: string;
  warrantyStart: string;
  warrantyEnd: string;
  issueDate: string;
  issue: string;
  status: "submitted" | "under_review" | "approved" | "rejected" | "in_repair" | "replaced" | "refunded" | "expired";
  resolution?: string;
  assignedEngineer?: string;
  estimatedCost?: number;
  actualCost?: number;
  priority: "low" | "medium" | "high" | "critical";
  resolutionTime?: number;
  vendor: string;
}

interface WarrantyPolicy {
  id: string;
  category: string;
  productName: string;
  warrantyMonths: number;
  extendedMonths: number;
  deductiblePct: number;
  coverage: string[];
  exclusions: string[];
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
  const rand = seededRandom(157157);

  const cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur", "Lucknow", "Ahmedabad"];
  const categories = ["Electronics", "Appliances", "Mobile Phones", "Laptops", "Power Tools", "Industrial Equipment", "HVAC Systems", "LED Lighting", "Inverters & UPS", "Security Systems"];
  const products = ["Samsung Galaxy S24", "LG Washing Machine", "Dell Inspiron 15", "Voltas AC 1.5T", "Bosch Drill Machine", "Panasonic Inverter", "Havells LED Panel", "Godrej Refrigerator", "Whirlpool Microwave", "Crompton Fan", "Mi Power Bank", "OnePlus Nord CE", "HP LaserJet", "Canon DSLR", "Sony Bravia TV", "Blue Star AC", "Luminous UPS", "Makita Grinder", "Hitachi Chainsaw", "Syska LED Bulb"];
  const vendors = ["Samsung India", "LG Electronics", "Dell India", "Voltas Ltd", "Bosch India", "Panasonic India", "Havells India", "Godrej Appliances", "Whirlpool India", "Sony India", "Blue Star Ltd", "Luminous Power", "Makita India", "HP India", "Canon India"];
  const issues = [
    "Screen flickering after software update", "Compressor making unusual noise", "Battery draining rapidly",
    "Motherboard failure", "Water leakage from unit", "Motor not spinning", "Overheating during operation",
    "Display dead pixels", "Power button unresponsive", "Speaker distortion at high volume",
    "WiFi connectivity drops frequently", "Fan blade broken", "Remote sensor not working",
    "Charging port damaged", "Hinge mechanism loose", "Auto-shutdown randomly",
    "Vibration excessive", "Touch screen unresponsive in areas", "Indicator light faulty",
    "Door seal worn out",
  ];
  const resolutions = ["Part replaced under warranty", "Full unit replacement", "Repair completed", "Refund processed", "Escalated to vendor RMA", "Software fix applied", "Service center repair", "On-site repair completed"];
  const engineers = ["Arun Kumar", "Deepak Mehta", "Suresh Rao", "Ravi Shankar", "Vikram Patel", "Kiran Joshi", "Manoj Tiwari", "Pradeep Sharma"];

  const statusWeights: Array<{ status: WarrantyClaim["status"]; w: number }> = [
    { status: "submitted", w: 0.06 },
    { status: "under_review", w: 0.08 },
    { status: "approved", w: 0.12 },
    { status: "rejected", w: 0.05 },
    { status: "in_repair", w: 0.14 },
    { status: "replaced", w: 0.22 },
    { status: "refunded", w: 0.15 },
    { status: "expired", w: 0.18 },
  ];

  const warrantyTypes: Array<WarrantyClaim["warrantyType"]> = ["standard", "extended", "lifetime", "manufacturer"];
  const priorityWeights: Array<{ priority: WarrantyClaim["priority"]; w: number }> = [
    { priority: "low", w: 0.25 },
    { priority: "medium", w: 0.35 },
    { priority: "high", w: 0.25 },
    { priority: "critical", w: 0.15 },
  ];

  const customers = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sunita Devi", "Rajesh Gupta", "Neha Singh", "Vikram Joshi", "Kavita Reddy", "Manish Agarwal", "Deepa Nair", "Suresh Menon", "Anita Desai", "Prakash Iyer", "Ritu Malhotra", "Arjun Verma"];

  function pickStatus(): WarrantyClaim["status"] {
    const r = rand();
    let cum = 0;
    for (const s of statusWeights) {
      cum += s.w;
      if (r < cum) return s.status;
    }
    return "replaced";
  }

  function pickPriority(): WarrantyClaim["priority"] {
    const r = rand();
    let cum = 0;
    for (const p of priorityWeights) {
      cum += p.w;
      if (r < cum) return p.priority;
    }
    return "medium";
  }

  const claims: WarrantyClaim[] = [];
  for (let i = 0; i < 300; i++) {
    const status = pickStatus();
    const isResolved = ["replaced", "refunded", "expired", "rejected"].includes(status);
    const hasCost = ["approved", "in_repair", "replaced", "refunded"].includes(status);
    const m = Math.floor(rand() * 12) + 1;
    const d = Math.floor(rand() * 28) + 1;
    const wMonths = Math.floor(rand() * 24 + 6);
    const isExtended = warrantyTypes[Math.floor(rand() * 4)] === "extended";
    const purchaseM = Math.max(1, m - Math.floor(wMonths / 2));

    claims.push({
      id: `WC-${String(i + 2001).padStart(4, "0")}`,
      orderId: `ORD-${String(2025000 + i).padStart(7, "0")}`,
      customer: customers[Math.floor(rand() * customers.length)],
      phone: String(7000000000 + Math.floor(rand() * 3000000000)),
      city: cities[Math.floor(rand() * cities.length)],
      product: products[Math.floor(rand() * products.length)],
      sku: `SKU-${String(10000 + Math.floor(rand() * 90000))}`,
      category: categories[Math.floor(rand() * categories.length)],
      warrantyType: isExtended ? "extended" : warrantyTypes[Math.floor(rand() * 3)],
      purchaseDate: `2024-${String(purchaseM).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      warrantyStart: `2024-${String(purchaseM).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      warrantyEnd: `2025-${String(Math.min(purchaseM + Math.floor(wMonths / 12), 12)).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
      issueDate: `2025-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      issue: issues[Math.floor(rand() * issues.length)],
      status,
      resolution: isResolved ? resolutions[Math.floor(rand() * resolutions.length)] : undefined,
      assignedEngineer: ["submitted", "expired"].includes(status) ? undefined : engineers[Math.floor(rand() * engineers.length)],
      estimatedCost: hasCost ? Math.round((rand() * 15000 + 500) * 100) / 100 : undefined,
      actualCost: isResolved ? Math.round((rand() * 12000 + 300) * 100) / 100 : undefined,
      priority: pickPriority(),
      resolutionTime: isResolved ? Math.floor(rand() * 14) + 1 : undefined,
      vendor: vendors[Math.floor(rand() * vendors.length)],
    });
  }

  // Policies
  const policies: WarrantyPolicy[] = categories.map(cat => ({
    id: `WP-${String(1000 + categories.indexOf(cat))}`,
    category: cat,
    productName: products[Math.floor(rand() * products.length)],
    warrantyMonths: Math.floor(rand() * 24 + 6),
    extendedMonths: Math.floor(rand() * 24 + 12),
    deductiblePct: Math.round(rand() * 5 + 1) * 10,
    coverage: ["Manufacturing defects", "Component failure", "Functional issues"].slice(0, Math.floor(rand() * 3) + 1),
    exclusions: ["Physical damage", "Water damage", "Unauthorized repair", "Cosmetic wear"].slice(0, Math.floor(rand() * 3) + 1),
  }));

  // Monthly trends
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyTrends = months.map(m => ({
    month: m,
    claims: Math.floor(rand() * 150 + 80),
    resolved: Math.floor(rand() * 100 + 50),
    avgCost: Math.round(rand() * 8000 + 2000),
    approvalRate: Math.round((rand() * 30 + 60) * 10) / 10,
    avgResolutionDays: Math.round((rand() * 8 + 2) * 10) / 10,
  }));

  // Vendor performance
  const vendorPerf = vendors.slice(0, 8).map(v => ({
    vendor: v,
    totalClaims: Math.floor(rand() * 300 + 50),
    approvalRate: Math.round((rand() * 25 + 70) * 10) / 10,
    avgResolutionDays: Math.round((rand() * 6 + 2) * 10) / 10,
    avgCost: Math.round(rand() * 6000 + 1500),
    customerSatisfaction: Math.round((rand() * 2 + 3) * 10) / 10,
    escalationRate: Math.round((rand() * 10 + 2) * 10) / 10,
  }));

  // Category breakdown
  const categoryBreakdown = categories.map(c => ({
    category: c,
    totalClaims: Math.floor(rand() * 200 + 30),
    avgCost: Math.round(rand() * 10000 + 1000),
    approvalRate: Math.round((rand() * 25 + 65) * 10) / 10,
    avgResolutionDays: Math.round((rand() * 10 + 1) * 10) / 10,
    topIssue: issues[Math.floor(rand() * issues.length)],
  }));

  return { claims, policies, monthlyTrends, vendorPerf, categoryBreakdown };
}

// ============================================================================
// Theme & Config
// ============================================================================
const THEME = { primary: "#8b5cf6", secondary: "#f59e0b", accent: "#10b981", danger: "#ef4444", muted: "#64748b" };
const PIE_COLORS = ["#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#f97316", "#ec4899", "#14b8a6", "#84cc16", "#6366f1"];

function formatINR(amount: number): string {
  if (amount >= 10000000) return "₹" + (amount / 10000000).toFixed(2) + " Cr";
  if (amount >= 100000) return "₹" + (amount / 100000).toFixed(2) + " L";
  if (amount >= 1000) return "₹" + (amount / 1000).toFixed(1) + "K";
  return "₹" + amount.toFixed(0);
}

function formatNumber(n: number): string { return n.toLocaleString("en-IN"); }

const statusConfig: Record<WarrantyClaim["status"], { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800" },
  under_review: { label: "Under Review", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  approved: { label: "Approved", color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/40" },
  rejected: { label: "Rejected", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  in_repair: { label: "In Repair", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  replaced: { label: "Replaced", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  refunded: { label: "Refunded", color: "text-teal-700 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/40" },
  expired: { label: "Expired", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-800" },
};

const priorityConfig: Record<WarrantyClaim["priority"], { label: string; color: string; bg: string }> = {
  low: { label: "Low", color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800" },
  medium: { label: "Medium", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/40" },
  high: { label: "High", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/40" },
  critical: { label: "Critical", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/40" },
};

const warrantyTypeConfig: Record<WarrantyClaim["warrantyType"], { label: string; color: string; bg: string }> = {
  standard: { label: "Standard", color: "text-violet-700", bg: "bg-violet-100 dark:bg-violet-900/40" },
  extended: { label: "Extended", color: "text-amber-700", bg: "bg-amber-100 dark:bg-amber-900/40" },
  lifetime: { label: "Lifetime", color: "text-emerald-700", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  manufacturer: { label: "Manufacturer", color: "text-cyan-700", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
};

// ============================================================================
// Main
// ============================================================================
export default function WarrantyGuaranteeView() {
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const data = useMemo(() => generateData(), []);

  const tabs = [
    { label: "Dashboard", icon: BarChart3 },
    { label: "Claims Queue", icon: FileText },
    { label: "Warranty Policies", icon: ShieldQuestion },
    { label: "Vendor Performance", icon: TrendingDown },
    { label: "Category Analysis", icon: Package },
  ];

  // KPIs
  const totalClaims = data.claims.length;
  const openClaims = data.claims.filter(c => ["submitted", "under_review", "approved", "in_repair"].includes(c.status)).length;
  const resolvedClaims = data.claims.filter(c => ["replaced", "refunded"].includes(c.status)).length;
  const totalCost = data.claims.reduce((s, c) => s + (c.actualCost || 0), 0);
  const avgResolution = data.claims.filter(c => c.resolutionTime).length > 0
    ? (data.claims.filter(c => c.resolutionTime).reduce((s, c) => s + (c.resolutionTime || 0), 0) / data.claims.filter(c => c.resolutionTime).length).toFixed(1)
    : "0";
  const criticalClaims = data.claims.filter(c => c.priority === "critical").length;

  const kpis = [
    { label: "Total Claims", value: formatNumber(totalClaims), change: "+9.5%", up: true, icon: ShieldQuestion, color: THEME.primary },
    { label: "Open Claims", value: formatNumber(openClaims), change: "-4.2%", up: false, icon: Clock, color: "#f59e0b" },
    { label: "Resolved", value: formatNumber(resolvedClaims), change: "+12.8%", up: true, icon: CheckCircle2, color: THEME.accent },
    { label: "Total Cost", value: formatINR(totalCost), change: "+6.3%", up: true, icon: IndianRupee, color: THEME.primary },
    { label: "Avg Resolution", value: `${avgResolution} days`, change: "-1.5 days", up: false, icon: Calendar, color: "#06b6d4" },
    { label: "Critical Claims", value: formatNumber(criticalClaims), change: "-8.1%", up: false, icon: AlertTriangle, color: THEME.danger },
  ];

  // Status Pie
  const statusPieData = Object.entries(statusConfig).map(([k, v]) => ({
    name: v.label,
    value: data.claims.filter(c => c.status === k).length,
  }));

  // Warranty type Pie
  const warrantyTypePie = Object.entries(warrantyTypeConfig).map(([k, v]) => ({
    name: v.label,
    value: data.claims.filter(c => c.warrantyType === k).length,
  }));

  // Priority Pie
  const priorityPie = Object.entries(priorityConfig).map(([k, v]) => ({
    name: v.label,
    value: data.claims.filter(c => c.priority === k).length,
  }));

  // Alerts
  const alerts = [
    { title: "Critical Backlog", desc: "12 critical claims pending >5 days", severity: "critical" as const },
    { title: "Vendor Escalation", desc: "Samsung India escalation rate at 14%", severity: "warning" as const },
    { title: "Warranty Expiry Batch", desc: "85 warranties expiring in next 7 days", severity: "warning" as const },
    { title: "High Replacement Rate", desc: "Mobile phones 30% replacement vs 15% repair", severity: "info" as const },
    { title: "Cost Spike", desc: "AC warranty costs up 22% this month", severity: "warning" as const },
    { title: "SLA Achievement", desc: "94.2% claims resolved within SLA window", severity: "info" as const },
  ];

  // Tab 2: Filtered claims
  const filteredClaims = useMemo(() => {
    return data.claims.filter(c => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.id.toLowerCase().includes(q) || c.orderId.toLowerCase().includes(q) ||
          c.customer.toLowerCase().includes(q) || c.product.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q) ||
          c.issue.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data.claims, statusFilter, searchQuery]);

  const uniqueStatuses = ["all", ...new Set(data.claims.map(c => c.status))] as const;
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: data.claims.length };
    data.claims.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return counts;
  }, [data.claims]);

  // Tab 3: Filtered policies
  const filteredPolicies = useMemo(() => {
    if (categoryFilter === "all") return data.policies;
    return data.policies.filter(p => p.category === categoryFilter);
  }, [data.policies, categoryFilter]);

  const handleViewClaim = useCallback((claim: WarrantyClaim) => {
    setSelectedClaim(claim);
    setDrawerOpen(true);
  }, []);

  return (
    <div className="wgm-container">
      {/* Tab Header */}
      <div className="wgm-tab-header">
        <div className="wgm-tab-nav">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button key={tab.label} className={`wgm-tab-btn ${activeTab === i ? "wgm-tab-active" : ""}`} onClick={() => setActiveTab(i)}>
                <Icon className="wgm-tab-icon" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="wgm-header-badge">
          <ShieldQuestion className="wgm-header-badge-icon" />
          <span>Warranty & Guarantee Management</span>
        </div>
      </div>

      {/* Tab 0: Dashboard */}
      {activeTab === 0 && (
        <div className="wgm-tab-content">
          <div className="wgm-kpi-grid">
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <div key={i} className="wgm-kpi-card">
                  <div className="wgm-kpi-top">
                    <span className="wgm-kpi-label">{kpi.label}</span>
                    <div className="wgm-kpi-icon-wrap" style={{ backgroundColor: kpi.color + "18" }}>
                      <Icon className="wgm-kpi-icon" style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <div className="wgm-kpi-value">{kpi.value}</div>
                  <div className={`wgm-kpi-change ${kpi.up ? "wgm-kpi-up" : "wgm-kpi-down"}`}>
                    {kpi.up ? <ArrowUpRight className="wgm-kpi-change-icon" /> : <ArrowDownRight className="wgm-kpi-change-icon" />}
                    {kpi.change} vs last month
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row 1 */}
          <div className="wgm-chart-row">
            <div className="wgm-chart-card wgm-chart-wide">
              <h3 className="wgm-chart-title">Monthly Claims & Resolution Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="claims" name="Claims Filed" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar yAxisId="left" dataKey="resolved" name="Resolved" fill={THEME.accent} radius={[4, 4, 0, 0]} barSize={16} />
                  <Line yAxisId="right" dataKey="approvalRate" name="Approval Rate %" stroke={THEME.secondary} strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="wgm-chart-card wgm-chart-narrow">
              <h3 className="wgm-chart-title">Claim Status Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {statusPieData.map((_entry, index) => (
                      <Cell key={`s-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="wgm-chart-row">
            <div className="wgm-chart-card wgm-chart-narrow">
              <h3 className="wgm-chart-title">Warranty Type Split</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={warrantyTypePie} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {warrantyTypePie.map((_entry, index) => (
                      <Cell key={`wt-${index}`} fill={[THEME.primary, THEME.secondary, THEME.accent, "#06b6d4"][index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="wgm-chart-card wgm-chart-narrow">
              <h3 className="wgm-chart-title">Priority Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={priorityPie} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {priorityPie.map((_entry, index) => (
                      <Cell key={`p-${index}`} fill={["#94a3b8", "#3b82f6", THEME.secondary, THEME.danger][index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="wgm-chart-card wgm-chart-wide">
              <h3 className="wgm-chart-title">Monthly Cost & Avg Resolution Days</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}d`} />
                  <Tooltip formatter={(value: number, name: string) => name === "avgCost" ? formatINR(value) : `${value} days`} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avgCost" name="Avg Cost" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={18} opacity={0.8} />
                  <Line yAxisId="right" dataKey="avgResolutionDays" name="Avg Resolution Days" stroke={THEME.danger} strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="wgm-alerts-section">
            <h3 className="wgm-section-title"><AlertTriangle className="wgm-section-title-icon" /> Warranty Alerts & Notifications</h3>
            <div className="wgm-alerts-grid">
              {alerts.map((alert, i) => (
                <div key={i} className={`wgm-alert-card wgm-alert-${alert.severity}`}>
                  <div className="wgm-alert-header">
                    <AlertTriangle className="wgm-alert-icon" />
                    <span className="wgm-alert-title">{alert.title}</span>
                  </div>
                  <p className="wgm-alert-desc">{alert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Claims Queue */}
      {activeTab === 1 && (
        <div className="wgm-tab-content">
          <div className="wgm-table-toolbar">
            <div className="wgm-filter-bar">
              {uniqueStatuses.map(s => {
                const cfg = s !== "all" ? statusConfig[s as WarrantyClaim["status"]] : null;
                return (
                  <button key={s} className={`wgm-filter-btn ${statusFilter === s ? "wgm-filter-active" : ""}`} onClick={() => setStatusFilter(s)}>
                    {s === "all" ? "All" : cfg?.label || s}
                    <span className="wgm-filter-count">{statusCounts[s] || 0}</span>
                  </button>
                );
              })}
            </div>
            <div className="wgm-search-box">
              <Search className="wgm-search-icon" />
              <input type="text" placeholder="Search by ID, customer, product, vendor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="wgm-search-input" />
            </div>
          </div>

          <div className="wgm-table-wrap">
            <table className="wgm-table">
              <thead>
                <tr className="wgm-table-head">
                  <th>Claim ID / Order</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Warranty Type</th>
                  <th>Priority</th>
                  <th>Est. Cost (₹)</th>
                  <th>Status</th>
                  <th>Engineer</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.slice(0, 30).map((claim, i) => {
                  const sc = statusConfig[claim.status];
                  const pc = priorityConfig[claim.priority];
                  const wc = warrantyTypeConfig[claim.warrantyType];
                  return (
                    <tr key={claim.id} className={`wgm-table-row ${i % 2 === 0 ? "wgm-row-even" : "wgm-row-odd"}`}>
                      <td>
                        <div className="wgm-cell-id">{claim.id}</div>
                        <div className="wgm-cell-sub">{claim.orderId}</div>
                      </td>
                      <td>
                        <div className="wgm-cell-name">{claim.customer}</div>
                        <div className="wgm-cell-phone">{claim.city}</div>
                      </td>
                      <td className="wgm-cell-product">{claim.product}</td>
                      <td><span className="wgm-category-badge">{claim.category}</span></td>
                      <td><span className="wgm-vendor-badge">{claim.vendor}</span></td>
                      <td><span className={`wgm-status-badge ${wc.bg} ${wc.color}`}>{wc.label}</span></td>
                      <td><span className={`wgm-status-badge ${pc.bg} ${pc.color}`}>{pc.label}</span></td>
                      <td className="wgm-cell-amount">{claim.estimatedCost ? `₹${claim.estimatedCost.toLocaleString("en-IN")}` : "—"}</td>
                      <td><span className={`wgm-status-badge ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                      <td className="wgm-cell-center">{claim.assignedEngineer || "—"}</td>
                      <td>
                        <button className="wgm-action-btn" onClick={() => handleViewClaim(claim)}>
                          <Eye className="wgm-action-icon" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="wgm-table-footer">Showing {Math.min(30, filteredClaims.length)} of {filteredClaims.length} warranty claims</div>
        </div>
      )}

      {/* Tab 2: Warranty Policies */}
      {activeTab === 2 && (
        <div className="wgm-tab-content">
          <div className="wgm-policies-header">
            <div className="wgm-filter-bar">
              {data.policies.length > 0 && (["all", ...Array.from(new Set(data.policies.map(p => p.category)))].map(c => (
                <button key={c} className={`wgm-filter-btn ${categoryFilter === c ? "wgm-filter-active" : ""}`} onClick={() => setCategoryFilter(c)}>
                  {c === "all" ? "All Categories" : c}
                </button>
              )))}
            </div>
          </div>

          <div className="wgm-policies-grid">
            {filteredPolicies.map((policy, i) => (
              <div key={policy.id} className="wgm-policy-card">
                <div className="wgm-policy-card-header">
                  <div className="wgm-policy-id">{policy.id}</div>
                  <span className="wgm-category-badge">{policy.category}</span>
                </div>
                <div className="wgm-policy-name">{policy.productName}</div>
                <div className="wgm-policy-details">
                  <div className="wgm-policy-field">
                    <span className="wgm-policy-label">Standard Warranty</span>
                    <span className="wgm-policy-value">{policy.warrantyMonths} months</span>
                  </div>
                  <div className="wgm-policy-field">
                    <span className="wgm-policy-label">Extended Warranty</span>
                    <span className="wgm-policy-value">{policy.extendedMonths} months</span>
                  </div>
                  <div className="wgm-policy-field">
                    <span className="wgm-policy-label">Deductible</span>
                    <span className="wgm-policy-value">{policy.deductiblePct}%</span>
                  </div>
                </div>
                <div className="wgm-policy-coverage">
                  <div className="wgm-policy-section-label">Coverage</div>
                  <div className="wgm-policy-tags">
                    {policy.coverage.map((c, j) => (
                      <span key={j} className="wgm-tag wgm-tag-green">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="wgm-policy-exclusions">
                  <div className="wgm-policy-section-label">Exclusions</div>
                  <div className="wgm-policy-tags">
                    {policy.exclusions.map((e, j) => (
                      <span key={j} className="wgm-tag wgm-tag-red">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Vendor Performance */}
      {activeTab === 3 && (
        <div className="wgm-tab-content">
          <div className="wgm-chart-row">
            <div className="wgm-chart-card wgm-chart-wide">
              <h3 className="wgm-chart-title">Vendor Performance: Approval Rate & Escalation Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.vendorPerf} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <YAxis dataKey="vendor" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="approvalRate" name="Approval Rate" fill={THEME.accent} radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="escalationRate" name="Escalation Rate" fill={THEME.danger} radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="wgm-chart-card wgm-chart-narrow">
              <h3 className="wgm-chart-title">Vendor Claims Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.vendorPerf.map(v => ({ name: v.vendor, value: v.totalClaims }))} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {data.vendorPerf.map((_entry, index) => (
                      <Cell key={`v-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="wgm-chart-card wgm-chart-full">
            <h3 className="wgm-chart-title">Vendor Performance Scorecard</h3>
            <div className="wgm-table-wrap">
              <table className="wgm-table">
                <thead>
                  <tr className="wgm-table-head">
                    <th>Vendor</th>
                    <th>Total Claims</th>
                    <th>Approval Rate</th>
                    <th>Avg Resolution (days)</th>
                    <th>Avg Cost (₹)</th>
                    <th>Customer Satisfaction</th>
                    <th>Escalation Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.vendorPerf.map((v, i) => (
                    <tr key={v.vendor} className={`wgm-table-row ${i % 2 === 0 ? "wgm-row-even" : "wgm-row-odd"}`}>
                      <td><span className="wgm-vendor-badge">{v.vendor}</span></td>
                      <td className="wgm-cell-center">{formatNumber(v.totalClaims)}</td>
                      <td className="wgm-cell-center">{v.approvalRate}%</td>
                      <td className={`wgm-cell-center ${v.avgResolutionDays > 7 ? "wgm-cell-danger" : ""}`}>{v.avgResolutionDays} days</td>
                      <td className="wgm-cell-amount">₹{formatNumber(v.avgCost)}</td>
                      <td className="wgm-cell-center">
                        <div className="wgm-star-display">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <span key={s} className={`wgm-star ${s < Math.floor(v.customerSatisfaction) ? "wgm-star-filled" : "wgm-star-empty"}`}>&#9733;</span>
                          ))}
                          <span className="wgm-star-value">{v.customerSatisfaction}</span>
                        </div>
                      </td>
                      <td className={`wgm-cell-center ${v.escalationRate > 10 ? "wgm-cell-danger" : ""}`}>{v.escalationRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Category Analysis */}
      {activeTab === 4 && (
        <div className="wgm-tab-content">
          <div className="wgm-chart-row">
            <div className="wgm-chart-card wgm-chart-wide">
              <h3 className="wgm-chart-title">Category-wise Claims & Avg Resolution Cost</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data.categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={60} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="totalClaims" name="Total Claims" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={14} />
                  <Line yAxisId="right" dataKey="avgCost" name="Avg Cost" stroke={THEME.secondary} strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="wgm-chart-card wgm-chart-narrow">
              <h3 className="wgm-chart-title">Category Approval Rate Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data.categoryBreakdown.slice(0, 6).map(c => ({ category: c.category, approval: c.approvalRate, resolution: Math.max(0, 10 - c.avgResolutionDays) }))}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Approval %" dataKey="approval" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.2} />
                  <Radar name="Speed Score" dataKey="resolution" stroke={THEME.accent} fill={THEME.accent} fillOpacity={0.15} />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="wgm-chart-card wgm-chart-full">
            <h3 className="wgm-chart-title">Category Breakdown Details</h3>
            <div className="wgm-table-wrap">
              <table className="wgm-table">
                <thead>
                  <tr className="wgm-table-head">
                    <th>Category</th>
                    <th>Total Claims</th>
                    <th>Avg Cost (₹)</th>
                    <th>Approval Rate</th>
                    <th>Avg Resolution (days)</th>
                    <th>Top Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categoryBreakdown.map((c, i) => (
                    <tr key={c.category} className={`wgm-table-row ${i % 2 === 0 ? "wgm-row-even" : "wgm-row-odd"}`}>
                      <td><span className="wgm-category-badge">{c.category}</span></td>
                      <td className="wgm-cell-center">{formatNumber(c.totalClaims)}</td>
                      <td className="wgm-cell-amount">₹{formatNumber(c.avgCost)}</td>
                      <td className="wgm-cell-center">{c.approvalRate}%</td>
                      <td className={`wgm-cell-center ${c.avgResolutionDays > 8 ? "wgm-cell-danger" : ""}`}>{c.avgResolutionDays} days</td>
                      <td className="wgm-cell-issue">{c.topIssue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Claim Detail Drawer */}
      {drawerOpen && selectedClaim && (
        <div className="wgm-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="wgm-drawer" onClick={(e) => e.stopPropagation()}>
            <div className={`wgm-drawer-header wgm-drawer-header-${["replaced", "refunded"].includes(selectedClaim.status) ? "resolved" : selectedClaim.status === "rejected" || selectedClaim.status === "expired" ? "closed" : "open"}`}>
              <div className="wgm-drawer-header-top">
                <h2 className="wgm-drawer-title">{selectedClaim.id}</h2>
                <button className="wgm-drawer-close" onClick={() => setDrawerOpen(false)}>&times;</button>
              </div>
              <div className="wgm-drawer-badges">
                <span className={`wgm-status-badge ${statusConfig[selectedClaim.status].bg} ${statusConfig[selectedClaim.status].color}`}>{statusConfig[selectedClaim.status].label}</span>
                <span className={`wgm-status-badge ${priorityConfig[selectedClaim.priority].bg} ${priorityConfig[selectedClaim.priority].color}`}>{priorityConfig[selectedClaim.priority].label}</span>
                <span className={`wgm-status-badge ${warrantyTypeConfig[selectedClaim.warrantyType].bg} ${warrantyTypeConfig[selectedClaim.warrantyType].color}`}>{warrantyTypeConfig[selectedClaim.warrantyType].label}</span>
              </div>
            </div>

            <div className="wgm-drawer-body">
              {/* Customer & Product */}
              <div className="wgm-drawer-section">
                <h4 className="wgm-drawer-section-title">Customer & Product</h4>
                <div className="wgm-drawer-grid">
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Customer</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.customer}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Phone</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.phone}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">City</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.city}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Product</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.product}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">SKU</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.sku}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Order ID</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.orderId}</span>
                  </div>
                </div>
              </div>

              {/* Warranty Info */}
              <div className="wgm-drawer-section">
                <h4 className="wgm-drawer-section-title">Warranty Information</h4>
                <div className="wgm-drawer-grid">
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Vendor</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.vendor}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Category</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.category}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Warranty Start</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.warrantyStart}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Warranty End</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.warrantyEnd}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Purchase Date</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.purchaseDate}</span>
                  </div>
                  <div className="wgm-drawer-field">
                    <span className="wgm-drawer-field-label">Issue Date</span>
                    <span className="wgm-drawer-field-value">{selectedClaim.issueDate}</span>
                  </div>
                </div>
              </div>

              {/* Issue */}
              <div className="wgm-drawer-section">
                <h4 className="wgm-drawer-section-title">Issue Details</h4>
                <div className="wgm-issue-card">
                  <AlertTriangle className="wgm-issue-icon" />
                  <span className="wgm-issue-text">{selectedClaim.issue}</span>
                </div>
              </div>

              {/* Cost */}
              {(selectedClaim.estimatedCost || selectedClaim.actualCost) && (
                <div className="wgm-drawer-section">
                  <h4 className="wgm-drawer-section-title">Cost Analysis</h4>
                  <div className="wgm-cost-grid">
                    {selectedClaim.estimatedCost && (
                      <div className="wgm-cost-item">
                        <span className="wgm-cost-label">Estimated Cost</span>
                        <span className="wgm-cost-value">₹{selectedClaim.estimatedCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {selectedClaim.actualCost && (
                      <div className="wgm-cost-item wgm-cost-item-actual">
                        <span className="wgm-cost-label">Actual Cost</span>
                        <span className="wgm-cost-value">₹{selectedClaim.actualCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {selectedClaim.estimatedCost && selectedClaim.actualCost && (
                      <div className="wgm-cost-item">
                        <span className="wgm-cost-label">Variance</span>
                        <span className={`wgm-cost-value ${Math.abs(selectedClaim.actualCost - selectedClaim.estimatedCost) > 2000 ? "wgm-cost-danger" : "wgm-cost-savings"}`}>
                          {selectedClaim.actualCost < selectedClaim.estimatedCost ? "Saved" : "Over"} ₹{Math.abs(selectedClaim.actualCost - selectedClaim.estimatedCost).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="wgm-drawer-section">
                <h4 className="wgm-drawer-section-title">Claim Timeline</h4>
                <div className="wgm-drawer-timeline">
                  <div className={`wgm-timeline-step ${selectedClaim.status !== "submitted" ? "wgm-timeline-done" : "wgm-timeline-pending"}`}>
                    <div className="wgm-timeline-dot" /><span>Submitted</span>
                    <span className="wgm-timeline-date">{selectedClaim.issueDate}</span>
                  </div>
                  <div className={`wgm-timeline-step ${["approved", "rejected", "in_repair", "replaced", "refunded"].includes(selectedClaim.status) ? "wgm-timeline-done" : "wgm-timeline-pending"}`}>
                    <div className="wgm-timeline-dot" /><span>Review Complete</span>
                  </div>
                  <div className={`wgm-timeline-step ${["replaced", "refunded"].includes(selectedClaim.status) ? "wgm-timeline-done" : selectedClaim.status === "rejected" ? "wgm-timeline-rejected" : "wgm-timeline-pending"}`}>
                    <div className="wgm-timeline-dot" /><span>{selectedClaim.resolution || "Pending Resolution"}</span>
                  </div>
                </div>
              </div>

              {/* Resolution */}
              {selectedClaim.resolution && (
                <div className="wgm-drawer-section">
                  <h4 className="wgm-drawer-section-title">Resolution</h4>
                  <div className="wgm-resolution-card">
                    <CheckCircle2 className="wgm-resolution-icon" />
                    <div>
                      <span className="wgm-resolution-text">{selectedClaim.resolution}</span>
                      {selectedClaim.resolutionTime && <span className="wgm-resolution-time">Resolved in {selectedClaim.resolutionTime} days</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Engineer */}
              {selectedClaim.assignedEngineer && (
                <div className="wgm-drawer-section">
                  <h4 className="wgm-drawer-section-title">Assigned Engineer</h4>
                  <div className="wgm-engineer-card">
                    <div className="wgm-engineer-avatar">{selectedClaim.assignedEngineer.split(" ").map(n => n[0]).join("")}</div>
                    <div>
                      <span className="wgm-engineer-name">{selectedClaim.assignedEngineer}</span>
                      <span className="wgm-engineer-role">Service Engineer</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="wgm-drawer-actions">
                {["submitted", "under_review"].includes(selectedClaim.status) && (
                  <button className="wgm-btn wgm-btn-primary"><CheckCircle2 className="wgm-btn-icon" /> Approve Claim</button>
                )}
                {selectedClaim.status === "approved" && (
                  <button className="wgm-btn wgm-btn-primary"><Wrench className="wgm-btn-icon" /> Initiate Repair</button>
                )}
                <button className="wgm-btn wgm-btn-secondary"><RefreshCw className="wgm-btn-icon" /> Escalate to Vendor</button>
                <button className="wgm-btn wgm-btn-secondary"><FileText className="wgm-btn-icon" /> Generate Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
