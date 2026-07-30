#!/usr/bin/env python3
"""
Generate the Hyperlocal Delivery Management module (R162)
- 92nd module for Indian logistics warehouse management Next.js app
- Theme: Orange + Teal + Slate (#f97316, #14b8a6, #475569)
- CSS prefix: hld-*
"""

output_file = "/home/z/my-project/src/components/modules/hyperlocal-delivery-view.tsx"

content = r'''"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  Zap, Search, Star, MapPin, Phone, Clock,
  AlertTriangle, CheckCircle2, XCircle, Package,
  IndianRupee, TrendingUp, TrendingDown, Users,
  Truck, ChevronLeft, ChevronRight, Eye, BarChart3,
  ArrowUpRight, ArrowDownRight, Download, RefreshCw,
  Filter, Calendar, Target, Timer, Bike, Store,
  Navigation, ShoppingBag, MapPinned, Flame, Radio,
  Layers, CircleDot, ThumbsUp, ThumbsDown, ArrowRight,
  Activity, Bell, BadgePercent, Route, Warehouse,
  ScanBarcode, ClipboardCheck, ChefHat, Apple,
  Droplets, Pill, Wine, Coffee, Sandwich,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
type OrderStatus = "placed" | "picking" | "packed" | "assigned" | "dispatched" | "out_for_delivery" | "near_location" | "delivered" | "failed" | "cancelled";
type Priority = "express" | "standard" | "scheduled";
type Category = "Groceries" | "Pharmacy" | "Food & Meals" | "Fresh Produce" | "Beverages" | "Personal Care";
type DarkStoreStatus = "active" | "busy" | "full_capacity" | "maintenance" | "offline";

interface HyperlocalOrder {
  id: string;
  orderNumber: string;
  placedAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  pincode: string;
  category: Category;
  items: { name: string; qty: number; price: number }[];
  totalValue: number;
  deliveryFee: number;
  discount: number;
  finalAmount: number;
  paymentMethod: string;
  status: OrderStatus;
  priority: Priority;
  darkStoreId: string;
  darkStoreName: string;
  riderId: string;
  riderName: string;
  vehicleType: string;
  promisedMinutes: number;
  elapsedMinutes: number;
  distanceKm: number;
  rating: number;
}

interface DarkStore {
  id: string;
  name: string;
  area: string;
  city: string;
  pincode: string;
  status: DarkStoreStatus;
  activeRiders: number;
  totalRiders: number;
  ordersToday: number;
  capacity: number;
  avgFulfillmentMin: number;
  rating: number;
  categories: Category[];
  lat: number;
  lng: number;
}

interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  status: string;
  city: string;
  area: string;
  completedToday: number;
  totalDelivered: number;
  successRate: number;
  avgTime: number;
  rating: number;
  currentOrderId: string | null;
  earnings: number;
}

interface HubStats {
  totalOrders: number;
  activeOrders: number;
  avgFulfillmentMin: number;
  onTimeRate: number;
  activeDarkStores: number;
  activeRiders: number;
}

interface MonthlyTrend {
  month: string;
  orders: number;
  revenue: number;
  avgFulfillMin: number;
  onTimePct: number;
  darkStores: number;
  riders: number;
}

interface CategoryStats {
  name: string;
  orders: number;
  revenue: number;
  avgTime: number;
  avgRating: number;
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
// INR Formatter
// ============================================================================
function formatINR(amount: number): string {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `\u20b9${(amount / 1000).toFixed(1)} K`;
  return `\u20b9${amount.toFixed(0)}`;
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// ============================================================================
// Mock Data Generator
// ============================================================================
function generateData() {
  const rand = seededRandom(162162);
  const ri = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
  const rf = (min: number, max: number) => rand() * (max - min) + min;
  const pick = <T,>(arr: T[]): T => arr[ri(0, arr.length - 1)];

  // enum arrays for JSX filtering
  const allStatuses: OrderStatus[] = ["placed", "picking", "packed", "assigned", "dispatched", "out_for_delivery", "near_location", "delivered", "failed", "cancelled"];
  const allPriorities: Priority[] = ["express", "standard", "scheduled"];
  const allCategories: Category[] = ["Groceries", "Pharmacy", "Food & Meals", "Fresh Produce", "Beverages", "Personal Care"];
  const allDarkStoreStatuses: DarkStoreStatus[] = ["active", "busy", "full_capacity", "maintenance", "offline"];

  const customers = [
    "Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Gupta", "Vikram Singh",
    "Ananya Reddy", "Rohan Joshi", "Kavitha Nair", "Arjun Mehta", "Deepika Rao",
    "Sanjay Verma", "Meera Iyer", "Karthik Pillai", "Shreya Das", "Nikhil Bose",
    "Pooja Sharma", "Ravi Tiwari", "Neha Agarwal", "Aditya Kapoor", "Sunita Mishra",
    "Manoj Chauhan", "Ritu Saxena", "Varun Malhotra", "Divya Bhat", "Akash Pandey",
    "Swati Raman", "Prashant Hegde", "Anita Kulkarni", "Gaurav Desai", "Lakshmi Iyer",
  ];

  const areas = [
    "Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Electronic City",
    "Jayanagar", "MG Road", "Marathahalli", "BTM Layout", "Sarjapur Road",
    "Gachibowli", "Madhapur", "Kondapur", "Banjara Hills", "Jubilee Hills",
    "Hitech City", "Kukatpally", "Ameerpet", "Secunderabad", "Begumpet",
    "Bandra", "Andheri", "Juhu", "Powai", "Goregaon",
    "Malad", "Borivali", "Thane", "Kalyan", "Worli",
  ];

  const streets = [
    "100 Feet Road", "MG Road", "Church Street", " Brigade Road", "Residency Road",
    "Park Street", "Camberwell Road", "Hosur Main Road", "Bellary Road", "Old Airport Road",
    "Jubilee Hills Rd", "Road No 1", "Road No 10", "Madhapur Main Rd", "HITEC City Main Rd",
    "Link Road", "SV Road", "WEH", "LBS Marg", "Goregaon-Mulund Link Rd",
  ];

  const pincodes = ["560034", "560038", "560102", "560066", "560100", "560041", "560001", "560037", "560076", "560035",
    "500032", "500081", "500084", "500034", "500033", "500081", "500085", "500038", "500003", "500026",
    "400050", "400058", "400049", "400076", "400063", "400064", "400066", "400601", "421301", "400030"];

  const riderNames = [
    "Suresh M.", "Ramesh K.", "Dinesh T.", "Mahesh P.", "Ganesh R.",
    "Raju N.", "Kumar S.", "Venkat B.", "Prasad D.", "Naresh G.",
    "Arun V.", "Bharath H.", "Chandra M.", "Devraj P.", "Eshwar L.",
    "Farhan A.", "Giri J.", "Harish O.", "Irfan Q.", "Jagdish C.",
    "Kamal W.", "Lakshman X.", "Mohan Y.", "Nandu Z.", "Om Prakash",
  ];

  const riderVehicleTypes = ["Bicycle", "Motorcycle", "E-Scooter", "E-Bike"];

  const productNames: Record<Category, string[]> = {
    "Groceries": ["Atta 5kg", "Basmati Rice 1kg", "Toor Dal 500g", "Sugar 1kg", "Salt 1kg", "Cooking Oil 1L", "Ghee 200g", "Maida 1kg", "Masala Packet", "Poha 500g", "Chai Powder 200g", "Curd 400g"],
    "Pharmacy": ["Paracetamol 10s", "ORS Sachets", "Band-Aid Box", "Vitamin C 500mg", "Antacid 20s", "Cough Syrup", "Digital Thermometer", "Hand Sanitizer", "Mask Pack 50", "Glucose Powder", "Eye Drops", "Pain Balm"],
    "Food & Meals": ["Biryani Meal", "Butter Chicken", "Paneer Tikka", "Masala Dosa", "Chole Bhature", "Veg Thali", "Chicken Roll", "Samosa 4pc", "Pav Bhaji", "Idli Sambhar", "Dal Makhani", "Naan Set"],
    "Fresh Produce": ["Bananas 1kg", "Onions 1kg", "Tomatoes 500g", "Potatoes 1kg", "Green Chillies", "Coriander Bunch", "Capsicum 500g", "Carrots 500g", "Cauliflower", "Apples 4pc", "Oranges 6pc", "Mangoes 1kg"],
    "Beverages": ["Milk 500ml", "Amul Butter Milk", "Green Tea 25s", "Coffee 200g", "Coca Cola 2L", "Maaza Mango 1L", "Paper Boat Aamras", "Tropicana Juice", "Bisleri 1L", "Red Bull 250ml", "Energy Drink", "Coconut Water"],
    "Personal Care": ["Face Wash", "Shampoo 200ml", "Toothpaste", "Body Lotion", "Deodorant Spray", "Hair Oil 100ml", "Soap Pack 3", "Sanitary Pads", "Razor + Blades", "Lip Balm", "Sunscreen SPF50", "Talcum Powder"],
  };

  // 15 Dark Stores
  const cities = ["Bengaluru", "Hyderabad", "Mumbai"];
  const darkStores: DarkStore[] = cities.flatMap((city, ci) => {
    const cityAreas = areas.slice(ci * 10, ci * 10 + 10);
    return cityAreas.slice(0, 5).map((area, ai) => {
      const cats = allCategories.filter(() => rand() > 0.2);
      const totalRiders = ri(8, 25);
      const activeRiders = ri(3, totalRiders);
      return {
        id: `DS-${String(ci * 5 + ai + 1).padStart(3, '0')}`,
        name: `${area.replace(/ Layout| Road/g, '')} Hub`,
        area,
        city,
        pincode: pincodes[ci * 10 + ai],
        status: pick(allDarkStoreStatuses.filter(s => s !== "offline")),
        activeRiders,
        totalRiders,
        ordersToday: ri(200, 800),
        capacity: ri(800, 1500),
        avgFulfillmentMin: ri(12, 28),
        rating: Math.round(rf(3.8, 4.9) * 10) / 10,
        categories: cats.length > 0 ? cats : [allCategories[0]],
        lat: rf(12.9, 13.1),
        lng: rf(77.5, 77.7),
      };
    });
  });

  // 25 Riders
  const riders: Rider[] = riderNames.map((name, i) => {
    const cityIdx = i < 10 ? 0 : i < 18 ? 1 : 2;
    return {
      id: `RD-${String(i + 1).padStart(3, '0')}`,
      name,
      phone: `+91 ${ri(7000, 9999)} ${ri(100000, 999999)}`,
      vehicleType: riderVehicleTypes[i % 4],
      status: rand() > 0.15 ? "active" : rand() > 0.5 ? "on_delivery" : "break",
      city: cities[cityIdx],
      area: areas[ri(cityIdx * 10, cityIdx * 10 + 9)],
      completedToday: ri(0, 35),
      totalDelivered: ri(500, 15000),
      successRate: Math.round(rf(92, 99.5) * 10) / 10,
      avgTime: ri(8, 25),
      rating: Math.round(rf(3.5, 5.0) * 10) / 10,
      currentOrderId: rand() > 0.4 ? `HL-${String(ri(1, 500)).padStart(4, '0')}` : null,
      earnings: Math.round(rf(300, 1200)),
    };
  });

  // 500 orders
  const orders: HyperlocalOrder[] = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < 500; i++) {
    const cat = pick(allCategories);
    const products = productNames[cat];
    const numItems = ri(1, 4);
    const items = [];
    let totalValue = 0;
    for (let j = 0; j < numItems; j++) {
      const pname = products[ri(0, products.length - 1)];
      const qty = ri(1, 3);
      const price = ri(20, 800);
      totalValue += qty * price;
      if (!items.find(it => it.name === pname)) items.push({ name: pname, qty, price });
    }
    const deliveryFee = ri(15, 49);
    const discount = ri(0, 80);
    const finalAmount = totalValue + deliveryFee - discount;
    const ds = darkStores[ri(0, darkStores.length - 1)];
    const rider = riders[ri(0, riders.length - 1)];
    const cust = customers[ri(0, customers.length - 1)];
    const status = pick(allStatuses);
    const priority = pick(allPriorities);
    const promisedMin = priority === "express" ? ri(10, 20) : priority === "standard" ? ri(15, 30) : ri(30, 60);
    const elapsedMin = status === "delivered" ? ri(8, promisedMin + 10) : status === "cancelled" ? 0 : ri(2, promisedMin + 5);

    const placedDate = new Date(2024, ri(0, 11), ri(1, 28), ri(0, 23), ri(0, 59));
    orders.push({
      id: `HL-${String(i + 1).padStart(4, '0')}`,
      orderNumber: `ORD${String(ri(100000, 999999))}`,
      placedAt: placedDate.toISOString(),
      customerName: cust,
      customerPhone: `+91 ${ri(7000, 9999)} ${ri(100000, 999999)}`,
      deliveryAddress: `${ri(1, 999)}, ${pick(streets)}, ${pick(areas)}`,
      pincode: pick(pincodes),
      category: cat,
      items,
      totalValue,
      deliveryFee,
      discount,
      finalAmount,
      paymentMethod: pick(["UPI", "Cash on Delivery", "Credit Card", "Wallet", "Net Banking"]),
      status,
      priority,
      darkStoreId: ds.id,
      darkStoreName: ds.name,
      riderId: rider.id,
      riderName: rider.name,
      vehicleType: rider.vehicleType,
      promisedMinutes: promisedMin,
      elapsedMinutes: elapsedMin,
      distanceKm: Math.round(rf(0.5, 6.0) * 10) / 10,
      rating: status === "delivered" ? Math.round(rf(3.0, 5.0) * 10) / 10 : 0,
    });
  }

  // Monthly trends
  const monthlyTrends: MonthlyTrend[] = months.map((month, i) => {
    const base = 3000 + i * 400;
    return {
      month,
      orders: Math.round(base + rf(-300, 500)),
      revenue: Math.round((base + rf(-200, 400)) * rf(280, 450)),
      avgFulfillMin: Math.round(rf(16, 26) - i * 0.3),
      onTimePct: Math.round(rf(88, 96) + i * 0.5),
      darkStores: 10 + Math.floor(i / 3),
      riders: 80 + i * 5,
    };
  });

  // Category stats
  const categoryStats: CategoryStats[] = allCategories.map((name, i) => ({
    name,
    orders: ri(300, 1500),
    revenue: ri(500000, 8000000),
    avgTime: ri(12, 28),
    avgRating: Math.round(rf(3.8, 4.8) * 10) / 10,
    color: ["#f97316", "#14b8a6", "#ef4444", "#22c55e", "#3b82f6", "#a855f7"][i],
  }));

  // Alerts
  const alerts = [
    { id: 1, type: "critical", title: "Koramangala Hub at 95% capacity", message: "Order volume exceeding dark store capacity. Activate overflow.", time: "5 min ago" },
    { id: 2, type: "warning", title: "SLA breach in Whitefield zone", message: "23 orders exceeding promised delivery time by 5+ minutes.", time: "12 min ago" },
    { id: 3, type: "warning", title: "Rider shortage in Jubilee Hills", message: "Only 3 active riders for 45 pending deliveries.", time: "18 min ago" },
    { id: 4, type: "info", title: "Peak hour surge detected", message: "Order inflow 2.3x above normal for 7-9 PM slot.", time: "25 min ago" },
    { id: 5, type: "critical", title: "Gachibowli Hub offline", message: "Power outage reported. Switching to backup DS-013.", time: "32 min ago" },
    { id: 6, type: "info", title: "New dark store going live", message: "Powai Hub (DS-015) launching tomorrow at 6 AM.", time: "1 hr ago" },
  ];

  // City-wise performance data
  const cityPerformance = cities.map((city, ci) => {
    const cityOrders = orders.filter(o => {
      const ds = darkStores.find(d => d.id === o.darkStoreId);
      return ds?.city === city;
    });
    return {
      city,
      totalOrders: cityOrders.length,
      delivered: cityOrders.filter(o => o.status === "delivered").length,
      failed: cityOrders.filter(o => o.status === "failed").length,
      avgTime: ci === 0 ? 18 : ci === 1 ? 20 : 22,
      onTimePct: ci === 0 ? 94.2 : ci === 1 ? 91.8 : 89.5,
      revenue: cityOrders.reduce((s, o) => s + o.finalAmount, 0),
      avgRating: Math.round(rf(4.0, 4.7) * 10) / 10,
    };
  });

  // Promotional campaigns
  const promotions = [
    { name: "Weekend Bonanza", type: "Percentage", value: 20, startDate: "2024-11-01", endDate: "2024-11-30", orders: 2450, revenue: 3200000, lift: 32, status: "active" },
    { name: "First Order Free Delivery", type: "Free Delivery", value: 49, startDate: "2024-10-15", endDate: "2024-12-31", orders: 5800, revenue: 8900000, lift: 18, status: "active" },
    { name: "Grocery Combo Pack", type: "Fixed", value: 100, startDate: "2024-11-10", endDate: "2024-11-15", orders: 680, revenue: 450000, lift: 45, status: "completed" },
    { name: "Pharma Express", type: "Percentage", value: 15, startDate: "2024-11-05", endDate: "2024-11-20", orders: 320, revenue: 280000, lift: 28, status: "active" },
    { name: "Flash Sale Friday", type: "Percentage", value: 25, startDate: "2024-11-08", endDate: "2024-11-08", orders: 890, revenue: 1200000, lift: 67, status: "completed" },
    { name: "Bulk Order Discount", type: "Percentage", value: 10, startDate: "2024-11-01", endDate: "2024-11-30", orders: 420, revenue: 680000, lift: 12, status: "active" },
  ];

  // Peak hour slots data
  const peakSlots = [
    { slot: "6-8 AM", orders: 320, pct: 8.2, color: "#94a3b8" },
    { slot: "8-10 AM", orders: 580, pct: 14.9, color: "#f97316" },
    { slot: "10 AM-12 PM", orders: 620, pct: 15.9, color: "#f97316" },
    { slot: "12-2 PM", orders: 710, pct: 18.2, color: "#ef4444" },
    { slot: "2-4 PM", orders: 540, pct: 13.9, color: "#f97316" },
    { slot: "4-6 PM", orders: 490, pct: 12.6, color: "#f59e0b" },
    { slot: "6-8 PM", orders: 680, pct: 17.5, color: "#ef4444" },
    { slot: "8-10 PM", orders: 560, pct: 14.4, color: "#f97316" },
    { slot: "10 PM-12 AM", orders: 310, pct: 7.9, color: "#94a3b8" },
  ];

  return {
    orders, darkStores, riders, monthlyTrends, categoryStats, alerts,
    cityPerformance, promotions, peakSlots,
    allStatuses, allPriorities, allCategories, allDarkStoreStatuses,
    productNames, riderVehicleTypes, cities,
  };
}

// ============================================================================
// Component
// ============================================================================
export default function HyperlocalDeliveryView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [darkStoreStatusFilter, setDarkStoreStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [drawerOrder, setDrawerOrder] = useState<HyperlocalOrder | null>(null);
  const perPage = 35;

  const tabs = ["Dashboard", "Live Orders", "Dark Stores", "Rider Fleet", "Promotions & Slots"];

  // ── Dashboard KPIs
  const dashboardKPIs = useMemo(() => {
    const active = data.orders.filter(o => !["delivered", "failed", "cancelled"].includes(o.status));
    const delivered = data.orders.filter(o => o.status === "delivered");
    const failed = data.orders.filter(o => o.status === "failed");
    const onTime = delivered.filter(o => o.elapsedMinutes <= o.promisedMinutes);
    return [
      { label: "Total Orders", value: formatNum(data.orders.length), sub: "All time", icon: ShoppingBag, color: "#f97316" },
      { label: "Active Orders", value: formatNum(active.length), sub: "In pipeline", icon: Radio, color: "#14b8a6" },
      { label: "Avg Fulfillment", value: `${data.monthlyTrends[data.monthlyTrends.length - 1]?.avgFulfillMin || 20} min`, sub: "Last month", icon: Timer, color: "#3b82f6" },
      { label: "On-Time Rate", value: delivered.length > 0 ? `${Math.round(onTime.length / delivered.length * 100)}%` : "0%", sub: "30-day", icon: Target, color: "#22c55e" },
      { label: "Active Hubs", value: String(data.darkStores.filter(d => d.status !== "offline").length), sub: "Across 3 cities", icon: Store, color: "#a855f7" },
      { label: "Active Riders", value: String(data.riders.filter(r => r.status !== "break").length), sub: `of ${data.riders.length} total`, icon: Bike, color: "#ef4444" },
    ];
  }, [data]);

  // ── Filtered orders for Tab 2
  const filteredOrders = useMemo(() => {
    let filtered = data.orders;
    if (statusFilter !== "all") filtered = filtered.filter(o => o.status === statusFilter);
    if (priorityFilter !== "all") filtered = filtered.filter(o => o.priority === priorityFilter);
    if (categoryFilter !== "all") filtered = filtered.filter(o => o.category === categoryFilter);
    if (cityFilter !== "all") {
      const cityStoreIds = data.darkStores.filter(d => d.city === cityFilter).map(d => d.id);
      filtered = filtered.filter(o => cityStoreIds.includes(o.darkStoreId));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.riderName.toLowerCase().includes(q) ||
        o.darkStoreName.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        o.pincode.includes(q)
      );
    }
    return filtered;
  }, [data, statusFilter, priorityFilter, categoryFilter, cityFilter, searchQuery]);

  const paginatedOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredOrders.length / perPage);

  // ── Filtered dark stores
  const filteredDarkStores = useMemo(() => {
    if (darkStoreStatusFilter !== "all") return data.darkStores.filter(d => d.status === darkStoreStatusFilter);
    return data.darkStores;
  }, [data, darkStoreStatusFilter]);

  // ── Status color helper
  const getStatusColor = (s: string) => {
    const map: Record<string, string> = {
      placed: "#94a3b8", picking: "#3b82f6", packed: "#6366f1", assigned: "#8b5cf6",
      dispatched: "#14b8a6", out_for_delivery: "#f97316", near_location: "#f59e0b",
      delivered: "#22c55e", failed: "#ef4444", cancelled: "#6b7280",
    };
    return map[s] || "#94a3b8";
  };

  const getPriorityColor = (p: string) => {
    const map: Record<string, string> = { express: "#ef4444", standard: "#3b82f6", scheduled: "#8b5cf6" };
    return map[p] || "#94a3b8";
  };

  const getCategoryColor = (c: string) => {
    const map: Record<string, string> = {
      "Groceries": "#f97316", "Pharmacy": "#14b8a6", "Food & Meals": "#ef4444",
      "Fresh Produce": "#22c55e", "Beverages": "#3b82f6", "Personal Care": "#a855f7",
    };
    return map[c] || "#94a3b8";
  };

  const getCategoryIcon = (c: string) => {
    const map: Record<string, React.ComponentType<{ className?: string }>> = {
      "Groceries": ShoppingBag, "Pharmacy": Pill, "Food & Meals": ChefHat,
      "Fresh Produce": Apple, "Beverages": Coffee, "Personal Care": Droplets,
    };
    return map[c] || Package;
  };

  // ── Render helpers
  const renderBadge = (label: string, color: string) => (
    <span className="hld-badge" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 0: DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════
  const renderDashboard = () => (
    <div className="hld-dashboard">
      {/* KPI Cards */}
      <div className="hld-kpi-grid">
        {dashboardKPIs.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="hld-kpi-card">
              <div className="hld-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                <Icon size={20} />
              </div>
              <div className="hld-kpi-content">
                <div className="hld-kpi-value">{kpi.value}</div>
                <div className="hld-kpi-label">{kpi.label}</div>
                <div className="hld-kpi-sub">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="hld-charts-row">
        <div className="hld-chart-card hld-chart-wide">
          <div className="hld-chart-title">
            <BarChart3 size={16} /> Monthly Orders & Revenue Trend
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={v => formatNum(v)} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }}
                formatter={(v: number, name: string) => [typeof v === 'number' ? (name === "revenue" ? formatINR(v) : formatNum(v)) : v, name]}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#f97316" radius={[4,4,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="hld-chart-card">
          <div className="hld-chart-title">
            <ShoppingBag size={16} /> Order Distribution by Category
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.categoryStats} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="orders" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {data.categoryStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="hld-charts-row">
        <div className="hld-chart-card">
          <div className="hld-chart-title">
            <Timer size={16} /> Fulfillment Time & On-Time Rate
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 12 }} unit=" min" />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 12 }} unit="%" />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar yAxisId="left" dataKey="avgFulfillMin" name="Avg Time (min)" fill="#6366f1" radius={[4,4,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="onTimePct" name="On-Time %" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="hld-chart-card">
          <div className="hld-chart-title">
            <TrendingUp size={16} /> Dark Store & Rider Growth
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Area type="monotone" dataKey="riders" name="Riders" fill="#f9731640" stroke="#f97316" strokeWidth={2} />
              <Area type="monotone" dataKey="darkStores" name="Dark Stores" fill="#14b8a640" stroke="#14b8a6" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="hld-section">
        <div className="hld-section-title"><Bell size={16} /> Live Alerts</div>
        <div className="hld-alerts-grid">
          {data.alerts.map(a => (
            <div key={a.id} className={`hld-alert-card hld-alert-${a.type}`}>
              <div className="hld-alert-header">
                {a.type === "critical" ? <AlertTriangle size={14} /> : a.type === "warning" ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                <span className="hld-alert-title">{a.title}</span>
                <span className="hld-alert-time">{a.time}</span>
              </div>
              <div className="hld-alert-msg">{a.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 1: LIVE ORDERS
  // ══════════════════════════════════════════════════════════════════════════
  const renderLiveOrders = () => {
    const activeCount = data.orders.filter(o => o.status === "out_for_delivery").length;
    const nearCount = data.orders.filter(o => o.status === "near_location").length;
    const pickingCount = data.orders.filter(o => o.status === "picking").length;
    const failedCount = data.orders.filter(o => o.status === "failed").length;
    const activeRiderCount = data.riders.filter(r => r.status === "on_delivery").length;

    return (
      <div className="hld-orders">
        {/* Live stat counters */}
        <div className="hld-live-stats">
          <div className="hld-live-stat" style={{ borderColor: "#f97316" }}>
            <div className="hld-live-stat-value">{activeCount}</div>
            <div className="hld-live-stat-label">Out for Delivery</div>
          </div>
          <div className="hld-live-stat" style={{ borderColor: "#f59e0b" }}>
            <div className="hld-live-stat-value">{nearCount}</div>
            <div className="hld-live-stat-label">Near Location</div>
          </div>
          <div className="hld-live-stat" style={{ borderColor: "#3b82f6" }}>
            <div className="hld-live-stat-value">{pickingCount}</div>
            <div className="hld-live-stat-label">Picking</div>
          </div>
          <div className="hld-live-stat" style={{ borderColor: "#ef4444" }}>
            <div className="hld-live-stat-value">{failedCount}</div>
            <div className="hld-live-stat-label">Failed Today</div>
          </div>
          <div className="hld-live-stat" style={{ borderColor: "#14b8a6" }}>
            <div className="hld-live-stat-value">{activeRiderCount}</div>
            <div className="hld-live-stat-label">Riders on Delivery</div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="hld-filter-section">
          <div className="hld-search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search Order ID, Customer, Rider, Hub, Pincode..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            />
            {searchQuery && <XCircle size={16} className="hld-search-clear" onClick={() => { setSearchQuery(""); setPage(1); }} />}
          </div>
        </div>
        <div className="hld-filter-bar">
          <div className="hld-filter-row">
            <span className="hld-filter-label"><Filter size={14} /> Status:</span>
            <div className="hld-filter-pills">
              <button className={`hld-pill ${statusFilter === "all" ? "active" : ""}`} onClick={() => { setStatusFilter("all"); setPage(1); }}>All</button>
              {data.allStatuses.map(s => (
                <button key={s} className={`hld-pill ${statusFilter === s ? "active" : ""}`} style={statusFilter === s ? { background: getStatusColor(s), color: "#fff" } : {}} onClick={() => { setStatusFilter(s); setPage(1); }}>
                  {s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
          <div className="hld-filter-row">
            <span className="hld-filter-label">Priority:</span>
            <div className="hld-filter-pills">
              <button className={`hld-pill ${priorityFilter === "all" ? "active" : ""}`} onClick={() => { setPriorityFilter("all"); setPage(1); }}>All</button>
              {data.allPriorities.map(p => (
                <button key={p} className={`hld-pill ${priorityFilter === p ? "active" : ""}`} style={priorityFilter === p ? { background: getPriorityColor(p), color: "#fff" } : {}} onClick={() => { setPriorityFilter(p); setPage(1); }}>
                  {p}
                </button>
              ))}
            </div>
            <span className="hld-filter-sep">|</span>
            <span className="hld-filter-label">Category:</span>
            <div className="hld-filter-pills">
              <button className={`hld-pill ${categoryFilter === "all" ? "active" : ""}`} onClick={() => { setCategoryFilter("all"); setPage(1); }}>All</button>
              {data.allCategories.map(c => (
                <button key={c} className={`hld-pill ${categoryFilter === c ? "active" : ""}`} style={categoryFilter === c ? { background: getCategoryColor(c), color: "#fff" } : {}} onClick={() => { setCategoryFilter(c); setPage(1); }}>
                  {c}
                </button>
              ))}
            </div>
            <span className="hld-filter-sep">|</span>
            <span className="hld-filter-label">City:</span>
            <select className="hld-select" value={cityFilter} onChange={e => { setCityFilter(e.target.value); setPage(1); }}>
              <option value="all">All Cities</option>
              {data.cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="hld-table-wrap">
          <div className="hld-results-info">
            Showing {((page - 1) * perPage + 1)}-{Math.min(page * perPage, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <table className="hld-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Dark Store</th>
                <th>Rider</th>
                <th>Priority</th>
                <th>Amount</th>
                <th>ETA</th>
                <th>Elapsed</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => {
                const isOvertime = order.elapsedMinutes > order.promisedMinutes;
                const progressPct = Math.min(100, Math.round((order.elapsedMinutes / order.promisedMinutes) * 100));
                return (
                  <tr key={order.id} className="hld-table-row" onClick={() => setDrawerOrder(order)}>
                    <td>
                      <div className="hld-cell-id">{order.id}</div>
                      <div className="hld-cell-sub">{order.orderNumber}</div>
                    </td>
                    <td>
                      <div className="hld-cell-name">{order.customerName}</div>
                      <div className="hld-cell-sub">{order.pincode}</div>
                    </td>
                    <td>
                      <div className="hld-cat-badge" style={{ background: `${getCategoryColor(order.category)}15`, color: getCategoryColor(order.category) }}>
                        {order.category}
                      </div>
                    </td>
                    <td>
                      <div className="hld-cell-name">{order.darkStoreName}</div>
                      <div className="hld-cell-sub">{order.darkStoreId}</div>
                    </td>
                    <td>
                      <div className="hld-cell-name">{order.riderName}</div>
                      <div className="hld-cell-sub">{order.vehicleType}</div>
                    </td>
                    <td>{renderBadge(order.priority, getPriorityColor(order.priority))}</td>
                    <td>
                      <div className="hld-cell-amount" style={{ fontWeight: 600 }}>&#8377;{order.finalAmount}</div>
                      <div className="hld-cell-sub">Fee: &#8377;{order.deliveryFee}</div>
                    </td>
                    <td>
                      <div className="hld-cell-time">{order.promisedMinutes} min</div>
                    </td>
                    <td>
                      <div className="hld-eta-bar">
                        <div className="hld-eta-track">
                          <div className="hld-eta-fill" style={{ width: `${progressPct}%`, background: isOvertime ? "#ef4444" : "#22c55e" }} />
                        </div>
                        <span className="hld-eta-label" style={{ color: isOvertime ? "#ef4444" : "#22c55e" }}>{order.elapsedMinutes}m</span>
                      </div>
                    </td>
                    <td>{renderBadge(order.status.replace(/_/g, " "), getStatusColor(order.status))}</td>
                    <td>
                      <button className="hld-action-btn" onClick={e => { e.stopPropagation(); setDrawerOrder(order); }}>
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="hld-pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></button>
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 7) {
                  if (page <= 4) p = i + 1;
                  else if (page >= totalPages - 3) p = totalPages - 6 + i;
                  else p = page - 3 + i;
                }
                return (
                  <button key={p} className={`hld-page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                );
              })}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 2: DARK STORES
  // ══════════════════════════════════════════════════════════════════════════
  const renderDarkStores = () => {
    const dsKPIs = [
      { label: "Total Dark Stores", value: String(data.darkStores.length), icon: Store, color: "#f97316" },
      { label: "Active", value: String(data.darkStores.filter(d => d.status === "active").length), icon: CheckCircle2, color: "#22c55e" },
      { label: "Busy", value: String(data.darkStores.filter(d => d.status === "busy").length), icon: Clock, color: "#f59e0b" },
      { label: "Full Capacity", value: String(data.darkStores.filter(d => d.status === "full_capacity").length), icon: AlertTriangle, color: "#ef4444" },
      { label: "Total Riders", value: String(data.darkStores.reduce((s, d) => s + d.totalRiders, 0)), icon: Bike, color: "#14b8a6" },
      { label: "Orders Today", value: formatNum(data.darkStores.reduce((s, d) => s + d.ordersToday, 0)), icon: ShoppingBag, color: "#3b82f6" },
    ];

    const getDSStatusColor = (s: string) => {
      const map: Record<string, string> = { active: "#22c55e", busy: "#f59e0b", full_capacity: "#ef4444", maintenance: "#6366f1", offline: "#6b7280" };
      return map[s] || "#6b7280";
    };

    return (
      <div className="hld-ds">
        <div className="hld-kpi-grid">
          {dsKPIs.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="hld-kpi-card">
                <div className="hld-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                  <Icon size={20} />
                </div>
                <div className="hld-kpi-content">
                  <div className="hld-kpi-value">{kpi.value}</div>
                  <div className="hld-kpi-label">{kpi.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <div className="hld-filter-bar">
          <div className="hld-filter-row">
            <span className="hld-filter-label"><Filter size={14} /> Status:</span>
            <div className="hld-filter-pills">
              <button className={`hld-pill ${darkStoreStatusFilter === "all" ? "active" : ""}`} onClick={() => setDarkStoreStatusFilter("all")}>All</button>
              {data.allDarkStoreStatuses.map(s => (
                <button key={s} className={`hld-pill ${darkStoreStatusFilter === s ? "active" : ""}`} style={darkStoreStatusFilter === s ? { background: getDSStatusColor(s), color: "#fff" } : {}} onClick={() => setDarkStoreStatusFilter(s)}>
                  {s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dark Store Cards */}
        <div className="hld-ds-grid">
          {filteredDarkStores.map(ds => {
            const usagePct = Math.round((ds.ordersToday / ds.capacity) * 100);
            const riderPct = Math.round((ds.activeRiders / ds.totalRiders) * 100);
            return (
              <div key={ds.id} className="hld-ds-card">
                <div className="hld-ds-header" style={{ borderLeftColor: getDSStatusColor(ds.status) }}>
                  <div className="hld-ds-title-row">
                    <Store size={16} style={{ color: getDSStatusColor(ds.status) }} />
                    <span className="hld-ds-name">{ds.name}</span>
                    <span className="hld-ds-badge" style={{ background: `${getDSStatusColor(ds.status)}20`, color: getDSStatusColor(ds.status) }}>
                      {ds.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="hld-ds-location">{MapPin size={12}/} {ds.area}, {ds.city} - {ds.pincode}</div>
                </div>
                <div className="hld-ds-stats">
                  <div className="hld-ds-stat">
                    <span className="hld-ds-stat-value">{ds.ordersToday}</span>
                    <span className="hld-ds-stat-label">Orders Today</span>
                    <div className="hld-ds-progress"><div className="hld-ds-progress-fill" style={{ width: `${Math.min(100, usagePct)}%`, background: usagePct > 90 ? "#ef4444" : usagePct > 70 ? "#f59e0b" : "#22c55e" }} /></div>
                    <span className="hld-ds-pct">{usagePct}%</span>
                  </div>
                  <div className="hld-ds-stat">
                    <span className="hld-ds-stat-value">{ds.activeRiders}/{ds.totalRiders}</span>
                    <span className="hld-ds-stat-label">Active Riders</span>
                    <div className="hld-ds-progress"><div className="hld-ds-progress-fill" style={{ width: `${riderPct}%`, background: "#14b8a6" }} /></div>
                    <span className="hld-ds-pct">{riderPct}%</span>
                  </div>
                  <div className="hld-ds-stat">
                    <span className="hld-ds-stat-value">{ds.avgFulfillmentMin}m</span>
                    <span className="hld-ds-stat-label">Avg Fulfill</span>
                  </div>
                  <div className="hld-ds-stat">
                    <span className="hld-ds-stat-value">{ds.rating}</span>
                    <span className="hld-ds-stat-label">Rating</span>
                    <div className="hld-ds-stars">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= Math.round(ds.rating) ? "#f59e0b" : "#334155"} stroke="#f59e0b" />)}
                    </div>
                  </div>
                </div>
                <div className="hld-ds-categories">
                  {ds.categories.map(c => {
                    const CIcon = getCategoryIcon(c);
                    return (
                      <span key={c} className="hld-ds-cat-tag" style={{ color: getCategoryColor(c), background: `${getCategoryColor(c)}12`, borderColor: `${getCategoryColor(c)}30` }}>
                        <CIcon size={10} /> {c}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 3: RIDER FLEET
  // ══════════════════════════════════════════════════════════════════════════
  const renderRiderFleet = () => {
    const riderKPIs = [
      { label: "Total Riders", value: String(data.riders.length), icon: Users, color: "#f97316" },
      { label: "Active", value: String(data.riders.filter(r => r.status === "active").length), icon: Radio, color: "#22c55e" },
      { label: "On Delivery", value: String(data.riders.filter(r => r.status === "on_delivery").length), icon: Bike, color: "#14b8a6" },
      { label: "Avg Rating", value: (data.riders.reduce((s, r) => s + r.rating, 0) / data.riders.length).toFixed(1), icon: Star, color: "#f59e0b" },
      { label: "Today's Deliveries", value: String(data.riders.reduce((s, r) => s + r.completedToday, 0)), icon: Package, color: "#3b82f6" },
      { label: "Avg Success Rate", value: `${(data.riders.reduce((s, r) => s + r.successRate, 0) / data.riders.length).toFixed(1)}%`, icon: Target, color: "#a855f7" },
    ];

    const getRiderStatusColor = (s: string) => {
      const map: Record<string, string> = { active: "#22c55e", on_delivery: "#14b8a6", break: "#f59e0b" };
      return map[s] || "#94a3b8";
    };

    const getVehicleIcon = (v: string) => {
      const map: Record<string, React.ComponentType<{ className?: string }>> = { Bicycle: Bike, Motorcycle: Zap, "E-Scooter": Zap, "E-Bike": Zap };
      return map[v] || Bike;
    };

    return (
      <div className="hld-riders">
        <div className="hld-kpi-grid">
          {riderKPIs.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="hld-kpi-card">
                <div className="hld-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                  <Icon size={20} />
                </div>
                <div className="hld-kpi-content">
                  <div className="hld-kpi-value">{kpi.value}</div>
                  <div className="hld-kpi-label">{kpi.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* City performance chart */}
        <div className="hld-charts-row" style={{ marginTop: 16 }}>
          <div className="hld-chart-card">
            <div className="hld-chart-title"><BarChart3 size={16} /> City Performance</div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={data.cityPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="city" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar dataKey="delivered" name="Delivered" fill="#22c55e" radius={[4,4,0,0]} />
                <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4,4,0,0]} />
                <Line type="monotone" dataKey="onTimePct" name="On-Time %" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="hld-chart-card">
            <div className="hld-chart-title"><Navigation size={16} /> Zone Performance Radar</div>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={[
                { dimension: "Speed", Bengaluru: 88, Hyderabad: 82, Mumbai: 79 },
                { dimension: "Accuracy", Bengaluru: 94, Hyderabad: 91, Mumbai: 89 },
                { dimension: "Coverage", Bengaluru: 85, Hyderabad: 80, Mumbai: 78 },
                { dimension: "Reliability", Bengaluru: 92, Hyderabad: 88, Mumbai: 86 },
              ]}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar name="Bengaluru" dataKey="Bengaluru" stroke="#f97316" fill="#f9731630" strokeWidth={2} />
                <Radar name="Hyderabad" dataKey="Hyderabad" stroke="#14b8a6" fill="#14b8a630" strokeWidth={2} />
                <Radar name="Mumbai" dataKey="Mumbai" stroke="#a855f7" fill="#a855f730" strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rider Cards */}
        <div className="hld-section-title" style={{ marginTop: 16 }}><Users size={16} /> Rider Directory</div>
        <div className="hld-rider-grid">
          {data.riders.map(rider => {
            const VIcon = getVehicleIcon(rider.vehicleType);
            return (
              <div key={rider.id} className="hld-rider-card">
                <div className="hld-rider-avatar" style={{ background: `linear-gradient(135deg, ${getRiderStatusColor(rider.status)}40, ${getRiderStatusColor(rider.status)}15)` }}>
                  <span>{rider.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="hld-rider-info">
                  <div className="hld-rider-name">{rider.name}</div>
                  <div className="hld-rider-id">{rider.id}</div>
                </div>
                <div className="hld-rider-status-row">
                  <span className="hld-rider-status" style={{ background: `${getRiderStatusColor(rider.status)}20`, color: getRiderStatusColor(rider.status) }}>
                    {rider.status.replace(/_/g, " ")}
                  </span>
                  <span className="hld-rider-vehicle"><VIcon size={12} /> {rider.vehicleType}</span>
                </div>
                <div className="hld-rider-details">
                  <div className="hld-rider-detail"><Phone size={10} /> {rider.phone}</div>
                  <div className="hld-rider-detail"><MapPin size={10} /> {rider.area}, {rider.city}</div>
                </div>
                <div className="hld-rider-stats">
                  <div className="hld-rider-stat-box">
                    <span className="hld-rider-stat-val">{rider.completedToday}</span>
                    <span className="hld-rider-stat-lbl">Today</span>
                  </div>
                  <div className="hld-rider-stat-box">
                    <span className="hld-rider-stat-val">{formatNum(rider.totalDelivered)}</span>
                    <span className="hld-rider-stat-lbl">Total</span>
                  </div>
                  <div className="hld-rider-stat-box">
                    <span className="hld-rider-stat-val">{rider.successRate}%</span>
                    <span className="hld-rider-stat-lbl">Success</span>
                  </div>
                  <div className="hld-rider-stat-box">
                    <span className="hld-rider-stat-val">{rider.avgTime}m</span>
                    <span className="hld-rider-stat-lbl">Avg Time</span>
                  </div>
                  <div className="hld-rider-stat-box">
                    <span className="hld-rider-stat-val">&#9733;{rider.rating}</span>
                    <span className="hld-rider-stat-lbl">Rating</span>
                  </div>
                </div>
                {rider.currentOrderId && (
                  <div className="hld-rider-current-order">
                    <Radio size={10} /> Active: {rider.currentOrderId}
                  </div>
                )}
                <div className="hld-rider-earnings">
                  <IndianRupee size={12} /> Today: <strong>&#8377;{rider.earnings}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 4: PROMOTIONS & SLOTS
  // ══════════════════════════════════════════════════════════════════════════
  const renderPromotions = () => {
    const promKPIs = [
      { label: "Active Promotions", value: String(data.promotions.filter(p => p.status === "active").length), icon: BadgePercent, color: "#f97316" },
      { label: "Total Orders via Promo", value: formatNum(data.promotions.reduce((s, p) => s + p.orders, 0)), icon: ShoppingBag, color: "#14b8a6" },
      { label: "Avg Demand Lift", value: `${Math.round(data.promotions.reduce((s, p) => s + p.lift, 0) / data.promotions.length)}%`, icon: TrendingUp, color: "#22c55e" },
      { label: "Promo Revenue", value: formatINR(data.promotions.reduce((s, p) => s + p.revenue, 0)), icon: IndianRupee, color: "#3b82f6" },
      { label: "Best Performing", value: "Flash Sale Friday", icon: Flame, color: "#ef4444" },
      { label: "Peak Hour", value: "12-2 PM", icon: Clock, color: "#a855f7" },
    ];

    return (
      <div className="hld-promo">
        <div className="hld-kpi-grid">
          {promKPIs.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="hld-kpi-card">
                <div className="hld-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                  <Icon size={20} />
                </div>
                <div className="hld-kpi-content">
                  <div className="hld-kpi-value">{kpi.value}</div>
                  <div className="hld-kpi-label">{kpi.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="hld-charts-row" style={{ marginTop: 16 }}>
          <div className="hld-chart-card">
            <div className="hld-chart-title"><Flame size={16} /> Peak Hour Order Distribution</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.peakSlots}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="slot" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Bar dataKey="orders" name="Orders" radius={[4,4,0,0]}>
                  {data.peakSlots.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="hld-chart-card">
            <div className="hld-chart-title"><TrendingUp size={16} /> Promotion Impact Analysis</div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={data.promotions.map(p => ({ name: p.name, orders: p.orders, lift: p.lift, revenue: p.revenue }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 12 }} unit="%" />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#f97316" radius={[4,4,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="lift" name="Demand Lift %" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Promotions Table */}
        <div className="hld-section-title" style={{ marginTop: 16 }}><BadgePercent size={16} /> Active Promotions</div>
        <div className="hld-table-wrap">
          <table className="hld-table">
            <thead>
              <tr>
                <th>Promotion</th>
                <th>Type</th>
                <th>Value</th>
                <th>Period</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Demand Lift</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.promotions.map((p, i) => (
                <tr key={i}>
                  <td className="hld-cell-name">{p.name}</td>
                  <td>{renderBadge(p.type, "#6366f1")}</td>
                  <td>{p.type === "Percentage" ? `${p.value}%` : p.type === "Fixed" ? `₹${p.value}` : `₹${p.value}`}</td>
                  <td><div className="hld-cell-sub">{p.startDate}</div><div className="hld-cell-sub">{p.endDate}</div></td>
                  <td>{formatNum(p.orders)}</td>
                  <td style={{ fontWeight: 600 }}>{formatINR(p.revenue)}</td>
                  <td>
                    <div className="hld-lift-bar">
                      <div className="hld-lift-fill" style={{ width: `${Math.min(100, p.lift)}%` }} />
                      <span>{p.lift}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`hld-promo-status ${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Peak Slots Detail */}
        <div className="hld-section-title" style={{ marginTop: 20 }}><Clock size={16} /> Peak Hour Breakdown</div>
        <div className="hld-slots-grid">
          {data.peakSlots.map((slot, i) => (
            <div key={i} className="hld-slot-card" style={{ borderLeftColor: slot.color }}>
              <div className="hld-slot-time">{slot.slot}</div>
              <div className="hld-slot-orders">{formatNum(slot.orders)}</div>
              <div className="hld-slot-pct">{slot.pct}%</div>
              <div className="hld-slot-bar">
                <div className="hld-slot-bar-fill" style={{ width: `${slot.pct}%`, background: slot.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // DRAWER
  // ══════════════════════════════════════════════════════════════════════════
  const renderDrawer = () => {
    if (!drawerOrder) return null;
    const o = drawerOrder;
    const isOvertime = o.elapsedMinutes > o.promisedMinutes;
    const headerGradient = o.status === "delivered"
      ? "linear-gradient(135deg, #059669, #14b8a6)"
      : o.status === "failed"
      ? "linear-gradient(135deg, #dc2626, #ef4444)"
      : o.status === "cancelled"
      ? "linear-gradient(135deg, #475569, #6b7280)"
      : "linear-gradient(135deg, #f97316, #ea580c)";

    const timelineSteps = [
      { label: "Order Placed", done: ["placed", "picking", "packed", "assigned", "dispatched", "out_for_delivery", "near_location", "delivered", "failed"].includes(o.status), icon: ShoppingBag },
      { label: "Picked", done: ["picking", "packed", "assigned", "dispatched", "out_for_delivery", "near_location", "delivered", "failed"].includes(o.status), icon: ClipboardCheck },
      { label: "Dispatched", done: ["dispatched", "out_for_delivery", "near_location", "delivered", "failed"].includes(o.status), icon: Truck },
      { label: o.status === "failed" ? "Failed" : o.status === "cancelled" ? "Cancelled" : "Delivered", done: ["delivered", "failed", "cancelled"].includes(o.status), icon: o.status === "delivered" ? CheckCircle2 : o.status === "failed" ? XCircle : AlertTriangle },
    ];

    return (
      <div className="hld-drawer-overlay" onClick={() => setDrawerOrder(null)}>
        <div className="hld-drawer" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="hld-drawer-header" style={{ background: headerGradient }}>
            <button className="hld-drawer-back" onClick={() => setDrawerOrder(null)}><ChevronLeft size={18} /></button>
            <div className="hld-drawer-title">Order Detail</div>
            <div className="hld-drawer-badges">
              {renderBadge(o.status.replace(/_/g, " "), "#fff")}
              {renderBadge(o.priority, "#fff")}
              {renderBadge(o.paymentMethod, "#ffffff80")}
            </div>
          </div>

          {/* Content */}
          <div className="hld-drawer-content">
            {/* Order & Product Info */}
            <div className="hld-drawer-section">
              <div className="hld-drawer-section-title">Order Information</div>
              <div className="hld-drawer-grid">
                <div className="hld-drawer-field"><span className="hld-field-label">Order ID</span><span className="hld-field-value">{o.id}</span></div>
                <div className="hld-drawer-field"><span className="hld-field-label">Order Number</span><span className="hld-field-value">{o.orderNumber}</span></div>
                <div className="hld-drawer-field"><span className="hld-field-label">Category</span><span className="hld-field-value"><span style={{ color: getCategoryColor(o.category) }}>{o.category}</span></span></div>
                <div className="hld-drawer-field"><span className="hld-field-label">Dark Store</span><span className="hld-field-value">{o.darkStoreName} ({o.darkStoreId})</span></div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="hld-drawer-section">
              <div className="hld-drawer-section-title">Customer Details</div>
              <div className="hld-drawer-grid">
                <div className="hld-drawer-field"><span className="hld-field-label">Name</span><span className="hld-field-value">{o.customerName}</span></div>
                <div className="hld-drawer-field"><span className="hld-field-label">Phone</span><span className="hld-field-value">{o.customerPhone}</span></div>
                <div className="hld-drawer-field" style={{ gridColumn: "1 / -1" }}><span className="hld-field-label">Address</span><span className="hld-field-value">{o.deliveryAddress} - {o.pincode}</span></div>
              </div>
            </div>

            {/* Rider Details */}
            <div className="hld-drawer-section">
              <div className="hld-drawer-section-title">Rider Details</div>
              <div className="hld-drawer-grid">
                <div className="hld-drawer-field"><span className="hld-field-label">Rider</span><span className="hld-field-value">{o.riderName}</span></div>
                <div className="hld-drawer-field"><span className="hld-field-label">Vehicle</span><span className="hld-field-value">{o.vehicleType}</span></div>
                <div className="hld-drawer-field"><span className="hld-field-label">Distance</span><span className="hld-field-value">{o.distanceKm} km</span></div>
                <div className="hld-drawer-field"><span className="hld-field-label">Items</span><span className="hld-field-value">{o.items.length} items</span></div>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="hld-drawer-section">
              <div className="hld-drawer-section-title">Delivery Timing</div>
              <div className="hld-drawer-grid">
                <div className="hld-drawer-field"><span className="hld-field-label">Promised</span><span className="hld-field-value">{o.promisedMinutes} min</span></div>
                <div className="hld-drawer-field"><span className="hld-field-label">Elapsed</span><span className="hld-field-value" style={{ color: isOvertime ? "#ef4444" : "#22c55e", fontWeight: 600 }}>{o.elapsedMinutes} min {isOvertime && "(OVERTIME)"}</span></div>
              </div>
            </div>

            {/* Items */}
            <div className="hld-drawer-section">
              <div className="hld-drawer-section-title">Order Items</div>
              <div className="hld-drawer-items">
                {o.items.map((item, i) => (
                  <div key={i} className="hld-drawer-item">
                    <span className="hld-item-name">{item.name}</span>
                    <span className="hld-item-qty">{item.qty}x</span>
                    <span className="hld-item-price">&#8377;{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="hld-drawer-card">
              <div className="hld-drawer-card-title">Financial Summary</div>
              <div className="hld-drawer-fin">
                <div className="hld-fin-row"><span>Subtotal</span><span>&#8377;{o.totalValue}</span></div>
                <div className="hld-fin-row"><span>Delivery Fee</span><span>&#8377;{o.deliveryFee}</span></div>
                <div className="hld-fin-row"><span>Discount</span><span style={{ color: "#22c55e" }}> -&#8377;{o.discount}</span></div>
                <div className="hld-fin-row hld-fin-total"><span>Final Amount</span><span>&#8377;{o.finalAmount}</span></div>
              </div>
            </div>

            {/* Rating */}
            {o.rating > 0 && (
              <div className="hld-drawer-card" style={{ borderColor: "#f59e0b40" }}>
                <div className="hld-drawer-card-title">Customer Rating</div>
                <div className="hld-rating-display">
                  {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={s <= Math.round(o.rating) ? "#f59e0b" : "#334155"} stroke="#f59e0b" />)}
                  <span className="hld-rating-value">{o.rating}/5</span>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="hld-drawer-section">
              <div className="hld-drawer-section-title">Order Timeline</div>
              <div className="hld-drawer-timeline">
                {timelineSteps.map((step, i) => {
                  const SIcon = step.icon;
                  return (
                    <div key={i} className={`hld-timeline-step ${step.done ? "done" : ""}`}>
                      <div className={`hld-timeline-dot ${step.done ? "" : "pending"}`}>
                        <SIcon size={12} />
                      </div>
                      <div className="hld-timeline-label">{step.label}</div>
                      {i < timelineSteps.length - 1 && <div className={`hld-timeline-line ${step.done ? "" : "pending"}`} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="hld-drawer-actions">
              <button className="hld-action-primary"><Phone size={14} /> Call Customer</button>
              <button className="hld-action-primary"><Navigation size={14} /> Track Live</button>
              <button className="hld-action-secondary"><ArrowRight size={14} /> Re-assign Rider</button>
              <button className="hld-action-secondary"><Download size={14} /> Export Receipt</button>
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
    <div className="hld-root">
      <div className="hld-header">
        <div className="hld-header-left">
          <Zap size={22} className="hld-header-icon" />
          <div>
            <h1 className="hld-title">Hyperlocal Delivery Management</h1>
            <p className="hld-subtitle">10-30 minute instant delivery across dark store network</p>
          </div>
        </div>
        <div className="hld-header-right">
          <span className="hld-header-stat"><Radio size={14} /> {data.orders.filter(o => ["out_for_delivery", "near_location"].includes(o.status)).length} Live</span>
          <span className="hld-header-stat"><Store size={14} /> {data.darkStores.filter(d => d.status === "active").length} Hubs Active</span>
        </div>
      </div>

      <div className="hld-tabs">
        {tabs.map((tab, i) => (
          <button key={i} className={`hld-tab ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="hld-content">
        {activeTab === 0 && renderDashboard()}
        {activeTab === 1 && renderLiveOrders()}
        {activeTab === 2 && renderDarkStores()}
        {activeTab === 3 && renderRiderFleet()}
        {activeTab === 4 && renderPromotions()}
      </div>

      {renderDrawer()}
    </div>
  );
}
'''

with open(output_file, 'w') as f:
    f.write(content)

print(f"Written {len(content.splitlines())} lines to {output_file}")
