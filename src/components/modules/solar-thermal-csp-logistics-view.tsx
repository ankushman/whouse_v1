"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#9a3412", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#dc2626"];

const OPERATORS = [
  "NGEL NTPC Solar Dadri",
  "Reliance Solar CSP Jamnagar",
  "Abhijit Solar CSP Nagpur",
  "Godawari Green Energy Jaisalmer",
  "Megha Engineering Solar Hyderabad",
  "Essel Infraprojects Mumbai",
  "Acme Solar Haryana",
  "Tata Power Solar CSP Mumbai",
];

const CATEGORIES = [
  "Parabolic Trough 50MW SEGS",
  "Solar Tower 100MW Molten Salt",
  "Linear Fresnel 30MW Direct Steam",
  "Parabolic Dish Stirling 10MW",
  "Scheffler Reflector Community",
  "CSP-PV Hybrid 200MW",
  "Molten Salt TES 8hr Storage",
  "SGS Steam Generation System",
];

const SHIPMENT_STATUSES = [
  "Parabolic Mirror Module Assembly",
  "Heat Transfer Fluid HTF Filling",
  "Power Block Turbine Generator Install",
  "Molten Salt Tank Storage Construction",
  "Steam Pipeline BOP Balance Plant",
  "Grid Synchronization COD Achieved",
];

const ZONES = [
  "Rajasthan Jaisalmer Barmer Jodhpur",
  "Gujarat Kutch Patan Surendranagar",
  "Telangana Mahabubnagar Nalgonda",
  "MP Neemuch Mandsaur Agar",
  "Maharashtra Latur Osmanabad",
  "Karnataka Raichur Bellary",
  "Andhra Pradesh Kurnool Anantapur",
];

const MODES = [
  "Flatbed Trailer 40T Mirror Module",
  "Heavy Haul 80T Steam Turbine",
  "Crane Truck 25T Heliostat",
  "Rail Wagon Molten Salt Tank",
  "Barge Coastal Power Block",
  "Multi-Axle 60T Receiver Tower",
];

const HT_FLUIDS = [
  "Synthetic Oil Therminol VP1",
  "Molten Salt 60%NaNO3 40%KNO3",
  "Water/Steam Direct",
  "Air Pressurized 25bar",
];

const TABS = ["Dashboard", "Plant Registry", "CSP Analytics", "Insights"];

interface CspRecord {
  id: string;
  batchNo: string;
  operator: string;
  zone: string;
  category: string;
  description: string;
  capacityMW: number;
  solarField: number;
  storageHours: number;
  solarMultiple: number;
  htFluid: string;
  origin: string;
  site: string;
  state: string;
  mode: string;
  prodDate: string;
  shipDate: string;
  transitDays: number;
  contractValue: number;
  turbineType: string;
  status: string;
  remarks: string;
}

const SC: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  slate: "bg-slate-100 text-slate-600",
  orange: "bg-orange-100 text-orange-700",
};

const statusColor: Record<string, string> = {
  "Parabolic Mirror Module Assembly": "slate",
  "Heat Transfer Fluid HTF Filling": "blue",
  "Power Block Turbine Generator Install": "amber",
  "Molten Salt Tank Storage Construction": "orange",
  "Steam Pipeline BOP Balance Plant": "red",
  "Grid Synchronization COD Achieved": "green",
};

const records: CspRecord[] = [
  {
    id: "CSP-0001",
    batchNo: "CSP-B001",
    operator: "Godawari Green Energy Jaisalmer",
    zone: "Rajasthan Jaisalmer Barmer Jodhpur",
    category: "Solar Tower 100MW Molten Salt",
    description: "100MW solar tower with molten salt TES for round-the-clock power generation",
    capacityMW: 100,
    solarField: 450,
    storageHours: 8,
    solarMultiple: 2.5,
    htFluid: "Molten Salt 60%NaNO3 40%KNO3",
    origin: "Gandhinagar Manufacturing Hub",
    site: "Jaisalmer Bhadla Solar Park",
    state: "Rajasthan",
    mode: "Multi-Axle 60T Receiver Tower",
    prodDate: "2024-03-15",
    shipDate: "2024-04-02",
    transitDays: 12,
    contractValue: 3000000000,
    turbineType: "SCST 125MW Reheat",
    status: "Grid Synchronization COD Achieved",
    remarks: "India's first 100MW CSP tower with 8hr storage",
  },
  {
    id: "CSP-0002",
    batchNo: "CSP-B002",
    operator: "Reliance Solar CSP Jamnagar",
    zone: "Gujarat Kutch Patan Surendranagar",
    category: "Parabolic Trough 50MW SEGS",
    description: "50MW parabolic trough SEGS plant with synthetic oil HTF system",
    capacityMW: 50,
    solarField: 320,
    storageHours: 4,
    solarMultiple: 1.8,
    htFluid: "Synthetic Oil Therminol VP1",
    origin: "Mundra Port Facility",
    site: "Kutch Solar Complex",
    state: "Gujarat",
    mode: "Flatbed Trailer 40T Mirror Module",
    prodDate: "2024-05-10",
    shipDate: "2024-05-18",
    transitDays: 5,
    contractValue: 1800000000,
    turbineType: "Steam Turbine 50MW SST",
    status: "Molten Salt Tank Storage Construction",
    remarks: "Trough assembly 85% complete, HTF pipeline in progress",
  },
  {
    id: "CSP-0003",
    batchNo: "CSP-B003",
    operator: "NGEL NTPC Solar Dadri",
    zone: "MP Neemuch Mandsaur Agar",
    category: "Linear Fresnel 30MW Direct Steam",
    description: "30MW linear Fresnel direct steam generation for industrial heat supply",
    capacityMW: 30,
    solarField: 180,
    storageHours: 0,
    solarMultiple: 1.5,
    htFluid: "Water/Steam Direct",
    origin: "Bhopal Industrial Area",
    site: "Neemuch Solar Plant",
    state: "Madhya Pradesh",
    mode: "Crane Truck 25T Heliostat",
    prodDate: "2024-06-01",
    shipDate: "2024-06-08",
    transitDays: 4,
    contractValue: 650000000,
    turbineType: "Steam Screw Expander 5MW",
    status: "Power Block Turbine Generator Install",
    remarks: "Direct steam technology, zero storage design",
  },
  {
    id: "CSP-0004",
    batchNo: "CSP-B004",
    operator: "Tata Power Solar CSP Mumbai",
    zone: "Maharashtra Latur Osmanabad",
    category: "CSP-PV Hybrid 200MW",
    description: "200MW CSP-PV hybrid plant combining solar thermal storage with PV efficiency",
    capacityMW: 200,
    solarField: 500,
    storageHours: 12,
    solarMultiple: 2.3,
    htFluid: "Molten Salt 60%NaNO3 40%KNO3",
    origin: "Mumbai Port Trust",
    site: "Latur Hybrid Solar Park",
    state: "Maharashtra",
    mode: "Heavy Haul 80T Steam Turbine",
    prodDate: "2024-01-20",
    shipDate: "2024-02-05",
    transitDays: 8,
    contractValue: 2800000000,
    turbineType: "SCST 125MW Reheat",
    status: "Heat Transfer Fluid HTF Filling",
    remarks: "Hybrid design targets LCOE below Rs 5/kWh",
  },
  {
    id: "CSP-0005",
    batchNo: "CSP-B005",
    operator: "Abhijit Solar CSP Nagpur",
    zone: "Maharashtra Latur Osmanabad",
    category: "Parabolic Dish Stirling 10MW",
    description: "10MW parabolic dish Stirling engine distributed CSP installation",
    capacityMW: 10,
    solarField: 50,
    storageHours: 0,
    solarMultiple: 1.5,
    htFluid: "Air Pressurized 25bar",
    origin: "Nagpur MIDC",
    site: "Osmanabad Dish Farm",
    state: "Maharashtra",
    mode: "Crane Truck 25T Heliostat",
    prodDate: "2024-07-12",
    shipDate: "2024-07-15",
    transitDays: 2,
    contractValue: 320000000,
    turbineType: "ORC Organic Rankine 10MW",
    status: "Parabolic Mirror Module Assembly",
    remarks: "Modular dish units for remote village electrification",
  },
  {
    id: "CSP-0006",
    batchNo: "CSP-B006",
    operator: "Megha Engineering Solar Hyderabad",
    zone: "Telangana Mahabubnagar Nalgonda",
    category: "Scheffler Reflector Community",
    description: "Community Scheffler reflector system for cooking and small-scale power",
    capacityMW: 2,
    solarField: 75,
    storageHours: 3,
    solarMultiple: 1.6,
    htFluid: "Water/Steam Direct",
    origin: "Hyderabad Manufacturing",
    site: "Mahabubnagar Community Plant",
    state: "Telangana",
    mode: "Flatbed Trailer 40T Mirror Module",
    prodDate: "2024-08-05",
    shipDate: "2024-08-09",
    transitDays: 3,
    contractValue: 100000000,
    turbineType: "Steam Screw Expander 5MW",
    status: "Grid Synchronization COD Achieved",
    remarks: "Community-scale Scheffler reflectors for rural applications",
  },
  {
    id: "CSP-0007",
    batchNo: "CSP-B007",
    operator: "Essel Infraprojects Mumbai",
    zone: "Karnataka Raichur Bellary",
    category: "Molten Salt TES 8hr Storage",
    description: "8hr molten salt thermal energy storage system for existing solar plant",
    capacityMW: 75,
    solarField: 280,
    storageHours: 8,
    solarMultiple: 2.0,
    htFluid: "Molten Salt 60%NaNO3 40%KNO3",
    origin: "Mumbai JNPT Port",
    site: "Raichur TES Facility",
    state: "Karnataka",
    mode: "Rail Wagon Molten Salt Tank",
    prodDate: "2024-04-20",
    shipDate: "2024-05-10",
    transitDays: 14,
    contractValue: 1200000000,
    turbineType: "Steam Turbine 50MW SST",
    status: "Steam Pipeline BOP Balance Plant",
    remarks: "Retrofit TES for round-the-clock dispatch",
  },
  {
    id: "CSP-0008",
    batchNo: "CSP-B008",
    operator: "Acme Solar Haryana",
    zone: "Rajasthan Jaisalmer Barmer Jodhpur",
    category: "SGS Steam Generation System",
    description: "Solar steam generation system for enhanced oil recovery and industrial process heat",
    capacityMW: 25,
    solarField: 150,
    storageHours: 2,
    solarMultiple: 1.7,
    htFluid: "Water/Steam Direct",
    origin: "Gurgaon Industrial Estate",
    site: "Barmer SGS Plant",
    state: "Rajasthan",
    mode: "Flatbed Trailer 40T Mirror Module",
    prodDate: "2024-09-01",
    shipDate: "2024-09-08",
    transitDays: 6,
    contractValue: 450000000,
    turbineType: "Steam Screw Expander 5MW",
    status: "Parabolic Mirror Module Assembly",
    remarks: "Industrial steam supply for oil field operations",
  },
  {
    id: "CSP-0009",
    batchNo: "CSP-B009",
    operator: "Godawari Green Energy Jaisalmer",
    zone: "Andhra Pradesh Kurnool Anantapur",
    category: "Parabolic Trough 50MW SEGS",
    description: "50MW trough plant with 6hr synthetic oil TES for AP grid stabilization",
    capacityMW: 50,
    solarField: 300,
    storageHours: 6,
    solarMultiple: 2.0,
    htFluid: "Synthetic Oil Therminol VP1",
    origin: "Vizag Port",
    site: "Kurnool Ultra Mega Solar",
    state: "Andhra Pradesh",
    mode: "Barge Coastal Power Block",
    prodDate: "2024-02-14",
    shipDate: "2024-03-01",
    transitDays: 10,
    contractValue: 1600000000,
    turbineType: "Steam Turbine 50MW SST",
    status: "Grid Synchronization COD Achieved",
    remarks: "Coastal transport via barge for heavy power block components",
  },
  {
    id: "CSP-0010",
    batchNo: "CSP-B010",
    operator: "Reliance Solar CSP Jamnagar",
    zone: "Gujarat Kutch Patan Surendranagar",
    category: "Solar Tower 100MW Molten Salt",
    description: "100MW central receiver tower with 10hr molten salt storage at Kutch",
    capacityMW: 100,
    solarField: 420,
    storageHours: 10,
    solarMultiple: 2.4,
    htFluid: "Molten Salt 60%NaNO3 40%KNO3",
    origin: "Dahej SEZ",
    site: "Patan Solar Tower",
    state: "Gujarat",
    mode: "Multi-Axle 60T Receiver Tower",
    prodDate: "2024-06-20",
    shipDate: "2024-07-05",
    transitDays: 9,
    contractValue: 2700000000,
    turbineType: "SCST 125MW Reheat",
    status: "Power Block Turbine Generator Install",
    remarks: "10hr storage enables 24hr baseload operation",
  },
  {
    id: "CSP-0011",
    batchNo: "CSP-B011",
    operator: "Tata Power Solar CSP Mumbai",
    zone: "Karnataka Raichur Bellary",
    category: "Linear Fresnel 30MW Direct Steam",
    description: "30MW Fresnel plant for direct steam generation to supplement coal plant",
    capacityMW: 30,
    solarField: 200,
    storageHours: 0,
    solarMultiple: 1.8,
    htFluid: "Water/Steam Direct",
    origin: "Belgaum Foundry",
    site: "Bellary Fresnel Plant",
    state: "Karnataka",
    mode: "Flatbed Trailer 40T Mirror Module",
    prodDate: "2024-10-01",
    shipDate: "2024-10-06",
    transitDays: 3,
    contractValue: 580000000,
    turbineType: "Steam Turbine 50MW SST",
    status: "Heat Transfer Fluid HTF Filling",
    remarks: "Coal plant solar augmentation project",
  },
  {
    id: "CSP-0012",
    batchNo: "CSP-B012",
    operator: "Megha Engineering Solar Hyderabad",
    zone: "Telangana Mahabubnagar Nalgonda",
    category: "CSP-PV Hybrid 200MW",
    description: "200MW hybrid CSP-PV plant with 8hr thermal storage for Telangana grid",
    capacityMW: 200,
    solarField: 480,
    storageHours: 8,
    solarMultiple: 2.2,
    htFluid: "Molten Salt 60%NaNO3 40%KNO3",
    origin: "Krishnapatnam Port",
    site: "Nalgonda Hybrid Park",
    state: "Telangana",
    mode: "Heavy Haul 80T Steam Turbine",
    prodDate: "2024-03-10",
    shipDate: "2024-03-28",
    transitDays: 11,
    contractValue: 2500000000,
    turbineType: "SCST 125MW Reheat",
    status: "Molten Salt Tank Storage Construction",
    remarks: "Hybrid plant with PV peak shaving and CSP evening dispatch",
  },
  {
    id: "CSP-0013",
    batchNo: "CSP-B013",
    operator: "NGEL NTPC Solar Dadri",
    zone: "Rajasthan Jaisalmer Barmer Jodhpur",
    category: "Solar Tower 100MW Molten Salt",
    description: "100MW solar tower at Bhadla with advanced molten salt receiver technology",
    capacityMW: 100,
    solarField: 460,
    storageHours: 9,
    solarMultiple: 2.3,
    htFluid: "Molten Salt 60%NaNO3 40%KNO3",
    origin: "Jaipur Industrial Area",
    site: "Jodhpur Solar Tower",
    state: "Rajasthan",
    mode: "Rail Wagon Molten Salt Tank",
    prodDate: "2024-05-25",
    shipDate: "2024-06-08",
    transitDays: 7,
    contractValue: 2900000000,
    turbineType: "SCST 125MW Reheat",
    status: "Steam Pipeline BOP Balance Plant",
    remarks: "Advanced receiver with 93% thermal efficiency",
  },
  {
    id: "CSP-0014",
    batchNo: "CSP-B014",
    operator: "Acme Solar Haryana",
    zone: "MP Neemuch Mandsaur Agar",
    category: "Parabolic Dish Stirling 10MW",
    description: "10MW distributed dish Stirling installation for agricultural processing",
    capacityMW: 10,
    solarField: 60,
    storageHours: 0,
    solarMultiple: 1.5,
    htFluid: "Air Pressurized 25bar",
    origin: "Indore Industrial Zone",
    site: "Agar Dish Solar Farm",
    state: "Madhya Pradesh",
    mode: "Crane Truck 25T Heliostat",
    prodDate: "2024-11-01",
    shipDate: "2024-11-04",
    transitDays: 2,
    contractValue: 280000000,
    turbineType: "ORC Organic Rankine 10MW",
    status: "Parabolic Mirror Module Assembly",
    remarks: "Agricultural processing heat and power co-generation",
  },
];

const monthlyGen = [
  { month: "Jan", trough: 42, tower: 68, fresnel: 22, dish: 8 },
  { month: "Feb", trough: 48, tower: 75, fresnel: 26, dish: 9 },
  { month: "Mar", trough: 58, tower: 85, fresnel: 32, dish: 11 },
  { month: "Apr", trough: 65, tower: 92, fresnel: 36, dish: 13 },
  { month: "May", trough: 72, tower: 98, fresnel: 40, dish: 14 },
  { month: "Jun", trough: 55, tower: 78, fresnel: 30, dish: 10 },
  { month: "Jul", trough: 38, tower: 55, fresnel: 20, dish: 7 },
  { month: "Aug", trough: 35, tower: 50, fresnel: 18, dish: 6 },
  { month: "Sep", trough: 52, tower: 74, fresnel: 28, dish: 9 },
  { month: "Oct", trough: 62, tower: 88, fresnel: 34, dish: 12 },
  { month: "Nov", trough: 50, tower: 72, fresnel: 25, dish: 8 },
  { month: "Dec", trough: 40, tower: 62, fresnel: 20, dish: 7 },
];

const techDist = [
  { name: "Parabolic Trough", value: 40 },
  { name: "Solar Tower", value: 25 },
  { name: "Fresnel", value: 15 },
  { name: "Dish Stirling", value: 10 },
  { name: "Hybrid", value: 7 },
  { name: "Scheffler", value: 3 },
];

const capacityFactor = [
  { month: "Jan", actual: 38, target: 45 },
  { month: "Feb", actual: 41, target: 45 },
  { month: "Mar", actual: 44, target: 45 },
  { month: "Apr", actual: 47, target: 45 },
  { month: "May", actual: 50, target: 45 },
  { month: "Jun", actual: 35, target: 45 },
  { month: "Jul", actual: 28, target: 45 },
  { month: "Aug", actual: 26, target: 45 },
  { month: "Sep", actual: 36, target: 45 },
  { month: "Oct", actual: 45, target: 45 },
  { month: "Nov", actual: 40, target: 45 },
  { month: "Dec", actual: 36, target: 45 },
];

const lcoeCost = [
  { tech: "Trough", lcoe: 85 },
  { tech: "Tower", lcoe: 72 },
  { tech: "Fresnel", lcoe: 95 },
  { tech: "Dish", lcoe: 120 },
  { tech: "Hybrid CSP-PV", lcoe: 55 },
  { tech: "Scheffler", lcoe: 140 },
];

function formatINR(value: number): string {
  if (value >= 10000000) {
    const cr = value / 10000000;
    return `\u20b9${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  if (value >= 100000) {
    const l = value / 100000;
    return `\u20b9${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)} L`;
  }
  const k = value / 1000;
  return `\u20b9${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)} K`;
}

export default function SolarThermalCspLogisticsView() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalCapacity = records.reduce((s, r) => s + r.capacityMW, 0);
  const underConstruction = records.filter(
    (r) => statusColor[r.status] !== "green"
  ).length;
  const codOperational = records.filter(
    (r) => statusColor[r.status] === "green"
  ).length;
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);

  const toggleFilter = ((key: string, val: string) => setActiveFilters(p => { const np = {...p}; const arr = np[key] || []; np[key] = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]; return np; }));

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(m => ({ value: m, count: records.filter(rec => rec.operator === m).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "htFluid", label: "HT Fluid", options: HT_FLUIDS.map(h => ({ value: h, count: records.filter(rec => rec.htFluid === h).length })) },
  ];

  const filtered = records.filter(r => {
    if (search && !Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(String(r[key as keyof CspRecord]))) return false; }
    return true;
  });

  const kpis = [
    {
      label: "Total Capacity (MW)",
      value: `${totalCapacity} MW`,
      accent: "border-l-[#9a3412]",
    },
    {
      label: "Under Construction",
      value: `${underConstruction} Plants`,
      accent: "border-l-[#ea580c]",
    },
    {
      label: "COD Operational",
      value: `${codOperational} Plants`,
      accent: "border-l-green-600",
    },
    {
      label: "Total Contract",
      value: formatINR(totalContract),
      accent: "border-l-[#c2410c]",
    },
  ];

  const columns: { key: keyof CspRecord | "_sc"; label: string; cls?: string }[] = [
    { key: "id", label: "ID", cls: "w-28" },
    { key: "batchNo", label: "Batch No", cls: "w-28" },
    { key: "operator", label: "Operator", cls: "w-48" },
    { key: "zone", label: "Zone", cls: "w-44" },
    { key: "category", label: "Category", cls: "w-48" },
    { key: "description", label: "Description", cls: "w-56" },
    { key: "capacityMW", label: "Capacity (MW)", cls: "w-28" },
    { key: "solarField", label: "Solar Field (km\u00b2)", cls: "w-32" },
    { key: "storageHours", label: "Storage (hr)", cls: "w-24" },
    { key: "solarMultiple", label: "SM", cls: "w-20" },
    { key: "htFluid", label: "HT Fluid", cls: "w-44" },
    { key: "origin", label: "Origin", cls: "w-40" },
    { key: "site", label: "Site", cls: "w-44" },
    { key: "state", label: "State", cls: "w-28" },
    { key: "mode", label: "Mode", cls: "w-44" },
    { key: "prodDate", label: "Prod Date", cls: "w-28" },
    { key: "shipDate", label: "Ship Date", cls: "w-28" },
    { key: "transitDays", label: "Transit (d)", cls: "w-24" },
    { key: "contractValue", label: "Contract (\u20b9)", cls: "w-32" },
    { key: "turbineType", label: "Turbine", cls: "w-44" },
    { key: "_sc", label: "Status", cls: "w-48" },
    { key: "remarks", label: "Remarks", cls: "w-52" },
  ];

  return (
    <div className="csp-root min-h-screen bg-stone-50">
      <ModuleBreadcrumb
        items={[
          { label: "Modules" },
          { label: "Solar Thermal CSP Logistics" },
        ]}
      />
      <PageHeader
        title="Solar Thermal CSP Logistics"
        description="Concentrated Solar Power plant tracking, shipment logistics, and analytics for India\u2019s solar thermal energy infrastructure"
      />

      {/* KPIs */}
      <div className="csp-kpis grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 mb-6">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`csp-kpi-card bg-white rounded-xl shadow-sm border border-stone-200 p-4 border-l-4 ${k.accent}`}
          >
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">
              {k.label}
            </p>
            <p className="csp-kpi-value text-2xl font-bold text-stone-800 mt-1">
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="csp-tabs flex gap-1 px-6 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`csp-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#9a3412] text-white"
                : "bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "Dashboard" && (
        <div className="csp-dashboard px-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="csp-chart-card bg-white rounded-xl shadow-sm border border-stone-200 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">
                Monthly Generation by CSP Technology (GWh)
              </h3>
              <BarChart width={500} height={280} data={monthlyGen}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="trough" name="Trough" fill="#9a3412" />
                <Bar dataKey="tower" name="Tower" fill="#ea580c" />
                <Bar dataKey="fresnel" name="Fresnel" fill="#fb923c" />
                <Bar dataKey="dish" name="Dish" fill="#fdba74" />
              </BarChart>
            </div>
            <div className="csp-chart-card bg-white rounded-xl shadow-sm border border-stone-200 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">
                CSP Technology Distribution (%)
              </h3>
              <PieChart width={500} height={280}>
                <Pie
                  data={techDist}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {techDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="csp-chart-card bg-white rounded-xl shadow-sm border border-stone-200 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">
                Capacity Factor: Actual vs Target (45%)
              </h3>
              <LineChart width={500} height={280} data={capacityFactor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 60]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual %"
                  stroke="#9a3412"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target %"
                  stroke="#dc2626"
                  strokeDasharray="6 3"
                  strokeWidth={2}
                />
              </LineChart>
            </div>
            <div className="csp-chart-card bg-white rounded-xl shadow-sm border border-stone-200 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">
                LCOE by Technology ($/MWh)
              </h3>
              <AreaChart width={500} height={280} data={lcoeCost}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="tech" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="lcoe"
                  name="LCOE $/MWh"
                  stroke="#9a3412"
                  fill="#fed7aa"
                  strokeWidth={2}
                />
              </AreaChart>
            </div>
          </div>
        </div>
      )}

      {/* Plant Registry Tab */}
      {activeTab === "Plant Registry" && (
        <div className="csp-registry px-6 space-y-4">
          <SearchFilterToolbar
            searchQuery={search}
            onSearchChange={setSearch}
            onClearSearch={() => setSearch("")}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={toggleFilter}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={records.length}
            filteredCount={filtered.length}
          />
          <div className="csp-table-wrap bg-white rounded-xl shadow-sm border border-stone-200 overflow-x-auto">
            <table className="csp-table w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  {columns.map((c) => (
                    <th
                      key={c.label}
                      className={`csp-th text-left px-3 py-2.5 font-semibold text-stone-600 whitespace-nowrap ${c.cls || ""}`}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => {
                  const sc = statusColor[r.status] || "slate";
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={r.id}
                      className={`csp-row border-b border-stone-100 hover:bg-orange-50 transition-colors ${
                        isEven ? "bg-white" : "bg-stone-50/50"
                      }`}
                    >
                      {columns.map((c) => {
                        if (c.key === "_sc") {
                          return (
                            <td
                              key="_sc"
                              className={`csp-td px-3 py-2 whitespace-nowrap`}
                            >
                              <span
                                className={`csp-status-badge inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${SC[sc]}`}
                              >
                                {r.status}
                              </span>
                            </td>
                          );
                        }
                        let val = r[c.key as keyof CspRecord];
                        if (c.key === "contractValue") {
                          val = formatINR(val as number) as unknown as string;
                        }
                        if (c.key === "solarField") {
                          val = `${(val as number).toLocaleString()}k m\u00b2`;
                        }
                        return (
                          <td
                            key={String(c.key)}
                            className={`csp-td px-3 py-2 text-stone-700 whitespace-nowrap ${c.cls || ""}`}
                          >
                            {String(val)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="csp-empty text-center py-12 text-stone-400"
                    >
                      No CSP records match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSP Analytics Tab */}
      {activeTab === "CSP Analytics" && (
        <div className="csp-analytics px-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="csp-chart-card bg-white rounded-xl shadow-sm border border-stone-200 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">
                Monthly Generation by CSP Technology (GWh)
              </h3>
              <BarChart width={500} height={280} data={monthlyGen}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="trough" name="Trough" fill="#9a3412" />
                <Bar dataKey="tower" name="Tower" fill="#ea580c" />
                <Bar dataKey="fresnel" name="Fresnel" fill="#fb923c" />
                <Bar dataKey="dish" name="Dish" fill="#fdba74" />
              </BarChart>
            </div>
            <div className="csp-chart-card bg-white rounded-xl shadow-sm border border-stone-200 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">
                CSP Technology Distribution (%)
              </h3>
              <PieChart width={500} height={280}>
                <Pie
                  data={techDist}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {techDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="csp-chart-card bg-white rounded-xl shadow-sm border border-stone-200 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">
                Capacity Factor: Actual vs Target (45%)
              </h3>
              <LineChart width={500} height={280} data={capacityFactor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 60]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual %"
                  stroke="#9a3412"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target %"
                  stroke="#dc2626"
                  strokeDasharray="6 3"
                  strokeWidth={2}
                />
              </LineChart>
            </div>
            <div className="csp-chart-card bg-white rounded-xl shadow-sm border border-stone-200 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">
                LCOE by Technology ($/MWh)
              </h3>
              <AreaChart width={500} height={280} data={lcoeCost}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="tech" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="lcoe"
                  name="LCOE $/MWh"
                  stroke="#9a3412"
                  fill="#fed7aa"
                  strokeWidth={2}
                />
              </AreaChart>
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "Insights" && (
        <div className="csp-insights px-6 space-y-4">
          {[
            {
              title: "India\u2019s 5000MW CSP Target by 2030",
              body: "The Government of India has set an ambitious target of deploying 5000MW of concentrated solar power capacity by 2030 under the National Solar Mission. With current installed base under 500MW, CSP represents a massive infrastructure opportunity requiring specialized logistics for mirror modules, receivers, molten salt tanks, and steam turbines across Rajasthan, Gujarat, and Telangana corridors.",
              accent: "border-l-[#9a3412]",
            },
            {
              title: "Rajasthan Jaisalmer \u2014 World\u2019s Largest Solar Park Hub",
              body: "Bhadla Solar Park in Jaisalmer, Rajasthan spans over 14,000 acres making it the world\u2019s largest solar park. With DNI exceeding 6.0 kWh/m\u00b2/day, Rajasthan is the ideal location for CSP deployment. Multiple 100MW+ solar tower and parabolic trough projects are under construction requiring heavy-haul logistics for receiver towers, molten salt storage tanks, and power block equipment.",
              accent: "border-l-[#ea580c]",
            },
            {
              title: "Molten Salt TES: 12-Hour Storage Enabling Night Power",
              body: "Advanced molten salt thermal energy storage (TES) systems with 8-12 hour capacity are game-changers for CSP, enabling round-the-clock power generation without fossil fuel backup. The 60% NaNO3 / 40% KNO3 salt mixture stores heat at 565\u00b0C, allowing steam turbines to operate well past sunset. India\u2019s latest tower projects target 12-hour storage for true baseload solar.",
              accent: "border-l-[#c2410c]",
            },
            {
              title: "CSP-PV Hybrid Reducing LCOE Below \u20b95/kWh",
              body: "Hybrid CSP-PV plants are emerging as the most cost-effective solution, combining PV\u2019s low daytime LCOE with CSP\u2019s thermal storage for evening peak dispatch. Next-generation 200MW hybrid plants in Maharashtra and Telangana are targeting blended LCOE below \u20b95/kWh, making CSP competitive with coal-based generation while providing dispatchable renewable energy to the grid.",
              accent: "border-l-[#f97316]",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`csp-insight-card bg-white rounded-xl shadow-sm border border-stone-200 p-5 border-l-4 ${card.accent}`}
            >
              <h3 className="text-base font-bold text-stone-800 mb-2">
                {card.title}
              </h3>
              <p className="csp-insight-text text-sm text-stone-600 leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
