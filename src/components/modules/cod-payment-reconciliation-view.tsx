"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Banknote, ArrowUpRight, ArrowDownRight,
  CheckCircle2, XCircle, AlertTriangle, Truck,
  IndianRupee, RefreshCw, BarChart3,
  Eye, Search, Receipt, Undo2, MapPin,
} from "lucide-react";
// ============================================================================
// Types
// ============================================================================
interface CODOrder {
  id: string;
  orderId: string;
  customer: string;
  city: string;
  phone: string;
  platform: string;
  courier: string;
  amount: number;
  status: "pending" | "out_for_delivery" | "delivered" | "confirmed" | "rto_initiated" | "rto_completed" | "cancelled";
  rtoReason?: string;
  paymentCollected: boolean;
  depositDate?: string;
  depositRef?: string;
  reconciliationStatus: "matched" | "mismatch" | "pending" | "overdue";
  orderDate: string;
  deliveryDate?: string;
  codCharge: number;
  forwardingCharge: number;
  attemptedDelivery: number;
}

interface ReconciliationRecord {
  id: string;
  period: string;
  totalCOD: number;
  totalPrepaid: number;
  collectedAmount: number;
  depositedAmount: number;
  diffAmount: number;
  status: "reconciled" | "partial" | "pending" | "disputed";
  courier: string;
}

interface CourierCODPerformance {
  courier: string;
  totalOrders: number;
  codOrders: number;
  codPct: number;
  delivered: number;
  rtoRate: number;
  avgCollectionTime: number;
  confirmationRate: number;
  collectionEfficiency: number;
}

// ============================================================================
// Seeded Data Generation
// ============================================================================
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateData() {
  const rand = seededRandom(156156);

  const cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Kolkata", "Pune", "Jaipur", "Lucknow", "Ahmedabad"];
  const states = ["Maharashtra", "Delhi NCR", "Karnataka", "Tamil Nadu", "Telangana", "West Bengal", "Maharashtra", "Rajasthan", "Uttar Pradesh", "Gujarat"];
  const platforms = ["Amazon", "Flipkart", "Myntra", "Meesho", "Ajio", "Nykaa", "Snapdeal", "Croma", "Tata CLiQ", "ShopClues"];
  const couriers = ["Delhivery", "BlueDart", "DTDC", "Ecom Express", "XpressBees", "Shadowfax", "Ekart", "Amazon Shipping", "DTDC Express", "Gati"];
  const customers = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sunita Devi", "Rajesh Gupta", "Neha Singh", "Vikram Joshi", "Kavita Reddy", "Manish Agarwal", "Deepa Nair", "Suresh Menon", "Anita Desai", "Prakash Iyer", "Ritu Malhotra", "Arjun Verma"];
  const rtoReasons = ["Customer Refused", "Address Incomplete", "Customer Unavailable", "Customer Requested Cancellation", "Wrong Address", "Phone Not Reachable", "Damaged in Transit", "Customer Not Interested", "Area Not Serviceable", "Consignee Moved"];
  const statuses: Array<CODOrder["status"]> = ["pending", "out_for_delivery", "delivered", "confirmed", "rto_initiated", "rto_completed", "cancelled"];

  const statusWeights = [0.05, 0.08, 0.22, 0.35, 0.12, 0.13, 0.05];
  const reconStatuses: Array<CODOrder["reconciliationStatus"]> = ["matched", "mismatch", "pending", "overdue"];
  const reconWeights = [0.55, 0.08, 0.25, 0.12];

  const orders: CODOrder[] = [];
  for (let i = 0; i < 350; i++) {
    const r = rand();
    let cumW = 0;
    let status: CODOrder["status"] = "confirmed";
    for (let j = 0; j < statuses.length; j++) {
      cumW += statusWeights[j];
      if (r < cumW) { status = statuses[j]; break; }
    }

    const r2 = rand();
    cumW = 0;
    let reconStatus: CODOrder["reconciliationStatus"] = "matched";
    for (let j = 0; j < reconStatuses.length; j++) {
      cumW += reconWeights[j];
      if (r2 < cumW) { reconStatus = reconStatuses[j]; break; }
    }

    const ci = Math.floor(rand() * cities.length);
    const amount = Math.round((rand() * 14500 + 250) * 100) / 100;
    const isRTO = status === "rto_initiated" || status === "rto_completed";
    const month = Math.floor(rand() * 12) + 1;
    const day = Math.floor(rand() * 28) + 1;

    orders.push({
      id: `COD-${String(i + 1001).padStart(4, "0")}`,
      orderId: `ORD-${String(2024000 + i).padStart(7, "0")}`,
      customer: customers[Math.floor(rand() * customers.length)],
      city: cities[ci],
      phone: String(7000000000 + Math.floor(rand() * 3000000000)),
      platform: platforms[Math.floor(rand() * platforms.length)],
      courier: couriers[Math.floor(rand() * couriers.length)],
      amount,
      status,
      rtoReason: isRTO ? rtoReasons[Math.floor(rand() * rtoReasons.length)] : undefined,
      paymentCollected: ["delivered", "confirmed"].includes(status),
      depositDate: status === "confirmed" ? `2024-${String(month).padStart(2, "0")}-${String(Math.min(day + 3, 28)).padStart(2, "0")}` : undefined,
      depositRef: status === "confirmed" ? `DEP-${String(Math.floor(rand() * 90000) + 10000)}` : undefined,
      reconciliationStatus: reconStatus,
      orderDate: `2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      deliveryDate: ["delivered", "confirmed"].includes(status) ? `2024-${String(Math.min(month + 1, 12)).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}` : undefined,
      codCharge: Math.round(amount * 0.02 * 100) / 100,
      forwardingCharge: Math.round(amount * 0.015 * 100) / 100,
      attemptedDelivery: isRTO ? Math.floor(rand() * 3) + 1 : Math.floor(rand() * 2) + 1,
    });
  }

  // Monthly summary
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyCOD: Array<{ month: string; codOrders: number; prepaidOrders: number; codAmount: number; prepaidAmount: number; rtoCount: number; rtoLoss: number; collectionRate: number }> = [];
  let cumAmount = 0;
  months.forEach((m, i) => {
    const cod = Math.floor(rand() * 800 + 1200);
    const prepaid = Math.floor(rand() * 500 + 600);
    const codAmt = Math.round(rand() * 8000000 + 12000000);
    const prepAmt = Math.round(rand() * 3000000 + 4000000);
    const rto = Math.floor(rand() * 180 + 120);
    const rtoLoss = Math.round(rand() * 500000 + 800000);
    cumAmount += (rand() * 3 + 60);
    monthlyCOD.push({
      month: m,
      codOrders: cod,
      prepaidOrders: prepaid,
      codAmount: codAmt,
      prepaidAmount: prepAmt,
      rtoCount: rto,
      rtoLoss,
      collectionRate: Math.round(cumAmount * 10) / 10,
    });
  });

  // Reconciliation records
  const recons: ReconciliationRecord[] = [];
  for (let i = 0; i < 40; i++) {
    const totalCOD = Math.round(rand() * 4000000 + 2000000);
    const totalPrepaid = Math.round(rand() * 1500000 + 800000);
    const collected = Math.round(totalCOD * (0.85 + rand() * 0.15));
    const deposited = Math.round(collected * (0.9 + rand() * 0.1));
    const diff = collected - deposited;
    const r = rand();
    recons.push({
      id: `REC-${String(i + 5001).padStart(4, "0")}`,
      period: `Week ${i % 4 + 1} - ${months[Math.floor(i / 4) % 12]} 2024`,
      totalCOD,
      totalPrepaid,
      collectedAmount: collected,
      depositedAmount: deposited,
      diffAmount: diff,
      status: r < 0.55 ? "reconciled" : r < 0.65 ? "partial" : r < 0.85 ? "pending" : "disputed",
      courier: couriers[Math.floor(rand() * couriers.length)],
    });
  }

  // Courier performance
  const courierPerf: CourierCODPerformance[] = couriers.map(c => {
    const total = Math.floor(rand() * 5000 + 2000);
    const cod = Math.floor(total * (0.55 + rand() * 0.25));
    return {
      courier: c,
      totalOrders: total,
      codOrders: cod,
      codPct: Math.round(cod / total * 1000) / 10,
      delivered: Math.floor(cod * (0.6 + rand() * 0.3)),
      rtoRate: Math.round((rand() * 15 + 5) * 10) / 10,
      avgCollectionTime: Math.round(rand() * 48 + 12),
      confirmationRate: Math.round((rand() * 20 + 70) * 10) / 10,
      collectionEfficiency: Math.round((rand() * 15 + 80) * 10) / 10,
    };
  });

  // City-wise breakdown
  const cityBreakdown = cities.map((c, i) => ({
    city: c,
    state: states[i],
    codOrders: Math.floor(rand() * 2000 + 800),
    avgOrderValue: Math.round(rand() * 8000 + 1500),
    rtoRate: Math.round((rand() * 18 + 4) * 10) / 10,
    codShare: Math.round((rand() * 30 + 45) * 10) / 10,
    collectionRate: Math.round((rand() * 20 + 70) * 10) / 10,
    avgDeliveryDays: Math.round((rand() * 4 + 2) * 10) / 10,
  }));

  // Platform-wise COD
  const platformCOD = platforms.map(p => ({
    platform: p,
    codOrders: Math.floor(rand() * 3000 + 500),
    codRevenue: Math.round(rand() * 10000000 + 2000000),
    rtoRate: Math.round((rand() * 15 + 5) * 10) / 10,
    avgCODValue: Math.round(rand() * 6000 + 1000),
    confirmationRate: Math.round((rand() * 25 + 65) * 10) / 10,
  }));

  return { orders, monthlyCOD, recons, courierPerf, cityBreakdown, platformCOD };
}

// ============================================================================
// Theme
// ============================================================================
const THEME = {
  primary: "#6366f1",   // Indigo
  secondary: "#f59e0b",  // Amber
  accent: "#10b981",     // Emerald
  danger: "#ef4444",     // Red
  muted: "#64748b",      // Slate
};

const PIE_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899", "#14b8a6", "#84cc16"];

// ============================================================================
// Formatters
// ============================================================================
function formatINR(amount: number): string {
  if (amount >= 10000000) return "₹" + (amount / 10000000).toFixed(2) + " Cr";
  if (amount >= 100000) return "₹" + (amount / 100000).toFixed(2) + " L";
  if (amount >= 1000) return "₹" + (amount / 1000).toFixed(1) + "K";
  return "₹" + amount.toFixed(0);
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

const statusConfig: Record<CODOrder["status"], { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800" },
  out_for_delivery: { label: "Out for Delivery", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  delivered: { label: "Delivered", color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
  confirmed: { label: "Confirmed", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  rto_initiated: { label: "RTO Initiated", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  rto_completed: { label: "RTO Completed", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  cancelled: { label: "Cancelled", color: "text-gray-700 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-800" },
};

const reconConfig: Record<CODOrder["reconciliationStatus"], { label: string; color: string; bg: string }> = {
  matched: { label: "Matched", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  mismatch: { label: "Mismatch", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  pending: { label: "Pending", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  overdue: { label: "Overdue", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/40" },
};

const reconRecConfig: Record<ReconciliationRecord["status"], { label: string; color: string; bg: string }> = {
  reconciled: { label: "Reconciled", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  partial: { label: "Partial", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  pending: { label: "Pending", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  disputed: { label: "Disputed", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
};

// ============================================================================
// Main Component
// ============================================================================
export default function CODPaymentReconciliationView() {
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<CODOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reconFilter, setReconFilter] = useState<string>("all");

  const data = useMemo(() => generateData(), []);

  const tabs = [
    { label: "Dashboard", icon: BarChart3 },
    { label: "COD Orders", icon: Banknote },
    { label: "Reconciliation", icon: RefreshCw },
    { label: "Courier Analysis", icon: Truck },
    { label: "Regional Analytics", icon: MapPin },
  ];

  // ---- Tab 1: Dashboard KPIs ----
  const totalCODOrders = data.orders.length;
  const totalCODAmount = data.orders.reduce((s, o) => s + o.amount, 0);
  const confirmedOrders = data.orders.filter(o => o.status === "confirmed").length;
  const rtoOrders = data.orders.filter(o => ["rto_initiated", "rto_completed"].includes(o.status));
  const rtoLoss = rtoOrders.reduce((s, o) => s + o.amount, 0);
  const pendingCollection = data.orders.filter(o => ["out_for_delivery", "delivered"].includes(o.status) && !o.paymentCollected).length;
  const mismatchCount = data.orders.filter(o => o.reconciliationStatus === "mismatch" || o.reconciliationStatus === "overdue").length;

  const kpis = [
    { label: "Total COD Orders", value: formatNumber(totalCODOrders), change: "+12.3%", up: true, icon: Banknote, color: THEME.primary },
    { label: "COD Revenue", value: formatINR(totalCODAmount), change: "+8.7%", up: true, icon: IndianRupee, color: THEME.accent },
    { label: "Confirmed & Paid", value: formatNumber(confirmedOrders), change: "+15.1%", up: true, icon: CheckCircle2, color: "#22c55e" },
    { label: "RTO Count", value: formatNumber(rtoOrders.length), change: "-3.2%", up: false, icon: Undo2, color: THEME.danger },
    { label: "RTO Loss", value: formatINR(rtoLoss), change: "+2.1%", up: true, icon: XCircle, color: "#f97316" },
    { label: "Recon Issues", value: formatNumber(mismatchCount), change: "-18.5%", up: false, icon: AlertTriangle, color: THEME.secondary },
  ];

  // ---- Tab 2: Filtered COD Orders ----
  const filteredOrders = useMemo(() => {
    return data.orders.filter(o => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return o.id.toLowerCase().includes(q) || o.orderId.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) || o.city.toLowerCase().includes(q) ||
          o.platform.toLowerCase().includes(q) || o.courier.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data.orders, statusFilter, searchQuery]);

  const uniqueStatuses = ["all", ...new Set(data.orders.map(o => o.status))] as const;
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: data.orders.length };
    data.orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, [data.orders]);

  // ---- Tab 3: Reconciliation filtered ----
  const filteredRecons = useMemo(() => {
    if (reconFilter === "all") return data.recons;
    return data.recons.filter(r => r.status === reconFilter);
  }, [data.recons, reconFilter]);

  // ---- Tab 1 Charts data ----
  const codPrepaidPie = [
    { name: "COD Orders", value: totalCODOrders },
    { name: "Prepaid Orders", value: Math.floor(totalCODOrders * 0.52) },
  ];

  const statusPieData = Object.entries(statusConfig).map(([k, v]) => ({
    name: v.label,
    value: data.orders.filter(o => o.status === k).length,
  }));

  const alerts = [
    { title: "High RTO Zone: Kolkata", desc: "RTO rate exceeds 22% in Kolkata region", severity: "critical" as const },
    { title: "Collection Pending", desc: `${pendingCollection} payments awaiting confirmation`, severity: "warning" as const },
    { title: "Reconciliation Overdue", desc: "8 courier settlements past 7-day deadline", severity: "warning" as const },
    { title: "COD Spike Detected", desc: "Meesho COD orders up 34% this week", severity: "info" as const },
    { title: "Deposit Delay", desc: "Delhivery deposit pending for Week 3 - Jan", severity: "warning" as const },
    { title: "Cash Handling Alert", desc: "₹12.5L+ COD collected today at Mumbai hub", severity: "info" as const },
  ];

  const handleViewOrder = useCallback((order: CODOrder) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  }, []);

  return (
    <div className="cod-pr-container">
      {/* Tab Header */}
      <div className="cod-pr-tab-header">
        <div className="cod-pr-tab-nav">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                className={`cod-pr-tab-btn ${activeTab === i ? "cod-pr-tab-active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                <Icon className="cod-pr-tab-icon" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="cod-pr-header-badge">
          <Banknote className="cod-pr-header-badge-icon" />
          <span>COD & Payment Reconciliation</span>
        </div>
      </div>

      {/* Tab 0: Dashboard */}
      {activeTab === 0 && (
        <div className="cod-pr-tab-content">
          {/* KPIs */}
          <div className="cod-pr-kpi-grid">
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <div key={i} className="cod-pr-kpi-card">
                  <div className="cod-pr-kpi-top">
                    <span className="cod-pr-kpi-label">{kpi.label}</span>
                    <div className="cod-pr-kpi-icon-wrap" style={{ backgroundColor: kpi.color + "18" }}>
                      <Icon className="cod-pr-kpi-icon" style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <div className="cod-pr-kpi-value">{kpi.value}</div>
                  <div className={`cod-pr-kpi-change ${kpi.up ? "cod-pr-kpi-up" : "cod-pr-kpi-down"}`}>
                    {kpi.up ? <ArrowUpRight className="cod-pr-kpi-change-icon" /> : <ArrowDownRight className="cod-pr-kpi-change-icon" />}
                    {kpi.change} vs last month
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row 1 */}
          <div className="cod-pr-chart-row">
            <div className="cod-pr-chart-card cod-pr-chart-wide">
              <h3 className="cod-pr-chart-title">COD vs Prepaid Monthly Orders</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={data.monthlyCOD}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatNumber(v)} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "COD Share %") return `${value}%`;
                      return formatNumber(value);
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="codOrders" name="COD Orders" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar yAxisId="left" dataKey="prepaidOrders" name="Prepaid Orders" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={16} />
                  <Line yAxisId="right" dataKey="rtoCount" name="RTO Count" stroke={THEME.danger} strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="cod-pr-chart-card cod-pr-chart-narrow">
              <h3 className="cod-pr-chart-title">COD vs Prepaid Split</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={codPrepaidPie} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(1)}%`} labelLine={false}>
                    {codPrepaidPie.map((_entry, index) => (
                      <Cell key={`cod-pie-${index}`} fill={index === 0 ? THEME.primary : THEME.secondary} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="cod-pr-chart-row">
            <div className="cod-pr-chart-card cod-pr-chart-narrow">
              <h3 className="cod-pr-chart-title">Order Status Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {statusPieData.map((_entry, index) => (
                      <Cell key={`status-pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="cod-pr-chart-card cod-pr-chart-wide">
              <h3 className="cod-pr-chart-title">Monthly RTO Loss & Collection Rate</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={data.monthlyCOD}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip formatter={(value: number, name: string) => {
                    if (name === "Collection Rate") return `${value}%`;
                    return formatINR(value);
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="rtoLoss" name="RTO Loss" fill={THEME.danger} radius={[4, 4, 0, 0]} barSize={18} opacity={0.8} />
                  <Line yAxisId="right" dataKey="collectionRate" name="Collection Rate" stroke={THEME.accent} strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="cod-pr-alerts-section">
            <h3 className="cod-pr-section-title">
              <AlertTriangle className="cod-pr-section-title-icon" />
              Payment Alerts & Exceptions
            </h3>
            <div className="cod-pr-alerts-grid">
              {alerts.map((alert, i) => (
                <div key={i} className={`cod-pr-alert-card cod-pr-alert-${alert.severity}`}>
                  <div className="cod-pr-alert-header">
                    <AlertTriangle className="cod-pr-alert-icon" />
                    <span className="cod-pr-alert-title">{alert.title}</span>
                  </div>
                  <p className="cod-pr-alert-desc">{alert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: COD Orders */}
      {activeTab === 1 && (
        <div className="cod-pr-tab-content">
          <div className="cod-pr-table-toolbar">
            <div className="cod-pr-filter-bar">
              {uniqueStatuses.map(s => {
                const cfg = s !== "all" ? statusConfig[s as CODOrder["status"]] : null;
                return (
                  <button
                    key={s}
                    className={`cod-pr-filter-btn ${statusFilter === s ? "cod-pr-filter-active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === "all" ? "All" : cfg?.label || s}
                    <span className="cod-pr-filter-count">{statusCounts[s] || 0}</span>
                  </button>
                );
              })}
            </div>
            <div className="cod-pr-search-box">
              <Search className="cod-pr-search-icon" />
              <input
                type="text"
                placeholder="Search by ID, customer, city, platform, courier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cod-pr-search-input"
              />
            </div>
          </div>

          <div className="cod-pr-table-wrap">
            <table className="cod-pr-table">
              <thead>
                <tr className="cod-pr-table-head">
                  <th>COD ID / Order</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Platform</th>
                  <th>Courier</th>
                  <th>Amount (₹)</th>
                  <th>COD Charge</th>
                  <th>Status</th>
                  <th>Recon Status</th>
                  <th>Attempts</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 30).map((order, i) => {
                  const sc = statusConfig[order.status];
                  const rc = reconConfig[order.reconciliationStatus];
                  return (
                    <tr key={order.id} className={`cod-pr-table-row ${i % 2 === 0 ? "cod-pr-row-even" : "cod-pr-row-odd"}`}>
                      <td>
                        <div className="cod-pr-cell-id">{order.id}</div>
                        <div className="cod-pr-cell-sub">{order.orderId}</div>
                      </td>
                      <td>
                        <div className="cod-pr-cell-name">{order.customer}</div>
                        <div className="cod-pr-cell-phone">{order.phone}</div>
                      </td>
                      <td>
                        <div className="cod-pr-cell-city">{order.city}</div>
                      </td>
                      <td>
                        <span className="cod-pr-platform-badge">{order.platform}</span>
                      </td>
                      <td>
                        <span className="cod-pr-courier-badge">{order.courier}</span>
                      </td>
                      <td className="cod-pr-cell-amount">₹{order.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td className="cod-pr-cell-amount cod-pr-cell-secondary">₹{order.codCharge.toFixed(2)}</td>
                      <td>
                        <span className={`cod-pr-status-badge ${sc.bg} ${sc.color}`}>{sc.label}</span>
                      </td>
                      <td>
                        <span className={`cod-pr-status-badge ${rc.bg} ${rc.color}`}>{rc.label}</span>
                      </td>
                      <td className="cod-pr-cell-center">{order.attemptedDelivery}</td>
                      <td>
                        <button className="cod-pr-action-btn" onClick={() => handleViewOrder(order)}>
                          <Eye className="cod-pr-action-icon" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="cod-pr-table-footer">
            Showing {Math.min(30, filteredOrders.length)} of {filteredOrders.length} COD orders
          </div>
        </div>
      )}

      {/* Tab 2: Reconciliation */}
      {activeTab === 2 && (
        <div className="cod-pr-tab-content">
          {/* Reconciliation KPIs */}
          <div className="cod-pr-recon-summary">
            <div className="cod-pr-recon-kpi cod-pr-recon-kpi-green">
              <span className="cod-pr-recon-kpi-label">Total Reconciled</span>
              <span className="cod-pr-recon-kpi-value">{formatINR(data.recons.filter(r => r.status === "reconciled").reduce((s, r) => s + r.collectedAmount, 0))}</span>
            </div>
            <div className="cod-pr-recon-kpi cod-pr-recon-kpi-amber">
              <span className="cod-pr-recon-kpi-label">Pending Settlement</span>
              <span className="cod-pr-recon-kpi-value">{formatINR(data.recons.filter(r => r.status === "pending").reduce((s, r) => s + r.collectedAmount, 0))}</span>
            </div>
            <div className="cod-pr-recon-kpi cod-pr-recon-kpi-red">
              <span className="cod-pr-recon-kpi-label">Total Disputed</span>
              <span className="cod-pr-recon-kpi-value">{formatINR(data.recons.filter(r => r.status === "disputed").reduce((s, r) => s + r.diffAmount, 0))}</span>
            </div>
            <div className="cod-pr-recon-kpi cod-pr-recon-kpi-indigo">
              <span className="cod-pr-recon-kpi-label">Collection Efficiency</span>
              <span className="cod-pr-recon-kpi-value">91.4%</span>
            </div>
          </div>

          {/* Filter + Chart */}
          <div className="cod-pr-recon-filter">
            <div className="cod-pr-filter-bar">
              {(["all", "reconciled", "partial", "pending", "disputed"] as const).map(s => (
                <button
                  key={s}
                  className={`cod-pr-filter-btn ${reconFilter === s ? "cod-pr-filter-active" : ""}`}
                  onClick={() => setReconFilter(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="cod-pr-chart-row">
            <div className="cod-pr-chart-card cod-pr-chart-full">
              <h3 className="cod-pr-chart-title">Courier Settlement - Collected vs Deposited</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data.recons.slice(0, 20)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
                  <Tooltip formatter={(value: number) => formatINR(value)} />
                  <Legend />
                  <Bar dataKey="collectedAmount" name="Collected" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="depositedAmount" name="Deposited" fill={THEME.accent} radius={[4, 4, 0, 0]} barSize={14} />
                  <Line dataKey="diffAmount" name="Difference" stroke={THEME.danger} strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reconciliation Table */}
          <div className="cod-pr-table-wrap">
            <table className="cod-pr-table">
              <thead>
                <tr className="cod-pr-table-head">
                  <th>Recon ID</th>
                  <th>Period</th>
                  <th>Courier</th>
                  <th>COD Total (₹)</th>
                  <th>Collected (₹)</th>
                  <th>Deposited (₹)</th>
                  <th>Difference (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecons.map((rec, i) => {
                  const cfg = reconRecConfig[rec.status];
                  return (
                    <tr key={rec.id} className={`cod-pr-table-row ${i % 2 === 0 ? "cod-pr-row-even" : "cod-pr-row-odd"}`}>
                      <td className="cod-pr-cell-id">{rec.id}</td>
                      <td className="cod-pr-cell-sub">{rec.period}</td>
                      <td><span className="cod-pr-courier-badge">{rec.courier}</span></td>
                      <td className="cod-pr-cell-amount">₹{formatNumber(rec.totalCOD)}</td>
                      <td className="cod-pr-cell-amount">₹{formatNumber(rec.collectedAmount)}</td>
                      <td className="cod-pr-cell-amount">₹{formatNumber(rec.depositedAmount)}</td>
                      <td className={`cod-pr-cell-amount ${rec.diffAmount > 5000 ? "cod-pr-cell-danger" : ""}`}>₹{formatNumber(rec.diffAmount)}</td>
                      <td>
                        <span className={`cod-pr-status-badge ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="cod-pr-table-footer">
            Showing {filteredRecons.length} reconciliation records
          </div>
        </div>
      )}

      {/* Tab 3: Courier Analysis */}
      {activeTab === 3 && (
        <div className="cod-pr-tab-content">
          {/* Courier Performance Chart */}
          <div className="cod-pr-chart-row">
            <div className="cod-pr-chart-card cod-pr-chart-wide">
              <h3 className="cod-pr-chart-title">Courier COD Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.courierPerf} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="courier" type="category" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number, name: string) => {
                    if (["rtoRate", "codPct", "confirmationRate", "collectionEfficiency"].includes(name)) return `${value}%`;
                    return formatNumber(value);
                  }} />
                  <Legend />
                  <Bar dataKey="rtoRate" name="RTO Rate %" fill={THEME.danger} radius={[0, 4, 4, 0]} barSize={10} />
                  <Bar dataKey="confirmationRate" name="Confirmation %" fill={THEME.accent} radius={[0, 4, 4, 0]} barSize={10} />
                  <Bar dataKey="collectionEfficiency" name="Collection Eff. %" fill={THEME.primary} radius={[0, 4, 4, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="cod-pr-chart-card cod-pr-chart-narrow">
              <h3 className="cod-pr-chart-title">Courier COD Volume Share</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.courierPerf.map(c => ({ name: c.courier, value: c.codOrders }))} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {data.courierPerf.map((_entry, index) => (
                      <Cell key={`courier-pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Courier Performance Table */}
          <div className="cod-pr-chart-row">
            <div className="cod-pr-chart-card cod-pr-chart-full">
              <h3 className="cod-pr-chart-title">Courier Performance Scorecard</h3>
              <div className="cod-pr-table-wrap">
                <table className="cod-pr-table">
                  <thead>
                    <tr className="cod-pr-table-head">
                      <th>Courier</th>
                      <th>Total Orders</th>
                      <th>COD Orders</th>
                      <th>COD %</th>
                      <th>Delivered</th>
                      <th>RTO Rate</th>
                      <th>Avg Collection (hrs)</th>
                      <th>Confirmation Rate</th>
                      <th>Collection Eff.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.courierPerf.map((c, i) => (
                      <tr key={c.courier} className={`cod-pr-table-row ${i % 2 === 0 ? "cod-pr-row-even" : "cod-pr-row-odd"}`}>
                        <td><span className="cod-pr-courier-badge">{c.courier}</span></td>
                        <td className="cod-pr-cell-center">{formatNumber(c.totalOrders)}</td>
                        <td className="cod-pr-cell-center">{formatNumber(c.codOrders)}</td>
                        <td className="cod-pr-cell-center">{c.codPct}%</td>
                        <td className="cod-pr-cell-center">{formatNumber(c.delivered)}</td>
                        <td className={`cod-pr-cell-center ${c.rtoRate > 15 ? "cod-pr-cell-danger" : ""}`}>{c.rtoRate}%</td>
                        <td className="cod-pr-cell-center">{c.avgCollectionTime}h</td>
                        <td className="cod-pr-cell-center">{c.confirmationRate}%</td>
                        <td className="cod-pr-cell-center">
                          <div className="cod-pr-mini-bar">
                            <div className="cod-pr-mini-bar-fill" style={{ width: `${c.collectionEfficiency}%`, backgroundColor: c.collectionEfficiency >= 90 ? THEME.accent : c.collectionEfficiency >= 75 ? THEME.secondary : THEME.danger }} />
                            <span className="cod-pr-mini-bar-text">{c.collectionEfficiency}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Regional Analytics */}
      {activeTab === 4 && (
        <div className="cod-pr-tab-content">
          {/* City Charts */}
          <div className="cod-pr-chart-row">
            <div className="cod-pr-chart-card cod-pr-chart-wide">
              <h3 className="cod-pr-chart-title">City-wise COD Orders & RTO Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data.cityBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatNumber(v)} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="codOrders" name="COD Orders" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={16} />
                  <Line yAxisId="right" dataKey="rtoRate" name="RTO Rate %" stroke={THEME.danger} strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="cod-pr-chart-card cod-pr-chart-narrow">
              <h3 className="cod-pr-chart-title">COD Share by City</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.cityBreakdown.map(c => ({ name: c.city, value: c.codShare }))} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {data.cityBreakdown.map((_entry, index) => (
                      <Cell key={`city-pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform COD Chart */}
          <div className="cod-pr-chart-row">
            <div className="cod-pr-chart-card cod-pr-chart-wide">
              <h3 className="cod-pr-chart-title">Platform-wise COD Revenue & RTO Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data.platformCOD}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip formatter={(value: number, name: string) => {
                    if (name === "RTO Rate %") return `${value}%`;
                    return formatINR(value);
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="codRevenue" name="COD Revenue" fill={THEME.secondary} radius={[4, 4, 0, 0]} barSize={18} />
                  <Line yAxisId="right" dataKey="rtoRate" name="RTO Rate %" stroke={THEME.danger} strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="right" dataKey="confirmationRate" name="Confirmation %" stroke={THEME.accent} strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="cod-pr-chart-card cod-pr-chart-narrow">
              <h3 className="cod-pr-chart-title">Collection Rate Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data.cityBreakdown.slice(0, 6).map(c => ({ city: c.city, value: c.collectionRate, rto: 20 - c.rtoRate }))}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="city" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Collection %" dataKey="value" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.2} />
                  <Radar name="Inverse RTO" dataKey="rto" stroke={THEME.accent} fill={THEME.accent} fillOpacity={0.15} />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* City Detail Table */}
          <div className="cod-pr-chart-card cod-pr-chart-full">
            <h3 className="cod-pr-chart-title">City-wise COD Breakdown</h3>
            <div className="cod-pr-table-wrap">
              <table className="cod-pr-table">
                <thead>
                  <tr className="cod-pr-table-head">
                    <th>City</th>
                    <th>State</th>
                    <th>COD Orders</th>
                    <th>Avg Order Value (₹)</th>
                    <th>RTO Rate</th>
                    <th>COD Share</th>
                    <th>Collection Rate</th>
                    <th>Avg Delivery (days)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cityBreakdown.map((c, i) => (
                    <tr key={c.city} className={`cod-pr-table-row ${i % 2 === 0 ? "cod-pr-row-even" : "cod-pr-row-odd"}`}>
                      <td className="cod-pr-cell-name">{c.city}</td>
                      <td className="cod-pr-cell-sub">{c.state}</td>
                      <td className="cod-pr-cell-center">{formatNumber(c.codOrders)}</td>
                      <td className="cod-pr-cell-amount">₹{formatNumber(c.avgOrderValue)}</td>
                      <td className={`cod-pr-cell-center ${c.rtoRate > 15 ? "cod-pr-cell-danger" : ""}`}>{c.rtoRate}%</td>
                      <td className="cod-pr-cell-center">
                        <div className="cod-pr-mini-bar">
                          <div className="cod-pr-mini-bar-fill" style={{ width: `${c.codShare}%`, backgroundColor: THEME.primary }} />
                          <span className="cod-pr-mini-bar-text">{c.codShare}%</span>
                        </div>
                      </td>
                      <td className="cod-pr-cell-center">{c.collectionRate}%</td>
                      <td className="cod-pr-cell-center">{c.avgDeliveryDays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Drawer */}
      {drawerOpen && selectedOrder && (
        <div className="cod-pr-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="cod-pr-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className={`cod-pr-drawer-header cod-pr-drawer-header-${selectedOrder.status === "confirmed" ? "confirmed" : selectedOrder.status === "rto_completed" || selectedOrder.status === "rto_initiated" ? "rto" : "pending"}`}>
              <div className="cod-pr-drawer-header-top">
                <h2 className="cod-pr-drawer-title">{selectedOrder.id}</h2>
                <button className="cod-pr-drawer-close" onClick={() => setDrawerOpen(false)}>&times;</button>
              </div>
              <div className="cod-pr-drawer-badges">
                <span className={`cod-pr-status-badge ${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].color}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
                <span className={`cod-pr-status-badge ${reconConfig[selectedOrder.reconciliationStatus].bg} ${reconConfig[selectedOrder.reconciliationStatus].color}`}>
                  {reconConfig[selectedOrder.reconciliationStatus].label}
                </span>
                <span className="cod-pr-platform-badge">{selectedOrder.platform}</span>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="cod-pr-drawer-body">
              {/* Customer Info */}
              <div className="cod-pr-drawer-section">
                <h4 className="cod-pr-drawer-section-title">Customer & Order</h4>
                <div className="cod-pr-drawer-grid">
                  <div className="cod-pr-drawer-field">
                    <span className="cod-pr-drawer-field-label">Customer</span>
                    <span className="cod-pr-drawer-field-value">{selectedOrder.customer}</span>
                  </div>
                  <div className="cod-pr-drawer-field">
                    <span className="cod-pr-drawer-field-label">Phone</span>
                    <span className="cod-pr-drawer-field-value">{selectedOrder.phone}</span>
                  </div>
                  <div className="cod-pr-drawer-field">
                    <span className="cod-pr-drawer-field-label">City</span>
                    <span className="cod-pr-drawer-field-value">{selectedOrder.city}</span>
                  </div>
                  <div className="cod-pr-drawer-field">
                    <span className="cod-pr-drawer-field-label">Order ID</span>
                    <span className="cod-pr-drawer-field-value">{selectedOrder.orderId}</span>
                  </div>
                  <div className="cod-pr-drawer-field">
                    <span className="cod-pr-drawer-field-label">Courier</span>
                    <span className="cod-pr-drawer-field-value">{selectedOrder.courier}</span>
                  </div>
                  <div className="cod-pr-drawer-field">
                    <span className="cod-pr-drawer-field-label">Order Date</span>
                    <span className="cod-pr-drawer-field-value">{selectedOrder.orderDate}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="cod-pr-drawer-section">
                <h4 className="cod-pr-drawer-section-title">Payment Details</h4>
                <div className="cod-pr-drawer-payment">
                  <div className="cod-pr-drawer-payment-row cod-pr-drawer-payment-main">
                    <span>Order Amount</span>
                    <span className="cod-pr-drawer-amount">₹{selectedOrder.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="cod-pr-drawer-payment-row">
                    <span>COD Charges</span>
                    <span className="cod-pr-drawer-amount-secondary">₹{selectedOrder.codCharge.toFixed(2)}</span>
                  </div>
                  <div className="cod-pr-drawer-payment-row">
                    <span>Forwarding Charges</span>
                    <span className="cod-pr-drawer-amount-secondary">₹{selectedOrder.forwardingCharge.toFixed(2)}</span>
                  </div>
                  <div className="cod-pr-drawer-payment-row cod-pr-drawer-payment-divider">
                    <span>Total Payable</span>
                    <span className="cod-pr-drawer-amount-total">₹{(selectedOrder.amount + selectedOrder.codCharge + selectedOrder.forwardingCharge).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="cod-pr-drawer-section">
                <h4 className="cod-pr-drawer-section-title">Delivery Timeline</h4>
                <div className="cod-pr-drawer-timeline">
                  <div className={`cod-pr-timeline-step ${selectedOrder.status !== "cancelled" && selectedOrder.status !== "pending" ? "cod-pr-timeline-done" : "cod-pr-timeline-pending"}`}>
                    <div className="cod-pr-timeline-dot" />
                    <span>Order Placed</span>
                    <span className="cod-pr-timeline-date">{selectedOrder.orderDate}</span>
                  </div>
                  <div className={`cod-pr-timeline-step ${["out_for_delivery", "delivered", "confirmed", "rto_initiated", "rto_completed"].includes(selectedOrder.status) ? "cod-pr-timeline-done" : "cod-pr-timeline-pending"}`}>
                    <div className="cod-pr-timeline-dot" />
                    <span>Dispatched</span>
                  </div>
                  <div className={`cod-pr-timeline-step ${["delivered", "confirmed", "rto_initiated", "rto_completed"].includes(selectedOrder.status) ? "cod-pr-timeline-done" : "cod-pr-timeline-pending"}`}>
                    <div className="cod-pr-timeline-dot" />
                    <span>{selectedOrder.attemptedDelivery} Attempt{selectedOrder.attemptedDelivery > 1 ? "s" : ""}</span>
                  </div>
                  <div className={`cod-pr-timeline-step ${selectedOrder.status === "confirmed" ? "cod-pr-timeline-done" : selectedOrder.status === "rto_completed" ? "cod-pr-timeline-rto" : "cod-pr-timeline-pending"}`}>
                    <div className="cod-pr-timeline-dot" />
                    <span>{selectedOrder.status === "confirmed" ? "Payment Collected" : selectedOrder.status === "rto_completed" ? "RTO Returned" : "Pending"}</span>
                  </div>
                </div>
              </div>

              {/* RTO Info */}
              {(selectedOrder.status === "rto_initiated" || selectedOrder.status === "rto_completed") && selectedOrder.rtoReason && (
                <div className="cod-pr-drawer-section">
                  <h4 className="cod-pr-drawer-section-title cod-pr-rto-title">RTO Information</h4>
                  <div className="cod-pr-rto-card">
                    <XCircle className="cod-pr-rto-icon" />
                    <div>
                      <span className="cod-pr-rto-reason">{selectedOrder.rtoReason}</span>
                      <span className="cod-pr-rto-loss">Loss: ₹{selectedOrder.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Deposit Info */}
              {selectedOrder.depositDate && (
                <div className="cod-pr-drawer-section">
                  <h4 className="cod-pr-drawer-section-title">Deposit Information</h4>
                  <div className="cod-pr-deposit-card">
                    <CheckCircle2 className="cod-pr-deposit-icon" />
                    <div className="cod-pr-deposit-info">
                      <span className="cod-pr-deposit-ref">{selectedOrder.depositRef}</span>
                      <span className="cod-pr-deposit-date">Deposited: {selectedOrder.depositDate}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="cod-pr-drawer-actions">
                {selectedOrder.status === "out_for_delivery" && (
                  <button className="cod-pr-btn cod-pr-btn-primary">
                    <CheckCircle2 className="cod-pr-btn-icon" />
                    Confirm Collection
                  </button>
                )}
                <button className="cod-pr-btn cod-pr-btn-secondary">
                  <Receipt className="cod-pr-btn-icon" />
                  View Receipt
                </button>
                <button className="cod-pr-btn cod-pr-btn-secondary">
                  <Truck className="cod-pr-btn-icon" />
                  Track Shipment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
