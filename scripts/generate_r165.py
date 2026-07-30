#!/usr/bin/env python3
"""Generate Warehouse Digital Twin / IoT Dashboard module for R165."""

tsx_content = r'''"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  Building2, Search, TrendingUp, TrendingDown, Target,
  AlertTriangle, CheckCircle2, XCircle, Package,
  Truck, ChevronLeft, ChevronRight, Eye, BarChart3,
  ArrowUpRight, ArrowDownRight, Download, RefreshCw,
  Filter, Calendar, MapPin, QrCode, Smartphone,
  Monitor, Key, Clock, Timer, Users, IndianRupee,
  Settings, Shield, Wifi, WifiOff,
  Camera, CreditCard, Bell, Star,
  CircleDot, ArrowRight, Percent, Gauge, Layers,
  Warehouse, Thermometer, Droplets, Wind,
  Activity, Zap, Gauge as GaugeIcon, Radio,
  Cpu, HardDrive, Server, Database,
  ChevronDown, ChevronUp, Maximize2,
  Grid3X3, RadioTower, Bluetooth,
  Sun, Moon, CloudRain, CloudLightning,
  Fan, AirVent, Snowflake, Flame,
  BatteryCharging, BatteryFull, BatteryLow, BatteryMedium,
  ScanLine, Fingerprint,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
type SensorType = "temperature" | "humidity" | "co2" | "motion" | "vibration" | "weight" | "light" | "air_quality";
type SensorStatus = "online" | "offline" | "warning" | "critical" | "calibrating";
type ZoneType = "ambient" | "cold" | "frozen" | "hazardous" | "high_value" | "receiving" | "shipping";
type EquipmentType = "forklift" | "conveyor" | "racking" | "dock_leveler" | "stretch_wrapper" | "pallet_jack" | "scanner" | "printer";
type EquipmentStatus = "running" | "idle" | "maintenance" | "fault" | "offline";
type AlertSeverity = "critical" | "warning" | "info";

interface WarehouseZone {
  id: string;
  name: string;
  warehouseId: string;
  warehouseName: string;
  city: string;
  type: ZoneType;
  areaSqM: number;
  capacityUtilization: number;
  currentTemp: number;
  targetTemp: number;
  currentHumidity: number;
  targetHumidity: number;
  co2Level: number;
  airQualityIndex: number;
  occupancy: number;
  maxOccupancy: number;
  activeSensors: number;
  totalSensors: number;
  lastScanTime: string;
}

interface IoTSensor {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  warehouseName: string;
  type: SensorType;
  status: SensorStatus;
  value: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  batteryLevel: number;
  signalStrength: number;
  lastReading: string;
  firmwareVersion: string;
  protocol: string;
}

interface WarehouseEquipment {
  id: string;
  name: string;
  warehouseId: string;
  warehouseName: string;
  type: EquipmentType;
  status: EquipmentStatus;
  utilizationPct: number;
  operatingHours: number;
  totalRuntimeHours: number;
  tempReading: number;
  vibrationReading: number;
  lastMaintenance: string;
  nextMaintenance: string;
  energyConsumptionKwh: number;
  operatorName: string | null;
}

interface TwinAlert {
  id: string;
  severity: AlertSeverity;
  type: string;
  message: string;
  source: string;
  zone: string | null;
  sensorId: string | null;
  timestamp: string;
  acknowledged: boolean;
  value: number;
  threshold: number;
  unit: string;
}

interface EnergyReading {
  hour: string;
  solar: number;
  grid: number;
  generator: number;
  total: number;
  savings: number;
}

interface ZonePerformance {
  zone: string;
  efficiency: number;
  throughput: number;
  accuracy: number;
  safety: number;
  utilization: number;
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
  const rand = seededRandom(165165);
  const ri = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
  const rf = (min: number, max: number) => rand() * (max - min) + min;
  const pick = <T,>(arr: T[]): T => arr[ri(0, arr.length - 1)];

  const allSensorTypes: SensorType[] = ["temperature", "humidity", "co2", "motion", "vibration", "weight", "light", "air_quality"];
  const allSensorStatuses: SensorStatus[] = ["online", "offline", "warning", "critical", "calibrating"];
  const allZoneTypes: ZoneType[] = ["ambient", "cold", "frozen", "hazardous", "high_value", "receiving", "shipping"];
  const allEquipmentTypes: EquipmentType[] = ["forklift", "conveyor", "racking", "dock_leveler", "stretch_wrapper", "pallet_jack", "scanner", "printer"];
  const allEquipmentStatuses: EquipmentStatus[] = ["running", "idle", "maintenance", "fault", "offline"];
  const allSeverities: AlertSeverity[] = ["critical", "warning", "info"];

  const warehouses = [
    { id: "WH-001", name: "Delhi NCR Hub", city: "Delhi" },
    { id: "WH-002", name: "Mumbai Central", city: "Mumbai" },
    { id: "WH-003", name: "Bengaluru South", city: "Bengaluru" },
    { id: "WH-004", name: "Chennai East", city: "Chennai" },
    { id: "WH-005", name: "Hyderabad West", city: "Hyderabad" },
    { id: "WH-006", name: "Pune Logistics Park", city: "Pune" },
    { id: "WH-007", name: "Kolkata Distribution", city: "Kolkata" },
    { id: "WH-008", name: "Jaipur Warehouse", city: "Jaipur" },
  ];

  const zoneTypeTargets: Record<ZoneType, { temp: [number, number]; humidity: [number, number] }> = {
    ambient: { temp: [22, 28], humidity: [40, 60] },
    cold: { temp: [2, 8], humidity: [30, 50] },
    frozen: { temp: [-25, -18], humidity: [20, 35] },
    hazardous: { temp: [18, 25], humidity: [30, 45] },
    high_value: { temp: [20, 24], humidity: [35, 50] },
    receiving: { temp: [25, 35], humidity: [45, 65] },
    shipping: { temp: [24, 32], humidity: [40, 60] },
  };

  const zoneNames: Record<ZoneType, string[]> = {
    ambient: ["General Storage A", "General Storage B", "Bulk Storage", "Picking Zone Alpha", "Picking Zone Beta", "Staging Area"],
    cold: ["Cold Room 1", "Cold Room 2", "Pharma Storage", "Dairy Zone", "Produce Section"],
    frozen: ["Deep Freeze A", "Deep Freeze B", "Ice Cream Vault", "Frozen Prep"],
    hazardous: ["Hazmat Zone A", "Hazmat Zone B", "Chemical Storage"],
    high_value: ["Secure Vault", "High-Value Cage", "Electronics Bay", "Liquor Section"],
    receiving: ["Dock Receiving", "Inbound QC", "Unpacking Bay", "Grading Area"],
    shipping: ["Outbound Staging", "Dispatch Bay", "Vehicle Loading", "Packaging Line"],
  };

  // Generate 30 zones
  const zones: WarehouseZone[] = [];
  for (let i = 0; i < 30; i++) {
    const wh = warehouses[i % warehouses.length];
    const types = allZoneTypes;
    const zType = types[i % types.length];
    const targets = zoneTypeTargets[zType];
    const tempRange = targets.temp;
    const humRange = targets.humidity;
    const namePool = zoneNames[zType];
    const zName = `${namePool[i % namePool.length]} - ${wh.city}`;
    const temp = rf(tempRange[0], tempRange[1]);
    const hum = rf(humRange[0], humRange[1]);
    zones.push({
      id: `ZN-${String(i + 1).padStart(3, "0")}`,
      name: zName,
      warehouseId: wh.id,
      warehouseName: wh.name,
      city: wh.city,
      type: zType,
      areaSqM: ri(200, 2000),
      capacityUtilization: Math.round(rf(40, 95)),
      currentTemp: Number(temp.toFixed(1)),
      targetTemp: Number(((tempRange[0] + tempRange[1]) / 2).toFixed(1)),
      currentHumidity: Number(hum.toFixed(1)),
      targetHumidity: Number(((humRange[0] + humRange[1]) / 2).toFixed(1)),
      co2Level: Math.round(rf(350, 1200)),
      airQualityIndex: ri(20, 150),
      occupancy: ri(2, 45),
      maxOccupancy: ri(30, 50),
      activeSensors: ri(4, 12),
      totalSensors: ri(6, 16),
      lastScanTime: new Date(Date.now() - ri(0, 300000)).toISOString(),
    });
  }

  // Generate 200 IoT sensors
  const sensors: IoTSensor[] = [];
  const sensorUnits: Record<SensorType, string> = {
    temperature: "\u00b0C", humidity: "%", co2: "ppm", motion: "events/min",
    vibration: "mm/s", weight: "kg", light: "lux", air_quality: "AQI",
  };
  const sensorThresholds: Record<SensorType, [number, number]> = {
    temperature: [10, 40], humidity: [20, 80], co2: [400, 1000],
    motion: [0, 200], vibration: [0, 15], weight: [0, 5000],
    light: [100, 1000], air_quality: [0, 200],
  };
  for (let i = 0; i < 200; i++) {
    const zone = pick(zones);
    const sType = pick(allSensorTypes);
    const thresholds = sensorThresholds[sType];
    const value = rf(thresholds[0], thresholds[1]);
    const isAbnormal = value < thresholds[0] || value > thresholds[1] * 0.9;
    sensors.push({
      id: `SNS-${String(i + 1).padStart(4, "0")}`,
      name: `${zone.name.split(" - ")[0]} ${sType.charAt(0).toUpperCase() + sType.slice(1)} Sensor ${ri(1, 99)}`,
      zoneId: zone.id,
      zoneName: zone.name,
      warehouseName: zone.warehouseName,
      type: sType,
      status: isAbnormal ? (rand() > 0.5 ? "warning" : "critical") : (rand() > 0.9 ? pick(["offline", "calibrating"] as SensorStatus[]) : "online"),
      value: Number(value.toFixed(1)),
      unit: sensorUnits[sType],
      minThreshold: thresholds[0],
      maxThreshold: thresholds[1],
      batteryLevel: rand() > 0.15 ? ri(30, 100) : ri(5, 25),
      signalStrength: rand() > 0.1 ? ri(60, 100) : ri(20, 55),
      lastReading: new Date(Date.now() - ri(0, 600000)).toISOString(),
      firmwareVersion: pick(["v3.1.2", "v3.2.0", "v4.0.1", "v4.1.0"]),
      protocol: pick(["MQTT", "Zigbee", "LoRaWAN", "BLE 5.0", "WiFi 6", "NB-IoT"]),
    });
  }

  // Generate 80 equipment
  const operators = [
    "Rajesh Kumar", "Suresh Yadav", "Manoj Singh", "Deepak Verma", "Anil Sharma",
    "Prakash Gupta", "Vijay Reddy", "Senthil Murugan", "Arun Das", "Kiran Patil",
    "Ramesh Iyer", "Ganesh Naik", "Ashok Jha", "Pradeep Menon", "Sunil Kulkarni",
  ];

  const equipment: WarehouseEquipment[] = [];
  for (let i = 0; i < 80; i++) {
    const wh = warehouses[i % warehouses.length];
    const eType = allEquipmentTypes[i % allEquipmentTypes.length];
    const status = rand() > 0.85 ? pick(allEquipmentStatuses.slice(2)) : (rand() > 0.4 ? "running" : "idle");
    const runtimeBase: Record<EquipmentType, number> = {
      forklift: 8000, conveyor: 15000, racking: 25000, dock_leveler: 12000,
      stretch_wrapper: 10000, pallet_jack: 6000, scanner: 3000, printer: 5000,
    };
    equipment.push({
      id: `EQ-${String(i + 1).padStart(3, "0")}`,
      name: `${wh.city} ${eType.replace(/_/g, " ")} ${String(i + 1).padStart(3, "0")}`,
      warehouseId: wh.id,
      warehouseName: wh.name,
      type: eType,
      status,
      utilizationPct: Math.round(rf(20, 95)),
      operatingHours: ri(0, 12),
      totalRuntimeHours: runtimeBase[eType] + ri(0, 5000),
      tempReading: Number(rf(25, 65).toFixed(1)),
      vibrationReading: Number(rf(0.5, 8).toFixed(2)),
      lastMaintenance: `2026-${String(ri(1, 6)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      nextMaintenance: `2026-${String(ri(7, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      energyConsumptionKwh: Math.round(rf(0.5, 25)),
      operatorName: status === "running" ? pick(operators) : null,
    });
  }

  // Energy readings (24h)
  const energyReadings: EnergyReading[] = [];
  for (let h = 0; h < 24; h++) {
    const gridBase = h >= 9 && h <= 20 ? ri(200, 400) : ri(80, 200);
    const solarPeak = (h >= 7 && h <= 17) ? Math.round(150 * Math.sin(Math.PI * (h - 7) / 10)) : 0;
    const gen = h >= 18 && h <= 22 ? ri(30, 80) : 0;
    energyReadings.push({
      hour: `${String(h).padStart(2, "0")}:00`,
      solar: solarPeak + ri(-10, 10),
      grid: gridBase,
      generator: gen,
      total: gridBase + solarPeak + gen,
      savings: solarPeak > 0 ? Math.round(solarPeak * rf(7, 9) / 10) : 0,
    });
  }

  // Zone performance
  const zonePerformance: ZonePerformance[] = zones.slice(0, 10).map(z => ({
    zone: z.name.split(" - ")[0].slice(0, 16),
    efficiency: Math.round(rf(65, 98)),
    throughput: ri(80, 500),
    accuracy: Math.round(rf(92, 99.5) * 10) / 10,
    safety: Math.round(rf(80, 100)),
    utilization: z.capacityUtilization,
  }));

  // Alerts
  const alerts: TwinAlert[] = [];
  const alertTemplates = [
    { sev: "critical" as AlertSeverity, type: "Temperature Exceedance", msg: "Zone temperature 8\u00b0C above threshold", val: 43, thresh: 35, unit: "\u00b0C" },
    { sev: "critical" as AlertSeverity, type: "Sensor Offline", msg: "Critical sensor disconnected from network", val: 0, thresh: 0, unit: "" },
    { sev: "warning" as AlertSeverity, type: "CO2 Level High", msg: "CO2 concentration approaching unsafe levels", val: 980, thresh: 1000, unit: "ppm" },
    { sev: "warning" as AlertSeverity, type: "Humidity Drift", msg: "Humidity 15% above target in cold storage", val: 58, thresh: 50, unit: "%" },
    { sev: "critical" as AlertSeverity, type: "Equipment Fault", msg: "Conveyor belt vibration anomaly detected", val: 12.5, thresh: 10, unit: "mm/s" },
    { sev: "info" as AlertSeverity, type: "Battery Low", msg: "3 sensors below 20% battery", val: 15, thresh: 20, unit: "%" },
    { sev: "warning" as AlertSeverity, type: "Signal Weak", msg: "Multiple sensors reporting weak connectivity", val: 35, thresh: 50, unit: "%" },
    { sev: "info" as AlertSeverity, type: "Firmware Available", msg: "New firmware v4.2.0 available for 12 sensors", val: 0, thresh: 0, unit: "" },
    { sev: "critical" as AlertSeverity, type: "Power Fluctuation", msg: "Grid voltage instability in dock area", val: 185, thresh: 200, unit: "V" },
    { sev: "warning" as AlertSeverity, type: "Occupancy Overload", msg: "Zone occupancy exceeds safety limit", val: 48, thresh: 45, unit: "persons" },
    { sev: "info" as AlertSeverity, type: "Calibration Due", msg: "8 temperature sensors due for calibration", val: 0, thresh: 0, unit: "" },
    { sev: "warning" as AlertSeverity, type: "Air Quality Degraded", msg: "AQI rising in receiving dock area", val: 135, thresh: 150, unit: "AQI" },
  ];
  for (let i = 0; i < 12; i++) {
    const at = alertTemplates[i];
    const zone = pick(zones);
    alerts.push({
      id: `ALT-${String(i + 1).padStart(3, "0")}`,
      severity: at.sev,
      type: at.type,
      message: at.msg,
      source: pick(warehouses).name,
      zone: zone.name,
      sensorId: i < 8 ? pick(sensors).id : null,
      timestamp: new Date(Date.now() - ri(0, 3600000 * ri(1, 24))).toISOString(),
      acknowledged: rand() > 0.65,
      value: at.val + ri(-5, 5),
      threshold: at.thresh,
      unit: at.unit,
    });
  }

  return {
    zones, sensors, equipment, energyReadings, zonePerformance, alerts,
    warehouses, allSensorTypes, allSensorStatuses, allZoneTypes, allEquipmentTypes,
    allEquipmentStatuses, allSeverities, operators,
    sensorUnits, sensorThresholds, zoneTypeTargets,
  };
}

// ============================================================================
// Constants
// ============================================================================
const COLORS = {
  teal: "#14b8a6", violet: "#8b5cf6", amber: "#f59e0b", emerald: "#10b981",
  rose: "#f43f5e", sky: "#0ea5e9", slate: "#64748b", indigo: "#6366f1",
  orange: "#f97316", cyan: "#06b6d4", lime: "#84cc16", red: "#ef4444",
};

const PIE_COLORS = [COLORS.teal, COLORS.violet, COLORS.amber, COLORS.emerald, COLORS.rose, COLORS.sky, COLORS.indigo, COLORS.orange];

const ZONE_TYPE_COLORS: Record<string, string> = {
  ambient: "#64748b", cold: "#0ea5e9", frozen: "#06b6d4", hazardous: "#ef4444",
  high_value: "#f59e0b", receiving: "#8b5cf6", shipping: "#10b981",
};

const ZONE_TYPE_LABELS: Record<string, string> = {
  ambient: "Ambient", cold: "Cold", frozen: "Frozen", hazardous: "Hazmat",
  high_value: "High Value", receiving: "Receiving", shipping: "Shipping",
};

const SENSOR_TYPE_LABELS: Record<string, string> = {
  temperature: "Temp", humidity: "Humidity", co2: "CO2", motion: "Motion",
  vibration: "Vibration", weight: "Weight", light: "Light", air_quality: "Air Quality",
};

const SENSOR_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  temperature: Thermometer, humidity: Droplets, co2: Wind, motion: Activity,
  vibration: Radio, weight: Package, light: Sun, air_quality: AirVent,
};

const EQUIP_TYPE_LABELS: Record<string, string> = {
  forklift: "Forklift", conveyor: "Conveyor", racking: "Racking", dock_leveler: "Dock Leveler",
  stretch_wrapper: "Stretch Wrapper", pallet_jack: "Pallet Jack", scanner: "Scanner", printer: "Printer",
};

const STATUS_COLORS: Record<string, string> = {
  online: "#10b981", offline: "#ef4444", warning: "#f59e0b", critical: "#f43f5e", calibrating: "#6366f1",
  running: "#10b981", idle: "#64748b", maintenance: "#f59e0b", fault: "#ef4444",
};

const SEVERITY_COLORS: Record<string, string> = { critical: "#ef4444", warning: "#f59e0b", info: "#06b6d4" };

// ============================================================================
// Main Component
// ============================================================================
export default function WarehouseDigitalTwinView() {
  const data = useMemo(() => generateData(), []);

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Digital Twin Dashboard", "Zone Monitoring", "Sensor Fleet", "Equipment Health", "Energy & Alerts"];

  // Simulated live clock
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString("en-IN"));
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date().toLocaleTimeString("en-IN")), 1000);
    return () => clearInterval(t);
  }, []);

  // Shared filters
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [zoneTypeFilter, setZoneTypeFilter] = useState("all");

  // Tab 2: zone filter
  const [zoneSearchFilter, setZoneSearchFilter] = useState("all");

  // Tab 3: sensor filters
  const [sensorTypeFilter, setSensorTypeFilter] = useState("all");
  const [sensorStatusFilter, setSensorStatusFilter] = useState("all");
  const [sensorPage, setSensorPage] = useState(1);
  const sensorPageSize = 35;

  // Tab 4: equipment filters
  const [equipTypeFilter, setEquipTypeFilter] = useState("all");
  const [equipStatusFilter, setEquipStatusFilter] = useState("all");

  // Drawers
  const [selectedZone, setSelectedZone] = useState<WarehouseZone | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<IoTSensor | null>(null);
  const [selectedEquip, setSelectedEquip] = useState<WarehouseEquipment | null>(null);

  // Computed
  const filteredSensors = useMemo(() => {
    let r = [...data.sensors];
    if (sensorTypeFilter !== "all") r = r.filter(s => s.type === sensorTypeFilter);
    if (sensorStatusFilter !== "all") r = r.filter(s => s.status === sensorStatusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.zoneName.toLowerCase().includes(q) || s.warehouseName.toLowerCase().includes(q));
    }
    return r;
  }, [data.sensors, sensorTypeFilter, sensorStatusFilter, searchQuery]);

  const paginatedSensors = useMemo(() => {
    const start = (sensorPage - 1) * sensorPageSize;
    return filteredSensors.slice(start, start + sensorPageSize);
  }, [filteredSensors, sensorPage]);

  const sensorTotalPages = Math.ceil(filteredSensors.length / sensorPageSize);

  const filteredEquipment = useMemo(() => {
    let r = [...data.equipment];
    if (equipTypeFilter !== "all") r = r.filter(e => e.type === equipTypeFilter);
    if (equipStatusFilter !== "all") r = r.filter(e => e.status === equipStatusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(e => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.warehouseName.toLowerCase().includes(q) || (e.operatorName && e.operatorName.toLowerCase().includes(q)));
    }
    return r;
  }, [data.equipment, equipTypeFilter, equipStatusFilter, searchQuery]);

  // KPIs
  const totalSensors = data.sensors.length;
  const onlineSensors = data.sensors.filter(s => s.status === "online").length;
  const criticalSensors = data.sensors.filter(s => s.status === "critical").length;
  const avgZoneUtil = Math.round(data.zones.reduce((s, z) => s + z.capacityUtilization, 0) / data.zones.length);
  const totalEnergy = data.energyReadings.reduce((s, e) => s + e.total, 0);
  const solarSavings = data.energyReadings.reduce((s, e) => s + e.savings, 0);
  const activeEquip = data.equipment.filter(e => e.status === "running").length;
  const totalEquip = data.equipment.length;
  const criticalAlerts = data.alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;

  // Battery helper
  const getBatteryIcon = (pct: number) => {
    if (pct > 75) return <BatteryFull size={12} />;
    if (pct > 50) return <BatteryMedium size={12} />;
    if (pct > 25) return <BatteryLow size={12} />;
    return <BatteryCharging size={12} />;
  };

  // ============================================================================
  // Tab 0: Digital Twin Dashboard
  // ============================================================================
  const renderDashboardTab = () => {
    const kpis = [
      { label: "Total Sensors", value: formatNum(totalSensors), sub: `${onlineSensors} online`, up: true, icon: <RadioTower size={18} />, color: COLORS.teal },
      { label: "Critical Sensors", value: `${criticalSensors}`, sub: "Need attention", up: false, icon: <AlertTriangle size={18} />, color: COLORS.rose },
      { label: "Active Equipment", value: `${activeEquip}/${totalEquip}`, sub: `${Math.round(activeEquip / totalEquip * 100)}% running`, up: true, icon: <HardDrive size={18} />, color: COLORS.violet },
      { label: "Avg Zone Util", value: `${avgZoneUtil}%`, sub: `${data.zones.length} zones`, up: avgZoneUtil < 85, icon: <Warehouse size={18} />, color: COLORS.amber },
      { label: "Daily Energy", value: `${formatNum(totalEnergy)} kWh`, sub: `Solar: ${formatINR(solarSavings)} saved`, up: true, icon: <Zap size={18} />, color: COLORS.emerald },
      { label: "Unack Alerts", value: `${criticalAlerts}`, sub: `of ${data.alerts.length} total`, up: criticalAlerts === 0, icon: <Bell size={18} />, color: COLORS.orange },
    ];

    return (
      <div className="wdt-dashboard">
        {/* Live header bar */}
        <div className="wdt-live-bar">
          <div className="wdt-live-indicator"><span className="wdt-live-dot"></span> Live</div>
          <span className="wdt-live-time">{liveTime}</span>
          <span className="wdt-live-zone">{data.warehouses.length} Warehouses</span>
          <span className="wdt-live-sensors">{data.sensors.length} Sensors</span>
        </div>

        <div className="wdt-kpi-row">
          {kpis.map((kpi, i) => (
            <div key={i} className="wdt-kpi-card">
              <div className="wdt-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
              <div className="wdt-kpi-content">
                <div className="wdt-kpi-label">{kpi.label}</div>
                <div className="wdt-kpi-value">{kpi.value}</div>
                <div className={`wdt-kpi-sub ${kpi.up ? "wdt-up" : "wdt-down"}`}>
                  {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  <span>{kpi.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wdt-chart-row">
          <div className="wdt-chart-card wdt-chart-wide">
            <div className="wdt-chart-title">24h Energy Consumption (kWh)</div>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={data.energyReadings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="grid" stackId="e" fill="#fde68a" stroke="#f59e0b" fillOpacity={0.6} name="Grid" />
                <Area type="monotone" dataKey="solar" stackId="e" fill="#a7f3d0" stroke="#10b981" fillOpacity={0.6} name="Solar" />
                <Area type="monotone" dataKey="generator" stackId="e" fill="#c7d2fe" stroke="#6366f1" fillOpacity={0.6} name="Generator" />
                <Line type="monotone" dataKey="total" stroke="#0f172a" name="Total" dot={false} strokeWidth={1.5} strokeDasharray="4 2" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="wdt-chart-card">
            <div className="wdt-chart-title">Sensor Type Distribution</div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.allSensorTypes.map(st => ({
                  name: SENSOR_TYPE_LABELS[st],
                  value: data.sensors.filter(s => s.type === st).length,
                }))} dataKey="value" cx="50%" cy="50%" outerRadius={85} innerRadius={50}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ strokeWidth: 1 }}>
                  {data.allSensorTypes.map((_: string, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="wdt-chart-row">
          <div className="wdt-chart-card">
            <div className="wdt-chart-title">Zone Performance Radar</div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={data.zonePerformance}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="zone" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
                <Radar name="Efficiency" dataKey="efficiency" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.2} />
                <Radar name="Safety" dataKey="safety" stroke={COLORS.violet} fill={COLORS.violet} fillOpacity={0.15} />
                <Radar name="Utilization" dataKey="utilization" stroke={COLORS.amber} fill={COLORS.amber} fillOpacity={0.1} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="wdt-chart-card">
            <div className="wdt-chart-title">Sensor Status Overview</div>
            <div className="wdt-sensor-status-grid">
              {data.allSensorStatuses.map(st => {
                const count = data.sensors.filter(s => s.status === st).length;
                const pct = Math.round(count / data.sensors.length * 100);
                return (
                  <div key={st} className="wdt-sensor-status-item">
                    <div className="wdt-ss-left">
                      <span className="wdt-ss-dot" style={{ background: STATUS_COLORS[st] }}></span>
                      <span className="wdt-ss-label">{st}</span>
                    </div>
                    <div className="wdt-ss-bar">
                      <div className="wdt-ss-fill" style={{ width: `${pct}%`, background: STATUS_COLORS[st] }}></div>
                    </div>
                    <span className="wdt-ss-count">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="wdt-chart-card">
            <div className="wdt-chart-title">Zone Type Capacity</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.allZoneTypes.map(zt => {
                const zZones = data.zones.filter(z => z.type === zt);
                return { type: ZONE_TYPE_LABELS[zt], count: zZones.length, avgUtil: Math.round(zZones.reduce((s, z) => s + z.capacityUtilization, 0) / (zZones.length || 1)) };
              }))>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="avgUtil" name="Avg Utilization %" radius={[3, 3, 0, 0]} barSize={28}>
                  {data.allZoneTypes.map((zt: ZoneType, i: number) => <Cell key={i} fill={ZONE_TYPE_COLORS[zt]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone heat strip */}
        <div className="wdt-zone-heat-section">
          <div className="wdt-chart-title">Zone Temperature Heat Map</div>
          <div className="wdt-heat-grid">
            {data.zones.slice(0, 20).map(zone => {
              const tempPct = Math.min(100, Math.max(0, ((zone.currentTemp - (-30)) / 70) * 100));
              const bgColor = tempPct > 70 ? "#fca5a5" : tempPct > 40 ? "#fde68a" : tempPct > 15 ? "#a7f3d0" : "#93c5fd";
              return (
                <div key={zone.id} className="wdt-heat-cell" style={{ background: bgColor }} onClick={() => setSelectedZone(zone)}>
                  <div className="wdt-heat-name">{zone.name.split(" - ")[0].slice(0, 14)}</div>
                  <div className="wdt-heat-temp">{zone.currentTemp}\u00b0C</div>
                  <div className="wdt-heat-type">{ZONE_TYPE_LABELS[zone.type]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // Tab 1: Zone Monitoring
  // ============================================================================
  const renderZoneTab = () => {
    const filteredZones = useMemo(() => {
      let r = [...data.zones];
      if (warehouseFilter !== "all") r = r.filter(z => z.warehouseId === warehouseFilter);
      if (zoneTypeFilter !== "all") r = r.filter(z => z.type === zoneTypeFilter);
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        r = r.filter(z => z.name.toLowerCase().includes(q) || z.warehouseName.toLowerCase().includes(q) || z.city.toLowerCase().includes(q));
      }
      return r;
    }, [data.zones, warehouseFilter, zoneTypeFilter, searchQuery]);
    void zoneSearchFilter;

    return (
      <div className="wdt-zone-tab">
        <div className="wdt-filter-row">
          <div className="wdt-filter-pills">
            <button className={`wdt-pill ${warehouseFilter === "all" ? "wdt-pill-active" : ""}`} onClick={() => setWarehouseFilter("all")}>All WH</button>
            {data.warehouses.map(w => (
              <button key={w.id} className={`wdt-pill ${warehouseFilter === w.id ? "wdt-pill-active" : ""}`} onClick={() => setWarehouseFilter(w.id)}>{w.city}</button>
            ))}
          </div>
          <div className="wdt-filter-pills">
            <button className={`wdt-pill ${zoneTypeFilter === "all" ? "wdt-pill-active" : ""}`} onClick={() => setZoneTypeFilter("all")}>All Types</button>
            {data.allZoneTypes.map(zt => (
              <button key={zt} className={`wdt-pill ${zoneTypeFilter === zt ? "wdt-pill-active" : ""}`} onClick={() => setZoneTypeFilter(zt)}>{ZONE_TYPE_LABELS[zt]}</button>
            ))}
          </div>
        </div>
        <span className="wdt-count-badge">{filteredZones.length} zones</span>

        <div className="wdt-zone-grid">
          {filteredZones.map(zone => {
            const tempOk = Math.abs(zone.currentTemp - zone.targetTemp) < 3;
            const humOk = Math.abs(zone.currentHumidity - zone.targetHumidity) < 8;
            return (
              <div key={zone.id} className={`wdt-zone-card ${!tempOk ? "wdt-temp-alert" : ""} ${!humOk ? "wdt-hum-alert" : ""}`} onClick={() => setSelectedZone(zone)}>
                <div className="wdt-zone-card-header">
                  <span className="wdt-zone-type-dot" style={{ background: ZONE_TYPE_COLORS[zone.type] }}></span>
                  <div className="wdt-zone-card-title">
                    <div className="wdt-zone-name">{zone.name.split(" - ")[0]}</div>
                    <div className="wdt-zone-warehouse">{zone.warehouseName} &middot; {zone.city}</div>
                  </div>
                  <span className="wdt-zone-type-badge" style={{ background: `${ZONE_TYPE_COLORS[zone.type]}20`, color: ZONE_TYPE_COLORS[zone.type] }}>{ZONE_TYPE_LABELS[zone.type]}</span>
                </div>
                <div className="wdt-zone-metrics">
                  <div className="wdt-zone-metric">
                    <div className="wdt-zm-label"><Thermometer size={11} /> Temp</div>
                    <div className={`wdt-zm-value ${!tempOk ? "wdt-alert-val" : ""}`}>{zone.currentTemp}\u00b0C</div>
                    <div className="wdt-zm-target">Target: {zone.targetTemp}\u00b0C</div>
                  </div>
                  <div className="wdt-zone-metric">
                    <div className="wdt-zm-label"><Droplets size={11} /> Humidity</div>
                    <div className={`wdt-zm-value ${!humOk ? "wdt-alert-val" : ""}`}>{zone.currentHumidity}%</div>
                    <div className="wdt-zm-target">Target: {zone.targetHumidity}%</div>
                  </div>
                  <div className="wdt-zone-metric">
                    <div className="wdt-zm-label"><Wind size={11} /> CO2</div>
                    <div className={`wdt-zm-value ${zone.co2Level > 1000 ? "wdt-alert-val" : ""}`}>{zone.co2Level} ppm</div>
                    <div className="wdt-zm-target">Limit: 1000</div>
                  </div>
                  <div className="wdt-zone-metric">
                    <div className="wdt-zm-label"><AirVent size={11} /> AQI</div>
                    <div className={`wdt-zm-value ${zone.airQualityIndex > 100 ? "wdt-alert-val" : ""}`}>{zone.airQualityIndex}</div>
                    <div className="wdt-zm-target">{zone.airQualityIndex < 50 ? "Good" : zone.airQualityIndex < 100 ? "Moderate" : "Unhealthy"}</div>
                  </div>
                </div>
                <div className="wdt-zone-bottom">
                  <div className="wdt-zone-util">
                    <span>Utilization</span>
                    <div className="wdt-util-bar"><div className="wdt-util-fill" style={{ width: `${zone.capacityUtilization}%`, background: zone.capacityUtilization > 90 ? COLORS.rose : zone.capacityUtilization > 75 ? COLORS.amber : COLORS.teal }}></div></div>
                    <span>{zone.capacityUtilization}%</span>
                  </div>
                  <div className="wdt-zone-occupancy">
                    <span>Occupancy: {zone.occupancy}/{zone.maxOccupancy}</span>
                    <span>Sensors: {zone.activeSensors}/{zone.totalSensors}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedZone && (
          <div className="wdt-drawer-overlay" onClick={() => setSelectedZone(null)}>
            <div className="wdt-drawer" onClick={e => e.stopPropagation()}>
              <div className="wdt-drawer-header" style={{ background: `linear-gradient(135deg, ${ZONE_TYPE_COLORS[selectedZone.type]}, ${COLORS.teal})` }}>
                <div className="wdt-drawer-title-row">
                  <Warehouse size={20} />
                  <div>
                    <div className="wdt-drawer-title">{selectedZone.name}</div>
                    <div className="wdt-drawer-subtitle">{selectedZone.warehouseName} &middot; {selectedZone.city}</div>
                  </div>
                  <button className="wdt-drawer-close" onClick={() => setSelectedZone(null)}><ChevronLeft size={20} /></button>
                </div>
              </div>
              <div className="wdt-drawer-body">
                <div className="wdt-drawer-info-grid">
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Type</span><span className="wdt-drawer-value">{ZONE_TYPE_LABELS[selectedZone.type]}</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Area</span><span className="wdt-drawer-value">{selectedZone.areaSqM} m\u00b2</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Utilization</span><span className="wdt-drawer-value" style={{ color: selectedZone.capacityUtilization > 90 ? COLORS.rose : COLORS.teal }}>{selectedZone.capacityUtilization}%</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Occupancy</span><span className="wdt-drawer-value">{selectedZone.occupancy}/{selectedZone.maxOccupancy}</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Sensors</span><span className="wdt-drawer-value">{selectedZone.activeSensors}/{selectedZone.totalSensors} active</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Last Scan</span><span className="wdt-drawer-value">{new Date(selectedZone.lastScanTime).toLocaleTimeString("en-IN")}</span></div>
                </div>

                <div className="wdt-drawer-section-title">Environmental Readings</div>
                <div className="wdt-drawer-env-grid">
                  <div className="wdt-env-card">
                    <Thermometer size={16} className="wdt-env-icon" style={{ color: COLORS.rose }} />
                    <div className="wdt-env-label">Temperature</div>
                    <div className="wdt-env-value">{selectedZone.currentTemp}\u00b0C</div>
                    <div className="wdt-env-target">Target: {selectedZone.targetTemp}\u00b0C</div>
                  </div>
                  <div className="wdt-env-card">
                    <Droplets size={16} className="wdt-env-icon" style={{ color: COLORS.sky }} />
                    <div className="wdt-env-label">Humidity</div>
                    <div className="wdt-env-value">{selectedZone.currentHumidity}%</div>
                    <div className="wdt-env-target">Target: {selectedZone.targetHumidity}%</div>
                  </div>
                  <div className="wdt-env-card">
                    <Wind size={16} className="wdt-env-icon" style={{ color: COLORS.violet }} />
                    <div className="wdt-env-label">CO2</div>
                    <div className="wdt-env-value">{selectedZone.co2Level} ppm</div>
                    <div className="wdt-env-target">Limit: 1000 ppm</div>
                  </div>
                  <div className="wdt-env-card">
                    <AirVent size={16} className="wdt-env-icon" style={{ color: COLORS.emerald }} />
                    <div className="wdt-env-label">Air Quality</div>
                    <div className="wdt-env-value">{selectedZone.airQualityIndex} AQI</div>
                    <div className="wdt-env-target">{selectedZone.airQualityIndex < 50 ? "Good" : "Moderate"}</div>
                  </div>
                </div>

                <div className="wdt-drawer-section-title">Sensors in Zone</div>
                <div className="wdt-zone-sensors-mini">
                  {data.sensors.filter(s => s.zoneId === selectedZone.id).slice(0, 6).map(sensor => {
                    const SensorIcon = SENSOR_TYPE_ICONS[sensor.type] || Radio;
                    return (
                      <div key={sensor.id} className="wdt-zone-sensor-mini" onClick={() => { setSelectedZone(null); setSelectedSensor(sensor); }}>
                        <SensorIcon size={12} />
                        <span className="wdt-zsm-name">{SENSOR_TYPE_LABELS[sensor.type]}</span>
                        <span className="wdt-zsm-value">{sensor.value}{sensor.unit}</span>
                        <span className={`wdt-zsm-status wdt-ss-${sensor.status}`}><span className="wdt-ss-dot" style={{ background: STATUS_COLORS[sensor.status] }}></span></span>
                      </div>
                    );
                  })}
                </div>

                <div className="wdt-drawer-actions">
                  <button className="wdt-action-btn wdt-primary"><Eye size={14} /> Digital Twin</button>
                  <button className="wdt-action-btn"><Download size={14} /> Export Data</button>
                  <button className="wdt-action-btn"><RefreshCw size={14} /> Refresh</button>
                  <button className="wdt-action-btn"><Settings size={14} /> Configure</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // Tab 2: Sensor Fleet
  // ============================================================================
  const renderSensorTab = () => (
    <div className="wdt-sensor-tab">
      <div className="wdt-txn-quick-stats">
        <div className="wdt-txn-stat-pill"><span className="wdt-txn-stat-dot" style={{ background: COLORS.teal }}></span> Online: <strong>{data.sensors.filter(s => s.status === "online").length}</strong></div>
        <div className="wdt-txn-stat-pill"><span className="wdt-txn-stat-dot" style={{ background: COLORS.amber }}></span> Warning: <strong>{data.sensors.filter(s => s.status === "warning").length}</strong></div>
        <div className="wdt-txn-stat-pill"><span className="wdt-txn-stat-dot" style={{ background: COLORS.rose }}></span> Critical: <strong>{data.sensors.filter(s => s.status === "critical").length}</strong></div>
        <div className="wdt-txn-stat-pill"><span className="wdt-txn-stat-dot" style={{ background: COLORS.slate }}></span> Offline: <strong>{data.sensors.filter(s => s.status === "offline").length}</strong></div>
      </div>

      <div className="wdt-filter-row">
        <div className="wdt-filter-pills">
          <button className={`wdt-pill ${sensorTypeFilter === "all" ? "wdt-pill-active" : ""}`} onClick={() => { setSensorTypeFilter("all"); setSensorPage(1); }}>All Types</button>
          {data.allSensorTypes.map(st => (
            <button key={st} className={`wdt-pill ${sensorTypeFilter === st ? "wdt-pill-active" : ""}`} onClick={() => { setSensorTypeFilter(st); setSensorPage(1); }}>{SENSOR_TYPE_LABELS[st]}</button>
          ))}
        </div>
        <div className="wdt-filter-pills">
          <button className={`wdt-pill ${sensorStatusFilter === "all" ? "wdt-pill-active" : ""}`} onClick={() => { setSensorStatusFilter("all"); setSensorPage(1); }}>All Status</button>
          {data.allSensorStatuses.map(ss => (
            <button key={ss} className={`wdt-pill ${sensorStatusFilter === ss ? "wdt-pill-active" : ""}`} onClick={() => { setSensorStatusFilter(ss); setSensorPage(1); }}>{ss}</button>
          ))}
        </div>
      </div>

      <div className="wdt-txn-meta-row">
        <span className="wdt-count-badge">{filteredSensors.length} sensors</span>
        <span className="wdt-page-info">Page {sensorPage} of {sensorTotalPages}</span>
      </div>

      <div className="wdt-txn-table-wrap">
        <table className="wdt-txn-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sensor</th>
              <th>Type</th>
              <th>Status</th>
              <th>Value</th>
              <th>Zone</th>
              <th>Warehouse</th>
              <th>Battery</th>
              <th>Signal</th>
              <th>Protocol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedSensors.map(sensor => {
              const SensorIcon = SENSOR_TYPE_ICONS[sensor.type] || Radio;
              return (
                <tr key={sensor.id} className={sensor.status === "critical" ? "wdt-critical-row" : sensor.status === "warning" ? "wdt-warning-row" : ""}>
                  <td className="wdt-txn-id">{sensor.id}</td>
                  <td><div className="wdt-sensor-name-cell"><SensorIcon size={13} className="wdt-sensor-type-icon" /> <span>{sensor.name.slice(0, 28)}</span></div></td>
                  <td><span className="wdt-sensor-type-badge">{SENSOR_TYPE_LABELS[sensor.type]}</span></td>
                  <td><span className="wdt-status-badge" style={{ background: `${STATUS_COLORS[sensor.status]}20`, color: STATUS_COLORS[sensor.status] }}>{sensor.status}</span></td>
                  <td><span className={`wdt-sensor-value ${sensor.status !== "online" ? "wdt-alert-val" : ""}`}>{sensor.value}{sensor.unit}</span></td>
                  <td><div className="wdt-txn-locker">{sensor.zoneName.split(" - ")[0].slice(0, 16)}</div></td>
                  <td><span className="wdt-warehouse-mini">{sensor.warehouseName.split(" ").slice(0, 2).join(" ")}</span></td>
                  <td><div className="wdt-battery-cell">{getBatteryIcon(sensor.batteryLevel)} <span style={{ color: sensor.batteryLevel < 20 ? COLORS.rose : COLORS.slate }}>{sensor.batteryLevel}%</span></div></td>
                  <td><div className="wdt-signal-cell"><Wifi size={11} style={{ color: sensor.signalStrength > 60 ? COLORS.teal : COLORS.rose }} /> {sensor.signalStrength}%</div></td>
                  <td><span className="wdt-protocol-badge">{sensor.protocol}</span></td>
                  <td><button className="wdt-view-btn" onClick={() => setSelectedSensor(sensor)}><Eye size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="wdt-pagination">
        <button className="wdt-page-btn" disabled={sensorPage <= 1} onClick={() => setSensorPage(p => p - 1)}><ChevronLeft size={14} /></button>
        {Array.from({ length: Math.min(5, sensorTotalPages) }, (_, i) => {
          let pn: number;
          if (sensorTotalPages <= 5) pn = i + 1;
          else if (sensorPage <= 3) pn = i + 1;
          else if (sensorPage >= sensorTotalPages - 2) pn = sensorTotalPages - 4 + i;
          else pn = sensorPage - 2 + i;
          return <button key={pn} className={`wdt-page-btn wdt-page-num ${sensorPage === pn ? "wdt-page-active" : ""}`} onClick={() => setSensorPage(pn)}>{pn}</button>;
        })}
        {sensorTotalPages > 5 && sensorPage < sensorTotalPages - 2 && <span className="wdt-page-dots">...</span>}
        <button className="wdt-page-btn" disabled={sensorPage >= sensorTotalPages} onClick={() => setSensorPage(p => p + 1)}><ChevronRight size={14} /></button>
      </div>

      {selectedSensor && (
        <div className="wdt-drawer-overlay" onClick={() => setSelectedSensor(null)}>
          <div className="wdt-drawer" onClick={e => e.stopPropagation()}>
            <div className="wdt-drawer-header" style={{ background: selectedSensor.status === "online" ? `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.cyan})` : selectedSensor.status === "critical" ? `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.amber})` : `linear-gradient(135deg, ${COLORS.amber}, ${COLORS.orange})` }}>
              <div className="wdt-drawer-title-row">
                <RadioTower size={20} />
                <div>
                  <div className="wdt-drawer-title">{selectedSensor.name}</div>
                  <div className="wdt-drawer-subtitle">{selectedSensor.id} &middot; {SENSOR_TYPE_LABELS[selectedSensor.type]}</div>
                </div>
                <button className="wdt-drawer-close" onClick={() => setSelectedSensor(null)}><ChevronLeft size={20} /></button>
              </div>
            </div>
            <div className="wdt-drawer-body">
              <div className="wdt-drawer-info-grid">
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Type</span><span className="wdt-drawer-value">{SENSOR_TYPE_LABELS[selectedSensor.type]}</span></div>
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Status</span><span className="wdt-drawer-value"><span className="wdt-status-dot" style={{ background: STATUS_COLORS[selectedSensor.status] }}></span>{selectedSensor.status}</span></div>
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Current Value</span><span className="wdt-drawer-value" style={{ fontSize: 20, fontWeight: 800 }}>{selectedSensor.value}{selectedSensor.unit}</span></div>
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Thresholds</span><span className="wdt-drawer-value">{selectedSensor.minThreshold} - {selectedSensor.maxThreshold} {selectedSensor.unit}</span></div>
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Zone</span><span className="wdt-drawer-value">{selectedSensor.zoneName.split(" - ")[0]}</span></div>
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Warehouse</span><span className="wdt-drawer-value">{selectedSensor.warehouseName}</span></div>
              </div>
              <div className="wdt-drawer-section-title">Device Info</div>
              <div className="wdt-drawer-info-grid">
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Battery</span><span className="wdt-drawer-value">{getBatteryIcon(selectedSensor.batteryLevel)} {selectedSensor.batteryLevel}%</span></div>
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Signal</span><span className="wdt-drawer-value">{selectedSensor.signalStrength}%</span></div>
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Protocol</span><span className="wdt-drawer-value">{selectedSensor.protocol}</span></div>
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Firmware</span><span className="wdt-drawer-value">{selectedSensor.firmwareVersion}</span></div>
                <div className="wdt-drawer-field"><span className="wdt-drawer-label">Last Reading</span><span className="wdt-drawer-value">{new Date(selectedSensor.lastReading).toLocaleString("en-IN")}</span></div>
              </div>
              <div className="wdt-drawer-actions">
                <button className="wdt-action-btn wdt-primary"><Eye size={14} /> Live Feed</button>
                <button className="wdt-action-btn"><RefreshCw size={14} /> Calibrate</button>
                <button className="wdt-action-btn"><Download size={14} /> Export</button>
                <button className="wdt-action-btn"><Settings size={14} /> Config</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // Tab 3: Equipment Health
  // ============================================================================
  const renderEquipmentTab = () => {
    const running = data.equipment.filter(e => e.status === "running").length;
    const idle = data.equipment.filter(e => e.status === "idle").length;
    const maint = data.equipment.filter(e => e.status === "maintenance").length;
    const fault = data.equipment.filter(e => e.status === "fault").length;
    const totalEnergyEquip = data.equipment.reduce((s, e) => s + e.energyConsumptionKwh, 0);

    const equipKpis = [
      { label: "Running", value: `${running}`, color: COLORS.emerald },
      { label: "Idle", value: `${idle}`, color: COLORS.slate },
      { label: "Maintenance", value: `${maint}`, color: COLORS.amber },
      { label: "Fault", value: `${fault}`, color: COLORS.rose },
      { label: "Total Energy", value: `${formatNum(totalEnergyEquip)} kWh`, color: COLORS.violet },
    ];

    return (
      <div className="wdt-equip-tab">
        <div className="wdt-kpi-row wdt-kpi-sm">
          {equipKpis.map((kpi, i) => (
            <div key={i} className="wdt-kpi-card-sm">
              <div className="wdt-kpi-label-sm">{kpi.label}</div>
              <div className="wdt-kpi-value-sm" style={{ color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="wdt-filter-row">
          <div className="wdt-filter-pills">
            <button className={`wdt-pill ${equipTypeFilter === "all" ? "wdt-pill-active" : ""}`} onClick={() => setEquipTypeFilter("all")}>All Types</button>
            {data.allEquipmentTypes.map(et => (
              <button key={et} className={`wdt-pill ${equipTypeFilter === et ? "wdt-pill-active" : ""}`} onClick={() => setEquipTypeFilter(et)}>{EQUIP_TYPE_LABELS[et]}</button>
            ))}
          </div>
          <div className="wdt-filter-pills">
            <button className={`wdt-pill ${equipStatusFilter === "all" ? "wdt-pill-active" : ""}`} onClick={() => setEquipStatusFilter("all")}>All Status</button>
            {data.allEquipmentStatuses.map(es => (
              <button key={es} className={`wdt-pill ${equipStatusFilter === es ? "wdt-pill-active" : ""}`} onClick={() => setEquipStatusFilter(es)}>{es}</button>
            ))}
          </div>
        </div>
        <span className="wdt-count-badge">{filteredEquipment.length} equipment</span>

        <div className="wdt-equip-grid">
          {filteredEquipment.map(equip => (
            <div key={equip.id} className={`wdt-equip-card wdt-${equip.status}`} onClick={() => setSelectedEquip(equip)}>
              <div className="wdt-equip-card-header">
                <div className="wdt-equip-name">{equip.name}</div>
                <span className="wdt-status-badge" style={{ background: `${STATUS_COLORS[equip.status]}20`, color: STATUS_COLORS[equip.status] }}>{equip.status}</span>
              </div>
              <div className="wdt-equip-meta">{equip.warehouseName} &middot; {EQUIP_TYPE_LABELS[equip.type]}</div>
              <div className="wdt-equip-stats">
                <div className="wdt-equip-stat">
                  <span className="wdt-es-label">Utilization</span>
                  <div className="wdt-es-bar"><div className="wdt-es-fill" style={{ width: `${equip.utilizationPct}%`, background: equip.utilizationPct > 85 ? COLORS.rose : equip.utilizationPct > 60 ? COLORS.amber : COLORS.teal }}></div></div>
                  <span className="wdt-es-value">{equip.utilizationPct}%</span>
                </div>
                <div className="wdt-equip-stat">
                  <span className="wdt-es-label">Temp</span>
                  <span className="wdt-es-value">{equip.tempReading}\u00b0C</span>
                </div>
                <div className="wdt-equip-stat">
                  <span className="wdt-es-label">Vibration</span>
                  <span className={`wdt-es-value ${equip.vibrationReading > 8 ? "wdt-alert-val" : ""}`}>{equip.vibrationReading} mm/s</span>
                </div>
                <div className="wdt-equip-stat">
                  <span className="wdt-es-label">Energy</span>
                  <span className="wdt-es-value">{equip.energyConsumptionKwh} kWh</span>
                </div>
              </div>
              <div className="wdt-equip-footer">
                <span>Runtime: {formatNum(equip.totalRuntimeHours)}h</span>
                {equip.operatorName && <span className="wdt-operator">{equip.operatorName}</span>}
              </div>
            </div>
          ))}
        </div>

        {selectedEquip && (
          <div className="wdt-drawer-overlay" onClick={() => setSelectedEquip(null)}>
            <div className="wdt-drawer" onClick={e => e.stopPropagation()}>
              <div className="wdt-drawer-header" style={{ background: selectedEquip.status === "running" ? `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.emerald})` : selectedEquip.status === "fault" ? `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.amber})` : `linear-gradient(135deg, ${COLORS.slate}, ${COLORS.teal})` }}>
                <div className="wdt-drawer-title-row">
                  <HardDrive size={20} />
                  <div>
                    <div className="wdt-drawer-title">{selectedEquip.name}</div>
                    <div className="wdt-drawer-subtitle">{selectedEquip.id} &middot; {EQUIP_TYPE_LABELS[selectedEquip.type]}</div>
                  </div>
                  <button className="wdt-drawer-close" onClick={() => setSelectedEquip(null)}><ChevronLeft size={20} /></button>
                </div>
              </div>
              <div className="wdt-drawer-body">
                <div className="wdt-drawer-info-grid">
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Status</span><span className="wdt-drawer-value"><span className="wdt-status-dot" style={{ background: STATUS_COLORS[selectedEquip.status] }}></span>{selectedEquip.status}</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Warehouse</span><span className="wdt-drawer-value">{selectedEquip.warehouseName}</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Utilization</span><span className="wdt-drawer-value">{selectedEquip.utilizationPct}%</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Today Hours</span><span className="wdt-drawer-value">{selectedEquip.operatingHours}h</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Total Runtime</span><span className="wdt-drawer-value">{formatNum(selectedEquip.totalRuntimeHours)}h</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Energy</span><span className="wdt-drawer-value">{selectedEquip.energyConsumptionKwh} kWh</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Temperature</span><span className="wdt-drawer-value">{selectedEquip.tempReading}\u00b0C</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Vibration</span><span className="wdt-drawer-value">{selectedEquip.vibrationReading} mm/s</span></div>
                  <div className="wdt-drawer-field"><span className="wdt-drawer-label">Operator</span><span className="wdt-drawer-value">{selectedEquip.operatorName || "None"}</span></div>
                </div>
                <div className="wdt-drawer-section-title">Maintenance</div>
                <div className="wdt-drawer-timeline">
                  <div className="wdt-timeline-item"><div className="wdt-timeline-dot wdt-done"></div><div><div className="wdt-timeline-label">Last Maintenance</div><div className="wdt-timeline-date">{selectedEquip.lastMaintenance}</div></div></div>
                  <div className="wdt-timeline-item"><div className="wdt-timeline-dot wdt-pending"></div><div><div className="wdt-timeline-label">Next Scheduled</div><div className="wdt-timeline-date">{selectedEquip.nextMaintenance}</div></div></div>
                </div>
                <div className="wdt-drawer-actions">
                  <button className="wdt-action-btn wdt-primary"><Eye size={14} /> Monitor</button>
                  <button className="wdt-action-btn"><Download size={14} /> History</button>
                  <button className="wdt-action-btn"><RefreshCw size={14} /> Diagnose</button>
                  <button className="wdt-action-btn"><Settings size={14} /> Schedule</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // Tab 4: Energy & Alerts
  // ============================================================================
  const renderEnergyAlertsTab = () => {
    const critUnack = data.alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;
    const warnPending = data.alerts.filter(a => a.severity === "warning" && !a.acknowledged).length;
    const ackCount = data.alerts.filter(a => a.acknowledged).length;

    return (
      <div className="wdt-alerts-tab">
        {/* Alerts summary */}
        <div className="wdt-alert-summary">
          <div className="wdt-alert-summary-card wdt-critical"><AlertTriangle size={20} /><div><div className="wdt-alert-summary-value">{critUnack}</div><div className="wdt-alert-summary-label">Critical Unacknowledged</div></div></div>
          <div className="wdt-alert-summary-card wdt-warning"><Bell size={20} /><div><div className="wdt-alert-summary-value">{warnPending}</div><div className="wdt-alert-summary-label">Warnings Pending</div></div></div>
          <div className="wdt-alert-summary-card wdt-info"><CheckCircle2 size={20} /><div><div className="wdt-alert-summary-value">{ackCount}/{data.alerts.length}</div><div className="wdt-alert-summary-label">Acknowledged</div></div></div>
        </div>

        {/* Energy Chart */}
        <div className="wdt-chart-card" style={{ marginBottom: 16 }}>
          <div className="wdt-chart-title">24h Energy Breakdown</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.energyReadings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="solar" stackId="e" fill="#a7f3d0" stroke="#10b981" fillOpacity={0.7} name="Solar (kWh)" />
              <Area type="monotone" dataKey="grid" stackId="e" fill="#fde68a" stroke="#f59e0b" fillOpacity={0.7} name="Grid (kWh)" />
              <Area type="monotone" dataKey="generator" stackId="e" fill="#c7d2fe" stroke="#6366f1" fillOpacity={0.7} name="Generator (kWh)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alert list */}
        <div className="wdt-alert-full-list">
          {data.alerts.map((alert, i) => {
            const timeAgo = Math.floor((Date.now() - new Date(alert.timestamp).getTime()) / 60000);
            const timeStr = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ${timeAgo % 60}m ago`;
            return (
              <div key={i} className={`wdt-alert-card wdt-${alert.severity} ${alert.acknowledged ? "wdt-acknowledged" : ""}`}>
                <div className="wdt-alert-card-left">
                  <div className="wdt-alert-severity-icon" style={{ background: `${SEVERITY_COLORS[alert.severity]}20`, color: SEVERITY_COLORS[alert.severity] }}>
                    {alert.severity === "critical" ? <AlertTriangle size={18} /> : alert.severity === "warning" ? <Bell size={18} /> : <CircleDot size={18} />}
                  </div>
                  <div className="wdt-alert-card-content">
                    <div className="wdt-alert-type-row">
                      <span className="wdt-alert-type-badge" style={{ background: `${SEVERITY_COLORS[alert.severity]}15`, color: SEVERITY_COLORS[alert.severity] }}>{alert.type}</span>
                      <span className="wdt-alert-time">{timeStr}</span>
                    </div>
                    <div className="wdt-alert-message">{alert.message}</div>
                    <div className="wdt-alert-value-row">
                      <span>Value: <strong>{alert.value} {alert.unit}</strong></span>
                      <span>Threshold: <strong>{alert.threshold} {alert.unit}</strong></span>
                    </div>
                    <div className="wdt-alert-source"><MapPin size={11} /> {alert.source}{alert.zone && <span> &middot; {alert.zone.split(" - ")[0]}</span>}</div>
                  </div>
                </div>
                <div className="wdt-alert-card-right">
                  <span className={`wdt-alert-ack-status ${alert.acknowledged ? "wdt-ack" : "wdt-unack"}`}>
                    {alert.acknowledged ? <CheckCircle2 size={14} /> : <CircleDot size={14} />}
                    {alert.acknowledged ? "ACK" : "PENDING"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================================================
  // Main Render
  // ============================================================================
  return (
    <div className="wdt-root">
      <div className="wdt-header">
        <div className="wdt-header-left">
          <div className="wdt-header-icon"><Building2 size={22} /></div>
          <div>
            <h1 className="wdt-header-title">Warehouse Digital Twin &amp; IoT Dashboard</h1>
            <p className="wdt-header-subtitle">{data.warehouses.length} warehouses &middot; {data.zones.length} zones &middot; {data.sensors.length} IoT sensors &middot; {data.equipment.length} equipment</p>
          </div>
        </div>
        <div className="wdt-header-right">
          <div className="wdt-header-stat"><span className="wdt-header-stat-value">{onlineSensors}</span><span className="wdt-header-stat-label">Sensors Online</span></div>
          <div className="wdt-header-stat"><span className="wdt-header-stat-value">{activeEquip}/{totalEquip}</span><span className="wdt-header-stat-label">Equipment Active</span></div>
          <div className="wdt-header-stat wdt-live-pulse"><span className="wdt-header-stat-value">{liveTime}</span><span className="wdt-header-stat-label">Live Clock</span></div>
        </div>
      </div>

      <div className="wdt-search-bar">
        <Search size={16} className="wdt-search-icon" />
        <input type="text" className="wdt-search-input" placeholder="Search sensors, zones, equipment, warehouses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        {searchQuery && <button className="wdt-search-clear" onClick={() => setSearchQuery("")}><XCircle size={14} /></button>}
      </div>

      <div className="wdt-tabs">
        {tabs.map((tab, i) => (
          <button key={i} className={`wdt-tab ${activeTab === i ? "wdt-tab-active" : ""}`} onClick={() => setActiveTab(i)}>{tab}</button>
        ))}
      </div>

      <div className="wdt-content">
        {activeTab === 0 && renderDashboardTab()}
        {activeTab === 1 && renderZoneTab()}
        {activeTab === 2 && renderSensorTab()}
        {activeTab === 3 && renderEquipmentTab()}
        {activeTab === 4 && renderEnergyAlertsTab()}
      </div>
    </div>
  );
}
'''

with open('/home/z/my-project/src/components/modules/warehouse-digital-twin-view.tsx', 'w') as f:
    f.write(tsx_content)

print(f"Written warehouse-digital-twin-view.tsx ({len(tsx_content)} chars, ~{tsx_content.count(chr(10))+1} lines)")
