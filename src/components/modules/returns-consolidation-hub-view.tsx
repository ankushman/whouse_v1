"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ComposedChart, Bar, BarChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RotateCcw, Package, Search, Clock, ArrowUpRight, ArrowDownRight, Eye, X, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, TrendingDown, Activity, DollarSign, Layers, Truck, Tag, Star, FileText, BarChart3, Filter,
  ChevronLeft, ChevronRight, PackageCheck, PackageX, PackageOpen, Recycle, RefreshCw, Boxes, Send, Zap,
} from "lucide-react";

// ===== TYPES =====
interface ReturnOrder {
  id: string; rmaNo: string; customer: string; warehouse: string; city: string;
  orderNo: string; returnDate: string; returnReason: string;
  category: "damaged" | "defective" | "wrong-item" | "not-as-described" | "change-of-mind" | "warranty" | "recall" | "excess";
  itemsCount: number; totalWeight: number; declaredValue: number;
  status: "received" | "inspecting" | "grading" | "restocking" | "refurbishing" | "reselling" | "disposing" | "shipped-back" | "completed";
  priority: "urgent" | "high" | "medium" | "low";
  carrier: string; trackingNo: string; inspector: string;
  gradingResult: string; refurbCost: number; resaleValue: number;
  timeline: number; qualityScore: number;
}

interface ConsolidationBatch {
  id: string; batchNo: string; warehouse: string; city: string;
  createdDate: string; targetShipDate: string; status: "pending" | "in-progress" | "consolidated" | "shipped" | "closed";
  returnOrders: number; totalItems: number; totalWeight: number;
  destinationWarehouse: string; destinationCity: string;
  carrier: string; estimatedCost: number; actualCost: number;
  consolidationType: "cross-warehouse" | "supplier-return" | "liquidation" | "refurbishment-center";
  priority: "urgent" | "high" | "medium" | "low";
  remarks: string;
}

interface GradingRecord {
  id: string; returnId: string; rmaNo: string; itemName: string;
  warehouse: string; city: string;
  conditionGrade: "A" | "B" | "C" | "D" | "F";
  category: string; originalPrice: number; resaleValue: number;
  refurbishmentNeeded: boolean; refurbishmentCost: number;
  refurbishmentType: string; disposition: "restock" | "refurb" | "liquidate" | "recycle" | "dispose" | "return-to-supplier";
  inspector: string; gradedDate: string;
  qualityNotes: string; images: number;
}

interface RefurbishmentItem {
  id: string; returnId: string; rmaNo: string; itemName: string;
  warehouse: string; city: string;
  status: "pending" | "in-progress" | "completed" | "failed" | "cancelled";
  refurbishmentType: "repackaging" | "cleaning" | "repair" | "part-replacement" | "quality-restoration" | "label-update";
  estimatedDays: number; actualDays: number;
  estimatedCost: number; actualCost: number;
  assignedTechnician: string; startDate: string; completionDate: string;
  qualityCheckPassed: boolean; resaleValueBefore: number; resaleValueAfter: number;
}

interface LiquidationRecord {
  id: string; batchId: string; itemName: string; category: string;
  warehouse: string; city: string;
  channel: "b2b-bulk" | "auction" | "clearance-sale" | "donation" | "recycling" | "scrap";
  quantity: number; originalValue: number; liquidationValue: number; recovery: number;
  buyer: string; saleDate: string; listingPrice: number;
  status: "listed" | "sold" | "unsold" | "expired";
  gradeComposition: string;
}

// ===== CONSTANTS =====
const COLORS = { primary: "#7c3aed", secondary: "#059669", accent: "#f59e0b", danger: "#dc2626", success: "#16a34a", info: "#2563eb", purple: "#9333ea", pink: "#db2777", teal: "#0d9488", rose: "#e11d48" };
const PIE_COLORS = ["#7c3aed", "#059669", "#f59e0b", "#dc2626", "#2563eb", "#0d9488", "#db2777", "#9333ea"];

const warehouses = [
  { name: "Mumbai Hub", city: "Mumbai", state: "Maharashtra" },
  { name: "Delhi NCR DC", city: "Delhi NCR", state: "Delhi" },
  { name: "Bengaluru FC", city: "Bengaluru", state: "Karnataka" },
  { name: "Hyderabad WH", city: "Hyderabad", state: "Telangana" },
  { name: "Chennai DC", city: "Chennai", state: "Tamil Nadu" },
  { name: "Kolkata Hub", city: "Kolkata", state: "West Bengal" },
  { name: "Pune FC", city: "Pune", state: "Maharashtra" },
  { name: "Ahmedabad WH", city: "Ahmedabad", state: "Gujarat" },
];

function formatINR(val: number): string {
  if (val >= 10000000) return "\u20B9" + (val / 10000007).toFixed(2) + " Cr";
  if (val >= 100000) return "\u20B9" + (val / 100000).toFixed(2) + " L";
  return "\u20B9" + val.toLocaleString("en-IN");
}

function seededRandom(seed: number) {
  let s = seed;
  return function (min = 0, max = 1) {
    s = (s * 16807) % 2147483647;
    return min + (s / 2147483647) * (max - min);
  };
}

// ===== GENERATE DATA =====
function generateData() {
  const r = seededRandom(175);

  const customers = ["Reliance Retail","Amazon India","Flipkart","BigBasket","DMart","Tata Consumer","ITC Limited","Hindustan Unilever","Nestle India","Britannia","Marico","Myntra","Ajio","Nykaa","Meesho","Udaan","JioMart","Snapdeal","Paytm Mall","Croma"];
  const carriers = ["BlueDart","Delhivery","DTDC","Ecom Express","XpressBees","Shadowfax","Spoton","TCI Express","SafeExpress","Gati","Allcargo","VRL Logistics"];
  const returnReasons = ["Damaged in transit","Manufacturing defect","Wrong item delivered","Not as described","Size/fit issue","Change of mind","Warranty claim","Product recall","Expired product","Excess inventory","Customer dissatisfaction","Missing accessories"];
  const inspectors = ["Priya Sharma","Rahul Verma","Neha Gupta","Arun Patel","Divya Reddy","Karan Joshi","Sneha Kulkarni","Vikram Singh"];
  const technicians = ["Ramesh Kumar","Suresh Yadav","Mohan Das","Ravi Nair","Amit Bose","Vijay Chauhan","Deepak Mishra","Sanjay Pillai"];
  const buyers = ["IndiaMART B2B","SecondHandHub","ScrapKart","GreenRecycle","Donate2Give","BargainBazaar","LiquidationMart","WholesaleDeals"];
  const refurbTypes = ["repackaging","cleaning","repair","part-replacement","quality-restoration","label-update"] as const;
  const dispositionTypes = ["restock","refurb","liquidate","recycle","dispose","return-to-supplier"] as const;
  const channelTypes = ["b2b-bulk","auction","clearance-sale","donation","recycling","scrap"] as const;
  const categories = ["damaged","defective","wrong-item","not-as-described","change-of-mind","warranty","recall","excess"] as const;
  const statuses = ["received","inspecting","grading","restocking","refurbishing","reselling","disposing","shipped-back","completed"] as const;
  const batchStatuses = ["pending","in-progress","consolidated","shipped","closed"] as const;
  const refurbStatuses = ["pending","in-progress","completed","failed","cancelled"] as const;
  const liquidationStatuses = ["listed","sold","unsold","expired"] as const;
  const priorities = ["urgent","high","medium","low"] as const;
  const consolidationTypes = ["cross-warehouse","supplier-return","liquidation","refurbishment-center"] as const;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function pick<T>(arr: readonly T[]): T { return arr[Math.floor(r() * arr.length)]; }
  function date2025() { return `2025-${String(Math.floor(r()*12)+1).padStart(2,"0")}-${String(Math.floor(r()*28)+1).padStart(2,"0")}`; }

  // Return Orders (75)
  const returnOrders: ReturnOrder[] = Array.from({ length: 75 }, (_, i) => {
    const wh = pick(warehouses);
    const st = pick(statuses);
    const items = Math.floor(r() * 20) + 1;
    const declVal = Math.floor(r() * 50000) + 500;
    return {
      id: `RET-${String(i + 1).padStart(4, "0")}`,
      rmaNo: `RMA-${String(200000 + i).padStart(7, "0")}`,
      customer: pick(customers), warehouse: wh.name, city: wh.city,
      orderNo: `ORD-${String(1000000 + Math.floor(r() * 900000)).padStart(7, "0")}`,
      returnDate: date2025(), returnReason: pick(returnReasons),
      category: pick(categories), itemsCount: items,
      totalWeight: Math.floor(r() * 200 + 2),
      declaredValue: declVal,
      status: st, priority: pick(priorities),
      carrier: pick(carriers),
      trackingNo: `TRK${Math.floor(r() * 900000000) + 100000000}`,
      inspector: pick(inspectors),
      gradingResult: st === "completed" ? pick(["Grade A - Like New","Grade B - Minor Wear","Grade C - Visible Damage","Grade D - Major Damage","Grade F - Unsalvageable"]) : "Pending",
      refurbCost: st === "completed" ? Math.floor(r() * 5000) : 0,
      resaleValue: st === "completed" ? Math.floor(declVal * (0.2 + r() * 0.7)) : 0,
      timeline: Math.floor(r() * 14) + 1,
      qualityScore: st === "completed" ? Math.round((30 + r() * 70) * 10) / 10 : 0,
    };
  });

  // Consolidation Batches (40)
  const consolidationBatches: ConsolidationBatch[] = Array.from({ length: 40 }, (_, i) => {
    const wh = pick(warehouses);
    const dest = pick(warehouses.filter(w => w.name !== wh.name));
    const estCost = Math.floor(5000 + r() * 50000);
    const st = pick(batchStatuses);
    return {
      id: `CB-${String(i + 1).padStart(4, "0")}`,
      batchNo: `BATCH-${String(7000 + i).padStart(5, "0")}`,
      warehouse: wh.name, city: wh.city,
      createdDate: date2025(), targetShipDate: date2025(),
      status: st, returnOrders: Math.floor(r() * 15) + 2,
      totalItems: Math.floor(r() * 100) + 5,
      totalWeight: Math.floor(r() * 500) + 10,
      destinationWarehouse: dest.name, destinationCity: dest.city,
      carrier: pick(carriers),
      estimatedCost: estCost,
      actualCost: st === "shipped" || st === "closed" ? Math.floor(estCost * (0.8 + r() * 0.4)) : 0,
      consolidationType: pick(consolidationTypes),
      priority: pick(priorities),
      remarks: st === "pending" ? "Awaiting return orders" : st === "consolidated" ? "Ready for dispatch" : "",
    };
  });

  // Grading Records (60)
  const gradingRecords: GradingRecord[] = Array.from({ length: 60 }, (_, i) => {
    const wh = pick(warehouses);
    const grade = pick(["A","B","C","D","F"] as const);
    const origPrice = Math.floor(r() * 20000) + 200;
    const resVal = grade === "A" ? Math.floor(origPrice * (0.6 + r() * 0.3)) : grade === "B" ? Math.floor(origPrice * (0.3 + r() * 0.3)) : grade === "C" ? Math.floor(origPrice * (0.1 + r() * 0.2)) : Math.floor(origPrice * r() * 0.1);
    const disp = grade === "A" ? "restock" as const : grade === "B" ? pick(["restock","refurb"] as const) : grade === "C" ? pick(["refurb","liquidate"] as const) : grade === "D" ? pick(["liquidate","recycle"] as const) : pick(["recycle","dispose"] as const);
    return {
      id: `GR-${String(i + 1).padStart(4, "0")}`,
      returnId: `RET-${String(Math.floor(r() * 75) + 1).padStart(4, "0")}`,
      rmaNo: `RMA-${String(200000 + Math.floor(r() * 75)).padStart(7, "0")}`,
      itemName: pick(["LED TV 32\"","Wireless Earbuds","Cotton T-Shirt Pack","Smartphone Case","Blender 500W","Sports Shoes","Face Cream Set","Laptop Sleeve","Power Bank 10000mAh","Yoga Mat","Coffee Maker","Desk Lamp","Backpack 40L","Digital Watch","Bluetooth Speaker"]),
      warehouse: wh.name, city: wh.city,
      conditionGrade: grade,
      category: pick(["Electronics","Apparel","Home & Kitchen","Personal Care","Sports","Accessories"]),
      originalPrice: origPrice, resaleValue: resVal,
      refurbishmentNeeded: grade !== "A" && r() > 0.3,
      refurbishmentCost: grade !== "A" ? Math.floor(r() * 3000) : 0,
      refurbishmentType: grade !== "A" ? pick(refurbTypes) : "None",
      disposition: disp, inspector: pick(inspectors),
      gradedDate: date2025(),
      qualityNotes: grade === "A" ? "No visible damage, packaging intact" : grade === "B" ? "Minor cosmetic wear, fully functional" : grade === "C" ? "Visible damage, needs repair" : grade === "D" ? "Significant damage, limited salvage" : "Beyond repair, recommended disposal",
      images: Math.floor(r() * 8) + 2,
    };
  });

  // Refurbishment Items (45)
  const refurbItems: RefurbishmentItem[] = Array.from({ length: 45 }, (_, i) => {
    const wh = pick(warehouses);
    const st = pick(refurbStatuses);
    const estDays = Math.floor(r() * 7) + 1;
    const estCost = Math.floor(200 + r() * 5000);
    const valBefore = Math.floor(r() * 15000) + 500;
    return {
      id: `RF-${String(i + 1).padStart(4, "0")}`,
      returnId: `RET-${String(Math.floor(r() * 75) + 1).padStart(4, "0")}`,
      rmaNo: `RMA-${String(200000 + Math.floor(r() * 75)).padStart(7, "0")}`,
      itemName: pick(["LED TV 32\"","Wireless Earbuds","Smartphone","Laptop","Tablet","Camera","Headphones","Smartwatch","Power Bank","Bluetooth Speaker"]),
      warehouse: wh.name, city: wh.city,
      status: st, refurbishmentType: pick(refurbTypes),
      estimatedDays: estDays, actualDays: st === "completed" ? Math.floor(estDays * (0.6 + r() * 0.8)) : 0,
      estimatedCost: estCost, actualCost: st === "completed" ? Math.floor(estCost * (0.7 + r() * 0.5)) : 0,
      assignedTechnician: pick(technicians),
      startDate: date2025(), completionDate: st === "completed" ? date2025() : "--",
      qualityCheckPassed: st === "completed" ? r() > 0.15 : false,
      resaleValueBefore: valBefore,
      resaleValueAfter: st === "completed" ? Math.floor(valBefore * (0.5 + r() * 0.5)) : valBefore,
    };
  });

  // Liquidation Records (35)
  const liquidationRecords: LiquidationRecord[] = Array.from({ length: 35 }, (_, i) => {
    const wh = pick(warehouses);
    const st = pick(liquidationStatuses);
    const qty = Math.floor(r() * 500) + 5;
    const origVal = Math.floor(r() * 500000) + 5000;
    const liqVal = st === "sold" ? Math.floor(origVal * (0.1 + r() * 0.4)) : st === "listed" ? Math.floor(origVal * (0.15 + r() * 0.3)) : Math.floor(origVal * r() * 0.15);
    const recovery = origVal > 0 ? Math.round((liqVal / origVal) * 1000) / 10 : 0;
    return {
      id: `LQ-${String(i + 1).padStart(4, "0")}`,
      batchId: `CB-${String(Math.floor(r() * 40) + 1).padStart(4, "0")}`,
      itemName: pick(["Mixed Electronics Lot","Apparel Clearance","Home Appliances","Mobile Accessories","FMCG Expiry Batch","Sports Equipment","Beauty Products","Kitchen Set","Furniture Lot","Stationery Bulk","Footwear","Kids Toys","Seasonal Items","Defective Batch","Open Box Electronics"]),
      category: pick(["Electronics","Apparel","Home & Kitchen","FMCG","Sports","Personal Care","Accessories"]),
      warehouse: wh.name, city: wh.city,
      channel: pick(channelTypes), quantity: qty,
      originalValue: origVal, liquidationValue: liqVal, recovery,
      buyer: st === "sold" ? pick(buyers) : "Pending",
      saleDate: st === "sold" ? date2025() : "--",
      listingPrice: Math.floor(origVal / qty * (0.3 + r() * 0.4)),
      status: st,
      gradeComposition: pick(["A:20% B:40% C:30% D:10%","A:10% B:30% C:40% D:20%","B:50% C:30% D:20%","C:60% D:40%","A:30% B:50% C:20%"]),
    };
  });

  // Dashboard charts
  const monthlyReturns = months.map(m => ({
    month: m, received: Math.floor(40 + r() * 60), processed: Math.floor(30 + r() * 55),
    consolidated: Math.floor(20 + r() * 40), value: Math.floor(200000 + r() * 1500000),
  }));

  const reasonBreakdown = categories.slice(0, 7).map(c => ({
    name: c.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()), value: Math.floor(5 + r() * 30),
  }));

  const gradeDistribution = (["A","B","C","D","F"] as const).map(g => ({
    grade: `${g} Grade`, count: Math.floor(r() * 40) + 5,
  }));

  const channelBreakdown = channelTypes.map(ch => ({
    channel: ch.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    recovery: Math.round((10 + r() * 70) * 10) / 10,
  }));

  const recoveryTrend = months.map(m => ({
    month: m, recoveryRate: Math.round((15 + r() * 55) * 10) / 10, volume: Math.floor(100 + r() * 400),
  }));

  const warehouseReturns = warehouses.slice(0, 5).map(wh => ({
    warehouse: wh.city, received: Math.floor(20 + r() * 50),
    processed: Math.floor(15 + r() * 45), pending: Math.floor(5 + r() * 20),
  }));

  return {
    returnOrders, consolidationBatches, gradingRecords, refurbItems, liquidationRecords,
    monthlyReturns, reasonBreakdown, gradeDistribution, channelBreakdown,
    recoveryTrend, warehouseReturns,
    categories: [...categories],
    statuses: [...statuses],
    batchStatuses: [...batchStatuses],
    priorities: [...priorities],
    consolidationTypes: [...consolidationTypes],
    refurbStatuses: [...refurbStatuses],
    liquidationStatuses: [...liquidationStatuses],
    channelTypes: [...channelTypes],
    dispositionTypes: [...dispositionTypes],
  };
}

// ===== HELPERS =====
const FieldGrid = ({ fields }: { fields: [string, string][] }) => (
  <div className="rch-drawer-field-grid">
    {fields.map(([label, val]) => (
      <div className="rch-drawer-field" key={label}>
        <span className="rch-field-label">{label}</span>
        <span className="rch-field-value">{val}</span>
      </div>
    ))}
  </div>
);

const MetricsRow = ({ metrics }: { metrics: { label: string; value: string; icon: React.ReactNode; color: string }[] }) => (
  <div className="rch-drawer-metrics">
    {metrics.map(m => (
      <div className="rch-drawer-metric" key={m.label} style={{ borderLeftColor: m.color }}>
        <div className="rch-metric-icon">{m.icon}</div>
        <div className="rch-metric-info">
          <span className="rch-metric-value" style={{ color: m.color }}>{m.value}</span>
          <span className="rch-metric-label">{m.label}</span>
        </div>
      </div>
    ))}
  </div>
);

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    "received": "#2563eb", "inspecting": "#f59e0b", "grading": "#8b5cf6", "restocking": "#059669",
    "refurbishing": "#7c3aed", "reselling": "#0d9488", "disposing": "#dc2626",
    "shipped-back": "#6366f1", "completed": "#16a34a",
    "pending": "#6b7280", "in-progress": "#f59e0b", "consolidated": "#059669", "shipped": "#2563eb", "closed": "#16a34a",
    "listed": "#2563eb", "sold": "#16a34a", "unsold": "#f59e0b", "expired": "#dc2626",
    "failed": "#dc2626", "cancelled": "#6b7280",
  };
  return (
    <span className="rch-badge" style={{ background: `${colors[status] || "#6b7280"}22`, color: colors[status] || "#6b7280", border: `1px solid ${colors[status] || "#6b7280"}44` }}>
      {status.replace(/-/g, " ")}
    </span>
  );
};

const gradeColor = (g: string) => ({ "A": "#16a34a", "B": "#059669", "C": "#f59e0b", "D": "#f97316", "F": "#dc2626" }[g] || "#6b7280");
const priorityIcon = (p: string) => p === "urgent" ? <Zap size={12} style={{ color: "#dc2626" }} /> : p === "high" ? <ArrowUpRight size={12} style={{ color: "#f59e0b" }} /> : null;

// ===== MAIN COMPONENT =====
export default function ReturnsConsolidationHubView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBatchStatus, setFilterBatchStatus] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterRefurbStatus, setFilterRefurbStatus] = useState("all");
  const [sortField, setSortField] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const pageSize = 12;
  const [currentTime, setCurrentTime] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);
  const [drawerType, setDrawerType] = useState<string>("");

  const data = useMemo(() => generateData(), []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString("en-IN", { hour12: true })), 1000);
    return () => clearInterval(timer);
  }, []);

  const openDrawer = (type: string, item: any) => { setDrawerType(type); setDrawerData(item); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setDrawerData(null); };
  const handleSort = (field: string) => { if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(field); setSortDir("asc"); } };

  const kpis = useMemo(() => [
    { label: "Total Returns", value: data.returnOrders.length.toString(), icon: <RotateCcw />, color: COLORS.primary, change: "+12" },
    { label: "Active Batches", value: data.consolidationBatches.filter(b => b.status === "in-progress" || b.status === "pending").length.toString(), icon: <Boxes />, color: COLORS.secondary, change: "+3" },
    { label: "Avg Recovery", value: `${Math.round(data.liquidationRecords.reduce((s, l) => s + l.recovery, 0) / data.liquidationRecords.length)}%`, icon: <TrendingUp />, color: COLORS.success, change: "+4.2%" },
    { label: "Pending Grading", value: data.gradingRecords.filter(g => g.disposition === "refurb").length.toString(), icon: <Star />, color: COLORS.accent, change: "-2" },
    { label: "Refurb In Progress", value: data.refurbItems.filter(r => r.status === "in-progress").length.toString(), icon: <RefreshCw />, color: COLORS.info, change: "+1" },
    { label: "Returns Value", value: formatINR(data.returnOrders.reduce((s, r) => s + r.declaredValue, 0)), icon: <DollarSign />, color: COLORS.rose, change: "+18%" },
  ], [data]);

  // ===== DASHBOARD =====
  const DashboardTab = () => (
    <div className="rch-dashboard">
      <div className="rch-clock-bar"><Clock size={14} /> <span>{currentTime || new Date().toLocaleTimeString("en-IN", { hour12: true })}</span><span className="rch-clock-date">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span></div>
      <div className="rch-kpi-grid">
        {kpis.map((k, i) => (
          <div className="rch-kpi-card" key={i} style={{ borderTopColor: k.color }}>
            <div className="rch-kpi-icon" style={{ background: `${k.color}18`, color: k.color }}>{k.icon}</div>
            <div className="rch-kpi-info"><span className="rch-kpi-value">{k.value}</span><span className="rch-kpi-label">{k.label}</span></div>
            <span className="rch-kpi-change" style={{ color: k.change.startsWith("+") ? COLORS.success : COLORS.danger }}>{k.change.startsWith("+") ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{k.change}</span>
          </div>
        ))}
      </div>
      <div className="rch-charts-grid">
        <div className="rch-chart-card">
          <h4><TrendingUp size={14} /> Monthly Returns Volume</h4>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyReturns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="received" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Received" />
              <Bar dataKey="processed" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name="Processed" />
              <Bar dataKey="consolidated" fill={COLORS.accent} radius={[4, 4, 0, 0]} name="Consolidated" />
              <Line type="monotone" dataKey="value" stroke={COLORS.rose} strokeWidth={2} name="Value (₹)" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="rch-chart-card">
          <h4><AlertTriangle size={14} /> Return Reasons</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.reasonBreakdown} cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#94a3b8" }}>
                {data.reasonBreakdown.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rch-chart-card">
          <h4><Star size={14} /> Grading Distribution</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.gradeDistribution.map((entry, idx) => <Cell key={idx} fill={[COLORS.success, COLORS.secondary, COLORS.accent, "#f97316", COLORS.danger][idx]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rch-chart-card">
          <h4><Recycle size={14} /> Recovery Rate by Channel</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.channelBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
              <YAxis dataKey="channel" type="category" tick={{ fontSize: 10 }} width={100} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="recovery" fill={COLORS.secondary} radius={[0, 4, 4, 0]} name="Recovery %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rch-chart-card">
          <h4><BarChart3 size={14} /> Recovery Trend</h4>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.recoveryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="recoveryRate" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.15} name="Recovery %" />
              <Bar dataKey="volume" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Volume" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="rch-chart-card">
          <h4><Layers size={14} /> Warehouse Returns Status</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.warehouseReturns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="received" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Received" />
              <Bar dataKey="processed" fill={COLORS.success} radius={[4, 4, 0, 0]} name="Processed" />
              <Bar dataKey="pending" fill={COLORS.accent} radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // ===== RETURNS TAB =====
  const ReturnsTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.returnOrders];
      if (searchTerm) arr = arr.filter(ret => ret.rmaNo.toLowerCase().includes(searchTerm.toLowerCase()) || ret.customer.toLowerCase().includes(searchTerm.toLowerCase()) || ret.returnReason.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterCategory !== "all") arr = arr.filter(ret => ret.category === filterCategory);
      if (filterStatus !== "all") arr = arr.filter(ret => ret.status === filterStatus);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.returnOrders, searchTerm, filterCategory, filterStatus, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="rch-tab-content">
        <div className="rch-toolbar">
          <div className="rch-search"><Search size={14} /><input type="text" placeholder="Search RMA, customer, reason..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="rch-filters">
            <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(0); }}><option value="all">All Categories</option>{data.categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }}><option value="all">All Statuses</option>{data.statuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <span className="rch-count">{filtered.length} returns</span>
        </div>
        <div className="rch-table-wrap">
          <table className="rch-table">
            <thead><tr>
              {(["rmaNo","customer","returnReason","category","itemsCount","declaredValue","priority","status","timeline","warehouse"] as const).map(h => (
                <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `rch-sorted-${sortDir}` : ""}>{h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
              ))}
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {paged.map((ret, i) => (
                <tr key={ret.id} onClick={() => openDrawer("return", ret)}>
                  <td className="rch-mono">{ret.rmaNo}</td>
                  <td>{ret.customer}</td>
                  <td>{ret.returnReason}</td>
                  <td><span className="rch-type-badge">{ret.category}</span></td>
                  <td className="rch-bold">{ret.itemsCount}</td>
                  <td>{formatINR(ret.declaredValue)}</td>
                  <td><span className="rch-priority-cell">{priorityIcon(ret.priority)} {ret.priority}</span></td>
                  <td>{statusBadge(ret.status)}</td>
                  <td>{ret.timeline} days</td>
                  <td>{ret.city}</td>
                  <td><Eye size={14} className="rch-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <div className="rch-pagination"><button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button><span>{page + 1} / {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button></div>}
      </div>
    );
  };

  // ===== CONSOLIDATION TAB =====
  const ConsolidationTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.consolidationBatches];
      if (searchTerm) arr = arr.filter(b => b.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) || b.destinationWarehouse.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterBatchStatus !== "all") arr = arr.filter(b => b.status === filterBatchStatus);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.consolidationBatches, searchTerm, filterBatchStatus, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="rch-tab-content">
        <div className="rch-toolbar">
          <div className="rch-search"><Search size={14} /><input type="text" placeholder="Search batches, destinations..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="rch-filters">
            <select value={filterBatchStatus} onChange={e => { setFilterBatchStatus(e.target.value); setPage(0); }}><option value="all">All Statuses</option>{data.batchStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <span className="rch-count">{filtered.length} batches</span>
        </div>
        <div className="rch-table-wrap">
          <table className="rch-table">
            <thead><tr>
              {(["batchNo","warehouse","destinationWarehouse","consolidationType","returnOrders","totalItems","totalWeight","estimatedCost","actualCost","priority","status"] as const).map(h => (
                <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `rch-sorted-${sortDir}` : ""}>{h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
              ))}
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {paged.map((b, i) => (
                <tr key={b.id} onClick={() => openDrawer("batch", b)}>
                  <td className="rch-mono">{b.batchNo}</td>
                  <td>{b.city}</td>
                  <td>{b.destinationCity}</td>
                  <td><span className="rch-type-badge" style={{ background: `${COLORS.primary}18`, color: COLORS.primary }}>{b.consolidationType}</span></td>
                  <td className="rch-bold">{b.returnOrders}</td>
                  <td>{b.totalItems}</td>
                  <td>{b.totalWeight} kg</td>
                  <td>{formatINR(b.estimatedCost)}</td>
                  <td>{b.actualCost > 0 ? formatINR(b.actualCost) : "—"}</td>
                  <td><span className="rch-priority-cell">{priorityIcon(b.priority)} {b.priority}</span></td>
                  <td>{statusBadge(b.status)}</td>
                  <td><Eye size={14} className="rch-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <div className="rch-pagination"><button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button><span>{page + 1} / {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button></div>}
      </div>
    );
  };

  // ===== GRADING TAB =====
  const GradingTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.gradingRecords];
      if (searchTerm) arr = arr.filter(g => g.rmaNo.toLowerCase().includes(searchTerm.toLowerCase()) || g.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterGrade !== "all") arr = arr.filter(g => g.conditionGrade === filterGrade);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.gradingRecords, searchTerm, filterGrade, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="rch-tab-content">
        <div className="rch-toolbar">
          <div className="rch-search"><Search size={14} /><input type="text" placeholder="Search RMA, item, inspector..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="rch-filters">
            <select value={filterGrade} onChange={e => { setFilterGrade(e.target.value); setPage(0); }}><option value="all">All Grades</option><option value="A">A - Like New</option><option value="B">B - Minor Wear</option><option value="C">C - Visible Damage</option><option value="D">D - Major Damage</option><option value="F">F - Unsalvageable</option></select>
          </div>
          <span className="rch-count">{filtered.length} records</span>
        </div>
        <div className="rch-table-wrap">
          <table className="rch-table">
            <thead><tr>
              {(["rmaNo","itemName","conditionGrade","category","originalPrice","resaleValue","disposition","refurbishmentNeeded","inspector","gradedDate"] as const).map(h => (
                <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `rch-sorted-${sortDir}` : ""}>{h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
              ))}
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {paged.map((g, i) => (
                <tr key={g.id} onClick={() => openDrawer("grading", g)}>
                  <td className="rch-mono">{g.rmaNo}</td>
                  <td className="rch-bold">{g.itemName}</td>
                  <td><span className="rch-grade-badge" style={{ background: `${gradeColor(g.conditionGrade)}22`, color: gradeColor(g.conditionGrade), border: `1px solid ${gradeColor(g.conditionGrade)}44` }}>Grade {g.conditionGrade}</span></td>
                  <td>{g.category}</td>
                  <td>{formatINR(g.originalPrice)}</td>
                  <td style={{ color: COLORS.success, fontWeight: 600 }}>{formatINR(g.resaleValue)}</td>
                  <td><span className="rch-disp-badge">{g.disposition}</span></td>
                  <td>{g.refurbishmentNeeded ? <CheckCircle2 size={14} style={{ color: COLORS.accent }} /> : <XCircle size={14} style={{ color: COLORS.success }} />}</td>
                  <td>{g.inspector}</td>
                  <td className="rch-mono">{g.gradedDate}</td>
                  <td><Eye size={14} className="rch-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <div className="rch-pagination"><button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button><span>{page + 1} / {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button></div>}
      </div>
    );
  };

  // ===== REFURBISHMENT TAB =====
  const RefurbTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.refurbItems];
      if (searchTerm) arr = arr.filter(rf => rf.rmaNo.toLowerCase().includes(searchTerm.toLowerCase()) || rf.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterRefurbStatus !== "all") arr = arr.filter(rf => rf.status === filterRefurbStatus);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.refurbItems, searchTerm, filterRefurbStatus, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="rch-tab-content">
        <div className="rch-toolbar">
          <div className="rch-search"><Search size={14} /><input type="text" placeholder="Search RMA, item, technician..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="rch-filters">
            <select value={filterRefurbStatus} onChange={e => { setFilterRefurbStatus(e.target.value); setPage(0); }}><option value="all">All Statuses</option>{data.refurbStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <span className="rch-count">{filtered.length} items</span>
        </div>
        <div className="rch-table-wrap">
          <table className="rch-table">
            <thead><tr>
              {(["rmaNo","itemName","refurbishmentType","status","estimatedCost","actualCost","assignedTechnician","estimatedDays","qualityCheckPassed","resaleValueBefore","resaleValueAfter"] as const).map(h => (
                <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `rch-sorted-${sortDir}` : ""}>{h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
              ))}
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {paged.map((rf, i) => (
                <tr key={rf.id} onClick={() => openDrawer("refurb", rf)} style={{ background: rf.status === "failed" ? "#fef2f244" : undefined }}>
                  <td className="rch-mono">{rf.rmaNo}</td>
                  <td>{rf.itemName}</td>
                  <td><span className="rch-type-badge" style={{ background: `${COLORS.primary}18`, color: COLORS.primary }}>{rf.refurbishmentType}</span></td>
                  <td>{statusBadge(rf.status)}</td>
                  <td>{formatINR(rf.estimatedCost)}</td>
                  <td>{rf.actualCost > 0 ? formatINR(rf.actualCost) : "—"}</td>
                  <td>{rf.assignedTechnician}</td>
                  <td>{rf.estimatedDays}d</td>
                  <td>{rf.qualityCheckPassed ? <CheckCircle2 size={14} style={{ color: COLORS.success }} /> : <XCircle size={14} style={{ color: COLORS.danger }} />}</td>
                  <td>{formatINR(rf.resaleValueBefore)}</td>
                  <td style={{ color: rf.resaleValueAfter > rf.resaleValueBefore ? COLORS.success : COLORS.accent, fontWeight: 600 }}>{formatINR(rf.resaleValueAfter)}</td>
                  <td><Eye size={14} className="rch-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <div className="rch-pagination"><button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button><span>{page + 1} / {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button></div>}
      </div>
    );
  };

  // ===== LIQUIDATION TAB =====
  const LiquidationTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.liquidationRecords];
      if (searchTerm) arr = arr.filter(l => l.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || l.buyer.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterChannel !== "all") arr = arr.filter(l => l.channel === filterChannel);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.liquidationRecords, searchTerm, filterChannel, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="rch-tab-content">
        <div className="rch-toolbar">
          <div className="rch-search"><Search size={14} /><input type="text" placeholder="Search items, buyers..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="rch-filters">
            <select value={filterChannel} onChange={e => { setFilterChannel(e.target.value); setPage(0); }}><option value="all">All Channels</option>{data.channelTypes.map(c => <option key={c} value={c}>{c}</option>)}</select>
          </div>
          <span className="rch-count">{filtered.length} records</span>
        </div>
        <div className="rch-table-wrap">
          <table className="rch-table">
            <thead><tr>
              {(["itemName","category","channel","quantity","originalValue","liquidationValue","recovery","buyer","listingPrice","status"] as const).map(h => (
                <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `rch-sorted-${sortDir}` : ""}>{h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
              ))}
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {paged.map((l, i) => (
                <tr key={l.id} onClick={() => openDrawer("liquidation", l)}>
                  <td className="rch-bold">{l.itemName}</td>
                  <td>{l.category}</td>
                  <td><span className="rch-type-badge" style={{ background: `${COLORS.secondary}18`, color: COLORS.secondary }}>{l.channel}</span></td>
                  <td>{l.quantity}</td>
                  <td>{formatINR(l.originalValue)}</td>
                  <td>{formatINR(l.liquidationValue)}</td>
                  <td>
                    <div className="rch-bar-cell"><div className="rch-bar" style={{ width: `${Math.min(l.recovery, 100)}%`, background: l.recovery >= 40 ? COLORS.success : l.recovery >= 20 ? COLORS.accent : COLORS.danger }} /><span>{l.recovery}%</span></div>
                  </td>
                  <td>{l.buyer}</td>
                  <td>{formatINR(l.listingPrice)}</td>
                  <td>{statusBadge(l.status)}</td>
                  <td><Eye size={14} className="rch-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <div className="rch-pagination"><button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button><span>{page + 1} / {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button></div>}
      </div>
    );
  };

  // ===== DRAWERS =====
  const ReturnDrawer = () => {
    const ret = drawerData as ReturnOrder;
    if (!ret) return null;
    return (
      <>
        <div className="rch-overlay" onClick={closeDrawer} />
        <div className="rch-drawer"><div className="rch-drawer-header">
          <div><h3><RotateCcw size={18} /> {ret.rmaNo}</h3><span className="rch-drawer-subtitle">{ret.customer} • {ret.warehouse}</span></div>
          <button onClick={closeDrawer}><X size={18} /></button>
        </div><div className="rch-drawer-body">
          <MetricsRow metrics={[
            { label: "Declared Value", value: formatINR(ret.declaredValue), icon: <DollarSign size={16} />, color: COLORS.primary },
            { label: "Items", value: ret.itemsCount.toString(), icon: <Package size={16} />, color: COLORS.secondary },
            { label: "Timeline", value: `${ret.timeline} days`, icon: <Clock size={16} />, color: COLORS.accent },
          ]} />
          <FieldGrid fields={[
            ["Order No", ret.orderNo], ["Return Date", ret.returnDate], ["Return Reason", ret.returnReason],
            ["Category", ret.category], ["Status", ret.status], ["Priority", ret.priority],
            ["Weight", `${ret.totalWeight} kg`], ["Carrier", ret.carrier], ["Tracking", ret.trackingNo],
            ["Inspector", ret.inspector], ["Grade Result", ret.gradingResult],
            ["Refurb Cost", formatINR(ret.refurbCost)], ["Resale Value", formatINR(ret.resaleValue)],
            ["Quality Score", ret.qualityScore > 0 ? `${ret.qualityScore}/100` : "N/A"],
            ["City", ret.city],
          ]} />
          <div className="rch-drawer-actions">
            <button className="rch-btn rch-btn-primary"><FileText size={14} /> Generate RMA</button>
            <button className="rch-btn rch-btn-secondary"><Truck size={14} /> Schedule Pickup</button>
            <button className="rch-btn rch-btn-accent"><Tag size={14} /> Assign Grade</button>
          </div>
        </div></div>
      </>
    );
  };

  const BatchDrawer = () => {
    const b = drawerData as ConsolidationBatch;
    if (!b) return null;
    return (
      <>
        <div className="rch-overlay" onClick={closeDrawer} />
        <div className="rch-drawer"><div className="rch-drawer-header">
          <div><h3><Boxes size={18} /> {b.batchNo}</h3><span className="rch-drawer-subtitle">{b.warehouse} → {b.destinationCity}</span></div>
          <button onClick={closeDrawer}><X size={18} /></button>
        </div><div className="rch-drawer-body">
          <MetricsRow metrics={[
            { label: "Return Orders", value: b.returnOrders.toString(), icon: <Package size={16} />, color: COLORS.primary },
            { label: "Est. Cost", value: formatINR(b.estimatedCost), icon: <DollarSign size={16} />, color: COLORS.secondary },
            { label: "Weight", value: `${b.totalWeight} kg`, icon: <Layers size={16} />, color: COLORS.accent },
          ]} />
          <FieldGrid fields={[
            ["Created", b.createdDate], ["Target Ship", b.targetShipDate], ["Type", b.consolidationType],
            ["Status", b.status], ["Priority", b.priority], ["Total Items", b.totalItems.toString()],
            ["Carrier", b.carrier], ["Est. Cost", formatINR(b.estimatedCost)], ["Actual Cost", b.actualCost > 0 ? formatINR(b.actualCost) : "N/A"],
            ["Dest. Warehouse", b.destinationWarehouse], ["Remarks", b.remarks || "None"],
          ]} />
          <div className="rch-drawer-actions">
            <button className="rch-btn rch-btn-primary"><Send size={14} /> Ship Batch</button>
            <button className="rch-btn rch-btn-secondary"><FileText size={14} /> Print Manifest</button>
          </div>
        </div></div>
      </>
    );
  };

  const GradingDrawer = () => {
    const g = drawerData as GradingRecord;
    if (!g) return null;
    return (
      <>
        <div className="rch-overlay" onClick={closeDrawer} />
        <div className="rch-drawer"><div className="rch-drawer-header" style={{ background: `linear-gradient(135deg, ${gradeColor(g.conditionGrade)}, ${g.conditionGrade === "A" ? "#059669" : g.conditionGrade === "F" ? "#991b1b" : COLORS.primary})` }}>
          <div><h3><Star size={18} /> Grade {g.conditionGrade}</h3><span className="rch-drawer-subtitle">{g.itemName} • {g.rmaNo}</span></div>
          <button onClick={closeDrawer}><X size={18} /></button>
        </div><div className="rch-drawer-body">
          <MetricsRow metrics={[
            { label: "Original Price", value: formatINR(g.originalPrice), icon: <DollarSign size={16} />, color: COLORS.accent },
            { label: "Resale Value", value: formatINR(g.resaleValue), icon: <TrendingUp size={16} />, color: COLORS.success },
            { label: "Disposition", value: g.disposition, icon: <Recycle size={16} />, color: COLORS.primary },
          ]} />
          <FieldGrid fields={[
            ["Category", g.category], ["Inspector", g.inspector], ["Graded Date", g.gradedDate],
            ["Refurb Needed", g.refurbishmentNeeded ? "Yes" : "No"], ["Refurb Type", g.refurbishmentType],
            ["Refurb Cost", g.refurbishmentCost > 0 ? formatINR(g.refurbishmentCost) : "N/A"],
            ["Photos", `${g.images} images`], ["Warehouse", g.warehouse], ["City", g.city],
          ]} />
          <div className="rch-drawer-remarks">
            <h4><FileText size={14} /> Quality Notes</h4>
            <p>{g.qualityNotes}</p>
          </div>
          <div className="rch-drawer-actions">
            <button className="rch-btn rch-btn-primary"><FileText size={14} /> Export Report</button>
            <button className="rch-btn rch-btn-secondary"><RefreshCw size={14} /> Schedule Refurb</button>
          </div>
        </div></div>
      </>
    );
  };

  const RefurbDrawer = () => {
    const rf = drawerData as RefurbishmentItem;
    if (!rf) return null;
    return (
      <>
        <div className="rch-overlay" onClick={closeDrawer} />
        <div className="rch-drawer"><div className="rch-drawer-header" style={rf.status === "failed" ? { background: "linear-gradient(135deg, #dc2626, #991b1b)" } : undefined}>
          <div><h3><RefreshCw size={18} /> Refurbishment</h3><span className="rch-drawer-subtitle">{rf.itemName} • {rf.rmaNo}</span></div>
          <button onClick={closeDrawer}><X size={18} /></button>
        </div><div className="rch-drawer-body">
          <MetricsRow metrics={[
            { label: "Status", value: rf.status, icon: rf.status === "completed" ? <CheckCircle2 size={16} /> : <Activity size={16} />, color: rf.status === "completed" ? COLORS.success : rf.status === "failed" ? COLORS.danger : COLORS.accent },
            { label: "Value Uplift", value: `${Math.round(((rf.resaleValueAfter - rf.resaleValueBefore) / Math.max(rf.resaleValueBefore, 1)) * 100)}%`, icon: <TrendingUp size={16} />, color: rf.resaleValueAfter > rf.resaleValueBefore ? COLORS.success : COLORS.danger },
            { label: "Cost", value: rf.actualCost > 0 ? formatINR(rf.actualCost) : formatINR(rf.estimatedCost), icon: <DollarSign size={16} />, color: COLORS.primary },
          ]} />
          <FieldGrid fields={[
            ["Type", rf.refurbishmentType], ["Technician", rf.assignedTechnician],
            ["Est. Days", `${rf.estimatedDays}d`], ["Actual Days", rf.actualDays > 0 ? `${rf.actualDays}d` : "N/A"],
            ["Start Date", rf.startDate], ["Completion", rf.completionDate],
            ["QC Passed", rf.qualityCheckPassed ? "Yes" : "No"],
            ["Value Before", formatINR(rf.resaleValueBefore)], ["Value After", formatINR(rf.resaleValueAfter)],
            ["Warehouse", rf.warehouse], ["City", rf.city],
          ]} />
          <div className="rch-drawer-actions">
            <button className="rch-btn rch-btn-primary"><FileText size={14} /> Quality Report</button>
            <button className="rch-btn rch-btn-secondary"><CheckCircle2 size={14} /> QC Check</button>
          </div>
        </div></div>
      </>
    );
  };

  const LiquidationDrawer = () => {
    const l = drawerData as LiquidationRecord;
    if (!l) return null;
    return (
      <>
        <div className="rch-overlay" onClick={closeDrawer} />
        <div className="rch-drawer"><div className="rch-drawer-header" style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}>
          <div><h3><Recycle size={18} /> Liquidation</h3><span className="rch-drawer-subtitle">{l.itemName} • {l.channel}</span></div>
          <button onClick={closeDrawer}><X size={18} /></button>
        </div><div className="rch-drawer-body">
          <MetricsRow metrics={[
            { label: "Recovery", value: `${l.recovery}%`, icon: <TrendingUp size={16} />, color: l.recovery >= 40 ? COLORS.success : COLORS.accent },
            { label: "Original Value", value: formatINR(l.originalValue), icon: <DollarSign size={16} />, color: COLORS.accent },
            { label: "Liquidation Val", value: formatINR(l.liquidationValue), icon: <PackageCheck size={16} />, color: COLORS.secondary },
          ]} />
          <FieldGrid fields={[
            ["Category", l.category], ["Channel", l.channel], ["Quantity", l.quantity.toString()],
            ["Buyer", l.buyer], ["Sale Date", l.saleDate !== "--" ? l.saleDate : "N/A"],
            ["Listing Price", formatINR(l.listingPrice)], ["Status", l.status],
            ["Grade Composition", l.gradeComposition], ["Warehouse", l.warehouse], ["City", l.city],
          ]} />
          <div className="rch-drawer-actions">
            <button className="rch-btn rch-btn-primary"><FileText size={14} /> Sale Report</button>
            <button className="rch-btn rch-btn-secondary"><Tag size={14} /> Relist</button>
          </div>
        </div></div>
      </>
    );
  };

  const drawerMap: Record<string, React.FC> = {
    return: ReturnDrawer, batch: BatchDrawer, grading: GradingDrawer,
    refurb: RefurbDrawer, liquidation: LiquidationDrawer,
  };
  const DrawerComponent = drawerMap[drawerType];

  return (
    <div className="rch-root">
      <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setPage(0); setSearchTerm(""); setFilterCategory("all"); setFilterStatus("all"); setFilterBatchStatus("all"); setFilterGrade("all"); setFilterChannel("all"); setFilterRefurbStatus("all"); }}>
        <div className="rch-tabs-header">
          <h2 className="rch-page-title"><RotateCcw size={22} /> Returns Consolidation Hub</h2>
          <TabsList className="rch-tabs-list">
            <TabsTrigger value="dashboard"><Activity size={14} /> Dashboard</TabsTrigger>
            <TabsTrigger value="returns"><PackageOpen size={14} /> Return Orders</TabsTrigger>
            <TabsTrigger value="consolidation"><Boxes size={14} /> Consolidation</TabsTrigger>
            <TabsTrigger value="grading"><Star size={14} /> Grading</TabsTrigger>
            <TabsTrigger value="refurb"><RefreshCw size={14} /> Refurbishment</TabsTrigger>
            <TabsTrigger value="liquidation"><Recycle size={14} /> Liquidation</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="dashboard"><DashboardTab /></TabsContent>
        <TabsContent value="returns"><ReturnsTab /></TabsContent>
        <TabsContent value="consolidation"><ConsolidationTab /></TabsContent>
        <TabsContent value="grading"><GradingTab /></TabsContent>
        <TabsContent value="refurb"><RefurbTab /></TabsContent>
        <TabsContent value="liquidation"><LiquidationTab /></TabsContent>
      </Tabs>
      {drawerOpen && DrawerComponent && <DrawerComponent />}
    </div>
  );
}
