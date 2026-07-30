"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  ShoppingCart,
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Box,
  Zap,
  BarChart3,
  ArrowRightLeft,
  Search,
  Eye,
  X,
  Timer,
  Users,
  Globe,
  Star,
  Phone,
  Warehouse,
  FileText,
  CreditCard,
  Undo2,
  Target,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
type OrderChannel = "amazon" | "flipkart" | "meesho" | "jiomart" | "myntra" | "ajio" | "snapdeal" | "direct_website" | "marketplace_api";
type OrderStatus = "pending" | "picked" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "returned" | "rto_initiated" | "rto_received" | "ndr_pending";
type PaymentMethod = "cod" | "prepaid" | "upi" | "card" | "net_banking" | "wallet" | "emi";
type DeliveryPriority = "standard" | "express" | "same_day" | "next_day" | "scheduled";
type NDRReason = "customer_unreachable" | "address_incomplete" | "customer_refused" | "premises_locked" | "wrong_address" | "pincode_not_serviceable" | "multiple_attempts" | "customer_requested_reschedule" | "weather_disruption" | "route_issue";
type PackStatus = "pending" | "in_progress" | "quality_checked" | "sealed" | "labelled" | "manifested";

interface OrderRecord {
  id: string;
  orderNumber: string;
  channel: OrderChannel;
  channelOrderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  items: number;
  totalWeight: number;
  orderValue: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  status: OrderStatus;
  priority: DeliveryPriority;
  warehouse: string;
  assignedPicker: string;
  assignedPacker: string;
  deliveryPartner: string;
  trackingNumber: string;
  orderDate: number;
  promisedDate: number;
  shippedDate: number | null;
  deliveredDate: number | null;
  slaHours: number;
  slaRemaining: number;
  slaBreached: boolean;
  ndrReason: NDRReason | null;
  ndrAttempts: number;
  rtoReason: string | null;
  notes: string;
}

interface DeliveryPartner {
  id: string;
  name: string;
  type: string;
  zone: string;
  fleetSize: number;
  activeDeliveries: number;
  avgDeliveryTime: number;
  successRate: number;
  rating: number;
  totalDelivered: number;
  totalRto: number;
  warehouse: string;
}

interface PackStation {
  id: string;
  name: string;
  warehouse: string;
  status: PackStatus;
  currentOrder: string | null;
  packedToday: number;
  capacity: number;
  avgPackTime: number;
  operator: string;
}

interface HubZone {
  id: string;
  name: string;
  city: string;
  pincodePrefix: string;
  coveragePincodes: number;
  activeOrders: number;
  deliveryPartners: number;
  avgTat: number;
  slaCompliance: number;
  dailyCapacity: number;
}

// ============================================================================
// Constants
// ============================================================================
const WAREHOUSES = [
  "WH-Mumbai-Navi",
  "WH-Delhi-NCR",
  "WH-Chennai-Siruseri",
  "WH-Bangalore-Whitefield",
  "WH-Kolkata-Haldia",
  "WH-Hyderabad-Gachibowli",
];

const CHANNEL_CONFIG: Record<OrderChannel, { label: string; color: string; logo: string }> = {
  amazon: { label: "Amazon India", color: "#ff9900", logo: "AMZ" },
  flipkart: { label: "Flipkart", color: "#2874f0", logo: "FKT" },
  meesho: { label: "Meesho", color: "#e91e63", logo: "MSH" },
  jiomart: { label: "JioMart", color: "#0078ad", logo: "JIO" },
  myntra: { label: "Myntra", color: "#ff3f6c", logo: "MYN" },
  ajio: { label: "AJIO", color: "#3b0764", logo: "AJI" },
  snapdeal: { label: "Snapdeal", color: "#e40046", logo: "SD" },
  direct_website: { label: "Direct Website", color: "#10b981", logo: "WEB" },
  marketplace_api: { label: "Marketplace API", color: "#6366f1", logo: "API" },
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  picked: { label: "Picked", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
  packed: { label: "Packed", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  shipped: { label: "Shipped", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  out_for_delivery: { label: "Out for Delivery", color: "#0d9488", bg: "rgba(13,148,136,0.15)" },
  delivered: { label: "Delivered", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  cancelled: { label: "Cancelled", color: "#6b7280", bg: "rgba(107,114,128,0.15)" },
  returned: { label: "Returned", color: "#ec4899", bg: "rgba(236,72,153,0.15)" },
  rto_initiated: { label: "RTO Initiated", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
  rto_received: { label: "RTO Received", color: "#dc2626", bg: "rgba(220,38,38,0.15)" },
  ndr_pending: { label: "NDR Pending", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

const PRIORITY_CONFIG: Record<DeliveryPriority, { label: string; color: string }> = {
  standard: { label: "Standard", color: "#6b7280" },
  express: { label: "Express", color: "#3b82f6" },
  same_day: { label: "Same Day", color: "#ef4444" },
  next_day: { label: "Next Day", color: "#f59e0b" },
  scheduled: { label: "Scheduled", color: "#10b981" },
};

const NDR_CONFIG: Record<NDRReason, { label: string; color: string }> = {
  customer_unreachable: { label: "Customer Unreachable", color: "#f59e0b" },
  address_incomplete: { label: "Address Incomplete", color: "#ef4444" },
  customer_refused: { label: "Customer Refused", color: "#dc2626" },
  premises_locked: { label: "Premises Locked", color: "#f97316" },
  wrong_address: { label: "Wrong Address", color: "#6366f1" },
  pincode_not_serviceable: { label: "Pincode Not Serviceable", color: "#6b7280" },
  multiple_attempts: { label: "Multiple Attempts", color: "#ec4899" },
  customer_requested_reschedule: { label: "Reschedule Requested", color: "#3b82f6" },
  weather_disruption: { label: "Weather Disruption", color: "#14b8a6" },
  route_issue: { label: "Route Issue", color: "#8b5cf6" },
};

const THEME = {
  primary: "#f97316",
  secondary: "#3b82f6",
  accent: "#10b981",
  success: "#10b981",
  danger: "#ef4444",
  bg: "#0f172a",
};

// ============================================================================
// Seeded Random & Data Generation
// ============================================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateData() {
  const rand = seededRandom(124124);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
  const pickIdx = <T,>(arr: readonly T[]): number => Math.floor(rand() * arr.length);
  const now = Date.now();
  const day = 86400000;
  const hour = 3600000;

  const channels: OrderChannel[] = ["amazon", "flipkart", "meesho", "jiomart", "myntra", "ajio", "snapdeal", "direct_website", "marketplace_api"];
  const statuses: OrderStatus[] = ["pending", "picked", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned", "rto_initiated", "rto_received", "ndr_pending"];
  const payments: PaymentMethod[] = ["cod", "prepaid", "upi", "card", "net_banking", "wallet", "emi"];
  const priorities: DeliveryPriority[] = ["standard", "express", "same_day", "next_day", "scheduled"];
  const ndrReasons: NDRReason[] = ["customer_unreachable", "address_incomplete", "customer_refused", "premises_locked", "wrong_address", "pincode_not_serviceable", "multiple_attempts", "customer_requested_reschedule", "weather_disruption", "route_issue"];
  const packStatuses: PackStatus[] = ["pending", "in_progress", "quality_checked", "sealed", "labelled", "manifested"];

  const cities = [
    { name: "Mumbai", state: "Maharashtra", pincodes: ["400001", "400051", "400060", "400068", "400076"] },
    { name: "Delhi", state: "Delhi NCR", pincodes: ["110001", "110005", "110015", "110045", "110053"] },
    { name: "Bangalore", state: "Karnataka", pincodes: ["560001", "560034", "560048", "560076", "560100"] },
    { name: "Chennai", state: "Tamil Nadu", pincodes: ["600001", "600020", "600041", "600077", "600096"] },
    { name: "Hyderabad", state: "Telangana", pincodes: ["500001", "500018", "500032", "500048", "500081"] },
    { name: "Kolkata", state: "West Bengal", pincodes: ["700001", "700012", "700040", "700053", "700091"] },
    { name: "Pune", state: "Maharashtra", pincodes: ["411001", "411014", "411028", "411038", "411052"] },
    { name: "Jaipur", state: "Rajasthan", pincodes: ["302001", "302006", "302015", "302020", "302029"] },
    { name: "Lucknow", state: "Uttar Pradesh", pincodes: ["226001", "226010", "226016", "226022", "226028"] },
    { name: "Ahmedabad", state: "Gujarat", pincodes: ["380001", "380006", "380015", "380054", "380058"] },
    { name: "Coimbatore", state: "Tamil Nadu", pincodes: ["641001", "641011", "641018", "641030", "641035"] },
    { name: "Indore", state: "Madhya Pradesh", pincodes: ["452001", "452010", "452014", "452016", "452018"] },
  ];

  const firstNames = ["Aarav", "Priya", "Rahul", "Ananya", "Vikram", "Sneha", "Arjun", "Meera", "Karan", "Pooja", "Rohit", "Divya", "Amit", "Nisha", "Sanjay", "Ritu", "Deepak", "Kavita", "Manish", "Swati", "Suresh", "Rekha", "Rajesh", "Sunita", "Vijay", "Asha", "Nikhil", "Pallavi", "Tarun", "Anita"];
  const lastNames = ["Sharma", "Patel", "Kumar", "Gupta", "Singh", "Reddy", "Nair", "Iyer", "Mehta", "Joshi", "Das", "Mishra", "Verma", "Chopra", "Malhotra", "Bhat", "Rao", "Desai", "Menon", "Pillai"];
  const streets = ["MG Road", "Anna Nagar", "Sector 18", "Juhu Tara Rd", "Park Street", "CMH Road", "T Nagar", "Banjara Hills", "Salt Lake", "FC Road", "Gandhi Bazaar", "Jayanagar", "Koregaon Park", "Civil Lines", "Vastrapur"];
  const pickers = ["Ravi Kumar", "Suresh M", "Dinesh R", "Anand P", "Mohan K", "Ganesh S", "Raj T", "Bharat V", "Siddharth N", "Prakash J"];
  const packers = ["Geeta M", "Lakshmi S", "Saroja D", "Kamala P", "Vijayalakshmi R", "Chitra K", "Padma V", "Revathi N", "Malliga T", "Sumathi J"];
  const partners = [
    { name: "BlueDart Express", type: "Air Express", zone: "National" },
    { name: "Delhivery Surface", type: "Surface", zone: "North" },
    { name: "DTDC Express", type: "Express", zone: "South" },
    { name: "Ekart Logistics", type: "E-commerce", zone: "National" },
    { name: "Shadowfax", type: "Last-Mile", zone: "West" },
    { name: "Ecom Express", type: "Surface", zone: "East" },
    { name: "XpressBees", type: "Express", zone: "National" },
    { name: "India Post Speed Post", type: "Government", zone: "National" },
    { name: "DHL eCommerce", type: "Cross-border", zone: "National" },
    { name: "Shiprocket", type: "Aggregator", zone: "National" },
  ];

  // 250 orders
  const orders: OrderRecord[] = [];
  for (let i = 0; i < 250; i++) {
    const channel = pick(channels);
    const status = pick(statuses);
    const city = pick(cities);
    const daysAgo = Math.floor(rand() * 14) + 1;
    const orderDate = now - daysAgo * day - Math.floor(rand() * 24) * hour;
    const slaHours = pick([24, 48, 72, 96, 120]);
    const elapsed = (now - orderDate) / hour;
    const slaRemaining = Math.max(slaHours - elapsed, 0);
    const slaBreached = elapsed > slaHours;
    const isNdr = status === "ndr_pending";
    const isRto = status === "rto_initiated" || status === "rto_received";
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);

    orders.push({
      id: `ORD-${String(i + 1).padStart(5, "0")}`,
      orderNumber: `AF${now.toString(36).toUpperCase().slice(-4)}${String(i + 1).padStart(6, "0")}`,
      channel,
      channelOrderId: `${CHANNEL_CONFIG[channel].logo}-${String(Math.floor(rand() * 90000000) + 10000000)}`,
      customerName: `${firstName} ${lastName}`,
      customerPhone: `+91 ${Math.floor(rand() * 90000) + 10000}${Math.floor(rand() * 90000) + 10000}`,
      address: `${Math.floor(rand() * 300) + 1}, ${pick(streets)}`,
      city: city.name,
      pincode: pick(city.pincodes),
      state: city.state,
      items: Math.floor(rand() * 5) + 1,
      totalWeight: Math.round(rand() * 5000 + 100),
      orderValue: Math.round(rand() * 8000 + 199),
      paymentMethod: pick(payments),
      paymentStatus: status === "cancelled" ? "refunded" : status === "returned" ? "refunded" : pick(["paid", "paid", "paid", "pending"]),
      status,
      priority: pick(priorities),
      warehouse: pick(WAREHOUSES),
      assignedPicker: pick(pickers),
      assignedPacker: pick(packers),
      deliveryPartner: pick(partners).name,
      trackingNumber: `AWB${String(Math.floor(rand() * 9000000000) + 1000000000)}`,
      orderDate,
      promisedDate: orderDate + slaHours * hour,
      shippedDate: ["shipped", "out_for_delivery", "delivered", "returned", "rto_initiated", "rto_received"].includes(status) ? orderDate + Math.floor(rand() * 48 + 6) * hour : null,
      deliveredDate: status === "delivered" ? orderDate + Math.floor(rand() * 72 + 12) * hour : status === "returned" ? orderDate + Math.floor(rand() * 96 + 24) * hour : null,
      slaHours,
      slaRemaining,
      slaBreached,
      ndrReason: isNdr ? pick(ndrReasons) : null,
      ndrAttempts: isNdr ? Math.floor(rand() * 3) + 1 : 0,
      rtoReason: isRto ? pick(["Customer refused delivery", "Wrong address — no one available", "Customer unreachable after 3 attempts", "Damaged during transit — customer rejected", "Address not found", "Customer cancelled after dispatch"]) : null,
      notes: pick(["Priority delivery", "Fragile items", "Customer requested gift wrap", "POD required", "OTP verification needed", "Cash on delivery — exact change", "High value — insurance applied", "Multiple items — verify count", "Customer VIP — white glove", "Rescheduled delivery", "Address updated", "Contact support", "No special instructions"]),
    });
  }

  // 10 delivery partners
  const deliveryPartners: DeliveryPartnerRecord[] = partners.map((p, i) => {
    const total = Math.floor(rand() * 3000) + 500;
    const rto = Math.floor(total * rand() * 0.12);
    return {
      id: `DP-${String(i + 1).padStart(3, "0")}`,
      name: p.name,
      type: p.type,
      zone: p.zone,
      fleetSize: Math.floor(rand() * 200) + 20,
      activeDeliveries: Math.floor(rand() * 150) + 10,
      avgDeliveryTime: Math.round((rand() * 72 + 12) * 10) / 10,
      successRate: Math.round((1 - rto / total) * 10000) / 100,
      rating: Math.round((rand() * 1.5 + 3.5) * 10) / 10,
      totalDelivered: total,
      totalRto: rto,
      warehouse: pick(WAREHOUSES),
    };
  });

  // 8 pack stations
  const packStations: PackStation[] = [];
  for (let i = 0; i < 8; i++) {
    const pStatus = pick(packStatuses);
    const capacity = Math.floor(rand() * 200) + 50;
    packStations.push({
      id: `PS-${String(i + 1).padStart(3, "0")}`,
      name: `Pack Station ${i + 1}`,
      warehouse: pick(WAREHOUSES),
      status: pStatus,
      currentOrder: pStatus === "in_progress" ? orders[Math.floor(rand() * orders.length)].orderNumber : null,
      packedToday: Math.floor(rand() * capacity),
      capacity,
      avgPackTime: Math.round((rand() * 3 + 1) * 100) / 100,
      operator: pick(packers),
    });
  }

  // 12 delivery hub zones
  const hubZones: HubZone[] = cities.map((c, i) => ({
    id: `HZ-${String(i + 1).padStart(3, "0")}`,
    name: `${c.name} Hub`,
    city: c.name,
    pincodePrefix: c.pincodes[0].slice(0, 3),
    coveragePincodes: Math.floor(rand() * 5000) + 500,
    activeOrders: Math.floor(rand() * 500) + 20,
    deliveryPartners: Math.floor(rand() * 6) + 2,
    avgTat: Math.round((rand() * 72 + 12) * 10) / 10,
    slaCompliance: Math.round((rand() * 30 + 65) * 10) / 10,
    dailyCapacity: Math.floor(rand() * 2000) + 200,
  }));

  // Monthly fulfillment trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fulfillTrend = months.map(m => ({
    month: m,
    orders: Math.floor(rand() * 5000) + 2000,
    delivered: Math.floor(rand() * 4000) + 1800,
    returns: Math.floor(rand() * 300) + 30,
    ndr: Math.floor(rand() * 200) + 20,
    rto: Math.floor(rand() * 150) + 15,
    avgSlaBreach: Math.round((rand() * 15 + 2) * 10) / 10,
  }));

  // Channel mix
  const channelMix = channels.map(ch => ({
    channel: CHANNEL_CONFIG[ch].label,
    orders: orders.filter(o => o.channel === ch).length + Math.floor(rand() * 100),
    revenue: Math.floor(rand() * 500000) + 50000,
    color: CHANNEL_CONFIG[ch].color,
  }));

  return {
    orders,
    deliveryPartners,
    packStations,
    hubZones,
    fulfillTrend,
    channelMix,
    months,
  };
}

type DeliveryPartnerRecord = {
  id: string;
  name: string;
  type: string;
  zone: string;
  fleetSize: number;
  activeDeliveries: number;
  avgDeliveryTime: number;
  successRate: number;
  rating: number;
  totalDelivered: number;
  totalRto: number;
  warehouse: string;
};

// ============================================================================
// Helpers
// ============================================================================
function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtDateTime(ts: number) {
  return new Date(ts).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
function fmtCurrency(val: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
}

// ============================================================================
// Component
// ============================================================================
export default function EcommerceFulfillmentView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [ndrFilterReason, setNdrFilterReason] = useState("all");

  const tabs = [
    { label: "Fulfillment Overview", icon: <ShoppingCart className="w-4 h-4" /> },
    { label: "Order Pipeline", icon: <Package className="w-4 h-4" /> },
    { label: "Pick-Pack-Ship", icon: <Box className="w-4 h-4" /> },
    { label: "NDR & RTO", icon: <Undo2 className="w-4 h-4" /> },
    { label: "Delivery Partners", icon: <Truck className="w-4 h-4" /> },
  ];

  // KPIs
  const totalOrders = data.orders.length;
  const pendingOrders = data.orders.filter(o => o.status === "pending" || o.status === "picked" || o.status === "packed").length;
  const inTransit = data.orders.filter(o => ["shipped", "out_for_delivery"].includes(o.status)).length;
  const delivered = data.orders.filter(o => o.status === "delivered").length;
  const ndrPending = data.orders.filter(o => o.status === "ndr_pending").length;
  const rtoOrders = data.orders.filter(o => ["rto_initiated", "rto_received"].includes(o.status)).length;
  const slaBreached = data.orders.filter(o => o.slaBreached).length;
  const totalRevenue = data.orders.reduce((a, o) => a + o.orderValue, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return data.orders.filter(o => {
      if (searchQ && !o.orderNumber.toLowerCase().includes(searchQ.toLowerCase()) && !o.customerName.toLowerCase().includes(searchQ.toLowerCase()) && !o.channelOrderId.toLowerCase().includes(searchQ.toLowerCase()) && !o.trackingNumber.toLowerCase().includes(searchQ.toLowerCase())) return false;
      if (filterChannel !== "all" && o.channel !== filterChannel) return false;
      if (filterStatus !== "all" && o.status !== filterStatus) return false;
      if (filterWarehouse !== "all" && o.warehouse !== filterWarehouse) return false;
      if (filterPriority !== "all" && o.priority !== filterPriority) return false;
      return true;
    });
  }, [data.orders, searchQ, filterChannel, filterStatus, filterWarehouse, filterPriority]);

  // NDR filtered
  const ndrOrders = useMemo(() => {
    return data.orders.filter(o => o.status === "ndr_pending" || o.ndrReason !== null || o.ndrAttempts > 0);
  }, [data.orders]);

  const filteredNdr = useMemo(() => {
    return ndrOrders.filter(o => {
      if (ndrFilterReason !== "all" && o.ndrReason !== ndrFilterReason) return false;
      return true;
    });
  }, [ndrOrders, ndrFilterReason]);

  // Status distribution
  const statusDist = useMemo(() => {
    const map: Record<string, number> = {};
    data.orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ name: STATUS_CONFIG[k as OrderStatus]?.label || k, value: v, color: STATUS_CONFIG[k as OrderStatus]?.color || "#6b7280" }));
  }, [data.orders]);

  // Channel distribution
  const channelDist = useMemo(() => {
    const map: Record<string, number> = {};
    data.orders.forEach(o => { map[o.channel] = (map[o.channel] || 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ name: CHANNEL_CONFIG[k as OrderChannel]?.label || k, value: v, color: CHANNEL_CONFIG[k as OrderChannel]?.color || "#6b7280" }));
  }, [data.orders]);

  // Priority distribution
  const priorityDist = useMemo(() => {
    const map: Record<string, number> = {};
    data.orders.forEach(o => { map[o.priority] = (map[o.priority] || 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ name: PRIORITY_CONFIG[k as DeliveryPriority]?.label || k, value: v, color: PRIORITY_CONFIG[k as DeliveryPriority]?.color || "#6b7280" }));
  }, [data.orders]);

  // NDR reason distribution
  const ndrReasonDist = useMemo(() => {
    const map: Record<string, number> = {};
    data.orders.forEach(o => {
      if (o.ndrReason) map[o.ndrReason] = (map[o.ndrReason] || 0) + 1;
    });
    return Object.entries(map).map(([k, v]) => ({ name: NDR_CONFIG[k as NDRReason]?.label || k, value: v, color: NDR_CONFIG[k as NDRReason]?.color || "#6b7280" }));
  }, [data.orders]);

  const openDrawer = (order: OrderRecord) => {
    setSelectedOrder(order);
    setShowDrawer(true);
  };

  return (
    <div className="ecom-fulfillment-container">
      {/* Header */}
      <div className="ecom-header">
        <div className="ecom-header-top-border" />
        <div className="ecom-header-content">
          <div className="ecom-header-left">
            <div className="ecom-header-icon-wrap">
              <ShoppingCart className="w-6 h-6 ecom-header-icon" />
            </div>
            <div>
              <h1 className="ecom-header-title">E-Commerce Fulfillment &amp; Last-Mile Delivery</h1>
              <p className="ecom-header-subtitle">Multi-Channel Order Management — Amazon, Flipkart, Meesho, Myntra &amp; More</p>
            </div>
          </div>
          <div className="ecom-header-badges">
            <div className="ecom-badge ecom-badge-primary">
              <Package className="w-3.5 h-3.5" />
              <span>{totalOrders} Orders</span>
            </div>
            <div className="ecom-badge ecom-badge-info">
              <Truck className="w-3.5 h-3.5" />
              <span>{inTransit} In Transit</span>
            </div>
            <div className="ecom-badge ecom-badge-warning">
              <Timer className="w-3.5 h-3.5" />
              <span>{slaBreached} SLA Breach</span>
            </div>
            <div className="ecom-badge ecom-badge-danger">
              <Undo2 className="w-3.5 h-3.5" />
              <span>{ndrPending} NDR</span>
            </div>
            <div className="ecom-badge ecom-badge-success">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{fmtCurrency(totalRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="ecom-tabs-bar">
        {tabs.map((tab, idx) => (
          <button key={idx} className={`ecom-tab ${activeTab === idx ? "ecom-tab-active" : ""}`} onClick={() => setActiveTab(idx)}>
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="ecom-tab-content">
        {/* Tab 0: Fulfillment Overview */}
        {activeTab === 0 && (
          <div className="ecom-overview-grid">
            {/* KPI Cards */}
            {[
              { label: "Total Orders", value: totalOrders, icon: <ShoppingCart className="w-5 h-5" />, gradient: "ecom-kpi-gradient-1", sub: `${fmtCurrency(totalRevenue)} total` },
              { label: "Pending Processing", value: pendingOrders, icon: <Clock className="w-5 h-5" />, gradient: "ecom-kpi-gradient-2", sub: "Pick + Pack queue" },
              { label: "In Transit", value: inTransit, icon: <Truck className="w-5 h-5" />, gradient: "ecom-kpi-gradient-3", sub: "Shipped + OFD" },
              { label: "Delivered", value: delivered, icon: <CheckCircle2 className="w-5 h-5" />, gradient: "ecom-kpi-gradient-4", sub: `${Math.round(delivered / totalOrders * 100)}% rate` },
              { label: "SLA Breached", value: slaBreached, icon: <AlertTriangle className="w-5 h-5" />, gradient: "ecom-kpi-gradient-5", sub: `${Math.round(slaBreached / totalOrders * 100)}% breach` },
              { label: "NDR + RTO", value: ndrPending + rtoOrders, icon: <Undo2 className="w-5 h-5" />, gradient: "ecom-kpi-gradient-6", sub: `${ndrPending} NDR, ${rtoOrders} RTO` },
            ].map((kpi, idx) => (
              <div key={idx} className={`ecom-kpi-card ${kpi.gradient} ecom-stagger-${idx + 1}`}>
                <div className="ecom-kpi-icon-wrap">{kpi.icon}</div>
                <div className="ecom-kpi-text">
                  <p className="ecom-kpi-label">{kpi.label}</p>
                  <p className="ecom-kpi-value">{kpi.value}</p>
                  <p className="ecom-kpi-sub">{kpi.sub}</p>
                </div>
              </div>
            ))}

            {/* Status Distribution Pie */}
            <Card className="hover-lift-sm ecom-chart-card ecom-stagger-7">
              <CardHeader className="ecom-card-header">
                <CardTitle className="ecom-card-title">
                  <span className="ecom-chart-title-icon" style={{ background: THEME.primary }}>
                    <BarChart3 className="w-4 h-4" />
                  </span>
                  Order Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={statusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#475569" }}>
                      {statusDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Fulfillment Trend */}
            <Card className="hover-lift-sm ecom-chart-card ecom-stagger-8">
              <CardHeader className="ecom-card-header">
                <CardTitle className="ecom-card-title">
                  <span className="ecom-chart-title-icon" style={{ background: THEME.secondary }}>
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  Monthly Fulfillment Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={data.fulfillTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="orders" fill="rgba(249,115,22,0.2)" stroke="#f97316" name="Orders" />
                    <Line yAxisId="left" type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} dot={false} name="Delivered" />
                    <Bar yAxisId="left" dataKey="returns" fill="#ec4899" radius={[2, 2, 0, 0]} name="Returns" />
                    <Line yAxisId="right" type="monotone" dataKey="avgSlaBreach" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="SLA Breach %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Channel Mix Donut */}
            <Card className="hover-lift-sm ecom-chart-card ecom-stagger-9">
              <CardHeader className="ecom-card-header">
                <CardTitle className="ecom-card-title">
                  <span className="ecom-chart-title-icon" style={{ background: THEME.accent }}>
                    <Globe className="w-4 h-4" />
                  </span>
                  Channel Mix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={channelDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""} labelLine={{ stroke: "#475569" }}>
                      {channelDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card className="hover-lift-sm ecom-chart-card ecom-stagger-10">
              <CardHeader className="ecom-card-header">
                <CardTitle className="ecom-card-title">
                  <span className="ecom-chart-title-icon" style={{ background: "#ec4899" }}>
                    <Zap className="w-4 h-4" />
                  </span>
                  Delivery Priority Mix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={priorityDist} cx="50%" cy="50%" outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {priorityDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Channel Bar */}
            <Card className="hover-lift-sm ecom-chart-card ecom-stagger-11">
              <CardHeader className="ecom-card-header">
                <CardTitle className="ecom-card-title">
                  <span className="ecom-chart-title-icon" style={{ background: "#8b5cf6" }}>
                    <CreditCard className="w-4 h-4" />
                  </span>
                  Revenue by Channel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.channelMix}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="channel" stroke="#94a3b8" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* NDR+RTO+Returns Trend */}
            <Card className="hover-lift-sm ecom-chart-card ecom-stagger-12">
              <CardHeader className="ecom-card-header">
                <CardTitle className="ecom-card-title">
                  <span className="ecom-chart-title-icon" style={{ background: "#dc2626" }}>
                    <TrendingDown className="w-4 h-4" />
                  </span>
                  NDR / RTO / Returns Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={data.fulfillTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Legend />
                    <Area type="monotone" dataKey="returns" stackId="a" fill="#ec4899" fillOpacity={0.3} stroke="#ec4899" name="Returns" />
                    <Area type="monotone" dataKey="ndr" stackId="a" fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" name="NDR" />
                    <Area type="monotone" dataKey="rto" stackId="a" fill="#f97316" fillOpacity={0.3} stroke="#f97316" name="RTO" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 1: Order Pipeline */}
        {activeTab === 1 && (
          <div className="ecom-pipeline-section">
            <div className="ecom-filter-bar">
              <div className="ecom-filter-group">
                <div className="ecom-search-wrap">
                  <Search className="w-4 h-4 ecom-search-icon" />
                  <Input placeholder="Search order#, customer, channel ID, AWB..." className="ecom-search-input" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
                </div>
                <select className="ecom-filter-select" value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)}>
                  <option value="all">All Channels</option>
                  {Object.entries(CHANNEL_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select className="ecom-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select className="ecom-filter-select" value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)}>
                  <option value="all">All Warehouses</option>
                  {WAREHOUSES.map(wh => <option key={wh} value={wh}>{wh}</option>)}
                </select>
                <select className="ecom-filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="all">All Priority</option>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="ecom-filter-info">
                <span className="ecom-filter-count">{filteredOrders.length} of {totalOrders}</span>
              </div>
            </div>

            <div className="ecom-table-wrap">
              <table className="ecom-table">
                <thead>
                  <tr className="ecom-table-head">
                    <th>Order#</th>
                    <th>Channel</th>
                    <th>Customer</th>
                    <th>City / Pincode</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Payment</th>
                    <th>Value</th>
                    <th>Items</th>
                    <th>SLA</th>
                    <th>Partner</th>
                    <th>AWB</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 50).map((o, idx) => (
                    <tr key={o.id} className={`ecom-table-row ecom-stagger-${(idx % 10) + 1}`}>
                      <td className="ecom-cell-mono">{o.orderNumber}</td>
                      <td>
                        <span className="ecom-channel-badge" style={{ color: CHANNEL_CONFIG[o.channel].color, backgroundColor: `${CHANNEL_CONFIG[o.channel].color}20`, borderColor: CHANNEL_CONFIG[o.channel].color }}>
                          {CHANNEL_CONFIG[o.channel].logo}
                        </span>
                      </td>
                      <td>
                        <span className="ecom-customer-name">{o.customerName}</span>
                        <span className="ecom-customer-phone">{o.customerPhone}</span>
                      </td>
                      <td className="ecom-cell-city">
                        <span>{o.city}</span>
                        <span className="ecom-cell-pin">{o.pincode}</span>
                      </td>
                      <td>
                        <span className="ecom-status-badge" style={{ color: STATUS_CONFIG[o.status].color, backgroundColor: STATUS_CONFIG[o.status].bg, borderColor: STATUS_CONFIG[o.status].color }}>
                          <span className="ecom-status-dot" style={{ backgroundColor: STATUS_CONFIG[o.status].color }} />
                          {STATUS_CONFIG[o.status].label}
                        </span>
                      </td>
                      <td>
                        <span className="ecom-priority-badge" style={{ color: PRIORITY_CONFIG[o.priority].color }}>
                          {PRIORITY_CONFIG[o.priority].label}
                        </span>
                      </td>
                      <td>
                        <span className="ecom-payment-badge ecom-payment-{o.paymentMethod}">
                          {o.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                      <td className="ecom-cell-value">{fmtCurrency(o.orderValue)}</td>
                      <td className="ecom-cell-center">{o.items}</td>
                      <td>
                        <span className={`ecom-sla-badge ${o.slaBreached ? "ecom-sla-breached" : o.slaRemaining < 4 ? "ecom-sla-urgent" : "ecom-sla-ok"}`}>
                          {o.slaBreached ? "BREACHED" : `${Math.floor(o.slaRemaining)}h left`}
                        </span>
                      </td>
                      <td className="ecom-cell-partner">{o.deliveryPartner}</td>
                      <td className="ecom-cell-awb">{o.trackingNumber}</td>
                      <td>
                        <Button size="sm" variant="outline" className="press-scale btn-outline-animate ecom-action-btn" onClick={() => openDrawer(o)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Pick-Pack-Ship */}
        {activeTab === 2 && (
          <div className="ecom-pps-section">
            {/* Pack Station Cards */}
            <div className="ecom-station-grid">
              {data.packStations.map((ps, idx) => (
                <div key={ps.id} className={`ecom-station-card ecom-stagger-${idx + 1}`}>
                  <div className="ecom-station-header">
                    <div className="ecom-station-name">
                      <Box className="w-4 h-4" />
                      <span>{ps.name}</span>
                    </div>
                    <span className={`ecom-station-status ecom-station-status-${ps.status}`}>
                      {ps.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="ecom-station-meta">
                    <span className="ecom-station-warehouse">{ps.warehouse}</span>
                    <span className="ecom-station-operator">
                      <Users className="w-3 h-3" /> {ps.operator}
                    </span>
                  </div>
                  <div className="ecom-station-progress">
                    <div className="ecom-station-progress-bar">
                      <div className="ecom-station-progress-fill" style={{ width: `${(ps.packedToday / ps.capacity) * 100}%` }} />
                    </div>
                    <span className="ecom-station-progress-text">{ps.packedToday} / {ps.capacity}</span>
                  </div>
                  <div className="ecom-station-stats">
                    <div className="ecom-station-stat">
                      <span className="ecom-stat-label">Avg Pack Time</span>
                      <span className="ecom-stat-value">{ps.avgPackTime}s</span>
                    </div>
                    <div className="ecom-station-stat">
                      <span className="ecom-stat-label">Current Order</span>
                      <span className="ecom-stat-value">{ps.currentOrder || "Idle"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hub Zone Grid */}
            <Card className="hover-lift-sm ecom-chart-card" style={{ marginTop: "1rem" }}>
              <CardHeader className="ecom-card-header">
                <CardTitle className="ecom-card-title">
                  <span className="ecom-chart-title-icon" style={{ background: THEME.secondary }}>
                    <MapPin className="w-4 h-4" />
                  </span>
                  Delivery Hub Zones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="ecom-hub-grid">
                  {data.hubZones.map((hz, idx) => (
                    <div key={hz.id} className={`ecom-hub-card ecom-stagger-${(idx % 10) + 1}`}>
                      <div className="ecom-hub-name">{hz.name}</div>
                      <div className="ecom-hub-city">{hz.city} — {hz.pincodePrefix}***</div>
                      <div className="ecom-hub-stats">
                        <div className="ecom-hub-stat">
                          <span className="ecom-hub-stat-value">{hz.activeOrders}</span>
                          <span className="ecom-hub-stat-label">Active</span>
                        </div>
                        <div className="ecom-hub-stat">
                          <span className="ecom-hub-stat-value">{hz.deliveryPartners}</span>
                          <span className="ecom-hub-stat-label">Partners</span>
                        </div>
                        <div className="ecom-hub-stat">
                          <span className="ecom-hub-stat-value">{hz.avgTat}h</span>
                          <span className="ecom-hub-stat-label">Avg TAT</span>
                        </div>
                        <div className="ecom-hub-stat">
                          <span className="ecom-hub-stat-value">{hz.slaCompliance}%</span>
                          <span className="ecom-hub-stat-label">SLA</span>
                        </div>
                      </div>
                      <div className="ecom-hub-capacity-bar">
                        <div className="ecom-hub-capacity-fill" style={{ width: `${Math.min((hz.activeOrders / hz.dailyCapacity) * 100, 100)}%`, backgroundColor: hz.activeOrders / hz.dailyCapacity > 0.8 ? "#ef4444" : hz.activeOrders / hz.dailyCapacity > 0.6 ? "#f59e0b" : "#10b981" }} />
                      </div>
                      <span className="ecom-hub-coverage">{hz.coveragePincodes} pincodes</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: NDR & RTO */}
        {activeTab === 3 && (
          <div className="ecom-ndr-section">
            {/* NDR KPIs */}
            <div className="ecom-ndr-kpis">
              <div className="ecom-ndr-kpi ecom-ndr-kpi-pending ecom-stagger-1">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <p className="ecom-ndr-kpi-value">{ndrPending}</p>
                  <p className="ecom-ndr-kpi-label">NDR Pending</p>
                </div>
              </div>
              <div className="ecom-ndr-kpi ecom-ndr-kpi-rto ecom-stagger-2">
                <ArrowRightLeft className="w-5 h-5" />
                <div>
                  <p className="ecom-ndr-kpi-value">{rtoOrders}</p>
                  <p className="ecom-ndr-kpi-label">RTO Orders</p>
                </div>
              </div>
              <div className="ecom-ndr-kpi ecom-ndr-kpi-rate ecom-stagger-3">
                <TrendingDown className="w-5 h-5" />
                <div>
                  <p className="ecom-ndr-kpi-value">{Math.round((ndrPending + rtoOrders) / totalOrders * 100)}%</p>
                  <p className="ecom-ndr-kpi-label">Failure Rate</p>
                </div>
              </div>
              <div className="ecom-ndr-kpi ecom-ndr-kpi-attempts ecom-stagger-4">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="ecom-ndr-kpi-value">{ndrOrders.reduce((a, o) => a + o.ndrAttempts, 0)}</p>
                  <p className="ecom-ndr-kpi-label">Total Attempts</p>
                </div>
              </div>
              <div className="ecom-ndr-kpi ecom-ndr-kpi-value ecom-stagger-5">
                <CreditCard className="w-5 h-5" />
                <div>
                  <p className="ecom-ndr-kpi-value">{fmtCurrency(ndrOrders.reduce((a, o) => a + o.orderValue, 0))}</p>
                  <p className="ecom-ndr-kpi-label">At-Risk Value</p>
                </div>
              </div>
              <div className="ecom-ndr-kpi ecom-ndr-kpi-compliance ecom-stagger-6">
                <Target className="w-5 h-5" />
                <div>
                  <p className="ecom-ndr-kpi-value">{Math.round((1 - ndrPending / (delivered + ndrPending)) * 100)}%</p>
                  <p className="ecom-ndr-kpi-label">Delivery Success</p>
                </div>
              </div>
            </div>

            {/* NDR Reason Distribution */}
            <Card className="hover-lift-sm ecom-chart-card ecom-stagger-7">
              <CardHeader className="ecom-card-header">
                <CardTitle className="ecom-card-title">
                  <span className="ecom-chart-title-icon" style={{ background: THEME.danger }}>
                    <XCircle className="w-4 h-4" />
                  </span>
                  NDR Reason Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ndrReasonDist} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} width={150} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {ndrReasonDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Filter */}
            <div className="ecom-filter-bar" style={{ marginTop: "1rem" }}>
              <div className="ecom-filter-group">
                <select className="ecom-filter-select" value={ndrFilterReason} onChange={(e) => setNdrFilterReason(e.target.value)}>
                  <option value="all">All NDR Reasons</option>
                  {Object.entries(NDR_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="ecom-filter-info">
                <span className="ecom-filter-count">{filteredNdr.length} NDR records</span>
              </div>
            </div>

            {/* NDR Table */}
            <div className="ecom-table-wrap">
              <table className="ecom-table">
                <thead>
                  <tr className="ecom-table-head">
                    <th>Order#</th>
                    <th>Channel</th>
                    <th>Customer</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>NDR Reason</th>
                    <th>Attempts</th>
                    <th>Partner</th>
                    <th>Value</th>
                    <th>AWB</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNdr.slice(0, 30).map((o, idx) => (
                    <tr key={o.id} className={`ecom-table-row ecom-stagger-${(idx % 10) + 1}`}>
                      <td className="ecom-cell-mono">{o.orderNumber}</td>
                      <td>
                        <span className="ecom-channel-badge" style={{ color: CHANNEL_CONFIG[o.channel].color, backgroundColor: `${CHANNEL_CONFIG[o.channel].color}20`, borderColor: CHANNEL_CONFIG[o.channel].color }}>
                          {CHANNEL_CONFIG[o.channel].logo}
                        </span>
                      </td>
                      <td className="ecom-cell-customer">{o.customerName}</td>
                      <td className="ecom-cell-city">{o.city}</td>
                      <td>
                        <span className="ecom-status-badge" style={{ color: STATUS_CONFIG[o.status].color, backgroundColor: STATUS_CONFIG[o.status].bg, borderColor: STATUS_CONFIG[o.status].color }}>
                          <span className="ecom-status-dot" style={{ backgroundColor: STATUS_CONFIG[o.status].color }} />
                          {STATUS_CONFIG[o.status].label}
                        </span>
                      </td>
                      <td>
                        {o.ndrReason ? (
                          <span className="ecom-ndr-reason-badge" style={{ color: NDR_CONFIG[o.ndrReason].color, backgroundColor: `${NDR_CONFIG[o.ndrReason].color}20` }}>
                            {NDR_CONFIG[o.ndrReason].label}
                          </span>
                        ) : o.rtoReason ? (
                          <span className="ecom-ndr-reason-badge ecom-ndr-rto">
                            {o.rtoReason}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="ecom-cell-center">
                        <span className={`ecom-ndr-attempts ${o.ndrAttempts >= 3 ? "ecom-ndr-attempts-critical" : ""}`}>{o.ndrAttempts}</span>
                      </td>
                      <td className="ecom-cell-partner-sm">{o.deliveryPartner}</td>
                      <td className="ecom-cell-value">{fmtCurrency(o.orderValue)}</td>
                      <td className="ecom-cell-awb-sm">{o.trackingNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Delivery Partners */}
        {activeTab === 4 && (
          <div className="ecom-partners-section">
            {/* Partner Performance Radar */}
            <Card className="hover-lift-sm ecom-chart-card ecom-stagger-1">
              <CardHeader className="ecom-card-header">
                <CardTitle className="ecom-card-title">
                  <span className="ecom-chart-title-icon" style={{ background: THEME.primary }}>
                    <Star className="w-4 h-4" />
                  </span>
                  Partner Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={data.deliveryPartners.map(dp => ({
                    name: dp.name.split(" ")[0],
                    successRate: dp.successRate,
                    rating: dp.rating * 20,
                    deliveries: Math.min(dp.totalDelivered / 30, 100),
                  }))}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Radar name="Success Rate" dataKey="successRate" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Radar name="Rating (x20)" dataKey="rating" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                    <Radar name="Daily Deliveries" dataKey="deliveries" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                    <Legend />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Partner Table */}
            <div className="ecom-table-wrap" style={{ marginTop: "1rem" }}>
              <table className="ecom-table">
                <thead>
                  <tr className="ecom-table-head">
                    <th>Partner</th>
                    <th>Type</th>
                    <th>Zone</th>
                    <th>Fleet</th>
                    <th>Active</th>
                    <th>Avg TAT</th>
                    <th>Success Rate</th>
                    <th>Rating</th>
                    <th>Total Delivered</th>
                    <th>RTO</th>
                    <th>RTO Rate</th>
                    <th>Warehouse</th>
                  </tr>
                </thead>
                <tbody>
                  {data.deliveryPartners.map((dp, idx) => {
                    const rtoRate = Math.round((dp.totalRto / dp.totalDelivered) * 10000) / 100;
                    return (
                      <tr key={dp.id} className={`ecom-table-row ecom-stagger-${(idx % 10) + 1}`}>
                        <td className="ecom-cell-partner-name">{dp.name}</td>
                        <td><span className="ecom-type-badge">{dp.type}</span></td>
                        <td className="ecom-cell-zone">{dp.zone}</td>
                        <td className="ecom-cell-center">{dp.fleetSize}</td>
                        <td className="ecom-cell-center">{dp.activeDeliveries}</td>
                        <td className="ecom-cell-center">{dp.avgDeliveryTime}h</td>
                        <td>
                          <div className="ecom-partner-bar-wrap">
                            <div className="ecom-partner-bar" style={{ width: `${dp.successRate}%`, backgroundColor: dp.successRate >= 95 ? "#10b981" : dp.successRate >= 85 ? "#f59e0b" : "#ef4444" }} />
                            <span className="ecom-partner-pct">{dp.successRate}%</span>
                          </div>
                        </td>
                        <td className="ecom-cell-center">
                          <span className="ecom-rating-badge">
                            <Star className="w-3 h-3" /> {dp.rating}
                          </span>
                        </td>
                        <td className="ecom-cell-center ecom-cell-green">{dp.totalDelivered}</td>
                        <td className="ecom-cell-center ecom-cell-red">{dp.totalRto}</td>
                        <td className="ecom-cell-center">
                          <span className={`ecom-rto-rate ${rtoRate > 8 ? "ecom-rto-high" : ""}`}>{rtoRate}%</span>
                        </td>
                        <td className="ecom-cell-warehouse-sm">{dp.warehouse}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {showDrawer && selectedOrder && (
        <>
          <div className="ecom-drawer-backdrop" onClick={() => setShowDrawer(false)} />
          <div className="ecom-drawer">
            <div className="ecom-drawer-header">
              <div>
                <h3 className="ecom-drawer-title">{selectedOrder.orderNumber}</h3>
                <p className="ecom-drawer-subtitle">
                  <span className="ecom-channel-badge" style={{ color: CHANNEL_CONFIG[selectedOrder.channel].color, backgroundColor: `${CHANNEL_CONFIG[selectedOrder.channel].color}20`, borderColor: CHANNEL_CONFIG[selectedOrder.channel].color }}>
                    {CHANNEL_CONFIG[selectedOrder.channel].logo} {CHANNEL_CONFIG[selectedOrder.channel].label}
                  </span>
                  <span className="ecom-drawer-channel-id">{selectedOrder.channelOrderId}</span>
                </p>
              </div>
              <button className="ecom-drawer-close" onClick={() => setShowDrawer(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="ecom-drawer-body">
              {/* Status Banner */}
              <div className="ecom-drawer-status-banner" style={{ borderColor: STATUS_CONFIG[selectedOrder.status].color, backgroundColor: STATUS_CONFIG[selectedOrder.status].bg }}>
                <span className="ecom-drawer-status-dot" style={{ backgroundColor: STATUS_CONFIG[selectedOrder.status].color }} />
                <span className="ecom-drawer-status-label" style={{ color: STATUS_CONFIG[selectedOrder.status].color }}>
                  {STATUS_CONFIG[selectedOrder.status].label}
                </span>
                {selectedOrder.slaBreached && (
                  <span className="ecom-drawer-sla-badge">SLA BREACHED</span>
                )}
                <span className="ecom-drawer-priority-badge" style={{ color: PRIORITY_CONFIG[selectedOrder.priority].color }}>
                  {PRIORITY_CONFIG[selectedOrder.priority].label}
                </span>
              </div>

              {/* Customer Info */}
              <div className="ecom-drawer-section">
                <h4 className="ecom-drawer-section-title">
                  <span className="ecom-chart-title-icon" style={{ background: THEME.secondary }}>
                    <Users className="w-4 h-4" />
                  </span>
                  Customer &amp; Address
                </h4>
                <div className="ecom-drawer-info-grid">
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Customer</span>
                    <span className="ecom-info-value">{selectedOrder.customerName}</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Phone</span>
                    <span className="ecom-info-value">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="ecom-drawer-info-item" style={{ gridColumn: "span 2" }}>
                    <span className="ecom-info-label">Address</span>
                    <span className="ecom-info-value">{selectedOrder.address}, {selectedOrder.city} - {selectedOrder.pincode}, {selectedOrder.state}</span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="ecom-drawer-section">
                <h4 className="ecom-drawer-section-title">
                  <span className="ecom-chart-title-icon" style={{ background: THEME.primary }}>
                    <Package className="w-4 h-4" />
                  </span>
                  Order Details
                </h4>
                <div className="ecom-drawer-info-grid">
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Items</span>
                    <span className="ecom-info-value">{selectedOrder.items} items, {selectedOrder.totalWeight}g</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Order Value</span>
                    <span className="ecom-info-value ecom-info-currency">{fmtCurrency(selectedOrder.orderValue)}</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Payment</span>
                    <span className="ecom-info-value">{selectedOrder.paymentMethod.toUpperCase()} — <span className={`ecom-payment-status ecom-ps-${selectedOrder.paymentStatus}`}>{selectedOrder.paymentStatus}</span></span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Avg Value/Item</span>
                    <span className="ecom-info-value">{fmtCurrency(Math.round(selectedOrder.orderValue / selectedOrder.items))}</span>
                  </div>
                </div>
              </div>

              {/* Logistics */}
              <div className="ecom-drawer-section">
                <h4 className="ecom-drawer-section-title">
                  <span className="ecom-chart-title-icon" style={{ background: THEME.accent }}>
                    <Truck className="w-4 h-4" />
                  </span>
                  Logistics &amp; SLA
                </h4>
                <div className="ecom-drawer-info-grid">
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Warehouse</span>
                    <span className="ecom-info-value">{selectedOrder.warehouse}</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Delivery Partner</span>
                    <span className="ecom-info-value">{selectedOrder.deliveryPartner}</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">AWB / Tracking</span>
                    <span className="ecom-info-value ecom-info-mono">{selectedOrder.trackingNumber}</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Picker</span>
                    <span className="ecom-info-value">{selectedOrder.assignedPicker}</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Packer</span>
                    <span className="ecom-info-value">{selectedOrder.assignedPacker}</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Order Date</span>
                    <span className="ecom-info-value">{fmtDateTime(selectedOrder.orderDate)}</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">Promised By</span>
                    <span className="ecom-info-value">{fmtDateTime(selectedOrder.promisedDate)}</span>
                  </div>
                  <div className="ecom-drawer-info-item">
                    <span className="ecom-info-label">SLA</span>
                    <span className={`ecom-info-value ${selectedOrder.slaBreached ? "ecom-info-breached" : ""}`}>{selectedOrder.slaHours}h — {selectedOrder.slaBreached ? "BREACHED" : `${Math.floor(selectedOrder.slaRemaining)}h remaining`}</span>
                  </div>
                  {selectedOrder.shippedDate && (
                    <div className="ecom-drawer-info-item">
                      <span className="ecom-info-label">Shipped</span>
                      <span className="ecom-info-value">{fmtDateTime(selectedOrder.shippedDate)}</span>
                    </div>
                  )}
                  {selectedOrder.deliveredDate && (
                    <div className="ecom-drawer-info-item">
                      <span className="ecom-info-label">Delivered</span>
                      <span className="ecom-info-value">{fmtDateTime(selectedOrder.deliveredDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* NDR/RTO Info */}
              {selectedOrder.ndrReason && (
                <div className="ecom-drawer-section">
                  <h4 className="ecom-drawer-section-title">
                    <span className="ecom-chart-title-icon" style={{ background: THEME.danger }}>
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    NDR Details
                  </h4>
                  <div className="ecom-drawer-ndr-box">
                    <div className="ecom-ndr-box-row">
                      <span className="ecom-info-label">Reason</span>
                      <span className="ecom-ndr-reason-text" style={{ color: NDR_CONFIG[selectedOrder.ndrReason].color }}>
                        {NDR_CONFIG[selectedOrder.ndrReason].label}
                      </span>
                    </div>
                    <div className="ecom-ndr-box-row">
                      <span className="ecom-info-label">Delivery Attempts</span>
                      <span className={`ecom-info-value ${selectedOrder.ndrAttempts >= 3 ? "ecom-info-breached" : ""}`}>{selectedOrder.ndrAttempts}</span>
                    </div>
                  </div>
                </div>
              )}
              {selectedOrder.rtoReason && (
                <div className="ecom-drawer-section">
                  <h4 className="ecom-drawer-section-title">
                    <span className="ecom-chart-title-icon" style={{ background: "#f97316" }}>
                      <ArrowRightLeft className="w-4 h-4" />
                    </span>
                    RTO Reason
                  </h4>
                  <div className="ecom-drawer-rto-box">
                    <p className="ecom-rto-text">{selectedOrder.rtoReason}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="ecom-drawer-section">
                <h4 className="ecom-drawer-section-title">
                  <span className="ecom-chart-title-icon" style={{ background: "#6b7280" }}>
                    <FileText className="w-4 h-4" />
                  </span>
                  Notes
                </h4>
                <div className="ecom-drawer-notes-box">
                  <p className="ecom-notes-text">{selectedOrder.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
