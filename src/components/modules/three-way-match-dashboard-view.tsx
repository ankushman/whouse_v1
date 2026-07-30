"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  GitCompareArrows, CheckCircle2, XCircle, AlertTriangle, Clock,
  ArrowUpRight, ArrowDownRight, FileText, Receipt, Package,
  TrendingUp, TrendingDown, Filter, Search, Eye, RefreshCw,
  ShieldCheck, ShieldAlert, DollarSign, IndianRupee, ChevronRight,
  FileCheck, FileWarning, FileClock, CircleDot, Scale, BarChart3,
  Activity, Target, Zap, AlertOctagon, Info,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface PurchaseOrder {
  id: string;
  supplier: string;
  supplierCode: string;
  warehouse: string;
  date: string;
  items: POItem[];
  totalAmount: number;
  currency: string;
  status: "approved" | "pending" | "partial" | "closed";
}

interface POItem {
  sku: string;
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
  uom: string;
}

interface GRN {
  id: string;
  poId: string;
  grnDate: string;
  receivedBy: string;
  warehouse: string;
  items: GRNItem[];
  status: "received" | "partial" | "rejected" | "pending";
}

interface GRNItem {
  sku: string;
  description: string;
  qtyReceived: number;
  qtyAccepted: number;
  qtyRejected: number;
  unitPrice: number;
  grnAmount: number;
  reason?: string;
}

interface Invoice {
  id: string;
  poId: string;
  grnId: string;
  invoiceNo: string;
  invoiceDate: string;
  supplier: string;
  items: InvoiceItem[];
  totalAmount: number;
  taxAmount: number;
  netAmount: number;
  status: "received" | "verified" | "approved" | "rejected" | "pending";
  paymentDue: string;
  paymentStatus: "paid" | "pending" | "overdue" | "partial";
}

interface InvoiceItem {
  sku: string;
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

interface MatchResult {
  poId: string;
  po: PurchaseOrder;
  grn: GRN | null;
  invoice: Invoice | null;
  matchStatus: "full_match" | "qty_variance" | "price_variance" | "partial_match" | "no_grn" | "no_invoice" | "no_match" | "over_invoice";
  matchScore: number;
  qtyVariance: number;
  priceVariance: number;
  amountVariance: number;
  discrepancies: Discrepancy[];
}

interface Discrepancy {
  type: "quantity" | "price" | "missing_grn" | "missing_invoice" | "extra_item" | "tax_mismatch";
  severity: "critical" | "warning" | "info";
  sku?: string;
  description: string;
  poValue?: number;
  actualValue?: number;
  variance?: number;
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

function generateData(): { pos: PurchaseOrder[]; grns: GRN[]; invoices: Invoice[]; matches: MatchResult[] } {
  const rand = seededRandom(114114);
  const suppliers = [
    { name: "Tata Steel Ltd", code: "SUP-TSL-001" },
    { name: "Reliance Industries", code: "SUP-REL-002" },
    { name: "Mahindra Logistics", code: "SUP-MLL-003" },
    { name: "Asian Paints Ltd", code: "SUP-APL-004" },
    { name: "ITC Packaging", code: "SUP-ITC-005" },
    { name: "Godrej Consumer", code: "SUP-GCL-006" },
    { name: "Bajaj Electricals", code: "SUP-BEL-007" },
    { name: "Dabur India Ltd", code: "SUP-DIL-008" },
  ];
  const warehouses = ["WH-MUM-01", "WH-DEL-02", "WH-BLR-03", "WH-MAS-04", "WH-CCU-05", "WH-HYD-06"];
  const skus = [
    { sku: "SKU-10001", desc: "Corrugated Box 12x8x4", price: 45 },
    { sku: "SKU-10002", desc: "Stretch Wrap Film 500mm", price: 120 },
    { sku: "SKU-10003", desc: "Pallet Wrap 300mm", price: 85 },
    { sku: "SKU-10004", desc: "Thermal Label Roll 100x150", price: 32 },
    { sku: "SKU-10005", desc: "Bubble Wrap Roll 1.5m", price: 95 },
    { sku: "SKU-10006", desc: "Packing Tape 48mm Brown", price: 18 },
    { sku: "SKU-10007", desc: "Safety Gloves (Box/100)", price: 350 },
    { sku: "SKU-10008", desc: "Forklift Battery 48V", price: 45000 },
    { sku: "SKU-10009", desc: "Racking Bolt M10x30", price: 12 },
    { sku: "SKU-10010", desc: "LED Bay Light 200W", price: 2800 },
  ];

  // Generate 30 POs
  const pos: PurchaseOrder[] = [];
  for (let i = 1; i <= 30; i++) {
    const supplier = suppliers[Math.floor(rand() * suppliers.length)];
    const wh = warehouses[Math.floor(rand() * warehouses.length)];
    const numItems = 1 + Math.floor(rand() * 4);
    const items: POItem[] = [];
    for (let j = 0; j < numItems; j++) {
      const skuData = skus[Math.floor(rand() * skus.length)];
      const qty = 50 + Math.floor(rand() * 950);
      items.push({ sku: skuData.sku, description: skuData.desc, qty, unitPrice: skuData.price, amount: qty * skuData.price, uom: rand() > 0.5 ? "pcs" : "box" });
    }
    const total = items.reduce((s, it) => s + it.amount, 0);
    const statuses: Array<"approved" | "pending" | "partial" | "closed"> = ["approved", "approved", "approved", "pending", "partial", "closed"];
    pos.push({
      id: `PO-2024-${String(i).padStart(4, "0")}`,
      supplier: supplier.name, supplierCode: supplier.code,
      warehouse: wh,
      date: `2024-${String(1 + Math.floor(rand() * 6)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
      items, totalAmount: total, currency: "INR",
      status: statuses[Math.floor(rand() * statuses.length)],
    });
  }

  // Generate GRNs (most POs have GRN)
  const grns: GRN[] = [];
  pos.forEach((po, i) => {
    if (rand() < 0.85) {
      const recvBy = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Reddy", "Vikram Singh"][Math.floor(rand() * 5)];
      const grnItems: GRNItem[] = [];
      let hasDiscrepancy = rand() < 0.3;
      po.items.forEach((it) => {
        const qtyRcvd = hasDiscrepancy ? Math.round(it.qty * (0.85 + rand() * 0.2)) : it.qty;
        const qtyRej = hasDiscrepancy && rand() < 0.15 ? Math.round(qtyRcvd * rand() * 0.05) : 0;
        const qtyAcc = qtyRcvd - qtyRej;
        const priceVar = hasDiscrepancy && rand() < 0.2 ? it.unitPrice * (0.95 + rand() * 0.1) : it.unitPrice;
        grnItems.push({
          sku: it.sku, description: it.description,
          qtyReceived: qtyRcvd, qtyAccepted: qtyAcc, qtyRejected: qtyRej,
          unitPrice: Math.round(priceVar),
          grnAmount: qtyAcc * Math.round(priceVar),
          reason: qtyRej > 0 ? "Damaged on arrival" : undefined,
        });
      });
      const grnStatuses: Array<"received" | "partial" | "rejected" | "pending"> = ["received", "received", "partial", "rejected"];
      grns.push({
        id: `GRN-2024-${String(i + 1).padStart(4, "0")}`,
        poId: po.id, grnDate: po.date,
        receivedBy: recvBy, warehouse: po.warehouse,
        items: grnItems,
        status: grnStatuses[Math.floor(rand() * grnStatuses.length)],
      });
    }
  });

  // Generate Invoices (most matched PO+GRN have invoices)
  const invoices: Invoice[] = [];
  pos.forEach((po, i) => {
    if (rand() < 0.78) {
      const grn = grns.find((g) => g.poId === po.id);
      const invItems: InvoiceItem[] = [];
      let hasPriceDiscrepancy = rand() < 0.25;
      po.items.forEach((it) => {
        const invPrice = hasPriceDiscrepancy ? Math.round(it.unitPrice * (0.97 + rand() * 0.12)) : it.unitPrice;
        const invQty = grn ? grn.items.find((gi) => gi.sku === it.sku)?.qtyAccepted ?? it.qty : it.qty;
        invItems.push({ sku: it.sku, description: it.description, qty: invQty, unitPrice: invPrice, amount: invQty * invPrice });
      });
      const total = invItems.reduce((s, it) => s + it.amount, 0);
      const tax = Math.round(total * 0.18);
      const statuses: Array<"received" | "verified" | "approved" | "rejected" | "pending"> = ["received", "verified", "approved", "pending"];
      const payStatuses: Array<"paid" | "pending" | "overdue" | "partial"> = ["paid", "paid", "pending", "overdue", "partial"];
      invoices.push({
        id: `INV-2024-${String(i + 1).padStart(4, "0")}`,
        poId: po.id,
        grnId: grn?.id ?? "",
        invoiceNo: `SUP-INV-${2024}${String(i + 1).padStart(5, "0")}`,
        invoiceDate: po.date,
        supplier: po.supplier,
        items: invItems, totalAmount: total, taxAmount: tax,
        netAmount: total + tax,
        status: statuses[Math.floor(rand() * statuses.length)],
        paymentDue: `2024-${String(Math.min(12, 1 + Math.floor(rand() * 6) + 3)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
        paymentStatus: payStatuses[Math.floor(rand() * payStatuses.length)],
      });
    }
  });

  // Compute 3-way match results
  const matches: MatchResult[] = pos.map((po) => {
    const grn = grns.find((g) => g.poId === po.id) ?? null;
    const invoice = invoices.find((inv) => inv.poId === po.id) ?? null;

    const discrepancies: Discrepancy[] = [];
    let qtyVariance = 0;
    let priceVariance = 0;

    if (!grn) {
      discrepancies.push({ type: "missing_grn", severity: "critical", description: "No GRN received for this PO" });
    }
    if (!invoice) {
      discrepancies.push({ type: "missing_invoice", severity: "warning", description: "No invoice received for this PO" });
    }

    if (grn && invoice) {
      po.items.forEach((poItem) => {
        const grnItem = grn.items.find((gi) => gi.sku === poItem.sku);
        const invItem = invoice.items.find((ii) => ii.sku === poItem.sku);

        if (grnItem) {
          const qtyDiff = grnItem.qtyAccepted - poItem.qty;
          if (Math.abs(qtyDiff) > 2) {
            qtyVariance += Math.abs(qtyDiff) * poItem.unitPrice;
            discrepancies.push({
              type: "quantity", severity: Math.abs(qtyDiff) > poItem.qty * 0.1 ? "critical" : "warning",
              sku: poItem.sku, description: `Qty variance for ${poItem.sku}: PO ${poItem.qty} vs GRN ${grnItem.qtyAccepted}`,
              poValue: poItem.qty, actualValue: grnItem.qtyAccepted, variance: qtyDiff,
            });
          }
          if (invItem && Math.abs(invItem.unitPrice - poItem.unitPrice) > 1) {
            priceVariance += Math.abs(invItem.unitPrice - poItem.unitPrice) * grnItem.qtyAccepted;
            discrepancies.push({
              type: "price", severity: Math.abs(invItem.unitPrice - poItem.unitPrice) > poItem.unitPrice * 0.1 ? "critical" : "warning",
              sku: poItem.sku, description: `Price variance for ${poItem.sku}: PO ₹${poItem.unitPrice} vs INV ₹${invItem.unitPrice}`,
              poValue: poItem.unitPrice, actualValue: invItem.unitPrice, variance: invItem.unitPrice - poItem.unitPrice,
            });
          }
        }
        if (grnItem && !invItem) {
          discrepancies.push({ type: "extra_item", severity: "info", sku: poItem.sku, description: `Item ${poItem.sku} in GRN but not in invoice` });
        }
      });
    }

    const amountVariance = invoice ? Math.abs(invoice.totalAmount - po.totalAmount) : po.totalAmount;
    let matchStatus: MatchResult["matchStatus"] = "full_match";
    if (!grn && !invoice) matchStatus = "no_match";
    else if (!grn) matchStatus = "no_grn";
    else if (!invoice) matchStatus = "no_invoice";
    else if (discrepancies.some((d) => d.severity === "critical")) matchStatus = invoice.totalAmount > po.totalAmount * 1.05 ? "over_invoice" : "qty_variance";
    else if (discrepancies.some((d) => d.severity === "warning")) matchStatus = "price_variance";
    else if (qtyVariance > 0 || priceVariance > 0) matchStatus = "partial_match";

    const matchScore = matchStatus === "full_match" ? 100
      : matchStatus === "partial_match" ? 85
      : matchStatus === "price_variance" ? 70
      : matchStatus === "qty_variance" ? 55
      : matchStatus === "over_invoice" ? 40
      : matchStatus === "no_grn" || matchStatus === "no_invoice" ? 20
      : 10;

    return { poId: po.id, po, grn, invoice, matchStatus, matchScore, qtyVariance, priceVariance, amountVariance, discrepancies };
  });

  return { pos, grns, invoices, matches };
}

// ============================================================================
// Constants
// ============================================================================
const MATCH_COLORS: Record<string, string> = {
  full_match: "#22c55e",
  partial_match: "#eab308",
  qty_variance: "#f97316",
  price_variance: "#f59e0b",
  no_grn: "#ef4444",
  no_invoice: "#ef4444",
  no_match: "#6b7280",
  over_invoice: "#dc2626",
};
const MATCH_LABELS: Record<string, string> = {
  full_match: "Full Match",
  partial_match: "Partial Match",
  qty_variance: "Qty Variance",
  price_variance: "Price Variance",
  no_grn: "No GRN",
  no_invoice: "No Invoice",
  no_match: "No Match",
  over_invoice: "Over Invoice",
};
const GRADIENT = "linear-gradient(135deg, #0ea5e9, #6366f1, #8b5cf6)";
const COLORS = ["#0ea5e9", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"];

// ============================================================================
// Helper Components
// ============================================================================
function MatchStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, "success" | "warning" | "destructive" | "default" | "secondary" | "outline"> = {
    full_match: "success", partial_match: "warning", qty_variance: "warning",
    price_variance: "warning", no_grn: "destructive", no_invoice: "destructive",
    no_match: "secondary", over_invoice: "destructive",
  };
  return <Badge variant={colorMap[status] || "default"} className="badge-interactive text-xs font-medium">{MATCH_LABELS[status] || status}</Badge>;
}

function VarianceCell({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (Math.abs(value) < 0.5) return <span className="text-muted-foreground text-xs">—</span>;
  const isGood = value <= 0;
  return (
    <span className={`text-xs font-mono flex items-center gap-0.5 ${isGood ? "text-emerald-600" : "text-red-600"}`}>
      {isGood ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
      ₹{Math.abs(Math.round(value)).toLocaleString("en-IN")}{suffix}
    </span>
  );
}

function FormatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// ============================================================================
// Main Component
// ============================================================================
export function ThreeWayMatchDashboardView() {
  const { pos, grns, invoices, matches } = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = matches;
    if (filterStatus !== "all") result = result.filter((m) => m.matchStatus === filterStatus);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) =>
        m.poId.toLowerCase().includes(q) || m.po.supplier.toLowerCase().includes(q) || m.po.warehouse.toLowerCase().includes(q)
      );
    }
    return result;
  }, [matches, filterStatus, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = matches.length;
    const fullMatch = matches.filter((m) => m.matchStatus === "full_match").length;
    const withDiscrepancy = matches.filter((m) => m.matchStatus !== "full_match" && m.matchStatus !== "no_match").length;
    const noGRN = matches.filter((m) => m.matchStatus === "no_grn").length;
    const noInvoice = matches.filter((m) => m.matchStatus === "no_invoice").length;
    const totalVariance = matches.reduce((s, m) => s + m.amountVariance, 0);
    const avgMatchScore = Math.round(matches.reduce((s, m) => s + m.matchScore, 0) / total);
    const matchRate = Math.round((fullMatch / total) * 100);
    return { total, fullMatch, withDiscrepancy, noGRN, noInvoice, totalVariance, avgMatchScore, matchRate };
  }, [matches]);

  // Trend data (monthly)
  const trendData = useMemo(() => {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
      const monthMatches = matches.slice(i * 5, (i + 1) * 5);
      return {
        month,
        total: monthMatches.length,
        matched: monthMatches.filter((m) => m.matchStatus === "full_match").length,
        variance: monthMatches.filter((m) => m.matchStatus !== "full_match").length,
        matchRate: monthMatches.length > 0 ? Math.round((monthMatches.filter((m) => m.matchStatus === "full_match").length / monthMatches.length) * 100) : 0,
        avgScore: Math.round(monthMatches.reduce((s, m) => s + m.matchScore, 0) / (monthMatches.length || 1)),
      };
    });
  }, [matches]);

  // Discrepancy distribution
  const discrepancyDist = useMemo(() => {
    const allDisc: Record<string, number> = {};
    matches.forEach((m) => m.discrepancies.forEach((d) => {
      allDisc[d.type] = (allDisc[d.type] || 0) + 1;
    }));
    return Object.entries(allDisc).map(([type, count]) => ({ type: type.replace(/_/g, " "), count, fill: COLORS[Object.keys(allDisc).indexOf(type) % COLORS.length] }));
  }, [matches]);

  // Supplier-wise match rate
  const supplierStats = useMemo(() => {
    const supplierMap: Record<string, { total: number; matched: number; variance: number }> = {};
    matches.forEach((m) => {
      if (!supplierMap[m.po.supplier]) supplierMap[m.po.supplier] = { total: 0, matched: 0, variance: 0 };
      supplierMap[m.po.supplier].total++;
      if (m.matchStatus === "full_match") supplierMap[m.po.supplier].matched++;
      supplierMap[m.po.supplier].variance += m.amountVariance;
    });
    return Object.entries(supplierMap).map(([name, d]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      fullName: name,
      total: d.total,
      matchRate: Math.round((d.matched / d.total) * 100),
      variance: Math.round(d.variance),
    }));
  }, [matches]);

  const tabs = ["Match Overview", "Discrepancy Analysis", "Supplier Analysis", "Detail Inspector"];

  return (
    <div className="h-full flex flex-col twm-container">
      {/* Header */}
      <div className="twm-header px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="twm-header-icon">
            <GitCompareArrows className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">3-Way Match Dashboard</h1>
            <p className="text-xs text-white/70">PO ↔ GRN ↔ Invoice auto-verification & discrepancy tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="badge-interactive twm-header-badge"><IndianRupee className="h-3 w-3 mr-1" />{FormatINR(stats.totalVariance)} at risk</Badge>
          <Badge className="badge-interactive twm-header-badge bg-emerald-500/20 text-emerald-200"><CheckCircle2 className="h-3 w-3 mr-1" />{stats.matchRate}% match rate</Badge>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="twm-tab-bar px-6 shrink-0">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} className={`twm-tab ${activeTab === i ? "active" : ""}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Tab 0: Match Overview */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* KPI Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 twm-kpi-grid">
              {[
                { label: "Total POs", value: stats.total, icon: FileText, color: "twm-kpi-blue" },
                { label: "Full Match", value: stats.fullMatch, icon: CheckCircle2, color: "twm-kpi-green" },
                { label: "Discrepancies", value: stats.withDiscrepancy, icon: AlertTriangle, color: "twm-kpi-amber" },
                { label: "Avg Match Score", value: stats.avgMatchScore, icon: Target, color: "twm-kpi-violet", suffix: "/100" },
              ].map((kpi) => (
                <div key={kpi.label} className={`twm-kpi-card ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5 opacity-60" />
                  <div className="text-2xl font-bold">{kpi.value}{kpi.suffix}</div>
                  <div className="text-xs opacity-70">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Missing Items Alert */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="twm-alert-card twm-alert-red">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-lg font-bold">{stats.noGRN} POs</div>
                  <div className="text-xs text-muted-foreground">Missing GRN — goods not received</div>
                </div>
              </div>
              <div className="twm-alert-card twm-alert-orange">
                <FileClock className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-lg font-bold">{stats.noInvoice} POs</div>
                  <div className="text-xs text-muted-foreground">Missing Invoice — billing pending</div>
                </div>
              </div>
              <div className="twm-alert-card twm-alert-cyan">
                <DollarSign className="h-5 w-5 text-cyan-500" />
                <div>
                  <div className="text-lg font-bold">{FormatINR(stats.totalVariance)}</div>
                  <div className="text-xs text-muted-foreground">Total variance amount at risk</div>
                </div>
              </div>
            </div>

            {/* Match Rate Trend + Distribution */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="twm-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Monthly Match Rate Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="matched" fill="#22c55e" name="Matched" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="variance" fill="#f97316" name="Discrepancy" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="matchRate" stroke="#6366f1" strokeWidth={2} name="Match %" dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="twm-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-violet-500" />
                    Match Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={Object.entries(
                        matches.reduce((acc, m) => { acc[m.matchStatus] = (acc[m.matchStatus] || 0) + 1; return acc; }, {} as Record<string, number>)
                      ).map(([k, v]) => ({ name: MATCH_LABELS[k] || k, value: v, fill: MATCH_COLORS[k] || "#6b7280" }))}
                        dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={2} strokeWidth={0}
                      >
                        {Object.entries(
                          matches.reduce((acc, m) => { acc[m.matchStatus] = (acc[m.matchStatus] || 0) + 1; return acc; }, {} as Record<string, number>)
                        ).map(([k], i) => (
                          <Cell key={k} fill={MATCH_COLORS[k] || "#6b7280"} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Match Table */}
            <Card className="twm-chart-card overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-blue-500" />
                    Purchase Order Match Results ({filtered.length} records)
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="twm-search-box">
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search PO, supplier, warehouse..."
                        className="twm-search-input"
                      />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="twm-filter-select">
                      <option value="all">All Status</option>
                      <option value="full_match">Full Match</option>
                      <option value="partial_match">Partial Match</option>
                      <option value="qty_variance">Qty Variance</option>
                      <option value="price_variance">Price Variance</option>
                      <option value="no_grn">No GRN</option>
                      <option value="no_invoice">No Invoice</option>
                      <option value="over_invoice">Over Invoice</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="glass-subtle p-0">
                <div className="overflow-x-auto">
                  <table className="twm-match-table">
                    <thead>
                      <tr>
                        <th>PO Number</th>
                        <th>Supplier</th>
                        <th>Warehouse</th>
                        <th>PO Amount</th>
                        <th>GRN Amount</th>
                        <th>Invoice Amount</th>
                        <th>Variance</th>
                        <th>Match Score</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((m) => (
                        <tr key={m.poId} className="twm-match-row" onClick={() => setSelectedMatch(m)}>
                          <td className="font-mono text-xs font-medium">{m.poId}</td>
                          <td className="text-xs">{m.po.supplier.length > 20 ? m.po.supplier.substring(0, 20) + "..." : m.po.supplier}</td>
                          <td className="text-xs font-mono">{m.po.warehouse}</td>
                          <td className="text-xs font-mono text-right">{FormatINR(m.po.totalAmount)}</td>
                          <td className="text-xs font-mono text-right">{m.grn ? FormatINR(m.grn.items.reduce((s, i) => s + i.grnAmount, 0)) : "—"}</td>
                          <td className="text-xs font-mono text-right">{m.invoice ? FormatINR(m.invoice.totalAmount) : "—"}</td>
                          <td className="text-right"><VarianceCell value={m.amountVariance} /></td>
                          <td className="text-center">
                            <span className={`twm-score-cell ${m.matchScore >= 80 ? "twm-score-green" : m.matchScore >= 50 ? "twm-score-amber" : "twm-score-red"}`}>
                              {m.matchScore}
                            </span>
                          </td>
                          <td><MatchStatusBadge status={m.matchStatus} /></td>
                          <td><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 1: Discrepancy Analysis */}
        {activeTab === 1 && (
          <div className="space-y-6">
            {/* Discrepancy Distribution Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="twm-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-orange-500" />
                    Discrepancy Types Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={discrepancyDist} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="type" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {discrepancyDist.map((entry, i) => (
                          <Cell key={entry.type} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="twm-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    Discrepancy Severity Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(["critical", "warning", "info"] as const).map((sev) => {
                      const count = matches.reduce((s, m) => s + m.discrepancies.filter((d) => d.severity === sev).length, 0);
                      const pct = matches.reduce((s, m) => s + m.discrepancies.length, 0) > 0
                        ? Math.round((count / matches.reduce((s, m) => s + m.discrepancies.length, 0)) * 100) : 0;
                      const color = sev === "critical" ? "#ef4444" : sev === "warning" ? "#f59e0b" : "#3b82f6";
                      return (
                        <div key={sev} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2 capitalize">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                              {sev}
                            </div>
                            <span className="font-mono">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 space-y-2">
                    <h4 className="text-sm font-semibold">Top Discrepancies</h4>
                    {matches.filter((m) => m.discrepancies.length > 0)
                      .sort((a, b) => b.discrepancies.length - a.discrepancies.length)
                      .slice(0, 5)
                      .map((m) => (
                        <div key={m.poId} className="twm-disc-item" onClick={() => { setSelectedMatch(m); setActiveTab(3); }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-medium">{m.poId}</span>
                              <MatchStatusBadge status={m.matchStatus} />
                            </div>
                            <span className="text-xs text-muted-foreground">{m.discrepancies.length} issues</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 truncate">
                            {m.discrepancies.map((d) => d.description).join(" | ")}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Discrepancies Table */}
            <Card className="twm-chart-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  All Discrepancies ({matches.reduce((s, m) => s + m.discrepancies.length, 0)} total)
                </CardTitle>
              </CardHeader>
              <CardContent className="glass-subtle p-0">
                <div className="overflow-x-auto max-h-80">
                  <table className="twm-match-table">
                    <thead className="sticky top-0">
                      <tr>
                        <th>PO</th>
                        <th>Severity</th>
                        <th>Type</th>
                        <th>SKU</th>
                        <th>Description</th>
                        <th>PO Value</th>
                        <th>Actual</th>
                        <th>Variance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.flatMap((m) =>
                        m.discrepancies.map((d, i) => (
                          <tr key={`${m.poId}-${i}`} className="twm-match-row">
                            <td className="font-mono text-xs">{m.poId}</td>
                            <td>
                              <Badge variant={d.severity === "critical" ? "destructive" : d.severity === "warning" ? "warning" : "default"} className="badge-interactive text-[10px]">
                                {d.severity}
                              </Badge>
                            </td>
                            <td className="text-xs capitalize">{d.type.replace(/_/g, " ")}</td>
                            <td className="font-mono text-xs">{d.sku || "—"}</td>
                            <td className="text-xs max-w-xs truncate">{d.description}</td>
                            <td className="font-mono text-xs text-right">{d.poValue !== undefined ? d.poValue : "—"}</td>
                            <td className="font-mono text-xs text-right">{d.actualValue !== undefined ? d.actualValue : "—"}</td>
                            <td className="text-right">
                              {d.variance !== undefined ? (
                                <span className={`text-xs font-mono ${d.variance <= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                  {d.variance > 0 ? "+" : ""}{d.variance}
                                </span>
                              ) : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Supplier Analysis */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="twm-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-indigo-500" />
                    Supplier Match Rate Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={supplierStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                      <Tooltip />
                      <Bar dataKey="matchRate" radius={[4, 4, 0, 0]} name="Match Rate %">
                        {supplierStats.map((entry, i) => (
                          <Cell key={entry.name} fill={entry.matchRate >= 80 ? "#22c55e" : entry.matchRate >= 50 ? "#f59e0b" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="twm-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-500" />
                    Supplier Variance Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={supplierStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number) => FormatINR(v)} />
                      <Bar dataKey="variance" fill="#f97316" radius={[4, 4, 0, 0]} name="Variance ₹" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Supplier Table */}
            <Card className="twm-chart-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Supplier Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="glass-subtle p-0">
                <div className="overflow-x-auto">
                  <table className="twm-match-table">
                    <thead>
                      <tr>
                        <th>Supplier</th>
                        <th className="text-right">Total POs</th>
                        <th className="text-right">Matched</th>
                        <th className="text-right">Match Rate</th>
                        <th className="text-right">Variance</th>
                        <th className="text-center">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierStats.sort((a, b) => b.matchRate - a.matchRate).map((s, i) => (
                        <tr key={s.fullName} className="twm-match-row">
                          <td className="text-xs font-medium">{s.fullName}</td>
                          <td className="text-xs font-mono text-right">{s.total}</td>
                          <td className="text-xs font-mono text-right">{s.total - (s.total - s.total * s.matchRate / 100)}</td>
                          <td className="text-right">
                            <Badge variant={s.matchRate >= 80 ? "success" : s.matchRate >= 50 ? "warning" : "destructive"} className="badge-interactive text-xs font-mono">
                              {s.matchRate}%
                            </Badge>
                          </td>
                          <td className="text-xs font-mono text-right">{FormatINR(s.variance)}</td>
                          <td className="text-center">
                            {i === 0 && <Badge className="badge-interactive twm-champ-badge"><Crown className="h-3 w-3 mr-0.5" /> Best</Badge>}
                            {i === supplierStats.length - 1 && <Badge variant="destructive" className="badge-interactive text-xs">Review</Badge>}
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

        {/* Tab 3: Detail Inspector */}
        {activeTab === 3 && (
          <div className="space-y-6">
            {/* PO Selector */}
            <div className="flex gap-2 flex-wrap">
              <div className="twm-search-box flex-1 max-w-sm">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search PO number..."
                  className="twm-search-input"
                />
              </div>
            </div>

            {selectedMatch ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="twm-detail-header">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedMatch.poId}</h2>
                      <p className="text-xs text-white/70">{selectedMatch.po.supplier} · {selectedMatch.po.warehouse} · {selectedMatch.po.date}</p>
                    </div>
                    <div className="ml-auto">
                      <MatchStatusBadge status={selectedMatch.matchStatus} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="twm-detail-stat">
                      <span className="text-[10px] text-white/60">PO Amount</span>
                      <span className="text-sm font-bold text-white">{FormatINR(selectedMatch.po.totalAmount)}</span>
                    </div>
                    <div className="twm-detail-stat">
                      <span className="text-[10px] text-white/60">GRN Amount</span>
                      <span className="text-sm font-bold text-white">{selectedMatch.grn ? FormatINR(selectedMatch.grn.items.reduce((s, i) => s + i.grnAmount, 0)) : "N/A"}</span>
                    </div>
                    <div className="twm-detail-stat">
                      <span className="text-[10px] text-white/60">Invoice Amount</span>
                      <span className="text-sm font-bold text-white">{selectedMatch.invoice ? FormatINR(selectedMatch.invoice.totalAmount) : "N/A"}</span>
                    </div>
                    <div className="twm-detail-stat">
                      <span className="text-[10px] text-white/60">Match Score</span>
                      <span className={`text-lg font-bold ${selectedMatch.matchScore >= 80 ? "text-emerald-300" : selectedMatch.matchScore >= 50 ? "text-amber-300" : "text-red-300"}`}>
                        {selectedMatch.matchScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Line-by-line comparison */}
                <Card className="twm-chart-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <GitCompareArrows className="h-4 w-4 text-blue-500" />
                      Line-by-Line Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="glass-subtle p-0">
                    <div className="overflow-x-auto">
                      <table className="twm-match-table">
                        <thead>
                          <tr>
                            <th>SKU</th>
                            <th>Description</th>
                            <th className="text-right">PO Qty</th>
                            <th className="text-right">PO Price</th>
                            <th className="text-right">PO Amount</th>
                            <th className="text-right">GRN Qty</th>
                            <th className="text-right">GRN Price</th>
                            <th className="text-right">GRN Amount</th>
                            <th className="text-right">INV Qty</th>
                            <th className="text-right">INV Price</th>
                            <th className="text-right">INV Amount</th>
                            <th className="text-center">Match</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedMatch.po.items.map((poItem) => {
                            const grnItem = selectedMatch.grn?.items.find((g) => g.sku === poItem.sku);
                            const invItem = selectedMatch.invoice?.items.find((inv) => inv.sku === poItem.sku);
                            const qtyMatch = grnItem ? Math.abs(grnItem.qtyAccepted - poItem.qty) <= 2 : !grnItem;
                            const priceMatch = grnItem && invItem ? Math.abs(invItem.unitPrice - poItem.unitPrice) <= 1 : true;
                            const lineMatch = qtyMatch && priceMatch && grnItem && invItem;
                            return (
                              <tr key={poItem.sku} className={`twm-match-row ${!lineMatch ? "twm-row-alert" : ""}`}>
                                <td className="font-mono text-xs">{poItem.sku}</td>
                                <td className="text-xs">{poItem.description}</td>
                                <td className="font-mono text-xs text-right">{poItem.qty}</td>
                                <td className="font-mono text-xs text-right">₹{poItem.unitPrice}</td>
                                <td className="font-mono text-xs text-right">{FormatINR(poItem.amount)}</td>
                                <td className="font-mono text-xs text-right">{grnItem ? grnItem.qtyAccepted : "—"}</td>
                                <td className="font-mono text-xs text-right">{grnItem ? `₹${grnItem.unitPrice}` : "—"}</td>
                                <td className="font-mono text-xs text-right">{grnItem ? FormatINR(grnItem.grnAmount) : "—"}</td>
                                <td className="font-mono text-xs text-right">{invItem ? invItem.qty : "—"}</td>
                                <td className="font-mono text-xs text-right">{invItem ? `₹${invItem.unitPrice}` : "—"}</td>
                                <td className="font-mono text-xs text-right">{invItem ? FormatINR(invItem.amount) : "—"}</td>
                                <td className="text-center">
                                  {lineMatch && grnItem && invItem ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> :
                                   <XCircle className="h-4 w-4 text-red-500 mx-auto" />}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Discrepancies for this PO */}
                {selectedMatch.discrepancies.length > 0 && (
                  <Card className="twm-chart-card twm-alerts-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        Discrepancies ({selectedMatch.discrepancies.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="glass-subtle space-y-2">
                      {selectedMatch.discrepancies.map((d, i) => (
                        <div key={i} className={`twm-disc-detail ${d.severity === "critical" ? "twm-disc-critical" : d.severity === "warning" ? "twm-disc-warning" : "twm-disc-info"}`}>
                          <Badge variant={d.severity === "critical" ? "destructive" : d.severity === "warning" ? "warning" : "default"} className="badge-interactive text-[10px]">
                            {d.severity}
                          </Badge>
                          <span className="text-xs capitalize">{d.type.replace(/_/g, " ")}</span>
                          <span className="text-xs flex-1">{d.description}</span>
                          {d.variance !== undefined && (
                            <span className={`text-xs font-mono ${d.variance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                              {d.variance > 0 ? "+" : ""}{d.variance}
                            </span>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="btn-outline-animate text-xs"
                    onClick={() => {
                      const idx = matches.findIndex((m) => m.poId === selectedMatch.poId);
                      if (idx > 0) setSelectedMatch(matches[idx - 1]);
                    }}
                    disabled={matches.findIndex((m) => m.poId === selectedMatch.poId) === 0}
                  >
                    ← Previous PO
                  </Button>
                  <Button variant="outline" size="sm" className="btn-outline-animate text-xs"
                    onClick={() => {
                      const idx = matches.findIndex((m) => m.poId === selectedMatch.poId);
                      if (idx < matches.length - 1) setSelectedMatch(matches[idx + 1]);
                    }}
                    disabled={matches.findIndex((m) => m.poId === selectedMatch.poId) === matches.length - 1}
                  >
                    Next PO →
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="twm-chart-card">
                <CardContent className="glass-subtle py-12 text-center">
                  <FileCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Select a PO from the Match Overview tab to inspect its 3-way match details</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
