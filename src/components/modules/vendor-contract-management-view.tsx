"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileText, Upload, Download, Eye, Search, Filter, Clock, AlertTriangle,
  CheckCircle2, XCircle, ChevronRight, Calendar, DollarSign, IndianRupee,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ShieldCheck,
  ShieldAlert, Building2, User, Stamp, FileType, FolderOpen, Archive,
  RefreshCw, BarChart3, Activity, Target, Zap, Info, FileCheck,
  FileWarning, FileClock, Briefcase, Scale, PenLine, Trash2, Edit3,
  Copy, MoreVertical, ExternalLink, Lock, Unlock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface Vendor {
  id: string;
  name: string;
  code: string;
  category: string;
  region: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  totalContracts: number;
  activeContracts: number;
  totalValue: number;
  onboardingDate: string;
}

interface Contract {
  id: string;
  vendorId: string;
  vendorName: string;
  contractNo: string;
  title: string;
  type: "master" | "framework" | "spot" | "service" | "nda" | "sla";
  status: "active" | "expiring_soon" | "expired" | "draft" | "under_review" | "terminated" | "renewed";
  startDate: string;
  endDate: string;
  value: number;
  currency: string;
  terms: ContractTerms;
  amendments: Amendment[];
  documents: ContractDocument[];
  riskLevel: "low" | "medium" | "high";
  renewalType: "auto" | "manual" | "none";
  lastReviewed: string;
  owner: string;
  department: string;
}

interface ContractTerms {
  paymentTerms: string;
  deliveryTerms: string;
  warranty: string;
  penaltyClause: string;
  disputeResolution: string;
  forceMajeure: boolean;
  insuranceRequired: boolean;
  minOrderValue: number;
  maxOrderValue: number;
  creditPeriod: number;
}

interface Amendment {
  id: string;
  date: string;
  description: string;
  type: "price_change" | "term_change" | "scope_change" | "extension" | "termination_notice";
  impact: string;
}

interface ContractDocument {
  id: string;
  name: string;
  type: "contract" | "amendment" | "sla" | "invoice" | "insurance" | "certificate" | "correspondence";
  uploadedDate: string;
  size: string;
  uploadedBy: string;
  version: number;
}

interface ComplianceStatus {
  contractId: string;
  overall: number;
  insurance: "compliant" | "expiring" | "missing";
  performanceBond: "compliant" | "expiring" | "missing";
  certifications: "compliant" | "expiring" | "missing";
  payments: "on_time" | "delayed" | "overdue";
  slaCompliance: number;
  lastAudit: string;
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
  const rand = seededRandom(115115);

  const vendors: Vendor[] = [
    { id: "V-001", name: "Tata Steel Ltd", code: "TSL", category: "Raw Materials", region: "West", contactPerson: "Rajesh Mehta", email: "rajesh@tatasteel.com", phone: "+91-22-66658000", rating: 92, totalContracts: 8, activeContracts: 5, totalValue: 45000000, onboardingDate: "2020-03-15" },
    { id: "V-002", name: "Reliance Industries", code: "RIL", category: "Chemicals", region: "West", contactPerson: "Priya Shah", email: "priya@reliance.com", phone: "+91-22-30398000", rating: 88, totalContracts: 6, activeContracts: 4, totalValue: 62000000, onboardingDate: "2019-11-20" },
    { id: "V-003", name: "Mahindra Logistics", code: "MLL", category: "Logistics", region: "West", contactPerson: "Amit Patel", email: "amit@mahindralogistics.com", phone: "+91-22-40436000", rating: 85, totalContracts: 5, activeContracts: 3, totalValue: 28000000, onboardingDate: "2021-01-10" },
    { id: "V-004", name: "Asian Paints Ltd", code: "APL", category: "Packaging", region: "West", contactPerson: "Sneha Reddy", email: "sneha@asianpaints.com", phone: "+91-22-39994000", rating: 90, totalContracts: 4, activeContracts: 3, totalValue: 15000000, onboardingDate: "2021-06-01" },
    { id: "V-005", name: "ITC Packaging", code: "ITC", category: "Packaging", region: "East", contactPerson: "Vikram Singh", email: "vikram@itc.com", phone: "+91-33-22831000", rating: 78, totalContracts: 7, activeContracts: 4, totalValue: 32000000, onboardingDate: "2020-08-22" },
    { id: "V-006", name: "Godrej Consumer", code: "GCL", category: "FMCG", region: "West", contactPerson: "Neha Gupta", email: "neha@godrej.com", phone: "+91-22-39995000", rating: 82, totalContracts: 3, activeContracts: 2, totalValue: 8500000, onboardingDate: "2022-02-14" },
    { id: "V-007", name: "Bajaj Electricals", code: "BEL", category: "Electrical", region: "West", contactPerson: "Suresh Kumar", email: "suresh@bajajelectricals.com", phone: "+91-22-39826000", rating: 75, totalContracts: 4, activeContracts: 2, totalValue: 12000000, onboardingDate: "2021-09-05" },
    { id: "V-008", name: "Dabur India Ltd", code: "DIL", category: "FMCG", region: "North", contactPerson: "Anjali Verma", email: "anjali@dabur.com", phone: "+91-11-27658000", rating: 86, totalContracts: 5, activeContracts: 3, totalValue: 18500000, onboardingDate: "2020-12-01" },
  ];

  const contractTypes: Array<Contract["type"]> = ["master", "framework", "spot", "service", "nda", "sla"];
  const contractStatuses: Array<Contract["status"]> = ["active", "active", "active", "expiring_soon", "expired", "draft", "under_review", "terminated", "renewed"];
  const riskLevels: Array<Contract["riskLevel"]> = ["low", "low", "medium", "medium", "high"];
  const renewalTypes: Array<Contract["renewalType"]> = ["auto", "manual", "none"];
  const owners = ["Procurement Team", "Legal Team", "Operations Team", "Finance Team"];
  const departments = ["Procurement", "Legal", "Operations", "Finance", "Quality"];

  const contracts: Contract[] = [];
  let contractCounter = 0;

  vendors.forEach((vendor) => {
    const numContracts = 2 + Math.floor(rand() * 4);
    for (let i = 0; i < numContracts; i++) {
      contractCounter++;
      const type = contractTypes[Math.floor(rand() * contractTypes.length)];
      const status = contractStatuses[Math.floor(rand() * contractStatuses.length)];
      const risk = riskLevels[Math.floor(rand() * riskLevels.length)];
      const renewal = renewalTypes[Math.floor(rand() * renewalTypes.length)];
      const startMonth = 1 + Math.floor(rand() * 12);
      const startYear = 2022 + Math.floor(rand() * 3);
      const duration = 6 + Math.floor(rand() * 30);
      const endMonth = ((startMonth - 1 + duration) % 12) + 1;
      const endYear = startYear + Math.floor((startMonth - 1 + duration) / 12);
      const value = Math.round((500000 + rand() * 15000000) / 1000) * 1000;

      const paymentTerms = ["Net 30", "Net 45", "Net 60", "Net 90", "15 days EOM"][Math.floor(rand() * 5)];
      const deliveryTerms = ["FOB", "CIF", "DDP", "EXW", "FCA"][Math.floor(rand() * 5)];
      const warranties = ["12 months", "18 months", "24 months", "36 months", "None"][Math.floor(rand() * 5)];

      const numAmendments = Math.floor(rand() * 4);
      const amendments: Amendment[] = [];
      for (let a = 0; a < numAmendments; a++) {
        const types: Array<Amendment["type"]> = ["price_change", "term_change", "scope_change", "extension", "termination_notice"];
        amendments.push({
          id: `AMD-${contractCounter}-${a + 1}`,
          date: `${startYear}-${String(startMonth + a + 1).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
          description: ["Price revision for FY", "Delivery timeline update", "Scope expansion — new warehouse", "Contract extension by 6 months", "Notice for non-performance"][a],
          type: types[a],
          impact: ["₹" + (50000 + Math.floor(rand() * 200000)).toLocaleString("en-IN") + " value change", "No value impact", "+" + (5 + Math.floor(rand() * 15)) + "% scope increase", "+6 months duration", "Potential termination"][a],
        });
      }

      const docTypes: Array<ContractDocument["type"]> = ["contract", "amendment", "sla", "insurance", "certificate", "correspondence"];
      const numDocs = 2 + Math.floor(rand() * 5);
      const documents: ContractDocument[] = [];
      for (let d = 0; d < numDocs; d++) {
        documents.push({
          id: `DOC-${contractCounter}-${d + 1}`,
          name: [`${vendor.code}-MASTER-AGREEMENT.pdf`, `${vendor.code}-SLA-ANNEXURE.pdf`, `${vendor.code}-INSURANCE-CERT.pdf`, `${vendor.code}-PERFORMANCE-BOND.pdf`, `${vendor.code}-AMENDMENT-${d}.pdf`, `${vendor.code}-CORRESPONDENCE.pdf`][d],
          type: docTypes[Math.floor(rand() * docTypes.length)],
          uploadedDate: `${startYear}-${String(1 + Math.floor(rand() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
          size: [`${(100 + Math.floor(rand() * 900))} KB`, `${(1 + Math.floor(rand() * 5))} MB`][Math.floor(rand() * 2)],
          uploadedBy: ["Rajesh M.", "Priya S.", "Legal Dept", "Procurement"][Math.floor(rand() * 4)],
          version: 1 + Math.floor(rand() * 3),
        });
      }

      contracts.push({
        id: `CTR-2024-${String(contractCounter).padStart(4, "0")}`,
        vendorId: vendor.id,
        vendorName: vendor.name,
        contractNo: `CNTR-${vendor.code}-${2024}-${String(i + 1).padStart(3, "0")}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Supply Agreement — ${vendor.name}`,
        type, status,
        startDate: `${startYear}-${String(startMonth).padStart(2, "0")}-01`,
        endDate: `${endYear}-${String(endMonth).padStart(2, "0")}-28`,
        value, currency: "INR",
        terms: {
          paymentTerms, deliveryTerms, warranty: warranties[Math.floor(rand() * warranties.length)],
          penaltyClause: `${2 + Math.floor(rand() * 8)}% of order value for non-compliance`,
          disputeResolution: "Arbitration — Mumbai",
          forceMajeure: rand() > 0.2,
          insuranceRequired: rand() > 0.3,
          minOrderValue: Math.round(50000 + rand() * 200000),
          maxOrderValue: Math.round(2000000 + rand() * 8000000),
          creditPeriod: 30 + Math.floor(rand() * 90),
        },
        amendments, documents,
        riskLevel: risk,
        renewalType: renewal,
        lastReviewed: `${startYear}-${String(Math.min(12, startMonth + 3)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
        owner: owners[Math.floor(rand() * owners.length)],
        department: departments[Math.floor(rand() * departments.length)],
      });
    }
  });

  // Compliance
  const compliance: ComplianceStatus[] = contracts.slice(0, 20).map((c) => {
    const statuses: Array<"compliant" | "expiring" | "missing"> = ["compliant", "compliant", "expiring", "missing"];
    const payStatuses: Array<"on_time" | "delayed" | "overdue"> = ["on_time", "on_time", "delayed", "overdue"];
    return {
      contractId: c.id,
      overall: 60 + Math.floor(rand() * 40),
      insurance: statuses[Math.floor(rand() * statuses.length)],
      performanceBond: statuses[Math.floor(rand() * statuses.length)],
      certifications: statuses[Math.floor(rand() * statuses.length)],
      payments: payStatuses[Math.floor(rand() * payStatuses.length)],
      slaCompliance: 70 + Math.floor(rand() * 30),
      lastAudit: c.startDate,
    };
  });

  return { vendors, contracts, compliance };
}

// ============================================================================
// Constants
// ============================================================================
const TYPE_COLORS: Record<string, string> = {
  master: "#6366f1", framework: "#0ea5e9", spot: "#f97316",
  service: "#8b5cf6", nda: "#64748b", sla: "#22c55e",
};
const STATUS_COLORS: Record<string, string> = {
  active: "#22c55e", expiring_soon: "#f59e0b", expired: "#ef4444",
  draft: "#64748b", under_review: "#0ea5e9", terminated: "#dc2626", renewed: "#22c55e",
};
const STATUS_LABELS: Record<string, string> = {
  active: "Active", expiring_soon: "Expiring Soon", expired: "Expired",
  draft: "Draft", under_review: "Under Review", terminated: "Terminated", renewed: "Renewed",
};
const TYPE_LABELS: Record<string, string> = {
  master: "Master", framework: "Framework", spot: "Spot",
  service: "Service", nda: "NDA", sla: "SLA",
};
const GRADIENT = "linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)";
const COLORS = ["#f59e0b", "#ef4444", "#ec4899", "#f97316", "#dc2626", "#be123c"];

function FormatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// ============================================================================
// Main Component
// ============================================================================
export function VendorContractManagementView() {
  const { vendors, contracts, compliance } = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const filtered = useMemo(() => {
    let result = contracts;
    if (filterStatus !== "all") result = result.filter((c) => c.status === filterStatus);
    if (filterType !== "all") result = result.filter((c) => c.type === filterType);
    if (filterRisk !== "all") result = result.filter((c) => c.riskLevel === filterRisk);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.contractNo.toLowerCase().includes(q) || c.vendorName.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
      );
    }
    return result;
  }, [contracts, filterStatus, filterType, filterRisk, searchQuery]);

  const stats = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter((c) => c.status === "active").length;
    const expiring = contracts.filter((c) => c.status === "expiring_soon").length;
    const expired = contracts.filter((c) => c.status === "expired").length;
    const totalValue = contracts.reduce((s, c) => s + c.value, 0);
    const highRisk = contracts.filter((c) => c.riskLevel === "high").length;
    const avgCompliance = compliance.length > 0
      ? Math.round(compliance.reduce((s, c) => s + c.overall, 0) / compliance.length)
      : 0;
    return { total, active, expiring, expired, totalValue, highRisk, avgCompliance };
  }, [contracts, compliance]);

  const valueByType = useMemo(() => {
    const map: Record<string, number> = {};
    contracts.forEach((c) => { map[c.type] = (map[c.type] || 0) + c.value; });
    return Object.entries(map).map(([type, value]) => ({ type: TYPE_LABELS[type] || type, value, fill: TYPE_COLORS[type] || "#6b7280" }));
  }, [contracts]);

  const monthlyTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => {
      const mc = contracts.filter((_, i) => i % 6 === months.indexOf(month));
      return {
        month,
        new: 1 + Math.floor(Math.random() * 3),
        expiring: mc.filter((c) => c.status === "expiring_soon").length + Math.floor(Math.random() * 2),
        total: mc.length,
      };
    });
  }, [contracts]);

  const vendorContractCounts = useMemo(() => {
    const map: Record<string, { active: number; total: number; value: number }> = {};
    contracts.forEach((c) => {
      if (!map[c.vendorName]) map[c.vendorName] = { active: 0, total: 0, value: 0 };
      map[c.vendorName].total++;
      if (c.status === "active" || c.status === "renewed") map[c.vendorName].active++;
      map[c.vendorName].value += c.value;
    });
    return Object.entries(map).map(([name, d]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      fullName: name, ...d,
    }));
  }, [contracts]);

  const tabs = ["Contract Overview", "Vendor Directory", "Compliance Tracker", "Contract Inspector"];

  const selectedCompliance = useMemo(
    () => compliance.find((c) => c.contractId === selectedContract?.id),
    [compliance, selectedContract]
  );

  return (
    <div className="h-full flex flex-col vcm-container">
      {/* Header */}
      <div className="vcm-header px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="vcm-header-icon"><FileText className="h-6 w-6 text-white" /></div>
          <div>
            <h1 className="text-xl font-bold text-white">Vendor Contract Management</h1>
            <p className="text-xs text-white/70">Contract lifecycle, compliance tracking & document repository</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="vcm-header-badge"><FolderOpen className="h-3 w-3 mr-1" />{contracts.reduce((s, c) => s + c.documents.length, 0)} documents</Badge>
          <Badge className="vcm-header-badge bg-emerald-500/20 text-emerald-200"><CheckCircle2 className="h-3 w-3 mr-1" />{stats.avgCompliance}% compliance</Badge>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="vcm-tab-bar px-6 shrink-0">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} className={`vcm-tab ${activeTab === i ? "active" : ""}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Tab 0: Contract Overview */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* KPI Banner */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 vcm-kpi-grid">
              {[
                { label: "Total Contracts", value: stats.total, icon: FileText, color: "vcm-kpi-amber" },
                { label: "Active", value: stats.active, icon: CheckCircle2, color: "vcm-kpi-green" },
                { label: "Expiring Soon", value: stats.expiring, icon: Clock, color: "vcm-kpi-orange" },
                { label: "Expired", value: stats.expired, icon: AlertTriangle, color: "vcm-kpi-red" },
                { label: "Total Value", value: FormatINR(stats.totalValue), icon: IndianRupee, color: "vcm-kpi-pink" },
                { label: "High Risk", value: stats.highRisk, icon: ShieldAlert, color: "vcm-kpi-rose" },
              ].map((kpi) => (
                <div key={kpi.label} className={`vcm-kpi-card ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4 opacity-60" />
                  <div className="text-xl font-bold">{kpi.value}</div>
                  <div className="text-[10px] opacity-70">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="vcm-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-amber-500" /> Contract Value by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={valueByType} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v: number) => FormatINR(v)} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Value ₹">
                        {valueByType.map((e, i) => <Cell key={e.type} fill={e.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="vcm-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-pink-500" /> Contract Lifecycle Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <ComposedChart data={monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="new" fill="#22c55e" name="New" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expiring" fill="#f97316" name="Expiring" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} name="Total" dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="vcm-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-red-500" /> Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={Object.entries(
                        contracts.reduce((acc, c) => { acc[c.riskLevel] = (acc[c.riskLevel] || 0) + 1; return acc; }, {} as Record<string, number>)
                      ).map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: v, fill: k === "low" ? "#22c55e" : k === "medium" ? "#f59e0b" : "#ef4444" }))}
                        dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3} strokeWidth={0}
                      >
                        {["low", "medium", "high"].map((k, i) => <Cell key={k} fill={k === "low" ? "#22c55e" : k === "medium" ? "#f59e0b" : "#ef4444"} />)}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Contract Table */}
            <Card className="vcm-chart-card overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Stamp className="h-4 w-4 text-amber-500" /> Contracts ({filtered.length})</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="vcm-search-box">
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="vcm-search-input" />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="vcm-filter-select">
                      <option value="all">All Status</option>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="vcm-filter-select">
                      <option value="all">All Type</option>
                      {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className="vcm-filter-select">
                      <option value="all">All Risk</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="vcm-table">
                    <thead>
                      <tr>
                        <th>Contract #</th>
                        <th>Vendor</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>
                        <th>Risk</th>
                        <th>Docs</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.slice(0, 25).map((c) => (
                        <tr key={c.id} className="vcm-table-row" onClick={() => setSelectedContract(c)}>
                          <td className="font-mono text-xs font-medium">{c.contractNo}</td>
                          <td className="text-xs">{c.vendorName.length > 18 ? c.vendorName.substring(0, 18) + "..." : c.vendorName}</td>
                          <td><Badge className="text-[10px]" style={{ backgroundColor: TYPE_COLORS[c.type] + "20", color: TYPE_COLORS[c.type], border: "none" }}>{TYPE_LABELS[c.type]}</Badge></td>
                          <td className="font-mono text-xs text-right">{FormatINR(c.value)}</td>
                          <td className="text-xs">{c.startDate}</td>
                          <td className="text-xs">{c.endDate}</td>
                          <td><Badge variant={c.status === "active" || c.status === "renewed" ? "success" : c.status === "expiring_soon" ? "warning" : c.status === "expired" || c.status === "terminated" ? "destructive" : "default"} className="text-[10px]">{STATUS_LABELS[c.status]}</Badge></td>
                          <td><Badge variant={c.riskLevel === "low" ? "success" : c.riskLevel === "medium" ? "warning" : "destructive"} className="text-[10px]">{c.riskLevel}</Badge></td>
                          <td className="text-xs text-center">{c.documents.length}</td>
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

        {/* Tab 1: Vendor Directory */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {vendors.map((v) => {
                const vContracts = contracts.filter((c) => c.vendorId === v.id);
                const activeCount = vContracts.filter((c) => c.status === "active").length;
                return (
                  <div key={v.id} className="vcm-vendor-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="vcm-vendor-avatar">{v.name.charAt(0)}</div>
                        <div>
                          <h3 className="font-semibold text-sm">{v.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{v.code} · {v.category}</p>
                        </div>
                      </div>
                      <Badge variant={v.rating >= 85 ? "success" : v.rating >= 75 ? "warning" : "destructive"} className="text-[10px] font-mono">
                        {v.rating}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="vcm-vendor-stat"><span className="text-muted-foreground">Contracts</span><span className="font-semibold">{vContracts.length} ({activeCount} active)</span></div>
                      <div className="vcm-vendor-stat"><span className="text-muted-foreground">Total Value</span><span className="font-semibold font-mono">{FormatINR(vContracts.reduce((s, c) => s + c.value, 0))}</span></div>
                      <div className="vcm-vendor-stat"><span className="text-muted-foreground">Contact</span><span className="font-medium">{v.contactPerson}</span></div>
                      <div className="vcm-vendor-stat"><span className="text-muted-foreground">Region</span><span className="font-medium">{v.region}</span></div>
                    </div>
                    <div className="mt-3 flex gap-1 flex-wrap">
                      {vContracts.slice(0, 3).map((c) => (
                        <Badge key={c.id} className="text-[9px]" style={{ backgroundColor: TYPE_COLORS[c.type] + "20", color: TYPE_COLORS[c.type], border: "none" }}>
                          {TYPE_LABELS[c.type]}
                        </Badge>
                      ))}
                      {vContracts.length > 3 && <Badge variant="secondary" className="text-[9px]">+{vContracts.length - 3}</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vendor Contract Distribution */}
            <Card className="vcm-chart-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Building2 className="h-4 w-4 text-pink-500" /> Vendor Contract Value Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={vendorContractCounts.sort((a, b) => b.value - a.value)} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: number) => FormatINR(v)} />
                    <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} name="Contract Value ₹" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Compliance Tracker */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Avg Compliance", value: `${stats.avgCompliance}%`, icon: ShieldCheck, bg: "bg-emerald-500", desc: "across all audited contracts" },
                { label: "Insurance Gaps", value: compliance.filter((c) => c.insurance !== "compliant").length, icon: ShieldAlert, bg: "bg-red-500", desc: "missing or expiring" },
                { label: "Payment Issues", value: compliance.filter((c) => c.payments !== "on_time").length, icon: Clock, bg: "bg-amber-500", desc: "delayed or overdue" },
                { label: "SLA Compliance", value: `${Math.round(compliance.reduce((s, c) => s + c.slaCompliance, 0) / (compliance.length || 1))}%`, icon: Target, bg: "bg-blue-500", desc: "average across contracts" },
              ].map((kpi) => (
                <div key={kpi.label} className="vcm-compliance-card">
                  <div className={`w-10 h-10 rounded-lg ${kpi.bg} bg-opacity-10 flex items-center justify-center mb-2`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.bg.replace("bg-", "text-")}`} />
                  </div>
                  <div className="text-lg font-bold">{kpi.value}</div>
                  <div className="text-xs font-medium">{kpi.label}</div>
                  <div className="text-[10px] text-muted-foreground">{kpi.desc}</div>
                </div>
              ))}
            </div>

            <Card className="vcm-chart-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><FileCheck className="h-4 w-4 text-emerald-500" /> Contract Compliance Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="vcm-table">
                    <thead>
                      <tr>
                        <th>Contract</th>
                        <th>Vendor</th>
                        <th className="text-center">Insurance</th>
                        <th className="text-center">Perf. Bond</th>
                        <th className="text-center">Certifications</th>
                        <th className="text-center">Payments</th>
                        <th className="text-right">SLA %</th>
                        <th className="text-center">Overall</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compliance.map((c) => {
                        const contract = contracts.find((ct) => ct.id === c.contractId);
                        return (
                          <tr key={c.contractId} className="vcm-table-row">
                            <td className="font-mono text-xs">{contract?.contractNo || c.contractId}</td>
                            <td className="text-xs">{contract?.vendorName || "—"}</td>
                            <td className="text-center"><Badge variant={c.insurance === "compliant" ? "success" : c.insurance === "expiring" ? "warning" : "destructive"} className="text-[10px]">{c.insurance}</Badge></td>
                            <td className="text-center"><Badge variant={c.performanceBond === "compliant" ? "success" : c.performanceBond === "expiring" ? "warning" : "destructive"} className="text-[10px]">{c.performanceBond}</Badge></td>
                            <td className="text-center"><Badge variant={c.certifications === "compliant" ? "success" : c.certifications === "expiring" ? "warning" : "destructive"} className="text-[10px]">{c.certifications}</Badge></td>
                            <td className="text-center"><Badge variant={c.payments === "on_time" ? "success" : c.payments === "delayed" ? "warning" : "destructive"} className="text-[10px]">{c.payments}</Badge></td>
                            <td className="text-right font-mono text-xs">{c.slaCompliance}%</td>
                            <td className="text-center">
                              <span className={`vcm-score-badge ${c.overall >= 85 ? "vcm-score-green" : c.overall >= 70 ? "vcm-score-amber" : "vcm-score-red"}`}>{c.overall}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Contract Inspector */}
        {activeTab === 3 && (
          <div className="space-y-6">
            {selectedContract ? (
              <>
                {/* Header */}
                <div className="vcm-detail-header">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedContract.contractNo}</h2>
                      <p className="text-xs text-white/70">{selectedContract.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedContract.status === "active" ? "success" : selectedContract.status === "expiring_soon" ? "warning" : "destructive"}>{STATUS_LABELS[selectedContract.status]}</Badge>
                      <Badge variant={selectedContract.riskLevel === "low" ? "success" : selectedContract.riskLevel === "medium" ? "warning" : "destructive"}>{selectedContract.riskLevel} risk</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 mt-4">
                    {[
                      { label: "Value", value: FormatINR(selectedContract.value) },
                      { label: "Start", value: selectedContract.startDate },
                      { label: "End", value: selectedContract.endDate },
                      { label: "Renewal", value: selectedContract.renewalType },
                      { label: "Owner", value: selectedContract.owner },
                    ].map((s) => (
                      <div key={s.label} className="vcm-detail-stat">
                        <span className="text-[10px] text-white/60">{s.label}</span>
                        <span className="text-sm font-bold text-white">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms + Docs Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <Card className="vcm-chart-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2"><Scale className="h-4 w-4 text-amber-500" /> Contract Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { label: "Payment Terms", value: selectedContract.terms.paymentTerms },
                          { label: "Delivery Terms", value: selectedContract.terms.deliveryTerms },
                          { label: "Warranty", value: selectedContract.terms.warranty },
                          { label: "Penalty Clause", value: selectedContract.terms.penaltyClause },
                          { label: "Dispute Resolution", value: selectedContract.terms.disputeResolution },
                          { label: "Force Majeure", value: selectedContract.terms.forceMajeure ? "Yes" : "No" },
                          { label: "Insurance Required", value: selectedContract.terms.insuranceRequired ? "Yes" : "No" },
                          { label: "Credit Period", value: `${selectedContract.terms.creditPeriod} days` },
                          { label: "Min Order", value: FormatINR(selectedContract.terms.minOrderValue) },
                          { label: "Max Order", value: FormatINR(selectedContract.terms.maxOrderValue) },
                        ].map((t) => (
                          <div key={t.label} className="flex justify-between text-sm border-b border-dashed pb-2">
                            <span className="text-muted-foreground">{t.label}</span>
                            <span className="font-medium font-mono text-xs">{t.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="vcm-chart-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2"><FolderOpen className="h-4 w-4 text-pink-500" /> Documents ({selectedContract.documents.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedContract.documents.map((doc) => (
                          <div key={doc.id} className="vcm-doc-item">
                            <FileType className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">{doc.name}</div>
                              <div className="text-[10px] text-muted-foreground">{doc.type} · {doc.size} · v{doc.version} · {doc.uploadedBy}</div>
                            </div>
                            <Badge variant="secondary" className="text-[9px] shrink-0">{doc.uploadedDate}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Amendments */}
                {selectedContract.amendments.length > 0 && (
                  <Card className="vcm-chart-card vcm-amendments-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2"><PenLine className="h-4 w-4 text-orange-500" /> Amendments ({selectedContract.amendments.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedContract.amendments.map((amd) => (
                        <div key={amd.id} className="vcm-amendment-item">
                          <Badge className="text-[10px] bg-orange-100 text-orange-700 border-none">{amd.type.replace(/_/g, " ")}</Badge>
                          <span className="text-xs font-medium flex-1">{amd.description}</span>
                          <span className="text-xs text-muted-foreground">{amd.date}</span>
                          <Badge variant="outline" className="text-[10px]">{amd.impact}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Compliance Summary for this contract */}
                {selectedCompliance && (
                  <Card className="vcm-chart-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Compliance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${selectedCompliance.overall >= 85 ? "text-emerald-500" : selectedCompliance.overall >= 70 ? "text-amber-500" : "text-red-500"}`}>
                            {selectedCompliance.overall}%
                          </div>
                          <div className="text-xs text-muted-foreground">Overall Score</div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          {[
                            { label: "Insurance", value: selectedCompliance.insurance },
                            { label: "Perf. Bond", value: selectedCompliance.performanceBond },
                            { label: "Certifications", value: selectedCompliance.certifications },
                            { label: "Payments", value: selectedCompliance.payments },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2 text-sm">
                              {item.value === "compliant" || item.value === "on_time" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                               item.value === "expiring" || item.value === "delayed" ? <Clock className="h-4 w-4 text-amber-500" /> :
                               <XCircle className="h-4 w-4 text-red-500" />}
                              <span>{item.label}</span>
                              <Badge variant={item.value === "compliant" || item.value === "on_time" ? "success" : item.value === "expiring" || item.value === "delayed" ? "warning" : "destructive"} className="text-[10px] ml-auto">
                                {item.value.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Nav */}
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="text-xs"
                    onClick={() => { const i = contracts.findIndex((c) => c.id === selectedContract.id); if (i > 0) setSelectedContract(contracts[i - 1]); }}
                    disabled={contracts.findIndex((c) => c.id === selectedContract.id) === 0}>← Previous</Button>
                  <Button variant="outline" size="sm" className="text-xs"
                    onClick={() => { const i = contracts.findIndex((c) => c.id === selectedContract.id); if (i < contracts.length - 1) setSelectedContract(contracts[i + 1]); }}
                    disabled={contracts.findIndex((c) => c.id === selectedContract.id) === contracts.length - 1}>Next →</Button>
                </div>
              </>
            ) : (
              <Card className="vcm-chart-card">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Select a contract from the Overview tab to inspect details</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
