"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  Sprout, Search, TrendingUp, TrendingDown, Target,
  AlertTriangle, CheckCircle2, XCircle, Package,
  Truck, ChevronLeft, ChevronRight, Eye, BarChart3,
  ArrowUpRight, ArrowDownRight, Download, RefreshCw,
  Filter, Calendar, Leaf, Globe, Factory, Zap,
  Thermometer, Cloud, Recycle, TreePine, Wind,
  Sun, Droplets, Flame, Lightbulb, Award, MapPin,
  FileText, Activity, Timer, IndianRupee, Users,
  CircleDot, ArrowRight, Percent, Gauge, Layers,
  Building2, Warehouse, Route, Fuel, BatteryCharging,
  Mountain, Waves,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
type EmissionSource = "electricity" | "diesel_generators" | "fleet_vehicles" | "refrigeration" | "packaging" | "waste_disposal" | "air_freight" | "third_party_logistics";
type Scope = "scope_1" | "scope_2" | "scope_3";
type OffsetStatus = "active" | "completed" | "pending" | "expired";
type InitiativeStatus = "active" | "planned" | "completed" | "on_hold";
type ComplianceLevel = "compliant" | "near_compliance" | "at_risk" | "non_compliant";

interface EmissionRecord {
  id: string;
  date: string;
  warehouseId: string;
  warehouseName: string;
  city: string;
  source: EmissionSource;
  scope: Scope;
  co2eTonnes: number;
  costINR: number;
  intensity: number;
  baseline: number;
  variancePct: number;
  category: string;
  notes: string;
}

interface CarbonCredit {
  id: string;
  projectName: string;
  type: string;
  credits: number;
  pricePerCredit: number;
  totalValue: number;
  startDate: string;
  endDate: string;
  status: OffsetStatus;
  verified: boolean;
  standard: string;
  location: string;
}

interface GreenInitiative {
  id: string;
  name: string;
  type: string;
  status: InitiativeStatus;
  investmentINR: number;
  co2SavedPerYear: number;
  roi: number;
  paybackMonths: number;
  startDate: string;
  warehouse: string;
  impact: string;
}

interface WarehouseEmission {
  name: string;
  city: string;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  target: number;
  intensity: number;
  compliance: ComplianceLevel;
  greenEnergyPct: number;
  solarCapacity: number;
  evFleetPct: number;
}

interface MonthlyTrend {
  month: string;
  totalEmissions: number;
  scope1: number;
  scope2: number;
  scope3: number;
  target: number;
  intensity: number;
  costINR: number;
  offsets: number;
  netEmissions: number;
}

interface ScopeAllocation {
  source: string;
  emissions: number;
  pct: number;
  trend: string;
  color: string;
}

// ============================================================================
// Seeded Random
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ============================================================================
// Formatters
// ============================================================================
function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  return String(n);
}

function formatINR(amount: number): string {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `\u20b9${(amount / 1000).toFixed(1)} K`;
  return `\u20b9${amount.toFixed(0)}`;
}

// ============================================================================
// Mock Data Generator
// ============================================================================
function generateData() {
  const rand = seededRandom(163163);
  const ri = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
  const rf = (min: number, max: number) => rand() * (max - min) + min;
  const pick = <T,>(arr: T[]): T => arr[ri(0, arr.length - 1)];

  const allSources: EmissionSource[] = ["electricity", "diesel_generators", "fleet_vehicles", "refrigeration", "packaging", "waste_disposal", "air_freight", "third_party_logistics"];
  const allScopes: Scope[] = ["scope_1", "scope_2", "scope_3"];
  const allOffsetStatuses: OffsetStatus[] = ["active", "completed", "pending", "expired"];
  const allInitiativeStatuses: InitiativeStatus[] = ["active", "planned", "completed", "on_hold"];
  const allComplianceLevels: ComplianceLevel[] = ["compliant", "near_compliance", "at_risk", "non_compliant"];

  const warehouses = [
    { id: "WH-001", name: "Delhi NCR Hub", city: "Delhi" },
    { id: "WH-002", name: "Mumbai Central", city: "Mumbai" },
    { id: "WH-003", name: "Bengaluru South", city: "Bengaluru" },
    { id: "WH-004", name: "Hyderabad East", city: "Hyderabad" },
    { id: "WH-005", name: "Kolkata Warehouse", city: "Kolkata" },
    { id: "WH-006", name: "Chennai Port WH", city: "Chennai" },
    { id: "WH-007", name: "Pune Distribution", city: "Pune" },
    { id: "WH-008", name: "Jaipur Regional", city: "Jaipur" },
    { id: "WH-009", name: "Lucknow North", city: "Lucknow" },
    { id: "WH-010", name: "Ahmedabad West", city: "Ahmedabad" },
  ];

  const sourceCategories: Record<EmissionSource, string> = {
    electricity: "Energy", diesel_generators: "Energy", fleet_vehicles: "Transport",
    refrigeration: "Refrigeration", packaging: "Materials", waste_disposal: "Waste",
    air_freight: "Transport", third_party_logistics: "Transport",
  };

  const scopeDefaults: Record<EmissionSource, Scope> = {
    electricity: "scope_2", diesel_generators: "scope_1", fleet_vehicles: "scope_1",
    refrigeration: "scope_2", packaging: "scope_3", waste_disposal: "scope_3",
    air_freight: "scope_3", third_party_logistics: "scope_3",
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // 400 emission records
  const emissions: EmissionRecord[] = [];
  for (let i = 0; i < 400; i++) {
    const wh = pick(warehouses);
    const source = pick(allSources);
    const scope = scopeDefaults[source];
    const co2eBase = source === "air_freight" ? rf(5, 25) : source === "fleet_vehicles" ? rf(1, 12) : source === "electricity" ? rf(2, 18) : source === "diesel_generators" ? rf(3, 15) : source === "refrigeration" ? rf(1, 8) : source === "packaging" ? rf(0.5, 4) : source === "waste_disposal" ? rf(0.3, 3) : rf(1, 6);
    const co2e = Math.round(co2eBase * 100) / 100;
    const baseline = co2e * rf(1.05, 1.3);
    const variancePct = Math.round(((co2e - baseline) / baseline) * 1000) / 10;
    const d = new Date(2024, ri(0, 11), ri(1, 28));
    emissions.push({
      id: `CF-${String(i + 1).padStart(4, '0')}`,
      date: d.toISOString(),
      warehouseId: wh.id,
      warehouseName: wh.name,
      city: wh.city,
      source,
      scope,
      co2eTonnes: co2e,
      costINR: Math.round(co2e * rf(800, 2500)),
      intensity: Math.round(rf(0.02, 0.15) * 1000) / 1000,
      baseline: Math.round(baseline * 100) / 100,
      variancePct,
      category: sourceCategories[source],
      notes: "",
    });
  }

  // Monthly trends
  const monthlyTrends: MonthlyTrend[] = months.map((month, i) => {
    const s1 = ri(180, 260);
    const s2 = ri(200, 350);
    const s3 = ri(120, 220);
    const total = s1 + s2 + s3;
    return {
      month,
      totalEmissions: total,
      scope1: s1,
      scope2: s2,
      scope3: s3,
      target: 650 - i * 8,
      intensity: Math.round(rf(0.06, 0.1) * 1000) / 1000,
      costINR: total * ri(1200, 2000),
      offsets: Math.round(total * rf(0.05, 0.15)),
      netEmissions: total - Math.round(total * rf(0.05, 0.15)),
    };
  });

  // Warehouse emissions
  const warehouseEmissions: WarehouseEmission[] = warehouses.map((wh, i) => {
    const s1 = ri(40, 90);
    const s2 = ri(50, 120);
    const s3 = ri(30, 70);
    const total = s1 + s2 + s3;
    return {
      name: wh.name,
      city: wh.city,
      scope1: s1,
      scope2: s2,
      scope3: s3,
      total,
      target: Math.round(total * rf(0.75, 0.9)),
      intensity: Math.round(rf(0.04, 0.12) * 1000) / 1000,
      compliance: pick(allComplianceLevels),
      greenEnergyPct: ri(10, 65),
      solarCapacity: ri(0, 500),
      evFleetPct: ri(5, 40),
    };
  });

  // Scope allocation
  const scopeAllocation: ScopeAllocation[] = [
    { source: "Electricity", emissions: 245, pct: 32.4, trend: "down", color: "#3b82f6" },
    { source: "Fleet Vehicles", emissions: 168, pct: 22.2, trend: "down", color: "#f97316" },
    { source: "Diesel Generators", emissions: 98, pct: 13.0, trend: "up", color: "#ef4444" },
    { source: "Refrigeration", emissions: 86, pct: 11.4, trend: "stable", color: "#06b6d4" },
    { source: "Air Freight", emissions: 72, pct: 9.5, trend: "down", color: "#a855f7" },
    { source: "Packaging", emissions: 42, pct: 5.6, trend: "down", color: "#22c55e" },
    { source: "Waste Disposal", emissions: 28, pct: 3.7, trend: "stable", color: "#f59e0b" },
    { source: "3PL Logistics", emissions: 18, pct: 2.4, trend: "up", color: "#64748b" },
  ];

  // Carbon credits
  const carbonCredits: CarbonCredit[] = [
    { id: "CC-001", projectName: "Rajasthan Solar Farm", type: "Renewable Energy", credits: 2500, pricePerCredit: 850, totalValue: 2125000, startDate: "2024-01-01", endDate: "2024-12-31", status: "active", verified: true, standard: "VCS", location: "Jodhpur, Rajasthan" },
    { id: "CC-002", projectName: "Tamil Nadu Wind Energy", type: "Wind Energy", credits: 1800, pricePerCredit: 920, totalValue: 1656000, startDate: "2024-03-01", endDate: "2025-02-28", status: "active", verified: true, standard: "Gold Standard", location: "Coimbatore, TN" },
    { id: "CC-003", projectName: "Madhya Pradesh Forest", type: "Afforestation", credits: 3200, pricePerCredit: 650, totalValue: 2080000, startDate: "2023-06-01", endDate: "2024-05-31", status: "active", verified: true, standard: "VCS", location: "Bhopal, MP" },
    { id: "CC-004", projectName: "Gujarat Biogas Plant", type: "Biogas", credits: 900, pricePerCredit: 1100, totalValue: 990000, startDate: "2024-01-01", endDate: "2024-12-31", status: "active", verified: false, standard: "CDM", location: "Ahmedabad, Gujarat" },
    { id: "CC-005", projectName: "Karnataka Hydro Power", type: "Hydro", credits: 1500, pricePerCredit: 780, totalValue: 1170000, startDate: "2023-09-01", endDate: "2024-08-31", status: "active", verified: true, standard: "Gold Standard", location: "Mysore, Karnataka" },
    { id: "CC-006", projectName: "Maharashtra Waste-to-Energy", type: "Waste Recovery", credits: 600, pricePerCredit: 950, totalValue: 570000, startDate: "2024-02-01", endDate: "2025-01-31", status: "pending", verified: false, standard: "VCS", location: "Pune, Maharashtra" },
    { id: "CC-007", projectName: "Himachal Reforestation", type: "Afforestation", credits: 4200, pricePerCredit: 520, totalValue: 2184000, startDate: "2023-01-01", endDate: "2024-12-31", status: "completed", verified: true, standard: "VCS", location: "Dharamshala, HP" },
    { id: "CC-008", projectName: "Telangana Solar Park", type: "Renewable Energy", credits: 2800, pricePerCredit: 720, totalValue: 2016000, startDate: "2022-06-01", endDate: "2023-05-31", status: "expired", verified: true, standard: "Gold Standard", location: "Hyderabad, Telangana" },
  ];

  // Green initiatives
  const greenInitiatives: GreenInitiative[] = [
    { id: "GI-001", name: "Solar Panel Installation - Delhi Hub", type: "Solar Energy", status: "active", investmentINR: 4500000, co2SavedPerYear: 85, roi: 22, paybackMonths: 54, startDate: "2024-01-15", warehouse: "WH-001", impact: "High" },
    { id: "GI-002", name: "EV Fleet Transition - Mumbai", type: "Electric Vehicles", status: "active", investmentINR: 12000000, co2SavedPerYear: 120, roi: 18, paybackMonths: 66, startDate: "2024-03-01", warehouse: "WH-002", impact: "High" },
    { id: "GI-003", name: "LED Lighting Retrofit - All WH", type: "Energy Efficiency", status: "completed", investmentINR: 2800000, co2SavedPerYear: 45, roi: 35, paybackMonths: 34, startDate: "2023-06-01", warehouse: "All", impact: "Medium" },
    { id: "GI-004", name: "Biogas from Organic Waste", type: "Waste Management", status: "active", investmentINR: 6800000, co2SavedPerYear: 65, roi: 15, paybackMonths: 80, startDate: "2024-04-01", warehouse: "WH-003", impact: "Medium" },
    { id: "GI-005", name: "Green Packaging Initiative", type: "Sustainable Packaging", status: "active", investmentINR: 3500000, co2SavedPerYear: 38, roi: 12, paybackMonths: 100, startDate: "2024-02-01", warehouse: "All", impact: "Medium" },
    { id: "GI-006", name: "Rainwater Harvesting - Chennai", type: "Water Conservation", status: "completed", investmentINR: 1200000, co2SavedPerYear: 12, roi: 28, paybackMonths: 43, startDate: "2023-09-01", warehouse: "WH-006", impact: "Low" },
    { id: "GI-007", name: "Cold Chain Optimization", type: "Refrigeration", status: "planned", investmentINR: 9200000, co2SavedPerYear: 95, roi: 20, paybackMonths: 60, startDate: "2025-01-01", warehouse: "WH-005", impact: "High" },
    { id: "GI-008", name: "Smart HVAC System - Bengaluru", type: "Energy Efficiency", status: "on_hold", investmentINR: 5500000, co2SavedPerYear: 55, roi: 25, paybackMonths: 48, startDate: "2024-08-01", warehouse: "WH-003", impact: "Medium" },
    { id: "GI-009", name: "Warehouse Roof Garden", type: "Green Infrastructure", status: "planned", investmentINR: 1800000, co2SavedPerYear: 18, roi: 8, paybackMonths: 150, startDate: "2025-03-01", warehouse: "WH-004", impact: "Low" },
    { id: "GI-010", name: "Route Optimization AI", type: "Transport Efficiency", status: "active", investmentINR: 7200000, co2SavedPerYear: 72, roi: 30, paybackMonths: 40, startDate: "2024-01-01", warehouse: "All", impact: "High" },
  ];

  // Carbon intensity benchmarks
  const benchmarks = [
    { region: "North India", avg: 0.085, target: 0.065, best: 0.042 },
    { region: "South India", avg: 0.072, target: 0.055, best: 0.035 },
    { region: "West India", avg: 0.078, target: 0.060, best: 0.038 },
    { region: "East India", avg: 0.092, target: 0.070, best: 0.048 },
    { region: "Central India", avg: 0.088, target: 0.068, best: 0.045 },
  ];

  // Alerts
  const alerts = [
    { id: 1, type: "critical", title: "Delhi NCR emissions exceed monthly target by 18%", message: "Scope 1 emissions from diesel generators spiking due to power cuts.", time: "2 hr ago" },
    { id: 2, type: "warning", title: "Carbon credit CC-006 pending verification", message: "Gujarat Waste-to-Energy project awaiting VCS audit since 30 days.", time: "5 hr ago" },
    { id: 3, type: "warning", title: "Kolkata warehouse nearing at-risk compliance", message: "GHG intensity at 0.112 tCO2e/unit vs target of 0.085.", time: "8 hr ago" },
    { id: 4, type: "info", title: "Quarterly ESG report generation due", message: "Q3 2024 emissions data compilation deadline: 5 days.", time: "12 hr ago" },
    { id: 5, type: "critical", title: "Mumbai Central scope 3 emissions up 24%", message: "Third-party logistics partner emissions surged unexpectedly.", time: "1 day ago" },
    { id: 6, type: "info", title: "New solar capacity approved", message: "500 kW rooftop solar approved for Bengaluru South Hub.", time: "1 day ago" },
  ];

  return {
    emissions, monthlyTrends, warehouseEmissions, scopeAllocation,
    carbonCredits, greenInitiatives, benchmarks, alerts,
    allSources, allScopes, allOffsetStatuses, allInitiativeStatuses, allComplianceLevels,
    warehouses, months, monthsFull,
  };
}

// ============================================================================
// Component
// ============================================================================
export default function CarbonFootprintTrackerView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [initiativeStatusFilter, setInitiativeStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [drawerRecord, setDrawerRecord] = useState<EmissionRecord | null>(null);
  const perPage = 35;

  const tabs = ["Carbon Dashboard", "Emission Records", "Carbon Credits", "Green Initiatives", "Compliance"];

  // ── Dashboard KPIs
  const totalEmissions = data.monthlyTrends.reduce((s, m) => s + m.totalEmissions, 0);
  const totalOffsets = data.monthlyTrends.reduce((s, m) => s + m.offsets, 0);
  const netEmissions = totalEmissions - totalOffsets;
  const kpis = useMemo(() => [
    { label: "Total Emissions", value: `${(totalEmissions / 1000).toFixed(1)}K`, sub: "tCO2e this year", icon: Cloud, color: "#ef4444", change: "+4.2%" },
    { label: "Carbon Offsets", value: `${(totalOffsets / 1000).toFixed(1)}K`, sub: "tCO2e offset", icon: TreePine, color: "#22c55e", change: "+18.5%" },
    { label: "Net Emissions", value: `${(netEmissions / 1000).toFixed(1)}K`, sub: "tCO2e net", icon: Leaf, color: "#10b981", change: "-8.3%" },
    { label: "Intensity Index", value: "0.076", sub: "tCO2e/unit shipped", icon: Gauge, color: "#3b82f6", change: "-12.1%" },
    { label: "Carbon Credits", value: `${data.carbonCredits.reduce((s, c) => s + c.credits, 0).toLocaleString()}`, sub: "credits available", icon: Award, color: "#f59e0b", change: "+6.2%" },
    { label: "Green Investment", value: formatINR(data.greenInitiatives.reduce((s, g) => s + g.investmentINR, 0)), sub: "total deployed", icon: Sprout, color: "#06b6d4", change: "+22%" },
  ], []);

  // ── Filtered emissions
  const filteredEmissions = useMemo(() => {
    let filtered = data.emissions;
    if (scopeFilter !== "all") filtered = filtered.filter(e => e.scope === scopeFilter);
    if (sourceFilter !== "all") filtered = filtered.filter(e => e.source === sourceFilter);
    if (categoryFilter !== "all") filtered = filtered.filter(e => e.category === categoryFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.id.toLowerCase().includes(q) ||
        e.warehouseName.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.source.includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [data, scopeFilter, sourceFilter, categoryFilter, searchQuery]);

  const paginatedEmissions = filteredEmissions.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredEmissions.length / perPage);

  // ── Filtered initiatives
  const filteredInitiatives = useMemo(() => {
    if (initiativeStatusFilter !== "all") return data.greenInitiatives.filter(g => g.status === initiativeStatusFilter);
    return data.greenInitiatives;
  }, [data, initiativeStatusFilter]);

  // ── Color helpers
  const getScopeColor = (s: string) => ({ scope_1: "#f97316", scope_2: "#3b82f6", scope_3: "#a855f7" }[s] || "#94a3b8");
  const getSourceColor = (s: string) => ({ electricity: "#3b82f6", diesel_generators: "#ef4444", fleet_vehicles: "#f97316", refrigeration: "#06b6d4", packaging: "#22c55e", waste_disposal: "#f59e0b", air_freight: "#a855f7", third_party_logistics: "#64748b" }[s] || "#94a3b8");
  const getComplianceColor = (c: string) => ({ compliant: "#22c55e", near_compliance: "#f59e0b", at_risk: "#ef4444", non_compliant: "#6b7280" }[c] || "#94a3b8");
  const getInitiativeStatusColor = (s: string) => ({ active: "#22c55e", planned: "#3b82f6", completed: "#10b981", on_hold: "#f59e0b" }[s] || "#94a3b8");

  const renderBadge = (label: string, color: string) => (
    <span className="scf-badge" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>{label}</span>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 0: CARBON DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════
  const renderDashboard = () => (
    <div className="scf-dashboard">
      <div className="scf-kpi-grid">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="scf-kpi-card">
              <div className="scf-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}><Icon size={20} /></div>
              <div className="scf-kpi-content">
                <div className="scf-kpi-value">{kpi.value}</div>
                <div className="scf-kpi-label">{kpi.label}</div>
                <div className="scf-kpi-sub">{kpi.sub}</div>
              </div>
              <span className={`scf-kpi-change ${kpi.change.startsWith('-') ? 'down' : 'up'}`}>
                {kpi.change.startsWith('-') ? <TrendingDown size={10} /> : <TrendingUp size={10} />} {kpi.change}
              </span>
            </div>
          );
        })}
      </div>

      <div className="scf-charts-row">
        <div className="scf-chart-card scf-chart-wide">
          <div className="scf-chart-title"><BarChart3 size={16} /> Monthly Emissions by Scope (tCO2e)</div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar stackId="a" dataKey="scope1" name="Scope 1 (Direct)" fill="#f97316" radius={[0,0,0,0]} />
              <Bar stackId="a" dataKey="scope2" name="Scope 2 (Energy)" fill="#3b82f6" radius={[0,0,0,0]} />
              <Bar stackId="a" dataKey="scope3" name="Scope 3 (Value Chain)" fill="#a855f7" radius={[4,4,0,0]} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="scf-chart-card">
          <div className="scf-chart-title"><Cloud size={16} /> Emissions by Source</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.scopeAllocation} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="emissions" nameKey="source" label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {data.scopeAllocation.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="scf-charts-row">
        <div className="scf-chart-card">
          <div className="scf-chart-title"><TrendingDown size={16} /> Net Emissions vs Offsets</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Area type="monotone" dataKey="totalEmissions" name="Total Emissions" fill="#ef444440" stroke="#ef4444" strokeWidth={2} />
              <Area type="monotone" dataKey="netEmissions" name="Net Emissions" fill="#f9731640" stroke="#f97316" strokeWidth={2} />
              <Area type="monotone" dataKey="offsets" name="Offsets" fill="#22c55e40" stroke="#22c55e" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="scf-chart-card">
          <div className="scf-chart-title"><Gauge size={16} /> Carbon Intensity Trend</div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
              <Bar dataKey="intensity" name="Intensity (tCO2e/unit)" fill="#10b981" radius={[4,4,0,0]} />
              <Line type="monotone" dataKey="intensity" name="Trend" stroke="#10b981" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="scf-section">
        <div className="scf-section-title"><AlertTriangle size={16} /> Environmental Alerts</div>
        <div className="scf-alerts-grid">
          {data.alerts.map(a => (
            <div key={a.id} className={`scf-alert-card scf-alert-${a.type}`}>
              <div className="scf-alert-header">
                {a.type === "critical" ? <AlertTriangle size={14} /> : a.type === "warning" ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                <span className="scf-alert-title">{a.title}</span>
                <span className="scf-alert-time">{a.time}</span>
              </div>
              <div className="scf-alert-msg">{a.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 1: EMISSION RECORDS
  // ══════════════════════════════════════════════════════════════════════════
  const renderEmissionRecords = () => (
    <div className="scf-records">
      <div className="scf-search-bar">
        <Search size={16} />
        <input type="text" placeholder="Search Emission ID, Warehouse, City, Source, Category..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }} />
        {searchQuery && <XCircle size={16} className="scf-search-clear" onClick={() => { setSearchQuery(""); setPage(1); }} />}
      </div>
      <div className="scf-filter-bar">
        <div className="scf-filter-row">
          <span className="scf-filter-label"><Filter size={14} /> Scope:</span>
          <div className="scf-filter-pills">
            <button className={`scf-pill ${scopeFilter === "all" ? "active" : ""}`} onClick={() => { setScopeFilter("all"); setPage(1); }}>All</button>
            {data.allScopes.map(s => (
              <button key={s} className={`scf-pill ${scopeFilter === s ? "active" : ""}`} style={scopeFilter === s ? { background: getScopeColor(s), color: "#fff" } : {}} onClick={() => { setScopeFilter(s); setPage(1); }}>
                {s.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
        <div className="scf-filter-row">
          <span className="scf-filter-label">Source:</span>
          <div className="scf-filter-pills">
            <button className={`scf-pill ${sourceFilter === "all" ? "active" : ""}`} onClick={() => { setSourceFilter("all"); setPage(1); }}>All</button>
            {data.allSources.map(s => (
              <button key={s} className={`scf-pill ${sourceFilter === s ? "active" : ""}`} style={sourceFilter === s ? { background: getSourceColor(s), color: "#fff" } : {}} onClick={() => { setSourceFilter(s); setPage(1); }}>
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
          <span className="scf-filter-sep">|</span>
          <span className="scf-filter-label">Category:</span>
          <div className="scf-filter-pills">
            <button className={`scf-pill ${categoryFilter === "all" ? "active" : ""}`} onClick={() => { setCategoryFilter("all"); setPage(1); }}>All</button>
            {["Energy", "Transport", "Refrigeration", "Materials", "Waste"].map(c => (
              <button key={c} className={`scf-pill ${categoryFilter === c ? "active" : ""}`} onClick={() => { setCategoryFilter(c); setPage(1); }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="scf-table-wrap">
        <div className="scf-results-info">Showing {((page - 1) * perPage + 1)}-{Math.min(page * perPage, filteredEmissions.length)} of {filteredEmissions.length} records</div>
        <table className="scf-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Warehouse</th>
              <th>Source</th>
              <th>Scope</th>
              <th>CO2e (tonnes)</th>
              <th>Cost</th>
              <th>Intensity</th>
              <th>vs Baseline</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmissions.map(record => (
              <tr key={record.id} className="scf-table-row" onClick={() => setDrawerRecord(record)}>
                <td><span className="scf-cell-id">{record.id}</span></td>
                <td>
                  <div className="scf-cell-name">{record.warehouseName}</div>
                  <div className="scf-cell-sub">{record.city}</div>
                </td>
                <td>
                  <span className="scf-source-dot" style={{ background: getSourceColor(record.source) }} />
                  <span className="scf-cell-text">{record.source.replace(/_/g, " ")}</span>
                </td>
                <td>{renderBadge(record.scope.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()), getScopeColor(record.scope))}</td>
                <td style={{ fontWeight: 600, color: "#ef4444" }}>{record.co2eTonnes.toFixed(2)}</td>
                <td>{formatINR(record.costINR)}</td>
                <td>{record.intensity.toFixed(3)}</td>
                <td>
                  <span style={{ color: record.variancePct <= 0 ? "#22c55e" : "#ef4444", fontWeight: 500 }}>
                    {record.variancePct > 0 ? "+" : ""}{record.variancePct}%
                  </span>
                </td>
                <td>{renderBadge(record.category, "#64748b")}</td>
                <td>
                  <button className="scf-action-btn" onClick={e => { e.stopPropagation(); setDrawerRecord(record); }}>
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="scf-pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 7) { if (page <= 4) p = i + 1; else if (page >= totalPages - 3) p = totalPages - 6 + i; else p = page - 3 + i; }
              return <button key={p} className={`scf-page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>;
            })}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 2: CARBON CREDITS
  // ══════════════════════════════════════════════════════════════════════════
  const renderCarbonCredits = () => {
    const ccKPIs = [
      { label: "Total Credits", value: data.carbonCredits.reduce((s, c) => s + c.credits, 0).toLocaleString(), icon: Award, color: "#f59e0b" },
      { label: "Active Projects", value: String(data.carbonCredits.filter(c => c.status === "active").length), icon: CheckCircle2, color: "#22c55e" },
      { label: "Verified", value: String(data.carbonCredits.filter(c => c.verified).length), icon: CheckCircle2, color: "#3b82f6" },
      { label: "Total Value", value: formatINR(data.carbonCredits.reduce((s, c) => s + c.totalValue, 0)), icon: IndianRupee, color: "#10b981" },
      { label: "Avg Price/Credit", value: `\u20b9${Math.round(data.carbonCredits.reduce((s, c) => s + c.pricePerCredit, 0) / data.carbonCredits.length)}`, icon: BarChart3, color: "#a855f7" },
      { label: "CO2 Offset", value: `${(data.carbonCredits.filter(c => c.status === "active").reduce((s, c) => s + c.credits, 0) / 1000).toFixed(1)}K t`, icon: Leaf, color: "#06b6d4" },
    ];

    return (
      <div className="scf-credits">
        <div className="scf-kpi-grid">
          {ccKPIs.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="scf-kpi-card">
                <div className="scf-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}><Icon size={20} /></div>
                <div className="scf-kpi-content">
                  <div className="scf-kpi-value">{kpi.value}</div>
                  <div className="scf-kpi-label">{kpi.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="scf-charts-row" style={{ marginTop: 16 }}>
          <div className="scf-chart-card">
            <div className="scf-chart-title"><TreePine size={16} /> Credits by Project Type</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={[
                  { name: "Renewable Energy", value: data.carbonCredits.filter(c => c.type === "Renewable Energy").reduce((s, c) => s + c.credits, 0), color: "#f59e0b" },
                  { name: "Afforestation", value: data.carbonCredits.filter(c => c.type === "Afforestation").reduce((s, c) => s + c.credits, 0), color: "#22c55e" },
                  { name: "Wind Energy", value: data.carbonCredits.filter(c => c.type === "Wind Energy").reduce((s, c) => s + c.credits, 0), color: "#3b82f6" },
                  { name: "Biogas", value: data.carbonCredits.filter(c => c.type === "Biogas").reduce((s, c) => s + c.credits, 0), color: "#06b6d4" },
                  { name: "Hydro", value: data.carbonCredits.filter(c => c.type === "Hydro").reduce((s, c) => s + c.credits, 0), color: "#a855f7" },
                  { name: "Waste Recovery", value: data.carbonCredits.filter(c => c.type === "Waste Recovery").reduce((s, c) => s + c.credits, 0), color: "#64748b" },
                ]} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {["#f59e0b", "#22c55e", "#3b82f6", "#06b6d4", "#a855f7", "#64748b"].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="scf-chart-card">
            <div className="scf-chart-title"><BarChart3 size={16} /> Credit Value by Project</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.carbonCredits.map(c => ({ name: c.projectName.split(" ").slice(0, 2).join(" "), credits: c.credits, value: c.totalValue / 100000 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="credits" name="Credits" fill="#22c55e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credit cards */}
        <div className="scf-section-title" style={{ marginTop: 16 }}><Award size={16} /> Carbon Credit Portfolio</div>
        <div className="scf-credit-grid">
          {data.carbonCredits.map(credit => {
            const getStatusColor = (s: string) => ({ active: "#22c55e", completed: "#10b981", pending: "#f59e0b", expired: "#6b7280" }[s] || "#94a3b8");
            const statusColor = getStatusColor(credit.status);
            return (
              <div key={credit.id} className="scf-credit-card">
                <div className="scf-credit-header">
                  <span className="scf-credit-id">{credit.id}</span>
                  <span className="scf-credit-status" style={{ background: `${statusColor}20`, color: statusColor }}>{credit.status}</span>
                  {credit.verified && <span className="scf-credit-verified"><CheckCircle2 size={12} /> Verified</span>}
                </div>
                <div className="scf-credit-name">{credit.projectName}</div>
                <div className="scf-credit-meta">
                  <span><MapPin size={10} /> {credit.location}</span>
                  <span><FileText size={10} /> {credit.standard}</span>
                </div>
                <div className="scf-credit-stats">
                  <div className="scf-credit-stat"><span className="scf-credit-stat-val">{credit.credits.toLocaleString()}</span><span className="scf-credit-stat-lbl">Credits</span></div>
                  <div className="scf-credit-stat"><span className="scf-credit-stat-val">\u20b9{credit.pricePerCredit}</span><span className="scf-credit-stat-lbl">Per Credit</span></div>
                  <div className="scf-credit-stat"><span className="scf-credit-stat-val">{formatINR(credit.totalValue)}</span><span className="scf-credit-stat-lbl">Total Value</span></div>
                </div>
                <div className="scf-credit-period">{credit.startDate} to {credit.endDate}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 3: GREEN INITIATIVES
  // ══════════════════════════════════════════════════════════════════════════
  const renderGreenInitiatives = () => {
    const giKPIs = [
      { label: "Total Initiatives", value: String(data.greenInitiatives.length), icon: Sprout, color: "#10b981" },
      { label: "Active", value: String(data.greenInitiatives.filter(g => g.status === "active").length), icon: Activity, color: "#22c55e" },
      { label: "Total Investment", value: formatINR(data.greenInitiatives.reduce((s, g) => s + g.investmentINR, 0)), icon: IndianRupee, color: "#f59e0b" },
      { label: "CO2 Saved/Year", value: `${data.greenInitiatives.reduce((s, g) => s + g.co2SavedPerYear, 0)} t`, icon: Leaf, color: "#06b6d4" },
      { label: "Avg ROI", value: `${Math.round(data.greenInitiatives.reduce((s, g) => s + g.roi, 0) / data.greenInitiatives.length)}%`, icon: TrendingUp, color: "#3b82f6" },
      { label: "Avg Payback", value: `${Math.round(data.greenInitiatives.reduce((s, g) => s + g.paybackMonths, 0) / data.greenInitiatives.length)} mo`, icon: Timer, color: "#a855f7" },
    ];

    return (
      <div className="scf-initiatives">
        <div className="scf-kpi-grid">
          {giKPIs.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="scf-kpi-card">
                <div className="scf-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}><Icon size={20} /></div>
                <div className="scf-kpi-content">
                  <div className="scf-kpi-value">{kpi.value}</div>
                  <div className="scf-kpi-label">{kpi.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <div className="scf-filter-bar" style={{ marginTop: 12 }}>
          <div className="scf-filter-row">
            <span className="scf-filter-label"><Filter size={14} /> Status:</span>
            <div className="scf-filter-pills">
              <button className={`scf-pill ${initiativeStatusFilter === "all" ? "active" : ""}`} onClick={() => setInitiativeStatusFilter("all")}>All</button>
              {data.allInitiativeStatuses.map(s => (
                <button key={s} className={`scf-pill ${initiativeStatusFilter === s ? "active" : ""}`} style={initiativeStatusFilter === s ? { background: getInitiativeStatusColor(s), color: "#fff" } : {}} onClick={() => setInitiativeStatusFilter(s)}>
                  {s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="scf-charts-row" style={{ marginTop: 12 }}>
          <div className="scf-chart-card">
            <div className="scf-chart-title"><BarChart3 size={16} /> Investment vs CO2 Saved by Initiative</div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={data.greenInitiatives.map(g => ({ name: g.name.split(" - ")[0].slice(0, 20), investment: g.investmentINR / 100000, saved: g.co2SavedPerYear }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={v => `\u20b9${v}L`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 12 }} unit="t" />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar yAxisId="left" dataKey="investment" name="Investment (\u20b9L)" fill="#10b981" radius={[4,4,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="saved" name="CO2 Saved (t/yr)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="scf-chart-card">
            <div className="scf-chart-title"><Activity size={16} /> ROI & Payback Analysis</div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={data.greenInitiatives.map(g => ({ name: g.name.split(" - ")[0].slice(0, 18), roi: g.roi, payback: g.paybackMonths }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 12 }} unit="%" />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 12 }} unit="mo" />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar yAxisId="left" dataKey="roi" name="ROI %" fill="#3b82f6" radius={[4,4,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="payback" name="Payback (months)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Initiative Cards */}
        <div className="scf-section-title" style={{ marginTop: 16 }}><Sprout size={16} /> Green Initiative Portfolio</div>
        <div className="scf-initiative-grid">
          {filteredInitiatives.map(init => {
            const statusColor = getInitiativeStatusColor(init.status);
            return (
              <div key={init.id} className="scf-init-card" style={{ borderTopColor: statusColor }}>
                <div className="scf-init-header">
                  <span className="scf-init-name">{init.name}</span>
                  <span className="scf-init-status" style={{ background: `${statusColor}20`, color: statusColor }}>{init.status.replace(/_/g, " ")}</span>
                </div>
                <div className="scf-init-type">{init.type}</div>
                <div className="scf-init-stats">
                  <div className="scf-init-stat"><span className="scf-init-stat-val">{formatINR(init.investmentINR)}</span><span className="scf-init-stat-lbl">Investment</span></div>
                  <div className="scf-init-stat"><span className="scf-init-stat-val">{init.co2SavedPerYear}t</span><span className="scf-init-stat-lbl">CO2/Year</span></div>
                  <div className="scf-init-stat"><span className="scf-init-stat-val">{init.roi}%</span><span className="scf-init-stat-lbl">ROI</span></div>
                  <div className="scf-init-stat"><span className="scf-init-stat-val">{init.paybackMonths}mo</span><span className="scf-init-stat-lbl">Payback</span></div>
                </div>
                <div className="scf-init-meta">
                  <span><Warehouse size={10} /> {init.warehouse}</span>
                  <span><Calendar size={10} /> {init.startDate}</span>
                  <span className="scf-impact-tag" style={{ color: init.impact === "High" ? "#ef4444" : init.impact === "Medium" ? "#f59e0b" : "#22c55e", background: init.impact === "High" ? "#ef444415" : init.impact === "Medium" ? "#f59e0b15" : "#22c55e15" }}>
                    Impact: {init.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 4: COMPLIANCE
  // ══════════════════════════════════════════════════════════════════════════
  const renderCompliance = () => {
    return (
      <div className="scf-compliance">
        {/* Warehouse Compliance Cards */}
        <div className="scf-section-title"><Building2 size={16} /> Warehouse Compliance Status</div>
        <div className="scf-compliance-grid">
          {data.warehouseEmissions.map((wh, i) => {
            const compliancePct = wh.total <= wh.target ? 100 : Math.round((wh.target / wh.total) * 100);
            const statusColor = getComplianceColor(wh.compliance);
            return (
              <div key={i} className="scf-wh-card" style={{ borderTopColor: statusColor }}>
                <div className="scf-wh-header">
                  <div className="scf-wh-name">{wh.name}</div>
                  <span className="scf-wh-compliance" style={{ background: `${statusColor}20`, color: statusColor }}>{wh.compliance.replace(/_/g, " ")}</span>
                </div>
                <div className="scf-wh-body">
                  <div className="scf-wh-scopes">
                    <div className="scf-wh-scope"><span className="scf-scope-label">S1</span><span className="scf-scope-val" style={{ color: "#f97316" }}>{wh.scope1}t</span></div>
                    <div className="scf-wh-scope"><span className="scf-scope-label">S2</span><span className="scf-scope-val" style={{ color: "#3b82f6" }}>{wh.scope2}t</span></div>
                    <div className="scf-wh-scope"><span className="scf-scope-label">S3</span><span className="scf-scope-val" style={{ color: "#a855f7" }}>{wh.scope3}t</span></div>
                    <div className="scf-wh-scope"><span className="scf-scope-label">Total</span><span className="scf-scope-val" style={{ color: "#ef4444", fontWeight: 700 }}>{wh.total}t</span></div>
                  </div>
                  <div className="scf-wh-target-row">
                    <span>Target: {wh.target}t</span>
                    <span>Intensity: {wh.intensity.toFixed(3)}</span>
                  </div>
                  <div className="scf-wh-progress">
                    <div className="scf-wh-progress-track">
                      <div className="scf-wh-progress-fill" style={{ width: `${Math.min(100, compliancePct)}%`, background: compliancePct >= 100 ? "#22c55e" : compliancePct >= 80 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                    <span className="scf-wh-pct" style={{ color: compliancePct >= 100 ? "#22c55e" : compliancePct >= 80 ? "#f59e0b" : "#ef4444" }}>{compliancePct}%</span>
                  </div>
                  <div className="scf-wh-green-row">
                    <span><Sun size={10} /> Solar: {wh.solarCapacity} kW</span>
                    <span><Zap size={10} /> Green Energy: {wh.greenEnergyPct}%</span>
                    <span><Truck size={10} /> EV Fleet: {wh.evFleetPct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="scf-charts-row" style={{ marginTop: 16 }}>
          <div className="scf-chart-card">
            <div className="scf-chart-title"><Globe size={16} /> Regional Intensity Benchmarks</div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={data.benchmarks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="region" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar dataKey="avg" name="Current Avg" fill="#f97316" radius={[4,4,0,0]} />
                <Bar dataKey="target" name="Target" fill="#3b82f6" radius={[4,4,0,0]} />
                <Line type="monotone" dataKey="best" name="Best in Class" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="scf-chart-card">
            <div className="scf-chart-title"><Mountain size={16} /> Warehouse Total Emissions Comparison</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.warehouseEmissions.map(w => ({ ...w, shortName: w.name.split(" ")[0] }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis dataKey="shortName" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} width={80} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar dataKey="scope1" name="Scope 1" stackId="a" fill="#f97316" />
                <Bar dataKey="scope2" name="Scope 2" stackId="a" fill="#3b82f6" />
                <Bar dataKey="scope3" name="Scope 3" stackId="a" fill="#a855f7" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // DRAWER
  // ══════════════════════════════════════════════════════════════════════════
  const renderDrawer = () => {
    if (!drawerRecord) return null;
    const r = drawerRecord;
    const headerGradient = r.variancePct <= 0
      ? "linear-gradient(135deg, #059669, #10b981)"
      : "linear-gradient(135deg, #dc2626, #ef4444)";

    return (
      <div className="scf-drawer-overlay" onClick={() => setDrawerRecord(null)}>
        <div className="scf-drawer" onClick={e => e.stopPropagation()}>
          <div className="scf-drawer-header" style={{ background: headerGradient }}>
            <button className="scf-drawer-back" onClick={() => setDrawerRecord(null)}><ChevronLeft size={18} /></button>
            <div className="scf-drawer-title">Emission Record Detail</div>
            <div className="scf-drawer-badges">
              {renderBadge(r.scope.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()), "#fff")}
              {renderBadge(r.category, "#ffffff80")}
            </div>
          </div>
          <div className="scf-drawer-content">
            <div className="scf-drawer-section">
              <div className="scf-drawer-section-title">Emission Information</div>
              <div className="scf-drawer-grid">
                <div className="scf-drawer-field"><span className="scf-field-label">Record ID</span><span className="scf-field-value">{r.id}</span></div>
                <div className="scf-drawer-field"><span className="scf-field-label">Date</span><span className="scf-field-value">{new Date(r.date).toLocaleDateString("en-IN")}</span></div>
                <div className="scf-drawer-field"><span className="scf-field-label">Source</span><span className="scf-field-value" style={{ color: getSourceColor(r.source) }}>{r.source.replace(/_/g, " ")}</span></div>
                <div className="scf-drawer-field"><span className="scf-field-label">Scope</span><span className="scf-field-value" style={{ color: getScopeColor(r.scope) }}>{r.scope.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</span></div>
              </div>
            </div>
            <div className="scf-drawer-section">
              <div className="scf-drawer-section-title">Warehouse Details</div>
              <div className="scf-drawer-grid">
                <div className="scf-drawer-field"><span className="scf-field-label">Warehouse</span><span className="scf-field-value">{r.warehouseName}</span></div>
                <div className="scf-drawer-field"><span className="scf-field-label">Warehouse ID</span><span className="scf-field-value">{r.warehouseId}</span></div>
                <div className="scf-drawer-field" style={{ gridColumn: "1 / -1" }}><span className="scf-field-label">City</span><span className="scf-field-value">{r.city}</span></div>
              </div>
            </div>
            <div className="scf-drawer-card">
              <div className="scf-drawer-card-title">Emission Metrics</div>
              <div className="scf-drawer-metrics">
                <div className="scf-metric-box" style={{ borderColor: "#ef444440" }}>
                  <span className="scf-metric-label">CO2e</span>
                  <span className="scf-metric-value" style={{ color: "#ef4444" }}>{r.co2eTonnes.toFixed(2)} tonnes</span>
                </div>
                <div className="scf-metric-box" style={{ borderColor: "#f59e0b40" }}>
                  <span className="scf-metric-label">Cost</span>
                  <span className="scf-metric-value" style={{ color: "#f59e0b" }}>{formatINR(r.costINR)}</span>
                </div>
                <div className="scf-metric-box" style={{ borderColor: "#3b82f640" }}>
                  <span className="scf-metric-label">Intensity</span>
                  <span className="scf-metric-value" style={{ color: "#3b82f6" }}>{r.intensity.toFixed(3)} t/unit</span>
                </div>
                <div className="scf-metric-box" style={{ borderColor: r.variancePct <= 0 ? "#22c55e40" : "#ef444440" }}>
                  <span className="scf-metric-label">vs Baseline</span>
                  <span className="scf-metric-value" style={{ color: r.variancePct <= 0 ? "#22c55e" : "#ef4444" }}>{r.variancePct > 0 ? "+" : ""}{r.variancePct}%</span>
                </div>
              </div>
            </div>
            <div className="scf-drawer-card" style={{ borderColor: `${getScopeColor(r.scope)}30` }}>
              <div className="scf-drawer-card-title">Baseline Comparison</div>
              <div className="scf-drawer-baseline">
                <div className="scf-baseline-row"><span>Baseline</span><span>{r.baseline.toFixed(2)} tCO2e</span></div>
                <div className="scf-baseline-row"><span>Actual</span><span>{r.co2eTonnes.toFixed(2)} tCO2e</span></div>
                <div className="scf-baseline-row"><span>Variance</span><span style={{ color: r.variancePct <= 0 ? "#22c55e" : "#ef4444" }}>{r.variancePct > 0 ? "+" : ""}{r.variancePct}%</span></div>
              </div>
            </div>
            <div className="scf-drawer-actions">
              <button className="scf-action-primary"><Download size={14} /> Export Report</button>
              <button className="scf-action-primary"><RefreshCw size={14} /> Recalculate</button>
              <button className="scf-action-secondary"><FileText size={14} /> Audit Log</button>
              <button className="scf-action-secondary"><ArrowRight size={14} /> View Warehouse</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="scf-root">
      <div className="scf-header">
        <div className="scf-header-left">
          <Sprout size={22} className="scf-header-icon" />
          <div>
            <h1 className="scf-title">Carbon Footprint Tracker</h1>
            <p className="scf-subtitle">Scope 1/2/3 emissions monitoring, carbon credits & sustainability compliance</p>
          </div>
        </div>
        <div className="scf-header-right">
          <span className="scf-header-stat"><Leaf size={14} /> {formatNum(netEmissions)}t net</span>
          <span className="scf-header-stat"><TreePine size={14} /> {data.warehouseEmissions.filter(w => w.compliance === "compliant").length}/{data.warehouseEmissions.length} compliant</span>
        </div>
      </div>

      <div className="scf-tabs">
        {tabs.map((tab, i) => (
          <button key={i} className={`scf-tab ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>{tab}</button>
        ))}
      </div>

      <div className="scf-content">
        {activeTab === 0 && renderDashboard()}
        {activeTab === 1 && renderEmissionRecords()}
        {activeTab === 2 && renderCarbonCredits()}
        {activeTab === 3 && renderGreenInitiatives()}
        {activeTab === 4 && renderCompliance()}
      </div>

      {renderDrawer()}
    </div>
  );
}
