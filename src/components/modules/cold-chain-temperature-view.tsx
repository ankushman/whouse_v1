"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  ThermometerSnowflake, Thermometer, Snowflake, AlertTriangle, AlertOctagon,
  CheckCircle2, XCircle, Clock, Search, Filter, Eye, Zap, Activity, Target,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3, Package,
  Battery, Wifi, Radio, Bluetooth, Warehouse, MapPin, IndianRupee, Leaf,
  Settings, Bell, ChevronRight, Info, ShieldCheck, Wind, Droplets,
  CircleDot, RefreshCw, BoxIcon, Beaker, Pill, Milk, FlaskConical,
  CalendarDays, Timer, FileText, Gauge, Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================
type TempZone = "ambient" | "chilled" | "cold" | "frozen" | "deep_frozen";
type SensorStatus = "online" | "offline" | "warning" | "critical";
type ExcursionSeverity = "minor" | "major" | "critical";
type ComplianceStatus = "compliant" | "warning" | "non_compliant";
type BatchStatus = "active" | "quarantined" | "expired" | "disposed";

const WAREHOUSES = [
  "Mumbai Central Hub", "Delhi NCR Facility", "Chennai Gateway",
  "Kolkata Distribution", "Bangalore South Hub", "Hyderabad Depot",
] as const;
type Warehouse = typeof WAREHOUSES[number];

const ZONE_LABELS: Record<TempZone, string> = {
  ambient: "Ambient (15-25°C)",
  chilled: "Chilled (2-8°C)",
  cold: "Cold (-2-4°C)",
  frozen: "Frozen (-18--25°C)",
  deep_frozen: "Deep Frozen (-40--60°C)",
};

const ZONE_COLORS: Record<TempZone, string> = {
  ambient: "#f59e0b",
  chilled: "#06b6d4",
  cold: "#3b82f6",
  frozen: "#8b5cf6",
  deep_frozen: "#ec4899",
};

const ZONE_TARGET: Record<TempZone, { temp: number; humidity: number; range: [number, number] }> = {
  ambient: { temp: 20, humidity: 55, range: [15, 25] },
  chilled: { temp: 5, humidity: 65, range: [2, 8] },
  cold: { temp: 2, humidity: 70, range: [-2, 4] },
  frozen: { temp: -20, humidity: 40, range: [-18, -25] },
  deep_frozen: { temp: -50, humidity: 30, range: [-40, -60] },
};

interface TempSensor {
  id: string;
  zone: TempZone;
  warehouse: string;
  location: string;
  currentTemp: number;
  currentHumidity: number;
  targetTemp: number;
  targetHumidity: number;
  tempRange: [number, number];
  status: SensorStatus;
  lastReading: number;
  batteryLevel: number;
  calibrationDue: number;
  sensorType: string;
  protocol: string;
}

interface TempExcursion {
  id: string;
  sensorId: string;
  warehouse: string;
  zone: TempZone;
  startTime: number;
  endTime: number | null;
  maxDeviation: number;
  durationMin: number;
  severity: ExcursionSeverity;
  affectedBatches: string[];
  rootCause: string;
  resolution: string | null;
  estimatedLoss: number;
}

interface ColdZone {
  id: string;
  name: string;
  warehouse: string;
  zoneType: TempZone;
  targetTemp: number;
  currentTemp: number;
  humidity: number;
  capacity: number;
  usedCapacity: number;
  sqft: number;
  products: number;
  doors: number;
  energyUsage: number;
  defrostCount: number;
  compliance: ComplianceStatus;
}

interface ProductBatch {
  id: string;
  productName: string;
  sku: string;
  warehouse: string;
  zone: TempZone;
  entryTemp: number;
  currentTemp: number;
  expiryDate: number;
  receivedDate: number;
  shelfLifeDays: number;
  remainingLife: number;
  quantity: number;
  unit: string;
  supplier: string;
  lotNumber: string;
  status: BatchStatus;
}

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
  const rand = seededRandom(120120);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
  const pickIdx = <T,>(arr: readonly T[]): number => Math.floor(rand() * arr.length);

  const now = Date.now();
  const hour = 3600000;

  const sensorTypes = ["PT100 RTD", "Thermocouple K", "DHT22", "DS18B20", "BME280", "SHT31"];
  const protocols = ["BLE 5.0", "WiFi 6", "LoRaWAN", "Zigbee 3.0"];
  const zoneTypes: TempZone[] = ["ambient", "chilled", "cold", "frozen", "deep_frozen"];
  const locations = ["Zone A-1", "Zone A-2", "Zone B-1", "Zone B-2", "Zone C-1", "Zone C-2", "Dock Area", "Receiving Bay", "Staging", "Cold Room 1", "Cold Room 2", "Blast Freezer", "Pre-cool Chamber", "Anteroom"];
  const rootCauses = ["Door left open > 5 min", "Defrost cycle failure", "Compressor malfunction", "Power fluctuation", "Sensor drift", "Human error during loading", "Insufficient pre-cooling", "Refrigerant leak", "Condenser fan failure", "Overloading beyond capacity"];
  const productNames: { name: string; cat: string }[] = [
    { name: "Insulin Glargine 100IU/ml", cat: "pharma" },
    { name: "Ciprofloxacin IV 200mg", cat: "pharma" },
    { name: "COVID-19 mRNA Vaccine", cat: "biologicals" },
    { name: "Oncology Biologics", cat: "biologicals" },
    { name: "Fresh Paneer Block 500g", cat: "dairy" },
    { name: "Amul Butter Salted 500g", cat: "dairy" },
    { name: "Frozen Chicken Breast 1kg", cat: "food" },
    { name: "Iced Shrimp 500g", cat: "food" },
    { name: "Fresh Strawberries 250g", cat: "food" },
    { name: "Milk Powder 1kg", cat: "dairy" },
    { name: "Lab Reagent HCl 1N", cat: "chemicals" },
    { name: "DNA Sample Kit", cat: "biologicals" },
    { name: "Ice Cream Premium 1L", cat: "food" },
    { name: "Prawns IQF 2kg", cat: "food" },
    { name: "Insulin Pen 300U", cat: "pharma" },
    { name: "Yogurt Probiotic 400g", cat: "dairy" },
    { name: "Chemical Solvent ACS", cat: "chemicals" },
    { name: "Blood Plasma Unit 300ml", cat: "biologicals" },
    { name: "Frozen Peas 1kg", cat: "food" },
    { name: "Cheese Cheddar Block 400g", cat: "dairy" },
  ];
  const suppliers = ["Sun Pharma", "Dr. Reddy's", "Amul Dairy", "ITC Foods", "Mother Dairy", "Cipla Ltd", "Biocon", "Lupin", "Aurobindo", "Nestle India"];
  const units = ["vials", "cartons", "units", "kg", "liters", "boxes", "packs"];

  // Generate 80 sensors
  const sensors: TempSensor[] = [];
  for (let i = 0; i < 80; i++) {
    const zone = pick(zoneTypes);
    const zt = ZONE_TARGET[zone];
    const tempOffset = (rand() - 0.4) * (zt.range[1] - zt.range[0]) * 0.6;
    const currentTemp = Math.round((zt.temp + tempOffset) * 10) / 10;
    const dev = Math.abs(currentTemp - zt.temp) / (Math.abs(zt.range[1] - zt.range[0]) || 1);
    const status: SensorStatus = rand() > 0.08
      ? dev > 0.8 ? (rand() > 0.5 ? "warning" : "critical") : "online"
      : rand() > 0.5 ? "offline" : "warning";

    sensors.push({
      id: `TS-${String(i + 1).padStart(3, "0")}`,
      zone,
      warehouse: pick(WAREHOUSES),
      location: pick(locations),
      currentTemp,
      currentHumidity: Math.round((zt.humidity + (rand() - 0.5) * 20) * 10) / 10,
      targetTemp: zt.temp,
      targetHumidity: zt.humidity,
      tempRange: zt.range,
      status,
      lastReading: now - Math.floor(rand() * 3600000),
      batteryLevel: Math.floor(rand() * 30) + 70,
      calibrationDue: now + Math.floor(rand() * 30 * 86400000),
      sensorType: pick(sensorTypes),
      protocol: pick(protocols),
    });
  }

  // Generate 35 excursions
  const excursions: TempExcursion[] = [];
  for (let i = 0; i < 35; i++) {
    const zone = pick(zoneTypes);
    const zt = ZONE_TARGET[zone];
    const isActive = i >= 20;
    const startOff = Math.floor(rand() * 72) * hour;
    const dur = Math.floor(rand() * 300) + 15;
    const sev: ExcursionSeverity = dur > 180 ? "critical" : dur > 60 ? "major" : "minor";
    const maxDev = sev === "critical" ? Math.floor(rand() * 15) + 8 : sev === "major" ? Math.floor(rand() * 8) + 3 : Math.floor(rand() * 3) + 1;
    const batchCount = Math.floor(rand() * 4) + 1;
    const batches = Array.from({ length: batchCount }, (_, j) => `BATCH-${String(1000 + i * 10 + j).padStart(4, "0")}`);

    excursions.push({
      id: `EXC-${String(i + 1).padStart(4, "0")}`,
      sensorId: `TS-${String(Math.floor(rand() * 80) + 1).padStart(3, "0")}`,
      warehouse: pick(WAREHOUSES),
      zone,
      startTime: now - startOff,
      endTime: isActive ? null : now - startOff + dur * 60000,
      maxDeviation: maxDev,
      durationMin: isActive ? Math.floor((now - (now - startOff)) / 60000) : dur,
      severity: sev,
      affectedBatches: batches,
      rootCause: pick(rootCauses),
      resolution: isActive ? null : pick(["Temperature restored via backup cooling", "Compressor repaired and tested", "Door sealed and protocol updated", "Sensor recalibrated", "Power restored via UPS", "Refrigerant topped up", "Fan motor replaced"]),
      estimatedLoss: Math.floor(rand() * 500000) + 5000,
    });
  }

  // Generate 24 cold storage zones
  const zones: ColdZone[] = [];
  for (let i = 0; i < 24; i++) {
    const zone = zoneTypes[i % 5];
    const zt = ZONE_TARGET[zone];
    const capacity = Math.floor(rand() * 200) + 50;
    const used = Math.floor(rand() * capacity * 0.8) + Math.floor(capacity * 0.2);
    const tempDev = (rand() - 0.4) * 4;
    const currentTemp = Math.round((zt.temp + tempDev) * 10) / 10;
    const comp: ComplianceStatus = Math.abs(tempDev) < 1.5 ? "compliant" : Math.abs(tempDev) < 3 ? "warning" : "non_compliant";

    zones.push({
      id: `CZ-${String(i + 1).padStart(3, "0")}`,
      name: `${pick(WAREHOUSES).split(" ")[0]} ${zone.charAt(0).toUpperCase() + zone.slice(1)} Zone ${i % 4 + 1}`,
      warehouse: WAREHOUSES[i % 6],
      zoneType: zone,
      targetTemp: zt.temp,
      currentTemp,
      humidity: Math.round((zt.humidity + (rand() - 0.5) * 15) * 10) / 10,
      capacity,
      usedCapacity: Math.min(used, capacity),
      sqft: Math.floor(rand() * 5000) + 1000,
      products: Math.floor(rand() * 30) + 5,
      doors: Math.floor(rand() * 4) + 1,
      energyUsage: Math.floor(rand() * 80) + 20,
      defrostCount: Math.floor(rand() * 6),
      compliance: comp,
    });
  }

  // Generate 60 product batches
  const batches: ProductBatch[] = [];
  for (let i = 0; i < 60; i++) {
    const zone = pick(zoneTypes);
    const zt = ZONE_TARGET[zone];
    const prod = pick(productNames);
    const shelfLife = Math.floor(rand() * 180) + 15;
    const receivedDays = Math.floor(rand() * shelfLife * 0.8);
    const remaining = Math.max(0, ((shelfLife - receivedDays) / shelfLife) * 100);
    const status: BatchStatus = remaining < 5 ? (rand() > 0.5 ? "expired" : "disposed") : remaining < 20 ? (rand() > 0.7 ? "quarantined" : "active") : "active";

    batches.push({
      id: `BATCH-${String(1000 + i).padStart(4, "0")}`,
      productName: prod.name,
      sku: `SKU-${String(20000 + i).padStart(5, "0")}`,
      warehouse: pick(WAREHOUSES),
      zone,
      entryTemp: Math.round((zt.temp + (rand() - 0.3) * 6) * 10) / 10,
      currentTemp: Math.round((zt.temp + (rand() - 0.4) * 4) * 10) / 10,
      expiryDate: now + (shelfLife - receivedDays) * 86400000,
      receivedDate: now - receivedDays * 86400000,
      shelfLifeDays: shelfLife,
      remainingLife: Math.round(remaining * 10) / 10,
      quantity: Math.floor(rand() * 500) + 10,
      unit: pick(units),
      supplier: pick(suppliers),
      lotNumber: `LOT-${String.fromCharCode(65 + Math.floor(rand() * 26))}${String.fromCharCode(65 + Math.floor(rand() * 26))}${String(Math.floor(rand() * 99999)).padStart(5, "0")}`,
      status,
    });
  }

  // 24h temperature readings per zone
  const hourlyTemp = zoneTypes.map((z) => {
    const zt = ZONE_TARGET[z];
    return Array.from({ length: 24 }, (_, h) => {
      const base = zt.temp;
      const noise = (rand() - 0.5) * 6;
      const cycle = Math.sin((h / 24) * Math.PI * 2) * 2;
      return {
        hour: `${String(h).padStart(2, "0")}:00`,
        temp: Math.round((base + noise + cycle) * 10) / 10,
        target: zt.temp,
        zone: z,
      };
    });
  });

  // Combined 24h chart data
  const tempTrend24h = Array.from({ length: 24 }, (_, h) => {
    const entry: Record<string, string | number> = { hour: `${String(h).padStart(2, "0")}:00` };
    zoneTypes.forEach((z) => {
      const readings = hourlyTemp.find((r) => r[0]?.zone === z);
      if (readings && readings[h]) {
        entry[z] = readings[h].temp;
      }
    });
    return entry;
  });

  // 12-month energy trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const energyTrend = months.map((m) => ({
    month: m,
    energy: Math.floor(rand() * 300) + 400,
    cost: Math.floor(rand() * 15000) + 30000,
    pue: Math.round((rand() * 0.5 + 1.2) * 100) / 100,
    carbon: Math.floor(rand() * 200) + 150,
    target: 200,
  }));

  // Defrost cycle data
  const defrostData = months.map((m) => ({
    month: m,
    frozen: Math.floor(rand() * 20) + 10,
    deep_frozen: Math.floor(rand() * 15) + 8,
    chilled: Math.floor(rand() * 10) + 5,
    cold: Math.floor(rand() * 8) + 4,
  }));

  // Monthly excursion count
  const excursionTrend = months.map((m) => ({
    month: m,
    minor: Math.floor(rand() * 5) + 1,
    major: Math.floor(rand() * 3),
    critical: Math.floor(rand() * 2),
  }));

  return { sensors, excursions, zones, batches, tempTrend24h, hourlyTemp, energyTrend, defrostData, excursionTrend, now };
}

const CHART_COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#10b981", "#ef4444", "#6366f1"];

const STATUS_COLORS: Record<SensorStatus, string> = {
  online: "#10b981",
  offline: "#6b7280",
  warning: "#f59e0b",
  critical: "#ef4444",
};

const SEVERITY_COLORS: Record<ExcursionSeverity, string> = {
  minor: "#f59e0b",
  major: "#f97316",
  critical: "#ef4444",
};

const PROTOCOL_ICONS: Record<string, React.ReactNode> = {
  "BLE 5.0": <Bluetooth className="h-3.5 w-3.5" />,
  "WiFi 6": <Wifi className="h-3.5 w-3.5" />,
  "LoRaWAN": <Radio className="h-3.5 w-3.5" />,
  "Zigbee 3.0": <Activity className="h-3.5 w-3.5" />,
};

// ============================================================================
// Component
// ============================================================================
export default function ColdChainTemperatureView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [filterZone, setFilterZone] = useState<string>("all");
  const [filterProtocol, setFilterProtocol] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterBatchStatus, setFilterBatchStatus] = useState<string>("all");
  const [selectedExcursion, setSelectedExcursion] = useState<TempExcursion | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null);

  const tabs = [
    "Cold Chain Overview",
    "Sensor Monitoring",
    "Excursion Tracker",
    "Cold Storage Inventory",
    "Energy & Sustainability",
  ];

  // Computed stats
  const onlineSensors = data.sensors.filter((s) => s.status === "online").length;
  const warningSensors = data.sensors.filter((s) => s.status === "warning").length;
  const criticalSensors = data.sensors.filter((s) => s.status === "critical").length;
  const compliancePct = Math.round(
    (data.sensors.filter((s) => s.status === "online").length / data.sensors.length) * 100
  );
  const activeExcursions = data.excursions.filter((e) => !e.endTime).length;
  const avgEnergy = Math.round(data.zones.reduce((s, z) => s + z.energyUsage, 0) / data.zones.length);
  const activeBatches = data.batches.filter((b) => b.status === "active").length;
  const activeZones = data.zones.filter((z) => z.usedCapacity > 0).length;

  // Warehouse compliance
  const warehouseCompliance = WAREHOUSES.map((wh) => {
    const whSensors = data.sensors.filter((s) => s.warehouse === wh);
    const online = whSensors.filter((s) => s.status === "online").length;
    return {
      warehouse: wh.split(" ")[0],
      compliance: Math.round((online / Math.max(whSensors.length, 1)) * 100),
    };
  });

  // Zone distribution
  const zoneDist = (["ambient", "chilled", "cold", "frozen", "deep_frozen"] as TempZone[]).map((z) => ({
    name: ZONE_LABELS[z].split(" ")[0],
    value: data.sensors.filter((s) => s.zone === z).length,
    color: ZONE_COLORS[z],
  }));

  // Protocol distribution
  const protocolDist = [...new Set(data.sensors.map((s) => s.protocol))].map((p) => ({
    name: p,
    value: data.sensors.filter((s) => s.protocol === p).length,
  }));

  // Root cause distribution
  const rootCauseDist = [...new Set(data.excursions.map((e) => e.rootCause))].map((rc) => ({
    name: rc.length > 25 ? rc.slice(0, 25) + "…" : rc,
    value: data.excursions.filter((e) => e.rootCause === rc).length,
  })).sort((a, b) => b.value - a.value).slice(0, 8);

  // Energy by zone type
  const energyByZone = (["ambient", "chilled", "cold", "frozen", "deep_frozen"] as TempZone[]).map((z) => ({
    zone: z.charAt(0).toUpperCase() + z.slice(1).replace("_", " "),
    energy: Math.round(data.zones.filter((zn) => zn.zoneType === z).reduce((s, zn) => s + zn.energyUsage, 0)),
    color: ZONE_COLORS[z],
  }));

  // Zone capacity chart data
  const zoneCapacityChart = (["ambient", "chilled", "cold", "frozen", "deep_frozen"] as TempZone[]).map((z) => {
    const zn = data.zones.filter((zone) => zone.zoneType === z);
    return {
      zone: z.charAt(0).toUpperCase() + z.slice(1).replace("_", " "),
      used: zn.reduce((s, zone) => s + zone.usedCapacity, 0),
      available: zn.reduce((s, zone) => s + (zone.capacity - zone.usedCapacity), 0),
    };
  });

  // Product category distribution
  const catCounts: Record<string, number> = {};
  data.batches.forEach((b) => {
    const prod = (b.productName.includes("Insulin") || b.productName.includes("Cipro") || b.productName.includes("Pen")) ? "pharma"
      : (b.productName.includes("mRNA") || b.productName.includes("Biologics") || b.productName.includes("DNA") || b.productName.includes("Plasma")) ? "biologicals"
      : (b.productName.includes("Paneer") || b.productName.includes("Butter") || b.productName.includes("Yogurt") || b.productName.includes("Milk") || b.productName.includes("Cheese")) ? "dairy"
      : (b.productName.includes("Reagent") || b.productName.includes("Solvent")) ? "chemicals"
      : "food";
    catCounts[prod] = (catCounts[prod] || 0) + 1;
  });
  const catDist = Object.entries(catCounts).map(([name, value]) => ({ name, value }));

  // PUE radar data per warehouse
  const pueRadar = WAREHOUSES.map((wh) => {
    const whZones = data.zones.filter((z) => z.warehouse === wh);
    const avgEnergy = whZones.length ? Math.round(whZones.reduce((s, z) => s + z.energyUsage, 0) / whZones.length) : 0;
    const comp = whZones.length ? Math.round((whZones.filter((z) => z.compliance === "compliant").length / whZones.length) * 100) : 0;
    return {
      warehouse: wh.split(" ")[0],
      energy: Math.min(avgEnergy, 100),
      efficiency: Math.max(100 - avgEnergy, 10),
      compliance: comp,
      carbon: Math.floor(avgEnergy * 1.5),
    };
  });

  // Filtered data
  const filteredSensors = useMemo(() => {
    return data.sensors.filter((s) => {
      if (searchTerm && !s.id.toLowerCase().includes(searchTerm.toLowerCase()) && !s.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      if (filterWarehouse !== "all" && s.warehouse !== filterWarehouse) return false;
      if (filterZone !== "all" && s.zone !== filterZone) return false;
      if (filterProtocol !== "all" && s.protocol !== filterProtocol) return false;
      return true;
    });
  }, [data.sensors, searchTerm, filterStatus, filterWarehouse, filterZone, filterProtocol]);

  const filteredExcursions = useMemo(() => {
    return data.excursions.filter((e) => {
      if (searchTerm && !e.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterSeverity !== "all" && e.severity !== filterSeverity) return false;
      if (filterWarehouse !== "all" && e.warehouse !== filterWarehouse) return false;
      if (filterZone !== "all" && e.zone !== filterZone) return false;
      return true;
    });
  }, [data.excursions, searchTerm, filterSeverity, filterWarehouse, filterZone]);

  const filteredBatches = useMemo(() => {
    return data.batches.filter((b) => {
      if (searchTerm && !b.productName.toLowerCase().includes(searchTerm.toLowerCase()) && !b.sku.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterWarehouse !== "all" && b.warehouse !== filterWarehouse) return false;
      if (filterZone !== "all" && b.zone !== filterZone) return false;
      if (filterBatchStatus !== "all" && b.status !== filterBatchStatus) return false;
      return true;
    });
  }, [data.batches, searchTerm, filterWarehouse, filterZone, filterBatchStatus]);

  const fmt = (n: number) => n.toLocaleString("en-IN");
  const fmtTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) + " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };
  const fmtDur = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const totalEnergyCost = Math.round(data.energyTrend.reduce((s, e) => s + e.cost, 0) / 12);
  const totalCarbon = Math.round(data.energyTrend.reduce((s, e) => s + e.carbon, 0) / 12);
  const avgPue = Math.round((data.energyTrend.reduce((s, e) => s + e.pue, 0) / 12) * 100) / 100;

  return (
    <div className="cc-container space-y-4">
      {/* Header */}
      <div className="cc-header">
        <div className="cc-header-content">
          <div className="cc-header-icon-wrap">
            <ThermometerSnowflake className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="cc-header-title">Cold Chain &amp; Temperature Logistics</h1>
            <p className="cc-header-subtitle">Real-time temperature monitoring, excursion tracking, and cold storage management across 6 warehouses</p>
          </div>
        </div>
        <div className="cc-header-badges">
          <div className="cc-header-badge cc-badge-green">
            <Activity className="h-3.5 w-3.5" />
            <span>{onlineSensors} Active Sensors</span>
          </div>
          <div className="cc-header-badge cc-badge-red">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{activeExcursions} Excursions Today</span>
          </div>
          <div className="cc-header-badge cc-badge-blue">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{compliancePct}% Compliance</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cc-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`cc-tab ${activeTab === i ? "cc-tab-active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: Cold Chain Overview */}
      {activeTab === 0 && (
        <div className="cc-tab-content space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Active Sensors", value: onlineSensors, total: data.sensors.length, icon: Thermometer, color: "cc-kpi-cyan" },
              { label: "Temp. Compliance", value: `${compliancePct}%`, icon: Target, color: "cc-kpi-green" },
              { label: "Excursions Today", value: activeExcursions, icon: AlertTriangle, color: "cc-kpi-red" },
              { label: "Avg Energy", value: `${avgEnergy} kWh`, sub: "/day", icon: Zap, color: "cc-kpi-amber" },
              { label: "Monitored SKUs", value: activeBatches, icon: Package, color: "cc-kpi-purple" },
              { label: "Zones Active", value: activeZones, total: data.zones.length, icon: Snowflake, color: "cc-kpi-blue" },
            ].map((kpi, i) => (
              <Card key={i} className={`cc-kpi-card ${kpi.color} cc-stagger-${Math.min(i, 5)}`}>
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className="h-4 w-4 cc-kpi-icon" />
                    {kpi.total && <span className="cc-kpi-total">/ {kpi.total}</span>}
                  </div>
                  <div className="cc-kpi-value">{kpi.value}</div>
                  <div className="cc-kpi-label">
                    {kpi.label}
                    {kpi.sub && <span className="cc-kpi-sub"> {kpi.sub}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Zone Temperature Map + Compliance by Warehouse */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Zone Temp Map */}
            <Card className="cc-card cc-stagger-6">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title">
                  <Thermometer className="h-4 w-4" /> Zone Temperature Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {data.zones.slice(0, 12).map((zone, i) => {
                    const dev = Math.abs(zone.currentTemp - zone.targetTemp);
                    const tempColor = dev < 1.5 ? "cc-zone-ok" : dev < 3 ? "cc-zone-warn" : "cc-zone-crit";
                    return (
                      <div key={zone.id} className={`cc-zone-card ${tempColor}`}>
                        <div className="cc-zone-card-header">
                          <span className="cc-zone-name">{zone.name.split(" ").slice(0, 2).join(" ")}</span>
                          <Badge variant={zone.compliance === "compliant" ? "success" : zone.compliance === "warning" ? "warning" : "destructive"} className="badge-interactive text-[10px] px-1.5 py-0">
                            {zone.compliance}
                          </Badge>
                        </div>
                        <div className="cc-zone-temp-row">
                          <Thermometer className={`h-3.5 w-3.5 ${tempColor === "cc-zone-ok" ? "text-emerald-500" : tempColor === "cc-zone-warn" ? "text-amber-500" : "text-red-500"}`} />
                          <span className="cc-zone-temp">{zone.currentTemp}°C</span>
                        </div>
                        <div className="cc-zone-meta">
                          <span>Target: {zone.targetTemp}°C</span>
                          <Droplets className="h-3 w-3" />
                          <span>{zone.humidity}%</span>
                        </div>
                        <div className="cc-zone-bar-wrap">
                          <div className="cc-zone-bar" style={{ width: `${(zone.usedCapacity / zone.capacity) * 100}%` }} />
                          <span className="cc-zone-bar-label">{Math.round((zone.usedCapacity / zone.capacity) * 100)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Compliance by Warehouse */}
            <Card className="cc-card cc-stagger-7">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title">
                  <ShieldCheck className="h-4 w-4" /> Compliance by Warehouse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cc-compliance-list">
                  {warehouseCompliance.map((wh, i) => (
                    <div key={wh.warehouse} className="cc-compliance-row">
                      <span className="cc-compliance-label">{wh.warehouse}</span>
                      <div className="cc-compliance-bar-wrap">
                        <div
                          className={`cc-compliance-bar ${wh.compliance >= 85 ? "cc-bar-green" : wh.compliance >= 60 ? "cc-bar-amber" : "cc-bar-red"}`}
                          style={{ width: `${wh.compliance}%` }}
                        />
                      </div>
                      <span className={`cc-compliance-value ${wh.compliance >= 85 ? "text-emerald-600" : wh.compliance >= 60 ? "text-amber-600" : "text-red-600"}`}>
                        {wh.compliance}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 24h Temperature Trend + Zone Distribution + Energy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="cc-card lg:col-span-2 cc-stagger-8">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title">
                  <Activity className="h-4 w-4" /> 24h Temperature Trend (All Zones)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.tempTrend24h}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {(["frozen", "chilled", "ambient"] as TempZone[]).map((z, i) => (
                        <Area key={z} type="monotone" dataKey={z} stroke={ZONE_COLORS[z]} fill={ZONE_COLORS[z]} fillOpacity={0.15} name={ZONE_LABELS[z].split(" ")[0]} strokeWidth={2} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cc-card cc-stagger-9">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title">
                  <Layers className="h-4 w-4" /> Zone Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={zoneDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {zoneDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 1: Sensor Monitoring */}
      {activeTab === 1 && (
        <div className="cc-tab-content space-y-4">
          {/* Filter Bar */}
          <Card className="cc-filter-card">
            <CardContent className="glass-subtle p-3 flex flex-wrap items-center gap-3">
              <div className="cc-filter-search">
                <Search className="h-3.5 w-3.5" />
                <input placeholder="Search sensor ID or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="cc-filter-input" />
              </div>
              <select className="cc-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
              <select className="cc-filter-select" value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {WAREHOUSES.map((wh) => <option key={wh} value={wh}>{wh.split(" ")[0]}</option>)}
              </select>
              <select className="cc-filter-select" value={filterZone} onChange={(e) => setFilterZone(e.target.value)}>
                <option value="all">All Zones</option>
                {(["ambient", "chilled", "cold", "frozen", "deep_frozen"] as TempZone[]).map((z) => <option key={z} value={z}>{ZONE_LABELS[z]}</option>)}
              </select>
              <select className="cc-filter-select" value={filterProtocol} onChange={(e) => setFilterProtocol(e.target.value)}>
                <option value="all">All Protocols</option>
                {["BLE 5.0", "WiFi 6", "LoRaWAN", "Zigbee 3.0"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <span className="cc-filter-count">{filteredSensors.length} sensors</span>
            </CardContent>
          </Card>

          {/* Sensor Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Sensors", value: data.sensors.length, color: "cc-kpi-cyan" },
              { label: "Online", value: onlineSensors, color: "cc-kpi-green" },
              { label: "Warnings", value: warningSensors, color: "cc-kpi-amber" },
              { label: "Critical", value: criticalSensors, color: "cc-kpi-red" },
            ].map((kpi, i) => (
              <Card key={i} className={`cc-kpi-card ${kpi.color}`}>
                <CardContent className="glass-subtle p-4">
                  <div className="cc-kpi-value">{kpi.value}</div>
                  <div className="cc-kpi-label">{kpi.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sensor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSensors.slice(0, 40).map((sensor, i) => {
              const dev = Math.abs(sensor.currentTemp - sensor.targetTemp);
              const tempClass = dev < 1.5 ? "cc-sensor-ok" : dev < 3 ? "cc-sensor-warn" : "cc-sensor-crit";
              const statusClass = sensor.status === "online" ? "cc-sensor-online" : sensor.status === "offline" ? "cc-sensor-offline" : sensor.status === "warning" ? "cc-sensor-warning" : "cc-sensor-critical";
              const battClass = sensor.batteryLevel > 80 ? "cc-batt-ok" : sensor.batteryLevel > 50 ? "cc-batt-mid" : "cc-batt-low";
              return (
                <Card key={sensor.id} className={`cc-sensor-card ${tempClass} cc-stagger-${Math.min(i % 20, 11)}`}>
                  <CardContent className="glass-subtle p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="cc-sensor-id">{sensor.id}</span>
                      <Badge className={`cc-sensor-status ${statusClass} text-[10px] px-1.5 py-0`}>
                        {sensor.status}
                      </Badge>
                    </div>
                    <div className="cc-sensor-location">{sensor.location} — {sensor.warehouse.split(" ")[0]}</div>
                    <div className="cc-sensor-temp-row">
                      <Thermometer className={`h-5 w-5 ${tempClass === "cc-sensor-ok" ? "text-emerald-500" : tempClass === "cc-sensor-warn" ? "text-amber-500" : "text-red-500"}`} />
                      <span className={`cc-sensor-temp ${tempClass}`}>{sensor.currentTemp}°C</span>
                      <Droplets className="h-3.5 w-3.5 text-blue-400 ml-2" />
                      <span className="cc-sensor-humidity">{sensor.currentHumidity}%</span>
                    </div>
                    <div className="cc-sensor-target">
                      Target: {sensor.targetTemp}°C ({sensor.tempRange[0]}° ~ {sensor.tempRange[1]}°)
                    </div>
                    <div className="cc-sensor-meta-row">
                      <span className="cc-sensor-type">{sensor.sensorType}</span>
                      <span className="cc-sensor-protocol">{PROTOCOL_ICONS[sensor.protocol]} {sensor.protocol}</span>
                    </div>
                    <div className="cc-sensor-bar-section">
                      <div className="flex items-center justify-between mb-1">
                        <span className="cc-sensor-bar-label">Battery</span>
                        <span className={`cc-sensor-batt-text ${battClass}`}>{sensor.batteryLevel}%</span>
                      </div>
                      <div className="cc-sensor-bar-bg">
                        <div className={`cc-sensor-bar ${battClass}`} style={{ width: `${sensor.batteryLevel}%` }} />
                      </div>
                    </div>
                    <div className="cc-sensor-footer">
                      <span>Cal. due: {new Date(sensor.calibrationDue).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                      <span className="text-muted-foreground">{timeAgo(sensor.lastReading)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Protocol Distribution */}
          <Card className="cc-card">
            <CardHeader className="pb-2">
              <CardTitle className="cc-card-title">
                <Wifi className="h-4 w-4" /> Protocol Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={protocolDist} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {protocolDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Excursion Tracker */}
      {activeTab === 2 && (
        <div className="cc-tab-content space-y-4">
          {/* Filter Bar */}
          <Card className="cc-filter-card">
            <CardContent className="glass-subtle p-3 flex flex-wrap items-center gap-3">
              <div className="cc-filter-search">
                <Search className="h-3.5 w-3.5" />
                <input placeholder="Search excursion ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="cc-filter-input" />
              </div>
              <select className="cc-filter-select" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                <option value="all">All Severity</option>
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
              <select className="cc-filter-select" value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {WAREHOUSES.map((wh) => <option key={wh} value={wh}>{wh.split(" ")[0]}</option>)}
              </select>
              <select className="cc-filter-select" value={filterZone} onChange={(e) => setFilterZone(e.target.value)}>
                <option value="all">All Zones</option>
                {(["ambient", "chilled", "cold", "frozen", "deep_frozen"] as TempZone[]).map((z) => <option key={z} value={z}>{ZONE_LABELS[z]}</option>)}
              </select>
              <span className="cc-filter-count">{filteredExcursions.length} excursions</span>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Excursion Table */}
            <Card className="cc-card lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title">
                  <AlertOctagon className="h-4 w-4" /> Excursion Register
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="cc-table w-full">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Zone</th>
                        <th>Warehouse</th>
                        <th>Duration</th>
                        <th>Max Dev.</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Loss</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExcursions.map((exc) => (
                        <tr key={exc.id} className="cc-table-row">
                          <td className="font-mono text-xs">{exc.id}</td>
                          <td><Badge variant="outline" className="badge-interactive text-[10px]">{exc.zone}</Badge></td>
                          <td className="text-xs">{exc.warehouse.split(" ")[0]}</td>
                          <td className="text-xs">{fmtDur(exc.durationMin)}</td>
                          <td className="text-xs font-semibold">{exc.maxDeviation}°C</td>
                          <td>
                            <Badge className={`cc-sev-badge cc-sev-${exc.severity} text-[10px]`}>
                              {exc.severity}
                            </Badge>
                          </td>
                          <td>
                            {exc.endTime
                              ? <Badge variant="success" className="badge-interactive text-[10px]">Resolved</Badge>
                              : <Badge variant="destructive" className="badge-interactive text-[10px]">Active</Badge>}
                          </td>
                          <td className="text-xs">₹{fmt(exc.estimatedLoss)}</td>
                          <td>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedExcursion(exc)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Charts Column */}
            <div className="space-y-4">
              <Card className="cc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="cc-card-title text-sm">
                    <AlertTriangle className="h-4 w-4" /> Severity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: "Minor", value: data.excursions.filter((e) => e.severity === "minor").length },
                          { name: "Major", value: data.excursions.filter((e) => e.severity === "major").length },
                          { name: "Critical", value: data.excursions.filter((e) => e.severity === "critical").length },
                        ]} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={3}>
                          <Cell fill={SEVERITY_COLORS.minor} />
                          <Cell fill={SEVERITY_COLORS.major} />
                          <Cell fill={SEVERITY_COLORS.critical} />
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="cc-card">
                <CardHeader className="pb-2">
                  <CardTitle className="cc-card-title text-sm">
                    <FileText className="h-4 w-4" /> Top Root Causes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rootCauseDist} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={120} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Monthly Excursion Trend */}
          <Card className="cc-card">
            <CardHeader className="pb-2">
              <CardTitle className="cc-card-title">
                <BarChart3 className="h-4 w-4" /> Monthly Excursion Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.excursionTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="minor" stackId="a" fill={SEVERITY_COLORS.minor} name="Minor" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="major" stackId="a" fill={SEVERITY_COLORS.major} name="Major" />
                    <Bar dataKey="critical" stackId="a" fill={SEVERITY_COLORS.critical} name="Critical" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Excursion Detail Drawer */}
          {selectedExcursion && (
            <div className="cc-drawer-backdrop" onClick={() => setSelectedExcursion(null)}>
              <div className="cc-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="cc-drawer-header">
                  <h3 className="cc-drawer-title">Excursion Detail: {selectedExcursion.id}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedExcursion(null)} className="h-8 w-8 p-0">
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="cc-drawer-body space-y-4">
                  <div className="cc-drawer-section">
                    <h4 className="cc-drawer-section-title">Overview</h4>
                    <div className="cc-drawer-grid">
                      <div><span className="cc-drawer-label">Zone</span><span className="cc-drawer-value">{selectedExcursion.zone}</span></div>
                      <div><span className="cc-drawer-label">Warehouse</span><span className="cc-drawer-value">{selectedExcursion.warehouse}</span></div>
                      <div><span className="badge-interactive cc-drawer-label">Severity</span><Badge className={`cc-sev-badge cc-sev-${selectedExcursion.severity}`}>{selectedExcursion.severity}</Badge></div>
                      <div><span className="cc-drawer-label">Duration</span><span className="cc-drawer-value">{fmtDur(selectedExcursion.durationMin)}</span></div>
                      <div><span className="cc-drawer-label">Max Deviation</span><span className="cc-drawer-value font-semibold text-red-600">{selectedExcursion.maxDeviation}°C</span></div>
                      <div><span className="cc-drawer-label">Status</span>
                        {selectedExcursion.endTime
                          ? <Badge variant="success">Resolved</Badge>
                          : <Badge variant="destructive">Active</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="cc-drawer-section">
                    <h4 className="cc-drawer-section-title">Timeline</h4>
                    <div className="cc-drawer-timeline">
                      <div className="cc-drawer-timeline-bar" style={{ width: `${Math.min((selectedExcursion.durationMin / 300) * 100, 100)}%` }}>
                        <span className="cc-drawer-timeline-dot" />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Start: {fmtTime(selectedExcursion.startTime)}</span>
                      <span>{selectedExcursion.endTime ? `End: ${fmtTime(selectedExcursion.endTime)}` : "Ongoing..."}</span>
                    </div>
                  </div>
                  <div className="cc-drawer-section">
                    <h4 className="cc-drawer-section-title">Affected Batches ({selectedExcursion.affectedBatches.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedExcursion.affectedBatches.map((b) => (
                        <Badge key={b} variant="outline" className="badge-interactive text-xs font-mono">{b}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="cc-drawer-section">
                    <h4 className="cc-drawer-section-title">Root Cause</h4>
                    <p className="cc-drawer-text">{selectedExcursion.rootCause}</p>
                  </div>
                  {selectedExcursion.resolution && (
                    <div className="cc-drawer-section">
                      <h4 className="cc-drawer-section-title">Resolution</h4>
                      <p className="cc-drawer-text">{selectedExcursion.resolution}</p>
                    </div>
                  )}
                  <div className="cc-drawer-section">
                    <h4 className="cc-drawer-section-title">Estimated Loss</h4>
                    <span className="cc-drawer-loss">₹{fmt(selectedExcursion.estimatedLoss)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Cold Storage Inventory */}
      {activeTab === 3 && (
        <div className="cc-tab-content space-y-4">
          {/* Filter Bar */}
          <Card className="cc-filter-card">
            <CardContent className="glass-subtle p-3 flex flex-wrap items-center gap-3">
              <div className="cc-filter-search">
                <Search className="h-3.5 w-3.5" />
                <input placeholder="Search product or SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="cc-filter-input" />
              </div>
              <select className="cc-filter-select" value={filterZone} onChange={(e) => setFilterZone(e.target.value)}>
                <option value="all">All Zones</option>
                {(["ambient", "chilled", "cold", "frozen", "deep_frozen"] as TempZone[]).map((z) => <option key={z} value={z}>{ZONE_LABELS[z]}</option>)}
              </select>
              <select className="cc-filter-select" value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {WAREHOUSES.map((wh) => <option key={wh} value={wh}>{wh.split(" ")[0]}</option>)}
              </select>
              <select className="cc-filter-select" value={filterBatchStatus} onChange={(e) => setFilterBatchStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="quarantined">Quarantined</option>
                <option value="expired">Expired</option>
                <option value="disposed">Disposed</option>
              </select>
              <span className="cc-filter-count">{filteredBatches.length} batches</span>
            </CardContent>
          </Card>

          {/* Cold Storage Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.zones.slice(0, 8).map((zone, i) => (
              <Card key={zone.id} className={`cc-zone-detail-card cc-stagger-${Math.min(i, 7)}`}>
                <CardContent className="glass-subtle p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="cc-zone-detail-name">{zone.id}</span>
                    <Badge variant={zone.compliance === "compliant" ? "success" : zone.compliance === "warning" ? "warning" : "destructive"} className="badge-interactive text-[10px] px-1.5 py-0">
                      {zone.compliance}
                    </Badge>
                  </div>
                  <div className="cc-zone-detail-type">{zone.zoneType} — {zone.warehouse.split(" ")[0]}</div>
                  <div className="cc-zone-detail-metrics">
                    <div className="cc-zone-detail-metric">
                      <Thermometer className="h-3.5 w-3.5" />
                      <span>{zone.currentTemp}°C</span>
                    </div>
                    <div className="cc-zone-detail-metric">
                      <Droplets className="h-3.5 w-3.5" />
                      <span>{zone.humidity}%</span>
                    </div>
                    <div className="cc-zone-detail-metric">
                      <Zap className="h-3.5 w-3.5" />
                      <span>{zone.energyUsage} kWh</span>
                    </div>
                  </div>
                  <div className="cc-zone-detail-bar-section">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Capacity</span>
                      <span>{zone.usedCapacity}/{zone.capacity} pallets</span>
                    </div>
                    <div className="cc-sensor-bar-bg">
                      <div className={`cc-sensor-bar ${zone.usedCapacity / zone.capacity > 0.85 ? "cc-batt-low" : zone.usedCapacity / zone.capacity > 0.6 ? "cc-batt-mid" : "cc-batt-ok"}`} style={{ width: `${(zone.usedCapacity / zone.capacity) * 100}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Batch Table */}
          <Card className="cc-card">
            <CardHeader className="pb-2">
              <CardTitle className="cc-card-title">
                <Package className="h-4 w-4" /> Product Batch Register
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="cc-table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Zone</th>
                      <th>WH</th>
                      <th>Temp</th>
                      <th>Shelf Life</th>
                      <th>Remaining</th>
                      <th>Qty</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches.slice(0, 30).map((batch) => {
                      const lifeColor = batch.remainingLife > 60 ? "cc-life-ok" : batch.remainingLife > 20 ? "cc-life-warn" : "cc-life-crit";
                      return (
                        <tr key={batch.id} className="cc-table-row">
                          <td className="font-mono text-xs">{batch.id}</td>
                          <td className="text-xs max-w-[160px] truncate">{batch.productName}</td>
                          <td><Badge variant="outline" className="badge-interactive text-[10px]">{batch.zone}</Badge></td>
                          <td className="text-xs">{batch.warehouse.split(" ")[0]}</td>
                          <td className="text-xs">{batch.currentTemp}°C</td>
                          <td className="text-xs">{batch.shelfLifeDays}d</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="cc-shelf-bar-bg w-12">
                                <div className={`cc-shelf-bar ${lifeColor}`} style={{ width: `${batch.remainingLife}%` }} />
                              </div>
                              <span className={`text-xs font-semibold ${lifeColor === "cc-life-ok" ? "text-emerald-600" : lifeColor === "cc-life-warn" ? "text-amber-600" : "text-red-600"}`}>
                                {batch.remainingLife}%
                              </span>
                            </div>
                          </td>
                          <td className="text-xs">{batch.quantity} {batch.unit}</td>
                          <td>
                            <Badge variant={batch.status === "active" ? "success" : batch.status === "quarantined" ? "warning" : "destructive"} className="badge-interactive text-[10px]">
                              {batch.status}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedBatch(batch)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Zone Capacity + Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="cc-card">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title">
                  <Layers className="h-4 w-4" /> Zone Capacity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zoneCapacityChart}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="zone" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="used" stackId="a" fill="#06b6d4" name="Used" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="available" stackId="a" fill="#e5e7eb" name="Available" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cc-card">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title">
                  <Beaker className="h-4 w-4" /> Product Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={catDist} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                        {catDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Batch Detail Drawer */}
          {selectedBatch && (
            <div className="cc-drawer-backdrop" onClick={() => setSelectedBatch(null)}>
              <div className="cc-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="cc-drawer-header">
                  <h3 className="cc-drawer-title">Batch Detail: {selectedBatch.id}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedBatch(null)} className="h-8 w-8 p-0">
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="cc-drawer-body space-y-4">
                  <div className="cc-drawer-section">
                    <h4 className="cc-drawer-section-title">Product Information</h4>
                    <div className="cc-drawer-grid">
                      <div><span className="cc-drawer-label">Product</span><span className="cc-drawer-value">{selectedBatch.productName}</span></div>
                      <div><span className="cc-drawer-label">SKU</span><span className="cc-drawer-value font-mono">{selectedBatch.sku}</span></div>
                      <div><span className="cc-drawer-label">Lot Number</span><span className="cc-drawer-value font-mono">{selectedBatch.lotNumber}</span></div>
                      <div><span className="cc-drawer-label">Supplier</span><span className="cc-drawer-value">{selectedBatch.supplier}</span></div>
                      <div><span className="cc-drawer-label">Quantity</span><span className="cc-drawer-value">{selectedBatch.quantity} {selectedBatch.unit}</span></div>
                      <div><span className="cc-drawer-label">Status</span>
                        <Badge variant={selectedBatch.status === "active" ? "success" : selectedBatch.status === "quarantined" ? "warning" : "destructive"}>
                          {selectedBatch.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="cc-drawer-section">
                    <h4 className="cc-drawer-section-title">Temperature Chain</h4>
                    <div className="cc-drawer-temp-chain">
                      <div className="cc-drawer-temp-node">
                        <span className="text-xs text-muted-foreground">Entry</span>
                        <span className="cc-drawer-temp-val">{selectedBatch.entryTemp}°C</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <div className="cc-drawer-temp-node">
                        <span className="text-xs text-muted-foreground">Current</span>
                        <span className="cc-drawer-temp-val">{selectedBatch.currentTemp}°C</span>
                      </div>
                      <div className="ml-4 text-xs text-muted-foreground">
                        Deviation: {Math.abs(selectedBatch.currentTemp - selectedBatch.entryTemp).toFixed(1)}°C
                      </div>
                    </div>
                  </div>
                  <div className="cc-drawer-section">
                    <h4 className="cc-drawer-section-title">Shelf Life</h4>
                    <div className="flex items-center gap-4">
                      <div className="cc-drawer-shelf-ring">
                        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
                          <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                          <circle cx="40" cy="40" r="35" fill="none"
                            stroke={selectedBatch.remainingLife > 60 ? "#10b981" : selectedBatch.remainingLife > 20 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="6" strokeLinecap="round"
                            strokeDasharray={`${(selectedBatch.remainingLife / 100) * 220} ${220}`}
                          />
                        </svg>
                        <div className="cc-drawer-shelf-text">
                          <span className="text-lg font-bold">{selectedBatch.remainingLife}%</span>
                          <span className="text-[10px] text-muted-foreground">remaining</span>
                        </div>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>Total shelf life: <strong>{selectedBatch.shelfLifeDays} days</strong></div>
                        <div>Received: {fmtTime(selectedBatch.receivedDate)}</div>
                        <div>Expiry: {fmtTime(selectedBatch.expiryDate)}</div>
                        <div>Zone: <Badge variant="outline" className="badge-interactive text-[10px]">{selectedBatch.zone}</Badge></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Energy & Sustainability */}
      {activeTab === 4 && (
        <div className="cc-tab-content space-y-4">
          {/* Energy KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Energy", value: `${data.zones.reduce((s, z) => s + z.energyUsage, 0)} kWh`, sub: "/day", icon: Zap, color: "cc-kpi-cyan" },
              { label: "Energy Cost", value: `₹${fmt(totalEnergyCost)}`, sub: "/day avg", icon: IndianRupee, color: "cc-kpi-amber" },
              { label: "PUE Score", value: `${avgPue}`, sub: "lower is better", icon: Gauge, color: "cc-kpi-green" },
              { label: "Carbon Footprint", value: `${totalCarbon} kg`, sub: "CO₂/day", icon: Leaf, color: "cc-kpi-purple" },
            ].map((kpi, i) => (
              <Card key={i} className={`cc-kpi-card ${kpi.color}`}>
                <CardContent className="glass-subtle p-4">
                  <kpi.icon className="h-4 w-4 cc-kpi-icon mb-2" />
                  <div className="cc-kpi-value">{kpi.value}</div>
                  <div className="cc-kpi-label">{kpi.label} <span className="cc-kpi-sub">{kpi.sub}</span></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Energy by Zone */}
            <Card className="cc-card">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title">
                  <Zap className="h-4 w-4" /> Energy by Zone Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyByZone}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="zone" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Bar dataKey="energy" fill="#06b6d4" radius={[4, 4, 0, 0]} name="kWh/day" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Defrost Cycles */}
            <Card className="cc-card">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title">
                  <Snowflake className="h-4 w-4" /> Defrost Cycle Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.defrostData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="frozen" stackId="d" fill="#8b5cf6" name="Frozen" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="deep_frozen" stackId="d" fill="#ec4899" name="Deep Frozen" />
                      <Bar dataKey="chilled" stackId="d" fill="#06b6d4" name="Chilled" />
                      <Bar dataKey="cold" stackId="d" fill="#3b82f6" name="Cold" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Energy Trend with cost */}
          <Card className="cc-card">
            <CardHeader className="pb-2">
              <CardTitle className="cc-card-title">
                <TrendingUp className="h-4 w-4" /> Energy & Cost Trend (12 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.energyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area yAxisId="left" type="monotone" dataKey="energy" fill="#06b6d4" stroke="#06b6d4" fillOpacity={0.2} name="Energy (kWh)" />
                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} name="Cost (₹)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PUE Trend + Carbon + Sustainability Scorecard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="cc-card">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title text-sm">
                  <Gauge className="h-4 w-4" /> PUE Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.energyTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={[1, 2]} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Line type="monotone" dataKey="pue" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="PUE" />
                      <Line type="monotone" dataKey={() => 1.5} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} name="Target" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cc-card">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title text-sm">
                  <Leaf className="h-4 w-4" /> Carbon Footprint (kg CO₂)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.energyTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Area type="monotone" dataKey="carbon" fill="#10b981" stroke="#10b981" fillOpacity={0.3} name="kg CO₂" />
                      <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} name="Target" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cc-card">
              <CardHeader className="pb-2">
                <CardTitle className="cc-card-title text-sm">
                  <Target className="h-4 w-4" /> Sustainability Scorecard
                </CardTitle>
              </CardHeader>
              <CardContent className="glass-subtle space-y-3">
                {[
                  { label: "Energy Efficiency", value: 78, color: "bg-emerald-500" },
                  { label: "Carbon Reduction", value: 62, color: "bg-cyan-500" },
                  { label: "Compliance Rate", value: compliancePct, color: "bg-blue-500" },
                  { label: "Recycling Rate", value: 45, color: "bg-purple-500" },
                  { label: "Waste Reduction", value: 71, color: "bg-amber-500" },
                  { label: "Water Conservation", value: 55, color: "bg-teal-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                    <div className="cc-sensor-bar-bg">
                      <div className={`cc-sensor-bar ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Warehouse PUE Radar */}
          <Card className="cc-card">
            <CardHeader className="pb-2">
              <CardTitle className="cc-card-title">
                <Warehouse className="h-4 w-4" /> Warehouse Energy Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={pueRadar}>
                    <PolarGrid className="opacity-30" />
                    <PolarAngleAxis dataKey="warehouse" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis tick={{ fontSize: 9 }} />
                    <Radar name="Energy" dataKey="energy" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                    <Radar name="Efficiency" dataKey="efficiency" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Radar name="Compliance" dataKey="compliance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
