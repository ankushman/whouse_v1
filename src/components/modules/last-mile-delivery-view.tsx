"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  MapPinCheck, MapPin, Truck, Package, Clock, CheckCircle2,
  XCircle, AlertTriangle, Phone, Star, Camera,
  ArrowUpRight, ArrowDownRight, Navigation, Route,
  BarChart3, Eye, Search, IndianRupee, Calendar,
  TrendingDown, FileText, Users, RefreshCw,
  ChevronRight, User, MessageSquare, CreditCard,
  MapPinned, Timer, CircleDot, Footprints,
  PhoneCall, Bike, Zap, Coffee, FileCheck,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicleType: "motorcycle" | "van" | "bicycle" | "economy_van";
  zone: string;
  city: string;
  rating: number;
  totalDeliveries: number;
  todayDeliveries: number;
  successRate: number;
  avgDeliveryTime: number;
  status: "active" | "on_break" | "offline" | "dispatching";
  currentLat: number;
  currentLng: number;
}

interface LastMileDelivery {
  id: string;
  orderId: string;
  awbNumber: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  zone: string;
  pincode: string;
  agent: string;
  agentPhone: string;
  status: "picked_up" | "in_transit" | "out_for_delivery" | "near_location" | "delivery_attempted" | "delivered" | "failed" | "returned" | "rescheduled";
  priority: "standard" | "express" | "same_day" | "scheduled";
  deliverySlot: string;
  orderedAt: string;
  dispatchedAt: string;
  estimatedDelivery: string;
  deliveredAt?: string;
  CODAmount: number;
  paymentMethod: "prepaid" | "cod" | "upi";
  proofOfDelivery: boolean;
  customerRating?: number;
  customerFeedback?: string;
  deliveryPhoto: boolean;
  ePodSigned: boolean;
  remarks?: string;
  items: number;
  weight: number;
  attempts: number;
  distance: number;
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
  const rand = seededRandom(159159);

  const cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur", "Lucknow", "Ahmedabad"];
  const zones = ["North", "South", "East", "West", "Central", "NE", "NW", "SE", "SW", "Harbour"];
  const pincodes = ["400001", "400051", "400078", "400086", "411001", "411014", "411027", "110001", "110045", "110085", "560001", "560034", "560076", "560100", "600001", "600034", "600096", "700001", "700045", "700078", "500001", "500034", "500072", "302001", "302015", "302034", "226001", "226010", "226020", "380001", "380006", "380054"];
  const streets = ["MG Road", "Linking Road", "Park Street", "Anna Nagar", "Jubilee Hills", "FC Road", "Salt Lake", "MI Road", "Hazratganj", "CG Road", " Brigade Road", "T. Nagar", "Banjara Hills", "JM Road", "Camac Street", "SV Road", "GS Road", "Ashram Road", "Sarojini Nagar", "Koregaon Park"];
  const customers = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sunita Devi", "Rajesh Gupta", "Neha Singh", "Vikram Joshi", "Kavita Reddy", "Manish Agarwal", "Deepa Nair", "Suresh Menon", "Anita Desai", "Prakash Iyer", "Ritu Malhotra", "Arjun Verma", "Pooja Mehta", "Sanjay Rao", "Lakshmi Iyer", "Ravi Kapoor", "Sneha Pillai", "Harish Chandra", "Meera Krishnan", "Dinesh Yadav", "Anjali Bhattacharya", "Karthik Subramaniam"];
  const agentNames = ["Ravi Kumar", "Suresh Patil", "Mohan Singh", "Anil Das", "Raju Naik", "Deepak Verma", "Santosh Yadav", "Ganesh Reddy", "Kishore Joshi", "Vijay Mistry", "Pradeep Gupta", "Manoj Tiwari", "Ramesh Kulkarni", "Arun Nair", "Sunil Shukla"];
  const deliverySlots = ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00", "10:00-14:00", "14:00-18:00", "08:00-10:00", "19:00-21:00"];
  const remarks = ["Customer not available", "Address not found", "Gate locked", "Customer requested reschedule", "Wrong address provided", "Customer refused delivery", "Package damaged", "Successfully delivered to reception", "Handed to family member", "Left at doorstep with permission", "OTP verified and delivered", "Customer collected from hub"];

  const allStatuses: LastMileDelivery["status"][] = ["picked_up", "in_transit", "out_for_delivery", "near_location", "delivery_attempted", "delivered", "failed", "returned", "rescheduled"];
  const allPriorities: LastMileDelivery["priority"][] = ["standard", "express", "same_day", "scheduled"];
  const allPayments: LastMileDelivery["paymentMethod"][] = ["prepaid", "cod", "upi"];
  const vehicleTypes: DeliveryAgent["vehicleType"][] = ["motorcycle", "van", "bicycle", "economy_van"];
  const agentStatuses: DeliveryAgent["status"][] = ["active", "on_break", "offline", "dispatching"];

  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  // Generate 25 delivery agents
  const agents: DeliveryAgent[] = Array.from({ length: 25 }, (_, i) => ({
    id: `DA-${String(i + 1).padStart(3, "0")}`,
    name: agentNames[i % agentNames.length],
    phone: `+91 ${98000 + Math.floor(rand() * 9000)}${Math.floor(rand() * 9000)}`,
    avatar: agentNames[i % agentNames.length].split(" ").map(n => n[0]).join(""),
    vehicleType: pick(vehicleTypes),
    zone: zones[i % zones.length],
    city: cities[i % cities.length],
    rating: Math.round((3.2 + rand() * 1.8) * 10) / 10,
    totalDeliveries: Math.floor(800 + rand() * 3500),
    todayDeliveries: Math.floor(3 + rand() * 22),
    successRate: Math.round((82 + rand() * 18) * 10) / 10,
    avgDeliveryTime: Math.round((15 + rand() * 55) * 10) / 10,
    status: pick(agentStatuses),
    currentLat: 18.5 + rand() * 6,
    currentLng: 72 + rand() * 12,
  }));

  // Generate 350 deliveries
  const deliveries: LastMileDelivery[] = Array.from({ length: 350 }, (_, i) => {
    const city = pick(cities);
    const zone = pick(zones);
    const status = i < 180 ? pick(allStatuses.slice(3)) : pick(allStatuses);
    const priority = pick(allPriorities);
    const isDelivered = status === "delivered";
    const isFailed = status === "failed" || status === "returned";
    const agent = pick(agents);
    const d = new Date(2026, 6, 28 - Math.floor(rand() * 30));
    d.setHours(Math.floor(rand() * 14) + 7, Math.floor(rand() * 60));

    const dispatchedD = new Date(d);
    dispatchedD.setHours(d.getHours() - Math.floor(rand() * 4) - 1);
    const deliveredD = isDelivered ? new Date(d.getTime() + (rand() * 72 + 1) * 3600000) : undefined;

    return {
      id: `LMD-${String(i + 1).padStart(4, "0")}`,
      orderId: `ORD-${String(10000 + i).padStart(6, "0")}`,
      awbNumber: `AWB${String(500000 + Math.floor(rand() * 900000))}`,
      customer: pick(customers),
      phone: `+91 ${97000 + Math.floor(rand() * 9000)}${Math.floor(rand() * 9000)}`,
      address: `${Math.floor(rand() * 500) + 1}, ${pick(streets)}, ${zone} Zone`,
      city,
      zone,
      pincode: pick(pincodes),
      agent: agent.name,
      agentPhone: agent.phone,
      status,
      priority,
      deliverySlot: pick(deliverySlots),
      orderedAt: dispatchedD.toISOString().slice(0, 10),
      dispatchedAt: d.toISOString().slice(0, 16).replace("T", " "),
      estimatedDelivery: new Date(d.getTime() + (rand() * 48 + 4) * 3600000).toISOString().slice(0, 16).replace("T", " "),
      deliveredAt: deliveredD ? deliveredD.toISOString().slice(0, 16).replace("T", " ") : undefined,
      CODAmount: pick(allPayments) === "cod" ? Math.round((100 + rand() * 4900)) : 0,
      paymentMethod: pick(allPayments),
      proofOfDelivery: isDelivered ? rand() > 0.1 : false,
      customerRating: isDelivered ? Math.round((rand() * 3 + 2) * 10) / 10 : undefined,
      customerFeedback: isDelivered && rand() > 0.4 ? pick(remarks.slice(6)) : undefined,
      deliveryPhoto: isDelivered ? rand() > 0.25 : false,
      ePodSigned: isDelivered ? rand() > 0.15 : false,
      remarks: isFailed ? pick(remarks.slice(0, 6)) : isDelivered ? pick(remarks.slice(6)) : undefined,
      items: Math.floor(1 + rand() * 8),
      weight: Math.round((200 + rand() * 9800)) / 1000,
      attempts: isFailed ? Math.floor(rand() * 3) + 1 : 1,
      distance: Math.round((2 + rand() * 28) * 10) / 10,
    };
  });

  // Monthly trends
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const monthlyTrends = months.map((m, idx) => {
    const base = 1800 + idx * 120;
    return {
      month: m,
      totalDeliveries: base + Math.floor(rand() * 400),
      successful: Math.floor((base + rand() * 400) * (0.88 + rand() * 0.08)),
      failed: Math.floor((base + rand() * 400) * (0.03 + rand() * 0.05)),
      rescheduled: Math.floor((base + rand() * 400) * (0.02 + rand() * 0.03)),
      avgDeliveryTime: Math.round((35 + rand() * 20 - idx * 0.8) * 10) / 10,
      successRate: Math.round((86 + idx * 0.5 + rand() * 5) * 10) / 10,
      codCollection: Math.round((12 + rand() * 8 + idx * 0.3) * 100) / 100,
      customerRating: Math.round((3.6 + rand() * 0.8) * 10) / 10,
    };
  });

  // City-wise analysis
  const cityAnalysis = cities.map(city => {
    const cityDels = deliveries.filter(d => d.city === city);
    const delivered = cityDels.filter(d => d.status === "delivered");
    return {
      city,
      total: cityDels.length || Math.floor(200 + rand() * 300),
      delivered: delivered.length || Math.floor(170 + rand() * 250),
      successRate: Math.round((84 + rand() * 14) * 10) / 10,
      avgTime: Math.round((20 + rand() * 40) * 10) / 10,
      failed: Math.floor(5 + rand() * 25),
      codRate: Math.round((20 + rand() * 35) * 10) / 10,
      avgRating: Math.round((3.4 + rand() * 1.2) * 10) / 10,
    };
  });

  // Zone performance
  const zonePerformance = zones.slice(0, 8).map(zone => ({
    zone,
    total: Math.floor(150 + rand() * 400),
    successRate: Math.round((83 + rand() * 15) * 10) / 10,
    avgTime: Math.round((18 + rand() * 45) * 10) / 10,
    firstAttemptRate: Math.round((72 + rand() * 22) * 10) / 10,
    codCollected: Math.round((78 + rand() * 20) * 10) / 10,
    avgRating: Math.round((3.3 + rand() * 1.4) * 10) / 10,
  }));

  // Vehicle type distribution
  const vehicleDistribution = vehicleTypes.map(vt => ({
    type: vt.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
    count: Math.floor(40 + rand() * 160),
    avgTime: Math.round((20 + rand() * 35) * 10) / 10,
    successRate: Math.round((84 + rand() * 14) * 10) / 10,
    costPerKm: Math.round((3 + rand() * 12) * 100) / 100,
  }));

  // Payment method breakdown
  const paymentBreakdown = allPayments.map(pm => {
    const pmDels = deliveries.filter(d => d.paymentMethod === pm);
    return {
      method: pm === "cod" ? "Cash on Delivery" : pm === "upi" ? "UPI" : "Prepaid",
      count: pmDels.length || Math.floor(80 + rand() * 250),
      percentage: Math.round((20 + rand() * 50) * 10) / 10,
      amount: Math.round((50000 + rand() * 500000)),
    };
  });

  // Agent performance for radar chart
  const agentPerformance = agents.slice(0, 6).map(a => ({
    name: a.name.split(" ")[0],
    speed: Math.round((60 + rand() * 40) * 10) / 10,
    accuracy: a.successRate,
    reliability: Math.round((70 + rand() * 28) * 10) / 10,
    rating: Math.round(a.rating * 20),
    volume: Math.round(a.todayDeliveries / 25 * 100),
    customerSat: Math.round((65 + rand() * 33) * 10) / 10,
  }));

  return {
    deliveries,
    agents,
    monthlyTrends,
    cityAnalysis,
    zonePerformance,
    vehicleDistribution,
    paymentBreakdown,
    agentPerformance,
    months,
    cities,
    zones,
    statuses: allStatuses,
    priorities: allPriorities,
    payments: allPayments,
  };
}

// ============================================================================
// Helpers
// ============================================================================
function formatNumber(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return n.toLocaleString("en-IN");
  return String(n);
}

function formatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const THEME = {
  primary: "#059669",
  primaryLight: "#d1fae5",
  secondary: "#f59e0b",
  secondaryLight: "#fef3c7",
  danger: "#ef4444",
  dangerLight: "#fee2e2",
  info: "#6366f1",
  infoLight: "#e0e7ff",
  bg: "#f0fdf4",
  surface: "#ffffff",
  text: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  picked_up: { label: "Picked Up", color: "#6366f1", bg: "#e0e7ff" },
  in_transit: { label: "In Transit", color: "#3b82f6", bg: "#dbeafe" },
  out_for_delivery: { label: "Out for Delivery", color: "#f59e0b", bg: "#fef3c7" },
  near_location: { label: "Near Location", color: "#8b5cf6", bg: "#ede9fe" },
  delivery_attempted: { label: "Attempted", color: "#f97316", bg: "#ffedd5" },
  delivered: { label: "Delivered", color: "#10b981", bg: "#d1fae5" },
  failed: { label: "Failed", color: "#ef4444", bg: "#fee2e2" },
  returned: { label: "Returned", color: "#64748b", bg: "#f1f5f9" },
  rescheduled: { label: "Rescheduled", color: "#06b6d4", bg: "#cffafe" },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  standard: { label: "Standard", color: "#64748b", bg: "#f1f5f9" },
  express: { label: "Express", color: "#f59e0b", bg: "#fef3c7" },
  same_day: { label: "Same Day", color: "#ef4444", bg: "#fee2e2" },
  scheduled: { label: "Scheduled", color: "#6366f1", bg: "#e0e7ff" },
};

const PAYMENT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  prepaid: { label: "Prepaid", color: "#10b981", bg: "#d1fae5" },
  cod: { label: "COD", color: "#f59e0b", bg: "#fef3c7" },
  upi: { label: "UPI", color: "#6366f1", bg: "#e0e7ff" },
};

const VEHICLE_CONFIG: Record<string, { label: string; icon: string }> = {
  motorcycle: { label: "Motorcycle", icon: "🏍️" },
  van: { label: "Van", icon: "🚐" },
  bicycle: { label: "Bicycle", icon: "🚲" },
  economy_van: { label: "E-Van", icon: "⚡" },
};

const AGENT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#10b981", bg: "#d1fae5" },
  on_break: { label: "On Break", color: "#f59e0b", bg: "#fef3c7" },
  offline: { label: "Offline", color: "#64748b", bg: "#f1f5f9" },
  dispatching: { label: "Dispatching", color: "#3b82f6", bg: "#dbeafe" },
};

// ============================================================================
// Component
// ============================================================================
export default function LastMileDeliveryView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [selectedDelivery, setSelectedDelivery] = useState<LastMileDelivery | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [agentCityFilter, setAgentCityFilter] = useState<string>("all");

  const tabs = ["Dashboard", "Live Tracking", "Delivery Agents", "Performance Analytics", "Payment & COD"];

  // Computed metrics
  const metrics = useMemo(() => {
    const total = data.deliveries.length;
    const delivered = data.deliveries.filter(d => d.status === "delivered").length;
    const inTransit = data.deliveries.filter(d => ["in_transit", "out_for_delivery", "near_location"].includes(d.status)).length;
    const failed = data.deliveries.filter(d => d.status === "failed").length;
    const returned = data.deliveries.filter(d => d.status === "returned").length;
    const avgRating = data.deliveries.filter(d => d.customerRating).reduce((s, d) => s + (d.customerRating || 0), 0) / Math.max(data.deliveries.filter(d => d.customerRating).length, 1);
    const codCollected = data.deliveries.filter(d => d.paymentMethod === "cod" && d.status === "delivered").reduce((s, d) => s + d.CODAmount, 0);
    const codPending = data.deliveries.filter(d => d.paymentMethod === "cod" && d.status !== "delivered" && d.status !== "returned" && d.status !== "failed").reduce((s, d) => s + d.CODAmount, 0);
    const activeAgents = data.agents.filter(a => a.status === "active").length;
    const avgDeliveryTime = 32.5;

    return { total, delivered, inTransit, failed, returned, avgRating, codCollected, codPending, activeAgents, avgDeliveryTime };
  }, [data]);

  // Filtered deliveries
  const filteredDeliveries = useMemo(() => {
    return data.deliveries.filter(d => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (priorityFilter !== "all" && d.priority !== priorityFilter) return false;
      if (paymentFilter !== "all" && d.paymentMethod !== paymentFilter) return false;
      if (cityFilter !== "all" && d.city !== cityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return d.id.toLowerCase().includes(q) || d.orderId.toLowerCase().includes(q) || d.awbNumber.toLowerCase().includes(q) || d.customer.toLowerCase().includes(q) || d.agent.toLowerCase().includes(q) || d.pincode.includes(q);
      }
      return true;
    });
  }, [data, statusFilter, priorityFilter, paymentFilter, cityFilter, searchQuery]);

  // Filtered agents
  const filteredAgents = useMemo(() => {
    return data.agents.filter(a => {
      if (agentCityFilter !== "all" && a.city !== agentCityFilter) return false;
      return true;
    });
  }, [data, agentCityFilter]);

  // Status distribution for pie
  const statusPieData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.deliveries.forEach(d => { counts[d.status] = (counts[d.status] || 0) + 1; });
    return Object.entries(counts).map(([key, value]) => ({
      name: STATUS_CONFIG[key]?.label || key,
      value,
      color: STATUS_CONFIG[key]?.color || "#94a3b8",
    }));
  }, [data]);

  const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6", "#f97316", "#06b6d4", "#64748b"];

  const openDrawer = useCallback((d: LastMileDelivery) => {
    setSelectedDelivery(d);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedDelivery(null), 300);
  }, []);

  // ===== TAB 1: Dashboard =====
  const renderDashboard = () => (
    <div className="lmd-tab-content">
      {/* KPI Cards */}
      <div className="lmd-kpi-grid">
        {[
          { label: "Total Deliveries", value: metrics.total.toLocaleString("en-IN"), change: "+8.3%", up: true, icon: Package, color: THEME.primary },
          { label: "In Transit", value: metrics.inTransit.toLocaleString("en-IN"), change: "+12.1%", up: true, icon: Truck, color: "#3b82f6" },
          { label: "Delivered", value: metrics.delivered.toLocaleString("en-IN"), change: "+6.5%", up: true, icon: CheckCircle2, color: "#10b981" },
          { label: "Failed / Returned", value: (metrics.failed + metrics.returned).toLocaleString("en-IN"), change: "-3.2%", up: false, icon: XCircle, color: THEME.danger },
          { label: "COD Collected", value: formatINR(metrics.codCollected), change: "+15.7%", up: true, icon: IndianRupee, color: THEME.secondary },
          { label: "Avg Rating", value: metrics.avgRating.toFixed(1) + " / 5", change: "+0.2", up: true, icon: Star, color: "#8b5cf6" },
        ].map((kpi, i) => (
          <div key={i} className="lmd-kpi-card" style={{ borderTopColor: kpi.color }}>
            <div className="lmd-kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
              <kpi.icon size={20} />
            </div>
            <div className="lmd-kpi-info">
              <span className="lmd-kpi-label">{kpi.label}</span>
              <span className="lmd-kpi-value">{kpi.value}</span>
              <span className={`lmd-kpi-change ${kpi.up ? "lmd-kpi-up" : "lmd-kpi-down"}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="lmd-charts-row">
        <div className="lmd-chart-card">
          <div className="lmd-chart-header">
            <h3 className="lmd-chart-title">Monthly Delivery Volume & Success Rate</h3>
            <span className="lmd-chart-subtitle">Last 12 months</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="totalDeliveries" fill="#059669" radius={[4, 4, 0, 0]} name="Total" />
              <Bar yAxisId="left" dataKey="successful" fill="#6ee7b7" radius={[4, 4, 0, 0]} name="Successful" />
              <Bar yAxisId="left" dataKey="failed" fill="#fca5a5" radius={[4, 4, 0, 0]} name="Failed" />
              <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#f59e0b" strokeWidth={2} dot={false} name="Success %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="lmd-chart-card">
          <div className="lmd-chart-header">
            <h3 className="lmd-chart-title">Delivery Status Distribution</h3>
            <span className="lmd-chart-subtitle">Current month</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                {statusPieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="lmd-charts-row">
        <div className="lmd-chart-card">
          <div className="lmd-chart-header">
            <h3 className="lmd-chart-title">Avg Delivery Time & Customer Rating</h3>
            <span className="lmd-chart-subtitle">Monthly trend</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} unit=" min" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} domain={[0, 5]} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="avgDeliveryTime" fill="#d1fae5" stroke="#059669" strokeWidth={2} name="Avg Time (min)" />
              <Line yAxisId="right" type="monotone" dataKey="customerRating" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Rating (out of 5)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="lmd-chart-card">
          <div className="lmd-chart-header">
            <h3 className="lmd-chart-title">COD Collection Trend</h3>
            <span className="lmd-chart-subtitle">Monthly COD collection (₹ Lakhs)</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" L" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="codCollection" fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} name="COD Collected (L)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="lmd-alerts-section">
        <h3 className="lmd-section-title">Active Alerts</h3>
        <div className="lmd-alerts-grid">
          {[
            { title: "Delivery SLA Breach", msg: "18 deliveries exceeded 2hr SLA in Mumbai South", severity: "critical" },
            { title: "Agent Delay Alert", msg: "Agent DA-007 has been idle for 45+ minutes", severity: "warning" },
            { title: "High Failure Zone", msg: "Kolkata East failure rate spiked to 12.5%", severity: "critical" },
            { title: "COD Pending", msg: `₹${formatINR(metrics.codPending)} COD awaiting collection`, severity: "warning" },
            { title: "Agent Offline", msg: "3 agents went offline during active dispatch", severity: "warning" },
            { title: "Rating Drop", msg: "Bengaluru avg rating dropped below 3.8 this week", severity: "info" },
          ].map((alert, i) => (
            <div key={i} className={`lmd-alert-card lmd-alert-${alert.severity}`}>
              <AlertTriangle size={16} className="lmd-alert-icon" />
              <div>
                <span className="lmd-alert-title">{alert.title}</span>
                <span className="lmd-alert-msg">{alert.msg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== TAB 2: Live Tracking =====
  const renderLiveTracking = () => {
    const activeDeliveries = data.deliveries.filter(d => ["in_transit", "out_for_delivery", "near_location"].includes(d.status));

    return (
      <div className="lmd-tab-content">
        {/* Live Stats */}
        <div className="lmd-live-stats">
          <div className="lmd-live-stat">
            <div className="lmd-live-dot lmd-live-dot-green" />
            <span className="lmd-live-label">Active Deliveries</span>
            <span className="lmd-live-value">{activeDeliveries.length}</span>
          </div>
          <div className="lmd-live-stat">
            <div className="lmd-live-dot lmd-live-dot-blue" />
            <span className="lmd-live-label">Out for Delivery</span>
            <span className="lmd-live-value">{data.deliveries.filter(d => d.status === "out_for_delivery").length}</span>
          </div>
          <div className="lmd-live-stat">
            <div className="lmd-live-dot lmd-live-dot-amber" />
            <span className="lmd-live-label">Near Location</span>
            <span className="lmd-live-value">{data.deliveries.filter(d => d.status === "near_location").length}</span>
          </div>
          <div className="lmd-live-stat">
            <div className="lmd-live-dot lmd-live-dot-red" />
            <span className="lmd-live-label">Failed Today</span>
            <span className="lmd-live-value">{data.deliveries.filter(d => d.status === "failed").length}</span>
          </div>
          <div className="lmd-live-stat">
            <User size={16} className="lmd-live-icon" />
            <span className="lmd-live-label">Active Agents</span>
            <span className="lmd-live-value">{metrics.activeAgents}</span>
          </div>
        </div>

        {/* Delivery Queue */}
        <div className="lmd-section-header">
          <h3 className="lmd-section-title">Delivery Queue ({filteredDeliveries.length})</h3>
          <div className="lmd-search-box">
            <Search size={16} className="lmd-search-icon" />
            <input
              type="text"
              placeholder="Search by ID, Order, AWB, Customer, Agent, PIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lmd-search-input"
            />
          </div>
        </div>

        {/* Double-row filter */}
        <div className="lmd-filter-row">
          <div className="lmd-filter-pills">
            {["all", ...data.statuses].map(s => (
              <button
                key={s}
                className={`lmd-filter-pill ${statusFilter === s ? "lmd-filter-pill-active" : ""}`}
                onClick={() => setStatusFilter(s)}
                style={statusFilter === s ? { backgroundColor: STATUS_CONFIG[s]?.color || "#059669", color: "#fff", borderColor: STATUS_CONFIG[s]?.color || "#059669" } : {}}
              >
                {s === "all" ? "All Status" : STATUS_CONFIG[s]?.label || s}
              </button>
            ))}
          </div>
        </div>
        <div className="lmd-filter-row">
          <div className="lmd-filter-pills">
            <button className={`lmd-filter-pill ${priorityFilter === "all" ? "lmd-filter-pill-active" : ""}`} onClick={() => setPriorityFilter("all")}>All Priority</button>
            {data.priorities.map(p => (
              <button
                key={p}
                className={`lmd-filter-pill ${priorityFilter === p ? "lmd-filter-pill-active" : ""}`}
                onClick={() => setPriorityFilter(p)}
                style={priorityFilter === p ? { backgroundColor: PRIORITY_CONFIG[p].color, color: "#fff", borderColor: PRIORITY_CONFIG[p].color } : {}}
              >
                {PRIORITY_CONFIG[p].label}
              </button>
            ))}
            <span className="lmd-filter-separator">|</span>
            <button className={`lmd-filter-pill ${paymentFilter === "all" ? "lmd-filter-pill-active" : ""}`} onClick={() => setPaymentFilter("all")}>All Payment</button>
            {data.payments.map(p => (
              <button
                key={p}
                className={`lmd-filter-pill ${paymentFilter === p ? "lmd-filter-pill-active" : ""}`}
                onClick={() => setPaymentFilter(p)}
                style={paymentFilter === p ? { backgroundColor: PAYMENT_CONFIG[p].color, color: "#fff", borderColor: PAYMENT_CONFIG[p].color } : {}}
              >
                {PAYMENT_CONFIG[p].label}
              </button>
            ))}
          </div>
          <div className="lmd-city-select">
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="lmd-select">
              <option value="all">All Cities</option>
              {data.cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="lmd-table-container">
          <table className="lmd-table">
            <thead>
              <tr>
                <th>ID / Order</th>
                <th>Customer</th>
                <th>City / PIN</th>
                <th>Agent</th>
                <th>Priority</th>
                <th>Payment</th>
                <th>COD Amt</th>
                <th>Slot</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.slice(0, 35).map((d, i) => (
                <tr key={d.id} className="lmd-table-row">
                  <td>
                    <div className="lmd-cell-primary">
                      <span className="lmd-cell-id">{d.id}</span>
                      <span className="lmd-cell-sub">{d.awbNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className="lmd-cell-primary">
                      <span className="lmd-cell-name">{d.customer}</span>
                      <span className="lmd-cell-sub">{d.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="lmd-cell-primary">
                      <span className="lmd-cell-name">{d.city}</span>
                      <span className="lmd-cell-sub">{d.pincode}</span>
                    </div>
                  </td>
                  <td>
                    <div className="lmd-cell-primary">
                      <span className="lmd-cell-name">{d.agent}</span>
                    </div>
                  </td>
                  <td>
                    <span className="lmd-badge" style={{ color: PRIORITY_CONFIG[d.priority].color, backgroundColor: PRIORITY_CONFIG[d.priority].bg }}>
                      {PRIORITY_CONFIG[d.priority].label}
                    </span>
                  </td>
                  <td>
                    <span className="lmd-badge" style={{ color: PAYMENT_CONFIG[d.paymentMethod].color, backgroundColor: PAYMENT_CONFIG[d.paymentMethod].bg }}>
                      {PAYMENT_CONFIG[d.paymentMethod].label}
                    </span>
                  </td>
                  <td className="lmd-cell-amount">{d.paymentMethod === "cod" ? formatINR(d.CODAmount) : "—"}</td>
                  <td><span className="lmd-cell-slot">{d.deliverySlot}</span></td>
                  <td>
                    <span className="lmd-badge" style={{ color: STATUS_CONFIG[d.status].color, backgroundColor: STATUS_CONFIG[d.status].bg }}>
                      {STATUS_CONFIG[d.status].label}
                    </span>
                  </td>
                  <td className="lmd-cell-center">{d.attempts}</td>
                  <td>
                    <button className="lmd-action-btn" onClick={() => openDrawer(d)}>
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="lmd-table-footer">
            Showing {Math.min(35, filteredDeliveries.length)} of {filteredDeliveries.length} deliveries
          </div>
        </div>
      </div>
    );
  };

  // ===== TAB 3: Delivery Agents =====
  const renderAgents = () => (
    <div className="lmd-tab-content">
      {/* Agent Stats */}
      <div className="lmd-kpi-grid">
        {[
          { label: "Total Agents", value: data.agents.length, icon: Users, color: THEME.primary },
          { label: "Active Now", value: data.agents.filter(a => a.status === "active").length, icon: Footprints, color: "#10b981" },
          { label: "On Break", value: data.agents.filter(a => a.status === "on_break").length, icon: Coffee, color: "#f59e0b" },
          { label: "Avg Rating", value: (data.agents.reduce((s, a) => s + a.rating, 0) / data.agents.length).toFixed(1), icon: Star, color: "#8b5cf6" },
          { label: "Total Today Deliveries", value: data.agents.reduce((s, a) => s + a.todayDeliveries, 0), icon: Package, color: "#3b82f6" },
          { label: "Avg Success Rate", value: (data.agents.reduce((s, a) => s + a.successRate, 0) / data.agents.length).toFixed(1) + "%", icon: CheckCircle2, color: "#059669" },
        ].map((kpi, i) => (
          <div key={i} className="lmd-kpi-card" style={{ borderTopColor: kpi.color }}>
            <div className="lmd-kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
              <kpi.icon size={20} />
            </div>
            <div className="lmd-kpi-info">
              <span className="lmd-kpi-label">{kpi.label}</span>
              <span className="lmd-kpi-value">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Filter */}
      <div className="lmd-filter-row" style={{ marginTop: 16 }}>
        <div className="lmd-city-select">
          <select value={agentCityFilter} onChange={(e) => setAgentCityFilter(e.target.value)} className="lmd-select">
            <option value="all">All Cities</option>
            {data.cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="lmd-agent-grid">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="lmd-agent-card">
            <div className="lmd-agent-header">
              <div className="lmd-agent-avatar" style={{ backgroundColor: `${THEME.primary}20`, color: THEME.primary }}>
                {agent.avatar}
              </div>
              <div className="lmd-agent-meta">
                <span className="lmd-agent-name">{agent.name}</span>
                <span className="lmd-agent-id">{agent.id} · {VEHICLE_CONFIG[agent.vehicleType]?.icon} {VEHICLE_CONFIG[agent.vehicleType]?.label}</span>
              </div>
              <span className="lmd-badge" style={{ color: AGENT_STATUS_CONFIG[agent.status].color, backgroundColor: AGENT_STATUS_CONFIG[agent.status].bg }}>
                {AGENT_STATUS_CONFIG[agent.status].label}
              </span>
            </div>
            <div className="lmd-agent-details">
              <div className="lmd-agent-detail-row">
                <Phone size={13} />
                <span>{agent.phone}</span>
              </div>
              <div className="lmd-agent-detail-row">
                <MapPin size={13} />
                <span>{agent.zone} Zone, {agent.city}</span>
              </div>
            </div>
            <div className="lmd-agent-stats">
              <div className="lmd-agent-stat">
                <span className="lmd-agent-stat-value">{agent.todayDeliveries}</span>
                <span className="lmd-agent-stat-label">Today</span>
              </div>
              <div className="lmd-agent-stat">
                <span className="lmd-agent-stat-value">{agent.totalDeliveries.toLocaleString()}</span>
                <span className="lmd-agent-stat-label">Total</span>
              </div>
              <div className="lmd-agent-stat">
                <span className="lmd-agent-stat-value">{agent.successRate}%</span>
                <span className="lmd-agent-stat-label">Success</span>
              </div>
              <div className="lmd-agent-stat">
                <span className="lmd-agent-stat-value">{agent.avgDeliveryTime}m</span>
                <span className="lmd-agent-stat-label">Avg Time</span>
              </div>
              <div className="lmd-agent-stat">
                <div className="lmd-agent-rating">
                  <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                  <span>{agent.rating}</span>
                </div>
                <span className="lmd-agent-stat-label">Rating</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== TAB 4: Performance Analytics =====
  const renderPerformance = () => (
    <div className="lmd-tab-content">
      {/* Charts Row 1 */}
      <div className="lmd-charts-row">
        <div className="lmd-chart-card">
          <div className="lmd-chart-header">
            <h3 className="lmd-chart-title">City-wise Delivery Performance</h3>
            <span className="lmd-chart-subtitle">Success rate & avg delivery time</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data.cityAnalysis} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 11, fill: "#64748b" }} width={80} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="delivered" fill="#059669" radius={[0, 4, 4, 0]} name="Delivered" />
              <Bar dataKey="failed" fill="#fca5a5" radius={[0, 4, 4, 0]} name="Failed" />
              <Line type="monotone" dataKey="successRate" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Success %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="lmd-chart-card">
          <div className="lmd-chart-header">
            <h3 className="lmd-chart-title">Zone Performance Radar</h3>
            <span className="lmd-chart-subtitle">Multi-dimensional comparison</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={data.agentPerformance.slice(0, 5)}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Radar name="Speed" dataKey="speed" stroke="#059669" fill="#d1fae5" fillOpacity={0.5} />
              <Radar name="Accuracy" dataKey="accuracy" stroke="#3b82f6" fill="#dbeafe" fillOpacity={0.5} />
              <Radar name="Rating" dataKey="rating" stroke="#8b5cf6" fill="#ede9fe" fillOpacity={0.5} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="lmd-charts-row">
        <div className="lmd-chart-card">
          <div className="lmd-chart-header">
            <h3 className="lmd-chart-title">Vehicle Type Analysis</h3>
            <span className="lmd-chart-subtitle">Fleet composition & performance</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.vehicleDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Vehicles" />
              <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#10b981" strokeWidth={2} name="Success %" />
              <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Avg Time (min)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="lmd-chart-card">
          <div className="lmd-chart-header">
            <h3 className="lmd-chart-title">Zone-wise Performance</h3>
            <span className="lmd-chart-subtitle">First attempt rate & COD collection</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.zonePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="zone" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="firstAttemptRate" fill="#10b981" radius={[4, 4, 0, 0]} name="1st Attempt %" />
              <Bar dataKey="codCollected" fill="#f59e0b" radius={[4, 4, 0, 0]} name="COD Collected %" />
              <Bar dataKey="successRate" fill="#6366f1" radius={[4, 4, 0, 0]} name="Success %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* City Table */}
      <div className="lmd-table-container">
        <div className="lmd-section-header" style={{ marginBottom: 12 }}>
          <h3 className="lmd-section-title">City-wise Detail Table</h3>
        </div>
        <table className="lmd-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Total</th>
              <th>Delivered</th>
              <th>Success Rate</th>
              <th>Avg Time</th>
              <th>Failed</th>
              <th>COD Rate</th>
              <th>Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.cityAnalysis.map((c, i) => (
              <tr key={i} className="lmd-table-row">
                <td className="lmd-cell-name">{c.city}</td>
                <td className="lmd-cell-center">{c.total}</td>
                <td className="lmd-cell-center">{c.delivered}</td>
                <td className="lmd-cell-center">
                  <div className="lmd-progress-bar">
                    <div className="lmd-progress-fill" style={{ width: `${c.successRate}%`, backgroundColor: c.successRate >= 92 ? "#10b981" : c.successRate >= 88 ? "#f59e0b" : "#ef4444" }} />
                    <span>{c.successRate}%</span>
                  </div>
                </td>
                <td className="lmd-cell-center">{c.avgTime} min</td>
                <td className="lmd-cell-center" style={{ color: c.failed > 15 ? "#ef4444" : "#64748b" }}>{c.failed}</td>
                <td className="lmd-cell-center">{c.codRate}%</td>
                <td className="lmd-cell-center">
                  <div className="lmd-rating-inline">
                    <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                    {c.avgRating}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ===== TAB 5: Payment & COD =====
  const renderPaymentCOD = () => {
    const codDeliveries = data.deliveries.filter(d => d.paymentMethod === "cod");
    const codDelivered = codDeliveries.filter(d => d.status === "delivered");
    const codPending = codDeliveries.filter(d => !["delivered", "returned", "failed"].includes(d.status));
    const totalCODAmount = codDeliveries.reduce((s, d) => s + d.CODAmount, 0);
    const collectedCOD = codDelivered.reduce((s, d) => s + d.CODAmount, 0);
    const pendingCOD = codPending.reduce((s, d) => s + d.CODAmount, 0);
    const upiDeliveries = data.deliveries.filter(d => d.paymentMethod === "upi");

    return (
      <div className="lmd-tab-content">
        {/* Payment KPIs */}
        <div className="lmd-kpi-grid">
          {[
            { label: "Total COD Orders", value: codDeliveries.length.toLocaleString("en-IN"), icon: CreditCard, color: THEME.secondary },
            { label: "COD Collected", value: formatINR(collectedCOD), icon: IndianRupee, color: "#10b981" },
            { label: "COD Pending", value: formatINR(pendingCOD), icon: Clock, color: "#f59e0b" },
            { label: "Collection Rate", value: (collectedCOD / Math.max(totalCODAmount, 1) * 100).toFixed(1) + "%", icon: CheckCircle2, color: "#059669" },
            { label: "UPI Orders", value: upiDeliveries.length.toLocaleString("en-IN"), icon: Zap, color: "#6366f1" },
            { label: "Avg COD Amount", value: formatINR(totalCODAmount / Math.max(codDeliveries.length, 1)), icon: BarChart3, color: "#8b5cf6" },
          ].map((kpi, i) => (
            <div key={i} className="lmd-kpi-card" style={{ borderTopColor: kpi.color }}>
              <div className="lmd-kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                <kpi.icon size={20} />
              </div>
              <div className="lmd-kpi-info">
                <span className="lmd-kpi-label">{kpi.label}</span>
                <span className="lmd-kpi-value">{kpi.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="lmd-charts-row">
          <div className="lmd-chart-card">
            <div className="lmd-chart-header">
              <h3 className="lmd-chart-title">Payment Method Distribution</h3>
              <span className="lmd-chart-subtitle">Prepaid vs COD vs UPI</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.paymentBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="count" nameKey="method" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {data.paymentBreakdown.map((_, i) => (
                    <Cell key={i} fill={["#10b981", "#f59e0b", "#6366f1"][i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lmd-chart-card">
            <div className="lmd-chart-header">
              <h3 className="lmd-chart-title">Monthly COD Collection</h3>
              <span className="lmd-chart-subtitle">₹ Lakhs trend</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" L" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="codCollection" fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} name="COD Collected (₹ L)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COD Pending Table */}
        <div className="lmd-table-container">
          <div className="lmd-section-header" style={{ marginBottom: 12 }}>
            <h3 className="lmd-section-title">COD Orders Awaiting Collection ({codPending.length})</h3>
          </div>
          <table className="lmd-table">
            <thead>
              <tr>
                <th>ID / Order</th>
                <th>Customer</th>
                <th>City</th>
                <th>Agent</th>
                <th>COD Amount</th>
                <th>Status</th>
                <th>Slot</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {codPending.slice(0, 20).map(d => (
                <tr key={d.id} className="lmd-table-row">
                  <td>
                    <div className="lmd-cell-primary">
                      <span className="lmd-cell-id">{d.id}</span>
                      <span className="lmd-cell-sub">{d.orderId}</span>
                    </div>
                  </td>
                  <td className="lmd-cell-name">{d.customer}</td>
                  <td>{d.city}</td>
                  <td>{d.agent}</td>
                  <td className="lmd-cell-amount" style={{ fontWeight: 600 }}>{formatINR(d.CODAmount)}</td>
                  <td>
                    <span className="lmd-badge" style={{ color: STATUS_CONFIG[d.status].color, backgroundColor: STATUS_CONFIG[d.status].bg }}>
                      {STATUS_CONFIG[d.status].label}
                    </span>
                  </td>
                  <td>{d.deliverySlot}</td>
                  <td>
                    <button className="lmd-action-btn" onClick={() => openDrawer(d)}>
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="lmd-table-footer">
            Showing {Math.min(20, codPending.length)} of {codPending.length} COD orders
          </div>
        </div>
      </div>
    );
  };

  // ===== Drawer =====
  const renderDrawer = () => {
    if (!selectedDelivery) return null;
    const d = selectedDelivery;
    const statusCfg = STATUS_CONFIG[d.status];
    const isDelivered = d.status === "delivered";
    const isFailed = d.status === "failed" || d.status === "returned";
    const headerGradient = isDelivered
      ? "linear-gradient(135deg, #059669, #10b981)"
      : isFailed
      ? "linear-gradient(135deg, #dc2626, #ef4444)"
      : "linear-gradient(135deg, #3b82f6, #6366f1)";

    return (
      <div className={`lmd-drawer-overlay ${drawerOpen ? "lmd-drawer-open" : ""}`} onClick={closeDrawer}>
        <div className="lmd-drawer" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="lmd-drawer-header" style={{ background: headerGradient }}>
            <div className="lmd-drawer-header-top">
              <div>
                <h2 className="lmd-drawer-title">{d.id}</h2>
                <span className="lmd-drawer-subtitle">{d.awbNumber} · {d.orderId}</span>
              </div>
              <button className="lmd-drawer-close" onClick={closeDrawer}>✕</button>
            </div>
            <div className="lmd-drawer-badges">
              <span className="lmd-badge" style={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.2)" }}>
                {statusCfg.label}
              </span>
              <span className="lmd-badge" style={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.2)" }}>
                {PRIORITY_CONFIG[d.priority].label}
              </span>
              <span className="lmd-badge" style={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.2)" }}>
                {PAYMENT_CONFIG[d.paymentMethod].label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="lmd-drawer-content">
            {/* Customer */}
            <div className="lmd-drawer-section">
              <h4 className="lmd-drawer-section-title">Customer Details</h4>
              <div className="lmd-drawer-grid">
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Customer</span>
                  <span className="lmd-drawer-field-value">{d.customer}</span>
                </div>
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Phone</span>
                  <span className="lmd-drawer-field-value">{d.phone}</span>
                </div>
                <div className="lmd-drawer-field" style={{ gridColumn: "span 2" }}>
                  <span className="lmd-drawer-field-label">Address</span>
                  <span className="lmd-drawer-field-value">{d.address}, {d.city} - {d.pincode}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="lmd-drawer-section">
              <h4 className="lmd-drawer-section-title">Delivery Information</h4>
              <div className="lmd-drawer-grid">
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Delivery Agent</span>
                  <span className="lmd-drawer-field-value">{d.agent}</span>
                </div>
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Agent Phone</span>
                  <span className="lmd-drawer-field-value">{d.agentPhone}</span>
                </div>
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Delivery Slot</span>
                  <span className="lmd-drawer-field-value">{d.deliverySlot}</span>
                </div>
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Distance</span>
                  <span className="lmd-drawer-field-value">{d.distance} km</span>
                </div>
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Items</span>
                  <span className="lmd-drawer-field-value">{d.items} items · {d.weight} kg</span>
                </div>
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Attempts</span>
                  <span className="lmd-drawer-field-value">{d.attempts}</span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="lmd-drawer-section">
              <h4 className="lmd-drawer-section-title">Key Dates</h4>
              <div className="lmd-drawer-grid">
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Dispatched</span>
                  <span className="lmd-drawer-field-value">{d.dispatchedAt}</span>
                </div>
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Estimated Delivery</span>
                  <span className="lmd-drawer-field-value">{d.estimatedDelivery}</span>
                </div>
                {d.deliveredAt && (
                  <div className="lmd-drawer-field" style={{ gridColumn: "span 2" }}>
                    <span className="lmd-drawer-field-label">Delivered At</span>
                    <span className="lmd-drawer-field-value" style={{ color: "#10b981" }}>{d.deliveredAt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial */}
            <div className="lmd-drawer-section">
              <h4 className="lmd-drawer-section-title">Payment Details</h4>
              <div className="lmd-drawer-grid">
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">Payment Method</span>
                  <span className="lmd-badge" style={{ color: PAYMENT_CONFIG[d.paymentMethod].color, backgroundColor: PAYMENT_CONFIG[d.paymentMethod].bg }}>
                    {PAYMENT_CONFIG[d.paymentMethod].label}
                  </span>
                </div>
                <div className="lmd-drawer-field">
                  <span className="lmd-drawer-field-label">COD Amount</span>
                  <span className="lmd-drawer-field-value" style={{ fontWeight: 600, color: d.CODAmount > 0 ? "#f59e0b" : "#64748b" }}>
                    {d.CODAmount > 0 ? formatINR(d.CODAmount) : "N/A (Prepaid)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Remarks */}
            {d.remarks && (
              <div className="lmd-drawer-card" style={{ backgroundColor: isFailed ? "#fee2e2" : "#d1fae5", borderColor: isFailed ? "#fca5a5" : "#6ee7b7" }}>
                <span className="lmd-drawer-card-label" style={{ color: isFailed ? "#dc2626" : "#059669" }}>
                  {isFailed ? "Failure Reason" : "Delivery Note"}
                </span>
                <span className="lmd-drawer-card-text">{d.remarks}</span>
              </div>
            )}

            {/* POD Status */}
            {isDelivered && (
              <div className="lmd-drawer-section">
                <h4 className="lmd-drawer-section-title">Proof of Delivery</h4>
                <div className="lmd-pod-grid">
                  <div className={`lmd-pod-item ${d.proofOfDelivery ? "lmd-pod-done" : "lmd-pod-pending"}`}>
                    <FileText size={16} />
                    <span>POD Form</span>
                    <span className="lmd-pod-status">{d.proofOfDelivery ? "✓ Submitted" : "Pending"}</span>
                  </div>
                  <div className={`lmd-pod-item ${d.deliveryPhoto ? "lmd-pod-done" : "lmd-pod-pending"}`}>
                    <Camera size={16} />
                    <span>Delivery Photo</span>
                    <span className="lmd-pod-status">{d.deliveryPhoto ? "✓ Captured" : "Missing"}</span>
                  </div>
                  <div className={`lmd-pod-item ${d.ePodSigned ? "lmd-pod-done" : "lmd-pod-pending"}`}>
                    <FileCheck size={16} />
                    <span>E-POD Signed</span>
                    <span className="lmd-pod-status">{d.ePodSigned ? "✓ Signed" : "Pending"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Feedback */}
            {d.customerRating && (
              <div className="lmd-drawer-card" style={{ backgroundColor: "#fef3c7", borderColor: "#fcd34d" }}>
                <span className="lmd-drawer-card-label" style={{ color: "#92400e" }}>Customer Feedback</span>
                <div className="lmd-rating-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={18} fill={star <= Math.round(d.customerRating || 0) ? "#f59e0b" : "#e2e8f0"} stroke="#f59e0b" />
                  ))}
                  <span className="lmd-rating-text">{d.customerRating} / 5</span>
                </div>
                {d.customerFeedback && (
                  <span className="lmd-drawer-card-text">"{d.customerFeedback}"</span>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="lmd-drawer-section">
              <h4 className="lmd-drawer-section-title">Delivery Timeline</h4>
              <div className="lmd-timeline">
                <div className="lmd-timeline-item">
                  <div className="lmd-timeline-dot" style={{ backgroundColor: "#3b82f6" }} />
                  <div>
                    <span className="lmd-timeline-step">Order Dispatched</span>
                    <span className="lmd-timeline-time">{d.dispatchedAt}</span>
                  </div>
                </div>
                <div className="lmd-timeline-item">
                  <div className="lmd-timeline-dot" style={{ backgroundColor: "#f59e0b" }} />
                  <div>
                    <span className="lmd-timeline-step">Picked Up by Agent</span>
                    <span className="lmd-timeline-time">{d.agent}</span>
                  </div>
                </div>
                <div className="lmd-timeline-item">
                  <div className="lmd-timeline-dot" style={{ backgroundColor: "#8b5cf6" }} />
                  <div>
                    <span className="lmd-timeline-step">Out for Delivery</span>
                    <span className="lmd-timeline-time">Slot: {d.deliverySlot}</span>
                  </div>
                </div>
                <div className="lmd-timeline-item">
                  <div className="lmd-timeline-dot" style={{ backgroundColor: isDelivered ? "#10b981" : isFailed ? "#ef4444" : "#64748b" }} />
                  <div>
                    <span className="lmd-timeline-step">{isDelivered ? "Delivered Successfully" : isFailed ? "Delivery Failed" : "In Progress"}</span>
                    <span className="lmd-timeline-time">{d.deliveredAt || d.estimatedDelivery}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="lmd-drawer-actions">
              <button className="lmd-drawer-btn lmd-drawer-btn-primary">
                <PhoneCall size={14} /> Call Customer
              </button>
              <button className="lmd-drawer-btn lmd-drawer-btn-secondary">
                <Navigation size={14} /> Track Live
              </button>
              <button className="lmd-drawer-btn lmd-drawer-btn-secondary">
                <MessageSquare size={14} /> Send Update
              </button>
              <button className="lmd-drawer-btn lmd-drawer-btn-outline">
                <RefreshCw size={14} /> Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="lmd-root">
      {/* Header */}
      <div className="lmd-header">
        <div className="lmd-header-left">
          <div className="lmd-header-icon" style={{ backgroundColor: `${THEME.primary}15`, color: THEME.primary }}>
            <MapPinCheck size={22} />
          </div>
          <div>
            <h1 className="lmd-header-title">Last Mile Delivery Tracking</h1>
            <p className="lmd-header-subtitle">Real-time delivery visibility, agent management & COD reconciliation</p>
          </div>
        </div>
        <div className="lmd-header-right">
          <div className="lmd-header-badge">
            <div className="lmd-header-badge-dot" />
            <span>Live</span>
          </div>
          <span className="lmd-header-stat">{data.deliveries.length} Deliveries</span>
          <span className="lmd-header-stat">{data.agents.length} Agents</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="lmd-tabs">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`lmd-tab ${activeTab === i ? "lmd-tab-active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && renderDashboard()}
      {activeTab === 1 && renderLiveTracking()}
      {activeTab === 2 && renderAgents()}
      {activeTab === 3 && renderPerformance()}
      {activeTab === 4 && renderPaymentCOD()}

      {/* Drawer */}
      {renderDrawer()}
    </div>
  );
}
