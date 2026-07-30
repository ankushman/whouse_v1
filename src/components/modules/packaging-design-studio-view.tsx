"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ComposedChart, Bar, BarChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette, Package, Leaf, FlaskConical, DollarSign, LayoutGrid, Search, Clock, ArrowUpRight, ArrowDownRight,
  Eye, X, CheckCircle2, XCircle, AlertTriangle, TrendingUp, Activity, Layers, Ruler, Box, FileText, Star,
  Filter, ChevronLeft, ChevronRight, Award, Recycle, ThermometerSun, Droplets, Zap, ChevronDown,
} from "lucide-react";

// ===== TYPES =====
interface PackagingDesign {
  id: string; name: string; code: string;
  category: "primary" | "secondary" | "tertiary" | "protective" | "display" | "ecommerce";
  type: string; dimensions: string; weightGrams: number;
  material: string; customer: string; warehouse: string; city: string;
  status: "draft" | "review" | "approved" | "in-production" | "archived" | "revision";
  version: number; designer: string; createdDate: string;
  costPerUnit: number; sustainabilityScore: number;
  dropTestRating: "A+" | "A" | "B" | "C" | "F";
  compressionRating: "excellent" | "good" | "fair" | "poor";
  stackRating: number; printType: string; barcodeType: string;
  colorHex: string; moq: number;
}

interface MaterialSpec {
  id: string; name: string; code: string;
  type: "corrugated" | "plastic" | "foam" | "paper" | "metal" | "glass" | "bio-based";
  supplier: string; warehouse: string; city: string;
  thickness: number; density: number; tensileStrength: number;
  costPerUnit: number; recycledContent: number;
  recyclable: boolean; fdaApproved: boolean; compostable: boolean;
  stockQty: number; minOrderQty: number; leadTimeDays: number;
  unit: string; color: string;
}

interface CostEstimate {
  id: string; designName: string; designCode: string;
  materialCost: number; laborCost: number; printingCost: number;
  toolingCost: number; overheadCost: number; totalCost: number;
  unitCost: number; volume: number;
  customer: string; warehouse: string; city: string;
  validUntil: string; currency: string; status: "pending" | "approved" | "rejected" | "expired";
}

interface SustainabilityMetric {
  id: string; designName: string; designCode: string;
  recycledContent: number; carbonFootprint: number;
  recyclabilityScore: number; compostable: boolean; biodegradable: boolean;
  ecoCertification: string; waterUsage: number; energyUsage: number;
  overallScore: number; warehouse: string; city: string;
  trend: "up" | "down" | "stable";
}

interface TestResult {
  id: string; designName: string; designCode: string;
  testType: "drop" | "compression" | "vibration" | "moisture" | "temperature" | "stacking";
  standard: string; result: string; passFail: "pass" | "fail" | "conditional";
  tester: string; testDate: string; temperature: number; humidity: number;
  cycles: number; impactForce: number; remarks: string;
  warehouse: string; city: string;
}

// ===== CONSTANTS =====
const COLORS = { primary: "#e11d48", secondary: "#06b6d4", accent: "#f59e0b", danger: "#dc2626", success: "#16a34a", info: "#2563eb", purple: "#9333ea", pink: "#db2777", teal: "#0d9488", emerald: "#059669" };

const PIE_COLORS = ["#e11d48", "#06b6d4", "#f59e0b", "#9333ea", "#059669", "#2563eb"];

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
  if (val >= 10000000) return "\u20B9" + (val / 10000000).toFixed(2) + " Cr";
  if (val >= 100000) return "\u20B9" + (val / 100000).toFixed(2) + " L";
  return "\u20B9" + val.toLocaleString("en-IN");
}

// ===== SEEDED RANDOM =====
function seededRandom(seed: number) {
  let s = seed;
  return function (min = 0, max = 1) {
    s = (s * 16807) % 2147483647;
    return min + (s / 2147483647) * (max - min);
  };
}

// ===== GENERATE DATA =====
function generateData() {
  const r = seededRandom(173);

  const designers = ["Priya Iyer","Arun Sharma","Neha Gupta","Rahul Patel","Divya Reddy","Karan Mehta","Sneha Kulkarni","Vikram Singh","Ananya Das","Rohit Joshi"];
  const customers = ["Reliance Retail","Amazon India","Flipkart","BigBasket","DMart","Tata Consumer","ITC Limited","Hindustan Unilever","Nestle India","Britannia","Marico","Dabur","Godrej Consumer","Cipla","Sun Pharma","Bajaj Consumer","Emami","Patanjali","Zomato","Swiggy"];
  const designNames = ["FreshWrap Box","SecurePack Carton","EcoShield Mailer","FlexiBox Standard","ToughGuard Crate","CrystalView Display","GreenLeaf Bio-Box","SwiftShip Polybag","ProSeal Container","AquaSafe Waterproof","LiteWeight Pouch","MaxiCart Roll","ThermoProtect Case","StyleBox Premium","QuickFold Mailer","NaturePack Kraft","PowerSeal Tub","ClearSnap Clamshell","DryStore Desiccant","UltraStrong Pallet","MiniPack Sachet","JumboBulk Sack","SmartLabel Kit","AirPak Cushion","TwinWall Box","ShieldWrap Stretch","FoodSafe Tray","CosmeticBox Lux","AutoPart Shield","TechGuard Electrostatic"];
  const materialNames = ["Kraft Corrugated","Flute B Cardboard","HDPE Sheet","EPS Foam","Molded Pulp","Coroplast","BOPP Film","Aluminium Foil","Glassine Paper","PET Sheet","PLA Bioplastic","Bamboo Fiber","Recycled Cardboard","Stretch Film","Bubble Wrap","Honeycomb Board","Tyvek Fabric","Silicone Paper","Coated Duplex","SBS Cardboard"];
  const suppliers = ["Packwell India","Shreeji Packaging","Supreme Industries","Uflex Limited","Jindal Polyfilms","Emami Paper Mills","ITC Packaging","Ballarpur Industries","Greentech Packaging","EcoFlex Solutions","NaturaPack","Shivam Corrugators","Vijay Box Factory","APL Apollo","Polycab India","FlexiTuff","Cello Pack","Gem Pack"];
  const testStandards = ["ISTA 1A","ISTA 2A","ISTA 3A","ASTM D4169","ASTM D5276","ASTM D642","ISO 2244","ISO 12048","ISO 2876","IS 10602","BIS FMCS"];
  const ecoCerts = ["FSC Certified","ISO 14001","Green Seal","ECOLOGO","Cradle to Cradle","EU Ecolabel","India Ecomark","Rainforest Alliance"];
  const printTypes = ["Flexographic","Offset Litho","Digital Print","Screen Print","Gravure","Hot Foil Stamping"];
  const barcodeTypes = ["QR Code","DataMatrix","Code 128","EAN-13","GS1-128","UPC-A","ITF-14","Code 39"];
  const designTypes = ["Corrugated Box","Rigid Box","Folding Carton","Mailer Bag","Pouch","Tray","Clamshell","Tube","Sleeve","Blister Pack","Shrink Wrap","Stretch Wrap"];

  const categories = ["primary","secondary","tertiary","protective","display","ecommerce"] as const;
  const designStatuses = ["draft","review","approved","in-production","archived","revision"] as const;
  const materialTypes = ["corrugated","plastic","foam","paper","metal","glass","bio-based"] as const;
  const testTypes = ["drop","compression","vibration","moisture","temperature","stacking"] as const;
  const passFails = ["pass","fail","conditional"] as const;
  const costStatuses = ["pending","approved","rejected","expired"] as const;
  const trends = ["up","down","stable"] as const;
  const dropRatings = ["A+","A","B","C","F"] as const;
  const compressionRatings = ["excellent","good","fair","poor"] as const;
  const materialColors = ["#e11d48","#06b6d4","#f59e0b","#9333ea","#059669","#2563eb","#dc2626","#db2777","#0d9488","#d97706","#7c3aed","#ea580c"];
  const designColorHexes = ["#e11d48","#06b6d4","#f59e0b","#9333ea","#059669","#2563eb","#db2777","#0d9488","#dc2626","#d97706","#ea580c","#7c3aed","#e11d48","#06b6d4","#f59e0b","#9333ea","#059669","#2563eb"];

  function pick<T>(arr: readonly T[]): T { return arr[Math.floor(r() * arr.length)]; }
  function pickN(arr: string[], n: number): string[] { const s = new Set<string>(); while (s.size < Math.min(n, arr.length)) s.add(pick(arr)); return [...s]; }
  function date2025() { return `2025-${String(Math.floor(r()*12)+1).padStart(2,"0")}-${String(Math.floor(r()*28)+1).padStart(2,"0")}`; }
  function time() { return `${String(Math.floor(r()*18)+5).padStart(2,"0")}:${String(Math.floor(r()*60)).padStart(2,"0")}`; }

  // Packaging Designs (70)
  const designs: PackagingDesign[] = Array.from({ length: 70 }, (_, i) => {
    const cat = pick(categories);
    const wh = pick(warehouses);
    return {
      id: `PKG-${String(i + 1).padStart(4, "0")}`,
      name: designNames[i % designNames.length],
      code: `PKG-${String.fromCharCode(65 + Math.floor(r() * 26))}${Math.floor(r() * 900 + 100)}`,
      category: cat,
      type: pick(designTypes),
      dimensions: `${Math.floor(r() * 500 + 50)}×${Math.floor(r() * 400 + 50)}×${Math.floor(r() * 300 + 30)} mm`,
      weightGrams: Math.floor(r() * 2500 + 20),
      material: pick(materialNames),
      customer: pick(customers),
      warehouse: wh.name, city: wh.city,
      status: pick(designStatuses),
      version: Math.floor(r() * 8) + 1,
      designer: pick(designers),
      createdDate: date2025(),
      costPerUnit: Math.round((2 + r() * 98) * 100) / 100,
      sustainabilityScore: Math.round((30 + r() * 70) * 10) / 10,
      dropTestRating: pick(dropRatings),
      compressionRating: pick(compressionRatings),
      stackRating: Math.round((1 + r() * 9) * 10) / 10,
      printType: pick(printTypes),
      barcodeType: pick(barcodeTypes),
      colorHex: designColorHexes[i % designColorHexes.length],
      moq: pick([500, 1000, 2500, 5000, 10000, 25000]),
    };
  });

  // Material Specifications (50)
  const materials: MaterialSpec[] = Array.from({ length: 50 }, (_, i) => {
    const wh = pick(warehouses);
    const mtype = pick(materialTypes);
    return {
      id: `MAT-${String(i + 1).padStart(4, "0")}`,
      name: materialNames[i % materialNames.length],
      code: `MAT-${String.fromCharCode(65 + Math.floor(r() * 26))}${Math.floor(r() * 900 + 100)}`,
      type: mtype,
      supplier: pick(suppliers),
      warehouse: wh.name, city: wh.city,
      thickness: Math.round((0.1 + r() * 15) * 100) / 100,
      density: Math.round((20 + r() * 1800) * 10) / 10,
      tensileStrength: Math.floor(r() * 5000 + 100),
      costPerUnit: Math.round((5 + r() * 495) * 100) / 100,
      recycledContent: Math.round(r() * 100),
      recyclable: r() > 0.2,
      fdaApproved: mtype === "paper" || mtype === "glass" || mtype === "bio-based" ? r() > 0.3 : r() > 0.7,
      compostable: mtype === "bio-based" ? r() > 0.2 : r() > 0.8,
      stockQty: Math.floor(r() * 50000) + 500,
      minOrderQty: pick([100, 250, 500, 1000, 2500, 5000]),
      leadTimeDays: Math.floor(r() * 21) + 3,
      unit: pick(["kg", "sqm", "sheet", "roll", "meter", "piece"]),
      color: materialColors[i % materialColors.length],
    };
  });

  // Cost Estimates (55)
  const costEstimates: CostEstimate[] = Array.from({ length: 55 }, (_, i) => {
    const d = designs[i % designs.length];
    const wh = pick(warehouses);
    const matCost = Math.round((5000 + r() * 95000));
    const labCost = Math.round((2000 + r() * 30000));
    const prnCost = Math.round((1000 + r() * 25000));
    const toolCost = Math.round((5000 + r() * 50000));
    const ohCost = Math.round((1000 + r() * 15000));
    const total = matCost + labCost + prnCost + toolCost + ohCost;
    const vol = Math.floor(r() * 95000) + 5000;
    return {
      id: `CE-${String(i + 1).padStart(4, "0")}`,
      designName: d.name, designCode: d.code,
      materialCost: matCost, laborCost: labCost, printingCost: prnCost,
      toolingCost: toolCost, overheadCost: ohCost, totalCost: total,
      unitCost: Math.round((total / vol) * 100) / 100,
      volume: vol,
      customer: d.customer,
      warehouse: wh.name, city: wh.city,
      validUntil: date2025(),
      currency: "INR",
      status: pick(costStatuses),
    };
  });

  // Sustainability Metrics (50)
  const sustainability: SustainabilityMetric[] = Array.from({ length: 50 }, (_, i) => {
    const d = designs[i % designs.length];
    const wh = pick(warehouses);
    const rec = Math.round(r() * 100);
    const carb = Math.round((0.5 + r() * 12) * 100) / 100;
    const recyc = Math.round((20 + r() * 80));
    const water = Math.round((1 + r() * 50) * 10) / 10;
    const energy = Math.round((5 + r() * 200) * 10) / 10;
    const overall = Math.round((rec * 0.3 + recyc * 0.3 + (100 - carb * 8) * 0.2 + (r() * 20)) * 10) / 10;
    return {
      id: `SUS-${String(i + 1).padStart(4, "0")}`,
      designName: d.name, designCode: d.code,
      recycledContent: rec, carbonFootprint: carb,
      recyclabilityScore: Math.min(100, recyc),
      compostable: r() > 0.5, biodegradable: r() > 0.6,
      ecoCertification: r() > 0.4 ? pick(ecoCerts) : "None",
      waterUsage: water, energyUsage: energy,
      overallScore: Math.min(100, Math.max(0, overall)),
      warehouse: wh.name, city: wh.city,
      trend: pick(trends),
    };
  });

  // Test Results (65)
  const testResults: TestResult[] = Array.from({ length: 65 }, (_, i) => {
    const d = designs[i % designs.length];
    const wh = pick(warehouses);
    const tt = pick(testTypes);
    const pf = tt === "drop" ? (r() > 0.15 ? "pass" : r() > 0.5 ? "conditional" : "fail") : pick(passFails);
    return {
      id: `TR-${String(i + 1).padStart(4, "0")}`,
      designName: d.name, designCode: d.code,
      testType: tt,
      standard: pick(testStandards),
      result: pf === "pass" ? "Meets specification" : pf === "conditional" ? "Minor deviations noted" : "Does not meet specification",
      passFail: pf,
      tester: pick(designers),
      testDate: date2025(),
      temperature: Math.round((15 + r() * 25) * 10) / 10,
      humidity: Math.round((20 + r() * 70) * 10) / 10,
      cycles: Math.floor(r() * 500) + 10,
      impactForce: tt === "drop" ? Math.round((50 + r() * 2000) * 10) / 10 : 0,
      remarks: pf === "fail" ? "Redesign required — wall thickness insufficient" : pf === "conditional" ? "Acceptable with minor reinforcement" : "All parameters within tolerance",
      warehouse: wh.name, city: wh.city,
    };
  });

  // Dashboard chart data
  const monthlyActivity = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    newDesigns: Math.floor(r() * 25) + 5,
    revisions: Math.floor(r() * 15) + 2,
    approved: Math.floor(r() * 20) + 3,
    avgCost: Math.round((15 + r() * 85) * 100) / 100,
  }));

  const categoryBreakdown = categories.map(c => ({
    name: c.charAt(0).toUpperCase() + c.slice(1),
    value: designs.filter(d => d.category === c).length + Math.floor(r() * 5),
  }));

  const warehouseSustainability = ["Mumbai","Delhi NCR","Bengaluru"].map(city => ({
    city,
    recycled: Math.round(40 + r() * 50),
    recyclability: Math.round(50 + r() * 40),
    carbonScore: Math.round(60 + r() * 30),
    waterScore: Math.round(40 + r() * 50),
    energyScore: Math.round(45 + r() * 45),
  }));

  const materialCostComparison = materialTypes.slice(0, 6).map(mt => ({
    type: mt.charAt(0).toUpperCase() + mt.slice(1),
    avgCost: Math.round((50 + r() * 400)),
    weight: Math.round((100 + r() * 2000)),
  }));

  const hourlyDesignActivity = Array.from({ length: 16 }, (_, i) => ({
    hour: `${String(i + 6).padStart(2, "0")}:00`,
    active: Math.floor(r() * 20) + 3,
    completed: Math.floor(r() * 12) + 1,
  }));

  return {
    designs, materials, costEstimates, sustainability, testResults,
    monthlyActivity, categoryBreakdown, warehouseSustainability,
    materialCostComparison, hourlyDesignActivity,
    // Enum arrays for JSX use
    categories: [...categories],
    designStatuses: [...designStatuses],
    materialTypes: [...materialTypes],
    testTypes: [...testTypes],
    costStatuses: [...costStatuses],
    passFails: [...passFails],
  };
}

// ===== HELPER COMPONENTS =====
const FieldGrid = ({ fields }: { fields: [string, string][] }) => (
  <div className="pds-drawer-field-grid">
    {fields.map(([label, val]) => (
      <div className="pds-drawer-field" key={label}>
        <span className="pds-field-label">{label}</span>
        <span className="pds-field-value">{val}</span>
      </div>
    ))}
  </div>
);

const MetricsRow = ({ metrics }: { metrics: { label: string; value: string; icon: React.ReactNode; color: string }[] }) => (
  <div className="pds-drawer-metrics">
    {metrics.map(m => (
      <div className="pds-drawer-metric" key={m.label} style={{ borderLeftColor: m.color }}>
        <div className="pds-metric-icon">{m.icon}</div>
        <div className="pds-metric-info">
          <span className="pds-metric-value" style={{ color: m.color }}>{m.value}</span>
          <span className="pds-metric-label">{m.label}</span>
        </div>
      </div>
    ))}
  </div>
);

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    "draft": "#6b7280", "review": "#f59e0b", "approved": "#16a34a",
    "in-production": "#2563eb", "archived": "#6b7280", "revision": "#9333ea",
    "pending": "#f59e0b", "rejected": "#dc2626", "expired": "#6b7280",
    "pass": "#16a34a", "fail": "#dc2626", "conditional": "#f59e0b",
  };
  return (
    <span className="pds-badge" style={{ background: `${colors[status] || "#6b7280"}22`, color: colors[status] || "#6b7280", border: `1px solid ${colors[status] || "#6b7280"}44` }}>
      {status.replace(/-/g, " ")}
    </span>
  );
};

// ===== MAIN COMPONENT =====
export default function PackagingDesignStudioView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterMaterialType, setFilterMaterialType] = useState("all");
  const [filterTestType, setFilterTestType] = useState("all");
  const [filterCostStatus, setFilterCostStatus] = useState("all");
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
    { label: "Total Designs", value: data.designs.length.toString(), icon: <Palette />, color: COLORS.primary, change: "+8" },
    { label: "Active Materials", value: data.materials.filter(m => m.stockQty > 0).length.toString(), icon: <Layers />, color: COLORS.secondary, change: "+3" },
    { label: "Avg Sustainability", value: `${Math.round(data.sustainability.reduce((s, m) => s + m.overallScore, 0) / data.sustainability.length)}%`, icon: <Leaf />, color: COLORS.accent, change: "+5%" },
    { label: "Pending Tests", value: data.testResults.filter(t => t.passFail === "conditional").length.toString(), icon: <FlaskConical />, color: COLORS.purple, change: "-2" },
    { label: "Avg Unit Cost", value: formatINR(Math.round(data.costEstimates.reduce((s, c) => s + c.unitCost, 0) / data.costEstimates.length * 100)), icon: <DollarSign />, color: COLORS.emerald, change: "-12%" },
    { label: "Eco Certified", value: `${Math.round(data.sustainability.filter(s => s.ecoCertification !== "None").length / data.sustainability.length * 100)}%`, icon: <Award />, color: COLORS.teal, change: "+4%" },
  ], [data]);

  // ===== DASHBOARD TAB =====
  const DashboardTab = () => (
    <div className="pds-dashboard">
      <div className="pds-clock-bar"><Clock size={14} /> <span>{currentTime || new Date().toLocaleTimeString("en-IN", { hour12: true })}</span> <span className="pds-clock-date">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span></div>
      <div className="pds-kpi-grid">
        {kpis.map((k, i) => (
          <div className="pds-kpi-card" key={i} style={{ borderTopColor: k.color }}>
            <div className="pds-kpi-icon" style={{ background: `${k.color}18`, color: k.color }}>{k.icon}</div>
            <div className="pds-kpi-info"><span className="pds-kpi-value">{k.value}</span><span className="pds-kpi-label">{k.label}</span></div>
            <span className="pds-kpi-change" style={{ color: k.change.startsWith("+") ? COLORS.success : COLORS.danger }}>{k.change.startsWith("+") ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{k.change}</span>
          </div>
        ))}
      </div>
      <div className="pds-charts-grid">
        <div className="pds-chart-card">
          <h4><Activity size={14} /> Monthly Design Activity</h4>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="newDesigns" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="New Designs" />
              <Bar dataKey="revisions" fill={COLORS.accent} radius={[4, 4, 0, 0]} name="Revisions" />
              <Bar dataKey="approved" fill={COLORS.success} radius={[4, 4, 0, 0]} name="Approved" />
              <Line type="monotone" dataKey="avgCost" stroke={COLORS.secondary} strokeWidth={2} name="Avg Cost (₹)" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="pds-chart-card">
          <h4><Package size={14} /> Category Distribution</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.categoryBreakdown} cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#94a3b8" }}>
                {data.categoryBreakdown.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pds-chart-card">
          <h4><Ruler size={14} /> Material Cost & Weight</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.materialCostComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="type" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="avgCost" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Avg Cost (₹)" />
              <Bar dataKey="weight" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name="Avg Weight (g)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="pds-chart-card">
          <h4><Leaf size={14} /> Warehouse Sustainability</h4>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={[
              { metric: "Recycled", ...Object.fromEntries(data.warehouseSustainability.map(w => [w.city, w.recycled])) },
              { metric: "Recyclability", ...Object.fromEntries(data.warehouseSustainability.map(w => [w.city, w.recyclability])) },
              { metric: "Carbon", ...Object.fromEntries(data.warehouseSustainability.map(w => [w.city, w.carbonScore])) },
              { metric: "Water", ...Object.fromEntries(data.warehouseSustainability.map(w => [w.city, w.waterScore])) },
              { metric: "Energy", ...Object.fromEntries(data.warehouseSustainability.map(w => [w.city, w.energyScore])) },
            ]}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Mumbai" dataKey="Mumbai" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.15} />
              <Radar name="Delhi NCR" dataKey="Delhi NCR" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.15} />
              <Radar name="Bengaluru" dataKey="Bengaluru" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.15} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="pds-chart-card" style={{ gridColumn: "span 2" }}>
          <h4><TrendingUp size={14} /> Hourly Design Activity</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.hourlyDesignActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="active" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.15} name="Active" />
              <Area type="monotone" dataKey="completed" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.15} name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // ===== DESIGN LIBRARY TAB =====
  const DesignLibraryTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.designs];
      if (searchTerm) arr = arr.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code.toLowerCase().includes(searchTerm.toLowerCase()) || d.customer.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterCategory !== "all") arr = arr.filter(d => d.category === filterCategory);
      if (filterStatus !== "all") arr = arr.filter(d => d.status === filterStatus);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.designs, searchTerm, filterCategory, filterStatus, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="pds-tab-content">
        <div className="pds-toolbar">
          <div className="pds-search"><Search size={14} /><input type="text" placeholder="Search designs, codes, customers..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="pds-filters">
            <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(0); }}><option value="all">All Categories</option>{data.categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }}><option value="all">All Statuses</option>{data.designStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <span className="pds-count">{filtered.length} designs</span>
        </div>
        <div className="pds-design-grid">
          {paged.map((d, i) => (
            <div className="pds-design-card" key={d.id} onClick={() => openDrawer("design", d)}>
              <div className="pds-design-preview" style={{ background: `linear-gradient(135deg, ${d.colorHex}33, ${d.colorHex}11)` }}>
                <div className="pds-design-swatch" style={{ background: d.colorHex }}>{d.type.charAt(0)}</div>
                <span className="pds-design-version">v{d.version}</span>
              </div>
              <div className="pds-design-body">
                <div className="pds-design-header">
                  <h4 className="pds-design-name">{d.name}</h4>
                  <span className="pds-design-code">{d.code}</span>
                </div>
                <div className="pds-design-meta">
                  <span>{d.category}</span>
                  <span>{d.type}</span>
                  <span>{d.dimensions}</span>
                </div>
                <div className="pds-design-footer">
                  <span className="pds-design-customer">{d.customer}</span>
                  <div className="pds-design-footer-right">
                    {statusBadge(d.status)}
                    <span className="pds-design-sustain" style={{ color: d.sustainabilityScore >= 70 ? COLORS.success : d.sustainabilityScore >= 40 ? COLORS.accent : COLORS.danger }}>
                      <Leaf size={10} /> {d.sustainabilityScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="pds-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== MATERIAL SPECS TAB =====
  const MaterialSpecsTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.materials];
      if (searchTerm) arr = arr.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase()) || m.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterMaterialType !== "all") arr = arr.filter(m => m.type === filterMaterialType);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.materials, searchTerm, filterMaterialType, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="pds-tab-content">
        <div className="pds-toolbar">
          <div className="pds-search"><Search size={14} /><input type="text" placeholder="Search materials, suppliers..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="pds-filters">
            <select value={filterMaterialType} onChange={e => { setFilterMaterialType(e.target.value); setPage(0); }}><option value="all">All Types</option>{data.materialTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>
          </div>
          <span className="pds-count">{filtered.length} materials</span>
        </div>
        <div className="pds-table-wrap">
          <table className="pds-table">
            <thead>
              <tr>
                {(["code","name","type","supplier","thickness","costPerUnit","recycledContent","stockQty","recyclable"] as const).map(h => (
                  <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `pds-sorted-${sortDir}` : ""}>
                    {h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((m, i) => (
                <tr key={m.id} onClick={() => openDrawer("material", m)}>
                  <td className="pds-mono">{m.code}</td>
                  <td><span className="pds-material-dot" style={{ background: m.color }} />{m.name}</td>
                  <td><span className="pds-type-badge" style={{ background: `${m.color}18`, color: m.color }}>{m.type}</span></td>
                  <td>{m.supplier}</td>
                  <td>{m.thickness} mm</td>
                  <td>{formatINR(m.costPerUnit)}/{m.unit}</td>
                  <td>
                    <div className="pds-bar-cell">
                      <div className="pds-bar" style={{ width: `${m.recycledContent}%`, background: m.recycledContent >= 50 ? COLORS.success : COLORS.accent }} />
                      <span>{m.recycledContent}%</span>
                    </div>
                  </td>
                  <td>{m.stockQty.toLocaleString("en-IN")} {m.unit}</td>
                  <td>{m.recyclable ? <CheckCircle2 size={14} style={{ color: COLORS.success }} /> : <XCircle size={14} style={{ color: COLORS.danger }} />}</td>
                  <td><Eye size={14} className="pds-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pds-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== COST ESTIMATOR TAB =====
  const CostEstimatorTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.costEstimates];
      if (searchTerm) arr = arr.filter(c => c.designName.toLowerCase().includes(searchTerm.toLowerCase()) || c.customer.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterCostStatus !== "all") arr = arr.filter(c => c.status === filterCostStatus);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.costEstimates, searchTerm, filterCostStatus, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="pds-tab-content">
        <div className="pds-toolbar">
          <div className="pds-search"><Search size={14} /><input type="text" placeholder="Search estimates, customers..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="pds-filters">
            <select value={filterCostStatus} onChange={e => { setFilterCostStatus(e.target.value); setPage(0); }}><option value="all">All Statuses</option>{data.costStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <span className="pds-count">{filtered.length} estimates</span>
        </div>
        <div className="pds-table-wrap">
          <table className="pds-table">
            <thead>
              <tr>
                {(["designCode","designName","customer","materialCost","laborCost","printingCost","totalCost","unitCost","volume","status"] as const).map(h => (
                  <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `pds-sorted-${sortDir}` : ""}>
                    {h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c, i) => (
                <tr key={c.id} onClick={() => openDrawer("cost", c)}>
                  <td className="pds-mono">{c.designCode}</td>
                  <td>{c.designName}</td>
                  <td>{c.customer}</td>
                  <td>{formatINR(c.materialCost)}</td>
                  <td>{formatINR(c.laborCost)}</td>
                  <td>{formatINR(c.printingCost)}</td>
                  <td className="pds-bold">{formatINR(c.totalCost)}</td>
                  <td>{formatINR(c.unitCost)}</td>
                  <td>{c.volume.toLocaleString("en-IN")}</td>
                  <td>{statusBadge(c.status)}</td>
                  <td><Eye size={14} className="pds-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pds-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== SUSTAINABILITY TAB =====
  const SustainabilityTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.sustainability];
      if (searchTerm) arr = arr.filter(s => s.designName.toLowerCase().includes(searchTerm.toLowerCase()) || s.ecoCertification.toLowerCase().includes(searchTerm.toLowerCase()));
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.sustainability, searchTerm, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="pds-tab-content">
        <div className="pds-toolbar">
          <div className="pds-search"><Search size={14} /><input type="text" placeholder="Search designs, certifications..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <span className="pds-count">{filtered.length} metrics</span>
        </div>
        <div className="pds-sustain-grid">
          {paged.map((s, i) => (
            <div className="pds-sustain-card" key={s.id} style={{ borderTopColor: s.overallScore >= 70 ? COLORS.success : s.overallScore >= 40 ? COLORS.accent : COLORS.danger }}>
              <div className="pds-sustain-header">
                <h4>{s.designName}</h4>
                <span className="pds-sustain-code">{s.designCode}</span>
              </div>
              <div className="pds-sustain-score-ring">
                <svg viewBox="0 0 80 80" className="pds-ring-svg">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke={s.overallScore >= 70 ? COLORS.success : s.overallScore >= 40 ? COLORS.accent : COLORS.danger} strokeWidth="6" strokeDasharray={`${s.overallScore * 2.136} 213.6`} strokeLinecap="round" transform="rotate(-90 40 40)" />
                  <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="700" fill={s.overallScore >= 70 ? COLORS.success : s.overallScore >= 40 ? COLORS.accent : COLORS.danger}>{Math.round(s.overallScore)}</text>
                </svg>
              </div>
              <div className="pds-sustain-bars">
                <div className="pds-sustain-bar-row"><span>Recycled Content</span><div className="pds-bar-lg"><div className="pds-bar" style={{ width: `${s.recycledContent}%`, background: COLORS.secondary }} /></div><span>{s.recycledContent}%</span></div>
                <div className="pds-sustain-bar-row"><span>Recyclability</span><div className="pds-bar-lg"><div className="pds-bar" style={{ width: `${s.recyclabilityScore}%`, background: COLORS.success }} /></div><span>{s.recyclabilityScore}%</span></div>
                <div className="pds-sustain-bar-row"><span>Carbon Score</span><div className="pds-bar-lg"><div className="pds-bar" style={{ width: `${Math.max(0, 100 - s.carbonFootprint * 8)}%`, background: COLORS.accent }} /></div><span>{s.carbonFootprint} kg</span></div>
              </div>
              <div className="pds-sustain-badges">
                {s.compostable && <span className="pds-eco-badge" style={{ background: "#05966918", color: "#059669", borderColor: "#05966944" }}>Compostable</span>}
                {s.biodegradable && <span className="pds-eco-badge" style={{ background: "#06b6d418", color: "#06b6d4", borderColor: "#06b6d444" }}>Biodegradable</span>}
                {s.ecoCertification !== "None" && <span className="pds-eco-badge" style={{ background: "#9333ea18", color: "#9333ea", borderColor: "#9333ea44" }}><Award size={10} /> {s.ecoCertification}</span>}
              </div>
              <div className="pds-sustain-meta">
                <span><Droplets size={10} /> Water: {s.waterUsage} L</span>
                <span><Zap size={10} /> Energy: {s.energyUsage} kWh</span>
                <span style={{ color: s.trend === "up" ? COLORS.success : s.trend === "down" ? COLORS.danger : COLORS.info }}>
                  {s.trend === "up" ? <ArrowUpRight size={10} /> : s.trend === "down" ? <ArrowDownRight size={10} /> : null} {s.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="pds-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== TESTING & VALIDATION TAB =====
  const TestingTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.testResults];
      if (searchTerm) arr = arr.filter(t => t.designName.toLowerCase().includes(searchTerm.toLowerCase()) || t.standard.toLowerCase().includes(searchTerm.toLowerCase()) || t.tester.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterTestType !== "all") arr = arr.filter(t => t.testType === filterTestType);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.testResults, searchTerm, filterTestType, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="pds-tab-content">
        <div className="pds-toolbar">
          <div className="pds-search"><Search size={14} /><input type="text" placeholder="Search tests, standards, testers..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="pds-filters">
            <select value={filterTestType} onChange={e => { setFilterTestType(e.target.value); setPage(0); }}><option value="all">All Types</option>{data.testTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>
          </div>
          <span className="pds-count">{filtered.length} tests</span>
        </div>
        <div className="pds-table-wrap">
          <table className="pds-table">
            <thead>
              <tr>
                {(["designCode","designName","testType","standard","passFail","tester","testDate","temperature","humidity","cycles"] as const).map(h => (
                  <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `pds-sorted-${sortDir}` : ""}>
                    {h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((t, i) => (
                <tr key={t.id} onClick={() => openDrawer("test", t)} style={{ background: t.passFail === "fail" ? "#fef2f244" : undefined }}>
                  <td className="pds-mono">{t.designCode}</td>
                  <td>{t.designName}</td>
                  <td><span className="pds-type-badge" style={{ background: `${COLORS.secondary}18`, color: COLORS.secondary }}>{t.testType}</span></td>
                  <td>{t.standard}</td>
                  <td>{statusBadge(t.passFail)}</td>
                  <td>{t.tester}</td>
                  <td>{t.testDate}</td>
                  <td>{t.temperature}°C</td>
                  <td>{t.humidity}%</td>
                  <td>{t.cycles}</td>
                  <td><Eye size={14} className="pds-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pds-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== DRAWERS =====
  const DesignDrawer = () => {
    const d = drawerData as PackagingDesign;
    if (!d) return null;
    return (
      <>
        <div className="pds-overlay" onClick={closeDrawer} />
        <div className="pds-drawer pds-drawer-design">
          <div className="pds-drawer-header">
            <div><h3><Palette size={18} /> {d.name}</h3><span className="pds-drawer-subtitle">{d.code} • {d.customer}</span></div>
            <button onClick={closeDrawer}><X size={18} /></button>
          </div>
          <div className="pds-drawer-body">
            <MetricsRow metrics={[
              { label: "Cost/Unit", value: formatINR(d.costPerUnit), icon: <DollarSign size={16} />, color: COLORS.primary },
              { label: "Sustainability", value: `${d.sustainabilityScore}%`, icon: <Leaf size={16} />, color: COLORS.accent },
              { label: "MOQ", value: d.moq.toLocaleString("en-IN"), icon: <Package size={16} />, color: COLORS.secondary },
            ]} />
            <FieldGrid fields={[
              ["Category", d.category], ["Type", d.type], ["Status", d.status],
              ["Version", `v${d.version}`], ["Designer", d.designer], ["Created", d.createdDate],
              ["Dimensions", d.dimensions], ["Weight", `${d.weightGrams}g`], ["Material", d.material],
              ["Print Type", d.printType], ["Barcode", d.barcodeType], ["Warehouse", d.warehouse],
              ["City", d.city], ["Drop Test", d.dropTestRating], ["Compression", d.compressionRating],
              ["Stack Rating", `${d.stackRating}/10`],
            ]} />
            <div className="pds-drawer-actions">
              <button className="pds-btn pds-btn-primary"><FileText size={14} /> Export Spec</button>
              <button className="pds-btn pds-btn-secondary"><Star size={14} /> Favorite</button>
              <button className="pds-btn pds-btn-accent"><Layers size={14} /> Duplicate</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const MaterialDrawer = () => {
    const m = drawerData as MaterialSpec;
    if (!m) return null;
    return (
      <>
        <div className="pds-overlay" onClick={closeDrawer} />
        <div className="pds-drawer pds-drawer-material">
          <div className="pds-drawer-header">
            <div><h3><Layers size={18} /> {m.name}</h3><span className="pds-drawer-subtitle">{m.code} • {m.supplier}</span></div>
            <button onClick={closeDrawer}><X size={18} /></button>
          </div>
          <div className="pds-drawer-body">
            <MetricsRow metrics={[
              { label: "Stock Qty", value: `${m.stockQty.toLocaleString("en-IN")} ${m.unit}`, icon: <Box size={16} />, color: COLORS.secondary },
              { label: "Cost/Unit", value: formatINR(m.costPerUnit), icon: <DollarSign size={16} />, color: COLORS.primary },
              { label: "Recycled", value: `${m.recycledContent}%`, icon: <Recycle size={16} />, color: COLORS.success },
            ]} />
            <FieldGrid fields={[
              ["Type", m.type], ["Thickness", `${m.thickness} mm`], ["Density", `${m.density} kg/m³`],
              ["Tensile Strength", `${m.tensileStrength} kPa`], ["Lead Time", `${m.leadTimeDays} days`],
              ["Min Order", m.minOrderQty.toLocaleString("en-IN")], ["Warehouse", m.warehouse],
              ["City", m.city], ["Recyclable", m.recyclable ? "Yes" : "No"],
              ["FDA Approved", m.fdaApproved ? "Yes" : "No"], ["Compostable", m.compostable ? "Yes" : "No"],
              ["Unit", m.unit],
            ]} />
            <div className="pds-drawer-actions">
              <button className="pds-btn pds-btn-primary"><FileText size={14} /> Material TDS</button>
              <button className="pds-btn pds-btn-secondary"><AlertTriangle size={14} /> Low Stock Alert</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const CostDrawer = () => {
    const c = drawerData as CostEstimate;
    if (!c) return null;
    return (
      <>
        <div className="pds-overlay" onClick={closeDrawer} />
        <div className="pds-drawer pds-drawer-cost">
          <div className="pds-drawer-header">
            <div><h3><DollarSign size={18} /> {c.designName}</h3><span className="pds-drawer-subtitle">{c.designCode} • {c.customer}</span></div>
            <button onClick={closeDrawer}><X size={18} /></button>
          </div>
          <div className="pds-drawer-body">
            <MetricsRow metrics={[
              { label: "Total Cost", value: formatINR(c.totalCost), icon: <DollarSign size={16} />, color: COLORS.primary },
              { label: "Unit Cost", value: formatINR(c.unitCost), icon: <Activity size={16} />, color: COLORS.secondary },
              { label: "Volume", value: c.volume.toLocaleString("en-IN") + " units", icon: <Package size={16} />, color: COLORS.accent },
            ]} />
            <FieldGrid fields={[
              ["Material Cost", formatINR(c.materialCost)], ["Labor Cost", formatINR(c.laborCost)],
              ["Printing Cost", formatINR(c.printingCost)], ["Tooling Cost", formatINR(c.toolingCost)],
              ["Overhead", formatINR(c.overheadCost)], ["Status", c.status],
              ["Currency", c.currency], ["Valid Until", c.validUntil],
              ["Warehouse", c.warehouse], ["City", c.city],
            ]} />
            <div className="pds-cost-breakdown">
              <h4>Cost Breakdown</h4>
              <div className="pds-cost-bars">
                {[
                  { label: "Material", pct: (c.materialCost / c.totalCost * 100), color: COLORS.primary },
                  { label: "Labor", pct: (c.laborCost / c.totalCost * 100), color: COLORS.secondary },
                  { label: "Printing", pct: (c.printingCost / c.totalCost * 100), color: COLORS.accent },
                  { label: "Tooling", pct: (c.toolingCost / c.totalCost * 100), color: COLORS.purple },
                  { label: "Overhead", pct: (c.overheadCost / c.totalCost * 100), color: COLORS.teal },
                ].map(bar => (
                  <div className="pds-cost-bar-row" key={bar.label}>
                    <span className="pds-cost-bar-label">{bar.label}</span>
                    <div className="pds-cost-bar-track"><div className="pds-cost-bar" style={{ width: `${bar.pct}%`, background: bar.color }} /></div>
                    <span className="pds-cost-bar-pct">{bar.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pds-drawer-actions">
              <button className="pds-btn pds-btn-primary"><FileText size={14} /> Download Quote</button>
              <button className="pds-btn pds-btn-secondary"><Star size={14} /> Save Estimate</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const TestDrawer = () => {
    const t = drawerData as TestResult;
    if (!t) return null;
    return (
      <>
        <div className="pds-overlay" onClick={closeDrawer} />
        <div className="pds-drawer pds-drawer-test">
          <div className="pds-drawer-header" style={t.passFail === "fail" ? { background: "linear-gradient(135deg, #dc2626, #991b1b)" } : t.passFail === "conditional" ? { background: "linear-gradient(135deg, #f59e0b, #d97706)" } : { background: "linear-gradient(135deg, #e11d48, #9333ea)" }}>
            <div><h3><FlaskConical size={18} /> {t.designName}</h3><span className="pds-drawer-subtitle">{t.designCode} • {t.testType.toUpperCase()} Test</span></div>
            <button onClick={closeDrawer}><X size={18} /></button>
          </div>
          <div className="pds-drawer-body">
            <MetricsRow metrics={[
              { label: "Result", value: t.passFail.toUpperCase(), icon: t.passFail === "pass" ? <CheckCircle2 size={16} /> : t.passFail === "fail" ? <XCircle size={16} /> : <AlertTriangle size={16} />, color: t.passFail === "pass" ? COLORS.success : t.passFail === "fail" ? COLORS.danger : COLORS.accent },
              { label: "Standard", value: t.standard, icon: <FileText size={16} />, color: COLORS.secondary },
              { label: "Cycles", value: t.cycles.toString(), icon: <Activity size={16} />, color: COLORS.primary },
            ]} />
            <FieldGrid fields={[
              ["Test Type", t.testType], ["Standard", t.standard], ["Result", t.result],
              ["Tester", t.tester], ["Test Date", t.testDate],
              ["Temperature", `${t.temperature}°C`], ["Humidity", `${t.humidity}%`],
              ["Impact Force", t.impactForce > 0 ? `${t.impactForce} N` : "N/A"],
              ["Cycles", t.cycles.toString()], ["Warehouse", t.warehouse], ["City", t.city],
            ]} />
            <div className="pds-drawer-remarks">
              <h4><FileText size={14} /> Remarks</h4>
              <p>{t.remarks}</p>
            </div>
            <div className="pds-drawer-actions">
              <button className="pds-btn pds-btn-primary"><FileText size={14} /> Download Report</button>
              <button className="pds-btn pds-btn-secondary"><FlaskConical size={14} /> Schedule Retest</button>
              <button className="pds-btn pds-btn-accent"><AlertTriangle size={14} /> Raise NCR</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const drawerMap: Record<string, React.FC> = {
    design: DesignDrawer,
    material: MaterialDrawer,
    cost: CostDrawer,
    test: TestDrawer,
  };

  const DrawerComponent = drawerMap[drawerType];

  return (
    <div className="pds-root">
      <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setPage(0); setSearchTerm(""); setFilterCategory("all"); setFilterStatus("all"); setFilterType("all"); setFilterMaterialType("all"); setFilterTestType("all"); setFilterCostStatus("all"); }}>
        <div className="pds-tabs-header">
          <h2 className="pds-page-title"><Palette size={22} /> Packaging Design Studio</h2>
          <TabsList className="pds-tabs-list">
            <TabsTrigger value="dashboard"><LayoutGrid size={14} /> Dashboard</TabsTrigger>
            <TabsTrigger value="designs"><Package size={14} /> Design Library</TabsTrigger>
            <TabsTrigger value="materials"><Layers size={14} /> Materials</TabsTrigger>
            <TabsTrigger value="costs"><DollarSign size={14} /> Cost Estimator</TabsTrigger>
            <TabsTrigger value="sustainability"><Leaf size={14} /> Sustainability</TabsTrigger>
            <TabsTrigger value="testing"><FlaskConical size={14} /> Testing</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="dashboard"><DashboardTab /></TabsContent>
        <TabsContent value="designs"><DesignLibraryTab /></TabsContent>
        <TabsContent value="materials"><MaterialSpecsTab /></TabsContent>
        <TabsContent value="costs"><CostEstimatorTab /></TabsContent>
        <TabsContent value="sustainability"><SustainabilityTab /></TabsContent>
        <TabsContent value="testing"><TestingTab /></TabsContent>
      </Tabs>
      {drawerOpen && DrawerComponent && <DrawerComponent />}
    </div>
  );
}
