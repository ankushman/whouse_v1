"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  LockKeyhole, Search, TrendingUp, TrendingDown, Target,
  AlertTriangle, CheckCircle2, XCircle, Package,
  Truck, ChevronLeft, ChevronRight, Eye, BarChart3,
  ArrowUpRight, ArrowDownRight, Download, RefreshCw,
  Filter, Calendar, MapPin, QrCode, Smartphone,
  Monitor, Key, Clock, Timer, Users, IndianRupee,
  Settings, Shield, Wifi, BatteryFull, BatteryLow,
  BatteryMedium, BatteryWarning, Thermometer, Volume2,
  Camera, CreditCard, Receipt, Bell, Star,
  CircleDot, ArrowRight, Percent, Gauge, Layers,
  Building2, Warehouse, ScanLine, Fingerprint, Mail,
  PackageCheck, CircleDollarSign, Activity, Zap, WifiOff,
  ChevronDown, ChevronUp, Copy, ExternalLink, Maximize2,
  Grid3X3, List, Columns3,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
type LockerSize = "small" | "medium" | "large" | "extra_large";
type LockerStatus = "available" | "occupied" | "maintenance" | "reserved" | "out_of_service";
type KioskType = "self_pickup" | "self_dropoff" | "hybrid" | "returns" | "payment";
type KioskStatus = "online" | "offline" | "maintenance" | "updating";
type TransactionStatus = "in_progress" | "completed" | "expired" | "failed" | "picked_up" | "dropped_off";
type PaymentMethod = "upi" | "cod" | "card" | "wallet" | "net_banking";
type AccessMethod = "otp" | "qr_code" | "app" | "nfc" | "biometric" | "pin";
type AlertSeverity = "critical" | "warning" | "info";

interface SmartLocker {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  totalCompartments: number;
  compartmentsBySize: { small: number; medium: number; large: number; extra_large: number };
  occupancyRate: number;
  temperature: number;
  hasPowerBackup: boolean;
  hasCamera: boolean;
  hasWifi: boolean;
  status: LockerStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  partner: string;
}

interface Compartment {
  id: string;
  lockerId: string;
  lockerName: string;
  slotNumber: string;
  size: LockerSize;
  status: LockerStatus;
  currentOccupant: string | null;
  customerName: string | null;
  orderId: string | null;
  awb: string | null;
  depositedAt: string | null;
  accessCode: string | null;
  accessMethod: AccessMethod;
  temperature: number;
  weight: number;
  weightLimit: number;
  expiryTime: string | null;
  notificationsSent: number;
}

interface Kiosk {
  id: string;
  name: string;
  location: string;
  city: string;
  type: KioskType;
  status: KioskStatus;
  totalTransactions: number;
  todayTransactions: number;
  avgProcessingTime: number;
  uptime: string;
  lastPing: string;
  hasScanner: boolean;
  hasPrinter: boolean;
  hasScale: boolean;
  hasPaymentTerminal: boolean;
  screenSize: string;
  osVersion: string;
  partner: string;
}

interface Transaction {
  id: string;
  type: "pickup" | "dropoff" | "return" | "payment";
  status: TransactionStatus;
  lockerId: string;
  lockerName: string;
  kioskId: string;
  kioskName: string;
  compartmentId: string;
  customerName: string;
  customerPhone: string;
  orderId: string;
  awb: string;
  courierPartner: string;
  accessMethod: AccessMethod;
  paymentMethod: PaymentMethod | null;
  amountINR: number | null;
  compartmentSize: LockerSize;
  createdAt: string;
  completedAt: string | null;
  expiryTime: string | null;
  notificationCount: number;
  city: string;
}

interface LockerAlert {
  id: string;
  severity: AlertSeverity;
  type: string;
  message: string;
  lockerName: string;
  kioskName: string | null;
  timestamp: string;
  acknowledged: boolean;
}

interface UsageTrend {
  hour: string;
  pickups: number;
  dropoffs: number;
  returns: number;
  total: number;
}

interface DailyTrend {
  day: string;
  transactions: number;
  pickups: number;
  dropoffs: number;
  revenue: number;
  utilization: number;
}

interface SizeDistribution {
  size: string;
  count: number;
  occupied: number;
  available: number;
  utilization: number;
}

interface CityPerformance {
  city: string;
  totalLockers: number;
  totalCompartments: number;
  utilization: number;
  avgUptime: number;
  dailyTransactions: number;
  revenue: number;
  failedRate: number;
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
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
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
  const rand = seededRandom(164164);
  const ri = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
  const rf = (min: number, max: number) => rand() * (max - min) + min;
  const pick = <T,>(arr: T[]): T => arr[ri(0, arr.length - 1)];

  const allSizes: LockerSize[] = ["small", "medium", "large", "extra_large"];
  const allLockerStatuses: LockerStatus[] = ["available", "occupied", "maintenance", "reserved", "out_of_service"];
  const allKioskTypes: KioskType[] = ["self_pickup", "self_dropoff", "hybrid", "returns", "payment"];
  const allKioskStatuses: KioskStatus[] = ["online", "offline", "maintenance", "updating"];
  const allTxnStatuses: TransactionStatus[] = ["in_progress", "completed", "expired", "failed", "picked_up", "dropped_off"];
  const allPaymentMethods: PaymentMethod[] = ["upi", "cod", "card", "wallet", "net_banking"];
  const allAccessMethods: AccessMethod[] = ["otp", "qr_code", "app", "nfc", "biometric", "pin"];
  const allSeverities: AlertSeverity[] = ["critical", "warning", "info"];
  const allTxnTypes: ("pickup" | "dropoff" | "return" | "payment")[] = ["pickup", "dropoff", "return", "payment"];

  const cities = [
    { name: "Delhi" }, { name: "Mumbai" }, { name: "Bengaluru" }, { name: "Chennai" },
    { name: "Hyderabad" }, { name: "Pune" }, { name: "Kolkata" }, { name: "Jaipur" },
  ];

  const locations = [
    "Phoenix Mall", "Select Citywalk", "DLF Promenade", "Lakshmi Nagar Metro", "Rajouri Garden Market",
    "Infinity Mall", "Linking Road Hub", "Andheri East Station", "Bandra Kurla Complex", "Powai Plaza",
    "Phoenix Marketcity", "Koramangala 5th Block", "HSR Layout BDA", "Whitefield ITPL", "JP Nagar Junction",
    "Express Avenue", "T Nagar Metro", "Guindy Industrial", "Anna Nagar Tower", "Velachery MRT",
    "Jubilee Hills Checkpost", "HITEC City Metro", "Gachibowli Circle", "Kukatpally Hub", "Madhapur Junction",
    "Koregaon Park", "Viman Nagar Station", "FC Road Plaza", "Hinjewadi IT Park", "Swargate Depot",
    "Salt Lake Sector V", "New Alipore Hub", "Howrah Station East", "Park Street Metro", "Gariahat Crossing",
    "Tonk Road Plaza", "Malviya Nagar Metro", "Vaishali Nagar Hub", "MI Road Central", "Mansarovar Junction",
  ];

  const partners = ["Delhivery", "BlueDart", "DTDC", "Ecom Express", "XpressBees", "Shadowfax", "Ekart", "Amazon Logistics", "India Post", "Stanza Living"];
  const couriers = ["Delhivery", "BlueDart", "DTDC", "Ecom Express", "XpressBees", "Ekart", "Amazon Logistics"];

  const customerNames = [
    "Aarav Sharma", "Priya Patel", "Rahul Kumar", "Sneha Reddy", "Vikram Singh",
    "Ananya Gupta", "Rohan Mehta", "Kavya Nair", "Arjun Das", "Divya Joshi",
    "Aditya Verma", "Pooja Iyer", "Karthik Rajan", "Meera Choudhary", "Suresh Menon",
    "Nisha Agarwal", "Deepak Rao", "Ritu Saxena", "Manoj Tiwari", "Sunita Kumari",
    "Harsh Vardhan", "Lavanya Krishnan", "Nikhil Bansal", "Shreya Pillai", "Gaurav Hegde",
  ];

  const phonePrefixes = ["+91-98", "+91-97", "+91-88", "+91-87", "+91-99", "+91-86", "+91-85", "+91-78"];

  // Generate 25 Smart Lockers
  const lockers: SmartLocker[] = [];
  for (let i = 0; i < 25; i++) {
    const city = cities[i % cities.length];
    const loc = locations[i % locations.length];
    const total = ri(40, 120);
    lockers.push({
      id: `SL-${String(i + 1).padStart(3, "0")}`,
      name: `${loc} Smart Locker`,
      location: loc,
      address: `${loc}, ${city.name}, ${ri(100, 999).toString().padStart(3, "0")}`,
      city: city.name,
      latitude: 28.6 + rf(-0.5, 0.5),
      longitude: 77.2 + rf(-0.5, 0.5),
      totalCompartments: total,
      compartmentsBySize: {
        small: Math.floor(total * rf(0.3, 0.4)),
        medium: Math.floor(total * rf(0.25, 0.35)),
        large: Math.floor(total * rf(0.15, 0.25)),
        extra_large: Math.floor(total * rf(0.05, 0.15)),
      },
      occupancyRate: Math.round(rf(0.25, 0.85) * 100),
      temperature: Number(rf(18, 26).toFixed(1)),
      hasPowerBackup: rand() > 0.2,
      hasCamera: rand() > 0.15,
      hasWifi: rand() > 0.1,
      status: pick(allLockerStatuses.filter(s => s !== "out_of_service")),
      lastMaintenance: `2026-${String(ri(1, 6)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      nextMaintenance: `2026-${String(ri(7, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      partner: pick(partners),
    });
  }

  // Generate compartments for first 10 lockers
  const compartments: Compartment[] = [];
  for (let li = 0; li < 10; li++) {
    const locker = lockers[li];
    let slotIdx = 0;
    for (const size of allSizes) {
      const count = locker.compartmentsBySize[size];
      for (let s = 0; s < Math.min(count, 5); s++) {
        slotIdx++;
        const isOcc = rand() < (locker.occupancyRate / 100);
        const weightLimits: Record<string, number> = { small: 5, medium: 15, large: 30, extra_large: 50 };
        const wLimit = weightLimits[size];
        const expiryHrs = isOcc ? ri(6, 72) : 0;
        const hoursAgo = isOcc ? ri(1, 48) : 0;
        const cDate = new Date();
        if (hoursAgo > 0) cDate.setHours(cDate.getHours() - hoursAgo);
        const expDate = new Date(cDate);
        if (expiryHrs > 0) expDate.setHours(expDate.getHours() + expiryHrs);
        compartments.push({
          id: `CMP-${locker.id}-${String(slotIdx).padStart(3, "0")}`,
          lockerId: locker.id,
          lockerName: locker.name,
          slotNumber: `${size.charAt(0).toUpperCase()}-${String(slotIdx).padStart(3, "0")}`,
          size,
          status: isOcc ? "occupied" : (rand() < 0.05 ? "maintenance" : (rand() < 0.08 ? "reserved" : "available")),
          currentOccupant: isOcc ? pick(couriers) : null,
          customerName: isOcc ? pick(customerNames) : null,
          orderId: isOcc ? `ORD-${ri(100000, 999999)}` : null,
          awb: isOcc ? `AWB${ri(1000000000, 9999999999)}` : null,
          depositedAt: isOcc ? cDate.toISOString() : null,
          accessCode: isOcc ? String(ri(100000, 999999)) : null,
          accessMethod: pick(allAccessMethods),
          temperature: Number(rf(18, 26).toFixed(1)),
          weight: isOcc ? Number(rf(0.5, wLimit * 0.9).toFixed(1)) : 0,
          weightLimit: wLimit,
          expiryTime: isOcc ? expDate.toISOString() : null,
          notificationsSent: isOcc ? ri(0, 5) : 0,
        });
      }
    }
  }

  // Generate 15 kiosks
  const kiosks: Kiosk[] = [];
  for (let i = 0; i < 15; i++) {
    const city = cities[i % cities.length];
    const loc = locations[(i + 10) % locations.length];
    kiosks.push({
      id: `KSK-${String(i + 1).padStart(3, "0")}`,
      name: `${loc} Kiosk`,
      location: loc,
      city: city.name,
      type: pick(allKioskTypes),
      status: rand() > 0.1 ? "online" : pick(allKioskStatuses.slice(1)),
      totalTransactions: ri(5000, 50000),
      todayTransactions: ri(20, 350),
      avgProcessingTime: ri(15, 90),
      uptime: rf(0.88, 0.995).toFixed(3),
      lastPing: new Date(Date.now() - ri(0, 300000)).toISOString(),
      hasScanner: rand() > 0.15,
      hasPrinter: rand() > 0.2,
      hasScale: rand() > 0.3,
      hasPaymentTerminal: rand() > 0.25,
      screenSize: pick(['10"', '15"', '21"']),
      osVersion: pick(["Android 12", "Android 13", "Ubuntu 22.04", "Windows 11 IoT"]),
      partner: pick(partners),
    });
  }

  // Generate 500 transactions
  const transactions: Transaction[] = [];
  for (let i = 0; i < 500; i++) {
    const locker = pick(lockers);
    const kiosk = pick(kiosks);
    const comp = compartments.length > 0 ? pick(compartments) : null;
    const txnType = pick(allTxnTypes);
    let status: TransactionStatus;
    if (txnType === "pickup") status = pick(["completed", "in_progress", "expired", "failed", "picked_up"] as TransactionStatus[]);
    else if (txnType === "dropoff") status = pick(["completed", "in_progress", "dropped_off"] as TransactionStatus[]);
    else if (txnType === "return") status = pick(["completed", "in_progress", "failed"] as TransactionStatus[]);
    else status = pick(["completed", "in_progress", "failed"] as TransactionStatus[]);
    const hrsAgo = status === "in_progress" ? ri(0, 24) : ri(24, 720);
    const createdDate = new Date(Date.now() - hrsAgo * 3600000);
    const isCompleted = ["completed", "picked_up", "dropped_off"].includes(status);
    const compDate = isCompleted ? new Date(createdDate.getTime() + ri(1, 48) * 3600000) : null;
    const expiryDate = !isCompleted ? new Date(createdDate.getTime() + ri(24, 96) * 3600000) : null;

    transactions.push({
      id: `TXN-${String(i + 1).padStart(5, "0")}`,
      type: txnType,
      status,
      lockerId: locker.id,
      lockerName: locker.name,
      kioskId: kiosk.id,
      kioskName: kiosk.name,
      compartmentId: comp ? comp.id : `CMP-${locker.id}-001`,
      customerName: pick(customerNames),
      customerPhone: `${pick(phonePrefixes)}${ri(10000000, 99999999)}`,
      orderId: `ORD-${ri(100000, 999999)}`,
      awb: `AWB${ri(1000000000, 9999999999)}`,
      courierPartner: pick(couriers),
      accessMethod: pick(allAccessMethods),
      paymentMethod: txnType === "payment" ? pick(allPaymentMethods) : (rand() > 0.7 ? pick(allPaymentMethods) : null),
      amountINR: txnType === "payment" ? ri(50, 5000) : (rand() > 0.8 ? ri(10, 200) : null),
      compartmentSize: comp ? comp.size : pick(allSizes),
      createdAt: createdDate.toISOString(),
      completedAt: compDate ? compDate.toISOString() : null,
      expiryTime: expiryDate ? expiryDate.toISOString() : null,
      notificationCount: ri(0, 5),
      city: locker.city,
    });
  }

  // Hourly usage trends
  const hourlyTrends: UsageTrend[] = [];
  for (let h = 0; h < 24; h++) {
    const base = h >= 9 && h <= 21 ? ri(20, 80) : ri(5, 25);
    hourlyTrends.push({
      hour: `${String(h).padStart(2, "0")}:00`,
      pickups: Math.floor(base * rf(0.4, 0.6)),
      dropoffs: Math.floor(base * rf(0.3, 0.5)),
      returns: Math.floor(base * rf(0.1, 0.2)),
      total: base,
    });
  }

  // Daily trends
  const dailyTrends: DailyTrend[] = [];
  for (let d = 0; d < 30; d++) {
    const isWeekend = d % 7 >= 5;
    const base = isWeekend ? ri(200, 400) : ri(300, 600);
    dailyTrends.push({
      day: `Day ${d + 1}`,
      transactions: base,
      pickups: Math.floor(base * rf(0.4, 0.55)),
      dropoffs: Math.floor(base * rf(0.3, 0.45)),
      revenue: base * ri(15, 45),
      utilization: Math.round(rf(55, 92)),
    });
  }

  // Size distribution
  const sizeDistributions: SizeDistribution[] = allSizes.map(size => {
    const total = lockers.reduce((s, l) => s + l.compartmentsBySize[size], 0);
    const occ = Math.floor(total * rf(0.3, 0.8));
    return { size: size.replace("_", " "), count: total, occupied: occ, available: total - occ, utilization: Math.round((occ / total) * 100) };
  });

  // City performance
  const cityPerformances: CityPerformance[] = cities.map(c => {
    const cityLockers = lockers.filter(l => l.city === c.name);
    const totalComps = cityLockers.reduce((s, l) => s + l.totalCompartments, 0);
    return {
      city: c.name,
      totalLockers: cityLockers.length,
      totalCompartments: totalComps,
      utilization: Math.round(rf(50, 88)),
      avgUptime: Number(rf(0.92, 0.995).toFixed(3)),
      dailyTransactions: ri(150, 600),
      revenue: ri(50000, 300000),
      failedRate: Number(rf(0.02, 0.08).toFixed(3)),
    };
  });

  // Alerts
  const alerts: LockerAlert[] = [];
  const alertTypes = [
    { sev: "critical" as AlertSeverity, type: "Hardware Fault", msg: "Compartment door sensor malfunction detected" },
    { sev: "critical" as AlertSeverity, type: "Temperature Alert", msg: "Locker temperature exceeding 30\u00b0C threshold" },
    { sev: "warning" as AlertSeverity, type: "Low Battery", msg: "UPS battery below 20% - power backup at risk" },
    { sev: "warning" as AlertSeverity, type: "High Occupancy", msg: "Occupancy rate above 90% - overflow risk" },
    { sev: "warning" as AlertSeverity, type: "Network Issue", msg: "Intermittent connectivity - 3 failed pings in last hour" },
    { sev: "info" as AlertSeverity, type: "Maintenance Due", msg: "Scheduled maintenance overdue by 2 days" },
    { sev: "info" as AlertSeverity, type: "Firmware Update", msg: "Kiosk firmware v4.2.1 available for deployment" },
    { sev: "critical" as AlertSeverity, type: "Security Alert", msg: "Multiple failed access attempts detected on compartment" },
    { sev: "warning" as AlertSeverity, type: "Expiry Warning", msg: "5 parcels approaching expiry within next 2 hours" },
    { sev: "info" as AlertSeverity, type: "Usage Spike", msg: "Transaction volume 40% above daily average" },
  ];
  for (let i = 0; i < 10; i++) {
    const at = alertTypes[i];
    alerts.push({
      id: `ALT-${String(i + 1).padStart(3, "0")}`,
      severity: at.sev,
      type: at.type,
      message: at.msg,
      lockerName: pick(lockers).name,
      kioskName: rand() > 0.5 ? pick(kiosks).name : null,
      timestamp: new Date(Date.now() - ri(0, 3600000 * ri(1, 24))).toISOString(),
      acknowledged: rand() > 0.6,
    });
  }

  return {
    lockers, compartments, kiosks, transactions,
    hourlyTrends, dailyTrends, sizeDistributions, cityPerformances,
    alerts, allSizes, allLockerStatuses, allKioskTypes, allKioskStatuses,
    allTxnStatuses, allPaymentMethods, allAccessMethods, allSeverities,
    allTxnTypes, cities, partners, couriers, customerNames,
  };
}

// ============================================================================
// Constants
// ============================================================================
const COLORS = {
  indigo: "#6366f1", amber: "#f59e0b", cyan: "#06b6d4", emerald: "#10b981",
  rose: "#f43f5e", violet: "#8b5cf6", slate: "#64748b", sky: "#0ea5e9",
  orange: "#f97316", teal: "#14b8a6",
};

const PIE_COLORS = [COLORS.indigo, COLORS.amber, COLORS.cyan, COLORS.emerald, COLORS.rose, COLORS.violet, COLORS.sky, COLORS.orange];

const SIZE_COLORS: Record<string, string> = {
  small: "#06b6d4", medium: "#6366f1", large: "#f59e0b", extra_large: "#f43f5e",
};

const SIZE_LABELS: Record<string, string> = {
  small: "S", medium: "M", large: "L", extra_large: "XL",
};

const STATUS_COLORS: Record<string, string> = {
  available: "#10b981", occupied: "#6366f1", maintenance: "#f59e0b", reserved: "#06b6d4",
  out_of_service: "#ef4444", online: "#10b981", offline: "#ef4444", updating: "#f59e0b",
  in_progress: "#6366f1", completed: "#10b981", expired: "#ef4444", failed: "#f43f5e",
  picked_up: "#10b981", dropped_off: "#06b6d4",
};

const SEVERITY_COLORS: Record<string, string> = { critical: "#ef4444", warning: "#f59e0b", info: "#06b6d4" };

const KIOSK_TYPE_LABELS: Record<string, string> = {
  self_pickup: "Self Pickup", self_dropoff: "Self Drop-off", hybrid: "Hybrid",
  returns: "Returns Only", payment: "Payment Kiosk",
};

const ACCESS_METHOD_LABELS: Record<string, string> = {
  otp: "OTP", qr_code: "QR Code", app: "Mobile App", nfc: "NFC Tap", biometric: "Biometric", pin: "PIN Code",
};

const TXN_TYPE_LABELS: Record<string, string> = { pickup: "Pickup", dropoff: "Drop-off", return: "Return", payment: "Payment" };

const PAYMENT_LABELS: Record<string, string> = { upi: "UPI", cod: "COD", card: "Card", wallet: "Wallet", net_banking: "Net Banking" };

// ============================================================================
// Main Component
// ============================================================================
export default function SmartLockerKioskView() {
  const data = useMemo(() => generateData(), []);

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Dashboard", "Locker Network", "Kiosk Fleet", "Transactions", "Alerts & Monitoring"];

  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [lockerStatusFilter, setLockerStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"name" | "occupancy" | "totalCompartments" | "city">("occupancy");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [kioskTypeFilter, setKioskTypeFilter] = useState("all");
  const [kioskStatusFilter, setKioskStatusFilter] = useState("all");
  const [txnTypeFilter, setTxnTypeFilter] = useState("all");
  const [txnStatusFilter, setTxnStatusFilter] = useState("all");
  const [txnPage, setTxnPage] = useState(1);
  const txnPageSize = 35;
  const [selectedCompartment, setSelectedCompartment] = useState<Compartment | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [selectedLocker, setSelectedLocker] = useState<SmartLocker | null>(null);

  // --- Computed ---
  const filteredLockers = useMemo(() => {
    let result = [...data.lockers];
    if (cityFilter !== "all") result = result.filter(l => l.city === cityFilter);
    if (lockerStatusFilter !== "all") result = result.filter(l => l.status === lockerStatusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.address.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "occupancy") cmp = a.occupancyRate - b.occupancyRate;
      else if (sortField === "totalCompartments") cmp = a.totalCompartments - b.totalCompartments;
      else cmp = a.city.localeCompare(b.city);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return result;
  }, [data.lockers, cityFilter, lockerStatusFilter, searchQuery, sortField, sortDir]);

  const filteredKiosks = useMemo(() => {
    let result = [...data.kiosks];
    if (kioskTypeFilter !== "all") result = result.filter(k => k.type === kioskTypeFilter);
    if (kioskStatusFilter !== "all") result = result.filter(k => k.status === kioskStatusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(k => k.name.toLowerCase().includes(q) || k.id.toLowerCase().includes(q) || k.city.toLowerCase().includes(q));
    }
    return result;
  }, [data.kiosks, kioskTypeFilter, kioskStatusFilter, searchQuery]);

  const filteredTransactions = useMemo(() => {
    let result = [...data.transactions];
    if (txnTypeFilter !== "all") result = result.filter(t => t.type === txnTypeFilter);
    if (txnStatusFilter !== "all") result = result.filter(t => t.status === txnStatusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.id.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q) || t.orderId.toLowerCase().includes(q) || t.awb.toLowerCase().includes(q) || t.courierPartner.toLowerCase().includes(q) || t.lockerName.toLowerCase().includes(q));
    }
    return result;
  }, [data.transactions, txnTypeFilter, txnStatusFilter, searchQuery]);

  const paginatedTransactions = useMemo(() => {
    const start = (txnPage - 1) * txnPageSize;
    return filteredTransactions.slice(start, start + txnPageSize);
  }, [filteredTransactions, txnPage]);

  const txnTotalPages = Math.ceil(filteredTransactions.length / txnPageSize);

  const selectedLockerCompartments = useMemo(() => {
    if (!selectedLocker) return [];
    return data.compartments.filter(c => c.lockerId === selectedLocker.id);
  }, [data.compartments, selectedLocker]);

  // KPIs
  const totalCompartments = data.lockers.reduce((s, l) => s + l.totalCompartments, 0);
  const avgOccupancy = Math.round(data.lockers.reduce((s, l) => s + l.occupancyRate, 0) / data.lockers.length);
  const totalOccupied = Math.round(totalCompartments * avgOccupancy / 100);
  const activeKiosks = data.kiosks.filter(k => k.status === "online").length;
  const todayTxns = data.transactions.filter(t => (Date.now() - new Date(t.createdAt).getTime()) < 86400000).length;
  const totalRevenue = data.dailyTrends.reduce((s, d) => s + d.revenue, 0);
  const failedRate = ((data.transactions.filter(t => ["expired", "failed"].includes(t.status)).length / data.transactions.length) * 100).toFixed(1);

  // ============================================================================
  // Tab 0: Dashboard
  // ============================================================================
  const renderDashboardTab = () => {
    const kpis = [
      { label: "Total Compartments", value: formatNum(totalCompartments), change: "+12%", up: true, icon: <Grid3X3 size={18} />, color: COLORS.indigo },
      { label: "Occupied Slots", value: formatNum(totalOccupied), change: `${avgOccupancy}% util`, up: true, icon: <LockKeyhole size={18} />, color: COLORS.amber },
      { label: "Active Kiosks", value: `${activeKiosks}/${data.kiosks.length}`, change: "+3 this week", up: true, icon: <Monitor size={18} />, color: COLORS.cyan },
      { label: "Today's Transactions", value: formatNum(todayTxns), change: "+8.3%", up: true, icon: <Activity size={18} />, color: COLORS.emerald },
      { label: "Monthly Revenue", value: formatINR(totalRevenue), change: "+15.2%", up: true, icon: <IndianRupee size={18} />, color: COLORS.violet },
      { label: "Failure Rate", value: `${failedRate}%`, change: "-1.2%", up: false, icon: <XCircle size={18} />, color: COLORS.rose },
    ];

    return (
      <div className="slk-dashboard">
        <div className="slk-kpi-row">
          {kpis.map((kpi, i) => (
            <div key={i} className="slk-kpi-card">
              <div className="slk-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
              <div className="slk-kpi-content">
                <div className="slk-kpi-label">{kpi.label}</div>
                <div className="slk-kpi-value">{kpi.value}</div>
                <div className={`slk-kpi-change ${kpi.up ? "slk-up" : "slk-down"}`}>
                  {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  <span>{kpi.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="slk-chart-row">
          <div className="slk-chart-card slk-chart-wide">
            <div className="slk-chart-title">Hourly Transaction Volume (24h)</div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.hourlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="pickups" stackId="a" fill={COLORS.indigo} stroke={COLORS.indigo} fillOpacity={0.6} name="Pickups" />
                <Area type="monotone" dataKey="dropoffs" stackId="a" fill={COLORS.cyan} stroke={COLORS.cyan} fillOpacity={0.6} name="Drop-offs" />
                <Area type="monotone" dataKey="returns" stackId="a" fill={COLORS.amber} stroke={COLORS.amber} fillOpacity={0.6} name="Returns" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="slk-chart-card">
            <div className="slk-chart-title">Compartment Size Distribution</div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.sizeDistributions} dataKey="count" nameKey="size" cx="50%" cy="50%" outerRadius={85} innerRadius={50}
                  label={({ size, percent }) => `${size} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                  {data.sizeDistributions.map((_: unknown, i: number) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="slk-chart-row">
          <div className="slk-chart-card">
            <div className="slk-chart-title">30-Day Transaction Trend</div>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={data.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="transactions" fill={COLORS.indigo} name="Transactions" radius={[3, 3, 0, 0]} barSize={16} />
                <Line type="monotone" dataKey="utilization" stroke={COLORS.amber} name="Utilization %" dot={false} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="slk-chart-card slk-chart-wide">
            <div className="slk-chart-title">City Performance Comparison</div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={data.cityPerformances}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="city" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} />
                <Radar name="Utilization %" dataKey="utilization" stroke={COLORS.indigo} fill={COLORS.indigo} fillOpacity={0.2} />
                <Radar name="Uptime %" dataKey={(d: CityPerformance) => Math.round(d.avgUptime * 100)} stroke={COLORS.emerald} fill={COLORS.emerald} fillOpacity={0.15} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="slk-chart-row">
          <div className="slk-chart-card">
            <div className="slk-chart-title">Revenue by City</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.cityPerformances} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v: number) => formatINR(v)} />
                <YAxis type="category" dataKey="city" tick={{ fontSize: 10 }} width={70} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="revenue" fill={COLORS.violet} name="Revenue" radius={[0, 3, 3, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="slk-chart-card">
            <div className="slk-chart-title">Size Utilization Breakdown</div>
            <div className="slk-size-bars">
              {data.sizeDistributions.map((sd, i) => (
                <div key={i} className="slk-size-bar-item">
                  <div className="slk-size-bar-label">
                    <span className="slk-size-dot" style={{ background: SIZE_COLORS[sd.size] || PIE_COLORS[i] }}></span>
                    <span>{sd.size}</span>
                    <span className="slk-size-bar-stats">{sd.occupied}/{sd.count}</span>
                  </div>
                  <div className="slk-size-bar-track">
                    <div className="slk-size-bar-fill" style={{ width: `${sd.utilization}%`, background: SIZE_COLORS[sd.size] || PIE_COLORS[i] }}></div>
                  </div>
                  <div className="slk-size-bar-pct">{sd.utilization}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="slk-chart-card">
            <div className="slk-chart-title">Live Alerts</div>
            <div className="slk-alert-list-mini">
              {data.alerts.slice(0, 6).map((alert, i) => (
                <div key={i} className={`slk-alert-mini-item slk-${alert.severity}`}>
                  <div className="slk-alert-mini-icon">
                    {alert.severity === "critical" ? <AlertTriangle size={14} /> : alert.severity === "warning" ? <Bell size={14} /> : <CircleDot size={14} />}
                  </div>
                  <div className="slk-alert-mini-content">
                    <div className="slk-alert-mini-type">{alert.type}</div>
                    <div className="slk-alert-mini-msg">{alert.message}</div>
                  </div>
                  <div className={`slk-alert-mini-badge ${alert.acknowledged ? "slk-ack" : "slk-pending"}`}>
                    {alert.acknowledged ? "ACK" : "NEW"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // Tab 1: Locker Network
  // ============================================================================
  const renderLockerTab = () => (
    <div className="slk-locker-tab">
      <div className="slk-filter-row">
        <div className="slk-filter-pills">
          <button className={`slk-pill ${cityFilter === "all" ? "slk-pill-active" : ""}`} onClick={() => setCityFilter("all")}>All Cities</button>
          {data.cities.map(c => (
            <button key={c.name} className={`slk-pill ${cityFilter === c.name ? "slk-pill-active" : ""}`} onClick={() => setCityFilter(c.name)}>{c.name}</button>
          ))}
        </div>
        <div className="slk-filter-pills">
          <button className={`slk-pill ${lockerStatusFilter === "all" ? "slk-pill-active" : ""}`} onClick={() => setLockerStatusFilter("all")}>All Status</button>
          {data.allLockerStatuses.map(s => (
            <button key={s} className={`slk-pill ${lockerStatusFilter === s ? "slk-pill-active" : ""}`} onClick={() => setLockerStatusFilter(s)}>{s.replace(/_/g, " ")}</button>
          ))}
        </div>
      </div>

      <div className="slk-sort-bar">
        <span className="slk-sort-label">Sort by:</span>
        {(["name", "occupancy", "totalCompartments", "city"] as const).map(f => (
          <button key={f} className={`slk-sort-btn ${sortField === f ? "slk-sort-active" : ""}`} onClick={() => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("desc"); } }}>
            {f.replace(/([A-Z])/g, " $1").trim()} {sortField === f && (sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />)}
          </button>
        ))}
        <span className="slk-count-badge">{filteredLockers.length} lockers</span>
      </div>

      <div className="slk-locker-grid">
        {filteredLockers.map(locker => (
          <div key={locker.id} className={`slk-locker-card ${locker.occupancyRate > 85 ? "slk-high-occ" : ""}`} onClick={() => setSelectedLocker(locker)}>
            <div className="slk-locker-card-header">
              <div className="slk-locker-card-title">
                <LockKeyhole size={16} className="slk-locker-icon" />
                <div>
                  <div className="slk-locker-name">{locker.name}</div>
                  <div className="slk-locker-id">{locker.id} &middot; {locker.city}</div>
                </div>
              </div>
              <span className="slk-status-badge" style={{ background: `${STATUS_COLORS[locker.status]}20`, color: STATUS_COLORS[locker.status] }}>{locker.status.replace(/_/g, " ")}</span>
            </div>
            <div className="slk-locker-card-stats">
              <div className="slk-locker-stat">
                <span className="slk-locker-stat-label">Compartments</span>
                <span className="slk-locker-stat-value">{locker.totalCompartments}</span>
                <div className="slk-mini-size-row">
                  {(["small", "medium", "large", "extra_large"] as LockerSize[]).map(sz => (
                    <span key={sz} className="slk-mini-size" style={{ color: SIZE_COLORS[sz] }}>{SIZE_LABELS[sz]}:{locker.compartmentsBySize[sz]}</span>
                  ))}
                </div>
              </div>
              <div className="slk-locker-stat">
                <span className="slk-locker-stat-label">Occupancy</span>
                <span className="slk-locker-stat-value" style={{ color: locker.occupancyRate > 85 ? COLORS.rose : locker.occupancyRate > 65 ? COLORS.amber : COLORS.emerald }}>{locker.occupancyRate}%</span>
                <div className="slk-occ-bar">
                  <div className="slk-occ-bar-fill" style={{ width: `${locker.occupancyRate}%`, background: locker.occupancyRate > 85 ? COLORS.rose : locker.occupancyRate > 65 ? COLORS.amber : COLORS.emerald }}></div>
                </div>
              </div>
              <div className="slk-locker-stat">
                <span className="slk-locker-stat-label">Temp</span>
                <span className="slk-locker-stat-value">{locker.temperature}&deg;C</span>
              </div>
            </div>
            <div className="slk-locker-card-features">
              {locker.hasPowerBackup && <span className="slk-feature-tag"><Zap size={11} /> UPS</span>}
              {locker.hasCamera && <span className="slk-feature-tag"><Camera size={11} /> CCTV</span>}
              {locker.hasWifi && <span className="slk-feature-tag"><Wifi size={11} /> WiFi</span>}
            </div>
            <div className="slk-locker-card-footer">
              <span className="slk-partner-tag">{locker.partner}</span>
              <span className="slk-maint-label">Next: {locker.nextMaintenance}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedLocker && (
        <div className="slk-drawer-overlay" onClick={() => setSelectedLocker(null)}>
          <div className="slk-drawer" onClick={e => e.stopPropagation()}>
            <div className="slk-drawer-header" style={{ background: selectedLocker.occupancyRate > 85 ? `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.amber})` : `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.cyan})` }}>
              <div className="slk-drawer-title-row">
                <LockKeyhole size={20} />
                <div>
                  <div className="slk-drawer-title">{selectedLocker.name}</div>
                  <div className="slk-drawer-subtitle">{selectedLocker.id} &middot; {selectedLocker.address}</div>
                </div>
                <button className="slk-drawer-close" onClick={() => setSelectedLocker(null)}><ChevronLeft size={20} /></button>
              </div>
            </div>
            <div className="slk-drawer-body">
              <div className="slk-drawer-info-grid">
                <div className="slk-drawer-field"><span className="slk-drawer-label">City</span><span className="slk-drawer-value">{selectedLocker.city}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Status</span><span className="slk-drawer-value"><span className="slk-status-dot" style={{ background: STATUS_COLORS[selectedLocker.status] }}></span>{selectedLocker.status.replace(/_/g, " ")}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Total Compartments</span><span className="slk-drawer-value">{selectedLocker.totalCompartments}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Occupancy</span><span className="slk-drawer-value" style={{ color: selectedLocker.occupancyRate > 85 ? COLORS.rose : COLORS.emerald }}>{selectedLocker.occupancyRate}%</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Temperature</span><span className="slk-drawer-value">{selectedLocker.temperature}&deg;C</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Partner</span><span className="slk-drawer-value">{selectedLocker.partner}</span></div>
              </div>

              <div className="slk-drawer-section-title">Compartment Size Breakdown</div>
              <div className="slk-drawer-size-grid">
                {(["small", "medium", "large", "extra_large"] as LockerSize[]).map(sz => (
                  <div key={sz} className="slk-drawer-size-card" style={{ borderLeftColor: SIZE_COLORS[sz] }}>
                    <div className="slk-drawer-size-label">{sz.replace("_", " ")}</div>
                    <div className="slk-drawer-size-count">{selectedLocker.compartmentsBySize[sz]}</div>
                  </div>
                ))}
              </div>

              <div className="slk-drawer-section-title">Features &amp; Hardware</div>
              <div className="slk-drawer-features">
                <div className={`slk-drawer-feature ${selectedLocker.hasPowerBackup ? "slk-enabled" : "slk-disabled"}`}><Zap size={14} /><span>Power Backup</span></div>
                <div className={`slk-drawer-feature ${selectedLocker.hasCamera ? "slk-enabled" : "slk-disabled"}`}><Camera size={14} /><span>Camera</span></div>
                <div className={`slk-drawer-feature ${selectedLocker.hasWifi ? "slk-enabled" : "slk-disabled"}`}><Wifi size={14} /><span>WiFi</span></div>
              </div>

              <div className="slk-drawer-section-title">Maintenance</div>
              <div className="slk-drawer-timeline">
                <div className="slk-timeline-item"><div className="slk-timeline-dot slk-done"></div><div><div className="slk-timeline-label">Last Maintenance</div><div className="slk-timeline-date">{selectedLocker.lastMaintenance}</div></div></div>
                <div className="slk-timeline-item"><div className="slk-timeline-dot slk-pending"></div><div><div className="slk-timeline-label">Next Scheduled</div><div className="slk-timeline-date">{selectedLocker.nextMaintenance}</div></div></div>
              </div>

              {selectedLockerCompartments.length > 0 && (
                <>
                  <div className="slk-drawer-section-title">Compartments ({selectedLockerCompartments.length})</div>
                  <div className="slk-compartment-mini-grid">
                    {selectedLockerCompartments.map(comp => (
                      <div key={comp.id} className={`slk-comp-mini slk-${comp.status}`} onClick={() => { setSelectedLocker(null); setSelectedCompartment(comp); }}>
                        <div className="slk-comp-mini-size" style={{ color: SIZE_COLORS[comp.size] }}>{SIZE_LABELS[comp.size]}</div>
                        <div className="slk-comp-mini-slot">{comp.slotNumber}</div>
                        <div className="slk-comp-mini-status">{comp.status.replace(/_/g, " ")}</div>
                        {comp.customerName && <div className="slk-comp-mini-customer">{comp.customerName}</div>}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="slk-drawer-actions">
                <button className="slk-action-btn slk-primary"><Eye size={14} /> View Map</button>
                <button className="slk-action-btn"><Download size={14} /> Export</button>
                <button className="slk-action-btn"><RefreshCw size={14} /> Refresh</button>
                <button className="slk-action-btn"><Settings size={14} /> Configure</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // Tab 2: Kiosk Fleet
  // ============================================================================
  const renderKioskTab = () => {
    const onlineCount = data.kiosks.filter(k => k.status === "online").length;
    const offlineCount = data.kiosks.filter(k => k.status === "offline").length;
    const maintCount = data.kiosks.filter(k => k.status === "maintenance" || k.status === "updating").length;
    const avgUptime = (data.kiosks.reduce((s, k) => s + parseFloat(k.uptime), 0) / data.kiosks.length * 100).toFixed(1);
    const totalDaily = data.kiosks.reduce((s, k) => s + k.todayTransactions, 0);
    const avgProcessing = Math.round(data.kiosks.reduce((s, k) => s + k.avgProcessingTime, 0) / data.kiosks.length);

    const kioskKpis = [
      { label: "Online Kiosks", value: `${onlineCount}/${data.kiosks.length}`, icon: <Monitor size={16} />, color: COLORS.emerald },
      { label: "Offline", value: `${offlineCount}`, icon: <Monitor size={16} />, color: COLORS.rose },
      { label: "Maintenance", value: `${maintCount}`, icon: <Settings size={16} />, color: COLORS.amber },
      { label: "Avg Uptime", value: `${avgUptime}%`, icon: <Activity size={16} />, color: COLORS.indigo },
      { label: "Daily Transactions", value: formatNum(totalDaily), icon: <Activity size={16} />, color: COLORS.cyan },
      { label: "Avg Process Time", value: `${avgProcessing}s`, icon: <Timer size={16} />, color: COLORS.violet },
    ];

    return (
      <div className="slk-kiosk-tab">
        <div className="slk-kpi-row slk-kpi-sm">
          {kioskKpis.map((kpi, i) => (
            <div key={i} className="slk-kpi-card-sm">
              <div className="slk-kpi-icon-sm" style={{ background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
              <div><div className="slk-kpi-label-sm">{kpi.label}</div><div className="slk-kpi-value-sm">{kpi.value}</div></div>
            </div>
          ))}
        </div>

        <div className="slk-filter-row">
          <div className="slk-filter-pills">
            <button className={`slk-pill ${kioskTypeFilter === "all" ? "slk-pill-active" : ""}`} onClick={() => setKioskTypeFilter("all")}>All Types</button>
            {data.allKioskTypes.map(t => (
              <button key={t} className={`slk-pill ${kioskTypeFilter === t ? "slk-pill-active" : ""}`} onClick={() => setKioskTypeFilter(t)}>{KIOSK_TYPE_LABELS[t]}</button>
            ))}
          </div>
          <div className="slk-filter-pills">
            <button className={`slk-pill ${kioskStatusFilter === "all" ? "slk-pill-active" : ""}`} onClick={() => setKioskStatusFilter("all")}>All Status</button>
            {data.allKioskStatuses.map(s => (
              <button key={s} className={`slk-pill ${kioskStatusFilter === s ? "slk-pill-active" : ""}`} onClick={() => setKioskStatusFilter(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="slk-count-badge" style={{ marginBottom: 8 }}>{filteredKiosks.length} kiosks</div>

        <div className="slk-kiosk-grid">
          {filteredKiosks.map(kiosk => {
            const KioskIcon = kiosk.type === "self_pickup" ? PackageCheck : kiosk.type === "self_dropoff" ? Package : kiosk.type === "hybrid" ? Layers : kiosk.type === "returns" ? ArrowRight : CreditCard;
            const uptimePct = parseFloat(kiosk.uptime) * 100;
            return (
              <div key={kiosk.id} className={`slk-kiosk-card slk-${kiosk.status}`}>
                <div className="slk-kiosk-card-header">
                  <div className="slk-kiosk-icon-wrap" style={{ background: `${STATUS_COLORS[kiosk.status]}15`, color: STATUS_COLORS[kiosk.status] }}>
                    <KioskIcon size={20} />
                  </div>
                  <div className="slk-kiosk-card-title-area">
                    <div className="slk-kiosk-name">{kiosk.name}</div>
                    <div className="slk-kiosk-meta">{kiosk.id} &middot; {kiosk.city} &middot; {KIOSK_TYPE_LABELS[kiosk.type]}</div>
                  </div>
                  <span className="slk-status-badge" style={{ background: `${STATUS_COLORS[kiosk.status]}20`, color: STATUS_COLORS[kiosk.status] }}>{kiosk.status}</span>
                </div>
                <div className="slk-kiosk-stats-grid">
                  <div className="slk-kiosk-stat">
                    <span className="slk-kiosk-stat-label">Today</span>
                    <span className="slk-kiosk-stat-value">{kiosk.todayTransactions}</span>
                  </div>
                  <div className="slk-kiosk-stat">
                    <span className="slk-kiosk-stat-label">Total</span>
                    <span className="slk-kiosk-stat-value">{formatNum(kiosk.totalTransactions)}</span>
                  </div>
                  <div className="slk-kiosk-stat">
                    <span className="slk-kiosk-stat-label">Avg Time</span>
                    <span className="slk-kiosk-stat-value">{kiosk.avgProcessingTime}s</span>
                  </div>
                  <div className="slk-kiosk-stat">
                    <span className="slk-kiosk-stat-label">Uptime</span>
                    <span className="slk-kiosk-stat-value">{uptimePct.toFixed(1)}%</span>
                    <div className="slk-uptime-bar">
                      <div className="slk-uptime-fill" style={{ width: `${uptimePct}%`, background: uptimePct > 95 ? COLORS.emerald : uptimePct > 85 ? COLORS.amber : COLORS.rose }}></div>
                    </div>
                  </div>
                </div>
                <div className="slk-kiosk-hardware">
                  {kiosk.hasScanner && <span className="slk-hw-tag"><ScanLine size={11} /> Scanner</span>}
                  {kiosk.hasPrinter && <span className="slk-hw-tag"><Receipt size={11} /> Printer</span>}
                  {kiosk.hasScale && <span className="slk-hw-tag"><Gauge size={11} /> Scale</span>}
                  {kiosk.hasPaymentTerminal && <span className="slk-hw-tag"><CreditCard size={11} /> Payment</span>}
                </div>
                <div className="slk-kiosk-footer">
                  <span className="slk-os-tag">{kiosk.osVersion}</span>
                  <span className="slk-screen-tag">{kiosk.screenSize}</span>
                  <span className="slk-kiosk-partner">{kiosk.partner}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================================================
  // Tab 3: Transactions
  // ============================================================================
  const renderTransactionTab = () => (
    <div className="slk-txn-tab">
      <div className="slk-txn-quick-stats">
        <div className="slk-txn-stat-pill">
          <span className="slk-txn-stat-dot" style={{ background: COLORS.indigo }}></span>
          In Progress: <strong>{data.transactions.filter(t => t.status === "in_progress").length}</strong>
        </div>
        <div className="slk-txn-stat-pill">
          <span className="slk-txn-stat-dot" style={{ background: COLORS.emerald }}></span>
          Completed: <strong>{data.transactions.filter(t => ["completed", "picked_up", "dropped_off"].includes(t.status)).length}</strong>
        </div>
        <div className="slk-txn-stat-pill">
          <span className="slk-txn-stat-dot" style={{ background: COLORS.rose }}></span>
          Failed/Expired: <strong>{data.transactions.filter(t => ["expired", "failed"].includes(t.status)).length}</strong>
        </div>
      </div>

      <div className="slk-filter-row">
        <div className="slk-filter-pills">
          <button className={`slk-pill ${txnTypeFilter === "all" ? "slk-pill-active" : ""}`} onClick={() => { setTxnTypeFilter("all"); setTxnPage(1); }}>All Types</button>
          {data.allTxnTypes.map(t => (
            <button key={t} className={`slk-pill ${txnTypeFilter === t ? "slk-pill-active" : ""}`} onClick={() => { setTxnTypeFilter(t); setTxnPage(1); }}>{TXN_TYPE_LABELS[t]}</button>
          ))}
        </div>
        <div className="slk-filter-pills">
          <button className={`slk-pill ${txnStatusFilter === "all" ? "slk-pill-active" : ""}`} onClick={() => { setTxnStatusFilter("all"); setTxnPage(1); }}>All Status</button>
          {data.allTxnStatuses.map(s => (
            <button key={s} className={`slk-pill ${txnStatusFilter === s ? "slk-pill-active" : ""}`} onClick={() => { setTxnStatusFilter(s); setTxnPage(1); }}>{s.replace(/_/g, " ")}</button>
          ))}
        </div>
      </div>

      <div className="slk-txn-meta-row">
        <span className="slk-count-badge">{filteredTransactions.length} transactions</span>
        <span className="slk-page-info">Page {txnPage} of {txnTotalPages}</span>
      </div>

      <div className="slk-txn-table-wrap">
        <table className="slk-txn-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Courier</th>
              <th>Access</th>
              <th>Size</th>
              <th>Amount</th>
              <th>Locker</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map(txn => {
              const created = new Date(txn.createdAt);
              const timeStr = `${created.getMonth() + 1}/${created.getDate()} ${String(created.getHours()).padStart(2, "0")}:${String(created.getMinutes()).padStart(2, "0")}`;
              const isExpiring = txn.expiryTime && new Date(txn.expiryTime).getTime() - Date.now() < 7200000 && txn.status === "in_progress";
              return (
                <tr key={txn.id} className={isExpiring ? "slk-expiring-row" : ""}>
                  <td className="slk-txn-id">{txn.id.slice(0, 12)}</td>
                  <td><span className="slk-txn-type-badge">{TXN_TYPE_LABELS[txn.type]}</span></td>
                  <td><span className="slk-status-badge" style={{ background: `${STATUS_COLORS[txn.status]}20`, color: STATUS_COLORS[txn.status] }}>{txn.status.replace(/_/g, " ")}</span></td>
                  <td><div className="slk-txn-customer">{txn.customerName}</div><div className="slk-txn-phone">{txn.customerPhone}</div></td>
                  <td>{txn.courierPartner}</td>
                  <td><span className="slk-access-badge">{ACCESS_METHOD_LABELS[txn.accessMethod]}</span></td>
                  <td><span className="slk-size-badge" style={{ color: SIZE_COLORS[txn.compartmentSize] }}>{SIZE_LABELS[txn.compartmentSize]}</span></td>
                  <td>{txn.amountINR ? formatINR(txn.amountINR) : "-"}</td>
                  <td><div className="slk-txn-locker">{txn.lockerName}</div></td>
                  <td>{timeStr}</td>
                  <td><button className="slk-view-btn" onClick={() => setSelectedTxn(txn)}><Eye size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="slk-pagination">
        <button className="slk-page-btn" disabled={txnPage <= 1} onClick={() => setTxnPage(p => p - 1)}><ChevronLeft size={14} /></button>
        {Array.from({ length: Math.min(5, txnTotalPages) }, (_, i) => {
          let pageNum: number;
          if (txnTotalPages <= 5) pageNum = i + 1;
          else if (txnPage <= 3) pageNum = i + 1;
          else if (txnPage >= txnTotalPages - 2) pageNum = txnTotalPages - 4 + i;
          else pageNum = txnPage - 2 + i;
          return (
            <button key={pageNum} className={`slk-page-btn slk-page-num ${txnPage === pageNum ? "slk-page-active" : ""}`} onClick={() => setTxnPage(pageNum)}>{pageNum}</button>
          );
        })}
        {txnTotalPages > 5 && txnPage < txnTotalPages - 2 && <span className="slk-page-dots">...</span>}
        <button className="slk-page-btn" disabled={txnPage >= txnTotalPages} onClick={() => setTxnPage(p => p + 1)}><ChevronRight size={14} /></button>
      </div>

      {selectedTxn && (
        <div className="slk-drawer-overlay" onClick={() => setSelectedTxn(null)}>
          <div className="slk-drawer" onClick={e => e.stopPropagation()}>
            <div className="slk-drawer-header" style={{ background: ["completed", "picked_up", "dropped_off"].includes(selectedTxn.status) ? `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.cyan})` : ["expired", "failed"].includes(selectedTxn.status) ? `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.amber})` : `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.violet})` }}>
              <div className="slk-drawer-title-row">
                <Package size={20} />
                <div>
                  <div className="slk-drawer-title">Transaction {selectedTxn.id}</div>
                  <div className="slk-drawer-subtitle">{TXN_TYPE_LABELS[selectedTxn.type]} &middot; {selectedTxn.status.replace(/_/g, " ")}</div>
                </div>
                <button className="slk-drawer-close" onClick={() => setSelectedTxn(null)}><ChevronLeft size={20} /></button>
              </div>
            </div>
            <div className="slk-drawer-body">
              <div className="slk-drawer-info-grid">
                <div className="slk-drawer-field"><span className="slk-drawer-label">Order ID</span><span className="slk-drawer-value">{selectedTxn.orderId}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">AWB</span><span className="slk-drawer-value">{selectedTxn.awb}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Customer</span><span className="slk-drawer-value">{selectedTxn.customerName}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Phone</span><span className="slk-drawer-value">{selectedTxn.customerPhone}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Courier</span><span className="slk-drawer-value">{selectedTxn.courierPartner}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Access Method</span><span className="slk-drawer-value">{ACCESS_METHOD_LABELS[selectedTxn.accessMethod]}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Compartment</span><span className="slk-drawer-value">{selectedTxn.compartmentSize} &middot; {selectedTxn.compartmentId}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Locker</span><span className="slk-drawer-value">{selectedTxn.lockerName}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Created</span><span className="slk-drawer-value">{new Date(selectedTxn.createdAt).toLocaleString("en-IN")}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Completed</span><span className="slk-drawer-value">{selectedTxn.completedAt ? new Date(selectedTxn.completedAt).toLocaleString("en-IN") : "Pending"}</span></div>
              </div>

              {(selectedTxn.amountINR || selectedTxn.paymentMethod) && (
                <>
                  <div className="slk-drawer-section-title">Payment</div>
                  <div className="slk-drawer-info-grid">
                    {selectedTxn.amountINR && <div className="slk-drawer-field"><span className="slk-drawer-label">Amount</span><span className="slk-drawer-value">{formatINR(selectedTxn.amountINR)}</span></div>}
                    {selectedTxn.paymentMethod && <div className="slk-drawer-field"><span className="slk-drawer-label">Method</span><span className="slk-drawer-value">{PAYMENT_LABELS[selectedTxn.paymentMethod]}</span></div>}
                  </div>
                </>
              )}

              {selectedTxn.expiryTime && (
                <>
                  <div className="slk-drawer-section-title">Expiry</div>
                  <div className="slk-drawer-info-grid">
                    <div className="slk-drawer-field"><span className="slk-drawer-label">Expires At</span><span className="slk-drawer-value">{new Date(selectedTxn.expiryTime).toLocaleString("en-IN")}</span></div>
                    <div className="slk-drawer-field"><span className="slk-drawer-label">Notifications</span><span className="slk-drawer-value">{selectedTxn.notificationCount} sent</span></div>
                  </div>
                </>
              )}

              <div className="slk-drawer-actions">
                <button className="slk-action-btn slk-primary"><Download size={14} /> Export</button>
                <button className="slk-action-btn"><Copy size={14} /> Copy OTP</button>
                <button className="slk-action-btn"><Bell size={14} /> Resend</button>
                <button className="slk-action-btn"><ExternalLink size={14} /> Track Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // Tab 4: Alerts & Monitoring
  // ============================================================================
  const renderAlertsTab = () => {
    const criticalCount = data.alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;
    const warningCount = data.alerts.filter(a => a.severity === "warning" && !a.acknowledged).length;
    const ackCount = data.alerts.filter(a => a.acknowledged).length;
    const totalAlerts = data.alerts.length;

    return (
      <div className="slk-alerts-tab">
        <div className="slk-alert-summary">
          <div className="slk-alert-summary-card slk-critical">
            <AlertTriangle size={20} />
            <div>
              <div className="slk-alert-summary-value">{criticalCount}</div>
              <div className="slk-alert-summary-label">Critical Unacknowledged</div>
            </div>
          </div>
          <div className="slk-alert-summary-card slk-warning">
            <Bell size={20} />
            <div>
              <div className="slk-alert-summary-value">{warningCount}</div>
              <div className="slk-alert-summary-label">Warnings Pending</div>
            </div>
          </div>
          <div className="slk-alert-summary-card slk-info">
            <CheckCircle2 size={20} />
            <div>
              <div className="slk-alert-summary-value">{ackCount}/{totalAlerts}</div>
              <div className="slk-alert-summary-label">Acknowledged</div>
            </div>
          </div>
        </div>

        <div className="slk-alert-full-list">
          {data.alerts.map((alert, i) => {
            const timeAgo = Math.floor((Date.now() - new Date(alert.timestamp).getTime()) / 60000);
            const timeStr = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ${timeAgo % 60}m ago`;
            return (
              <div key={i} className={`slk-alert-card slk-${alert.severity} ${alert.acknowledged ? "slk-acknowledged" : ""}`}>
                <div className="slk-alert-card-left">
                  <div className="slk-alert-severity-icon" style={{ background: `${SEVERITY_COLORS[alert.severity]}20`, color: SEVERITY_COLORS[alert.severity] }}>
                    {alert.severity === "critical" ? <AlertTriangle size={18} /> : alert.severity === "warning" ? <Bell size={18} /> : <CircleDot size={18} />}
                  </div>
                  <div className="slk-alert-card-content">
                    <div className="slk-alert-type-row">
                      <span className="slk-alert-type-badge" style={{ background: `${SEVERITY_COLORS[alert.severity]}15`, color: SEVERITY_COLORS[alert.severity] }}>{alert.type}</span>
                      <span className="slk-alert-time">{timeStr}</span>
                    </div>
                    <div className="slk-alert-message">{alert.message}</div>
                    <div className="slk-alert-source">
                      <MapPin size={11} /> {alert.lockerName}
                      {alert.kioskName && <span> &middot; {alert.kioskName}</span>}
                    </div>
                  </div>
                </div>
                <div className="slk-alert-card-right">
                  <span className={`slk-alert-ack-status ${alert.acknowledged ? "slk-ack" : "slk-unack"}`}>
                    {alert.acknowledged ? <CheckCircle2 size={14} /> : <CircleDot size={14} />}
                    {alert.acknowledged ? "ACK" : "PENDING"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="slk-system-health">
          <div className="slk-health-title">System Health Overview</div>
          <div className="slk-health-grid">
            {[
              { label: "Network Connectivity", pct: 94, color: COLORS.emerald },
              { label: "Hardware Health", pct: 87, color: COLORS.amber },
              { label: "Power Supply", pct: 96, color: COLORS.emerald },
              { label: "Temperature Control", pct: 91, color: COLORS.emerald },
              { label: "Security Systems", pct: 98, color: COLORS.emerald },
              { label: "Firmware Currency", pct: 78, color: COLORS.amber },
            ].map((h, i) => (
              <div key={i} className="slk-health-card">
                <div className="slk-health-label">{h.label}</div>
                <div className="slk-health-bar"><div className="slk-health-fill" style={{ width: `${h.pct}%`, background: h.color }}></div></div>
                <div className="slk-health-value">{h.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // Main render
  // ============================================================================
  return (
    <div className="slk-root">
      <div className="slk-header">
        <div className="slk-header-left">
          <div className="slk-header-icon"><LockKeyhole size={22} /></div>
          <div>
            <h1 className="slk-header-title">Smart Locker &amp; Self-Service Kiosk Management</h1>
            <p className="slk-header-subtitle">25 locations &middot; {data.lockers.length} smart lockers &middot; {data.kiosks.length} kiosks &middot; {formatNum(data.transactions.length)} transactions</p>
          </div>
        </div>
        <div className="slk-header-right">
          <div className="slk-header-stat">
            <span className="slk-header-stat-value">{formatNum(totalCompartments)}</span>
            <span className="slk-header-stat-label">Compartments</span>
          </div>
          <div className="slk-header-stat">
            <span className="slk-header-stat-value">{avgOccupancy}%</span>
            <span className="slk-header-stat-label">Avg Occupancy</span>
          </div>
          <div className="slk-header-stat">
            <span className="slk-header-stat-value">{activeKiosks}/{data.kiosks.length}</span>
            <span className="slk-header-stat-label">Kiosks Online</span>
          </div>
        </div>
      </div>

      <div className="slk-search-bar">
        <Search size={16} className="slk-search-icon" />
        <input type="text" className="slk-search-input" placeholder="Search lockers, kiosks, transactions, customers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        {searchQuery && <button className="slk-search-clear" onClick={() => setSearchQuery("")}><XCircle size={14} /></button>}
      </div>

      <div className="slk-tabs">
        {tabs.map((tab, i) => (
          <button key={i} className={`slk-tab ${activeTab === i ? "slk-tab-active" : ""}`} onClick={() => setActiveTab(i)}>{tab}</button>
        ))}
      </div>

      <div className="slk-content">
        {activeTab === 0 && renderDashboardTab()}
        {activeTab === 1 && renderLockerTab()}
        {activeTab === 2 && renderKioskTab()}
        {activeTab === 3 && renderTransactionTab()}
        {activeTab === 4 && renderAlertsTab()}
      </div>

      {/* Compartment Detail Drawer */}
      {selectedCompartment && (
        <div className="slk-drawer-overlay" onClick={() => setSelectedCompartment(null)}>
          <div className="slk-drawer" onClick={e => e.stopPropagation()}>
            <div className="slk-drawer-header" style={{ background: selectedCompartment.status === "occupied" ? `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.violet})` : `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.emerald})` }}>
              <div className="slk-drawer-title-row">
                <Grid3X3 size={20} />
                <div>
                  <div className="slk-drawer-title">Compartment {selectedCompartment.slotNumber}</div>
                  <div className="slk-drawer-subtitle">{selectedCompartment.lockerName} &middot; {selectedCompartment.size.replace("_", " ")}</div>
                </div>
                <button className="slk-drawer-close" onClick={() => setSelectedCompartment(null)}><ChevronLeft size={20} /></button>
              </div>
            </div>
            <div className="slk-drawer-body">
              <div className="slk-drawer-info-grid">
                <div className="slk-drawer-field"><span className="slk-drawer-label">Slot</span><span className="slk-drawer-value">{selectedCompartment.slotNumber}</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Size</span><span className="slk-drawer-value"><span className="slk-size-badge" style={{ color: SIZE_COLORS[selectedCompartment.size] }}>{SIZE_LABELS[selectedCompartment.size]}</span></span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Status</span><span className="slk-drawer-value"><span className="slk-status-badge" style={{ background: `${STATUS_COLORS[selectedCompartment.status]}20`, color: STATUS_COLORS[selectedCompartment.status] }}>{selectedCompartment.status.replace(/_/g, " ")}</span></span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Temperature</span><span className="slk-drawer-value">{selectedCompartment.temperature}&deg;C</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Weight</span><span className="slk-drawer-value">{selectedCompartment.weight} / {selectedCompartment.weightLimit} kg</span></div>
                <div className="slk-drawer-field"><span className="slk-drawer-label">Access Method</span><span className="slk-drawer-value">{ACCESS_METHOD_LABELS[selectedCompartment.accessMethod]}</span></div>
              </div>

              {selectedCompartment.customerName && (
                <>
                  <div className="slk-drawer-section-title">Occupant Details</div>
                  <div className="slk-drawer-info-grid">
                    <div className="slk-drawer-field"><span className="slk-drawer-label">Customer</span><span className="slk-drawer-value">{selectedCompartment.customerName}</span></div>
                    <div className="slk-drawer-field"><span className="slk-drawer-label">Courier</span><span className="slk-drawer-value">{selectedCompartment.currentOccupant}</span></div>
                    <div className="slk-drawer-field"><span className="slk-drawer-label">Order</span><span className="slk-drawer-value">{selectedCompartment.orderId}</span></div>
                    <div className="slk-drawer-field"><span className="slk-drawer-label">AWB</span><span className="slk-drawer-value">{selectedCompartment.awb}</span></div>
                    <div className="slk-drawer-field"><span className="slk-drawer-label">Deposited</span><span className="slk-drawer-value">{selectedCompartment.depositedAt ? new Date(selectedCompartment.depositedAt).toLocaleString("en-IN") : "-"}</span></div>
                    <div className="slk-drawer-field"><span className="slk-drawer-label">Expiry</span><span className="slk-drawer-value">{selectedCompartment.expiryTime ? new Date(selectedCompartment.expiryTime).toLocaleString("en-IN") : "-"}</span></div>
                  </div>
                  {selectedCompartment.accessCode && (
                    <div className="slk-drawer-access-code">
                      <span className="slk-drawer-label">Access Code</span>
                      <div className="slk-access-code-box"><Key size={14} /> {selectedCompartment.accessCode}</div>
                    </div>
                  )}
                  <div className="slk-drawer-notif-info">
                    <span className="slk-drawer-label">Notifications Sent: {selectedCompartment.notificationsSent}</span>
                  </div>
                </>
              )}

              <div className="slk-drawer-actions">
                <button className="slk-action-btn slk-primary"><Eye size={14} /> View Live</button>
                <button className="slk-action-btn"><Key size={14} /> Release</button>
                <button className="slk-action-btn"><Bell size={14} /> Notify</button>
                <button className="slk-action-btn"><Settings size={14} /> Configure</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
