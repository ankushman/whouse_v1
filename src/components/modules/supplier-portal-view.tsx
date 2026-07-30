"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  Handshake, Search, Star, MapPin, Phone, Mail,
  AlertTriangle, CheckCircle2, XCircle, Clock, Package,
  IndianRupee, TrendingUp, TrendingDown, Users,
  FileText, Truck, ShieldCheck, Factory, Building2,
  ChevronLeft, ChevronRight, Eye, Send, BarChart3,
  ArrowUpRight, ArrowDownRight, Download, RefreshCw,
  CircleDot, CreditCard, FileCheck, MessageSquare,
  Filter, Calendar, Target, Zap, Award,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
type Status = "draft" | "sent" | "acknowledged" | "in_production" | "shipped" | "delivered" | "partially_received" | "closed";
type Priority = "critical" | "high" | "medium" | "low";
type Category = "Raw Materials" | "Packaging" | "Components" | "Finished Goods" | "MRO" | "Services";
type InvoiceStatus = "approved" | "pending" | "processing" | "rejected" | "disputed";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  category: Category;
  material: string;
  qty: number;
  unitPrice: number;
  totalValue: number;
  deliveryDate: string;
  status: Status;
  priority: Priority;
  lineItems: { material: string; qty: number; unitPrice: number; total: number }[];
}

interface Supplier {
  id: string;
  name: string;
  category: Category;
  city: string;
  contact: string;
  phone: string;
  email: string;
  rating: number;
  onTimePct: number;
  qualityScore: number;
  totalPOValue: number;
  activePOs: number;
  color: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  supplierName: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
}

interface MonthlyTrend {
  month: string;
  poValue: number;
  onTimeDelivery: number;
  qualityScore: number;
  rejectionRate: number;
  paymentAmount: number;
}

interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  severity: "critical" | "warning" | "info";
}

// ============================================================================
// INR Formatter
// ============================================================================
function formatINR(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatINRFull(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

// ============================================================================
// Seeded Data Generator
// ============================================================================
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateData() {
  const rand = seededRandom(161161);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const randInt = (min: number, max: number) => Math.floor(min + rand() * (max - min));

  const categories: Category[] = ["Raw Materials", "Packaging", "Components", "Finished Goods", "MRO", "Services"];
  const statuses: Status[] = ["draft", "sent", "acknowledged", "in_production", "shipped", "delivered", "partially_received", "closed"];
  const priorities: Priority[] = ["critical", "high", "medium", "low"];
  const invoiceStatuses: InvoiceStatus[] = ["approved", "pending", "processing", "rejected", "disputed"];

  const cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Noida", "Gurugram", "Coimbatore", "Indore", "Nagpur", "Vadodara"];
  const materials = [
    "Steel Sheets HR", "Aluminium Ingots", "Copper Wire 2mm", "Polypropylene Granules",
    "Corrugated Boxes 12x8", "Stretch Wrap Roll", "Bubble Wrap 50m", "Packing Tape 48mm",
    "PCB Assembly Board", "LED Driver Module", "Precision Bearings", "Hydraulic Seals",
    "LED Panel Light 24W", "Solar Inverter 5kW", "Circuit Breaker MCB", "Transformer 500VA",
    "Wrench Set 12pc", "Safety Helmet Class A", "Latex Gloves Box", "Cleaning Solvent 5L"
  ];
  const supplierNames = [
    "Tata Steel Ltd", "Reliance Industries", "Mahindra & Mahindra", "L&T Engineering",
    "Bajaj Electronics", "Godrej Packaging", "Wipro Components", "Infosys IT Services",
    "Ashok Leyland Parts", "TVS Group Supply", "Dr. Reddy's Chemical", "Asian Paints Coatings",
    "Havells Electricals", "Crompton Greaves", "Bosch India Ltd", "Schneider Electric",
    "Vedanta Resources", "JSW Steel Mumbai", "Ultratech Cement", "Dabur India Ltd",
    "Maruti Suzuki OEM", "Hero MotoCorp Parts", "BHEL Heavy Eng.", "NTPC Energy",
    "Oracle India Solutions"
  ];
  const supplierColors = [
    "#0d9488", "#f97316", "#6366f1", "#ec4899", "#8b5cf6",
    "#14b8a6", "#f43f5e", "#3b82f6", "#22c55e", "#eab308",
    "#06b6d4", "#a855f7", "#ef4444", "#84cc16", "#f59e0b",
    "#d946ef", "#0ea5e9", "#10b981", "#f97316", "#8b5cf6",
    "#6366f1", "#14b8a6", "#ec4899", "#22c55e", "#eab308"
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Generate 25 suppliers
  const suppliers: Supplier[] = Array.from({ length: 25 }, (_, i) => ({
    id: `SUP-${String(i + 1).padStart(3, "0")}`,
    name: supplierNames[i],
    category: pick(categories),
    city: pick(cities),
    contact: `${pick(["Mr.", "Ms.", "Dr."])} ${pick(["Sharma", "Patel", "Kumar", "Singh", "Reddy", "Gupta", "Joshi", "Nair", "Iyer", "Verma"])}`,
    phone: `+91 ${randInt(7, 9)}${randInt(100, 999)}${randInt(1000, 9999)}`,
    email: `${supplierNames[i].toLowerCase().replace(/[^a-z]/g, "").slice(0, 8)}@mail.in`,
    rating: Math.round((3.2 + rand() * 1.8) * 10) / 10,
    onTimePct: Math.round((72 + rand() * 27) * 10) / 10,
    qualityScore: Math.round((75 + rand() * 24) * 10) / 10,
    totalPOValue: randInt(500000, 50000000),
    activePOs: randInt(2, 35),
    color: supplierColors[i],
  }));

  // Generate 12-month trends
  const monthlyTrends: MonthlyTrend[] = months.map((m, i) => ({
    month: m,
    poValue: randInt(8000000, 25000000),
    onTimeDelivery: Math.round((78 + rand() * 18) * 10) / 10,
    qualityScore: Math.round((80 + rand() * 17) * 10) / 10,
    rejectionRate: Math.round((1 + rand() * 6) * 10) / 10,
    paymentAmount: randInt(6000000, 22000000),
  }));

  // Generate 350 POs
  const purchaseOrders: PurchaseOrder[] = Array.from({ length: 350 }, (_, i) => {
    const sup = pick(suppliers);
    const mat = pick(materials);
    const qty = randInt(10, 5000);
    const up = randInt(50, 50000);
    const total = qty * up;
    const mIdx = randInt(0, 11);
    const dIdx = randInt(1, 28);
    return {
      id: `PO-${String(i + 1).padStart(4, "0")}`,
      poNumber: `PO-2025-${String(i + 1).padStart(4, "0")}`,
      date: `2025-${String(mIdx + 1).padStart(2, "0")}-${String(dIdx).padStart(2, "0")}`,
      supplierId: sup.id,
      supplierName: sup.name,
      category: sup.category,
      material: mat,
      qty,
      unitPrice: up,
      totalValue: total,
      deliveryDate: `2025-${String(Math.min(mIdx + 2, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
      status: pick(statuses),
      priority: pick(priorities),
      lineItems: Array.from({ length: randInt(1, 5) }, () => {
        const lm = pick(materials);
        const lq = randInt(10, 2000);
        const lup = randInt(50, 50000);
        return { material: lm, qty: lq, unitPrice: lup, total: lq * lup };
      }),
    };
  });

  // Generate 20 invoices
  const invoices: Invoice[] = Array.from({ length: 20 }, (_, i) => ({
    id: `INV-${String(i + 1).padStart(4, "0")}`,
    invoiceNumber: `INV-2025-${String(i + 1).padStart(4, "0")}`,
    poNumber: purchaseOrders[i % 350].poNumber,
    supplierName: pick(supplierNames),
    amount: randInt(50000, 5000000),
    status: pick(invoiceStatuses),
    date: `2025-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    dueDate: `2025-${String(randInt(6, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
  }));

  // Supplier category pie data
  const categoryPie = categories.map(c => ({
    name: c,
    value: suppliers.filter(s => s.category === c).length,
  }));

  // Performance pie
  const perfPie = [
    { name: "Excellent", value: 8, color: "#0d9488" },
    { name: "Good", value: 9, color: "#3b82f6" },
    { name: "Average", value: 5, color: "#f59e0b" },
    { name: "Poor", value: 3, color: "#ef4444" },
  ];

  // Invoice status pie
  const invoiceStatusPie = [
    { name: "Approved", value: 8, color: "#0d9488" },
    { name: "Pending", value: 5, color: "#f59e0b" },
    { name: "Processing", value: 3, color: "#3b82f6" },
    { name: "Rejected", value: 2, color: "#ef4444" },
    { name: "Disputed", value: 2, color: "#8b5cf6" },
  ];

  // Category radar
  const categoryRadar = categories.map(c => ({
    category: c,
    quality: Math.round((75 + rand() * 22) * 10) / 10,
    delivery: Math.round((70 + rand() * 28) * 10) / 10,
    pricing: Math.round((65 + rand() * 30) * 10) / 10,
  }));

  // Alerts
  const alerts: Alert[] = [
    { id: "a1", type: "po_overdue", title: "PO Overdue", description: "PO-2025-0042 from Tata Steel is 5 days overdue", time: "2h ago", severity: "critical" },
    { id: "a2", type: "delivery_delay", title: "Delivery Delay", description: "Reliance Industries shipment delayed by 3 days", time: "4h ago", severity: "warning" },
    { id: "a3", type: "quality_issue", title: "Quality Issue", description: "Batch rejection from JSW Steel — 2.3% defect rate", time: "6h ago", severity: "critical" },
    { id: "a4", type: "contract_expiring", title: "Contract Expiring", description: "MRO supply contract with Havells expires in 15 days", time: "1d ago", severity: "warning" },
    { id: "a5", type: "invoice_pending", title: "Invoice Pending", description: "₹24.5L invoice pending approval from BHEL Heavy Eng.", time: "1d ago", severity: "info" },
    { id: "a6", type: "certification_expired", title: "Certification Expired", description: "ISO 9001 cert expired for Dr. Reddy's Chemical supply", time: "2d ago", severity: "warning" },
  ];

  // KPIs
  const kpis = {
    totalSuppliers: 25,
    activeContracts: 42,
    pendingPOs: 67,
    totalPOValue: 1845000000,
    onTimeDelivery: 91.3,
    qualityScore: 94.7,
  };

  // Payment KPIs
  const paymentKpis = {
    totalInvoices: 186,
    paid: 142,
    pending: 28,
    overdue: 11,
    totalPaidAmount: 245000000,
    disputeAmount: 12350000,
  };

  // Top 10 suppliers for scorecard bar chart
  const topSuppliers = suppliers.slice(0, 10).map(s => ({
    name: s.name.split(" ").slice(0, 2).join(" "),
    onTimePct: s.onTimePct,
    quality: s.qualityScore,
  }));

  return {
    suppliers,
    monthlyTrends,
    purchaseOrders,
    invoices,
    categoryPie,
    perfPie,
    invoiceStatusPie,
    categoryRadar,
    alerts,
    kpis,
    paymentKpis,
    topSuppliers,
    categories,
    statuses,
    priorities,
  };
}

type GeneratedData = ReturnType<typeof generateData>;

// ============================================================================
// Component
// ============================================================================
export default function SupplierPortalView() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [activePriority, setActivePriority] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [drawerPO, setDrawerPO] = useState<PurchaseOrder | null>(null);
  const [poPage, setPoPage] = useState(0);
  const [dirCategory, setDirCategory] = useState<string>("all");
  const poPerPage = 35;

  const data = useMemo(() => generateData(), []);

  // Filter POs
  const filteredPOs = useMemo(() => {
    return data.purchaseOrders.filter(po => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!po.poNumber.toLowerCase().includes(q) &&
            !po.supplierName.toLowerCase().includes(q) &&
            !po.material.toLowerCase().includes(q) &&
            !po.category.toLowerCase().includes(q)) return false;
      }
      if (activeStatus !== "all" && po.status !== activeStatus) return false;
      if (activePriority !== "all" && po.priority !== activePriority) return false;
      if (activeCategory !== "all" && po.category !== activeCategory) return false;
      return true;
    });
  }, [data.purchaseOrders, searchQuery, activeStatus, activePriority, activeCategory]);

  const pagedPOs = useMemo(() => {
    return filteredPOs.slice(poPage * poPerPage, (poPage + 1) * poPerPage);
  }, [filteredPOs, poPage]);

  const totalPoPages = Math.ceil(filteredPOs.length / poPerPage);

  // Filtered suppliers for directory
  const filteredSuppliers = useMemo(() => {
    if (dirCategory === "all") return data.suppliers;
    return data.suppliers.filter(s => s.category === dirCategory);
  }, [data.suppliers, dirCategory]);

  const tabs = ["Dashboard", "Purchase Orders", "Supplier Directory", "Performance Scorecard", "Invoice & Payments"];

  // Drawer header class
  const getDrawerHeaderClass = (status: Status) => {
    if (status === "closed") return "sp-drawer-header sp-drawer-header-teal";
    if (status === "draft") return "sp-drawer-header sp-drawer-header-red";
    return "sp-drawer-header sp-drawer-header-blue";
  };

  // Status badge class
  const getStatusBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      draft: "sp-badge sp-badge-draft",
      sent: "sp-badge sp-badge-sent",
      acknowledged: "sp-badge sp-badge-acknowledged",
      in_production: "sp-badge sp-badge-in_production",
      shipped: "sp-badge sp-badge-shipped",
      delivered: "sp-badge sp-badge-delivered",
      partially_received: "sp-badge sp-badge-partially_received",
      closed: "sp-badge sp-badge-closed",
    };
    return map[status] || "sp-badge sp-badge-draft";
  };

  const getPriorityBadgeClass = (priority: string) => {
    return `sp-badge sp-badge-${priority}`;
  };

  const getAlertSeverityClass = (severity: string) => {
    if (severity === "critical") return "sp-alert-card sp-alert-critical";
    if (severity === "warning") return "sp-alert-card sp-alert-warning";
    return "sp-alert-card sp-alert-info";
  };

  const getPerfBadge = (score: number) => {
    if (score >= 90) return "sp-supplier-performance-badge sp-badge-excellent";
    if (score >= 80) return "sp-supplier-performance-badge sp-badge-good";
    if (score >= 70) return "sp-supplier-performance-badge sp-badge-average";
    return "sp-supplier-performance-badge sp-badge-poor";
  };

  const getPerfLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Average";
    return "Poor";
  };

  const getProgressColorClass = (val: number) => {
    if (val >= 90) return "sp-progress-fill sp-progress-teal";
    if (val >= 75) return "sp-progress-fill sp-progress-green";
    if (val >= 60) return "sp-progress-fill sp-progress-orange";
    return "sp-progress-fill sp-progress-red";
  };

  const getTimelineDot = (idx: number, status: Status) => {
    const order: Status[] = ["draft", "sent", "acknowledged", "in_production", "shipped", "delivered", "partially_received", "closed"];
    const pos = order.indexOf(status);
    if (idx < pos) return "sp-timeline-dot sp-timeline-dot-done";
    if (idx === pos) return "sp-timeline-dot sp-timeline-dot-current";
    return "sp-timeline-dot sp-timeline-dot-pending";
  };

  const getStatusStepIndex = (status: Status) => {
    const order: Status[] = ["draft", "sent", "acknowledged", "in_production", "shipped", "delivered", "partially_received", "closed"];
    return order.indexOf(status);
  };

  const timelineSteps = ["PO Created", "Acknowledged", "In Production", "Delivered"];

  // Render star ratings
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      <span className="sp-supplier-rating">
        {Array.from({ length: full }, (_, i) => <Star key={`f${i}`} className="sp-supplier-star" fill="#f59e0b" />)}
        {half > 0 && <Star className="sp-supplier-star" fill="#f59e0b" style={{ opacity: 0.5 }} />}
        {Array.from({ length: empty }, (_, i) => <Star key={`e${i}`} className="sp-supplier-star-empty" />)}
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#475569", marginLeft: "4px" }}>{rating}</span>
      </span>
    );
  };

  // ============================================================================
  // Tab: Dashboard
  // ============================================================================
  const renderDashboard = () => (
    <div className="sp-tab-content">
      {/* KPIs */}
      <div className="sp-kpi-grid">
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#ccfbf1", color: "#0d9488" }}><Users size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Total Suppliers</span>
            <span className="sp-kpi-value">{data.kpis.totalSuppliers}</span>
            <span className="sp-kpi-change sp-kpi-up"><ArrowUpRight size={12} /> +3 this quarter</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#ffedd5", color: "#f97316" }}><FileCheck size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Active Contracts</span>
            <span className="sp-kpi-value">{data.kpis.activeContracts}</span>
            <span className="sp-kpi-change sp-kpi-up"><ArrowUpRight size={12} /> +5 this month</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#fef3c7", color: "#d97706" }}><Package size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Pending POs</span>
            <span className="sp-kpi-value">{data.kpis.pendingPOs}</span>
            <span className="sp-kpi-change sp-kpi-down"><ArrowDownRight size={12} /> +12 this week</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}><IndianRupee size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Total PO Value</span>
            <span className="sp-kpi-value">{formatINR(data.kpis.totalPOValue)}</span>
            <span className="sp-kpi-change sp-kpi-up"><ArrowUpRight size={12} /> +18.5%</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#e0e7ff", color: "#4f46e5" }}><Truck size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">On-Time Delivery</span>
            <span className="sp-kpi-value">{data.kpis.onTimeDelivery}%</span>
            <span className="sp-kpi-change sp-kpi-up"><ArrowUpRight size={12} /> +2.1%</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#fce7f3", color: "#db2777" }}><ShieldCheck size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Quality Score</span>
            <span className="sp-kpi-value">{data.kpis.qualityScore}%</span>
            <span className="sp-kpi-change sp-kpi-up"><ArrowUpRight size={12} /> +1.4%</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="sp-charts-row">
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Monthly PO Value & On-Time Delivery</h3>
            <p className="sp-chart-subtitle">Purchase order value (₹Lakh) with delivery performance</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
              <Tooltip formatter={(value: number, name: string) => [name === "poValue" ? formatINR(value) : `${value}%`, name === "poValue" ? "PO Value" : "On-Time %"]} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="poValue" fill="#0d9488" radius={[4, 4, 0, 0]} name="PO Value" />
              <Line yAxisId="right" type="monotone" dataKey="onTimeDelivery" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: "#f97316" }} name="On-Time %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Supplier Category Distribution</h3>
            <p className="sp-chart-subtitle">Suppliers by material category</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.categoryPie} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                {data.categoryPie.map((_, idx) => (
                  <Cell key={idx} fill={["#0d9488", "#f97316", "#3b82f6", "#8b5cf6", "#eab308", "#ec4899"][idx]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="sp-charts-row">
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Quality Score & Rejection Rate</h3>
            <p className="sp-chart-subtitle">Monthly quality performance trends</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="left" domain={[70, 100]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="qualityScore" fill="#ccfbf1" stroke="#0d9488" strokeWidth={2} name="Quality Score %" />
              <Line yAxisId="right" type="monotone" dataKey="rejectionRate" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: "#ef4444" }} name="Rejection Rate %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Supply Chain Alerts</h3>
            <p className="sp-chart-subtitle">Active alerts requiring attention</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.alerts.map(a => (
              <div key={a.id} className={getAlertSeverityClass(a.severity)}>
                <div className="sp-alert-header">
                  <div className="sp-alert-icon" style={{ background: a.severity === "critical" ? "#fef2f2" : a.severity === "warning" ? "#fff7ed" : "#ccfbf1", color: a.severity === "critical" ? "#dc2626" : a.severity === "warning" ? "#f97316" : "#0d9488" }}>
                    {a.severity === "critical" ? <XCircle size={14} /> : a.severity === "warning" ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                  </div>
                  <span className="sp-alert-title">{a.title}</span>
                </div>
                <span className="sp-alert-desc">{a.description}</span>
                <span className="sp-alert-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // Tab: Purchase Orders
  // ============================================================================
  const renderPurchaseOrders = () => (
    <div className="sp-tab-content">
      {/* Search */}
      <div className="sp-filters">
        <div className="sp-search-box">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search PO number, supplier, material, category..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPoPage(0); }}
          />
        </div>
        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{filteredPOs.length} POs found</span>
      </div>

      {/* Filter Row 1: Status */}
      <div className="sp-filter-row">
        <span className="sp-filter-label">Status:</span>
        <button className={`sp-pill ${activeStatus === "all" ? "sp-pill-active" : ""}`} onClick={() => { setActiveStatus("all"); setPoPage(0); }}>All</button>
        {data.statuses.map(s => (
          <button key={s} className={`sp-pill ${activeStatus === s ? "sp-pill-active" : ""}`} onClick={() => { setActiveStatus(s); setPoPage(0); }}>
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Filter Row 2: Priority + Category */}
      <div className="sp-filter-row">
        <span className="sp-filter-label">Priority:</span>
        {data.priorities.map(p => (
          <button key={p} className={`sp-pill sp-pill-${p} ${activePriority === p ? "sp-pill-active" : ""}`} onClick={() => { setActivePriority(p); setPoPage(0); }}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
        <button className={`sp-pill ${activePriority === "all" ? "sp-pill-active" : ""}`} onClick={() => { setActivePriority("all"); setPoPage(0); }}>All</button>
        <span className="sp-filter-label" style={{ marginLeft: "16px" }}>Category:</span>
        <select className="sp-dropdown" value={activeCategory} onChange={(e) => { setActiveCategory(e.target.value); setPoPage(0); }}>
          <option value="all">All Categories</option>
          {data.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="sp-table-wrap">
        <div className="sp-table-scroll">
          <table className="sp-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Category</th>
                <th>Material</th>
                <th style={{ textAlign: "right" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Unit Price</th>
                <th style={{ textAlign: "right" }}>Total Value</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedPOs.map(po => (
                <tr key={po.id}>
                  <td style={{ fontWeight: 600, fontSize: "12px" }}>{po.poNumber}</td>
                  <td style={{ fontSize: "12px" }}>{po.date}</td>
                  <td style={{ fontWeight: 500 }}>{po.supplierName.length > 20 ? po.supplierName.slice(0, 20) + "…" : po.supplierName}</td>
                  <td style={{ fontSize: "12px" }}>{po.category}</td>
                  <td style={{ fontSize: "12px" }}>{po.material.length > 22 ? po.material.slice(0, 22) + "…" : po.material}</td>
                  <td style={{ textAlign: "right", fontSize: "12px" }}>{po.qty.toLocaleString()}</td>
                  <td style={{ textAlign: "right", fontSize: "12px" }}>{formatINR(po.unitPrice)}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, fontSize: "12px" }}>{formatINR(po.totalValue)}</td>
                  <td style={{ fontSize: "12px" }}>{po.deliveryDate}</td>
                  <td><span className={getStatusBadgeClass(po.status)}>{po.status.replace(/_/g, " ")}</span></td>
                  <td><span className={getPriorityBadgeClass(po.priority)}>{po.priority}</span></td>
                  <td>
                    <div className="sp-table-actions">
                      <button className="sp-btn sp-btn-sm sp-btn-outline" onClick={() => setDrawerPO(po)}>
                        <Eye size={13} /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="sp-pagination">
        <button className="sp-page-btn" onClick={() => setPoPage(Math.max(0, poPage - 1))} disabled={poPage === 0}><ChevronLeft size={14} /></button>
        <span className="sp-page-info">Page {poPage + 1} of {totalPoPages}</span>
        <button className="sp-page-btn" onClick={() => setPoPage(Math.min(totalPoPages - 1, poPage + 1))} disabled={poPage >= totalPoPages - 1}><ChevronRight size={14} /></button>
      </div>
    </div>
  );

  // ============================================================================
  // Tab: Supplier Directory
  // ============================================================================
  const renderSupplierDirectory = () => (
    <div className="sp-tab-content">
      {/* Category Filter */}
      <div className="sp-cat-filter-row">
        <button className={`sp-pill ${dirCategory === "all" ? "sp-pill-active" : ""}`} onClick={() => setDirCategory("all")}>All Categories</button>
        {data.categories.map(c => (
          <button key={c} className={`sp-pill ${dirCategory === c ? "sp-pill-active" : ""}`} onClick={() => setDirCategory(c)}>{c}</button>
        ))}
      </div>

      {/* Supplier Cards */}
      <div className="sp-dir-grid">
        {filteredSuppliers.map(s => (
          <div key={s.id} className="sp-supplier-card">
            <div className="sp-supplier-top">
              <div className="sp-supplier-avatar" style={{ background: s.color }}>
                {s.name.charAt(0)}
              </div>
              <div>
                <div className="sp-supplier-name">{s.name}</div>
                <div className="sp-supplier-cat">{s.category}</div>
                <div className="sp-supplier-city"><MapPin size={10} /> {s.city}</div>
                <div className="sp-supplier-rating">
                  {renderStars(s.rating)}
                </div>
              </div>
            </div>

            <div className="sp-supplier-stats">
              <div className="sp-supplier-stat">
                <div className="sp-supplier-stat-label">On-Time %</div>
                <div className="sp-supplier-stat-value" style={{ color: s.onTimePct >= 90 ? "#0d9488" : s.onTimePct >= 80 ? "#f59e0b" : "#ef4444" }}>{s.onTimePct}%</div>
              </div>
              <div className="sp-supplier-stat">
                <div className="sp-supplier-stat-label">Quality Score</div>
                <div className="sp-supplier-stat-value" style={{ color: s.qualityScore >= 90 ? "#0d9488" : s.qualityScore >= 80 ? "#f59e0b" : "#ef4444" }}>{s.qualityScore}%</div>
              </div>
              <div className="sp-supplier-stat">
                <div className="sp-supplier-stat-label">Active POs</div>
                <div className="sp-supplier-stat-value">{s.activePOs}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>Total PO Value</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#334155" }}>{formatINR(s.totalPOValue)}</div>
              </div>
              <span className={getPerfBadge(s.qualityScore)}>
                <Award size={12} /> {getPerfLabel(s.qualityScore)}
              </span>
            </div>

            <div style={{ marginTop: "10px", display: "flex", gap: "12px", fontSize: "11px", color: "#64748b" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Phone size={11} /> {s.phone}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Mail size={11} /> {s.contact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ============================================================================
  // Tab: Performance Scorecard
  // ============================================================================
  const renderPerformanceScorecard = () => (
    <div className="sp-tab-content">
      <div className="sp-charts-row">
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Supplier On-Time Delivery & Quality</h3>
            <p className="sp-chart-subtitle">Top 10 suppliers — delivery and quality performance</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.topSuppliers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#475569" }} />
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="onTimePct" fill="#0d9488" radius={[0, 4, 4, 0]} name="On-Time %" barSize={12} />
              <Bar dataKey="quality" fill="#f97316" radius={[0, 4, 4, 0]} name="Quality %" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Category Performance</h3>
            <p className="sp-chart-subtitle">Quality, delivery, and pricing by category</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={data.categoryRadar} cx="50%" cy="50%" outerRadius={100}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "#475569" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Quality" dataKey="quality" stroke="#0d9488" fill="#ccfbf1" strokeWidth={2} />
              <Radar name="Delivery" dataKey="delivery" stroke="#f97316" fill="#ffedd5" strokeWidth={2} />
              <Radar name="Pricing" dataKey="pricing" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="sp-charts-row">
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Supplier Performance Distribution</h3>
            <p className="sp-chart-subtitle">Classification based on quality and delivery</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.perfPie} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {data.perfPie.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Supplier Scorecard</h3>
            <p className="sp-chart-subtitle">Detailed performance metrics per supplier</p>
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th style={{ width: "120px" }}>On-Time %</th>
                  <th style={{ width: "120px" }}>Quality %</th>
                  <th style={{ width: "130px" }}>Price Comp.</th>
                </tr>
              </thead>
              <tbody>
                {data.suppliers.map(s => {
                  const priceComp = Math.round(65 + Math.random() * 30);
                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500, fontSize: "12px" }}>{s.name.split(" ").slice(0, 2).join(" ")}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div className="sp-progress-bar" style={{ width: "80px" }}><div className={getProgressColorClass(s.onTimePct)} style={{ width: `${s.onTimePct}%` }} /></div>
                          <span style={{ fontSize: "12px", fontWeight: 600 }}>{s.onTimePct}%</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div className="sp-progress-bar" style={{ width: "80px" }}><div className={getProgressColorClass(s.qualityScore)} style={{ width: `${s.qualityScore}%` }} /></div>
                          <span style={{ fontSize: "12px", fontWeight: 600 }}>{s.qualityScore}%</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div className="sp-progress-bar" style={{ width: "80px" }}><div className={getProgressColorClass(priceComp)} style={{ width: `${priceComp}%` }} /></div>
                          <span style={{ fontSize: "12px", fontWeight: 600 }}>{priceComp}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // Tab: Invoice & Payments
  // ============================================================================
  const renderInvoicePayments = () => (
    <div className="sp-tab-content">
      {/* Payment KPIs */}
      <div className="sp-kpi-grid">
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#ccfbf1", color: "#0d9488" }}><FileText size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Total Invoices</span>
            <span className="sp-kpi-value">{data.paymentKpis.totalInvoices}</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}><CheckCircle2 size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Paid</span>
            <span className="sp-kpi-value">{data.paymentKpis.paid}</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#fef3c7", color: "#d97706" }}><Clock size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Pending</span>
            <span className="sp-kpi-value">{data.paymentKpis.pending}</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#fee2e2", color: "#dc2626" }}><AlertTriangle size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Overdue</span>
            <span className="sp-kpi-value">{data.paymentKpis.overdue}</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#e0e7ff", color: "#4f46e5" }}><IndianRupee size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Total Paid Amount</span>
            <span className="sp-kpi-value">{formatINR(data.paymentKpis.totalPaidAmount)}</span>
          </div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon" style={{ background: "#fce7f3", color: "#db2777" }}><CreditCard size={20} /></div>
          <div className="sp-kpi-info">
            <span className="sp-kpi-label">Dispute Amount</span>
            <span className="sp-kpi-value">{formatINR(data.paymentKpis.disputeAmount)}</span>
          </div>
        </div>
      </div>

      <div className="sp-charts-row">
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Invoice Status Distribution</h3>
            <p className="sp-chart-subtitle">Current status of all invoices</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.invoiceStatusPie} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {data.invoiceStatusPie.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="sp-chart-card">
          <div className="sp-chart-header">
            <h3 className="sp-chart-title">Monthly Payment Trend</h3>
            <p className="sp-chart-subtitle">Payment amounts over the last 12 months</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v: number) => `${(v / 10000000).toFixed(1)}Cr`} />
              <Tooltip formatter={(value: number) => formatINR(value)} />
              <Area type="monotone" dataKey="paymentAmount" fill="#ccfbf1" stroke="#0d9488" strokeWidth={2} name="Payment Amount" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Invoices Table */}
      <div className="sp-chart-card">
        <div className="sp-chart-header">
          <h3 className="sp-chart-title">Pending & Overdue Invoices</h3>
          <p className="sp-chart-subtitle">{data.invoices.filter(i => i.status === "pending" || i.status === "disputed" || i.status === "processing").length} invoices requiring attention</p>
        </div>
        <div className="sp-table-wrap" style={{ border: "none" }}>
          <div className="sp-table-scroll" style={{ maxHeight: "400px" }}>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th>Invoice Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.invoices.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600, fontSize: "12px" }}>{inv.invoiceNumber}</td>
                    <td style={{ fontSize: "12px" }}>{inv.poNumber}</td>
                    <td style={{ fontSize: "12px" }}>{inv.supplierName}</td>
                    <td style={{ textAlign: "right", fontWeight: 600, fontSize: "12px" }}>{formatINR(inv.amount)}</td>
                    <td style={{ fontSize: "12px" }}>{inv.date}</td>
                    <td style={{ fontSize: "12px" }}>{inv.dueDate}</td>
                    <td><span className={`sp-badge sp-badge-${inv.status}`}>{inv.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // PO Detail Drawer
  // ============================================================================
  const renderDrawer = () => {
    if (!drawerPO) return null;
    const supplier = data.suppliers.find(s => s.id === drawerPO.supplierId);
    const subtotal = drawerPO.lineItems.reduce((sum, li) => sum + li.total, 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    const stepIdx = getStatusStepIndex(drawerPO.status);
    const timelineLabels = ["PO Created", "Acknowledged", "In Production", "Delivered"];
    const timelineDates = [
      drawerPO.date,
      `2025-${String(parseInt(drawerPO.date.split("-")[1]) + 1).padStart(2, "0")}-05`,
      `2025-${String(Math.min(parseInt(drawerPO.date.split("-")[1]) + 2, 12)).padStart(2, "0")}-10`,
      drawerPO.deliveryDate,
    ];
    const timelineIcons = [FileText, CheckCircle2, Factory, Truck];

    return (
      <div className="sp-drawer-overlay" onClick={() => setDrawerPO(null)}>
        <div className="sp-drawer" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={getDrawerHeaderClass(drawerPO.status)}>
            <button className="sp-drawer-close" onClick={() => setDrawerPO(null)}><XCircle size={18} /></button>
            <h2 className="sp-drawer-title">{drawerPO.poNumber}</h2>
            <p className="sp-drawer-subtitle">
              <span className={getStatusBadgeClass(drawerPO.status)} style={{ marginRight: "8px" }}>{drawerPO.status.replace(/_/g, " ")}</span>
              <span className={getPriorityBadgeClass(drawerPO.priority)}>{drawerPO.priority}</span>
            </p>
          </div>

          <div className="sp-drawer-body">
            {/* PO Info */}
            <div className="sp-drawer-section">
              <h3 className="sp-drawer-section-title">PO Information</h3>
              <div className="sp-drawer-info-grid">
                <div className="sp-drawer-info-item">
                  <div className="sp-drawer-info-label">PO Number</div>
                  <div className="sp-drawer-info-value">{drawerPO.poNumber}</div>
                </div>
                <div className="sp-drawer-info-item">
                  <div className="sp-drawer-info-label">PO Date</div>
                  <div className="sp-drawer-info-value">{drawerPO.date}</div>
                </div>
                <div className="sp-drawer-info-item">
                  <div className="sp-drawer-info-label">Category</div>
                  <div className="sp-drawer-info-value">{drawerPO.category}</div>
                </div>
                <div className="sp-drawer-info-item">
                  <div className="sp-drawer-info-label">Delivery Date</div>
                  <div className="sp-drawer-info-value">{drawerPO.deliveryDate}</div>
                </div>
              </div>
            </div>

            {/* Supplier Details */}
            <div className="sp-drawer-section">
              <h3 className="sp-drawer-section-title">Supplier Details</h3>
              <div className="sp-drawer-info-grid">
                <div className="sp-drawer-info-item">
                  <div className="sp-drawer-info-label">Supplier Name</div>
                  <div className="sp-drawer-info-value">{drawerPO.supplierName}</div>
                </div>
                <div className="sp-drawer-info-item">
                  <div className="sp-drawer-info-label">Location</div>
                  <div className="sp-drawer-info-value">{supplier ? `${supplier.city}, India` : "—"}</div>
                </div>
                <div className="sp-drawer-info-item">
                  <div className="sp-drawer-info-label">Contact</div>
                  <div className="sp-drawer-info-value">{supplier ? supplier.contact : "—"}</div>
                </div>
                <div className="sp-drawer-info-item">
                  <div className="sp-drawer-info-label">Phone</div>
                  <div className="sp-drawer-info-value">{supplier ? supplier.phone : "—"}</div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="sp-drawer-section">
              <h3 className="sp-drawer-section-title">Line Items</h3>
              <div style={{ overflowX: "auto" }}>
                <table className="sp-line-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th style={{ textAlign: "right" }}>Qty</th>
                      <th style={{ textAlign: "right" }}>Unit Price</th>
                      <th style={{ textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drawerPO.lineItems.map((li, idx) => (
                      <tr key={idx}>
                        <td>{li.material}</td>
                        <td style={{ textAlign: "right" }}>{li.qty.toLocaleString()}</td>
                        <td style={{ textAlign: "right" }}>{formatINR(li.unitPrice)}</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>{formatINR(li.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="sp-drawer-section">
              <h3 className="sp-drawer-section-title">Financial Summary</h3>
              <div className="sp-financial-grid">
                <div className="sp-financial-item">
                  <div className="sp-financial-label">Subtotal</div>
                  <div className="sp-financial-value">{formatINRFull(subtotal)}</div>
                </div>
                <div className="sp-financial-item">
                  <div className="sp-financial-label">GST (18%)</div>
                  <div className="sp-financial-value">{formatINRFull(tax)}</div>
                </div>
                <div className="sp-financial-item" style={{ background: "#ccfbf1" }}>
                  <div className="sp-financial-label" style={{ color: "#0d9488" }}>Grand Total</div>
                  <div className="sp-financial-value" style={{ color: "#0d9488" }}>{formatINRFull(total)}</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="sp-drawer-section">
              <h3 className="sp-drawer-section-title">Delivery Timeline</h3>
              <div className="sp-timeline">
                {timelineLabels.map((label, idx) => {
                  const Icon = timelineIcons[idx];
                  const stepMapping = [0, 2, 3, 5]; // draft, acknowledged, in_production, delivered
                  return (
                    <div key={idx} className="sp-timeline-step">
                      <div className={stepIdx >= stepMapping[idx] ? (stepIdx > stepMapping[idx] ? "sp-timeline-dot sp-timeline-dot-done" : "sp-timeline-dot sp-timeline-dot-current") : "sp-timeline-dot sp-timeline-dot-pending"}>
                        <Icon size={16} />
                      </div>
                      <span className="sp-timeline-label">{label}</span>
                      <span className="sp-timeline-date">{timelineDates[idx]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="sp-actions">
              <button className="sp-btn sp-btn-teal"><Send size={15} /> Send PO</button>
              <button className="sp-btn sp-btn-orange"><Truck size={15} /> Track Delivery</button>
              <button className="sp-btn sp-btn-outline"><FileText size={15} /> Generate Invoice</button>
              <button className="sp-btn sp-btn-outline"><MessageSquare size={15} /> Communicate</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="sp-root">
      {/* Header */}
      <div className="sp-header">
        <div className="sp-header-left">
          <div className="sp-header-icon"><Handshake size={24} /></div>
          <div>
            <h1 className="sp-header-title">Supplier Portal</h1>
            <p className="sp-header-subtitle">Self-service portal for supplier collaboration & management</p>
          </div>
        </div>
        <div className="sp-header-right">
          <span className="sp-header-stat">📊 {data.kpis.totalSuppliers} Suppliers</span>
          <span className="sp-header-stat">📦 {data.kpis.activeContracts} Active Contracts</span>
          <span className="sp-header-stat">⏱ {data.kpis.onTimeDelivery}% On-Time</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sp-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`sp-tab ${activeTab === tab ? "sp-tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Dashboard" && renderDashboard()}
      {activeTab === "Purchase Orders" && renderPurchaseOrders()}
      {activeTab === "Supplier Directory" && renderSupplierDirectory()}
      {activeTab === "Performance Scorecard" && renderPerformanceScorecard()}
      {activeTab === "Invoice & Payments" && renderInvoicePayments()}

      {/* Drawer */}
      {renderDrawer()}
    </div>
  );
}
