"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  Globe, ArrowUpRight, ArrowDownRight,
  CheckCircle2, XCircle, AlertTriangle, Clock,
  BarChart3, Eye, Search, IndianRupee, Calendar,
  TrendingDown, FileText, Users, RefreshCw,
  Package, Truck, Star, Store, Link2,
  ShoppingCart, TrendingUp, Database, ArrowRightLeft,
  Activity, Filter, Zap, ExternalLink,
  ChevronRight, CircleDot, Radio, Boxes,
  Banknote, CreditCard, Settings,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
interface Channel {
  id: string;
  name: string;
  platform: string;
  marketplace: "amazon" | "flipkart" | "myntra" | "meesho" | "shopify" | "ajio" | "nykaa" | "jiomart" | "blinkit" | "swiggy_instamart";
  status: "active" | "inactive" | "suspended" | "syncing";
  connectedAt: string;
  lastSync: string;
  apiKey: string;
  webhookUrl: string;
  sellerId: string;
  city: string;
  monthlyOrders: number;
  monthlyRevenue: number;
  returnRate: number;
  avgOrderValue: number;
  fulfillment: "seller_fulfilled" | "platform_fulfilled" | "hybrid";
  syncInterval: number;
  autoAcceptOrders: boolean;
  inventorySync: boolean;
  priceSync: boolean;
  orderRouting: boolean;
  mappedWarehouses: number;
  listingCount: number;
  activeListings: number;
  rating: number;
  slaCompliance: number;
}

interface ChannelOrder {
  id: string;
  orderId: string;
  channel: string;
  marketplace: string;
  customer: string;
  city: string;
  sku: string;
  product: string;
  quantity: number;
  orderValue: number;
  commission: number;
  netPayout: number;
  status: "pending" | "accepted" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | "refunded";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  fulfillment: "seller_fulfilled" | "platform_fulfilled";
  orderedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  warehouse: string;
  priority: "standard" | "express" | "same_day";
  weight: number;
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
  const rand = seededRandom(160160);

  const cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur", "Lucknow", "Ahmedabad"];
  const warehouses = ["WH-MUM-01", "WH-DEL-02", "WH-BLR-01", "WH-CHN-01", "WH-HYD-01", "WH-PUN-01"];
  const customers = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sunita Devi", "Rajesh Gupta", "Neha Singh", "Vikram Joshi", "Kavita Reddy", "Manish Agarwal", "Deepa Nair", "Suresh Menon", "Anita Desai", "Prakash Iyer", "Ritu Malhotra", "Arjun Verma", "Pooja Mehta", "Sanjay Rao", "Lakshmi Iyer", "Ravi Kapoor", "Sneha Pillai"];
  const products = ["Organic Basmati Rice 5kg", "Cotton Casual Shirt", "Running Shoes Pro", "Bluetooth Speaker", "Ceramic Dinner Set", "Face Wash Gel", "Yoga Mat Premium", "LED Desk Lamp", "Stainless Steel Bottle", "Silk Saree", "Protein Powder 1kg", "Wireless Earbuds", "Leather Wallet", "Green Tea 100 bags", "Power Bank 20000mAh", "Smart Watch", "Bamboo Cutting Board", "Vitamin C Serum", "Kids School Bag", "Memory Foam Pillow"];
  const skus = ["SKU-" + String(1000 + Math.floor(rand() * 9000)), "SKU-" + String(1000 + Math.floor(rand() * 9000)), "SKU-" + String(1000 + Math.floor(rand() * 9000)), "SKU-" + String(1000 + Math.floor(rand() * 9000)), "SKU-" + String(1000 + Math.floor(rand() * 9000))];

  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const randInt = (min: number, max: number) => Math.floor(min + rand() * (max - min));

  const marketplaceConfigs: { name: string; key: Channel["marketplace"]; color: string; commission: [number, number]; icon: string }[] = [
    { name: "Amazon", key: "amazon", color: "#ff9900", commission: [8, 18], icon: "🟠" },
    { name: "Flipkart", key: "flipkart", color: "#2874f0", commission: [10, 22], icon: "🔵" },
    { name: "Myntra", key: "myntra", color: "#ff3f6c", commission: [15, 30], icon: "🔴" },
    { name: "Meesho", key: "meesho", color: "#570a57", commission: [0, 15], icon: "🟣" },
    { name: "Shopify", key: "shopify", color: "#96bf48", commission: [0, 3], icon: "🟢" },
    { name: "Ajio", key: "ajio", color: "#3b3b3b", commission: [12, 25], icon: "⬛" },
    { name: "Nykaa", key: "nykaa", color: "#faa1e1", commission: [15, 28], icon: "🩷" },
    { name: "JioMart", key: "jiomart", color: "#0078ad", commission: [5, 12], icon: "🔷" },
    { name: "Blinkit", key: "blinkit", color: "#f8e71c", commission: [18, 30], icon: "🟡" },
    { name: "Swiggy Instamart", key: "swiggy_instamart", color: "#fc8019", commission: [20, 32], icon: "🟧" },
  ];

  const statuses: ChannelOrder["status"][] = ["pending", "accepted", "processing", "shipped", "delivered", "cancelled", "returned", "refunded"];
  const paymentStatuses: ChannelOrder["paymentStatus"][] = ["paid", "pending", "failed", "refunded"];
  const fulfillments: ChannelOrder["fulfillment"][] = ["seller_fulfilled", "platform_fulfilled"];
  const priorities: ChannelOrder["priority"][] = ["standard", "express", "same_day"];
  const channelStatuses: Channel["status"][] = ["active", "inactive", "suspended", "syncing"];

  // Generate 12 channel connections
  const channels: Channel[] = Array.from({ length: 12 }, (_, i) => {
    const mc = marketplaceConfigs[i % marketplaceConfigs.length];
    const isQCommerce = ["blinkit", "swiggy_instamart"].includes(mc.key);
    return {
      id: `CH-${String(i + 1).padStart(3, "0")}`,
      name: `${mc.name} ${isQCommerce ? "Bengaluru" : cities[i % cities.length]}`,
      platform: mc.name,
      marketplace: mc.key,
      status: i < 10 ? pick(["active", "active", "active", "syncing"]) : pick(["inactive", "suspended"]),
      connectedAt: `2025-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
      lastSync: `2026-07-${String(randInt(1, 28)).padStart(2, "0")} ${String(randInt(0, 23)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")}`,
      apiKey: `key_${mc.key.slice(0, 4)}_${Math.random().toString(36).slice(2, 10)}`,
      webhookUrl: `https://hooks.autoflow.in/${mc.key}/orders`,
      sellerId: `SELL-${randInt(10000, 99999)}`,
      city: isQCommerce ? "Bengaluru" : cities[i % cities.length],
      monthlyOrders: randInt(isQCommerce ? 300 : 200, isQCommerce ? 2000 : 5000),
      monthlyRevenue: randInt(isQCommerce ? 50000 : 300000, isQCommerce ? 800000 : 5000000),
      returnRate: Math.round((3 + rand() * 18) * 10) / 10,
      avgOrderValue: Math.round((300 + rand() * 4700)),
      fulfillment: pick(["seller_fulfilled", "platform_fulfilled", "hybrid"] as Channel["fulfillment"][]),
      syncInterval: isQCommerce ? 5 : randInt(10, 60),
      autoAcceptOrders: rand() > 0.3,
      inventorySync: rand() > 0.15,
      priceSync: rand() > 0.5,
      orderRouting: rand() > 0.25,
      mappedWarehouses: randInt(1, 4),
      listingCount: randInt(50, 800),
      activeListings: randInt(40, 750),
      rating: Math.round((3.2 + rand() * 1.8) * 10) / 10,
      slaCompliance: Math.round((78 + rand() * 20) * 10) / 10,
    };
  });

  // Generate 400 channel orders
  const orders: ChannelOrder[] = Array.from({ length: 400 }, (_, i) => {
    const channel = pick(channels);
    const mc = marketplaceConfigs.find(m => m.key === channel.marketplace) || marketplaceConfigs[0];
    const status = i < 200 ? pick(statuses.slice(3)) : pick(statuses);
    const isDelivered = status === "delivered";
    const isReturned = status === "returned" || status === "refunded";
    const commissionRate = (mc.commission[0] + rand() * (mc.commission[1] - mc.commission[0])) / 100;
    const orderValue = randInt(200, 12000);
    const commission = Math.round(orderValue * commissionRate);
    const d = new Date(2026, 6, 28 - randInt(0, 30));
    d.setHours(randInt(7, 22), randInt(0, 59));

    return {
      id: `CHO-${String(i + 1).padStart(4, "0")}`,
      orderId: `ORD-${String(20000 + i).padStart(6, "0")}`,
      channel: channel.name,
      marketplace: mc.name,
      customer: pick(customers),
      city: pick(cities),
      sku: pick(skus),
      product: pick(products),
      quantity: randInt(1, 5),
      orderValue,
      commission,
      netPayout: orderValue - commission,
      status,
      paymentStatus: isReturned ? "refunded" : isDelivered ? "paid" : pick(paymentStatuses),
      fulfillment: pick(fulfillments),
      orderedAt: d.toISOString().slice(0, 16).replace("T", " "),
      shippedAt: isDelivered ? new Date(d.getTime() + randInt(4, 48) * 3600000).toISOString().slice(0, 16).replace("T", " ") : undefined,
      deliveredAt: isDelivered ? new Date(d.getTime() + randInt(24, 120) * 3600000).toISOString().slice(0, 16).replace("T", " ") : undefined,
      warehouse: pick(warehouses),
      priority: pick(priorities),
      weight: Math.round((200 + rand() * 4800)) / 1000,
    };
  });

  // Monthly trends
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const monthlyTrends = months.map((m, idx) => ({
    month: m,
    totalOrders: 3200 + idx * 180 + randInt(-200, 200),
    amazon: randInt(800, 1400),
    flipkart: randInt(600, 1100),
    myntra: randInt(300, 700),
    meesho: randInt(200, 500),
    shopify: randInt(100, 300),
    others: randInt(200, 500),
    totalRevenue: randInt(15, 45) * 100000,
    avgCommission: Math.round((12 + rand() * 8) * 10) / 10,
    syncErrors: randInt(2, 25),
    returnRate: Math.round((8 + rand() * 10) * 10) / 10,
  }));

  // Marketplace breakdown
  const marketplaceBreakdown = marketplaceConfigs.map(mc => {
    const ch = channels.filter(c => c.marketplace === mc.key);
    const ords = orders.filter(o => o.marketplace === mc.name);
    return {
      name: mc.name,
      color: mc.color,
      channels: ch.length,
      orders: ords.length || randInt(30, 200),
      revenue: ords.reduce((s, o) => s + o.orderValue, 0) || randInt(200000, 3000000),
      commission: ords.reduce((s, o) => s + o.commission, 0) || randInt(20000, 500000),
      avgOrderValue: ords.length ? Math.round(ords.reduce((s, o) => s + o.orderValue, 0) / ords.length) : randInt(400, 3000),
      returnRate: Math.round((5 + rand() * 18) * 10) / 10,
      rating: Math.round((3.3 + rand() * 1.5) * 10) / 10,
    };
  });

  // Channel performance radar
  const channelRadar = channels.filter(c => c.status === "active").slice(0, 6).map(c => ({
    name: c.platform,
    volume: Math.round(c.monthlyOrders / 50),
    revenue: Math.round(c.monthlyRevenue / 50000),
    slaCompliance: c.slaCompliance,
    rating: Math.round(c.rating * 20),
    sync: Math.round(100 - c.syncInterval),
    automation: (c.autoAcceptOrders ? 30 : 0) + (c.inventorySync ? 30 : 0) + (c.priceSync ? 20 : 0) + (c.orderRouting ? 20 : 0),
  }));

  // Warehouse allocation
  const warehouseAllocation = warehouses.map(wh => ({
    warehouse: wh,
    amazon: randInt(200, 600),
    flipkart: randInt(150, 500),
    myntra: randInt(80, 300),
    others: randInt(100, 400),
    total: randInt(500, 1800),
    utilization: Math.round((60 + rand() * 35) * 10) / 10,
  }));

  // Sync health
  const syncHealth = channels.map(c => ({
    channel: c.name,
    lastSync: c.lastSync,
    status: c.status,
    syncInterval: c.syncInterval,
    errors24h: c.status === "syncing" ? 0 : randInt(0, 15),
    pendingOrders: randInt(0, 30),
    inventoryMismatch: randInt(0, 8),
    autoAccept: c.autoAcceptOrders,
  }));

  return {
    orders,
    channels,
    monthlyTrends,
    marketplaceBreakdown,
    channelRadar,
    warehouseAllocation,
    syncHealth,
    marketplaceConfigs,
    months,
    cities,
    statuses,
    paymentStatuses,
    fulfillments,
    priorities,
    channelStatuses,
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
  primary: "#6366f1",
  primaryLight: "#e0e7ff",
  secondary: "#f59e0b",
  secondaryLight: "#fef3c7",
  danger: "#ef4444",
  dangerLight: "#fee2e2",
  success: "#10b981",
  successLight: "#d1fae5",
  info: "#3b82f6",
  infoLight: "#dbeafe",
  bg: "#f5f3ff",
  surface: "#ffffff",
  text: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#f59e0b", bg: "#fef3c7" },
  accepted: { label: "Accepted", color: "#3b82f6", bg: "#dbeafe" },
  processing: { label: "Processing", color: "#6366f1", bg: "#e0e7ff" },
  shipped: { label: "Shipped", color: "#8b5cf6", bg: "#ede9fe" },
  delivered: { label: "Delivered", color: "#10b981", bg: "#d1fae5" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#fee2e2" },
  returned: { label: "Returned", color: "#f97316", bg: "#ffedd5" },
  refunded: { label: "Refunded", color: "#64748b", bg: "#f1f5f9" },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: "Paid", color: "#10b981", bg: "#d1fae5" },
  pending: { label: "Pending", color: "#f59e0b", bg: "#fef3c7" },
  failed: { label: "Failed", color: "#ef4444", bg: "#fee2e2" },
  refunded: { label: "Refunded", color: "#64748b", bg: "#f1f5f9" },
};

const CHANNEL_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#10b981", bg: "#d1fae5" },
  inactive: { label: "Inactive", color: "#94a3b8", bg: "#f1f5f9" },
  suspended: { label: "Suspended", color: "#ef4444", bg: "#fee2e2" },
  syncing: { label: "Syncing", color: "#3b82f6", bg: "#dbeafe" },
};

const FULFILLMENT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  seller_fulfilled: { label: "Seller Fulfilled", color: "#059669", bg: "#d1fae5" },
  platform_fulfilled: { label: "Platform Fulfilled", color: "#6366f1", bg: "#e0e7ff" },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  standard: { label: "Standard", color: "#64748b", bg: "#f1f5f9" },
  express: { label: "Express", color: "#f59e0b", bg: "#fef3c7" },
  same_day: { label: "Same Day", color: "#ef4444", bg: "#fee2e2" },
};

const MARKETPLACE_COLORS: Record<string, string> = {
  amazon: "#ff9900",
  flipkart: "#2874f0",
  myntra: "#ff3f6c",
  meesho: "#570a57",
  shopify: "#96bf48",
  ajio: "#3b3b3b",
  nykaa: "#faa1e1",
  jiomart: "#0078ad",
  blinkit: "#f8e71c",
  swiggy_instamart: "#fc8019",
};

// ============================================================================
// Component
// ============================================================================
export default function MultiChannelHubView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<ChannelOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [channelView, setChannelView] = useState<"cards" | "table">("cards");
  const [channelStatusFilter, setChannelStatusFilter] = useState<string>("all");

  const tabs = ["Dashboard", "Order Pipeline", "Channel Management", "Marketplace Analytics", "Sync & Inventory"];

  const metrics = useMemo(() => {
    const total = data.orders.length;
    const delivered = data.orders.filter(o => o.status === "delivered").length;
    const pending = data.orders.filter(o => o.status === "pending").length;
    const returned = data.orders.filter(o => ["returned", "refunded"].includes(o.status)).length;
    const totalRevenue = data.orders.reduce((s, o) => s + o.orderValue, 0);
    const totalCommission = data.orders.reduce((s, o) => s + o.commission, 0);
    const netPayout = totalRevenue - totalCommission;
    const activeChannels = data.channels.filter(c => c.status === "active" || c.status === "syncing").length;
    const avgReturnRate = data.orders.filter(o => ["returned", "cancelled"].includes(o.status)).length / Math.max(total, 1) * 100;

    return { total, delivered, pending, returned, totalRevenue, totalCommission, netPayout, activeChannels, avgReturnRate };
  }, [data]);

  const filteredOrders = useMemo(() => {
    return data.orders.filter(o => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false;
      if (fulfillmentFilter !== "all" && o.fulfillment !== fulfillmentFilter) return false;
      if (marketplaceFilter !== "all" && o.marketplace !== marketplaceFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return o.id.toLowerCase().includes(q) || o.orderId.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.channel.toLowerCase().includes(q) || o.sku.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data, statusFilter, paymentFilter, fulfillmentFilter, marketplaceFilter, searchQuery]);

  const filteredChannels = useMemo(() => {
    return data.channels.filter(c => {
      if (channelStatusFilter !== "all" && c.status !== channelStatusFilter) return false;
      return true;
    });
  }, [data, channelStatusFilter]);

  const marketplacePieData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.orders.forEach(o => { counts[o.marketplace] = (counts[o.marketplace] || 0) + 1; });
    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      value,
      color: MARKETPLACE_COLORS[key] || "#94a3b8",
    }));
  }, [data]);

  const openDrawer = useCallback((o: ChannelOrder) => {
    setSelectedOrder(o);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  }, []);

  // ===== TAB 1: Dashboard =====
  const renderDashboard = () => (
    <div className="mci-tab-content">
      <div className="mci-kpi-grid">
        {[
          { label: "Total Orders", value: metrics.total.toLocaleString("en-IN"), change: "+11.2%", up: true, icon: ShoppingCart, color: THEME.primary },
          { label: "Pending Orders", value: metrics.pending.toLocaleString("en-IN"), change: "-5.8%", up: false, icon: Clock, color: THEME.secondary },
          { label: "Delivered", value: metrics.delivered.toLocaleString("en-IN"), change: "+9.4%", up: true, icon: CheckCircle2, color: THEME.success },
          { label: "Returned / Refunded", value: metrics.returned.toLocaleString("en-IN"), change: "-2.1%", up: false, icon: XCircle, color: THEME.danger },
          { label: "Total Revenue", value: formatINR(metrics.totalRevenue), change: "+14.6%", up: true, icon: IndianRupee, color: "#8b5cf6" },
          { label: "Active Channels", value: `${metrics.activeChannels} / ${data.channels.length}`, change: "+1", up: true, icon: Globe, color: "#3b82f6" },
        ].map((kpi, i) => (
          <div key={i} className="mci-kpi-card" style={{ borderTopColor: kpi.color }}>
            <div className="mci-kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
              <kpi.icon size={20} />
            </div>
            <div className="mci-kpi-info">
              <span className="mci-kpi-label">{kpi.label}</span>
              <span className="mci-kpi-value">{kpi.value}</span>
              <span className={`mci-kpi-change ${kpi.up ? "mci-kpi-up" : "mci-kpi-down"}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mci-charts-row">
        <div className="mci-chart-card">
          <div className="mci-chart-header">
            <h3 className="mci-chart-title">Monthly Order Volume by Channel</h3>
            <span className="mci-chart-subtitle">Stacked — Amazon, Flipkart, Myntra, Meesho, Shopify, Others</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="left" dataKey="amazon" stackId="a" fill="#ff9900" name="Amazon" />
              <Bar yAxisId="left" dataKey="flipkart" stackId="a" fill="#2874f0" name="Flipkart" />
              <Bar yAxisId="left" dataKey="myntra" stackId="a" fill="#ff3f6c" name="Myntra" />
              <Bar yAxisId="left" dataKey="meesho" stackId="a" fill="#570a57" name="Meesho" />
              <Bar yAxisId="left" dataKey="shopify" stackId="a" fill="#96bf48" name="Shopify" />
              <Bar yAxisId="left" dataKey="others" stackId="a" fill="#94a3b8" name="Others" />
              <Line yAxisId="right" type="monotone" dataKey="returnRate" stroke="#ef4444" strokeWidth={2} dot={false} name="Return %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mci-chart-card">
          <div className="mci-chart-header">
            <h3 className="mci-chart-title">Marketplace Order Distribution</h3>
            <span className="mci-chart-subtitle">Orders by platform</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={marketplacePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {marketplacePieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mci-charts-row">
        <div className="mci-chart-card">
          <div className="mci-chart-header">
            <h3 className="mci-chart-title">Revenue & Net Payout Trend</h3>
            <span className="mci-chart-subtitle">Monthly (₹ Lakhs)</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="totalRevenue" fill="#e0e7ff" stroke="#6366f1" strokeWidth={2} name="Revenue (₹)" />
              <Line type="monotone" dataKey="avgCommission" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Avg Commission %" />
              <Line type="monotone" dataKey="syncErrors" stroke="#ef4444" strokeWidth={2} dot={false} name="Sync Errors" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mci-chart-card">
          <div className="mci-chart-header">
            <h3 className="mci-chart-title">Channel Performance Radar</h3>
            <span className="mci-chart-subtitle">Multi-dimensional comparison</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={data.channelRadar}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Radar name="SLA Compliance" dataKey="slaCompliance" stroke="#10b981" fill="#d1fae5" fillOpacity={0.5} />
              <Radar name="Rating" dataKey="rating" stroke="#6366f1" fill="#e0e7ff" fillOpacity={0.5} />
              <Radar name="Automation" dataKey="automation" stroke="#f59e0b" fill="#fef3c7" fillOpacity={0.5} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mci-alerts-section">
        <h3 className="mci-section-title">Integration Alerts</h3>
        <div className="mci-alerts-grid">
          {[
            { title: "API Rate Limit", msg: "Amazon Seller Central API rate limit approaching (85% quota)", severity: "warning" },
            { title: "Sync Failure", msg: "Flipkart order sync failed 3 times in last hour", severity: "critical" },
            { title: "Inventory Mismatch", msg: "Meesho listing shows 150 units but WH has 45 units", severity: "critical" },
            { title: "Payment Delay", msg: "₹4.2L Myntra payout pending 7+ days", severity: "warning" },
            { title: "SLA Breach Risk", msg: "12 Shopify orders approaching shipment cutoff", severity: "warning" },
            { title: "New Channel Ready", msg: "JioMart integration setup complete, pending go-live", severity: "info" },
          ].map((alert, i) => (
            <div key={i} className={`mci-alert-card mci-alert-${alert.severity}`}>
              <AlertTriangle size={16} className="mci-alert-icon" />
              <div>
                <span className="mci-alert-title">{alert.title}</span>
                <span className="mci-alert-msg">{alert.msg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== TAB 2: Order Pipeline =====
  const renderOrderPipeline = () => (
    <div className="mci-tab-content">
      <div className="mci-section-header">
        <h3 className="mci-section-title">Order Pipeline ({filteredOrders.length})</h3>
        <div className="mci-search-box">
          <Search size={16} className="mci-search-icon" />
          <input
            type="text"
            placeholder="Search by ID, Order, Customer, Channel, SKU, Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mci-search-input"
          />
        </div>
      </div>

      <div className="mci-filter-row">
        <div className="mci-filter-pills">
          <button className={`mci-filter-pill ${statusFilter === "all" ? "mci-filter-pill-active" : ""}`} onClick={() => setStatusFilter("all")}>All Status</button>
          {data.statuses.map(s => (
            <button
              key={s}
              className={`mci-filter-pill ${statusFilter === s ? "mci-filter-pill-active" : ""}`}
              onClick={() => setStatusFilter(s)}
              style={statusFilter === s ? { backgroundColor: STATUS_CONFIG[s]?.color || "#6366f1", color: "#fff", borderColor: STATUS_CONFIG[s]?.color || "#6366f1" } : {}}
            >
              {STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
        </div>
      </div>
      <div className="mci-filter-row">
        <div className="mci-filter-pills">
          <button className={`mci-filter-pill ${paymentFilter === "all" ? "mci-filter-pill-active" : ""}`} onClick={() => setPaymentFilter("all")}>All Payment</button>
          {data.paymentStatuses.map(p => (
            <button key={p} className={`mci-filter-pill ${paymentFilter === p ? "mci-filter-pill-active" : ""}`} onClick={() => setPaymentFilter(p)}
              style={paymentFilter === p ? { backgroundColor: PAYMENT_STATUS_CONFIG[p]?.color || "#6366f1", color: "#fff", borderColor: PAYMENT_STATUS_CONFIG[p]?.color || "#6366f1" } : {}}>
              {PAYMENT_STATUS_CONFIG[p]?.label || p}
            </button>
          ))}
          <span className="mci-filter-separator">|</span>
          <button className={`mci-filter-pill ${fulfillmentFilter === "all" ? "mci-filter-pill-active" : ""}`} onClick={() => setFulfillmentFilter("all")}>All Fulfillment</button>
          {data.fulfillments.map(f => (
            <button key={f} className={`mci-filter-pill ${fulfillmentFilter === f ? "mci-filter-pill-active" : ""}`} onClick={() => setFulfillmentFilter(f)}
              style={fulfillmentFilter === f ? { backgroundColor: FULFILLMENT_CONFIG[f]?.color || "#6366f1", color: "#fff", borderColor: FULFILLMENT_CONFIG[f]?.color || "#6366f1" } : {}}>
              {FULFILLMENT_CONFIG[f]?.label || f}
            </button>
          ))}
        </div>
        <div className="mci-city-select">
          <select value={marketplaceFilter} onChange={(e) => setMarketplaceFilter(e.target.value)} className="mci-select">
            <option value="all">All Marketplaces</option>
            {data.marketplaceConfigs.map(mc => <option key={mc.key} value={mc.key}>{mc.name}</option>)}
          </select>
        </div>
      </div>

      <div className="mci-table-container">
        <table className="mci-table">
          <thead>
            <tr>
              <th>ID / Order</th>
              <th>Channel</th>
              <th>Customer</th>
              <th>Product / SKU</th>
              <th>Order Value</th>
              <th>Commission</th>
              <th>Net Payout</th>
              <th>Payment</th>
              <th>Fulfillment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.slice(0, 35).map((o, i) => (
              <tr key={o.id} className="mci-table-row">
                <td>
                  <div className="mci-cell-primary">
                    <span className="mci-cell-id">{o.id}</span>
                    <span className="mci-cell-sub">{o.orderId}</span>
                  </div>
                </td>
                <td>
                  <div className="mci-channel-cell">
                    <span className="mci-channel-dot" style={{ backgroundColor: MARKETPLACE_COLORS[o.marketplace.toLowerCase()] || "#94a3b8" }} />
                    <span className="mci-cell-name">{o.channel}</span>
                  </div>
                </td>
                <td>
                  <div className="mci-cell-primary">
                    <span className="mci-cell-name">{o.customer}</span>
                    <span className="mci-cell-sub">{o.city}</span>
                  </div>
                </td>
                <td>
                  <div className="mci-cell-primary">
                    <span className="mci-cell-name">{o.product}</span>
                    <span className="mci-cell-sub">{o.sku} × {o.quantity}</span>
                  </div>
                </td>
                <td className="mci-cell-amount">{formatINR(o.orderValue)}</td>
                <td className="mci-cell-amount" style={{ color: "#ef4444" }}>-{formatINR(o.commission)}</td>
                <td className="mci-cell-amount" style={{ fontWeight: 600 }}>{formatINR(o.netPayout)}</td>
                <td>
                  <span className="mci-badge" style={{ color: PAYMENT_STATUS_CONFIG[o.paymentStatus].color, backgroundColor: PAYMENT_STATUS_CONFIG[o.paymentStatus].bg }}>
                    {PAYMENT_STATUS_CONFIG[o.paymentStatus].label}
                  </span>
                </td>
                <td>
                  <span className="mci-badge" style={{ color: FULFILLMENT_CONFIG[o.fulfillment].color, backgroundColor: FULFILLMENT_CONFIG[o.fulfillment].bg }}>
                    {FULFILLMENT_CONFIG[o.fulfillment].label}
                  </span>
                </td>
                <td>
                  <span className="mci-badge" style={{ color: STATUS_CONFIG[o.status].color, backgroundColor: STATUS_CONFIG[o.status].bg }}>
                    {STATUS_CONFIG[o.status].label}
                  </span>
                </td>
                <td>
                  <button className="mci-action-btn" onClick={() => openDrawer(o)}>
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mci-table-footer">
          Showing {Math.min(35, filteredOrders.length)} of {filteredOrders.length} orders
        </div>
      </div>
    </div>
  );

  // ===== TAB 3: Channel Management =====
  const renderChannels = () => (
    <div className="mci-tab-content">
      <div className="mci-ch-header">
        <div className="mci-filter-row">
          <div className="mci-filter-pills">
            <button className={`mci-filter-pill ${channelStatusFilter === "all" ? "mci-filter-pill-active" : ""}`} onClick={() => setChannelStatusFilter("all")}>All Status</button>
            {data.channelStatuses.map(s => (
              <button key={s} className={`mci-filter-pill ${channelStatusFilter === s ? "mci-filter-pill-active" : ""}`} onClick={() => setChannelStatusFilter(s)}
                style={channelStatusFilter === s ? { backgroundColor: CHANNEL_STATUS_CONFIG[s]?.color || "#6366f1", color: "#fff", borderColor: CHANNEL_STATUS_CONFIG[s]?.color || "#6366f1" } : {}}>
                {CHANNEL_STATUS_CONFIG[s]?.label || s}
              </button>
            ))}
          </div>
          <div className="mci-view-toggle">
            <button className={`mci-view-btn ${channelView === "cards" ? "mci-view-btn-active" : ""}`} onClick={() => setChannelView("cards")}>
              <Store size={14} /> Cards
            </button>
            <button className={`mci-view-btn ${channelView === "table" ? "mci-view-btn-active" : ""}`} onClick={() => setChannelView("table")}>
              <Activity size={14} /> Table
            </button>
          </div>
        </div>
      </div>

      {channelView === "cards" ? (
        <div className="mci-channel-grid">
          {filteredChannels.map(ch => {
            const mpColor = MARKETPLACE_COLORS[ch.marketplace] || "#94a3b8";
            return (
              <div key={ch.id} className="mci-channel-card">
                <div className="mci-channel-card-header" style={{ borderLeftColor: mpColor }}>
                  <div className="mci-channel-card-logo" style={{ backgroundColor: `${mpColor}20`, color: mpColor }}>
                    <Globe size={20} />
                  </div>
                  <div className="mci-channel-card-meta">
                    <span className="mci-channel-card-name">{ch.name}</span>
                    <span className="mci-channel-card-id">{ch.id} · {ch.sellerId}</span>
                  </div>
                  <span className="mci-badge" style={{ color: CHANNEL_STATUS_CONFIG[ch.status].color, backgroundColor: CHANNEL_STATUS_CONFIG[ch.status].bg }}>
                    {CHANNEL_STATUS_CONFIG[ch.status].label}
                  </span>
                </div>
                <div className="mci-channel-card-stats">
                  <div className="mci-channel-stat">
                    <span className="mci-channel-stat-value">{ch.monthlyOrders.toLocaleString()}</span>
                    <span className="mci-channel-stat-label">Monthly Orders</span>
                  </div>
                  <div className="mci-channel-stat">
                    <span className="mci-channel-stat-value">{formatINR(ch.monthlyRevenue)}</span>
                    <span className="mci-channel-stat-label">Revenue</span>
                  </div>
                  <div className="mci-channel-stat">
                    <span className="mci-channel-stat-value">{ch.returnRate}%</span>
                    <span className="mci-channel-stat-label">Return Rate</span>
                  </div>
                  <div className="mci-channel-stat">
                    <span className="mci-channel-stat-value">{formatINR(ch.avgOrderValue)}</span>
                    <span className="mci-channel-stat-label">Avg Order</span>
                  </div>
                </div>
                <div className="mci-channel-card-toggles">
                  <span className={`mci-toggle ${ch.autoAcceptOrders ? "mci-toggle-on" : ""}`}>
                    {ch.autoAcceptOrders ? "✓" : "○"} Auto Accept
                  </span>
                  <span className={`mci-toggle ${ch.inventorySync ? "mci-toggle-on" : ""}`}>
                    {ch.inventorySync ? "✓" : "○"} Inv Sync
                  </span>
                  <span className={`mci-toggle ${ch.priceSync ? "mci-toggle-on" : ""}`}>
                    {ch.priceSync ? "✓" : "○"} Price Sync
                  </span>
                  <span className={`mci-toggle ${ch.orderRouting ? "mci-toggle-on" : ""}`}>
                    {ch.orderRouting ? "✓" : "○"} Routing
                  </span>
                </div>
                <div className="mci-channel-card-footer">
                  <span className="mci-channel-footer-item">
                    <Star size={11} fill="#f59e0b" stroke="#f59e0b" /> {ch.rating}
                  </span>
                  <span className="mci-channel-footer-item">SLA: {ch.slaCompliance}%</span>
                  <span className="mci-channel-footer-item">Sync: {ch.syncInterval}m</span>
                  <span className="mci-channel-footer-item">WH: {ch.mappedWarehouses}</span>
                  <span className="mci-channel-footer-item">Listings: {ch.activeListings}/{ch.listingCount}</span>
                  <span className="mci-channel-footer-item">Last: {ch.lastSync.split(" ")[1] || ch.lastSync}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mci-table-container">
          <table className="mci-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Platform</th>
                <th>City</th>
                <th>Status</th>
                <th>Monthly Orders</th>
                <th>Revenue</th>
                <th>Return Rate</th>
                <th>Fulfillment</th>
                <th>Auto Accept</th>
                <th>Sync (min)</th>
                <th>Warehouses</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredChannels.map(ch => (
                <tr key={ch.id} className="mci-table-row">
                  <td>
                    <div className="mci-channel-cell">
                      <span className="mci-channel-dot" style={{ backgroundColor: MARKETPLACE_COLORS[ch.marketplace] || "#94a3b8" }} />
                      <span className="mci-cell-name">{ch.name}</span>
                    </div>
                  </td>
                  <td>{ch.platform}</td>
                  <td>{ch.city}</td>
                  <td>
                    <span className="mci-badge" style={{ color: CHANNEL_STATUS_CONFIG[ch.status].color, backgroundColor: CHANNEL_STATUS_CONFIG[ch.status].bg }}>
                      {CHANNEL_STATUS_CONFIG[ch.status].label}
                    </span>
                  </td>
                  <td className="mci-cell-center">{ch.monthlyOrders.toLocaleString()}</td>
                  <td className="mci-cell-amount">{formatINR(ch.monthlyRevenue)}</td>
                  <td className="mci-cell-center" style={{ color: ch.returnRate > 15 ? "#ef4444" : "#64748b" }}>{ch.returnRate}%</td>
                  <td>
                    <span className="mci-cell-fulfillment">{ch.fulfillment === "hybrid" ? "Hybrid" : ch.fulfillment === "seller_fulfilled" ? "Seller" : "Platform"}</span>
                  </td>
                  <td className="mci-cell-center">{ch.autoAcceptOrders ? "✓" : "✗"}</td>
                  <td className="mci-cell-center">{ch.syncInterval}m</td>
                  <td className="mci-cell-center">{ch.mappedWarehouses}</td>
                  <td>
                    <div className="mci-rating-inline">
                      <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                      {ch.rating}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ===== TAB 4: Marketplace Analytics =====
  const renderAnalytics = () => (
    <div className="mci-tab-content">
      <div className="mci-charts-row">
        <div className="mci-chart-card">
          <div className="mci-chart-header">
            <h3 className="mci-chart-title">Marketplace Revenue Comparison</h3>
            <span className="mci-chart-subtitle">Revenue & commission by marketplace</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data.marketplaceBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748b" }} width={90} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} name="Revenue" />
              <Bar dataKey="commission" fill="#fca5a5" radius={[0, 4, 4, 0]} name="Commission" />
              <Line type="monotone" dataKey="returnRate" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Return %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mci-chart-card">
          <div className="mci-chart-header">
            <h3 className="mci-chart-title">Warehouse Allocation by Channel</h3>
            <span className="mci-chart-subtitle">Orders routed per warehouse</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.warehouseAllocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="warehouse" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="amazon" fill="#ff9900" name="Amazon" />
              <Bar dataKey="flipkart" fill="#2874f0" name="Flipkart" />
              <Bar dataKey="myntra" fill="#ff3f6c" name="Myntra" />
              <Bar dataKey="others" fill="#94a3b8" name="Others" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mci-table-container">
        <div className="mci-section-header" style={{ marginBottom: 12 }}>
          <h3 className="mci-section-title">Marketplace Performance Table</h3>
        </div>
        <table className="mci-table">
          <thead>
            <tr>
              <th>Marketplace</th>
              <th>Channels</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Commission</th>
              <th>Avg Order Value</th>
              <th>Return Rate</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.marketplaceBreakdown.map((mp, i) => (
              <tr key={i} className="mci-table-row">
                <td>
                  <div className="mci-channel-cell">
                    <span className="mci-channel-dot" style={{ backgroundColor: mp.color }} />
                    <span className="mci-cell-name" style={{ fontWeight: 600 }}>{mp.name}</span>
                  </div>
                </td>
                <td className="mci-cell-center">{mp.channels}</td>
                <td className="mci-cell-center">{mp.orders}</td>
                <td className="mci-cell-amount">{formatINR(mp.revenue)}</td>
                <td className="mci-cell-amount" style={{ color: "#ef4444" }}>{formatINR(mp.commission)}</td>
                <td className="mci-cell-amount">{formatINR(mp.avgOrderValue)}</td>
                <td className="mci-cell-center">
                  <div className="mci-progress-bar">
                    <div className="mci-progress-fill" style={{ width: `${mp.returnRate * 3}%`, backgroundColor: mp.returnRate > 15 ? "#ef4444" : mp.returnRate > 10 ? "#f59e0b" : "#10b981" }} />
                    <span>{mp.returnRate}%</span>
                  </div>
                </td>
                <td className="mci-cell-center">
                  <div className="mci-rating-inline">
                    <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                    {mp.rating}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ===== TAB 5: Sync & Inventory =====
  const renderSyncInventory = () => {
    const totalErrors = data.syncHealth.reduce((s, sh) => s + sh.errors24h, 0);
    const totalMismatch = data.syncHealth.reduce((s, sh) => s + sh.inventoryMismatch, 0);
    const totalPending = data.syncHealth.reduce((s, sh) => s + sh.pendingOrders, 0);

    return (
      <div className="mci-tab-content">
        <div className="mci-kpi-grid">
          {[
            { label: "Total Sync Errors (24h)", value: totalErrors, icon: AlertTriangle, color: "#ef4444" },
            { label: "Inventory Mismatches", value: totalMismatch, icon: Database, color: "#f59e0b" },
            { label: "Pending Sync Orders", value: totalPending, icon: Clock, color: "#6366f1" },
            { label: "Auto-Accepting Channels", value: data.channels.filter(c => c.autoAcceptOrders).length, icon: Zap, color: "#10b981" },
            { label: "Inventory-Synced", value: data.channels.filter(c => c.inventorySync).length, icon: ArrowRightLeft, color: "#3b82f6" },
            { label: "Price-Synced", value: data.channels.filter(c => c.priceSync).length, icon: CreditCard, color: "#8b5cf6" },
          ].map((kpi, i) => (
            <div key={i} className="mci-kpi-card" style={{ borderTopColor: kpi.color }}>
              <div className="mci-kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                <kpi.icon size={20} />
              </div>
              <div className="mci-kpi-info">
                <span className="mci-kpi-label">{kpi.label}</span>
                <span className="mci-kpi-value">{kpi.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mci-table-container">
          <div className="mci-section-header" style={{ marginBottom: 12 }}>
            <h3 className="mci-section-title">Sync Health Dashboard</h3>
          </div>
          <table className="mci-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th>Interval</th>
                <th>Errors (24h)</th>
                <th>Pending</th>
                <th>Inv Mismatch</th>
                <th>Auto Accept</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.syncHealth.map((sh, i) => (
                <tr key={i} className="mci-table-row">
                  <td>
                    <div className="mci-channel-cell">
                      <span className="mci-channel-dot" style={{ backgroundColor: MARKETPLACE_COLORS[data.channels[i]?.marketplace] || "#94a3b8" }} />
                      <span className="mci-cell-name">{sh.channel}</span>
                    </div>
                  </td>
                  <td>
                    <span className="mci-badge" style={{ color: CHANNEL_STATUS_CONFIG[sh.status].color, backgroundColor: CHANNEL_STATUS_CONFIG[sh.status].bg }}>
                      {CHANNEL_STATUS_CONFIG[sh.status].label}
                    </span>
                  </td>
                  <td className="mci-cell-sub">{sh.lastSync}</td>
                  <td className="mci-cell-center">{sh.syncInterval}m</td>
                  <td className="mci-cell-center" style={{ color: sh.errors24h > 5 ? "#ef4444" : sh.errors24h > 0 ? "#f59e0b" : "#10b981", fontWeight: sh.errors24h > 5 ? 600 : 400 }}>
                    {sh.errors24h}
                  </td>
                  <td className="mci-cell-center" style={{ color: sh.pendingOrders > 15 ? "#ef4444" : "#64748b" }}>{sh.pendingOrders}</td>
                  <td className="mci-cell-center" style={{ color: sh.inventoryMismatch > 3 ? "#ef4444" : sh.inventoryMismatch > 0 ? "#f59e0b" : "#10b981" }}>
                    {sh.inventoryMismatch}
                  </td>
                  <td className="mci-cell-center">{sh.autoAccept ? "✓" : "✗"}</td>
                  <td>
                    <div className="mci-sync-actions">
                      <button className="mci-sync-btn"><RefreshCw size={13} /> Sync Now</button>
                      <button className="mci-sync-btn"><Settings size={13} /> Config</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ===== Drawer =====
  const renderDrawer = () => {
    if (!selectedOrder) return null;
    const o = selectedOrder;
    const sc = STATUS_CONFIG[o.status];
    const isDelivered = o.status === "delivered";
    const isReturned = ["returned", "refunded", "cancelled"].includes(o.status);
    const headerGradient = isDelivered
      ? "linear-gradient(135deg, #059669, #10b981)"
      : isReturned
      ? "linear-gradient(135deg, #dc2626, #ef4444)"
      : "linear-gradient(135deg, #6366f1, #818cf8)";

    return (
      <div className={`mci-drawer-overlay ${drawerOpen ? "mci-drawer-open" : ""}`} onClick={closeDrawer}>
        <div className="mci-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="mci-drawer-header" style={{ background: headerGradient }}>
            <div className="mci-drawer-header-top">
              <div>
                <h2 className="mci-drawer-title">{o.id}</h2>
                <span className="mci-drawer-subtitle">{o.orderId}</span>
              </div>
              <button className="mci-drawer-close" onClick={closeDrawer}>✕</button>
            </div>
            <div className="mci-drawer-badges">
              <span className="mci-channel-badge" style={{ backgroundColor: `${MARKETPLACE_COLORS[o.marketplace.toLowerCase()]}30`, color: "#fff" }}>
                <span className="mci-channel-badge-dot" style={{ backgroundColor: MARKETPLACE_COLORS[o.marketplace.toLowerCase()] || "#fff" }} />
                {o.channel}
              </span>
              <span className="mci-badge" style={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.2)" }}>{sc.label}</span>
              <span className="mci-badge" style={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.2)" }}>
                {FULFILLMENT_CONFIG[o.fulfillment].label}
              </span>
            </div>
          </div>

          <div className="mci-drawer-content">
            <div className="mci-drawer-section">
              <h4 className="mci-drawer-section-title">Customer & Product</h4>
              <div className="mci-drawer-grid">
                <div className="mci-drawer-field">
                  <span className="mci-drawer-field-label">Customer</span>
                  <span className="mci-drawer-field-value">{o.customer}</span>
                </div>
                <div className="mci-drawer-field">
                  <span className="mci-drawer-field-label">City</span>
                  <span className="mci-drawer-field-value">{o.city}</span>
                </div>
                <div className="mci-drawer-field" style={{ gridColumn: "span 2" }}>
                  <span className="mci-drawer-field-label">Product</span>
                  <span className="mci-drawer-field-value">{o.product} ({o.sku})</span>
                </div>
                <div className="mci-drawer-field">
                  <span className="mci-drawer-field-label">Quantity</span>
                  <span className="mci-drawer-field-value">{o.quantity} units</span>
                </div>
                <div className="mci-drawer-field">
                  <span className="mci-drawer-field-label">Weight</span>
                  <span className="mci-drawer-field-value">{o.weight} kg</span>
                </div>
              </div>
            </div>

            <div className="mci-drawer-section">
              <h4 className="mci-drawer-section-title">Financial Summary</h4>
              <div className="mci-drawer-financial">
                <div className="mci-financial-row">
                  <span>Order Value</span>
                  <span className="mci-financial-value">{formatINR(o.orderValue)}</span>
                </div>
                <div className="mci-financial-row">
                  <span>Platform Commission</span>
                  <span className="mci-financial-value" style={{ color: "#ef4444" }}>-{formatINR(o.commission)}</span>
                </div>
                <div className="mci-financial-row mci-financial-total">
                  <span>Net Payout</span>
                  <span className="mci-financial-value">{formatINR(o.netPayout)}</span>
                </div>
                <div className="mci-financial-row">
                  <span>Commission Rate</span>
                  <span className="mci-financial-value">{(o.commission / Math.max(o.orderValue, 1) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="mci-drawer-section">
              <h4 className="mci-drawer-section-title">Fulfillment & Dates</h4>
              <div className="mci-drawer-grid">
                <div className="mci-drawer-field">
                  <span className="mci-drawer-field-label">Fulfillment Type</span>
                  <span className="mci-badge" style={{ color: FULFILLMENT_CONFIG[o.fulfillment].color, backgroundColor: FULFILLMENT_CONFIG[o.fulfillment].bg }}>
                    {FULFILLMENT_CONFIG[o.fulfillment].label}
                  </span>
                </div>
                <div className="mci-drawer-field">
                  <span className="mci-drawer-field-label">Payment Status</span>
                  <span className="mci-badge" style={{ color: PAYMENT_STATUS_CONFIG[o.paymentStatus].color, backgroundColor: PAYMENT_STATUS_CONFIG[o.paymentStatus].bg }}>
                    {PAYMENT_STATUS_CONFIG[o.paymentStatus].label}
                  </span>
                </div>
                <div className="mci-drawer-field">
                  <span className="mci-drawer-field-label">Warehouse</span>
                  <span className="mci-drawer-field-value">{o.warehouse}</span>
                </div>
                <div className="mci-drawer-field">
                  <span className="mci-drawer-field-label">Priority</span>
                  <span className="mci-badge" style={{ color: PRIORITY_CONFIG[o.priority].color, backgroundColor: PRIORITY_CONFIG[o.priority].bg }}>
                    {PRIORITY_CONFIG[o.priority].label}
                  </span>
                </div>
                <div className="mci-drawer-field">
                  <span className="mci-drawer-field-label">Ordered</span>
                  <span className="mci-drawer-field-value">{o.orderedAt}</span>
                </div>
                {o.shippedAt && (
                  <div className="mci-drawer-field">
                    <span className="mci-drawer-field-label">Shipped</span>
                    <span className="mci-drawer-field-value">{o.shippedAt}</span>
                  </div>
                )}
                {o.deliveredAt && (
                  <div className="mci-drawer-field" style={{ gridColumn: "span 2" }}>
                    <span className="mci-drawer-field-label">Delivered</span>
                    <span className="mci-drawer-field-value" style={{ color: "#10b981" }}>{o.deliveredAt}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mci-drawer-section">
              <h4 className="mci-drawer-section-title">Order Timeline</h4>
              <div className="mci-timeline">
                <div className="mci-timeline-item">
                  <div className="mci-timeline-dot" style={{ backgroundColor: "#6366f1" }} />
                  <div>
                    <span className="mci-timeline-step">Order Received</span>
                    <span className="mci-timeline-time">{o.channel} · {o.orderedAt}</span>
                  </div>
                </div>
                <div className="mci-timeline-item">
                  <div className="mci-timeline-dot" style={{ backgroundColor: "#3b82f6" }} />
                  <div>
                    <span className="mci-timeline-step">Accepted & Routed</span>
                    <span className="mci-timeline-time">{o.warehouse} · {o.fulfillment === "seller_fulfilled" ? "Seller Fulfilled" : "Platform Fulfilled"}</span>
                  </div>
                </div>
                <div className="mci-timeline-item">
                  <div className="mci-timeline-dot" style={{ backgroundColor: "#8b5cf6" }} />
                  <div>
                    <span className="mci-timeline-step">{o.shippedAt ? "Shipped" : "Processing"}</span>
                    <span className="mci-timeline-time">{o.shippedAt || "Awaiting shipment"}</span>
                  </div>
                </div>
                <div className="mci-timeline-item">
                  <div className="mci-timeline-dot" style={{ backgroundColor: isDelivered ? "#10b981" : isReturned ? "#ef4444" : "#64748b" }} />
                  <div>
                    <span className="mci-timeline-step">{isDelivered ? "Delivered" : isReturned ? STATUS_CONFIG[o.status].label : "In Progress"}</span>
                    <span className="mci-timeline-time">{o.deliveredAt || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mci-drawer-actions">
              <button className="mci-drawer-btn mci-drawer-btn-primary">
                <ExternalLink size={14} /> View on Platform
              </button>
              <button className="mci-drawer-btn mci-drawer-btn-secondary">
                <RefreshCw size={14} /> Sync Status
              </button>
              <button className="mci-drawer-btn mci-drawer-btn-secondary">
                <Truck size={14} /> Track Shipment
              </button>
              <button className="mci-drawer-btn mci-drawer-btn-outline">
                <Package size={14} /> Re-route
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mci-root">
      <div className="mci-header">
        <div className="mci-header-left">
          <div className="mci-header-icon" style={{ backgroundColor: `${THEME.primary}15`, color: THEME.primary }}>
            <Globe size={22} />
          </div>
          <div>
            <h1 className="mci-header-title">Multi-Channel Integration Hub</h1>
            <p className="mci-header-subtitle">Unified order management across Amazon, Flipkart, Myntra, Meesho, Shopify & more</p>
          </div>
        </div>
        <div className="mci-header-right">
          <span className="mci-header-stat">{data.channels.length} Channels</span>
          <span className="mci-header-stat">{data.marketplaceConfigs.length} Marketplaces</span>
          <span className="mci-header-stat">{data.orders.length} Orders</span>
        </div>
      </div>

      <div className="mci-tabs">
        {tabs.map((tab, i) => (
          <button key={i} className={`mci-tab ${activeTab === i ? "mci-tab-active" : ""}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && renderDashboard()}
      {activeTab === 1 && renderOrderPipeline()}
      {activeTab === 2 && renderChannels()}
      {activeTab === 3 && renderAnalytics()}
      {activeTab === 4 && renderSyncInventory()}
      {renderDrawer()}
    </div>
  );
}
